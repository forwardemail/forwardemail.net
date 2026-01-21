# Hur man optimerar Node.js produktionsinfrastruktur: Bästa praxis {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Vår 573% Single Core-prestandaoptimeringsrevolution](#our-573-single-core-performance-optimization-revolution)
  * [Varför prestandaoptimering med en enda kärna är viktig för Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Relaterat innehåll](#related-content)
* [Installation av Node.js produktionsmiljö: Vår teknikstack](#nodejs-production-environment-setup-our-technology-stack)
  * [Pakethanterare: pnpm för produktionseffektivitet](#package-manager-pnpm-for-production-efficiency)
  * [Webbramverk: Koa för modern Node.js-produktion](#web-framework-koa-for-modern-nodejs-production)
  * [Bakgrundsjobbbearbetning: Bree för produktionstillförlitlighet](#background-job-processing-bree-for-production-reliability)
  * [Felhantering: @hapi/boom för produktionstillförlitlighet](#error-handling-hapiboom-for-production-reliability)
* [Hur man övervakar Node.js-applikationer i produktion](#how-to-monitor-nodejs-applications-in-production)
  * [Produktionsövervakning på systemnivå i Node.js](#system-level-nodejs-production-monitoring)
  * [Övervakning på applikationsnivå för Node.js-produktion](#application-level-monitoring-for-nodejs-production)
  * [Applikationsspecifik övervakning](#application-specific-monitoring)
* [Node.js produktionsövervakning med PM2 hälsokontroller](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Vårt PM2-hälsokontrollsystem](#our-pm2-health-check-system)
  * [Vår PM2-produktionskonfiguration](#our-pm2-production-configuration)
  * [Automatiserad PM2-distribution](#automated-pm2-deployment)
* [System för hantering och klassificering av produktionsfel](#production-error-handling-and-classification-system)
  * [Vår isCodeBug-implementering för produktion](#our-iscodebug-implementation-for-production)
  * [Integration med vår produktionsloggning](#integration-with-our-production-logging)
  * [Relaterat innehåll](#related-content-1)
* [Avancerad prestandafelsökning med v8-profiler-next och cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Vår profileringsmetod för Node.js-produktion](#our-profiling-approach-for-nodejs-production)
  * [Hur vi implementerar Heap Snapshot-analys](#how-we-implement-heap-snapshot-analysis)
  * [Arbetsflöde för prestandafelsökning](#performance-debugging-workflow)
  * [Rekommenderad implementering för din Node.js-applikation](#recommended-implementation-for-your-nodejs-application)
  * [Integration med vår produktionsövervakning](#integration-with-our-production-monitoring)
* [Node.js produktionsinfrastruktursäkerhet](#nodejs-production-infrastructure-security)
  * [Systemnivåsäkerhet för Node.js-produktion](#system-level-security-for-nodejs-production)
  * [Applikationssäkerhet för Node.js-applikationer](#application-security-for-nodejs-applications)
  * [Automatisering av infrastruktursäkerhet](#infrastructure-security-automation)
  * [Vårt säkerhetsinnehåll](#our-security-content)
* [Databasarkitektur för Node.js-applikationer](#database-architecture-for-nodejs-applications)
  * [SQLite-implementering för Node.js-produktion](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-implementering för Node.js-produktion](#mongodb-implementation-for-nodejs-production)
* [Bearbetning av Node.js-produktionsbakgrundsjobb](#nodejs-production-background-job-processing)
  * [Vår Bree-serveruppsättning för produktion](#our-bree-server-setup-for-production)
  * [Exempel på produktionsjobb](#production-job-examples)
  * [Våra schemaläggningsmönster för Node.js-produktion](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatiserat underhåll för Node.js-produktionsapplikationer](#automated-maintenance-for-production-nodejs-applications)
  * [Vår implementering av städning](#our-cleanup-implementation)
  * [Diskutrymmeshantering för Node.js-produktion](#disk-space-management-for-nodejs-production)
  * [Automatisering av infrastrukturunderhåll](#infrastructure-maintenance-automation)
* [Implementeringsguide för Node.js produktionsdistribution](#nodejs-production-deployment-implementation-guide)
  * [Studera vår faktiska kod för bästa praxis inom produktion](#study-our-actual-code-for-production-best-practices)
  * [Lär dig av våra blogginlägg](#learn-from-our-blog-posts)
  * [Infrastrukturautomation för Node.js-produktion](#infrastructure-automation-for-nodejs-production)
  * [Våra fallstudier](#our-case-studies)
* [Slutsats: Bästa praxis för Node.js produktionsdistribution](#conclusion-nodejs-production-deployment-best-practices)
* [Komplett resurslista för Node.js-produktion](#complete-resource-list-for-nodejs-production)
  * [Våra kärnimplementeringsfiler](#our-core-implementation-files)
  * [Våra serverimplementeringar](#our-server-implementations)
  * [Vår infrastrukturautomation](#our-infrastructure-automation)
  * [Våra tekniska blogginlägg](#our-technical-blog-posts)
  * [Våra fallstudier för företag](#our-enterprise-case-studies)

## Förord {#foreword}

På Forward Email har vi ägnat år åt att finslipa vår Node.js-produktionsmiljö. Den här omfattande guiden delar med sig av våra välbeprövade bästa praxis för Node.js-produktion, med fokus på prestandaoptimering, övervakning och de lärdomar vi har dragit av att skala Node.js-applikationer för att hantera miljontals dagliga transaktioner.

## Vår 573% Single Core-prestandaoptimeringsrevolution {#our-573-single-core-performance-optimization-revolution}

När vi migrerade från Intel- till AMD Ryzen-processorer uppnådde vi en prestandaförbättring på **573 %** i våra Node.js-applikationer. Detta var inte bara en mindre optimering – det förändrade fundamentalt hur våra Node.js-applikationer presterar i produktion och visar vikten av prestandaoptimering med en enda kärna för alla Node.js-applikationer.

> \[!TIP]
> För bästa praxis för Node.js-produktionsdistribution är val av hårdvara avgörande. Vi valde specifikt DataPacket-hosting på grund av deras AMD Ryzen-tillgänglighet eftersom prestanda med en enda kärna är avgörande för Node.js-applikationer eftersom JavaScript-körning är enkeltrådad.

### Varför prestandaoptimering med en enda kärna är viktig för Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Vår migrering från Intel till AMD Ryzen resulterade i:

* **573 % prestandaförbättring** i förfrågningsbehandling (dokumenterad i [vår statussidas GitHub-problem #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminerade bearbetningsfördröjningar** till nästan omedelbara svar (nämns i [GitHub-problem #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Bättre pris-prestanda-förhållande** för Node.js-produktionsmiljöer
* **Förbättrade svarstider** för alla våra applikationsslutpunkter

Prestandaökningen var så betydande att vi nu anser att AMD Ryzen-processorer är viktiga för alla seriösa Node.js-produktionsdistributioner, oavsett om du kör webbapplikationer, API:er, mikrotjänster eller någon annan Node.js-arbetsbelastning.

### Relaterat innehåll {#related-content}

För mer information om våra infrastrukturval, kolla in:

* [Bästa e-postvidarebefordringstjänsten](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Prestandajämförelser
* [Självhostad lösning](https://forwardemail.net/blog/docs/self-hosted-solution) - Maskinvarurekommendationer

## Installation av Node.js produktionsmiljö: Vår teknikstack {#nodejs-production-environment-setup-our-technology-stack}

Våra bästa praxis för Node.js-produktionsdistribution inkluderar medvetna teknikval baserade på många års produktionserfarenhet. Här är vad vi använder och varför dessa val gäller för alla Node.js-applikationer:

### Pakethanterare: pnpm för produktionseffektivitet {#package-manager-pnpm-for-production-efficiency}

**Vad vi använder:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (fäst version)

Vi valde pnpm framför npm och yarn för vår Node.js produktionsmiljö eftersom:

* **Snabbare installationstider** i CI/CD-pipelines
* **Effektiv diskutrymmeshantering** genom hård länkning
* **Strikt beroendehantering** som förhindrar fantomberoenden
* **Bättre prestanda** i produktionsdistributioner

> \[!NOTE]
> Som en del av våra bästa praxis för Node.js-produktionsdistribution fäster vi exakta versioner av kritiska verktyg som pnpm för att säkerställa konsekvent beteende i alla miljöer och teammedlemmarnas maskiner.

**Implementeringsdetaljer:**

* [Vår package.json-konfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Vårt blogginlägg om NPM-ekosystemet](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webbramverk: Koa för modern Node.js-produktion {#web-framework-koa-for-modern-nodejs-production}

**Vad vi använder:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi valde Koa framför Express för vår Node.js produktionsinfrastruktur på grund av dess moderna async/await-stöd och renare middleware-komposition. Vår grundare Nick Baugh bidrog till både Express och Koa, vilket gav oss djupgående insikter i båda ramverken för produktionsanvändning.

Dessa mönster gäller oavsett om du bygger REST API:er, GraphQL-servrar, webbapplikationer eller mikrotjänster.

**Våra implementeringsexempel:**

* [Installation av webbserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-serverkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Implementeringsguide för kontaktformulär](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Bakgrundsjobbbearbetning: Bree för produktionstillförlitlighet {#background-job-processing-bree-for-production-reliability}

**Vad vi använder:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) schemaläggare

Vi skapade och underhåller Bree eftersom befintliga jobbschemaläggare inte uppfyllde våra behov av stöd för arbetstrådar och moderna JavaScript-funktioner i Node.js-produktionsmiljöer. Detta gäller alla Node.js-applikationer som behöver bakgrundsbearbetning, schemalagda uppgifter eller arbetstrådar.

**Våra implementeringsexempel:**

* [Bree-serverinstallation](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Alla våra jobbdefinitioner](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 hälsokontrolljobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementering av rensningsjobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Felhantering: @hapi/boom för produktionstillförlitlighet {#error-handling-hapiboom-for-production-reliability}

**Vad vi använder:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi använder @hapi/boom för strukturerade felsvar i alla Node.js-produktionsapplikationer. Det här mönstret fungerar för alla Node.js-applikationer som behöver konsekvent felhantering.

**Våra implementeringsexempel:**

* [Hjälp för felklassificering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger-implementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Så här övervakar du Node.js-applikationer i produktion {#how-to-monitor-nodejs-applications-in-production}

Vår metod för att övervaka Node.js-applikationer i produktion har utvecklats genom åratal av att köra applikationer i stor skala. Vi implementerar övervakning på flera lager för att säkerställa tillförlitlighet och prestanda för alla typer av Node.js-applikationer.

### Produktionsövervakning på systemnivå för Node.js {#system-level-nodejs-production-monitoring}

**Vår kärnimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Vad vi använder:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Våra tröskelvärden för produktionsövervakning (från vår faktiska produktionskod):

* **2 GB heapstorleksgräns** med automatiska varningar
* **25 % minnesanvändning** varningströskel
* **80 % CPU-användning** varningströskel
* **75 % diskanvändning** varningströskel

> \[!WARNING]
> Dessa tröskelvärden fungerar för vår specifika hårdvarukonfiguration. När du implementerar Node.js produktionsövervakning, granska vår monitor-server.js-implementering för att förstå den exakta logiken och anpassa värdena för din installation.

### Övervakning på applikationsnivå för Node.js-produktion {#application-level-monitoring-for-nodejs-production}

**Vår felklassificering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denna hjälpmedel skiljer mellan:

* **Faktiska kodfel** som kräver omedelbar uppmärksamhet
* **Användarfel** som är förväntat beteende
* **Externa tjänstfel** som vi inte kan kontrollera

Det här mönstret gäller för alla Node.js-applikationer – webbappar, API:er, mikrotjänster eller bakgrundstjänster.

**Vår loggningsimplementering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi implementerar omfattande fältborttagning för att skydda känslig information samtidigt som vi bibehåller användbara felsökningsfunktioner i vår Node.js-produktionsmiljö.

### Applikationsspecifik övervakning {#application-specific-monitoring}

**Våra serverimplementeringar:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Köövervakning:** Vi implementerar kögränser på 5 GB och 180 sekunders timeout för förfrågningsbehandling för att förhindra resursutmattning. Dessa mönster gäller för alla Node.js-applikationer med köer eller bakgrundsbearbetning.

## Node.js Produktionsövervakning med PM2 Hälsokontroller {#nodejs-production-monitoring-with-pm2-health-checks}

Vi har förfinat vår Node.js produktionsmiljö med PM2 under många års produktionserfarenhet. Våra PM2-hälsokontroller är viktiga för att upprätthålla tillförlitligheten i alla Node.js-applikationer.

### Vårt PM2-hälsokontrollsystem {#our-pm2-health-check-system}

**Vår kärnimplementering:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Vår Node.js-produktionsövervakning med PM2-hälsokontroller inkluderar:

* **Körs var 20:e minut** via cron-schemaläggning
* **Kräver minst 15 minuters drifttid** innan en process anses vara felfri
* **Validerar processstatus och minnesanvändning**
* **Startar automatiskt om misslyckade processer**
* **Förhindrar omstartsloopar** genom intelligent hälsokontroll

> \[!CAUTION]
> För bästa praxis för Node.js-produktionsdistribution kräver vi 15+ minuters drifttid innan vi betraktar en process som felfri för att undvika omstartsloopar. Detta förhindrar kaskadfel när processer kämpar med minne eller andra problem.

### Vår PM2-produktionskonfiguration {#our-pm2-production-configuration}

**Vår ekosystemkonfiguration:** Studera våra serverstartfiler för konfiguration av Node.js produktionsmiljö:

* [Webbserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-schemaläggare](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Dessa mönster gäller oavsett om du kör Express-appar, Koa-servrar, GraphQL API:er eller någon annan Node.js-applikation.

### Automatiserad PM2-distribution {#automated-pm2-deployment}

**PM2-distribution:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Vi automatiserar hela vår PM2-installation via Ansible för att säkerställa konsekventa Node.js-produktionsdistributioner på alla våra servrar.

## System för hantering och klassificering av produktionsfel {#production-error-handling-and-classification-system}

En av våra mest värdefulla bästa praxis för Node.js-produktionsdistribution är intelligent felklassificering som gäller för alla Node.js-applikationer:

### Vår isCodeBug-implementering för produktion {#our-iscodebug-implementation-for-production}

**Källa:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denna hjälpfunktion tillhandahåller intelligent felklassificering för Node.js-applikationer i produktion för att:

* **Prioritera faktiska buggar** framför användarfel
* **Förbättra vår incidenthantering** genom att fokusera på verkliga problem
* **Minska varningströtthet** från förväntade användarfel
* **Bättre förståelse** för applikations- kontra användargenererade problem

Det här mönstret fungerar för alla Node.js-applikationer – oavsett om du bygger e-handelswebbplatser, SaaS-plattformar, API:er eller mikrotjänster.

### Integration med vår produktionsloggning {#integration-with-our-production-logging}

**Vår loggintegration:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vår loggare använder `isCodeBug` för att fastställa varningsnivåer och fältredigering, vilket säkerställer att vi får meddelanden om verkliga problem samtidigt som vi filtrerar bort brus i vår Node.js-produktionsmiljö.

### Relaterat innehåll {#related-content-1}

Läs mer om våra felhanteringsmönster:

* [Bygga ett pålitligt betalningssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Felhanteringsmönster
* [E-postsekretessskydd](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Hantering av säkerhetsfel

## Avancerad prestandafelsökning med v8-profiler-next och cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Vi använder avancerade profileringsverktyg för att analysera heap-snapshots och felsöka OOM (Out of Memory)-problem, prestandaflaskhalsar och Node.js-minnesproblem i vår produktionsmiljö. Dessa verktyg är viktiga för alla Node.js-applikationer som upplever minnesläckor eller prestandaproblem.

### Vår profileringsmetod för Node.js-produktion {#our-profiling-approach-for-nodejs-production}

**Verktyg vi rekommenderar:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - För att generera heap-snapshots och CPU-profiler
* [`cpupro`](https://github.com/discoveryjs/cpupro) - För att analysera CPU-profiler och heap-snapshots

> \[!TIP]
> Vi använder v8-profiler-next och cpupro tillsammans för att skapa ett komplett arbetsflöde för prestandafelsökning för våra Node.js-applikationer. Denna kombination hjälper oss att identifiera minnesläckor, prestandaflaskhalsar och optimera vår produktionskod.

### Hur vi implementerar Heap Snapshot-analys {#how-we-implement-heap-snapshot-analysis}

**Vår övervakningsimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Vår produktionsövervakning inkluderar automatisk generering av heap-snapshots när minnesgränser överskrids. Detta hjälper oss att felsöka OOM-problem innan de orsakar programkrascher.

**Viktiga implementeringsmönster:**

* **Automatiska ögonblicksbilder** när heapstorleken överstiger tröskeln på 2 GB
* **Signalbaserad profilering** för analys på begäran i produktion
* **Kvarhållningspolicyer** för hantering av ögonblicksbilders lagring
* **Integration med våra rensningsjobb** för automatiserat underhåll

### Arbetsflöde för prestandafelsökning {#performance-debugging-workflow}

**Studera vår faktiska implementering:**

* [Övervaka serverimplementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heapövervakning och generering av ögonblicksbilder
* [Städjobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Lagring och rensning av ögonblicksbilder
* [Loggerintegration](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Prestandaloggning

### Rekommenderad implementering för din Node.js-applikation {#recommended-implementation-for-your-nodejs-application}

**För analys av heap-ögonblicksbilder:**

1. **Installera v8-profiler-next** för att generera snapshots
2. **Använd cpupro** för att analysera de genererade snapshotsen
3. **Implementera övervakningströsklar** liknande vår monitor-server.js
4. **Konfigurera automatiserad rensning** för att hantera snapshot-lagring
5. **Skapa signalhanterare** för profilering på begäran i produktion

**För CPU-profilering:**

1. **Generera CPU-profiler** under perioder med hög belastning
2. **Analysera med cpupro** för att identifiera flaskhalsar
3. **Fokusera på heta sökvägar** och optimeringsmöjligheter
4. **Övervaka prestandaförbättringar före/efter**

> \[!WARNING]
> Att generera heap-snapshots och CPU-profiler kan påverka prestandan. Vi rekommenderar att implementera strypning och endast aktivera profilering när specifika problem undersöks eller under underhållsfönster.

### Integration med vår produktionsövervakning {#integration-with-our-production-monitoring}

Våra profileringsverktyg integreras med vår bredare övervakningsstrategi:

* **Automatisk utlösning** baserat på minnes-/CPU-trösklar
* **Varningsintegration** när prestandaproblem upptäcks
* **Historisk analys** för att spåra prestandatrender över tid
* **Korrelation med applikationsstatistik** för omfattande felsökning

Denna metod har hjälpt oss att identifiera och lösa minnesläckor, optimera sökvägar för het kod och upprätthålla stabil prestanda i vår Node.js-produktionsmiljö.

## Node.js Produktionsinfrastruktursäkerhet {#nodejs-production-infrastructure-security}

Vi implementerar omfattande säkerhet för vår Node.js-produktionsinfrastruktur genom Ansible-automation. Dessa metoder gäller för alla Node.js-applikationer:

### Säkerhet på systemnivå för Node.js-produktion {#system-level-security-for-nodejs-production}

**Vår Ansible-implementering:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Våra viktigaste säkerhetsåtgärder för Node.js produktionsmiljöer:

* **Swap inaktiverat** för att förhindra att känslig data skrivs till disk
* **Core dumps inaktiverat** för att förhindra minnesdumps som innehåller känslig information
* **USB-lagring blockerad** för att förhindra obehörig dataåtkomst
* **Kärnparameterjustering** för både säkerhet och prestanda

> \[!WARNING]
> När du implementerar bästa praxis för Node.js produktionsdistribution kan inaktivering av swap orsaka minnesstopp om din applikation överskrider tillgängligt RAM-minne. Vi övervakar minnesanvändningen noggrant och dimensionerar våra servrar därefter.

### Applikationssäkerhet för Node.js-applikationer {#application-security-for-nodejs-applications}

**Vår loggfältsradering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi redigerar bort känsliga fält från loggar, inklusive lösenord, tokens, API-nycklar och personlig information. Detta skyddar användarnas integritet samtidigt som felsökningsmöjligheterna bibehålls i alla Node.js-produktionsmiljöer.

### Infrastruktursäkerhetsautomation {#infrastructure-security-automation}

**Vår kompletta Ansible-installation för Node.js-produktion:**

* [Säkerhetshandbok](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Hantering av SSH-nycklar](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certifikathantering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-konfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Vårt säkerhetsinnehåll {#our-security-content}

Läs mer om vår säkerhetsstrategi:

* [Bästa säkerhetsrevisionsföretagen](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe krypterad e-post](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Varför öppen källkod för e-postsäkerhet](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Databasarkitektur för Node.js-applikationer {#database-architecture-for-nodejs-applications}

Vi använder en hybriddatabasmetod som är optimerad för våra Node.js-applikationer. Dessa mönster kan anpassas för alla Node.js-applikationer:

### SQLite-implementering för Node.js-produktion {#sqlite-implementation-for-nodejs-production}

**Vad vi använder:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vår konfiguration:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Vi använder SQLite för användarspecifik data i våra Node.js-applikationer eftersom det tillhandahåller:

* **Dataisolering** per användare/hyresgäst
* **Bättre prestanda** för frågor från en enda användare
* **Förenklad säkerhetskopiering** och migrering
* **Minskad komplexitet** jämfört med delade databaser

Det här mönstret fungerar bra för SaaS-applikationer, system med flera innehavare eller alla Node.js-applikationer som behöver dataisolering.

### MongoDB-implementering för Node.js-produktion {#mongodb-implementation-for-nodejs-production}

**Vad vi använder:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vår installationsimplementering:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Vår konfiguration:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Vi använder MongoDB för applikationsdata i vår Node.js-produktionsmiljö eftersom den tillhandahåller:

* **Flexibelt schema** för utvecklande datastrukturer
* **Bättre prestanda** för komplexa frågor
* **Horisontell skalning**
* **Rikt frågespråk**

> \[!NOTE]
> Vår hybridmetod optimerar för vårt specifika användningsfall. Studera våra faktiska databasanvändningsmönster i kodbasen för att förstå om den här metoden passar dina Node.js-applikationsbehov.

## Node.js produktionsbakgrundsjobbbearbetning {#nodejs-production-background-job-processing}

Vi byggde vår bakgrundsjobbarkitektur kring Bree för tillförlitlig Node.js-produktionsdistribution. Detta gäller alla Node.js-applikationer som behöver bakgrundsbearbetning:

### Vår Bree-serverkonfiguration för produktion {#our-bree-server-setup-for-production}

**Vår huvudimplementering:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Vår Ansible-distribution:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Exempel på produktionsjobb {#production-job-examples}

**Hälsoövervakning:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisering av rensning:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Alla våra jobb:** [Bläddra i vår kompletta jobbkatalog](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Dessa mönster gäller för alla Node.js-applikationer som behöver:

* Schemalagda uppgifter (databehandling, rapporter, rensning)
* Bakgrundsbehandling (storleksändring av bilder, e-postutskick, dataimport)
* Hälsoövervakning och underhåll
* Utnyttjande av arbetstrådar för CPU-intensiva uppgifter

### Våra schemaläggningsmönster för Node.js-produktion {#our-job-scheduling-patterns-for-nodejs-production}

Studera våra faktiska schemaläggningsmönster i vår jobbkatalog för att förstå:

* Hur vi implementerar cron-liknande schemaläggning i Node.js-produktion
* Vår felhantering och logik för återförsök
* Hur vi använder arbetstrådar för CPU-intensiva uppgifter

## Automatiserat underhåll för produktionsapplikationer i Node.js {#automated-maintenance-for-production-nodejs-applications}

Vi implementerar proaktivt underhåll för att förhindra vanliga Node.js-produktionsproblem. Dessa mönster gäller för alla Node.js-applikationer:

### Vår implementering av rensning {#our-cleanup-implementation}

**Källa:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Vårt automatiserade underhåll för Node.js produktionsapplikationer riktar sig mot:

* **Tillfälliga filer** äldre än 24 timmar
* **Loggfiler** bortom lagringsgränserna
* **Cachefiler** och tillfälliga data
* **Uppladdade filer** som inte längre behövs
* **Heap-ögonblicksbilder** från prestandafelsökning

Dessa mönster gäller för alla Node.js-applikationer som genererar tillfälliga filer, loggar eller cachade data.

### Diskutrymmeshantering för Node.js-produktion {#disk-space-management-for-nodejs-production}

**Våra övervakningströsklar:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Kögränser** för bakgrundsbearbetning
* **Varningströskel för 75 % diskanvändning**
* **Automatisk rensning** när tröskelvärden överskrids

### Automatisering av infrastrukturunderhåll {#infrastructure-maintenance-automation}

**Vår Ansible-automatisering för Node.js-produktion:**

* [Miljöimplementering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Hantering av distributionsnycklar](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Implementeringsguide för Node.js produktionsdistribution {#nodejs-production-deployment-implementation-guide}

### Studera vår faktiska kod för bästa praxis i produktion {#study-our-actual-code-for-production-best-practices}

**Börja med dessa nyckelfiler för installation av Node.js produktionsmiljö:**

1. **Konfiguration:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Övervakning:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Felhantering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Loggning:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Processhälsa:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Lär dig av våra blogginlägg {#learn-from-our-blog-posts}

**Våra tekniska implementeringsguider för Node.js-produktion:**

* [NPM-paketens ekosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Bygga betalningssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementering av e-postsekretess](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktformulär](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email-integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastrukturautomation för Node.js-produktion {#infrastructure-automation-for-nodejs-production}

**Våra Ansible-handböcker att studera för Node.js produktionsdistribution:**

* [Komplett katalog över spelböcker](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Säkerhetshärdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-installation](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Våra fallstudier {#our-case-studies}

**Våra företagsimplementeringar:**

* [Fallstudie av Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Fallstudie av Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Vidarebefordran av e-post till alumner](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Slutsats: Bästa praxis för Node.js produktionsdistribution {#conclusion-nodejs-production-deployment-best-practices}

Vår Node.js-produktionsinfrastruktur visar att Node.js-applikationer kan uppnå tillförlitlighet i företagsklass genom:

* **Beprövade hårdvaruval** (AMD Ryzen för 573 % prestandaoptimering med en enda kärna)
* **Stridstestad Node.js-produktionsövervakning** med specifika tröskelvärden och automatiserade svar
* **Smart felklassificering** för att förbättra incidentrespons i produktionsmiljöer
* **Avancerad prestandafelsökning** med v8-profiler-next och cpupro för OOM-förebyggande
* **Omfattande säkerhetshärdning** genom Ansible-automatisering
* **Hybriddatabasarkitektur** optimerad för applikationsbehov
* **Automatiserat underhåll** för att förhindra vanliga Node.js-produktionsproblem

**Viktig slutsats:** Studera våra faktiska implementeringsfiler och blogginlägg istället för att följa generiska bästa praxis. Vår kodbas tillhandahåller verkliga mönster för Node.js-produktionsdistribution som kan anpassas för alla Node.js-applikationer - webbappar, API:er, mikrotjänster eller bakgrundstjänster.

## Komplett resurslista för Node.js-produktion {#complete-resource-list-for-nodejs-production}

### Våra kärnimplementeringsfiler {#our-core-implementation-files}

* [Huvudkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Paketberoenden](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverövervakning](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Felklassificering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Loggningssystem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2-hälsokontroller](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatiserad rensning](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Våra serverimplementeringar {#our-server-implementations}

* [Webbserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-schemaläggare](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Vår infrastrukturautomation {#our-infrastructure-automation}

* [Alla våra Ansible-handböcker](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Säkerhetshärdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-installation](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databaskonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Våra tekniska blogginlägg {#our-technical-blog-posts}

* [NPM Ekosystemanalys](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementering av betalningssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Teknisk guide för e-postsekretess](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktformulär](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email-integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guide till lösningar för egenhosting](https://forwardemail.net/blog/docs/self-hosted-solution)

### Våra företagsfallstudier {#our-enterprise-case-studies}

* [Linux Foundation-implementering](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Fallstudie av Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Efterlevnad av den federala regeringen](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [E-postsystem för alumner](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)