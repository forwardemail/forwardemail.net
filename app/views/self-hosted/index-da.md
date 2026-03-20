# Selvhostet {#self-hosted}


## Indholdsfortegnelse {#table-of-contents}

* [Kom godt i gang](#getting-started)
* [Krav](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Installation](#install)
  * [Fejlfinding af installationsscript](#debug-install-script)
  * [Forespørgsler](#prompts)
  * [Initial opsætning (Mulighed 1)](#initial-setup-option-1)
* [Tjenester](#services)
  * [Vigtige filstier](#important-file-paths)
* [Konfiguration](#configuration)
  * [Initial DNS opsætning](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Test](#testing)
  * [Oprettelse af dit første alias](#creating-your-first-alias)
  * [Afsendelse / modtagelse af din første e-mail](#sending--receiving-your-first-email)
* [Fejlfinding](#troubleshooting)
  * [Hvad er brugernavn og adgangskode til basic auth](#what-is-the-basic-auth-username-and-password)
  * [Hvordan ved jeg hvad der kører](#how-do-i-know-what-is-running)
  * [Hvordan ved jeg om noget ikke kører, som det burde](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hvordan finder jeg logs](#how-do-i-find-logs)
  * [Hvorfor timeouter mine udgående e-mails](#why-are-my-outgoing-emails-timing-out)


## Kom godt i gang {#getting-started}

Vores selvhostede e-mailløsning, ligesom alle vores produkter, er 100% open-source—både frontend og backend. Det betyder:

1. **Fuld gennemsigtighed**: Hver eneste linje kode, der behandler dine e-mails, er tilgængelig for offentlig inspektion
2. **Fællesskabsbidrag**: Alle kan bidrage med forbedringer eller rette fejl
3. **Sikkerhed gennem åbenhed**: Sårbarheder kan identificeres og rettes af et globalt fællesskab
4. **Ingen leverandørlåsning**: Du er aldrig afhængig af vores virksomheds eksistens

Hele kodebasen er tilgængelig på GitHub på <https://github.com/forwardemail/forwardemail.net>, licenseret under MIT-licensen.

Arkitekturen inkluderer containere til:

* SMTP-server til udgående e-mail
* IMAP/POP3-servere til e-mail hentning
* Webinterface til administration
* Database til konfigurationslagring
* Redis til caching og ydeevne
* SQLite til sikker, krypteret postkasselagring

> \[!NOTE]
> Sørg for at tjekke vores [selvhostede blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Og for dem, der er interesserede i en mere opdelt trin-for-trin version, se vores [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserede guides.


## Krav {#requirements}

Før du kører installationsscriptet, skal du sikre dig, at du har følgende:

* **Operativsystem**: En Linux-baseret server (understøtter i øjeblikket Ubuntu 22.04+).
* **Ressourcer**: 1 vCPU og 2GB RAM
* **Root-adgang**: Administrative rettigheder til at udføre kommandoer.
* **Domænenavn**: Et brugerdefineret domæne klar til DNS-konfiguration.
* **Ren IP**: Sørg for, at din server har en ren IP-adresse uden tidligere spam-rygte ved at tjekke blacklister. Mere info [her](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Offentlig IP-adresse med port 25 support
* Mulighed for at sætte [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4 og IPv6 support

> \[!TIP]
> Se vores liste over [fantastiske mailserverudbydere](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

De fleste cloud-udbydere understøtter en cloud-init konfiguration til, når den virtuelle private server (VPS) provisioneres. Dette er en god måde at sætte nogle filer og miljøvariabler på forhånd til brug af scriptets initiale opsætningslogik, som vil omgå behovet for at spørge om yderligere information, mens scriptet kører.

**Muligheder**

* `EMAIL` - e-mail brugt til certbot udløbs-påmindelser
* `DOMAIN` - brugerdefineret domæne (f.eks. `example.com`) brugt til selvhostet opsætning
* `AUTH_BASIC_USERNAME` - brugernavn brugt ved første opsætning til at beskytte siden
* `AUTH_BASIC_PASSWORD` - adgangskode brugt ved første opsætning til at beskytte siden
* `/root/.cloudflare.ini` - (**Kun Cloudflare-brugere**) cloudflare konfigurationsfil brugt af certbot til DNS-konfiguration. Den kræver, at du sætter dit API-token via `dns_cloudflare_api_token`. Læs mere [her](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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


## Installation {#install}

Kør følgende kommando på din server for at downloade og køre installationsscriptet:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debug installationsscript {#debug-install-script}

Tilføj `DEBUG=true` foran installationsscriptet for detaljeret output:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompter {#prompts}

```sh
1. Initial opsætning
2. Opsæt backup
3. Opsæt automatiske opgraderinger
4. Forny certifikater
5. Gendan fra backup
6. Hjælp
7. Afslut
```

* **Initial opsætning**: Download den nyeste forward email kode, konfigurer miljøet, spørg efter dit brugerdefinerede domæne og opsæt alle nødvendige certifikater, nøgler og hemmeligheder.
* **Opsæt backup**: Opsætter en cron til at tage backup af mongoDB og redis ved hjælp af en S3-kompatibel lagerplads til sikker, fjernlagring. Separat vil sqlite blive backup'et ved login, hvis der er ændringer, for sikre, krypterede backups.
* **Opsæt opgradering**: Opsætter en cron til at søge efter natlige opdateringer, som sikkert genopbygger og genstarter infrastrukturkomponenter.
* **Forny certifikater**: Certbot / lets encrypt bruges til SSL-certifikater, og nøgler udløber hver 3. måned. Dette vil forny certifikaterne for dit domæne og placere dem i den nødvendige mappe, så relaterede komponenter kan bruge dem. Se [vigtige filstier](#important-file-paths)
* **Gendan fra backup**: Vil aktivere mongodb og redis til at gendanne fra backupdata.

### Initial opsætning (Valgmulighed 1) {#initial-setup-option-1}

Vælg valgmulighed `1. Initial opsætning` for at starte.

Når det er færdigt, bør du se en succesbesked. Du kan endda køre `docker ps` for at se **de** komponenter, der er startet. Mere information om komponenter nedenfor.


## Services {#services}

| Service Navn |         Standard Port        | Beskrivelse                                            |
| ------------ | :--------------------------: | ------------------------------------------------------ |
| Web          |            `443`             | Webinterface til alle admin-interaktioner              |
| API          |            `4000`            | API-lag til at abstrahere databaser                    |
| Bree         |             Ingen            | Baggrundsjob og task runner                             |
| SMTP         | `465` (anbefalet) / `587`   | SMTP-server til udgående email                          |
| SMTP Bree    |             Ingen            | SMTP baggrundsjob                                       |
| MX           |            `2525`            | Mail exchange til indgående email og email videresendelse |
| IMAP         |          `993/2993`          | IMAP-server til indgående email og postkassehåndtering |
| POP3         |          `995/2995`          | POP3-server til indgående email og postkassehåndtering |
| SQLite       |            `3456`            | SQLite-server til interaktioner med sqlite-database(r) |
| SQLite Bree  |             Ingen            | SQLite baggrundsjob                                     |
| CalDAV       |            `5000`            | CalDAV-server til kalenderhåndtering                    |
| CardDAV      |            `6000`            | CardDAV-server til kalenderhåndtering                   |
| MongoDB      |           `27017`            | MongoDB database til det meste datastyring              |
| Redis        |            `6379`            | Redis til caching og tilstandsstyring                   |
| SQLite       |             Ingen            | SQLite database(r) til krypterede postkasser            |

### Vigtige filstier {#important-file-paths}

Bemærk: *Host path* nedenfor er relativ til `/root/forwardemail.net/self-hosting/`.

| Komponent              |       Host sti        | Container sti                |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env fil                |        `./.env`       | `/app/.env`                  |
| SSL certifikater/nøgler|        `./ssl`        | `/app/ssl/`                  |
| Privat nøgle           |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Full chain certifikat  | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA certifikat          |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM privat nøgle      |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Gem `.env`-filen sikkert. Den er afgørende for genopretning i tilfælde af fejl.
> Du kan finde den i `/root/forwardemail.net/self-hosting/.env`.


## Konfiguration {#configuration}

### Initial DNS-opsætning {#initial-dns-setup}

Hos din valgte DNS-udbyder skal du konfigurere de relevante DNS-poster. Bemærk, at alt i parenteser (`<>`) er dynamisk og skal opdateres med din værdi.

| Type  | Navn               | Indhold                      | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", eller tom | <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", eller tom | mx.<domain_name> (prioritet 0) | auto |
| TXT   | "@", ".", eller tom | "v=spf1 a -all"              | auto |

#### Reverse DNS / PTR-post {#reverse-dns--ptr-record}

Reverse DNS (rDNS) eller reverse pointer-poster (PTR-poster) er essentielle for mailservere, fordi de hjælper med at verificere legitimiteten af den server, der sender e-mailen. Hver cloud-udbyder gør dette forskelligt, så du skal undersøge, hvordan du tilføjer "Reverse DNS" for at kortlægge værten og IP'en til det tilsvarende værtsnavn. Mest sandsynligt i netværkssektionen hos udbyderen.

#### Port 25 blokeret {#port-25-blocked}

Nogle internetudbydere og cloud-udbydere blokerer port 25 for at undgå misbrug. Du kan blive nødt til at indsende en supportsag for at åbne port 25 til SMTP / udgående e-mail.


## Onboarding {#onboarding}

1. Åbn landingssiden
   Naviger til https\://\<domain_name>, hvor du erstatter \<domain_name> med det domæne, der er konfigureret i dine DNS-indstillinger. Du bør se Forward Email landingssiden.

2. Log ind og onboard dit domæne

* Log ind med en gyldig e-mail og adgangskode.
* Indtast det domænenavn, du ønsker at opsætte (det skal matche DNS-konfigurationen).
* Følg vejledningen for at tilføje de nødvendige **MX**- og **TXT**-poster til verifikation.

3. Fuldfør opsætningen

* Når det er verificeret, får du adgang til Alias-siden for at oprette dit første alias.
* Valgfrit kan du konfigurere **SMTP til udgående e-mail** under **Domæneindstillinger**. Dette kræver yderligere DNS-poster.

> \[!NOTE]
> Ingen information sendes uden for din server. Den selvhostede mulighed og den første konto er kun til admin-login og webvisning for at administrere domæner, aliaser og relaterede e-mail-konfigurationer.


## Testning {#testing}

### Oprettelse af dit første alias {#creating-your-first-alias}

1. Gå til Alias-siden
   Åbn siden til alias-administration:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Tilføj et nyt alias

* Klik på **Tilføj alias** (øverst til højre).
* Indtast alias-navnet og juster e-mail-indstillinger efter behov.
* (Valgfrit) Aktiver **IMAP/POP3/CalDAV/CardDAV** support ved at markere afkrydsningsfeltet.
* Klik på **Opret alias.**

3. Sæt en adgangskode

* Klik på **Generer adgangskode** for at oprette en sikker adgangskode.
* Denne adgangskode vil være nødvendig for at logge ind i din e-mail-klient.

4. Konfigurer din e-mail-klient

* Brug en e-mail-klient som Thunderbird.
* Indtast alias-navnet og den genererede adgangskode.
* Konfigurer **IMAP** og **SMTP** indstillingerne tilsvarende.

#### E-mail-serverindstillinger {#email-server-settings}

Brugernavn: `<alias name>`

| Type | Værtsnavn          | Port | Forbindelsessikkerhed | Autentifikation  |
| ---- | ------------------ | ---- | --------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS             | Normal adgangskode |
| IMAP | imap.<domain_name> | 993  | SSL / TLS             | Normal adgangskode |

### Afsendelse / modtagelse af din første e-mail {#sending--receiving-your-first-email}

Når det er konfigureret, bør du kunne sende og modtage e-mail til din nyoprettede og selvhostede e-mailadresse!
## Fejlfinding {#troubleshooting}

#### Hvorfor virker dette ikke uden for Ubuntu og Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi arbejder i øjeblikket på at understøtte MacOS og vil se på andre. Venligst åbn en [diskussion](https://github.com/orgs/forwardemail/discussions) eller bidrag, hvis du gerne vil se andre understøttet.

#### Hvorfor fejler certbot acme-udfordringen {#why-is-the-certbot-acme-challenge-failing}

Den mest almindelige faldgrube er, at certbot / letsencrypt nogle gange vil anmode om **2** udfordringer. Du skal være sikker på at tilføje **BEGGE** txt-poster.

Eksempel:
Du kan se to udfordringer som disse:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det er også muligt, at DNS-propagation ikke er fuldført. Du kan bruge værktøjer som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dette vil give dig en idé om, hvorvidt dine TXT-postændringer er blevet reflekteret. Det er også muligt, at lokal DNS-cache på din vært stadig bruger en gammel, forældet værdi eller ikke har opfanget de seneste ændringer.

En anden mulighed er at bruge de automatiserede certbot DNS-ændringer ved at sætte `/root/.cloudflare.ini` filen med API-tokenet i din cloud-init / user-data ved den indledende VPS-opsætning eller oprette denne fil og køre scriptet igen. Dette vil automatisk håndtere DNS-ændringer og udfordringsopdateringer.

### Hvad er brugernavnet og adgangskoden til basic auth {#what-is-the-basic-auth-username-and-password}

For selvhosting tilføjer vi en første gang browser-native autentificerings-popup med et simpelt brugernavn (`admin`) og adgangskode (tilfældigt genereret ved den indledende opsætning). Vi tilføjer dette som en beskyttelse i tilfælde af, at automatisering / scrapers på en eller anden måde slår dig til først at tilmelde dig via weboplevelsen. Du kan finde denne adgangskode efter den indledende opsætning i din `.env` fil under `AUTH_BASIC_USERNAME` og `AUTH_BASIC_PASSWORD`.

### Hvordan ved jeg, hvad der kører {#how-do-i-know-what-is-running}

Du kan køre `docker ps` for at se alle kørende containere, som bliver startet fra `docker-compose-self-hosting.yml` filen. Du kan også køre `docker ps -a` for at se alt (inklusive containere, der ikke kører).

### Hvordan ved jeg, om noget ikke kører, som burde {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan køre `docker ps -a` for at se alt (inklusive containere, der ikke kører). Du kan se en exit-log eller note.

### Hvordan finder jeg logs {#how-do-i-find-logs}

Du kan få flere logs via `docker logs -f <container_name>`. Hvis noget er afsluttet, er det sandsynligvis relateret til, at `.env` filen er konfigureret forkert.

Inden for web-UI’en kan du se `/admin/emails` og `/admin/logs` for henholdsvis udgående emaillogs og fejl-logs.

### Hvorfor timeout’er mine udgående emails {#why-are-my-outgoing-emails-timing-out}

Hvis du ser en besked som Connection timed out when connecting to MX server... så skal du muligvis tjekke, om port 25 er blokeret. Det er almindeligt, at internetudbydere eller cloud-udbydere blokerer denne som standard, hvor du muligvis skal kontakte support / oprette en sag for at få den åbnet.

#### Hvilke værktøjer skal jeg bruge til at teste email-konfigurations bedste praksis og IP-ry {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Tag et kig på vores [FAQ her](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
