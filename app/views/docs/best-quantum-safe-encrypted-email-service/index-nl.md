# Quantum Resistant Email: Hoe we gecodeerde SQLite-mailboxen gebruiken om uw e-mail veilig te houden {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Vergelijking van e-mail serviceproviders](#email-service-provider-comparison)
* [Hoe werkt het?](#how-does-it-work)
* [Technologieën](#technologies)
  * [Databanken](#databases)
  * [Beveiliging](#security)
  * [Brievenbussen](#mailboxes)
  * [Gelijktijdigheid](#concurrency)
  * [Back-ups](#backups)
  * [Zoekopdracht](#search)
  * [Projecten](#projects)
  * [Leveranciers](#providers)
* [Gedachten](#thoughts)
  * [Principes](#principles)
  * [Experimenten](#experiments)
  * [Gebrek aan alternatieven](#lack-of-alternatives)
  * [Probeer Forward Email uit](#try-out-forward-email)

## Voorwoord {#foreword}

> \[!IMPORTANT]
> Onze e-mailservice is [100% open source](https://github.com/forwardemail) en is gericht op privacy via beveiligde en versleutelde SQLite-mailboxen.

Totdat we [IMAP-ondersteuning](/faq#do-you-support-receiving-email-with-imap) lanceerden, gebruikten we MongoDB voor onze permanente gegevensopslagbehoeften.

Deze technologie is verbazingwekkend en we gebruiken hem nog steeds. Om echter encryptie-at-rest met MongoDB te gebruiken, moet u een provider gebruiken die MongoDB Enterprise aanbiedt, zoals Digital Ocean of Mongo Atlas. U kunt ook betalen voor een zakelijke licentie (waardoor u vervolgens te maken krijgt met de latentie van het verkoopteam).

Ons team bij [E-mail doorsturen](https://forwardemail.net) had behoefte aan een ontwikkelaarsvriendelijke, schaalbare, betrouwbare en versleutelde opslagoplossing voor IMAP-mailboxen. Als open-sourceontwikkelaars was het gebruik van een technologie waarvoor je licentiekosten moet betalen om de versleuteling in rust te krijgen, tegen [onze principes](#principles). Daarom experimenteerden, onderzochten en ontwikkelden we een nieuwe oplossing vanaf nul om aan deze behoeften te voldoen.

In plaats van een gedeelde database te gebruiken om uw mailboxen op te slaan, slaan wij uw mailboxen individueel op en versleutelen we ze met uw wachtwoord (dat alleen u kent). **Onze e-mailservice is zo veilig dat als u uw wachtwoord vergeet, u uw mailbox kwijtraakt** (en u deze moet herstellen met offline back-ups of opnieuw moet beginnen).

Lees verder, want hieronder gaan we dieper in op [vergelijking van e-maildienstverleners](#email-service-provider-comparison), [hoe onze service werkt](#how-does-it-work), [onze technologie stack](#technologies) en meer.

## Vergelijking van e-mailproviders {#email-service-provider-comparison}

Wij zijn de enige 100% open-source en privacygerichte e-mailprovider die individueel versleutelde SQLite-mailboxen opslaat, een onbeperkt aantal domeinen, aliassen en gebruikers biedt en ondersteuning biedt voor uitgaande SMTP, IMAP en POP3:

**In tegenstelling tot andere e-mailproviders hoeft u met Forward Email niet te betalen voor opslag per domein of alias.** De opslag wordt gedeeld over uw gehele account. Dus als u meerdere aangepaste domeinnamen en meerdere aliassen per domein hebt, zijn wij de perfecte oplossing voor u. Houd er rekening mee dat u desgewenst nog steeds opslaglimieten per domein of alias kunt instellen.

<a href="/blog/beste-e-mailservice" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lees de vergelijking van e-mailservices <i class="fa fa-search-plus"></i></a>

## Hoe werkt het {#how-does-it-work}

1. Met behulp van uw e-mailclient zoals Apple Mail, Betterbird, Gmail of Outlook maakt u verbinding met onze beveiligde [IMAP](/faq#do-you-support-receiving-email-with-imap)-servers met uw gebruikersnaam en wachtwoord:

* Je gebruikersnaam is je volledige alias bij je domein, bijvoorbeeld `hello@example.com`.
* Je wachtwoord wordt willekeurig gegenereerd en wordt slechts 30 seconden weergegeven wanneer je op <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord genereren</strong> klikt vanuit <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen.

2. Zodra de verbinding tot stand is gebracht, stuurt uw e-mailclient [IMAP-protocolopdrachten](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) naar onze IMAP-server om uw mailbox gesynchroniseerd te houden. Dit omvat het schrijven en opslaan van concept-e-mails en andere acties die u uitvoert (bijvoorbeeld een e-mail als belangrijk markeren of markeren als spam/ongewenste e-mail).

3. Mail Exchange-servers (algemeen bekend als "MX"-servers) ontvangen nieuwe inkomende e-mail en slaan deze op in uw mailbox. Wanneer dit gebeurt, ontvangt uw e-mailclient een melding en synchroniseert uw mailbox. Onze mail Exchange-servers kunnen uw e-mail doorsturen naar een of meer ontvangers (waaronder [webhooks](/faq#do-you-support-webhooks)), uw e-mail voor u opslaan in uw versleutelde IMAP-opslag bij ons, **of beide**!

> \[!TIP]
> Meer weten? Lees [hoe u e-maildoorsturing instelt](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hoe onze mailuitwisselingsservice werkt](/faq#how-does-your-email-forwarding-system-work) of bekijk [onze gidsen](/guides).

4. Achter de schermen werkt ons veilige e-mailopslagontwerp op twee manieren om uw mailboxen versleuteld en alleen voor u toegankelijk te houden:

* Wanneer wij nieuwe e-mail van een afzender voor u ontvangen, schrijven onze mailuitwisselingsservers e-mails naar een individuele, tijdelijke en gecodeerde mailbox voor u.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Wanneer u met uw e-mailclient verbinding maakt met onze IMAP-server, wordt uw wachtwoord in het geheugen gecodeerd en gebruikt om uw mailbox te lezen en te schrijven. Uw mailbox kan alleen met dit wachtwoord worden gelezen en geschreven. Houd er rekening mee dat, aangezien u de enige bent met dit wachtwoord, **alleen u** uw mailbox kunt lezen en schrijven wanneer u deze opent. De volgende keer dat uw e-mailclient probeert te pollen voor e-mail of synchronisaties, worden uw nieuwe berichten vanuit deze tijdelijke mailbox verzonden en opgeslagen in uw eigen mailboxbestand met het opgegeven wachtwoord. Houd er rekening mee dat deze tijdelijke mailbox daarna wordt opgeschoond en verwijderd, zodat alleen uw met een wachtwoord beveiligde mailbox de berichten bevat.

* **Als u verbonden bent met IMAP (bijvoorbeeld met een e-mailclient zoals Apple Mail of Betterbird), hoeven we niet naar tijdelijke schijfruimte te schrijven. Uw in-memory gecodeerde IMAP-wachtwoord wordt in plaats daarvan opgehaald en gebruikt. Wanneer een bericht bij u wordt afgeleverd, sturen we in realtime een WebSocket-verzoek naar alle IMAP-servers met de vraag of ze een actieve sessie voor u hebben (dit is het ophalen). Vervolgens geven we dat gecodeerde in-memory wachtwoord door. We hoeven dus niet naar een tijdelijke mailbox te schrijven, maar kunnen met uw gecodeerde wachtwoord naar uw daadwerkelijke gecodeerde mailbox schrijven.**

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

5. [Back-ups van uw versleutelde mailboxen](#backups) worden dagelijks gemaakt. U kunt ook op elk moment een nieuwe back-up aanvragen of de nieuwste back-up downloaden via <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen. Als u besluit over te stappen naar een andere e-mailservice, kunt u uw mailboxen en back-ups op elk moment eenvoudig migreren, downloaden, exporteren en verwijderen.

## Technologieën {#technologies}

### Databanken {#databases}

We hebben andere mogelijke databaseopslaglagen onderzocht, maar geen enkele voldeed zo goed aan onze eisen als SQLite:

| Databank | Encryptie-in-rust | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postvakken | Licentie | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :ster: | :white_check_mark: Ja met [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :wit_vinkje: | :white_check_mark: Publiek domein | :wit_vinkje: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relationele database | :x: AGPL en `SSPL-1.0` | :X: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relationele database | :wit_vinkje: __CELCODE_0__ | :X: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :wit_vinkje: __CELCODE_0__ | :X: |
| [PostgreSQL](https://www.postgresql.org/) | :wit_vinkje: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relationele database | :white_check_mark: `PostgreSQL` (vergelijkbaar met `BSD` of `MIT`) | :X: |
| [MariaDB](https://mariadb.com/) | :wit_vinkje: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relationele database | :white_check_mark: `GPLv2` en `BUSL-1.1` | :X: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relationele database | :x: `BUSL-1.1` en anderen | :X: |

> Hier is een [blogpost waarin verschillende SQLite-databaseopslagopties worden vergeleken](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) in de bovenstaande tabel.

### Beveiliging {#security}

We gebruiken te allen tijde [encryptie-in-rust](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [encryptie-in-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") met :tangerine: [Mandarijn](https://tangeri.ne) en [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) encryptie voor mailboxen. Daarnaast gebruiken we token-gebaseerde tweefactorauthenticatie (in tegenstelling tot sms, dat kwetsbaar is voor [man-in-the-middle-aanvallen](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), geroteerde SSH-sleutels met root-toegang uitgeschakeld, exclusieve toegang tot servers via beperkte IP-adressen, en meer.

In het geval van een [aanval van een kwaadaardige meid](https://en.wikipedia.org/wiki/Evil_maid_attack) of malafide medewerker van een externe leverancier, **kan uw mailbox nog steeds alleen worden geopend met uw gegenereerde wachtwoord**. Wees gerust, we vertrouwen niet op andere externe leveranciers dan onze SOC Type 2-serverproviders Cloudflare, DataPacket, Digital Ocean en Vultr.

Ons doel is om zo min mogelijk [enkelvoudig punt van falen](https://en.wikipedia.org/wiki/Single_point_of_failure) te hebben.

### Postvakken {#mailboxes}

> **tldr;** Onze IMAP-servers gebruiken individueel gecodeerde SQLite-databases voor elk van uw mailboxen.

[SQLite is een extreem populaire](https://www.sqlite.org/mostdeployed.html) ingesloten database – deze wordt momenteel uitgevoerd op uw telefoon en computer – [en wordt gebruikt door bijna alle belangrijke technologieën](https://www.sqlite.org/famous.html).

Op onze versleutelde servers is er bijvoorbeeld een SQLite-databasemailbox voor `linux@example.com`, `info@example.com`, `hello@example.com`, enzovoort – één voor elk als een databasebestand `.sqlite`. We geven de databasebestanden ook geen naam met het e-mailadres – in plaats daarvan gebruiken we een BSON ObjectID en unieke UUID's die niet aangeven van wie de mailbox is of onder welk e-mailadres deze staat (bijvoorbeeld `353a03f21e534321f5d6e267.sqlite`).

Elk van deze databases is zelf versleuteld met uw wachtwoord (dat alleen u kent) via [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Dit betekent dat uw mailboxen individueel versleuteld, autonoom ([in de zandbak](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) en draagbaar zijn.

We hebben SQLite verfijnd met de volgende [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Doel |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Zie `better-sqlite3-multiple-ciphers` onder [Projects](#projects) voor meer informatie. |
| `key="****************"` | Dit is uw gedecodeerde wachtwoord dat alleen in het geheugen staat en via de IMAP-verbinding van uw e-mailclient naar onze server wordt verzonden. Nieuwe database-instanties worden voor elke lees- en schrijfsessie aangemaakt en gesloten (om sandboxing en isolatie te garanderen). |
| `journal_model=WAL` | Schrijf-vooruit-logboek ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Voorkomt schrijfvergrendelingsfouten [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Verhoogt de duurzaamheid van transacties [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Zorgt ervoor dat verwijzingen naar externe sleutels (bijvoorbeeld een relatie van de ene tabel naar de andere) worden afgedwongen. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), maar voor validatie en gegevensintegriteit moet dit worden ingeschakeld. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) om te gebruiken om de geestelijke gezondheid van ontwikkelaars te waarborgen. |

> Alle andere standaardwaarden komen van SQLite zoals gespecificeerd in [officiële PRAGMA-documentatie](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Gelijktijdigheid {#concurrency}

> **tldr;** We gebruiken `WebSocket` voor gelijktijdige lees- en schrijfbewerkingen naar uw gecodeerde SQLite-mailboxen.

#### Leest {#reads}

Het is mogelijk dat uw e-mailclient op uw telefoon `imap.forwardemail.net` omzet in een van onze Digital Ocean IP-adressen. Het is ook mogelijk dat uw desktopclient een geheel ander IP-adres omzet in een ander [aanbieder](#providers).

Ongeacht met welke IMAP-server uw e-mailclient verbinding maakt, willen we dat de verbinding in realtime en met 100% nauwkeurigheid uit uw database wordt gelezen. Dit gebeurt via WebSockets.

#### Schrijft {#writes}

Schrijven naar uw database verloopt iets anders, omdat SQLite een ingebedde database is en uw mailbox standaard in één bestand staat.

We hebben opties zoals `litestream`, `rqlite` en `dqlite` hieronder onderzocht, maar geen van deze voldeed aan onze vereisten.

Om schrijfbewerkingen uit te voeren met write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") ingeschakeld, moeten we ervoor zorgen dat slechts één server ("Primair") hiervoor verantwoordelijk is. [WAL](https://www.sqlite.org/wal.html) versnelt de gelijktijdigheid aanzienlijk en staat één schrijver en meerdere lezers toe.

De primaire server draait op de dataservers met de gekoppelde volumes die de versleutelde mailboxen bevatten. Vanuit distributieperspectief kunt u alle individuele IMAP-servers achter `imap.forwardemail.net` als secundaire servers ("Secondary") beschouwen.

We realiseren tweerichtingscommunicatie met [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primaire servers gebruiken een instance van de `WebSocketServer`-server van [ws](https://github.com/websockets/ws).
* Secundaire servers gebruiken een instance van de `WebSocket`-client van [ws](https://github.com/websockets/ws), die is ingepakt met [websocket-zoals-beloofd](https://github.com/vitalets/websocket-as-promised) en [opnieuw verbinden-websocket](https://github.com/opensumi/reconnecting-websocket). Deze twee wrappers zorgen ervoor dat de `WebSocket` opnieuw verbinding maakt en gegevens kan verzenden en ontvangen voor specifieke databaseschrijfbewerkingen.

### Back-ups {#backups}

**tldr;** Er worden dagelijks back-ups gemaakt van uw versleutelde mailboxen. U kunt ook direct een nieuwe back-up aanvragen of de nieuwste back-up downloaden via <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mijn Account <i class="fa fa-angle-right"></i> Domeinen</a> <i class="fa fa-angle-right"></i> Aliassen.

Voor back-ups voeren we dagelijks de SQLite-opdracht `VACUUM INTO` uit tijdens de verwerking van IMAP-opdrachten. Hierbij wordt uw gecodeerde wachtwoord van een IMAP-verbinding in het geheugen gebruikt. Back-ups worden opgeslagen als er geen bestaande back-up wordt gedetecteerd of als de hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) in het bestand is gewijzigd ten opzichte van de meest recente back-up.

Merk op dat we de opdracht `VACUUM INTO` gebruiken in plaats van de ingebouwde opdracht `backup`, omdat een pagina die tijdens een `backup`-opdracht wordt gewijzigd, opnieuw moet worden gestart. De opdracht `VACUUM INTO` maakt een momentopname. Zie deze opmerkingen over [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) en [Hacker Nieuws](https://news.ycombinator.com/item?id=31387556) voor meer informatie.

Bovendien gebruiken we `VACUUM INTO` in plaats van `backup`, omdat de opdracht `backup` de database voor een korte periode onversleuteld zou laten, totdat `rekey` wordt aangeroepen (zie deze GitHub [opmerking](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) voor meer informatie).

De secundaire server zal de primaire server via de `WebSocket`-verbinding instrueren om de back-up uit te voeren. De primaire server zal vervolgens de opdracht ontvangen om dit te doen en zal vervolgens:

1. Maak verbinding met je versleutelde mailbox.
2. Zorg voor een schrijfbeveiliging.
3. Voer een WAL-controlepunt uit via `wal_checkpoint(PASSIVE)`.
4. Voer de SQLite-opdracht `VACUUM INTO` uit.
5. Zorg ervoor dat het gekopieerde bestand kan worden geopend met het versleutelde wachtwoord (safeguard/dummyproofing).
6. Upload het naar Cloudflare R2 voor opslag (of je eigen provider indien opgegeven).

<!--
7. Comprimeer het resulterende back-upbestand met `gzip`.
8. Upload het naar Cloudflare R2 voor opslag (of uw eigen provider indien opgegeven).
-->

Houd er rekening mee dat uw mailboxen versleuteld zijn. Hoewel we IP-beperkingen en andere authenticatiemaatregelen hanteren voor WebSocket-communicatie, kunt u er in het geval van een kwaadwillende partij gerust op zijn dat de WebSocket-payload uw IMAP-wachtwoord niet kan openen.

Op dit moment wordt er slechts één back-up per mailbox opgeslagen, maar in de toekomst bieden we mogelijk point-in-time-herstel ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)") aan.

### Zoeken {#search}

Onze IMAP-servers ondersteunen de opdracht `SEARCH` met complexe query's, reguliere expressies en meer.

Snelle zoekprestaties zijn te danken aan [FTS5](https://www.sqlite.org/fts5.html) en [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

We slaan `Date`-waarden op in de SQLite-mailboxen als [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strings via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (met UTC-tijdzone zodat gelijkheidsvergelijkingen correct functioneren).

Er worden ook indexen opgeslagen voor alle objecten die in zoekopdrachten voorkomen.

### Projecten {#projects}

Hieronder vindt u een tabel met een overzicht van de projecten die we gebruiken in onze broncode en ons ontwikkelingsproces (in alfabetische volgorde):

| Project | Doel |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps-automatiseringsplatform voor het eenvoudig onderhouden, schalen en beheren van ons volledige serverpark. |
| [Bree](https://github.com/breejs/bree) | Taakplanner voor Node.js en JavaScript met cron, dates, ms, later en mensvriendelijke ondersteuning. |
| [Cabin](https://github.com/cabinjs/cabin) | Ontwikkelaarsvriendelijke JavaScript- en Node.js-logbibliotheek met beveiliging en privacy in gedachten. |
| [Lad](https://github.com/ladjs/lad) | Het Node.js-framework dat onze volledige architectuur en technisch ontwerp aanstuurt met MVC en meer. |
| [MongoDB](https://www.mongodb.com/) | NoSQL-databaseoplossing die we gebruiken voor het opslaan van alle overige gegevens buiten postvakken (bijvoorbeeld uw account, instellingen, domeinen en aliasconfiguraties). |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB object document modeling ("ODM"), dat we in onze hele stack gebruiken. We hebben speciale helpers geschreven waarmee we **Mongoose met SQLite** gewoon kunnen blijven gebruiken :tada: |
| [Node.js](https://nodejs.org/en) | Node.js is de open-source, platformonafhankelijke JavaScript-runtimeomgeving die al onze serverprocessen uitvoert. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js-pakket voor het verzenden van e-mails, het maken van verbindingen en meer. Wij zijn een officiële sponsor van dit project. |
| [Redis](https://redis.io/) | In-memory database voor caching, publicatie-/abonnementskanalen en DNS via HTTPS-verzoeken. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Encryptie-uitbreiding voor SQLite waarmee volledige databasebestanden kunnen worden gecodeerd (inclusief de write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journaal, rollback, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visuele SQLite-editor (die u ook kunt gebruiken) om ontwikkelingsmailboxen te testen, downloaden en bekijken. |
| [SQLite](https://www.sqlite.org/about.html) | Ingebouwde databaselaag voor schaalbare, zelfstandige, snelle en veerkrachtige IMAP-opslag. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js anti-spam, e-mailfilter en phishingpreventietool (ons alternatief voor [Spam Assassin](https://spamassassin.apache.org/) en [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | DNS over HTTPS-verzoeken met Node.js en caching met Redis – wat wereldwijde consistentie garandeert en nog veel meer. |
| [Betterbird](https://betterbird.eu/) | Ons ontwikkelteam gebruikt dit (en raadt dit ook aan) als **de voorkeurs-e-mailclient voor gebruik met Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Ons ontwikkelteam gebruikt deze virtuele machines voor iOS en macOS om verschillende e-mailclients (parallel) te testen met onze IMAP- en SMTP-servers. |
| [Ubuntu](https://ubuntu.com/download/server) | Modern open-source Linux-gebaseerd serverbesturingssysteem dat onze gehele infrastructuur aandrijft. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP-serverbibliotheek – zie de opmerkingen over [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) en [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Snelle en eenvoudige API-bibliotheek voor Node.js om programmatisch te communiceren met SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Ontwikkelaarsvriendelijk e-mailframework waarmee u aangepaste e-mails kunt maken, bekijken en versturen (bijvoorbeeld accountmeldingen en meer). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL-querybuilder met Mongo-stijl syntaxis. Dit bespaart ons ontwikkelteam tijd, omdat we in Mongo-stijl kunnen blijven schrijven over de gehele stack met een database-agnostische aanpak. **Het helpt ook om SQL-injectieaanvallen te voorkomen door queryparameters te gebruiken.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL-hulpprogramma om informatie over bestaande databaseschema's te extraheren. Dit stelt ons in staat om eenvoudig te valideren dat alle indices, tabellen, kolommen, beperkingen en meer geldig zijn en de juiste `1:1` hebben. We hebben zelfs geautomatiseerde hulpmiddelen geschreven om nieuwe kolommen en indexen toe te voegen als er wijzigingen in databaseschema's worden aangebracht (met daarnaast zeer gedetailleerde foutmeldingen). |
| [knex](https://github.com/knex/knex) | SQL query builder die we alleen gebruiken voor databasemigraties en schemavalidatie via `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatische vertaling van [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)-zinnen met ondersteuning voor Markdown met behulp van [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js-pakket voor het oplossen en tot stand brengen van verbindingen met MX-servers en het verwerken van fouten. |
| [pm2](https://github.com/Unitech/pm2) | Node.js-productieprocesmanager met ingebouwde load balancer ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) voor prestaties). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP-serverbibliotheek – deze gebruiken we voor onze e-mailuitwisseling ("MX") en uitgaande SMTP-servers. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Handige tool voor het testen van IMAP-servers aan de hand van benchmarks en de compatibiliteit van het IMAP-protocol met de RFC-specificatie. Dit project is ontwikkeld door het [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) team (een actieve open-source IMAP- en POP3-server sinds juli 2002). We hebben onze IMAP-server uitgebreid getest met deze tool. |

> Andere projecten die wij gebruiken, vindt u in [onze broncode op GitHub](https://github.com/forwardemail).

### Aanbieders {#providers}

| Aanbieder | Doel |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-provider, gezondheidscontroles, load balancers en back-upopslag met behulp van [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedicated serverhosting en beheerde databases. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hosting van speciale servers. |
| [DataPacket](https://www.datapacket.com) | Hosting van speciale servers. |

## Gedachten {#thoughts}

### Principes {#principles}

Forward Email is ontworpen volgens de volgende principes:

1. Wees altijd ontwikkelaarsvriendelijk, gericht op beveiliging en privacy, en transparant.
2. Houd je aan de richtlijnen van [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twaalf Factor](https://12factor.net/), [Het scheermes van Ockham](https://en.wikipedia.org/wiki/Occam%27s_razor) en [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Richt je op de scrappy, bootstrapped en [ramen-winstgevend](http://www.paulgraham.com/ramenprofitable.html) ontwikkelaar.

### Experimenten {#experiments}

> **tldr;** Uiteindelijk zijn S3-compatibele object storage en/of virtuele tabellen technisch niet haalbaar vanwege de prestaties en zijn ze foutgevoelig vanwege geheugenbeperkingen.

We hebben een aantal experimenten uitgevoerd ter voorbereiding op onze uiteindelijke SQLite-oplossing, zoals hierboven besproken.

Eén daarvan was om te proberen [rclone]() en SQLite te gebruiken in combinatie met een S3-compatibele opslaglaag.

Dankzij dit experiment kregen we meer inzicht in en ontdekten we grensgevallen rondom het gebruik van rclone, SQLite en [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Als u de vlag `--vfs-cache-mode writes` inschakelt met rclone, zijn leesbewerkingen in orde, maar worden schrijfbewerkingen gecached.
* Als u meerdere IMAP-servers wereldwijd hebt, is de cache over deze servers verdeeld, tenzij u één schrijver en meerdere luisteraars hebt (bijvoorbeeld een pub/sub-aanpak).
* Dit is ongelooflijk complex en het toevoegen van extra complexiteit zoals deze zal resulteren in meer single points of failure.
* S3-compatibele opslagproviders ondersteunen geen gedeeltelijke bestandswijzigingen – wat betekent dat elke wijziging van het bestand `.sqlite` resulteert in een volledige wijziging en herupload van de database.
* Er bestaan andere oplossingen zoals `rsync`, maar deze zijn niet gericht op ondersteuning voor write-ahead-logs ("[WAL](https://www.sqlite.org/wal.html)") – daarom hebben we uiteindelijk Litestream beoordeeld. Gelukkig versleutelt ons encryptiegebruik de [WAL](https://www.sqlite.org/wal.html)-bestanden al voor ons, dus hoeven we daarvoor niet op Litestream te vertrouwen. We hadden echter nog geen vertrouwen in Litestream voor productiegebruik en hebben hieronder een paar opmerkingen daarover.
* Met deze optie van `--vfs-cache-mode writes` (de *enige* manier om SQLite over `rclone` te gebruiken voor schrijfbewerkingen) wordt geprobeerd de hele database helemaal opnieuw in het geheugen te kopiëren. Het verwerken van één mailbox van 10 GB is prima, maar het verwerken van meerdere mailboxen met extreem veel opslagruimte zal ervoor zorgen dat de IMAP-servers geheugenbeperkingen en `ENOMEM`-fouten, segmentatiefouten en gegevenscorruptie tegenkomen. * Als u probeert SQLite [Virtuele tafels](https://www.sqlite.org/vtab.html) (bijvoorbeeld [s3db](https://github.com/jrhy/s3db)) te gebruiken om gegevens live op een S3-compatibele opslaglaag te zetten, zult u nog een aantal problemen tegenkomen:
* Lezen en schrijven zal extreem traag zijn, omdat S3 API-eindpunten moeten worden aangestuurd met de HTTP-methoden `.sqlite`0, `.sqlite`1, `.sqlite`2 en `.sqlite`3.
* Ontwikkelingstests toonden aan dat het overschrijden van 500.000-1.000+ records op glasvezelinternet nog steeds wordt beperkt door de doorvoersnelheid van schrijven en lezen naar S3-compatibele providers. Onze ontwikkelaars hebben bijvoorbeeld `.sqlite`4-lussen uitgevoerd om zowel sequentiële SQL `.sqlite`5-statements als statements die grote hoeveelheden gegevens in bulk wegschreven, uit te voeren. In beide gevallen was de prestatie verbluffend traag. * Virtuele tabellen **kunnen geen indexen hebben**, `.sqlite`6 statements en `.sqlite`7 `.sqlite`8 statements – wat leidt tot vertragingen van meer dan 1-2 minuten of meer, afhankelijk van de hoeveelheid data.
* Objecten werden ongecodeerd opgeslagen en er is geen native encryptie-ondersteuning direct beschikbaar.
* We hebben ook `.sqlite`9 onderzocht, wat conceptueel en technisch vergelijkbaar is met het vorige punt (dus dezelfde problemen heeft). Een mogelijkheid zou zijn om een aangepaste `rsync`0 build te gebruiken die is ingepakt met encryptie, zoals `rsync`1 (die we momenteel gebruiken in onze bovenstaande oplossing) via `rsync`2.
* Een andere mogelijke aanpak was om `rsync`3 te gebruiken, maar dit heeft een limiet van 32 GB en zou complexe bouw- en ontwikkelproblemen met zich meebrengen. * `rsync`4 statements zijn vereist (dus dit sluit het gebruik van virtuele tabellen volledig uit). We hebben `rsync`5 statements nodig om onze hook met `rsync`6 correct te laten werken – dit zorgt ervoor dat gegevens niet beschadigd raken en dat opgehaalde rijen kunnen worden omgezet naar geldige documenten volgens onze `rsync`7 schemadefinities (inclusief beperking, variabeletype en willekeurige gegevensvalidatie).
* Bijna alle S3-compatibele projecten met betrekking tot SQLite in de open-sourcecommunity zijn in Python (en niet in JavaScript, dat we voor 100% van onze stack gebruiken).
* Compressiebibliotheken zoals `rsync`8 (zie `rsync`9) zien er veelbelovend uit, maar __PROTECTED_LINK_189__0. In plaats daarvan zal applicatie-side compressie op gegevenstypen zoals __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 en __PROTECTED_LINK_189__6 een schonere en eenvoudigere aanpak zijn (en ook gemakkelijker te migreren, omdat we een __PROTECTED_LINK_189__7-vlag of -kolom kunnen opslaan – of zelfs __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 voor compressie of __PROTECTED_LINK_190__0 voor geen compressie als databasemetadata kunnen gebruiken).
* Gelukkig hebben we al deduplicatie van bijlagen geïmplementeerd in onze IMAP-serveropslag – daarom wordt er voor elk bericht met dezelfde bijlage geen kopie van de bijlage bewaard – in plaats daarvan wordt er één bijlage opgeslagen voor meerdere berichten en threads in een mailbox (en wordt er vervolgens een externe referentie gebruikt).
* Het project Litestream, een SQLite-replicatie- en back-upoplossing, is veelbelovend en we zullen het waarschijnlijk in de toekomst gebruiken.
* Om de auteur(s) niet in diskrediet te brengen – we zijn al meer dan tien jaar fan van hun werk en bijdragen aan open source – maar uit praktijkgebruik blijkt dat er __PROTECTED_LINK_190__1 en __PROTECTED_LINK_190__2 zijn.
* Back-upherstel moet probleemloos en triviaal zijn. Het gebruik van een oplossing zoals MongoDB met __PROTECTED_LINK_190__3 en __PROTECTED_LINK_190__4 is niet alleen omslachtig, maar ook tijdrovend en complex qua configuratie.
* SQLite-databases maken het eenvoudig (het is één enkel bestand).
* We wilden een oplossing ontwerpen waarmee gebruikers hun mailbox op elk moment kunnen openen en sluiten.
* Eenvoudige Node.js-opdrachten naar __PROTECTED_LINK_190__5 en het wordt permanent van de schijf verwijderd.
* We kunnen op dezelfde manier een S3-compatibele API met HTTP __PROTECTED_LINK_190__6 gebruiken om eenvoudig snapshots en back-ups voor gebruikers te verwijderen.
* SQLite was de eenvoudigste, snelste en meest kosteneffectieve oplossing.

### Gebrek aan alternatieven {#lack-of-alternatives}

Voor zover wij weten, zijn er geen andere e-maildiensten die op deze manier zijn ontworpen en die ook niet open source zijn.

Wij *denken dat dit komt* doordat bestaande e-mailservices nog steeds oude technologie in productie hebben met [spaghetticode](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De meeste, zo niet alle, bestaande e-mail serviceproviders zijn gesloten-source of adverteren als open-source, **maar in werkelijkheid is alleen hun front-end open-source.**

**Het meest gevoelige deel van e-mail** (de daadwerkelijke interactie tussen opslag/IMAP/SMTP) **vindt allemaal plaats aan de back-end (server), en *niet* aan de front-end (client)**.

### Probeer Forward Email {#try-out-forward-email}

Meld je vandaag nog aan op <https://forwardemail.net>! :rocket: