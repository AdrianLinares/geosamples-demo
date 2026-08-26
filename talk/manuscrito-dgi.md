# Manuscrito técnico — Charla DGI

> **Modo de uso**: estudio previo + repaso rápido antes de cada slide.
> El manuscrito NO se lee en voz alta; contiene el contenido técnico que alimenta
> la narración en vivo. Durante la charla, las notas del orador (tecla N) son las
> cue cards de un renglón. El manuscrito es la fuente de la que se alimenta todo.
>
> Español neutro. Referencias a política por capítulo/disposición (no por número
> de línea, que cambia entre versiones del `.docx.md`).

---

## Slide 1 · Portada
**Duración**: 20 s (cuenta regresiva, pantalla de espera)

[No se dice nada. Slide estático mientras llegan los últimos. Música ambiental o silencio según el lugar.]

**Cita técnica**: —
**Acción en pantalla**: portada con título y «demo en vivo incluida»

---

## Slide 2 · Hook
**Duración**: 1 min
**Acción en pantalla**: mostrar el SPA — `localhost:5173`, catálogo geológico con 99 samples

> Lo que ven en pantalla es una aplicación real: un catálogo geológico hecho con
> React, Vite, Express y PostgreSQL. Tiene 99 registros con datos de muestras de roca,
> con información estándard colectada en los libros índices.
>
> Lo importante no es la interfaz. Lo importante es que este sistema fue construido
> en su totalidad por agentes de IA dirigidos con un proceso verificable.
>
> Hoy la pregunta que nos trae es otra: ¿puede este modo de desarrollar cumplir
> la propia política de IA del SGC? La respuesta vive en la demo que van a ver en vivo.

---

## Slide 3 · La promesa
**Duración**: 1 min 30 s
**Acción en pantalla**: mantener el slide

> Van a ver tres cosas concretas.
>
> Primero: un ciclo completo donde cada fase produce un artefacto verificable y
> el humano aprueba antes de que el agente continúe. Eso no es un formalismo;
> es la implementación operativa del artículo 4 de la política — la IA
> como apoyo, no sustitución del criterio experto.
>
> Segundo: el cambio que ejecutaremos en vivo es un hardening de seguridad —
> no una funcionalidad nueva. La API ya usa `helmet()` con valores por defecto;
> el ciclo lo endurece a los valores exactos que exige la política y deja
> eso bajo test por primera vez. Si esto funciona, queda la pregunta resuelta
> para cualquier requisito no funcional del mismo tipo.
>
> Tercero: todo lo que van a ver está medido. Tiempos reales de cada fase,
> cobertura de tests, evidencia curl antes y después. Nada de esto es promesa;
> es un ensayo que ya corrimos.

---

## Slide 4 · Tres principios
**Duración**: 1 min 30 s
**Acción en pantalla**: mantener el slide; señalar cada card al enumerarla

> Tres principios gobiernan todo lo que viene, y los tres están en lenguage
> de gobernanza, no de implementación.
>
> Uno: el humano dirige. El agente no corre solo — hay aprobación explícita
> en puntos de decisión estructural. Esto es supervisión humana competente
> y trazable, no testimonial.
>
> Dos: verificación honesta. Los resultados se validan contra criterios
> explícitos — escenarios Given-When-Then, tests automatizados — nunca contra
> la autoevaluación del modelo. Si el modelo dice que está bien, no es suficiente;
> tiene que haber un test que lo compruebe.
>
> Tres: costos por diseño. Tokens, tiempo y revisión humana se asignan como
> decisión de arquitectura — no como consecuencia no deseada. Cada fase usa
> el modelo apropiado para su nivel de complejidad.

**Cita técnica**: 
**Dado (Given)**: Define el contexto inicial o las condiciones previas del sistema antes de realizar una acción.
**Cuando (When)**: Describe la acción o el evento desencadenante que realiza el usuario o el sistema.
**Entonces (Then)**: Especifica el resultado observable y esperado tras la acción.

---

## Slide 5 · El ciclo SDD
**Duración**: 1 min 30 s
**Acción en pantalla**: mantener el slide

> El ciclo tiene ocho fases. Cada una produce un artefacto con nombre — no es
> una conversación libre donde el contexto crece indefinidamente.
>
> `explore` escribe `exploration.md` — lo que el agente encontró en el código.
> `propose` escribe `proposal.md` — alcance, fuera de alcance, y qué modelo
> se necesita para cada fase siguiente. `spec` escribe `specs.md` — requerimientos
> con escenarios Given-When-Then, que es un contrato exacto de aceptación.
> `design` escribe `design.md` — decisiones de arquitectura.
> `tasks` escribe `tasks.md` — la lista ordenada de implementación.
> `apply` ejecuta las tareas — genera código y tests.
> `verify` escribe `verify-report.md` — auditoría independiente contra el spec.
> `archive` cierra el ciclo y archiva los artefactos.
>
> Cada transición entre fases es una puerta humana. El agente propone; el humano
> aprueba. Eso es exactamente lo que la política llama supervisión en cada etapa
> del ciclo de vida.

**Cita técnica**: 8 fases × 1 artefacto cada una = 8 puntos de auditoría

---

## Slide 6 · El spec es un contrato
**Duración**: 1 min 30 s
**Acción en pantalla**: mostrar la barra 45/45

> El spec merece atención especial porque es la pieza central.
>
> Un spec de SDD tiene dos partes: los requerimientos — qué tiene que hacer el
> sistema — y los escenarios de aceptación — cómo se prueba que se cumplen, escritos
> en formato Given-When-Then. Esto no es narrativa; es un contrato que el agente
> de verificación al final del ciclo juzga objetivamente.
>
> En el sistema que ven acá, el spec original tiene 45 escenarios. El agente
> de verificación — completamente independiente del que implementó — recorre
> cada uno y lo marca como COMPLIANT o NO COMPLIANT, con el test que lo cubre.
> 45 de 45 pasaron. Eso no es suerte; es el resultado de un proceso que define
>验收 antes de implementar, no después.
>
> Esto es lo que queremos decir con verificación honesta: contra el spec,
> no contra la intuición del agente.

**Cita técnica**: 45/45 escenarios COMPLIANT · Given/When/Then = contrato verificable

---

## Slide 7 · Stack Gentle-AI
**Duración**: 1 min 30 s
**Acción en pantalla**: mantener el slide; señalar la tabla

> Antes de ir al mapeo con la política, vale mirar qué herramientas sostienen
> esto por debajo — no son accesorios; cada una ataca un costo y refuerza
> una propiedad del ciclo.
>
> Primero: sub-agentes por fase. Cada fase corre en un agente independiente
> que recibe los artefactos de la fase anterior, no la conversación completa.
> La documentación lo llama «focused subagents instead of one growing conversation».
> El resultado es que ningún contexto crece sin límite, y cada transición es
> una puerta humana natural.
>
> Segundo: perfiles de modelos por fase. Un modelo económico para explorar
> y listar tareas; un modelo potente solo para diseño donde la complejidad
> de arquitectura lo justifica. La documentación lo describe como «a powerful
> model for design, a fast one for implementation, a cheap one for exploration».
> El costo por fase se convierte en una decisión de arquitectura auditable.
>
> Tercero: CodeGraph — un índice semántico del repositorio que reemplaza
> cadenas de búsqueda y lectura repetida con una sola consulta estructurada.
> Cuarto: Engram, la memoria persistente que sobrevive sesiones y compactions.
> No re-exploramos contexto que ya establecimos.
>
> Quinto: review acotado, que es opt-in. Congela el candidato terminado
> y determina la profundidad de revisión según evidencia, no según tamaño.
> Un candidato, una corrección con presupuesto, un recibo.
>
> Y todo esto es portable: gentle-pi lleva el mismo stack al agente Pi.
> El flujo de trabajo no queda atado a una sola herramienta.

**Cita técnica**: fuente = README oficial `Gentleman-Programming/gentle-ai` · 5 herramientas = 5 propiedades

---

## Slide 8 · El ciclo implementa la política
**Duración**: 2 min
**Acción en pantalla**: mostrar la tabla de mapeo; pausa 15 s para que lean

> Ahora el mapeo. Y quiero que lo lean con atención porque no es una
> interpretación creativa — es una relación uno a uno entre lo que la
> política exige y lo que el ciclo implementa.
>
> Línea 450 del documento — capítulo 5: ningún agente tendrá acceso irrestricto
> a producción, secretos, bases de datos o redes. El ciclo lo implementa así:
> el agente está confinado al directorio del proyecto. La única base de datos
> que ve es PostgreSQL de desarrollo con datos de catálogo de demostración.
> Las credenciales viven fuera del workspace. Las credenciales no cruzan.
>
> Misma línea: cambios por rama y revisión PR antes de integrar.
> El agente de implementación trabaja en rama; la integración requiere
> revisión humana explícita. Eso es exactamente lo que la política ordena.
>
> Línea 497: trazabilidad — qué herramienta, quién respondió, qué archivos
> se tocaron, qué pruebas se corrieron. En el ciclo, cada fase produce un
> artefacto con nombre; el conjunto de artefactos más el historial de git
> forma un expediente completo que se genera automáticamente.
>
> Línea 654: prohibido el Vibe Coding autónomo hacia producción, bases de datos
> institucionales o credenciales. En el ciclo, cada fase tiene puerta humana;
> ninguna fase despliega ni toca sistemas en ejecución. Esa restricción no es
> un parkings del agente — es una propiedad de diseño del proceso.
>
> Y el artículo 176, que es donde la DGI establece que evaluará un asistente
> institucional de código incluyendo «vibe coding controlado»: este ciclo
> es un candidato concreto, funcionando y medible. Hoy lo ven en vivo.

**Cita técnica**: cap. 5, art. 8, art. 176 · tabla 1:1 — no hay interpretación

---

## Slide 9 · ¿Qué sale de la máquina?
**Duración**: 2 min
**Acción en pantalla**: mantener el slide; señalar el diagrama de flujo

> Hay una pregunta que tiene que quedar clara porque es donde la honestidad
> técnica importa.
>
> ¿Qué sale del workspace hacia el proveedor de modelos? La respuesta es:
> fragmentos del código fuente, los artefactos del ciclo, y el historial de la
> conversación. El agente lee archivos del directorio del proyecto; los envía
> como contexto al modelo; el modelo responde con texto que se aplica de vuelta
> al workspace. Eso es lo que pasa.
>
> ¿Qué nunca cruza por diseño? Producción, staging, redes institucionales,
> bases de datos institucionales, credenciales. Si las credenciales viven
> en mecanismos institucionales — no en el workspace del agente — no cruzan.
>
> El control real no está en prometer que nada sale. Está en clasificar antes:
> lo reservado no vive en el directorio que el agente lee. Y la herramienta
> que el agente utiliza tiene que estar autorizada — como dicen las líneas
> 189 y 797 del documento, con cláusulas de no entrenamiento, subencargados
> y eliminación certificada.
>
> Los datos de esta demo son del catálogo de demostración. Nada reservado,
> nada personal, nada institucional. La seguridad no es una promesa del proveedor;
> es una propiedad del proceso.

**Cita técnica**: línea 450 (confinamiento) + línea 189 (cláusulas proveedor) + línea 797 (evaluación)

---

## Slide 10 · Divider DEMO
**Duración**: 15 s
**Acción en pantalla**: avanzar al divider; tomar aire

> Veámoslo funcionando. El cambio de hoy es un hardening de seguridad:
> cuatro cabeceras HTTP que la API ya envía con valores por defecto de `helmet`,
> el framework de seguridad de Express. Vamos a endurecer esos valores a los
> que exige la política, a escribir tests que los verifiquen, y a mostrar
> el diff en pantalla con `curl`.
>
> Esto es un requisito no funcional — seguridad, no funcionalidad — y se construye
> con la misma disciplina que cualquier capacidad.

**Cita técnica**: `helmet()` v8.3.0 en Express 5 · `tsx watch` recarga en caliente

---

## Slide 11 · Tracker del ciclo (FIJO durante la demo)
**Duración**: 12–14 min (ciclo completo en vivo)
**Acción en pantalla**: dejar el slide fijo; alternar con terminal

**Narración por fase del ciclo:**

### B0 · Consigna (30 s)
> Le damos al agente una consigna técnica que nombra las cuatro cabeceras,
> el patrón de configuración existente en `server/src/index.ts`, y le pedimos
> que corra el ciclo SDD. Noten algo: le digo `/api/health` y `/api/samples`.
> Eso es intencional — quiero que el agente detecte si mi consigna es correcta.

### EXPLORE (2m42s medidos)
> El primer agente explora el código. Lee `index.ts`, encuentra que `helmet()`
> está montado en la línea 29 sin configuración explícita. Detecta dos cosas
> que yo quiero que detecte: que el endpoint `/api/health` no existe — el real
> es `/health` — y que hay ambigüedad en la directiva CSP de la consigna.
>
> Esto es exactamente lo que queremos decir con supervisión humana: el agente
> no ejecuta ciegamente; encuentra problemas en mi propia consigna y los
> documenta. Eso es la primera puerta humana del ciclo.

### PROPOSE (4m42s medidos)
> El segundo agente propone un alcance. Recomienda lo que llama Approach 2 —
> merge — porque la API ya tiene 12 directivas CSP configuradas por `helmet`
> con su valor por defecto `useDefaults: true`. Reemplazar la CSP completa
> con solo dos directivas habría eliminado `script-src 'self'`,
> `object-src 'none'`, `form-action 'self'` y siete protecciones más.
>
> Esto es una decisión de ingeniería real: reemplazar vs fusionar. El agente
> documenta las tres opciones, justifica cuál es la correcta y la presenta
> como recomendación.

[**PAUSA DE GOBERNANZA**: aprobar explícitamente la recomendación]
> Esta pausa no es un formalismo. Estoy ejerciendo la supervisión humana
> del artículo 4 — decido si el enfoque es correcto antes de que se especifique.

### SPEC (3m59s medidos)
> El agente de especificación escribe un spec con cinco requerimientos y diez
> escenarios Given-When-Then. Cada cabecera tiene un escenario por endpoint:
> `/health` y `/api/samples`. Hay un escenario adicional que no está en mi
> consigna: una guardia de regresión que fija HSTS y COOP como prueba de que
> el resto del hardening no se rompió.
>
> Eso es verificación honesta: no solo verifico lo que cambié; verifico que
> lo que no debía cambiar sigue intacto.

### DESIGN (7m01s medidos)
> El agente de diseño escribe cómo se implementa. Verifica los nombres exactos
> de las opciones de `helmet` v8.3.0 contra los tipos de TypeScript del paquete
> instalado — no contra la documentación web, contra el `node_modules` real.
> Descubre que `xFrameOptions.action` acepta `"deny"` en minúsculas, y que
> la CSP con `useDefaults: true` mantiene las 12 directivas por defecto.

### TASKS (3m02s medidos)
> Cinco tareas: una de configuración, tres de tests, una de verificación final.
> Aproximadamente 60 líneas de cambio. La fase es más corta porque el trabajo
> de diseño ya definió exactamente qué se toca y cómo se prueba.

### APPLY (2m28s medidos)
> El agente de implementación escribe el código. Modifica dos archivos:
> `server/src/index.ts` — agrega las opciones explícitas a `helmet()` —
> y `server/tests/api.test.ts` — agrega un bloque `describe.each` con los
> diez escenarios. Corre la suite completa: 114 de 114 tests pasan.
>
> Noten el tiempo: 2 minutos 28 segundos. Es la única fase que entra completa
> en su time-box de 3–5 minutos. La diferencia es que el trabajo de diseño
> ya definió la solución exacta; el agente solo tiene que escribirla.

### VERIFY (2m53s medidos)
> Verificación independiente. Un agente diferente al que implementó recorre
> el spec contra el código y contra los tests. Marca cada escenario,
> confirma que la configuración de helmet coincide con el diseño, y verifica
> que no hay scope creep — que solo se tocaron los archivos declarados.
> Veredicto: PASS, 5 de 5 requerimientos compliant, 10 de 10 escenarios.

---

## Slide 12 · Cierre de demo
**Duración**: 1 min
**Acción en pantalla**: mostrar el diff de `curl` — antes vs después lado a lado

> Las cabeceras nuevas no las escribió nadie a mano. Las especificó un spec,
> las implementó un agente y las aprobó una persona.
>
> [**mostrar curl**]
> Mismo endpoint, mismo sistema, mismo catálogo. Tres diferencias:
> `X-Frame-Options: DENY` — era `SAMEORIGIN`.
> `Referrer-Policy: strict-origin-when-cross-origin` — era `no-referrer`.
> `Content-Security-Policy`: `frame-ancestors 'none'` — era `'self'`.
>
> Y algo que no cambió pero ahora sí está bajo test: `X-Content-Type-Options: nosniff`.
> Antes existía por el valor por defecto de `helmet`; ahora tiene un test
> que lo verifica. Eso es lo que queremos decir con trazabilidad:
> no solo funciona; está documentado que funciona, y hay un test que lo comprueba.

**Cita técnica**: diff 3 cabeceras + 1 valor sin cambio pero bajo test = 4 controles

---

## Slide 13 · Divider Historias
**Duración**: 15 s
**Acción en pantalla**: avanzar al divider

> La verificación no es un formalismo. Les voy a contar cuatro historias
> reales de este sistema donde el proceso atrapó errores de verdad —
> no errores hipotéticos, no errores de presentación.

**Cita técnica**: —
**Acción en pantalla**: transición al siguiente slide

---

## Slide 14 · Historias 1–2
**Duración**: 2 min (1 min por historia)
**Acción en pantalla**: mantener el slide

> Historia uno: schema.sql y los mocks.
> Los tests de integración usaban mocks del esquema de base de datos. Pasaban
> siempre. Cuando el sistema se conectó a PostgreSQL real — no al mock —
> falló: una constraint UNIQUE sobre expresión es inválida en Postgres.
> Los mocks no lo detectaron porque no ejecutan el motor de SQL real.
>
> La lección: los mocks pasan; la realidad corrige. Verify no es un formalismo —
> es la última línea de defensa antes de que el código llegue a producción.
>
> Historia dos: verify y los tests faltantes.
> Después del primer intento de verify, el veredicto fue FAIL: dos escenarios
> críticos no tenían test que los cubriera. No eran bugs — eran requerimientos
> sin verificación. Dos ciclos de remediación después: 45 de 45, PASS.
>
> La lección: el proceso expone los problemas en vez de esconderlos. Si el
> veredicto es PASS inmediato, eso puede ser tan peligroso como un FAIL.

**Cita técnica**: schema.sql: constraint UNIQUE sobre expresión · verify: 2 escenarios críticos → 2 remediaciones

---

## Slide 15 · Historias 3–4
**Duración**: 2 min (1 min por historia)
**Acción en pantalla**: mantener el slide

> Historia tres: seguridad por diseño.
> La autenticación de la API sigue un patrón fail-closed: si la lista de admins
> está vacía — que es el valor por defecto — todas las operaciones de admin
> devuelven 401. Las credenciales inválidas y las ausentes devuelven exactamente
> el mismo error. No se filtra información al atacante sobre qué administradores
> existen. Eso no es ingeniería sofisticada; es una propiedad del diseño que
> el ciclo respeta y que los tests verifican.
>
> Historia cuatro: integridad científica.
> El dataset tiene 57 variantes taxonómicas de roca; el ciclo las redujo a 42
> canónicas, corrigió typos de colectores, descartó columnas muertas con
> evidencia documentada. Sin calidad de datos, los resultados del sistema mienten.
> La fase de exploración — que puede parecer lenta o redundante — es la que
> evita que eso pase.

**Cita técnica**: fail-closed auth · 57 → 42 variantes canónicas · columnas muertas descartadas con evidencia

---

## Slide 16 · Anti-patrones
**Duración**: 1 min 30 s
**Acción en pantalla**: mantener el slide; enumerar cada anti-patrón

> Seis errores comunes que este proceso evita — y que son más frecuentes
> de lo que parece.
>
> Promptear y rezar: pedir sin especificación ni verificación.
> Dejar que el agente haga todo sin revisar.
> Ignorar los datos reales — creerle al mock.
> Tests que solo pasan en el entorno controlado del agente.
> No definir qué es «listo» — nunca se termina porque no se midió.
> Mezclar modelos sin criterio — usar el mismo modelo para todo.
>
> Los fracasos no vienen del modelo. Vienen del proceso. Y por eso existe
> la política: porque el modo de fallar es conocido y controlable.

**Cita técnica**: anti-patrón 3 = historia 1 · anti-patrón 4 = historia 1 · los 6 cubiertos por el ciclo

---

## Slide 17 · Takeaways
**Duración**: 1 min 30 s
**Acción en pantalla**: mantener el slide

> Cinco conclusiones que quiero que se lleven.
>
> Una: el ciclo SDD implementa artículos concretos de la política —
> los mencionamos durante la charla — no es una abstracción que hay que
> adaptar, es un proceso que ya los cumple.
>
> Dos: la seguridad es una propiedad del proceso. Agente confinado al workspace,
> secretos fuera, review read-only, puertas humanas. No es un control adicional;
> es cómo el proceso está diseñado.
>
> Tres: los requisitos no funcionales — seguridad, rendimiento, disponibilidad —
> se desarrollan con el mismo ciclo disciplinado que una funcionalidad nueva.
> No hay atajos para «lo que no se ve».
>
> Cuatro: soberanía significa clasificar antes. Lo reservado no vive en el
> workspace del agente. El control principal es la clasificación previa del
> contenido, exactamente como piden las líneas 195 y 797 del documento.
>
> Cinco: cada fase produce la evidencia mínima que la política exige —
> y se genera automáticamente. Trazabilidad no es algo que se agrega después;
> es una propiedad por construcción.

**Cita técnica**: policy lines 450, 497, 654, 176 — repaso de 30 segundos

---

## Slide 18 · Próximo paso institucional
**Duración**: 2 min
**Acción en pantalla**: mantener el slide; mostrar los 3 pasos

> Esto funciona y está medido. La pregunta es: ¿dónde escala primero?
>
> La política ya traza el camino en el artículo 176.
> Paso uno: un piloto controlado. Un equipo, repos clasificados con datos
> de demostración, herramientas autorizadas. El entorno es real pero acotado.
>
> Paso dos: registro en el Anexo A de la matriz de herramientas. Qué agente,
> qué modelos, qué evidencias se generaron. Documentación completa, no
> inventario ad-hoc.
>
> Paso tres: evaluación por la DGI. Controles diferenciados según el nivel
> de autonomía y el riesgo del sistema intervenido. No es una aprobación
> general; es una evaluación específica de cada herramienta en cada contexto.
>
> Lo que vieron hoy no es un demo de laboratorio. Es un candidato evaluado
> con evidencia. Falta decidir dónde se aplica primero.

**Cita técnica**: art. 176 = asistente institucional · Anexo A = matriz de herramientas · evaluation by DGI

---

## Slide 19 · Gracias
**Duración**: variable (Q&A)
**Acción en pantalla**: mantener slide

> Muchas gracias.

[Si hay Q&A:]

**Preguntas preparadas — respuesta sugerida:**

**P: ¿Dónde corren estos agentes?**
> La infraestructura está en la máquina del desarrollador o en un entorno
> de desarrollo segregado — nunca en producción. La única base de datos visible
> es PostgreSQL de desarrollo con datos de catálogo. Los proveedores de modelos
> reciben fragmentos del workspace; las credenciales institucionales no cruzan.
> Eso está documentado en la línea 450 del documento y en el diagrama de
> soberanía que vimos en el slide 9.

**P: ¿Quién es responsable cuando el agente comete un error?**
> El humano que aprobó la propuesta y el spec. El agente es una herramienta
> de apoyo — la política lo dice en el artículo 4 y el diseño del ciclo lo
> implementa: cada fase tiene una puerta humana que el agente no puede saltar.
> La trazabilidad está en los artefactos: el expediente completo de cada cambio
> deja constancia de qué se aprobó, qué se implementó y qué se verificó.

**P: ¿Qué pasa si el proveedor de modelos cae durante el ciclo?**
> El ciclo tiene un mecanismo de recuperación: si un agente devuelve output vacío
> — que es el patrón que más vimos en los ensayos — el orquestador no reintenta
> infinitamente. Abre una sesión nueva, recupera los artefactos de la fase
> anterior desde los archivos, y retoma desde donde quedó. La documentación
> lo llama latch del dispatcher: un fallo de transporte no destruye el trabajo.

**P: ¿Cuánto cuesta en tokens?**
> El costo es una decisión de arquitectura, no una sorpresa. Cada fase usa
> un modelo asignado por perfil: modelos económicos para explorar y listar
> tareas, modelos potentes solo para diseño. El ensayo 3 midió el ciclo
> completo en 28 minutos 38 segundos sin cortes — la economía de tokens
> está medida, no prometida.

**P: ¿Cómo se aseguran de que los datos de entrenamiento del proveedor no
se usen con nuestros datos?**
> Las cláusulas de contratación de la línea 189 establecen: no entrenamiento
> con los datos del cliente, subencargados debidamente contratados, y
> eliminación certificada. Eso es una condición contractual del proveedor,
> no una propiedad técnica de la herramienta. Gentle-AI, que es la herramienta
> que orquesta el ciclo, es código abierto bajo licencia MIT — auditable,
> sin dependencia de un proveedor específico.

**P: ¿Y si el agente accede a algo que no debería?**
> El agente está confinado al directorio del proyecto. No tiene permisos
> de escritura sobre producción, ni acceso a redes institucionales, ni a bases
> de datos fuera del entorno de desarrollo. Si una credencial vive en el
> workspace — que es un error de configuración, no de la herramienta — el
> patrón fail-closed de la autenticación la bloquea en vez de filtrarla.
> Esto es exactamente lo que ordena la línea 450 del documento.

**P: ¿Qué tan portable es esto a otras herramientas?**
> El ciclo SDD no depende de una herramienta específica. El stack que vieron —
> Gentle-AI — funciona con OpenCode, Claude Code, Pi, Gemini CLI, entre otros.
> El flujo de trabajo se transporta entre agentes; no está atado a uno.
> El spec, los artefactos y los tests son archivos plain-text en el repositorio —
> no formato propietario de ningún proveedor.
