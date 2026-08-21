# Runbook de la demo — Desarrollo agéntico con gentle-ai (geosamples-demo)

> Runbook operativo para seguir EN VIVO (estrategia confirmada (a): sesión agéntica EN VIVO completa). Todos los comandos, salidas esperadas y cifras fueron verificados contra el sistema real el 2026-08-20 (Postgres 18 local en `.pgdata/`, API en :3001, SPA en :5173, 99 muestras seedadas). No hay cifras inventadas: cada salida esperada es la salida real capturada. Los estados pre-capturados por fase NO se inventan: se capturan durante el ENSAYO previo obligatorio (ver sección «Ensayo previo»).
>
> Convenciones: los bloques de código son comandos exactos; las líneas precedidas por `→` son salidas esperadas reales. Terminales sugeridas: **T1** API/Postgres, **T2** agente (OpenCode), **T3** curl/psql de verificación. El navegador queda en la SPA (:5173) y el editor en `openspec/`.

---

## Estado de partida verificado

| Componente | Estado | Cómo verificarlo |
|------------|--------|------------------|
| Postgres 18 | Corriendo en :5432 (PID 645290, cluster `.pgdata/`, socket en /tmp) | `pg_ctl -D .pgdata status` → "server is running" |
| API | Corriendo en :3001 | `curl http://localhost:3001/health` → `{"status":"ok"}` |
| SPA | Corriendo en :5173 (Vite, proxy `/api` → :3001) | `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` → `200` |
| Datos | 99 muestras seedadas (42 rocas, 12 colectores, 4 análisis) | `curl "http://localhost:3001/api/samples?pageSize=1"` → `"total": 99` |
| Auth | `ADMIN_USERS` configurado en `.env`; credencial de demo `admin` / `admin` | POST autenticado devuelve 400/201 (no 401) |
| Git | Repo en `master` SIN commits (todo untracked). Los "3 PRs encadenados" del viaje viven en los artefactos SDD (`tasks.md`), no en el historial git — no usar `git log` como demo | `git status --short` |

**Nota sobre el git**: el repositorio es un `git init` fresco sin commits. La narrativa de chained PRs se muestra con `openspec/changes/archive/2026-08-20-initial-system/tasks.md` (forecast de ~1800 líneas, budget 400, PR1 ingest → PR2 api → PR3 spa, stacked-to-main), no con el historial.

---

## Checklist PRE-DEMO

### T-60 min

- [ ] `node -v` ≥ 20 y `pnpm -v` ≥ 9
- [ ] Postgres arriba: `pg_ctl -D .pgdata status` (si no: `pg_ctl -D .pgdata start`; socket en /tmp)
- [ ] API arriba: `curl http://localhost:3001/health` → `{"status":"ok"}`
- [ ] SPA arriba: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` → `200` (si no: `pnpm dev` en T1)
- [ ] Seed verificado (idempotente, seguro de re-correr): `pnpm seed` → salida esperada:
  ```
  Seeded 99 samples (source: 99 records, 0 dropped)
  Canonical rocks in catalog: 42 (< 57)
  Lookup catalog: 42 rocks, 12 collectors, 4 analyses
  ```
- [ ] Contador en 99: `curl "http://localhost:3001/api/samples?pageSize=1" | jq .total` → `99`
- [ ] `.env` presente con `ADMIN_USERS` (no abrir `.env` en pantalla; el hash bcrypt no se muestra)
- [ ] Catálogo sano: `curl http://localhost:3001/api/meta` → 42 `rockTypes`, 12 `collectors`, 4 `analysisTypes` (verificar con `jq '{rocks:(.rockTypes|length), collectors:(.collectors|length), analysis:(.analysisTypes|length)}'`)

### T-30 min

- [ ] Modelos configurados en OpenCode: el routing por fase vive en la CONFIG GLOBAL (`~/.config/opencode/opencode.json`) — mapeo vigente: explore→`opencode-go/qwen3.7-plus`, propose→`opencode-go/glm-5.1`, spec→`opencode-go/qwen3.8-max`, design→`opencode-go/glm-5.2`, tasks→`opencode-go/qwen3.8-max` (swap 2026-08-21: deepseek-v4-pro falló transporte instantáneo), apply→`opencode-go/kimi-k2.7-code`, verify→`opencode-go/mimo-v2.5-pro`, archive→`opencode-go/mimo-v2.5`, orquestador→`opencode-go/glm-5.2`; smoke test de 1 prompt antes de la charla (`opencode run --model opencode-go/glm-5.2 "di OK"`). Verificar el proveedor Go: `opencode models | grep opencode-go/` y `~/.local/share/opencode/auth.json` debe contener `opencode-go`. OJO: `opencode-go/deepseek-v4-flash` exige opt-in explícito (hosteado en China) — NO usarlo sin activarlo antes. El `opencode.json` del repo está VACÍO (solo `$schema`): si se le agrega routing local, pisa a la global solo cuando opencode abre desde el repo
- [ ] Terminales listas: T1 (API/PG), T2 (agente), T3 (curl/psql), con zoom de fuente alto y fondo claro
- [ ] Pestañas del navegador: SPA (:5173), README.md, `openspec/specs/sample-query/spec.md`, `openspec/changes/archive/2026-08-20-initial-system/` (tasks.md + verify-report.md)
- [ ] Dry-run de la consigna inicial del ciclo (solo B0, para medir latencia del modelo)

### T-15 min

- [ ] Estados pre-capturados de cada fase (spec, tasks, apply corriendo, verify verde) tomados del ENSAYO previo — la única fuente real; no se inventan
- [ ] Confirmar presupuesto de rate limit: la API limita a 300 requests / 15 min por IP — evitar loops de curl; usar la UI para la mayoría de las consultas
- [ ] Confirmar que el registro demo de ensayo anterior fue limpiado: `PGPASSWORD=geosamples psql -h localhost -U geosamples -d geosamples -tAc "SELECT count(*) FROM samples;"` → `99`

#### Reset a slate limpio (la noche anterior o T-60, NUNCA en vivo)

> **✅ YA EJECUTADO (noche del 2026-08-20, validado: 90/90 tests, DB=99, spec limpio).** No repetir mañana salvo que algo toque el repo. Snapshot completo del ciclo ensayo 2 preservado en `talk/ensayo/ciclo-ensayo2-bbox-filter/`.

El ensayo 2 dejó el feature implementado y archivado. Para que la demo arranque sin bbox-filter:

```bash
cd ~/Projects/geosamples-demo
git reset --hard 7d92255                                    # HEAD pre-bbox (deshace a21ba13 + e24634f y revierte el sync del spec)
rm -rf openspec/changes/archive/2026-08-20-bbox-filter      # artefactos untracked del ensayo
pnpm test                                                   # expectativa: 90/90
```

- NO tocar `talk/` (artefactos de la charla, incluido el backup `talk/ensayo/geosamples-pre-ensayo.tar.gz` — cinturón y suspendedores por si algo se rompe; el tarball NO incluye `.git`)
- Si algo se rompe más allá del reset: restaurar working tree desde el tarball (`tar -xzf talk/ensayo/geosamples-pre-ensayo.tar.gz -C .`) y volver a correr `pnpm test`

### T-0 (5 puntos antes de salir a escena)

1. `curl http://localhost:3001/health` → ok
2. SPA cargada en :5173 mostrando 99 samples
3. Terminal T2 con la sesión de OpenCode lista (cwd = raíz del repo)
4. `.env` fuera de cualquier vista
5. Estados pre-capturados del ensayo a mano (archivo o segunda pantalla)

---

## Ensayo previo (obligatorio)

La estrategia (a) exige correr el ciclo completo UNA vez antes de la charla (día previo o mañana de la misma). Objetivos:

1. **Medir latencia real del modelo por fase**: cronometrar explore, propose, spec, design, tasks, apply y verify con el routing por fase de la config global (mapeo vigente en T-30) y la red que se usarán en la charla. Ese registro es la base del time-box de la Parte B.
2. **Capturar los estados pre-capturados reales**: durante el ensayo, guardar el estado de cada fase en el momento del corte (spec redactado, tasks, apply corriendo con tests en verde, verify-report verde). Estos estados son la ÚNICA fuente de los pre-capturados: no se inventan ni se fabrican el día de la charla.
3. **Validar el timing total**: sumar las fases y comparar con el presupuesto del segmento 4 (16–22 min). Ajustar el time-box por fase con los tiempos medidos, no con los nominales.

Pasos concretos del ensayo:

- [ ] Correr B0 → B8 completos con el mismo routing por fase de la config global (mapeo vigente en T-30) y la misma red que en la charla.
- [ ] Cronometrar cada fase y anotarlo (fase → tiempo real → tiempo previsto).
- [ ] Guardar en archivo aparte (fuera de `openspec/`) o segunda pantalla: spec pre-capturado, tasks pre-capturado, apply corriendo, verify-report verde.
- [ ] Verificar que el dataset vuelve a 99 después del ensayo: `PGPASSWORD=geosamples psql -h localhost -U geosamples -d geosamples -tAc "SELECT count(*) FROM samples;"` → `99` (el ciclo no crea filas nuevas; el registro admin de prueba sí).
- [ ] Ajustar el time-box de la Parte B con las latencias medidas.

Artefactos reales que SÍ se pueden mostrar hoy (sin inventar nada): `exploration.md` con los rangos de coordenadas (Norte 1.001.361–1.744.707, Este 728.484–1.001.857, EPSG:3115), `proposal.md` con la nota `bbox search (deferred; EPSG:3115 unconfirmed)`, y `verify-report.md` con la matriz 45/45 de escenarios del viaje real.

---

## Parte A — Flash de contexto (60 s)

> Objetivo: probar ante el público, en 60 segundos, que el sistema existe y que el proceso ya funcionó. Sin tour: el resto de la evidencia se muestra en el segmento 5 del outline y en Q&A. Los pasos A2–A10 se conservan al final de esta sección y se usan SOLO si sobra tiempo o para Q&A.

**A1. Flash de contexto** (60 s, cronometrados)
- Acción: navegador en `http://localhost:5173`.
- Salida esperada: header "Geosamples — INVEMAR sample catalog", tabla con "99 samples — page 1 of 4".
- Filtro rápido: select "Rock type" → `Cuarzodiorita` → Search → 34 samples.
- Opcional (si quedan segundos): `curl http://localhost:3001/api/meta` → 42 rockTypes, 12 collectors, 4 analysisTypes.
- Decir: "99 muestras reales de INVEMAR Santa Marta, construidas y verificadas con este proceso. Ahora vemos cómo se hace: el ciclo SDD completo, en vivo, con agentes. La consigna es esta..." (transición directa a la Parte B, sin pausa).

**Pasos A2–A10 (conservados — se usan solo si sobra tiempo o para Q&A)**: los pasos del tour original, con sus datos reales verificados, quedan disponibles como material de respaldo; sus resultados están consolidados en la sección «Datos reales para mostrar».

**A2. Filtro por código, case-insensitive** (30 s)
- Acción: en FilterBar, campo "Code" → `ACM0397A` → Search. Después `acm0397a` → Search.
- Salida esperada: 1 fila (ACM0397A, Granito, Playa Salguero, 2019-11-03).
- Decir: "El código matchea sin distinguir mayúsculas: hay un índice único sobre `lower(codigo_muestra)` — esa decisión salió del spec (R6)."

**A3. Filtro por roca desde el catálogo** (30 s)
- Acción: select "Rock type" → `Cuarzodiorita` → Search.
- Salida esperada: 34 samples.
- Decir: "El select se alimenta del catálogo canónico de `/api/meta`. En el TSV original había 57 variantes de este campo (mayúsculas, `?`, sinónimos); acá hay 42 entradas limpias."

**A4. Unidad geológica** (20 s)
- Acción: "Geological unit" → `Batolito de Santa Marta` → Search.
- Salida esperada: 44 samples (la unidad más frecuente del dataset).

**A5. Análisis y plancha** (30 s)
- Acción: "Analysis" → `Seccion Delgada` → Search; luego "Topographic sheet" → `11IVD` → Search.
- Salida esperada: 69 y 49 respectivamente.
- Decir: "Cada filtro es una cláusula WHERE generada por el API; la distribución de análisis es 69/18/10/2 y suma exactamente 99 — los datos cuadran."

**A6. Rango de fechas** (20 s)
- Acción: "Date from" `2021-01-01`, "Date to" `2021-12-31` → Search.
- Salida esperada: 23 samples.
- Decir: "Las fechas originales venían como `3/11/2019` sin padding; el ingest las normalizó a ISO. Los filtros de rango solo existen porque esa normalización ocurrió."

**A7. Búsqueda de texto libre** (20 s)
- Acción: "Free-text search" → `insenberg` → Search.
- Salida esperada: 3 samples (descripción contiene la palabra).
- Decir: "Busca en descripción y localidad — el mismo texto sucio del TSV, ya legible."

**A8. Export CSV** (30 s)
- Acción: botón "Export CSV" (con un filtro activo, ej. rock = Granito).
- Salida esperada: descarga `samples.csv` con header `IGM,CodigoMuestra,NombreEstacion,...` y las filas filtradas. Equivalente por curl:
  ```bash
  curl -s "http://localhost:3001/api/samples/export?rock=Granito"
  ```
  → CSV con 2 líneas (header + ACM0397A; sin BOM, campos con comas entre comillas).
- Decir: "El export respeta los filtros activos y no tiene BOM — hay un test que verifica que el primer byte no es BOM."

**A9. Registro admin** (1 min)
- Acción: en "Register a new sample", completar: Code `TALK001`, Station name `TALK-EST`, Rock type `Granito`, Analysis type `Seccion Delgada`, Date `2026-08-20`, Locality `Sala de la charla`, North `1728489`, East `982508`, Altitude `5`. Click "Register sample".
- Salida esperada (1): prompt ámbar "Admin credentials are required to register samples." (la API devolvió 401).
- Salida esperada (2): ingresar `admin` / `admin` → "Save and retry" → mensaje verde "Sample TALK001 registered successfully." y la fila aparece en la tabla.
- Decir: "Sin credenciales, 401; con credenciales, 201. El auth es fail-closed: si `ADMIN_USERS` está vacío, todo falla cerrado, y los 401 son idénticos para no filtrar qué credencial falló."
- **Advertencia**: esto deja una fila extra (total 100). Se limpia en el cleanup (Parte C); re-correr el seed NO la borra.

**A10. Verificación por curl (opcional, si sobra tiempo)** (30 s)
```bash
curl http://localhost:3001/health                 # → {"status":"ok"}
curl -s http://localhost:3001/api/meta | jq '{rocks:(.rockTypes|length),collectors:(.collectors|length),analysis:(.analysisTypes|length)}'
# → {"rocks":42,"collectors":12,"analysis":4}
curl -s "http://localhost:3001/api/samples?pageSize=1" | jq .total   # → 99
```
- Decir: "Tres llamadas y todo el sistema está vivo: health, catálogo y conteo."

**Transición (respaldo, si se usa el plan B)**: "Todo esto ya existía. Ahora viene la parte interesante: agregar una capacidad nueva con el ciclo SDD, con agentes trabajando en vivo."

---

## Parte B — Ciclo SDD EN VIVO completo (segmento central, 16–22 min)

> Guion para la estrategia confirmada (a): sesión agéntica EN VIVO completa. Cada fase tiene un **time-box** y un **corte**: si se pasa, se corta, se muestra el estado pre-capturado del ENSAYO y se dice en voz alta "el agente sigue trabajando; muestro el resultado esperado". **El corte por tiempo es parte de la narrativa**: así termina una sesión real — en verify o en el corte, no en "ya quedó".

**El cambio propuesto**: filtro geográfico por bounding box en API + SPA (`norteMin`, `norteMax`, `esteMin`, `esteMax`). Estaba listado como fuera de alcance en `proposal.md` ("bbox search (deferred; EPSG:3115 unconfirmed)") — es la continuación natural del roadmap que el proceso ya trazó.

**Routing por fase (modelos) — parte del guion**: cada fase corre con el modelo asignado en la config global (mapeo vigente en T-30). Decirlo en voz alta cuando se cambia de fase ("acá cambia el modelo, porque cambia el tipo de decisión"): la asignación de modelos por fase es parte de la narrativa, no un detalle técnico.

**B0. Consigna al agente (1 min)**
- Acción: en la sesión de OpenCode (T2), plantear (texto exacto):
  > "Agregá un filtro geográfico por bounding box al catálogo de samples: parámetros `norteMin`, `norteMax`, `esteMin`, `esteMax` en GET /api/samples, siguiendo el patrón de los filtros existentes de `buildWhere`, y campos correspondientes en el FilterBar del SPA. El spec, los tests y la UI se actualizan juntos. Corré el ciclo SDD."
- Decir mientras corre: "Estoy dando la dirección, no el código. El agente tiene que explorar, proponer, especificar, diseñar y recién después escribir. La consigna nombra el patrón existente y la regla de tests+UI juntos: eso es dirigir."

**B1. EXPLORE (1–2 min)**
- Qué mostrar: el agente (o el orador) abre `exploration.md` sección de coordenadas: Norte 1.001.361–1.744.707, Este 728.484–1.001.857, CRS MAGNA Colombia Bogotá (EPSG:3115).
- Corte: si el agente tarda, abrir `exploration.md` manualmente y leer los rangos.
- Decir: "El explore ya existe y está archivado: no hay que re-descubrir el dataset. El agente lo usa como fuente."

**B2. PROPOSE (1–2 min)**
- Qué mostrar: propuesta con alcance (API + SPA + tests), fuera de alcance (nada de migración de datos: las coordenadas ya están normalizadas), y nota de que estaba diferido en `proposal.md`.
- Corte: si el agente tarda, mostrar `proposal.md` con la nota `bbox search (deferred; EPSG:3115 unconfirmed)` y pasar a spec.
- Decir: "La propuesta define qué se toca y qué no. El humano aprueba o corrige acá — es la primera decisión de la sesión."

**B3. SPEC (2–3 min)**
- Qué mostrar: 1–2 requerimientos nuevos con escenarios Given/When/Then en `openspec/specs/sample-query/spec.md` (o delta spec). Ejemplo de escenario a esperar: "Given un rango de norte 1.700.000–1.750.000 y este 900.000–1.000.000, When se consulta /api/samples con esos parámetros, Then la respuesta incluye ACM0397A (norte 1.728.489, este 982.508)".
- Gotcha del ENSAYO: en modo hybrid el agente debe escribir el delta TAMBIÉN en `openspec/changes/bbox-filter/specs/sample-query/spec.md` (lo que el dispatcher lee); si solo toca la spec base, el dispatcher sigue diciendo `specs: missing` hasta que el delta existe en la carpeta del cambio.
- Corte: si el agente tarda, mostrar el spec pre-capturado del ENSAYO — no se inventa ni se escribe en el momento.
- Decir: "El spec es el contrato. Antes de escribir una línea de código ya sabemos qué se va a verificar — ese es el corazón de SDD."

**B4. DESIGN (1–2 min)**
- Qué mostrar: la decisión de diseño antes del código — el filtro reutiliza el patrón `buildWhere` de `server/src/routes/samples.ts` (una condición más por campo de bbox, validada en `parseFilters`); los tests de API usan el mock pool de `api.test.ts`, que depende del orden fijo de condiciones de `buildWhere`; en la SPA los campos van en `FilterBar` (4 inputs numéricos) y la serialización en `toQuery`.
- Corte: si el agente no llega a mostrar el diseño, el orador lo explica en 30 s sobre el código existente.
- Decir: "El diseño es donde se decide el costo: reutilizar el patrón existente hace el cambio chico y predecible. Acá también se ve el gotcha: el mock pool depende del orden de las condiciones, así que código y tests se tocan juntos."

**B5. TASKS (1–2 min)**
- Qué mostrar: 2–3 tareas (API: `buildWhere` + `parseFilters` + types; tests API con el mock pool; SPA: FilterBar + `toQuery` + tests). Señalar el gotcha: `buildWhere` tiene un orden fijo de condiciones y `api.test.ts` (mock pool) depende de ese orden — el agente debe actualizar ambos juntos.
- Corte: si el agente tarda, mostrar las tareas pre-capturadas del ensayo.
- Decir: "Tareas chicas, cada una con su test enfocado. Acá también se decide el presupuesto de revisión."

**B6. APPLY (4–7 min)**
- Qué mostrar: el agente implementando; correr los tests enfocados a medida que avanza:
  ```bash
  pnpm vitest run server/tests/api.test.ts
  pnpm vitest run src/components/FilterBar.test.tsx
  ```
- Verificación manual con curl (después del apply):
  ```bash
  curl -s "http://localhost:3001/api/samples?norteMin=1700000&norteMax=1750000&esteMin=900000&esteMax=1000000" | jq '{total, first: (.data[0] | {codigoMuestra, norte, este})}'
  ```
  → **total 77** (medido en el ensayo), ACM0397A incluida y primera por orden alfabético (norte 1.728.489, este 982.508). El criterio de aceptación es "ACM0397A incluida", NO "solo ACM0397A": el box real contiene 77 muestras — no prometer un resultado distinto. Si se muestra el 400: `esteMin=abc` → body real `Error: esteMin must be numeric` (el handler central antepone `"Error: "`).
- Corte: si el apply se pasa de 7 min, saltar a VERIFY con el apply pre-capturado del ensayo (tests en verde).
- Decir: "Mientras escribe, el agente también corrige los tests que dependen del orden de condiciones: no puede tocar el código sin tocar la red de seguridad."

**B7. VERIFY (1–2 min)**
- Acción:
  ```bash
  pnpm test    # suite completa: 90 tests + los nuevos, exit 0
  pnpm build   # tsc --noEmit && vite build, exit 0
  ```
- Salida esperada: `Test Files 8 passed`, `Tests 97 passed` (90 existentes + 7 nuevos bbox — medido en el ensayo); build con 0 errores.
- Corte: si el verify no termina a tiempo, mostrar el verify-report pre-capturado del ensayo (verde). Referencia al viaje real: `verify-report.md` con la matriz 45/45 de escenarios.
- Decir: "Verify juzga contra el spec, no contra la intuición: si un escenario no tiene test, el verify lo reporta. En el viaje real esto falló una vez y se corrigió con remediaciones — nunca es cosmético."

**B8. Cierre de la sesión (30 s)**
- Decir: "El ciclo quedó en verify verde (o cortado en la fase donde está). Archive es para la siguiente sesión — así termina una sesión real de trabajo, no en 'ya está', sino en evidencia."

**Si el agente se tarda o se desvía** (los cortes usan SIEMPRE los estados pre-capturados del ensayo):

**Referencias de tiempo REALES del ensayo (2026-08-20, modelos gratuitos)**: PROPOSE 3m26s · SPEC 2m52s (+fix delta ~1m) · DESIGN 3m8s · TASKS 2m17s · APPLY 6m22s · VERIFY 2m26s · **total ≈ 21m30s**.

**Referencias de tiempo ensayo 2 COMPLETO (2026-08-21, routing Go de la config global)**: explore 3m17s ✅ · propose 2m39s ✅ · spec 2m51s ✅ · design ~3m23s ✅ (glm-5.2; 2 intentos previos devolvieron output vacío por transporte) · tasks ~4m55s ✅ (qwen3.8-max tras swap desde deepseek-v4-pro, que falló instantáneo) · apply ~18m57s ⚠️ (kimi-k2.7-code, trabajo continuo verificado en logs — 3× más lento que el ensayo 1) · verify ~3m16s ✅ PASS (mimo-v2.5-pro) · archive ✅ reporte 23:07. Streaming total ≈ 40m; wall clock con latches y decisiones humanas ≈ 1h43m. **98/98 tests** (+8 del feature bbox-filter). **Lección para el time-box: apply es la fase larga y el corte natural de la Parte B** — presupuestar apply con margen o cortar ahí mostrando el pre-capturado.

Son referencias con el runtime de la charla; si el orador quiere la versión de 45 min, los cortes por fase deben ser más agresivos que estos números (el presupuesto de cada fase en la tabla de cortes es el límite HARD).

| Situación | Acción |
|-----------|--------|
| La consigna no arranca (red/modelo) | Cambiar a otro modelo del plan Go; si sigue, Plan B: estrategia (c) — flash + mini-ciclo narrado con los pre-capturados del ensayo |
| El agente toca archivos fuera de alcance | Intervenir: "Fuera de alcance: solo API de samples y FilterBar. Releé el spec." Si persiste, cortar y mostrar el pre-capturado |
| EXPLORE se pasa de 2 min | Corte: abrir `exploration.md` manualmente y leer los rangos (Norte 1.001.361–1.744.707, Este 728.484–1.001.857) |
| PROPOSE se pasa de 2 min | Corte: mostrar `proposal.md` con la nota deferred y pasar a spec |
| SPEC se pasa de 3 min | Corte: mostrar el spec pre-capturado del ENSAYO (no se inventa) |
| DESIGN se pasa de 2 min | Corte: el orador explica el diseño en 30 s sobre el código existente |
| TASKS se pasa de 2 min | Corte: mostrar las tareas pre-capturadas del ensayo |
| APPLY se pasa de 7 min | Corte: saltar a VERIFY con el apply pre-capturado (tests en verde) |
| El verify falla en vivo | Es material de charla: mostrar el hallazgo y la remediación (igual que en el viaje real: R3/R10 → FAIL → remediación → PASS) |
| Sub-agente devuelve output vacío (`sdd_task_result_empty`) | NO hay auto-retry (el contrato lo prohíbe). Si se fuerza un reintento y queda latcheado (`sdd_task_dispatch_latched`), la sesión queda TRABADA para SDD: abrir sesión nueva en el repo y `/sdd-continue bbox-filter` — el estado sobrevive en `openspec/changes/` + engram, nada se pierde |
| El ciclo completo excede el presupuesto | Cortar en la fase donde esté, mostrar el pre-capturado y decirlo en voz alta — el corte por tiempo es parte de la narrativa |
| El orquestador pregunta por PR (tras apply/verify) | Responder "no crear PR, dejar todo local" — la demo no incluye entrega remota; aceptar commits locales si el flujo los exige para avanzar |

---

## Parte C — Cierre y cleanup

1. **Registro de demo**: borrar la fila creada en A9 (dejar el dataset en 99):
   ```bash
   PGPASSWORD=geosamples psql -h localhost -U geosamples -d geosamples \
     -c "DELETE FROM samples WHERE codigo_muestra = 'TALK001';"
   PGPASSWORD=geosamples psql -h localhost -U geosamples -d geosamples \
     -tAc "SELECT count(*) FROM samples;"   # → 99
   ```
   (Si el ciclo en vivo agregó datos, borrar también esos códigos. Re-correr `pnpm seed` NO borra filas extra: `ON CONFLICT DO NOTHING` solo omite duplicados.)
2. **Servidores**: decisión del orador. Para dejarlo corriendo (útil para ensayos posteriores), no hacer nada. Para apagar: Ctrl+C en las terminales de Vite y tsx, y `pg_ctl -D .pgdata stop` si se quiere detener Postgres (dejar `.pgdata/` intacto para el próximo arranque).
3. **Repo limpio**: `git status --short` — deben verse solo los archivos del proyecto sin trackear (el repo no tiene commits) y la carpeta `talk/` nueva. No dejar archivos temporales (`/tmp` está fuera del repo). Si se hicieron cambios del ciclo en vivo y el orador quiere conservarlos, commitearlos aparte es decisión suya; nunca commitear `.env` (gitignored).
4. **Secrets**: verificar que `.env` no apareció en ninguna captura ni en el historial de la sesión de OpenCode.

---

## Datos reales para mostrar (verificados el 2026-08-20)

| Consulta | Resultado real |
|----------|----------------|
| `GET /api/samples` (sin filtros) | `total: 99`; paginación 25/25/25/24 (pageSize 25, max 100) |
| `GET /api/samples?code=ACM0397A` | 1 fila: Granito, Playa Salguero, 2019-11-03, plancha 11IVC, norte 1.728.489, este 982.508, altura 3, "Dataciones Radiometricas", colector "Andrea Carolina Matajira Pabon" |
| `GET /api/samples/acm0397a` (case-insensitive) | Misma muestra (200) |
| `GET /api/samples/ZZZ999` | 404 `{"error":"Sample not found"}` |
| `GET /api/samples?rock=Granito` | 1 |
| `GET /api/samples?rock=Cuarzodiorita` | 34 |
| `GET /api/samples?unit=Batolito de Santa Marta` | 44 |
| `GET /api/samples?unit=Esquistos del Gaira` | 11 |
| `GET /api/samples?collector=Andrea Carolina Matajira Pabon` | 26 |
| `GET /api/samples?analysis=Seccion Delgada` | 69 |
| `GET /api/samples?analysis=Dataciones Radiometricas` | 18 |
| `GET /api/samples?analysis=Analisis Macro` | 10 |
| `GET /api/samples?analysis=Bioestratigrafia` | 2 |
| `GET /api/samples?plancha=11IVD` | 49 |
| `GET /api/samples?plancha=18IVB` | 12 |
| `GET /api/samples?dateFrom=2021-01-01&dateTo=2021-12-31` | 23 |
| `GET /api/samples?q=insenberg` | 3 (texto libre sobre descripción/localidad) |
| `GET /api/samples?q=zzzzz` | 0 (estado vacío en la UI: "No samples match the current filters.") |
| `GET /api/samples/export?rock=Granito` | CSV sin BOM: header + 1 fila (IGM vacío para ACM0397A) |
| `GET /api/samples/APN0720P` | Arcillolitas, `existeMuestra: true` (única muestra con la bandera en "Si") |
| `GET /api/meta` | 42 rockTypes, 12 collectors, 4 analysisTypes; constants: "Magna Colombia Bogotá" / "Investigación Maritima, Costera e Insular" |
| `POST /api/samples` sin auth | 401 idéntico al de credenciales inválidas |
| `POST /api/samples` con `admin`/`admin` + payload válido | 201 (ej. TALK001) |
| `POST /api/samples` duplicado | 409 `{"error":"Sample with code TALK001 already exists"}` |
| `POST /api/samples` con roca no canónica | 400 `{"error":"NombreRoca is not a canonical rock type"}` |
| `POST /api/samples` con fecha `2024-13-40` | 400 `{"error":"Fecha must be a valid ISO date (YYYY-MM-DD)"}` |
| `pnpm seed` (re-corrido) | "Seeded 99 samples (source: 99 records, 0 dropped)" / "Canonical rocks in catalog: 42 (< 57)" / "Lookup catalog: 42 rocks, 12 collectors, 4 analyses" |

**Datos de contexto del dataset** (para la narrativa, de `exploration.md`): 20 columnas; `SubUnidad` 99/99 vacía (columna muerta, no modelada); `SistemaCoordenadas` y `Proyecto` constantes (metadata, no filtros); 57 variantes de roca → 42 canónicas; fechas `D/M/YYYY` sin padding; colectores con typos (`Pado` → `Pardo`, `Cortés`/`Cortes`); `ExisteMuestra` 98/99 vacía; IGM 7/99 vacío; EstacionCompanero 19/99; Norte 1.001.361–1.744.707, Este 728.484–1.001.857, Altura 1–1450; fechas 2019–2022.

---

## Fallbacks rápidos por paso crítico

| Paso crítico | Si falla → |
|--------------|------------|
| Postgres caído | `pg_ctl -D .pgdata start` (socket en /tmp); si el cluster está corrupto, `docker compose up -d` (Postgres 16, role/db `geosamples`) y `pnpm seed` |
| API caída | `pnpm dev:server` en T1 y esperar el log de listening en :3001; verificar `curl http://localhost:3001/health` |
| SPA caída | `pnpm dev` en T1 y esperar el banner de Vite (:5173) |
| Seed falla con error de schema | Revisar que `schema.sql` corrió (el fix del índice único `idx_samples_codigo_muestra_ci` ya está aplicado); recrear el cluster solo si es necesario |
| 429 (rate limit) | Usar la UI; esperar la ventana de 15 min antes de más curls |
| Sesión agéntica no arranca | Plan B: estrategia (c) — flash (Parte A) + mini-ciclo narrado con los estados pre-capturados del ENSAYO y las historias del viaje real (outline, segmento 5). Requiere tener el pre-capturado del ensayo a mano |
| Se muestra el `.env` por error | Cerrar la pestaña/terminal; continuar sin abrirlo (las credenciales de demo son `admin`/`admin`) |

---

## Advertencias operativas

- **Rate limit**: 300 requests / 15 min por IP en la API (`express-rate-limit`). Las consultas de la charla se hacen mayormente por la UI.
- **`.env` es secreto**: contiene el hash bcrypt de `ADMIN_USERS`. Nunca mostrarlo ni capturarlo. `.env` está en `.gitignore`.
- **`pnpm seed` no limpia**: re-correrlo NO borra filas agregadas por el registro; el cleanup de filas demo se hace con `psql`.
- **El repo no tiene commits**: no usar `git log` como demo; la evidencia de los PRs está en `tasks.md` y en la carpeta de archive.
- **Los tests del server usan pg-mock**: los tests pasan sin base real (65 server + 25 SPA = 90); la demo con base real es complementaria, no contradictoria — es exactamente la lección de la historia del bug de `schema.sql`.
- **AUTH_READS=false**: las lecturas son públicas; solo el POST de registro exige auth. No hace falta credencial para los filtros ni el export.
- **El ensayo es la única fuente de los estados pre-capturados reales**: no se inventan ni se fabrican el día de la charla. Sin ensayo previo, la estrategia (a) no se puede ejecutar y se pasa directo al plan B (c).
- **El latch del dispatcher es por sesión, no global**: si un sub-agente devuelve output vacío y se latchea la sesión, el estado SDD vive en `openspec/changes/{change}/` + engram — una sesión nueva con `/sdd-continue {change}` retoma exactamente donde quedó. Para la demo: si pasa en vivo, es narrativa ("el estado sobrevive a la sesión"), no un desastre; usar el pre-capturado de esa fase mientras tanto.
- **Los modelos gratuitos son promocionales y mueren sin aviso**: `deepseek-v4-flash-free` dejó de responder (server error) durante la preparación de esta charla; `hy3-free` aún vive pero puede caer cualquier día. La cadena SDD corre sobre OpenCode Go (suscripción plana) con variantes Zen para calidad premium — NUNCA sobre gratuitos. Si algo gratuito responde hoy, no construir sobre eso.