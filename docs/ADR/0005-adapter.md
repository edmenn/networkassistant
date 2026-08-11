# ADR-0005 — Formato de plugin/adaptador

**Estado:** Aceptado (Sprint 0)
**Fecha:** 2026-08-11

## Contexto

El blueprint requiere un formato de adaptador/plugin compatible con el código real. Steward ya implementa un sistema de adaptadores con manifiestos, tool skills y packs firmados con Ed25519.

## Decisión

Conservar el **sistema de adaptadores/packs de Steward** como formato base (`reuse`), añadiendo un **contrato de adaptador explícito** para collectors read-only:

```ts
interface Adapter {
  id: string;
  version: string;
  capabilities: Capability[];       // detectar y declarar
  collect(ctx: TaskContext): Promise<CollectResult>; // read-only
  normalize(raw: unknown): Observation[];
  describeError(err: unknown): SafeError; // errores sin secretos
}
```

El contrato incluye: `capabilities`, `collect`, `normalize` y errores seguros (ADR-0002). Los manifiestos se validan contra esquema cerrado y se verifica firma/procedencia.

## Consecuencias

- Nuevos protocolos (SSH, SNMPv3, WinRM, API) se integran como adaptadores (Sprint 4).
- Los packs heredados de Steward pueden reutilizarse si cumplen el contrato.
- Contrato común se fija antes de implementar adaptadores en paralelo (SSH y SNMP).

## Estado de cierre

Formato fijado; los adaptadores se implementan en Sprint 4.
