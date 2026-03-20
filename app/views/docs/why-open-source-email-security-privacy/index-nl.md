# Waarom Open-Source E-mail de Toekomst is: Het Voordeel van Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Het Open-Source Voordeel: Meer Dan Alleen Marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Wat Echte Open-Source Betekent](#what-true-open-source-means)
  * [Het Backend Probleem: Waar de Meeste "Open-Source" E-maildiensten Tekortschieten](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% Open-Source, Frontend EN Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Onze Unieke Technische Aanpak](#our-unique-technical-approach)
* [De Zelf-Hosting Optie: Vrijheid van Keuze](#the-self-hosting-option-freedom-of-choice)
  * [Waarom Wij Zelf-Hosting Ondersteunen](#why-we-support-self-hosting)
  * [De Realiteit van Zelf-Hosting van E-mail](#the-reality-of-self-hosting-email)
* [Waarom Onze Betaalde Dienst Logisch Is (Ook Al Zijn We Open-Source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Kostenvergelijking](#cost-comparison)
  * [Het Beste van Twee Werelden](#the-best-of-both-worlds)
* [De Closed-Source Misleiding: Wat Proton en Tutanota Je Niet Vertellen](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [De Open-Source Claims van Proton Mail](#proton-mails-open-source-claims)
  * [De Vergelijkbare Aanpak van Tutanota](#tutanotas-similar-approach)
  * [De Discussie Rond Privacygidsen](#the-privacy-guides-debate)
* [De Toekomst is Open-Source](#the-future-is-open-source)
  * [Waarom Open-Source Wint](#why-open-source-is-winning)
* [Overschakelen naar Forward Email](#making-the-switch-to-forward-email)
* [Conclusie: Open-Source E-mail voor een Privé Toekomst](#conclusion-open-source-email-for-a-private-future)


## Voorwoord {#foreword}

In een tijdperk waarin zorgen over digitale privacy groter zijn dan ooit, doet de keuze voor e-maildiensten er meer toe dan ooit. Hoewel veel aanbieders beweren jouw privacy te prioriteren, is er een fundamenteel verschil tussen degenen die alleen over privacy praten en degenen die het echt waarmaken. Bij Forward Email hebben we onze dienst gebouwd op een fundament van volledige transparantie via open-source ontwikkeling—niet alleen in onze frontend applicaties, maar in onze hele infrastructuur.

Deze blogpost onderzoekt waarom open-source e-mailoplossingen superieur zijn aan closed-source alternatieven, hoe onze aanpak verschilt van concurrenten zoals Proton Mail en Tutanota, en waarom—ondanks onze inzet voor zelf-hosting opties—onze betaalde dienst de beste waarde biedt voor de meeste gebruikers.


## Het Open-Source Voordeel: Meer Dan Alleen Marketing {#the-open-source-advantage-more-than-just-marketing}

De term "open-source" is de afgelopen jaren een populair marketingbuzzwoord geworden, waarbij de wereldwijde markt voor open-source diensten naar verwachting zal groeien met een CAGR van meer dan 16% tussen 2024 en 2032\[^1]. Maar wat betekent het echt om open-source te zijn, en waarom is dat belangrijk voor jouw e-mailprivacy?

### Wat Echte Open-Source Betekent {#what-true-open-source-means}

Open-source software maakt de volledige broncode vrij beschikbaar voor iedereen om te inspecteren, aan te passen en te verbeteren. Deze transparantie creëert een omgeving waarin:

* Beveiligingslekken kunnen worden geïdentificeerd en opgelost door een wereldwijde gemeenschap van ontwikkelaars
* Privacyclaims kunnen worden geverifieerd via onafhankelijke codebeoordeling
* Gebruikers niet vastzitten in propriëtaire ecosystemen
* Innovatie sneller plaatsvindt door gezamenlijke verbetering

Als het gaat om e-mail—de ruggengraat van je online identiteit—is deze transparantie niet alleen prettig, maar essentieel voor echte privacy en beveiliging.

### Het Backend Probleem: Waar de Meeste "Open-Source" E-maildiensten Tekortschieten {#the-backend-problem-where-most-open-source-email-services-fall-short}

Hier wordt het interessant. Veel populaire "privacygerichte" e-mailproviders adverteren zichzelf als open-source, maar er is een cruciaal verschil dat ze hopen dat je niet opmerkt: **ze maken alleen hun frontends open-source terwijl ze hun backends gesloten houden**.
Wat betekent dit? De frontend is wat je ziet en waarmee je interactie hebt—de webinterface of mobiele app. De backend is waar de daadwerkelijke e-mailverwerking plaatsvindt—waar je berichten worden opgeslagen, versleuteld en verzonden. Wanneer een provider hun backend gesloten houdt:

1. Je kunt niet verifiëren hoe je e-mails daadwerkelijk worden verwerkt
2. Je kunt niet bevestigen of hun privacyclaims legitiem zijn
3. Je vertrouwt op marketingclaims in plaats van verifieerbare code
4. Beveiligingslekken kunnen verborgen blijven voor publieke controle

Zoals discussies op Privacy Guides-forums hebben benadrukt, beweren zowel Proton Mail als Tutanota open-source te zijn, maar hun backends blijven gesloten en propriëtair\[^2]. Dit creëert een aanzienlijk vertrouwensprobleem—je wordt gevraagd hun privacybeloften te geloven zonder de mogelijkheid ze te verifiëren.


## Forward Email: 100% Open-Source, Frontend EN Backend {#forward-email-100-open-source-frontend-and-backend}

Bij Forward Email hebben we een fundamenteel andere aanpak gekozen. Onze volledige codebase—zowel frontend als backend—is open-source en voor iedereen te inspecteren op <https://github.com/forwardemail/forwardemail.net>.

Dit betekent:

1. **Volledige Transparantie**: Elke regel code die je e-mails verwerkt is beschikbaar voor publieke controle.
2. **Verifieerbare Privacy**: Onze privacyclaims zijn geen marketingpraatjes—het zijn verifieerbare feiten die iedereen kan bevestigen door onze code te bekijken.
3. **Community-gedreven Beveiliging**: Onze beveiliging wordt versterkt door de collectieve expertise van de wereldwijde ontwikkelaarscommunity.
4. **Geen Verborgen Functionaliteit**: Wat je ziet is wat je krijgt—geen verborgen tracking, geen geheime achterdeurtjes.

### Onze Unieke Technische Aanpak {#our-unique-technical-approach}

Onze toewijding aan privacy gaat verder dan alleen open-source zijn. We hebben verschillende technische innovaties geïmplementeerd die ons onderscheiden:

#### Individueel Versleutelde SQLite Mailboxes {#individually-encrypted-sqlite-mailboxes}

In tegenstelling tot traditionele e-mailproviders die gedeelde relationele databases gebruiken (waarbij een enkele inbreuk alle gebruikersdata kan blootstellen), gebruiken wij individueel versleutelde SQLite-bestanden voor elke mailbox. Dit betekent:

* Elke mailbox is een apart versleuteld bestand
* Toegang tot de data van één gebruiker geeft geen toegang tot anderen
* Zelfs onze eigen medewerkers kunnen niet bij je data—het is een kernontwerpbeslissing

Zoals we uitlegden in Privacy Guides-discussies:

> "Gedeelde relationele databases (bijv. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, enz.) vereisen allemaal een login (met gebruikersnaam/wachtwoord) om de databaseverbinding tot stand te brengen. Dit betekent dat iedereen met dit wachtwoord de database voor alles kan bevragen. Of het nu een rogue medewerker of een evil maid-aanval is. Dit betekent ook dat toegang tot de data van één gebruiker betekent dat je ook toegang hebt tot die van iedereen. Aan de andere kant kan SQLite als een gedeelde database worden beschouwd, maar hoe wij het gebruiken (elke mailbox = individueel SQLite-bestand) maakt het sandboxed."\[^3]

#### Kwantumresistente Versleuteling {#quantum-resistant-encryption}

Terwijl andere providers nog bij moeten benen, hebben wij al kwantumresistente versleutelingsmethoden geïmplementeerd om je e-mailprivacy toekomstbestendig te maken tegen opkomende bedreigingen van kwantumcomputers.

#### Geen Derdepartij-afhankelijkheden {#no-third-party-dependencies}

In tegenstelling tot concurrenten die vertrouwen op diensten zoals Amazon SES voor e-mailbezorging, hebben wij onze volledige infrastructuur in eigen beheer gebouwd. Dit elimineert potentiële privacylekken via derden en geeft ons volledige controle over de gehele e-mailpipeline.


## De Zelf-Hosting Optie: Vrijheid van Keuze {#the-self-hosting-option-freedom-of-choice}

Een van de krachtigste aspecten van open-source software is de vrijheid die het biedt. Met Forward Email zit je nooit vast—je kunt ons volledige platform zelf hosten als je dat wilt.

### Waarom Wij Zelf-Hosting Ondersteunen {#why-we-support-self-hosting}

Wij geloven in het geven van volledige controle over data aan gebruikers. Daarom hebben we ons volledige platform zelf-hostbaar gemaakt met uitgebreide documentatie en installatiehandleidingen. Deze aanpak:

* Biedt maximale controle voor technisch onderlegde gebruikers
* Elimineert de noodzaak om ons als dienstverlener te vertrouwen
* Maakt maatwerk mogelijk om aan specifieke eisen te voldoen
* Zorgt ervoor dat de dienst kan blijven bestaan, zelfs als ons bedrijf dat niet doet
### De Realiteit van Zelf-Hosting van E-mail {#the-reality-of-self-hosting-email}

Hoewel zelf-hosting een krachtige optie is, is het belangrijk om de werkelijke kosten te begrijpen:

#### Financiële Kosten {#financial-costs}

* VPS- of serverkosten: $5-$50/maand voor een basisopstelling\[^4]
* Domeinregistratie en verlenging: $10-20/jaar
* SSL-certificaten (hoewel Let's Encrypt gratis opties biedt)
* Potentiële kosten voor monitoringdiensten en back-upoplossingen

#### Tijdskosten {#time-costs}

* Initiële installatie: Enkele uren tot dagen, afhankelijk van technische expertise
* Doorlopend onderhoud: 5-10 uur/maand voor updates, beveiligingspatches en probleemoplossing\[^5]
* Leercurve: Begrip van e-mailprotocollen, beveiligingspraktijken en serverbeheer

#### Technische Uitdagingen {#technical-challenges}

* Problemen met e-mailbezorging (berichten die als spam worden gemarkeerd)
* Bijblijven met veranderende beveiligingsnormen
* Zorgen voor hoge beschikbaarheid en betrouwbaarheid
* Effectief beheren van spamfiltering

Zoals een ervaren zelf-hoster het verwoordde: "E-mail is een commodity service... Het is goedkoper om mijn e-mail bij \[een provider] te hosten dan geld *en* tijd te besteden aan zelf-hosting."\[^6]


## Waarom Onze Betaalde Dienst Logisch Is (Ook Al Zijn We Open-Source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Gezien de uitdagingen van zelf-hosting, biedt onze betaalde dienst het beste van twee werelden: de transparantie en veiligheid van open-source met het gemak en de betrouwbaarheid van een beheerde dienst.

### Kostenvergelijking {#cost-comparison}

Wanneer je zowel financiële als tijdskosten meeneemt, biedt onze betaalde dienst uitzonderlijke waarde:

* **Totale kosten zelf-hosting**: $56-$252/maand (inclusief serverkosten en tijdwaardering)
* **Forward Email betaalde plannen**: $3-$9/maand

Onze betaalde dienst biedt:

* Professioneel beheer en onderhoud
* Een gevestigde IP-reputatie voor betere bezorgbaarheid
* Regelmatige beveiligingsupdates en monitoring
* Ondersteuning bij problemen
* Alle privacyvoordelen van onze open-source aanpak

### Het Beste van Twee Werelden {#the-best-of-both-worlds}

Door te kiezen voor Forward Email krijg je:

1. **Verifieerbare Privacy**: Onze open-source codebase betekent dat je onze privacyclaims kunt vertrouwen
2. **Professioneel Beheer**: Geen noodzaak om een e-mailserver-expert te worden
3. **Kostenbesparing**: Lagere totale kosten dan zelf-hosting
4. **Vrijheid van Lock-in**: De optie om altijd zelf te hosten blijft beschikbaar


## De Closed-Source Misleiding: Wat Proton en Tutanota Je Niet Vertellen {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Laten we eens nader bekijken hoe onze aanpak verschilt van populaire "privacygerichte" e-mailproviders.

### Proton Mail's Open-Source Claims {#proton-mails-open-source-claims}

Proton Mail adverteert als open-source, maar dit geldt alleen voor hun frontend-applicaties. Hun backend—waar je e-mails daadwerkelijk worden verwerkt en opgeslagen—blijft closed-source\[^7]. Dit betekent:

* Je kunt niet verifiëren hoe je e-mails worden behandeld
* Je moet hun privacyclaims vertrouwen zonder verificatie
* Beveiligingslekken in hun backend blijven verborgen voor publieke controle
* Je zit vast in hun ecosysteem zonder opties voor zelf-hosting

### Tutanota's Vergelijkbare Aanpak {#tutanotas-similar-approach}

Net als Proton Mail maakt Tutanota alleen hun frontend open-source en houdt hun backend propriëtair\[^8]. Ze hebben dezelfde vertrouwensproblemen:

* Geen manier om backend privacyclaims te verifiëren
* Beperkte transparantie over daadwerkelijke e-mailverwerking
* Potentiële beveiligingsproblemen verborgen voor het publiek
* Vendor lock-in zonder zelf-hosting optie

### Het Privacy Guides Debat {#the-privacy-guides-debate}

Deze beperkingen zijn niet onopgemerkt gebleven in de privacygemeenschap. In discussies op Privacy Guides benadrukten we dit cruciale onderscheid:

> "Er staat dat zowel Protonmail als Tuta closed source zijn. Omdat hun backend inderdaad closed source is."\[^9]

We stelden ook:

> "Er zijn geen publiekelijk gedeelde audits van enige momenteel vermelde PG e-mailserviceprovider's backend-infrastructuren noch open source codefragmenten gedeeld over hoe zij inkomende e-mail verwerken."\[^10]
Dit gebrek aan transparantie creëert een fundamenteel vertrouwensprobleem. Zonder open-source backends worden gebruikers gedwongen privacyclaims op geloof te accepteren in plaats van te verifiëren.


## De Toekomst is Open-Source {#the-future-is-open-source}

De trend naar open-source oplossingen versnelt in de software-industrie. Volgens recent onderzoek:

* De markt voor open-source software groeit van $41,83 miljard in 2024 naar $48,92 miljard in 2025\[^11]
* 80% van de bedrijven meldt een toegenomen gebruik van open-source het afgelopen jaar\[^12]
* De adoptie van open-source zal naar verwachting zijn snelle groei voortzetten

Deze groei weerspiegelt een fundamentele verschuiving in hoe we denken over softwarebeveiliging en privacy. Naarmate gebruikers zich meer bewust worden van privacy, zal de vraag naar verifieerbare privacy via open-source oplossingen alleen maar toenemen.

### Waarom Open-Source Wint {#why-open-source-is-winning}

De voordelen van open-source worden steeds duidelijker:

1. **Beveiliging door Transparantie**: Open-source code kan door duizenden experts worden beoordeeld, niet alleen door een intern team
2. **Snellere Innovatie**: Samenwerking versnelt verbetering
3. **Vertrouwen door Verificatie**: Claims kunnen worden geverifieerd in plaats van op geloof aangenomen
4. **Vrijheid van Vendor Lock-in**: Gebruikers behouden controle over hun data en diensten
5. **Community Ondersteuning**: Een wereldwijde gemeenschap helpt bij het identificeren en oplossen van problemen


## Overstappen naar Forward Email {#making-the-switch-to-forward-email}

Overstappen naar Forward Email is eenvoudig, of je nu komt van een mainstream provider zoals Gmail of een andere privacygerichte dienst zoals Proton Mail of Tutanota.

Onze dienst biedt:

* Onbeperkte domeinen en aliassen
* Ondersteuning voor standaardprotocollen (SMTP, IMAP, POP3) zonder propriëtaire bruggen
* Naadloze integratie met bestaande e-mailclients
* Eenvoudig installatieproces met uitgebreide documentatie
* Betaalbare prijsplannen vanaf slechts $3/maand


## Conclusie: Open-Source E-mail voor een Privé Toekomst {#conclusion-open-source-email-for-a-private-future}

In een wereld waar digitale privacy steeds meer onder druk staat, biedt de transparantie van open-source oplossingen een cruciale waarborg. Bij Forward Email zijn we trots om voorop te lopen met onze volledig open-source benadering van e-mailprivacy.

In tegenstelling tot concurrenten die open-source slechts gedeeltelijk omarmen, hebben wij ons hele platform—frontend en backend—beschikbaar gesteld voor publieke controle. Deze toewijding aan transparantie, gecombineerd met onze innovatieve technische aanpak, biedt een niveau van verifieerbare privacy dat gesloten alternatieven simpelweg niet kunnen evenaren.

Of je nu kiest voor onze beheerde dienst of ons platform zelf host, je profiteert van de beveiliging, privacy en gemoedsrust die voortkomen uit echt open-source e-mail.

De toekomst van e-mail is open, transparant en privacygericht. De toekomst is Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "TL:DR: Zoals alles wat zelf gehost wordt, ZAL HET JE TIJD KOSTEN. Als je geen tijd hebt om eraan te besteden, is het altijd beter om bij een gehoste oplossing te blijven..." [Zelf een e-mailserver hosten? Waarom wel of niet? Wat is populair?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail beweert open-source te zijn, maar hun back-end is eigenlijk closed source." [Tutanota vs Proton Mail Vergelijking (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota beweert open-source te zijn, maar hun back-end is eigenlijk closed source." [Proton Mail vs Tutanota Vergelijking (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Er staat dat zowel Protonmail als Tuta closed source zijn. Omdat hun backend inderdaad closed source is." [Forward Email (e-mailprovider) - Siteontwikkeling / Tool Suggesties](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Er zijn geen openbaar gedeelde audits van enige momenteel vermelde PG e-mailserviceprovider backend infrastructuren noch open source codefragmenten gedeeld over hoe zij inkomende e-mail verwerken." [Forward Email (e-mailprovider) - Siteontwikkeling / Tool Suggesties](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "De open source softwaremarkt zal groeien van USD 41,83 miljard in 2024 tot USD 48,92 miljard in 2025 met een samengesteld..." [Wat is open source software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Met 80% van de bedrijven die een toegenomen gebruik van open source technologieën rapporteren het afgelopen jaar, is het..." [Opkomende trends in open source gemeenschappen 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
