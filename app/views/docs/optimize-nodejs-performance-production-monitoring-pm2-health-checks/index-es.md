# Cómo Optimizar la Infraestructura de Producción de Node.js: Mejores Prácticas {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Guía de optimización de rendimiento de Node.js" class="rounded-lg" />


## Tabla de Contenidos {#table-of-contents}

* [Prólogo](#foreword)
* [Nuestra Revolución de Optimización de Rendimiento de Núcleo Único del 573%](#our-573-single-core-performance-optimization-revolution)
  * [Por qué la Optimización de Rendimiento de Núcleo Único es Importante para Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Contenido Relacionado](#related-content)
* [Configuración del Entorno de Producción de Node.js: Nuestra Pila Tecnológica](#nodejs-production-environment-setup-our-technology-stack)
  * [Gestor de Paquetes: pnpm para Eficiencia en Producción](#package-manager-pnpm-for-production-efficiency)
  * [Framework Web: Koa para Producción Moderna de Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Procesamiento de Trabajos en Segundo Plano: Bree para Confiabilidad en Producción](#background-job-processing-bree-for-production-reliability)
  * [Manejo de Errores: @hapi/boom para Confiabilidad en Producción](#error-handling-hapiboom-for-production-reliability)
* [Cómo Monitorear Aplicaciones Node.js en Producción](#how-to-monitor-nodejs-applications-in-production)
  * [Monitoreo a Nivel de Sistema para Producción Node.js](#system-level-nodejs-production-monitoring)
  * [Monitoreo a Nivel de Aplicación para Producción Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitoreo Específico de Aplicaciones](#application-specific-monitoring)
* [Monitoreo de Producción Node.js con Chequeos de Salud PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Nuestro Sistema de Chequeo de Salud PM2](#our-pm2-health-check-system)
  * [Nuestra Configuración de Producción PM2](#our-pm2-production-configuration)
  * [Despliegue Automatizado PM2](#automated-pm2-deployment)
* [Sistema de Manejo y Clasificación de Errores en Producción](#production-error-handling-and-classification-system)
  * [Nuestra Implementación isCodeBug para Producción](#our-iscodebug-implementation-for-production)
  * [Integración con Nuestro Registro de Producción](#integration-with-our-production-logging)
  * [Contenido Relacionado](#related-content-1)
* [Depuración Avanzada de Rendimiento con v8-profiler-next y cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Nuestro Enfoque de Perfilado para Producción Node.js](#our-profiling-approach-for-nodejs-production)
  * [Cómo Implementamos el Análisis de Instantáneas de Heap](#how-we-implement-heap-snapshot-analysis)
  * [Flujo de Trabajo para Depuración de Rendimiento](#performance-debugging-workflow)
  * [Implementación Recomendada para Tu Aplicación Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integración con Nuestro Monitoreo de Producción](#integration-with-our-production-monitoring)
* [Seguridad de la Infraestructura de Producción Node.js](#nodejs-production-infrastructure-security)
  * [Seguridad a Nivel de Sistema para Producción Node.js](#system-level-security-for-nodejs-production)
  * [Seguridad de Aplicaciones para Aplicaciones Node.js](#application-security-for-nodejs-applications)
  * [Automatización de Seguridad de Infraestructura](#infrastructure-security-automation)
  * [Nuestro Contenido de Seguridad](#our-security-content)
* [Arquitectura de Base de Datos para Aplicaciones Node.js](#database-architecture-for-nodejs-applications)
  * [Implementación SQLite para Producción Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementación MongoDB para Producción Node.js](#mongodb-implementation-for-nodejs-production)
* [Procesamiento de Trabajos en Segundo Plano para Producción Node.js](#nodejs-production-background-job-processing)
  * [Nuestra Configuración de Servidor Bree para Producción](#our-bree-server-setup-for-production)
  * [Ejemplos de Trabajos en Producción](#production-job-examples)
  * [Nuestros Patrones de Programación de Trabajos para Producción Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Mantenimiento Automatizado para Aplicaciones Node.js en Producción](#automated-maintenance-for-production-nodejs-applications)
  * [Nuestra Implementación de Limpieza](#our-cleanup-implementation)
  * [Gestión de Espacio en Disco para Producción Node.js](#disk-space-management-for-nodejs-production)
  * [Automatización del Mantenimiento de Infraestructura](#infrastructure-maintenance-automation)
* [Guía de Implementación para Despliegue en Producción Node.js](#nodejs-production-deployment-implementation-guide)
  * [Estudia Nuestro Código Real para Mejores Prácticas en Producción](#study-our-actual-code-for-production-best-practices)
  * [Aprende de Nuestros Artículos de Blog](#learn-from-our-blog-posts)
  * [Automatización de Infraestructura para Producción Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nuestros Estudios de Caso](#our-case-studies)
* [Conclusión: Mejores Prácticas para Despliegue en Producción Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Lista Completa de Recursos para Producción Node.js](#complete-resource-list-for-nodejs-production)
  * [Nuestros Archivos de Implementación Central](#our-core-implementation-files)
  * [Nuestras Implementaciones de Servidor](#our-server-implementations)
  * [Nuestra Automatización de Infraestructura](#our-infrastructure-automation)
  * [Nuestros Artículos Técnicos de Blog](#our-technical-blog-posts)
  * [Nuestros Estudios de Caso Empresariales](#our-enterprise-case-studies)
## Prólogo {#foreword}

En Forward Email, hemos pasado años perfeccionando nuestra configuración de entorno de producción Node.js. Esta guía completa comparte nuestras mejores prácticas probadas para el despliegue de producción de Node.js, enfocándose en la optimización del rendimiento, monitoreo y las lecciones que hemos aprendido al escalar aplicaciones Node.js para manejar millones de transacciones diarias.

## Nuestra revolución del 573% en optimización de rendimiento de un solo núcleo {#our-573-single-core-performance-optimization-revolution}

Cuando migramos de procesadores Intel a AMD Ryzen, logramos una **mejora del rendimiento del 573%** en nuestras aplicaciones Node.js. Esto no fue solo una optimización menor, sino que cambió fundamentalmente cómo funcionan nuestras aplicaciones Node.js en producción y demuestra la importancia de la optimización del rendimiento de un solo núcleo para cualquier aplicación Node.js.

> \[!TIP]
> Para las mejores prácticas de despliegue de producción de Node.js, la elección del hardware es crítica. Elegimos específicamente el hosting DataPacket por su disponibilidad de AMD Ryzen porque el rendimiento de un solo núcleo es crucial para las aplicaciones Node.js ya que la ejecución de JavaScript es de un solo hilo.

### Por qué la optimización del rendimiento de un solo núcleo importa para Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Nuestra migración de Intel a AMD Ryzen resultó en:

* **Mejora del rendimiento del 573%** en el procesamiento de solicitudes (documentado en [el Issue #1519 de nuestra página de estado en GitHub](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminación de retrasos en el procesamiento** para respuestas casi instantáneas (mencionado en [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Mejor relación precio-rendimiento** para entornos de producción Node.js
* **Mejora en los tiempos de respuesta** en todos los endpoints de nuestra aplicación

El aumento de rendimiento fue tan significativo que ahora consideramos los procesadores AMD Ryzen esenciales para cualquier despliegue serio de producción Node.js, ya sea que ejecutes aplicaciones web, APIs, microservicios o cualquier otra carga de trabajo Node.js.

### Contenido relacionado {#related-content}

Para más detalles sobre nuestras elecciones de infraestructura, consulta:

* [Mejor servicio de reenvío de correo electrónico](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Comparaciones de rendimiento
* [Solución autoalojada](https://forwardemail.net/blog/docs/self-hosted-solution) - Recomendaciones de hardware

## Configuración del entorno de producción Node.js: Nuestra pila tecnológica {#nodejs-production-environment-setup-our-technology-stack}

Nuestras mejores prácticas para el despliegue de producción Node.js incluyen elecciones tecnológicas deliberadas basadas en años de experiencia en producción. Esto es lo que usamos y por qué estas elecciones aplican a cualquier aplicación Node.js:

### Gestor de paquetes: pnpm para eficiencia en producción {#package-manager-pnpm-for-production-efficiency}

**Lo que usamos:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versión fijada)

Elegimos pnpm sobre npm y yarn para nuestra configuración de entorno de producción Node.js porque:

* **Tiempos de instalación más rápidos** en pipelines CI/CD
* **Eficiencia en espacio en disco** mediante enlaces duros
* **Resolución estricta de dependencias** que previene dependencias fantasma
* **Mejor rendimiento** en despliegues de producción

> \[!NOTE]
> Como parte de nuestras mejores prácticas para el despliegue de producción Node.js, fijamos versiones exactas de herramientas críticas como pnpm para asegurar un comportamiento consistente en todos los entornos y máquinas de los miembros del equipo.

**Detalles de implementación:**

* [Nuestra configuración package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Nuestro post en el blog sobre el ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework web: Koa para producción moderna en Node.js {#web-framework-koa-for-modern-nodejs-production}

**Lo que usamos:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Elegimos Koa sobre Express para nuestra infraestructura de producción en Node.js debido a su soporte moderno para async/await y una composición de middleware más limpia. Nuestro fundador Nick Baugh contribuyó tanto a Express como a Koa, lo que nos brinda una profunda comprensión de ambos frameworks para su uso en producción.

Estos patrones se aplican ya sea que estés construyendo APIs REST, servidores GraphQL, aplicaciones web o microservicios.

**Nuestros ejemplos de implementación:**

* [Configuración del servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configuración del servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guía de implementación de formularios de contacto](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Procesamiento de Trabajos en Segundo Plano: Bree para Confiabilidad en Producción {#background-job-processing-bree-for-production-reliability}

**Lo que usamos:** planificador [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Creamos y mantenemos Bree porque los planificadores de trabajos existentes no cumplían con nuestras necesidades de soporte para hilos de trabajo y características modernas de JavaScript en entornos de producción Node.js. Esto aplica a cualquier aplicación Node.js que necesite procesamiento en segundo plano, tareas programadas o hilos de trabajo.

**Nuestros ejemplos de implementación:**

* [Configuración del servidor Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Todas nuestras definiciones de trabajos](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Trabajo de verificación de salud PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementación del trabajo de limpieza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Manejo de Errores: @hapi/boom para Confiabilidad en Producción {#error-handling-hapiboom-for-production-reliability}

**Lo que usamos:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Usamos @hapi/boom para respuestas de error estructuradas en todas nuestras aplicaciones de producción Node.js. Este patrón funciona para cualquier aplicación Node.js que necesite manejo consistente de errores.

**Nuestros ejemplos de implementación:**

* [Ayudante para clasificación de errores](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementación del registrador](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Cómo Monitorear Aplicaciones Node.js en Producción {#how-to-monitor-nodejs-applications-in-production}

Nuestro enfoque para monitorear aplicaciones Node.js en producción ha evolucionado a través de años de ejecución de aplicaciones a gran escala. Implementamos monitoreo en múltiples capas para asegurar confiabilidad y rendimiento para cualquier tipo de aplicación Node.js.

### Monitoreo de Producción Node.js a Nivel de Sistema {#system-level-nodejs-production-monitoring}

**Nuestra implementación principal:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Lo que usamos:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nuestros umbrales de monitoreo en producción (de nuestro código real de producción):

* **Límite de tamaño de heap de 2GB** con alertas automáticas
* **Umbral de advertencia del 25% de uso de memoria**
* **Umbral de alerta del 80% de uso de CPU**
* **Umbral de advertencia del 75% de uso de disco**

> \[!WARNING]
> Estos umbrales funcionan para nuestra configuración específica de hardware. Al implementar monitoreo de producción Node.js, revisa nuestra implementación monitor-server.js para entender la lógica exacta y adaptar los valores a tu configuración.

### Monitoreo a Nivel de Aplicación para Producción Node.js {#application-level-monitoring-for-nodejs-production}

**Nuestra clasificación de errores:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este ayudante distingue entre:

* **Errores reales de código** que requieren atención inmediata
* **Errores de usuario** que son comportamiento esperado
* **Fallas de servicios externos** que no podemos controlar

Este patrón se aplica a cualquier aplicación Node.js - aplicaciones web, APIs, microservicios o servicios en segundo plano.
**Nuestra implementación de registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementamos una redacción completa de campos para proteger la información sensible mientras mantenemos capacidades útiles de depuración en nuestro entorno de producción Node.js.

### Monitoreo específico de la aplicación {#application-specific-monitoring}

**Nuestras implementaciones de servidor:**

* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitoreo de colas:** Implementamos límites de cola de 5GB y tiempos de espera de 180 segundos para el procesamiento de solicitudes para evitar el agotamiento de recursos. Estos patrones se aplican a cualquier aplicación Node.js con colas o procesamiento en segundo plano.


## Monitoreo de producción Node.js con chequeos de salud PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Hemos refinado nuestra configuración de entorno de producción Node.js con PM2 a lo largo de años de experiencia en producción. Nuestros chequeos de salud PM2 son esenciales para mantener la confiabilidad en cualquier aplicación Node.js.

### Nuestro sistema de chequeo de salud PM2 {#our-pm2-health-check-system}

**Nuestra implementación principal:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Nuestro monitoreo de producción Node.js con chequeos de salud PM2 incluye:

* **Se ejecuta cada 20 minutos** mediante programación cron
* **Requiere un tiempo mínimo de actividad de 15 minutos** antes de considerar un proceso saludable
* **Valida el estado del proceso y el uso de memoria**
* **Reinicia automáticamente procesos fallidos**
* **Previene bucles de reinicio** mediante chequeos de salud inteligentes

> \[!CAUTION]
> Para las mejores prácticas de despliegue de producción Node.js, requerimos más de 15 minutos de actividad antes de considerar un proceso saludable para evitar bucles de reinicio. Esto previene fallos en cascada cuando los procesos tienen problemas de memoria u otros.

### Nuestra configuración de producción PM2 {#our-pm2-production-configuration}

**Nuestra configuración del ecosistema:** Estudia nuestros archivos de inicio de servidor para la configuración del entorno de producción Node.js:

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Programador Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Estos patrones se aplican ya sea que estés ejecutando aplicaciones Express, servidores Koa, APIs GraphQL o cualquier otra aplicación Node.js.

### Despliegue automatizado PM2 {#automated-pm2-deployment}

**Despliegue PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizamos toda nuestra configuración PM2 mediante Ansible para asegurar despliegues consistentes de producción Node.js en todos nuestros servidores.


## Sistema de manejo y clasificación de errores en producción {#production-error-handling-and-classification-system}

Una de nuestras mejores prácticas más valiosas para despliegue de producción Node.js es la clasificación inteligente de errores que se aplica a cualquier aplicación Node.js:

### Nuestra implementación isCodeBug para producción {#our-iscodebug-implementation-for-production}

**Fuente:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Este helper proporciona clasificación inteligente de errores para aplicaciones Node.js en producción para:

* **Priorizar errores reales** sobre errores de usuario
* **Mejorar nuestra respuesta a incidentes** enfocándonos en problemas reales
* **Reducir la fatiga de alertas** por errores de usuario esperados
* **Entender mejor** problemas generados por la aplicación vs por el usuario

Este patrón funciona para cualquier aplicación Node.js - ya sea que estés construyendo sitios de comercio electrónico, plataformas SaaS, APIs o microservicios.

### Integración con nuestro registro en producción {#integration-with-our-production-logging}

**Nuestra integración de logger:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Nuestro registrador utiliza `isCodeBug` para determinar los niveles de alerta y la redacción de campos, asegurando que nos notifiquemos sobre problemas reales mientras filtramos el ruido en nuestro entorno de producción Node.js.

### Contenido Relacionado {#related-content-1}

Aprende más sobre nuestros patrones de manejo de errores:

* [Construyendo un Sistema de Pago Fiable](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Patrones de manejo de errores
* [Protección de Privacidad de Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Manejo de errores de seguridad


## Depuración Avanzada de Rendimiento con v8-profiler-next y cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Usamos herramientas avanzadas de perfilado para analizar instantáneas de heap y depurar problemas de OOM (Memoria Insuficiente), cuellos de botella de rendimiento y problemas de memoria en Node.js en nuestro entorno de producción. Estas herramientas son esenciales para cualquier aplicación Node.js que experimente fugas de memoria o problemas de rendimiento.

### Nuestro Enfoque de Perfilado para Producción Node.js {#our-profiling-approach-for-nodejs-production}

**Herramientas que recomendamos:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Para generar instantáneas de heap y perfiles de CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Para analizar perfiles de CPU e instantáneas de heap

> \[!TIP]
> Usamos v8-profiler-next y cpupro juntos para crear un flujo de trabajo completo de depuración de rendimiento para nuestras aplicaciones Node.js. Esta combinación nos ayuda a identificar fugas de memoria, cuellos de botella de rendimiento y optimizar nuestro código en producción.

### Cómo Implementamos el Análisis de Instantáneas de Heap {#how-we-implement-heap-snapshot-analysis}

**Nuestra implementación de monitoreo:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Nuestro monitoreo en producción incluye la generación automática de instantáneas de heap cuando se superan los umbrales de memoria. Esto nos ayuda a depurar problemas de OOM antes de que causen fallos en la aplicación.

**Patrones clave de implementación:**

* **Instantáneas automáticas** cuando el tamaño del heap supera el umbral de 2GB
* **Perfilado basado en señales** para análisis bajo demanda en producción
* **Políticas de retención** para gestionar el almacenamiento de instantáneas
* **Integración con nuestros trabajos de limpieza** para mantenimiento automatizado

### Flujo de Trabajo de Depuración de Rendimiento {#performance-debugging-workflow}

**Estudia nuestra implementación actual:**

* [Implementación del servidor de monitoreo](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoreo de heap y generación de instantáneas
* [Trabajo de limpieza](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Retención y limpieza de instantáneas
* [Integración con el registrador](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Registro de rendimiento

### Implementación Recomendada para Tu Aplicación Node.js {#recommended-implementation-for-your-nodejs-application}

**Para análisis de instantáneas de heap:**

1. **Instala v8-profiler-next** para generación de instantáneas
2. **Usa cpupro** para analizar las instantáneas generadas
3. **Implementa umbrales de monitoreo** similares a nuestro monitor-server.js
4. **Configura limpieza automatizada** para gestionar el almacenamiento de instantáneas
5. **Crea manejadores de señales** para perfilado bajo demanda en producción

**Para perfilado de CPU:**

1. **Genera perfiles de CPU** durante períodos de alta carga
2. **Analiza con cpupro** para identificar cuellos de botella
3. **Enfócate en rutas críticas** y oportunidades de optimización
4. **Monitorea antes/después** de mejoras de rendimiento

> \[!WARNING]
> Generar instantáneas de heap y perfiles de CPU puede afectar el rendimiento. Recomendamos implementar limitación y habilitar el perfilado solo cuando se investiguen problemas específicos o durante ventanas de mantenimiento.

### Integración con Nuestro Monitoreo de Producción {#integration-with-our-production-monitoring}

Nuestras herramientas de perfilado se integran con nuestra estrategia de monitoreo más amplia:

* **Activación automática** basada en umbrales de memoria/CPU
* **Integración de alertas** cuando se detectan problemas de rendimiento
* **Análisis histórico** para rastrear tendencias de rendimiento a lo largo del tiempo
* **Correlación con métricas de la aplicación** para una depuración integral
Este enfoque nos ha ayudado a identificar y resolver fugas de memoria, optimizar rutas de código críticas y mantener un rendimiento estable en nuestro entorno de producción Node.js.


## Seguridad de la Infraestructura de Producción Node.js {#nodejs-production-infrastructure-security}

Implementamos una seguridad integral para nuestra infraestructura de producción Node.js mediante automatización con Ansible. Estas prácticas se aplican a cualquier aplicación Node.js:

### Seguridad a Nivel de Sistema para Producción Node.js {#system-level-security-for-nodejs-production}

**Nuestra implementación en Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nuestras medidas clave de seguridad para entornos de producción Node.js:

* **Swap deshabilitado** para evitar que datos sensibles se escriban en disco
* **Core dumps deshabilitados** para evitar volcados de memoria que contengan información sensible
* **Almacenamiento USB bloqueado** para prevenir acceso no autorizado a datos
* **Ajuste de parámetros del kernel** tanto para seguridad como para rendimiento

> \[!WARNING]
> Al implementar las mejores prácticas para despliegue en producción Node.js, deshabilitar el swap puede causar terminaciones por falta de memoria si su aplicación excede la RAM disponible. Monitoreamos cuidadosamente el uso de memoria y dimensionamos nuestros servidores adecuadamente.

### Seguridad de Aplicaciones para Aplicaciones Node.js {#application-security-for-nodejs-applications}

**Nuestra redacción de campos en logs:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Redactamos campos sensibles de los registros incluyendo contraseñas, tokens, claves API e información personal. Esto protege la privacidad del usuario mientras mantiene capacidades de depuración en cualquier entorno de producción Node.js.

### Automatización de Seguridad de Infraestructura {#infrastructure-security-automation}

**Nuestra configuración completa de Ansible para producción Node.js:**

* [Playbook de seguridad](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gestión de claves SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestión de certificados](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configuración DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nuestro Contenido de Seguridad {#our-security-content}

Aprende más sobre nuestro enfoque de seguridad:

* [Mejores Empresas de Auditoría de Seguridad](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Correo Encriptado Cuántico Seguro](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Por qué Seguridad de Correo Abierto](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Arquitectura de Base de Datos para Aplicaciones Node.js {#database-architecture-for-nodejs-applications}

Usamos un enfoque híbrido de base de datos optimizado para nuestras aplicaciones Node.js. Estos patrones pueden adaptarse a cualquier aplicación Node.js:

### Implementación SQLite para Producción Node.js {#sqlite-implementation-for-nodejs-production}

**Lo que usamos:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nuestra configuración:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Usamos SQLite para datos específicos de usuario en nuestras aplicaciones Node.js porque proporciona:

* **Aislamiento de datos** por usuario/inquilino
* **Mejor rendimiento** para consultas de un solo usuario
* **Respaldo y migración simplificados**
* **Menor complejidad** comparado con bases de datos compartidas

Este patrón funciona bien para aplicaciones SaaS, sistemas multi-inquilino o cualquier aplicación Node.js que necesite aislamiento de datos.

### Implementación MongoDB para Producción Node.js {#mongodb-implementation-for-nodejs-production}

**Lo que usamos:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Nuestra implementación de configuración:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Nuestra configuración:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Usamos MongoDB para los datos de la aplicación en nuestro entorno de producción Node.js porque proporciona:

* **Esquema flexible** para estructuras de datos en evolución
* **Mejor rendimiento** para consultas complejas
* **Capacidades de escalado horizontal**
* **Lenguaje de consulta rico**

> \[!NOTE]
> Nuestro enfoque híbrido se optimiza para nuestro caso de uso específico. Estudia nuestros patrones reales de uso de base de datos en el código para entender si este enfoque se ajusta a las necesidades de tu aplicación Node.js.


## Procesamiento de trabajos en segundo plano en producción Node.js {#nodejs-production-background-job-processing}

Construimos nuestra arquitectura de trabajos en segundo plano alrededor de Bree para un despliegue confiable en producción Node.js. Esto aplica a cualquier aplicación Node.js que necesite procesamiento en segundo plano:

### Nuestra configuración del servidor Bree para producción {#our-bree-server-setup-for-production}

**Nuestra implementación principal:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Nuestro despliegue Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Ejemplos de trabajos en producción {#production-job-examples}

**Monitoreo de salud:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatización de limpieza:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Todos nuestros trabajos:** [Explora nuestro directorio completo de trabajos](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Estos patrones aplican a cualquier aplicación Node.js que necesite:

* Tareas programadas (procesamiento de datos, reportes, limpieza)
* Procesamiento en segundo plano (redimensionado de imágenes, envío de correos, importación de datos)
* Monitoreo de salud y mantenimiento
* Utilización de hilos de trabajo para tareas intensivas en CPU

### Nuestros patrones de programación de trabajos para producción Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Estudia nuestros patrones reales de programación de trabajos en nuestro directorio de trabajos para entender:

* Cómo implementamos programación tipo cron en producción Node.js
* Nuestra lógica de manejo de errores y reintentos
* Cómo usamos hilos de trabajo para tareas intensivas en CPU


## Mantenimiento automatizado para aplicaciones Node.js en producción {#automated-maintenance-for-production-nodejs-applications}

Implementamos mantenimiento proactivo para prevenir problemas comunes en producción Node.js. Estos patrones aplican a cualquier aplicación Node.js:

### Nuestra implementación de limpieza {#our-cleanup-implementation}

**Fuente:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Nuestro mantenimiento automatizado para aplicaciones Node.js en producción apunta a:

* **Archivos temporales** con más de 24 horas
* **Archivos de registro** que exceden los límites de retención
* **Archivos de caché** y datos temporales
* **Archivos subidos** que ya no se necesitan
* **Instantáneas de heap** de depuración de rendimiento

Estos patrones aplican a cualquier aplicación Node.js que genere archivos temporales, registros o datos en caché.

### Gestión del espacio en disco para producción Node.js {#disk-space-management-for-nodejs-production}

**Nuestros umbrales de monitoreo:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Límites de cola** para procesamiento en segundo plano
* **Advertencia al 75% de uso de disco**
* **Limpieza automática** cuando se exceden los umbrales

### Automatización del mantenimiento de infraestructura {#infrastructure-maintenance-automation}

**Nuestra automatización Ansible para producción Node.js:**

* [Despliegue de entorno](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gestión de claves de despliegue](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Guía de implementación para despliegue en producción Node.js {#nodejs-production-deployment-implementation-guide}
### Estudia Nuestro Código Real para las Mejores Prácticas de Producción {#study-our-actual-code-for-production-best-practices}

**Comienza con estos archivos clave para la configuración del entorno de producción de Node.js:**

1. **Configuración:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoreo:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Manejo de errores:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Salud del proceso:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Aprende de Nuestros Artículos de Blog {#learn-from-our-blog-posts}

**Nuestras guías técnicas de implementación para producción en Node.js:**

* [Ecosistema de paquetes NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Construcción de sistemas de pago](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementación de privacidad en correo electrónico](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularios de contacto en JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integración de correo electrónico con React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatización de Infraestructura para Producción en Node.js {#infrastructure-automation-for-nodejs-production}

**Nuestros playbooks de Ansible para estudiar el despliegue de producción en Node.js:**

* [Directorio completo de playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Endurecimiento de seguridad](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuración de Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nuestros Estudios de Caso {#our-case-studies}

**Nuestras implementaciones empresariales:**

* [Estudio de caso Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Estudio de caso Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Reenvío de correo para exalumnos](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Conclusión: Mejores Prácticas para el Despliegue de Producción en Node.js {#conclusion-nodejs-production-deployment-best-practices}

Nuestra infraestructura de producción en Node.js demuestra que las aplicaciones Node.js pueden alcanzar una fiabilidad de nivel empresarial mediante:

* **Elecciones de hardware comprobadas** (AMD Ryzen para optimización del rendimiento de núcleo único en un 573%)
* **Monitoreo de producción en Node.js probado en batalla** con umbrales específicos y respuestas automatizadas
* **Clasificación inteligente de errores** para mejorar la respuesta a incidentes en entornos de producción
* **Depuración avanzada de rendimiento** con v8-profiler-next y cpupro para prevención de OOM
* **Endurecimiento de seguridad integral** mediante automatización con Ansible
* **Arquitectura híbrida de bases de datos** optimizada para las necesidades de la aplicación
* **Mantenimiento automatizado** para prevenir problemas comunes en producción con Node.js

**Conclusión clave:** Estudia nuestros archivos de implementación reales y artículos de blog en lugar de seguir prácticas genéricas. Nuestra base de código proporciona patrones del mundo real para el despliegue de producción en Node.js que pueden adaptarse a cualquier aplicación Node.js - aplicaciones web, APIs, microservicios o servicios en segundo plano.


## Lista Completa de Recursos para Producción en Node.js {#complete-resource-list-for-nodejs-production}

### Nuestros Archivos de Implementación Principales {#our-core-implementation-files}

* [Configuración principal](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dependencias de paquetes](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitoreo del servidor](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Clasificación de errores](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistema de registro](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Verificaciones de salud PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Limpieza automatizada](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Nuestras Implementaciones de Servidor {#our-server-implementations}

* [Servidor web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Servidor API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Programador Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Servidor SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Servidor IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Servidor POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Nuestra Automatización de Infraestructura {#our-infrastructure-automation}

* [Todos nuestros playbooks de Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Endurecimiento de seguridad](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuración de Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configuración de base de datos](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nuestros Artículos Técnicos del Blog {#our-technical-blog-posts}

* [Análisis del Ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementación del Sistema de Pagos](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guía Técnica de Privacidad de Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularios de Contacto en JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integración de Email con React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guía de Solución Autoalojada](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nuestros Estudios de Caso Empresariales {#our-enterprise-case-studies}

* [Implementación en Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Estudio de Caso Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Cumplimiento del Gobierno Federal](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistemas de Email para Alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
