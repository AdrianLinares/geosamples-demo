# Outline de la charla: Desarrollo agéntico con gentle-ai — el ciclo SDD en acción

> Artefacto de preparación. Todos los datos del sistema citados aquí son reales y verificables en el repositorio `geosamples-demo` (verificado el 2026-08-20). Los números de duración por segmento son propuestas editables; la estrategia de demo está TOMADA: **(a) sesión agéntica EN VIVO completa** (ver «Estrategia de demo»).

---

## Título sugerido y one-liner

**Título sugerido**: "Dirigir agentes que construyen software: el ciclo SDD con gentle-ai"

**One-liner (hook)**: "No le pedimos a la IA que 'escriba código': la dirigimos para que construya software con un proceso verificable. Hoy vemos el ciclo completo Spec-Driven Development funcionando en vivo, sobre un sistema real."

---

## Audiencia y takeaways

**Audiencia**: desarrolladores (devs) con experiencia en escribir código; no se asume experiencia previa con agentes de IA ni con OpenCode/gentle-ai.

**Qué se llevan (takeaways)**:

1. El desarrollo agéntico no es "autopilot": el humano dirige (spec, criterio, revisión), los agentes ejecutan, y la verificación decide.
2. SDD (Spec-Driven Development) da un proceso repetible: explore → propose → spec → design → tasks → apply → verify → archive, con un artefacto revisable en cada fase.
3. Los costos reales (tokens, tiempo, revisión humana) se gestionan por diseño: presupuesto de líneas por PR, chained PRs, modelos por fase.
4. La verificación honesta atrapa errores reales (90 tests, 45 escenarios, verify no cosmético).
5. Cómo arrancar: un cambio real y chico sobre un sistema existente, con el ciclo SDD, no "construir todo desde cero".

---

## Agenda con tiempos

| # | Segmento | Min (versión 45) | Min (versión 60) |
|---|----------|------------------|------------------|
| 1 | Apertura y hook | 3 | 4 |
| 2 | Qué es desarrollo agéntico (principios) | 5 | 6–8 |
| 3 | El proceso SDD (fases y por qué) | 6 | 9 |
| 4 | DEMO EN VIVO (segmento central) | 16–18 | 20–22 |
| 5 | Qué aprendimos del viaje real (historias) | 7 | 9 |
| 6 | Anti-patrones y errores comunes | 4 | 4 |
| 7 | Cierre + Q&A | 4 | 4–6 |
| | **Total** | **45** | **60** |

La versión de 60 minutos hace de la demo en vivo el centro de la charla (20–22 min). El rebalanceo respeta el total de 60: si la demo va en 22 min, el segmento 2 baja a 6 min y el cierre + Q&A pasa a 6; si va en 20 min, el segmento 2 se mantiene en 8. En la versión de 45 minutos la demo va en 16–18 min con cortes muy estrictos; si se usa el máximo (18), el segmento 2 o el 3 se recorta en 2 min para respetar el total. Si el público es muy técnico, el segmento 2 puede recortarse y el excedente ir a Q&A.

---

## Estrategia de demo (decisión tomada + planes de respaldo)

**Contexto**: el sistema inicial YA está construido y verificado (ciclo SDD `initial-system` completado y archivado en `openspec/changes/archive/2026-08-20-initial-system/`). La demo NO puede ser "construir todo desde cero": sería falsa y no cabe en el tiempo. La decisión tomada define cuánto del proceso se muestra EN VIVO con agentes trabajando: el ciclo completo.

### Decisión tomada: estrategia (a) — sesión agéntica EN VIVO completa

**Sin tour previo (o un flash de 60 segundos como máximo)**: una vista de la SPA con "99 samples", un filtro y un curl, solo para probar que el sistema existe y que el proceso ya funcionó.

**El segmento central de la demo ES el ciclo SDD completo corriendo en vivo con agentes**: consigna → explore → propose → spec → design → tasks → apply → verify, con el orador cortando por tiempo y por fase.

**El cambio en vivo**: filtro geográfico por bounding box (`norteMin`/`norteMax`/`esteMin`/`esteMax`) en API + FilterBar del SPA. Justificación:

- El `proposal.md` archivado lista literalmente `bbox search (deferred; EPSG:3115 unconfirmed)` como fuera de alcance. Agregarlo en vivo es la continuación más honesta del roadmap que el propio proceso trazó: no es un ejercicio inventado para la cámara.
- Los datos ya tienen `norte`/`este` normalizados y documentados en `exploration.md` (rango Norte 1.001.361–1.744.707, Este 728.484–1.001.857, CRS MAGNA Colombia Bogotá / EPSG:3115), así que el cambio no requiere migración de datos.
- Sigue el patrón exacto de los filtros existentes (`buildWhere` en `server/src/routes/samples.ts`), lo que hace el ciclo corto y predecible, con un gotcha didáctico: el orden fijo de condiciones y el mock pool de `api.test.ts` dependen de ese orden — el agente debe tocar tests y código juntos.

**Filosofía explícita — "el corte por tiempo es parte de la narrativa"**: así termina una sesión real: en verify o en el corte, no en "ya quedó". Cuando una fase se pasa de tiempo, el orador corta, muestra el estado pre-capturado de esa fase y lo dice en voz alta. El corte no es un fallo de la demo: es cómo termina de verdad una sesión agéntica.

**Por qué (a) y no (b) o (c)**:

- El tema de la charla es "agentes construyendo software": el momento de mayor valor es ver el ciclo SDD completo corriendo en vivo desde la consigna inicial. Las estrategias (b) y (c) no muestran eso en su totalidad y contradicen la promesa del título.
- Es la estrategia de mayor riesgo (modelo, red y tiempo pueden arruinar el segmento central), y por eso el ensayo previo es OBLIGATORIO: mide la latencia real del modelo por fase, captura los estados pre-capturados reales y valida el timing total. Sin ensayo, (a) no se puede ejecutar y se pasa al plan B.
- El flash inicial de 60 segundos prueba ante el público que el proceso funcionó (sistema real, 99 muestras), y la filosofía del corte convierte el riesgo de tiempo en parte de la narrativa en lugar de una amenaza.

### Plan B (emergencia): estrategia (c) híbrida

**Tour rápido del sistema funcionando (3–4 min) + mini-ciclo SDD en vivo (12–16 min)** — la recomendación anterior, degradada a plan B de emergencia: se activa SOLO si la sesión en vivo no puede arrancar (red/modelo). Requiere tener los estados pre-capturados del ensayo a mano. El cambio propuesto es el mismo: filtro por bounding box.

### Plan C: estrategia (b) — solo sistema funcionando + narrativa con artefactos reales

Mostrar la SPA, los endpoints y recorrer `openspec/` contando cómo se construyó. Pros: riesgo mínimo, control total del timing. Contras: no hay ningún agente trabajando en pantalla; para una charla cuyo tema es desarrollo agéntico es la opción menos memorable. Último recurso si (a) y (c) no son posibles.

| Criterio | (a) Live completa (ELEGIDA) | (c) Híbrida (plan B) | (b) Narrativa + artefactos (plan C) |
|----------|----------------------------|---------------------|--------------------------------------|
| Autenticidad del tema | Máxima | Alta | Baja |
| Riesgo en vivo | Alto | Medio (acotado) | Mínimo |
| Control de timing | Bajo | Medio-alto | Alto |
| Muestra el sistema terminado | No (o mínimo) | Sí | Sí |
| Esfuerzo de preparación | Alto (ensayo obligatorio) | Medio | Bajo |

**Decisión tomada: (a)** — ver la nota de riesgos y el ensayo obligatorio en el checklist de prereq. La sesión en vivo se corta por tiempo y por fase; los estados pre-capturados se capturan durante el ensayo, no se inventan.

### Checklist de prereq de la demo (para cualquiera de las tres)

- [ ] Postgres 18 local corriendo en :5432 (cluster `.pgdata/`, gitignored; socket en /tmp) — `pg_ctl -D .pgdata status`
- [ ] API corriendo en :3001 — `curl http://localhost:3001/health` → `{"status":"ok"}` y `GET /api/meta` responde (42 rocas, 12 colectores, 4 análisis)
- [ ] Seed corrido: `pnpm seed` → "Seeded 99 samples (source: 99 records, 0 dropped)" (idempotente)
- [ ] SPA corriendo en :5173 — `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173` → `200`
- [ ] `.env` con `ADMIN_USERS` configurado (credencial de demo: `admin` / `admin`); NUNCA mostrar el hash en pantalla
- [ ] Modelos configurados en OpenCode: routing por fase en la config global, todo sobre OpenCode Go (explore→`qwen3.7-plus`, propose→`glm-5.1`, spec/tasks→`qwen3.8-max`, design→`glm-5.2`, apply→`kimi-k2.7-code`, verify→`mimo-v2.5-pro`) + variantes `-zen` (Zen pay-per-token, ej. `claude-sonnet-5`) como escalado de calidad; prompt de humo antes de la charla
- [ ] **ENSAYO OBLIGATORIO** (día previo o mañana de la charla): correr el ciclo completo UNA vez para (a) medir la latencia real del modelo por fase, (b) capturar los estados pre-capturados reales (spec, tasks, apply corriendo, verify verde) que se usarán si hay que cortar, (c) validar el timing total del segmento 4. Sin este ensayo la estrategia (a) no se puede ejecutar; se pasa al plan B (c).
- [ ] Terminales preparadas: fuentes grandes, fondo claro, ventanas pre-posicionadas (SPA, terminal API, terminal agente, editor con `openspec/`)
- [ ] Estados pre-capturados por fase (spec, tasks, apply corriendo, verify verde) tomados DEL ENSAYO — se usan si hay que cortar la sesión en vivo; no se inventan ni se fabrican el día de la charla
- [ ] Conexión de red estable y verificada el mismo día; plan B sin red: estrategia (c) (flash + mini-ciclo narrado con artefactos) — requiere el pre-capturado del ensayo; todo el sistema es local
- [ ] Presupuesto de rate limit: la API limita a 300 requests / 15 min por IP — no lanzar loops de curl; usar la UI para la mayoría de las consultas

---

## Detalle por segmento

### 1. Apertura y hook (3–4 min)

- **Mensaje clave**: el desarrollo agéntico cambia el trabajo del dev: de escribir cada línea a dirigir un proceso. La promesa de la charla: al final sabés cómo correr un ciclo SDD completo y qué esperar en cada fase.
- **Qué mostrar en pantalla**: slide con el one-liner; a continuación, el sistema terminado en el navegador (SPA en :5173 con "99 samples — page 1 of 4") con la frase: "Esto lo construyeron agentes dirigidos. Hoy vemos cómo se hace."
- **Transición**: "¿Cómo se llega de un TSV con datos sucios a esto? Hay un proceso detrás — Spec-Driven Development."

### 2. Qué es desarrollo agéntico (5–8 min)

- **Mensaje clave**: tres principios — (1) el humano dirige y los agentes ejecutan; (2) la verificación es honesta (tests, escenarios, evidencia, no "confía en mí"); (3) los costos son reales y se gestionan por diseño (tokens, tiempo de máquina, y sobre todo tiempo de revisión humana) — y la elección de modelos es una decisión de arquitectura: OpenCode Go (suscripción plana) para el volumen del ciclo, Zen (pay-per-token) donde el techo de calidad paga.
- **Qué mostrar en pantalla**: slide de principios; diagrama simple del ciclo SDD (explore → propose → spec → design → tasks → apply → verify → archive) con la etiqueta de "artefacto" en cada fase.
- **Transición**: "Cada fase produce un artefacto revisable. Veamos qué es cada uno en el proceso SDD."

### 3. El proceso SDD (6–9 min)

- **Mensaje clave**: SDD convierte "construí esto" en una cadena de artefactos verificables. El spec es un contrato (requerimientos + escenarios Given/When/Then); tasks parte el trabajo en unidades revisables; verify juzga contra el spec, no contra la intuición; archive deja el rastro completo.
- **Qué mostrar en pantalla**: recorrer `openspec/` en el editor; abrir un spec real (ej. `openspec/specs/sample-query/spec.md`) mostrando el formato de escenarios; mostrar `verify-report.md` del archivo con el veredicto y la matriz de 45/45 escenarios; mostrar `tasks.md` con el forecast de ~1800 líneas y el budget de 400.
- **Transición**: "Todo esto suena bien en teoría. Veámoslo funcionando en vivo."

### 4. DEMO EN VIVO (16–22 min) — segmento central

> Asume la estrategia confirmada (a): sesión agéntica EN VIVO completa. El guion operativo paso a paso está en `runbook.md`; acá está la narrativa y los cortes.

**Parte 1 — Flash de contexto (60 s)**:

- **Mensaje clave**: el sistema ya existe y el proceso ya funcionó: 99 muestras reales de INVEMAR (Santa Marta), consultables y exportables.
- **Qué mostrar**: una sola vista de la SPA (:5173, "99 samples — page 1 of 4"); un filtro rápido (ej. rock = Cuarzodiorita → 34); opcional: un curl de `GET /api/meta` (42 rocas, 12 colectores, 4 análisis).
- **Corte**: 60 segundos, cronometrados. No se hace tour: la evidencia completa del sistema queda para el segmento 5 y para Q&A.
- **Transición (directa al ciclo)**: "Esto ya está construido y verificado. Ahora vemos cómo se construye: el ciclo SDD completo, en vivo, con agentes. La consigna es esta..."

**Parte 2 — Ciclo SDD EN VIVO completo (la sesión central)**:

- **Mensaje clave**: el humano plantea UNA capacidad nueva y los agentes la llevan por TODO el ciclo; el orador corta por tiempo y por fase. De paso se muestra la asignación de modelos por fase — cada fase corre sobre OpenCode Go con el modelo que su tipo de decisión exige (y las variantes Zen existen para cuando una fase pide techo de calidad premium): se ve funcionando en vivo, no se cuenta.
- **Filosofía explícita — "el corte por tiempo es parte de la narrativa"**: así termina una sesión real: en verify o en el corte, no en "ya quedó". Cuando una fase se pasa de su time-box, el orador corta, muestra el estado pre-capturado de esa fase y lo dice en voz alta ("acá el agente sigue trabajando; yo corto y muestro el resultado esperado"). El corte no es un fallo de la demo: es cómo termina una sesión agéntica de verdad.
- **Qué mostrar** (cada fase con su corte planificado):
  1. **Consigna** (1 min): "Agregar filtro geográfico por bounding box al catálogo. Estaba diferido en el proposal original." — texto exacto del prompt al agente en el runbook (B0).
  2. **Explore** (1–2 min): el agente confirma el rango de coordenadas real en `exploration.md` (Norte 1.001.361–1.744.707, Este 728.484–1.001.857, EPSG:3115). Corte: abrir `exploration.md` manualmente y leer los rangos.
  3. **Propose** (1–2 min): propuesta con alcance (API + SPA + tests) y fuera de alcance (sin migración de datos); nota del deferred en `proposal.md`. El orador aprueba o corrige.
  4. **Spec** (2–3 min): 1–2 requerimientos nuevos con escenarios Given/When/Then; mostrar el archivo spec. Corte: spec pre-capturado del ensayo.
  5. **Design** (1–2 min): la decisión de diseño — patrón `buildWhere` reutilizado, mock pool de `api.test.ts`, dónde van los campos nuevos en FilterBar y en `toQuery`.
  6. **Tasks** (1–2 min): 2–3 tareas con su test enfocado; el gotcha del orden fijo de condiciones en `buildWhere` (tests y código se tocan juntos).
  7. **Apply** (4–7 min): el agente implementa y corre los tests enfocados; verificación por curl real del filtro con los rangos del escenario del spec.
  8. **Verify** (1–2 min): `pnpm test` (suite completa: 90 tests + los nuevos) y `pnpm build`; veredicto contra el spec.
  9. **Cierre** (30 s): "El ciclo queda en verify verde (o cortado en la fase donde está). Archive es para la siguiente sesión. Así termina una sesión real."
- **Cortes planificados**: si una fase se pasa de tiempo, saltar a la siguiente con el estado pre-capturado y decirlo en voz alta. El runbook detalla qué estado pre-capturado corresponde a cada fase y qué se corta en cada una.

**Parte 3 — Cierre de demo (1–2 min)**:

- **Mensaje clave**: lo que viste no es magia: es un proceso con artefactos, tests y un humano decidiendo en cada fase. El cierre ya lo dijo el ciclo en vivo: así termina una sesión real.
- **Transición**: "El viaje de esta demo es chico. El viaje real que construyó este sistema tiene historias mejores — esas son las lecciones."

### 5. Qué aprendimos del viaje real (7–9 min)

- **Mensaje clave**: el proceso no oculta los problemas: los expone y los resuelve con evidencia.
- **Qué mostrar**: artefactos y archivos reales + curls. Historias (una por punto, con el archivo que la prueba):

| # | Historia | Qué demuestra | Evidencia |
|---|----------|---------------|-----------|
| 1 | Datos sucios reales: 57 variantes de roca → 42 canónicas; `?` de incertidumbre; typos de colectores (`Pado` → `Pardo`, `Cortés`/`Cortes`); fechas sin padding `D/M/YYYY`; `SubUnidad` 99/99 vacía (columna muerta descartada); `SistemaCoordenadas`/`Proyecto` constantes (metadata, no filtros) | El EXPLORE paga: sin canonicalización los filtros mienten | `exploration.md` tabla de columnas; `canonical.ts` alias map; `/api/meta` (42/12/4) |
| 2 | Forecast ~1800 líneas > budget de 400 → 3 chained PRs (PR1 ingest → PR2 api → PR3 spa, stacked-to-main, ask-on-risk) | El proceso NO ignora el costo de revisión humana: parte el cambio para proteger al reviewer | `tasks.md` "Review Workload Forecast" |
| 3 | Bug de `schema.sql`: `CONSTRAINT UNIQUE (lower(codigo_muestra))` es inválido en Postgres (las constraints no envuelven expresiones) → los tests con pg-mock NO lo detectaron; solo apareció en el seed live | "Los mocks pasan, la realidad te corrige": el mock es necesario pero no suficiente | `schema.sql` (fix: `CREATE UNIQUE INDEX ... ON samples (lower(codigo_muestra))`); `archive-report.md` |
| 4 | Idempotencia del seed (R10) probada SIN base real: `seed-mock` simula `ON CONFLICT DO NOTHING` (2 runs → 99 filas, 198 intentos, 0 duplicados); luego confirmada en vivo | Verificación honesta con la mejor evidencia disponible en cada momento | `verify-report.md` (R10); `seed.ts` asserts; `pnpm seed` real: "Seeded 99 samples (source: 99 records, 0 dropped)" |
| 5 | Bug de `.env`: ni `index.ts` ni `seed.ts` cargaban `.env` — funcionaba de casualidad porque el default de `DATABASE_URL` coincidía con docker-compose. Fix: `--env-file=.env` nativo de Node. Gotcha: `tsx watch --env-file=.env` (flag después del subcomando) | Los defaults cómodos esconden configuraciones que no lo son | `package.json` scripts (`dev:server`, `seed`); `db.ts` default |
| 6 | Auth fail-closed: `ADMIN_USERS` vacío → todas las operaciones admin fallan cerrado; 401 idénticos para credenciales inválidas (no filtra cuál falló) | Seguridad por diseño: el sistema no filtra información por error | `middlewares/auth.ts`; curls reales (401 sin auth y con password errada son idénticos) |
| 7 | La API de registro usa NOMBRES canónicos (`nombreRoca`, `tipoAnalisis`), no IDs — mandar IDs da 400 (comportamiento correcto) | El contrato protege la integridad del catálogo | `routes/samples.ts` `normalizeRegistrationPayload`; curl real con nombre no canónico → 400 |
| 8 | El verify falló en el primer intento (2 críticos: escenarios R3 admin-auth y R10 seed-idempotente sin test) → 2 remediaciones → PASS WITH WARNINGS, 45/45 escenarios COMPLIANT, 90/90 tests, build limpio | El verify NO es cosmético: atrapó huecos de cobertura reales | `verify-report.md` (veredicto + matriz + remediaciones) |

- **Transición**: "Todo esto tiene un costo y un modo de fallar. ¿Cuáles son los errores comunes cuando la gente arranca con agentes?"

### 6. Anti-patrones y errores comunes (4 min)

- **Mensaje clave**: los fracasos no vienen del modelo, vienen del proceso: sin spec, sin verificación, sin humanos.
- **Qué mostrar**: lista en slide, conectando cada anti-patrón con una historia ya contada:
  - "Promptear y rezar": pedir y esperar que funcione, sin especificación ni verificación → ver historia del bug de schema.sql (los tests mock no alcanzan).
  - Dejar que el agente haga todo sin revisar: la deuda se paga en review; el budget de 400 líneas existe por algo → historia de los chained PRs.
  - Ignorar los datos reales: sin canonicalización los filtros devuelven basura → historia del EXPLORE.
  - Tests que solo pasan en mock y nada más: el verify con pg-mock no reemplaza el seed live → historia del bug de schema.sql.
  - No definir qué es "listo": sin spec y sin escenarios, la sesión termina cuando el agente se aburre.
  - Mezclar modelos sin criterio: usar el modelo premium para todo o el más barato para todo; la asignación por fase (Go para el volumen del ciclo, Zen donde el techo de calidad justifica su costo) es una decisión de arquitectura, no de marketing.
- **Transición**: "Resumen y preguntas."

### 7. Cierre + Q&A (4–8 min)

- **Mensaje clave**: el agente acelera la escritura; el humano decide la dirección; el proceso hace el resultado verificable. Takeaway práctico: arrancá con un cambio real y chico sobre un sistema que ya existe, con el ciclo SDD.
- **Qué mostrar**: slide de cierre con los 5 takeaways y "cómo arrancar" (gentle-ai + `sdd-init`, openspec, primer cambio chico).
- **Q&A**: usar las preguntas preparadas de la sección siguiente.

---

## Q&A preparado (7 preguntas probables)

1. **¿Qué pasa si el agente alucina?**
   El proceso está diseñado para que la alucinación aparezca como inconsistencia verificable, no como código silencioso: el spec exige escenarios antes del código, y verify los juzga uno por uno. En este proyecto el verify atrapó huecos reales (R3 y R10 sin test → FAIL → remediación). Y el humano revisa los PRs: la alucinación más cara es la que nadie revisa.

2. **¿Por qué no dejar que el agente haga todo solo?**
   Porque el cuello de botella no es escribir líneas, es revisarlas y decidir. El forecast del proyecto (~1800 líneas) se partió en 3 PRs para respetar el budget de revisión de 400 líneas. Un agente sin dirección produce código que nadie entiende ni se anima a tocar.

3. **¿Cuánto cuesta en tokens y tiempo?**
   Depende del tamaño del cambio, y por eso se gestiona por fase y por plan: OpenCode Go (suscripción plana, $10/mes) cubre el volumen del ciclo completo con límites generosos y costo predecible; OpenCode Zen (pay-per-token) entra donde el techo de calidad justifica premium (ej. jueces de review con Claude Sonnet 5). La métrica que más importa no es el costo del modelo: es el tiempo de revisión humano, que se acota con chained PRs y presupuesto de líneas.

4. **¿Cómo se revisa lo que hace el agente?**
   Con el mismo mecanismo que se revisa a un dev: PRs pequeños (budget de líneas), tests como evidencia, y un verify-report que mapea cada escenario del spec a un test que lo cubre (45/45 en este proyecto). La diferencia: los artefactos (spec, tasks, verify) te dicen exactamente qué mirar y por qué.

5. **¿Esto reemplaza al dev?**
   No: cambia el trabajo. El dev pasa de escribir cada línea a especificar, dirigir y verificar. En esta demo el sistema no se construyó solo: alguien decidió el alcance, aprobó el spec, cortó las fases y juzgó el verify. La analogía no es "máquinas vs. personas", es "quién decide vs. quién ejecuta".

6. **¿Por qué no modelos gratuitos? ¿Y Go vs Zen?**
   Porque los gratuitos sirven para probar, no para producir: son promocionales, con rate limits y disponibilidad variable — y mueren sin aviso (DeepSeek V4 Flash Free dejó de responder durante la preparación de esta charla). Un ciclo SDD de 8 fases donde cada fase depende de la anterior necesita acceso confiable: el ciclo corre sobre OpenCode Go (suscripción plana, modelos open-source curados y benchmarkeados), y las variantes Zen (gateway pay-per-token con modelos premium tipo Claude Sonnet 5) existen para cuando una fase exige techo de calidad. Elegir entre ambos es una decisión de presupuesto, no de fe.

7. **¿Sirve solo para greenfield o también para sistemas existentes?**
   El caso de esta charla es el mejor ejemplo: el sistema ya está construido y verificado, y la demo en vivo es un cambio chico sobre ese sistema existente. SDD brilla en cambios incrementales: cada cambio es una capacidad con spec propio, y archive deja el rastro para el siguiente.

---

## Manejo de riesgos en vivo

| Riesgo | Señal | Plan B |
|--------|-------|--------|
| Postgres caído | `curl /health` ok pero `/api/samples` da 500; `pg_ctl -D .pgdata status` dice "no server running" | `pg_ctl -D .pgdata start` (socket en /tmp); fallback Docker: `docker compose up -d` (Postgres 16, mismo role/db `geosamples`) y luego `pnpm seed` |
| API caída | `curl http://localhost:3001/health` no responde | `pnpm dev:server` y esperar el log "geosamples-api listening on http://localhost:3001" |
| SPA caída | `:5173` no carga | `pnpm dev` y esperar el mensaje de Vite (puerto 5173) |
| Modelo lento, vacío o latcheado | La fase supera el tiempo que midió el ensayo, devuelve output vacío o la sesión queda latcheada | No forzar reintentos (el dispatcher puede latchear): cortar a la siguiente fase con el estado pre-capturado; retomar en sesión nueva con `/sdd-continue` — el estado sobrevive en `openspec/` |
| Red caída / la sesión agéntica no arranca | La consigna no genera respuesta del modelo | Plan B: estrategia (c) — flash + mini-ciclo narrado con artefactos, usando los estados pre-capturados del ensayo; todo el sistema es local |
| Rate limit (300 req/15 min por IP) | La API responde 429 | Usar la UI en vez de curls; no repetir loops de consulta |
| El agente se desvía del scope | Los PRs/commits tocan archivos fuera de alcance | Intervenir con un mensaje de redirección al spec ("fuera de alcance: solo API de samples y FilterBar; releé el spec"); si persiste, cortar y mostrar el estado pre-capturado del ensayo |
| Registro demo deja una fila extra | El contador pasa de 99 | Es esperable y se explica; cleanup con `psql` (`DELETE FROM samples WHERE codigo_muestra = '<code>'`); re-correr `pnpm seed` NO borra filas extra (ON CONFLICT DO NOTHING solo omite duplicados) |
| Se expone `.env` en pantalla | Hash bcrypt visible | Nunca abrir `.env`; las credenciales de demo son `admin`/`admin` y se tipean a mano |
| Tiempo: una fase se pasa | Reloj del segmento demo | Cortes planificados: saltar a la siguiente fase con el estado pre-capturado y decirlo en voz alta |
| El ciclo completo excede el tiempo | El segmento 4 pasa el presupuesto total (16–22 min) | Cortar en la fase donde esté, mostrar el estado pre-capturado y decirlo en voz alta — el corte por tiempo es parte de la narrativa, así termina una sesión real |