# ADR-0008 — Equipos administrables solo por web

**Estado:** Aceptado  
**Fecha:** 2026-08-17

## Contexto

Algunos firewalls, switches o puntos de acceso exponen únicamente una interfaz web. El primer piloto necesita inventariar equipos reales, pero no debe convertir una sesión web frágil en una vía de cambios no verificables.

## Decisión

El orden de integración read-only será:

1. API oficial del fabricante.
2. NETCONF/RESTCONF cuando el equipo lo soporte.
3. SNMPv3 para inventario y estado.
4. SSH con comandos read-only y host-key policy.
5. Interfaz web solo mediante un adaptador aislado posterior.

Playwright no forma parte del control plane ni del primer piloto. Si un equipo solo tiene web y no ofrece un método estructurado suficiente, sus campos se marcan `unknown` o `unsupported`, se conserva el motivo y no se intenta automatizar configuración.

El futuro `BrowserObservationAdapter` podrá usar Playwright dentro de un worker separado, con URL allowlist, identidad temporal, sesión efímera, navegación read-only, límites de tiempo y evidencia redactada. No podrá enviar formularios de configuración, pulsar acciones destructivas, ejecutar JavaScript arbitrario recibido de la IA ni convertir texto de pantalla en autorización.

## Consecuencias

- Se evita prometer cobertura universal basada en scraping.
- La cobertura de un equipo web-only puede ser parcial y visible.
- La integración web queda separada del contrato de collectors estructurados.
- Si se implementa, requerirá pruebas de no mutación, aislamiento, expiración de sesión, redacción y revisión por fabricante.
- Una API oficial siempre tiene prioridad sobre Playwright.

## Criterio de incorporación posterior

Solo se agrega el adaptador web si un equipo concreto del piloto carece de API, NETCONF/RESTCONF, SNMPv3 y SSH, y si el valor de los datos read-only justifica mantener un flujo browser automatizado verificable.
