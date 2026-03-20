# El desastre de 11 años de la API de PayPal: Cómo construimos soluciones alternativas mientras ellos ignoraban a los desarrolladores {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **¡Éxito! PayPal finalmente ha añadido el endpoint `GET /v1/billing/subscriptions`.**
>
> Después de publicar esta entrada y enviarla por correo electrónico a la alta dirección de PayPal, sus equipos implementaron el tan necesario endpoint para listar suscripciones. El cambio apareció en algún momento entre el [25 de junio de 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) y el [9 de julio de 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Sin embargo, al más puro estilo de PayPal, nunca nos notificaron. Solo descubrimos esta actualización por nuestra cuenta en diciembre de 2025, meses después de que la función fuera lanzada silenciosamente.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="Ilustración del desastre de la API de PayPal" class="rounded-lg" />

<p class="lead mt-3">En Forward Email, hemos estado lidiando con las APIs rotas de PayPal durante más de una década. Lo que comenzó como pequeñas frustraciones se convirtió en un desastre completo que nos obligó a construir nuestras propias soluciones alternativas, bloquear sus plantillas de phishing y, finalmente, detener todos los pagos de PayPal durante una migración crítica de cuentas.</p>
<p class="lead mt-3">Esta es la historia de 11 años de PayPal ignorando las necesidades básicas de los desarrolladores mientras nosotros intentábamos de todo para hacer que su plataforma funcionara.</p>


## Tabla de Contenidos {#table-of-contents}

* [La pieza que falta: No hay forma de listar suscripciones](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Surge el problema](#2014-2017-the-problem-emerges)
* [2020: Les damos una retroalimentación extensa](#2020-we-give-them-extensive-feedback)
  * [La lista de retroalimentación de 27 puntos](#the-27-item-feedback-list)
  * [Los equipos se involucraron, se hicieron promesas](#teams-got-involved-promises-were-made)
  * [¿El resultado? Nada.](#the-result-nothing)
* [La salida ejecutiva: Cómo PayPal perdió toda la memoria institucional](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nueva dirección, mismos problemas](#2025-new-leadership-same-problems)
  * [El nuevo CEO se involucra](#the-new-ceo-gets-involved)
  * [La respuesta de Michelle Gill](#michelle-gills-response)
  * [Nuestra respuesta: No más reuniones](#our-response-no-more-meetings)
  * [La respuesta de Marty Brodbeck: sobreingeniería](#marty-brodbecks-overengineering-response)
  * [La contradicción del "CRUD simple"](#the-simple-crud-contradiction)
  * [La desconexión se vuelve clara](#the-disconnect-becomes-clear)
* [Años de reportes de errores que ignoraron](#years-of-bug-reports-they-ignored)
  * [2016: Quejas tempranas de UI/UX](#2016-early-uiux-complaints)
  * [2021: Reporte de error en correo empresarial](#2021-business-email-bug-report)
  * [2021: Sugerencias para mejorar la UI](#2021-ui-improvement-suggestions)
  * [2021: Fallos en el entorno sandbox](#2021-sandbox-environment-failures)
  * [2021: Sistema de reportes completamente roto](#2021-reports-system-completely-broken)
  * [2022: Función principal de la API faltante (otra vez)](#2022-core-api-feature-missing-again)
* [La pesadilla de la experiencia del desarrollador](#the-developer-experience-nightmare)
  * [Interfaz de usuario rota](#broken-user-interface)
  * [Problemas con el SDK](#sdk-problems)
  * [Violaciones de la política de seguridad de contenido](#content-security-policy-violations)
  * [Caos en la documentación](#documentation-chaos)
  * [Vulnerabilidades de seguridad](#security-vulnerabilities)
  * [Desastre en la gestión de sesiones](#session-management-disaster)
* [Julio 2025: La gota que colmó el vaso](#july-2025-the-final-straw)
* [Por qué no podemos simplemente dejar PayPal](#why-we-cant-just-drop-paypal)
* [La solución alternativa de la comunidad](#the-community-workaround)
* [Bloqueando plantillas de PayPal debido a phishing](#blocking-paypal-templates-due-to-phishing)
  * [El verdadero problema: Las plantillas de PayPal parecen estafas](#the-real-problem-paypals-templates-look-like-scams)
  * [Nuestra implementación](#our-implementation)
  * [Por qué tuvimos que bloquear PayPal](#why-we-had-to-block-paypal)
  * [La escala del problema](#the-scale-of-the-problem)
  * [La ironía](#the-irony)
  * [Impacto en el mundo real: Nuevas estafas de PayPal](#real-world-impact-novel-paypal-scams)
* [El proceso KYC al revés de PayPal](#paypals-backwards-kyc-process)
  * [Cómo debería funcionar](#how-it-should-work)
  * [Cómo funciona realmente PayPal](#how-paypal-actually-works)
  * [El impacto en el mundo real](#the-real-world-impact)
  * [El desastre de la migración de cuentas de julio de 2025](#the-july-2025-account-migration-disaster)
  * [Por qué esto importa](#why-this-matters)
* [Cómo lo hacen bien todos los demás procesadores de pago](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [El estándar de la industria](#the-industry-standard)
  * [Lo que otros procesadores ofrecen vs PayPal](#what-other-processors-provide-vs-paypal)
* [La encubierta sistemática de PayPal: Silenciando 6 millones de voces](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [El gran borrado](#the-great-erasure)
  * [El rescate de terceros](#the-third-party-rescue)
* [El desastre del bug de captura de 11 años: $1,899 y contando](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [La pérdida de $1,899 de Forward Email](#forward-emails-1899-loss)
  * [El reporte original de 2013: Más de 11 años de negligencia](#the-2013-original-report-11-years-of-negligence)
  * [La admisión de 2016: PayPal rompe su propio SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [La escalada de 2024: Sigue roto](#the-2024-escalation-still-broken)
  * [El desastre de la fiabilidad del webhook](#the-webhook-reliability-disaster)
  * [El patrón de negligencia sistemática](#the-pattern-of-systematic-negligence)
  * [El requisito no documentado](#the-undocumented-requirement)
* [El patrón más amplio de engaño de PayPal](#paypals-broader-pattern-of-deception)
  * [La acción del Departamento de Servicios Financieros de Nueva York](#the-new-york-department-of-financial-services-action)
  * [La demanda de Honey: Reescribiendo enlaces de afiliados](#the-honey-lawsuit-rewriting-affiliate-links)
  * [El costo de la negligencia de PayPal](#the-cost-of-paypals-negligence)
  * [La mentira de la documentación](#the-documentation-lie)
* [Lo que esto significa para los desarrolladores](#what-this-means-for-developers)
## La pieza que falta: No hay forma de listar suscripciones {#the-missing-piece-no-way-to-list-subscriptions}

Esto es lo que nos deja boquiabiertos: PayPal tiene facturación por suscripción desde 2014, pero nunca ha proporcionado una forma para que los comerciantes puedan listar sus propias suscripciones.

Piénsalo un segundo. Puedes crear suscripciones, puedes cancelarlas si tienes el ID, pero no puedes obtener una lista de todas las suscripciones activas de tu cuenta. Es como tener una base de datos sin una sentencia SELECT.

Necesitamos esto para operaciones básicas del negocio:

* Soporte al cliente (cuando alguien envía un correo preguntando sobre su suscripción)
* Reportes financieros y conciliación
* Gestión automatizada de facturación
* Cumplimiento y auditoría

Pero PayPal? Simplemente... nunca lo construyeron.


## 2014-2017: Surge el problema {#2014-2017-the-problem-emerges}

El problema de listar suscripciones apareció por primera vez en los foros comunitarios de PayPal en 2017. Los desarrolladores hacían la pregunta obvia: "¿Cómo obtengo una lista de todas mis suscripciones?"

¿La respuesta de PayPal? Silencio.

Los miembros de la comunidad empezaron a frustrarse:

> "Omisión muy extraña si un comerciante no puede listar todos los Acuerdos activos. Si se pierde el ID del Acuerdo esto significa que solo el usuario puede cancelar o suspender un acuerdo." - leafspider

> "+1. Han pasado casi 3 años." - laudukang (lo que significa que el problema existía desde \~2014)

La [publicación original en la comunidad](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) de 2017 muestra a desarrolladores suplicando por esta funcionalidad básica. La respuesta de PayPal fue archivar el repositorio donde la gente reportaba el problema.


## 2020: Les damos una retroalimentación extensa {#2020-we-give-them-extensive-feedback}

En octubre de 2020, PayPal nos contactó para una sesión formal de retroalimentación. No fue una charla casual: organizaron una llamada de 45 minutos por Microsoft Teams con 8 ejecutivos de PayPal incluyendo a Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze y otros.

### La lista de retroalimentación de 27 puntos {#the-27-item-feedback-list}

Llegamos preparados. Después de 6 horas intentando integrar con sus APIs, habíamos compilado 27 problemas específicos. Mark Stuart del equipo de PayPal Checkout dijo:

> Hola Nick, gracias por compartir con todos hoy! Creo que esto será el catalizador para obtener más apoyo e inversión para que nuestro equipo vaya y arregle estas cosas. Ha sido difícil obtener retroalimentación tan detallada como la que nos has dejado hasta ahora.

La retroalimentación no fue teórica, vino de intentos reales de integración:

1. **Generación de token de acceso que no funciona**:

> La generación del token de acceso no funciona. Además, debería haber más que solo ejemplos en cURL.

2. **No hay interfaz web para crear suscripciones**:

> ¿Cómo demonios puedes crear suscripciones sin tener que hacerlo usando cURL? No parece haber una interfaz web para esto (como la que tiene Stripe)

Mark Stuart encontró particularmente preocupante el problema del token de acceso:

> Normalmente no escuchamos problemas relacionados con la generación del token de acceso.

### Equipos se involucraron, se hicieron promesas {#teams-got-involved-promises-were-made}

A medida que descubríamos más problemas, PayPal siguió sumando más equipos a la conversación. Darshan Raju del equipo de gestión de UI de Suscripciones se unió y dijo:

> Reconocemos la brecha. Lo vamos a rastrear y abordar. ¡Gracias de nuevo por tu retroalimentación!

La sesión fue descrita como una:

> revisión sincera de tu experiencia

para:

> hacer de PayPal lo que debería ser para los desarrolladores.

### ¿El resultado? Nada. {#the-result-nothing}

A pesar de la sesión formal de retroalimentación, la extensa lista de 27 puntos, la participación de múltiples equipos y las promesas de:

> rastrear y abordar

los problemas, absolutamente nada se arregló.


## La salida de ejecutivos: Cómo PayPal perdió toda memoria institucional {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Aquí es donde se pone realmente interesante. Todas las personas que recibieron nuestra retroalimentación en 2020 han dejado PayPal:

**Cambios en el liderazgo:**

* [Dan Schulman (CEO por 9 años) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (septiembre 2023)
* [Sri Shivananda (CTO que organizó la retroalimentación) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (enero 2024)
**Líderes Técnicos Que Hicieron Promesas, Luego Se Fueron:**

* **Mark Stuart** (prometió que el feedback sería un "catalizador") → [Ahora en Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veterano de PayPal por 18 años) → [CEO de MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP de Producto Global para Consumidores) → [Retirado](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (uno de los últimos que quedaban) → [Recién se fue a Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (enero 2025)

PayPal se ha convertido en una puerta giratoria donde los ejecutivos recogen feedback de desarrolladores, hacen promesas y luego se van a mejores empresas como JPMorgan, Ripple y otras firmas fintech.

Esto explica por qué la respuesta al issue de GitHub en 2025 parecía completamente desconectada de nuestro feedback de 2020: literalmente todos los que recibieron ese feedback ya se han ido de PayPal.


## 2025: Nueva Liderazgo, Mismos Problemas {#2025-new-leadership-same-problems}

Avanzando rápido a 2025, emerge el mismo patrón exacto. Después de años sin progreso, el nuevo liderazgo de PayPal vuelve a contactarnos.

### El Nuevo CEO Se Involucra {#the-new-ceo-gets-involved}

El 30 de junio de 2025, escalamos directamente al nuevo CEO de PayPal, Alex Chriss. Su respuesta fue breve:

> Hola Nick – Gracias por contactarnos y por el feedback. Michelle (en copia) está al frente con su equipo para involucrarse y trabajar esto contigo. Gracias -A

### Respuesta de Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP y Gerente General de Pequeñas Empresas y Servicios Financieros, respondió:

> Muchas gracias Nick, moviendo a Alex a copia oculta. Hemos estado investigando esto desde tu publicación anterior. Te llamaremos antes de que termine la semana. ¿Puedes enviarme tu información de contacto para que uno de mis colegas pueda comunicarse contigo? Michelle

### Nuestra Respuesta: No Más Reuniones {#our-response-no-more-meetings}

Rechazamos otra reunión, explicando nuestra frustración:

> Gracias. Sin embargo, no siento que una llamada vaya a lograr nada. Esto es por qué... En el pasado tuve una llamada y no llevó a ningún lado. Perdí más de 2 horas de mi tiempo hablando con todo el equipo y liderazgo y no se hizo nada... Montones de correos de ida y vuelta. Absolutamente nada hecho. El feedback no llevó a nada. Intenté durante años, me escucharon, y luego no pasó nada.

### Respuesta de Sobreingeniería de Marty Brodbeck {#marty-brodbecks-overengineering-response}

Luego Marty Brodbeck, quien dirige la ingeniería de consumidor en PayPal, se comunicó:

> Hola Nick, soy Marty Brodbeck. Dirijo toda la ingeniería de consumidor aquí en PayPal y he estado impulsando el desarrollo de la API para la compañía. ¿Podemos conectar para hablar del problema que estás enfrentando y cómo podemos ayudar?

Cuando explicamos la necesidad simple de un endpoint para listar suscripciones, su respuesta reveló el problema exacto:

> Gracias Nick, estamos en proceso de crear una API única de suscripciones con SDK completo (soporta manejo completo de errores, seguimiento de suscripciones basado en eventos, alta disponibilidad) donde la facturación también está separada como una API distinta para que los comerciantes la usen en lugar de tener que orquestar múltiples endpoints para obtener una sola respuesta.

Este es exactamente el enfoque equivocado. No necesitamos meses de arquitectura compleja. Necesitamos un endpoint REST simple que liste suscripciones, algo que debería haber existido desde 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### La Contradicción del "CRUD Simple" {#the-simple-crud-contradiction}

Cuando señalamos que esta era una funcionalidad básica de CRUD que debería haber existido desde 2014, la respuesta de Marty fue reveladora:

> Las operaciones CRUD simples son parte de la API principal, amigo, así que no tomará meses de desarrollo

El SDK de TypeScript de PayPal, que actualmente soporta solo tres endpoints después de meses de desarrollo, junto con su línea de tiempo histórica, demuestra claramente que proyectos así requieren más que unos pocos meses para completarse.
Esta respuesta muestra que él no entiende su propia API. Si "las operaciones CRUD simples son parte de la API principal", entonces ¿dónde está el endpoint para listar suscripciones? Respondimos:

> Si 'las operaciones CRUD simples son parte de la API principal' entonces ¿dónde está el endpoint para listar suscripciones? Los desarrolladores han estado pidiendo esta 'operación CRUD simple' desde 2014. Han pasado 11 años. Todos los demás procesadores de pagos han tenido esta funcionalidad básica desde el primer día.

### La desconexión se vuelve clara {#the-disconnect-becomes-clear}

Los intercambios de 2025 con Alex Chriss, Michelle Gill y Marty Brodbeck muestran la misma disfunción organizacional:

1. **El nuevo liderazgo no tiene conocimiento de las sesiones de retroalimentación previas**
2. **Proponen las mismas soluciones sobreingenierizadas**
3. **No entienden las limitaciones de su propia API**
4. **Quieren más reuniones en lugar de simplemente solucionar el problema**

Este patrón explica por qué los equipos de PayPal en 2025 parecen completamente desconectados de la extensa retroalimentación proporcionada en 2020: las personas que recibieron esa retroalimentación ya no están, y el nuevo liderazgo está repitiendo los mismos errores.


## Años de reportes de errores que ignoraron {#years-of-bug-reports-they-ignored}

No solo nos quejamos por funciones faltantes. Reportamos activamente errores e intentamos ayudarles a mejorar. Aquí hay una línea de tiempo completa de los problemas que documentamos:

### 2016: Primeras quejas de UI/UX {#2016-early-uiux-complaints}

Incluso en 2016, estábamos contactando públicamente al liderazgo de PayPal, incluyendo a Dan Schulman, sobre problemas de interfaz y usabilidad. Esto fue hace 9 años, y los mismos problemas de UI/UX persisten hoy.

### 2021: Reporte de error en correo electrónico empresarial {#2021-business-email-bug-report}

En marzo de 2021, reportamos que el sistema de correo electrónico empresarial de PayPal enviaba notificaciones de cancelación incorrectas. La plantilla de correo tenía variables mal renderizadas, mostrando mensajes confusos a los clientes.

Mark Stuart reconoció el problema:

> ¡Gracias Nick! Pasando a CCO. @Prasy, ¿tu equipo es responsable de este correo o saben quién lo es? El "Niftylettuce, LLC, ya no te facturaremos" me hace pensar que hay una confusión en a quién va dirigido y el contenido del correo.

**Resultado**: ¡De hecho arreglaron este! Mark Stuart confirmó:

> Acabo de escuchar del equipo de notificaciones que la plantilla del correo ha sido corregida y desplegada. Aprecio que hayas reportado esto. ¡Gracias!

Esto muestra que PUEDEN arreglar cosas cuando quieren; simplemente eligen no hacerlo en la mayoría de los casos.

### 2021: Sugerencias de mejora de UI {#2021-ui-improvement-suggestions}

En febrero de 2021, proporcionamos retroalimentación detallada sobre la UI de su panel, específicamente la sección "Actividad Reciente de PayPal":

> Creo que el panel en paypal.com, específicamente "Actividad Reciente de PayPal", necesita mejoras. No creo que deban mostrar las líneas de estado "Creado" para pagos recurrentes de $0; solo añade muchas líneas extra y no se puede ver fácilmente de un vistazo cuánto ingreso se está generando para el día/días pasados.

Mark Stuart lo reenvió al equipo de productos para consumidores:

> ¡Gracias! No estoy seguro de qué equipo es responsable de Actividad, pero lo reenvié al jefe de productos para consumidores para encontrar el equipo correcto. Un pago recurrente de $0.00 parece un error. Probablemente debería filtrarse.

**Resultado**: Nunca se arregló. La UI todavía muestra estas entradas inútiles de $0.

### 2021: Fallos en el entorno Sandbox {#2021-sandbox-environment-failures}

En noviembre de 2021, reportamos problemas críticos con el entorno sandbox de PayPal:

* Las claves secretas API del sandbox se cambiaban y deshabilitaban aleatoriamente
* Todas las cuentas de prueba sandbox fueron eliminadas sin aviso
* Mensajes de error al intentar ver detalles de cuentas sandbox
* Fallos intermitentes de carga

> Por alguna razón mi clave secreta API del sandbox fue cambiada y deshabilitada. Además, todas mis cuentas de prueba sandbox antiguas fueron eliminadas.

> A veces cargan y a veces no también. Esto es increíblemente frustrante.

**Resultado**: Sin respuesta, sin solución. Los desarrolladores aún enfrentan problemas de confiabilidad en sandbox.

### 2021: Sistema de reportes completamente roto {#2021-reports-system-completely-broken}
En mayo de 2021, informamos que el sistema de descarga de PayPal para informes de transacciones estaba completamente roto:

> Parece que las descargas de informes no funcionan en este momento y no han funcionado en todo el día. También probablemente deberían enviar una notificación por correo electrónico si falla.

También señalamos el desastre en la gestión de sesiones:

> Además, si estás inactivo mientras estás conectado a PayPal durante unos 5 minutos, te desconectan. Así que cuando actualizas el botón junto al informe cuyo estado quieres verificar (después de esperar una eternidad), es un fastidio tener que iniciar sesión de nuevo.

Mark Stuart reconoció el problema del tiempo de espera de la sesión:

> Recuerdo que habías reportado eso en el pasado con tu sesión expirando frecuentemente y interrumpiendo tu flujo de desarrollo mientras alternabas entre tu IDE y developer.paypal.com o tu panel de comerciante, luego volvías y te desconectaban otra vez.

**Resultado**: Los tiempos de espera de sesión siguen siendo de 60 segundos. El sistema de informes sigue fallando regularmente.

### 2022: Función Principal de la API Faltante (Otra Vez) {#2022-core-api-feature-missing-again}

En enero de 2022, escalamos nuevamente el problema del listado de suscripciones, esta vez con aún más detalle sobre cómo su documentación estaba equivocada:

> No existe un GET que liste todas las suscripciones (anteriormente llamadas acuerdos de facturación)

Descubrimos que su documentación oficial era completamente inexacta:

> La documentación de la API también es totalmente inexacta. Pensamos que podríamos hacer una solución alternativa descargando una lista codificada de ID de suscripciones. ¡Pero eso ni siquiera funciona!

> En la documentación oficial aquí... Dice que puedes hacer esto... Aquí está lo importante: no hay ningún campo "ID de Suscripción" en ninguna parte para marcar.

Christina Monti de PayPal respondió:

> Pedimos disculpas por las frustraciones causadas por estos pasos incorrectos, lo corregiremos esta semana.

Sri Shivananda (CTO) nos agradeció:

> Gracias por tu ayuda continua para hacernos mejores. Muy apreciado.

**Resultado**: La documentación nunca fue corregida. El endpoint para listar suscripciones nunca fue creado.


## La Pesadilla de la Experiencia del Desarrollador {#the-developer-experience-nightmare}

Trabajar con las APIs de PayPal es como retroceder 10 años en el tiempo. Aquí están los problemas técnicos que hemos documentado:

### Interfaz de Usuario Rota {#broken-user-interface}

El panel de desarrollador de PayPal es un desastre. Esto es con lo que lidiamos diariamente:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  La interfaz de PayPal está tan rota que ni siquiera puedes descartar las notificaciones
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Tu navegador no soporta la etiqueta de video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  El panel de desarrollador literalmente te hace arrastrar un deslizador y luego te desconecta después de 60 segundos
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Tu navegador no soporta la etiqueta de video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Más desastres de la interfaz en la interfaz de desarrollador de PayPal mostrando flujos de trabajo rotos
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Tu navegador no soporta la etiqueta de video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  La interfaz de gestión de suscripciones - la interfaz es tan mala que tuvimos que depender del código para generar productos y planes de suscripción
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Captura de pantalla de suscripciones de PayPal" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Una vista de la interfaz rota de suscripciones con funcionalidad faltante (no puedes crear fácilmente productos/planes/suscripciones – y no parece haber manera alguna de eliminar productos ni planes una vez creados en la interfaz)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Captura de pantalla de suscripciones de PayPal 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Mensajes de error típicos de PayPal - crípticos y poco útiles
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemas del SDK {#sdk-problems}

* No puede manejar pagos únicos y suscripciones sin soluciones complejas que implican intercambiar y volver a renderizar botones mientras se recarga el SDK con etiquetas de script
* El SDK de JavaScript viola convenciones básicas (nombres de clase en minúsculas, sin verificación de instancia)
* Los mensajes de error no indican qué campos faltan
* Tipos de datos inconsistentes (requiriendo montos en cadena en lugar de números)

### Violaciones de la Política de Seguridad de Contenido {#content-security-policy-violations}

Su SDK requiere unsafe-inline y unsafe-eval en tu CSP, **obligándote a comprometer la seguridad de tu sitio**.

### Caos en la Documentación {#documentation-chaos}

El mismo Mark Stuart admitió:

> De acuerdo en que hay una cantidad absurda de APIs heredadas y nuevas. Realmente difícil encontrar qué buscar (incluso para nosotros que trabajamos aquí).

### Vulnerabilidades de Seguridad {#security-vulnerabilities}

**La implementación de 2FA de PayPal está al revés**. Incluso con aplicaciones TOTP habilitadas, obligan a la verificación por SMS, haciendo las cuentas vulnerables a ataques de intercambio de SIM. Si tienes TOTP habilitado, debería usarse exclusivamente. La alternativa debería ser el correo electrónico, no SMS.

### Desastre en la Gestión de Sesiones {#session-management-disaster}

**Su panel de desarrollador te cierra sesión después de 60 segundos de inactividad**. Intenta hacer algo productivo y constantemente pasas por: inicio de sesión → captcha → 2FA → cierre de sesión → repetir. ¿Usas una VPN? Buena suerte.


## Julio 2025: La Gota que Derramó el Vaso {#july-2025-the-final-straw}

Después de 11 años con los mismos problemas, el punto de quiebre llegó durante una migración rutinaria de cuenta. Necesitábamos cambiar a una nueva cuenta de PayPal para que coincidiera con el nombre de nuestra empresa "Forward Email LLC" para una contabilidad más limpia.

Lo que debería haber sido simple se convirtió en un desastre completo:

* Las pruebas iniciales mostraron que todo funcionaba correctamente
* Horas después, PayPal bloqueó repentinamente todos los pagos de suscripciones sin aviso
* Los clientes no podían pagar, creando confusión y carga para soporte
* El soporte de PayPal dio respuestas contradictorias afirmando que las cuentas estaban verificadas
* Nos vimos obligados a detener completamente los pagos con PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  El error que vieron los clientes al intentar pagar - sin explicación, sin registros, nada
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Soporte de PayPal afirmando que todo estaba bien mientras los pagos estaban completamente rotos. El mensaje final muestra que dicen haber "restaurado algunas funciones" pero aún piden más información no especificada - teatro clásico del soporte de PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  El proceso de verificación de identidad que supuestamente "no arregló" nada
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
  Mensaje vago y aún sin resolución. Cero información, avisos o cualquier indicio de qué información adicional se requiere. El soporte al cliente se queda en silencio.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Por qué no podemos simplemente dejar PayPal {#why-we-cant-just-drop-paypal}

A pesar de todos estos problemas, no podemos abandonar completamente PayPal porque algunos clientes solo tienen PayPal como opción de pago. Como dijo un cliente en nuestra [página de estado](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal es mi única opción de pago

**Estamos atrapados apoyando una plataforma rota porque PayPal ha creado un monopolio de pagos para ciertos usuarios.**


## La solución alternativa de la comunidad {#the-community-workaround}

Dado que PayPal no proporciona funcionalidades básicas para listar suscripciones, la comunidad de desarrolladores ha creado soluciones alternativas. Nosotros creamos un script que ayuda a gestionar suscripciones de PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Este script hace referencia a un [gist comunitario](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) donde los desarrolladores comparten soluciones. Los usuarios en realidad nos están [agradeciendo](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) por proporcionar lo que PayPal debería haber construido hace años.


## Bloqueo de plantillas de PayPal debido a phishing {#blocking-paypal-templates-due-to-phishing}

Los problemas van más allá de las APIs. Las plantillas de correo electrónico de PayPal están tan mal diseñadas que tuvimos que implementar un filtrado específico en nuestro servicio de correo porque son indistinguibles de intentos de phishing.

### El verdadero problema: las plantillas de PayPal parecen estafas {#the-real-problem-paypals-templates-look-like-scams}

Regularmente recibimos reportes de correos de PayPal que parecen exactamente intentos de phishing. Aquí hay un ejemplo real de nuestros reportes de abuso:

**Asunto:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Este correo fue reenviado a `abuse@microsoft.com` porque parecía un intento de phishing. ¿El problema? En realidad provenía del entorno sandbox de PayPal, pero el diseño de su plantilla es tan pobre que activa los sistemas de detección de phishing.

### Nuestra implementación {#our-implementation}

Puedes ver nuestro filtrado específico para PayPal implementado en nuestro [código de filtrado de correo](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

Implementamos esto porque PayPal se negó a solucionar los enormes problemas de spam/phishing/fraude a pesar de nuestros repetidos reportes a sus equipos de abuso. Los tipos específicos de correo que bloqueamos incluyen:

* **RT000238** - Notificaciones sospechosas de facturas
* **PPC001017** - Confirmaciones problemáticas de pago
* **RT000542** - Intentos de hackeo con mensajes de regalo

### La magnitud del problema {#the-scale-of-the-problem}

Nuestros registros de filtrado de spam muestran el enorme volumen de spam de facturas de PayPal que procesamos diariamente. Ejemplos de asuntos bloqueados incluyen:

* "Factura del equipo de facturación de PayPal:- Este cargo será debitado automáticamente de su cuenta. Por favor contáctenos inmediatamente al \[TELÉFONO]"
* "Factura de \[NOMBRE DE LA EMPRESA] (\[ID-DE-PEDIDO])"
* Varias variaciones con diferentes números de teléfono e IDs de pedido falsos
Estos correos electrónicos a menudo provienen de hosts `outlook.com` pero parecen originarse en los sistemas legítimos de PayPal, lo que los hace particularmente peligrosos. Los correos pasan la autenticación SPF, DKIM y DMARC porque se envían a través de la infraestructura real de PayPal.

Nuestros registros técnicos muestran que estos correos spam contienen encabezados legítimos de PayPal:

* `X-Email-Type-Id: RT000238` (el mismo ID que bloqueamos)
* `From: "service@paypal.com" <service@paypal.com>`
* Firmas DKIM válidas de `paypal.com`
* Registros SPF adecuados que muestran los servidores de correo de PayPal

Esto crea una situación imposible: los correos legítimos de PayPal y el spam tienen características técnicas idénticas.

### La ironía {#the-irony}

PayPal, una empresa que debería liderar la lucha contra el fraude financiero, tiene plantillas de correo electrónico tan mal diseñadas que activan los sistemas anti-phishing. Nos vemos obligados a bloquear correos legítimos de PayPal porque son indistinguibles de las estafas.

Esto está documentado en investigaciones de seguridad: [Cuidado con la nueva estafa de dirección de PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - que muestra cómo los propios sistemas de PayPal son explotados para el fraude.

### Impacto en el mundo real: nuevas estafas de PayPal {#real-world-impact-novel-paypal-scams}

El problema va más allá del mal diseño de las plantillas. El sistema de facturación de PayPal es tan fácilmente explotable que los estafadores lo abusan regularmente para enviar facturas fraudulentas que parecen legítimas. El investigador de seguridad Gavin Anderegg documentó [Una nueva estafa de PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) donde los estafadores envían facturas reales de PayPal que pasan todas las verificaciones de autenticación:

> "Al inspeccionar el origen, el correo parecía realmente provenir de PayPal (SPF, DKIM y DMARC todos pasaron). El botón también enlazaba a lo que parecía una URL legítima de PayPal... Me tomó un momento darme cuenta de que era un correo legítimo. Me acababan de enviar una 'factura' aleatoria de un estafador."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Captura de pantalla que muestra múltiples facturas fraudulentas de PayPal inundando una bandeja de entrada, todas aparentando ser legítimas porque realmente provienen de los sistemas de PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Captura de advertencia de estafa de PayPal" class="rounded-lg" />
</figure>

El investigador señaló:

> "También parece una función de conveniencia que PayPal debería considerar restringir. Inmediatamente asumí que era algún tipo de estafa y solo me interesaban los detalles técnicos. Parece demasiado fácil de realizar, y me preocupa que otros puedan caer en ella."

Esto ilustra perfectamente el problema: los propios sistemas legítimos de PayPal están tan mal diseñados que permiten el fraude mientras que al mismo tiempo hacen que las comunicaciones legítimas parezcan sospechosas.

Para empeorar las cosas, esto afectó nuestra entregabilidad con Yahoo, resultando en quejas de clientes y horas de pruebas meticulosas y revisión de patrones.


## El proceso KYC invertido de PayPal {#paypals-backwards-kyc-process}

Uno de los aspectos más frustrantes de la plataforma de PayPal es su enfoque invertido hacia el cumplimiento y los procedimientos de Conozca a su Cliente (KYC). A diferencia de cualquier otro procesador de pagos, PayPal permite a los desarrolladores integrar sus APIs y comenzar a cobrar pagos en producción antes de completar la verificación adecuada.

### Cómo debería funcionar {#how-it-should-work}

Cada procesador de pagos legítimo sigue esta secuencia lógica:

1. **Completar primero la verificación KYC**
2. **Aprobar la cuenta del comerciante**
3. **Proporcionar acceso a la API de producción**
4. **Permitir la recolección de pagos**

Esto protege tanto al procesador de pagos como al comerciante asegurando el cumplimiento antes de que se realice cualquier transacción.

### Cómo funciona realmente PayPal {#how-paypal-actually-works}

El proceso de PayPal es completamente invertido:

1. **Proporcionar acceso a la API de producción inmediatamente**
2. **Permitir la recolección de pagos durante horas o días**
3. **Bloquear repentinamente los pagos sin aviso**
4. **Exigir documentación KYC después de que los clientes ya se han visto afectados**
5. **No proporcionar ninguna notificación al comerciante**
6. **Dejar que los clientes descubran el problema y lo reporten**
### El Impacto en el Mundo Real {#the-real-world-impact}

Este proceso inverso crea desastres para las empresas:

* **Los clientes no pueden completar compras** durante los períodos de ventas pico
* **No hay advertencia previa** de que se necesita verificación
* **No hay notificaciones por correo electrónico** cuando los pagos son bloqueados
* **Los comerciantes se enteran de los problemas por clientes confundidos**
* **Pérdida de ingresos** durante períodos críticos para el negocio
* **Daño a la confianza del cliente** cuando los pagos fallan misteriosamente

### El Desastre de la Migración de Cuentas de Julio 2025 {#the-july-2025-account-migration-disaster}

Este escenario exacto ocurrió durante nuestra migración rutinaria de cuentas en julio de 2025. PayPal permitió que los pagos funcionaran inicialmente, luego los bloqueó repentinamente sin ninguna notificación. Solo descubrimos el problema cuando los clientes comenzaron a reportar que no podían pagar.

Cuando contactamos al soporte, recibimos respuestas contradictorias sobre qué documentación se necesitaba, sin un plazo claro para la resolución. Esto nos obligó a detener completamente los pagos con PayPal, confundiendo a los clientes que no tenían otras opciones de pago.

### Por Qué Esto Importa {#why-this-matters}

El enfoque de PayPal hacia el cumplimiento muestra un malentendido fundamental de cómo operan las empresas. El KYC adecuado debería ocurrir **antes** de la integración en producción, no después de que los clientes ya están intentando pagar. La falta de comunicación proactiva cuando surgen problemas demuestra la desconexión de PayPal con las necesidades de los comerciantes.

Este proceso inverso es sintomático de los problemas organizacionales más amplios de PayPal: priorizan sus procesos internos sobre la experiencia del comerciante y del cliente, lo que conduce a desastres operativos que alejan a las empresas de su plataforma.


## Cómo Lo Hacen Bien Todos los Demás Procesadores de Pago {#how-every-other-payment-processor-does-it-right}

La funcionalidad de listado de suscripciones que PayPal se niega a implementar ha sido estándar en la industria por más de una década. Así es como otros procesadores de pago manejan este requisito básico:

### Stripe {#stripe}

Stripe ha tenido listado de suscripciones desde que lanzaron su API. Su documentación muestra claramente cómo recuperar todas las suscripciones para un cliente o cuenta de comerciante. Esto se considera funcionalidad básica CRUD.

### Paddle {#paddle}

Paddle proporciona APIs completas de gestión de suscripciones que incluyen listado, filtrado y paginación. Entienden que los comerciantes necesitan ver sus flujos de ingresos recurrentes.

### Coinbase Commerce {#coinbase-commerce}

Incluso los procesadores de pagos con criptomonedas como Coinbase Commerce ofrecen mejor gestión de suscripciones que PayPal.

### Square {#square}

La API de Square incluye el listado de suscripciones como una función fundamental, no como una idea secundaria.

### El Estándar de la Industria {#the-industry-standard}

Cada procesador de pagos moderno ofrece:

* Listar todas las suscripciones
* Filtrar por estado, fecha, cliente
* Paginación para grandes conjuntos de datos
* Notificaciones webhook para cambios en suscripciones
* Documentación completa con ejemplos funcionales

### Lo Que Otros Procesadores Ofrecen vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Listar Todas las Suscripciones:**

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

**Stripe - Filtrar por Cliente:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrar por Estado:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Lo Que Realmente Obtienes:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Solo puedes obtener UNA suscripción si ya conoces el ID
# No hay ningún endpoint para listar todas las suscripciones
# No hay forma de buscar o filtrar
# Debes rastrear todos los IDs de suscripción tú mismo
```

**Endpoints Disponibles de PayPal:**

* `POST /v1/billing/subscriptions` - Crear una suscripción
* `GET /v1/billing/subscriptions/{id}` - Obtener UNA suscripción (si conoces el ID)
* `PATCH /v1/billing/subscriptions/{id}` - Actualizar una suscripción
* `POST /v1/billing/subscriptions/{id}/cancel` - Cancelar suscripción
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspender suscripción
**Lo que falta en PayPal:**

* ❌ No hay `GET /v1/billing/subscriptions` (listar todos)
* ❌ No hay funcionalidad de búsqueda
* ❌ No hay filtrado por estado, cliente, fecha
* ❌ No hay soporte para paginación

PayPal es el único procesador de pagos importante que obliga a los desarrolladores a rastrear manualmente los IDs de suscripciones en sus propias bases de datos.


## La ocultación sistemática de PayPal: silenciando a 6 millones de voces {#paypals-systematic-cover-up-silencing-6-million-voices}

En un movimiento que encapsula perfectamente el enfoque de PayPal para manejar las críticas, recientemente sacaron todo su foro comunitario fuera de línea, silenciando efectivamente a más de 6 millones de miembros y borrando cientos de miles de publicaciones que documentaban sus fallos.

### La gran eliminación {#the-great-erasure}

La Comunidad original de PayPal en `paypal-community.com` albergaba **6,003,558 miembros** y contenía cientos de miles de publicaciones, reportes de errores, quejas y discusiones sobre las fallas de la API de PayPal. Esto representaba más de una década de evidencia documentada de los problemas sistemáticos de PayPal.

El 30 de junio de 2025, PayPal silenciosamente sacó todo el foro fuera de línea. Todos los enlaces de `paypal-community.com` ahora devuelven errores 404. Esto no fue una migración ni una actualización.

### El rescate de terceros {#the-third-party-rescue}

Afortunadamente, un servicio de terceros en [ppl.lithium.com](https://ppl.lithium.com/) ha preservado parte del contenido, permitiéndonos acceder a las discusiones que PayPal intentó ocultar. Sin embargo, esta preservación de terceros es incompleta y podría desaparecer en cualquier momento.

Este patrón de ocultar evidencia no es nuevo para PayPal. Tienen un historial documentado de:

* Eliminar reportes críticos de errores de la vista pública
* Descontinuar herramientas para desarrolladores sin aviso
* Cambiar APIs sin documentación adecuada
* Silenciar discusiones comunitarias sobre sus fallos

La eliminación del foro representa el intento más descarado hasta ahora de ocultar sus fallos sistemáticos al escrutinio público.


## El desastre del error de captura de 11 años: $1,899 y contando {#the-11-year-capture-bug-disaster-1899-and-counting}

Mientras PayPal estaba ocupado organizando sesiones de retroalimentación y haciendo promesas, su sistema central de procesamiento de pagos ha estado fundamentalmente roto por más de 11 años. La evidencia es devastadora.

### La pérdida de $1,899 de Forward Email {#forward-emails-1899-loss}

En nuestros sistemas de producción, descubrimos 108 pagos de PayPal que suman **$1,899** que se perdieron debido a fallos en la captura de PayPal. Estos pagos muestran un patrón consistente:

* Se recibieron webhooks `CHECKOUT.ORDER.APPROVED`
* La API de captura de PayPal devolvió errores 404
* Los pedidos se volvieron inaccesibles a través de la API de PayPal

Es imposible determinar si se cobró a los clientes ya que PayPal oculta completamente los registros de depuración después de 14 días y borra todos los datos del panel para los IDs de pedido que no fueron capturados.

Esto representa solo un negocio. **Las pérdidas colectivas a lo largo de miles de comerciantes durante más de 11 años probablemente suman millones de dólares.**

**Lo vamos a repetir: las pérdidas colectivas a lo largo de miles de comerciantes durante más de 11 años probablemente suman millones de dólares.**

La única razón por la que descubrimos esto es porque somos increíblemente meticulosos y orientados a los datos.

### El reporte original de 2013: más de 11 años de negligencia {#the-2013-original-report-11-years-of-negligence}

El reporte documentado más antiguo de este problema exacto aparece en [Stack Overflow en noviembre de 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivado](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Sigo recibiendo error 404 con la API Rest al hacer una captura"

El error reportado en 2013 es **idéntico** a lo que Forward Email experimentó en 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "No se encontró el ID del recurso solicitado",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

La respuesta de la comunidad en 2013 fue reveladora:

> "Hay un problema reportado en este momento con la API REST. PayPal está trabajando en ello."
**Más de 11 años después, todavía están "trabajando en ello."**

### La admisión de 2016: PayPal rompe su propio SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

En 2016, el propio repositorio de GitHub de PayPal documentó [fallos masivos en las capturas](https://github.com/paypal/PayPal-PHP-SDK/issues/660) que afectaban a su SDK oficial de PHP. La magnitud fue asombrosa:

> "Desde el 20/09/2016, todos los intentos de captura de PayPal han fallado con 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. No se hizo ningún cambio entre el 19/09 y el 20/09 en la integración de la API. **El 100% de los intentos de captura desde el 20/09 han devuelto este error.**"

Un comerciante reportó:

> "He tenido **más de 1,400 intentos fallidos de captura en las últimas 24 horas**, todos con la respuesta de error INVALID_RESOURCE_ID."

La respuesta inicial de PayPal fue culpar al comerciante y remitirlo al soporte técnico. Solo después de una enorme presión admitieron la culpa:

> "Tengo una actualización de nuestros desarrolladores de producto. Están notando en los encabezados que se envían que el PayPal-Request-ID se está enviando con 42 caracteres, pero **parece que un cambio reciente limitó este ID a solo 38 caracteres.**"

Esta admisión revela la negligencia sistemática de PayPal:

1. **Hicieron cambios disruptivos no documentados**
2. **Romperon su propio SDK oficial**
3. **Culparon primero a los comerciantes**
4. **Solo admitieron la culpa bajo presión**

Incluso después de "arreglar" el problema, los comerciantes reportaron:

> "Actualicé el SDK a la versión v1.7.4 y **el problema sigue ocurriendo.**"

### La escalada de 2024: sigue roto {#the-2024-escalation-still-broken}

Reportes recientes de la comunidad preservada de PayPal muestran que el problema en realidad ha empeorado. Una [discusión de septiembre de 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivada](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenta los mismos problemas exactos:

> "El problema solo empezó a aparecer hace unas 2 semanas y no afecta a todos los pedidos. **El más común parece ser los 404 en la captura.**"

El comerciante describe el mismo patrón que experimentó Forward Email:

> "Después de intentar capturar el pedido, PayPal devuelve un 404. Al recuperar los detalles del pedido: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Esto es sin ninguna traza de una captura exitosa de nuestro lado.**"

### El desastre de la fiabilidad de los webhooks {#the-webhook-reliability-disaster}

Otra [discusión preservada de la comunidad](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) revela que el sistema de webhooks de PayPal es fundamentalmente poco fiable:

> "Teóricamente, debería haber dos eventos (CHECKOUT.ORDER.APPROVED y PAYMENT.CAPTURE.COMPLETED) desde el evento Webhook. En realidad, **esos dos eventos rara vez se reciben inmediatamente, PAYMENT.CAPTURE.COMPLETED no se recibe la mayoría de las veces o se recibe después de unas horas.**"

Para pagos de suscripción:

> "**'PAYMENT.SALE.COMPLETED' a veces no se recibe o hasta después de unas horas.**"

Las preguntas del comerciante revelan la profundidad de los problemas de fiabilidad de PayPal:

1. **"¿Por qué sucede esto?"** - El sistema de webhooks de PayPal está fundamentalmente roto
2. **"Si el estado del pedido es 'COMPLETED', ¿puedo asumir que he recibido el dinero?"** - Los comerciantes no pueden confiar en las respuestas de la API de PayPal
3. **"¿Por qué en 'Event Logs->Webhook Events' no se encuentran registros?"** - Incluso el sistema de registro propio de PayPal no funciona

### El patrón de negligencia sistemática {#the-pattern-of-systematic-negligence}

La evidencia abarca más de 11 años y muestra un patrón claro:

* **2013**: "PayPal está trabajando en ello"
* **2016**: PayPal admite cambio disruptivo, ofrece solución defectuosa
* **2024**: Los mismos errores exactos siguen ocurriendo, afectando a Forward Email y a muchos otros

Esto no es un error - **esto es negligencia sistemática.** PayPal ha sabido de estas fallas críticas en el procesamiento de pagos por más de una década y consistentemente:
1. **Culparon a los comerciantes por los errores de PayPal**  
2. **Hicieron cambios disruptivos no documentados**  
3. **Proporcionaron soluciones inadecuadas que no funcionan**  
4. **Ignoraron el impacto financiero en los negocios**  
5. **Ocultaron evidencia eliminando foros comunitarios**  

### El Requisito No Documentado {#the-undocumented-requirement}  

En ninguna parte de la documentación oficial de PayPal mencionan que los comerciantes deben implementar lógica de reintento para las operaciones de captura. Su documentación indica que los comerciantes deben "capturar inmediatamente después de la aprobación", pero no menciona que su API devuelve aleatoriamente errores 404 que requieren mecanismos complejos de reintento.  

Esto obliga a cada comerciante a:  

* Implementar lógica de reintentos con retroceso exponencial  
* Manejar la entrega inconsistente de webhooks  
* Construir sistemas complejos de gestión de estado  
* Monitorear manualmente las capturas fallidas  

**Todos los demás procesadores de pago ofrecen APIs de captura confiables que funcionan a la primera.**  


## El Patrón Más Amplio de Engaño de PayPal {#paypals-broader-pattern-of-deception}  

El desastre del error de captura es solo un ejemplo del enfoque sistemático de PayPal para engañar a los clientes y ocultar sus fallas.  

### La Acción del Departamento de Servicios Financieros de Nueva York {#the-new-york-department-of-financial-services-action}  

En enero de 2025, el Departamento de Servicios Financieros de Nueva York emitió una [acción de cumplimiento contra PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) por prácticas engañosas, demostrando que el patrón de engaño de PayPal va mucho más allá de sus APIs.  

Esta acción regulatoria muestra la disposición de PayPal a participar en prácticas engañosas en todo su negocio, no solo en sus herramientas para desarrolladores.  

### La Demanda de Honey: Reescribiendo Enlaces de Afiliados {#the-honey-lawsuit-rewriting-affiliate-links}  

La adquisición de Honey por parte de PayPal ha resultado en [demandas que alegan que Honey reescribe enlaces de afiliados](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), robando comisiones a creadores de contenido e influencers. Esto representa otra forma de engaño sistemático donde PayPal se beneficia redirigiendo ingresos que deberían ir a otros.  

El patrón es claro:  

1. **Fallos en la API**: Ocultar funcionalidades rotas, culpar a los comerciantes  
2. **Silenciamiento comunitario**: Eliminar evidencia de problemas  
3. **Violaciones regulatorias**: Participar en prácticas engañosas  
4. **Robo de afiliados**: Robar comisiones mediante manipulación técnica  

### El Costo de la Negligencia de PayPal {#the-cost-of-paypals-negligence}  

La pérdida de $1,899 de Forward Email representa solo la punta del iceberg. Considere el impacto más amplio:  

* **Comerciantes individuales**: Miles perdiendo cientos a miles de dólares cada uno  
* **Clientes empresariales**: Potencialmente millones en ingresos perdidos  
* **Tiempo de desarrolladores**: Incontables horas construyendo soluciones para las APIs rotas de PayPal  
* **Confianza del cliente**: Negocios perdiendo clientes debido a fallos en los pagos de PayPal  

Si un pequeño servicio de correo electrónico perdió casi $2,000, y este problema ha existido por más de 11 años afectando a miles de comerciantes, el daño financiero colectivo probablemente asciende a **cientos de millones de dólares**.  

### La Mentira de la Documentación {#the-documentation-lie}  

La documentación oficial de PayPal falla consistentemente en mencionar las limitaciones críticas y errores que los comerciantes encontrarán. Por ejemplo:  

* **API de captura**: No menciona que los errores 404 son comunes y requieren lógica de reintento  
* **Confiabilidad de webhooks**: No menciona que los webhooks a menudo se retrasan horas  
* **Listado de suscripciones**: La documentación implica que es posible listar cuando no existe un endpoint  
* **Tiempos de espera de sesión**: No menciona los agresivos tiempos de espera de 60 segundos  

Esta omisión sistemática de información crítica obliga a los comerciantes a descubrir las limitaciones de PayPal mediante prueba y error en sistemas de producción, resultando a menudo en pérdidas financieras.  


## Lo Que Esto Significa para los Desarrolladores {#what-this-means-for-developers}  

La falla sistemática de PayPal para atender las necesidades básicas de los desarrolladores mientras recopila extensos comentarios muestra un problema organizacional fundamental. Tratan la recopilación de comentarios como un sustituto de realmente solucionar los problemas.
El patrón es claro:

1. Los desarrolladores reportan problemas
2. PayPal organiza sesiones de retroalimentación con ejecutivos
3. Se proporciona una retroalimentación extensa
4. Los equipos reconocen las deficiencias y prometen "rastrear y abordar"
5. No se implementa nada
6. Los ejecutivos se van a mejores empresas
7. Los nuevos equipos piden la misma retroalimentación
8. El ciclo se repite

Mientras tanto, los desarrolladores se ven obligados a crear soluciones alternativas, comprometer la seguridad y lidiar con interfaces rotas solo para aceptar pagos.

Si estás construyendo un sistema de pagos, aprende de nuestra experiencia: construye tu [enfoque trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) con múltiples procesadores, pero no esperes que PayPal proporcione la funcionalidad básica que necesitas. Planea construir soluciones alternativas desde el primer día.

> Esta publicación documenta nuestra experiencia de 11 años con las APIs de PayPal en Forward Email. Todos los ejemplos de código y enlaces son de nuestros sistemas de producción reales. Continuamos soportando pagos con PayPal a pesar de estos problemas porque algunos clientes no tienen otra opción

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="Ilustración del desastre de la API de PayPal" class="rounded-lg" />
