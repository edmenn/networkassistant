# Diseño: piloto read-only sobre red real

Fecha: 2026-08-17  
Estado: propuesto para revisión del usuario  
Alcance: equipos de red y firewall administrables; no PCs ni IoT; sin cambios operativos.

## 1. Decisión

El primer producto usable será un piloto self-hosted, API-first, que observe una red real controlada y entregue:

- inventario de firewall, routers, switches y puntos de acceso;
- evidencia de interfaces, direcciones, rutas, vecinos y capacidades comprobadas;
- topología con relaciones confirmadas o inferidas explícitamente;
- investigación asistida por IA sobre contexto redactado;
- historial, contradicciones, datos vencidos y `unknown`.

El piloto no ejecutará configuraciones, instalaciones, reinicios, cambios de credenciales ni comandos libres.

Steward se evaluará selectivamente como fuente de módulos de API, modelos, jobs, evidencia, políticas y playbooks. No se adopta toda su UI ni su chat web. NetBox será una integración opcional para inventario/IPAM declarado; Netdisco, Nornir, Scrapli y Oxidized serán componentes complementarios.

## 2. Arquitectura

```text
Navegador
   |
   v
Control plane web/API/RBAC/auditoria
   |             |                  |
   v             v                  v
PostgreSQL     Cola de jobs       IA por API
                                      |
                                contexto redactado
   |
   v
Worker aislado, conexión saliente autenticada
   |
   +-- Nornir + Scrapli/SSH
   +-- SNMPv3
   |
   v
Firewall, routers, switches y APs autorizados
```

Límites:

- el control plane autoriza, planifica, almacena y presenta; no administra la red directamente;
- el worker ejecuta únicamente trabajos `observe` dentro de la allowlist;
- PostgreSQL sustituye SQLite y conserva el modelo adaptado de Steward para evidencia y relaciones;
- NetBox puede importar inventario declarado mediante dry-run y reconciliación, sin sobrescritura silenciosa;
- la IA solo recibe contexto redactado y no puede seleccionar objetivos ni ejecutar acciones.

### Equipos con interfaz web

El orden de integración es API oficial, NETCONF/RESTCONF, SNMPv3, SSH y `BrowserWebAdapter`. Playwright no entra en el control plane: Codex/OpenCode lo invocan mediante API/MCP y el worker inyecta credenciales desde el vault sin exponerlas al agente. Un equipo web-only se opera mediante capabilities y playbooks específicos, no scraping universal.

## 3. Modelo mínimo

Entidades:

| Entidad | Propósito |
|---|---|
| `Site` | Ubicación, rangos autorizados, ventana y modo `observe_only` |
| `Device` | Identidad estable del equipo, independiente de la IP |
| `Endpoint` | Dirección, hostname, puerto y transporte |
| `ConnectionMethod` | SSH o SNMPv3 y referencia opaca al secreto |
| `CollectionRun` | Trabajo, worker, alcance, estado, tiempos y errores |
| `Observation` | Dato estructurado obtenido de una fuente |
| `Evidence` | Procedencia, fecha, confianza, TTL y redacción |
| `Relationship` | Vínculo entre equipos, interfaces, vecinos o rutas |
| `Capability` | Capacidad comprobada por protocolo y equipo |
| `AuditEvent` | Actor, alcance, resultado y correlación |

Clasificaciones: `declared`, `observed`, `inferred`, `contradicted`, `stale`, `unknown`.

Invariantes:

- cambiar una IP no crea otro `Device` si la identidad y evidencia permiten reconciliarlo;
- una contradicción conserva todas las fuentes vigentes;
- falta de respuesta produce `unknown`, nunca un falso negativo;
- una relación topológica incluye fuente, tiempo y confianza;
- PostgreSQL nunca almacena contraseñas, tokens ni comunidades SNMP en claro;
- el valor crudo se cifra o redacta antes de entrar en superficies consultables por IA.

## 4. Flujo principal

1. Crear el sitio y registrar rangos autorizados.
2. Registrar equipos, endpoints y métodos de conexión.
3. Guardar secretos en el backend de vault y persistir solo referencias opacas.
4. Confirmar explícitamente la primera prueba de conexión.
5. Crear un job `observe` con alcance, timeout, TTL y capacidades permitidas.
6. Validar el job en el worker y ejecutar collectors read-only.
7. Normalizar respuestas SSH/SNMPv3 y guardar evidencia redactada.
8. Reconciliar datos declarados, observados y previos.
9. Calcular cobertura, capacidades, relaciones y estados `stale`/`unknown`.
10. Presentar inventario, topología tabular/grafo e investigación con citas internas.
11. Auditar todo el flujo y conservar el resultado según la política de retención.

## 5. Seguridad y privacidad

- `observe_only` es obligatorio en sitio, equipo, job y API durante el piloto;
- allowlist por sitio, worker, endpoint y puerto;
- SNMPv3 y SSH con mínimo privilegio; v1/v2c no se habilitan por defecto;
- host keys y TLS se validan mediante política explícita;
- bloqueo de loopback, metadata cloud, DNS rebinding y destinos fuera de alcance;
- worker separado, sin privilegios de red en el control plane;
- OpenBao mediante `SecretBackend`, con leases, revocación, rotación y restore comprobable;
- redacción única para UI, API, logs, trazas, auditoría, errores y prompts;
- jobs con expiración, idempotencia, rate limit, timeout y correlación;
- la aplicación no expone shell, plantillas de comandos ni controles de escritura;
- antes de la red real se ejecuta un gate de laboratorio con datos ficticios y credenciales sintéticas.

Criterio central: solo se leen equipos autorizados, no se modifica infraestructura y no se revelan credenciales.

## 6. Manejo de errores

- timeout o desconexión: job fallido o parcial, evidencia conservada y estado no comprobado marcado `unknown`;
- respuesta inválida: no se persiste como hecho; se guarda error seguro y métrica del collector;
- contradicción: se muestran ambas fuentes, sin elegir silenciosamente una;
- secreto ausente o lease vencido: no se reintenta indefinidamente ni se muestra el valor;
- worker desconectado: no se envían jobs nuevos y se conserva la última evidencia con TTL;
- job duplicado: idempotency key evita doble recolección simultánea cuando sea posible;
- IA no disponible: inventario y evidencia siguen funcionando; investigación devuelve indisponibilidad explicable;
- NetBox no disponible: el piloto continúa con el modelo local; la sincronización se reintenta mediante dry-run.

## 7. Pruebas y evidencia de salida

Pruebas mínimas:

- alta transaccional de un equipo con dos endpoints y dos métodos;
- conexión read-only real contra cada protocolo del laboratorio;
- rechazo de destino fuera de allowlist, loopback y metadata;
- rechazo de job vencido, alterado o con capacidad no declarada;
- canarios de secretos ausentes en API, UI, logs, DB consultable, trazas y prompts;
- reconciliación que conserva una contradicción y produce `unknown` ante ausencia;
- topología con relación confirmada, inferida y no comprobada;
- reinicio de worker/cola sin perder auditoría ni duplicar resultados;
- navegación por teclado, contraste, errores accesibles y responsive en 375, 768, 1024 y 1440 px;
- restore en host limpio antes de conectar la red real.

El gate debe registrar comandos, resultados, configuración efectiva, capturas o logs redactados y el recorrido real desde alta hasta investigación.

## 8. Criterio de éxito del piloto real

El piloto se considera exitoso si, para el sitio elegido:

- todos los equipos de red y firewall administrables incluidos están inventariados o explicados como `unknown`;
- cada observación relevante tiene fuente, fecha, confianza y TTL;
- la topología distingue hechos de inferencias;
- ninguna operación de cambio aparece disponible en UI o API;
- no se detectan secretos fuera del vault;
- el worker no puede salir de su allowlist;
- el operador puede explicar por qué existe cada dato y cuándo quedó vencido;
- el reporte de cobertura y limitaciones permite decidir el siguiente sprint.

## 9. Roadmap de implementación propuesto

Se conserva la seguridad, la arquitectura de Steward y el orden general de `SPRINTS.md`. Esta secuencia identifica el primer camino de entrega; no reduce el objetivo final del producto:

1. Seguridad, vault, redacción y RBAC mínimo.
2. Modelo local de dominio y alta transaccional.
3. Worker/sensor aislado y contrato de jobs read-only.
4. Collectors SSH y SNMPv3 con fixtures y laboratorio.
5. Reconciliación, evidencia, cobertura y topología.
6. Web mínima de inventario, alta, reportes y API de evidencia.
7. IA por API sobre contexto redactado.
8. Diagnóstico, aprobaciones y playbooks.
9. Browser Web Adapter por fabricante/capability, aplicaciones e integraciones opcionales.
10. Hardening, backup/restore y supply chain.
11. Piloto real read-only como primera validación operativa del producto.

Nautobot y Oxidized siguen siendo integraciones opcionales. El Browser Web Adapter es parte del producto para equipos web-only y requiere ADR-0008; los cambios web solo se habilitan con snapshot, aprobación, playbook y verificación. Diagnóstico, aprobaciones, playbooks y cambios forman parte del producto final basado en Steward.

## 10. Referencias externas evaluadas

- Steward: https://github.com/braedonsaunders/steward
- NetBox: https://github.com/netbox-community/netbox
- Netdisco: https://github.com/netdisco/netdisco
- Nornir: https://github.com/nornir-automation/nornir
- Scrapli: https://github.com/scrapli/scrapli
- Oxidized: https://github.com/ytti/oxidized
