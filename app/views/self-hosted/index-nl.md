# Zelf Gehost {#self-hosted}


## Inhoudsopgave {#table-of-contents}

* [Aan de slag](#getting-started)
* [Vereisten](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Installatie](#install)
  * [Installatiescript debuggen](#debug-install-script)
  * [Prompts](#prompts)
  * [Initiële Setup (Optie 1)](#initial-setup-option-1)
* [Diensten](#services)
  * [Belangrijke bestandslocaties](#important-file-paths)
* [Configuratie](#configuration)
  * [Initiële DNS-configuratie](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testen](#testing)
  * [Je eerste alias aanmaken](#creating-your-first-alias)
  * [Je eerste e-mail verzenden / ontvangen](#sending--receiving-your-first-email)
* [Probleemoplossing](#troubleshooting)
  * [Wat is de gebruikersnaam en het wachtwoord voor basic auth](#what-is-the-basic-auth-username-and-password)
  * [Hoe weet ik wat er draait](#how-do-i-know-what-is-running)
  * [Hoe weet ik of iets niet draait terwijl het wel zou moeten](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hoe vind ik logs](#how-do-i-find-logs)
  * [Waarom verlopen mijn uitgaande e-mails](#why-are-my-outgoing-emails-timing-out)


## Aan de slag {#getting-started}

Onze zelfgehoste e-mailoplossing, net als al onze producten, is 100% open-source—zowel frontend als backend. Dit betekent:

1. **Volledige Transparantie**: Elke regel code die je e-mails verwerkt is beschikbaar voor publieke controle
2. **Community Bijdragen**: Iedereen kan verbeteringen aanbrengen of problemen oplossen
3. **Beveiliging door Openheid**: Kwetsbaarheden kunnen worden geïdentificeerd en opgelost door een wereldwijde community
4. **Geen Vendor Lock-in**: Je bent nooit afhankelijk van het voortbestaan van ons bedrijf

De volledige codebase is beschikbaar op GitHub via <https://github.com/forwardemail/forwardemail.net>, gelicenseerd onder de MIT License.

De architectuur omvat containers voor:

* SMTP-server voor uitgaande e-mail
* IMAP/POP3-servers voor e-mail ophalen
* Webinterface voor administratie
* Database voor configuratieopslag
* Redis voor caching en prestaties
* SQLite voor veilige, versleutelde mailboxopslag

> \[!NOTE]
> Bekijk zeker onze [zelfgehoste blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> En voor wie geïnteresseerd is in een meer stapsgewijze versie, zie onze [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) of [Debian](https://forwardemail.net/guides/selfhosted-on-debian) gebaseerde handleidingen.


## Vereisten {#requirements}

Voordat je het installatiescript uitvoert, zorg dat je het volgende hebt:

* **Besturingssysteem**: Een Linux-gebaseerde server (momenteel ondersteund: Ubuntu 22.04+).
* **Resources**: 1 vCPU en 2GB RAM
* **Root Toegang**: Administratieve rechten om commando’s uit te voeren.
* **Domeinnaam**: Een eigen domein klaar voor DNS-configuratie.
* **Schone IP**: Zorg dat je server een schone IP-adres heeft zonder eerdere spamreputatie door blacklists te controleren. Meer info [hier](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Publiek IP-adres met poort 25 ondersteuning
* Mogelijkheid om [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) in te stellen
* IPv4 en IPv6 ondersteuning

> \[!TIP]
> Bekijk onze lijst met [geweldige mailserver providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

De meeste cloudproviders ondersteunen een cloud-init configuratie voor wanneer de virtuele private server (VPS) wordt ingericht. Dit is een geweldige manier om vooraf enkele bestanden en omgevingsvariabelen in te stellen die gebruikt worden door de initiële setup-logica van de scripts, waardoor het niet nodig is om tijdens het draaien van het script om extra informatie te vragen.

**Opties**

* `EMAIL` - e-mail gebruikt voor certbot vervaldatum herinneringen
* `DOMAIN` - eigen domein (bijv. `example.com`) gebruikt voor zelfhosting setup
* `AUTH_BASIC_USERNAME` - gebruikersnaam gebruikt bij eerste setup om de site te beschermen
* `AUTH_BASIC_PASSWORD` - wachtwoord gebruikt bij eerste setup om de site te beschermen
* `/root/.cloudflare.ini` - (**alleen Cloudflare gebruikers**) Cloudflare configuratiebestand gebruikt door certbot voor DNS-configuratie. Vereist dat je je API-token instelt via `dns_cloudflare_api_token`. Lees meer [hier](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Voorbeeld:

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


## Installeren {#install}

Voer het volgende commando uit op uw server om het installatiescript te downloaden en uit te voeren:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debug installatiescript {#debug-install-script}

Voeg `DEBUG=true` toe vóór het installatiescript voor gedetailleerde uitvoer:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompts {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial setup**: Download de nieuwste forward email code, configureer de omgeving, vraag om uw aangepaste domein en stel alle benodigde certificaten, sleutels en geheimen in.
* **Setup Backup**: Stelt een cron in om mongoDB en redis te back-uppen met een S3-compatibele opslag voor veilige, externe opslag. Daarnaast wordt sqlite bij inloggen geback-upt als er wijzigingen zijn voor veilige, versleutelde back-ups.
* **Setup Upgrade**: Stelt een cron in om te zoeken naar nachtelijke updates die infrastructuurcomponenten veilig zullen herbouwen en herstarten.
* **Renew certificates**: Certbot / lets encrypt wordt gebruikt voor SSL-certificaten en sleutels die elke 3 maanden verlopen. Dit vernieuwt de certificaten voor uw domein en plaatst ze in de benodigde map zodat gerelateerde componenten ze kunnen gebruiken. Zie [belangrijke bestandslocaties](#important-file-paths)
* **Restore from backup**: Zal mongodb en redis activeren om te herstellen vanaf back-upgegevens.

### Eerste installatie (Optie 1) {#initial-setup-option-1}

Kies optie `1. Initial setup` om te beginnen.

Na voltooiing zou u een succesbericht moeten zien. U kunt zelfs `docker ps` uitvoeren om **de** opgestarte componenten te zien. Meer informatie over componenten hieronder.


## Diensten {#services}

| Service Naam |         Standaard Poort        | Beschrijving                                            |
| ------------ | :-----------------------------: | ------------------------------------------------------ |
| Web          |            `443`                | Webinterface voor alle admin interacties               |
| API          |            `4000`               | API-laag om databases te abstraheren                    |
| Bree         |             Geen                | Achtergrondtaak en taakuitvoerder                        |
| SMTP         | `465` (aanbevolen) / `587`     | SMTP-server voor uitgaande e-mail                       |
| SMTP Bree    |             Geen                | SMTP achtergrondtaak                                    |
| MX           |            `2525`               | Mail exchange voor inkomende e-mail en e-mail forwarding |
| IMAP         |          `993/2993`             | IMAP-server voor inkomende e-mail en mailboxbeheer     |
| POP3         |          `995/2995`             | POP3-server voor inkomende e-mail en mailboxbeheer     |
| SQLite       |            `3456`               | SQLite-server voor interacties met sqlite database(s)  |
| SQLite Bree  |             Geen                | SQLite achtergrondtaak                                  |
| CalDAV       |            `5000`               | CalDAV-server voor kalenderbeheer                       |
| CardDAV      |            `6000`               | CardDAV-server voor kalenderbeheer                      |
| MongoDB      |           `27017`               | MongoDB database voor het meeste databeheer            |
| Redis        |            `6379`               | Redis voor caching en statusbeheer                      |
| SQLite       |             Geen                | SQLite database(s) voor versleutelde mailboxen         |

### Belangrijke bestandslocaties {#important-file-paths}

Opmerking: *Host path* hieronder is relatief ten opzichte van `/root/forwardemail.net/self-hosting/`.

| Component              |       Host path       | Container path               |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env bestand            |        `./.env`       | `/app/.env`                  |
| SSL certificaten/sleutels |        `./ssl`        | `/app/ssl/`                  |
| Privésleutel           |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Volledige keten certificaat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA certificaat         |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM privésleutel      |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Bewaar het `.env` bestand veilig. Het is cruciaal voor herstel in geval van storing.
> Je kunt dit vinden in `/root/forwardemail.net/self-hosting/.env`.


## Configuratie {#configuration}

### Initiële DNS-configuratie {#initial-dns-setup}

Configureer bij je DNS-provider naar keuze de juiste DNS-records. Let op dat alles tussen haakjes (`<>`) dynamisch is en bijgewerkt moet worden met jouw waarde.

| Type  | Naam               | Inhoud                       | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", of leeg  | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", of leeg  | mx.<domain_name> (prioriteit 0) | auto |
| TXT   | "@", ".", of leeg  | "v=spf1 a -all"               | auto |

#### Reverse DNS / PTR-record {#reverse-dns--ptr-record}

Reverse DNS (rDNS) of reverse pointer records (PTR-records) zijn essentieel voor mailservers omdat ze helpen de legitimiteit van de server die de e-mail verzendt te verifiëren. Elke cloudprovider doet dit anders, dus je zult moeten opzoeken hoe je "Reverse DNS" toevoegt om de host en IP te koppelen aan de bijbehorende hostnaam. Meestal te vinden in het netwerkgedeelte van de provider.

#### Poort 25 geblokkeerd {#port-25-blocked}

Sommige ISP's en cloudproviders blokkeren poort 25 om misbruik te voorkomen. Mogelijk moet je een supportticket indienen om poort 25 te openen voor SMTP / uitgaande e-mail.


## Onboarding {#onboarding}

1. Open de Landingspagina
   Navigeer naar https\://\<domain_name>, waarbij je \<domain_name> vervangt door de domeinnaam die je in je DNS-instellingen hebt geconfigureerd. Je zou de Forward Email landingspagina moeten zien.

2. Log in en onboard je domein

* Log in met een geldig e-mailadres en wachtwoord.
* Voer de domeinnaam in die je wilt instellen (dit moet overeenkomen met de DNS-configuratie).
* Volg de aanwijzingen om de vereiste **MX** en **TXT** records toe te voegen voor verificatie.

3. Voltooi de installatie

* Zodra geverifieerd, ga naar de Aliassen-pagina om je eerste alias aan te maken.
* Optioneel: configureer **SMTP voor uitgaande e-mail** in de **Domeininstellingen**. Dit vereist extra DNS-records.

> \[!NOTE]
> Er wordt geen informatie buiten je server verzonden. De zelf gehoste optie en het initiële account zijn alleen voor de admin-login en webweergave om domeinen, aliassen en gerelateerde e-mailconfiguraties te beheren.


## Testen {#testing}

### Je eerste alias aanmaken {#creating-your-first-alias}

1. Navigeer naar de Aliassen-pagina
   Open de aliasbeheerpagina:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Voeg een nieuwe alias toe

* Klik op **Alias toevoegen** (rechtsboven).
* Voer de aliasnaam in en pas de e-mailinstellingen aan indien nodig.
* (Optioneel) Schakel **IMAP/POP3/CalDAV/CardDAV** ondersteuning in door het selectievakje aan te vinken.
* Klik op **Alias aanmaken.**

3. Stel een wachtwoord in

* Klik op **Wachtwoord genereren** om een veilig wachtwoord aan te maken.
* Dit wachtwoord is nodig om in te loggen in je e-mailclient.

4. Configureer je e-mailclient

* Gebruik een e-mailclient zoals Thunderbird.
* Voer de aliasnaam en het gegenereerde wachtwoord in.
* Configureer de **IMAP** en **SMTP** instellingen overeenkomstig.

#### E-mailserver instellingen {#email-server-settings}

Gebruikersnaam: `<alias name>`

| Type | Hostnaam           | Poort | Verbindingsbeveiliging | Authenticatie  |
| ---- | ------------------ | ----- | ---------------------- | ------------- |
| SMTP | smtp.<domain_name> | 465   | SSL / TLS              | Normaal wachtwoord |
| IMAP | imap.<domain_name> | 993   | SSL / TLS              | Normaal wachtwoord |

### Je eerste e-mail verzenden / ontvangen {#sending--receiving-your-first-email}

Zodra alles is geconfigureerd, zou je e-mail moeten kunnen verzenden en ontvangen naar je nieuw aangemaakte en zelf gehoste e-mailadres!
## Problemen oplossen {#troubleshooting}

#### Waarom werkt dit niet buiten Ubuntu en Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

We zijn momenteel bezig met ondersteuning voor MacOS en zullen naar anderen kijken. Open alstublieft een [discussie](https://github.com/orgs/forwardemail/discussions) of draag bij als u ondersteuning voor anderen wilt zien.

#### Waarom faalt de certbot acme challenge {#why-is-the-certbot-acme-challenge-failing}

De meest voorkomende valkuil is dat certbot / letsencrypt soms **2** challenges opvraagt. U moet er zeker van zijn dat u **BEIDE** txt-records toevoegt.

Voorbeeld:
U kunt twee challenges zien zoals deze:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Het is ook mogelijk dat de DNS-propagatie nog niet is voltooid. U kunt tools gebruiken zoals: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dit geeft u een idee of uw TXT-recordwijzigingen al zichtbaar zouden moeten zijn. Het is ook mogelijk dat de lokale DNS-cache op uw host nog een oude, verouderde waarde gebruikt of de recente wijzigingen nog niet heeft opgepikt.

Een andere optie is om de geautomatiseerde certbot DNS-wijzigingen te gebruiken door het bestand `/root/.cloudflare.ini` met de api-token in te stellen in uw cloud-init / user-data bij de eerste VPS-installatie of dit bestand aan te maken en het script opnieuw uit te voeren. Dit beheert de DNS-wijzigingen en challenge-updates automatisch.

### Wat is de basic auth gebruikersnaam en wachtwoord {#what-is-the-basic-auth-username-and-password}

Voor zelfhosting voegen we een eerste keer een native browser authenticatie pop-up toe met een eenvoudige gebruikersnaam (`admin`) en wachtwoord (willekeurig gegenereerd bij de eerste installatie). Dit voegen we toe als bescherming voor het geval automatisering / scrapers u op de webervaring voor zijn met aanmelden. U kunt dit wachtwoord na de eerste installatie vinden in uw `.env` bestand onder `AUTH_BASIC_USERNAME` en `AUTH_BASIC_PASSWORD`.

### Hoe weet ik wat er draait {#how-do-i-know-what-is-running}

U kunt `docker ps` uitvoeren om alle draaiende containers te zien die worden opgestart vanuit het `docker-compose-self-hosting.yml` bestand. U kunt ook `docker ps -a` uitvoeren om alles te zien (inclusief containers die niet draaien).

### Hoe weet ik of iets niet draait dat wel zou moeten {#how-do-i-know-if-something-isnt-running-that-should-be}

U kunt `docker ps -a` uitvoeren om alles te zien (inclusief containers die niet draaien). U kunt een exit-log of melding zien.

### Hoe vind ik logs {#how-do-i-find-logs}

U kunt meer logs krijgen via `docker logs -f <container_name>`. Als iets is gestopt, heeft dat waarschijnlijk te maken met een verkeerd geconfigureerd `.env` bestand.

Binnen de web UI kunt u `/admin/emails` en `/admin/logs` bekijken voor respectievelijk uitgaande e-mail logs en foutlogs.

### Waarom verlopen mijn uitgaande e-mails door time-outs {#why-are-my-outgoing-emails-timing-out}

Als u een bericht ziet zoals Connection timed out when connecting to MX server... dan moet u mogelijk controleren of poort 25 geblokkeerd is. Het is gebruikelijk dat ISP's of cloudproviders dit standaard blokkeren, waarbij u contact moet opnemen met de support / een ticket moet indienen om dit te laten openen.

#### Welke tools moet ik gebruiken om e-mailconfiguratie best practices en IP-reputatie te testen {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Bekijk onze [FAQ hier](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
