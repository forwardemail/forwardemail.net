# Kvantsäkert e-post: Hur vi använder krypterade SQLite-postlådor för att hålla din e-post säker {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Jämförelse av e-postleverantörer](#email-service-provider-comparison)
* [Hur fungerar det](#how-does-it-work)
* [Teknologier](#technologies)
  * [Databaser](#databases)
  * [Säkerhet](#security)
  * [Postlådor](#mailboxes)
  * [Parallellitet](#concurrency)
  * [Säkerhetskopior](#backups)
  * [Sökning](#search)
  * [Projekt](#projects)
  * [Leverantörer](#providers)
* [Tankar](#thoughts)
  * [Principer](#principles)
  * [Experiment](#experiments)
  * [Brist på alternativ](#lack-of-alternatives)
  * [Testa Forward Email](#try-out-forward-email)


## Förord {#foreword}

> \[!IMPORTANT]
> Vår e-posttjänst är [100% öppen källkod](https://github.com/forwardemail) och integritetsfokuserad genom säkra och krypterade SQLite-postlådor.

Tills vi lanserade [IMAP-stöd](/faq#do-you-support-receiving-email-with-imap) använde vi MongoDB för våra behov av persistent datalagring.

Denna teknik är fantastisk och vi använder den fortfarande idag – men för att ha kryptering vid vila med MongoDB måste du använda en leverantör som erbjuder MongoDB Enterprise, såsom Digital Ocean eller Mongo Atlas – eller betala för en företagslicens (och därefter hantera försäljningsteamets svarstider).

Vårt team på [Forward Email](https://forwardemail.net) behövde en utvecklarvänlig, skalbar, pålitlig och krypterad lagringslösning för IMAP-postlådor. Som öppen källkodsutvecklare gick det emot [våra principer](#principles) att använda en teknik där du måste betala en licensavgift för att få kryptering vid vila – så vi experimenterade, forskade och utvecklade en ny lösning från grunden för att lösa dessa behov.

Istället för att använda en delad databas för att lagra dina postlådor lagrar och krypterar vi varje postlåda individuellt med ditt lösenord (som bara du har). **Vår e-posttjänst är så säker att om du glömmer ditt lösenord förlorar du din postlåda** (och måste återställa med offline-säkerhetskopior eller börja om från början).

Fortsätt läsa när vi går på djupet nedan med en [jämförelse av e-postleverantörer](#email-service-provider-comparison), [hur vår tjänst fungerar](#how-does-it-work), [vår teknologistack](#technologies) och mer.


## Jämförelse av e-postleverantörer {#email-service-provider-comparison}

Vi är den enda 100% öppna källkods- och integritetsfokuserade e-postleverantören som lagrar individuellt krypterade SQLite-postlådor, erbjuder obegränsade domäner, alias och användare, samt har stöd för utgående SMTP, IMAP och POP3:

**Till skillnad från andra e-postleverantörer behöver du inte betala för lagring per domän eller alias med Forward Email.** Lagringen delas över hela ditt konto – så om du har flera egna domännamn och flera alias på varje är vi den perfekta lösningen för dig. Observera att du fortfarande kan införa lagringsgränser om så önskas per domän eller alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Läs Jämförelse av E-posttjänster <i class="fa fa-search-plus"></i></a>


## Hur fungerar det {#how-does-it-work}

1. Med din e-postklient som Apple Mail, Thunderbird, Gmail eller Outlook – ansluter du till våra säkra [IMAP](/faq#do-you-support-receiving-email-with-imap)-servrar med ditt användarnamn och lösenord:

   * Ditt användarnamn är ditt fullständiga alias med din domän, till exempel `hello@example.com`.
   * Ditt lösenord genereras slumpmässigt och visas endast för dig i 30 sekunder när du klickar på <strong class="text-success"><i class="fa fa-key"></i> Generera Lösenord</strong> från <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt Konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias.
2. När du är ansluten kommer din e-postklient att skicka [IMAP-protokollkommandon](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) till vår IMAP-server för att hålla din brevlåda synkroniserad. Detta inkluderar att skriva och lagra utkast till e-post och andra åtgärder du kan göra (t.ex. märka ett e-postmeddelande som Viktigt eller flagga ett e-postmeddelande som Skräppost/Spam).

3. E-postutbytesservrar (vanligtvis kallade "MX"-servrar) tar emot ny inkommande e-post och lagrar den i din brevlåda. När detta händer får din e-postklient en avisering och synkroniserar din brevlåda. Våra e-postutbytesservrar kan vidarebefordra din e-post till en eller flera mottagare (inklusive [webhooks](/faq#do-you-support-webhooks)), lagra din e-post åt dig i din krypterade IMAP-lagring hos oss, **eller båda!**

   > \[!TIP]
   > Intresserad av att lära dig mer? Läs [hur du ställer in e-postvidarebefordran](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hur vår e-postutbyteservice fungerar](/faq#how-does-your-email-forwarding-system-work), eller se [våra guider](/guides).

4. Bakom kulisserna fungerar vår säkra e-postlagringsdesign på två sätt för att hålla dina brevlådor krypterade och endast tillgängliga för dig:

   * När ny e-post tas emot för dig från en avsändare skriver våra e-postutbytesservrar till en individuell, temporär och krypterad brevlåda för dig.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inkommande meddelande mottaget för din alias (t.ex. du@dindomän.com).
         MX->>SQLite: Meddelandet lagras i en temporär brevlåda.
         Note over MX,SQLite: Vidarebefordrar till andra mottagare och konfigurerade webhooks.
         MX->>Sender: Framgång!
     ```

   * När du ansluter till vår IMAP-server med din e-postklient krypteras ditt lösenord i minnet och används för att läsa och skriva till din brevlåda. Din brevlåda kan endast läsas från och skrivas till med detta lösenord. Tänk på att eftersom du är den enda med detta lösenord, kan **endast du** läsa och skriva till din brevlåda när du använder den. Nästa gång din e-postklient försöker hämta e-post eller synkroniserar, kommer dina nya meddelanden att överföras från denna temporära brevlåda och lagras i din faktiska brevlådefil med hjälp av ditt angivna lösenord. Observera att denna temporära brevlåda rensas och tas bort efteråt så att endast din lösenordsskyddade brevlåda har meddelandena.

   * **Om du är ansluten till IMAP (t.ex. med en e-postklient som Apple Mail eller Thunderbird) behöver vi inte skriva till temporär disklagring. Ditt krypterade IMAP-lösenord i minnet hämtas och används istället. I realtid, när ett meddelande försöker levereras till dig, skickar vi en WebSocket-förfrågan till alla IMAP-servrar och frågar om de har en aktiv session för dig (detta är hämtningen), och vidarebefordrar sedan det krypterade lösenordet i minnet – så vi behöver inte skriva till en temporär brevlåda, vi kan skriva till din faktiska krypterade brevlåda med ditt krypterade lösenord.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Du ansluter till IMAP-servern med en e-postklient.
         IMAP->>SQLite: Överför meddelande från temporär brevlåda till din alias brevlåda.
         Note over IMAP,SQLite: Din alias brevlåda är endast tillgänglig i minnet med IMAP-lösenordet.
         SQLite->>IMAP: Hämtar meddelanden enligt e-postklientens begäran.
         IMAP->>You: Framgång!
     ```

5. [Säkerhetskopior av dina krypterade brevlådor](#backups) görs dagligen. Du kan också när som helst begära en ny säkerhetskopia eller ladda ner den senaste säkerhetskopian från <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser. Om du bestämmer dig för att byta till en annan e-posttjänst kan du enkelt migrera, ladda ner, exportera och rensa dina brevlådor och säkerhetskopior när som helst.


## Teknologier {#technologies}

### Databaser {#databases}

Vi undersökte andra möjliga databasskikt, men ingen uppfyllde våra krav lika bra som SQLite gjorde:
| Database                                               |                                                                    Encryption-at-rest                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Mailboxes  |                           License                           | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ja med [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Endast tillgängligt i MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relationsdatabas                               |                   :x: AGPL och `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Endast nätverk](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relationsdatabas                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Otestad och ännu inte stödd?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Otestad och ännu inte stödd?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ja](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relationsdatabas                               | :white_check_mark: `PostgreSQL` (liknande `BSD` eller `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Endast för InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relationsdatabas                               |          :white_check_mark: `GPLv2` och `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Endast Enterprise-funktion](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relationsdatabas                               |                  :x: `BUSL-1.1` och andra                  |                             :x:                             |

> Här är ett [blogginlägg som jämför flera SQLite-databaslagringsalternativ](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) i tabellen ovan.

### Security {#security}

Vi använder alltid [encryption-at-rest](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [encryption-in-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") med :tangerine: [Tangerine](https://tangeri.ne), och [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) kryptering på brevlådor. Dessutom använder vi token-baserad tvåfaktorsautentisering (till skillnad från SMS som är sårbart för [man-in-the-middle-attacker](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), roterade SSH-nycklar med rootåtkomst avstängd, exklusiv åtkomst till servrar via begränsade IP-adresser, och mer.
Vid en [evil maid-attack](https://en.wikipedia.org/wiki/Evil_maid_attack) eller illasinnad anställd från en tredjepartsleverantör kan **din brevlåda fortfarande endast öppnas med ditt genererade lösenord**. Var säker på att vi inte förlitar oss på några tredjepartsleverantörer förutom våra SOC Type 2-kompatibla serverleverantörer Cloudflare, DataPacket, Digital Ocean, GitHub och Vultr.

Vårt mål är att ha så få [single point of failures](https://en.wikipedia.org/wiki/Single_point_of_failure) som möjligt.

### Brevlådor {#mailboxes}

> **tldr;** Våra IMAP-servrar använder individuellt krypterade SQLite-databaser för var och en av dina brevlådor.

[SQLite är en extremt populär](https://www.sqlite.org/mostdeployed.html) inbäddad databas – den körs för närvarande på din telefon och dator – [och används av nästan alla stora teknologier](https://www.sqlite.org/famous.html).

Till exempel finns det på våra krypterade servrar en SQLite-databasbrevlåda för `linux@example.com`, `info@example.com`, `hello@example.com` och så vidare – en för varje som en `.sqlite` databasfil. Vi namnger inte heller databasfilerna med e-postadressen – istället använder vi BSON ObjectID och unika UUID:er som genereras och som inte avslöjar vem brevlådan tillhör eller vilken e-postadress den är kopplad till (t.ex. `353a03f21e534321f5d6e267.sqlite`).

Var och en av dessa databaser är själva krypterade med ditt lösenord (som bara du har) med hjälp av [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Detta innebär att dina brevlådor är individuellt krypterade, självständiga, [sandboxade](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) och portabla.

Vi har finjusterat SQLite med följande [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Syfte                                                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite databas-kryptering](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Se `better-sqlite3-multiple-ciphers` under [Projects](#projects) för mer insikt.                                           |
| `key="****************"` | Detta är ditt dekrypterade lösenord som endast finns i minnet och som skickas via din e-postklients IMAP-anslutning till vår server. Nya databasinstanser skapas och stängs för varje läs- och skrivsession (för att säkerställa sandboxing och isolering). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [som förbättrar prestanda och tillåter samtidig läsning](https://litestream.io/tips/#wal-journal-mode).                                                                                       |
| `busy_timeout=5000`      | Förhindrar skrivlås-fel [medan andra skrivningar pågår](https://litestream.io/tips/#busy-timeout).                                                                                                                                                       |
| `synchronous=NORMAL`     | Ökar hållbarheten för transaktioner [utan risk för datakorruption](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                      |
| `foreign_keys=ON`        | Säkerställer att referenser till främmande nycklar (t.ex. en relation från en tabell till en annan) upprätthålls. [Som standard är detta inte aktiverat i SQLite](https://www.sqlite.org/foreignkeys.html), men för validering och dataintegritet bör det vara påslaget. |
| `encoding='UTF-8'`       | [Standardkodning](https://www.sqlite.org/pragma.html#pragma_encoding) som används för att säkerställa utvecklarens sinnesro.                                                                                                                              |
> Alla andra standardinställningar kommer från SQLite enligt [officiell PRAGMA-dokumentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samtidighet {#concurrency}

> **tldr;** Vi använder `WebSocket` för samtidiga läsningar och skrivningar till dina krypterade SQLite-postlådor.

#### Läsningar {#reads}

Din e-postklient på din telefon kan lösa `imap.forwardemail.net` till en av våra Digital Ocean IP-adresser – och din skrivbordsklient kan lösa en separat IP från en annan [leverantör](#providers) helt och hållet.

Oavsett vilken IMAP-server din e-postklient ansluter till vill vi att anslutningen ska läsa från din databas i realtid med 100 % noggrannhet. Detta görs via WebSockets.

#### Skrivningar {#writes}

Att skriva till din databas är lite annorlunda – eftersom SQLite är en inbäddad databas och din postlåda som standard finns i en enda fil.

Vi hade utforskat alternativ som `litestream`, `rqlite` och `dqlite` nedan – men inget av dessa uppfyllde våra krav.

För att utföra skrivningar med write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") aktiverat – måste vi säkerställa att endast en server ("Primär") är ansvarig för detta. [WAL](https://www.sqlite.org/wal.html) påskyndar samtidighet avsevärt och tillåter en skrivare och flera läsare.

Den Primära körs på dataservrarna med monterade volymer som innehåller de krypterade postlådorna. Ur ett distributionsperspektiv kan du betrakta alla individuella IMAP-servrar bakom `imap.forwardemail.net` som sekundära servrar ("Sekundär").

Vi uppnår tvåvägskommunikation med [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primära servrar använder en instans av [ws](https://github.com/websockets/ws)'s `WebSocketServer` server.
* Sekundära servrar använder en instans av [ws](https://github.com/websockets/ws)'s `WebSocket` klient som är inlindad med [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) och [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Dessa två wrappers säkerställer att `WebSocket` återansluter och kan skicka och ta emot data för specifika databas-skrivningar.

### Säkerhetskopior {#backups}

> **tldr;** Säkerhetskopior av dina krypterade postlådor görs dagligen. Du kan också omedelbart begära en ny säkerhetskopia eller ladda ner den senaste säkerhetskopian när som helst från <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Aliaser.

För säkerhetskopior kör vi helt enkelt SQLite-kommandot `VACUUM INTO` varje dag under IMAP-kommandobehandling, vilket utnyttjar ditt krypterade lösenord från en IMAP-anslutning i minnet. Säkerhetskopior sparas om ingen befintlig säkerhetskopia upptäcks eller om [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hashen har ändrats på filen jämfört med den senaste säkerhetskopian.

Observera att vi använder kommandot `VACUUM INTO` istället för det inbyggda `backup`-kommandot eftersom om en sida ändras under en `backup`-kommandooperation måste den börja om. Kommandot `VACUUM INTO` tar en ögonblicksbild. Se dessa kommentarer på [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) och [Hacker News](https://news.ycombinator.com/item?id=31387556) för mer insikt.

Dessutom använder vi `VACUUM INTO` istället för `backup`, eftersom `backup`-kommandot skulle lämna databasen okrypterad under en kort period tills `rekey` anropas (se denna GitHub [kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) för insikt).

Den Sekundära kommer att instruera den Primära över `WebSocket`-anslutningen att utföra säkerhetskopian – och den Primära kommer sedan att ta emot kommandot att göra detta och därefter:

1. Ansluta till din krypterade postlåda.
2. Skaffa en skrivlås.
3. Köra en WAL-checkpoint via `wal_checkpoint(PASSIVE)`.
4. Köra SQLite-kommandot `VACUUM INTO`.
5. Säkerställa att den kopierade filen kan öppnas med det krypterade lösenordet (säkerhetsåtgärd/felsäkerhet).
6. Ladda upp den till Cloudflare R2 för lagring (eller din egen leverantör om specificerad).
<!--
7. Komprimera den resulterande säkerhetskopieringsfilen med `gzip`.
8. Ladda upp den till Cloudflare R2 för lagring (eller din egen leverantör om angivet).
-->

Kom ihåg att dina brevlådor är krypterade – och även om vi har IP-begränsningar och andra autentiseringsåtgärder på plats för WebSocket-kommunikation – kan du vara säker på att om en illasinnad aktör skulle agera, så kan den inte öppna din databas om inte WebSocket-payloaden innehåller ditt IMAP-lösenord.

Endast en säkerhetskopia lagras per brevlåda för tillfället, men i framtiden kan vi erbjuda punkt-i-tid-återställning ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Sök {#search}

Våra IMAP-servrar stödjer `SEARCH`-kommandot med komplexa sökfrågor, reguljära uttryck och mer.

Snabb sökprestanda tack vare [FTS5](https://www.sqlite.org/fts5.html) och [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Vi lagrar `Date`-värden i SQLite-brevlådorna som [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strängar via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (med UTC-tidszon för att likhetsjämförelser ska fungera korrekt).

Index lagras också för alla egenskaper som ingår i sökfrågor.

### Projekt {#projects}

Här är en tabell som beskriver projekt vi använder i vår källkod och utvecklingsprocess (sorterade alfabetiskt):

| Projekt                                                                                       | Syfte                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | DevOps-automationsplattform för att underhålla, skala och hantera hela vår serverflotta med lätthet.                                                                                                                                                                                                                                                               |
| [Bree](https://github.com/breejs/bree)                                                        | Jobbschemaläggare för Node.js och JavaScript med stöd för cron, datum, ms, later och användarvänligt stöd.                                                                                                                                                                                                                                                          |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Utvecklarvänligt JavaScript- och Node.js-loggningsbibliotek med säkerhet och integritet i åtanke.                                                                                                                                                                                                                                                                   |
| [Lad](https://github.com/ladjs/lad)                                                           | Node.js-ramverk som driver hela vår arkitektur och ingenjörsdesign med MVC och mer.                                                                                                                                                                                                                                                                                 |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL-databaslösning som vi använder för att lagra all annan data utanför brevlådor (t.ex. ditt konto, inställningar, domäner och alias-konfigurationer).                                                                                                                                                                                                          |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB-objektdokumentmodellering ("ODM") som vi använder i hela vår stack. Vi skrev speciella hjälpare som gör att vi enkelt kan fortsätta använda **Mongoose med SQLite** :tada:                                                                                                                                                                                  |
| [Node.js](https://nodejs.org/en)                                                              | Node.js är den öppen källkods-, plattformsoberoende JavaScript-körtidsmiljön som kör alla våra serverprocesser.                                                                                                                                                                                                                                                    |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Node.js-paket för att skicka e-post, skapa anslutningar och mer. Vi är en officiell sponsor av detta projekt.                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                    | Minnesdatabas för caching, publicera/prenumerera-kanaler och DNS över HTTPS-förfrågningar.                                                                                                                                                                                                                                                                         |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Krypteringstillägg för SQLite som tillåter hela databaser att krypteras (inklusive write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                                             |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Visuell SQLite-editor (som du också kan använda) för att testa, ladda ner och visa utvecklingsbrevlådor.                                                                                                                                                                                                                                                           |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Inbäddat databasskikt för skalbar, självständig, snabb och robust IMAP-lagring.                                                                                                                                                                                                                                                                                      |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js-verktyg för anti-spam, e-postfiltrering och phishing-förebyggande (vårt alternativ till [Spam Assassin](https://spamassassin.apache.org/) och [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                    |
| [Tangerine](https://tangeri.ne)                                                               | DNS över HTTPS-förfrågningar med Node.js och caching med Redis – vilket säkerställer global konsistens och mycket mer.                                                                                                                                                                                                                                             |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Vårt utvecklingsteam använder detta (och rekommenderar det också) som **den föredragna e-postklienten att använda med Forward Email**.                                                                                                                                                                                                                            |
| [UTM](https://github.com/utmapp/UTM)                                                          | Vårt utvecklingsteam använder detta för att skapa virtuella maskiner för iOS och macOS för att testa olika e-postklienter (parallellt) med våra IMAP- och SMTP-servrar.                                                                                                                                                                                            |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Modernt öppen källkods Linux-baserat serveroperativsystem som driver hela vår infrastruktur.                                                                                                                                                                                                                                                                       |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP-serverbibliotek – se dess anteckningar om [bifogade filer de-duplicering](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) och [IMAP-protokollstöd](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                             |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Snabbt och enkelt API-bibliotek för Node.js för att programmässigt interagera med SQLite3.                                                                                                                                                                                                                                                                         |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Utvecklarvänligt e-postramverk för att skapa, förhandsgranska och skicka anpassade e-postmeddelanden (t.ex. kontonotifikationer och mer).                                                                                                                                                                                                                           |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL-frågebyggare med Mongo-stil syntax. Detta sparar vårt utvecklingsteam tid eftersom vi kan fortsätta skriva i Mongo-stil över hela stacken med en databasagnostisk metod. **Det hjälper också till att undvika SQL-injektionsattacker genom att använda frågeparametrar.**                                                                                  |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL-verktyg för att extrahera information om befintligt databasschema. Detta gör att vi enkelt kan validera att alla index, tabeller, kolumner, begränsningar och mer är giltiga och är `1:1` med hur de ska vara. Vi skrev till och med automatiserade hjälpare för att lägga till nya kolumner och index om ändringar görs i databasscheman (med mycket detaljerade felmeddelanden också). |
| [knex](https://github.com/knex/knex)                                                          | SQL-frågebyggare som vi endast använder för databas-migrationer och schema-validering via `knex-schema-inspector`.                                                                                                                                                                                                                                                   |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatisk [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)-frasöversättning med stöd för Markdown med hjälp av [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                 |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Node.js-paket för att lösa och etablera anslutningar med MX-servrar och hantera fel.                                                                                                                                                                                                                                                                              |
| [pm2](https://github.com/Unitech/pm2)                                                         | Node.js produktionsprocesshanterare med inbyggd lastbalanserare ([finjusterad](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) för prestanda).                                                                                                                                                                                                   |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP-serverbibliotek – vi använder detta för våra mail exchange ("MX") och utgående SMTP-servrar.                                                                                                                                                                                                                                                                    |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Användbart verktyg för att testa IMAP-servrar mot benchmarks och RFC-specifikationens IMAP-protokollkompatibilitet. Detta projekt skapades av [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-teamet (en aktiv öppen källkods IMAP- och POP3-server från juli 2002). Vi testade vår IMAP-server omfattande med detta verktyg.                                    |
> Du kan hitta andra projekt vi använder i [vår källkod på GitHub](https://github.com/forwardemail).

### Leverantörer {#providers}

| Leverantör                                      | Syfte                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS-leverantör, hälsokontroller, lastbalanserare och backup-lagring med hjälp av [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Värd för källkod, CI/CD och projektledning.                                                                                  |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikerad serverhosting och hanterade databaser.                                                                             |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Dedikerad serverhosting.                                                                                                      |
| [DataPacket](https://www.datapacket.com)        | Dedikerad serverhosting.                                                                                                      |


## Tankar {#thoughts}

### Principer {#principles}

Forward Email är designat enligt dessa principer:

1. Vara alltid utvecklarvänligt, säkerhets- och integritetsfokuserat samt transparent.
2. Följa [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor) och [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Rikta sig till den driftiga, egenfinansierade och [ramen-lönsamma](http://www.paulgraham.com/ramenprofitable.html) utvecklaren

### Experiment {#experiments}

> **tldr;** I slutändan är det inte tekniskt genomförbart att använda S3-kompatibel objektlagring och/eller Virtual Tables på grund av prestandaskäl och är benäget för fel på grund av minnesbegränsningar.

Vi har gjort några experiment som ledde fram till vår slutgiltiga SQLite-lösning som diskuterats ovan.

Ett av dessa var att försöka använda [rclone]() och SQLite tillsammans med ett S3-kompatibelt lagringslager.

Det experimentet ledde till att vi bättre förstod och upptäckte kantfall kring rclone, SQLite och användning av [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Om du aktiverar flaggan `--vfs-cache-mode writes` med rclone, så fungerar läsningar bra, men skrivningar kommer att cachas.
  * Om du har flera IMAP-servrar distribuerade globalt, kommer cachen att vara inkonsekvent mellan dem om du inte har en enda skrivare och flera lyssnare (t.ex. en pub/sub-lösning).
  * Detta är otroligt komplext och att lägga till ytterligare komplexitet som detta kommer att resultera i fler enskilda felpunkter.
  * S3-kompatibla lagringsleverantörer stödjer inte partiella filändringar – vilket innebär att varje ändring av `.sqlite`-filen resulterar i en komplett ändring och uppladdning av databasen.
  * Andra lösningar som `rsync` finns, men de är inte fokuserade på write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)")-stöd – så vi slutade med att granska Litestream. Lyckligtvis krypterar vår användning redan [WAL](https://www.sqlite.org/wal.html)-filerna åt oss, så vi behöver inte förlita oss på Litestream för det. Dock var vi ännu inte säkra på Litestream för produktionsanvändning och har några anteckningar nedan om det.
  * Att använda detta alternativ `--vfs-cache-mode writes` (det *enda* sättet att använda SQLite över `rclone` för skrivningar) kommer att försöka kopiera hela databasen från början i minnet – att hantera en 10 GB stor brevlåda är okej, men att hantera flera brevlådor med extremt hög lagring kommer att orsaka att IMAP-servrarna stöter på minnesbegränsningar och `ENOMEM`-fel, segmenteringsfel och datakorruption.
* Om du försöker använda SQLite [Virtual Tables](https://www.sqlite.org/vtab.html) (t.ex. med [s3db](https://github.com/jrhy/s3db)) för att ha data lagrade på ett S3-kompatibelt lagringslager, kommer du att stöta på flera fler problem:
  * Läsningar och skrivningar blir extremt långsamma eftersom S3 API-endpoints måste nås med HTTP-metoderna `GET`, `PUT`, `HEAD` och `POST`.
  * Utvecklingstester visade att över 500K-1M+ poster på fiberinternet fortfarande begränsas av genomströmningen vid skrivning och läsning till S3-kompatibla leverantörer. Till exempel körde våra utvecklare `for`-loopar för både sekventiella SQL `INSERT`-satser och sådana som bulk-skriver stora mängder data. I båda fallen var prestandan häpnadsväckande långsam.
  * Virtuella tabeller **kan inte ha index**, `ALTER TABLE`-satser och [andra](https://stackoverflow.com/a/12507650) [begränsningar](https://sqlite.org/lang_createvtab.html) – vilket leder till fördröjningar på upp till 1-2 minuter eller mer beroende på datamängd.
  * Objekt lagrades okrypterade och inget inbyggt krypteringsstöd finns tillgängligt.
* Vi undersökte också att använda [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) som är konceptuellt och tekniskt liknande föregående punkt (så det har samma problem). En möjlighet skulle vara att använda en anpassad `sqlite3`-build inlindad med kryptering som [wxSQLite3](https://github.com/utelle/wxsqlite3) (som vi för närvarande använder i vår lösning ovan) genom [att redigera setup-filen](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* En annan potentiell metod var att använda [multiplex-tillägget](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), men detta har en begränsning på 32 GB och skulle kräva komplex byggnation och utvecklingsproblem.
* `ALTER TABLE`-satser krävs (så detta utesluter helt användning av Virtual Tables). Vi behöver `ALTER TABLE`-satser för att vår hook med `knex-schema-inspector` ska fungera korrekt – vilket säkerställer att data inte korruptas och att hämtade rader kan konverteras till giltiga dokument enligt våra `mongoose`-schemadefinitioner (vilket inkluderar begränsningar, variabeltyp och godtycklig datavalidering).
* Nästan alla S3-kompatibla projekt relaterade till SQLite i open-source-communityn är i Python (och inte JavaScript som vi använder för 100% av vår stack).
* Komprimeringsbibliotek som [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (se [kommentarer](https://news.ycombinator.com/item?id=32303762)) ser lovande ut, men [är kanske inte redo för produktionsanvändning än](https://github.com/phiresky/sqlite-zstd#usage). Istället kommer applikationssideskomprimering på datatyper som `String`, `Object`, `Map`, `Array`, `Set` och `Buffer` att vara en renare och enklare metod (och är också lättare att migrera eftersom vi kan lagra en `Boolean`-flagga eller kolumn – eller till och med använda `PRAGMA` `user_version=1` för komprimering eller `user_version=0` för ingen komprimering som databasmetadata).
  * Lyckligtvis har vi redan implementerat bilagede-duplicering i vår IMAP-serverlagring – därför kommer varje meddelande med samma bilaga inte att behålla en kopia av bilagan – istället lagras en enda bilaga för flera meddelanden och trådar i en brevlåda (och en främmande referens används därefter).
* Projektet Litestream, som är en SQLite-replikations- och backup-lösning, är mycket lovande och vi kommer troligen att använda det i framtiden.
  * Inte för att förminska författaren/författarna – eftersom vi älskar deras arbete och bidrag till open-source i över ett decennium nu – men från verklig användning verkar det som att det [kan finnas många problem](https://github.com/benbjohnson/litestream/issues) och [potentiell dataförlust vid användning](https://github.com/benbjohnson/litestream/issues/218).
* Backup-återställning måste vara friktionsfri och trivial. Att använda en lösning som MongoDB med `mongodump` och `mongoexport` är inte bara tidskrävande utan också konfigurationskomplicerat.
  * SQLite-databaser gör det enkelt (det är en enda fil).
  * Vi ville designa en lösning där användare kan ta sin brevlåda och lämna när som helst.
    * Enkla Node.js-kommandon som `fs.unlink('mailbox.sqlite'))` och den är permanent raderad från disklagring.
    * Vi kan på liknande sätt använda ett S3-kompatibelt API med HTTP `DELETE` för att enkelt ta bort snapshots och backuper för användare.
  * SQLite var den enklaste, snabbaste och mest kostnadseffektiva lösningen.
### Brist på alternativ {#lack-of-alternatives}

Såvitt vi vet är inga andra e-posttjänster designade på detta sätt och de är inte heller open-source.

Vi *tror att detta kan bero* på att befintliga e-posttjänster har gammal teknik i produktion med [spaghettikod](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De flesta, om inte alla, befintliga e-postleverantörer är antingen closed-source eller marknadsför sig som open-source, **men i verkligheten är det bara deras front-end som är open-source.**

**Den mest känsliga delen av e-post** (den faktiska lagringen/IMAP/SMTP-interaktionen) **hanteras helt på back-end (servern), och *inte* på front-end (klienten)**.

### Prova Forward Email {#try-out-forward-email}

Registrera dig idag på <https://forwardemail.net>! :rocket:
