# Zelfgehoste e-mail: toewijding aan open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Waarom zelfgehoste e-mail belangrijk is](#why-self-hosted-email-matters)
  * [Het probleem met traditionele e-maildiensten](#the-problem-with-traditional-email-services)
  * [Het zelf-gehoste alternatief](#the-self-hosted-alternative)
* [Onze zelfgehoste implementatie: technisch overzicht](#our-self-hosted-implementation-technical-overview)
  * [Docker-gebaseerde architectuur voor eenvoud en draagbaarheid](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-scriptinstallatie: toegankelijkheid en beveiliging](#bash-script-installation-accessibility-meets-security)
  * [Quantumveilige encryptie voor toekomstbestendige privacy](#quantum-safe-encryption-for-future-proof-privacy)
  * [Geautomatiseerd onderhoud en updates](#automated-maintenance-and-updates)
* [De open-source-verbintenis](#the-open-source-commitment)
* [Zelf hosten versus beheren: de juiste keuze maken](#self-hosted-vs-managed-making-the-right-choice)
  * [De realiteit van zelf-hosting van e-mail](#the-reality-of-self-hosting-email)
  * [Wanneer u voor onze beheerde service kiest](#when-to-choose-our-managed-service)
* [Aan de slag met zelfgehoste doorstuur-e-mail](#getting-started-with-self-hosted-forward-email)
  * [Systeemvereisten](#system-requirements)
  * [Installatiestappen](#installation-steps)
* [De toekomst van zelfgehoste e-mail](#the-future-of-self-hosted-email)
* [Conclusie: e-mailvrijheid voor iedereen](#conclusion-email-freedom-for-everyone)
* [Referenties](#references)

## Voorwoord {#foreword}

In het huidige digitale landschap blijft e-mail de ruggengraat van onze online identiteit en communicatie. Maar naarmate de zorgen over privacy toenemen, staan veel gebruikers voor een lastige keuze: gemak ten koste van privacy, of privacy ten koste van gemak. Bij Forward Email zijn we er altijd van overtuigd geweest dat u niet tussen de twee hoeft te kiezen.

Vandaag kondigen we met trots een belangrijke mijlpaal in onze reis aan: de lancering van onze zelfgehoste e-mailoplossing. Deze functionaliteit weerspiegelt onze diepste toewijding aan open-sourceprincipes, privacygericht ontwerp en gebruikersondersteuning. Met onze zelfgehoste optie geven we u de volledige controle over uw e-mailcommunicatie.

In deze blogpost onderzoeken we de filosofie achter onze zelfgehoste oplossing, de technische implementatie ervan en waarom dit belangrijk is voor gebruikers die prioriteit geven aan privacy en eigenaarschap in hun digitale communicatie.

## Waarom zelfgehoste e-mail belangrijk is {#why-self-hosted-email-matters}

Onze zelfgehoste e-mailoplossing is de duidelijkste uiting van onze overtuiging dat echte privacy controle betekent, en controle begint met open source. Voor gebruikers die volledige zeggenschap over hun digitale communicatie eisen, is zelfhosting niet langer een randverschijnsel – het is een essentieel recht. We zijn er trots op dat we achter die overtuiging staan met een volledig open, verifieerbaar platform dat u op uw eigen voorwaarden kunt beheren.

### Het probleem met traditionele e-maildiensten {#the-problem-with-traditional-email-services}

Traditionele e-maildiensten brengen een aantal fundamentele uitdagingen met zich mee voor privacybewuste gebruikers:

1. **Vertrouwensvereisten**: U moet erop vertrouwen dat de provider geen toegang heeft tot uw gegevens, deze niet analyseert of deelt.
2. **Gecentraliseerde controle**: Uw toegang kan op elk moment en om welke reden dan ook worden ingetrokken.
3. **Kwetsbaarheid in surveillance**: Gecentraliseerde services zijn belangrijke doelwitten voor surveillance.
4. **Beperkte transparantie**: De meeste services gebruiken propriëtaire, closed-source software.
5. **Leverancierslock-in**: Migreren van deze services kan moeilijk of onmogelijk zijn.

Zelfs "privacygerichte" e-mailproviders schieten vaak tekort door alleen hun frontend-applicaties open source te maken, terwijl hun backend-systemen bedrijfseigen en gesloten blijven. Dit creëert een aanzienlijke vertrouwenskloof: je wordt gevraagd hun privacybeloften te geloven zonder de mogelijkheid om ze te verifiëren.

### Het zelf-gehoste alternatief {#the-self-hosted-alternative}

Zelf uw e-mail hosten biedt een fundamenteel andere aanpak:

1. **Volledige controle**: U bezit en beheert de volledige e-mailinfrastructuur
2. **Verifieerbare privacy**: Het hele systeem is transparant en controleerbaar
3. **Geen vertrouwen vereist**: U hoeft uw communicatie niet aan een derde partij toe te vertrouwen
4. **Aanpassingsvrijheid**: Pas het systeem aan uw specifieke behoeften aan
5. **Veerkracht**: Uw service blijft doorlopen, ongeacht de beslissingen van uw bedrijf

Zoals een gebruiker het verwoordde: "Het zelf hosten van mijn e-mail is het digitale equivalent van het verbouwen van mijn eigen voedsel – het kost meer werk, maar ik weet precies wat erin zit."

## Onze zelfgehoste implementatie: technisch overzicht {#our-self-hosted-implementation-technical-overview}

Onze zelfgehoste e-mailoplossing is gebaseerd op dezelfde privacy-eerste principes die al onze producten kenmerken. Laten we de technische implementatie bekijken die dit mogelijk maakt.

### Docker-gebaseerde architectuur voor eenvoud en draagbaarheid {#docker-based-architecture-for-simplicity-and-portability}

We hebben onze volledige e-mailinfrastructuur gebundeld met Docker, waardoor deze eenvoudig te implementeren is op vrijwel elk Linux-systeem. Deze containeraanpak biedt verschillende belangrijke voordelen:

1. **Vereenvoudigde implementatie**: Met één opdracht wordt de volledige infrastructuur ingesteld
2. **Consistente omgeving**: Lost problemen met "werkt op mijn machine" op
3. **Geïsoleerde componenten**: Elke service draait in een eigen container voor beveiliging
4. **Eenvoudige updates**: Eenvoudige opdrachten om de volledige stack bij te werken
5. **Minimale afhankelijkheden**: Vereist alleen Docker en Docker Compose

De architectuur omvat containers voor:

* Webinterface voor beheer
* SMTP-server voor uitgaande e-mail
* IMAP/POP3-servers voor het ophalen van e-mail
* CalDAV-server voor agenda's
* CardDAV-server voor contacten
* Database voor configuratieopslag
* Redis voor caching en prestaties
* SQLite voor veilige, versleutelde mailboxopslag

> \[!NOTE]
> Bekijk zeker onze [zelf-gehoste ontwikkelaarsgids](https://forwardemail.net/self-hosted)

### Bash-scriptinstallatie: toegankelijkheid en beveiliging {#bash-script-installation-accessibility-meets-security}

We hebben het installatieproces zo eenvoudig mogelijk ontworpen, waarbij we de beste beveiligingspraktijken in acht hebben genomen:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Dit ene commando:

1. Controleert de systeemvereisten
2. Begeleidt u door de configuratie
3. Stelt DNS-records in
4. Configureert TLS-certificaten
5. Implementeert de Docker-containers
6. Voert een eerste beveiligingsversterking uit

Voor degenen die zich zorgen maken over het doorsturen van scripts naar bash (en dat zou je ook moeten doen!), raden we aan het script te controleren vóór de uitvoering. Het is volledig open-source en beschikbaar voor inspectie.

### Quantum-veilige encryptie voor toekomstbestendige privacy {#quantum-safe-encryption-for-future-proof-privacy}

Net als onze gehoste service implementeert onze zelfgehoste oplossing kwantumbestendige encryptie met ChaCha20-Poly1305 als codering voor SQLite-databases. Deze aanpak beschermt uw e-mailgegevens niet alleen tegen huidige bedreigingen, maar ook tegen toekomstige aanvallen met kwantumcomputers.

Elke mailbox wordt opgeslagen in een eigen, gecodeerd SQLite-databasebestand. Hierdoor is er volledige isolatie tussen gebruikers. Dit is een aanzienlijk beveiligingsvoordeel ten opzichte van traditionele gedeelde databases.

### Geautomatiseerd onderhoud en updates {#automated-maintenance-and-updates}

We hebben uitgebreide onderhoudshulpprogramma's rechtstreeks in de zelf-gehoste oplossing ingebouwd:

1. **Automatische back-ups**: Geplande back-ups van alle kritieke gegevens
2. **Certificaatvernieuwing**: Geautomatiseerd Let's Encrypt-certificaatbeheer
3. **Systeemupdates**: Eenvoudige opdracht om te updaten naar de nieuwste versie
4. **Gezondheidsmonitoring**: Ingebouwde controles om de systeemintegriteit te garanderen

Deze hulpprogramma's zijn toegankelijk via een eenvoudig interactief menu:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## De open-source-verbintenis {#the-open-source-commitment}

Onze zelfgehoste e-mailoplossing is, net als al onze producten, 100% open source – zowel frontend als backend. Dit betekent:

1. **Volledige transparantie**: Elke regel code die uw e-mails verwerkt, is beschikbaar voor openbare controle.
2. **Bijdragen van de community**: Iedereen kan verbeteringen bijdragen of problemen oplossen.
3. **Beveiliging door openheid**: Kwetsbaarheden kunnen worden geïdentificeerd en opgelost door een wereldwijde community.
4. **Geen vendor lock-in**: U bent nooit afhankelijk van het bestaan van ons bedrijf.

De volledige codebase is beschikbaar op GitHub op <https://github.com/forwardemail/forwardemail.net>.

## Zelfhosting versus beheer: de juiste keuze maken {#self-hosted-vs-managed-making-the-right-choice}

Hoewel we er trots op zijn een zelfgehoste optie aan te bieden, erkennen we dat dit niet voor iedereen de juiste keuze is. Zelfgehoste e-mail brengt echte verantwoordelijkheden en uitdagingen met zich mee:

### De realiteit van zelf-hostende e-mail {#the-reality-of-self-hosting-email}

#### Technische overwegingen {#technical-considerations}

* **Serverbeheer**: U moet een VPS of dedicated server onderhouden
* **DNS-configuratie**: Een correcte DNS-configuratie is cruciaal voor de leverbaarheid
* **Beveiligingsupdates**: Het up-to-date houden van beveiligingspatches is essentieel
* **Spambeheer**: U moet spamfiltering beheren
* **Back-upstrategie**: Het implementeren van betrouwbare back-ups is uw verantwoordelijkheid

#### Tijdsinvestering {#time-investment}

* **Eerste installatie**: Tijd voor installatie, verificatie en het lezen van de documentatie
* **Doorlopend onderhoud**: Incidentele updates en monitoring
* **Probleemoplossing**: Incidentele tijd voor het oplossen van problemen

#### Financiële overwegingen {#financial-considerations}

* **Serverkosten**: $ 5-$ 20/maand voor een basis VPS
* **Domeinregistratie**: $ 10-$ 20/jaar
* **Tijdswaarde**: Uw tijdsinvestering is echt waardevol

### Wanneer kiest u voor onze beheerde service {#when-to-choose-our-managed-service}

Voor veel gebruikers blijft onze beheerde service de beste optie:

1. **Gemak**: Wij verzorgen al het onderhoud, de updates en de monitoring
2. **Betrouwbaarheid**: Profiteer van onze gevestigde infrastructuur en expertise
3. **Ondersteuning**: Krijg hulp bij problemen
4. **Leverbaarheid**: Profiteer van onze gevestigde IP-reputatie
5. **Kosteneffectiviteit**: Wanneer u de tijd en kosten meerekent, is onze service vaak voordeliger

Beide opties bieden dezelfde voordelen op het gebied van privacy en open source-transparantie. Het verschil is alleen wie de infrastructuur beheert.

## Aan de slag met zelfgehoste doorstuur-e-mail {#getting-started-with-self-hosted-forward-email}

Klaar om de controle over uw e-mailinfrastructuur te nemen? Zo gaat u aan de slag:

### Systeemvereisten {#system-requirements}

* Ubuntu 20.04 LTS of nieuwer (aanbevolen)
* Minimaal 1 GB RAM (2 GB+ aanbevolen)
* 20 GB opslagruimte aanbevolen
* Een domeinnaam die u beheert
* Openbaar IP-adres met ondersteuning voor poort 25
* Mogelijkheid om [omgekeerde PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) in te stellen
* Ondersteuning voor IPv4 en IPv6

> \[!TIP]
> We raden verschillende mailserverproviders aan op <https://forwardemail.net/blog/docs/best-mail-server-providers> (bron: <https://github.com/forwardemail/awesome-mail-server-providers>)

### Installatiestappen {#installation-steps}

1. **Voer het installatiescript uit**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Volg de interactieve instructies**:
* Voer uw domeinnaam in
* Configureer de beheerdersreferenties
* Stel DNS-records in zoals aangegeven
* Kies uw gewenste configuratieopties

3. **Installatie verifiëren**:
Nadat de installatie is voltooid, kunt u controleren of alles werkt door:
* De containerstatus te controleren: `docker ps`
* Een testmail te sturen
* In te loggen op de webinterface

## De toekomst van zelfgehoste e-mail {#the-future-of-self-hosted-email}

Onze zelfgehoste oplossing is nog maar het begin. We streven ernaar dit aanbod continu te verbeteren met:

1. **Verbeterde beheertools**: Krachtiger webgebaseerd beheer
2. **Extra authenticatieopties**: Inclusief ondersteuning voor hardwarematige beveiligingssleutels
3. **Geavanceerde monitoring**: Beter inzicht in de systeemstatus en -prestaties
4. **Implementatie voor meerdere servers**: Opties voor configuraties met hoge beschikbaarheid
5. **Communitygedreven verbeteringen**: Integratie met bijdragen van gebruikers

## Conclusie: E-mailvrijheid voor iedereen {#conclusion-email-freedom-for-everyone}

De lancering van onze zelfgehoste e-mailoplossing is een belangrijke mijlpaal in onze missie om privacygerichte, transparante e-maildiensten te bieden. Of u nu kiest voor onze beheerde service of zelfgehoste optie, u profiteert van onze onwrikbare toewijding aan open-sourceprincipes en een privacy-eerst ontwerp.

E-mail is te belangrijk om te worden beheerd door gesloten, bedrijfseigen systemen die gegevensverzameling belangrijker vinden dan de privacy van gebruikers. Met de zelfgehoste oplossing van Forward Email zijn we er trots op een echt alternatief te bieden – een alternatief waarmee u volledige controle hebt over uw digitale communicatie.

Wij geloven dat privacy niet zomaar een eigenschap is, maar een fundamenteel recht. En met onze zelfgehoste e-mailoptie maken we dat recht toegankelijker dan ooit tevoren.

Klaar om de controle over je e-mail te nemen? [Begin vandaag nog](https://forwardemail.net/self-hosted) of ontdek onze [GitHub-repository](https://github.com/forwardemail/forwardemail.net) voor meer informatie.

## Verwijzingen naar {#references}

\[1] E-mail doorsturen GitHub-repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Zelf-gehoste documentatie: <https://forwardemail.net/en/self-hosted>

\[3] Technische implementatie van e-mailprivacy: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Waarom open-source e-mail belangrijk is: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>