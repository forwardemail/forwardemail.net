# Política de Privacidad {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Política de privacidad de Forward Email" class="rounded-lg" /> -->


## Tabla de Contenidos {#table-of-contents}

* [Descargo de responsabilidad](#disclaimer)
* [Información No Recopilada](#information-not-collected)
* [Información Recopilada](#information-collected)
  * [Información de la Cuenta](#account-information)
  * [Almacenamiento de Correos Electrónicos](#email-storage)
  * [Registros de Errores](#error-logs)
  * [Registros del Servidor](#server-logs)
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
* [Aplicaciones y Webmail](#apps-and-webmail)
  * [Datos en su Dispositivo](#data-on-your-device)
  * [Datos que nos Envían las Aplicaciones](#data-the-apps-send-us)
  * [Notificaciones Push](#push-notifications)
  * [Imágenes y Enlaces en los Correos](#images-and-links-in-emails)
  * [Otras Conexiones](#other-connections)
* [Información Compartida](#information-shared)
* [Eliminación de Información](#information-removal)
* [Divulgaciones Adicionales](#additional-disclosures)


## Descargo de responsabilidad {#disclaimer}

Por favor, consulte nuestros [Términos](/terms) ya que se aplican en todo el sitio.


## Información No Recopilada {#information-not-collected}

**Con la excepción de la información descrita expresamente en esta política (incluyendo [registros de errores](#error-logs), [registros del servidor](#server-logs), [correos electrónicos SMTP salientes](#outbound-smtp-emails), [información de la cuenta](#account-information), [procesamiento temporal de datos](#temporary-data-processing), [registros de auditoría](#audit-logs), [cookies y sesiones](#cookies-and-sessions), [analíticas](#analytics) y [aplicaciones y webmail](#apps-and-webmail)):**

* No almacenamos ningún correo electrónico reenviado en almacenamiento en disco ni en bases de datos.
* No almacenamos ningún metadato sobre correos electrónicos reenviados en almacenamiento en disco ni en bases de datos.
* Excepto como se describe expresamente en esta política, no almacenamos registros ni direcciones IP en almacenamiento en disco ni en bases de datos.
* No utilizamos ningún servicio de análisis o telemetría de terceros.


## Información Recopilada {#information-collected}

Para mayor transparencia, en cualquier momento puedes <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">ver nuestro código fuente</a> para ver cómo se recopila y usa la información a continuación.

**Estríctamente para funcionalidad y para mejorar nuestro servicio, recopilamos y almacenamos de forma segura la siguiente información:**

### Información de la Cuenta {#account-information}

* Almacenamos la dirección de correo electrónico que nos proporciona.
* Almacenamos los nombres de dominio, alias y configuraciones que nos proporciona.
* Almacenamos metadatos limitados de seguridad de la cuenta necesarios para proteger su cuenta y administrar el acceso, incluyendo identificadores de sesión de sitios web activos, contadores de intentos de inicio de sesión fallidos y la marca de tiempo del último intento de inicio de sesión.
* Cualquier información adicional que nos proporcione voluntariamente, como comentarios o preguntas que nos envíe por correo electrónico o en nuestra página de <a href="/help">ayuda</a>.


**Atribución de registro** (almacenada permanentemente en tu cuenta):

Cuando creas una cuenta, almacenamos la siguiente información para entender cómo los usuarios encuentran nuestro servicio:

* El dominio del sitio web de referencia (no la URL completa)
* La primera página que visitaste en nuestro sitio, con los valores que contiene su ruta, como nombres de dominio, ID y tokens, reemplazados por marcadores de posición
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
* También almacenamos registros de errores de las solicitudes al sitio web y a la API que fallan o tardan demasiado, y de los errores en nuestros servidores IMAP, POP3, CalDAV y CardDAV, durante 7 días.
* Estos registros pueden contener la dirección IP, la URL de la solicitud (incluidas las cadenas de consulta, como los términos de búsqueda), los encabezados de la solicitud, como el agente de usuario, y la cuenta o el alias implicados.
* Las contraseñas, los tokens de API, las cookies y los cuerpos de las solicitudes se eliminan de estos registros antes de almacenarlos.

### Registros del Servidor {#server-logs}

* Nuestros servidores escriben una línea de registro por cada solicitud al sitio web y a la API, que puede incluir la dirección IP, el método y la URL de la solicitud (incluidas las cadenas de consulta), los encabezados de la solicitud, el estado de la respuesta y la cuenta con la que se ha iniciado sesión.
* Usamos estos registros para encontrar y corregir problemas y para detener abusos, y los conservamos hasta 30 días.

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

* Los intentos de autenticación fallidos se rastrean por dirección IP en Redis.
* También almacenamos metadatos de autenticación limitados a nivel de cuenta, incluyendo contadores de intentos de inicio de sesión fallidos y la marca de tiempo del último intento de inicio de sesión.
* Los datos de intentos de autenticación basados en Redis caducan automáticamente (normalmente en 24 horas).
* Se utiliza para prevenir ataques de fuerza bruta en las cuentas de los usuarios.


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

* Almacenamos cookies firmadas solo para HTTP y datos de sesión del lado del servidor para el tráfico de su sitio web.
* Las cookies utilizan la protección SameSite.
* Almacenamos identificadores de sesión de sitios web activos en su cuenta para admitir funciones como "cerrar sesión en otros dispositivos" y la invalidación de sesiones relacionada con la seguridad.
* Las cookies de sesión caducan después de 30 días de inactividad.
* No creamos sesiones para bots o rastreadores.
* Utilizamos cookies y sesiones para:
  * Autenticación y estado de inicio de sesión
  * Funcionalidad de "recordarme" de la autenticación de dos factores
  * Mensajes flash y notificaciones
  * [Analíticas](#analytics): la primera página de su visita, el dominio de referencia, los parámetros de campaña (UTM) y un recuento de páginas


## Analytics {#analytics}

Usamos nuestro propio sistema de análisis enfocado en la privacidad para entender cómo se utilizan nuestros servicios. Este sistema está diseñado con la privacidad como principio fundamental:

**Lo que NO recopilamos:**

* No almacenamos direcciones IP
* No establecemos una cookie aparte para análisis
* No utilizamos servicios de análisis de terceros
* No rastreamos a los visitantes a través de días o sesiones cuando no han iniciado sesión

**Lo que SÍ recopilamos:**

* Vistas de página agregadas y uso del servicio (SMTP, IMAP, POP3, API, etc.)
* Tipo y versión de navegador y sistema operativo (analizados a partir del agente de usuario, datos en bruto descartados)
* Tipo de dispositivo (escritorio, móvil, tableta)
* Dominio de referencia (no URL completa) y parámetros de campaña (UTM)
* Tipo de cliente de correo para protocolos de correo (p. ej., Thunderbird, Outlook)
* La página o la ruta de la API solicitada, con los valores que contiene, como nombres de dominio, ID y tokens, reemplazados por marcadores de posición, y si la solicitud tuvo éxito
* En las visitas al sitio web, la primera página de la visita y un recuento de páginas, guardados en su sesión (consulte [Cookies y Sesiones](#cookies-and-sessions))
* Cuando ha iniciado sesión, el ID de su cuenta, alias o dominio, para que podamos ver cómo se usa cada servicio y solucionar problemas

**Retención de datos:**

* Los eventos de análisis se eliminan automáticamente después de 30 días
* Los totales por hora, que no están vinculados a ninguna cuenta, se conservan durante 90 días
* Los identificadores de sesión rotan diariamente y no pueden usarse para rastrear visitantes a través de días


## Aplicaciones y Webmail {#apps-and-webmail}

Esta sección abarca nuestras aplicaciones de correo electrónico para iOS, Android, macOS, Windows y Linux, y nuestro webmail en <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, que comparten el mismo código. Las aplicaciones no contienen código de publicidad ni de rastreo, ni analítica de terceros.

### Datos en su Dispositivo {#data-on-your-device}

* Las aplicaciones almacenan sus correos, contactos, calendarios, configuración y datos de inicio de sesión en su dispositivo, para que carguen rápido y funcionen sin conexión.
* Si activa App Lock, la aplicación cifra el contenido de los correos, los contactos y los datos de inicio de sesión almacenados con una clave protegida por su PIN o su clave de acceso. Las fechas, las carpetas, las etiquetas y los indicadores permanecen sin cifrar para que la aplicación pueda ordenar y contar sus correos.
* Al cerrar sesión en una cuenta, se eliminan de su dispositivo los datos de esa cuenta.

### Datos que nos Envían las Aplicaciones {#data-the-apps-send-us}

* La dirección de correo electrónico y la contraseña de su alias, con cada solicitud, para iniciar su sesión.
* Los correos, contactos, calendarios, etiquetas y filtros que envía, crea o modifica. Almacenamos los correos, los contactos y los calendarios como se describe en [Almacenamiento de Correos Electrónicos](#email-storage), y los correos que envía como se describe en [Correos SMTP Salientes](#outbound-smtp-emails).
* Sus términos de búsqueda, para que podamos buscar en su buzón en nuestros servidores. Los términos de búsqueda forman parte de la URL de la solicitud, por lo que pueden aparecer en los [registros de errores](#error-logs) y en los [registros del servidor](#server-logs).
* Los comentarios que decida enviar desde la aplicación, que se envían por correo electrónico desde su alias a nuestro equipo de soporte junto con los detalles de diagnóstico que decida incluir.
* Los correos que reporte como spam, que la aplicación reenvía a nuestro equipo de control de abuso (o a otra dirección que configure en Settings).

### Notificaciones Push {#push-notifications}

* Cuando permite las notificaciones, la aplicación registra un token push con nosotros. Lo almacenamos junto con la plataforma, el alias y la cuenta a los que corresponde, el momento de su última entrega y un nombre de dispositivo tomado del agente de usuario de la aplicación, que incluye la versión de su sistema operativo y, en Android, el modelo de su dispositivo.
* Conservamos un token push hasta un año después de su último uso. Lo eliminamos antes cuando cierra sesión en la aplicación, cuando la entrega falla tres veces seguidas, cuando la contraseña del alias cambia, cuando elimina el alias o su cuenta, o cuando el alias pasa a otro propietario.
* En iOS y macOS, las notificaciones pasan por Apple Push Notification service. En nuestra aplicación de Android de Google Play, pasan por Firebase Cloud Messaging. Las notificaciones de correo nuevo incluyen el nombre y la dirección del remitente, el asunto, una breve vista previa y el nombre de la carpeta, también para el correo que llega sin alerta, como el que se guarda en las carpetas Correo no deseado o Enviados. Cuando cambian los correos, los calendarios o los contactos, también enviamos notificaciones silenciosas con identificadores pero sin contenido de correo, para que la aplicación se mantenga actualizada.
* Con [UnifiedPush](https://unifiedpush.org/) en Android, y con las notificaciones en un navegador web, cada notificación se cifra para que solo su dispositivo pueda leerla.
* Nuestra aplicación de Android de Google Play incluye Firebase Cloud Messaging, que envía a Google un ID de instalación de Firebase, la versión de la aplicación y detalles del dispositivo y del SDK. Nuestra aplicación de Android de GitHub, sin servicios de Google, no incluye Firebase.

### Imágenes y Enlaces en los Correos {#images-and-links-in-emails}

* Las imágenes de los correos se cargan desde los servidores del remitente, que pueden ver su dirección IP y cuándo se cargaron las imágenes.
* Las aplicaciones bloquean los píxeles de rastreo de forma predeterminada. También puede bloquear todas las imágenes externas en Settings > Privacy & Security y luego cargarlas correo por correo.
* Los enlaces de los correos se abren en su navegador web.

### Otras Conexiones {#other-connections}

* Nuestro webmail consulta a GitHub cuál es su última versión al cargarse, cuando vuelve a él y cada 10 minutos mientras está abierto. About & Help consulta a GitHub cuál es la última versión de escritorio, y las aplicaciones de escritorio buscan actualizaciones en GitHub. GitHub recibe su dirección IP con estas solicitudes.


## Información Compartida {#information-shared}

No compartimos su información con terceros, excepto con proveedores de servicios que operan partes de nuestro servicio, como Cloudflare (protección del sitio web y copias de seguridad cifradas), Stripe y PayPal (pagos), y con los servicios que entregan las notificaciones push a sus dispositivos (consulte [Notificaciones Push](#push-notifications)).

Podemos necesitar cumplir con solicitudes legales ordenadas por un tribunal (pero tenga en cuenta que [no recopilamos la información mencionada arriba bajo "Información No Recopilada"](#information-not-collected), por lo que no podremos proporcionarla desde un principio).


## Eliminación de Información {#information-removal}

Si en algún momento desea eliminar la información que nos ha proporcionado, vaya a <a href="/my-account/security">Mi Cuenta > Seguridad</a> y haga clic en "Eliminar Cuenta".

Debido a la prevención y mitigación de abusos, su cuenta puede requerir una revisión manual de eliminación por parte de nuestros administradores si la elimina dentro de los 5 días posteriores a su primer pago.

Este proceso generalmente toma menos de 24 horas y se implementó debido a que usuarios estaban haciendo spam con nuestro servicio y luego eliminaban rápidamente sus cuentas, lo que nos impedía bloquear la(s) huella(s) de su método de pago en Stripe.

Al eliminar su cuenta, también se eliminan los dominios que administra, sus alias y los tokens push registrados para ellos. El registro de la cuenta en sí permanece, con su dirección de correo electrónico, sus datos de facturación, su contraseña y sus claves de acceso eliminados y su autenticación de dos factores y su token de API revocados, y conservamos sus registros de pago para reembolsos y contabilidad. Los registros y los datos de análisis que hacen referencia a su cuenta se eliminan según los plazos indicados anteriormente.

Para eliminar los datos de las aplicaciones de un dispositivo, cierre sesión en la aplicación o desinstálela.


## Divulgaciones Adicionales {#additional-disclosures}

Este sitio está protegido por Cloudflare y su [Política de Privacidad](https://www.cloudflare.com/privacypolicy/) y [Términos de Servicio](https://www.cloudflare.com/website-terms/) aplican.
