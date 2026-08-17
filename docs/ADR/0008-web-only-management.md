# ADR-0008 — Equipos administrables solo por web

**Estado:** Aceptado  
**Fecha:** 2026-08-17

## Contexto

Algunos firewalls, switches o puntos de acceso exponen únicamente una interfaz web. El primer piloto necesita inventariar equipos reales, pero no debe convertir una sesión web frágil en una vía de cambios no verificables.

## Decisión

El orden de integración será:

1. API oficial del fabricante.
2. NETCONF/RESTCONF cuando el equipo lo soporte.
3. SNMPv3 para inventario y estado.
4. SSH con comandos read-only y host-key policy.
5. Interfaz web mediante `BrowserWebAdapter` en worker aislado.

Playwright no forma parte del control plane. Codex/OpenCode podrán invocar `BrowserWebAdapter` mediante API/MCP con un contrato de sesión limitado. Si un equipo solo tiene web, el adapter podrá observarlo y operar únicamente capabilities declaradas por playbook; lo no comprobado queda `unknown`.

`BrowserWebAdapter` usará Playwright dentro de un worker separado, con URL allowlist, identidad temporal, sesión efímera, evidencia redactada y límites de tiempo. El agente no recibe credenciales ni puede ejecutar JavaScript arbitrario; solo puede solicitar capabilities y acciones de playbooks validados. Las acciones de cambio requieren snapshot, preflight, aprobación y verificación.

## Consecuencias

- Se evita prometer cobertura universal basada en scraping.
- La cobertura de un equipo web-only puede ser parcial y visible.
- La integración web queda separada del contrato de collectors estructurados.
- Si se implementa, requerirá pruebas de no mutación, aislamiento, expiración de sesión, redacción y revisión por fabricante.
- Una API oficial siempre tiene prioridad sobre Playwright.

## Criterio de incorporación por equipo

Se habilita el adaptador web por equipo cuando carece de un método estructurado suficiente o cuando la web es el método autorizado. Cada fabricante/modelo necesita capabilities y playbooks probados; no se promete scraping universal.
