# Runbook DGI — charla de seguridad con demo de hardening

> Guion operativo para la versión 2 (Dirección de Gestión de la Información).
> Narrativa y mapeo a la política en `outline-dgi.md`; deck en `slides-dgi/index.html`.
> El preflight (Postgres/API/SPA/seed) es el MISMO del runbook principal (`runbook.md`,
> secciones T-60 → T-0): no se repite acá. Lo nuevo es la consigna, los cortes y los planes.

---

## Estado requerido del repo (idéntico al reset validado)

- HEAD en `7d92255` (pre-bbox, pre-headers), 90/90 tests, DB = 99 muestras
- Si el repo tiene trabajo previo: usar la receta de reset del runbook principal
  ("Reset a slate limpio") — ya ejecutada y validada el 2026-08-21

## Smoke tests T-30

```bash
curl -s localhost:3001/health                                   # {"status":"ok"}
opencode run --model opencode-go/glm-5.2 "di OK"                # modelo vivo
pnpm test 2>&1 | tail -1                                        # 90 passed
```

**Pre-capturar el estado "ANTES" (crítico para el cierre visual):**

```bash
curl -sI http://localhost:3001/api/samples | tee talk/ensayo/curl-antes.txt
```

→ NO debe mostrar ninguna cabecera de seguridad. Este archivo es la evidencia del
"antes" que se compara en pantalla al cierre si el ciclo no llega.

---

## Consigna del ciclo (B0-DGI v2, texto exacto)

> **Contexto hallado en ensayo 3**: la API ya monta `helmet()` con defaults desde
> `fa589b6`. El cambio NO es "agregar cabeceras" sino **endurecerlas a los valores
> exigidos y dejarlas bajo test por primera vez**. Narrativa: defensa base →
> alineada con la política → verificada. Delta visible en curl (SAMEORIGIN→DENY,
> no-referrer→strict-origin-when-cross-origin, CSP recortada con frame-ancestors 'none').

En sesión nueva de OpenCode abierta **en el repo**, plantear:

> "La API usa helmet con sus valores por defecto. Endurece la configuración de
> seguridad de todas las respuestas de la API a estos valores exactos:
> `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
> `Referrer-Policy: strict-origin-when-cross-origin` y
> `Content-Security-Policy: default-src 'self'; frame-ancestors 'none'`.
> Manten el resto del hardening existente intacto. Sigue el patrón de
> configuración centralizada en `server/src/index.ts`, y actualiza los tests
> de la API juntos, verificando cada cabecera en `GET /api/health` y
> `GET /api/samples`. Corre el ciclo SDD."

**Qué decir mientras corre**: "Le estoy pidiendo un hardening — un requisito no funcional
de seguridad — con la misma disciplina que una capacidad: spec primero, tests juntos.
Y fíjense que nombra el patrón existente: eso es dirigir, no tipear."

---

## Cortes por fase y narrativa

| Etapa | Time-box | Qué mostrar | Corte |
|---|---|---|---|
| B0 consigna | 30 s | Texto en pantalla; leerlo en voz alta | — |
| explore | 30 s–1 min | El agente lee middlewares/tests existentes | Abrir `middlewares/auth.ts` manualmente: "el patrón que le nombré" |
| propose | 1 min | Alcance + fuera de alcance (diferirá HSTS o rate-limit headers probablemente) | Mostrar el diferido: "segunda vez que el proceso deja el roadmap escrito" |
| spec | 1–2 min | Escenarios Given/When/Then POR CABECERA | Pre-capturado del ensayo 3 |
| design | 1 min | Ubicación del middleware, orden de registro | Pre-capturado |
| tasks | 1 min | Implementar + tests juntos | Pre-capturado |
| apply | 3–5 min | Middleware + tests verdes | Pre-capturado; si corta acá, el curl final usa el archivo "antes" y se muestra el diff esperado |
| verify | 1 min | Suite completa + build + veredicto | Pre-capturado |
| cierre | 1 min | `curl -I` ANTES vs DESPUÉS lado a lado | Ver abajo |

**Puertas humanas**: cuando el orquestador pida aprobación de propuesta/spec, PAUSAR y
decir: *"esta pausa es el art. 4 de su política: supervisión humana competente y trazable.
Yo decido si sigue."* Es el momento de gobernanza más visible del día.

**Si preguntan por PR**: "no crear PR, dejar todo local" (igual que ronda 1).

## Cierre visual (el momento firma)

```bash
echo "=== ANTES ==="; cat talk/ensayo/curl-antes.txt | head -8
echo "=== DESPUÉS ==="; curl -sI http://localhost:3001/api/samples | grep -iE "x-content|x-frame|referrer|content-security"
```

Frase: *"las cabeceras nuevas no las escribió nadie a mano: las especificó un spec,
las implementó un agente y las aprobó una persona."*

---

## Talking points: el stack Gentle-AI (slide 7)

Si preguntan "¿y todo esto qué costo tiene?" o "¿qué herramientas son?", la respuesta
está en el slide 7 del deck (fuente: README oficial Gentleman-Programming/gentle-ai):

- **Sub-agentes por fase**: tokens acotados — cada agente lee artefactos previos,
  no el historial completo; además crea la puerta humana natural entre fases.
- **Perfiles de modelos**: barato para explore/tasks, potente para design →
  el costo se asigna donde impacta y queda auditable por fase.
- **CodeGraph**: índice semántico del repo; una consulta reemplaza loops de grep+lectura.
- **Engram**: memoria persistente entre sesiones y compactions → cero re-exploración;
  refuerza trazabilidad.
- **Review acotado (opt-in)**: congela el candidato; esfuerzo según evidencia, no tamaño;
  una corrección con presupuesto fijo.
- **gentle-pi**: mismo stack para el agente Pi → el workflow no queda atado a una herramienta.

Dato duro de apoyo: el ensayo 3 midió el ciclo completo en 28m38s sin cortes —
la economía de tokens/tiempo está medida, no prometida.

## Planes de respaldo

| Situación | Plan |
|---|---|
| Fase lenta / output vacío / latch | No reintentar: cortar con pre-capturado del ensayo 3; retomar en sesión nueva con `/sdd-continue` |
| Ciclo no arranca (red/proveedor) | Plan B: narrar el ciclo con los pre-capturados del ensayo 3 + curl antes/después real (el "antes" siempre existe) |
| Plan B también comprometido | Plan C: narrar bbox-filter con los artefactos/pre-capturados de la ronda 1 (`talk/ensayo/ciclo-ensayo2-bbox-filter/`) |
| Pregunta jurídica compleja | Anclar en su documento ("su línea X dice Y") — no improvisar posiciones institucionales |

## Ensayo 3 — EJECUTADO 2026-08-23 ✅

Resultados medidos (ciclo completo sobre main con bbox integrado, baseline 104/104):

| Etapa | Time-box | Medido | Corte en vivo |
|---|---|---|---|
| explore | 30 s–1 min | **2m42s** | Cortar a los ~40 s, narrar resto |
| propose | 1 min | **4m42s** | Cortar; mostrar diferido del proposal |
| spec | 1–2 min | **3m59s** | Cortar; mostrar tabla de escenarios |
| design | 1 min | **7m01s** | Cortar temprano; narrar decisiones clave |
| tasks | 1 min | **3m02s** | Cortar; mostrar las 5 tareas |
| apply | 3–5 min | **2m28s** | Dejar correr COMPLETO (cabe en el box) |
| verify | 1 min | **2m53s** | Mostrar arranque + veredicto final |
| archive | — | **1m51s** | Mencionar, no proyectar |
| **Total** | ~13 min | **28m38s** | En vivo se recorta a ~12–14 min |

**Estrategia confirmada**: apply es la ÚNICA fase que entra completa en su time-box
(2m28s < 3 min) — es la que se ve entera en vivo; todas las demás se cortan y se
narran desde `talk/ensayo/precapturados-dgi/`. El total sin cortes (28m38s) valida
que SIN la disciplina de corte la demo no cabe en el segmento de 45 min.

**Hallazgos del ensayo (material narrativo)**:
- La API ya montaba `helmet()` default desde `fa589b6` → consigna v2 = ENDURECER,
  no agregar (delta visible: SAMEORIGIN→DENY, no-referrer→strict-origin-…,
  frame-ancestors 'self'→'none')
- El delta de cabeceras está explicado línea por línea en
  `talk/ensayo/curl-diff.md` — artefacto de narración para el cierre; los .txt
  llevan comentarios y se recuperan crudos con `grep -v '^#' f | sed 's/   #.*//'`
- El agente detectó que `/api/health` no existe (real: `/health`) — corrige la
  consigna del humano y lo documenta
- Ambigüedad CSP resuelta en puerta humana: Approach 2 merge (helmet v8
  `useDefaults: true`), reemplazo literal habría DEBILITADO 10 directivas
- Design verificó opciones contra `node_modules/helmet` v8.3.0 y que HSTS es
  incondicional (regression test válido sobre HTTP)
- Resultado: 114/114 tests (+10 escenarios), typecheck limpio, PASS 5/5 reqs,
  archivado en `openspec/changes/archive/2026-08-23-security-headers/`
- Evidencia curl: `talk/ensayo/curl-antes.txt` / `curl-despues.txt`
- Estado post-ensayo: cambios SIN commit (server/src/index.ts +9−1,
  server/tests/api.test.ts +35−1); para volver al estado pre-ensayo:
  `git checkout -- server/ && rm -rf openspec/changes/archive/2026-08-23-security-headers openspec/specs/security-headers`

**Pendiente para la fecha**: repetir este ensayo 24–48 h antes de la charla para
validar estabilidad del proveedor Go (el routing puede variar los tiempos ±50%).
