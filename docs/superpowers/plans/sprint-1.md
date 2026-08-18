# Plan — Sprint 1: Seguridad fundacional y vault

Fecha: 2026-08-18. Objetivo: impedir que cualquier desarrollo posterior dependa de secretos inseguros o privilegios excesivos. Ver SPRINTS.md §Sprint 1, ADR-0003 (vault), ADR-0006 (db/cola), ADR-0002 (RBAC adapt) y `docs/THREAT_MODEL.md` (T1-T12).

Regla: seguridad primero; cambio mínimo; TDD. No usar secretos reales (solo canarios sinteticos). Cualquier contradiccion se resuelve con ADR antes de escribir codigo.

## Unidades (cada una con prueba que falla antes)

- **U1 — Contrato `SecretBackend` + backend de desarrollo + canario.** Interfaz `put/lease/revoke/rotate/backup/restore` (ADR-0003). Backend dev autocontenido (cifrado con clave separada de datos). Prueba: el valor secreto NO es recuperable por ninguna superficie publica salvo un lease autorizado; el canario no aparece en claro en estado persistido. ✅ (2026-08-18, `steward/src/lib/security/secret-backend/secret-backend.ts`, 6 canarios con `node --test`)
- **U2 — Backend OpenBao** (produccion) + contenedor de desarrollo con auto-unseal. Prueba: put/lease/revoke/rotate/backup/restore contra OpenBao real en contenedor; restauracion en host limpio reproduce secretos utilizables solo por workloads autorizados. ✅ (2026-08-18, `steward/src/lib/security/secret-backend/openbao.ts`, OpenBao 2.6.1 dev en `bao-s1-dev`, 1 canario de integracion). El restore "host limpio" definitivo se refuerza en U8/gate.
- **U3 — Redaccion central.** Canarios no aparecen en respuestas API, logs, errores, auditoria, trazas ni prompts. Prueba: canarios buscados en cada superficie. ✅ (2026-08-18, `steward/src/lib/security/redact.ts`, `Redactor` + `redact()`, 7 canarios). El cableado en cada superficie del runtime se valida en el gate.
- **U4 — RBAC por recurso.** usuario/sitio/equipo/metodo/secreto/clase de accion; `deny` prevalece. Prueba: matriz de casos permitidos y denegados. ✅ (2026-08-18, `steward/src/lib/security/rbac.ts`, `PolicyEngine` default-deny, 6 canarios de matriz).
- **U5 — Politicas de red y SSRF.** allowlist, bloqueo loopback/metadata cloud, revalidacion DNS. Prueba: intentos SSRF contra loopback/metadata/DNS cambiante bloqueados. ✅ (2026-08-18, `steward/src/lib/security/network-policy.ts`, `TargetValidator` fail-closed, 9 canarios).
- **U6 — Control plane sin `NET_ADMIN`/`NET_RAW`.** Prueba: inspeccion de capabilities del contenedor (sin NET_ADMIN/NET_RAW en runtime). ✅ (2026-08-18, `cap_drop` en `lab/compose.lab.yml`; runtime `CapBnd=...05fb`, `NET_ADMIN=0`, `NET_RAW=0`, `CapEff=0`; flujo E2E SSH re-verificado sin esos caps). Hallazgo confirmado: el vault del baseline (clave derivada de la maquina) se rompe al recrear el contenedor; refuerza la necesidad de OpenBao.
- **U7 — Auditoria append-only / integridad.** Prueba: no se puede reescribir/borrar un evento previo sin detectarlo. ✅ (2026-08-18, `steward/src/lib/security/audit.ts`, `AppendOnlyAudit` con cadena de hashes, 5 canarios).
- **U8 — Backup/restore cifrado del vault** con datos ficticios. Prueba: restore en entorno limpio reproduce los secretos. ✅ (2026-08-18, `tests/lib/security/backup-restore.test.ts`, drill OpenBao: backup cifrado -> simular perdida -> restore en backend nuevo -> usable solo por lease autorizado).
- **U9 — Vault del runtime respaldado por OpenBao.** Expone la misma API del baseline (isInitialized/isUnlocked/ensureUnlocked/setSecret/getSecret/deleteSecret/listSecretKeys); el control plane es custodio (read/write/delete/list con token admin) y la entrega a workers usa leases. `vault.ts` selecciona OpenBao cuando `OPENBAO_ADDR`/`OPENBAO_TOKEN` estan configurados (fallback al vault de archivo). ✅ (2026-08-18, `steward/src/lib/security/vault-openbao.ts` + wiring en `vault.ts`; canario U9 contra OpenBao real).

## Gate de cierre

Ningun canario es recuperable fuera del vault y el restore reproduce secretos utilizables solo por workloads autorizados.

## Rollback

Restaurar backup cifrado anterior y revocar todos los leases emitidos durante la prueba.

## Estado

`in_progress`. **U1-U9 completadas a nivel de unidad** (36 canarios, `node --test`). Integracion en runtime: vault.ts ya selecciona OpenBao cuando se configura; falta el drill end-to-end (reconstruir imagen, exponer OpenBao al contenedor, re-correr el flujo) y aplicar redaccion/RBAC/SSRF/auditoria en las superficies reales.
