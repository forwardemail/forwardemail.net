# Selvhostet {#self-hosted}

## Indholdsfortegnelse {#table-of-contents}

* [Kom godt i gang](#getting-started)
* [Krav](#requirements)
  * [Cloud-initiering / Brugerdata](#cloud-init--user-data)
* [Installere](#install)
  * [Fejlfindingsinstallationsscript](#debug-install-script)
  * [Prompter](#prompts)
  * [Første opsætning (mulighed 1)](#initial-setup-option-1)
* [Tjenester](#services)
  * [Vigtige filstier](#important-file-paths)
* [Konfiguration](#configuration)
  * [Indledende DNS-opsætning](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testning](#testing)
  * [Oprettelse af dit første alias](#creating-your-first-alias)
  * [Afsendelse/modtagelse af din første e-mail](#sending--receiving-your-first-email)
* [Fejlfinding](#troubleshooting)
  * [Hvad er det grundlæggende brugernavn og den grundlæggende adgangskode til godkendelse](#what-is-the-basic-auth-username-and-password)
  * [Hvordan ved jeg, hvad der kører](#how-do-i-know-what-is-running)
  * [Hvordan ved jeg, om noget, der burde kører, ikke kører?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hvordan finder jeg logfiler](#how-do-i-find-logs)
  * [Hvorfor får mine udgående e-mails timeout?](#why-are-my-outgoing-emails-timing-out)

## Introduktion {#getting-started}

Vores selvhostede e-mailløsning er, ligesom alle vores produkter, 100% open source – både frontend og backend. Det betyder:

1. **Fuldstændig gennemsigtighed**: Hver linje kode, der behandler dine e-mails, er tilgængelig for offentlighedens gennemsyn.
2. **Bidrag fra fællesskabet**: Alle kan bidrage med forbedringer eller løse problemer.
3. **Sikkerhed gennem åbenhed**: Sårbarheder kan identificeres og rettes af et globalt fællesskab.
4. **Ingen leverandørbinding**: Du er aldrig afhængig af vores virksomheds eksistens.

Hele kodebasen er tilgængelig på GitHub på <https://github.com/forwardemail/forwardemail.net>, licenseret under MIT-licensen.

Arkitekturen inkluderer containere til:

* SMTP-server til udgående e-mail
* IMAP/POP3-servere til hentning af e-mail
* Webgrænseflade til administration
* Database til konfigurationslagring
* Redis til caching og ydeevne
* SQLite til sikker, krypteret postkasselagring

> \[!NOTE]
> Sørg for at tjekke vores [selvhostet blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Og for dem, der er interesserede i en mere detaljeret trin-for-trin version, kan du se vores [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-baserede vejledninger.

## Krav {#requirements}

Før du kører installationsscriptet, skal du sørge for at have følgende:

* **Operativsystem**: En Linux-baseret server (understøtter i øjeblikket Ubuntu 22.04+).
* **Ressourcer**: 1 vCPU og 2 GB RAM
* **Root-adgang**: Administratorrettigheder til at udføre kommandoer.
* **Domænenavn**: Et brugerdefineret domæne klar til DNS-konfiguration.
* **Ren IP**: Sørg for, at din server har en ren IP-adresse uden tidligere spam-rygte ved at tjekke sortlister. Mere info [her](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Offentlig IP-adresse med port 25-understøttelse
* Mulighed for at indstille [omvendt PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- og IPv6-understøttelse

> \[!TIP]
> Se vores liste over [fantastiske mailserverudbydere](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-initiering / Brugerdata {#cloud-init--user-data}

De fleste cloud-leverandører understøtter en cloud-init-konfiguration, når den virtuelle private server (VPS) klargøres. Dette er en god måde at indstille nogle filer og miljøvariabler på forhånd til brug af scriptets indledende opsætningslogik, hvilket vil omgå behovet for at spørge, mens scriptet kører, om yderligere oplysninger.

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

### Indledende opsætning (mulighed 1) {#initial-setup-option-1}

Vælg muligheden `1. Initial setup` for at starte.

Når det er færdigt, bør du se en succesmeddelelse. Du kan endda køre `docker ps` for at se komponenterne starte. Du kan finde flere oplysninger om komponenterne nedenfor.

## Tjenester {#services}

| Tjenestenavn | Standardport | Beskrivelse |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webgrænseflade til alle administrative interaktioner |
| API | `4000` | API-lag til abstrakte databaser |
| Bree | Ingen | Baggrundsjob og opgaveløber |
| SMTP | `465/587` | SMTP-server til udgående e-mail |
| SMTP Bree | Ingen | SMTP-baggrundsjob |
| MX | `2525` | Postudveksling for indgående e-mail og videresendelse af e-mail |
| IMAP | `993/2993` | IMAP-server til administration af indgående e-mail og postkasse |
| POP3 | `995/2995` | POP3-server til administration af indgående e-mail og postkasse |
| SQLite | `3456` | SQLite-server til interaktioner med SQLite-database(r) |
| SQLite Bree | Ingen | SQLite-baggrundsjob |
| CalDAV | `5000` | CalDAV-server til kalenderadministration |
| CardDAV | `6000` | CardDAV-server til kalenderstyring |
| MongoDB | `27017` | MongoDB-database til det meste datahåndtering |
| Redis | `6379` | Redis til caching og tilstandsstyring |
| SQLite | Ingen | SQLite-database(r) til krypterede postkasser |

### Vigtige filstier {#important-file-paths}

Bemærk: *Værtsstien* nedenfor er relativ til `/root/forwardemail.net/self-hosting/`.

| Komponent | Værtssti | Containersti |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-fil | `./.env` | `/app/.env` |
| SSL-certifikater/nøgler | `./ssl` | `/app/ssl/` |
| Privat nøgle | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Fuld kædecertifikat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Certificerede CA'er | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM privat nøgle | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Gem `.env`-filen sikkert. Den er afgørende for gendannelse i tilfælde af fejl.
> Du kan finde den i `/root/forwardemail.net/self-hosting/.env`.

## Konfiguration {#configuration}

### Indledende DNS-opsætning {#initial-dns-setup}

Konfigurer de relevante DNS-poster i din valgte DNS-udbyder. Bemærk, at alt i parentes (`<>`) er dynamisk og skal opdateres med din værdi.

| Type | Navn | Tilfreds | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." eller blankt | <ip_adresse> | bil |
| CNAME | API | <domænenavn> | bil |
| CNAME | Caldav | <domænenavn> | bil |
| CNAME | carddav | <domænenavn> | bil |
| CNAME | fe-bounces | <domænenavn> | bil |
| CNAME | imap | <domænenavn> | bil |
| CNAME | mx | <domænenavn> | bil |
| CNAME | pop3 | <domænenavn> | bil |
| CNAME | smtp | <domænenavn> | bil |
| MX | "@", "." eller blankt | mx.<domænenavn> (prioritet 0) | bil |
| TXT | "@", "." eller blankt | "v=spf1 a -all" | bil |

#### Omvendt DNS / PTR-post {#reverse-dns--ptr-record}

Omvendt DNS (rDNS) eller reverse pointer-poster (PTR-poster) er vigtige for e-mailservere, fordi de hjælper med at verificere legitimiteten af den server, der sender e-mailen. Hver cloududbyder gør dette forskelligt, så du skal finde ud af, hvordan du tilføjer "Omvendt DNS" for at knytte værten og IP-adressen til det tilsvarende værtsnavn. Mest sandsynligt i udbyderens netværkssektion.

#### Port 25 Blokeret {#port-25-blocked}

Nogle internetudbydere og cloud-udbydere blokerer port 25 for at undgå skadelige aktører. Du skal muligvis indsende en supportbillet for at åbne port 25 for SMTP/udgående e-mail.

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
> Ingen information sendes uden for din server. Den selvhostede mulighed og den indledende konto er kun til administratorlogin og webvisning til administration af domæner, aliasser og relaterede e-mailkonfigurationer.

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

* Brug en e-mailklient som Betterbird.
* Indtast aliasnavnet og den genererede adgangskode.
* Konfigurer indstillingerne for **IMAP** og **SMTP** i overensstemmelse hermed.

#### Indstillinger for e-mailserver {#email-server-settings}

Brugernavn: `<alias name>`

| Type | Værtsnavn | Havn | Forbindelsessikkerhed | Godkendelse |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domænenavn> | 465 | SSL / TLS | Normal adgangskode |
| IMAP | imap.<domænenavn> | 993 | SSL / TLS | Normal adgangskode |

### Sender/modtager din første e-mail {#sending--receiving-your-first-email}

Når den er konfigureret, burde du kunne sende og modtage e-mails til din nyoprettede og selvhostede e-mailadresse!

## Fejlfinding {#troubleshooting}

#### Hvorfor virker dette ikke uden for Ubuntu og Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi undersøger i øjeblikket mulighederne for at understøtte MacOS og vil se på andre. Åbn venligst en [diskussion](https://github.com/orgs/forwardemail/discussions) eller bidrag, hvis du ønsker, at andre understøttes.

#### Hvorfor mislykkes certbot acme-udfordringen {#why-is-the-certbot-acme-challenge-failing}

Den mest almindelige faldgrube er, at certbot / letsencrypt nogle gange anmoder om **2** udfordringer. Du skal sørge for at tilføje **BEGGE** txt-poster.

Eksempel:
Du kan muligvis se to udfordringer som denne:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det er også muligt, at DNS-udbredelsen ikke er fuldført. Du kan bruge værktøjer som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dette vil give dig en idé om, hvorvidt ændringerne i din TXT-post skal afspejles. Det er også muligt, at den lokale DNS-cache på din vært stadig bruger en gammel, forældet værdi eller ikke har registreret de seneste ændringer.

En anden mulighed er at bruge de automatiserede Cerbot DNS-ændringer ved at indstille `/root/.cloudflare.ini`-filen med API-tokenet i din cloud-init / user-data ved den første VPS-opsætning eller oprette denne fil og køre scriptet igen. Dette vil administrere DNS-ændringerne og udfordre opdateringer automatisk.

### Hvad er det grundlæggende brugernavn og den grundlæggende adgangskode til godkendelse {#what-is-the-basic-auth-username-and-password}

Til selvhosting tilføjer vi en pop-up til browsergodkendelse første gang med et simpelt brugernavn (`admin`) og en adgangskode (tilfældigt genereret ved den første opsætning). Vi tilføjer blot dette som en beskyttelse, i tilfælde af at automatisering/scrapers på en eller anden måde foregriber din første tilmelding på weboplevelsen. Du kan finde denne adgangskode efter den første opsætning i din `.env`-fil under `AUTH_BASIC_USERNAME` og `AUTH_BASIC_PASSWORD`.

### Hvordan ved jeg, hvad der kører {#how-do-i-know-what-is-running}

Du kan køre `docker ps` for at se alle de kørende containere, der oprettes fra `docker-compose-self-hosting.yml`-filen. Du kan også køre `docker ps -a` for at se alt (inklusive containere, der ikke kører).

### Hvordan ved jeg, om noget ikke kører, som burde være {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan køre `docker ps -a` for at se alt (inklusive containere, der ikke kører). Du kan muligvis se en exit-log eller note.

### Hvordan finder jeg logfiler {#how-do-i-find-logs}

Du kan få flere logfiler via `docker logs -f <container_name>`. Hvis noget er afsluttet, er det sandsynligvis relateret til, at `.env`-filen er konfigureret forkert.

I webgrænsefladen kan du se `/admin/emails` og `/admin/logs` for henholdsvis udgående e-mail-logfiler og fejllogfiler.

### Hvorfor får mine udgående e-mails timeout {#why-are-my-outgoing-emails-timing-out}

Hvis du ser en meddelelse som "Forbindelsen blev afbrudt ved tilslutning til MX-server...", skal du muligvis kontrollere, om port 25 er blokeret. Det er almindeligt, at internetudbydere eller cloud-udbydere blokerer dette som standard, hvor du muligvis skal kontakte support/indsende en supportsag for at få dette åbnet.

#### Hvilke værktøjer skal jeg bruge til at teste bedste praksis for e-mailkonfiguration og IP-omdømme {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Tag et kig på vores [Ofte stillede spørgsmål her](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).