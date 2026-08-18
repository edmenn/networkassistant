import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { createOpenBaoVault } from "../../../src/lib/security/vault-openbao.ts";

const ADDR = process.env.OPENBAO_ADDR || "http://127.0.0.1:18200";
const TOKEN = process.env.OPENBAO_TOKEN || "dev-root-token";
const CANARY = "canary-vault-openbao-7f2c";

async function baoUp(): Promise<boolean> {
  try {
    return (await fetch(`${ADDR}/v1/sys/health`)).status === 200;
  } catch {
    return false;
  }
}

test(
  "U9: vault del runtime respaldado por OpenBao conserva la API del baseline",
  { skip: !(await baoUp()) },
  async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "s1-vault-openbao-"));
    try {
      const vault = createOpenBaoVault({ addr: ADDR, token: TOKEN }, dir);
      assert.equal(await vault.ensureUnlocked(), true);
      assert.equal(vault.isUnlocked(), true);
      assert.equal(await vault.isInitialized(), true);

      await vault.setSecret("dev/fw-secret", CANARY);
      assert.equal(await vault.getSecret("dev/fw-secret"), CANARY);

      // listSecretKeys devuelve claves, nunca valores
      const keys = await vault.listSecretKeys();
      assert.ok(keys.includes("dev/fw-secret"));
      assert.ok(!keys.some((k) => k.includes(CANARY)), "no debe filtrar el valor como clave");

      // delete
      await vault.deleteSecret("dev/fw-secret");
      assert.equal(await vault.getSecret("dev/fw-secret"), undefined);
      assert.ok(!(await vault.listSecretKeys()).includes("dev/fw-secret"));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);
