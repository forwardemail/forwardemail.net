# Servidor MCP de Forward Email

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Nuestro <a href="https://github.com/forwardemail/mcp-server">servidor MCP de código abierto</a> permite a asistentes de IA como Claude, ChatGPT, Cursor y Windsurf gestionar tu correo electrónico, dominios, alias, contactos y calendarios a través del lenguaje natural. Los 68 puntos finales de la API se exponen como herramientas MCP. Se ejecuta localmente a través de <code>npx @forwardemail/mcp-server</code> — tus credenciales nunca salen de tu máquina.
</p>

## Tabla de Contenidos

* [¿Qué es MCP?](#what-is-mcp)
* [Inicio rápido](#quick-start)
  * [Obtener una clave API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Otros clientes MCP](#other-mcp-clients)
* [Autenticación](#authentication)
  * [Autenticación con clave API](#api-key-auth)
  * [Autenticación con alias](#alias-auth)
  * [Generar una contraseña de alias](#generating-an-alias-password)
* [Las 68 herramientas](#all-68-tools)
  * [Cuenta (clave API o autenticación de alias)](#account-api-key-or-alias-auth)
  * [Dominios (clave API)](#domains-api-key)
  * [Alias (clave API)](#aliases-api-key)
  * [Correos electrónicos — SMTP saliente (clave API; Enviar admite ambos)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Mensajes — IMAP (autenticación de alias)](#messages--imap-alias-auth)
  * [Carpetas — IMAP (autenticación de alias)](#folders--imap-alias-auth)
  * [Contactos — CardDAV (autenticación de alias)](#contacts--carddav-alias-auth)
  * [Calendarios — CalDAV (autenticación de alias)](#calendars--caldav-alias-auth)
  * [Eventos de calendario — CalDAV (autenticación de alias)](#calendar-events--caldav-alias-auth)
  * [Scripts Sieve (clave API)](#sieve-scripts-api-key)
  * [Scripts Sieve (autenticación de alias)](#sieve-scripts-alias-auth)
  * [Miembros e invitaciones de dominio (clave API)](#domain-members-and-invites-api-key)
  * [Contraseñas comodín (clave API)](#catch-all-passwords-api-key)
  * [Registros (clave API)](#logs-api-key)
  * [Cifrar (sin autenticación)](#encrypt-no-auth)
* [20 casos de uso reales](#20-real-world-use-cases)
* [Ejemplos de prompts](#example-prompts)
* [Variables de entorno](#environment-variables)
* [Seguridad](#security)
* [Uso programático](#programmatic-usage)
* [Código abierto](#open-source)


## ¿Qué es MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) es un estándar abierto creado por Anthropic que permite a los modelos de IA llamar de forma segura a herramientas externas. En lugar de copiar y pegar respuestas de la API en una ventana de chat, MCP le da al modelo acceso directo y estructurado a tus servicios.

Nuestro servidor MCP envuelve toda la [API de Forward Email](/email-api) — cada punto final, cada parámetro — y los expone como herramientas que cualquier cliente compatible con MCP puede usar. El servidor se ejecuta localmente en tu máquina usando transporte stdio. Tus credenciales permanecen en tus variables de entorno y nunca se envían al modelo de IA.


## Inicio rápido {#quick-start}

### Obtener una clave API {#get-an-api-key}

1. Inicia sesión en tu [cuenta de Forward Email](/my-account/domains).
2. Ve a **Mi cuenta** → **Seguridad** → **Claves API**.
3. Genera una nueva clave API y cópiala.

### Claude Desktop {#claude-desktop}

Añade esto a tu archivo de configuración de Claude Desktop:

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

Abre la configuración de Cursor → MCP → Añadir servidor:

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

Abre la configuración de Windsurf → MCP → Añadir servidor con la misma configuración que la anterior.

### Otros clientes MCP {#other-mcp-clients}

Cualquier cliente que admita el transporte stdio de MCP funcionará. El comando es:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autenticación {#authentication}

La API de Forward Email utiliza **autenticación HTTP Basic** con dos tipos de credenciales diferentes según el punto final. El servidor MCP maneja esto automáticamente, solo necesitas proporcionar las credenciales correctas.

### Autenticación con clave API {#api-key-auth}

La mayoría de los puntos finales de gestión (dominios, alias, correos electrónicos salientes, registros) utilizan tu **clave API** como nombre de usuario de autenticación Basic con una contraseña vacía.

Esta es la misma clave API que usas para la API REST. Configúrala a través de la variable de entorno `FORWARD_EMAIL_API_KEY`.

### Autenticación con alias {#alias-auth}

Los puntos finales del buzón (mensajes, carpetas, contactos, calendarios, scripts Sieve con ámbito de alias) utilizan **credenciales de alias**: la dirección de correo electrónico del alias como nombre de usuario y una contraseña generada como contraseña.

Estos puntos finales acceden a datos por alias a través de los protocolos IMAP, CalDAV y CardDAV. Requieren el correo electrónico del alias y una contraseña generada, no la clave API.

Puedes proporcionar credenciales de alias de dos maneras:

1. **Variables de entorno** (recomendado para el alias predeterminado): Establece `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parámetros por llamada de herramienta**: Pasa `alias_username` y `alias_password` como argumentos a cualquier herramienta de autenticación de alias. Estos anulan las variables de entorno, lo cual es útil cuando se trabaja con múltiples alias.

### Generar una contraseña de alias {#generating-an-alias-password}

Antes de poder usar las herramientas de autenticación de alias, debes generar una contraseña para el alias. Puedes hacerlo con la herramienta `generateAliasPassword` o a través de la API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

La respuesta incluye los campos `username` (correo electrónico del alias) y `password`. Utilízalos como tus credenciales de alias.

> **Consejo:** También puedes preguntarle a tu asistente de IA: *"Genera una contraseña para el alias user@example.com en el dominio example.com"* — llamará a la herramienta `generateAliasPassword` y devolverá las credenciales.

La siguiente tabla resume qué método de autenticación requiere cada grupo de herramientas:

| Grupo de herramientas | Método de autenticación | Credenciales |
|-----------|-------------|-------------|
| Cuenta | Clave API **o** autenticación de alias | Cualquiera |
| Dominios, Alias, Miembros de dominio, Invitaciones, Contraseñas comodín | Clave API | `FORWARD_EMAIL_API_KEY` |
| Correos electrónicos salientes (listar, obtener, eliminar, limitar) | Clave API | `FORWARD_EMAIL_API_KEY` |
| Enviar correo electrónico | Clave API **o** autenticación de alias | Cualquiera |
| Mensajes (IMAP) | Autenticación de alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Carpetas (IMAP) | Autenticación de alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contactos (CardDAV) | Autenticación de alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendarios (CalDAV) | Autenticación de alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Eventos de calendario (CalDAV) | Autenticación de alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Scripts Sieve (ámbito de dominio) | Clave API | `FORWARD_EMAIL_API_KEY` |
| Scripts Sieve (ámbito de alias) | Autenticación de alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Registros | Clave API | `FORWARD_EMAIL_API_KEY` |
| Cifrar | Ninguno | No se necesitan credenciales |


## Las 68 herramientas {#all-68-tools}

Cada herramienta se asigna directamente a un punto final de la [API de Forward Email](/email-api). Los parámetros utilizan los mismos nombres que la documentación de la API. El método de autenticación se indica en el encabezado de cada sección.

### Cuenta (clave API o autenticación de alias) {#account-api-key-or-alias-auth}

Con la autenticación de clave API, estas devuelven la información de tu cuenta de usuario. Con la autenticación de alias, devuelven información de alias/buzón, incluyendo la cuota de almacenamiento y la configuración.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Obtener la información de tu cuenta |
| `updateAccount` | `PUT /v1/account` | Actualizar la configuración de tu cuenta |

### Dominios (clave API) {#domains-api-key}

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Listar todos tus dominios |
| `createDomain` | `POST /v1/domains` | Añadir un nuevo dominio |
| `getDomain` | `GET /v1/domains/:domain_id` | Obtener detalles del dominio |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Actualizar la configuración del dominio |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Eliminar un dominio |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verificar registros DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verificar configuración SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Probar conexión S3 personalizada |

### Alias (clave API) {#aliases-api-key}

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Listar alias para un dominio |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Crear un nuevo alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Obtener detalles del alias |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Actualizar un alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Eliminar un alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generar contraseña IMAP/SMTP para autenticación de alias |

### Correos electrónicos — SMTP saliente (clave API; Enviar admite ambos) {#emails--outbound-smtp-api-key-send-supports-both}

| Herramienta | Punto final de la API | Autenticación | Descripción |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | Clave API o autenticación de alias | Enviar un correo electrónico vía SMTP |
| `listEmails` | `GET /v1/emails` | Clave API | Listar correos electrónicos salientes |
| `getEmail` | `GET /v1/emails/:id` | Clave API | Obtener detalles y estado del correo electrónico |
| `deleteEmail` | `DELETE /v1/emails/:id` | Clave API | Eliminar un correo electrónico en cola |
| `getEmailLimit` | `GET /v1/emails/limit` | Clave API | Comprobar tu límite de envío |

La herramienta `sendEmail` acepta `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` y `attachments`. Esto es lo mismo que el punto final `POST /v1/emails`.

### Mensajes — IMAP (autenticación de alias) {#messages--imap-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o establece las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Listar y buscar mensajes en un buzón |
| `createMessage` | `POST /v1/messages` | Crear un borrador o subir un mensaje |
| `getMessage` | `GET /v1/messages/:id` | Obtener un mensaje por ID |
| `updateMessage` | `PUT /v1/messages/:id` | Actualizar banderas (leído, destacado, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Eliminar un mensaje |

La herramienta `listMessages` admite más de 15 parámetros de búsqueda, incluyendo `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` y `has_attachment`. Consulta la [documentación de la API](/email-api) para ver la lista completa.

### Carpetas — IMAP (autenticación de alias) {#folders--imap-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o establece las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Listar todas las carpetas del buzón |
| `createFolder` | `POST /v1/folders` | Crear una nueva carpeta |
| `getFolder` | `GET /v1/folders/:id` | Obtener detalles de la carpeta |
| `updateFolder` | `PUT /v1/folders/:id` | Renombrar una carpeta |
| `deleteFolder` | `DELETE /v1/folders/:id` | Eliminar una carpeta |

### Contactos — CardDAV (autenticación de alias) {#contacts--carddav-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o establece las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Listar todos los contactos |
| `createContact` | `POST /v1/contacts` | Crear un nuevo contacto |
| `getContact` | `GET /v1/contacts/:id` | Obtener detalles del contacto |
| `updateContact` | `PUT /v1/contacts/:id` | Actualizar un contacto |
| `deleteContact` | `DELETE /v1/contacts/:id` | Eliminar un contacto |

### Calendarios — CalDAV (autenticación de alias) {#calendars--caldav-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o establece las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Listar todos los calendarios |
| `createCalendar` | `POST /v1/calendars` | Crear un nuevo calendario |
| `getCalendar` | `GET /v1/calendars/:id` | Obtener detalles del calendario |
| `updateCalendar` | `PUT /v1/calendars/:id` | Actualizar un calendario |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Eliminar un calendario |

### Eventos de calendario — CalDAV (autenticación de alias) {#calendar-events--caldav-alias-auth}

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o establece las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Listar todos los eventos |
| `createCalendarEvent` | `POST /v1/calendar-events` | Crear un nuevo evento |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Obtener detalles del evento |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Actualizar un evento |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Eliminar un evento |

### Scripts Sieve (clave API) {#sieve-scripts-api-key}

Estos utilizan rutas con ámbito de dominio y se autentican con tu clave API.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Listar scripts para un alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Crear un nuevo script |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Obtener detalles del script |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Actualizar un script |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Eliminar un script |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Activar un script |

### Scripts Sieve (autenticación de alias) {#sieve-scripts-alias-auth}

Estos utilizan autenticación a nivel de alias. Útil para la automatización por alias sin necesidad de la clave API.

> **Requiere credenciales de alias.** Pasa `alias_username` y `alias_password` o establece las variables de entorno `FORWARD_EMAIL_ALIAS_USER` y `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Listar scripts |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Crear un script |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Obtener detalles del script |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Actualizar un script |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Eliminar un script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Activar un script |

### Miembros e invitaciones de dominio (clave API) {#domain-members-and-invites-api-key}

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Cambiar el rol de un miembro |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Eliminar un miembro |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Aceptar una invitación pendiente |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Invitar a alguien a un dominio |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Revocar una invitación |

### Contraseñas comodín (clave API) {#catch-all-passwords-api-key}

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Listar contraseñas comodín |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Crear una contraseña comodín |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Eliminar una contraseña comodín |

### Registros (clave API) {#logs-api-key}

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Descargar registros de entrega de correo electrónico |

### Cifrar (sin autenticación) {#encrypt-no-auth}

| Herramienta | Punto final de la API | Descripción |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Cifrar un registro DNS TXT |

Esta herramienta no requiere autenticación. Cifra registros de reenvío como `forward-email=user@example.com` para su uso en registros DNS TXT.


## 20 casos de uso reales {#20-real-world-use-cases}

Aquí hay formas prácticas de usar el servidor MCP con tu asistente de IA:

### 1. Clasificación de correos electrónicos

Pídele a tu IA que escanee tu bandeja de entrada y resuma los mensajes no leídos. Puede marcar correos electrónicos urgentes, categorizar por remitente y redactar respuestas, todo a través del lenguaje natural. *(Requiere credenciales de alias para el acceso a la bandeja de entrada.)*

### 2. Automatización de la configuración de dominios

¿Configurando un nuevo dominio? Pídele a la IA que cree el dominio, añada tus alias, verifique los registros DNS y pruebe la configuración SMTP. Lo que normalmente lleva 10 minutos de clics en paneles de control se convierte en una sola conversación.

### 3. Gestión masiva de alias

¿Necesitas crear 20 alias para un nuevo proyecto? Describe lo que necesitas y deja que la IA se encargue del trabajo repetitivo. Puede crear alias, establecer reglas de reenvío y generar contraseñas de una sola vez.

### 4. Monitoreo de campañas de correo electrónico

Pídele a tu IA que verifique los límites de envío, liste los correos electrónicos salientes recientes e informe sobre el estado de entrega. Útil para monitorear la salud de los correos electrónicos transaccionales.

### 5. Sincronización y limpieza de contactos

Usa las herramientas CardDAV para listar todos los contactos, encontrar duplicados, actualizar información desactualizada o crear contactos masivamente a partir de una hoja de cálculo que pegues en el chat. *(Requiere credenciales de alias.)*

### 6. Gestión de calendarios

Crea calendarios, añade eventos, actualiza horarios de reuniones y elimina eventos cancelados, todo a través de la conversación. Las herramientas CalDAV admiten CRUD completo tanto en calendarios como en eventos. *(Requiere credenciales de alias.)*

### 7. Automatización de scripts Sieve

Los scripts Sieve son potentes, pero la sintaxis es arcana. Pídele a tu IA que escriba scripts Sieve por ti: "Filtra todos los correos electrónicos de billing@example.com en una carpeta de Facturación" se convierte en un script funcional sin tocar la especificación RFC 5228.

### 8. Incorporación de equipos

Cuando un nuevo miembro del equipo se une, pídele a la IA que cree su alias, genere una contraseña, les envíe un correo electrónico de bienvenida con sus credenciales y los añada como miembro del dominio. Un prompt, cuatro llamadas a la API.

### 9. Auditoría de seguridad

Pídele a tu IA que liste todos los dominios, verifique el estado de verificación de DNS, revise las configuraciones de alias e identifique cualquier dominio con registros no verificados. Un rápido barrido de seguridad en lenguaje natural.

### 10. Configuración de reenvío de correo electrónico

¿Configurando el reenvío de correo electrónico para un nuevo dominio? Pídele a la IA que cree el dominio, añada alias de reenvío, cifre los registros DNS y verifique que todo esté configurado correctamente.

### 11. Búsqueda y análisis de la bandeja de entrada

Usa las herramientas de búsqueda de mensajes para encontrar correos electrónicos específicos: "Encuentra todos los correos electrónicos de john@example.com en los últimos 30 días que tengan archivos adjuntos". Los más de 15 parámetros de búsqueda lo hacen potente. *(Requiere credenciales de alias.)*

### 12. Organización de carpetas

Pídele a tu IA que cree una estructura de carpetas para un nuevo proyecto, mueva mensajes entre carpetas o limpie carpetas antiguas que ya no necesites. *(Requiere credenciales de alias.)*

### 13. Rotación de contraseñas

Genera nuevas contraseñas de alias según un horario. Pídele a tu IA que genere una nueva contraseña para cada alias e informe las nuevas credenciales.

### 14. Cifrado de registros DNS

Cifra tus registros de reenvío antes de añadirlos a DNS. La herramienta `encryptRecord` maneja esto sin autenticación, útil para cifrados rápidos y únicos.

### 15. Análisis de registros de entrega

Descarga tus registros de entrega de correo electrónico y pídele a la IA que analice las tasas de rebote, identifique destinatarios problemáticos o rastree los tiempos de entrega.

### 16. Gestión de múltiples dominios

Si gestionas varios dominios, pídele a la IA que te dé un informe de estado: qué dominios están verificados, cuáles tienen problemas, cuántos alias tiene cada uno y cómo son los límites de envío.

### 17. Configuración de comodines

Configura contraseñas comodín para dominios que necesiten recibir correo electrónico en cualquier dirección. La IA puede crear, listar y gestionar estas contraseñas por ti.

### 18. Gestión de invitaciones de dominio

Invita a miembros del equipo a gestionar dominios, verifica invitaciones pendientes y limpia las caducadas. Útil para organizaciones con múltiples administradores de dominio.

### 19. Prueba de almacenamiento S3

Si utilizas almacenamiento S3 personalizado para copias de seguridad de correo electrónico, pídele a la IA que pruebe la conexión y verifique que funciona correctamente.

### 20. Composición de borradores de correo electrónico

Crea borradores de correos electrónicos en tu buzón sin enviarlos. Útil para preparar correos electrónicos que necesitan revisión antes de enviarlos, o para crear plantillas de correo electrónico. *(Requiere credenciales de alias.)*


## Ejemplos de prompts {#example-prompts}

Aquí tienes prompts que puedes usar directamente con tu asistente de IA:

**Envío de correo electrónico:**
> "Envía un correo electrónico de hello@mydomain.com a john@example.com con el asunto 'Reunión Mañana' y el cuerpo 'Hola John, ¿seguimos a las 2pm?'"

**Gestión de dominios:**
> "Lista todos mis dominios y dime cuáles tienen registros DNS sin verificar."

**Creación de alias:**
> "Crea un nuevo alias support@mydomain.com que reenvíe a mi correo personal."

**Búsqueda en la bandeja de entrada (requiere credenciales de alias):**
> "Encuentra todos los correos electrónicos no leídos de la última semana que mencionen 'factura'."

**Calendario (requiere credenciales de alias):**
> "Crea un calendario llamado 'Trabajo' y añade una reunión para mañana a las 2pm llamada 'Reunión de equipo'."

**Scripts Sieve:**
> "Escribe un script Sieve para info@mydomain.com que responda automáticamente a los correos electrónicos con 'Gracias por contactarnos, nos pondremos en contacto contigo en 24 horas'."

**Operaciones masivas:**
> "Crea alias para sales@, support@, billing@ e info@ en mydomain.com, todos reenviando a team@mydomain.com."

**Verificación de seguridad:**
> "Verifica el estado de verificación de DNS y SMTP para todos mis dominios y dime si algo necesita atención."

**Generar contraseña de alias:**
> "Genera una contraseña para el alias user@example.com para que pueda acceder a mi bandeja de entrada."


## Variables de entorno {#environment-variables}

| Variable | Requerida | Predeterminada | Descripción |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Sí | — | Tu clave API de Forward Email (usada como nombre de usuario de autenticación Basic para puntos finales de clave API) |
| `FORWARD_EMAIL_ALIAS_USER` | No | — | Dirección de correo electrónico del alias para puntos finales de buzón (ej. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | No | — | Contraseña de alias generada para puntos finales de buzón |
| `FORWARD_EMAIL_API_URL` | No | `https://api.forwardemail.net` | URL base de la API (para autoalojado o pruebas) |


## Seguridad {#security}

El servidor MCP se ejecuta localmente en tu máquina. Así es como funciona la seguridad:

*   **Tus credenciales permanecen locales.** Tanto tu clave API como las credenciales de alias se leen de las variables de entorno y se utilizan para autenticar las solicitudes de la API a través de la autenticación HTTP Basic. Nunca se envían al modelo de IA.
*   **Transporte stdio.** El servidor se comunica con el cliente de IA a través de stdin/stdout. No se abren puertos de red.
*   **Sin almacenamiento de datos.** El servidor no tiene estado. No almacena en caché, registra ni guarda ninguno de tus datos de correo electrónico.
*   **Código abierto.** Todo el código base está en [GitHub](https://github.com/forwardemail/mcp-server). Puedes auditar cada línea.


## Uso programático {#programmatic-usage}

También puedes usar el servidor como una biblioteca:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Código abierto {#open-source}

El servidor MCP de Forward Email es [de código abierto en GitHub](https://github.com/forwardemail/mcp-server) bajo la licencia BUSL-1.1. Creemos en la transparencia. Si encuentras un error o quieres una función, [abre un problema](https://github.com/forwardemail/mcp-server/issues).

