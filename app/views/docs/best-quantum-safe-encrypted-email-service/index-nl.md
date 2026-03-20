# Kwantumveilige E-mail: Hoe wij versleutelde SQLite-mailboxen gebruiken om uw e-mail veilig te houden {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Vergelijking van e-mailserviceproviders](#email-service-provider-comparison)
* [Hoe werkt het](#how-does-it-work)
* [Technologieën](#technologies)
  * [Databases](#databases)
  * [Beveiliging](#security)
  * [Mailboxen](#mailboxes)
  * [Gelijktijdigheid](#concurrency)
  * [Back-ups](#backups)
  * [Zoeken](#search)
  * [Projecten](#projects)
  * [Providers](#providers)
* [Gedachten](#thoughts)
  * [Principes](#principles)
  * [Experimenten](#experiments)
  * [Gebrek aan alternatieven](#lack-of-alternatives)
  * [Probeer Forward Email uit](#try-out-forward-email)


## Voorwoord {#foreword}

> \[!IMPORTANT]
> Onze e-mailservice is [100% open-source](https://github.com/forwardemail) en privacygericht door middel van veilige en versleutelde SQLite-mailboxen.

Totdat we [IMAP-ondersteuning](/faq#do-you-support-receiving-email-with-imap) lanceerden, gebruikten we MongoDB voor onze behoeften aan persistente gegevensopslag.

Deze technologie is geweldig en we gebruiken het nog steeds – maar om encryptie-at-rest met MongoDB te hebben, moet je een provider gebruiken die MongoDB Enterprise aanbiedt, zoals Digital Ocean of Mongo Atlas – of betalen voor een enterprise-licentie (en vervolgens te maken krijgen met vertragingen van het verkoopteam).

Ons team bij [Forward Email](https://forwardemail.net) had een ontwikkelaarsvriendelijke, schaalbare, betrouwbare en versleutelde opslagoplossing nodig voor IMAP-mailboxen. Als open-source ontwikkelaars was het tegen [onze principes](#principles) om een technologie te gebruiken waarvoor je een licentievergoeding moet betalen om de encryptie-at-rest functie te krijgen – dus hebben we geëxperimenteerd, onderzoek gedaan en een nieuwe oplossing vanaf nul ontwikkeld om aan deze behoeften te voldoen.

In plaats van een gedeelde database te gebruiken om uw mailboxen op te slaan, slaan we uw mailboxen individueel op en versleutelen we ze met uw wachtwoord (dat alleen u kent). **Onze e-mailservice is zo veilig dat als u uw wachtwoord vergeet, u uw mailbox verliest** (en moet herstellen met offline back-ups of opnieuw moet beginnen).

Lees verder terwijl we hieronder dieper ingaan met een [vergelijking van e-mailserviceproviders](#email-service-provider-comparison), [hoe onze service werkt](#how-does-it-work), [onze technologiestack](#technologies) en meer.


## Vergelijking van e-mailserviceproviders {#email-service-provider-comparison}

Wij zijn de enige 100% open-source en privacygerichte e-mailserviceprovider die individueel versleutelde SQLite-mailboxen opslaat, onbeperkte domeinen, aliassen en gebruikers aanbiedt, en ondersteuning heeft voor uitgaande SMTP, IMAP en POP3:

**In tegenstelling tot andere e-mailproviders hoeft u bij Forward Email niet per domein of alias te betalen voor opslag.** Opslag wordt gedeeld over uw hele account – dus als u meerdere aangepaste domeinnamen en meerdere aliassen op elk heeft, zijn wij de perfecte oplossing voor u. Houd er rekening mee dat u nog steeds opslaglimieten kunt afdwingen indien gewenst, per domein of alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lees Vergelijking E-mailservices <i class="fa fa-search-plus"></i></a>


## Hoe werkt het {#how-does-it-work}

1. Met uw e-mailclient zoals Apple Mail, Thunderbird, Gmail of Outlook – maakt u verbinding met onze beveiligde [IMAP](/faq#do-you-support-receiving-email-with-imap) servers met uw gebruikersnaam en wachtwoord:

   * Uw gebruikersnaam is uw volledige alias met uw domein, zoals `hello@example.com`.
   * Uw wachtwoord wordt willekeurig gegenereerd en wordt slechts 30 seconden aan u getoond wanneer u klikt op <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> vanuit <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen.
2. Zodra je verbonden bent, zal je e-mailclient [IMAP-protocolcommando's](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) naar onze IMAP-server sturen om je mailbox synchroon te houden. Dit omvat het schrijven en opslaan van concept-e-mails en andere acties die je mogelijk uitvoert (bijv. een e-mail markeren als Belangrijk of een e-mail markeren als Spam/Ongewenste Mail).

3. Mail exchange-servers (vaak bekend als "MX"-servers) ontvangen nieuwe inkomende e-mail en slaan deze op in je mailbox. Wanneer dit gebeurt, wordt je e-mailclient hiervan op de hoogte gesteld en synchroniseert je mailbox. Onze mail exchange-servers kunnen je e-mail doorsturen naar een of meer ontvangers (inclusief [webhooks](/faq#do-you-support-webhooks)), je e-mail voor je opslaan in je versleutelde IMAP-opslag bij ons, **of beide**!

   > \[!TIP]
   > Geïnteresseerd om meer te leren? Lees [hoe je e-mail doorsturen instelt](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hoe onze mail exchange-service werkt](/faq#how-does-your-email-forwarding-system-work), of bekijk [onze handleidingen](/guides).

4. Achter de schermen werkt ons ontwerp voor veilige e-mailopslag op twee manieren om je mailboxen versleuteld te houden en alleen toegankelijk voor jou:

   * Wanneer er nieuwe mail voor je binnenkomt van een afzender, schrijven onze mail exchange-servers naar een individuele, tijdelijke en versleutelde mailbox voor jou.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inkomend bericht ontvangen voor je alias (bijv. jij@jouwdomein.com).
         MX->>SQLite: Bericht wordt opgeslagen in een tijdelijke mailbox.
         Note over MX,SQLite: Stuurt door naar andere ontvangers en geconfigureerde webhooks.
         MX->>Sender: Succes!
     ```

   * Wanneer je verbinding maakt met onze IMAP-server met je e-mailclient, wordt je wachtwoord vervolgens in het geheugen versleuteld en gebruikt om je mailbox te lezen en te schrijven. Je mailbox kan alleen gelezen en beschreven worden met dit wachtwoord. Houd er rekening mee dat omdat jij de enige bent met dit wachtwoord, **alleen jij** je mailbox kunt lezen en schrijven wanneer je deze benadert. De volgende keer dat je e-mailclient probeert mail op te halen of te synchroniseren, worden je nieuwe berichten overgebracht van deze tijdelijke mailbox en opgeslagen in je daadwerkelijke mailboxbestand met behulp van je opgegeven wachtwoord. Let op dat deze tijdelijke mailbox daarna wordt geleegd en verwijderd zodat alleen je met een wachtwoord beveiligde mailbox de berichten bevat.

   * **Als je verbonden bent met IMAP (bijv. met een e-mailclient zoals Apple Mail of Thunderbird), hoeven we niet naar tijdelijke schijfopslag te schrijven. Je in-memory versleutelde IMAP-wachtwoord wordt in plaats daarvan opgehaald en gebruikt. In realtime, wanneer een bericht aan jou wordt bezorgd, sturen we een WebSocket-verzoek naar alle IMAP-servers om te vragen of ze een actieve sessie voor jou hebben (dit is het ophalen), en vervolgens geven we dat versleutelde in-memory wachtwoord door – zodat we niet naar een tijdelijke mailbox hoeven te schrijven, maar direct naar je daadwerkelijke versleutelde mailbox kunnen schrijven met je versleutelde wachtwoord.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Je maakt verbinding met de IMAP-server via een e-mailclient.
         IMAP->>SQLite: Verplaatst bericht van tijdelijke mailbox naar de mailbox van je alias.
         Note over IMAP,SQLite: De mailbox van je alias is alleen beschikbaar in het geheugen met het IMAP-wachtwoord.
         SQLite->>IMAP: Haalt berichten op zoals gevraagd door de e-mailclient.
         IMAP->>You: Succes!
     ```

5. [Back-ups van je versleutelde mailboxen](#backups) worden dagelijks gemaakt. Je kunt ook op elk moment een nieuwe back-up aanvragen of de laatste back-up downloaden via <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen. Als je besluit over te stappen naar een andere e-mailservice, kun je eenvoudig je mailboxen en back-ups migreren, downloaden, exporteren en verwijderen wanneer je maar wilt.


## Technologieën {#technologies}

### Databases {#databases}

We hebben andere mogelijke database-opslaglagen onderzocht, maar geen enkele voldeed zo goed aan onze eisen als SQLite:
| Database                                               |                                                                    Encryptie in rust                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Mailboxes  |                           Licentie                           | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ja met [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Alleen beschikbaar in MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relationele database                               |                   :x: AGPL en `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Alleen netwerk](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relationele database                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Niet getest en nog niet ondersteund?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Niet getest en nog niet ondersteund?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ja](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relationele database                               | :white_check_mark: `PostgreSQL` (vergelijkbaar met `BSD` of `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Alleen voor InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relationele database                               |          :white_check_mark: `GPLv2` en `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Alleen Enterprise-functie](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relationele database                               |                  :x: `BUSL-1.1` en anderen                  |                             :x:                             |

> Hier is een [blogpost die verschillende SQLite database opslagopties vergelijkt](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) in de bovenstaande tabel.

### Beveiliging {#security}

Te allen tijde gebruiken we [encryptie in rust](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [encryptie tijdens transport](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") met :tangerine: [Tangerine](https://tangeri.ne), en [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) encryptie op mailboxen. Daarnaast gebruiken we token-gebaseerde tweefactorauthenticatie (in tegenstelling tot SMS, dat vatbaar is voor [man-in-the-middle-aanvallen](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), geroteerde SSH-sleutels met roottoegang uitgeschakeld, exclusieve toegang tot servers via beperkte IP-adressen, en meer.
In het geval van een [evil maid attack](https://en.wikipedia.org/wiki/Evil_maid_attack) of een rogue medewerker van een derde partij, **kan je mailbox nog steeds alleen worden geopend met jouw gegenereerde wachtwoord**. Wees gerust, we vertrouwen niet op andere derde partijen dan onze SOC Type 2 compliant serverproviders Cloudflare, DataPacket, Digital Ocean, GitHub en Vultr.

Ons doel is om zo min mogelijk [single point of failures](https://en.wikipedia.org/wiki/Single_point_of_failure) te hebben.

### Mailboxes {#mailboxes}

> **tldr;** Onze IMAP-servers gebruiken individueel versleutelde SQLite-databases voor elk van jouw mailboxen.

[SQLite is een extreem populaire](https://www.sqlite.org/mostdeployed.html) embedded database – het draait momenteel op je telefoon en computer – [en wordt gebruikt door bijna alle grote technologieën](https://www.sqlite.org/famous.html).

Bijvoorbeeld, op onze versleutelde servers is er een SQLite database mailbox voor `linux@example.com`, `info@example.com`, `hello@example.com` enzovoort – één voor elk als een `.sqlite` databasebestand. We noemen de databasebestanden ook niet met het e-mailadres – in plaats daarvan gebruiken we BSON ObjectID en unieke UUID's die niet onthullen van wie de mailbox is of onder welk e-mailadres het valt (bijv. `353a03f21e534321f5d6e267.sqlite`).

Elk van deze databases is zelf versleuteld met jouw wachtwoord (dat alleen jij hebt) met behulp van [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Dit betekent dat je mailboxen individueel versleuteld, zelfvoorzienend, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) en draagbaar zijn.

We hebben SQLite fijn afgestemd met de volgende [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Doel                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite database encryptie](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Zie `better-sqlite3-multiple-ciphers` onder [Projects](#projects) voor meer inzicht.                                      |
| `key="****************"` | Dit is jouw alleen in het geheugen ontsleutelde wachtwoord dat via de IMAP-verbinding van je e-mailclient naar onze server wordt gestuurd. Nieuwe database-instanties worden aangemaakt en gesloten voor elke lees- en schrijfsessie (om sandboxing en isolatie te garanderen). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [die de prestaties verbetert en gelijktijdige lees-toegang mogelijk maakt](https://litestream.io/tips/#wal-journal-mode).                                                                     |
| `busy_timeout=5000`      | Voorkomt write-lock fouten [terwijl andere schrijfbewerkingen plaatsvinden](https://litestream.io/tips/#busy-timeout).                                                                                                                                   |
| `synchronous=NORMAL`     | Verhoogt de duurzaamheid van transacties [zonder risico op datacorruptie](https://litestream.io/tips/#synchronous-pragma).                                                                                                                               |
| `foreign_keys=ON`        | Zorgt ervoor dat verwijzingen met foreign keys (bijv. een relatie van de ene tabel naar de andere) worden afgedwongen. [Standaard staat dit niet aan in SQLite](https://www.sqlite.org/foreignkeys.html), maar voor validatie en data-integriteit moet dit aan staan. |
| `encoding='UTF-8'`       | [Standaard codering](https://www.sqlite.org/pragma.html#pragma_encoding) om te gebruiken ter bevordering van ontwikkelaarsrust.                                                                                                                           |
> Alle andere standaardinstellingen zijn afkomstig van SQLite zoals gespecificeerd in de [officiële PRAGMA-documentatie](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Gelijktijdigheid {#concurrency}

> **tldr;** We gebruiken `WebSocket` voor gelijktijdige lees- en schrijfbewerkingen op je versleutelde SQLite-mailboxen.

#### Lezen {#reads}

Je e-mailclient op je telefoon kan `imap.forwardemail.net` oplossen naar een van onze Digital Ocean IP-adressen – en je desktopclient kan een ander IP-adres van een andere [provider](#providers) oplossen.

Ongeacht met welke IMAP-server je e-mailclient verbinding maakt, willen we dat de verbinding in realtime en met 100% nauwkeurigheid uit je database leest. Dit gebeurt via WebSockets.

#### Schrijven {#writes}

Schrijven naar je database is iets anders – omdat SQLite een embedded database is en je mailbox standaard in één bestand staat.

We hebben opties onderzocht zoals `litestream`, `rqlite` en `dqlite` hieronder – maar geen van deze voldeed aan onze eisen.

Om schrijven met write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") ingeschakeld mogelijk te maken – moeten we ervoor zorgen dat slechts één server ("Primary") hiervoor verantwoordelijk is.  [WAL](https://www.sqlite.org/wal.html) versnelt gelijktijdigheid aanzienlijk en maakt één schrijver en meerdere lezers mogelijk.

De Primary draait op de dataservers met de aangekoppelde volumes die de versleutelde mailboxen bevatten. Vanuit distributieperspectief kun je alle individuele IMAP-servers achter `imap.forwardemail.net` beschouwen als secundaire servers ("Secondary").

We realiseren tweerichtingscommunicatie met [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primary-servers gebruiken een instantie van [ws](https://github.com/websockets/ws)'s `WebSocketServer`.
* Secondary-servers gebruiken een instantie van [ws](https://github.com/websockets/ws)'s `WebSocket` client die is ingepakt met [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) en [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Deze twee wrappers zorgen ervoor dat de `WebSocket` opnieuw verbinding maakt en data kan verzenden en ontvangen voor specifieke database-schrijfbewerkingen.

### Back-ups {#backups}

> **tldr;** Back-ups van je versleutelde mailboxen worden dagelijks gemaakt. Je kunt ook direct een nieuwe back-up aanvragen of de laatste back-up op elk moment downloaden via <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen.

Voor back-ups voeren we elke dag tijdens de IMAP-commandoverwerking simpelweg het SQLite-commando `VACUUM INTO` uit, waarbij je versleutelde wachtwoord wordt gebruikt vanuit een in-memory IMAP-verbinding. Back-ups worden opgeslagen als er geen bestaande back-up wordt gedetecteerd of als de [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash van het bestand is veranderd ten opzichte van de meest recente back-up.

Let op dat we het `VACUUM INTO`-commando gebruiken in plaats van het ingebouwde `backup`-commando, omdat als een pagina wordt gewijzigd tijdens een `backup`-commando, het opnieuw moet beginnen. Het `VACUUM INTO`-commando maakt een momentopname. Zie deze opmerkingen op [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) en [Hacker News](https://news.ycombinator.com/item?id=31387556) voor meer inzicht.

Daarnaast gebruiken we `VACUUM INTO` in plaats van `backup`, omdat het `backup`-commando de database tijdelijk onversleuteld zou achterlaten totdat `rekey` wordt uitgevoerd (zie deze GitHub [opmerking](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) voor uitleg).

De Secondary geeft via de `WebSocket`-verbinding opdracht aan de Primary om de back-up uit te voeren – en de Primary ontvangt dan het commando en zal vervolgens:

1. Verbinden met je versleutelde mailbox.
2. Een schrijflock verkrijgen.
3. Een WAL-checkpoint uitvoeren via `wal_checkpoint(PASSIVE)`.
4. Het SQLite-commando `VACUUM INTO` uitvoeren.
5. Controleren of het gekopieerde bestand geopend kan worden met het versleutelde wachtwoord (veiligheidsmaatregel).
6. Het uploaden naar Cloudflare R2 voor opslag (of je eigen provider als die is opgegeven).
<!--
7. Comprimeer het resulterende back-upbestand met `gzip`.
8. Upload het naar Cloudflare R2 voor opslag (of je eigen provider indien gespecificeerd).
-->

Onthoud dat je mailboxen versleuteld zijn – en hoewel we IP-beperkingen en andere authenticatiemaatregelen hebben voor WebSocket-communicatie – in het geval van een kwaadwillende, kun je er zeker van zijn dat tenzij de WebSocket-payload je IMAP-wachtwoord bevat, het je database niet kan openen.

Er wordt momenteel slechts één back-up per mailbox opgeslagen, maar in de toekomst bieden we mogelijk point-in-time recovery ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Zoeken {#search}

Onze IMAP-servers ondersteunen het `SEARCH`-commando met complexe zoekopdrachten, reguliere expressies en meer.

Snelle zoekprestaties zijn te danken aan [FTS5](https://www.sqlite.org/fts5.html) en [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

We slaan `Date`-waarden op in de SQLite-mailboxen als [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) strings via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (met UTC-tijdzone zodat gelijkheidsvergelijkingen correct functioneren).

Indices worden ook opgeslagen voor alle eigenschappen die in zoekopdrachten voorkomen.

### Projecten {#projects}

Hier is een tabel met projecten die we gebruiken in onze broncode en ontwikkelproces (alfabetisch gesorteerd):

| Project                                                                                       | Doel                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | DevOps-automatiseringsplatform voor het eenvoudig onderhouden, schalen en beheren van onze gehele servervloot.                                                                                                                                                                                                                                                     |
| [Bree](https://github.com/breejs/bree)                                                        | Taakplanner voor Node.js en JavaScript met ondersteuning voor cron, data, ms, later en mensvriendelijke formaten.                                                                                                                                                                                                                                                  |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Ontwikkelaarsvriendelijke JavaScript- en Node.js-loggingbibliotheek met aandacht voor beveiliging en privacy.                                                                                                                                                                                                                                                     |
| [Lad](https://github.com/ladjs/lad)                                                           | Node.js-framework dat onze gehele architectuur en engineeringontwerp aandrijft met MVC en meer.                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL-databaseoplossing die we gebruiken voor het opslaan van alle andere data buiten mailboxen (bijv. je account, instellingen, domeinen en aliasconfiguraties).                                                                                                                                                                                                  |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB object document modeling ("ODM") die we in onze gehele stack gebruiken. We hebben speciale helpers geschreven die ons in staat stellen om eenvoudig **Mongoose met SQLite** te blijven gebruiken :tada:                                                                                                                                                     |
| [Node.js](https://nodejs.org/en)                                                              | Node.js is de open-source, cross-platform JavaScript runtime-omgeving die al onze serverprocessen uitvoert.                                                                                                                                                                                                                                                        |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Node.js-pakket voor het verzenden van e-mails, het maken van verbindingen en meer. We zijn een officiële sponsor van dit project.                                                                                                                                                                                                                                 |
| [Redis](https://redis.io/)                                                                    | In-memory database voor caching, publish/subscribe-kanalen en DNS over HTTPS-verzoeken.                                                                                                                                                                                                                                                                             |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Encryptie-extensie voor SQLite om volledige databasebestanden te versleutelen (inclusief de write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                                     |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Visuele SQLite-editor (die je ook kunt gebruiken) om ontwikkelmailboxen te testen, downloaden en bekijken.                                                                                                                                                                                                                                                       |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Embedded databaselaag voor schaalbare, zelfstandige, snelle en robuuste IMAP-opslag.                                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js anti-spam, e-mailfiltering en phishingpreventietool (ons alternatief voor [Spam Assassin](https://spamassassin.apache.org/) en [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                               | DNS over HTTPS-verzoeken met Node.js en caching via Redis – wat zorgt voor wereldwijde consistentie en nog veel meer.                                                                                                                                                                                                                                             |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Ons ontwikkelingsteam gebruikt dit (en raadt dit ook aan) als **de voorkeurs e-mailclient om te gebruiken met Forward Email**.                                                                                                                                                                                                                                    |
| [UTM](https://github.com/utmapp/UTM)                                                          | Ons ontwikkelingsteam gebruikt dit om virtuele machines voor iOS en macOS te creëren om verschillende e-mailclients (parallel) te testen met onze IMAP- en SMTP-servers.                                                                                                                                                                                          |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Modern open-source Linux-gebaseerd serverbesturingssysteem dat onze gehele infrastructuur aandrijft.                                                                                                                                                                                                                                                               |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP-serverbibliotheek – zie de notities over [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) en [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                  |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Snelle en eenvoudige API-bibliotheek voor Node.js om programmatic met SQLite3 te communiceren.                                                                                                                                                                                                                                                                     |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Ontwikkelaarsvriendelijk e-mailframework om aangepaste e-mails te maken, te bekijken en te verzenden (bijv. accountmeldingen en meer).                                                                                                                                                                                                                           |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL-querybuilder met Mongo-stijl syntax. Dit bespaart ons ontwikkelingsteam tijd omdat we in Mongo-stijl kunnen blijven schrijven over de gehele stack met een database-agnostische aanpak. **Het helpt ook SQL-injectieaanvallen te voorkomen door gebruik van queryparameters.**                                                                             |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL-hulpmiddel om informatie over bestaande databaseschema's te extraheren. Dit stelt ons in staat om eenvoudig te valideren dat alle indices, tabellen, kolommen, constraints en meer geldig zijn en `1:1` overeenkomen met hoe ze zouden moeten zijn. We hebben zelfs geautomatiseerde helpers geschreven om nieuwe kolommen en indexen toe te voegen als er wijzigingen zijn in databaseschema's (met zeer gedetailleerde foutmeldingen). |
| [knex](https://github.com/knex/knex)                                                          | SQL-querybuilder die we alleen gebruiken voor database-migraties en schema-validatie via `knex-schema-inspector`.                                                                                                                                                                                                                                                   |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatische [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) zinsvertaling met ondersteuning voor Markdown via de [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                 |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Node.js-pakket om verbindingen met MX-servers op te lossen en tot stand te brengen en fouten af te handelen.                                                                                                                                                                                                                                                      |
| [pm2](https://github.com/Unitech/pm2)                                                         | Node.js productieprocesmanager met ingebouwde load balancer ([fijn afgesteld](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) voor prestaties).                                                                                                                                                                                               |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP-serverbibliotheek – we gebruiken dit voor onze mail exchange ("MX") en uitgaande SMTP-servers.                                                                                                                                                                                                                                                                |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Handige tool om IMAP-servers te testen tegen benchmarks en RFC-specificatie IMAP-protocolcompatibiliteit. Dit project is gemaakt door het [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) team (een actieve open-source IMAP- en POP3-server sinds juli 2002). We hebben onze IMAP-server uitgebreid getest met deze tool.                                    |
> Je kunt andere projecten die we gebruiken vinden in [onze broncode op GitHub](https://github.com/forwardemail).

### Providers {#providers}

| Provider                                        | Doel                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS-provider, health checks, load balancers en back-upopslag met behulp van [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting van broncode, CI/CD en projectbeheer.                                                                              |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedicated server hosting en beheerde databases.                                                                             |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Dedicated server hosting.                                                                                                   |
| [DataPacket](https://www.datapacket.com)        | Dedicated server hosting.                                                                                                   |


## Gedachten {#thoughts}

### Principes {#principles}

Forward Email is ontworpen volgens deze principes:

1. Altijd ontwikkelaarsvriendelijk, gericht op veiligheid en privacy, en transparant zijn.
2. Zich houden aan [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), en [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Gericht op de scrappy, bootstrapped en [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) ontwikkelaar

### Experimenten {#experiments}

> **tldr;** Uiteindelijk zijn het gebruik van S3-compatibele objectopslag en/of Virtual Tables technisch niet haalbaar vanwege prestatieproblemen en gevoeligheid voor fouten door geheugenbeperkingen.

We hebben een paar experimenten gedaan die leidden tot onze uiteindelijke SQLite-oplossing zoals hierboven besproken.

Een daarvan was het proberen te gebruiken van [rclone]() en SQLite samen met een S3-compatibele opslaglaag.

Dat experiment leidde ertoe dat we edge cases rondom rclone, SQLite en [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) gebruik beter begrepen en ontdekten:

* Als je de `--vfs-cache-mode writes` vlag inschakelt met rclone, dan zijn lezen OK, maar schrijven wordt gecachet.
  * Als je meerdere IMAP-servers wereldwijd verspreid hebt, dan zal de cache niet synchroon zijn tussen hen tenzij je een enkele schrijver en meerdere luisteraars hebt (bijv. een pub/sub-benadering).
  * Dit is ongelooflijk complex en het toevoegen van extra complexiteit zoals dit zal resulteren in meer single points of failure.
  * S3-compatibele opslagproviders ondersteunen geen gedeeltelijke bestandswijzigingen – wat betekent dat elke wijziging van het `.sqlite` bestand resulteert in een volledige wijziging en her-upload van de database.
  * Andere oplossingen zoals `rsync` bestaan, maar zijn niet gericht op write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") ondersteuning – dus we hebben Litestream bekeken. Gelukkig versleutelt ons encryptiegebruik al de [WAL](https://www.sqlite.org/wal.html) bestanden voor ons, dus we hoeven niet op Litestream te vertrouwen daarvoor. We waren echter nog niet zeker van Litestream voor productiegebruik en hebben daar een paar opmerkingen over hieronder.
  * Het gebruik van deze optie `--vfs-cache-mode writes` (de *enige* manier om SQLite over `rclone` te gebruiken voor schrijven) zal proberen de hele database vanaf nul in het geheugen te kopiëren – het verwerken van één mailbox van 10 GB is OK, maar het verwerken van meerdere mailboxen met extreem hoge opslag zal ervoor zorgen dat de IMAP-servers geheugenlimieten bereiken en `ENOMEM` fouten, segmentatiefouten en datacorruptie optreden.
* Als je probeert SQLite [Virtual Tables](https://www.sqlite.org/vtab.html) te gebruiken (bijv. met [s3db](https://github.com/jrhy/s3db)) om data live op een S3-compatibele opslaglaag te hebben, dan loop je tegen meerdere problemen aan:
  * Lezen en schrijven zal extreem traag zijn omdat S3 API-eindpunten moeten worden aangesproken met HTTP `GET`, `PUT`, `HEAD` en `POST` methoden.
  * Ontwikkelingstests toonden aan dat het overschrijden van 500K-1M+ records op glasvezelinternet nog steeds beperkt wordt door de doorvoersnelheid van schrijven en lezen naar S3-compatibele providers. Bijvoorbeeld, onze ontwikkelaars draaiden `for` loops om zowel sequentiële SQL `INSERT` statements als bulk schrijfoperaties uit te voeren. In beide gevallen was de prestatie verbazingwekkend traag.
  * Virtual tables **kunnen geen indexen hebben**, `ALTER TABLE` statements, en [andere](https://stackoverflow.com/a/12507650) [beperkingen](https://sqlite.org/lang_createvtab.html) – wat leidt tot vertragingen van 1-2 minuten of meer afhankelijk van de hoeveelheid data.
  * Objecten werden onversleuteld opgeslagen en er is geen native encryptieondersteuning beschikbaar.
* We hebben ook het gebruik van [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) onderzocht, wat conceptueel en technisch vergelijkbaar is met het vorige punt (dus dezelfde problemen heeft). Een mogelijkheid zou zijn om een aangepaste `sqlite3` build te gebruiken met encryptie zoals [wxSQLite3](https://github.com/utelle/wxsqlite3) (die we momenteel gebruiken in onze oplossing hierboven) via [het aanpassen van het setup-bestand](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Een andere mogelijke aanpak was het gebruik van de [multiplex extensie](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), maar dit heeft een limiet van 32 GB en zou complexe bouw- en ontwikkelingsproblemen veroorzaken.
* `ALTER TABLE` statements zijn vereist (dus dit sluit het gebruik van Virtual Tables volledig uit). We hebben `ALTER TABLE` statements nodig zodat onze hook met `knex-schema-inspector` correct werkt – wat ervoor zorgt dat data niet corrupt raakt en opgehaalde rijen kunnen worden omgezet naar geldige documenten volgens onze `mongoose` schema definities (inclusief constraints, variabele types en arbitraire datavalidatie).
* Bijna alle S3-compatibele projecten gerelateerd aan SQLite in de open-source gemeenschap zijn in Python (en niet JavaScript, wat we voor 100% van onze stack gebruiken).
* Compressiebibliotheken zoals [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (zie [comments](https://news.ycombinator.com/item?id=32303762)) zien er veelbelovend uit, maar [zijn mogelijk nog niet klaar voor productiegebruik](https://github.com/phiresky/sqlite-zstd#usage). In plaats daarvan is compressie aan de applicatiezijde op datatypes zoals `String`, `Object`, `Map`, `Array`, `Set` en `Buffer` een schonere en makkelijkere aanpak (en ook makkelijker te migreren, omdat we een `Boolean` vlag of kolom kunnen opslaan – of zelfs `PRAGMA` `user_version=1` voor compressie of `user_version=0` voor geen compressie als databasemetadata).
  * Gelukkig hebben we al attachment de-duplicatie geïmplementeerd in onze IMAP-server opslag – dus elk bericht met dezelfde bijlage bewaart niet meerdere kopieën van de bijlage – in plaats daarvan wordt één bijlage opgeslagen voor meerdere berichten en threads in een mailbox (en wordt vervolgens een externe referentie gebruikt).
* Het project Litestream, een SQLite replicatie- en back-upoplossing, is zeer veelbelovend en we zullen het waarschijnlijk in de toekomst gebruiken.
  * Niet om de auteur(s) te kort te doen – want we houden van hun werk en bijdragen aan open-source al meer dan tien jaar – maar uit praktijkgebruik blijkt dat er [mogelijk veel problemen](https://github.com/benbjohnson/litestream/issues) en [potentieel dataverlies door gebruik](https://github.com/benbjohnson/litestream/issues/218) kunnen zijn.
* Back-up herstel moet soepel en triviaal zijn. Het gebruik van een oplossing zoals MongoDB met `mongodump` en `mongoexport` is niet alleen omslachtig, maar ook tijdrovend en complex qua configuratie.
  * SQLite databases maken het eenvoudig (het is één bestand).
  * We wilden een oplossing ontwerpen waarbij gebruikers hun mailbox op elk moment kunnen meenemen en vertrekken.
    * Simpele Node.js commando’s zoals `fs.unlink('mailbox.sqlite'))` en het is permanent verwijderd van de schijf.
    * We kunnen op vergelijkbare wijze een S3-compatibele API gebruiken met HTTP `DELETE` om snapshots en back-ups eenvoudig te verwijderen voor gebruikers.
  * SQLite was de eenvoudigste, snelste en meest kosteneffectieve oplossing.
### Gebrek aan alternatieven {#lack-of-alternatives}

Voor zover wij weten, zijn er geen andere e-maildiensten die op deze manier zijn ontworpen noch open-source zijn.

Wij *denken dat dit mogelijk komt door* bestaande e-maildiensten die legacy-technologie in productie hebben met [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De meeste, zo niet alle, bestaande e-maildienstverleners zijn ofwel closed-source of adverteren als open-source, **maar in werkelijkheid is alleen hun front-end open-source.**

**Het meest gevoelige deel van e-mail** (de daadwerkelijke opslag/IMAP/SMTP-interactie) **wordt volledig op de back-end (server) gedaan, en *niet* op de front-end (client)**.

### Probeer Forward Email uit {#try-out-forward-email}

Meld je vandaag nog aan op <https://forwardemail.net>! :rocket:
