# ADR-0001 — Stack de referencia

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

Sprint 0 debe fijar el stack del control plane. Steward (upstream `braedonsaunders/steward`, commit `ea6a476`) es Next.js 16 + React 19 + TypeScript con SQLite y un vault AES-256-GCM con clave del host. El blueprint exige una base reusable, un vault robusto y separación de workers.

## Decisión

Conservar el stack de UI/API de Steward y sustituir la persistencia y el vault:

- **UI/API:** Next.js 16 + React 19 + TypeScript (reutilizado de Steward).
- **Base de datos:** Postgres (sustituye a SQLite).
- **Cola:** Redis (sustituye al broker/workers DB-backed en proceso).
- **Vault:** OpenBao tras la interfaz `SecretBackend` (sustituye al vault AES-GCM).
- **IA:** LiteLLM como gateway interno (Sprint 6+, opcional).
- **Despliegue:** Linux AMD64 en contenedores; desarrollo en macOS con Docker Desktop.

## Consecuencias

- Positivas: base de UI/RBAC/playbooks ya probada; stack de datos común y auditable.
- Negativas: migración de SQLite a Postgres y reescritura del vault; requiere adaptar el acceso a estado.
- Se abren ADR-0003 (vault) y ADR-0006 (db/cola).

## Estado de cierre

Sin decisiones abiertas necesarias para Sprint 1.
