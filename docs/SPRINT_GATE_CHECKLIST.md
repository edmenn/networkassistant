# Checklist de gate de sprint

Plantilla obligatoria. Un sprint solo se marca `done` cuando esta checklist esta completada y verificada. Se guarda por sprint (p. ej. `docs/gate/sprint-1.md`).

> Estado de cada fila: `verified` (con salida real de comando en el estado actual) o `pending`. **Una sola fila `pending` deja el sprint abierto (`in_progress`), nunca `done`.**

## Sprint: `<N>` · Fecha: `<YYYY-MM-DD>`

## A. Evidencia por comando

Completar contra la seccion "Pruebas y evidencia" del sprint y su gate. Pegar la salida real, no un resumen.

| # | Item del gate | Comando exacto | Resultado esperado | Resultado verificado (salida) | Estado |
|---|---|---|---|---|---|
| 1 |  |  |  |  | `pending` |
| 2 |  |  |  |  | `pending` |

- [ ] Todas las filas estan `verified` con salida real del estado actual.
- [ ] `docs/IMPLEMENTATION_STATUS.md` actualizado.
- [ ] Sin secretos en UI, API, logs, trazas, auditoria ni prompts (`git status`/`git diff` revisados).
- [ ] Sin decisiones abiertas necesarias para el siguiente sprint (ADR revisados).

## B. Revision adversarial (blueprint 17)

Registrar qui�n reviso y fecha. Si no hay una segunda IA disponible, marcarlo como **limitacion** y hacer segunda pasada en contexto limpio. Nunca afirmar revision independiente que no ocurrio.

- **Revisado por:** `<IA/herramienta + version o persona>`
- **Fecha:** ``
- **Independiente (SI/NO):**

Checklist:

- [ ] Requisitos del blueprint sin tarea o prueba asignada.
- [ ] Dependencias circulares o paralelismo falso.
- [ ] Secretos, permisos o destinos con alcance excesivo.
- [ ] Rollback declarado pero no verificable.
- [ ] Uso de IA donde corresponde logica determinista.
- [ ] Abstracciones especulativas o componentes sin consumidor.
- [ ] Criterios de cierre que solo prueban build y no comportamiento real.
- [ ] Hallazgos criticos corregidos antes del cierre.

## C. Definicion de Done (confirmacion)

Solo marco este sprint `done` cuando:

- [ ] El cambio minimo cumple el criterio del sprint.
- [ ] Las pruebas automatizadas relevantes pasan (evidencia A).
- [ ] El flujo afectado se verifico de extremo a extremo (evidencia A).
- [ ] No aparecen secretos.
- [ ] Documentacion y estado actualizados.
- [ ] La evidencia de cierre es reproducible por otra IA.
- [ ] La revision adversarial (B) quedo registrada, independiente o marcada como limitacion.

## Resultado

- Estado del sprint: `in_progress` | `done`
- **No cerrar** con filas `pending` o con revision adversarial sin registro.
- Commit de cierre separado con prefijo `gate(sprint-N)`.
