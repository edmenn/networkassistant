# Plataforma API-first operada por Codex/OpenCode — Blueprint de implementación

> **For agentic workers:** implementá un paso por vez en `main`, con TDD y gate reproducible. No crees ramas sin autorización. Cada paso debe cerrar su prueba y actualizar la evidencia antes del siguiente.

**Objetivo:** construir el copiloto de infraestructura basado selectivamente en Steward, con web mínima para onboarding/reportes, API/MCP para Codex/OpenCode y workers seguros para SSH, SNMPv3, APIs de fabricantes y equipos web-only.

**Arquitectura:** Steward aporta módulos auditados de API, dominio, jobs, evidencia, políticas y playbooks. PostgreSQL, Redis y OpenBao reemplazan sus límites inseguros. Codex/OpenCode son clientes; no reciben secretos ni ejecutan comandos libres. Un worker separado ejecuta collectors y `BrowserWebAdapter`.

**Repositorios reutilizados:**

- Steward: https://github.com/braedonsaunders/steward — módulos selectivos, commit fijado en `docs/UPSTREAM.md`.
- Playwright: https://github.com/microsoft/playwright — navegador aislado para `BrowserWebAdapter`.
- Nornir: https://github.com/nornir-automation/nornir — dispatch e inventario de tareas SSH.
- Scrapli: https://github.com/scrapli/scrapli — transporte y drivers de dispositivos de red.
- LiteLLM: https://github.com/BerriAI/litellm — gateway de modelos, sin autorización.
- NetBox/Nautobot/Oxidized: integración posterior solo con caso de uso comprobado.

## Contrato global

- La web solo registra sitios, equipos, endpoints, métodos, referencias de secretos, pruebas, inventario y reportes.
- Codex/OpenCode consumen API/MCP; no dependen de clicks ni selectores de la web del producto.
- `ConnectionMethod.type` admite `ssh`, `snmpv3`, `api` y `web`.
- Los secretos solo viven en OpenBao; el agente recibe `secret_ref`, nunca el valor.
- Un `BrowserSession` tiene equipo, worker, URL allowlist, capabilities, expiración y `audit_ref`.
- Un browser action solo puede invocar una capability de fabricante respaldada por playbook.
- `observe_only` es el estado inicial; cambios requieren snapshot, preflight, aprobación y verificación.
- `unknown` se conserva cuando la fuente no permite comprobar un dato.
- Guacamole no forma parte del runtime.

## Grafo de pasos

```text
0 baseline Steward
  -> 1 web/API onboarding
  -> 2 vault/RBAC
  -> 3 jobs/worker
  -> 4 SSH/SNMPv3/API collectors
  -> 5 BrowserWebAdapter
  -> 6 evidencia/reportes
  -> 7 API/MCP Codex/OpenCode
  -> 8 diagnósticos/playbooks/cambios
  -> 9 hardening/piloto real
```

## Paso 0 — Baseline y selección de Steward

**Archivos:** `docs/ADR/0001-0009.md`, `docs/REUSE_MATRIX.md`, `docs/UPSTREAM.md`, `docs/ARCHITECTURE.md`, `docs/SPRINT_0_EVIDENCE.md`, `docs/IMPLEMENTATION_STATUS.md`.

**Trabajo:** confirmar el commit auditado, separar módulos `reuse/adapt/replace/exclude`, validar que el baseline arranca y completar el vertical slice web mínima → sitio → firewall SSH read-only de laboratorio.

**Exit criteria:** la selección de Steward está sustentada; no se declara `done` sin evidencia web y SSH real del laboratorio.

**Rollback:** conservar documentos y volver al commit fijado del mirror.

## Paso 1 — Web mínima y API de onboarding

**Archivos:** contratos de API de Steward adaptados, rutas `api/v1/sites`, `api/v1/devices`, `api/v1/endpoints`, `api/v1/connection-methods`, formularios web mínimos y pruebas de contrato.

**Contrato:** `POST /api/v1/sites`, `POST /api/v1/devices`, `POST /api/v1/devices/{id}/connection-methods`, `POST /api/v1/connection-tests`; respuestas `data`, errores estructurados y `202` para pruebas largas.

**Trabajo:** usar las rutas/modelos existentes de Steward donde sean seguros; no crear un dashboard nuevo. Validar Zod/esquema, autorización por sitio y transacción de alta.

**Pruebas:** alta desde navegador y API, doble envío idempotente, error accesible, dos endpoints con una identidad estable.

**Exit criteria:** se puede crear un firewall con tipo `web` o `ssh` sin almacenar el secreto en DB/UI.

**Rollback:** migración reversible y eliminación de registros de laboratorio, conservando auditoría.

## Paso 2 — OpenBao, secretos y políticas

**Archivos:** `SecretBackend`, integración OpenBao, redactor central, RBAC, allowlist y pruebas de canarios.

**Trabajo:** reutilizar contratos de Steward solo tras retirar `vault.key` y fallback derivado del host. Implementar leases temporales para collectors y browser workers.

**Pruebas:** ningún canario aparece en web, API, logs, DB consultable, auditoría, trazas o prompts; lease vencido/revocado impide acceso; SSRF y destino fuera de allowlist son rechazados.

**Exit criteria:** el agente solo ve referencias opacas y el worker obtiene el secreto temporalmente.

**Rollback:** restaurar backup cifrado y revocar leases de la prueba.

## Paso 3 — Jobs y workers aislados

**Archivos:** contrato `Job`, máquina de estados, Redis/BullMQ, worker Linux AMD64, mTLS y `compose.sensor.yaml`.

**Trabajo:** reutilizar el modelo de jobs de Steward si pasa auditoría; mover ejecución de red fuera del control plane. El worker valida `job_id`, idempotencia, TTL, actor, sitio, endpoint, capability y firma.

**Pruebas:** job duplicado, vencido, alterado y fuera de allowlist; pérdida/reconexión del worker; control plane sin `NET_ADMIN`/`NET_RAW`.

**Exit criteria:** un worker ejecuta un probe sintético permitido y rechaza cualquier ampliación.

**Rollback:** revocar identidad mTLS, drenar cola y volver a imagen anterior.

## Paso 4 — Collectors estructurados

**Archivos:** contrato `Adapter`, collectors SSH/Scrapli, SNMPv3 y API oficial; normalización, fixtures y pruebas.

**Trabajo:** usar Nornir para dispatch y Scrapli para SSH/transportes compatibles. Incorporar API/NETCONF/RESTCONF solo con caso de fabricante comprobado. No usar shell generado por IA.

**Pruebas:** identidad, interfaces, rutas, vecinos, estado, timeout, salida inválida, host keys y `unknown`.

**Exit criteria:** dos protocolos producen observaciones y evidencia reproducibles en laboratorio.

**Rollback:** deshabilitar adapter y mantener evidencia anterior como `stale`.

## Paso 5 — BrowserWebAdapter para web-only

**Archivos:** worker Playwright aislado, contrato `BrowserSession`, capabilities por fabricante/modelo, `docs/AGENT_TOOL_CONTRACT.md` y pruebas de no mutación.

**Herramienta para Codex/OpenCode:** `network.browser_session.open`, `network.browser_session.observe`, `network.browser_session.invoke_capability`, `network.browser_session.close`. El agente recibe estado redactado, screenshot/DOM permitido y resultado; nunca cookies, passwords, headers de autenticación ni secretos.

**Trabajo:** Playwright corre únicamente en el browser worker. La URL se valida contra allowlist; la sesión expira; popups/downloads/redes externas se bloquean; la IA no envía selectores arbitrarios ni JavaScript. Cada capability declara entrada, evidencia, riesgo y si es read-only.

**Pruebas:** login con secreto sintético, URL fuera de allowlist, sesión vencida, DOM malicioso, intento de selector libre, captura sin credenciales, cierre y cleanup.

**Exit criteria:** un equipo web-only de laboratorio puede observarse mediante capability declarada desde una herramienta API/MCP.

**Rollback:** revocar sesión, destruir contexto del navegador y deshabilitar el adapter por capability.

## Paso 6 — Evidencia, reportes y topología

**Archivos:** `Observation`, `Evidence`, `Relationship`, reportes web/API y exportación redactada.

**Trabajo:** reutilizar proyecciones de grafo de Steward si conservan fuente/fecha/confianza; adaptar el modelo para `declared`, `observed`, `inferred`, `contradicted`, `stale`, `unknown`.

**Pruebas:** contradicción conservada, TTL, relación confirmada/inferida, reporte por API, tabla web accesible.

**Exit criteria:** los reportes explican qué se sabe, de dónde proviene y qué no pudo comprobarse.

## Paso 7 — API/MCP para Codex/OpenCode

**Archivos:** `docs/AGENT_TOOL_CONTRACT.md`, OpenAPI, eventos versionados, cliente MCP/API y skill de operación del proyecto.

**Trabajo:** exponer investigación, contexto, jobs, reportes, sesiones web y aprobaciones como recursos API/MCP. Codex/OpenCode jamás reciben secretos ni autorización implícita del modelo.

**Pruebas:** autorización por recurso, correlación, límite de cuota, contexto redactado, error del proveedor, job cancelado y auditoría completa.

**Exit criteria:** una investigación y una recolección pueden ejecutarse desde Codex/OpenCode sin abrir la web.

## Paso 8 — Diagnóstico, playbooks y cambios

**Archivos:** playbooks versionados, preflight, snapshots, aprobaciones, verificación y rollback.

**Trabajo:** reutilizar conceptos de Steward, pero reemplazar cualquier `runShell` libre. Para web, los cambios solo usan capabilities de fabricante con snapshot previo y verificación independiente.

**Pruebas:** aprobación separada, objetivo cambiado invalida aprobación, preflight falla, doble ejecución, snapshot restaurado y verificación posterior.

**Exit criteria:** Codex/OpenCode pueden pasar de evidencia a plan y de plan aprobado a ejecución determinista.

## Paso 9 — Hardening y piloto real

**Archivos:** Compose, CI, SBOM, backup/restore, threat model, `docs/gate/sprint-10.md`, `docs/gate/sprint-11.md`.

**Trabajo:** restaurar en host limpio, probar upgrades, pérdida de worker/cola/vault, ejecutar piloto en red propia con firewall, routers, switches y APs autorizados.

**Exit criteria:** no hay secretos fuera del vault, workers restringidos, reportes reproducibles y el propietario acepta el reporte del piloto.

## Revisión adversarial obligatoria

Antes de cerrar cada paso, revisar:

- Steward reutilizado sin auditoría o con SQLite/vault/shell heredado;
- secretos en browser context, cookies, prompts, screenshots o logs;
- capabilities web que permitan selector/JS libre;
- Codex/OpenCode usando UI como bypass de API/RBAC;
- rollback declarado sin snapshot y prueba real;
- reportes que oculten `unknown`, contradicciones o datos vencidos;
- dependencia nueva cuando un repositorio ya auditado cubre la necesidad.
