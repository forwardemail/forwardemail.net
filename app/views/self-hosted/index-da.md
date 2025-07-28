# Selvhostet {#self-hosted}

## Indholdsfortegnelse {#table-of-contents}

* [Kom godt i gang](#getting-started)
* [Krav](#requirements)
  * [Cloud-init / Bruger-data](#cloud-init--user-data)
* [Installere](#install)
  * [Debug installationsscript](#debug-install-script)
  * [Spørger](#prompts)
  * [Indledende opsætning (mulighed 1)](#initial-setup-option-1)
* [Tjenester](#services)
  * [Vigtige filstier](#important-file-paths)
* [Konfiguration](#configuration)
  * [Indledende DNS-opsætning](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Afprøvning](#testing)
  * [Oprettelse af dit første alias](#creating-your-first-alias)
  * [Sender/modtager din første e-mail](#sending--receiving-your-first-email)
* [Fejlfinding](#troubleshooting)
  * [Hvad er det grundlæggende auth-brugernavn og adgangskode](#what-is-the-basic-auth-username-and-password)
  * [Hvordan ved jeg, hvad der kører](#how-do-i-know-what-is-running)
  * [Hvordan ved jeg, om noget ikke kører, det burde være](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hvordan finder jeg logs](#how-do-i-find-logs)
  * [Hvorfor ophører mine udgående e-mails](#why-are-my-outgoing-emails-timing-out)

## Kom godt i gang {#getting-started}

Vores selvhostede e-mail-løsning, som alle vores produkter, er 100 % open source – både frontend og backend. Det betyder:

1. **Fuldstændig gennemsigtighed**: Hver linje kode, der behandler dine e-mails, er tilgængelig for offentlighedens gennemsyn.
2. **Bidrag fra fællesskabet**: Alle kan bidrage med forbedringer eller løse problemer.
3. **Sikkerhed gennem åbenhed**: Sårbarheder kan identificeres og rettes af et globalt fællesskab.
4. **Ingen leverandørbinding**: Du er aldrig afhængig af vores virksomheds eksistens.

Hele kodebasen er tilgængelig på GitHub på <https://github.com/forwardemail/forwardemail.net>, licenseret under MIT-licensen.

Arkitekturen omfatter containere til:

* SMTP-server til udgående e-mail
* IMAP/POP3-servere til hentning af e-mail
* Webgrænseflade til administration
* Database til konfigurationslagring
* Redis til caching og ydeevne
* SQLite til sikker, krypteret postkasselagring

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Krav {#requirements}

Før du kører installationsscriptet, skal du sikre dig, at du har følgende:

* **Operativsystem**: En Linux-baseret server (understøtter i øjeblikket Ubuntu 22.04+).
* **Ressourcer**: 1 vCPU og 2 GB RAM
* **Root-adgang**: Administratorrettigheder til at udføre kommandoer.
* **Domænenavn**: Et brugerdefineret domæne klar til DNS-konfiguration.
* **Ren IP**: Sørg for, at din server har en ren IP-adresse uden tidligere spam-rygd ved at tjekke sortlister. Mere info [her](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Offentlig IP-adresse med port 25-understøttelse
* Mulighed for at indstille [omvendt PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- og IPv6-understøttelse

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Brugerdata {#cloud-init--user-data}

De fleste cloud-leverandører understøtter en cloud-init-konfiguration, når den virtuelle private server (VPS) er klargjort. Dette er en fantastisk måde at indstille nogle filer og miljøvariabler på forhånd til brug af scriptets indledende opsætningslogik, som vil omgå behovet for at spørge, mens scriptet kører for yderligere information.

**Valgmuligheder**

* `EMAIL` - e-mailadresse brugt til påmindelser om udløb af certbot
* `DOMAIN` - brugerdefineret domæne (f.eks. `example.com`) brugt til opsætning af selvhosting
* `AUTH_BASIC_USERNAME` - brugernavn brugt ved første opsætning for at beskytte webstedet
* `AUTH_BASIC_PASSWORD` - adgangskode brugt ved første opsætning for at beskytte webstedet
* `/root/.cloudflare.ini` - (**Kun Cloudflare-brugere**) Cloudflare-konfigurationsfil brugt af certbot til DNS-konfiguration. Det kræver, at du indstiller dit API-token via `dns_cloudflare_api_token`. Læs mere [her](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Eksempel:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Installer {#install}

Kør følgende kommando på din server for at downloade og udføre installationsscriptet:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Fejlfinding af installationsscript {#debug-install-script}

Tilføj `DEBUG=true` foran installationsscriptet for at få et detaljeret output:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompter {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial opsætning**: Download den seneste kode til videresendelse af e-mails, konfigurer miljøet, bed om dit brugerdefinerede domæne, og opsæt alle nødvendige certifikater, nøgler og hemmeligheder.
* **Opsætning af sikkerhedskopiering**: Opsætter en cron til at sikkerhedskopiere mongoDB og redis ved hjælp af et S3-kompatibelt lager til sikker, fjernlagring. Sqlite sikkerhedskopieres separat ved login, hvis der er ændringer til sikre, krypterede sikkerhedskopier.
* **Opsætning af opgradering**: Opsæt en cron til at søge efter natlige opdateringer, som sikkert genopbygger og genstarter infrastrukturkomponenter.
* **Forny certifikater**: Certbot / lets encrypt bruges til SSL-certifikater, og nøglerne udløber hver 3. måned. Dette fornyer certifikaterne for dit domæne og placerer dem i den nødvendige mappe, så relaterede komponenter kan bruge dem. Se [vigtige filstier](#important-file-paths)
* **Gendan fra sikkerhedskopiering**: Udløser mongodb og redis til at gendanne fra sikkerhedskopierede data.

### Første opsætning (mulighed 1) {#initial-setup-option-1}

Vælg muligheden `1. Initial setup` for at starte.

Når det er færdigt, bør du se en succesmeddelelse. Du kan endda køre `docker ps` for at se komponenterne starte. Du kan finde flere oplysninger om komponenterne nedenfor.

## Tjenester {#services}

| Tjenestenavn | Standard port | Beskrivelse |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webgrænseflade til alle admin-interaktioner |
| API | `4000` | Api-lag til abstrakte databaser |
| Bree | Ingen | Baggrundsjob og opgaveløber |
| SMTP | `465/587` | SMTP-server til udgående e-mail |
| SMTP Bree | Ingen | SMTP baggrundsjob |
| MX | `2525` | Mailudveksling til indgående e-mail og videresendelse af e-mail |
| IMAP | `993/2993` | IMAP-server til indgående e-mail og postkassehåndtering |
| POP3 | `995/2995` | POP3-server til indgående e-mail og postkassehåndtering |
| SQLite | `3456` | SQLite-server til interaktioner med sqlite-database(r) |
| SQLite Bree | Ingen | SQLite baggrundsjob |
| CalDAV | `5000` | CalDAV-server til kalenderstyring |
| CardDAV | `6000` | CardDAV-server til kalenderstyring |
| MongoDB | `27017` | MongoDB-database til de fleste datahåndtering |
| Redis | `6379` | Redis til caching og tilstandsstyring |
| SQLite | Ingen | SQLite-database(r) til krypterede postkasser |

### Vigtige filstier {#important-file-paths}

Bemærk: *Værtsstien* nedenfor er relativ til `/root/forwardemail.net/self-hosting/`.

| Komponent | Værtssti | Containersti |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env fil | `./.env` | `/app/.env` |
| SSL-certifikater/nøgler | `./ssl` | `/app/ssl/` |
| Privat nøgle | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Fuld kæde certifikat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA-certifikater | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM privat nøgle | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## Konfiguration {#configuration}

### Indledende DNS-opsætning {#initial-dns-setup}

Konfigurer de relevante DNS-poster i din valgte DNS-udbyder. Bemærk, at alt i parentes (`<>`) er dynamisk og skal opdateres med din værdi.

| Type | Navn | Tilfreds | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." eller blankt | <ip_adresse> | auto |
| CNAME | api | <domænenavn> | auto |
| CNAME | caldav | <domænenavn> | auto |
| CNAME | carddav | <domænenavn> | auto |
| CNAME | fe-studser | <domænenavn> | auto |
| CNAME | imap | <domænenavn> | auto |
| CNAME | mx | <domænenavn> | auto |
| CNAME | pop3 | <domænenavn> | auto |
| CNAME | smtp | <domænenavn> | auto |
| MX | "@", "." eller blankt | mx.<domænenavn> (prioritet 0) | auto |
| TXT | "@", "." eller blankt | "v=spf1 a -all" | auto |

#### Omvendt DNS / PTR-post {#reverse-dns--ptr-record}

Reverse DNS (rDNS) eller reverse pointer records (PTR records) er afgørende for e-mail-servere, fordi de hjælper med at bekræfte legitimiteten af den server, der sender e-mailen. Hver cloud-udbyder gør dette forskelligt, så du bliver nødt til at slå op, hvordan du tilføjer "Omvendt DNS" for at kortlægge værten og IP-adressen til dets tilsvarende værtsnavn. Mest sandsynligt i netværksdelen af udbyderen.

#### Port 25 blokeret {#port-25-blocked}

Nogle internetudbydere og cloud-udbydere blokerer 25 for at undgå dårlige aktører. Du skal muligvis indsende en supportbillet for at åbne port 25 til SMTP/udgående e-mail.

## Onboarding {#onboarding}

1. Åbn landingssiden
Naviger til https\://\<domænenavn>, og erstat \<domænenavn> med det domæne, der er konfigureret i dine DNS-indstillinger. Du bør se landingssiden for videresendelse af e-mail.

2. Log ind og tilmeld dig dit domæne

* Log ind med en gyldig e-mailadresse og adgangskode.
* Indtast det domænenavn, du ønsker at oprette (dette skal matche DNS-konfigurationen).
* Følg instruktionerne for at tilføje de nødvendige **MX**- og **TXT**-poster til verifikation.

3. Fuldfør opsætningen

* Når det er bekræftet, skal du gå til siden Aliaser for at oprette dit første alias.

* Du kan eventuelt konfigurere **SMTP til udgående e-mail** i **Domæneindstillinger**. Dette kræver yderligere DNS-poster.

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## Testning af {#testing}

### Opretter dit første alias {#creating-your-first-alias}

1. Naviger til siden Aliaser
Åbn siden for administration af alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Tilføj et nyt alias

* Klik på **Tilføj alias** (øverst til højre).
* Indtast aliasnavnet, og juster e-mailindstillingerne efter behov.
* (Valgfrit) Aktiver **IMAP/POP3/CalDAV/CardDAV**-understøttelse ved at markere afkrydsningsfeltet.
* Klik på **Opret alias**.

3. Indstil en adgangskode

* Klik på **Generer adgangskode** for at oprette en sikker adgangskode.

* Denne adgangskode skal bruges til at logge ind på din e-mailklient.

4. Konfigurer din e-mailklient

* Brug en e-mailklient som Thunderbird.
* Indtast aliasnavnet og den genererede adgangskode.
* Konfigurer indstillingerne for **IMAP** og **SMTP** i overensstemmelse hermed.

#### Indstillinger for e-mailserver {#email-server-settings}

Brugernavn: `<alias name>`

| Type | Værtsnavn | Havn | Forbindelsessikkerhed | Godkendelse |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domænenavn> | 465 | SSL / TLS | Normal adgangskode |
| IMAP | imap.<domænenavn> | 993 | SSL / TLS | Normal adgangskode |

### Sender/modtager din første e-mail {#sending--receiving-your-first-email}

Når du er konfigureret, bør du være i stand til at sende og modtage e-mail til din nyoprettede og selvhostede e-mailadresse!

## Fejlfinding {#troubleshooting}

#### Hvorfor virker dette ikke uden for Ubuntu og Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi undersøger i øjeblikket mulighederne for at understøtte MacOS og vil se på andre. Åbn venligst en [diskussion](https://github.com/orgs/forwardemail/discussions) eller bidrag, hvis du ønsker, at andre understøttes.

#### Hvorfor mislykkes certbot acme-udfordringen {#why-is-the-certbot-acme-challenge-failing}

Den mest almindelige faldgrube er, at certbot / letsencrypt nogle gange anmoder om **2** udfordringer. Du skal sørge for at tilføje **BEGGE** txt-poster.

Eksempel:
Du kan muligvis se to udfordringer som denne:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det er også muligt, at DNS-udbredelsen ikke er fuldført. Du kan bruge værktøjer som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dette vil give dig en idé om, hvorvidt ændringerne i dine TXT-poster skal afspejles. Det er også muligt, at den lokale DNS-cache på din vært stadig bruger en gammel, forældet værdi eller ikke har registreret de seneste ændringer.

En anden mulighed er at bruge de automatiserede Cerbot DNS-ændringer ved at indstille `/root/.cloudflare.ini`-filen med API-tokenet i din cloud-init / user-data ved den første VPS-opsætning eller oprette denne fil og køre scriptet igen. Dette vil administrere DNS-ændringerne og udfordre opdateringer automatisk.

### Hvad er det grundlæggende brugernavn og den grundlæggende adgangskode til godkendelse? {#what-is-the-basic-auth-username-and-password}

Til selvhosting tilføjer vi en pop-up til browsergodkendelse første gang med et simpelt brugernavn (`admin`) og en adgangskode (tilfældigt genereret ved den første opsætning). Vi tilføjer blot dette som en beskyttelse, i tilfælde af at automatisering/scrapers på en eller anden måde kommer dig i forkøbet med at tilmelde dig på weboplevelsen. Du kan finde denne adgangskode efter den første opsætning i din `.env`-fil under `AUTH_BASIC_USERNAME` og `AUTH_BASIC_PASSWORD`.

### Hvordan ved jeg, hvad der kører {#how-do-i-know-what-is-running}

Du kan køre `docker ps` for at se alle de kørende containere, der oprettes fra `docker-compose-self-hosting.yml`-filen. Du kan også køre `docker ps -a` for at se alt (inklusive containere, der ikke kører).

### Hvordan ved jeg, om noget, der burde køre, ikke kører? {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan køre `docker ps -a` for at se alt (inklusive containere, der ikke kører). Du kan muligvis se en exit-log eller note.

### Hvordan finder jeg logfiler {#how-do-i-find-logs}

Du kan få flere logfiler via `docker logs -f <container_name>`. Hvis noget er afsluttet, er det sandsynligvis relateret til, at `.env`-filen er konfigureret forkert.

I webgrænsefladen kan du se `/admin/emails` og `/admin/logs` for henholdsvis udgående e-mail-logfiler og fejllogfiler.

### Hvorfor får mine udgående e-mails timeout {#why-are-my-outgoing-emails-timing-out}

Hvis du ser en meddelelse som Timeout for forbindelsen, når du opretter forbindelse til MX-serveren... så skal du muligvis kontrollere, om port 25 er blokeret. Det er almindeligt, at internetudbydere eller cloud-udbydere blokerer dette som standard, hvor du muligvis skal kontakte support/file en billet for at få åbnet dette.

#### Hvilke værktøjer skal jeg bruge til at teste bedste praksis for e-mailkonfiguration og IP-omdømme {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Tag et kig på vores [FAQ her](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).