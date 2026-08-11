# ADR-0006 — Motor de base de datos y cola de trabajos

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

Steward persiste en SQLite (`better-sqlite3`) y usa un modelo de jobs/workers DB-backed en proceso con MQTT. El blueprint exige un control plane multi-worker, cola con reintentos, idempotencia, timeout y dead-letter.

## Decisión

- **Base de datos:** **PostgreSQL** (sustituye a SQLite). Entidades del dominio (Site, Device, Endpoint, ConnectionMethod, Capability, Observation, Evidence, Relationship, Job, Approval, Playbook, AuditEvent) se modelan en Postgres.
- **Cola de trabajos:** **Redis** (BullMQ o equivalente) con políticas de reintento, timeout, dead-letter y cancelación. Sustituye a los workers en proceso y MQTT.
- **Auditoría:** Postgres (o almacenamiento append-only) con evidencia de integridad (Sprint 1).

## Consecuencias

- Migración del esquema SQLite heredado a Postgres (script idempotente).
- El worker de cola queda separado del control plane (Sprint 3), que conserva la maquinaria de jobs/playbooks del upstream adaptada a la nueva cola.
- Transacciones ACID reales para la alta transaccional de equipos (Sprint 2).

## Estado de cierre

Motor fijado; migraciones y cola se implementan en Sprints 1–3.
