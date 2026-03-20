# Hur man optimerar Node.js produktionsinfrastruktur: bästa praxis {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Vår 573% singelkärnprestandaoptimeringsrevolution](#our-573-single-core-performance-optimization-revolution)
  * [Varför singelkärnprestandaoptimering är viktigt för Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Relaterat innehåll](#related-content)
* [Node.js produktionsmiljöinställning: vår teknologistack](#nodejs-production-environment-setup-our-technology-stack)
  * [Paketchef: pnpm för produktionseffektivitet](#package-manager-pnpm-for-production-efficiency)
  * [Webbramverk: Koa för modern Node.js produktion](#web-framework-koa-for-modern-nodejs-production)
  * [Bakgrundsjobbshantering: Bree för produktionspålitlighet](#background-job-processing-bree-for-production-reliability)
  * [Felhanteirng: @hapi/boom för produktionspålitlighet](#error-handling-hapiboom-for-production-reliability)
* [Hur man övervakar Node.js-applikationer i produktion](#how-to-monitor-nodejs-applications-in-production)
  * [Systemnivå Node.js produktionsövervakning](#system-level-nodejs-production-monitoring)
  * [Applikationsnivåövervakning för Node.js produktion](#application-level-monitoring-for-nodejs-production)
  * [Applikationsspecifik övervakning](#application-specific-monitoring)
* [Node.js produktionsövervakning med PM2 hälsokontroller](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Vårt PM2 hälsokontrollsystem](#our-pm2-health-check-system)
  * [Vår PM2 produktionskonfiguration](#our-pm2-production-configuration)
  * [Automatiserad PM2-distribution](#automated-pm2-deployment)
* [Produktionsfelhantering och klassificeringssystem](#production-error-handling-and-classification-system)
  * [Vår isCodeBug-implementering för produktion](#our-iscodebug-implementation-for-production)
  * [Integration med vår produktionsloggning](#integration-with-our-production-logging)
  * [Relaterat innehåll](#related-content-1)
* [Avancerad prestandafelsökning med v8-profiler-next och cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Vår profileringstillvägagångssätt för Node.js produktion](#our-profiling-approach-for-nodejs-production)
  * [Hur vi implementerar heap snapshot-analys](#how-we-implement-heap-snapshot-analysis)
  * [Prestandafelsökningsarbetsflöde](#performance-debugging-workflow)
  * [Rekommenderad implementering för din Node.js-applikation](#recommended-implementation-for-your-nodejs-application)
  * [Integration med vår produktionsövervakning](#integration-with-our-production-monitoring)
* [Node.js produktionsinfrastruktur säkerhet](#nodejs-production-infrastructure-security)
  * [Systemnivåsäkerhet för Node.js produktion](#system-level-security-for-nodejs-production)
  * [Applikationssäkerhet för Node.js-applikationer](#application-security-for-nodejs-applications)
  * [Automatisering av infrastruktursäkerhet](#infrastructure-security-automation)
  * [Vårt säkerhetsinnehåll](#our-security-content)
* [Databasarkitektur för Node.js-applikationer](#database-architecture-for-nodejs-applications)
  * [SQLite-implementering för Node.js produktion](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-implementering för Node.js produktion](#mongodb-implementation-for-nodejs-production)
* [Node.js produktions bakgrundsjobbshantering](#nodejs-production-background-job-processing)
  * [Vår Bree-serverinställning för produktion](#our-bree-server-setup-for-production)
  * [Produktionsjobbexempel](#production-job-examples)
  * [Våra jobbschemaläggningsmönster för Node.js produktion](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatiserat underhåll för produktions-Node.js-applikationer](#automated-maintenance-for-production-nodejs-applications)
  * [Vår städimplementering](#our-cleanup-implementation)
  * [Diskutrymmeshantering för Node.js produktion](#disk-space-management-for-nodejs-production)
  * [Automatisering av infrastruktursunderhåll](#infrastructure-maintenance-automation)
* [Node.js produktionsdistributionsimplementeringsguide](#nodejs-production-deployment-implementation-guide)
  * [Studera vår faktiska kod för produktionsbästa praxis](#study-our-actual-code-for-production-best-practices)
  * [Lär dig från våra blogginlägg](#learn-from-our-blog-posts)
  * [Infrastrukturautomatisering för Node.js produktion](#infrastructure-automation-for-nodejs-production)
  * [Våra fallstudier](#our-case-studies)
* [Slutsats: bästa praxis för Node.js produktionsdistribution](#conclusion-nodejs-production-deployment-best-practices)
* [Komplett resurslista för Node.js produktion](#complete-resource-list-for-nodejs-production)
  * [Våra kärnimplementeringsfiler](#our-core-implementation-files)
  * [Våra serverimplementeringar](#our-server-implementations)
  * [Vår infrastrukturautomatisering](#our-infrastructure-automation)
  * [Våra tekniska blogginlägg](#our-technical-blog-posts)
  * [Våra företagsfallstudier](#our-enterprise-case-studies)
## Förord {#foreword}

På Forward Email har vi ägnat år åt att förfina vår Node.js-produktionsmiljö. Denna omfattande guide delar med sig av våra beprövade bästa metoder för Node.js-produktionsdistribution, med fokus på prestandaoptimering, övervakning och de lärdomar vi fått när vi skalat Node.js-applikationer för att hantera miljontals dagliga transaktioner.


## Vår 573% Single Core Prestandaoptimeringsrevolution {#our-573-single-core-performance-optimization-revolution}

När vi migrerade från Intel till AMD Ryzen-processorer uppnådde vi en **573% prestandaförbättring** i våra Node.js-applikationer. Detta var inte bara en mindre optimering – det förändrade fundamentalt hur våra Node.js-applikationer presterar i produktion och visar vikten av single core-prestandaoptimering för alla Node.js-applikationer.

> \[!TIP]
> För bästa metoder vid Node.js-produktionsdistribution är hårdvaruval avgörande. Vi valde specifikt DataPacket-hosting för deras AMD Ryzen-tillgänglighet eftersom single-core-prestanda är avgörande för Node.js-applikationer då JavaScript-exekvering är single-threaded.

### Varför Single Core Prestandaoptimering är Viktigt för Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Vår migrering från Intel till AMD Ryzen resulterade i:

* **573% prestandaförbättring** i förfrågningshantering (dokumenterat i [vår status-sidas GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminerade bearbetningsförseningar** till nästan omedelbara svar (nämnt i [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Bättre pris-prestanda-förhållande** för Node.js-produktionsmiljöer
* **Förbättrade svarstider** över alla våra applikationsendpoints

Prestandaökningen var så betydande att vi nu anser AMD Ryzen-processorer som nödvändiga för all seriös Node.js-produktionsdistribution, oavsett om du kör webbapplikationer, API:er, mikrotjänster eller någon annan Node.js-arbetsbelastning.

### Relaterat Innehåll {#related-content}

För mer detaljer om våra infrastrukturella val, se:

* [Bästa E-postvidarebefordringstjänsten](https://forwardemail.net/blog/docs/best-email-forwarding-service) – Prestandajämförelser
* [Självhostad Lösning](https://forwardemail.net/blog/docs/self-hosted-solution) – Hårdvarurekommendationer


## Node.js Produktionsmiljö Setup: Vår Teknikstack {#nodejs-production-environment-setup-our-technology-stack}

Våra bästa metoder för Node.js-produktionsdistribution inkluderar genomtänkta teknologival baserade på års produktionserfarenhet. Här är vad vi använder och varför dessa val gäller för alla Node.js-applikationer:

### Paketchef: pnpm för Produktions-effektivitet {#package-manager-pnpm-for-production-efficiency}

**Vad vi använder:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (fast version)

Vi valde pnpm över npm och yarn för vår Node.js-produktionsmiljö eftersom:

* **Snabbare installationstider** i CI/CD-pipelines
* **Diskutrymmeseffektivitet** genom hårda länkar
* **Strikt beroendelösning** som förhindrar spökberoenden
* **Bättre prestanda** i produktionsdistributioner

> \[!NOTE]
> Som en del av våra bästa metoder för Node.js-produktionsdistribution fastställer vi exakta versioner av kritiska verktyg som pnpm för att säkerställa konsekvent beteende över alla miljöer och teammedlemmars maskiner.

**Implementeringsdetaljer:**

* [Vår package.json-konfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Vårt NPM-ekosystem blogginlägg](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webb Framework: Koa för Modern Node.js Produktion {#web-framework-koa-for-modern-nodejs-production}

**Vad vi använder:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Vi valde Koa framför Express för vår Node.js-produktionsinfrastruktur på grund av dess moderna async/await-stöd och renare middleware-komposition. Vår grundare Nick Baugh bidrog till både Express och Koa, vilket gav oss djup insikt i båda ramverken för produktionsanvändning.

Dessa mönster gäller oavsett om du bygger REST-API:er, GraphQL-servrar, webbapplikationer eller mikrotjänster.

**Våra implementations-exempel:**

* [Webbserveruppsättning](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-serverkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guide för implementering av kontaktformulär](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Bakgrundsjobbshantering: Bree för produktionspålitlighet {#background-job-processing-bree-for-production-reliability}

**Vad vi använder:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) schemaläggare

Vi skapade och underhåller Bree eftersom befintliga jobbschemaläggare inte uppfyllde våra behov av stöd för worker threads och moderna JavaScript-funktioner i produktionsmiljöer för Node.js. Detta gäller för alla Node.js-applikationer som behöver bakgrundsbehandling, schemalagda uppgifter eller worker threads.

**Våra implementations-exempel:**

* [Bree-serveruppsättning](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Alla våra jobbdefinitioner](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 hälsokontrolljobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementering av städjobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Felhantering: @hapi/boom för produktionspålitlighet {#error-handling-hapiboom-for-production-reliability}

**Vad vi använder:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi använder @hapi/boom för strukturerade felmeddelanden i hela våra Node.js-produktionsapplikationer. Detta mönster fungerar för alla Node.js-applikationer som behöver konsekvent felhantering.

**Våra implementations-exempel:**

* [Hjälpmedel för felklassificering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger-implementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Hur man övervakar Node.js-applikationer i produktion {#how-to-monitor-nodejs-applications-in-production}

Vår metod för att övervaka Node.js-applikationer i produktion har utvecklats genom år av drift av applikationer i stor skala. Vi implementerar övervakning på flera nivåer för att säkerställa pålitlighet och prestanda för alla typer av Node.js-applikationer.

### Systemnivåövervakning av Node.js i produktion {#system-level-nodejs-production-monitoring}

**Vår kärnimplementation:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Vad vi använder:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Våra produktionsövervakningströsklar (från vår faktiska produktionskod):

* **2GB heapstorleksgräns** med automatiska varningar
* **25% minnesanvändning** varningströskel
* **80% CPU-användning** varningströskel
* **75% diskanvändning** varningströskel

> \[!WARNING]
> Dessa trösklar fungerar för vår specifika hårdvarukonfiguration. När du implementerar Node.js-produktionsövervakning, granska vår monitor-server.js-implementation för att förstå den exakta logiken och anpassa värdena för din miljö.

### Applikationsnivåövervakning för Node.js i produktion {#application-level-monitoring-for-nodejs-production}

**Vår felklassificering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Detta hjälpmedel skiljer mellan:

* **Faktiska kodfel** som kräver omedelbar uppmärksamhet
* **Användarfel** som är förväntat beteende
* **Extern tjänstefel** som vi inte kan kontrollera

Detta mönster gäller för alla Node.js-applikationer – webbappar, API:er, mikrotjänster eller bakgrundstjänster.
**Vår loggningsimplementation:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi implementerar omfattande fältmaskering för att skydda känslig information samtidigt som vi behåller användbara felsökningsmöjligheter i vår Node.js-produktionsmiljö.

### Applikationsspecifik övervakning {#application-specific-monitoring}

**Våra serverimplementationer:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Köövervakning:** Vi implementerar 5GB kögränser och 180 sekunders timeout för förfrågningsbearbetning för att förhindra resursutarmning. Dessa mönster gäller för alla Node.js-applikationer med köer eller bakgrundsprocesser.


## Node.js-produktionsövervakning med PM2-hälsokontroller {#nodejs-production-monitoring-with-pm2-health-checks}

Vi har förfinat vår Node.js-produktionsmiljö med PM2 under flera års produktionserfarenhet. Våra PM2-hälsokontroller är avgörande för att upprätthålla tillförlitlighet i alla Node.js-applikationer.

### Vårt PM2-hälsokontrollsystem {#our-pm2-health-check-system}

**Vår kärnimplementation:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Vår Node.js-produktionsövervakning med PM2-hälsokontroller inkluderar:

* **Körs var 20:e minut** via cron-schemaläggning
* **Kräver minst 15 minuters drifttid** innan en process anses vara frisk
* **Validerar processstatus och minnesanvändning**
* **Startar automatiskt om misslyckade processer**
* **Förhindrar omstartslopp** genom intelligent hälsokontroll

> \[!CAUTION]
> För bästa praxis vid Node.js-produktionsdistribution kräver vi 15+ minuters drifttid innan en process anses frisk för att undvika omstartslopp. Detta förhindrar kaskadfel när processer har problem med minne eller andra problem.

### Vår PM2-produktionskonfiguration {#our-pm2-production-configuration}

**Vår ekosystemsetup:** Studera våra serverstartfiler för Node.js-produktionsmiljö:

* [Webbserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-schemaläggare](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Dessa mönster gäller oavsett om du kör Express-appar, Koa-servrar, GraphQL-API:er eller någon annan Node.js-applikation.

### Automatiserad PM2-distribution {#automated-pm2-deployment}

**PM2-distribution:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Vi automatiserar hela vår PM2-setup via Ansible för att säkerställa konsekventa Node.js-produktionsdistributioner på alla våra servrar.


## Produktionsfelhantering och klassificeringssystem {#production-error-handling-and-classification-system}

En av våra mest värdefulla bästa praxis för Node.js-produktionsdistribution är intelligent felklassificering som gäller för alla Node.js-applikationer:

### Vår isCodeBug-implementation för produktion {#our-iscodebug-implementation-for-production}

**Källa:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denna hjälpfunktion tillhandahåller intelligent felklassificering för Node.js-applikationer i produktion för att:

* **Prioritera faktiska buggar** framför användarfel
* **Förbättra vår incidenthantering** genom att fokusera på verkliga problem
* **Minska larmtrötthet** från förväntade användarfel
* **Förstå bättre** applikations- vs användargenererade problem

Detta mönster fungerar för alla Node.js-applikationer – oavsett om du bygger e-handelswebbplatser, SaaS-plattformar, API:er eller mikrotjänster.

### Integration med vår produktionsloggning {#integration-with-our-production-logging}

**Vår loggerintegration:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Vår logger använder `isCodeBug` för att bestämma varningsnivåer och fältmaskering, vilket säkerställer att vi blir notifierade om verkliga problem samtidigt som vi filtrerar bort brus i vår Node.js-produktionsmiljö.

### Relaterat Innehåll {#related-content-1}

Lär dig mer om våra mönster för felhantering:

* [Bygga pålitligt betalningssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Mönster för felhantering
* [E-postintegritetsskydd](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Säkerhetsfelhantering


## Avancerad prestandafelsökning med v8-profiler-next och cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Vi använder avancerade profileringsverktyg för att analysera heap-ögonblicksbilder och felsöka OOM (Out of Memory)-problem, prestandaflaskhalsar och Node.js-minnesproblem i vår produktionsmiljö. Dessa verktyg är avgörande för alla Node.js-applikationer som upplever minnesläckor eller prestandaproblem.

### Vår profileringsmetod för Node.js produktion {#our-profiling-approach-for-nodejs-production}

**Verktyg vi rekommenderar:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - För att generera heap-ögonblicksbilder och CPU-profiler
* [`cpupro`](https://github.com/discoveryjs/cpupro) - För att analysera CPU-profiler och heap-ögonblicksbilder

> \[!TIP]
> Vi använder v8-profiler-next och cpupro tillsammans för att skapa ett komplett arbetsflöde för prestandafelsökning för våra Node.js-applikationer. Denna kombination hjälper oss att identifiera minnesläckor, prestandaflaskhalsar och optimera vår produktionskod.

### Hur vi implementerar heap-ögonblicksbildanalys {#how-we-implement-heap-snapshot-analysis}

**Vår övervakningsimplementation:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Vår produktionsövervakning inkluderar automatisk generering av heap-ögonblicksbilder när minnesgränser överskrids. Detta hjälper oss att felsöka OOM-problem innan de orsakar applikationskrascher.

**Viktiga implementationsmönster:**

* **Automatiska ögonblicksbilder** när heap-storleken överstiger 2GB-gränsen
* **Signalbaserad profilering** för analys på begäran i produktion
* **Behållningspolicyer** för hantering av ögonblicksbildslagring
* **Integration med våra städuppgifter** för automatiserat underhåll

### Arbetsflöde för prestandafelsökning {#performance-debugging-workflow}

**Studera vår faktiska implementation:**

* [Monitor-serverimplementation](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap-övervakning och generering av ögonblicksbilder
* [Städuppgift](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Behållning och rensning av ögonblicksbilder
* [Loggerintegration](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Prestandalogging

### Rekommenderad implementation för din Node.js-applikation {#recommended-implementation-for-your-nodejs-application}

**För heap-ögonblicksbildanalys:**

1. **Installera v8-profiler-next** för generering av ögonblicksbilder
2. **Använd cpupro** för att analysera de genererade ögonblicksbilderna
3. **Implementera övervakningströsklar** liknande vår monitor-server.js
4. **Ställ in automatiserad rensning** för att hantera lagring av ögonblicksbilder
5. **Skapa signalhanterare** för profilering på begäran i produktion

**För CPU-profilering:**

1. **Generera CPU-profiler** under perioder med hög belastning
2. **Analysera med cpupro** för att identifiera flaskhalsar
3. **Fokusera på varma vägar** och optimeringsmöjligheter
4. **Övervaka före/efter** prestandaförbättringar

> \[!WARNING]
> Att generera heap-ögonblicksbilder och CPU-profiler kan påverka prestandan. Vi rekommenderar att implementera begränsning och endast aktivera profilering när specifika problem undersöks eller under underhållsfönster.

### Integration med vår produktionsövervakning {#integration-with-our-production-monitoring}

Våra profileringsverktyg integreras med vår bredare övervakningsstrategi:

* **Automatisk utlösning** baserat på minnes-/CPU-trösklar
* **Larmintegration** när prestandaproblem upptäcks
* **Historisk analys** för att följa prestandatrender över tid
* **Korrelation med applikationsmått** för omfattande felsökning
Denna metod har hjälpt oss att identifiera och åtgärda minnesläckor, optimera kritiska kodvägar och upprätthålla stabil prestanda i vår Node.js-produktionsmiljö.


## Säkerhet för Node.js-produktionsinfrastruktur {#nodejs-production-infrastructure-security}

Vi implementerar omfattande säkerhet för vår Node.js-produktionsinfrastruktur genom Ansible-automatisering. Dessa metoder gäller för alla Node.js-applikationer:

### Systemnivåsäkerhet för Node.js-produktion {#system-level-security-for-nodejs-production}

**Vår Ansible-implementation:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Våra viktigaste säkerhetsåtgärder för Node.js-produktionsmiljöer:

* **Swap inaktiverat** för att förhindra att känslig data skrivs till disk
* **Core dumps inaktiverade** för att förhindra minnesdumpningar som innehåller känslig information
* **USB-lagring blockerad** för att förhindra obehörig dataåtkomst
* **Justering av kärnparametrar** för både säkerhet och prestanda

> \[!WARNING]
> När man implementerar bästa praxis för Node.js-produktionsdistribution kan inaktivering av swap orsaka att processer dödas vid minnesbrist om din applikation överskrider tillgängligt RAM. Vi övervakar minnesanvändningen noggrant och dimensionerar våra servrar därefter.

### Applikationssäkerhet för Node.js-applikationer {#application-security-for-nodejs-applications}

**Vår loggfältsmaskering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi maskerar känsliga fält i loggar, inklusive lösenord, tokens, API-nycklar och personlig information. Detta skyddar användarnas integritet samtidigt som felsökningsmöjligheter bibehålls i alla Node.js-produktionsmiljöer.

### Automatisering av infrastruktursäkerhet {#infrastructure-security-automation}

**Vår kompletta Ansible-setup för Node.js-produktion:**

* [Säkerhetsspelbok](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-nyckelhantering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certifikathantering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-setup](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Vårt säkerhetsinnehåll {#our-security-content}

Lär dig mer om vår säkerhetsstrategi:

* [Bästa säkerhetsrevisionsföretagen](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe krypterad e-post](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Varför öppen källkod för e-postsäkerhet](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Databasarkitektur för Node.js-applikationer {#database-architecture-for-nodejs-applications}

Vi använder en hybriddatabasstrategi optimerad för våra Node.js-applikationer. Dessa mönster kan anpassas för vilken Node.js-applikation som helst:

### SQLite-implementation för Node.js-produktion {#sqlite-implementation-for-nodejs-production}

**Vad vi använder:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vår konfiguration:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Vi använder SQLite för användarspecifik data i våra Node.js-applikationer eftersom det ger:

* **Dataisolering** per användare/hyresgäst
* **Bättre prestanda** för enanvändarförfrågningar
* **Förenklad backup** och migrering
* **Minskad komplexitet** jämfört med delade databaser

Detta mönster fungerar bra för SaaS-applikationer, multi-tenant-system eller vilken Node.js-applikation som helst som behöver dataisolering.

### MongoDB-implementation för Node.js-produktion {#mongodb-implementation-for-nodejs-production}

**Vad vi använder:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Vår installationsimplementering:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Vår konfiguration:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Vi använder MongoDB för applikationsdata i vår Node.js-produktionsmiljö eftersom det erbjuder:

* **Flexibelt schema** för utvecklande datastrukturer
* **Bättre prestanda** för komplexa frågor
* **Horisontell skalning** möjligheter
* **Rikt frågespråk**

> \[!NOTE]
> Vår hybrida metod optimerar för vårt specifika användningsfall. Studera våra faktiska databasanvändningsmönster i kodbasen för att förstå om denna metod passar dina Node.js-applikationsbehov.


## Node.js Produktionsbakgrundsjobbshantering {#nodejs-production-background-job-processing}

Vi byggde vår bakgrundsjobbarkitektur kring Bree för pålitlig Node.js-produktionsdistribution. Detta gäller för alla Node.js-applikationer som behöver bakgrundsbehandling:

### Vår Bree-serveruppsättning för produktion {#our-bree-server-setup-for-production}

**Vår huvudimplementering:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Vår Ansible-distribution:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Produktionsjobbexempel {#production-job-examples}

**Hälsomonitorering:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatiserad städning:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Alla våra jobb:** [Bläddra i vår kompletta jobbkatalog](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Dessa mönster gäller för alla Node.js-applikationer som behöver:

* Schemalagda uppgifter (databehandling, rapporter, städning)
* Bakgrundsbehandling (bildändring, e-postutskick, dataimporter)
* Hälsomonitorering och underhåll
* Användning av worker-trådar för CPU-intensiva uppgifter

### Våra schemaläggningsmönster för Node.js produktion {#our-job-scheduling-patterns-for-nodejs-production}

Studera våra faktiska schemaläggningsmönster i vår jobbkatalog för att förstå:

* Hur vi implementerar cron-liknande schemaläggning i Node.js produktion
* Vår felhantering och återförsökslogik
* Hur vi använder worker-trådar för CPU-intensiva uppgifter


## Automatiserat underhåll för produktions-Node.js-applikationer {#automated-maintenance-for-production-nodejs-applications}

Vi implementerar proaktivt underhåll för att förebygga vanliga Node.js-produktionsproblem. Dessa mönster gäller för alla Node.js-applikationer:

### Vår städimplementering {#our-cleanup-implementation}

**Källa:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Vårt automatiserade underhåll för Node.js-produktionsapplikationer riktar sig mot:

* **Temporära filer** äldre än 24 timmar
* **Loggfiler** utöver behållningsgränser
* **Cachefiler** och temporära data
* **Uppladdade filer** som inte längre behövs
* **Heap snapshots** från prestandafelsökning

Dessa mönster gäller för alla Node.js-applikationer som genererar temporära filer, loggar eller cachelagrad data.

### Diskutrymmeshantering för Node.js produktion {#disk-space-management-for-nodejs-production}

**Våra övervakningströsklar:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Kögränser** för bakgrundsbehandling
* **75% diskusage** varningströskel
* **Automatisk städning** när trösklar överskrids

### Infrastrukturunderhållsautomation {#infrastructure-maintenance-automation}

**Vår Ansible-automation för Node.js produktion:**

* [Miljödistribution](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Hantera distributionsnycklar](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Implementeringsguide för Node.js produktionsdistribution {#nodejs-production-deployment-implementation-guide}
### Studera Vår Faktiska Kod för Produktionsbästa Praxis {#study-our-actual-code-for-production-best-practices}

**Börja med dessa nyckelfiler för Node.js produktionsmiljöinställning:**

1. **Konfiguration:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Övervakning:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Felhanteirng:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Loggning:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Processhälsa:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Lär av Våra Blogginlägg {#learn-from-our-blog-posts}

**Våra tekniska implementationsguider för Node.js produktion:**

* [NPM Packages Ecosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Bygga Betalningssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementering av E-postintegritet](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript Kontaktformulär](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-postintegration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastrukturautomation för Node.js Produktion {#infrastructure-automation-for-nodejs-production}

**Våra Ansible playbooks att studera för Node.js produktionsdistribution:**

* [Komplett playbooks-katalog](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Säkerhetshärdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js installation](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Våra Fallstudier {#our-case-studies}

**Våra företagsimplementationer:**

* [Linux Foundation Fallstudie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Fallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumners E-postvidarebefordran](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Slutsats: Bästa Praxis för Node.js Produktionsdistribution {#conclusion-nodejs-production-deployment-best-practices}

Vår Node.js produktionsinfrastruktur visar att Node.js-applikationer kan uppnå företagsklassad tillförlitlighet genom:

* **Beprövade hårdvaruval** (AMD Ryzen för 573% optimering av enkelkärnprestanda)
* **Stridsprövad Node.js produktionsövervakning** med specifika tröskelvärden och automatiska svar
* **Smart felklassificering** för att förbättra incidenthantering i produktionsmiljöer
* **Avancerad prestandafelsökning** med v8-profiler-next och cpupro för att förebygga OOM
* **Omfattande säkerhetshärdning** genom Ansible-automation
* **Hybrid databasarkitektur** optimerad för applikationsbehov
* **Automatiserat underhåll** för att förhindra vanliga Node.js produktionsproblem

**Viktig slutsats:** Studera våra faktiska implementationsfiler och blogginlägg istället för att följa generiska bästa praxis. Vår kodbas erbjuder verkliga mönster för Node.js produktionsdistribution som kan anpassas för vilken Node.js-applikation som helst – webbappar, API:er, mikrotjänster eller bakgrundstjänster.


## Komplett Resurslista för Node.js Produktion {#complete-resource-list-for-nodejs-production}

### Våra Kärnimplementeringsfiler {#our-core-implementation-files}

* [Huvudkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Paketberoenden](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverövervakning](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Felklassificering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Loggningssystem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 hälsokontroller](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatisk rensning](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Våra serverimplementationer {#our-server-implementations}

* [Webbserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-schemaläggare](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Vår infrastrukturautomation {#our-infrastructure-automation}

* [Alla våra Ansible-playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Säkerhetshärdning](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-installation](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databaskonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Våra tekniska blogginlägg {#our-technical-blog-posts}

* [NPM-ekosystemanalys](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementering av betalningssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Teknisk guide för e-postintegritet](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktformulär](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React e-postintegration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guide för självhostad lösning](https://forwardemail.net/blog/docs/self-hosted-solution)

### Våra företagsfallstudier {#our-enterprise-case-studies}

* [Linux Foundation-implementering](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu-fallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Följande av federala myndigheters regelverk](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumnis e-postsystem](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
