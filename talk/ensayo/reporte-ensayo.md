# Ensayo de la demo — Ciclo SDD en vivo (bbox-filter)

> Ensayo real del segmento B0→B7 ejecutado el 2026-08-20 14:58–15:24 sobre el sistema
> geosamples-demo (Postgres 18 local, API :3001, SPA :5173). Cronometrado fase por fase
> con el mismo runtime que se usará en la charla. Al finalizar, el repositorio fue
> RESTAURADO al estado pre-ensayo: el bbox NO está implementado, la demo en vivo lo
> rehace desde cero. Los artefactos de cada fase quedaron capturados como pre-capturados
> en `talk/ensayo/precapturados/`.

## Tabla de tiempos reales por fase

| Fase | Tiempo | Detalles / Notas |
|------|--------|------------------|
| B0 Consigna + dispatcher | — | Inmediato (prompt del runbook + `gentle-ai sdd-status`) |
| PROPOSE | **3m 26s** | Incluye 1 re-run del gatekeeper (el primer intento no escribió el artefacto — ver lección 1) |
| SPEC | **2m 52s** + ~1m fix | El sub-agente escribió solo en la spec base; hubo que crear el delta en `changes/bbox-filter/specs/` para que el dispatcher lo detectara (ver lección 2) |
| DESIGN | **3m 8s** | Limpio, sin re-runs |
| TASKS | **2m 17s** | Limpio; forecast ~230 líneas, single PR |
| APPLY | **6m 22s** | TDD: RED 38/5 → GREEN 43; suite 97; incluye verify manual con curl real |
| VERIFY | **2m 26s** | PASS WITH WARNINGS; `gentle-ai sdd-verify-validate` admitió `valid: true` |
| **TOTAL FASES** | **≈ 21m 30s** | Encaja en el time-box de la versión 60 min (16–22); ajustado para la de 45 |

**Distribución**: fases de planeación (propose+spec+design+tasks) ≈ 11m 43s · implementación
(apply) ≈ 6m 22s · verificación (verify) ≈ 2m 26s. El apply es la fase más larga y la más
variable — es donde se necesitan los cortes planificados.

## Evidencia capturada

- `talk/ensayo/precapturados/01-proposal.md` — 65 líneas, propuesta bbox
- `talk/ensayo/precapturados/02-spec-delta.md` — Requirement Bounding-Box Filter + 6 escenarios
- `talk/ensayo/precapturados/03-design.md` — 68 líneas, D1–D5
- `talk/ensayo/precapturados/04-tasks.md` — 13 tareas, 2 work units
- `talk/ensayo/precapturados/05-verify-report.md` — 118 líneas, PASS WITH WARNINGS, 97/97, 51/51
- Datos reales verificados: box `norteMin=1700000&norteMax=1750000&esteMin=900000&esteMax=1000000` → **77 muestras** (ACM0397A incluida, primera por orden alfabético); `esteMin=abc` → HTTP 400; export CSV → 77 filas.

## Lecciones del ensayo (actualizan el runbook)

1. **Gatekeeper**: el sub-agente de propose puede terminar su investigación sin escribir el
   artefacto (resultado truncado). El orquestador debe verificar la existencia del archivo y
   re-lanzar la MISMA sesión con feedback correctivo — funcionó en 1 intento.
2. **Spec en modo hybrid**: el sub-agente debe escribir el delta spec en
   `openspec/changes/{change}/specs/{domain}/spec.md` (lo que el dispatcher nativo lee) además
   de actualizar la spec base en `openspec/specs/`. El dispatcher reporta `specs: missing`
   hasta que el delta existe en la carpeta del cambio.
3. **sdd-attempt settle**: `--evidence-revision` exige `sha256:<64-hex-lowercase>` real.
   Calcular con `sha256sum` de un artefacto/evidencia; no usar placeholders.
4. **El box demo real devuelve 77 muestras, no 1**: el criterio de aceptación del spec es
   "ACM0397A incluida" (se cumple), no "solo ACM0397A". Actualizar el guion de la demo para
   no prometer un resultado distinto. ACM0397A aparece primera por orden de código — bueno
   para la demo.
5. **TDD enfocado funciona como narrativa**: 5 tests en RED antes de implementar y verdes
   después de un solo cambio server+mock es una secuencia clara y corta para mostrar en vivo.
6. **El error 400 real lleva prefijo `"Error: "`**: el handler central de index.ts serializa
   errores lanzados; el body real es `Error: esteMin must be numeric`. Los tests asertan con
   regex. Mencionarlo en la demo si se muestra el curl del 400.

## Estado post-ensayo (restaurado para la demo en vivo)

- `src/` y `server/` idénticos al snapshot pre-ensayo (verificado con `diff -rq`)
- `openspec/specs/sample-query/spec.md` restaurada (sin la Requirement bbox)
- `openspec/changes/bbox-filter/` eliminada (el dispatcher volverá a decir `propose`)
- `pnpm test` → **90/90 passed**
- Postgres :5432, API :3001, SPA :5173 corriendo
- Los pre-capturados quedan en `talk/ensayo/precapturados/` como plan B de cortes