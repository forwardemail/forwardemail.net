# Cómo optimizar la infraestructura de producción de Node.js: mejores prácticas {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Prefacio](#foreword)
* [Nuestra revolución de optimización del rendimiento de un solo núcleo del 573%](#our-573-single-core-performance-optimization-revolution)
  * [Por qué es importante optimizar el rendimiento de un solo núcleo para Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Contenido relacionado](#related-content)
* [Configuración del entorno de producción de Node.js: nuestra pila tecnológica](#nodejs-production-environment-setup-our-technology-stack)
  * [Administrador de paquetes: pnpm para una producción eficiente](#package-manager-pnpm-for-production-efficiency)
  * [Marco web: Koa para la producción moderna de Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Procesamiento de trabajos en segundo plano: Bree para la confiabilidad de la producción](#background-job-processing-bree-for-production-reliability)
  * [Manejo de errores: @hapi/boom para confiabilidad de producción](#error-handling-hapiboom-for-production-reliability)
* [Cómo supervisar aplicaciones Node.js en producción](#how-to-monitor-nodejs-applications-in-production)
  * [Monitoreo de producción de Node.js a nivel de sistema](#system-level-nodejs-production-monitoring)
  * [Monitoreo a nivel de aplicación para producción de Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitoreo específico de la aplicación](#application-specific-monitoring)
* [Monitoreo de producción de Node.js con comprobaciones de estado de PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Nuestro sistema de control de salud PM2](#our-pm2-health-check-system)
  * [Nuestra configuración de producción de PM2](#our-pm2-production-configuration)
  * [Implementación automatizada de PM2](#automated-pm2-deployment)
* [Sistema de clasificación y manejo de errores de producción](#production-error-handling-and-classification-system)
  * [Nuestra implementación de isCodeBug para producción](#our-iscodebug-implementation-for-production)
  * [Integración con nuestro registro de producción](#integration-with-our-production-logging)
  * [Contenido relacionado](#related-content-1)
* [Depuración de rendimiento avanzada con v8-profiler-next y cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Nuestro enfoque de creación de perfiles para la producción de Node.js](#our-profiling-approach-for-nodejs-production)
  * [Cómo implementamos el análisis de instantáneas de montón](#how-we-implement-heap-snapshot-analysis)
  * [Flujo de trabajo de depuración del rendimiento](#performance-debugging-workflow)
  * [Implementación recomendada para su aplicación Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integración con nuestro sistema de monitoreo de producción](#integration-with-our-production-monitoring)
* [Seguridad de la infraestructura de producción de Node.js](#nodejs-production-infrastructure-security)
  * [Seguridad a nivel de sistema para la producción de Node.js](#system-level-security-for-nodejs-production)
  * [Seguridad de aplicaciones para aplicaciones Node.js](#application-security-for-nodejs-applications)
  * [Automatización de la seguridad de la infraestructura](#infrastructure-security-automation)
  * [Nuestro contenido de seguridad](#our-security-content)
* [Arquitectura de bases de datos para aplicaciones Node.js](#database-architecture-for-nodejs-applications)
  * [Implementación de SQLite para producción en Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementación de MongoDB para la producción de Node.js](#mongodb-implementation-for-nodejs-production)
* [Procesamiento de trabajos en segundo plano de producción de Node.js](#nodejs-production-background-job-processing)
  * [Nuestra configuración del servidor Bree para producción](#our-bree-server-setup-for-production)
  * [Ejemplos de trabajos de producción](#production-job-examples)
  * [Nuestros patrones de programación de trabajos para la producción de Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Mantenimiento automatizado para aplicaciones Node.js de producción](#automated-maintenance-for-production-nodejs-applications)
  * [Nuestra implementación de limpieza](#our-cleanup-implementation)
  * [Gestión del espacio en disco para la producción de Node.js](#disk-space-management-for-nodejs-production)
  * [Automatización del mantenimiento de infraestructura](#infrastructure-maintenance-automation)
* [Guía de implementación de producción de Node.js](#nodejs-production-deployment-implementation-guide)
  * [Estudie nuestro código actual para conocer las mejores prácticas de producción](#study-our-actual-code-for-production-best-practices)
  * [Aprenda de nuestras publicaciones de blog](#learn-from-our-blog-posts)
  * [Automatización de infraestructura para la producción de Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nuestros casos de estudio](#our-case-studies)
* [Conclusión: Mejores prácticas para la implementación en producción de Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Lista completa de recursos para la producción de Node.js](#complete-resource-list-for-nodejs-production)
  * [Nuestros archivos de implementación principales](#our-core-implementation-files)
  * [Nuestras implementaciones de servidores](#our-server-implementations)
  * [Nuestra automatización de infraestructura](#our-infrastructure-automation)
  * [Nuestras publicaciones de blog técnico](#our-technical-blog-posts)
  * [Nuestros estudios de caso empresariales](#our-enterprise-case-studies)

## Prólogo {#foreword}

En Forward Email, hemos dedicado años a perfeccionar la configuración de nuestro entorno de producción de Node.js. Esta guía completa comparte nuestras prácticas recomendadas para la implementación de Node.js en producción, con una eficacia comprobada, centrándose en la optimización del rendimiento, la monitorización y las lecciones aprendidas al escalar aplicaciones de Node.js para gestionar millones de transacciones diarias.

## Nuestra revolución de optimización del rendimiento de un solo núcleo del 573% {#our-573-single-core-performance-optimization-revolution}

Al migrar de procesadores Intel a AMD Ryzen, logramos una **mejora del rendimiento del 573 %** en nuestras aplicaciones Node.js. Esto no fue solo una optimización menor, sino que cambió radicalmente el rendimiento de nuestras aplicaciones Node.js en producción y demuestra la importancia de la optimización del rendimiento de un solo núcleo para cualquier aplicación Node.js.

> \[!TIP]
> Para las mejores prácticas de implementación de producción de Node.js, la elección del hardware es crucial. Elegimos específicamente el alojamiento de DataPacket por su disponibilidad en AMD Ryzen, ya que el rendimiento de un solo núcleo es crucial para las aplicaciones Node.js, ya que la ejecución de JavaScript es de un solo subproceso.

### Por qué es importante la optimización del rendimiento de un solo núcleo para Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Nuestra migración de Intel a AMD Ryzen resultó en:

* **Mejora del rendimiento del 573 %** en el procesamiento de solicitudes (documentado en [Problema de GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 de nuestra página de estado
* **Eliminación de retrasos en el procesamiento** para obtener respuestas casi instantáneas (mencionado en [Problema de GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Mejor relación precio-rendimiento** para entornos de producción de Node.js
* **Tiempos de respuesta mejorados** en todos los endpoints de nuestras aplicaciones

La mejora del rendimiento fue tan significativa que ahora consideramos los procesadores AMD Ryzen esenciales para cualquier implementación de producción de Node.js, ya sea que ejecute aplicaciones web, API, microservicios o cualquier otra carga de trabajo de Node.js.

### Contenido relacionado {#related-content})

Para obtener más información sobre nuestras opciones de infraestructura, consulte:

* [Mejor servicio de reenvío de correo electrónico]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Comparaciones de rendimiento)
* [Solución autoalojada](https://forwardemail.net/blog/docs/self-hosted-solution) - Recomendaciones de hardware

## Configuración del entorno de producción de Node.js: nuestra pila de tecnología {#nodejs-production-environment-setup-our-technology-stack}

Nuestras mejores prácticas para la implementación de Node.js en producción incluyen la selección de tecnologías deliberadas, basadas en años de experiencia en producción. A continuación, explicamos qué usamos y por qué estas decisiones se aplican a cualquier aplicación Node.js:

### Administrador de paquetes: pnpm para eficiencia de producción {#package-manager-pnpm-for-production-efficiency}

**Lo que usamos:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versión fijada)

Elegimos pnpm en lugar de npm y yarn para la configuración de nuestro entorno de producción Node.js porque:

* **Tiempos de instalación más rápidos** en pipelines de CI/CD
* **Eficiencia del espacio en disco** mediante enlaces físicos
* **Resolución estricta de dependencias** que evita dependencias fantasma
* **Mejor rendimiento** en implementaciones de producción

> \[!NOTE]
> Como parte de nuestras mejores prácticas de implementación de producción de Node.js, fijamos versiones exactas de herramientas críticas como pnpm para garantizar un comportamiento consistente en todos los entornos y las máquinas de los miembros del equipo.

**Detalles de implementación:**

* [Nuestra configuración de package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Nuestra publicación del blog sobre el ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Marco web: Koa para la producción moderna de Node.js {#web-framework-koa-for-modern-nodejs-production}

**Lo que usamos:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Elegimos Koa en lugar de Express para nuestra infraestructura de producción de Node.js por su moderna compatibilidad con async/await y su estructura de middleware más limpia. Nuestro fundador, Nick Baugh, contribuyó tanto a Express como a Koa, brindándonos un conocimiento profundo de ambos frameworks para su uso en producción.

Estos patrones se aplican independientemente de si estás creando API REST, servidores GraphQL, aplicaciones web o microservicios.

**Nuestros ejemplos de implementación:**

* [Configuración del servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configuración del servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guía de implementación de formularios de contacto](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Procesamiento de trabajos en segundo plano: Bree para confiabilidad de producción {#background-job-processing-bree-for-production-reliability}

**Lo que usamos:** Programador [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Creamos y mantenemos Bree porque los programadores de tareas existentes no satisfacían nuestras necesidades de compatibilidad con subprocesos de trabajo y funciones modernas de JavaScript en entornos de producción de Node.js. Esto aplica a cualquier aplicación de Node.js que requiera procesamiento en segundo plano, tareas programadas o subprocesos de trabajo.

**Nuestros ejemplos de implementación:**

* [Configuración del servidor Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Todas nuestras definiciones de trabajo](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Trabajo de verificación de salud de PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementación del trabajo de limpieza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Manejo de errores: @hapi/boom para confiabilidad de producción {#error-handling-hapiboom-for-production-reliability}

**Lo que usamos:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Usamos @hapi/boom para respuestas de error estructuradas en nuestras aplicaciones de producción de Node.js. Este patrón funciona para cualquier aplicación de Node.js que requiera una gestión de errores consistente.

**Nuestros ejemplos de implementación:**

* [Asistente de clasificación de errores](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementación del registrador](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Cómo monitorear aplicaciones Node.js en producción {#how-to-monitor-nodejs-applications-in-production}

Nuestro enfoque para la monitorización de aplicaciones Node.js en producción ha evolucionado a lo largo de años de ejecución a gran escala. Implementamos la monitorización en múltiples capas para garantizar la fiabilidad y el rendimiento de cualquier tipo de aplicación Node.js.

### Monitoreo de producción de Node.js a nivel de sistema {#system-level-nodejs-production-monitoring}

**Nuestra implementación principal:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Lo que usamos:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nuestros umbrales de monitorización de la producción (según nuestro código de producción real):

* **Límite de tamaño de pila de 2 GB** con alertas automáticas
* **Umbral de advertencia de uso de memoria del 25 %**
* **Umbral de advertencia de uso de CPU del 80 %**
* **Umbral de advertencia de uso de disco del 75 %**

> \[!WARNING]
> Estos umbrales funcionan para nuestra configuración de hardware específica. Al implementar la monitorización de producción de Node.js, revise la implementación de monitor-server.js para comprender la lógica exacta y adaptar los valores a su configuración.

### Monitoreo a nivel de aplicación para la producción de Node.js {#application-level-monitoring-for-nodejs-production}

**Nuestra clasificación de error:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este ayudante distingue entre:

* **Errores de código reales** que requieren atención inmediata
* **Errores de usuario** que son comportamiento esperado
* **Errores de servicios externos** que escapan a nuestro control

Este patrón se aplica a cualquier aplicación Node.js: aplicaciones web, API, microservicios o servicios en segundo plano.

**Nuestra implementación de registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementamos una redacción de campos integral para proteger la información confidencial y al mismo tiempo mantener capacidades de depuración útiles en nuestro entorno de producción Node.js.

### Monitoreo específico de la aplicación {#application-specific-monitoring}

**Nuestras implementaciones de servidor:**

* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

Monitoreo de colas: Implementamos límites de cola de 5 GB y tiempos de espera de 180 segundos para el procesamiento de solicitudes para evitar el agotamiento de recursos. Estos patrones se aplican a cualquier aplicación Node.js con colas o procesamiento en segundo plano.

## Monitoreo de producción de Node.js con comprobaciones de estado de PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Hemos perfeccionado la configuración de nuestro entorno de producción de Node.js con PM2 a lo largo de años de experiencia en producción. Nuestras comprobaciones de estado de PM2 son esenciales para mantener la fiabilidad de cualquier aplicación Node.js.

### Nuestro sistema de control de salud PM2 {#our-pm2-health-check-system}

**Nuestra implementación principal:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Nuestra monitorización de producción de Node.js con comprobaciones de estado de PM2 incluye:

* **Se ejecuta cada 20 minutos** mediante programación cron
* **Requiere un mínimo de 15 minutos de actividad** para considerar que un proceso funciona correctamente
* **Valida el estado del proceso y el uso de memoria**
* **Reinicia automáticamente los procesos fallidos**
* **Evita bucles de reinicio** mediante la comprobación inteligente del estado

> \[!CAUTION]
> Para las mejores prácticas de implementación de producción de Node.js, requerimos un tiempo de actividad superior a 15 minutos antes de considerar que un proceso está en buen estado para evitar bucles de reinicio. Esto evita fallos en cascada cuando los procesos tienen problemas de memoria u otros problemas.

### Nuestra configuración de producción de PM2 {#our-pm2-production-configuration}

**Configuración de nuestro ecosistema:** Estudie nuestros archivos de inicio del servidor para la configuración del entorno de producción de Node.js:

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Programador de Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Estos patrones se aplican independientemente de si está ejecutando aplicaciones Express, servidores Koa, API GraphQL o cualquier otra aplicación Node.js.

### Implementación automatizada de PM2 {#automated-pm2-deployment}

**Implementación de PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizamos toda nuestra configuración de PM2 a través de Ansible para garantizar implementaciones de producción de Node.js consistentes en todos nuestros servidores.

## Sistema de clasificación y manejo de errores de producción {#production-error-handling-and-classification-system}

Una de nuestras prácticas recomendadas de implementación de producción de Node.js más valiosas es la clasificación inteligente de errores que se aplica a cualquier aplicación Node.js:

### Nuestra implementación de isCodeBug para producción {#our-iscodebug-implementation-for-production}

**Fuente:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este ayudante proporciona una clasificación de errores inteligente para aplicaciones Node.js en producción para:

* **Priorizar los errores reales** sobre los errores del usuario
* **Mejorar nuestra respuesta a incidentes** centrándonos en los problemas reales
* **Reducir la fatiga de alertas** causada por errores esperados del usuario
* **Comprender mejor** los problemas de la aplicación frente a los generados por el usuario

Este patrón funciona para cualquier aplicación Node.js, ya sea que esté creando sitios de comercio electrónico, plataformas SaaS, API o microservicios.

### Integración con nuestro registro de producción {#integration-with-our-production-logging}

**Nuestra integración del registrador:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nuestro registrador utiliza `isCodeBug` para determinar los niveles de alerta y la redacción de campos, lo que garantiza que recibamos notificaciones sobre problemas reales mientras filtramos el ruido en nuestro entorno de producción Node.js.

### Contenido relacionado {#related-content-1}

Obtenga más información sobre nuestros patrones de manejo de errores:

* [Construyendo un sistema de pago confiable](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Patrones de gestión de errores
* [Protección de la privacidad del correo electrónico](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Gestión de errores de seguridad

## Depuración de rendimiento avanzada con v8-profiler-next y cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Utilizamos herramientas avanzadas de perfilado para analizar instantáneas del montón y depurar problemas de memoria insuficiente (OOM), cuellos de botella de rendimiento y problemas de memoria de Node.js en nuestro entorno de producción. Estas herramientas son esenciales para cualquier aplicación Node.js que experimente fugas de memoria o problemas de rendimiento.

### Nuestro enfoque de creación de perfiles para la producción de Node.js {#our-profiling-approach-for-nodejs-production}

**Herramientas que recomendamos:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Para generar instantáneas de montón y perfiles de CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Para analizar perfiles de CPU e instantáneas de montón

> \[!TIP]
> Utilizamos v8-profiler-next y cpupro para crear un flujo de trabajo completo de depuración de rendimiento para nuestras aplicaciones Node.js. Esta combinación nos ayuda a identificar fugas de memoria y cuellos de botella de rendimiento, y a optimizar nuestro código de producción.

### Cómo implementamos el análisis de instantáneas de montón {#how-we-implement-heap-snapshot-analysis}

**Nuestra implementación de monitoreo:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Nuestra monitorización de producción incluye la generación automática de instantáneas del montón cuando se superan los umbrales de memoria. Esto nos ayuda a depurar problemas de memoria insuficiente (OOM) antes de que provoquen fallos en las aplicaciones.

**Patrones de implementación clave:**

* **Instantáneas automáticas** cuando el tamaño del montón supera el límite de 2 GB
* **Perfiles basados en señales** para análisis bajo demanda en producción
* **Políticas de retención** para la gestión del almacenamiento de instantáneas
* **Integración con nuestras tareas de limpieza** para un mantenimiento automatizado

### Flujo de trabajo de depuración de rendimiento {#performance-debugging-workflow}

**Estudie nuestra implementación real:**

* [Supervisar la implementación del servidor](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoreo de montón y generación de instantáneas
* [Trabajo de limpieza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Retención y limpieza de instantáneas
* [Integración del registrador](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Registro de rendimiento

### Implementación recomendada para su aplicación Node.js {#recommended-implementation-for-your-nodejs-application}

**Para el análisis de instantáneas del montón:**

1. **Instalar v8-profiler-next** para generar instantáneas
2. **Usar cpupro** para analizar las instantáneas generadas
3. **Implementar umbrales de monitorización** similares a nuestro monitor-server.js
4. **Configurar la limpieza automatizada** para gestionar el almacenamiento de instantáneas
5. **Crear controladores de señales** para la generación de perfiles bajo demanda en producción

**Para la creación de perfiles de CPU:**

1. **Generar perfiles de CPU** durante periodos de alta carga
2. **Analizar con cpupro** para identificar cuellos de botella
3. **Enfocarse en rutas de alto rendimiento** y oportunidades de optimización
4. **Monitorear antes y después** de las mejoras de rendimiento

> \[!WARNING]
> La generación de instantáneas del montón y perfiles de CPU puede afectar el rendimiento. Recomendamos implementar la limitación y habilitar la generación de perfiles solo al investigar problemas específicos o durante periodos de mantenimiento.

### Integración con nuestro monitoreo de producción {#integration-with-our-production-monitoring}

Nuestras herramientas de elaboración de perfiles se integran con nuestra estrategia de monitoreo más amplia:

* **Activación automática** según los umbrales de memoria/CPU
* **Integración de alertas** al detectar problemas de rendimiento
* **Análisis histórico** para rastrear las tendencias de rendimiento a lo largo del tiempo
* **Correlación con las métricas de la aplicación** para una depuración completa

Este enfoque nos ha ayudado a identificar y resolver fugas de memoria, optimizar rutas de código activo y mantener un rendimiento estable en nuestro entorno de producción Node.js.

## Seguridad de la infraestructura de producción de Node.js {#nodejs-production-infrastructure-security}

Implementamos una seguridad integral para nuestra infraestructura de producción de Node.js mediante la automatización de Ansible. Estas prácticas se aplican a cualquier aplicación de Node.js:

### Seguridad a nivel de sistema para la producción de Node.js {#system-level-security-for-nodejs-production}

**Nuestra implementación de Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nuestras medidas de seguridad clave para entornos de producción de Node.js:

* **Intercambio deshabilitado** para evitar que se escriban datos confidenciales en el disco
* **Volcados de memoria deshabilitados** para evitar volcados de memoria que contengan información confidencial
* **Almacenamiento USB bloqueado** para evitar acceso no autorizado a datos
* **Ajuste de parámetros del kernel** para seguridad y rendimiento

> \[!WARNING]
> Al implementar las mejores prácticas de implementación en producción de Node.js, deshabilitar el intercambio puede causar interrupciones por falta de memoria si la aplicación excede la RAM disponible. Monitoreamos cuidadosamente el uso de memoria y dimensionamos nuestros servidores adecuadamente.

### Seguridad de aplicaciones para aplicaciones Node.js {#application-security-for-nodejs-applications}

**Redacción de nuestro campo de registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Reducimos los campos sensibles de los registros, como contraseñas, tokens, claves API e información personal. Esto protege la privacidad del usuario y mantiene la capacidad de depuración en cualquier entorno de producción de Node.js.

### Automatización de seguridad de infraestructura {#infrastructure-security-automation}

**Nuestra configuración completa de Ansible para la producción de Node.js:**

* [Manual de seguridad](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gestión de claves SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestión de certificados](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configuración de DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nuestro contenido de seguridad {#our-security-content}

Obtenga más información sobre nuestro enfoque de seguridad:

* [Las mejores empresas de auditoría de seguridad](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Correo electrónico cifrado Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [¿Por qué la seguridad del correo electrónico de código abierto?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Arquitectura de base de datos para aplicaciones Node.js {#database-architecture-for-nodejs-applications}

Utilizamos un enfoque de base de datos híbrida optimizado para nuestras aplicaciones Node.js. Estos patrones se pueden adaptar a cualquier aplicación Node.js:

### Implementación de SQLite para la producción de Node.js {#sqlite-implementation-for-nodejs-production}

**Lo que usamos:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nuestra configuración:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Usamos SQLite para datos específicos del usuario en nuestras aplicaciones Node.js porque proporciona:

* **Aislamiento de datos** por usuario/inquilino
* **Mejor rendimiento** para consultas de un solo usuario
* **Copia de seguridad y migración simplificadas**
* **Menor complejidad** en comparación con bases de datos compartidas

Este patrón funciona bien para aplicaciones SaaS, sistemas multiinquilino o cualquier aplicación Node.js que necesite aislamiento de datos.

### Implementación de MongoDB para la producción de Node.js {#mongodb-implementation-for-nodejs-production}

**Lo que usamos:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nuestra implementación de configuración:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Nuestra configuración:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Usamos MongoDB para los datos de la aplicación en nuestro entorno de producción Node.js porque proporciona:

* **Esquema flexible** para estructuras de datos en evolución
* **Mejor rendimiento** para consultas complejas
* **Capacidades de escalamiento horizontal**
* **Lenguaje de consulta enriquecido**

> \[!NOTE]
> Nuestro enfoque híbrido se optimiza para nuestro caso de uso específico. Analice los patrones de uso de la base de datos en el código fuente para comprender si este enfoque se adapta a las necesidades de su aplicación Node.js.

## Procesamiento de trabajo en segundo plano de producción de Node.js {#nodejs-production-background-job-processing}

Desarrollamos nuestra arquitectura de trabajos en segundo plano en torno a Bree para una implementación de producción confiable de Node.js. Esto aplica a cualquier aplicación Node.js que requiera procesamiento en segundo plano:

### Nuestra configuración del servidor Bree para producción {#our-bree-server-setup-for-production}

**Nuestra implementación principal:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Nuestra implementación de Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Ejemplos de trabajos de producción {#production-job-examples}

**Monitoreo de salud:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatización de limpieza:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Todos nuestros trabajos:** [Explora nuestro directorio completo de empleos](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Estos patrones se aplican a cualquier aplicación Node.js que necesite:

* Tareas programadas (procesamiento de datos, informes, limpieza)
* Procesamiento en segundo plano (redimensionamiento de imágenes, envío de correos electrónicos, importación de datos)
* Monitoreo y mantenimiento del estado
* Utilización de subprocesos de trabajo para tareas con uso intensivo de CPU

### Nuestros patrones de programación de trabajos para la producción de Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Estudie nuestros patrones reales de programación de trabajos en nuestro directorio de trabajos para comprender:

* Cómo implementamos la programación similar a la de cron en la producción de Node.js
* Nuestra gestión de errores y lógica de reintentos
* Cómo usamos los subprocesos de trabajo para tareas que consumen mucha CPU

## Mantenimiento automatizado para aplicaciones de producción Node.js {#automated-maintenance-for-production-nodejs-applications}

Implementamos mantenimiento proactivo para prevenir problemas comunes en producción de Node.js. Estos patrones se aplican a cualquier aplicación Node.js:

### Nuestra implementación de limpieza {#our-cleanup-implementation}

**Fuente:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Nuestro mantenimiento automatizado para aplicaciones de producción Node.js tiene como objetivo:

* **Archivos temporales** con más de 24 horas de antigüedad
* **Archivos de registro** que superan los límites de retención
* **Archivos de caché** y datos temporales
* **Archivos subidos** que ya no se necesitan
* **Instantáneas de montón** de la depuración de rendimiento

Estos patrones se aplican a cualquier aplicación Node.js que genere archivos temporales, registros o datos almacenados en caché.

### Gestión del espacio en disco para la producción de Node.js {#disk-space-management-for-nodejs-production}

**Nuestros umbrales de monitoreo:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Límites de cola** para procesamiento en segundo plano
* **Umbral de advertencia de 75 % de uso del disco**
* **Limpieza automática** al superar los umbrales

### Automatización del mantenimiento de infraestructura {#infrastructure-maintenance-automation}

**Nuestra automatización de Ansible para la producción de Node.js:**

* [Despliegue del entorno](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gestión de claves de implementación](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Guía de implementación de producción de Node.js {#nodejs-production-deployment-implementation-guide}

### Estudie nuestro código actual para conocer las mejores prácticas de producción {#study-our-actual-code-for-production-best-practices}

**Comience con estos archivos clave para la configuración del entorno de producción de Node.js:**

1. **Configuración:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoreo:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Gestión de errores:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Estado del proceso:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Aprenda de nuestras publicaciones de blog {#learn-from-our-blog-posts}

**Nuestras guías de implementación técnica para la producción de Node.js:**

* [Ecosistema de paquetes NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Construcción de sistemas de pago](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementación de la privacidad del correo electrónico](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularios de contacto de JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integración de correo electrónico de React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatización de infraestructura para la producción de Node.js {#infrastructure-automation-for-nodejs-production}

**Nuestros playbooks de Ansible para estudiar para la implementación de producción de Node.js:**

* [Directorio completo de playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Fortalecimiento de la seguridad](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuración de Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nuestros casos de estudio {#our-case-studies}

**Nuestras implementaciones empresariales:**

* [Estudio de caso de la Fundación Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Caso práctico de Ubuntu de Canonical](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Reenvío de correo electrónico de exalumnos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Conclusión: Mejores prácticas de implementación de producción de Node.js {#conclusion-nodejs-production-deployment-best-practices}

Nuestra infraestructura de producción Node.js demuestra que las aplicaciones Node.js pueden lograr una confiabilidad de nivel empresarial a través de:

* **Opciones de hardware probadas** (AMD Ryzen para una optimización del rendimiento de un solo núcleo del 573 %)
* **Monitoreo de producción de Node.js probado en campo** con umbrales específicos y respuestas automatizadas
* **Clasificación inteligente de errores** para mejorar la respuesta a incidentes en entornos de producción
* **Depuración avanzada del rendimiento** con v8-profiler-next y cpupro para la prevención de OOM
* **Refuerzo integral de la seguridad** mediante la automatización de Ansible
* **Arquitectura de base de datos híbrida** optimizada para las necesidades de la aplicación
* **Mantenimiento automatizado** para prevenir problemas comunes de producción de Node.js

**Conclusión clave:** Estudie nuestros archivos de implementación y publicaciones de blog en lugar de seguir las mejores prácticas genéricas. Nuestro código base proporciona patrones reales para la implementación en producción de Node.js, adaptables a cualquier aplicación Node.js: aplicaciones web, API, microservicios o servicios en segundo plano.

## Lista completa de recursos para la producción de Node.js {#complete-resource-list-for-nodejs-production}

### Nuestros archivos de implementación principales {#our-core-implementation-files}

* [Configuración principal](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dependencias del paquete](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitoreo de servidores](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Clasificación de errores](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistema de registro](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Controles de salud de PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Limpieza automatizada](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Nuestras implementaciones de servidor {#our-server-implementations}

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Programador de Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Nuestra Automatización de Infraestructura {#our-infrastructure-automation}

* [Todos nuestros playbooks de Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Fortalecimiento de la seguridad](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuración de Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configuración de la base de datos](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nuestras publicaciones de blog técnico {#our-technical-blog-posts}

* [Análisis del ecosistema de NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementación del sistema de pago](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guía técnica de privacidad del correo electrónico](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularios de contacto de JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integración de correo electrónico de React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guía de soluciones autoalojadas](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nuestros estudios de caso empresariales {#our-enterprise-case-studies}

* [Implementación de la Fundación Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Caso práctico de Ubuntu de Canonical](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Cumplimiento del Gobierno Federal](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistemas de correo electrónico para exalumnos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)