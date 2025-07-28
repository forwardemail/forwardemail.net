# Ett decennium av påverkan: Hur våra npm-paket nådde 1 miljard nedladdningar och formade JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Pionjärerna som litar på oss: Isaac Z. Schlueter och Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Från npms skapande till Node.js-ledarskap](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bakom koden: Nick Baughs resa](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express tekniska kommitté och kärnbidrag](#express-technical-committee-and-core-contributions)
  * [Koa Framework Bidrag](#koa-framework-contributions)
  * [Från enskild bidragsgivare till organisationsledare](#from-individual-contributor-to-organization-leader)
* [Våra GitHub-organisationer: Ecosystems of Innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Hytt: Strukturerad loggning för moderna applikationer](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Bekämpa e-postmissbruk](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern jobbplanering med arbetstrådar](#bree-modern-job-scheduling-with-worker-threads)
  * [Vidarebefordra e-post: E-postinfrastruktur med öppen källkod](#forward-email-open-source-email-infrastructure)
  * [Lad: Viktiga Koa-verktyg och verktyg](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Öppen källkod Upptidsövervakning](#upptime-open-source-uptime-monitoring)
* [Våra bidrag till Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem)
  * [Från paket till produktion](#from-packages-to-production)
  * [Feedback-loopen](#the-feedback-loop)
* [Forward Email's Core Principles: A Foundation for Excellence](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Alltid utvecklarvänlig, säkerhetsfokuserad och transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Efterlevnad av beprövade principer för mjukvaruutveckling](#adherence-to-time-tested-software-development-principles)
  * [Inriktar sig på den skrapiga, bootstrappade utvecklaren](#targeting-the-scrappy-bootstrapped-developer)
  * [Principer i praktiken: Kodbasen för vidarebefordran av e-post](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Hållbar öppen källkod](#sustainable-open-source)
* [The Numbers Don't Lie: Our Staggering npm Nedladdningsstatistik](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Ett fågelperspektiv av vår inverkan](#a-birds-eye-view-of-our-impact)
  * [Daglig inverkan i stor skala](#daily-impact-at-scale)
  * [Bortom de råa siffrorna](#beyond-the-raw-numbers)
* [Stödja ekosystemet: Våra sponsringar med öppen källkod](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Email Infrastructure Pioneer](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Avslöja säkerhetssårbarheter i JavaScript-ekosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-routerns räddning](#the-koa-router-rescue)
  * [Åtgärda ReDoS-sårbarheter](#addressing-redos-vulnerabilities)
  * [Förespråkar Node.js och Chromium Security](#advocating-for-nodejs-and-chromium-security)
  * [Säkra npm-infrastruktur](#securing-npm-infrastructure)
* [Våra bidrag till Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Förbättra Nodemailers kärnfunktionalitet](#enhancing-nodemailers-core-functionality)
  * [Avancera e-postautentisering med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Viktiga Upptime Enhancements](#key-upptime-enhancements)
* [Limmet som håller ihop allt: anpassad kod i skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv utvecklingsinsats](#a-massive-development-effort)
  * [Integration av kärnberoenden](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine och mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Enterprise Impact: Från öppen källkod till uppdragskritiska lösningar](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Fallstudier i uppdragskritisk e-postinfrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Ett decennium av öppen källkod: Ser framåt](#a-decade-of-open-source-looking-forward)

## Förord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript) och [Node.js](https://en.wikipedia.org/wiki/Node.js) världen är vissa paket viktiga – de laddas ner miljontals gånger dagligen och driver appar över hela världen. Bakom dessa verktyg finns utvecklare som fokuserar på öppen källkodskvalitet. Idag visar vi hur vårt team hjälper till att bygga och underhålla npm-paket som har blivit viktiga delar av JavaScript-ekosystemet.

## Pionjärerna som litar på oss: Isaac Z. Schlueter och vidarebefordra e-post {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi är stolta över att ha [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som användare. Isaac skapade [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) och hjälpte till att bygga [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans förtroende för vidarebefordran av e-post visar vårt fokus på kvalitet och säkerhet. Isaac använder vidarebefordran av e-post för flera domäner, inklusive izs.me.

Isaacs inverkan på JavaScript är enorm. År 2009 var han bland de första att se Node.js potential, och arbetade med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skapade plattformen. Som Isaac sa i ett [intervju med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Mitt i denna väldigt lilla gemenskap av människor som försökte lista ut hur man får server-side JS att fungera, kom Ryan Dahl med Node, vilket helt klart var rätt tillvägagångssätt. Jag satsade allt och blev väldigt engagerad i mitten av 2009."

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### Från npms skapande till Node.js ledarskap {#from-npms-creation-to-nodejs-leadership}

Isaac skapade npm i september 2009, och den första användbara versionen släpptes i början av 2010. Denna pakethanterare fyllde ett viktigt behov i Node.js, vilket gjorde det möjligt för utvecklare att enkelt dela och återanvända kod. Enligt [Node.js Wikipedia-sida](https://en.wikipedia.org/wiki/Node.js), "I januari 2010 introducerades en pakethanterare för Node.js-miljön som heter npm. Pakethanteraren låter programmerare publicera och dela Node.js-paket, tillsammans med den medföljande källkoden, och är utformad för att förenkla installation, uppdatering och avinstallation av paket."

När Ryan Dahl lämnade Node.js i januari 2012 tog Isaac över som projektledare. Som noterats på [hans sammanfattning](https://izs.me/resume) "Ledde han utvecklingen av flera grundläggande Node.js-kärn-API:er, inklusive CommonJS-modulsystemet, filsystem-API:er och strömmar" och "agerade som BDFL (Benevolent Dictator For Life) för projektet i två år, vilket säkerställde ständigt ökande kvalitet och en pålitlig byggprocess för Node.js-versionerna v0.6 till v0.10."

Isaac guidade Node.js genom en viktig tillväxtperiod och satte standarder som fortfarande formar plattformen idag. Han startade senare npm, Inc. 2014 för att stödja npm-registret, som han hade drivit på egen hand tidigare.

Vi tackar Isaac för hans enorma bidrag till JavaScript och fortsätter att använda många paket som han skapat. Hans arbete har förändrat hur vi bygger mjukvara och hur miljontals utvecklare delar kod över hela världen.

## Arkitekten bakom koden: Nick Baughs resa {#the-architect-behind-the-code-nick-baughs-journey}

I hjärtat av vår framgång med öppen källkod är Nick Baugh, Forward Emails grundare och ägare. Hans arbete med JavaScript sträcker sig över nästan 20 år och har format hur otaliga utvecklare bygger appar. Hans resa med öppen källkod visar både teknisk skicklighet och samhällsledarskap.

### Express tekniska kommitté och kärnbidrag {#express-technical-committee-and-core-contributions}

Nicks expertis inom webbramverk gav honom en plats på [Express tekniska kommitté](https://expressjs.com/en/resources/community.html), där han hjälpte till med ett av de mest använda Node.js-ramverken. Nick är nu listad som en inaktiv medlem på [Express community-sida](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

Som medlem i [Express tekniska kommitté](https://expressjs.com/en/resources/community.html) visade Nick stor noggrannhet i frågor som att förtydliga `req.originalUrl`-dokumentationen och åtgärda problem med hantering av flerdelade formulär.

### Bidrag till Koa-ramverket {#koa-framework-contributions}

Nicks arbete med [Koa ramverk](https://github.com/koajs/koa) – ett modernt, lättare alternativ till Express, också skapat av TJ Holowaychuk – visar ytterligare hans engagemang för bättre webbutvecklingsverktyg. Hans Koa-bidrag omfattar både problem och kod genom pull requests, felhantering, innehållstypshantering och dokumentationsförbättringar.

Hans arbete över både Express och Koa ger honom en unik syn på Node.js webbutveckling, vilket hjälper vårt team att skapa paket som fungerar bra med flera ramekosystem.

### Från individuell bidragsgivare till organisationsledare {#from-individual-contributor-to-organization-leader}

Det som började med att hjälpa befintliga projekt växte till att skapa och underhålla ekosystem för hela paket. Nick grundade flera GitHub-organisationer – inklusive [Stuga](https://github.com/cabinjs), [Skräppostskanner](https://github.com/spamscanner), [Vidarebefordra e-post](https://github.com/forwardemail), [Pojke](https://github.com/ladjs) och [Bree](https://github.com/breejs) – som var och en löste specifika behov inom JavaScript-communityn.

Denna förändring från bidragsgivare till ledare visar Nicks vision för väldesignad programvara som löser verkliga problem. Genom att organisera relaterade paket under fokuserade GitHub-organisationer har han byggt verktygsekosystem som fungerar tillsammans samtidigt som de förblir modulära och flexibla för den bredare utvecklargemenskapen.

## Våra GitHub-organisationer: Innovationens ekosystem {#our-github-organizations-ecosystems-of-innovation}

Vi organiserar vårt arbete med öppen källkod kring fokuserade GitHub-organisationer, var och en löser specifika behov i JavaScript. Denna struktur skapar sammanhållna paketfamiljer som fungerar bra tillsammans samtidigt som de förblir modulära.

### Cabin: Strukturerad loggning för moderna applikationer {#cabin-structured-logging-for-modern-applications}

[Hyttorganisation](https://github.com/cabinjs) är vår tolkning av enkel och kraftfull apploggning. Huvudpaketet [`cabin`](https://github.com/cabinjs/cabin) har nästan 900 GitHub-stjärnor och över 100 000 nedladdningar varje vecka\[^1]. Cabin tillhandahåller strukturerad loggning som fungerar med populära tjänster som Sentry, LogDNA och Papertrail.

Det som gör Cabin speciellt är dess genomtänkta API- och plugin-system. Att stödja paket som [`axe`](https://github.com/cabinjs/axe) för Express middleware och [`parse-request`](https://github.com/cabinjs/parse-request) för HTTP-förfrågningsparsing visar vårt engagemang för kompletta lösningar snarare än isolerade verktyg.

Paketet [`bson-objectid`](https://github.com/cabinjs/bson-objectid) förtjänar ett särskilt omnämnande, med över 1,7 miljoner nedladdningar på bara två månader\[^2]. Denna lätta MongoDB ObjectID-implementering har blivit det självklara valet för utvecklare som behöver ID:n utan fullständiga MongoDB-beroenden.

### Skräppostskanner: Bekämpar e-postmissbruk {#spam-scanner-fighting-email-abuse}

[Spam Scanner organisation](https://github.com/spamscanner) visar vårt engagemang för att lösa verkliga problem. Huvudpaketet [`spamscanner`](https://github.com/spamscanner/spamscanner) erbjuder avancerad detektering av skräppost i e-post, men det är [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-paketet som har fått ett fantastiskt genomslag.

Med över 1,2 miljoner nedladdningar på två månader\[^3] åtgärdar `url-regex-safe` kritiska säkerhetsproblem i andra reguljära uttryck för URL-detektering. Det här paketet visar vår strategi för öppen källkod: att hitta ett vanligt problem (i det här fallet [Gör om](https://en.wikipedia.org/wiki/ReDoS) sårbarheter i URL-validering), skapa en solid lösning och underhålla den noggrant.

### Bree: Modern jobbschemaläggning med arbetartrådar {#bree-modern-job-scheduling-with-worker-threads}

[Bree organisation](https://github.com/breejs) är vårt svar på en vanlig Node.js-utmaning: tillförlitlig jobbschemaläggning. Huvudpaketet [`bree`](https://github.com/breejs/bree), med över 3 100 GitHub-stjärnor, tillhandahåller en modern jobbschemaläggare som använder Node.js-arbetstrådar för bättre prestanda och tillförlitlighet.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Vad skiljer Bree från andra schemaläggare som Agenda:

* **Inga externa beroenden**: Till skillnad från Agenda som behöver MongoDB, kräver Bree inte Redis eller MongoDB för att hantera jobbstatus.
* **Arbetstrådar**: Bree använder Node.js-arbetstrådar för sandlådeprocesser, vilket ger bättre isolering och prestanda.
* **Enkelt API**: Bree erbjuder detaljerad kontroll med enkelhet, vilket gör det enklare att implementera komplexa schemaläggningsbehov.
* **Inbyggt stöd**: Saker som smidig omladdning, cron-jobb, datum och användarvänliga tider ingår som standard.

Bree är en viktig del av [forwardemail.net](https://github.com/forwardemail/forwardemail.net) och hanterar kritiska bakgrundsuppgifter som e-postbehandling, rensning och schemalagt underhåll. Att använda Bree i vidarebefordran av e-post visar vårt engagemang för att använda våra egna verktyg i produktionen och säkerställa att de uppfyller höga tillförlitlighetsstandarder.

Vi använder och uppskattar även andra bra arbetstrådspaket som [slå samman](https://github.com/piscinajs/piscina) och HTTP-klienter som [elva](https://github.com/nodejs/undici). Piscina, liksom Bree, använder Node.js arbetstrådar för effektiv uppgiftsbearbetning. Vi tackar [Matthew Hill](https://github.com/mcollina), som underhåller både undici och piscina, för hans stora bidrag till Node.js. Matteo sitter i Node.js tekniska styrkommitté och har avsevärt förbättrat HTTP-klientfunktionerna i Node.js.

### Vidarebefordra e-post: E-postinfrastruktur med öppen källkod {#forward-email-open-source-email-infrastructure}

Vårt mest ambitiösa projekt är [Vidarebefordra e-post](https://github.com/forwardemail), en e-posttjänst med öppen källkod som tillhandahåller vidarebefordran av e-post, lagring och API-tjänster. Huvudarkivet har över 1 100 GitHub-stjärnor\[^4], vilket visar att communityn uppskattar detta alternativ till proprietära e-posttjänster.

Paketet [`preview-email`](https://github.com/forwardemail/preview-email) från den här organisationen, med över 2,5 miljoner nedladdningar på två månader\[^5], har blivit ett viktigt verktyg för utvecklare som arbetar med e-postmallar. Genom att tillhandahålla ett enkelt sätt att förhandsgranska e-postmeddelanden under utveckling löser det ett vanligt problem vid byggande av e-postaktiverade applikationer.

### Lad: Viktiga Koa-verktyg och verktyg {#lad-essential-koa-utilities-and-tools}

[Pojkorganisation](https://github.com/ladjs) tillhandahåller en samling viktiga verktyg och verktyg som främst fokuserar på att förbättra Koa-ramverkets ekosystem. Dessa paket löser vanliga utmaningar inom webbutveckling och är utformade för att fungera sömlöst tillsammans samtidigt som de förblir oberoende användbara.

#### koa-better-error-handler: Förbättrad felhantering för Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) erbjuder en bättre felhanteringslösning för Koa-applikationer. Med över 50 GitHub-stjärnor gör det här paketet att `ctx.throw` producerar användarvänliga felmeddelanden samtidigt som det åtgärdar flera begränsningar i Koas inbyggda felhanterare:

* Upptäcker och hanterar korrekt Node.js DNS-fel, Mongoose-fel och Redis-fel
* Använder [Bom](https://github.com/hapijs/boom) för att skapa konsekventa, välformaterade felsvar
* Bevarar rubriker (till skillnad från Koas inbyggda hanterare)
* Bibehåller lämpliga statuskoder istället för att använda 500 som standard
* Stöder flash-meddelanden och sessionsbevarande
* Tillhandahåller HTML-fellistor för valideringsfel
* Stöder flera svarstyper (HTML, JSON och vanlig text)

Detta paket är särskilt värdefullt när det används tillsammans med [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) för omfattande felhantering i Koa-applikationer.

#### pass: Autentisering för Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) utökar den populära autentiseringsmellanprogramvaran Passport.js med specifika förbättringar för moderna webbapplikationer. Detta paket stöder flera autentiseringsstrategier direkt:

* Lokal autentisering med e-post
* Logga in med Apple
* GitHub-autentisering
* Google-autentisering
* Autentisering med engångslösenord (OTP)

Paketet är mycket anpassningsbart, vilket gör att utvecklare kan justera fältnamn och fraser för att matcha deras applikations krav. Den är utformad för att integreras sömlöst med Mongoose för användarhantering, vilket gör den till en idealisk lösning för Koa-baserade applikationer som behöver robust autentisering.

#### elegant: Elegant programavstängning {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) löser den kritiska utmaningen att stänga av Node.js-applikationer utan problem. Med över 70 GitHub-stjärnor säkerställer detta paket att din applikation kan avslutas utan problem utan att förlora data eller låta anslutningar hänga sig. Viktiga funktioner inkluderar:

* Stöd för smidig avstängning av HTTP-servrar (Express/Koa/Fastify)
* Ren avstängning av databasanslutningar (MongoDB/Mongoose)
* Korrekt avstängning av Redis-klienter
* Hantering av Bree-jobbschemaläggare
* Stöd för anpassade avstängningshanterare
* Konfigurerbara timeout-inställningar
* Integration med loggsystem

Det här paketet är viktigt för produktionsapplikationer där oväntade avstängningar kan leda till dataförlust eller korruption. Genom att implementera korrekta avstängningsprocedurer hjälper `@ladjs/graceful` till att säkerställa tillförlitligheten och stabiliteten hos din applikation.

### Drifttid: Övervakning av drifttid med öppen källkod {#upptime-open-source-uptime-monitoring}

[Upptime organisation](https://github.com/upptime) representerar vårt engagemang för transparent övervakning med öppen källkod. Huvudarkivet [`upptime`](https://github.com/upptime/upptime) har över 13 000 GitHub-stjärnor, vilket gör det till ett av de mest populära projekten vi bidrar till. Upptime tillhandahåller en GitHub-driven drifttidsövervakning och statussida som fungerar helt utan en server.

Vi använder Upptime för vår egen statussida på <https://status.forwardemail.net> med källkoden tillgänglig på <https://github.com/forwardemail/status.forwardemail.net>.

Det som gör Upptime speciellt är dess arkitektur:

* **100 % öppen källkod**: Varje komponent är helt öppen källkod och anpassningsbar.
* **Drivs av GitHub**: Utnyttjar GitHub-åtgärder, problem och sidor för en serverlös övervakningslösning.
* **Ingen server krävs**: Till skillnad från traditionella övervakningsverktyg kräver inte Upptime att du kör eller underhåller en server.
* **Automatisk statussida**: Genererar en snygg statussida som kan lagras på GitHub-sidor.
* **Kraftfulla aviseringar**: Integreras med olika aviseringskanaler, inklusive e-post, SMS och Slack.

För att förbättra våra användares upplevelse har vi integrerat [@oktokit/kärna](https://github.com/octokit/core.js/) i forwardemail.net-kodbasen för att visa statusuppdateringar och incidenter i realtid direkt på vår webbplats. Denna integration ger tydlig transparens för våra användare vid problem i hela vår stack (webbplats, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) med omedelbara toast-aviseringar, ändringar av badge-ikoner, varningsfärger och mer.

@octokit/core-biblioteket tillåter oss att hämta realtidsdata från vårt Upptime GitHub-förråd, bearbeta det och visa det på ett användarvänligt sätt. När någon tjänst har ett avbrott eller försämrad prestanda, meddelas användarna omedelbart genom visuella indikatorer utan att behöva lämna huvudapplikationen. Denna sömlösa integration säkerställer att våra användare alltid har uppdaterad information om vår systemstatus, vilket ökar transparensen och förtroendet.

Upptime har antagits av hundratals organisationer som letar efter ett transparent, pålitligt sätt att övervaka sina tjänster och kommunicera status till användarna. Projektets framgång visar kraften i att bygga verktyg som utnyttjar befintlig infrastruktur (i det här fallet GitHub) för att lösa vanliga problem på nya sätt.

## Våra bidrag till ekosystemet för vidarebefordran av e-post {#our-contributions-to-the-forward-email-ecosystem}

Även om våra paket med öppen källkod används av utvecklare över hela världen, utgör de också grunden för vår egen vidarebefordra e-posttjänst. Denna dubbla roll – både som skapare och användare av dessa verktyg – ger oss ett unikt perspektiv på deras verkliga tillämpning och driver kontinuerliga förbättringar.

### Från paket till produktion {#from-packages-to-production}

Resan från enskilda paket till ett sammanhållet produktionssystem innebär noggrann integration och förlängning. För vidarebefordra e-post inkluderar denna process:

* **Anpassade tillägg**: Bygga tillägg specifika för vidarebefordran av e-post till våra paket med öppen källkod som uppfyller våra unika krav.

* **Integrationsmönster**: Utveckla mönster för hur dessa paket interagerar i en produktionsmiljö.

* **Prestandaoptimeringar**: Identifiera och åtgärda prestandaflaskhalsar som bara uppstår i stor skala.

* **Säkerhetshärdning**: Lägga till ytterligare säkerhetslager specifika för e-posthantering och skydd av användardata.

Detta arbete representerar tusentals timmars utveckling bortom själva kärnpaketen, vilket resulterar i en robust, säker e-posttjänst som utnyttjar det bästa av våra bidrag med öppen källkod.

### Återkopplingsslingan {#the-feedback-loop}

Den kanske mest värdefulla aspekten av att använda våra egna paket i produktionen är den återkopplingsslinga det skapar. När vi stöter på begränsningar eller kantfall i Vidarebefordra e-post, korrigerar vi dem inte bara lokalt – vi förbättrar de underliggande paketen, vilket gynnar både vår tjänst och det bredare samhället.

Detta tillvägagångssätt har lett till många förbättringar:

* **Brees smidiga avstängning**: Vidarebefordran av e-posts behov av driftsättningar utan driftstopp ledde till förbättrade smidiga avstängningsfunktioner i Bree.
* **Spam Scanners mönsterigenkänning**: Verkliga spammönster som påträffas i vidarebefordran av e-post har informerat Spam Scanners detekteringsalgoritmer.
* **Cabins prestandaoptimeringar**: Loggning av hög volym i produktionen avslöjade optimeringsmöjligheter i Cabin som gynnar alla användare.

Genom att upprätthålla denna goda cykel mellan vårt arbete med öppen källkod och produktionstjänst säkerställer vi att våra paket förblir praktiska, stridstestade lösningar snarare än teoretiska implementeringar.

## Kärnprinciper för vidarebefordran av e-post: En grund för excellens {#forward-emails-core-principles-a-foundation-for-excellence}

Vidarebefordran av e-post är utformad enligt en uppsättning kärnprinciper som vägleder alla våra utvecklingsbeslut. Dessa principer, som beskrivs i vår [webbplats](/blog/docs/best-quantum-safe-encrypted-email-service#principles), säkerställer att vår tjänst förblir utvecklarvänlig, säker och fokuserad på användarnas integritet.

### Alltid utvecklarvänlig, säkerhetsfokuserad och transparent {#always-developer-friendly-security-focused-and-transparent}

Vår första och främsta princip är att skapa mjukvara som är utvecklarvänlig samtidigt som den upprätthåller högsta standard för säkerhet och integritet. Vi anser att teknisk excellens aldrig bör ske på bekostnad av användbarhet, och att transparens skapar förtroende hos vårt samhälle.

Denna princip visar sig i vår detaljerade dokumentation, tydliga felmeddelanden och öppen kommunikation om både framgångar och utmaningar. Genom att göra hela vår kodbas öppen källkod uppmanar vi till granskning och samarbete, vilket stärker både vår programvara och det bredare ekosystemet.

### Efterlevnad av beprövade principer för programvaruutveckling {#adherence-to-time-tested-software-development-principles}

Vi följer flera etablerade principer för mjukvaruutveckling som har bevisat sitt värde under decennier:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separera problem genom Model-View-Controller-mönstret
* **[Unix filosofi](https://en.wikipedia.org/wiki/Unix_philosophy)**: Skapa modulära komponenter som gör en sak bra
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Hålla det enkelt och rakt på sak
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Upprepa inte dig själv, främja återanvändning av kod
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du kommer inte att behöva det, undvika för tidig optimering
* **[Tolv Faktorer](https://12factor.net/)**: Följa bästa praxis för att bygga moderna, skalbara applikationer
* **[Occams rakkniv](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Att välja den enklaste lösningen som uppfyller kraven
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Använda våra egna produkter i stor utsträckning

Dessa principer är inte bara teoretiska koncept – de är inbäddade i våra dagliga utvecklingsmetoder. Till exempel är vår anslutning till Unix-filosofin tydlig i hur vi har strukturerat våra npm-paket: små, fokuserade moduler som kan sammanställas för att lösa komplexa problem.

### Riktar sig mot den snabba, bootstrappade utvecklaren {#targeting-the-scrappy-bootstrapped-developer}

Vi riktar oss specifikt till scrappy-utvecklare, bootstrappade och [ramen-lönsam](https://www.paulgraham.com/ramenprofitable.html). Detta fokus formar allt från vår prissättningsmodell till våra tekniska beslut. Vi förstår utmaningarna med att bygga produkter med begränsade resurser eftersom vi själva har varit där.

Denna princip är särskilt viktig i hur vi närmar oss öppen källkod. Vi skapar och underhåller paket som löser verkliga problem för utvecklare utan företagsbudgetar, vilket gör kraftfulla verktyg tillgängliga för alla oavsett deras resurser.

### Principer i praktiken: Kodbasen för vidarebefordran av e-post {#principles-in-practice-the-forward-email-codebase}

Dessa principer är tydligt synliga i kodbasen Vidarebefordra e-post. Vår package.json-fil avslöjar ett genomtänkt urval av beroenden, var och en utvald för att anpassas till våra kärnvärden:

* Säkerhetsfokuserade paket som `mailauth` för e-postautentisering
* Utvecklarvänliga verktyg som `preview-email` för enklare felsökning
* Modulära komponenter som de olika `p-*`-verktygen från Sindre Sorhus

Genom att följa dessa principer konsekvent över tid har vi byggt en tjänst som utvecklare kan lita på med sin e-postinfrastruktur – säker, pålitlig och anpassad till värderingarna i öppen källkodsgemenskap.

### Integritetsskydd genom design {#privacy-by-design}

Sekretess är inte en eftertanke eller marknadsföringsfunktion för Vidarebefordra e-post – det är en grundläggande designprincip som informerar varje aspekt av vår tjänst och kod:

* **Nollåtkomstkryptering**: Vi har implementerat system som gör det tekniskt omöjligt för oss att läsa användarnas e-postmeddelanden.
* **Minimal datainsamling**: Vi samlar endast in de uppgifter som är nödvändiga för att tillhandahålla vår tjänst, inget mer.
* **Transparenta policyer**: Vår integritetspolicy är skriven på ett tydligt och begripligt språk utan juridisk jargong.
* **Verifiering av öppen källkod**: Vår kodbas med öppen källkod gör det möjligt för säkerhetsforskare att verifiera våra integritetspåståenden.

Detta åtagande sträcker sig till våra paket med öppen källkod, som är designade med bästa praxis för säkerhet och integritet inbyggd från grunden.

### Hållbar öppen källkod {#sustainable-open-source}

Vi tror att programvara med öppen källkod behöver hållbara modeller för att trivas långsiktigt. Vårt tillvägagångssätt inkluderar:

* **Kommersiell support**: Erbjuder premiumsupport och tjänster kring våra verktyg med öppen källkod.
* **Balanserad licensiering**: Använder licenser som skyddar både användarfriheter och projektets hållbarhet.
* **Communityengagemang**: Aktivt engagerar sig med bidragsgivare för att bygga en stödjande community.
* **Transparenta färdplaner**: Delar våra utvecklingsplaner så att användarna kan planera därefter.

Genom att fokusera på hållbarhet säkerställer vi att våra bidrag med öppen källkod kan fortsätta att växa och förbättras över tid snarare än att försummas.

## Siffrorna ljuger inte: Vår häpnadsväckande npm-nedladdningsstatistik {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

När vi pratar om inverkan av programvara med öppen källkod ger nedladdningsstatistik ett påtagligt mått på adoption och förtroende. Många av paketen vi hjälper till att underhålla har nått en skala som få projekt med öppen källkod någonsin uppnår, med kombinerade nedladdningar som uppgår till miljarder.

![Topp npm-paket efter nedladdningar](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### En överblick över vår påverkan {#a-birds-eye-view-of-our-impact}

Under bara tvåmånadersperioden från februari till mars 2025, de bästa paketen vi bidrar till och hjälper till att upprätthålla registrerade häpnadsväckande nedladdningssiffror:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 nedladdningar\[^7] (ursprungligen skapad av TJ Holowaychuk)
* **[super test](https://www.npmjs.com/package/supertest)**: 76 432 591 nedladdningar\[^8] (ursprungligen skapad av TJ Holowaychuk)
* **[också](https://www.npmjs.com/package/koa)**: 28 539 295 nedladdningar\[^34] (ursprungligen skapad av TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 nedladdningar\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 nedladdningar\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 nedladdningar\[^37]
* **[förhandsgransknings-e-post](https://www.npmjs.com/package/preview-email)**: 2 500 000 nedladdningar\[^9]
* **[stuga](https://www.npmjs.com/package/cabin)**: 1 800 000 nedladdningar\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 nedladdningar\[^38]
* **[e-postmallar](https://www.npmjs.com/package/email-templates)**: 1 128 139 nedladdningar\[^39]
* **[få-vägar](https://www.npmjs.com/package/get-paths)**: 1 124 686 nedladdningar\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 nedladdningar\[^11]
* **[dotenv-parse-variabler](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 nedladdningar\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 nedladdningar\[^42]
* **[skräppostscanner](https://www.npmjs.com/package/spamscanner)**: 145 000 nedladdningar\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 nedladdningar\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

Det här är inte bara imponerande siffror – de representerar riktiga utvecklare som löser verkliga problem med kod som vi hjälper till att underhålla. Varje nedladdning är en instans där dessa paket har hjälpt någon att bygga något meningsfullt, från hobbyprojekt till företagsapplikationer som används av miljoner.

![Paketkategorier Distribution](/img/art/category_pie_chart.svg)

### Daglig påverkan i stor skala {#daily-impact-at-scale}

De dagliga nedladdningsmönstren visar på en konsekvent användning med höga volymer, med toppar som når miljontals nedladdningar per dag\[^13]. Denna konsekvens visar på stabiliteten och tillförlitligheten hos dessa paket – utvecklare testar dem inte bara; de integrerar dem i sina kärnarbetsflöden och förlitar sig på dem dag efter dag.

Veckovisa nedladdningsmönster visar ännu mer imponerande siffror, som konsekvent ligger runt tiotals miljoner nedladdningar per vecka\[^14]. Detta representerar ett massivt fotavtryck i JavaScript-ekosystemet, med dessa paket som körs i produktionsmiljöer över hela världen.

### Bortom de råa siffrorna {#beyond-the-raw-numbers}

Även om nedladdningsstatistiken är imponerande i sig, berättar den en djupare historia om det förtroende som communityn ger dessa paket. Att underhålla paket i denna skala kräver ett orubbligt engagemang för:

* **Bakåtkompatibilitet**: Ändringar måste noggrant övervägas för att undvika att befintliga implementeringar störs.
* **Säkerhet**: Med miljontals applikationer som är beroende av dessa paket kan säkerhetsproblem få långtgående konsekvenser.
* **Prestanda**: I denna skala kan även mindre prestandaförbättringar ha betydande sammanlagda fördelar.
* **Dokumentation**: Tydlig och omfattande dokumentation är avgörande för paket som används av utvecklare på alla erfarenhetsnivåer.

Den konsekventa ökningen av nedladdningssiffror över tid återspeglar framgången med att uppfylla dessa åtaganden, bygga förtroende med utvecklargemenskapen genom pålitliga, väl underhållna paket.

## Stödjer ekosystemet: Våra sponsorskap med öppen källkod {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Utöver våra direkta bidrag till JavaScript-ekosystemet är vi stolta över att sponsra framstående Node.js-bidragsgivare vars arbete utgör grunden för många moderna applikationer. Våra sponsringar inkluderar:

### Andris Reinman: Pionjär inom e-postinfrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) är skaparen av [Nodemailer](https://github.com/nodemailer/nodemailer), det populäraste e-postbiblioteket för Node.js med över 14 miljoner nedladdningar varje vecka\[^15]. Hans arbete sträcker sig till andra kritiska komponenter i e-postinfrastrukturen som [SMTP-server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) och [Vildanka](https://github.com/nodemailer/wildduck).

Vår sponsring hjälper till att säkerställa fortsatt underhåll och utveckling av dessa viktiga verktyg som driver e-postkommunikation för otaliga Node.js-applikationer, inklusive vår egen vidarebefordra e-posttjänst.

### Sindre Sørhus: Hjärnan bakom verktygspaket {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) är en av de mest produktiva bidragsgivarna inom öppen källkod i JavaScript-ekosystemet, med över 1 000 npm-paket i bagaget. Hans verktyg som [p-karta](https://github.com/sindresorhus/p-map), [försök igen](https://github.com/sindresorhus/p-retry) och [är-ström](https://github.com/sindresorhus/is-stream) är grundläggande byggstenar som används i hela Node.js-ekosystemet.

Genom att sponsra Sindres arbete hjälper vi till att upprätthålla utvecklingen av dessa viktiga verktyg som gör JavaScript-utvecklingen mer effektiv och tillförlitlig.

Dessa sponsringar återspeglar vårt engagemang för det bredare ekosystemet med öppen källkod. Vi inser att vår egen framgång bygger på den grund som lagts av dessa och andra bidragsgivare, och vi är dedikerade till att säkerställa hela ekosystemets hållbarhet.

## Avslöjar säkerhetsbrister i JavaScript-ekosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vårt engagemang för öppen källkod sträcker sig bortom funktionsutveckling och inkluderar att identifiera och åtgärda säkerhetsbrister som kan påverka miljontals utvecklare. Flera av våra viktigaste bidrag till JavaScript-ekosystemet har varit inom säkerhetsområdet.

### Koa-routerns räddning {#the-koa-router-rescue}

I februari 2019 identifierade Nick ett kritiskt problem med underhållet av det populära koa-router-paketet. När han [rapporterade på Hacker News](https://news.ycombinator.com/item?id=19156707) hade paketet övergivits av dess ursprungliga ansvarige, vilket lämnade säkerhetsbrister oåtgärdade och communityn utan uppdateringar.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

Som svar skapade Nick [@koa/router](https://github.com/koajs/router) och hjälpte till att varna gemenskapen om situationen. Han har underhållit detta viktiga paket sedan dess och säkerställt att Koa-användare har en säker och väl underhållen routinglösning.

### Åtgärda ReDoS-sårbarheter {#addressing-redos-vulnerabilities}

År 2020 identifierade och åtgärdade Nick en kritisk [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-sårbarhet i det allmänt använda `url-regex`-paketet. Denna sårbarhet ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kunde göra det möjligt för angripare att orsaka överbelastning genom att tillhandahålla specialskriven indata som orsakade katastrofala bakåtspårningar i det reguljära uttrycket.

Istället för att bara uppdatera det befintliga paketet skapade Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en helt omskriven implementering som åtgärdar sårbarheten samtidigt som den bibehåller kompatibiliteten med det ursprungliga API:et. Han publicerade också en [omfattande blogginlägg](/blog/docs/url-regex-javascript-node-js) som förklarar sårbarheten och hur man kan mildra den.

Det här arbetet visar vår strategi för säkerhet: inte bara åtgärda problem utan utbilda samhället och tillhandahålla robusta alternativ som förhindrar liknande problem i framtiden.

### Förespråkar Node.js och Chromium-säkerhet {#advocating-for-nodejs-and-chromium-security}

Nick har också varit aktiv i att förespråka säkerhetsförbättringar i det bredare ekosystemet. I augusti 2020 identifierade han ett betydande säkerhetsproblem i Node.js relaterat till dess hantering av HTTP-headers, vilket rapporterades i [Registret](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Det här problemet, som härrörde från en patch i Chromium, kan potentiellt tillåta angripare att kringgå säkerhetsåtgärder. Nicks förespråkande hjälpte till att säkerställa att problemet åtgärdades snabbt, vilket skyddade miljontals Node.js-applikationer från potentiellt utnyttjande.

### Säkra npm-infrastruktur {#securing-npm-infrastructure}

Senare samma månad identifierade Nick ytterligare ett kritiskt säkerhetsproblem, den här gången i npms e-postinfrastruktur. Som rapporterats i [Registret](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) implementerade inte npm e-postautentiseringsprotokollen DMARC, SPF och DKIM korrekt, vilket potentiellt gjorde det möjligt för angripare att skicka nätfiskemejl som verkade komma från npm.

Nicks rapport ledde till förbättringar av npms e-postsäkerhetsställning, vilket skyddade de miljontals utvecklare som förlitar sig på npm för pakethantering från potentiella nätfiskeattacker.

## Våra bidrag till ekosystemet för vidarebefordran av e-post {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email är byggt ovanpå flera kritiska öppen källkodsprojekt, inklusive Nodemailer, WildDuck och mailauth. Vårt team har gett betydande bidrag till dessa projekt och hjälpt till att identifiera och åtgärda djupa problem som påverkar e-postleverans och säkerhet.

### Förbättrar Nodemailers kärnfunktionalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) är ryggraden i e-postutskick i Node.js, och våra bidrag har bidragit till att göra det mer robust:

* **Förbättringar av SMTP-servern**: Vi har åtgärdat parsningsfel, problem med hantering av strömmar och TLS-konfigurationsproblem i SMTP-serverkomponenten\[^16]\[^17].
* **Förbättringar av e-postparser**: Vi har åtgärdat fel i avkodning av teckensekvenser och parserproblem som kan orsaka fel i e-postbearbetningen\[^18]\[^19].

Dessa bidrag säkerställer att Nodemailer förblir en pålitlig grund för e-postbehandling i Node.js-applikationer, inklusive Vidarebefordra e-post.

### Avancerad e-postautentisering med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tillhandahåller viktiga funktioner för e-postautentisering, och våra bidrag har avsevärt förbättrat dess funktioner:

* **Förbättringar av DKIM-verifiering**: Vi upptäckte och rapporterade att X/Twitter hade problem med DNS-cache som orsakade DKIM-fel för deras utgående meddelanden, och rapporterade detta på Hacker One\[^20].
* **Förbättringar av DMARC och ARC**: Vi har åtgärdat problem med DMARC- och ARC-verifiering som kunde leda till felaktiga autentiseringsresultat\[^21]\[^22].
* **Prestandaoptimeringar**: Vi har bidragit med optimeringar som förbättrar prestandan för e-postautentiseringsprocesser\[^23]\[^24]\[^25]\[^26].

Dessa förbättringar hjälper till att säkerställa att e-postautentisering är korrekt och pålitlig, och skyddar användare från nätfiske och spoofingattacker.

### Förbättringar av viktig drifttid {#key-upptime-enhancements}

Våra bidrag till Upptime inkluderar:

* **Övervakning av SSL-certifikat**: Vi har lagt till funktionalitet för att övervaka när SSL-certifikat löper ut, vilket förhindrar oväntade driftstopp på grund av utgångna certifikat\[^27].
* **Stöd för flera SMS-nummer**: Vi har implementerat stöd för att varna flera teammedlemmar via SMS när incidenter inträffar, vilket förbättrar svarstiderna\[^28].
* **Åtgärder för IPv6-kontroll**: Vi har åtgärdat problem med IPv6-anslutningskontroller, vilket säkerställer mer exakt övervakning i moderna nätverksmiljöer\[^29].
* **Stöd för mörkt/ljust läge**: Vi har lagt till temasköd för att förbättra användarupplevelsen på statussidor\[^31].
* **Bättre stöd för TCP-ping**: Vi har förbättrat TCP-pingfunktionen för att ge mer tillförlitlig anslutningstestning\[^32].

Dessa förbättringar gynnar inte bara Forward Emails statusövervakning utan är tillgängliga för hela gruppen av Upptime-användare, vilket visar vårt engagemang för att förbättra de verktyg vi är beroende av.

## Limmet som håller ihop allt: Anpassad kod i stor skala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Även om våra npm-paket och bidrag till befintliga projekt är betydande, är det den anpassade koden som integrerar dessa komponenter som verkligen visar upp vår tekniska expertis. Kodbasen för vidarebefordran av e-post representerar ett decennium av utvecklingsarbete, som går tillbaka till 2017 då projektet startade som [gratis vidarebefordran av e-post](https://github.com/forwardemail/free-email-forwarding) innan det slogs samman till ett monorepo.

### En massiv utvecklingsinsats {#a-massive-development-effort}

Omfattningen av denna anpassade integrationskod är imponerande:

* **Totala bidrag**: Över 3 217 commits
* **Kodbasstorlek**: Över 421 545 rader kod i JavaScript-, Pug-, CSS- och JSON-filer\[^33]

Detta representerar tusentals timmars utvecklingsarbete, felsökningssessioner och prestandaoptimeringar. Det är den "hemliga såsen" som förvandlar enskilda paket till en sammanhållen, pålitlig tjänst som används av tusentals kunder dagligen.

### Integrering av kärnberoenden {#core-dependencies-integration}

Kodbasen vidarebefordra e-post integrerar många beroenden till en sömlös helhet:

* **E-postbehandling**: Integrerar Nodemailer för sändning, SMTP-server för mottagning och Mailparser för parsning
* **Autentisering**: Använder Mailauth för DKIM-, SPF-, DMARC- och ARC-verifiering
* **DNS-upplösning**: Använder Tangerine för DNS-över-HTTPS med global cachning
* **MX-anslutning**: Använder mx-connect med Tangerine-integration för pålitliga e-postserveranslutningar
* **Jobbschemaläggning**: Använder Bree för pålitlig bakgrundsbearbetning av uppgifter med arbetstrådar
* **Mallering**: Använder e-postmallar för att återanvända stilmallar från webbplatsen i kundkommunikation
* **E-postlagring**: Implementerar individuellt krypterade SQLite-postlådor med hjälp av better-sqlite3-multiple-chiffer med ChaCha20-Poly1305-kryptering för kvantsäker integritet, vilket säkerställer fullständig isolering mellan användare och att endast användaren har åtkomst till sin postlåda

Var och en av dessa integrationer kräver noggrann övervägande av edge-fall, prestandaimplikationer och säkerhetsproblem. Resultatet är ett robust system som hanterar miljontals e-posttransaktioner på ett tillförlitligt sätt. Vår SQLite-implementering använder också msgpackr för effektiv binär serialisering och WebSockets (via ws) för statusuppdateringar i realtid över hela vår infrastruktur.

### DNS-infrastruktur med Tangerine och mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En kritisk komponent i Forward Emails infrastruktur är vårt DNS-upplösningssystem, byggt kring två nyckelpaket:

* **[Mandarin](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vår Node.js DNS-over-HTTPS-implementering erbjuder en drop-in-ersättning för standard DNS-resolvern, med inbyggda återförsök, timeouts, smart serverrotation och stöd för cachning.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Det här paketet upprättar TCP-anslutningar till MX-servrar, tar en måldomän eller e-postadress, matchar lämpliga MX-servrar och ansluter till dem i prioritetsordning.

Vi har integrerat Tangerine med mx-connect via [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), vilket säkerställer DNS på applikationslagret över HTTP-förfrågningar i hela Forward Email. Detta ger global cachning för DNS i stor skala med 1:1-konsekvens över alla regioner, appar eller processer – avgörande för tillförlitlig e-postleverans i ett distribuerat system.

## Företagspåverkan: Från öppen källkod till verksamhetskritiska lösningar {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kulmineringen av vår decennielånga resa inom utveckling av öppen källkod har gjort det möjligt för Forward Email att betjäna inte bara enskilda utvecklare utan även stora företag och utbildningsinstitutioner som utgör ryggraden i själva rörelsen för öppen källkod.

### Fallstudier inom verksamhetskritisk e-postinfrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Vårt engagemang för tillförlitlighet, integritet och principer för öppen källkod har gjort Forward Email till det betrodda valet för organisationer med krävande e-postkrav:

* **Utbildningsinstitutioner**: Som beskrivs i vår [fallstudie om vidarebefordran av e-post för alumner]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), stora universitet förlitar sig på vår infrastruktur för att upprätthålla livslånga kontakter med hundratusentals alumner genom pålitliga e-postvidarebefordringstjänster.

* **Linuxlösningar för företag**: [Canonical Ubuntu e-postföretagsfallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) visar hur vår öppen källkodsstrategi perfekt anpassas till behoven hos Linux-leverantörer för företag, vilket ger dem den transparens och kontroll de behöver.

* **Grundläggande källor med öppen källkod**: Det mest validerande är kanske vårt partnerskap med Linux Foundation, vilket dokumenteras i [Linux Foundation email företag fallstudie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), där vår tjänst driver kommunikationen för just den organisation som ansvarar för Linux-utvecklingen.

Det finns en vacker symmetri i hur våra paket med öppen källkod, underhållna med omsorg under många år, har gjort det möjligt för oss att bygga en e-posttjänst som nu stöder just de samhällen och organisationer som förespråkar programvara med öppen källkod. Denna helcirkelresa – från att bidra med individuella paket till att driva företagsklassad e-postinfrastruktur för ledare med öppen källkod – representerar den ultimata valideringen av vår strategi för mjukvaruutveckling.

## Ett decennium av öppen källkod: En blick framåt {#a-decade-of-open-source-looking-forward}

När vi ser tillbaka på ett decennium av bidrag med öppen källkod och framåt till de kommande tio åren, är vi fyllda av tacksamhet för samhället som har stöttat vårt arbete och spänning inför vad som komma skall.

Vår resa från enskilda paketbidragsgivare till underhållare av en omfattande e-postinfrastruktur som används av stora företag och stiftelser med öppen källkod har varit anmärkningsvärd. Det är ett bevis på kraften i utveckling av öppen källkod och den inverkan som genomtänkt, väl underhållen programvara kan ha på det bredare ekosystemet.

Under de kommande åren har vi åtagit oss att:

* **Fortsätter att underhålla och förbättra våra befintliga paket** och säkerställer att de förblir pålitliga verktyg för utvecklare över hela världen.
* **Utökar våra bidrag till kritiska infrastrukturprojekt**, särskilt inom e-post och säkerhet.
* **Förbättrar funktionerna för vidarebefordran av e-post** samtidigt som vi bibehåller vårt engagemang för integritet, säkerhet och transparens.
* **Stödjer nästa generations bidragsgivare med öppen källkod** genom mentorskap, sponsring och samhällsengagemang.

Vi tror att framtiden för mjukvaruutveckling är öppen, samarbetsvillig och byggd på en grund av förtroende. Genom att fortsätta bidra med högkvalitativa, säkerhetsfokuserade paket till JavaScript-ekosystemet hoppas vi kunna spela en liten roll i att bygga den framtiden.

Tack till alla som har använt våra paket, bidragit till våra projekt, rapporterat problem eller helt enkelt spridit ordet om vårt arbete. Ditt stöd har möjliggjort detta decennium av inverkan, och vi är glada över att se vad vi kan åstadkomma tillsammans under de kommande tio åren.

\[^1]: npm nedladdningsstatistik för cabin, april 2025
\[^2]: npm nedladdningsstatistik för bson-objectid, februari-mars 2025
\[^3]: npm nedladdningsstatistik för url-regex-safe, april 2025
\[^4]: GitHub-stjärnor för forwardemail/forwardemail.net från och med april 2025
\[^5]: npm nedladdningsstatistik för preview-email, april 2025
\[^7]: npm nedladdningsstatistik för superagent, februari-mars 2025
\[^8]: npm nedladdningsstatistik för supertest, februari-mars 2025
\[^9]: npm nedladdningsstatistik för preview-email, februari-mars 2025
\[^10]: npm nedladdningsstatistik för cabin, februari-mars 2025
\[^11]: npm nedladdningsstatistik för url-regex-safe, februari-mars 2025
\[^12]: npm-nedladdningsstatistik för spamscanner, februari-mars 2025
\[^13]: Dagliga nedladdningsmönster från npm-statistik, april 2025
\[^14]: Veckovisa nedladdningsmönster från npm-statistik, april 2025
\[^15]: npm-nedladdningsstatistik för nodemailer, april 2025
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
\[^27]: Baserat på GitHub-problem i Upptime-arkivet
\[^28]: Baserat på GitHub-problem i Upptime-arkivet
\[^29]: Baserat på GitHub-problem i Upptime-arkivet
\[^30]: npm-nedladdningsstatistik för bree, februari-mars 2025
\[^31]: Baserat på GitHub-pull-förfrågningar till Upptime
\[^32]: Baserat på GitHub-pull-förfrågningar till Upptime
\[^34]: npm-nedladdningsstatistik för koa, februari-mars 2025
\[^35]: npm-nedladdningsstatistik för @koa/router, februari-mars 2025
\[^36]: npm-nedladdningsstatistik för koa-router, februari-mars 2025
\[^37]: npm-nedladdningsstatistik för url-regex, februari-mars 2025
\[^38]: npm-nedladdningsstatistik för @breejs/later, februari-mars 2025
\[^39]: npm-nedladdningsstatistik för email-templates, februari-mars 2025
\[^40]: npm-nedladdningsstatistik för get-paths, februari-mars 2025
\[^41]: npm-nedladdningsstatistik för dotenv-parse-variables, februari-mars 2025
\[^42]: npm-nedladdningsstatistik för @koa/multer, februari-mars 2025