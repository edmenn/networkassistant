// Probe E2E del vertical slice de Sprint 0 (baseline Steward ea6a476).
// Corre DENTRO del contenedor steward-sprint0-web usando el chromium y
// playwright que el baseline ya instala. Sin credenciales reales: todo es
// laboratorio sintetico. Salida: pantallazos en OUT + resumen en stdout.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.PROBE_BASE_URL || "http://127.0.0.1:3000";
const OUT = process.env.PROBE_OUT_DIR || "/app/evidence";
fs.mkdirSync(OUT, { recursive: true });

const ADMIN = { username: "admin", displayName: "Lab Owner", password: "LabOwner-Pw-2026-Admin" };
const FW = { name: "fw-lab-01", ip: "172.28.200.10" };
const SSH = { username: "fwlab", secret: "FwLab-Ro-2026!lab" };
const READ_ONLY_CMD =
  "hostname; echo '---identity---'; cat /etc/steward-lab/fw-identity; echo '---kernel---'; uname -srm; head -2 /etc/os-release; echo '---interfaces---'; ip -brief addr";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log("[probe]", ...a);

async function step(page, name, fn) {
  log("STEP:", name);
  try {
    return await fn();
  } catch (err) {
    const body = await page.locator("body").innerText().catch(() => "<no body>");
    log("STEP FAILED:", name, err.message);
    log("PAGE TEXT (first 4000):\n", body.slice(0, 4000));
    throw err;
  }
}

async function waitForDev(fetchJson) {
  // Espera a que el scan del agente observe la superficie SSH del firewall.
  const deadline = Date.now() + 8 * 60_000;
  while (Date.now() < deadline) {
    const data = await fetchJson("/api/devices");
    const dev = (data.devices ?? []).find((d) => d.name === FW.name);
    if (dev) {
      const hasSsh =
        (dev.protocols ?? []).some((p) => p.toLowerCase() === "ssh") ||
        (dev.services ?? []).some((s) => s.port === 22 || String(s.name ?? "").toLowerCase().includes("ssh"));
      if (hasSsh) {
        return dev;
      }
      log("waiting for SSH surface... protocols:", JSON.stringify(dev.protocols), "services:", JSON.stringify(dev.services));
    } else {
      log("waiting for device to appear...");
    }
    await sleep(15_000);
  }
  throw new Error("Timed out waiting for SSH surface on fw-lab-01");
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const evidence = { steps: [], device: null, terminal: null, api: {} };

  // 1. Entorno web desde navegador
  await step(page, "open-web", async () => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(2000);
    evidence.url = page.url();
    await page.screenshot({ path: `${OUT}/01-web-home.png` });
  });

  // 2. Autenticacion (idempotente: bootstrap / login / ya autenticado)
  await step(page, "authenticate", async () => {
    await page.goto(`${BASE}/access`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.getByText("Access Control").waitFor({ timeout: 30_000 });
    await page.waitForTimeout(500);
    const needsBootstrap = await page.getByText("Bootstrap Required").isVisible().catch(() => false);
    if (needsBootstrap) {
      const inputs = page.locator("input");
      await inputs.nth(0).fill(ADMIN.username);
      await inputs.nth(1).fill(ADMIN.displayName);
      await inputs.nth(2).fill(ADMIN.password);
      await page.getByRole("button", { name: "Create Owner" }).click();
      await page.getByText("Signed in as", { exact: false }).waitFor({ timeout: 30_000 });
    } else {
      const signedIn = await page.getByText("Signed in as", { exact: false }).isVisible().catch(() => false);
      if (!signedIn) {
        const inputs = page.locator("input");
        await inputs.nth(0).fill(ADMIN.username);
        await inputs.nth(1).fill(ADMIN.password);
        await page.getByRole("button", { name: "Sign In" }).click();
        await page.getByText("Signed in as", { exact: false }).waitFor({ timeout: 30_000 });
      }
    }
    await page.screenshot({ path: `${OUT}/02-authenticated.png` });
  });

  // 3. Sitio / inventario (el baseline siembra un unico sitio por defecto)
  await step(page, "inventory", async () => {
    await page.goto(`${BASE}/devices`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const empty = await page.getByText("No devices found").isVisible().catch(() => false);
    if (empty) {
      await page.screenshot({ path: `${OUT}/03-devices-empty.png` });
    }
  });

  // 4. Agregar firewall de laboratorio desde la UI
  await step(page, "add-device", async () => {
    await page.getByRole("button", { name: "Add Device" }).first().click();
    await page.locator("#device-name").fill(FW.name);
    await page.locator("#device-ip").fill(FW.ip);
    await page.getByRole("button", { name: "Add Device", exact: true }).click();
    await page.getByText(FW.name, { exact: true }).waitFor({ timeout: 30_000 });
    await page.getByText(FW.ip, { exact: true }).waitFor({ timeout: 15_000 });
    await page.screenshot({ path: `${OUT}/04-device-added.png` });
  });

  // 5. Correr el ciclo del agente para que el scan observe la superficie SSH
  await step(page, "agent-cycle", async () => {
    const res = await page.evaluate(() => fetch("/api/agent/run", { method: "POST" }).then((r) => r.json()));
    log("agent/run:", JSON.stringify(res));
  });

  // 6. Esperar observacion SSH (nmap + banner SSH) y abrir la ficha
  await step(page, "wait-ssh-surface", async () => {
    const fetchJson = (url) => page.evaluate((u) => fetch(u, { cache: "no-store" }).then((r) => r.json()), url);
    evidence.device = await waitForDev(fetchJson);
  });

  await step(page, "open-device-detail", async () => {
    await page.goto(`${BASE}/devices`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.getByText(FW.name, { exact: true }).click();
    await page.getByRole("heading", { name: FW.name }).first().waitFor({ timeout: 30_000 });
    evidence.deviceUrl = page.url();
    await page.screenshot({ path: `${OUT}/05-device-overview.png` });
  });

  // 7. Agregar credencial SSH sintetica (Manage -> Access -> Add Credential)
  await step(page, "add-ssh-credential", async () => {
    await page.getByRole("tab", { name: "Manage" }).click();
    await page.getByRole("tab", { name: "Access" }).click();
    await page.getByRole("button", { name: "Add Credential" }).click();
    await page.locator("#cred-type").click();
    await page.getByRole("option", { name: "SSH", exact: true }).click();
    await page.locator("#cred-username").fill(SSH.username);
    await page.locator("#cred-password").fill(SSH.secret);
    await page.getByRole("button", { name: "Save Credential" }).click();
    await page.getByRole("button", { name: "Save Credential" }).waitFor({ state: "hidden", timeout: 30_000 });
    await page.screenshot({ path: `${OUT}/06-credential-stored.png` });
  });

  // 8. Terminal remoto: prueba SSH read-only
  await step(page, "ssh-readonly-terminal", async () => {
    await page.getByRole("tab", { name: "Remote" }).click();
    const terminal = page.locator('input[placeholder="Enter a command"]');
    await terminal.waitFor({ timeout: 60_000 });
    await terminal.fill(READ_ONLY_CMD);
    await terminal.press("Enter");
    await page.getByText("---interfaces---").waitFor({ timeout: 90_000 });
    const terminalText = await page.locator("div.bg-slate-950").first().innerText().catch(() => "");
    await page.screenshot({ path: `${OUT}/07-ssh-readonly-output.png` });

    const run = await page.evaluate(({ cmd, deviceId }) =>
      fetch(`/api/devices/${deviceId}/remote-terminal`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      }).then((r) => r.json()),
      { cmd: READ_ONLY_CMD, deviceId: evidence.device.id });
    evidence.terminalUi = terminalText;
    evidence.terminalApi = {
      ok: run.ok,
      status: run.status,
      summary: run.summary,
      transport: run.transport,
      transportLabel: run.transportLabel,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      output: run.output,
    };
  });

  // 9. Evidencia estructurada por API (redactada; sin valores de secretos)
  await step(page, "api-evidence", async () => {
    const j = (url) => page.evaluate((u) => fetch(u, { cache: "no-store" }).then((r) => r.json()), url);
    evidence.api.devices = await j("/api/devices");
    evidence.api.adoption = await j(`/api/devices/${evidence.device.id}/adoption`);
    evidence.api.audit = await j("/api/audit-events?limit=20");
  });

  await browser.close();
  evidence.stepsDone = true;
  log("EVIDENCE_SUMMARY_START");
  console.log(JSON.stringify(evidence, null, 2));
  log("EVIDENCE_SUMMARY_END");
}

main().catch((err) => {
  console.error("[probe] FATAL:", err);
  process.exit(1);
});