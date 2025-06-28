# Quantum Resistant Email: How we use encrypted SQLite mailboxes to keep your email safe

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />


## Table of Contents

* [Foreword](#foreword)
* [Email service provider comparison](#email-service-provider-comparison)
* [How does it work](#how-does-it-work)
* [Technologies](#technologies)
  * [Databases](#databases)
  * [Security](#security)
  * [Mailboxes](#mailboxes)
  * [Concurrency](#concurrency)
  * [Backups](#backups)
  * [Search](#search)
  * [Projects](#projects)
  * [Providers](#providers)
* [Thoughts](#thoughts)
  * [Principles](#principles)
  * [Experiments](#experiments)
  * [Lack of alternatives](#lack-of-alternatives)
  * [Try out Forward Email](#try-out-forward-email)


## Foreword

> \[!IMPORTANT]
> Our email service is [100% open-source](https://github.com/forwardemail) and privacy-focused through secure and encrypted SQLite mailboxes.

Until we launched [IMAP support](/faq#do-you-support-receiving-email-with-imap), we used MongoDB for our persistent data storage needs.

This technology is amazing and we still use it today – but in order to have encryption-at-rest with MongoDB you need to use a provider that offers MongoDB Enterprise, such as Digital Ocean or Mongo Atlas – or pay for an enterprise license (and subsequently have to work with sales team latency).

Our team at [Forward Email](https://forwardemail.net) needed a developer-friendly, scalable, reliable, and encrypted storage solution for IMAP mailboxes.  As open-source developers, using a technology you need to pay a license fee in order to get the encryption-at-rest feature was against [our principles](#principles) – and so we experimented, researched, and developed a new solution from scratch to solve these needs.

Instead of using a shared database to store your mailboxes, we individually store and encrypt your mailboxes with your password (which only you have).  **Our email service is so secure that if you forget your password, then you lose your mailbox** (and need to recover with offline backups or start over).

Keep reading as we take a deep dive below with a [comparison of email service providers](#email-service-provider-comparison), [how our service works](#how-does-it-work), [our technology stack](#technologies), and more.


## Email service provider comparison

We are the only 100% open-source and privacy-focused email service provider that stores individually encrypted SQLite mailboxes, offers unlimited domains, aliases, and users, and has outbound SMTP, IMAP, and POP3 support:

**Unlike other email providers, you do not need to pay for storage on a per domain or alias basis with Forward Email.**  Storage is shared across your entire account – so if you have multiple custom domain names and multiple aliases on each, then we are the perfect solution for you.  Note that you can still enforce storage limits if desired on a per domain or alias basis.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Read Email Service Comparison <i class="fa fa-search-plus"></i></a>


## How does it work

1. Using your email client such as Apple Mail, Thunderbird, Gmail, or Outlook – you connect to our secure [IMAP](/faq#do-you-support-receiving-email-with-imap) servers using your username and password:

   * Your username is your full alias with your domain such as `hello@example.com`.
   * Your password is randomly generated and only displayed to you for 30 seconds when you click <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> from <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases.

2. Once connected, your email client will send [IMAP protocol commands](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) to our IMAP server to keep your mailbox in sync.  This includes writing and storing draft emails and other actions you might do (e.g. label an email as Important or flag an email as Spam/Junk Mail).

3. Mail exchange servers (commonly known as "MX" servers) receive new inbound email and store it to your mailbox.  When this happens your email client will get notified and sync your mailbox.  Our mail exchange servers can forward your email to one or more recipients (including [webhooks](/faq#do-you-support-webhooks)), store your email for you in your encrypted IMAP storage with us, **or both**!

   > \[!TIP]
   > Interested in learning more? Read [how to setup email forwarding](/faq#how-do-i-get-started-and-set-up-email-forwarding), [how our mail exchange service works](/faq#how-does-your-email-forwarding-system-work), or view [our guides](/guides).

4. Behind the scenes, our secure email storage design works in two ways to keep your mailboxes encrypted and only accessible by you:

   * When new mail is received for you from a sender, our mail exchange servers write to an individual, temporary, and encrypted mailbox for you.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

   * When you connect to our IMAP server with your email client, your password is then encrypted in-memory and used to read and write to your mailbox.  Your mailbox can only be read from and written to with this password.  Keep in mind that since you are the only one with this password, **only you** can read and write to your mailbox when you are accessing it.  The next time your email client attempts to poll for mail or syncs, your new messages will be transferred from this temporary mailbox and stored in your actual mailbox file using your supplied password.  Note that this temporary mailbox is purged and deleted afterwards so that only your password protected mailbox has the messages.

   * **If you are connected to IMAP (e.g. using an email client such as Apple Mail or Thunderbird), then we do not need to write to temporary disk storage.  Your in-memory encrypted IMAP password is instead fetched and used.  In real-time, when a message is attempting to be delivered to you, we send a WebSocket request to all IMAP servers asking them if they have an active session for you (this is the fetch part), and then subsequently will pass along that encrypted in-memory password – so we don't need to write to a temporary mailbox, we can write to your actual encrypted mailbox using your encrypted password.**

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

5. [Backups of your encrypted mailboxes](#backups) are made daily.  You can also request a new backup at any time or download the latest backup from <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases.  If you decide to switch to another email service, then you can easily migrate, download, export, and purge your mailboxes and backups at anytime.


## Technologies

### Databases

We explored other possible database storage layers, however none satisfied our requirements as much as SQLite did:

| Database                                               |                                                                    Encryption-at-rest                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Mailboxes  |                           License                           | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Yes with [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relational database                               |                   :x: AGPL and `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Network only](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relational database                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relational database                               | :white_check_mark: `PostgreSQL` (similar to `BSD` or `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relational database                               |          :white_check_mark: `GPLv2` and `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relational database                               |                  :x: `BUSL-1.1` and others                  |                             :x:                             |

> Here is a [blog post that compares several SQLite database storage options](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) in the table above.

### Security

At all times we use [encryption-at-rest](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [encryption-in-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") using :tangerine: [Tangerine](https://tangeri.ne), and [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) encryption on mailboxes.  Additionally we use token-based two-factor authentication (as opposed to SMS which is suspectible to [man-in-the-middle-attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), rotated SSH keys with root access disabled, exclusive access to servers through restricted IP addresses, and more.

In the event of an [evil maid attack](https://en.wikipedia.org/wiki/Evil_maid_attack) or rogue employee from a third-party vendor, **your mailbox can still only be opened with your generated password**.  Rest assured, we don't rely upon any third-party vendors other than our SOC Type 2 complaint server providers of Cloudflare, DataPacket, Digital Ocean, and Vultr.

Our goal is to have as few [single point of failures](https://en.wikipedia.org/wiki/Single_point_of_failure) as possible.

### Mailboxes

> **tldr;** Our IMAP servers use individually encrypted SQLite databases for each of your mailboxes.

[SQLite is an extremely popular](https://www.sqlite.org/mostdeployed.html) embedded database – it's currently running on your phone and computer – [and used by nearly all major technologies](https://www.sqlite.org/famous.html).

For example, on our encrypted servers there's a SQLite database mailbox for `linux@example.com`, `info@example.com`, `hello@example.com` and so on – one for each as a `.sqlite` database file.  We don't name the database files with the email address either – instead we use BSON ObjectID and unique UUID's generated which do not share who the mailbox belongs to or which email address it is under (e.g. `353a03f21e534321f5d6e267.sqlite`).

Each of these databases are encrypted themselves using your password (which only you have) using [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)).  This means that your mailboxes are individually encrypted, self-contained, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)), and portable.

We have fine-tuned SQLite with the following [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Purpose                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Reference `better-sqlite3-multiple-ciphers` under [Projects](#projects) for more insight.                                 |
| `key="****************"` | This is your decrypted in-memory only password that gets passed through your email client's IMAP connection to our server.  New database instances are created and closed for each read and write session (in order to ensure sandboxing and isolation). |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode).                                                                                   |
| `busy_timeout=5000`      | Prevents write-lock errors [while other writes are taking place](https://litestream.io/tips/#busy-timeout).                                                                                                                                              |
| `synchronous=NORMAL`     | Increases durability of transactions [without data corruption risk](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                     |
| `foreign_keys=ON`        | Enforces that foreign key references (e.g. a relation from one table to another) are enforced.  [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), but for validation and data integrity it should be enabled.       |
| `encoding='UTF-8'`       | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) to use to ensure developer sanity.                                                                                                                                                |

> All other defaults are from SQLite as specified from the [official PRAGMA documentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concurrency

> **tldr;** We use `WebSocket` for concurrent reads and writes to your encrypted SQLite mailboxes.

#### Reads

Your email client on your phone may resolve `imap.forwardemail.net` to one of our Digital Ocean IP addresses – and your desktop client may resolve a separate IP from a different [provider](#providers) altogether.

Regardless of which IMAP server your email client connects to, we want the connection to read from your database in real-time with 100% accuracy.  This is done through WebSockets.

#### Writes

Writing to your database is a bit different – since SQLite is an embedded database and your mailbox lives in a single file by default.

We had explored options such as `litestream`, `rqlite`, and `dqlite` below – however none of these satisfied our requirements.

To accomplish writes with write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") enabled – we need to ensure that only one server ("Primary") is responsible for doing so.  [WAL](https://www.sqlite.org/wal.html) drastically speeds up concurrency and allows one writer and multiple readers.

The Primary is running on the data servers with the mounted volumes containing the encrypted mailboxes.  From a distribution standpoint, you could consider all the individual IMAP servers behind `imap.forwardemail.net` to be secondary servers ("Secondary").

We accomplish two-way communication with [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primary servers use an instance of [ws](https://github.com/websockets/ws)'s `WebSocketServer` server.
* Secondary servers use an instance of [ws](https://github.com/websockets/ws)'s `WebSocket` client that is wrapped with [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) and [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket).  These two wrappers ensure that the `WebSocket` reconnects and can send and receive data for specific database writes.

### Backups

> **tldr;** Backups of your encrypted mailboxes are made daily.  You can also instantly request a new backup or download the latest backup at anytime from <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases.

For backups, we simply run the SQLite `VACUUM INTO` command every day during IMAP command processing, which leverages your encrypted password from an in-memory IMAP connection.  Backups are stored if no existing backup is detected or if the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash has changed on the file as compared to the most recent backup.

Note that we use the `VACUUM INTO` command as opposed to the built-in `backup` command because if a page is modified during a `backup` command operation, then it has to start over.  The `VACUUM INTO` command will take a snapshot.  See these comments on [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) and [Hacker News](https://news.ycombinator.com/item?id=31387556) for more insight.

Additionally we use `VACUUM INTO` as opposed to `backup`, because the `backup` command would leave the database unencrypted for a brief period until `rekey` is invoked (see this GitHub [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) for insight).

The Secondary will instruct the Primary over the `WebSocket` connection to execute the backup – and the Primary will then receive the command to do so and will subsequently:

1. Connect to your encrypted mailbox.
2. Acquire a write lock.
3. Run a WAL checkpoint via `wal_checkpoint(PASSIVE)`.
4. Run the `VACUUM INTO` SQLite command.
5. Ensure that the copied file can be opened with the encrypted password (safeguard/dummyproofing).
6. Upload it to Cloudflare R2 for storage (or your own provider if specified).

<!--
7. Compress the resulting backup file with `gzip`.
8. Upload it to Cloudflare R2 for storage (or your own provider if specified).
-->

Remember that your mailboxes are encrypted – and while we have IP restrictions and other authentication measures in place for WebSocket communication – in the event of a bad actor, you can rest assured that unless the WebSocket payload has your IMAP password, it cannot open your database.

Only one backup is stored per mailbox at this time, but in the future we may offer point-in-time-recovery ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Search

Our IMAP servers support the `SEARCH` command with complex queries, regular expressions, and more.

Fast search performance is thanks to [FTS5](https://www.sqlite.org/fts5.html) and [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

We store `Date` values in the SQLite mailboxes as [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) strings via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (with UTC timezone for equality comparisons to function properly).

Indices are also stored for all properties that are in search queries.

### Projects

Here's a table outlining projects we use in our source code and development process (sorted alphabetically):

| Project                                                                                       | Purpose                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | DevOps automation platform for maintaing, scaling, and managing our entire fleet of servers with ease.                                                                                                                                                                                                                                                               |
| [Bree](https://github.com/breejs/bree)                                                        | Job scheduler for Node.js and JavaScript with cron, dates, ms, later, and human-friendly support.                                                                                                                                                                                                                                                                    |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Developer-friendly JavaScript and Node.js logging library with security and privacy in mind.                                                                                                                                                                                                                                                                         |
| [Lad](https://github.com/ladjs/lad)                                                           | Node.js framework which powers our entire architecture and engineering design with MVC and more.                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL database solution that we use for storing all other data outside of mailboxes (e.g. your account, settings, domains, and alias configurations).                                                                                                                                                                                                                |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB object document modeling ("ODM") which we use across our entire stack.  We wrote special helpers that allow us to simply continue using **Mongoose with SQLite** :tada:                                                                                                                                                                                      |
| [Node.js](https://nodejs.org/en)                                                              | Node.js is the open-source, cross-platform JavaScript runtime environment which runs all of our server processes.                                                                                                                                                                                                                                                    |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Node.js package for sending emails, creating connections, and more.  We are an official sponsor of this project.                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                    | In-memory database for caching, publish/subscribe channels, and DNS over HTTPS requests.                                                                                                                                                                                                                                                                             |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Encryption extension for SQLite to allow entire database files to be encrypted (including the write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                                     |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Visual SQLite editor (which you could also use) to test, download, and view development mailboxes.                                                                                                                                                                                                                                                                   |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Embedded database layer for scalable, self-contained, fast, and resilient IMAP storage.                                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js anti-spam, email filtering, and phishing prevention tool (our alternative to [Spam Assassin](https://spamassassin.apache.org/) and [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                               | DNS over HTTPS requests with Node.js and caching using Redis – which ensures global consistency and much more.                                                                                                                                                                                                                                                       |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Our development team uses this (and recommends this too) as **the preferred email client to use with Forward Email**.                                                                                                                                                                                                                                                |
| [UTM](https://github.com/utmapp/UTM)                                                          | Our development team uses this create virtual machines for iOS and macOS in order to test different email clients (in parallel) with our IMAP and SMTP servers.                                                                                                                                                                                                      |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Modern open-source Linux-based server operating system which powers all of our infrastructure.                                                                                                                                                                                                                                                                       |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP server library – see its notes on [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) and [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                  |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Fast and simple API library for Node.js to interact with SQLite3 programmatically.                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Developer-friendly email framework to create, preview, and send custom emails (e.g. account notifications and more).                                                                                                                                                                                                                                                 |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL query builder using Mongo-style syntax.  This saves our development team time since we can continue to write in Mongo-style across the entire stack with a database agnostic approach.  **It also helps to avoid SQL injection attacks by using query parameters.**                                                                                              |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL utility to extract information about existing database schema. This allows us to easily validate that all indices, tables, columns, constraints, and more are valid and are `1:1` with how they should be.  We even wrote automated helpers to add new columns and indexes if changes are made to database schemas (with extremely detailed error alerting too). |
| [knex](https://github.com/knex/knex)                                                          | SQL query builder which we use only for database migrations and schema validation through `knex-schema-inspector`.                                                                                                                                                                                                                                                   |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatic [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) phrase translation with support for Markdown using [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                     |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Node.js package to resolve and establish connections with MX servers and handle errors.                                                                                                                                                                                                                                                                              |
| [pm2](https://github.com/Unitech/pm2)                                                         | Node.js production process manager with built-in load balancer ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) for performance).                                                                                                                                                                                                   |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP server library – we use this for our mail exchange ("MX") and outbound SMTP servers.                                                                                                                                                                                                                                                                            |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Useful tool for testing IMAP servers against benchmarks and RFC specification IMAP protocol compatibility.  This project was created by the [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) team (an active open-source IMAP and POP3 server from July 2002). We extensively tested our IMAP server with this tool.                                    |

> You can find other projects we use in [our source code on GitHub](https://github.com/forwardemail).

### Providers

| Provider                                        | Purpose                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS provider, health checks, load balancers, and backup storage using [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedicated server hosting and managed databases.                                                                              |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Dedicated server hosting.                                                                                                    |
| [DataPacket](https://www.datapacket.com)        | Dedicated server hosting.                                                                                                    |


## Thoughts

### Principles

Forward Email is designed according to these principles:

1. Always be developer-friendly, security and privacy-focused, and transparent.
2. Adhere to [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), and [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Target the scrappy, bootstrapped, and [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) developer

### Experiments

> **tldr;** Ultimately using S3-compatible object storage and/or Virtual Tables are not technically feasible for performance reasons and prone to error due to memory limitations.

We have done a few experiments leading up to our final SQLite solution as discussed above.

One of these was to try using [rclone]() and SQLite together with an S3-compatible storage layer.

That experiment led us to further understand and discover edge cases surrounding rclone, SQLite, and [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) usage:

* If you enable `--vfs-cache-mode writes` flag with rclone, then reads will be OK, however writes will get cached.
  * If you have multiple IMAP servers distributed globally, then the cache will be off across them unless you have a single writer and multiple listeners (e.g. a pub/sub approach).
  * This is incredibly complex and adding any additional complexity like this will result in more single points of failure.
  * S3-compatible storage providers do not support partial file changes – which means any change of the `.sqlite` file will result in a complete change and re-upload of the database.
  * Other solutions like `rsync` exist, but they are not focused on write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") support – so we ended up reviewing Litestream.  Fortunately our encryption usage already encrypts the [WAL](https://www.sqlite.org/wal.html) files for us, so we do not need to rely on Litestream for that.  However we weren't yet confident in Litestream for production-use and have a few notes below on that.
  * Using this option of `--vfs-cache-mode writes` (the *only* way to use SQLite over `rclone` for writes) will attempt to copy the entire database from scratch in-memory – handling one 10 GB mailbox is OK, however handling multiple mailboxes with exceedingly high storage will cause the IMAP servers to run into memory limitations and `ENOMEM` errors, segmentation faults, and data corruption.
* If you attempt to use SQLite [Virtual Tables](https://www.sqlite.org/vtab.html) (e.g. using [s3db](https://github.com/jrhy/s3db)) in order to have data live on an S3-compatible storage layer, then you will run into several more issues:
  * Read and writes will be extremely slow as S3 API endpoints will need to be hit with HTTP `GET`, `PUT`, `HEAD`, and `POST` methods.
  * Development tests showed that exceeding 500K-1M+ records on fiber internet is still limited by the throughput of writing and reading to S3-compatible providers.  For example, our developers ran `for` loops to do both sequential SQL `INSERT` statements and ones that bulk wrote large amounts of data.  In both cases the performance was staggeringly slow.
  * Virtual tables **cannot have indexes**, `ALTER TABLE` statements, and [other](https://stackoverflow.com/a/12507650) [limitations](https://sqlite.org/lang_createvtab.html) – which leads to delays upwards of 1-2 minutes or more depending on the amount of data.
  * Objects were stored unencrypted and no native encryption support is readily available.
* We also explored using [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) which is similar conceptually and technically to the previous bullet point (so it has the same issues).  A possibility would be to use a custom `sqlite3` build wrapped with encryption such as [wxSQLite3](https://github.com/utelle/wxsqlite3) (which we currently use in our solution above) through [editing the setup file](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Another potential approach was to use the [multiplex extension](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), however this has a limitation of 32 GB and would require complex building and development headaches.
* `ALTER TABLE` statements are required (so this completely rules out using Virtual Tables).  We need `ALTER TABLE` statements in order for our hook with `knex-schema-inspector` to work properly – which ensures that data is not corrupted and rows retrieved can be converted to valid documents according to our `mongoose` schema definitions (which includes constraint, variable type, and arbitrary data validation).
* Almost all of the S3-compatible projects related to SQLite in the open-source community are in Python (and not JavaScript which we use for 100% of our stack).
* Compression libraries such as [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (see [comments](https://news.ycombinator.com/item?id=32303762)) look promising, but [may not yet be ready for production usage](https://github.com/phiresky/sqlite-zstd#usage).  Instead application-side compression on data types such as `String`, `Object`, `Map`, `Array`, `Set`, and `Buffer` is going to be a cleaner and easier approach (and is easier to migrate too, since we could store a `Boolean` flag or column – or even use `PRAGMA` `user_version=1` for compression or `user_version=0` for no compression as database metadata).
  * Fortunately we already have attachment de-duplication implemented in our IMAP server storage – therefore every message with the same attachment won't keep a copy of the attachment – instead a single attachment is stored for multiple messages and threads in a mailbox (and a foreign reference is subsequently used).
* The project Litestream, which is a SQLite replication and backup solution is very promising and we will most likely use it in the future.
  * Not to discredit the author(s) – because we love their work and contributions to open-source for well over a decade now – however from real-world usage it appears that there [may be a lot of headaches](https://github.com/benbjohnson/litestream/issues) and [potential data loss from usage](https://github.com/benbjohnson/litestream/issues/218).
* Backup restoration needs to be frictionless and trivial.  Using a solution such as MongoDB with `mongodump` and `mongoexport` is not only tedious, but time intensive and has configuration complexity.
  * SQLite databases make it simple (it's a single file).
  * We wanted to design a solution where users could take their mailbox and leave at any moment.
    * Simple Node.js commands to `fs.unlink('mailbox.sqlite'))` and it's permanently erased from disk storage.
    * We can similarly use an S3-compatible API with HTTP `DELETE` to easily remove snapshots and backups for users.
  * SQLite was the simplest, fastest, and most cost-effective solution.

### Lack of alternatives

To our knowledge, no other email services are designed this way nor are they open-source.

We *think this might be due* to existing email services having legacy technology in production with [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Most if not all of existing email service providers are either closed-source or advertise as open-source, **but in reality only their front-end is open-source.**

**The most sensitive part of email** (the actual storage/IMAP/SMTP interaction) **is all done on the back-end (server), and *not* on the front-end (client)**.

### Try out Forward Email

Sign up today at <https://forwardemail.net>! :rocket:
