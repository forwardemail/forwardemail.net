# Et tiår med innvirkning: Hvordan våre npm-pakker nådde 1 milliard nedlastinger og formet JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Pionerene som stoler på oss: Isaac Z. Schlueter og videresendt e-post](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Fra npms opprettelse til Node.js-ledelse](#from-npms-creation-to-nodejs-leadership)
* [Arkitekten bak koden: Nick Baughs reise](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ekspress teknisk komité og kjernebidrag](#express-technical-committee-and-core-contributions)
  * [Bidrag til Koa-rammeverket](#koa-framework-contributions)
  * [Fra individuell bidragsyter til organisasjonsleder](#from-individual-contributor-to-organization-leader)
* [Våre GitHub-organisasjoner: Innovasjonsøkosystemer](#our-github-organizations-ecosystems-of-innovation)
  * [Hytte: Strukturert logging for moderne applikasjoner](#cabin-structured-logging-for-modern-applications)
  * [Spam-skanner: Bekjempelse av e-postmisbruk](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderne jobbplanlegging med arbeidertråder](#bree-modern-job-scheduling-with-worker-threads)
  * [Videresend e-post: E-postinfrastruktur med åpen kildekode](#forward-email-open-source-email-infrastructure)
  * [Lad: Viktige Koa-verktøy og -verktøy](#lad-essential-koa-utilities-and-tools)
  * [Oppetid: Oppetidsovervåking med åpen kildekode](#upptime-open-source-uptime-monitoring)
* [Våre bidrag til økosystemet for videresending av e-post](#our-contributions-to-the-forward-email-ecosystem)
  * [Fra pakker til produksjon](#from-packages-to-production)
  * [Tilbakemeldingssløyfen](#the-feedback-loop)
* [Kjerneprinsippene for videresending av e-post: Et grunnlag for fortreffelighet](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Alltid utviklervennlig, sikkerhetsfokusert og transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Overholdelse av velprøvde prinsipper for programvareutvikling](#adherence-to-time-tested-software-development-principles)
  * [Retter seg mot den useriøse, bootstrappede utvikleren](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinsipper i praksis: Kodebasen for videresendt e-post](#principles-in-practice-the-forward-email-codebase)
  * [Personvern basert på design](#privacy-by-design)
  * [Bærekraftig åpen kildekode](#sustainable-open-source)
* [Tallene lyver ikke: Vår svimlende npm-nedlastingsstatistikk](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Et fugleperspektiv på vår innvirkning](#a-birds-eye-view-of-our-impact)
  * [Daglig innvirkning i stor skala](#daily-impact-at-scale)
  * [Utover de rå tallene](#beyond-the-raw-numbers)
* [Støtte til økosystemet: Våre sponsoravtaler for åpen kildekode](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pioner innen e-postinfrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Avdekke sikkerhetsproblemer i JavaScript-økosystemet](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-ruterredningen](#the-koa-router-rescue)
  * [Håndtering av ReDoS-sårbarheter](#addressing-redos-vulnerabilities)
  * [Forkjemper for Node.js og Chromium-sikkerhet](#advocating-for-nodejs-and-chromium-security)
  * [Sikring av npm-infrastruktur](#securing-npm-infrastructure)
* [Våre bidrag til økosystemet for videresending av e-post](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Forbedring av Nodemailers kjernefunksjonalitet](#enhancing-nodemailers-core-functionality)
  * [Avansere e-postautentisering med Mailauth](#advancing-email-authentication-with-mailauth)
  * [Viktige forbedringer av oppetid](#key-upptime-enhancements)
* [Limet som holder alt sammen: Tilpasset kode i stor skala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [En massiv utviklingsinnsats](#a-massive-development-effort)
  * [Integrering av kjerneavhengigheter](#core-dependencies-integration)
  * [DNS-infrastruktur med Tangerine og mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Bedriftspåvirkning: Fra åpen kildekode til forretningskritiske løsninger](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Casestudier i forretningskritisk e-postinfrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Et tiår med åpen kildekode: Ser fremover](#a-decade-of-open-source-looking-forward)

## Forord {#foreword}

I [JavaScript](https://en.wikipedia.org/wiki/JavaScript)- og [Node.js](https://en.wikipedia.org/wiki/Node.js)-verdenen er noen pakker essensielle – de lastes ned millioner av ganger daglig og driver apper over hele verden. Bak disse verktøyene står utviklere som fokuserer på åpen kildekode-kvalitet. I dag viser vi hvordan teamet vårt bidrar til å bygge og vedlikeholde npm-pakker som har blitt viktige deler av JavaScript-økosystemet.

## Pionerene som stoler på oss: Isaac Z. Schlueter og videresend e-post {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Vi er stolte av å ha [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) som bruker. Isaac opprettet [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) og bidro til å bygge [Node.js](https://en.wikipedia.org/wiki/Node.js). Hans tillit til videresendt e-post viser vårt fokus på kvalitet og sikkerhet. Isaac bruker videresendt e-post for flere domener, inkludert izs.me.

Isaacs innflytelse på JavaScript er enorm. I 2009 var han blant de første som så potensialet i Node.js, da han jobbet med [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), som skapte plattformen. Som Isaac sa i en [intervju med Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-artikkel: «Midt i dette veldig lille fellesskapet av en gjeng mennesker som prøvde å finne ut hvordan man kunne få server-side JS til å skje, kom Ryan Dahl ut med Node, som helt klart var den riktige tilnærmingen. Jeg ga mitt bidrag og ble veldig involvert rundt midten av 2009.»

> \[!NOTE]
> For de som er interessert i historien til Node.js, finnes det utmerkede dokumentarer som kroniserer utviklingen, inkludert [Historien om Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) og [10 ting jeg angrer på med Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [personlig nettside](https://tinyclouds.org/) inneholder også verdifull innsikt i arbeidet hans.

### Fra npms opprettelse til Node.js-ledelse {#from-npms-creation-to-nodejs-leadership}

Isaac opprettet npm i september 2009, og den første brukbare versjonen ble utgitt tidlig i 2010. Denne pakkebehandleren dekket et sentralt behov i Node.js, og lot utviklere enkelt dele og gjenbruke kode. I følge [Node.js Wikipedia-side](https://en.wikipedia.org/wiki/Node.js) ble "i januar 2010 en pakkebehandler introdusert for Node.js-miljøet kalt npm. Pakkebehandleren lar programmerere publisere og dele Node.js-pakker, sammen med den tilhørende kildekoden, og er designet for å forenkle installasjon, oppdatering og avinstallering av pakker."

Da Ryan Dahl trakk seg tilbake fra Node.js i januar 2012, tok Isaac over som prosjektleder. Som nevnt på [hans sammendrag](https://izs.me/resume), «ledet han utviklingen av flere grunnleggende Node.js-kjerne-API-er, inkludert CommonJS-modulsystemet, filsystem-API-er og strømmer» og «fungerte som BDFL (Benevolent Dictator For Life) for prosjektet i to år, og sikret stadig økende kvalitet og pålitelig byggeprosess for Node.js-versjonene v0.6 til v0.10.»

Isaac ledet Node.js gjennom en viktig vekstperiode, og satte standarder som fortsatt former plattformen i dag. Han startet senere npm, Inc. i 2014 for å støtte npm-registeret, som han hadde drevet på egenhånd tidligere.

Vi takker Isaac for hans enorme bidrag til JavaScript og fortsetter å bruke mange pakker han laget. Arbeidet hans har endret hvordan vi bygger programvare og hvordan millioner av utviklere deler kode over hele verden.

## Arkitekten bak koden: Nick Baughs reise {#the-architect-behind-the-code-nick-baughs-journey}

I hjertet av vår suksess med åpen kildekode står Nick Baugh, grunnleggeren og eieren av Forward Email. Hans arbeid med JavaScript strekker seg over nesten 20 år og har formet hvordan utallige utviklere bygger apper. Hans reise med åpen kildekode viser både teknisk dyktighet og lederskap i fellesskapet.

### Ekspress teknisk komité og kjernebidrag {#express-technical-committee-and-core-contributions}

Nicks ekspertise innen webrammeverk ga ham en plass på [Ekspress teknisk komité](https://expressjs.com/en/resources/community.html), hvor han hjalp til med et av de mest brukte Node.js-rammeverkene. Nick er nå oppført som et inaktivt medlem på [Express-fellesskapsside](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express ble opprinnelig laget av TJ Holowaychuk, en produktiv bidragsyter til åpen kildekode som har formet mye av Node.js-økosystemet. Vi er takknemlige for TJs grunnleggende arbeid og respekterer hans [beslutning om å ta en pause](https://news.ycombinator.com/item?id=37687017) fra hans omfattende bidrag til åpen kildekode.

Som medlem av [Ekspress teknisk komité](https://expressjs.com/en/resources/community.html) viste Nick stor oppmerksomhet på detaljer i saker som å avklare `req.originalUrl`-dokumentasjonen og fikse problemer med håndtering av flerdelte skjemaer.

### Bidrag til Koa-rammeverket {#koa-framework-contributions}

Nicks arbeid med [Koa-rammeverket](https://github.com/koajs/koa) – et moderne, lettere alternativ til Express, også laget av TJ Holowaychuk – viser ytterligere hans engasjement for bedre verktøy for webutvikling. Hans Koa-bidrag inkluderer både problemer og kode gjennom pull-forespørsler, håndtering av feil, håndtering av innholdstyper og forbedringer av dokumentasjon.

Arbeidet hans med både Express og Koa gir ham et unikt innblikk i Node.js-nettutvikling, og hjelper teamet vårt med å lage pakker som fungerer godt med flere rammeverksøkosystemer.

### Fra individuell bidragsyter til organisasjonsleder {#from-individual-contributor-to-organization-leader}

Det som startet med å hjelpe eksisterende prosjekter, vokste til å opprette og vedlikeholde økosystemer for komplette pakker. Nick grunnla flere GitHub-organisasjoner – inkludert [Kabin](https://github.com/cabinjs), [Spam-skanner](https://github.com/spamscanner), [Videresend e-post](https://github.com/forwardemail), [Gutt](https://github.com/ladjs) og [Bree](https://github.com/breejs) – som hver løste spesifikke behov i JavaScript-fellesskapet.

Dette skiftet fra bidragsyter til leder viser Nicks visjon for veldesignet programvare som løser reelle problemer. Ved å organisere relaterte pakker under fokuserte GitHub-organisasjoner har han bygget verktøyøkosystemer som fungerer sammen samtidig som de forblir modulære og fleksible for det bredere utviklerfellesskapet.

## Våre GitHub-organisasjoner: Innovasjonsøkosystemer {#our-github-organizations-ecosystems-of-innovation}

Vi organiserer arbeidet vårt med åpen kildekode rundt fokuserte GitHub-organisasjoner, som hver løser spesifikke behov innen JavaScript. Denne strukturen skaper sammenhengende pakkefamilier som fungerer godt sammen, samtidig som de forblir modulære.

### Kabin: Strukturert logging for moderne applikasjoner {#cabin-structured-logging-for-modern-applications}

[Hytteorganisering](https://github.com/cabinjs) er vår tolkning av enkel og kraftig applogging. Hovedpakken [`cabin`](https://github.com/cabinjs/cabin) har nesten 900 GitHub-stjerner og over 100 000 ukentlige nedlastinger\[^1]. Cabin tilbyr strukturert logging som fungerer med populære tjenester som Sentry, LogDNA og Papertrail.

Det som gjør Cabin spesiell er det gjennomtenkte API-et og plugin-systemet. Støttepakker som [`axe`](https://github.com/cabinjs/axe) for Express-mellomvare og [`parse-request`](https://github.com/cabinjs/parse-request) for HTTP-forespørselsparsing viser vår forpliktelse til komplette løsninger snarere enn isolerte verktøy.

Pakken [`bson-objectid`](https://github.com/cabinjs/bson-objectid) fortjener spesiell omtale, med over 1,7 millioner nedlastinger på bare to måneder\[^2]. Denne lette MongoDB ObjectID-implementeringen har blitt det foretrukne valget for utviklere som trenger ID-er uten fulle MongoDB-avhengigheter.

### Spam-skanner: Bekjempelse av e-postmisbruk {#spam-scanner-fighting-email-abuse}

[Spam Scanner-organisasjon](https://github.com/spamscanner) viser vår forpliktelse til å løse reelle problemer. Hovedpakken [`spamscanner`](https://github.com/spamscanner/spamscanner) tilbyr avansert e-postspam-deteksjon, men det er [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-pakken som har fått utrolig stor utbredelse.

Med over 1,2 millioner nedlastinger på to måneder\[^3], fikser `url-regex-safe` kritiske sikkerhetsproblemer i andre regulære uttrykk for URL-deteksjon. Denne pakken viser vår tilnærming til åpen kildekode: å finne et vanlig problem (i dette tilfellet [Gjør om](https://en.wikipedia.org/wiki/ReDoS)-sårbarheter i URL-validering), lage en solid løsning og vedlikeholde den nøye.

### Bree: Moderne jobbplanlegging med arbeidertråder {#bree-modern-job-scheduling-with-worker-threads}

[Bree-organisasjonen](https://github.com/breejs) er vårt svar på en vanlig Node.js-utfordring: pålitelig jobbplanlegging. Hovedpakken [`bree`](https://github.com/breejs/bree), med over 3100 GitHub-stjerner, tilbyr en moderne jobbplanlegger som bruker Node.js-arbeidstråder for bedre ytelse og pålitelighet.

> \[!NOTE]
> Bree ble opprettet etter at vi bidro til å vedlikeholde [Dagsorden](https://github.com/agenda/agenda), og brukte lærdommene våre til å bygge en bedre jobbplanlegger. Våre bidrag til agendaen hjalp oss med å finne måter å forbedre jobbplanleggingen på.

Hva gjør Bree annerledes enn andre planleggere som Agenda:

* **Ingen eksterne avhengigheter**: I motsetning til Agenda, som trenger MongoDB, krever ikke Bree Redis eller MongoDB for å administrere jobbstatus.
* **Arbeidertråder**: Bree bruker Node.js-arbeidertråder for sandkasseprosesser, noe som gir bedre isolasjon og ytelse.
* **Enkel API**: Bree tilbyr detaljert kontroll med enkelhet, noe som gjør det enklere å implementere komplekse planleggingsbehov.
* **Innebygd støtte**: Ting som elegant omlasting, cron-jobber, datoer og brukervennlige klokkeslett er inkludert som standard.

Bree er en sentral del av [forwardemail.net](https://github.com/forwardemail/forwardemail.net), og håndterer kritiske bakgrunnsoppgaver som e-postbehandling, opprydding og planlagt vedlikehold. Bruken av Bree i Videresendt e-post viser vår forpliktelse til å bruke våre egne verktøy i produksjon, og sikrer at de oppfyller høye pålitelighetsstandarder.

Vi bruker og setter også pris på andre gode arbeidstrådpakker som [basseng](https://github.com/piscinajs/piscina) og HTTP-klienter som [elleve](https://github.com/nodejs/undici). Piscina bruker, i likhet med Bree, Node.js-arbeidstråder for effektiv oppgavebehandling. Vi takker [Matthew Hill](https://github.com/mcollina), som vedlikeholder både undici og piscina, for hans store bidrag til Node.js. Matteo sitter i Node.js tekniske styringskomité og har forbedret HTTP-klientfunksjonene i Node.js betraktelig.

### Videresend e-post: E-postinfrastruktur med åpen kildekode {#forward-email-open-source-email-infrastructure}

Vårt mest ambisiøse prosjekt er [Videresend e-post](https://github.com/forwardemail), en e-posttjeneste med åpen kildekode som tilbyr videresending av e-post, lagring og API-tjenester. Hovedarkivet har over 1100 GitHub-stjerner\[^4], noe som viser at fellesskapet setter pris på dette alternativet til proprietære e-posttjenester.

[`preview-email`](https://github.com/forwardemail/preview-email)-pakken fra denne organisasjonen, med over 2,5 millioner nedlastinger på to måneder, har blitt et viktig verktøy for utviklere som jobber med e-postmaler. Ved å tilby en enkel måte å forhåndsvise e-poster under utvikling, løser den et vanlig problem ved å bygge e-postaktiverte applikasjoner.

### Gutt: Viktige Koa-verktøy og -verktøy {#lad-essential-koa-utilities-and-tools}

[Gutteorganisasjon](https://github.com/ladjs) tilbyr en samling viktige verktøy og verktøy som primært fokuserer på å forbedre Koa-rammeverkets økosystem. Disse pakkene løser vanlige utfordringer innen webutvikling og er utformet for å fungere sømløst sammen samtidig som de forblir uavhengig nyttige.

#### koa-better-error-handler: Forbedret feilhåndtering for Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tilbyr en bedre feilhåndteringsløsning for Koa-applikasjoner. Med over 50 GitHub-stjerner, sørger denne pakken for at `ctx.throw` produserer brukervennlige feilmeldinger samtidig som den adresserer flere begrensninger i Koas innebygde feilbehandler:

* Oppdager og håndterer Node.js DNS-feil, Mongoose-feil og Redis-feil på riktig måte
* Bruker [Boom](https://github.com/hapijs/boom) for å lage konsistente, velformaterte feilresponser
* Bevarer overskrifter (i motsetning til Koas innebygde behandler)
* Opprettholder passende statuskoder i stedet for å bruke 500 som standard
* Støtter flash-meldinger og bevaring av økter
* Gir HTML-feillister for valideringsfeil
* Støtter flere responstyper (HTML, JSON og ren tekst)

Denne pakken er spesielt verdifull når den brukes sammen med [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) for omfattende feilhåndtering i Koa-applikasjoner.

#### pass: Autentisering for Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) utvider den populære Passport.js-autentiseringsmellomvaren med spesifikke forbedringer for moderne webapplikasjoner. Denne pakken støtter flere autentiseringsstrategier rett ut av boksen:

* Lokal autentisering med e-post
* Logg på med Apple
* GitHub-autentisering
* Google-autentisering
* Autentisering med engangspassord (OTP)

Pakken er svært tilpassbar, slik at utviklere kan justere feltnavn og -fraser slik at de samsvarer med applikasjonens krav. Den er designet for å integreres sømløst med Mongoose for brukeradministrasjon, noe som gjør den til en ideell løsning for Koa-baserte applikasjoner som trenger robust autentisering.

#### elegant: Elegant programavslutning {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) løser den kritiske utfordringen med å stenge av Node.js-applikasjoner på en elegant måte. Med over 70 GitHub-stjerner sikrer denne pakken at applikasjonen din kan avsluttes uten å miste data eller la tilkoblinger henge seg. Viktige funksjoner inkluderer:

* Støtte for elegant lukking av HTTP-servere (Express/Koa/Fastify)
* Ren avstengning av databasetilkoblinger (MongoDB/Mongoose)
* Riktig lukking av Redis-klienter
* Håndtering av Bree-jobbplanleggere
* Støtte for tilpassede avstengningsbehandlere
* Konfigurerbare tidsavbruddsinnstillinger
* Integrasjon med loggsystemer

Denne pakken er viktig for produksjonsapplikasjoner der uventede nedstengninger kan føre til datatap eller -korrupsjon. Ved å implementere riktige nedstengningsprosedyrer bidrar `@ladjs/graceful` til å sikre påliteligheten og stabiliteten til applikasjonen din.

### Oppetid: Overvåking av oppetid med åpen kildekode {#upptime-open-source-uptime-monitoring}

[Oppetidsorganisasjon](https://github.com/upptime) representerer vår forpliktelse til transparent, åpen kildekode-overvåking. Hoveddepotet for [`upptime`](https://github.com/upptime/upptime) har over 13 000 GitHub-stjerner, noe som gjør det til et av de mest populære prosjektene vi bidrar til. Upptime tilbyr en GitHub-drevet oppetidsmonitor og statusside som fungerer helt uten en server.

Vi bruker Uptime for vår egen statusside på <https://status.forwardemail.net> med kildekoden tilgjengelig på <https://github.com/forwardemail/status.forwardemail.net>.

Det som gjør Uptime spesiell er arkitekturen:

* **100 % åpen kildekode**: Alle komponenter er fullstendig åpen kildekode og kan tilpasses.
* **Drevet av GitHub**: Utnytter GitHub-handlinger, -problemer og -sider for en serverløs overvåkingsløsning.
* **Ingen server kreves**: I motsetning til tradisjonelle overvåkingsverktøy krever ikke Uptime at du kjører eller vedlikeholder en server.
* **Automatisk statusside**: Genererer en vakker statusside som kan hostes på GitHub Pages.
* **Kraftige varsler**: Integreres med ulike varslingskanaler, inkludert e-post, SMS og Slack.

For å forbedre brukeropplevelsen har vi integrert [@octokit/core](https://github.com/octokit/core.js/) i forwardemail.net-kodebasen for å gjengi statusoppdateringer og hendelser i sanntid direkte på nettstedet vårt. Denne integrasjonen gir brukerne våre tydelig åpenhet i tilfelle problemer på tvers av hele stacken vår (nettsted, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree osv.) med umiddelbare toastvarsler, endringer av badge-ikoner, advarselsfarger og mer.

@octokit/core-biblioteket lar oss hente sanntidsdata fra vårt Upptime GitHub-repositorium, behandle dem og vise dem på en brukervennlig måte. Når en tjeneste har et driftsavbrudd eller redusert ytelse, blir brukerne umiddelbart varslet via visuelle indikatorer uten å måtte forlate hovedapplikasjonen. Denne sømløse integrasjonen sikrer at brukerne våre alltid har oppdatert informasjon om systemstatusen vår, noe som forbedrer åpenhet og tillit.

Uptime har blitt tatt i bruk av hundrevis av organisasjoner som leter etter en transparent og pålitelig måte å overvåke tjenestene sine og kommunisere status til brukerne. Prosjektets suksess viser kraften i å bygge verktøy som utnytter eksisterende infrastruktur (i dette tilfellet GitHub) for å løse vanlige problemer på nye måter.

## Våre bidrag til økosystemet for videresending av e-post {#our-contributions-to-the-forward-email-ecosystem}

Selv om våre pakker med åpen kildekode brukes av utviklere over hele verden, danner de også grunnlaget for vår egen tjeneste for videresending av e-post. Denne doble rollen – som både skapere og brukere av disse verktøyene – gir oss et unikt perspektiv på deres praktiske anvendelse og driver kontinuerlig forbedring.

### Fra pakker til produksjon {#from-packages-to-production}

Reisen fra individuelle pakker til et helhetlig produksjonssystem innebærer nøye integrering og utvidelse. For videresendt e-post inkluderer denne prosessen:

* **Tilpassede utvidelser**: Bygge spesifikke utvidelser for videresending av e-post til våre pakker med åpen kildekode som dekker våre unike behov.

* **Integrasjonsmønstre**: Utvikle mønstre for hvordan disse pakkene samhandler i et produksjonsmiljø.

* **Ytelsesoptimaliseringer**: Identifisere og håndtere ytelsesflaskehalser som bare oppstår i stor skala.

* **Sikkerhetsherding**: Legge til ekstra sikkerhetslag spesifikt for e-posthåndtering og beskyttelse av brukerdata.

Dette arbeidet representerer tusenvis av timer med utvikling utover selve kjernepakkene, noe som resulterer i en robust og sikker e-posttjeneste som utnytter det beste av våre bidrag med åpen kildekode.

### Tilbakemeldingssløyfen {#the-feedback-loop}

Det kanskje mest verdifulle aspektet ved å bruke våre egne pakker i produksjon er tilbakemeldingssløyfen det skaper. Når vi støter på begrensninger eller kanttilfeller i Videresendt e-post, oppdaterer vi dem ikke bare lokalt – vi forbedrer de underliggende pakkene, noe som gagner både tjenesten vår og det bredere fellesskapet.

Denne tilnærmingen har ført til en rekke forbedringer:

* **Brees elegante avslutning**: Videresendt e-posts behov for null nedetid i implementeringer førte til forbedrede elegante avslutningsmuligheter i Bree.
* **Spam Scanners mønstergjenkjenning**: Spammønstre fra den virkelige verden som oppstår i videresendt e-post har informert Spam Scanners deteksjonsalgoritmer.
* **Cabins ytelsesoptimaliseringer**: Logging av store mengder i produksjonen avdekket optimaliseringsmuligheter i Cabin som gagner alle brukere.

Ved å opprettholde denne positive sirkelen mellom vårt arbeid med åpen kildekode og produksjonstjenesten, sørger vi for at pakkene våre forblir praktiske, velprøvde løsninger snarere enn teoretiske implementeringer.

## Kjerneprinsippene for videresending av e-post: Et grunnlag for fortreffelighet {#forward-emails-core-principles-a-foundation-for-excellence}

Videresendt e-post er utformet i henhold til et sett med kjerneprinsipper som veileder alle våre utviklingsbeslutninger. Disse prinsippene, som er beskrevet i [nettside](/blog/docs/best-quantum-safe-encrypted-email-service#principles), sikrer at tjenesten vår forblir utviklervennlig, sikker og fokusert på brukerens personvern.

### Alltid utviklervennlig, sikkerhetsfokusert og transparent {#always-developer-friendly-security-focused-and-transparent}

Vårt første og viktigste prinsipp er å lage programvare som er utviklervennlig, samtidig som vi opprettholder de høyeste standardene for sikkerhet og personvern. Vi mener at teknisk kvalitet aldri skal gå på bekostning av brukervennlighet, og at åpenhet bygger tillit i fellesskapet vårt.

Dette prinsippet gjenspeiles i vår detaljerte dokumentasjon, tydelige feilmeldinger og åpne kommunikasjon om både suksesser og utfordringer. Ved å gjøre hele kodebasen vår åpen kildekode, inviterer vi til gransking og samarbeid, noe som styrker både programvaren vår og det bredere økosystemet.

### Overholdelse av velprøvde prinsipper for programvareutvikling {#adherence-to-time-tested-software-development-principles}

Vi følger flere etablerte programvareutviklingsprinsipper som har bevist sin verdi over flere tiår:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separerer bekymringer gjennom Model-View-Controller-mønsteret
* **[Unix-filosofi](https://en.wikipedia.org/wiki/Unix_philosophy)**: Lager modulære komponenter som gjør én ting bra
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Holder det enkelt og greit
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Ikke gjenta deg selv, fremmer gjenbruk av kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Du kommer ikke til å trenge det, unngår for tidlig optimalisering
* **[Tolv faktor](https://12factor.net/)**: Følger beste praksis for å bygge moderne, skalerbare applikasjoner
* **[Occams barberhøvel](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Velger den enkleste løsningen som oppfyller kravene
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Bruker våre egne produkter i stor grad

Disse prinsippene er ikke bare teoretiske konsepter – de er innebygd i vår daglige utviklingspraksis. For eksempel er vår overholdelse av Unix-filosofien tydelig i hvordan vi har strukturert våre npm-pakker: små, fokuserte moduler som kan settes sammen for å løse komplekse problemer.

### Retter seg mot den useriøse, bootstrappede utvikleren {#targeting-the-scrappy-bootstrapped-developer}

Vi retter oss spesielt mot scrappy-utviklere, bootstrappede utviklere og [ramen-lønnsom](https://www.paulgraham.com/ramenprofitable.html)-utviklere. Dette fokuset former alt fra prismodellen vår til de tekniske beslutningene våre. Vi forstår utfordringene med å bygge produkter med begrensede ressurser fordi vi har vært der selv.

Dette prinsippet er spesielt viktig i hvordan vi tilnærmer oss åpen kildekode. Vi lager og vedlikeholder pakker som løser reelle problemer for utviklere uten bedriftsbudsjetter, og gjør kraftige verktøy tilgjengelige for alle uavhengig av ressurser.

### Prinsipper i praksis: Kodebasen for videresendt e-post {#principles-in-practice-the-forward-email-codebase}

Disse prinsippene er tydelig synlige i kodebasen for videresending av e-post. Vår package.json-fil viser et gjennomtenkt utvalg av avhengigheter, hver valgt for å samsvare med våre kjerneverdier:

* Sikkerhetsfokuserte pakker som `mailauth` for e-postautentisering
* Utviklervennlige verktøy som `preview-email` for enklere feilsøking
* Modulære komponenter som de forskjellige `p-*`-verktøyene fra Sindre Sørhus

Ved å følge disse prinsippene konsekvent over tid, har vi bygget en tjeneste som utviklere kan stole på med sin e-postinfrastruktur – sikker, pålitelig og i tråd med verdiene til åpen kildekode-fellesskapet.

### Personvern basert på design {#privacy-by-design}

Personvern er ikke en ettertanke eller markedsføringsfunksjon for videresending av e-post – det er et grunnleggende designprinsipp som informerer alle aspekter av tjenesten og koden vår:

* **Nulltilgangskryptering**: Vi har implementert systemer som gjør det teknisk umulig for oss å lese brukernes e-poster.
* **Minimal datainnsamling**: Vi samler kun inn dataene som er nødvendige for å tilby tjenesten vår, ikke noe mer.
* **Gjennomsiktige retningslinjer**: Personvernerklæringen vår er skrevet i et klart og forståelig språk uten juridisk sjargong.
* **Verifisering av åpen kildekode**: Vår kodebase med åpen kildekode lar sikkerhetsforskere bekrefte personvernpåstandene våre.

Denne forpliktelsen gjelder også våre pakker med åpen kildekode, som er utviklet med beste praksis for sikkerhet og personvern innebygd fra grunnen av.

### Bærekraftig åpen kildekode {#sustainable-open-source}

Vi mener at programvare med åpen kildekode trenger bærekraftige modeller for å trives på lang sikt. Vår tilnærming inkluderer:

* **Kommersiell støtte**: Tilbyr førsteklasses støtte og tjenester rundt våre verktøy med åpen kildekode.
* **Balansert lisensiering**: Bruk av lisenser som beskytter både brukerfriheter og prosjektets bærekraft.
* **Samfunnsengasjement**: Aktivt engasjere seg med bidragsytere for å bygge et støttende fellesskap.
* **Gjennomsiktige veikart**: Dele utviklingsplanene våre slik at brukerne kan planlegge deretter.

Ved å fokusere på bærekraft sikrer vi at våre bidrag til åpen kildekode kan fortsette å vokse og forbedres over tid, i stedet for å bli forsømt.

## Tallene lyver ikke: Vår svimlende npm-nedlastingsstatistikk {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Når vi snakker om effekten av åpen kildekode-programvare, gir nedlastingsstatistikk et konkret mål på adopsjon og tillit. Mange av pakkene vi hjelper til med å vedlikeholde har nådd et omfang som få åpen kildekode-prosjekter noen gang oppnår, med samlede nedlastinger i milliardklassen.

![Topp npm-pakker etter nedlastinger](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Selv om vi er stolte av å bidra til å vedlikeholde flere pakker med høy nedlasting i JavaScript-økosystemet, ønsker vi å erkjenne at mange av disse pakkene opprinnelig ble laget av andre talentfulle utviklere. Pakker som superagent og supertest ble opprinnelig laget av TJ Holowaychuk, hvis produktive bidrag til åpen kildekode har vært avgjørende for å forme Node.js-økosystemet.

### Et fugleperspektiv på vår innvirkning {#a-birds-eye-view-of-our-impact}

I løpet av bare tomånedersperioden fra februar til mars 2025, er de beste pakkene vi bidrar til og bidrar til å opprettholde rekordhøye nedlastingstall:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 nedlastinger\[^7] (opprinnelig opprettet av TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 nedlastinger\[^8] (opprinnelig opprettet av TJ Holowaychuk)
* **[også](https://www.npmjs.com/package/koa)**: 28 539 295 nedlastinger\[^34] (opprinnelig opprettet av TJ Holowaychuk)
* **[@koa/ruter](https://www.npmjs.com/package/@koa/router)**: 11 007 327 nedlastinger\[^35]
* **[koa-ruter](https://www.npmjs.com/package/koa-router)**: 3 498 918 nedlastinger\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 nedlastinger\[^37]
* **[forhåndsvisnings-e-post](https://www.npmjs.com/package/preview-email)**: 2 500 000 nedlastinger\[^9]
* **[kabin](https://www.npmjs.com/package/cabin)**: 1 800 000 nedlastinger\[^10]
* **[@breejs/senere](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 nedlastinger\[^38]
* **[e-postmaler](https://www.npmjs.com/package/email-templates)**: 1 128 139 nedlastinger\[^39]
* **__PROTECTED_LINK_259__0**: 1 124 686 nedlastinger\[^40]
* **__PROTECTED_LINK_259__1**: 1 200 000 nedlastinger\[^11]
* **__PROTECTED_LINK_259__2**: 894 666 nedlastinger\[^41]
* **__PROTECTED_LINK_259__3**: 839 585 nedlastinger\[^42]
* **__PROTECTED_LINK_259__4**: 145 000 nedlastinger\[^12]
* **__PROTECTED_LINK_259__5**: 24 270 nedlastinger\[^30]

> \[!NOTE]
> Flere andre pakker vi hjelper til med å vedlikeholde, men ikke har laget, har enda høyere nedlastingtall, inkludert `form-data` (738 millioner+ nedlastinger), `toidentifier` (309 millioner+ nedlastinger), `stackframe` (116 millioner+ nedlastinger) og `error-stack-parser` (113 millioner+ nedlastinger). Vi er beæret over å kunne bidra til disse pakkene samtidig som vi respekterer arbeidet til de opprinnelige forfatterne.

Dette er ikke bare imponerende tall – de representerer ekte utviklere som løser ekte problemer med kode som vi hjelper til med å vedlikeholde. Hver nedlasting er et eksempel der disse pakkene har hjulpet noen med å bygge noe meningsfullt, fra hobbyprosjekter til bedriftsapplikasjoner som brukes av millioner.

![Pakkekategorier Distribusjon](/img/art/category_pie_chart.svg)

### Daglig påvirkning i stor skala {#daily-impact-at-scale}

De daglige nedlastingsmønstrene viser jevn bruk med høyt volum, med topper som når millioner av nedlastinger per dag\[^13]. Denne konsistensen vitner om stabiliteten og påliteligheten til disse pakkene – utviklere prøver dem ikke bare ut; de integrerer dem i sine kjernearbeidsflyter og er avhengige av dem dag etter dag.

Ukentlige nedlastingsmønstre viser enda mer imponerende tall, og ligger konsekvent rundt titalls millioner nedlastinger per uke\[^14]. Dette representerer et enormt fotavtrykk i JavaScript-økosystemet, med disse pakkene som kjører i produksjonsmiljøer over hele verden.

### Utover de rå tallene {#beyond-the-raw-numbers}

Selv om nedlastingsstatistikken i seg selv er imponerende, forteller den en dypere historie om tilliten fellesskapet har til disse pakkene. Å vedlikeholde pakker i denne skalaen krever en urokkelig forpliktelse til:

* **Bakomkompatibilitet**: Endringer må vurderes nøye for å unngå å ødelegge eksisterende implementeringer.
* **Sikkerhet**: Med millioner av applikasjoner som er avhengige av disse pakkene, kan sikkerhetssårbarheter ha vidtrekkende konsekvenser.
* **Ytelse**: I denne skalaen kan selv mindre ytelsesforbedringer ha betydelige samlede fordeler.
* **Dokumentasjon**: Tydelig og omfattende dokumentasjon er viktig for pakker som brukes av utviklere på alle erfaringsnivåer.

Den jevne veksten i nedlastingstall over tid gjenspeiler suksessen med å oppfylle disse forpliktelsene, og bygge tillit med utviklermiljøet gjennom pålitelige og godt vedlikeholdte pakker.

## Støtter økosystemet: Våre sponsoravtaler med åpen kildekode {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Bærekraft med åpen kildekode handler ikke bare om å bidra med kode – det handler også om å støtte utviklerne som vedlikeholder kritisk infrastruktur.

Utover våre direkte bidrag til JavaScript-økosystemet, er vi stolte av å sponse fremtredende Node.js-bidragsytere hvis arbeid danner grunnlaget for mange moderne applikasjoner. Våre sponsoravtaler inkluderer:

### Andris Reinman: Pioner innen e-postinfrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) er skaperen av [Nodemailer](https://github.com/nodemailer/nodemailer), det mest populære e-postbiblioteket for Node.js med over 14 millioner ukentlige nedlastinger\[^15]. Arbeidet hans strekker seg til andre kritiske e-postinfrastrukturkomponenter som [SMTP-server](https://github.com/nodemailer/smtp-server), [E-postparser](https://github.com/nodemailer/mailparser) og [Villand](https://github.com/nodemailer/wildduck).

Vårt sponsorskap bidrar til å sikre fortsatt vedlikehold og utvikling av disse viktige verktøyene som driver e-postkommunikasjon for utallige Node.js-applikasjoner, inkludert vår egen tjeneste for videresending av e-post.

### Sindre Sorhus: Utility Package Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) er en av de mest produktive bidragsyterne innen åpen kildekode i JavaScript-økosystemet, med over 1000 npm-pakker bak seg. Verktøyene hans som [p-kart](https://github.com/sindresorhus/p-map), [p-forsøk på nytt](https://github.com/sindresorhus/p-retry) og [er-strøm](https://github.com/sindresorhus/is-stream) er grunnleggende byggesteiner som brukes i hele Node.js-økosystemet.

Ved å sponse Sindres arbeid bidrar vi til å opprettholde utviklingen av disse kritiske verktøyene som gjør JavaScript-utvikling mer effektiv og pålitelig.

Disse sponsoravtalene gjenspeiler vår forpliktelse til det bredere økosystemet med åpen kildekode. Vi erkjenner at vår egen suksess er bygget på grunnlaget lagt av disse og andre bidragsytere, og vi er dedikert til å sikre bærekraften til hele økosystemet.

## Avdekking av sikkerhetsproblemer i JavaScript-økosystemet {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Vår forpliktelse til åpen kildekode strekker seg utover funksjonsutvikling og inkluderer også å identifisere og håndtere sikkerhetssårbarheter som kan påvirke millioner av utviklere. Flere av våre viktigste bidrag til JavaScript-økosystemet har vært innen sikkerhet.

### Koa-ruterredningen {#the-koa-router-rescue}

I februar 2019 identifiserte Nick et kritisk problem med vedlikeholdet av den populære koa-router-pakken. Da han [rapportert på Hacker News](https://news.ycombinator.com/item?id=19156707), hadde pakken blitt forlatt av den opprinnelige vedlikeholderen, noe som førte til at sikkerhetssårbarheter ikke ble adressert og fellesskapet uten oppdateringer.

> \[!WARNING]
> Forlatte pakker med sikkerhetssårbarheter utgjør betydelig risiko for hele økosystemet, spesielt når de lastes ned millioner av ganger i uken.

Som svar opprettet Nick [@koa/ruter](https://github.com/koajs/router) og hjalp til med å varsle fellesskapet om situasjonen. Han har vedlikeholdt denne kritiske pakken siden den gang, og sørget for at Koa-brukere har en sikker og godt vedlikeholdt rutingsløsning.

### Håndtering av ReDoS-sårbarheter {#addressing-redos-vulnerabilities}

I 2020 identifiserte og adresserte Nick et kritisk [Tjenestenektelse for regulært uttrykk (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-sårbarhet i den mye brukte `url-regex`-pakken. Dette sikkerhetsproblemet ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) kan tillate angripere å forårsake tjenestenekt ved å gi spesiallaget input som forårsaker katastrofal tilbakesporing i det regulære uttrykket.

I stedet for å bare oppdatere den eksisterende pakken, laget Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), en fullstendig omskrevet implementering som adresserer sårbarheten samtidig som den opprettholder kompatibiliteten med det opprinnelige API-et. Han publiserte også en [omfattende blogginnlegg](/blog/docs/url-regex-javascript-node-js) som forklarer sårbarheten og hvordan man kan redusere den.

Dette arbeidet viser vår tilnærming til sikkerhet: ikke bare å løse problemer, men å utdanne samfunnet og tilby robuste alternativer som forhindrer lignende problemer i fremtiden.

### Forkjemper for Node.js og Chromium-sikkerhet {#advocating-for-nodejs-and-chromium-security}

Nick har også vært aktiv i arbeidet med å forbedre sikkerheten i det bredere økosystemet. I august 2020 identifiserte han et betydelig sikkerhetsproblem i Node.js knyttet til håndteringen av HTTP-overskrifter, noe som ble rapportert i [Registeret](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Dette problemet, som stammet fra en oppdatering i Chromium, kunne potensielt tillate angripere å omgå sikkerhetstiltak. Nicks arbeid bidro til å sikre at problemet ble løst raskt, og dermed beskyttet millioner av Node.js-applikasjoner mot potensiell utnyttelse.

### Sikring av npm-infrastruktur {#securing-npm-infrastructure}

Senere samme måned identifiserte Nick et annet kritisk sikkerhetsproblem, denne gangen i npms e-postinfrastruktur. Som rapportert i [Registeret](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), implementerte ikke npm e-postautentiseringsprotokollene DMARC, SPF og DKIM på riktig måte, noe som potensielt tillot angripere å sende phishing-e-poster som så ut til å komme fra npm.

Nicks rapport førte til forbedringer i npms e-postsikkerhet, og beskyttet millioner av utviklere som er avhengige av npm for pakkehåndtering mot potensielle phishing-angrep.

## Våre bidrag til økosystemet for videresending av e-post {#our-contributions-to-the-forward-email-ecosystem-1}

Videresendt e-post er bygget på flere kritiske åpen kildekode-prosjekter, inkludert Nodemailer, WildDuck og mailauth. Teamet vårt har gitt betydelige bidrag til disse prosjektene, og har bidratt til å identifisere og fikse dyptgående problemer som påvirker e-postlevering og -sikkerhet.

### Forbedring av Nodemailers kjernefunksjonalitet {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) er ryggraden i e-postsending i Node.js, og våre bidrag har bidratt til å gjøre den mer robust:

* **Forbedringer av SMTP-server**: Vi har fikset parseringsfeil, problemer med strømhåndtering og TLS-konfigurasjonsproblemer i SMTP-serverkomponenten\[^16]\[^17].
* **Forbedringer av e-postparser**: Vi har adressert feil med dekoding av tegnsekvenser og parserproblemer som kan forårsake feil i e-postbehandlingen\[^18]\[^19].

Disse bidragene sikrer at Nodemailer forblir et pålitelig grunnlag for e-postbehandling i Node.js-applikasjoner, inkludert videresending av e-post.

### Avanserte e-postautentiseringer med Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tilbyr kritisk e-postautentiseringsfunksjonalitet, og våre bidrag har forbedret funksjonene betydelig:

* **Forbedringer av DKIM-verifisering**: Vi oppdaget og rapporterte at X/Twitter hadde DNS-cacheproblemer som forårsaket DKIM-feil for utgående meldinger, og rapporterte dette på Hacker One\[^20].
* **Forbedringer av DMARC og ARC**: Vi har løst problemer med DMARC- og ARC-verifisering som kan føre til feil autentiseringsresultater\[^21]\[^22].
* **Ytelsesoptimaliseringer**: Vi har bidratt med optimaliseringer som forbedrer ytelsen til e-postautentiseringsprosesser\[^23]\[^24]\[^25]\[^26].

Disse forbedringene bidrar til å sikre at e-postautentisering er nøyaktig og pålitelig, og beskytter brukere mot phishing- og forfalskningsangrep.

### Forbedringer av nøkkeloppetid {#key-upptime-enhancements}

Våre bidrag til Uptime inkluderer:

* **Overvåking av SSL-sertifikat**: Vi har lagt til funksjonalitet for å overvåke utløp av SSL-sertifikater, noe som forhindrer uventet nedetid på grunn av utløpte sertifikater\[^27].
* **Støtte for flere SMS-numre**: Vi har implementert støtte for å varsle flere teammedlemmer via SMS når hendelser oppstår, noe som forbedrer responstidene\[^28].
* **Rettelser for IPv6-sjekk**: Vi har løst problemer med IPv6-tilkoblingssjekker, noe som sikrer mer nøyaktig overvåking i moderne nettverksmiljøer\[^29].
* **Støtte for mørk/lys modus**: Vi har lagt til temastøtte for å forbedre brukeropplevelsen på statussider\[^31].
* **Bedre TCP-Ping-støtte**: Vi har forbedret TCP-ping-funksjonaliteten for å gi mer pålitelig tilkoblingstesting\[^32].

Disse forbedringene er ikke bare til fordel for statusovervåkingen av Forward Email, men de er også tilgjengelige for hele Uptime-brukerfellesskapet, noe som demonstrerer vår forpliktelse til å forbedre verktøyene vi er avhengige av.

## Limet som holder alt sammen: Tilpasset kode i stor skala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Selv om våre npm-pakker og bidrag til eksisterende prosjekter er betydelige, er det den tilpassede koden som integrerer disse komponentene som virkelig viser frem vår tekniske ekspertise. Kodebasen for videresending av e-post representerer et tiår med utviklingsinnsats, som går tilbake til 2017 da prosjektet startet som [gratis videresending av e-post](https://github.com/forwardemail/free-email-forwarding) før det ble slått sammen til et monorepo.

### En massiv utviklingsinnsats {#a-massive-development-effort}

Omfanget av denne tilpassede integrasjonskoden er imponerende:

* **Totale bidrag**: Over 3217 commits
* **Kodebasestørrelse**: Over 421 545 kodelinjer på tvers av JavaScript-, Pug-, CSS- og JSON-filer\[^33]

Dette representerer tusenvis av timer med utviklingsarbeid, feilsøkingsøkter og ytelsesoptimaliseringer. Det er den «hemmelige ingrediensen» som forvandler individuelle pakker til en sammenhengende og pålitelig tjeneste som brukes av tusenvis av kunder daglig.

### Integrering av kjerneavhengigheter {#core-dependencies-integration}

Kodebasen for videresending av e-post integrerer en rekke avhengigheter til en sømløs helhet:

* **E-postbehandling**: Integrerer Nodemailer for sending, SMTP-server for mottak og Mailparser for parsing
* **Autentisering**: Bruker Mailauth for DKIM-, SPF-, DMARC- og ARC-verifisering
* **DNS-oppløsning**: Utnytter Tangerine for DNS-over-HTTPS med global caching
* **MX-tilkobling**: Bruker mx-connect med Tangerine-integrasjon for pålitelige e-postservertilkoblinger
* **Jobbplanlegging**: Bruker Bree for pålitelig bakgrunnsoppgavebehandling med arbeidstråder
* **Maler**: Bruker e-postmaler for å gjenbruke stilark fra nettstedet i kundekommunikasjon
* **E-postlagring**: Implementerer individuelt krypterte SQLite-postbokser ved hjelp av better-sqlite3-multiple-chiffer med ChaCha20-Poly1305-kryptering for kvantesikker personvern, noe som sikrer fullstendig isolasjon mellom brukere og at bare brukeren har tilgang til postboksen sin

Hver av disse integrasjonene krever nøye vurdering av kanttilfeller, ytelsesimplikasjoner og sikkerhetsproblemer. Resultatet er et robust system som håndterer millioner av e-posttransaksjoner pålitelig. SQLite-implementeringen vår utnytter også msgpackr for effektiv binær serialisering og WebSockets (via ws) for statusoppdateringer i sanntid på tvers av infrastrukturen vår.

### DNS-infrastruktur med Tangerine og mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

En kritisk komponent i infrastrukturen for videresendt e-post er DNS-løsningssystemet vårt, bygget rundt to nøkkelpakker:

* **[Mandarin](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Vår Node.js DNS-over-HTTPS-implementering tilbyr en drop-in-erstatning for standard DNS-resolver, med innebygde nye forsøk, timeouts, smart serverrotasjon og støtte for mellomlagring.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Denne pakken oppretter TCP-tilkoblinger til MX-servere, tar et måldomene eller en e-postadresse, løser opp aktuelle MX-servere og kobler til dem i prioritert rekkefølge.

Vi har integrert Tangerine med mx-connect gjennom [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), som sikrer DNS på applikasjonslaget over HTTP-forespørsler gjennom hele Videresendt e-post. Dette gir global hurtigbufring for DNS i skala med 1:1-konsistens på tvers av enhver region, app eller prosess – kritisk for pålitelig e-postlevering i et distribuert system.

## Bedriftspåvirkning: Fra åpen kildekode til forretningskritiske løsninger {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kulminasjonen av vår tiår lange reise innen utvikling av åpen kildekode har gjort det mulig for Videresendt e-post å betjene ikke bare individuelle utviklere, men også store bedrifter og utdanningsinstitusjoner som danner ryggraden i selve åpen kildekode-bevegelsen.

### Casestudier i forretningskritisk e-postinfrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Vår forpliktelse til pålitelighet, personvern og prinsipper for åpen kildekode har gjort Videresendt e-post til det pålitelige valget for organisasjoner med krevende e-postkrav:

* **Utdanningsinstitusjoner**: Som beskrevet i vår [casestudie om videresending av e-post for alumner]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study). Store universiteter er avhengige av infrastrukturen vår for å opprettholde livslange forbindelser med hundretusenvis av alumner gjennom pålitelige e-postvideresendingstjenester.

* **Linux-løsninger for bedrifter**: [Canonical Ubuntu e-post casestudie for bedrifter](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demonstrerer hvordan vår åpen kildekode-tilnærming samsvarer perfekt med behovene til leverandører av Linux for bedrifter, og gir dem den åpenheten og kontrollen de trenger.

* **Open Source Foundation**: Det som kanskje er mest verdifullt er partnerskapet vårt med Linux Foundation, som dokumentert i [Casestudie av e-post til bedrifter i Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), der tjenesten vår driver kommunikasjonen for organisasjonen som forvalter Linux-utvikling.

Det er en vakker symmetri i hvordan våre åpne kildekode-pakker, vedlikeholdt med omhu over mange år, har gjort det mulig for oss å bygge en e-posttjeneste som nå støtter de samme lokalsamfunnene og organisasjonene som kjemper for åpen kildekode-programvare. Denne komplette reisen – fra å bidra med individuelle pakker til å drive e-postinfrastruktur i bedriftsklassen for ledere innen åpen kildekode – representerer den ultimate valideringen av vår tilnærming til programvareutvikling.

## Et tiår med åpen kildekode: Et blikk fremover {#a-decade-of-open-source-looking-forward}

Når vi ser tilbake på et tiår med bidrag fra åpen kildekode og frem mot de neste ti årene, er vi fylt med takknemlighet for fellesskapet som har støttet arbeidet vårt og begeistring for det som skal komme.

Vår reise fra individuelle pakkebidragsytere til vedlikeholdere av en omfattende e-postinfrastruktur som brukes av store bedrifter og åpen kildekode-stiftelser har vært bemerkelsesverdig. Det er et bevis på kraften i åpen kildekode-utvikling og den innvirkningen gjennomtenkt, godt vedlikeholdt programvare kan ha på det bredere økosystemet.

I årene som kommer er vi forpliktet til å:

* **Vi fortsetter å vedlikeholde og forbedre våre eksisterende pakker**, og sørger for at de forblir pålitelige verktøy for utviklere over hele verden.
* **Vi utvider våre bidrag til kritiske infrastrukturprosjekter**, spesielt innen e-post og sikkerhetsdomener.
* **Vi forbedrer mulighetene for videresending av e-post**, samtidig som vi opprettholder vår forpliktelse til personvern, sikkerhet og åpenhet.
* **Vi støtter neste generasjon av åpen kildekode-bidragsytere** gjennom veiledning, sponsing og samfunnsengasjement.

Vi tror at fremtiden for programvareutvikling er åpen, samarbeidsbasert og bygget på et fundament av tillit. Ved å fortsette å bidra med pakker av høy kvalitet med fokus på sikkerhet til JavaScript-økosystemet, håper vi å kunne spille en liten rolle i å bygge den fremtiden.

Takk til alle som har brukt pakkene våre, bidratt til prosjektene våre, rapportert problemer eller bare spredt ordet om arbeidet vårt. Deres støtte har gjort dette tiåret med innvirkning mulig, og vi gleder oss til å se hva vi kan oppnå sammen i løpet av de neste ti årene.

\[^1]: npm nedlastingsstatistikk for cabin, april 2025
\[^2]: npm nedlastingsstatistikk for bson-objectid, februar–mars 2025
\[^3]: npm nedlastingsstatistikk for url-regex-safe, april 2025
\[^4]: GitHub-stjernetelling for forwardemail/forwardemail.net per april 2025
\[^5]: npm nedlastingsstatistikk for preview-email, april 2025
\[^7]: npm nedlastingsstatistikk for superagent, februar–mars 2025
\[^8]: npm nedlastingsstatistikk for supertest, februar–mars 2025
\[^9]: npm nedlastingsstatistikk for preview-email, februar–mars 2025
\[^10]: npm nedlastingsstatistikk for cabin, februar–mars 2025
\[^11]: npm nedlastingsstatistikk for url-regex-safe, februar–mars 2025
\[^12]: npm nedlastingsstatistikk for spamscanner, februar-mars 2025
\[^13]: Daglige nedlastingsmønstre fra npm-statistikk, april 2025
\[^14]: Ukentlige nedlastingsmønstre fra npm-statistikk, april 2025
\[^15]: npm nedlastingsstatistikk for nodemailer, april 2025
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
\[^27]: Basert på GitHub-problemer i Upptime-repositoriet
\[^28]: Basert på GitHub-problemer i Upptime-repositoriet
\[^29]: Basert på GitHub-problemer i Upptime-repositoriet
\[^30]: npm-nedlastingsstatistikk for bree, februar-mars 2025
\[^31]: Basert på GitHub-pull-forespørsler til Upptime
\[^32]: Basert på GitHub-pull-forespørsler til Upptime
\[^34]: npm-nedlastingsstatistikk for koa, februar-mars 2025
\[^35]: npm-nedlastingsstatistikk for @koa/router, februar-mars 2025
\[^36]: npm-nedlastingsstatistikk for koa-router, februar-mars 2025
\[^37]: npm nedlastingsstatistikk for url-regex, februar–mars 2025
\[^38]: npm nedlastingsstatistikk for @breejs/later, februar–mars 2025
\[^39]: npm nedlastingsstatistikk for e-postmaler, februar–mars 2025
\[^40]: npm nedlastingsstatistikk for get-paths, februar–mars 2025
\[^41]: npm nedlastingsstatistikk for dotenv-parse-variabler, februar–mars 2025
\[^42]: npm nedlastingsstatistikk for @koa/multer, februar–mars 2025