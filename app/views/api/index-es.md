# API de correo electrónico {#email-api}

## Tabla de contenido {#table-of-contents}

* [Bibliotecas](#libraries)
* [URI base](#base-uri)
* [Autenticación](#authentication)
* [Errores](#errors)
* [Localización](#localization)
* [Paginación](#pagination)
* [Registros](#logs)
  * [Recuperar registros](#retrieve-logs)
* [Cuenta](#account)
  * [Crear una cuenta](#create-account)
  * [Recuperar cuenta](#retrieve-account)
  * [Actualizar cuenta](#update-account)
* [Contactos de alias (CardDAV)](#alias-contacts-carddav)
  * [Lista de contactos](#list-contacts)
  * [Crear contacto](#create-contact)
  * [Recuperar contacto](#retrieve-contact)
  * [Actualizar contacto](#update-contact)
  * [Eliminar contacto](#delete-contact)
* [Calendarios de alias (CalDAV)](#alias-calendars-caldav)
  * [Lista de calendarios](#list-calendars)
  * [Crear calendario](#create-calendar)
  * [Recuperar calendario](#retrieve-calendar)
  * [Actualizar calendario](#update-calendar)
  * [Eliminar calendario](#delete-calendar)
* [Mensajes de alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Listado y búsqueda de mensajes](#list-and-search-for-messages)
  * [Crear mensaje](#create-message)
  * [Recuperar mensaje](#retrieve-message)
  * [Mensaje de actualización](#update-message)
  * [Eliminar mensaje](#delete-message)
* [Carpetas de alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Lista de carpetas](#list-folders)
  * [Crear carpeta](#create-folder)
  * [Recuperar carpeta](#retrieve-folder)
  * [Actualizar carpeta](#update-folder)
  * [Eliminar carpeta](#delete-folder)
  * [Copiar carpeta](#copy-folder)
* [Correos electrónicos salientes](#outbound-emails)
  * [Obtener el límite de correo electrónico SMTP saliente](#get-outbound-smtp-email-limit)
  * [Lista de correos electrónicos SMTP salientes](#list-outbound-smtp-emails)
  * [Crear correo electrónico SMTP saliente](#create-outbound-smtp-email)
  * [Recuperar correo electrónico SMTP saliente](#retrieve-outbound-smtp-email)
  * [Eliminar correo electrónico SMTP saliente](#delete-outbound-smtp-email)
* [Dominios](#domains)
  * [Lista de dominios](#list-domains)
  * [Crear dominio](#create-domain)
  * [Recuperar dominio](#retrieve-domain)
  * [Verificar registros de dominio](#verify-domain-records)
  * [Verificar los registros SMTP del dominio](#verify-domain-smtp-records)
  * [Lista de contraseñas generales para todo el dominio](#list-domain-wide-catch-all-passwords)
  * [Crear una contraseña general para todo el dominio](#create-domain-wide-catch-all-password)
  * [Eliminar la contraseña general de todo el dominio](#remove-domain-wide-catch-all-password)
  * [Actualizar dominio](#update-domain)
  * [Eliminar dominio](#delete-domain)
* [Invitaciones](#invites)
  * [Aceptar invitación de dominio](#accept-domain-invite)
  * [Crear invitación de dominio](#create-domain-invite)
  * [Eliminar invitación de dominio](#remove-domain-invite)
* [Miembros](#members)
  * [Actualizar miembro del dominio](#update-domain-member)
  * [Eliminar miembro del dominio](#remove-domain-member)
* [Alias](#aliases)
  * [Generar una contraseña de alias](#generate-an-alias-password)
  * [Lista de alias de dominio](#list-domain-aliases)
  * [Crear un nuevo alias de dominio](#create-new-domain-alias)
  * [Recuperar alias de dominio](#retrieve-domain-alias)
  * [Actualizar el alias del dominio](#update-domain-alias)
  * [Eliminar alias de dominio](#delete-domain-alias)
* [Encriptar](#encrypt)
  * [Cifrar registro TXT](#encrypt-txt-record)

## Bibliotecas {#libraries}

Todavía no hemos publicado ningún contenedor de API, pero planeamos hacerlo próximamente. Envíe un correo electrónico a <api@forwardemail.net> si desea recibir notificaciones cuando se publique el contenedor de API de un lenguaje de programación en particular. Mientras tanto, puede usar estas bibliotecas de solicitudes HTTP recomendadas en su aplicación o simplemente usar [rizo](https://stackoverflow.com/a/27442239/3586413) como en los ejemplos a continuación.

| Idioma | Biblioteca |
| ---------- | ---------------------------------------------------------------------- |
| Rubí | [Faraday](https://github.com/lostisland/faraday) |
| Pitón | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (somos mantenedores) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (somos mantenedores) |
| Ir | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## URI base {#base-uri}

La ruta URI base HTTP actual es: `BASE_URI`.

## Autenticación {#authentication}

Todos los puntos finales requieren que su [Clave API](https://forwardemail.net/my-account/security) se configure como el valor de "nombre de usuario" del encabezado [Autorización básica](https://en.wikipedia.org/wiki/Basic_access_authentication) de la solicitud (con la excepción de [Contactos de alias](#alias-contacts), [Calendarios de alias](#alias-calendars) y [Buzones de alias](#alias-mailboxes) que usan un [nombre de usuario y contraseña alias generados](/faq#do-you-support-receiving-email-with-imap)).

No te preocupes, a continuación te proporcionamos ejemplos si no estás seguro de qué es esto.

## Errores {#errors}

Si ocurre algún error, el cuerpo de respuesta de la solicitud de API contendrá un mensaje de error detallado.

| Código | Nombre |
| ---- | --------------------- |
| 200 | OK |
| 400 | Solicitud incorrecta |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | Extraviado |
| 429 | Demasiadas solicitudes |
| 500 | Error Interno del Servidor |
| 501 | No implementado |
| 502 | Puerta de enlace defectuosa |
| 503 | Servicio No Disponible |
| 504 | Tiempo de espera de la puerta de enlace |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## Localización {#localization}

Nuestro servicio está traducido a más de 25 idiomas. Todos los mensajes de respuesta de la API se traducen a la última configuración regional detectada del usuario que realizó la solicitud. Puede anular esta configuración pasando un encabezado `Accept-Language` personalizado. Pruébelo usando el menú desplegable de idiomas al final de esta página.

## Paginación {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

La paginación es compatible con todos los puntos finales de API que enumeran resultados.

Simplemente proporcione las propiedades de la cadena de consulta `page` (y opcionalmente `limit`).

La propiedad `page` debe ser un número mayor o igual que `1`. Si proporciona `limit` (también un número), el valor mínimo es `10` y el máximo es `50` (a menos que se indique lo contrario).

| Parámetros de la cadena de consulta | Requerido | Tipo | Descripción |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | No | Número | Página de resultados a devolver. Si no se especifica, el valor de `page` será `1`. Debe ser un número mayor o igual que `1`. |
| `limit` | No | Número | Número de resultados que se devolverán por página. El valor predeterminado es `10` si no se especifica. Debe ser un número mayor o igual a `1` y menor o igual a `50`. |

Para determinar si hay más resultados disponibles o no, proporcionamos estos encabezados de respuesta HTTP (que puede analizar para paginar programáticamente):

| Encabezado de respuesta HTTP | Ejemplo | Descripción |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | El número total de páginas disponibles. |
| `X-Page-Current` | `X-Page-Current: 1` | La página actual de resultados devueltos (por ejemplo, según el parámetro de cadena de consulta `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | La cantidad total de resultados devueltos en la página (por ejemplo, según el parámetro de cadena de consulta `limit` y los resultados reales devueltos). |
| `X-Item-Count` | `X-Item-Count: 30` | El número total de elementos disponibles en todas las páginas. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Proporcionamos un encabezado de respuesta HTTP `Link` que puede analizar como se muestra en el ejemplo. Este es [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (p. ej., no se proporcionarán todos los valores si no son relevantes o no están disponibles; p. ej., `"next"` no se proporcionará si no hay otra página). |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Registros {#logs}

### Recuperar registros {#retrieve-logs}

Nuestra API le permite descargar los registros de su cuenta de forma programática. Al enviar una solicitud a este punto final, se procesarán todos los registros de su cuenta y se los enviaremos por correo electrónico como archivo adjunto (archivo de hoja de cálculo comprimido [Gzip](https://en.wikipedia.org/wiki/Gzip) [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) ) una vez completados.

Esto le permite crear trabajos en segundo plano con un [Trabajo cron](https://en.wikipedia.org/wiki/Cron) o usar nuestro [Software de programación de tareas Node.js Bree](https://github.com/breejs/bree) para recibir registros cuando lo desee. Tenga en cuenta que este punto final está limitado a `10` solicitudes por día.

El archivo adjunto es `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` en minúsculas y el correo electrónico contiene un breve resumen de los registros recuperados. También puede descargar los registros en cualquier momento desde [Mi cuenta → Registros](/my-account/logs).

> `GET /v1/logs/download`

| Parámetros de la cadena de consulta | Requerido | Tipo | Descripción |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | No | Cadena (FQDN) | Filtrar registros por dominio completo ("FQDN"). Si no lo proporciona, se recuperarán todos los registros de todos los dominios. |
| `q` | No | Cadena | Busque registros por correo electrónico, dominio, nombre de alias, dirección IP o fecha (formato `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` o `M.D.YY`). |
| `bounce_category` | No | Cadena | Busque registros por una categoría de rebote específica (por ejemplo, `blocklist`). |
| `response_code` | No | Número | Busque registros por un código de respuesta de error específico (por ejemplo, `421` o `550`). |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Ejemplo de trabajo Cron (a medianoche todos los días):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Tenga en cuenta que puede utilizar servicios como [Crontab.guru](https://crontab.guru/) para validar la sintaxis de la expresión de su trabajo cron.

> Ejemplo de trabajo Cron (a medianoche todos los días **y con registros del día anterior**):

Para MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Para Linux y Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Cuenta {#account}

### Crear cuenta {#create-account}

> `POST /v1/account`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | -------------- | ------------- |
| `email` | Sí | Cadena (correo electrónico) | Dirección de correo electrónico |
| `password` | Sí | Cadena | Contraseña |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Recuperar cuenta {#retrieve-account}

> `GET /v1/account`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Actualizar cuenta {#update-account}

> `PUT /v1/account`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | -------------- | -------------------- |
| `email` | No | Cadena (correo electrónico) | Dirección de correo electrónico |
| `given_name` | No | Cadena | Nombre de pila |
| `family_name` | No | Cadena | Apellido |
| `avatar_url` | No | Cadena (URL) | Enlace a la imagen del avatar |

> Ejemplo de solicitud:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Contactos de alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Lista de contactos {#list-contacts}

> `GET /v1/contacts`

**Muy pronto**

### Crear contacto {#create-contact}

> `POST /v1/contacts`

**Muy pronto**

### Recuperar contacto {#retrieve-contact}

> `GET /v1/contacts/:id`

**Muy pronto**

### Actualizar contacto {#update-contact}

> `PUT /v1/contacts/:id`

**Muy pronto**

### Eliminar contacto {#delete-contact}

> `DELETE /v1/contacts/:id`

**Muy pronto**

## Alias Calendarios (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Lista de calendarios {#list-calendars}

> `GET /v1/calendars`

**Muy pronto**

### Crear calendario {#create-calendar}

> `POST /v1/calendars`

**Muy pronto**

### Recuperar calendario {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Muy pronto**

### Actualizar calendario {#update-calendar}

> `PUT /v1/calendars/:id`

**Muy pronto**

### Eliminar calendario {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Muy pronto**

## Mensajes de alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Asegúrese de haber seguido las instrucciones de configuración para su dominio.

Estas instrucciones se pueden encontrar en nuestra sección de preguntas frecuentes [¿Admite la recepción de correo electrónico con IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Listar y buscar mensajes {#list-and-search-for-messages}

> `GET /v1/messages`

**Muy pronto**

### Crear mensaje {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**Muy pronto**

### Recuperar mensaje {#retrieve-message}

> `GET /v1/messages/:id`

**Muy pronto**

### Mensaje de actualización {#update-message}

> `PUT /v1/messages/:id`

**Muy pronto**

### Eliminar mensaje {#delete-message}

> `DELETE /v1/messages:id`

**Muy pronto**

## Carpetas de alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Lista de carpetas {#list-folders}

> `GET /v1/folders`

**Muy pronto**

### Crear carpeta {#create-folder}

> `POST /v1/folders`

**Muy pronto**

### Recuperar carpeta {#retrieve-folder}

> `GET /v1/folders/:id`

**Muy pronto**

### Actualizar carpeta {#update-folder}

> `PUT /v1/folders/:id`

**Muy pronto**

### Eliminar carpeta {#delete-folder}

> `DELETE /v1/folders/:id`

**Muy pronto**

### Copiar carpeta {#copy-folder}

> `POST /v1/folders/:id/copy`

**Muy pronto**

## Correos electrónicos salientes {#outbound-emails}

Asegúrese de haber seguido las instrucciones de configuración para su dominio.

Estas instrucciones se encuentran en [Mi cuenta → Dominios → Configuración → Configuración SMTP saliente](/my-account/domains). Debe asegurarse de configurar DKIM, Return-Path y DMARC para enviar SMTP saliente con su dominio.

### Obtener el límite de correo electrónico SMTP saliente {#get-outbound-smtp-email-limit}

Este es un punto final simple que devuelve un objeto JSON que contiene `count` y `limit` para la cantidad de mensajes SMTP salientes diarios por cuenta.

> `GET /v1/emails/limit`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Lista de correos electrónicos SMTP salientes {#list-outbound-smtp-emails}

Tenga en cuenta que este punto final no devuelve valores de propiedad para `message`, `headers` ni `rejectedErrors` de un correo electrónico.

Para devolver esas propiedades y sus valores, utilice el punto final [Recuperar correo electrónico](#retrieve-email) con una ID de correo electrónico.

> `GET /v1/emails`

| Parámetros de la cadena de consulta | Requerido | Tipo | Descripción |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | No | Cadena (compatible con RegExp) | Buscar correos electrónicos por metadatos |
| `domain` | No | Cadena (compatible con RegExp) | Buscar correos electrónicos por nombre de dominio |
| `sort` | No | Cadena | Ordenar por un campo específico (anteponga un guion `-` para ordenar en sentido inverso). El valor predeterminado es `created_at` si no se configura. |
| `page` | No | Número | Consulte [Pagination](#pagination) para obtener más información |
| `limit` | No | Número | Consulte [Pagination](#pagination) para obtener más información |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Crear correo electrónico SMTP saliente {#create-outbound-smtp-email}

Nuestra API para crear correos electrónicos se inspira en la configuración de opciones de mensajes de Nodemailer y la aprovecha. Consulte [Configuración de mensajes de Nodemailer](https://nodemailer.com/message/) para todos los parámetros del cuerpo a continuación.

Tenga en cuenta que, con la excepción de `envelope` y `dkim` (ya que las configuramos automáticamente), todas las opciones de Nodemailer son compatibles. Por seguridad, configuramos automáticamente las opciones `disableFileAccess` y `disableUrlAccess` en `true`.

Debes pasar la opción única de `raw` con tu correo electrónico completo sin procesar, incluidos los encabezados **o** pasar las opciones de parámetros del cuerpo individuales a continuación.

Este punto final de API codificará automáticamente los emojis si se encuentran en los encabezados (por ejemplo, un asunto con `Subject: 🤓 Hello` se convierte automáticamente en `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Nuestro objetivo era crear una API de correo electrónico extremadamente intuitiva y a prueba de errores.

> `POST /v1/emails`

| Parámetros corporales | Requerido | Tipo | Descripción |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | No | Cadena (correo electrónico) | La dirección de correo electrónico del remitente (debe existir como un alias del dominio). |
| `to` | No | Cadena o matriz | Lista separada por comas o una matriz de destinatarios para el encabezado "Para". |
| `cc` | No | Cadena o matriz | Lista separada por comas o una matriz de destinatarios para el encabezado "Cc". |
| `bcc` | No | Cadena o matriz | Lista separada por comas o una matriz de destinatarios para el encabezado "Cco". |
| `subject` | No | Cadena | El asunto del correo electrónico. |
| `text` | No | Cadena o búfer | La versión de texto simple del mensaje. |
| `html` | No | Cadena o búfer | La versión HTML del mensaje. |
| `attachments` | No | Formación | Una matriz de objetos adjuntos (ver [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | No | Cadena | La dirección de correo electrónico para el encabezado "Remitente" (ver [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | No | Cadena | La dirección de correo electrónico para el encabezado "Responder a". |
| `inReplyTo` | No | Cadena | El ID del mensaje al que responde el mensaje. |
| `references` | No | Cadena o matriz | Lista separada por espacios o una matriz de ID de mensajes. |
| `attachDataUrls` | No | Booleano | Si `true` entonces convierte `data:` imágenes en el contenido HTML del mensaje en archivos adjuntos incrustados. |
| `watchHtml` | No | Cadena | Una versión HTML específica del mensaje para Apple Watch ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), los relojes más recientes no requieren que esta opción esté configurada). |
| `amp` | No | Cadena | Una versión HTML específica de AMP4EMAIL del mensaje (ver [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | No | Objeto | Un evento de iCalendar para usar como contenido de mensaje alternativo (ver [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | No | Formación | Una matriz de contenido de mensaje alternativo (ver [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | No | Cadena | Codificación para el texto y las cadenas HTML (el valor predeterminado es `"utf-8"`, pero también admite valores de codificación `"hex"` y `"base64"`). |
| `raw` | No | Cadena o búfer | Un mensaje con formato RFC822 generado a medida para utilizar (en lugar de uno generado por Nodemailer; consulte [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | No | Cadena | Codificación que se fuerza a usar para valores de texto (`"quoted-printable"` o `"base64"`). El valor predeterminado es el más cercano detectado (para ASCII, use `"quoted-printable"`). |
| `priority` | No | Cadena | Nivel de prioridad del correo electrónico (puede ser `"high"`, `"normal"` (predeterminado) o `"low"`). Tenga en cuenta que el valor `"normal"` no establece un encabezado de prioridad (este es el comportamiento predeterminado). Si se establece un valor `"high"` o `"low"`, los encabezados `X-Priority`, `X-MSMail-Priority` y `Importance` serán [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | No | Objeto o matriz | Un objeto o una matriz de campos de encabezado adicionales para configurar (ver [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | No | Cadena | Un valor de Message-ID opcional para el encabezado "Message-ID" (se creará automáticamente un valor predeterminado si no se configura; tenga en cuenta que el valor debe ser [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | No | Cadena o fecha | Un valor de fecha opcional que se usará si el encabezado de fecha falta después del análisis; de lo contrario, se usará la cadena UTC actual si no se configura. El encabezado de fecha no puede tener más de 30 días de antelación respecto a la hora actual. |
| `list` | No | Objeto | Un objeto opcional de encabezados `List-*` (ver [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Recuperar correo electrónico SMTP saliente {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Eliminar correo electrónico SMTP saliente {#delete-outbound-smtp-email}

La eliminación de correos electrónicos establecerá el estado en `"rejected"` (y posteriormente no se procesará en la cola) solo si el estado actual es `"pending"`, `"queued"` o `"deferred"`. Podemos purgar los correos electrónicos automáticamente después de 30 días de su creación o envío; por lo tanto, le recomendamos conservar una copia de los correos electrónicos SMTP salientes en su cliente, base de datos o aplicación. Si lo desea, puede consultar el valor de nuestro ID de correo electrónico en su base de datos; este valor se devuelve desde los puntos finales [Crear correo electrónico](#create-email) y [Recuperar correo electrónico](#retrieve-email).

> `DELETE /v1/emails/:id`

> Ejemplo de solicitud:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Dominios {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### Lista de dominios {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Parámetros de la cadena de consulta | Requerido | Tipo | Descripción |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | No | Cadena (compatible con RegExp) | Buscar dominios por nombre |
| `name` | No | Cadena (compatible con RegExp) | Buscar dominios por nombre |
| `sort` | No | Cadena | Ordenar por un campo específico (anteponga un guion `-` para ordenar en sentido inverso). El valor predeterminado es `created_at` si no se configura. |
| `page` | No | Número | Consulte [Pagination](#pagination) para obtener más información |
| `limit` | No | Número | Consulte [Pagination](#pagination) para obtener más información |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Crear dominio {#create-domain}

> `POST /v1/domains`

| Parámetros corporales | Requerido | Tipo | Descripción |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Sí | Cadena (FQDN o IP) | Nombre de dominio completo ("FQDN") o dirección IP |
| `team_domain` | No | Cadena (ID de dominio o nombre de dominio; FQDN) | Asignar automáticamente este dominio al mismo equipo desde otro dominio. Esto significa que todos los miembros de este dominio se asignarán como miembros del equipo y que `plan` también se establecerá automáticamente en `team`. Puede establecerlo en `"none"` si es necesario para deshabilitarlo explícitamente, pero no es necesario. |
| `plan` | No | Cadena (enumerable) | Tipo de plan (debe ser `"free"`, `"enhanced_protection"` o `"team"`, el valor predeterminado es `"free"` o el plan pago actual del usuario si tiene uno) |
| `catchall` | No | Cadena (direcciones de correo electrónico delimitadas) o booleano | Crea un alias general predeterminado, cuyo valor predeterminado es `true` (si es `true`, se usará la dirección de correo electrónico del usuario de la API como destinatario; si es `false`, no se creará ningún alias general). Si se pasa una cadena, se trata de una lista delimitada de direcciones de correo electrónico para usar como destinatarios (separadas por salto de línea, espacio o coma). |
| `has_adult_content_protection` | No | Booleano | Si se debe habilitar la protección de contenido para adultos de Spam Scanner en este dominio |
| `has_phishing_protection` | No | Booleano | Si se debe habilitar la protección contra phishing de Spam Scanner en este dominio |
| `has_executable_protection` | No | Booleano | Si se debe habilitar la protección ejecutable de Spam Scanner en este dominio |
| `has_virus_protection` | No | Booleano | Si se debe habilitar la protección antivirus Spam Scanner en este dominio |
| `has_recipient_verification` | No | Booleano | Dominio global predeterminado que determina si se requiere que los destinatarios de alias hagan clic en un enlace de verificación de correo electrónico para que los correos electrónicos fluyan. |
| `ignore_mx_check` | No | Booleano | Si se ignora la comprobación de registros MX en el dominio para su verificación. Esto es principalmente para usuarios con reglas de configuración avanzadas de intercambio MX y que necesitan mantener su intercambio MX existente y reenviarlo al nuestro. |
| `retention_days` | No | Número | Entero entre `0` y `30` que corresponde al número de días de retención para almacenar los correos electrónicos SMTP salientes una vez entregados correctamente o con errores permanentes. El valor predeterminado es `0`, lo que significa que los correos electrónicos SMTP salientes se purgan y redactan inmediatamente para su seguridad. |
| `bounce_webhook` | No | Cadena (URL) o booleano (falso) | La URL del webhook `http://` o `https://` que elija para enviar los webhooks de rebote. Enviaremos una solicitud `POST` a esta URL con información sobre fallos de SMTP salientes (por ejemplo, fallos leves o graves, para que pueda gestionar sus suscriptores y su correo electrónico saliente de forma programática). |
| `max_quota_per_alias` | No | Cadena | Cuota máxima de almacenamiento para alias en este nombre de dominio. Introduzca un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js). |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Recuperar dominio {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verificar registros de dominio {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verificar registros SMTP del dominio {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Lista de contraseñas generales de todo el dominio {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Crear una contraseña general para todo el dominio {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | No | Cadena | Su nueva contraseña personalizada para la contraseña general del dominio. Tenga en cuenta que puede dejarla en blanco o incluso omitirla en el cuerpo de su solicitud de API si desea obtener una contraseña segura y generada aleatoriamente. |
| `description` | No | Cadena | Descripción sólo para fines organizativos. |

> Ejemplo de solicitud:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Eliminar la contraseña general de todo el dominio {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Ejemplo de solicitud:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Actualizar dominio {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parámetros corporales | Requerido | Tipo | Descripción |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | No | Cadena o número | Puerto personalizado para configurar para el reenvío SMTP (el valor predeterminado es `"25"`) |
| `has_adult_content_protection` | No | Booleano | Si se debe habilitar la protección de contenido para adultos de Spam Scanner en este dominio |
| `has_phishing_protection` | No | Booleano | Si se debe habilitar la protección contra phishing de Spam Scanner en este dominio |
| `has_executable_protection` | No | Booleano | Si se debe habilitar la protección ejecutable de Spam Scanner en este dominio |
| `has_virus_protection` | No | Booleano | Si se debe habilitar la protección antivirus Spam Scanner en este dominio |
| `has_recipient_verification` | No | Booleano | Dominio global predeterminado que determina si se requiere que los destinatarios de alias hagan clic en un enlace de verificación de correo electrónico para que los correos electrónicos fluyan. |
| `ignore_mx_check` | No | Booleano | Si se ignora la comprobación de registros MX en el dominio para su verificación. Esto es principalmente para usuarios con reglas de configuración avanzadas de intercambio MX y que necesitan mantener su intercambio MX existente y reenviarlo al nuestro. |
| `retention_days` | No | Número | Entero entre `0` y `30` que corresponde al número de días de retención para almacenar los correos electrónicos SMTP salientes una vez entregados correctamente o con errores permanentes. El valor predeterminado es `0`, lo que significa que los correos electrónicos SMTP salientes se purgan y redactan inmediatamente para su seguridad. |
| `bounce_webhook` | No | Cadena (URL) o booleano (falso) | La URL del webhook `http://` o `https://` que elija para enviar los webhooks de rebote. Enviaremos una solicitud `POST` a esta URL con información sobre fallos de SMTP salientes (por ejemplo, fallos leves o graves, para que pueda gestionar sus suscriptores y su correo electrónico saliente de forma programática). |
| `max_quota_per_alias` | No | Cadena | Cuota máxima de almacenamiento para alias en este nombre de dominio. Introduzca un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js). |

> Ejemplo de solicitud:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Eliminar dominio {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Ejemplo de solicitud:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Invita a {#invites}

### Aceptar invitación de dominio {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Crear invitación de dominio {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Sí | Cadena (correo electrónico) | Dirección de correo electrónico para invitar a la lista de miembros del dominio |
| `group` | Sí | Cadena (enumerable) | Grupo al que se agregará el usuario a la membresía del dominio (puede ser uno de `"admin"` o `"user"`) |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Eliminar invitación de dominio {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Sí | Cadena (correo electrónico) | Dirección de correo electrónico para eliminar de la lista de miembros del dominio |

> Ejemplo de solicitud:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Miembros {#members}

### Actualizar miembro del dominio {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Sí | Cadena (enumerable) | Grupo para actualizar al usuario a la membresía del dominio (puede ser uno de `"admin"` o `"user"`) |

> Ejemplo de solicitud:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Eliminar miembro del dominio {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Ejemplo de solicitud:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Alias {#aliases}

### Generar una contraseña de alias {#generate-an-alias-password}

Tenga en cuenta que si no envía instrucciones por correo electrónico, el nombre de usuario y la contraseña estarán en el cuerpo de la respuesta JSON de una solicitud exitosa en el formato `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parámetros corporales | Requerido | Tipo | Descripción |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | No | Cadena | Su nueva contraseña personalizada para el alias. Tenga en cuenta que puede dejarla en blanco o incluso omitirla en el cuerpo de la solicitud de API si desea obtener una contraseña segura y generada aleatoriamente. |
| `password` | No | Cadena | Contraseña existente para el alias para cambiar la contraseña sin eliminar el almacenamiento del buzón IMAP existente (consulte la opción `is_override` a continuación si ya no tiene la contraseña existente). |
| `is_override` | No | Booleano | **PRECAUCIÓN**: Esto anulará por completo la contraseña y la base de datos del alias, eliminará permanentemente el almacenamiento IMAP y restablecerá por completo la base de datos de correo electrónico SQLite del alias. Si tiene un buzón asociado a este alias, haga una copia de seguridad. |
| `emailed_instructions` | No | Cadena | Dirección de correo electrónico a la que enviar la contraseña del alias y las instrucciones de configuración. |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Lista de alias de dominio {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parámetros de la cadena de consulta | Requerido | Tipo | Descripción |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | No | Cadena (compatible con RegExp) | Busque alias en un dominio por nombre, etiqueta o destinatario |
| `name` | No | Cadena (compatible con RegExp) | Buscar alias en un dominio por nombre |
| `recipient` | No | Cadena (compatible con RegExp) | Buscar alias en un dominio por destinatario |
| `sort` | No | Cadena | Ordenar por un campo específico (anteponga un guion `-` para ordenar en sentido inverso). El valor predeterminado es `created_at` si no se configura. |
| `page` | No | Número | Consulte [Pagination](#pagination) para obtener más información |
| `limit` | No | Número | Consulte [Pagination](#pagination) para obtener más información |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Crear nuevo alias de dominio {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parámetros corporales | Requerido | Tipo | Descripción |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | No | Cadena | Nombre de alias (si no se proporciona o está en blanco, se genera un alias aleatorio) |
| `recipients` | No | Cadena o matriz | Lista de destinatarios (debe ser una cadena o matriz separada por saltos de línea, espacios o comas de direcciones de correo electrónico válidas, nombres de dominio completos ("FQDN"), direcciones IP y/o URL de webhook; si no se proporciona o es una matriz vacía, se establecerá como destinatario el correo electrónico del usuario que realiza la solicitud de API) |
| `description` | No | Cadena | Descripción del alias |
| `labels` | No | Cadena o matriz | Lista de etiquetas (debe ser una cadena o matriz separada por saltos de línea, espacios o comas) |
| `has_recipient_verification` | No | Booleano | Requerir que los destinatarios hagan clic en un enlace de verificación de correo electrónico para que los correos electrónicos fluyan (el valor predeterminado es la configuración del dominio si no se configura explícitamente en el cuerpo de la solicitud) |
| `is_enabled` | No | Booleano | Si se activa o desactiva este alias (si se desactiva, los correos electrónicos no se redirigirán a ninguna parte, pero mostrarán códigos de estado correctos). Si se pasa un valor, se convierte a un booleano mediante [boolean](https://github.com/thenativeweb/boolean#quick-start). |
| `error_code_if_disabled` | No | Número (ya sea `250`, `421` o `550`) | Los correos electrónicos entrantes a este alias se rechazarán si `is_enabled` es `false` con `250` (entrega discreta, p. ej., blackhole o `/dev/null`), `421` (rechazo temporal; reintento durante un máximo de ~5 días) o `550` (error permanente y rechazo). El valor predeterminado es `250`. |
| `has_imap` | No | Booleano | Si se debe habilitar o deshabilitar el almacenamiento IMAP para este alias (si está deshabilitado, los correos electrónicos entrantes recibidos no se almacenarán en [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Si se pasa un valor, se convierte a un booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `has_pgp` | No | Booleano | Si habilitar o deshabilitar [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) usando el alias `public_key`. |
| `public_key` | No | Cadena | Clave pública OpenPGP en formato ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); p. ej., clave GPG para `support@forwardemail.net`). Esto solo aplica si `has_pgp` está configurado en `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | No | Cadena | Cuota máxima de almacenamiento para este alias. Déjelo en blanco para restablecer la cuota máxima actual del dominio o introduzca un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js). Este valor solo puede ser ajustado por los administradores del dominio. |
| `vacation_responder_is_enabled` | No | Booleano | Si desea habilitar o deshabilitar una respuesta automática en caso de vacaciones. |
| `vacation_responder_start_date` | No | Cadena | Fecha de inicio del respondedor automático (si está habilitado y no se establece una fecha de inicio aquí, se asume que ya se inició). Admitimos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros mediante análisis inteligente con `dayjs`. |
| `vacation_responder_end_date` | No | Cadena | Fecha de finalización del respondedor automático (si está habilitado y no se establece una fecha de finalización aquí, se asume que nunca finaliza y responde indefinidamente). Admitimos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros mediante análisis inteligente con `dayjs`. |
| `vacation_responder_subject` | No | Cadena | Asunto en texto plano para la respuesta de vacaciones, p. ej., "Fuera de la oficina". Usamos `striptags` para eliminar todo el HTML. |
| `vacation_responder_message` | No | Cadena | Mensaje en texto plano para el respondedor de vacaciones, p. ej.: "Estaré fuera de la oficina hasta febrero". Usamos `striptags` para eliminar todo el HTML. |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Recuperar alias de dominio {#retrieve-domain-alias}

Puede recuperar un alias de dominio por su valor `id` o `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Actualizar alias de dominio {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parámetros corporales | Requerido | Tipo | Descripción |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | No | Cadena | Alias |
| `recipients` | No | Cadena o matriz | Lista de destinatarios (debe ser una cadena o matriz de direcciones de correo electrónico válidas, nombres de dominio completos ("FQDN"), direcciones IP y/o URL de webhook separados por saltos de línea, espacios o comas) |
| `description` | No | Cadena | Descripción del alias |
| `labels` | No | Cadena o matriz | Lista de etiquetas (debe ser una cadena o matriz separada por saltos de línea, espacios o comas) |
| `has_recipient_verification` | No | Booleano | Requerir que los destinatarios hagan clic en un enlace de verificación de correo electrónico para que los correos electrónicos fluyan (el valor predeterminado es la configuración del dominio si no se configura explícitamente en el cuerpo de la solicitud) |
| `is_enabled` | No | Booleano | Si se activa o desactiva este alias (si se desactiva, los correos electrónicos no se redirigirán a ninguna parte, pero mostrarán códigos de estado correctos). Si se pasa un valor, se convierte a un booleano mediante [boolean](https://github.com/thenativeweb/boolean#quick-start). |
| `error_code_if_disabled` | No | Número (ya sea `250`, `421` o `550`) | Los correos electrónicos entrantes a este alias se rechazarán si `is_enabled` es `false` con `250` (entrega discreta, p. ej., blackhole o `/dev/null`), `421` (rechazo temporal; reintento durante un máximo de ~5 días) o `550` (error permanente y rechazo). El valor predeterminado es `250`. |
| `has_imap` | No | Booleano | Si se debe habilitar o deshabilitar el almacenamiento IMAP para este alias (si está deshabilitado, los correos electrónicos entrantes recibidos no se almacenarán en [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Si se pasa un valor, se convierte a un booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `has_pgp` | No | Booleano | Si habilitar o deshabilitar [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) usando el alias `public_key`. |
| `public_key` | No | Cadena | Clave pública OpenPGP en formato ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); p. ej., clave GPG para `support@forwardemail.net`). Esto solo aplica si `has_pgp` está configurado en `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | No | Cadena | Cuota máxima de almacenamiento para este alias. Déjelo en blanco para restablecer la cuota máxima actual del dominio o introduzca un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js). Este valor solo puede ser ajustado por los administradores del dominio. |
| `vacation_responder_is_enabled` | No | Booleano | Si desea habilitar o deshabilitar una respuesta automática en caso de vacaciones. |
| `vacation_responder_start_date` | No | Cadena | Fecha de inicio del respondedor automático (si está habilitado y no se establece una fecha de inicio aquí, se asume que ya se inició). Admitimos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros mediante análisis inteligente con `dayjs`. |
| `vacation_responder_end_date` | No | Cadena | Fecha de finalización del respondedor automático (si está habilitado y no se establece una fecha de finalización aquí, se asume que nunca finaliza y responde indefinidamente). Admitimos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros mediante análisis inteligente con `dayjs`. |
| `vacation_responder_subject` | No | Cadena | Asunto en texto plano para la respuesta de vacaciones, p. ej., "Fuera de la oficina". Usamos `striptags` para eliminar todo el HTML. |
| `vacation_responder_message` | No | Cadena | Mensaje en texto plano para el respondedor de vacaciones, p. ej.: "Estaré fuera de la oficina hasta febrero". Usamos `striptags` para eliminar todo el HTML. |

> Ejemplo de solicitud:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Eliminar alias de dominio {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Ejemplo de solicitud:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Cifrar {#encrypt}

Le permitimos cifrar registros, incluso con el plan gratuito, sin costo alguno. La privacidad no debería ser una característica, sino una característica inherente a todos los aspectos de un producto. Como se solicitó encarecidamente en [Discusión sobre las Guías de Privacidad](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) y en [nuestros problemas de GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), hemos añadido esto.

### Cifrar registro TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parámetros corporales | Requerido | Tipo | Descripción |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Sí | Cadena | Cualquier registro TXT de texto sin formato de correo electrónico de reenvío válido |

> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
