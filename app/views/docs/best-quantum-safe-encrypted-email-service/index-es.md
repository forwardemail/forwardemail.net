# Correo electrónico resistente a la energía cuántica: cómo utilizamos buzones de correo SQLite cifrados para mantener su correo electrónico seguro {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Prefacio](#foreword)
* [Comparación de proveedores de servicios de correo electrónico](#email-service-provider-comparison)
* [¿Cómo funciona?](#how-does-it-work)
* [Tecnologías](#technologies)
  * [Bases de datos](#databases)
  * [Seguridad](#security)
  * [Buzones de correo](#mailboxes)
  * [Concurrencia](#concurrency)
  * [Copias de seguridad](#backups)
  * [Buscar](#search)
  * [Proyectos](#projects)
  * [Proveedores](#providers)
* [Pensamientos](#thoughts)
  * [Principios](#principles)
  * [Experimentos](#experiments)
  * [Falta de alternativas](#lack-of-alternatives)
  * [Pruebe el reenvío de correo electrónico](#try-out-forward-email)

## Prólogo {#foreword}

> \[!IMPORTANT]
> Nuestro servicio de correo electrónico es [100% de código abierto](https://github.com/forwardemail) y se centra en la privacidad a través de buzones de correo SQLite seguros y cifrados.

Hasta que lanzamos [Compatibilidad con IMAP](/faq#do-you-support-receiving-email-with-imap), usábamos MongoDB para nuestras necesidades de almacenamiento de datos persistentes.

Esta tecnología es increíble y todavía la usamos hoy, pero para tener cifrado en reposo con MongoDB es necesario utilizar un proveedor que ofrezca MongoDB Enterprise, como Digital Ocean o Mongo Atlas, o pagar una licencia empresarial (y posteriormente tener que trabajar con la latencia del equipo de ventas).

Nuestro equipo en [Reenviar correo electrónico](https://forwardemail.net) necesitaba una solución de almacenamiento cifrada, escalable, fiable y fácil de usar para buzones IMAP. Como desarrolladores de código abierto, usar una tecnología que requiere el pago de una licencia para acceder a la función de cifrado en reposo era un obstáculo para [nuestros principios](#principles), por lo que experimentamos, investigamos y desarrollamos una nueva solución desde cero para satisfacer estas necesidades.

En lugar de usar una base de datos compartida para almacenar sus buzones, los almacenamos y ciframos individualmente con su contraseña (que solo usted conoce). **Nuestro servicio de correo electrónico es tan seguro que, si olvida su contraseña, perderá su buzón** (y tendrá que recuperarlo con copias de seguridad sin conexión o empezar de cero).

Continúe leyendo mientras profundizamos a continuación con [Comparación de proveedores de servicios de correo electrónico](#email-service-provider-comparison), [Cómo funciona nuestro servicio](#how-does-it-work), [nuestra pila tecnológica](#technologies) y más.

## Comparación de proveedores de servicios de correo electrónico {#email-service-provider-comparison}

Somos el único proveedor de servicios de correo electrónico 100% de código abierto y centrado en la privacidad que almacena buzones de correo SQLite encriptados individualmente, ofrece dominios, alias y usuarios ilimitados, y tiene soporte para SMTP, IMAP y POP3 salientes:

**A diferencia de otros proveedores de correo electrónico, con Forward Email no necesitas pagar por almacenamiento por dominio o alias.** El almacenamiento se comparte entre toda tu cuenta, así que si tienes varios nombres de dominio personalizados y varios alias en cada uno, somos la solución perfecta. Recuerda que puedes aplicar límites de almacenamiento por dominio o alias si lo deseas.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lea la comparación de servicios de correo electrónico <i class="fa fa-search-plus"></i></a>

## ¿Cómo funciona? {#how-does-it-work}

1. Utilizando su cliente de correo electrónico, como Apple Mail, Thunderbird, Gmail o Outlook, se conecta a nuestros servidores seguros [IMAP](/faq#do-you-support-receiving-email-with-imap) con su nombre de usuario y contraseña:

* Tu nombre de usuario es tu alias completo con tu dominio, como `hello@example.com`.
* Tu contraseña se genera aleatoriamente y solo se muestra durante 30 segundos al hacer clic en <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> desde <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias.

2. Una vez conectado, su cliente de correo electrónico enviará [Comandos del protocolo IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) a nuestro servidor IMAP para mantener su buzón sincronizado. Esto incluye la creación y el almacenamiento de borradores de correo y otras acciones que pueda realizar (por ejemplo, etiquetar un correo como importante o marcarlo como spam).

3. Los servidores de intercambio de correo (comúnmente conocidos como servidores "MX") reciben los nuevos correos entrantes y los almacenan en su buzón. Cuando esto sucede, su cliente de correo electrónico recibe una notificación y sincroniza su buzón. Nuestros servidores de intercambio de correo pueden reenviar su correo a uno o más destinatarios (incluido [webhooks](/faq#do-you-support-webhooks)), almacenarlo en su almacenamiento IMAP cifrado con nosotros, **o ambas cosas**.

> \[!TIP]
> ¿Te interesa saber más? Lee [Cómo configurar el reenvío de correo electrónico](/faq#how-do-i-get-started-and-set-up-email-forwarding), [Cómo funciona nuestro servicio de intercambio de correo](/faq#how-does-your-email-forwarding-system-work) o consulta [nuestros guías](/guides).

4. En segundo plano, nuestro diseño de almacenamiento seguro de correo electrónico funciona de dos maneras para mantener sus buzones encriptados y solo usted pueda acceder a ellos:

* Cuando recibimos un correo nuevo de un remitente, nuestros servidores de intercambio de correo escriben en un buzón individual, temporal y cifrado para usted.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Al conectarse a nuestro servidor IMAP con su cliente de correo, su contraseña se cifra en memoria y se utiliza para leer y escribir en su buzón. Solo se puede leer y escribir en su buzón con esta contraseña. Tenga en cuenta que, al ser el único con esta contraseña, **solo usted** puede leer y escribir en su buzón cuando accede a él. La próxima vez que su cliente de correo intente buscar correo o sincronizar, sus mensajes nuevos se transferirán desde este buzón temporal y se almacenarán en su archivo de buzón con la contraseña proporcionada. Tenga en cuenta que este buzón temporal se purga y elimina posteriormente para que solo su buzón protegido con contraseña contenga los mensajes.

**Si está conectado a IMAP (por ejemplo, usando un cliente de correo electrónico como Apple Mail o Thunderbird), no necesitamos escribir en el almacenamiento temporal del disco. En su lugar, se obtiene y utiliza su contraseña IMAP cifrada en memoria. En tiempo real, cuando se intenta entregarle un mensaje, enviamos una solicitud WebSocket a todos los servidores IMAP para preguntarles si tienen una sesión activa para usted (esta es la fase de obtención), y posteriormente pasamos esa contraseña cifrada en memoria. Así, no necesitamos escribir en un buzón temporal; podemos escribir en su buzón cifrado real usando su contraseña cifrada.**

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

5. Se crean [Copias de seguridad de sus buzones de correo cifrados](#backups) a diario. También puede solicitar una nueva copia de seguridad en cualquier momento o descargar la última desde <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias. Si decide cambiar a otro servicio de correo electrónico, puede migrar, descargar, exportar y purgar fácilmente sus buzones y copias de seguridad en cualquier momento.

## Tecnologías {#technologies}

### Bases de datos {#databases}

Exploramos otras posibles capas de almacenamiento de bases de datos, sin embargo ninguna satisfizo nuestros requisitos tanto como SQLite:

| Base de datos | Cifrado en reposo | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Buzones de correo | Licencia | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :estrella: | :white_check_mark: Sí con [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :marca de verificación blanca: | :white_check_mark: Dominio público | :marca de verificación blanca: |
| [MongoDB](https://www.mongodb.com/) | :x: __ENLACE_CELULAR_0__ | :x: Base de datos relacional | :x: AGPL y `SSPL-1.0` | :incógnita: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: __ENLACE_CELULAR_0__ | :x: Base de datos relacional | :marca de verificación blanca: __CÓDIGO DE CELDA_0__ | :incógnita: |
| [dqlite](https://dqlite.io/) | :x: __ENLACE_CELULAR_0__ | :x: __ENLACE_CELULAR_0__ | :marca de verificación blanca: __CÓDIGO DE CELDA_0__ | :incógnita: |
| [PostgreSQL](https://www.postgresql.org/) | :marca de verificación blanca: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Base de datos relacional | :white_check_mark: `PostgreSQL` (similar a `BSD` o `MIT`) | :incógnita: |
| [MariaDB](https://mariadb.com/) | :marca de verificación blanca: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Base de datos relacional | :marca de verificación blanca: __CÓDIGO_DE_CELDA_0__ y __CÓDIGO_DE_CELDA_1__ | :incógnita: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: __ENLACE_CELULAR_0__ | :x: Base de datos relacional | :x: `BUSL-1.1` y otros | :incógnita: |

> Aquí hay un [Entrada de blog que compara varias opciones de almacenamiento de bases de datos SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) en la tabla anterior.

### Seguridad {#security}

En todo momento utilizamos el cifrado [cifrado en reposo](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [cifrado en tránsito](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") con [Mandarina](https://tangeri.ne) y [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poli1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) en los buzones. Además, utilizamos autenticación de dos factores basada en tokens (a diferencia de SMS, que es sospechoso de [ataques de intermediario](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), claves SSH rotadas con acceso root deshabilitado, acceso exclusivo a servidores mediante direcciones IP restringidas, etc.

En caso de un [ataque de sirvienta malvada](https://en.wikipedia.org/wiki/Evil_maid_attack) o un empleado deshonesto de un proveedor externo, **su buzón solo podrá abrirse con la contraseña generada**. Tenga la seguridad de que no dependemos de ningún proveedor externo, salvo de nuestros proveedores de servidores de conformidad con SOC Tipo 2: Cloudflare, DataPacket, Digital Ocean y Vultr.

Nuestro objetivo es tener la menor cantidad posible de [punto único de fallos](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Buzones {#mailboxes}

> **tldr;** Nuestros servidores IMAP utilizan bases de datos SQLite encriptadas individualmente para cada uno de sus buzones de correo.

Base de datos incorporada [SQLite es una herramienta extremadamente popular](https://www.sqlite.org/mostdeployed.html): actualmente se está ejecutando en su teléfono y computadora: [y utilizado por casi todas las tecnologías principales](https://www.sqlite.org/famous.html).

Por ejemplo, en nuestros servidores cifrados hay un buzón de base de datos SQLite para `linux@example.com`, `info@example.com`, `hello@example.com`, etc., uno para cada uno, como archivo de base de datos `.sqlite`. Tampoco asignamos la dirección de correo electrónico a los archivos de base de datos; en su lugar, utilizamos ObjectID BSON y UUID únicos generados que no indican a quién pertenece el buzón ni a qué dirección de correo electrónico se encuentra (p. ej., `353a03f21e534321f5d6e267.sqlite`).

Cada una de estas bases de datos se cifra con su contraseña (que solo usted conoce) mediante [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poli1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Esto significa que sus buzones de correo están cifrados individualmente, son autónomos ([en un entorno aislado](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) y son portátiles.

Hemos ajustado SQLite con el siguiente [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Objetivo |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Consulte `better-sqlite3-multiple-ciphers` en [Projects](#projects) para obtener más información. |
| `key="****************"` | Esta es su contraseña descifrada, solo en memoria, que se transmite a través de la conexión IMAP de su cliente de correo electrónico a nuestro servidor. Se crean y cierran nuevas instancias de la base de datos para cada sesión de lectura y escritura (para garantizar el aislamiento y el uso de sandbox). |
| `journal_model=WAL` | Registro de escritura anticipada ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Evita errores de bloqueo de escritura [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Aumenta la durabilidad de las transacciones [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Exige que se apliquen las referencias de clave externa (por ejemplo, una relación de una tabla a otra). [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), pero para la validación y la integridad de los datos debe estar habilitado. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) a utilizar para garantizar la cordura del desarrollador. |

> Todos los demás valores predeterminados son de SQLite como se especifica en [documentación oficial de PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concurrencia {#concurrency}

> **tldr;** Usamos `WebSocket` para lecturas y escrituras simultáneas en sus buzones de correo SQLite cifrados.

#### Lee {#reads}

Es posible que su cliente de correo electrónico en su teléfono resuelva `imap.forwardemail.net` en una de nuestras direcciones IP de Digital Ocean, y es posible que su cliente de escritorio resuelva una IP separada de un [proveedor](#providers) completamente diferente.

Independientemente del servidor IMAP al que se conecte su cliente de correo electrónico, queremos que la conexión lea datos de su base de datos en tiempo real con una precisión del 100 %. Esto se realiza mediante WebSockets.

#### Escribe {#writes}

Escribir en su base de datos es un poco diferente, ya que SQLite es una base de datos integrada y su buzón de correo reside en un único archivo de manera predeterminada.

Habíamos explorado opciones como `litestream`, `rqlite` y `dqlite` a continuación; sin embargo, ninguna de ellas satisfizo nuestros requisitos.

Para realizar escrituras con el registro de escritura anticipada ("[WAL](https://www.sqlite.org/wal.html)") habilitado, debemos asegurarnos de que solo un servidor ("Principal") sea responsable de ello. [WAL](https://www.sqlite.org/wal.html) acelera drásticamente la concurrencia y permite un escritor y varios lectores.

El servidor principal se ejecuta en los servidores de datos con los volúmenes montados que contienen los buzones cifrados. Desde una perspectiva de distribución, se podrían considerar todos los servidores IMAP individuales detrás de `imap.forwardemail.net` como servidores secundarios ("Secundarios").

Realizamos una comunicación bidireccional con [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Los servidores principales utilizan una instancia del servidor `WebSocketServer` de [ws](https://github.com/websockets/ws).
* Los servidores secundarios utilizan una instancia del cliente `WebSocket` de [ws](https://github.com/websockets/ws), que está encapsulado con [websocket según lo prometido](https://github.com/vitalets/websocket-as-promised) y [reconexión de websocket](https://github.com/opensumi/reconnecting-websocket). Estos dos encapsuladores garantizan que `WebSocket` se reconecte y pueda enviar y recibir datos para escrituras específicas en la base de datos.

### Copias de seguridad {#backups}

**tldr;** Las copias de seguridad de sus buzones cifrados se realizan a diario. También puede solicitar una nueva copia de seguridad al instante o descargar la última en cualquier momento desde <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias.

Para las copias de seguridad, simplemente ejecutamos el comando SQLite `VACUUM INTO` diariamente durante el procesamiento de comandos IMAP, lo que aprovecha su contraseña cifrada desde una conexión IMAP en memoria. Las copias de seguridad se almacenan si no se detecta ninguna copia de seguridad existente o si el hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) ha cambiado en el archivo en comparación con la copia de seguridad más reciente.

Tenga en cuenta que usamos el comando `VACUUM INTO` en lugar del comando integrado `backup`, ya que si se modifica una página durante una operación con el comando `backup`, debe reiniciarse. El comando `VACUUM INTO` tomará una instantánea. Consulte los comentarios sobre [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) y [Noticias de hackers](https://news.ycombinator.com/item?id=31387556) para obtener más información.

Además, utilizamos `VACUUM INTO` en lugar de `backup`, porque el comando `backup` dejaría la base de datos sin cifrar durante un breve período hasta que se invoca `rekey` (consulte este [comentario](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) de GitHub para obtener más información).

El secundario le indicará al principal a través de la conexión `WebSocket` que ejecute la copia de seguridad, y el principal luego recibirá el comando para hacerlo y posteriormente:

1. Conéctese a su buzón cifrado.
2. Adquiera un bloqueo de escritura.
3. Ejecute un punto de control WAL mediante `wal_checkpoint(PASSIVE)`.
4. Ejecute el comando SQLite `VACUUM INTO`.
5. Asegúrese de que el archivo copiado se pueda abrir con la contraseña cifrada (protección).
6. Súbalo a Cloudflare R2 para su almacenamiento (o a su propio proveedor, si se especifica).

7. Comprima el archivo de respaldo resultante con `gzip`.

8. Súbalo a Cloudflare R2 para su almacenamiento (o a su propio proveedor, si se especifica).

--

Recuerde que sus buzones de correo están encriptados y, si bien tenemos restricciones de IP y otras medidas de autenticación para la comunicación WebSocket, en el caso de un actor malicioso, puede estar seguro de que, a menos que la carga útil de WebSocket tenga su contraseña IMAP, no podrá abrir su base de datos.

En este momento solo se almacena una copia de seguridad por buzón, pero en el futuro podremos ofrecer recuperación en un punto determinado del tiempo ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Buscar {#search}

Nuestros servidores IMAP admiten el comando `SEARCH` con consultas complejas, expresiones regulares y más.

El rendimiento de búsqueda rápido es gracias a [FTS5](https://www.sqlite.org/fts5.html) y [expresiones regulares de sqlite](https://github.com/asg017/sqlite-regex#sqlite-regex).

Almacenamos valores `Date` en los buzones de correo SQLite como cadenas [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) a través de [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (con zona horaria UTC para que las comparaciones de igualdad funcionen correctamente).

También se almacenan índices para todas las propiedades que se encuentran en las consultas de búsqueda.

### Proyectos {#projects}

A continuación se muestra una tabla que describe los proyectos que utilizamos en nuestro código fuente y proceso de desarrollo (ordenados alfabéticamente):

| Proyecto | Objetivo |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Plataforma de automatización DevOps para mantener, escalar y administrar toda nuestra flota de servidores con facilidad. |
| [Bree](https://github.com/breejs/bree) | Programador de trabajos para Node.js y JavaScript con cron, fechas, ms, later y soporte amigable para humanos. |
| [Cabin](https://github.com/cabinjs/cabin) | Biblioteca de registro de JavaScript y Node.js fácil de usar para desarrolladores, teniendo en cuenta la seguridad y la privacidad. |
| [Lad](https://github.com/ladjs/lad) | Marco Node.js que impulsa toda nuestra arquitectura y diseño de ingeniería con MVC y más. |
| [MongoDB](https://www.mongodb.com/) | Solución de base de datos NoSQL que utilizamos para almacenar todos los demás datos fuera de los buzones de correo (por ejemplo, su cuenta, configuraciones, dominios y configuraciones de alias). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modelado de documentos de objetos ("ODM") de MongoDB, que utilizamos en toda nuestra pila. Creamos ayudantes especiales que nos permiten seguir usando **Mongoose con SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js es el entorno de ejecución de JavaScript multiplataforma y de código abierto que ejecuta todos nuestros procesos de servidor. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Paquete Node.js para enviar correos electrónicos, crear conexiones y más. Somos patrocinadores oficiales de este proyecto. |
| [Redis](https://redis.io/) | Base de datos en memoria para almacenamiento en caché, canales de publicación/suscripción y solicitudes DNS sobre HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Extensión de cifrado para SQLite que permite cifrar archivos de base de datos completos (incluido el registro de escritura anticipada ("[WAL](https://www.sqlite.org/wal.html)"), el diario, la reversión, etc.). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Editor visual de SQLite (que también puedes usar) para probar, descargar y ver buzones de desarrollo. |
| [SQLite](https://www.sqlite.org/about.html) | Capa de base de datos integrada para un almacenamiento IMAP escalable, autónomo, rápido y resistente. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Herramienta de prevención de phishing, filtrado de correo electrónico y antispam de Node.js (nuestra alternativa a [Spam Assassin](https://spamassassin.apache.org/) y [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Solicitudes de DNS sobre HTTPS con Node.js y almacenamiento en caché mediante Redis, lo que garantiza la consistencia global y mucho más. |
| [Thunderbird](https://www.thunderbird.net/) | Nuestro equipo de desarrollo utiliza esto (y también lo recomienda) como **el cliente de correo electrónico preferido para usar con Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Nuestro equipo de desarrollo utiliza esta creación de máquinas virtuales para iOS y macOS para probar diferentes clientes de correo electrónico (en paralelo) con nuestros servidores IMAP y SMTP. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderno sistema operativo de servidor basado en Linux y de código abierto que impulsa toda nuestra infraestructura. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Biblioteca del servidor IMAP: consulte sus notas sobre [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) y [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Biblioteca API rápida y sencilla para que Node.js interactúe con SQLite3 mediante programación. |
| [email-templates](https://github.com/forwardemail/email-templates) | Marco de correo electrónico fácil de usar para desarrolladores que permite crear, obtener una vista previa y enviar correos electrónicos personalizados (por ejemplo, notificaciones de cuenta y más). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Generador de consultas SQL con sintaxis estilo Mongo. Esto ahorra tiempo a nuestro equipo de desarrollo, ya que podemos seguir escribiendo en estilo Mongo en toda la pila con un enfoque independiente de la base de datos. **También ayuda a evitar ataques de inyección SQL mediante el uso de parámetros de consulta.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Utilidad SQL para extraer información sobre el esquema de base de datos existente. Esto nos permite validar fácilmente la validez de todos los índices, tablas, columnas, restricciones, etc., y que cumplan con `1:1`. Incluso desarrollamos asistentes automatizados para agregar nuevas columnas e índices si se realizan cambios en los esquemas de base de datos (con alertas de error muy detalladas). |
| [knex](https://github.com/knex/knex) | Generador de consultas SQL que utilizamos únicamente para migraciones de bases de datos y validación de esquemas a través de `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Traducción automática de frases [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) con soporte para Markdown usando [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Paquete Node.js para resolver y establecer conexiones con servidores MX y manejar errores. |
| [pm2](https://github.com/Unitech/pm2) | Administrador de procesos de producción Node.js con balanceador de carga integrado ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) para rendimiento). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Biblioteca de servidor SMTP: la usamos para nuestros servidores de intercambio de correo ("MX") y SMTP salientes. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Herramienta útil para probar servidores IMAP según parámetros de referencia y la compatibilidad del protocolo IMAP con la especificación RFC. Este proyecto fue creado por el equipo [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (un servidor IMAP y POP3 de código abierto activo desde julio de 2002). Realizamos pruebas exhaustivas de nuestro servidor IMAP con esta herramienta. |

> Puede encontrar otros proyectos que usamos en [nuestro código fuente en GitHub](https://github.com/forwardemail).

### Proveedores {#providers}

| Proveedor | Objetivo |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Proveedor de DNS, controles de estado, balanceadores de carga y almacenamiento de respaldo mediante [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Alojamiento de servidores dedicados y bases de datos administradas. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Alojamiento de servidores dedicados. |
| [DataPacket](https://www.datapacket.com) | Alojamiento de servidores dedicados. |

## Pensamientos {#thoughts}

### Principios {#principles}

El reenvío de correo electrónico está diseñado según estos principios:

1. Sea siempre accesible para los desarrolladores, priorice la seguridad y la privacidad, y sea transparente.

2. Cumpla con [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Factor Doce](https://12factor.net/), [La navaja de Occam](https://en.wikipedia.org/wiki/Occam%27s_razor) y [pruebas de perros](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).

3. Diríjase a los desarrolladores fragmentados, con bootstrap y [ramen rentable](http://www.paulgraham.com/ramenprofitable.html).

### Experimentos {#experiments}

> **tldr;** En última instancia, el uso de almacenamiento de objetos compatibles con S3 y/o tablas virtuales no es técnicamente factible por razones de rendimiento y son propensos a errores debido a limitaciones de memoria.

Hemos realizado algunos experimentos hasta llegar a nuestra solución SQLite final, como se mencionó anteriormente.

Una de ellas fue intentar utilizar [rclone]() y SQLite junto con una capa de almacenamiento compatible con S3.

Ese experimento nos llevó a comprender mejor y descubrir casos extremos relacionados con el uso de rclone, SQLite y [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Si habilita el indicador `--vfs-cache-mode writes` con rclone, las lecturas serán correctas; sin embargo, las escrituras se almacenarán en caché.
* Si tiene varios servidores IMAP distribuidos globalmente, la caché estará desactivada entre ellos, a menos que tenga un solo escritor y varios receptores (por ejemplo, un enfoque de publicación/suscripción).
* Esto es increíblemente complejo y añadir cualquier complejidad adicional como esta resultará en más puntos únicos de fallo.
* Los proveedores de almacenamiento compatibles con S3 no admiten cambios parciales de archivos, lo que significa que cualquier cambio en el archivo `.sqlite` resultará en un cambio completo y la recarga de la base de datos.
* Existen otras soluciones como `rsync`, pero no se centran en la compatibilidad con el registro de escritura anticipada ("[WAL](https://www.sqlite.org/wal.html)"), por lo que terminamos revisando Litestream. Afortunadamente, nuestro cifrado ya cifra los archivos [WAL](https://www.sqlite.org/wal.html), por lo que no necesitamos depender de Litestream para ello. Sin embargo, aún no teníamos confianza en Litestream para su uso en producción y presentamos algunas notas al respecto a continuación.
* Usar esta opción de `--vfs-cache-mode writes` (la *única* forma de usar SQLite en lugar de `rclone` para escrituras) intentará copiar toda la base de datos desde cero en memoria. Gestionar un buzón de 10 GB es correcto; sin embargo, gestionar varios buzones con un almacenamiento excesivamente grande provocará que los servidores IMAP experimenten limitaciones de memoria y errores `ENOMEM`, fallos de segmentación y corrupción de datos. * Si intenta usar SQLite [Mesas virtuales](https://www.sqlite.org/vtab.html) (p. ej., [s3db](https://github.com/jrhy/s3db)) para mantener los datos activos en una capa de almacenamiento compatible con S3, se encontrará con varios problemas adicionales:
* La lectura y la escritura serán extremadamente lentas, ya que los endpoints de la API de S3 deberán accederse con los métodos HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 y `.sqlite`3.
* Las pruebas de desarrollo mostraron que superar los 500 000 a más de 1 000 000 registros en internet por fibra óptica sigue estando limitado por el rendimiento de escritura y lectura de proveedores compatibles con S3. Por ejemplo, nuestros desarrolladores ejecutaron bucles `.sqlite`4 para ejecutar tanto sentencias SQL `.sqlite`5 secuenciales como para escribir grandes cantidades de datos de forma masiva. En ambos casos, el rendimiento fue sorprendentemente lento. * Las tablas virtuales **no pueden tener índices**, las sentencias `.sqlite`6 y `.sqlite`7 y `.sqlite`8, lo que provoca retrasos de hasta 1 o 2 minutos o más, dependiendo de la cantidad de datos.
* Los objetos se almacenaron sin cifrar y no existe compatibilidad con cifrado nativo disponible.
* También exploramos el uso de `.sqlite`9, que es similar conceptual y técnicamente al punto anterior (por lo que presenta los mismos problemas). Una posibilidad sería usar una compilación `rsync`0 personalizada con cifrado, como `rsync`1 (que usamos actualmente en nuestra solución anterior) a través de `rsync`2.
* Otro enfoque posible era usar `rsync`3; sin embargo, esto tiene una limitación de 32 GB y requeriría complejos procesos de compilación y desarrollo. * Se requieren las sentencias `rsync`4 (por lo que esto descarta por completo el uso de tablas virtuales). Necesitamos las sentencias `rsync`5 para que nuestro enlace con `rsync`6 funcione correctamente, lo que garantiza que los datos no se corrompan y que las filas recuperadas se puedan convertir en documentos válidos según nuestras definiciones de esquema `rsync`7 (que incluyen restricciones, tipos de variable y validación de datos arbitrarios).
* Casi todos los proyectos compatibles con S3 relacionados con SQLite en la comunidad de código abierto están en Python (y no en JavaScript, que utilizamos para el 100% de nuestra pila).
* Las bibliotecas de compresión como `rsync`8 (véase `rsync`9) parecen prometedoras, pero __PROTECTED_LINK_189__0. En cambio, la compresión del lado de la aplicación en tipos de datos como __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 y __PROTECTED_LINK_189__6 será un enfoque más limpio y sencillo (y también más fácil de migrar, ya que podríamos almacenar un indicador o columna __PROTECTED_LINK_189__7, o incluso usar __PROTECTED_LINK_189__8 y __PROTECTED_LINK_189__9 para la compresión o __PROTECTED_LINK_190__0 para no comprimir como metadatos de la base de datos).
* Afortunadamente, ya implementamos la deduplicación de adjuntos en el almacenamiento de nuestro servidor IMAP; por lo tanto, cada mensaje con el mismo adjunto no conservará una copia del mismo; en su lugar, se almacena un único adjunto para múltiples mensajes e hilos en un buzón (y posteriormente se utiliza una referencia externa). * El proyecto Litestream, una solución de replicación y copia de seguridad de SQLite, es muy prometedor y probablemente lo usaremos en el futuro.
* Sin ánimo de desacreditar al/a los autor(es), ya que apreciamos su trabajo y sus contribuciones al código abierto durante más de una década, sin embargo, a partir del uso real, parece que existen __PROTECTED_LINK_190__1 y __PROTECTED_LINK_190__2.
* La restauración de copias de seguridad debe ser sencilla y fácil de usar. Usar una solución como MongoDB con __PROTECTED_LINK_190__3 y __PROTECTED_LINK_190__4 no solo es tedioso, sino que requiere mucho tiempo y presenta una configuración compleja.
* Las bases de datos SQLite lo simplifican (es un solo archivo).
* Queríamos diseñar una solución donde los usuarios pudieran retirar su buzón de correo y salir en cualquier momento.
* Comandos sencillos de Node.js para __PROTECTED_LINK_190__5 y se borra permanentemente del almacenamiento en disco. * De manera similar, podemos usar una API compatible con S3 con HTTP __PROTECTED_LINK_190__6 para eliminar fácilmente instantáneas y copias de seguridad para los usuarios.
* SQLite fue la solución más sencilla, rápida y rentable.

### Falta de alternativas {#lack-of-alternatives}

Hasta donde sabemos, ningún otro servicio de correo electrónico está diseñado de esta manera ni es de código abierto.

Creemos que esto podría deberse a que los servicios de correo electrónico existentes tienen tecnología heredada en producción con [código espagueti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

La mayoría, si no todos, los proveedores de servicios de correo electrónico existentes son de código cerrado o se anuncian como de código abierto, **pero en realidad solo su interfaz es de código abierto.**

**La parte más sensible del correo electrónico** (la interacción real de almacenamiento/IMAP/SMTP) **se realiza en el back-end (servidor), y *no* en el front-end (cliente)**.

### Pruebe el reenvío de correo electrónico {#try-out-forward-email}

Regístrate hoy en <https://forwardemail.net>! :rocket: