Especificación maestra — Copiloto de IA para configurar, operar y documentar infraestructura

1. Qué producto se va a construir

Se construirá una plataforma self-hosted de operación de infraestructura guiada por chat e IA. Su función principal es recibir una intención expresada en lenguaje natural —por ejemplo, “prepará una VLAN IoT aislada”, “¿por qué esta sucursal no tiene Internet?”, “instalá un DNS filtrado en este servidor” o “mostrame qué cambiará antes de actualizar estos AP”— y convertirla en una ejecución técnica segura, explicable y verificable.

No es un simple escáner ni una herramienta que muestra un mapa bonito de la red. Es un configurador y operador automático supervisado: entiende la solicitud, reúne la evidencia necesaria, diseña un plan, solicita las aprobaciones que correspondan, ejecuta acciones deterministas sobre los equipos autorizados, comprueba el resultado y deja la documentación actualizada.

El usuario conversa con un asistente técnico desde una única pantalla. No necesita decidir de entrada qué comandos, APIs o fabricantes intervienen. La plataforma determina qué información falta, consulta los equipos registrados mediante los accesos permitidos y responde en un lenguaje entendible. Cuando la tarea requiere cambiar algo, presenta antes un plan concreto: alcance, equipos afectados, comandos o acciones, impacto esperado, validaciones, reversión y nivel de riesgo. Solo después aplica la política de autonomía configurada.

La plataforma debe servir para cualquier entorno autorizado —una oficina, varias sucursales, un laboratorio o un cliente administrado— sin IPs, marcas, VLANs, aplicaciones ni reglas preconfiguradas. El descubrimiento, inventario y topología existen para que la IA no configure a ciegas: son la memoria técnica y la evidencia sobre las que el configurador toma decisiones.

Resultado que debe entregar

Para cada pedido, el producto debe poder entregar, según el acceso disponible:

una respuesta fundada sobre el estado actual;

un plan de implementación o diagnóstico por etapas;

una simulación o preflight cuando sea posible;

una ejecución controlada de cambios o instalaciones;

validación posterior y rollback cuando exista;

documentación, historial y evidencia actualizados automáticamente.

Si una acción no puede hacerse de manera fiable con las capacidades disponibles, la IA debe explicarlo y pedir el dato, credencial, adaptador o intervención humana que falta. No debe inventar configuraciones, conexiones físicas ni resultados.

Ejemplos de uso que el producto debe resolver

Pedido por chat

Comportamiento esperado

“Agregá una red Wi‑Fi de invitados aislada de la red interna.”

Identifica firewall, switches y AP involucrados; revisa compatibilidad y puertos; propone VLAN, DHCP, SSID, políticas y rollback; tras aprobación configura, prueba que obtiene IP y que no alcanza la red interna.

“La impresora del depósito no imprime; encontrá la causa y arreglala.”

Consulta conectividad, DHCP/DNS, VLAN, switch/AP y estado de la impresora; explica la evidencia; si detecta una corrección permitida, propone y ejecuta solo esa corrección; verifica una impresión o conectividad.

“Instalá y configurá esta aplicación en el servidor de la sucursal.”

Verifica recursos, sistema operativo, puertos, dependencias, backups y conflicto de servicios; propone el manifiesto de instalación; instala de forma idempotente, aplica configuración y ejecuta healthchecks.

“Mostrame qué cambió en el firewall desde la semana pasada y revertí solo la regla que bloquea el ERP.”

Compara evidencia/configuración histórica; identifica la regla con nivel de confianza y dependencias; presenta el cambio exacto, respaldo y rollback; revierte únicamente con aprobación y valida el ERP.

“Quiero dejar esta sede lista igual que la sede modelo.”

Compara una plantilla aprobada con el estado observado; genera una brecha explícita, excluye diferencias no autorizadas y ejecuta el plan por pasos, validando cada uno.

Flujo de uso esperado

El administrador crea un sitio y carga los equipos y métodos de acceso que autoriza; también puede cargar una plantilla, una incidencia o un objetivo directamente desde el chat.

El chat interpreta la intención, identifica el alcance y consulta la memoria existente. Si falta información, ordena recolecciones de solo lectura dentro del alcance permitido.

La plataforma relaciona la evidencia obtenida con equipos, configuraciones, dependencias y topología. Lo no comprobado se mantiene como unknown.

La IA devuelve un diagnóstico o un plan accionable, con riesgo, preflight, cambios precisos, pruebas y rollback. El usuario puede corregir el plan conversando antes de ejecutarlo.

Conforme a la política de autonomía, el sistema ejecuta automáticamente tareas de bajo riesgo o requiere aprobación explícita para cambios de mayor impacto.

Un runner determinista realiza las acciones; luego valida el resultado, revierte si corresponde, actualiza la documentación y deja auditoría.

Autonomía: qué puede hacer solo y qué requiere aprobación

La política se configura por sitio, equipo y tipo de acción. Por defecto, los equipos nuevos quedan en observe_only.

Nivel

Ejemplos

Regla

Observación

Consultar estado, leer configuración, generar documentación

Automático dentro del alcance autorizado.

Corrección de bajo riesgo

Reintentar un servicio, aplicar un ajuste previamente aprobado y reversible

Puede automatizarse si hay playbook, preflight y validación definidos.

Cambio controlado

Crear VLAN/SSID, cambiar reglas, instalar una aplicación, modificar rutas o DNS

Plan visible y aprobación explícita antes de ejecutar.

Alto riesgo o destructivo

Borrar datos, reiniciar infraestructura crítica, actualizar firmware, cambiar credenciales o políticas de acceso

Aprobación reforzada, ventana de mantenimiento y rollback verificable; si no hay rollback, no se oculta.

2. Alta de equipos: la entrada de información al sistema

Al cargar un equipo, el operador podrá indicar como mínimo:

Dato

Ejemplos

Nombre

Firewall matriz, Switch depósito

Tipo

Firewall, router, switch, AP, servidor, workstation, NAS, impresora, UPS, hipervisor, aplicación u otro

Sitio

Oficina central, sucursal, laboratorio

Dirección inicial

IP, FQDN o hostname

Método de conexión

API, SSH, SNMP, WinRM, RDP, VNC, web u otro adaptador

Usuario

Cuando aplique

Secreto

Contraseña, token, clave SSH, certificado o comunidad SNMP; se guarda en el vault, no en texto visible

Un equipo puede tener varios métodos de conexión. Tras guardar, el sistema prueba cada uno, identifica sus capacidades y ejecuta una recolección de solo lectura. El resultado debe diferenciar claramente entre datos declarados, observados, inferidos, contradictorios, vencidos y desconocidos.

El producto no promete descubrir todo automáticamente: la cobertura depende de las credenciales, protocolos, permisos, punto de observación y funciones expuestas por cada equipo.

3. Base reutilizada y cómo se adapta al producto

No se ensamblarán herramientas independientes sin integración. Se parte de un fork privado de Steward y se modifica para implementar el flujo anterior; Guacamole y LiteLLM cubren funciones especializadas detrás de las pantallas, permisos y auditoría del producto.

Repositorios evaluados

Proyecto

Repositorio oficial

Decisión en este proyecto

Steward

github.com/braedonsaunders/steward

Base del control plane mediante fork privado y hardening obligatorio.

LiteLLM

github.com/BerriAI/litellm

Gateway interno de proveedores y modelos de IA por API.

Apache Guacamole

github.com/apache/guacamole-client

Acceso remoto interactivo opcional desde la ficha de equipos.

Nautobot

github.com/nautobot/nautobot

Conector opcional cuando el cliente ya lo usa como fuente de verdad.

Netclaw

github.com/automateyournetwork/netclaw

No se incorpora al runtime.

SubNetree

github.com/HerbHall/subnetree

No se incorpora al producto.

Enlaces directos para revisión:

Steward: https://github.com/braedonsaunders/steward

LiteLLM: https://github.com/BerriAI/litellm

Apache Guacamole: https://github.com/apache/guacamole-client

Nautobot: https://github.com/nautobot/nautobot

Netclaw: https://github.com/automateyournetwork/netclaw

SubNetree: https://github.com/HerbHall/subnetree

Componente

Parte del producto que resuelve

Adaptación concreta

Steward

Interfaz, inventario, trabajos, políticas y orquestación

Se convierte en el control plane. Se rediseña el alta para soportar varios métodos por equipo, se incorpora el modelo de evidencia/topología de este documento, se endurece el vault y se separan los workers privilegiados.

LiteLLM

Capa interna que llama a modelos de IA por API

La UI y el control plane envían solicitudes al gateway, no a cada proveedor. Se configuran OpenAI, Anthropic, Gemini, OpenRouter y proveedores compatibles; las políticas del producto deciden qué modelos puede usar cada tarea.

Apache Guacamole

Sesión interactiva cuando un equipo solo se administra por RDP, VNC o SSH visual

Se publica como una función opcional dentro de la ficha del equipo. La plataforma crea la sesión autorizada y audita su uso; Guacamole no se usa para descubrir topología ni reemplaza los adaptadores API/SSH/SNMP.

Nautobot

Fuente de verdad existente de un cliente

Se implementa solo un conector opcional de importación/sincronización. No se instala ni duplica el inventario si el cliente no lo utiliza.

Netclaw

Ninguna función de runtime

No se incorpora.

SubNetree

Ninguna función de runtime

No se incorpora.

La instalación base contendrá el control plane adaptado de Steward, base de datos, cola, vault, workers/sensores y LiteLLM. Guacamole se activa solo cuando se necesite acceso remoto interactivo; Nautobot se conecta solo en instalaciones que ya lo tengan.

Condiciones para usar Steward

Antes de cargar secretos reales o desplegar producción se debe:

fijar un commit concreto del upstream y mantener un fork privado;

reemplazar el vault Linux actual por una solución de secretos robusta;

separar el control plane de los procesos que requieren privilegios de red;

actualizar o mitigar dependencias vulnerables;

validar en laboratorio las funciones reutilizadas.

Si Steward no supera esas condiciones, se reutilizarán únicamente los módulos que sí hayan sido comprobados; no se migrará automáticamente a otro proyecto.

4. Alcance funcional

4.1 Chat operativo e IA

El chat es la interfaz principal del producto y debe conservar el contexto de la conversación, del sitio, de los equipos autorizados y de las tareas en curso. Debe permitir que el usuario:

describa objetivos, incidentes o cambios sin conocer la implementación técnica;

pida explicaciones, diagramas, comparaciones de configuración e informes basados en evidencia;

revise, cuestione y ajuste un plan antes de autorizarlo;

siga en tiempo real el avance de una tarea, sus decisiones, salidas redactadas y pruebas;

cancele una tarea antes de un punto no reversible;

consulte el historial y retome una operación anterior con su contexto.

La IA no ejecuta shell, APIs ni sesiones remotas directamente. Convierte la intención en una solicitud estructurada de investigación, plan o acción. Un motor determinista valida alcance, permisos, parámetros, playbooks y aprobaciones antes de asignar la tarea a un worker. La respuesta del modelo jamás autoriza por sí misma un cambio.

Para tareas de configuración, el plan debe incluir: objetivo, evidencia usada, supuestos y datos faltantes, dispositivos y servicios afectados, acciones ordenadas, parámetros concretos, riesgo, impacto, preflight, validaciones, rollback, aprobaciones y condición de detención. El usuario debe poder aprobar todo el plan o una etapa concreta según la política.

4.2 Inventario y alta de equipos

Implementar un asistente de alta con estos pasos:

Identidad: nombre, tipo, sitio, IP/FQDN/hostname, fabricante/modelo opcionales, etiquetas y criticidad.

Métodos de conexión: uno o varios métodos, cada uno con host, puerto, usuario, secreto y opciones de seguridad que correspondan.

Alcance: permisos esperados, redes autorizadas y modo inicial observe_only.

Prueba: conectividad, autenticación solo con confirmación explícita y detección de capacidades de solo lectura.

Reconciliación: comparación entre lo declarado y lo observado, sin sobrescribir datos declarados silenciosamente.

La creación del equipo, endpoints, métodos y referencias a secretos debe ser transaccional. Una IP no es una identidad única: un equipo puede cambiar de IP o tener varias.

4.3 Descubrimiento y topología: memoria para el configurador

El sistema debe descubrir progresivamente desde un sensor o punto de observación autorizado:

inventario declarado y alcance permitido;

vecinos, ARP/ND y anuncios locales;

conectividad y puertos autorizados;

autenticación con los métodos registrados;

recolección estructurada mediante API, SSH, SNMP, WinRM u otro adaptador;

correlación de interfaces, rutas, tablas MAC, LLDP/CDP, STP y asociaciones Wi-Fi cuando estén disponibles;

topología con evidencia, confianza y fecha de última observación.

Cada relación de topología debe indicar si está confirmada o inferida y mostrar la evidencia que la respalda. Si no hay evidencia suficiente, el resultado es unknown.

4.4 Diagnóstico, configuración y operaciones

El sistema debe:

consultar estado y configuración por medios estructurados cuando existan;

detectar contradicciones, cobertura incompleta y fallos de conectividad;

elaborar un diagnóstico y plan de cambio desde el chat;

generar configuraciones específicas para el adaptador y la versión detectados, nunca comandos genéricos no validados;

aplicar cambios de red, servicios o aplicaciones mediante playbooks versionados e idempotentes;

comparar el estado real con una plantilla aprobada y reconciliar únicamente las diferencias seleccionadas;

exigir aprobación según riesgo;

ejecutar playbooks deterministas;

comprobar el resultado y registrar la evidencia;

realizar rollback cuando exista un mecanismo real; si no existe, declararlo antes de ejecutar.

Clasificar las acciones como observe, probe, low_risk_change, high_risk_change o destructive. Todo equipo nuevo inicia en observe_only.

4.5 Instalación de aplicaciones

La plataforma debe poder instalar, configurar, actualizar y desinstalar aplicaciones solicitadas por el usuario. No instala aplicaciones por defecto.

Cada aplicación se define mediante un manifiesto versionado con prerequisitos, recursos, puertos, secretos, preflight, instalación idempotente, healthcheck, backup, actualización, desinstalación y rollback. El runner ejecuta solo manifiestos revisados y aprobados; no ejecuta Compose o comandos arbitrarios generados por IA.

4.6 Autoinspección

El producto debe inspeccionarse a sí mismo y emitir una matriz present, missing, misconfigured, degraded o unknown para:

versión, migraciones, servicios y colas;

vault, backups y estado de secretos;

workers, sensores, herramientas y privilegios;

conectividad, DNS, rutas y recursos visibles por cada sensor;

proveedores de IA, modelos configurados y presupuestos;

jobs atrasados o fallidos;

adaptadores y paquetes de aplicaciones instalados.

La autoinspección recomienda acciones; no instala software ni modifica el entorno automáticamente.

5. Arquitectura

5.1 Servicios

Servicio

Responsabilidad

Control plane

UI, API, RBAC, inventario, políticas, auditoría y orquestación

Base de datos y cola

Estado persistente, trabajos y evidencias

Vault

Custodia y entrega temporal de secretos

LiteLLM

Gateway interno de inferencia por API

Workers

Descubrimiento, protocolos, navegador, aplicaciones y tareas especializadas

Sensor de sitio

Ejecución remota y observación dentro de cada red autorizada

Guacamole opcional

Acceso remoto interactivo

El control plane no debe tener NET_ADMIN ni NET_RAW. Las herramientas de exploración, captura o protocolos se ejecutan en workers aislados con privilegios, redes y allowlists mínimos.

5.2 Sensores y visibilidad de red

Cada sitio remoto puede ejecutar un sensor Linux que se conecta de forma saliente y autenticada al control plane. El sensor ejecuta las herramientas dentro de contenedores y solo puede alcanzar redes autorizadas.

Un sensor no puede capturar tráfico que no llega a su interfaz. Para observación adicional se necesita un punto válido: firewall/router para tráfico que lo atraviesa, puerto SPAN para tráfico local de una VLAN o un PCAP provisto para análisis offline. Las capturas deben tener interfaz, filtro, duración, tamaño y retención definidos.

5.3 Métodos de conexión

Priorizar interfaces estructuradas: API, SSH, SNMP, WinRM y protocolos específicos con adaptador. Web, RDP y VNC son acceso asistido y de mejor esfuerzo; no se presentan como una fuente universal de configuración automatizable.

Usar adaptadores por fabricante o familia solo cuando agreguen valor. El núcleo no debe contener datos ni reglas propias de un entorno de prueba.

6. Datos, evidencia y secretos

6.1 Modelo mínimo

Entidad

Información esencial

Sitio

Nombre, zona horaria, rangos autorizados, sensores y ventanas de mantenimiento

Equipo

Identidad, tipo, sitio, interfaces, endpoints, capacidades, criticidad e historial

Método de conexión

Tipo, destino, puerto, referencia de secreto, política TLS/host key, estado y última prueba

Credencial

Referencia opaca, alcance, tipo, usuario/etiqueta, estado y rotación; nunca el valor secreto

Evidencia

Campo, valor, fuente, fecha, TTL, confianza, clasificación y referencia al dato crudo redactado

Las clasificaciones permitidas son declared, observed, inferred, contradicted, stale y unknown.

6.2 Vault

Implementar una interfaz SecretBackend. La clave maestra no puede derivarse de datos previsibles del host. Los secretos no deben aparecer en UI, API, logs, auditoría ni prompts.

Requisitos mínimos: cifrado con separación de clave y datos, permisos restrictivos, rotación, backup cifrado, restauración probada, redacción centralizada y entrega del secreto solo al worker y durante la tarea autorizada.

7. IA por API

El runtime final usa únicamente APIs de IA. Los proveedores iniciales configurables son OpenAI, Anthropic, Google Gemini, OpenRouter y endpoints compatibles que se validen realmente.

La UI debe permitir registrar proveedores, credenciales, base URL, modelos permitidos, límites de gasto y reglas de privacidad. El catálogo de un proveedor puede provenir de su API, de configuración del operador o de pruebas controladas; no se infieren capacidades por el nombre del modelo.

El router elige según capacidad requerida, calidad validada, privacidad, contexto, latencia, salud, costo, presupuesto y preferencia del usuario. Debe registrar el modelo elegido y el motivo. El fallback no debe duplicar herramientas ni reenviar secretos.

La IA puede interpretar resultados, resumir evidencia y proponer un plan. Un runtime determinista valida permisos, parámetros y políticas antes de usar cualquier herramienta. Nunca enviar credenciales, claves privadas, tokens, cookies, PCAP completos o configuraciones sin redacción.

8. Seguridad y operación

Aplicar RBAC por usuario, sitio, equipo, método de conexión, secreto y tipo de acción.

Limitar descubrimiento y ejecución a rangos, destinos y ventanas autorizadas.

Verificar claves de host y certificados cuando aplique.

Usar SNMPv3 cuando sea posible; marcar protocolos heredados como riesgo explícito.

Toda acción debe incluir preflight, plan, aprobación, timeout, idempotency key, verificación y auditoría redactada.

Mantener registros de quién ejecutó, qué se intentó, sobre qué equipo, con qué resultado y qué evidencia se produjo.

Probar backup, restore, pérdida de conectividad, cancelación de jobs y recuperación ante reinicio.

9. Desarrollo y despliegue

Desarrollar en macOS con Docker Desktop y desplegar en Linux AMD64. El runtime y las herramientas viven en contenedores Linux; el host aporta Docker, kernel, red y almacenamiento. Cuando Docker Desktop no tenga visibilidad de una red remota, usar un sensor Linux o un túnel autorizado.

Entregar como mínimo:

compose.yaml, compose.dev.yaml, compose.prod.yaml y compose.sensor.yaml;

healthchecks, perfiles y límites de recursos;

scripts idempotentes de backup, restore y migración;

imágenes fijadas por digest para producción;

SBOM, escaneo de secretos y de imágenes en CI;

documentación de puertos, redes, volúmenes, requisitos y recuperación.

10. Documentación y ejecución por sprints

Antes de implementar cambios funcionales, crear SPRINTS.md. Cada sprint debe incluir objetivo, dependencias, alcance, tareas, riesgos, pruebas, evidencias, criterio de cierre, rollback y estado.

Crear además:

docs/ARCHITECTURE.md;

docs/THREAT_MODEL.md;

docs/REUSE_MATRIX.md;

docs/UPSTREAM.md;

docs/CAPABILITY_MATRIX.md;

docs/IMPLEMENTATION_STATUS.md;

docs/ADR/ para decisiones materiales.

Orden mínimo de ejecución:

fijar el fork y validar Steward en laboratorio;

corregir dependencias, secretos y separación de privilegios;

implementar modelo de datos y alta de equipos;

separar workers y sensores;

implementar descubrimiento, reconciliación y topología;

integrar LiteLLM y proveedores API;

implementar operaciones, aprobaciones y auditoría;

habilitar Guacamole opcional;

implementar framework de aplicaciones y autoinspección;

endurecer, restaurar desde backup y ejecutar piloto de solo lectura.

No usar infraestructura ni credenciales reales antes de cerrar las etapas de seguridad, vault y aislamiento.

11. Criterios de aceptación

El proyecto estará listo para piloto cuando demuestre:

instalación vacía, sin marcas, IPs ni redes preconfiguradas;

alta transaccional de un equipo con varios métodos de conexión;

secretos imposibles de recuperar desde UI, API, logs o prompts;

vault con rotación y restore verificados;

descubrimiento limitado a alcance autorizado;

inventario y topología con fuente, fecha, confianza y estado de evidencia;

unknown cuando no exista evidencia suficiente;

proveedores API configurables de forma independiente, con selección manual y automática explicable;

un flujo de chat completo: solicitud en lenguaje natural → recolección autorizada → plan revisable → aprobación → ejecución → validación → evidencia e historial;

una configuración multiequipo de laboratorio ejecutada por playbooks —por ejemplo, segmentación de invitados— con preflight, prueba de aislamiento y rollback comprobado;

una instalación de aplicación mediante manifiesto idempotente, healthcheck y desinstalación o rollback probado;

cambios con aprobación, preflight, verificación, auditoría y rollback o declaración de irreversibilidad;

workers aislados y control plane sin privilegios de captura o administración de red;

backup y restauración completos en un host limpio;

funcionamiento comprobado en laboratorio y piloto controlado de solo lectura.