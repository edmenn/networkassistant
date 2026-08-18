# Checklist de gate de sprint

Plantilla obligatoria. Un sprint solo se marca `done` cuando esta checklist esta completada y verificada.

> Estado de cada fila: `verified` (con salida real de comando en el estado actual) o `pending`. **Una sola fila `pending` deja el sprint abierto (`in_progress`), nunca `done`.**

## Sprint: `0` · Fecha: `2026-08-17/18`

## A. Evidencia por comando

| # | Item del gate | Comando exacto | Resultado esperado | Resultado verificado (salida) | Estado |
|---|---|---|---|---|---|
| 1 | Decision sustentada sobre Steward | `git -C <clone> rev-parse HEAD` | Commit `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` | `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` (ADR-0002, REUSE_MATRIX, licencia MIT) | `verified` |
| 2 | Entorno web desde Docker | `docker compose -f lab/compose.lab.yml up --build -d` + `curl http://127.0.0.1:3010/api/health` | UI operable, health ok | `{"ok":true,"version":1,"devices":0,"vault":{"ready":true}}`; contenedores `steward-sprint0-web` y `fw-lab-01` `(healthy)` | `verified` |
| 3 | Navegador -> alta de firewall | `docker compose -f lab/compose.lab.yml exec steward node /app/lab/probe.mjs` (Playwright) | Bootstrap Owner, add device `fw-lab-01` | pasos `open-web`,`authenticate`,`add-device` OK; dispositivo `69a4ee76-...` `172.28.200.10`, `siteId=site.local.default` | `verified` |
| 4 | Superficie SSH observada | `GET /api/devices` tras `POST /api/agent/run` | `protocols:["ssh"]`, servicio 22 | `protocols:["ssh"]`, `services:[{port:22,name:"ssh",banner:"SSH-2.0-OpenSSH_9.2p1..."}]`, conf 0.978975, evidencia `ssh_banner`,`tcp_open` | `verified` |
| 5 | Credencial SSH sintetica guardada | probe -> Manage/Access/Add Credential | credencial en vault (ref opaca) | `credentials:[{protocol:"ssh",accountLabel:"fwlab",vaultSecretRef:"device.<id>.credential.<id>"}]`, access `ssh:22` `credentialed` | `verified` |
| 6 | Prueba SSH read-only | probe -> Remote terminal | identidad/estado/interfaces o `unknown` | `{"ok":true,"status":"succeeded","transport":"ssh"}`; salida `vendor=LabSim, model=FW-2000-Sim, role=firewall`, kernel/OS Debian 12, `eth0 UP 172.28.200.10/24` | `verified` |
| 7 | Ficha web con metodo/resultado/timestamp/evidencia | probe -> `api-evidence` (GET devices + adoption + audit-events) | metodo, resultado, timestamps, evidencia redactada | protocolo SSH, `succeeded`, `startedAt`/`completedAt`, evidencia `ssh_banner`/`tcp_open`, auditoria completa | `verified` |
| 8 | Crear sitio desde la UI vacia | `POST /api/sites` (no existe ruta); `GET /api/state` | alta de sitio distinto al por defecto | `POST /api/sites` = 404; `sites` solo contiene `site.local.default` | `pending` |

- [ ] Todas las filas estan `verified` con salida real del estado actual. -> NO: la fila 8 queda `pending`.
- [x] `docs/IMPLEMENTATION_STATUS.md` actualizado.
- [x] Sin secretos en UI, API, logs, trazas, auditoria ni prompts (`git status`/`git diff` revisados). Credenciales presentes son sinteticas de laboratorio.
- [x] Sin decisiones abiertas necesarias para el siguiente sprint (ADR revisados). La creacion de sitios es tarea de Sprint 2, no decision abierta de ADR.

## B. Revision adversarial (blueprint 17)

- **Revisado por:** OpenCode (deepseek-v4-flash) — ejecutor unico disponible en esta sesion.
- **Fecha:** 2026-08-18
- **Independiente (SI/NO):** NO. Limitacion registrada: no hay una segunda IA disponible en esta sesion; se hace segunda pasada en contexto limpio y se marca explicitamente que la revision independiente no ocurrio.

Checklist:

- [x] Requisitos del blueprint sin tarea o prueba asignada. -> La tarea "crear sitio" no tiene prueba asignable en el baseline; registrada como gap en el evidence y checklist A-8.
- [x] Dependencias circulares o paralelismo falso. -> No detectadas en el recorrido.
- [x] Secretos, permisos o destinos con alcance excesivo. -> Solo credenciales sinteticas de laboratorio; ninguna real. `NET_ADMIN`/`NET_RAW` heredados del baseline y documentados como exclusion (no se usaron en el flujo SSH).
- [x] Rollback declarado pero no verificable. -> Sprint 0 no declara rollback de producto; el teardown del laboratorio es `docker compose down -v`.
- [x] Uso de IA donde corresponde logica determinista. -> No se uso IA en el recorrido; todo es determinista.
- [x] Abstracciones especulativas o componentes sin consumidor. -> No se anadio codigo de producto; solo el laboratorio y la capa de herramientas SSH.
- [x] Criterios de cierre que solo prueban build y no comportamiento real. -> Se probo el flujo real de extremo a extremo con Playwright + SSH real (ver A-3 a A-7).
- [x] Hallazgos criticos corregidos antes del cierre. -> El unico hallazgo (creacion de sitios) no es una vulnerabilidad; es un gap funcional que se delega a Sprint 2 y mantiene Sprint 0 `in_progress`.

## C. Definicion de Done (confirmacion)

Solo marco este sprint `done` cuando:

- [ ] El cambio minimo cumple el criterio del sprint. -> No: la creacion de sitios sigue pendiente (A-8).
- [x] Las pruebas automatizadas relevantes pasan (evidencia A).
- [x] El flujo afectado se verifico de extremo a extremo (evidencia A).
- [x] No aparecen secretos (solo sinteticos de laboratorio, documentados).
- [x] Documentacion y estado actualizados.
- [x] La evidencia de cierre es reproducible por otra IA (comandos en `lab/README.md` y evidence).
- [x] La revision adversarial (B) quedo registrada (marcada como limitacion por falta de segunda IA).

## Resultado

- Estado del sprint: `in_progress`
- **No cerrar** con filas `pending` o con revision adversarial sin registro. -> La fila A-8 queda `pending`; por tanto Sprint 0 permanece `in_progress`.
- No se crea commit `gate(sprint-0)` en este cierre porque el gate no esta totalmente verificado (falta la creacion de sitio).
