# Selvhostet {#self-hosted}


## Innholdsfortegnelse {#table-of-contents}

* [Kom i gang](#getting-started)
* [Krav](#requirements)
  * [Cloud-init / Brukerdata](#cloud-init--user-data)
* [Installere](#install)
  * [Feilsøke installasjonsskript](#debug-install-script)
  * [Spørsmål](#prompts)
  * [Første oppsett (Alternativ 1)](#initial-setup-option-1)
* [Tjenester](#services)
  * [Viktige filstier](#important-file-paths)
* [Konfigurasjon](#configuration)
  * [Første DNS-oppsett](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testing](#testing)
  * [Opprette ditt første alias](#creating-your-first-alias)
  * [Sende / Motta din første e-post](#sending--receiving-your-first-email)
* [Feilsøking](#troubleshooting)
  * [Hva er brukernavn og passord for basic auth](#what-is-the-basic-auth-username-and-password)
  * [Hvordan vet jeg hva som kjører](#how-do-i-know-what-is-running)
  * [Hvordan vet jeg om noe ikke kjører som det skal](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hvordan finner jeg logger](#how-do-i-find-logs)
  * [Hvorfor tidsavbrytes mine utgående e-poster](#why-are-my-outgoing-emails-timing-out)


## Kom i gang {#getting-started}

Vår selvhostede e-postløsning, som alle våre produkter, er 100 % åpen kildekode—både frontend og backend. Dette betyr:

1. **Fullstendig åpenhet**: Hver linje med kode som behandler e-postene dine er tilgjengelig for offentlig gjennomgang
2. **Bidrag fra fellesskapet**: Alle kan bidra med forbedringer eller fikse problemer
3. **Sikkerhet gjennom åpenhet**: Sårbarheter kan identifiseres og fikses av et globalt fellesskap
4. **Ingen leverandørlås**: Du er aldri avhengig av at vårt selskap eksisterer

Hele kodebasen er tilgjengelig på GitHub på <https://github.com/forwardemail/forwardemail.net>, lisensiert under MIT-lisensen.

Arkitekturen inkluderer containere for:

* SMTP-server for utgående e-post
* IMAP/POP3-servere for e-posthenting
* Webgrensesnitt for administrasjon
* Database for lagring av konfigurasjon
* Redis for caching og ytelse
* SQLite for sikker, kryptert postkasselagring

> \[!NOTE]
> Sørg for å sjekke ut vår [selvhostede blogg](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Og for de som er interessert i en mer detaljert steg-for-steg versjon, se våre [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserte guider.


## Krav {#requirements}

Før du kjører installasjonsskriptet, sørg for at du har følgende:

* **Operativsystem**: En Linux-basert server (støtter for øyeblikket Ubuntu 22.04+).
* **Ressurser**: 1 vCPU og 2GB RAM
* **Root-tilgang**: Administrative rettigheter for å kjøre kommandoer.
* **Domenenavn**: Et egendefinert domene klart for DNS-konfigurasjon.
* **Ren IP**: Sørg for at serveren din har en ren IP-adresse uten tidligere spam-reputasjon ved å sjekke svartelister. Mer info [her](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Offentlig IP-adresse med støtte for port 25
* Mulighet til å sette [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Støtte for IPv4 og IPv6

> \[!TIP]
> Se vår liste over [fantastiske mailserver-leverandører](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Brukerdata {#cloud-init--user-data}

De fleste skyleverandører støtter en cloud-init-konfigurasjon for når den virtuelle private serveren (VPS) blir provisjonert. Dette er en flott måte å sette noen filer og miljøvariabler på forhånd for bruk av skriptets første oppsettslogikk, som vil omgå behovet for å spørre om tilleggsinformasjon mens skriptet kjører.

**Alternativer**

* `EMAIL` - e-post brukt for certbot-utløpspåminnelser
* `DOMAIN` - egendefinert domene (f.eks. `example.com`) brukt for selvhostet oppsett
* `AUTH_BASIC_USERNAME` - brukernavn brukt i første oppsett for å beskytte siden
* `AUTH_BASIC_PASSWORD` - passord brukt i første oppsett for å beskytte siden
* `/root/.cloudflare.ini` - (**Kun for Cloudflare-brukere**) Cloudflare-konfigurasjonsfil brukt av certbot for DNS-konfigurasjon. Den krever at du setter API-token via `dns_cloudflare_api_token`. Les mer [her](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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

Kjør følgende kommando på serveren din for å laste ned og kjøre installasjonsskriptet:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Feilsøk installasjonsskript {#debug-install-script}

Legg til `DEBUG=true` foran installasjonsskriptet for detaljert utdata:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Valg {#prompts}

```sh
1. Initial oppsett
2. Sett opp sikkerhetskopier
3. Sett opp automatiske oppgraderinger
4. Forny sertifikater
5. Gjenopprett fra sikkerhetskopi
6. Hjelp
7. Avslutt
```

* **Initial oppsett**: Last ned den nyeste forward email-koden, konfigurer miljøet, spør etter ditt egendefinerte domene og sett opp alle nødvendige sertifikater, nøkler og hemmeligheter.
* **Sett opp sikkerhetskopi**: Setter opp en cron for å sikkerhetskopiere mongoDB og redis ved bruk av en S3-kompatibel lagring for sikker, ekstern lagring. Separat vil sqlite sikkerhetskopieres ved pålogging hvis det er endringer for sikre, krypterte sikkerhetskopier.
* **Sett opp oppgradering**: Setter opp en cron for å se etter nattlige oppdateringer som trygt vil bygge om og starte infrastrukturkomponenter på nytt.
* **Forny sertifikater**: Certbot / lets encrypt brukes for SSL-sertifikater og nøkler som utløper hver 3. måned. Dette vil fornye sertifikatene for domenet ditt og plassere dem i nødvendig mappe for at relaterte komponenter skal kunne bruke dem. Se [viktige filbaner](#important-file-paths)
* **Gjenopprett fra sikkerhetskopi**: Vil trigge mongodb og redis til å gjenopprette fra sikkerhetskopidata.

### Initial oppsett (Valg 1) {#initial-setup-option-1}

Velg alternativ `1. Initial oppsett` for å starte.

Når det er fullført, bør du se en suksessmelding. Du kan til og med kjøre `docker ps` for å se **de** komponentene som er startet. Mer informasjon om komponenter nedenfor.


## Tjenester {#services}

| Tjenestenavn |         Standardport        | Beskrivelse                                            |
| ------------ | :-------------------------: | ------------------------------------------------------ |
| Web          |            `443`            | Webgrensesnitt for all administrasjon                  |
| API          |            `4000`           | API-lag for å abstrahere databaser                      |
| Bree         |             Ingen           | Bakgrunnsjobb og oppgavekjører                          |
| SMTP         | `465` (anbefalt) / `587`   | SMTP-server for utgående e-post                         |
| SMTP Bree    |             Ingen           | SMTP bakgrunnsjobb                                      |
| MX           |            `2525`           | Mail exchange for innkommende e-post og videresending  |
| IMAP         |          `993/2993`         | IMAP-server for innkommende e-post og postkassehåndtering |
| POP3         |          `995/2995`         | POP3-server for innkommende e-post og postkassehåndtering |
| SQLite       |            `3456`           | SQLite-server for interaksjoner med sqlite-database(r) |
| SQLite Bree  |             Ingen           | SQLite bakgrunnsjobb                                    |
| CalDAV       |            `5000`           | CalDAV-server for kalenderhåndtering                    |
| CardDAV      |            `6000`           | CardDAV-server for kalenderhåndtering                   |
| MongoDB      |           `27017`           | MongoDB-database for mest databehandling                |
| Redis        |            `6379`           | Redis for caching og tilstandshåndtering                |
| SQLite       |             Ingen           | SQLite-database(r) for krypterte postkasser             |

### Viktige filbaner {#important-file-paths}

Merk: *Vertssti* nedenfor er relativ til `/root/forwardemail.net/self-hosting/`.

| Komponent              |       Vertssti        | Containersti                 |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-fil                |        `./.env`       | `/app/.env`                  |
| SSL-sertifikater/nøkler|        `./ssl`        | `/app/ssl/`                  |
| Privat nøkkel          |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Full kjede-sertifikat  | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA-sertifikat          |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM privat nøkkel     |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Lagre `.env`-filen sikkert. Den er kritisk for gjenoppretting ved feil.
> Du finner den i `/root/forwardemail.net/self-hosting/.env`.


## Konfigurasjon {#configuration}

### Initial DNS-oppsett {#initial-dns-setup}

Hos din foretrukne DNS-leverandør, konfigurer de riktige DNS-postene. Merk at alt i parenteser (`<>`) er dynamisk og må oppdateres med din verdi.

| Type  | Navn               | Innhold                      | TTL  |
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

Reverse DNS (rDNS) eller reverse pointer-poster (PTR-poster) er essensielle for e-postservere fordi de hjelper med å verifisere legitimiteten til serveren som sender e-posten. Hver skyleverandør gjør dette forskjellig, så du må undersøke hvordan du legger til "Reverse DNS" for å koble vert og IP til tilsvarende vertsnavn. Mest sannsynlig i nettverksseksjonen hos leverandøren.

#### Port 25 blokkert {#port-25-blocked}

Noen ISP-er og skyleverandører blokkerer port 25 for å unngå misbruk. Du må kanskje sende inn en supportsak for å åpne port 25 for SMTP / utgående e-post.


## Oppstart {#onboarding}

1. Åpne landingssiden
   Naviger til https\://\<domain_name>, og erstatt \<domain_name> med domenet konfigurert i dine DNS-innstillinger. Du skal se Forward Email landingssiden.

2. Logg inn og registrer domenet ditt

* Logg inn med en gyldig e-postadresse og passord.
* Skriv inn domenenavnet du ønsker å sette opp (dette må samsvare med DNS-konfigurasjonen).
* Følg instruksjonene for å legge til nødvendige **MX** og **TXT** poster for verifisering.

3. Fullfør oppsettet

* Når verifisert, gå til Alias-siden for å opprette ditt første alias.
* Valgfritt: konfigurer **SMTP for utgående e-post** i **Domeneinnstillinger**. Dette krever ekstra DNS-poster.

> \[!NOTE]
> Ingen informasjon sendes utenfor din server. Selvhostet alternativ og initial konto er kun for admin-innlogging og webvisning for å administrere domener, aliaser og relaterte e-postkonfigurasjoner.


## Testing {#testing}

### Opprette ditt første alias {#creating-your-first-alias}

1. Gå til Alias-siden
   Åpne alias-administrasjonssiden:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Legg til et nytt alias

* Klikk **Legg til alias** (øverst til høyre).
* Skriv inn aliasnavnet og juster e-postinnstillingene etter behov.
* (Valgfritt) Aktiver **IMAP/POP3/CalDAV/CardDAV** støtte ved å krysse av i boksen.
* Klikk **Opprett alias.**

3. Sett et passord

* Klikk **Generer passord** for å lage et sikkert passord.
* Dette passordet kreves for å logge inn i e-postklienten din.

4. Konfigurer e-postklienten din

* Bruk en e-postklient som Thunderbird.
* Skriv inn aliasnavnet og det genererte passordet.
* Konfigurer **IMAP** og **SMTP** innstillingene deretter.

#### E-postserverinnstillinger {#email-server-settings}

Brukernavn: `<alias name>`

| Type | Vertnavn           | Port | Tilkoblingssikkerhet | Autentisering  |
| ---- | ------------------ | ---- | -------------------- | -------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS            | Vanlig passord |
| IMAP | imap.<domain_name> | 993  | SSL / TLS            | Vanlig passord |

### Sende / motta din første e-post {#sending--receiving-your-first-email}

Når konfigurert, skal du kunne sende og motta e-post til din nylig opprettede og selvhostede e-postadresse!
## Feilsøking {#troubleshooting}

#### Hvorfor fungerer ikke dette utenfor Ubuntu og Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi jobber for øyeblikket med å støtte MacOS og vil se på andre plattformer. Vennligst åpne en [diskusjon](https://github.com/orgs/forwardemail/discussions) eller bidra hvis du ønsker å se støtte for andre.

#### Hvorfor feiler certbot acme-utfordringen {#why-is-the-certbot-acme-challenge-failing}

Den vanligste feilen er at certbot / letsencrypt noen ganger vil be om **2** utfordringer. Du må være sikker på å legge til **BEGGE** txt-postene.

Eksempel:
Du kan se to utfordringer som dette:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det er også mulig at DNS-propagasjonen ikke er fullført. Du kan bruke verktøy som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dette gir deg en indikasjon på om TXT-postendringene dine skal være synlige. Det er også mulig at lokal DNS-cache på verten din fortsatt bruker en gammel, utdatert verdi eller ikke har plukket opp de siste endringene.

Et annet alternativ er å bruke de automatiserte cerbot DNS-endringene ved å sette `/root/.cloudflare.ini`-filen med API-token i din cloud-init / user-data ved første VPS-oppsett eller opprette denne filen og kjøre skriptet på nytt. Dette vil håndtere DNS-endringene og utfordringsoppdateringene automatisk.

### Hva er brukernavn og passord for basic auth {#what-is-the-basic-auth-username-and-password}

For selvhosting legger vi til en første gang nettleserinnfødt autentiserings-popup med et enkelt brukernavn (`admin`) og passord (tilfeldig generert ved første oppsett). Vi legger dette til som beskyttelse i tilfelle automatisering / skriptere på en eller annen måte er raskere til å registrere seg på webopplevelsen. Du finner dette passordet etter første oppsett i din `.env`-fil under `AUTH_BASIC_USERNAME` og `AUTH_BASIC_PASSWORD`.

### Hvordan vet jeg hva som kjører {#how-do-i-know-what-is-running}

Du kan kjøre `docker ps` for å se alle kjørende containere som startes fra `docker-compose-self-hosting.yml`-filen. Du kan også kjøre `docker ps -a` for å se alt (inkludert containere som ikke kjører).

### Hvordan vet jeg om noe ikke kjører som det burde {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan kjøre `docker ps -a` for å se alt (inkludert containere som ikke kjører). Du kan se en exit-logg eller notat.

### Hvordan finner jeg logger {#how-do-i-find-logs}

Du kan få flere logger via `docker logs -f <container_name>`. Hvis noe har avsluttet, er det sannsynligvis relatert til at `.env`-filen er feil konfigurert.

Innenfor webgrensesnittet kan du se `/admin/emails` og `/admin/logs` for utgående e-postlogger og feillogger henholdsvis.

### Hvorfor tidsavbrytes mine utgående e-poster {#why-are-my-outgoing-emails-timing-out}

Hvis du ser en melding som Connection timed out when connecting to MX server... må du kanskje sjekke om port 25 er blokkert. Det er vanlig at ISP-er eller skyleverandører blokkerer denne som standard, og du må kanskje kontakte support / sende inn en sak for å få den åpnet.

#### Hvilke verktøy bør jeg bruke for å teste beste praksis for e-postkonfigurasjon og IP-omdømme {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Ta en titt på vår [FAQ her](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
