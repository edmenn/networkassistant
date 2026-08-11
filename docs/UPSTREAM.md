# UPSTREAM — Steward

## Identidad

- **Repo:** `https://github.com/braedonsaunders/steward`
- **Licencia:** MIT (Copyright 2026 Steward Contributors).
- **Mirror privado:** `https://github.com/edmenn/asistente-networking-steward` (`PRIVATE`). GitHub no permite un fork privado de un repositorio publico, por eso se usa un mirror independiente.

## Commit fijado

| Tipo | Hash | Fecha | Nota |
|---|---|---|---|
| Baseline auditado | `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` | 2026-04-28 | HEAD upstream auditado; el cambio del commit solo agrega la card de Codeflow |
| Último cambio sustantivo anterior | `e0b51e70047c5a596930a9735265dafb59e0c036` | 2026-04-28 | Referencia para revisar cambios funcionales |

El baseline se obtuvo con un clon completo y se publico con la etiqueta anotada `upstream-ea6a476-sprint0` en el mirror privado.

## Estrategia de sincronización

- Mantener el **mirror privado** como unica fuente para este proyecto.
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
