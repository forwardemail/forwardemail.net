# Kvante-resistent e-mail: Hvordan vi bruger krypterede SQLite-mailbokse til at holde din e-mail sikker {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Sammenligning af e-mailudbydere](#email-service-provider-comparison)
* [Hvordan fungerer det](#how-does-it-work)
* [Teknologier](#technologies)
  * [Databaser](#databases)
  * [Sikkerhed](#security)
  * [Mailbokse](#mailboxes)
  * [Samtidighed](#concurrency)
  * [Backups](#backups)
  * [Søgning](#search)
  * [Projekter](#projects)
  * [Udbydere](#providers)
* [Overvejelser](#thoughts)
  * [Principper](#principles)
  * [Eksperimenter](#experiments)
  * [Mangel på alternativer](#lack-of-alternatives)
  * [Prøv Forward Email](#try-out-forward-email)


## Forord {#foreword}

> \[!IMPORTANT]
> Vores e-mailservice er [100% open-source](https://github.com/forwardemail) og privatlivsfokuseret gennem sikre og krypterede SQLite-mailbokse.

Indtil vi lancerede [IMAP-support](/faq#do-you-support-receiving-email-with-imap), brugte vi MongoDB til vores behov for vedvarende datalagring.

Denne teknologi er fantastisk, og vi bruger den stadig i dag – men for at have kryptering i hvile med MongoDB skal du bruge en udbyder, der tilbyder MongoDB Enterprise, såsom Digital Ocean eller Mongo Atlas – eller betale for en enterprise-licens (og efterfølgende skulle håndtere salgsafdelingens ventetid).

Vores team hos [Forward Email](https://forwardemail.net) havde brug for en udviklervenlig, skalerbar, pålidelig og krypteret lagringsløsning til IMAP-mailbokse. Som open-source-udviklere var det imod [vores principper](#principles) at bruge en teknologi, hvor du skal betale en licens for at få kryptering i hvile – så vi eksperimenterede, undersøgte og udviklede en ny løsning fra bunden for at opfylde disse behov.

I stedet for at bruge en delt database til at gemme dine mailbokse, gemmer og krypterer vi dine mailbokse individuelt med dit kodeord (som kun du har). **Vores e-mailservice er så sikker, at hvis du glemmer dit kodeord, mister du din mailboks** (og skal gendanne med offline-backups eller starte forfra).

Bliv ved med at læse, mens vi dykker ned i en [sammenligning af e-mailudbydere](#email-service-provider-comparison), [hvordan vores service fungerer](#how-does-it-work), [vores teknologistak](#technologies) og mere.


## Sammenligning af e-mailudbydere {#email-service-provider-comparison}

Vi er den eneste 100% open-source og privatlivsfokuserede e-mailudbyder, der gemmer individuelt krypterede SQLite-mailbokse, tilbyder ubegrænsede domæner, aliaser og brugere, og har udgående SMTP-, IMAP- og POP3-support:

**I modsætning til andre e-mailudbydere behøver du ikke betale for lagerplads pr. domæne eller alias med Forward Email.** Lagerplads deles på tværs af hele din konto – så hvis du har flere tilpassede domænenavne og flere aliaser på hver, er vi den perfekte løsning for dig. Bemærk, at du stadig kan håndhæve lagerbegrænsninger, hvis ønsket, pr. domæne eller alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Læs Sammenligning af E-mailudbydere <i class="fa fa-search-plus"></i></a>


## Hvordan fungerer det {#how-does-it-work}

1. Ved at bruge din e-mailklient såsom Apple Mail, Thunderbird, Gmail eller Outlook – forbinder du til vores sikre [IMAP](/faq#do-you-support-receiving-email-with-imap) servere med dit brugernavn og kodeord:

   * Dit brugernavn er dit fulde alias med dit domæne, såsom `hello@example.com`.
   * Dit kodeord genereres tilfældigt og vises kun for dig i 30 sekunder, når du klikker på <strong class="text-success"><i class="fa fa-key"></i> Generer Kodeord</strong> fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser.
2. Når du er forbundet, vil din email-klient sende [IMAP protokolkommandoer](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) til vores IMAP-server for at holde din postkasse synkroniseret. Dette inkluderer at skrive og gemme kladde-mails og andre handlinger, du måtte udføre (f.eks. mærke en email som Vigtig eller flagge en email som Spam/Skraldespand).

3. Mailudvekslingsservere (almindeligvis kendt som "MX" servere) modtager nye indgående emails og gemmer dem i din postkasse. Når dette sker, bliver din email-klient underrettet og synkroniserer din postkasse. Vores mailudvekslingsservere kan videresende din email til en eller flere modtagere (inklusive [webhooks](/faq#do-you-support-webhooks)), gemme din email for dig i din krypterede IMAP-lagerplads hos os, **eller begge dele**!

   > \[!TIP]
   > Interesseret i at lære mere? Læs [hvordan du opsætter email videresendelse](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hvordan vores mailudvekslingstjeneste fungerer](/faq#how-does-your-email-forwarding-system-work), eller se [vores guides](/guides).

4. Bag kulisserne fungerer vores sikre email-lagerdesign på to måder for at holde dine postkasser krypterede og kun tilgængelige for dig:

   * Når ny mail modtages til dig fra en afsender, skriver vores mailudvekslingsservere til en individuel, midlertidig og krypteret postkasse til dig.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Indgående besked modtaget til dit alias (f.eks. dig@ditdomæne.com).
         MX->>SQLite: Besked gemmes i en midlertidig postkasse.
         Note over MX,SQLite: Videresender til andre modtagere og konfigurerede webhooks.
         MX->>Sender: Succes!
     ```

   * Når du forbinder til vores IMAP-server med din email-klient, bliver din adgangskode derefter krypteret i hukommelsen og brugt til at læse og skrive til din postkasse. Din postkasse kan kun læses fra og skrives til med denne adgangskode. Husk, at da du er den eneste med denne adgangskode, kan **kun du** læse og skrive til din postkasse, når du tilgår den. Næste gang din email-klient forsøger at hente mail eller synkronisere, vil dine nye beskeder blive overført fra denne midlertidige postkasse og gemt i din faktiske postkassefil ved brug af din angivne adgangskode. Bemærk, at denne midlertidige postkasse bliver ryddet og slettet bagefter, så kun din adgangskodebeskyttede postkasse har beskederne.

   * **Hvis du er forbundet til IMAP (f.eks. ved brug af en email-klient som Apple Mail eller Thunderbird), behøver vi ikke skrive til midlertidig disklager. Din krypterede IMAP-adgangskode i hukommelsen hentes i stedet og bruges. I realtid, når en besked forsøger at blive leveret til dig, sender vi en WebSocket-forespørgsel til alle IMAP-servere og spørger, om de har en aktiv session for dig (dette er hentningen), og derefter vil vi efterfølgende videregive den krypterede adgangskode i hukommelsen – så vi behøver ikke skrive til en midlertidig postkasse, vi kan skrive til din faktiske krypterede postkasse ved brug af din krypterede adgangskode.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Du forbinder til IMAP-server med en email-klient.
         IMAP->>SQLite: Overfører besked fra midlertidig postkasse til dit alias' postkasse.
         Note over IMAP,SQLite: Dit alias' postkasse er kun tilgængelig i hukommelsen ved brug af IMAP-adgangskode.
         SQLite->>IMAP: Henter beskeder som anmodet af email-klienten.
         IMAP->>You: Succes!
     ```

5. [Backups af dine krypterede postkasser](#backups) laves dagligt. Du kan også til enhver tid anmode om en ny backup eller downloade den seneste backup fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser. Hvis du beslutter dig for at skifte til en anden email-tjeneste, kan du nemt migrere, downloade, eksportere og slette dine postkasser og backups når som helst.


## Teknologier {#technologies}

### Databaser {#databases}

Vi undersøgte andre mulige database-lagerlag, men ingen opfyldte vores krav så godt som SQLite gjorde:
| Database                                               |                                                                    Kryptering i hvile                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postkasser  |                           Licens                           | [Brugt Overalt](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ja med [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Tilgængelig kun i MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relationsdatabase                               |                   :x: AGPL og `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Kun netværk](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relationsdatabase                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Uafprøvet og endnu ikke understøttet?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Uafprøvet og endnu ikke understøttet?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ja](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relationsdatabase                               | :white_check_mark: `PostgreSQL` (ligner `BSD` eller `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Kun for InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relationsdatabase                               |          :white_check_mark: `GPLv2` og `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Kun Enterprise-funktion](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relationsdatabase                               |                  :x: `BUSL-1.1` og andre                  |                             :x:                             |

> Her er et [blogindlæg, der sammenligner flere SQLite database lagringsmuligheder](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) i tabellen ovenfor.

### Sikkerhed {#security}

Vi bruger til enhver tid [kryptering i hvile](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [kryptering under overførsel](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ved hjælp af :tangerine: [Tangerine](https://tangeri.ne), og [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) kryptering på postkasser. Derudover bruger vi token-baseret to-faktor autentificering (i modsætning til SMS, som er modtagelig for [man-in-the-middle-angreb](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), roterede SSH-nøgler med root-adgang deaktiveret, eksklusiv adgang til servere gennem begrænsede IP-adresser og mere.
I tilfælde af et [evil maid attack](https://en.wikipedia.org/wiki/Evil_maid_attack) eller en rogue medarbejder fra en tredjepartsleverandør, **kan din postkasse stadig kun åbnes med din genererede adgangskode**. Vær sikker på, at vi ikke er afhængige af andre tredjepartsleverandører end vores SOC Type 2-kompatible serverudbydere Cloudflare, DataPacket, Digital Ocean, GitHub og Vultr.

Vores mål er at have så få [single point of failures](https://en.wikipedia.org/wiki/Single_point_of_failure) som muligt.

### Postkasser {#mailboxes}

> **tldr;** Vores IMAP-servere bruger individuelt krypterede SQLite-databaser for hver af dine postkasser.

[SQLite er en ekstremt populær](https://www.sqlite.org/mostdeployed.html) indlejret database – den kører i øjeblikket på din telefon og computer – [og bruges af næsten alle større teknologier](https://www.sqlite.org/famous.html).

For eksempel findes der på vores krypterede servere en SQLite-databasepostkasse for `linux@example.com`, `info@example.com`, `hello@example.com` osv. – én for hver som en `.sqlite` databasefil. Vi navngiver heller ikke databasefilerne med e-mailadressen – i stedet bruger vi BSON ObjectID og unikke UUID'er, som ikke afslører, hvem postkassen tilhører, eller hvilken e-mailadresse den er tilknyttet (f.eks. `353a03f21e534321f5d6e267.sqlite`).

Hver af disse databaser er selv krypterede med din adgangskode (som kun du har) ved hjælp af [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Det betyder, at dine postkasser er individuelt krypterede, selvstændige, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) og bærbare.

Vi har finjusteret SQLite med følgende [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Formål                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite databasekryptering](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Se `better-sqlite3-multiple-ciphers` under [Projects](#projects) for mere indsigt.                                         |
| `key="****************"` | Dette er din dekrypterede adgangskode, som kun findes i hukommelsen, og som sendes gennem din e-mailklients IMAP-forbindelse til vores server. Nye databaseinstanser oprettes og lukkes for hver læse- og skrivesession (for at sikre sandboxing og isolation). |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [som øger ydeevnen og tillader samtidig læseadgang](https://litestream.io/tips/#wal-journal-mode).                                                                                           |
| `busy_timeout=5000`      | Forhindrer skrive-låsefejl [mens andre skriver](https://litestream.io/tips/#busy-timeout).                                                                                                                                                              |
| `synchronous=NORMAL`     | Øger holdbarheden af transaktioner [uden risiko for datakorruption](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                   |
| `foreign_keys=ON`        | Sikrer, at fremmednøgler (f.eks. en relation fra en tabel til en anden) håndhæves. [Som standard er dette ikke aktiveret i SQLite](https://www.sqlite.org/foreignkeys.html), men for validering og dataintegritet bør det være slået til.               |
| `encoding='UTF-8'`       | [Standardkodning](https://www.sqlite.org/pragma.html#pragma_encoding) der bruges for at sikre udviklerens overblik.                                                                                                                                      |
> Alle andre standardindstillinger er fra SQLite som specificeret i den [officielle PRAGMA dokumentation](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samtidighed {#concurrency}

> **tldr;** Vi bruger `WebSocket` til samtidige læsninger og skrivninger til dine krypterede SQLite-postkasser.

#### Læsninger {#reads}

Din email-klient på din telefon kan løse `imap.forwardemail.net` til en af vores Digital Ocean IP-adresser – og din desktop-klient kan løse en separat IP fra en anden [udbyder](#providers) helt.

Uanset hvilken IMAP-server din email-klient forbinder til, ønsker vi, at forbindelsen læser fra din database i realtid med 100% nøjagtighed. Dette gøres gennem WebSockets.

#### Skrivninger {#writes}

At skrive til din database er lidt anderledes – da SQLite er en indlejret database, og din postkasse som standard ligger i en enkelt fil.

Vi havde undersøgt muligheder som `litestream`, `rqlite` og `dqlite` nedenfor – men ingen af disse opfyldte vores krav.

For at udføre skrivninger med write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") aktiveret – skal vi sikre, at kun én server ("Primary") er ansvarlig for dette. [WAL](https://www.sqlite.org/wal.html) øger drastisk samtidighed og tillader én skriver og flere læsere.

Primary kører på dataserverne med de monterede volumener, der indeholder de krypterede postkasser. Fra et distributionssynspunkt kan du betragte alle de individuelle IMAP-servere bag `imap.forwardemail.net` som sekundære servere ("Secondary").

Vi opnår tovejskommunikation med [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primary-servere bruger en instans af [ws](https://github.com/websockets/ws)'s `WebSocketServer` server.
* Secondary-servere bruger en instans af [ws](https://github.com/websockets/ws)'s `WebSocket` klient, som er pakket ind med [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) og [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Disse to wrappers sikrer, at `WebSocket` genopretter forbindelsen og kan sende og modtage data til specifikke database-skrivninger.

### Backups {#backups}

> **tldr;** Backups af dine krypterede postkasser laves dagligt. Du kan også øjeblikkeligt anmode om en ny backup eller downloade den seneste backup når som helst fra <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser.

For backups kører vi simpelthen SQLite-kommandoen `VACUUM INTO` hver dag under IMAP-kommando-behandling, som udnytter din krypterede adgangskode fra en in-memory IMAP-forbindelse. Backups gemmes, hvis der ikke findes en eksisterende backup, eller hvis [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash'en har ændret sig på filen sammenlignet med den seneste backup.

Bemærk, at vi bruger `VACUUM INTO`-kommandoen i stedet for den indbyggede `backup`-kommando, fordi hvis en side ændres under en `backup`-kommando, skal den starte forfra. `VACUUM INTO`-kommandoen tager et snapshot. Se disse kommentarer på [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) og [Hacker News](https://news.ycombinator.com/item?id=31387556) for mere indsigt.

Derudover bruger vi `VACUUM INTO` i stedet for `backup`, fordi `backup`-kommandoen ville efterlade databasen ukrypteret i en kort periode, indtil `rekey` bliver kaldt (se denne GitHub [kommentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) for indsigt).

Secondary vil instruere Primary over `WebSocket`-forbindelsen til at udføre backup – og Primary vil derefter modtage kommandoen og efterfølgende:

1. Forbinde til din krypterede postkasse.
2. Erhverve en skrive-lås.
3. Køre et WAL checkpoint via `wal_checkpoint(PASSIVE)`.
4. Køre SQLite-kommandoen `VACUUM INTO`.
5. Sikre, at den kopierede fil kan åbnes med den krypterede adgangskode (sikkerhed/dummyproofing).
6. Uploade den til Cloudflare R2 til lagring (eller din egen udbyder, hvis specificeret).
<!--
7. Komprimer den resulterende backup-fil med `gzip`.
8. Upload den til Cloudflare R2 til lagring (eller din egen udbyder, hvis angivet).
-->

Husk, at dine postkasser er krypterede – og selvom vi har IP-begrænsninger og andre autentificeringsforanstaltninger på plads for WebSocket-kommunikation – kan du være sikker på, at medmindre WebSocket-payloaden indeholder din IMAP-adgangskode, kan den ikke åbne din database i tilfælde af en ondsindet aktør.

Der gemmes kun én backup pr. postkasse på nuværende tidspunkt, men i fremtiden kan vi tilbyde point-in-time-gendannelse ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Søgning {#search}

Vores IMAP-servere understøtter `SEARCH`-kommandoen med komplekse forespørgsler, regulære udtryk og mere.

Hurtig søgeydelse skyldes [FTS5](https://www.sqlite.org/fts5.html) og [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Vi gemmer `Date`-værdier i SQLite-postkasserne som [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-strenge via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (med UTC-tidszone for at lighedsammenligninger fungerer korrekt).

Indekser gemmes også for alle egenskaber, der indgår i søgeforespørgsler.

### Projekter {#projects}

Her er en tabel, der skitserer projekter, vi bruger i vores kildekode og udviklingsproces (sorteret alfabetisk):

| Projekt                                                                                       | Formål                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | DevOps-automatiseringsplatform til nem vedligeholdelse, skalering og styring af hele vores serverflåde.                                                                                                                                                                                                                                                             |
| [Bree](https://github.com/breejs/bree)                                                        | Jobplanlægger til Node.js og JavaScript med cron, datoer, ms, senere og menneskevenlig support.                                                                                                                                                                                                                                                                      |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Udviklervenligt JavaScript- og Node.js-logningsbibliotek med fokus på sikkerhed og privatliv.                                                                                                                                                                                                                                                                         |
| [Lad](https://github.com/ladjs/lad)                                                           | Node.js-rammeværk, der driver hele vores arkitektur og ingeniørdesign med MVC og mere.                                                                                                                                                                                                                                                                               |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL-databaseløsning, som vi bruger til at gemme alle andre data uden for postkasser (f.eks. din konto, indstillinger, domæner og alias-konfigurationer).                                                                                                                                                                                                          |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB objekt-dokumentmodellering ("ODM"), som vi bruger på tværs af hele vores stack. Vi har skrevet specielle hjælpere, der gør det muligt for os blot at fortsætte med at bruge **Mongoose med SQLite** :tada:                                                                                                                                                   |
| [Node.js](https://nodejs.org/en)                                                              | Node.js er det open source, tværplatform JavaScript-runtime-miljø, som kører alle vores serverprocesser.                                                                                                                                                                                                                                                            |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Node.js-pakke til at sende e-mails, oprette forbindelser og mere. Vi er officiel sponsor af dette projekt.                                                                                                                                                                                                                                                           |
| [Redis](https://redis.io/)                                                                    | In-memory database til caching, publish/subscribe-kanaler og DNS over HTTPS-forespørgsler.                                                                                                                                                                                                                                                                           |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Krypteringstilføjelse til SQLite, der tillader hele databasefiler at blive krypteret (inklusive write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                                   |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Visuel SQLite-editor (som du også kan bruge) til at teste, downloade og se udviklingspostkasser.                                                                                                                                                                                                                                                                   |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Indlejret databasedel til skalerbar, selvstændig, hurtig og robust IMAP-lagring.                                                                                                                                                                                                                                                                                      |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js anti-spam, e-mailfiltrering og phishing-forebyggelsesværktøj (vores alternativ til [Spam Assassin](https://spamassassin.apache.org/) og [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                          |
| [Tangerine](https://tangeri.ne)                                                               | DNS over HTTPS-forespørgsler med Node.js og caching ved brug af Redis – hvilket sikrer global konsistens og meget mere.                                                                                                                                                                                                                                             |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Vores udviklingsteam bruger dette (og anbefaler det også) som **den foretrukne e-mailklient til brug med Forward Email**.                                                                                                                                                                                                                                          |
| [UTM](https://github.com/utmapp/UTM)                                                          | Vores udviklingsteam bruger dette til at oprette virtuelle maskiner til iOS og macOS for at teste forskellige e-mailklienter (parallelt) med vores IMAP- og SMTP-servere.                                                                                                                                                                                            |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Moderne open source Linux-baseret serveroperativsystem, som driver hele vores infrastruktur.                                                                                                                                                                                                                                                                        |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP-serverbibliotek – se dets noter om [vedhæftnings-duplikering](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) og [IMAP-protokolunderstøttelse](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                  |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Hurtigt og simpelt API-bibliotek til Node.js for programmatisk interaktion med SQLite3.                                                                                                                                                                                                                                                                             |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Udviklervenligt e-mail-rammeværk til at oprette, forhåndsvise og sende tilpassede e-mails (f.eks. kontobeskeder og mere).                                                                                                                                                                                                                                           |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL-forespørgselsbygger med Mongo-stil syntaks. Dette sparer vores udviklingsteam tid, da vi kan fortsætte med at skrive i Mongo-stil på tværs af hele stacken med en databaseagnostisk tilgang. **Det hjælper også med at undgå SQL-injektionsangreb ved at bruge forespørgselsparametre.**                                                                     |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL-værktøj til at udtrække information om eksisterende databaseskema. Dette gør det muligt for os nemt at validere, at alle indekser, tabeller, kolonner, begrænsninger og mere er gyldige og er `1:1` med, hvordan de skal være. Vi har endda skrevet automatiserede hjælpere til at tilføje nye kolonner og indekser, hvis der foretages ændringer i databaseskemaer (med ekstremt detaljerede fejlvarsler også). |
| [knex](https://github.com/knex/knex)                                                          | SQL-forespørgselsbygger, som vi kun bruger til databasemigrationer og skemavalidering gennem `knex-schema-inspector`.                                                                                                                                                                                                                                               |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatisk [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) fraseoversættelse med support for Markdown ved brug af [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                               |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Node.js-pakke til at løse og etablere forbindelser med MX-servere og håndtere fejl.                                                                                                                                                                                                                                                                                |
| [pm2](https://github.com/Unitech/pm2)                                                         | Node.js produktionsprocesmanager med indbygget load balancer ([finjusteret](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) for ydeevne).                                                                                                                                                                                                       |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP-serverbibliotek – vi bruger dette til vores mailudvekslings- ("MX") og udgående SMTP-servere.                                                                                                                                                                                                                                                                  |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Nyttigt værktøj til at teste IMAP-servere mod benchmarks og RFC-specifikation IMAP-protokolkompatibilitet. Dette projekt blev oprettet af [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\))-teamet (en aktiv open source IMAP- og POP3-server fra juli 2002). Vi har testet vores IMAP-server grundigt med dette værktøj.                                    |
> Du kan finde andre projekter, vi bruger, i [vores kildekode på GitHub](https://github.com/forwardemail).

### Udbydere {#providers}

| Udbyder                                        | Formål                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS-udbyder, helbredstjek, load balancers og backup-lagring ved brug af [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting af kildekode, CI/CD og projektstyring.                                                                              |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikeret serverhosting og administrerede databaser.                                                                        |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Dedikeret serverhosting.                                                                                                    |
| [DataPacket](https://www.datapacket.com)        | Dedikeret serverhosting.                                                                                                    |


## Tanker {#thoughts}

### Principper {#principles}

Forward Email er designet efter disse principper:

1. Vær altid udviklervenlig, sikkerheds- og privatlivsfokuseret samt gennemsigtig.
2. Overhold [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor) og [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Målret mod den seje, bootstrappede og [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) udvikler

### Eksperimenter {#experiments}

> **tldr;** I sidste ende er brugen af S3-kompatibel objektlagring og/eller Virtual Tables ikke teknisk gennemførlig af præstationsmæssige årsager og er tilbøjelig til fejl på grund af hukommelsesbegrænsninger.

Vi har lavet nogle få eksperimenter frem til vores endelige SQLite-løsning som diskuteret ovenfor.

Et af disse var at prøve at bruge [rclone]() og SQLite sammen med et S3-kompatibelt lagringslag.

Dette eksperiment førte os til yderligere forståelse og opdagelse af kanttilfælde omkring rclone, SQLite og [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) brug:

* Hvis du aktiverer `--vfs-cache-mode writes` flaget med rclone, så vil læsninger være OK, men skrivninger vil blive cachet.
  * Hvis du har flere IMAP-servere distribueret globalt, vil cachen være forskellig på tværs af dem, medmindre du har en enkelt skriver og flere lyttere (f.eks. en pub/sub tilgang).
  * Dette er utroligt komplekst, og tilføjelse af yderligere kompleksitet som denne vil resultere i flere enkeltfejlspunkter.
  * S3-kompatible lagringsudbydere understøtter ikke delvise filændringer – hvilket betyder, at enhver ændring af `.sqlite` filen vil resultere i en komplet ændring og gen-upload af databasen.
  * Andre løsninger som `rsync` findes, men de fokuserer ikke på write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") understøttelse – så vi endte med at gennemgå Litestream. Heldigvis krypterer vores krypteringsbrug allerede [WAL](https://www.sqlite.org/wal.html) filerne for os, så vi behøver ikke at stole på Litestream til det. Dog var vi endnu ikke sikre på Litestream til produktionsbrug og har nogle noter nedenfor om det.
  * Brug af denne mulighed `--vfs-cache-mode writes` (den *eneste* måde at bruge SQLite over `rclone` til skrivninger) vil forsøge at kopiere hele databasen fra bunden i hukommelsen – håndtering af en 10 GB postkasse er OK, men håndtering af flere postkasser med ekstremt højt lagerforbrug vil få IMAP-serverne til at løbe ind i hukommelsesbegrænsninger og `ENOMEM` fejl, segmenteringsfejl og datakorruption.
* Hvis du forsøger at bruge SQLite [Virtual Tables](https://www.sqlite.org/vtab.html) (f.eks. ved brug af [s3db](https://github.com/jrhy/s3db)) for at have data liggende på et S3-kompatibelt lagringslag, vil du støde på flere problemer:
  * Læsninger og skrivninger vil være ekstremt langsomme, da S3 API-endpoints skal rammes med HTTP `GET`, `PUT`, `HEAD` og `POST` metoder.
  * Udviklingstest viste, at overskridelse af 500K-1M+ poster på fiberinternet stadig er begrænset af gennemstrømningen ved skrivning og læsning til S3-kompatible udbydere. For eksempel kørte vores udviklere `for` loops til både sekventielle SQL `INSERT` udsagn og dem, der bulk-skrevet store mængder data. I begge tilfælde var ydelsen overraskende langsom.
  * Virtuelle tabeller **kan ikke have indekser**, `ALTER TABLE` udsagn og [andre](https://stackoverflow.com/a/12507650) [begrænsninger](https://sqlite.org/lang_createvtab.html) – hvilket fører til forsinkelser på op til 1-2 minutter eller mere afhængigt af datamængden.
  * Objekter blev gemt ukrypteret, og der findes ikke indbygget krypteringsunderstøttelse.
* Vi undersøgte også brugen af [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs), som konceptuelt og teknisk ligner det foregående punkt (så det har de samme problemer). En mulighed ville være at bruge en tilpasset `sqlite3` build pakket med kryptering som [wxSQLite3](https://github.com/utelle/wxsqlite3) (som vi i øjeblikket bruger i vores løsning ovenfor) gennem [redigering af setup-filen](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* En anden potentiel tilgang var at bruge [multiplex extension](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), men denne har en begrænsning på 32 GB og ville kræve kompleks bygning og udviklingsbesvær.
* `ALTER TABLE` udsagn er nødvendige (så dette udelukker fuldstændigt brugen af Virtual Tables). Vi har brug for `ALTER TABLE` udsagn for at vores hook med `knex-schema-inspector` fungerer korrekt – hvilket sikrer, at data ikke bliver korrupte, og at rækker, der hentes, kan konverteres til gyldige dokumenter i henhold til vores `mongoose` skemadefinitioner (som inkluderer begrænsninger, variabeltype og vilkårlig datavalidering).
* Næsten alle S3-kompatible projekter relateret til SQLite i open source-fællesskabet er i Python (og ikke JavaScript, som vi bruger til 100% af vores stack).
* Komprimeringsbiblioteker som [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (se [kommentarer](https://news.ycombinator.com/item?id=32303762)) ser lovende ud, men [er muligvis ikke klar til produktionsbrug endnu](https://github.com/phiresky/sqlite-zstd#usage). I stedet vil applikationsside-komprimering på datatyper som `String`, `Object`, `Map`, `Array`, `Set` og `Buffer` være en renere og nemmere tilgang (og er også nemmere at migrere, da vi kunne gemme et `Boolean` flag eller kolonne – eller endda bruge `PRAGMA` `user_version=1` for komprimering eller `user_version=0` for ingen komprimering som databasemetadata).
  * Heldigvis har vi allerede implementeret vedhæftnings-duplikering i vores IMAP-serverlagring – derfor vil hver besked med samme vedhæftning ikke beholde en kopi af vedhæftningen – i stedet gemmes en enkelt vedhæftning for flere beskeder og tråde i en postkasse (og en fremmed reference bruges efterfølgende).
* Projektet Litestream, som er en SQLite replikations- og backup-løsning, er meget lovende, og vi vil højst sandsynligt bruge det i fremtiden.
  * Ikke for at miskreditere forfatteren(e) – fordi vi elsker deres arbejde og bidrag til open source i over et årti nu – men fra virkelighedens brug ser det ud til, at der [kan være mange hovedpiner](https://github.com/benbjohnson/litestream/issues) og [potentielt datatab ved brug](https://github.com/benbjohnson/litestream/issues/218).
* Backup-gendannelse skal være gnidningsfri og trivial. Brug af en løsning som MongoDB med `mongodump` og `mongoexport` er ikke kun besværligt, men tidskrævende og har konfigurationskompleksitet.
  * SQLite databaser gør det simpelt (det er en enkelt fil).
  * Vi ønskede at designe en løsning, hvor brugere kunne tage deres postkasse og forlade når som helst.
    * Enkle Node.js kommandoer til `fs.unlink('mailbox.sqlite'))` og den er permanent slettet fra disklager.
    * Vi kan tilsvarende bruge en S3-kompatibel API med HTTP `DELETE` for nemt at fjerne snapshots og backups for brugere.
  * SQLite var den simpleste, hurtigste og mest omkostningseffektive løsning.
### Manglende alternativer {#lack-of-alternatives}

Så vidt vi ved, er ingen andre e-mailtjenester designet på denne måde, og de er heller ikke open source.

Vi *tror, det kan skyldes*, at eksisterende e-mailtjenester har ældre teknologi i produktion med [spaghetti-kode](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

De fleste, hvis ikke alle, eksisterende e-mailudbydere er enten lukket kildekode eller reklamerer som open source, **men i virkeligheden er det kun deres front-end, der er open source.**

**Den mest følsomme del af e-mail** (den faktiske lagring/IMAP/SMTP-interaktion) **foregår helt på back-end (server), og *ikke* på front-end (klient)**.

### Prøv Forward Email {#try-out-forward-email}

Tilmeld dig i dag på <https://forwardemail.net>! :rocket:
