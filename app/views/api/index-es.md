# API de Email {#email-api}


## Tabla de Contenidos {#table-of-contents}

* [Bibliotecas](#libraries)
* [URI Base](#base-uri)
* [Autenticación](#authentication)
  * [Autenticación con Token API (Recomendado para la mayoría de los endpoints)](#api-token-authentication-recommended-for-most-endpoints)
  * [Autenticación con Credenciales de Alias (Para correo saliente)](#alias-credentials-authentication-for-outbound-email)
  * [Endpoints Solo Alias](#alias-only-endpoints)
* [Errores](#errors)
* [Localización](#localization)
* [Paginación](#pagination)
* [Registros](#logs)
  * [Recuperar registros](#retrieve-logs)
* [Cuenta](#account)
  * [Crear cuenta](#create-account)
  * [Recuperar cuenta](#retrieve-account)
  * [Actualizar cuenta](#update-account)
* [Contactos de Alias (CardDAV)](#alias-contacts-carddav)
  * [Listar contactos](#list-contacts)
  * [Crear contacto](#create-contact)
  * [Recuperar contacto](#retrieve-contact)
  * [Actualizar contacto](#update-contact)
  * [Eliminar contacto](#delete-contact)
* [Calendarios de Alias (CalDAV)](#alias-calendars-caldav)
  * [Listar calendarios](#list-calendars)
  * [Crear calendario](#create-calendar)
  * [Recuperar calendario](#retrieve-calendar)
  * [Actualizar calendario](#update-calendar)
  * [Eliminar calendario](#delete-calendar)
* [Mensajes de Alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Listar y buscar mensajes](#list-and-search-for-messages)
  * [Crear mensaje](#create-message)
  * [Recuperar mensaje](#retrieve-message)
  * [Actualizar mensaje](#update-message)
  * [Eliminar mensaje](#delete-message)
* [Carpetas de Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Listar carpetas](#list-folders)
  * [Crear carpeta](#create-folder)
  * [Recuperar carpeta](#retrieve-folder)
  * [Actualizar carpeta](#update-folder)
  * [Eliminar carpeta](#delete-folder)
  * [Copiar carpeta](#copy-folder)
* [Correos Salientes](#outbound-emails)
  * [Obtener límite de correos SMTP salientes](#get-outbound-smtp-email-limit)
  * [Listar correos SMTP salientes](#list-outbound-smtp-emails)
  * [Crear correo SMTP saliente](#create-outbound-smtp-email)
  * [Recuperar correo SMTP saliente](#retrieve-outbound-smtp-email)
  * [Eliminar correo SMTP saliente](#delete-outbound-smtp-email)
* [Dominios](#domains)
  * [Listar dominios](#list-domains)
  * [Crear dominio](#create-domain)
  * [Recuperar dominio](#retrieve-domain)
  * [Verificar registros de dominio](#verify-domain-records)
  * [Verificar registros SMTP de dominio](#verify-domain-smtp-records)
  * [Listar contraseñas catch-all a nivel de dominio](#list-domain-wide-catch-all-passwords)
  * [Crear contraseña catch-all a nivel de dominio](#create-domain-wide-catch-all-password)
  * [Eliminar contraseña catch-all a nivel de dominio](#remove-domain-wide-catch-all-password)
  * [Actualizar dominio](#update-domain)
  * [Eliminar dominio](#delete-domain)
* [Invitaciones](#invites)
  * [Aceptar invitación de dominio](#accept-domain-invite)
  * [Crear invitación de dominio](#create-domain-invite)
  * [Eliminar invitación de dominio](#remove-domain-invite)
* [Miembros](#members)
  * [Actualizar miembro de dominio](#update-domain-member)
  * [Eliminar miembro de dominio](#remove-domain-member)
* [Aliases](#aliases)
  * [Generar una contraseña para alias](#generate-an-alias-password)
  * [Listar aliases de dominio](#list-domain-aliases)
  * [Crear nuevo alias de dominio](#create-new-domain-alias)
  * [Recuperar alias de dominio](#retrieve-domain-alias)
  * [Actualizar alias de dominio](#update-domain-alias)
  * [Eliminar alias de dominio](#delete-domain-alias)
* [Encriptar](#encrypt)
  * [Encriptar Registro TXT](#encrypt-txt-record)


## Bibliotecas {#libraries}

Por ahora no hemos lanzado ningún wrapper de API, pero planeamos hacerlo en un futuro cercano. Envía un correo a <api@forwardemail.net> si deseas ser notificado cuando se lance el wrapper de API para un lenguaje de programación en particular. Mientras tanto, puedes usar estas bibliotecas recomendadas para solicitudes HTTP en tu aplicación, o simplemente usar [curl](https://stackoverflow.com/a/27442239/3586413) como en los ejemplos a continuación.

| Lenguaje  | Biblioteca                                                             |
| --------- | --------------------------------------------------------------------- |
| Ruby      | [Faraday](https://github.com/lostisland/faraday)                      |
| Python    | [requests](https://github.com/psf/requests)                           |
| Java      | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP       | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript| [superagent](https://github.com/ladjs/superagent) (somos mantenedores)|
| Node.js   | [superagent](https://github.com/ladjs/superagent) (somos mantenedores)|
| Go        | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET      | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## Base URI {#base-uri}

La ruta base HTTP actual es: `BASE_URI`.


## Autenticación {#authentication}

Todos los endpoints requieren autenticación usando [Autorización Básica](https://en.wikipedia.org/wiki/Basic_access_authentication). Soportamos dos métodos de autenticación:

### Autenticación con Token API (Recomendado para la mayoría de los endpoints) {#api-token-authentication-recommended-for-most-endpoints}

Establece tu [clave API](https://forwardemail.net/my-account/security) como el valor "usuario" con una contraseña vacía:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Nota el dos puntos (`:`) después del token API – esto indica una contraseña vacía en formato de Autenticación Básica.

### Autenticación con Credenciales de Alias (Para correo saliente) {#alias-credentials-authentication-for-outbound-email}

El endpoint [Crear correo SMTP saliente](#create-outbound-smtp-email) también soporta autenticación usando tu dirección de correo alias y una [contraseña de alias generada](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hola" \
  -d "text=Correo de prueba"
```

Este método es útil cuando se envían correos desde aplicaciones que ya usan credenciales SMTP y facilita la migración de SMTP a nuestra API sin problemas.

### Endpoints Solo para Alias {#alias-only-endpoints}

Los endpoints [Contactos de Alias](#alias-contacts-carddav), [Calendarios de Alias](#alias-calendars-caldav), [Mensajes de Alias](#alias-messages-imappop3) y [Carpetas de Alias](#alias-folders-imappop3) requieren credenciales de alias y no soportan autenticación con token API.

No te preocupes – a continuación se proporcionan ejemplos para ti si no estás seguro de qué es esto.


## Errores {#errors}

Si ocurre algún error, el cuerpo de la respuesta de la solicitud API contendrá un mensaje de error detallado.

| Código | Nombre                |
| ------ | --------------------- |
| 200    | OK                    |
| 400    | Solicitud Incorrecta  |
| 401    | No Autorizado         |
| 403    | Prohibido             |
| 404    | No Encontrado         |
| 429    | Demasiadas Solicitudes|
| 500    | Error Interno del Servidor |
| 501    | No Implementado       |
| 502    | Puerta de Enlace Incorrecta |
| 503    | Servicio No Disponible|
| 504    | Tiempo de Espera de Puerta de Enlace Agotado |

> \[!TIP]
> Si recibes un código de estado 5xx (lo cual no debería ocurrir), por favor contáctanos en <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> y te ayudaremos a resolver tu problema inmediatamente.


## Localización {#localization}

Nuestro servicio está traducido a más de 25 idiomas diferentes. Todos los mensajes de respuesta de la API se traducen al último idioma detectado del usuario que realiza la solicitud API. Puedes sobrescribir esto pasando un encabezado `Accept-Language` personalizado. Siéntete libre de probarlo usando el selector de idioma en la parte inferior de esta página.


## Paginación {#pagination}

> \[!NOTE]
> A partir del 1 de noviembre de 2024, los endpoints de API para [Listar dominios](#list-domains) y [Listar alias de dominio](#list-domain-aliases) tendrán por defecto un máximo de `1000` resultados por página. Si deseas optar por este comportamiento antes, puedes pasar `?paginate=true` como un parámetro adicional en la cadena de consulta de la URL para la consulta del endpoint.

La paginación es soportada por todos los endpoints de API que listan resultados.

Simplemente proporciona las propiedades en la cadena de consulta `page` (y opcionalmente `limit`).

La propiedad `page` debe ser un número mayor o igual a `1`. Si proporcionas `limit` (también un número), el valor mínimo es `10` y el máximo es `50` (a menos que se indique lo contrario).

| Parámetro en la cadena de consulta | Requerido | Tipo   | Descripción                                                                                                                                               |
| --------------------------------- | --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                            | No        | Número | Página de resultados a devolver. Si no se especifica, el valor de `page` será `1`. Debe ser un número mayor o igual a `1`.                               |
| `limit`                           | No        | Número | Número de resultados a devolver por página. Por defecto es `10` si no se especifica. Debe ser un número mayor o igual a `1`, y menor o igual a `50`.      |
Para determinar si hay más resultados disponibles o no, proporcionamos estos encabezados de respuesta HTTP (que puede analizar para paginar programáticamente):

| HTTP Response Header | Ejemplo                                                                                                                                                                                                                                                  | Descripción                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | El recuento total de páginas disponibles.                                                                                                                                                                                                                                                                                                                        |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | La página actual de resultados devuelta (por ejemplo, basada en el parámetro de cadena de consulta `page`).                                                                                                                                                                                                                                                      |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | El número total de resultados en la página devuelta (por ejemplo, basado en el parámetro de cadena de consulta `limit` y los resultados reales devueltos).                                                                                                                                                                                                       |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | El número total de elementos disponibles en todas las páginas.                                                                                                                                                                                                                                                                                                  |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Proporcionamos un encabezado de respuesta HTTP `Link` que puede analizar como se muestra en el ejemplo. Esto es [similar a GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (por ejemplo, no se proporcionarán todos los valores si no son relevantes o no están disponibles, por ejemplo, `"next"` no se proporcionará si no hay otra página). |
> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Registros {#logs}

### Recuperar registros {#retrieve-logs}

Nuestra API permite programáticamente descargar registros para su cuenta. Enviar una solicitud a este endpoint procesará todos los registros de su cuenta y se los enviará por correo electrónico como un archivo adjunto (hoja de cálculo [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) comprimida con [Gzip](https://en.wikipedia.org/wiki/Gzip)) una vez completado.

Esto le permite crear trabajos en segundo plano con un [trabajo Cron](https://en.wikipedia.org/wiki/Cron) o usando nuestro [software de programación de trabajos Node.js Bree](https://github.com/breejs/bree) para recibir registros cuando lo desee. Tenga en cuenta que este endpoint está limitado a `10` solicitudes por día.

El archivo adjunto tiene el formato en minúsculas `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` y el correo electrónico contiene un breve resumen de los registros recuperados. También puede descargar registros en cualquier momento desde [Mi Cuenta → Registros](/my-account/logs)

> `GET /v1/logs/download`

| Parámetro de consulta | Obligatorio | Tipo          | Descripción                                                                                                                     |
| --------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | No          | String (FQDN) | Filtrar registros por dominio completamente calificado ("FQDN"). Si no lo proporciona, se recuperarán todos los registros de todos los dominios. |
| `q`                   | No          | String        | Buscar registros por correo electrónico, dominio, nombre de alias, dirección IP o fecha (formato `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` o `M.D.YY`).       |
| `bounce_category`     | No          | String        | Buscar registros por una categoría específica de rebote (por ejemplo, `blocklist`).                                                               |
| `response_code`       | No          | Number        | Buscar registros por un código de respuesta de error específico (por ejemplo, `421` o `550`).                                                        |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Ejemplo de trabajo Cron (a medianoche todos los días):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Tenga en cuenta que puede usar servicios como [Crontab.guru](https://crontab.guru/) para validar la sintaxis de su expresión de trabajo cron.

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

| Parámetro del cuerpo | Obligatorio | Tipo           | Descripción    |
| -------------------- | ----------- | -------------- | -------------- |
| `email`              | Sí          | String (Email) | Dirección de correo electrónico |
| `password`           | Sí          | String         | Contraseña     |

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

| Parámetro del cuerpo | Obligatorio | Tipo           | Descripción          |
| -------------------- | ----------- | -------------- | -------------------- |
| `email`              | No          | String (Email) | Dirección de correo electrónico |
| `given_name`         | No          | String         | Nombre               |
| `family_name`        | No          | String         | Apellido             |
| `avatar_url`         | No          | String (URL)   | Enlace a la imagen del avatar |

> Ejemplo de solicitud:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Contactos de alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> A diferencia de otros endpoints de la API, estos requieren que la [Autenticación](#authentication) tenga el "nombre de usuario" igual al nombre de usuario del alias y la "contraseña" igual a la contraseña generada del alias como encabezados de autorización básica.
> \[!WARNING]
> Esta sección de endpoints está en desarrollo y se lanzará (esperemos) en 2024. Mientras tanto, por favor use un cliente IMAP desde el menú desplegable "Apps" en la navegación de nuestro sitio web.

### Listar contactos {#list-contacts}

> `GET /v1/contacts`

**Próximamente**

### Crear contacto {#create-contact}

> `POST /v1/contacts`

**Próximamente**

### Recuperar contacto {#retrieve-contact}

> `GET /v1/contacts/:id`

**Próximamente**

### Actualizar contacto {#update-contact}

> `PUT /v1/contacts/:id`

**Próximamente**

### Eliminar contacto {#delete-contact}

> `DELETE /v1/contacts/:id`

**Próximamente**


## Calendarios Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> A diferencia de otros endpoints de la API, estos requieren que la [Autenticación](#authentication) tenga el "nombre de usuario" igual al nombre de usuario del alias y la "contraseña" igual a la contraseña generada para el alias como encabezados de Autorización Básica.

> \[!WARNING]
> Esta sección de endpoints está en desarrollo y se lanzará (esperemos) en 2024. Mientras tanto, por favor use un cliente IMAP desde el menú desplegable "Apps" en la navegación de nuestro sitio web.

### Listar calendarios {#list-calendars}

> `GET /v1/calendars`

**Próximamente**

### Crear calendario {#create-calendar}

> `POST /v1/calendars`

**Próximamente**

### Recuperar calendario {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Próximamente**

### Actualizar calendario {#update-calendar}

> `PUT /v1/calendars/:id`

**Próximamente**

### Eliminar calendario {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Próximamente**


## Mensajes Alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> A diferencia de otros endpoints de la API, estos requieren que la [Autenticación](#authentication) tenga el "nombre de usuario" igual al nombre de usuario del alias y la "contraseña" igual a la contraseña generada para el alias como encabezados de Autorización Básica.

> \[!WARNING]
> Esta sección de endpoints está en desarrollo y se lanzará (esperemos) en 2024. Mientras tanto, por favor use un cliente IMAP desde el menú desplegable "Apps" en la navegación de nuestro sitio web.

Por favor asegúrese de haber seguido las instrucciones de configuración para su dominio.

Estas instrucciones se pueden encontrar en nuestra sección de FAQ [¿Soportan recibir correo electrónico con IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Listar y buscar mensajes {#list-and-search-for-messages}

> `GET /v1/messages`

**Próximamente**

### Crear mensaje {#create-message}

> \[!NOTE]
> Esto **NO** enviará un correo electrónico – solo añadirá el mensaje a la carpeta de su buzón (por ejemplo, esto es similar al comando IMAP `APPEND`). Si desea enviar un correo electrónico, consulte [Crear correo SMTP saliente](#create-outbound-smtp-email) a continuación. Después de crear el correo SMTP saliente, puede añadir una copia usando este endpoint a su buzón de alias para fines de almacenamiento.

> `POST /v1/messages`

**Próximamente**

### Recuperar mensaje {#retrieve-message}

> `GET /v1/messages/:id`

**Próximamente**

### Actualizar mensaje {#update-message}

> `PUT /v1/messages/:id`

**Próximamente**

### Eliminar mensaje {#delete-message}

> `DELETE /v1/messages:id`

**Próximamente**


## Carpetas Alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Los endpoints de carpetas con la ruta de carpeta <code>/v1/folders/:path</code> como su endpoint son intercambiables con el ID de la carpeta <code>:id</code>. Esto significa que puede referirse a la carpeta por su <code>path</code> o por su valor <code>id</code>.

> \[!WARNING]
> Esta sección de endpoints está en desarrollo y se lanzará (esperemos) en 2024. Mientras tanto, por favor use un cliente IMAP desde el menú desplegable "Apps" en la navegación de nuestro sitio web.

### Listar carpetas {#list-folders}

> `GET /v1/folders`

**Próximamente**

### Crear carpeta {#create-folder}

> `POST /v1/folders`

**Próximamente**

### Recuperar carpeta {#retrieve-folder}

> `GET /v1/folders/:id`

**Próximamente**

### Actualizar carpeta {#update-folder}

> `PUT /v1/folders/:id`

**Próximamente**

### Eliminar carpeta {#delete-folder}

> `DELETE /v1/folders/:id`

**Próximamente**

### Copiar carpeta {#copy-folder}

> `POST /v1/folders/:id/copy`

**Próximamente**


## Correos Salientes {#outbound-emails}

Por favor asegúrese de haber seguido las instrucciones de configuración para su dominio.

Estas instrucciones se encuentran en [Mi Cuenta → Dominios → Configuración → Configuración SMTP Saliente](/my-account/domains). Debe asegurarse de configurar DKIM, Return-Path y DMARC para enviar SMTP saliente con su dominio.
### Obtener límite de correo SMTP saliente {#get-outbound-smtp-email-limit}

Este es un endpoint simple que devuelve un objeto JSON que contiene el `count` y `limit` para el número de mensajes SMTP salientes diarios por cuenta.

> `GET /v1/emails/limit`

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Listar correos SMTP salientes {#list-outbound-smtp-emails}

Tenga en cuenta que este endpoint no devuelve los valores de las propiedades `message`, `headers` ni `rejectedErrors` de un correo.

Para devolver esas propiedades y sus valores, utilice el endpoint [Recuperar correo](#retrieve-email) con un ID de correo.

> `GET /v1/emails`

| Parámetro de consulta | Obligatorio | Tipo                      | Descripción                                                                                                                                      |
| --------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No          | String (RegExp soportado) | Buscar correos por metadatos                                                                                                                    |
| `domain`              | No          | String (RegExp soportado) | Buscar correos por nombre de dominio                                                                                                           |
| `sort`                | No          | String                    | Ordenar por un campo específico (prefijar con un guion simple `-` para ordenar en dirección inversa a ese campo). Por defecto es `created_at` si no se establece. |
| `page`                | No          | Number                    | Ver [Paginación](#pagination) para más detalles                                                                                                 |
| `limit`               | No          | Number                    | Ver [Paginación](#pagination) para más detalles                                                                                                 |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Crear correo SMTP saliente {#create-outbound-smtp-email}

Nuestra API para crear un correo está inspirada y aprovecha la configuración de opciones de mensaje de Nodemailer. Por favor, consulte la [configuración de mensaje de Nodemailer](https://nodemailer.com/message/) para todos los parámetros del cuerpo a continuación.

Tenga en cuenta que, con la excepción de `envelope` y `dkim` (ya que los configuramos automáticamente por usted), soportamos todas las opciones de Nodemailer. Automáticamente configuramos las opciones `disableFileAccess` y `disableUrlAccess` a `true` por razones de seguridad.

Debe pasar la opción única `raw` con su correo completo en bruto incluyendo encabezados **o** pasar las opciones individuales de parámetros del cuerpo a continuación.

Este endpoint de la API codificará automáticamente los emojis si se encuentran en los encabezados (por ejemplo, una línea de asunto `Subject: 🤓 Hello` se convierte automáticamente en `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Nuestro objetivo fue crear una API de correo extremadamente amigable para desarrolladores y a prueba de errores.

**Autenticación:** Este endpoint soporta tanto [autenticación con token API](#api-token-authentication-recommended-for-most-endpoints) como [autenticación con credenciales de alias](#alias-credentials-authentication-for-outbound-email). Consulte la sección [Autenticación](#authentication) arriba para más detalles.

> `POST /v1/emails`

| Parámetro del cuerpo | Obligatorio | Tipo             | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ----------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`               | No          | String (Email)   | La dirección de correo del remitente (debe existir como un alias del dominio).                                                                                                                                                                                                                                                                                                                                                                                  |
| `to`                 | No          | String o Array   | Lista separada por comas o un Array de destinatarios para el encabezado "To".                                                                                                                                                                                                                                                                                                                                                                                    |
| `cc`                 | No          | String o Array   | Lista separada por comas o un Array de destinatarios para el encabezado "Cc".                                                                                                                                                                                                                                                                                                                                                                                    |
| `bcc`                | No          | String o Array   | Lista separada por comas o un Array de destinatarios para el encabezado "Bcc".                                                                                                                                                                                                                                                                                                                                                                                   |
| `subject`            | No          | String           | El asunto del correo.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `text`               | No          | String o Buffer  | La versión en texto plano del mensaje.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `html`               | No          | String o Buffer  | La versión en HTML del mensaje.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `attachments`        | No          | Array            | Un array de objetos adjuntos (ver [campos comunes de Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                |
| `sender`             | No          | String           | La dirección de correo para el encabezado "Sender" (ver [campos más avanzados de Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                             |
| `replyTo`            | No          | String           | La dirección de correo para el encabezado "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                           |
| `inReplyTo`          | No          | String           | El Message-ID al que responde el mensaje.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`         | No          | String o Array   | Lista separada por espacios o un Array de Message-ID's.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `attachDataUrls`     | No          | Boolean          | Si es `true`, convierte imágenes `data:` en el contenido HTML del mensaje en adjuntos embebidos.                                                                                                                                                                                                                                                                                                                                                                |
| `watchHtml`          | No          | String           | Una versión HTML específica para Apple Watch del mensaje ([según la documentación de Nodemailer](https://nodemailer.com/message/#content-options]), los relojes más recientes no requieren que esto se establezca).                                                                                                                                                                                                                                               |
| `amp`                | No          | String           | Una versión HTML específica AMP4EMAIL del mensaje (ver [ejemplo de Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                   |
| `icalEvent`          | No          | Object           | Un evento iCalendar para usar como contenido alternativo del mensaje (ver [eventos de calendario de Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                               |
| `alternatives`       | No          | Array            | Un Array de contenido alternativo del mensaje (ver [contenido alternativo de Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                        |
| `encoding`           | No          | String           | Codificación para las cadenas de texto y HTML (por defecto `"utf-8"`, pero también soporta valores de codificación `"hex"` y `"base64"`).                                                                                                                                                                                                                                                                                                                       |
| `raw`                | No          | String o Buffer  | Un mensaje personalizado generado en formato RFC822 para usar (en lugar de uno generado por Nodemailer – ver [fuente personalizada de Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                             |
| `textEncoding`       | No          | String           | Codificación que se fuerza a usar para valores de texto (puede ser `"quoted-printable"` o `"base64"`). El valor por defecto es el valor más cercano detectado (para ASCII usar `"quoted-printable"`).                                                                                                                                                                                                                                                           |
| `priority`           | No          | String           | Nivel de prioridad para el correo (puede ser `"high"`, `"normal"` (por defecto), o `"low"`). Note que un valor de `"normal"` no establece un encabezado de prioridad (este es el comportamiento por defecto). Si se establece un valor de `"high"` o `"low"`, entonces los encabezados `X-Priority`, `X-MSMail-Priority` y `Importance` [se establecerán en consecuencia](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`            | No          | Object o Array   | Un objeto o un array de campos de encabezado adicionales para establecer (ver [encabezados personalizados de Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                        |
| `messageId`          | No          | String           | Un valor opcional de Message-ID para el encabezado "Message-ID" (se creará un valor por defecto automáticamente si no se establece – tenga en cuenta que el valor debe [cumplir con la especificación RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                          |
| `date`               | No          | String o Date    | Un valor opcional de Fecha que se usará si falta el encabezado Date después del análisis, de lo contrario se usará la cadena UTC actual si no se establece. El encabezado de fecha no puede ser más de 30 días en el futuro respecto al tiempo actual.                                                                                                                                                                                                          |
| `list`               | No          | Object           | Un objeto opcional de encabezados `List-*` (ver [encabezados de lista de Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                            |
> Solicitud de ejemplo (Token API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=prueba" \
  -d "text=prueba"
```

> Solicitud de ejemplo (Credenciales de alias):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=prueba" \
  -d "text=prueba"
```

> Solicitud de ejemplo (Correo electrónico en bruto):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Recuperar correo SMTP saliente {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Eliminar correo SMTP saliente {#delete-outbound-smtp-email}

La eliminación de correos establecerá el estado a `"rejected"` (y posteriormente no lo procesará en la cola) si y solo si el estado actual es uno de `"pending"`, `"queued"` o `"deferred"`. Podemos purgar correos automáticamente después de 30 días desde que fueron creados y/o enviados – por lo tanto, debe mantener una copia de los correos SMTP salientes en su cliente, base de datos o aplicación. Puede referenciar nuestro valor de ID de correo en su base de datos si lo desea – este valor se devuelve tanto en los endpoints de [Crear correo](#create-email) como de [Recuperar correo](#retrieve-email).

> `DELETE /v1/emails/:id`

> Solicitud de ejemplo:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Dominios {#domains}

> \[!TIP]
> Los endpoints de dominio con el nombre de dominio <code>/v1/domains/:domain_name</code> como su endpoint son intercambiables con el ID del dominio <code>:domain_id</code>. Esto significa que puede referirse al dominio por su <code>nombre</code> o <code>id</code>.

### Listar dominios {#list-domains}

> \[!NOTE]
> A partir del 1 de noviembre de 2024, los endpoints de API para [Listar dominios](#list-domains) y [Listar alias de dominio](#list-domain-aliases) tendrán un máximo predeterminado de `1000` resultados por página. Si desea optar por este comportamiento antes, puede pasar `?paginate=true` como un parámetro adicional en la cadena de consulta de la URL para la consulta del endpoint. Vea [Paginación](#pagination) para más detalles.

> `GET /v1/domains`

| Parámetro de consulta | Obligatorio | Tipo                      | Descripción                                                                                                                                      |
| --------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No          | Cadena (RegExp soportado) | Buscar dominios por nombre                                                                                                                       |
| `name`                | No          | Cadena (RegExp soportado) | Buscar dominios por nombre                                                                                                                       |
| `sort`                | No          | Cadena                    | Ordenar por un campo específico (prefijar con un guion simple `-` para ordenar en dirección inversa de ese campo). Por defecto es `created_at` si no se establece. |
| `page`                | No          | Número                    | Ver [Paginación](#pagination) para más detalles                                                                                                 |
| `limit`               | No          | Número                    | Ver [Paginación](#pagination) para más detalles                                                                                                 |

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Crear dominio {#create-domain}

> `POST /v1/domains`

| Parámetro en el cuerpo         | Obligatorio | Tipo                                          | Descripción                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | ----------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Sí          | Cadena (FQDN o IP)                           | Nombre de dominio completamente calificado ("FQDN") o dirección IP                                                                                                                                                                                                                                                   |
| `team_domain`                  | No          | Cadena (ID de dominio o nombre de dominio; FQDN) | Asignar automáticamente este dominio al mismo equipo que otro dominio. Esto significa que todos los miembros de este dominio serán asignados como miembros del equipo, y el `plan` se establecerá automáticamente en `team`. Puede establecer esto en `"none"` si es necesario para deshabilitarlo explícitamente, aunque no es necesario. |
| `plan`                         | No          | Cadena (enumerable)                           | Tipo de plan (debe ser `"free"`, `"enhanced_protection"` o `"team"`, por defecto `"free"` o el plan pagado actual del usuario si tiene uno)                                                                                                                                                                         |
| `catchall`                     | No          | Cadena (direcciones de correo delimitadas) o Booleano | Crear un alias catch-all predeterminado, por defecto `true` (si es `true` usará la dirección de correo del usuario API como destinatario, y si es `false` no se creará catch-all). Si se pasa una cadena, es una lista delimitada de direcciones de correo para usar como destinatarios (separadas por salto de línea, espacio y/o coma) |
| `has_adult_content_protection` | No          | Booleano                                       | Si se habilita la protección de contenido adulto del Escáner de Spam en este dominio                                                                                                                                                                                                                                  |
| `has_phishing_protection`      | No          | Booleano                                       | Si se habilita la protección contra phishing del Escáner de Spam en este dominio                                                                                                                                                                                                                                       |
| `has_executable_protection`    | No          | Booleano                                       | Si se habilita la protección contra ejecutables del Escáner de Spam en este dominio                                                                                                                                                                                                                                   |
| `has_virus_protection`         | No          | Booleano                                       | Si se habilita la protección contra virus del Escáner de Spam en este dominio                                                                                                                                                                                                                                         |
| `has_recipient_verification`   | No          | Booleano                                       | Valor predeterminado global del dominio para si se requiere que los destinatarios de alias hagan clic en un enlace de verificación de correo para que los correos fluyan                                                                                                                                             |
| `ignore_mx_check`              | No          | Booleano                                       | Si se ignora la verificación del registro MX en el dominio para la verificación. Esto es principalmente para usuarios que tienen reglas avanzadas de configuración de intercambio MX y necesitan mantener su intercambio MX existente y reenviar al nuestro.                                                        |
| `retention_days`               | No          | Número                                        | Entero entre `0` y `30` que corresponde al número de días de retención para almacenar correos SMTP salientes una vez entregados con éxito o con error permanente. Por defecto es `0`, lo que significa que los correos SMTP salientes se purgan y redactan inmediatamente por su seguridad.                            |
| `bounce_webhook`               | No          | Cadena (URL) o Booleano (false)               | La URL webhook `http://` o `https://` de su elección para enviar webhooks de rebote. Enviaremos una solicitud `POST` a esta URL con información sobre fallos SMTP salientes (por ejemplo, fallos suaves o duros – para que pueda gestionar sus suscriptores y administrar programáticamente su correo saliente).          |
| `max_quota_per_alias`          | No          | Cadena                                        | Cuota máxima de almacenamiento para alias en este nombre de dominio. Ingrese un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                          |
> Solicitud de ejemplo:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Recuperar dominio {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verificar registros del dominio {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verificar registros SMTP del dominio {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Listar contraseñas catch-all a nivel de dominio {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Crear contraseña catch-all a nivel de dominio {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parámetro en el cuerpo | Obligatorio | Tipo   | Descripción                                                                                                                                                                                                                  |
| --------------------- | ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`        | No          | String | Su nueva contraseña personalizada para usar como contraseña catch-all a nivel de dominio. Tenga en cuenta que puede dejar este campo en blanco o ausente en el cuerpo de su solicitud API si desea obtener una contraseña fuerte generada aleatoriamente.  Las contraseñas personalizadas para el buzón deben tener 128 caracteres o menos, no pueden comenzar ni terminar con espacios en blanco y no pueden contener comillas ni apóstrofes. Las contraseñas catch-all son solo para envío SMTP. Para IMAP, POP3, CalDAV, CardDAV y acceso al buzón, genera una contraseña para el alias específico en su lugar. |
| `description`         | No          | String | Descripción solo para fines organizativos.                                                                                                                                                                                  |

> Solicitud de ejemplo:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Eliminar contraseña catch-all a nivel de dominio {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Solicitud de ejemplo:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Actualizar dominio {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parámetro en el cuerpo          | Obligatorio | Tipo                            | Descripción                                                                                                                                                                                                                                                                                  |
| ------------------------------ | ----------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | No          | String o Número                 | Puerto personalizado para configurar el reenvío SMTP (el valor predeterminado es `"25"`)                                                                                                                                                                                                   |
| `has_adult_content_protection` | No          | Boolean                        | Si se debe habilitar la protección de contenido para adultos del Escáner de Spam en este dominio                                                                                                                                                                                          |
| `has_phishing_protection`      | No          | Boolean                        | Si se debe habilitar la protección contra phishing del Escáner de Spam en este dominio                                                                                                                                                                                                      |
| `has_executable_protection`    | No          | Boolean                        | Si se debe habilitar la protección contra ejecutables del Escáner de Spam en este dominio                                                                                                                                                                                                  |
| `has_virus_protection`         | No          | Boolean                        | Si se debe habilitar la protección contra virus del Escáner de Spam en este dominio                                                                                                                                                                                                         |
| `has_recipient_verification`   | No          | Boolean                        | Valor predeterminado global del dominio para si se requiere que los destinatarios de alias hagan clic en un enlace de verificación de correo electrónico para que los correos fluyan                                                                                                                                             |
| `ignore_mx_check`              | No          | Boolean                        | Si se debe ignorar la verificación del registro MX en el dominio para la verificación. Esto es principalmente para usuarios que tienen reglas avanzadas de configuración de intercambio MX y necesitan mantener su intercambio MX existente y reenviar al nuestro.                        |
| `retention_days`               | No          | Número                         | Entero entre `0` y `30` que corresponde al número de días de retención para almacenar correos SMTP salientes una vez entregados con éxito o con error permanente. El valor predeterminado es `0`, lo que significa que los correos SMTP salientes se eliminan y redactan inmediatamente por seguridad. |
| `bounce_webhook`               | No          | String (URL) o Boolean (false) | La URL webhook `http://` o `https://` de su elección para enviar webhooks de rebote. Enviaremos una solicitud `POST` a esta URL con información sobre fallos SMTP salientes (por ejemplo, fallos suaves o duros, para que pueda gestionar sus suscriptores y administrar programáticamente su correo saliente). |
| `max_quota_per_alias`          | No          | String                         | Cuota máxima de almacenamiento para alias en este nombre de dominio. Ingrese un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js).                                                                                                               |
> Solicitud de ejemplo:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Eliminar dominio {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Solicitud de ejemplo:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Invitaciones {#invites}

### Aceptar invitación de dominio {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Crear invitación de dominio {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parámetro en el cuerpo | Obligatorio | Tipo                | Descripción                                                                               |
| --------------------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`               | Sí          | String (Email)      | Dirección de correo electrónico para invitar a la lista de miembros del dominio          |
| `group`               | Sí          | String (enumerable) | Grupo al que se añadirá el usuario en la membresía del dominio (puede ser `"admin"` o `"user"`) |

> Solicitud de ejemplo:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Si el usuario invitado ya es miembro aceptado de otros dominios de los que el administrador que lo invita también es miembro, entonces la invitación se aceptará automáticamente y no se enviará un correo electrónico.

### Eliminar invitación de dominio {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parámetro en el cuerpo | Obligatorio | Tipo           | Descripción                                      |
| --------------------- | ----------- | -------------- | ------------------------------------------------ |
| `email`               | Sí          | String (Email) | Dirección de correo electrónico para eliminar de la lista de miembros del dominio |

> Solicitud de ejemplo:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Miembros {#members}

### Actualizar miembro del dominio {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parámetro en el cuerpo | Obligatorio | Tipo                | Descripción                                                                                  |
| --------------------- | ----------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group`               | Sí          | String (enumerable) | Grupo al que se actualizará el usuario en la membresía del dominio (puede ser `"admin"` o `"user"`) |

> Solicitud de ejemplo:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Eliminar miembro del dominio {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Solicitud de ejemplo:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Alias {#aliases}

### Generar una contraseña para alias {#generate-an-alias-password}

Tenga en cuenta que si no envía instrucciones por correo electrónico, entonces el nombre de usuario y la contraseña estarán en el cuerpo de la respuesta JSON de una solicitud exitosa en el formato `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parámetro en el cuerpo  | Obligatorio | Tipo    | Descripción                                                                                                                                                                                                                                                                                         |
| ---------------------- | ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | No          | String  | Su nueva contraseña personalizada para usar con el alias. Tenga en cuenta que puede dejar este campo vacío o no incluirlo en absoluto en el cuerpo de su solicitud API si desea obtener una contraseña generada aleatoriamente y segura.                                                                                                     Las contraseñas personalizadas para el buzón deben tener 128 caracteres o menos, no pueden comenzar ni terminar con espacios en blanco y no pueden contener comillas ni apóstrofes. |
| `password`             | No          | String  | Contraseña existente del alias para cambiar la contraseña sin eliminar el almacenamiento IMAP existente (vea la opción `is_override` abajo si ya no tiene la contraseña existente).                                                                                                                 |
| `is_override`          | No          | Boolean | **USAR CON PRECAUCIÓN**: Esto sobrescribirá completamente la contraseña y la base de datos del alias existente, y eliminará permanentemente el almacenamiento IMAP existente y restablecerá completamente la base de datos de correo electrónico SQLite del alias. Por favor, haga una copia de seguridad si es posible si tiene un buzón existente asociado a este alias. |
| `emailed_instructions` | No          | String  | Dirección de correo electrónico a la que se enviarán la contraseña del alias y las instrucciones de configuración.                                                                                                                                                                                                                                |
> Ejemplo de solicitud:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Listar alias de dominio {#list-domain-aliases}

> \[!NOTE]
> A partir del 1 de noviembre de 2024, los endpoints de la API para [Listar dominios](#list-domains) y [Listar alias de dominio](#list-domain-aliases) tendrán por defecto un máximo de `1000` resultados por página. Si desea optar por este comportamiento antes, puede pasar `?paginate=true` como un parámetro adicional en la cadena de consulta de la URL para la consulta del endpoint. Vea [Paginación](#pagination) para más detalles.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parámetro de consulta | Obligatorio | Tipo                      | Descripción                                                                                                                                      |
| --------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No          | String (RegExp soportado) | Buscar alias en un dominio por nombre, etiqueta o destinatario                                                                                   |
| `name`                | No          | String (RegExp soportado) | Buscar alias en un dominio por nombre                                                                                                           |
| `recipient`           | No          | String (RegExp soportado) | Buscar alias en un dominio por destinatario                                                                                                     |
| `sort`                | No          | String                    | Ordenar por un campo específico (prefijar con un guion simple `-` para ordenar en dirección inversa a ese campo). Por defecto es `created_at` si no se establece. |
| `page`                | No          | Número                    | Ver [Paginación](#pagination) para más detalles                                                                                                |
| `limit`               | No          | Número                    | Ver [Paginación](#pagination) para más detalles                                                                                                |

> Ejemplo de solicitud:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Crear nuevo alias de dominio {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parámetro en el cuerpo         | Obligatorio | Tipo                                   | Descripción                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | No          | String                               | Nombre del alias (si no se proporciona o está vacío, se genera un alias aleatorio)                                                                                                                                                                                                                                                                                                          |
| `recipients`                  | No          | String o Array                      | Lista de destinatarios (debe ser un String separado por saltos de línea/espacios/comas o un Array de direcciones de correo válidas, nombres de dominio completamente calificados ("FQDN"), direcciones IP y/o URLs de webhook – y si no se proporciona o es un Array vacío, se establecerá el correo del usuario que realiza la solicitud API como destinatario)                                                                                     |
| `description`                 | No          | String                               | Descripción del alias                                                                                                                                                                                                                                                                                                                                                                       |
| `labels`                      | No          | String o Array                      | Lista de etiquetas (debe ser un String separado por saltos de línea/espacios/comas o un Array)                                                                                                                                                                                                                                                                                             |
| `has_recipient_verification`  | No          | Boolean                              | Requerir que los destinatarios hagan clic en un enlace de verificación por correo para que los emails se transmitan (por defecto usa la configuración del dominio si no se establece explícitamente en el cuerpo de la solicitud)                                                                                                                                                              |
| `is_enabled`                  | No          | Boolean                              | Indica si se habilita o deshabilita este alias (si está deshabilitado, los correos no se enrutarán a ningún lado pero devolverán códigos de estado exitosos). Si se pasa un valor, se convierte a booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`      | No          | Número (puede ser `250`, `421` o `550`) | El correo entrante a este alias será rechazado si `is_enabled` es `false` con código `250` (entrega silenciosa a ningún lado, por ejemplo agujero negro o `/dev/null`), `421` (rechazo temporal; y reintento por hasta ~5 días) o `550` (fallo permanente y rechazo). Por defecto es `250`.                                                                                                                               |
| `has_imap`                    | No          | Boolean                              | Indica si se habilita o deshabilita el almacenamiento IMAP para este alias (si está deshabilitado, los correos entrantes no se almacenarán en [almacenamiento IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Si se pasa un valor, se convierte a booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                     | No          | Boolean                              | Indica si se habilita o deshabilita la [encriptación OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para el [almacenamiento de correo cifrado IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) usando la `public_key` del alias.                                                                                                         |
| `public_key`                  | No          | String                               | Clave pública OpenPGP en formato ASCII Armor ([haga clic aquí para ver un ejemplo](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); por ejemplo clave GPG para `support@forwardemail.net`). Esto solo aplica si tiene `has_pgp` configurado en `true`. [Aprenda más sobre cifrado de extremo a extremo en nuestro FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | No          | String                               | Cuota máxima de almacenamiento para este alias. Dejar en blanco para restablecer a la cuota máxima actual del dominio o ingresar un valor como "1 GB" que será interpretado por [bytes](https://github.com/visionmedia/bytes.js). Este valor solo puede ser ajustado por administradores del dominio.                                                                                                                                      |
| `vacation_responder_is_enabled` | No        | Boolean                              | Indica si se habilita o deshabilita un contestador automático de vacaciones.                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | No        | String                               | Fecha de inicio para el contestador de vacaciones (si está habilitado y no se establece fecha de inicio aquí, se asume que ya está iniciado). Soportamos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros formatos mediante análisis inteligente usando `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date` | No          | String                               | Fecha de fin para el contestador de vacaciones (si está habilitado y no se establece fecha de fin aquí, se asume que nunca termina y responde para siempre). Soportamos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros formatos mediante análisis inteligente usando `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`  | No          | String                               | Asunto en texto plano para el contestador de vacaciones, por ejemplo "Fuera de la oficina". Usamos `striptags` para eliminar todo HTML aquí.                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`  | No          | String                               | Mensaje en texto plano para el contestador de vacaciones, por ejemplo "Estaré fuera de la oficina hasta febrero.". Usamos `striptags` para eliminar todo HTML aquí.                                                                                                                                                                                                                                               |
> Solicitud de ejemplo:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Recuperar alias de dominio {#retrieve-domain-alias}

Puedes recuperar un alias de dominio ya sea por su valor `id` o por su valor `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Solicitud de ejemplo:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Actualizar alias de dominio {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parámetro del cuerpo            | Requerido | Tipo                                   | Descripción                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | No       | String                                 | Nombre del alias                                                                                                                                                                                                                                                                                                                                                                            |
| `recipients`                    | No       | String o Array                        | Lista de destinatarios (debe ser una cadena separada por saltos de línea/espacios/comas o un Array de direcciones de correo electrónico válidas, nombres de dominio completamente calificados ("FQDN"), direcciones IP y/o URLs de webhook)                                                                                                                                                   |
| `description`                   | No       | String                                 | Descripción del alias                                                                                                                                                                                                                                                                                                                                                                       |
| `labels`                        | No       | String o Array                        | Lista de etiquetas (debe ser una cadena separada por saltos de línea/espacios/comas o un Array)                                                                                                                                                                                                                                                                                             |
| `has_recipient_verification`    | No       | Boolean                                | Requiere que los destinatarios hagan clic en un enlace de verificación por correo electrónico para que los correos fluyan (por defecto usa la configuración del dominio si no se establece explícitamente en el cuerpo de la solicitud)                                                                                                                                                        |
| `is_enabled`                    | No       | Boolean                                | Indica si se habilita o deshabilita este alias (si está deshabilitado, los correos no se enrutarán a ningún lado pero devolverán códigos de estado exitosos). Si se pasa un valor, se convierte a booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                           |
| `error_code_if_disabled`        | No       | Número (ya sea `250`, `421` o `550`) | El correo entrante a este alias será rechazado si `is_enabled` es `false` con `250` (entrega silenciosa a ningún lado, por ejemplo agujero negro o `/dev/null`), `421` (rechazo temporal; y reintento por hasta ~5 días) o `550` fallo permanente y rechazo. Por defecto es `250`.                                                                                                           |
| `has_imap`                      | No       | Boolean                                | Indica si se habilita o deshabilita el almacenamiento IMAP para este alias (si está deshabilitado, los correos entrantes no se almacenarán en el [almacenamiento IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Si se pasa un valor, se convierte a booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                  |
| `has_pgp`                       | No       | Boolean                                | Indica si se habilita o deshabilita la [encriptación OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para el [almacenamiento de correo cifrado IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) usando la `public_key` del alias.                                                                                   |
| `public_key`                    | No       | String                                 | Clave pública OpenPGP en formato ASCII Armor ([haz clic aquí para ver un ejemplo](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); por ejemplo clave GPG para `support@forwardemail.net`). Esto solo aplica si tienes `has_pgp` configurado en `true`. [Aprende más sobre cifrado de extremo a extremo en nuestro FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | No       | String                                 | Cuota máxima de almacenamiento para este alias. Déjalo en blanco para restablecer a la cuota máxima actual del dominio o ingresa un valor como "1 GB" que será analizado por [bytes](https://github.com/visionmedia/bytes.js). Este valor solo puede ser ajustado por administradores del dominio.                                                                                         |
| `vacation_responder_is_enabled` | No       | Boolean                                | Indica si se habilita o deshabilita un contestador automático de vacaciones.                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | No       | String                                 | Fecha de inicio para el contestador de vacaciones (si está habilitado y no se establece fecha de inicio aquí, se asume que ya ha comenzado). Soportamos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros formatos mediante análisis inteligente usando `dayjs`.                                                                                                                   |
| `vacation_responder_end_date`   | No       | String                                 | Fecha de fin para el contestador de vacaciones (si está habilitado y no se establece fecha de fin aquí, se asume que nunca termina y responde para siempre). Soportamos formatos de fecha como `MM/DD/YYYY`, `YYYY-MM-DD` y otros formatos mediante análisis inteligente usando `dayjs`.                                                                                                   |
| `vacation_responder_subject`    | No       | String                                 | Asunto en texto plano para el contestador de vacaciones, por ejemplo "Fuera de la oficina". Usamos `striptags` para eliminar todo HTML aquí.                                                                                                                                                                                                                                             |
| `vacation_responder_message`    | No       | String                                 | Mensaje en texto plano para el contestador de vacaciones, por ejemplo "Estaré fuera de la oficina hasta febrero.". Usamos `striptags` para eliminar todo HTML aquí.                                                                                                                                                                                                                         |
> Solicitud de ejemplo:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Eliminar alias de dominio {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Solicitud de ejemplo:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Encriptar {#encrypt}

Permitimos que encripte registros incluso en el plan gratuito sin costo alguno. La privacidad no debería ser una característica, debería estar inherentemente integrada en todos los aspectos de un producto. Como se solicitó mucho en una [discusión de Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) y en [nuestros issues de GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) lo hemos añadido.

### Encriptar registro TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parámetro del cuerpo | Obligatorio | Tipo   | Descripción                                  |
| -------------------- | ----------- | ------ | -------------------------------------------- |
| `input`              | Sí          | String | Cualquier registro TXT de texto plano válido de Forward Email |

> Solicitud de ejemplo:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
