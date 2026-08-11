# Estado de herramientas (Sprint 0)

Registro del estado real de las herramientas exigidas por el blueprint y su decisión. Verificado el 2026-08-11.

| Herramienta | Estado | Decisión |
|---|---|---|
| ECC | **Instalado y cacheado**, version `2.2.0`, en `~/.codex/plugins/cache/ecc/ecc/2.2.0` | Usar la skill ECC pertinente por tarea; Superpowers gobierna proceso y verificacion. |
| Graphify (`~/.local/bin/graphify`) | **Instalado**, version `0.9.22`; mapa generado | Reutilizar `graphify-out/graph.json` antes de explorar Steward y regenerarlo al cambiar el baseline. |
| Skills ECC | **Presentes** en el plugin ECC 2.2.0 | Seleccionar solo las aplicables; no copiar reglas genericas al contrato local. |
| Hooks TK (`tk`) | **Presentes** en `.github/hooks/` | Usar `tk` para salida eficiente de shell. |
| Docker Desktop | **Engine v29.1.3** | Runtime de laboratorio; baseline validado como `linux/amd64`. |

## Regla operativa

ECC, Superpowers, Graphify y UI/UX son capacidades globales. Las decisiones de producto, seguridad y entrega siguen viviendo en este repositorio. La evidencia exacta del gate esta en `docs/SPRINT_0_EVIDENCE.md`.
