# Arquitectura objetivo

Ver ADR-0001 a ADR-0007. Este documento describe la arquitectura objetivo derivada de la auditoría de Steward.

## Vista de contenedores

```text
Navegador
   |
   v
Control plane: UI + API + RBAC + políticas + auditoría
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

Opcionales: LiteLLM (IA), Guacamole (RDP/VNC/SSH interactivo), conector Nautobot
```

## Componentes y responsabilidades

| Componente | Responsabilidad | Procedencia |
|---|---|---|
| Control plane (Next 16) | UI, API, RBAC, políticas, auditoría, orquestación | `reuse`/`adapt` de Steward |
| Postgres | Estado persistente, dominio, auditoría | `replace` |
| Redis | Cola de jobs, idempotencia, dead-letter | `replace` |
| OpenBao | Custodia/entrega temporal de secretos (`SecretBackend`) | `replace` |
| Worker aislado | Ejecuta tareas firmadas y acotadas; redes permitidas | nuevo |
| Sensor de sitio | Ejecución remota; conexión saliente mTLS | nuevo |
| LiteLLM (opcional) | Gateway de IA; sin secretos ni autorización | `add` |
| Guacamole (opcional) | Sesiones interactivas auditadas | `adapt` |
| Conector Nautobot (opcional) | Importación/sincronización | `add` |

## Límites de confianza

| Zona | Puede | No puede |
|---|---|---|
| Navegador | Usar API según RBAC | Leer secretos/credenciales de workers |
| Control plane | Autorizar, planificar, auditar | Capturar tráfico ni administrar redes |
| LiteLLM/modelos | Procesar contexto redactado | Recibir secretos, cookies, claves o PCAP |
| Worker | Ejecutar tarea firmada y acotada | Elegir objetivos fuera de allowlist |
| Sensor | Acceder a redes autorizadas del sitio | Aceptar conexiones administrativas públicas por defecto |
| OpenBao | Entregar secreto temporal a identidad autorizada | Exponer valor por UI/API/logs/auditoría |

## Contrato de trabajo

Todo job contiene: `job_id` + `idempotency_key`; actor y autorización efectiva; sitio/equipo/endpoint/método permitidos; clasificación (`observe`, `probe`, `low_risk_change`, `high_risk_change`, `destructive`); parámetros validados; secreto referenciado (nunca embebido); timeout/reintento/ventana; preflight y criterio de éxito; rollback declarado o `unavailable`; política de redacción/retención; firma que impida alterar el alcance.

## Transiciones funcionales obligatorias

Alta de equipo (transaccional), descubrimiento, investigación con IA, cambio aprobado. Detalles en el blueprint §8.
