# AGENTS.md — Contrato para la IA implementadora

Este repositorio implementa la plataforma de infraestructura verificable descrita en `idea.md` y fijada por `BLUEPRINT.md` y `SPRINTS.md`.

## Reglas de precedencia

1. Seguridad, autorización y no exposición de secretos.
2. `BLUEPRINT.md`.
3. Decisiones en `docs/ADR/`.
4. `SPRINTS.md`.
5. Detalles de implementación.

Si dos requisitos se contradicen, **detener la tarea** y resolver con un ADR antes de escribir código.

## Lectura obligatoria antes de cada sprint

- `idea.md`, `BLUEPRINT.md`, `SPRINTS.md`, `AGENTS.md` y ADR relacionados.
- Si existe `graphify-out/graph.json`, consultarlo; actualizarlo si cambió la estructura.
- Descomponer solo el sprint activo en `docs/superpowers/plans/` con TDD y cambio mínimo.

## Stack de referencia (ADR-0001 / ADR-0006)

- Control plane: Next.js 16 + React 19 + TypeScript (heredado de Steward, auditado).
- Base de datos: **Postgres** (sustituye a SQLite de Steward).
- Cola de trabajos: **Redis**.
- Vault: **OpenBao** a través de la interfaz `SecretBackend` (sustituye al vault AES-GCM con clave del host).
- IA: LiteLLM como gateway interno (opcional, Sprint 6+).
- Despliegue: Linux AMD64 en contenedores; desarrollo en macOS con Docker Desktop.

## Comandos de verificación

- Lint / typecheck / test / build: ver README de cada sprint y `package.json`. No asumir; confirmar antes de usarlos.
- No commitear sin revisar `git status`, `git diff` y que no haya secretos.

## Flujo de trabajo en Git

- **Trabajar siempre en `main`** con commits frecuentes y revisando `git status`/`git diff` antes de cada commit.
- **No crear ramas nuevas sin consultar.** Si una tarea justifica una rama, pedir confirmación explícita y documentar el motivo antes de crearla.

## Principios no negociables (resumen)

- Una IP/hostname es un endpoint, no la identidad de un equipo.
- Sin evidencia suficiente, el estado es `unknown`.
- Un equipo nuevo inicia en `observe_only`.
- La IA interpreta evidencia y propone planes; no recibe secretos ni ejecuta comandos libres.
- El control plane no usa `NET_ADMIN`, `NET_RAW` ni acceso directo irrestricto a redes.
- Los workers/sensores reciben privilegios, secretos, destinos y TTL mínimos por trabajo.
- No usar credenciales ni infraestructura reales hasta superar los gates de vault, aislamiento, auditoría, backup y restore.
- Guacamole y Nautobot son integraciones opcionales; Netclaw y SubNetree no forman parte del runtime.

## Definición de Done

- El cambio mínimo cumple el criterio.
- Pruebas automatizadas relevantes pasan.
- El flujo afectado se verificó de extremo a extremo.
- No aparecen secretos en UI, API, logs, trazas, auditoría ni prompts.
- Documentación y `docs/IMPLEMENTATION_STATUS.md` actualizados.
- La evidencia de cierre es reproducible por otra IA.

## Reglas de cierre (obligatorias)

Estas reglas evitan declarar `done` algo que no cumple el gate. Incumplirlas invalida el cierre del sprint.

- **`entregado` ≠ `gate cumplido`.** El sprint solo pasa a `done` cuando los entregables existen Y la evidencia del gate está verificada. Si falta la verificación, el estado correcto es `in_progress`, no `done`.
- **Nada de "documentar que falta algo" como sustituto del gate.** Ninguna tarea se marca `done` sin evidencia verificada por comando en el estado actual (pegar la salida real). Una fila `pending` deja el sprint abierto.
- **Checklist de gate obligatoria.** Antes de marcar un sprint `done`, completar `docs/SPRINT_GATE_CHECKLIST.md` (secciones A evidencia, B revisión adversarial y C confirmación) y registrarla.
- **Revisión adversarial obligatoria** (blueprint §17). Antes de cerrar, registrar quién revisó y la fecha. Si no hay una segunda IA disponible, marcarlo explícitamente como limitación y hacer segunda pasada en contexto limpio. Nunca afirmar revisión independiente que no ocurrió.
- **Prohibido cerrar con pendientes bloqueantes.** Un sprint no se cierra si quedan hallazgos críticos/altos abiertos o ADR con decisiones abiertas necesarias para el siguiente sprint. Los bloqueantes se documentan como condiciones del siguiente sprint, no como deuda oculta.
- **Commit de cierre separado** con prefijo `gate(sprint-N)`, identificable para auditoría.
- El build verde no basta: el gate exige probar el flujo real y evidencia reproducible.
