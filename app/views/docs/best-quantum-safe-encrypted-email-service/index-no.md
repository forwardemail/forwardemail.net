# Kvantebestandig e-post: Hvordan vi bruker krypterte SQLite-postbokser for å holde e-posten din trygg {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Sammenligning av e-postleverandører](#email-service-provider-comparison)
* [Hvordan fungerer det](#how-does-it-work)
* [Teknologier](#technologies)
  * [Databaser](#databases)
  * [Sikkerhet](#security)
  * [Postkasser](#mailboxes)
  * [Samtidighet](#concurrency)
  * [Sikkerhetskopier](#backups)
  * [Søk](#search)
  * [Prosjekter](#projects)
  * [Leverandører](#providers)
* [Tanker](#thoughts)
  * [Prinsipper](#principles)
  * [Eksperimenter](#experiments)
  * [Mangel på alternativer](#lack-of-alternatives)
  * [Prøv videresend e-post](#try-out-forward-email)

## Forord {#foreword}

> \[!IMPORTANT]
> E-posttjenesten vår er [100 % åpen kildekode](https://github.com/forwardemail) og personvernfokusert gjennom sikre og krypterte SQLite-postbokser.

Inntil vi lanserte [IMAP-støtte](/faq#do-you-support-receiving-email-with-imap), brukte vi MongoDB for våre behov for vedvarende datalagring.

Denne teknologien er fantastisk, og vi bruker den fortsatt i dag – men for å ha kryptering i ro med MongoDB må du bruke en leverandør som tilbyr MongoDB Enterprise, for eksempel Digital Ocean eller Mongo Atlas – eller betale for en bedriftslisens (og deretter måtte jobbe med salgsteamets latens).

Teamet vårt hos [Videresend e-post](https://forwardemail.net) trengte en utviklervennlig, skalerbar, pålitelig og kryptert lagringsløsning for IMAP-postbokser. Som åpen kildekode-utviklere var det imot [våre prinsipper](#principles) å bruke en teknologi der man må betale en lisensavgift for å få kryptering i ro – og derfor eksperimenterte, forsket og utviklet vi en ny løsning fra bunnen av for å løse disse behovene.

I stedet for å bruke en delt database til å lagre postkassene dine, lagrer og krypterer vi postkassene dine individuelt med passordet ditt (som bare du har). **E-posttjenesten vår er så sikker at hvis du glemmer passordet ditt, mister du postkassen din** (og må gjenopprette med offline sikkerhetskopier eller starte på nytt).

Fortsett å lese mens vi dykker dypt ned nedenfor med [sammenligning av e-postleverandører](#email-service-provider-comparison), [hvordan tjenesten vår fungerer](#how-does-it-work), [vår teknologistabel](#technologies) og mer.

## Sammenligning av e-postleverandører {#email-service-provider-comparison}

Vi er den eneste e-postleverandøren med 100 % åpen kildekode og personvernfokus som lagrer individuelt krypterte SQLite-postbokser, tilbyr et ubegrenset antall domener, aliaser og brukere, og støtter utgående SMTP-, IMAP- og POP3-tjenester:

**I motsetning til andre e-postleverandører trenger du ikke å betale for lagring per domene eller alias med Videresendt e-post.** Lagring deles på tvers av hele kontoen din – så hvis du har flere tilpassede domenenavn og flere aliaser på hvert av dem, er vi den perfekte løsningen for deg. Merk at du fortsatt kan håndheve lagringsgrenser hvis ønskelig per domene eller alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Les sammenligning av e-posttjenester <i class="fa fa-search-plus"></i></a>

## Hvordan fungerer det {#how-does-it-work}

1. Ved å bruke e-postklienten din, for eksempel Apple Mail, Thunderbird, Gmail eller Outlook, kobler du deg til våre sikre [IMAP](/faq#do-you-support-receiving-email-with-imap)-servere med brukernavnet og passordet ditt:

* Brukernavnet ditt er ditt fulle aliaset med domenet ditt, for eksempel `hello@example.com`.
* Passordet ditt genereres tilfeldig og vises bare i 30 sekunder når du klikker på <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser.

2. Når den er koblet til, sender e-postklienten din [IMAP-protokollkommandoer](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) til IMAP-serveren vår for å holde postkassen din synkronisert. Dette inkluderer å skrive og lagre utkast til e-poster og andre handlinger du kan gjøre (f.eks. merke en e-post som viktig eller flagge en e-post som spam/søppelpost).

3. E-postutvekslingsservere (vanligvis kjent som «MX»-servere) mottar ny innkommende e-post og lagrer den i postkassen din. Når dette skjer, vil e-postklienten din bli varslet og synkronisere postkassen din. Våre e-postutvekslingsservere kan videresende e-posten din til én eller flere mottakere (inkludert [netthooks](/faq#do-you-support-webhooks)), lagre e-posten din for deg i din krypterte IMAP-lagring hos oss, **eller begge deler**!

> \[!TIP]
> Interessert i å lære mer? Les [hvordan sette opp videresending av e-post](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hvordan postutvekslingstjenesten vår fungerer](/faq#how-does-your-email-forwarding-system-work), eller se [våre guider](/guides).

4. Bak kulissene fungerer vår sikre e-postlagringsdesign på to måter for å holde postkassene dine krypterte og bare tilgjengelige for deg:

* Når vi mottar ny e-post fra en avsender, skriver våre e-postutvekslingsservere til en individuell, midlertidig og kryptert postkasse for deg.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Når du kobler deg til IMAP-serveren vår med e-postklienten din, krypteres passordet ditt i minnet og brukes til å lese og skrive til postkassen din. Postkassen din kan bare leses fra og skrives til med dette passordet. Husk at siden du er den eneste med dette passordet, er det **bare du** som kan lese og skrive til postkassen din når du åpner den. Neste gang e-postklienten din prøver å hente e-post eller synkronisere, overføres de nye meldingene dine fra denne midlertidige postkassen og lagres i den faktiske postkassefilen din med passordet du har oppgitt. Merk at denne midlertidige postkassen slettes etterpå, slik at bare den passordbeskyttede postkassen din har meldingene.

**Hvis du er koblet til IMAP (f.eks. bruker en e-postklient som Apple Mail eller Thunderbird), trenger vi ikke å skrive til midlertidig disklagring. Det krypterte IMAP-passordet ditt i minnet hentes og brukes i stedet. I sanntid, når en melding forsøker å bli levert til deg, sender vi en WebSocket-forespørsel til alle IMAP-servere og spør dem om de har en aktiv økt for deg (dette er hentedelen), og deretter sender vi det krypterte passordet i minnet videre – slik at vi ikke trenger å skrive til en midlertidig postkasse, vi kan skrive til den faktiske krypterte postkassen din ved å bruke det krypterte passordet ditt.**

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

5. [Sikkerhetskopier av dine krypterte postkasser](#backups) lages daglig. Du kan også be om en ny sikkerhetskopi når som helst, eller laste ned den nyeste sikkerhetskopien fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser. Hvis du bestemmer deg for å bytte til en annen e-posttjeneste, kan du enkelt migrere, laste ned, eksportere og slette postkassene og sikkerhetskopiene dine når som helst.

## Teknologier {#technologies}

### Databaser {#databases}

Vi utforsket andre mulige databaselagringslag, men ingen oppfylte kravene våre like mye som SQLite gjorde:

| Database | Kryptering i ro | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postkasser | Tillatelse | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :stjerne: | :white_check_mark: Ja med [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :hvitt_hakemerke: | :white_check_mark: Offentlig eiendom | :hvitt_hakemerke: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relasjonsdatabase | :x: AGPL og `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relasjonsdatabase | :hvitt_hakemerke: `MIT` | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :hvitt_hakemerke: `LGPL-3.0-only` | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :hvitt_hakemerke: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relasjonsdatabase | :white_check_mark: `PostgreSQL` (ligner på `BSD` eller `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :hvitt_hakemerke: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relasjonsdatabase | :hvitt_hakemerke: `GPLv2` og `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relasjonsdatabase | :x: `BUSL-1.1` og andre | :x: |

> Her er en [blogginnlegg som sammenligner flere SQLite-databaselagringsalternativer](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) i tabellen ovenfor.

### Sikkerhet {#security}

Vi bruker til enhver tid [kryptering i ro](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [kryptering under overføring](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ved bruk av :tangerine: [Mandarin](https://tangeri.ne) og [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) kryptering på postbokser. I tillegg bruker vi tokenbasert tofaktorautentisering (i motsetning til SMS som er mistenkt for [mann-i-midten-angrep](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), roterte SSH-nøkler med root-tilgang deaktivert, eksklusiv tilgang til servere gjennom begrensede IP-adresser og mer.

I tilfelle en [ond hushjelpangrep](https://en.wikipedia.org/wiki/Evil_maid_attack) eller en uautorisert ansatt fra en tredjepartsleverandør, **kan postkassen din fortsatt bare åpnes med det genererte passordet ditt**. Du kan være trygg på at vi ikke er avhengige av noen tredjepartsleverandører annet enn våre SOC Type 2-klageserverleverandører Cloudflare, DataPacket, Digital Ocean og Vultr.

Målet vårt er å ha så få [enkeltstående feilpunkt](https://en.wikipedia.org/wiki/Single_point_of_failure) som mulig.

### Postkasser {#mailboxes}

> **tldr;** Våre IMAP-servere bruker individuelt krypterte SQLite-databaser for hver av postboksene dine.

[SQLite er ekstremt populært](https://www.sqlite.org/mostdeployed.html) innebygd database – den kjører for øyeblikket på telefonen og datamaskinen din – [og brukes av nesten alle større teknologier](https://www.sqlite.org/famous.html).

For eksempel, på våre krypterte servere finnes det en SQLite-databasepostkasse for `linux@example.com`, `info@example.com`, `hello@example.com` og så videre – én for hver som en `.sqlite`-databasefil. Vi navngir heller ikke databasefilene med e-postadressen – i stedet bruker vi BSON ObjectID og unike genererte UUID-er som ikke deler hvem postkassen tilhører eller hvilken e-postadresse den er under (f.eks. `353a03f21e534321f5d6e267.sqlite`).

Hver av disse databasene er kryptert med passordet ditt (som bare du har) ved hjelp av [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Dette betyr at postboksene dine er individuelt krypterte, selvstendige, [sandkasse](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) og bærbare.

Vi har finjustert SQLite med følgende [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Hensikt |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Se `better-sqlite3-multiple-ciphers` under [Projects](#projects) for mer innsikt. |
| `key="****************"` | Dette er ditt dekrypterte passord, som kun lagres i minnet, og som sendes via e-postklientens IMAP-tilkobling til serveren vår. Nye databaseforekomster opprettes og lukkes for hver lese- og skriveøkt (for å sikre sandkassering og isolering). |
| `journal_model=WAL` | Forhåndsskrivingslogg ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Forhindrer skrivelåsfeil [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Øker holdbarheten til transaksjoner [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Håndhever at fremmednøkkelreferanser (f.eks. en relasjon fra én tabell til en annen) håndheves. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), men for validering og dataintegritet bør det være aktivert. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) som skal brukes for å sikre utviklerens fornuft. |

> Alle andre standardinnstillinger er fra SQLite som spesifisert fra [offisiell PRAGMA-dokumentasjon](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samtidighet {#concurrency}

> **tldr;** Vi bruker `WebSocket` for samtidig lesing og skriving til dine krypterte SQLite-postbokser.

#### Leser {#reads}

E-postklienten på telefonen din kan løse `imap.forwardemail.net` til en av våre Digital Ocean IP-adresser – og skrivebordsklienten din kan løse en separat IP fra en helt annen [leverandør](#providers).

Uansett hvilken IMAP-server e-postklienten din kobler seg til, ønsker vi at tilkoblingen skal lese fra databasen din i sanntid med 100 % nøyaktighet. Dette gjøres via WebSockets.

#### Skriver {#writes}

Å skrive til databasen din er litt annerledes – siden SQLite er en innebygd database og postkassen din ligger i én enkelt fil som standard.

Vi hadde utforsket alternativer som `litestream`, `rqlite` og `dqlite` nedenfor – men ingen av disse oppfylte kravene våre.

For å utføre skrivinger med write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") aktivert, må vi sørge for at bare én server ("Primær") er ansvarlig for å gjøre det. [WAL](https://www.sqlite.org/wal.html) øker samtidighet drastisk og tillater én skriver og flere lesere.

Primærserveren kjører på dataserverne med de monterte volumene som inneholder de krypterte postboksene. Fra et distribusjonssynspunkt kan du anse alle de individuelle IMAP-serverne bak `imap.forwardemail.net` som sekundære servere ("Sekundær").

Vi oppnår toveiskommunikasjon med [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primære servere bruker en instans av [ws](https://github.com/websockets/ws)s `WebSocketServer`-server.
* Sekundære servere bruker en instans av [ws](https://github.com/websockets/ws)s `WebSocket`-klient som er pakket inn med [websocket-som-lovet](https://github.com/vitalets/websocket-as-promised) og [koble til websocket på nytt](https://github.com/opensumi/reconnecting-websocket). Disse to wrapperne sikrer at `WebSocket` kobler seg til på nytt og kan sende og motta data for spesifikke databaseskrivinger.

### Sikkerhetskopier {#backups}

> **tldr;** Sikkerhetskopier av dine krypterte postbokser tas daglig. Du kan også umiddelbart be om en ny sikkerhetskopi eller laste ned den nyeste sikkerhetskopien når som helst fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser.

For sikkerhetskopier kjører vi ganske enkelt SQLite `VACUUM INTO`-kommandoen hver dag under IMAP-kommandobehandling, som utnytter det krypterte passordet ditt fra en IMAP-tilkobling i minnet. Sikkerhetskopier lagres hvis ingen eksisterende sikkerhetskopi oppdages, eller hvis [SHA-256](https://en.wikipedia.org/wiki/SHA-2)-hashen er endret på filen sammenlignet med den nyeste sikkerhetskopien.

Merk at vi bruker `VACUUM INTO`-kommandoen i motsetning til den innebygde `backup`-kommandoen, fordi hvis en side endres under en `backup`-kommandooperasjon, må den starte på nytt. `VACUUM INTO`-kommandoen tar et øyeblikksbilde. Se disse kommentarene om [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) og [Hackernyheter](https://news.ycombinator.com/item?id=31387556) for mer innsikt.

I tillegg bruker vi `VACUUM INTO` i motsetning til `backup`, fordi `backup`-kommandoen ville la databasen være ukryptert i en kort periode inntil `rekey` kalles (se GitHub [kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) for innsikt).

Sekundæren vil instruere primæren via `WebSocket`-tilkoblingen om å utføre sikkerhetskopieringen – og primæren vil deretter motta kommandoen om å gjøre det og vil deretter:

1. Koble til den krypterte postkassen din.
2. Skaff deg en skrivelås.
3. Kjør et WAL-sjekkpunkt via `wal_checkpoint(PASSIVE)`.
4. Kjør SQLite-kommandoen `VACUUM INTO`.
5. Sørg for at den kopierte filen kan åpnes med det krypterte passordet (safeguard/dummyproofing).
6. Last den opp til Cloudflare R2 for lagring (eller din egen leverandør hvis spesifisert).

<!--
7. Komprimer den resulterende sikkerhetskopifilen med `gzip`.
8. Last den opp til Cloudflare R2 for lagring (eller din egen leverandør hvis spesifisert).
-->

Husk at postboksene dine er kryptert – og selv om vi har IP-begrensninger og andre autentiseringstiltak på plass for WebSocket-kommunikasjon – kan du være trygg på at WebSocket-nyttelasten ikke kan åpne databasen din med mindre den har IMAP-passordet ditt i tilfelle en uønsket aktør skulle oppstå.

Bare én sikkerhetskopi lagres per postboks for øyeblikket, men i fremtiden kan vi tilby gjenoppretting på et bestemt tidspunkt («[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)»).

### Søk {#search}

IMAP-serverne våre støtter `SEARCH`-kommandoen med komplekse spørringer, regulære uttrykk og mer.

Rask søkeytelse er takket være [FTS5](https://www.sqlite.org/fts5.html) og [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Vi lagrer `Date`-verdier i SQLite-postboksene som [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strenger via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (med UTC-tidssone for at likhetssammenligninger skal fungere ordentlig).

Indekser lagres også for alle egenskaper som er i søk.

### Prosjekter {#projects}

Her er en tabell som viser prosjekter vi bruker i kildekoden og utviklingsprosessen vår (sortert alfabetisk):

| Prosjekt | Hensikt |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps-automatiseringsplattform for enkel vedlikehold, skalering og administrasjon av hele serverflåten vår. |
| [Bree](https://github.com/breejs/bree) | Jobbplanlegger for Node.js og JavaScript med cron, dates, ms, later og brukervennlig støtte. |
| [Cabin](https://github.com/cabinjs/cabin) | Utviklervennlig JavaScript- og Node.js-loggbibliotek med sikkerhet og personvern i tankene. |
| [Lad](https://github.com/ladjs/lad) | Node.js-rammeverket som driver hele arkitekturen og ingeniørdesignet vårt med MVC og mer. |
| [MongoDB](https://www.mongodb.com/) | NoSQL-databaseløsning som vi bruker til å lagre alle andre data utenfor postbokser (f.eks. kontoen din, innstillinger, domener og aliaskonfigurasjoner). |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB objektdokumentmodellering ("ODM") som vi bruker på tvers av hele stakken vår. Vi skrev spesielle hjelpere som lar oss fortsette å bruke **Mongoose med SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js er et åpen kildekode- og plattformuavhengig JavaScript-kjøretidsmiljø som kjører alle serverprosessene våre. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js-pakke for å sende e-post, opprette forbindelser og mer. Vi er en offisiell sponsor av dette prosjektet. |
| [Redis](https://redis.io/) | Minnebasert database for mellomlagring, publiserings-/abonnementskanaler og DNS over HTTPS-forespørsler. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Krypteringsutvidelse for SQLite for å tillate kryptering av hele databasefiler (inkludert write-ahead-loggen ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visuell SQLite-editor (som du også kan bruke) for å teste, laste ned og vise utviklingspostbokser. |
| [SQLite](https://www.sqlite.org/about.html) | Innebygd databaselag for skalerbar, selvstendig, rask og robust IMAP-lagring. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js verktøy for anti-spam, e-postfiltrering og phishing-forebygging (vårt alternativ til [Spam Assassin](https://spamassassin.apache.org/) og [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | DNS over HTTPS-forespørsler med Node.js og mellomlagring ved hjelp av Redis – som sikrer global konsistens og mye mer. |
| [Thunderbird](https://www.thunderbird.net/) | Utviklingsteamet vårt bruker dette (og anbefaler også dette) som **den foretrukne e-postklienten å bruke med videresendt e-post**. |
| [UTM](https://github.com/utmapp/UTM) | Utviklingsteamet vårt bruker denne metoden for å lage virtuelle maskiner for iOS og macOS for å teste forskjellige e-postklienter (parallelt) med IMAP- og SMTP-serverne våre. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderne Linux-basert serveroperativsystem med åpen kildekode som driver all vår infrastruktur. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP-serverbibliotek – se merknadene om [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) og [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Raskt og enkelt API-bibliotek for Node.js for å samhandle programmatisk med SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Utviklervennlig e-postrammeverk for å opprette, forhåndsvise og sende tilpassede e-poster (f.eks. kontovarsler og mer). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL-spørringsbygger med syntaks i Mongo-stil. Dette sparer utviklingsteamet vårt tid siden vi kan fortsette å skrive i Mongo-stil på tvers av hele stakken med en databaseagnostisk tilnærming. **Det bidrar også til å unngå SQL-injeksjonsangrep ved å bruke spørreparametere.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL-verktøy for å hente ut informasjon om eksisterende databaseskjemaer. Dette lar oss enkelt validere at alle indekser, tabeller, kolonner, begrensninger og mer er gyldige og er `1:1` slik de skal være. Vi skrev til og med automatiserte hjelpere for å legge til nye kolonner og indekser hvis det gjøres endringer i databaseskjemaer (med ekstremt detaljerte feilvarsler også). |
| [knex](https://github.com/knex/knex) | SQL-spørringsbygger som vi kun bruker for databasemigreringer og skjemavalidering gjennom `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatisk [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)-fraseoversettelse med støtte for Markdown ved bruk av [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js-pakken for å løse og opprette tilkoblinger med MX-servere og håndtere feil. |
| [pm2](https://github.com/Unitech/pm2) | Node.js produksjonsprosessbehandler med innebygd lastfordeler ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) for ytelse). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP-serverbibliotek – vi bruker dette til våre e-postutvekslings- ("MX") og utgående SMTP-servere. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Nyttig verktøy for testing av IMAP-servere mot benchmarks og RFC-spesifikasjon for IMAP-protokollkompatibilitet. Dette prosjektet ble laget av [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-teamet (en aktiv åpen kildekode-IMAP- og POP3-server fra juli 2002). Vi testet IMAP-serveren vår grundig med dette verktøyet. |

> Du finner andre prosjekter vi bruker i [kildekoden vår på GitHub](https://github.com/forwardemail).

### Leverandører {#providers}

| Leverandør | Hensikt |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-leverandør, helsesjekker, lastfordelere og sikkerhetskopiering av lagring ved hjelp av [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikert serverhosting og administrerte databaser. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dedikert serverhosting. |
| [DataPacket](https://www.datapacket.com) | Dedikert serverhosting. |

## Tanker {#thoughts}

### Prinsipper {#principles}

Videresendt e-post er utformet i henhold til disse prinsippene:

1. Vær alltid utviklervennlig, sikkerhets- og personvernfokusert og transparent.

2. Følg [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Tolv faktor](https://12factor.net/), [Occams barberhøvel](https://en.wikipedia.org/wiki/Occam%27s_razor) og [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Rett deg mot utviklere med dårlige funksjoner, bootstrapp-utviklere og [ramen-lønnsom](http://www.paulgraham.com/ramenprofitable.html)-utviklere.

### Eksperimenter {#experiments}

> **tldr;** Det er ikke teknisk mulig å bruke S3-kompatibel objektlagring og/eller virtuelle tabeller av ytelsesgrunner, og det er utsatt for feil på grunn av minnebegrensninger.

Vi har gjort noen eksperimenter som har ført opp til vår endelige SQLite-løsning, som omtalt ovenfor.

En av disse var å prøve å bruke [rclone]() og SQLite sammen med et S3-kompatibelt lagringslag.

Dette eksperimentet førte til at vi bedre forsto og oppdaget kanttilfeller rundt bruk av rclone, SQLite og [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Hvis du aktiverer `--vfs-cache-mode writes`-flagget med rclone, vil lesing gå bra, men skriving vil bli mellomlagret.
* Hvis du har flere IMAP-servere distribuert globalt, vil mellomlagringen være av på tvers av dem, med mindre du har én enkelt skriver og flere lyttere (f.eks. en pub/sub-tilnærming).
* Dette er utrolig komplekst, og å legge til ytterligere kompleksitet som dette vil resultere i flere enkeltfeilpunkter.
* S3-kompatible lagringsleverandører støtter ikke delvise filendringer – noe som betyr at enhver endring av `.sqlite`-filen vil resultere i en fullstendig endring og ny opplasting av databasen.
* Andre løsninger som `rsync` finnes, men de fokuserer ikke på støtte for write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – så vi endte opp med å gjennomgå Litestream. Heldigvis krypterer krypteringsbruken vår allerede [WAL](https://www.sqlite.org/wal.html)-filene for oss, så vi trenger ikke å stole på Litestream for det. Vi var imidlertid ikke trygge på Litestream for produksjonsbruk ennå, og har noen merknader om det nedenfor.
* Bruk av dette alternativet `--vfs-cache-mode writes` (den *eneste* måten å bruke SQLite over `rclone` for skriving) vil forsøke å kopiere hele databasen fra bunnen av til minnet – det er greit å håndtere én postboks på 10 GB, men håndtering av flere postbokser med ekstremt høy lagringsplass vil føre til at IMAP-serverne får minnebegrensninger og `ENOMEM`-feil, segmenteringsfeil og datakorrupsjon.

* Hvis du prøver å bruke SQLite [Virtuelle tabeller](https://www.sqlite.org/vtab.html) (f.eks. ved å bruke [s3db](https://github.com/jrhy/s3db)) for å ha data live på et S3-kompatibelt lagringslag, vil du støte på flere problemer:

* Lesing og skriving vil være ekstremt treg ettersom S3 API-endepunkter må nås med HTTP `.sqlite`0-, `.sqlite`1-, `.sqlite`2- og `.sqlite`3-metodene.

* Utviklingstester viste at det å overskride 500 000–1 000 poster på fiberinternett fortsatt er begrenset av gjennomstrømningen for skriving og lesing til S3-kompatible leverandører. For eksempel kjørte utviklerne våre `.sqlite`4-løkker for å utføre både sekvensielle SQL `.sqlite`5-setninger og løkker som skrev store mengder data i bulk. I begge tilfeller var ytelsen svimlende treg.

* Virtuelle tabeller **kan ikke ha indekser**, `.sqlite`6-setninger og `.sqlite`7 `.sqlite`8 – noe som fører til forsinkelser på opptil 1–2 minutter eller mer, avhengig av datamengden.

* Objekter ble lagret ukryptert, og ingen innebygd krypteringsstøtte er lett tilgjengelig.

* Vi utforsket også bruk av `.sqlite`9, som konseptuelt og teknisk sett ligner på forrige punkt (så det har de samme problemene). En mulighet ville være å bruke en tilpasset `rsync`0-bygg pakket inn med kryptering, for eksempel `rsync`1 (som vi for øyeblikket bruker i løsningen vår ovenfor) gjennom `rsync`2.
* En annen potensiell tilnærming var å bruke `rsync`3, men dette har en begrensning på 32 GB og ville kreve komplekse byggings- og utviklingsproblemer.
* `rsync`4-setninger er nødvendige (så dette utelukker fullstendig bruk av virtuelle tabeller). Vi trenger `rsync`5-setninger for at vår hook med `rsync`6 skal fungere ordentlig – noe som sikrer at data ikke blir ødelagt og at hentede rader kan konverteres til gyldige dokumenter i henhold til våre `rsync`7-skjemadefinisjoner (som inkluderer begrensning, variabeltype og vilkårlig datavalidering).
* Nesten alle S3-kompatible prosjekter relatert til SQLite i åpen kildekode-fellesskapet er i Python (og ikke JavaScript, som vi bruker for 100 % av stacken vår).

* Kompresjonsbiblioteker som `rsync`8 (se `rsync`9) ser lovende ut, men __PROTECTED_LINK_189__0. I stedet vil applikasjonssidekomprimering på datatyper som __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 og __PROTECTED_LINK_189__6 være en renere og enklere tilnærming (og er også enklere å migrere, siden vi kan lagre et __PROTECTED_LINK_189__7-flagg eller en kolonne – eller til og med bruke __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 for komprimering eller __PROTECTED_LINK_190__0 uten komprimering som databasemetadata).

* Heldigvis har vi allerede deduplisering av vedlegg implementert i IMAP-serverlagringen vår – derfor vil ikke hver melding med samme vedlegg beholde en kopi av vedlegget – i stedet lagres et enkelt vedlegg for flere meldinger og tråder i en postboks (og en utenlandsk referanse brukes deretter).
* Prosjektet Litestream, som er en SQLite-replikerings- og sikkerhetskopieringsløsning, er svært lovende, og vi vil mest sannsynlig bruke det i fremtiden.
* Ikke for å diskreditere forfatteren(e) – fordi vi elsker arbeidet deres og bidragene til åpen kildekode i godt over et tiår nå – men fra praktisk bruk ser det ut til at det finnes __PROTECTED_LINK_190__1 og __PROTECTED_LINK_190__2.
* Gjenoppretting av sikkerhetskopier må være friksjonsfritt og trivielt. Å bruke en løsning som MongoDB med __PROTECTED_LINK_190__3 og __PROTECTED_LINK_190__4 er ikke bare kjedelig, men også tidkrevende og har konfigurasjonskompleksitet.
* SQLite-databaser gjør det enkelt (det er én enkelt fil).
* Vi ønsket å designe en løsning der brukere kunne ta postkassen sin og forlate den når som helst.
* Enkle Node.js-kommandoer til __PROTECTED_LINK_190__5, og den slettes permanent fra disklagring.
* Vi kan på lignende måte bruke et S3-kompatibelt API med HTTP __PROTECTED_LINK_190__6 for å enkelt fjerne snapshots og sikkerhetskopier for brukere.

* SQLite var den enkleste, raskeste og mest kostnadseffektive løsningen.

### Mangel på alternativer {#lack-of-alternatives}

Så vidt vi vet er ingen andre e-posttjenester utformet på denne måten, og de er heller ikke åpen kildekode.

Vi *tror dette kan skyldes* at eksisterende e-posttjenester har eldre teknologi i produksjon med [spaghettikode](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De fleste, om ikke alle, eksisterende e-postleverandører er enten lukket kildekode eller annonserer som åpen kildekode, **men i virkeligheten er det bare front-end-en deres som er åpen kildekode.**

**Den mest sensitive delen av e-post** (den faktiske lagringen/IMAP/SMTP-interaksjonen) **gjøres på back-end (serveren), og *ikke* på front-end (klienten)**.

### Prøv videresending av e-post {#try-out-forward-email}

Registrer deg i dag på <https://forwardemail.net>! :rocket: