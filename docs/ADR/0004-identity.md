# ADR-0004 — Identidad entre control plane, workers y sensores

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

Steward autentica operadores (auth local/sesión/API token/OIDC/LDAP) pero no define identidad para workers ni un modelo de **sensor remoto con conexión saliente**. El blueprint exige workers con identidad de workload y sensores que se conectan de forma saliente y autenticada.

## Decisión

- **Control plane ↔ worker/sensor:** identidad por **mTLS** con certificados de corta duración emitidos por una CA interna, revocables y rotados. Conexión saliente del sensor al control plane.
- **Operador:** se conserva la auth de Steward (sesión/API token/OIDC/LDAP) y se extiende a RBAC por recurso (ADR-0002).
- Cada worker/sensor declara identidad, versión, capacidades y allowlist; el control plane entrega secretos y destinos mínimos por trabajo (ADR-0003).

## Consecuencias

- El sensor no expone puertos administrativos públicos por defecto; solo conexión saliente autenticada.
- Revocar identidad del sensor equivale a cortar su capacidad de ejecución (rollback de Sprint 3).
- La rotación de identidad y la pérdida de sensor no pierden estado de jobs (Sprint 3).

## Estado de cierre

Protocolo fijado; la implementación se ejecuta en Sprint 3.
