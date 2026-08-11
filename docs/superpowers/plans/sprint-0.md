# Plan — Sprint 0: Fundación y reuse gate

Fecha: 2026-08-11. TDD no aplica (sprint de decisión y documentación, sin código de producto).

## Resultado observable

Decisión sustentada sobre Steward (commit + licencia + auditoría) y un set de documentos/ADR que deja un camino mínimo para adaptar/reemplazar cada módulo bloqueante. No se inicia desarrollo funcional hasta cerrar el gate.

## Tareas

1. **Preparar/registrar herramientas** — ECC 2.2.0, Graphify 0.9.22, Superpowers y hooks TK verificados. → `docs/TOOLING.md`. ✅
2. **Bootstrap** — `git init -b main`, `.gitignore`, `AGENTS.md`. ✅
3. **Auditar Steward** — clon completo, mirror privado y tag; licencia MIT, Graphify, SCA, tests, lint, build y runtime Docker AMD64. ✅
4. **ADR** — 0001 a 0007. ✅
5. **Matrices y docs** — REUSE_MATRIX, UPSTREAM, ARCHITECTURE, THREAT_MODEL, CAPABILITY_MATRIX, IMPLEMENTATION_STATUS, TOOLING. ✅
6. **Laboratorio sintético** — definir alcance (ADR-0007). ✅
7. **Gate y actualización de SPRINTS.md** — evidencia reproducible y Sprint 0 `done`. ✅

## Archivos creados

- `AGENTS.md`, `.gitignore`
- `docs/ADR/0001-0007*.md`
- `docs/REUSE_MATRIX.md`, `UPSTREAM.md`, `ARCHITECTURE.md`, `THREAT_MODEL.md`, `CAPABILITY_MATRIX.md`, `IMPLEMENTATION_STATUS.md`, `TOOLING.md`, `superpowers/plans/sprint-0.md`

## Evidencia

- Clon de Steward en temp; commit `ea6a476`; licencia MIT.
- Mirror privado `edmenn/asistente-networking-steward`, tag `upstream-ea6a476-sprint0`.
- Graphify: 4.531 nodos, 12.857 relaciones, diagnostico sin endpoints invalidos ni colisiones.
- `npm test`: 34 archivos, 91 pruebas aprobadas; lint y build aprobados.
- `npm audit`: 16 vulnerabilidades (2 critical, 11 high, 1 moderate, 2 low), clasificadas como bloqueo de produccion.
- Confirmacion en codigo de: vault local, SQLite, `runShell` y capacidades de red en control plane.

## Criterio de aceptación / gate

Existe decisión sustentada sobre Steward y un camino mínimo para adaptar/reemplazar cada módulo bloqueante. Si falla, no se inicia desarrollo funcional.

## Cierre

Gate cerrado con evidencia en `docs/SPRINT_0_EVIDENCE.md`. La remediacion de dependencias y la seguridad fundacional son condiciones de Sprint 1, no deuda oculta de Sprint 0.
