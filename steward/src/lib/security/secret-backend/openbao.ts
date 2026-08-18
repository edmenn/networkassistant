/**
 * Backend OpenBao de `SecretBackend` (ADR-0003, U2).
 *
 * Usa la API HTTP de OpenBao (KV v2 en el mount por defecto) con `fetch` global.
 *  - put/rotate  -> escritura KV v2 (rotate crea version nueva).
 *  - lease       -> token de corta vida con policy de SOLO lectura del path.
 *  - get         -> lectura usando el token del lease (scope minimo).
 *  - revoke      -> revoca el token.
 *  - backup      -> cifra (AES-256-GCM) los refs con clave separada de los datos.
 *  - restore     -> descifra y re-escribe.
 *
 * Solo para laboratorio/desarrollo; no expone el valor fuera de un lease.
 */

import { randomBytes, randomUUID, createCipheriv, createDecipheriv } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";
import type { Lease, SecretBackend } from "./secret-backend.ts";

export interface OpenBaoConfig {
  addr: string;
  token: string;
  mount?: string;
}

interface LeaseEntry {
  id: string;
  ref: string;
  identity: string;
  expiresAt: number;
  token: string;
  revoked: boolean;
}

async function http(
  method: string,
  url: string,
  token: string | undefined,
  body?: unknown,
): Promise<{ status: number; data: any }> {
  const res = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { "X-Vault-Token": token } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  return { status: res.status, data };
}

export class OpenBaoSecretBackend implements SecretBackend {
  private cfg: OpenBaoConfig;
  private mount: string;
  private leases = new Map<string, LeaseEntry>();
  private refs = new Set<string>();
  private backupDir: string;
  private backupKey: Buffer;

  private constructor(cfg: OpenBaoConfig, backupDir: string, backupKey: Buffer) {
    this.cfg = cfg;
    this.mount = cfg.mount ?? "secret";
    this.backupDir = backupDir;
    this.backupKey = backupKey;
  }

  static async create(cfg: OpenBaoConfig, backupDir: string): Promise<OpenBaoSecretBackend> {
    await mkdir(backupDir, { recursive: true });
    const keyFile = path.join(backupDir, "bao-backup-key.bin");
    let key: Buffer;
    try {
      key = Buffer.from(await readFile(keyFile), "binary");
    } catch {
      key = randomBytes(32);
      await writeFile(keyFile, key, { mode: 0o600 });
    }
    return new OpenBaoSecretBackend(cfg, backupDir, key);
  }

  private dataPath(ref: string): string {
    return `${this.cfg.addr.replace(/\/$/, "")}/v1/${this.mount}/data/${ref}`;
  }

  private async readValue(ref: string, token: string): Promise<string> {
    const r = await http("GET", this.dataPath(ref), token);
    if (r.status !== 200 || !r.data?.data?.data) {
      throw new Error(`OpenBao: no se pudo leer ${ref} (${r.status})`);
    }
    return String(r.data.data.data.value);
  }

  private async writeValue(ref: string, value: string, token: string): Promise<number> {
    const r = await http("POST", this.dataPath(ref), token, { data: { value } });
    if (r.status !== 200 && r.status !== 201) {
      throw new Error(`OpenBao: no se pudo escribir ${ref} (${r.status})`);
    }
    this.refs.add(ref);
    return Number(r.data?.data?.version ?? 1);
  }

  async put(ref: string, secret: string): Promise<void> {
    if (!ref || typeof secret !== "string") {
      throw new Error("OpenBao: ref y secret obligatorios");
    }
    await this.writeValue(ref, secret, this.cfg.token);
  }

  async lease(ref: string, identity: string, ttlMs?: number): Promise<Lease> {
    // Verificar que el ref exista
    const r = await http("GET", this.dataPath(ref), this.cfg.token);
    if (r.status !== 200) {
      throw new Error(`OpenBao: no existe el ref ${ref}`);
    }
    const ttlSeconds = Math.max(1, Math.floor((ttlMs ?? 5 * 60_000) / 1000));
    const policyName = `s1-lease-${randomUUID()}`;
    const policy = `path "${this.mount}/data/${ref}" { capabilities = ["read"] }`;
    const p = await http("PUT", `${this.cfg.addr}/v1/sys/policies/acl/${policyName}`, this.cfg.token, { policy });
    if (p.status !== 204 && p.status !== 200) {
      throw new Error(`OpenBao: fallo policy (${p.status})`);
    }
    const t = await http("POST", `${this.cfg.addr}/v1/auth/token/create`, this.cfg.token, {
      policies: [policyName],
      ttl: `${ttlSeconds}s`,
      renewable: false,
      num_uses: 2,
      display_name: identity,
      metadata: { ref },
    });
    if (t.status !== 200 || !t.data?.auth?.client_token) {
      throw new Error(`OpenBao: fallo token (${t.status})`);
    }
    const entry: LeaseEntry = {
      id: randomUUID(),
      ref,
      identity,
      expiresAt: Date.now() + ttlSeconds * 1000,
      token: t.data.auth.client_token,
      revoked: false,
    };
    this.leases.set(entry.id, entry);
    return { id: entry.id, ref, identity, expiresAt: entry.expiresAt, revoked: false };
  }

  async get(leaseId: string, identity: string): Promise<string> {
    const lease = this.leases.get(leaseId);
    if (!lease || lease.revoked || lease.identity !== identity) {
      throw new Error("OpenBao: lease invalido o no autorizado");
    }
    if (Date.now() > lease.expiresAt) {
      this.leases.delete(leaseId);
      throw new Error("OpenBao: lease vencido");
    }
    return this.readValue(lease.ref, lease.token);
  }

  async revoke(leaseId: string): Promise<void> {
    const lease = this.leases.get(leaseId);
    if (!lease) {
      return;
    }
    await http("POST", `${this.cfg.addr}/v1/auth/token/revoke`, this.cfg.token, { token: lease.token }).catch(() => undefined);
    lease.revoked = true;
  }

  /** Rota creando una version nueva del secreto (KV v2 versiona). */
  async rotate(ref: string): Promise<void> {
    const value = await this.readValue(ref, this.cfg.token);
    await this.writeValue(ref, value, this.cfg.token);
  }

  async version(ref: string): Promise<number> {
    const r = await http("GET", this.dataPath(ref), this.cfg.token);
    return Number(r.data?.data?.metadata?.version ?? 1);
  }

  /** Respaldo cifrado: reune los refs y los cifra con AES-256-GCM (clave separada). */
  async backup(): Promise<string> {
    const snapshot: Record<string, string> = {};
    for (const ref of this.refs) {
      snapshot[ref] = await this.readValue(ref, this.cfg.token);
    }
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.backupKey, iv);
    const ct = Buffer.concat([cipher.update(JSON.stringify(snapshot), "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return JSON.stringify({ v: 1, iv: iv.toString("base64"), tag: tag.toString("base64"), ct: ct.toString("base64") });
  }

  async restore(payload: string): Promise<void> {
    const parsed = JSON.parse(payload);
    const decipher = createDecipheriv("aes-256-gcm", this.backupKey, Buffer.from(parsed.iv, "base64"));
    decipher.setAuthTag(Buffer.from(parsed.tag, "base64"));
    const snapshot = JSON.parse(
      Buffer.concat([decipher.update(Buffer.from(parsed.ct, "base64")), decipher.final()]).toString("utf8"),
    ) as Record<string, string>;
    this.refs = new Set(Object.keys(snapshot));
    for (const [ref, value] of Object.entries(snapshot)) {
      await this.writeValue(ref, value, this.cfg.token);
    }
  }
}

export function createOpenBaoBackend(cfg: OpenBaoConfig, backupDir: string): Promise<OpenBaoSecretBackend> {
  return OpenBaoSecretBackend.create(cfg, backupDir);
}
