# Waarom open-source e-mail de toekomst is: het voordeel van Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Het voordeel van open source: meer dan alleen marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Wat echte open source betekent](#what-true-open-source-means)
  * [Het backend-probleem: waar de meeste open-source e-maildiensten tekortschieten](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [E-mail doorsturen: 100% open source, frontend EN backend](#forward-email-100-open-source-frontend-and-backend)
  * [Onze unieke technische aanpak](#our-unique-technical-approach)
* [De optie voor zelfhosting: keuzevrijheid](#the-self-hosting-option-freedom-of-choice)
  * [Waarom wij zelfhosting ondersteunen](#why-we-support-self-hosting)
  * [De realiteit van zelf-hosting van e-mail](#the-reality-of-self-hosting-email)
* [Waarom onze betaalde service zinvol is (ondanks dat we open source zijn)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Kostenvergelijking](#cost-comparison)
  * [Het beste van twee werelden](#the-best-of-both-worlds)
* [De gesloten-bron-misleiding: wat Proton en Tutanota je niet vertellen](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Open-sourceclaims van Proton Mail](#proton-mails-open-source-claims)
  * [De vergelijkbare aanpak van Tutanota](#tutanotas-similar-approach)
  * [Het debat over privacygidsen](#the-privacy-guides-debate)
* [De toekomst is open source](#the-future-is-open-source)
  * [Waarom open source wint](#why-open-source-is-winning)
* [Overstappen op het doorsturen van e-mail](#making-the-switch-to-forward-email)
* [Conclusie: Open-source e-mail voor een private toekomst](#conclusion-open-source-email-for-a-private-future)

## Voorwoord {#foreword}

In een tijdperk waarin de zorgen over digitale privacy ongekend hoog zijn, zijn de e-maildiensten die we kiezen belangrijker dan ooit. Hoewel veel providers beweren dat ze uw privacy hoog in het vaandel hebben staan, is er een fundamenteel verschil tussen degenen die alleen maar over privacy praten en degenen die het ook echt doen. Bij Forward Email hebben we onze service gebouwd op een fundament van volledige transparantie door middel van open-sourceontwikkeling – niet alleen in onze frontend-applicaties, maar in onze volledige infrastructuur.

In deze blogpost onderzoeken we waarom open-source e-mailoplossingen beter zijn dan closed-source alternatieven, hoe onze aanpak verschilt van concurrenten zoals Proton Mail en Tutanota en waarom onze betaalde service, ondanks onze toewijding aan self-hostingopties, de beste waarde biedt voor de meeste gebruikers.

## Het open-sourcevoordeel: meer dan alleen marketing {#the-open-source-advantage-more-than-just-marketing}

De term "open source" is de afgelopen jaren een populaire marketingbuzzword geworden. De wereldwijde markt voor open source-diensten zal naar verwachting tussen 2024 en 2032 met een samengesteld jaarlijks groeipercentage (CAGR) van ruim 16% groeien. Maar wat betekent echt open source zijn en waarom is het belangrijk voor uw e-mailprivacy?

### Wat echte open source betekent {#what-true-open-source-means}

Open-sourcesoftware maakt de volledige broncode gratis beschikbaar voor iedereen om te inspecteren, aan te passen en te verbeteren. Deze transparantie creëert een omgeving waarin:

* Beveiligingsproblemen kunnen worden geïdentificeerd en verholpen door een wereldwijde community van ontwikkelaars.
* Privacyclaims kunnen worden geverifieerd via onafhankelijke codereview.
* Gebruikers zitten niet vast aan propriëtaire ecosystemen.
* Innovatie verloopt sneller dankzij gezamenlijke verbetering.

Als het gaat om e-mail, de ruggengraat van uw online identiteit, is deze transparantie niet alleen prettig; het is essentieel voor echte privacy en veiligheid.

### Het backend-probleem: waar de meeste "open-source" e-mailservices tekortschieten {#the-backend-problem-where-most-open-source-email-services-fall-short}

Hier wordt het interessant. Veel populaire "privacygerichte" e-mailproviders adverteren zichzelf als open source, maar er is een belangrijk verschil waarvan ze hopen dat je het niet opmerkt: **ze maken alleen hun front-ends open source en houden hun back-ends gesloten**.

Wat betekent dit? De frontend is wat u ziet en waarmee u communiceert: de webinterface of mobiele app. De backend is waar de daadwerkelijke e-mailverwerking plaatsvindt: waar uw berichten worden opgeslagen, versleuteld en verzonden. Wanneer een provider zijn backend closed-source houdt:

1. Je kunt niet verifiëren hoe je e-mails daadwerkelijk worden verwerkt.
2. Je kunt niet bevestigen of hun privacyclaims legitiem zijn.
3. Je vertrouwt op marketingclaims in plaats van op verifieerbare code.
4. Beveiligingsproblemen blijven mogelijk verborgen voor het publiek.

Zoals discussies op de Privacy Guides-forums hebben aangetoond, beweren zowel Proton Mail als Tutanota open source te zijn, maar hun backends blijven gesloten en propriëtair\[^2]. Dit creëert een aanzienlijke vertrouwenskloof: je wordt gevraagd hun privacybeloften te geloven zonder de mogelijkheid om ze te verifiëren.

## E-mail doorsturen: 100% open source, frontend EN backend {#forward-email-100-open-source-frontend-and-backend}

Bij Forward Email hanteren we een fundamenteel andere aanpak. Onze volledige codebase – zowel frontend als backend – is open source en voor iedereen beschikbaar op <https://github.com/forwardemail/forwardemail.net>.

Dit betekent:

1. **Volledige transparantie**: Elke regel code die uw e-mails verwerkt, is beschikbaar voor openbare controle.
2. **Verifieerbare privacy**: Onze privacyclaims zijn geen marketingpraat – het zijn verifieerbare feiten die iedereen kan bevestigen door onze code te bekijken.
3. **Communitygedreven beveiliging**: Onze beveiliging wordt versterkt door de gezamenlijke expertise van de wereldwijde ontwikkelaarscommunity.
4. **Geen verborgen functionaliteit**: Wat u ziet, is wat u krijgt – geen verborgen tracking, geen geheime achterdeurtjes.

### Onze unieke technische aanpak {#our-unique-technical-approach}

Onze toewijding aan privacy gaat verder dan alleen open source. We hebben verschillende technische innovaties geïmplementeerd die ons onderscheiden:

#### Individueel gecodeerde SQLite-mailboxen {#individually-encrypted-sqlite-mailboxes}

In tegenstelling tot traditionele e-mailproviders die gebruikmaken van gedeelde relationele databases (waarbij één enkele inbreuk de gegevens van alle gebruikers openbaar kan maken), gebruiken wij individueel versleutelde SQLite-bestanden voor elke mailbox. Dit betekent:

* Elke mailbox is een apart, versleuteld bestand
* Toegang tot de gegevens van één gebruiker geeft anderen geen toegang
* Zelfs onze eigen medewerkers hebben geen toegang tot uw gegevens – dit is een fundamentele ontwerpbeslissing

Zoals we in de discussies over Privacygidsen hebben uitgelegd:

Gedeelde relationele databases (bijv. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, enz.) vereisen allemaal een login (met gebruikersnaam en wachtwoord) om de databaseverbinding tot stand te brengen. Dit betekent dat iedereen met dit wachtwoord de database op allerlei manieren kan raadplegen. Of het nu gaat om een aanval van een malafide medewerker of een kwaadaardige schoonmaakster. Dit betekent ook dat toegang tot de gegevens van één gebruiker betekent dat je ook toegang hebt tot die van alle anderen. Aan de andere kant kan SQLite worden beschouwd als een gedeelde database, maar de manier waarop we het gebruiken (elke mailbox = individueel SQLite-bestand) maakt het een sandbox.

#### Quantum-resistente encryptie {#quantum-resistant-encryption}

Terwijl andere aanbieders nog bezig zijn met een inhaalslag, hebben wij al kwantumbestendige versleutelingsmethoden geïmplementeerd om uw e-mailprivacy in de toekomst te beschermen tegen de opkomende bedreigingen van quantumcomputing.

#### Geen afhankelijkheden van derden {#no-third-party-dependencies}

In tegenstelling tot concurrenten die afhankelijk zijn van diensten zoals Amazon SES voor e-mailbezorging, hebben wij onze volledige infrastructuur in eigen huis gebouwd. Dit elimineert mogelijke privacylekken via diensten van derden en geeft ons volledige controle over de volledige e-mailpijplijn.

## De zelfhostingoptie: keuzevrijheid {#the-self-hosting-option-freedom-of-choice}

Een van de krachtigste aspecten van opensourcesoftware is de vrijheid die het biedt. Met Forward Email zit u nergens aan vast: u kunt ons volledige platform zelf hosten als u dat wilt.

### Waarom wij zelfhosting ondersteunen {#why-we-support-self-hosting}

Wij geloven erin dat gebruikers volledige controle moeten hebben over hun data. Daarom hebben we ons hele platform zelfhostend gemaakt met uitgebreide documentatie en installatiehandleidingen. Deze aanpak:

* Biedt maximale controle voor technisch onderlegde gebruikers
* Maakt het niet langer nodig om ons als dienstverlener te vertrouwen
* Maakt maatwerk mogelijk om aan specifieke vereisten te voldoen
* Zorgt ervoor dat de service kan worden voortgezet, zelfs als ons bedrijf niet beschikbaar is

### De realiteit van zelf-hostende e-mail {#the-reality-of-self-hosting-email}

Hoewel zelf hosten een krachtige optie is, is het belangrijk om de werkelijke kosten te begrijpen:

#### Financiële kosten {#financial-costs}

* VPS- of serverkosten: $ 5-$ 50/maand voor een basisconfiguratie\[^4]
* Domeinregistratie en -verlenging: $ 10-20/jaar
* SSL-certificaten (hoewel Let's Encrypt gratis opties biedt)
* Mogelijke kosten voor monitoringdiensten en back-upoplossingen

#### Tijdskosten {#time-costs}

* Initiële installatie: Enkele uren tot dagen, afhankelijk van de technische expertise
* Doorlopend onderhoud: 5-10 uur/maand voor updates, beveiligingspatches en probleemoplossing
* Leercurve: Inzicht in e-mailprotocollen, best practices voor beveiliging en serverbeheer

#### Technische uitdagingen {#technical-challenges}

* Problemen met de bezorging van e-mails (berichten die als spam worden gemarkeerd)
* Bijhouden van de evoluerende beveiligingsnormen
* Zorgen voor hoge beschikbaarheid en betrouwbaarheid
* Effectief beheer van spamfilters

Zoals een ervaren self-hoster het verwoordde: "E-mail is een standaarddienst... Het is goedkoper om mijn e-mail te hosten bij \[een provider] dan om geld *en* tijd te besteden aan het zelf hosten ervan."\[^6]

## Waarom onze betaalde service zinvol is (ook al zijn we open source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Gezien de uitdagingen van zelfhosting, biedt onze betaalde service het beste van twee werelden: de transparantie en veiligheid van open source met het gemak en de betrouwbaarheid van een beheerde service.

### Kostenvergelijking {#cost-comparison}

Wanneer u zowel de financiële kosten als de tijdskosten in aanmerking neemt, biedt onze betaalde service een uitzonderlijke waarde:

* **Totale kosten voor zelfhosting**: $ 56-$ 252/maand (inclusief serverkosten en tijdwaardering)
* **Betaalde abonnementen voor doorsturen van e-mail**: $ 3-$ 9/maand

Onze betaalde service biedt:

* Professioneel beheer en onderhoud
* Een gevestigde reputatie op het gebied van IP voor een betere leverbaarheid
* Regelmatige beveiligingsupdates en monitoring
* Ondersteuning bij problemen
* Alle privacyvoordelen van onze open-sourceaanpak

### Het beste van twee werelden {#the-best-of-both-worlds}

Als u kiest voor 'E-mail doorsturen', krijgt u:

1. **Verifieerbare privacy**: Dankzij onze open-source codebase kunt u vertrouwen op onze privacyclaims.
2. **Professioneel beheer**: U hoeft geen expert te worden in e-mailservers.
3. **Kosteneffectiviteit**: Lagere totale kosten dan zelfhosting.
4. **Vrij van lock-in**: De mogelijkheid om zelf te hosten blijft altijd beschikbaar.

## De gesloten-bron-misleiding: wat Proton en Tutanota je niet vertellen {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Laten we eens nader bekijken hoe onze aanpak verschilt van populaire e-mailproviders die zich richten op 'privacy'.

### Open-sourceclaims van Proton Mail {#proton-mails-open-source-claims}

Proton Mail profileert zichzelf als open source, maar dit geldt alleen voor hun frontend-applicaties. Hun backend – waar uw e-mails daadwerkelijk worden verwerkt en opgeslagen – blijft closed-source\[^7]. Dit betekent:

* Je kunt niet verifiëren hoe je e-mails worden verwerkt
* Je moet hun privacyclaims vertrouwen zonder verificatie
* Beveiligingsproblemen in hun backend blijven verborgen voor publieke controle
* Je zit vast in hun ecosysteem zonder zelfhostingopties

### Tutanota's vergelijkbare aanpak {#tutanotas-similar-approach}

Net als Proton Mail maakt Tutanota alleen de frontend open source, terwijl de backend eigendom blijft. Ze kampen met dezelfde vertrouwensproblemen:

* Geen manier om backend-privacyclaims te verifiëren
* Beperkte transparantie over de daadwerkelijke e-mailverwerking
* Mogelijke beveiligingsproblemen zijn niet zichtbaar voor het publiek
* Leveranciersgebondenheid zonder mogelijkheid tot zelfhosting

### Het debat over privacygidsen {#the-privacy-guides-debate}

Deze beperkingen zijn niet onopgemerkt gebleven in de privacygemeenschap. In discussies over privacygidsen hebben we dit cruciale onderscheid benadrukt:

> "Er staat dat zowel Protonmail als Tuta closed source zijn. Omdat hun backend inderdaad closed source is."\[^9]

Wij hebben ook verklaard:

Er zijn geen openbaar gedeelde audits uitgevoerd van de backend-infrastructuren van momenteel vermelde PG-e-maildienstverleners, en er zijn ook geen open source-codefragmenten gedeeld over de manier waarop zij inkomende e-mail verwerken.

Dit gebrek aan transparantie creëert een fundamenteel vertrouwensprobleem. Zonder open-source backends worden gebruikers gedwongen om privacyclaims op goed vertrouwen te geloven in plaats van te verifiëren.

## De toekomst is open source {#the-future-is-open-source}

De trend naar open-sourceoplossingen neemt in de software-industrie toe. Volgens recent onderzoek:

* De markt voor opensourcesoftware groeit van $ 41,83 miljard in 2024 naar $ 48,92 miljard in 2025\[^^11]
* 80% van de bedrijven meldt dat ze het afgelopen jaar meer opensourcesoftware hebben gebruikt\[^^12]
* De verwachting is dat de adoptie van opensourcesoftware snel zal blijven groeien

Deze groei weerspiegelt een fundamentele verschuiving in onze kijk op softwarebeveiliging en privacy. Naarmate gebruikers zich meer bewust worden van hun privacy, zal de vraag naar verifieerbare privacy via open-sourceoplossingen alleen maar toenemen.

### Waarom open source wint {#why-open-source-is-winning}

De voordelen van open source worden steeds duidelijker:

1. **Beveiliging door transparantie**: Open-sourcecode kan worden beoordeeld door duizenden experts, niet alleen door een intern team.
2. **Snellere innovatie**: Gezamenlijke ontwikkeling versnelt verbetering.
3. **Vertrouwen door verificatie**: Claims kunnen worden geverifieerd in plaats van dat ze op goed vertrouwen worden aangenomen.
4. **Vrij van leveranciersbinding**: Gebruikers behouden de controle over hun gegevens en diensten.
5. **Community-ondersteuning**: Een wereldwijde community helpt bij het identificeren en oplossen van problemen.

## De overstap maken naar het doorsturen van e-mail {#making-the-switch-to-forward-email}

Overstappen op Forward Email is eenvoudig, ongeacht of u van een reguliere provider als Gmail komt of van een andere op privacy gerichte service als Proton Mail of Tutanota.

Onze dienstverlening omvat:

* Onbeperkt aantal domeinen en aliassen
* Ondersteuning voor standaardprotocollen (SMTP, IMAP, POP3) zonder eigen bruggen
* Naadloze integratie met bestaande e-mailclients
* Eenvoudig installatieproces met uitgebreide documentatie
* Betaalbare abonnementen vanaf slechts $ 3 per maand

## Conclusie: Open-source e-mail voor een private toekomst {#conclusion-open-source-email-for-a-private-future}

In een wereld waarin digitale privacy steeds meer onder druk staat, biedt de transparantie van open-sourceoplossingen een cruciale bescherming. Bij Forward Email zijn we er trots op dat we vooroplopen met onze volledig open-sourcebenadering van e-mailprivacy.

In tegenstelling tot concurrenten die open source slechts gedeeltelijk omarmen, hebben wij ons volledige platform – frontend en backend – beschikbaar gesteld voor publieke controle. Deze toewijding aan transparantie, gecombineerd met onze innovatieve technische aanpak, biedt een niveau van verifieerbare privacy dat closed-source alternatieven simpelweg niet kunnen evenaren.

Of u nu kiest voor onze beheerde service of ons platform zelf host, u profiteert van de veiligheid, privacy en gemoedsrust die horen bij echt open-source e-mail.

De toekomst van e-mail is open, transparant en gericht op privacy. De toekomst is Forward Email.

\[^1]: SNS Insider. "De markt voor open source-diensten werd in 2023 gewaardeerd op 28,6 miljard dollar en zal in 2032 114,8 miljard dollar bedragen, met een samengesteld jaarlijks groeipercentage (CAGR) van 16,70%." [Rapport over de omvang en analyse van de markt voor open source-diensten 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacygidsen Community. "E-mail doorsturen (e-mailprovider) - Siteontwikkeling / Tool-suggesties." [Discussie over privacygidsen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacygidsen Community. "E-mail doorsturen (e-mailprovider) - Siteontwikkeling / Tool-suggesties." [Discussie over privacygidsen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Over het algemeen kunt u rekenen op een maandelijks budget van $ 5 tot $ 50 voor een eenvoudige Virtual Private Server (VPS) om uw e-mailserver te beheren." [De 10 beste zelfgehoste e-mailserverplatforms voor gebruik in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Het onderhoud kostte me in die periode misschien wel 16 uur..." [Zelfhostende mailserver wordt afgekeurd](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Zoals met alles wat zelf gehost wordt, VEREIST HET JE TIJD. Als je er geen tijd aan kunt besteden, is het altijd beter om bij een gehoste..." [Zelf een e-mailserver hosten? Waarom wel of niet? Wat is populair?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: E-mail doorsturen. "Proton Mail beweert open source te zijn, maar hun back-end is in werkelijkheid closed source." [Tutanota vs Proton Mail Vergelijking (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: E-mail doorsturen. "Tutanota beweert open source te zijn, maar hun back-end is in werkelijkheid closed source." [Proton Mail vs Tutanota vergelijking (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Hierin staat dat zowel Protonmail als Tuta closed source zijn. Omdat hun backend inderdaad closed source is." [E-mail doorsturen (e-mailprovider) - Siteontwikkeling / Suggesties voor hulpmiddelen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Er zijn geen openbaar gedeelde audits uitgevoerd van de backend-infrastructuren van momenteel vermelde PG-e-mailproviders, noch zijn er open source-codefragmenten gedeeld over hoe zij inkomende e-mail verwerken." [E-mail doorsturen (e-mailprovider) - Siteontwikkeling / Suggesties voor hulpmiddelen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "De markt voor opensourcesoftware zal groeien van 41,83 miljard dollar in 2024 naar 48,92 miljard dollar in 2025 met een samengestelde..." [Wat is opensourcesoftware?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Aangezien 80% van de bedrijven meldt dat ze het afgelopen jaar meer opensourcetechnologieën hebben gebruikt, is het..." [Opkomende trends in open source-community's 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)