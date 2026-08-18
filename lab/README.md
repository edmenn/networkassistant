# Laboratorio sintetico — Sprint 0

Red ficticia dedicada `172.28.200.0/24` (privada y aislada, ADR-0007; se eligio rango privado porque la politica de descubrimiento del baseline solo escanea 10/8, 172.16-31/12 y 192.168/16). Sin credenciales reales: todo lo que aparece aqui es sintetico y de laboratorio.

## Topologia

| Servicio | Contenedor | IP | Rol |
|---|---|---|---|
| Steward (baseline `ea6a476` + capa de herramientas) | `steward-sprint0-web` | dinamica | Control plane / web minima (`http://127.0.0.1:3010`) |
| SSH sintetico (firewall simulado) | `fw-lab-01` | `172.28.200.10` | Dispositivo de laboratorio, usuario read-only `fwlab` |

Credenciales sinteticas (solo laboratorio, nunca reales):

- Owner de la web: `admin` / `LabOwner-Pw-2026-Admin`
- SSH read-only del firewall: `fwlab` / `FwLab-Ro-2026!lab`

## Reproducir

```bash
# 1. Imagen baseline del commit fijado (Linux AMD64)
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build -t steward-sprint0-web:baseline steward/

# 2. Levantar el stack de laboratorio (web + firewall sintetico)
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose -f lab/compose.lab.yml up --build -d

# 3. Recorrido de navegador (bootstrap -> dispositivo -> credencial SSH -> prueba read-only)
docker compose -f lab/compose.lab.yml exec steward node /app/lab/probe.mjs

# 4. Evidencia
ls lab/evidence/
```

## Teardown

```bash
docker compose -f lab/compose.lab.yml down -v --rmi local
```

## Alcance y exclusions documentadas

- `cap_add NET_ADMIN/NET_RAW` en el contenedor Steward: herencia del baseline; en el producto final se excluye y se mueve a workers aislados (REUSE_MATRIX).
- `sshpass`/`openssh-client`: capa de laboratorio porque el broker SSH del baseline los requiere y la imagen original no los instala (el collector SSH de produccion se reimplementa en Sprint 4).
- El baseline no permite crear sitios desde la UI (siembra uno por defecto, `site.local.default`); la creacion de sitios queda para Sprint 2.