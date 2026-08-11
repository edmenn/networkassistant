# Modelo de amenazas

Modelo preliminar derivado de la auditoría de Steward y de los principios del blueprint. Se refina en cada sprint (Sprint 1 = seguridad/vault, Sprint 10 = hardening).

## Activos y superficies

| Activo | Superficie |
|---|---|
| Secretos (credenciales, tokens, claves) | Vault, control plane, worker, sensor, logs |
| Estado/inventario/evidencia | Postgres, copias de backup |
| Red administrada | Sensor, workers |
| Contexto de IA | LiteLLM, prompts, evidencia redactada |
| Auditoría | Postgres, integridad |

## Amenazas principales (mapa a medidas)

| # | Amenaza | Mitigación | Sprint |
|---|---|---|---|
| T1 | Fuga de secretos en UI/API/logs/prompts/backups | Redacción central; canarios; `SecretBackend`; sin valor en eventos | 1 |
| T2 | Clave maestra derivada del host | OpenBao; separación clave/datos | 1, 3 |
| T3 | Secretos huérfanos tras fallo transaccional | Alta transaccional + compensación | 2 |
| T4 | SSRF (loopback, metadata cloud, DNS cambiante) | Allowlist, revalidación DNS, bloqueo loopback/metadata | 1 |
| T5 | Control plane con privilegios de red excesivos | Quitar NET_ADMIN/NET_RAW; workers aislados | 3 |
| T6 | Worker/sensor comprometido amplía alcance | mTLS, allowlist, jobs firmados con TTL, destinos mínimos | 3 |
| T7 | Job duplicado / alterado / vencido | Idempotency, firma, timeout, dead-letter | 3 |
| T8 | Ejecución por texto libre de IA | Playbooks deterministas; la IA solo propone | 6, 7 |
| T9 | Prompt injection desde evidencia | Contexto redactado; sin herramientas; salida estructurada | 6 |
| T10 | Datos sensibles en capturas/outputs | Redacción, retención, filtros limitados | 4 |
| T11 | Pérdida de datos / no recuperación | Backup/restore cifrado en host limpio | 10 |
| T12 | Dependencias/imágenes vulnerables | SCA, image scan, SBOM, fijar by digest | 10 |

## Supuestos y límites

- La IA nunca recibe secretos y nunca ejecuta comandos libres.
- Descubrimiento solo dentro de allowlists autorizadas.
- Captura de tráfico solo con punto de observación válido (SPAN/TAP/firewall).

## Decisión de aceptación

Se considera aceptable cuando los gates de Sprints 1, 3, 4, 6 y 10 pasen y no haya hallazgos críticos/altos abiertos.
