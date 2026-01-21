# Selvhostet {#self-hosted}

## Innholdsfortegnelse {#table-of-contents}

* [Komme i gang](#getting-started)
* [Krav](#requirements)
  * [Cloud-initiering / Brukerdata](#cloud-init--user-data)
* [Installer](#install)
  * [Feilsøkingsskript for installasjon](#debug-install-script)
  * [Leder](#prompts)
  * [Førstegangsoppsett (alternativ 1)](#initial-setup-option-1)
* [Tjenester](#services)
  * [Viktige filstier](#important-file-paths)
* [Konfigurasjon](#configuration)
  * [Første DNS-oppsett](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testing](#testing)
  * [Oppretter ditt første alias](#creating-your-first-alias)
  * [Sende/motta din første e-post](#sending--receiving-your-first-email)
* [Feilsøking](#troubleshooting)
  * [Hva er det grunnleggende brukernavnet og passordet for autentisering](#what-is-the-basic-auth-username-and-password)
  * [Hvordan vet jeg hva som kjører](#how-do-i-know-what-is-running)
  * [Hvordan vet jeg om noe som burde kjører ikke](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hvordan finner jeg logger](#how-do-i-find-logs)
  * [Hvorfor går tidsgrensen for utgående e-poster](#why-are-my-outgoing-emails-timing-out)

## Komme i gang {#getting-started}

Vår selvhostede e-postløsning, som alle våre produkter, er 100 % åpen kildekode – både frontend og backend. Dette betyr:

1. **Fullstendig åpenhet**: Hver kodelinje som behandler e-postene dine er tilgjengelig for offentlig gransking.
2. **Bidrag fra fellesskapet**: Alle kan bidra med forbedringer eller fikse problemer.
3. **Sikkerhet gjennom åpenhet**: Sårbarheter kan identifiseres og fikses av et globalt fellesskap.
4. **Ingen leverandørbinding**: Du er aldri avhengig av selskapets eksistens.

Hele kodebasen er tilgjengelig på GitHub på <https://github.com/forwardemail/forwardemail.net>, lisensiert under MIT-lisensen.

Arkitekturen inkluderer containere for:

* SMTP-server for utgående e-post
* IMAP/POP3-servere for henting av e-post
* Webgrensesnitt for administrasjon
* Database for konfigurasjonslagring
* Redis for mellomlagring og ytelse
* SQLite for sikker, kryptert postkasselagring

> \[!NOTE]
> Sørg for å sjekke ut vår [selvhostet blogg](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Og for de som er interessert i en mer detaljert trinnvis versjon, se våre [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-baserte veiledninger.

## Krav {#requirements}

Før du kjører installasjonsskriptet, må du sørge for at du har følgende:

* **Operativsystem**: En Linux-basert server (støtter for øyeblikket Ubuntu 22.04+).
* **Ressurser**: 1 vCPU og 2 GB RAM
* **Root-tilgang**: Administratorrettigheter for å utføre kommandoer.
* **Domenenavn**: Et tilpasset domene klart for DNS-konfigurasjon.
* **Ren IP**: Sørg for at serveren din har en ren IP-adresse uten tidligere spam-rykte ved å sjekke svartelister. Mer informasjon: [her](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Offentlig IP-adresse med støtte for port 25
* Mulighet for å angi [omvendt PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Støtte for IPv4 og IPv6

> \[!TIP]
> Se listen vår over [fantastiske leverandører av e-postservere](https://github.com/forwardemail/awesome-mail-server-providers)

### Skyinitiering / Brukerdata {#cloud-init--user-data}

De fleste skyleverandører støtter en skyinitieringskonfigurasjon for når den virtuelle private serveren (VPS) klargjøres. Dette er en fin måte å angi noen filer og miljøvariabler på forhånd for bruk av skriptets første oppsettlogikk, noe som vil omgå behovet for å spørre om tilleggsinformasjon mens skriptet kjører.

**Alternativer**

* `EMAIL` - e-post brukt for påminnelser om utløp av Certbot
* `DOMAIN` - tilpasset domene (f.eks. `example.com`) brukt for oppsett av selvhosting
* `AUTH_BASIC_USERNAME` - brukernavn brukt ved første gangs oppsett for å beskytte nettstedet
* `AUTH_BASIC_PASSWORD` - passord brukt ved første gangs oppsett for å beskytte nettstedet
* `/root/.cloudflare.ini` - (**Kun Cloudflare-brukere**) Cloudflare-konfigurasjonsfil brukt av Certbot for DNS-konfigurasjon. Det krever at du angir API-tokenet ditt via `dns_cloudflare_api_token`. Les mer om [her](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

### Feilsøking av installasjonsskript {#debug-install-script}

Legg til `DEBUG=true` foran installasjonsskriptet for detaljert utdata:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Leder {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Første oppsett**: Last ned den nyeste koden for videresending av e-post, konfigurer miljøet, spør etter ditt egendefinerte domene og konfigurer alle nødvendige sertifikater, nøkler og hemmeligheter.
* **Konfigurer sikkerhetskopiering**: Vil sette opp en cron for å sikkerhetskopiere mongoDB og redis ved hjelp av et S3-kompatibelt lager for sikker, ekstern lagring. Sqlite vil bli sikkerhetskopiert separat ved innlogging hvis det er endringer for sikre, krypterte sikkerhetskopier.
* **Konfigurer oppgradering**: Konfigurer en cron for å se etter nattlige oppdateringer som trygt vil gjenoppbygge og starte infrastrukturkomponenter på nytt.
* **Forny sertifikater**: Certbot / lets encrypt brukes for SSL-sertifikater, og nøklene utløper hver tredje måned. Dette vil fornye sertifikatene for domenet ditt og plassere dem i den nødvendige mappen for relaterte komponenter å bruke. Se [viktige filstier](#important-file-paths)
* **Gjenopprett fra sikkerhetskopi**: Vil utløse mongodb og redis for å gjenopprette fra sikkerhetskopidata.

### Førstegangsoppsett (alternativ 1) {#initial-setup-option-1}

Velg alternativet `1. Initial setup` for å begynne.

Når det er fullført, skal du se en suksessmelding. Du kan til og med kjøre `docker ps` for å se komponentene starte opp. Mer informasjon om komponentene nedenfor.

## Tjenester {#services}

| Tjenestenavn | Standardport | Beskrivelse |
| ------------ | :----------: | ------------------------------------------------------ |
| Nett | `443` | Nettgrensesnitt for alle administratorinteraksjoner |
| API | `4000` | API-lag til abstrakte databaser |
| Bree | Ingen | Bakgrunnsjobb og oppgaveløper |
| SMTP | `465/587` | SMTP-server for utgående e-post |
| SMTP Bree | Ingen | SMTP-bakgrunnsjobb |
| MX | `2525` | Postutveksling for innkommende e-post og videresending av e-post |
| IMAP | `993/2993` | IMAP-server for innkommende e-post og postkasseadministrasjon |
| POP3 | `995/2995` | POP3-server for innkommende e-post og postkasseadministrasjon |
| SQLite | `3456` | SQLite-server for interaksjoner med SQLite-database(r) |
| SQLite Bree | Ingen | SQLite-bakgrunnsjobb |
| CalDAV | `5000` | CalDAV-server for kalenderadministrasjon |
| CardDAV | `6000` | CardDAV-server for kalenderadministrasjon |
| MongoDB | `27017` | MongoDB-database for mesteparten av datahåndteringen |
| Redis | `6379` | Redis for mellomlagring og tilstandsadministrasjon |
| SQLite | Ingen | SQLite-database(r) for krypterte postbokser |

### Viktige filstier {#important-file-paths}

Merk: *Vertsbanen* nedenfor er relativ til `/root/forwardemail.net/self-hosting/`.

| Komponent | Vertssti | Beholderbane |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Konvoluttfil | `./.env` | `/app/.env` |
| SSL-sertifikater/-nøkler | `./ssl` | `/app/ssl/` |
| Privat nøkkel | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Fullt kjedesertifikat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Sertifiserte CA-er | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM privatnøkkel | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Lagre `.env`-filen på en sikker måte. Den er avgjørende for gjenoppretting ved feil.
> Du finner denne i `/root/forwardemail.net/self-hosting/.env`.

## Konfigurasjon {#configuration}

### Første DNS-oppsett {#initial-dns-setup}

Konfigurer de riktige DNS-oppføringene i din valgte DNS-leverandør. Vær oppmerksom på at alt i parentes (`<>`) er dynamisk og må oppdateres med verdien din.

| Type | Navn | Innhold | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", eller blankt | <ip_adresse> | bil |
| CNAME | API | <domenenavn> | bil |
| CNAME | caldav | <domenenavn> | bil |
| CNAME | carddav | <domenenavn> | bil |
| CNAME | fe-spretter | <domenenavn> | bil |
| CNAME | imap | <domenenavn> | bil |
| CNAME | mx | <domenenavn> | bil |
| CNAME | pop3 | <domenenavn> | bil |
| CNAME | smtp | <domenenavn> | bil |
| MX | "@", ".", eller blankt | mx.<domenenavn> (prioritet 0) | bil |
| TXT | "@", ".", eller blankt | "v=spf1 a -all" | bil |

#### Omvendt DNS-/PTR-oppføring {#reverse-dns--ptr-record}

Omvendt DNS (rDNS) eller reverse pointer-poster (PTR-poster) er viktige for e-postservere fordi de bidrar til å bekrefte legitimiteten til serveren som sender e-posten. Hver skyleverandør gjør dette forskjellig, så du må slå opp hvordan du legger til "Omvendt DNS" for å tilordne verten og IP-adressen til det tilsvarende vertsnavnet. Mest sannsynlig i nettverksdelen av leverandøren.

#### Port 25 blokkert {#port-25-blocked}

Noen internettleverandører og skyleverandører blokkerer port 25 for å unngå skadelige aktører. Du må kanskje sende inn en supportforespørsel for å åpne port 25 for SMTP / utgående e-post.

## Onboarding {#onboarding}

1. Åpne landingssiden
Naviger til https\://\<domenenavn>, og erstatt \<domenenavn> med domenet som er konfigurert i DNS-innstillingene dine. Du skal se landingssiden for videresending av e-post.

2. Logg inn og registrer domenet ditt

* Logg inn med gyldig e-postadresse og passord.
* Skriv inn domenenavnet du ønsker å sette opp (dette må samsvare med DNS-konfigurasjonen).
* Følg instruksjonene for å legge til de nødvendige **MX**- og **TXT**-postene for bekreftelse.

3. Fullfør oppsettet

* Når dette er bekreftet, går du til Aliaser-siden for å opprette ditt første alias.
* Du kan eventuelt konfigurere **SMTP for utgående e-post** i **Domeneinnstillingene**. Dette krever flere DNS-oppføringer.

> \[!NOTE]
> Ingen informasjon sendes utenfor serveren din. Alternativet for selvhosting og den første kontoen er kun for administratorinnlogging og nettvisning for å administrere domener, aliaser og relaterte e-postkonfigurasjoner.

## Testing {#testing}

### Oppretter ditt første alias {#creating-your-first-alias}

1. Naviger til Aliaser-siden
Åpne aliashåndteringssiden:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Legg til et nytt alias

* Klikk på **Legg til alias** (øverst til høyre).
* Skriv inn aliasnavnet og juster e-postinnstillingene etter behov.
* (Valgfritt) Aktiver støtte for **IMAP/POP3/CalDAV/CardDAV** ved å merke av i boksen.
* Klikk på **Opprett alias**.

3. Angi et passord

* Klikk på **Generer passord** for å opprette et sikkert passord.

* Dette passordet kreves for å logge inn på e-postklienten din.

4. Konfigurer e-postklienten din

* Bruk en e-postklient som Thunderbird.
* Skriv inn aliasnavnet og det genererte passordet.
* Konfigurer innstillingene for **IMAP** og **SMTP** deretter.

#### Innstillinger for e-postserver {#email-server-settings}

Brukernavn: `<alias name>`

| Type | Vertsnavn | Havn | Tilkoblingssikkerhet | Autentisering |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domenenavn> | 465 | SSL / TLS | Vanlig passord |
| IMAP | imap.<domenenavn> | 993 | SSL / TLS | Vanlig passord |

### Sender/mottar din første e-post {#sending--receiving-your-first-email}

Når du er konfigurert, skal du kunne sende og motta e-post til den nyopprettede og selvhostede e-postadressen din!

## Feilsøking {#troubleshooting}

#### Hvorfor fungerer ikke dette utenfor Ubuntu og Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi ser for tiden etter støtte for MacOS, og vil se etter andre. Åpne en [diskusjon](https://github.com/orgs/forwardemail/discussions) eller bidra hvis du ønsker at andre skal få støtte.

#### Hvorfor mislykkes certbot acme-utfordringen {#why-is-the-certbot-acme-challenge-failing}

Den vanligste fallgruven er at certbot/letsencrypt noen ganger ber om **2** utfordringer. Du må sørge for å legge til **BEGGE** txt-oppføringer.

Eksempel:
Du kan se to utfordringer som denne:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det er også mulig at DNS-forplantningen ikke er fullført. Du kan bruke verktøy som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dette vil gi deg en idé om endringene i TXT-posten din skal gjenspeiles. Det er også mulig at den lokale DNS-cachen på verten din fortsatt bruker en gammel, foreldet verdi eller ikke har plukket opp de siste endringene.

Et annet alternativ er å bruke de automatiserte Cerbot DNS-endringene ved å sette `/root/.cloudflare.ini`-filen med API-tokenet i cloud-init / user-data ved første VPS-oppsett, eller opprette denne filen og kjøre skriptet på nytt. Dette vil administrere DNS-endringene og utfordre oppdateringer automatisk.

### Hva er det grunnleggende brukernavnet og passordet for godkjenning {#what-is-the-basic-auth-username-and-password}

For selvhosting legger vi til et popup-vindu for førstegangs autentisering av nettleseren med et enkelt brukernavn (`admin`) og passord (tilfeldig generert ved første oppsett). Vi legger kun til dette som en beskyttelse i tilfelle automatisering/skraping på en eller annen måte foregriper deg når du registrerer deg på nett. Du finner dette passordet etter første oppsett i `.env`-filen under `AUTH_BASIC_USERNAME` og `AUTH_BASIC_PASSWORD`.

### Hvordan vet jeg hva som kjører {#how-do-i-know-what-is-running}

Du kan kjøre `docker ps` for å se alle de kjørende containerne som spinnes opp fra `docker-compose-self-hosting.yml`-filen. Du kan også kjøre `docker ps -a` for å se alt (inkludert containere som ikke kjører).

### Hvordan vet jeg om noe som ikke kjører, men som burde være {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan kjøre `docker ps -a` for å se alt (inkludert containere som ikke kjører). Du kan se en avslutningslogg eller et notat.

### Hvordan finner jeg logger {#how-do-i-find-logs}

Du kan få flere logger via `docker logs -f <container_name>`. Hvis noe ble avsluttet, er det sannsynligvis relatert til at `.env`-filen er feil konfigurert.

I nettgrensesnittet kan du se `/admin/emails` og `/admin/logs` for henholdsvis utgående e-postlogger og feillogger.

### Hvorfor får jeg utgående e-poster tidsavbrudd {#why-are-my-outgoing-emails-timing-out}

Hvis du ser en melding som «Tilkoblingen ble tidsavbrutt ved tilkobling til MX-server...», må du kanskje sjekke om port 25 er blokkert. Det er vanlig at internettleverandører eller skyleverandører blokkerer dette som standard, og du må kanskje kontakte kundestøtte/sende inn en sak for å få dette åpnet.

#### Hvilke verktøy bør jeg bruke for å teste beste praksis for e-postkonfigurasjon og IP-omdømme {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Ta en titt på vår [Vanlige spørsmål her](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).