# Hvordan man optimerer Node.js produktionsinfrastruktur: Bedste praksis {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Vores 573% enkeltkerne performanceoptimeringsrevolution](#our-573-single-core-performance-optimization-revolution)
  * [Hvorfor enkeltkerne performanceoptimering betyder noget for Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Relateret indhold](#related-content)
* [Node.js produktionsmiljø opsætning: Vores teknologistak](#nodejs-production-environment-setup-our-technology-stack)
  * [Pakkestyring: pnpm for produktionseffektivitet](#package-manager-pnpm-for-production-efficiency)
  * [Webframework: Koa for moderne Node.js produktion](#web-framework-koa-for-modern-nodejs-production)
  * [Baggrundsjobbehandling: Bree for produktionspålidelighed](#background-job-processing-bree-for-production-reliability)
  * [Fejlhåndtering: @hapi/boom for produktionspålidelighed](#error-handling-hapiboom-for-production-reliability)
* [Hvordan man overvåger Node.js applikationer i produktion](#how-to-monitor-nodejs-applications-in-production)
  * [Systemniveau Node.js produktionsovervågning](#system-level-nodejs-production-monitoring)
  * [Applikationsniveau overvågning for Node.js produktion](#application-level-monitoring-for-nodejs-production)
  * [Applikationsspecifik overvågning](#application-specific-monitoring)
* [Node.js produktionsovervågning med PM2 helbredstjek](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Vores PM2 helbredstjek system](#our-pm2-health-check-system)
  * [Vores PM2 produktionskonfiguration](#our-pm2-production-configuration)
  * [Automatiseret PM2 deployment](#automated-pm2-deployment)
* [Produktions fejlhåndtering og klassifikationssystem](#production-error-handling-and-classification-system)
  * [Vores isCodeBug implementering til produktion](#our-iscodebug-implementation-for-production)
  * [Integration med vores produktionslogning](#integration-with-our-production-logging)
  * [Relateret indhold](#related-content-1)
* [Avanceret performance debugging med v8-profiler-next og cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Vores profileringstilgang for Node.js produktion](#our-profiling-approach-for-nodejs-production)
  * [Hvordan vi implementerer heap snapshot analyse](#how-we-implement-heap-snapshot-analysis)
  * [Performance debugging workflow](#performance-debugging-workflow)
  * [Anbefalet implementering til din Node.js applikation](#recommended-implementation-for-your-nodejs-application)
  * [Integration med vores produktionsovervågning](#integration-with-our-production-monitoring)
* [Node.js produktionsinfrastruktur sikkerhed](#nodejs-production-infrastructure-security)
  * [Systemniveau sikkerhed for Node.js produktion](#system-level-security-for-nodejs-production)
  * [Applikationssikkerhed for Node.js applikationer](#application-security-for-nodejs-applications)
  * [Infrastruktur sikkerhedsautomatisering](#infrastructure-security-automation)
  * [Vores sikkerhedsindhold](#our-security-content)
* [Databasearkitektur for Node.js applikationer](#database-architecture-for-nodejs-applications)
  * [SQLite implementering til Node.js produktion](#sqlite-implementation-for-nodejs-production)
  * [MongoDB implementering til Node.js produktion](#mongodb-implementation-for-nodejs-production)
* [Node.js produktions baggrundsjobbehandling](#nodejs-production-background-job-processing)
  * [Vores Bree serveropsætning til produktion](#our-bree-server-setup-for-production)
  * [Produktionsjob eksempler](#production-job-examples)
  * [Vores jobplanlægningsmønstre for Node.js produktion](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatiseret vedligeholdelse for produktions Node.js applikationer](#automated-maintenance-for-production-nodejs-applications)
  * [Vores oprydningsimplementering](#our-cleanup-implementation)
  * [Diskpladsstyring for Node.js produktion](#disk-space-management-for-nodejs-production)
  * [Infrastruktur vedligeholdelsesautomatisering](#infrastructure-maintenance-automation)
* [Node.js produktionsdeployments implementeringsguide](#nodejs-production-deployment-implementation-guide)
  * [Studér vores faktiske kode for produktions bedste praksis](#study-our-actual-code-for-production-best-practices)
  * [Lær fra vores blogindlæg](#learn-from-our-blog-posts)
  * [Infrastrukturautomatisering for Node.js produktion](#infrastructure-automation-for-nodejs-production)
  * [Vores casestudier](#our-case-studies)
* [Konklusion: Node.js produktionsdeployments bedste praksis](#conclusion-nodejs-production-deployment-best-practices)
* [Komplet ressource liste for Node.js produktion](#complete-resource-list-for-nodejs-production)
  * [Vores kerneimplementeringsfiler](#our-core-implementation-files)
  * [Vores serverimplementeringer](#our-server-implementations)
  * [Vores infrastrukturautomatisering](#our-infrastructure-automation)
  * [Vores tekniske blogindlæg](#our-technical-blog-posts)
  * [Vores enterprise casestudier](#our-enterprise-case-studies)
## Forord {#foreword}

Hos Forward Email har vi brugt år på at perfektionere vores Node.js produktionsmiljøopsætning. Denne omfattende guide deler vores gennemprøvede bedste praksis for Node.js produktionsudrulning med fokus på performanceoptimering, overvågning og de erfaringer, vi har gjort os ved at skalere Node.js-applikationer til at håndtere millioner af daglige transaktioner.


## Vores 573% Single Core Performance Optimeringsrevolution {#our-573-single-core-performance-optimization-revolution}

Da vi migrerede fra Intel til AMD Ryzen-processorer, opnåede vi en **573% performanceforbedring** i vores Node.js-applikationer. Dette var ikke bare en mindre optimering – det ændrede fundamentalt, hvordan vores Node.js-applikationer præsterer i produktion og demonstrerer vigtigheden af single core performanceoptimering for enhver Node.js-applikation.

> \[!TIP]
> For bedste praksis ved Node.js produktionsudrulning er hardwarevalg afgørende. Vi valgte specifikt DataPacket hosting for deres AMD Ryzen-tilgængelighed, fordi single-core performance er kritisk for Node.js-applikationer, da JavaScript-eksekvering er single-threaded.

### Hvorfor Single Core Performanceoptimering er Vigtigt for Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Vores migration fra Intel til AMD Ryzen resulterede i:

* **573% performanceforbedring** i forespørgselsbehandling (dokumenteret i [vores statuspages GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminering af behandlingsforsinkelser** til næsten øjeblikkelige svar (nævnt i [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Bedre pris-til-performance-forhold** for Node.js produktionsmiljøer
* **Forbedrede svartider** på tværs af alle vores applikationsendpoints

Performanceforbedringen var så betydelig, at vi nu betragter AMD Ryzen-processorer som essentielle for enhver seriøs Node.js produktionsudrulning, uanset om du kører webapplikationer, API’er, mikrotjenester eller andre Node.js workloads.

### Relateret Indhold {#related-content}

For flere detaljer om vores infrastrukturvalg, se:

* [Bedste Email Forwarding Service](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Performance sammenligninger
* [Selvhostet Løsning](https://forwardemail.net/blog/docs/self-hosted-solution) - Hardwareanbefalinger


## Node.js Produktionsmiljøopsætning: Vores Teknologistak {#nodejs-production-environment-setup-our-technology-stack}

Vores bedste praksis for Node.js produktionsudrulning inkluderer bevidste teknologivalg baseret på års produktionserfaring. Her er hvad vi bruger, og hvorfor disse valg gælder for enhver Node.js-applikation:

### Pakkehåndtering: pnpm for Produktions-effektivitet {#package-manager-pnpm-for-production-efficiency}

**Hvad vi bruger:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (fastlåst version)

Vi valgte pnpm fremfor npm og yarn til vores Node.js produktionsmiljøopsætning fordi:

* **Hurtigere installationstider** i CI/CD pipelines
* **Diskplads-effektivitet** gennem hard linking
* **Streng afhængighedsløsning** der forhindrer spøgelsesafhængigheder
* **Bedre performance** i produktionsudrulninger

> \[!NOTE]
> Som en del af vores bedste praksis for Node.js produktionsudrulning fastlåser vi præcise versioner af kritiske værktøjer som pnpm for at sikre konsistent adfærd på tværs af alle miljøer og teammedlemmers maskiner.

**Implementeringsdetaljer:**

* [Vores package.json konfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Vores NPM-økosystem blogindlæg](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Framework: Koa til Moderne Node.js Produktion {#web-framework-koa-for-modern-nodejs-production}

**Hvad vi bruger:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Vi valgte Koa frem for Express til vores Node.js produktionsinfrastruktur på grund af dets moderne async/await-understøttelse og renere middleware-sammensætning. Vores grundlægger Nick Baugh har bidraget til både Express og Koa, hvilket giver os dyb indsigt i begge frameworks til produktionsbrug.

Disse mønstre gælder, uanset om du bygger REST API'er, GraphQL-servere, webapplikationer eller mikrotjenester.

**Vores implementeringseksempler:**

* [Opsætning af webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Konfiguration af API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guide til implementering af kontaktformularer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Baggrundsjobbehandling: Bree for produktionspålidelighed {#background-job-processing-bree-for-production-reliability}

**Hvad vi bruger:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) scheduler

Vi skabte og vedligeholder Bree, fordi eksisterende jobplanlæggere ikke opfyldte vores behov for understøttelse af worker threads og moderne JavaScript-funktioner i produktionsmiljøer for Node.js. Dette gælder for enhver Node.js-applikation, der har brug for baggrundsbehandling, planlagte opgaver eller worker threads.

**Vores implementeringseksempler:**

* [Opsætning af Bree-server](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Alle vores jobdefinitioner](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 sundhedstjek-job](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementering af oprydningsjob](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Fejlhåndtering: @hapi/boom for produktionspålidelighed {#error-handling-hapiboom-for-production-reliability}

**Hvad vi bruger:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi bruger @hapi/boom til strukturerede fejlsvar i hele vores Node.js produktionsapplikationer. Dette mønster fungerer for enhver Node.js-applikation, der har brug for konsekvent fejlhåndtering.

**Vores implementeringseksempler:**

* [Fejlkategoriseringshjælper](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger-implementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Hvordan man overvåger Node.js-applikationer i produktion {#how-to-monitor-nodejs-applications-in-production}

Vores tilgang til overvågning af Node.js-applikationer i produktion er udviklet gennem mange års drift af applikationer i stor skala. Vi implementerer overvågning på flere lag for at sikre pålidelighed og ydeevne for enhver type Node.js-applikation.

### Systemniveau Node.js produktionsovervågning {#system-level-nodejs-production-monitoring}

**Vores kerneimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Hvad vi bruger:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vores produktionsovervågningsgrænser (fra vores faktiske produktionskode):

* **2GB heap-størrelsesgrænse** med automatiske alarmer
* **25% hukommelsesforbrug** advarselsgrænse
* **80% CPU-forbrug** alarmgrænse
* **75% diskforbrug** advarselsgrænse

> \[!WARNING]
> Disse grænser fungerer for vores specifikke hardwarekonfiguration. Når du implementerer Node.js produktionsovervågning, gennemgå vores monitor-server.js-implementering for at forstå den præcise logik og tilpas værdierne til dit setup.

### Applikationsniveau overvågning for Node.js produktion {#application-level-monitoring-for-nodejs-production}

**Vores fejlkategorisering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denne hjælper skelner mellem:

* **Faktiske kodefejl**, der kræver øjeblikkelig opmærksomhed
* **Brugerfejl**, som er forventet adfærd
* **Eksterne servicefejl**, som vi ikke kan kontrollere

Dette mønster gælder for enhver Node.js-applikation - webapps, API'er, mikrotjenester eller baggrundstjenester.
**Vores logningsimplementering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi implementerer omfattende feltudviskning for at beskytte følsomme oplysninger samtidig med, at vi opretholder nyttige fejlsøgningsmuligheder i vores Node.js produktionsmiljø.

### Applikationsspecifik overvågning {#application-specific-monitoring}

**Vores serverimplementeringer:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Køovervågning:** Vi implementerer 5GB køgrænser og 180 sekunders timeout for behandlingen af forespørgsler for at forhindre ressourceudtømning. Disse mønstre gælder for enhver Node.js-applikation med køer eller baggrundsbehandling.


## Node.js produktionsovervågning med PM2 sundhedstjek {#nodejs-production-monitoring-with-pm2-health-checks}

Vi har forfinet vores Node.js produktionsmiljøopsætning med PM2 gennem års produktionserfaring. Vores PM2 sundhedstjek er essentielle for at opretholde pålidelighed i enhver Node.js-applikation.

### Vores PM2 sundhedstjeksystem {#our-pm2-health-check-system}

**Vores kerneimplementering:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Vores Node.js produktionsovervågning med PM2 sundhedstjek inkluderer:

* **Kører hvert 20. minut** via cron-planlægning
* **Kræver minimum 15 minutters oppetid** før en proces betragtes som sund
* **Validerer processtatus og hukommelsesforbrug**
* **Genstarter automatisk fejlede processer**
* **Forhindrer genstartsløkker** gennem intelligent sundhedstjek

> \[!CAUTION]
> For bedste praksis ved Node.js produktionsudrulning kræver vi 15+ minutters oppetid før en proces betragtes som sund for at undgå genstartsløkker. Dette forhindrer kaskadefejl, når processer kæmper med hukommelse eller andre problemer.

### Vores PM2 produktionskonfiguration {#our-pm2-production-configuration}

**Vores økosystemopsætning:** Studér vores serverstartfiler for Node.js produktionsmiljøopsætning:

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Disse mønstre gælder, uanset om du kører Express-apps, Koa-servere, GraphQL-API’er eller andre Node.js-applikationer.

### Automatiseret PM2-udrulning {#automated-pm2-deployment}

**PM2-udrulning:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Vi automatiserer hele vores PM2-opsætning gennem Ansible for at sikre konsistente Node.js produktionsudrulninger på alle vores servere.


## Produktionsfejlhåndtering og klassifikationssystem {#production-error-handling-and-classification-system}

En af vores mest værdifulde bedste praksisser for Node.js produktionsudrulning er intelligent fejlkategorisering, der gælder for enhver Node.js-applikation:

### Vores isCodeBug-implementering til produktion {#our-iscodebug-implementation-for-production}

**Kilde:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denne hjælper leverer intelligent fejlkategorisering for Node.js-applikationer i produktion til at:

* **Prioritere faktiske fejl** frem for brugerfejl
* **Forbedre vores hændelsesrespons** ved at fokusere på reelle problemer
* **Reducere alarmtræthed** fra forventede brugerfejl
* **Forstå bedre** applikations- vs. bruger-genererede problemer

Dette mønster fungerer for enhver Node.js-applikation – uanset om du bygger e-handelsites, SaaS-platforme, API’er eller mikrotjenester.

### Integration med vores produktionslogning {#integration-with-our-production-logging}

**Vores loggerintegration:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Vores logger bruger `isCodeBug` til at bestemme alarmniveauer og feltredigering, hvilket sikrer, at vi bliver underrettet om reelle problemer, samtidig med at vi filtrerer støj i vores Node.js produktionsmiljø.

### Relateret indhold {#related-content-1}

Lær mere om vores fejlbehandlingsmønstre:

* [Opbygning af pålideligt betalingssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Fejlbehandlingsmønstre
* [E-mail privatlivsbeskyttelse](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Sikkerhedsfejlbehandling


## Avanceret ydelsesdebugging med v8-profiler-next og cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Vi bruger avancerede profileringsværktøjer til at analysere heap-øjebliksbilleder og debugge OOM (Out of Memory) problemer, ydelsesflaskehalse og Node.js hukommelsesproblemer i vores produktionsmiljø. Disse værktøjer er essentielle for enhver Node.js-applikation, der oplever hukommelseslækager eller ydelsesproblemer.

### Vores profileringsmetode for Node.js produktion {#our-profiling-approach-for-nodejs-production}

**Værktøjer vi anbefaler:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Til generering af heap-øjebliksbilleder og CPU-profiler
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Til analyse af CPU-profiler og heap-øjebliksbilleder

> \[!TIP]
> Vi bruger v8-profiler-next og cpupro sammen for at skabe en komplet ydelsesdebugging-arbejdsgang for vores Node.js-applikationer. Denne kombination hjælper os med at identificere hukommelseslækager, ydelsesflaskehalse og optimere vores produktionskode.

### Hvordan vi implementerer heap-øjebliksbilledanalyse {#how-we-implement-heap-snapshot-analysis}

**Vores overvågningsimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Vores produktionsovervågning inkluderer automatisk generering af heap-øjebliksbilleder, når hukommelsestærskler overskrides. Dette hjælper os med at debugge OOM-problemer, før de forårsager applikationsnedbrud.

**Nøgleimplementeringsmønstre:**

* **Automatiske øjebliksbilleder** når heap-størrelsen overskrider 2GB tærsklen
* **Signalbaseret profilering** til analyse efter behov i produktion
* **Bevaringspolitikker** til håndtering af øjebliksbilledlagring
* **Integration med vores oprydningsjobs** til automatiseret vedligeholdelse

### Ydelsesdebugging-arbejdsgang {#performance-debugging-workflow}

**Studér vores faktiske implementering:**

* [Monitor server-implementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap-overvågning og øjebliksbilledgenerering
* [Oprydningsjob](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Bevaring og oprydning af øjebliksbilleder
* [Logger-integration](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Ydelseslogning

### Anbefalet implementering til din Node.js-applikation {#recommended-implementation-for-your-nodejs-application}

**Til heap-øjebliksbilledanalyse:**

1. **Installer v8-profiler-next** til øjebliksbilledgenerering
2. **Brug cpupro** til at analysere de genererede øjebliksbilleder
3. **Implementer overvågningstærskler** svarende til vores monitor-server.js
4. **Opsæt automatiseret oprydning** til håndtering af øjebliksbilledlagring
5. **Opret signalhåndterere** til profilering efter behov i produktion

**Til CPU-profilering:**

1. **Generer CPU-profiler** under perioder med høj belastning
2. **Analyser med cpupro** for at identificere flaskehalse
3. **Fokuser på varme spor** og optimeringsmuligheder
4. **Overvåg før/efter** ydelsesforbedringer

> \[!WARNING]
> Generering af heap-øjebliksbilleder og CPU-profiler kan påvirke ydelsen. Vi anbefaler at implementere throttling og kun aktivere profilering, når der undersøges specifikke problemer eller under vedligeholdelsesvinduer.

### Integration med vores produktionsovervågning {#integration-with-our-production-monitoring}

Vores profileringsværktøjer integreres med vores bredere overvågningsstrategi:

* **Automatisk udløsning** baseret på hukommelses-/CPU-tærskler
* **Alarmintegration** når ydelsesproblemer opdages
* **Historisk analyse** til at spore ydelsestrends over tid
* **Korrelationsanalyse med applikationsmålinger** for omfattende debugging
Denne tilgang har hjulpet os med at identificere og løse hukommelseslækager, optimere varme kodeveje og opretholde stabil ydeevne i vores Node.js produktionsmiljø.


## Node.js Produktionsinfrastruktur Sikkerhed {#nodejs-production-infrastructure-security}

Vi implementerer omfattende sikkerhed for vores Node.js produktionsinfrastruktur gennem Ansible-automatisering. Disse praksisser gælder for enhver Node.js-applikation:

### Systemniveau Sikkerhed for Node.js Produktion {#system-level-security-for-nodejs-production}

**Vores Ansible-implementering:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Vores nøglesikkerhedsforanstaltninger for Node.js produktionsmiljøer:

* **Swap deaktiveret** for at forhindre, at følsomme data skrives til disk
* **Core dumps deaktiveret** for at forhindre hukommelsesdump med følsomme oplysninger
* **USB-lager blokeret** for at forhindre uautoriseret dataadgang
* **Kernel parameter tuning** for både sikkerhed og ydeevne

> \[!WARNING]
> Når man implementerer bedste praksis for Node.js produktionsudrulning, kan deaktivering af swap forårsage out-of-memory kills, hvis din applikation overskrider tilgængeligt RAM. Vi overvåger hukommelsesforbruget nøje og dimensionerer vores servere passende.

### Applikationssikkerhed for Node.js Applikationer {#application-security-for-nodejs-applications}

**Vores logfelt-redigering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi redigerer følsomme felter fra logs, herunder adgangskoder, tokens, API-nøgler og personlige oplysninger. Dette beskytter brugerens privatliv samtidig med, at det opretholder fejlfindingsevner i ethvert Node.js produktionsmiljø.

### Infrastruktur Sikkerhedsautomatisering {#infrastructure-security-automation}

**Vores komplette Ansible-opsætning til Node.js produktion:**

* [Sikkerheds playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH nøglehåndtering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certifikathåndtering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Vores Sikkerhedsindhold {#our-security-content}

Lær mere om vores sikkerhedstilgang:

* [Bedste Sikkerhedsrevisionsfirmaer](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe Krypteret Email](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Hvorfor Open Source Email Sikkerhed](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Databasearkitektur for Node.js Applikationer {#database-architecture-for-nodejs-applications}

Vi bruger en hybrid database tilgang optimeret til vores Node.js applikationer. Disse mønstre kan tilpasses enhver Node.js applikation:

### SQLite Implementering for Node.js Produktion {#sqlite-implementation-for-nodejs-production}

**Hvad vi bruger:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vores konfiguration:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Vi bruger SQLite til brugerspecifikke data i vores Node.js applikationer, fordi det giver:

* **Dataisolering** pr. bruger/lejer
* **Bedre ydeevne** for enkeltbrugerforespørgsler
* **Forenklet backup** og migration
* **Reduceret kompleksitet** sammenlignet med delte databaser

Dette mønster fungerer godt for SaaS-applikationer, multi-lejer systemer eller enhver Node.js applikation, der har brug for dataisolering.

### MongoDB Implementering for Node.js Produktion {#mongodb-implementation-for-nodejs-production}

**Hvad vi bruger:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Vores opsætningsimplementering:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Vores konfiguration:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Vi bruger MongoDB til applikationsdata i vores Node.js produktionsmiljø, fordi det tilbyder:

* **Fleksibelt skema** til udviklende datastrukturer
* **Bedre ydeevne** for komplekse forespørgsler
* **Horisontal skalering** kapaciteter
* **Rigt forespørgselssprog**

> \[!NOTE]
> Vores hybride tilgang optimerer til vores specifikke brugssag. Studér vores faktiske databasebrugsmønstre i kodebasen for at forstå, om denne tilgang passer til dine Node.js applikationsbehov.


## Node.js Produktions Baggrundsjobbehandling {#nodejs-production-background-job-processing}

Vi byggede vores baggrundsjobarkitektur omkring Bree for pålidelig Node.js produktionsudrulning. Dette gælder for enhver Node.js applikation, der har brug for baggrundsbehandling:

### Vores Bree Serveropsætning til Produktion {#our-bree-server-setup-for-production}

**Vores hovedimplementering:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Vores Ansible-udrulning:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Produktionsjob Eksempler {#production-job-examples}

**Sundhedsovervågning:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Rydningsautomatisering:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Alle vores jobs:** [Gennemse vores komplette jobmappe](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Disse mønstre gælder for enhver Node.js applikation, der har brug for:

* Planlagte opgaver (databehandling, rapporter, oprydning)
* Baggrundsbehandling (billedændring, e-mail afsendelse, dataimporter)
* Sundhedsovervågning og vedligeholdelse
* Udnyttelse af worker threads til CPU-intensive opgaver

### Vores Jobplanlægningsmønstre til Node.js Produktion {#our-job-scheduling-patterns-for-nodejs-production}

Studér vores faktiske jobplanlægningsmønstre i vores jobmappe for at forstå:

* Hvordan vi implementerer cron-lignende planlægning i Node.js produktion
* Vores fejlhåndtering og genforsøgslogik
* Hvordan vi bruger worker threads til CPU-intensive opgaver


## Automatiseret Vedligeholdelse for Produktions-Node.js Applikationer {#automated-maintenance-for-production-nodejs-applications}

Vi implementerer proaktiv vedligeholdelse for at forhindre almindelige Node.js produktionsproblemer. Disse mønstre gælder for enhver Node.js applikation:

### Vores Rydningsimplementering {#our-cleanup-implementation}

**Kilde:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Vores automatiserede vedligeholdelse for Node.js produktionsapplikationer retter sig mod:

* **Midlertidige filer** ældre end 24 timer
* **Logfiler** ud over opbevaringsgrænser
* **Cachefiler** og midlertidige data
* **Uploadede filer**, der ikke længere er nødvendige
* **Heap snapshots** fra ydelsesdebugging

Disse mønstre gælder for enhver Node.js applikation, der genererer midlertidige filer, logs eller cachede data.

### Diskpladsstyring for Node.js Produktion {#disk-space-management-for-nodejs-production}

**Vores overvågningsgrænser:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Køgrænser** for baggrundsbehandling
* **75% diskforbrug** advarselsgrænse
* **Automatisk oprydning** når grænser overskrides

### Infrastruktur Vedligeholdelsesautomatisering {#infrastructure-maintenance-automation}

**Vores Ansible-automatisering for Node.js produktion:**

* [Miljøudrulning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Håndtering af udrulningsnøgler](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js Produktionsudrulnings Implementeringsguide {#nodejs-production-deployment-implementation-guide}
### Studér Vores Faktiske Kode for Bedste Praksis i Produktion {#study-our-actual-code-for-production-best-practices}

**Start med disse nøglefiler til opsætning af Node.js produktionsmiljø:**

1. **Konfiguration:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Overvågning:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Fejlhåndtering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logning:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Proces sundhed:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Lær fra Vores Blogindlæg {#learn-from-our-blog-posts}

**Vores tekniske implementeringsvejledninger til Node.js produktion:**

* [NPM Pakkeøkosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Opbygning af Betalingssystemer](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementering af Email Privatliv](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript Kontaktformularer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email Integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastrukturautomatisering til Node.js Produktion {#infrastructure-automation-for-nodejs-production}

**Vores Ansible playbooks til studie for Node.js produktionsudrulning:**

* [Komplet playbooks bibliotek](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sikkerhedshærdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Vores Case Studier {#our-case-studies}

**Vores virksomhedsimplementeringer:**

* [Linux Foundation Case Studie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Case Studie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumni Email Videresendelse](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Konklusion: Bedste Praksis for Node.js Produktionsudrulning {#conclusion-nodejs-production-deployment-best-practices}

Vores Node.js produktionsinfrastruktur demonstrerer, at Node.js applikationer kan opnå enterprise-grade pålidelighed gennem:

* **Beviste hardwarevalg** (AMD Ryzen for 573% optimering af enkelt kerne ydeevne)
* **Afprøvet Node.js produktionsovervågning** med specifikke tærskler og automatiserede reaktioner
* **Smart fejlkategorisering** for at forbedre hændelsesrespons i produktionsmiljøer
* **Avanceret ydelsesdebugging** med v8-profiler-next og cpupro for forebyggelse af OOM
* **Omfattende sikkerhedshærdning** gennem Ansible automatisering
* **Hybrid databasearkitektur** optimeret til applikationsbehov
* **Automatiseret vedligeholdelse** for at forhindre almindelige Node.js produktionsproblemer

**Vigtig pointe:** Studér vores faktiske implementeringsfiler og blogindlæg i stedet for at følge generiske bedste praksisser. Vores kodebase giver virkelighedsnære mønstre for Node.js produktionsudrulning, som kan tilpasses enhver Node.js applikation - webapps, API'er, mikrotjenester eller baggrundstjenester.


## Komplet Ressourceliste for Node.js Produktion {#complete-resource-list-for-nodejs-production}

### Vores Kerne Implementeringsfiler {#our-core-implementation-files}

* [Hovedkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Pakkeafhængigheder](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverovervågning](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Fejlkategorisering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logningssystem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 sundhedstjek](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatiseret oprydning](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Vores Server Implementeringer {#our-server-implementations}

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Vores Infrastruktur Automatisering {#our-infrastructure-automation}

* [Alle vores Ansible playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sikkerhedshærdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js opsætning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databasekonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Vores Tekniske Blogindlæg {#our-technical-blog-posts}

* [NPM Økosystem Analyse](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Betalingssystem Implementering](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Email Privatliv Teknisk Guide](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript Kontaktformularer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email Integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Selvhostet Løsningsguide](https://forwardemail.net/blog/docs/self-hosted-solution)

### Vores Enterprise Case Studier {#our-enterprise-case-studies}

* [Linux Foundation Implementering](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Case Studie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Føderal Regerings Overholdelse](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni Email Systemer](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
