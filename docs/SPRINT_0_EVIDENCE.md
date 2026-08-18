# Evidencia - Sprint 0

Estado actual: `in_progress`. El recorrido funcional `web -> dispositivo -> credencial SSH -> prueba read-only` se verifico el 2026-08-17/18 contra el baseline `ea6a476` en el laboratorio. El cierre completo no se declara porque el baseline no permite **crear sitios** desde la UI/API (solo siembra `site.local.default`); esa tarea queda como condicion para el cierre del gate.

Fecha: 2026-08-11 (baseline) + 2026-08-17/18 (recorrido funcional). Baseline: `braedonsaunders/steward@ea6a4762737dc9ce57f21ff1d3e536bdfe102125`.

## Procedencia

- Clon completo del upstream y licencia MIT verificada.
- Mirror privado: `https://github.com/edmenn/asistente-networking-steward`.
- Branch `main` y tag anotado `upstream-ea6a476-sprint0` publicados.
- Ultimo commit sustantivo anterior: `e0b51e70047c5a596930a9735265dafb59e0c036`.

## Calidad reproducible

| Comando | Resultado |
|---|---|
| `npm ci --ignore-scripts` + `npm rebuild better-sqlite3` | aprobado |
| `npm test` | 34 archivos, 91 pruebas aprobadas |
| `npm run lint` | aprobado |
| `npm run build` | aprobado con Next.js 16.1.6 y 81 paginas estaticas |
| `docker compose config --quiet` | aprobado |

## Seguridad

`npm audit --package-lock-only --json` reporto 16 vulnerabilidades: 2 critical, 11 high, 1 moderate y 2 low. Entre las dependencias directas o rutas relevantes estan `vitest`, `next-auth`, `next` y `ws`.

Decision: el baseline sirve como referencia de arquitectura y UX, no como imagen de produccion. Sprint 1 debe actualizar dependencias y repetir SCA, tests y pruebas de auth antes de reutilizar codigo condicionado. No se usaron secretos reales.

Brechas confirmadas: control plane con `NET_ADMIN`/`NET_RAW`, ejecucion `runShell`, vault local con `vault.key`/fallback derivado de maquina y SQLite. Sus destinos estan definidos en `docs/REUSE_MATRIX.md`.

## Mapa estructural histórico

- `graphify update . --force`: 423 archivos analizados.
- El baseline histórico produjo 4.531 nodos, 12.857 relaciones y 227 comunidades. Los artefactos se eliminaron del árbol actual para evitar que agentes los usen como contexto del nuevo proyecto.
- `graphify diagnose multigraph`: 0 endpoints ausentes, 0 aristas colgantes, 0 duplicados y 0 colisiones por endpoint.

## Runtime Linux AMD64

- Imagen construida con `DOCKER_DEFAULT_PLATFORM=linux/amd64` en Docker Desktop.
- Contenedor: `uname -s` = `Linux`; `uname -m` = `x86_64`.
- Healthcheck de `steward`: `healthy`.
- `GET http://127.0.0.1:3010/api/health`: HTTP 200, `ok: true`, 0 dispositivos y 0 incidentes.
- `GET http://127.0.0.1:3010/`: HTTP 200.
- `guacd` y `steward` quedaron ejecutandose en el proyecto Compose `steward-sprint0` con datos sinteticos; `guacd` pertenece únicamente a la evidencia histórica del baseline y queda excluido del runtime objetivo.

## Evidencia funcional (recorrido real 2026-08-17/18)

Laboratorio sintetico en `lab/` (reproducible desde checkout limpio). Red ficticia aislada `172.28.200.0/24`; el firewall simulado es `fw-lab-01` en `172.28.200.10`. El baseline se vendio en `steward/` al commit fijado y se levanto con `lab/compose.lab.yml`. Se eligio rango privado (no TEST-NET) porque la politica de descubrimiento del baseline solo escanea redes privadas (10/8, 172.16-31/12, 192.168/16); ver ADR-0007.

Credenciales 100% sinteticas (nunca reales): Owner web `admin` / `LabOwner-Pw-2026-Admin`; SSH read-only `fwlab` / `FwLab-Ro-2026!lab`.

### Comandos ejecutados

```bash
# Imagen baseline del commit fijado (Linux AMD64)
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build -t steward-sprint0-web:baseline steward/
# Stack de laboratorio (web + firewall simulado)
docker compose -f lab/compose.lab.yml up --build -d
# Recorrido de navegador (Playwright dentro del contenedor)
docker compose -f lab/compose.lab.yml exec steward node /app/lab/probe.mjs
# Evidencia
ls lab/evidence/
```

### Resultado del recorrido (salida real del probe)

- `open-web`: la UI se sirve en `http://127.0.0.1:3010` (health `{"ok":true,"vault":{"ready":true}}`).
- `authenticate`: bootstrap del Owner (`admin`) y login; `VAULT: UNLOCKED`.
- `inventory`: `/devices` muestra el empty state ("No devices found").
- `add-device`: alta manual del firewall `fw-lab-01` @ `172.28.200.10` (UPSERT, id `69a4ee76-...`).
- `agent-cycle` + `wait-ssh-surface`: el scan del agente observo la superficie SSH:
  `protocols: ["ssh"]`, `services: [{port:22, name:"ssh", secure:true, product:"OpenSSH", version:"9.2p1 Debian 2+deb12u10", banner:"SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u10"}]`, `status:"online"`, `os:"Debian"`, confianza de descubrimiento `0.978975`, evidencia `["ssh_banner","tcp_open"]`.
- `add-ssh-credential`: credencial SSH sintetica guardada en el vault (referencia opaca `device.<id>.credential.<id>`, `accountLabel: "fwlab"`); access method `ssh:22` en estado `credentialed`.
- `ssh-readonly-terminal`: prueba SSH read-only OK por el broker:
  `{"ok":true,"status":"succeeded","transport":"ssh"}`. Salida (identidad, estado/OS e interfaces):
  ```
  ead9ba27523d
  ---identity---
  vendor=LabSim
  model=FW-2000-Sim
  role=firewall
  site=lab
  firmware=sim-1.0.0
  ---kernel---
  Linux 6.12.76-linuxkit aarch64
  PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
  ---interfaces---
  eth0@if42 UP 172.28.200.10/24
  ```
  Nota inofensiva en stderr: el usuario `nextjs` no tiene `~/.ssh`; con `StrictHostKeyChecking=no` (politica del broker del baseline) la prueba igual completa.
- `api-evidence`: la ficha expone metodo (SSH), resultado (`succeeded`), timestamps (`startedAt`/`completedAt`) y evidencia redactada; el registro de auditoria lista la secuencia completa (login, alta, credencial, ciclos de scan, nmapDeep).

Pantallazos del recorrido en `lab/evidence/` (01-web-home.png a 07-ssh-readonly-output.png) y evidencia estructurada redactada en `lab/evidence/probe-evidence.json`.

### Brechas verificadas que impiden el cierre completo

| Hallazgo | Evidencia | Implica |
|---|---|---|
| El baseline no permite **crear sitios** | `POST /api/sites` devuelve 404; no hay ruta/UI; `sites` solo contiene el por defecto `site.local.default`; el dispositivo queda en `siteId="site.local.default"` | Tarea "crear el primer sitio desde la UI vacia" queda pendiente -> Sprint 0 sigue `in_progress` |
| El baseline no tiene un paso de "confirmacion explicita" antes de la prueba | El terminal remoto ejecuta el comando directamente con la sesion autenticada | La confirmacion explicita se implementa en el onboarding wizard (Sprint 2) |
| El runtime del baseline no instala `sshpass`/`openssh-client` (los exige su broker SSH) | Se agrego la capa `lab/steward-tools.Dockerfile` | El collector SSH de produccion se reimplementa en Sprint 4 |
| `StrictHostKeyChecking=no` en el broker SSH | Codigo `protocol-broker.ts` | Reemplazo en Sprint 4 (host key policy) |
| Vault AES-GCM + SQLite + `NET_ADMIN`/`NET_RAW` | REUSE_MATRIX / ADR-0003/0006 | Sprint 1 (vault), Sprint 3 (control plane sin privilegios) |

## Evidencia funcional pendiente

| Paso | Resultado requerido | Estado |
|---|---|---|
| Crear un sitio desde la UI vacia | Alta persistida de un sitio distinto al por defecto | `pending` (bloqueado por el baseline; Sprint 2) |
| Resto del recorrido (dispositivo, credencial SSH, prueba read-only, ficha) | Verificado arriba | `verified` |

## Anexo (historial del baseline, 2026-08-11)
