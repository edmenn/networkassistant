# Estado de implementación

Matriz de requisitos del blueprint y su estado. Se actualiza en cada sprint (Definición de Done).

Estados: `done` · `in_progress` · `not_started` · `blocked`.

## Requisitos del blueprint

| # | Requisito | Estado | Nota |
|---|---|---|---|
| R01 | Instalación vacía reproducible | `in_progress` | Bootstrap iniciado en Sprint 0 |
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

## Hallazgos pendientes de resolver

| Hallazgo | Severidad | Acción |
|---|---|---|
| Commit definitivo de Steward (clon shallow) | Media | Clon completo y fijar último commit de código |
| Auditoría CVE de dependencias | Alta | Ejecutar `npm audit`/SCA al instalar (env de dev) |
| `ecc@ecc` no instalado | Baja | Registrar y usar sustitutos; ver `docs/TOOLING.md` |
| Graphify instalado pero sin `graphify-out/` | Baja | Generar con `/graphify .` cuando haya código |
| Skills ECC ausentes | Baja | Sustituir con skills instaladas |
