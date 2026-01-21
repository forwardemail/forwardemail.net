# Ett decennium av påverkan: Hur våra npm-paket nådde 1 miljard nedladdningar och formade JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Pionjärerna som litar på oss: Isaac Z. Schlueter och vidarebefordra e-post](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Från npms skapande till Node.js ledarskap](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bakom koden: Nick Baughs resa](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express teknisk kommitté och kärnbidrag](#express-technical-committee-and-core-contributions)
  * [Bidrag till Koa-ramverket](#koa-framework-contributions)
  * [Från individuell bidragsgivare till organisationsledare](#from-individual-contributor-to-organization-leader)
* [Våra GitHub-organisationer: Innovationens ekosystem](#our-github-organizations-ecosystems-of-innovation)
  * [Stuga: Strukturerad loggning för moderna applikationer](#cabin-structured-logging-for-modern-applications)
  * [Spamskanner: Bekämpa e-postmissbruk](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern jobbschemaläggning med arbetartrådar](#bree-modern-job-scheduling-with-worker-threads)
  * [Vidarebefordra e-post: E-postinfrastruktur med öppen källkod](#forward-email-open-source-email-infrastructure)
  * [Lad: Viktiga Koa-verktyg och verktyg](#lad-essential-koa-utilities-and-tools)
  * [Drifttid: Övervakning av drifttid med öppen källkod](#upptime-open-source-uptime-monitoring)
* [Våra bidrag till ekosystemet för vidarebefordran av e-post](#our-contributions-to-the-forward-email-ecosystem)
  * [Från paket till produktion](#from-packages-to-production)
  * [Återkopplingsslingan](#the-feedback-loop)
* [Kärnprinciperna för vidarebefordran av e-post: En grund för excellens](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Alltid utvecklarvänlig, säkerhetsfokuserad och transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Efterlevnad av beprövade principer för mjukvaruutveckling](#adherence-to-time-tested-software-development-principles)
  * [Riktar sig mot den skrappiga, bootstrappade utvecklaren](#targeting-the-scrappy-bootstrapped-developer)
  * [Principer i praktiken: Kodbasen för vidarebefordran av e-post](#principles-in-practice-the-forward-email-codebase)
  * [Inbyggd integritet](#privacy-by-design)
  * [Hållbar öppen källkod](#sustainable-open-source)
* [Siffrorna ljuger inte: Vår häpnadsväckande npm-nedladdningsstatistik](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [En överblick över vår påverkan](#a-birds-eye-view-of-our-impact)
  * [Daglig påverkan i stor skala](#daily-impact-at-scale)
  * [Bortom de råa siffrorna](#beyond-the-raw-numbers)
* [Stödja ekosystemet: Våra sponsorskap med öppen källkod](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionjär inom e-postinfrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Avslöja säkerhetsbrister i JavaScript-ekosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router-räddningen](#the-koa-router-rescue)
  * [Åtgärda ReDoS-sårbarheter](#addressing-redos-vulnerabilities)
  * [Förespråkar Node.js och Chromium Security](#advocating-for-nodejs-and-chromium-security)
  * [Säkra npm-infrastruktur](#securing-npm-infrastructure)
* [Våra bidrag till ekosystemet för vidarebefordran av e-post](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Förbättra Nodemailers kärnfunktionalitet](#enhancing-nodemailers-core-functionality)
  * [Avancera e-postautentisering med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Viktiga förbättringar av drifttiden](#key-upptime-enhancements)
* [Limmet som håller ihop allt: Anpassad kod i stor skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv utvecklingsinsats](#a-massive-development-effort)
  * [Integrering av kärnberoenden](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine och mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Företagspåverkan: Från öppen källkod till verksamhetskritiska lösningar](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Fallstudier inom verksamhetskritisk e-postinfrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Ett decennium av öppen källkod: En blick framåt](#a-decade-of-open-source-looking-forward)

## Förord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript)- och [Node.js](https://en.wikipedia.org/wiki/Node.js)-världen är vissa paket viktiga – de laddas ner miljontals gånger dagligen och driver appar över hela världen. Bakom dessa verktyg finns utvecklare som fokuserar på öppen källkodskvalitet. Idag visar vi hur vårt team hjälper till att bygga och underhålla npm-paket som har blivit viktiga delar av JavaScript-ekosystemet.

## Pionjärerna som litar på oss: Isaac Z. Schlueter och vidarebefordra e-post {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi är stolta över att ha [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som användare. Isaac skapade [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) och hjälpte till att bygga [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans förtroende för vidarebefordran av e-post visar vårt fokus på kvalitet och säkerhet. Isaac använder vidarebefordran av e-post för flera domäner, inklusive izs.me.

Isaacs inverkan på JavaScript är enorm. År 2009 var han bland de första att se Node.js potential, och arbetade med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skapade plattformen. Som Isaac sa i en [intervju med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-artikel: "Mitt i denna väldigt lilla gemenskap av människor som försökte lista ut hur man skulle få server-side JS att fungera, kom Ryan Dahl med Node, vilket helt klart var rätt tillvägagångssätt. Jag satsade allt och blev väldigt engagerad i mitten av 2009."

> \[!NOTE]
> För de som är intresserade av Node.js historia finns det utmärkta dokumentärer som skildrar dess utveckling, inklusive [Historien om Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) och [10 saker jag ångrar med Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [personlig webbplats](https://tinyclouds.org/) innehåller också värdefulla insikter i hans arbete.

### Från npms skapande till Node.js ledarskap {#from-npms-creation-to-nodejs-leadership}

Isaac skapade npm i september 2009, och den första användbara versionen släpptes i början av 2010. Denna pakethanterare fyllde ett viktigt behov i Node.js, vilket gjorde det möjligt för utvecklare att enkelt dela och återanvända kod. Enligt [Node.js Wikipedia-sida](https://en.wikipedia.org/wiki/Node.js), "I januari 2010 introducerades en pakethanterare för Node.js-miljön som heter npm. Pakethanteraren låter programmerare publicera och dela Node.js-paket, tillsammans med den medföljande källkoden, och är utformad för att förenkla installation, uppdatering och avinstallation av paket."

När Ryan Dahl lämnade Node.js i januari 2012 tog Isaac över som projektledare. Som noterats på [hans sammanfattning](https://izs.me/resume) "Ledde han utvecklingen av flera grundläggande Node.js-kärn-API:er, inklusive CommonJS-modulsystemet, filsystem-API:er och strömmar" och "agerade som BDFL (Benevolent Dictator For Life) för projektet i två år, vilket säkerställde ständigt ökande kvalitet och en pålitlig byggprocess för Node.js-versionerna v0.6 till v0.10."

Isaac vägledde Node.js genom en viktig tillväxtperiod och satte standarder som fortfarande formar plattformen idag. Han startade senare npm, Inc. 2014 för att stödja npm-registret, som han tidigare hade drivit på egen hand.

Vi tackar Isaac för hans enorma bidrag till JavaScript och fortsätter att använda många paket han skapade. Hans arbete har förändrat hur vi bygger programvara och hur miljontals utvecklare delar kod världen över.

## Arkitekten bakom koden: Nick Baughs resa {#the-architect-behind-the-code-nick-baughs-journey}

I hjärtat av vår framgång med öppen källkod står Nick Baugh, grundare och ägare av Forward Email. Hans arbete med JavaScript sträcker sig över nästan 20 år och har format hur otaliga utvecklare bygger appar. Hans resa med öppen källkod visar både teknisk skicklighet och ledarskap inom communityt.

### Express teknisk kommitté och kärnbidrag {#express-technical-committee-and-core-contributions}

Nicks expertis inom webbramverk gav honom en plats på [Express tekniska kommitté](https://expressjs.com/en/resources/community.html), där han hjälpte till med ett av de mest använda Node.js-ramverken. Nick är nu listad som en inaktiv medlem på [Express community-sida](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express skapades ursprungligen av TJ Holowaychuk, en produktiv bidragsgivare till öppen källkod som har format mycket av Node.js ekosystem. Vi är tacksamma för TJs grundläggande arbete och respekterar hans [beslut att ta en paus](https://news.ycombinator.com/item?id=37687017) från hans omfattande bidrag till öppen källkod.

Som medlem i [Express tekniska kommitté](https://expressjs.com/en/resources/community.html) visade Nick stor noggrannhet i frågor som att förtydliga `req.originalUrl`-dokumentationen och åtgärda problem med hantering av flerdelade formulär.

### Bidrag till Koa-ramverket {#koa-framework-contributions}

Nicks arbete med [Koa-ramverket](https://github.com/koajs/koa) – ett modernt, lättare alternativ till Express, också skapat av TJ Holowaychuk – visar ytterligare hans engagemang för bättre webbutvecklingsverktyg. Hans Koa-bidrag omfattar både problem och kod genom pull requests, felhantering, innehållstypshantering och dokumentationsförbättringar.

Hans arbete med både Express och Koa ger honom en unik inblick i webbutveckling med Node.js, vilket hjälper vårt team att skapa paket som fungerar bra med flera ramverksekosystem.

### Från individuell bidragsgivare till organisationsledare {#from-individual-contributor-to-organization-leader}

Det som började med att hjälpa befintliga projekt växte till att skapa och underhålla ekosystem för hela paket. Nick grundade flera GitHub-organisationer – inklusive [Stuga](https://github.com/cabinjs), [Skräppostskanner](https://github.com/spamscanner), [Vidarebefordra e-post](https://github.com/forwardemail), [Pojke](https://github.com/ladjs) och [Bree](https://github.com/breejs) – som var och en löste specifika behov inom JavaScript-communityn.

Detta skifte från bidragsgivare till ledare visar Nicks vision för väldesignad programvara som löser verkliga problem. Genom att organisera relaterade paket under fokuserade GitHub-organisationer har han byggt verktygsekosystem som fungerar tillsammans samtidigt som de förblir modulära och flexibla för den bredare utvecklargemenskapen.

## Våra GitHub-organisationer: Innovationens ekosystem {#our-github-organizations-ecosystems-of-innovation}

Vi organiserar vårt arbete med öppen källkod kring fokuserade GitHub-organisationer, där var och en löser specifika behov inom JavaScript. Denna struktur skapar sammanhängande paketfamiljer som fungerar bra tillsammans samtidigt som de förblir modulära.

### Kabin: Strukturerad loggning för moderna applikationer {#cabin-structured-logging-for-modern-applications}

[Stugorganisation](https://github.com/cabinjs) är vår tolkning av enkel och kraftfull apploggning. Huvudpaketet [`cabin`](https://github.com/cabinjs/cabin) har nästan 900 GitHub-stjärnor och över 100 000 nedladdningar varje vecka\[^1]. Cabin tillhandahåller strukturerad loggning som fungerar med populära tjänster som Sentry, LogDNA och Papertrail.

Det som gör Cabin speciellt är dess genomtänkta API- och plugin-system. Att stödja paket som [`axe`](https://github.com/cabinjs/axe) för Express middleware och [`parse-request`](https://github.com/cabinjs/parse-request) för HTTP-förfrågningsparsing visar vårt engagemang för kompletta lösningar snarare än isolerade verktyg.

Paketet [`bson-objectid`](https://github.com/cabinjs/bson-objectid) förtjänar ett särskilt omnämnande, med över 1,7 miljoner nedladdningar på bara två månader\[^2]. Denna lätta MongoDB ObjectID-implementering har blivit det självklara valet för utvecklare som behöver ID:n utan fullständiga MongoDB-beroenden.

### Skräppostskanner: Bekämpa e-postmissbruk {#spam-scanner-fighting-email-abuse}

[Spam Scanner-organisation](https://github.com/spamscanner) visar vårt engagemang för att lösa verkliga problem. Huvudpaketet [`spamscanner`](https://github.com/spamscanner/spamscanner) erbjuder avancerad detektering av skräppost i e-post, men det är [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-paketet som har fått ett fantastiskt genomslag.

Med över 1,2 miljoner nedladdningar på två månader\[^3] åtgärdar `url-regex-safe` kritiska säkerhetsproblem i andra reguljära uttryck för URL-detektering. Det här paketet visar vår strategi för öppen källkod: att hitta ett vanligt problem (i det här fallet [Gör om](https://en.wikipedia.org/wiki/ReDoS)-sårbarheter i URL-validering), skapa en solid lösning och underhålla den noggrant.

### Bree: Modern jobbschemaläggning med arbetartrådar {#bree-modern-job-scheduling-with-worker-threads}

[Bree-organisationen](https://github.com/breejs) är vårt svar på en vanlig Node.js-utmaning: tillförlitlig jobbschemaläggning. Huvudpaketet [`bree`](https://github.com/breejs/bree), med över 3 100 GitHub-stjärnor, tillhandahåller en modern jobbschemaläggare som använder Node.js-arbetstrådar för bättre prestanda och tillförlitlighet.

> \[!NOTE]
> Bree skapades efter att vi hjälpte till att underhålla [Dagordning](https://github.com/agenda/agenda) och använde lärdomar för att bygga en bättre jobbschemaläggare. Våra bidrag till agendan hjälpte oss att hitta sätt att förbättra jobbschemaläggningen.

Vad som skiljer Bree från andra schemaläggare som Agenda:

* **Inga externa beroenden**: Till skillnad från Agenda som behöver MongoDB, kräver Bree inte Redis eller MongoDB för att hantera jobbstatus.
* **Arbetstrådar**: Bree använder Node.js-arbetstrådar för sandlådeprocesser, vilket ger bättre isolering och prestanda.
* **Enkelt API**: Bree erbjuder detaljerad kontroll med enkelhet, vilket gör det enklare att implementera komplexa schemaläggningsbehov.
* **Inbyggt stöd**: Saker som smidig omladdning, cron-jobb, datum och användarvänliga tider ingår som standard.

Bree är en viktig del av [forwardemail.net](https://github.com/forwardemail/forwardemail.net) och hanterar kritiska bakgrundsuppgifter som e-postbehandling, rensning och schemalagt underhåll. Att använda Bree i Vidarebefordra e-post visar vårt engagemang för att använda våra egna verktyg i produktion och säkerställa att de uppfyller höga tillförlitlighetsstandarder.

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

[`@ladjs/passport`](https://github.com/ladjs/passport) utökar den populära autentiseringsmellanprogramvaran Passport.js med specifika förbättringar för moderna webbapplikationer. Det här paketet stöder flera autentiseringsstrategier direkt:

* Lokal autentisering med e-post
* Logga in med Apple
* GitHub-autentisering
* Google-autentisering
* Autentisering med engångslösenord (OTP)

Paketet är mycket anpassningsbart, vilket gör det möjligt för utvecklare att justera fältnamn och fraser för att matcha deras applikations krav. Det är utformat för att integreras sömlöst med Mongoose för användarhantering, vilket gör det till en idealisk lösning för Koa-baserade applikationer som behöver robust autentisering.

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

[Upptidsorganisation](https://github.com/upptime) representerar vårt engagemang för transparent övervakning med öppen källkod. Det huvudsakliga [`upptime`](https://github.com/upptime/upptime)-arkivet har över 13 000 GitHub-stjärnor, vilket gör det till ett av de mest populära projekten vi bidrar till. Upptime tillhandahåller en GitHub-driven drifttidsövervakning och statussida som fungerar helt utan en server.

Vi använder Upptime för vår egen statussida på <https://status.forwardemail.net> med källkoden tillgänglig på <https://github.com/forwardemail/status.forwardemail.net>.

Det som gör Uptime speciellt är dess arkitektur:

* **100 % öppen källkod**: Varje komponent är helt öppen källkod och anpassningsbar.
* **Drivs av GitHub**: Utnyttjar GitHub-åtgärder, problem och sidor för en serverlös övervakningslösning.
* **Ingen server krävs**: Till skillnad från traditionella övervakningsverktyg kräver inte Upptime att du kör eller underhåller en server.
* **Automatisk statussida**: Genererar en snygg statussida som kan lagras på GitHub-sidor.
* **Kraftfulla aviseringar**: Integreras med olika aviseringskanaler, inklusive e-post, SMS och Slack.

För att förbättra våra användares upplevelse har vi integrerat [@octokit/core](https://github.com/octokit/core.js/) i forwardemail.net-kodbasen för att visa statusuppdateringar och incidenter i realtid direkt på vår webbplats. Denna integration ger tydlig transparens för våra användare vid problem i hela vår stack (webbplats, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) med omedelbara toast-aviseringar, ändringar av badge-ikoner, varningsfärger och mer.

@octokit/core-biblioteket låter oss hämta realtidsdata från vårt Upptime GitHub-arkiv, bearbeta den och visa den på ett användarvänligt sätt. När en tjänst har ett avbrott eller försämrad prestanda meddelas användarna omedelbart via visuella indikatorer utan att behöva lämna huvudapplikationen. Denna sömlösa integration säkerställer att våra användare alltid har uppdaterad information om vår systemstatus, vilket ökar transparens och förtroende.

Uptime har anammats av hundratals organisationer som letar efter ett transparent och tillförlitligt sätt att övervaka sina tjänster och kommunicera status till användare. Projektets framgång visar kraften i att bygga verktyg som utnyttjar befintlig infrastruktur (i det här fallet GitHub) för att lösa vanliga problem på nya sätt.

## Våra bidrag till ekosystemet för vidarebefordran av e-post {#our-contributions-to-the-forward-email-ecosystem}

Även om våra paket med öppen källkod används av utvecklare över hela världen, utgör de också grunden för vår egen tjänst för vidarebefordran av e-post. Denna dubbla roll – som både skapare och användare av dessa verktyg – ger oss ett unikt perspektiv på deras tillämpning i verkligheten och driver kontinuerlig förbättring.

### Från paket till produktion {#from-packages-to-production}

Resan från individuella paket till ett sammanhängande produktionssystem innebär noggrann integration och utökning. För vidarebefordran av e-post inkluderar denna process:

* **Anpassade tillägg**: Bygga tillägg specifika för vidarebefordran av e-post till våra paket med öppen källkod som uppfyller våra unika krav.

* **Integrationsmönster**: Utveckla mönster för hur dessa paket interagerar i en produktionsmiljö.

* **Prestandaoptimeringar**: Identifiera och åtgärda prestandaflaskhalsar som bara uppstår i stor skala.

* **Säkerhetshärdning**: Lägga till ytterligare säkerhetslager specifika för e-posthantering och skydd av användardata.

Detta arbete representerar tusentals utvecklingstimmar utöver själva kärnpaketen, vilket resulterar i en robust och säker e-posttjänst som utnyttjar det bästa av våra bidrag med öppen källkod.

### Återkopplingsslingan {#the-feedback-loop}

Den kanske mest värdefulla aspekten av att använda våra egna paket i produktion är den feedback-loop det skapar. När vi stöter på begränsningar eller edge-fall i Vidarebefordra e-post, patchar vi dem inte bara lokalt – vi förbättrar de underliggande paketen, vilket gynnar både vår tjänst och den bredare communityn.

Denna metod har lett till många förbättringar:

* **Brees smidiga avstängning**: Vidarebefordran av e-posts behov av driftsättningar utan driftstopp ledde till förbättrade smidiga avstängningsfunktioner i Bree.
* **Spam Scanners mönsterigenkänning**: Verkliga spammönster som påträffas i vidarebefordran av e-post har informerat Spam Scanners detekteringsalgoritmer.
* **Cabins prestandaoptimeringar**: Loggning av hög volym i produktionen avslöjade optimeringsmöjligheter i Cabin som gynnar alla användare.

Genom att upprätthålla denna positiva cirkel mellan vårt arbete med öppen källkod och produktionstjänster säkerställer vi att våra paket förblir praktiska, väl beprövade lösningar snarare än teoretiska implementeringar.

## Kärnprinciper för vidarebefordran av e-post: En grund för excellens {#forward-emails-core-principles-a-foundation-for-excellence}

Vidarebefordran av e-post är utformad enligt en uppsättning kärnprinciper som vägleder alla våra utvecklingsbeslut. Dessa principer, som beskrivs i vår [webbplats](/blog/docs/best-quantum-safe-encrypted-email-service#principles), säkerställer att vår tjänst förblir utvecklarvänlig, säker och fokuserad på användarnas integritet.

### Alltid utvecklarvänlig, säkerhetsfokuserad och transparent {#always-developer-friendly-security-focused-and-transparent}

Vår första och viktigaste princip är att skapa programvara som är utvecklarvänlig samtidigt som vi upprätthåller högsta möjliga standard för säkerhet och integritet. Vi anser att teknisk excellens aldrig ska ske på bekostnad av användbarhet, och att transparens bygger förtroende i vår community.

Denna princip syns i vår detaljerade dokumentation, tydliga felmeddelanden och öppna kommunikation om både framgångar och utmaningar. Genom att göra hela vår kodbas öppen källkod inbjuder vi till granskning och samarbete, vilket stärker både vår programvara och det bredare ekosystemet.

### Efterlevnad av beprövade principer för programvaruutveckling {#adherence-to-time-tested-software-development-principles}

Vi följer flera etablerade principer för mjukvaruutveckling som har bevisat sitt värde under årtionden:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separera problem genom Model-View-Controller-mönstret
* **[Unix-filosofi](https://en.wikipedia.org/wiki/Unix_philosophy)**: Skapa modulära komponenter som gör en sak bra
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Hålla det enkelt och rakt på sak
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Upprepa inte dig själv, främja återanvändning av kod
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du kommer inte att behöva det, undvika för tidig optimering
* **[Tolv Faktorer](https://12factor.net/)**: Följa bästa praxis för att bygga moderna, skalbara applikationer
* **[Occams rakkniv](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Att välja den enklaste lösningen som uppfyller kraven
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Använda våra egna produkter i stor utsträckning

Dessa principer är inte bara teoretiska koncept – de är inbäddade i våra dagliga utvecklingsmetoder. Till exempel är vår anslutning till Unix-filosofin tydlig i hur vi har strukturerat våra npm-paket: små, fokuserade moduler som kan sättas samman för att lösa komplexa problem.

### Riktar sig mot den snabba, bootstrappade utvecklaren {#targeting-the-scrappy-bootstrapped-developer}

Vi riktar oss specifikt till scrappy-utvecklare, bootstrappe-utvecklare och [ramen-lönsam](https://www.paulgraham.com/ramenprofitable.html)-utvecklare. Detta fokus formar allt från vår prissättningsmodell till våra tekniska beslut. Vi förstår utmaningarna med att bygga produkter med begränsade resurser eftersom vi själva har varit där.

Denna princip är särskilt viktig i hur vi närmar oss öppen källkod. Vi skapar och underhåller paket som löser verkliga problem för utvecklare utan företagsbudgetar, vilket gör kraftfulla verktyg tillgängliga för alla oavsett resurser.

### Principer i praktiken: Kodbasen för vidarebefordran av e-post {#principles-in-practice-the-forward-email-codebase}

Dessa principer syns tydligt i kodbasen för vidarebefordran av e-post. Vår package.json-fil visar ett genomtänkt urval av beroenden, vart och ett valt för att anpassa sig till våra kärnvärden:

* Säkerhetsfokuserade paket som `mailauth` för e-postautentisering
* Utvecklarvänliga verktyg som `preview-email` för enklare felsökning
* Modulära komponenter som de olika `p-*`-verktygen från Sindre Sorhus

Genom att följa dessa principer konsekvent över tid har vi byggt en tjänst som utvecklare kan lita på med sin e-postinfrastruktur – säker, pålitlig och i linje med värderingarna inom öppen källkodsgemenskapen.

### Inbyggd integritetsskydd {#privacy-by-design}

Sekretess är inte en eftertanke eller marknadsföringsfunktion för vidarebefordran av e-post – det är en grundläggande designprincip som genomsyrar varje aspekt av vår tjänst och kod:

* **Nollåtkomstkryptering**: Vi har implementerat system som gör det tekniskt omöjligt för oss att läsa användarnas e-postmeddelanden.
* **Minimal datainsamling**: Vi samlar endast in de uppgifter som är nödvändiga för att tillhandahålla vår tjänst, inget mer.
* **Transparenta policyer**: Vår integritetspolicy är skriven på ett tydligt och begripligt språk utan juridisk jargong.
* **Verifiering av öppen källkod**: Vår kodbas med öppen källkod gör det möjligt för säkerhetsforskare att verifiera våra integritetspåståenden.

Detta åtagande gäller även våra paket med öppen källkod, som är utformade med bästa praxis för säkerhet och integritet inbyggda från grunden.

### Hållbar öppen källkod {#sustainable-open-source}

Vi anser att öppen källkodsprogramvara behöver hållbara modeller för att blomstra på lång sikt. Vår strategi inkluderar:

* **Kommersiell support**: Erbjuder premiumsupport och tjänster kring våra verktyg med öppen källkod.
* **Balanserad licensiering**: Använder licenser som skyddar både användarfriheter och projektets hållbarhet.
* **Communityengagemang**: Aktivt engagerar sig med bidragsgivare för att bygga en stödjande community.
* **Transparenta färdplaner**: Delar våra utvecklingsplaner så att användarna kan planera därefter.

Genom att fokusera på hållbarhet säkerställer vi att våra bidrag med öppen källkod kan fortsätta växa och förbättras över tid snarare än att försummas.

## Siffrorna ljuger inte: Vår häpnadsväckande npm-nedladdningsstatistik {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

När vi pratar om effekten av öppen källkodsprogramvara ger nedladdningsstatistik ett konkret mått på implementering och förtroende. Många av de paket vi hjälper till att underhålla har nått en skala som få öppen källkodsprojekt någonsin uppnår, med sammanlagda nedladdningar som uppgår till miljarder.

![Topp npm-paket efter nedladdningar](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Även om vi är stolta över att kunna underhålla flera mycket nedladdade paket i JavaScript-ekosystemet, vill vi erkänna att många av dessa paket ursprungligen skapades av andra begåvade utvecklare. Paket som superagent och supertest skapades ursprungligen av TJ Holowaychuk, vars produktiva bidrag till öppen källkod har varit avgörande för att forma Node.js-ekosystemet.

### En överblick över vår påverkan {#a-birds-eye-view-of-our-impact}

Under bara tvåmånadersperioden från februari till mars 2025, de bästa paketen vi bidrar till och hjälper till att upprätthålla rekordhöga nedladdningssiffror:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 nedladdningar\[^7] (ursprungligen skapad av TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 nedladdningar\[^8] (ursprungligen skapad av TJ Holowaychuk)
* **[också](https://www.npmjs.com/package/koa)**: 28 539 295 nedladdningar\[^34] (ursprungligen skapad av TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 nedladdningar\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 nedladdningar\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 nedladdningar\[^37]
* **[förhandsgransknings-e-post](https://www.npmjs.com/package/preview-email)**: 2 500 000 nedladdningar\[^9]
* **[stuga](https://www.npmjs.com/package/cabin)**: 1 800 000 nedladdningar\[^10]
* **[@breejs/senare](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 nedladdningar\[^38]
* **[e-postmallar](https://www.npmjs.com/package/email-templates)**: 1 128 139 nedladdningar\[^39]
* **__PROTECTED_LINK_259__0**: 1 124 686 nedladdningar\[^40]
* **__PROTECTED_LINK_259__1**: 1 200 000 nedladdningar\[^11]
* **__PROTECTED_LINK_259__2**: 894 666 nedladdningar\[^41]
* **__PROTECTED_LINK_259__3**: 839 585 nedladdningar\[^42]
* **__PROTECTED_LINK_259__4**: 145 000 nedladdningar\[^12]
* **__PROTECTED_LINK_259__5**: 24 270 nedladdningar\[^30]

> \[!NOTE]
> Flera andra paket som vi hjälper till att underhålla men inte skapat har ännu högre nedladdningsantal, inklusive `form-data` (738+ miljoner nedladdningar), `toidentifier` (309+ miljoner nedladdningar), `stackframe` (116+ miljoner nedladdningar) och `error-stack-parser` (113+ miljoner nedladdningar). Vi är hedrade att bidra till dessa paket samtidigt som vi respekterar deras ursprungliga författars arbete.

Det här är inte bara imponerande siffror – de representerar riktiga utvecklare som löser verkliga problem med kod som vi hjälper till att underhålla. Varje nedladdning är ett exempel där dessa paket har hjälpt någon att bygga något meningsfullt, från hobbyprojekt till företagsapplikationer som används av miljontals.

![Paketkategorier Distribution](/img/art/category_pie_chart.svg)

### Daglig påverkan i stor skala {#daily-impact-at-scale}

De dagliga nedladdningsmönstren visar på en konsekvent användning med höga volymer, med toppar som når miljontals nedladdningar per dag\[^13]. Denna konsekvens visar på stabiliteten och tillförlitligheten hos dessa paket – utvecklare testar dem inte bara; de integrerar dem i sina kärnarbetsflöden och förlitar sig på dem dag efter dag.

Veckovisa nedladdningsmönster visar ännu mer imponerande siffror, som konsekvent ligger runt tiotals miljoner nedladdningar per vecka\[^14]. Detta representerar ett massivt fotavtryck i JavaScript-ekosystemet, med dessa paket som körs i produktionsmiljöer över hela världen.

### Bortom de råa siffrorna {#beyond-the-raw-numbers}

Även om nedladdningsstatistiken i sig är imponerande, berättar den en djupare historia om det förtroende som gemenskapen har för dessa paket. Att underhålla paket i denna skala kräver ett orubbligt engagemang för att:

* **Bakåtkompatibilitet**: Ändringar måste noggrant övervägas för att undvika att befintliga implementeringar störs.
* **Säkerhet**: Med miljontals applikationer som är beroende av dessa paket kan säkerhetsproblem få långtgående konsekvenser.
* **Prestanda**: I denna skala kan även mindre prestandaförbättringar ha betydande sammanlagda fördelar.
* **Dokumentation**: Tydlig och omfattande dokumentation är avgörande för paket som används av utvecklare på alla erfarenhetsnivåer.

Den ständiga ökningen av nedladdningsantal över tid återspeglar framgången med att uppfylla dessa åtaganden och bygga förtroende hos utvecklarcommunityn genom pålitliga och väl underhållna paket.

## Stödjer ekosystemet: Våra sponsorskap med öppen källkod {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Hållbarhet med öppen källkod handlar inte bara om att bidra med kod – det handlar också om att stödja utvecklarna som underhåller kritisk infrastruktur.

Utöver våra direkta bidrag till JavaScript-ekosystemet är vi stolta över att sponsra framstående Node.js-bidragsgivare vars arbete utgör grunden för många moderna applikationer. Våra sponsorskap inkluderar:

### Andris Reinman: Pionjär inom e-postinfrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) är skaparen av [Nodemailer](https://github.com/nodemailer/nodemailer), det populäraste e-postbiblioteket för Node.js med över 14 miljoner nedladdningar varje vecka\[^15]. Hans arbete sträcker sig till andra kritiska komponenter i e-postinfrastrukturen som [SMTP-server](https://github.com/nodemailer/smtp-server), [E-postparser](https://github.com/nodemailer/mailparser) och [Vildanka](https://github.com/nodemailer/wildduck).

Vårt sponsorskap bidrar till att säkerställa fortsatt underhåll och utveckling av dessa viktiga verktyg som driver e-postkommunikation för otaliga Node.js-applikationer, inklusive vår egen vidarebefordran av e-post.

### Sindre Sorhus: Utility Package Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sørhus](https://github.com/sindresorhus) är en av de mest produktiva bidragsgivarna med öppen källkod i JavaScript-ekosystemet, med över 1 000 npm-paket i bagaget. Hans verktyg som [p-karta](https://github.com/sindresorhus/p-map), [för-återförsök](https://github.com/sindresorhus/p-retry) och [är-ström](https://github.com/sindresorhus/is-stream) är grundläggande byggstenar som används i hela Node.js-ekosystemet.

Genom att sponsra Sindres arbete hjälper vi till att upprätthålla utvecklingen av dessa viktiga verktyg som gör JavaScript-utveckling mer effektiv och tillförlitlig.

Dessa sponsorskap återspeglar vårt engagemang för det bredare ekosystemet med öppen källkod. Vi inser att vår egen framgång bygger på den grund som lagts av dessa och andra bidragsgivare, och vi är engagerade i att säkerställa hållbarheten i hela ekosystemet.

## Avslöjar säkerhetsproblem i JavaScript-ekosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vårt engagemang för öppen källkod sträcker sig bortom funktionsutveckling och inkluderar att identifiera och åtgärda säkerhetsbrister som kan påverka miljontals utvecklare. Flera av våra viktigaste bidrag till JavaScript-ekosystemet har varit inom säkerhetsområdet.

### Koa-routerns räddning {#the-koa-router-rescue}

I februari 2019 identifierade Nick ett kritiskt problem med underhållet av det populära koa-router-paketet. När han [rapporterade på Hacker News](https://news.ycombinator.com/item?id=19156707) hade paketet övergivits av den ursprungliga ansvariga, vilket lämnade säkerhetsbrister oåtgärdade och communityn utan uppdateringar.

> \[!WARNING]
> Övergivna paket med säkerhetsbrister utgör betydande risker för hela ekosystemet, särskilt när de laddas ner miljontals gånger i veckan.

Som svar skapade Nick [@koa/router](https://github.com/koajs/router) och hjälpte till att varna communityn om situationen. Han har underhållit detta viktiga paket sedan dess och säkerställt att Koa-användare har en säker och väl underhållen routinglösning.

### Åtgärda ReDoS-sårbarheter {#addressing-redos-vulnerabilities}

År 2020 identifierade och åtgärdade Nick en kritisk [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-sårbarhet i det allmänt använda `url-regex`-paketet. Denna sårbarhet ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kunde göra det möjligt för angripare att orsaka överbelastning genom att tillhandahålla specialskriven inmatning som orsakade katastrofala backtracking i det reguljära uttrycket.

Istället för att bara uppdatera det befintliga paketet skapade Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en helt omskriven implementering som åtgärdar sårbarheten samtidigt som den bibehåller kompatibiliteten med det ursprungliga API:et. Han publicerade också en [omfattande blogginlägg](/blog/docs/url-regex-javascript-node-js) som förklarar sårbarheten och hur man kan mildra den.

Det här arbetet visar vår syn på säkerhet: inte bara att åtgärda problem utan att utbilda samhället och tillhandahålla robusta alternativ som förhindrar liknande problem i framtiden.

### Förespråkar Node.js och Chromium-säkerhet {#advocating-for-nodejs-and-chromium-security}

Nick har också varit aktiv i att förespråka säkerhetsförbättringar i det bredare ekosystemet. I augusti 2020 identifierade han ett betydande säkerhetsproblem i Node.js relaterat till dess hantering av HTTP-headers, vilket rapporterades i [Registret](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Det här problemet, som härrörde från en patch i Chromium, kunde potentiellt göra det möjligt för angripare att kringgå säkerhetsåtgärder. Nicks opinionsbildning bidrog till att problemet åtgärdades snabbt, vilket skyddade miljontals Node.js-applikationer från potentiell exploatering.

### Säkrar npm-infrastruktur {#securing-npm-infrastructure}

Senare samma månad identifierade Nick ytterligare ett kritiskt säkerhetsproblem, den här gången i npms e-postinfrastruktur. Som rapporterats i [Registret](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) implementerade inte npm e-postautentiseringsprotokollen DMARC, SPF och DKIM korrekt, vilket potentiellt gjorde det möjligt för angripare att skicka nätfiskemejl som verkade komma från npm.

Nicks rapport ledde till förbättringar av npms e-postsäkerhet, vilket skyddade de miljontals utvecklare som förlitar sig på npm för pakethantering från potentiella nätfiskeattacker.

## Våra bidrag till ekosystemet för vidarebefordran av e-post {#our-contributions-to-the-forward-email-ecosystem-1}

Vidarebefordra e-post är byggt ovanpå flera viktiga öppen källkodsprojekt, inklusive Nodemailer, WildDuck och mailauth. Vårt team har gjort betydande bidrag till dessa projekt och hjälpt till att identifiera och åtgärda djupgående problem som påverkar e-postleverans och säkerhet.

### Förbättrar Nodemailers kärnfunktionalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) är grunden för e-postutskick i Node.js, och våra bidrag har bidragit till att göra det mer robust:

* **Förbättringar av SMTP-servern**: Vi har åtgärdat parsningsfel, problem med hantering av strömmar och TLS-konfigurationsproblem i SMTP-serverkomponenten\[^16]\[^17].
* **Förbättringar av e-postparser**: Vi har åtgärdat fel i avkodning av teckensekvenser och åtgärdat parserproblem som kan orsaka fel i e-postbearbetningen\[^18]\[^19].

Dessa bidrag säkerställer att Nodemailer förblir en pålitlig grund för e-postbehandling i Node.js-applikationer, inklusive vidarebefordran av e-post.

### Avancerad e-postautentisering med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tillhandahåller viktiga funktioner för e-postautentisering, och våra bidrag har avsevärt förbättrat dess funktioner:

* **Förbättringar av DKIM-verifiering**: Vi upptäckte och rapporterade att X/Twitter hade problem med DNS-cache som orsakade DKIM-fel för deras utgående meddelanden, och rapporterade detta på Hacker One\[^20].
* **Förbättringar av DMARC och ARC**: Vi har åtgärdat problem med DMARC- och ARC-verifiering som kunde leda till felaktiga autentiseringsresultat\[^21]\[^22].
* **Prestandaoptimeringar**: Vi har bidragit med optimeringar som förbättrar prestandan för e-postautentiseringsprocesser\[^23]\[^24]\[^25]\[^26].

Dessa förbättringar bidrar till att säkerställa att e-postautentisering är korrekt och tillförlitlig, vilket skyddar användare från nätfiske- och förfalskningsattacker.

### Förbättringar av nyckeldrifttid {#key-upptime-enhancements}

Våra bidrag till Uptime inkluderar:

* **Övervakning av SSL-certifikat**: Vi har lagt till funktionalitet för att övervaka när SSL-certifikat löper ut, vilket förhindrar oväntade driftstopp på grund av utgångna certifikat\[^27].
* **Stöd för flera SMS-nummer**: Vi har implementerat stöd för att varna flera teammedlemmar via SMS när incidenter inträffar, vilket förbättrar svarstiderna\[^28].
* **Åtgärder för IPv6-kontroll**: Vi har åtgärdat problem med IPv6-anslutningskontroller, vilket säkerställer mer exakt övervakning i moderna nätverksmiljöer\[^29].
* **Stöd för mörkt/ljust läge**: Vi har lagt till temasköd för att förbättra användarupplevelsen på statussidor\[^31].
* **Bättre stöd för TCP-ping**: Vi har förbättrat TCP-pingfunktionen för att ge mer tillförlitlig anslutningstestning\[^32].

Dessa förbättringar gynnar inte bara statusövervakningen av Forward Email, utan är också tillgängliga för hela Uptime-användargruppen, vilket visar vårt engagemang för att förbättra de verktyg vi är beroende av.

## Limmet som håller ihop allt: Anpassad kod i stor skala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Även om våra npm-paket och bidrag till befintliga projekt är betydande, är det den anpassade koden som integrerar dessa komponenter som verkligen visar upp vår tekniska expertis. Kodbasen för vidarebefordran av e-post representerar ett decennium av utvecklingsarbete, som går tillbaka till 2017 då projektet startade som [gratis vidarebefordran av e-post](https://github.com/forwardemail/free-email-forwarding) innan det slogs samman till ett monorepo.

### En massiv utvecklingsinsats {#a-massive-development-effort}

Omfattningen av denna anpassade integrationskod är imponerande:

* **Totala bidrag**: Över 3 217 commits
* **Kodbasstorlek**: Över 421 545 rader kod i JavaScript-, Pug-, CSS- och JSON-filer\[^33]

Detta representerar tusentals timmar av utvecklingsarbete, felsökningssessioner och prestandaoptimeringar. Det är den "hemliga ingrediensen" som förvandlar enskilda paket till en sammanhängande och pålitlig tjänst som används av tusentals kunder dagligen.

### Integrering av kärnberoenden {#core-dependencies-integration}

Kodbasen för vidarebefordran av e-post integrerar många beroenden till en sömlös helhet:

* **E-postbehandling**: Integrerar Nodemailer för sändning, SMTP-server för mottagning och Mailparser för parsning
* **Autentisering**: Använder Mailauth för DKIM-, SPF-, DMARC- och ARC-verifiering
* **DNS-upplösning**: Använder Tangerine för DNS-över-HTTPS med global cachning
* **MX-anslutning**: Använder mx-connect med Tangerine-integration för pålitliga e-postserveranslutningar
* **Jobbschemaläggning**: Använder Bree för pålitlig bakgrundsbearbetning av uppgifter med arbetstrådar
* **Mallering**: Använder e-postmallar för att återanvända stilmallar från webbplatsen i kundkommunikation
* **E-postlagring**: Implementerar individuellt krypterade SQLite-postlådor med hjälp av better-sqlite3-multiple-chiffer med ChaCha20-Poly1305-kryptering för kvantsäker integritet, vilket säkerställer fullständig isolering mellan användare och att endast användaren har åtkomst till sin postlåda

Var och en av dessa integrationer kräver noggrant övervägande av edge-fall, prestandakonsekvenser och säkerhetsproblem. Resultatet är ett robust system som hanterar miljontals e-posttransaktioner tillförlitligt. Vår SQLite-implementering utnyttjar också msgpackr för effektiv binär serialisering och WebSockets (via ws) för statusuppdateringar i realtid över vår infrastruktur.

### DNS-infrastruktur med Tangerine och mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En viktig del av infrastrukturen för vidarebefordran av e-post är vårt DNS-upplösningssystem, byggt kring två nyckelpaket:

* **[Mandarin](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vår Node.js DNS-over-HTTPS-implementering erbjuder en drop-in-ersättning för standard DNS-resolvern, med inbyggda återförsök, timeouts, smart serverrotation och stöd för cachning.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Detta paket upprättar TCP-anslutningar till MX-servrar, tar en måldomän eller e-postadress, matchar lämpliga MX-servrar och ansluter till dem i prioritetsordning.

Vi har integrerat Tangerine med mx-connect via [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), vilket säkerställer DNS på applikationsnivå över HTTP-förfrågningar i hela Forward Email. Detta ger global cachning för DNS i stor skala med 1:1-konsekvens över alla regioner, appar eller processer – avgörande för tillförlitlig e-postleverans i ett distribuerat system.

## Företagspåverkan: Från öppen källkod till verksamhetskritiska lösningar {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kulmineringen av vår decennielånga resa inom utveckling av öppen källkod har gjort det möjligt för Forward Email att betjäna inte bara enskilda utvecklare utan även stora företag och utbildningsinstitutioner som utgör ryggraden i själva rörelsen för öppen källkod.

### Fallstudier inom verksamhetskritisk e-postinfrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Vårt engagemang för tillförlitlighet, integritet och principer för öppen källkod har gjort Forward Email till det betrodda valet för organisationer med krävande e-postkrav:

* **Utbildningsinstitutioner**: Som beskrivs i vår [fallstudie om vidarebefordran av e-post för alumner]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), och stora universitet förlitar sig på vår infrastruktur för att upprätthålla livslånga kontakter med hundratusentals alumner genom pålitliga e-postvidarebefordringstjänster.

* **Linuxlösningar för företag**: [Fallstudie om Canonical Ubuntu-e-post för företag](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) visar hur vår öppen källkodsstrategi passar perfekt ihop med behoven hos Linux-leverantörer för företag, vilket ger dem den transparens och kontroll de behöver.

* **Grundläggande för öppen källkod**: Det kanske mest validerande är vårt partnerskap med Linux Foundation, vilket dokumenteras i [Fallstudie om e-postföretag i Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), där vår tjänst driver kommunikationen för just den organisation som ansvarar för Linux-utvecklingen.

Det finns en vacker symmetri i hur våra paket med öppen källkod, som har underhållits med omsorg under många år, har gjort det möjligt för oss att bygga en e-posttjänst som nu stöder just de samhällen och organisationer som förespråkar programvara med öppen källkod. Denna helcirkelresa – från att bidra med individuella paket till att driva e-postinfrastruktur i företagsklass för ledare inom öppen källkod – representerar den ultimata valideringen av vår strategi för programvaruutveckling.

## Ett decennium av öppen källkod: En blick framåt {#a-decade-of-open-source-looking-forward}

När vi ser tillbaka på ett decennium av bidrag med öppen källkod och framåt mot de kommande tio åren, är vi fyllda av tacksamhet för den gemenskap som har stöttat vårt arbete och entusiasm inför vad som komma skall.

Vår resa från individuella paketbidragsgivare till att hantera en omfattande e-postinfrastruktur som används av stora företag och öppen källkodsstiftelser har varit anmärkningsvärd. Det är ett bevis på kraften i öppen källkodsutveckling och den inverkan som genomtänkt, väl underhållen programvara kan ha på det bredare ekosystemet.

Under de kommande åren är vi fast beslutna att:

* **Fortsätter att underhålla och förbättra våra befintliga paket** och säkerställer att de förblir pålitliga verktyg för utvecklare över hela världen.
* **Utökar våra bidrag till kritiska infrastrukturprojekt**, särskilt inom e-post och säkerhet.
* **Förbättrar funktionerna för vidarebefordran av e-post** samtidigt som vi bibehåller vårt engagemang för integritet, säkerhet och transparens.
* **Stödjer nästa generations bidragsgivare med öppen källkod** genom mentorskap, sponsring och samhällsengagemang.

Vi tror att framtiden för mjukvaruutveckling är öppen, samarbetsinriktad och byggd på en grund av förtroende. Genom att fortsätta bidra med högkvalitativa, säkerhetsfokuserade paket till JavaScript-ekosystemet hoppas vi kunna spela en liten roll i att bygga den framtiden.

Tack till alla som har använt våra paket, bidragit till våra projekt, rapporterat problem eller helt enkelt spridit budskapet om vårt arbete. Ert stöd har gjort detta decennium av påverkan möjligt, och vi ser fram emot att se vad vi kan åstadkomma tillsammans under de kommande tio åren.

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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
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
\[^39]: npm-nedladdningsstatistik för e-postmallar, februari-mars 2025
\[^40]: npm-nedladdningsstatistik för get-paths, februari-mars 2025
\[^41]: npm-nedladdningsstatistik för dotenv-parse-variabler, februari-mars 2025
\[^42]: npm-nedladdningsstatistik för @koa/multer, februari-mars 2025