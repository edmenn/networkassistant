# ADR-0002 — Decisión sobre Steward: reuse/adapt/replace/exclude

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

El blueprint requiere decidir con evidencia qué partes de Steward se reutilizan. Se auditaron el fork upstream, la licencia, dependencias y los módulos críticos.

## Datos de la auditoría

- **Upstream:** `https://github.com/braedonsaunders/steward`.
- **Commit fijado (referencia):** `ea6a4762737dc9ce57f21ff1d3e536bdfe102125` (2026-04-28, bot "codeflow-card"; verificar el último commit de código para fijar el definitivo).
- **Licencia:** MIT (Copyright 2026 Steward Contributors) — compatible con fork privado.
- **Dependencias:** ~44 (vía `better-sqlite3`, `@ai-sdk/*`, `next-auth`, `jose`, `ldapts`, `mqtt`, etc.).
- **Estado:** SQLite (`steward_state.db`, `steward_audit.db`); vault AES-256-GCM con `vault.key` + OS-keystore (fallback "machine-derived key" en Linux).

## Clasificación por módulo

| Módulo | Clasificación | Motivo |
|---|---|---|
| UI (Next 16/React 19) | `reuse` | Base de consola operacional densa ya implementada |
| API / rutas REST | `adapt` | Requiere versionado, envelope y autorización por recurso |
| RBAC y auth (next-auth/jose/ldapts/OIDC) | `reuse`/`adapt` | Base sólida; extender a recurso y sitio |
| Playbooks, aprobaciones, preflight, verificación | `reuse` | Cumple contrato de trabajo del blueprint |
| Adaptadores / packs (manifiestos, firma Ed25519) | `reuse` | Es el formato de plugin a conservar (ADR-0005) |
| Auditoría | `reuse`/`adapt` | Hacerla append-only con evidencia de integridad |
| Persistencia (SQLite) | `replace` | → Postgres (ADR-0006) |
| Cola/jobs (workers en proceso, MQTT) | `replace` | → Redis (ADR-0006) |
| Vault (AES-GCM + clave del host) | `replace` | → OpenBao vía `SecretBackend` (ADR-0003) |
| Descubrimiento de red (nmap/tshark/ARP en proceso) | `exclude`/`adapt` | Viola §3: debe moverse a workers aislados |
| Ejecución shell en el control plane | `exclude` | Quitar `runShell` de red del control plane |
| Identidad sensor remoto mTLS | `adapt` | No existe el modelo; construirlo (ADR-0004) |

## Consecuencias

- El control plane conserva UI/API/RBAC/playbooks/adapters, pero NO ejecuta escaneo de red ni guarda secretos.
- Los módulos de red se reimplementan en workers/sensores aislados en sprints posteriores.
- No se reescribe el producto completo: se reemplaza por módulo lo que no supera el gate.

## Estado de cierre

Decisión sustentada con commit y licencia; hay un camino mínimo para adaptar/reemplazar cada módulo bloqueante.
