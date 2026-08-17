# Arquitectura objetivo

Ver ADR-0001 a ADR-0009. Este documento describe la arquitectura objetivo derivada de la auditoría de Steward.

## Vista de contenedores

La API y los workers son el núcleo. La web propia es onboarding/reportes. Codex/OpenCode operan por API/MCP. Steward aporta módulos seleccionados; sus módulos inseguros se sustituyen detrás de contratos estables.

```text
Web mínima / Codex / OpenCode
   |
   v
Control plane: API + web mínima + RBAC + políticas + auditoría
   |              |                 |
   v              v                 v
Postgres        Redis            OpenBao
   |              |                 |
   v              v                 v
Orquestador de trabajos (Redis/BullMQ)
   |
   +---- worker aislado local (sin NET_ADMIN/NET_RAW)
   |
   +---- sensor de sitio --saliente/mTLS--> control plane
             |
             v
       redes y equipos permitidos

   +---- browser worker Playwright --saliente/mTLS--> equipos web autorizados

Opcionales: LiteLLM (IA), conector Nautobot, Oxidized
```

## Componentes y responsabilidades

| Componente | Responsabilidad | Procedencia |
|---|---|---|
| Control plane (Next 16) | API, web mínima, RBAC, políticas, auditoría, orquestación | `reuse`/`adapt` selectivo de Steward |
| Postgres | Estado persistente, dominio, auditoría | `replace` |
| Redis | Cola de jobs, idempotencia, dead-letter | `replace` |
| OpenBao | Custodia/entrega temporal de secretos (`SecretBackend`) | `replace` |
| Worker aislado | Ejecuta tareas firmadas y acotadas; redes permitidas | nuevo |
| Sensor de sitio | Ejecución remota; conexión saliente mTLS | nuevo |
| LiteLLM (opcional) | Gateway de IA; sin secretos ni autorización | `add` |
| Browser worker | Sesiones web temporales y capabilities Playwright | `adapt` |
| Conector Nautobot (opcional) | Importación/sincronización | `add` |

## Límites de confianza

| Zona | Puede | No puede |
|---|---|---|
| Navegador | Usar API según RBAC | Leer secretos/credenciales de workers |
| Control plane | Autorizar, planificar, auditar | Capturar tráfico ni administrar redes |
| LiteLLM/modelos | Procesar contexto redactado | Recibir secretos, cookies, claves o PCAP |
| Worker | Ejecutar tarea firmada y acotada | Elegir objetivos fuera de allowlist |
| Sensor | Acceder a redes autorizadas del sitio | Aceptar conexiones administrativas públicas por defecto |
| Browser worker | Abrir sesión web temporal y ejecutar capabilities aprobadas | Exponer credenciales, navegar fuera de allowlist o ejecutar acciones libres |
| OpenBao | Entregar secreto temporal a identidad autorizada | Exponer valor por UI/API/logs/auditoría |

## Contrato de trabajo

Todo job contiene: `job_id` + `idempotency_key`; actor y autorización efectiva; sitio/equipo/endpoint/método permitidos; clasificación (`observe`, `probe`, `low_risk_change`, `high_risk_change`, `destructive`); parámetros validados; secreto referenciado (nunca embebido); timeout/reintento/ventana; preflight y criterio de éxito; rollback declarado o `unavailable`; política de redacción/retención; firma que impida alterar el alcance.

## Transiciones funcionales obligatorias

Alta de equipo (transaccional), descubrimiento, investigación con IA, cambio aprobado. Detalles en el blueprint §8.
