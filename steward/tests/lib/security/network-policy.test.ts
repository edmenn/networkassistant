import { test } from "node:test";
import assert from "node:assert/strict";
import { TargetValidator, ipInCidr, isLoopback, isMetadata } from "../../../src/lib/security/network-policy.ts";

const policy = { allowlist: ["172.28.200.0/24", "10.0.0.0/8"] };

function validatorFor(resolver: (host: string) => Promise<string[]>): TargetValidator {
  return new TargetValidator(policy, resolver);
}

test("U5: loopback bloqueado", async () => {
  const v = validatorFor(async () => ["127.0.0.1"]);
  assert.equal((await v.check("127.0.0.1")).ok, false);
  assert.equal((await v.check("127.0.0.1")).reason, "loopback");
  assert.equal((await v.check("::1")).ok, false);
});

test("U5: metadata cloud bloqueada", async () => {
  const v = validatorFor(async () => ["169.254.169.254"]);
  assert.equal((await v.check("169.254.169.254")).ok, false);
  assert.equal((await v.check("169.254.169.254")).reason, "metadata cloud");
  assert.equal(isMetadata("100.100.100.200"), true);
});

test("U5: ip fuera del allowlist bloqueada", async () => {
  const v = validatorFor(async () => ["8.8.8.8"]);
  assert.equal((await v.check("8.8.8.8")).ok, false);
});

test("U5: ip dentro del allowlist permitida", async () => {
  const v = validatorFor(async () => ["172.28.200.10"]);
  assert.equal((await v.check("172.28.200.10")).ok, true);
});

test("U5: hostname que resuelve a loopback bloqueado (SSRF)", async () => {
  const v = validatorFor(async () => ["127.0.0.1"]);
  const r = await v.check("internalsvc.local");
  assert.equal(r.ok, false);
  assert.match(r.reason, /loopback/);
});

test("U5: DNS que resuelve a una mezcla permitida+bloqueada se rechaza (anti-rebinding)", async () => {
  // El validador resuelve una vez y exige que TODAS las direcciones queden
  // dentro del alcance: si alguna apunta a metadata/loopback/fuera, se niega.
  const v = validatorFor(async () => ["172.28.200.10", "169.254.169.254"]);
  const r = await v.check("revive.example");
  assert.equal(r.ok, false);
  assert.match(r.reason, /metadata cloud|fuera del allowlist/);
});

test("U5: hostname con todas las resoluciones permitidas pasa", async () => {
  const v = validatorFor(async () => ["172.28.200.10", "10.0.0.5"]);
  assert.equal((await v.check("lab-svc")).ok, true);
});

test("U5: resolucion fallida se bloquea (fail closed)", async () => {
  const v = validatorFor(async () => {
    throw new Error("NXDOMAIN");
  });
  assert.equal((await v.check("noexiste")).ok, false);
});

test("U5: utilidades CIDR", () => {
  assert.equal(ipInCidr("172.28.200.10", "172.28.200.0/24"), true);
  assert.equal(ipInCidr("172.28.201.10", "172.28.200.0/24"), false);
  assert.equal(isLoopback("127.0.0.1"), true);
  assert.equal(isMetadata("169.254.169.254"), true);
});
