# Een Decennium van Impact: Hoe Onze npm Pakketten 1 Miljard Downloads Bereikten en JavaScript Vormgaven {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [De Pioniers Die Ons Vertrouwen: Isaac Z. Schlueter en Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Van de Creatie van npm tot Node.js Leiderschap](#from-npms-creation-to-nodejs-leadership)
* [De Architect Achter de Code: Nick Baugh's Reis](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express Technische Commissie en Kernbijdragen](#express-technical-committee-and-core-contributions)
  * [Bijdragen aan het Koa Framework](#koa-framework-contributions)
  * [Van Individuele Bijdrager tot Organisatieleider](#from-individual-contributor-to-organization-leader)
* [Onze GitHub Organisaties: Ecosystemen van Innovatie](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Gestructureerde Logging voor Moderne Applicaties](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Bestrijding van E-mailmisbruik](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderne Taakplanning met Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Open Source E-mailinfrastructuur](#forward-email-open-source-email-infrastructure)
  * [Lad: Essentiële Koa Hulpmiddelen en Tools](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open Source Uptime Monitoring](#upptime-open-source-uptime-monitoring)
* [Onze Bijdragen aan het Forward Email Ecosysteem](#our-contributions-to-the-forward-email-ecosystem)
  * [Van Pakketten tot Productie](#from-packages-to-production)
  * [De Feedbackloop](#the-feedback-loop)
* [De Kernprincipes van Forward Email: Een Fundament voor Uitmuntendheid](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Altijd Ontwikkelaarvriendelijk, Veiligheidsgericht en Transparant](#always-developer-friendly-security-focused-and-transparent)
  * [Naleving van Beproefde Softwareontwikkelingsprincipes](#adherence-to-time-tested-software-development-principles)
  * [Gericht op de Vindingrijke, Zelfstandige Ontwikkelaar](#targeting-the-scrappy-bootstrapped-developer)
  * [Principes in de Praktijk: De Forward Email Codebase](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Duurzame Open Source](#sustainable-open-source)
* [De Cijfers Liegen Niet: Onze Indrukwekkende npm Downloadstatistieken](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Een Overzicht van Onze Impact](#a-birds-eye-view-of-our-impact)
  * [Dagelijkse Impact op Grote Schaal](#daily-impact-at-scale)
  * [Voorbij de Ruwe Cijfers](#beyond-the-raw-numbers)
* [Het Ecosysteem Ondersteunen: Onze Open Source Sponsorships](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionier in E-mailinfrastructuur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Meesterbrein achter Utility Pakketten](#sindre-sorhus-utility-package-mastermind)
* [Het Ontdekken van Beveiligingslekken in het JavaScript Ecosysteem](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [De Koa-Router Redding](#the-koa-router-rescue)
  * [Aanpakken van ReDoS Kwetsbaarheden](#addressing-redos-vulnerabilities)
  * [Pleiten voor Node.js en Chromium Beveiliging](#advocating-for-nodejs-and-chromium-security)
  * [Beveiligen van npm Infrastructuur](#securing-npm-infrastructure)
* [Onze Bijdragen aan het Forward Email Ecosysteem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Verbetering van Nodemailer's Kernfunctionaliteit](#enhancing-nodemailers-core-functionality)
  * [Vooruitgang in E-mail Authenticatie met Mailauth](#advancing-email-authentication-with-mailauth)
  * [Belangrijke Upptime Verbeteringen](#key-upptime-enhancements)
* [De Lijm Die Alles Samenhoudt: Aangepaste Code op Grote Schaal](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Een Enorme Ontwikkelingsinspanning](#a-massive-development-effort)
  * [Integratie van Kernafhankelijkheden](#core-dependencies-integration)
  * [DNS Infrastructuur met Tangerine en mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impact op Ondernemingen: Van Open Source tot Missiekritieke Oplossingen](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Case Studies in Missiekritieke E-mailinfrastructuur](#case-studies-in-mission-critical-email-infrastructure)
* [Een Decennium Open Source: Vooruitkijken](#a-decade-of-open-source-looking-forward)
## Voorwoord {#foreword}

In de wereld van [JavaScript](https://en.wikipedia.org/wiki/JavaScript) en [Node.js](https://en.wikipedia.org/wiki/Node.js) zijn sommige pakketten essentieel—dagelijks miljoenen keren gedownload en drijvende kracht achter apps wereldwijd. Achter deze tools staan ontwikkelaars die zich richten op open source kwaliteit. Vandaag laten we zien hoe ons team helpt bij het bouwen en onderhouden van npm-pakketten die belangrijke onderdelen van het JavaScript-ecosysteem zijn geworden.

## De Pioniers Die Ons Vertrouwen: Isaac Z. Schlueter en Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

We zijn trots om [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) als gebruiker te hebben. Isaac creëerde [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) en hielp mee aan de ontwikkeling van [Node.js](https://en.wikipedia.org/wiki/Node.js). Zijn vertrouwen in Forward Email toont onze focus op kwaliteit en veiligheid. Isaac gebruikt Forward Email voor verschillende domeinen, waaronder izs.me.

Isaac's impact op JavaScript is enorm. In 2009 was hij een van de eersten die het potentieel van Node.js zag, samenwerkend met [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), de maker van het platform. Zoals Isaac zei in een [interview met Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Midden in deze zeer kleine gemeenschap van een groep mensen die probeerden te ontdekken hoe server-side JS mogelijk te maken, kwam Ryan Dahl met Node, wat gewoon duidelijk de juiste aanpak was. Ik zette mijn kaarten daarop en raakte erg betrokken rond het midden van 2009."

> \[!NOTE]
> Voor degenen die geïnteresseerd zijn in de geschiedenis van Node.js, zijn er uitstekende documentaires beschikbaar die de ontwikkeling ervan chronologisch weergeven, waaronder [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) en [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [persoonlijke website](https://tinyclouds.org/) bevat ook waardevolle inzichten in zijn werk.

### Van de Creatie van npm tot Leiderschap bij Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac creëerde npm in september 2009, met de eerste bruikbare versie die begin 2010 werd uitgebracht. Deze pakketbeheerder vervulde een belangrijke behoefte in Node.js, waardoor ontwikkelaars gemakkelijk code konden delen en hergebruiken. Volgens de [Node.js Wikipedia-pagina](https://en.wikipedia.org/wiki/Node.js): "In januari 2010 werd een pakketbeheerder geïntroduceerd voor de Node.js-omgeving genaamd npm. De pakketbeheerder stelt programmeurs in staat om Node.js-pakketten te publiceren en te delen, samen met de bijbehorende broncode, en is ontworpen om de installatie, update en verwijdering van pakketten te vereenvoudigen."

Toen Ryan Dahl zich in januari 2012 terugtrok van Node.js, nam Isaac het projectleiderschap over. Zoals vermeld op [zijn cv](https://izs.me/resume), "Leidde de ontwikkeling van verschillende fundamentele Node.js core API's, waaronder het CommonJS-modulesysteem, filesystem API's en streams" en "Dient als BDFL (Benevolent Dictator For Life) van het project gedurende 2 jaar, waarbij hij zorgde voor steeds hogere kwaliteit en een betrouwbaar buildproces voor Node.js-versies v0.6 tot en met v0.10."

Isaac leidde Node.js door een belangrijke groeiperiode en stelde standaarden vast die het platform tot op heden vormen. Later startte hij in 2014 npm, Inc. om de npm-registry te ondersteunen, die hij daarvoor zelfstandig had beheerd.

We danken Isaac voor zijn enorme bijdragen aan JavaScript en blijven veel pakketten gebruiken die hij heeft gemaakt. Zijn werk heeft veranderd hoe we software bouwen en hoe miljoenen ontwikkelaars wereldwijd code delen.

## De Architect Achter de Code: Nick Baugh's Reis {#the-architect-behind-the-code-nick-baughs-journey}

In het hart van ons open source succes staat Nick Baugh, oprichter en eigenaar van Forward Email. Zijn werk in JavaScript beslaat bijna 20 jaar en heeft de manier waarop talloze ontwikkelaars apps bouwen gevormd. Zijn open source reis toont zowel technische vaardigheid als leiderschap binnen de gemeenschap.

### Express Technical Committee en Core Bijdragen {#express-technical-committee-and-core-contributions}

Nick's expertise in webframeworks leverde hem een plek op in het [Express Technical Committee](https://expressjs.com/en/resources/community.html), waar hij hielp met een van de meest gebruikte Node.js-frameworks. Nick staat nu vermeld als inactief lid op de [Express community pagina](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express is oorspronkelijk gemaakt door TJ Holowaychuk, een productieve open source bijdrager die veel van het Node.js-ecosysteem heeft gevormd. We zijn dankbaar voor TJ's fundamentele werk en respecteren zijn [beslissing om een pauze te nemen](https://news.ycombinator.com/item?id=37687017) van zijn uitgebreide open source bijdragen.

Als lid van de [Express Technical Committee](https://expressjs.com/en/resources/community.html) toonde Nick grote aandacht voor detail bij kwesties zoals het verduidelijken van de `req.originalUrl` documentatie en het oplossen van problemen met multipart form handling.

### Koa Framework Bijdragen {#koa-framework-contributions}

Nick's werk met het [Koa framework](https://github.com/koajs/koa)—een modernere, lichtere alternatief voor Express, ook gemaakt door TJ Holowaychuk—laat zijn inzet voor betere webontwikkelingshulpmiddelen zien. Zijn Koa-bijdragen omvatten zowel issues als code via pull requests, waarbij hij zich richt op foutafhandeling, content type beheer en documentatieverbeteringen.

Zijn werk bij zowel Express als Koa geeft hem een uniek inzicht in Node.js webontwikkeling, wat ons team helpt pakketten te maken die goed werken met meerdere framework-ecosystemen.

### Van Individuele Bijdrager tot Organisatieleider {#from-individual-contributor-to-organization-leader}

Wat begon als het helpen van bestaande projecten groeide uit tot het creëren en onderhouden van hele pakket-ecosystemen. Nick richtte meerdere GitHub-organisaties op—waaronder [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), en [Bree](https://github.com/breejs)—die elk specifieke behoeften in de JavaScript-gemeenschap oplossen.

Deze verschuiving van bijdrager naar leider toont Nick's visie voor goed ontworpen software die echte problemen oplost. Door gerelateerde pakketten te organiseren onder gerichte GitHub-organisaties, heeft hij tool-ecosystemen gebouwd die samenwerken terwijl ze modulair en flexibel blijven voor de bredere ontwikkelaarsgemeenschap.


## Onze GitHub Organisaties: Ecosystemen van Innovatie {#our-github-organizations-ecosystems-of-innovation}

We organiseren ons open source werk rond gerichte GitHub-organisaties, die elk specifieke behoeften in JavaScript oplossen. Deze structuur creëert samenhangende pakketfamilies die goed samenwerken terwijl ze modulair blijven.

### Cabin: Gestructureerde Logging voor Moderne Applicaties {#cabin-structured-logging-for-modern-applications}

De [Cabin organisatie](https://github.com/cabinjs) is onze visie op eenvoudige, krachtige app-logging. Het hoofd-`cabin` pakket [`cabin`](https://github.com/cabinjs/cabin) heeft bijna 900 GitHub-sterren en meer dan 100.000 wekelijkse downloads\[^1]. Cabin biedt gestructureerde logging die werkt met populaire diensten zoals Sentry, LogDNA en Papertrail.

Wat Cabin speciaal maakt is de doordachte API en het plugin-systeem. Ondersteunende pakketten zoals [`axe`](https://github.com/cabinjs/axe) voor Express middleware en [`parse-request`](https://github.com/cabinjs/parse-request) voor HTTP request parsing tonen onze inzet voor complete oplossingen in plaats van geïsoleerde tools.

Het pakket [`bson-objectid`](https://github.com/cabinjs/bson-objectid) verdient een speciale vermelding, met meer dan 1,7 miljoen downloads in slechts twee maanden\[^2]. Deze lichte MongoDB ObjectID-implementatie is de standaard geworden voor ontwikkelaars die ID's nodig hebben zonder volledige MongoDB-afhankelijkheden.

### Spam Scanner: Bestrijding van E-mailmisbruik {#spam-scanner-fighting-email-abuse}

De [Spam Scanner organisatie](https://github.com/spamscanner) toont onze inzet om echte problemen op te lossen. Het hoofd-`spamscanner` pakket [`spamscanner`](https://github.com/spamscanner/spamscanner) biedt geavanceerde e-mail spamdetectie, maar het pakket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) heeft een geweldige adoptie gezien.

Met meer dan 1,2 miljoen downloads in twee maanden\[^3], lost `url-regex-safe` kritieke beveiligingsproblemen op in andere reguliere expressies voor URL-detectie. Dit pakket toont onze aanpak van open source: een veelvoorkomend probleem vinden (in dit geval [ReDoS](https://en.wikipedia.org/wiki/ReDoS) kwetsbaarheden in URL-validatie), een solide oplossing creëren en deze zorgvuldig onderhouden.
### Bree: Moderne Taakplanning met Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

De [Bree organisatie](https://github.com/breejs) is ons antwoord op een veelvoorkomend Node.js probleem: betrouwbare taakplanning. Het hoofdpackage [`bree`](https://github.com/breejs/bree), met meer dan 3.100 GitHub-sterren, biedt een moderne taakplanner die gebruikmaakt van Node.js worker threads voor betere prestaties en betrouwbaarheid.

> \[!NOTE]
> Bree is gemaakt nadat we hebben geholpen met het onderhouden van [Agenda](https://github.com/agenda/agenda), waarbij we geleerde lessen toepasten om een betere taakplanner te bouwen. Onze bijdragen aan Agenda hielpen ons manieren te vinden om taakplanning te verbeteren.

Wat Bree anders maakt dan andere planners zoals Agenda:

* **Geen Externe Afhankelijkheden**: In tegenstelling tot Agenda, dat MongoDB nodig heeft, vereist Bree geen Redis of MongoDB om de taakstatus te beheren.
* **Worker Threads**: Bree gebruikt Node.js worker threads voor gesandboxte processen, wat betere isolatie en prestaties biedt.
* **Eenvoudige API**: Bree biedt gedetailleerde controle met eenvoud, waardoor het makkelijker wordt om complexe planningsbehoeften te implementeren.
* **Ingebouwde Ondersteuning**: Zaken zoals soepel herladen, cron-taken, datums en mensvriendelijke tijden zijn standaard inbegrepen.

Bree is een belangrijk onderdeel van [forwardemail.net](https://github.com/forwardemail/forwardemail.net) en verzorgt kritieke achtergrondtaken zoals e-mailverwerking, opruiming en geplande onderhoudswerkzaamheden. Het gebruik van Bree in Forward Email toont onze inzet om onze eigen tools in productie te gebruiken, zodat ze voldoen aan hoge betrouwbaarheidsnormen.

We gebruiken en waarderen ook andere geweldige worker thread pakketten zoals [piscina](https://github.com/piscinajs/piscina) en HTTP-clients zoals [undici](https://github.com/nodejs/undici). Piscina gebruikt, net als Bree, Node.js worker threads voor efficiënte taakverwerking. We danken [Matteo Collina](https://github.com/mcollina), die zowel undici als piscina onderhoudt, voor zijn grote bijdragen aan Node.js. Matteo zit in het Node.js Technical Steering Committee en heeft de HTTP-clientmogelijkheden in Node.js sterk verbeterd.

### Forward Email: Open Source E-mailinfrastructuur {#forward-email-open-source-email-infrastructure}

Ons meest ambitieuze project is [Forward Email](https://github.com/forwardemail), een open source e-maildienst die e-maildoorsturing, opslag en API-diensten biedt. De hoofdrepository heeft meer dan 1.100 GitHub-sterren\[^4], wat de waardering van de gemeenschap voor dit alternatief voor propriëtaire e-maildiensten laat zien.

Het [`preview-email`](https://github.com/forwardemail/preview-email) pakket van deze organisatie, met meer dan 2,5 miljoen downloads in twee maanden\[^5], is een essentieel hulpmiddel geworden voor ontwikkelaars die met e-mailsjablonen werken. Door een eenvoudige manier te bieden om e-mails tijdens de ontwikkeling te bekijken, lost het een veelvoorkomend pijnpunt op bij het bouwen van e-mailgestuurde applicaties.

### Lad: Essentiële Koa Hulpmiddelen en Tools {#lad-essential-koa-utilities-and-tools}

De [Lad organisatie](https://github.com/ladjs) biedt een verzameling essentiële hulpmiddelen en tools die zich voornamelijk richten op het verbeteren van het Koa-framework ecosysteem. Deze pakketten lossen veelvoorkomende uitdagingen in webontwikkeling op en zijn ontworpen om naadloos samen te werken terwijl ze onafhankelijk nuttig blijven.

#### koa-better-error-handler: Verbeterde Foutafhandeling voor Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) biedt een betere foutafhandelingsoplossing voor Koa-applicaties. Met meer dan 50 GitHub-sterren zorgt dit pakket ervoor dat `ctx.throw` gebruiksvriendelijke foutmeldingen produceert en tegelijkertijd verschillende beperkingen van Koa's ingebouwde foutafhandelaar aanpakt:

* Detecteert en behandelt correct Node.js DNS-fouten, Mongoose-fouten en Redis-fouten
* Gebruikt [Boom](https://github.com/hapijs/boom) voor het creëren van consistente, goed geformatteerde foutreacties
* Behoudt headers (in tegenstelling tot Koa's ingebouwde handler)
* Handhaaft passende statuscodes in plaats van standaard 500 te gebruiken
* Ondersteunt flash-berichten en sessiebehoud
* Biedt HTML-foutlijsten voor validatiefouten
* Ondersteunt meerdere responstypen (HTML, JSON en platte tekst)
Dit pakket is bijzonder waardevol in combinatie met [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) voor uitgebreide foutafhandeling in Koa-applicaties.

#### passport: Authenticatie voor Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) breidt de populaire Passport.js authenticatie-middleware uit met specifieke verbeteringen voor moderne webapplicaties. Dit pakket ondersteunt meerdere authenticatiestrategieën direct uit de doos:

* Lokale authenticatie met e-mail
* Aanmelden met Apple
* GitHub-authenticatie
* Google-authenticatie
* Eenmalige wachtwoord (OTP) authenticatie

Het pakket is zeer aanpasbaar, waardoor ontwikkelaars veldnamen en zinnen kunnen afstemmen op de eisen van hun applicatie. Het is ontworpen om naadloos te integreren met Mongoose voor gebruikersbeheer, waardoor het een ideale oplossing is voor Koa-gebaseerde applicaties die robuuste authenticatie nodig hebben.

#### graceful: Elegante applicatie-afsluiting {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) lost de kritieke uitdaging op van het netjes afsluiten van Node.js-applicaties. Met meer dan 70 GitHub-sterren zorgt dit pakket ervoor dat je applicatie schoon kan afsluiten zonder gegevensverlies of openstaande verbindingen. Belangrijke kenmerken zijn:

* Ondersteuning voor het netjes afsluiten van HTTP-servers (Express/Koa/Fastify)
* Schoon afsluiten van databaseverbindingen (MongoDB/Mongoose)
* Correct afsluiten van Redis-clients
* Afhandeling van Bree job schedulers
* Ondersteuning voor aangepaste afsluithandlers
* Configureerbare time-out instellingen
* Integratie met loggingsystemen

Dit pakket is essentieel voor productieapplicaties waarbij onverwachte afsluitingen kunnen leiden tot gegevensverlies of corruptie. Door juiste afsluitprocedures te implementeren helpt `@ladjs/graceful` de betrouwbaarheid en stabiliteit van je applicatie te waarborgen.

### Upptime: Open Source Uptime Monitoring {#upptime-open-source-uptime-monitoring}

De [Upptime organisatie](https://github.com/upptime) vertegenwoordigt onze inzet voor transparante, open source monitoring. De hoofdrepository [`upptime`](https://github.com/upptime/upptime) heeft meer dan 13.000 GitHub-sterren, waarmee het een van de populairste projecten is waaraan wij bijdragen. Upptime biedt een door GitHub aangedreven uptime-monitor en statuspagina die volledig zonder server werkt.

Wij gebruiken Upptime voor onze eigen statuspagina op <https://status.forwardemail.net> met de broncode beschikbaar op <https://github.com/forwardemail/status.forwardemail.net>.

Wat Upptime bijzonder maakt is de architectuur:

* **100% Open Source**: Elk onderdeel is volledig open source en aanpasbaar.
* **Aangedreven door GitHub**: Maakt gebruik van GitHub Actions, Issues en Pages voor een serverloze monitoroplossing.
* **Geen server nodig**: In tegenstelling tot traditionele monitoringtools vereist Upptime geen eigen serverbeheer.
* **Automatische statuspagina**: Genereert een mooie statuspagina die gehost kan worden op GitHub Pages.
* **Krachtige notificaties**: Integreert met diverse notificatiekanalen zoals e-mail, SMS en Slack.

Om de gebruikerservaring te verbeteren, hebben we [@octokit/core](https://github.com/octokit/core.js/) geïntegreerd in de forwardemail.net codebase om realtime statusupdates en incidenten direct op onze website weer te geven. Deze integratie biedt duidelijke transparantie aan onze gebruikers bij eventuele problemen in onze volledige stack (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, enz.) met directe toastmeldingen, badge-icoonwijzigingen, waarschuwingskleuren en meer.

De @octokit/core bibliotheek stelt ons in staat realtime data op te halen uit onze Upptime GitHub-repository, deze te verwerken en op een gebruiksvriendelijke manier weer te geven. Wanneer een dienst een storing of verminderde prestaties heeft, worden gebruikers onmiddellijk via visuele indicatoren geïnformeerd zonder de hoofdapplicatie te hoeven verlaten. Deze naadloze integratie zorgt ervoor dat onze gebruikers altijd up-to-date informatie hebben over onze systeemstatus, wat transparantie en vertrouwen vergroot.

Upptime is door honderden organisaties overgenomen die op zoek zijn naar een transparante, betrouwbare manier om hun diensten te monitoren en status aan gebruikers te communiceren. Het succes van het project toont de kracht van het bouwen van tools die bestaande infrastructuur (in dit geval GitHub) benutten om veelvoorkomende problemen op nieuwe manieren op te lossen.
## Onze Bijdragen aan het Forward Email Ecosysteem {#our-contributions-to-the-forward-email-ecosystem}

Hoewel onze open source pakketten wereldwijd door ontwikkelaars worden gebruikt, vormen ze ook de basis van onze eigen Forward Email-service. Deze dubbele rol—zowel als makers als gebruikers van deze tools—geeft ons een uniek perspectief op hun toepassing in de praktijk en stimuleert voortdurende verbetering.

### Van Pakketten naar Productie {#from-packages-to-production}

De reis van individuele pakketten naar een samenhangend productiesysteem vereist zorgvuldige integratie en uitbreiding. Voor Forward Email omvat dit proces:

* **Aangepaste Extensies**: Het bouwen van Forward Email-specifieke extensies voor onze open source pakketten die aan onze unieke eisen voldoen.
* **Integratiepatronen**: Het ontwikkelen van patronen voor hoe deze pakketten in een productieomgeving met elkaar samenwerken.
* **Prestatieoptimalisaties**: Het identificeren en aanpakken van prestatieknelpunten die alleen op schaal zichtbaar worden.
* **Beveiligingsversterking**: Het toevoegen van extra beveiligingslagen specifiek voor e-mailverwerking en bescherming van gebruikersgegevens.

Dit werk vertegenwoordigt duizenden uren ontwikkeling bovenop de kernpakketten zelf, resulterend in een robuuste, veilige e-mailservice die het beste van onze open source bijdragen benut.

### De Feedbacklus {#the-feedback-loop}

Misschien wel het meest waardevolle aspect van het gebruik van onze eigen pakketten in productie is de feedbacklus die het creëert. Wanneer we beperkingen of randgevallen tegenkomen in Forward Email, patchen we deze niet alleen lokaal—we verbeteren de onderliggende pakketten, wat zowel onze service als de bredere gemeenschap ten goede komt.

Deze aanpak heeft geleid tot talrijke verbeteringen:

* **Bree's Gracieus Afsluiten**: De behoefte van Forward Email aan zero-downtime deployments leidde tot verbeterde mogelijkheden voor gracieus afsluiten in Bree.
* **Spam Scanner's Patroonherkenning**: In de praktijk tegengekomen spam patronen in Forward Email hebben de detectie-algoritmes van Spam Scanner geïnformeerd.
* **Cabin's Prestatieoptimalisaties**: Hoge volumes logging in productie onthulden optimalisatiemogelijkheden in Cabin die alle gebruikers ten goede komen.

Door deze deugdzame cyclus tussen ons open source werk en de productieservice te onderhouden, zorgen we ervoor dat onze pakketten praktische, beproefde oplossingen blijven in plaats van theoretische implementaties.


## De Kernprincipes van Forward Email: Een Fundament voor Uitmuntendheid {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email is ontworpen volgens een reeks kernprincipes die al onze ontwikkelingsbeslissingen sturen. Deze principes, gedetailleerd op onze [website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), zorgen ervoor dat onze service ontwikkelaarsvriendelijk, veilig en gericht op gebruikersprivacy blijft.

### Altijd Ontwikkelaarsvriendelijk, Veiligheidsgericht en Transparant {#always-developer-friendly-security-focused-and-transparent}

Ons eerste en belangrijkste principe is het creëren van software die ontwikkelaarsvriendelijk is, terwijl de hoogste normen voor veiligheid en privacy worden gehandhaafd. Wij geloven dat technische uitmuntendheid nooit ten koste mag gaan van gebruiksvriendelijkheid, en dat transparantie vertrouwen opbouwt binnen onze gemeenschap.

Dit principe komt tot uiting in onze gedetailleerde documentatie, duidelijke foutmeldingen en open communicatie over zowel successen als uitdagingen. Door onze volledige codebase open source te maken, nodigen we uit tot controle en samenwerking, wat zowel onze software als het bredere ecosysteem versterkt.

### Naleving van Bewezen Softwareontwikkelingsprincipes {#adherence-to-time-tested-software-development-principles}

We volgen verschillende gevestigde softwareontwikkelingsprincipes die hun waarde al decennia hebben bewezen:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Scheiding van verantwoordelijkheden via het Model-View-Controller patroon
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: Het creëren van modulaire componenten die één ding goed doen
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Hou het simpel en overzichtelijk
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Herhaal jezelf niet, bevordert hergebruik van code
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Je gaat het niet nodig hebben, voorkomt voortijdige optimalisatie
* **[Twelve Factor](https://12factor.net/)**: Volgen van best practices voor het bouwen van moderne, schaalbare applicaties
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Kiezen voor de eenvoudigste oplossing die aan de eisen voldoet
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Onze eigen producten uitgebreid gebruiken
Deze principes zijn niet alleen theoretische concepten—ze zijn ingebed in onze dagelijkse ontwikkelpraktijken. Bijvoorbeeld, onze naleving van de Unix-filosofie is duidelijk zichtbaar in hoe we onze npm-pakketten hebben gestructureerd: kleine, gerichte modules die samen kunnen worden samengesteld om complexe problemen op te lossen.

### Gericht op de Scrappy, Bootstrapped Ontwikkelaar {#targeting-the-scrappy-bootstrapped-developer}

We richten ons specifiek op de scrappy, bootstrapped en [ramen-winstgevende](https://www.paulgraham.com/ramenprofitable.html) ontwikkelaar. Deze focus bepaalt alles, van ons prijsmodel tot onze technische beslissingen. We begrijpen de uitdagingen van het bouwen van producten met beperkte middelen omdat we het zelf hebben meegemaakt.

Dit principe is vooral belangrijk in onze benadering van open source. We creëren en onderhouden pakketten die echte problemen oplossen voor ontwikkelaars zonder enterprise-budgetten, waardoor krachtige tools voor iedereen toegankelijk zijn, ongeacht hun middelen.

### Principes in de Praktijk: De Forward Email Codebase {#principles-in-practice-the-forward-email-codebase}

Deze principes zijn duidelijk zichtbaar in de Forward Email codebase. Ons package.json-bestand onthult een doordachte selectie van afhankelijkheden, elk gekozen om aan te sluiten bij onze kernwaarden:

* Beveiligingsgerichte pakketten zoals `mailauth` voor e-mailauthenticatie
* Ontwikkelaarvriendelijke tools zoals `preview-email` voor eenvoudiger debuggen
* Modulaire componenten zoals de verschillende `p-*` utilities van Sindre Sorhus

Door deze principes consequent in de loop van de tijd te volgen, hebben we een dienst gebouwd die ontwikkelaars kunnen vertrouwen met hun e-mailinfrastructuur—veilig, betrouwbaar en in lijn met de waarden van de open source gemeenschap.

### Privacy by Design {#privacy-by-design}

Privacy is geen bijzaak of marketingfeature voor Forward Email—het is een fundamenteel ontwerpprincipe dat elk aspect van onze dienst en code bepaalt:

* **Zero-Access Encryptie**: We hebben systemen geïmplementeerd die het technisch onmogelijk maken voor ons om de e-mails van gebruikers te lezen.
* **Minimale Gegevensverzameling**: We verzamelen alleen de gegevens die nodig zijn om onze dienst te leveren, niet meer.
* **Transparante Beleidsregels**: Ons privacybeleid is geschreven in duidelijke, begrijpelijke taal zonder juridisch jargon.
* **Open Source Verificatie**: Onze open source codebase stelt beveiligingsonderzoekers in staat onze privacyclaims te verifiëren.

Deze toewijding strekt zich uit tot onze open source pakketten, die vanaf de basis zijn ontworpen met beveiliging en privacy best practices.

### Duurzame Open Source {#sustainable-open-source}

Wij geloven dat open source software duurzame modellen nodig heeft om op lange termijn te floreren. Onze aanpak omvat:

* **Commerciële Ondersteuning**: Het aanbieden van premium ondersteuning en diensten rond onze open source tools.
* **Gebalanceerde Licenties**: Gebruik van licenties die zowel gebruikersvrijheden als projectduurzaamheid beschermen.
* **Community Betrokkenheid**: Actief samenwerken met bijdragers om een ondersteunende gemeenschap op te bouwen.
* **Transparante Roadmaps**: Het delen van onze ontwikkelingsplannen zodat gebruikers hierop kunnen anticiperen.

Door te focussen op duurzaamheid zorgen we ervoor dat onze open source bijdragen kunnen blijven groeien en verbeteren in plaats van te vervallen in verwaarlozing.

## De Cijfers Liegen Niet: Onze Indrukwekkende npm Downloadstatistieken {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Wanneer we het hebben over de impact van open source software, bieden downloadstatistieken een tastbare maatstaf voor adoptie en vertrouwen. Veel van de pakketten die we helpen onderhouden hebben een schaal bereikt die weinig open source projecten ooit bereiken, met gecombineerde downloads in de miljarden.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Hoewel we er trots op zijn dat we verschillende zeer gedownloade pakketten in het JavaScript-ecosysteem helpen onderhouden, willen we erkennen dat veel van deze pakketten oorspronkelijk zijn gemaakt door andere getalenteerde ontwikkelaars. Pakketten zoals superagent en supertest zijn oorspronkelijk gemaakt door TJ Holowaychuk, wiens productieve bijdragen aan open source instrumenteel zijn geweest in het vormgeven van het Node.js-ecosysteem.
### Een Overzicht van Onze Impact {#a-birds-eye-view-of-our-impact}

In slechts de periode van twee maanden, van februari tot maart 2025, registreerden de belangrijkste pakketten waaraan we bijdragen en die we helpen onderhouden verbluffende downloadcijfers:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 downloads\[^7] (oorspronkelijk gemaakt door TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 downloads\[^8] (oorspronkelijk gemaakt door TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28.539.295 downloads\[^34] (oorspronkelijk gemaakt door TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 downloads\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 downloads\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 downloads\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1.800.000 downloads\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 downloads\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1.128.139 downloads\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1.124.686 downloads\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 downloads\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 downloads\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839.585 downloads\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145.000 downloads\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24.270 downloads\[^30]

> \[!NOTE]
> Verschillende andere pakketten die we helpen onderhouden maar niet hebben gemaakt, hebben zelfs nog hogere downloadaantallen, waaronder `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads) en `error-stack-parser` (113M+ downloads). We zijn vereerd om bij te dragen aan deze pakketten en tegelijkertijd het werk van hun oorspronkelijke auteurs te respecteren.

Dit zijn niet alleen indrukwekkende cijfers—ze vertegenwoordigen echte ontwikkelaars die echte problemen oplossen met code die wij helpen onderhouden. Elke download is een moment waarop deze pakketten iemand hebben geholpen iets betekenisvols te bouwen, van hobbyprojecten tot bedrijfsapplicaties die door miljoenen worden gebruikt.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Dagelijkse Impact op Grote Schaal {#daily-impact-at-scale}

De dagelijkse downloadpatronen tonen consistent gebruik met een hoog volume, met pieken die miljoenen downloads per dag bereiken\[^13]. Deze consistentie getuigt van de stabiliteit en betrouwbaarheid van deze pakketten—ontwikkelaars proberen ze niet alleen uit; ze integreren ze in hun kernwerkstromen en vertrouwen er dag na dag op.

Wekelijkse downloadpatronen laten nog indrukwekkendere cijfers zien, die consequent rond de tientallen miljoenen downloads per week schommelen\[^14]. Dit vertegenwoordigt een enorme voetafdruk in het JavaScript-ecosysteem, waarbij deze pakketten in productieomgevingen over de hele wereld draaien.

### Verder dan de Ruwe Cijfers {#beyond-the-raw-numbers}

Hoewel de downloadstatistieken op zichzelf indrukwekkend zijn, vertellen ze een diepgaander verhaal over het vertrouwen dat de gemeenschap in deze pakketten stelt. Het onderhouden van pakketten op deze schaal vereist een onwankelbare toewijding aan:

* **Achterwaartse Compatibiliteit**: Wijzigingen moeten zorgvuldig worden overwogen om te voorkomen dat bestaande implementaties breken.
* **Beveiliging**: Met miljoenen applicaties die afhankelijk zijn van deze pakketten, kunnen beveiligingslekken verstrekkende gevolgen hebben.
* **Prestaties**: Op deze schaal kunnen zelfs kleine prestatieverbeteringen aanzienlijke cumulatieve voordelen opleveren.
* **Documentatie**: Duidelijke, uitgebreide documentatie is essentieel voor pakketten die door ontwikkelaars van alle ervaringsniveaus worden gebruikt.

De consistente groei in downloadaantallen in de loop van de tijd weerspiegelt het succes in het nakomen van deze verplichtingen, en het opbouwen van vertrouwen bij de ontwikkelaarsgemeenschap door middel van betrouwbare, goed onderhouden pakketten.
## Het Ecosysteem Ondersteunen: Onze Open Source Sponsoring {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Duurzaamheid van open source gaat niet alleen over het bijdragen van code—het gaat ook over het ondersteunen van de ontwikkelaars die kritieke infrastructuur onderhouden.

Naast onze directe bijdragen aan het JavaScript-ecosysteem, zijn we trots om prominente Node.js-bijdragers te sponsoren wiens werk de basis vormt van veel moderne applicaties. Onze sponsoring omvat:

### Andris Reinman: Pionier in E-mailinfrastructuur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) is de maker van [Nodemailer](https://github.com/nodemailer/nodemailer), de populairste bibliotheek voor het verzenden van e-mail in Node.js met meer dan 14 miljoen wekelijkse downloads\[^15]. Zijn werk strekt zich uit tot andere kritieke e-mailinfrastructuurcomponenten zoals [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), en [WildDuck](https://github.com/nodemailer/wildduck).

Onze sponsoring helpt de voortdurende onderhoud en ontwikkeling van deze essentiële tools te waarborgen die e-mailcommunicatie mogelijk maken voor talloze Node.js-applicaties, inclusief onze eigen Forward Email-service.

### Sindre Sorhus: Meester van Utility Packages {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) is een van de meest productieve open source-bijdragers in het JavaScript-ecosysteem, met meer dan 1.000 npm-pakketten op zijn naam. Zijn utilities zoals [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), en [is-stream](https://github.com/sindresorhus/is-stream) zijn fundamentele bouwstenen die door het hele Node.js-ecosysteem worden gebruikt.

Door Sindre's werk te sponsoren, helpen we de ontwikkeling van deze kritieke utilities te ondersteunen die JavaScript-ontwikkeling efficiënter en betrouwbaarder maken.

Deze sponsoring weerspiegelt onze toewijding aan het bredere open source-ecosysteem. We erkennen dat ons eigen succes is gebouwd op de basis die door deze en andere bijdragers is gelegd, en we zetten ons in om de duurzaamheid van het hele ecosysteem te waarborgen.


## Beveiligingslekken in het JavaScript-ecosysteem Opsporen {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Onze toewijding aan open source gaat verder dan functiewijzigingen en omvat ook het identificeren en aanpakken van beveiligingslekken die miljoenen ontwikkelaars kunnen beïnvloeden. Verschillende van onze belangrijkste bijdragen aan het JavaScript-ecosysteem zijn op het gebied van beveiliging geweest.

### De Koa-Router Rescue {#the-koa-router-rescue}

In februari 2019 ontdekte Nick een kritisch probleem met het onderhoud van het populaire koa-router-pakket. Zoals hij [meldde op Hacker News](https://news.ycombinator.com/item?id=19156707), was het pakket door de oorspronkelijke onderhouders verlaten, waardoor beveiligingslekken onopgelost bleven en de gemeenschap zonder updates zat.

> \[!WARNING]
> Verlaten pakketten met beveiligingslekken vormen aanzienlijke risico’s voor het hele ecosysteem, vooral wanneer ze miljoenen keren per week worden gedownload.

Als reactie hierop maakte Nick [@koa/router](https://github.com/koajs/router) en waarschuwde hij de gemeenschap over de situatie. Sindsdien onderhoudt hij dit kritieke pakket, zodat Koa-gebruikers een veilige, goed onderhouden routeringsoplossing hebben.

### Aanpakken van ReDoS-kwetsbaarheden {#addressing-redos-vulnerabilities}

In 2020 ontdekte en verholp Nick een kritieke [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-kwetsbaarheid in het veelgebruikte `url-regex`-pakket. Deze kwetsbaarheid ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kon aanvallers in staat stellen een denial of service te veroorzaken door speciaal vervaardigde invoer te leveren die catastrofale backtracking in de reguliere expressie veroorzaakte.

In plaats van het bestaande pakket simpelweg te patchen, maakte Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), een volledig herschreven implementatie die de kwetsbaarheid aanpakt en tegelijkertijd compatibel blijft met de originele API. Hij publiceerde ook een [uitgebreide blogpost](/blog/docs/url-regex-javascript-node-js) waarin de kwetsbaarheid wordt uitgelegd en hoe deze te mitigeren.
Dit werk toont onze benadering van beveiliging: niet alleen het oplossen van problemen, maar ook het opleiden van de gemeenschap en het bieden van robuuste alternatieven die vergelijkbare problemen in de toekomst voorkomen.

### Pleiten voor Node.js- en Chromium-beveiliging {#advocating-for-nodejs-and-chromium-security}

Nick is ook actief geweest in het pleiten voor beveiligingsverbeteringen in het bredere ecosysteem. In augustus 2020 identificeerde hij een belangrijk beveiligingsprobleem in Node.js met betrekking tot de verwerking van HTTP-headers, dat werd gerapporteerd in [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Dit probleem, dat voortkwam uit een patch in Chromium, kon aanvallers mogelijk in staat stellen om beveiligingsmaatregelen te omzeilen. Nicks pleidooi zorgde ervoor dat het probleem snel werd aangepakt, waardoor miljoenen Node.js-toepassingen werden beschermd tegen mogelijke exploitatie.

### Beveiligen van npm-infrastructuur {#securing-npm-infrastructure}

Later diezelfde maand identificeerde Nick een ander kritiek beveiligingsprobleem, ditmaal in de e-mailinfrastructuur van npm. Zoals gerapporteerd in [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), implementeerde npm DMARC-, SPF- en DKIM-e-mailauthenticatieprotocollen niet correct, waardoor aanvallers mogelijk phishing-e-mails konden verzenden die leken te komen van npm.

Nicks rapport leidde tot verbeteringen in de e-mailbeveiliging van npm, waardoor de miljoenen ontwikkelaars die op npm vertrouwen voor pakketbeheer werden beschermd tegen mogelijke phishingaanvallen.


## Onze bijdragen aan het Forward Email-ecosysteem {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email is gebouwd bovenop verschillende kritieke open source-projecten, waaronder Nodemailer, WildDuck en mailauth. Ons team heeft aanzienlijke bijdragen geleverd aan deze projecten, door diepgaande problemen te identificeren en op te lossen die de e-mailbezorging en beveiliging beïnvloeden.

### Verbeteren van de kernfunctionaliteit van Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) is de ruggengraat van het verzenden van e-mails in Node.js, en onze bijdragen hebben geholpen om het robuuster te maken:

* **Verbeteringen aan SMTP-server**: We hebben parsingfouten, problemen met streamverwerking en TLS-configuratieproblemen in het SMTP-servercomponent opgelost\[^16]\[^17].
* **Verbeteringen aan mailparser**: We hebben fouten in het decoderen van tekenreeksen en problemen met de adresparser aangepakt die e-mailverwerkingsfouten konden veroorzaken\[^18]\[^19].

Deze bijdragen zorgen ervoor dat Nodemailer een betrouwbare basis blijft voor e-mailverwerking in Node.js-toepassingen, inclusief Forward Email.

### Vooruitgang in e-mailauthenticatie met Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) biedt cruciale functionaliteit voor e-mailauthenticatie, en onze bijdragen hebben de mogelijkheden aanzienlijk verbeterd:

* **Verbeteringen in DKIM-verificatie**: We ontdekten en rapporteerden dat X/Twitter DNS-cacheproblemen had die DKIM-fouten veroorzaakten voor hun uitgaande berichten, en meldden dit op Hacker One\[^20].
* **Verbeteringen in DMARC en ARC**: We hebben problemen met DMARC- en ARC-verificatie opgelost die tot onjuiste authenticatieresultaten konden leiden\[^21]\[^22].
* **Prestatieoptimalisaties**: We hebben optimalisaties bijgedragen die de prestaties van e-mailauthenticatieprocessen verbeteren\[^23]\[^24]\[^25]\[^26].

Deze verbeteringen helpen ervoor te zorgen dat e-mailauthenticatie nauwkeurig en betrouwbaar is, waardoor gebruikers worden beschermd tegen phishing- en spoofingaanvallen.

### Belangrijke verbeteringen aan Upptime {#key-upptime-enhancements}

Onze bijdragen aan Upptime omvatten:

* **SSL-certificaatbewaking**: We hebben functionaliteit toegevoegd om het verlopen van SSL-certificaten te monitoren, waardoor onverwachte uitvaltijd door verlopen certificaten wordt voorkomen\[^27].
* **Ondersteuning voor meerdere SMS-nummers**: We hebben ondersteuning geïmplementeerd om meerdere teamleden via SMS te waarschuwen wanneer incidenten zich voordoen, wat de reactietijden verbetert\[^28].
* **Fixes voor IPv6-controle**: We hebben problemen met IPv6-connectiviteitscontroles opgelost, wat zorgt voor nauwkeurigere monitoring in moderne netwerkomgevingen\[^29].
* **Ondersteuning voor donkere/lichte modus**: We hebben thema-ondersteuning toegevoegd om de gebruikerservaring van statuspagina's te verbeteren\[^31].
* **Betere TCP-ping-ondersteuning**: We hebben de TCP-ping-functionaliteit verbeterd om betrouwbaardere verbindingstests te bieden\[^32].
Deze verbeteringen komen niet alleen de statusbewaking van Forward Email ten goede, maar zijn beschikbaar voor de hele gemeenschap van Upptime-gebruikers, wat onze toewijding aan het verbeteren van de tools waarop we vertrouwen aantoont.


## De Lijm Die Alles Samenhoudt: Aangepaste Code op Grote Schaal {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Hoewel onze npm-pakketten en bijdragen aan bestaande projecten aanzienlijk zijn, is het de aangepaste code die deze componenten integreert die onze technische expertise echt laat zien. De codebase van Forward Email vertegenwoordigt een decennium aan ontwikkelingsinspanning, teruggaand tot 2017 toen het project begon als [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) voordat het werd samengevoegd in een monorepo.

### Een Enorme Ontwikkelingsinspanning {#a-massive-development-effort}

De omvang van deze aangepaste integratiecode is indrukwekkend:

* **Totale Bijdragen**: Meer dan 3.217 commits
* **Codebase Grootte**: Meer dan 421.545 regels code verdeeld over JavaScript-, Pug-, CSS- en JSON-bestanden\[^33]

Dit vertegenwoordigt duizenden uren ontwikkelwerk, debug-sessies en prestatieoptimalisaties. Het is de "geheime saus" die individuele pakketten transformeert tot een samenhangende, betrouwbare dienst die dagelijks door duizenden klanten wordt gebruikt.

### Integratie van Kernafhankelijkheden {#core-dependencies-integration}

De codebase van Forward Email integreert talrijke afhankelijkheden tot een naadloos geheel:

* **E-mailverwerking**: Integreert Nodemailer voor verzenden, SMTP Server voor ontvangen en Mailparser voor parseren
* **Authenticatie**: Gebruikt Mailauth voor DKIM-, SPF-, DMARC- en ARC-verificatie
* **DNS-resolutie**: Maakt gebruik van Tangerine voor DNS-over-HTTPS met wereldwijde caching
* **MX-verbinding**: Gebruikt mx-connect met Tangerine-integratie voor betrouwbare mailserververbindingen
* **Taakplanning**: Zet Bree in voor betrouwbare achtergrondtaakverwerking met worker threads
* **Templating**: Gebruikt email-templates om stylesheets van de website te hergebruiken in klantcommunicatie
* **E-mailopslag**: Implementeert individueel versleutelde SQLite-mailboxen met better-sqlite3-multiple-ciphers en ChaCha20-Poly1305-encryptie voor quantum-veilige privacy, wat volledige isolatie tussen gebruikers garandeert en ervoor zorgt dat alleen de gebruiker toegang heeft tot zijn mailbox

Elke van deze integraties vereist zorgvuldige overweging van randgevallen, prestatie-implicaties en beveiligingszorgen. Het resultaat is een robuust systeem dat miljoenen e-mailtransacties betrouwbaar afhandelt. Onze SQLite-implementatie maakt ook gebruik van msgpackr voor efficiënte binaire serialisatie en WebSockets (via ws) voor realtime statusupdates in onze infrastructuur.

### DNS-infrastructuur met Tangerine en mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Een cruciaal onderdeel van de infrastructuur van Forward Email is ons DNS-resolutiesysteem, gebouwd rond twee belangrijke pakketten:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Onze Node.js DNS-over-HTTPS-implementatie biedt een drop-in vervanging voor de standaard DNS-resolver, met ingebouwde retries, timeouts, slimme serverrotatie en caching-ondersteuning.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Dit pakket legt TCP-verbindingen met MX-servers, neemt een doeldomein of e-mailadres, lost de juiste MX-servers op en maakt verbinding met hen in prioriteitsvolgorde.

We hebben Tangerine geïntegreerd met mx-connect via [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), wat zorgt voor applicatielaag DNS-over-HTTP-verzoeken door heel Forward Email. Dit biedt wereldwijde caching voor DNS op schaal met 1:1 consistentie over elke regio, app of proces—cruciaal voor betrouwbare e-mailbezorging in een gedistribueerd systeem.


## Impact op Ondernemingen: Van Open Source tot Missiekritieke Oplossingen {#enterprise-impact-from-open-source-to-mission-critical-solutions}

De culminatie van onze tien jaar durende reis in open source ontwikkeling heeft Forward Email in staat gesteld niet alleen individuele ontwikkelaars te bedienen, maar ook grote ondernemingen en onderwijsinstellingen die de ruggengraat vormen van de open source beweging zelf.
### Case Studies in Mission-Critical Email Infrastructure {#case-studies-in-mission-critical-email-infrastructure}

Onze toewijding aan betrouwbaarheid, privacy en open source principes heeft van Forward Email de vertrouwde keuze gemaakt voor organisaties met veeleisende e-mailbehoeften:

* **Onderwijsinstellingen**: Zoals beschreven in onze [alumni email forwarding case study](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), vertrouwen grote universiteiten op onze infrastructuur om levenslange verbindingen met honderden duizenden alumni te onderhouden via betrouwbare e-mail doorstuurservices.

* **Enterprise Linux Oplossingen**: De [Canonical Ubuntu email enterprise case study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) toont aan hoe onze open source aanpak perfect aansluit bij de behoeften van enterprise Linux aanbieders, door hen de transparantie en controle te bieden die ze nodig hebben.

* **Open Source Stichtingen**: Misschien wel het meest bevestigend is onze samenwerking met de Linux Foundation, zoals gedocumenteerd in de [Linux Foundation email enterprise case study](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), waar onze service communicatie mogelijk maakt voor de organisatie die verantwoordelijk is voor de ontwikkeling van Linux.

Er is een prachtige symmetrie in hoe onze open source pakketten, die met zorg over vele jaren zijn onderhouden, ons in staat hebben gesteld een e-mailservice te bouwen die nu de gemeenschappen en organisaties ondersteunt die open source software promoten. Deze volledige cirkelreis—van het bijdragen aan individuele pakketten tot het aandrijven van enterprise-grade e-mailinfrastructuur voor open source leiders—vertegenwoordigt de ultieme bevestiging van onze aanpak van softwareontwikkeling.


## Een Decennium Open Source: Vooruitkijken {#a-decade-of-open-source-looking-forward}

Terugkijkend op een decennium van open source bijdragen en vooruitkijkend naar de komende tien jaar, zijn we dankbaar voor de gemeenschap die ons werk heeft ondersteund en enthousiast over wat komen gaat.

Onze reis van individuele pakketbijdragers tot beheerders van een uitgebreide e-mailinfrastructuur die wordt gebruikt door grote ondernemingen en open source stichtingen is opmerkelijk geweest. Het is een bewijs van de kracht van open source ontwikkeling en de impact die doordachte, goed onderhouden software kan hebben op het bredere ecosysteem.

In de komende jaren zetten we ons in om:

* **Onze bestaande pakketten te blijven onderhouden en verbeteren**, zodat ze betrouwbare tools blijven voor ontwikkelaars wereldwijd.
* **Onze bijdragen aan kritieke infrastructuurprojecten uit te breiden**, met name op het gebied van e-mail en beveiliging.
* **De mogelijkheden van Forward Email te verbeteren** terwijl we onze toewijding aan privacy, beveiliging en transparantie behouden.
* **De volgende generatie open source bijdragers te ondersteunen** via mentorship, sponsoring en community engagement.

Wij geloven dat de toekomst van softwareontwikkeling open, collaboratief en gebouwd op een fundament van vertrouwen is. Door hoogwaardige, op beveiliging gerichte pakketten bij te dragen aan het JavaScript-ecosysteem, hopen we een kleine rol te spelen in het bouwen van die toekomst.

Dank aan iedereen die onze pakketten heeft gebruikt, bijgedragen aan onze projecten, problemen heeft gerapporteerd of simpelweg ons werk heeft verspreid. Jullie steun heeft dit decennium van impact mogelijk gemaakt, en we zijn enthousiast om te zien wat we samen kunnen bereiken in de komende tien jaar.

\[^1]: npm download statistics for cabin, April 2025
\[^2]: npm download statistics for bson-objectid, February-March 2025
\[^3]: npm download statistics for url-regex-safe, April 2025
\[^4]: GitHub stars count for forwardemail/forwardemail.net as of April 2025
\[^5]: npm download statistics for preview-email, April 2025
\[^7]: npm download statistics for superagent, February-March 2025
\[^8]: npm download statistics for supertest, February-March 2025
\[^9]: npm download statistics for preview-email, February-March 2025
\[^10]: npm download statistics for cabin, February-March 2025
\[^11]: npm download statistics for url-regex-safe, February-March 2025
\[^12]: npm download statistics for spamscanner, February-March 2025
\[^13]: Daily download patterns from npm statistics, April 2025
\[^14]: Weekly download patterns from npm statistics, April 2025
\[^15]: npm download statistics for nodemailer, April 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Based on GitHub issues in the Upptime repository
\[^28]: Based on GitHub issues in the Upptime repository
\[^29]: Based on GitHub issues in the Upptime repository
\[^30]: npm download statistics for bree, February-March 2025
\[^31]: Based on GitHub pull requests to Upptime
\[^32]: Based on GitHub pull requests to Upptime
\[^34]: npm download statistics for koa, February-March 2025
\[^35]: npm download statistics for @koa/router, February-March 2025
\[^36]: npm download statistics for koa-router, February-March 2025
\[^37]: npm download statistics for url-regex, February-March 2025
\[^38]: npm download statistics for @breejs/later, February-March 2025
\[^39]: npm download statistics for email-templates, February-March 2025
\[^40]: npm download statistics for get-paths, February-March 2025
\[^41]: npm download statistics for dotenv-parse-variables, February-March 2025
\[^42]: npm download statistics for @koa/multer, February-March 2025
