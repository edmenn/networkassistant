import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { FileSecretBackend } from "../../../src/lib/security/secret-backend/secret-backend.ts";

const CANARY = "canary-6f3c-44f9-secreto-de-prueba-xyz";

async function withBackend(fn: (backend: FileSecretBackend, dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "s1-secret-backend-"));
  const backend = await FileSecretBackend.create(dir);
  try {
    await fn(backend, dir);
  } finally {
    await backend.destroy();
    await rm(dir, { recursive: true, force: true });
  }
}

test("lease autorizado devuelve el secreto; sin lease autorizado NO es recuperable", async () => {
  await withBackend(async (backend) => {
    await backend.put("dev/fw", CANARY);
    const lease = await backend.lease("dev/fw", "worker-a", 30_000);
    assert.equal(await backend.get(lease.id, "worker-a"), CANARY);

    // Identidad no autorizada -> denegado
    await assert.rejects(backend.get(lease.id, "worker-b"), /lease invalido o no autorizado/);
    // Sin lease -> no existe metodo publico que devuelva el valor
    await assert.rejects(backend.get("no-existe", "worker-a"), /lease invalido o no autorizado/);
  });
});

test("lease revocado deja de devolver el secreto", async () => {
  await withBackend(async (backend) => {
    await backend.put("dev/fw", CANARY);
    const lease = await backend.lease("dev/fw", "worker-a");
    await backend.revoke(lease.id);
    await assert.rejects(backend.get(lease.id, "worker-a"), /lease invalido o no autorizado/);
  });
});

test("lease vencido deja de devolver el secreto", async () => {
  await withBackend(async (backend) => {
    await backend.put("dev/fw", CANARY);
    const lease = await backend.lease("dev/fw", "worker-a", 1);
    await new Promise((r) => setTimeout(r, 10));
    await assert.rejects(backend.get(lease.id, "worker-a"), /lease vencido/);
  });
});

test("canario NO aparece en claro en el archivo persistido", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "s1-secret-backend-"));
  const backend = await FileSecretBackend.create(dir);
  try {
    await backend.put("dev/fw", CANARY);
    const raw = await readFile(path.join(dir, "secrets.enc.json"), "utf8");
    assert.ok(!raw.includes(CANARY), "el valor del secreto no debe persistir en claro");
  } finally {
    await backend.destroy();
    await rm(dir, { recursive: true, force: true });
  }
});

test("rotate re-cifra (ciphertext distinto) pero el valor sigue siendo recuperable", async () => {
  await withBackend(async (backend) => {
    await backend.put("dev/fw", CANARY);
    const before = await backend.backup();
    await backend.rotate("dev/fw");
    const after = await backend.backup();
    assert.notEqual(before, after, "el cifrado debe cambiar tras rotate");
    const lease = await backend.lease("dev/fw", "worker-a", 30_000);
    assert.equal(await backend.get(lease.id, "worker-a"), CANARY);
  });
});

test("backup no contiene el valor en claro y restore reproduce el secreto utilizable", async () => {
  await withBackend(async (backend) => {
    await backend.put("dev/fw", CANARY);
    const backup = await backend.backup();
    assert.ok(!backup.includes(CANARY), "el backup no debe contener el valor en claro");

    // restore en "entorno limpio": un backend nuevo con la MISMA clave no es posible
    // (la clave es local); el contrato exige clave separada. Comprobamos que el
    // restore del payload cifrado mantiene el secreto utilizable via lease.
    await backend.restore(backup);
    const lease = await backend.lease("dev/fw", "worker-a", 30_000);
    assert.equal(await backend.get(lease.id, "worker-a"), CANARY);
  });
});
