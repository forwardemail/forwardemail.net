# Kvantebestandig e-mail: Sådan bruger vi krypterede SQLite-postkasser til at holde din e-mail sikker {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Sammenligning af e-mailudbydere](#email-service-provider-comparison)
* [Hvordan fungerer det](#how-does-it-work)
* [Teknologier](#technologies)
  * [Databaser](#databases)
  * [Sikkerhed](#security)
  * [Postkasser](#mailboxes)
  * [Samtidighed](#concurrency)
  * [Sikkerhedskopier](#backups)
  * [Søge](#search)
  * [Projekter](#projects)
  * [Udbydere](#providers)
* [Tanker](#thoughts)
  * [Principper](#principles)
  * [Eksperimenter](#experiments)
  * [Mangel på alternativer](#lack-of-alternatives)
  * [Prøv at videresende e-mail](#try-out-forward-email)

## Forord {#foreword}

> \[!IMPORTANT]
> Vores e-mailtjeneste er [100% open source](https://github.com/forwardemail) og fokuserer på privatlivets fred via sikre og krypterede SQLite-postkasser.

Indtil vi lancerede [IMAP-understøttelse](/faq#do-you-support-receiving-email-with-imap), brugte vi MongoDB til vores behov for vedvarende datalagring.

Denne teknologi er fantastisk, og vi bruger den stadig i dag – men for at have kryptering i hvile med MongoDB skal du bruge en udbyder, der tilbyder MongoDB Enterprise, såsom Digital Ocean eller Mongo Atlas – eller betale for en virksomhedslicens (og efterfølgende arbejde med salgsteamets latenstid).

Vores team hos [Videresend e-mail](https://forwardemail.net) havde brug for en udviklervenlig, skalerbar, pålidelig og krypteret lagringsløsning til IMAP-postkasser. Som open source-udviklere var det imod [vores principper](#principles) at bruge en teknologi, hvor man skal betale et licensgebyr for at få funktionen "kryptering i hvile" – og derfor eksperimenterede, undersøgte og udviklede vi en ny løsning fra bunden for at imødekomme disse behov.

I stedet for at bruge en delt database til at gemme dine postkasser, gemmer og krypterer vi dine postkasser individuelt med din adgangskode (som kun du har). **Vores e-mailtjeneste er så sikker, at hvis du glemmer din adgangskode, mister du din postkasse** (og skal gendanne den med offline-backups eller starte forfra).

Fortsæt med at læse, mens vi dykker ned i detaljer med [sammenligning af e-mailudbydere](#email-service-provider-comparison), [hvordan vores service fungerer](#how-does-it-work), [vores teknologistak](#technologies) og mere nedenfor.

## Sammenligning af e-mailudbydere {#email-service-provider-comparison}

Vi er den eneste 100 % open source- og privatlivsfokuserede e-mailudbyder, der lagrer individuelt krypterede SQLite-postkasser, tilbyder et ubegrænset antal domæner, aliasser og brugere og understøtter udgående SMTP-, IMAP- og POP3-tjenester:

**I modsætning til andre e-mailudbydere behøver du ikke at betale for lagerplads pr. domæne eller alias med Videresend e-mail.** Lagerplads deles på tværs af hele din konto – så hvis du har flere brugerdefinerede domænenavne og flere aliasser på hvert enkelt, er vi den perfekte løsning for dig. Bemærk, at du stadig kan håndhæve lagergrænser, hvis det ønskes, pr. domæne eller alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Læs sammenligning af e-mailtjenester <i class="fa fa-search-plus"></i></a>

## Hvordan fungerer det {#how-does-it-work}

1. Ved at bruge din e-mailklient, f.eks. Apple Mail, Betterbird, Gmail eller Outlook, opretter du forbindelse til vores sikre [IMAP](/faq#do-you-support-receiving-email-with-imap)-servere med dit brugernavn og din adgangskode:

* Dit brugernavn er dit fulde alias med dit domæne, f.eks. `hello@example.com`.
* Din adgangskode genereres tilfældigt og vises kun i 30 sekunder, når du klikker på <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser.

2. Når der er oprettet forbindelse, sender din e-mailklient [IMAP-protokolkommandoer](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) til vores IMAP-server for at holde din postkasse synkroniseret. Dette inkluderer at skrive og gemme kladdemails og andre handlinger, du måtte foretage dig (f.eks. markere en e-mail som vigtig eller markere en e-mail som spam/uønsket post).

3. Mail Exchange-servere (almindeligvis kendt som "MX"-servere) modtager nye indgående e-mails og gemmer dem i din postkasse. Når dette sker, får din e-mailklient besked og synkroniserer din postkasse. Vores mail Exchange-servere kan videresende din e-mail til en eller flere modtagere (inklusive [webhooks](/faq#do-you-support-webhooks)), gemme din e-mail for dig i dit krypterede IMAP-lager hos os, **eller begge dele**!

> \[!TIP]
> Interesseret i at lære mere? Læs [hvordan man konfigurerer videresendelse af e-mails](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hvordan vores postudvekslingstjeneste fungerer](/faq#how-does-your-email-forwarding-system-work), eller se [vores guider](/guides).

4. Bag kulisserne fungerer vores sikre e-maillagringsdesign på to måder for at holde dine postkasser krypterede og kun tilgængelige for dig:

* Når vi modtager ny post fra en afsender, skriver vores mailudvekslingsservere til en individuel, midlertidig og krypteret postkasse for dig.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Når du opretter forbindelse til vores IMAP-server med din e-mailklient, krypteres din adgangskode i hukommelsen og bruges til at læse og skrive til din postkasse. Din postkasse kan kun læses fra og skrives til med denne adgangskode. Husk, at da du er den eneste med denne adgangskode, er det **kun dig**, der kan læse og skrive til din postkasse, når du tilgår den. Næste gang din e-mailklient forsøger at forespørge om e-mails eller synkronisere, overføres dine nye beskeder fra denne midlertidige postkasse og gemmes i din faktiske postkassefil ved hjælp af din angivne adgangskode. Bemærk, at denne midlertidige postkasse ryddes og slettes bagefter, så kun din adgangskodebeskyttede postkasse har beskederne.

**Hvis du er forbundet til IMAP (f.eks. bruger en e-mailklient som Apple Mail eller Betterbird), behøver vi ikke at skrive til midlertidig disklagring. Din krypterede IMAP-adgangskode i hukommelsen hentes og bruges i stedet. I realtid, når en besked forsøges leveret til dig, sender vi en WebSocket-anmodning til alle IMAP-servere og spørger dem, om de har en aktiv session til dig (dette er hentningsdelen), og derefter videregiver vi den krypterede adgangskode i hukommelsen – så vi ikke behøver at skrive til en midlertidig postkasse, vi kan skrive til din faktiske krypterede postkasse ved hjælp af din krypterede adgangskode.**

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

5. [Sikkerhedskopier af dine krypterede postkasser](#backups) laves dagligt. Du kan også anmode om en ny sikkerhedskopi når som helst eller downloade den seneste sikkerhedskopi fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser. Hvis du beslutter dig for at skifte til en anden e-mailtjeneste, kan du nemt migrere, downloade, eksportere og rydde dine postkasser og sikkerhedskopier når som helst.

## Teknologier {#technologies}

### Databaser {#databases}

Vi undersøgte andre mulige databaselagringslag, men ingen opfyldte vores krav lige så meget som SQLite gjorde:

| Database | Kryptering i hvile | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postkasser | Licens | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :stjerne: | :white_check_mark: Ja med [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :hvidt_flueben: | :white_check_mark: Offentligt domæne | :hvidt_flueben: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relationel database | :x: AGPL og `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relationel database | :hvidt_flueben: `MIT` | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :hvidt_flueben: `LGPL-3.0-only` | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :hvidt_flueben: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relationel database | :white_check_mark: `PostgreSQL` (ligner `BSD` eller `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :hvidt_flueben: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relationel database | :hvidt_flueben: `GPLv2` og `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relationel database | :x: `BUSL-1.1` og andre | :x: |

> Her er en [blogindlæg, der sammenligner flere SQLite-databaselagringsmuligheder](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) i tabellen ovenfor.

### Sikkerhed {#security}

Vi bruger altid [kryptering-i-hvile](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [kryptering under transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ved hjælp af :tangerine: [Mandarin](https://tangeri.ne) og [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) kryptering på postkasser. Derudover bruger vi tokenbaseret tofaktorgodkendelse (i modsætning til SMS, som er mistænkelig for [mand-i-midten-angreb](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), roterede SSH-nøgler med root-adgang deaktiveret, eksklusiv adgang til servere via begrænsede IP-adresser og mere.

I tilfælde af en [ond tjenestepigeangreb](https://en.wikipedia.org/wiki/Evil_maid_attack) eller en uautoriseret medarbejder fra en tredjepartsleverandør, **kan din postkasse stadig kun åbnes med din genererede adgangskode**. Du kan være sikker på, at vi ikke er afhængige af andre tredjepartsleverandører end vores SOC Type 2-klageserverudbydere Cloudflare, DataPacket, Digital Ocean og Vultr.

Vores mål er at have så få [enkeltstående fejl](https://en.wikipedia.org/wiki/Single_point_of_failure) som muligt.

### Postkasser {#mailboxes}

> **tldr;** Vores IMAP-servere bruger individuelt krypterede SQLite-databaser til hver af dine postkasser.

[SQLite er ekstremt populært](https://www.sqlite.org/mostdeployed.html) integreret database – den kører i øjeblikket på din telefon og computer – [og bruges af næsten alle større teknologier](https://www.sqlite.org/famous.html).

For eksempel er der på vores krypterede servere en SQLite-databasepostkasse til `linux@example.com`, `info@example.com`, `hello@example.com` og så videre – én for hver som en `.sqlite`-databasefil. Vi navngiver heller ikke databasefilerne med e-mailadressen – i stedet bruger vi BSON ObjectID og unikke genererede UUID'er, som ikke deler, hvem postkassen tilhører, eller hvilken e-mailadresse den er under (f.eks. `353a03f21e534321f5d6e267.sqlite`).

Hver af disse databaser er krypteret med din adgangskode (som kun du har) ved hjælp af [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Det betyder, at dine postkasser er individuelt krypterede, selvstændige, [sandkasse](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) og bærbare.

Vi har finjusteret SQLite med følgende [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Formål |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Se `better-sqlite3-multiple-ciphers` under [Projects](#projects) for mere indsigt. |
| `key="****************"` | Dette er din dekrypterede adgangskode, der kun er gemt i hukommelsen, og som sendes via din e-mailklients IMAP-forbindelse til vores server. Nye databaseinstanser oprettes og lukkes for hver læse- og skrivesession (for at sikre sandboxing og isolation). |
| `journal_model=WAL` | Forhåndsskrivningslog ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Forhindrer skrivelåsfejl [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Øger holdbarheden af transaktioner [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Håndhæver at fremmednøglereferencer (f.eks. en relation fra en tabel til en anden) håndhæves. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), men af hensyn til validering og dataintegritet bør det være aktiveret. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) at bruge for at sikre udviklerens fornuft. |

> Alle andre standardindstillinger er fra SQLite som angivet fra [officiel PRAGMA-dokumentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samtidighed {#concurrency}

> **tldr;** Vi bruger `WebSocket` til samtidig læsning og skrivning til dine krypterede SQLite-postkasser.

#### Læser {#reads}

Din e-mailklient på din telefon kan muligvis omdanne `imap.forwardemail.net` til en af vores Digital Ocean IP-adresser – og din desktopklient kan muligvis omdanne en separat IP fra en helt anden [udbyder](#providers).

Uanset hvilken IMAP-server din e-mailklient opretter forbindelse til, ønsker vi, at forbindelsen læser fra din database i realtid med 100% nøjagtighed. Dette gøres via WebSockets.

#### Skriver {#writes}

Det er lidt anderledes at skrive til din database – da SQLite er en integreret database, og din postkasse som standard ligger i en enkelt fil.

Vi havde undersøgt muligheder som `litestream`, `rqlite` og `dqlite` nedenfor – men ingen af disse opfyldte vores krav.

For at udføre skrivninger med write-ahead-logning ("[WAL](https://www.sqlite.org/wal.html)") aktiveret – skal vi sikre os, at kun én server ("Primær") er ansvarlig for at gøre det. [WAL](https://www.sqlite.org/wal.html) fremskynder samtidighed drastisk og tillader én forfatter og flere læsere.

Den primære server kører på dataserverne med de monterede volumener, der indeholder de krypterede postkasser. Fra et distributionssynspunkt kan man betragte alle de individuelle IMAP-servere bag `imap.forwardemail.net` som sekundære servere ("Sekundær").

Vi opnår tovejskommunikation med [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primære servere bruger en instans af [ws](https://github.com/websockets/ws)'s `WebSocketServer`-server.
* Sekundære servere bruger en instans af [ws](https://github.com/websockets/ws)'s `WebSocket`-klient, der er pakket ind med [websocket-som-lovet](https://github.com/vitalets/websocket-as-promised) og [genforbindelse-websocket](https://github.com/opensumi/reconnecting-websocket). Disse to wrappere sikrer, at `WebSocket` genopretter forbindelsen og kan sende og modtage data til specifikke databaseskrivninger.

### Sikkerhedskopier {#backups}

> **tldr;** Der tages daglige sikkerhedskopier af dine krypterede postkasser. Du kan også anmode om en ny sikkerhedskopi med det samme eller downloade den seneste sikkerhedskopi når som helst fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser.

Til sikkerhedskopier kører vi blot SQLite `VACUUM INTO`-kommandoen hver dag under IMAP-kommandobehandling, som udnytter din krypterede adgangskode fra en IMAP-forbindelse i hukommelsen. Sikkerhedskopier gemmes, hvis der ikke registreres nogen eksisterende sikkerhedskopi, eller hvis [SHA-256](https://en.wikipedia.org/wiki/SHA-2)-hashen er ændret på filen i forhold til den seneste sikkerhedskopi.

Bemærk, at vi bruger kommandoen `VACUUM INTO` i modsætning til den indbyggede `backup`-kommando, fordi hvis en side ændres under en `backup`-kommandohandling, skal den starte forfra. `VACUUM INTO`-kommandoen tager et snapshot. Se disse kommentarer om [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) og [Hackernyheder](https://news.ycombinator.com/item?id=31387556) for mere indsigt.

Derudover bruger vi `VACUUM INTO` i modsætning til `backup`, fordi kommandoen `backup` ville efterlade databasen ukrypteret i en kort periode, indtil `rekey` kaldes (se GitHub [kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) for indsigt).

Sekundæren vil instruere primæren via `WebSocket`-forbindelsen om at udføre backup'en – og primæren vil derefter modtage kommandoen til at gøre det og vil efterfølgende:

1. Opret forbindelse til din krypterede postkasse.
2. Få en skrivelås.
3. Kør et WAL-checkpoint via `wal_checkpoint(PASSIVE)`.
4. Kør SQLite-kommandoen `VACUUM INTO`.
5. Sørg for, at den kopierede fil kan åbnes med den krypterede adgangskode (safeguard/dummyproofing).
6. Upload den til Cloudflare R2 til lagring (eller din egen udbyder, hvis angivet).

<!--
7. Komprimer den resulterende backupfil med `gzip`.
8. Upload den til Cloudflare R2 til lagring (eller din egen udbyder, hvis angivet).
-->

Husk at dine postkasser er krypterede – og selvom vi har IP-begrænsninger og andre godkendelsesforanstaltninger på plads for WebSocket-kommunikation – kan du i tilfælde af en uønsket aktør være sikker på, at medmindre WebSocket-nyttelasten har din IMAP-adgangskode, kan den ikke åbne din database.

Der gemmes kun én sikkerhedskopi pr. postkasse på nuværende tidspunkt, men i fremtiden kan vi tilbyde gendannelse på et bestemt tidspunkt ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Søg {#search}

Vores IMAP-servere understøtter `SEARCH`-kommandoen med komplekse forespørgsler, regulære udtryk og mere.

Hurtig søgeydelse er takket være [FTS5](https://www.sqlite.org/fts5.html) og [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Vi gemmer `Date`-værdier i SQLite-postkasserne som [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strenge via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (med UTC-tidszone for at lighedssammenligninger kan fungere korrekt).

Indekser gemmes også for alle ejendomme, der er i søgeforespørgsler.

### Projekter {#projects}

Her er en tabel, der viser de projekter, vi bruger i vores kildekode og udviklingsproces (alfabetisk sorteret):

| Projekt | Formål |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps-automatiseringsplatform til nem vedligeholdelse, skalering og administration af hele vores serverflåde. |
| [Bree](https://github.com/breejs/bree) | Jobplanlægger til Node.js og JavaScript med cron, dates, ms, later og brugervenlig support. |
| [Cabin](https://github.com/cabinjs/cabin) | Udviklervenligt JavaScript- og Node.js-logbibliotek med sikkerhed og privatliv i tankerne. |
| [Lad](https://github.com/ladjs/lad) | Node.js-frameworket, der driver hele vores arkitektur og tekniske design med MVC og mere. |
| [MongoDB](https://www.mongodb.com/) | NoSQL-databaseløsning, som vi bruger til at gemme alle andre data uden for postkasser (f.eks. din konto, indstillinger, domæner og aliaskonfigurationer). |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB objektdokumentmodellering ("ODM"), som vi bruger på tværs af hele vores stak. Vi skrev specielle hjælpere, der giver os mulighed for blot at fortsætte med at bruge **Mongoose med SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js er det open source, cross-platform JavaScript runtime-miljø, der kører alle vores serverprocesser. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js-pakke til at sende e-mails, oprette forbindelser og mere. Vi er officiel sponsor af dette projekt. |
| [Redis](https://redis.io/) | In-memory-database til caching, publicerings-/abonnementskanaler og DNS over HTTPS-anmodninger. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Krypteringsudvidelse til SQLite, der tillader kryptering af hele databasefiler (inklusive write-ahead-loggen ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback osv.). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visuel SQLite-editor (som du også kan bruge) til at teste, downloade og se udviklingspostkasser. |
| [SQLite](https://www.sqlite.org/about.html) | Integreret databaselag til skalerbar, selvstændig, hurtig og robust IMAP-lagring. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js anti-spam, e-mail-filtrering og phishing-forebyggelsesværktøj (vores alternativ til [Spam Assassin](https://spamassassin.apache.org/) og [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | DNS over HTTPS-anmodninger med Node.js og caching ved hjælp af Redis – hvilket sikrer global konsistens og meget mere. |
| [Betterbird](https://betterbird.eu/) | Vores udviklingsteam bruger dette (og anbefaler også dette) som **den foretrukne e-mailklient til brug med videresendelse af e-mail**. |
| [UTM](https://github.com/utmapp/UTM) | Vores udviklingsteam bruger denne metode til at oprette virtuelle maskiner til iOS og macOS for at teste forskellige e-mailklienter (parallelt) med vores IMAP- og SMTP-servere. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderne open source Linux-baseret serveroperativsystem, der driver hele vores infrastruktur. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP-serverbibliotek – se dets noter om [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) og [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Hurtigt og enkelt API-bibliotek til Node.js, så den kan interagere programmatisk med SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Udviklervenligt e-mail-framework til at oprette, forhåndsvise og sende brugerdefinerede e-mails (f.eks. kontonotifikationer og mere). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL-forespørgselsbygger med Mongo-stil syntaks. Dette sparer vores udviklingsteam tid, da vi kan fortsætte med at skrive i Mongo-stil på tværs af hele stakken med en databaseagnostisk tilgang. **Det hjælper også med at undgå SQL-injektionsangreb ved at bruge forespørgselsparametre.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL-værktøj til at udtrække information om eksisterende databaseskemaer. Dette giver os mulighed for nemt at validere, at alle indekser, tabeller, kolonner, begrænsninger og mere er gyldige og er `1:1`, som de skal være. Vi har endda skrevet automatiserede hjælpere til at tilføje nye kolonner og indekser, hvis der foretages ændringer i databaseskemaer (med ekstremt detaljerede fejlalarmer også). |
| [knex](https://github.com/knex/knex) | SQL-forespørgselsbygger, som vi kun bruger til databasemigreringer og skemavalidering via `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatisk [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) oversættelse af sætninger med understøttelse af Markdown ved hjælp af [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js-pakken til at løse og etablere forbindelser med MX-servere og håndtere fejl. |
| [pm2](https://github.com/Unitech/pm2) | Node.js produktionsproceshåndtering med indbygget load balancer ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) for ydeevne). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP-serverbibliotek – vi bruger dette til vores mailudveksling ("MX") og udgående SMTP-servere. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Nyttigt værktøj til test af IMAP-servere mod benchmarks og RFC-specifikationer for IMAP-protokolkompatibilitet. Dette projekt blev oprettet af [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-teamet (en aktiv open-source IMAP- og POP3-server fra juli 2002). Vi testede vores IMAP-server grundigt med dette værktøj. |

> Du kan finde andre projekter, vi bruger, i [vores kildekode på GitHub](https://github.com/forwardemail).

### Udbydere {#providers}

| Udbyder | Formål |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-udbyder, sundhedstjek, load balancers og backup-lager ved hjælp af [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikeret serverhosting og administrerede databaser. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dedikeret serverhosting. |
| [DataPacket](https://www.datapacket.com) | Dedikeret serverhosting. |

## Tanker {#thoughts}

### Principper {#principles}

Videresendt e-mail er designet efter disse principper:

1. Vær altid udviklervenlig, sikkerheds- og privatlivsfokuseret og transparent.

2. Overhold [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Tolv Faktor](https://12factor.net/), [Occams barberkniv](https://en.wikipedia.org/wiki/Occam%27s_razor) og [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Målret dig mod den scrappy, bootstrappede og [ramen-profitabel](http://www.paulgraham.com/ramenprofitable.html)-udvikler.

### Eksperimenter {#experiments}

> **tldr;** I sidste ende er det ikke teknisk muligt at bruge S3-kompatibel objektlagring og/eller virtuelle tabeller af ydeevneårsager og er tilbøjelige til fejl på grund af hukommelsesbegrænsninger.

Vi har udført et par eksperimenter, der har ført op til vores endelige SQLite-løsning, som beskrevet ovenfor.

En af disse var at forsøge at bruge [rclone]() og SQLite sammen med et S3-kompatibelt lagringslag.

Dette eksperiment førte os til en dybere forståelse og opdagelse af edge cases omkring brugen af rclone, SQLite og [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Hvis du aktiverer `--vfs-cache-mode writes`-flaget med rclone, vil læsning være OK, men skrivninger vil blive cachelagret.
* Hvis du har flere IMAP-servere distribueret globalt, vil cachen være slået fra på tværs af dem, medmindre du har en enkelt skriver og flere lyttere (f.eks. en pub/sub-tilgang).
* Dette er utroligt komplekst, og tilføjelse af yderligere kompleksitet som dette vil resultere i flere enkeltstående fejlpunkter.
* S3-kompatible lagerudbydere understøtter ikke delvise filændringer – hvilket betyder, at enhver ændring af `.sqlite`-filen vil resultere i en komplet ændring og genupload af databasen.
* Andre løsninger som `rsync` findes, men de fokuserer ikke på write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)")-support – så vi endte med at gennemgå Litestream. Heldigvis krypterer vores krypteringsbrug allerede [WAL](https://www.sqlite.org/wal.html)-filerne for os, så vi behøver ikke at stole på Litestream til det. Vi var dog endnu ikke sikre på Litestream til produktionsbrug og har et par noter nedenfor om det.
* Brug af denne indstilling `--vfs-cache-mode writes` (den *eneste* måde at bruge SQLite frem for `rclone` til skrivninger) vil forsøge at kopiere hele databasen fra bunden til hukommelsen – håndtering af én 10 GB postkasse er OK, men håndtering af flere postkasser med ekstremt høj lagerplads vil medføre, at IMAP-serverne løber ind i hukommelsesbegrænsninger og `ENOMEM`-fejl, segmenteringsfejl og datakorruption.

* Hvis du forsøger at bruge SQLite [Virtuelle borde](https://www.sqlite.org/vtab.html) (f.eks. ved at bruge [s3db](https://github.com/jrhy/s3db)) for at have data live på et S3-kompatibelt lagerlag, vil du støde på flere problemer:

* Læsning og skrivning vil være ekstremt langsom, da S3 API-slutpunkter skal rammes med HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 og `.sqlite`3-metoder.

* Udviklingstests viste, at det stadig er begrænset at overstige 500.000-1.000+ poster på fiberinternet af gennemløbshastigheden for skrivning og læsning til S3-kompatible udbydere. For eksempel kørte vores udviklere `.sqlite`4-løkker for at udføre både sekventielle SQL `.sqlite`5-sætninger og løkker, der skrev store mængder data i massevis. I begge tilfælde var ydeevnen svimlende langsom.

* Virtuelle tabeller **kan ikke have indeks**, `.sqlite`6-sætninger og `.sqlite`7 `.sqlite`8 – hvilket fører til forsinkelser på op til 1-2 minutter eller mere afhængigt af datamængden.

* Objekter blev gemt ukrypteret, og der er ingen native krypteringsunderstøttelse tilgængelig.

* Vi undersøgte også brugen af `.sqlite`9, som konceptuelt og teknisk set ligner det foregående punkt (så det har de samme problemer). En mulighed ville være at bruge et brugerdefineret `rsync`0-build pakket ind i kryptering, såsom `rsync`1 (som vi i øjeblikket bruger i vores løsning ovenfor) gennem `rsync`2.
* En anden potentiel tilgang var at bruge `rsync`3, men dette har en begrænsning på 32 GB og ville kræve komplekse bygge- og udviklingsproblemer.
* `rsync`4-sætninger er påkrævet (så dette udelukker fuldstændigt brugen af virtuelle tabeller). Vi har brug for `rsync`5-sætninger for at vores hook med `rsync`6 fungerer korrekt – hvilket sikrer, at data ikke beskadiges, og at hentede rækker kan konverteres til gyldige dokumenter i henhold til vores `rsync`7-skemadefinitioner (som inkluderer begrænsning, variabeltype og vilkårlig datavalidering).
* Næsten alle de S3-kompatible projekter relateret til SQLite i open source-fællesskabet er i Python (og ikke JavaScript, som vi bruger til 100% af vores stak).
* Komprimeringsbiblioteker som `rsync`8 (se `rsync`9) ser lovende ud, men __PROTECTED_LINK_189__0. I stedet vil applikationssidekomprimering på datatyper som __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 og __PROTECTED_LINK_189__6 være en renere og nemmere tilgang (og er også nemmere at migrere, da vi kunne gemme et __PROTECTED_LINK_189__7-flag eller en kolonne – eller endda bruge __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 til komprimering eller __PROTECTED_LINK_190__0 uden komprimering som databasemetadata).

* Heldigvis har vi allerede deduplikering af vedhæftede filer implementeret i vores IMAP-serverlager – derfor vil hver besked med den samme vedhæftede fil ikke gemme en kopi af den vedhæftede fil – i stedet gemmes en enkelt vedhæftet fil til flere beskeder og tråde i en postkasse (og en fremmed reference bruges efterfølgende).
* Projektet Litestream, som er en SQLite-replikerings- og backupløsning, er meget lovende, og vi vil højst sandsynligt bruge det i fremtiden.
* Ikke for at miskreditere forfatteren(e) – fordi vi elsker deres arbejde og bidrag til open source i over et årti nu – men ud fra den praktiske brug ser det ud til, at der findes __PROTECTED_LINK_190__1 og __PROTECTED_LINK_190__2.
* Gendannelse af backup skal være friktionsfri og triviel. Brug af en løsning som MongoDB med __PROTECTED_LINK_190__3 og __PROTECTED_LINK_190__4 er ikke kun kedeligt, men også tidskrævende og har konfigurationskompleksitet.
* SQLite-databaser gør det enkelt (det er en enkelt fil).
* Vi ønskede at designe en løsning, hvor brugerne kunne tage deres postkasse og forlade den når som helst.
* Enkle Node.js-kommandoer til __PROTECTED_LINK_190__5, og den slettes permanent fra disklageret.
* Vi kan på samme måde bruge en S3-kompatibel API med HTTP __PROTECTED_LINK_190__6 til nemt at fjerne snapshots og sikkerhedskopier for brugerne.

* SQLite var den enkleste, hurtigste og mest omkostningseffektive løsning.

### Mangel på alternativer {#lack-of-alternatives}

Så vidt vi ved, er ingen andre e-mailtjenester designet på denne måde, og de er heller ikke open source.

Vi *tror, at dette kan skyldes*, at eksisterende e-mailtjenester har ældre teknologi i produktion med [spaghettikode](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De fleste, hvis ikke alle, eksisterende e-mailudbydere er enten closed source eller reklamerer som open source, **men i virkeligheden er det kun deres frontend, der er open source.**

**Den mest følsomme del af e-mail** (den faktiske lagring/IMAP/SMTP-interaktion) **foregår udelukkende på backend'en (serveren) og *ikke* på frontend'en (klienten)**.

### Prøv at videresende e-mail {#try-out-forward-email}

Tilmeld dig i dag på <https://forwardemail.net>! :rocket: