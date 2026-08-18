import { test } from "node:test";
import assert from "node:assert/strict";
import { AppendOnlyAudit } from "../../../src/lib/security/audit.ts";

function seededAudit(): AppendOnlyAudit {
  const audit = new AppendOnlyAudit();
  audit.append({ actor: "user", action: "login", subject: "admin" });
  audit.append({ actor: "steward", action: "config", subject: "fw-01" });
  audit.append({ actor: "user", action: "probe", subject: "fw-01" });
  return audit;
}

test("U7: cadena intacta verifica ok", () => {
  const audit = seededAudit();
  assert.equal(audit.verify().ok, true);
  assert.equal(audit.list().length, 3);
});

test("U7: alterar un evento intermedio se detecta", () => {
  const audit = seededAudit();
  const events = audit.list();
  // Tamper el segundo evento (cambiar actor)
  const tampered = events[1];
  tampered.actor = "atacante";
  // Reinyectar el evento alterado en el almacen interno
  (audit as unknown as { events: typeof events }).events[1] = tampered;
  const res = audit.verify();
  assert.equal(res.ok, false);
  assert.equal(res.brokenAt, 1);
});

test("U7: eliminar un evento se detecta (eslabon roto)", () => {
  const audit = seededAudit();
  (audit as unknown as { events: unknown[] }).events.splice(1, 1);
  const res = audit.verify();
  assert.equal(res.ok, false);
  // La deteccion ocurre por secuencia con hueco o por hash previo roto.
  assert.equal(typeof res.brokenAt, "number");
});

test("U7: reordenar eventos se detecta", () => {
  const audit = seededAudit();
  const events = (audit as unknown as { events: AuditLike[] }).events;
  [events[0], events[2]] = [events[2], events[0]];
  const res = audit.verify();
  assert.equal(res.ok, false);
  assert.match(res.reason ?? "", /fuera de orden|no coincide/);
});

test("U7: no existe API de update/delete (append-only)", () => {
  const audit = new AppendOnlyAudit();
  assert.equal(typeof (audit as unknown as Record<string, unknown>).update, "undefined");
  assert.equal(typeof (audit as unknown as Record<string, unknown>).delete, "undefined");
  assert.equal(typeof audit.append, "function");
});

import type { AuditEvent } from "../../../src/lib/security/audit.ts";
type AuditLike = AuditEvent;
