# Correo Electrónico Resistente a la Computación Cuántica: Cómo usamos buzones SQLite cifrados para mantener seguro tu correo electrónico {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Ilustración del servicio de correo electrónico cifrado seguro contra computación cuántica" class="rounded-lg" />


## Tabla de Contenidos {#table-of-contents}

* [Prólogo](#foreword)
* [Comparación de proveedores de servicios de correo electrónico](#email-service-provider-comparison)
* [¿Cómo funciona?](#how-does-it-work)
* [Tecnologías](#technologies)
  * [Bases de datos](#databases)
  * [Seguridad](#security)
  * [Buzones](#mailboxes)
  * [Concurrencia](#concurrency)
  * [Copias de seguridad](#backups)
  * [Búsqueda](#search)
  * [Proyectos](#projects)
  * [Proveedores](#providers)
* [Reflexiones](#thoughts)
  * [Principios](#principles)
  * [Experimentos](#experiments)
  * [Falta de alternativas](#lack-of-alternatives)
  * [Prueba Forward Email](#try-out-forward-email)


## Prólogo {#foreword}

> \[!IMPORTANT]
> Nuestro servicio de correo electrónico es [100% de código abierto](https://github.com/forwardemail) y enfocado en la privacidad mediante buzones SQLite seguros y cifrados.

Hasta que lanzamos el [soporte IMAP](/faq#do-you-support-receiving-email-with-imap), usábamos MongoDB para nuestras necesidades de almacenamiento persistente de datos.

Esta tecnología es increíble y todavía la usamos hoy en día, pero para tener cifrado en reposo con MongoDB necesitas usar un proveedor que ofrezca MongoDB Enterprise, como Digital Ocean o Mongo Atlas, o pagar una licencia empresarial (y posteriormente lidiar con la latencia del equipo de ventas).

Nuestro equipo en [Forward Email](https://forwardemail.net) necesitaba una solución de almacenamiento cifrada, escalable, confiable y amigable para desarrolladores para buzones IMAP. Como desarrolladores de código abierto, usar una tecnología que requiere pagar una licencia para obtener la función de cifrado en reposo iba en contra de [nuestros principios](#principles), por lo que experimentamos, investigamos y desarrollamos una nueva solución desde cero para resolver estas necesidades.

En lugar de usar una base de datos compartida para almacenar tus buzones, almacenamos y ciframos individualmente tus buzones con tu contraseña (que solo tú tienes). **Nuestro servicio de correo electrónico es tan seguro que si olvidas tu contraseña, pierdes tu buzón** (y necesitas recuperarlo con copias de seguridad offline o empezar de nuevo).

Sigue leyendo mientras profundizamos a continuación con una [comparación de proveedores de servicios de correo electrónico](#email-service-provider-comparison), [cómo funciona nuestro servicio](#how-does-it-work), [nuestra pila tecnológica](#technologies) y más.


## Comparación de proveedores de servicios de correo electrónico {#email-service-provider-comparison}

Somos el único proveedor de servicios de correo electrónico 100% de código abierto y enfocado en la privacidad que almacena buzones SQLite cifrados individualmente, ofrece dominios, alias y usuarios ilimitados, y tiene soporte para SMTP saliente, IMAP y POP3:

**A diferencia de otros proveedores de correo electrónico, no necesitas pagar por almacenamiento por dominio o alias con Forward Email.** El almacenamiento se comparte en toda tu cuenta, así que si tienes múltiples nombres de dominio personalizados y múltiples alias en cada uno, somos la solución perfecta para ti. Ten en cuenta que aún puedes imponer límites de almacenamiento si lo deseas por dominio o alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Leer Comparación de Servicios de Correo <i class="fa fa-search-plus"></i></a>


## ¿Cómo funciona? {#how-does-it-work}

1. Usando tu cliente de correo como Apple Mail, Thunderbird, Gmail o Outlook, te conectas a nuestros servidores seguros [IMAP](/faq#do-you-support-receiving-email-with-imap) usando tu nombre de usuario y contraseña:

   * Tu nombre de usuario es tu alias completo con tu dominio, como `hello@example.com`.
   * Tu contraseña se genera aleatoriamente y solo se muestra durante 30 segundos cuando haces clic en <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> desde <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias.
2. Una vez conectado, tu cliente de correo enviará [comandos del protocolo IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) a nuestro servidor IMAP para mantener tu buzón sincronizado. Esto incluye escribir y almacenar correos electrónicos en borrador y otras acciones que puedas realizar (por ejemplo, etiquetar un correo como Importante o marcar un correo como Spam/Correo no deseado).

3. Los servidores de intercambio de correo (comúnmente conocidos como servidores "MX") reciben nuevos correos entrantes y los almacenan en tu buzón. Cuando esto sucede, tu cliente de correo será notificado y sincronizará tu buzón. Nuestros servidores de intercambio de correo pueden reenviar tu correo a uno o más destinatarios (incluyendo [webhooks](/faq#do-you-support-webhooks)), almacenar tu correo para ti en tu almacenamiento IMAP cifrado con nosotros, **¡o ambos!**

   > \[!TIP]
   > ¿Interesado en aprender más? Lee [cómo configurar el reenvío de correo](/faq#how-do-i-get-started-and-set-up-email-forwarding), [cómo funciona nuestro servicio de intercambio de correo](/faq#how-does-your-email-forwarding-system-work), o consulta [nuestras guías](/guides).

4. Detrás de escena, nuestro diseño seguro de almacenamiento de correo funciona de dos maneras para mantener tus buzones cifrados y accesibles solo por ti:

   * Cuando se recibe un correo nuevo para ti de un remitente, nuestros servidores de intercambio de correo escriben en un buzón individual, temporal y cifrado para ti.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

   * Cuando te conectas a nuestro servidor IMAP con tu cliente de correo, tu contraseña se cifra en memoria y se usa para leer y escribir en tu buzón. Tu buzón solo puede ser leído y escrito con esta contraseña. Ten en cuenta que, dado que eres el único con esta contraseña, **solo tú** puedes leer y escribir en tu buzón cuando lo estás accediendo. La próxima vez que tu cliente de correo intente consultar correo o sincronizar, tus nuevos mensajes serán transferidos desde este buzón temporal y almacenados en tu archivo de buzón real usando la contraseña que proporcionaste. Ten en cuenta que este buzón temporal se purga y elimina después para que solo tu buzón protegido con contraseña tenga los mensajes.

   * **Si estás conectado a IMAP (por ejemplo, usando un cliente de correo como Apple Mail o Thunderbird), entonces no necesitamos escribir en almacenamiento temporal en disco. En su lugar, se obtiene y usa tu contraseña IMAP cifrada en memoria. En tiempo real, cuando se intenta entregar un mensaje para ti, enviamos una solicitud WebSocket a todos los servidores IMAP preguntándoles si tienen una sesión activa para ti (esta es la parte de obtención), y luego se pasa esa contraseña cifrada en memoria – así que no necesitamos escribir en un buzón temporal, podemos escribir en tu buzón cifrado real usando tu contraseña cifrada.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Las copias de seguridad de tus buzones cifrados](#backups) se realizan diariamente. También puedes solicitar una nueva copia de seguridad en cualquier momento o descargar la última copia desde <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias. Si decides cambiar a otro servicio de correo, entonces puedes migrar, descargar, exportar y purgar fácilmente tus buzones y copias de seguridad en cualquier momento.


## Tecnologías {#technologies}

### Bases de datos {#databases}

Exploramos otras posibles capas de almacenamiento de bases de datos, sin embargo ninguna satisfizo nuestros requisitos tanto como SQLite:
| Base de datos                                           |                                                                    Cifrado en reposo                                                                   |  [Buzones aislados](https://es.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Licencia                           | [Usado en todas partes](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Sí con [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Dominio Público              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Disponible solo en MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Base de datos relacional                               |                   :x: AGPL y `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Solo en red](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Base de datos relacional                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [¿No probado y aún no soportado?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [¿No probado y aún no soportado?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Sí](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Base de datos relacional                               | :white_check_mark: `PostgreSQL` (similar a `BSD` o `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Solo para InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Base de datos relacional                               |          :white_check_mark: `GPLv2` y `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Función solo para Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Base de datos relacional                               |                  :x: `BUSL-1.1` y otros                  |                             :x:                             |

> Aquí hay un [artículo de blog que compara varias opciones de almacenamiento de bases de datos SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) en la tabla anterior.

### Seguridad {#security}

En todo momento usamos [cifrado en reposo](https://es.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://es.wikipedia.org/wiki/Advanced_Encryption_Standard)), [cifrado en tránsito](https://es.wikipedia.org/wiki/Data_in_transit) ([TLS](https://es.wikipedia.org/wiki/Transport_Layer_Security)), [DNS sobre HTTPS](https://es.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") usando :tangerine: [Tangerine](https://tangeri.ne), y cifrado [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) en los buzones. Además usamos autenticación de dos factores basada en tokens (en lugar de SMS, que es susceptible a [ataques de intermediario](https://es.wikipedia.org/wiki/Man-in-the-middle_attack)), claves SSH rotativas con acceso root deshabilitado, acceso exclusivo a servidores mediante direcciones IP restringidas, y más.
En caso de un [ataque de mucama malvada](https://en.wikipedia.org/wiki/Evil_maid_attack) o un empleado deshonesto de un proveedor externo, **su buzón de correo solo puede abrirse con su contraseña generada**. Tenga la seguridad de que no dependemos de ningún proveedor externo aparte de nuestros servidores con certificación SOC Tipo 2 de Cloudflare, DataPacket, Digital Ocean, GitHub y Vultr.

Nuestro objetivo es tener la menor cantidad posible de [puntos únicos de fallo](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Buzones {#mailboxes}

> **resumen;** Nuestros servidores IMAP usan bases de datos SQLite cifradas individualmente para cada uno de sus buzones.

[SQLite es una base de datos embebida extremadamente popular](https://www.sqlite.org/mostdeployed.html): actualmente está funcionando en su teléfono y computadora, [y es usada por casi todas las tecnologías principales](https://www.sqlite.org/famous.html).

Por ejemplo, en nuestros servidores cifrados hay una base de datos SQLite para el buzón `linux@example.com`, `info@example.com`, `hello@example.com` y así sucesivamente – una para cada uno como un archivo de base de datos `.sqlite`. Tampoco nombramos los archivos de base de datos con la dirección de correo electrónico – en su lugar usamos BSON ObjectID y UUID únicos generados que no revelan a quién pertenece el buzón ni cuál es la dirección de correo electrónico (por ejemplo, `353a03f21e534321f5d6e267.sqlite`).

Cada una de estas bases de datos está cifrada usando su contraseña (que solo usted tiene) mediante [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Esto significa que sus buzones están cifrados individualmente, son autónomos, [aislados](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) y portátiles.

Hemos ajustado SQLite con el siguiente [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Propósito                                                                                                                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Cifrado de base de datos SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Consulte `better-sqlite3-multiple-ciphers` en [Proyectos](#projects) para más detalles.                                 |
| `key="****************"` | Esta es su contraseña descifrada solo en memoria que se pasa a través de la conexión IMAP de su cliente de correo a nuestro servidor. Se crean y cierran nuevas instancias de base de datos para cada sesión de lectura y escritura (para asegurar aislamiento). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [que mejora el rendimiento y permite acceso concurrente de lectura](https://litestream.io/tips/#wal-journal-mode).                                                                             |
| `busy_timeout=5000`      | Previene errores de bloqueo de escritura [mientras se realizan otras escrituras](https://litestream.io/tips/#busy-timeout).                                                                                                                               |
| `synchronous=NORMAL`     | Incrementa la durabilidad de las transacciones [sin riesgo de corrupción de datos](https://litestream.io/tips/#synchronous-pragma).                                                                                                                     |
| `foreign_keys=ON`        | Hace cumplir que las referencias de claves foráneas (por ejemplo, una relación de una tabla a otra) sean respetadas. [Por defecto esto no está activado en SQLite](https://www.sqlite.org/foreignkeys.html), pero para validación e integridad de datos debe estar habilitado. |
| `encoding='UTF-8'`       | [Codificación predeterminada](https://www.sqlite.org/pragma.html#pragma_encoding) para usar y asegurar la coherencia del desarrollador.                                                                                                                  |
> Todos los demás valores predeterminados son de SQLite según lo especificado en la [documentación oficial de PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concurrencia {#concurrency}

> **resumen;** Usamos `WebSocket` para lecturas y escrituras concurrentes en tus buzones de correo SQLite cifrados.

#### Lecturas {#reads}

Tu cliente de correo en tu teléfono puede resolver `imap.forwardemail.net` a una de nuestras direcciones IP de Digital Ocean, y tu cliente de escritorio puede resolver una IP diferente de otro [proveedor](#providers) por completo.

Independientemente de a qué servidor IMAP se conecte tu cliente de correo, queremos que la conexión lea de tu base de datos en tiempo real con un 100% de precisión. Esto se hace a través de WebSockets.

#### Escrituras {#writes}

Escribir en tu base de datos es un poco diferente, ya que SQLite es una base de datos embebida y tu buzón vive en un solo archivo por defecto.

Exploramos opciones como `litestream`, `rqlite` y `dqlite` a continuación, pero ninguna satisfizo nuestros requisitos.

Para realizar escrituras con el registro adelantado ("[WAL](https://www.sqlite.org/wal.html)") habilitado, necesitamos asegurar que solo un servidor ("Primario") sea responsable de hacerlo. [WAL](https://www.sqlite.org/wal.html) acelera drásticamente la concurrencia y permite un escritor y múltiples lectores.

El Primario se ejecuta en los servidores de datos con los volúmenes montados que contienen los buzones cifrados. Desde un punto de vista de distribución, puedes considerar que todos los servidores IMAP individuales detrás de `imap.forwardemail.net` son servidores secundarios ("Secundarios").

Logramos comunicación bidireccional con [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Los servidores primarios usan una instancia del servidor `WebSocketServer` de [ws](https://github.com/websockets/ws).
* Los servidores secundarios usan una instancia del cliente `WebSocket` de [ws](https://github.com/websockets/ws) que está envuelta con [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) y [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Estos dos envoltorios aseguran que el `WebSocket` se reconecte y pueda enviar y recibir datos para escrituras específicas en la base de datos.

### Copias de seguridad {#backups}

> **resumen;** Se hacen copias de seguridad diarias de tus buzones cifrados. También puedes solicitar instantáneamente una nueva copia de seguridad o descargar la última copia en cualquier momento desde <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias.

Para las copias de seguridad, simplemente ejecutamos el comando SQLite `VACUUM INTO` cada día durante el procesamiento de comandos IMAP, que aprovecha tu contraseña cifrada desde una conexión IMAP en memoria. Las copias se almacenan si no se detecta una copia existente o si el hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) ha cambiado en el archivo en comparación con la copia más reciente.

Ten en cuenta que usamos el comando `VACUUM INTO` en lugar del comando incorporado `backup` porque si una página se modifica durante una operación de comando `backup`, entonces tiene que comenzar de nuevo. El comando `VACUUM INTO` tomará una instantánea. Consulta estos comentarios en [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) y [Hacker News](https://news.ycombinator.com/item?id=31387556) para más información.

Además, usamos `VACUUM INTO` en lugar de `backup`, porque el comando `backup` dejaría la base de datos sin cifrar por un breve período hasta que se invoque `rekey` (consulta este [comentario](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) en GitHub para más detalles).

El Secundario instruirá al Primario a través de la conexión `WebSocket` para ejecutar la copia de seguridad, y el Primario recibirá el comando para hacerlo y posteriormente:

1. Conectarse a tu buzón cifrado.
2. Adquirir un bloqueo de escritura.
3. Ejecutar un punto de control WAL mediante `wal_checkpoint(PASSIVE)`.
4. Ejecutar el comando SQLite `VACUUM INTO`.
5. Asegurarse de que el archivo copiado pueda abrirse con la contraseña cifrada (medida de seguridad).
6. Subirlo a Cloudflare R2 para almacenamiento (o a tu propio proveedor si está especificado).
<!--
7. Comprime el archivo de respaldo resultante con `gzip`.
8. Súbelo a Cloudflare R2 para almacenamiento (o a tu propio proveedor si está especificado).
-->

Recuerda que tus buzones están cifrados – y aunque tenemos restricciones de IP y otras medidas de autenticación para la comunicación WebSocket – en caso de un actor malintencionado, puedes estar seguro de que a menos que la carga útil del WebSocket tenga tu contraseña IMAP, no podrá abrir tu base de datos.

Solo se almacena una copia de seguridad por buzón en este momento, pero en el futuro podríamos ofrecer recuperación en un punto en el tiempo ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Búsqueda {#search}

Nuestros servidores IMAP soportan el comando `SEARCH` con consultas complejas, expresiones regulares y más.

El rendimiento rápido de búsqueda se debe a [FTS5](https://www.sqlite.org/fts5.html) y [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Almacenamos valores `Date` en los buzones SQLite como cadenas [ISO 8601](https://es.wikipedia.org/wiki/ISO_8601) mediante [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (con zona horaria UTC para que las comparaciones de igualdad funcionen correctamente).

También se almacenan índices para todas las propiedades que están en las consultas de búsqueda.

### Proyectos {#projects}

Aquí hay una tabla que describe los proyectos que usamos en nuestro código fuente y proceso de desarrollo (ordenados alfabéticamente):

| Proyecto                                                                                     | Propósito                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                         | Plataforma de automatización DevOps para mantener, escalar y gestionar toda nuestra flota de servidores con facilidad.                                                                                                                                                                                                                                            |
| [Bree](https://github.com/breejs/bree)                                                      | Planificador de tareas para Node.js y JavaScript con soporte para cron, fechas, ms, later y amigable para humanos.                                                                                                                                                                                                                                               |
| [Cabin](https://github.com/cabinjs/cabin)                                                   | Biblioteca de registro para JavaScript y Node.js amigable para desarrolladores con seguridad y privacidad en mente.                                                                                                                                                                                                                                              |
| [Lad](https://github.com/ladjs/lad)                                                         | Framework de Node.js que impulsa toda nuestra arquitectura y diseño de ingeniería con MVC y más.                                                                                                                                                                                                                                                                  |
| [MongoDB](https://www.mongodb.com/)                                                         | Solución de base de datos NoSQL que usamos para almacenar todos los demás datos fuera de los buzones (por ejemplo, tu cuenta, configuraciones, dominios y configuraciones de alias).                                                                                                                                                                            |
| [Mongoose](https://github.com/Automattic/mongoose)                                          | Modelado de documentos de objetos ("ODM") para MongoDB que usamos en toda nuestra pila. Escribimos ayudantes especiales que nos permiten simplemente continuar usando **Mongoose con SQLite** :tada:                                                                                                                                                            |
| [Node.js](https://nodejs.org/en)                                                            | Node.js es el entorno de ejecución de JavaScript multiplataforma y de código abierto que ejecuta todos nuestros procesos de servidor.                                                                                                                                                                                                                            |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                      | Paquete de Node.js para enviar correos electrónicos, crear conexiones y más. Somos patrocinadores oficiales de este proyecto.                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                  | Base de datos en memoria para caché, canales de publicación/suscripción y solicitudes DNS sobre HTTPS.                                                                                                                                                                                                                                                           |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                  | Extensión de cifrado para SQLite que permite cifrar archivos completos de bases de datos (incluyendo el write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                         |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                 | Editor visual de SQLite (que también podrías usar) para probar, descargar y ver buzones de desarrollo.                                                                                                                                                                                                                                                           |
| [SQLite](https://www.sqlite.org/about.html)                                                 | Capa de base de datos embebida para almacenamiento IMAP escalable, autónomo, rápido y resistente.                                                                                                                                                                                                                                                                 |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                  | Herramienta anti-spam, filtrado de correo electrónico y prevención de phishing para Node.js (nuestra alternativa a [Spam Assassin](https://spamassassin.apache.org/) y [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                   |
| [Tangerine](https://tangeri.ne)                                                             | Solicitudes DNS sobre HTTPS con Node.js y caché usando Redis – que asegura consistencia global y mucho más.                                                                                                                                                                                                                                                       |
| [Thunderbird](https://www.thunderbird.net/)                                                 | Nuestro equipo de desarrollo usa esto (y también lo recomienda) como **el cliente de correo preferido para usar con Forward Email**.                                                                                                                                                                                                                            |
| [UTM](https://github.com/utmapp/UTM)                                                        | Nuestro equipo de desarrollo usa esto para crear máquinas virtuales para iOS y macOS con el fin de probar diferentes clientes de correo (en paralelo) con nuestros servidores IMAP y SMTP.                                                                                                                                                                        |
| [Ubuntu](https://ubuntu.com/download/server)                                                | Sistema operativo moderno basado en Linux de código abierto que impulsa toda nuestra infraestructura.                                                                                                                                                                                                                                                            |
| [WildDuck](https://github.com/nodemailer/wildduck)                                          | Biblioteca de servidor IMAP – consulta sus notas sobre [desduplicación de adjuntos](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) y [soporte del protocolo IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                 |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Biblioteca API rápida y simple para Node.js para interactuar programáticamente con SQLite3.                                                                                                                                                                                                                                                                        |
| [email-templates](https://github.com/forwardemail/email-templates)                          | Framework de correo electrónico amigable para desarrolladores para crear, previsualizar y enviar correos personalizados (por ejemplo, notificaciones de cuenta y más).                                                                                                                                                                                          |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                      | Constructor de consultas SQL usando sintaxis estilo Mongo. Esto ahorra tiempo a nuestro equipo de desarrollo ya que podemos seguir escribiendo en estilo Mongo en toda la pila con un enfoque agnóstico a la base de datos. **También ayuda a evitar ataques de inyección SQL usando parámetros en las consultas.**                                                   |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                      | Utilidad SQL para extraer información sobre el esquema de base de datos existente. Esto nos permite validar fácilmente que todos los índices, tablas, columnas, restricciones y más son válidos y están `1:1` con cómo deberían ser. Incluso escribimos ayudantes automatizados para agregar nuevas columnas e índices si se hacen cambios en los esquemas de base de datos (con alertas de error extremadamente detalladas también). |
| [knex](https://github.com/knex/knex)                                                      | Constructor de consultas SQL que usamos solo para migraciones de base de datos y validación de esquemas a través de `knex-schema-inspector`.                                                                                                                                                                                                                        |
| [mandarin](https://github.com/ladjs/mandarin)                                             | Traducción automática de frases [i18n](https://es.wikipedia.org/wiki/Internationalization_and_localization) con soporte para Markdown usando [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                 |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                       | Paquete de Node.js para resolver y establecer conexiones con servidores MX y manejar errores.                                                                                                                                                                                                                                                                     |
| [pm2](https://github.com/Unitech/pm2)                                                     | Administrador de procesos de producción para Node.js con balanceador de carga incorporado ([ajustado finamente](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) para rendimiento).                                                                                                                                                              |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                  | Biblioteca de servidor SMTP – la usamos para nuestros servidores de intercambio de correo ("MX") y SMTP salientes.                                                                                                                                                                                                                                                |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                             | Herramienta útil para probar servidores IMAP contra puntos de referencia y compatibilidad con la especificación RFC del protocolo IMAP. Este proyecto fue creado por el equipo de [Dovecot](https://es.wikipedia.org/wiki/Dovecot_\(software\)) (un servidor IMAP y POP3 de código abierto activo desde julio de 2002). Probamos extensamente nuestro servidor IMAP con esta herramienta.                                    |
> Puedes encontrar otros proyectos que usamos en [nuestro código fuente en GitHub](https://github.com/forwardemail).

### Proveedores {#providers}

| Proveedor                                       | Propósito                                                                                                                    |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Proveedor DNS, chequeos de salud, balanceadores de carga y almacenamiento de respaldo usando [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hospedaje de código fuente, CI/CD y gestión de proyectos.                                                                    |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hospedaje de servidores dedicados y bases de datos gestionadas.                                                              |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hospedaje de servidores dedicados.                                                                                           |
| [DataPacket](https://www.datapacket.com)        | Hospedaje de servidores dedicados.                                                                                           |


## Reflexiones {#thoughts}

### Principios {#principles}

Forward Email está diseñado según estos principios:

1. Siempre ser amigable para desarrolladores, enfocado en seguridad y privacidad, y transparente.
2. Adherirse a [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Navaja de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor), y [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Apuntar al desarrollador emprendedor, autofinanciado y [rentable con ramen](http://www.paulgraham.com/ramenprofitable.html)

### Experimentos {#experiments}

> **resumen;** En última instancia, usar almacenamiento de objetos compatible con S3 y/o Tablas Virtuales no es técnicamente factible por razones de rendimiento y es propenso a errores debido a limitaciones de memoria.

Hemos realizado algunos experimentos que nos llevaron a nuestra solución final con SQLite como se discutió arriba.

Uno de ellos fue intentar usar [rclone]() y SQLite junto con una capa de almacenamiento compatible con S3.

Ese experimento nos llevó a entender y descubrir casos límite relacionados con rclone, SQLite y el uso de [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Si habilitas la bandera `--vfs-cache-mode writes` con rclone, entonces las lecturas estarán bien, sin embargo las escrituras se almacenarán en caché.
  * Si tienes múltiples servidores IMAP distribuidos globalmente, entonces la caché estará desincronizada entre ellos a menos que tengas un único escritor y múltiples oyentes (por ejemplo, un enfoque pub/sub).
  * Esto es increíblemente complejo y añadir cualquier complejidad adicional como esta resultará en más puntos únicos de fallo.
  * Los proveedores de almacenamiento compatibles con S3 no soportan cambios parciales de archivos, lo que significa que cualquier cambio en el archivo `.sqlite` resultará en un cambio completo y re-subida de la base de datos.
  * Existen otras soluciones como `rsync`, pero no están enfocadas en el soporte de write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), por lo que terminamos revisando Litestream. Afortunadamente, nuestro uso de cifrado ya cifra los archivos [WAL](https://www.sqlite.org/wal.html) para nosotros, por lo que no necesitamos depender de Litestream para eso. Sin embargo, aún no estábamos seguros de Litestream para uso en producción y tenemos algunas notas al respecto abajo.
  * Usar esta opción de `--vfs-cache-mode writes` (la *única* forma de usar SQLite sobre `rclone` para escrituras) intentará copiar toda la base de datos desde cero en memoria – manejar un buzón de 10 GB está bien, pero manejar múltiples buzones con almacenamiento extremadamente alto causará que los servidores IMAP tengan limitaciones de memoria y errores `ENOMEM`, fallos de segmentación y corrupción de datos.
* Si intentas usar las [Tablas Virtuales](https://www.sqlite.org/vtab.html) de SQLite (por ejemplo usando [s3db](https://github.com/jrhy/s3db)) para tener datos en vivo en una capa de almacenamiento compatible con S3, entonces te encontrarás con varios problemas más:
  * Las lecturas y escrituras serán extremadamente lentas ya que los endpoints API de S3 deberán ser accedidos con métodos HTTP `GET`, `PUT`, `HEAD` y `POST`.
  * Las pruebas de desarrollo mostraron que superar los 500K-1M+ registros con internet de fibra aún está limitado por el rendimiento de escritura y lectura a proveedores compatibles con S3. Por ejemplo, nuestros desarrolladores ejecutaron bucles `for` para hacer tanto sentencias SQL `INSERT` secuenciales como escrituras masivas de grandes cantidades de datos. En ambos casos el rendimiento fue asombrosamente lento.
  * Las tablas virtuales **no pueden tener índices**, sentencias `ALTER TABLE`, y [otras](https://stackoverflow.com/a/12507650) [limitaciones](https://sqlite.org/lang_createvtab.html) – lo que lleva a retrasos de 1-2 minutos o más dependiendo de la cantidad de datos.
  * Los objetos se almacenaban sin cifrar y no hay soporte nativo de cifrado disponible fácilmente.
* También exploramos usar [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) que es similar conceptual y técnicamente al punto anterior (por lo que tiene los mismos problemas). Una posibilidad sería usar una compilación personalizada de `sqlite3` envuelta con cifrado como [wxSQLite3](https://github.com/utelle/wxsqlite3) (que usamos actualmente en nuestra solución arriba) mediante [editar el archivo de configuración](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Otro enfoque potencial era usar la extensión [multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), sin embargo esto tiene una limitación de 32 GB y requeriría compilación compleja y dolores de cabeza en desarrollo.
* Se requieren sentencias `ALTER TABLE` (por lo que esto descarta completamente usar Tablas Virtuales). Necesitamos sentencias `ALTER TABLE` para que nuestro hook con `knex-schema-inspector` funcione correctamente – lo que asegura que los datos no se corrompan y las filas recuperadas puedan convertirse en documentos válidos según nuestras definiciones de esquema `mongoose` (que incluyen validación de restricciones, tipo de variable y validación arbitraria de datos).
* Casi todos los proyectos compatibles con S3 relacionados con SQLite en la comunidad open-source están en Python (y no en JavaScript que usamos para el 100% de nuestra pila).
* Las librerías de compresión como [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (ver [comentarios](https://news.ycombinator.com/item?id=32303762)) parecen prometedoras, pero [quizás aún no estén listas para uso en producción](https://github.com/phiresky/sqlite-zstd#usage). En cambio, la compresión del lado de la aplicación en tipos de datos como `String`, `Object`, `Map`, `Array`, `Set` y `Buffer` será un enfoque más limpio y fácil (y también más fácil de migrar, ya que podríamos almacenar una bandera o columna `Boolean` – o incluso usar `PRAGMA` `user_version=1` para compresión o `user_version=0` para sin compresión como metadatos de la base de datos).
  * Afortunadamente ya tenemos implementada la desduplicación de adjuntos en el almacenamiento de nuestro servidor IMAP – por lo tanto cada mensaje con el mismo adjunto no mantiene una copia del adjunto – en cambio un solo adjunto se almacena para múltiples mensajes y hilos en un buzón (y se usa una referencia externa posteriormente).
* El proyecto Litestream, que es una solución de replicación y respaldo para SQLite, es muy prometedor y probablemente lo usaremos en el futuro.
  * No para desacreditar al autor(es) – porque amamos su trabajo y contribuciones al open-source por más de una década – sin embargo por uso en el mundo real parece que [puede haber muchos dolores de cabeza](https://github.com/benbjohnson/litestream/issues) y [pérdida potencial de datos por su uso](https://github.com/benbjohnson/litestream/issues/218).
* La restauración de respaldos debe ser sencilla y trivial. Usar una solución como MongoDB con `mongodump` y `mongoexport` no solo es tedioso, sino que consume mucho tiempo y tiene complejidad de configuración.
  * Las bases de datos SQLite lo hacen simple (es un solo archivo).
  * Queríamos diseñar una solución donde los usuarios pudieran tomar su buzón y marcharse en cualquier momento.
    * Comandos simples de Node.js para `fs.unlink('mailbox.sqlite'))` y se borra permanentemente del almacenamiento en disco.
    * Podemos usar de manera similar una API compatible con S3 con HTTP `DELETE` para eliminar fácilmente snapshots y respaldos para los usuarios.
  * SQLite fue la solución más simple, rápida y rentable.
### Falta de alternativas {#lack-of-alternatives}

Hasta donde sabemos, ningún otro servicio de correo electrónico está diseñado de esta manera ni es de código abierto.

*Creemos que esto podría deberse* a que los servicios de correo electrónico existentes tienen tecnología heredada en producción con [código espagueti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

La mayoría, si no todos, los proveedores de servicios de correo electrónico existentes son o bien de código cerrado o se anuncian como de código abierto, **pero en realidad solo su front-end es de código abierto.**

**La parte más sensible del correo electrónico** (el almacenamiento real/interacción IMAP/SMTP) **se realiza completamente en el back-end (servidor), y *no* en el front-end (cliente)**.

### Prueba Forward Email {#try-out-forward-email}

¡Regístrate hoy en <https://forwardemail.net>! :rocket:
