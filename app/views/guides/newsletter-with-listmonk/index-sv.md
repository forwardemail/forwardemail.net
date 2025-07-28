# Listmonk med vidarebefordran av e-post för säker nyhetsbrevsleverans {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Innehållsförteckning {#table-of-contents}

* [Översikt](#overview)
* [Varför Listmonk och vidarebefordra e-post](#why-listmonk-and-forward-email)
* [Förkunskapskrav](#prerequisites)
* [Installation](#installation)
  * [1. Uppdatera din server](#1-update-your-server)
  * [2. Installera beroenden](#2-install-dependencies)
  * [3. Ladda ner Listmonk-konfigurationen](#3-download-listmonk-configuration)
  * [4. Konfigurera brandvägg (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurera HTTPS-åtkomst](#5-configure-https-access)
  * [6. Starta Listmonk](#6-start-listmonk)
  * [7. Konfigurera vidarebefordran av e-post via SMTP i Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurera avvisningsbehandling](#8-configure-bounce-processing)
* [Testning](#testing)
  * [Skapa en e-postlista](#create-a-mailing-list)
  * [Lägg till prenumeranter](#add-subscribers)
  * [Skapa och skicka en kampanj](#create-and-send-a-campaign)
* [Kontroll](#verification)
* [Utvecklaranteckningar](#developer-notes)
* [Slutsats](#conclusion)

## Översikt {#overview}

Den här guiden ger utvecklare steg-för-steg-instruktioner för hur man konfigurerar [Listmonk](https://listmonk.app/), en kraftfull hantering av nyhetsbrev och e-postlistor med öppen källkod, för att använda [Vidarebefordra e-post](https://forwardemail.net/) som SMTP-leverantör. Den här kombinationen låter dig hantera dina kampanjer effektivt samtidigt som du säkerställer säker, privat och pålitlig e-postleverans.

* **Listmonk**: Hanterar prenumeranthantering, listorganisation, kampanjskapande och prestationsspårning.
* **Vidarebefordra e-post**: Fungerar som en säker SMTP-server och hanterar själva sändningen av e-postmeddelanden med inbyggda säkerhetsfunktioner som SPF, DKIM, DMARC och TLS-kryptering.

Genom att integrera dessa två behåller du full kontroll över din data och infrastruktur samtidigt som du utnyttjar Forward Emails robusta leveranssystem.

## Varför Listmonk och vidarebefordra e-post {#why-listmonk-and-forward-email}

* **Öppen källkod**: Både Listmonk och principerna bakom Forward Email betonar transparens och kontroll. Du hostar Listmonk själv och äger dina data.
* **Integritetsfokuserad**: Forward Email är byggd med integritet i centrum, vilket minimerar datalagring och fokuserar på säker överföring.
* **Kostnadseffektiv**: Listmonk är gratis, och Forward Email erbjuder generösa gratisnivåer och prisvärda betalda planer, vilket gör detta till en budgetvänlig lösning.
* **Skalbarhet**: Listmonk är mycket prestandafullt, och Forward Emails infrastruktur är utformad för tillförlitlig leverans i stor skala.
* **Utvecklarvänlig**: Listmonk erbjuder ett robust API, och Forward Email tillhandahåller enkel SMTP-integration och webhooks.

## Förutsättningar {#prerequisites}

Innan du börjar, se till att du har följande:

* En virtuell privat server (VPS) som kör en aktuell Linuxdistribution (Ubuntu 20.04+ rekommenderas) med minst 1 processor och 1 GB RAM (2 GB rekommenderas).

* Behöver du en leverantör? Kolla in [rekommenderad VPS-lista](https://github.com/forwardemail/awesome-mail-server-providers).

* Ett domännamn som du kontrollerar (DNS-åtkomst krävs).

* Ett aktivt konto med [Vidarebefordra e-post](https://forwardemail.net/).

* Root- eller `sudo`-åtkomst till din VPS.

* Grundläggande kunskaper om kommandoradsoperationer i Linux.

## Installation {#installation}

Dessa steg guidar dig genom installationen av Listmonk med Docker och Docker Compose på din VPS.

### 1. Uppdatera din server {#1-update-your-server}

Se till att systemets paketlista och installerade paket är uppdaterade.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installera beroenden {#2-install-dependencies}

Installera Docker, Docker Compose och UFW (okomplicerad brandvägg).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Ladda ner Listmonk-konfigurationen {#3-download-listmonk-configuration}

Skapa en katalog för Listmonk och ladda ner den officiella `docker-compose.yml`-filen.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Den här filen definierar Listmonk-applikationscontainern och dess obligatoriska PostgreSQL-databascontainer.

### 4. Konfigurera brandvägg (UFW) {#4-configure-firewall-ufw}

Tillåt nödvändig trafik (SSH, HTTP, HTTPS) genom brandväggen. Om din SSH körs på en icke-standardiserad port, justera därefter.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bekräfta aktiveringen av brandväggen när du uppmanas att göra det.

### 5. Konfigurera HTTPS-åtkomst {#5-configure-https-access}

Att köra Listmonk över HTTPS är avgörande för säkerheten. Du har två huvudsakliga alternativ:

#### Alternativ A: Använda Cloudflare-proxy (rekommenderas för enkelhetens skull) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Om din domäns DNS hanteras av Cloudflare kan du utnyttja deras proxyfunktion för enkel HTTPS.

1. **Punkt-DNS**: Skapa en `A`-post i Cloudflare för din Listmonk-underdomän (t.ex. `listmonk.yourdomain.com`) som pekar mot din VPS IP-adress. Se till att **Proxystatus** är inställd på **Proxied** (orange moln).

2. **Ändra Docker Compose**: Redigera `docker-compose.yml`-filen som du laddade ner:

```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Detta gör Listmonk tillgänglig internt på port 80, som Cloudflare sedan kan proxya och säkra med HTTPS.

#### Alternativ B: Använda en omvänd proxy (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativt kan du konfigurera en omvänd proxy som Nginx eller Caddy på din VPS för att hantera HTTPS-terminering och proxyförfrågningar till Listmonk (körs på port 9000 som standard).

* Behåll standardvärdet `ports: - "127.0.0.1:9000:9000"` i `docker-compose.yml` för att säkerställa att Listmonk endast är tillgänglig lokalt.

* Konfigurera din valda omvända proxy för att lyssna på portarna 80 och 443, hantera SSL-certifikatförvärv (t.ex. via Let's Encrypt) och vidarebefordra trafik till `http://127.0.0.1:9000`.

* Detaljerad installation av omvända proxy ligger utanför den här guidens omfattning, men många handledningar finns tillgängliga online.

### 6. Starta Listmonk {#6-start-listmonk}

Navigera tillbaka till din `listmonk`-katalog (om du inte redan är där) och starta containrarna i frikopplat läge.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker kommer att ladda ner de nödvändiga avbildningarna och starta Listmonk-applikationen och databascontainrarna. Det kan ta en minut eller två första gången.

✅ **Åtkomst till Listmonk**: Du borde nu kunna komma åt Listmonks webbgränssnitt via domänen du konfigurerade (t.ex. `https://listmonk.yourdomain.com`).

### 7. Konfigurera SMTP för vidarebefordran av e-post i Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Konfigurera sedan Listmonk för att skicka e-postmeddelanden med ditt konto för vidarebefordran av e-post.

1. **Aktivera SMTP i vidarebefordran av e-post**: Se till att du har genererat SMTP-inloggningsuppgifter i instrumentpanelen för ditt konto för vidarebefordran av e-post. Följ [Guide för vidarebefordran av e-post för att skicka e-post med en anpassad domän via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) om du inte redan har gjort det.

2. **Konfigurera Listmonk**: Logga in på din Listmonk-administratörspanel.
* Navigera till **Inställningar -> SMTP**.

* Listmonk har inbyggt stöd för vidarebefordran av e-post. Välj **Vidarebefordra e-post** från leverantörslistan eller ange följande uppgifter manuellt:

| Miljö | Värde |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Värd** | `smtp.forwardemail.net` |
| **Hamn** | `465` |
| **Autentiseringsprotokoll** | `LOGIN` |
| **Användarnamn** | Din vidarebefordran av e-postadress **SMTP-användarnamn** |
| **Lösenord** | Din vidarebefordran av e-post **SMTP-lösenord** |
| **TLS** | `SSL/TLS` |
| **Från e-post** | Din önskade `From`-adress (t.ex. `newsletter@yourdomain.com`). Se till att den här domänen är konfigurerad i Vidarebefordra e-post. |

* **Viktigt**: Använd alltid port `465` med `SSL/TLS` för säkra anslutningar med vidarebefordran av e-post. Använd inte STARTTLS (port 587).

* Klicka på **Spara**.
3. **Skicka testmejl**: Använd knappen "Skicka testmejl" på sidan med SMTP-inställningar. Ange en mottagaradress som du har åtkomst till och klicka på **Skicka**. Kontrollera att mejlet kommer fram till mottagarens inkorg.

### 8. Konfigurera avvisningsbehandling {#8-configure-bounce-processing}

Avvisningshantering gör att Listmonk automatiskt hanterar e-postmeddelanden som inte kunde levereras (t.ex. på grund av ogiltiga adresser). Vidarebefordra e-post tillhandahåller en webhook för att meddela Listmonk om avvisningar.

#### Konfiguration av vidarebefordran av e-post {#forward-email-setup}

1. Logga in på din [Instrumentpanel för vidarebefordran av e-post](https://forwardemail.net/).
2. Navigera till **Domäner**, välj den domän du använder för att skicka och gå till dess **Inställningar**-sida.
3. Scrolla ner till avsnittet **Adress för avvisad webhook**.
4. Ange följande URL och ersätt `<your_listmonk_domain>` med den faktiska domänen eller underdomänen där din Listmonk-instans är tillgänglig:

```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Exempel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`

5. Scrolla vidare ner till avsnittet **Verifieringsnyckel för webbsignaturnytta**.

6. **Kopiera** den genererade verifieringsnyckeln. Du behöver den i Listmonk.

7. Spara ändringarna i dina domäninställningar för vidarebefordran av e-post.

#### Listmonk-inställningar {#listmonk-setup}

1. I din Listmonk-administratörspanel navigerar du till **Inställningar -> Avvisningar**.
2. Aktivera **Aktivera avvisningshantering**.
3. Aktivera **Aktivera avvisningswebhooks**.
4. Scrolla ner till avsnittet **Webhook-leverantörer**.
5. Aktivera **Vidarebefordra e-post**.
6. Klistra in den **Webhook-signaturnyttaverifieringsnyckel** som du kopierade från instrumentpanelen för vidarebefordran av e-post i fältet **Vidarebefordra e-postnyckel**.
7. Klicka på **Spara** längst ner på sidan.
8. Avvisningshanteringen är nu konfigurerad! När vidarebefordran av e-post upptäcker en avvisning för ett e-postmeddelande som skickats av Listmonk, meddelar den din Listmonk-instans via webhooken, och Listmonk markerar prenumeranten därefter.
9. Slutför stegen nedan i [Testning](#testing) för att säkerställa att allt fungerar.

## Testning {#testing}

Här är en snabb översikt över Listmonks kärnfunktioner:

### Skapa en e-postlista {#create-a-mailing-list}

* Gå till **Listor** i sidofältet.
* Klicka på **Ny lista**.
* Fyll i uppgifterna (Namn, Typ: Offentlig/Privat, Beskrivning, Taggar) och **Spara**.

### Lägg till prenumeranter {#add-subscribers}

* Navigera till avsnittet **Prenumeranter**.
* Du kan lägga till prenumeranter:
* **Manuellt**: Klicka på **Ny prenumerant**.
* **Importera**: Klicka på **Importera prenumeranter** för att ladda upp en CSV-fil.
* **API**: Använd Listmonk API för programmatiska tillägg.
* Tilldela prenumeranter till en eller flera listor under skapande eller import.
* **Bästa praxis**: Använd en dubbel anmälningsprocess. Konfigurera detta under **Inställningar -> Anmälan och prenumerationer**.

### Skapa och skicka en kampanj {#create-and-send-a-campaign}

* Gå till **Kampanjer** -> **Ny kampanj**.
* Fyll i kampanjinformationen (Namn, Ämne, Från e-post, Lista(or) att skicka till).
* Välj din innehållstyp (Rich Text/HTML, Oformaterad text, Rå HTML).
* Skriv ditt e-postinnehåll. Du kan använda mallvariabler som `{{ .Subscriber.Email }}` eller `{{ .Subscriber.FirstName }}`.
* **Skicka alltid ett testmeddelande först!** Använd alternativet "Skicka test" för att förhandsgranska e-postmeddelandet i din inkorg.
* När du är nöjd klickar du på **Starta kampanj** för att skicka direkt eller schemalägga det till senare.

## Verifiering {#verification}

* **SMTP-leverans**: Skicka regelbundet testmejl via Listmonks SMTP-inställningssida och testkampanjer för att säkerställa att e-postmeddelanden levereras korrekt.
* **Hantering av avvisningar**: Skicka en testkampanj till en känd ogiltig e-postadress (t.ex. `bounce-test@yourdomain.com` om du inte har en riktig e-postadress till hands, även om resultaten kan variera). Kontrollera kampanjstatistiken i Listmonk efter en kort stund för att se om avvisningen är registrerad.
* **E-postrubriker**: Använd verktyg som [E-posttestare](https://www.mail-tester.com/) eller inspektera e-postrubriker manuellt för att verifiera att SPF, DKIM och DMARC skickas, vilket indikerar korrekt konfiguration genom vidarebefordran av e-post.
* **Loggar för vidarebefordran av e-post**: Kontrollera dina loggar för instrumentpanelen för vidarebefordran av e-post om du misstänker leveransproblem som kommer från SMTP-servern.

## Utvecklaranteckningar {#developer-notes}

* **Mallar**: Listmonk använder Gos mallmotor. Utforska dess dokumentation för avancerad anpassning: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk tillhandahåller ett omfattande REST API för att hantera listor, prenumeranter, kampanjer, mallar med mera. Hitta länken till API-dokumentationen i sidfoten på din Listmonk-instans.
* **Anpassade fält**: Definiera anpassade prenumerantfält under **Inställningar -> Prenumerantfält** för att lagra ytterligare data.
* **Webhooks**: Förutom avvisningar kan Listmonk skicka webhooks för andra händelser (t.ex. prenumerationer), vilket möjliggör integration med andra system.

## Slutsats {#conclusion}

Genom att integrera Listmonks självhostade kraft med den säkra, integritetsrespekterande leveransen av Forward Email skapar du en robust och etisk e-postmarknadsföringsplattform. Du behåller fullt ägande av din publikdata samtidigt som du drar nytta av hög leveransbarhet och automatiserade säkerhetsfunktioner.

Denna uppsättning erbjuder ett skalbart, kostnadseffektivt och utvecklarvänligt alternativ till proprietära e-posttjänster, vilket perfekt överensstämmer med principerna om öppen källkodsprogramvara och användarnas integritet.

Lycka till med sändningen! 🚀