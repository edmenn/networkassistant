/**
 * Vault del control plane respaldado por OpenBao (ADR-0003, integracion U9).
 *
 * Expone la MISMA API publica que el vault del baseline (isInitialized,
 * isUnlocked, ensureUnlocked, setSecret, getSecret, deleteSecret,
 * listSecretKeys) para que los llamadores no cambien, pero la persistencia
 * pasa a OpenBao. El control plane actua como custodio (read/write/delete/list
 * con token admin); la entrega a workers usa el modelo de leases.
 *
 * Autocontenido (sin imports de la app) para poder probarse con node --test.
 */

import {
  OpenBaoSecretBackend,
  type OpenBaoConfig,
} from "./secret-backend/openbao.ts";

export interface VaultLike {
  isInitialized(): Promise<boolean>;
  isUnlocked(): boolean;
  ensureUnlocked(): Promise<boolean>;
  setSecret(key: string, value: string): Promise<void>;
  getSecret(key: string): Promise<string | undefined>;
  deleteSecret(key: string): Promise<void>;
  listSecretKeys(): Promise<string[]>;
}

export function createOpenBaoVault(cfg: OpenBaoConfig, backupDir: string): VaultLike {
  let backend: OpenBaoSecretBackend | null = null;

  async function ensure(): Promise<OpenBaoSecretBackend | null> {
    if (backend) {
      return backend;
    }
    try {
      backend = await OpenBaoSecretBackend.create(cfg, backupDir);
      return backend;
    } catch {
      return null;
    }
  }

  return {
    async isInitialized(): Promise<boolean> {
      return (await ensure()) !== null;
    },
    isUnlocked(): boolean {
      return backend !== null;
    },
    async ensureUnlocked(): Promise<boolean> {
      return (await ensure()) !== null;
    },
    async setSecret(key: string, value: string): Promise<void> {
      const b = await ensure();
      if (!b) {
        throw new Error("Vault is not available");
      }
      await b.put(key, value);
    },
    async getSecret(key: string): Promise<string | undefined> {
      const b = await ensure();
      if (!b) {
        return undefined;
      }
      try {
        return await b.read(key);
      } catch {
        return undefined;
      }
    },
    async deleteSecret(key: string): Promise<void> {
      const b = await ensure();
      if (!b) {
        throw new Error("Vault is not available");
      }
      await b.remove(key);
    },
    async listSecretKeys(): Promise<string[]> {
      const b = await ensure();
      if (!b) {
        return [];
      }
      return b.list();
    },
  };
}

const ADDR = process.env.OPENBAO_ADDR || "";
const TOKEN = process.env.OPENBAO_TOKEN || "";
const BACKUP_DIR = process.env.OPENBAO_BACKUP_DIR || ".steward-openbao";

/** Singleton por defecto para el runtime (usa env OPENBAO_ADDR/OPENBAO_TOKEN). */
export const openBaoVault: VaultLike = createOpenBaoVault({ addr: ADDR, token: TOKEN }, BACKUP_DIR);
