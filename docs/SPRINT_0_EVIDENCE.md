# Evidencia parcial - Sprint 0

Estado actual: `in_progress`. La evidencia histórica de abajo prueba el baseline de Steward, pero no cierra Sprint 0 porque todavía falta el recorrido web -> sitio -> firewall SSH read-only.

Fecha: 2026-08-11. Baseline: `braedonsaunders/steward@ea6a4762737dc9ce57f21ff1d3e536bdfe102125`.

## Procedencia

- Clon completo del upstream y licencia MIT verificada.
- Mirror privado: `https://github.com/edmenn/asistente-networking-steward`.
- Branch `main` y tag anotado `upstream-ea6a476-sprint0` publicados.
- Ultimo commit sustantivo anterior: `e0b51e70047c5a596930a9735265dafb59e0c036`.

## Calidad reproducible

| Comando | Resultado |
|---|---|
| `npm ci --ignore-scripts` + `npm rebuild better-sqlite3` | aprobado |
| `npm test` | 34 archivos, 91 pruebas aprobadas |
| `npm run lint` | aprobado |
| `npm run build` | aprobado con Next.js 16.1.6 y 81 paginas estaticas |
| `docker compose config --quiet` | aprobado |

## Seguridad

`npm audit --package-lock-only --json` reporto 16 vulnerabilidades: 2 critical, 11 high, 1 moderate y 2 low. Entre las dependencias directas o rutas relevantes estan `vitest`, `next-auth`, `next` y `ws`.

Decision: el baseline sirve como referencia de arquitectura y UX, no como imagen de produccion. Sprint 1 debe actualizar dependencias y repetir SCA, tests y pruebas de auth antes de reutilizar codigo condicionado. No se usaron secretos reales.

Brechas confirmadas: control plane con `NET_ADMIN`/`NET_RAW`, ejecucion `runShell`, vault local con `vault.key`/fallback derivado de maquina y SQLite. Sus destinos estan definidos en `docs/REUSE_MATRIX.md`.

## Graphify

- `graphify update . --force`: 423 archivos analizados.
- `graphify-out/graph.json`: 4.531 nodos, 12.857 relaciones, 227 comunidades.
- `graphify diagnose multigraph`: 0 endpoints ausentes, 0 aristas colgantes, 0 duplicados y 0 colisiones por endpoint.

## Runtime Linux AMD64

- Imagen construida con `DOCKER_DEFAULT_PLATFORM=linux/amd64` en Docker Desktop.
- Contenedor: `uname -s` = `Linux`; `uname -m` = `x86_64`.
- Healthcheck de `steward`: `healthy`.
- `GET http://127.0.0.1:3010/api/health`: HTTP 200, `ok: true`, 0 dispositivos y 0 incidentes.
- `GET http://127.0.0.1:3010/`: HTTP 200.
- `guacd` y `steward` quedaron ejecutandose en el proyecto Compose `steward-sprint0` con datos sinteticos.

## Evidencia funcional pendiente

| Paso | Resultado requerido | Estado |
|---|---|---|
| Abrir entorno web desde navegador | UI visible y operable | `pending` |
| Crear sitio vacío | Registro persistido sin datos parciales | `pending` |
| Agregar firewall de laboratorio | Identidad separada del endpoint | `pending` |
| Probar SSH read-only | Identidad/estado/evidencia o `unknown` | `pending` |
| Ver ficha del firewall | Método, resultado, timestamp y evidencia redactada | `pending` |
