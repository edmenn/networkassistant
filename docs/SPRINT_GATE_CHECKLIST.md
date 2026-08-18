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
| — | Alta de sitio | Fuera del alcance de Sprint 0; se verifica en Sprint 2 | CRUD de sitios y alta multi-sitio | El laboratorio usa intencionalmente `site.local.default` | `out_of_scope` |

- [x] Todas las filas del alcance de Sprint 0 estan `verified` con salida real del estado actual.
- [x] `docs/IMPLEMENTATION_STATUS.md` actualizado.
- [x] Sin secretos en UI, API, logs, trazas, auditoria ni prompts (`git status`/`git diff` revisados). Credenciales presentes son sinteticas de laboratorio.
- [x] Sin decisiones abiertas necesarias para el siguiente sprint (ADR revisados). El alta de sitios queda especificada para Sprint 2.

## B. Revision adversarial (blueprint 17)

- **Revisado por:** OpenCode (deepseek-v4-flash) — ejecutor unico disponible en esta sesion.
- **Fecha:** 2026-08-18
- **Independiente (SI/NO):** NO. Limitacion registrada: no hay una segunda IA disponible en esta sesion; se hace segunda pasada en contexto limpio y se marca explicitamente que la revision independiente no ocurrio.

Checklist:

- [x] Requisitos del blueprint con tarea y sprint asignados. -> El alta de sitios queda asignada a Sprint 2; Sprint 0 prueba el flujo sobre el sitio sintético por defecto.
- [x] Dependencias circulares o paralelismo falso. -> No detectadas en el recorrido.
- [x] Secretos, permisos o destinos con alcance excesivo. -> Solo credenciales sinteticas de laboratorio; ninguna real. `NET_ADMIN`/`NET_RAW` heredados del baseline y documentados como exclusion (no se usaron en el flujo SSH).
- [x] Rollback declarado pero no verificable. -> Sprint 0 no declara rollback de producto; el teardown del laboratorio es `docker compose down -v`.
- [x] Uso de IA donde corresponde logica determinista. -> No se uso IA en el recorrido; todo es determinista.
- [x] Abstracciones especulativas o componentes sin consumidor. -> No se anadio codigo de producto; solo el laboratorio y la capa de herramientas SSH.
- [x] Criterios de cierre que solo prueban build y no comportamiento real. -> Se probo el flujo real de extremo a extremo con Playwright + SSH real (ver A-3 a A-7).
- [x] Hallazgos criticos corregidos antes del cierre. -> No hay hallazgos críticos en el alcance de Sprint 0; el alta de sitios es trabajo explícito de Sprint 2.

## C. Definicion de Done (confirmacion)

Solo marco este sprint `done` cuando:

- [x] El cambio minimo cumple el criterio del sprint. -> El flujo del alcance (web -> firewall -> SSH read-only -> evidencia) está verificado en A-1 a A-7.
- [x] Las pruebas automatizadas relevantes pasan (evidencia A).
- [x] El flujo afectado se verifico de extremo a extremo (evidencia A).
- [x] No aparecen secretos (solo sinteticos de laboratorio, documentados).
- [x] Documentacion y estado actualizados.
- [x] La evidencia de cierre es reproducible por otra IA (comandos en `lab/README.md` y evidence).
- [x] La revision adversarial (B) quedo registrada (marcada como limitacion por falta de segunda IA).

## Resultado

- Estado del sprint: `in_progress` hasta emitir el commit formal `gate(sprint-0)` después de limpiar el árbol y repetir la verificación final.
- No se crea todavía el commit `gate(sprint-0)` porque esta edición corrige el alcance; la comprobación final debe ejecutarse sobre el estado actualizado.
