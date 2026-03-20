# Listmonk met Forward Email voor Veilige Nieuwsbriefbezorging {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Inhoudsopgave {#table-of-contents}

* [Overzicht](#overview)
* [Waarom Listmonk en Forward Email](#why-listmonk-and-forward-email)
* [Vereisten](#prerequisites)
* [Installatie](#installation)
  * [1. Werk je server bij](#1-update-your-server)
  * [2. Installeer afhankelijkheden](#2-install-dependencies)
  * [3. Download Listmonk-configuratie](#3-download-listmonk-configuration)
  * [4. Configureer firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configureer HTTPS-toegang](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Configureer Forward Email SMTP in Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configureer bounce-verwerking](#8-configure-bounce-processing)
* [Testen](#testing)
  * [Maak een mailinglijst aan](#create-a-mailing-list)
  * [Voeg abonnees toe](#add-subscribers)
  * [Maak en verstuur een campagne](#create-and-send-a-campaign)
* [Verificatie](#verification)
* [Notities voor ontwikkelaars](#developer-notes)
* [Conclusie](#conclusion)


## Overzicht {#overview}

Deze gids biedt ontwikkelaars stapsgewijze instructies voor het opzetten van [Listmonk](https://listmonk.app/), een krachtige open-source nieuwsbrief- en mailinglistbeheerder, om [Forward Email](https://forwardemail.net/) als SMTP-provider te gebruiken. Deze combinatie stelt je in staat om je campagnes effectief te beheren en tegelijkertijd een veilige, private en betrouwbare e-mailbezorging te garanderen.

* **Listmonk**: Beheert abonnees, lijstorganisatie, campagnecreatie en prestatie-tracking.
* **Forward Email**: Fungeert als de veilige SMTP-server en verzorgt het daadwerkelijke verzenden van e-mails met ingebouwde beveiligingsfuncties zoals SPF, DKIM, DMARC en TLS-encryptie.

Door deze twee te integreren behoud je volledige controle over je data en infrastructuur terwijl je profiteert van het robuuste bezorgsysteem van Forward Email.


## Waarom Listmonk en Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Zowel Listmonk als de principes achter Forward Email benadrukken transparantie en controle. Je host Listmonk zelf en bezit je data.
* **Privacygericht**: Forward Email is gebouwd met privacy als kern, minimaliseert databehoud en richt zich op veilige transmissie.
* **Kosteneffectief**: Listmonk is gratis en Forward Email biedt royale gratis tiers en betaalbare betaalde plannen, wat dit een budgetvriendelijke oplossing maakt.
* **Schaalbaarheid**: Listmonk is zeer performant en de infrastructuur van Forward Email is ontworpen voor betrouwbare bezorging op schaal.
* **Ontwikkelaarvriendelijk**: Listmonk biedt een robuuste API en Forward Email levert eenvoudige SMTP-integratie en webhooks.


## Vereisten {#prerequisites}

Voordat je begint, zorg dat je het volgende hebt:

* Een Virtual Private Server (VPS) met een recente Linux-distributie (Ubuntu 20.04+ aanbevolen) met minimaal 1 CPU en 1GB RAM (2GB aanbevolen).
  * Op zoek naar een provider? Bekijk de [aanbevolen VPS-lijst](https://github.com/forwardemail/awesome-mail-server-providers).
* Een domeinnaam die je beheert (DNS-toegang vereist).
* Een actief account bij [Forward Email](https://forwardemail.net/).
* Root- of `sudo`-toegang tot je VPS.
* Basiskennis van Linux commandoregeloperaties.


## Installatie {#installation}

Deze stappen begeleiden je bij het installeren van Listmonk met Docker en Docker Compose op je VPS.

### 1. Werk je server bij {#1-update-your-server}

Zorg dat de pakketlijst en geïnstalleerde pakketten van je systeem up-to-date zijn.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installeer afhankelijkheden {#2-install-dependencies}

Installeer Docker, Docker Compose en UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Download Listmonk-configuratie {#3-download-listmonk-configuration}

Maak een map voor Listmonk aan en download het officiële `docker-compose.yml` bestand.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Dit bestand definieert de Listmonk applicatiecontainer en de benodigde PostgreSQL databasecontainer.
### 4. Configureer Firewall (UFW) {#4-configure-firewall-ufw}

Sta essentieel verkeer (SSH, HTTP, HTTPS) toe via de firewall. Als je SSH op een niet-standaard poort draait, pas dit dan aan.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bevestig het inschakelen van de firewall wanneer hierom wordt gevraagd.

### 5. Configureer HTTPS-toegang {#5-configure-https-access}

Het draaien van Listmonk via HTTPS is cruciaal voor de beveiliging. Je hebt twee hoofdopties:

#### Optie A: Gebruik van Cloudflare Proxy (Aanbevolen voor eenvoud) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Als de DNS van je domein wordt beheerd door Cloudflare, kun je hun proxyfunctie gebruiken voor eenvoudige HTTPS.

1. **Stel DNS in**: Maak een `A`-record aan in Cloudflare voor je Listmonk-subdomein (bijv. `listmonk.jouwdomein.com`) die verwijst naar het IP-adres van je VPS. Zorg ervoor dat de **Proxy status** is ingesteld op **Proxied** (oranje wolk).
2. **Pas Docker Compose aan**: Bewerk het `docker-compose.yml` bestand dat je hebt gedownload:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Hierdoor is Listmonk intern toegankelijk op poort 80, die Cloudflare vervolgens kan proxyen en beveiligen met HTTPS.

#### Optie B: Gebruik van een Reverse Proxy (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Je kunt ook een reverse proxy zoals Nginx of Caddy op je VPS instellen om HTTPS-terminatie af te handelen en verzoeken door te sturen naar Listmonk (standaard draaiend op poort 9000).

* Houd de standaard `ports: - "127.0.0.1:9000:9000"` in `docker-compose.yml` om ervoor te zorgen dat Listmonk alleen lokaal toegankelijk is.
* Configureer je gekozen reverse proxy om te luisteren op poorten 80 en 443, SSL-certificaten te verkrijgen (bijv. via Let's Encrypt) en verkeer door te sturen naar `http://127.0.0.1:9000`.
* Een gedetailleerde setup van de reverse proxy valt buiten de scope van deze gids, maar er zijn veel tutorials online beschikbaar.

### 6. Start Listmonk {#6-start-listmonk}

Ga terug naar je `listmonk` map (als je daar nog niet bent) en start de containers in detached modus.

```bash
cd ~/listmonk # Of de map waar je docker-compose.yml hebt opgeslagen
docker compose up -d
```

Docker zal de benodigde images downloaden en de Listmonk applicatie en database containers starten. Dit kan de eerste keer een minuut of twee duren.

✅ **Toegang tot Listmonk**: Je zou nu via het domein dat je hebt geconfigureerd (bijv. `https://listmonk.jouwdomein.com`) toegang moeten hebben tot de Listmonk webinterface.

### 7. Configureer Forward Email SMTP in Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Configureer vervolgens Listmonk om e-mails te verzenden via je Forward Email-account.

1. **Schakel SMTP in bij Forward Email**: Zorg dat je SMTP-gegevens hebt gegenereerd in het dashboard van je Forward Email-account. Volg de [Forward Email gids om e-mail te verzenden met een aangepast domein via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) als je dit nog niet hebt gedaan.
2. **Configureer Listmonk**: Log in op je Listmonk beheerderspaneel.
   * Ga naar **Instellingen -> SMTP**.

   * Listmonk heeft ingebouwde ondersteuning voor Forward Email. Selecteer **ForwardEmail** uit de providerlijst, of voer handmatig de volgende gegevens in:

     | Instelling        | Waarde                                                                                                              |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Poort**         | `465`                                                                                                              |
     | **Auth protocol** | `LOGIN`                                                                                                            |
     | **Gebruikersnaam**| Je Forward Email **SMTP gebruikersnaam**                                                                           |
     | **Wachtwoord**    | Je Forward Email **SMTP wachtwoord**                                                                               |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Van e-mail**    | Het gewenste `Van`-adres (bijv. `newsletter@jouwdomein.com`). Zorg dat dit domein is geconfigureerd in Forward Email. |
* **Belangrijk**: Gebruik altijd poort `465` met `SSL/TLS` voor beveiligde verbindingen met Forward Email (aanbevolen). Poort `587` met STARTTLS wordt ook ondersteund, maar SSL/TLS heeft de voorkeur.

   * Klik op **Opslaan**.
3. **Test E-mail Verzenden**: Gebruik de knop "Test E-mail Verzenden" binnen de SMTP-instellingenpagina. Voer een ontvangeradres in dat je kunt bereiken en klik op **Verzenden**. Controleer of de e-mail in de inbox van de ontvanger aankomt.

### 8. Bounceverwerking Configureren {#8-configure-bounce-processing}

Bounceverwerking stelt Listmonk in staat automatisch e-mails af te handelen die niet bezorgd konden worden (bijv. door ongeldige adressen). Forward Email biedt een webhook om Listmonk te informeren over bounces.

#### Forward Email Instelling {#forward-email-setup}

1. Log in op je [Forward Email Dashboard](https://forwardemail.net/).
2. Ga naar **Domeinen**, selecteer het domein dat je gebruikt voor verzending, en ga naar de **Instellingen** pagina.
3. Scroll naar beneden naar de sectie **Bounce Webhook URL**.
4. Voer de volgende URL in, waarbij je `<your_listmonk_domain>` vervangt door het daadwerkelijke domein of subdomein waar je Listmonk-instantie bereikbaar is:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Voorbeeld*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scroll verder naar beneden naar de sectie **Webhook Signature Payload Verification Key**.
6. **Kopieer** de gegenereerde verificatiesleutel. Je hebt deze nodig in Listmonk.
7. Sla de wijzigingen op in je Forward Email domeininstellingen.

#### Listmonk Instelling {#listmonk-setup}

1. Ga in je Listmonk beheerpaneel naar **Instellingen -> Bounces**.
2. Schakel **Bounceverwerking inschakelen** in.
3. Schakel **Bounce webhooks inschakelen** in.
4. Scroll naar beneden naar de sectie **Webhook Providers**.
5. Schakel **Forward Email** in.
6. Plak de **Webhook Signature Payload Verification Key** die je van het Forward Email dashboard hebt gekopieerd in het veld **Forward Email Key**.
7. Klik onderaan de pagina op **Opslaan**.
8. Bounceverwerking is nu geconfigureerd! Wanneer Forward Email een bounce detecteert voor een door Listmonk verzonden e-mail, zal het je Listmonk-instantie via de webhook informeren, en zal Listmonk de abonnee dienovereenkomstig markeren.
9. Voltooi de onderstaande stappen in [Testen](#testing) om te controleren of alles werkt.


## Testen {#testing}

Hier is een kort overzicht van de kernfuncties van Listmonk:

### Maak een Mailinglijst aan {#create-a-mailing-list}

* Ga naar **Lijsten** in de zijbalk.
* Klik op **Nieuwe Lijst**.
* Vul de gegevens in (Naam, Type: Openbaar/Privé, Beschrijving, Tags) en klik op **Opslaan**.

### Abonnees Toevoegen {#add-subscribers}

* Navigeer naar de sectie **Abonnees**.
* Je kunt abonnees toevoegen:
  * **Handmatig**: Klik op **Nieuwe Abonnee**.
  * **Importeren**: Klik op **Abonnees Importeren** om een CSV-bestand te uploaden.
  * **API**: Gebruik de Listmonk API voor programmatische toevoegingen.
* Wijs abonnees toe aan één of meerdere lijsten tijdens het aanmaken of importeren.
* **Beste Praktijk**: Gebruik een double opt-in proces. Configureer dit onder **Instellingen -> Opt-in & Abonnementen**.

### Maak en Verstuur een Campagne {#create-and-send-a-campaign}

* Ga naar **Campagnes** -> **Nieuwe Campagne**.
* Vul de campagnedetails in (Naam, Onderwerp, Van E-mail, Lijst(en) om naar te verzenden).
* Kies je inhoudstype (Rich Text/HTML, Platte Tekst, Raw HTML).
* Stel je e-mailinhoud samen. Je kunt templatevariabelen gebruiken zoals `{{ .Subscriber.Email }}` of `{{ .Subscriber.FirstName }}`.
* **Verstuur altijd eerst een testmail!** Gebruik de optie "Test Verzenden" om de e-mail in je inbox te bekijken.
* Als je tevreden bent, klik op **Campagne Starten** om direct te verzenden of plan het voor later in.


## Verificatie {#verification}

* **SMTP Bezorging**: Verstuur regelmatig testmails via de SMTP-instellingenpagina van Listmonk en testcampagnes om te controleren of e-mails correct worden bezorgd.
* **Bounce Afhandeling**: Verstuur een testcampagne naar een bekend ongeldig e-mailadres (bijv. `bounce-test@yourdomain.com` als je geen echt adres bij de hand hebt, hoewel de resultaten kunnen variëren). Controleer na korte tijd de campagnestatistieken in Listmonk om te zien of de bounce is geregistreerd.
* **E-mail Headers**: Gebruik tools zoals [Mail-Tester](https://www.mail-tester.com/) of inspecteer handmatig e-mailheaders om te verifiëren dat SPF, DKIM en DMARC slagen, wat duidt op een correcte configuratie via Forward Email.
* **Forward Email Logs**: Controleer de logs in je Forward Email dashboard als je vermoedt dat er bezorgproblemen zijn die vanuit de SMTP-server komen.
## Ontwikkelaarsnotities {#developer-notes}

* **Templating**: Listmonk gebruikt de templating-engine van Go. Verken de documentatie voor geavanceerde personalisatie: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk biedt een uitgebreide REST API voor het beheren van lijsten, abonnees, campagnes, sjablonen en meer. Vind de API-documentatielink in de footer van je Listmonk-instantie.
* **Aangepaste Velden**: Definieer aangepaste abonneevelden onder **Instellingen -> Abonneevelden** om extra gegevens op te slaan.
* **Webhooks**: Naast bounces kan Listmonk webhooks verzenden voor andere gebeurtenissen (bijv. abonnementen), waardoor integratie met andere systemen mogelijk is.


## Conclusie {#conclusion}

Door de zelfgehoste kracht van Listmonk te combineren met de veilige, privacy-respecterende levering van Forward Email, creëer je een robuust en ethisch e-mailmarketingplatform. Je behoudt volledige eigendom van je publieksgegevens terwijl je profiteert van hoge afleverbaarheid en geautomatiseerde beveiligingsfuncties.

Deze opzet biedt een schaalbaar, kosteneffectief en ontwikkelaarsvriendelijk alternatief voor propriëtaire e-maildiensten, en sluit perfect aan bij de ethos van open-source software en gebruikersprivacy.

Veel succes met verzenden! 🚀
