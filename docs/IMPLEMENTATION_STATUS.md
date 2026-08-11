# Estado de implementación

Matriz de requisitos del blueprint y su estado. Se actualiza en cada sprint (Definición de Done).

Estados: `done` · `in_progress` · `not_started` · `blocked`.

## Requisitos del blueprint

| # | Requisito | Estado | Nota |
|---|---|---|---|
| R01 | Instalación vacía reproducible | `done` | Baseline Steward validado por `npm ci`, build y Docker Linux AMD64; ver evidencia de Sprint 0 |
| R02 | Alta transaccional multi-método | `not_started` | Sprint 2 |
| R03 | Secretos no recuperables fuera del vault | `not_started` | Sprint 1 |
| R04 | Rotación y restore del vault | `not_started` | Sprint 1 |
| R05 | Control plane sin privilegios de red | `not_started` | Sprint 3 (brecha detectada en Sprint 0) |
| R06 | Workers/sensores aislados | `not_started` | Sprint 3 |
| R07 | Evidencia/topología con fuente, tiempo, confianza y clasificación | `not_started` | Sprints 4-5 |
| R08 | `unknown` ante falta de evidencia | `not_started` | Sprint 4 |
| R09 | IA configurable y explicable sin secretos | `not_started` | Sprint 6 |
| R10 | Cambios con preflight/aprobación/idempotencia/verificación/rollback | `not_started` | Sprint 7 |
| R11 | Backup/restore completo en host limpio | `not_started` | Sprint 10 |
| R12 | Piloto read-only cerrado | `not_started` | Sprint 11 |

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

## Bloqueantes heredados clasificados

| Hallazgo | Severidad | Acción |
|---|---|---|
| Baseline Steward | Resuelto | Mirror privado y tag fijados a `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` |
| 16 vulnerabilidades npm (2 critical, 11 high) | Bloqueante para produccion | No reutilizar dependencias/auth/playbooks/adapters sin actualizar y reauditar en Sprint 1 |
| Control plane con `NET_ADMIN`, `NET_RAW` y shell | Bloqueante arquitectonico | Excluir esa ejecucion y moverla a workers aislados en Sprint 3 |
| Vault local y SQLite | Bloqueante arquitectonico | Reemplazar en Sprints 1 y 2 segun ADR-0003/0006 |
| Graphify | Resuelto | Mapa: 4.531 nodos, 12.857 relaciones, 0 endpoints invalidos |
