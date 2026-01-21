# Una década de impacto: cómo nuestros paquetes npm alcanzaron mil millones de descargas y dieron forma a JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Prefacio](#foreword)
* [Los pioneros que confían en nosotros: Isaac Z. Schlueter y Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [De la creación de npm al liderazgo de Node.js](#from-npms-creation-to-nodejs-leadership)
* [El arquitecto detrás del código: el viaje de Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Comité Técnico Express y Contribuciones Principales](#express-technical-committee-and-core-contributions)
  * [Contribuciones al marco Koa](#koa-framework-contributions)
  * [De colaborador individual a líder organizacional](#from-individual-contributor-to-organization-leader)
* [Nuestras organizaciones de GitHub: ecosistemas de innovación](#our-github-organizations-ecosystems-of-innovation)
  * [Cabina: Registro estructurado para aplicaciones modernas](#cabin-structured-logging-for-modern-applications)
  * [Escáner de spam: cómo combatir el abuso del correo electrónico](#spam-scanner-fighting-email-abuse)
  * [Bree: Programación moderna de tareas con subprocesos de trabajo](#bree-modern-job-scheduling-with-worker-threads)
  * [Reenvío de correo electrónico: Infraestructura de correo electrónico de código abierto](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilidades y herramientas esenciales de Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Monitoreo del tiempo de actividad de código abierto](#upptime-open-source-uptime-monitoring)
* [Nuestras contribuciones al ecosistema de correo electrónico de Forward](#our-contributions-to-the-forward-email-ecosystem)
  * [De los paquetes a la producción](#from-packages-to-production)
  * [El bucle de retroalimentación](#the-feedback-loop)
* [Principios básicos de Forward Email: una base para la excelencia](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Siempre amigable para los desarrolladores, centrado en la seguridad y transparente](#always-developer-friendly-security-focused-and-transparent)
  * [Adhesión a principios de desarrollo de software probados a lo largo del tiempo](#adherence-to-time-tested-software-development-principles)
  * [Dirigido al desarrollador novato y con recursos propios](#targeting-the-scrappy-bootstrapped-developer)
  * [Principios en la práctica: el código base de reenvío de correo electrónico](#principles-in-practice-the-forward-email-codebase)
  * [Privacidad por diseño](#privacy-by-design)
  * [Código abierto sostenible](#sustainable-open-source)
* [Los números no mienten: nuestras asombrosas estadísticas de descarga de npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Una vista aérea de nuestro impacto](#a-birds-eye-view-of-our-impact)
  * [Impacto diario a escala](#daily-impact-at-scale)
  * [Más allá de los números crudos](#beyond-the-raw-numbers)
* [Apoyando el ecosistema: nuestros patrocinios de código abierto](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: pionero de la infraestructura de correo electrónico](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: cerebro del paquete de utilidades](#sindre-sorhus-utility-package-mastermind)
* [Descubrimiento de vulnerabilidades de seguridad en el ecosistema de JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [El rescate del Koa-Router](#the-koa-router-rescue)
  * [Abordar las vulnerabilidades de ReDoS](#addressing-redos-vulnerabilities)
  * [Abogando por la seguridad de Node.js y Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Asegurando la infraestructura de npm](#securing-npm-infrastructure)
* [Nuestras contribuciones al ecosistema de correo electrónico de Forward](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Mejorando la funcionalidad principal de Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Autenticación avanzada del correo electrónico con Mailauth](#advancing-email-authentication-with-mailauth)
  * [Mejoras clave en el tiempo de actividad](#key-upptime-enhancements)
* [El pegamento que lo mantiene todo unido: código personalizado a escala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Un esfuerzo masivo de desarrollo](#a-massive-development-effort)
  * [Integración de dependencias centrales](#core-dependencies-integration)
  * [Infraestructura DNS con Tangerine y mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impacto empresarial: del código abierto a las soluciones de misión crítica](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Estudios de caso en infraestructura de correo electrónico de misión crítica](#case-studies-in-mission-critical-email-infrastructure)
* [Una década de código abierto: mirando hacia el futuro](#a-decade-of-open-source-looking-forward)

## Prólogo {#foreword}

En el mundo de [JavaScript](https://en.wikipedia.org/wiki/JavaScript) y [Node.js](https://en.wikipedia.org/wiki/Node.js), algunos paquetes son esenciales: se descargan millones de veces al día y alimentan aplicaciones en todo el mundo. Detrás de estas herramientas se encuentran desarrolladores centrados en la calidad del código abierto. Hoy mostramos cómo nuestro equipo ayuda a crear y mantener paquetes npm que se han convertido en piezas clave del ecosistema JavaScript.

## Los pioneros que confían en nosotros: Isaac Z. Schlueter y Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Nos enorgullece tener a [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) como usuario. Isaac creó [npm](https://en.wikipedia.org/wiki/Npm_\(software\) y ayudó a construir [Node.js](https://en.wikipedia.org/wiki/Node.js). Su confianza en Forward Email demuestra nuestra prioridad por la calidad y la seguridad. Isaac usa Forward Email para varios dominios, incluido izs.me.

El impacto de Isaac en JavaScript es enorme. En 2009, fue de los primeros en ver el potencial de Node.js, trabajando con [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), creador de la plataforma. Como dijo Isaac en un [Entrevista con la revista Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): «En medio de una comunidad muy pequeña de personas que intentaban descubrir cómo implementar JavaScript del lado del servidor, Ryan Dahl creó Node, que era claramente el enfoque correcto. Aporté mi granito de arena y me involucré mucho a mediados de 2009».

> \[!NOTE]
> Para quienes estén interesados en la historia de Node.js, existen excelentes documentales que narran su desarrollo, como [La historia de Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) y [10 cosas que lamento sobre Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). [sitio web personal](https://tinyclouds.org/), de Ryan Dahl, también contiene valiosas reflexiones sobre su trabajo.

### De la creación de npm al liderazgo de Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac creó npm en septiembre de 2009, y la primera versión utilizable se lanzó a principios de 2010. Este gestor de paquetes satisfizo una necesidad clave en Node.js, permitiendo a los desarrolladores compartir y reutilizar código fácilmente. Según [Página de Wikipedia sobre Node.js](https://en.wikipedia.org/wiki/Node.js), «En enero de 2010, se introdujo un gestor de paquetes para el entorno Node.js llamado npm. Este gestor de paquetes permite a los programadores publicar y compartir paquetes de Node.js, junto con el código fuente correspondiente, y está diseñado para simplificar la instalación, actualización y desinstalación de paquetes».

Cuando Ryan Dahl dejó Node.js en enero de 2012, Isaac asumió el liderazgo del proyecto. Como se indica en [su resumen](https://izs.me/resume), "lideró el desarrollo de varias API fundamentales de Node.js, incluyendo el sistema de módulos CommonJS, las API del sistema de archivos y los flujos" y "actuó como BDFL (dictador vitalicio benévolo) del proyecto durante dos años, garantizando una calidad cada vez mayor y un proceso de compilación fiable para las versiones de Node.js de la v0.6 a la v0.10".

Isaac guió a Node.js durante un período clave de crecimiento, estableciendo estándares que aún definen la plataforma. Posteriormente, en 2014, fundó npm, Inc. para dar soporte al registro de npm, que anteriormente gestionaba por su cuenta.

Agradecemos a Isaac sus importantes contribuciones a JavaScript y seguimos usando muchos de los paquetes que creó. Su trabajo ha transformado la forma en que creamos software y cómo millones de desarrolladores comparten código en todo el mundo.

## El arquitecto detrás del código: el viaje de Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

En el corazón de nuestro éxito en código abierto se encuentra Nick Baugh, fundador y propietario de Forward Email. Su experiencia en JavaScript abarca casi 20 años y ha influido en la creación de aplicaciones por parte de innumerables desarrolladores. Su trayectoria en código abierto demuestra tanto su habilidad técnica como su liderazgo comunitario.

### Comité Técnico Express y Contribuciones Principales {#express-technical-committee-and-core-contributions}

La experiencia de Nick con frameworks web le valió un puesto en [Comité Técnico Express](https://expressjs.com/en/resources/community.html), donde colaboró con uno de los frameworks Node.js más utilizados. Nick figura ahora como miembro inactivo en [Página de la comunidad Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express fue creado originalmente por TJ Holowaychuk, un prolífico colaborador de código abierto que ha dado forma a gran parte del ecosistema Node.js. Agradecemos el trabajo fundacional de TJ y respetamos su [decisión de tomar un descanso](https://news.ycombinator.com/item?id=37687017) por sus extensas contribuciones al código abierto.

Como miembro de [Comité Técnico Express](https://expressjs.com/en/resources/community.html), Nick mostró gran atención a los detalles en cuestiones como aclarar la documentación de `req.originalUrl` y solucionar problemas de manejo de formularios multiparte.

### Contribuciones al marco Koa {#koa-framework-contributions}

El trabajo de Nick con [Marco Koa](https://github.com/koajs/koa) —una alternativa moderna y más ligera a Express, también creada por TJ Holowaychuk— demuestra aún más su compromiso con mejores herramientas de desarrollo web. Sus contribuciones a Koa incluyen la resolución de problemas y el código mediante solicitudes de extracción, la gestión de errores, la gestión de tipos de contenido y las mejoras en la documentación.

Su trabajo tanto en Express como en Koa le brinda una visión única del desarrollo web con Node.js, lo que ayuda a nuestro equipo a crear paquetes que funcionan bien con múltiples ecosistemas de marco.

### De colaborador individual a líder de la organización {#from-individual-contributor-to-organization-leader}

Lo que empezó ayudando a proyectos existentes se convirtió en la creación y el mantenimiento de ecosistemas de paquetes completos. Nick fundó varias organizaciones de GitHub, entre ellas [Cabina](https://github.com/cabinjs), [Escáner de spam](https://github.com/spamscanner), [Reenviar correo electrónico](https://github.com/forwardemail), [Muchacho](https://github.com/ladjs) y [Bree](https://github.com/breejs), cada una para resolver necesidades específicas de la comunidad JavaScript.

Este cambio de colaborador a líder demuestra la visión de Nick de un software bien diseñado que resuelve problemas reales. Al organizar paquetes relacionados en organizaciones específicas de GitHub, ha creado ecosistemas de herramientas que funcionan en conjunto, manteniendo su modularidad y flexibilidad para la comunidad de desarrolladores en general.

## Nuestras organizaciones de GitHub: ecosistemas de innovación {#our-github-organizations-ecosystems-of-innovation}

Organizamos nuestro trabajo de código abierto en torno a organizaciones de GitHub especializadas, cada una de las cuales resuelve necesidades específicas en JavaScript. Esta estructura crea familias de paquetes cohesivas que funcionan bien juntas y, al mismo tiempo, mantienen su modularidad.

### Cabina: Registro estructurado para aplicaciones modernas {#cabin-structured-logging-for-modern-applications}

[Organización de la cabina](https://github.com/cabinjs) es nuestra versión de un registro de aplicaciones simple y potente. El paquete principal, [`cabin`](https://github.com/cabinjs/cabin), cuenta con casi 900 estrellas en GitHub y más de 100 000 descargas semanales. Cabin ofrece un registro estructurado compatible con servicios populares como Sentry, LogDNA y Papertrail.

Lo que hace especial a Cabin es su ingenioso sistema de API y plugins. Los paquetes de soporte como [`axe`](https://github.com/cabinjs/axe) para middleware Express y [`parse-request`](https://github.com/cabinjs/parse-request) para el análisis de solicitudes HTTP demuestran nuestro compromiso con soluciones completas en lugar de herramientas aisladas.

El paquete [`bson-objectid`](https://github.com/cabinjs/bson-objectid) merece una mención especial, con más de 1,7 millones de descargas en tan solo dos meses. Esta ligera implementación de ObjectID de MongoDB se ha convertido en la opción predilecta para los desarrolladores que necesitan identificadores sin dependencias completas de MongoDB.

### Escáner de spam: lucha contra el abuso del correo electrónico {#spam-scanner-fighting-email-abuse}

El paquete [Organización del escáner de spam](https://github.com/spamscanner) demuestra nuestro compromiso con la solución de problemas reales. El paquete principal, [`spamscanner`](https://github.com/spamscanner/spamscanner), proporciona detección avanzada de spam, pero es el paquete [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) el que ha experimentado una adopción asombrosa.

Con más de 1,2 millones de descargas en dos meses, `url-regex-safe` corrige problemas críticos de seguridad en otras expresiones regulares de detección de URL. Este paquete muestra nuestro enfoque hacia el código abierto: identificar un problema común (en este caso, las vulnerabilidades de [Rehacer](https://en.wikipedia.org/wiki/ReDoS) en la validación de URL), crear una solución sólida y mantenerla cuidadosamente.

### Bree: Programación de trabajos moderna con subprocesos de trabajo {#bree-modern-job-scheduling-with-worker-threads}

[Organización Bree](https://github.com/breejs) es nuestra respuesta a un desafío común en Node.js: la programación fiable de tareas. El paquete principal [`bree`](https://github.com/breejs/bree), con más de 3100 estrellas en GitHub, proporciona un programador de tareas moderno que utiliza hilos de trabajo de Node.js para un mejor rendimiento y fiabilidad.

> \[!NOTE]
> Bree se creó después de que ayudáramos a mantener [Orden del día](https://github.com/agenda/agenda), aplicando las lecciones aprendidas para desarrollar un mejor programador de tareas. Nuestras contribuciones a la Agenda nos ayudaron a encontrar maneras de mejorar la programación de tareas.

¿Qué hace que Bree sea diferente de otros programadores como Agenda?

* **Sin dependencias externas**: A diferencia de Agenda, que requiere MongoDB, Bree no requiere Redis ni MongoDB para gestionar el estado de los trabajos.
* **Hilos de trabajo**: Bree utiliza hilos de trabajo de Node.js para procesos en entornos aislados, lo que proporciona un mejor aislamiento y rendimiento.
* **API sencilla**: Bree ofrece un control detallado y sencillo, lo que facilita la implementación de necesidades de programación complejas.
* **Soporte integrado**: Funciones como la recarga elegante, las tareas cron, las fechas y las horas intuitivas se incluyen por defecto.

Bree es un componente clave de [forwardemail.net](https://github.com/forwardemail/forwardemail.net), ya que gestiona tareas críticas en segundo plano como el procesamiento de correo electrónico, la limpieza y el mantenimiento programado. El uso de Bree en Forward Email demuestra nuestro compromiso con el uso de nuestras propias herramientas en producción, garantizando así altos estándares de fiabilidad.

También utilizamos y valoramos otros excelentes paquetes de hilos de trabajo como [piscina](https://github.com/piscinajs/piscina) y clientes HTTP como [once](https://github.com/nodejs/undici). Piscina, al igual que Bree, utiliza hilos de trabajo de Node.js para un procesamiento eficiente de tareas. Agradecemos a [Matthew Hill](https://github.com/mcollina), responsable del mantenimiento de undici y piscina, por sus importantes contribuciones a Node.js. Matteo forma parte del Comité Directivo Técnico de Node.js y ha mejorado considerablemente las capacidades de los clientes HTTP en Node.js.

### Reenvío de correo electrónico: Infraestructura de correo electrónico de código abierto {#forward-email-open-source-email-infrastructure}

Nuestro proyecto más ambicioso es [Reenviar correo electrónico](https://github.com/forwardemail), un servicio de correo electrónico de código abierto que ofrece reenvío de correo electrónico, almacenamiento y servicios de API. El repositorio principal cuenta con más de 1100 estrellas en GitHub\[^4], lo que demuestra el aprecio de la comunidad por esta alternativa a los servicios de correo electrónico propietarios.

El paquete [`preview-email`](https://github.com/forwardemail/preview-email) de esta organización, con más de 2,5 millones de descargas en dos meses\[^5], se ha convertido en una herramienta esencial para los desarrolladores que trabajan con plantillas de correo electrónico. Al proporcionar una forma sencilla de previsualizar los correos electrónicos durante el desarrollo, soluciona un problema común en la creación de aplicaciones compatibles con correo electrónico.

### Lad: Utilidades y herramientas esenciales de Koa {#lad-essential-koa-utilities-and-tools}

[Organización de muchachos](https://github.com/ladjs) proporciona una colección de utilidades y herramientas esenciales, enfocadas principalmente en mejorar el ecosistema del framework Koa. Estos paquetes resuelven desafíos comunes en el desarrollo web y están diseñados para funcionar en conjunto a la perfección, manteniendo su utilidad independiente.

#### koa-better-error-handler: Manejo de errores mejorado para Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) ofrece una mejor solución de gestión de errores para las aplicaciones Koa. Con más de 50 estrellas en GitHub, este paquete permite que `ctx.throw` genere mensajes de error intuitivos, a la vez que soluciona varias limitaciones del gestor de errores integrado de Koa:

* Detecta y gestiona correctamente errores de DNS de Node.js, errores de Mongoose y errores de Redis.
* Utiliza [Auge](https://github.com/hapijs/boom) para crear respuestas de error consistentes y bien formateadas.
* Conserva los encabezados (a diferencia del controlador integrado de Koa).
* Mantiene los códigos de estado adecuados en lugar de usar el valor predeterminado 500.
* Admite mensajes flash y preservación de sesiones.
* Proporciona listas de errores HTML para errores de validación.
* Admite múltiples tipos de respuesta (HTML, JSON y texto plano).

Este paquete es particularmente valioso cuando se utiliza junto con [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) para la gestión integral de errores en aplicaciones Koa.

#### pasaporte: Autenticación para Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) amplía el popular middleware de autenticación Passport.js con mejoras específicas para aplicaciones web modernas. Este paquete admite múltiples estrategias de autenticación de forma predeterminada:

* Autenticación local con correo electrónico
* Iniciar sesión con Apple
* Autenticación con GitHub
* Autenticación con Google
* Autenticación con contraseña de un solo uso (OTP)

El paquete es altamente personalizable, lo que permite a los desarrolladores ajustar los nombres de los campos y las frases según los requisitos de su aplicación. Está diseñado para integrarse a la perfección con Mongoose para la gestión de usuarios, lo que lo convierte en una solución ideal para aplicaciones basadas en Koa que requieren una autenticación robusta.

#### graceful: Cierre elegante de la aplicación {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) resuelve el desafío crítico de cerrar correctamente las aplicaciones Node.js. Con más de 70 estrellas en GitHub, este paquete garantiza que su aplicación pueda cerrarse correctamente sin perder datos ni dejar conexiones bloqueadas. Sus características principales incluyen:

* Soporte para el cierre correcto de servidores HTTP (Express/Koa/Fastify)
* Cierre limpio de conexiones de bases de datos (MongoDB/Mongoose)
* Cierre correcto de clientes Redis
* Manejo de programadores de tareas Bree
* Soporte para controladores de apagado personalizados
* Ajustes de tiempo de espera configurables
* Integración con sistemas de registro

Este paquete es esencial para aplicaciones de producción donde los apagados inesperados podrían provocar la pérdida o corrupción de datos. Al implementar procedimientos de apagado adecuados, `@ladjs/graceful` ayuda a garantizar la fiabilidad y estabilidad de la aplicación.

### Upptime: Monitoreo del tiempo de actividad de código abierto {#upptime-open-source-uptime-monitoring}

[Organización del tiempo de actividad](https://github.com/upptime) representa nuestro compromiso con la monitorización transparente y de código abierto. El repositorio principal [`upptime`](https://github.com/upptime/upptime) cuenta con más de 13 000 estrellas en GitHub, lo que lo convierte en uno de los proyectos más populares a los que contribuimos. Upptime ofrece un monitor de actividad y una página de estado con tecnología de GitHub que funciona completamente sin servidor.

Usamos Upptime para nuestra propia página de estado en <https://status.forwardemail.net> con el código fuente disponible en <https://github.com/forwardemail/status.forwardemail.net>.

Lo que hace especial a Upptime es su arquitectura:

**100 % de código abierto**: Todos los componentes son completamente de código abierto y personalizables.
* **Desarrollado por GitHub**: Aprovecha las acciones, incidencias y páginas de GitHub para una solución de monitorización sin servidor.
* **No requiere servidor**: A diferencia de las herramientas de monitorización tradicionales, Upptime no requiere que ejecutes ni mantengas un servidor.
* **Página de estado automática**: Genera una atractiva página de estado que puede alojarse en páginas de GitHub.
* **Notificaciones potentes**: Se integra con varios canales de notificación, como correo electrónico, SMS y Slack.

Para mejorar la experiencia de nuestros usuarios, hemos integrado [@octokit/core](https://github.com/octokit/core.js/) en el código de forwardemail.net para mostrar actualizaciones de estado e incidentes en tiempo real directamente en nuestro sitio web. Esta integración proporciona total transparencia a nuestros usuarios en caso de cualquier problema en toda nuestra infraestructura (sitio web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) con notificaciones instantáneas, cambios en el icono de la insignia, colores de advertencia y más.

La biblioteca @octokit/core nos permite obtener datos en tiempo real de nuestro repositorio Upptime en GitHub, procesarlos y mostrarlos de forma intuitiva. Cuando un servicio sufre una interrupción o un rendimiento reducido, los usuarios reciben una notificación inmediata mediante indicadores visuales sin tener que salir de la aplicación principal. Esta integración fluida garantiza que nuestros usuarios siempre tengan información actualizada sobre el estado de nuestro sistema, lo que mejora la transparencia y la confianza.

Cientos de organizaciones han adoptado Upptime que buscan una forma transparente y fiable de supervisar sus servicios y comunicar su estado a los usuarios. El éxito del proyecto demuestra el poder de desarrollar herramientas que aprovechan la infraestructura existente (en este caso, GitHub) para resolver problemas comunes de nuevas maneras.

## Nuestras contribuciones al ecosistema de correo electrónico de reenvío {#our-contributions-to-the-forward-email-ecosystem}

Si bien nuestros paquetes de código abierto son utilizados por desarrolladores de todo el mundo, también constituyen la base de nuestro propio servicio de reenvío de correo electrónico. Esta doble función —como creadores y usuarios de estas herramientas— nos brinda una perspectiva única sobre su aplicación práctica e impulsa la mejora continua.

### De paquetes a producción {#from-packages-to-production}

El proceso de transición de paquetes individuales a un sistema de producción cohesivo implica una cuidadosa integración y ampliación. Para el reenvío de correo electrónico, este proceso incluye:

* **Extensiones personalizadas**: Desarrollo de extensiones específicas de Forward Email para nuestros paquetes de código abierto que satisfacen nuestras necesidades únicas.
* **Patrones de integración**: Desarrollo de patrones para la interacción de estos paquetes en un entorno de producción.
* **Optimizaciones de rendimiento**: Identificación y solución de cuellos de botella de rendimiento que solo surgen a gran escala.
* **Refuerzo de la seguridad**: Adición de capas de seguridad adicionales específicas para la gestión del correo electrónico y la protección de datos de los usuarios.

Este trabajo representa miles de horas de desarrollo más allá de los propios paquetes principales, lo que da como resultado un servicio de correo electrónico sólido y seguro que aprovecha lo mejor de nuestras contribuciones de código abierto.

### El bucle de retroalimentación {#the-feedback-loop}

Quizás el aspecto más valioso de usar nuestros propios paquetes en producción es el ciclo de retroalimentación que se crea. Cuando encontramos limitaciones o casos extremos en Forward Email, no solo los solucionamos localmente, sino que mejoramos los paquetes subyacentes, lo que beneficia tanto a nuestro servicio como a la comunidad en general.

Este enfoque ha dado lugar a numerosas mejoras:

**Apagado ordenado de Bree**: La necesidad de Forward Email de implementar implementaciones sin tiempo de inactividad condujo a mejoras en las capacidades de apagado ordenado de Bree.
* **Reconocimiento de patrones de Spam Scanner**: Los patrones de spam reales detectados en Forward Email han servido de base para los algoritmos de detección de Spam Scanner.
* **Optimizaciones de rendimiento de Cabin**: El alto volumen de registros en producción reveló oportunidades de optimización en Cabin que benefician a todos los usuarios.

Al mantener este círculo virtuoso entre nuestro trabajo de código abierto y el servicio de producción, garantizamos que nuestros paquetes sigan siendo soluciones prácticas y probadas en batalla en lugar de implementaciones teóricas.

Principios básicos del reenvío de correo electrónico: una base para la excelencia {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email está diseñado según un conjunto de principios fundamentales que guían todas nuestras decisiones de desarrollo. Estos principios, detallados en nuestro [sitio web](/blog/docs/best-quantum-safe-encrypted-email-service#principles), garantizan que nuestro servicio sea fácil de usar para desarrolladores, seguro y priorice la privacidad del usuario.

### Siempre amigable para los desarrolladores, centrado en la seguridad y transparente {#always-developer-friendly-security-focused-and-transparent}

Nuestro principio fundamental es crear software fácil de usar para desarrolladores, manteniendo al mismo tiempo los más altos estándares de seguridad y privacidad. Creemos que la excelencia técnica nunca debe ir en detrimento de la usabilidad, y que la transparencia genera confianza en nuestra comunidad.

Este principio se refleja en nuestra documentación detallada, mensajes de error claros y una comunicación abierta tanto sobre los éxitos como sobre los desafíos. Al hacer que todo nuestro código base sea de código abierto, invitamos al escrutinio y la colaboración, lo que fortalece tanto nuestro software como el ecosistema en general.

### Adhesión a los principios de desarrollo de software probados en el tiempo {#adherence-to-time-tested-software-development-principles}

Seguimos varios principios de desarrollo de software establecidos que han demostrado su valor durante décadas:

**[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separación de preocupaciones mediante el patrón Modelo-Vista-Controlador
* **[Filosofía Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Creación de componentes modulares que hacen bien una función
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Simplicidad y claridad
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: No te repitas, promoviendo la reutilización de código
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: No lo necesitarás, evitando la optimización prematura
* **[Factor Doce](https://12factor.net/)**: Siguiendo las mejores prácticas para crear aplicaciones modernas y escalables
* **[La navaja de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Elección de la solución más sencilla que cumpla con los requisitos
* **[Pruebas de perro](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Uso extensivo de nuestros propios productos

Estos principios no son solo conceptos teóricos, sino que están arraigados en nuestras prácticas diarias de desarrollo. Por ejemplo, nuestra adhesión a la filosofía Unix se evidencia en cómo hemos estructurado nuestros paquetes npm: módulos pequeños y específicos que pueden combinarse para resolver problemas complejos.

### Dirigido al desarrollador improvisado y con poco tiempo {#targeting-the-scrappy-bootstrapped-developer}

Nos dirigimos específicamente al desarrollador con poca experiencia, con recursos propios y con un límite temporal de tiempo ([ramen rentable](https://www.paulgraham.com/ramenprofitable.html)). Este enfoque influye en todo, desde nuestro modelo de precios hasta nuestras decisiones técnicas. Entendemos los desafíos de desarrollar productos con recursos limitados porque hemos pasado por ello.

Este principio es especialmente importante en nuestra estrategia de código abierto. Creamos y mantenemos paquetes que resuelven problemas reales para desarrolladores sin presupuestos empresariales, poniendo herramientas potentes al alcance de todos, independientemente de sus recursos.

### Principios en la práctica: La base de código de reenvío de correo electrónico {#principles-in-practice-the-forward-email-codebase}

Estos principios son claramente visibles en el código base de Forward Email. Nuestro archivo package.json revela una cuidadosa selección de dependencias, cada una seleccionada para alinearse con nuestros valores fundamentales:

* Paquetes centrados en la seguridad, como `mailauth` para la autenticación de correo electrónico
* Herramientas fáciles de usar para desarrolladores, como `preview-email`, para una depuración más sencilla
* Componentes modulares, como las diversas utilidades `p-*` de Sindre Sorhus

Al seguir estos principios de manera consistente a lo largo del tiempo, hemos creado un servicio en el que los desarrolladores pueden confiar su infraestructura de correo electrónico: seguro, confiable y alineado con los valores de la comunidad de código abierto.

### Privacidad por diseño {#privacy-by-design}

La privacidad no es una idea de último momento ni una característica de marketing para Forward Email: es un principio de diseño fundamental que informa cada aspecto de nuestro servicio y código:

* **Cifrado de acceso cero**: Hemos implementado sistemas que nos impiden técnicamente leer los correos electrónicos de los usuarios.
* **Recopilación mínima de datos**: Recopilamos únicamente los datos necesarios para prestar nuestro servicio, nada más.
* **Políticas transparentes**: Nuestra política de privacidad está redactada en un lenguaje claro y comprensible, sin jerga legal.
* **Verificación de código abierto**: Nuestro código fuente abierto permite a los investigadores de seguridad verificar nuestras declaraciones de privacidad.

Este compromiso se extiende a nuestros paquetes de código abierto, que están diseñados con las mejores prácticas de seguridad y privacidad incorporadas desde cero.

### Código abierto sostenible {#sustainable-open-source}

Creemos que el software de código abierto necesita modelos sostenibles para prosperar a largo plazo. Nuestro enfoque incluye:

* **Soporte Comercial**: Ofrecemos soporte y servicios premium en torno a nuestras herramientas de código abierto.
* **Licencias Equilibradas**: Utilizamos licencias que protegen tanto la libertad de los usuarios como la sostenibilidad del proyecto.
* **Participación Comunitaria**: Colaboramos activamente con los colaboradores para construir una comunidad solidaria.
* **Hojas de Ruta Transparentes**: Compartimos nuestros planes de desarrollo para que los usuarios puedan planificar en consecuencia.

Al centrarnos en la sostenibilidad, garantizamos que nuestras contribuciones de código abierto puedan seguir creciendo y mejorando con el tiempo en lugar de caer en el olvido.

## Los números no mienten: nuestras asombrosas estadísticas de descarga de npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Cuando hablamos del impacto del software de código abierto, las estadísticas de descargas ofrecen una medida tangible de su adopción y confianza. Muchos de los paquetes que ayudamos a mantener han alcanzado una escala que pocos proyectos de código abierto alcanzan, con descargas combinadas que se cuentan por miles de millones.

![Los mejores paquetes npm por descargas](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Si bien nos enorgullece ayudar a mantener varios paquetes con gran demanda en el ecosistema de JavaScript, queremos reconocer que muchos de estos paquetes fueron creados originalmente por otros desarrolladores talentosos. Paquetes como superagent y supertest fueron creados originalmente por TJ Holowaychuk, cuyas prolíficas contribuciones al código abierto han sido fundamentales para dar forma al ecosistema de Node.js.

### Una vista panorámica de nuestro impacto {#a-birds-eye-view-of-our-impact}

Solo en el período de dos meses de febrero a marzo de 2025, los principales paquetes a los que contribuimos y ayudamos a mantener registraron cifras de descargas asombrosas:

* **[superagente](https://www.npmjs.com/package/superagent)**: 84.575.829 descargas\[^7] (creado originalmente por TJ Holowaychuk)
* **[súper prueba](https://www.npmjs.com/package/supertest)**: 76.432.591 descargas\[^8] (creado originalmente por TJ Holowaychuk)
* **[también](https://www.npmjs.com/package/koa)**: 28.539.295 descargas\[^34] (creado originalmente por TJ Holowaychuk)
* **[@koa/enrutador](https://www.npmjs.com/package/@koa/router)**: 11.007.327 descargas\[^35]
* **[enrutador koa](https://www.npmjs.com/package/koa-router)**: 3.498.918 descargas\[^36]
* **[expresión regular de URL](https://www.npmjs.com/package/url-regex)**: 2.819.520 descargas\[^37]
* **[vista previa del correo electrónico](https://www.npmjs.com/package/preview-email)**: 2.500.000 descargas\[^9]
* **[cabina](https://www.npmjs.com/package/cabin)**: 1.800.000 descargas\[^10]
* **[@breejs/más tarde](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 descargas\[^38]
* **[plantillas de correo electrónico](https://www.npmjs.com/package/email-templates)**: 1.128.139 descargas\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 descargas\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 descargas\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 descargas\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 Descargas\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 descargas\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 descargas\[^30]

> \[!NOTE]
> Otros paquetes que ayudamos a mantener, pero que no creamos, tienen un número de descargas aún mayor, como `form-data` (más de 738 millones de descargas), `toidentifier` (más de 309 millones de descargas), `stackframe` (más de 116 millones de descargas) y `error-stack-parser` (más de 113 millones de descargas). Nos honra contribuir a estos paquetes, respetando el trabajo de sus autores originales.

Estas no son solo cifras impresionantes, sino que representan a desarrolladores reales que resuelven problemas reales con código que ayudamos a mantener. Cada descarga es un ejemplo de cómo estos paquetes han ayudado a alguien a crear algo significativo, desde proyectos de aficionados hasta aplicaciones empresariales utilizadas por millones de personas.

![Distribución de categorías de paquetes](/img/art/category_pie_chart.svg)

### Impacto diario a escala {#daily-impact-at-scale}

Los patrones diarios de descarga revelan un uso constante y de alto volumen, con picos que alcanzan millones de descargas al día\[^13]. Esta consistencia demuestra la estabilidad y fiabilidad de estos paquetes: los desarrolladores no solo los prueban, sino que los integran en sus flujos de trabajo principales y dependen de ellos a diario.

Los patrones de descarga semanales muestran cifras aún más impresionantes, que rondan constantemente las decenas de millones de descargas semanales\[^14]. Esto representa una enorme huella en el ecosistema de JavaScript, ya que estos paquetes se ejecutan en entornos de producción de todo el mundo.

### Más allá de los números crudos {#beyond-the-raw-numbers}

Si bien las estadísticas de descargas son impresionantes por sí solas, revelan una historia más profunda sobre la confianza que la comunidad deposita en estos paquetes. Mantener los paquetes a esta escala requiere un compromiso inquebrantable con:

* **Compatibilidad con versiones anteriores**: Los cambios deben considerarse cuidadosamente para evitar dañar las implementaciones existentes.
* **Seguridad**: Con millones de aplicaciones que dependen de estos paquetes, las vulnerabilidades de seguridad podrían tener consecuencias de gran alcance.
* **Rendimiento**: A esta escala, incluso pequeñas mejoras de rendimiento pueden generar beneficios agregados significativos.
* **Documentación**: Una documentación clara y completa es esencial para los paquetes que utilizan los desarrolladores de todos los niveles de experiencia.

El crecimiento constante en el número de descargas a lo largo del tiempo refleja el éxito en el cumplimiento de estos compromisos, generando confianza con la comunidad de desarrolladores a través de paquetes confiables y bien mantenidos.

## Apoyando el ecosistema: nuestros patrocinios de código abierto {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> La sostenibilidad del código abierto no se trata solo de contribuir con código, sino también de apoyar a los desarrolladores que mantienen la infraestructura crítica.

Además de nuestras contribuciones directas al ecosistema JavaScript, nos enorgullece patrocinar a destacados colaboradores de Node.js, cuyo trabajo constituye la base de muchas aplicaciones modernas. Nuestros patrocinios incluyen:

### Andris Reinman: pionero de la infraestructura de correo electrónico {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) es el creador de [Nodemailer](https://github.com/nodemailer/nodemailer), la biblioteca de envío de correo electrónico más popular para Node.js, con más de 14 millones de descargas semanales. Su trabajo se extiende a otros componentes críticos de la infraestructura de correo electrónico, como [Servidor SMTP](https://github.com/nodemailer/smtp-server), [Analizador de correo](https://github.com/nodemailer/mailparser) y [Pato salvaje](https://github.com/nodemailer/wildduck).

Nuestro patrocinio ayuda a garantizar el mantenimiento y desarrollo continuos de estas herramientas esenciales que potencian la comunicación por correo electrónico para innumerables aplicaciones Node.js, incluido nuestro propio servicio de reenvío de correo electrónico.

### Sindre Sorhus: Cerebro del paquete de utilidades {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) es uno de los colaboradores de código abierto más prolíficos del ecosistema JavaScript, con más de 1000 paquetes npm a su nombre. Sus utilidades, como [p-mapa](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) y [es-flujo](https://github.com/sindresorhus/is-stream), son componentes fundamentales del ecosistema Node.js.

Al patrocinar el trabajo de Sindre, ayudamos a sostener el desarrollo de estas utilidades críticas que hacen que el desarrollo de JavaScript sea más eficiente y confiable.

Estos patrocinios reflejan nuestro compromiso con el ecosistema de código abierto en general. Reconocemos que nuestro éxito se basa en las bases establecidas por estos y otros colaboradores, y nos dedicamos a garantizar la sostenibilidad de todo el ecosistema.

## Descubrimiento de vulnerabilidades de seguridad en el ecosistema de JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Nuestro compromiso con el código abierto va más allá del desarrollo de funcionalidades e incluye la identificación y solución de vulnerabilidades de seguridad que podrían afectar a millones de desarrolladores. Varias de nuestras contribuciones más significativas al ecosistema JavaScript se han centrado en el ámbito de la seguridad.

### El rescate del Koa-Router {#the-koa-router-rescue}

En febrero de 2019, Nick identificó un problema crítico con el mantenimiento del popular paquete koa-router. Como [reportado en Hacker News](https://news.ycombinator.com/item?id=19156707), el paquete había sido abandonado por su mantenedor original, dejando vulnerabilidades de seguridad sin abordar y a la comunidad sin actualizaciones.

> \[!WARNING]
> Los paquetes abandonados con vulnerabilidades de seguridad representan riesgos significativos para todo el ecosistema, especialmente cuando se descargan millones de veces por semana.

En respuesta, Nick creó [@koa/enrutador](https://github.com/koajs/router) y ayudó a alertar a la comunidad sobre la situación. Desde entonces, ha mantenido este paquete crítico, garantizando que los usuarios de Koa cuenten con una solución de enrutamiento segura y bien mantenida.

### Abordando vulnerabilidades de ReDoS {#addressing-redos-vulnerabilities}

En 2020, Nick identificó y solucionó una vulnerabilidad crítica [Denegación de servicio por expresión regular (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) en el paquete `url-regex`, ampliamente utilizado. Esta vulnerabilidad ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) podría permitir a los atacantes causar una denegación de servicio al proporcionar una entrada especialmente diseñada que causaba un retroceso catastrófico en la expresión regular.

En lugar de simplemente parchear el paquete existente, Nick creó [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), una implementación completamente reescrita que soluciona la vulnerabilidad manteniendo la compatibilidad con la API original. También publicó [entrada de blog completa](/blog/docs/url-regex-javascript-node-js), que explica la vulnerabilidad y cómo mitigarla.

Este trabajo muestra nuestro enfoque hacia la seguridad: no sólo solucionar problemas sino educar a la comunidad y brindar alternativas sólidas que eviten problemas similares en el futuro.

### Abogando por la seguridad de Node.js y Chromium {#advocating-for-nodejs-and-chromium-security}

Nick también ha participado activamente en la promoción de mejoras de seguridad en el ecosistema en general. En agosto de 2020, identificó un problema de seguridad significativo en Node.js relacionado con el manejo de encabezados HTTP, reportado en [El Registro](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Este problema, originado por un parche en Chromium, podría permitir a los atacantes eludir las medidas de seguridad. La defensa de Nick contribuyó a que el problema se abordara con prontitud, protegiendo así millones de aplicaciones Node.js de posibles ataques.

### Asegurando la infraestructura de npm {#securing-npm-infrastructure}

Más tarde ese mismo mes, Nick identificó otro problema de seguridad crítico, esta vez en la infraestructura de correo electrónico de npm. Como se informó en [El Registro](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm no implementaba correctamente los protocolos de autenticación de correo electrónico DMARC, SPF y DKIM, lo que potencialmente permitía a los atacantes enviar correos electrónicos de phishing que aparentemente provenían de npm.

El informe de Nick condujo a mejoras en la postura de seguridad del correo electrónico de npm, protegiendo a los millones de desarrolladores que dependen de npm para la gestión de paquetes de posibles ataques de phishing.

## Nuestras contribuciones al ecosistema de correo electrónico de reenvío {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email se basa en varios proyectos críticos de código abierto, como Nodemailer, WildDuck y mailauth. Nuestro equipo ha realizado contribuciones significativas a estos proyectos, ayudando a identificar y solucionar problemas graves que afectan la entrega y la seguridad del correo electrónico.

### Mejora de la funcionalidad principal de Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) es la columna vertebral del envío de correo electrónico en Node.js, y nuestras contribuciones han ayudado a hacerlo más sólido:

* **Mejoras del servidor SMTP**: Hemos corregido errores de análisis, problemas de gestión de flujos y problemas de configuración de TLS en el componente del servidor SMTP\[^16]\[^17].
* **Mejoras del analizador de correo**: Hemos solucionado errores de decodificación de secuencias de caracteres y corregido problemas del analizador que podían causar fallos en el procesamiento del correo electrónico\[^18]\[^19].

Estas contribuciones garantizan que Nodemailer siga siendo una base confiable para el procesamiento de correo electrónico en aplicaciones Node.js, incluido Forward Email.

### Autenticación avanzada de correo electrónico con Mailauth {#advancing-email-authentication-with-mailauth}

[Autenticación de correo](https://github.com/postalsys/mailauth) proporciona una funcionalidad crítica de autenticación de correo electrónico, y nuestras contribuciones han mejorado significativamente sus capacidades:

* **Mejoras en la verificación DKIM**: Descubrimos e informamos que X/Twitter tenía problemas de caché DNS que causaban fallos en la verificación DKIM en sus mensajes salientes. Lo reportamos en Hacker One\[^20].
* **Mejoras de DMARC y ARC**: Solucionamos problemas con la verificación DMARC y ARC que podían generar resultados de autenticación incorrectos\[^21]\[^22].
* **Optimizaciones de rendimiento**: Implementamos optimizaciones que mejoran el rendimiento de los procesos de autenticación de correo electrónico\[^23]\[^24]\[^25]\[^26].

Estas mejoras ayudan a garantizar que la autenticación del correo electrónico sea precisa y confiable, protegiendo a los usuarios de ataques de phishing y suplantación de identidad.

### Mejoras clave en el tiempo de actividad {#key-upptime-enhancements}

Nuestras contribuciones a Upptime incluyen:

* **Supervisión de certificados SSL**: Agregamos la funcionalidad para supervisar la expiración de certificados SSL, lo que evita tiempos de inactividad inesperados debido a certificados caducados\[^27].
* **Compatibilidad con múltiples números SMS**: Implementamos la función para alertar a varios miembros del equipo por SMS cuando ocurren incidentes, lo que mejora los tiempos de respuesta\[^28].
* **Correcciones en las comprobaciones de IPv6**: Solucionamos problemas con las comprobaciones de conectividad IPv6, lo que garantiza una supervisión más precisa en entornos de red modernos\[^29].
* **Compatibilidad con modo oscuro/claro**: Agregamos compatibilidad con temas para mejorar la experiencia del usuario en las páginas de estado\[^31].
* **Mejor compatibilidad con ping TCP**: Mejoramos la función de ping TCP para ofrecer pruebas de conexión más fiables\[^32].

Estas mejoras no solo benefician el monitoreo del estado de Forward Email, sino que están disponibles para toda la comunidad de usuarios de Upptime, lo que demuestra nuestro compromiso con la mejora de las herramientas de las que dependemos.

## El pegamento que lo mantiene todo unido: código personalizado a escala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Si bien nuestros paquetes npm y nuestras contribuciones a proyectos existentes son significativos, es el código personalizado que integra estos componentes lo que realmente demuestra nuestra experiencia técnica. El código base de Forward Email representa una década de esfuerzo de desarrollo, que se remonta a 2017, cuando el proyecto comenzó como [reenvío de correo electrónico gratuito](https://github.com/forwardemail/free-email-forwarding) antes de fusionarse en un repositorio único.

### Un esfuerzo de desarrollo masivo {#a-massive-development-effort}

La escala de este código de integración personalizado es impresionante:

**Contribuciones totales**: Más de 3217 confirmaciones
* **Tamaño del código base**: Más de 421 545 líneas de código en archivos JavaScript, Pug, CSS y JSON\[^33]

Esto representa miles de horas de trabajo de desarrollo, sesiones de depuración y optimizaciones de rendimiento. Es la clave que transforma cada paquete en un servicio coherente y fiable, utilizado por miles de clientes a diario.

### Integración de dependencias principales {#core-dependencies-integration}

El código base de Forward Email integra numerosas dependencias en un todo integrado:

* **Procesamiento de correo electrónico**: Integra Nodemailer para el envío, el servidor SMTP para la recepción y Mailparser para el análisis.
* **Autenticación**: Utiliza Mailauth para la verificación de DKIM, SPF, DMARC y ARC.
* **Resolución DNS**: Utiliza Tangerine para DNS sobre HTTPS con almacenamiento en caché global.
* **Conexión MX**: Utiliza mx-connect con integración con Tangerine para conexiones fiables al servidor de correo.
* **Programación de tareas**: Utiliza Bree para el procesamiento fiable de tareas en segundo plano con subprocesos de trabajo.
* **Creación de plantillas**: Utiliza plantillas de correo electrónico para reutilizar hojas de estilo del sitio web en las comunicaciones con los clientes.
* **Almacenamiento de correo electrónico**: Implementa buzones de correo SQLite cifrados individualmente mediante cifrados múltiples better-sqlite3 con cifrado ChaCha20-Poly1305 para una privacidad cuántica segura, lo que garantiza un aislamiento completo entre usuarios y que solo el usuario tenga acceso a su buzón.

Cada una de estas integraciones requiere una cuidadosa consideración de los casos extremos, las implicaciones de rendimiento y los problemas de seguridad. El resultado es un sistema robusto que gestiona millones de transacciones de correo electrónico de forma fiable. Nuestra implementación de SQLite también utiliza msgpackr para una serialización binaria eficiente y WebSockets (vía ws) para actualizaciones de estado en tiempo real en toda nuestra infraestructura.

### Infraestructura DNS con Tangerine y mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Un componente crítico de la infraestructura de Forward Email es nuestro sistema de resolución de DNS, construido alrededor de dos paquetes clave:

* **[Mandarina](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Nuestra implementación de DNS sobre HTTPS de Node.js proporciona un reemplazo directo para el solucionador de DNS estándar, con reintentos integrados, tiempos de espera, rotación inteligente de servidores y soporte de almacenamiento en caché.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Este paquete establece conexiones TCP a servidores MX, tomando un dominio o dirección de correo electrónico de destino, resolviendo servidores MX apropiados y conectándose a ellos en orden de prioridad.

Hemos integrado Tangerine con mx-connect a través de [Solicitud de extracción #4](https://github.com/zone-eu/mx-connect/pull/4), lo que garantiza el DNS sobre solicitudes HTTP en la capa de aplicación en Forward Email. Esto proporciona almacenamiento en caché global para DNS a escala con consistencia 1:1 en cualquier región, aplicación o proceso, fundamental para la entrega confiable de correo electrónico en un sistema distribuido.

## Impacto empresarial: Del código abierto a soluciones de misión crítica {#enterprise-impact-from-open-source-to-mission-critical-solutions}

La culminación de nuestra trayectoria de una década en el desarrollo de código abierto ha permitido a Forward Email prestar servicio no solo a desarrolladores individuales, sino también a grandes empresas e instituciones educativas que conforman la columna vertebral del movimiento de código abierto.

### Casos prácticos en infraestructura de correo electrónico de misión crítica {#case-studies-in-mission-critical-email-infrastructure}

Nuestro compromiso con la confiabilidad, la privacidad y los principios de código abierto ha convertido a Forward Email en la opción de confianza para organizaciones con requisitos de correo electrónico exigentes:

* **Instituciones educativas**: Como se detalla en nuestro [caso práctico de reenvío de correo electrónico a exalumnos]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), las principales universidades confían en nuestra infraestructura para mantener conexiones permanentes con cientos de miles de ex alumnos a través de servicios confiables de reenvío de correo electrónico.

* **Soluciones Linux empresariales**: [Caso práctico de correo electrónico empresarial de Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demuestra cómo nuestro enfoque de código abierto se alinea perfectamente con las necesidades de los proveedores de Linux empresariales, ofreciéndoles la transparencia y el control que necesitan.

* **Fundamentos de código abierto**: Quizás lo más validante sea nuestra asociación con la Fundación Linux, como se documenta en [Caso práctico de la empresa de correo electrónico de Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), donde nuestro servicio potencia la comunicación para la misma organización que administra el desarrollo de Linux.

Existe una hermosa simetría en cómo nuestros paquetes de código abierto, mantenidos con esmero durante muchos años, nos han permitido crear un servicio de correo electrónico que ahora respalda a las mismas comunidades y organizaciones que defienden el software de código abierto. Este ciclo completo —desde la contribución de paquetes individuales hasta el desarrollo de una infraestructura de correo electrónico de nivel empresarial para líderes de código abierto— representa la validación definitiva de nuestro enfoque en el desarrollo de software.

## Una década de código abierto: mirando hacia el futuro {#a-decade-of-open-source-looking-forward}

Al mirar atrás a una década de contribuciones de código abierto y hacia los próximos diez años, estamos llenos de gratitud por la comunidad que ha apoyado nuestro trabajo y entusiasmo por lo que está por venir.

Nuestra trayectoria, desde contribuidores individuales de paquetes hasta mantenedores de una infraestructura de correo electrónico integral utilizada por grandes empresas y fundaciones de código abierto, ha sido notable. Es un testimonio del poder del desarrollo de código abierto y del impacto que un software bien pensado y bien mantenido puede tener en el ecosistema en general.

En los próximos años, nos comprometemos a:

* **Seguimos manteniendo y mejorando nuestros paquetes existentes**, garantizando que sigan siendo herramientas fiables para desarrolladores de todo el mundo.
* **Ampliamos nuestras contribuciones a proyectos de infraestructura crítica**, especialmente en los ámbitos del correo electrónico y la seguridad.
* **Mejoramos las capacidades de Forward Email**, manteniendo nuestro compromiso con la privacidad, la seguridad y la transparencia.
* **Apoyamos a la próxima generación de colaboradores de código abierto** mediante mentoría, patrocinio y participación comunitaria.

Creemos que el futuro del desarrollo de software es abierto, colaborativo y se basa en la confianza. Al seguir aportando paquetes de alta calidad y centrados en la seguridad al ecosistema JavaScript, esperamos contribuir a construir ese futuro.

Gracias a todos los que han usado nuestros paquetes, contribuido a nuestros proyectos, reportado problemas o simplemente difundido nuestro trabajo. Su apoyo ha hecho posible esta década de impacto, y nos entusiasma ver lo que podemos lograr juntos en los próximos diez años.

\[^1]: Estadísticas de descarga de npm para Cabin, abril de 2025
\[^2]: Estadísticas de descarga de npm para bson-objectid, febrero-marzo de 2025
\[^3]: Estadísticas de descarga de npm para url-regex-safe, abril de 2025
\[^4]: Número de estrellas de GitHub para forwardemail/forwardemail.net a abril de 2025
\[^5]: Estadísticas de descarga de npm para preview-email, abril de 2025
\[^7]: Estadísticas de descarga de npm para superagent, febrero-marzo de 2025
\[^8]: Estadísticas de descarga de npm para supertest, febrero-marzo de 2025
\[^9]: Estadísticas de descarga de npm para preview-email, febrero-marzo de 2025
\[^10]: Estadísticas de descarga de npm para Cabin, febrero-marzo de 2025
\[^11]: Estadísticas de descarga de npm para url-regex-safe, febrero-marzo de 2025
\[^12]: Estadísticas de descarga de npm para spamscanner, febrero-marzo de 2025
\[^13]: Patrones de descarga diarios de las estadísticas de npm, abril de 2025
\[^14]: Patrones de descarga semanales de las estadísticas de npm, abril de 2025
\[^15]: Estadísticas de descarga de npm para nodemailer, abril de 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Basado en problemas de GitHub en el repositorio de Upptime
\[^28]: Basado en problemas de GitHub en el repositorio de Upptime
\[^29]: Basado en problemas de GitHub en el repositorio de Upptime
\[^30]: Estadísticas de descargas de npm para bree, febrero-marzo de 2025
\[^31]: Basado en solicitudes de extracción de GitHub a Upptime
\[^32]: Basado en solicitudes de extracción de GitHub a Upptime
\[^34]: Estadísticas de descargas de npm para koa, febrero-marzo 2025
\[^35]: Estadísticas de descarga de npm para @koa/router, febrero-marzo de 2025
\[^36]: Estadísticas de descarga de npm para koa-router, febrero-marzo de 2025
\[^37]: Estadísticas de descarga de npm para url-regex, febrero-marzo de 2025
\[^38]: Estadísticas de descarga de npm para @breejs/later, febrero-marzo de 2025
\[^39]: Estadísticas de descarga de npm para email-templates, febrero-marzo de 2025
\[^40]: Estadísticas de descarga de npm para get-paths, febrero-marzo de 2025
\[^41]: Estadísticas de descarga de npm para dotenv-parse-variables, febrero-marzo de 2025
\[^42]: Estadísticas de descarga de npm para @koa/multer, febrero-marzo de 2025