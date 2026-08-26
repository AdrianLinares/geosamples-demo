# Outline DGI v2 — Demo de hardening de cabeceras de seguridad con ciclo SDD en vivo

> Artefacto de preparación para la **Dirección de Gestión de la Información (DGI)**.
> Versión 2 de la charla: el cambio en vivo ya no es `bbox-filter`, sino el endurecimiento
> de cabeceras de seguridad de la API (`security-headers`). Narrativa y mapeo a la política
> institucional abajo; guion operativo en `runbook-dgi.md`; artefactos por fase en
> `talk/ensayo/precapturados-dgi/`.
>
> Fuente de política citada: `Políticas de IA para Servicio Geológico - actualizado inquietudes.docx.md`
> (Responsable de coordinación: Dirección de Gestión de la Información).

---

## One-liner (hook)

"Ver cómo se dirige — no se autopilotea — a un agente para endurecer la seguridad de una API
real, con un proceso verificable y trazable que cumple nuestra propia política de IA."

## Audiencia

DGI (gestión de la información) e invitados de gobernanza/jurídico. No se asume experiencia
con agentes de IA ni con SDD; sí interés en **supervisión humana, trazabilidad y seguridad**.

## Qué se llevan (takeaways)

1. El agente es apoyo, no sustitución del criterio humano: el humano aprueba propuesta y spec.
2. Un requisito no funcional de seguridad se construye con la misma disciplina que una capacidad:
   spec primero, tests juntos, verify al final.
3. La trazabilidad es real: cada cabecera tiene spec, implementación, tests y aprobación humana.
4. El resultado no se escribió "a mano": lo especificó un spec, lo implementó un agente, lo
   aprobó una persona — y el diff de `curl` lo prueba en pantalla.

## El stack detrás del ciclo (Gentle-AI / Gentle-Pi)

Fuente: README oficial `Gentleman-Programming/gentle-ai`. Mensaje: las herramientas
no son adorno — cada una ataca un costo (tokens/tiempo) Y refuerza una propiedad
de gobernanza del ciclo.

| Herramienta | Cómo ahorra tokens | Cómo refuerza el ciclo SDD |
| --- | --- | --- |
| Sub-agentes por fase (orquestador + 8 agentes) | Cada fase corre en un agente enfocado que lee artefactos previos, no la conversación completa («focused subagents instead of one growing conversation») | Puerta humana natural entre fases; artefacto verificable al cierre de cada una |
| Perfiles de modelos por fase | Modelo económico para explore/tasks; potente solo para design («a cheap one for exploration») | El costo por fase es decisión de arquitectura, auditable (principio 3 del deck) |
| CodeGraph | Índice semántico: una consulta reemplaza cadenas de grep + lectura repetida | Exploración reproducible que ancla EXPLORE |
| Engram (memoria persistente) | Decisiones/artefactos sobreviven sesiones y compactions: cero re-explicar contexto | Trazabilidad continua entre sesiones |
| Review acotado RDD (opt-in) | Profundidad de revisión según evidencia, no tamaño («never size alone») | Congela candidato: una revisión, una corrección con presupuesto, un recibo |

gentle-pi = el mismo stack como harness package-managed para el agente Pi:
el flujo de trabajo no queda atado a una sola herramienta (anti lock-in del workflow).

## Mapeo demo → política (anclas reales)

| Elemento de la demo | Política — capítulo / disposición | Por qué alinea |
| --- | --- | --- |
| Pausa del orquestador para aprobar propuesta/spec | **Cap. 4** — Gestión de riesgos, evaluación de impacto y **supervisión humana**; línea ~131: *"validación humana competente y trazable"* | La puerta humana es la gobernanza más visible; el humano decide si sigue. |
| "La IA como apoyo, no sustitución del criterio experto" | Línea ~131 (mismo art.) | El agente propone/implementa; el humano valida y traza. |
| El hardening de cabeceras en sí (X-Frame-Options DENY, CSP `frame-ancestors 'none'`, etc.) | **Cap. 5** — Desarrollo, adquisición, **seguridad**, MLOps y operación | Controles de seguridad aplicados en el desarrollo, no ad-hoc. |
| Spec + tests + archive por fase | **Art. 8** — Transparencia y trazabilidad (líneas ~147-149): *"reconstruir qué datos, modelo, versión, parámetros y controles intervinieron"* | Cada cambio deja artefacto revisable; para sistemas generativos se conserva config del modelo. |
| Cambio controlado con gates, no "piloto a producción" suelto | Línea ~127: *"No se permitirá que un piloto evolucione a producción sin pasar por las revisiones de datos, riesgo, arquitectura, seguridad, validación científica, operación y continuidad"* | El ciclo SDD es esa revisión por diseño, en pequeño y verificable. |

> Nota de presentación: los números de línea de la política se desplazan entre versiones del
> `.docx.md`; citar por **capítulo/nombre de disposición** (más estable) y verificar la línea
> en pantalla antes de proyectar.

## Consigna en vivo (texto exacto)

Ver `runbook-dgi.md` → sección "Consigna del ciclo (B0-DGI v2)". En síntesis: pedir al agente
que endurezca la configuración de seguridad de todas las respuestas de la API a valores exactos
(`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Content-Security-Policy: default-src 'self'; frame-ancestors 'none'`), manteniendo el resto
del hardening intacto, siguiendo el patrón centralizado en `server/src/index.ts` y actualizando
los tests de la API juntos.

## Cierre visual (el momento firma)

`curl -I` ANTES vs DESPUÉS lado a lado (ver `runbook-dgi.md` → "Cierre visual"). Frase:
*"las cabeceras nuevas no las escribió nadie a mano: las especificó un spec, las implementó un
agente y las aprobó una persona."*

## Relación con los otros artefactos

- `runbook-dgi.md` — guion operativo, time-boxes por fase, planes de respaldo.
- `talk/outline.md` — outline general de la charla (sesión en vivo completa); este archivo es
  la variante DGI centrada en seguridad + política.
- `talk/ensayo/precapturados-dgi/` — 6 artefactos por fase para cortar y narrar.
- `talk/ensayo/ciclo-ensayo2-bbox-filter/` — Plan C (fallback si el ciclo DGI no arranca).
