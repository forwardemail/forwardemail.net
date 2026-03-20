# Quantenresistente E-Mail: Wie wir verschlüsselte SQLite-Mailboxen verwenden, um Ihre E-Mail sicher zu halten {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Vergleich der E-Mail-Diensteanbieter](#email-service-provider-comparison)
* [Wie funktioniert es](#how-does-it-work)
* [Technologien](#technologies)
  * [Datenbanken](#databases)
  * [Sicherheit](#security)
  * [Mailboxen](#mailboxes)
  * [Nebenläufigkeit](#concurrency)
  * [Backups](#backups)
  * [Suche](#search)
  * [Projekte](#projects)
  * [Anbieter](#providers)
* [Gedanken](#thoughts)
  * [Prinzipien](#principles)
  * [Experimente](#experiments)
  * [Mangel an Alternativen](#lack-of-alternatives)
  * [Forward Email ausprobieren](#try-out-forward-email)


## Vorwort {#foreword}

> \[!IMPORTANT]
> Unser E-Mail-Dienst ist [100% Open-Source](https://github.com/forwardemail) und datenschutzorientiert durch sichere und verschlüsselte SQLite-Mailboxen.

Bis wir [IMAP-Unterstützung](/faq#do-you-support-receiving-email-with-imap) eingeführt haben, verwendeten wir MongoDB für unsere persistenten Datenspeicheranforderungen.

Diese Technologie ist großartig und wir nutzen sie noch heute – aber um Verschlüsselung im Ruhezustand mit MongoDB zu haben, müssen Sie einen Anbieter verwenden, der MongoDB Enterprise anbietet, wie Digital Ocean oder Mongo Atlas – oder eine Enterprise-Lizenz bezahlen (und anschließend mit der Verzögerung des Vertriebsteams arbeiten).

Unser Team bei [Forward Email](https://forwardemail.net) benötigte eine entwicklerfreundliche, skalierbare, zuverlässige und verschlüsselte Speicherlösung für IMAP-Mailboxen. Als Open-Source-Entwickler war es gegen [unsere Prinzipien](#principles), eine Technologie zu verwenden, für die man eine Lizenzgebühr zahlen muss, um die Verschlüsselung im Ruhezustand zu erhalten – also haben wir experimentiert, recherchiert und eine neue Lösung von Grund auf entwickelt, um diese Bedürfnisse zu erfüllen.

Anstatt eine gemeinsame Datenbank zur Speicherung Ihrer Mailboxen zu verwenden, speichern und verschlüsseln wir Ihre Mailboxen individuell mit Ihrem Passwort (das nur Sie haben). **Unser E-Mail-Dienst ist so sicher, dass wenn Sie Ihr Passwort vergessen, Sie Ihre Mailbox verlieren** (und mit Offline-Backups wiederherstellen oder neu anfangen müssen).

Lesen Sie weiter, während wir unten einen tiefen Einblick geben mit einem [Vergleich der E-Mail-Diensteanbieter](#email-service-provider-comparison), [wie unser Dienst funktioniert](#how-does-it-work), [unserem Technologie-Stack](#technologies) und mehr.


## Vergleich der E-Mail-Diensteanbieter {#email-service-provider-comparison}

Wir sind der einzige 100% Open-Source- und datenschutzorientierte E-Mail-Diensteanbieter, der individuell verschlüsselte SQLite-Mailboxen speichert, unbegrenzte Domains, Aliase und Benutzer anbietet und ausgehenden SMTP-, IMAP- und POP3-Support hat:

**Im Gegensatz zu anderen E-Mail-Anbietern müssen Sie bei Forward Email nicht pro Domain oder Alias für Speicherplatz bezahlen.** Der Speicherplatz wird über Ihr gesamtes Konto geteilt – wenn Sie also mehrere benutzerdefinierte Domainnamen und mehrere Aliase auf jeder haben, sind wir die perfekte Lösung für Sie. Beachten Sie, dass Sie bei Bedarf dennoch Speicherlimits pro Domain oder Alias durchsetzen können.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">E-Mail-Dienstvergleich lesen <i class="fa fa-search-plus"></i></a>


## Wie funktioniert es {#how-does-it-work}

1. Mit Ihrem E-Mail-Client wie Apple Mail, Thunderbird, Gmail oder Outlook verbinden Sie sich mit unseren sicheren [IMAP](/faq#do-you-support-receiving-email-with-imap)-Servern unter Verwendung Ihres Benutzernamens und Passworts:

   * Ihr Benutzername ist Ihr vollständiger Alias mit Ihrer Domain, z. B. `hello@example.com`.
   * Ihr Passwort wird zufällig generiert und Ihnen nur 30 Sekunden lang angezeigt, wenn Sie <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong> unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase anklicken.
2. Sobald die Verbindung hergestellt ist, sendet Ihr E-Mail-Client [IMAP-Protokollbefehle](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) an unseren IMAP-Server, um Ihr Postfach synchron zu halten. Dies umfasst das Schreiben und Speichern von Entwürfen sowie andere Aktionen, die Sie durchführen könnten (z. B. eine E-Mail als Wichtig markieren oder eine E-Mail als Spam/Junk-Mail kennzeichnen).

3. Mail-Austauschserver (allgemein bekannt als "MX"-Server) empfangen neue eingehende E-Mails und speichern sie in Ihrem Postfach. Wenn dies geschieht, wird Ihr E-Mail-Client benachrichtigt und synchronisiert Ihr Postfach. Unsere Mail-Austauschserver können Ihre E-Mails an einen oder mehrere Empfänger weiterleiten (einschließlich [Webhooks](/faq#do-you-support-webhooks)), Ihre E-Mails für Sie in Ihrem verschlüsselten IMAP-Speicher bei uns speichern, **oder beides**!

   > \[!TIP]
   > Interessiert, mehr zu erfahren? Lesen Sie [wie man E-Mail-Weiterleitung einrichtet](/faq#how-do-i-get-started-and-set-up-email-forwarding), [wie unser Mail-Austauschdienst funktioniert](/faq#how-does-your-email-forwarding-system-work) oder sehen Sie sich [unsere Anleitungen](/guides) an.

4. Im Hintergrund funktioniert unser sicheres E-Mail-Speicher-Design auf zwei Arten, um Ihre Postfächer verschlüsselt und nur für Sie zugänglich zu halten:

   * Wenn neue E-Mails von einem Absender für Sie eingehen, schreiben unsere Mail-Austauschserver in ein individuelles, temporäres und verschlüsseltes Postfach für Sie.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Eingehende Nachricht für Ihren Alias (z. B. Sie@ihredomain.com) empfangen.
         MX->>SQLite: Nachricht wird in einem temporären Postfach gespeichert.
         Note over MX,SQLite: Weiterleitung an andere Empfänger und konfigurierte Webhooks.
         MX->>Sender: Erfolg!
     ```

   * Wenn Sie sich mit Ihrem E-Mail-Client an unserem IMAP-Server anmelden, wird Ihr Passwort im Speicher verschlüsselt und verwendet, um Ihr Postfach zu lesen und zu schreiben. Ihr Postfach kann nur mit diesem Passwort gelesen und beschrieben werden. Beachten Sie, dass da nur Sie dieses Passwort besitzen, **nur Sie** Ihr Postfach lesen und schreiben können, wenn Sie darauf zugreifen. Beim nächsten Versuch Ihres E-Mail-Clients, nach neuen Nachrichten zu suchen oder zu synchronisieren, werden Ihre neuen Nachrichten aus diesem temporären Postfach übertragen und mit Ihrem angegebenen Passwort in Ihrer tatsächlichen Postfachdatei gespeichert. Dieses temporäre Postfach wird anschließend gelöscht, sodass nur Ihr passwortgeschütztes Postfach die Nachrichten enthält.

   * **Wenn Sie mit IMAP verbunden sind (z. B. mit einem E-Mail-Client wie Apple Mail oder Thunderbird), müssen wir nicht auf temporären Speicher schreiben. Ihr im Speicher verschlüsseltes IMAP-Passwort wird stattdessen abgerufen und verwendet. In Echtzeit, wenn versucht wird, eine Nachricht an Sie zuzustellen, senden wir eine WebSocket-Anfrage an alle IMAP-Server, um zu prüfen, ob eine aktive Sitzung für Sie besteht (das ist der Abrufteil), und übergeben anschließend dieses verschlüsselte Passwort im Speicher – so müssen wir nicht in ein temporäres Postfach schreiben, sondern können direkt in Ihr tatsächliches verschlüsseltes Postfach mit Ihrem verschlüsselten Passwort schreiben.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Sie verbinden sich mit einem E-Mail-Client zum IMAP-Server.
         IMAP->>SQLite: Überträgt Nachricht vom temporären Postfach in das Postfach Ihres Alias.
         Note over IMAP,SQLite: Das Postfach Ihres Alias ist nur im Speicher mit dem IMAP-Passwort verfügbar.
         SQLite->>IMAP: Ruft Nachrichten wie vom E-Mail-Client angefordert ab.
         IMAP->>You: Erfolg!
     ```

5. [Backups Ihrer verschlüsselten Postfächer](#backups) werden täglich erstellt. Sie können jederzeit ein neues Backup anfordern oder das neueste Backup von <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase herunterladen. Wenn Sie sich entscheiden, zu einem anderen E-Mail-Dienst zu wechseln, können Sie Ihre Postfächer und Backups jederzeit einfach migrieren, herunterladen, exportieren und löschen.


## Technologien {#technologies}

### Datenbanken {#databases}

Wir haben andere mögliche Datenbankspeicherschichten untersucht, jedoch erfüllte keine unsere Anforderungen so gut wie SQLite:
| Datenbank                                              |                                                                    Verschlüsselung im Ruhezustand                                                                   |  [Sandboxed](https://de.wikipedia.org/wiki/Sandbox_\(Computersicherheit\)) Postfächer  |                           Lizenz                           | [Überall verwendet](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :---------------------------------------------------------: | :------------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ja mit [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                                      |                                  :white_check_mark:                                    |               :white_check_mark: Public Domain              |                      :white_check_mark:                       |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Nur in MongoDB Enterprise verfügbar"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                             |                                :x: Relationale Datenbank                              |                   :x: AGPL und `SSPL-1.0`                   |                             :x:                               |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Nur Netzwerk](https://github.com/rqlite/rqlite/issues/1406)                                                  |                                :x: Relationale Datenbank                              |                   :white_check_mark: `MIT`                  |                             :x:                               |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Ungetestet und noch nicht unterstützt?](https://github.com/canonical/dqlite/issues/32)                                    | :x: [Ungetestet und noch nicht unterstützt?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                               |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ja](https://www.postgresql.org/docs/current/encryption-options.html)                                        |                                :x: Relationale Datenbank                              | :white_check_mark: `PostgreSQL` (ähnlich `BSD` oder `MIT`) |                             :x:                               |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Nur für InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support)          |                                :x: Relationale Datenbank                              |          :white_check_mark: `GPLv2` und `BUSL-1.1`          |                             :x:                               |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Nur Enterprise-Funktion](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                                        |                                :x: Relationale Datenbank                              |                  :x: `BUSL-1.1` und andere                   |                             :x:                               |

> Hier ist ein [Blogbeitrag, der mehrere SQLite-Datenbankspeicheroptionen vergleicht](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) in der obigen Tabelle.

### Sicherheit {#security}

Wir verwenden jederzeit [Verschlüsselung im Ruhezustand](https://de.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://de.wikipedia.org/wiki/Advanced_Encryption_Standard)), [Verschlüsselung während der Übertragung](https://de.wikipedia.org/wiki/Data_in_transit) ([TLS](https://de.wikipedia.org/wiki/Transport_Layer_Security)), [DNS über HTTPS](https://de.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") mit :tangerine: [Tangerine](https://tangeri.ne) und [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) Verschlüsselung auf Postfächern. Zusätzlich verwenden wir tokenbasierte Zwei-Faktor-Authentifizierung (im Gegensatz zu SMS, die anfällig für [Man-in-the-Middle-Angriffe](https://de.wikipedia.org/wiki/Man-in-the-middle_attack) ist), rotierende SSH-Schlüssel mit deaktiviertem Root-Zugang, exklusiven Zugriff auf Server über eingeschränkte IP-Adressen und mehr.
Im Falle eines [Evil Maid Angriffs](https://en.wikipedia.org/wiki/Evil_maid_attack) oder eines böswilligen Mitarbeiters eines Drittanbieters kann **Ihr Postfach weiterhin nur mit Ihrem generierten Passwort geöffnet werden**. Seien Sie versichert, dass wir uns nicht auf Drittanbieter verlassen, außer unseren SOC Type 2 konformen Serveranbietern Cloudflare, DataPacket, Digital Ocean, GitHub und Vultr.

Unser Ziel ist es, so wenige [Single Points of Failure](https://en.wikipedia.org/wiki/Single_point_of_failure) wie möglich zu haben.

### Postfächer {#mailboxes}

> **tldr;** Unsere IMAP-Server verwenden individuell verschlüsselte SQLite-Datenbanken für jedes Ihrer Postfächer.

[SQLite ist eine äußerst beliebte](https://www.sqlite.org/mostdeployed.html) eingebettete Datenbank – sie läuft derzeit auf Ihrem Telefon und Computer – [und wird von nahezu allen großen Technologien verwendet](https://www.sqlite.org/famous.html).

Zum Beispiel gibt es auf unseren verschlüsselten Servern eine SQLite-Datenbank-Postfachdatei für `linux@example.com`, `info@example.com`, `hello@example.com` und so weiter – jeweils eine als `.sqlite` Datenbankdatei. Wir benennen die Datenbankdateien auch nicht mit der E-Mail-Adresse – stattdessen verwenden wir BSON ObjectID und einzigartige UUIDs, die nicht verraten, wem das Postfach gehört oder unter welcher E-Mail-Adresse es geführt wird (z. B. `353a03f21e534321f5d6e267.sqlite`).

Jede dieser Datenbanken ist selbst mit Ihrem Passwort (das nur Sie kennen) verschlüsselt, und zwar mit [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Das bedeutet, dass Ihre Postfächer einzeln verschlüsselt, eigenständig, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) und portabel sind.

Wir haben SQLite mit den folgenden [PRAGMA](https://www.sqlite.org/pragma.html) feinjustiert:

| `PRAGMA`                 | Zweck                                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite Datenbankverschlüsselung](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Siehe `better-sqlite3-multiple-ciphers` unter [Projects](#projects) für weitere Einblicke.                            |
| `key="****************"` | Dies ist Ihr nur im Speicher entschlüsseltes Passwort, das über die IMAP-Verbindung Ihres E-Mail-Clients an unseren Server übergeben wird. Neue Datenbankinstanzen werden für jede Lese- und Schreibsitzung erstellt und geschlossen (um Sandbox und Isolation zu gewährleisten). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [das die Leistung steigert und gleichzeitigen Lesezugriff ermöglicht](https://litestream.io/tips/#wal-journal-mode).                                                                          |
| `busy_timeout=5000`      | Verhindert Schreibsperrfehler [während andere Schreibvorgänge stattfinden](https://litestream.io/tips/#busy-timeout).                                                                                                                                   |
| `synchronous=NORMAL`     | Erhöht die Dauerhaftigkeit von Transaktionen [ohne Risiko von Datenbeschädigung](https://litestream.io/tips/#synchronous-pragma).                                                                                                                      |
| `foreign_keys=ON`        | Erzwingt, dass Fremdschlüsselreferenzen (z. B. eine Beziehung von einer Tabelle zu einer anderen) durchgesetzt werden. [Standardmäßig ist dies in SQLite nicht aktiviert](https://www.sqlite.org/foreignkeys.html), sollte aber für Validierung und Datenintegrität aktiviert sein. |
| `encoding='UTF-8'`       | [Standardkodierung](https://www.sqlite.org/pragma.html#pragma_encoding) zur Sicherstellung der Entwicklerfreundlichkeit.                                                                                                                                  |
> Alle anderen Standardwerte stammen von SQLite, wie in der [offiziellen PRAGMA-Dokumentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) angegeben.

### Gleichzeitigkeit {#concurrency}

> **kurz gesagt;** Wir verwenden `WebSocket` für gleichzeitige Lese- und Schreibzugriffe auf Ihre verschlüsselten SQLite-Postfächer.

#### Lesezugriffe {#reads}

Ihr E-Mail-Client auf Ihrem Telefon kann `imap.forwardemail.net` auf eine unserer Digital Ocean IP-Adressen auflösen – und Ihr Desktop-Client kann eine andere IP von einem anderen [Anbieter](#providers) auflösen.

Unabhängig davon, mit welchem IMAP-Server Ihr E-Mail-Client verbunden ist, möchten wir, dass die Verbindung Ihre Datenbank in Echtzeit mit 100 % Genauigkeit liest. Dies geschieht über WebSockets.

#### Schreibzugriffe {#writes}

Das Schreiben in Ihre Datenbank ist etwas anders – da SQLite eine eingebettete Datenbank ist und Ihr Postfach standardmäßig in einer einzigen Datei gespeichert ist.

Wir hatten Optionen wie `litestream`, `rqlite` und `dqlite` unten geprüft – jedoch erfüllte keine davon unsere Anforderungen.

Um Schreibvorgänge mit aktiviertem Write-Ahead-Logging ("[WAL](https://www.sqlite.org/wal.html)") durchzuführen – müssen wir sicherstellen, dass nur ein Server ("Primary") dafür verantwortlich ist. [WAL](https://www.sqlite.org/wal.html) beschleunigt die Gleichzeitigkeit erheblich und erlaubt einen Schreiber und mehrere Leser.

Der Primary läuft auf den Datenservern mit den eingebundenen Volumes, die die verschlüsselten Postfächer enthalten. Aus Sicht der Verteilung können Sie alle einzelnen IMAP-Server hinter `imap.forwardemail.net` als sekundäre Server ("Secondary") betrachten.

Wir realisieren die bidirektionale Kommunikation mit [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primary-Server verwenden eine Instanz des [ws](https://github.com/websockets/ws) `WebSocketServer`.
* Secondary-Server verwenden eine Instanz des [ws](https://github.com/websockets/ws) `WebSocket` Clients, der mit [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) und [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) umhüllt ist. Diese beiden Wrapper sorgen dafür, dass sich der `WebSocket` automatisch wieder verbindet und Daten für spezifische Datenbankschreibvorgänge senden und empfangen kann.

### Backups {#backups}

> **kurz gesagt;** Backups Ihrer verschlüsselten Postfächer werden täglich erstellt. Sie können jederzeit auch sofort ein neues Backup anfordern oder das neueste Backup herunterladen unter <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mein Konto <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliase.

Für Backups führen wir einfach jeden Tag während der IMAP-Befehlsverarbeitung den SQLite-Befehl `VACUUM INTO` aus, der Ihr verschlüsseltes Passwort aus einer IMAP-Verbindung im Arbeitsspeicher nutzt. Backups werden gespeichert, wenn kein vorhandenes Backup erkannt wird oder wenn sich der [SHA-256](https://en.wikipedia.org/wiki/SHA-2) Hash der Datei im Vergleich zum letzten Backup geändert hat.

Beachten Sie, dass wir den Befehl `VACUUM INTO` anstelle des eingebauten `backup` Befehls verwenden, weil bei einer Änderung einer Seite während eines `backup`-Befehls der Vorgang neu gestartet werden muss. Der `VACUUM INTO` Befehl erstellt einen Schnappschuss. Siehe diese Kommentare auf [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) und [Hacker News](https://news.ycombinator.com/item?id=31387556) für weitere Einblicke.

Außerdem verwenden wir `VACUUM INTO` anstelle von `backup`, weil der `backup` Befehl die Datenbank für eine kurze Zeit unverschlüsselt lassen würde, bis `rekey` aufgerufen wird (siehe diesen GitHub [Kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) für Einblicke).

Der Secondary weist den Primary über die `WebSocket`-Verbindung an, das Backup auszuführen – und der Primary erhält dann den Befehl und wird anschließend:

1. Eine Verbindung zu Ihrem verschlüsselten Postfach herstellen.
2. Ein Schreib-Lock erwerben.
3. Einen WAL-Checkpoint via `wal_checkpoint(PASSIVE)` ausführen.
4. Den SQLite-Befehl `VACUUM INTO` ausführen.
5. Sicherstellen, dass die kopierte Datei mit dem verschlüsselten Passwort geöffnet werden kann (Absicherung/Fehlersicherheit).
6. Die Datei zur Speicherung bei Cloudflare R2 hochladen (oder bei Ihrem eigenen Anbieter, falls angegeben).
<!--
7. Komprimiere die resultierende Backup-Datei mit `gzip`.
8. Lade sie zur Speicherung bei Cloudflare R2 hoch (oder bei deinem eigenen Anbieter, falls angegeben).
-->

Denke daran, dass deine Postfächer verschlüsselt sind – und obwohl wir IP-Beschränkungen und andere Authentifizierungsmaßnahmen für die WebSocket-Kommunikation implementiert haben – kannst du im Falle eines Angreifers sicher sein, dass die Datenbank nicht geöffnet werden kann, sofern die WebSocket-Nutzlast nicht dein IMAP-Passwort enthält.

Derzeit wird pro Postfach nur ein Backup gespeichert, aber in Zukunft könnten wir Point-in-Time-Recovery ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)") anbieten.

### Suche {#search}

Unsere IMAP-Server unterstützen den `SEARCH`-Befehl mit komplexen Abfragen, regulären Ausdrücken und mehr.

Die schnelle Suchleistung verdanken wir [FTS5](https://www.sqlite.org/fts5.html) und [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Wir speichern `Date`-Werte in den SQLite-Postfächern als [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-Strings über [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (mit UTC-Zeitzone, damit Gleichheitsvergleiche korrekt funktionieren).

Indizes werden auch für alle Eigenschaften gespeichert, die in Suchanfragen verwendet werden.

### Projekte {#projects}

Hier ist eine Tabelle mit Projekten, die wir in unserem Quellcode und Entwicklungsprozess verwenden (alphabetisch sortiert):

| Projekt                                                                                       | Zweck                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | DevOps-Automatisierungsplattform zur einfachen Wartung, Skalierung und Verwaltung unserer gesamten Serverflotte.                                                                                                                                                                                                                                                  |
| [Bree](https://github.com/breejs/bree)                                                        | Job-Scheduler für Node.js und JavaScript mit Unterstützung für cron, Daten, ms, later und benutzerfreundliche Bedienung.                                                                                                                                                                                                                                           |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Entwicklerfreundliche JavaScript- und Node.js-Logging-Bibliothek mit Fokus auf Sicherheit und Datenschutz.                                                                                                                                                                                                                                                         |
| [Lad](https://github.com/ladjs/lad)                                                           | Node.js-Framework, das unsere gesamte Architektur und das Engineering-Design mit MVC und mehr antreibt.                                                                                                                                                                                                                                                           |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL-Datenbanklösung, die wir zur Speicherung aller anderen Daten außerhalb der Postfächer verwenden (z. B. dein Konto, Einstellungen, Domains und Alias-Konfigurationen).                                                                                                                                                                                        |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB Object Document Modeling ("ODM"), das wir im gesamten Stack verwenden. Wir haben spezielle Helfer geschrieben, die es uns ermöglichen, **Mongoose weiterhin mit SQLite** zu verwenden :tada:                                                                                                                                                               |
| [Node.js](https://nodejs.org/en)                                                              | Node.js ist die Open-Source, plattformübergreifende JavaScript-Laufzeitumgebung, die alle unsere Serverprozesse ausführt.                                                                                                                                                                                                                                          |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Node.js-Paket zum Senden von E-Mails, Erstellen von Verbindungen und mehr. Wir sind offizieller Sponsor dieses Projekts.                                                                                                                                                                                                                                           |
| [Redis](https://redis.io/)                                                                    | In-Memory-Datenbank für Caching, Publish/Subscribe-Kanäle und DNS-over-HTTPS-Anfragen.                                                                                                                                                                                                                                                                             |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Verschlüsselungserweiterung für SQLite, die es erlaubt, komplette Datenbankdateien zu verschlüsseln (einschließlich Write-Ahead-Log ("[WAL](https://www.sqlite.org/wal.html)"), Journal, Rollback, …).                                                                                                                                                             |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Visueller SQLite-Editor (den du auch verwenden könntest), um Entwicklungs-Postfächer zu testen, herunterzuladen und anzusehen.                                                                                                                                                                                                                                     |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Eingebettete Datenbankschicht für skalierbaren, eigenständigen, schnellen und robusten IMAP-Speicher.                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js Anti-Spam-, E-Mail-Filter- und Phishing-Präventionstool (unsere Alternative zu [Spam Assassin](https://spamassassin.apache.org/) und [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                            |
| [Tangerine](https://tangeri.ne)                                                               | DNS-over-HTTPS-Anfragen mit Node.js und Caching mittels Redis – was globale Konsistenz und vieles mehr sicherstellt.                                                                                                                                                                                                                                               |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Unser Entwicklungsteam verwendet dies (und empfiehlt es auch) als **bevorzugten E-Mail-Client für Forward Email**.                                                                                                                                                                                                                                                |
| [UTM](https://github.com/utmapp/UTM)                                                          | Unser Entwicklungsteam nutzt dies, um virtuelle Maschinen für iOS und macOS zu erstellen, um verschiedene E-Mail-Clients (parallel) mit unseren IMAP- und SMTP-Servern zu testen.                                                                                                                                                                                  |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Modernes Open-Source-Linux-basiertes Server-Betriebssystem, das unsere gesamte Infrastruktur antreibt.                                                                                                                                                                                                                                                             |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP-Server-Bibliothek – siehe die Hinweise zu [Attachment-De-Duplizierung](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) und [IMAP-Protokollunterstützung](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                     |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Schnelle und einfache API-Bibliothek für Node.js zur programmgesteuerten Interaktion mit SQLite3.                                                                                                                                                                                                                                                                  |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Entwicklerfreundliches E-Mail-Framework zum Erstellen, Vorschauen und Versenden von benutzerdefinierten E-Mails (z. B. Konto-Benachrichtigungen und mehr).                                                                                                                                                                                                        |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL-Abfrage-Builder mit Mongo-ähnlicher Syntax. Dies spart unserem Entwicklungsteam Zeit, da wir weiterhin im Mongo-Stil über den gesamten Stack mit einem datenbankagnostischen Ansatz schreiben können. **Es hilft auch, SQL-Injection-Angriffe durch Verwendung von Abfrageparametern zu vermeiden.**                                                        |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL-Utility zum Extrahieren von Informationen über bestehende Datenbankschemata. Dies ermöglicht es uns, einfach zu validieren, dass alle Indizes, Tabellen, Spalten, Einschränkungen und mehr gültig sind und `1:1` mit dem Soll-Zustand übereinstimmen. Wir haben sogar automatisierte Helfer geschrieben, um neue Spalten und Indizes hinzuzufügen, falls Änderungen an Datenbankschemata vorgenommen werden (mit sehr detaillierten Fehlermeldungen). |
| [knex](https://github.com/knex/knex)                                                          | SQL-Abfrage-Builder, den wir nur für Datenbankmigrationen und Schema-Validierung über `knex-schema-inspector` verwenden.                                                                                                                                                                                                                                           |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatische [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)-Phrasenübersetzung mit Unterstützung für Markdown unter Verwendung der [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                            |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Node.js-Paket zum Auflösen und Herstellen von Verbindungen mit MX-Servern und zur Fehlerbehandlung.                                                                                                                                                                                                                                                                |
| [pm2](https://github.com/Unitech/pm2)                                                         | Node.js Produktionsprozessmanager mit eingebautem Load Balancer ([feinabgestimmt](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) für Performance).                                                                                                                                                                                           |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP-Server-Bibliothek – wir verwenden diese für unsere Mail-Exchange-("MX")- und ausgehenden SMTP-Server.                                                                                                                                                                                                                                                        |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Nützliches Tool zum Testen von IMAP-Servern anhand von Benchmarks und RFC-Spezifikationen zur IMAP-Protokollkompatibilität. Dieses Projekt wurde vom [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-Team erstellt (ein aktiver Open-Source-IMAP- und POP3-Server seit Juli 2002). Wir haben unseren IMAP-Server mit diesem Tool umfangreich getestet.                                    |
> Sie können weitere Projekte, die wir verwenden, in [unrem Quellcode auf GitHub](https://github.com/forwardemail) finden.

### Anbieter {#providers}

| Anbieter                                        | Zweck                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS-Anbieter, Gesundheitschecks, Load Balancer und Backup-Speicher mit [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting von Quellcode, CI/CD und Projektmanagement.                                                                          |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting von dedizierten Servern und verwalteten Datenbanken.                                                                 |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hosting von dedizierten Servern.                                                                                             |
| [DataPacket](https://www.datapacket.com)        | Hosting von dedizierten Servern.                                                                                             |


## Gedanken {#thoughts}

### Prinzipien {#principles}

Forward Email ist nach folgenden Prinzipien gestaltet:

1. Immer entwicklerfreundlich, sicherheits- und datenschutzorientiert sowie transparent sein.
2. Einhaltung von [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Ockhams Rasiermesser](https://en.wikipedia.org/wiki/Occam%27s_razor) und [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Zielgruppe sind scrappy, bootstrapped und [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) Entwickler

### Experimente {#experiments}

> **tldr;** Letztendlich sind die Verwendung von S3-kompatiblem Objektspeicher und/oder virtuellen Tabellen aus Leistungsgründen technisch nicht machbar und aufgrund von Speicherbeschränkungen fehleranfällig.

Wir haben einige Experimente durchgeführt, die zu unserer finalen SQLite-Lösung geführt haben, wie oben beschrieben.

Eines davon war der Versuch, [rclone]() und SQLite zusammen mit einer S3-kompatiblen Speicherschicht zu verwenden.

Dieses Experiment führte dazu, dass wir Randfälle im Zusammenhang mit rclone, SQLite und der Nutzung von [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) besser verstanden und entdeckten:

* Wenn Sie mit rclone die Option `--vfs-cache-mode writes` aktivieren, sind Lesevorgänge in Ordnung, aber Schreibvorgänge werden zwischengespeichert.
  * Wenn Sie mehrere IMAP-Server global verteilt haben, ist der Cache zwischen ihnen nicht synchronisiert, es sei denn, Sie haben einen einzigen Schreiber und mehrere Zuhörer (z. B. einen Pub/Sub-Ansatz).
  * Das ist unglaublich komplex, und jede zusätzliche Komplexität führt zu mehr Single Points of Failure.
  * S3-kompatible Speicheranbieter unterstützen keine partiellen Dateiänderungen – das bedeutet, jede Änderung der `.sqlite`-Datei führt zu einer vollständigen Änderung und einem erneuten Hochladen der Datenbank.
  * Andere Lösungen wie `rsync` existieren, sind aber nicht auf Write-Ahead-Log ("[WAL](https://www.sqlite.org/wal.html)")-Unterstützung ausgelegt – daher haben wir Litestream überprüft. Glücklicherweise verschlüsselt unsere Verschlüsselung bereits die [WAL](https://www.sqlite.org/wal.html)-Dateien, sodass wir nicht auf Litestream angewiesen sind. Allerdings waren wir noch nicht sicher, ob Litestream für den Produktionseinsatz geeignet ist, und haben dazu einige Anmerkungen unten.
  * Die Verwendung der Option `--vfs-cache-mode writes` (die *einzige* Möglichkeit, SQLite über `rclone` für Schreibvorgänge zu verwenden) versucht, die gesamte Datenbank im Speicher von Grund auf zu kopieren – die Handhabung eines 10-GB-Postfachs ist in Ordnung, aber bei mehreren Postfächern mit sehr großem Speicherbedarf stoßen die IMAP-Server auf Speicherbeschränkungen, `ENOMEM`-Fehler, Segmentierungsfehler und Datenkorruption.
* Wenn Sie versuchen, SQLite [Virtuelle Tabellen](https://www.sqlite.org/vtab.html) (z. B. mit [s3db](https://github.com/jrhy/s3db)) zu verwenden, um Daten auf einer S3-kompatiblen Speicherschicht zu halten, stoßen Sie auf mehrere weitere Probleme:
  * Lese- und Schreibvorgänge sind extrem langsam, da S3-API-Endpunkte mit HTTP-Methoden `GET`, `PUT`, `HEAD` und `POST` angesprochen werden müssen.
  * Entwicklungstests zeigten, dass bei mehr als 500K-1M+ Datensätzen bei Glasfaser-Internet die Durchsatzrate beim Schreiben und Lesen zu S3-kompatiblen Anbietern begrenzt ist. Unsere Entwickler führten z. B. `for`-Schleifen aus, um sowohl sequentielle SQL-`INSERT`-Anweisungen als auch solche mit Bulk-Schreibvorgängen großer Datenmengen durchzuführen. In beiden Fällen war die Leistung erschreckend langsam.
  * Virtuelle Tabellen **können keine Indizes**, `ALTER TABLE`-Anweisungen und [andere](https://stackoverflow.com/a/12507650) [Einschränkungen](https://sqlite.org/lang_createvtab.html) haben – was zu Verzögerungen von 1-2 Minuten oder mehr je nach Datenmenge führt.
  * Objekte wurden unverschlüsselt gespeichert, und eine native Verschlüsselungsunterstützung ist nicht verfügbar.
* Wir haben auch [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) untersucht, das konzeptionell und technisch ähnlich zum vorherigen Punkt ist (also die gleichen Probleme hat). Eine Möglichkeit wäre, eine benutzerdefinierte `sqlite3`-Version mit Verschlüsselung wie [wxSQLite3](https://github.com/utelle/wxsqlite3) (die wir derzeit in unserer Lösung oben verwenden) zu verwenden, indem man [die Setup-Datei bearbeitet](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Ein weiterer möglicher Ansatz war die Verwendung der [multiplex-Erweiterung](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), die jedoch eine Begrenzung von 32 GB hat und komplexe Build- und Entwicklungsprobleme verursachen würde.
* `ALTER TABLE`-Anweisungen sind erforderlich (was die Verwendung von virtuellen Tabellen komplett ausschließt). Wir benötigen `ALTER TABLE`-Anweisungen, damit unser Hook mit `knex-schema-inspector` korrekt funktioniert – das stellt sicher, dass Daten nicht beschädigt werden und abgerufene Zeilen in gültige Dokumente gemäß unseren `mongoose`-Schema-Definitionen umgewandelt werden können (einschließlich Einschränkungen, Variablentypen und beliebiger Datenvalidierung).
* Fast alle S3-kompatiblen Projekte im Zusammenhang mit SQLite in der Open-Source-Community sind in Python (und nicht in JavaScript, das wir für 100 % unseres Stacks verwenden).
* Kompressionsbibliotheken wie [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (siehe [Kommentare](https://news.ycombinator.com/item?id=32303762)) sehen vielversprechend aus, sind aber [möglicherweise noch nicht für den Produktionseinsatz bereit](https://github.com/phiresky/sqlite-zstd#usage). Stattdessen ist eine Kompression auf Anwendungsebene für Datentypen wie `String`, `Object`, `Map`, `Array`, `Set` und `Buffer` ein saubererer und einfacherer Ansatz (und leichter zu migrieren, da wir ein `Boolean`-Flag oder eine Spalte speichern könnten – oder sogar `PRAGMA` `user_version=1` für Kompression oder `user_version=0` für keine Kompression als Datenbank-Metadaten verwenden könnten).
  * Glücklicherweise haben wir bereits eine Anhangs-Deduplizierung in unserem IMAP-Server-Speicher implementiert – daher wird jeder Nachricht mit demselben Anhang nicht eine Kopie des Anhangs gespeichert, sondern ein einzelner Anhang für mehrere Nachrichten und Threads in einem Postfach gespeichert (und anschließend eine Fremdreferenz verwendet).
* Das Projekt Litestream, eine SQLite-Replikations- und Backup-Lösung, ist sehr vielversprechend und wir werden es höchstwahrscheinlich in Zukunft verwenden.
  * Nicht um die Autor(en) zu diskreditieren – wir lieben ihre Arbeit und Beiträge zur Open-Source seit über einem Jahrzehnt – aber aus der Praxis scheint es [viele Kopfschmerzen](https://github.com/benbjohnson/litestream/issues) und [potenziellen Datenverlust durch Nutzung](https://github.com/benbjohnson/litestream/issues/218) zu geben.
* Die Wiederherstellung von Backups muss reibungslos und trivial sein. Die Verwendung einer Lösung wie MongoDB mit `mongodump` und `mongoexport` ist nicht nur mühsam, sondern zeitaufwendig und komplex in der Konfiguration.
  * SQLite-Datenbanken machen es einfach (es ist eine einzelne Datei).
  * Wir wollten eine Lösung entwerfen, bei der Benutzer ihr Postfach jederzeit mitnehmen und verlassen können.
    * Einfache Node.js-Befehle wie `fs.unlink('mailbox.sqlite')` löschen es dauerhaft vom Festplattenspeicher.
    * Wir können ähnlich eine S3-kompatible API mit HTTP-`DELETE` verwenden, um Snapshots und Backups für Benutzer einfach zu entfernen.
  * SQLite war die einfachste, schnellste und kostengünstigste Lösung.
### Mangel an Alternativen {#lack-of-alternatives}

Nach unserem Wissen sind keine anderen E-Mail-Dienste auf diese Weise konzipiert, noch sind sie Open-Source.

Wir *denken, dass dies möglicherweise daran liegt*, dass bestehende E-Mail-Dienste Legacy-Technologie mit [Spaghetti-Code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: in Produktion haben.

Die meisten, wenn nicht alle bestehenden E-Mail-Dienstanbieter sind entweder Closed-Source oder werben als Open-Source, **aber in Wirklichkeit ist nur ihr Front-End Open-Source.**

**Der sensibelste Teil der E-Mail** (die eigentliche Speicherung/IMAP/SMTP-Interaktion) **findet vollständig im Back-End (Server) statt und *nicht* im Front-End (Client).**

### Probieren Sie Forward Email aus {#try-out-forward-email}

Melden Sie sich noch heute an unter <https://forwardemail.net>! :rocket:
