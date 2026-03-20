# Kvantesikker e-post: Hvordan vi bruker krypterte SQLite-postbokser for å holde e-posten din trygg {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Sammenligning av e-postleverandører](#email-service-provider-comparison)
* [Hvordan fungerer det](#how-does-it-work)
* [Teknologier](#technologies)
  * [Databaser](#databases)
  * [Sikkerhet](#security)
  * [Postbokser](#mailboxes)
  * [Samtidighet](#concurrency)
  * [Sikkerhetskopier](#backups)
  * [Søk](#search)
  * [Prosjekter](#projects)
  * [Leverandører](#providers)
* [Tankegang](#thoughts)
  * [Prinsipper](#principles)
  * [Eksperimenter](#experiments)
  * [Mangel på alternativer](#lack-of-alternatives)
  * [Prøv Forward Email](#try-out-forward-email)


## Forord {#foreword}

> \[!IMPORTANT]
> Vår e-posttjeneste er [100 % åpen kildekode](https://github.com/forwardemail) og personvernfokusert gjennom sikre og krypterte SQLite-postbokser.

Frem til vi lanserte [IMAP-støtte](/faq#do-you-support-receiving-email-with-imap), brukte vi MongoDB for våre behov for vedvarende datalagring.

Denne teknologien er fantastisk, og vi bruker den fortsatt i dag – men for å ha kryptering i ro med MongoDB må du bruke en leverandør som tilbyr MongoDB Enterprise, som Digital Ocean eller Mongo Atlas – eller betale for en enterprise-lisens (og deretter måtte forholde deg til salgsavdelingens responstid).

Vårt team hos [Forward Email](https://forwardemail.net) trengte en utviklervennlig, skalerbar, pålitelig og kryptert lagringsløsning for IMAP-postbokser. Som utviklere av åpen kildekode var det i strid med [våre prinsipper](#principles) å bruke en teknologi som krever lisensavgift for å få kryptering i ro – derfor eksperimenterte, forsket og utviklet vi en ny løsning fra bunnen av for å dekke disse behovene.

I stedet for å bruke en delt database for å lagre postboksene dine, lagrer og krypterer vi hver enkelt postboks med ditt passord (som kun du har).  **Vår e-posttjeneste er så sikker at hvis du glemmer passordet ditt, mister du postboksen din** (og må gjenopprette med offline sikkerhetskopier eller starte på nytt).

Fortsett å lese mens vi går i dybden med en [sammenligning av e-postleverandører](#email-service-provider-comparison), [hvordan tjenesten vår fungerer](#how-does-it-work), [vår teknologistabel](#technologies) og mer.


## Sammenligning av e-postleverandører {#email-service-provider-comparison}

Vi er den eneste 100 % åpen kildekode og personvernfokuserte e-postleverandøren som lagrer individuelt krypterte SQLite-postbokser, tilbyr ubegrensede domener, aliaser og brukere, og har støtte for utgående SMTP, IMAP og POP3:

**I motsetning til andre e-postleverandører trenger du ikke betale for lagring per domene eller alias med Forward Email.** Lagringen deles på tvers av hele kontoen din – så hvis du har flere egendefinerte domenenavn og flere aliaser på hvert, er vi den perfekte løsningen for deg. Merk at du fortsatt kan sette lagringsgrenser om ønskelig per domene eller alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Les sammenligning av e-posttjenester <i class="fa fa-search-plus"></i></a>


## Hvordan fungerer det {#how-does-it-work}

1. Ved å bruke e-postklienten din som Apple Mail, Thunderbird, Gmail eller Outlook – kobler du til våre sikre [IMAP](/faq#do-you-support-receiving-email-with-imap)-servere med brukernavn og passord:

   * Brukernavnet ditt er ditt fulle alias med domenet ditt, for eksempel `hello@example.com`.
   * Passordet ditt genereres tilfeldig og vises kun i 30 sekunder når du klikker <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser.
2. Når du er tilkoblet, vil e-postklienten din sende [IMAP-protokollkommandoer](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) til vår IMAP-server for å holde postboksen din synkronisert. Dette inkluderer å skrive og lagre utkast til e-poster og andre handlinger du måtte gjøre (f.eks. merke en e-post som Viktig eller flagge en e-post som Søppelpost/Spam).

3. E-postutvekslingsservere (ofte kalt "MX"-servere) mottar ny innkommende e-post og lagrer den i postboksen din. Når dette skjer, vil e-postklienten din bli varslet og synkronisere postboksen din. Våre e-postutvekslingsservere kan videresende e-posten din til en eller flere mottakere (inkludert [webhooks](/faq#do-you-support-webhooks)), lagre e-posten din for deg i din krypterte IMAP-lagring hos oss, **eller begge deler**!

   > \[!TIP]
   > Interessert i å lære mer? Les [hvordan sette opp e-postvideresending](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hvordan vår e-postutvekslingstjeneste fungerer](/faq#how-does-your-email-forwarding-system-work), eller se [våre guider](/guides).

4. Bak kulissene fungerer vår sikre e-postlagringsdesign på to måter for å holde postboksene dine krypterte og kun tilgjengelige for deg:

   * Når ny e-post mottas for deg fra en avsender, skriver våre e-postutvekslingsservere til en individuell, midlertidig og kryptert postboks for deg.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

   * Når du kobler til vår IMAP-server med e-postklienten din, blir passordet ditt kryptert i minnet og brukt til å lese og skrive til postboksen din. Postboksen din kan kun leses fra og skrives til med dette passordet. Husk at siden du er den eneste med dette passordet, kan **kun du** lese og skrive til postboksen når du får tilgang til den. Neste gang e-postklienten din prøver å hente e-post eller synkroniserer, vil de nye meldingene dine bli overført fra denne midlertidige postboksen og lagret i din faktiske postboksfil ved bruk av det oppgitte passordet. Merk at denne midlertidige postboksen blir tømt og slettet etterpå slik at kun din passordbeskyttede postboks har meldingene.

   * **Hvis du er tilkoblet IMAP (f.eks. ved bruk av en e-postklient som Apple Mail eller Thunderbird), trenger vi ikke å skrive til midlertidig disklagring. Ditt krypterte IMAP-passord i minnet hentes og brukes i stedet. I sanntid, når en melding forsøker å leveres til deg, sender vi en WebSocket-forespørsel til alle IMAP-servere for å spørre om de har en aktiv økt for deg (dette er hentingen), og deretter vil vi videreformidle det krypterte passordet i minnet – slik at vi ikke trenger å skrive til en midlertidig postboks, vi kan skrive til din faktiske krypterte postboks ved bruk av ditt krypterte passord.**

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

5. [Sikkerhetskopier av dine krypterte postbokser](#backups) tas daglig. Du kan også når som helst be om en ny sikkerhetskopi eller laste ned den nyeste sikkerhetskopien fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias. Hvis du bestemmer deg for å bytte til en annen e-posttjeneste, kan du enkelt migrere, laste ned, eksportere og slette postboksene og sikkerhetskopiene dine når som helst.


## Teknologier {#technologies}

### Databaser {#databases}

Vi utforsket andre mulige lagringslag for databaser, men ingen tilfredsstilte kravene våre like godt som SQLite gjorde:
| Database                                               |                                                                    Kryptering i ro                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) postbokser  |                           Lisens                           | [Brukt overalt](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ja med [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Tilgjengelig kun i MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relasjonsdatabase                               |                   :x: AGPL og `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Kun nettverk](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relasjonsdatabase                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Utestet og ikke støttet ennå?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Utestet og ikke støttet ennå?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ja](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relasjonsdatabase                               | :white_check_mark: `PostgreSQL` (lik `BSD` eller `MIT`)    |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Kun for InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relasjonsdatabase                               |          :white_check_mark: `GPLv2` og `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Kun Enterprise-funksjon](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relasjonsdatabase                               |                  :x: `BUSL-1.1` og andre                    |                             :x:                             |

> Her er et [blogginnlegg som sammenligner flere SQLite-database lagringsalternativer](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) i tabellen over.

### Sikkerhet {#security}

Til enhver tid bruker vi [kryptering i ro](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [kryptering under overføring](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ved bruk av :tangerine: [Tangerine](https://tangeri.ne), og [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) kryptering på postbokser. I tillegg bruker vi token-basert tofaktorautentisering (i motsetning til SMS som er utsatt for [man-in-the-middle-angrep](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), roterte SSH-nøkler med deaktivert root-tilgang, eksklusiv tilgang til servere gjennom begrensede IP-adresser, og mer.
I tilfelle et [evil maid-angrep](https://en.wikipedia.org/wiki/Evil_maid_attack) eller en illojal ansatt fra en tredjepartsleverandør, **kan postboksen din fortsatt kun åpnes med ditt genererte passord**. Vær trygg på at vi ikke er avhengige av noen tredjepartsleverandører annet enn våre SOC Type 2-kompatible serverleverandører Cloudflare, DataPacket, Digital Ocean, GitHub og Vultr.

Målet vårt er å ha så få [single point of failures](https://en.wikipedia.org/wiki/Single_point_of_failure) som mulig.

### Postbokser {#mailboxes}

> **tldr;** Våre IMAP-servere bruker individuelt krypterte SQLite-databaser for hver av postboksene dine.

[SQLite er en ekstremt populær](https://www.sqlite.org/mostdeployed.html) innebygd database – den kjører for øyeblikket på telefonen og datamaskinen din – [og brukes av nesten alle store teknologier](https://www.sqlite.org/famous.html).

For eksempel, på våre krypterte servere finnes det en SQLite-databasepostboks for `linux@example.com`, `info@example.com`, `hello@example.com` og så videre – én for hver som en `.sqlite` databasefil. Vi navngir heller ikke databasefilene med e-postadressen – i stedet bruker vi BSON ObjectID og unike UUID-er som genereres, som ikke avslører hvem postboksen tilhører eller hvilken e-postadresse den er knyttet til (f.eks. `353a03f21e534321f5d6e267.sqlite`).

Hver av disse databasene er kryptert med ditt passord (som kun du har) ved hjelp av [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Dette betyr at postboksene dine er individuelt krypterte, selvstendige, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) og portable.

Vi har finjustert SQLite med følgende [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Formål                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite databasekryptering](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Se `better-sqlite3-multiple-ciphers` under [Projects](#projects) for mer innsikt.                                         |
| `key="****************"` | Dette er ditt dekrypterte passord kun i minnet som sendes gjennom e-postklientens IMAP-tilkobling til vår server. Nye databaseinstanser opprettes og lukkes for hver lese- og skrivesesjon (for å sikre sandboxing og isolasjon).                        |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [som øker ytelsen og tillater samtidig lese-tilgang](https://litestream.io/tips/#wal-journal-mode).                                                                                           |
| `busy_timeout=5000`      | Forhindrer skrive-låsefeil [mens andre skriver operasjoner pågår](https://litestream.io/tips/#busy-timeout).                                                                                                                                              |
| `synchronous=NORMAL`     | Øker holdbarheten til transaksjoner [uten risiko for datakorrupsjon](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                     |
| `foreign_keys=ON`        | Sørger for at fremmednøkler (f.eks. en relasjon fra en tabell til en annen) håndheves. [Dette er som standard ikke aktivert i SQLite](https://www.sqlite.org/foreignkeys.html), men for validering og dataintegritet bør det være aktivert.               |
| `encoding='UTF-8'`       | [Standard koding](https://www.sqlite.org/pragma.html#pragma_encoding) som brukes for å sikre utviklerfornuft.                                                                                                                                                |
> Alle andre standardinnstillinger er fra SQLite som spesifisert i den [offisielle PRAGMA-dokumentasjonen](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samtidighet {#concurrency}

> **kort oppsummert;** Vi bruker `WebSocket` for samtidige lesinger og skrivinger til dine krypterte SQLite-postbokser.

#### Lesinger {#reads}

E-postklienten din på telefonen kan løse `imap.forwardemail.net` til en av våre Digital Ocean IP-adresser – og skrivebords-klienten din kan løse en annen IP fra en annen [leverandør](#providers) helt separat.

Uansett hvilken IMAP-server e-postklienten din kobler til, ønsker vi at tilkoblingen skal lese fra databasen din i sanntid med 100 % nøyaktighet. Dette gjøres gjennom WebSockets.

#### Skrivinger {#writes}

Skriving til databasen din er litt annerledes – siden SQLite er en innebygd database og postboksen din som standard ligger i én enkelt fil.

Vi hadde utforsket alternativer som `litestream`, `rqlite` og `dqlite` nedenfor – men ingen av disse tilfredsstilte våre krav.

For å utføre skrivinger med write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") aktivert – må vi sikre at kun én server ("Primær") er ansvarlig for dette.  [WAL](https://www.sqlite.org/wal.html) øker samtidig tilgang betydelig og tillater én skriver og flere lesere.

Primærserveren kjører på dataserverne med monterte volumer som inneholder de krypterte postboksene. Fra et distribusjonsperspektiv kan du betrakte alle de individuelle IMAP-serverne bak `imap.forwardemail.net` som sekundære servere ("Sekundær").

Vi oppnår toveis kommunikasjon med [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primærservere bruker en instans av [ws](https://github.com/websockets/ws)'s `WebSocketServer`-server.
* Sekundærservere bruker en instans av [ws](https://github.com/websockets/ws)'s `WebSocket`-klient som er pakket inn med [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) og [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Disse to wrapperne sikrer at `WebSocket` kobler til på nytt og kan sende og motta data for spesifikke database-skrivinger.

### Sikkerhetskopier {#backups}

> **kort oppsummert;** Sikkerhetskopier av dine krypterte postbokser tas daglig. Du kan også umiddelbart be om en ny sikkerhetskopi eller laste ned den nyeste sikkerhetskopien når som helst fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias.

For sikkerhetskopier kjører vi ganske enkelt SQLite-kommandoen `VACUUM INTO` hver dag under IMAP-kommando-behandling, som benytter ditt krypterte passord fra en IMAP-tilkobling i minnet. Sikkerhetskopier lagres hvis ingen eksisterende sikkerhetskopi oppdages eller hvis [SHA-256](https://en.wikipedia.org/wiki/SHA-2)-hashen har endret seg på filen sammenlignet med den nyeste sikkerhetskopien.

Merk at vi bruker `VACUUM INTO`-kommandoen i stedet for den innebygde `backup`-kommandoen fordi hvis en side endres under en `backup`-operasjon, må den starte på nytt. `VACUUM INTO`-kommandoen tar et øyeblikksbilde. Se disse kommentarene på [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) og [Hacker News](https://news.ycombinator.com/item?id=31387556) for mer innsikt.

I tillegg bruker vi `VACUUM INTO` i stedet for `backup`, fordi `backup`-kommandoen ville etterlate databasen ukryptert i en kort periode inntil `rekey` blir kalt (se denne GitHub-[kommentaren](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) for innsikt).

Sekundærserveren vil instruere Primærserveren over `WebSocket`-tilkoblingen til å utføre sikkerhetskopien – og Primærserveren vil deretter motta kommandoen og deretter:

1. Koble til din krypterte postboks.
2. Skaffe en skrive-lås.
3. Kjøre en WAL-sjekkpunkt via `wal_checkpoint(PASSIVE)`.
4. Kjøre SQLite-kommandoen `VACUUM INTO`.
5. Sikre at den kopierte filen kan åpnes med det krypterte passordet (sikkerhetsmekanisme).
6. Laste den opp til Cloudflare R2 for lagring (eller din egen leverandør hvis spesifisert).
<!--
7. Komprimer den resulterende sikkerhetskopifilen med `gzip`.
8. Last den opp til Cloudflare R2 for lagring (eller din egen leverandør hvis spesifisert).
-->

Husk at postkassene dine er kryptert – og selv om vi har IP-begrensninger og andre autentiseringstiltak på plass for WebSocket-kommunikasjon – i tilfelle en ondsinnet aktør, kan du være trygg på at med mindre WebSocket-payloaden har ditt IMAP-passord, kan den ikke åpne databasen din.

Det lagres kun én sikkerhetskopi per postkasse for øyeblikket, men i fremtiden kan vi tilby punkt-i-tid-gjenoppretting ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Søk {#search}

Våre IMAP-servere støtter `SEARCH`-kommandoen med komplekse spørringer, regulære uttrykk og mer.

Rask søkeytelse skyldes [FTS5](https://www.sqlite.org/fts5.html) og [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Vi lagrer `Date`-verdier i SQLite-postkassene som [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strenger via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (med UTC tidssone for at likhets-sammenligninger skal fungere riktig).

Indekser lagres også for alle egenskaper som er i søkespørringer.

### Prosjekter {#projects}

Her er en tabell som skisserer prosjekter vi bruker i vår kildekode og utviklingsprosess (sortert alfabetisk):

| Prosjekt                                                                                     | Formål                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Ansible](https://www.ansible.com/)                                                         | DevOps-automatiseringsplattform for å vedlikeholde, skalere og administrere hele serverflåten vår med letthet.                                                                                                                                                                                                                                                     |
| [Bree](https://github.com/breejs/bree)                                                      | Jobbplanlegger for Node.js og JavaScript med cron, datoer, ms, later og brukervennlig støtte.                                                                                                                                                                                                                                                                      |
| [Cabin](https://github.com/cabinjs/cabin)                                                   | Utviklervennlig JavaScript- og Node.js-loggerbibliotek med sikkerhet og personvern i tankene.                                                                                                                                                                                                                                                                       |
| [Lad](https://github.com/ladjs/lad)                                                         | Node.js-rammeverk som driver hele vår arkitektur og ingeniørdesign med MVC og mer.                                                                                                                                                                                                                                                                                 |
| [MongoDB](https://www.mongodb.com/)                                                         | NoSQL-databaseløsning som vi bruker for å lagre all annen data utenfor postkasser (f.eks. din konto, innstillinger, domener og alias-konfigurasjoner).                                                                                                                                                                                                              |
| [Mongoose](https://github.com/Automattic/mongoose)                                          | MongoDB objekt-dokumentmodellering ("ODM") som vi bruker på tvers av hele stacken vår. Vi har skrevet spesielle hjelpere som lar oss enkelt fortsette å bruke **Mongoose med SQLite** :tada:                                                                                                                                                                      |
| [Node.js](https://nodejs.org/en)                                                            | Node.js er det åpen kildekode, plattformuavhengige JavaScript-runtime-miljøet som kjører alle våre serverprosesser.                                                                                                                                                                                                                                                |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                      | Node.js-pakke for å sende e-poster, opprette tilkoblinger og mer. Vi er en offisiell sponsor av dette prosjektet.                                                                                                                                                                                                                                                 |
| [Redis](https://redis.io/)                                                                  | In-memory database for caching, publish/subscribe-kanaler og DNS over HTTPS-forespørsler.                                                                                                                                                                                                                                                                         |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                  | Krypteringstillegg for SQLite som tillater at hele databasefiler krypteres (inkludert write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                                           |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                 | Visuell SQLite-editor (som du også kan bruke) for å teste, laste ned og vise utviklingspostkasser.                                                                                                                                                                                                                                                                 |
| [SQLite](https://www.sqlite.org/about.html)                                                 | Innebygd databasenivå for skalerbar, selvstendig, rask og robust IMAP-lagring.                                                                                                                                                                                                                                                                                    |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                  | Node.js anti-spam, e-postfiltrering og phishing-forebyggingsverktøy (vårt alternativ til [Spam Assassin](https://spamassassin.apache.org/) og [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                          |
| [Tangerine](https://tangeri.ne)                                                             | DNS over HTTPS-forespørsler med Node.js og caching ved bruk av Redis – som sikrer global konsistens og mye mer.                                                                                                                                                                                                                                                   |
| [Thunderbird](https://www.thunderbird.net/)                                                 | Vårt utviklingsteam bruker dette (og anbefaler det også) som **den foretrukne e-postklienten å bruke med Forward Email**.                                                                                                                                                                                                                                          |
| [UTM](https://github.com/utmapp/UTM)                                                        | Vårt utviklingsteam bruker dette for å lage virtuelle maskiner for iOS og macOS for å teste forskjellige e-postklienter (parallelt) med våre IMAP- og SMTP-servere.                                                                                                                                                                                                |
| [Ubuntu](https://ubuntu.com/download/server)                                                | Moderne åpen kildekode Linux-basert serveroperativsystem som driver all vår infrastruktur.                                                                                                                                                                                                                                                                         |
| [WildDuck](https://github.com/nodemailer/wildduck)                                          | IMAP-serverbibliotek – se notatene om [vedleggsduplisering](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) og [IMAP-protokollstøtte](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                              |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Raskt og enkelt API-bibliotek for Node.js for å samhandle med SQLite3 programmessig.                                                                                                                                                                                                                                                                               |
| [email-templates](https://github.com/forwardemail/email-templates)                          | Utviklervennlig e-postrammeverk for å lage, forhåndsvise og sende tilpassede e-poster (f.eks. kontovarsler og mer).                                                                                                                                                                                                                                               |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                      | SQL-spørringsbygger med Mongo-stil syntaks. Dette sparer utviklingsteamet vårt tid siden vi kan fortsette å skrive i Mongo-stil på tvers av hele stacken med en database-agnostisk tilnærming. **Det hjelper også med å unngå SQL-injeksjonsangrep ved å bruke spørringsparametere.**                                                                             |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                      | SQL-verktøy for å hente informasjon om eksisterende databaseskjema. Dette lar oss enkelt validere at alle indekser, tabeller, kolonner, begrensninger og mer er gyldige og er `1:1` med hvordan de skal være. Vi har til og med skrevet automatiserte hjelpere for å legge til nye kolonner og indekser hvis det gjøres endringer i databaseskjemaer (med svært detaljert feilmelding også). |
| [knex](https://github.com/knex/knex)                                                      | SQL-spørringsbygger som vi kun bruker for databasemigrasjoner og skjema-validering gjennom `knex-schema-inspector`.                                                                                                                                                                                                                                               |
| [mandarin](https://github.com/ladjs/mandarin)                                             | Automatisk [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) fraseoversettelse med støtte for Markdown ved bruk av [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                 |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                       | Node.js-pakke for å løse og etablere tilkoblinger med MX-servere og håndtere feil.                                                                                                                                                                                                                                                                                |
| [pm2](https://github.com/Unitech/pm2)                                                     | Node.js produksjonsprosessbehandler med innebygd lastbalanserer ([finjustert](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) for ytelse).                                                                                                                                                                                                     |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                  | SMTP-serverbibliotek – vi bruker dette for våre mail exchange ("MX") og utgående SMTP-servere.                                                                                                                                                                                                                                                                     |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                             | Nyttig verktøy for å teste IMAP-servere mot benchmarks og RFC-spesifikasjon for IMAP-protokollkompatibilitet. Dette prosjektet ble opprettet av [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-teamet (en aktiv åpen kildekode IMAP- og POP3-server fra juli 2002). Vi testet vår IMAP-server grundig med dette verktøyet.                              |
> Du kan finne andre prosjekter vi bruker i [vår kildekode på GitHub](https://github.com/forwardemail).

### Leverandører {#providers}

| Leverandør                                      | Formål                                                                                                                       |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS-leverandør, helsesjekker, lastbalanserere og backup-lagring ved bruk av [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Vert for kildekode, CI/CD og prosjektstyring.                                                                               |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikert serverhosting og administrerte databaser.                                                                           |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Dedikert serverhosting.                                                                                                      |
| [DataPacket](https://www.datapacket.com)        | Dedikert serverhosting.                                                                                                      |


## Tanker {#thoughts}

### Prinsipper {#principles}

Forward Email er designet i henhold til disse prinsippene:

1. Alltid være utviklervennlig, sikkerhets- og personvernfokusert, og transparent.
2. Følge [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), og [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Målrette den ressurssterke, selvfinansierte og [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) utvikleren

### Eksperimenter {#experiments}

> **tldr;** Til syvende og sist er bruk av S3-kompatibel objektlagring og/eller Virtuelle Tabeller ikke teknisk gjennomførbart av ytelsesårsaker og utsatt for feil på grunn av minnebegrensninger.

Vi har gjort noen eksperimenter som ledet frem til vår endelige SQLite-løsning som diskutert ovenfor.

Et av disse var å prøve å bruke [rclone]() og SQLite sammen med et S3-kompatibelt lagringslag.

Dette eksperimentet førte til at vi forsto og oppdaget kanttilfeller rundt rclone, SQLite og [VFS](https://en.wikipedia.org/wiki/Virtual_file_system)-bruk:

* Hvis du aktiverer `--vfs-cache-mode writes`-flagget med rclone, vil lesing fungere greit, men skrivinger vil bli bufret.
  * Hvis du har flere IMAP-servere distribuert globalt, vil cachen være ulik på tvers av dem med mindre du har én skriver og flere lyttere (f.eks. en pub/sub-tilnærming).
  * Dette er utrolig komplekst, og å legge til ytterligere kompleksitet som dette vil føre til flere enkeltfeilpunkter.
  * S3-kompatible lagringsleverandører støtter ikke delvise filendringer – noe som betyr at enhver endring av `.sqlite`-filen vil resultere i en fullstendig endring og opplasting av databasen.
  * Andre løsninger som `rsync` finnes, men de er ikke fokusert på write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") støtte – så vi endte opp med å vurdere Litestream. Heldigvis krypterer vår bruk allerede [WAL](https://www.sqlite.org/wal.html)-filene for oss, så vi trenger ikke å stole på Litestream for det. Vi var imidlertid ikke helt sikre på Litestream for produksjonsbruk og har noen notater nedenfor om det.
  * Bruk av denne `--vfs-cache-mode writes`-opsjonen (den *eneste* måten å bruke SQLite over `rclone` for skriving) vil forsøke å kopiere hele databasen fra bunnen av i minnet – håndtering av én 10 GB postkasse er OK, men håndtering av flere postkasser med svært høy lagring vil føre til at IMAP-serverne støter på minnebegrensninger og `ENOMEM`-feil, segmenteringsfeil og datakorrupsjon.
* Hvis du forsøker å bruke SQLite [Virtuelle Tabeller](https://www.sqlite.org/vtab.html) (f.eks. ved bruk av [s3db](https://github.com/jrhy/s3db)) for å ha data lagret på et S3-kompatibelt lagringslag, vil du støte på flere problemer:
  * Lesing og skriving vil være ekstremt tregt da S3 API-endepunkter må treffes med HTTP `GET`, `PUT`, `HEAD` og `POST` metoder.
  * Utviklingstester viste at overskridelse av 500K-1M+ poster på fiberinternett fortsatt er begrenset av gjennomstrømningen ved skriving og lesing til S3-kompatible leverandører. For eksempel kjørte våre utviklere `for`-løkker for både sekvensielle SQL `INSERT`-setninger og de som skrev store mengder data i bulk. I begge tilfeller var ytelsen sjokkerende treg.
  * Virtuelle tabeller **kan ikke ha indekser**, `ALTER TABLE`-setninger, og [andre](https://stackoverflow.com/a/12507650) [begrensninger](https://sqlite.org/lang_createvtab.html) – noe som fører til forsinkelser på 1-2 minutter eller mer avhengig av datamengden.
  * Objekter ble lagret ukryptert og ingen innebygd krypteringsstøtte er lett tilgjengelig.
* Vi utforsket også bruk av [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) som er konseptuelt og teknisk likt det forrige punktet (så det har de samme problemene). En mulighet ville være å bruke en tilpasset `sqlite3`-bygging pakket med kryptering som [wxSQLite3](https://github.com/utelle/wxsqlite3) (som vi for øyeblikket bruker i vår løsning ovenfor) gjennom [redigering av setup-filen](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* En annen potensiell tilnærming var å bruke [multiplex-utvidelsen](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), men denne har en begrensning på 32 GB og ville kreve kompleks bygging og utviklingsproblemer.
* `ALTER TABLE`-setninger er nødvendige (så dette utelukker helt bruk av Virtuelle Tabeller). Vi trenger `ALTER TABLE`-setninger for at vår hook med `knex-schema-inspector` skal fungere riktig – noe som sikrer at data ikke blir korrupte og rader hentet kan konverteres til gyldige dokumenter i henhold til våre `mongoose`-skjemadefinisjoner (som inkluderer begrensninger, variabeltype og vilkårlig datavalidering).
* Nesten alle S3-kompatible prosjekter relatert til SQLite i open-source-miljøet er i Python (og ikke JavaScript som vi bruker for 100 % av vår stack).
* Komprimeringsbiblioteker som [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (se [kommentarer](https://news.ycombinator.com/item?id=32303762)) ser lovende ut, men [er kanskje ikke klare for produksjonsbruk ennå](https://github.com/phiresky/sqlite-zstd#usage). I stedet vil applikasjonsbasert komprimering på datatyper som `String`, `Object`, `Map`, `Array`, `Set` og `Buffer` være en renere og enklere tilnærming (og enklere å migrere også, siden vi kunne lagre et `Boolean`-flagg eller kolonne – eller til og med bruke `PRAGMA` `user_version=1` for komprimering eller `user_version=0` for ingen komprimering som databasemetadata).
  * Heldigvis har vi allerede implementert vedleggsduplisering i vår IMAP-serverlagring – derfor vil hver melding med samme vedlegg ikke beholde en kopi av vedlegget – i stedet lagres ett enkelt vedlegg for flere meldinger og tråder i en postkasse (og en fremmedreferanse brukes deretter).
* Prosjektet Litestream, som er en SQLite-replikasjons- og backup-løsning, er veldig lovende og vi vil mest sannsynlig bruke det i fremtiden.
  * Ikke for å diskreditere forfatterne – fordi vi elsker arbeidet deres og bidrag til open-source i over et tiår nå – men fra virkelighetsbruk ser det ut til at det [kan være mange hodepiner](https://github.com/benbjohnson/litestream/issues) og [potensiell datatap ved bruk](https://github.com/benbjohnson/litestream/issues/218).
* Backup-gjenoppretting må være friksjonsfri og enkel. Å bruke en løsning som MongoDB med `mongodump` og `mongoexport` er ikke bare tungvint, men tidkrevende og har konfigurasjonskompleksitet.
  * SQLite-databaser gjør det enkelt (det er en enkelt fil).
  * Vi ønsket å designe en løsning hvor brukere kunne ta med seg postkassen sin og forlate når som helst.
    * Enkle Node.js-kommandoer som `fs.unlink('mailbox.sqlite'))` og den er permanent slettet fra disklagring.
    * Vi kan på samme måte bruke en S3-kompatibel API med HTTP `DELETE` for enkelt å fjerne snapshots og backups for brukere.
  * SQLite var den enkleste, raskeste og mest kostnadseffektive løsningen.
### Mangel på alternativer {#lack-of-alternatives}

Så vidt vi vet, er ingen andre e-posttjenester designet på denne måten, og ingen er open-source.

Vi *tror dette kan skyldes* at eksisterende e-posttjenester har gammel teknologi i produksjon med [spaghettikode](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De fleste, om ikke alle, eksisterende e-postleverandører er enten lukket kildekode eller annonserer seg som open-source, **men i realiteten er det bare front-end som er open-source.**

**Den mest sensitive delen av e-post** (selve lagringen/IMAP/SMTP-interaksjonen) **utføres helt på back-end (server), og *ikke* på front-end (klient).**

### Prøv Forward Email {#try-out-forward-email}

Registrer deg i dag på <https://forwardemail.net>! :rocket:
