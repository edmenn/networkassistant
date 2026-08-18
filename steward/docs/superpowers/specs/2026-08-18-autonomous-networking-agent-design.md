# Agente autónomo de networking sobre Steward

## Objetivo

Convertir Steward en el control plane de un agente de networking que permita a una persona sin conocimiento especializado solicitar cambios en lenguaje natural. El agente debe descubrir y consultar la red real, construir un plan por equipos, pedir aprobación antes de cambiar red, ejecutar con evidencia, verificar el resultado desde el punto de vista del cliente y recuperar el estado si falla.

El primer alcance es crear una VLAN y configurarla en UniFi. El segundo alcance, independiente, es auditar el FortiGate 40F y cambiar de forma controlada el ISP WAN principal entre el enlace personal actual y Claro.

## Decisiones

1. Steward sigue siendo el control plane. No se reemplazan su vault, grafo, jobs, políticas, aprobaciones, auditoría, navegador, protocol broker ni adapters.
2. La IA no ejecuta comandos de red libres. Compone planes con capacidades declarativas y limitadas por adapter.
3. Un cambio de red es una misión durable multi-dispositivo, no una sucesión de playbooks independientes.
4. La IA puede explorar equipos desconocidos en solo lectura y producir un adapter candidato. Ningún adapter candidato puede escribir hasta validación humana y prueba reproducible.
5. Lectura y descubrimiento son automáticos. Cualquier mutación de VLAN, WAN, DHCP, firewall o Wi-Fi requiere aprobación explícita del operador.
6. La verificación de éxito es de extremo a extremo; una respuesta exitosa de API o WebUI no basta.

## Arquitectura

### Reutilización de Steward

| Componente existente | Uso en networking |
| --- | --- |
| Discovery, evidence y graph temporal | Inventario, topología, puertos, servicios, historial y dependencia entre equipos. |
| Vault y capability broker | Credenciales aisladas por equipo y protocolo; el modelo nunca recibe secretos. |
| Adapters y web sessions | Superficie específica de cada proveedor, ya sea API, SSH o WebUI persistente. |
| Policy engine, approvals y audit log | Evaluación de riesgo, aprobación visible y trazabilidad de toda acción. |
| Jobs, missions y saga | Ejecución durable, checkpoints y compensación. |
| Browser/Playwright | Operación de equipos que solo disponen de WebUI, con estados y capturas guardadas. |

### Nuevo: Network Change Coordinator

Se agrega sobre las missions existentes, sin reescribir el agent loop. Cada `NetworkChangeMission` contiene:

- intención normalizada y parámetros declarados;
- equipos objetivo y relaciones comprobadas en el grafo;
- precondiciones de cada etapa;
- snapshot exportado y lectura normalizada de estado anterior;
- pasos ordenados, cada uno asociado a una capacidad de adapter;
- checkpoints, pruebas de postcondición y evidencia adjunta;
- compensaciones por paso y ruta de rescate;
- estado terminal: `verified`, `rolled_back`, `blocked` o `needs_operator`.

La misión no puede ejecutar el siguiente paso si falla la postcondición del actual. Si una etapa mutante falla, ejecuta la compensación aplicable en orden inverso y conserva todas las evidencias.

### Adapters iniciales

| Equipo | Transporte preferido | Capacidades iniciales |
| --- | --- | --- |
| FortiGate 40F | API o SSH broker | Leer/exportar configuración; interfaces VLAN; DHCP; políticas; rutas; estado y prioridad WAN; pruebas de conectividad. |
| UniFi Controller | API autenticada | Leer redes, APs, SSIDs y perfiles; crear red/VLAN; asociar SSID y perfil; validar aprovisionamiento de AP. |
| HPE OfficeConnect 1920S JL381A | WebUI local | Leer/exportar configuración visible; VLANs; pertenencia de puertos; trunks; aplicar y releer estado. |
| HPE Networking Instant On 1930 JL681A en modo local | WebUI local aislada | Descubrir estado local, VLAN y uplink; detectar operaciones con impacto de reprovisionamiento; bloquear cambios riesgosos sin plan de rescate explícito. |
| Linux servers/computers | SSH broker | Lecturas de conectividad y pruebas desde un cliente de verificación; no son fuente de autoridad de VLAN. |

Los adapters exponen operaciones pequeñas: leer VLANs, crear VLAN, asignar miembro tagged/untagged, crear red, asociar SSID, crear política, leer WAN, cambiar prioridad WAN, respaldar y verificar. No se programa un playbook distinto para cada frase del usuario.

## Flujo de decisión y ejecución

1. La IA interpreta la solicitud y extrae parámetros. Pregunta solamente por los datos que no se pueden descubrir de forma segura, como ID/subred cuando no existe una convención verificable.
2. Consulta el grafo y usa capacidades de solo lectura contra FortiGate, UniFi y switches para confirmar VLANs existentes, conexiones uplink, puertos, reglas, pools DHCP, rutas, APs y estado de los enlaces.
3. Construye un plan específico de la topología observada. Por ejemplo, para IoT: crear L3/DHCP/política en FortiGate, transportar por uplinks HPE, crear red y SSID en UniFi y validar el AP objetivo.
4. Calcula impacto y presenta un resumen entendible: equipos afectados, ventanas de posible corte, estado previo, pruebas y rollback.
5. Tras aprobación explícita, guarda snapshots, ejecuta por etapas y comprueba cada postcondición.
6. Verifica DHCP, DNS permitido, acceso a Internet y denegación hacia LAN desde un cliente o sensor perteneciente a la VLAN nueva. Si no existe ese punto de prueba, el resultado queda `needs_operator`; nunca se declara `verified`.
7. Actualiza el grafo, el historial y las capacidades/adapters con la evidencia observada.

## Flujo WAN posterior

El cambio de ISP es una misión separada. Antes de mutar, debe confirmar interfaces físicas, gateway/health checks, rutas por defecto, políticas NAT y sesiones relevantes. Debe mantener una ruta de administración o una reversión temporizada antes de alterar la prioridad. Solo se considera exitoso cuando el tráfico de prueba usa el nuevo enlace y la administración de Steward sigue disponible.

## Aprendizaje controlado

Para un equipo no reconocido, la IA usa discovery, WebUI o protocolos disponibles en modo lectura. Resume identidad, endpoints, selectores o contratos observados y genera un adapter candidato con matchers estrechos. El operador revisa el candidato y se exige una prueba de replay o laboratorio antes de habilitar capacidades mutantes. La evidencia puede mejorar perfiles y prompts; no habilita escritura ni altera políticas por sí misma.

## Seguridad y fallos

- Toda mutación de red exige aprobación, incluso si el adapter ya fue validado.
- Se aplican snapshots y export de configuración antes de cambiar cuando el equipo lo permita.
- Operaciones sin rollback seguro requieren una ruta de rescate explícita o se bloquean.
- Reintentos automáticos solo son admisibles para lecturas idempotentes; no para configuraciones de red.
- Los secretos permanecen en Vault y nunca entran a prompts, artefactos, logs ni capturas.
- Fallos repetidos de un adapter o familia pasan a cuarentena mediante la política existente.

## Verificación

Cada adapter requiere pruebas de contrato con fixtures/replay para lecturas, mutaciones, error de autenticación y compensación. El coordinator requiere pruebas de orden, precondición, parada, compensación y reanudación durable. Cada primer despliegue debe superar un E2E controlado con equipos reales y un cliente de prueba antes de permitir el flujo en redes de usuarios.

## No alcance

- No se construye una consola gráfica de networking separada.
- No se habilita ejecución libre de shell, API o navegador por parte del modelo.
- No se promete soporte mutante para fabricantes desconocidos sin validación.
- No se incluye aún failover WAN automático ni cambios de firmware.

## Criterios de aceptación de los dos primeros recorridos

### VLAN y UniFi

Una solicitud en lenguaje natural genera un plan basado en lecturas reales, requiere aprobación, crea solamente los elementos necesarios en FortiGate/UniFi/HPE según la topología, y deja evidencia de IP/DHCP, DNS, Internet y aislamiento de LAN. Ante fallo, no sigue etapas dependientes y recupera o declara exactamente qué recuperación requiere operador.

### Cambio de WAN

Una solicitud primero entrega una auditoría verificable de interfaces, rutas, health checks, políticas y ruta de administración. Tras aprobación, conmuta el ISP principal con una recuperación predefinida y prueba que el tráfico y la administración llegan por el enlace elegido.
