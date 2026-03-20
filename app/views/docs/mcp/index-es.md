# Servidor MCP de Reenvío de Email {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Servidor MCP de Reenvío de Email" class="rounded-lg" />

<p class="lead mt-3">
  <strong>Resumen:</strong> Nuestro <a href="https://github.com/forwardemail/mcp-server">servidor MCP de código abierto</a> permite que asistentes de IA como Claude, ChatGPT, Cursor y Windsurf gestionen tu correo electrónico, dominios, alias, contactos y calendarios mediante lenguaje natural. Los 68 endpoints de la API están expuestos como herramientas MCP. Se ejecuta localmente vía <code>npx @forwardemail/mcp-server</code> — tus credenciales nunca salen de tu máquina.
</p>


## Tabla de Contenidos {#table-of-contents}

* [¿Qué es MCP?](#what-is-mcp)
* [Inicio Rápido](#quick-start)
  * [Obtener una Clave API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Otros Clientes MCP](#other-mcp-clients)
* [Autenticación](#authentication)
  * [Autenticación con Clave API](#api-key-auth)
  * [Autenticación con Alias](#alias-auth)
  * [Generar una Contraseña para Alias](#generating-an-alias-password)
* [Las 68 Herramientas](#all-68-tools)
  * [Cuenta (Clave API o Autenticación con Alias)](#account-api-key-or-alias-auth)
  * [Dominios (Clave API)](#domains-api-key)
  * [Alias (Clave API)](#aliases-api-key)
  * [Emails — SMTP Saliente (Clave API; Send soporta ambos)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Mensajes — IMAP (Autenticación con Alias)](#messages--imap-alias-auth)
  * [Carpetas — IMAP (Autenticación con Alias)](#folders--imap-alias-auth)
  * [Contactos — CardDAV (Autenticación con Alias)](#contacts--carddav-alias-auth)
  * [Calendarios — CalDAV (Autenticación con Alias)](#calendars--caldav-alias-auth)
  * [Eventos de Calendario — CalDAV (Autenticación con Alias)](#calendar-events--caldav-alias-auth)
  * [Scripts Sieve (Clave API)](#sieve-scripts-api-key)
  * [Scripts Sieve (Autenticación con Alias)](#sieve-scripts-alias-auth)
  * [Miembros e Invitaciones de Dominio (Clave API)](#domain-members-and-invites-api-key)
  * [Contraseñas Catch-All (Clave API)](#catch-all-passwords-api-key)
  * [Registros (Clave API)](#logs-api-key)
  * [Encriptar (Sin Autenticación)](#encrypt-no-auth)
* [20 Casos de Uso Reales](#20-real-world-use-cases)
  * [1. Clasificación de Email](#1-email-triage)
  * [2. Automatización de Configuración de Dominio](#2-domain-setup-automation)
  * [3. Gestión Masiva de Alias](#3-bulk-alias-management)
  * [4. Monitoreo de Campañas de Email](#4-email-campaign-monitoring)
  * [5. Sincronización y Limpieza de Contactos](#5-contact-sync-and-cleanup)
  * [6. Gestión de Calendarios](#6-calendar-management)
  * [7. Automatización de Scripts Sieve](#7-sieve-script-automation)
  * [8. Incorporación de Equipo](#8-team-onboarding)
  * [9. Auditoría de Seguridad](#9-security-auditing)
  * [10. Configuración de Reenvío de Email](#10-email-forwarding-setup)
  * [11. Búsqueda y Análisis de Bandeja de Entrada](#11-inbox-search-and-analysis)
  * [12. Organización de Carpetas](#12-folder-organization)
  * [13. Rotación de Contraseñas](#13-password-rotation)
  * [14. Encriptación de Registros DNS](#14-dns-record-encryption)
  * [15. Análisis de Registros de Entrega](#15-delivery-log-analysis)
  * [16. Gestión Multi-Dominio](#16-multi-domain-management)
  * [17. Configuración Catch-All](#17-catch-all-configuration)
  * [18. Gestión de Invitaciones de Dominio](#18-domain-invite-management)
  * [19. Pruebas de Almacenamiento S3](#19-s3-storage-testing)
  * [20. Composición de Borradores de Email](#20-email-draft-composition)
* [Ejemplos de Prompts](#example-prompts)
* [Variables de Entorno](#environment-variables)
* [Seguridad](#security)
* [Uso Programático](#programmatic-usage)
* [Código Abierto](#open-source)


## ¿Qué es MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) es un estándar abierto creado por Anthropic que permite a los modelos de IA llamar de forma segura a herramientas externas. En lugar de copiar y pegar respuestas de API en una ventana de chat, MCP da al modelo acceso directo y estructurado a tus servicios.

Nuestro servidor MCP envuelve toda la [API de Forward Email](/email-api) — cada endpoint, cada parámetro — y los expone como herramientas que cualquier cliente compatible con MCP puede usar. El servidor se ejecuta localmente en tu máquina usando transporte stdio. Tus credenciales permanecen en tus variables de entorno y nunca se envían al modelo de IA.


## Inicio Rápido {#quick-start}

### Obtener una Clave API {#get-an-api-key}
1. Inicia sesión en tu [cuenta de Forward Email](/my-account/domains).
2. Ve a **Mi Cuenta** → **Seguridad** → **Claves API**.
3. Genera una nueva clave API y cópiala.

### Claude Desktop {#claude-desktop}

Agrega esto a tu archivo de configuración de Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Reinicia Claude Desktop. Deberías ver las herramientas de Forward Email en el selector de herramientas.

> **Nota:** Las variables `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD` son opcionales pero requeridas para las herramientas de buzón (mensajes, carpetas, contactos, calendarios). Consulta [Autenticación](#authentication) para más detalles.

### Cursor {#cursor}

Abre Configuración de Cursor → MCP → Agregar Servidor:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Abre Configuración de Windsurf → MCP → Agregar Servidor con la misma configuración que arriba.

### Otros Clientes MCP {#other-mcp-clients}

Cualquier cliente que soporte el transporte MCP stdio funcionará. El comando es:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autenticación {#authentication}

La API de Forward Email usa **autenticación HTTP Basic** con dos tipos diferentes de credenciales dependiendo del endpoint. El servidor MCP maneja esto automáticamente — solo necesitas proporcionar las credenciales correctas.

### Autenticación con Clave API {#api-key-auth}

La mayoría de los endpoints de gestión (dominios, alias, correos salientes, registros) usan tu **clave API** como nombre de usuario en la autenticación Basic con una contraseña vacía.

Esta es la misma clave API que usas para la API REST. Configúrala mediante la variable de entorno `FORWARD_EMAIL_API_KEY`.

### Autenticación con Alias {#alias-auth}

Los endpoints de buzón (mensajes, carpetas, contactos, calendarios, scripts sieve con alcance alias) usan **credenciales de alias** — la dirección de correo del alias como nombre de usuario y una contraseña generada como contraseña.

Estos endpoints acceden a datos por alias vía protocolos IMAP, CalDAV y CardDAV. Requieren el correo del alias y una contraseña generada, no la clave API.

Puedes proporcionar credenciales de alias de dos maneras:

1. **Variables de entorno** (recomendado para alias por defecto): Configura `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parámetros por llamada a herramienta**: Pasa `alias_username` y `alias_password` como argumentos a cualquier herramienta con autenticación de alias. Estos sobreescriben las variables de entorno, lo cual es útil cuando trabajas con múltiples alias.

### Generar una Contraseña para Alias {#generating-an-alias-password}

Antes de poder usar herramientas con autenticación de alias, necesitas generar una contraseña para el alias. Puedes hacerlo con la herramienta `generateAliasPassword` o vía la API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

La respuesta incluye los campos `username` (correo del alias) y `password`. Usa estos como tus credenciales de alias.

> **Consejo:** También puedes pedirle a tu asistente de IA: *"Genera una contraseña para el alias <user@example.com> en el dominio example.com"* — llamará a la herramienta `generateAliasPassword` y devolverá las credenciales.

La siguiente tabla resume qué método de autenticación requiere cada grupo de herramientas:

| Grupo de Herramientas                                          | Método de Autenticación    | Credenciales                                               |
| ------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Cuenta                                                        | Clave API **o** Alias Auth | Cualquiera                                                |
| Dominios, Alias, Miembros de Dominio, Invitaciones, Contraseñas Catch-All | Clave API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Correos Salientes (listar, obtener, eliminar, límite)         | Clave API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Enviar Correo                                                | Clave API **o** Alias Auth | Cualquiera                                                |
| Mensajes (IMAP)                                              | Alias Auth                  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Carpetas (IMAP)                                              | Alias Auth                  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contactos (CardDAV)                                          | Alias Auth                  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendarios (CalDAV)                                         | Alias Auth                  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Eventos de Calendario (CalDAV)                              | Alias Auth                  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Scripts Sieve (alcance dominio)                             | Clave API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Scripts Sieve (alcance alias)                               | Alias Auth                  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Registros                                                   | Clave API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Encriptar                                                  | Ninguno                    | No se requieren credenciales                               |
## Todas las 68 Herramientas {#all-68-tools}

Cada herramienta se corresponde directamente con un endpoint de la [Forward Email API](/email-api). Los parámetros usan los mismos nombres que la documentación de la API. El método de autenticación se indica en el encabezado de cada sección.

### Cuenta (Autenticación con API Key o Alias) {#account-api-key-or-alias-auth}

Con autenticación por API key, estas devuelven la información de tu cuenta de usuario. Con autenticación por alias, devuelven información del alias/buzón incluyendo cuota de almacenamiento y configuraciones.

| Herramienta      | Endpoint API       | Descripción                  |
| ---------------  | ------------------ | ---------------------------- |
| `getAccount`     | `GET /v1/account`  | Obtener la información de tu cuenta |
| `updateAccount`  | `PUT /v1/account`  | Actualizar la configuración de tu cuenta |

### Dominios (API Key) {#domains-api-key}

| Herramienta           | Endpoint API                                      | Descripción               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Listar todos tus dominios |
| `createDomain`        | `POST /v1/domains`                               | Añadir un nuevo dominio   |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Obtener detalles del dominio |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Actualizar configuración del dominio |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Eliminar un dominio       |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verificar registros DNS   |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verificar configuración SMTP |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Probar almacenamiento S3 personalizado |

### Alias (API Key) {#aliases-api-key}

| Herramienta               | Endpoint API                                                      | Descripción                                |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`            | `GET /v1/domains/:domain_id/aliases`                              | Listar alias para un dominio                |
| `createAlias`            | `POST /v1/domains/:domain_id/aliases`                             | Crear un nuevo alias                        |
| `getAlias`               | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Obtener detalles del alias                  |
| `updateAlias`            | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Actualizar un alias                         |
| `deleteAlias`            | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Eliminar un alias                           |
| `generateAliasPassword`  | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generar contraseña IMAP/SMTP para autenticación por alias |

### Correos — SMTP Saliente (API Key; Send soporta ambos) {#emails--outbound-smtp-api-key-send-supports-both}

| Herramienta      | Endpoint API           | Autenticación          | Descripción                  |
| --------------- | ---------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`      | API Key o Alias Auth  | Enviar un correo vía SMTP    |
| `listEmails`    | `GET /v1/emails`       | API Key               | Listar correos salientes     |
| `getEmail`      | `GET /v1/emails/:id`   | API Key               | Obtener detalles y estado del correo |
| `deleteEmail`   | `DELETE /v1/emails/:id`| API Key               | Eliminar un correo en cola   |
| `getEmailLimit` | `GET /v1/emails/limit` | API Key               | Consultar tu límite de envío |

La herramienta `sendEmail` acepta `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` y `attachments`. Esto es igual que el endpoint `POST /v1/emails`.

### Mensajes — IMAP (Autenticación por Alias) {#messages--imap-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o configura las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Herramienta      | Punto de API              | Descripción                          |
| --------------- | ------------------------- | ----------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Listar y buscar mensajes en un buzón |
| `createMessage` | `POST /v1/messages`       | Crear un borrador o subir un mensaje |
| `getMessage`    | `GET /v1/messages/:id`    | Obtener un mensaje por ID           |
| `updateMessage` | `PUT /v1/messages/:id`    | Actualizar banderas (leído, destacado, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Eliminar un mensaje                 |

La herramienta `listMessages` soporta más de 15 parámetros de búsqueda incluyendo `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` y `has_attachment`. Consulta la [documentación de la API](/email-api) para la lista completa.

### Carpetas — IMAP (Autenticación Alias) {#folders--imap-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o configura las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta     | Punto de API             | Descripción              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Listar todas las carpetas del buzón |
| `createFolder` | `POST /v1/folders`       | Crear una nueva carpeta  |
| `getFolder`    | `GET /v1/folders/:id`    | Obtener detalles de la carpeta |
| `updateFolder` | `PUT /v1/folders/:id`    | Renombrar una carpeta    |
| `deleteFolder` | `DELETE /v1/folders/:id` | Eliminar una carpeta     |

### Contactos — CardDAV (Autenticación Alias) {#contacts--carddav-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o configura las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta      | Punto de API              | Descripción          |
| --------------- | ------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`        | Listar todos los contactos |
| `createContact` | `POST /v1/contacts`       | Crear un nuevo contacto |
| `getContact`    | `GET /v1/contacts/:id`    | Obtener detalles del contacto |
| `updateContact` | `PUT /v1/contacts/:id`    | Actualizar un contacto |
| `deleteContact` | `DELETE /v1/contacts/:id` | Eliminar un contacto  |

### Calendarios — CalDAV (Autenticación Alias) {#calendars--caldav-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o configura las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta       | Punto de API               | Descripción           |
| ---------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Listar todos los calendarios |
| `createCalendar` | `POST /v1/calendars`       | Crear un nuevo calendario |
| `getCalendar`    | `GET /v1/calendars/:id`    | Obtener detalles del calendario |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Actualizar un calendario |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Eliminar un calendario |

### Eventos de Calendario — CalDAV (Autenticación Alias) {#calendar-events--caldav-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o configura las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta            | Punto de API                     | Descripción        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Listar todos los eventos |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Crear un nuevo evento |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Obtener detalles del evento |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Actualizar un evento |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Eliminar un evento |

### Scripts Sieve (Clave API) {#sieve-scripts-api-key}

Estos usan rutas con ámbito de dominio y se autentican con tu clave API.

| Herramienta            | Punto de API                                                              | Descripción               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Listar scripts para un alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Crear un nuevo script       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Obtener detalles del script |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Actualizar un script        |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Eliminar un script          |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Activar un script           |
### Scripts Sieve (Autenticación de Alias) {#sieve-scripts-alias-auth}

Estos usan autenticación a nivel de alias. Útil para automatización por alias sin necesidad de la clave API.

> **Requiere credenciales de alias.** Pase `alias_username` y `alias_password` o configure las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta                   | Endpoint API                                | Descripción         |
| ---------------------------- | ------------------------------------------ | ------------------- |
| `listSieveScriptsAliasAuth`  | `GET /v1/sieve-scripts`                     | Listar scripts      |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts`                    | Crear un script     |
| `getSieveScriptAliasAuth`    | `GET /v1/sieve-scripts/:script_id`          | Obtener detalles del script |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id`          | Actualizar un script |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id`       | Eliminar un script  |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Activar un script   |

### Miembros e Invitaciones de Dominio (Clave API) {#domain-members-and-invites-api-key}

| Herramienta           | Endpoint API                                      | Descripción               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`   | Cambiar el rol de un miembro |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id`| Eliminar un miembro       |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`              | Aceptar una invitación pendiente |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`             | Invitar a alguien a un dominio |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`           | Revocar una invitación    |

### Contraseñas Catch-All (Clave API) {#catch-all-passwords-api-key}

| Herramienta               | Endpoint API                                                   | Descripción                |
| ------------------------ | -------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`               | Listar contraseñas catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`              | Crear una contraseña catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`  | Eliminar una contraseña catch-all |

### Registros (Clave API) {#logs-api-key}

| Herramienta     | Endpoint API             | Descripción                   |
| -------------- | ------------------------ | ----------------------------- |
| `downloadLogs` | `GET /v1/logs/download`  | Descargar registros de entrega de correo |

### Encriptar (Sin Autenticación) {#encrypt-no-auth}

| Herramienta      | Endpoint API       | Descripción                 |
| --------------- | ------------------ | --------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | Encriptar un registro DNS TXT |

Esta herramienta no requiere autenticación. Encripta registros de reenvío como `forward-email=user@example.com` para uso en registros DNS TXT.


## 20 Casos de Uso Reales {#20-real-world-use-cases}

Aquí hay formas prácticas de usar el servidor MCP con tu asistente de IA:

### 1. Clasificación de Correos {#1-email-triage}

Pídele a tu IA que escanee tu bandeja de entrada y resuma los mensajes no leídos. Puede marcar correos urgentes, categorizar por remitente y redactar respuestas — todo mediante lenguaje natural. *(Requiere credenciales de alias para acceso a la bandeja.)*

### 2. Automatización de Configuración de Dominio {#2-domain-setup-automation}

¿Configuras un dominio nuevo? Pídele a la IA que cree el dominio, agregue tus alias, verifique los registros DNS y pruebe la configuración SMTP. Lo que normalmente toma 10 minutos de clics en paneles se convierte en una sola conversación.

### 3. Gestión Masiva de Alias {#3-bulk-alias-management}

¿Necesitas crear 20 alias para un proyecto nuevo? Describe lo que necesitas y deja que la IA maneje el trabajo repetitivo. Puede crear alias, establecer reglas de reenvío y generar contraseñas de una sola vez.
### 4. Monitoreo de Campañas de Email {#4-email-campaign-monitoring}

Pídele a tu IA que revise los límites de envío, liste los correos salientes recientes y reporte el estado de la entrega. Útil para monitorear la salud del email transaccional.

### 5. Sincronización y Limpieza de Contactos {#5-contact-sync-and-cleanup}

Usa las herramientas CardDAV para listar todos los contactos, encontrar duplicados, actualizar información desactualizada o crear contactos en masa desde una hoja de cálculo que pegues en el chat. *(Requiere credenciales de alias.)*

### 6. Gestión de Calendario {#6-calendar-management}

Crea calendarios, añade eventos, actualiza horarios de reuniones y elimina eventos cancelados — todo mediante conversación. Las herramientas CalDAV soportan CRUD completo tanto en calendarios como en eventos. *(Requiere credenciales de alias.)*

### 7. Automatización de Scripts Sieve {#7-sieve-script-automation}

Los scripts Sieve son poderosos pero la sintaxis es arcaica. Pídele a tu IA que escriba scripts Sieve por ti: "Filtrar todos los correos de <billing@example.com> a una carpeta Facturación" se convierte en un script funcional sin tocar la especificación RFC 5228.

### 8. Incorporación de Equipo {#8-team-onboarding}

Cuando un nuevo miembro se une al equipo, pídele a la IA que cree su alias, genere una contraseña, le envíe un correo de bienvenida con sus credenciales y lo agregue como miembro del dominio. Un solo comando, cuatro llamadas a la API.

### 9. Auditoría de Seguridad {#9-security-auditing}

Pídele a tu IA que liste todos los dominios, revise el estado de verificación DNS, revise configuraciones de alias e identifique dominios con registros no verificados. Un barrido rápido de seguridad en lenguaje natural.

### 10. Configuración de Reenvío de Email {#10-email-forwarding-setup}

¿Configuras reenvío de email para un dominio nuevo? Pídele a la IA que cree el dominio, añada alias de reenvío, encripte los registros DNS y verifique que todo esté configurado correctamente.

### 11. Búsqueda y Análisis en la Bandeja de Entrada {#11-inbox-search-and-analysis}

Usa las herramientas de búsqueda de mensajes para encontrar correos específicos: "Encuentra todos los correos de <john@example.com> en los últimos 30 días que tengan archivos adjuntos." Los más de 15 parámetros de búsqueda hacen esto poderoso. *(Requiere credenciales de alias.)*

### 12. Organización de Carpetas {#12-folder-organization}

Pídele a tu IA que cree una estructura de carpetas para un nuevo proyecto, mueva mensajes entre carpetas o limpie carpetas antiguas que ya no necesites. *(Requiere credenciales de alias.)*

### 13. Rotación de Contraseñas {#13-password-rotation}

Genera nuevas contraseñas para alias según un calendario. Pídele a tu IA que genere una nueva contraseña para cada alias y reporte las nuevas credenciales.

### 14. Encriptación de Registros DNS {#14-dns-record-encryption}

Encripta tus registros de reenvío antes de agregarlos al DNS. La herramienta `encryptRecord` maneja esto sin autenticación — útil para encriptaciones rápidas puntuales.

### 15. Análisis de Logs de Entrega {#15-delivery-log-analysis}

Descarga tus logs de entrega de email y pídele a la IA que analice tasas de rebote, identifique destinatarios problemáticos o rastree tiempos de entrega.

### 16. Gestión Multi-Dominio {#16-multi-domain-management}

Si gestionas múltiples dominios, pídele a la IA que te dé un reporte de estado: qué dominios están verificados, cuáles tienen problemas, cuántos alias tiene cada uno y cómo son los límites de envío.

### 17. Configuración Catch-All {#17-catch-all-configuration}

Configura contraseñas catch-all para dominios que necesiten recibir correo en cualquier dirección. La IA puede crear, listar y gestionar estas contraseñas por ti.

### 18. Gestión de Invitaciones de Dominio {#18-domain-invite-management}

Invita a miembros del equipo a gestionar dominios, revisa invitaciones pendientes y limpia las expiradas. Útil para organizaciones con múltiples administradores de dominio.

### 19. Pruebas de Almacenamiento S3 {#19-s3-storage-testing}

Si usas almacenamiento S3 personalizado para respaldos de email, pídele a la IA que pruebe la conexión y verifique que funcione correctamente.

### 20. Composición de Borradores de Email {#20-email-draft-composition}

Crea borradores de correos en tu buzón sin enviarlos. Útil para preparar correos que necesitan revisión antes de enviar, o para construir plantillas de email. *(Requiere credenciales de alias.)*


## Ejemplos de Prompts {#example-prompts}

Aquí tienes prompts que puedes usar directamente con tu asistente IA:

**Enviar email:**

> "Envía un correo desde <hello@mydomain.com> a <john@example.com> con el asunto 'Reunión Mañana' y cuerpo 'Hola John, ¿seguimos a las 2pm?'"
**Gestión de dominios:**

> "Lista todos mis dominios y dime cuáles tienen registros DNS no verificados."

**Creación de alias:**

> "Crea un nuevo alias <support@mydomain.com> que reenvíe a mi correo personal."

**Búsqueda en la bandeja de entrada (requiere credenciales de alias):**

> "Encuentra todos los correos no leídos de la última semana que mencionen 'factura'."

**Calendario (requiere credenciales de alias):**

> "Crea un calendario llamado 'Trabajo' y añade una reunión para mañana a las 2pm llamada 'Reunión de equipo'."

**Scripts Sieve:**

> "Escribe un script Sieve para <info@mydomain.com> que responda automáticamente a los correos con 'Gracias por contactarnos, te responderemos en 24 horas.'"

**Operaciones masivas:**

> "Crea alias para sales@, support@, billing@ e info@ en mydomain.com, todos reenviando a <team@mydomain.com>."

**Chequeo de seguridad:**

> "Revisa el estado de verificación DNS y SMTP de todos mis dominios y dime si algo necesita atención."

**Generar contraseña para alias:**

> "Genera una contraseña para el alias <user@example.com> para que pueda acceder a mi bandeja de entrada."


## Variables de Entorno {#environment-variables}

| Variable                       | Requerido | Predeterminado                 | Descripción                                                                    |
| ------------------------------ | --------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Sí        | —                              | Tu clave API de Forward Email (usada como usuario de autenticación Basic para endpoints con clave API) |
| `FORWARD_EMAIL_ALIAS_USER`     | No        | —                              | Dirección de correo del alias para endpoints de buzón (ej. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | No        | —                              | Contraseña generada para el alias en endpoints de buzón                        |
| `FORWARD_EMAIL_API_URL`        | No        | `https://api.forwardemail.net` | URL base de la API (para autoalojamiento o pruebas)                            |


## Seguridad {#security}

El servidor MCP se ejecuta localmente en tu máquina. Así funciona la seguridad:

* **Tus credenciales permanecen locales.** Tanto tu clave API como las credenciales del alias se leen desde variables de entorno y se usan para autenticar solicitudes API vía autenticación HTTP Basic. Nunca se envían al modelo de IA.
* **Transporte stdio.** El servidor se comunica con el cliente IA a través de stdin/stdout. No se abren puertos de red.
* **Sin almacenamiento de datos.** El servidor es sin estado. No guarda, registra ni almacena ninguno de tus datos de correo.
* **Código abierto.** Todo el código está en [GitHub](https://github.com/forwardemail/mcp-server). Puedes auditar cada línea.


## Uso Programático {#programmatic-usage}

También puedes usar el servidor como una librería:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Código Abierto {#open-source}

El Forward Email MCP Server es [código abierto en GitHub](https://github.com/forwardemail/mcp-server) bajo la licencia BUSL-1.1. Creemos en la transparencia. Si encuentras un error o quieres una función, [abre un issue](https://github.com/forwardemail/mcp-server/issues).
