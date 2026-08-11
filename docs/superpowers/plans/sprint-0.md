# Plan — Sprint 0: Fundación y reuse gate

Fecha: 2026-08-11. TDD no aplica (sprint de decisión y documentación, sin código de producto).

## Resultado observable

Decisión sustentada sobre Steward (commit + licencia + auditoría) y un set de documentos/ADR que deja un camino mínimo para adaptar/reemplazar cada módulo bloqueante. No se inicia desarrollo funcional hasta cerrar el gate.

## Tareas

1. **Preparar/registrar herramientas** — ecc (ausente), graphify (instalado), skills ECC (ausentes), hooks TK. → `docs/TOOLING.md`. ✅
2. **Bootstrap** — `git init -b main`, `.gitignore`, `AGENTS.md`. ✅
3. **Auditar Steward** — clonar upstream, verificar licencia MIT, mapear módulos, confirmar brechas (vault AES-GCM, red en el control plane, SQLite, cola en proceso). ✅
4. **ADR** — 0001 a 0007. ✅
5. **Matrices y docs** — REUSE_MATRIX, UPSTREAM, ARCHITECTURE, THREAT_MODEL, CAPABILITY_MATRIX, IMPLEMENTATION_STATUS, TOOLING. ✅
6. **Laboratorio sintético** — definir alcance (ADR-0007). ✅
7. **Gate y actualización de SPRINTS.md** — marcar Sprint 0 `done`.

## Archivos creados

- `AGENTS.md`, `.gitignore`
- `docs/ADR/0001-0007*.md`
- `docs/REUSE_MATRIX.md`, `UPSTREAM.md`, `ARCHITECTURE.md`, `THREAT_MODEL.md`, `CAPABILITY_MATRIX.md`, `IMPLEMENTATION_STATUS.md`, `TOOLING.md`, `superpowers/plans/sprint-0.md`

## Evidencia

- Clon de Steward en temp; commit `ea6a476`; licencia MIT.
- Confirmación en código de: `src/lib/security/vault.ts` (AES-GCM + `vault.key`), `os-keystore.ts` (fallback machine-derived), `discovery/active.ts` (nmap/ping/`runShell` en proceso), `better-sqlite3`, ausencia de engine de cola real.

## Criterio de aceptación / gate

Existe decisión sustentada sobre Steward y un camino mínimo para adaptar/reemplazar cada módulo bloqueante. Si falla, no se inicia desarrollo funcional.

## Cierre

Registrar hallazgos pendientes (commit definitivo, CVE) en IMPLEMENTATION_STATUS y marcar Sprint 0 `done` en SPRINTS.md.
