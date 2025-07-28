# Listmonk met doorstuurmail voor veilige nieuwsbriefbezorging {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Inhoudsopgave {#table-of-contents}

* [Overzicht](#overview)
* [Waarom Listmonk en Forward Email gebruiken](#why-listmonk-and-forward-email)
* [Vereisten](#prerequisites)
* [Installatie](#installation)
  * [1. Werk uw server bij](#1-update-your-server)
  * [2. Afhankelijkheden installeren](#2-install-dependencies)
  * [3. Download Listmonk-configuratie](#3-download-listmonk-configuration)
  * [4. Firewall configureren (UFW)](#4-configure-firewall-ufw)
  * [5. HTTPS-toegang configureren](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Configureer SMTP voor doorsturen van e-mail in Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Bounceverwerking configureren](#8-configure-bounce-processing)
* [Testen](#testing)
  * [Maak een mailinglijst](#create-a-mailing-list)
  * [Abonnees toevoegen](#add-subscribers)
  * [Een campagne maken en verzenden](#create-and-send-a-campaign)
* [Verificatie](#verification)
* [Ontwikkelaarsnotities](#developer-notes)
* [Conclusie](#conclusion)

## Overzicht {#overview}

Deze handleiding biedt ontwikkelaars stapsgewijze instructies voor het instellen van [Listmonk](https://listmonk.app/), een krachtige open-source nieuwsbrief- en mailinglijstbeheerder, om [E-mail doorsturen](https://forwardemail.net/) als SMTP-provider te gebruiken. Deze combinatie stelt u in staat uw campagnes effectief te beheren en tegelijkertijd veilige, vertrouwelijke en betrouwbare e-mailbezorging te garanderen.

* **Listmonk**: Verwerkt abonneebeheer, lijstorganisatie, campagnecreatie en prestatietracking.
* **Forward Email**: Fungeert als de beveiligde SMTP-server en verwerkt de daadwerkelijke verzending van e-mails met ingebouwde beveiligingsfuncties zoals SPF, DKIM, DMARC en TLS-encryptie.

Door deze twee te integreren, behoudt u de volledige controle over uw gegevens en infrastructuur, terwijl u tegelijkertijd gebruikmaakt van het robuuste bezorgsysteem van Forward Email.

## Waarom Listmonk en doorsturen van e-mail {#why-listmonk-and-forward-email}

* **Open source**: Zowel Listmonk als de principes achter Forward Email benadrukken transparantie en controle. U host Listmonk zelf en bent eigenaar van uw gegevens.
* **Privacygericht**: Forward Email is gebouwd met privacy als kern, minimaliseert gegevensretentie en focust op veilige overdracht.
* **Kosteneffectief**: Listmonk is gratis en Forward Email biedt royale gratis abonnementen en betaalbare betaalde abonnementen, waardoor dit een budgetvriendelijke oplossing is.
* **Schaalbaarheid**: Listmonk is zeer performant en de infrastructuur van Forward Email is ontworpen voor betrouwbare levering op schaal.
* **Ontwikkelaarsvriendelijk**: Listmonk biedt een robuuste API en Forward Email biedt eenvoudige SMTP-integratie en webhooks.

## Vereisten {#prerequisites}

Voordat u begint, moet u ervoor zorgen dat u het volgende heeft:

* Een Virtual Private Server (VPS) met een recente Linux-distributie (Ubuntu 20.04+ aanbevolen) met minimaal 1 CPU en 1 GB RAM (2 GB aanbevolen).
* Heb je een provider nodig? Bekijk dan [aanbevolen VPS-lijst](https://github.com/forwardemail/awesome-mail-server-providers).
* Een domeinnaam die je zelf beheert (DNS-toegang vereist).
* Een actief account met [E-mail doorsturen](https://forwardemail.net/).
* Root- of `sudo`-toegang tot je VPS.
* Basiskennis van Linux-opdrachtregelbewerkingen.

## Installatie {#installation}

Deze stappen begeleiden u bij het installeren van Listmonk met behulp van Docker en Docker Compose op uw VPS.

### 1. Werk uw server bij {#1-update-your-server}

Zorg ervoor dat de pakketlijst van uw systeem en de geïnstalleerde pakketten up-to-date zijn.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Afhankelijkheden installeren {#2-install-dependencies}

Installeer Docker, Docker Compose en UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Download Listmonk-configuratie {#3-download-listmonk-configuration}

Maak een directory voor Listmonk en download het officiële bestand `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Dit bestand definieert de Listmonk-toepassingscontainer en de vereiste PostgreSQL-databasecontainer.

### 4. Firewall configureren (UFW) {#4-configure-firewall-ufw}

Laat essentieel verkeer (SSH, HTTP, HTTPS) door de firewall. Als uw SSH op een niet-standaardpoort draait, pas dit dan aan.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bevestig dat u de firewall wilt inschakelen wanneer u daarom wordt gevraagd.

### 5. HTTPS-toegang configureren {#5-configure-https-access}

Het is cruciaal voor de beveiliging om Listmonk via HTTPS te gebruiken. Je hebt twee primaire opties:

#### Optie A: Cloudflare-proxy gebruiken (aanbevolen voor eenvoud) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Als de DNS van uw domein wordt beheerd door Cloudflare, kunt u hun proxyfunctie gebruiken voor eenvoudige HTTPS.

1. **Point DNS**: Maak een `A`-record aan in Cloudflare voor je Listmonk-subdomein (bijv. `listmonk.yourdomain.com`) dat verwijst naar je VPS-IP-adres. Zorg ervoor dat de **Proxystatus** is ingesteld op **Proxied** (oranje wolk).
2. **Docker Compose aanpassen**: Bewerk het gedownloade bestand `docker-compose.yml`:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Hierdoor is Listmonk intern toegankelijk via poort 80, die Cloudflare vervolgens kan proxyen en beveiligen met HTTPS.

#### Optie B: Een omgekeerde proxy gebruiken (Nginx, Caddy, enz.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

U kunt er ook voor kiezen om een omgekeerde proxy zoals Nginx of Caddy op uw VPS in te stellen om HTTPS-beëindiging en proxyverzoeken naar Listmonk af te handelen (standaard draait deze op poort 9000).

* Houd de standaard `ports: - "127.0.0.1:9000:9000"` in `docker-compose.yml` aan om ervoor te zorgen dat Listmonk alleen lokaal toegankelijk is.
* Configureer de gekozen reverse proxy om te luisteren op poorten 80 en 443, de SSL-certificaatverwerving af te handelen (bijvoorbeeld via Let's Encrypt) en verkeer door te sturen naar `http://127.0.0.1:9000`.
* Gedetailleerde reverse proxy-instellingen vallen buiten het bestek van deze handleiding, maar er zijn online veel tutorials beschikbaar.

### 6. Start Listmonk {#6-start-listmonk}

Ga terug naar de map `listmonk` (als u daar nog niet bent) en start de containers in de losgemaakte modus.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker downloadt de benodigde images en start de Listmonk-applicatie en databasecontainers. Dit kan de eerste keer een minuut of twee duren.

✅ **Toegang tot Listmonk**: U zou nu toegang moeten hebben tot de Listmonk-webinterface via het domein dat u hebt geconfigureerd (bijv. `https://listmonk.yourdomain.com`).

### 7. Configureer SMTP voor doorsturen van e-mail in Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Configureer vervolgens Listmonk om e-mails te versturen via uw Forward Email-account.

1. **SMTP inschakelen in Doorsturen van e-mail**: Zorg ervoor dat je SMTP-referenties hebt gegenereerd in het dashboard van je Doorsturen van e-mailaccount. Volg de [Handleiding voor het doorsturen van e-mail met een aangepast domein via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)-regel als je dat nog niet hebt gedaan.
2. **Listmonk configureren**: Log in op je Listmonk-beheerpaneel.
* Ga naar **Instellingen -> SMTP**.

* Listmonk heeft ingebouwde ondersteuning voor het doorsturen van e-mail. Selecteer **ForwardEmail** in de providerlijst of voer de volgende gegevens handmatig in:

| Instelling | Waarde |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Gastheer** | `smtp.forwardemail.net` |
| **Haven** | `465` |
| **Authenticatieprotocol** | `LOGIN` |
| **Gebruikersnaam** | Uw doorstuur-e-mail **SMTP-gebruikersnaam** |
| **Wachtwoord** | Uw doorstuur-e-mail **SMTP-wachtwoord** |
| **TLS** | `SSL/TLS` |
| **Vanuit e-mail** | Het gewenste `From`-adres (bijv. `newsletter@yourdomain.com`). Zorg ervoor dat dit domein is geconfigureerd in 'E-mail doorsturen'. |

* **Belangrijk**: Gebruik altijd poort `465` met `SSL/TLS` voor beveiligde verbindingen met Forward Email. Gebruik geen STARTTLS (poort 587).

* Klik op **Opslaan**.
3. **Test-e-mail verzenden**: Gebruik de knop 'Test-e-mail verzenden' op de pagina met SMTP-instellingen. Voer een toegankelijk ontvangersadres in en klik op **Verzenden**. Controleer of de e-mail in de inbox van de ontvanger aankomt.

### 8. Bounceverwerking configureren {#8-configure-bounce-processing}

Dankzij bounceverwerking kan Listmonk automatisch e-mails verwerken die niet konden worden afgeleverd (bijvoorbeeld vanwege ongeldige adressen). Forward Email biedt een webhook om Listmonk op de hoogte te stellen van bounces.

#### E-mail doorsturen instellen {#forward-email-setup}

1. Log in op je [Dashboard voor doorsturen van e-mail](https://forwardemail.net/).
2. Navigeer naar **Domeinen**, selecteer het domein dat je gebruikt voor verzending en ga naar de pagina **Instellingen**.
3. Scrol omlaag naar het gedeelte **Bounce Webhook URL**.
4. Voer de volgende URL in, waarbij je `<your_listmonk_domain>` vervangt door het domein of subdomein waar je Listmonk-instantie toegang toe heeft:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Voorbeeld*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scrol verder omlaag naar het gedeelte **Verificatiesleutel voor de Webhook Signature Payload**.
6. **Kopieer** de gegenereerde verificatiesleutel. Je hebt deze nodig in Listmonk.
7. Sla de wijzigingen op in de domeininstellingen voor je Forward Email.

#### Listmonk-installatie {#listmonk-setup}

1. Navigeer in je Listmonk-beheerpaneel naar **Instellingen -> Bounces**.
2. Schakel **Bounceverwerking inschakelen** in.
3. Schakel **Bounce-webhooks inschakelen** in.
4. Scrol omlaag naar het gedeelte **Webhook-providers**.
5. Schakel **E-mail doorsturen** in.
6. Plak de **Webhook Signature Payload Verification Key** die je hebt gekopieerd van het dashboard voor e-mail doorsturen in het veld **Sleutel voor e-mail doorsturen**.
7. Klik onderaan de pagina op **Opslaan**.
8. De bounceverwerking is nu geconfigureerd! Wanneer e-mail doorsturen een bounce detecteert voor een e-mail die door Listmonk is verzonden, wordt je Listmonk-instantie hiervan via de webhook op de hoogte gesteld en markeert Listmonk de abonnee dienovereenkomstig.
9. Voltooi de onderstaande stappen in [Testen](#testing) om te controleren of alles werkt.

## Testen van {#testing}

Hier volgt een kort overzicht van de belangrijkste Listmonk-functies:

### Maak een mailinglijst {#create-a-mailing-list}

* Ga naar **Lijsten** in de zijbalk.
* Klik op **Nieuwe lijst**.
* Vul de gegevens in (Naam, Type: Openbaar/Privé, Beschrijving, Tags) en **Sla op**.

### Abonnees toevoegen {#add-subscribers}

* Navigeer naar het gedeelte **Abonnees**.
* Je kunt abonnees toevoegen:
* **Handmatig**: Klik op **Nieuwe abonnee**.
* **Importeren**: Klik op **Abonnees importeren** om een CSV-bestand te uploaden.
* **API**: Gebruik de Listmonk API voor programmatische toevoegingen.
* Wijs abonnees toe aan een of meer lijsten tijdens het aanmaken of importeren.
* **Best practice**: Gebruik een dubbel aanmeldingsproces. Configureer dit onder **Instellingen -> Aanmeldingen & Abonnementen**.

### Een campagne maken en verzenden {#create-and-send-a-campaign}

* Ga naar **Campagnes** -> **Nieuwe campagne**.
* Vul de campagnegegevens in (naam, onderwerp, afzender, lijst(en) waarnaar verzonden moet worden).
* Kies het type content (Rich Text/HTML, platte tekst, onbewerkte HTML).
* Stel de content van je e-mail samen. Je kunt sjabloonvariabelen gebruiken zoals `{{ .Subscriber.Email }}` of `{{ .Subscriber.FirstName }}`.
* **Stuur altijd eerst een testmail!** Gebruik de optie 'Test verzenden' om een voorbeeld van de e-mail in je inbox te bekijken.
* Klik als je tevreden bent op **Campagne starten** om de e-mail direct te verzenden of in te plannen voor later.

## Verificatie {#verification}

* **SMTP-bezorging**: Verstuur regelmatig test-e-mails via de SMTP-instellingenpagina van Listmonk en test campagnes om te controleren of e-mails correct worden bezorgd.
* **Bounceverwerking**: Verstuur een testcampagne naar een bekend ongeldig e-mailadres (bijv. `bounce-test@yourdomain.com` als u geen echt adres bij de hand hebt, hoewel de resultaten kunnen variëren). Controleer na korte tijd de campagnestatistieken in Listmonk om te zien of de bounce is geregistreerd.
* **E-mailheaders**: Gebruik tools zoals [Mailtester](https://www.mail-tester.com/) of controleer e-mailheaders handmatig om te controleren of SPF, DKIM en DMARC worden verwerkt, wat aangeeft dat de instellingen via Forward Email correct zijn.
* **Forward Email Logs**: Controleer de logs van uw Forward Email-dashboard als u vermoedt dat er bezorgingsproblemen zijn die afkomstig zijn van de SMTP-server.

## Ontwikkelaarsnotities {#developer-notes}

* **Templating**: Listmonk maakt gebruik van de template-engine van Go. Bekijk de documentatie voor geavanceerde personalisatie: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk biedt een uitgebreide REST API voor het beheren van lijsten, abonnees, campagnes, sjablonen en meer. De link naar de API-documentatie vindt u in de voettekst van uw Listmonk-instantie.
* **Aangepaste velden**: Definieer aangepaste abonneevelden onder **Instellingen -> Abonneevelden** om extra gegevens op te slaan.
* **Webhooks**: Naast bounces kan Listmonk ook webhooks versturen voor andere gebeurtenissen (bijv. abonnementen), waardoor integratie met andere systemen mogelijk is.

## Conclusie {#conclusion}

Door de zelfgehoste kracht van Listmonk te integreren met de veilige, privacy-respecterende levering van Forward Email, creëert u een robuust en ethisch e-mailmarketingplatform. U behoudt de volledige controle over uw doelgroepgegevens en profiteert tegelijkertijd van een hoge leverbaarheid en geautomatiseerde beveiligingsfuncties.

Deze opzet biedt een schaalbaar, kosteneffectief en ontwikkelaarsvriendelijk alternatief voor propriëtaire e-maildiensten en past perfect bij de filosofie van opensourcesoftware en de privacy van gebruikers.

Fijne verzending! 🚀