# Política de Privacidad {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Política de privacidad de Forward Email" class="rounded-lg" />


## Tabla de Contenidos {#table-of-contents}

* [Descargo de responsabilidad](#disclaimer)
* [Información No Recopilada](#information-not-collected)
* [Información Recopilada](#information-collected)
  * [Información de la Cuenta](#account-information)
  * [Almacenamiento de Correos Electrónicos](#email-storage)
  * [Registros de Errores](#error-logs)
  * [Correos SMTP Salientes](#outbound-smtp-emails)
* [Procesamiento Temporal de Datos](#temporary-data-processing)
  * [Limitación de Tasa](#rate-limiting)
  * [Seguimiento de Conexiones](#connection-tracking)
  * [Intentos de Autenticación](#authentication-attempts)
* [Registros de Auditoría](#audit-logs)
  * [Cambios en la Cuenta](#account-changes)
  * [Cambios en la Configuración del Dominio](#domain-settings-changes)
* [Cookies y Sesiones](#cookies-and-sessions)
* [Analíticas](#analytics)
* [Información Compartida](#information-shared)
* [Eliminación de Información](#information-removal)
* [Divulgaciones Adicionales](#additional-disclosures)


## Descargo de responsabilidad {#disclaimer}

Por favor, consulte nuestros [Términos](/terms) ya que se aplican en todo el sitio.


## Información No Recopilada {#information-not-collected}

**Con la excepción de los [registros de errores](#error-logs), [correos SMTP salientes](#outbound-smtp-emails), y/o cuando se detecta actividad de spam o maliciosa (por ejemplo, para limitación de tasa):**

* No almacenamos ningún correo reenviado en almacenamiento en disco ni en bases de datos.
* No almacenamos ningún metadato sobre correos reenviados en almacenamiento en disco ni en bases de datos.
* No almacenamos ningún registro ni direcciones IP en almacenamiento en disco ni en bases de datos.
* No usamos ningún servicio de análisis o telemetría de terceros.


## Información Recopilada {#information-collected}

Para mayor transparencia, en cualquier momento puedes <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">ver nuestro código fuente</a> para ver cómo se recopila y usa la información a continuación.

**Estríctamente para funcionalidad y para mejorar nuestro servicio, recopilamos y almacenamos de forma segura la siguiente información:**

### Información de la Cuenta {#account-information}

* Almacenamos la dirección de correo electrónico que nos proporcionas.
* Almacenamos tus nombres de dominio, alias y configuraciones que nos proporcionas.
* Cualquier información adicional que nos proporciones voluntariamente, como comentarios o preguntas enviadas por correo electrónico o en nuestra página de <a href="/help">ayuda</a>.

**Atribución de registro** (almacenada permanentemente en tu cuenta):

Cuando creas una cuenta, almacenamos la siguiente información para entender cómo los usuarios encuentran nuestro servicio:

* El dominio del sitio web de referencia (no la URL completa)
* La primera página que visitaste en nuestro sitio
* Parámetros de campaña UTM si están presentes en la URL

### Almacenamiento de Correos Electrónicos {#email-storage}

* Almacenamos correos electrónicos e información de calendario en tu [base de datos SQLite cifrada](/blog/docs/best-quantum-safe-encrypted-email-service) estrictamente para tu acceso IMAP/POP3/CalDAV/CardDAV y funcionalidad del buzón.
  * Ten en cuenta que si solo usas nuestros servicios de reenvío de correo, entonces no se almacenan correos en disco ni en base de datos como se describe en [Información No Recopilada](#information-not-collected).
  * Nuestros servicios de reenvío de correo operan solo en memoria (sin escritura en almacenamiento en disco ni bases de datos).
  * El almacenamiento IMAP/POP3/CalDAV/CardDAV está cifrado en reposo, cifrado en tránsito y almacenado en un disco cifrado con LUKS.
  * Las copias de seguridad de tu almacenamiento IMAP/POP3/CalDAV/CardDAV están cifradas en reposo, cifradas en tránsito y almacenadas en [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Registros de Errores {#error-logs}

* Almacenamos códigos de respuesta SMTP `4xx` y `5xx` en [registros de errores](/faq#do-you-store-error-logs) durante 7 días.
* Los registros de errores contienen el error SMTP, el sobre y los encabezados del correo electrónico (no almacenamos el cuerpo del correo ni los archivos adjuntos).
* Los registros de errores pueden contener direcciones IP y nombres de host de los servidores emisores para fines de depuración.
* Los registros de errores para [limitación de tasa](/faq#do-you-have-rate-limiting) y [lista gris](/faq#do-you-have-a-greylist) no son accesibles ya que la conexión termina temprano (por ejemplo, antes de que se puedan transmitir los comandos `RCPT TO` y `MAIL FROM`).
### Correos SMTP Salientes {#outbound-smtp-emails}

* Almacenamos [correos SMTP salientes](/faq#do-you-support-sending-email-with-smtp) por aproximadamente 30 días.
  * Esta duración varía según el encabezado "Date"; ya que permitimos que los correos se envíen en el futuro si existe un encabezado "Date" futuro.
  * **Tenga en cuenta que una vez que un correo se entrega con éxito o presenta un error permanente, redactaremos y eliminaremos el cuerpo del mensaje.**
  * Si desea configurar que el cuerpo del mensaje de correo SMTP saliente se conserve por más tiempo que el valor predeterminado de 0 días (después de la entrega exitosa o error permanente), vaya a Configuración Avanzada para su dominio e ingrese un valor entre `0` y `30`.
  * Algunos usuarios disfrutan usar la función de vista previa en [Mi Cuenta > Correos](/my-account/emails) para ver cómo se renderizan sus correos, por lo tanto, soportamos un período de retención configurable.
  * Tenga en cuenta que también soportamos [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Procesamiento Temporal de Datos {#temporary-data-processing}

Los siguientes datos se procesan temporalmente en memoria o Redis y **no** se almacenan de forma permanente:

### Limitación de Tasa {#rate-limiting}

* Las direcciones IP se usan temporalmente en Redis para propósitos de limitación de tasa.
* Los datos de limitación de tasa expiran automáticamente (típicamente dentro de 24 horas).
* Esto previene abusos y asegura un uso justo de nuestros servicios.

### Seguimiento de Conexiones {#connection-tracking}

* Se rastrea el conteo de conexiones concurrentes por dirección IP en Redis.
* Estos datos expiran automáticamente cuando las conexiones se cierran o después de un tiempo corto.
* Se usa para prevenir abusos de conexión y asegurar la disponibilidad del servicio.

### Intentos de Autenticación {#authentication-attempts}

* Se rastrean los intentos fallidos de autenticación por dirección IP en Redis.
* Estos datos expiran automáticamente (típicamente dentro de 24 horas).
* Se usa para prevenir ataques de fuerza bruta en cuentas de usuario.


## Registros de Auditoría {#audit-logs}

Para ayudarle a monitorear y asegurar su cuenta y dominios, mantenemos registros de auditoría para ciertos cambios. Estos registros se usan para enviar correos de notificación a los titulares de cuenta y administradores de dominio.

### Cambios en la Cuenta {#account-changes}

* Rastreemos cambios en configuraciones importantes de la cuenta (por ejemplo, autenticación de dos factores, nombre para mostrar, zona horaria).
* Cuando se detectan cambios, enviamos una notificación por correo a su dirección registrada.
* Campos sensibles (por ejemplo, contraseña, tokens API, claves de recuperación) se rastrean pero sus valores se redactan en las notificaciones.
* Las entradas del registro de auditoría se eliminan después de enviar el correo de notificación.

### Cambios en la Configuración del Dominio {#domain-settings-changes}

Para dominios con múltiples administradores, proporcionamos un registro detallado de auditoría para ayudar a los equipos a rastrear cambios de configuración:

**Qué rastreamos:**

* Cambios en la configuración del dominio (por ejemplo, webhooks de rebote, filtrado de spam, configuración DKIM)
* Quién hizo el cambio (correo electrónico del usuario)
* Cuándo se hizo el cambio (marca de tiempo)
* La dirección IP desde la cual se hizo el cambio
* La cadena user-agent del navegador/cliente

**Cómo funciona:**

* Todos los administradores del dominio reciben una única notificación consolidada por correo cuando cambian las configuraciones.
* La notificación incluye una tabla mostrando cada cambio con el usuario que lo hizo, su dirección IP y la marca de tiempo.
* Campos sensibles (por ejemplo, claves de webhook, tokens API, claves privadas DKIM) se rastrean pero sus valores se redactan.
* La información del user-agent se incluye en una sección desplegable de "Detalles Técnicos".
* Las entradas del registro de auditoría se eliminan después de enviar el correo de notificación.

**Por qué recopilamos esto:**

* Para ayudar a los administradores de dominio a mantener supervisión de seguridad
* Para permitir que los equipos auditen quién hizo cambios de configuración
* Para asistir en la resolución de problemas si ocurren cambios inesperados
* Para proporcionar responsabilidad en la gestión compartida del dominio


## Cookies y Sesiones {#cookies-and-sessions}

* Almacenamos una cookie en una sesión para el tráfico de su sitio web.
* Las cookies son HTTP-only, firmadas y usan protección SameSite.
* Las cookies de sesión expiran después de 30 días de inactividad.
* No creamos sesiones para bots o rastreadores.
* Usamos cookies para:
  * Autenticación y estado de inicio de sesión
  * Funcionalidad de "recordarme" en autenticación de dos factores
  * Mensajes flash y notificaciones
## Analytics {#analytics}

Usamos nuestro propio sistema de análisis enfocado en la privacidad para entender cómo se utilizan nuestros servicios. Este sistema está diseñado con la privacidad como principio fundamental:

**Lo que NO recopilamos:**

* No almacenamos direcciones IP
* No usamos cookies ni identificadores persistentes para análisis
* No utilizamos servicios de análisis de terceros
* No rastreamos a los usuarios a través de días o sesiones

**Lo que SÍ recopilamos (anonimizado):**

* Vistas de página agregadas y uso del servicio (SMTP, IMAP, POP3, API, etc.)
* Tipo de navegador y sistema operativo (analizado a partir del agente de usuario, datos en bruto descartados)
* Tipo de dispositivo (escritorio, móvil, tableta)
* Dominio de referencia (no URL completa)
* Tipo de cliente de correo para protocolos de correo (p. ej., Thunderbird, Outlook)

**Retención de datos:**

* Los datos de análisis se eliminan automáticamente después de 30 días
* Los identificadores de sesión rotan diariamente y no pueden usarse para rastrear usuarios a través de días


## Información Compartida {#information-shared}

No compartimos su información con terceros.

Podemos necesitar cumplir con solicitudes legales ordenadas por un tribunal (pero tenga en cuenta que [no recopilamos la información mencionada arriba bajo "Información No Recopilada"](#information-not-collected), por lo que no podremos proporcionarla desde un principio).


## Eliminación de Información {#information-removal}

Si en algún momento desea eliminar la información que nos ha proporcionado, vaya a <a href="/my-account/security">Mi Cuenta > Seguridad</a> y haga clic en "Eliminar Cuenta".

Debido a la prevención y mitigación de abusos, su cuenta puede requerir una revisión manual de eliminación por parte de nuestros administradores si la elimina dentro de los 5 días posteriores a su primer pago.

Este proceso generalmente toma menos de 24 horas y se implementó debido a que usuarios estaban haciendo spam con nuestro servicio y luego eliminaban rápidamente sus cuentas, lo que nos impedía bloquear la(s) huella(s) de su método de pago en Stripe.


## Divulgaciones Adicionales {#additional-disclosures}

Este sitio está protegido por Cloudflare y su [Política de Privacidad](https://www.cloudflare.com/privacypolicy/) y [Términos de Servicio](https://www.cloudflare.com/website-terms/) aplican.
