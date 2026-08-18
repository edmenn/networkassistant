import { test } from "node:test";
import assert from "node:assert/strict";
import { PolicyEngine, type Grant } from "../../../src/lib/security/rbac.ts";

const G: Grant[] = [
  // Operador: observa todo el sitio lab
  { principal: "oper-lab", site: "lab", actionClass: "observe", effect: "allow" },
  // Operador: probe sobre un equipo concreto
  { principal: "oper-lab", site: "lab", device: "fw-01", actionClass: "probe", effect: "allow" },
  // Auditor: solo lectura en cualquier sitio
  { principal: "auditor", actionClass: "observe", effect: "allow" },
  // Deny: nadie toca el equipo fw-01 (destructive) ni el secreto de fw-02
  { principal: "*", device: "fw-01", actionClass: "destructive", effect: "deny" },
  { principal: "*", resource: "sec/fw-02", effect: "deny" },
];

test("U4: default deny sin regla que permita", () => {
  const p = new PolicyEngine();
  p.addGrants(G);
  assert.equal(p.decide({ principal: "desconocido", actionClass: "observe" }), "deny");
  assert.equal(p.decide({ principal: "oper-lab", actionClass: "destructive" }), "deny");
});

test("U4: allow por scope correcto", () => {
  const p = new PolicyEngine();
  p.addGrants(G);
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", actionClass: "observe" }), "allow");
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", device: "fw-01", actionClass: "probe" }), "allow");
  assert.equal(p.decide({ principal: "auditor", site: "lab", actionClass: "observe" }), "allow");
});

test("U4: deny prevalece sobre allow (mismo scope)", () => {
  const p = new PolicyEngine();
  p.addGrant({ principal: "oper-lab", site: "lab", actionClass: "destructive", effect: "allow" });
  p.addGrant({ principal: "oper-lab", device: "fw-01", actionClass: "destructive", effect: "deny" });
  // Hay allow generico pero deny especifico prevalece
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", device: "fw-01", actionClass: "destructive" }), "deny");
  // Otro equipo si pasa por el allow
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", device: "fw-09", actionClass: "destructive" }), "allow");
});

test("U4: deny por secreto bloquea el recurso aunque el metodo este permitido", () => {
  const p = new PolicyEngine();
  p.addGrants(G);
  // probe permitido por equipo fw-01, pero si el secreto es sec/fw-02 -> deny
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", device: "fw-01", resource: "sec/fw-02", actionClass: "probe" }), "deny");
  // otro secreto -> allow
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", device: "fw-01", resource: "sec/fw-01", actionClass: "probe" }), "allow");
});

test("U4: wildcard de sitio", () => {
  const p = new PolicyEngine();
  p.addGrant({ principal: "auditor", actionClass: "observe", effect: "allow" });
  assert.equal(p.decide({ principal: "auditor", site: "sucursal-x", actionClass: "observe" }), "allow");
});

test("U4: deny prevalece en el deny global de equipo", () => {
  const p = new PolicyEngine();
  p.addGrants(G);
  // destructive sobre fw-01 -> deny (regla deny explicita)
  assert.equal(p.decide({ principal: "oper-lab", site: "lab", device: "fw-01", actionClass: "destructive" }), "deny");
});
