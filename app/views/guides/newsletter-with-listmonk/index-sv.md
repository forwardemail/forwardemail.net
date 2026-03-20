# Listmonk med Forward Email för säker nyhetsbrevsleverans {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Innehållsförteckning {#table-of-contents}

* [Översikt](#overview)
* [Varför Listmonk och Forward Email](#why-listmonk-and-forward-email)
* [Förutsättningar](#prerequisites)
* [Installation](#installation)
  * [1. Uppdatera din server](#1-update-your-server)
  * [2. Installera beroenden](#2-install-dependencies)
  * [3. Ladda ner Listmonk-konfiguration](#3-download-listmonk-configuration)
  * [4. Konfigurera brandvägg (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurera HTTPS-åtkomst](#5-configure-https-access)
  * [6. Starta Listmonk](#6-start-listmonk)
  * [7. Konfigurera Forward Email SMTP i Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurera bounce-hantering](#8-configure-bounce-processing)
* [Testning](#testing)
  * [Skapa en mailinglista](#create-a-mailing-list)
  * [Lägg till prenumeranter](#add-subscribers)
  * [Skapa och skicka en kampanj](#create-and-send-a-campaign)
* [Verifiering](#verification)
* [Utvecklarnoteringar](#developer-notes)
* [Slutsats](#conclusion)


## Översikt {#overview}

Denna guide ger utvecklare steg-för-steg-instruktioner för att sätta upp [Listmonk](https://listmonk.app/), en kraftfull öppen källkodslösning för nyhetsbrev och mailinglistor, för att använda [Forward Email](https://forwardemail.net/) som dess SMTP-leverantör. Denna kombination låter dig effektivt hantera dina kampanjer samtidigt som du säkerställer säker, privat och pålitlig e-postleverans.

* **Listmonk**: Hanterar prenumeranthantering, listaorganisation, kampanjskapande och prestandaspårning.
* **Forward Email**: Fungerar som den säkra SMTP-servern och hanterar den faktiska utskicket av e-post med inbyggda säkerhetsfunktioner som SPF, DKIM, DMARC och TLS-kryptering.

Genom att integrera dessa två behåller du full kontroll över dina data och din infrastruktur samtidigt som du utnyttjar Forward Emails robusta leveranssystem.


## Varför Listmonk och Forward Email {#why-listmonk-and-forward-email}

* **Öppen källkod**: Både Listmonk och principerna bakom Forward Email betonar transparens och kontroll. Du hostar Listmonk själv och äger dina data.
* **Integritetsfokuserat**: Forward Email är byggt med integritet i fokus, minimerar datalagring och prioriterar säker överföring.
* **Kostnadseffektivt**: Listmonk är gratis och Forward Email erbjuder generösa gratisnivåer och prisvärda betalplaner, vilket gör detta till en budgetvänlig lösning.
* **Skalbarhet**: Listmonk är mycket presterande och Forward Emails infrastruktur är designad för pålitlig leverans i stor skala.
* **Utvecklarvänligt**: Listmonk erbjuder ett robust API och Forward Email tillhandahåller enkel SMTP-integration och webhooks.


## Förutsättningar {#prerequisites}

Innan du börjar, säkerställ att du har följande:

* En Virtuell Privat Server (VPS) som kör en aktuell Linux-distribution (Ubuntu 20.04+ rekommenderas) med minst 1 CPU och 1GB RAM (2GB rekommenderas).
  * Behöver du en leverantör? Kolla in [rekommenderad VPS-lista](https://github.com/forwardemail/awesome-mail-server-providers).
* Ett domännamn som du kontrollerar (DNS-åtkomst krävs).
* Ett aktivt konto hos [Forward Email](https://forwardemail.net/).
* Root- eller `sudo`-åtkomst till din VPS.
* Grundläggande kännedom om Linux-kommandoraden.


## Installation {#installation}

Dessa steg guidar dig genom installationen av Listmonk med Docker och Docker Compose på din VPS.

### 1. Uppdatera din server {#1-update-your-server}

Säkerställ att systemets paketlista och installerade paket är uppdaterade.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installera beroenden {#2-install-dependencies}

Installera Docker, Docker Compose och UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Ladda ner Listmonk-konfiguration {#3-download-listmonk-configuration}

Skapa en katalog för Listmonk och ladda ner den officiella `docker-compose.yml`-filen.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Denna fil definierar Listmonk-applikationscontainern och dess nödvändiga PostgreSQL-databascontainer.
### 4. Konfigurera brandvägg (UFW) {#4-configure-firewall-ufw}

Tillåt nödvändig trafik (SSH, HTTP, HTTPS) genom brandväggen. Om din SSH körs på en icke-standardport, justera därefter.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bekräfta att du vill aktivera brandväggen när du blir tillfrågad.

### 5. Konfigurera HTTPS-åtkomst {#5-configure-https-access}

Att köra Listmonk över HTTPS är avgörande för säkerheten. Du har två huvudsakliga alternativ:

#### Alternativ A: Använda Cloudflare Proxy (Rekommenderas för enkelhet) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Om din domäns DNS hanteras av Cloudflare kan du använda deras proxyfunktion för enkel HTTPS.

1. **Peka DNS**: Skapa en `A`-post i Cloudflare för din Listmonk-underdomän (t.ex. `listmonk.dindomän.com`) som pekar på din VPS IP-adress. Se till att **Proxy status** är inställd på **Proxied** (orange moln).
2. **Ändra Docker Compose**: Redigera filen `docker-compose.yml` som du laddade ner:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Detta gör Listmonk tillgängligt internt på port 80, vilket Cloudflare sedan kan proxy:a och säkra med HTTPS.

#### Alternativ B: Använda en omvänd proxy (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativt kan du konfigurera en omvänd proxy som Nginx eller Caddy på din VPS för att hantera HTTPS-terminering och proxyförfrågningar till Listmonk (som körs på port 9000 som standard).

* Behåll standardinställningen `ports: - "127.0.0.1:9000:9000"` i `docker-compose.yml` för att säkerställa att Listmonk endast är åtkomligt lokalt.
* Konfigurera din valda omvända proxy att lyssna på portarna 80 och 443, hantera SSL-certifikat (t.ex. via Let's Encrypt) och vidarebefordra trafiken till `http://127.0.0.1:9000`.
* Detaljerad konfiguration av omvänd proxy ligger utanför denna guides omfattning, men många handledningar finns tillgängliga online.

### 6. Starta Listmonk {#6-start-listmonk}

Navigera tillbaka till din `listmonk`-katalog (om du inte redan är där) och starta containrarna i detached-läge.

```bash
cd ~/listmonk # Eller katalogen där du sparade docker-compose.yml
docker compose up -d
```

Docker kommer att ladda ner nödvändiga bilder och starta Listmonk-applikationen och databascontainrarna. Det kan ta en minut eller två första gången.

✅ **Åtkomst till Listmonk**: Du bör nu kunna nå Listmonk webbgränssnitt via den domän du konfigurerade (t.ex. `https://listmonk.dindomän.com`).

### 7. Konfigurera Forward Email SMTP i Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Nästa steg är att konfigurera Listmonk för att skicka e-post med ditt Forward Email-konto.

1. **Aktivera SMTP i Forward Email**: Se till att du har genererat SMTP-uppgifter i din Forward Email-kontos instrumentpanel. Följ [Forward Email-guiden för att skicka e-post med en egen domän via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) om du inte redan gjort det.
2. **Konfigurera Listmonk**: Logga in i din Listmonk adminpanel.
   * Navigera till **Inställningar -> SMTP**.

   * Listmonk har inbyggt stöd för Forward Email. Välj **ForwardEmail** från leverantörslistan, eller ange manuellt följande uppgifter:

     | Inställning       | Värde                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth protocol** | `LOGIN`                                                                                                             |
     | **Username**      | Ditt Forward Email **SMTP-användarnamn**                                                                            |
     | **Password**      | Ditt Forward Email **SMTP-lösenord**                                                                                |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **From e-mail**   | Din önskade `From`-adress (t.ex. `newsletter@dindomän.com`). Se till att denna domän är konfigurerad i Forward Email. |
* **Viktigt**: Använd alltid Port `465` med `SSL/TLS` för säkra anslutningar med Forward Email (rekommenderas). Port `587` med STARTTLS stöds också men SSL/TLS föredras.

   * Klicka på **Spara**.
3. **Skicka testmail**: Använd knappen "Skicka testmail" på sidan för SMTP-inställningar. Ange en mottagaradress som du kan nå och klicka på **Skicka**. Verifiera att mailet kommer fram till mottagarens inkorg.

### 8. Konfigurera Bounce-hantering {#8-configure-bounce-processing}

Bounce-hantering gör det möjligt för Listmonk att automatiskt hantera mail som inte kunde levereras (t.ex. på grund av ogiltiga adresser). Forward Email tillhandahåller en webhook för att meddela Listmonk om bounces.

#### Forward Email-inställningar {#forward-email-setup}

1. Logga in på din [Forward Email Dashboard](https://forwardemail.net/).
2. Gå till **Domains**, välj den domän du använder för utskick och gå till dess **Settings**-sida.
3. Scrolla ner till avsnittet **Bounce Webhook URL**.
4. Ange följande URL, byt ut `<your_listmonk_domain>` mot den faktiska domänen eller subdomänen där din Listmonk-instans är tillgänglig:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Exempel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scrolla ytterligare ner till avsnittet **Webhook Signature Payload Verification Key**.
6. **Kopiera** den genererade verifieringsnyckeln. Du kommer att behöva den i Listmonk.
7. Spara ändringarna i dina Forward Email-domäninställningar.

#### Listmonk-inställningar {#listmonk-setup}

1. I din Listmonk adminpanel, gå till **Settings -> Bounces**.
2. Aktivera **Enable bounce processing**.
3. Aktivera **Enable bounce webhooks**.
4. Scrolla ner till avsnittet **Webhook Providers**.
5. Aktivera **Forward Email**.
6. Klistra in **Webhook Signature Payload Verification Key** som du kopierade från Forward Email dashboard i fältet **Forward Email Key**.
7. Klicka på **Save** längst ner på sidan.
8. Bounce-hanteringen är nu konfigurerad! När Forward Email upptäcker en bounce för ett mail skickat av Listmonk, kommer det att meddela din Listmonk-instans via webhooken, och Listmonk markerar prenumeranten därefter.
9. Slutför stegen nedan i [Testing](#testing) för att säkerställa att allt fungerar.

## Testning {#testing}

Här är en snabb översikt över kärnfunktioner i Listmonk:

### Skapa en mailinglista {#create-a-mailing-list}

* Gå till **Lists** i sidomenyn.
* Klicka på **New List**.
* Fyll i detaljerna (Namn, Typ: Public/Private, Beskrivning, Taggar) och **Spara**.

### Lägg till prenumeranter {#add-subscribers}

* Navigera till sektionen **Subscribers**.
* Du kan lägga till prenumeranter:
  * **Manuellt**: Klicka på **New Subscriber**.
  * **Importera**: Klicka på **Import Subscribers** för att ladda upp en CSV-fil.
  * **API**: Använd Listmonks API för programmatisk tilläggning.
* Tilldela prenumeranter till en eller flera listor vid skapande eller import.
* **Bästa praxis**: Använd en dubbel opt-in-process. Konfigurera detta under **Settings -> Opt-in & Subscriptions**.

### Skapa och skicka en kampanj {#create-and-send-a-campaign}

* Gå till **Campaigns** -> **New Campaign**.
* Fyll i kampanjdetaljerna (Namn, Ämne, Från-mail, Lista(or) att skicka till).
* Välj din innehållstyp (Rich Text/HTML, Plain Text, Raw HTML).
* Skriv ditt mailinnehåll. Du kan använda mallvariabler som `{{ .Subscriber.Email }}` eller `{{ .Subscriber.FirstName }}`.
* **Skicka alltid ett testmail först!** Använd "Send Test"-alternativet för att förhandsgranska mailet i din inkorg.
* När du är nöjd, klicka på **Start Campaign** för att skicka omedelbart eller schemalägg för senare.

## Verifiering {#verification}

* **SMTP-leverans**: Skicka regelbundet testmail via Listmonks SMTP-inställningssida och testkampanjer för att säkerställa att mail levereras korrekt.
* **Bounce-hantering**: Skicka en testkampanj till en känd ogiltig mailadress (t.ex. `bounce-test@yourdomain.com` om du inte har en riktig till hands, men resultat kan variera). Kontrollera kampanjstatistiken i Listmonk efter en stund för att se om bouncen registrerats.
* **Mailhuvuden**: Använd verktyg som [Mail-Tester](https://www.mail-tester.com/) eller inspektera mailhuvuden manuellt för att verifiera att SPF, DKIM och DMARC passerar, vilket indikerar korrekt uppsättning via Forward Email.
* **Forward Email-loggar**: Kontrollera loggarna i din Forward Email dashboard om du misstänker leveransproblem som härstammar från SMTP-servern.
## Developer Notes {#developer-notes}

* **Templating**: Listmonk använder Go:s templatemotor. Utforska dess dokumentation för avancerad personalisering: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk erbjuder ett omfattande REST API för att hantera listor, prenumeranter, kampanjer, mallar med mera. Hitta API-dokumentationslänken i din Listmonk-instansens sidfot.
* **Custom Fields**: Definiera anpassade prenumerantfält under **Settings -> Subscriber Fields** för att lagra ytterligare data.
* **Webhooks**: Förutom studsningar kan Listmonk skicka webhooks för andra händelser (t.ex. prenumerationer), vilket möjliggör integration med andra system.


## Conclusion {#conclusion}

Genom att integrera den självhostade kraften i Listmonk med den säkra, integritetsrespekterande leveransen från Forward Email skapar du en robust och etisk e-postmarknadsföringsplattform. Du behåller full äganderätt till din publikdata samtidigt som du drar nytta av hög leveransbarhet och automatiserade säkerhetsfunktioner.

Denna lösning erbjuder ett skalbart, kostnadseffektivt och utvecklarvänligt alternativ till proprietära e-posttjänster, vilket passar perfekt med öppen källkodsprogramvarans och användarens integritets ethos.

Lycka till med utskicken! 🚀
