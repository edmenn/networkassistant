import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { OpenBaoSecretBackend } from "../../../src/lib/security/secret-backend/openbao.ts";

const ADDR = process.env.OPENBAO_ADDR || "http://127.0.0.1:18200";
const TOKEN = process.env.OPENBAO_TOKEN || "dev-root-token";
const CANARY = "canary-openbao-7f3c-secreto-xy-99";

async function baoUp(): Promise<boolean> {
  try {
    const res = await fetch(`${ADDR}/v1/sys/health`);
    return res.status === 200;
  } catch {
    return false;
  }
}

async function tmpDir(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "s1-openbao-"));
}

test("U2 OpenBao: put/lease/get, identidad incorrecta, revoke, rotate, backup/restore", { skip: !(await baoUp()) }, async () => {
  const dir = await tmpDir();
  const a = await OpenBaoSecretBackend.create({ addr: ADDR, token: TOKEN }, dir);
  try {
    const ref = `dev/fw-${Date.now()}`;
    await a.put(ref, CANARY);

    // lease autorizado devuelve el secreto
    const lease = await a.lease(ref, "worker-a", 30_000);
    assert.equal(await a.get(lease.id, "worker-a"), CANARY);
    // identidad incorrecta -> denegado
    await assert.rejects(a.get(lease.id, "worker-b"), /lease invalido o no autorizado/);

    // rotate crea version nueva y el valor sigue siendo recuperable
    const v1 = await a.version(ref);
    await a.rotate(ref);
    assert.ok((await a.version(ref)) > v1, "rotate debe crear version nueva");
    const lease2 = await a.lease(ref, "worker-a", 30_000);
    assert.equal(await a.get(lease2.id, "worker-a"), CANARY);

    // revoke -> ya no recuperable
    await a.revoke(lease2.id);
    await assert.rejects(a.get(lease2.id, "worker-a"), /lease invalido o no autorizado/);

    // backup cifrado no contiene el valor en claro
    const backup = await a.backup();
    assert.ok(!backup.includes(CANARY), "el backup no debe contener el valor en claro");

    // restore reproduce un secreto utilizable (simulando perdida: borrar y restaurar)
    const del = await fetch(`${ADDR}/v1/secret/data/${ref}`, {
      method: "DELETE",
      headers: { "X-Vault-Token": TOKEN },
    });
    assert.equal(del.status, 204, "delete del ref para simular perdida");
    const b = await OpenBaoSecretBackend.create({ addr: ADDR, token: TOKEN }, dir);
    await b.restore(backup);
    const lease3 = await b.lease(ref, "worker-a", 30_000);
    assert.equal(await b.get(lease3.id, "worker-a"), CANARY);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
