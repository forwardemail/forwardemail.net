# Quantenresistente E-Mail: So verwenden wir verschlüsselte SQLite-Postfächer, um Ihre E-Mails zu schützen {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Vergleich der E-Mail-Dienstanbieter](#email-service-provider-comparison)
* [Wie funktioniert es](#how-does-it-work)
* [Technologien](#technologies)
  * [Datenbanken](#databases)
  * [Sicherheit](#security)
  * [Postfächer](#mailboxes)
  * [Parallelität](#concurrency)
  * [Backups](#backups)
  * [Suchen](#search)
  * [Projekte](#projects)
  * [Anbieter](#providers)
* [Gedanken](#thoughts)
  * [Grundsätze](#principles)
  * [Experimente](#experiments)
  * [Mangel an Alternativen](#lack-of-alternatives)
  * [Probieren Sie die E-Mail-Weiterleitung aus](#try-out-forward-email)

## Vorwort {#foreword}

> \[!IMPORTANT]
> Unser E-Mail-Dienst ist [100 % Open Source](https://github.com/forwardemail) und bietet durch sichere und verschlüsselte SQLite-Postfächer einen hohen Datenschutz.

Bis wir [IMAP-Unterstützung](/faq#do-you-support-receiving-email-with-imap) gestartet haben, haben wir MongoDB für unsere Anforderungen an die dauerhafte Datenspeicherung verwendet.

Diese Technologie ist erstaunlich und wir verwenden sie noch heute. Um jedoch mit MongoDB eine Verschlüsselung im Ruhezustand zu erreichen, müssen Sie einen Anbieter nutzen, der MongoDB Enterprise anbietet, wie etwa Digital Ocean oder Mongo Atlas, oder für eine Enterprise-Lizenz bezahlen (und anschließend mit der Latenz des Vertriebsteams arbeiten).

Unser Team bei [E-Mail weiterleiten](https://forwardemail.net) benötigte eine entwicklerfreundliche, skalierbare, zuverlässige und verschlüsselte Speicherlösung für IMAP-Postfächer. Als Open-Source-Entwickler war die Nutzung einer Technologie, für die eine Lizenzgebühr für die Verschlüsselung ruhender Daten erforderlich ist, für [Unsere Prinzipien](#principles) ein Problem. Daher experimentierten, forschten und entwickelten wir von Grund auf eine neue Lösung, um diese Anforderungen zu erfüllen.

Anstatt Ihre Postfächer in einer gemeinsamen Datenbank zu speichern, speichern und verschlüsseln wir sie einzeln mit Ihrem Passwort (das nur Sie haben). **Unser E-Mail-Dienst ist so sicher, dass Sie Ihr Postfach verlieren, wenn Sie Ihr Passwort vergessen** (und es mithilfe von Offline-Backups wiederherstellen oder von vorne beginnen müssen).

Lesen Sie weiter, während wir unten einen tieferen Einblick in [Vergleich von E-Mail-Dienstanbietern](#email-service-provider-comparison), [So funktioniert unser Service](#how-does-it-work), [Unser Technologie-Stack](#technologies) und mehr nehmen.

## Vergleich der E-Mail-Dienstanbieter {#email-service-provider-comparison}

Wir sind der einzige 100 % Open Source- und datenschutzorientierte E-Mail-Dienstanbieter, der individuell verschlüsselte SQLite-Postfächer speichert, eine unbegrenzte Anzahl an Domänen, Aliasnamen und Benutzern anbietet und ausgehende SMTP-, IMAP- und POP3-Dienste unterstützt:

**Im Gegensatz zu anderen E-Mail-Anbietern müssen Sie bei Forward Email nicht pro Domain oder Alias für Speicherplatz bezahlen.** Der Speicherplatz wird für Ihr gesamtes Konto gemeinsam genutzt. Wenn Sie also mehrere benutzerdefinierte Domainnamen und jeweils mehrere Aliase haben, sind wir die perfekte Lösung für Sie. Beachten Sie, dass Sie bei Bedarf weiterhin Speicherlimits pro Domain oder Alias festlegen können.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">E-Mail-Dienstvergleich lesen <i class="fa fa-search-plus"></i></a>

## Wie funktioniert es {#how-does-it-work}

1. Mit Ihrem E-Mail-Client wie Apple Mail, Thunderbird, Gmail oder Outlook stellen Sie mit Ihrem Benutzernamen und Passwort eine Verbindung zu unseren sicheren [IMAP](/faq#do-you-support-receiving-email-with-imap)-Servern her:

* Ihr Benutzername ist Ihr vollständiger Alias mit Ihrer Domain, z. B. `hello@example.com`.
* Ihr Passwort wird zufällig generiert und Ihnen nur 30 Sekunden lang angezeigt, wenn Sie unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase auf <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> klicken.

2. Sobald die Verbindung hergestellt ist, sendet Ihr E-Mail-Client [IMAP-Protokollbefehle](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) an unseren IMAP-Server, um Ihr Postfach synchron zu halten. Dies umfasst das Schreiben und Speichern von E-Mail-Entwürfen sowie weitere Aktionen (z. B. das Kennzeichnen einer E-Mail als wichtig oder als Spam/Junk-Mail).

3. Mail-Exchange-Server (auch „MX“-Server genannt) empfangen neue E-Mails und speichern sie in Ihrem Postfach. Ihr E-Mail-Client wird benachrichtigt und synchronisiert Ihr Postfach. Unsere Mail-Exchange-Server können Ihre E-Mails an einen oder mehrere Empfänger (einschließlich [Webhooks](/faq#do-you-support-webhooks)) weiterleiten, sie in Ihrem verschlüsselten IMAP-Speicher bei uns speichern oder beides!

> \[!TIP]
> Möchten Sie mehr erfahren? Lesen Sie [So richten Sie die E-Mail-Weiterleitung ein](/faq#how-do-i-get-started-and-set-up-email-forwarding), [So funktioniert unser Mail-Exchange-Service](/faq#how-does-your-email-forwarding-system-work) oder sehen Sie sich [unsere Guides](/guides) an.

4. Hinter den Kulissen sorgt unser sicheres E-Mail-Speicherdesign auf zwei Arten dafür, dass Ihre Postfächer verschlüsselt bleiben und nur Sie darauf zugreifen können:

* Wenn neue E-Mails von einem Absender für Sie eingehen, schreiben unsere Mail-Exchange-Server diese für Sie in ein individuelles, temporäres und verschlüsseltes Postfach.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Wenn Sie sich mit Ihrem E-Mail-Client mit unserem IMAP-Server verbinden, wird Ihr Passwort verschlüsselt und zum Lesen und Schreiben in Ihrem Postfach verwendet. Nur mit diesem Passwort kann Ihr Postfach gelesen und beschrieben werden. Da Sie der Einzige mit diesem Passwort sind, können **nur Sie** Ihr Postfach lesen und beschreiben, wenn Sie darauf zugreifen. Beim nächsten Abruf oder bei der Synchronisierung Ihres E-Mail-Clients werden Ihre neuen Nachrichten aus diesem temporären Postfach übertragen und mit Ihrem angegebenen Passwort in Ihrem aktuellen Postfach gespeichert. Beachten Sie, dass dieses temporäre Postfach anschließend gelöscht wird, sodass nur Ihr passwortgeschütztes Postfach die Nachrichten enthält.

Wenn Sie mit IMAP verbunden sind (z. B. über einen E-Mail-Client wie Apple Mail oder Thunderbird), müssen wir nicht in den temporären Speicher schreiben. Stattdessen wird Ihr verschlüsseltes IMAP-Passwort im Speicher abgerufen und verwendet. Sobald eine Nachricht an Sie zugestellt werden soll, senden wir in Echtzeit eine WebSocket-Anfrage an alle IMAP-Server und fragen nach, ob eine aktive Sitzung für Sie besteht (dies ist der Abrufvorgang). Anschließend leiten wir das verschlüsselte Passwort im Speicher weiter. So müssen wir nicht in ein temporäres Postfach schreiben, sondern können mit Ihrem verschlüsselten Passwort in Ihr tatsächlich verschlüsseltes Postfach schreiben.

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

5. [Backups Ihrer verschlüsselten Postfächer](#backups) werden täglich erstellt. Sie können jederzeit ein neues Backup anfordern oder das neueste Backup von <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase herunterladen. Wenn Sie zu einem anderen E-Mail-Dienst wechseln, können Sie Ihre Postfächer und Backups jederzeit problemlos migrieren, herunterladen, exportieren und löschen.

## Technologien {#technologies}

### Datenbanken {#databases}

Wir haben andere mögliche Datenbankspeicherebenen untersucht, aber keine hat unsere Anforderungen so gut erfüllt wie SQLite:

| Datenbank | Verschlüsselung ruhender Daten | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postfächer | Lizenz | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :Stern: | :weißes_Häkchen: Ja mit [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :weißes Häkchen: | :weißes Häkchen: Gemeinfrei | :weißes Häkchen: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relationale Datenbank | :x: AGPL und `SSPL-1.0` | :X: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relationale Datenbank | :weißes Häkchen: `MIT` | :X: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :weißes Häkchen: `LGPL-3.0-only` | :X: |
| [PostgreSQL](https://www.postgresql.org/) | :weißes Häkchen: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relationale Datenbank | :weißes_Häkchen: `PostgreSQL` (ähnlich wie `BSD` oder `MIT`) | :X: |
| [MariaDB](https://mariadb.com/) | :weißes Häkchen: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relationale Datenbank | :weißes Häkchen: `GPLv2` und `BUSL-1.1` | :X: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relationale Datenbank | :x: `BUSL-1.1` und andere | :X: |

> Hier ist ein [Blogbeitrag, der mehrere SQLite-Datenbankspeicheroptionen vergleicht](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) in der obigen Tabelle.

### Sicherheit {#security}

Wir verwenden stets die Verschlüsselungsmethoden [Verschlüsselung im Ruhezustand](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [Verschlüsselung während der Übertragung](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS über HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH“) mit :tangerine: [Mandarine](https://tangeri.ne) und [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) für Postfächer. Zusätzlich nutzen wir tokenbasierte Zwei-Faktor-Authentifizierung (im Gegensatz zu SMS, die anfällig für [Man-in-the-Middle-Angriffe](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) ist), rotierte SSH-Schlüssel mit deaktiviertem Root-Zugriff, exklusiven Zugriff auf Server über eingeschränkte IP-Adressen und mehr.

Im Falle eines [Angriff des bösen Dienstmädchens](https://en.wikipedia.org/wiki/Evil_maid_attack) oder eines betrügerischen Mitarbeiters eines Drittanbieters **kann Ihr Postfach weiterhin nur mit Ihrem generierten Passwort geöffnet werden**. Seien Sie versichert, wir verlassen uns auf keine anderen Drittanbieter als unsere SOC Typ 2-konformen Serveranbieter Cloudflare, DataPacket, Digital Ocean und Vultr.

Unser Ziel ist es, so wenig [einzelner Fehlerpunkt](https://en.wikipedia.org/wiki/Single_point_of_failure) wie möglich zu haben.

### Postfächer {#mailboxes}

> **tldr;** Unsere IMAP-Server verwenden für jedes Ihrer Postfächer individuell verschlüsselte SQLite-Datenbanken.

[SQLite ist ein äußerst beliebtes](https://www.sqlite.org/mostdeployed.html) eingebettete Datenbank – sie läuft derzeit auf Ihrem Telefon und Computer – [und wird von fast allen wichtigen Technologien verwendet](https://www.sqlite.org/famous.html).

Auf unseren verschlüsselten Servern gibt es beispielsweise ein SQLite-Datenbankpostfach für `linux@example.com`, `info@example.com`, `hello@example.com` usw. – jeweils eines als `.sqlite`-Datenbankdatei. Wir benennen die Datenbankdateien auch nicht nach der E-Mail-Adresse – stattdessen verwenden wir BSON ObjectID und generierte eindeutige UUIDs, die weder verraten, wem das Postfach gehört, noch unter welcher E-Mail-Adresse es sich befindet (z. B. `353a03f21e534321f5d6e267.sqlite`).

Jede dieser Datenbanken ist mit Ihrem Passwort (das nur Sie haben) unter Verwendung von [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) verschlüsselt. Das bedeutet, dass Ihre Postfächer einzeln verschlüsselt, in sich geschlossen ([Sandbox](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) und portierbar sind.

Wir haben SQLite mit dem folgenden [PRAGMA](https://www.sqlite.org/pragma.html) feinabgestimmt:

| `PRAGMA` | Zweck |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Weitere Informationen finden Sie unter `better-sqlite3-multiple-ciphers` unter [Projects](#projects). |
| `key="****************"` | Dies ist Ihr entschlüsseltes, ausschließlich im Speicher gespeichertes Passwort, das über die IMAP-Verbindung Ihres E-Mail-Clients an unseren Server weitergeleitet wird. Für jede Lese- und Schreibsitzung werden neue Datenbankinstanzen erstellt und geschlossen (um Sandboxing und Isolation zu gewährleisten). |
| `journal_model=WAL` | Write-Ahead-Protokoll ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Verhindert Schreibsperrenfehler [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Erhöht die Dauerhaftigkeit von Transaktionen [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Erzwingt, dass Fremdschlüsselreferenzen (z. B. eine Beziehung von einer Tabelle zu einer anderen) erzwungen werden. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), sollte aber zur Validierung und Datenintegrität aktiviert werden. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) zur Gewährleistung der geistigen Gesundheit des Entwicklers. |

> Alle anderen Standardwerte stammen von SQLite, wie im [offizielle PRAGMA-Dokumentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) angegeben.

### Parallelität {#concurrency}

> **tldr;** Wir verwenden `WebSocket` für gleichzeitige Lese- und Schreibvorgänge in Ihren verschlüsselten SQLite-Postfächern.

#### liest {#reads}

Ihr E-Mail-Client auf Ihrem Telefon löst möglicherweise `imap.forwardemail.net` in eine unserer Digital Ocean-IP-Adressen auf – und Ihr Desktop-Client löst möglicherweise eine separate IP von einem ganz anderen [Anbieter](#providers) auf.

Unabhängig davon, mit welchem IMAP-Server Ihr E-Mail-Client eine Verbindung herstellt, möchten wir, dass die Verbindung Ihre Datenbank in Echtzeit und mit 100%iger Genauigkeit liest. Dies geschieht über WebSockets.

#### schreibt {#writes}

Das Schreiben in Ihre Datenbank verläuft etwas anders, da SQLite eine eingebettete Datenbank ist und Ihr Postfach standardmäßig in einer einzigen Datei gespeichert ist.

Wir haben Optionen wie `litestream`, `rqlite` und `dqlite` unten untersucht – jedoch erfüllte keine davon unsere Anforderungen.

Um Schreibvorgänge mit aktiviertem Write-Ahead-Logging ("[WAL](https://www.sqlite.org/wal.html)") durchzuführen, muss sichergestellt werden, dass nur ein Server ("Primary") dafür zuständig ist. [WAL](https://www.sqlite.org/wal.html) beschleunigt die Parallelität drastisch und ermöglicht einen Schreiber und mehrere Leser.

Der Primärserver läuft auf den Datenservern mit den eingebundenen Volumes, die die verschlüsselten Postfächer enthalten. Aus Verteilungssicht können Sie alle einzelnen IMAP-Server hinter `imap.forwardemail.net` als Sekundärserver („Secondary“) betrachten.

Wir erreichen eine bidirektionale Kommunikation mit [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primäre Server verwenden eine Instanz des `WebSocketServer`-Servers von [ws](https://github.com/websockets/ws).
* Sekundäre Server verwenden eine Instanz des `WebSocket`-Clients von [ws](https://github.com/websockets/ws), der mit [WebSocket wie versprochen](https://github.com/vitalets/websocket-as-promised) und [Wiederverbindung-WebSocket](https://github.com/opensumi/reconnecting-websocket) umschlossen ist. Diese beiden Wrapper stellen sicher, dass `WebSocket` die Verbindung wiederherstellt und Daten für bestimmte Datenbankschreibvorgänge senden und empfangen kann.

### Sicherungen {#backups}

> **tldr;** Backups Ihrer verschlüsselten Postfächer werden täglich erstellt. Sie können auch sofort ein neues Backup anfordern oder das neueste Backup jederzeit unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase herunterladen.

Für Backups führen wir täglich während der IMAP-Befehlsverarbeitung den SQLite-Befehl `VACUUM INTO` aus. Dieser nutzt Ihr verschlüsseltes Passwort aus einer IMAP-Verbindung im Arbeitsspeicher. Backups werden gespeichert, wenn kein vorhandenes Backup erkannt wird oder sich der [SHA-256](https://en.wikipedia.org/wiki/SHA-2)-Hash der Datei im Vergleich zum letzten Backup geändert hat.

Beachten Sie, dass wir den Befehl `VACUUM INTO` anstelle des integrierten Befehls `backup` verwenden, da eine Seite, die während der Ausführung des Befehls `backup` geändert wird, neu gestartet werden muss. Der Befehl `VACUUM INTO` erstellt einen Snapshot. Weitere Informationen finden Sie in den Kommentaren zu [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) und [Hacker-News](https://news.ycombinator.com/item?id=31387556).

Darüber hinaus verwenden wir `VACUUM INTO` anstelle von `backup`, da der Befehl `backup` die Datenbank für einen kurzen Zeitraum unverschlüsselt lassen würde, bis `rekey` aufgerufen wird (weitere Informationen finden Sie in diesem GitHub [Kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)).

Der Sekundärserver weist den Primärserver über die Verbindung `WebSocket` an, die Sicherung auszuführen. Der Primärserver erhält dann den entsprechenden Befehl und führt anschließend Folgendes aus:

1. Verbinden Sie sich mit Ihrem verschlüsselten Postfach.
2. Erlangen Sie eine Schreibsperre.
3. Führen Sie einen WAL-Checkpoint über `wal_checkpoint(PASSIVE)` aus.
4. Führen Sie den SQLite-Befehl `VACUUM INTO` aus.
5. Stellen Sie sicher, dass die kopierte Datei mit dem verschlüsselten Passwort geöffnet werden kann (Schutz vor Dummy-Verletzung).
6. Laden Sie die Datei zur Speicherung auf Cloudflare R2 hoch (oder bei Ihrem eigenen Anbieter, falls angegeben).

<!--
7. Komprimieren Sie die resultierende Sicherungsdatei mit `gzip`.
8. Laden Sie sie zur Speicherung auf Cloudflare R2 hoch (oder bei Ihrem eigenen Anbieter, falls angegeben).
-->

Denken Sie daran, dass Ihre Postfächer verschlüsselt sind. Obwohl wir für die WebSocket-Kommunikation IP-Einschränkungen und andere Authentifizierungsmaßnahmen eingerichtet haben, können Sie im Falle eines Angriffs durch einen böswilligen Akteur sicher sein, dass die WebSocket-Nutzlast Ihre Datenbank nicht öffnen kann, sofern sie nicht über Ihr IMAP-Passwort verfügt.

Derzeit wird nur eine Sicherung pro Postfach gespeichert, aber in Zukunft bieten wir möglicherweise eine zeitpunktbezogene Wiederherstellung („[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)“) an.

### Suche {#search}

Unsere IMAP-Server unterstützen den Befehl `SEARCH` mit komplexen Abfragen, regulären Ausdrücken und mehr.

Die schnelle Suchleistung ist [FTS5](https://www.sqlite.org/fts5.html) und [SQLite-Regex](https://github.com/asg017/sqlite-regex#sqlite-regex) zu verdanken.

Wir speichern `Date`-Werte in den SQLite-Postfächern als [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-Zeichenfolgen über [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (mit UTC-Zeitzone, damit Gleichheitsvergleiche ordnungsgemäß funktionieren).

Außerdem werden für alle Eigenschaften, die in Suchanfragen vorkommen, Indizes gespeichert.

### Projekte {#projects}

Hier ist eine Tabelle mit einer Übersicht über die Projekte, die wir in unserem Quellcode und Entwicklungsprozess verwenden (alphabetisch sortiert):

| Projekt | Zweck |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps-Automatisierungsplattform zur einfachen Wartung, Skalierung und Verwaltung unserer gesamten Serverflotte. |
| [Bree](https://github.com/breejs/bree) | Job-Scheduler für Node.js und JavaScript mit Cron, Dates, MS, Later und benutzerfreundlicher Unterstützung. |
| [Cabin](https://github.com/cabinjs/cabin) | Entwicklerfreundliche JavaScript- und Node.js-Protokollierungsbibliothek mit Blick auf Sicherheit und Datenschutz. |
| [Lad](https://github.com/ladjs/lad) | Node.js-Framework, das unsere gesamte Architektur und unser technisches Design mit MVC und mehr unterstützt. |
| [MongoDB](https://www.mongodb.com/) | NoSQL-Datenbanklösung, die wir zum Speichern aller anderen Daten außerhalb von Postfächern verwenden (z. B. Ihr Konto, Ihre Einstellungen, Domänen und Aliaskonfigurationen). |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB Object Document Modeling („ODM“), das wir in unserem gesamten Stack verwenden. Wir haben spezielle Helfer geschrieben, die es uns ermöglichen, **Mongoose mit SQLite** einfach weiterzuverwenden. :tada: |
| [Node.js](https://nodejs.org/en) | Node.js ist die plattformübergreifende Open-Source-JavaScript-Laufzeitumgebung, in der alle unsere Serverprozesse ausgeführt werden. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js-Paket zum Senden von E-Mails, Erstellen von Verbindungen und mehr. Wir sind offizieller Sponsor dieses Projekts. |
| [Redis](https://redis.io/) | In-Memory-Datenbank für Caching, Publish/Subscribe-Kanäle und DNS-over-HTTPS-Anfragen. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Verschlüsselungserweiterung für SQLite, um die Verschlüsselung ganzer Datenbankdateien (einschließlich Write-Ahead-Log ("[WAL](https://www.sqlite.org/wal.html)"), Journal, Rollback usw.) zu ermöglichen. |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visueller SQLite-Editor (den Sie auch verwenden können) zum Testen, Herunterladen und Anzeigen von Entwicklungspostfächern. |
| [SQLite](https://www.sqlite.org/about.html) | Eingebettete Datenbankebene für skalierbaren, eigenständigen, schnellen und belastbaren IMAP-Speicher. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js-Tool zum Anti-Spam, zur E-Mail-Filterung und zur Phishing-Prävention (unsere Alternative zu [Spam Assassin](https://spamassassin.apache.org/) und [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | DNS-über-HTTPS-Anfragen mit Node.js und Caching mit Redis – das gewährleistet globale Konsistenz und vieles mehr. |
| [Thunderbird](https://www.thunderbird.net/) | Unser Entwicklungsteam verwendet dies (und empfiehlt dies auch) als **bevorzugten E-Mail-Client zur Verwendung mit Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Unser Entwicklungsteam erstellt damit virtuelle Maschinen für iOS und macOS, um verschiedene E-Mail-Clients (parallel) mit unseren IMAP- und SMTP-Servern zu testen. |
| [Ubuntu](https://ubuntu.com/download/server) | Modernes Open-Source-Serverbetriebssystem auf Linux-Basis, das unsere gesamte Infrastruktur betreibt. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP-Serverbibliothek – siehe die Hinweise zu [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) und [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Schnelle und einfache API-Bibliothek für Node.js zur programmgesteuerten Interaktion mit SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Entwicklerfreundliches E-Mail-Framework zum Erstellen, Anzeigen einer Vorschau und Senden von benutzerdefinierten E-Mails (z. B. Kontobenachrichtigungen und mehr). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL-Abfragegenerator mit Mongo-Syntax. Dies spart unserem Entwicklungsteam Zeit, da wir weiterhin im gesamten Stack im Mongo-Stil schreiben können und dabei einen datenbankunabhängigen Ansatz verfolgen. **Außerdem hilft es, SQL-Injection-Angriffe durch die Verwendung von Abfrageparametern zu vermeiden.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL-Dienstprogramm zum Extrahieren von Informationen zum vorhandenen Datenbankschema. So können wir einfach überprüfen, ob alle Indizes, Tabellen, Spalten, Constraints usw. gültig sind und `1:1` wie vorgesehen sind. Wir haben sogar automatisierte Hilfsprogramme entwickelt, um neue Spalten und Indizes hinzuzufügen, wenn Änderungen an Datenbankschemata vorgenommen werden (mit äußerst detaillierter Fehlerwarnung). |
| [knex](https://github.com/knex/knex) | SQL-Abfrage-Generator, den wir nur für Datenbankmigrationen und Schemavalidierung über `knex-schema-inspector` verwenden. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatische [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)-Phrasenübersetzung mit Unterstützung für Markdown mithilfe von [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js-Paket zum Auflösen und Herstellen von Verbindungen mit MX-Servern und zur Fehlerbehandlung. |
| [pm2](https://github.com/Unitech/pm2) | Node.js-Produktionsprozessmanager mit integriertem Load Balancer ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) für Leistung). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP-Serverbibliothek – wir verwenden diese für unseren Mailaustausch („MX“) und unsere ausgehenden SMTP-Server. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Nützliches Tool zum Testen von IMAP-Servern anhand von Benchmarks und der Kompatibilität des IMAP-Protokolls gemäß der RFC-Spezifikation. Dieses Projekt wurde vom [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-Team (einem aktiven Open-Source-IMAP- und POP3-Server seit Juli 2002) erstellt. Wir haben unseren IMAP-Server mit diesem Tool ausführlich getestet. |

> Weitere von uns verwendete Projekte finden Sie in [unser Quellcode auf GitHub](https://github.com/forwardemail).

### Anbieter {#providers}

| Anbieter | Zweck |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-Anbieter, Integritätsprüfungen, Lastenausgleich und Sicherungsspeicher verwenden [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dediziertes Server-Hosting und verwaltete Datenbanken. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dediziertes Server-Hosting. |
| [DataPacket](https://www.datapacket.com) | Dediziertes Server-Hosting. |

## Gedanken {#thoughts}

### Grundsätze {#principles}

Forward Email ist nach diesen Prinzipien konzipiert:

1. Seien Sie stets entwicklerfreundlich, sicherheits- und datenschutzorientiert und transparent.
2. Halten Sie sich an [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Zwölf Faktor](https://12factor.net/), [Ockhams Rasiermesser](https://en.wikipedia.org/wiki/Occam%27s_razor) und [Hundefutter](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Sprechen Sie kämpferische, fleißige und [Ramen-profitabel](http://www.paulgraham.com/ramenprofitable.html) Entwickler an.

### Experimente {#experiments}

> **tldr;** Letztendlich ist die Verwendung von S3-kompatiblem Objektspeicher und/oder virtuellen Tabellen aus Leistungsgründen technisch nicht machbar und aufgrund von Speicherbeschränkungen fehleranfällig.

Wir haben einige Experimente durchgeführt, die zu unserer endgültigen SQLite-Lösung geführt haben, wie oben beschrieben.

Eine davon bestand darin, die Verwendung von [rclone]() und SQLite zusammen mit einer S3-kompatiblen Speicherschicht auszuprobieren.

Durch dieses Experiment konnten wir die Verwendung von rclone, SQLite und [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) besser verstehen und Randfälle entdecken:

* Wenn Sie das Flag `--vfs-cache-mode writes` mit rclone aktivieren, sind Lesevorgänge zwar möglich, Schreibvorgänge werden jedoch zwischengespeichert.
* Wenn Sie mehrere global verteilte IMAP-Server haben, ist der Cache auf allen Servern deaktiviert, es sei denn, Sie verwenden einen einzelnen Schreiber und mehrere Listener (z. B. einen Pub/Sub-Ansatz).
* Dies ist äußerst komplex, und jede zusätzliche Komplexität führt zu weiteren Single Points of Failure.
* S3-kompatible Speicheranbieter unterstützen keine partiellen Dateiänderungen. Das bedeutet, dass jede Änderung der Datei `.sqlite` eine vollständige Änderung und einen erneuten Upload der Datenbank zur Folge hat.
* Es gibt zwar auch andere Lösungen wie `rsync`, diese bieten jedoch keine Unterstützung für Write-Ahead-Log („[WAL](https://www.sqlite.org/wal.html)“). Daher haben wir uns für Litestream entschieden. Glücklicherweise verschlüsselt unsere Verschlüsselung die [WAL](https://www.sqlite.org/wal.html)-Dateien bereits für uns, sodass wir hierfür nicht auf Litestream angewiesen sind. Wir waren jedoch noch nicht überzeugt von Litestream für den Produktionseinsatz und haben dazu unten einige Anmerkungen.
* Bei Verwendung der Option `--vfs-cache-mode writes` (die *einzige* Möglichkeit, SQLite anstelle von `rclone` für Schreibvorgänge zu verwenden) wird versucht, die gesamte Datenbank von Grund auf im Arbeitsspeicher zu kopieren. Die Verwaltung eines 10-GB-Postfachs ist in Ordnung, die Verwaltung mehrerer Postfächer mit extrem hohem Speicherbedarf führt jedoch dazu, dass die IMAP-Server an Speicherbeschränkungen und `ENOMEM`-Fehler, Segmentierungsfehler und Datenbeschädigungen stoßen.
* Wenn Sie versuchen, SQLite [Virtuelle Tische](https://www.sqlite.org/vtab.html) (z. B. mit [s3db](https://github.com/jrhy/s3db)) zu verwenden, um Daten live auf einer S3-kompatiblen Speicherebene zu speichern, treten weitere Probleme auf:
* Lese- und Schreibvorgänge sind extrem langsam, da S3-API-Endpunkte mit den HTTP-Methoden `.sqlite`0, `.sqlite`1, `.sqlite`2 und `.sqlite`3 angesprochen werden müssen.
* Entwicklungstests zeigten, dass die Verarbeitung von mehr als 500.000–1.000.000 Datensätzen im Glasfaser-Internet immer noch durch den Durchsatz beim Schreiben und Lesen an S3-kompatible Anbieter begrenzt ist. Beispielsweise führten unsere Entwickler `.sqlite`4-Schleifen aus, um sowohl sequenzielle SQL-Anweisungen `.sqlite`5 als auch Anweisungen zum Massenschreiben großer Datenmengen auszuführen. In beiden Fällen war die Leistung extrem langsam.
* Virtuelle Tabellen **können keine Indizes**, `.sqlite`6-Anweisungen und `.sqlite`7 `.sqlite`8 enthalten – was je nach Datenmenge zu Verzögerungen von 1–2 Minuten oder mehr führt.
* Objekte wurden unverschlüsselt gespeichert, und es ist keine native Verschlüsselungsunterstützung verfügbar.
* Wir haben auch die Verwendung von `.sqlite`9 untersucht, das konzeptionell und technisch dem vorherigen Punkt ähnelt (und daher dieselben Probleme aufweist). Eine Möglichkeit wäre die Verwendung eines benutzerdefinierten `rsync`0-Builds, der mit einer Verschlüsselung wie `rsync`1 (die wir derzeit in unserer obigen Lösung verwenden) bis `rsync`2 umhüllt ist.
* Ein anderer möglicher Ansatz wäre die Verwendung von `rsync`3, die jedoch auf 32 GB beschränkt ist und einen komplexen Erstellungs- und Entwicklungsaufwand erfordern würde.
* `rsync`4-Anweisungen sind erforderlich (daher ist die Verwendung virtueller Tabellen vollständig ausgeschlossen). Wir benötigen `rsync`5-Anweisungen, damit unser Hook mit `rsync`6 ordnungsgemäß funktioniert. Dadurch wird sichergestellt, dass Daten nicht beschädigt werden und abgerufene Zeilen gemäß unseren `rsync`7-Schemadefinitionen (einschließlich Einschränkung, Variablentyp und beliebiger Datenvalidierung) in gültige Dokumente konvertiert werden können.
* Fast alle S3-kompatiblen Projekte mit SQLite in der Open-Source-Community basieren auf Python (und nicht auf JavaScript, das wir für 100 % unseres Stacks verwenden).
* Komprimierungsbibliotheken wie `rsync`8 (siehe `rsync`9) sehen vielversprechend aus, aber __PROTECTED_LINK_189__0. Stattdessen ist die anwendungsseitige Komprimierung von Datentypen wie __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 und __PROTECTED_LINK_189__6 ein saubererer und einfacherer Ansatz (und lässt sich auch leichter migrieren, da wir ein __PROTECTED_LINK_189__7-Flag oder eine __PROTECTED_LINK_189__7-Spalte speichern oder sogar __PROTECTED_LINK_189__8, __PROTECTED_LINK_189__9 zur Komprimierung oder __PROTECTED_LINK_190__0 für keine Komprimierung als Datenbankmetadaten verwenden können).
* Glücklicherweise ist in unserem IMAP-Serverspeicher bereits eine Deduplizierung von Anhängen implementiert. Daher wird nicht für jede Nachricht mit demselben Anhang eine Kopie des Anhangs gespeichert. Stattdessen wird ein einzelner Anhang für mehrere Nachrichten und Threads in einem Postfach gespeichert (und anschließend eine Fremdreferenz verwendet).
* Das Projekt Litestream, eine SQLite-Replikations- und Backup-Lösung, ist sehr vielversprechend und wird von uns höchstwahrscheinlich auch in Zukunft genutzt.
* Wir möchten die Autoren nicht herabwürdigen – wir schätzen ihre Arbeit und ihre Beiträge zu Open Source seit über einem Jahrzehnt –, doch in der Praxis zeigt sich, dass es __PROTECTED_LINK_190__1 und __PROTECTED_LINK_190__2 gibt.
* Die Wiederherstellung von Backups muss reibungslos und einfach erfolgen. Die Verwendung einer Lösung wie MongoDB mit __PROTECTED_LINK_190__3 und __PROTECTED_LINK_190__4 ist nicht nur mühsam, sondern auch zeitintensiv und konfigurationsintensiv.
* SQLite-Datenbanken vereinfachen dies (es handelt sich um eine einzelne Datei).
* Wir wollten eine Lösung entwickeln, mit der Benutzer ihr Postfach jederzeit öffnen und verlassen können.
* Einfache Node.js-Befehle an __PROTECTED_LINK_190__5 – und es wird dauerhaft vom Festplattenspeicher gelöscht.
* Wir können eine S3-kompatible API mit HTTP __PROTECTED_LINK_190__6 verwenden, um Snapshots und Backups für Benutzer einfach zu entfernen.
* SQLite war die einfachste, schnellste und kostengünstigste Lösung.

### Mangel an Alternativen {#lack-of-alternatives}

Unseres Wissens sind keine anderen E-Mail-Dienste so konzipiert und auch keine Open Source.

Wir *glauben, dass dies daran liegen könnte*, dass bei vorhandenen E-Mail-Diensten veraltete Technologie mit [Spaghetti-Code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: in der Produktion ist.

Die meisten, wenn nicht alle bestehenden E-Mail-Dienstanbieter sind entweder Closed Source oder werden als Open Source beworben, **aber in Wirklichkeit ist nur ihr Front-End Open Source.**

**Der sensibelste Teil einer E-Mail** (die eigentliche Speicherung/IMAP/SMTP-Interaktion) **wird vollständig auf dem Back-End (Server) und *nicht* auf dem Front-End (Client) durchgeführt**.

### Probieren Sie „E-Mail weiterleiten“ aus {#try-out-forward-email}

Melden Sie sich noch heute bei <https://forwardemail.net>! :rocket: an