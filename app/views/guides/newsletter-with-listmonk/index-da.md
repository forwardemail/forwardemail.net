# Listmonk med Forward Email til sikker nyhedsbrevslevering {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [Hvorfor Listmonk og Forward Email](#why-listmonk-and-forward-email)
* [Forudsætninger](#prerequisites)
* [Installation](#installation)
  * [1. Opdater din server](#1-update-your-server)
  * [2. Installer afhængigheder](#2-install-dependencies)
  * [3. Download Listmonk-konfiguration](#3-download-listmonk-configuration)
  * [4. Konfigurer firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurer HTTPS-adgang](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Konfigurer Forward Email SMTP i Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurer bounce-behandling](#8-configure-bounce-processing)
* [Testning](#testing)
  * [Opret en mailingliste](#create-a-mailing-list)
  * [Tilføj abonnenter](#add-subscribers)
  * [Opret og send en kampagne](#create-and-send-a-campaign)
* [Verifikation](#verification)
* [Udviklernoter](#developer-notes)
* [Konklusion](#conclusion)


## Oversigt {#overview}

Denne vejledning giver udviklere trin-for-trin instruktioner til opsætning af [Listmonk](https://listmonk.app/), en kraftfuld open source nyhedsbrev- og mailinglisteadministrator, til at bruge [Forward Email](https://forwardemail.net/) som sin SMTP-udbyder. Denne kombination giver dig mulighed for effektivt at administrere dine kampagner samtidig med, at du sikrer sikker, privat og pålidelig e-mail-levering.

* **Listmonk**: Håndterer abonnentstyring, listeorganisering, kampagneoprettelse og performance-tracking.
* **Forward Email**: Fungerer som den sikre SMTP-server, der håndterer den faktiske afsendelse af e-mails med indbyggede sikkerhedsfunktioner som SPF, DKIM, DMARC og TLS-kryptering.

Ved at integrere disse to bevarer du fuld kontrol over dine data og infrastruktur, samtidig med at du udnytter Forward Emails robuste leveringssystem.


## Hvorfor Listmonk og Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Både Listmonk og principperne bag Forward Email lægger vægt på gennemsigtighed og kontrol. Du hoster selv Listmonk og ejer dine data.
* **Privatlivsfokuseret**: Forward Email er bygget med privatliv som kerne, minimerer datalagring og fokuserer på sikker transmission.
* **Omkostningseffektivt**: Listmonk er gratis, og Forward Email tilbyder generøse gratis niveauer og overkommelige betalte planer, hvilket gør dette til en budgetvenlig løsning.
* **Skalerbarhed**: Listmonk er meget performant, og Forward Emails infrastruktur er designet til pålidelig levering i stor skala.
* **Udviklervenligt**: Listmonk tilbyder et robust API, og Forward Email leverer enkel SMTP-integration og webhooks.


## Forudsætninger {#prerequisites}

Før du begynder, skal du sikre dig, at du har følgende:

* En Virtual Private Server (VPS) med en nyere Linux-distribution (Ubuntu 20.04+ anbefales) med mindst 1 CPU og 1GB RAM (2GB anbefales).
  * Brug for en udbyder? Se den [anbefalede VPS-liste](https://github.com/forwardemail/awesome-mail-server-providers).
* Et domænenavn, som du kontrollerer (DNS-adgang påkrævet).
* En aktiv konto hos [Forward Email](https://forwardemail.net/).
* Root- eller `sudo`-adgang til din VPS.
* Grundlæggende kendskab til Linux-kommandolinjeoperationer.


## Installation {#installation}

Disse trin guider dig gennem installation af Listmonk ved hjælp af Docker og Docker Compose på din VPS.

### 1. Opdater din server {#1-update-your-server}

Sørg for, at systemets pakkeliste og installerede pakker er opdaterede.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installer afhængigheder {#2-install-dependencies}

Installer Docker, Docker Compose og UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Download Listmonk-konfiguration {#3-download-listmonk-configuration}

Opret en mappe til Listmonk og download den officielle `docker-compose.yml` fil.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Denne fil definerer Listmonk-applikationscontaineren og dens nødvendige PostgreSQL-databasecontainer.
### 4. Konfigurer Firewall (UFW) {#4-configure-firewall-ufw}

Tillad essentiel trafik (SSH, HTTP, HTTPS) gennem firewallen. Hvis din SSH kører på en ikke-standard port, juster derefter.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bekræft aktivering af firewall, når du bliver bedt om det.

### 5. Konfigurer HTTPS-adgang {#5-configure-https-access}

Det er afgørende for sikkerheden at køre Listmonk over HTTPS. Du har to primære muligheder:

#### Mulighed A: Brug af Cloudflare Proxy (Anbefalet for enkelhed) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Hvis dit domænes DNS administreres af Cloudflare, kan du udnytte deres proxy-funktion for nem HTTPS.

1. **Peg DNS**: Opret en `A`-post i Cloudflare for dit Listmonk-underdomæne (f.eks. `listmonk.ditdomæne.com`) der peger på din VPS IP-adresse. Sørg for, at **Proxy status** er sat til **Proxied** (orange sky).
2. **Ændr Docker Compose**: Rediger den `docker-compose.yml` fil, du har downloadet:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Dette gør Listmonk tilgængelig internt på port 80, som Cloudflare så kan proxy og sikre med HTTPS.

#### Mulighed B: Brug af en Reverse Proxy (Nginx, Caddy, osv.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativt kan du opsætte en reverse proxy som Nginx eller Caddy på din VPS til at håndtere HTTPS-terminering og proxy-forespørgsler til Listmonk (som kører på port 9000 som standard).

* Behold standard `ports: - "127.0.0.1:9000:9000"` i `docker-compose.yml` for at sikre, at Listmonk kun er tilgængelig lokalt.
* Konfigurer din valgte reverse proxy til at lytte på portene 80 og 443, håndtere SSL-certifikatindhentning (f.eks. via Let's Encrypt), og videresende trafik til `http://127.0.0.1:9000`.
* Detaljeret opsætning af reverse proxy ligger uden for denne guides omfang, men mange vejledninger findes online.

### 6. Start Listmonk {#6-start-listmonk}

Naviger tilbage til din `listmonk` mappe (hvis du ikke allerede er der) og start containerne i detached mode.

```bash
cd ~/listmonk # Eller den mappe hvor du har gemt docker-compose.yml
docker compose up -d
```

Docker vil downloade de nødvendige images og starte Listmonk-applikationen og databasecontainerne. Det kan tage et minut eller to første gang.

✅ **Adgang til Listmonk**: Du burde nu kunne tilgå Listmonk webgrænsefladen via det domæne, du har konfigureret (f.eks. `https://listmonk.ditdomæne.com`).

### 7. Konfigurer Forward Email SMTP i Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Dernæst skal du konfigurere Listmonk til at sende e-mails ved hjælp af din Forward Email-konto.

1. **Aktivér SMTP i Forward Email**: Sørg for, at du har genereret SMTP-legitimationsoplysninger i dit Forward Email-konto dashboard. Følg [Forward Email guiden til at sende e-mail med et brugerdefineret domæne via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp), hvis du ikke allerede har gjort det.
2. **Konfigurer Listmonk**: Log ind på dit Listmonk adminpanel.
   * Gå til **Indstillinger -> SMTP**.

   * Listmonk har indbygget support for Forward Email. Vælg **ForwardEmail** fra udbyderlisten, eller indtast manuelt følgende oplysninger:

     | Indstilling       | Værdi                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth protocol** | `LOGIN`                                                                                                             |
     | **Brugernavn**    | Dit Forward Email **SMTP brugernavn**                                                                               |
     | **Adgangskode**   | Dit Forward Email **SMTP adgangskode**                                                                              |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **Fra e-mail**    | Din ønskede `From` adresse (f.eks. `newsletter@ditdomæne.com`). Sørg for, at dette domæne er konfigureret i Forward Email. |
* **Vigtigt**: Brug altid Port `465` med `SSL/TLS` for sikre forbindelser med Forward Email (anbefalet). Port `587` med STARTTLS understøttes også, men SSL/TLS foretrækkes.

   * Klik på **Gem**.
3. **Send testmail**: Brug knappen "Send test-e-mail" på SMTP-indstillingssiden. Indtast en modtageradresse, du har adgang til, og klik på **Send**. Bekræft, at e-mailen ankommer til modtagerens indbakke.

### 8. Konfigurer Bounce-behandling {#8-configure-bounce-processing}

Bounce-behandling gør det muligt for Listmonk automatisk at håndtere e-mails, der ikke kunne leveres (f.eks. på grund af ugyldige adresser). Forward Email tilbyder en webhook til at underrette Listmonk om bounces.

#### Forward Email opsætning {#forward-email-setup}

1. Log ind på dit [Forward Email Dashboard](https://forwardemail.net/).
2. Gå til **Domæner**, vælg det domæne, du bruger til afsendelse, og gå til dets **Indstillinger**-side.
3. Rul ned til sektionen **Bounce Webhook URL**.
4. Indtast følgende URL, hvor du erstatter `<your_listmonk_domain>` med det faktiske domæne eller subdomæne, hvor din Listmonk-instans er tilgængelig:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Eksempel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Rul yderligere ned til sektionen **Webhook Signature Payload Verification Key**.
6. **Kopier** den genererede verifikationsnøgle. Du skal bruge den i Listmonk.
7. Gem ændringerne i dine Forward Email domæneindstillinger.

#### Listmonk opsætning {#listmonk-setup}

1. I dit Listmonk administrationspanel, gå til **Indstillinger -> Bounces**.
2. Aktiver **Aktivér bounce-behandling**.
3. Aktiver **Aktivér bounce-webhooks**.
4. Rul ned til sektionen **Webhook-udbydere**.
5. Aktiver **Forward Email**.
6. Indsæt den **Webhook Signature Payload Verification Key**, du kopierede fra Forward Email dashboardet, i feltet **Forward Email Key**.
7. Klik på **Gem** nederst på siden.
8. Bounce-behandling er nu konfigureret! Når Forward Email registrerer en bounce for en e-mail sendt af Listmonk, vil det underrette din Listmonk-instans via webhooken, og Listmonk vil markere abonnenten tilsvarende.
9. Fuldfør trinnene nedenfor i [Testning](#testing) for at sikre, at alt fungerer.

## Testning {#testing}

Her er en hurtig oversigt over kernefunktionerne i Listmonk:

### Opret en mailingliste {#create-a-mailing-list}

* Gå til **Lister** i sidepanelet.
* Klik på **Ny liste**.
* Udfyld oplysningerne (Navn, Type: Offentlig/Privat, Beskrivelse, Tags) og klik på **Gem**.

### Tilføj abonnenter {#add-subscribers}

* Gå til sektionen **Abonnenter**.
* Du kan tilføje abonnenter:
  * **Manuelt**: Klik på **Ny abonnent**.
  * **Import**: Klik på **Importer abonnenter** for at uploade en CSV-fil.
  * **API**: Brug Listmonk API til programmatisk tilføjelse.
* Tildel abonnenter til en eller flere lister under oprettelse eller import.
* **Bedste praksis**: Brug en dobbelt opt-in proces. Konfigurer dette under **Indstillinger -> Opt-in & abonnementer**.

### Opret og send en kampagne {#create-and-send-a-campaign}

* Gå til **Kampagner** -> **Ny kampagne**.
* Udfyld kampagnedetaljerne (Navn, Emne, Fra e-mail, Liste(r) der skal sendes til).
* Vælg din indholdstype (Rich Text/HTML, Almindelig tekst, Raw HTML).
* Skriv dit e-mailindhold. Du kan bruge skabelonvariabler som `{{ .Subscriber.Email }}` eller `{{ .Subscriber.FirstName }}`.
* **Send altid en testmail først!** Brug "Send test"-muligheden for at forhåndsvise e-mailen i din indbakke.
* Når du er tilfreds, klik på **Start kampagne** for at sende med det samme eller planlægge den til senere.

## Verifikation {#verification}

* **SMTP-levering**: Send regelmæssigt testmails via Listmonks SMTP-indstillingsside og testkampagner for at sikre, at e-mails leveres korrekt.
* **Bounce-håndtering**: Send en testkampagne til en kendt ugyldig e-mailadresse (f.eks. `bounce-test@yourdomain.com`, hvis du ikke har en rigtig ved hånden, selvom resultaterne kan variere). Tjek kampagnestatistikkerne i Listmonk efter kort tid for at se, om bouncen er registreret.
* **E-mail headers**: Brug værktøjer som [Mail-Tester](https://www.mail-tester.com/) eller undersøg e-mail headers manuelt for at verificere, at SPF, DKIM og DMARC passerer, hvilket indikerer korrekt opsætning via Forward Email.
* **Forward Email logs**: Tjek dine Forward Email dashboard-logs, hvis du mistænker leveringsproblemer, der stammer fra SMTP-serveren.
## Developer Notes {#developer-notes}

* **Templating**: Listmonk bruger Go's templatemotor. Udforsk dens dokumentation for avanceret personalisering: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk tilbyder en omfattende REST API til håndtering af lister, abonnenter, kampagner, skabeloner og mere. Find API-dokumentationslinket i din Listmonk-instances footer.
* **Custom Fields**: Definer brugerdefinerede abonnentfelter under **Settings -> Subscriber Fields** for at gemme yderligere data.
* **Webhooks**: Udover bounces kan Listmonk sende webhooks for andre begivenheder (f.eks. abonnementer), hvilket muliggør integration med andre systemer.


## Conclusion {#conclusion}

Ved at integrere den selvhostede kraft fra Listmonk med den sikre, privatlivsrespekterende levering fra Forward Email skaber du en robust og etisk e-mail marketingplatform. Du bevarer fuld ejerskab over dine publikumsdata, samtidig med at du drager fordel af høj leveringsrate og automatiserede sikkerhedsfunktioner.

Denne opsætning giver et skalerbart, omkostningseffektivt og udviklervenligt alternativ til proprietære e-mailtjenester, som passer perfekt til ånden i open source-software og brugerens privatliv.

God afsendelse! 🚀
