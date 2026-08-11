# UPSTREAM — Steward

## Identidad

- **Repo:** `https://github.com/braedonsaunders/steward`
- **Licencia:** MIT (Copyright 2026 Steward Contributors).
- **Fork privado:** por crear a partir del commit de referencia.

## Commit fijado

| Tipo | Hash | Fecha | Nota |
|---|---|---|---|
| Referencia Sprint 0 | `ea6a476` | 2026-04-28 | Último commit (bot "codeflow-card") |

> **Acción pendiente:** el clon para auditoría fue shallow (`--depth 1`). Antes de fijar el commit definitivo para producción, hacer un clon completo y elegir el último commit sustantivo de código (excluyendo commits `[skip ci]` del bot de cards). Registrar aquí el hash elegido.

## Estrategia de sincronización

- Mantener un **fork privado** como única fuente para este proyecto.
- Fijar el commit elegido en un ref inmutable (tag/`pin`).
- Actualizar el fork solo de forma deliberada y tras re-auditar (no pull automático).
- No incorporar cambios de código nuevo del upstream sin revisión de seguridad.

## Conflictos esperados

- **Persistencia:** el upstream asume SQLite; nuestro reemplazo a Postgres entrará en conflicto en cada merge de código de acceso a estado.
- **Vault:** sustitución del módulo `src/lib/security/vault.ts` y `os-keystore.ts`; cualquier cambio upstream ahí se reaplica.
- **Red/descubrimiento:** el upstream mantiene escaneo en el control plane; nosotros lo eliminamos (conflicto deliberado y permanente).
- **Identidad sensor:** el upstream no tiene el modelo mTLS; se añade sin superponerse.

## Regla

Si el upstream cambia algo que reutilizamos (`reuse`/`adapt`), evaluar el diff y portarlo; si toca algo que reemplazamos/excluimos, ignorarlo y documentar el conflicto resuelto en este archivo.
