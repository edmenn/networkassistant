# ADR-0009 — Superficie web mínima y operación desde agentes

**Estado:** Aceptado  
**Fecha:** 2026-08-17

## Contexto

La web no será la consola principal de operación. Su propósito es registrar equipos, métodos de conexión, pruebas, inventario y reportes. La operación avanzada se realizará desde Codex y OpenCode mediante API/MCP.

## Decisión

- La web tendrá onboarding, credenciales referenciadas, pruebas de conexión, inventario, evidencia y reportes.
- La API versionada será la superficie principal del producto.
- Codex/OpenCode podrán investigar, planificar y ejecutar solo mediante RBAC, allowlists, vault, aprobaciones y playbooks.
- No se construirá un dashboard avanzado, chat web completo ni editor visual de topología como requisito inicial.
- Steward se evaluará módulo por módulo: `reuse`, `adapt`, `replace` o `exclude`.
- La accesibilidad básica de formularios, tablas y reportes sigue siendo obligatoria.

## Alternativas consideradas

### Consola gráfica completa basada en Steward

- **Pros:** experiencia inmediata para operadores humanos.
- **Contras:** más superficie, duplicación de Codex/OpenCode y mayor coste de seguridad/UI.
- **Por qué no:** no es el modo operativo elegido.

### API-first con web mínima

- **Pros:** contratos reutilizables, menor superficie, automatización reproducible y clientes múltiples.
- **Contras:** exige API, CLI/MCP y auditoría sólidos.
- **Por qué sí:** coincide con el flujo Codex/OpenCode y reduce código no esencial.

## Consecuencias

- Los contratos API, jobs, eventos, evidencia y capabilities son prioritarios.
- Codex/OpenCode son clientes y no pueden saltarse controles de seguridad.
- La UI completa de Steward no se adopta automáticamente.
- Los módulos de Steward se reutilizan solo cuando reducen trabajo sin heredar SQLite, vault inseguro, shell privilegiado o acoplamiento de UI.
