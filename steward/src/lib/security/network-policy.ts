/**
 * Politicas de red y bloqueo SSRF (U5). Previene exfiltracion a loopback,
 * metadata cloud y destinos fuera del allowlist, y revalida DNS para evitar
 * DNS rebinding (la resolucion completa debe quedar dentro del alcance).
 *
 * Autocontenido y determinista; se evalúa ANTES de conectar.
 */

const METADATA_IPS = new Set([
  "169.254.169.254", // AWS/GCP/Azure metadata
  "100.100.100.200", // Aliyun metadata
  "fd00:ec2::254",   // AWS IMDSv2 IPv6
]);

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".").map((n) => Number(n));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return null;
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function isLoopback(ip: string): boolean {
  if (ip === "::1" || ip.toLowerCase() === "::1") {
    return true;
  }
  const int = ipv4ToInt(ip);
  return int !== null && (int >>> 24) === 127;
}

export function isMetadata(ip: string): boolean {
  return METADATA_IPS.has(ip.toLowerCase());
}

export function ipInCidr(ip: string, cidr: string): boolean {
  const int = ipv4ToInt(ip);
  if (int === null) {
    return false;
  }
  const [net, prefixRaw] = cidr.split("/");
  const prefix = prefixRaw === undefined ? 32 : Number(prefixRaw);
  const netInt = ipv4ToInt(net);
  if (netInt === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    return false;
  }
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (int & mask) === (netInt & mask);
}

export interface NetworkPolicy {
  allowlist: string[]; // CIDR o IP exacta
  blockLoopback?: boolean; // default true
  blockMetadata?: boolean; // default true
}

export interface TargetDecision {
  ok: boolean;
  reason: string;
}

export type DnsResolver = (host: string) => Promise<string[]>;

export class TargetValidator {
  private policy: NetworkPolicy;
  private resolve: DnsResolver;

  constructor(policy: NetworkPolicy, resolve: DnsResolver = defaultResolve) {
    this.policy = policy;
    this.resolve = resolve;
  }

  private isBlocked(ip: string): string | null {
    if (this.policy.blockLoopback !== false && isLoopback(ip)) {
      return "loopback";
    }
    if (this.policy.blockMetadata !== false && isMetadata(ip)) {
      return "metadata cloud";
    }
    // Debe estar dentro del allowlist
    const allowed = this.policy.allowlist.some((cidr) => ipInCidr(ip, cidr));
    if (!allowed) {
      return "fuera del allowlist";
    }
    return null;
  }

  /** Valida un destino: si es IP, se chequea directo; si es host, se resuelve
   *  y TODAS sus direcciones deben quedar dentro del alcance (anti rebinding). */
  async check(host: string): Promise<TargetDecision> {
    const trimmed = host.trim();
    if (!trimmed) {
      return { ok: false, reason: "destino vacio" };
    }
    const looksLikeIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed) || trimmed === "::1";
    if (looksLikeIp) {
      const block = this.isBlocked(trimmed);
      return block ? { ok: false, reason: block } : { ok: true, reason: "ip permitida" };
    }

    // Revalidacion DNS: todas las direcciones deben ser permitidas.
    let ips: string[];
    try {
      ips = await this.resolve(trimmed);
    } catch {
      return { ok: false, reason: "resolucion DNS fallida" };
    }
    if (ips.length === 0) {
      return { ok: false, reason: "sin direcciones resueltas" };
    }
    for (const ip of ips) {
      const block = this.isBlocked(ip);
      if (block) {
        return { ok: false, reason: `dns rebinding/intento: ${ip} es ${block}` };
      }
    }
    return { ok: true, reason: "destino permitido (todas las resoluciones dentro de alcance)" };
  }
}

async function defaultResolve(host: string): Promise<string[]> {
  const { lookup } = await import("node:dns/promises");
  const res = await lookup(host, { all: true });
  return res.map((r) => r.address);
}
