# Matriz de reutilización — Steward

Commit de referencia: `ea6a476` (upstream `braedonsaunders/steward`, MIT).
Ver ADR-0002 para el razonamiento.

Leyenda: `reuse` (usar tal cual) · `adapt` (modificar) · `replace` (sustituir) · `exclude` (descartar).

## UI y API

| Módulo | Clasificación | Nota |
|---|---|---|
| Next.js 16 + React 19 + TypeScript | `reuse` | Base de la consola |
| Rutas API REST | `adapt` | Versionado, envelope `data/meta/links`, errores estructurados, autorización por recurso |
| Pantallas (devices, topology, approvals, jobs, etc.) | `adapt` | Alinear a la navegación y pantallas prioritarias del blueprint |
| Sistema visual (tokens, dark/light) | `adapt` | Aplicar Data-Dense Dashboard y WCAG AA |

## Identidad y autorización

| Módulo | Clasificación | Nota |
|---|---|---|
| Auth (session/API token/OIDC/LDAP) | `reuse` | Base sólida |
| RBAC | `adapt` | Extender a usuario/sitio/equipo/método/secreto/clase de acción; `deny` prevalece |
| Identidad worker/sensor mTLS | `replace` | No existe; construirlo (ADR-0004) |

## Estado y datos

| Módulo | Clasificación | Nota |
|---|---|---|
| SQLite / `better-sqlite3` | `replace` | → Postgres (ADR-0006) |
| Auditoría (SQLite) | `adapt` | → append-only con evidencia de integridad |
| Workers en proceso / MQTT | `replace` | → Redis cola (ADR-0006) |
| Vault AES-GCM (`vault.key`) | `replace` | → OpenBao vía `SecretBackend` (ADR-0003) |

## Operaciones y extensibilidad

| Módulo | Clasificación | Nota |
|---|---|---|
| Playbooks, aprobaciones, preflight, verificación, rollback | `reuse` | Cumple contrato de trabajo |
| Adaptadores / packs (manifiestos, firma Ed25519) | `reuse` | Formato de plugin (ADR-0005) |
| Policy engine / maintenance windows | `adapt` | Alinear a clasificación de riesgo del blueprint |
| Incidentes / findings / investigaciones | `reuse`/`adapt` | Reescribir investigaciones para IA redactada |

## Red y ejecución (crítico)

| Módulo | Clasificación | Nota |
|---|---|---|
| Descubrimiento de red (nmap/tshark/ARP/SSDP/mDNS) | `exclude` | Se reimplementa en workers/sensores aislados |
| `runShell`/ejecución shell en el control plane | `exclude` | Quitar del control plane |
| Navegador/playwright | `exclude` | Mejor esfuerzo; no fuente universal de configuración |
| Collector SSH read-only | `replace` | Reimplementar con contrato de adaptador y host key policy |
| Collector SNMPv3 read-only | `replace` | Reimplementar; marcar v1/v2c como riesgo |

## Integraciones opcionales

| Módulo | Clasificación | Nota |
|---|---|---|
| Guacamole / `guacd` | `adapt` (opcional) | Perfil opt-in auditado; sin descubrimiento |
| LiteLLM | `add` (opcional) | Gateway de IA interno (Sprint 6+) |
| Nautobot | `add` (opcional) | Conector de importación/sincronización |
| Netclaw / SubNetree | `exclude` | No forman parte del runtime |
