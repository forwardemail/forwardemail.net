# Et tiår med innvirkning: Hvordan våre npm-pakker nådde 1 milliard nedlastinger og formet JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Pionerene som stoler på oss: Isaac Z. Schlueter og Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Fra npm sin opprettelse til Node.js-lederskap](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bak koden: Nick Baughs reise](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express tekniske komité og kjernebidrag](#express-technical-committee-and-core-contributions)
  * [Koa-rammeverkets bidrag](#koa-framework-contributions)
  * [Fra individuell bidragsyter til organisasjonsleder](#from-individual-contributor-to-organization-leader)
* [Våre GitHub-organisasjoner: Økosystemer av innovasjon](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturert logging for moderne applikasjoner](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Bekjempelse av e-postmisbruk](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderne jobbplanlegging med worker threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Åpen kildekode e-postinfrastruktur](#forward-email-open-source-email-infrastructure)
  * [Lad: Essensielle Koa-verktøy og -verktøysett](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Åpen kildekode for oppetidsovervåking](#upptime-open-source-uptime-monitoring)
* [Våre bidrag til Forward Email-økosystemet](#our-contributions-to-the-forward-email-ecosystem)
  * [Fra pakker til produksjon](#from-packages-to-production)
  * [Tilbakemeldingssløyfen](#the-feedback-loop)
* [Forward Emails kjerneprinsipper: Et fundament for fortreffelighet](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Alltid utviklervennlig, sikkerhetsfokusert og transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Overholdelse av tidstestede prinsipper for programvareutvikling](#adherence-to-time-tested-software-development-principles)
  * [Målretting mot den ressurssterke, selvfinansierte utvikleren](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinsipper i praksis: Forward Email-kodebasen](#principles-in-practice-the-forward-email-codebase)
  * [Personvern ved design](#privacy-by-design)
  * [Bærekraftig åpen kildekode](#sustainable-open-source)
* [Tallene lyver ikke: Våre imponerende npm-nedlastingsstatistikker](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Et fugleperspektiv på vår innvirkning](#a-birds-eye-view-of-our-impact)
  * [Daglig innvirkning i stor skala](#daily-impact-at-scale)
  * [Utover de rå tallene](#beyond-the-raw-numbers)
* [Støtte til økosystemet: Våre sponsorer innen åpen kildekode](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pioner innen e-postinfrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mester i verktøypakker](#sindre-sorhus-utility-package-mastermind)
* [Avdekking av sikkerhetssårbarheter i JavaScript-økosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Redningen av Koa-Router](#the-koa-router-rescue)
  * [Håndtering av ReDoS-sårbarheter](#addressing-redos-vulnerabilities)
  * [Talsmann for Node.js- og Chromium-sikkerhet](#advocating-for-nodejs-and-chromium-security)
  * [Sikring av npm-infrastruktur](#securing-npm-infrastructure)
* [Våre bidrag til Forward Email-økosystemet](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Forbedring av Nodemailers kjernefunksjonalitet](#enhancing-nodemailers-core-functionality)
  * [Fremme av e-postautentisering med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Viktige forbedringer i Upptime](#key-upptime-enhancements)
* [Limet som holder alt sammen: Egendefinert kode i stor skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv utviklingsinnsats](#a-massive-development-effort)
  * [Integrasjon av kjerneavhengigheter](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine og mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Bedriftsinnvirkning: Fra åpen kildekode til kritiske løsninger](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Case-studier i kritisk e-postinfrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Et tiår med åpen kildekode: Ser fremover](#a-decade-of-open-source-looking-forward)
## Forord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript)- og [Node.js](https://en.wikipedia.org/wiki/Node.js)-verdenen er noen pakker essensielle—lastet ned millioner av ganger daglig og driver apper over hele verden. Bak disse verktøyene står utviklere som fokuserer på åpen kildekode-kvalitet. I dag viser vi hvordan teamet vårt hjelper til med å bygge og vedlikeholde npm-pakker som har blitt viktige deler av JavaScript-økosystemet.


## Pionerene som stoler på oss: Isaac Z. Schlueter og Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi er stolte av å ha [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som bruker. Isaac skapte [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) og hjalp til med å bygge [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans tillit til Forward Email viser vårt fokus på kvalitet og sikkerhet. Isaac bruker Forward Email for flere domener, inkludert izs.me.

Isaacs innflytelse på JavaScript er enorm. I 2009 var han blant de første som så potensialet i Node.js, og jobbet med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skapte plattformen. Som Isaac sa i et [intervju med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Midt i dette veldig lille fellesskapet av en gjeng folk som prøvde å finne ut hvordan man skulle få server-side JS til å fungere, kom Ryan Dahl ut med Node, som ganske klart var den riktige tilnærmingen. Jeg satset på det og ble veldig involvert omtrent midt i 2009."

> \[!NOTE]
> For de som er interessert i historien om Node.js, finnes det utmerkede dokumentarer som skildrer utviklingen, inkludert [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) og [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [personlige nettside](https://tinyclouds.org/) inneholder også verdifulle innsikter i hans arbeid.

### Fra npm sin opprettelse til lederskap i Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac opprettet npm i september 2009, med den første brukbare versjonen utgitt tidlig i 2010. Denne pakkebehandleren fylte et viktig behov i Node.js, og lot utviklere enkelt dele og gjenbruke kode. Ifølge [Node.js Wikipedia-siden](https://en.wikipedia.org/wiki/Node.js), "I januar 2010 ble en pakkebehandler introdusert for Node.js-miljøet kalt npm. Pakkebehandleren lar programmerere publisere og dele Node.js-pakker, sammen med tilhørende kildekode, og er designet for å forenkle installasjon, oppdatering og avinstallasjon av pakker."

Da Ryan Dahl trådte tilbake fra Node.js i januar 2012, tok Isaac over som prosjektleder. Som nevnt på [hans CV](https://izs.me/resume), "Ledet utviklingen av flere grunnleggende Node.js-kjerne-APIer, inkludert CommonJS-modulsystem, filsystem-APIer og streams" og "Fungerte som BDFL (Benevolent Dictator For Life) for prosjektet i 2 år, og sikret stadig økende kvalitet og pålitelig byggeprosess for Node.js-versjoner v0.6 til v0.10."

Isaac ledet Node.js gjennom en viktig vekstperiode, og satte standarder som fortsatt preger plattformen i dag. Han startet senere npm, Inc. i 2014 for å støtte npm-registret, som han tidligere hadde drevet på egen hånd.

Vi takker Isaac for hans enorme bidrag til JavaScript og fortsetter å bruke mange pakker han har skapt. Hans arbeid har endret hvordan vi bygger programvare og hvordan millioner av utviklere deler kode verden over.


## Arkitekten bak koden: Nick Baughs reise {#the-architect-behind-the-code-nick-baughs-journey}

Kjernen i vår suksess med åpen kildekode er Nick Baugh, grunnlegger og eier av Forward Email. Hans arbeid innen JavaScript strekker seg over nesten 20 år og har formet hvordan utallige utviklere bygger apper. Hans reise innen åpen kildekode viser både teknisk dyktighet og lederskap i fellesskapet.

### Express Technical Committee og kjernebidrag {#express-technical-committee-and-core-contributions}

Nicks ekspertise innen web-rammeverk ga ham en plass i [Express Technical Committee](https://expressjs.com/en/resources/community.html), hvor han bidro til et av de mest brukte Node.js-rammeverkene. Nick er nå oppført som inaktiv medlem på [Express community page](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express ble opprinnelig laget av TJ Holowaychuk, en produktiv bidragsyter til åpen kildekode som har formet mye av Node.js-økosystemet. Vi er takknemlige for TJs grunnleggende arbeid og respekterer hans [beslutning om å ta en pause](https://news.ycombinator.com/item?id=37687017) fra hans omfattende bidrag til åpen kildekode.

Som medlem av [Express Technical Committee](https://expressjs.com/en/resources/community.html) viste Nick stor oppmerksomhet på detaljer i saker som å klargjøre dokumentasjonen for `req.originalUrl` og fikse problemer med håndtering av multipart-skjema.

### Koa Framework Contributions {#koa-framework-contributions}

Nicks arbeid med [Koa-rammeverket](https://github.com/koajs/koa)—et moderne, lettere alternativ til Express som også ble laget av TJ Holowaychuk—viser ytterligere hans engasjement for bedre verktøy for webutvikling. Hans bidrag til Koa inkluderer både saker og kode gjennom pull requests, som tar for seg feilbehandling, innholds-typehåndtering og forbedringer i dokumentasjonen.

Hans arbeid både med Express og Koa gir ham et unikt perspektiv på Node.js webutvikling, noe som hjelper teamet vårt med å lage pakker som fungerer godt med flere rammeverksøkosystemer.

### Fra individuell bidragsyter til organisasjonsleder {#from-individual-contributor-to-organization-leader}

Det som startet som hjelp til eksisterende prosjekter vokste til å skape og vedlikeholde hele pakkeøkosystemer. Nick grunnla flere GitHub-organisasjoner—inkludert [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), og [Bree](https://github.com/breejs)—hver av dem løser spesifikke behov i JavaScript-fellesskapet.

Dette skiftet fra bidragsyter til leder viser Nicks visjon for godt designet programvare som løser reelle problemer. Ved å organisere relaterte pakker under fokuserte GitHub-organisasjoner har han bygget verktøyøkosystemer som fungerer sammen samtidig som de forblir modulære og fleksible for det bredere utviklermiljøet.


## Våre GitHub-organisasjoner: Økosystemer av innovasjon {#our-github-organizations-ecosystems-of-innovation}

Vi organiserer vårt arbeid med åpen kildekode rundt fokuserte GitHub-organisasjoner, som hver løser spesifikke behov i JavaScript. Denne strukturen skaper sammenhengende pakkefamilier som fungerer godt sammen samtidig som de forblir modulære.

### Cabin: Strukturert logging for moderne applikasjoner {#cabin-structured-logging-for-modern-applications}

[Cabin-organisasjonen](https://github.com/cabinjs) er vår tilnærming til enkel, kraftfull app-logging. Hovedpakken [`cabin`](https://github.com/cabinjs/cabin) har nesten 900 GitHub-stjerner og over 100 000 ukentlige nedlastinger\[^1]. Cabin tilbyr strukturert logging som fungerer med populære tjenester som Sentry, LogDNA og Papertrail.

Det som gjør Cabin spesielt er det gjennomtenkte API-et og pluginsystemet. Støttepakker som [`axe`](https://github.com/cabinjs/axe) for Express-middleware og [`parse-request`](https://github.com/cabinjs/parse-request) for HTTP-forespørselsparsing viser vårt engasjement for komplette løsninger fremfor isolerte verktøy.

Pakken [`bson-objectid`](https://github.com/cabinjs/bson-objectid) fortjener spesiell omtale, med over 1,7 millioner nedlastinger på bare to måneder\[^2]. Denne lette MongoDB ObjectID-implementeringen har blitt det foretrukne valget for utviklere som trenger ID-er uten full MongoDB-avhengighet.

### Spam Scanner: Bekjemper e-postmisbruk {#spam-scanner-fighting-email-abuse}

[Spam Scanner-organisasjonen](https://github.com/spamscanner) viser vårt engasjement for å løse reelle problemer. Hovedpakken [`spamscanner`](https://github.com/spamscanner/spamscanner) tilbyr avansert e-postspamdeteksjon, men det er pakken [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) som har fått en fantastisk adopsjon.

Med over 1,2 millioner nedlastinger på to måneder\[^3], fikser `url-regex-safe` kritiske sikkerhetsproblemer i andre regulære uttrykk for URL-deteksjon. Denne pakken viser vår tilnærming til åpen kildekode: finne et vanlig problem (i dette tilfellet [ReDoS](https://en.wikipedia.org/wiki/ReDoS)-sårbarheter i URL-validering), lage en solid løsning og vedlikeholde den nøye.
### Bree: Moderne Jobbplanlegging med Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

[Organisasjonen Bree](https://github.com/breejs) er vårt svar på en vanlig utfordring i Node.js: pålitelig jobbplanlegging. Hovedpakken [`bree`](https://github.com/breejs/bree), med over 3 100 GitHub-stjerner, tilbyr en moderne jobbplanlegger som bruker Node.js worker threads for bedre ytelse og pålitelighet.

> \[!NOTE]
> Bree ble laget etter at vi hjalp til med vedlikehold av [Agenda](https://github.com/agenda/agenda), og brukte erfaringene derfra til å bygge en bedre jobbplanlegger. Våre bidrag til Agenda hjalp oss med å finne måter å forbedre jobbplanlegging på.

Hva som gjør Bree annerledes enn andre planleggere som Agenda:

* **Ingen eksterne avhengigheter**: I motsetning til Agenda som trenger MongoDB, krever ikke Bree Redis eller MongoDB for å håndtere jobbstatus.
* **Worker Threads**: Bree bruker Node.js worker threads for sandboxede prosesser, noe som gir bedre isolasjon og ytelse.
* **Enkel API**: Bree tilbyr detaljert kontroll med enkelhet, noe som gjør det lettere å implementere komplekse planleggingsbehov.
* **Innebygd støtte**: Ting som grasiøs omlasting, cron-jobber, datoer og menneskevennlige tider er inkludert som standard.

Bree er en nøkkelkomponent i [forwardemail.net](https://github.com/forwardemail/forwardemail.net), og håndterer kritiske bakgrunnsoppgaver som e-postbehandling, opprydding og planlagt vedlikehold. Bruken av Bree i Forward Email viser vårt engasjement for å bruke våre egne verktøy i produksjon, og sikrer at de møter høye pålitelighetsstandarder.

Vi bruker også og setter pris på andre flotte worker thread-pakker som [piscina](https://github.com/piscinajs/piscina) og HTTP-klienter som [undici](https://github.com/nodejs/undici). Piscina, som Bree, bruker Node.js worker threads for effektiv oppgavebehandling. Vi takker [Matteo Collina](https://github.com/mcollina), som vedlikeholder både undici og piscina, for hans store bidrag til Node.js. Matteo sitter i Node.js Technical Steering Committee og har forbedret HTTP-klientmulighetene i Node.js betydelig.

### Forward Email: Åpen Kildekode E-postinfrastruktur {#forward-email-open-source-email-infrastructure}

Vårt mest ambisiøse prosjekt er [Forward Email](https://github.com/forwardemail), en åpen kildekode e-posttjeneste som tilbyr e-postvideresending, lagring og API-tjenester. Hovedrepoet har over 1 100 GitHub-stjerner\[^4], noe som viser fellesskapets anerkjennelse for dette alternativet til proprietære e-posttjenester.

Pakken [`preview-email`](https://github.com/forwardemail/preview-email) fra denne organisasjonen, med over 2,5 millioner nedlastinger på to måneder\[^5], har blitt et essensielt verktøy for utviklere som jobber med e-postmaler. Ved å tilby en enkel måte å forhåndsvise e-poster under utvikling, løser den et vanlig problem ved bygging av e-postaktiverte applikasjoner.

### Lad: Essensielle Koa-verktøy og -verktøysett {#lad-essential-koa-utilities-and-tools}

[Lad-organisasjonen](https://github.com/ladjs) tilbyr en samling essensielle verktøy og verktøysett med hovedfokus på å forbedre Koa-rammeverkets økosystem. Disse pakkene løser vanlige utfordringer i webutvikling og er designet for å fungere sømløst sammen samtidig som de er nyttige hver for seg.

#### koa-better-error-handler: Forbedret Feilhåndtering for Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tilbyr en bedre løsning for feilhåndtering i Koa-applikasjoner. Med over 50 GitHub-stjerner gjør denne pakken at `ctx.throw` produserer brukervennlige feilmeldinger samtidig som den adresserer flere begrensninger i Koas innebygde feilhåndterer:

* Oppdager og håndterer korrekt Node.js DNS-feil, Mongoose-feil og Redis-feil
* Bruker [Boom](https://github.com/hapijs/boom) for å lage konsistente, godt formaterte feilsvar
* Bevarer headere (i motsetning til Koas innebygde håndterer)
* Opprettholder passende statuskoder i stedet for å standardisere til 500
* Støtter flash-meldinger og bevaring av sesjon
* Gir HTML-feillister for valideringsfeil
* Støtter flere responstyper (HTML, JSON og ren tekst)
Denne pakken er spesielt verdifull når den brukes sammen med [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) for omfattende feilhåndtering i Koa-applikasjoner.

#### passport: Autentisering for Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) utvider det populære Passport.js-autentiseringsmiddelet med spesifikke forbedringer for moderne nettapplikasjoner. Denne pakken støtter flere autentiseringsstrategier rett ut av boksen:

* Lokal autentisering med e-post
* Logg inn med Apple
* GitHub-autentisering
* Google-autentisering
* Engangspassord (OTP) autentisering

Pakken er svært tilpassbar, og lar utviklere justere feltnavn og uttrykk for å matche kravene til deres applikasjon. Den er designet for å integreres sømløst med Mongoose for brukerstyring, noe som gjør den til en ideell løsning for Koa-baserte applikasjoner som trenger robust autentisering.

#### graceful: Elegant applikasjonsavslutning {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) løser den kritiske utfordringen med å avslutte Node.js-applikasjoner på en elegant måte. Med over 70 GitHub-stjerner sikrer denne pakken at applikasjonen din kan avsluttes ryddig uten å miste data eller etterlate åpne tilkoblinger. Viktige funksjoner inkluderer:

* Støtte for elegant lukking av HTTP-servere (Express/Koa/Fastify)
* Ryddig avslutning av databaseforbindelser (MongoDB/Mongoose)
* Korrekt lukking av Redis-klienter
* Håndtering av Bree-jobbplanleggere
* Støtte for egendefinerte avslutningshåndterere
* Konfigurerbare tidsavbruddinnstillinger
* Integrasjon med loggsystemer

Denne pakken er essensiell for produksjonsapplikasjoner hvor uventede avslutninger kan føre til datatap eller korrupsjon. Ved å implementere riktige avslutningsrutiner hjelper `@ladjs/graceful` med å sikre påliteligheten og stabiliteten til applikasjonen din.

### Upptime: Åpen kildekode for oppetidsovervåking {#upptime-open-source-uptime-monitoring}

[Upptime-organisasjonen](https://github.com/upptime) representerer vårt engasjement for transparent, åpen kildekode-overvåking. Hovedlageret [`upptime`](https://github.com/upptime/upptime) har over 13 000 GitHub-stjerner, noe som gjør det til et av de mest populære prosjektene vi bidrar til. Upptime tilbyr en GitHub-drevet oppetidsovervåker og status-side som fungerer helt uten server.

Vi bruker Upptime for vår egen statusside på <https://status.forwardemail.net> med kildekoden tilgjengelig på <https://github.com/forwardemail/status.forwardemail.net>.

Det som gjør Upptime spesielt er arkitekturen:

* **100 % åpen kildekode**: Hver komponent er fullstendig åpen kildekode og tilpassbar.
* **Drevet av GitHub**: Utnytter GitHub Actions, Issues og Pages for en serverløs overvåkingsløsning.
* **Ingen server nødvendig**: I motsetning til tradisjonelle overvåkingsverktøy krever ikke Upptime at du kjører eller vedlikeholder en server.
* **Automatisk statusside**: Genererer en vakker statusside som kan hostes på GitHub Pages.
* **Kraftige varslinger**: Integreres med ulike varslingskanaler inkludert e-post, SMS og Slack.

For å forbedre brukeropplevelsen har vi integrert [@octokit/core](https://github.com/octokit/core.js/) i forwardemail.net-kodebasen for å vise sanntidsstatusoppdateringer og hendelser direkte på nettsiden vår. Denne integrasjonen gir klar transparens til brukerne våre ved eventuelle problemer i hele stacken vår (Nettside, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, osv.) med umiddelbare toast-varsler, endringer i badge-ikon, advarselsfarger og mer.

@octokit/core-biblioteket lar oss hente sanntidsdata fra vårt Upptime GitHub-repositorium, behandle det og vise det på en brukervennlig måte. Når en tjeneste har nedetid eller redusert ytelse, blir brukerne umiddelbart varslet gjennom visuelle indikatorer uten å måtte forlate hovedapplikasjonen. Denne sømløse integrasjonen sikrer at brukerne våre alltid har oppdatert informasjon om systemstatus, noe som øker transparens og tillit.

Upptime har blitt tatt i bruk av hundrevis av organisasjoner som søker en transparent, pålitelig måte å overvåke tjenestene sine på og kommunisere status til brukerne. Prosjektets suksess viser kraften i å bygge verktøy som utnytter eksisterende infrastruktur (i dette tilfellet GitHub) for å løse vanlige problemer på nye måter.
## Våre bidrag til Forward Email-økosystemet {#our-contributions-to-the-forward-email-ecosystem}

Mens våre open source-pakker brukes av utviklere over hele verden, utgjør de også grunnlaget for vår egen Forward Email-tjeneste. Denne doble rollen—som både skapere og brukere av disse verktøyene—gir oss et unikt perspektiv på deres virkelige anvendelse og driver kontinuerlig forbedring.

### Fra pakker til produksjon {#from-packages-to-production}

Reisen fra individuelle pakker til et sammenhengende produksjonssystem innebærer nøye integrasjon og utvidelse. For Forward Email inkluderer denne prosessen:

* **Egendefinerte utvidelser**: Bygge Forward Email-spesifikke utvidelser til våre open source-pakker som adresserer våre unike krav.
* **Integrasjonsmønstre**: Utvikle mønstre for hvordan disse pakkene samhandler i et produksjonsmiljø.
* **Ytelsesoptimaliseringer**: Identifisere og løse ytelsesflaskehalser som kun oppstår i stor skala.
* **Sikkerhetsharding**: Legge til ekstra sikkerhetslag spesifikt for e-posthåndtering og beskyttelse av brukerdata.

Dette arbeidet representerer tusenvis av timer med utvikling utover selve kjernepakkene, noe som resulterer i en robust, sikker e-posttjeneste som utnytter det beste av våre open source-bidrag.

### Tilbakemeldingssløyfen {#the-feedback-loop}

Kanskje det mest verdifulle aspektet ved å bruke våre egne pakker i produksjon er tilbakemeldingssløyfen det skaper. Når vi støter på begrensninger eller spesielle tilfeller i Forward Email, fikser vi dem ikke bare lokalt—vi forbedrer de underliggende pakkene, noe som gagner både vår tjeneste og det bredere fellesskapet.

Denne tilnærmingen har ført til mange forbedringer:

* **Bree sin grasiøse nedstengning**: Forward Emails behov for null-nedetid ved utrullinger førte til forbedrede grasiøse nedstengningsmuligheter i Bree.
* **Spam Scanners mønstergjenkjenning**: Virkelige spam-mønstre oppdaget i Forward Email har informert Spam Scanners deteksjonsalgoritmer.
* **Cabins ytelsesoptimaliseringer**: Høyt volum av logging i produksjon avdekket optimaliseringsmuligheter i Cabin som gagner alle brukere.

Ved å opprettholde denne gode syklusen mellom vårt open source-arbeid og produksjonstjenesten, sikrer vi at pakkene våre forblir praktiske, gjennomprøvde løsninger fremfor teoretiske implementeringer.


## Forward Emails kjerneprinsipper: Et fundament for fortreffelighet {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email er designet i henhold til et sett med kjerneprinsipper som styrer alle våre utviklingsbeslutninger. Disse prinsippene, detaljert på vår [nettsted](/blog/docs/best-quantum-safe-encrypted-email-service#principles), sikrer at tjenesten vår forblir utviklervennlig, sikker og fokusert på brukerens personvern.

### Alltid utviklervennlig, sikkerhetsfokusert og transparent {#always-developer-friendly-security-focused-and-transparent}

Vårt første og fremste prinsipp er å lage programvare som er utviklervennlig samtidig som den opprettholder de høyeste standardene for sikkerhet og personvern. Vi mener at teknisk fortreffelighet aldri skal gå på bekostning av brukervennlighet, og at åpenhet bygger tillit med vårt fellesskap.

Dette prinsippet vises i vår detaljerte dokumentasjon, klare feilmeldinger og åpen kommunikasjon om både suksesser og utfordringer. Ved å gjøre hele kodebasen vår open source, inviterer vi til gransking og samarbeid, noe som styrker både vår programvare og det bredere økosystemet.

### Overholdelse av velprøvde prinsipper for programvareutvikling {#adherence-to-time-tested-software-development-principles}

Vi følger flere etablerte prinsipper for programvareutvikling som har bevist sin verdi gjennom tiår:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Skille bekymringer gjennom Model-View-Controller-mønsteret
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: Lage modulære komponenter som gjør én ting godt
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Holde det enkelt og greit
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Ikke gjenta deg selv, fremme gjenbruk av kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du kommer ikke til å trenge det, unngå for tidlig optimalisering
* **[Twelve Factor](https://12factor.net/)**: Følge beste praksis for å bygge moderne, skalerbare applikasjoner
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Velge den enkleste løsningen som oppfyller kravene
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Bruke våre egne produkter i stor grad
Disse prinsippene er ikke bare teoretiske konsepter—de er innebygd i våre daglige utviklingspraksiser. For eksempel er vår overholdelse av Unix-filosofien tydelig i hvordan vi har strukturert våre npm-pakker: små, fokuserte moduler som kan settes sammen for å løse komplekse problemer.

### Målretting mot den ressurssterke, selvfinansierte utvikleren {#targeting-the-scrappy-bootstrapped-developer}

Vi retter oss spesifikt mot den ressurssterke, selvfinansierte og [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) utvikleren. Dette fokuset former alt fra vår prismodell til våre tekniske beslutninger. Vi forstår utfordringene med å bygge produkter med begrensede ressurser fordi vi har vært der selv.

Dette prinsippet er spesielt viktig i hvordan vi nærmer oss åpen kildekode. Vi lager og vedlikeholder pakker som løser reelle problemer for utviklere uten bedriftsbudsjetter, og gjør kraftige verktøy tilgjengelige for alle uavhengig av deres ressurser.

### Prinsipper i praksis: Forward Email-kodebasen {#principles-in-practice-the-forward-email-codebase}

Disse prinsippene er tydelig synlige i Forward Email-kodebasen. Vår package.json-fil avslører et gjennomtenkt utvalg av avhengigheter, hver valgt for å samsvare med våre kjerneverdier:

* Sikkerhetsfokuserte pakker som `mailauth` for e-postautentisering
* Utviklervennlige verktøy som `preview-email` for enklere feilsøking
* Modulære komponenter som de ulike `p-*` verktøyene fra Sindre Sorhus

Ved å følge disse prinsippene konsekvent over tid, har vi bygget en tjeneste som utviklere kan stole på med sin e-postinfrastruktur—sikker, pålitelig og i tråd med verdiene i åpen kildekode-fellesskapet.

### Personvern som standard {#privacy-by-design}

Personvern er ikke en ettertanke eller en markedsføringsfunksjon for Forward Email—det er et grunnleggende designprinsipp som informerer alle aspekter av vår tjeneste og kode:

* **Null-tilgang-kryptering**: Vi har implementert systemer som gjør det teknisk umulig for oss å lese brukernes e-poster.
* **Minimal datainnsamling**: Vi samler kun inn data som er nødvendig for å levere vår tjeneste, ikke mer.
* **Gjennomsiktige retningslinjer**: Vår personvernerklæring er skrevet i klart, forståelig språk uten juridisk sjargong.
* **Åpen kildekode-verifisering**: Vår åpen kildekode-kodebase lar sikkerhetsforskere verifisere våre personvernspåstander.

Dette engasjementet strekker seg til våre åpen kildekode-pakker, som er designet med sikkerhet og personvern som beste praksis fra grunnen av.

### Bærekraftig åpen kildekode {#sustainable-open-source}

Vi mener at åpen kildekode-programvare trenger bærekraftige modeller for å trives på lang sikt. Vår tilnærming inkluderer:

* **Kommersiell støtte**: Tilbyr premium støtte og tjenester rundt våre åpen kildekode-verktøy.
* **Balansert lisensiering**: Bruk av lisenser som beskytter både brukernes friheter og prosjektets bærekraft.
* **Fellesskapsengasjement**: Aktivt engasjement med bidragsytere for å bygge et støttende fellesskap.
* **Gjennomsiktige veikart**: Dele våre utviklingsplaner slik at brukere kan planlegge deretter.

Ved å fokusere på bærekraft sikrer vi at våre bidrag til åpen kildekode kan fortsette å vokse og forbedres over tid i stedet for å bli neglisjert.


## Tallene lyver ikke: Våre imponerende npm-nedlastingsstatistikker {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Når vi snakker om virkningen av åpen kildekode-programvare, gir nedlastingsstatistikker et håndfast mål på adopsjon og tillit. Mange av pakkene vi hjelper til med å vedlikeholde har nådd en skala som få åpen kildekode-prosjekter noen gang oppnår, med samlede nedlastinger i milliardklassen.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Selv om vi er stolte av å hjelpe til med å vedlikeholde flere høyt nedlastede pakker i JavaScript-økosystemet, ønsker vi å anerkjenne at mange av disse pakkene opprinnelig ble laget av andre talentfulle utviklere. Pakker som superagent og supertest ble opprinnelig laget av TJ Holowaychuk, hvis produktive bidrag til åpen kildekode har vært avgjørende for å forme Node.js-økosystemet.
### Et fugleperspektiv på vår påvirkning {#a-birds-eye-view-of-our-impact}

I bare to-månedersperioden fra februar til mars 2025 registrerte de viktigste pakkene vi bidrar til og hjelper med å vedlikeholde, svimlende nedlastningstall:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 nedlastninger\[^7] (opprinnelig laget av TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 nedlastninger\[^8] (opprinnelig laget av TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28 539 295 nedlastninger\[^34] (opprinnelig laget av TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 nedlastninger\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 nedlastninger\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 nedlastninger\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2 500 000 nedlastninger\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1 800 000 nedlastninger\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 nedlastninger\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1 128 139 nedlastninger\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1 124 686 nedlastninger\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 nedlastninger\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 nedlastninger\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 nedlastninger\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145 000 nedlastninger\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 nedlastninger\[^30]

> \[!NOTE]
> Flere andre pakker vi hjelper med å vedlikeholde, men ikke har laget, har enda høyere nedlastningstall, inkludert `form-data` (738M+ nedlastninger), `toidentifier` (309M+ nedlastninger), `stackframe` (116M+ nedlastninger) og `error-stack-parser` (113M+ nedlastninger). Vi er beæret over å bidra til disse pakkene samtidig som vi respekterer arbeidet til deres opprinnelige forfattere.

Dette er ikke bare imponerende tall — de representerer ekte utviklere som løser reelle problemer med kode vi hjelper til med å vedlikeholde. Hver nedlastning er et tilfelle der disse pakkene har hjulpet noen med å bygge noe meningsfullt, fra hobbyprosjekter til bedriftsapplikasjoner brukt av millioner.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Daglig påvirkning i stor skala {#daily-impact-at-scale}

De daglige nedlastningsmønstrene viser konsekvent, høyvolumsbruk, med topper som når millioner av nedlastninger per dag\[^13]. Denne konsistensen vitner om stabiliteten og påliteligheten til disse pakkene — utviklere prøver dem ikke bare; de integrerer dem i sine kjernearbeidsflyter og er avhengige av dem dag etter dag.

Ukentlige nedlastningsmønstre viser enda mer imponerende tall, som konsekvent ligger rundt titalls millioner nedlastninger per uke\[^14]. Dette representerer et enormt fotavtrykk i JavaScript-økosystemet, med disse pakkene i produksjonsmiljøer over hele verden.

### Utover de rå tallene {#beyond-the-raw-numbers}

Selv om nedlastningsstatistikken er imponerende i seg selv, forteller den en dypere historie om tilliten samfunnet har til disse pakkene. Å vedlikeholde pakker i denne skalaen krever en urokkelig forpliktelse til:

* **Bakoverkompatibilitet**: Endringer må vurderes nøye for å unngå å bryte eksisterende implementasjoner.
* **Sikkerhet**: Med millioner av applikasjoner som er avhengige av disse pakkene, kan sikkerhetssårbarheter få vidtrekkende konsekvenser.
* **Ytelse**: I denne skalaen kan selv små ytelsesforbedringer gi betydelige samlede fordeler.
* **Dokumentasjon**: Klar, omfattende dokumentasjon er essensiell for pakker som brukes av utviklere på alle erfaringsnivåer.

Den jevne veksten i nedlastningstall over tid gjenspeiler suksessen i å møte disse forpliktelsene, og bygger tillit med utviklersamfunnet gjennom pålitelige, godt vedlikeholdte pakker.
## Støtte til økosystemet: Våre Open Source-sponsorater {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Bærekraft i open source handler ikke bare om å bidra med kode—det handler også om å støtte utviklerne som vedlikeholder kritisk infrastruktur.

Utover våre direkte bidrag til JavaScript-økosystemet, er vi stolte av å sponse fremtredende Node.js-bidragsytere hvis arbeid utgjør grunnlaget for mange moderne applikasjoner. Våre sponsorater inkluderer:

### Andris Reinman: Pioner innen e-postinfrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) er skaperen av [Nodemailer](https://github.com/nodemailer/nodemailer), det mest populære biblioteket for sending av e-post i Node.js med over 14 millioner ukentlige nedlastinger\[^15]. Hans arbeid strekker seg til andre kritiske komponenter i e-postinfrastrukturen som [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), og [WildDuck](https://github.com/nodemailer/wildduck).

Vårt sponsorat bidrar til å sikre fortsatt vedlikehold og utvikling av disse essensielle verktøyene som driver e-postkommunikasjon for utallige Node.js-applikasjoner, inkludert vår egen Forward Email-tjeneste.

### Sindre Sorhus: Mester bak verktøypakker {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) er en av de mest produktive open source-bidragsyterne i JavaScript-økosystemet, med over 1 000 npm-pakker på sin konto. Hans verktøy som [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), og [is-stream](https://github.com/sindresorhus/is-stream) er grunnleggende byggeklosser brukt gjennom hele Node.js-økosystemet.

Ved å sponse Sindres arbeid hjelper vi til med å opprettholde utviklingen av disse kritiske verktøyene som gjør JavaScript-utvikling mer effektiv og pålitelig.

Disse sponsoratene reflekterer vårt engasjement for det bredere open source-økosystemet. Vi erkjenner at vår egen suksess er bygget på grunnlaget lagt av disse og andre bidragsytere, og vi er dedikert til å sikre bærekraften i hele økosystemet.


## Avdekking av sikkerhetssårbarheter i JavaScript-økosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vårt engasjement for open source strekker seg utover funksjonsutvikling til å inkludere identifisering og håndtering av sikkerhetssårbarheter som kan påvirke millioner av utviklere. Flere av våre mest betydningsfulle bidrag til JavaScript-økosystemet har vært innen sikkerhet.

### Redningen av Koa-Router {#the-koa-router-rescue}

I februar 2019 oppdaget Nick et kritisk problem med vedlikeholdet av den populære koa-router-pakken. Som han [rapporterte på Hacker News](https://news.ycombinator.com/item?id=19156707), hadde pakken blitt forlatt av sin opprinnelige vedlikeholder, noe som etterlot sikkerhetssårbarheter uadressert og samfunnet uten oppdateringer.

> \[!WARNING]
> Forlatte pakker med sikkerhetssårbarheter utgjør betydelige risikoer for hele økosystemet, spesielt når de lastes ned millioner av ganger ukentlig.

Som svar opprettet Nick [@koa/router](https://github.com/koajs/router) og hjalp til med å varsle samfunnet om situasjonen. Han har vedlikeholdt denne kritiske pakken siden da, og sikrer at Koa-brukere har en sikker og godt vedlikeholdt ruteløsning.

### Håndtering av ReDoS-sårbarheter {#addressing-redos-vulnerabilities}

I 2020 identifiserte og adresserte Nick en kritisk [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-sårbarhet i den mye brukte `url-regex`-pakken. Denne sårbarheten ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kunne tillate angripere å forårsake tjenestenekt ved å gi spesiallaget input som forårsaket katastrofal backtracking i regulære uttrykket.

I stedet for bare å lappe den eksisterende pakken, opprettet Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en fullstendig omskrevet implementering som adresserer sårbarheten samtidig som den opprettholder kompatibilitet med det opprinnelige API-et. Han publiserte også et [omfattende blogginnlegg](/blog/docs/url-regex-javascript-node-js) som forklarer sårbarheten og hvordan man kan dempe den.
Dette arbeidet viser vår tilnærming til sikkerhet: ikke bare å fikse problemer, men å utdanne fellesskapet og tilby robuste alternativer som forhindrer lignende problemer i fremtiden.

### Talsmann for Node.js og Chromium-sikkerhet {#advocating-for-nodejs-and-chromium-security}

Nick har også vært aktiv i å fremme sikkerhetsforbedringer i det bredere økosystemet. I august 2020 identifiserte han et betydelig sikkerhetsproblem i Node.js relatert til håndteringen av HTTP-headere, som ble rapportert i [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Dette problemet, som stammer fra en patch i Chromium, kunne potensielt tillate angripere å omgå sikkerhetstiltak. Nicks innsats bidro til at problemet ble tatt tak i raskt, og beskyttet millioner av Node.js-applikasjoner mot potensiell utnyttelse.

### Sikring av npm-infrastruktur {#securing-npm-infrastructure}

Senere samme måned identifiserte Nick et annet kritisk sikkerhetsproblem, denne gangen i npms e-postinfrastruktur. Som rapportert i [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), implementerte ikke npm DMARC, SPF og DKIM e-postautentiseringsprotokoller korrekt, noe som potensielt kunne tillate angripere å sende phishing-eposter som så ut til å komme fra npm.

Nicks rapport førte til forbedringer i npms e-postsikkerhet, og beskyttet de millioner av utviklere som er avhengige av npm for pakkehåndtering mot potensielle phishing-angrep.


## Våre bidrag til Forward Email-økosystemet {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email er bygget på toppen av flere kritiske open source-prosjekter, inkludert Nodemailer, WildDuck og mailauth. Vårt team har gjort betydelige bidrag til disse prosjektene, og hjulpet til med å identifisere og fikse dype problemer som påvirker e-postlevering og sikkerhet.

### Forbedring av Nodemailers kjernefunksjonalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) er ryggraden i e-postsending i Node.js, og våre bidrag har hjulpet til med å gjøre det mer robust:

* **Forbedringer i SMTP-serveren**: Vi har fikset parsing-feil, problemer med strømbehandling og TLS-konfigurasjonsproblemer i SMTP-serverkomponenten\[^16]\[^17].
* **Forbedringer i e-postparseren**: Vi har løst feil i dekoding av tegnsekvenser og problemer med adresseparseren som kunne føre til feil i e-postbehandling\[^18]\[^19].

Disse bidragene sikrer at Nodemailer forblir et pålitelig fundament for e-postbehandling i Node.js-applikasjoner, inkludert Forward Email.

### Fremme av e-postautentisering med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tilbyr kritisk funksjonalitet for e-postautentisering, og våre bidrag har betydelig forbedret dens kapasiteter:

* **Forbedringer i DKIM-verifisering**: Vi oppdaget og rapporterte at X/Twitter hadde DNS-cacheproblemer som forårsaket DKIM-feil for deres utgående meldinger, og rapporterte det på Hacker One\[^20].
* **Forbedringer i DMARC og ARC**: Vi har fikset problemer med DMARC- og ARC-verifisering som kunne føre til feilaktige autentiseringsresultater\[^21]\[^22].
* **Ytelsesoptimaliseringer**: Vi har bidratt med optimaliseringer som forbedrer ytelsen til e-postautentiseringsprosessene\[^23]\[^24]\[^25]\[^26].

Disse forbedringene bidrar til å sikre at e-postautentisering er nøyaktig og pålitelig, og beskytter brukere mot phishing- og spoofing-angrep.

### Viktige forbedringer i Upptime {#key-upptime-enhancements}

Våre bidrag til Upptime inkluderer:

* **Overvåking av SSL-sertifikater**: Vi la til funksjonalitet for å overvåke utløp av SSL-sertifikater, og forhindret uventet nedetid på grunn av utløpte sertifikater\[^27].
* **Støtte for flere SMS-numre**: Vi implementerte støtte for varsling av flere teammedlemmer via SMS når hendelser oppstår, noe som forbedrer responstiden\[^28].
* **Fikser for IPv6-sjekker**: Vi har løst problemer med IPv6-tilkoblingssjekker, og sikrer mer nøyaktig overvåking i moderne nettverksmiljøer\[^29].
* **Støtte for mørk/lys modus**: Vi la til temasupport for å forbedre brukeropplevelsen på status-sider\[^31].
* **Bedre TCP-ping-støtte**: Vi forbedret TCP-ping-funksjonaliteten for å gi mer pålitelig tilkoblingstesting\[^32].
Disse forbedringene gagner ikke bare Forward Emails statusovervåking, men er tilgjengelige for hele fellesskapet av Upptime-brukere, noe som viser vårt engasjement for å forbedre verktøyene vi er avhengige av.


## Limet som holder alt sammen: Egendefinert kode i stor skala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Selv om våre npm-pakker og bidrag til eksisterende prosjekter er betydelige, er det den egendefinerte koden som integrerer disse komponentene som virkelig viser vår tekniske ekspertise. Forward Email-kodebasen representerer et tiår med utviklingsarbeid, som går tilbake til 2017 da prosjektet startet som [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) før det ble slått sammen til et monorepo.

### En massiv utviklingsinnsats {#a-massive-development-effort}

Omfanget av denne egendefinerte integrasjonskoden er imponerende:

* **Totale bidrag**: Over 3 217 commits
* **Kodebase-størrelse**: Over 421 545 linjer med kode på tvers av JavaScript, Pug, CSS og JSON-filer\[^33]

Dette representerer tusenvis av timer med utviklingsarbeid, feilsøkingsøkter og ytelsesoptimaliseringer. Det er den "hemmelige sausen" som forvandler individuelle pakker til en sammenhengende, pålitelig tjeneste som brukes av tusenvis av kunder daglig.

### Integrasjon av kjerneavhengigheter {#core-dependencies-integration}

Forward Email-kodebasen integrerer mange avhengigheter til en sømløs helhet:

* **E-postbehandling**: Integrerer Nodemailer for sending, SMTP Server for mottak og Mailparser for parsing
* **Autentisering**: Bruker Mailauth for DKIM, SPF, DMARC og ARC-verifisering
* **DNS-oppløsning**: Utnytter Tangerine for DNS-over-HTTPS med global caching
* **MX-tilkobling**: Benytter mx-connect med Tangerine-integrasjon for pålitelige tilkoblinger til e-postservere
* **Jobbplanlegging**: Bruker Bree for pålitelig bakgrunnsprosessering med worker threads
* **Templating**: Bruker email-templates for å gjenbruke stilark fra nettsiden i kundekommunikasjon
* **E-postlagring**: Implementerer individuelt krypterte SQLite-postbokser ved hjelp av better-sqlite3-multiple-ciphers med ChaCha20-Poly1305-kryptering for kvantesikker personvern, som sikrer fullstendig isolasjon mellom brukere og at kun brukeren har tilgang til sin postboks

Hver av disse integrasjonene krever nøye vurdering av kanttilfeller, ytelsespåvirkninger og sikkerhetsbekymringer. Resultatet er et robust system som håndterer millioner av e-posttransaksjoner pålitelig. Vår SQLite-implementering utnytter også msgpackr for effektiv binær serialisering og WebSockets (via ws) for sanntidsstatusoppdateringer på tvers av infrastrukturen vår.

### DNS-infrastruktur med Tangerine og mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En kritisk komponent i Forward Emails infrastruktur er vårt DNS-oppløsningssystem, bygget rundt to nøkkelpakker:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vår Node.js DNS-over-HTTPS-implementering gir en drop-in erstatning for standard DNS-resolver, med innebygde retryer, tidsavbrudd, smart serverrotasjon og caching-støtte.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Denne pakken etablerer TCP-tilkoblinger til MX-servere, tar et mål-domene eller e-postadresse, løser passende MX-servere og kobler til dem i prioritert rekkefølge.

Vi har integrert Tangerine med mx-connect gjennom [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), som sikrer applikasjonslags DNS over HTTP-forespørsler gjennom hele Forward Email. Dette gir global caching for DNS i stor skala med 1:1 konsistens på tvers av regioner, apper eller prosesser—kritisk for pålitelig e-postlevering i et distribuert system.


## Bedriftspåvirkning: Fra åpen kildekode til oppdragskritiske løsninger {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Klimakset i vår ti år lange reise innen åpen kildekode-utvikling har gjort det mulig for Forward Email å betjene ikke bare individuelle utviklere, men også store bedrifter og utdanningsinstitusjoner som utgjør ryggraden i selve åpen kildekode-bevegelsen.
### Case Studies in Mission-Critical Email Infrastructure {#case-studies-in-mission-critical-email-infrastructure}

Vår forpliktelse til pålitelighet, personvern og prinsippene for åpen kildekode har gjort Forward Email til det foretrukne valget for organisasjoner med krevende e-postbehov:

* **Utdanningsinstitusjoner**: Som beskrevet i vår [alumni email forwarding case study](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), stoler store universiteter på vår infrastruktur for å opprettholde livslange forbindelser med hundretusener av alumner gjennom pålitelige e-postvideresendingstjenester.

* **Enterprise Linux-løsninger**: [Canonical Ubuntu email enterprise case study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) viser hvordan vår åpen kildekode-tilnærming passer perfekt med behovene til leverandører av enterprise Linux, og gir dem den transparensen og kontrollen de krever.

* **Open Source Foundations**: Kanskje mest bekreftende er vårt partnerskap med Linux Foundation, som dokumentert i [Linux Foundation email enterprise case study](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), hvor vår tjeneste driver kommunikasjonen for den organisasjonen som forvalter Linux-utviklingen.

Det er en vakker symmetri i hvordan våre åpne kildekodepakker, vedlikeholdt med omsorg over mange år, har gjort det mulig for oss å bygge en e-posttjeneste som nå støtter de samme fellesskapene og organisasjonene som fremmer åpen kildekode-programvare. Denne fullsirkelreisen — fra å bidra med individuelle pakker til å drive enterprise-grad e-postinfrastruktur for ledere innen åpen kildekode — representerer den ultimate bekreftelsen på vår tilnærming til programvareutvikling.


## A Decade of Open Source: Looking Forward {#a-decade-of-open-source-looking-forward}

Når vi ser tilbake på et tiår med bidrag til åpen kildekode og fremover mot de neste ti årene, er vi fylt med takknemlighet for fellesskapet som har støttet vårt arbeid og spenning for det som kommer.

Vår reise fra individuelle pakkebidragsytere til vedlikeholdere av en omfattende e-postinfrastruktur brukt av store bedrifter og åpne kildekode-stiftelser har vært bemerkelsesverdig. Det er et bevis på kraften i åpen kildekode-utvikling og den innvirkningen gjennomtenkt, godt vedlikeholdt programvare kan ha på det bredere økosystemet.

I de kommende årene er vi forpliktet til å:

* **Fortsette å vedlikeholde og forbedre våre eksisterende pakker**, og sikre at de forblir pålitelige verktøy for utviklere over hele verden.
* **Utvide våre bidrag til kritiske infrastrukturprosjekter**, spesielt innen e-post- og sikkerhetsdomener.
* **Forbedre Forward Emails funksjonalitet** samtidig som vi opprettholder vårt engasjement for personvern, sikkerhet og åpenhet.
* **Støtte neste generasjon av åpne kildekode-bidragsytere** gjennom veiledning, sponsing og fellesskapsengasjement.

Vi tror at fremtiden for programvareutvikling er åpen, samarbeidsorientert og bygget på et fundament av tillit. Ved å fortsette å bidra med høykvalitets, sikkerhetsfokuserte pakker til JavaScript-økosystemet, håper vi å spille en liten rolle i å bygge den fremtiden.

Takk til alle som har brukt våre pakker, bidratt til våre prosjekter, rapportert problemer eller bare spredd ordet om vårt arbeid. Deres støtte har gjort dette tiåret med innvirkning mulig, og vi gleder oss til å se hva vi kan oppnå sammen i de neste ti årene.

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
