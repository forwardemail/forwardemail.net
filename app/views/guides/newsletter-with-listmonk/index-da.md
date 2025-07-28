# Listmonk med videresendelse af e-mail til sikker levering af nyhedsbreve {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [Hvorfor Listmonk og videresende e-mail](#why-listmonk-and-forward-email)
* [Forudsætninger](#prerequisites)
* [Installation](#installation)
  * [1. Opdater din server](#1-update-your-server)
  * [2. Installer afhængigheder](#2-install-dependencies)
  * [3. Download Listmonk-konfigurationen](#3-download-listmonk-configuration)
  * [4. Konfigurer firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurer HTTPS-adgang](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Konfigurer SMTP til videresendelse af e-mail i Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurer afvisningsbehandling](#8-configure-bounce-processing)
* [Afprøvning](#testing)
  * [Opret en postliste](#create-a-mailing-list)
  * [Tilføj abonnenter](#add-subscribers)
  * [Opret og send en kampagne](#create-and-send-a-campaign)
* [Verifikation](#verification)
* [Udviklernoter](#developer-notes)
* [Konklusion](#conclusion)

## Oversigt {#overview}

Denne vejledning giver udviklere trinvise instruktioner til opsætning af [Listmonk](https://listmonk.app/), en effektiv open source-nyhedsbrevs- og mailinglisteadministrator, til at bruge [Videresend e-mail](https://forwardemail.net/) som SMTP-udbyder. Denne kombination giver dig mulighed for at administrere dine kampagner effektivt, samtidig med at du sikrer sikker, privat og pålidelig e-maillevering.

* **Listmonk**: Håndterer abonnentadministration, listeorganisering, kampagneoprettelse og præstationssporing.
* **Videresend e-mail**: Fungerer som den sikre SMTP-server, der håndterer selve afsendelsen af e-mails med indbyggede sikkerhedsfunktioner som SPF, DKIM, DMARC og TLS-kryptering.

Ved at integrere disse to bevarer du fuld kontrol over dine data og infrastruktur, samtidig med at du udnytter Forward Emails robuste leveringssystem.

## Hvorfor Listmonk og videresende e-mail {#why-listmonk-and-forward-email}

* **Open Source**: Både Listmonk og principperne bag Forward Email lægger vægt på gennemsigtighed og kontrol. Du hoster selv Listmonk og ejer dine data.
* **Privatlivsfokuseret**: Forward Email er bygget med privatliv i centrum, hvilket minimerer dataopbevaring og fokuserer på sikker transmission.
* **Omkostningseffektiv**: Listmonk er gratis, og Forward Email tilbyder generøse gratis niveauer og overkommelige betalte planer, hvilket gør dette til en budgetvenlig løsning.
* **Skalerbarhed**: Listmonk er yderst effektiv, og Forward Emails infrastruktur er designet til pålidelig levering i stor skala.
* **Udviklervenlig**: Listmonk tilbyder en robust API, og Forward Email leverer ligetil SMTP-integration og webhooks.

## Forudsætninger {#prerequisites}

Før du begynder, skal du sørge for at have følgende:

* En virtuel privat server (VPS), der kører en nyere Linux-distribution (Ubuntu 20.04+ anbefales) med mindst 1 CPU og 1 GB RAM (2 GB anbefales).

* Har du brug for en udbyder? Tjek [anbefalet VPS-liste](https://github.com/forwardemail/awesome-mail-server-providers).

* Et domænenavn, du kontrollerer (DNS-adgang kræves).

* En aktiv konto med [Videresend e-mail](https://forwardemail.net/).

* Root- eller `sudo` adgang til din VPS.

* Grundlæggende kendskab til Linux-kommandolinjeoperationer.

## Installation {#installation}

Disse trin guider dig gennem installationen af Listmonk ved hjælp af Docker og Docker Compose på din VPS.

### 1. Opdater din server {#1-update-your-server}

Sørg for, at dit systems pakkeliste og installerede pakker er opdaterede.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installer afhængigheder {#2-install-dependencies}

Installer Docker, Docker Compose og UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Download Listmonk-konfiguration {#3-download-listmonk-configuration}

Opret en mappe til Listmonk og download den officielle `docker-compose.yml`-fil.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Denne fil definerer Listmonk-applikationscontaineren og dens nødvendige PostgreSQL-databasecontainer.

### 4. Konfigurer firewall (UFW) {#4-configure-firewall-ufw}

Tillad essentiel trafik (SSH, HTTP, HTTPS) gennem firewallen. Hvis din SSH kører på en ikke-standard port, skal du justere den i overensstemmelse hermed.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bekræft aktivering af firewallen, når du bliver bedt om det.

### 5. Konfigurer HTTPS-adgang {#5-configure-https-access}

Det er afgørende for sikkerheden at køre Listmonk over HTTPS. Du har to primære muligheder:

#### Mulighed A: Brug af Cloudflare Proxy (anbefales af hensyn til enkelhed) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Hvis dit domænes DNS administreres af Cloudflare, kan du udnytte deres proxyfunktion til nem HTTPS.

1. **Point DNS**: Opret en `A` record i Cloudflare for dit Listmonk-underdomæne (f.eks. `listmonk.yourdomain.com`), der peger på din VPS IP-adresse. Sørg for, at **Proxy-status** er indstillet til **Proxy** (orange sky).

2. **Rediger Docker Compose**: Rediger den `docker-compose.yml` fil, du downloadede:

```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Dette gør Listmonk tilgængelig internt på port 80, som Cloudflare derefter kan proxy og sikre med HTTPS.

#### Mulighed B: Brug af en omvendt proxy (Nginx, Caddy osv.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativt kan du opsætte en reverse proxy som Nginx eller Caddy på din VPS til at håndtere HTTPS-terminering og proxyanmodninger til Listmonk (kører som standard på port 9000).

* Behold standardværdien `ports: - "127.0.0.1:9000:9000"` i `docker-compose.yml` for at sikre, at Listmonk kun er tilgængelig lokalt.

* Konfigurer din valgte reverse proxy til at lytte på port 80 og 443, håndtere SSL-certifikatanskaffelse (f.eks. via Let's Encrypt) og videresende trafik til `http://127.0.0.1:9000`.

* Detaljeret opsætning af reverse proxy ligger uden for denne vejlednings omfang, men mange vejledninger er tilgængelige online.

### 6. Start Listmonk {#6-start-listmonk}

Naviger tilbage til din `listmonk`-mappe (hvis du ikke allerede er der), og start containerne i frakoblet tilstand.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker downloader de nødvendige billeder og starter Listmonk-applikationen og databasecontainerne. Det kan tage et minut eller to første gang.

✅ **Adgang til Listmonk**: Du burde nu kunne få adgang til Listmonks webgrænseflade via det domæne, du har konfigureret (f.eks. `https://listmonk.yourdomain.com`).

### 7. Konfigurer SMTP til videresendelse af e-mail i Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Konfigurer derefter Listmonk til at sende e-mails ved hjælp af din videresendte e-mail-konto.

1. **Aktivér SMTP i Videresend e-mail**: Sørg for, at du har genereret SMTP-legitimationsoplysninger i dit dashboard til Videresend e-mail. Følg [Guide til videresendelse af e-mail til at sende e-mail med et brugerdefineret domæne via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp), hvis du ikke allerede har gjort det.

2. **Konfigurer Listmonk**: Log ind på dit Listmonk-administrationspanel.

* Naviger til **Indstillinger -> SMTP**.

* Listmonk har indbygget understøttelse af videresendelse af e-mail. Vælg **Videresendelse af e-mail** fra udbyderlisten, eller indtast følgende oplysninger manuelt:

| Indstilling | Værdi |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Vært** | `smtp.forwardemail.net` |
| **Havn** | `465` |
| **Godkendelsesprotokol** | `LOGIN` |
| **Brugernavn** | Din videresendelses-e-mail **SMTP-brugernavn** |
| **Adgangskode** | Din videresendte e-mail **SMTP-adgangskode** |
| **TLS** | `SSL/TLS` |
| **Fra e-mail** | Din ønskede `From`-adresse (f.eks. `newsletter@yourdomain.com`). Sørg for, at dette domæne er konfigureret i Videresend e-mail. |

* **Vigtigt**: Brug altid port `465` med `SSL/TLS` for sikre forbindelser med videresendelse af e-mail. Brug ikke STARTTLS (port 587).

* Klik på **Gem**.
3. **Send test-e-mail**: Brug knappen "Send test-e-mail" på SMTP-indstillingssiden. Indtast en modtageradresse, du har adgang til, og klik på **Send**. Bekræft, at e-mailen ankommer til modtagerens indbakke.

### 8. Konfigurer afvisningsbehandling {#8-configure-bounce-processing}

Afvisningsbehandling gør det muligt for Listmonk automatisk at håndtere e-mails, der ikke kunne leveres (f.eks. på grund af ugyldige adresser). Videresend e-mail leverer en webhook til at underrette Listmonk om afvisninger.

#### Opsætning af videresendelse af e-mail {#forward-email-setup}

1. Log ind på din [Dashboard for videresendelse af e-mail](https://forwardemail.net/).
2. Naviger til **Domæner**, vælg det domæne, du bruger til at sende, og gå til siden **Indstillinger**.
3. Rul ned til sektionen **Afvis Webhook URL**.
4. Indtast følgende URL, og erstat `<your_listmonk_domain>` med det faktiske domæne eller underdomæne, hvor din Listmonk-instans er tilgængelig:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Eksempel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Rul længere ned til sektionen **Webhook Signature Payload Verification Key**.
6. **Kopier** den genererede bekræftelsesnøgle. Du skal bruge denne i Listmonk.
7. Gem ændringerne i dine domæneindstillinger for Videresend e-mail.

#### Listmonk-opsætning {#listmonk-setup}

1. I dit Listmonk-administrationspanel skal du navigere til **Indstillinger -> Afvisninger**.
2. Aktiver **Aktiver afvisningsbehandling**.
3. Aktiver **Aktiver afvisningswebhooks**.
4. Rul ned til afsnittet **Webhook-udbydere**.
5. Aktiver **Videresend e-mail**.
6. Indsæt den **Webhook-signaturbekræftelsesnøgle**, som du kopierede fra dashboardet til videresendelse af e-mail, i feltet **Videresend e-mailnøgle**.
7. Klik på **Gem** nederst på siden.
8. Afvisningsbehandling er nu konfigureret! Når Videresend e-mail registrerer en afvisning for en e-mail sendt af Listmonk, vil den underrette din Listmonk-instans via webhooken, og Listmonk vil markere abonnenten i overensstemmelse hermed.
9. Udfør nedenstående trin i [Afprøvning](#testing) for at sikre, at alt fungerer.

## Testning af {#testing}

Her er et hurtigt overblik over Listmonks kernefunktioner:

### Opret en mailingliste {#create-a-mailing-list}

* Gå til **Lister** i sidebjælken.
* Klik på **Ny liste**.
* Udfyld oplysningerne (Navn, Type: Offentlig/Privat, Beskrivelse, Tags) og **Gem**.

### Tilføj abonnenter {#add-subscribers}

* Naviger til sektionen **Abonnenter**.
* Du kan tilføje abonnenter:
* **Manuelt**: Klik på **Ny abonnent**.
* **Importer**: Klik på **Importer abonnenter** for at uploade en CSV-fil.
* **API**: Brug Listmonk API'en til programmatiske tilføjelser.
* Tildel abonnenter til en eller flere lister under oprettelse eller import.
* **Bedste praksis**: Brug en dobbelt tilmeldingsproces. Konfigurer dette under **Indstillinger -> Tilmelding og abonnementer**.

### Opret og send en kampagne {#create-and-send-a-campaign}

* Gå til **Kampagner** -> **Ny kampagne**.
* Udfyld kampagneoplysningerne (Navn, Emne, Fra e-mail, Liste(r) der skal sendes til).
* Vælg din indholdstype (Rich Text/HTML, Almindelig tekst, Rå HTML).
* Skriv dit e-mailindhold. Du kan bruge skabelonvariabler som `{{ .Subscriber.Email }}` eller `{{ .Subscriber.FirstName }}`.
* **Send altid en test-e-mail først!** Brug muligheden "Send test" for at se et eksempel på e-mailen i din indbakke.
* Når du er tilfreds, skal du klikke på **Start kampagne** for at sende den med det samme eller planlægge den til senere.

## Bekræftelse {#verification}

* **SMTP-levering**: Send regelmæssigt test-e-mails via Listmonks SMTP-indstillingsside og testkampagner for at sikre, at e-mails leveres korrekt.
* **Håndtering af afvisninger**: Send en testkampagne til en kendt ugyldig e-mailadresse (f.eks. `bounce-test@yourdomain.com`, hvis du ikke har en rigtig en ved hånden, selvom resultaterne kan variere). Tjek kampagnestatistikkerne i Listmonk efter et kort stykke tid for at se, om afvisningen er registreret.
* **E-mail-headere**: Brug værktøjer som [Mail Tester](https://www.mail-tester.com/), eller inspicer e-mail-headere manuelt for at bekræfte, at SPF, DKIM og DMARC sendes, hvilket indikerer korrekt opsætning via Videresend e-mail.
* **Logfiler til Videresend e-mail**: Tjek dine logfiler til dashboardet Videresend e-mail, hvis du har mistanke om leveringsproblemer, der stammer fra SMTP-serveren.

## Udviklernoter {#developer-notes}

* **Skabeloner**: Listmonk bruger Gos skabelonmotor. Udforsk dokumentationen for avanceret personalisering: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk leverer en omfattende REST API til administration af lister, abonnenter, kampagner, skabeloner og mere. Find linket til API-dokumentationen i din Listmonk-instans' sidefod.
* **Brugerdefinerede felter**: Definer brugerdefinerede abonnentfelter under **Indstillinger -> Abonnentfelter** for at gemme yderligere data.
* **Webhooks**: Udover bounces kan Listmonk sende webhooks til andre hændelser (f.eks. abonnementer), hvilket muliggør integration med andre systemer.

## Konklusion {#conclusion}

Ved at integrere Listmonks selvhostede kraft med den sikre, privatlivsrespekterende levering af Forward Email, skaber du en robust og etisk e-mailmarketingplatform. Du bevarer fuldt ejerskab over dine målgruppedata, samtidig med at du drager fordel af høj leveringsevne og automatiserede sikkerhedsfunktioner.

Denne opsætning giver et skalerbart, omkostningseffektivt og udviklervenligt alternativ til proprietære e-mailtjenester, der er perfekt i overensstemmelse med etosen bag open source-software og brugernes privatliv.

God fornøjelse med afsendelsen! 🚀