# El desastre de la API de PayPal que duró 11 años: cómo creamos soluciones alternativas mientras ellos ignoraban a los desarrolladores {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

En Forward Email, llevamos más de una década lidiando con las API defectuosas de PayPal. Lo que empezó como pequeñas frustraciones se convirtió en un completo desastre que nos obligó a crear nuestras propias soluciones alternativas, bloquear sus plantillas de phishing y, finalmente, detener todos los pagos de PayPal durante una migración crítica de cuentas. Esta es la historia de 11 años en los que PayPal ignoró las necesidades básicas de los desarrolladores mientras intentábamos por todos los medios que su plataforma funcionara.

## Tabla de contenido {#table-of-contents}

* [La pieza que falta: No hay forma de listar suscripciones](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: El problema surge](#2014-2017-the-problem-emerges)
* [2020: Les brindamos comentarios exhaustivos](#2020-we-give-them-extensive-feedback)
  * [La lista de retroalimentación de 27 elementos](#the-27-item-feedback-list)
  * [Los equipos se involucraron, se hicieron promesas](#teams-got-involved-promises-were-made)
  * [¿El resultado? Nada.](#the-result-nothing)
* [El éxodo ejecutivo: cómo PayPal perdió toda su memoria institucional](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nuevo liderazgo, mismos problemas](#2025-new-leadership-same-problems)
  * [El nuevo CEO se involucra](#the-new-ceo-gets-involved)
  * [Respuesta de Michelle Gill](#michelle-gills-response)
  * [Nuestra respuesta: No más reuniones](#our-response-no-more-meetings)
  * [La respuesta de sobreingeniería de Marty Brodbeck](#marty-brodbecks-overengineering-response)
  * [La contradicción del "CRUD simple"](#the-simple-crud-contradiction)
  * [La desconexión se hace evidente](#the-disconnect-becomes-clear)
* [Años de informes de errores que ignoraron](#years-of-bug-reports-they-ignored)
  * [2016: Primeras quejas sobre UI/UX](#2016-early-uiux-complaints)
  * [2021: Informe de errores de correo electrónico empresarial](#2021-business-email-bug-report)
  * [2021: Sugerencias para mejorar la interfaz de usuario](#2021-ui-improvement-suggestions)
  * [2021: Fallas en el entorno Sandbox](#2021-sandbox-environment-failures)
  * [2021: El sistema de informes está completamente roto](#2021-reports-system-completely-broken)
  * [2022: Falta una función de API principal (otra vez)](#2022-core-api-feature-missing-again)
* [La pesadilla de la experiencia del desarrollador](#the-developer-experience-nightmare)
  * [Interfaz de usuario rota](#broken-user-interface)
  * [Problemas del SDK](#sdk-problems)
  * [Violaciones de la política de seguridad de contenido](#content-security-policy-violations)
  * [Caos de documentación](#documentation-chaos)
  * [Vulnerabilidades de seguridad](#security-vulnerabilities)
  * [Desastre en la gestión de sesiones](#session-management-disaster)
* [Julio de 2025: La gota que colmó el vaso](#july-2025-the-final-straw)
* [Por qué no podemos simplemente abandonar PayPal](#why-we-cant-just-drop-paypal)
* [La solución alternativa de la comunidad](#the-community-workaround)
* [Bloqueo de plantillas de PayPal debido a phishing](#blocking-paypal-templates-due-to-phishing)
  * [El verdadero problema: las plantillas de PayPal parecen estafas](#the-real-problem-paypals-templates-look-like-scams)
  * [Nuestra Implementación](#our-implementation)
  * [Por qué tuvimos que bloquear PayPal](#why-we-had-to-block-paypal)
  * [La magnitud del problema](#the-scale-of-the-problem)
  * [La ironía](#the-irony)
  * [Impacto en el mundo real: Nuevas estafas de PayPal](#real-world-impact-novel-paypal-scams)
* [El proceso KYC inverso de PayPal](#paypals-backwards-kyc-process)
  * [Cómo debería funcionar](#how-it-should-work)
  * [Cómo funciona realmente PayPal](#how-paypal-actually-works)
  * [El impacto en el mundo real](#the-real-world-impact)
  * [El desastre de la migración de cuentas de julio de 2025](#the-july-2025-account-migration-disaster)
  * [Por qué esto es importante](#why-this-matters)
* [Cómo lo hacen bien todos los demás procesadores de pagos](#how-every-other-payment-processor-does-it-right)
  * [Raya](#stripe)
  * [Paleta](#paddle)
  * [Comercio de Coinbase](#coinbase-commerce)
  * [Cuadrado](#square)
  * [El estándar de la industria](#the-industry-standard)
  * [Qué ofrecen otros procesadores en comparación con PayPal](#what-other-processors-provide-vs-paypal)
* [El encubrimiento sistemático de PayPal: silenciando seis millones de voces](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [El Gran Borrado](#the-great-erasure)
  * [El rescate de terceros](#the-third-party-rescue)
* [El desastre de la captura de insectos que duró 11 años: $1,899 y contando](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Pérdida de $1,899 de Forward Email](#forward-emails-1899-loss)
  * [El informe original de 2013: Más de 11 años de negligencia](#the-2013-original-report-11-years-of-negligence)
  * [La admisión de 2016: PayPal rompe su propio SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [La escalada de 2024: aún rota](#the-2024-escalation-still-broken)
  * [El desastre de la confiabilidad del webhook](#the-webhook-reliability-disaster)
  * [El patrón de negligencia sistemática](#the-pattern-of-systematic-negligence)
  * [El requisito de los indocumentados](#the-undocumented-requirement)
* [El patrón más amplio de engaño de PayPal](#paypals-broader-pattern-of-deception)
  * [Acción del Departamento de Servicios Financieros de Nueva York](#the-new-york-department-of-financial-services-action)
  * [La demanda de Honey: reescritura de enlaces de afiliados](#the-honey-lawsuit-rewriting-affiliate-links)
  * [El costo de la negligencia de PayPal](#the-cost-of-paypals-negligence)
  * [La mentira de la documentación](#the-documentation-lie)
* [Qué significa esto para los desarrolladores](#what-this-means-for-developers)

## La pieza que falta: No hay forma de listar suscripciones {#the-missing-piece-no-way-to-list-subscriptions}

Esto es lo que nos sorprende: PayPal tiene facturación por suscripciones desde 2014, pero nunca ha proporcionado una forma para que los comerciantes incluyan sus propias suscripciones.

Piénsalo un momento. Puedes crear suscripciones y cancelarlas si tienes el ID, pero no puedes obtener una lista de todas las suscripciones activas de tu cuenta. Es como tener una base de datos sin una sentencia SELECT.

Necesitamos esto para operaciones comerciales básicas:

* Atención al cliente (cuando alguien envía un correo electrónico preguntando por su suscripción)
* Informes financieros y conciliación
* Gestión automatizada de la facturación
* Cumplimiento y auditoría

¿Pero PayPal? Simplemente... nunca lo crearon.

## 2014-2017: El problema surge {#2014-2017-the-problem-emerges}

El problema con la lista de suscripciones surgió por primera vez en los foros de la comunidad de PayPal en 2017. Los desarrolladores se planteaban la pregunta obvia: "¿Cómo obtengo una lista de todas mis suscripciones?".

¿La respuesta de PayPal? Ni una palabra.

Los miembros de la comunidad comenzaron a frustrarse:

Es una omisión muy extraña que un comerciante no pueda listar todos los acuerdos activos. Si se pierde el ID del acuerdo, solo el usuario puede cancelarlo o suspenderlo. - leafspider

> "+1. Han pasado casi 3 años." - laudukang (lo que significa que el problema existía desde 2014)

El [publicación original de la comunidad](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) de 2017 muestra a los desarrolladores solicitando esta funcionalidad básica. La respuesta de PayPal fue archivar el repositorio donde se reportaba el problema.

## 2020: Les brindamos comentarios exhaustivos {#2020-we-give-them-extensive-feedback}

En octubre de 2020, PayPal nos contactó para una sesión formal de retroalimentación. No fue una charla informal: organizaron una llamada de Microsoft Teams de 45 minutos con ocho ejecutivos de PayPal, entre ellos Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze y otros.

### La lista de comentarios de 27 elementos {#the-27-item-feedback-list}

Vinimos preparados. Tras 6 horas intentando integrarnos con sus API, habíamos recopilado 27 problemas específicos. Mark Stuart, del equipo de PayPal Checkout, comentó:

Hola Nick, ¡gracias por compartir con todos hoy! Creo que esto servirá de catalizador para conseguir más apoyo e inversión para que nuestro equipo solucione estos problemas. Ha sido difícil recibir comentarios tan valiosos como los que nos has dejado hasta ahora.

La retroalimentación no fue teórica: surgió de intentos de integración reales:

1. **La generación de token de acceso no funciona**:

La generación de tokens de acceso no funciona. Además, debería haber más ejemplos que solo cURL.

2. **No hay interfaz web para la creación de suscripciones**:

¿Cómo demonios se pueden crear suscripciones sin usar cURL? Parece que no hay una interfaz web para hacerlo (como la de Stripe).

A Mark Stuart le preocupaba especialmente el problema del token de acceso:

>Normalmente no escuchamos sobre problemas relacionados con la generación de tokens de acceso.

### Los equipos se involucraron, se hicieron promesas {#teams-got-involved-promises-were-made}

A medida que descubríamos más problemas, PayPal siguió añadiendo más equipos a la conversación. Darshan Raju, del equipo de interfaz de usuario de gestión de suscripciones, se unió y comentó:

Reconozca la brecha. Le daremos seguimiento y la abordaremos. ¡Gracias de nuevo por sus comentarios!

La sesión se describió como la búsqueda de:

> Un recorrido sincero por tu experiencia

a:

> hacer de PayPal lo que debería ser para los desarrolladores.

### ¿El resultado? Nada. {#the-result-nothing}

A pesar de la sesión de retroalimentación formal, la extensa lista de 27 elementos, la participación de múltiples equipos y las promesas de:

> seguimiento y dirección

Problemas, absolutamente nada se solucionó.

## El éxodo ejecutivo: cómo PayPal perdió toda la memoria institucional {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Aquí es donde la cosa se pone realmente interesante. Todas las personas que recibieron nuestros comentarios de 2020 se han ido de PayPal:

**Cambios de liderazgo:**

* [Dan Schulman (CEO durante 9 años) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (septiembre de 2023)
* [Sri Shivananda (director de tecnología que organizó la retroalimentación) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (enero de 2024)

**Líderes técnicos que hicieron promesas y luego se fueron:**

* **Mark Stuart** (prometió que sus comentarios serían un catalizador) → [Ahora en Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 años en PayPal) → [Director ejecutivo de MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (Vicepresidente Global de Productos de Consumo) → [Jubilado](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (uno de los últimos) → [Recién salido para Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (enero de 2025)

PayPal se ha convertido en una puerta giratoria donde los ejecutivos recogen opiniones de los desarrolladores, hacen promesas y luego se van a empresas mejores como JPMorgan, Ripple y otras empresas de tecnología financiera.

Esto explica por qué la respuesta al problema de GitHub de 2025 parecía completamente desconectada de nuestros comentarios de 2020: literalmente, todos los que recibieron esos comentarios abandonaron PayPal.

## 2025: Nuevo liderazgo, mismos problemas {#2025-new-leadership-same-problems}

Avanzando rápidamente hasta 2025, surge exactamente el mismo patrón. Tras años sin avances, la nueva dirección de PayPal vuelve a contactar.

### El nuevo CEO se involucra {#the-new-ceo-gets-involved}

El 30 de junio de 2025, escalamos la situación directamente al nuevo director ejecutivo de PayPal, Alex Chriss. Su respuesta fue breve:

Hola Nick: Gracias por contactarnos y por tus comentarios. Michelle (con copia) está muy atenta a la situación y a su equipo para colaborar contigo. Gracias. -A

### Respuesta de Michelle Gill {#michelle-gills-response}

Michelle Gill, vicepresidenta ejecutiva y gerente general de pequeñas empresas y servicios financieros, respondió:

Muchas gracias, Nick, por mover a Alex a CCO. Hemos estado investigando esto desde tu publicación anterior. Te llamaremos antes de que termine la semana. ¿Podrías enviarme tu información de contacto para que uno de mis colegas pueda contactarte? Michelle

### Nuestra respuesta: No más reuniones {#our-response-no-more-meetings}

Rechazamos otra reunión, explicando nuestra frustración:

Gracias. Sin embargo, no creo que una llamada vaya a servir de nada. He aquí por qué... Hace tiempo, tuve una llamada y no me llevó a ninguna parte. Perdí más de dos horas hablando con todo el equipo y la directiva, y no se logró nada... Un montón de correos electrónicos. Absolutamente nada. La retroalimentación no llegó a nada. Intenté durante años que me escucharan, y luego no me llevó a ninguna parte.

### Respuesta de sobreingeniería de Marty Brodbeck {#marty-brodbecks-overengineering-response}

Luego, Marty Brodbeck, quien dirige ingeniería de consumo en PayPal, se puso en contacto:

Hola Nick, soy Marty Brodbeck. Dirijo toda la ingeniería de consumo en PayPal y he estado impulsando el desarrollo de API para la empresa. ¿Podrías hablar sobre el problema que tienes y cómo podemos ayudarte?

Cuando le explicamos la simple necesidad de un punto final de listado de suscripciones, su respuesta reveló el problema exacto:

> Gracias Nick, estamos en el proceso de crear una única API de suscripción con SDK completo (admite manejo completo de errores, seguimiento de suscripciones basado en eventos, tiempo de actividad sólido) donde la facturación también se divide como una API separada a la que los comerciantes pueden acceder en lugar de tener que orquestar en múltiples puntos finales para obtener una única respuesta.

Este es precisamente el enfoque equivocado. No necesitamos meses de arquitectura compleja. Necesitamos un punto final REST simple que enumere las suscripciones, algo que debería haber existido desde 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### La contradicción "Simple CRUD" {#the-simple-crud-contradiction}

Cuando señalamos que se trataba de una funcionalidad CRUD básica que debería haber existido desde 2014, la respuesta de Marty fue reveladora:

> Las operaciones Crud simples son parte de la API principal, amigo mío, por lo que no te llevará meses de desarrollo.

El SDK TypeScript de PayPal, que actualmente admite solo tres puntos finales después de meses de desarrollo, junto con su cronograma histórico, demuestra claramente que dichos proyectos requieren más de unos pocos meses para completarse.

Esta respuesta demuestra que no comprende su propia API. Si "las operaciones CRUD simples forman parte de la API principal", ¿dónde está el punto final de la lista de suscripciones? Respondimos:

Si las operaciones CRUD simples forman parte de la API principal, ¿dónde está el punto final de la lista de suscripciones? Los desarrolladores llevan pidiendo esta "operación CRUD simple" desde 2014. Han pasado 11 años. Todos los demás procesadores de pagos han tenido esta funcionalidad básica desde el principio.

### La desconexión se aclara {#the-disconnect-becomes-clear}

Los intercambios de 2025 con Alex Chriss, Michelle Gill y Marty Brodbeck muestran la misma disfunción organizacional:

1. **Los nuevos líderes desconocen las sesiones de retroalimentación anteriores**
2. **Proponen las mismas soluciones sobredimensionadas**
3. **No comprenden las limitaciones de sus propias API**
4. **Quieren más reuniones en lugar de simplemente solucionar el problema**

Este patrón explica por qué los equipos de PayPal en 2025 parecen completamente desconectados de la amplia retroalimentación proporcionada en 2020: las personas que recibieron esa retroalimentación ya no están y el nuevo liderazgo está repitiendo los mismos errores.

## Años de informes de errores que ignoraron {#years-of-bug-reports-they-ignored}

No nos limitamos a quejarnos de las funciones faltantes. Reportamos errores activamente e intentamos mejorarlos. Aquí tienes una cronología completa de los problemas que documentamos:

### 2016: Quejas tempranas sobre UI/UX {#2016-early-uiux-complaints}

Ya en 2016, contactamos públicamente a los directivos de PayPal, incluyendo a Dan Schulman, sobre problemas de interfaz y usabilidad. Esto ocurrió hace 9 años, y los mismos problemas de UI/UX persisten hoy en día.

### 2021: Informe de errores de correo electrónico empresarial {#2021-business-email-bug-report}

En marzo de 2021, informamos que el sistema de correo electrónico empresarial de PayPal enviaba notificaciones de cancelación incorrectas. La plantilla de correo electrónico tenía variables mal representadas, lo que mostraba mensajes confusos a los clientes.

Mark Stuart reconoció el problema:

¡Gracias, Nick! Cambiando a CCO. @Prasy, ¿tu equipo es responsable de este correo electrónico o sabes quién es? El mensaje "Niftylettuce, LLC, ya no te facturaremos" me hace pensar que hay una confusión entre el destinatario y el contenido del correo.

**Resultado**: ¡Lo solucionaron! Mark Stuart lo confirmó:

El equipo de notificaciones acaba de informarnos que la plantilla de correo electrónico se ha corregido y está lista. Gracias por informarnos. ¡Gracias!

Esto demuestra que PUEDEN arreglar las cosas cuando quieren, pero en la mayoría de los casos eligen no hacerlo.

### 2021: Sugerencias para mejorar la interfaz de usuario {#2021-ui-improvement-suggestions}

En febrero de 2021, proporcionamos comentarios detallados sobre la interfaz de usuario de su panel, específicamente la sección "Actividad reciente de PayPal":

Creo que el panel de control de paypal.com, en concreto la sección "Actividad reciente de PayPal", necesita mejoras. No creo que deban mostrarse las líneas de estado "Creado" de los pagos recurrentes de $0; solo añaden un montón de líneas adicionales y no se puede ver fácilmente a simple vista cuántos ingresos se están generando en el día o en los últimos días.

Mark Stuart lo envió al equipo de productos de consumo:

¡Gracias! No estoy seguro de qué equipo es responsable de la actividad, pero lo envié al responsable de productos de consumo para encontrar el equipo correcto. Un pago recurrente de $0.00 parece un error. Probablemente debería filtrarse.

**Resultado**: Nunca se solucionó. La interfaz de usuario sigue mostrando estas entradas inútiles de $0.

### 2021: Fallas en el entorno de pruebas {#2021-sandbox-environment-failures}

En noviembre de 2021, informamos sobre problemas críticos con el entorno sandbox de PayPal:

* Las claves API secretas de Sandbox se cambiaron aleatoriamente y se deshabilitaron.
* Todas las cuentas de prueba de Sandbox se eliminaron sin previo aviso.
* Mensajes de error al intentar ver los detalles de la cuenta de Sandbox.
* Fallos de carga intermitentes.

Por alguna razón, mi clave API secreta de Sandbox se modificó y se desactivó. Además, se eliminaron todas mis antiguas cuentas de prueba de Sandbox.

A veces cargan y a veces no. Es frustrante.

**Resultado**: Sin respuesta, sin solución. Los desarrolladores aún enfrentan problemas de confiabilidad en el entorno de pruebas.

### 2021: El sistema de informes está completamente dañado {#2021-reports-system-completely-broken}

En mayo de 2021, informamos que el sistema de descarga de informes de transacciones de PayPal estaba completamente roto:

Parece que los informes de descargas no funcionan ahora mismo y no han funcionado en todo el día. Además, probablemente debería recibir una notificación por correo electrónico si falla.

También señalamos el desastre de la gestión de sesiones:

Además, si permaneces inactivo con la sesión iniciada en PayPal durante unos 5 minutos, se cerrará la sesión. Así que, al actualizar el botón junto al informe cuyo estado quieres consultar (después de una larga espera), es un rollo tener que volver a iniciar sesión.

Mark Stuart reconoció el problema del tiempo de espera de la sesión:

> Recuerdo que usted había informado que en el pasado su sesión expiraba con frecuencia e interrumpía su flujo de desarrollo mientras cambiaba entre su IDE y developer.paypal.com o su panel de control de comerciante, luego regresaba y se cerraba la sesión nuevamente.

**Resultado**: Los tiempos de espera de sesión siguen siendo de 60 segundos. El sistema de informes sigue fallando con frecuencia.

### 2022: Falta la función principal de la API (de nuevo) {#2022-core-api-feature-missing-again}

En enero de 2022, volvimos a escalar el problema de la lista de suscripciones, esta vez con aún más detalles sobre por qué su documentación era incorrecta:

> No existe un GET que enumere todas las suscripciones (anteriormente llamadas acuerdos de facturación)

Descubrimos que su documentación oficial era completamente inexacta:

La documentación de la API también es totalmente inexacta. Pensamos que podríamos solucionarlo descargando una lista de ID de suscripción predefinida. ¡Pero ni siquiera funciona!

> De los documentos oficiales aquí... Dice que puedes hacer esto... Aquí está el truco: no hay ningún campo de "ID de suscripción" en ningún lado para marcarlo.

Christina Monti de PayPal respondió:

> Disculpas por las frustraciones causadas por estos pasos incorrectos, lo solucionaremos esta semana.

Sri Shivananda (CTO) nos agradeció:

Gracias por su continua ayuda para mejorar. Se lo agradecemos mucho.

**Resultado**: La documentación nunca se corrigió. El punto final de la lista de suscripciones nunca se creó.

## La pesadilla de la experiencia del desarrollador {#the-developer-experience-nightmare}

Trabajar con las API de PayPal es como retroceder 10 años en el tiempo. Estos son los problemas técnicos que hemos documentado:

### Interfaz de usuario rota {#broken-user-interface}

El panel de control para desarrolladores de PayPal es un desastre. Esto es lo que nos pasa a diario:

<figure>
<figcaption><div class="alert alert-danger small text-center">
La interfaz de usuario de PayPal es tan deficiente que ni siquiera puedes ignorar las notificaciones.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Tu navegador no admite la etiqueta de vídeo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
El panel de desarrollador te obliga a arrastrar un control deslizante y cierra la sesión después de 60 segundos.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Tu navegador no admite la etiqueta de vídeo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Más problemas con la interfaz de usuario para desarrolladores de PayPal que muestran flujos de trabajo fallidos.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Su navegador no admite la etiqueta de vídeo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
La interfaz de gestión de suscripciones: es tan deficiente que tuvimos que usar código para generar productos y planes de suscripción.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Vista de la interfaz de suscripción defectuosa, con funcionalidades faltantes (no se pueden crear productos, planes ni suscripciones fácilmente, y no parece haber forma de eliminar productos ni planes una vez creados en la interfaz de usuario).
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Mensajes de error típicos de PayPal: crípticos e inútiles
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemas del SDK {#sdk-problems}

* No se pueden gestionar pagos únicos ni suscripciones sin soluciones alternativas complejas que implican intercambiar y volver a renderizar botones mientras se recarga el SDK con etiquetas de script.
* El SDK de JavaScript infringe las convenciones básicas (nombres de clase en minúsculas, sin comprobación de instancias).
* Los mensajes de error no indican qué campos faltan.
* Tipos de datos inconsistentes (se requieren cantidades de cadena en lugar de números).

### Violaciones de la política de seguridad de contenido {#content-security-policy-violations}

Su SDK requiere unsafe-inline y unsafe-eval en su CSP, **lo que lo obliga a comprometer la seguridad de su sitio**.

### Documentación Caos {#documentation-chaos}

El propio Mark Stuart admitió:

De acuerdo en que hay una cantidad absurda de API antiguas y nuevas. Es realmente difícil encontrar lo que buscamos (incluso para quienes trabajamos aquí).

### Vulnerabilidades de seguridad {#security-vulnerabilities}

**La implementación de la autenticación de dos factores (A2F) de PayPal está al revés**. Incluso con las aplicaciones TOTP habilitadas, fuerzan la verificación por SMS, lo que hace que las cuentas sean vulnerables a ataques de intercambio de SIM. Si tienes TOTP habilitado, debería usarse exclusivamente por correo electrónico, no por SMS.

### Desastre de gestión de sesiones {#session-management-disaster}

**Su panel de desarrollador cierra la sesión tras 60 segundos de inactividad**. Intentas hacer algo productivo y te encuentras constantemente con: iniciar sesión → captcha → 2FA → cerrar sesión → repetir. ¿Usas una VPN? ¡Mucha suerte!

## Julio de 2025: La gota que colmó el vaso {#july-2025-the-final-straw}

Tras 11 años con los mismos problemas, el punto de inflexión llegó durante una migración rutinaria de cuenta. Necesitábamos cambiar a una nueva cuenta de PayPal que coincidiera con el nombre de nuestra empresa, "Forward Email LLC", para una contabilidad más ordenada.

Lo que debería haber sido sencillo se convirtió en un completo desastre:

* Las pruebas iniciales demostraron que todo funcionaba correctamente.
* Horas después, PayPal bloqueó repentinamente todos los pagos de suscripciones sin previo aviso.
* Los clientes no podían pagar, lo que generó confusión y una carga para el soporte.
* El soporte de PayPal dio respuestas contradictorias, afirmando que las cuentas estaban verificadas.
* Nos vimos obligados a detener por completo los pagos de PayPal.

<figure>
<figcaption><div class="alert alert-danger small text-center">
El error que vieron los clientes al intentar pagar: sin explicación, sin registros, sin nada.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
El soporte de PayPal afirmaba que todo estaba bien, aunque los pagos estaban completamente interrumpidos. El mensaje final muestra que dicen que "restauraron algunas funciones", pero siguen solicitando información no especificada: un clásico caso de soporte de PayPal.

<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" clase="redondeado-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" clase="redondeado-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
El proceso de verificación de identidad que supuestamente no "solucionó" nada
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Mensaje impreciso y aún sin resolución. Ninguna información, avisos ni información adicional necesaria. El servicio de atención al cliente permanece en silencio.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Por qué no podemos simplemente abandonar PayPal {#why-we-cant-just-drop-paypal}

A pesar de todos estos problemas, no podemos abandonar PayPal por completo, ya que algunos clientes solo tienen PayPal como opción de pago. Como comentó un cliente en nuestro [página de estado](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal es mi única opción de pago.

**Nos encontramos obligados a dar soporte a una plataforma rota porque PayPal ha creado un monopolio de pagos para ciertos usuarios.**

## La solución alternativa de la comunidad {#the-community-workaround}

Dado que PayPal no ofrece la funcionalidad básica de listado de suscripciones, la comunidad de desarrolladores ha creado soluciones alternativas. Creamos un script que ayuda a administrar las suscripciones de PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Este script hace referencia a un [esencia de la comunidad](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) donde los desarrolladores comparten soluciones. Los usuarios son, en realidad, [agradeciéndonos](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) por proporcionar lo que PayPal debería haber creado hace años.

## Bloqueo de plantillas de PayPal debido a phishing {#blocking-paypal-templates-due-to-phishing}

Los problemas van más allá de las API. Las plantillas de correo electrónico de PayPal están tan mal diseñadas que tuvimos que implementar un filtro específico en nuestro servicio de correo electrónico porque son indistinguibles de los intentos de phishing.

### El verdadero problema: las plantillas de PayPal parecen estafas {#the-real-problem-paypals-templates-look-like-scams}

Recibimos regularmente informes de correos electrónicos de PayPal que parecen ser intentos de phishing. Aquí hay un ejemplo real de nuestros informes de abuso:

**Asunto:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Este correo electrónico se reenvió a `abuse@microsoft.com` porque parecía ser un intento de phishing. ¿El problema? En realidad, provenía del entorno de pruebas de PayPal, pero el diseño de su plantilla es tan deficiente que activa los sistemas de detección de phishing.

### Nuestra implementación {#our-implementation}

Puedes ver nuestro filtrado específico de PayPal implementado en nuestro [código de filtrado de correo electrónico](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Por qué tuvimos que bloquear PayPal {#why-we-had-to-block-paypal}

Implementamos esto porque PayPal se negó a solucionar problemas masivos de spam, phishing y fraude a pesar de nuestras reiteradas denuncias a sus equipos de abuso. Los tipos de correo electrónico específicos que bloqueamos incluyen:

**RT000238** - Notificaciones de facturas sospechosas
* **PPC001017** - Confirmaciones de pago problemáticas
* **RT000542** - Intentos de piratería de mensajes de regalo

### La escala del problema {#the-scale-of-the-problem}

Nuestros registros de filtrado de spam muestran el enorme volumen de spam de facturas de PayPal que procesamos a diario. Algunos ejemplos de asuntos bloqueados incluyen:

* "Factura del equipo de facturación de PayPal: Este cargo se debitará automáticamente de su cuenta. Por favor, contáctenos de inmediato al [TELÉFONO]"
* "Factura de [NOMBRE DE LA EMPRESA] ([ID DEL PEDIDO])"
* Varias variaciones con diferentes números de teléfono e ID de pedido falsos

Estos correos electrónicos suelen provenir de hosts `outlook.com`, pero parecen provenir de los sistemas legítimos de PayPal, lo que los hace especialmente peligrosos. Los correos electrónicos superan la autenticación SPF, DKIM y DMARC porque se envían a través de la infraestructura de PayPal.

Nuestros registros técnicos muestran que estos correos electrónicos no deseados contienen encabezados legítimos de PayPal:

* `X-Email-Type-Id: RT000238` (el mismo ID que bloqueamos)
* `From: "service@paypal.com" <service@paypal.com>`
* Firmas DKIM válidas de `paypal.com`
* Registros SPF correctos que muestran los servidores de correo de PayPal

Esto crea una situación imposible: los correos electrónicos legítimos de PayPal y el spam tienen características técnicas idénticas.

### La ironía {#the-irony}

PayPal, una empresa que debería liderar la lucha contra el fraude financiero, tiene plantillas de correo electrónico tan mal diseñadas que activan los sistemas antiphishing. Nos vemos obligados a bloquear los correos electrónicos legítimos de PayPal porque son indistinguibles de las estafas.

Esto está documentado en la investigación de seguridad: [Tenga cuidado con el fraude de nuevas direcciones de PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/), que muestra cómo se explotan los propios sistemas de PayPal para cometer fraudes.

### Impacto en el mundo real: Nuevas estafas de PayPal {#real-world-impact-novel-paypal-scams}

El problema va más allá de un diseño deficiente de la plantilla. El sistema de facturación de PayPal es tan fácil de explotar que los estafadores lo utilizan con frecuencia para enviar facturas fraudulentas que parecen legítimas. El investigador de seguridad Gavin Anderegg documentó el error [Una nueva estafa de PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), donde los estafadores envían facturas de PayPal auténticas que superan todas las comprobaciones de autenticación:

Al revisar la fuente, el correo parecía provenir de PayPal (SPF, DKIM y DMARC pasaron todos). El botón también enlazaba a una URL aparentemente legítima de PayPal... Me llevó un segundo darme cuenta de que era un correo legítimo. Me acababan de enviar una "factura" aleatoria de un estafador.

<figure>
<figcaption><div class="alert alert-danger small text-center">
Captura de pantalla que muestra múltiples facturas fraudulentas de PayPal inundando una bandeja de entrada. Todas parecen legítimas porque en realidad provienen de los sistemas de PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

El investigador señaló:

También parece una función de conveniencia que PayPal debería considerar bloquear. Inmediatamente supuse que se trataba de alguna estafa y solo me interesaban los detalles técnicos. Parece demasiado fácil de llevar a cabo y me preocupa que otros puedan caer en la trampa.

Esto ilustra perfectamente el problema: los propios sistemas legítimos de PayPal están tan mal diseñados que posibilitan el fraude y al mismo tiempo hacen que las comunicaciones legítimas parezcan sospechosas.

Para empeorar las cosas, esto afectó nuestra capacidad de entrega con Yahoo, lo que generó quejas de los clientes y horas de pruebas meticulosas y verificación de patrones.

## Proceso KYC inverso de PayPal {#paypals-backwards-kyc-process}

Uno de los aspectos más frustrantes de la plataforma de PayPal es su enfoque retrógrado en materia de cumplimiento normativo y procedimientos de Conozca a su Cliente (KYC). A diferencia de otros procesadores de pagos, PayPal permite a los desarrolladores integrar sus API y comenzar a cobrar pagos en producción antes de completar la verificación correspondiente.

### Cómo debería funcionar {#how-it-should-work}

Todo procesador de pagos legítimo sigue esta secuencia lógica:

1. **Primero, complete la verificación KYC**
2. **Apruebe la cuenta comercial**
3. **Proporcione acceso a la API de producción**
4. **Permita el cobro de pagos**

Esto protege tanto al procesador de pagos como al comerciante al garantizar el cumplimiento antes de que se realice cualquier cambio de dinero.

### Cómo funciona realmente PayPal {#how-paypal-actually-works}

El proceso de PayPal es completamente al revés:

1. **Proporcionar acceso inmediato a la API de producción**
2. **Permitir el cobro de pagos durante horas o días**
3. **Bloquear pagos repentinamente sin previo aviso**
4. **Exigir documentación KYC después de que los clientes ya se hayan visto afectados**
5. **No notificar al comerciante**
6. **Permitir que los clientes detecten el problema y lo reporten**

### El impacto en el mundo real {#the-real-world-impact}

Este proceso retrógrado crea desastres para las empresas:

* **Los clientes no pueden completar sus compras** durante las temporadas altas de ventas
* **Sin aviso previo** de que se requiere verificación
* **Sin notificaciones por correo electrónico** cuando los pagos están bloqueados
* **Los comerciantes se enteran de los problemas gracias a la confusión de los clientes**
* **Pérdida de ingresos** durante períodos comerciales críticos
* **Daño a la confianza del cliente** cuando los pagos fallan misteriosamente

### El desastre de la migración de cuentas de julio de 2025 {#the-july-2025-account-migration-disaster}

Esta misma situación se presentó durante nuestra migración rutinaria de cuentas en julio de 2025. PayPal permitió que los pagos funcionaran inicialmente, pero luego los bloqueó repentinamente sin previo aviso. Solo descubrimos el problema cuando los clientes empezaron a reportar que no podían pagar.

Cuando contactamos con soporte, recibimos respuestas contradictorias sobre la documentación necesaria, sin un plazo claro para la resolución. Esto nos obligó a suspender por completo los pagos con PayPal, confundiendo a los clientes que no tenían otras opciones de pago.

### Por qué esto importa {#why-this-matters}

El enfoque de PayPal hacia el cumplimiento normativo demuestra una incomprensión fundamental del funcionamiento de las empresas. Un KYC adecuado debería realizarse **antes** de la integración en producción, no después de que los clientes ya estén intentando pagar. La falta de comunicación proactiva cuando surgen problemas demuestra la desconexión de PayPal con las necesidades de los comerciantes.

Este proceso retrógrado es sintomático de los problemas organizacionales más amplios de PayPal: priorizan sus procesos internos por sobre la experiencia del comerciante y del cliente, lo que conduce al tipo de desastres operativos que alejan a las empresas de su plataforma.

## Cómo lo hacen bien todos los demás procesadores de pagos {#how-every-other-payment-processor-does-it-right}

La función de listado de suscripciones que PayPal se niega a implementar ha sido estándar en la industria durante más de una década. Así es como otros procesadores de pagos gestionan este requisito básico:

MARCADOR DE TEMPERATURA 0 Stripe {MARCADOR DE TEMPERATURA 1

Stripe ha incluido un listado de suscripciones desde el lanzamiento de su API. Su documentación muestra claramente cómo recuperar todas las suscripciones de una cuenta de cliente o comerciante. Esto se considera una funcionalidad CRUD básica.

MARCADOR DE TEMPERATURA_0 Paleta {MARCADOR DE TEMPERATURA_1

Paddle ofrece API integrales para la gestión de suscripciones, que incluyen listados, filtros y paginación. Entienden que los comerciantes necesitan visualizar sus flujos de ingresos recurrentes.

MARCADOR DE TEMPORADA 0 Coinbase Commerce {MARCADOR DE TEMPORADA 1

Incluso los procesadores de pago de criptomonedas como Coinbase Commerce ofrecen una mejor gestión de suscripciones que PayPal.

MARCADOR DE TEMPERATURA 0 Cuadrado {MARCADOR DE TEMPERATURA 1

La API de Square incluye el listado de suscripciones como una característica fundamental, no como una ocurrencia de último momento.

### El estándar de la industria {#the-industry-standard}

Cada procesador de pagos moderno ofrece:

* Listado de todas las suscripciones
* Filtrado por estado, fecha y cliente
* Paginación para grandes conjuntos de datos
* Notificaciones de webhooks para cambios en las suscripciones
* Documentación completa con ejemplos prácticos

### Qué ofrecen otros procesadores en comparación con PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Lista de todas las suscripciones:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtrar por cliente:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrar por estado:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Lo que realmente obtienes:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Puntos finales disponibles de PayPal:**

* `POST /v1/billing/subscriptions` - Crear una suscripción
* `GET /v1/billing/subscriptions/{id}` - Obtener UNA suscripción (si conoce el ID)
* `PATCH /v1/billing/subscriptions/{id}` - Actualizar una suscripción
* `POST /v1/billing/subscriptions/{id}/cancel` - Cancelar suscripción
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspender suscripción

**Lo que falta en PayPal:**

* ❌ Sin `GET /v1/billing/subscriptions` (listar todos)
* ❌ Sin función de búsqueda
* ❌ Sin filtro por estado, cliente o fecha
* ❌ Sin paginación

PayPal es el único procesador de pagos importante que obliga a los desarrolladores a rastrear manualmente los ID de suscripción en sus propias bases de datos.

El encubrimiento sistemático de PayPal: silenciando 6 millones de voces {#paypals-systematic-cover-up-silencing-6-million-voices}

En una acción que encapsula perfectamente el enfoque de PayPal para manejar las críticas, recientemente desconectaron todo el foro de su comunidad, silenciando efectivamente a más de 6 millones de miembros y borrando cientos de miles de publicaciones que documentaban sus fallas.

### El Gran Borrado {#the-great-erasure}

La comunidad original de PayPal en `paypal-community.com` albergaba a **6.003.558 miembros** y contenía cientos de miles de publicaciones, informes de errores, quejas y debates sobre los fallos de la API de PayPal. Esto representaba más de una década de evidencia documentada de los problemas sistemáticos de PayPal.

El 30 de junio de 2025, PayPal desactivó discretamente todo el foro. Todos los enlaces `paypal-community.com` ahora muestran errores 404. Esto no fue una migración ni una actualización.

### El rescate de terceros {#the-third-party-rescue}

Afortunadamente, un servicio externo en [ppl.lithium.com](https://ppl.lithium.com/) ha preservado parte del contenido, lo que nos permite acceder a las conversaciones que PayPal intentó ocultar. Sin embargo, esta preservación externa es incompleta y podría desaparecer en cualquier momento.

Este patrón de ocultar evidencia no es nuevo para PayPal. Tienen un historial documentado de:

* Eliminar informes de errores críticos del acceso público.
* Interrumpir el uso de herramientas para desarrolladores sin previo aviso.
* Modificar las API sin la documentación adecuada.
* Silenciar las discusiones de la comunidad sobre sus fallos.

El cierre del foro representa el intento más descarado hasta el momento de ocultar sus fallas sistemáticas al escrutinio público.

## El desastre de la captura de errores de 11 años: $1,899 y contando {#the-11-year-capture-bug-disaster-1899-and-counting}

Mientras PayPal organizaba sesiones de retroalimentación y hacía promesas, su sistema principal de procesamiento de pagos lleva más de 11 años fallando fundamentalmente. La evidencia es devastadora.

### Pérdida de $1,899 en reenvíos de correo electrónico {#forward-emails-1899-loss}

En nuestros sistemas de producción, detectamos 108 pagos de PayPal por un total de **$1,899** que se perdieron debido a fallos de captura de PayPal. Estos pagos muestran un patrón consistente:

* Se recibieron `CHECKOUT.ORDER.APPROVED` webhooks
* La API de captura de PayPal devolvió errores 404
* Los pedidos se volvieron inaccesibles a través de la API de PayPal

Es imposible determinar si se cobró a los clientes ya que PayPal oculta completamente los registros de depuración después de 14 días y borra todos los datos del panel de control de los ID de pedidos que no se capturaron.

Esto representa solo una empresa. **Las pérdidas colectivas de miles de comerciantes durante más de 11 años probablemente suman millones de dólares.**

**Lo diremos otra vez: las pérdidas colectivas de miles de comerciantes durante más de 11 años probablemente suman millones de dólares.**

La única razón por la que descubrimos esto es porque somos increíblemente meticulosos y nos basamos en los datos.

### El Informe Original de 2013: Más de 11 años de negligencia {#the-2013-original-report-11-years-of-negligence}

El primer informe documentado de este problema exacto aparece en [Stack Overflow en noviembre de 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivado](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Sigo recibiendo el error 404 con Rest API al realizar una captura"

El error informado en 2013 es **idéntico** al que experimentó Forward Email en 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

La respuesta de la comunidad en 2013 fue reveladora:

> "Hay un problema reportado en este momento con la API REST. PayPal está trabajando en ello".

**11 años después, todavía están "trabajando en ello".**

### La admisión de 2016: PayPal rompe su propio SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

En 2016, el repositorio de GitHub de PayPal documentó que [fallos de captura masivos](https://github.com/paypal/PayPal-PHP-SDK/issues/660) afectaba a su SDK oficial de PHP. La magnitud era asombrosa:

Desde el 20/9/2016, todos los intentos de captura de PayPal han fallado con el error 'INVALID_RESOURCE_ID - No se encontró el ID del recurso solicitado'. No se realizó ningún cambio entre el 19/9 y el 20/9 en la integración de la API. **El 100 % de los intentos de captura desde el 20/9 han devuelto este error.**

Un comerciante informó:

> "He tenido **más de 1400 intentos de captura fallidos en las últimas 24 horas**, todos con la respuesta de error INVALID_RESOURCE_ID".

La respuesta inicial de PayPal fue culpar al comerciante y remitirlo al soporte técnico. Solo tras una gran presión admitieron la culpa:

Tengo una actualización de nuestros desarrolladores de productos. Observan que, en los encabezados que se envían, el ID de solicitud de PayPal se envía con 42 caracteres, pero **parece que se produjo un cambio reciente que limita este ID a solo 38 caracteres**.

Esta admisión revela la negligencia sistemática de PayPal:

1. **Hicieron cambios disruptivos sin documentar**
2. **Rompieron su propio SDK oficial**
3. **Primero culparon a los comerciantes**
4. **Solo admitieron su culpa bajo presión**

Incluso después de "solucionar" el problema, los comerciantes informaron:

> "Actualicé el SDK a la versión 1.7.4 y **el problema persiste**."

### La escalada de 2024: sigue rota {#the-2024-escalation-still-broken}

Informes recientes de la comunidad de PayPal preservada muestran que el problema ha empeorado. Un [Discusión de septiembre de 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivado](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenta exactamente los mismos problemas:

El problema comenzó a aparecer hace apenas dos semanas y no afecta a todos los pedidos. **El más común parece ser el error 404 al capturar.**

El comerciante describe el mismo patrón que experimentó Forward Email:

Tras intentar capturar el pedido, PayPal devuelve un error 404. Al recuperar los detalles del pedido: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Esto ocurre sin que hayamos detectado una captura exitosa por nuestra parte.**

### El desastre de confiabilidad del webhook {#the-webhook-reliability-disaster}

Otro [discusión comunitaria preservada](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) revela que el sistema de webhook de PayPal es fundamentalmente poco confiable:

En teoría, debería haber dos eventos (CHECKOUT.ORDER.APPROVED y PAYMENT.CAPTURE.COMPLETED) en el evento del webhook. Sin embargo, estos dos eventos rara vez se reciben de inmediato. PAYMENT.CAPTURE.COMPLETED no se recibe la mayoría de las veces o se recibiría en pocas horas.

Para pagos de suscripciones:

> "**'PAGO.VENTA.COMPLETADO' no se recibía en algunas ocasiones o hasta pasadas algunas horas.**"

Las preguntas del comerciante revelan la profundidad de los problemas de confiabilidad de PayPal:

1. **"¿Por qué sucede esto?"** - El sistema de webhooks de PayPal está completamente roto.
2. **"Si el estado del pedido es 'COMPLETADO', ¿puedo considerar que he recibido el dinero?"** - Los comerciantes no pueden confiar en las respuestas de la API de PayPal.
3. **"¿Por qué 'Registros de eventos->Eventos de webhooks' no encuentra ningún registro?"** - Ni siquiera el propio sistema de registro de PayPal funciona.

### El patrón de negligencia sistemática {#the-pattern-of-systematic-negligence}

La evidencia abarca más de 11 años y muestra un patrón claro:

**2013**: "PayPal está trabajando en ello"
* **2016**: PayPal admite un cambio radical y ofrece una solución deficiente
* **2024**: Siguen ocurriendo los mismos errores, que afectan a Forward Email y a muchos otros.

Esto no es un error: **es una negligencia sistemática.** PayPal conoce estas fallas críticas en el procesamiento de pagos desde hace más de una década y constantemente:

1. **Culparon a los comerciantes por los errores de PayPal**
2. **Realizaron cambios disruptivos sin documentar**
3. **Proporcionaron soluciones inadecuadas que no funcionan**
4. **Ignoraron el impacto financiero en las empresas**
5. **Ocultaron pruebas al eliminar foros de la comunidad**

### El requisito no documentado {#the-undocumented-requirement}

En la documentación oficial de PayPal no se menciona que los comerciantes deban implementar la lógica de reintento para las operaciones de captura. Su documentación indica que los comerciantes deben "capturar inmediatamente después de la aprobación", pero no menciona que su API devuelve aleatoriamente errores 404, lo que requiere complejos mecanismos de reintento.

Esto obliga a cada comerciante a:

* Implementar lógica de reintento con retroceso exponencial
* Gestionar la entrega inconsistente de webhooks
* Desarrollar sistemas complejos de gestión de estados
* Supervisar manualmente las capturas fallidas

**Todos los demás procesadores de pagos ofrecen API de captura confiables que funcionan la primera vez.**

## El patrón más amplio de engaño de PayPal {#paypals-broader-pattern-of-deception}

El desastre del error de captura es sólo un ejemplo del enfoque sistemático de PayPal para engañar a los clientes y ocultar sus fallos.

### Acción del Departamento de Servicios Financieros de Nueva York {#the-new-york-department-of-financial-services-action}

En enero de 2025, el Departamento de Servicios Financieros de Nueva York emitió un [acción de cumplimiento contra PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) por prácticas engañosas, lo que demuestra que el patrón de engaño de PayPal se extiende mucho más allá de sus API.

Esta acción regulatoria demuestra la voluntad de PayPal de participar en prácticas engañosas en todo su negocio, no solo en sus herramientas para desarrolladores.

### La demanda de Honey: reescritura de enlaces de afiliados {#the-honey-lawsuit-rewriting-affiliate-links}

La adquisición de Honey por parte de PayPal ha resultado en [Demandas que alegan que Honey reescribe los enlaces de afiliados](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), que roba comisiones a creadores de contenido e influencers. Esto representa otra forma de engaño sistemático donde PayPal se beneficia al redirigir ingresos que deberían ir a otros.

El patrón es claro:

1. **Fallos de API**: Ocultar funcionalidades defectuosas y culpar a los comerciantes
2. **Silenciamiento de la comunidad**: Eliminar evidencia de los problemas
3. **Infracciones regulatorias**: Incurrir en prácticas engañosas
4. **Robo de afiliados**: Robar comisiones mediante manipulación técnica

### El costo de la negligencia de PayPal {#the-cost-of-paypals-negligence}

La pérdida de $1,899 de Forward Email representa solo la punta del iceberg. Considere el impacto más amplio:

**Comerciantes individuales**: Miles de personas pierden cientos o miles de dólares cada una
* **Clientes empresariales**: Millones de dólares en ingresos perdidos
* **Tiempo de desarrollo**: Incontables horas creando soluciones alternativas para las API defectuosas de PayPal
* **Confianza del cliente**: Empresas pierden clientes debido a los fallos de pago de PayPal

Si un pequeño servicio de correo electrónico perdió casi $2,000, y este problema ha existido durante más de 11 años afectando a miles de comerciantes, el daño financiero colectivo probablemente asciende a **cientos de millones de dólares**.

### La mentira de la documentación {#the-documentation-lie}

La documentación oficial de PayPal omite sistemáticamente las limitaciones y errores críticos que pueden encontrar los comerciantes. Por ejemplo:

* **API de captura**: No se menciona que los errores 404 son comunes y requieren lógica de reintento.
* **Fiabilidad de los webhooks**: No se menciona que los webhooks suelen tener retrasos de horas.
* **Listado de suscripciones**: La documentación implica que el listado es posible cuando no existe un punto final.
* **Tiempos de espera de sesión**: No se mencionan tiempos de espera agresivos de 60 segundos.

Esta omisión sistemática de información crítica obliga a los comerciantes a descubrir las limitaciones de PayPal a través de prueba y error en los sistemas de producción, lo que a menudo resulta en pérdidas financieras.

## Qué significa esto para los desarrolladores {#what-this-means-for-developers}

El fracaso sistemático de PayPal para atender las necesidades básicas de los desarrolladores al recopilar una amplia retroalimentación demuestra un problema organizativo fundamental. Consideran la recopilación de retroalimentación como un sustituto de la solución efectiva de los problemas.

El patrón es claro:

1. Los desarrolladores reportan problemas
2. PayPal organiza sesiones de retroalimentación con los ejecutivos
3. Se proporciona retroalimentación exhaustiva
4. Los equipos reconocen las deficiencias y prometen "dar seguimiento y abordarlas"
5. No se implementa nada
6. Los ejecutivos se van a mejores empresas
7. Los nuevos equipos solicitan la misma retroalimentación
8. El ciclo se repite

Mientras tanto, los desarrolladores se ven obligados a crear soluciones alternativas, comprometer la seguridad y lidiar con interfaces de usuario rotas solo para aceptar pagos.

Si está creando un sistema de pagos, aprenda de nuestra experiencia: cree su [enfoque trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) con varios procesadores, pero no espere que PayPal le proporcione la funcionalidad básica que necesita. Planifique soluciones alternativas desde el primer día.

Esta publicación documenta nuestra experiencia de 11 años con las API de PayPal en Forward Email. Todos los ejemplos de código y enlaces provienen de nuestros sistemas de producción. Seguimos ofreciendo soporte para pagos con PayPal a pesar de estos problemas, ya que algunos clientes no tienen otra opción.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />