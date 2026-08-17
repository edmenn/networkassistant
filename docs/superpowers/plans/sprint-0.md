# Plan — Sprint 0: Fundación, entorno web y primer firewall SSH read-only

Fecha: 2026-08-17. El sprint combina decisiones heredadas con un vertical slice funcional; el código nuevo debe verificarse con TDD cuando corresponda.

## Resultado observable

Decisión sustentada sobre Steward (commit + licencia + auditoría), documentación de arquitectura y un vertical slice funcional desde el navegador hasta un firewall SSH read-only de laboratorio.

## Tareas

1. **Preparar/registrar herramientas** — ECC 2.2.0, Graphify 0.9.22, Superpowers y hooks TK verificados. → `docs/TOOLING.md`. ✅
2. **Bootstrap** — `git init -b main`, `.gitignore`, `AGENTS.md`. ✅
3. **Auditar Steward** — clon completo, mirror privado y tag; licencia MIT, Graphify, SCA, tests, lint, build y runtime Docker AMD64. ✅
4. **ADR** — 0001 a 0007. ✅
5. **Matrices y docs** — REUSE_MATRIX, UPSTREAM, ARCHITECTURE, THREAT_MODEL, CAPABILITY_MATRIX, IMPLEMENTATION_STATUS, TOOLING. ✅
6. **Laboratorio sintético** — definir alcance (ADR-0007). ✅
7. **Entorno web** — levantar Compose, abrir la UI desde navegador y verificar el empty state de sitio/equipo. → evidencia pendiente.
8. **Primer firewall SSH** — crear sitio, registrar firewall, endpoint SSH y credencial sintética; ejecutar prueba read-only y mostrar evidencia. → evidencia pendiente.
9. **Gate y actualización de SPRINTS.md** — cerrar solo cuando el recorrido funcional y la checklist A/B/C tengan salida real. → Sprint 0 `in_progress` hasta entonces.

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

Existe decisión sustentada sobre Steward y funciona el recorrido `web -> sitio -> firewall -> SSH read-only -> evidencia`. Si falla, Sprint 0 permanece `in_progress` y no se inicia Sprint 1.

## Cierre

El baseline histórico está documentado en `docs/SPRINT_0_EVIDENCE.md`, pero Sprint 0 permanece `in_progress` hasta completar el vertical slice web -> sitio -> firewall SSH read-only y registrar su evidencia real. La remediación profunda de dependencias y la seguridad fundacional siguen siendo condiciones de Sprint 1.
