import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { OpenBaoSecretBackend } from "../../../src/lib/security/secret-backend/openbao.ts";

const ADDR = process.env.OPENBAO_ADDR || "http://127.0.0.1:18200";
const TOKEN = process.env.OPENBAO_TOKEN || "dev-root-token";
const CANARY = "canary-u8-3f9c-restore-secreto-zz";

async function baoUp(): Promise<boolean> {
  try {
    return (await fetch(`${ADDR}/v1/sys/health`)).status === 200;
  } catch {
    return false;
  }
}

async function tmpDir(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "s1-u8-"));
}

test(
  "U8: backup cifrado -> restaurar en host limpio -> secreto usable solo por lease autorizado",
  { skip: !(await baoUp()) },
  async () => {
    const dir = await tmpDir();
    const refs = [`lab/fw-${Date.now()}`, `lab/db-${Date.now()}`];
    try {
      // Origen: guardar canarios y generar backup cifrado
      const a = await OpenBaoSecretBackend.create({ addr: ADDR, token: TOKEN }, dir);
      await a.put(refs[0], CANARY);
      await a.put(refs[1], "otro-secreto-sintetico");
      const backup = await a.backup();
      assert.ok(!backup.includes(CANARY), "el backup no debe contener el valor en claro");

      // Simular perdida en "host limpio": borrar los refs del vault
      for (const ref of refs) {
        const del = await fetch(`${ADDR}/v1/secret/data/${ref}`, {
          method: "DELETE",
          headers: { "X-Vault-Token": TOKEN },
        });
        assert.equal(del.status, 204);
      }

      // Host limpio: backend nuevo que restaura el backup con la clave de backup
      // (llevada por separado, como las claves de unseal de OpenBao).
      const b = await OpenBaoSecretBackend.create({ addr: ADDR, token: TOKEN }, dir);
      await b.restore(backup);

      // Secreto utilizable SOLO por lease autorizado
      const lease = await b.lease(refs[0], "worker-a", 30_000);
      assert.equal(await b.get(lease.id, "worker-a"), CANARY);
      // identidad distinta -> denegado
      await assert.rejects(b.get(lease.id, "worker-b"), /lease invalido o no autorizado/);
      // sin lease -> no recuperable
      await assert.rejects(b.get("nope", "worker-a"), /lease invalido o no autorizado/);
      // segundo ref restaurado tambien
      const l2 = await b.lease(refs[1], "worker-a", 30_000);
      assert.equal(await b.get(l2.id, "worker-a"), "otro-secreto-sintetico");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);
