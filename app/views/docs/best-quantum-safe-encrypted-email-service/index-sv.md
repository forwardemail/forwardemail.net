# Kvantbeständig e-post: Hur vi använder krypterade SQLite-postlådor för att skydda din e-post {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Jämförelse av e-postleverantörer](#email-service-provider-comparison)
* [Hur fungerar det](#how-does-it-work)
* [Teknologier](#technologies)
  * [Databaser](#databases)
  * [Säkerhet](#security)
  * [Brevlådor](#mailboxes)
  * [Samtidighet](#concurrency)
  * [Säkerhetskopior](#backups)
  * [Söka](#search)
  * [Projekt](#projects)
  * [Leverantörer](#providers)
* [Tankar](#thoughts)
  * [Principer](#principles)
  * [Experiment](#experiments)
  * [Brist på alternativ](#lack-of-alternatives)
  * [Testa vidarebefordra e-post](#try-out-forward-email)

## Förord {#foreword}

> \[!IMPORTANT]
> Vår e-posttjänst är [100 % öppen källkod](https://github.com/forwardemail) och integritetsfokuserad genom säkra och krypterade SQLite-postlådor.

Tills vi lanserade [IMAP-stöd](/faq#do-you-support-receiving-email-with-imap) använde vi MongoDB för våra behov av permanent datalagring.

Den här tekniken är fantastisk och vi använder den fortfarande idag – men för att få kryptering i vila med MongoDB behöver du använda en leverantör som erbjuder MongoDB Enterprise, till exempel Digital Ocean eller Mongo Atlas – eller betala för en företagslicens (och därefter behöva arbeta med säljteamets latens).

Vårt team på [Vidarebefordra e-post](https://forwardemail.net) behövde en utvecklarvänlig, skalbar, pålitlig och krypterad lagringslösning för IMAP-postlådor. Som utvecklare med öppen källkod var det emot [våra principer](#principles) att använda en teknik som kräver licensavgift för att få funktionen kryptering i vila – och därför experimenterade, undersökte och utvecklade vi en ny lösning från grunden för att lösa dessa behov.

Istället för att använda en delad databas för att lagra dina brevlådor, lagrar och krypterar vi dina brevlådor individuellt med ditt lösenord (som bara du har). **Vår e-posttjänst är så säker att om du glömmer ditt lösenord förlorar du din brevlåda** (och behöver återställa den med offline-säkerhetskopior eller börja om).

Fortsätt läsa medan vi fördjupar oss nedan med [jämförelse av e-postleverantörer](#email-service-provider-comparison), [hur vår tjänst fungerar](#how-does-it-work), [vår teknikstack](#technologies) och fler.

## Jämförelse av e-postleverantörer {#email-service-provider-comparison}

Vi är den enda e-postleverantören med 100 % öppen källkod och integritetsfokus som lagrar individuellt krypterade SQLite-postlådor, erbjuder obegränsat antal domäner, alias och användare, och har stöd för utgående SMTP, IMAP och POP3:

**Till skillnad från andra e-postleverantörer behöver du inte betala för lagring per domän eller alias med Vidarebefordra e-post.** Lagring delas över hela ditt konto – så om du har flera anpassade domännamn och flera alias på varje, då är vi den perfekta lösningen för dig. Observera att du fortfarande kan tillämpa lagringsgränser om så önskas per domän eller alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Läs jämförelse av e-posttjänster <i class="fa fa-search-plus"></i></a>

## Hur fungerar det {#how-does-it-work}

1. Med hjälp av din e-postklient som Apple Mail, Thunderbird, Gmail eller Outlook ansluter du till våra säkra [IMAP](/faq#do-you-support-receiving-email-with-imap)-servrar med ditt användarnamn och lösenord:

* Ditt användarnamn är ditt fullständiga alias med din domän, till exempel `hello@example.com`.
* Ditt lösenord genereras slumpmässigt och visas bara i 30 sekunder när du klickar på <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> från <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> <i class="fa fa-angle-right"></i>Alias.

2. När du är ansluten skickar din e-postklient [IMAP-protokollkommandon](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) till vår IMAP-server för att hålla din inkorg synkroniserad. Detta inkluderar att skriva och lagra utkast till e-postmeddelanden och andra åtgärder du kan göra (t.ex. markera ett e-postmeddelande som viktigt eller flagga ett e-postmeddelande som skräppost).

3. E-postutbytesservrar (allmänt kända som "MX"-servrar) tar emot ny inkommande e-post och lagrar den i din inkorg. När detta händer kommer din e-postklient att meddelas och synkronisera din inkorg. Våra e-postutbytesservrar kan vidarebefordra din e-post till en eller flera mottagare (inklusive [webbhooks](/faq#do-you-support-webhooks)), lagra din e-post åt dig i din krypterade IMAP-lagring hos oss, **eller båda**!

> \[!TIP]
> Intresserad av att lära dig mer? Läs [hur man konfigurerar vidarebefordran av e-post](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hur vår postutbytestjänst fungerar](/faq#how-does-your-email-forwarding-system-work) eller visa [våra guider](/guides).

4. Bakom kulisserna fungerar vår säkra e-postlagringsdesign på två sätt för att hålla dina brevlådor krypterade och endast tillgängliga för dig:

* När vi tar emot ny e-post från en avsändare skriver våra e-postservrar till en individuell, tillfällig och krypterad postlåda åt dig.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* När du ansluter till vår IMAP-server med din e-postklient krypteras ditt lösenord i minnet och används för att läsa och skriva till din inkorg. Din inkorg kan bara läsas från och skrivas till med detta lösenord. Tänk på att eftersom du är den enda med detta lösenord kan **bara du** läsa och skriva till din inkorg när du använder den. Nästa gång din e-postklient försöker hämta e-post eller synkronisera kommer dina nya meddelanden att överföras från denna tillfälliga inkorg och lagras i din faktiska inkorgfil med ditt angivna lösenord. Observera att denna tillfälliga inkorg rensas och raderas efteråt så att endast din lösenordsskyddade inkorg har meddelandena.

* **Om du är ansluten till IMAP (t.ex. använder en e-postklient som Apple Mail eller Thunderbird) behöver vi inte skriva till tillfällig disklagring. Ditt krypterade IMAP-lösenord i minnet hämtas och används istället. I realtid, när ett meddelande försöker levereras till dig, skickar vi en WebSocket-förfrågan till alla IMAP-servrar och frågar dem om de har en aktiv session för dig (detta är hämtningsdelen), och skickar sedan vidare det krypterade lösenordet i minnet – så vi behöver inte skriva till en tillfällig postlåda, vi kan skriva till din faktiska krypterade postlåda med ditt krypterade lösenord.**

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

5. [Säkerhetskopieringar av dina krypterade brevlådor](#backups) görs dagligen. Du kan också begära en ny säkerhetskopia när som helst eller ladda ner den senaste säkerhetskopian från <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i>Domäner</a> <i class="fa fa-angle-right"></i>Alias. Om du väljer att byta till en annan e-posttjänst kan du enkelt migrera, ladda ner, exportera och rensa dina postlådor och säkerhetskopior när som helst.

## Teknologier {#technologies}

### Databaser {#databases}

Vi undersökte andra möjliga databaslagringslager, men ingen uppfyllde våra krav lika mycket som SQLite gjorde:

| Databas | Kryptering i vila | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Brevlådor | Licens | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :stjärna: | :white_check_mark: Ja med [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :vit_check_markering: | :white_check_mark: Allmän egendom | :vit_check_markering: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relationsdatabas | :x: AGPL och `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relationsdatabas | :vit_check_markering: __CELL_KOD_0__ | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :vit_check_markering: __CELL_KOD_0__ | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :vit_bockmarkering: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relationsdatabas | :white_check_mark: `PostgreSQL` (liknande `BSD` eller `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :vit_bockmarkering: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relationsdatabas | :vit_check_markering: `GPLv2` och `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relationsdatabas | :x: `BUSL-1.1` och andra | :x: |

> Här är en [blogginlägg som jämför flera SQLite-databaslagringsalternativ](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) i tabellen ovan.

### Säkerhet {#security}

Vi använder alltid [kryptering i vila](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [kryptering under överföring](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS över HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") med :tangerine: [Mandarin](https://tangeri.ne) och [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) kryptering på brevlådor. Dessutom använder vi tokenbaserad tvåfaktorsautentisering (i motsats till SMS som är misstänkt för [man-in-the-middle-attacker](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), roterade SSH-nycklar med root-åtkomst inaktiverad, exklusiv åtkomst till servrar via begränsade IP-adresser och mer.

I händelse av en [ond hembiträdesattack](https://en.wikipedia.org/wiki/Evil_maid_attack) eller en oseriös anställd från en tredjepartsleverantör **kan din inkorg fortfarande bara öppnas med ditt genererade lösenord**. Var säker på att vi inte förlitar oss på några tredjepartsleverantörer utöver våra SOC Type 2-klagomålsserverleverantörer Cloudflare, DataPacket, Digital Ocean och Vultr.

Vårt mål är att ha så få [enda felpunkt](https://en.wikipedia.org/wiki/Single_point_of_failure) som möjligt.

### Brevlådor {#mailboxes}

> **tldr;** Våra IMAP-servrar använder individuellt krypterade SQLite-databaser för var och en av dina brevlådor.

[SQLite är extremt populärt](https://www.sqlite.org/mostdeployed.html) inbäddad databas – den körs för närvarande på din telefon och dator – [och används av nästan alla större teknologier](https://www.sqlite.org/famous.html).

Till exempel finns det på våra krypterade servrar en SQLite-databaspostlåda för `linux@example.com`, `info@example.com`, `hello@example.com` och så vidare – en för varje som en `.sqlite`-databasfil. Vi namnger inte heller databasfilerna med e-postadressen – istället använder vi BSON ObjectID och unika genererade UUID:er som inte delar vem postlådan tillhör eller vilken e-postadress den finns under (t.ex. `353a03f21e534321f5d6e267.sqlite`).

Var och en av dessa databaser är krypterade med ditt lösenord (som bara du har) med hjälp av [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Det betyder att dina brevlådor är individuellt krypterade, fristående, [sandlåda](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) och portabla.

Vi har finjusterat SQLite med följande [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Ändamål |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Se `better-sqlite3-multiple-ciphers` under [Projects](#projects) för mer information. |
| `key="****************"` | Detta är ditt dekrypterade lösenord, som endast finns i minnet, och som skickas via din e-postklients IMAP-anslutning till vår server. Nya databasinstanser skapas och stängs för varje läs- och skrivsession (för att säkerställa sandlådehantering och isolering). |
| `journal_model=WAL` | Förhandsskrivningslogg ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Förhindrar skrivlåsningsfel [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Ökar transaktionernas hållbarhet [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Kräver att referenser till främmande nyckelr (t.ex. en relation från en tabell till en annan) tillämpas. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), men för validering och dataintegritet bör det vara aktiverat. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) att använda för att säkerställa utvecklarens förnuft. |

> Alla andra standardvärden kommer från SQLite enligt specificering från [officiell PRAGMA-dokumentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samtidighet {#concurrency}

> **tldr;** Vi använder `WebSocket` för samtidig läsning och skrivning till dina krypterade SQLite-postlådor.

#### Läser {#reads}

Din e-postklient på din telefon kan tolka `imap.forwardemail.net` till en av våra Digital Ocean IP-adresser – och din skrivbordsklient kan tolka en separat IP från en helt annan [leverantör](#providers).

Oavsett vilken IMAP-server din e-postklient ansluter till vill vi att anslutningen ska läsa från din databas i realtid med 100 % noggrannhet. Detta görs via WebSockets.

#### Skriver {#writes}

Att skriva till din databas är lite annorlunda – eftersom SQLite är en inbäddad databas och din postlåda som standard finns i en enda fil.

Vi hade undersökt alternativ som `litestream`, `rqlite` och `dqlite` nedan – men inget av dessa uppfyllde våra krav.

För att kunna skriva med write-ahead-loggning ("[WAL](https://www.sqlite.org/wal.html)") aktiverad måste vi se till att endast en server ("Primär") är ansvarig för att göra det. [WAL](https://www.sqlite.org/wal.html) snabbar upp samtidighet drastiskt och tillåter en skribent och flera läsare.

Primärservrarna körs på dataservrarna med de monterade volymerna som innehåller de krypterade postlådorna. Ur distributionssynpunkt kan man betrakta alla individuella IMAP-servrar bakom `imap.forwardemail.net` som sekundära servrar ("Sekundär").

Vi åstadkommer tvåvägskommunikation med [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primära servrar använder en instans av [ws](https://github.com/websockets/ws):s `WebSocketServer`-server.
* Sekundära servrar använder en instans av [ws](https://github.com/websockets/ws):s `WebSocket`-klient som är omsluten av [websocket-som-utlovat](https://github.com/vitalets/websocket-as-promised) och [återansluta-websocket](https://github.com/opensumi/reconnecting-websocket). Dessa två omslutare säkerställer att `WebSocket` återansluter och kan skicka och ta emot data för specifika databasskrivningar.

### Säkerhetskopieringar {#backups}

> **tldr;** Säkerhetskopieringar av dina krypterade brevlådor görs dagligen. Du kan också direkt begära en ny säkerhetskopia eller ladda ner den senaste säkerhetskopian när som helst från <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mitt konto <i class="fa fa-angle-right"></i> Domäner</a> <i class="fa fa-angle-right"></i> Alias.

För säkerhetskopior kör vi helt enkelt SQLite-kommandot `VACUUM INTO` varje dag under IMAP-kommandobearbetning, vilket utnyttjar ditt krypterade lösenord från en minnesbaserad IMAP-anslutning. Säkerhetskopior lagras om ingen befintlig säkerhetskopia upptäcks eller om [SHA-256](https://en.wikipedia.org/wiki/SHA-2)-hashen har ändrats på filen jämfört med den senaste säkerhetskopian.

Observera att vi använder kommandot `VACUUM INTO` i motsats till det inbyggda kommandot `backup` eftersom om en sida ändras under en `backup`-kommandooperation måste den börja om. Kommandot `VACUUM INTO` tar en ögonblicksbild. Se dessa kommentarer om [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) och [Hackernyheter](https://news.ycombinator.com/item?id=31387556) för mer insikt.

Dessutom använder vi `VACUUM INTO` istället för `backup`, eftersom kommandot `backup` skulle lämna databasen okrypterad under en kort period tills `rekey` anropas (se GitHub [kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) för mer information).

Sekundärenheten kommer att instruera primärenheten via `WebSocket`-anslutningen att köra säkerhetskopieringen – och primärenheten kommer sedan att få kommandot att göra det och kommer därefter att:

1. Anslut till din krypterade postlåda.
2. Skaffa ett skrivlås.
3. Kör en WAL-kontrollpunkt via `wal_checkpoint(PASSIVE)`.
4. Kör SQLite-kommandot `VACUUM INTO`.
5. Se till att den kopierade filen kan öppnas med det krypterade lösenordet (safeguard/dummyproofing).
6. Ladda upp den till Cloudflare R2 för lagring (eller din egen leverantör om det anges).

<!--
7. Komprimera den resulterande säkerhetskopian med `gzip`.
8. Ladda upp den till Cloudflare R2 för lagring (eller din egen leverantör om det anges).
-->

Kom ihåg att dina brevlådor är krypterade – och även om vi har IP-begränsningar och andra autentiseringsåtgärder på plats för WebSocket-kommunikation – kan du vara säker på att WebSocket-nyttolasten inte kan öppna din databas om den inte har ditt IMAP-lösenord.

Endast en säkerhetskopia lagras per postlåda för närvarande, men i framtiden kan vi komma att erbjuda återställning vid tidpunkten ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Sök {#search}

Våra IMAP-servrar stöder kommandot `SEARCH` med komplexa frågor, reguljära uttryck och mer.

Snabb sökprestanda är tack vare [FTS5](https://www.sqlite.org/fts5.html) och [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Vi lagrar `Date`-värden i SQLite-postlådorna som [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strängar via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (med UTC-tidszon för att likhetsjämförelser ska fungera korrekt).

Index lagras också för alla egenskaper som finns i sökfrågor.

### Projekt {#projects}

Här är en tabell som beskriver projekt vi använder i vår källkod och utvecklingsprocess (alfabetiskt sorterat):

| Projekt | Ändamål |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps-automationsplattform för att enkelt underhålla, skala och hantera hela vår serverflotta. |
| [Bree](https://github.com/breejs/bree) | Jobbschemaläggare för Node.js och JavaScript med cron, dates, ms, later och användarvänligt stöd. |
| [Cabin](https://github.com/cabinjs/cabin) | Utvecklarvänligt JavaScript- och Node.js-loggbibliotek med säkerhet och integritet i åtanke. |
| [Lad](https://github.com/ladjs/lad) | Node.js-ramverket som driver hela vår arkitektur och tekniska design med MVC och mer. |
| [MongoDB](https://www.mongodb.com/) | NoSQL-databaslösning som vi använder för att lagra all annan data utanför postlådor (t.ex. ditt konto, inställningar, domäner och aliaskonfigurationer). |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB objektdokumentmodellering ("ODM") som vi använder i hela vår stack. Vi skrev speciella hjälpprogram som gör att vi helt enkelt kan fortsätta använda **Mongoose med SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js är den plattformsoberoende JavaScript-körtidsmiljön med öppen källkod som kör alla våra serverprocesser. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js-paket för att skicka e-post, skapa kontakter och mer. Vi är en officiell sponsor av detta projekt. |
| [Redis](https://redis.io/) | Minnesbaserad databas för cachning, publicerings-/prenumerationskanaler och DNS via HTTPS-förfrågningar. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Krypteringstillägg för SQLite för att tillåta kryptering av hela databasfiler (inklusive write-ahead-loggen ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, ...). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visuell SQLite-editor (som du också kan använda) för att testa, ladda ner och visa utvecklingspostlådor. |
| [SQLite](https://www.sqlite.org/about.html) | Inbäddat databaslager för skalbar, fristående, snabb och robust IMAP-lagring. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js verktyg för att förhindra skräppost, e-postfiltrering och nätfiske (vårt alternativ till [Spam Assassin](https://spamassassin.apache.org/) och [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | DNS över HTTPS-förfrågningar med Node.js och cachning med Redis – vilket säkerställer global konsekvens och mycket mer. |
| [Thunderbird](https://www.thunderbird.net/) | Vårt utvecklingsteam använder detta (och rekommenderar även detta) som **den föredragna e-postklienten att använda med vidarebefordran av e-post**. |
| [UTM](https://github.com/utmapp/UTM) | Vårt utvecklingsteam använder detta för att skapa virtuella maskiner för iOS och macOS för att testa olika e-postklienter (parallellt) med våra IMAP- och SMTP-servrar. |
| [Ubuntu](https://ubuntu.com/download/server) | Modernt Linux-baserat serveroperativsystem med öppen källkod som driver all vår infrastruktur. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP-serverbibliotek – se dess anteckningar om [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) och [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Snabbt och enkelt API-bibliotek för Node.js för att interagera med SQLite3 programmatiskt. |
| [email-templates](https://github.com/forwardemail/email-templates) | Utvecklarvänligt e-postramverk för att skapa, förhandsgranska och skicka anpassade e-postmeddelanden (t.ex. kontoaviseringar med mera). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL-frågebyggare med syntax i Mongo-stil. Detta sparar tid åt vårt utvecklingsteam eftersom vi kan fortsätta skriva i Mongo-stil över hela stacken med en databasagnostisk metod. **Det hjälper också till att undvika SQL-injektionsattacker genom att använda frågeparametrar.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL-verktyg för att extrahera information om befintliga databasscheman. Detta gör att vi enkelt kan validera att alla index, tabeller, kolumner, begränsningar med mera är giltiga och att de är `1:1` som de ska. Vi har till och med skrivit automatiserade hjälpprogram för att lägga till nya kolumner och index om ändringar görs i databasscheman (med extremt detaljerade felmeddelanden också). |
| [knex](https://github.com/knex/knex) | SQL-frågebyggare som vi endast använder för databasmigreringar och schemavalidering via `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatisk frasöversättning av [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) med stöd för Markdown med [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js-paketet för att lösa och upprätta anslutningar med MX-servrar och hantera fel. |
| [pm2](https://github.com/Unitech/pm2) | Node.js produktionsprocesshanterare med inbyggd lastbalanserare ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) för prestanda). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP-serverbibliotek – vi använder detta för våra e-postutbytes- ("MX") och utgående SMTP-servrar. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Användbart verktyg för att testa IMAP-servrar mot riktmärken och RFC-specifikationens kompatibilitet med IMAP-protokoll. Detta projekt skapades av [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-teamet (en aktiv IMAP- och POP3-server med öppen källkod från juli 2002). Vi testade vår IMAP-server utförligt med detta verktyg. |

> Du hittar andra projekt vi använder i [vår källkod på GitHub](https://github.com/forwardemail).

### Leverantörer {#providers}

| Leverantör | Ändamål |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-leverantör, hälsokontroller, lastutjämnare och säkerhetskopieringslagring med [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikerad serverhosting och hanterade databaser. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dedikerad serverhosting. |
| [DataPacket](https://www.datapacket.com) | Dedikerad serverhosting. |

## Tankar {#thoughts}

### Principer {#principles}

Vidarebefordran av e-post är utformad enligt dessa principer:

1. Var alltid utvecklarvänlig, säkerhets- och integritetsfokuserad och transparent.

2. Följ [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Tolv Faktorer](https://12factor.net/), [Occams rakkniv](https://en.wikipedia.org/wiki/Occam%27s_razor) och [hundmatning](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).

3. Rikta in dig på den skrappiga, bootstrappade och [ramen-lönsam](http://www.paulgraham.com/ramenprofitable.html)-utvecklaren.

### Experiment {#experiments}

> **tldr;** Att använda S3-kompatibel objektlagring och/eller virtuella tabeller är i slutändan inte tekniskt genomförbart av prestandaskäl och är benäget för fel på grund av minnesbegränsningar.

Vi har gjort några experiment som lett fram till vår slutliga SQLite-lösning som diskuterats ovan.

En av dessa var att försöka använda [rclone]() och SQLite tillsammans med ett S3-kompatibelt lagringslager.

Det experimentet ledde oss till att ytterligare förstå och upptäcka edge-fall kring användningen av rclone, SQLite och [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Om du aktiverar flaggan `--vfs-cache-mode writes` med rclone, kommer läsningar att fungera, men skrivningar kommer att cacha.
* Om du har flera IMAP-servrar distribuerade globalt, kommer cachen att vara avstängd över dem om du inte har en enda skrivare och flera lyssnare (t.ex. en pub/sub-metod).
* Detta är otroligt komplext och att lägga till ytterligare komplexitet som denna kommer att resultera i fler enskilda felpunkter.
* S3-kompatibla lagringsleverantörer stöder inte partiella filändringar – vilket innebär att alla ändringar av `.sqlite`-filen kommer att resultera i en fullständig ändring och omladdning av databasen.
* Andra lösningar som `rsync` finns, men de fokuserar inte på stöd för write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – så vi slutade med att granska Litestream. Lyckligtvis krypterar vår krypteringsanvändning redan [WAL](https://www.sqlite.org/wal.html)-filerna åt oss, så vi behöver inte förlita oss på Litestream för det. Vi var dock ännu inte säkra på Litestream för produktionsanvändning och har några anteckningar nedan om det.
* Genom att använda alternativet `--vfs-cache-mode writes` (det *enda* sättet att använda SQLite istället för `rclone` för skrivningar) försöker man kopiera hela databasen från grunden till minnet – det går bra att hantera en 10 GB-postlåda, men att hantera flera postlådor med extremt hög lagringskapacitet kommer att orsaka att IMAP-servrarna stöter på minnesbegränsningar och `ENOMEM`-fel, segmenteringsfel och datakorruption.

* Om du försöker använda SQLite [Virtuella bord](https://www.sqlite.org/vtab.html) (t.ex. genom att använda [s3db](https://github.com/jrhy/s3db)) för att ha data live på ett S3-kompatibelt lagringslager kommer du att stöta på flera fler problem:

* Läsning och skrivning kommer att vara extremt långsam eftersom S3 API-slutpunkter måste nås med HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 och `.sqlite`3-metoderna.
* Utvecklingstester visade att överskridande av 500 000–1 miljon poster på fiberinternet fortfarande begränsas av dataflödet för skrivning och läsning till S3-kompatibla leverantörer. Till exempel körde våra utvecklare `.sqlite`4-loopar för att göra både sekventiella SQL-`.sqlite`5-satser och sådana som skrev stora mängder data i bulk. I båda fallen var prestandan förbluffande långsam.

* Virtuella tabeller **kan inte ha index**, `.sqlite`6-satser och `.sqlite`7 `.sqlite`8 – vilket leder till fördröjningar på upp till 1–2 minuter eller mer beroende på datamängden.

* Objekt lagrades okrypterade och inget inbyggt krypteringsstöd finns tillgängligt.

* Vi undersökte också möjligheten att använda `.sqlite`9, vilket konceptuellt och tekniskt liknar föregående punkt (så det har samma problem). En möjlighet vore att använda en anpassad `rsync`0-bygge inlindad med kryptering, såsom `rsync`1 (som vi för närvarande använder i vår lösning ovan) via `rsync`2.
* En annan potentiell metod var att använda `rsync`3, men detta har en begränsning på 32 GB och skulle kräva komplexa bygg- och utvecklingsproblem.
* `rsync`4-satser krävs (så detta utesluter helt användning av virtuella tabeller). Vi behöver `rsync`5-satser för att vår hook med `rsync`6 ska fungera korrekt – vilket säkerställer att data inte skadas och att hämtade rader kan konverteras till giltiga dokument enligt våra `rsync`7-schemadefinitioner (som inkluderar begränsning, variabeltyp och godtycklig datavalidering).
* Nästan alla S3-kompatibla projekt relaterade till SQLite i öppen källkodsgemenskapen är i Python (och inte JavaScript som vi använder för 100 % av vår stack).
* Komprimeringsbibliotek som `rsync`8 (se `rsync`9) ser lovande ut, men __PROTECTED_LINK_189__0. Istället kommer applikationssideskomprimering på datatyper som __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 och __PROTECTED_LINK_189__6 att vara en renare och enklare metod (och är också enklare att migrera, eftersom vi kan lagra en __PROTECTED_LINK_189__7-flagga eller kolumn – eller till och med använda __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 för komprimering eller __PROTECTED_LINK_190__0 för ingen komprimering som databasmetadata).

* Som tur är har vi redan implementerad deduplicering av bilagor i vår IMAP-serverlagring – därför kommer varje meddelande med samma bilaga inte att behålla en kopia av bilagan – istället lagras en enda bilaga för flera meddelanden och trådar i en postlåda (och en extern referens används därefter).
* Projektet Litestream, som är en SQLite-replikerings- och säkerhetskopieringslösning, är mycket lovande och vi kommer troligtvis att använda det i framtiden.
* Inte för att misskreditera författaren/författarna – eftersom vi älskar deras arbete och bidrag till öppen källkod i över ett decennium nu – men från verklig användning verkar det som att det finns __PROTECTED_LINK_190__1 och __PROTECTED_LINK_190__2.
* Återställning av säkerhetskopior måste vara friktionsfritt och trivialt. Att använda en lösning som MongoDB med __PROTECTED_LINK_190__3 och __PROTECTED_LINK_190__4 är inte bara tråkigt, utan också tidskrävande och har konfigurationskomplexitet.
* SQLite-databaser gör det enkelt (det är en enda fil).
* Vi ville designa en lösning där användare kan ta sin postlåda och lämna när som helst.
* Enkla Node.js-kommandon till __PROTECTED_LINK_190__5 och den raderas permanent från disklagring.
* Vi kan på liknande sätt använda ett S3-kompatibelt API med HTTP __PROTECTED_LINK_190__6 för att enkelt ta bort snapshots och säkerhetskopior för användare.

* SQLite var den enklaste, snabbaste och mest kostnadseffektiva lösningen.

### Brist på alternativ {#lack-of-alternatives}

Så vitt vi vet är inga andra e-posttjänster utformade på detta sätt och de är inte heller öppen källkod.

Vi *tror att detta kan bero på* att befintliga e-posttjänster har äldre teknik i produktion med [spaghettikod](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De flesta, om inte alla, befintliga e-postleverantörer är antingen slutna eller marknadsför sig som öppna, **men i verkligheten är det bara deras användargränssnitt som är öppna.**

**Den känsligaste delen av e-post** (själva lagrings-/IMAP-/SMTP-interaktionen) **görs helt på backend-servern och *inte* på frontend-klienten**.

### Testa vidarebefordra e-post {#try-out-forward-email}

Registrera dig idag på <https://forwardemail.net>! :rocket: