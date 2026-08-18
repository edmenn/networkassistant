/**
 * Contrato SecretBackend (ADR-0003) + backend de desarrollo autocontenido.
 *
 * Garantias de seguridad:
 *  - El valor del secreto jamas se persiste en claro: solo cifrado (AES-256-GCM).
 *  - La clave de cifrado vive en un archivo separado de los datos.
 *  - El valor solo se devuelve mediante un `lease` vigente de una identidad
 *    autorizada; no hay metodo publico que exponga el valor sin lease.
 *
 * Este modulo es autocontenido (solo node:crypto / node:fs) para poder
 * probarse sin node_modules. U2 lo sustituye por OpenBao manteniendo el mismo
 * contrato. Es codigo de desarrollo/sintetico; no usarlo para produccion.
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import * as path from "node:path";

export interface Lease {
  id: string;
  ref: string;
  identity: string;
  expiresAt: number; // epoch ms
  revoked: boolean;
}

export interface SecretBackend {
  /** Guarda un secreto cifrado. Nunca expone el valor. */
  put(ref: string, secret: string): Promise<void>;
  /** Emite un lease temporal a una identidad autorizada. Devuelve el Lease, no el valor. */
  lease(ref: string, identity: string, ttlMs?: number): Promise<Lease>;
  /** Recupera el valor solo si existe un lease vigente y autorizado. */
  get(leaseId: string, identity: string): Promise<string>;
  /** Revoca un lease. */
  revoke(leaseId: string): Promise<void>;
  /** Rota la clave de datos del ref (re-cifra el secreto con clave nueva). */
  rotate(ref: string): Promise<void>;
  /** Devuelve un respaldo cifrado (solo ciphertext, sin clave). */
  backup(): Promise<string>;
  /** Restaura un respaldo cifrado (requiere que exista la clave). */
  restore(payload: string): Promise<void>;
}

interface EncryptedEnvelope {
  version: number;
  updatedAt: string;
  secrets: Record<string, { iv: string; tag: string; ct: string }>;
}

interface BackendState {
  dir: string;
  dataFile: string;
  keyFile: string;
  key: Buffer;
  envelope: EncryptedEnvelope;
  leases: Map<string, Lease>;
}

const KEY_BYTES = 32;

function loadState(dir: string, key: Buffer): BackendState {
  return {
    dir,
    dataFile: path.join(dir, "secrets.enc.json"),
    keyFile: path.join(dir, "dev-key.bin"),
    key,
    envelope: { version: 1, updatedAt: new Date().toISOString(), secrets: {} },
    leases: new Map(),
  };
}

function nowMs(): number {
  return Date.now();
}

function assertTtl(ttlMs: number): number {
  const ttl = Number.isFinite(ttlMs) && ttlMs > 0 ? Math.floor(ttlMs) : 5 * 60_000;
  return Math.min(ttl, 24 * 60 * 60_000);
}

export class FileSecretBackend implements SecretBackend {
  private state: BackendState;

  private constructor(state: BackendState) {
    this.state = state;
  }

  /** Crea (o carga) un backend dev en `dir` con clave generada aleatoriamente. */
  static async create(dir: string): Promise<FileSecretBackend> {
    await mkdir(dir, { recursive: true });
    const keyFile = path.join(dir, "dev-key.bin");
    let key: Buffer;
    try {
      key = Buffer.from(await readFile(keyFile), "binary");
    } catch {
      key = randomBytes(KEY_BYTES);
      await writeFile(keyFile, key, { mode: 0o600 });
    }
    const backend = new FileSecretBackend(loadState(dir, key));
    await backend.load();
    return backend;
  }

  private async load(): Promise<void> {
    try {
      const raw = await readFile(this.state.dataFile, "utf8");
      this.state.envelope = JSON.parse(raw) as EncryptedEnvelope;
    } catch {
      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    this.state.envelope.updatedAt = new Date().toISOString();
    await writeFile(this.state.dataFile, JSON.stringify(this.state.envelope), { mode: 0o600 });
  }

  private encrypt(plaintext: string, key: Buffer): { iv: string; tag: string; ct: string } {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { iv: iv.toString("base64"), tag: tag.toString("base64"), ct: ct.toString("base64") };
  }

  private decrypt(entry: { iv: string; tag: string; ct: string }, key: Buffer): string {
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(entry.iv, "base64"));
    decipher.setAuthTag(Buffer.from(entry.tag, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(entry.ct, "base64")),
      decipher.final(),
    ]).toString("utf8");
  }

  async put(ref: string, secret: string): Promise<void> {
    if (!ref || typeof secret !== "string") {
      throw new Error("SecretBackend: ref y secret son obligatorios");
    }
    this.state.envelope.secrets[ref] = this.encrypt(secret, this.state.key);
    await this.persist();
  }

  async lease(ref: string, identity: string, ttlMs?: number): Promise<Lease> {
    if (!this.state.envelope.secrets[ref]) {
      throw new Error(`SecretBackend: no existe el ref ${ref}`);
    }
    const lease: Lease = {
      id: randomUUID(),
      ref,
      identity,
      expiresAt: nowMs() + assertTtl(ttlMs ?? 5 * 60_000),
      revoked: false,
    };
    this.state.leases.set(lease.id, lease);
    return { ...lease };
  }

  async get(leaseId: string, identity: string): Promise<string> {
    const lease = this.state.leases.get(leaseId);
    if (!lease || lease.revoked || lease.identity !== identity) {
      throw new Error("SecretBackend: lease invalido o no autorizado");
    }
    if (nowMs() > lease.expiresAt) {
      this.state.leases.delete(leaseId);
      throw new Error("SecretBackend: lease vencido");
    }
    const entry = this.state.envelope.secrets[lease.ref];
    if (!entry) {
      throw new Error("SecretBackend: ref inexistente");
    }
    return this.decrypt(entry, this.state.key);
  }

  async revoke(leaseId: string): Promise<void> {
    const lease = this.state.leases.get(leaseId);
    if (lease) {
      lease.revoked = true;
    }
  }

  /** Rota la clave de datos y re-cifra todos los secretos bajo la clave nueva. */
  async rotate(ref: string): Promise<void> {
    const entry = this.state.envelope.secrets[ref];
    if (!entry) {
      throw new Error(`SecretBackend: no existe el ref ${ref}`);
    }
    const value = this.decrypt(entry, this.state.key);
    const newKey = randomBytes(KEY_BYTES);
    this.state.envelope.secrets[ref] = this.encrypt(value, newKey);
    this.state.key = newKey;
    await writeFile(this.state.keyFile, newKey, { mode: 0o600 });
    await this.persist();
  }

  /** Respaldo cifrado: devuelve los datos cifrados (nunca la clave ni el valor). */
  async backup(): Promise<string> {
    return JSON.stringify(this.state.envelope);
  }

  async restore(payload: string): Promise<void> {
    const parsed = JSON.parse(payload) as EncryptedEnvelope;
    if (!parsed || parsed.version !== 1 || typeof parsed.secrets !== "object") {
      throw new Error("SecretBackend: respaldo invalido");
    }
    this.state.envelope = parsed;
    await this.persist();
  }

  /** Util de limpieza dev. */
  async destroy(): Promise<void> {
    await unlink(this.state.dataFile).catch(() => undefined);
    await unlink(this.state.keyFile).catch(() => undefined);
  }
}

export function createDevBackend(dir: string): Promise<FileSecretBackend> {
  return FileSecretBackend.create(dir);
}
