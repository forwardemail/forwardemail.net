# Listmonk med Forward Email for sikker nyhetsbrevlevering {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Hvorfor Listmonk og Forward Email](#why-listmonk-and-forward-email)
* [Forutsetninger](#prerequisites)
* [Installasjon](#installation)
  * [1. Oppdater serveren din](#1-update-your-server)
  * [2. Installer avhengigheter](#2-install-dependencies)
  * [3. Last ned Listmonk-konfigurasjon](#3-download-listmonk-configuration)
  * [4. Konfigurer brannmur (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurer HTTPS-tilgang](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Konfigurer Forward Email SMTP i Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurer Bounce-behandling](#8-configure-bounce-processing)
* [Testing](#testing)
  * [Opprett en mailingliste](#create-a-mailing-list)
  * [Legg til abonnenter](#add-subscribers)
  * [Opprett og send en kampanje](#create-and-send-a-campaign)
* [Verifisering](#verification)
* [Utviklernotater](#developer-notes)
* [Konklusjon](#conclusion)


## Oversikt {#overview}

Denne guiden gir utviklere trinnvise instruksjoner for å sette opp [Listmonk](https://listmonk.app/), en kraftig åpen kildekode nyhetsbrev- og mailinglistebehandler, for å bruke [Forward Email](https://forwardemail.net/) som sin SMTP-leverandør. Denne kombinasjonen lar deg administrere kampanjene dine effektivt samtidig som du sikrer sikker, privat og pålitelig e-postlevering.

* **Listmonk**: Håndterer abonnentadministrasjon, listeorganisering, kampanjeopprettelse og ytelsessporing.
* **Forward Email**: Fungerer som den sikre SMTP-serveren, og håndterer den faktiske utsendelsen av e-poster med innebygde sikkerhetsfunksjoner som SPF, DKIM, DMARC og TLS-kryptering.

Ved å integrere disse to beholder du full kontroll over dine data og infrastruktur samtidig som du utnytter Forward Emails robuste leveringssystem.


## Hvorfor Listmonk og Forward Email {#why-listmonk-and-forward-email}

* **Åpen kildekode**: Både Listmonk og prinsippene bak Forward Email legger vekt på åpenhet og kontroll. Du hoster Listmonk selv og eier dine data.
* **Personvernfokusert**: Forward Email er bygget med personvern i kjernen, minimerer datalagring og fokuserer på sikker overføring.
* **Kostnadseffektivt**: Listmonk er gratis, og Forward Email tilbyr generøse gratisnivåer og rimelige betalte planer, noe som gjør dette til en budsjettvennlig løsning.
* **Skalerbarhet**: Listmonk er svært ytelsessterk, og Forward Emails infrastruktur er designet for pålitelig levering i stor skala.
* **Utviklervennlig**: Listmonk tilbyr et robust API, og Forward Email gir enkel SMTP-integrasjon og webhooks.


## Forutsetninger {#prerequisites}

Før du begynner, sørg for at du har følgende:

* En virtuell privat server (VPS) som kjører en nyere Linux-distribusjon (Ubuntu 20.04+ anbefales) med minst 1 CPU og 1GB RAM (2GB anbefales).
  * Trenger du en leverandør? Sjekk ut [anbefalt VPS-liste](https://github.com/forwardemail/awesome-mail-server-providers).
* Et domenenavn som du kontrollerer (DNS-tilgang kreves).
* En aktiv konto hos [Forward Email](https://forwardemail.net/).
* Root- eller `sudo`-tilgang til VPS-en din.
* Grunnleggende kjennskap til Linux-kommandolinjeoperasjoner.


## Installasjon {#installation}

Disse trinnene veileder deg gjennom installasjon av Listmonk ved bruk av Docker og Docker Compose på din VPS.

### 1. Oppdater serveren din {#1-update-your-server}

Sørg for at systemets pakkeliste og installerte pakker er oppdaterte.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installer avhengigheter {#2-install-dependencies}

Installer Docker, Docker Compose og UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Last ned Listmonk-konfigurasjon {#3-download-listmonk-configuration}

Opprett en katalog for Listmonk og last ned den offisielle `docker-compose.yml`-filen.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Denne filen definerer Listmonk-applikasjonscontaineren og dens nødvendige PostgreSQL-databasecontainer.
### 4. Konfigurer brannmur (UFW) {#4-configure-firewall-ufw}

Tillat essensiell trafikk (SSH, HTTP, HTTPS) gjennom brannmuren. Hvis SSH kjører på en ikke-standard port, juster deretter.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bekreft aktivering av brannmuren når du blir spurt.

### 5. Konfigurer HTTPS-tilgang {#5-configure-https-access}

Å kjøre Listmonk over HTTPS er avgjørende for sikkerheten. Du har to hovedalternativer:

#### Alternativ A: Bruke Cloudflare Proxy (Anbefalt for enkelhet) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Hvis domenets DNS administreres av Cloudflare, kan du bruke deres proxy-funksjon for enkel HTTPS.

1. **Pek DNS**: Opprett en `A`-post i Cloudflare for din Listmonk-underdomene (f.eks. `listmonk.dittdomene.com`) som peker til VPS-IP-adressen din. Sørg for at **Proxy status** er satt til **Proxied** (oransje sky).
2. **Endre Docker Compose**: Rediger `docker-compose.yml`-filen du lastet ned:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Dette gjør Listmonk tilgjengelig internt på port 80, som Cloudflare deretter kan proxy og sikre med HTTPS.

#### Alternativ B: Bruke en Reverse Proxy (Nginx, Caddy, osv.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativt kan du sette opp en reverse proxy som Nginx eller Caddy på VPS-en din for å håndtere HTTPS-terminering og proxy-forespørsler til Listmonk (som kjører på port 9000 som standard).

* Behold standard `ports: - "127.0.0.1:9000:9000"` i `docker-compose.yml` for å sikre at Listmonk kun er tilgjengelig lokalt.
* Konfigurer valgt reverse proxy til å lytte på portene 80 og 443, håndtere SSL-sertifikatinnhenting (f.eks. via Let's Encrypt), og videresende trafikk til `http://127.0.0.1:9000`.
* Detaljert oppsett av reverse proxy er utenfor denne veiledningens omfang, men mange guider finnes tilgjengelig på nettet.

### 6. Start Listmonk {#6-start-listmonk}

Naviger tilbake til `listmonk`-mappen din (hvis du ikke allerede er der) og start containerne i detached modus.

```bash
cd ~/listmonk # Eller mappen der du lagret docker-compose.yml
docker compose up -d
```

Docker vil laste ned nødvendige bilder og starte Listmonk-applikasjonen og databasecontainerne. Det kan ta ett eller to minutter første gang.

✅ **Tilgang til Listmonk**: Du skal nå kunne få tilgang til Listmonk webgrensesnitt via domenet du konfigurerte (f.eks. `https://listmonk.dittdomene.com`).

### 7. Konfigurer Forward Email SMTP i Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Deretter konfigurerer du Listmonk til å sende e-poster ved hjelp av Forward Email-kontoen din.

1. **Aktiver SMTP i Forward Email**: Sørg for at du har generert SMTP-legitimasjon i Forward Email-kontoens dashbord. Følg [Forward Email-guiden for å sende e-post med egendefinert domene via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) hvis du ikke har gjort det allerede.
2. **Konfigurer Listmonk**: Logg inn på Listmonk adminpanel.
   * Gå til **Innstillinger -> SMTP**.

   * Listmonk har innebygd støtte for Forward Email. Velg **ForwardEmail** fra leverandørlisten, eller skriv inn følgende detaljer manuelt:

     | Innstilling       | Verdi                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth protocol** | `LOGIN`                                                                                                             |
     | **Brukernavn**    | Ditt Forward Email **SMTP-brukernavn**                                                                              |
     | **Passord**       | Ditt Forward Email **SMTP-passord**                                                                                 |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **Fra e-post**    | Din ønskede `Fra`-adresse (f.eks. `newsletter@dittdomene.com`). Sørg for at dette domenet er konfigurert i Forward Email. |
* **Viktig**: Bruk alltid Port `465` med `SSL/TLS` for sikre tilkoblinger med Forward Email (anbefalt). Port `587` med STARTTLS støttes også, men SSL/TLS foretrekkes.

   * Klikk **Lagre**.
3. **Send test-e-post**: Bruk knappen "Send test-e-post" på SMTP-innstillingssiden. Skriv inn en mottakeradresse du har tilgang til og klikk **Send**. Bekreft at e-posten kommer frem i mottakerens innboks.

### 8. Konfigurer Bounce-behandling {#8-configure-bounce-processing}

Bounce-behandling lar Listmonk automatisk håndtere e-poster som ikke kunne leveres (f.eks. på grunn av ugyldige adresser). Forward Email tilbyr en webhook for å varsle Listmonk om bounces.

#### Forward Email-oppsett {#forward-email-setup}

1. Logg inn på din [Forward Email Dashboard](https://forwardemail.net/).
2. Gå til **Domains**, velg domenet du bruker for sending, og gå til dets **Settings**-side.
3. Bla ned til seksjonen **Bounce Webhook URL**.
4. Skriv inn følgende URL, og erstatt `<your_listmonk_domain>` med det faktiske domenet eller underdomenet hvor din Listmonk-instans er tilgjengelig:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Eksempel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Bla videre ned til seksjonen **Webhook Signature Payload Verification Key**.
6. **Kopier** den genererte verifiseringsnøkkelen. Du trenger denne i Listmonk.
7. Lagre endringene i Forward Email-domeneinnstillingene dine.

#### Listmonk-oppsett {#listmonk-setup}

1. I Listmonk adminpanel, gå til **Settings -> Bounces**.
2. Aktiver **Enable bounce processing**.
3. Aktiver **Enable bounce webhooks**.
4. Bla ned til seksjonen **Webhook Providers**.
5. Aktiver **Forward Email**.
6. Lim inn **Webhook Signature Payload Verification Key** du kopierte fra Forward Email dashboard i feltet **Forward Email Key**.
7. Klikk **Save** nederst på siden.
8. Bounce-behandling er nå konfigurert! Når Forward Email oppdager en bounce for en e-post sendt av Listmonk, vil det varsle din Listmonk-instans via webhook, og Listmonk vil merke abonnenten deretter.
9. Fullfør stegene nedenfor i [Testing](#testing) for å sikre at alt fungerer.

## Testing {#testing}

Her er en rask oversikt over kjernefunksjoner i Listmonk:

### Opprett en mailingliste {#create-a-mailing-list}

* Gå til **Lists** i sidemenyen.
* Klikk **New List**.
* Fyll inn detaljer (Navn, Type: Public/Private, Beskrivelse, Tags) og **Lagre**.

### Legg til abonnenter {#add-subscribers}

* Gå til seksjonen **Subscribers**.
* Du kan legge til abonnenter:
  * **Manuelt**: Klikk **New Subscriber**.
  * **Importer**: Klikk **Import Subscribers** for å laste opp en CSV-fil.
  * **API**: Bruk Listmonk API for programmatisk tillegg.
* Tildel abonnenter til en eller flere lister under opprettelse eller import.
* **Beste praksis**: Bruk en dobbel opt-in-prosess. Konfigurer dette under **Settings -> Opt-in & Subscriptions**.

### Opprett og send en kampanje {#create-and-send-a-campaign}

* Gå til **Campaigns** -> **New Campaign**.
* Fyll inn kampanjedetaljer (Navn, Emne, Fra e-post, Liste(r) som skal sendes til).
* Velg innholdstype (Rich Text/HTML, Plain Text, Raw HTML).
* Skriv e-postinnholdet ditt. Du kan bruke malvariabler som `{{ .Subscriber.Email }}` eller `{{ .Subscriber.FirstName }}`.
* **Send alltid en test-e-post først!** Bruk "Send test"-valget for å forhåndsvise e-posten i din innboks.
* Når du er fornøyd, klikk **Start Campaign** for å sende umiddelbart eller planlegg for senere.

## Verifisering {#verification}

* **SMTP-levering**: Send jevnlig test-e-poster via Listmonks SMTP-innstillingsside og testkampanjer for å sikre at e-postene leveres korrekt.
* **Bounce-håndtering**: Send en testkampanje til en kjent ugyldig e-postadresse (f.eks. `bounce-test@yourdomain.com` hvis du ikke har en ekte tilgjengelig, men resultater kan variere). Sjekk kampanjestatistikken i Listmonk etter kort tid for å se om bounce er registrert.
* **E-posthoder**: Bruk verktøy som [Mail-Tester](https://www.mail-tester.com/) eller inspiser e-posthoder manuelt for å verifisere at SPF, DKIM og DMARC godkjennes, noe som indikerer korrekt oppsett via Forward Email.
* **Forward Email-logger**: Sjekk loggene i Forward Email dashboard hvis du mistenker leveringsproblemer som stammer fra SMTP-serveren.
## Utviklernotater {#developer-notes}

* **Templating**: Listmonk bruker Go sitt templating-system. Utforsk dokumentasjonen for avansert personalisering: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk tilbyr en omfattende REST API for å administrere lister, abonnenter, kampanjer, maler og mer. Finn API-dokumentasjonslenken i bunnteksten på din Listmonk-instans.
* **Egendefinerte felt**: Definer egendefinerte abonnentfelt under **Innstillinger -> Abonnentfelt** for å lagre ekstra data.
* **Webhooks**: I tillegg til avvisninger kan Listmonk sende webhooks for andre hendelser (f.eks. abonnementer), noe som muliggjør integrasjon med andre systemer.


## Konklusjon {#conclusion}

Ved å integrere den selvhostede kraften til Listmonk med den sikre, personvernrespekterende leveringen fra Forward Email, skaper du en robust og etisk e-postmarkedsføringsplattform. Du beholder full eierskap til publikumsdataene dine samtidig som du drar nytte av høy leveringsgrad og automatiserte sikkerhetsfunksjoner.

Denne oppsettet gir et skalerbart, kostnadseffektivt og utviklervennlig alternativ til proprietære e-posttjenester, som passer perfekt med ånden i åpen kildekode-programvare og brukerens personvern.

Lykke til med utsendelsen! 🚀
