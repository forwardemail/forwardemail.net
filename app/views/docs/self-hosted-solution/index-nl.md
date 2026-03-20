# Zelfgehoste E-mail: Toewijding aan Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Illustratie van zelfgehoste e-mailoplossing" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Waarom Zelfgehoste E-mail Belangrijk Is](#why-self-hosted-email-matters)
  * [Het Probleem met Traditionele E-maildiensten](#the-problem-with-traditional-email-services)
  * [Het Zelfgehoste Alternatief](#the-self-hosted-alternative)
* [Onze Zelfgehoste Implementatie: Technisch Overzicht](#our-self-hosted-implementation-technical-overview)
  * [Docker-gebaseerde Architectuur voor Eenvoud en Draagbaarheid](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash Script Installatie: Toegankelijkheid Ontmoet Veiligheid](#bash-script-installation-accessibility-meets-security)
  * [Quantum-veilige Encryptie voor Toekomstbestendige Privacy](#quantum-safe-encryption-for-future-proof-privacy)
  * [Geautomatiseerd Onderhoud en Updates](#automated-maintenance-and-updates)
* [De Open-Source Toewijding](#the-open-source-commitment)
* [Zelfgehost vs. Beheerd: De Juiste Keuze Maken](#self-hosted-vs-managed-making-the-right-choice)
  * [De Realiteit van Zelfgehoste E-mail](#the-reality-of-self-hosting-email)
  * [Wanneer Kiezen voor Onze Beheerde Dienst](#when-to-choose-our-managed-service)
* [Aan de Slag met Zelfgehoste Forward Email](#getting-started-with-self-hosted-forward-email)
  * [Systeemvereisten](#system-requirements)
  * [Installatiestappen](#installation-steps)
* [De Toekomst van Zelfgehoste E-mail](#the-future-of-self-hosted-email)
* [Conclusie: E-mailvrijheid voor Iedereen](#conclusion-email-freedom-for-everyone)
* [Referenties](#references)


## Voorwoord {#foreword}

In het digitale landschap van vandaag blijft e-mail de ruggengraat van onze online identiteit en communicatie. Toch staan veel gebruikers, nu privacyzorgen toenemen, voor een lastige keuze: gemak ten koste van privacy, of privacy ten koste van gemak. Bij Forward Email hebben we altijd geloofd dat je niet tussen die twee hoeft te kiezen.

Vandaag zijn we verheugd een belangrijke mijlpaal in onze reis aan te kondigen: de lancering van onze zelfgehoste e-mailoplossing. Deze functie vertegenwoordigt onze diepste toewijding aan open-source principes, privacygerichte ontwerpen en gebruikersmachtiging. Met onze zelfgehoste optie leggen we de volledige kracht en controle over je e-mailcommunicatie rechtstreeks in jouw handen.

Deze blogpost verkent de filosofie achter onze zelfgehoste oplossing, de technische implementatie en waarom het belangrijk is voor gebruikers die zowel privacy als eigenaarschap in hun digitale communicatie waarderen.


## Waarom Zelfgehoste E-mail Belangrijk Is {#why-self-hosted-email-matters}

Onze zelfgehoste e-mailoplossing is de duidelijkste uitdrukking van ons geloof dat echte privacy controle betekent, en controle begint met open source. Voor gebruikers die volledige eigendom over hun digitale communicatie eisen, is zelfhosten niet langer een randidee — het is een fundamenteel recht. We zijn er trots op dat geloof te ondersteunen met een volledig open, verifieerbaar platform dat je op je eigen voorwaarden kunt draaien.

### Het Probleem met Traditionele E-maildiensten {#the-problem-with-traditional-email-services}

Traditionele e-maildiensten brengen verschillende fundamentele uitdagingen met zich mee voor privacybewuste gebruikers:

1. **Vertrouwenseisen**: Je moet de provider vertrouwen dat ze je gegevens niet openen, analyseren of delen
2. **Gecentraliseerde Controle**: Je toegang kan op elk moment om welke reden dan ook worden ingetrokken
3. **Kwetsbaarheid voor Toezicht**: Gecentraliseerde diensten zijn primaire doelwitten voor toezicht
4. **Beperkte Transparantie**: De meeste diensten gebruiken propriëtaire, gesloten software
5. **Vendor Lock-in**: Migreren weg van deze diensten kan moeilijk of onmogelijk zijn

Zelfs "privacygerichte" e-mailproviders schieten vaak tekort door alleen hun frontend-applicaties open source te maken terwijl hun backend-systemen propriëtair en gesloten blijven. Dit creëert een aanzienlijk vertrouwensgat — je wordt gevraagd hun privacybeloften te geloven zonder ze te kunnen verifiëren.

### Het Zelfgehoste Alternatief {#the-self-hosted-alternative}
Zelf je e-mail hosten biedt een fundamenteel andere benadering:

1. **Volledige Controle**: Je bezit en beheert de gehele e-mailinfrastructuur
2. **Verifieerbare Privacy**: Het hele systeem is transparant en controleerbaar
3. **Geen Vertrouwen Nodig**: Je hoeft een derde partij niet te vertrouwen met je communicatie
4. **Vrijheid in Aanpassing**: Pas het systeem aan je specifieke behoeften aan
5. **Veerkracht**: Je service blijft draaien ongeacht beslissingen van bedrijven

Zoals een gebruiker het verwoordde: "Zelf mijn e-mail hosten is het digitale equivalent van mijn eigen voedsel verbouwen—het kost meer werk, maar ik weet precies wat erin zit."


## Onze Zelf-gehoste Implementatie: Technisch Overzicht {#our-self-hosted-implementation-technical-overview}

Onze zelf-gehoste e-mailoplossing is gebouwd op dezelfde privacy-eerst principes die al onze producten leiden. Laten we de technische implementatie verkennen die dit mogelijk maakt.

### Docker-gebaseerde Architectuur voor Eenvoud en Draagbaarheid {#docker-based-architecture-for-simplicity-and-portability}

We hebben onze gehele e-mailinfrastructuur verpakt met Docker, waardoor het eenvoudig te implementeren is op vrijwel elk Linux-systeem. Deze container-gebaseerde aanpak biedt verschillende belangrijke voordelen:

1. **Vereenvoudigde Implementatie**: Eén enkele opdracht zet de hele infrastructuur op
2. **Consistente Omgeving**: Elimineert "werkt op mijn machine" problemen
3. **Geïsoleerde Componenten**: Elke dienst draait in zijn eigen container voor veiligheid
4. **Eenvoudige Updates**: Simpele opdrachten om de hele stack bij te werken
5. **Minimale Afhankelijkheden**: Vereist alleen Docker en Docker Compose

De architectuur bevat containers voor:

* Webinterface voor administratie
* SMTP-server voor uitgaande e-mail
* IMAP/POP3-servers voor e-mail ophalen
* CalDAV-server voor agenda's
* CardDAV-server voor contacten
* Database voor configuratieopslag
* Redis voor caching en prestaties
* SQLite voor veilige, versleutelde mailboxopslag

> \[!NOTE]
> Bekijk zeker onze [zelf-gehoste ontwikkelaarsgids](https://forwardemail.net/self-hosted)

### Bash Script Installatie: Toegankelijkheid Ontmoet Veiligheid {#bash-script-installation-accessibility-meets-security}

We hebben het installatieproces zo eenvoudig mogelijk ontworpen, terwijl we de beste beveiligingspraktijken handhaven:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Deze enkele opdracht:

1. Verifieert systeemeisen
2. Begeleidt je door de configuratie
3. Zet DNS-records op
4. Configureert TLS-certificaten
5. Zet de Docker-containers uit
6. Voert initiële beveiligingsversterking uit

Voor wie zich zorgen maakt over het doorsturen van scripts naar bash (zoals het hoort!), raden we aan het script vooraf te bekijken. Het is volledig open-source en beschikbaar voor inspectie.

### Quantum-veilige Encryptie voor Toekomstbestendige Privacy {#quantum-safe-encryption-for-future-proof-privacy}

Net als onze gehoste dienst implementeert onze zelf-gehoste oplossing quantum-resistente encryptie met ChaCha20-Poly1305 als cipher voor SQLite-databases. Deze aanpak beschermt je e-mailgegevens niet alleen tegen huidige bedreigingen, maar ook tegen toekomstige aanvallen met quantumcomputers.

Elke mailbox wordt opgeslagen in een eigen versleuteld SQLite-databasebestand, wat volledige isolatie tussen gebruikers biedt—een aanzienlijk beveiligingsvoordeel ten opzichte van traditionele gedeelde databasebenaderingen.

### Geautomatiseerd Onderhoud en Updates {#automated-maintenance-and-updates}

We hebben uitgebreide onderhoudsfuncties direct ingebouwd in de zelf-gehoste oplossing:

1. **Automatische Back-ups**: Geplande back-ups van alle kritieke data
2. **Certificaatvernieuwing**: Geautomatiseerd beheer van Let's Encrypt-certificaten
3. **Systeemupdates**: Simpele opdracht om naar de nieuwste versie bij te werken
4. **Gezondheidsmonitoring**: Ingebouwde controles om systeemintegriteit te waarborgen

Deze functies zijn toegankelijk via een eenvoudig interactief menu:

```bash
# script prompt

1. Initiële setup
2. Back-ups instellen
3. Automatische upgrades instellen
4. Certificaten vernieuwen
5. Herstellen vanaf back-up
6. Help
7. Afsluiten
```


## De Open-Source Verbintenis {#the-open-source-commitment}

Onze zelf-gehoste e-mailoplossing, net als al onze producten, is 100% open-source—zowel frontend als backend. Dit betekent:
1. **Volledige Transparantie**: Elke regel code die je e-mails verwerkt is beschikbaar voor publieke controle  
2. **Community Bijdragen**: Iedereen kan verbeteringen aanleveren of problemen oplossen  
3. **Beveiliging Door Openheid**: Kwetsbaarheden kunnen door een wereldwijde community worden geïdentificeerd en opgelost  
4. **Geen Vendor Lock-in**: Je bent nooit afhankelijk van het voortbestaan van ons bedrijf  

De volledige codebase is beschikbaar op GitHub via <https://github.com/forwardemail/forwardemail.net>.


## Zelf-Hosten vs. Beheerd: De Juiste Keuze Maken {#self-hosted-vs-managed-making-the-right-choice}

Hoewel we trots zijn een zelf-hostoptie aan te bieden, erkennen we dat dit niet voor iedereen de juiste keuze is. Zelf e-mail hosten brengt echte verantwoordelijkheden en uitdagingen met zich mee:

### De Realiteit van Zelf E-mail Hosteren {#the-reality-of-self-hosting-email}

#### Technische Overwegingen {#technical-considerations}

* **Serverbeheer**: Je moet een VPS of dedicated server onderhouden  
* **DNS Configuratie**: Juiste DNS-instellingen zijn cruciaal voor afleverbaarheid  
* **Beveiligingsupdates**: Actueel blijven met beveiligingspatches is essentieel  
* **Spambeheer**: Je moet spamfiltering zelf afhandelen  
* **Backup Strategie**: Betrouwbare backups implementeren is jouw verantwoordelijkheid  

#### Tijdsinvestering {#time-investment}

* **Initiële Setup**: Tijd om op te zetten, te verifiëren en documentatie te lezen  
* **Doorlopende Onderhoud**: Af en toe updates en monitoring  
* **Probleemoplossing**: Af en toe tijd voor het oplossen van problemen  

#### Financiële Overwegingen {#financial-considerations}

* **Serverkosten**: $5-$20/maand voor een basis VPS  
* **Domeinregistratie**: $10-$20/jaar  
* **Waarde van Tijd**: Je tijdsinvestering heeft echte waarde  

### Wanneer Kiezen voor Onze Beheerde Dienst {#when-to-choose-our-managed-service}

Voor veel gebruikers blijft onze beheerde dienst de beste optie:

1. **Gemak**: Wij verzorgen alle onderhoud, updates en monitoring  
2. **Betrouwbaarheid**: Profiteer van onze gevestigde infrastructuur en expertise  
3. **Ondersteuning**: Hulp wanneer er problemen zijn  
4. **Afleverbaarheid**: Maak gebruik van onze gevestigde IP-reputatie  
5. **Kostenbesparing**: Wanneer je de tijdskosten meerekent is onze dienst vaak voordeliger  

Beide opties bieden dezelfde privacyvoordelen en open-source transparantie—het verschil is simpelweg wie de infrastructuur beheert.


## Aan de Slag met Zelf-Hosten van Forward Email {#getting-started-with-self-hosted-forward-email}

Klaar om de controle over je e-mailinfrastructuur te nemen? Zo begin je:

### Systeemvereisten {#system-requirements}

* Ubuntu 20.04 LTS of nieuwer (aanbevolen)  
* Minimaal 1GB RAM (2GB+ aanbevolen)  
* 20GB opslag aanbevolen  
* Een domeinnaam die je beheert  
* Publiek IP-adres met poort 25 ondersteuning  
* Mogelijkheid om een [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) in te stellen  
* Ondersteuning voor IPv4 en IPv6  

> \[!TIP]  
> We raden verschillende mailserverproviders aan op <https://forwardemail.net/blog/docs/best-mail-server-providers> (bron op <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Installatiestappen {#installation-steps}

1. **Voer het Installatiescript uit**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Volg de Interactieve Prompts**:  
   * Voer je domeinnaam in  
   * Configureer beheerdersgegevens  
   * Stel DNS-records in zoals aangegeven  
   * Kies je gewenste configuratieopties  

3. **Verifieer de Installatie**:  
   Zodra de installatie voltooid is, kun je controleren of alles werkt door:  
   * De containerstatus te controleren: `docker ps`  
   * Een testmail te versturen  
   * In te loggen op de webinterface  


## De Toekomst van Zelf-Hosten van E-mail {#the-future-of-self-hosted-email}

Onze zelf-hostoplossing is nog maar het begin. We zetten ons in om deze dienst continu te verbeteren met:

1. **Verbeterde Beheertools**: Krachtigere webgebaseerde managementopties  
2. **Extra Authenticatieopties**: Inclusief ondersteuning voor hardware security keys  
3. **Geavanceerde Monitoring**: Betere inzichten in systeemgezondheid en prestaties  
4. **Multi-Server Implementatie**: Opties voor hoog-beschikbare configuraties  
5. **Community-gedreven Verbeteringen**: Integratie van bijdragen van gebruikers
## Conclusie: E-mailvrijheid voor Iedereen {#conclusion-email-freedom-for-everyone}

De lancering van onze zelfgehoste e-mailoplossing vormt een belangrijke mijlpaal in onze missie om privacygerichte, transparante e-mailservices te bieden. Of je nu kiest voor onze beheerde dienst of de zelfgehoste optie, je profiteert van onze niet-aflatende toewijding aan open-source principes en privacy-first ontwerp.

E-mail is te belangrijk om gecontroleerd te worden door gesloten, propriëtaire systemen die dataverzameling boven gebruikersprivacy stellen. Met Forward Email's zelfgehoste oplossing zijn we trots een echt alternatief te bieden—een alternatief dat jou volledige controle geeft over je digitale communicatie.

Wij geloven dat privacy niet zomaar een functie is; het is een fundamenteel recht. En met onze zelfgehoste e-mailoptie maken we dat recht toegankelijker dan ooit tevoren.

Klaar om de controle over je e-mail te nemen? [Begin vandaag nog](https://forwardemail.net/self-hosted) of verken onze [GitHub repository](https://github.com/forwardemail/forwardemail.net) om meer te leren.


## Referenties {#references}

\[1] Forward Email GitHub Repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Zelfgehoste Documentatie: <https://forwardemail.net/en/self-hosted>

\[3] Technische Implementatie van E-mailprivacy: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Waarom Open-Source E-mail Belangrijk Is: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
