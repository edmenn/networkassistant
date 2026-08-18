import { test } from "node:test";
import assert from "node:assert/strict";
import { Redactor } from "../../../src/lib/security/redact.ts";

const CANARY = "canary-9f3c-redact-secreto-abc";

test("U3: el canario no aparece en una linea de log", () => {
  const r = new Redactor();
  r.add(CANARY);
  const line = `INFO autenticacion ok secret=${CANARY} device=fw-lab-01`;
  assert.ok(!r.redactString(line).includes(CANARY));
  assert.ok(r.redactString(line).includes("[REDACTED]"));
});

test("U3: el canario no aparece en un error", () => {
  const r = new Redactor();
  r.add(CANARY);
  const err = `Fallo de auth: credencial ${CANARY} invalida`;
  assert.ok(!r.redactString(err).includes(CANARY));
});

test("U3: el canario no aparece en una respuesta API anidada", () => {
  const r = new Redactor();
  r.add(CANARY);
  const payload = {
    ok: true,
    device: { id: "d1", secret: CANARY, meta: { token: `x-${CANARY}` } },
    list: [CANARY, "otro"],
  };
  const out = r.redact(payload);
  const json = JSON.stringify(out);
  assert.ok(!json.includes(CANARY), "la respuesta no debe contener el valor");
  assert.ok(!JSON.stringify(payload).includes("[REDACTED]"), "no debe mutar la entrada");
  assert.equal(out.device.secret, "[REDACTED]");
  assert.equal(out.device.meta.token, "x-[REDACTED]");
  assert.equal(out.list[0], "[REDACTED]");
});

test("U3: el canario no aparece en un evento de auditoria", () => {
  const r = new Redactor();
  r.add(CANARY);
  const event = {
    actor: "user",
    action: "config",
    subject: CANARY,
    context: { detail: `stored ${CANARY}` },
  };
  assert.ok(!JSON.stringify(r.redact(event)).includes(CANARY));
});

test("U3: el canario no aparece en un prompt", () => {
  const r = new Redactor();
  r.add(CANARY);
  const prompt = `Contexto: el secreto es ${CANARY}. Devuelve evidencia.`;
  assert.ok(!r.redactString(prompt).includes(CANARY));
});

test("U3: no altera texto no sensible", () => {
  const r = new Redactor();
  r.add(CANARY);
  assert.equal(r.redactString("texto normal sin secretos"), "texto normal sin secretos");
});

test("U3: redacta el valor mas largo primero para evitar fugas parciales", () => {
  const r = new Redactor();
  r.add("abc");
  r.add("abcdefghi");
  assert.ok(!r.redactString("prefix-abcdefghi-suffix").includes("abcdefghi"));
  assert.ok(!r.redactString("prefix-abcdefghi-suffix").includes("abc"));
  // 'abc' suelto tambien se redacta
  assert.ok(r.redactString("abc").includes("[REDACTED]"));
});
