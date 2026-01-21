# Een decennium van impact: hoe onze npm-pakketten 1 miljard downloads bereikten en JavaScript vormgaven {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [De pioniers die ons vertrouwen: Isaac Z. Schlueter en Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Van de creatie van npm tot Node.js-leiderschap](#from-npms-creation-to-nodejs-leadership)
* [De architect achter de code: Nick Baughs reis](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express Technisch Comité en kernbijdragen](#express-technical-committee-and-core-contributions)
  * [Koa Framework-bijdragen](#koa-framework-contributions)
  * [Van individuele bijdrager tot organisatieleider](#from-individual-contributor-to-organization-leader)
* [Onze GitHub-organisaties: ecosystemen van innovatie](#our-github-organizations-ecosystems-of-innovation)
  * [Cabine: Gestructureerde houtkap voor moderne toepassingen](#cabin-structured-logging-for-modern-applications)
  * [Spamscanner: e-mailmisbruik bestrijden](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderne taakplanning met werkthreads](#bree-modern-job-scheduling-with-worker-threads)
  * [E-mail doorsturen: open source e-mailinfrastructuur](#forward-email-open-source-email-infrastructure)
  * [Lad: Essentiële Koa-hulpprogramma's en -tools](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open Source Uptime Monitoring](#upptime-open-source-uptime-monitoring)
* [Onze bijdragen aan het Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem)
  * [Van pakketten tot productie](#from-packages-to-production)
  * [De feedbacklus](#the-feedback-loop)
* [De kernprincipes van Forward Email: een basis voor uitmuntendheid](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Altijd ontwikkelaarsvriendelijk, gericht op beveiliging en transparant](#always-developer-friendly-security-focused-and-transparent)
  * [Naleving van beproefde softwareontwikkelingsprincipes](#adherence-to-time-tested-software-development-principles)
  * [Richten op de scrappy, bootstrapped ontwikkelaar](#targeting-the-scrappy-bootstrapped-developer)
  * [Principes in de praktijk: de Forward Email Codebase](#principles-in-practice-the-forward-email-codebase)
  * [Privacy door ontwerp](#privacy-by-design)
  * [Duurzame open source](#sustainable-open-source)
* [De cijfers liegen niet: onze verbluffende npm-downloadstatistieken](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Een vogelperspectief op onze impact](#a-birds-eye-view-of-our-impact)
  * [Dagelijkse impact op schaal](#daily-impact-at-scale)
  * [Verder dan de ruwe cijfers](#beyond-the-raw-numbers)
* [Ondersteuning van het ecosysteem: onze open source-sponsorschappen](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: pionier op het gebied van e-mailinfrastructuur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Hulpprogramma Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Het ontdekken van beveiligingskwetsbaarheden in het JavaScript-ecosysteem](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [De Koa-Router redding](#the-koa-router-rescue)
  * [Het aanpakken van ReDoS-kwetsbaarheden](#addressing-redos-vulnerabilities)
  * [Pleiten voor Node.js en Chromium-beveiliging](#advocating-for-nodejs-and-chromium-security)
  * [Beveiliging van npm-infrastructuur](#securing-npm-infrastructure)
* [Onze bijdragen aan het Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Verbetering van de kernfunctionaliteit van Nodemailer](#enhancing-nodemailers-core-functionality)
  * [E-mailauthenticatie verbeteren met Mailauth](#advancing-email-authentication-with-mailauth)
  * [Belangrijkste upptime-verbeteringen](#key-upptime-enhancements)
* [De lijm die alles bij elkaar houdt: aangepaste code op schaal](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Een enorme ontwikkelingsinspanning](#a-massive-development-effort)
  * [Integratie van kernafhankelijkheden](#core-dependencies-integration)
  * [DNS-infrastructuur met Tangerine en MX-Connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impact op ondernemingen: van open source tot bedrijfskritische oplossingen](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Casestudies in missiekritieke e-mailinfrastructuur](#case-studies-in-mission-critical-email-infrastructure)
* [Een decennium open source: een blik op de toekomst](#a-decade-of-open-source-looking-forward)

## Voorwoord {#foreword}

In de wereld van [JavaScript](https://en.wikipedia.org/wiki/JavaScript) en [Node.js](https://en.wikipedia.org/wiki/Node.js) zijn sommige pakketten essentieel: ze worden dagelijks miljoenen keren gedownload en vormen de basis voor apps wereldwijd. Achter deze tools zitten ontwikkelaars die zich richten op open-sourcekwaliteit. Vandaag laten we zien hoe ons team helpt bij het bouwen en onderhouden van npm-pakketten die belangrijke onderdelen van het JavaScript-ecosysteem zijn geworden.

## De pioniers die ons vertrouwen: Isaac Z. Schlueter en Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

We zijn er trots op dat we [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) als gebruiker hebben. Isaac heeft [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) ontwikkeld en heeft meegewerkt aan de ontwikkeling van [Node.js](https://en.wikipedia.org/wiki/Node.js). Zijn vertrouwen in Forward Email toont onze focus op kwaliteit en beveiliging. Isaac gebruikt Forward Email voor verschillende domeinen, waaronder izs.me.

Isaacs impact op JavaScript is enorm. In 2009 was hij een van de eersten die de potentie van Node.js zag, in samenwerking met [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), de oprichter van het platform. Zoals Isaac zei in een [interview met Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-artikel: "Te midden van deze zeer kleine community van een groep mensen die probeerden uit te vinden hoe ze server-side JS konden realiseren, kwam Ryan Dahl met Node, wat gewoonweg de juiste aanpak was. Ik heb mijn steentje daaraan bijgedragen en raakte er halverwege 2009 erg bij betrokken."

> \[!NOTE]
> Voor wie geïnteresseerd is in de geschiedenis van Node.js zijn er uitstekende documentaires beschikbaar die de ontwikkeling ervan beschrijven, waaronder [Het verhaal van Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) en [10 dingen waar ik spijt van heb over Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [persoonlijke website](https://tinyclouds.org/) bevat ook waardevolle inzichten in zijn werk.

### Van de creatie van npm tot Node.js-leiderschap {#from-npms-creation-to-nodejs-leadership}

Isaac creëerde npm in september 2009 en de eerste bruikbare versie werd begin 2010 uitgebracht. Deze pakketbeheerder voorzag in een belangrijke behoefte in Node.js, waardoor ontwikkelaars eenvoudig code konden delen en hergebruiken. Volgens [Node.js Wikipedia-pagina](https://en.wikipedia.org/wiki/Node.js): "In januari 2010 werd een pakketbeheerder geïntroduceerd voor de Node.js-omgeving, genaamd npm. De pakketbeheerder stelt programmeurs in staat om Node.js-pakketten te publiceren en te delen, samen met de bijbehorende broncode, en is ontworpen om de installatie, update en de-installatie van pakketten te vereenvoudigen."

Toen Ryan Dahl in januari 2012 afscheid nam van Node.js, nam Isaac het over als projectleider. Zoals vermeld op [zijn samenvatting](https://izs.me/resume), "leidde hij de ontwikkeling van verschillende fundamentele Node.js kern-API's, waaronder het CommonJS modulesysteem, bestandssysteem-API's en streams" en "fungeerde hij twee jaar lang als BDFL (Benevolent Dictator For Life) van het project, waarmee hij zorgde voor een steeds hogere kwaliteit en een betrouwbaar buildproces voor Node.js-versies v0.6 tot en met v0.10."

Isaac loodste Node.js door een belangrijke groeiperiode en zette standaarden die het platform vandaag de dag nog steeds vormgeven. Later, in 2014, richtte hij npm, Inc. op ter ondersteuning van de npm-registry, die hij voorheen zelfstandig had gerund.

We danken Isaac voor zijn enorme bijdragen aan JavaScript en gebruiken nog steeds veel van de pakketten die hij heeft ontwikkeld. Zijn werk heeft de manier waarop we software bouwen en de manier waarop miljoenen ontwikkelaars wereldwijd code delen, veranderd.

## De architect achter de code: Nick Baughs reis {#the-architect-behind-the-code-nick-baughs-journey}

De kern van ons open source-succes is Nick Baugh, oprichter en eigenaar van Forward Email. Hij werkt al bijna 20 jaar in JavaScript en heeft de manier waarop talloze ontwikkelaars apps bouwen, vormgegeven. Zijn open source-avontuur getuigt van zowel technische vaardigheden als leiderschap in de community.

### Express Technisch Comité en Kernbijdragen {#express-technical-committee-and-core-contributions}

Nicks expertise in webframeworks leverde hem een plek op in de [Express Technisch Comité](https://expressjs.com/en/resources/community.html)-lijst, waar hij meewerkte aan een van de meestgebruikte Node.js-frameworks. Nick staat nu vermeld als inactief lid in de [Express communitypagina](https://expressjs.com/en/resources/community.html)-lijst.

> \[!IMPORTANT]
> Express is oorspronkelijk ontwikkeld door TJ Holowaychuk, een productieve open-sourcebijdrager die een groot deel van het Node.js-ecosysteem heeft vormgegeven. We zijn TJ dankbaar voor zijn fundamentele werk en respecteren zijn [besluit om een pauze te nemen](https://news.ycombinator.com/item?id=37687017) vanwege zijn uitgebreide open-sourcebijdragen.

Als lid van [Express Technisch Comité](https://expressjs.com/en/resources/community.html) besteedde Nick veel aandacht aan details bij zaken als het verduidelijken van de documentatie van `req.originalUrl` en het oplossen van problemen met de verwerking van multipart-formulieren.

### Koa Framework-bijdragen {#koa-framework-contributions}

Nicks werk met [Koa-framework](https://github.com/koajs/koa) – een modern, lichter alternatief voor Express, eveneens ontwikkeld door TJ Holowaychuk – onderstreept zijn toewijding aan betere tools voor webontwikkeling. Zijn bijdragen aan Koa omvatten zowel problemen als code via pull-requests, en richten zich op foutverwerking, contenttypebeheer en verbeteringen in de documentatie.

Dankzij zijn werk bij zowel Express als Koa heeft hij een uniek inzicht in Node.js webontwikkeling. Hierdoor kan ons team pakketten creëren die goed samenwerken met meerdere framework-ecosystemen.

### Van individuele medewerker naar organisatieleider {#from-individual-contributor-to-organization-leader}

Wat begon als het helpen van bestaande projecten, groeide uit tot het creëren en onderhouden van complete pakketecosystemen. Nick richtte meerdere GitHub-organisaties op, waaronder [Cabine](https://github.com/cabinjs), [Spamscanner](https://github.com/spamscanner), [E-mail doorsturen](https://github.com/forwardemail), [Jongen](https://github.com/ladjs) en [Bree](https://github.com/breejs), die elk specifieke behoeften binnen de JavaScript-community aanpakken.

Deze verschuiving van bijdrager naar leider toont Nicks visie op goed ontworpen software die echte problemen oplost. Door gerelateerde pakketten te organiseren onder specifieke GitHub-organisaties, heeft hij tool-ecosystemen gebouwd die samenwerken en tegelijkertijd modulair en flexibel blijven voor de bredere ontwikkelaarscommunity.

## Onze GitHub-organisaties: ecosystemen van innovatie {#our-github-organizations-ecosystems-of-innovation}

We organiseren ons open source-werk rond gerichte GitHub-organisaties, die elk specifieke JavaScript-behoeften vervullen. Deze structuur creëert samenhangende pakketfamilies die goed samenwerken en toch modulair blijven.

### Cabine: Gestructureerde logging voor moderne toepassingen {#cabin-structured-logging-for-modern-applications}

[Cabine organisatie](https://github.com/cabinjs) is onze versie van eenvoudige, krachtige app-logging. Het hoofdpakket [`cabin`](https://github.com/cabinjs/cabin) heeft bijna 900 GitHub-sterren en meer dan 100.000 wekelijkse downloads. Cabin biedt gestructureerde logging die werkt met populaire services zoals Sentry, LogDNA en Papertrail.

Wat Cabin uniek maakt, is het doordachte API- en pluginsysteem. Ondersteuning van pakketten zoals [`axe`](https://github.com/cabinjs/axe) voor Express middleware en [`parse-request`](https://github.com/cabinjs/parse-request) voor het parsen van HTTP-verzoeken, bewijst onze toewijding aan complete oplossingen in plaats van geïsoleerde tools.

Het [`bson-objectid`](https://github.com/cabinjs/bson-objectid)-pakket verdient een speciale vermelding, met meer dan 1,7 miljoen downloads in slechts twee maanden. Deze lichte MongoDB ObjectID-implementatie is dé oplossing geworden voor ontwikkelaars die ID's nodig hebben zonder volledige MongoDB-afhankelijkheden.

### Spamscanner: e-mailmisbruik bestrijden {#spam-scanner-fighting-email-abuse}

[Spam Scanner organisatie](https://github.com/spamscanner) toont onze toewijding aan het oplossen van echte problemen. Het hoofdpakket [`spamscanner`](https://github.com/spamscanner/spamscanner) biedt geavanceerde detectie van e-mailspam, maar het is het pakket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) dat een grote acceptatiegraad heeft.

Met meer dan 1,2 miljoen downloads in twee maanden tijd lost `url-regex-safe` kritieke beveiligingsproblemen op in andere reguliere expressies voor URL-detectie. Dit pakket toont onze aanpak van open source: het vinden van een veelvoorkomend probleem (in dit geval kwetsbaarheden van [Opnieuw doen](https://en.wikipedia.org/wiki/ReDoS) in URL-validatie), het creëren van een solide oplossing en het zorgvuldig onderhouden ervan.

### Bree: Moderne taakplanning met werkthreads {#bree-modern-job-scheduling-with-worker-threads}

[Bree-organisatie](https://github.com/breejs) is ons antwoord op een veelvoorkomende Node.js-uitdaging: betrouwbare taakplanning. Het hoofdpakket [`bree`](https://github.com/breejs/bree), met meer dan 3100 GitHub-sterren, biedt een moderne taakplanner met Node.js-workerthreads voor betere prestaties en betrouwbaarheid.

> \[!NOTE]
> Bree is ontstaan nadat we [Agenda](https://github.com/agenda/agenda) hadden onderhouden, waarbij we de geleerde lessen toepasten om een betere taakplanner te bouwen. Onze bijdragen aan Agenda hebben ons geholpen manieren te vinden om de taakplanning te verbeteren.

Wat maakt Bree anders dan andere planners zoals Agenda:

* **Geen externe afhankelijkheden**: In tegenstelling tot Agenda, waarvoor MongoDB nodig is, heeft Bree geen Redis of MongoDB nodig om de taakstatus te beheren.
* **Werkthreads**: Bree gebruikt Node.js-werkthreads voor sandbox-processen, wat zorgt voor betere isolatie en betere prestaties.
* **Eenvoudige API**: Bree biedt gedetailleerde en eenvoudige controle, waardoor het eenvoudiger is om complexe planningsbehoeften te implementeren.
* **Ingebouwde ondersteuning**: Dingen zoals elegant herladen, cronjobs, datums en gebruiksvriendelijke tijden zijn standaard inbegrepen.

Bree is een belangrijk onderdeel van [forwardemail.net](https://github.com/forwardemail/forwardemail.net) en verwerkt kritieke achtergrondtaken zoals e-mailverwerking, opschoning en gepland onderhoud. Het gebruik van Bree in Forward Email toont onze toewijding aan het gebruik van onze eigen tools in productie, zodat deze voldoen aan hoge betrouwbaarheidsnormen.

We gebruiken en waarderen ook andere geweldige workerthread-pakketten zoals [zwembad](https://github.com/piscinajs/piscina) en HTTP-clients zoals [elf](https://github.com/nodejs/undici). Piscina gebruikt, net als Bree, Node.js-workerthreads voor efficiënte taakverwerking. We bedanken [Matthew Hill](https://github.com/mcollina), die zowel undici als piscina onderhoudt, voor zijn belangrijke bijdragen aan Node.js. Matteo is lid van de Technische Stuurgroep van Node.js en heeft de mogelijkheden van HTTP-clients in Node.js aanzienlijk verbeterd.

### E-mail doorsturen: Open Source e-mailinfrastructuur {#forward-email-open-source-email-infrastructure}

Ons meest ambitieuze project is [E-mail doorsturen](https://github.com/forwardemail), een open-source e-mailservice die e-maildoorsturing, opslag en API-services biedt. De hoofdrepository heeft meer dan 1100 GitHub-sterren\[^^4], wat de waardering van de community voor dit alternatief voor propriëtaire e-mailservices aantoont.

Het [`preview-email`](https://github.com/forwardemail/preview-email)-pakket van deze organisatie, met meer dan 2,5 miljoen downloads in twee maanden tijd, is een essentiële tool geworden voor ontwikkelaars die met e-mailsjablonen werken. Door een eenvoudige manier te bieden om e-mails te bekijken tijdens de ontwikkeling, lost het een veelvoorkomend probleem op bij het bouwen van e-mailapplicaties.

### Lad: Essentiële Koa-hulpprogramma's en -tools {#lad-essential-koa-utilities-and-tools}

[Jongensorganisatie](https://github.com/ladjs) biedt een verzameling essentiële hulpprogramma's en tools die primair gericht zijn op het verbeteren van het Koa-frameworkecosysteem. Deze pakketten lossen veelvoorkomende uitdagingen in webontwikkeling op en zijn ontworpen om naadloos samen te werken en toch onafhankelijk van elkaar bruikbaar te blijven.

#### koa-better-error-handler: Verbeterde foutverwerking voor Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) biedt een betere oplossing voor foutverwerking voor Koa-applicaties. Met meer dan 50 GitHub-sterren zorgt dit pakket ervoor dat `ctx.throw` gebruiksvriendelijke foutmeldingen genereert en tegelijkertijd verschillende beperkingen van Koa's ingebouwde foutverwerking aanpakt:

* Detecteert en verwerkt DNS-fouten in Node.js, Mongoose-fouten en Redis-fouten.
* Gebruikt [Boom](https://github.com/hapijs/boom) voor het creëren van consistente, goed geformatteerde foutreacties.
* Behoudt headers (in tegenstelling tot de ingebouwde handler van Koa).
* Handhaaft de juiste statuscodes in plaats van standaard 500.
* Ondersteunt flashberichten en sessiebehoud.
* Biedt HTML-foutlijsten voor validatiefouten.
* Ondersteunt meerdere antwoordtypen (HTML, JSON en platte tekst).

Dit pakket is vooral waardevol in combinatie met [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) voor uitgebreid foutbeheer in Koa-toepassingen.

#### paspoort: Authenticatie voor Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) breidt de populaire Passport.js authenticatiemiddleware uit met specifieke verbeteringen voor moderne webapplicaties. Dit pakket ondersteunt direct meerdere authenticatiestrategieën:

* Lokale authenticatie met e-mail
* Inloggen met Apple
* GitHub-authenticatie
* Google-authenticatie
* Authenticatie met een eenmalig wachtwoord (OTP)

Het pakket is zeer aanpasbaar, waardoor ontwikkelaars veldnamen en -zinnen kunnen aanpassen aan de vereisten van hun applicatie. Het is ontworpen om naadloos te integreren met Mongoose voor gebruikersbeheer, waardoor het een ideale oplossing is voor Koa-gebaseerde applicaties die robuuste authenticatie vereisen.

#### elegant: elegante afsluiting van de toepassing {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) lost de cruciale uitdaging op van het netjes afsluiten van Node.js-applicaties. Met meer dan 70 GitHub-sterren zorgt dit pakket ervoor dat je applicatie netjes kan worden afgesloten zonder gegevensverlies of vastgelopen verbindingen. Belangrijkste kenmerken:

* Ondersteuning voor het netjes sluiten van HTTP-servers (Express/Koa/Fastify)
* Schoon afsluiten van databaseverbindingen (MongoDB/Mongoose)
* Correct afsluiten van Redis-clients
* Afhandeling van Bree-taakplanners
* Ondersteuning voor aangepaste afsluithandlers
* Configureerbare time-outinstellingen
* Integratie met logsystemen

Dit pakket is essentieel voor productietoepassingen waarbij onverwachte afsluitingen kunnen leiden tot gegevensverlies of -corruptie. Door de juiste afsluitprocedures te implementeren, helpt `@ladjs/graceful` de betrouwbaarheid en stabiliteit van uw applicatie te waarborgen.

### Upptime: Open Source Uptime Monitoring {#upptime-open-source-uptime-monitoring}

De [Upptime-organisatie](https://github.com/upptime) vertegenwoordigt onze toewijding aan transparante, open source monitoring. De belangrijkste repository van [`upptime`](https://github.com/upptime/upptime) heeft meer dan 13.000 GitHub-sterren, wat het een van de populairste projecten maakt waaraan we bijdragen. Upptime biedt een door GitHub aangestuurde uptimemonitor en statuspagina die volledig zonder server werkt.

We gebruiken Upptime voor onze eigen statuspagina op <https://status.forwardemail.net> met de broncode beschikbaar op <https://github.com/forwardemail/status.forwardemail.net>.

Wat Upptime bijzonder maakt, is de architectuur:

* **100% open source**: Elk onderdeel is volledig open source en aanpasbaar.
* **Powered by GitHub**: Maakt gebruik van GitHub Actions, Issues en Pages voor een serverloze monitoringoplossing.
* **Geen server vereist**: In tegenstelling tot traditionele monitoringtools hoeft u voor Upptime geen server te beheren of te beheren.
* **Automatische statuspagina**: Genereert een mooie statuspagina die kan worden gehost op GitHub Pages.
* **Krachtige meldingen**: Integreert met verschillende meldingskanalen, waaronder e-mail, sms en Slack.

Om de ervaring van onze gebruikers te verbeteren, hebben we [@octokit/core](https://github.com/octokit/core.js/) geïntegreerd in de codebase van forwardemail.net om realtime statusupdates en incidenten direct op onze website weer te geven. Deze integratie biedt onze gebruikers duidelijke transparantie in geval van problemen in onze gehele stack (website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, enz.), met directe toastmeldingen, wijzigingen in badge-pictogrammen, waarschuwingskleuren en meer.

Met de @octokit/core-bibliotheek kunnen we realtime data uit onze Upptime GitHub-repository halen, verwerken en op een gebruiksvriendelijke manier weergeven. Wanneer een service uitvalt of de prestaties afnemen, worden gebruikers direct via visuele indicatoren op de hoogte gebracht, zonder de hoofdapplicatie te hoeven verlaten. Deze naadloze integratie zorgt ervoor dat onze gebruikers altijd over actuele informatie over de status van ons systeem beschikken, wat de transparantie en het vertrouwen vergroot.

Upptime is omarmd door honderden organisaties die op zoek zijn naar een transparante en betrouwbare manier om hun diensten te monitoren en de status ervan aan gebruikers te communiceren. Het succes van het project toont de kracht aan van het bouwen van tools die gebruikmaken van bestaande infrastructuur (in dit geval GitHub) om veelvoorkomende problemen op nieuwe manieren op te lossen.

## Onze bijdragen aan het Forward Email Ecosystem {#our-contributions-to-the-forward-email-ecosystem}

Hoewel onze opensourcepakketten wereldwijd door ontwikkelaars worden gebruikt, vormen ze ook de basis van onze eigen Forward Email-service. Deze dubbele rol – als makers én gebruikers van deze tools – geeft ons een uniek perspectief op de praktische toepassing ervan en stimuleert continue verbetering.

### Van pakketten naar productie {#from-packages-to-production}

De overgang van individuele pakketten naar een samenhangend productiesysteem vereist zorgvuldige integratie en uitbreiding. Voor Forward Email omvat dit proces:

* **Aangepaste extensies**: E-mailspecifieke extensies toevoegen aan onze opensourcepakketten die voldoen aan onze unieke vereisten.
* **Integratiepatronen**: Patronen ontwikkelen voor hoe deze pakketten samenwerken in een productieomgeving.
* **Prestatieoptimalisaties**: Prestatieknelpunten identificeren en aanpakken die zich alleen op grote schaal voordoen.
* **Beveiligingsversterking**: Extra beveiligingslagen toevoegen, specifiek voor e-mailverwerking en de bescherming van gebruikersgegevens.

Dit werk vertegenwoordigt duizenden uren aan ontwikkeling die verder gaan dan de kernpakketten zelf. Het resultaat is een robuuste, veilige e-mailservice die het beste van onze open source-bijdragen benut.

### De feedbacklus {#the-feedback-loop}

Misschien wel het meest waardevolle aspect van het gebruik van onze eigen pakketten in productie is de feedbacklus die het creëert. Wanneer we beperkingen of randgevallen tegenkomen in Forward Email, lossen we die niet alleen lokaal op, maar verbeteren we ook de onderliggende pakketten, wat zowel onze service als de bredere community ten goede komt.

Deze aanpak heeft tot talrijke verbeteringen geleid:

* **Graceful Shutdown van Bree**: De behoefte van Forward Email aan implementaties zonder downtime leidde tot verbeterde graceful shutdown-mogelijkheden in Bree.
* **Patroonherkenning van Spam Scanner**: Echte spampatronen die in Forward Email werden aangetroffen, hebben de detectiealgoritmen van Spam Scanner beïnvloed.
* **Prestatieoptimalisaties van Cabin**: Logging met een hoog volume in de productieomgeving bracht optimalisatiemogelijkheden in Cabin aan het licht waar alle gebruikers baat bij hebben.

Door deze positieve cyclus tussen ons open source-werk en onze productieservices in stand te houden, zorgen we ervoor dat onze pakketten praktische, in de praktijk geteste oplossingen blijven en geen theoretische implementaties.

## Kernprincipes van Forward Email: een basis voor uitmuntendheid {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email is ontworpen volgens een reeks kernprincipes die al onze ontwikkelingsbeslissingen sturen. Deze principes, die gedetailleerd worden beschreven op onze [website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), zorgen ervoor dat onze service ontwikkelaarsvriendelijk, veilig en gericht op de privacy van gebruikers blijft.

### Altijd ontwikkelaarsvriendelijk, beveiligingsgericht en transparant {#always-developer-friendly-security-focused-and-transparent}

Ons belangrijkste principe is om software te creëren die ontwikkelaarsvriendelijk is en tegelijkertijd de hoogste normen voor beveiliging en privacy handhaaft. Wij geloven dat technische uitmuntendheid nooit ten koste mag gaan van gebruiksgemak, en dat transparantie vertrouwen schept binnen onze community.

Dit principe komt tot uiting in onze gedetailleerde documentatie, duidelijke foutmeldingen en open communicatie over zowel successen als uitdagingen. Door onze volledige codebase open source te maken, nodigen we uit tot onderzoek en samenwerking, wat zowel onze software als het bredere ecosysteem versterkt.

### Naleving van beproefde softwareontwikkelingsprincipes {#adherence-to-time-tested-software-development-principles}

Wij hanteren een aantal gevestigde softwareontwikkelingsprincipes die hun waarde al tientallen jaren bewijzen:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Zorgen scheiden via het Model-View-Controller-patroon
* **[Unix-filosofie](https://en.wikipedia.org/wiki/Unix_philosophy)**: Modulaire componenten creëren die één ding goed doen
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Het simpel en overzichtelijk houden
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Niet herhalen, hergebruik van code bevorderen
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Je hebt het niet nodig, voortijdige optimalisatie vermijden
* **[Twaalf Factor](https://12factor.net/)**: Best practices volgen voor het bouwen van moderne, schaalbare applicaties
* **[Het scheermes van Ockham](https://en.wikipedia.org/wiki/Occam%27s_razor)**: De eenvoudigste oplossing kiezen die aan de eisen voldoet
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Onze eigen producten uitgebreid gebruiken

Deze principes zijn niet zomaar theoretische concepten – ze zijn verankerd in onze dagelijkse ontwikkelpraktijken. Onze trouw aan de Unix-filosofie blijkt bijvoorbeeld uit de manier waarop we onze npm-pakketten hebben gestructureerd: kleine, gerichte modules die samen kunnen worden samengesteld om complexe problemen op te lossen.

### Richt zich op de scrappy, bootstrapped ontwikkelaar {#targeting-the-scrappy-bootstrapped-developer}

We richten ons specifiek op de scrappy, bootstrapped en [ramen-winstgevend](https://www.paulgraham.com/ramenprofitable.html) ontwikkelaar. Deze focus bepaalt alles, van ons prijsmodel tot onze technische beslissingen. We begrijpen de uitdagingen van het bouwen van producten met beperkte middelen, omdat we er zelf ervaring mee hebben.

Dit principe is met name belangrijk in onze aanpak van open source. We creëren en onderhouden pakketten die echte problemen oplossen voor ontwikkelaars zonder budget voor grote bedrijven, waardoor krachtige tools voor iedereen toegankelijk zijn, ongeacht hun middelen.

### Principes in de praktijk: De Forward Email Codebase {#principles-in-practice-the-forward-email-codebase}

Deze principes zijn duidelijk zichtbaar in de codebase van Forward Email. Ons package.json-bestand toont een zorgvuldige selectie van afhankelijkheden, elk gekozen om aan te sluiten bij onze kernwaarden:

* Beveiligingsgerichte pakketten zoals `mailauth` voor e-mailauthenticatie
* Ontwikkelaarsvriendelijke tools zoals `preview-email` voor eenvoudiger debuggen
* Modulaire componenten zoals de verschillende `p-*`-hulpprogramma's van Sindre Sorhus

Doordat we deze principes consequent in de loop der tijd hebben toegepast, hebben we een service ontwikkeld waaraan ontwikkelaars hun e-mailinfrastructuur kunnen toevertrouwen. Deze service is veilig, betrouwbaar en afgestemd op de waarden van de open source-community.

### Privacy door ontwerp {#privacy-by-design}

Privacy is geen bijzaak of marketingfunctie voor Forward Email; het is een fundamenteel ontwerpprincipe dat elk aspect van onze service en code beïnvloedt:

* **Zero-Access Encryption**: We hebben systemen geïmplementeerd die het technisch onmogelijk maken om e-mails van gebruikers te lezen.
* **Minimale gegevensverzameling**: We verzamelen alleen de gegevens die nodig zijn om onze service te leveren, niets meer.
* **Transparant beleid**: Ons privacybeleid is geschreven in duidelijke, begrijpelijke taal, zonder juridisch jargon.
* **Open-sourceverificatie**: Onze open-sourcecodebase stelt beveiligingsonderzoekers in staat onze privacyclaims te verifiëren.

Deze toewijding geldt ook voor onze open source-pakketten, die vanaf de basis zijn ontworpen met ingebouwde best practices voor beveiliging en privacy.

### Duurzame open source {#sustainable-open-source}

Wij geloven dat opensourcesoftware duurzame modellen nodig heeft om op de lange termijn te floreren. Onze aanpak omvat:

* **Commerciële ondersteuning**: Premium ondersteuning en services rondom onze opensourcetools.
* **Gebalanceerde licenties**: Licenties gebruiken die zowel de vrijheden van gebruikers als de duurzaamheid van het project beschermen.
* **Betrokkenheid bij de community**: Actief samenwerken met bijdragers om een ondersteunende community op te bouwen.
* **Transparante roadmaps**: Onze ontwikkelingsplannen delen zodat gebruikers hierop kunnen anticiperen.

Door ons te richten op duurzaamheid, zorgen we ervoor dat onze open source-bijdragen in de loop van de tijd kunnen blijven groeien en verbeteren, en niet verwaarloosd worden.

## De cijfers liegen niet: onze verbluffende npm-downloadstatistieken {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Als we het hebben over de impact van opensourcesoftware, bieden downloadstatistieken een tastbare maatstaf voor acceptatie en vertrouwen. Veel van de pakketten die we helpen onderhouden, hebben een omvang bereikt die maar weinig opensourceprojecten ooit bereiken, met een gecombineerd aantal downloads dat in de miljarden loopt.

![Top npm-pakketten op basis van downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Hoewel we er trots op zijn dat we bijdragen aan het onderhoud van diverse veelgedownloade pakketten in het JavaScript-ecosysteem, willen we erkennen dat veel van deze pakketten oorspronkelijk door andere getalenteerde ontwikkelaars zijn ontwikkeld. Pakketten zoals superagent en supertest zijn oorspronkelijk ontwikkeld door TJ Holowaychuk, wiens productieve bijdragen aan open source een belangrijke rol hebben gespeeld bij de vormgeving van het Node.js-ecosysteem.

### Een vogelperspectief op onze impact {#a-birds-eye-view-of-our-impact}

Alleen al in de periode van twee maanden van februari tot en met maart 2025 hebben de volgende toppakketten waaraan we hebben bijgedragen en die ons helpen verbluffende downloadaantallen te behouden:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 downloads\[^7] (oorspronkelijk gemaakt door TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 downloads\[^8] (oorspronkelijk gemaakt door TJ Holowaychuk)
* **[Ook](https://www.npmjs.com/package/koa)**: 28.539.295 downloads\[^34] (oorspronkelijk gemaakt door TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 downloads\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 downloads\[^37]
* **[voorbeeld-e-mail](https://www.npmjs.com/package/preview-email)**: 2.500.000 downloads\[^9]
* **[cabine](https://www.npmjs.com/package/cabin)**: 1.800.000 downloads\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 downloads\[^38]
* **[e-mailsjablonen](https://www.npmjs.com/package/email-templates)**: 1.128.139 downloads\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 downloads\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 downloads\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 downloads\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 downloads\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 downloads\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 downloads\[^30]

> \[!NOTE]
> Verschillende andere pakketten die we helpen onderhouden maar niet zelf hebben gemaakt, hebben zelfs nog hogere downloadaantallen, waaronder `form-data` (meer dan 738 miljoen downloads), `toidentifier` (meer dan 309 miljoen downloads), `stackframe` (meer dan 116 miljoen downloads) en `error-stack-parser` (meer dan 113 miljoen downloads). We zijn vereerd om aan deze pakketten bij te dragen, met respect voor het werk van hun oorspronkelijke auteurs.

Dit zijn niet alleen indrukwekkende cijfers, het zijn ook de cijfers van echte ontwikkelaars die echte problemen oplossen met code die wij helpen onderhouden. Elke download is een voorbeeld van hoe deze pakketten iemand hebben geholpen iets zinvols te bouwen, van hobbyprojecten tot bedrijfsapplicaties die door miljoenen mensen worden gebruikt.

![Pakketcategorieën distributie](/img/art/category_pie_chart.svg)

### Dagelijkse impact op schaal {#daily-impact-at-scale}

De dagelijkse downloadpatronen laten een consistent, hoog gebruik zien, met pieken van miljoenen downloads per dag. Deze consistentie getuigt van de stabiliteit en betrouwbaarheid van deze pakketten: ontwikkelaars proberen ze niet alleen uit; ze integreren ze in hun kernworkflows en zijn er dag in dag uit afhankelijk van.

Wekelijkse downloadpatronen laten nog indrukwekkendere cijfers zien, met consistente schommelingen rond de tientallen miljoenen downloads per week\[^14]. Dit vertegenwoordigt een enorme voetafdruk in het JavaScript-ecosysteem, aangezien deze pakketten in productieomgevingen over de hele wereld draaien.

### Verder dan de ruwe cijfers {#beyond-the-raw-numbers}

Hoewel de downloadstatistieken op zichzelf al indrukwekkend zijn, vertellen ze een dieper verhaal over het vertrouwen dat de community in deze pakketten stelt. Het onderhouden van pakketten op deze schaal vereist een onwrikbare toewijding aan:

* **Compatibiliteit met eerdere versies**: Wijzigingen moeten zorgvuldig worden overwogen om te voorkomen dat bestaande implementaties worden verstoord.
* **Beveiliging**: Met miljoenen applicaties die afhankelijk zijn van deze pakketten, kunnen beveiligingsproblemen verstrekkende gevolgen hebben.
* **Prestaties**: Op deze schaal kunnen zelfs kleine prestatieverbeteringen aanzienlijke voordelen opleveren.
* **Documentatie**: Duidelijke, uitgebreide documentatie is essentieel voor pakketten die worden gebruikt door ontwikkelaars van alle ervaringsniveaus.

De consistente groei in downloadaantallen door de tijd heen weerspiegelt het succes bij het nakomen van deze verplichtingen en het opbouwen van vertrouwen bij de ontwikkelaarscommunity via betrouwbare, goed onderhouden pakketten.

## Ondersteuning van het ecosysteem: onze open source-sponsorschappen {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Duurzaamheid van open source gaat niet alleen over het leveren van code, maar ook over het ondersteunen van ontwikkelaars die kritieke infrastructuur beheren.

Naast onze directe bijdragen aan het JavaScript-ecosysteem zijn we er trots op prominente Node.js-bijdragers te sponsoren, wier werk de basis vormt voor veel moderne applicaties. Onze sponsoring omvat:

### Andris Reinman: pionier op het gebied van e-mailinfrastructuur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) is de maker van [Nodemailer](https://github.com/nodemailer/nodemailer), de populairste e-mailbibliotheek voor Node.js met meer dan 14 miljoen wekelijkse downloads. Zijn werk omvat ook andere cruciale componenten van de e-mailinfrastructuur, zoals [SMTP-server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) en [Wilde Eend](https://github.com/nodemailer/wildduck).

Met onze sponsoring kunnen we het voortdurende onderhoud en de ontwikkeling van deze essentiële hulpmiddelen, die e-mailcommunicatie voor talloze Node.js-applicaties mogelijk maken, garanderen. Ook onze eigen Forward Email-service is hiervan een voorbeeld.

### Sindre Sorhus: Mastermind hulpprogrammapakket {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) is een van de meest productieve open-sourcebijdragers in het JavaScript-ecosysteem, met meer dan 1000 npm-pakketten op zijn naam. Zijn utilities zoals [p-kaart](https://github.com/sindresorhus/p-map), [opnieuw proberen](https://github.com/sindresorhus/p-retry) en [is-stream](https://github.com/sindresorhus/is-stream) zijn fundamentele bouwstenen die in het hele Node.js-ecosysteem worden gebruikt.

Door het werk van Sindre te sponsoren, dragen we bij aan de ontwikkeling van deze cruciale hulpprogramma's die de ontwikkeling van JavaScript efficiënter en betrouwbaarder maken.

Deze sponsorschappen weerspiegelen onze toewijding aan het bredere open source-ecosysteem. We erkennen dat ons eigen succes is gebaseerd op de basis die door deze en andere bijdragers is gelegd, en we zetten ons in om de duurzaamheid van het gehele ecosysteem te waarborgen.

## Beveiligingsproblemen in het JavaScript-ecosysteem ontdekken {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Onze toewijding aan open source gaat verder dan alleen de ontwikkeling van functies en omvat ook het identificeren en aanpakken van beveiligingskwetsbaarheden die miljoenen ontwikkelaars kunnen treffen. Een aantal van onze belangrijkste bijdragen aan het JavaScript-ecosysteem liggen op het gebied van beveiliging.

### De Koa-Router Redding {#the-koa-router-rescue}

In februari 2019 ontdekte Nick een kritiek probleem met het onderhoud van het populaire koa-router-pakket. Als [gerapporteerd op Hacker News](https://news.ycombinator.com/item?id=19156707) was het pakket door de oorspronkelijke beheerder in de steek gelaten, waardoor beveiligingsproblemen niet werden aangepakt en de community geen updates kreeg.

> \[!WARNING]
> Verlaten pakketten met beveiligingsproblemen vormen een aanzienlijk risico voor het hele ecosysteem, vooral wanneer ze miljoenen keren per week worden gedownload.

Nick reageerde hierop door [@koa/router](https://github.com/koajs/router) te creëren en de community te waarschuwen voor de situatie. Hij onderhoudt dit kritieke pakket sindsdien en zorgt ervoor dat Koa-gebruikers een veilige, goed onderhouden routeringsoplossing hebben.

### ReDoS-kwetsbaarheden aanpakken {#addressing-redos-vulnerabilities}

In 2020 identificeerde en verhielp Nick een kritieke [Reguliere expressie Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-kwetsbaarheid in het veelgebruikte `url-regex`-pakket. Deze kwetsbaarheid ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kon aanvallers in staat stellen een denial-of-service te veroorzaken door speciaal ontworpen invoer te leveren die catastrofale backtracking in de reguliere expressie veroorzaakte.

In plaats van simpelweg het bestaande pakket te patchen, creëerde Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), een volledig herschreven implementatie die de kwetsbaarheid aanpakt en tegelijkertijd compatibel blijft met de oorspronkelijke API. Hij publiceerde ook een [uitgebreide blogpost](/blog/docs/url-regex-javascript-node-js)-bestand waarin de kwetsbaarheid werd uitgelegd en hoe deze kon worden verholpen.

Dit werk illustreert onze aanpak van beveiliging: we lossen niet alleen problemen op, maar we informeren de community en bieden robuuste alternatieven waarmee we soortgelijke problemen in de toekomst kunnen voorkomen.

### Pleit voor Node.js en Chromium-beveiliging {#advocating-for-nodejs-and-chromium-security}

Nick heeft zich ook actief ingezet voor beveiligingsverbeteringen in het bredere ecosysteem. In augustus 2020 identificeerde hij een significant beveiligingsprobleem in Node.js met betrekking tot de verwerking van HTTP-headers, wat werd gemeld in [Het register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Dit probleem, dat voortkwam uit een patch in Chromium, zou aanvallers in staat kunnen stellen beveiligingsmaatregelen te omzeilen. Nicks inzet zorgde ervoor dat het probleem snel werd opgelost en miljoenen Node.js-applicaties werden beschermd tegen mogelijke misbruik.

### NPM-infrastructuur beveiligen {#securing-npm-infrastructure}

Later diezelfde maand ontdekte Nick nog een kritiek beveiligingsprobleem, ditmaal in de e-mailinfrastructuur van npm. Zoals gemeld in [Het register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), implementeerde npm de DMARC-, SPF- en DKIM-e-mailauthenticatieprotocollen niet correct, waardoor aanvallers mogelijk phishingmails konden versturen die afkomstig leken te zijn van npm.

Het rapport van Nick leidde tot verbeteringen in de e-mailbeveiliging van npm, waardoor de miljoenen ontwikkelaars die op npm vertrouwen voor pakketbeheer, worden beschermd tegen potentiële phishingaanvallen.

## Onze bijdragen aan het Forward Email Ecosystem {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email is gebouwd op basis van diverse belangrijke open-sourceprojecten, waaronder Nodemailer, WildDuck en mailauth. Ons team heeft belangrijke bijdragen geleverd aan deze projecten en heeft geholpen bij het identificeren en oplossen van diepgaande problemen die van invloed zijn op de bezorging en beveiliging van e-mail.

### Verbetering van de kernfunctionaliteit van Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) vormt de ruggengraat van e-mailverzending in Node.js en onze bijdragen hebben geholpen om het robuuster te maken:

* **Verbeteringen aan de SMTP-server**: We hebben parsingbugs, problemen met de verwerking van streams en problemen met de TLS-configuratie in de SMTP-servercomponent opgelost\[^16]\[^17].
* **Verbeteringen aan de mailparser**: We hebben fouten in de decodering van tekenreeksen verholpen en parserproblemen opgelost die tot fouten in de e-mailverwerking konden leiden\[^18]\[^19].

Deze bijdragen zorgen ervoor dat Nodemailer een betrouwbare basis blijft voor e-mailverwerking in Node.js-applicaties, waaronder Forward Email.

### E-mailauthenticatie verbeteren met Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) biedt essentiële functionaliteit voor e-mailauthenticatie en onze bijdragen hebben de mogelijkheden ervan aanzienlijk verbeterd:

* **Verbeteringen in DKIM-verificatie**: We hebben ontdekt en gemeld dat X/Twitter problemen had met de DNS-cache, waardoor DKIM-fouten voor hun uitgaande berichten konden optreden. We hebben dit gemeld op Hacker One\[^20].
* **Verbeteringen in DMARC en ARC**: We hebben problemen met DMARC- en ARC-verificatie opgelost die tot onjuiste authenticatieresultaten konden leiden\[^21]\[^22].
* **Prestatieoptimalisaties**: We hebben optimalisaties bijgedragen die de prestaties van e-mailauthenticatieprocessen verbeteren\[^23]\[^24]\[^25]\[^26].

Dankzij deze verbeteringen is de nauwkeurigheid en betrouwbaarheid van e-mailverificatie gewaarborgd en worden gebruikers beschermd tegen phishing- en spoofingaanvallen.

### Verbeteringen in de belangrijkste upptime {#key-upptime-enhancements}

Onze bijdragen aan Upptime omvatten:

* **SSL-certificaatbewaking**: We hebben functionaliteit toegevoegd om de vervaldatum van SSL-certificaten te bewaken, waardoor onverwachte downtime als gevolg van verlopen certificaten wordt voorkomen\[^27].
* **Ondersteuning voor meerdere sms-nummers**: We hebben ondersteuning geïmplementeerd voor het waarschuwen van meerdere teamleden via sms bij incidenten, waardoor de responstijden zijn verbeterd\[^28].
* **Oplossingen voor IPv6-controle**: We hebben problemen met IPv6-connectiviteitscontroles opgelost, waardoor nauwkeurigere monitoring in moderne netwerkomgevingen wordt gegarandeerd\[^29].
* **Ondersteuning voor donkere/lichte modus**: We hebben themaondersteuning toegevoegd om de gebruikerservaring van statuspagina's te verbeteren\[^31].
* **Betere TCP-ping-ondersteuning**: We hebben de TCP-ping-functionaliteit verbeterd voor betrouwbaardere verbindingstests\[^32].

Deze verbeteringen komen niet alleen de statusbewaking van Forward Email ten goede, maar zijn beschikbaar voor de gehele community van Upptime-gebruikers. Dit toont aan dat wij ons inzetten om de tools waar we op vertrouwen, te verbeteren.

## De lijm die alles bij elkaar houdt: aangepaste code op schaal {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Hoewel onze npm-pakketten en bijdragen aan bestaande projecten aanzienlijk zijn, is het de aangepaste code die deze componenten integreert die onze technische expertise echt laat zien. De codebase van Forward Email is het resultaat van tien jaar ontwikkeling, daterend uit 2017 toen het project begon als [gratis-e-mail-doorsturen](https://github.com/forwardemail/free-email-forwarding) en vervolgens werd samengevoegd tot een monorepo.

### Een enorme ontwikkelingsinspanning {#a-massive-development-effort}

De omvang van deze aangepaste integratiecode is indrukwekkend:

* **Totale bijdragen**: Meer dan 3.217 commits
* **Codebasegrootte**: Meer dan 421.545 regels code verspreid over JavaScript-, Pug-, CSS- en JSON-bestanden\[^33]

Dit vertegenwoordigt duizenden uren aan ontwikkelwerk, debugsessies en prestatieoptimalisaties. Het is de "geheime saus" die individuele pakketten transformeert tot een samenhangende, betrouwbare service die dagelijks door duizenden klanten wordt gebruikt.

### Integratie van kernafhankelijkheden {#core-dependencies-integration}

De codebase van Forward Email integreert talloze afhankelijkheden tot een naadloos geheel:

* **E-mailverwerking**: Integreert Nodemailer voor verzending, SMTP-server voor ontvangst en Mailparser voor parsing
* **Authenticatie**: Gebruikt Mailauth voor DKIM-, SPF-, DMARC- en ARC-verificatie
* **DNS-resolutie**: Maakt gebruik van Tangerine voor DNS-over-HTTPS met wereldwijde caching
* **MX-verbinding**: Maakt gebruik van MX-Connect met Tangerine-integratie voor betrouwbare mailserververbindingen
* **Taakplanning**: Maakt gebruik van Bree voor betrouwbare verwerking van achtergrondtaken met werkthreads
* **Templating**: Maakt gebruik van e-mailsjablonen om stijlbladen van de website te hergebruiken in klantcommunicatie
* **E-mailopslag**: Implementeert individueel versleutelde SQLite-mailboxen met behulp van Better-Sqlite3-multiple-ciphers met ChaCha20-Poly1305-versleuteling voor kwantumveilige privacy, waardoor volledige isolatie tussen gebruikers wordt gegarandeerd en alleen de gebruiker toegang heeft tot zijn of haar mailbox

Elk van deze integraties vereist zorgvuldige aandacht voor randgevallen, prestatie-implicaties en beveiligingsproblemen. Het resultaat is een robuust systeem dat miljoenen e-mailtransacties betrouwbaar verwerkt. Onze SQLite-implementatie maakt ook gebruik van msgpackr voor efficiënte binaire serialisatie en WebSockets (via ws) voor realtime statusupdates in onze infrastructuur.

### DNS-infrastructuur met Tangerine en mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Een cruciaal onderdeel van de infrastructuur van Forward Email is ons DNS-resolutiesysteem, dat is opgebouwd rond twee belangrijke pakketten:

* **[Mandarijn](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Onze Node.js DNS-over-HTTPS-implementatie biedt een direct te gebruiken vervanging voor de standaard DNS-resolver, met ingebouwde nieuwe pogingen, time-outs, slimme serverrotatie en caching-ondersteuning.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Dit pakket brengt TCP-verbindingen tot stand met MX-servers, waarbij een doeldomein of e-mailadres wordt gebruikt, de juiste MX-servers worden opgelost en er in prioriteitsvolgorde verbinding mee wordt gemaakt.

We hebben Tangerine geïntegreerd met mx-connect via [pull-request #4](https://github.com/zone-eu/mx-connect/pull/4), die DNS-verzoeken op applicatielaag over HTTP-verzoeken in Forward Email garandeert. Dit biedt wereldwijde caching voor DNS op schaal met 1:1-consistentie in elke regio, app of proces – cruciaal voor betrouwbare e-mailbezorging in een gedistribueerd systeem.

## Impact op bedrijven: van open source naar bedrijfskritische oplossingen {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Het hoogtepunt van onze decennialange reis in open source-ontwikkeling heeft Forward Email in staat gesteld om niet alleen individuele ontwikkelaars te bedienen, maar ook grote ondernemingen en onderwijsinstellingen die de ruggengraat vormen van de open source-beweging zelf.

### Casestudies in bedrijfskritische e-mailinfrastructuur {#case-studies-in-mission-critical-email-infrastructure}

Onze toewijding aan betrouwbaarheid, privacy en open source-principes heeft Forward Email tot de vertrouwde keuze gemaakt voor organisaties met veeleisende e-mailvereisten:

* **Onderwijsinstellingen**: Zoals beschreven in onze [casestudy over het doorsturen van e-mails door alumni]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study). Grote universiteiten vertrouwen op onze infrastructuur om levenslange verbindingen te onderhouden met honderdduizenden alumni via betrouwbare e-maildoorstuurservices.

* **Enterprise Linux Solutions**: [Canonical Ubuntu e-mail zakelijke casestudy](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) laat zien hoe onze open source-aanpak perfect aansluit bij de behoeften van enterprise Linux-providers, en hen de transparantie en controle biedt die ze nodig hebben.

* **Open Source Foundations**: Misschien wel het meest validerend is onze samenwerking met de Linux Foundation, zoals vastgelegd in [Casestudy over e-mail in bedrijven met Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), waarbij onze service de communicatie mogelijk maakt voor de organisatie die de Linux-ontwikkeling beheert.

Er zit een prachtige symmetrie in hoe onze opensourcepakketten, die we jarenlang met zorg hebben onderhouden, ons in staat hebben gesteld een e-mailservice te bouwen die nu precies de communities en organisaties ondersteunt die opensourcesoftware promoten. Deze complete reis – van het leveren van individuele pakketten tot het aansturen van e-mailinfrastructuur van ondernemingsniveau voor opensourceleiders – vormt de ultieme bevestiging van onze aanpak van softwareontwikkeling.

## Een decennium open source: een blik op de toekomst {#a-decade-of-open-source-looking-forward}

Als we terugkijken op tien jaar aan bijdragen aan open source en vooruitkijken naar de komende tien jaar, zijn we dankbaar voor de community die ons werk heeft gesteund en zijn we enthousiast over wat de toekomst brengt.

Onze transformatie van individuele pakketleveranciers naar beheerders van een uitgebreide e-mailinfrastructuur die wordt gebruikt door grote ondernemingen en open-sourcestichtingen is opmerkelijk. Het is een bewijs van de kracht van open-sourceontwikkeling en de impact die doordachte, goed onderhouden software kan hebben op het bredere ecosysteem.

De komende jaren zetten wij ons in voor:

* **We blijven onze bestaande pakketten onderhouden en verbeteren**, zodat ze betrouwbare tools blijven voor ontwikkelaars wereldwijd.
* **Onze bijdragen aan kritieke infrastructuurprojecten uitbreiden**, met name op het gebied van e-mail en beveiliging.
* **De mogelijkheden van Forward Email verbeteren** en tegelijkertijd onze toewijding aan privacy, beveiliging en transparantie behouden.
* **De volgende generatie opensourcebijdragers ondersteunen** door middel van mentorschap, sponsoring en betrokkenheid van de community.

Wij geloven dat de toekomst van softwareontwikkeling open, collaboratief en gebaseerd op een fundament van vertrouwen is. Door hoogwaardige, op beveiliging gerichte pakketten te blijven leveren aan het JavaScript-ecosysteem, hopen we een kleine rol te spelen in de opbouw van die toekomst.

Hartelijk dank aan iedereen die onze pakketten heeft gebruikt, heeft bijgedragen aan onze projecten, problemen heeft gemeld of gewoon ons werk heeft verspreid. Jullie steun heeft dit decennium van impact mogelijk gemaakt en we zijn benieuwd wat we de komende tien jaar samen kunnen bereiken.

\[^1]: npm-downloadstatistieken voor cabin, april 2025
\[^2]: npm-downloadstatistieken voor bson-objectid, februari-maart 2025
\[^3]: npm-downloadstatistieken voor url-regex-safe, april 2025
\[^4]: GitHub-sterrentelling voor forwardemail/forwardemail.net per april 2025
\[^5]: npm-downloadstatistieken voor preview-email, april 2025
\[^7]: npm-downloadstatistieken voor superagent, februari-maart 2025
\[^8]: npm-downloadstatistieken voor supertest, februari-maart 2025
\[^9]: npm-downloadstatistieken voor preview-email, februari-maart 2025
\[^10]: npm-downloadstatistieken voor cabin, februari-maart 2025
\[^11]: npm-downloadstatistieken voor url-regex-safe, februari-maart 2025
\[^12]: npm-downloadstatistieken voor spamscanner, februari-maart 2025
\[^13]: Dagelijkse downloadpatronen van npm-statistieken, april 2025
\[^14]: Wekelijkse downloadpatronen van npm-statistieken, april 2025
\[^15]: npm-downloadstatistieken voor nodemailer, april 2025
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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Gebaseerd op GitHub-problemen in de Upptime-repository
\[^28]: Gebaseerd op GitHub-problemen in de Upptime-repository
\[^29]: Gebaseerd op GitHub-problemen in de Upptime-repository
\[^30]: NPM-downloadstatistieken voor Bree, februari-maart 2025
\[^31]: Gebaseerd op GitHub-pullrequests naar Upptime
\[^32]: Gebaseerd op GitHub-pullrequests naar Upptime
\[^34]: NPM-downloadstatistieken voor Koa, februari-maart 2025
\[^35]: npm-downloadstatistieken voor @koa/router, februari-maart 2025
\[^36]: npm-downloadstatistieken voor koa-router, februari-maart 2025
\[^37]: npm-downloadstatistieken voor url-regex, februari-maart 2025
\[^38]: npm-downloadstatistieken voor @breejs/later, februari-maart 2025
\[^39]: npm-downloadstatistieken voor e-mailsjablonen, februari-maart 2025
\[^40]: npm-downloadstatistieken voor get-paths, februari-maart 2025
\[^41]: npm-downloadstatistieken voor dotenv-parse-variables, februari-maart 2025
\[^42]: npm-downloadstatistieken voor @koa/multer, februari-maart 2025