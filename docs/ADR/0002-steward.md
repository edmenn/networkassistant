# ADR-0002 — Decisión sobre Steward: reuse/adapt/replace/exclude

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

El blueprint requiere decidir con evidencia qué partes de Steward se reutilizan. Se auditaron el fork upstream, la licencia, dependencias y los módulos críticos.

## Datos de la auditoría

- **Upstream:** `https://github.com/braedonsaunders/steward`.
- **Commit fijado:** `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` (clon completo; tag `upstream-ea6a476-sprint0` en mirror privado). El commit solo agrega la card de Codeflow; el ultimo cambio sustantivo anterior es `e0b51e70047c5a596930a9735265dafb59e0c036`.
- **Licencia:** MIT (Copyright 2026 Steward Contributors) — compatible con fork privado.
- **Dependencias:** ~44 (vía `better-sqlite3`, `@ai-sdk/*`, `next-auth`, `jose`, `ldapts`, `mqtt`, etc.).
- **Estado:** SQLite (`steward_state.db`, `steward_audit.db`); vault AES-256-GCM con `vault.key` + OS-keystore (fallback "machine-derived key" en Linux).

## Clasificación por módulo

| Módulo | Clasificación | Motivo |
|---|---|---|
| UI/API (Next 16/React 19) | `adapt` | Reutilizar web mínima y API; no adoptar consola densa completa |
| API / rutas REST | `adapt` | Requiere versionado, envelope y autorización por recurso |
| RBAC y auth (next-auth/jose/ldapts/OIDC) | `adapt` | Actualizar dependencias vulnerables, reauditar y extender a recurso y sitio |
| Playbooks, aprobaciones, preflight, verificación | `adapt` | Conservar conceptos; auditar autorizacion, shell, idempotencia y rollback antes del codigo |
| Adaptadores / packs (manifiestos, firma Ed25519) | `adapt` | Conservar formato sujeto a pruebas de firma, permisos y aislamiento (ADR-0005) |
| Auditoría | `reuse`/`adapt` | Hacerla append-only con evidencia de integridad |
| Persistencia (SQLite) | `replace` | → Postgres (ADR-0006) |
| Cola/jobs (workers en proceso, MQTT) | `replace` | → Redis (ADR-0006) |
| Vault (AES-GCM + clave del host) | `replace` | → OpenBao vía `SecretBackend` (ADR-0003) |
| Descubrimiento de red (nmap/tshark/ARP en proceso) | `exclude`/`adapt` | Viola §3: debe moverse a workers aislados |
| Ejecución shell en el control plane | `exclude` | Quitar `runShell` de red del control plane |
| Identidad sensor remoto mTLS | `adapt` | No existe el modelo; construirlo (ADR-0004) |

## Consecuencias

- El control plane conserva API/web mínima, RBAC, playbooks y adapters comprobados, pero NO ejecuta escaneo de red ni guarda secretos.
- Los módulos de red se reimplementan en workers/sensores aislados en sprints posteriores.
- No se reescribe el producto completo: se reemplaza por módulo lo que no supera el gate.

## Estado de cierre

Decision sustentada con commit, licencia, SCA, pruebas y mapa Graphify. Las 16 vulnerabilidades npm impiden reutilizar el baseline sin remediacion, pero cada modulo bloqueante tiene ruta de adaptacion, reemplazo o exclusion.
