# Estado de herramientas (Sprint 0)

Registro del estado real de las herramientas exigidas por el blueprint y su decisión. Verificado el 2026-08-11.

| Herramienta | Estado | Decisión |
|---|---|---|
| `ecc@ecc` | **No instalado** (no está en PATH ni en directorios de skills conocidos) | No es bloqueante para Sprint 0; usar skills de código ya instaladas. Registrar la ausencia como deuda. |
| Graphify (`~/.local/bin/graphify`) | **Instalado**; ejecutado `graphify install opencode` | Usar `/graphify .` cuando exista código; generará `graphify-out/graph.json`. |
| Skills ECC (product-capability, api-design, security-review, tdd-workflow, architecture-decision-records) | **No presentes** | Sustituir con skills instaladas en `~/.agents/skills` / `~/.claude/skills`; aplicar los mismos principios (TDD, ADR, security review). |
| Hooks TK (`tk`) | **Presentes** en `.github/hooks/` | Usar `tk` para salida eficiente de shell. |
| Docker Desktop | **v28.5.1** + Compose v2.40.3 | Entorno de desarrollo según blueprint. |

## Deuda deliberada

- **`ecc@ecc` y skills ECC ausentes.** Límite: revisar en Sprint 1. Riesgo: bajo (hay sustitutos). Condición de revisión: si se instalan, migrar a ellos.
- **Commit definitivo de Steward y auditoría CVE.** Límite: antes de iniciar desarrollo funcional (Gate de Sprint 0). Riesgo: medio.

> No se afirma una revisión independiente de ECC porque no existe instalación; se registra esta limitación.
