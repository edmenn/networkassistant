# Contrato de herramientas para Codex/OpenCode

Estado: contrato de diseño; implementación pendiente en Sprints 6-7.

Codex y OpenCode operan la plataforma mediante API/MCP. La web no es requisito para ejecutar una investigación o job.

## Herramientas

| Herramienta | Propósito | Requisito |
|---|---|---|
| `network.inventory.list` | Consultar dispositivos autorizados | alcance/RBAC |
| `network.evidence.query` | Recuperar evidencia redactada | sitio/equipo/filtros permitidos |
| `network.report.get` | Obtener reportes de inventario/topología | lectura |
| `network.job.create` | Crear recolección o plan | contrato validado, no ejecución implícita |
| `network.job.status` | Consultar estado y resultado | correlación |
| `network.browser_session.open` | Crear sesión web temporal | equipo `type=web`, URL allowlist, lease |
| `network.browser_session.observe` | Leer estado de sesión web | capability read-only |
| `network.browser_session.invoke_capability` | Ejecutar acción declarada | capability, playbook, aprobación si corresponde |
| `network.browser_session.close` | Cerrar sesión y destruir contexto | actor autorizado |

## Reglas de seguridad

- Ninguna herramienta devuelve contraseñas, tokens, cookies, headers de autenticación o claves.
- El agente recibe `secret_ref`, nunca el valor secreto.
- `invoke_capability` rechaza selectores arbitrarios, JavaScript, URLs fuera de allowlist y navegación libre.
- Cada llamada incluye actor, sitio, equipo, correlación, intención, capability y expiración.
- La autorización es determinista y ocurre antes de cualquier llamada al modelo.
- Una acción de cambio requiere snapshot, preflight, aprobación, ejecución y verificación.
- La salida de browser se limita a datos redactados, estado estructurado, screenshot permitido y evidencia con referencia.
- Todo resultado queda en `AuditEvent`; la conversación del agente no sustituye la auditoría del servidor.

## Sesión web

```json
{
  "device_id": "opaque-id",
  "connection_method_id": "opaque-id",
  "capability": "read.system_status",
  "mode": "observe_only",
  "expires_at": "2026-08-17T20:00:00Z",
  "correlation_id": "opaque-id"
}
```

El browser worker obtiene el lease desde OpenBao, abre un contexto Playwright aislado y elimina cookies, storage, descargas y trazas al cerrar. Codex/OpenCode nunca controlan el navegador mediante coordenadas o comandos libres.
