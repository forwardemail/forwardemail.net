# Hoe Node.js-productie-infrastructuur te optimaliseren: aanbevolen procedures {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Onze 573% Single Core Performance Optimization Revolution](#our-573-single-core-performance-optimization-revolution)
  * [Waarom Single Core-prestatieoptimalisatie belangrijk is voor Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Gerelateerde inhoud](#related-content)
* [Node.js-productieomgeving instellen: onze technologie-stack](#nodejs-production-environment-setup-our-technology-stack)
  * [Pakketbeheerder: pnpm voor productie-efficiëntie](#package-manager-pnpm-for-production-efficiency)
  * [Webframework: Koa voor moderne Node.js-productie](#web-framework-koa-for-modern-nodejs-production)
  * [Achtergrondtaakverwerking: Bree voor productiebetrouwbaarheid](#background-job-processing-bree-for-production-reliability)
  * [Foutbehandeling: @hapi/boom voor productiebetrouwbaarheid](#error-handling-hapiboom-for-production-reliability)
* [Hoe u Node.js-applicaties in productie kunt monitoren](#how-to-monitor-nodejs-applications-in-production)
  * [Node.js-productiebewaking op systeemniveau](#system-level-nodejs-production-monitoring)
  * [Monitoring op applicatieniveau voor Node.js-productie](#application-level-monitoring-for-nodejs-production)
  * [Toepassingsspecifieke monitoring](#application-specific-monitoring)
* [Node.js-productiebewaking met PM2-gezondheidscontroles](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Ons PM2-gezondheidscontrolesysteem](#our-pm2-health-check-system)
  * [Onze PM2-productieconfiguratie](#our-pm2-production-configuration)
  * [Geautomatiseerde PM2-implementatie](#automated-pm2-deployment)
* [Systeem voor het afhandelen en classificeren van productiefouten](#production-error-handling-and-classification-system)
  * [Onze isCodeBug-implementatie voor productie](#our-iscodebug-implementation-for-production)
  * [Integratie met onze productieregistratie](#integration-with-our-production-logging)
  * [Gerelateerde inhoud](#related-content-1)
* [Geavanceerd prestatiedebuggen met v8-profiler-next en cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Onze profileringsaanpak voor Node.js-productie](#our-profiling-approach-for-nodejs-production)
  * [Hoe we heap snapshot-analyse implementeren](#how-we-implement-heap-snapshot-analysis)
  * [Workflow voor prestatie-debuggen](#performance-debugging-workflow)
  * [Aanbevolen implementatie voor uw Node.js-applicatie](#recommended-implementation-for-your-nodejs-application)
  * [Integratie met onze productiemonitoring](#integration-with-our-production-monitoring)
* [Beveiliging van Node.js-productie-infrastructuur](#nodejs-production-infrastructure-security)
  * [Beveiliging op systeemniveau voor Node.js-productie](#system-level-security-for-nodejs-production)
  * [Toepassingsbeveiliging voor Node.js-toepassingen](#application-security-for-nodejs-applications)
  * [Automatisering van infrastructuurbeveiliging](#infrastructure-security-automation)
  * [Onze beveiligingsinhoud](#our-security-content)
* [Databasearchitectuur voor Node.js-toepassingen](#database-architecture-for-nodejs-applications)
  * [SQLite-implementatie voor Node.js-productie](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-implementatie voor Node.js-productie](#mongodb-implementation-for-nodejs-production)
* [Verwerking van Node.js-productieachtergrondtaken](#nodejs-production-background-job-processing)
  * [Onze Bree-serveropstelling voor productie](#our-bree-server-setup-for-production)
  * [Voorbeelden van productiebanen](#production-job-examples)
  * [Onze taakplanningspatronen voor Node.js-productie](#our-job-scheduling-patterns-for-nodejs-production)
* [Geautomatiseerd onderhoud voor Node.js-productietoepassingen](#automated-maintenance-for-production-nodejs-applications)
  * [Onze implementatie van de opruiming](#our-cleanup-implementation)
  * [Schijfruimtebeheer voor Node.js-productie](#disk-space-management-for-nodejs-production)
  * [Automatisering van infrastructuuronderhoud](#infrastructure-maintenance-automation)
* [Implementatiehandleiding voor Node.js-productie-implementatie](#nodejs-production-deployment-implementation-guide)
  * [Bestudeer onze actuele code voor de beste productiepraktijken](#study-our-actual-code-for-production-best-practices)
  * [Leer van onze blogberichten](#learn-from-our-blog-posts)
  * [Infrastructuurautomatisering voor Node.js-productie](#infrastructure-automation-for-nodejs-production)
  * [Onze casestudies](#our-case-studies)
* [Conclusie: aanbevolen procedures voor Node.js-productie-implementatie](#conclusion-nodejs-production-deployment-best-practices)
* [Volledige bronnenlijst voor Node.js-productie](#complete-resource-list-for-nodejs-production)
  * [Onze kernimplementatiebestanden](#our-core-implementation-files)
  * [Onze serverimplementaties](#our-server-implementations)
  * [Onze infrastructuurautomatisering](#our-infrastructure-automation)
  * [Onze technische blogberichten](#our-technical-blog-posts)
  * [Onze Enterprise Case Studies](#our-enterprise-case-studies)

## Voorwoord {#foreword}

Bij Forward Email hebben we jarenlang gewerkt aan het perfectioneren van de configuratie van onze Node.js-productieomgeving. Deze uitgebreide gids deelt onze beproefde best practices voor Node.js-productie-implementatie, met de nadruk op prestatieoptimalisatie, monitoring en de lessen die we hebben geleerd bij het schalen van Node.js-applicaties om miljoenen dagelijkse transacties te verwerken.

## Onze 573% Single Core Performance Optimalisatie Revolutie {#our-573-single-core-performance-optimization-revolution}

Toen we migreerden van Intel- naar AMD Ryzen-processors, behaalden we een **573% prestatieverbetering** in onze Node.js-applicaties. Dit was niet zomaar een kleine optimalisatie: het veranderde fundamenteel de prestaties van onze Node.js-applicaties in productie en toont het belang aan van single-core prestatieoptimalisatie voor elke Node.js-applicatie.

> \[!TIP]
> Voor best practices voor Node.js-productie-implementaties is de hardwarekeuze cruciaal. We hebben specifiek gekozen voor DataPacket-hosting vanwege de beschikbaarheid van hun AMD Ryzen, omdat single-core prestaties cruciaal zijn voor Node.js-applicaties, aangezien JavaScript single-threaded wordt uitgevoerd.

### Waarom Single Core-prestatieoptimalisatie belangrijk is voor Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Onze migratie van Intel naar AMD Ryzen resulteerde in:

* **573% prestatieverbetering** bij aanvraagverwerking (gedocumenteerd in [GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671)) op onze statuspagina
* **Verwerkingsvertragingen geëlimineerd** tot vrijwel directe reacties (genoemd in [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Betere prijs-prestatieverhouding** voor Node.js-productieomgevingen
* **Verbeterde responstijden** voor al onze applicatie-endpoints

De prestatieverbetering was zo significant dat we AMD Ryzen-processors nu essentieel achten voor elke serieuze Node.js-productie-implementatie, of u nu webapplicaties, API's, microservices of andere Node.js-workloads uitvoert.

### Gerelateerde content {#related-content}

Voor meer informatie over onze infrastructuurkeuzes, bekijk:

* [Beste e-maildoorstuurservice](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Prestatievergelijkingen
* [Zelf-gehoste oplossing](https://forwardemail.net/blog/docs/self-hosted-solution) - Hardware-aanbevelingen

## Node.js-productieomgeving instellen: onze technologie-stack {#nodejs-production-environment-setup-our-technology-stack}

Onze best practices voor Node.js-productie-implementatie omvatten weloverwogen technologische keuzes, gebaseerd op jarenlange productie-ervaring. Dit is wat we gebruiken en waarom deze keuzes van toepassing zijn op elke Node.js-applicatie:

### Pakketbeheerder: pnpm voor productie-efficiëntie {#package-manager-pnpm-for-production-efficiency}

**Wat we gebruiken:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (vastgezette versie)

We hebben voor pnpm gekozen boven npm en yarn voor onze Node.js-productieomgeving omdat:

* **Snellere installatietijden** in CI/CD-pipelines
* **Efficiëntie van schijfruimte** door hardlinking
* **Strikte afhankelijkheidsresolutie** die fantoomafhankelijkheden voorkomt
* **Betere prestaties** in productie-implementaties

> \[!NOTE]
> Als onderdeel van onze best practices voor Node.js-productie-implementaties, pinnen we exacte versies van kritieke tools zoals pnpm om consistent gedrag in alle omgevingen en op alle machines van teamleden te garanderen.

**Implementatiedetails:**

* [Onze package.json-configuratie](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Onze blogpost over het NPM-ecosysteem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webframework: Koa voor moderne Node.js-productie {#web-framework-koa-for-modern-nodejs-production}

**Wat wij gebruiken:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

We kozen Koa boven Express voor onze Node.js-productie-infrastructuur vanwege de moderne async/await-ondersteuning en overzichtelijke middleware-compositie. Onze oprichter Nick Baugh heeft bijgedragen aan zowel Express als Koa, waardoor we diepgaand inzicht hebben gekregen in beide frameworks voor gebruik in productie.

Deze patronen zijn van toepassing ongeacht of u REST API's, GraphQL-servers, webapplicaties of microservices bouwt.

**Onze implementatievoorbeelden:**

* [Webserverinstallatie](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-serverconfiguratie](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Implementatiehandleiding voor contactformulieren](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Achtergrondtaakverwerking: Bree voor productiebetrouwbaarheid {#background-job-processing-bree-for-production-reliability}

**Wat we gebruiken:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) scheduler

We hebben Bree ontwikkeld en onderhouden omdat bestaande taakplanners niet voldeden aan onze behoeften aan ondersteuning voor worker threads en moderne JavaScript-functionaliteit in Node.js-productieomgevingen. Dit geldt voor elke Node.js-applicatie die achtergrondverwerking, geplande taken of worker threads nodig heeft.

**Onze implementatievoorbeelden:**

* [Bree-serverinstallatie](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Al onze functieomschrijvingen](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2-gezondheidscontrolebaan](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementatie van opruimwerkzaamheden](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Foutbehandeling: @hapi/boom voor productiebetrouwbaarheid {#error-handling-hapiboom-for-production-reliability}

**Wat we gebruiken:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

We gebruiken @hapi/boom voor gestructureerde foutreacties in onze Node.js-productieapplicaties. Dit patroon werkt voor elke Node.js-applicatie die consistente foutverwerking nodig heeft.

**Onze implementatievoorbeelden:**

* [Helper voor foutclassificatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger-implementatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Hoe Node.js-applicaties in productie te monitoren {#how-to-monitor-nodejs-applications-in-production}

Onze aanpak voor het monitoren van Node.js-applicaties in productie is geëvolueerd door de jaren heen, waarin we applicaties op schaal hebben uitgevoerd. We implementeren monitoring op meerdere lagen om de betrouwbaarheid en prestaties van elk type Node.js-applicatie te garanderen.

### Node.js-productiebewaking op systeemniveau {#system-level-nodejs-production-monitoring}

**Onze kernimplementatie:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Wat we gebruiken:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Onze productiebewakingsdrempels (op basis van onze daadwerkelijke productiecode):

* **Limiet voor heapgrootte van 2 GB** met automatische waarschuwingen
* **Waarschuwingsdrempel voor 25% geheugengebruik**
* **Waarschuwingsdrempel voor 80% CPU-gebruik**
* **Waarschuwingsdrempel voor 75% schijfgebruik**

> \[!WARNING]
> Deze drempelwaarden werken voor onze specifieke hardwareconfiguratie. Bekijk bij de implementatie van Node.js-productiemonitoring onze monitor-server.js-implementatie om de exacte logica te begrijpen en de waarden aan te passen aan uw configuratie.

### Monitoring op applicatieniveau voor Node.js-productie {#application-level-monitoring-for-nodejs-production}

**Onze foutclassificatie:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Deze helper maakt onderscheid tussen:

* **Werkelijke codefouten** die onmiddellijke aandacht vereisen
* **Gebruikersfouten** die verwacht gedrag zijn
* **Externe servicefouten** die we niet kunnen beheersen

Dit patroon is van toepassing op alle Node.js-toepassingen: webapps, API's, microservices of achtergrondservices.

**Onze logging-implementatie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

We maken gebruik van uitgebreide veldredactie om gevoelige informatie te beschermen, terwijl we tegelijkertijd nuttige debugmogelijkheden in onze Node.js-productieomgeving behouden.

### Toepassingsspecifieke monitoring {#application-specific-monitoring}

**Onze serverimplementaties:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Wachtrijbewaking:** We implementeren wachtrijlimieten van 5 GB en time-outs van 180 seconden voor de verwerking van aanvragen om resource-uitputting te voorkomen. Deze patronen zijn van toepassing op elke Node.js-applicatie met wachtrijen of achtergrondverwerking.

## Node.js-productiebewaking met PM2-gezondheidscontroles {#nodejs-production-monitoring-with-pm2-health-checks}

We hebben onze Node.js-productieomgeving geoptimaliseerd met PM2, dankzij jarenlange productie-ervaring. Onze PM2-statuscontroles zijn essentieel voor het behoud van de betrouwbaarheid van elke Node.js-applicatie.

### Ons PM2-gezondheidscontrolesysteem {#our-pm2-health-check-system}

**Onze kernimplementatie:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Onze Node.js-productiemonitoring met PM2-statuscontroles omvat:

* **Wordt elke 20 minuten uitgevoerd** via cron-planning
* **Vereist minimaal 15 minuten uptime** voordat een proces als gezond wordt beschouwd
* **Valideert de processtatus en het geheugengebruik**
* **Herstart automatisch mislukte processen**
* **Voorkomt herstartlussen** door middel van intelligente statuscontrole

> \[!CAUTION]
> Voor de best practices voor Node.js-productie-implementaties vereisen we een uptime van minimaal 15 minuten voordat een proces als gezond wordt beschouwd om herstartlussen te voorkomen. Dit voorkomt opeenvolgende fouten wanneer processen problemen hebben met geheugen of andere problemen.

### Onze PM2-productieconfiguratie {#our-pm2-production-configuration}

**Onze ecosysteemconfiguratie:** Bestudeer onze serveropstartbestanden voor de configuratie van de Node.js-productieomgeving:

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-planner](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Deze patronen zijn van toepassing ongeacht of u Express-apps, Koa-servers, GraphQL API's of andere Node.js-toepassingen uitvoert.

### Geautomatiseerde PM2-implementatie {#automated-pm2-deployment}

**PM2-implementatie:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

We automatiseren onze volledige PM2-configuratie via Ansible om consistente Node.js-productie-implementaties op al onze servers te garanderen.

## Productiefoutverwerkings- en classificatiesysteem {#production-error-handling-and-classification-system}

Een van onze meest waardevolle best practices voor Node.js-productie-implementatie is intelligente foutclassificatie die van toepassing is op elke Node.js-applicatie:

### Onze isCodeBug-implementatie voor productie {#our-iscodebug-implementation-for-production}

**Bron:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Deze helper biedt intelligente foutclassificatie voor Node.js-toepassingen in productie om:

* **Prioriteit geven aan daadwerkelijke bugs** boven gebruikersfouten
* **Onze incidentrespons verbeteren** door ons te richten op echte problemen
* **Minder waarschuwingsmoeheid** door verwachte gebruikersfouten
* **Beter inzicht** in applicatie- versus door gebruikers gegenereerde problemen

Dit patroon werkt voor alle Node.js-toepassingen, of u nu e-commercesites, SaaS-platforms, API's of microservices bouwt.

### Integratie met onze productieregistratie {#integration-with-our-production-logging}

**Onze logger-integratie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Onze logger gebruikt `isCodeBug` om waarschuwingsniveaus en veldredactie te bepalen. Zo worden we op de hoogte gehouden van echte problemen en wordt ruis in onze Node.js-productieomgeving weggefilterd.

### Gerelateerde inhoud {#related-content-1}

Meer informatie over onze foutverwerkingspatronen:

* [Het bouwen van een betrouwbaar betalingssysteem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Patronen voor foutafhandeling
* [E-mailprivacybescherming](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Afhandeling van beveiligingsfouten

## Geavanceerde prestatie-debugging met v8-profiler-next en cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

We gebruiken geavanceerde profileringstools om heap snapshots te analyseren en OOM (Out of Memory)-problemen, prestatieknelpunten en Node.js-geheugenproblemen in onze productieomgeving te debuggen. Deze tools zijn essentieel voor elke Node.js-applicatie die geheugenlekken of prestatieproblemen ondervindt.

### Onze profileringsaanpak voor Node.js-productie {#our-profiling-approach-for-nodejs-production}

**Door ons aanbevolen gereedschap:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Voor het genereren van heap-snapshots en CPU-profielen
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Voor het analyseren van CPU-profielen en heap-snapshots

> \[!TIP]
> We gebruiken v8-profiler-next en cpupro samen om een complete performance debugging workflow voor onze Node.js-applicaties te creëren. Deze combinatie helpt ons geheugenlekken en prestatieknelpunten te identificeren en onze productiecode te optimaliseren.

### Hoe we heap-snapshotanalyse implementeren {#how-we-implement-heap-snapshot-analysis}

**Onze monitoring-implementatie:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Onze productiemonitoring omvat het automatisch genereren van heap snapshots wanneer geheugendrempels worden overschreden. Dit helpt ons OOM-problemen te debuggen voordat ze applicatiecrashes veroorzaken.

**Belangrijkste implementatiepatronen:**

* **Automatische snapshots** wanneer de heapgrootte de drempelwaarde van 2 GB overschrijdt
* **Signaalgebaseerde profilering** voor on-demand analyse in productie
* **Bewaarbeleid** voor het beheer van snapshotopslag
* **Integratie met onze opschoontaken** voor geautomatiseerd onderhoud

### Prestatie-debugworkflow {#performance-debugging-workflow}

**Bestudeer onze daadwerkelijke implementatie:**

* [Monitor serverimplementatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap monitoring en snapshotgeneratie
* [Opruimklus](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Snapshotbehoud en -opschoning
* [Logger-integratie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Prestatielogging

### Aanbevolen implementatie voor uw Node.js-applicatie {#recommended-implementation-for-your-nodejs-application}

**Voor heap snapshot-analyse:**

1. **Installeer v8-profiler-next** voor het genereren van snapshots
2. **Gebruik cpupro** voor het analyseren van de gegenereerde snapshots
3. **Implementeer monitoringdrempels** vergelijkbaar met onze monitor-server.js
4. **Stel automatische opschoning in** om de snapshotopslag te beheren
5. **Maak signaalhandlers** voor on-demand profilering in productie

**Voor CPU-profilering:**

1. **Genereer CPU-profielen** tijdens perioden met hoge belasting
2. **Analyseer met CPUPro** om knelpunten te identificeren
3. **Focus op hot paths** en optimalisatiemogelijkheden
4. **Monitor prestatieverbeteringen voor/na**

> \[!WARNING]
> Het genereren van heap snapshots en CPU-profielen kan de prestaties beïnvloeden. We raden aan om throttling te implementeren en profilering alleen in te schakelen bij het onderzoeken van specifieke problemen of tijdens onderhoudsperiodes.

### Integratie met onze productiemonitoring {#integration-with-our-production-monitoring}

Onze profileringshulpmiddelen integreren met onze bredere monitoringstrategie:

* **Automatische triggering** op basis van geheugen-/CPU-drempelwaarden
* **Waarschuwingsintegratie** wanneer prestatieproblemen worden gedetecteerd
* **Historische analyse** om prestatietrends in de loop van de tijd te volgen
* **Correlatie met applicatiestatistieken** voor uitgebreide foutopsporing

Dankzij deze aanpak konden we geheugenlekken identificeren en oplossen, hot code-paden optimaliseren en stabiele prestaties in onze Node.js-productieomgeving garanderen.

## Node.js Productie-infrastructuurbeveiliging {#nodejs-production-infrastructure-security}

We implementeren uitgebreide beveiliging voor onze Node.js-productie-infrastructuur via Ansible-automatisering. Deze procedures zijn van toepassing op elke Node.js-applicatie:

### Systeembeveiliging voor Node.js-productie {#system-level-security-for-nodejs-production}

**Onze Ansible-implementatie:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Onze belangrijkste beveiligingsmaatregelen voor Node.js-productieomgevingen:

* **Swap uitgeschakeld** om te voorkomen dat gevoelige gegevens naar schijf worden geschreven
* **Coredumps uitgeschakeld** om te voorkomen dat geheugendumps gevoelige informatie bevatten
* **USB-opslag geblokkeerd** om ongeautoriseerde gegevenstoegang te voorkomen
* **Kernelparameterafstemming** voor zowel beveiliging als prestaties

> \[!WARNING]
> Bij het implementeren van best practices voor Node.js-productie-implementaties kan het uitschakelen van swap-bewerkingen leiden tot geheugenuitval als uw applicatie het beschikbare RAM-geheugen overschrijdt. We monitoren het geheugengebruik zorgvuldig en passen onze servers hierop aan.

### Toepassingsbeveiliging voor Node.js-toepassingen {#application-security-for-nodejs-applications}

**Onze logveldredactie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

We verwijderen gevoelige velden uit logs, waaronder wachtwoorden, tokens, API-sleutels en persoonlijke gegevens. Dit beschermt de privacy van gebruikers en behoudt de debugmogelijkheden in elke Node.js-productieomgeving.

### Automatisering van infrastructuurbeveiliging {#infrastructure-security-automation}

**Onze volledige Ansible-configuratie voor Node.js-productie:**

* [Beveiligingshandboek](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-sleutelbeheer](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certificaatbeheer](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-configuratie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Onze beveiligingsinhoud {#our-security-content}

Lees meer over onze beveiligingsaanpak:

* [Beste beveiligingsauditbedrijven](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe versleutelde e-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Waarom open source e-mailbeveiliging?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Databasearchitectuur voor Node.js-toepassingen {#database-architecture-for-nodejs-applications}

We gebruiken een hybride databasebenadering die geoptimaliseerd is voor onze Node.js-applicaties. Deze patronen kunnen worden aangepast voor elke Node.js-applicatie:

### SQLite-implementatie voor Node.js-productie {#sqlite-implementation-for-nodejs-production}

**Wat wij gebruiken:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Onze configuratie:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

We gebruiken SQLite voor gebruikerspecifieke gegevens in onze Node.js-applicaties omdat het het volgende biedt:

* **Gegevensisolatie** per gebruiker/tenant
* **Betere prestaties** voor query's voor één gebruiker
* **Vereenvoudigde back-up** en migratie
* **Verminderde complexiteit** vergeleken met gedeelde databases

Dit patroon werkt goed voor SaaS-applicaties, multi-tenant systemen en alle Node.js-applicaties die gegevensisolatie nodig hebben.

### MongoDB-implementatie voor Node.js-productie {#mongodb-implementation-for-nodejs-production}

**Wat wij gebruiken:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Onze installatie-implementatie:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Onze configuratie:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Wij gebruiken MongoDB voor applicatiegegevens in onze Node.js-productieomgeving omdat het het volgende biedt:

* **Flexibel schema** voor evoluerende datastructuren
* **Betere prestaties** voor complexe query's
* **Horizontale schaalbaarheid**
* **Rijke querytaal**

> \[!NOTE]
> Onze hybride aanpak is geoptimaliseerd voor onze specifieke use case. Bestudeer onze daadwerkelijke databasegebruikspatronen in de codebase om te zien of deze aanpak past bij de behoeften van uw Node.js-applicatie.

## Node.js Productie Achtergrondtaakverwerking {#nodejs-production-background-job-processing}

We hebben onze achtergrondtaakarchitectuur rond Bree gebouwd voor een betrouwbare Node.js-productie-implementatie. Dit geldt voor elke Node.js-applicatie die achtergrondverwerking nodig heeft:

### Onze Bree-serverinstallatie voor productie {#our-bree-server-setup-for-production}

**Onze belangrijkste implementatie:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Onze Ansible-implementatie:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Voorbeelden van productietaken {#production-job-examples}

**Gezondheidsmonitoring:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisering van opruiming:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Al onze vacatures:** [Blader door onze volledige vacaturebank](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Deze patronen zijn van toepassing op elke Node.js-toepassing die het volgende nodig heeft:

* Geplande taken (gegevensverwerking, rapporten, opschonen)
* Achtergrondverwerking (afbeeldingen verkleinen, e-mails verzenden, gegevens importeren)
* Statusbewaking en -onderhoud
* Gebruik van workerthreads voor CPU-intensieve taken

### Onze taakplanningspatronen voor Node.js-productie {#our-job-scheduling-patterns-for-nodejs-production}

Bestudeer onze actuele planningspatronen in onze vacaturegids om het volgende te begrijpen:

* Hoe we cron-achtige planning implementeren in Node.js-productie
* Onze foutverwerking en retry-logica
* Hoe we workerthreads gebruiken voor CPU-intensieve taken

## Geautomatiseerd onderhoud voor Node.js-productietoepassingen {#automated-maintenance-for-production-nodejs-applications}

We implementeren proactief onderhoud om veelvoorkomende productieproblemen in Node.js te voorkomen. Deze patronen zijn van toepassing op elke Node.js-applicatie:

### Onze opruimingsimplementatie {#our-cleanup-implementation}

**Bron:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Ons geautomatiseerde onderhoud voor Node.js-productietoepassingen richt zich op:

* **Tijdelijke bestanden** ouder dan 24 uur
* **Logbestanden** die de bewaartermijn overschrijden
* **Cachebestanden** en tijdelijke gegevens
* **Geüploade bestanden** die niet langer nodig zijn
* **Heap snapshots** van prestatie-debugging

Deze patronen zijn van toepassing op elke Node.js-toepassing die tijdelijke bestanden, logboeken of gecachte gegevens genereert.

### Schijfruimtebeheer voor Node.js-productie {#disk-space-management-for-nodejs-production}

**Onze monitoringdrempels:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Wachtrijlimieten** voor achtergrondverwerking
* **Waarschuwingsdrempel 75% schijfgebruik**
* **Automatisch opschonen** bij overschrijding van de drempels

### Automatisering van infrastructuuronderhoud {#infrastructure-maintenance-automation}

**Onze Ansible-automatisering voor Node.js-productie:**

* [Implementatie van de omgeving](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Beheer van implementatiesleutels](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Implementatiehandleiding voor Node.js-productie-implementatie {#nodejs-production-deployment-implementation-guide}

### Bestudeer onze daadwerkelijke code voor best practices voor productie {#study-our-actual-code-for-production-best-practices}

**Begin met deze sleutelbestanden voor het instellen van de Node.js-productieomgeving:**

1. **Configuratie:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoring:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Foutafhandeling:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logboekregistratie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Processtatus:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Leer van onze blogberichten {#learn-from-our-blog-posts}

**Onze technische implementatiehandleidingen voor Node.js-productie:**

* [NPM-pakketten ecosysteem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Betalingssystemen bouwen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementatie van e-mailprivacy](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-contactformulieren](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-mailintegratie](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastructuurautomatisering voor Node.js-productie {#infrastructure-automation-for-nodejs-production}

**Onze Ansible-playbooks om te bestuderen voor Node.js-productie-implementatie:**

* [Volledige handleidingen directory](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Beveiligingsversterking](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-installatie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Onze casestudies {#our-case-studies}

**Onze bedrijfsimplementaties:**

* [Linux Foundation casestudy](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonieke Ubuntu-casestudy](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumni-e-mail doorsturen](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Conclusie: Aanbevolen procedures voor Node.js-productie-implementatie {#conclusion-nodejs-production-deployment-best-practices}

Onze Node.js-productie-infrastructuur laat zien dat Node.js-applicaties betrouwbaarheid op ondernemingsniveau kunnen bereiken door:

* **Bewezen hardwarekeuzes** (AMD Ryzen voor 573% single-core prestatie-optimalisatie)
* **In de praktijk geteste Node.js-productiemonitoring** met specifieke drempels en geautomatiseerde reacties
* **Slimme foutclassificatie** om de respons op incidenten in productieomgevingen te verbeteren
* **Geavanceerde prestatiedebugging** met v8-profiler-next en cpupro voor OOM-preventie
* **Uitgebreide beveiligingsversterking** door Ansible-automatisering
* **Hybride databasearchitectuur** geoptimaliseerd voor applicatiebehoeften
* **Geautomatiseerd onderhoud** om veelvoorkomende Node.js-productieproblemen te voorkomen

**Belangrijkste punt:** Bestudeer onze daadwerkelijke implementatiebestanden en blogposts in plaats van algemene best practices te volgen. Onze codebase biedt realistische patronen voor Node.js-productie-implementatie die kunnen worden aangepast voor elke Node.js-applicatie - webapps, API's, microservices of achtergrondservices.

## Volledige bronnenlijst voor Node.js-productie {#complete-resource-list-for-nodejs-production}

### Onze kernimplementatiebestanden {#our-core-implementation-files}

* [Hoofdconfiguratie](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Pakketafhankelijkheden](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverbewaking](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Foutclassificatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logboeksysteem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2-gezondheidscontroles](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Geautomatiseerde opruiming](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Onze serverimplementaties {#our-server-implementations}

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-planner](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Onze infrastructuurautomatisering {#our-infrastructure-automation}

* [Al onze Ansible-playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Beveiligingsversterking](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-installatie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databaseconfiguratie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Onze technische blogberichten {#our-technical-blog-posts}

* [NPM-ecosysteemanalyse](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementatie van betalingssystemen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Technische handleiding voor e-mailprivacy](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-contactformulieren](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-mailintegratie](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Zelf-gehoste oplossingsgids](https://forwardemail.net/blog/docs/self-hosted-solution)

### Onze Enterprise Case Studies {#our-enterprise-case-studies}

* [Linux Foundation-implementatie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonieke Ubuntu-casestudy](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Naleving door de federale overheid](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni e-mailsystemen](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)