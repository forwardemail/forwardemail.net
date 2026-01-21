# Et årti med indflydelse: Hvordan vores npm-pakker nåede 1 milliard downloads og formede JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Pionererne der stoler på os: Isaac Z. Schlueter og videresend e-mail](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Fra npms skabelse til Node.js-ledelse](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bag koden: Nick Baughs rejse](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ekspres teknisk komité og kernebidrag](#express-technical-committee-and-core-contributions)
  * [Bidrag til Koa-rammen](#koa-framework-contributions)
  * [Fra individuel bidragyder til organisationsleder](#from-individual-contributor-to-organization-leader)
* [Vores GitHub-organisationer: Innovationsøkosystemer](#our-github-organizations-ecosystems-of-innovation)
  * [Kabine: Struktureret logføring til moderne applikationer](#cabin-structured-logging-for-modern-applications)
  * [Spamscanner: Bekæmpelse af e-mailmisbrug](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderne jobplanlægning med arbejdertråde](#bree-modern-job-scheduling-with-worker-threads)
  * [Videresend e-mail: Open Source e-mailinfrastruktur](#forward-email-open-source-email-infrastructure)
  * [Lad: Essentielle Koa-værktøjer og -værktøjer](#lad-essential-koa-utilities-and-tools)
  * [Oppetid: Overvågning af oppetid med åben kildekode](#upptime-open-source-uptime-monitoring)
* [Vores bidrag til økosystemet for videresendelse af e-mails](#our-contributions-to-the-forward-email-ecosystem)
  * [Fra pakker til produktion](#from-packages-to-production)
  * [Feedback-løkken](#the-feedback-loop)
* [Kerneprincipperne for videresendelse af e-mails: Et fundament for ekspertise](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Altid udviklervenlig, sikkerhedsfokuseret og gennemsigtig](#always-developer-friendly-security-focused-and-transparent)
  * [Overholdelse af tidstestede principper for softwareudvikling](#adherence-to-time-tested-software-development-principles)
  * [Målrettet mod den ustabile, bootstrappede udvikler](#targeting-the-scrappy-bootstrapped-developer)
  * [Principper i praksis: Kodebasen for videresendelse af e-mails](#principles-in-practice-the-forward-email-codebase)
  * [Privatliv gennem design](#privacy-by-design)
  * [Bæredygtig open source](#sustainable-open-source)
* [Tallene lyver ikke: Vores svimlende npm downloadstatistik](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Et fugleperspektiv på vores indflydelse](#a-birds-eye-view-of-our-impact)
  * [Daglig påvirkning i stor skala](#daily-impact-at-scale)
  * [Ud over de rå tal](#beyond-the-raw-numbers)
* [Støtte til økosystemet: Vores open source-sponsorater](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pioner inden for e-mailinfrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Brugspakke Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Afdækning af sikkerhedssårbarheder i JavaScript-økosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Router-redningen](#the-koa-router-rescue)
  * [Håndtering af ReDoS-sårbarheder](#addressing-redos-vulnerabilities)
  * [Fortaler for Node.js og Chromium-sikkerhed](#advocating-for-nodejs-and-chromium-security)
  * [Sikring af npm-infrastruktur](#securing-npm-infrastructure)
* [Vores bidrag til økosystemet for videresendelse af e-mails](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Forbedring af Nodemailers kernefunktionalitet](#enhancing-nodemailers-core-functionality)
  * [Fremme af e-mailgodkendelse med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Vigtige forbedringer af oppetiden](#key-upptime-enhancements)
* [Limen der holder det hele sammen: Brugerdefineret kode i stor skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv udviklingsindsats](#a-massive-development-effort)
  * [Integration af kerneafhængigheder](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine og mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Virksomhedspåvirkning: Fra open source til missionskritiske løsninger](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Casestudier i missionskritisk e-mailinfrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Et årti med open source: Et blik fremad](#a-decade-of-open-source-looking-forward)

## Forord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript)- og [Node.js](https://en.wikipedia.org/wiki/Node.js)-verdenen er nogle pakker essentielle – de downloades millioner af gange dagligt og driver apps verden over. Bag disse værktøjer står udviklere, der fokuserer på open source-kvalitet. I dag viser vi, hvordan vores team hjælper med at bygge og vedligeholde npm-pakker, der er blevet centrale dele af JavaScript-økosystemet.

## Pionererne der stoler på os: Isaac Z. Schlueter og videresend e-mail {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi er stolte af at have [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som bruger. Isaac oprettede [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) og hjalp med at opbygge [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans tillid til Videresendt E-mail viser vores fokus på kvalitet og sikkerhed. Isaac bruger Videresendt E-mail til flere domæner, herunder izs.me.

Isaacs indflydelse på JavaScript er enorm. I 2009 var han blandt de første til at se Node.js' potentiale, i samarbejde med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skabte platformen. Som Isaac sagde i en [interview med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-artikel: "Midt i dette meget lille fællesskab af en flok mennesker, der forsøgte at finde ud af, hvordan man kunne få server-side JS til at ske, kom Ryan Dahl ud med Node, hvilket helt klart var den rigtige tilgang. Jeg gav mit bidrag og blev meget involveret omkring midten af 2009."

> \[!NOTE]
> For dem, der er interesserede i Node.js' historie, findes der fremragende dokumentarfilm, der kronikerer dens udvikling, herunder [Historien om Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) og [10 ting jeg fortryder ved Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [personlig hjemmeside](https://tinyclouds.org/) indeholder også værdifuld indsigt i hans arbejde.

### Fra npms oprettelse til Node.js-ledelse {#from-npms-creation-to-nodejs-leadership}

Isaac skabte npm i september 2009, og den første brugbare version blev udgivet i starten af 2010. Denne pakkehåndtering opfyldte et centralt behov i Node.js, da den gjorde det nemt for udviklere at dele og genbruge kode. Ifølge [Node.js Wikipedia-side](https://en.wikipedia.org/wiki/Node.js), "I januar 2010 blev en pakkehåndtering introduceret til Node.js-miljøet kaldet npm. Pakkehåndteringen giver programmører mulighed for at udgive og dele Node.js-pakker sammen med den tilhørende kildekode og er designet til at forenkle installation, opdatering og afinstallation af pakker."

Da Ryan Dahl trak sig tilbage fra Node.js i januar 2012, overtog Isaac rollen som projektleder. Som nævnt på [hans resumé](https://izs.me/resume), "ledede han udviklingen af flere grundlæggende Node.js-kerne-API'er, herunder CommonJS-modulsystemet, filsystem-API'er og streams" og "fungerede som BDFL (Benevolent Dictator For Life) for projektet i 2 år, hvilket sikrede stadigt stigende kvalitet og en pålidelig byggeproces for Node.js-versionerne v0.6 til v0.10."

Isaac guidede Node.js gennem en afgørende vækstperiode og satte standarder, der stadig former platformen i dag. Han startede senere npm, Inc. i 2014 for at understøtte npm-registret, som han tidligere havde drevet på egen hånd.

Vi takker Isaac for hans enorme bidrag til JavaScript og fortsætter med at bruge mange pakker, han har skabt. Hans arbejde har ændret, hvordan vi bygger software, og hvordan millioner af udviklere deler kode verden over.

## Arkitekten bag koden: Nick Baughs rejse {#the-architect-behind-the-code-nick-baughs-journey}

I hjertet af vores open source-succes står Nick Baugh, grundlægger og ejer af Forward Email. Hans arbejde med JavaScript strækker sig over næsten 20 år og har formet, hvordan utallige udviklere bygger apps. Hans open source-rejse viser både tekniske færdigheder og lederskab i fællesskabet.

### Ekspres teknisk komité og kernebidrag {#express-technical-committee-and-core-contributions}

Nicks ekspertise inden for webframeworks gav ham en plads på [Express Teknisk Komité](https://expressjs.com/en/resources/community.html), hvor han hjalp med et af de mest brugte Node.js-frameworks. Nick er nu angivet som et inaktivt medlem på [Express-fællesskabsside](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express blev oprindeligt skabt af TJ Holowaychuk, en produktiv open source-bidragyder, der har formet en stor del af Node.js-økosystemet. Vi er taknemmelige for TJs grundlæggende arbejde og respekterer hans [beslutning om at tage en pause](https://news.ycombinator.com/item?id=37687017) og hans omfattende open source-bidrag.

Som medlem af [Express Teknisk Komité](https://expressjs.com/en/resources/community.html) udviste Nick stor sans for detaljer i forbindelse med spørgsmål som at afklare `req.originalUrl`-dokumentationen og løse problemer med håndtering af formularer med flere dele.

### Bidrag til Koa-rammeværket {#koa-framework-contributions}

Nicks arbejde med [Koa-rammeværk](https://github.com/koajs/koa) – et moderne, lettere alternativ til Express, også skabt af TJ Holowaychuk – viser yderligere hans engagement i bedre webudviklingsværktøjer. Hans Koa-bidrag omfatter både problemer og kode gennem pull requests, håndtering af fejl, styring af indholdstyper og forbedringer af dokumentation.

Hans arbejde på tværs af både Express og Koa giver ham et unikt indblik i Node.js webudvikling, hvilket hjælper vores team med at skabe pakker, der fungerer godt med flere framework-økosystemer.

### Fra individuel bidragyder til organisationsleder {#from-individual-contributor-to-organization-leader}

Det, der startede med at hjælpe eksisterende projekter, voksede sig til at skabe og vedligeholde økosystemer med komplette pakker. Nick grundlagde flere GitHub-organisationer – herunder [Kabine](https://github.com/cabinjs), [Spamscanner](https://github.com/spamscanner), [Videresend e-mail](https://github.com/forwardemail), [Dreng](https://github.com/ladjs) og [Bree](https://github.com/breejs) – som hver især løste specifikke behov i JavaScript-fællesskabet.

Dette skift fra bidragyder til leder viser Nicks vision for veldesignet software, der løser reelle problemer. Ved at organisere relaterede pakker under fokuserede GitHub-organisationer har han bygget værktøjsøkosystemer, der fungerer sammen, samtidig med at de forbliver modulære og fleksible for det bredere udviklerfællesskab.

## Vores GitHub-organisationer: Innovationsøkosystemer {#our-github-organizations-ecosystems-of-innovation}

Vi organiserer vores open source-arbejde omkring fokuserede GitHub-organisationer, der hver især løser specifikke behov inden for JavaScript. Denne struktur skaber sammenhængende pakkefamilier, der fungerer godt sammen, samtidig med at de forbliver modulære.

### Kabine: Struktureret logføring til moderne applikationer {#cabin-structured-logging-for-modern-applications}

[Kabineorganisation](https://github.com/cabinjs) er vores version af simpel og effektiv app-logning. Hovedpakken [`cabin`](https://github.com/cabinjs/cabin) har næsten 900 GitHub-stjerner og over 100.000 ugentlige downloads\[^1]. Cabin leverer struktureret logning, der fungerer med populære tjenester som Sentry, LogDNA og Papertrail.

Det, der gør Cabin speciel, er dets gennemtænkte API- og plugin-system. Understøttelse af pakker som [`axe`](https://github.com/cabinjs/axe) til Express middleware og [`parse-request`](https://github.com/cabinjs/parse-request) til HTTP-anmodningsparsing viser vores engagement i komplette løsninger snarere end isolerede værktøjer.

Pakken [`bson-objectid`](https://github.com/cabinjs/bson-objectid) fortjener en særlig omtale med over 1,7 millioner downloads på bare to måneder\[^2]. Denne lette MongoDB ObjectID-implementering er blevet det foretrukne valg for udviklere, der har brug for ID'er uden fulde MongoDB-afhængigheder.

### Spamscanner: Bekæmpelse af e-mailmisbrug {#spam-scanner-fighting-email-abuse}

[Spam Scanner-organisation](https://github.com/spamscanner) viser vores engagement i at løse reelle problemer. Hovedpakken [`spamscanner`](https://github.com/spamscanner/spamscanner) tilbyder avanceret e-mail-spamdetektion, men det er [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-pakken, der har oplevet en fantastisk udbredelse.

Med over 1,2 millioner downloads på to måneder\[^3] løser `url-regex-safe` kritiske sikkerhedsproblemer i andre regulære udtryk til URL-detektion. Denne pakke viser vores tilgang til open source: at finde et almindeligt problem (i dette tilfælde [Gentag](https://en.wikipedia.org/wiki/ReDoS)-sårbarheder i URL-validering), skabe en solid løsning og vedligeholde den omhyggeligt.

### Bree: Moderne jobplanlægning med arbejdertråde {#bree-modern-job-scheduling-with-worker-threads}

[Bree-organisationen](https://github.com/breejs) er vores svar på en almindelig Node.js-udfordring: pålidelig jobplanlægning. Hovedpakken [`bree`](https://github.com/breejs/bree), med over 3.100 GitHub-stjerner, leverer en moderne jobplanlægger, der bruger Node.js-arbejdstråde for bedre ydeevne og pålidelighed.

> \[!NOTE]
> Bree blev oprettet, efter at vi hjalp med at vedligeholde [Dagsorden](https://github.com/agenda/agenda), og anvendte erfaringerne til at udvikle en bedre jobplanlægger. Vores bidrag til dagsordenen hjalp os med at finde måder at forbedre jobplanlægningen på.

Hvad gør Bree anderledes end andre planlægningsprogrammer som Agenda:

* **Ingen eksterne afhængigheder**: I modsætning til Agenda, som kræver MongoDB, kræver Bree ikke Redis eller MongoDB for at administrere jobstatus.
* **Arbejdstråde**: Bree bruger Node.js-arbejdstråde til sandbox-processer, hvilket giver bedre isolering og ydeevne.
* **Enkel API**: Bree tilbyder detaljeret kontrol med enkelhed, hvilket gør det nemmere at implementere komplekse planlægningsbehov.
* **Indbygget understøttelse**: Ting som elegant genindlæsning, cron-job, datoer og brugervenlige tidspunkter er inkluderet som standard.

Bree er en central del af [forwardemail.net](https://github.com/forwardemail/forwardemail.net) og håndterer kritiske baggrundsopgaver som e-mailbehandling, oprydning og planlagt vedligeholdelse. Brugen af Bree i Videresendt E-mail viser vores engagement i at bruge vores egne værktøjer i produktionen og sikre, at de opfylder høje pålidelighedsstandarder.

Vi bruger og værdsætter også andre fantastiske worker thread-pakker som [pool](https://github.com/piscinajs/piscina) og HTTP-klienter som [elleve](https://github.com/nodejs/undici). Piscina bruger, ligesom Bree, Node.js worker threads til effektiv opgavebehandling. Vi takker [Matthew Hill](https://github.com/mcollina), der vedligeholder både undici og piscina, for hans store bidrag til Node.js. Matteo sidder i Node.js' tekniske styringskomité og har forbedret HTTP-klientfunktionerne i Node.js betydeligt.

### Videresend e-mail: Open Source e-mailinfrastruktur {#forward-email-open-source-email-infrastructure}

Vores mest ambitiøse projekt er [Videresend e-mail](https://github.com/forwardemail), en open source-e-mailtjeneste, der tilbyder videresendelse af e-mail, lagring og API-tjenester. Hovedarkivet har over 1.100 GitHub-stjerner\[^4], hvilket viser fællesskabets påskønnelse af dette alternativ til proprietære e-mailtjenester.

Pakken [`preview-email`](https://github.com/forwardemail/preview-email) fra denne organisation, med over 2,5 millioner downloads på to måneder, er blevet et vigtigt værktøj for udviklere, der arbejder med e-mailskabeloner. Ved at give en enkel måde at forhåndsvise e-mails under udvikling, løser den et almindeligt problem i forbindelse med opbygning af e-mailaktiverede applikationer.

### Lad: Vigtige Koa-værktøjer og -værktøjer {#lad-essential-koa-utilities-and-tools}

[Drengeorganisation](https://github.com/ladjs) tilbyder en samling af essentielle værktøjer og hjælpeprogrammer, der primært fokuserer på at forbedre Koa-rammeværkssystemet. Disse pakker løser almindelige udfordringer inden for webudvikling og er designet til at fungere problemfrit sammen, samtidig med at de forbliver uafhængigt nyttige.

#### koa-better-error-handler: Forbedret fejlhåndtering for Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tilbyder en bedre fejlhåndteringsløsning til Koa-applikationer. Med over 50 GitHub-stjerner får denne pakke `ctx.throw` til at producere brugervenlige fejlmeddelelser, samtidig med at den adresserer flere begrænsninger i Koas indbyggede fejlhåndtering:

* Registrerer og håndterer korrekt Node.js DNS-fejl, Mongoose-fejl og Redis-fejl
* Bruger [Bum](https://github.com/hapijs/boom) til at oprette ensartede, velformaterede fejlsvar
* Bevarer headere (i modsætning til Koas indbyggede handler)
* Vedligeholder passende statuskoder i stedet for at bruge 500 som standard
* Understøtter flash-meddelelser og sessionsbevaring
* Leverer HTML-fejllister til valideringsfejl
* Understøtter flere svartyper (HTML, JSON og almindelig tekst)

Denne pakke er særligt værdifuld, når den bruges sammen med [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) til omfattende fejlhåndtering i Koa-applikationer.

#### pas: Godkendelse for Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) udvider den populære Passport.js-godkendelsesmiddleware med specifikke forbedringer til moderne webapplikationer. Denne pakke understøtter flere godkendelsesstrategier direkte fra starten:

* Lokal godkendelse med e-mail
* Log ind med Apple
* GitHub-godkendelse
* Google-godkendelse
* Godkendelse med engangsadgangskode (OTP)

Pakken er meget brugerdefinerbar, hvilket giver udviklere mulighed for at justere feltnavne og sætninger, så de matcher deres applikations krav. Den er designet til problemfri integration med Mongoose til brugeradministration, hvilket gør den til en ideel løsning til Koa-baserede applikationer, der kræver robust godkendelse.

#### elegant: Elegant programnedlukning {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) løser den kritiske udfordring med at lukke Node.js-applikationer ned uden problemer. Med over 70 GitHub-stjerner sikrer denne pakke, at din applikation kan afsluttes problemfrit uden at miste data eller lade forbindelser hænge. Nøglefunktioner inkluderer:

* Understøttelse af elegant lukning af HTTP-servere (Express/Koa/Fastify)
* Ren lukning af databaseforbindelser (MongoDB/Mongoose)
* Korrekt lukning af Redis-klienter
* Håndtering af Bree-jobplanlæggere
* Understøttelse af brugerdefinerede lukningsbehandlere
* Konfigurerbare timeout-indstillinger
* Integration med logging-systemer

Denne pakke er essentiel til produktionsapplikationer, hvor uventede nedlukninger kan føre til datatab eller beskadigelse. Ved at implementere korrekte nedlukningsprocedurer hjælper `@ladjs/graceful` med at sikre din applikations pålidelighed og stabilitet.

### Oppetid: Overvågning af oppetid med åben kildekode {#upptime-open-source-uptime-monitoring}

[Oppetidsorganisation](https://github.com/upptime) repræsenterer vores engagement i transparent, open source-overvågning. Det primære [`upptime`](https://github.com/upptime/upptime)-arkiv har over 13.000 GitHub-stjerner, hvilket gør det til et af de mest populære projekter, vi bidrager til. Upptime leverer en GitHub-drevet oppetidsovervågning og statusside, der fungerer helt uden en server.

Vi bruger Uptime til vores egen statusside på <https://status.forwardemail.net> med kildekoden tilgængelig på <https://github.com/forwardemail/status.forwardemail.net>.

Det, der gør Uptime speciel, er dens arkitektur:

* **100% Open Source**: Alle komponenter er fuldt open source og kan tilpasses.
* **Drevet af GitHub**: Udnytter GitHub-handlinger, -problemer og -sider til en serverløs overvågningsløsning.
* **Ingen server kræves**: I modsætning til traditionelle overvågningsværktøjer kræver Uptime ikke, at du kører eller vedligeholder en server.
* **Automatisk statusside**: Genererer en flot statusside, der kan hostes på GitHub Pages.
* **Kraftfulde notifikationer**: Integrerer med forskellige notifikationskanaler, herunder e-mail, SMS og Slack.

For at forbedre vores brugeres oplevelse har vi integreret [@octokit/core](https://github.com/octokit/core.js/) i forwardemail.net-kodebasen for at gengive statusopdateringer og hændelser i realtid direkte på vores hjemmeside. Denne integration giver vores brugere klar gennemsigtighed i tilfælde af problemer på tværs af hele vores stak (hjemmeside, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree osv.) med øjeblikkelige toast-notifikationer, ændringer af badge-ikoner, advarselsfarver og mere.

@octokit/core-biblioteket giver os mulighed for at hente realtidsdata fra vores Upptime GitHub-repository, behandle dem og vise dem på en brugervenlig måde. Når en tjeneste oplever et nedbrud eller forringet ydeevne, får brugerne øjeblikkeligt besked via visuelle indikatorer uden at skulle forlade hovedapplikationen. Denne problemfri integration sikrer, at vores brugere altid har opdaterede oplysninger om vores systemstatus, hvilket øger gennemsigtighed og tillid.

Uptime er blevet taget i brug af hundredvis af organisationer, der leder efter en transparent og pålidelig måde at overvåge deres tjenester og kommunikere status til brugerne. Projektets succes viser styrken ved at bygge værktøjer, der udnytter eksisterende infrastruktur (i dette tilfælde GitHub) til at løse almindelige problemer på nye måder.

## Vores bidrag til økosystemet for videresendelse af e-mails {#our-contributions-to-the-forward-email-ecosystem}

Selvom vores open source-pakker bruges af udviklere verden over, danner de også fundamentet for vores egen tjeneste til videresendelse af e-mails. Denne dobbelte rolle – som både skabere og brugere af disse værktøjer – giver os et unikt perspektiv på deres anvendelse i den virkelige verden og driver løbende forbedringer.

### Fra pakker til produktion {#from-packages-to-production}

Rejsen fra individuelle pakker til et sammenhængende produktionssystem involverer omhyggelig integration og udvidelse. For videresendelse af e-mails omfatter denne proces:

* **Brugerdefinerede udvidelser**: Opbygning af udvidelser specifikke for videresendelse af e-mails til vores open source-pakker, der imødekommer vores unikke krav.

* **Integrationsmønstre**: Udvikling af mønstre for, hvordan disse pakker interagerer i et produktionsmiljø.

* **Ydeevneoptimeringer**: Identificering og håndtering af flaskehalse i ydeevnen, der kun opstår i stor skala.

* **Sikkerhedshærdning**: Tilføjelse af yderligere sikkerhedslag specifikke for e-mailhåndtering og beskyttelse af brugerdata.

Dette arbejde repræsenterer tusindvis af timers udvikling ud over selve kernepakkerne, hvilket resulterer i en robust og sikker e-mailtjeneste, der udnytter det bedste af vores open source-bidrag.

### Feedback-løkken {#the-feedback-loop}

Det måske mest værdifulde aspekt ved at bruge vores egne pakker i produktion er den feedback-loop, det skaber. Når vi støder på begrænsninger eller edge-sager i Forward Email, opdaterer vi dem ikke bare lokalt – vi forbedrer de underliggende pakker, hvilket gavner både vores tjeneste og det bredere fællesskab.

Denne tilgang har ført til adskillige forbedringer:

* **Brees elegante nedlukning**: Behovet for implementeringer uden nedetid i videresendelse af e-mail har ført til forbedrede muligheder for elegant nedlukning i Bree.
* **Spamscanners mønstergenkendelse**: Spammønstre fra den virkelige verden, der opstår i videresendelse af e-mail, har påvirket Spamscanners detektionsalgoritmer.
* **Cabins ydeevneoptimeringer**: Logføring af store mængder i produktionen afslørede optimeringsmuligheder i Cabin, der gavner alle brugere.

Ved at opretholde denne positive cirkel mellem vores open source-arbejde og produktionsservice sikrer vi, at vores pakker forbliver praktiske, gennemprøvede løsninger snarere end teoretiske implementeringer.

## Kerneprincipper for videresendelse af e-mail: Et fundament for ekspertise {#forward-emails-core-principles-a-foundation-for-excellence}

Videresend e-mail er designet i henhold til et sæt kerneprincipper, der styrer alle vores udviklingsbeslutninger. Disse principper, som er beskrevet i vores [hjemmeside](/blog/docs/best-quantum-safe-encrypted-email-service#principles), sikrer, at vores tjeneste forbliver udviklervenlig, sikker og fokuseret på brugernes privatliv.

### Altid udviklervenlig, sikkerhedsfokuseret og transparent {#always-developer-friendly-security-focused-and-transparent}

Vores første og vigtigste princip er at skabe software, der er udviklervenlig, samtidig med at de højeste standarder for sikkerhed og privatliv opretholdes. Vi mener, at teknisk ekspertise aldrig bør gå på bekostning af brugervenlighed, og at gennemsigtighed opbygger tillid i vores fællesskab.

Dette princip afspejles i vores detaljerede dokumentation, klare fejlmeddelelser og åbne kommunikation om både succeser og udfordringer. Ved at gøre hele vores kodebase open source inviterer vi til granskning og samarbejde, hvilket styrker både vores software og det bredere økosystem.

### Overholdelse af tidstestede principper for softwareudvikling {#adherence-to-time-tested-software-development-principles}

Vi følger adskillige etablerede softwareudviklingsprincipper, der har bevist deres værdi gennem årtier:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Adskillelse af bekymringer gennem Model-View-Controller-mønsteret
* **[Unix-filosofi](https://en.wikipedia.org/wiki/Unix_philosophy)**: Oprettelse af modulære komponenter, der gør én ting godt
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Holder det enkelt og ligetil
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Gentag ikke dig selv, fremmer genbrug af kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du får ikke brug for det, undgår for tidlig optimering
* **[Tolv Faktor](https://12factor.net/)**: Følger bedste praksis for at bygge moderne, skalerbare applikationer
* **[Occams barberkniv](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Valg af den enkleste løsning, der opfylder kravene
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Bruger vores egne produkter i vid udstrækning

Disse principper er ikke blot teoretiske koncepter – de er indlejret i vores daglige udviklingspraksis. For eksempel er vores overholdelse af Unix-filosofien tydelig i, hvordan vi har struktureret vores npm-pakker: små, fokuserede moduler, der kan sammensættes for at løse komplekse problemer.

### Målrettet mod den ustabile, bootstrappede udvikler {#targeting-the-scrappy-bootstrapped-developer}

Vi henvender os specifikt til scrappy-udviklere, bootstrappede udviklere og [ramen-profitabel](https://www.paulgraham.com/ramenprofitable.html)-udviklere. Dette fokus former alt fra vores prismodel til vores tekniske beslutninger. Vi forstår udfordringerne ved at bygge produkter med begrænsede ressourcer, fordi vi selv har prøvet det.

Dette princip er særligt vigtigt i vores tilgang til open source. Vi skaber og vedligeholder pakker, der løser reelle problemer for udviklere uden store virksomhedsbudgetter, og gør dermed effektive værktøjer tilgængelige for alle uanset deres ressourcer.

### Principper i praksis: Kodebasen for videresendelse af e-mails {#principles-in-practice-the-forward-email-codebase}

Disse principper er tydeligt synlige i kodebasen for videresendelse af e-mails. Vores package.json-fil afslører et gennemtænkt udvalg af afhængigheder, der hver især er valgt til at stemme overens med vores kerneværdier:

* Sikkerhedsfokuserede pakker som `mailauth` til e-mail-godkendelse
* Udviklervenlige værktøjer som `preview-email` til nemmere fejlfinding
* Modulære komponenter som de forskellige `p-*`-værktøjer fra Sindre Sorhus

Ved at følge disse principper konsekvent over tid har vi bygget en tjeneste, som udviklere kan stole på med deres e-mailinfrastruktur – sikker, pålidelig og i overensstemmelse med værdierne i open source-fællesskabet.

### Privatlivsbeskyttelse gennem design {#privacy-by-design}

Privatliv er ikke en eftertanke eller marketingfunktion for videresendelse af e-mails – det er et grundlæggende designprincip, der præger alle aspekter af vores service og kode:

* **Nul adgangskryptering**: Vi har implementeret systemer, der gør det teknisk umuligt for os at læse brugernes e-mails.
* **Minimal dataindsamling**: Vi indsamler kun de data, der er nødvendige for at levere vores service, intet mere.
* **Gennemsigtige politikker**: Vores privatlivspolitik er skrevet i et klart og forståeligt sprog uden juridisk jargon.
* **Open Source-verifikation**: Vores open source-kodebase giver sikkerhedsforskere mulighed for at verificere vores påstande om beskyttelse af personlige oplysninger.

Denne forpligtelse gælder også vores open source-pakker, som er designet med bedste praksis for sikkerhed og privatliv indbygget fra bunden.

### Bæredygtig åben kildekode {#sustainable-open-source}

Vi mener, at open source-software har brug for bæredygtige modeller for at trives på lang sigt. Vores tilgang omfatter:

* **Kommerciel support**: Tilbyder premium support og tjenester omkring vores open source-værktøjer.
* **Balanceret licensering**: Brug af licenser, der beskytter både brugerfriheder og projektets bæredygtighed.
* **Fællesskabsengagement**: Aktivt engagement med bidragydere for at opbygge et støttende fællesskab.
* **Transparente køreplaner**: Deling af vores udviklingsplaner, så brugerne kan planlægge i overensstemmelse hermed.

Ved at fokusere på bæredygtighed sikrer vi, at vores open source-bidrag kan fortsætte med at vokse og forbedres over tid i stedet for at blive forsømt.

## Tallene lyver ikke: Vores svimlende npm-downloadstatistik {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Når vi taler om effekten af open source-software, giver downloadstatistikker et håndgribeligt mål for implementering og tillid. Mange af de pakker, vi hjælper med at vedligeholde, har nået et omfang, som få open source-projekter nogensinde opnår, med samlede downloads, der tæller i milliarder.

![Top npm-pakker efter downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Selvom vi er stolte af at kunne vedligeholde adskillige pakker med høj downloadhastighed i JavaScript-økosystemet, vil vi gerne anerkende, at mange af disse pakker oprindeligt blev skabt af andre talentfulde udviklere. Pakker som superagent og supertest blev oprindeligt skabt af TJ Holowaychuk, hvis produktive bidrag til open source har været afgørende for at forme Node.js-økosystemet.

### Et fugleperspektiv på vores indflydelse {#a-birds-eye-view-of-our-impact}

I løbet af blot to måneder fra februar til marts 2025 er de bedste pakker, vi bidrager til og hjælper med at opretholde rekordhøje downloadtal:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 downloads\[^7] (oprindeligt oprettet af TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 downloads\[^8] (oprindeligt oprettet af TJ Holowaychuk)
* **[også](https://www.npmjs.com/package/koa)**: 28.539.295 downloads\[^34] (oprindeligt oprettet af TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 downloads\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 downloads\[^37]
* **[forhåndsvisnings-e-mail](https://www.npmjs.com/package/preview-email)**: 2.500.000 downloads\[^9]
* **[kabine](https://www.npmjs.com/package/cabin)**: 1.800.000 downloads\[^10]
* **[@breejs/senere](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 downloads\[^38]
* **[e-mail-skabeloner](https://www.npmjs.com/package/email-templates)**: 1.128.139 downloads\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 downloads\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 downloads\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 downloads\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 downloads\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 downloads\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 downloads\[^30]

> \[!NOTE]
> Adskillige andre pakker, som vi hjælper med at vedligeholde, men ikke har oprettet, har endnu højere downloadtal, herunder `form-data` (738 millioner downloads), `toidentifier` (309 millioner downloads), `stackframe` (116 millioner downloads) og `error-stack-parser` (113 millioner downloads). Vi er beærede over at bidrage til disse pakker, samtidig med at vi respekterer de oprindelige forfatteres arbejde.

Det er ikke bare imponerende tal – de repræsenterer rigtige udviklere, der løser rigtige problemer med kode, som vi hjælper med at vedligeholde. Hver download er et eksempel, hvor disse pakker har hjulpet nogen med at bygge noget meningsfuldt, lige fra hobbyprojekter til virksomhedsapplikationer, der bruges af millioner.

![Pakkekategorier Distribution](/img/art/category_pie_chart.svg)

### Daglig påvirkning i stor skala {#daily-impact-at-scale}

De daglige downloadmønstre afslører en konstant brug i høj volumen med toppe på millioner af downloads om dagen\[^13]. Denne konsistens vidner om stabiliteten og pålideligheden af disse pakker – udviklere prøver dem ikke bare; de integrerer dem i deres kernearbejdsgange og er afhængige af dem dag efter dag.

Ugentlige downloadmønstre viser endnu mere imponerende tal, der konstant ligger omkring titusindvis af downloads om ugen\[^14]. Dette repræsenterer et massivt fodaftryk i JavaScript-økosystemet, hvor disse pakker kører i produktionsmiljøer over hele kloden.

### Ud over de rå tal {#beyond-the-raw-numbers}

Selvom downloadstatistikkerne i sig selv er imponerende, fortæller de en dybere historie om den tillid, som fællesskabet har til disse pakker. Vedligeholdelse af pakker i denne skala kræver en urokkelig forpligtelse til:

* **Bagudkompatibilitet**: Ændringer skal overvejes nøje for at undgå at ødelægge eksisterende implementeringer.
* **Sikkerhed**: Med millioner af applikationer, der er afhængige af disse pakker, kan sikkerhedssårbarheder have vidtrækkende konsekvenser.
* **Ydeevne**: I denne skala kan selv mindre forbedringer af ydeevnen have betydelige samlede fordele.
* **Dokumentation**: Tydelig, omfattende dokumentation er afgørende for pakker, der bruges af udviklere på alle erfaringsniveauer.

Den konstante vækst i antallet af downloads over tid afspejler succesen med at opfylde disse forpligtelser og opbygge tillid til udviklerfællesskabet gennem pålidelige og velholdte pakker.

## Støtte til økosystemet: Vores open source-sponsorater {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Bæredygtighed i open source handler ikke kun om at bidrage med kode – det handler også om at støtte de udviklere, der vedligeholder kritisk infrastruktur.

Ud over vores direkte bidrag til JavaScript-økosystemet er vi stolte af at sponsorere fremtrædende Node.js-bidragydere, hvis arbejde danner grundlaget for mange moderne applikationer. Vores sponsorater omfatter:

### Andris Reinman: Pioner inden for e-mail-infrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) er skaberen af [Nodemailer](https://github.com/nodemailer/nodemailer), det mest populære bibliotek til afsendelse af e-mails til Node.js med over 14 millioner ugentlige downloads\[^15]. Hans arbejde strækker sig til andre kritiske e-mailinfrastrukturkomponenter som [SMTP-server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) og [Vildand](https://github.com/nodemailer/wildduck).

Vores sponsorat er med til at sikre den fortsatte vedligeholdelse og udvikling af disse essentielle værktøjer, der driver e-mailkommunikation for utallige Node.js-applikationer, herunder vores egen videresendelsestjeneste for e-mail.

### Sindre Sorhus: Utility Package Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sørhus](https://github.com/sindresorhus) er en af de mest produktive open source-bidragydere i JavaScript-økosystemet med over 1.000 npm-pakker. Hans værktøjer som [p-kort](https://github.com/sindresorhus/p-map), [p-genforsøg](https://github.com/sindresorhus/p-retry) og [er-stream](https://github.com/sindresorhus/is-stream) er grundlæggende byggesten, der bruges i hele Node.js-økosystemet.

Ved at sponsorere Sindres arbejde hjælper vi med at opretholde udviklingen af disse kritiske værktøjer, der gør JavaScript-udvikling mere effektiv og pålidelig.

Disse sponsorater afspejler vores engagement i det bredere open source-økosystem. Vi anerkender, at vores egen succes er bygget på det fundament, der er lagt af disse og andre bidragydere, og vi er dedikerede til at sikre bæredygtigheden af hele økosystemet.

## Afdækning af sikkerhedssårbarheder i JavaScript-økosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vores engagement i open source rækker ud over funktionsudvikling og omfatter også identifikation og håndtering af sikkerhedssårbarheder, der kan påvirke millioner af udviklere. Flere af vores mest betydningsfulde bidrag til JavaScript-økosystemet har været inden for sikkerhed.

### Koa-Router-redningen {#the-koa-router-rescue}

I februar 2019 identificerede Nick et kritisk problem med vedligeholdelsen af den populære koa-router-pakke. Da han [rapporteret på Hacker News](https://news.ycombinator.com/item?id=19156707), var pakken blevet forladt af den oprindelige vedligeholder, hvilket efterlod sikkerhedssårbarheder uadresserede og fællesskabet uden opdateringer.

> \[!WARNING]
> Forladte pakker med sikkerhedssårbarheder udgør betydelige risici for hele økosystemet, især når de downloades millioner af gange om ugen.

Som svar oprettede Nick [@koa/router](https://github.com/koajs/router) og hjalp med at advare fællesskabet om situationen. Han har vedligeholdt denne kritiske pakke lige siden og sikret, at Koa-brugere har en sikker og velholdt routingløsning.

### Håndtering af ReDoS-sårbarheder {#addressing-redos-vulnerabilities}

I 2020 identificerede og adresserede Nick en kritisk [Denial of Service (ReDoS) for regulære udtryk](https://en.wikipedia.org/wiki/ReDoS)-sårbarhed i den udbredte `url-regex`-pakke. Denne sårbarhed ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kunne give angribere mulighed for at forårsage denial of service ved at levere specielt udformet input, der forårsagede katastrofal backtracking i det regulære udtryk.

I stedet for blot at opdatere den eksisterende pakke, skabte Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en fuldstændig omskrevet implementering, der adresserer sårbarheden, samtidig med at den opretholder kompatibilitet med den originale API. Han udgav også en [omfattende blogindlæg](/blog/docs/url-regex-javascript-node-js), der forklarer sårbarheden og hvordan man kan afhjælpe den.

Dette arbejde viser vores tilgang til sikkerhed: ikke blot at løse problemer, men også at uddanne lokalsamfundet og tilbyde robuste alternativer, der forhindrer lignende problemer i fremtiden.

### Fortaler for Node.js og Chromium-sikkerhed {#advocating-for-nodejs-and-chromium-security}

Nick har også været aktiv i at tale for sikkerhedsforbedringer i det bredere økosystem. I august 2020 identificerede han et betydeligt sikkerhedsproblem i Node.js relateret til dets håndtering af HTTP-headere, hvilket blev rapporteret i [Registeret](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Dette problem, som stammede fra en programrettelse i Chromium, kunne potentielt give angribere mulighed for at omgå sikkerhedsforanstaltninger. Nicks indsats hjalp med at sikre, at problemet blev løst hurtigt, hvilket beskyttede millioner af Node.js-applikationer mod potentiel udnyttelse.

### Sikring af npm-infrastruktur {#securing-npm-infrastructure}

Senere samme måned identificerede Nick endnu et kritisk sikkerhedsproblem, denne gang i npms e-mailinfrastruktur. Som rapporteret i [Registeret](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) implementerede npm ikke korrekt DMARC-, SPF- og DKIM-e-mailgodkendelsesprotokoller, hvilket potentielt tillod angribere at sende phishing-e-mails, der så ud til at komme fra npm.

Nicks rapport førte til forbedringer i npms e-mailsikkerhedstilstand og beskyttede de millioner af udviklere, der er afhængige af npm til pakkehåndtering, mod potentielle phishing-angreb.

## Vores bidrag til økosystemet for videresendelse af e-mails {#our-contributions-to-the-forward-email-ecosystem-1}

Videresend e-mail er bygget oven på adskillige kritiske open source-projekter, herunder Nodemailer, WildDuck og mailauth. Vores team har ydet betydelige bidrag til disse projekter og hjulpet med at identificere og løse dybe problemer, der påvirker e-maillevering og -sikkerhed.

### Forbedring af Nodemailers kernefunktionalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) er rygraden i e-mailafsendelse i Node.js, og vores bidrag har bidraget til at gøre den mere robust:

* **Forbedringer af SMTP-server**: Vi har rettet parsing-fejl, problemer med streamhåndtering og TLS-konfigurationsproblemer i SMTP-serverkomponenten\[^16]\[^17].
* **Forbedringer af mailparser**: Vi har adresseret fejl i afkodning af tegnsekvenser og parser-problemer, der kan forårsage fejl i e-mailbehandling\[^18]\[^19].

Disse bidrag sikrer, at Nodemailer forbliver et pålideligt fundament for e-mailbehandling i Node.js-applikationer, herunder videresendelse af e-mail.

### Fremme af e-mailgodkendelse med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) leverer kritisk e-mail-godkendelsesfunktionalitet, og vores bidrag har forbedret dens funktioner betydeligt:

* **Forbedringer af DKIM-bekræftelse**: Vi opdagede og rapporterede, at X/Twitter havde problemer med DNS-cache, der forårsagede DKIM-fejl for deres udgående beskeder, og rapporterede det på Hacker One\[^20].
* **Forbedringer af DMARC og ARC**: Vi har rettet problemer med DMARC- og ARC-bekræftelse, der kunne føre til forkerte godkendelsesresultater\[^21]\[^22].
* **Ydeevneoptimeringer**: Vi har bidraget med optimeringer, der forbedrer ydeevnen af e-mail-godkendelsesprocesser\[^23]\[^24]\[^25]\[^26].

Disse forbedringer er med til at sikre, at e-mailgodkendelse er nøjagtig og pålidelig, hvilket beskytter brugerne mod phishing- og spoofingangreb.

### Forbedringer af nøgleoppetid {#key-upptime-enhancements}

Vores bidrag til Uptime inkluderer:

* **Overvågning af SSL-certifikater**: Vi har tilføjet funktionalitet til at overvåge udløb af SSL-certifikater, hvilket forhindrer uventet nedetid på grund af udløbne certifikater\[^27].
* **Understøttelse af flere SMS-numre**: Vi har implementeret understøttelse af at advare flere teammedlemmer via SMS, når der opstår hændelser, hvilket forbedrer svartiderne\[^28].
* **Rettelser til IPv6-tjek**: Vi har rettet problemer med IPv6-forbindelsestjek, hvilket sikrer mere præcis overvågning i moderne netværksmiljøer\[^29].
* **Understøttelse af mørk/lys tilstand**: Vi har tilføjet temaunderstøttelse for at forbedre brugeroplevelsen på statussider\[^31].
* **Bedre TCP-Ping-understøttelse**: Vi har forbedret TCP-ping-funktionen for at give mere pålidelig forbindelsestest\[^32].

Disse forbedringer gavner ikke kun statusovervågningen af Forward Email, men er også tilgængelige for hele Uptime-brugerfællesskabet, hvilket demonstrerer vores engagement i at forbedre de værktøjer, vi er afhængige af.

## Limen der holder det hele sammen: Brugerdefineret kode i stor skala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Selvom vores npm-pakker og bidrag til eksisterende projekter er betydelige, er det den brugerdefinerede kode, der integrerer disse komponenter, der virkelig viser vores tekniske ekspertise. Forward Email-kodebasen repræsenterer et årtis udviklingsindsats, der går tilbage til 2017, hvor projektet startede som [gratis videresendelse af e-mails](https://github.com/forwardemail/free-email-forwarding), før det blev fusioneret til et monorepo.

### En massiv udviklingsindsats {#a-massive-development-effort}

Omfanget af denne brugerdefinerede integrationskode er imponerende:

* **Samlede bidrag**: Over 3.217 commits
* **Kodebasestørrelse**: Over 421.545 linjer kode på tværs af JavaScript-, Pug-, CSS- og JSON-filer\[^33]

Dette repræsenterer tusindvis af timers udviklingsarbejde, fejlfindingssessioner og ydeevneoptimeringer. Det er den "hemmelige ingrediens", der forvandler individuelle pakker til en sammenhængende og pålidelig tjeneste, der bruges af tusindvis af kunder dagligt.

### Integration af kerneafhængigheder {#core-dependencies-integration}

Kodebasen til videresendelse af e-mail integrerer adskillige afhængigheder i en problemfri helhed:

* **E-mailbehandling**: Integrerer Nodemailer til afsendelse, SMTP-server til modtagelse og Mailparser til parsing
* **Godkendelse**: Bruger Mailauth til DKIM-, SPF-, DMARC- og ARC-verifikation
* **DNS-opløsning**: Udnytter Tangerine til DNS-over-HTTPS med global caching
* **MX-forbindelse**: Bruger mx-connect med Tangerine-integration til pålidelige mailserverforbindelser
* **Jobplanlægning**: Bruger Bree til pålidelig baggrundsopgavebehandling med arbejdstråde
* **Skabeloner**: Bruger e-mail-skabeloner til at genbruge stylesheets fra webstedet i kundekommunikation
* **E-maillagring**: Implementerer individuelt krypterede SQLite-postkasser ved hjælp af better-sqlite3-multiple-ciphers med ChaCha20-Poly1305-kryptering for kvantesikker privatliv, hvilket sikrer fuldstændig isolation mellem brugere, og at kun brugeren har adgang til sin postkasse

Hver af disse integrationer kræver omhyggelig overvejelse af edge cases, ydeevneimplikationer og sikkerhedsproblemer. Resultatet er et robust system, der håndterer millioner af e-mailtransaktioner pålideligt. Vores SQLite-implementering udnytter også msgpackr til effektiv binær serialisering og WebSockets (via ws) til statusopdateringer i realtid på tværs af vores infrastruktur.

### DNS-infrastruktur med Tangerine og mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En kritisk komponent i infrastrukturen for videresendelse af e-mail er vores DNS-løsningssystem, der er bygget op omkring to nøglepakker:

* **[Mandarin](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vores Node.js DNS-over-HTTPS-implementering tilbyder en drop-in-erstatning for standard DNS-resolveren med indbyggede genforsøg, timeouts, smart serverrotation og caching-understøttelse.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Denne pakke opretter TCP-forbindelser til MX-servere, tager et måldomæne eller en e-mailadresse, identificerer relevante MX-servere og opretter forbindelse til dem i prioriteret rækkefølge.

Vi har integreret Tangerine med mx-connect via [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), der sikrer DNS på applikationslaget frem for HTTP-anmodninger i hele Forward Email. Dette giver global caching til DNS i stor skala med 1:1-konsistens på tværs af enhver region, app eller proces – afgørende for pålidelig e-maillevering i et distribueret system.

## Virksomhedspåvirkning: Fra Open Source til missionskritiske løsninger {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kulminationen af vores årti lange rejse inden for open source-udvikling har gjort det muligt for Forward Email at betjene ikke kun individuelle udviklere, men også store virksomheder og uddannelsesinstitutioner, der danner rygraden i selve open source-bevægelsen.

### Casestudier i missionskritisk e-mailinfrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Vores engagement i pålidelighed, privatliv og open source-principper har gjort Forward Email til det betroede valg for organisationer med krævende e-mailkrav:

* **Uddannelsesinstitutioner**: Som beskrevet i vores [casestudie om videresendelse af e-mail for alumner]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study). Store universiteter er afhængige af vores infrastruktur for at opretholde livslange forbindelser med hundredtusindvis af alumner gennem pålidelige e-mail-videresendelsestjenester.

* **Enterprise Linux-løsninger**: [Canonical Ubuntu e-mail virksomhedscasestudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demonstrerer, hvordan vores open source-tilgang passer perfekt til behovene hos enterprise Linux-udbydere og giver dem den gennemsigtighed og kontrol, de har brug for.

* **Open Source Foundations**: Måske mest bekræftende er vores partnerskab med Linux Foundation, som dokumenteret i [Linux Foundation e-mail virksomheds casestudie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), hvor vores tjeneste driver kommunikationen for netop den organisation, der forvalter Linux-udvikling.

Der er en smuk symmetri i, hvordan vores open source-pakker, der er blevet omhyggeligt vedligeholdt over mange år, har gjort det muligt for os at opbygge en e-mailtjeneste, der nu understøtter de samme fællesskaber og organisationer, der går ind for open source-software. Denne komplette rejse – fra at bidrage med individuelle pakker til at drive e-mailinfrastruktur i virksomhedsklassen for open source-ledere – repræsenterer den ultimative validering af vores tilgang til softwareudvikling.

## Et årti med open source: Et kig fremad {#a-decade-of-open-source-looking-forward}

Når vi ser tilbage på et årti med open source-bidrag og frem mod de næste ti år, er vi fyldt med taknemmelighed for det fællesskab, der har støttet vores arbejde, og begejstring for det, der venter os.

Vores rejse fra individuelle pakkebidragydere til vedligeholdelse af en omfattende e-mailinfrastruktur, der bruges af store virksomheder og open source-fonde, har været bemærkelsesværdig. Det er et bevis på kraften i open source-udvikling og den indflydelse, som gennemtænkt, velholdt software kan have på det bredere økosystem.

I de kommende år er vi forpligtet til at:

* **Fortsat vedligeholdelse og forbedring af vores eksisterende pakker** og sikring af, at de forbliver pålidelige værktøjer for udviklere verden over.
* **Udvidelse af vores bidrag til kritiske infrastrukturprojekter**, især inden for e-mail og sikkerhed.
* **Forbedring af mulighederne i videresendelse af e-mail**, samtidig med at vi opretholder vores engagement i privatliv, sikkerhed og gennemsigtighed.
* **Støtte til den næste generation af open source-bidragydere** gennem mentorordninger, sponsorering og engagement i lokalsamfundet.

Vi tror på, at fremtiden for softwareudvikling er åben, samarbejdsorienteret og bygget på et fundament af tillid. Ved fortsat at bidrage med pakker af høj kvalitet med fokus på sikkerhed til JavaScript-økosystemet, håber vi at kunne spille en lille rolle i at opbygge den fremtid.

Tak til alle, der har brugt vores pakker, bidraget til vores projekter, rapporteret problemer eller blot spredt budskabet om vores arbejde. Jeres støtte har gjort dette årti med indflydelse mulig, og vi glæder os til at se, hvad vi kan udrette sammen i de næste ti år.

\[^1]: npm downloadstatistik for cabin, april 2025
\[^2]: npm downloadstatistik for bson-objectid, februar-marts 2025
\[^3]: npm downloadstatistik for url-regex-safe, april 2025
\[^4]: GitHub-stjerneantal for forwardemail/forwardemail.net pr. april 2025
\[^5]: npm downloadstatistik for preview-email, april 2025
\[^7]: npm downloadstatistik for superagent, februar-marts 2025
\[^8]: npm downloadstatistik for supertest, februar-marts 2025
\[^9]: npm downloadstatistik for preview-email, februar-marts 2025
\[^10]: npm downloadstatistik for cabin, februar-marts 2025
\[^11]: npm downloadstatistik for url-regex-safe, februar-marts 2025
\[^12]: npm downloadstatistik for spamscanner, februar-marts 2025
\[^13]: Daglige downloadmønstre fra npm-statistikker, april 2025
\[^14]: Ugentlige downloadmønstre fra npm-statistikker, april 2025
\[^15]: npm downloadstatistik for nodemailer, april 2025
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
\[^27]: Baseret på GitHub-problemer i Upptime-arkivet
\[^28]: Baseret på GitHub-problemer i Upptime-arkivet
\[^29]: Baseret på GitHub-problemer i Upptime-arkivet
\[^30]: npm downloadstatistik for bree, februar-marts 2025
\[^31]: Baseret på GitHub pull-anmodninger til Upptime
\[^32]: Baseret på GitHub pull-anmodninger til Upptime
\[^34]: npm downloadstatistik for koa, februar-marts 2025
\[^35]: npm downloadstatistik for @koa/router, februar-marts 2025
\[^36]: npm downloadstatistik for koa-router, februar-marts 2025
\[^37]: npm downloadstatistik for url-regex, februar-marts 2025
\[^38]: npm downloadstatistik for @breejs/later, februar-marts 2025
\[^39]: npm downloadstatistik for e-mail-skabeloner, februar-marts 2025
\[^40]: npm downloadstatistik for get-paths, februar-marts 2025
\[^41]: npm downloadstatistik for dotenv-parse-variabler, februar-marts 2025
\[^42]: npm downloadstatistik for @koa/multer, februar-marts 2025