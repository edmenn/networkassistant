# Matriz de capacidades

## Alcance del primer piloto

El primer piloto real cubre exclusivamente firewall, routers, switches y puntos de acceso de la red propia. PCs, IoT y cualquier operación de cambio están fuera de alcance. Una capacidad solo pasa de `planned` a `lab` o `pilot` cuando existe evidencia reproducible.

Capacidades previstas para recolección read-only y operación, con fuente, protocolo, permisos, soporte y evidencia de laboratorio. Se amplía al construir los adaptadores (Sprint 4).

Leyenda de soporte: `planned` (definido en ADR, no implementado) · `reuse` (heredado de Steward) · `lab` (probado en laboratorio) · `pilot` (verificado en la red propia read-only).

| Capacidad | Fuente | Protocolo | Permisos mínimos | Soporte | Evidencia |
|---|---|---|---|---|---|
| Identidad/estado del equipo | SSH | SSH | Usuario de solo lectura | `planned` | Pendiente lab |
| Interfaces y direcciones | SSH/SNMPv3 | SSH/SNMPv3 | Lectura | `planned` | Pendiente lab |
| Vecinos LLDP/CDP/STP | SSH/SNMPv3 | SSH/SNMPv3 | Lectura | `planned` | Pendiente lab |
| Tablas ARP/ND, MAC, rutas | SSH/SNMPv3 | SSH/SNMPv3 | Lectura | `planned` | Pendiente lab |
| SNMP v3 (inventario, interfaz) | Dispositivo | SNMPv3 | Comunidad/credencial v3 | `planned` | Pendiente lab |
| SNMP v1/v2c | Dispositivo | SNMPv1/v2c | Comunidad (riesgo visible) | `planned` | No habilitado por defecto |
| Host/versión/OS | SSH/SNMP | SSH/SNMPv3 | Lectura | `planned` | Pendiente lab |
| Conectividad TCP | Ping/port probe | ICMP/TCP | Allowlist | `planned` | Pendiente lab |
| Conectividad y auth | Método de conexión | SSH/SNMPv3 | Confirmación explícita | `planned` | Pendiente lab |
| Inventario/operación web-only | Browser Web Adapter | Playwright en worker aislado | Vault, URL allowlist, capability/playbook | `planned` | Sprint 4 lab; cambios Sprint 7 |
| Playbooks/aprobaciones | Operación | interno | RBAC | `reuse` | Pendiente |
| Descubrimiento de red (legacy) | Steward | nmap/ARP/mDNS/... | — | `exclude` | Excluido del control plane |

## Reglas

- Capacidad = función **comprobada**; no se declara por el nombre del modelo o del dispositivo.
- Toda observación guarda fuente, fecha, confianza, clasificación y referencia a evidencia redactada.
- El laboratorio (ADR-0007) genera los fixtures versionados sin secretos que sustentan cada fila `planned`.
