# Sådan optimerer du Node.js produktionsinfrastruktur: Bedste praksis {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Vores 573% Single Core-ydeevneoptimeringsrevolution](#our-573-single-core-performance-optimization-revolution)
  * [Hvorfor Single Core Performance Optimization er vigtig for Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Relateret indhold](#related-content)
* [Opsætning af Node.js-produktionsmiljø: Vores teknologistak](#nodejs-production-environment-setup-our-technology-stack)
  * [Pakkehåndtering: pnpm til produktionseffektivitet](#package-manager-pnpm-for-production-efficiency)
  * [Web Framework: Koa til moderne Node.js-produktion](#web-framework-koa-for-modern-nodejs-production)
  * [Baggrundsjobbehandling: Bree for produktionspålidelighed](#background-job-processing-bree-for-production-reliability)
  * [Fejlhåndtering: @hapi/boom for produktionspålidelighed](#error-handling-hapiboom-for-production-reliability)
* [Sådan overvåger du Node.js-applikationer i produktion](#how-to-monitor-nodejs-applications-in-production)
  * [Node.js-produktionsovervågning på systemniveau](#system-level-nodejs-production-monitoring)
  * [Overvågning på applikationsniveau for Node.js-produktion](#application-level-monitoring-for-nodejs-production)
  * [Applikationsspecifik overvågning](#application-specific-monitoring)
* [Node.js-produktionsovervågning med PM2-sundhedstjek](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Vores PM2-sundhedstjeksystem](#our-pm2-health-check-system)
  * [Vores PM2-produktionskonfiguration](#our-pm2-production-configuration)
  * [Automatiseret PM2-implementering](#automated-pm2-deployment)
* [System til håndtering og klassificering af produktionsfejl](#production-error-handling-and-classification-system)
  * [Vores isCodeBug-implementering til produktion](#our-iscodebug-implementation-for-production)
  * [Integration med vores produktionslogning](#integration-with-our-production-logging)
  * [Relateret indhold](#related-content-1)
* [Avanceret ydeevnedebugging med v8-profiler-next og cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Vores profileringsmetode til Node.js-produktion](#our-profiling-approach-for-nodejs-production)
  * [Sådan implementerer vi Heap Snapshot-analyse](#how-we-implement-heap-snapshot-analysis)
  * [Arbejdsgang til fejlfinding af ydeevne](#performance-debugging-workflow)
  * [Anbefalet implementering til din Node.js-applikation](#recommended-implementation-for-your-nodejs-application)
  * [Integration med vores produktionsovervågning](#integration-with-our-production-monitoring)
* [Node.js Produktionsinfrastruktursikkerhed](#nodejs-production-infrastructure-security)
  * [Systemsikkerhed til Node.js-produktion](#system-level-security-for-nodejs-production)
  * [Applikationssikkerhed for Node.js-applikationer](#application-security-for-nodejs-applications)
  * [Automatisering af infrastruktursikkerhed](#infrastructure-security-automation)
  * [Vores sikkerhedsindhold](#our-security-content)
* [Databasearkitektur til Node.js-applikationer](#database-architecture-for-nodejs-applications)
  * [SQLite-implementering til Node.js-produktion](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-implementering til Node.js-produktion](#mongodb-implementation-for-nodejs-production)
* [Baggrundsjobbehandling i Node.js-produktion](#nodejs-production-background-job-processing)
  * [Vores Bree Server Setup til Produktion](#our-bree-server-setup-for-production)
  * [Eksempler på produktionsjob](#production-job-examples)
  * [Vores jobplanlægningsmønstre til Node.js-produktion](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatiseret vedligeholdelse af Node.js-produktionsapplikationer](#automated-maintenance-for-production-nodejs-applications)
  * [Vores oprydningsimplementering](#our-cleanup-implementation)
  * [Diskpladshåndtering til Node.js-produktion](#disk-space-management-for-nodejs-production)
  * [Automatisering af infrastrukturvedligeholdelse](#infrastructure-maintenance-automation)
* [Implementeringsvejledning til Node.js-produktion](#nodejs-production-deployment-implementation-guide)
  * [Undersøg vores faktiske kode for bedste praksis i produktionen](#study-our-actual-code-for-production-best-practices)
  * [Lær af vores blogindlæg](#learn-from-our-blog-posts)
  * [Infrastrukturautomatisering til Node.js-produktion](#infrastructure-automation-for-nodejs-production)
  * [Vores casestudier](#our-case-studies)
* [Konklusion: Bedste praksis for Node.js-produktionsimplementering](#conclusion-nodejs-production-deployment-best-practices)
* [Komplet ressourceliste til Node.js-produktion](#complete-resource-list-for-nodejs-production)
  * [Vores kerneimplementeringsfiler](#our-core-implementation-files)
  * [Vores serverimplementeringer](#our-server-implementations)
  * [Vores infrastrukturautomatisering](#our-infrastructure-automation)
  * [Vores tekniske blogindlæg](#our-technical-blog-posts)
  * [Vores casestudier til virksomheder](#our-enterprise-case-studies)

## Forord {#foreword}

Hos Forward Email har vi brugt årevis på at perfektionere vores Node.js produktionsmiljø. Denne omfattende guide deler vores gennemprøvede bedste praksis for Node.js produktionsimplementering med fokus på ydeevneoptimering, overvågning og de erfaringer, vi har gjort med at skalere Node.js-applikationer til at håndtere millioner af daglige transaktioner.

## Vores 573% Single Core-ydeevneoptimeringsrevolution {#our-573-single-core-performance-optimization-revolution}

Da vi migrerede fra Intel- til AMD Ryzen-processorer, opnåede vi en forbedring af vores Node.js-applikationers ydeevne på **573%**. Dette var ikke bare en mindre optimering – det ændrede fundamentalt, hvordan vores Node.js-applikationer yder i produktion, og demonstrerer vigtigheden af single-core-ydeevneoptimering for enhver Node.js-applikation.

> \[!TIP]
> Valg af hardware er afgørende for bedste praksis for Node.js-produktionsimplementering. Vi valgte specifikt DataPacket-hosting på grund af deres AMD Ryzen-tilgængelighed, fordi single-core-ydeevne er afgørende for Node.js-applikationer, da JavaScript-udførelse er single-threaded.

### Hvorfor Single Core-ydeevneoptimering er vigtig for Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Vores migrering fra Intel til AMD Ryzen resulterede i:

* **573% forbedring af ydeevne** i anmodningsbehandling (dokumenteret i [vores statussides GitHub-problem #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Elimineret behandlingsforsinkelse** til næsten øjeblikkelige svar (nævnt i [GitHub-problem #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Bedre pris-til-ydelsesforhold** for Node.js-produktionsmiljøer
* **Forbedrede svartider** på tværs af alle vores applikationsslutpunkter

Ydeevneforøgelsen var så betydelig, at vi nu anser AMD Ryzen-processorer for at være essentielle for enhver seriøs Node.js-produktionsimplementering, uanset om du kører webapplikationer, API'er, mikrotjenester eller enhver anden Node.js-arbejdsbelastning.

### Relateret indhold {#related-content}

For flere detaljer om vores infrastrukturvalg, se:

* [Bedste e-mail-videresendelsestjeneste](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Ydeevnesammenligninger
* [Selvhostet løsning](https://forwardemail.net/blog/docs/self-hosted-solution) - Hardwareanbefalinger

## Opsætning af Node.js-produktionsmiljø: Vores teknologistak {#nodejs-production-environment-setup-our-technology-stack}

Vores bedste praksis for Node.js-produktionsimplementering inkluderer bevidste teknologiske valg baseret på mange års produktionserfaring. Her er, hvad vi bruger, og hvorfor disse valg gælder for enhver Node.js-applikation:

### Pakkehåndtering: pnpm for produktionseffektivitet {#package-manager-pnpm-for-production-efficiency}

**Hvad vi bruger:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (fastgjort version)

Vi valgte pnpm frem for npm og yarn til vores Node.js produktionsmiljøopsætning fordi:

* **Hurtigere installationstider** i CI/CD-pipelines
* **Effektiv diskplads** gennem hard linking
* **Streng afhængighedsopløsning**, der forhindrer fantomafhængigheder
* **Bedre ydeevne** i produktionsimplementeringer

> \[!NOTE]
> Som en del af vores bedste praksis for Node.js-produktionsimplementering fastlåser vi nøjagtige versioner af kritiske værktøjer som pnpm for at sikre ensartet adfærd på tværs af alle miljøer og teammedlemmers maskiner.

**Implementeringsdetaljer:**

* [Vores package.json-konfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Vores blogindlæg om NPM-økosystemet](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Framework: Koa til moderne Node.js-produktion {#web-framework-koa-for-modern-nodejs-production}

**Hvad vi bruger:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi valgte Koa frem for Express til vores Node.js produktionsinfrastruktur på grund af dens moderne async/await-understøttelse og renere middleware-sammensætning. Vores grundlægger Nick Baugh bidrog til både Express og Koa, hvilket gav os dyb indsigt i begge frameworks til produktionsbrug.

Disse mønstre gælder, uanset om du bygger REST API'er, GraphQL-servere, webapplikationer eller mikrotjenester.

**Vores implementeringseksempler:**

* [Opsætning af webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-serverkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Implementeringsvejledning til kontaktformularer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Baggrundsjobbehandling: Bree for produktionspålidelighed {#background-job-processing-bree-for-production-reliability}

**Hvad vi bruger:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) planlægger

Vi har oprettet og vedligeholder Bree, fordi eksisterende jobplanlæggere ikke opfyldte vores behov for understøttelse af arbejdstråde og moderne JavaScript-funktioner i Node.js-produktionsmiljøer. Dette gælder for alle Node.js-applikationer, der kræver baggrundsbehandling, planlagte opgaver eller arbejdstråde.

**Vores implementeringseksempler:**

* [Bree server opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Alle vores jobdefinitioner](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 sundhedstjek job](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementering af oprydningsjob](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Fejlhåndtering: @hapi/boom for produktionspålidelighed {#error-handling-hapiboom-for-production-reliability}

**Hvad vi bruger:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi bruger @hapi/boom til strukturerede fejlresponser i vores Node.js-produktionsapplikationer. Dette mønster fungerer for alle Node.js-applikationer, der kræver ensartet fejlhåndtering.

**Vores implementeringseksempler:**

* [Hjælp til fejlklassificering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger-implementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Sådan overvåger du Node.js-applikationer i produktion {#how-to-monitor-nodejs-applications-in-production}

Vores tilgang til overvågning af Node.js-applikationer i produktion har udviklet sig gennem årevis med kørsel af applikationer i stor skala. Vi implementerer overvågning på flere lag for at sikre pålidelighed og ydeevne for enhver type Node.js-applikation.

### Produktionsovervågning af Node.js på systemniveau {#system-level-nodejs-production-monitoring}

**Vores kerneimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Hvad vi bruger:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vores produktionsovervågningstærskler (fra vores faktiske produktionskode):

* **2 GB heapstørrelsesgrænse** med automatiske advarsler
* **25 % hukommelsesforbrug** advarselstærskel
* **80 % CPU-forbrug** advarselstærskel
* **75 % diskforbrug** advarselstærskel

> \[!WARNING]
> Disse tærskler fungerer for vores specifikke hardwarekonfiguration. Når du implementerer Node.js produktionsovervågning, skal du gennemgå vores monitor-server.js implementering for at forstå den nøjagtige logik og tilpasse værdierne til din opsætning.

### Overvågning på applikationsniveau for Node.js-produktion {#application-level-monitoring-for-nodejs-production}

**Vores fejlklassificering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denne hjælper skelner mellem:

* **Faktiske kodefejl**, der kræver øjeblikkelig opmærksomhed
* **Brugerfejl**, der er forventet adfærd
* **Eksterne servicefejl**, som vi ikke kan kontrollere

Dette mønster gælder for alle Node.js-applikationer - webapps, API'er, mikrotjenester eller baggrundstjenester.

**Vores logføringsimplementering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi implementerer omfattende feltredigering for at beskytte følsomme oplysninger, samtidig med at vi opretholder nyttige fejlfindingsfunktioner i vores Node.js-produktionsmiljø.

### Applikationsspecifik overvågning {#application-specific-monitoring}

**Vores serverimplementeringer:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Køovervågning:** Vi implementerer køgrænser på 5 GB og timeouts på 180 sekunder til anmodningsbehandling for at forhindre ressourceudtømning. Disse mønstre gælder for alle Node.js-applikationer med køer eller baggrundsbehandling.

## Node.js Produktionsovervågning med PM2 Sundhedstjek {#nodejs-production-monitoring-with-pm2-health-checks}

Vi har forfinet vores Node.js produktionsmiljøopsætning med PM2 gennem mange års produktionserfaring. Vores PM2-sundhedstjek er afgørende for at opretholde pålideligheden i enhver Node.js-applikation.

### Vores PM2-sundhedstjeksystem {#our-pm2-health-check-system}

**Vores kerneimplementering:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Vores Node.js produktionsovervågning med PM2 sundhedstjek inkluderer:

* **Kører hvert 20. minut** via cron-planlægning
* **Kræver mindst 15 minutters oppetid** før en proces betragtes som sund
* **Validerer processtatus og hukommelsesforbrug**
* **Genstarter automatisk mislykkede processer**
* **Forhindrer genstartsløkker** gennem intelligent sundhedskontrol

> \[!CAUTION]
> For bedste praksis for Node.js-produktionsimplementering kræver vi 15+ minutters oppetid, før vi betragter en proces som sund, for at undgå genstartsløkker. Dette forhindrer kaskadefejl, når processer kæmper med hukommelse eller andre problemer.

### Vores PM2-produktionskonfiguration {#our-pm2-production-configuration}

**Opsætning af vores økosystem:** Undersøg vores serverstartfiler for opsætning af Node.js produktionsmiljø:

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-planlægger](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Disse mønstre gælder, uanset om du kører Express-apps, Koa-servere, GraphQL API'er eller andre Node.js-applikationer.

### Automatiseret PM2-implementering {#automated-pm2-deployment}

**PM2-implementering:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Vi automatiserer hele vores PM2-opsætning via Ansible for at sikre ensartede Node.js-produktionsimplementeringer på tværs af alle vores servere.

## System til håndtering og klassificering af produktionsfejl {#production-error-handling-and-classification-system}

En af vores mest værdifulde bedste praksisser for Node.js-produktionsimplementering er intelligent fejlklassificering, der gælder for enhver Node.js-applikation:

### Vores isCodeBug-implementering til produktion {#our-iscodebug-implementation-for-production}

**Kilde:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denne hjælper leverer intelligent fejlklassificering til Node.js-applikationer i produktion for at:

* **Prioriter faktiske fejl** frem for brugerfejl
* **Forbedr vores hændelsesrespons** ved at fokusere på virkelige problemer
* **Reducer alarmtræthed** fra forventede brugerfejl
* **Bedre forståelse** af applikationer versus brugergenererede problemer

Dette mønster fungerer for enhver Node.js-applikation - uanset om du bygger e-handelswebsteder, SaaS-platforme, API'er eller mikrotjenester.

### Integration med vores produktionslogning {#integration-with-our-production-logging}

**Vores loggerintegration:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vores logger bruger `isCodeBug` til at bestemme alarmniveauer og feltredigering, hvilket sikrer, at vi får besked om reelle problemer, samtidig med at vi filtrerer støj fra i vores Node.js-produktionsmiljø.

### Relateret indhold {#related-content-1}

Få mere at vide om vores fejlhåndteringsmønstre:

* [Opbygning af et pålideligt betalingssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Fejlhåndteringsmønstre
* [Beskyttelse af e-mail-privatliv](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Håndtering af sikkerhedsfejl

## Avanceret ydeevnefejlfinding med v8-profiler-next og cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Vi bruger avancerede profileringsværktøjer til at analysere heap-snapshots og fejlfinde OOM (Out of Memory)-problemer, flaskehalse i ydeevnen og Node.js-hukommelsesproblemer i vores produktionsmiljø. Disse værktøjer er essentielle for enhver Node.js-applikation, der oplever hukommelseslækager eller ydeevneproblemer.

### Vores profileringsmetode til Node.js-produktion {#our-profiling-approach-for-nodejs-production}

**Værktøjer vi anbefaler:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Til generering af heap-snapshots og CPU-profiler
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Til analyse af CPU-profiler og heap-snapshots

> \[!TIP]
> Vi bruger v8-profiler-next og cpupro sammen til at skabe en komplet arbejdsgang til fejlfinding af ydeevne for vores Node.js-applikationer. Denne kombination hjælper os med at identificere hukommelseslækager, flaskehalse i ydeevnen og optimere vores produktionskode.

### Sådan implementerer vi Heap Snapshot-analyse {#how-we-implement-heap-snapshot-analysis}

**Vores overvågningsimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Vores produktionsovervågning inkluderer automatisk generering af heap-snapshots, når hukommelsestærskler overskrides. Dette hjælper os med at fejlfinde OOM-problemer, før de forårsager programnedbrud.

**Vigtige implementeringsmønstre:**

* **Automatiske snapshots** når heap-størrelsen overstiger 2 GB-tærsklen
* **Signalbaseret profilering** til on-demand-analyse i produktion
* **Opbevaringspolitikker** til administration af snapshot-lagring
* **Integration med vores oprydningsjob** til automatiseret vedligeholdelse

### Arbejdsgang til fejlfinding af ydeevne {#performance-debugging-workflow}

**Undersøg vores faktiske implementering:**

* [Overvåg serverimplementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap-overvågning og generering af snapshots
* [Oprydningsjob](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Opbevaring og oprydning af snapshots
* [Logger-integration](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Ydelseslogning

### Anbefalet implementering til din Node.js-applikation {#recommended-implementation-for-your-nodejs-application}

**Til heap snapshot-analyse:**

1. **Installer v8-profiler-next** til generering af snapshots
2. Brug cpupro** til at analysere de genererede snapshots
3. Implementer overvågningstærskler** svarende til vores monitor-server.js
4. Opsæt automatisk oprydning** til at administrere snapshot-lagring
5. Opret signalhåndterere** til on-demand profilering i produktion

**Til CPU-profilering:**

1. **Generer CPU-profiler** i perioder med høj belastning
2. **Analyser med cpupro** for at identificere flaskehalse
3. **Fokuser på hot paths** og optimeringsmuligheder
4. **Overvåg før/efter** forbedringer af ydeevne

> \[!WARNING]
> Generering af heap-snapshots og CPU-profiler kan påvirke ydeevnen. Vi anbefaler at implementere throttling og kun aktivere profilering, når specifikke problemer undersøges eller under vedligeholdelsesvinduer.

### Integration med vores produktionsovervågning {#integration-with-our-production-monitoring}

Vores profileringsværktøjer integreres med vores bredere overvågningsstrategi:

* **Automatisk udløsning** baseret på hukommelses-/CPU-tærskler
* **Advarselsintegration** når der registreres ydeevneproblemer
* **Historisk analyse** til at spore ydeevnetendenser over tid
* **Korrelation med applikationsmålinger** til omfattende fejlfinding

Denne tilgang har hjulpet os med at identificere og løse hukommelseslækager, optimere hot code-stier og opretholde stabil ydeevne i vores Node.js-produktionsmiljø.

## Node.js Produktionsinfrastruktursikkerhed {#nodejs-production-infrastructure-security}

Vi implementerer omfattende sikkerhed for vores Node.js produktionsinfrastruktur gennem Ansible-automatisering. Disse fremgangsmåder gælder for alle Node.js-applikationer:

### Systemniveausikkerhed for Node.js-produktion {#system-level-security-for-nodejs-production}

**Vores Ansible-implementering:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Vores vigtigste sikkerhedsforanstaltninger for Node.js produktionsmiljøer:

* **Swap deaktiveret** for at forhindre følsomme data i at blive skrevet til disken
* **Core dumps deaktiveret** for at forhindre hukommelsesdumps, der indeholder følsomme oplysninger
* **USB-lager blokeret** for at forhindre uautoriseret dataadgang
* **Kerneparameterjustering** for både sikkerhed og ydeevne

> \[!WARNING]
> Når du implementerer bedste praksis for Node.js-produktionsimplementering, kan deaktivering af swap forårsage hukommelsesafbrydelser, hvis din applikation overstiger den tilgængelige RAM. Vi overvåger hukommelsesforbruget omhyggeligt og dimensionerer vores servere passende.

### Applikationssikkerhed for Node.js-applikationer {#application-security-for-nodejs-applications}

**Redigering af vores logfelt:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi redigerer følsomme felter fra logfiler, herunder adgangskoder, tokens, API-nøgler og personlige oplysninger. Dette beskytter brugernes privatliv, samtidig med at fejlfindingsfunktionerne opretholdes i ethvert Node.js-produktionsmiljø.

### Infrastruktursikkerhedsautomatisering {#infrastructure-security-automation}

**Vores komplette Ansible-opsætning til Node.js-produktion:**

* [Sikkerhedshåndbog](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Administration af SSH-nøgler](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certifikathåndtering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Vores sikkerhedsindhold {#our-security-content}

Lær mere om vores sikkerhedstilgang:

* [De bedste sikkerhedsrevisionsfirmaer](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe Krypteret E-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Hvorfor e-mailsikkerhed med åben kildekode](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Databasearkitektur til Node.js-applikationer {#database-architecture-for-nodejs-applications}

Vi bruger en hybrid databasetilgang, der er optimeret til vores Node.js-applikationer. Disse mønstre kan tilpasses til enhver Node.js-applikation:

### SQLite-implementering til Node.js-produktion {#sqlite-implementation-for-nodejs-production}

**Hvad vi bruger:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vores konfiguration:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Vi bruger SQLite til brugerspecifikke data i vores Node.js-applikationer, fordi det leverer:

* **Dataisolering** pr. bruger/lejer
* **Bedre ydeevne** for forespørgsler fra én bruger
* **Forenklet backup** og migrering
* **Reduceret kompleksitet** sammenlignet med delte databaser

Dette mønster fungerer godt til SaaS-applikationer, systemer med flere lejere eller enhver Node.js-applikation, der har brug for dataisolering.

### MongoDB-implementering til Node.js-produktion {#mongodb-implementation-for-nodejs-production}

**Hvad vi bruger:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vores opsætningsimplementering:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Vores konfiguration:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Vi bruger MongoDB til applikationsdata i vores Node.js produktionsmiljø, fordi det leverer:

* **Fleksibelt skema** til udviklende datastrukturer
* **Bedre ydeevne** til komplekse forespørgsler
* **Horisontal skalering** muligheder
* **Rigt forespørgselssprog**

> \[!NOTE]
> Vores hybride tilgang optimerer til vores specifikke use case. Undersøg vores faktiske databasebrugsmønstre i kodebasen for at forstå, om denne tilgang passer til dine Node.js-applikationsbehov.

## Node.js Produktionsbaggrundsjobbehandling {#nodejs-production-background-job-processing}

Vi byggede vores baggrundsjobarkitektur omkring Bree for pålidelig Node.js-produktionsimplementering. Dette gælder for alle Node.js-applikationer, der kræver baggrundsbehandling:

### Vores Bree-serveropsætning til produktion {#our-bree-server-setup-for-production}

**Vores primære implementering:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Vores Ansible-implementering:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Eksempler på produktionsjob {#production-job-examples}

**Sundhedsovervågning:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisering af oprydning:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Alle vores job:** [Gennemse vores komplette jobkatalog](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Disse mønstre gælder for enhver Node.js-applikation, der har brug for:

* Planlagte opgaver (databehandling, rapporter, oprydning)
* Baggrundsbehandling (billedstørrelsesændring, afsendelse af e-mails, dataimport)
* Tilstandsovervågning og vedligeholdelse
* Udnyttelse af arbejdstråde til CPU-intensive opgaver

### Vores jobplanlægningsmønstre for Node.js-produktion {#our-job-scheduling-patterns-for-nodejs-production}

Undersøg vores faktiske jobplanlægningsmønstre i vores jobkatalog for at forstå:

* Hvordan vi implementerer cron-lignende planlægning i Node.js-produktion
* Vores fejlhåndtering og gentagelseslogik
* Hvordan vi bruger arbejdstråde til CPU-intensive opgaver

## Automatiseret vedligeholdelse til Node.js-produktionsapplikationer {#automated-maintenance-for-production-nodejs-applications}

Vi implementerer proaktiv vedligeholdelse for at forhindre almindelige Node.js-produktionsproblemer. Disse mønstre gælder for alle Node.js-applikationer:

### Vores oprydningsimplementering {#our-cleanup-implementation}

**Kilde:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Vores automatiserede vedligeholdelse af Node.js produktionsapplikationer har følgende mål:

* **Midlertidige filer** ældre end 24 timer
* **Logfiler** ud over opbevaringsgrænser
* **Cachefiler** og midlertidige data
* **Uploadede filer**, der ikke længere er nødvendige
* **Heap-snapshots** fra performance debugging

Disse mønstre gælder for alle Node.js-applikationer, der genererer midlertidige filer, logfiler eller cachelagrede data.

### Diskpladshåndtering til Node.js-produktion {#disk-space-management-for-nodejs-production}

**Vores overvågningstærskler:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Køgrænser** for baggrundsbehandling
* **Advarselstærskel for 75% diskforbrug**
* **Automatisk oprydning** når tærsklerne overskrides

### Automatisering af infrastrukturvedligeholdelse {#infrastructure-maintenance-automation}

**Vores Ansible-automatisering til Node.js-produktion:**

* [Implementering af miljø](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Administration af implementeringsnøgler](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Implementeringsvejledning til Node.js-produktion {#nodejs-production-deployment-implementation-guide}

### Undersøg vores faktiske kode for bedste praksis i produktionen {#study-our-actual-code-for-production-best-practices}

**Start med disse nøglefiler til opsætning af Node.js produktionsmiljø:**

1. **Konfiguration:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Overvågning:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Fejlhåndtering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logføring:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Procestilstand:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Lær af vores blogindlæg {#learn-from-our-blog-posts}

**Vores tekniske implementeringsvejledninger til Node.js-produktion:**

* [NPM-pakkers økosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Opbygning af betalingssystemer](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementering af e-mail-privatliv](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktformularer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email-integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastrukturautomatisering til Node.js-produktion {#infrastructure-automation-for-nodejs-production}

**Vores Ansible-playbooks til at studere til Node.js-produktionsimplementering:**

* [Komplet katalog over playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sikkerhedshærdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Vores casestudier {#our-case-studies}

**Vores virksomhedsimplementeringer:**

* [Linux Foundation casestudie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu casestudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Videresendelse af e-mails til alumner](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Konklusion: Bedste praksis for Node.js-produktionsimplementering {#conclusion-nodejs-production-deployment-best-practices}

Vores Node.js-produktionsinfrastruktur demonstrerer, at Node.js-applikationer kan opnå pålidelighed i virksomhedsklassen gennem:

* **Beviste hardwarevalg** (AMD Ryzen for 573% single core-ydeevneoptimering)** **Kamptestet Node.js-produktionsovervågning** med specifikke tærskler og automatiserede svar**
* **Smart fejlklassificering** for at forbedre hændelsesrespons i produktionsmiljøer** **Avanceret ydeevnedebugging** med v8-profiler-next og cpupro til OOM-forebyggelse**
* **Omfattende sikkerhedshærdning** gennem Ansible-automatisering**
* **Hybrid databasearkitektur** optimeret til applikationsbehov**
* **Automatiseret vedligeholdelse** for at forhindre almindelige Node.js-produktionsproblemer

**Vigtig konklusion:** Undersøg vores faktiske implementeringsfiler og blogindlæg i stedet for at følge generiske bedste praksisser. Vores kodebase leverer virkelige mønstre til Node.js-produktionsimplementering, der kan tilpasses til enhver Node.js-applikation - webapps, API'er, mikrotjenester eller baggrundstjenester.

## Komplet ressourceliste til Node.js-produktion {#complete-resource-list-for-nodejs-production}

### Vores kerneimplementeringsfiler {#our-core-implementation-files}

* [Hovedkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Pakkeafhængigheder](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverovervågning](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Fejlklassificering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logsystem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2-sundhedstjek](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatiseret oprydning](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Vores serverimplementeringer {#our-server-implementations}

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-planlægger](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Vores infrastrukturautomatisering {#our-infrastructure-automation}

* [Alle vores Ansible-håndbøger](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sikkerhedshærdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databasekonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Vores tekniske blogindlæg {#our-technical-blog-posts}

* [NPM økosystemanalyse](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementering af betalingssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Teknisk vejledning til privatlivsbeskyttelse af e-mails](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktformularer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email-integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guide til selvhostede løsninger](https://forwardemail.net/blog/docs/self-hosted-solution)

### Vores virksomhedscasestudier {#our-enterprise-case-studies}

* [Linux Foundation Implementering](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu casestudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Overholdelse af den føderale regering](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni e-mailsystemer](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)