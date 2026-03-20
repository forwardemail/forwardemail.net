# Et årti med indflydelse: Hvordan vores npm-pakker nåede 1 milliard downloads og formede JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Pionererne, der stoler på os: Isaac Z. Schlueter og Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Fra npm's oprettelse til Node.js-lederskab](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bag koden: Nick Baughs rejse](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express tekniske udvalg og kernebidrag](#express-technical-committee-and-core-contributions)
  * [Koa framework-bidrag](#koa-framework-contributions)
  * [Fra individuel bidragyder til organisationsleder](#from-individual-contributor-to-organization-leader)
* [Vores GitHub-organisationer: Økosystemer af innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Struktureret logging til moderne applikationer](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Bekæmpelse af e-mail-misbrug](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderne jobplanlægning med worker threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Open source e-mail-infrastruktur](#forward-email-open-source-email-infrastructure)
  * [Lad: Væsentlige Koa-værktøjer og -hjælpemidler](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open source overvågning af oppetid](#upptime-open-source-uptime-monitoring)
* [Vores bidrag til Forward Email-økosystemet](#our-contributions-to-the-forward-email-ecosystem)
  * [Fra pakker til produktion](#from-packages-to-production)
  * [Feedback-loopet](#the-feedback-loop)
* [Forward Emails kerneprincipper: Et fundament for ekspertise](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Altid udviklervenligt, sikkerhedsorienteret og gennemsigtigt](#always-developer-friendly-security-focused-and-transparent)
  * [Overholdelse af tidstestede principper for softwareudvikling](#adherence-to-time-tested-software-development-principles)
  * [Målrettet den seje, bootstrappede udvikler](#targeting-the-scrappy-bootstrapped-developer)
  * [Principper i praksis: Forward Email-kodebasen](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Bæredygtig open source](#sustainable-open-source)
* [Tallene lyver ikke: Vores imponerende npm-downloadstatistikker](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Et overblik over vores indflydelse](#a-birds-eye-view-of-our-impact)
  * [Daglig indflydelse i stor skala](#daily-impact-at-scale)
  * [Ud over de rå tal](#beyond-the-raw-numbers)
* [Støtte til økosystemet: Vores open source-sponsorater](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pioner inden for e-mail-infrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mester i hjælpepakker](#sindre-sorhus-utility-package-mastermind)
* [Afsløring af sikkerhedssårbarheder i JavaScript-økosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Redningen af Koa-Router](#the-koa-router-rescue)
  * [Håndtering af ReDoS-sårbarheder](#addressing-redos-vulnerabilities)
  * [Fortalervirksomhed for Node.js og Chromium-sikkerhed](#advocating-for-nodejs-and-chromium-security)
  * [Sikring af npm-infrastruktur](#securing-npm-infrastructure)
* [Vores bidrag til Forward Email-økosystemet](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Forbedring af Nodemailers kernefunktionalitet](#enhancing-nodemailers-core-functionality)
  * [Fremme af e-mail-autentificering med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Vigtige Upptime-forbedringer](#key-upptime-enhancements)
* [Limningen, der holder det hele sammen: Tilpasset kode i stor skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv udviklingsindsats](#a-massive-development-effort)
  * [Integration af kerneafhængigheder](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine og mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Virksomhedspåvirkning: Fra open source til missionkritiske løsninger](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Case-studier i missionkritisk e-mail-infrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Et årti med open source: Ser fremad](#a-decade-of-open-source-looking-forward)
## Forord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript) og [Node.js](https://en.wikipedia.org/wiki/Node.js)-verdenen er nogle pakker essentielle—downloadet millioner af gange dagligt og driver apps verden over. Bag disse værktøjer står udviklere, der fokuserer på open source-kvalitet. I dag viser vi, hvordan vores team hjælper med at bygge og vedligeholde npm-pakker, der er blevet nøgledele af JavaScript-økosystemet.


## Pionererne, der stoler på os: Isaac Z. Schlueter og Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi er stolte af at have [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som bruger. Isaac skabte [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) og hjalp med at bygge [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans tillid til Forward Email viser vores fokus på kvalitet og sikkerhed. Isaac bruger Forward Email til flere domæner, herunder izs.me.

Isaacs indflydelse på JavaScript er enorm. I 2009 var han blandt de første til at se potentialet i Node.js og arbejdede sammen med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skabte platformen. Som Isaac sagde i et [interview med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Midt i dette meget lille fællesskab af en gruppe mennesker, der prøvede at finde ud af, hvordan man kunne få server-side JS til at fungere, kom Ryan Dahl med Node, som meget klart var den rigtige tilgang. Jeg satsede på det og blev meget involveret omkring midten af 2009."

> \[!NOTE]
> For dem, der er interesserede i Node.js' historie, findes der fremragende dokumentarer, der skildrer dens udvikling, herunder [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) og [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [personlige hjemmeside](https://tinyclouds.org/) indeholder også værdifulde indsigter i hans arbejde.

### Fra npm's skabelse til lederskab i Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac skabte npm i september 2009, med den første brugbare version udgivet i begyndelsen af 2010. Denne pakkehåndtering opfyldte et vigtigt behov i Node.js, idet den gjorde det nemt for udviklere at dele og genbruge kode. Ifølge [Node.js Wikipedia-siden](https://en.wikipedia.org/wiki/Node.js): "I januar 2010 blev der introduceret en pakkehåndtering til Node.js-miljøet kaldet npm. Pakkehåndteringen tillader programmører at publicere og dele Node.js-pakker sammen med den tilhørende kildekode og er designet til at forenkle installation, opdatering og afinstallation af pakker."

Da Ryan Dahl trak sig tilbage fra Node.js i januar 2012, overtog Isaac som projektleder. Som nævnt på [hans CV](https://izs.me/resume), "Ledede udviklingen af flere fundamentale Node.js core API'er, inklusive CommonJS-modulsystemet, filsystem-API'er og streams" og "Fungerede som BDFL (Benevolent Dictator For Life) for projektet i 2 år, hvilket sikrede stadigt stigende kvalitet og en pålidelig byggeproces for Node.js-versionerne v0.6 til v0.10."

Isaac ledte Node.js gennem en vigtig vækstperiode og satte standarder, der stadig former platformen i dag. Han startede senere npm, Inc. i 2014 for at støtte npm-registret, som han tidligere havde drevet alene.

Vi takker Isaac for hans enorme bidrag til JavaScript og fortsætter med at bruge mange af de pakker, han har skabt. Hans arbejde har ændret, hvordan vi bygger software, og hvordan millioner af udviklere deler kode verden over.


## Arkitekten bag koden: Nick Baughs rejse {#the-architect-behind-the-code-nick-baughs-journey}

Kernen i vores open source-succes er Nick Baugh, Forward Emails grundlægger og ejer. Hans arbejde med JavaScript strækker sig over næsten 20 år og har formet, hvordan utallige udviklere bygger apps. Hans open source-rejse viser både teknisk dygtighed og fællesskabslederskab.

### Express Technical Committee og kernebidrag {#express-technical-committee-and-core-contributions}

Nicks ekspertise inden for webframeworks sikrede ham en plads i [Express Technical Committee](https://expressjs.com/en/resources/community.html), hvor han hjalp med et af de mest brugte Node.js-frameworks. Nick er nu opført som inaktiv medlem på [Express community-siden](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express blev oprindeligt skabt af TJ Holowaychuk, en produktiv open source-bidragyder, som har formet meget af Node.js-økosystemet. Vi er taknemmelige for TJs grundlæggende arbejde og respekterer hans [beslutning om at tage en pause](https://news.ycombinator.com/item?id=37687017) fra hans omfattende open source-bidrag.

Som medlem af [Express Technical Committee](https://expressjs.com/en/resources/community.html) viste Nick stor opmærksomhed på detaljer i sager som at præcisere `req.originalUrl` dokumentationen og rette problemer med multipart form-håndtering.

### Koa Framework Bidrag {#koa-framework-contributions}

Nicks arbejde med [Koa framework](https://github.com/koajs/koa)—et moderne, lettere alternativ til Express, også skabt af TJ Holowaychuk—viser yderligere hans engagement i bedre webudviklingsværktøjer. Hans Koa-bidrag inkluderer både issues og kode gennem pull requests, der adresserer fejlbehandling, content type-håndtering og forbedringer af dokumentationen.

Hans arbejde på tværs af både Express og Koa giver ham et unikt indblik i Node.js webudvikling, hvilket hjælper vores team med at skabe pakker, der fungerer godt med flere framework-økosystemer.

### Fra Individuel Bidragyder til Organisationsleder {#from-individual-contributor-to-organization-leader}

Det, der startede som hjælp til eksisterende projekter, voksede til at skabe og vedligeholde hele pakkeøkosystemer. Nick grundlagde flere GitHub-organisationer—herunder [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) og [Bree](https://github.com/breejs)—hver især løser specifikke behov i JavaScript-fællesskabet.

Dette skift fra bidragyder til leder viser Nicks vision for veludformet software, der løser reelle problemer. Ved at organisere relaterede pakker under fokuserede GitHub-organisationer har han bygget værktøjsøkosystemer, der arbejder sammen, samtidig med at de forbliver modulære og fleksible for det bredere udviklerfællesskab.


## Vores GitHub-organisationer: Økosystemer af Innovation {#our-github-organizations-ecosystems-of-innovation}

Vi organiserer vores open source-arbejde omkring fokuserede GitHub-organisationer, der hver især løser specifikke behov i JavaScript. Denne struktur skaber sammenhængende pakkefamilier, der fungerer godt sammen, samtidig med at de forbliver modulære.

### Cabin: Struktureret Logning til Moderne Applikationer {#cabin-structured-logging-for-modern-applications}

[Cabin-organisationen](https://github.com/cabinjs) er vores bud på enkel, kraftfuld app-logging. Hovedpakken [`cabin`](https://github.com/cabinjs/cabin) har næsten 900 GitHub-stjerner og over 100.000 ugentlige downloads\[^1]. Cabin leverer struktureret logning, der fungerer med populære tjenester som Sentry, LogDNA og Papertrail.

Det, der gør Cabin speciel, er dens gennemtænkte API og pluginsystem. Understøttende pakker som [`axe`](https://github.com/cabinjs/axe) til Express middleware og [`parse-request`](https://github.com/cabinjs/parse-request) til HTTP-anmodningsparsing viser vores engagement i komplette løsninger frem for isolerede værktøjer.

Pakken [`bson-objectid`](https://github.com/cabinjs/bson-objectid) fortjener særlig omtale med over 1,7 millioner downloads på blot to måneder\[^2]. Denne lette MongoDB ObjectID-implementering er blevet det foretrukne valg for udviklere, der har brug for IDs uden fulde MongoDB-afhængigheder.

### Spam Scanner: Bekæmpelse af Email-misbrug {#spam-scanner-fighting-email-abuse}

[Spam Scanner-organisationen](https://github.com/spamscanner) viser vores engagement i at løse reelle problemer. Hovedpakken [`spamscanner`](https://github.com/spamscanner/spamscanner) leverer avanceret email-spamdetektion, men det er pakken [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), der har oplevet en fantastisk udbredelse.

Med over 1,2 millioner downloads på to måneder\[^3] løser `url-regex-safe` kritiske sikkerhedsproblemer i andre URL-detekteringsregulære udtryk. Denne pakke viser vores tilgang til open source: at finde et fælles problem (i dette tilfælde [ReDoS](https://en.wikipedia.org/wiki/ReDoS) sårbarheder i URL-validering), skabe en solid løsning og vedligeholde den omhyggeligt.
### Bree: Moderne Jobplanlægning med Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

[Organisationen Bree](https://github.com/breejs) er vores svar på en almindelig udfordring i Node.js: pålidelig jobplanlægning. Hovedpakken [`bree`](https://github.com/breejs/bree), med over 3.100 GitHub-stjerner, tilbyder en moderne jobplanlægger, der bruger Node.js worker threads for bedre ydeevne og pålidelighed.

> \[!NOTE]
> Bree blev skabt efter, at vi hjalp med at vedligeholde [Agenda](https://github.com/agenda/agenda), hvor vi anvendte de erfaringer, vi fik, til at bygge en bedre jobplanlægger. Vores bidrag til Agenda hjalp os med at finde måder at forbedre jobplanlægning på.

Hvad der gør Bree anderledes end andre planlæggere som Agenda:

* **Ingen Eksterne Afhængigheder**: I modsætning til Agenda, som kræver MongoDB, behøver Bree ikke Redis eller MongoDB til at håndtere jobstatus.
* **Worker Threads**: Bree bruger Node.js worker threads til sandboxede processer, hvilket giver bedre isolation og ydeevne.
* **Simpelt API**: Bree tilbyder detaljeret kontrol med enkelhed, hvilket gør det nemmere at implementere komplekse planlægningsbehov.
* **Indbygget Support**: Ting som graciøs genindlæsning, cron-jobs, datoer og menneskevenlige tider er inkluderet som standard.

Bree er en nøglekomponent i [forwardemail.net](https://github.com/forwardemail/forwardemail.net), hvor den håndterer kritiske baggrundsopgaver som e-mailbehandling, oprydning og planlagt vedligeholdelse. Brug af Bree i Forward Email viser vores engagement i at bruge vores egne værktøjer i produktion og sikre, at de lever op til høje pålidelighedsstandarder.

Vi bruger og værdsætter også andre fremragende worker thread-pakker som [piscina](https://github.com/piscinajs/piscina) og HTTP-klienter som [undici](https://github.com/nodejs/undici). Piscina, ligesom Bree, bruger Node.js worker threads til effektiv opgavebehandling. Vi takker [Matteo Collina](https://github.com/mcollina), som vedligeholder både undici og piscina, for hans store bidrag til Node.js. Matteo sidder i Node.js Technical Steering Committee og har forbedret HTTP-klientfunktionerne i Node.js betydeligt.

### Forward Email: Open Source E-mail Infrastruktur {#forward-email-open-source-email-infrastructure}

Vores mest ambitiøse projekt er [Forward Email](https://github.com/forwardemail), en open source e-mailtjeneste, der tilbyder e-mail videresendelse, lagring og API-tjenester. Hovedrepositoryet har over 1.100 GitHub-stjerner\[^4], hvilket viser fællesskabets anerkendelse af dette alternativ til proprietære e-mailtjenester.

Pakken [`preview-email`](https://github.com/forwardemail/preview-email) fra denne organisation, med over 2,5 millioner downloads på to måneder\[^5], er blevet et essentielt værktøj for udviklere, der arbejder med e-mail-skabeloner. Ved at tilbyde en simpel måde at forhåndsvise e-mails under udvikling løser den et almindeligt problem i opbygningen af e-mail-aktiverede applikationer.

### Lad: Væsentlige Koa-værktøjer og Hjælpeprogrammer {#lad-essential-koa-utilities-and-tools}

[Lad-organisationen](https://github.com/ladjs) tilbyder en samling af væsentlige hjælpeprogrammer og værktøjer, der primært fokuserer på at forbedre Koa-frameworkets økosystem. Disse pakker løser almindelige udfordringer i webudvikling og er designet til at arbejde problemfrit sammen, samtidig med at de forbliver uafhængigt nyttige.

#### koa-better-error-handler: Forbedret Fejlhåndtering til Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tilbyder en bedre fejlhåndteringsløsning til Koa-applikationer. Med over 50 GitHub-stjerner gør denne pakke, at `ctx.throw` producerer brugervenlige fejlmeddelelser, samtidig med at den adresserer flere begrænsninger i Koas indbyggede fejlhåndtering:

* Registrerer og håndterer korrekt Node.js DNS-fejl, Mongoose-fejl og Redis-fejl
* Bruger [Boom](https://github.com/hapijs/boom) til at skabe konsistente, veldesignede fejlresponser
* Bevarer headers (i modsætning til Koas indbyggede håndtering)
* Opretholder passende statuskoder i stedet for at default til 500
* Understøtter flash-beskeder og sessionsbevarelse
* Tilbyder HTML-fejllister for valideringsfejl
* Understøtter flere responstyper (HTML, JSON og almindelig tekst)
Denne pakke er særligt værdifuld, når den bruges sammen med [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) til omfattende fejlhåndtering i Koa-applikationer.

#### passport: Authentication for Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) udvider det populære Passport.js autentificeringsmiddleware med specifikke forbedringer til moderne webapplikationer. Denne pakke understøtter flere autentificeringsstrategier ud af boksen:

* Lokal autentificering med email
* Log ind med Apple
* GitHub autentificering
* Google autentificering
* Engangsadgangskode (OTP) autentificering

Pakken er meget tilpasselig, hvilket giver udviklere mulighed for at justere feltnavne og sætninger, så de matcher deres applikations krav. Den er designet til at integrere problemfrit med Mongoose til brugerstyring, hvilket gør den til en ideel løsning for Koa-baserede applikationer, der har brug for robust autentificering.

#### graceful: Elegant Application Shutdown {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) løser den kritiske udfordring med at lukke Node.js-applikationer elegant ned. Med over 70 GitHub-stjerner sikrer denne pakke, at din applikation kan afslutte rent uden at miste data eller efterlade forbindelser hængende. Nøglefunktioner inkluderer:

* Understøttelse af elegant lukning af HTTP-servere (Express/Koa/Fastify)
* Ren nedlukning af databaseforbindelser (MongoDB/Mongoose)
* Korrekt lukning af Redis-klienter
* Håndtering af Bree jobplanlæggere
* Understøttelse af brugerdefinerede nedlukningshåndterere
* Konfigurerbare timeout-indstillinger
* Integration med logningssystemer

Denne pakke er essentiel for produktionsapplikationer, hvor uventede nedlukninger kan føre til datatab eller korruption. Ved at implementere korrekte nedlukningsprocedurer hjælper `@ladjs/graceful` med at sikre pålideligheden og stabiliteten af din applikation.

### Upptime: Open Source Uptime Monitoring {#upptime-open-source-uptime-monitoring}

[Upptime-organisationen](https://github.com/upptime) repræsenterer vores engagement i transparent, open source overvågning. Det primære [`upptime`](https://github.com/upptime/upptime) repository har over 13.000 GitHub-stjerner, hvilket gør det til et af de mest populære projekter, vi bidrager til. Upptime leverer en GitHub-drevet oppetidsovervågning og status-side, der fungerer helt uden en server.

Vi bruger Upptime til vores egen status-side på <https://status.forwardemail.net> med kildekoden tilgængelig på <https://github.com/forwardemail/status.forwardemail.net>.

Det, der gør Upptime speciel, er dens arkitektur:

* **100% Open Source**: Hver komponent er fuldt open source og tilpasselig.
* **Drevet af GitHub**: Udnytter GitHub Actions, Issues og Pages til en serverløs overvågningsløsning.
* **Ingen server nødvendig**: I modsætning til traditionelle overvågningsværktøjer kræver Upptime ikke, at du kører eller vedligeholder en server.
* **Automatisk status-side**: Genererer en flot status-side, der kan hostes på GitHub Pages.
* **Kraftfulde notifikationer**: Integrerer med forskellige notifikationskanaler, herunder email, SMS og Slack.

For at forbedre vores brugeres oplevelse har vi integreret [@octokit/core](https://github.com/octokit/core.js/) i forwardemail.net kodebasen for at gengive realtidsstatusopdateringer og hændelser direkte på vores hjemmeside. Denne integration giver klar gennemsigtighed til vores brugere i tilfælde af problemer på tværs af hele vores stack (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree osv.) med øjeblikkelige toast-notifikationer, badge-ikon ændringer, advarselsfarver og mere.

@octokit/core biblioteket giver os mulighed for at hente realtidsdata fra vores Upptime GitHub repository, behandle det og vise det på en brugervenlig måde. Når en hvilken som helst service har nedetid eller nedsat ydeevne, bliver brugerne straks underrettet gennem visuelle indikatorer uden at skulle forlade hovedapplikationen. Denne sømløse integration sikrer, at vores brugere altid har opdaterede oplysninger om vores systemstatus, hvilket øger gennemsigtighed og tillid.

Upptime er blevet adopteret af hundredvis af organisationer, der søger en transparent, pålidelig måde at overvåge deres tjenester og kommunikere status til brugerne. Projektets succes viser styrken ved at bygge værktøjer, der udnytter eksisterende infrastruktur (i dette tilfælde GitHub) til at løse almindelige problemer på nye måder.
## Vores Bidrag til Forward Email Økosystemet {#our-contributions-to-the-forward-email-ecosystem}

Mens vores open source-pakker bruges af udviklere verden over, danner de også grundlaget for vores egen Forward Email-tjeneste. Denne dobbelte rolle – som både skabere og brugere af disse værktøjer – giver os et unikt perspektiv på deres anvendelse i praksis og driver kontinuerlig forbedring.

### Fra Pakker til Produktion {#from-packages-to-production}

Rejsen fra individuelle pakker til et sammenhængende produktionssystem involverer omhyggelig integration og udvidelse. For Forward Email inkluderer denne proces:

* **Brugerdefinerede Udvidelser**: Opbygning af Forward Email-specifikke udvidelser til vores open source-pakker, der imødekommer vores unikke krav.
* **Integrationsmønstre**: Udvikling af mønstre for, hvordan disse pakker interagerer i et produktionsmiljø.
* **Ydelsesoptimeringer**: Identificering og håndtering af ydelsesflaskehalse, der kun opstår i stor skala.
* **Sikkerhedshærdning**: Tilføjelse af ekstra sikkerhedslag specifikt til e-mailhåndtering og beskyttelse af brugerdata.

Dette arbejde repræsenterer tusindvis af timers udvikling ud over selve kernepakkerne, hvilket resulterer i en robust, sikker e-mailtjeneste, der udnytter det bedste fra vores open source-bidrag.

### Feedback Looppen {#the-feedback-loop}

Måske er den mest værdifulde del ved at bruge vores egne pakker i produktion den feedback loop, det skaber. Når vi støder på begrænsninger eller kanttilfælde i Forward Email, retter vi dem ikke bare lokalt – vi forbedrer de underliggende pakker, hvilket gavner både vores tjeneste og det bredere fællesskab.

Denne tilgang har ført til adskillige forbedringer:

* **Bree's Gracøse Nedlukning**: Forward Emails behov for nul nedetid ved udrulning har ført til forbedrede muligheder for gracøs nedlukning i Bree.
* **Spam Scanners Mønstergenkendelse**: Virkelige spam-mønstre, der er stødt på i Forward Email, har informeret Spam Scanners detektionsalgoritmer.
* **Cabins Ydelsesoptimeringer**: Højvolumen logging i produktion afslørede optimeringsmuligheder i Cabin, som gavner alle brugere.

Ved at opretholde denne gode cirkel mellem vores open source-arbejde og produktionstjenesten sikrer vi, at vores pakker forbliver praktiske, gennemprøvede løsninger frem for teoretiske implementeringer.


## Forward Emails Kerneprincipper: Et Fundament for Ekspertise {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email er designet efter et sæt kerneprincipper, der styrer alle vores udviklingsbeslutninger. Disse principper, detaljeret på vores [website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), sikrer, at vores tjeneste forbliver udviklervenlig, sikker og fokuseret på brugerens privatliv.

### Altid Udviklervenlig, Sikkerhedsorienteret og Transparent {#always-developer-friendly-security-focused-and-transparent}

Vores første og vigtigste princip er at skabe software, der er udviklervenlig, samtidig med at de højeste standarder for sikkerhed og privatliv opretholdes. Vi mener, at teknisk ekspertise aldrig bør gå på kompromis med brugervenlighed, og at gennemsigtighed opbygger tillid i vores fællesskab.

Dette princip afspejles i vores detaljerede dokumentation, klare fejlmeddelelser og åbne kommunikation om både succeser og udfordringer. Ved at gøre hele vores kodebase open source inviterer vi til granskning og samarbejde, hvilket styrker både vores software og det bredere økosystem.

### Overholdelse af Tidsprøvede Principper for Softwareudvikling {#adherence-to-time-tested-software-development-principles}

Vi følger flere etablerede principper for softwareudvikling, der har bevist deres værdi gennem årtier:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Adskillelse af bekymringer gennem Model-View-Controller-mønsteret
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: Skabelse af modulære komponenter, der gør én ting godt
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Hold det simpelt og ligetil
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Gentag dig ikke, fremmer genbrug af kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du får det ikke brug for det, undgår for tidlig optimering
* **[Twelve Factor](https://12factor.net/)**: Følger bedste praksis for at bygge moderne, skalerbare applikationer
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Vælger den simpleste løsning, der opfylder kravene
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Bruger vores egne produkter intensivt
Disse principper er ikke bare teoretiske koncepter—de er indlejret i vores daglige udviklingspraksis. For eksempel er vores overholdelse af Unix-filosofien tydelig i, hvordan vi har struktureret vores npm-pakker: små, fokuserede moduler, der kan sammensættes for at løse komplekse problemer.

### Målretning mod den seje, bootstrappede udvikler {#targeting-the-scrappy-bootstrapped-developer}

Vi målretter specifikt mod den seje, bootstrappede og [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) udvikler. Dette fokus former alt fra vores prismodel til vores tekniske beslutninger. Vi forstår udfordringerne ved at bygge produkter med begrænsede ressourcer, fordi vi selv har været der.

Dette princip er særligt vigtigt i vores tilgang til open source. Vi skaber og vedligeholder pakker, der løser reelle problemer for udviklere uden enterprise-budgetter, hvilket gør kraftfulde værktøjer tilgængelige for alle uanset deres ressourcer.

### Principper i praksis: Forward Email-kodebasen {#principles-in-practice-the-forward-email-codebase}

Disse principper er tydeligt synlige i Forward Email-kodebasen. Vores package.json-fil afslører et gennemtænkt udvalg af afhængigheder, hver valgt for at stemme overens med vores kerneværdier:

* Sikkerhedsorienterede pakker som `mailauth` til email-autentificering
* Udviklervenlige værktøjer som `preview-email` for nemmere fejlfinding
* Modulare komponenter som de forskellige `p-*` værktøjer fra Sindre Sorhus

Ved konsekvent at følge disse principper over tid har vi bygget en service, som udviklere kan stole på med deres email-infrastruktur—sikker, pålidelig og i overensstemmelse med værdierne i open source-fællesskabet.

### Privacy by Design {#privacy-by-design}

Privatliv er ikke en eftertanke eller en marketingfunktion for Forward Email—det er et grundlæggende designprincip, der informerer alle aspekter af vores service og kode:

* **Zero-Access Encryption**: Vi har implementeret systemer, der gør det teknisk umuligt for os at læse brugernes emails.
* **Minimal Data Collection**: Vi indsamler kun de data, der er nødvendige for at levere vores service, ikke mere.
* **Transparent Policies**: Vores privatlivspolitik er skrevet i klart, forståeligt sprog uden juridisk jargon.
* **Open Source Verification**: Vores open source-kodebase tillader sikkerhedsforskere at verificere vores privatlivspåstande.

Denne forpligtelse strækker sig til vores open source-pakker, som er designet med sikkerheds- og privatlivspraksis indbygget fra bunden.

### Bæredygtig Open Source {#sustainable-open-source}

Vi mener, at open source-software har brug for bæredygtige modeller for at trives på lang sigt. Vores tilgang inkluderer:

* **Commercial Support**: Tilbyder premium support og tjenester omkring vores open source-værktøjer.
* **Balanced Licensing**: Bruger licenser, der beskytter både brugerfriheder og projektets bæredygtighed.
* **Community Engagement**: Aktivt engagement med bidragydere for at opbygge et støttende fællesskab.
* **Transparent Roadmaps**: Deler vores udviklingsplaner, så brugere kan planlægge derefter.

Ved at fokusere på bæredygtighed sikrer vi, at vores open source-bidrag kan fortsætte med at vokse og forbedres over tid fremfor at blive forsømt.


## Tallene lyver ikke: Vores imponerende npm-downloadstatistikker {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Når vi taler om effekten af open source-software, giver downloadstatistikker et håndgribeligt mål for adoption og tillid. Mange af de pakker, vi hjælper med at vedligeholde, har nået en skala, som få open source-projekter nogensinde opnår, med samlede downloads i milliardklassen.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Mens vi er stolte af at hjælpe med at vedligeholde flere højt downloadede pakker i JavaScript-økosystemet, vil vi gerne anerkende, at mange af disse pakker oprindeligt blev skabt af andre talentfulde udviklere. Pakker som superagent og supertest blev oprindeligt skabt af TJ Holowaychuk, hvis produktive bidrag til open source har været afgørende for at forme Node.js-økosystemet.
### Et Overblik over Vores Indflydelse {#a-birds-eye-view-of-our-impact}

I blot den to-måneders periode fra februar til marts 2025 registrerede de vigtigste pakker, vi bidrager til og hjælper med at vedligeholde, svimlende download-tal:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 downloads\[^7] (oprindeligt oprettet af TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 downloads\[^8] (oprindeligt oprettet af TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28.539.295 downloads\[^34] (oprindeligt oprettet af TJ Holowaychuk)
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
> Flere andre pakker, som vi hjælper med at vedligeholde, men ikke har oprettet, har endnu højere download-tal, herunder `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads) og `error-stack-parser` (113M+ downloads). Vi er beærede over at bidrage til disse pakker, samtidig med at vi respekterer arbejdet fra deres oprindelige forfattere.

Disse er ikke bare imponerende tal—de repræsenterer rigtige udviklere, der løser reelle problemer med kode, som vi hjælper med at vedligeholde. Hver download er et tilfælde, hvor disse pakker har hjulpet nogen med at bygge noget meningsfuldt, fra hobbyprojekter til virksomhedsapplikationer brugt af millioner.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Daglig Indflydelse i Stor Skala {#daily-impact-at-scale}

De daglige download-mønstre afslører konsekvent, højvolumen brug, med toppe, der når millioner af downloads per dag\[^13]. Denne konsistens vidner om stabiliteten og pålideligheden af disse pakker—udviklere prøver dem ikke bare; de integrerer dem i deres kernearbejdsgange og er afhængige af dem dag efter dag.

Ugentlige download-mønstre viser endnu mere imponerende tal, der konsekvent ligger omkring titusinder af millioner downloads per uge\[^14]. Dette repræsenterer et massivt fodaftryk i JavaScript-økosystemet, med disse pakker kørende i produktionsmiljøer over hele kloden.

### Udover de Rå Tal {#beyond-the-raw-numbers}

Selvom download-statistikkerne er imponerende i sig selv, fortæller de en dybere historie om den tillid, som fællesskabet har til disse pakker. Vedligeholdelse af pakker i denne skala kræver en urokkelig forpligtelse til:

* **Bagudkompatibilitet**: Ændringer skal overvejes nøje for at undgå at bryde eksisterende implementeringer.
* **Sikkerhed**: Med millioner af applikationer, der er afhængige af disse pakker, kan sikkerhedssårbarheder få vidtrækkende konsekvenser.
* **Ydeevne**: I denne skala kan selv mindre ydeevneforbedringer have betydelige samlede fordele.
* **Dokumentation**: Klar, omfattende dokumentation er afgørende for pakker, der bruges af udviklere på alle erfaringsniveauer.

Den konstante vækst i download-tal over tid afspejler succesen i at opfylde disse forpligtelser og opbygge tillid hos udviklerfællesskabet gennem pålidelige, velvedligeholdte pakker.
## Støtte til Økosystemet: Vores Open Source Sponsorater {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source bæredygtighed handler ikke kun om at bidrage med kode—det handler også om at støtte de udviklere, der vedligeholder kritisk infrastruktur.

Udover vores direkte bidrag til JavaScript-økosystemet er vi stolte af at sponsorere fremtrædende Node.js-bidragsydere, hvis arbejde danner grundlaget for mange moderne applikationer. Vores sponsorater inkluderer:

### Andris Reinman: Pioner inden for Email Infrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) er skaberen af [Nodemailer](https://github.com/nodemailer/nodemailer), det mest populære bibliotek til afsendelse af e-mails for Node.js med over 14 millioner ugentlige downloads\[^15]. Hans arbejde strækker sig til andre kritiske email-infrastrukturkomponenter som [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) og [WildDuck](https://github.com/nodemailer/wildduck).

Vores sponsorat hjælper med at sikre fortsat vedligeholdelse og udvikling af disse essentielle værktøjer, der driver email-kommunikation for utallige Node.js-applikationer, inklusive vores egen Forward Email service.

### Sindre Sorhus: Mester i Utility Pakker {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) er en af de mest produktive open source-bidragsydere i JavaScript-økosystemet med over 1.000 npm-pakker på sit navn. Hans utilities som [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) og [is-stream](https://github.com/sindresorhus/is-stream) er fundamentale byggesten, der bruges bredt i Node.js-økosystemet.

Ved at sponsorere Sindres arbejde hjælper vi med at opretholde udviklingen af disse kritiske utilities, der gør JavaScript-udvikling mere effektiv og pålidelig.

Disse sponsorater afspejler vores engagement i det bredere open source-økosystem. Vi anerkender, at vores egen succes er bygget på det fundament, som disse og andre bidragsydere har lagt, og vi er dedikerede til at sikre bæredygtigheden af hele økosystemet.


## Opdagelse af Sikkerhedssårbarheder i JavaScript-Økosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vores engagement i open source går ud over funktionsudvikling og inkluderer identifikation og håndtering af sikkerhedssårbarheder, der kan påvirke millioner af udviklere. Flere af vores mest betydningsfulde bidrag til JavaScript-økosystemet har været inden for sikkerhedsområdet.

### Redningen af Koa-Router {#the-koa-router-rescue}

I februar 2019 identificerede Nick et kritisk problem med vedligeholdelsen af den populære koa-router pakke. Som han [rapporterede på Hacker News](https://news.ycombinator.com/item?id=19156707), var pakken blevet forladt af sin oprindelige vedligeholder, hvilket efterlod sikkerhedssårbarheder uadresserede og fællesskabet uden opdateringer.

> \[!WARNING]
> Forladte pakker med sikkerhedssårbarheder udgør betydelige risici for hele økosystemet, især når de downloades millioner af gange ugentligt.

Som svar oprettede Nick [@koa/router](https://github.com/koajs/router) og hjalp med at advare fællesskabet om situationen. Han har vedligeholdt denne kritiske pakke lige siden og sikrer, at Koa-brugere har en sikker og velvedligeholdt routing-løsning.

### Håndtering af ReDoS Sårbarheder {#addressing-redos-vulnerabilities}

I 2020 identificerede og håndterede Nick en kritisk [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) sårbarhed i den udbredt anvendte `url-regex` pakke. Denne sårbarhed ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kunne tillade angribere at forårsage denial of service ved at levere specielt udformet input, der forårsagede katastrofal backtracking i det regulære udtryk.

I stedet for blot at patche den eksisterende pakke, skabte Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en fuldstændig omskrevet implementering, der adresserer sårbarheden samtidig med at den opretholder kompatibilitet med det oprindelige API. Han offentliggjorde også et [omfattende blogindlæg](/blog/docs/url-regex-javascript-node-js), der forklarer sårbarheden og hvordan man afbøder den.
Dette arbejde viser vores tilgang til sikkerhed: ikke bare at rette problemer, men at uddanne fællesskabet og levere robuste alternativer, der forhindrer lignende problemer i fremtiden.

### Fortalervirksomhed for Node.js og Chromium Sikkerhed {#advocating-for-nodejs-and-chromium-security}

Nick har også været aktiv i at fremme sikkerhedsforbedringer i det bredere økosystem. I august 2020 identificerede han et betydeligt sikkerhedsproblem i Node.js relateret til håndteringen af HTTP-headers, hvilket blev rapporteret i [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Dette problem, som stammede fra en patch i Chromium, kunne potentielt tillade angribere at omgå sikkerhedsforanstaltninger. Nicks fortalervirksomhed hjalp med at sikre, at problemet blev håndteret hurtigt, hvilket beskyttede millioner af Node.js-applikationer mod potentiel udnyttelse.

### Sikring af npm Infrastruktur {#securing-npm-infrastructure}

Senere samme måned identificerede Nick et andet kritisk sikkerhedsproblem, denne gang i npms email-infrastruktur. Som rapporteret i [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), implementerede npm ikke korrekt DMARC, SPF og DKIM email-autentifikationsprotokoller, hvilket potentielt kunne tillade angribere at sende phishing-mails, der så ud til at komme fra npm.

Nicks rapport førte til forbedringer i npms email-sikkerhed, hvilket beskyttede de millioner af udviklere, der er afhængige af npm til pakkehåndtering, mod potentielle phishing-angreb.


## Vores Bidrag til Forward Email Økosystemet {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email er bygget oven på flere kritiske open source-projekter, herunder Nodemailer, WildDuck og mailauth. Vores team har ydet betydelige bidrag til disse projekter, hvilket har hjulpet med at identificere og rette dybtliggende problemer, der påvirker email-levering og sikkerhed.

### Forbedring af Nodemailers Kernefunktionalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) er rygraden i email-afsendelse i Node.js, og vores bidrag har hjulpet med at gøre det mere robust:

* **Forbedringer af SMTP-serveren**: Vi har rettet parsing-fejl, problemer med stream-håndtering og TLS-konfigurationsproblemer i SMTP-serverkomponenten\[^16]\[^17].
* **Forbedringer af Mail Parser**: Vi har løst fejl i dekodning af tegnsekvenser og problemer med adresseparseren, som kunne forårsage fejl i email-behandlingen\[^18]\[^19].

Disse bidrag sikrer, at Nodemailer forbliver et pålideligt fundament for email-behandling i Node.js-applikationer, inklusive Forward Email.

### Fremme af Email-autentifikation med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) leverer kritisk email-autentifikationsfunktionalitet, og vores bidrag har betydeligt forbedret dets kapaciteter:

* **Forbedringer af DKIM-verifikation**: Vi opdagede og rapporterede, at X/Twitter havde DNS-cacheproblemer, som forårsagede DKIM-fejl for deres udgående beskeder, og rapporterede det på Hacker One\[^20].
* **Forbedringer af DMARC og ARC**: Vi har rettet problemer med DMARC- og ARC-verifikation, som kunne føre til forkerte autentifikationsresultater\[^21]\[^22].
* **Performanceoptimeringer**: Vi har bidraget med optimeringer, der forbedrer ydeevnen af email-autentifikationsprocesser\[^23]\[^24]\[^25]\[^26].

Disse forbedringer hjælper med at sikre, at email-autentifikation er præcis og pålidelig, hvilket beskytter brugere mod phishing- og spoofing-angreb.

### Vigtige Upptime Forbedringer {#key-upptime-enhancements}

Vores bidrag til Upptime inkluderer:

* **Overvågning af SSL-certifikat**: Vi tilføjede funktionalitet til at overvåge udløb af SSL-certifikater, hvilket forhindrer uventet nedetid på grund af udløbne certifikater\[^27].
* **Support for flere SMS-numre**: Vi implementerede support til at advare flere teammedlemmer via SMS, når hændelser opstår, hvilket forbedrer responstider\[^28].
* **Fix af IPv6-tjek**: Vi rettede problemer med IPv6-forbindelsestjek, hvilket sikrer mere præcis overvågning i moderne netværksmiljøer\[^29].
* **Support for mørk/lys tilstand**: Vi tilføjede temasupport for at forbedre brugeroplevelsen af status-sider\[^31].
* **Bedre TCP-Ping Support**: Vi forbedrede TCP ping-funktionaliteten for at give mere pålidelig forbindelsestest\[^32].
Disse forbedringer gavner ikke kun Forward Emails statusovervågning, men er tilgængelige for hele fællesskabet af Upptime-brugere, hvilket demonstrerer vores engagement i at forbedre de værktøjer, vi er afhængige af.


## Limen Der Holder Det Hele Sammen: Tilpasset Kode i Stor Skala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Mens vores npm-pakker og bidrag til eksisterende projekter er betydelige, er det den tilpassede kode, der integrerer disse komponenter, som virkelig viser vores tekniske ekspertise. Forward Email-kodebasen repræsenterer et årtis udviklingsindsats, der går tilbage til 2017, hvor projektet begyndte som [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding), før det blev slået sammen i et monorepo.

### En Kæmpe Udviklingsindsats {#a-massive-development-effort}

Omfanget af denne tilpassede integrationskode er imponerende:

* **Samlede Bidrag**: Over 3.217 commits
* **Kodebase Størrelse**: Over 421.545 linjer kode fordelt på JavaScript, Pug, CSS og JSON-filer\[^33]

Dette repræsenterer tusindvis af timers udviklingsarbejde, fejlfinding og performanceoptimeringer. Det er den "hemmelige ingrediens", der forvandler individuelle pakker til en sammenhængende, pålidelig tjeneste, som tusindvis af kunder bruger dagligt.

### Integration af Kerneafhængigheder {#core-dependencies-integration}

Forward Email-kodebasen integrerer adskillige afhængigheder til en sømløs helhed:

* **Emailbehandling**: Integrerer Nodemailer til afsendelse, SMTP Server til modtagelse og Mailparser til parsing
* **Autentificering**: Bruger Mailauth til DKIM, SPF, DMARC og ARC verifikation
* **DNS-opløsning**: Udnytter Tangerine til DNS-over-HTTPS med global caching
* **MX-forbindelse**: Anvender mx-connect med Tangerine-integration for pålidelige mailserverforbindelser
* **Jobplanlægning**: Benytter Bree til pålidelig baggrundsopgavebehandling med worker threads
* **Skabeloner**: Bruger email-templates til genbrug af stylesheets fra hjemmesiden i kundekommunikation
* **Email-lagring**: Implementerer individuelt krypterede SQLite-mailbokse ved hjælp af better-sqlite3-multiple-ciphers med ChaCha20-Poly1305-kryptering for kvantesikker privatlivsbeskyttelse, hvilket sikrer fuldstændig isolation mellem brugere, og at kun brugeren har adgang til sin mailboks

Hver af disse integrationer kræver nøje overvejelse af kanttilfælde, performanceimplikationer og sikkerhedsaspekter. Resultatet er et robust system, der håndterer millioner af emailtransaktioner pålideligt. Vores SQLite-implementering udnytter også msgpackr til effektiv binær serialisering og WebSockets (via ws) til realtidsstatusopdateringer på tværs af vores infrastruktur.

### DNS-infrastruktur med Tangerine og mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En kritisk komponent i Forward Emails infrastruktur er vores DNS-opløsningssystem, bygget omkring to nøglepakker:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vores Node.js DNS-over-HTTPS-implementering tilbyder en drop-in erstatning for den standard DNS-resolver med indbyggede genforsøg, timeouts, smart serverrotation og caching-understøttelse.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Denne pakke etablerer TCP-forbindelser til MX-servere ved at tage et måldomæne eller en emailadresse, løse passende MX-servere og forbinde til dem i prioriteret rækkefølge.

Vi har integreret Tangerine med mx-connect gennem [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), hvilket sikrer applikationslags DNS over HTTP-forespørgsler gennem hele Forward Email. Dette giver global caching for DNS i stor skala med 1:1 konsistens på tværs af enhver region, app eller proces—kritisk for pålidelig emaillevering i et distribueret system.


## Virksomhedspåvirkning: Fra Open Source til Mission-Kritiske Løsninger {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Klimakset på vores årti lange rejse inden for open source-udvikling har gjort det muligt for Forward Email ikke kun at betjene individuelle udviklere, men også store virksomheder og uddannelsesinstitutioner, der udgør rygraden i open source-bevægelsen selv.
### Case Studies in Mission-Critical Email Infrastructure {#case-studies-in-mission-critical-email-infrastructure}

Vores engagement i pålidelighed, privatliv og open source-principper har gjort Forward Email til det betroede valg for organisationer med krævende email-krav:

* **Uddannelsesinstitutioner**: Som beskrevet i vores [alumni email forwarding case study](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), stoler store universiteter på vores infrastruktur for at opretholde livslange forbindelser med hundredtusindvis af alumner gennem pålidelige email-videresendelsestjenester.

* **Enterprise Linux-løsninger**: [Canonical Ubuntu email enterprise case study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demonstrerer, hvordan vores open source-tilgang passer perfekt til behovene hos enterprise Linux-udbydere, og giver dem den gennemsigtighed og kontrol, de kræver.

* **Open Source-fonde**: Måske mest bekræftende er vores partnerskab med Linux Foundation, som dokumenteret i [Linux Foundation email enterprise case study](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), hvor vores service driver kommunikationen for netop den organisation, der varetager Linux-udviklingen.

Der er en smuk symmetri i, hvordan vores open source-pakker, vedligeholdt med omhu gennem mange år, har gjort det muligt for os at bygge en email-service, der nu understøtter de samme fællesskaber og organisationer, som går ind for open source-software. Denne fuldendte rejse – fra at bidrage med individuelle pakker til at drive enterprise-grade email-infrastruktur for open source-ledere – repræsenterer den ultimative bekræftelse af vores tilgang til softwareudvikling.


## A Decade of Open Source: Looking Forward {#a-decade-of-open-source-looking-forward}

Når vi ser tilbage på et årti med open source-bidrag og frem mod de næste ti år, er vi fyldt med taknemmelighed for det fællesskab, der har støttet vores arbejde, og begejstring for, hvad der kommer.

Vores rejse fra individuelle pakke-bidragsydere til vedligeholdere af en omfattende email-infrastruktur, der bruges af store virksomheder og open source-fonde, har været bemærkelsesværdig. Det er et vidnesbyrd om styrken i open source-udvikling og den indflydelse, som gennemtænkt, velvedligeholdt software kan have på det bredere økosystem.

I de kommende år er vi forpligtet til:

* **Fortsat at vedligeholde og forbedre vores eksisterende pakker**, så de forbliver pålidelige værktøjer for udviklere verden over.
* **At udvide vores bidrag til kritiske infrastrukturprojekter**, især inden for email- og sikkerhedsområderne.
* **At forbedre Forward Emails kapaciteter**, samtidig med at vi opretholder vores engagement i privatliv, sikkerhed og gennemsigtighed.
* **At støtte den næste generation af open source-bidragsydere** gennem mentorordninger, sponsorater og fællesskabsengagement.

Vi tror på, at fremtiden for softwareudvikling er åben, samarbejdsbaseret og bygget på et fundament af tillid. Ved fortsat at bidrage med høj-kvalitets, sikkerhedsorienterede pakker til JavaScript-økosystemet håber vi at spille en lille rolle i at bygge den fremtid.

Tak til alle, der har brugt vores pakker, bidraget til vores projekter, rapporteret problemer eller blot spredt budskabet om vores arbejde. Jeres støtte har gjort dette årtis indflydelse mulig, og vi ser frem til at se, hvad vi kan opnå sammen i de næste ti år.

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
