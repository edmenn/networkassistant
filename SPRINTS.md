# Plan de sprints

## Como ejecutar este plan

Cada sprint produce software o evidencia verificable y termina con un gate. La IA implementadora debe crear un plan detallado del sprint activo en `docs/superpowers/plans/`, con tareas pequenas, pruebas primero, archivos exactos y commits frecuentes. No debe expandir sprints futuros hasta cerrar el actual.

Estados permitidos: `not_started`, `in_progress`, `blocked`, `done`.

Cada sprint es un cambio revisable por separado. En un repositorio Git, usar una rama/PR por sprint; sin Git, trabajar en modo directo y guardar evidencia equivalente. Arquitectura, seguridad, migraciones, vault y politicas requieren el modelo/revisor mas fuerte disponible; tareas mecanicas pueden usar el modelo normal.

## Resumen

| Sprint | Resultado | Depende de | Estado |
|---|---|---|---|
| 0 | Base y decisiones comprobadas | Ninguno | done |
| 1 | Seguridad fundacional y vault | 0 | not_started |
| 2 | Modelo de dominio y alta transaccional | 1 | not_started |
| 3 | Jobs, workers y sensor aislado | 1, 2 | not_started |
| 4 | Recoleccion read-only y reconciliacion | 3 | not_started |
| 5 | Inventario, evidencia y topologia UX | 4 | not_started |
| 6 | IA por API sobre contexto redactado | 4, 5 | not_started |
| 7 | Diagnostico, aprobaciones y playbooks | 6 | not_started |
| 8 | Guacamole e integraciones opcionales | 5, 7 | not_started |
| 9 | Aplicaciones y autoinspeccion | 7 | not_started |
| 10 | Hardening, recuperacion y supply chain | 1-9 | not_started |
| 11 | Piloto controlado de solo lectura | 10 | not_started |

## Grafo de dependencias y paralelismo

```text
0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 9 -> 10 -> 11
                              \      \-> 8 --/
```

- Camino critico: `0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11`.
- Sprint 8 puede avanzar en paralelo con Sprint 9 despues de cerrar 7, porque sus archivos y contratos deben permanecer separados.
- Dentro de Sprint 0 pueden paralelizarse auditoria de seguridad, mapa de arquitectura y laboratorio, pero los ADR se escriben despues de reunir sus resultados.
- Dentro de Sprint 4 los adaptadores SSH y SNMP pueden implementarse en paralelo una vez fijado el contrato comun.
- Dentro de Sprint 5 inventario y topologia pueden avanzar en paralelo despues de fijar API y tokens visuales compartidos.
- No paralelizar vault/RBAC, modelo transaccional, contrato de jobs ni hardening final.

## Protocolo de cambios al plan

No editar silenciosamente el orden o alcance. Toda mutacion se registra al final de este archivo con fecha, motivo, impacto y aprobador.

- `insert`: agregar un sprint bloqueante y actualizar todas las dependencias afectadas.
- `split`: dividir un sprint cuando ya no sea una unidad revisable; cada parte conserva gate propio.
- `reorder`: permitido solo si no viola el grafo y una prueba demuestra compatibilidad.
- `skip`: exige evidencia de que el requisito ya esta satisfecho o fue retirado del blueprint.
- `abandon`: conserva resultados, riesgos y decision de no continuar.

Formato del registro:

```text
YYYY-MM-DD | accion | sprint(s) | motivo | impacto | aprobado por
```

## Anti-patrones que invalidan un sprint

- cerrar por build verde sin probar el flujo real;
- introducir interfaces, factories o plugins sin segundo consumidor real;
- compartir secretos mediante variables globales, logs, eventos o prompts;
- usar un LLM para validar permisos, parametros o estados;
- llamar rollback a una segunda accion no probada;
- descubrir fuera de allowlists “para obtener mas cobertura”;
- ocultar `unknown`, `stale` o contradicciones para simplificar la UI;
- crear documentos vacios como sustituto de decisiones.

---

## Sprint 0 - Fundacion y reuse gate

**Objetivo:** decidir con evidencia que partes de Steward se reutilizan y dejar un entorno reproducible sin secretos reales.

**Alcance:** fork, auditoria, arquitectura inicial, threat model, matriz de reutilizacion, stack y laboratorio sintetico.

**Tareas:**

- Crear fork privado, fijar commit upstream y registrar licencia/procedencia.
- Ejecutar la aplicacion heredada en macOS/Docker y Linux AMD64 de laboratorio.
- Mapear el repositorio con Graphify y documentar entrypoints, persistencia, auth, jobs y secretos.
- Inventariar dependencias y vulnerabilidades; clasificar bloqueantes.
- Crear `docs/REUSE_MATRIX.md` con `reuse/adapt/replace/exclude` por modulo.
- Crear `docs/UPSTREAM.md` con commit, estrategia de sincronizacion y conflictos esperados.
- Crear `docs/ARCHITECTURE.md`, `docs/THREAT_MODEL.md` y ADR de stack, DB, cola y vault.
- Crear `docs/CAPABILITY_MATRIX.md` con capacidad, fuente, protocolo, permisos, soporte y evidencia de laboratorio.
- Verificar que `ecc@ecc` siga instalado, habilitado y con cache valido; seleccionar solo las skills necesarias y no confiar en hooks o MCP sin una decision explicita.
- Definir laboratorio sin credenciales reales: dispositivos simulados o dedicados, rangos y datos ficticios.
- Crear `docs/IMPLEMENTATION_STATUS.md` con matriz de requisitos del blueprint.

**Riesgos:** heredar vulnerabilidades, licencia incompatible, stack obsoleto, vault inseguro o acoplamiento que impida separar workers.

**Pruebas y evidencia:**

- arranque reproducible desde checkout limpio;
- inventario de componentes y CVE guardado;
- flujo heredado principal recorrido en laboratorio;
- secretos de prueba ausentes de Git y logs;
- ADR sin decisiones abiertas necesarias para Sprint 1.

**Gate de cierre:** existe una decision sustentada sobre Steward y un camino minimo para adaptar o reemplazar cada modulo bloqueante. Si falla, no se inicia desarrollo funcional.

**Rollback:** eliminar el entorno sintetico y volver al commit fijado; conservar documentos de auditoria.

---

## Sprint 1 - Seguridad fundacional y vault

**Objetivo:** impedir que cualquier desarrollo posterior dependa de secretos inseguros o privilegios excesivos.

**Dependencias:** Sprint 0.

**Tareas:**

- Implementar la interfaz `SecretBackend` y seleccionar backends de desarrollo/produccion por ADR.
- Separar clave y datos, identidades de workload, leases, revocacion y rotacion.
- Centralizar redaccion para API, logs, errores, auditoria, trazas y prompts.
- Implementar RBAC por usuario, sitio, equipo, metodo, secreto y clase de accion.
- Crear politicas de rango/destino, ventanas y bloqueo SSRF.
- Quitar privilegios de red al control plane y demostrarlo en runtime.
- Implementar auditoria append-only o con evidencia de integridad acorde al stack.
- Crear backup cifrado y restore del vault con datos ficticios.

**Riesgos:** fuga por excepciones, debug logs, trazas, backups o prompts; secreto huerfano tras una transaccion fallida.

**Pruebas y evidencia:**

- canarios secretos buscados en respuestas, logs, DB, trazas y prompts;
- matriz RBAC con casos permitidos y denegados;
- intentos SSRF contra loopback, metadata cloud y DNS cambiante bloqueados;
- rotacion, revocacion y restore en entorno limpio;
- inspeccion de capabilities del contenedor de control plane.

**Gate de cierre:** ningun canario es recuperable fuera del vault y el restore reproduce secretos utilizables solo por workloads autorizados.

**Rollback:** restaurar backup cifrado anterior y revocar todos los leases emitidos durante la prueba.

---

## Sprint 2 - Dominio y alta transaccional

**Objetivo:** registrar sitios y equipos con varios metodos sin confundir direccion con identidad.

**Dependencias:** Sprint 1.

**Tareas:**

- Implementar migraciones para Site, Device, Endpoint, ConnectionMethod, Capability, Observation y Evidence.
- Implementar estados y clasificaciones exactos del blueprint.
- Crear API versionada con errores estructurados y autorizacion por recurso.
- Implementar alta transaccional y compensacion de secretos huerfanos.
- Implementar wizard: identidad, conexiones, alcance, confirmacion de prueba y reconciliacion.
- Crear empty state para el primer sitio/equipo.
- Implementar historial sin sobrescritura silenciosa.

**Riesgos:** duplicar equipos por IP, estados parciales, condiciones de carrera, fuga del secreto en validaciones.

**Pruebas y evidencia:**

- equipo con dos IP y dos metodos;
- cambio de IP conservando identidad e historial;
- rollback completo ante fallo entre vault y DB;
- dos altas concurrentes no corrompen datos;
- navegacion por teclado, errores accesibles y responsive del wizard.

**Gate de cierre:** desde una instalacion vacia se crea un equipo multi-metodo y ningun fallo deja registros o secretos parciales.

**Rollback:** migracion reversible mientras no destruya evidencia; backup obligatorio antes de cambios no reversibles.

---

## Sprint 3 - Jobs, workers y sensor aislado

**Objetivo:** ejecutar tareas acotadas fuera del control plane.

**Dependencias:** Sprints 1 y 2.

**Tareas:**

- Implementar contrato y maquina de estados de Job.
- Implementar idempotencia, timeout, cancelacion, retry limitado y dead-letter handling.
- Crear worker aislado con capacidades declaradas y allowlist.
- Crear sensor Linux con conexion saliente autenticada y rotacion de identidad.
- Validar firma/integridad, vencimiento y alcance de trabajos en el worker.
- Empaquetar `compose.sensor.yaml` con limites de recursos y red.
- Mostrar salud, version, capacidades y ultima conexion del sensor.

**Riesgos:** ejecucion duplicada, ampliacion de alcance, sensor comprometido, jobs eternos o cancelacion insegura.

**Pruebas y evidencia:**

- mensaje duplicado produce un solo efecto;
- trabajo alterado, vencido o fuera de rango es rechazado;
- perdida/reconexion del sensor no pierde el estado;
- reinicio de cola/worker recupera jobs segun politica;
- control plane sigue sin privilegios de red.

**Gate de cierre:** un sensor ejecuta un probe sintetico permitido y rechaza objetivos fuera de alcance, con auditoria completa.

**Rollback:** revocar identidad del sensor, drenar cola y volver a imagen previa.

---

## Sprint 4 - Collectors read-only y reconciliacion

**Objetivo:** obtener evidencia estructurada sin modificar equipos.

**Dependencias:** Sprint 3.

**Tareas:**

- Definir contrato de adaptador: capabilities, collect, normalize y errores seguros.
- Implementar SSH read-only con host key policy.
- Implementar SNMPv3 read-only; marcar v1/v2c como riesgo si se habilitan.
- Incorporar API read-only solo para un equipo real del laboratorio si aporta cobertura necesaria.
- Guardar artefacto crudo cifrado/redactado y observaciones normalizadas.
- Implementar TTL, `stale`, contradicciones y reconciliacion determinista.
- Medir cobertura y explicar por que un dato es `unknown`.

**Riesgos:** comandos aparentemente read-only con efectos, parsers fragiles, datos sensibles en output o inferencias con confianza falsa.

**Pruebas y evidencia:**

- fixtures versionados sin secretos;
- contratos comunes pasan para cada adaptador;
- timeout y salida inesperada no corrompen observaciones;
- declarado/observado contradictorio conserva ambos;
- ausencia de respuesta termina en `unknown`, no en `false`.

**Gate de cierre:** dos protocolos producen inventario estructurado, evidencia trazable y reconciliacion reproducible en laboratorio.

**Rollback:** deshabilitar adaptador por feature flag operativo y conservar evidencia previa como `stale`.

---

## Sprint 5 - Inventario, evidencia y topologia

**Objetivo:** hacer comprensible la infraestructura y sus limites de visibilidad.

**Dependencias:** Sprint 4.

**Tareas:**

- Implementar tabla de inventario con filtros, cobertura, salud y estados de evidencia.
- Implementar ficha de equipo con endpoints, metodos, capacidades, historial y jobs.
- Correlacionar interfaces, vecinos, rutas, MAC, ARP/ND y LLDP/CDP disponibles.
- Implementar Relationship con evidencia, confianza y vigencia.
- Crear topologia interactiva y alternativa accesible tabular.
- Agregar filtros por sitio, tipo, fecha, fuente, confianza y clasificacion.
- Probar UI en 375, 768, 1024 y 1440 px, teclado y reduced motion.

**Riesgos:** grafo ilegible, relaciones duplicadas, color como unico significado o falsa precision.

**Pruebas y evidencia:**

- relacion confirmada e inferida visualmente distinguibles con texto;
- cada arista abre evidencia y fecha;
- datos vencidos cambian a `stale` sin desaparecer;
- topologia operable sin mouse y consultable como tabla;
- dataset grande de laboratorio mantiene interaccion aceptable.

**Gate de cierre:** un operador puede explicar de donde sale cada dispositivo y relacion, y reconocer lo desconocido.

**Rollback:** desactivar nueva visualizacion y conservar API/modelo de evidencia.

---

## Sprint 6 - IA por API y consultas con evidencia

**Objetivo:** responder preguntas sin convertir al modelo en autoridad ni filtrar secretos.

**Dependencias:** Sprints 4 y 5.

**Tareas:**

- Integrar LiteLLM detras de una interfaz interna.
- Configurar proveedores, modelos permitidos, base URL, presupuesto y privacidad.
- Implementar seleccion manual y automatica explicable.
- Construir contexto solo desde recursos autorizados y redactados.
- Exigir salida estructurada con hechos, inferencias, faltantes y citas internas.
- Registrar modelo, motivo, costo, latencia y fallback sin contenido sensible.
- Implementar limites, cancelacion y comportamiento cuando no hay proveedor sano.

**Riesgos:** prompt injection desde evidencia, exfiltracion, alucinaciones, fallback que duplica acciones o gasto.

**Pruebas y evidencia:**

- canarios de secretos no llegan al gateway;
- evidencia maliciosa no altera permisos ni herramientas;
- respuesta sin soporte indica `unknown`;
- proveedor caido activa fallback una sola vez segun presupuesto;
- cada afirmacion operativa enlaza evidencia autorizada.

**Gate de cierre:** preguntas de laboratorio reciben respuestas trazables y ningun modelo puede ejecutar o ampliar acceso.

**Rollback:** deshabilitar IA sin afectar inventario, descubrimiento ni operacion manual.

---

## Sprint 7 - Diagnostico, aprobaciones y playbooks

**Objetivo:** ejecutar primero una operacion de bajo riesgo con controles completos.

**Dependencias:** Sprint 6.

**Tareas:**

- Implementar clasificacion de riesgo y motor de politicas.
- Implementar solicitud, aprobacion, rechazo, vencimiento y separacion de funciones.
- Definir formato versionado de Playbook con esquemas cerrados.
- Implementar un playbook real de bajo riesgo elegido por el laboratorio.
- Implementar preflight, diff/impacto, timeout, verificacion independiente y auditoria.
- Implementar rollback solo si el mecanismo fue probado; si no, mostrar `unavailable` antes de aprobar.
- Crear UI de aprobacion accesible y resistente a doble envio.

**Riesgos:** parametros libres, aprobacion reutilizable, TOCTOU, falso rollback o verificacion basada en la misma escritura.

**Pruebas y evidencia:**

- solicitante no aprueba su propia accion cuando la politica lo prohibe;
- cambio del objetivo invalida aprobacion;
- doble click/idempotencia no duplica el cambio;
- preflight fallido impide ejecucion;
- verificacion posterior detecta resultado inesperado;
- irreversibilidad aparece antes de confirmar.

**Gate de cierre:** una accion de bajo riesgo completa solicitud, aprobacion, ejecucion, verificacion y auditoria en laboratorio.

**Rollback:** playbook documenta y prueba su retorno; despliegue permite volver a version previa sin perder auditoria.

---

## Sprint 8 - Acceso e integraciones opcionales

**Objetivo:** agregar funciones especializadas sin acoplarlas al nucleo.

**Dependencias:** Sprints 5 y 7.

**Tareas:**

- Integrar Guacamole como perfil opcional con autorizacion y auditoria.
- Usar credenciales temporales cuando el protocolo lo permita.
- Implementar cierre, timeout y revocacion de sesiones.
- Definir contrato de importacion/sincronizacion y conector Nautobot.
- Implementar dry-run y resolucion explicita de conflictos.
- Demostrar que la instalacion base funciona sin ambos componentes.

**Riesgos:** sesiones huerfanas, grabaciones sensibles, credenciales persistentes o sincronizacion destructiva.

**Pruebas y evidencia:**

- usuario sin permiso no obtiene sesion;
- cierre/revocacion corta acceso;
- logs no contienen credenciales;
- dry-run de Nautobot muestra altas/cambios/conflictos;
- deshabilitar opcionales no rompe el nucleo.

**Gate de cierre:** opcionales se activan y desactivan de forma independiente, con RBAC y auditoria.

**Rollback:** eliminar perfiles opcionales, revocar sesiones/tokens y conservar inventario previo.

---

## Sprint 9 - Aplicaciones y autoinspeccion

**Objetivo:** operar paquetes aprobados y diagnosticar la propia plataforma.

**Dependencias:** Sprint 7.

**Tareas:**

- Definir manifiesto versionado con prerequisitos, recursos, puertos, secretos, preflight, install, healthcheck, backup, update, uninstall y rollback.
- Validar manifiestos contra esquema cerrado y firma/procedencia.
- Implementar runner sin shell/comandos arbitrarios generados por IA.
- Crear un paquete de laboratorio idempotente y reversible.
- Implementar matriz de autoinspeccion del blueprint.
- Mostrar causas y recuperacion para `missing`, `misconfigured`, `degraded` y `unknown`.
- Mantener autoinspeccion en modo recomendacion, sin autocorreccion.

**Riesgos:** manifiesto como via de ejecucion arbitraria, rollback incompleto o diagnostico que modifica el sistema.

**Pruebas y evidencia:**

- manifiesto invalido o no aprobado se rechaza;
- doble instalacion conserva estado;
- backup/update/rollback del paquete funcionan;
- autoinspeccion detecta un worker caido y un proveedor mal configurado;
- ninguna recomendacion se ejecuta automaticamente.

**Gate de cierre:** un paquete de laboratorio completa su ciclo y la plataforma diagnostica fallas inyectadas sin modificarlas.

**Rollback:** desinstalacion/restore del paquete y deshabilitacion del runner.

---

## Sprint 10 - Hardening y recuperacion

**Objetivo:** demostrar que el sistema puede actualizarse, fallar y recuperarse con seguridad.

**Dependencias:** Sprints 1 a 9.

**Tareas:**

- Crear compose de desarrollo, produccion y sensor con imagenes fijadas.
- Agregar healthchecks, limites, redes, volumenes y perfiles.
- Ejecutar threat-model review y revision de seguridad independiente.
- Activar CI: tests, lint/typecheck del stack, secret scan, SCA, image scan y SBOM.
- Implementar backup completo, restore y verificacion de consistencia.
- Probar migracion, rollback de version, cancelacion y reinicio.
- Documentar runbooks de incidente, perdida de sensor, vault y cola.
- Ejecutar pruebas de carga razonables para inventario/jobs del piloto.

**Riesgos:** backup no restaurable, migracion irreversible, dependencia vulnerable o defaults inseguros.

**Pruebas y evidencia:**

- restore completo en host Linux AMD64 limpio;
- perdida de DB/cola/sensor simulada y recuperada;
- escaneos sin hallazgos criticos/altos abiertos;
- puertos y privilegios coinciden con documentacion;
- upgrade y rollback conservan evidencia/auditoria.

**Gate de cierre:** disaster-recovery drill reproducible y checklist de seguridad aprobado.

**Rollback:** imagenes anteriores, backup pre-upgrade y procedimiento probado.

---

## Sprint 11 - Piloto read-only

**Objetivo:** validar valor y limites con infraestructura controlada sin habilitar cambios.

**Dependencias:** Sprint 10.

**Tareas:**

- Elegir sitio piloto, propietario, ventana, rangos y equipos autorizados.
- Mantener todos los equipos en `observe_only`.
- Cargar credenciales de minimo privilegio y protocolo seguro.
- Ejecutar onboarding, collectors, reconciliacion, topologia e investigacion IA.
- Medir cobertura, falsos positivos, `unknown`, carga y experiencia del operador.
- Realizar backup/restore posterior al piloto.
- Registrar incidentes, feedback y decisiones de go/no-go.
- Crear backlog de version operable basado solo en evidencia del piloto.

**Riesgos:** ampliar alcance, afectar equipos, expectativas de cobertura total o conservar datos mas tiempo del autorizado.

**Pruebas y evidencia:**

- allowlists y `observe_only` comprobados antes/durante/despues;
- ninguna operacion de cambio disponible en UI/API;
- cada hallazgo tiene evidencia y cada hueco aparece como `unknown`;
- retencion y eliminacion se cumplen;
- restore final y reporte del piloto aprobados.

**Gate de cierre:** propietario tecnico y de seguridad aceptan el reporte; existe decision explicita de avanzar, corregir o detener.

**Rollback:** revocar credenciales/sensores, detener collectors y eliminar datos segun politica conservando solo auditoria autorizada.

---

## Gate de listo para produccion

El producto no se declara listo para produccion hasta demostrar todos estos puntos:

- instalacion vacia sin datos de una red concreta;
- alta multi-metodo transaccional;
- secretos no recuperables desde superficies no autorizadas;
- rotacion y restore del vault;
- control plane sin privilegios de red;
- workers/sensores aislados y restringidos;
- evidencia y topologia con fuente, tiempo, confianza y clasificacion;
- `unknown` ante falta de evidencia;
- IA configurable y explicable sin acceso a secretos;
- cambios con preflight, aprobacion, idempotencia, verificacion y rollback real o irreversibilidad visible;
- backup/restore completo en host limpio;
- piloto read-only cerrado sin incidentes criticos abiertos.
