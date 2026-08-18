# Estado de implementación

## Producto objetivo actual

El producto final es un copiloto de infraestructura API-first operado desde Codex/OpenCode. La web cubre onboarding, credenciales referenciadas, pruebas de conexión, inventario, evidencia y reportes. El Browser Web Adapter permite operar equipos web-only desde capabilities/playbooks aislados. Steward se reutiliza selectivamente; no se adopta toda su UI.

Matriz de requisitos del blueprint y su estado. Se actualiza en cada sprint (Definición de Done).

Estados: `done` · `in_progress` · `not_started` · `blocked`.

## Requisitos del blueprint

| # | Requisito | Estado | Nota |
|---|---|---|---|
| R01 | Instalación vacía reproducible | `in_progress` | Web + laboratorio reproducibles desde checkout limpio (`lab/`); el alta de sitios pertenece a Sprint 2 |
| R02 | Alta transaccional multi-método | `not_started` | Sprint 2; Sprint 0 valida el caso mínimo SSH end-to-end |
| R03 | Secretos no recuperables fuera del vault | `in_progress` | OpenBao integrado en runtime (Sprint 1): el control plane guarda secretos en OpenBao vía `SecretBackend`; falta el drill end-to-end del gate |
| R04 | Rotación y restore del vault | `not_started` | Sprint 1 |
| R05 | Control plane sin privilegios de red | `not_started` | Sprint 3 (brecha detectada en Sprint 0) |
| R06 | Workers/sensores aislados | `not_started` | Sprint 3 |
| R07 | Evidencia/topología con fuente, tiempo, confianza y clasificación | `not_started` | Sprints 4-5 |
| R08 | `unknown` ante falta de evidencia | `not_started` | Sprint 4 |
| R09 | IA configurable y explicable sin secretos | `not_started` | Sprint 6; solo investigación read-only en el primer piloto |
| R10 | Cambios con preflight/aprobación/idempotencia/verificación/rollback | `not_started` | Sprint 7 |
| R11 | Backup/restore completo en host limpio | `not_started` | Sprint 10, antes de la red real |
| R12 | Piloto read-only cerrado | `not_started` | Sprint 11; red propia, equipos de red/firewall |
| R13 | Web -> firewall SSH read-only | `done` | Verificado end-to-end sobre el sitio sintético por defecto (gate de Sprint 0); el CRUD de sitios se implementa en Sprint 2 |
| R14 | Browser Web Adapter seguro para equipos web-only | `not_started` | Sprint 4; Playwright aislado, API/MCP, vault y capabilities |

## Decisiones de Sprint 0

| Decisión | ADR | Estado |
|---|---|---|
| Stack de referencia | 0001 | `done` |
| Steward reuse/adapt/replace/exclude | 0002 | `done` |
| Vault OpenBao + `SecretBackend` | 0003 | `done` |
| Identidad mTLS worker/sensor | 0004 | `done` |
| Formato de adaptador | 0005 | `done` |
| DB Postgres + cola Redis | 0006 | `done` |
| Alcance del laboratorio | 0007 | `done` |
| Browser Web Adapter para equipos web-only | 0008 | `done` |
| Web mínima y operación API/MCP desde Codex/OpenCode | 0009 | `done` |

## Bloqueantes heredados clasificados

| Hallazgo | Severidad | Acción |
|---|---|---|
| Baseline Steward | Resuelto | Mirror privado y tag fijados a `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` |
| 16 vulnerabilidades npm (2 critical, 11 high) | Bloqueante para produccion | No reutilizar dependencias/auth/playbooks/adapters sin actualizar y reauditar en Sprint 1 |
| Control plane con `NET_ADMIN`, `NET_RAW` y shell | Bloqueante arquitectonico | Excluir esa ejecucion y moverla a workers aislados en Sprint 3 |
| Vault local y SQLite | Bloqueante arquitectonico | Reemplazar en Sprints 1 y 2 segun ADR-0003/0006 |
| Mapa estructural | Histórico | El mapa del baseline no se usa como contexto operativo; regenerar desde el checkout vigente |

## Próximo gate obligatorio

Sprint 0 esta `done` (2026-08-18): el recorrido `web -> firewall SSH read-only -> evidencia` quedo verificado sobre el sitio sintético por defecto y se emitio el commit `gate(sprint-0)` (`af29a37`). El próximo gate es Sprint 1 (seguridad fundacional y vault). El alta de sitios se implementa en Sprint 2.

## Laboratorio de Sprint 0

- `steward/`: baseline `ea6a476` vendido (mit).
- `lab/`: red ficticia `172.28.200.0/24`, firewall simulado SSH, OpenBao, capa de herramientas SSH, compose y probe de Playwright. Credenciales sinteticas.
- Web del lab en `http://127.0.0.1:3022` (el puerto `3010`/`3011` se dejaron libres para no chocar con el proyecto `Asistente-networking-steward`).
- Evidencia: `docs/SPRINT_0_EVIDENCE.md`, `docs/SPRINT_GATE_CHECKLIST.md`, `lab/evidence/`.
