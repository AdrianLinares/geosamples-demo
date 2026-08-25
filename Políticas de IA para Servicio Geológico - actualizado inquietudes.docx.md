

**POLÍTICA INTEGRAL PARA LA GOBERNANZA, GESTIÓN, DESARROLLO, USO RESPONSABLE Y SOBERANO DE LA INTELIGENCIA ARTIFICIAL**

**Servicio Geológico Colombiano (SGC)**

Versión propuesta para revisión institucional  
Bogotá, D. C.  
Junio 24 de 2026

## **Tabla de contenido**

[Control del documento	3](#control-del-documento)

[Declaración institucional	3](#declaración-institucional)

[Marco de referencia normativo y técnico	3](#marco-de-referencia-normativo-y-técnico)

[Objetivo general	4](#objetivo-general)

[Objetivos específicos	4](#objetivos-específicos)

[Estructura de la política	4](#estructura-de-la-política)

[1\. Disposiciones generales, alcance y principios	5](#1.-disposiciones-generales,-alcance-y-principios)

[2\. Soberanía de la información, gobierno y ciclo de vida del dato	8](#2.-soberanía-de-la-información,-gobierno-y-ciclo-de-vida-del-dato)

[3\. Gobernanza institucional, portafolio y registro de soluciones	11](#3.-gobernanza-institucional,-portafolio-y-registro-de-soluciones)

[4\. Gestión de riesgos, evaluación de impacto y supervisión humana	14](#4.-gestión-de-riesgos,-evaluación-de-impacto-y-supervisión-humana)

[5\. Desarrollo, adquisición, seguridad, MLOps y operación	17](#5.-desarrollo,-adquisición,-seguridad,-mlops-y-operación)

[6\. Transparencia, explicabilidad, integridad científica y propiedad intelectual	20](#6.-transparencia,-explicabilidad,-integridad-científica-y-propiedad-intelectual)

[7\. Uso de IA generativa, GeoAI y aplicaciones misionales	23](#7.-uso-de-ia-generativa,-geoai-y-aplicaciones-misionales)

[8\. Gestión del cambio, talento humano y cultura institucional	26](#8.-gestión-del-cambio,-talento-humano-y-cultura-institucional)

[9\. Roles, responsabilidades, prohibiciones e incidentes	29](#9.-roles,-responsabilidades,-prohibiciones-e-incidentes)

[10\. Seguimiento, indicadores, auditoría, excepciones y actualización	32](#10.-seguimiento,-indicadores,-auditoría,-excepciones-y-actualización)

[Anexos del Documento	35](#anexos-del-documento)

[Anexo A. Matriz mínima del Registro Institucional de Soluciones de IA	35](#anexo-a.-matriz-mínima-del-registro-institucional-de-soluciones-de-ia)

[Anexo B. Lista de chequeo para paso a producción	36](#anexo-b.-lista-de-chequeo-para-paso-a-producción)

[Anexo C. Matriz RACI resumida	37](#anexo-c.-matriz-raci-resumida)

[Anexo D. Indicadores mínimos	38](#anexo-d.-indicadores-mínimos)

[Anexo E. Referencias normativas y técnicas	39](#anexo-e.-referencias-normativas-y-técnicas)

[Anexo F. Glosario operativo de inteligencia artificial	40](#anexo-f.-glosario-operativo-de-inteligencia-artificial)

## **Control del documento** {#control-del-documento}

| Título | Política Integral para la Gobernanza, Gestión, Desarrollo, Uso Responsable y Soberano de la Inteligencia Artificial |
| :---- | :---- |
| Entidad | Servicio Geológico Colombiano |
| Versión | 2.0 \- propuesta profundizada |
| Estado | Documento de trabajo para revisión técnica, jurídica e institucional |
| Responsable de coordinación | Dirección de Gestión de la Información |
| Periodicidad de revisión | Bienal o extraordinaria ante cambios normativos, tecnológicos o de riesgo |

## **Declaración institucional** {#declaración-institucional}

El Servicio Geológico Colombiano reconoce la inteligencia artificial como un habilitador estratégico para fortalecer la investigación, la producción de conocimiento geocientífico, el monitoreo de amenazas, la evaluación del potencial del subsuelo, la gestión de información nuclear y radiactiva, la modernización administrativa y la divulgación científica. Su adopción deberá incrementar el valor público sin comprometer la soberanía de la información, la seguridad nacional, la integridad científica, los derechos fundamentales ni la responsabilidad humana.

La presente política toma como base el documento de “Política General de IA del SGC” previamente redactado por Juan Camilo Ortiz Cardona y lo profundiza mediante un conjunto de capítulos específicos. Cada capítulo contiene disposiciones operativas, controles, responsabilidades y evidencias mínimas, de manera que el documento funcione como instrumento de gobierno y no únicamente como declaración de principios.

La política se articula con la arquitectura empresarial y con el portafolio institucional de iniciativas IA/FOSS, particularmente con los proyectos de transición tecnológica, base geocientífica, ingesta inteligente, automatización, cómputo, búsqueda semántica, asistentes, visión artificial, modelado predictivo y alertas tempranas. Su aplicación será gradual, basada en riesgo y acompañada por gestión del cambio.

## **Marco de referencia normativo y técnico** {#marco-de-referencia-normativo-y-técnico}

La política se interpretará de conformidad con la Constitución Política; las normas de protección de datos personales, transparencia, acceso a la información, gestión documental, derechos de autor, contratación estatal, seguridad digital y Gobierno Digital; el Modelo Integrado de Planeación y Gestión; el CONPES 4144 de 2025; los lineamientos vigentes del Ministerio de Tecnologías de la Información y las Comunicaciones; el Modelo de Seguridad y Privacidad de la Información (MSPI) y los instrumentos internos aplicables del SGC.

Como referentes técnicos se considerarán, según pertinencia, ISO/IEC 42001 para sistemas de gestión de IA; ISO/IEC 27001 y familia relacionada para seguridad; ISO/IEC 23894 para gestión de riesgos de IA; buenas prácticas de gobierno de datos, MLOps, DevSecOps, ciencia abierta y estándares geoespaciales del Open Geospatial Consortium. Estos referentes no sustituyen la normativa colombiana ni las decisiones institucionales.

## **Objetivo general** {#objetivo-general}

Establecer un marco integral, obligatorio y verificable para gobernar el ciclo de vida de los datos y de los sistemas de inteligencia artificial en el Servicio Geológico Colombiano, garantizando soberanía de la información, seguridad, calidad, transparencia, supervisión humana, integridad científica, gestión de riesgos, sostenibilidad tecnológica y generación de valor público.

## **Objetivos específicos** {#objetivos-específicos}

* Alinear las iniciativas de IA con la misión, planeación, arquitectura empresarial y el portafolio institucional.

* Proteger los activos de información y asegurar residencia, jurisdicción, control y reversibilidad.

* Definir controles para datos, modelos, infraestructura, proveedores, operación e incidentes.

* Establecer una gobernanza clara con roles, decisiones, evidencias y rendición de cuentas.

* Promover uso responsable, explicable, seguro y científicamente válido de IA generativa, GeoAI y modelos predictivos.

* Fortalecer talento humano, cultura institucional, gestión del cambio y capacidades soberanas.

* Medir beneficios, riesgos, adopción y desempeño para orientar la mejora continua.

## **Estructura de la política** {#estructura-de-la-política}

El documento se organiza en diez capítulos. Los capítulos 1 a 3 establecen alcance, soberanía y gobernanza; los capítulos 4 a 7 regulan riesgos, desarrollo, transparencia y aplicaciones misionales; los capítulos 8 y 9 desarrollan cambio organizacional, responsabilidades, prohibiciones e incidentes; y el capítulo 10 define seguimiento, auditoría y actualización. Los anexos contienen instrumentos de aplicación.

## **1\. Disposiciones generales, alcance y principios** {#1.-disposiciones-generales,-alcance-y-principios}

Las disposiciones de este y los demás capítulos son de obligatorio cumplimiento y deberán interpretarse de forma articulada entre capítulos. Cada lineamiento incluye una regla, una orientación operativa y una evidencia mínima que permita verificar su implementación. La ausencia de una evidencia exigida deberá justificarse y gestionarse mediante el procedimiento de excepciones.

**1\. Objeto institucional.** La presente política establece el marco obligatorio para planear, adquirir, diseñar, desarrollar, entrenar, probar, desplegar, operar, supervisar y retirar sistemas de inteligencia artificial en el Servicio Geológico Colombiano.

Toda iniciativa deberá demostrar su contribución a la misión institucional, a los objetivos estratégicos, a la arquitectura empresarial y a la generación de valor público. La IA se entenderá como una capacidad institucional y no como una herramienta aislada de productividad individual.

**Resiliencia y continuidad institucional.** Ningún proceso crítico, científico, administrativo o de atención al ciudadano dependerá exclusivamente de una solución de inteligencia artificial. Toda solución deberá contar con mecanismos proporcionales de contingencia, continuidad, reversión y recuperación.

***Evidencia mínima:** Ficha de iniciativa, objetivo misional, población usuaria, beneficio esperado y alineación con planes institucionales.*

**2\. Ámbito de aplicación.** La política aplica a servidores públicos, contratistas, investigadores, proveedores, aliados, pasantes y terceros que utilicen o intervengan soluciones de IA a favor del SGC.

El cumplimiento será exigible tanto en ambientes productivos como en pruebas, pilotos, convenios, laboratorios, servicios en nube y herramientas personales usadas para actividades institucionales. Las obligaciones deberán incorporarse en contratos, convenios, acuerdos de confidencialidad y términos de referencia.

***Evidencia mínima:** Cláusula contractual o compromiso de cumplimiento y registro de usuarios autorizados.*

**3\. Cobertura del ciclo de vida.** Las disposiciones rigen desde la identificación de la necesidad hasta el archivo, retiro o desmantelamiento de la solución.

No se permitirá que un piloto evolucione a producción sin pasar por las revisiones de datos, riesgo, arquitectura, seguridad, validación científica, operación y continuidad definidas en esta política.

***Evidencia mínima:** Actas de aprobación por etapa y lista de chequeo de paso a producción.*

**4\. IA como apoyo y no sustitución del criterio experto.** Los sistemas de IA serán herramientas de apoyo y no sustituirán el juicio científico, técnico, jurídico o administrativo exigido por las funciones del SGC. Los productos que puedan afectar mapas de amenaza, alertas, conceptos científicos, decisiones sobre recursos del subsuelo o materiales nucleares deberán contar con validación humana competente y trazable.

***Evidencia mínima:** Identificación del revisor, fecha, criterios de validación y decisión final.*

**5\. Legalidad y finalidad.** El tratamiento de información y el uso de IA deberán tener una finalidad legítima, explícita, documentada y compatible con las competencias institucionales. Los datos no podrán reutilizarse para entrenar modelos o generar nuevos productos sin verificar la base jurídica, las restricciones de uso, los derechos de terceros y la compatibilidad con el propósito original de recolección.

***Evidencia mínima:** Matriz de finalidad, base jurídica y restricciones de reutilización.*

**6\. Proporcionalidad.** La complejidad tecnológica, el volumen de datos y el nivel de automatización deberán ser proporcionales al problema público que se pretende resolver. Antes de desarrollar IA se evaluarán alternativas más simples, reglas de negocio, analítica convencional o mejora de procesos. La IA solo se justificará cuando aporte beneficios verificables frente a esas alternativas.

***Evidencia mínima:** Análisis de alternativas y justificación técnica.*

**7\. Precaución científica.** Cuando exista incertidumbre significativa, falta de datos representativos o riesgo de daño institucional, se aplicará el principio de precaución. La solución podrá limitarse a laboratorio, entorno controlado o recomendación no vinculante hasta que exista evidencia suficiente sobre su desempeño, seguridad y aplicabilidad al dominio geocientífico.

***Evidencia mínima:** Registro de incertidumbres, restricciones de uso y condiciones de liberación.*

**8\. Transparencia y trazabilidad.** Toda solución deberá permitir reconstruir qué datos, modelo, versión, parámetros y controles intervinieron en un resultado relevante.

La trazabilidad abarcará fuentes, transformaciones, validaciones, despliegues, consultas, respuestas, cambios y decisiones humanas. Para sistemas generativos se conservarán, cuando sea procedente, versiones de prompts, fuentes recuperadas y configuración del modelo.

***Evidencia mínima:** Bitácoras, linaje, repositorio de versiones y registro de inferencias relevantes.*

**9\. Equidad y no discriminación.** Los sistemas no deberán producir exclusiones injustificadas, sesgos sistemáticos o tratamientos desiguales contrarios a derechos fundamentales.

Aunque muchos casos del SGC son técnicos, se evaluarán impactos territoriales, poblacionales y ambientales, especialmente cuando los resultados puedan influir en priorización de inversiones, divulgación de riesgo o acceso a servicios institucionales.

***Evidencia mínima:** Análisis de sesgos e impactos diferenciados.*

**10\. Sostenibilidad y reutilización.** Las soluciones deberán diseñarse para ser mantenibles, portables, documentadas y reutilizables.

Se privilegiarán componentes abiertos, estándares interoperables, arquitecturas desacopladas y repositorios institucionales, evitando prototipos dependientes de una persona, equipo o proveedor sin plan de continuidad.

***Evidencia mínima:** Arquitectura aprobada, manual técnico, repositorio y plan de soporte.*

**11\. Accesibilidad e inclusión.** Los productos de IA dirigidos a usuarios internos o externos deberán considerar accesibilidad, lenguaje claro y diversidad de capacidades.

Los asistentes, portales y visualizaciones deberán ofrecer mecanismos comprensibles de interacción, advertencias de limitación y canales alternativos cuando la automatización no sea adecuada.

***Evidencia mínima:** Pruebas de accesibilidad y validación con usuarios.*

**12\. Mejora continua.** La política será aplicada como un sistema de gestión susceptible de medición, auditoría y actualización.

Los hallazgos, incidentes, cambios regulatorios, avances tecnológicos y resultados de indicadores deberán traducirse en planes de mejora con responsables, plazos y seguimiento.

***Evidencia mínima:** Plan de mejora y actas de revisión periódica.*

## **2\. Soberanía de la información, gobierno y ciclo de vida del dato** {#2.-soberanía-de-la-información,-gobierno-y-ciclo-de-vida-del-dato}

La soberanía de la información, el gobierno y el ciclo de vida del dato constituyen el pilar normativo y técnico para el manejo seguro de los activos de información en la IA. La soberanía garantiza que los datos se almacenen y procesen respetando las leyes y fronteras jurisdiccionales correspondientes, mientras que el gobierno define las reglas de acceso, calidad y propiedad de la información. Finalmente, la gestión del ciclo de vida asegura un control estricto desde la recolección inicial del dato, pasando por su uso en el entrenamiento de modelos, hasta su eliminación segura.

**1\. Soberanía y control estatal.** Los datos y productos de información generados, custodiados o procesados por el SGC constituyen activos estratégicos del estado colombiano y deberán permanecer bajo control institucional.

El control comprende decisiones sobre captura, acceso, uso, almacenamiento, transferencia, reproducción, entrenamiento, publicación, conservación y eliminación. Ningún contrato podrá transferir de forma implícita derechos de uso secundario sobre estos activos.

***Evidencia mínima:** Inventario de activos, propietario del dato y reglas de uso.*

**2\. Residencia y jurisdicción.** La información clasificada, reservada, sensible o estratégica deberá procesarse preferentemente en infraestructura ubicada en Colombia y sometida a jurisdicción colombiana.

El uso de infraestructura extranjera requerirá evaluación jurídica, técnica y de seguridad, análisis de transferencias internacionales, cláusulas de no entrenamiento, subencargados identificados y mecanismos efectivos de auditoría, reversibilidad y eliminación certificada.

***Evidencia mínima:** Concepto jurídico, evaluación de riesgos y contrato con residencia y jurisdicción definidas.*

**3\. Prohibición de carga en servicios públicos.** No se incorporará en herramientas públicas, cuentas personales o servicios no autorizados código fuente institucional que contenga información reservada, secretos, credenciales, configuraciones internas, vulnerabilidades, reglas de negocio sensibles, direcciones de infraestructura, datos no públicos o componentes sujetos a restricciones de propiedad intelectual.

Podrán utilizarse fragmentos de código genérico, anonimizado, no sensible y no propietario en herramientas expresamente aprobadas por el SGC, siempre que previamente se eliminen credenciales, datos institucionales, referencias internas y cualquier elemento que permita reconstruir la arquitectura o lógica crítica de los sistemas.

El SGC promoverá la implementación de asistentes institucionales de programación en ambientes controlados, con repositorios autorizados, registro de uso, protección de propiedad intelectual y políticas de no entrenamiento con información institucional.

***Evidencia mínima:** Clasificación del código, herramienta autorizada, guía de anonimización y registro de excepciones o usos sensibles.*

***4\. Clasificación de información.** Todo conjunto de datos utilizado por IA deberá clasificarse antes de su procesamiento.*

La clasificación considerará información pública, interna, clasificada, reservada, datos personales, datos sensibles, secretos empresariales, propiedad intelectual, infraestructura crítica y conocimiento científico no publicado. El nivel asignado determinará el entorno y los controles.

***Evidencia mínima:** Etiqueta de clasificación y autorización del propietario del dato.*

**5\. Dueños, custodios y administradores.** Cada activo de datos deberá tener un dueño funcional, un custodio técnico y responsables de calidad claramente designados.

El dueño define finalidad, acceso, calidad y publicación; el custodio implementa almacenamiento, respaldo, seguridad y disponibilidad; los responsables de calidad gestionan reglas, excepciones y mejora.

***Evidencia mínima:** Matriz RACI del dato.*

**6\. Captura y adquisición.** La captura de datos para IA deberá realizarse con criterios de calidad, legalidad, representatividad y reproducibilidad.

Se documentarán método, instrumento, fecha, escala, sistema de referencia, incertidumbre, licencia, consentimiento cuando aplique y condiciones ambientales o técnicas que puedan afectar la interpretación.

***Evidencia mínima:** Ficha de adquisición y metadatos de origen.*

**7\. Almacenamiento y repositorios autorizados.** Los datos se almacenarán únicamente en repositorios institucionales o autorizados, con controles acordes a su clasificación.

Los repositorios deberán incluir respaldo, recuperación, cifrado, segregación, versionamiento, capacidad, retención, monitoreo y mecanismos para evitar copias dispersas no gobernadas.

***Evidencia mínima:** Arquitectura de almacenamiento y prueba de restauración.*

**8\. Procesamiento y linaje.** Toda transformación de datos deberá quedar documentada y ser reproducible.

Los pipelines registrarán entradas, salidas, reglas, código, versiones, errores, exclusiones, imputaciones y validaciones. Los datos derivados deberán conservar vínculo con sus fuentes y restricciones originales.

***Evidencia mínima:** Diagrama de linaje, código versionado y bitácora de ejecución.*

**9\. Calidad del dato.** Los datos destinados a IA deberán cumplir umbrales definidos de exactitud, integridad, consistencia, oportunidad, unicidad y validez.

Cada proyecto establecerá reglas de calidad medibles, responsables de corrección, tratamiento de valores faltantes y criterios para rechazar datasets que no permitan conclusiones confiables.

***Evidencia mínima:** Perfil de calidad y acta de aceptación del dataset.*

***10\. Metadatos y catalogación.** Los conjuntos de datos, modelos y productos deberán registrarse en catálogos institucionales con metadatos suficientes para su comprensión y reutilización.*

Se documentarán procedencia, propósito, cobertura, resolución, formato, licencia, restricciones, responsables, calidad, versión y relaciones con otros activos. Para información geoespacial se aplicarán estándares institucionales y nacionales vigentes.

***Evidencia mínima:** Registro en catálogo y ficha de metadatos.*

**11\. Interoperabilidad.** El intercambio de datos se realizará mediante estándares abiertos, APIs documentadas y mecanismos seguros.

Se privilegiarán estándares OGC, formatos abiertos, esquemas comunes, servicios autenticados y modelos de intercambio que reduzcan duplicidad y dependencia tecnológica. La interoperabilidad no implicará apertura indiscriminada.

***Evidencia mínima:** Contrato de API, esquema de intercambio y pruebas de interoperabilidad.*

**12\. Datos abiertos y publicación.** La publicación de datos y productos derivados de IA se realizará conforme a transparencia, acceso a información y restricciones legales.

Antes de publicar se verificará clasificación, anonimización, calidad, metadatos, licencia, contexto interpretativo y riesgo de inferencia. Los datos abiertos deberán ser comprensibles, reutilizables y acompañados de advertencias sobre limitaciones.

***Evidencia mínima:** Acta de publicación y ficha de datos abiertos.*

**13\. Retención, archivo y eliminación.** Los datos y registros de IA tendrán periodos de retención definidos y mecanismos seguros de archivo o eliminación.

La eliminación abarcará copias, respaldos, cachés, ambientes de prueba y datos en poder de proveedores. Cuando exista valor científico o probatorio, se conservarán versiones necesarias para reproducibilidad y auditoría.

***Evidencia mínima:** Tabla de retención y certificado de eliminación.*

**14\. Anonimización y minimización.** Solo se procesarán los datos estrictamente necesarios y se aplicarán técnicas de anonimización o seudonimización cuando corresponda. El objetivo de la anonimización y minimización es modificar los datos de entrenamiento de tal forma que ya no se consideren datos personales, también se busca reducir el riesgo limitando la información expuesta desde el inicio.

La eficacia de la anonimización deberá evaluarse frente a riesgos de reidentificación, especialmente al combinar datos espaciales, temporales o de comunidades. La minimización también aplicará a prompts, logs y telemetría.

***Evidencia mínima:** Evaluación de reidentificación y diseño de minimización.*

**15\. Uso secundario para entrenamiento.** El uso de datos institucionales para entrenar o ajustar modelos requerirá autorización expresa.

La autorización deberá precisar finalidad, versión del dataset, entorno, duración, responsables, derechos sobre el modelo resultante, restricciones de redistribución y condiciones de eliminación o reutilización.

***Evidencia mínima:** Acta de autorización de entrenamiento y registro del dataset.*

## **3\. Gobernanza institucional, portafolio y registro de soluciones** {#3.-gobernanza-institucional,-portafolio-y-registro-de-soluciones}

La gobernanza institucional, el portafolio y el registro de soluciones conforman el marco estructural que asegura un despliegue ético y alineado de la IA. La gobernanza define las políticas, roles de supervisión y comités éticos, mientras que el portafolio y el registro consolidan el inventario centralizado de todos los sistemas en desarrollo o producción. Este conjunto integral permite auditar la mitigación de riesgos, controlar el ciclo de vida de los modelos y garantizar la transparencia técnica ante regulaciones vigentes.

**1\. Gobierno multinivel.** La gobernanza de IA operará en niveles estratégico, táctico y operativo.

El nivel estratégico definirá prioridades y recursos; el táctico establecerá estándares y controles; el operativo ejecutará proyectos y asegurará evidencias. Las decisiones deberán quedar documentadas y evitar superposición de comités.

***Evidencia mínima:** Mapa de gobierno y calendario de sesiones.*

**2\. Comité Institucional de Gestión y Desempeño.** Esta instancia aprobará la política, las orientaciones estratégicas y los recursos de mayor impacto.

Recibirá reportes consolidados de riesgos, portafolio, indicadores e incidentes y resolverá desviaciones que comprometan objetivos institucionales o continuidad.

***Evidencia mínima:** Actas y decisiones de seguimiento.*

**3\. Mesa de Gobierno de TI.** La MGTI evaluará la alineación de las iniciativas con arquitectura empresarial, seguridad, datos, interoperabilidad y sostenibilidad.

Ningún sistema de riesgo medio o alto pasará a producción sin concepto favorable o condicionamientos explícitos de esta instancia.

***Evidencia mínima:** Concepto técnico y condiciones de aprobación.*

**4\. Comité o instancia de datos.** La instancia responsable de gobierno de datos aprobará propietarios, reglas de calidad, clasificación, acceso, metadatos y publicación.

Su intervención será obligatoria cuando el sistema integre datos de varias dependencias, utilice información estratégica o produzca nuevos activos derivados.

***Evidencia mínima:** Acta de aprobación del uso de datos.*

**5\. Registro Institucional de Soluciones de IA.** La DGI mantendrá un inventario único y actualizado de herramientas, modelos, servicios y componentes de IA.

El registro incluirá finalidad, responsables, proveedor, versión, entorno, datos, riesgo, estado, controles, evaluación de impacto, incidentes, costos, métricas y fecha de retiro. Se registrarán también soluciones experimentales si usan datos institucionales.

***Evidencia mínima:** Registro completo y revisión semestral.*

**6\. Ingreso al portafolio.** Toda iniciativa deberá presentar una ficha mínima antes de recibir recursos institucionales.

La ficha incluirá problema, valor público, usuarios, datos, técnica, dependencias, riesgos, presupuesto, recurso humano, cronograma, criterios de éxito y alternativa sin IA.

***Evidencia mínima:** Ficha aprobada y código de portafolio.*

**7\. Priorización.** El portafolio se priorizará por valor público, urgencia misional, madurez de datos, factibilidad, riesgo y costo total de propiedad.

Se evitará priorizar por novedad tecnológica. Los proyectos de geoamenazas, información estratégica o continuidad podrán recibir tratamiento especial, pero deberán cumplir controles equivalentes.

***Evidencia mínima:** Matriz de priorización y decisión motivada.*

**8\. Alineación.** Las iniciativas deberán vincularse con las capacidades de arquitectura empresarial o su evolución institucional.

La relación permitirá identificar dependencias entre implementación de software libre, base geocientífica, ingesta, automatización, cómputo, búsqueda semántica, asistentes, visión, predicción y alertas tempranas.

***Evidencia mínima:** Matriz de trazabilidad arquitectónica.*

**9\. Etapas de madurez.** Los proyectos se gestionarán por etapas: idea, evaluación, prototipo, piloto, preproducción, producción, mantenimiento y retiro.

Cada etapa tendrá criterios de entrada y salida. La existencia de un prototipo funcional no será evidencia suficiente de preparación para producción.

***Evidencia mínima:** Puertas de control y actas de avance.*

**10\. Gestión de beneficios.** Cada iniciativa deberá definir beneficios medibles y responsables de su realización.

Los beneficios podrán expresarse en reducción de tiempos, mejora de calidad, cobertura, oportunidad, disminución de riesgos, reutilización de conocimiento o fortalecimiento científico. Se medirán antes y después.

***Evidencia mínima:** Línea base, metas y reporte de beneficios.*  
**11\. Gestión de dependencias.** Los proyectos deberán identificar dependencias de datos, infraestructura, licencias, personas, proveedores y sistemas legados.

Las dependencias críticas tendrán acciones de mitigación, fechas y responsables. Se evitarán soluciones que requieran integraciones informales o accesos manuales permanentes.

***Evidencia mínima:** Mapa de dependencias y plan de mitigación.*

**12\. Arquitectura de referencia.** La DGI mantendrá patrones de arquitectura aprobados para IA generativa, visión, analítica predictiva, ingesta documental y GeoAI.

Los proyectos reutilizarán componentes comunes de autenticación, logging, catálogos, MLOps, almacenamiento y observabilidad, salvo justificación técnica.

***Evidencia mínima:** Diagrama de solución y desviaciones aprobadas.*

**13\. Gestión financiera.** El costo de IA se evaluará durante todo el ciclo de vida y no solo durante el desarrollo.

Se incluirán cómputo, almacenamiento, transferencia, soporte, seguridad, datos, etiquetado, licencias, reentrenamiento, monitoreo, formación y retiro. Los costos variables en nube deberán contar con límites y alertas.

***Evidencia mínima:** TCO (Costo total de propiedad, que contempla costos de adquisición y desarrollo, costos de operación ocultos y costos de mantenimiento y evolución) y el presupuesto plurianual (planificación financiera de varios años para garantizar la continuidad de las estrategias de IA).*

**14\. Puesta en producción.** La aceptación operativa requerirá responsable de soporte, niveles de servicio, monitoreo, continuidad, documentación y transferencia.

No se considerará entregado un proyecto que funcione únicamente en el equipo del desarrollador o dependa de credenciales personales.

***Evidencia mínima:** Acta de puesta en producción y catálogo de servicio.*

**15\. Retiro del portafolio.** Las soluciones sin valor, inseguras, obsoletas o duplicadas deberán suspenderse o retirarse ordenadamente.

El retiro incluirá justificación del retiro, exportación de datos, conservación de evidencias, revocación de accesos, eliminación segura y actualización del registro.

***Evidencia mínima:** Plan y acta de retiro.*

## **4\. Gestión de riesgos, evaluación de impacto y supervisión humana** {#4.-gestión-de-riesgos,-evaluación-de-impacto-y-supervisión-humana}

La gestión de riesgos, evaluación de impacto y supervisión humana configuran el blindaje operativo y ético indispensable para el despliegue seguro de la IA. La gestión de riesgos identifica y mitiga proactivamente amenazas técnicas, sesgos y fallas operativas antes de que afecten a la organización. Complementariamente, la evaluación de impacto mide de forma anticipada los efectos del sistema sobre los derechos fundamentales, la privacidad y la sociedad. Finalmente, la supervisión humana garantiza que un operador calificado mantenga el control del ciclo de vida del modelo, interviniendo o desactivando el sistema ante decisiones automatizadas erróneas.

**1\. Enfoque basado en riesgo.** La intensidad de los controles será proporcional al impacto potencial de la solución. La clasificación considerará criticidad del proceso, sensibilidad de datos, autonomía, alcance de usuarios, reversibilidad, consecuencias de error y exposición pública.

***Evidencia mínima:** Matriz de riesgo aprobada.*

**2\. Riesgo bajo.** Se consideran de bajo riesgo los usos de apoyo con información pública y sin incidencia directa en decisiones o productos finales. Incluyen traducción, borradores, ideación y consultas generales. Aun así, el usuario deberá verificar resultados y respetar propiedad intelectual y confidencialidad.

***Evidencia mínima:** Declaración de uso cuando sea sustancial.*

**3\. Riesgo medio.** Son de riesgo medio los sistemas que apoyan análisis técnicos o procesos internos sin emitir decisiones finales. Requerirán documentación, trazabilidad, pruebas, supervisión humana y controles de datos. Ejemplos: clasificación documental, extracción OCR, generación de código y análisis preliminar. 

La generación de código mediante asistentes o agentes de IA se clasificará inicialmente como riesgo medio. El nivel deberá elevarse cuando el código intervenga sistemas críticos, información clasificada o reservada, infraestructura, autenticación, autorización, seguridad, procesamiento científico de alto impacto, geoamenazas, alertamiento, sistemas nucleares o procesos cuya falla pueda afectar significativamente la misión institucional. 

***Evidencia mínima:** Informe de pruebas y responsable de validación.*

**4\. Riesgo alto.** Son de alto riesgo los sistemas que pueden afectar conocimiento científico, geoamenazas, alertas, recursos estratégicos, seguridad o derechos. Deberán contar con evaluación de impacto algorítmico, validación independiente, explicabilidad suficiente, continuidad, monitoreo intensivo y autorización formal para producción.

***Evidencia mínima:** Evaluación de impacto y aprobación de gobierno.*

**5\. Evaluación de impacto algorítmico.** Los sistemas de riesgo alto y los casos definidos por la MGTI deberán someterse a evaluación previa y periódica. La evaluación analizará propósito, actores afectados, datos, sesgos, errores, seguridad, explicabilidad, derechos, ambiente, continuidad, alternativas y controles.

***Evidencia mínima:** Informe de impacto, plan de tratamiento y concepto de aprobación.*

**6\. Riesgo científico.** Se evaluará el riesgo de conclusiones incorrectas, extrapolaciones indebidas, pérdida de contexto y falsa precisión. Los expertos del dominio definirán límites de aplicación, incertidumbre, escalas válidas, supuestos, comparadores y condiciones bajo las cuales el resultado no debe utilizarse.

***Evidencia mínima:** Protocolo de validación científica.*

***7\. Riesgo de datos.*** Se analizarán calidad, cobertura, representatividad, fuga entre entrenamiento y prueba, sesgos históricos y deriva. Los proyectos deberán documentar exclusiones, balance de clases, vacíos territoriales, cambios de instrumento y posibles efectos sobre desempeño.

***Evidencia mínima:** Reporte de datos y pruebas de sesgo.*

**8\. Riesgo de modelo.** Se evaluarán robustez, estabilidad, calibración, interpretabilidad, dependencia de parámetros y vulnerabilidad a manipulación. Los modelos se compararán contra líneas base y se probarán en condiciones normales, extremas y fuera de distribución cuando sea pertinente.

***Evidencia mínima:** Informe de validación del modelo.*

**9\. Riesgo generativo.** Los sistemas generativos deberán gestionar alucinaciones, inyección de prompts, fuga de contexto, contenido no autorizado y citas inexistentes. Se implementarán RAG con fuentes oficiales, filtros, límites de herramientas, validación de salidas y advertencias. Los asistentes no emitirán conceptos vinculantes.

***Evidencia mínima:** Pruebas adversariales y métricas de fidelidad a fuentes.*

**10\. Supervisión humana.** Cada sistema definirá quién revisa, en qué momento, con qué información y qué autoridad tiene para detener o corregir. La supervisión no será meramente nominal. El revisor deberá comprender límites del sistema, disponer de tiempo y contar con mecanismos para rechazar resultados.

***Evidencia mínima:** Matriz de supervisión y registro de decisiones.*

**11\. Botón de parada y reversión.** Los sistemas de riesgo medio y alto deberán permitir suspensión segura y reversión a procedimientos alternos. La entidad mantendrá mecanismos manuales o convencionales para continuar procesos críticos cuando la IA no esté disponible o sea insegura.

***Evidencia mínima:** Prueba de parada, procedimiento alterno y resultado de simulacro.*

**12\. Riesgo de terceros.** Los componentes externos, modelos base y servicios contratados deberán evaluarse como parte del riesgo total. Se revisarán procedencia, licencia, datos de entrenamiento conocidos, vulnerabilidades, subprocesadores, soporte, actualizaciones y cambios unilaterales.

***Evidencia mínima:** Evaluación de proveedor y SBOM (lista de materiales de software) cuando aplique.*

**13\. Aceptación del riesgo.** Los riesgos residuales deberán ser aceptados por la autoridad competente y no por el equipo técnico de manera informal. 

La aceptación indicará alcance, duración, controles compensatorios, métricas y fecha de revisión. Los riesgos intolerables impedirán el despliegue.

***Evidencia mínima:** Acta de aceptación o decisión de no despliegue.*

**14\. Reevaluación.** La clasificación y los riesgos se revisarán ante cambios de datos, modelo, proveedor, finalidad, alcance o entorno. También se reevaluarán después de incidentes, deterioro de métricas o cambios normativos.

***Evidencia mínima:** Registro de reevaluación y versión de la matriz.*

**15\. Comunicación del riesgo.** Los usuarios y responsables recibirán información clara sobre capacidades, limitaciones y uso autorizado. Las interfaces incluirán advertencias proporcionales al riesgo y canales para reportar resultados incorrectos.

***Evidencia mínima:** Material de usuario y registro de capacitación.*

## **5\. Desarrollo, adquisición, seguridad, MLOps y operación** {#5.-desarrollo,-adquisición,-seguridad,-mlops-y-operación}

El desarrollo, adquisición, seguridad, MLOps y operación definen el ciclo integral y seguro de las soluciones de IA dentro de una organización. El desarrollo y la adquisición norman si los modelos se crean internamente o se compran a terceros bajo estándares institucionales, mientras que la seguridad protege la infraestructura contra ciberataques y envenenamiento de datos. Por su parte, MLOps automatiza la integración y entrega continua de los modelos de aprendizaje automático. Finalmente, la operación asegura el monitoreo en producción, garantizando que el sistema mantenga su rendimiento técnico y estabilidad funcional a lo largo del tiempo.

**1\. Seguridad y privacidad por diseño.** Los controles de seguridad y privacidad se incorporarán desde la concepción de la solución. El modelado de amenazas, clasificación de datos, arquitectura de confianza, minimización, cifrado y gestión de identidades deberán definirse antes del desarrollo o contratación.

El diseño, desarrollo, adquisición y operación de soluciones de inteligencia artificial deberá observar los controles, dominios, mecanismos de gestión del riesgo y lineamientos establecidos en el MSPI vigente y en los instrumentos específicos de seguridad y privacidad para sistemas de inteligencia artificial expedidos por MinTIC.

***Evidencia mínima:** Modelo de amenazas y arquitectura de seguridad.*

**2\. Entornos segregados.** Desarrollo, pruebas, preproducción y producción deberán estar separados lógica o físicamente. Los datos reales no se usarán en desarrollo salvo autorización y controles. Las credenciales, llaves y secretos se administrarán en mecanismos institucionales.

***Evidencia mínima:** Diagrama de ambientes y gestión de secretos.*

**3\. Desarrollo seguro.** El código, notebooks, pipelines, prompts y configuraciones deberán mantenerse en repositorios institucionales con control de versiones. Se aplicaránaplicaran pruebas estáticas y dinámicas (DAST y SAST)plicarán revisión de código, análisis de dependencias, pruebas automáticas, control de ramas y trazabilidad de cambios. Se prohibirá almacenar secretos en código.

Cuando se utilicen asistentes o agentes de programación, se deberán aplicar los mismos controles al código generado por IA. Las modificaciones realizadas por agentes deberán ejecutarse preferentemente en ramas, workspaces, contenedores o entornos aislados y someterse a revisión mediante pull request o mecanismo equivalente antes de integrarse a la rama principal. Ningún agente dispondrá por defecto de permisos de escritura sobre producción ni de acceso irrestricto a secretos, infraestructura, bases de datos o redes institucionales. 

***Evidencia mínima:** Repositorio, evidencias CI/CD y revisión de código.*

**4\. Desarrollo humano verificable.** Todo componente de software institucional deberá contar con al menos una persona responsable capaz de explicar su propósito, arquitectura, dependencias, flujo principal, controles de seguridad y mecanismos de fallo, independientemente de la proporción del código generada mediante inteligencia artificial.

No podrá aceptarse para producción código cuya lógica crítica no pueda ser razonablemente comprendida, mantenida o auditada por el equipo responsable.

La utilización de IA no sustituye las competencias técnicas mínimas requeridas para desarrollar, revisar, aprobar u operar la solución.

***Evidencia mínima:** responsable técnico identificado, revisión de código, documentación técnica actualizada y aceptación del componente.* 

**54\. MLOps institucional.** Los modelos deberán gestionarse mediante prácticas de versionamiento, registro, despliegue, monitoreo y retiro. Cada versión relacionará dataset, código, hiperparámetros, métricas, responsable y entorno. El registro de modelos será la fuente autorizada para producción.

***Evidencia mínima:** Model registry y ficha de versión.*

**56\. Gestión de datasets.** Los datasets de entrenamiento, validación y prueba deberán estar versionados y separados. Se evitará contaminación entre conjuntos, se documentarán particiones y se conservarán versiones necesarias para reproducibilidad. Los datos de prueba representarán escenarios relevantes.

***Evidencia mínima:** Repositorio de datasets y hash de versiones.*

**76\. Pruebas funcionales y científicas.** La solución deberá superar pruebas técnicas, de seguridad, rendimiento, calidad y validación experta.

Las pruebas incluirán casos normales, extremos, errores de entrada, indisponibilidad de servicios y escenarios de abuso. Los criterios de aceptación serán definidos antes de ejecutar.

Cuando el código haya sido generado o modificado mediante IA, las pruebas deberán diseñarse de forma independiente de la generación original siempre que la criticidad lo amerite. No se considerará evidencia suficiente solicitar al mismo agente que genere el código, genere sus pruebas y determine por sí mismo que la solución es correcta. 

***Evidencia mínima:** Plan, resultados y acta de aceptación.*

**87\. Ciberseguridad de modelos.** Se gestionarán amenazas específicas como envenenamiento de datos, extracción de modelo, evasión, manipulación de prompts y cadena de suministro. Los controles incluirán acceso mínimo, validación de entradas, firmas, verificación de artefactos, monitoreo de comportamiento y actualización segura.

Para agentes de programación se evaluarán adicionalmente riesgos asociados con ejecución de comandos, modificación masiva de archivos, acceso a red, instalación automática de dependencias, ejecución de scripts, exposición de secretos, manipulación del pipeline CI/CD, modificación de infraestructura como código y acciones inducidas por instrucciones maliciosas presentes en repositorios, archivos o dependencias.

***Evidencia mínima:** Pruebas de seguridad y plan de tratamiento.*

**98\. Cifrado y comunicaciones.** La información se cifrará en tránsito y en reposo según su clasificación.  
Las APIs utilizarán autenticación robusta, certificados administrados, límites de consumo y registros de acceso. Las excepciones deberán ser justificadas y temporales.

***Evidencia mínima:** Configuración criptográfica y prueba de conexión segura.*

**109\. Observabilidad.** Los sistemas deberán contar con métricas, logs, trazas y alertas suficientes para operación y auditoría. Se monitorearán disponibilidad, latencia, errores, consumo, deriva, calidad, uso indebido y seguridad. Los logs no deberán exponer datos sensibles innecesarios.

El monitoreo deberá incluir eventos específicos de IA, tales como tasas de alucinación, fidelidad a fuentes, intentos de prompt injection, respuestas bloqueadas, fuga de contexto, sesgos detectados, manipulación de entradas y desviaciones del comportamiento esperado.

***Evidencia mínima:** Tablero operativo y política de logs.*

**110\. Gestión de cambios.** Todo cambio de modelo, prompt, dato, dependencia o infraestructura tendrá evaluación, aprobación y posibilidad de reversión. Los cambios urgentes se regularizarán posteriormente y no podrán convertirse en práctica habitual. Los usuarios serán informados cuando el cambio afecte resultados.

Para desarrollos asistidos sustancialmente por IA se deberá conservar trazabilidad suficiente que permita identificar la herramienta o agente utilizado, la persona responsable, los archivos modificados, las revisiones realizadas y las pruebas asociadas. No será obligatorio conservar cada interacción trivial con el asistente cuando el control de versiones permita reconstruir adecuadamente la evolución del código, salvo que el nivel de riesgo requiera trazabilidad reforzada. 

***Evidencia mínima:** Solicitud de cambio y plan de reversa.*

**112\. Continuidad y recuperación.** Los procesos críticos no dependerán exclusivamente de IA y deberán disponer de procedimientos alternos. Se definirán objetivos de recuperación, respaldos, redundancia, pruebas de restauración y simulacros. La continuidad incluirá disponibilidad de personal conocedor.

***Evidencia mínima:** Plan de continuidad y resultados de prueba.*

**123\. Capacidad y rendimiento.** La infraestructura deberá dimensionarse para cargas geoespaciales, documentales, predictivas y generativas previstas. Se evaluarán GPU, CPU, memoria, almacenamiento, red, concurrencia y crecimiento. Los pilotos no deberán declararse productivos sobre recursos insuficientes.

***Evidencia mínima:** Prueba de carga y plan de capacidad.*

**134\. Infraestructura soberana.** El SGC priorizará infraestructura propia, nube privada o servicios con residencia, control y reversibilidad verificables. La selección considerará soberanía, costo total, sostenibilidad energética, soporte, interoperabilidad y capacidad de auditoría. Se evitará dependencia de servicios imposibles de replicar.

***Evidencia mínima:** Evaluación de arquitectura y plan de salida.*

**145\. Sostenibilidad ambiental y eficiencia computacional.** Las soluciones de inteligencia artificial deberán evaluar, de manera proporcional a su escala y nivel de consumo, el impacto ambiental asociado con su desarrollo, entrenamiento, despliegue y operación. 

Los proyectos deberán registrar, cuando sea técnica y contractualmente posible, el consumo estimado o medido de energía, uso de GPU y CPU, horas de procesamiento, almacenamiento, transferencias de datos, emisiones estimadas de carbono y consumo de agua asociado a la infraestructura utilizada.

En la selección de modelos e infraestructura se privilegiarán alternativas eficientes que mantengan niveles adecuados de calidad, seguridad y desempeño, evitando sobredimensionamiento, entrenamiento innecesario y operación permanente de recursos ociosos.

***Evidencia mínima:** ficha de consumo computacional y ambiental, criterios de selección tecnológica y acciones de optimización.*

**156\. Adquisición y proveedores.** Los contratos de IA deberán establecer propiedad, confidencialidad, no entrenamiento, niveles de servicio, seguridad, auditoría y salida. Se exigirán exportación de datos y modelos en formatos utilizables, eliminación certificada, notificación de incidentes, control de subcontratistas y límites a cambios unilaterales.

***Evidencia mínima:** Matriz contractual y cláusulas aprobadas.*

**167\. Software libre y componentes abiertos.** Se promoverá el uso de software libre y modelos abiertos cuando sean técnica, jurídica y económicamente adecuados. La adopción deberá evaluar licencias, comunidad, mantenimiento, seguridad y capacidades internas; software libre no significa ausencia de soporte o gobierno.

***Evidencia mínima:** Evaluación de alternativa y licencia.*

**178\. Paso a producción.** Solo se desplegarán soluciones que cumplan controles mínimos de arquitectura, datos, seguridad, pruebas, operación y soporte. La lista de chequeo será obligatoria y las excepciones deberán aprobarse formalmente con plazo de cierre.

***Evidencia mínima:** Lista de chequeo firmada y acta de producción.*

**189\. Mantenimiento y retiro.** La operación incluirá parches, reentrenamiento, recalibración, soporte, revisión de métricas y retiro seguro. Las soluciones sin responsable, sin datos actualizados o con desempeño degradado deberán suspenderse hasta corregir condiciones.

***Evidencia mínima:** Plan anual de mantenimiento y criterio de retiro.*

## **6\. Transparencia, explicabilidad, integridad científica y propiedad intelectual** {#6.-transparencia,-explicabilidad,-integridad-científica-y-propiedad-intelectual}

La transparencia, explicabilidad, integridad científica y propiedad intelectual constituyen el pilar ético, legal y reputacional que valida la confianza en los sistemas de IA. La transparencia y la explicabilidad aseguran que los algoritmos no operen como "cajas negras", permitiendo a usuarios y reguladores comprender la lógica detrás de cada decisión automatizada. Por su parte, la integridad científica garantiza el rigor técnico, la reproducibilidad de los experimentos y la ausencia de sesgos metodológicos durante la investigación. Finalmente, la propiedad intelectual norma la protección de los modelos desarrollados y el respeto a los derechos de autor de los datos utilizados para su entrenamiento.

**1\. Declaración de uso.** El uso sustancial de IA en productos institucionales deberá declararse de forma clara y proporcional. La declaración indicará herramienta, finalidad, alcance, intervención humana y limitaciones. No será necesario declarar usos triviales que no afecten contenido, salvo exigencia específica.

***Evidencia mínima:** Sección de declaración en el producto.*

**2\. Trazabilidad de fuentes.** Los resultados deberán vincularse con fuentes oficiales y verificables. Los sistemas RAG y asistentes citarán documentos recuperados; los modelos predictivos documentarán datasets y variables; las visualizaciones identificarán fecha y versión.

***Evidencia mínima:** Referencias, identificadores de fuente y linaje.*

**3\. Explicabilidad.** La explicación deberá ser suficiente para el nivel de riesgo y el tipo de usuario. En modelos complejos se combinarán explicaciones globales y locales, análisis de variables, incertidumbre y ejemplos. La explicación no podrá presentarse como certeza causal cuando solo exista asociación.

***Evidencia mínima:** Informe de explicabilidad y validación experta.*

**4\. Incertidumbre.** Los productos deberán comunicar incertidumbre, rangos de confianza, cobertura y limitaciones. Se evitarán mapas, puntajes o respuestas que aparenten precisión superior a la evidencia disponible. Cuando no sea posible cuantificar, se describirá cualitativamente.

***Evidencia mínima:** Sección de incertidumbre en el producto.*

**5\. Reproducibilidad.** La investigación y los análisis asistidos por IA deberán conservar elementos suficientes para reproducir resultados. Se registrarán versiones de datos, código, modelo, entorno, parámetros y decisiones de preprocesamiento, respetando restricciones de seguridad y propiedad.

***Evidencia mínima:** Paquete de reproducibilidad o expediente técnico.*

**6\. Validación por pares.** Los productos científicos de riesgo medio o alto serán revisados por expertos independientes del desarrollo. La revisión evaluará metodología, datos, interpretación, incertidumbre y consistencia con conocimiento geocientífico. Las discrepancias se documentarán.

***Evidencia mínima:** Concepto de revisión y respuesta a observaciones.*

**7\. Autoría y responsabilidad.** La IA no será reconocida como autora ni responsable de productos institucionales. La autoría corresponderá a personas que hayan realizado contribuciones intelectuales y asumido su responsabilidad. El uso de IA no exime de verificar exactitud, legalidad y originalidad.

***Evidencia mínima:** Declaración de contribuciones.*

**8\. Propiedad intelectual.** Antes de usar datos, código, modelos o contenidos de terceros se verificarán licencias y derechos. Los productos desarrollados para el SGC deberán tener régimen de propiedad y reutilización definido. Se evitará incorporar componentes que impidan distribuir o mantener la solución institucional.

***Evidencia mínima:** Inventario de licencias y concepto jurídico cuando aplique.*

**9\. Secretos y conocimiento no publicado.** El conocimiento científico no divulgado y la información estratégica se protegerán frente a extracción o reutilización no autorizada. Los proveedores y usuarios no podrán utilizar prompts, documentos o resultados para mejorar modelos externos. Se aplicarán controles de acceso y confidencialidad.

***Evidencia mínima:** Acuerdos de confidencialidad y controles técnicos.*

**10\. Contenido sintético.** Los textos, imágenes, audio o video sintéticos deberán identificarse cuando puedan confundirse con evidencia real. En divulgación científica se distinguirán ilustraciones generadas de fotografías, mapas o registros instrumentales. Se conservará el propósito pedagógico y la trazabilidad.

***Evidencia mínima:** Etiqueta de contenido sintético y fuente.*

**11\. No manipulación.** Se prohíbe utilizar IA para alterar, ocultar o fabricar evidencia científica, técnica o administrativa. Cualquier transformación legítima deberá documentarse y preservar el original. La manipulación engañosa dará lugar a actuaciones administrativas, contractuales o disciplinarias.

***Evidencia mínima:** Conservación de originales y bitácora de transformación.*

**12\. Comunicación pública.** Los mensajes públicos sobre IA deberán ser precisos, prudentes y comprensibles. No se anunciarán capacidades operativas antes de validación ni se atribuirán a la IA resultados que dependan de análisis humano. Las limitaciones y fase de madurez serán explícitas.

***Evidencia mínima:** Revisión de comunicaciones y ficha pública.*

**13\. Derecho a información.** Las personas afectadas por decisiones apoyadas en IA podrán recibir información sobre el uso del sistema y los canales de revisión. Cuando no sea posible revelar detalles por seguridad o reserva, se suministrará explicación funcional suficiente y se garantizará revisión humana.

***Evidencia mínima:** Procedimiento de atención y registro de solicitudes.*

**14\. Publicación responsable.** El código, modelos o datasets solo se abrirán después de evaluar seguridad, reserva, licencias y riesgo de uso indebido. La apertura podrá ser parcial, anonimizada o acompañada de restricciones y documentación. El principio de ciencia abierta se armonizará con protección de activos estratégicos.

***Evidencia mínima:** Concepto de publicación y licencia.*

**15\. Conservación del expediente.** Los sistemas relevantes deberán mantener un expediente técnico y científico completo. El expediente reunirá aprobaciones, datos, pruebas, versiones, incidentes, cambios, validaciones, declaraciones y decisiones de retiro.

***Evidencia mínima:** Expediente en repositorio institucional.*

## **7\. Uso de IA generativa, GeoAI y aplicaciones misionales** {#7.-uso-de-ia-generativa,-geoai-y-aplicaciones-misionales}

El uso de IA generativa, GeoAI y aplicaciones misionales define el despliegue estratégico y especializado de tecnologías avanzadas para cumplir los objetivos centrales de una organización. La IA generativa automatiza la creación de contenido, código y soluciones personalizadas, mientras que la GeoAI integra el aprendizaje automático con datos geoespaciales para analizar patrones territoriales complejos. Finalmente, las aplicaciones misionales vinculan directamente estas herramientas con las funciones esenciales e insustituibles de la entidad, transformando los datos analíticos en decisiones de alto impacto que optimizan la entrega de valor público o empresarial.

**1\. Usos autorizados de IA generativa.** La IA generativa podrá apoyar redacción, síntesis, programación, búsqueda y asistencia, según la clasificación del entorno. El usuario deberá verificar contenido, referencias, cifras y compatibilidad con políticas institucionales. Los borradores no se convertirán automáticamente en documentos oficiales.

***Evidencia mínima:** Registro de herramienta y declaración cuando aplique.*

**2\. RAG institucional.** Los asistentes sobre conocimiento del SGC deberán basarse preferentemente en recuperación aumentada con fuentes oficiales. El sistema controlará colecciones, permisos, vigencia documental, fragmentación, citas y abstención cuando no exista evidencia suficiente.

***Evidencia mínima:** Catálogo de fuentes, pruebas de recuperación y métricas de fidelidad.*

**3\. Prompts y contexto.** Los prompts institucionales relevantes serán tratados como activos configurables y versionados. Se documentarán propósito, restricciones, plantillas, pruebas y cambios. No se incluirán secretos o datos no autorizados en contexto.

***Evidencia mínima:** Repositorio de prompts y control de versiones.*

**4\. Agentes y herramientas.** Los agentes que ejecuten acciones tendrán permisos mínimos, límites y confirmación humana en operaciones sensibles. No podrán modificar datos oficiales, enviar comunicaciones, publicar servicios o ejecutar cambios de infraestructura sin controles de autorización y registro.

***Evidencia mínima:** Matriz de herramientas y permisos.*

**5\. Modelos locales.** Los modelos locales o de código abierto deberán someterse a evaluación de licencia, seguridad, desempeño y recursos. Se validará su comportamiento en español, terminología geocientífica, seguridad y capacidad de actualización. La descarga de modelos se hará desde fuentes verificadas.

***Evidencia mínima:** Ficha del modelo y hash del artefacto.*

**6\. GeoAI.** Los modelos geoespaciales deberán respetar escala, resolución, sistema de referencia, autocorrelación y dependencia espacial. Las particiones de entrenamiento y prueba evitarán fuga espacial; los resultados incluirán incertidumbre y no se extrapolarán fuera del dominio validado.

***Evidencia mínima:** Protocolo de validación espacial.*

**7\. Visión por computador.** Los proyectos con imágenes geológicas, petrográficas, satelitales o instrumentales deberán controlar calidad de captura y etiquetado. Se documentarán equipos, iluminación, resolución, preprocesamiento, sesgos de observador y desempeño por clase. La validación humana será obligatoria en usos científicos.

***Evidencia mínima:** Manual de captura, dataset etiquetado y matriz de confusión.*

**8\. Modelos predictivos.** Los modelos de prospectividad, amenaza o comportamiento geocientífico deberán compararse con métodos base y conocimiento experto. Se evaluarán calibración, sensibilidad, especificidad, robustez, incertidumbre y aplicabilidad territorial o temporal. El resultado no se presentará como certeza.

***Evidencia mínima:** Informe comparativo y validación de expertos.*

**9\. Alertas tempranas.** La IA podrá apoyar detección y priorización, pero la emisión oficial de alertas críticas mantendrá supervisión humana y procedimientos establecidos. Se definirán umbrales, redundancia, latencia, falsos positivos, falsos negativos, escalamiento y contingencia. Los modelos no serán punto único de falla.

***Evidencia mínima:** Protocolo de alertamiento y simulacros.*

**10\. OCR e ingesta inteligente.** La extracción automática de documentos deberá combinar métricas de confianza, reglas de calidad y validación humana. Los errores se registrarán y utilizarán para mejora. Los documentos originales se conservarán y las entidades extraídas mantendrán vínculo con la página o región de origen.

***Evidencia mínima:** Métricas OCR, muestra validada y linaje documental.*

**11\. Código generado por IA.** El código generado deberá tratarse como código no confiable hasta ser revisado y probado. Se verificarán seguridad, licencias, dependencias, rendimiento y manejo de errores. No se ejecutará código desconocido con privilegios o datos sensibles.

***Evidencia mínima:** Revisión de código y pruebas.*

**12\. Desarrollo de software asistido por IA y Vibe Coding controlado.** El SGC podrá utilizar modelos generativos y agentes de programación para apoyar el diseño, generación, modificación, refactorización, documentación, prueba y análisis de código fuente. Se entenderá por Vibe Coding el enfoque mediante el cual una persona expresa mediante lenguaje natural las características o modificaciones esperadas de una solución y delega a sistemas de inteligencia artificial una parte sustancial de su implementación.  
Su utilización institucional deberá realizarse bajo un esquema controlado en el cual la responsabilidad técnica permanezca en personas identificadas y competentes. Ningún componente generado mediante IA podrá considerarse aceptado por el hecho de compilar, ejecutar o satisfacer visualmente el requerimiento solicitado.

Todo código generado o modificado sustancialmente mediante IA deberá incorporarse al ciclo institucional de desarrollo de software y cumplir los mismos o mayores controles aplicables al código desarrollado convencionalmente, incluyendo control de versiones, revisión humana, pruebas, análisis de seguridad, validación de dependencias, documentación, trazabilidad y aprobación previa a producción.

Se prohíbe utilizar esquemas de Vibe Coding autónomo para desplegar directamente en producción, modificar infraestructura productiva, manipular bases de datos institucionales, gestionar credenciales o intervenir sistemas críticos sin los controles técnicos y autorizaciones establecidos por la Entidad.

***Evidencia mínima:** identificación de la herramienta o agente utilizado; responsable humano del código; repositorio y commits asociados; pull request o mecanismo equivalente; pruebas ejecutadas; revisión humana; análisis de dependencias y seguridad; y registro de aprobación para integración o despliegue. * 

**123\. Divulgación y educación.** La IA en productos educativos deberá utilizar contenidos oficiales y validación temática. Los tutores virtuales no sustituirán certificaciones ni asesoría especializada; deberán remitir a expertos cuando la consulta exceda su alcance.

***Evidencia mínima:** Guía pedagógica y protocolo de escalamiento.*

**134\. Sistemas nucleares y laboratorios.** Los usos relacionados con materiales nucleares, radiológicos o laboratorios se someterán a controles reforzados. La IA no sustituirá protocolos regulatorios, metrológicos o de seguridad. Se limitarán accesos, se validarán resultados y se conservará trazabilidad completa.

***Evidencia mínima:** Evaluación específica y aprobación de responsables.*

**154\. Asistentes externos.** Los chatbots dirigidos al público deberán indicar que son sistemas automatizados y ofrecer canales humanos. Se limitarán a información publicada, no recopilarán datos innecesarios y se abstendrán de responder fuera de alcance o sobre información reservada.

***Evidencia mínima:** Aviso al usuario, pruebas de alcance y canal de escalamiento.*

**165\. Aplicación al portafolio actual.** Lakiy, GeoDanta, TDIG / Muestras de Zanja DMZ (Transformación Digital de Información Geocientífica), HDM (Huella Digital de Minerales) y demás iniciativas deberán adecuarse progresivamente a esta política. La adecuación priorizará registro, clasificación de riesgo, expediente técnico, gobierno de datos, seguridad, MLOps y transición operativa, reconociendo su nivel de madurez.

***Evidencia mínima:** Plan de brechas por proyecto.*

**176\. Asistente institucional de código.** La DGI evaluará la provisión de asistentes y agentes institucionales de programación operados en una zona segura institucional, destinados a apoyar scripts, SQL, notebooks, automatizaciones, pruebas, documentación y desarrollo de software, incluyendo modalidades de desarrollo mediante lenguaje natural o Vibe Coding controlado. La solución deberá permitir establecer controles diferenciados según el nivel de autonomía del agente y el riesgo del sistema intervenido.con controles de acceso, auditoría, aislamiento de datos y protección del código fuente.

Los agentes con capacidad de modificar archivos, ejecutar comandos, instalar dependencias, consultar repositorios o interactuar con herramientas externas operarán bajo el principio de mínimo privilegio. Las capacidades de acceso a red, ejecución, escritura, integración o despliegue deberán habilitarse explícitamente conforme al perfil del usuario y al entorno. 

***Evidencia mínima:** arquitectura de la zona segura; inventario de usuarios y perfiles autorizados; configuración de no entrenamiento y no retención del código institucional; registros de acceso y auditoría; lineamientos de uso seguro; pruebas de aislamiento y prevención de fuga de información; repositorio institucional de configuraciones y prompts; y acta de aprobación para entrada en operación.*

## **8\. Gestión del cambio, talento humano y cultura institucional** {#8.-gestión-del-cambio,-talento-humano-y-cultura-institucional}

La gestión del cambio, el talento humano y la cultura institucional representan el motor de transformación cultural y operativo indispensable para la adopción exitosa de la IA. La gestión del cambio mitiga la resistencia interna mediante estrategias de comunicación y acompañamiento durante la transición tecnológica. Asimismo, la gestión del talento humano se enfoca en el upskilling (enseñar nuevas habilidades a un empleado dentro de su misma área), el reskilling (capacitar a un empleado en habilidades totalmente diferentes para que pueda ocupar un puesto nuevo) y la atracción de perfiles técnicos especializados para cerrar la brecha digital. Finalmente, la cultura institucional evoluciona hacia una mentalidad impulsada por datos (*data-driven*), promoviendo la innovación continua, la colaboración interdisciplinaria y el uso ético y responsable de la inteligencia artificial.

**1\. Gestión del cambio obligatoria.** Todo proyecto de impacto medio o alto incorporará un plan de gestión del cambio. El plan abarcará actores, impactos, comunicaciones, formación, resistencia, adopción, soporte y medición. No se limitará a una capacitación final.

***Evidencia mínima:** Plan aprobado y responsable asignado.*

**2\. Análisis de interesados.** Se identificarán usuarios, expertos, responsables, afectados, opositores y aliados. El análisis considerará expectativas, influencia, capacidades y riesgos de adopción, con acciones diferenciadas por grupo.

***Evidencia mínima:** Mapa de interesados.*

**3\. Patrocinio directivo.** Los proyectos estratégicos deberán contar con patrocinador con autoridad para remover bloqueos y asignar recursos. El patrocinador comunicará propósito, legitimará cambios y realizará seguimiento a beneficios, no solo a entregables técnicos.

***Evidencia mínima:** Acta de patrocinio y reportes.*

**4\. Comunicación.** La comunicación será continua, transparente y adaptada a cada audiencia. Se explicará qué cambia, qué no cambia, beneficios, riesgos, responsabilidades, cronograma y canales de ayuda. Se evitarán mensajes que presenten la IA como sustitución indiscriminada de personas.

***Evidencia mínima:** Plan y piezas de comunicación.*

**5\. Formación por roles.** La capacitación se diseñará según responsabilidades y nivel de exposición. Directivos recibirán formación en gobierno y riesgo; científicos en validación y sesgos; desarrolladores en MLOps y seguridad; usuarios en uso responsable; jurídica y contratación en cláusulas y datos.

Los desarrolladores y responsables técnicos recibirán formación específica sobre programación asistida por IA, Vibe Coding controlado, diseño de prompts para desarrollo, revisión de código generado, seguridad de agentes, detección de errores lógicos, licenciamiento, dependencias, pruebas automatizadas, protección de información y criterios para determinar cuándo una tarea no debe ser delegada a un agente. 

***Evidencia mínima:** Malla curricular y registros de asistencia.*

**6\. Alfabetización general.** El SGC promoverá competencias básicas en IA, datos, seguridad, ética y verificación. Todos los colaboradores deberán reconocer riesgos de fuga, alucinaciones, derechos de autor, uso de cuentas personales y necesidad de supervisión.

***Evidencia mínima:** Curso institucional y evaluación.*

**7\. Perfiles especializados.** La entidad fortalecerá roles como arquitecto de datos, científico de datos, ingeniero MLOps, responsable de ética y experto de dominio. Los perfiles podrán cubrirse mediante planta, contratación o equipos compartidos, pero deberán tener funciones, competencias y continuidad definidas.

***Evidencia mínima:** Catálogo de perfiles y plan de fortalecimiento.*

**8\. Comunidades de práctica.** Se promoverán espacios para compartir patrones, código, datasets, lecciones y casos de uso. Las comunidades reducirán duplicidad, difundirán buenas prácticas y conectarán equipos misionales con DGI, seguridad, jurídica y planeación.

***Evidencia mínima:** Agenda, repositorio y productos de comunidad.*

**9\. Aprendizaje basado en proyectos.** La formación avanzada se vinculará con casos reales del SGC. Los ejercicios utilizarán datos autorizados, problemas acotados y entregables reutilizables, evitando capacitaciones genéricas sin transferencia institucional.

***Evidencia mínima:** Proyecto formativo y evaluación de competencias.*

**10\. Transferencia de conocimiento.** Contratistas y proveedores deberán transferir conocimiento técnico y funcional. La transferencia incluirá código, documentación, sesiones prácticas, operación, solución de fallas y evaluación de aprendizaje. No se aceptará como simple entrega de manuales.

***Evidencia mínima:** Plan, sesiones y acta de transferencia.*

**11\. Gestión de resistencia.** Las preocupaciones sobre empleo, calidad, control y carga de trabajo serán identificadas y tratadas. Se habilitarán espacios de escucha, pilotos participativos y ajustes de proceso. La resistencia se analizará como señal de riesgo o diseño insuficiente, no solo como oposición cultural.

***Evidencia mínima:** Registro de inquietudes y acciones.*

**12\. Diseño sociotécnico.** Los sistemas se diseñarán considerando procesos, personas, incentivos, normas y tecnología. La automatización no deberá trasladar cargas invisibles a expertos ni crear validaciones imposibles. Los procesos AS-IS y TO-BE se documentarán.

***Evidencia mínima:** Modelos de proceso y análisis de impacto laboral.*

**13\. Adopción y uso efectivo.** El éxito se medirá por uso correcto y beneficios, no por número de licencias o modelos desplegados. Se monitorearán usuarios activos, calidad, tiempo ahorrado, errores, abandono y satisfacción, diferenciando adopción superficial de integración real.

***Evidencia mínima:** Indicadores de adopción.*

**14\. Soporte al usuario.** Las soluciones tendrán canales de ayuda, documentación y escalamiento. El soporte deberá resolver dudas funcionales, incidentes, accesos y errores del modelo, con tiempos acordes a criticidad.

***Evidencia mínima:** Catálogo de soporte y SLA (Acuerdos de Nivel de Servicio).*

**15\. Reconocimiento y ética.** Se reconocerán contribuciones de equipos y se promoverá conducta responsable. Los incentivos no deberán favorecer velocidad sobre calidad u ocultamiento de errores. Reportar incidentes de buena fe será valorado como práctica de mejora.

***Evidencia mínima:** Mecanismos de reconocimiento y canal seguro de reporte.*

**16\. Evaluación del cambio.** Cada proyecto evaluará resultados de gestión del cambio y ajustará acciones. Se utilizarán encuestas, entrevistas, métricas de uso y observación de procesos. Los hallazgos alimentarán mejora y futuras implementaciones.

***Evidencia mínima:** Informe de adopción y lecciones aprendidas.*

## **9\. Roles, responsabilidades, prohibiciones e incidentes** {#9.-roles,-responsabilidades,-prohibiciones-e-incidentes}

Los roles, responsabilidades, prohibiciones e incidentes constituyen el marco de control conductual, operativo y de respuesta ante crisis en el despliegue de la IA. Este componente asigna con precisión las obligaciones y el nivel de autoridad de cada colaborador en el diseño y uso de los sistemas, al tiempo que establece restricciones explícitas y prohibiciones técnicas para mitigar el uso indebido o malintencionado de la tecnología. Finalmente, define los protocolos obligatorios de reporte, contención y remediación de incidentes, garantizando una reacción inmediata ante fallas del modelo, brechas de seguridad o sesgos que pongan en riesgo a la organización.

**1\. Responsabilidad indelegable.** La responsabilidad por decisiones y productos permanecerá en personas y dependencias competentes. Ninguna referencia al proveedor o al modelo eximirá al SGC de verificar resultados ni a los usuarios de cumplir funciones y controles.

***Evidencia mínima:** Asignación formal de responsable.*

**2\. Dirección de Gestión de la Información.** La DGI liderará lineamientos técnicos, arquitectura, registro, infraestructura, seguridad tecnológica y seguimiento. Coordinará con áreas misionales, Secretaría General, planeación, jurídica y control interno, sin asumir la responsabilidad científica de los productos.

***Evidencia mínima:** Plan de implementación y reportes.*

**3\. Dependencias misionales.** Las áreas usuarias responderán por finalidad, calidad de datos, validación científica, beneficios y riesgos operacionales. Deberán designar propietario de producto, dueño de dato y expertos validadores, y asegurar disponibilidad para acompañar el ciclo de vida.

***Evidencia mínima:** Designaciones y actas de validación.*

**4\. Secretaría General.** La Secretaría General articulará protección de datos, gestión documental, talento humano, contratación y gestión del cambio. Apoyará conceptos jurídicos, cláusulas, tratamiento de datos personales, retención documental y formación institucional.

***Evidencia mínima:** Conceptos y planes articulados.*

**5\. Oficina de Planeación.** Planeación integrará iniciativas con estrategia, MIPG, riesgos institucionales, indicadores y presupuesto. Verificará beneficios, metas y sostenibilidad, evitando que la IA opere como portafolio paralelo.

***Evidencia mínima:** Alineación en planes e indicadores.*

**6\. Control interno.** Las instancias de control evaluarán diseño y efectividad de controles según sus competencias. Podrán auditar registro, decisiones, evidencias, contratos, seguridad, calidad y cumplimiento de planes de mejora.

***Evidencia mínima:** Informes de auditoría.*  
**7\. Propietario de producto.** El propietario de producto responderá por alcance, usuarios, beneficios, priorización y continuidad. Aprobará requisitos y aceptación, gestionará cambios y será interlocutor principal con gobierno y operación.

***Evidencia mínima:** Ficha de rol y decisiones de producto.*

**8\. Dueño del dato.** El dueño del dato autorizará acceso, finalidad, calidad, clasificación, publicación y retención. No podrá delegarse de manera implícita en desarrolladores o proveedores.

***Evidencia mínima:** Acta de autorización.*

**9\. Responsable técnico y MLOps.** El responsable técnico garantizará arquitectura, código, despliegue, monitoreo y reproducibilidad. Mantendrá versiones, dependencias, documentación, seguridad y criterios de mantenimiento o retiro.

***Evidencia mínima:** Expediente técnico actualizado.*

**10\. Experto científico.** El experto científico validará pertinencia, metodología, límites, incertidumbre y uso de resultados. Deberá tener independencia suficiente para rechazar resultados o detener despliegues inseguros.

***Evidencia mínima:** Concepto de validación.*

**11\. Usuarios.** Los usuarios emplearán únicamente herramientas y casos autorizados. Deberán proteger información, verificar salidas, declarar usos sustanciales y reportar incidentes o resultados anómalos.

***Evidencia mínima:** Aceptación de lineamientos y capacitación.*

**12\. Prohibición de datos sensibles en herramientas públicas.** Se prohíbe cargar información no pública, personal, reservada, geocientífica no divulgada, nuclear, credenciales o código sensible en plataformas no autorizadas. La prohibición aplica, aunque el proveedor prometa no usar temporalmente los datos si no existe aprobación institucional.

***Evidencia mínima:** Controles y registro de incumplimientos.*

**13\. Prohibición de decisiones autónomas críticas.** Se prohíbe delegar de forma autónoma alertas, conceptos científicos, decisiones regulatorias o actuaciones que afecten derechos. La IA podrá recomendar o priorizar, pero deberá existir revisión humana competente y registro de la decisión.

***Evidencia mínima:** Matriz de decisiones y validación.*

**14\. Prohibición de cuentas personales.** Se prohíbe procesar información institucional mediante cuentas personales o servicios no contratados. Las cuentas autorizadas deberán administrarse institucionalmente y permitir revocación, auditoría y transferencia.

**15\. Prohibición de despliegue autónomo de código generado por IA.** Se prohíbe que asistentes o agentes de programación desplieguen directamente en ambientes productivos código generado o modificado mediante IA sin los controles de revisión, prueba, seguridad, aprobación y gestión de cambios definidos por la Entidad.

También se prohíbe otorgar a agentes permisos permanentes o innecesarios sobre credenciales, secretos, bases de datos productivas, infraestructura crítica, repositorios principales o mecanismos de despliegue, dichos permisos se deben asignar bajo el principio del mínimo privilegio.. 

***Evidencia mínima:** Inventario de cuentas y accesos.*

**156\. Prohibición de manipulación y fraude.** Se prohíbe fabricar evidencia, ocultar errores, falsificar citas o presentar resultados no validados como oficiales. Estas conductas podrán activar acciones disciplinarias, fiscales, contractuales o penales según corresponda.

***Evidencia mínima:** Preservación de evidencias y reporte.*

**176\. Gestión de incidentes.** Se consideran incidentes de inteligencia artificial, entre otros, las alucinaciones graves o reiteradas, los sesgos no controlados, la fuga o exposición de información, la inyección de prompts, el envenenamiento de datos, la manipulación de resultados, la alteración de modelos, el acceso indebido, la degradación significativa del desempeño, la generación de referencias inexistentes y el uso de la solución por fuera de su alcance autorizado.

***Evidencia mínima:** Ticket, análisis de causa y plan correctivo.*

**187\. Notificación y escalamiento.** Los incidentes relevantes se escalarán a seguridad, responsables del proceso, protección de datos, jurídica y directivos según impacto. Cuando exista afectación a titulares, terceros o servicios públicos se cumplirán obligaciones de notificación y comunicación.

***Evidencia mínima:** Matriz de escalamiento y registro de notificaciones.*

**198\. Lecciones aprendidas.** Todo incidente significativo generará acciones preventivas y actualización de controles. Las lecciones se compartirán sin exponer información sensible y alimentarán formación, pruebas y revisión de proveedores.

***Evidencia mínima:** Informe postincidente y seguimiento.*

## **10\. Seguimiento, indicadores, auditoría, excepciones y actualización** {#10.-seguimiento,-indicadores,-auditoría,-excepciones-y-actualización}

Seguimiento, indicadores, auditoría, excepciones y actualización conforman el mecanismo de mejora continua y control normativo para la sostenibilidad de la IA en el tiempo. El seguimiento constante, respaldado por indicadores técnicos y de negocio, permite evaluar el rendimiento y el impacto real de los modelos desplegados. Asimismo, las auditorías independientes garantizan que los sistemas cumplan con los estándares de seguridad y ética vigentes. Por último, este componente define el proceso formal para gestionar excepciones operativas justificadas y establece los canales para la actualización periódica de las políticas, adaptándolas ágilmente a la rápida evolución tecnológica y regulatoria.

**1\. Sistema de indicadores.** La implementación se medirá mediante indicadores de gobierno, riesgo, seguridad, adopción, desempeño y beneficios. Los indicadores tendrán definición, fuente, responsable, periodicidad y meta. Se evitarán métricas que incentiven cantidad de proyectos sin calidad.

***Evidencia mínima:** Ficha técnica de indicador.*

**2\. Indicadores mínimos.** Se medirán al menos soluciones registradas, evaluaciones de impacto, incidentes, usuarios capacitados, excepciones, modelos en producción, disponibilidad y cumplimiento de revisiones. Para proyectos se incluirán métricas científicas y de negocio apropiadas, no un conjunto uniforme sin contexto.

***Evidencia mínima:** Tablero institucional.*

**3\. Monitoreo de modelos.** Los sistemas en producción tendrán umbrales y alertas para desempeño, deriva, calidad y seguridad. El deterioro podrá activar revisión, reentrenamiento, restricción o suspensión. Los umbrales serán aprobados por responsables técnicos y científicos.

***Evidencia mínima:** Tablero y registro de alertas.*

**4\. Revisión periódica.** Cada solución será revisada al menos anualmente o con mayor frecuencia según riesgo. La revisión abarcará finalidad, datos, modelo, métricas, incidentes, costos, usuarios, proveedor, seguridad y continuidad.

***Evidencia mínima:** Informe anual de revisión.*

**5\. Auditoría.** Las soluciones y el sistema de gobierno podrán ser auditados por instancias internas o externas. La auditoría tendrá acceso a evidencias suficientes respetando reservas y seguridad. Los proyectos deberán conservar registros de manera organizada.

***Evidencia mínima:** Programa e informe de auditoría.*

**6\. Control de cumplimiento.** La DGI consolidará el estado de cumplimiento y planes de brecha. Las dependencias deberán responder hallazgos y demostrar cierre. La falta reiterada podrá dar lugar a suspensión de la solución.

***Evidencia mínima:** Matriz de cumplimiento y planes de acción.*

**7\. Excepciones.** Toda excepción a esta política será temporal, motivada, proporcional y aprobada por autoridad competente. La solicitud describirá necesidad, riesgos, controles compensatorios, duración, responsable y plan de cierre. No se aprobarán excepciones a obligaciones legales.

Cuando una dependencia requiera una herramienta de inteligencia artificial no suministrada o contratada por el SGC, podrá solicitar una autorización excepcional previa. La solicitud deberá justificar la necesidad técnica o científica, demostrar que no existe una alternativa institucional equivalente e identificar la información que será procesada.

Antes de autorizar su uso se evaluarán términos de servicio, tratamiento de datos, propiedad intelectual, residencia y transferencia internacional, entrenamiento del proveedor, seguridad, autenticación, eliminación de información, costos y posibilidad de auditoría.

La autorización deberá limitar el tipo de información, usuarios, finalidad, periodo y funcionalidades permitidas. En ningún caso podrá utilizarse información clasificada, reservada, sensible o estratégica sin controles institucionales equivalentes y aprobación expresa de las instancias competentes.

***Evidencia mínima:** Solicitud de excepción, evaluación jurídica y de seguridad, autorización temporal, inventario de usuarios y fecha de vencimiento.*

**8\. Gestión de vencimientos.** Las excepciones y autorizaciones temporales tendrán alertas y revisión antes de su vencimiento. La falta de renovación implicará suspensión o retorno a condiciones estándar.

***Evidencia mínima:** Registro de vencimientos.*

**9\. Seguimiento de proveedores.** El desempeño de proveedores se evaluará durante toda la vigencia contractual. Se revisarán niveles de servicio, incidentes, cambios, costos, seguridad, subcontratistas, portabilidad y cumplimiento de eliminación.

***Evidencia mínima:** Informe de proveedor y actas de seguimiento.*

**10\. Revisión de costos.** Los costos reales se compararán con proyecciones y beneficios. Se identificarán consumos anómalos, dependencia de GPU o nube, costos de egreso y necesidades de optimización o migración.

***Evidencia mínima:** Reporte financiero y acciones de optimización.*

**11\. Publicación de información de gobernanza.** El SGC divulgará información general sobre su uso de IA cuando sea legal y seguro. Podrá publicar principios, inventarios resumidos, evaluaciones de impacto, indicadores y mecanismos de queja, protegiendo detalles reservados.

***Evidencia mínima:** Informe público de transparencia algorítmica.*

**12\. Participación y retroalimentación.** La entidad habilitará mecanismos para recibir observaciones de usuarios, expertos y partes interesadas. La retroalimentación se analizará y podrá originar correcciones, nuevas pruebas o cambios de alcance.

***Evidencia mínima:** Registro y respuesta a observaciones.*

**13\. Revisión normativa.** La política se revisará al menos cada dos años o antes si cambian normativa, riesgos o tecnologías. La revisión considerará legislación colombiana, lineamientos MinTIC, protección de datos, seguridad digital, transparencia algorítmica y estándares internacionales aplicables.

***Evidencia mínima:** Informe de revisión normativa.*

**14\. Actualización controlada.** Las modificaciones seguirán el procedimiento institucional de aprobación y gestión documental. Se conservará historial de versiones, cambios, responsables, fecha de vigencia y plan de transición para soluciones existentes.

***Evidencia mínima:** Control de cambios y versión publicada.*  
**15\. Plan de implementación.** La adopción de esta política se ejecutará mediante hoja de ruta gradual. La hoja de ruta priorizará registro, clasificación de riesgos, adecuación de proyectos maduros, infraestructura soberana, MLOps, formación, contratos e indicadores.

***Evidencia mínima:** Plan de implementación con responsables y cronograma.*

**16\. Informe anual.** La DGI presentará un informe consolidado al Comité Institucional de Gestión y Desempeño. El informe incluirá portafolio, avances, beneficios, riesgos, incidentes, cumplimiento, recursos y decisiones requeridas.

***Evidencia mínima:** Informe anual aprobado.*

## **Anexos del Documento** {#anexos-del-documento}

### **Anexo A. Matriz mínima del Registro Institucional de Soluciones de IA** {#anexo-a.-matriz-mínima-del-registro-institucional-de-soluciones-de-ia}

| Campo | Contenido mínimo | Responsable de actualización |
| :---- | :---- | :---- |
| Identificación | Nombre, código, descripción, estado y versión | Propietario de producto |
| Finalidad | Problema, usuarios, beneficio y uso autorizado | Dependencia responsable |
| Tecnología | Tipo de IA, modelo, proveedor, licencia y componentes | Responsable técnico |
| Desarrollo asistido por IA | Herramienta/Agente utilizado, modalidad de uso, proveedor, nivel de autonomía. **Válido solo cuando la generación mediante IA haya sido sustancial para la solución.**   | Responsable técnico |
| Datos | Fuentes, clasificación, dueño, calidad y residencia | Dueño del dato |
| Riesgo | Nivel, evaluación de impacto, riesgos residuales y controles | Responsable de riesgo |
| Entorno | Desarrollo, prueba, preproducción, producción, local o nube | DGI |
| Responsables | Funcional, técnico, científico, seguridad, datos y operación | Propietario de producto |
| Aprobaciones | Conceptos y fechas de cada puerta de control | Secretaría técnica |
| Métricas | Desempeño, beneficio, adopción, disponibilidad y deriva | Equipo del proyecto |
| Incidentes | Fecha, impacto, causa, acciones y cierre | Seguridad/operación |
| Costos | Inversión, operación, consumo y costo total | Propietario/planeación |
| Retiro | Fecha, motivo, exportación, archivo y eliminación | DGI y dependencia |

# 

### **Anexo B. Lista de chequeo para paso a producción** {#anexo-b.-lista-de-chequeo-para-paso-a-producción}

☐ 1\. Caso de uso, alcance y beneficio aprobados.

☐ 2\. Solución inscrita en el Registro Institucional de IA.

☐ 3\. Clasificación de riesgo y evaluación de impacto completas.

☐ 4\. Datos autorizados, clasificados, catalogados y con calidad aceptada.

☐ 5\. Arquitectura y dependencias aprobadas.

☐ 6\. Seguridad por diseño, privacidad y modelado de amenazas ejecutados.

☐ 7\. Código, prompts, datos y modelos versionados en repositorios institucionales.

☐ 7A. Cuando se utilizó IA para generar o modificar código. Definir el responsable humano identificado y la evidencia de revisión del código generado.

☐ 8\. Pruebas funcionales, científicas, de seguridad, rendimiento y recuperación superadas.

☐ 8A. Si hay código generado mediante IA. Someter a análisis de seguridad, dependencias, secretos y licenciamiento conforme a su criticidad.

☐ 8B. Ningún componente crítico permanece en producción sin que el equipo responsable comprenda suficientemente su lógica, dependencias y mecanismo de fallo. 

☐ 9\. Supervisión humana, límites de uso y mecanismo de parada definidos.

☐ 10\. Métricas, umbrales, observabilidad y alertas configurados.

☐ 11\. Plan de continuidad, respaldo y reversión probado.

☐ 12\. Responsable operativo, soporte y niveles de servicio asignados.

☐ 13\. Documentación técnica, de usuario y expediente científico completos.

☐ 14\. Transferencia de conocimiento y capacitación realizadas.

☐ 15\. Contratos, licencias, propiedad intelectual y salida del proveedor validados.

☐ 16\. Plan de gestión del cambio y comunicación ejecutado.

☐ 17\. Aprobación formal de las instancias de gobierno.

☐ 18\. Fecha de revisión y criterios de retiro establecidos.

### **Anexo C. Matriz RACI resumida** {#anexo-c.-matriz-raci-resumida}

| Actividad | CIGD | MGTI | DGI | Área misional | Dueño del dato | Seguridad | Secretaría General |
| :---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Aprobar política | A | C | R | C | C | C | C |
| Priorizar portafolio | A | R | C | R | C | C | C |
| Aprobar arquitectura | I | A | R | C | C | C | I |
| Autorizar datos | I | C | C | C | A/R | C | C |
| Validar científicamente | I | C | C | A/R | C | I | I |
| Aprobar paso a producción | I | A | R | R | C | R | C |
| Gestionar incidentes | I | C | R | R | C | A/R | C |
| Actualizar registro | I | C | A/R | C | C | C | I |

Convenciones: R \= responsable de ejecutar; A \= accountable o responsable final; C \= consultado; I \= informado.

### **Anexo D. Indicadores mínimos** {#anexo-d.-indicadores-mínimos}

| Indicador | Fórmula o criterio | Periodicidad | Meta orientativa |
| :---- | :---- | :---- | :---- |
| Cobertura del registro | Soluciones registradas / soluciones identificadas | Trimestral | 100 % |
| Evaluaciones de impacto | Sistemas de alto riesgo con evaluación vigente / total alto riesgo | Semestral | 100 % |
| Incidentes | Número y severidad de incidentes de IA | Mensual | Tendencia decreciente |
| Capacitación | Usuarios capacitados / usuarios expuestos | Semestral | \>= 90 % |
| Cumplimiento de revisión | Soluciones revisadas en plazo / total programado | Anual | 100 % |
| Disponibilidad | Tiempo disponible / tiempo planificado | Mensual | Según criticidad |
| Deriva | Modelos fuera de umbral / modelos en producción | Mensual | 0 sin tratamiento |
| Beneficios | Beneficios realizados / beneficios comprometidos | Semestral | \>= 80 % |
| Excepciones vencidas | Excepciones vencidas sin cierre | Mensual | 0 |
| Transferencia | Proyectos con transferencia aceptada / proyectos cerrados | Trimestral | 100 % |
| Eficiencia computacional y ambiental \* | Consumo energético, horas GPU/CPU, emisiones o consumo de agua estimados por solución de impacto medio o alto | Semestral | Línea base y reducción progresiva |

\* No se recomienda fijar desde la política un límite uniforme de kilovatios o litros, porque los casos de OCR, GeoAI, modelamiento sísmico y asistentes generativos tienen cargas incomparablemente diferentes.

### **Anexo E. Referencias normativas y técnicas** {#anexo-e.-referencias-normativas-y-técnicas}

* Constitución Política de Colombia.

* Ley 1581 de 2012 y normas reglamentarias sobre protección de datos personales.

* Ley 1712 de 2014 sobre transparencia y acceso a la información pública.

* Ley 23 de 1982, Decisión Andina 351 de 1993 y demás normas aplicables de derecho de autor.

* Ley 594 de 2000 y lineamientos de gestión documental.

* Decreto 1078 de 2015, Decreto 767 de 2022 y demás disposiciones de Gobierno Digital.

* Decreto 1263 de 2022 y lineamientos de seguridad digital aplicables.

* CONPES 4144 de 2025, Política Nacional de Inteligencia Artificial.

* Resolución 02277 de 2025 del Ministerio TIC, en lo aplicable al Modelo de Seguridad y Privacidad de la Información.

* Lineamientos de MinTIC y de la Superintendencia de Industria y Comercio sobre IA, seguridad, privacidad y transparencia algorítmica.

* Modelo Integrado de Planeación y Gestión y políticas institucionales del SGC vigentes.

* ISO/IEC 42001: sistemas de gestión de inteligencia artificial.

* ISO/IEC 23894: gestión de riesgos de inteligencia artificial.

* ISO/IEC 27001 y familia relacionada: seguridad de la información.

* Reglamento (UE) 2024/1689 como referente internacional de enfoque basado en riesgo.

* Recomendación de la UNESCO sobre la Ética de la Inteligencia Artificial.

* Estándares del Open Geospatial Consortium aplicables a interoperabilidad geoespacial.


  ***Nota**. Antes de la aprobación final deberán verificarse la denominación, vigencia, numeración y aplicabilidad exacta de los actos administrativos internos del SGC, así como las versiones oficiales de manuales, políticas, procedimientos y formatos relacionados.*


### **Anexo F. Glosario operativo de inteligencia artificial** {#anexo-f.-glosario-operativo-de-inteligencia-artificial}

# 

**Acceso controlado.** Mecanismo mediante el cual el SGC limita el ingreso a datos, sistemas, modelos y servicios de inteligencia artificial de acuerdo con perfiles, roles y responsabilidades autorizadas.  
Debe aplicar los principios de mínimo privilegio, necesidad de conocer, segregación de funciones y autenticación segura. Todo acceso deberá quedar registrado para efectos de seguimiento, auditoría, investigación de incidentes y rendición de cuentas.

**Activo de información.** Conjunto de datos, documentos, bases de datos, modelos, algoritmos, código fuente, mapas, imágenes, registros o conocimiento que posee valor para el SGC. Los activos pueden tener naturaleza administrativa, científica, tecnológica, geográfica, geocientífica o estratégica. Cada activo deberá contar con un responsable, una clasificación de seguridad y controles proporcionales a su nivel de criticidad.

**Algoritmo.** Secuencia ordenada de instrucciones, reglas matemáticas o procedimientos computacionales utilizados para resolver un problema o producir un resultado. En inteligencia artificial, los algoritmos permiten identificar patrones, clasificar información, generar predicciones o producir contenidos. Su utilización institucional debe ser documentada, validada y sometida a controles de calidad, seguridad, transparencia y trazabilidad.

**Alucinación de inteligencia artificial.** Resultado generado por un sistema de IA que parece coherente o convincente, pero que contiene información falsa, inventada, imprecisa o no respaldada por fuentes verificables. Este fenómeno es especialmente relevante en modelos generativos y asistentes conversacionales. Los productos obtenidos mediante IA deberán ser revisados por personal competente antes de ser utilizados en documentos, decisiones o productos oficiales.

**Anonimización.** Proceso técnico mediante el cual se transforman datos personales o sensibles para impedir que una persona pueda ser identificada directa o indirectamente. La anonimización debe ser irreversible o reducir razonablemente el riesgo de reidentificación, teniendo en cuenta las tecnologías disponibles. Su aplicación será obligatoria cuando se requiera utilizar información personal en análisis, pruebas, intercambio de datos o entrenamiento de modelos.

**API — Interfaz de Programación de Aplicaciones.** Conjunto de reglas y mecanismos que permite que diferentes aplicaciones, sistemas o servicios intercambien información y ejecuten funciones de manera controlada. En la arquitectura del SGC, las API facilitan la interoperabilidad entre bases de datos, modelos de IA, sistemas geográficos y aplicaciones institucionales. Toda API deberá incorporar autenticación, autorización, cifrado, documentación, control de versiones y monitoreo de uso.

**Arquitectura empresarial.** Disciplina que permite alinear la estrategia, los procesos, la información, las aplicaciones, la tecnología y la seguridad de una organización. En el SGC, orienta la integración de los proyectos de IA con las capacidades institucionales, la misión científica y la planeación tecnológica. Su aplicación evita soluciones aisladas, duplicidad de esfuerzos, dependencia de proveedores y crecimiento tecnológico desordenado.

**Auditoría algorítmica.** Proceso sistemático de evaluación de un modelo o sistema de IA para verificar su funcionamiento, legalidad, seguridad, precisión, transparencia y ausencia de comportamientos indebidos.  
Puede incluir revisión de datos, código, métricas, resultados, sesgos, documentación, trazabilidad y controles humanos. Las soluciones de riesgo alto deberán estar sujetas a auditorías periódicas realizadas por equipos independientes o técnicamente competentes.

**Base de datos geocientífica.** Repositorio estructurado que almacena información relacionada con geología, geofísica, geoquímica, hidrogeología, recursos minerales, amenazas geológicas y demás disciplinas del SGC. Debe garantizar integridad, calidad, metadatos, referencias espaciales, control de versiones y trazabilidad de las modificaciones. Su consolidación constituye un componente esencial para el entrenamiento y operación confiable de modelos de GeoAI.

**Calidad del dato.** Grado en que un conjunto de datos es exacto, completo, consistente, actualizado, oportuno, válido y adecuado para el propósito para el cual será utilizado.  
La calidad deberá evaluarse antes de usar información en procesos analíticos, científicos o de entrenamiento de modelos. Los datos deficientes pueden producir errores, sesgos, resultados científicos incorrectos y decisiones institucionales inadecuadas.

**Catálogo de datos.** Inventario organizado que permite identificar, describir, localizar y comprender los conjuntos de datos disponibles dentro de una organización.  
Debe incluir metadatos, responsables, clasificación, restricciones de acceso, calidad, formatos, origen y condiciones de uso. En el SGC, el catálogo facilita la reutilización, interoperabilidad, gobernanza y descubrimiento de información geocientífica.

**Ciberseguridad de inteligencia artificial.** Conjunto de medidas destinadas a proteger datos, modelos, algoritmos, infraestructuras y servicios de IA frente a ataques, manipulación, pérdida o acceso no autorizado. Comprende amenazas como fuga de información, envenenamiento de datos, robo de modelos, prompt injection y alteración de resultados. Los controles deberán aplicarse durante todo el ciclo de vida de la solución y no únicamente durante su operación.

**Ciclo de vida de la inteligencia artificial.** Conjunto de etapas por las que atraviesa una solución de IA desde la identificación de la necesidad hasta su retiro definitivo.  
Incluye planeación, diseño, adquisición, preparación de datos, desarrollo, entrenamiento, validación, implementación, monitoreo, mantenimiento y desmantelamiento. Cada etapa deberá contar con responsables, evidencias, controles, criterios de aprobación y mecanismos de gestión de riesgos.

**Ciclo de vida del dato.** Secuencia de actividades que comprende la creación, captura, recepción, clasificación, almacenamiento, procesamiento, uso, intercambio, conservación y eliminación de los datos.  
Su gestión debe garantizar calidad, seguridad, trazabilidad, disponibilidad y cumplimiento normativo en cada fase. Los sistemas de IA deberán integrarse con este ciclo y respetar las reglas institucionales de archivo y gestión documental.

**Clasificación de la información.** Proceso mediante el cual la información se categoriza de acuerdo con su sensibilidad, valor, restricciones legales, criticidad e impacto potencial.  
Puede comprender información pública, interna, reservada, clasificada, sensible, estratégica o sometida a protección especial. La clasificación determina los controles de acceso, almacenamiento, transmisión, procesamiento y uso en herramientas de IA.

**Comité de Inteligencia Artificial.** Instancia institucional responsable de orientar, evaluar, priorizar y realizar seguimiento a las iniciativas de inteligencia artificial del SGC.  
Debe contar con participación de áreas directivas, técnicas, misionales, jurídicas, de seguridad, datos, planeación y talento humano. Sus decisiones deberán garantizar alineación estratégica, uso responsable, sostenibilidad, seguridad y generación de valor público.

**Confidencialidad.** Propiedad de la información que garantiza que solo pueda ser conocida, consultada o utilizada por personas, procesos o sistemas autorizados. En el contexto de IA, comprende la protección de datos de entrenamiento, resultados, credenciales, código, configuraciones y modelos. La confidencialidad deberá asegurarse mediante controles de acceso, cifrado, acuerdos contractuales y monitoreo.

**Continuidad del negocio.** Capacidad institucional para mantener o restablecer sus procesos críticos ante fallas, incidentes, indisponibilidad tecnológica o interrupciones operativas. Los procesos misionales no deberán depender exclusivamente de una solución de inteligencia artificial sin alternativas de contingencia. Cada sistema crítico deberá contar con respaldos, procedimientos manuales, recuperación ante desastres y responsables de activación.

**Control humano significativo.** Intervención real y efectiva de una persona competente en la revisión, aprobación, corrección o suspensión de los resultados producidos por una IA. No se limita a una validación formal, sino que exige conocimiento, autoridad y capacidad para cuestionar la salida del sistema. Será obligatorio en decisiones científicas, alertas, conceptos técnicos y procesos misionales de alto impacto.

**Datos abiertos.** Información pública dispuesta en formatos accesibles, reutilizables, procesables y sin restricciones injustificadas para su consulta y aprovechamiento. La apertura deberá respetar las limitaciones legales relacionadas con reserva, seguridad, datos personales y protección de información estratégica. Los datos abiertos del SGC deberán publicarse con metadatos, calidad, licencia de uso y mecanismos de actualización.

**Datos de entrenamiento.** Conjunto de ejemplos, registros, imágenes, textos, señales o variables utilizados para que un modelo aprenda patrones y relaciones. Su calidad, representatividad y procedencia influyen directamente en la confiabilidad de los resultados del sistema. Los datos de entrenamiento deberán ser autorizados, documentados, versionados y evaluados frente a sesgos y restricciones legales.

**Datos estratégicos.** Información cuyo conocimiento, alteración, pérdida o divulgación no autorizada puede afectar intereses científicos, económicos, ambientales o de seguridad del Estado.  
En el SGC pueden incluir información sobre recursos del subsuelo, amenazas geológicas, infraestructura crítica o materiales nucleares. Su procesamiento mediante IA requerirá ambientes controlados, residencia nacional y estrictas medidas de protección.

**Datos personales.** Información vinculada o que pueda asociarse con una persona natural determinada o determinable. Comprende datos de identificación, contacto, laborales, biométricos, financieros o cualquier información que permita individualizar a una persona. Su tratamiento mediante IA deberá cumplir la Ley 1581 de 2012, las autorizaciones aplicables y los principios de finalidad y circulación restringida.

**DevSecOps.** Enfoque que integra desarrollo de software, seguridad y operaciones tecnológicas dentro de un proceso continuo y automatizado. Busca incorporar controles de seguridad desde la construcción del sistema y no únicamente al finalizar el desarrollo. En soluciones de IA deberá incluir análisis de código, gestión de dependencias, pruebas, despliegue seguro y control de configuraciones.

**Deriva de datos.** Cambio progresivo en las características, distribución, calidad o comportamiento de los datos utilizados por un modelo durante su operación. Puede producirse por transformaciones ambientales, tecnológicas, geográficas, temporales o en los procesos de captura. La deriva debe ser monitoreada porque puede reducir la precisión y confiabilidad de las predicciones.

**Deriva del modelo.** Deterioro del desempeño de un modelo de IA debido a cambios en los datos, el contexto o las relaciones que aprendió durante el entrenamiento. Puede manifestarse como aumento de errores, reducción de sensibilidad o generación de resultados inconsistentes. Su gestión requiere monitoreo, evaluación periódica, reentrenamiento controlado y aprobación antes de publicar nuevas versiones.

**Evaluación de impacto algorítmico.** Análisis estructurado que permite identificar los efectos, riesgos y consecuencias de implementar un sistema de inteligencia artificial. Examina aspectos técnicos, éticos, científicos, jurídicos, sociales, ambientales, operativos y de seguridad. Será obligatoria para soluciones de riesgo alto o que intervengan en procesos misionales críticos.

**Explicabilidad.** Capacidad de un sistema de IA para ofrecer información comprensible sobre las razones, variables o factores que influyeron en un resultado. La explicación debe ser adecuada para usuarios técnicos, científicos, directivos o ciudadanos, según el contexto. En modelos de alto impacto, la explicabilidad es necesaria para validar resultados y sustentar decisiones.

**Feature Store.** Repositorio especializado para almacenar, administrar y reutilizar variables o características empleadas por modelos de aprendizaje automático. Permite mantener consistencia entre los datos usados durante el entrenamiento y los utilizados en producción. En el SGC puede facilitar la reutilización de variables geológicas, geofísicas, geoquímicas y espaciales.

**FOSS — Software Libre y de Código Abierto.** Software cuyo código fuente puede ser estudiado, utilizado, modificado y distribuido conforme a las condiciones de su licencia. Su adopción puede fortalecer la soberanía tecnológica, la auditabilidad, la interoperabilidad y la independencia de proveedores. El uso de FOSS deberá considerar soporte, seguridad, actualización, comunidad, licenciamiento y sostenibilidad operativa.

**GeoAI — Inteligencia Artificial Geoespacial.** Aplicación de técnicas de inteligencia artificial al análisis de datos geográficos, espaciales, cartográficos, satelitales y geocientíficos. Integra aprendizaje automático, sistemas de información geográfica, percepción remota, análisis espacial y modelamiento.  
En el SGC puede apoyar la evaluación de amenazas, exploración de recursos, cartografía y monitoreo territorial.

**Gobernanza de inteligencia artificial.** Conjunto de principios, estructuras, roles, políticas, procesos y controles utilizados para dirigir y supervisar el uso institucional de la IA. Define quién puede aprobar, desarrollar, adquirir, operar, auditar, modificar o retirar una solución. Su finalidad es garantizar que la IA se utilice de forma ética, segura, transparente, sostenible y alineada con la misión institucional.

**Gobernanza del dato.** Sistema de decisiones, roles, estándares y controles mediante el cual una organización administra sus datos como activos institucionales. Determina responsables, propietarios, custodios, reglas de calidad, acceso, interoperabilidad, seguridad y conservación. La gobernanza del dato es una condición previa para desarrollar modelos de IA confiables y reproducibles.

**Inteligencia artificial generativa.** Tipo de inteligencia artificial capaz de producir contenidos nuevos como textos, imágenes, código, audio, mapas o respuestas conversacionales. Sus resultados se construyen a partir de patrones aprendidos en grandes volúmenes de información. Su uso institucional exige validación humana, protección de datos, control de alucinaciones y transparencia sobre su participación.

**Inteligencia artificial responsable.** Enfoque que busca desarrollar y utilizar IA de manera legal, ética, segura, transparente, inclusiva y orientada al interés público. Comprende principios como supervisión humana, proporcionalidad, explicabilidad, protección de derechos y rendición de cuentas. En el SGC deberá preservar la integridad científica y evitar que la tecnología sustituya el criterio experto.

**Infraestructura soberana.** Conjunto de recursos tecnológicos que permanece bajo control efectivo del SGC o del Estado colombiano. Puede incluir centros de datos, servidores, redes, almacenamiento, plataformas y servicios de procesamiento alojados en Colombia. Su finalidad es reducir exposición jurídica, dependencia externa y pérdida de control sobre información estratégica.

**Integridad científica.** Principio que exige que la producción de conocimiento se realice con rigor, honestidad, transparencia, reproducibilidad y respeto por la evidencia. El uso de IA no deberá generar, ocultar, alterar o presentar datos de forma engañosa. Los investigadores conservarán la responsabilidad sobre los productos científicos, aunque utilicen herramientas automatizadas.

**Interoperabilidad.** Capacidad de diferentes sistemas, organizaciones y tecnologías para intercambiar información y utilizarla de manera coherente. Requiere estándares comunes, estructuras de datos compatibles, metadatos, protocolos y reglas de seguridad. En el SGC deberá promoverse mediante estándares abiertos, servicios OGC, API y modelos de datos institucionales.

**Linaje de datos.** Registro de la procedencia, transformación, movimiento y uso de un dato a lo largo de su ciclo de vida. Permite conocer de dónde provino la información, qué procesos la modificaron y en qué productos fue utilizada. El linaje resulta esencial para auditoría, reproducibilidad científica, control de calidad y solución de errores.

**LLM — Modelo de Lenguaje de Gran Escala.** Modelo de inteligencia artificial entrenado con grandes colecciones de texto para comprender y generar lenguaje natural. Puede utilizarse en asistentes, búsqueda semántica, resumen, clasificación, extracción de información y generación de contenidos.  
Su operación institucional deberá controlar fuentes, permisos, alucinaciones, privacidad y consumo de recursos.

**MLOps.** Conjunto de prácticas para gestionar, versionar, desplegar, monitorear y mantener modelos de aprendizaje automático en operación. Integra ciencia de datos, desarrollo de software, infraestructura, seguridad y control de calidad. Su adopción permite pasar de prototipos individuales a servicios institucionales confiables y sostenibles.

**Modelo de alto riesgo.** Sistema de IA cuyo funcionamiento puede afectar significativamente procesos misionales, derechos, seguridad, decisiones científicas o continuidad institucional.  
Incluye modelos relacionados con amenazas geológicas, alertas, vigilancia sísmica, materiales radiactivos o información estratégica. Estos modelos deberán cumplir controles reforzados de validación, supervisión, seguridad, documentación y auditoría.

**Modelo de código abierto.** Modelo de IA cuyos componentes, código, pesos o documentación se encuentran disponibles bajo una licencia que permite determinados usos y modificaciones.  
Su disponibilidad no significa que pueda instalarse sin evaluación de seguridad, licencia, desempeño y procedencia. El SGC deberá revisar dependencias, vulnerabilidades, restricciones y condiciones de mantenimiento antes de adoptarlo.

**Modelo predictivo.** Sistema que utiliza datos históricos y variables relevantes para estimar la probabilidad o valor futuro de un fenómeno. Puede aplicarse a amenazas geológicas, prospectividad mineral, hidrogeología, geotermia y comportamiento de señales. Toda predicción deberá acompañarse de métricas, incertidumbre, limitaciones y validación por expertos.

**Monitoreo continuo.** Seguimiento permanente del desempeño, seguridad, disponibilidad y comportamiento de una solución de inteligencia artificial. Incluye indicadores de precisión, errores, tiempos de respuesta, deriva, uso, incidentes y consumo de infraestructura. El monitoreo permite detectar oportunamente fallas y determinar cuándo un modelo debe ajustarse, suspenderse o retirarse.

**Nube privada.** Infraestructura de computación en la nube destinada exclusivamente a una organización y administrada bajo controles definidos. Puede operar en instalaciones propias o en centros de datos de un proveedor que garantice aislamiento y condiciones contractuales. Su uso deberá asegurar residencia, cifrado, trazabilidad, reversibilidad y control sobre los datos institucionales.

**Nube soberana.** Modelo de servicios en la nube diseñado para garantizar que los datos y operaciones se sometan a la legislación y jurisdicción nacionales. Busca asegurar residencia territorial, administración controlada, autonomía operativa y reducción de dependencia tecnológica. Su adopción será prioritaria para información sensible, estratégica, reservada o relacionada con procesos críticos.

**OCR — Reconocimiento Óptico de Caracteres.** Tecnología que convierte imágenes de documentos impresos o manuscritos en texto procesable por sistemas informáticos. En el SGC puede utilizarse para digitalizar informes, columnas estratigráficas, formularios, mapas y archivos geocientíficos históricos.  
Los resultados deben someterse a validación, porque la calidad depende del estado, formato y legibilidad de la fuente.

**Orquestación de datos.** Coordinación automatizada de tareas relacionadas con captura, transformación, validación, almacenamiento y distribución de información. Permite ejecutar procesos en un orden controlado, registrar errores, repetir tareas y monitorear resultados. En proyectos de IA facilita la integración de múltiples fuentes y la ejecución reproducible de procesos analíticos.

**Pipeline de datos.** Flujo técnico compuesto por etapas consecutivas que transportan y transforman datos desde su origen hasta su destino. Puede incluir extracción, limpieza, normalización, validación, enriquecimiento, almacenamiento y entrega a modelos. Cada pipeline deberá estar documentado, versionado, monitoreado y protegido contra modificaciones no autorizadas.

**Privacidad desde el diseño.** Principio que incorpora la protección de datos personales desde la concepción de un sistema y durante todo su ciclo de vida. Exige minimizar la recolección, limitar finalidades, aplicar controles de acceso y reducir riesgos de exposición. No deberá tratarse como una actividad posterior al desarrollo, sino como un requisito de arquitectura.

**Prompt.** Instrucción, pregunta, contexto o conjunto de datos suministrado a un modelo generativo para orientar su respuesta. El diseño del prompt influye en la calidad, precisión, formato y alcance de los resultados obtenidos. Los prompts institucionales relevantes deberán documentarse, protegerse, versionarse y evitar la inclusión de información no autorizada.

**Prompt injection.** Ataque o manipulación mediante instrucciones diseñadas para alterar el comportamiento esperado de un modelo generativo. Puede inducir al sistema a revelar información, ignorar reglas, ejecutar acciones no autorizadas o producir resultados peligrosos. Las soluciones con LLM deberán incorporar filtrado, separación de contextos, control de herramientas y validación de respuestas.

**Propiedad intelectual.** Conjunto de derechos relacionados con creaciones, desarrollos, obras, programas, modelos, bases de datos y productos del conocimiento. En proyectos de IA deben definirse los derechos sobre código, datos, modelos entrenados, resultados y componentes de terceros.  
Los contratos deberán asegurar que el SGC conserve los derechos, licencias y capacidades requeridas para operar y modificar las soluciones.

**RAG — Generación Aumentada por Recuperación.** Arquitectura que combina un modelo generativo con un mecanismo de búsqueda en fuentes documentales autorizadas. Permite que las respuestas se fundamenten en información institucional y puedan acompañarse de referencias verificables.  
Su uso reduce alucinaciones, pero no elimina la necesidad de validación humana ni de control de acceso.

**Registro Institucional de Soluciones de IA.** Inventario centralizado de herramientas, modelos, plataformas y servicios de inteligencia artificial utilizados por el SGC. Debe registrar responsables, finalidad, riesgo, datos procesados, infraestructura, estado, proveedor, controles e incidentes. Ninguna solución institucional deberá pasar a producción sin encontrarse previamente inscrita y autorizada.

**Reproducibilidad.** Capacidad de repetir un proceso científico, analítico o computacional y obtener resultados equivalentes bajo las mismas condiciones. Requiere conservar datos, versiones de código, parámetros, modelos, dependencias, ambientes y documentación. Es un principio esencial para garantizar confianza y verificabilidad en investigaciones apoyadas por IA.

**Residencia de datos.** Ubicación física y jurídica en la que se almacenan, procesan, respaldan o transmiten los datos. La residencia determina qué legislación, jurisdicción y condiciones contractuales pueden aplicarse sobre la información. Los datos estratégicos del SGC deberán mantenerse preferiblemente dentro del territorio colombiano.

**Riesgo algorítmico.** Posibilidad de que un sistema de IA produzca daños, errores, impactos adversos o resultados incompatibles con los objetivos institucionales. Puede originarse en datos defectuosos, sesgos, vulnerabilidades, falta de supervisión o uso fuera del contexto autorizado. El riesgo deberá identificarse, valorarse, tratarse, monitorearse y documentarse durante todo el ciclo de vida.

**Seguridad por diseño.** Principio que incorpora requisitos y controles de seguridad desde la planeación y construcción de una solución. Incluye análisis de amenazas, arquitectura segura, control de acceso, cifrado, pruebas y gestión de vulnerabilidades. Su aplicación temprana reduce costos, incidentes y debilidades que serían difíciles de corregir en producción.

**Sesgo algorítmico.** Desviación sistemática que produce resultados injustos, incompletos, poco representativos o científicamente incorrectos. Puede originarse en los datos, el método de muestreo, las variables, el diseño del modelo o la interpretación de resultados. El SGC deberá evaluar sesgos geográficos, temporales, instrumentales y científicos antes de aprobar modelos.  
**Sistema sociotécnico.** Conjunto integrado por personas, procesos, normas, datos, tecnologías, decisiones y estructuras organizacionales. Una solución de IA no funciona de manera aislada, sino que modifica rutinas, responsabilidades y formas de producir conocimiento. Su evaluación deberá considerar impactos humanos y organizacionales además de los aspectos puramente tecnológicos.

**Soberanía del dato.** Capacidad del Estado y del SGC para controlar sus datos, decidir su uso y protegerlos frente a accesos o jurisdicciones externas. Comprende dominio sobre captura, almacenamiento, procesamiento, intercambio, conservación y eliminación. La soberanía exige infraestructura adecuada, reglas contractuales, interoperabilidad, reversibilidad y reducción de dependencias.

**Supervisión humana.** Proceso mediante el cual personas autorizadas vigilan, revisan y controlan el funcionamiento y los resultados de una IA. Permite detectar errores, detener operaciones, corregir salidas y garantizar que la decisión final permanezca bajo responsabilidad humana. Será proporcional al riesgo, impacto y nivel de autonomía de la solución.

**TDIG — Transformación Digital de Información Geocientífica.** Denominación utilizada contextualmente para identificar iniciativas de conversión de información geocientífica histórica en datos digitales estructurados. Comprende digitalización, OCR, clasificación, extracción, normalización, validación experta y almacenamiento en repositorios institucionales.

**Trazabilidad.** Capacidad de reconstruir las actividades, decisiones, modificaciones y resultados producidos durante la operación de un sistema. En IA comprende el registro de datos utilizados, versión del modelo, usuario, fecha, parámetros, salida y validaciones realizadas. La trazabilidad permite realizar auditorías, investigar incidentes y asignar responsabilidades.

**Validación humana en el bucle — HITL.** Enfoque en el que una persona interviene activamente en determinadas etapas del funcionamiento o aprendizaje de un sistema de IA. Puede incluir etiquetado, corrección, aprobación, revisión de resultados y retroalimentación para mejorar el modelo.  
En el SGC, la validación deberá ser realizada por expertos competentes cuando se traten productos científicos o misionales.

**Vibe Coding — Desarrollo de software mediante interacción con IA generativa.** Enfoque de desarrollo en el cual una persona describe mediante lenguaje natural funcionalidades, cambios o comportamientos esperados y un modelo o agente de inteligencia artificial genera o modifica una parte significativa del código necesario para implementarlos. En el SGC su utilización será considerada una modalidad de desarrollo asistido por IA y deberá ejecutarse bajo revisión humana, trazabilidad, control de versiones, pruebas, seguridad y demás controles establecidos para el ciclo de vida institucional del software. La generación automática no transfiere a la IA responsabilidad técnica, científica, administrativa o jurídica sobre el resultado.

**Vibe Coding controlado.** Aplicación institucional del Vibe Coding en la cual la IA puede asumir una proporción significativa de las tareas de construcción, pero las decisiones de arquitectura, aceptación, seguridad, integración y puesta en producción permanecen bajo responsabilidad humana y sujetas a los controles institucionales de desarrollo de software.  
