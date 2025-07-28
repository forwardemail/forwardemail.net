# Zelf gehoste {#self-hosted}

## Inhoudsopgave {#table-of-contents}

* [Aan de slag](#getting-started)
* [Vereisten](#requirements)
  * [Cloud-init / Gebruikersgegevens](#cloud-init--user-data)
* [Installeren](#install)
  * [Debug-installatiescript](#debug-install-script)
  * [Aanwijzingen](#prompts)
  * [Eerste installatie (optie 1)](#initial-setup-option-1)
* [Diensten](#services)
  * [Belangrijke bestandspaden](#important-file-paths)
* [Configuratie](#configuration)
  * [Initiële DNS-instelling](#initial-dns-setup)
* [Aan boord nemen](#onboarding)
* [Testen](#testing)
  * [Uw eerste alias aanmaken](#creating-your-first-alias)
  * [Uw eerste e-mail verzenden/ontvangen](#sending--receiving-your-first-email)
* [Probleemoplossing](#troubleshooting)
  * [Wat is de basisauth-gebruikersnaam en het wachtwoord?](#what-is-the-basic-auth-username-and-password)
  * [Hoe weet ik wat er draait?](#how-do-i-know-what-is-running)
  * [Hoe weet ik of er iets niet draait dat wel zou moeten?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hoe vind ik logs?](#how-do-i-find-logs)
  * [Waarom verlopen mijn uitgaande e-mails?](#why-are-my-outgoing-emails-timing-out)

## Aan de slag {#getting-started}

Onze self-hosted e-mailoplossing is, net als al onze producten, 100% open-source, zowel frontend als backend. Dit betekent:

1. **Volledige transparantie**: Elke regel code die uw e-mails verwerkt, is beschikbaar voor openbare controle.
2. **Bijdragen van de community**: Iedereen kan verbeteringen bijdragen of problemen oplossen.
3. **Beveiliging door openheid**: Kwetsbaarheden kunnen worden geïdentificeerd en opgelost door een wereldwijde community.
4. **Geen vendor lock-in**: U bent nooit afhankelijk van het bestaan van ons bedrijf.

De volledige codebase is beschikbaar op GitHub op <https://github.com/forwardemail/forwardemail.net>, en valt onder de MIT-licentie.

De architectuur omvat containers voor:

* SMTP-server voor uitgaande e-mail
* IMAP/POP3-servers voor het ophalen van e-mail
* Webinterface voor beheer
* Database voor configuratieopslag
* Redis voor caching en prestaties
* SQLite voor veilige, versleutelde mailboxopslag

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Vereisten {#requirements}

Voordat u het installatiescript uitvoert, moet u ervoor zorgen dat u over het volgende beschikt:

* **Besturingssysteem**: Een Linux-server (momenteel met ondersteuning voor Ubuntu 22.04+).
* **Resources**: 1 vCPU en 2 GB RAM
* **Root-toegang**: Beheerdersrechten om opdrachten uit te voeren.
* **Domeinnaam**: Een aangepast domein klaar voor DNS-configuratie.
* **Schoon IP-adres**: Zorg ervoor dat uw server een schoon IP-adres heeft zonder eerdere spamreputatie door zwarte lijsten te controleren. Meer informatie: [hier](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Openbaar IP-adres met ondersteuning voor poort 25
* Mogelijkheid om [omgekeerde PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) in te stellen
* Ondersteuning voor IPv4 en IPv6

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Gebruikersgegevens {#cloud-init--user-data}

De meeste cloudleveranciers ondersteunen een cloud-init-configuratie voor wanneer de virtual private server (VPS) wordt ingericht. Dit is een geweldige manier om vooraf een aantal bestanden en omgevingsvariabelen in te stellen voor gebruik door de initiële installatielogica van de scripts, waardoor de noodzaak om te vragen om aanvullende informatie terwijl het script wordt uitgevoerd, wordt omzeild.

**Opties**

* `EMAIL` - e-mailadres voor Certbot-vervaldatumherinneringen
* `DOMAIN` - aangepast domein (bijv. `example.com`) voor de installatie van zelfhosting
* `AUTH_BASIC_USERNAME` - gebruikersnaam voor de eerste installatie om de site te beveiligen
* `AUTH_BASIC_PASSWORD` - wachtwoord voor de eerste installatie om de site te beveiligen
* `/root/.cloudflare.ini` - (**Alleen voor Cloudflare-gebruikers**) Cloudflare-configuratiebestand dat door Certbot wordt gebruikt voor DNS-configuratie. Hiervoor moet u uw API-token instellen via `dns_cloudflare_api_token`. Lees meer [hier](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

## Installeer {#install}

Voer de volgende opdracht uit op uw server om het installatiescript te downloaden en uit te voeren:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debug-installatiescript {#debug-install-script}

Voeg `DEBUG=true` toe voor het installatiescript voor uitgebreide uitvoer:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Vraagt {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Eerste installatie**: Download de nieuwste doorstuurcode, configureer de omgeving, vraag om uw aangepaste domein en stel alle benodigde certificaten, sleutels en geheimen in.
* **Back-up instellen**: Hiermee wordt een cron ingesteld om mongoDB en redis te back-uppen met behulp van een S3-compatibele opslag voor veilige, externe opslag. Daarnaast wordt sqlite bij het inloggen apart geback-upt als er wijzigingen zijn voor veilige, versleutelde back-ups.
* **Upgrade instellen**: Hiermee wordt een cron ingesteld om te zoeken naar nachtelijke updates die infrastructuurcomponenten veilig herbouwen en herstarten.
* **Certificaten vernieuwen**: Certbot / lets encrypt wordt gebruikt voor SSL-certificaten en sleutels verlopen elke 3 maanden. Hiermee worden de certificaten voor uw domein verlengd en in de benodigde map geplaatst zodat gerelateerde componenten deze kunnen gebruiken. Zie [belangrijke bestandspaden](#important-file-paths)
* **Herstellen van back-up**: Hiermee worden mongoDB en redis aangezet om te herstellen vanaf back-upgegevens.

### Eerste installatie (optie 1) {#initial-setup-option-1}

Kies optie `1. Initial setup` om te beginnen.

Zodra de installatie is voltooid, ziet u een bericht dat de installatie is voltooid. U kunt zelfs `docker ps` uitvoeren om te zien welke componenten zijn opgestart. Meer informatie over componenten vindt u hieronder.

## Diensten {#services}

| Servicenaam | Standaardpoort | Beschrijving |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webinterface voor alle beheerdersinteracties |
| API | `4000` | API-laag voor het abstraheren van databases |
| Bree | Geen | Achtergrondtaak en taakrunner |
| SMTP | `465/587` | SMTP-server voor uitgaande e-mail |
| SMTP-Bree | Geen | SMTP-achtergrondtaak |
| MX | `2525` | Mailuitwisseling voor inkomende e-mail en e-maildoorsturing |
| IMAP | `993/2993` | IMAP-server voor inkomende e-mail en mailboxbeheer |
| POP3 | `995/2995` | POP3-server voor inkomende e-mail en mailboxbeheer |
| SQLite | `3456` | SQLite-server voor interacties met SQLite-database(s) |
| SQLite Bree | Geen | SQLite achtergrondtaak |
| CalDAV | `5000` | CalDAV-server voor agendabeheer |
| KaartDAV | `6000` | CardDAV-server voor agendabeheer |
| MongoDB | `27017` | MongoDB-database voor de meeste gegevensbeheer |
| Redis | `6379` | Redis voor caching en statusbeheer |
| SQLite | Geen | SQLite-database(s) voor gecodeerde mailboxen |

### Belangrijke bestandspaden {#important-file-paths}

Let op: het onderstaande *hostpad* is relatief ten opzichte van `/root/forwardemail.net/self-hosting/`.

| Onderdeel | Hostpad | Containerpad |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-bestand | `./.env` | `/app/.env` |
| SSL-certificaten/sleutels | `./ssl` | `/app/ssl/` |
| Privésleutel | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certificaat voor volledige keten | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Gecertificeerde CA's | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM-privésleutel | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## Configuratie {#configuration}

### Initiële DNS-instelling {#initial-dns-setup}

Configureer de juiste DNS-records in de DNS-provider van uw keuze. Let op: alles tussen haakjes (`<>`) is dynamisch en moet worden bijgewerkt met uw waarde.

| Type | Naam | Inhoud | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", of leeg | <ip_adres> | auto |
| CNAME | api | <domeinnaam> | auto |
| CNAME | caldav | <domeinnaam> | auto |
| CNAME | kaartdatum | <domeinnaam> | auto |
| CNAME | fe-stuitert | <domeinnaam> | auto |
| CNAME | afbeelding | <domeinnaam> | auto |
| CNAME | mx | <domeinnaam> | auto |
| CNAME | pop3 | <domeinnaam> | auto |
| CNAME | smtp | <domeinnaam> | auto |
| MX | "@", ".", of leeg | mx.<domeinnaam> (prioriteit 0) | auto |
| TXT | "@", ".", of leeg | "v=spf1 a -all" | auto |

#### Omgekeerde DNS/PTR-record {#reverse-dns--ptr-record}

Reverse DNS (rDNS) of reverse pointer records (PTR records) zijn essentieel voor e-mailservers omdat ze helpen de legitimiteit van de server die de e-mail verzendt te verifiëren. Elke cloudprovider doet dit anders, dus u zult moeten opzoeken hoe u "Reverse DNS" kunt toevoegen om de host en IP toe te wijzen aan de bijbehorende hostnaam. Waarschijnlijk in het netwerkgedeelte van de provider.

#### Poort 25 geblokkeerd {#port-25-blocked}

Sommige ISP's en cloudproviders blokkeren 25 om kwaadwillenden te vermijden. Mogelijk moet u een supportticket indienen om poort 25 te openen voor SMTP/uitgaande e-mail.

## Onboarding {#onboarding}

1. Open de landingspagina
Navigeer naar https\://\<domeinnaam> en vervang \<domeinnaam> door het domein dat is geconfigureerd in je DNS-instellingen. Je zou de landingspagina voor het doorsturen van e-mail moeten zien.

2. Log in en registreer uw domein

* Meld u aan met een geldig e-mailadres en wachtwoord.
* Voer de domeinnaam in die u wilt instellen (deze moet overeenkomen met de DNS-configuratie).
* Volg de instructies om de vereiste **MX**- en **TXT**-records toe te voegen ter verificatie.

3. Volledige installatie

* Na verificatie gaat u naar de pagina Aliassen om uw eerste alias aan te maken.
* Optioneel kunt u **SMTP voor uitgaande e-mail** configureren in de **Domeininstellingen**. Hiervoor zijn extra DNS-records vereist.

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## Testen van {#testing}

### Uw eerste alias aanmaken {#creating-your-first-alias}

1. Navigeer naar de pagina Aliassen
Open de pagina voor aliasbeheer:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Voeg een nieuwe alias toe

* Klik op **Alias toevoegen** (rechtsboven).
* Voer de aliasnaam in en pas de e-mailinstellingen naar wens aan.
* (Optioneel) Schakel **IMAP/POP3/CalDAV/CardDAV**-ondersteuning in door het selectievakje aan te vinken.
* Klik op **Alias aanmaken.**

3. Stel een wachtwoord in

* Klik op **Wachtwoord genereren** om een veilig wachtwoord aan te maken.
* Dit wachtwoord is vereist om in te loggen op uw e-mailclient.

4. Configureer uw e-mailclient

* Gebruik een e-mailclient zoals Thunderbird.
* Voer de aliasnaam en het gegenereerde wachtwoord in.
* Configureer de **IMAP**- en **SMTP**-instellingen dienovereenkomstig.

#### E-mailserverinstellingen {#email-server-settings}

Gebruikersnaam: `<alias name>`

| Type | Hostnaam | Haven | Verbindingsbeveiliging | Authenticatie |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domeinnaam> | 465 | SSL / TLS | Normaal wachtwoord |
| IMAP | imap.<domeinnaam> | 993 | SSL / TLS | Normaal wachtwoord |

### Uw eerste e-mail verzenden/ontvangen {#sending--receiving-your-first-email}

Nadat u het hebt geconfigureerd, kunt u e-mails versturen en ontvangen naar uw nieuwe en zelf gehoste e-mailadres!

## Problemen oplossen {#troubleshooting}

#### Waarom werkt dit niet buiten Ubuntu en Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

We zijn momenteel bezig met het ondersteunen van MacOS en zullen ook naar anderen kijken. Open een [discussie](https://github.com/orgs/forwardemail/discussions) of draag bij als je wilt dat anderen ondersteund worden.

#### Waarom mislukt de certbot acme-uitdaging {#why-is-the-certbot-acme-challenge-failing}

De meest voorkomende valkuil is dat certbot/letsencrypt soms **2** challenges aanvraagt. Zorg ervoor dat je **BEIDE** txt-records toevoegt.

Voorbeeld:
Je ziet mogelijk twee uitdagingen zoals deze:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Het is ook mogelijk dat de DNS-propagatie nog niet is voltooid. U kunt tools gebruiken zoals: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Dit geeft u een idee of uw TXT-recordwijzigingen moeten worden doorgevoerd. Het is ook mogelijk dat de lokale DNS-cache op uw host nog steeds een oude, verouderde waarde gebruikt of de recente wijzigingen niet heeft herkend.

Een andere optie is om de geautomatiseerde DNS-wijzigingen van Cerbot te gebruiken door het bestand `/root/.cloudflare.ini` in te stellen met de API-token in je cloud-init/user-data bij de eerste VPS-installatie, of dit bestand aan te maken en het script opnieuw uit te voeren. Dit beheert de DNS-wijzigingen en challenge-updates automatisch.

### Wat is de basis-authenticatiegebruikersnaam en het wachtwoord {#what-is-the-basic-auth-username-and-password}

Voor self-hosting voegen we een pop-up toe voor native authenticatie in de browser met een eenvoudige gebruikersnaam (`admin`) en wachtwoord (willekeurig gegenereerd bij de eerste installatie). We voegen dit alleen toe als bescherming voor het geval automatisering/scrapers u voor zijn bij uw eerste aanmelding op de website. U vindt dit wachtwoord na de eerste installatie in uw bestand `.env` onder `AUTH_BASIC_USERNAME` en `AUTH_BASIC_PASSWORD`.

### Hoe weet ik wat er {#how-do-i-know-what-is-running} draait?

Je kunt `docker ps` uitvoeren om alle actieve containers te zien die vanuit het bestand `docker-compose-self-hosting.yml` worden opgestart. Je kunt ook `docker ps -a` uitvoeren om alles te zien (inclusief containers die niet actief zijn).

### Hoe weet ik of er iets niet draait dat wel zou moeten {#how-do-i-know-if-something-isnt-running-that-should-be}

U kunt `docker ps -a` uitvoeren om alles te zien (inclusief containers die niet actief zijn). Mogelijk ziet u een exit-log of notitie.

### Hoe vind ik logs {#how-do-i-find-logs}

Je kunt meer logs verkrijgen via `docker logs -f <container_name>`. Als er iets niet klopt, is de kans groot dat het bestand `.env` onjuist is geconfigureerd.

Binnen de webinterface kunt u respectievelijk `/admin/emails` en `/admin/logs` bekijken voor uitgaande e-maillogs en foutlogs.

### Waarom verlopen mijn uitgaande e-mails? {#why-are-my-outgoing-emails-timing-out}

Als u een bericht ziet zoals Connection timed out when connecting to MX server... dan moet u mogelijk controleren of poort 25 is geblokkeerd. Het is gebruikelijk dat ISP's of cloudproviders dit standaard blokkeren, waarbij u mogelijk contact moet opnemen met support / een ticket moet indienen om dit te openen.

#### Welke tools moet ik gebruiken om best practices voor e-mailconfiguratie en IP-reputatie te testen? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Bekijk onze [FAQ hier](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).