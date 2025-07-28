# Listmonk med videresending av e-post for sikker nyhetsbrevlevering {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Hvorfor Listmonk og videresende e-post](#why-listmonk-and-forward-email)
* [Forutsetninger](#prerequisites)
* [Installasjon](#installation)
  * [1. Oppdater serveren din](#1-update-your-server)
  * [2. Installer avhengigheter](#2-install-dependencies)
  * [3. Last ned Listmonk-konfigurasjonen](#3-download-listmonk-configuration)
  * [4. Konfigurer brannmur (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurer HTTPS-tilgang](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Konfigurer SMTP for videresending av e-post i Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurer avvisningsbehandling](#8-configure-bounce-processing)
* [Testing](#testing)
  * [Opprett en e-postliste](#create-a-mailing-list)
  * [Legg til abonnenter](#add-subscribers)
  * [Opprett og send en kampanje](#create-and-send-a-campaign)
* [Bekreftelse](#verification)
* [Utviklernotater](#developer-notes)
* [Konklusjon](#conclusion)

## Oversikt {#overview}

Denne veiledningen gir utviklere trinnvise instruksjoner for hvordan du konfigurerer [Listemunk](https://listmonk.app/), en kraftig nyhetsbrev- og e-postlisteadministrator med åpen kildekode, for å bruke [Videresend e-post](https://forwardemail.net/) som SMTP-leverandør. Denne kombinasjonen lar deg administrere kampanjene dine effektivt samtidig som du sikrer sikker, privat og pålitelig e-postlevering.

* **Listmonk**: Håndterer abonnentadministrasjon, listeorganisering, kampanjeoppretting og resultatsporing.

* **Videresend e-post**: Fungerer som en sikker SMTP-server og håndterer selve sendingen av e-poster med innebygde sikkerhetsfunksjoner som SPF, DKIM, DMARC og TLS-kryptering.

Ved å integrere disse to beholder du full kontroll over dataene og infrastrukturen din samtidig som du utnytter Forward Emails robuste leveringssystem.

## Hvorfor Listmonk og videresende e-post {#why-listmonk-and-forward-email}

* **Åpen kildekode**: Både Listmonk og prinsippene bak Forward Email vektlegger åpenhet og kontroll. Du er vert for Listmonk selv og eier dataene dine.
* **Personvernfokusert**: Forward Email er bygget med personvern i kjernen, minimerer datalagring og fokuserer på sikker overføring.
* **Kostnadseffektivt**: Listmonk er gratis, og Forward Email tilbyr sjenerøse gratisnivåer og rimelige betalte planer, noe som gjør dette til en budsjettvennlig løsning.
* **Skalerbarhet**: Listmonk er svært ytelsessterk, og Forward Emails infrastruktur er designet for pålitelig levering i stor skala.
* **Utviklervennlig**: Listmonk tilbyr et robust API, og Forward Email gir enkel SMTP-integrasjon og webhooks.

## Forutsetninger {#prerequisites}

Før du begynner, sørg for at du har følgende:

* En virtuell privat server (VPS) som kjører en nylig Linux-distribusjon (Ubuntu 20.04+ anbefales) med minst 1 CPU og 1 GB RAM (2 GB anbefales).

* Trenger du en leverandør? Sjekk ut [anbefalt VPS-liste](https://github.com/forwardemail/awesome-mail-server-providers).

* Et domenenavn du kontrollerer (DNS-tilgang kreves).

* En aktiv konto med [Videresend e-post](https://forwardemail.net/).

* Root- eller `sudo`-tilgang til din VPS.

* Grunnleggende kjennskap til Linux-kommandolinjeoperasjoner.

## Installasjon {#installation}

Disse trinnene veileder deg gjennom installasjonen av Listmonk ved hjelp av Docker og Docker Compose på VPS-en din.

### 1. Oppdater serveren din {#1-update-your-server}

Sørg for at systemets pakkeliste og installerte pakker er oppdatert.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installer avhengigheter {#2-install-dependencies}

Installer Docker, Docker Compose og UFW (ukomplisert brannmur).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Last ned Listmonk-konfigurasjonen {#3-download-listmonk-configuration}

Opprett en katalog for Listmonk og last ned den offisielle `docker-compose.yml`-filen.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Denne filen definerer Listmonk-applikasjonscontaineren og den nødvendige PostgreSQL-databasecontaineren.

### 4. Konfigurer brannmur (UFW) {#4-configure-firewall-ufw}

Tillat viktig trafikk (SSH, HTTP, HTTPS) gjennom brannmuren. Hvis SSH-en din kjører på en ikke-standard port, juster deretter.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bekreft aktivering av brannmuren når du blir bedt om det.

### 5. Konfigurer HTTPS-tilgang {#5-configure-https-access}

Det er avgjørende for sikkerheten å kjøre Listmonk over HTTPS. Du har to hovedalternativer:

#### Alternativ A: Bruk av Cloudflare-proxy (anbefales for enkelhets skyld) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Hvis DNS-en til domenet ditt administreres av Cloudflare, kan du bruke proxy-funksjonen deres for enkel HTTPS.

1. **Punkt-DNS**: Opprett en `A`-post i Cloudflare for Listmonk-underdomenet ditt (f.eks. `listmonk.yourdomain.com`) som peker til VPS-IP-adressen din. Sørg for at **Proxy-statusen** er satt til **Proxy** (oransje sky).

2. **Endre Docker Compose**: Rediger `docker-compose.yml`-filen du lastet ned:

```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Dette gjør Listmonk tilgjengelig internt på port 80, som Cloudflare deretter kan proxy og sikre med HTTPS.

#### Alternativ B: Bruk av en omvendt proxy (Nginx, Caddy osv.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativt kan du sette opp en omvendt proxy som Nginx eller Caddy på VPS-en din for å håndtere HTTPS-terminering og proxy-forespørsler til Listmonk (kjører på port 9000 som standard).

* Behold standardinnstillingen `ports: - "127.0.0.1:9000:9000"` i `docker-compose.yml` for å sikre at Listmonk bare er tilgjengelig lokalt.

* Konfigurer den valgte omvendte proxyen til å lytte på port 80 og 443, håndtere SSL-sertifikatinnhenting (f.eks. via Let's Encrypt) og videresende trafikk til `http://127.0.0.1:9000`.

* Detaljert oppsett av omvendt proxy er utenfor rammen av denne veiledningen, men mange veiledninger er tilgjengelige på nettet.

### 6. Start Listmonk {#6-start-listmonk}

Naviger tilbake til `listmonk`-katalogen din (hvis du ikke allerede er der) og start containerne i frakoblet modus.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker laster ned de nødvendige bildene og starter Listmonk-applikasjonen og databasecontainerne. Det kan ta et minutt eller to første gang.

✅ **Tilgang til Listmonk**: Du skal nå kunne få tilgang til Listmonk-nettgrensesnittet via domenet du konfigurerte (f.eks. `https://listmonk.yourdomain.com`).

### 7. Konfigurer SMTP for videresending av e-post i Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Deretter konfigurerer du Listmonk til å sende e-poster ved hjelp av din videresendte e-postkonto.

1. **Aktiver SMTP i Videresend e-post**: Sørg for at du har generert SMTP-legitimasjon i dashbordet for Videresend e-post-kontoen din. Følg [Veiledning for videresending av e-post for å sende e-post med et tilpasset domene via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) hvis du ikke allerede har gjort det.

2. **Konfigurer Listmonk**: Logg inn på Listmonk-administrasjonspanelet ditt.
* Naviger til **Innstillinger -> SMTP**.

* Listmonk har innebygd støtte for videresending av e-post. Velg **Videresending av e-post** fra leverandørlisten, eller skriv inn følgende detaljer manuelt:

| Innstilling | Verdi |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Vert** | `smtp.forwardemail.net` |
| **Havn** | `465` |
| **Autentiseringsprotokoll** | `LOGIN` |
| **Brukernavn** | Din videresendte e-post **SMTP-brukernavn** |
| **Passord** | Din videresendte e-post **SMTP-passord** |
| **TLS** | `SSL/TLS` |
| **Fra e-post** | Din ønskede `From`-adresse (f.eks. `newsletter@yourdomain.com`). Sørg for at dette domenet er konfigurert i Videresend e-post. |

* **Viktig**: Bruk alltid port `465` med `SSL/TLS` for sikre tilkoblinger med videresendt e-post. Ikke bruk STARTTLS (port 587).

* Klikk på **Lagre**.
3. **Send test-e-post**: Bruk knappen «Send test-e-post» på SMTP-innstillingssiden. Skriv inn en mottakeradresse du har tilgang til, og klikk på **Send**. Bekreft at e-posten kommer frem i mottakerens innboks.

### 8. Konfigurer avvisningsbehandling {#8-configure-bounce-processing}

Avvisningsbehandling lar Listmonk automatisk håndtere e-poster som ikke kunne leveres (f.eks. på grunn av ugyldige adresser). Videresend e-post tilbyr en webhook for å varsle Listmonk om avvisninger.

#### Oppsett av videresending av e-post {#forward-email-setup}

1. Logg inn på [Dashbord for videresending av e-post](https://forwardemail.net/).
2. Naviger til **Domener**, velg domenet du bruker til sending, og gå til siden **Innstillinger**.
3. Bla ned til delen **Avvist Webhook-URL**.
4. Skriv inn følgende URL, og erstatt `<your_listmonk_domain>` med det faktiske domenet eller underdomenet der Listmonk-instansen din er tilgjengelig:

```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Eksempel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Bla videre ned til delen **Webhook Signature Payload Verification Key**.
6. **Kopier** den genererte bekreftelsesnøkkelen. Du trenger denne i Listmonk.
7. Lagre endringene i domeneinnstillingene dine for videresending av e-post.

#### Listmonk-oppsett {#listmonk-setup}

1. I Listmonk-administrasjonspanelet ditt, naviger til **Innstillinger -> Avvisninger**.
2. Aktiver **Aktiver avvisningsbehandling**.
3. Aktiver **Aktiver avvisningswebhooks**.
4. Bla ned til delen **Webhook-leverandører**.
5. Aktiver **Videresend e-post**.
6. Lim inn **Webhook-signaturnyttelastverifiseringsnøkkelen** du kopierte fra dashbordet for videresending av e-post i feltet **Videresend e-postnøkkel**.
7. Klikk på **Lagre** nederst på siden.
8. Avvisningsbehandling er nå konfigurert! Når Videresend e-post oppdager en avvisning for en e-post sendt av Listmonk, vil den varsle Listmonk-instansen din via webhooken, og Listmonk vil merke abonnenten deretter.
9. Fullfør trinnene nedenfor i [Testing](#testing) for å sikre at alt fungerer.

## Testing {#testing}

Her er en rask oversikt over de viktigste Listmonk-funksjonene:

### Opprett en e-postliste {#create-a-mailing-list}

* Gå til **Lister** i sidefeltet.
* Klikk på **Ny liste**.
* Fyll ut detaljene (Navn, Type: Offentlig/Privat, Beskrivelse, Tagger) og **Lagre**.

### Legg til abonnenter {#add-subscribers}

* Naviger til **Abonnenter**-delen.
* Du kan legge til abonnenter:
* **Manuelt**: Klikk på **Ny abonnent**.
* **Importer**: Klikk på **Importer abonnenter** for å laste opp en CSV-fil.
* **API**: Bruk Listmonk API for programmatiske tillegg.
* Tildel abonnenter til én eller flere lister under oppretting eller import.
* **Beste praksis**: Bruk en dobbel påmeldingsprosess. Konfigurer dette under **Innstillinger -> Påmelding og abonnementer**.

### Opprett og send en kampanje {#create-and-send-a-campaign}

* Gå til **Kampanjer** -> **Ny kampanje**.
* Fyll ut kampanjedetaljene (Navn, Emne, Fra-e-post, Liste(r) som skal sendes til).
* Velg innholdstype (Rik tekst/HTML, Ren tekst, Rå HTML).
* Skriv e-postinnholdet ditt. Du kan bruke malvariabler som `{{ .Subscriber.Email }}` eller `{{ .Subscriber.FirstName }}`.
* **Send alltid en test-e-post først!** Bruk alternativet «Send test» for å forhåndsvise e-posten i innboksen din.
* Når du er fornøyd, klikker du på **Start kampanje** for å sende den umiddelbart eller planlegge den til senere.

## Verifisering {#verification}

* **SMTP-levering**: Send regelmessig test-e-poster via Listmonks SMTP-innstillingsside og test kampanjer for å sikre at e-postene leveres riktig.
* **Håndtering av avvisning**: Send en testkampanje til en kjent ugyldig e-postadresse (f.eks. `bounce-test@yourdomain.com` hvis du ikke har en ekte en for hånden, selv om resultatene kan variere). Sjekk kampanjestatistikken i Listmonk etter en kort stund for å se om avvisningen er registrert.
* **E-postoverskrifter**: Bruk verktøy som [Mail-Tester](https://www.mail-tester.com/) eller kontroller e-postoverskrifter manuelt for å bekrefte at SPF, DKIM og DMARC sendes, noe som indikerer riktig oppsett gjennom videresending av e-post.
* **Logger for videresending av e-post**: Sjekk loggene på dashbordet for videresending av e-post hvis du mistenker leveringsproblemer som stammer fra SMTP-serveren.

## Utviklernotater {#developer-notes}

* **Maler**: Listmonk bruker Gos malmotor. Utforsk dokumentasjonen for avansert personalisering: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk tilbyr et omfattende REST API for administrasjon av lister, abonnenter, kampanjer, maler og mer. Finn lenken til API-dokumentasjonen i bunnteksten til Listmonk-instansen din.
* **Tilpassede felt**: Definer tilpassede abonnentfelt under **Innstillinger -> Abonnentfelt** for å lagre tilleggsdata.
* **Webhooks**: I tillegg til avvisninger kan Listmonk sende webhooks for andre hendelser (f.eks. abonnementer), noe som muliggjør integrering med andre systemer.

## Konklusjon {#conclusion}

Ved å integrere Listmonks selvhostede kraft med den sikre og personvernrespekterende leveringen av Forward Email, skaper du en robust og etisk e-postmarkedsføringsplattform. Du beholder fullt eierskap til målgruppedataene dine samtidig som du drar nytte av høy leveringsevne og automatiserte sikkerhetsfunksjoner.

Dette oppsettet gir et skalerbart, kostnadseffektivt og utviklervennlig alternativ til proprietære e-posttjenester, og samsvarer perfekt med etosen for åpen kildekode-programvare og brukernes personvern.

Lykke til med sendingen! 🚀