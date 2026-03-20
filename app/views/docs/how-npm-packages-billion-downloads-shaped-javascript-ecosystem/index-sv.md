# Ett decennium av påverkan: Hur våra npm-paket nådde 1 miljard nedladdningar och formade JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Pionjärerna som litar på oss: Isaac Z. Schlueter och Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Från npm:s skapelse till Node.js-ledarskap](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bakom koden: Nick Baughs resa](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express tekniska kommitté och kärnbidrag](#express-technical-committee-and-core-contributions)
  * [Bidrag till Koa-ramverket](#koa-framework-contributions)
  * [Från individuell bidragsgivare till organisationsledare](#from-individual-contributor-to-organization-leader)
* [Våra GitHub-organisationer: Ekosystem av innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturerad loggning för moderna applikationer](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Bekämpa e-postmissbruk](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern schemaläggning av jobb med worker threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Öppen källkod för e-postinfrastruktur](#forward-email-open-source-email-infrastructure)
  * [Lad: Viktiga Koa-verktyg och hjälpmedel](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Öppen källkod för övervakning av drifttid](#upptime-open-source-uptime-monitoring)
* [Våra bidrag till Forward Email-ekosystemet](#our-contributions-to-the-forward-email-ecosystem)
  * [Från paket till produktion](#from-packages-to-production)
  * [Feedback-loopen](#the-feedback-loop)
* [Forward Emails kärnprinciper: En grund för excellens](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Alltid utvecklarvänligt, säkerhetsfokuserat och transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Efterlevnad av beprövade principer för mjukvaruutveckling](#adherence-to-time-tested-software-development-principles)
  * [Riktar sig till den tuffa, egenfinansierade utvecklaren](#targeting-the-scrappy-bootstrapped-developer)
  * [Principer i praktiken: Forward Email-kodbasen](#principles-in-practice-the-forward-email-codebase)
  * [Integritet som standard](#privacy-by-design)
  * [Hållbar öppen källkod](#sustainable-open-source)
* [Siffrorna ljuger inte: Våra häpnadsväckande npm-nedladdningsstatistik](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [En överblick över vår påverkan](#a-birds-eye-view-of-our-impact)
  * [Daglig påverkan i stor skala](#daily-impact-at-scale)
  * [Bortom råa siffror](#beyond-the-raw-numbers)
* [Stöd till ekosystemet: Våra sponsringar av öppen källkod](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionjär inom e-postinfrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mästarhjärnan bakom verktygspaket](#sindre-sorhus-utility-package-mastermind)
* [Avslöjande av säkerhetssårbarheter i JavaScript-ekosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Räddningen av Koa-Router](#the-koa-router-rescue)
  * [Åtgärdande av ReDoS-sårbarheter](#addressing-redos-vulnerabilities)
  * [Förespråka för Node.js och Chromium-säkerhet](#advocating-for-nodejs-and-chromium-security)
  * [Säkra npm-infrastrukturen](#securing-npm-infrastructure)
* [Våra bidrag till Forward Email-ekosystemet](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Förbättra Nodemailers kärnfunktionalitet](#enhancing-nodemailers-core-functionality)
  * [Främja e-postautentisering med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Viktiga förbättringar i Upptime](#key-upptime-enhancements)
* [Kittet som håller ihop allt: Anpassad kod i stor skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv utvecklingsinsats](#a-massive-development-effort)
  * [Integration av kärnberoenden](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine och mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Företagspåverkan: Från öppen källkod till affärskritiska lösningar](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Fallstudier inom affärskritisk e-postinfrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Ett decennium av öppen källkod: Framåtblickande](#a-decade-of-open-source-looking-forward)
## Förord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript)- och [Node.js](https://en.wikipedia.org/wiki/Node.js)-världen är vissa paket oumbärliga—nedladdade miljontals gånger dagligen och driver appar världen över. Bakom dessa verktyg finns utvecklare som fokuserar på öppen källkods kvalitet. Idag visar vi hur vårt team hjälper till att bygga och underhålla npm-paket som har blivit nyckeldelar i JavaScript-ekosystemet.


## Pionjärerna som litar på oss: Isaac Z. Schlueter och Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi är stolta över att ha [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som användare. Isaac skapade [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) och hjälpte till att bygga [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans förtroende för Forward Email visar vårt fokus på kvalitet och säkerhet. Isaac använder Forward Email för flera domäner inklusive izs.me.

Isaacs påverkan på JavaScript är enorm. År 2009 var han bland de första att se Node.js potential, och arbetade med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skapade plattformen. Som Isaac sade i en [intervju med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Mitt i denna mycket lilla gemenskap av en grupp människor som försökte lista ut hur man skulle få server-side JS att fungera, kom Ryan Dahl ut med Node, vilket var helt klart rätt tillvägagångssätt. Jag satsade på det och blev mycket involverad ungefär i mitten av 2009."

> \[!NOTE]
> För de som är intresserade av Node.js historia finns utmärkta dokumentärer som skildrar dess utveckling, inklusive [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) och [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [personliga webbplats](https://tinyclouds.org/) innehåller också värdefulla insikter om hans arbete.

### Från npm:s skapelse till ledarskap för Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac skapade npm i september 2009, med den första användbara versionen släppt i början av 2010. Denna paketchef fyllde ett viktigt behov i Node.js, genom att låta utvecklare enkelt dela och återanvända kod. Enligt [Node.js Wikipedia-sidan](https://en.wikipedia.org/wiki/Node.js): "I januari 2010 introducerades en paketchef för Node.js-miljön kallad npm. Paketchefen tillåter programmerare att publicera och dela Node.js-paket, tillsammans med tillhörande källkod, och är utformad för att förenkla installation, uppdatering och avinstallation av paket."

När Ryan Dahl drog sig tillbaka från Node.js i januari 2012 tog Isaac över som projektledare. Som noterat på [hans CV](https://izs.me/resume), "Ledde utvecklingen av flera grundläggande Node.js core-API:er, inklusive CommonJS-modulsystem, filsystem-API:er och streams" och "Fungerade som BDFL (Benevolent Dictator For Life) för projektet i 2 år, vilket säkerställde ständigt ökande kvalitet och en pålitlig byggprocess för Node.js-versionerna v0.6 till v0.10."

Isaac ledde Node.js genom en viktig tillväxtperiod och satte standarder som fortfarande formar plattformen idag. Han startade senare npm, Inc. 2014 för att stödja npm-registret, som han tidigare hade drivit på egen hand.

Vi tackar Isaac för hans enorma bidrag till JavaScript och fortsätter att använda många paket han skapade. Hans arbete har förändrat hur vi bygger mjukvara och hur miljontals utvecklare delar kod världen över.


## Arkitekten bakom koden: Nick Baughs resa {#the-architect-behind-the-code-nick-baughs-journey}

I hjärtat av vår framgång inom öppen källkod finns Nick Baugh, Forward Emails grundare och ägare. Hans arbete inom JavaScript sträcker sig över nästan 20 år och har format hur otaliga utvecklare bygger appar. Hans resa inom öppen källkod visar både teknisk skicklighet och ledarskap i gemenskapen.

### Express tekniska kommitté och kärnbidrag {#express-technical-committee-and-core-contributions}

Nicks expertis inom webbframework gav honom en plats i [Express tekniska kommitté](https://expressjs.com/en/resources/community.html), där han hjälpte till med ett av de mest använda Node.js-frameworksen. Nick är nu listad som inaktiv medlem på [Express community-sidan](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express skapades ursprungligen av TJ Holowaychuk, en produktiv open source-bidragsgivare som har format mycket av Node.js-ekosystemet. Vi är tacksamma för TJs grundläggande arbete och respekterar hans [beslut att ta en paus](https://news.ycombinator.com/item?id=37687017) från hans omfattande open source-bidrag.

Som medlem i [Express Technical Committee](https://expressjs.com/en/resources/community.html) visade Nick stor noggrannhet i frågor som att förtydliga dokumentationen för `req.originalUrl` och åtgärda problem med multipart-formulärshantering.

### Koa Framework Contributions {#koa-framework-contributions}

Nicks arbete med [Koa framework](https://github.com/koajs/koa)—ett modernt, lättare alternativ till Express som också skapades av TJ Holowaychuk—visar ytterligare hans engagemang för bättre verktyg för webbutveckling. Hans Koa-bidrag inkluderar både ärenden och kod via pull requests, där han hanterar felhantering, innehållstypshantering och förbättringar av dokumentationen.

Hans arbete både med Express och Koa ger honom en unik insikt i Node.js webbutveckling, vilket hjälper vårt team att skapa paket som fungerar bra med flera ramverks-ekosystem.

### From Individual Contributor to Organization Leader {#from-individual-contributor-to-organization-leader}

Det som började som hjälp till befintliga projekt växte till att skapa och underhålla hela paket-ekosystem. Nick grundade flera GitHub-organisationer—inklusive [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) och [Bree](https://github.com/breejs)—var och en löser specifika behov i JavaScript-communityn.

Denna övergång från bidragsgivare till ledare visar Nicks vision för välutformad mjukvara som löser verkliga problem. Genom att organisera relaterade paket under fokuserade GitHub-organisationer har han byggt verktygsekosystem som fungerar tillsammans samtidigt som de förblir modulära och flexibla för den bredare utvecklargemenskapen.


## Our GitHub Organizations: Ecosystems of Innovation {#our-github-organizations-ecosystems-of-innovation}

Vi organiserar vårt open source-arbete kring fokuserade GitHub-organisationer, var och en löser specifika behov inom JavaScript. Denna struktur skapar sammanhängande paketfamiljer som fungerar bra tillsammans samtidigt som de förblir modulära.

### Cabin: Structured Logging for Modern Applications {#cabin-structured-logging-for-modern-applications}

[Cabin-organisationen](https://github.com/cabinjs) är vår syn på enkel, kraftfull app-logging. Huvudpaketet [`cabin`](https://github.com/cabinjs/cabin) har nästan 900 GitHub-stjärnor och över 100 000 nedladdningar per vecka\[^1]. Cabin tillhandahåller strukturerad loggning som fungerar med populära tjänster som Sentry, LogDNA och Papertrail.

Det som gör Cabin speciellt är dess genomtänkta API och pluginsystem. Stödjande paket som [`axe`](https://github.com/cabinjs/axe) för Express-middleware och [`parse-request`](https://github.com/cabinjs/parse-request) för HTTP-förfrågningsanalys visar vårt engagemang för kompletta lösningar snarare än isolerade verktyg.

Paketet [`bson-objectid`](https://github.com/cabinjs/bson-objectid) förtjänar särskilt omnämnande, med över 1,7 miljoner nedladdningar på bara två månader\[^2]. Denna lätta MongoDB ObjectID-implementation har blivit det självklara valet för utvecklare som behöver ID:n utan fullständiga MongoDB-beroenden.

### Spam Scanner: Fighting Email Abuse {#spam-scanner-fighting-email-abuse}

[Spam Scanner-organisationen](https://github.com/spamscanner) visar vårt engagemang för att lösa verkliga problem. Huvudpaketet [`spamscanner`](https://github.com/spamscanner/spamscanner) tillhandahåller avancerad e-postspamdetektion, men det är paketet [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) som har fått en fantastisk spridning.

Med över 1,2 miljoner nedladdningar på två månader\[^3] åtgärdar `url-regex-safe` kritiska säkerhetsproblem i andra reguljära uttryck för URL-detektion. Detta paket visar vår inställning till open source: att hitta ett vanligt problem (i detta fall [ReDoS](https://en.wikipedia.org/wiki/ReDoS)-sårbarheter i URL-validering), skapa en stabil lösning och underhålla den noggrant.
### Bree: Modern Job Scheduling with Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

[Organisationen Bree](https://github.com/breejs) är vårt svar på en vanlig utmaning i Node.js: pålitlig schemaläggning av jobb. Huvudpaketet [`bree`](https://github.com/breejs/bree), med över 3 100 GitHub-stjärnor, erbjuder en modern jobbschemaläggare som använder Node.js worker threads för bättre prestanda och tillförlitlighet.

> \[!NOTE]
> Bree skapades efter att vi hjälpte till att underhålla [Agenda](https://github.com/agenda/agenda), där vi tillämpade lärdomar för att bygga en bättre jobbschemaläggare. Våra bidrag till Agenda hjälpte oss att hitta sätt att förbättra jobbschemaläggning.

Vad som gör Bree annorlunda jämfört med andra schemaläggare som Agenda:

* **Inga externa beroenden**: Till skillnad från Agenda som kräver MongoDB, behöver Bree varken Redis eller MongoDB för att hantera jobbstatus.
* **Worker Threads**: Bree använder Node.js worker threads för sandboxade processer, vilket ger bättre isolering och prestanda.
* **Enkel API**: Bree erbjuder detaljerad kontroll med enkelhet, vilket gör det lättare att implementera komplexa schemaläggningsbehov.
* **Inbyggt stöd**: Funktioner som smidig omladdning, cron-jobb, datum och användarvänliga tider ingår som standard.

Bree är en nyckelkomponent i [forwardemail.net](https://github.com/forwardemail/forwardemail.net), där den hanterar kritiska bakgrundsuppgifter som e-posthantering, städning och schemalagd underhåll. Att använda Bree i Forward Email visar vårt engagemang för att använda våra egna verktyg i produktion och säkerställa att de uppfyller höga tillförlitlighetskrav.

Vi använder och uppskattar också andra utmärkta paket för worker threads som [piscina](https://github.com/piscinajs/piscina) och HTTP-klienter som [undici](https://github.com/nodejs/undici). Piscina, likt Bree, använder Node.js worker threads för effektiv uppgiftshantering. Vi tackar [Matteo Collina](https://github.com/mcollina), som underhåller både undici och piscina, för hans stora bidrag till Node.js. Matteo sitter i Node.js Technical Steering Committee och har förbättrat HTTP-klientfunktionerna i Node.js avsevärt.

### Forward Email: Open Source Email Infrastructure {#forward-email-open-source-email-infrastructure}

Vårt mest ambitiösa projekt är [Forward Email](https://github.com/forwardemail), en öppen källkod e-posttjänst som erbjuder e-postvidarebefordran, lagring och API-tjänster. Huvudförvaret har över 1 100 GitHub-stjärnor\[^4], vilket visar uppskattning från communityn för detta alternativ till proprietära e-posttjänster.

Paketet [`preview-email`](https://github.com/forwardemail/preview-email) från denna organisation, med över 2,5 miljoner nedladdningar på två månader\[^5], har blivit ett oumbärligt verktyg för utvecklare som arbetar med e-postmallar. Genom att erbjuda ett enkelt sätt att förhandsgranska e-post under utveckling löser det en vanlig smärta vid byggandet av e-postaktiverade applikationer.

### Lad: Essential Koa Utilities and Tools {#lad-essential-koa-utilities-and-tools}

[Lad-organisationen](https://github.com/ladjs) tillhandahåller en samling viktiga verktyg och hjälpmedel med fokus på att förbättra Koa-ramverkets ekosystem. Dessa paket löser vanliga utmaningar inom webbutveckling och är designade för att fungera sömlöst tillsammans samtidigt som de är användbara var för sig.

#### koa-better-error-handler: Improved Error Handling for Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) erbjuder en förbättrad felhanteringslösning för Koa-applikationer. Med över 50 GitHub-stjärnor gör detta paket att `ctx.throw` genererar användarvänliga felmeddelanden samtidigt som flera begränsningar i Koas inbyggda felhanterare åtgärdas:

* Upptäcker och hanterar korrekt Node.js DNS-fel, Mongoose-fel och Redis-fel
* Använder [Boom](https://github.com/hapijs/boom) för att skapa konsekventa, välformaterade felresponser
* Bevarar headers (till skillnad från Koas inbyggda hanterare)
* Behåller lämpliga statuskoder istället för att som standard använda 500
* Stöder flash-meddelanden och sessionsbevarande
* Tillhandahåller HTML-fellistor för valideringsfel
* Stöder flera responstyper (HTML, JSON och ren text)
Detta paket är särskilt värdefullt när det används tillsammans med [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) för omfattande felhantering i Koa-applikationer.

#### passport: Autentisering för Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) utökar det populära Passport.js-autentiseringsmiddleware med specifika förbättringar för moderna webbapplikationer. Detta paket stöder flera autentiseringsstrategier direkt ur lådan:

* Lokal autentisering med e-post
* Logga in med Apple
* GitHub-autentisering
* Google-autentisering
* Engångslösenord (OTP) autentisering

Paketet är mycket anpassningsbart och tillåter utvecklare att justera fältnamn och fraser för att matcha deras applikations krav. Det är designat för att integreras sömlöst med Mongoose för användarhantering, vilket gör det till en idealisk lösning för Koa-baserade applikationer som behöver robust autentisering.

#### graceful: Elegant applikationsavstängning {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) löser den kritiska utmaningen att stänga ner Node.js-applikationer på ett elegant sätt. Med över 70 GitHub-stjärnor säkerställer detta paket att din applikation kan avslutas rent utan att förlora data eller lämna anslutningar hängande. Viktiga funktioner inkluderar:

* Stöd för att stänga HTTP-servrar (Express/Koa/Fastify) på ett elegant sätt
* Ren avstängning av databasanslutningar (MongoDB/Mongoose)
* Korrekt stängning av Redis-klienter
* Hantering av Bree-jobbschemaläggare
* Stöd för anpassade avstängningshanterare
* Konfigurerbara timeout-inställningar
* Integration med loggningssystem

Detta paket är avgörande för produktionsapplikationer där oväntade avstängningar kan leda till dataförlust eller korruption. Genom att implementera korrekta avstängningsprocedurer hjälper `@ladjs/graceful` till att säkerställa applikationens tillförlitlighet och stabilitet.

### Upptime: Öppen källkod för övervakning av drifttid {#upptime-open-source-uptime-monitoring}

[Upptime-organisationen](https://github.com/upptime) representerar vårt engagemang för transparent, öppen källkod-övervakning. Det huvudsakliga [`upptime`](https://github.com/upptime/upptime)-arkivet har över 13 000 GitHub-stjärnor, vilket gör det till ett av de mest populära projekten vi bidrar till. Upptime tillhandahåller en GitHub-driven drifttidsövervakare och status-sida som fungerar helt utan en server.

Vi använder Upptime för vår egen status-sida på <https://status.forwardemail.net> med källkoden tillgänglig på <https://github.com/forwardemail/status.forwardemail.net>.

Det som gör Upptime speciellt är dess arkitektur:

* **100% Öppen källkod**: Varje komponent är helt öppen källkod och anpassningsbar.
* **Drivs av GitHub**: Utnyttjar GitHub Actions, Issues och Pages för en serverlös övervakningslösning.
* **Ingen server krävs**: Till skillnad från traditionella övervakningsverktyg kräver Upptime inte att du kör eller underhåller en server.
* **Automatisk status-sida**: Genererar en vacker status-sida som kan hostas på GitHub Pages.
* **Kraftfulla notifikationer**: Integreras med olika notifikationskanaler inklusive e-post, SMS och Slack.

För att förbättra våra användares upplevelse har vi integrerat [@octokit/core](https://github.com/octokit/core.js/) i forwardemail.net-kodbasen för att visa realtidsstatusuppdateringar och incidenter direkt på vår webbplats. Denna integration ger tydlig transparens till våra användare vid eventuella problem i hela vår stack (Webbplats, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) med omedelbara toast-notiser, ändringar av badge-ikoner, varningsfärger och mer.

@octokit/core-biblioteket gör det möjligt för oss att hämta realtidsdata från vårt Upptime GitHub-arkiv, bearbeta det och visa det på ett användarvänligt sätt. När någon tjänst har ett avbrott eller försämrad prestanda meddelas användarna omedelbart genom visuella indikatorer utan att behöva lämna huvudapplikationen. Denna sömlösa integration säkerställer att våra användare alltid har uppdaterad information om vårt systemstatus, vilket ökar transparensen och förtroendet.

Upptime har antagits av hundratals organisationer som söker ett transparent, pålitligt sätt att övervaka sina tjänster och kommunicera status till användare. Projektets framgång visar kraften i att bygga verktyg som utnyttjar befintlig infrastruktur (i detta fall GitHub) för att lösa vanliga problem på nya sätt.
## Våra bidrag till Forward Email-ekosystemet {#our-contributions-to-the-forward-email-ecosystem}

Medan våra open source-paket används av utvecklare världen över, utgör de också grunden för vår egen Forward Email-tjänst. Denna dubbla roll—som både skapare och användare av dessa verktyg—ger oss ett unikt perspektiv på deras verkliga användning och driver kontinuerlig förbättring.

### Från paket till produktion {#from-packages-to-production}

Resan från individuella paket till ett sammanhängande produktsystem innebär noggrann integration och utbyggnad. För Forward Email inkluderar denna process:

* **Anpassade tillägg**: Bygga Forward Email-specifika tillägg till våra open source-paket som adresserar våra unika krav.
* **Integrationsmönster**: Utveckla mönster för hur dessa paket samverkar i en produktionsmiljö.
* **Prestandaoptimeringar**: Identifiera och åtgärda prestandaflaskhalsar som endast uppstår i stor skala.
* **Säkerhetshärdning**: Lägga till ytterligare säkerhetslager specifikt för e-posthantering och skydd av användardata.

Detta arbete representerar tusentals utvecklingstimmar utöver kärnpaketen själva, vilket resulterar i en robust, säker e-posttjänst som utnyttjar det bästa av våra open source-bidrag.

### Feedback-loopen {#the-feedback-loop}

Kanske är den mest värdefulla aspekten av att använda våra egna paket i produktion den feedback-loop som skapas. När vi stöter på begränsningar eller kantfall i Forward Email, patchar vi dem inte bara lokalt—vi förbättrar de underliggande paketen, vilket gynnar både vår tjänst och det bredare samhället.

Denna metod har lett till många förbättringar:

* **Brees smidiga nedstängning**: Forward Emails behov av noll-nedtid vid driftsättning ledde till förbättrade möjligheter för smidig nedstängning i Bree.
* **Spam Scanners mönsterigenkänning**: Verkliga spam-mönster som påträffats i Forward Email har informerat Spam Scanners detektionsalgoritmer.
* **Cabins prestandaoptimeringar**: Högvolymsloggning i produktion avslöjade optimeringsmöjligheter i Cabin som gynnar alla användare.

Genom att upprätthålla denna positiva cykel mellan vårt open source-arbete och produktionstjänsten säkerställer vi att våra paket förblir praktiska, stridstestade lösningar snarare än teoretiska implementationer.


## Forward Emails kärnprinciper: En grund för excellens {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email är designat enligt en uppsättning kärnprinciper som styr alla våra utvecklingsbeslut. Dessa principer, detaljerade på vår [webbplats](/blog/docs/best-quantum-safe-encrypted-email-service#principles), säkerställer att vår tjänst förblir utvecklarvänlig, säker och fokuserad på användarens integritet.

### Alltid utvecklarvänlig, säkerhetsfokuserad och transparent {#always-developer-friendly-security-focused-and-transparent}

Vår första och främsta princip är att skapa mjukvara som är utvecklarvänlig samtidigt som den upprätthåller högsta standarder för säkerhet och integritet. Vi tror att teknisk excellens aldrig ska ske på bekostnad av användbarhet, och att transparens bygger förtroende med vår community.

Denna princip syns i vår detaljerade dokumentation, tydliga felmeddelanden och öppna kommunikation om både framgångar och utmaningar. Genom att göra hela vår kodbas open source bjuder vi in till granskning och samarbete, vilket stärker både vår mjukvara och det bredare ekosystemet.

### Efterlevnad av beprövade principer för mjukvaruutveckling {#adherence-to-time-tested-software-development-principles}

Vi följer flera etablerade principer för mjukvaruutveckling som bevisat sitt värde under årtionden:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separera ansvar genom Model-View-Controller-mönstret
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: Skapa modulära komponenter som gör en sak väl
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Håll det enkelt och rakt på sak
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Upprepa dig inte, främja återanvändning av kod
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du kommer inte att behöva det, undvik för tidig optimering
* **[Twelve Factor](https://12factor.net/)**: Följ bästa praxis för att bygga moderna, skalbara applikationer
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Välj den enklaste lösningen som uppfyller kraven
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Använd våra egna produkter i stor utsträckning
Dessa principer är inte bara teoretiska koncept—de är inbäddade i våra dagliga utvecklingsrutiner. Till exempel är vår efterlevnad av Unix-filosofin tydlig i hur vi har strukturerat våra npm-paket: små, fokuserade moduler som kan kombineras för att lösa komplexa problem.

### Att rikta sig till den kämparglada, självfinansierade utvecklaren {#targeting-the-scrappy-bootstrapped-developer}

Vi riktar oss specifikt till den kämparglada, självfinansierade och [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) utvecklaren. Detta fokus formar allt från vår prismodell till våra tekniska beslut. Vi förstår utmaningarna med att bygga produkter med begränsade resurser eftersom vi själva har varit där.

Denna princip är särskilt viktig i hur vi närmar oss öppen källkod. Vi skapar och underhåller paket som löser verkliga problem för utvecklare utan företagsbudgetar, vilket gör kraftfulla verktyg tillgängliga för alla oavsett deras resurser.

### Principer i praktiken: Forward Email-kodbasen {#principles-in-practice-the-forward-email-codebase}

Dessa principer är tydligt synliga i Forward Email-kodbasen. Vår package.json-fil avslöjar ett genomtänkt urval av beroenden, var och en vald för att stämma överens med våra kärnvärden:

* Säkerhetsfokuserade paket som `mailauth` för e-postautentisering
* Utvecklarvänliga verktyg som `preview-email` för enklare felsökning
* Modulära komponenter som de olika `p-*`-verktygen från Sindre Sorhus

Genom att konsekvent följa dessa principer över tid har vi byggt en tjänst som utvecklare kan lita på med sin e-postinfrastruktur—säker, pålitlig och i linje med värderingarna i öppen källkods-communityn.

### Integritet som standard {#privacy-by-design}

Integritet är inte en eftertanke eller en marknadsföringsfunktion för Forward Email—det är en grundläggande designprincip som genomsyrar varje aspekt av vår tjänst och kod:

* **Nollåtkomstskryptering**: Vi har implementerat system som gör det tekniskt omöjligt för oss att läsa användarnas e-post.
* **Minimal datainsamling**: Vi samlar endast in den data som är nödvändig för att tillhandahålla vår tjänst, inget mer.
* **Transparenta policyer**: Vår integritetspolicy är skriven på klar och begriplig svenska utan juridisk jargong.
* **Öppen källkod-verifiering**: Vår öppna kodbas tillåter säkerhetsforskare att verifiera våra integritetsanspråk.

Detta engagemang sträcker sig till våra öppna källkodspaket, som är designade med säkerhets- och integritetsbästa praxis inbyggda från grunden.

### Hållbar öppen källkod {#sustainable-open-source}

Vi tror att öppen källkod behöver hållbara modeller för att blomstra på lång sikt. Vår strategi inkluderar:

* **Kommersiellt stöd**: Erbjuda premiumstöd och tjänster kring våra öppna källkodsverktyg.
* **Balanserad licensiering**: Använda licenser som skyddar både användarnas friheter och projektets hållbarhet.
* **Community-engagemang**: Aktivt engagera oss med bidragsgivare för att bygga en stödjande community.
* **Transparenta färdplaner**: Dela våra utvecklingsplaner för att låta användare planera därefter.

Genom att fokusera på hållbarhet säkerställer vi att våra bidrag till öppen källkod kan fortsätta växa och förbättras över tid istället för att försummas.


## Siffrorna ljuger inte: Våra häpnadsväckande npm-nedladdningsstatistik {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

När vi talar om effekten av öppen källkod ger nedladdningsstatistik ett påtagligt mått på adoption och förtroende. Många av de paket vi hjälper till att underhålla har nått en skala som få öppna källkodsprojekt någonsin uppnår, med sammanlagda nedladdningar i miljardklassen.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Medan vi är stolta över att hjälpa till att underhålla flera mycket nedladdade paket i JavaScript-ekosystemet vill vi erkänna att många av dessa paket ursprungligen skapades av andra talangfulla utvecklare. Paket som superagent och supertest skapades ursprungligen av TJ Holowaychuk, vars produktiva bidrag till öppen källkod har varit avgörande för att forma Node.js-ekosystemet.
### En översikt över vår påverkan {#a-birds-eye-view-of-our-impact}

Under bara tvåmånadsperioden från februari till mars 2025 registrerade de främsta paketen som vi bidrar till och hjälper till att underhålla häpnadsväckande nedladdningssiffror:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 nedladdningar\[^7] (ursprungligen skapad av TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 nedladdningar\[^8] (ursprungligen skapad av TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28 539 295 nedladdningar\[^34] (ursprungligen skapad av TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 nedladdningar\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 nedladdningar\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 nedladdningar\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2 500 000 nedladdningar\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1 800 000 nedladdningar\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 nedladdningar\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1 128 139 nedladdningar\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1 124 686 nedladdningar\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 nedladdningar\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 nedladdningar\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 nedladdningar\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145 000 nedladdningar\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 nedladdningar\[^30]

> \[!NOTE]
> Flera andra paket som vi hjälper till att underhålla men inte skapade har ännu högre nedladdningsantal, inklusive `form-data` (738M+ nedladdningar), `toidentifier` (309M+ nedladdningar), `stackframe` (116M+ nedladdningar) och `error-stack-parser` (113M+ nedladdningar). Vi är hedrade att bidra till dessa paket samtidigt som vi respekterar arbetet från deras ursprungliga författare.

Det här är inte bara imponerande siffror—de representerar riktiga utvecklare som löser verkliga problem med kod som vi hjälper till att underhålla. Varje nedladdning är ett tillfälle där dessa paket har hjälpt någon att bygga något meningsfullt, från hobbyprojekt till företagsapplikationer som används av miljontals.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Daglig påverkan i stor skala {#daily-impact-at-scale}

De dagliga nedladdningsmönstren visar konsekvent, hög volym användning, med toppar som når miljontals nedladdningar per dag\[^13]. Denna konsekvens vittnar om stabiliteten och tillförlitligheten hos dessa paket—utvecklare provar dem inte bara; de integrerar dem i sina kärnarbetsflöden och förlitar sig på dem dag efter dag.

Veckovisa nedladdningsmönster visar ännu mer imponerande siffror, som konsekvent ligger runt tiotals miljoner nedladdningar per vecka\[^14]. Detta representerar ett enormt fotavtryck i JavaScript-ekosystemet, med dessa paket som körs i produktionsmiljöer över hela världen.

### Bortom de råa siffrorna {#beyond-the-raw-numbers}

Medan nedladdningsstatistiken är imponerande i sig, berättar den en djupare historia om det förtroende som gemenskapen har för dessa paket. Att underhålla paket i denna skala kräver ett orubbligt engagemang för:

* **Bakåtkompatibilitet**: Ändringar måste övervägas noggrant för att undvika att bryta befintliga implementationer.
* **Säkerhet**: Med miljontals applikationer som är beroende av dessa paket kan säkerhetsbrister få långtgående konsekvenser.
* **Prestanda**: I denna skala kan även små prestandaförbättringar ge betydande samlade fördelar.
* **Dokumentation**: Tydlig, omfattande dokumentation är avgörande för paket som används av utvecklare på alla erfarenhetsnivåer.

Den konsekventa tillväxten i nedladdningsantal över tid speglar framgången i att uppfylla dessa åtaganden, och bygger förtroende med utvecklargemenskapen genom pålitliga, välunderhållna paket.
## Stödja Ekosystemet: Våra Open Source-sponsringar {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Hållbarhet inom open source handlar inte bara om att bidra med kod—det handlar också om att stödja utvecklarna som underhåller kritisk infrastruktur.

Utöver våra direkta bidrag till JavaScript-ekosystemet är vi stolta över att sponsra framstående Node.js-bidragsgivare vars arbete utgör grunden för många moderna applikationer. Våra sponsringar inkluderar:

### Andris Reinman: Pionjär inom e-postinfrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) är skaparen av [Nodemailer](https://github.com/nodemailer/nodemailer), det mest populära biblioteket för att skicka e-post i Node.js med över 14 miljoner nedladdningar per vecka\[^15]. Hans arbete sträcker sig till andra kritiska komponenter inom e-postinfrastruktur som [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) och [WildDuck](https://github.com/nodemailer/wildduck).

Vår sponsring hjälper till att säkerställa fortsatt underhåll och utveckling av dessa viktiga verktyg som driver e-postkommunikation för otaliga Node.js-applikationer, inklusive vår egen Forward Email-tjänst.

### Sindre Sorhus: Mästerhjärnan bakom verktygspaket {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) är en av de mest produktiva open source-bidragsgivarna i JavaScript-ekosystemet, med över 1 000 npm-paket under sitt namn. Hans verktyg som [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) och [is-stream](https://github.com/sindresorhus/is-stream) är grundläggande byggstenar som används i hela Node.js-ekosystemet.

Genom att sponsra Sindres arbete hjälper vi till att upprätthålla utvecklingen av dessa kritiska verktyg som gör JavaScript-utveckling mer effektiv och pålitlig.

Dessa sponsringar speglar vårt engagemang för det bredare open source-ekosystemet. Vi inser att vår egen framgång bygger på den grund som dessa och andra bidragsgivare lagt, och vi är dedikerade till att säkerställa hållbarheten för hela ekosystemet.


## Upptäcka Säkerhetssårbarheter i JavaScript-ekosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vårt engagemang för open source sträcker sig bortom funktionsutveckling till att inkludera identifiering och åtgärdande av säkerhetssårbarheter som kan påverka miljontals utvecklare. Flera av våra mest betydande bidrag till JavaScript-ekosystemet har varit inom säkerhetsområdet.

### Räddningen av Koa-Router {#the-koa-router-rescue}

I februari 2019 identifierade Nick ett kritiskt problem med underhållet av det populära koa-router-paketet. Som han [rapporterade på Hacker News](https://news.ycombinator.com/item?id=19156707) hade paketet övergivits av sin ursprungliga underhållare, vilket lämnade säkerhetssårbarheter oadresserade och samhället utan uppdateringar.

> \[!WARNING]
> Övergivna paket med säkerhetssårbarheter utgör betydande risker för hela ekosystemet, särskilt när de laddas ner miljontals gånger varje vecka.

Som svar skapade Nick [@koa/router](https://github.com/koajs/router) och hjälpte till att varna samhället om situationen. Han har underhållit detta kritiska paket sedan dess, vilket säkerställer att Koa-användare har en säker och väl underhållen routningslösning.

### Åtgärda ReDoS-sårbarheter {#addressing-redos-vulnerabilities}

År 2020 identifierade och åtgärdade Nick en kritisk [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-sårbarhet i det mycket använda `url-regex`-paketet. Denna sårbarhet ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kunde tillåta angripare att orsaka tjänsteavbrott genom att tillhandahålla specialtillverkad input som orsakade katastrofal backtracking i reguljära uttrycket.

Istället för att bara patcha det befintliga paketet skapade Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en helt omskriven implementation som åtgärdar sårbarheten samtidigt som den behåller kompatibilitet med det ursprungliga API:et. Han publicerade också ett [omfattande blogginlägg](/blog/docs/url-regex-javascript-node-js) som förklarar sårbarheten och hur man mildrar den.
Detta arbete visar vår syn på säkerhet: inte bara att åtgärda problem utan också att utbilda communityn och erbjuda robusta alternativ som förhindrar liknande problem i framtiden.

### Förespråka för Node.js och Chromium-säkerhet {#advocating-for-nodejs-and-chromium-security}

Nick har också varit aktiv i att förespråka säkerhetsförbättringar i det bredare ekosystemet. I augusti 2020 identifierade han ett betydande säkerhetsproblem i Node.js relaterat till dess hantering av HTTP-headers, vilket rapporterades i [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Detta problem, som härrörde från en patch i Chromium, kunde potentiellt tillåta angripare att kringgå säkerhetsåtgärder. Nicks förespråkande hjälpte till att säkerställa att problemet åtgärdades snabbt, vilket skyddade miljontals Node.js-applikationer från potentiell exploatering.

### Säkerställa npm-infrastrukturen {#securing-npm-infrastructure}

Senare samma månad identifierade Nick ett annat kritiskt säkerhetsproblem, denna gång i npm:s e-postinfrastruktur. Som rapporterats i [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), implementerade npm inte korrekt DMARC, SPF och DKIM e-postautentiseringsprotokoll, vilket potentiellt kunde tillåta angripare att skicka phishing-mejl som såg ut att komma från npm.

Nicks rapport ledde till förbättringar i npm:s e-postsäkerhet, vilket skyddade de miljontals utvecklare som förlitar sig på npm för paketadministration från potentiella phishing-attacker.


## Våra bidrag till Forward Email-ekosystemet {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email är byggt ovanpå flera kritiska open source-projekt, inklusive Nodemailer, WildDuck och mailauth. Vårt team har gjort betydande bidrag till dessa projekt, vilket hjälpt till att identifiera och åtgärda djupa problem som påverkar e-postleverans och säkerhet.

### Förbättra Nodemailers kärnfunktionalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) är ryggraden i e-postutskick i Node.js, och våra bidrag har hjälpt till att göra det mer robust:

* **Förbättringar av SMTP-servern**: Vi har åtgärdat parsningsbuggar, problem med strömhantering och TLS-konfigurationsproblem i SMTP-serverkomponenten\[^16]\[^17].
* **Förbättringar av mailparsern**: Vi har hanterat fel vid avkodning av teckensekvenser och problem med adressparsern som kunde orsaka fel vid e-posthantering\[^18]\[^19].

Dessa bidrag säkerställer att Nodemailer förblir en pålitlig grund för e-posthantering i Node.js-applikationer, inklusive Forward Email.

### Främja e-postautentisering med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tillhandahåller kritisk funktionalitet för e-postautentisering, och våra bidrag har avsevärt förbättrat dess kapabiliteter:

* **Förbättringar av DKIM-verifiering**: Vi upptäckte och rapporterade att X/Twitter hade DNS-cacheproblem som orsakade DKIM-fel för deras utgående meddelanden, vilket rapporterades på Hacker One\[^20].
* **Förbättringar av DMARC och ARC**: Vi har åtgärdat problem med DMARC- och ARC-verifiering som kunde leda till felaktiga autentiseringsresultat\[^21]\[^22].
* **Prestandaoptimeringar**: Vi har bidragit med optimeringar som förbättrar prestandan i e-postautentiseringsprocesserna\[^23]\[^24]\[^25]\[^26].

Dessa förbättringar hjälper till att säkerställa att e-postautentisering är korrekt och pålitlig, vilket skyddar användare från phishing- och spoofing-attacker.

### Viktiga förbättringar i Upptime {#key-upptime-enhancements}

Våra bidrag till Upptime inkluderar:

* **Övervakning av SSL-certifikat**: Vi lade till funktionalitet för att övervaka SSL-certifikatets utgångsdatum, vilket förhindrar oväntad driftstopp på grund av utgångna certifikat\[^27].
* **Stöd för flera SMS-nummer**: Vi implementerade stöd för att varna flera teammedlemmar via SMS när incidenter inträffar, vilket förbättrar svarstider\[^28].
* **Fixar för IPv6-kontroller**: Vi åtgärdade problem med IPv6-anslutningskontroller, vilket säkerställer mer exakt övervakning i moderna nätverksmiljöer\[^29].
* **Stöd för mörkt/ljust läge**: Vi lade till temastöd för att förbättra användarupplevelsen på status-sidor\[^31].
* **Bättre TCP-ping-stöd**: Vi förbättrade TCP-ping-funktionaliteten för att erbjuda mer pålitlig anslutningstestning\[^32].
Dessa förbättringar gynnar inte bara Forward Emails statusövervakning utan är tillgängliga för hela Upptime-gemenskapen, vilket visar vårt engagemang för att förbättra de verktyg vi är beroende av.


## Limmet Som Håller Allt Ihop: Anpassad Kod i Storskalighet {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Medan våra npm-paket och bidrag till befintliga projekt är betydande, är det den anpassade koden som integrerar dessa komponenter som verkligen visar vår tekniska expertis. Forward Email-kodbasen representerar ett decennium av utvecklingsinsatser, med början 2017 när projektet startade som [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) innan det slogs ihop till ett monorepo.

### En Omfattande Utvecklingsinsats {#a-massive-development-effort}

Omfattningen av denna anpassade integrationskod är imponerande:

* **Totala Bidrag**: Över 3 217 commits
* **Kodbasens Storlek**: Över 421 545 kodrader i JavaScript, Pug, CSS och JSON-filer\[^33]

Detta representerar tusentals timmar av utvecklingsarbete, felsökningssessioner och prestandaoptimeringar. Det är den "hemliga ingrediensen" som förvandlar individuella paket till en sammanhållen, pålitlig tjänst som används av tusentals kunder dagligen.

### Integration av Kärnberoenden {#core-dependencies-integration}

Forward Email-kodbasen integrerar många beroenden till en sömlös helhet:

* **E-posthantering**: Integrerar Nodemailer för utskick, SMTP Server för mottagning och Mailparser för tolkning
* **Autentisering**: Använder Mailauth för DKIM, SPF, DMARC och ARC-verifiering
* **DNS-upplösning**: Utnyttjar Tangerine för DNS-over-HTTPS med global caching
* **MX-anslutning**: Använder mx-connect med Tangerine-integration för pålitliga anslutningar till mailservrar
* **Jobbschemaläggning**: Använder Bree för pålitlig bakgrundsprocesshantering med worker threads
* **Mallhantering**: Använder email-templates för att återanvända stilmallar från webbplatsen i kundkommunikationer
* **E-postlagring**: Implementerar individuellt krypterade SQLite-postlådor med better-sqlite3-multiple-ciphers och ChaCha20-Poly1305-kryptering för kvantsäker integritet, vilket säkerställer fullständig isolering mellan användare och att endast användaren har tillgång till sin postlåda

Var och en av dessa integrationer kräver noggrann hänsyn till kantfall, prestandapåverkan och säkerhetsaspekter. Resultatet är ett robust system som hanterar miljontals e-posttransaktioner pålitligt. Vår SQLite-implementation använder också msgpackr för effektiv binär serialisering och WebSockets (via ws) för realtidsstatusuppdateringar över vår infrastruktur.

### DNS-infrastruktur med Tangerine och mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En kritisk komponent i Forward Emails infrastruktur är vårt DNS-upplösningssystem, byggt kring två nyckelpaket:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vår Node.js-implementation av DNS-over-HTTPS erbjuder en drop-in ersättning för standard DNS-resolvern, med inbyggda återförsök, timeout, smart serverrotation och cache-stöd.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Detta paket etablerar TCP-anslutningar till MX-servrar, tar en måldomän eller e-postadress, löser ut lämpliga MX-servrar och ansluter till dem i prioritetsordning.

Vi har integrerat Tangerine med mx-connect genom [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), vilket säkerställer applikationslager-DNS över HTTP-förfrågningar i hela Forward Email. Detta ger global caching för DNS i stor skala med 1:1-konsistens över alla regioner, appar eller processer—avgörande för pålitlig e-postleverans i ett distribuerat system.


## Företagspåverkan: Från Öppen Källkod till Affärskritiska Lösningar {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Klimaxen på vår tioåriga resa inom öppen källkodsutveckling har möjliggjort för Forward Email att betjäna inte bara enskilda utvecklare utan även stora företag och utbildningsinstitutioner som utgör ryggraden i själva öppen källkods-rörelsen.
### Fallstudier i missionkritisk e-postinfrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Vårt engagemang för tillförlitlighet, integritet och principer för öppen källkod har gjort Forward Email till det betrodda valet för organisationer med krävande e-postbehov:

* **Utbildningsinstitutioner**: Som beskrivs i vår [fallstudie om vidarebefordran av alumnie-post](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) förlitar sig stora universitet på vår infrastruktur för att upprätthålla livslånga kontakter med hundratusentals alumner genom pålitliga vidarebefordringstjänster för e-post.

* **Enterprise Linux-lösningar**: [Canonical Ubuntu email enterprise case study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) visar hur vårt öppna källkodsansats passar perfekt med behoven hos leverantörer av enterprise Linux, och erbjuder dem den transparens och kontroll de kräver.

* **Stiftelser för öppen källkod**: Kanske mest bekräftande är vårt partnerskap med Linux Foundation, som dokumenteras i [Linux Foundation email enterprise case study](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), där vår tjänst driver kommunikationen för just den organisation som förvaltar Linux-utvecklingen.

Det finns en vacker symmetri i hur våra öppna källkodspaket, som underhållits med omsorg under många år, har gjort det möjligt för oss att bygga en e-posttjänst som nu stöder de samhällen och organisationer som förespråkar öppen källkod. Denna cirkulära resa – från att bidra med individuella paket till att driva enterprise-klassad e-postinfrastruktur för ledare inom öppen källkod – representerar den ultimata bekräftelsen av vårt synsätt på mjukvaruutveckling.


## Ett decennium av öppen källkod: Framåt blickande {#a-decade-of-open-source-looking-forward}

När vi ser tillbaka på ett decennium av bidrag till öppen källkod och framåt mot de kommande tio åren, fylls vi av tacksamhet för det community som stöttat vårt arbete och entusiasm för vad som komma skall.

Vår resa från individuella paketbidragsgivare till underhållare av en omfattande e-postinfrastruktur som används av stora företag och stiftelser för öppen källkod har varit anmärkningsvärd. Det är ett bevis på kraften i öppen källkodsutveckling och den påverkan som genomtänkt, väl underhållen mjukvara kan ha på det bredare ekosystemet.

Under de kommande åren är vi engagerade i att:

* **Fortsätta underhålla och förbättra våra befintliga paket**, för att säkerställa att de förblir pålitliga verktyg för utvecklare världen över.
* **Utöka våra bidrag till kritiska infrastrukturprojekt**, särskilt inom e-post- och säkerhetsdomänerna.
* **Förbättra Forward Emails kapabiliteter** samtidigt som vi behåller vårt engagemang för integritet, säkerhet och transparens.
* **Stötta nästa generation av bidragsgivare till öppen källkod** genom mentorskap, sponsring och communityengagemang.

Vi tror att framtiden för mjukvaruutveckling är öppen, samarbetsinriktad och byggd på en grund av förtroende. Genom att fortsätta bidra med högkvalitativa, säkerhetsfokuserade paket till JavaScript-ekosystemet hoppas vi spela en liten roll i att bygga den framtiden.

Tack till alla som har använt våra paket, bidragit till våra projekt, rapporterat problem eller helt enkelt spridit ordet om vårt arbete. Ert stöd har gjort detta decennium av påverkan möjligt, och vi ser fram emot vad vi kan åstadkomma tillsammans under de kommande tio åren.

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
