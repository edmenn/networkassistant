# Blueprint maestro - Plataforma de infraestructura verificable

## 1. Proposito del documento

Este archivo es el contrato de producto y arquitectura para cualquier IA o equipo que implemente el proyecto. `idea.md` conserva la vision original; este blueprint fija el alcance, las prioridades, los limites y los criterios verificables. La ejecucion se organiza en `SPRINTS.md`.

Regla de precedencia:

1. Seguridad, autorizacion y no exposicion de secretos.
2. Este blueprint.
3. Decisiones registradas en `docs/ADR/`.
4. `SPRINTS.md`.
5. Detalles de implementacion.

Si dos requisitos se contradicen, detener la tarea, documentar el conflicto y resolverlo con un ADR antes de escribir codigo.

## 2. Resultado buscado

Construir una plataforma self-hosted, multi-sitio y multi-vendor que permita registrar infraestructura autorizada, recopilar datos comprobables, mostrar inventario y topologia con evidencia, investigar incidentes y ejecutar cambios mediante playbooks deterministas aprobados.

La plataforma nunca debe presentarse como un escaner que conoce toda la red. Su promesa es visibilidad progresiva y verificable: lo declarado, observado, inferido, contradictorio, vencido o desconocido debe distinguirse siempre.

## 3. Principios no negociables

- Una IP o hostname es un endpoint, no la identidad de un equipo.
- Cada dato operativo debe conservar fuente, fecha, confianza, clasificacion y referencia a evidencia redactada.
- Sin evidencia suficiente, el estado es `unknown`.
- Un equipo nuevo inicia en `observe_only`.
- La IA interpreta evidencia y propone planes; no recibe secretos ni ejecuta comandos libres.
- Las acciones se ejecutan mediante playbooks versionados, revisados y deterministas.
- El control plane no usa `NET_ADMIN`, `NET_RAW` ni acceso directo irrestricto a redes administradas.
- Los workers y sensores reciben privilegios, secretos, destinos y tiempo de vida minimos por trabajo.
- No se usan credenciales o infraestructura reales hasta superar los gates de vault, aislamiento, auditoria, backup y restore.
- Browser Web Adapter es un worker opcional por equipo web-only; no recibe credenciales en el agente ni permite navegación libre.
- Nautobot es una integracion opcional, no una dependencia base.
- Netclaw y SubNetree no forman parte del runtime.

## 4. Alcance de entregas

### Piloto de solo lectura

El primer resultado util debe permitir:

- instalar la plataforma vacia;
- abrir el entorno web, crear un sitio y agregar un primer firewall por SSH read-only desde la UI;
- crear usuarios, sitios, rangos autorizados y sensores;
- registrar un equipo con varios metodos de conexion;
- almacenar referencias de secretos en un vault robusto;
- validar conectividad y autenticacion con confirmacion explicita;
- recolectar datos de solo lectura mediante al menos SSH y SNMPv3;
- reconciliar datos declarados y observados sin sobrescritura silenciosa;
- mostrar inventario, cobertura, evidencia y topologia;
- consultar evidencia redactada mediante IA por API;
- ejecutar autoinspeccion y restaurar un backup en un host limpio.

### Primera version operable

Se agrega despues del piloto:

- API, WinRM y adaptadores especificos justificados por casos reales;
- diagnosticos guiados;
- planes de cambio, aprobaciones y playbooks de bajo riesgo;
- verificacion posterior y rollback real cuando exista;
- Browser Web Adapter para equipos web-only;
- manifiestos versionados para aplicaciones;
- sincronizacion opcional con Nautobot.

### Fuera de alcance inicial

- descubrimiento indiscriminado de Internet o redes no autorizadas;
- captura pasiva sin SPAN, TAP, firewall o interfaz que reciba el trafico;
- scraping web universal sin adapter, capabilities ni playbook específico;
- comandos, Compose o scripts generados y ejecutados directamente por IA;
- cambios destructivos en el piloto;
- facturacion SaaS, marketplace publico o multi-tenancy comercial;
- aplicacion movil nativa.

## 5. Estrategia de reutilizacion

### Steward

Steward solo puede ser la base del control plane despues de una auditoria reproducible del commit fijado. La decision no es “usar todo” o “descartarlo”: cada modulo se clasifica como `reuse`, `adapt`, `replace` o `exclude` en `docs/REUSE_MATRIX.md`.

Condiciones de adopcion:

- fork privado y commit upstream fijado;
- licencia y procedencia revisadas;
- dependencias, autenticacion, sesiones, RBAC y almacenamiento de secretos auditados;
- pruebas de laboratorio de los flujos reutilizados;
- vulnerabilidades criticas resueltas o mitigadas con fecha y responsable;
- ninguna clave maestra derivada de datos previsibles del host;
- procesos privilegiados separados del control plane.

Si un modulo no supera el gate, se reemplaza solo ese modulo. No se reescribe el producto completo por anticipado.

### Componentes especializados

| Componente | Uso permitido | Limite |
|---|---|---|
| LiteLLM | Gateway interno para proveedores de IA | No recibe secretos ni decide autorizaciones |
| Browser Web Adapter | Sesiones web y acciones por capabilities/playbooks | Worker aislado, URL allowlist, credenciales inyectadas desde vault |
| Nautobot | Importacion o sincronizacion | Conector opcional, reconciliacion sin sobrescritura silenciosa |
| Vault | Custodia y entrega temporal | Backend desacoplado por `SecretBackend` |

## 6. Arquitectura objetivo

```text
Navegador
   |
   v
Control plane: API + web minima + RBAC + politicas + auditoria
   |             |                    |
   v             v                    v
Base/cola      Vault                LiteLLM
   |
   v
Orquestador de trabajos
   |
   +---- worker aislado local
   |
   +---- sensor de sitio --saliente/mTLS--> control plane
             |
             v
       redes y equipos permitidos

Opcional: Browser Web Worker (Playwright) --saliente/mTLS--> equipos web autorizados

Opcionales: LiteLLM, conector Nautobot y Oxidized
```

### Limites de confianza

| Zona | Puede | No puede |
|---|---|---|
| Navegador | Usar API segun RBAC | Leer secretos o credenciales de workers |
| Control plane | Autorizar, planificar y auditar | Capturar trafico o administrar redes directamente |
| LiteLLM/modelos | Procesar contexto redactado | Recibir secretos, cookies, claves o PCAP completos |
| Worker | Ejecutar una tarea firmada y acotada | Elegir objetivos fuera de allowlist |
| Sensor | Acceder a redes autorizadas del sitio | Aceptar conexiones administrativas publicas por defecto |
| Vault | Entregar secreto temporal a identidad autorizada | Exponer el valor por UI, API, logs o auditoria |

### Contrato de trabajos

Todo trabajo debe contener:

- `job_id` e `idempotency_key`;
- actor y autorizacion efectiva;
- sitio, equipo, endpoint y metodo permitidos;
- clasificacion `observe`, `probe`, `low_risk_change`, `high_risk_change` o `destructive`;
- parametros validados contra esquema;
- secreto referenciado, nunca embebido;
- timeout, politica de reintento y ventana de ejecucion;
- preflight y criterio de exito;
- rollback declarado como ejecutable o `unavailable` con motivo;
- politica de redaccion y retencion;
- firma o mecanismo equivalente que impida alterar el alcance.

El worker rechaza trabajos vencidos, alterados, sin autorizacion, fuera de allowlist o incompatibles con sus capacidades.

## 7. Modelo de dominio minimo

| Entidad | Responsabilidad | Campos esenciales |
|---|---|---|
| `Organization` | Limite administrativo futuro, aunque el piloto use una sola | id, name, status |
| `User` | Identidad humana | id, status, auth_subject |
| `RoleBinding` | Permisos efectivos | principal, scope, role |
| `Site` | Ubicacion y alcance | name, timezone, authorized_ranges, maintenance_windows |
| `Sensor` | Punto de ejecucion remoto | site, identity, version, capabilities, health |
| `Device` | Identidad estable del activo | name, type, site, criticality, labels, lifecycle_state |
| `Endpoint` | Direccion alcanzable | device, address, port, transport, validity |
| `ConnectionMethod` | Forma autorizada de acceso | device, endpoint, type (`ssh`, `snmpv3`, `api`, `web`), secret_ref, security_policy, status |
| `BrowserSession` | Sesion web temporal | device, worker, connection_method, capabilities, expires_at, audit_ref |
| `Capability` | Funcion comprobada | subject, name, source, last_verified_at |
| `Observation` | Hecho recolectado | subject, field, value, source, observed_at, ttl |
| `Evidence` | Prueba y procedencia | classification, confidence, collector, raw_ref, redaction_state |
| `Relationship` | Vinculo topologico | source, target, kind, evidence, confidence, valid_from/to |
| `Job` | Unidad de ejecucion | contract, state, attempts, approval, result |
| `Approval` | Decision humana/politica | job, approver, decision, reason, timestamp |
| `Playbook` | Operacion determinista | version, input_schema, risk, preflight, execute, verify, rollback |
| `AuditEvent` | Registro inmutable redactado | actor, action, subject, result, correlation_id, timestamp |

### Clasificacion de evidencia

- `declared`: ingresado por una persona o sistema externo.
- `observed`: obtenido directamente de una fuente autorizada.
- `inferred`: derivado de evidencia, con metodo y confianza visibles.
- `contradicted`: dos fuentes vigentes no concuerdan.
- `stale`: supero su TTL o ventana de validez.
- `unknown`: no existe evidencia suficiente.

La reconciliacion crea estados y contradicciones; nunca destruye el valor declarado para reemplazarlo por el observado.

## 8. Flujos funcionales obligatorios

### Alta de equipo

1. Capturar identidad, tipo, sitio, criticidad y etiquetas.
2. Agregar uno o mas endpoints y metodos.
3. Guardar el secreto en el vault y persistir solo su referencia opaca.
4. Definir alcance, permisos esperados y `observe_only`.
5. Confirmar antes de probar autenticacion.
6. Ejecutar conectividad y deteccion de capacidades de solo lectura.
7. Mostrar resultado por metodo, errores recuperables y evidencia.
8. Reconciliar lo declarado y observado sin sobrescribir.

La creacion de equipo, endpoints, metodos y referencias debe ser transaccional. Un fallo antes del commit no deja registros parciales ni secretos huerfanos.

### Descubrimiento

1. Resolver el alcance efectivo del sitio y sensor.
2. Programar collectors compatibles con capacidades verificadas.
3. Entregar credenciales temporales solo al worker asignado; para web, inyectarlas dentro de la sesión aislada sin exponerlas a Codex/OpenCode.
4. Recopilar salida estructurada y guardar artefactos crudos cifrados/redactados.
5. Normalizar observaciones.
6. Correlacionar vecinos, interfaces, rutas, MAC, ARP/ND, LLDP/CDP, STP y Wi-Fi disponibles.
7. Crear relaciones confirmadas o inferidas con evidencia.
8. Actualizar cobertura, TTL y salud sin convertir ausencia en certeza.

### Investigacion con IA

1. Codex/OpenCode formulan una consulta sobre un alcance autorizado mediante API/MCP.
2. El control plane recupera evidencia permitida y la redacta.
3. LiteLLM selecciona un modelo segun politica, salud, costo y privacidad.
4. Se registra modelo, motivo y presupuesto; no se registra contenido sensible sin redaccion.
5. La respuesta cita evidencias internas y separa hechos, inferencias y datos faltantes.
6. Una propuesta de accion se transforma en plan validable; nunca se ejecuta desde texto libre.

### Cambio aprobado

1. Elegir playbook y version.
2. Validar parametros, permisos, ventana, riesgo e idempotencia.
3. Ejecutar preflight de solo lectura.
4. Mostrar impacto, evidencia, rollback o irreversibilidad.
5. Obtener aprobacion requerida.
6. Ejecutar con timeout y cancelación segura; para web, solo capabilities y playbooks validados.
7. Verificar el estado posterior con una lectura independiente.
8. Ejecutar rollback solo si fue declarado y probado.
9. Cerrar con auditoria y evidencia redactada.

## 9. API y eventos

El estilo concreto se adapta al stack comprobado de Steward. Estas propiedades no cambian:

- API versionada desde el primer endpoint publico.
- recursos REST en plural, minusculas y `kebab-case`; verbos solo para acciones que no sean CRUD;
- IDs opacos; nunca usar IP como clave primaria.
- mutaciones con idempotency key y control de concurrencia;
- paginacion por cursor para inventario, jobs y auditoria; offset solo para vistas pequenas que necesiten salto de pagina;
- filtros y orden con allowlist de campos para impedir consultas arbitrarias;
- respuestas exitosas con envelope `data` y colecciones con `data`, `meta` y `links`;
- errores estructurados con `error.code`, mensaje seguro, detalles por campo y `correlation_id`;
- codigos HTTP semanticos: `201` al crear, `202` para jobs aceptados, `204` sin cuerpo, `409` para conflicto de estado, `422` para entrada semanticamente invalida y `429` con `Retry-After`;
- autorizacion por recurso, no solo por ruta;
- ningun endpoint devuelve valores secretos;
- jobs largos son asincronos y consultables;
- eventos incluyen version de esquema y no transportan secretos.
- limites por usuario, sensor y operacion; collectors y consultas IA usan cuotas mas estrictas.
- contrato OpenAPI actualizado y validado en CI.

Estados de `Job` permitidos:

```text
draft -> pending_approval -> queued -> running -> verifying -> succeeded
   |            |              |          |            |
   +-> canceled +-> rejected   +-> expired+-> failed   +-> rollback_running -> rolled_back|rollback_failed
```

Las transiciones se validan en una unica maquina de estados y cada cambio genera un `AuditEvent`.

## 10. Seguridad

### Vault

Definir `SecretBackend` con operaciones minimas `put`, `lease`, `revoke`, `rotate`, `backup` y `restore`. La implementacion elegida debe probar:

- separacion entre clave maestra y datos cifrados;
- autenticacion de workload, no secreto global compartido;
- leases cortos y revocables;
- rotacion sin exponer valores;
- backup cifrado y restore en host limpio;
- redaccion central en UI, API, logs, trazas, errores y prompts;
- eliminacion o compensacion de secretos huerfanos.

### RBAC y politicas

Los permisos se evaluan sobre usuario, sitio, equipo, metodo, secreto y clase de accion. `deny` prevalece. Las aprobaciones de alto riesgo requieren separacion entre solicitante y aprobador.

### Red

- Allowlist explicita por sensor y sitio.
- Bloqueo de loopback, metadata cloud y destinos fuera de alcance salvo autorizacion especifica.
- Resolucion DNS revalidada para evitar cambios de destino entre autorizacion y conexion.
- Verificacion de host keys y TLS por politica.
- SNMPv3 preferido; SNMPv1/v2c marcado como riesgo visible.
- Capturas con interfaz, filtro, duracion, tamano y retencion limitados.

### Supply chain

- Dependencias y contenedores fijados para produccion.
- SBOM, escaneo de secretos, dependencias e imagenes en CI.
- Builds reproducibles en lo razonable y artefactos firmados.
- Excepciones de vulnerabilidad con riesgo, mitigacion, propietario y vencimiento.

## 11. Web mínima y clientes API

La web es una superficie administrativa mínima, no una consola gráfica de operaciones. Debe permitir alta de sitios/equipos, métodos de conexión, prueba de acceso, inventario, evidencia y reportes.

Codex/OpenCode consumen la API/MCP para investigación, diagnóstico, sesiones web, jobs, planes, aprobaciones y ejecución. No se construyen como requisito inicial un dashboard avanzado, chat web, grafo visual sofisticado ni editor visual de playbooks.

### Reglas mínimas

- labels visibles, validación y errores junto al campo;
- ningún secreto en UI, API, logs, trazas, auditoría o prompts;
- estados no expresados solo por color;
- teclado, foco visible y contraste suficiente;
- tablas y reportes consultables en móvil y escritorio;
- todas las funciones operativas disponibles por API/MCP sin depender de clicks.

## 12. Observabilidad y operacion

Correlacionar API, jobs, workers, sensores y auditoria mediante `correlation_id`. Medir al menos:

- disponibilidad y latencia del control plane;
- profundidad y edad de cola;
- duracion, reintentos y fallos por collector/playbook;
- sensores conectados, version y desfase horario;
- cobertura de inventario y porcentaje `unknown/stale/contradicted`;
- uso, costo, errores y fallback de proveedores IA;
- leases del vault, rotaciones y fallos de redaccion;
- exito de backup y ultima restauracion probada.

Los logs son estructurados, redactados y con retencion definida. Las metricas no usan nombres de equipos, IPs ni usuarios como etiquetas de alta cardinalidad.

## 13. Estrategia de pruebas

| Nivel | Prueba minima |
|---|---|
| Unidad | Clasificacion, reconciliacion, politicas, maquina de estados y redaccion |
| Contrato | Adaptadores, `SecretBackend`, workers, sensores, LiteLLM y eventos |
| Integracion | DB/cola/vault, alta transaccional, jobs e idempotencia |
| Seguridad | RBAC por recurso, SSRF, fuga de secretos, aislamiento y supply chain |
| End-to-end | Sitio -> equipo -> secreto -> prueba -> observacion -> evidencia -> API/reporte |
| Resiliencia | reinicio, perdida de sensor, timeout, cancelacion, cola duplicada y rollback |
| Recuperacion | backup y restore en host limpio |
| UX | teclado, lector de pantalla, contraste, responsive, errores y carga |

Cada sprint define un gate ejecutable. Un build exitoso no basta. La evidencia de cierre debe incluir comandos, resultados, capturas o registros redactados y el flujo real probado.

## 14. Entrega y despliegue

Entorno de desarrollo: macOS con Docker Desktop. Runtime objetivo: Linux AMD64 en contenedores.

Entregables de despliegue:

- `compose.yaml`, `compose.dev.yaml`, `compose.prod.yaml`, `compose.sensor.yaml`;
- healthchecks, limites de recursos, perfiles y redes separadas;
- migraciones y scripts idempotentes de backup/restore;
- imagenes de produccion fijadas por digest;
- documentacion de puertos, volumenes, requisitos y recuperacion;
- CI con pruebas, SBOM y escaneos;
- procedimiento de upgrade y rollback de version.

## 15. Definition of Ready

Una tarea puede implementarse solo si tiene:

- resultado observable y alcance explicito;
- dependencias cerradas;
- archivos o componentes afectados identificados;
- contrato de entrada/salida;
- amenazas relevantes y permisos necesarios;
- prueba que fallara antes del cambio;
- criterio de aceptacion y evidencia esperada;
- rollback o razon documentada de irreversibilidad.

## 16. Definition of Done

Una tarea se cierra cuando:

- el cambio minimo cumple el criterio;
- pruebas automatizadas relevantes pasan;
- el flujo afectado se verifico de extremo a extremo;
- no aparecen secretos en UI, API, logs, trazas, auditoria o prompts;
- documentacion y estado de implementacion estan actualizados;
- hallazgos de seguridad criticos/altos estan resueltos;
- cualquier deuda deliberada tiene limite, riesgo y condicion de revision;
- la evidencia de cierre puede ser reproducida por otra IA.

## 17. Contrato para la IA implementadora

Antes de cada sprint:

1. Leer `idea.md`, `BLUEPRINT.md`, `SPRINTS.md`, `AGENTS.md` y ADR relacionados.
2. Consultar Graphify si existe `graphify-out/graph.json`; actualizarlo si cambio la estructura.
3. Usar Superpowers `writing-plans` para descomponer solo el sprint activo.
4. Aplicar las skills ECC instaladas y pertinentes, especialmente `product-capability`, `api-design`, `security-review`, `tdd-workflow` y `architecture-decision-records`.
5. Usar UI/UX Pro Max en cualquier cambio visual o de interaccion.
6. Usar revision de seguridad para auth, secretos, permisos, red o ejecucion.
7. Implementar con TDD y el cambio minimo que cierre el criterio.
8. Verificar el flujo real, revisar regresiones y actualizar `docs/IMPLEMENTATION_STATUS.md`.

No iniciar dos sprints dependientes en paralelo. Se permite paralelizar tareas independientes dentro de un sprint solo si sus contratos ya estan fijados.

### Revision adversarial obligatoria

Antes de cerrar cada plan o sprint, una IA revisora distinta del ejecutor debe buscar:

- requisitos del blueprint sin tarea o prueba;
- dependencias circulares o paralelismo falso;
- secretos, permisos o destinos con alcance excesivo;
- rollback declarado pero no verificable;
- uso de IA donde corresponde logica determinista;
- abstracciones especulativas o componentes sin consumidor;
- criterios de cierre que solo prueban build y no comportamiento real.

Los hallazgos criticos se corrigen antes del cierre. Si no existe una segunda IA disponible, se registra esa limitacion y se realiza una segunda pasada en contexto limpio; nunca se afirma revision independiente si no ocurrio.

## 18. Decisiones que deben fijarse en Sprint 0

Estas decisiones no se adivinan en este documento porque dependen de la auditoria real del fork:

- commit y licencia de Steward;
- stack y versiones heredadas que se conservaran;
- motor de base de datos y cola;
- backend de vault para desarrollo y produccion;
- protocolo de identidad entre control plane, workers y sensores;
- formato de plugin/adaptador compatible con el codigo real;
- alcance exacto del primer laboratorio multi-vendor.

Sprint 0 debe resolverlas con evidencia y ADR. Ninguna queda como excusa para iniciar codigo de producto antes de entender la base reutilizada.
