# Hoe Node.js Productie-Infrastructuur te Optimaliseren: Best Practices {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Onze 573% Single Core Prestatie Optimalisatie Revolutie](#our-573-single-core-performance-optimization-revolution)
  * [Waarom Single Core Prestatie Optimalisatie Belangrijk is voor Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Gerelateerde Inhoud](#related-content)
* [Node.js Productieomgeving Setup: Onze Technologie Stack](#nodejs-production-environment-setup-our-technology-stack)
  * [Package Manager: pnpm voor Productie Efficiëntie](#package-manager-pnpm-for-production-efficiency)
  * [Web Framework: Koa voor Moderne Node.js Productie](#web-framework-koa-for-modern-nodejs-production)
  * [Achtergrond Taakverwerking: Bree voor Productie Betrouwbaarheid](#background-job-processing-bree-for-production-reliability)
  * [Foutafhandeling: @hapi/boom voor Productie Betrouwbaarheid](#error-handling-hapiboom-for-production-reliability)
* [Hoe Node.js Applicaties in Productie te Monitoren](#how-to-monitor-nodejs-applications-in-production)
  * [Systeemniveau Node.js Productie Monitoring](#system-level-nodejs-production-monitoring)
  * [Applicatieniveau Monitoring voor Node.js Productie](#application-level-monitoring-for-nodejs-production)
  * [Applicatie-specifieke Monitoring](#application-specific-monitoring)
* [Node.js Productie Monitoring met PM2 Health Checks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Ons PM2 Health Check Systeem](#our-pm2-health-check-system)
  * [Onze PM2 Productie Configuratie](#our-pm2-production-configuration)
  * [Geautomatiseerde PM2 Deployment](#automated-pm2-deployment)
* [Productie Foutafhandeling en Classificatie Systeem](#production-error-handling-and-classification-system)
  * [Onze isCodeBug Implementatie voor Productie](#our-iscodebug-implementation-for-production)
  * [Integratie met Onze Productie Logging](#integration-with-our-production-logging)
  * [Gerelateerde Inhoud](#related-content-1)
* [Geavanceerde Prestatie Debugging met v8-profiler-next en cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Onze Profilering Aanpak voor Node.js Productie](#our-profiling-approach-for-nodejs-production)
  * [Hoe Wij Heap Snapshot Analyse Implementeren](#how-we-implement-heap-snapshot-analysis)
  * [Prestatie Debugging Workflow](#performance-debugging-workflow)
  * [Aanbevolen Implementatie voor Uw Node.js Applicatie](#recommended-implementation-for-your-nodejs-application)
  * [Integratie met Onze Productie Monitoring](#integration-with-our-production-monitoring)
* [Node.js Productie Infrastructuur Beveiliging](#nodejs-production-infrastructure-security)
  * [Systeemniveau Beveiliging voor Node.js Productie](#system-level-security-for-nodejs-production)
  * [Applicatiebeveiliging voor Node.js Applicaties](#application-security-for-nodejs-applications)
  * [Infrastructuur Beveiliging Automatisering](#infrastructure-security-automation)
  * [Onze Beveiligingsinhoud](#our-security-content)
* [Database Architectuur voor Node.js Applicaties](#database-architecture-for-nodejs-applications)
  * [SQLite Implementatie voor Node.js Productie](#sqlite-implementation-for-nodejs-production)
  * [MongoDB Implementatie voor Node.js Productie](#mongodb-implementation-for-nodejs-production)
* [Node.js Productie Achtergrond Taakverwerking](#nodejs-production-background-job-processing)
  * [Onze Bree Server Setup voor Productie](#our-bree-server-setup-for-production)
  * [Productie Taak Voorbeelden](#production-job-examples)
  * [Onze Taakplanning Patronen voor Node.js Productie](#our-job-scheduling-patterns-for-nodejs-production)
* [Geautomatiseerd Onderhoud voor Productie Node.js Applicaties](#automated-maintenance-for-production-nodejs-applications)
  * [Onze Cleanup Implementatie](#our-cleanup-implementation)
  * [Schijfruimtebeheer voor Node.js Productie](#disk-space-management-for-nodejs-production)
  * [Infrastructuur Onderhoud Automatisering](#infrastructure-maintenance-automation)
* [Node.js Productie Deployment Implementatie Gids](#nodejs-production-deployment-implementation-guide)
  * [Bestudeer Onze Werkelijke Code voor Productie Best Practices](#study-our-actual-code-for-production-best-practices)
  * [Leer van Onze Blogposts](#learn-from-our-blog-posts)
  * [Infrastructuur Automatisering voor Node.js Productie](#infrastructure-automation-for-nodejs-production)
  * [Onze Case Studies](#our-case-studies)
* [Conclusie: Node.js Productie Deployment Best Practices](#conclusion-nodejs-production-deployment-best-practices)
* [Complete Bronnenlijst voor Node.js Productie](#complete-resource-list-for-nodejs-production)
  * [Onze Kern Implementatie Bestanden](#our-core-implementation-files)
  * [Onze Server Implementaties](#our-server-implementations)
  * [Onze Infrastructuur Automatisering](#our-infrastructure-automation)
  * [Onze Technische Blogposts](#our-technical-blog-posts)
  * [Onze Enterprise Case Studies](#our-enterprise-case-studies)
## Voorwoord {#foreword}

Bij Forward Email hebben we jaren besteed aan het perfectioneren van onze Node.js productieomgeving. Deze uitgebreide gids deelt onze beproefde best practices voor Node.js productie-implementatie, met de focus op prestatieoptimalisatie, monitoring en de lessen die we hebben geleerd bij het opschalen van Node.js-applicaties om miljoenen dagelijkse transacties aan te kunnen.

## Onze 573% Single Core Prestatieoptimalisatie Revolutie {#our-573-single-core-performance-optimization-revolution}

Toen we migreerden van Intel naar AMD Ryzen-processors, behaalden we een **573% prestatieverbetering** in onze Node.js-applicaties. Dit was niet zomaar een kleine optimalisatie—het veranderde fundamenteel hoe onze Node.js-applicaties presteren in productie en toont het belang aan van single core prestatieoptimalisatie voor elke Node.js-applicatie.

> \[!TIP]
> Voor best practices bij Node.js productie-implementatie is de keuze van hardware cruciaal. We kozen specifiek voor DataPacket hosting vanwege hun AMD Ryzen beschikbaarheid, omdat single-core prestatie essentieel is voor Node.js-applicaties aangezien JavaScript-uitvoering single-threaded is.

### Waarom Single Core Prestatieoptimalisatie Belangrijk is voor Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Onze migratie van Intel naar AMD Ryzen resulteerde in:

* **573% prestatieverbetering** in requestverwerking (gedocumenteerd in [onze statuspagina's GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminatie van verwerkingsvertragingen** tot bijna directe reacties (genoemd in [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Betere prijs-prestatieverhouding** voor Node.js productieomgevingen
* **Verbeterde responstijden** over al onze applicatie-eindpunten

De prestatieverbetering was zo significant dat we AMD Ryzen-processors nu essentieel achten voor elke serieuze Node.js productie-implementatie, of je nu webapplicaties, API's, microservices of andere Node.js workloads draait.

### Gerelateerde Inhoud {#related-content}

Voor meer details over onze infrastructuurkeuzes, bekijk:

* [Beste Email Forwarding Service](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Prestatievergelijkingen
* [Zelf-gehoste Oplossing](https://forwardemail.net/blog/docs/self-hosted-solution) - Hardware-aanbevelingen

## Node.js Productieomgeving Setup: Onze Technologie Stack {#nodejs-production-environment-setup-our-technology-stack}

Onze best practices voor Node.js productie-implementatie omvatten weloverwogen technologiekeuzes gebaseerd op jarenlange productie-ervaring. Dit is wat we gebruiken en waarom deze keuzes van toepassing zijn op elke Node.js-applicatie:

### Package Manager: pnpm voor Productie-efficiëntie {#package-manager-pnpm-for-production-efficiency}

**Wat we gebruiken:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (vastgezette versie)

We kozen pnpm boven npm en yarn voor onze Node.js productieomgeving setup vanwege:

* **Snellere installatietijden** in CI/CD pipelines
* **Schijfruimte-efficiëntie** door hard linking
* **Strikte afhankelijkheidsresolutie** die phantom dependencies voorkomt
* **Betere prestaties** in productie-implementaties

> \[!NOTE]
> Als onderdeel van onze best practices voor Node.js productie-implementatie zetten we exacte versies van kritieke tools zoals pnpm vast om consistent gedrag te garanderen over alle omgevingen en machines van teamleden.

**Implementatiedetails:**

* [Onze package.json configuratie](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Onze NPM ecosysteem blogpost](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Framework: Koa voor Moderne Node.js Productie {#web-framework-koa-for-modern-nodejs-production}

**Wat we gebruiken:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
We kozen voor Koa boven Express voor onze Node.js productie-infrastructuur vanwege de moderne async/await-ondersteuning en schonere middleware-compositie. Onze oprichter Nick Baugh heeft bijgedragen aan zowel Express als Koa, wat ons diep inzicht geeft in beide frameworks voor productiegebruik.

Deze patronen zijn van toepassing of je nu REST API's, GraphQL-servers, webapplicaties of microservices bouwt.

**Onze implementatievoorbeelden:**

* [Webserver setup](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API serverconfiguratie](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Contactformulier implementatiegids](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Achtergrondtaakverwerking: Bree voor productbetrouwbaarheid {#background-job-processing-bree-for-production-reliability}

**Wat we gebruiken:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) scheduler

We hebben Bree gemaakt en onderhouden omdat bestaande taakplanners niet voldeden aan onze behoeften voor worker thread-ondersteuning en moderne JavaScript-functies in productie Node.js-omgevingen. Dit geldt voor elke Node.js-applicatie die achtergrondverwerking, geplande taken of worker threads nodig heeft.

**Onze implementatievoorbeelden:**

* [Bree server setup](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Al onze taakdefinities](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 health check taak](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Cleanup taak implementatie](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Foutafhandeling: @hapi/boom voor productbetrouwbaarheid {#error-handling-hapiboom-for-production-reliability}

**Wat we gebruiken:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

We gebruiken @hapi/boom voor gestructureerde foutreacties in al onze Node.js productieapplicaties. Dit patroon werkt voor elke Node.js-applicatie die consistente foutafhandeling nodig heeft.

**Onze implementatievoorbeelden:**

* [Foutclassificatie helper](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger implementatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Hoe Node.js-applicaties in productie te monitoren {#how-to-monitor-nodejs-applications-in-production}

Onze aanpak voor het monitoren van Node.js-applicaties in productie is geëvolueerd door jarenlange ervaring met het draaien van applicaties op schaal. We implementeren monitoring op meerdere lagen om betrouwbaarheid en prestaties te waarborgen voor elk type Node.js-applicatie.

### Systeemniveau Node.js productie monitoring {#system-level-nodejs-production-monitoring}

**Onze kernimplementatie:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Wat we gebruiken:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Onze productie monitoring drempels (uit onze daadwerkelijke productiecode):

* **2GB heapgrootte limiet** met automatische waarschuwingen
* **25% geheugengebruik** waarschuwingsdrempel
* **80% CPU-gebruik** waarschuwingsdrempel
* **75% schijfgebruik** waarschuwingsdrempel

> \[!WARNING]
> Deze drempels werken voor onze specifieke hardwareconfiguratie. Bij het implementeren van Node.js productie monitoring, bekijk onze monitor-server.js implementatie om de exacte logica te begrijpen en pas de waarden aan voor jouw setup.

### Applicatieniveau monitoring voor Node.js productie {#application-level-monitoring-for-nodejs-production}

**Onze foutclassificatie:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Deze helper onderscheidt tussen:

* **Werkelijke codefouten** die onmiddellijke aandacht vereisen
* **Gebruikersfouten** die verwacht gedrag zijn
* **Externe servicefouten** die we niet kunnen controleren

Dit patroon is van toepassing op elke Node.js-applicatie - webapps, API's, microservices of achtergrondservices.
**Onze logging-implementatie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

We implementeren uitgebreide veldredactie om gevoelige informatie te beschermen terwijl we nuttige debugmogelijkheden behouden in onze Node.js productieomgeving.

### Applicatie-specifieke monitoring {#application-specific-monitoring}

**Onze serverimplementaties:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Queue monitoring:** We implementeren 5GB queue-limieten en time-outs van 180 seconden voor verzoekverwerking om uitputting van resources te voorkomen. Deze patronen zijn toepasbaar op elke Node.js-applicatie met queues of achtergrondverwerking.


## Node.js productie monitoring met PM2 health checks {#nodejs-production-monitoring-with-pm2-health-checks}

We hebben onze Node.js productieomgeving met PM2 verfijnd door jarenlange productie-ervaring. Onze PM2 health checks zijn essentieel voor het behouden van betrouwbaarheid in elke Node.js-applicatie.

### Ons PM2 health check systeem {#our-pm2-health-check-system}

**Onze kernimplementatie:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Onze Node.js productie monitoring met PM2 health checks omvat:

* **Wordt elke 20 minuten uitgevoerd** via cron-scheduling
* **Vereist minimaal 15 minuten uptime** voordat een proces als gezond wordt beschouwd
* **Valideert processtatus en geheugengebruik**
* **Herstart automatisch gefaalde processen**
* **Voorkomt herstartlussen** door intelligente health checks

> \[!CAUTION]
> Voor best practices bij Node.js productie-implementaties vereisen we 15+ minuten uptime voordat een proces als gezond wordt beschouwd om herstartlussen te vermijden. Dit voorkomt kettingfouten wanneer processen worstelen met geheugen of andere problemen.

### Onze PM2 productieconfiguratie {#our-pm2-production-configuration}

**Onze ecosysteemsetup:** Bestudeer onze server-startbestanden voor Node.js productieomgeving setup:

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Deze patronen zijn toepasbaar of je nu Express-apps, Koa-servers, GraphQL-API's of andere Node.js-applicaties draait.

### Geautomatiseerde PM2 deployment {#automated-pm2-deployment}

**PM2 deployment:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

We automatiseren onze volledige PM2 setup via Ansible om consistente Node.js productie-implementaties op al onze servers te waarborgen.


## Productie foutafhandeling en classificatiesysteem {#production-error-handling-and-classification-system}

Een van onze meest waardevolle best practices voor Node.js productie-implementaties is intelligente foutclassificatie die toepasbaar is op elke Node.js-applicatie:

### Onze isCodeBug-implementatie voor productie {#our-iscodebug-implementation-for-production}

**Bron:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Deze helper biedt intelligente foutclassificatie voor Node.js-applicaties in productie om:

* **Werkelijke bugs te prioriteren** boven gebruikersfouten
* **Onze incidentrespons te verbeteren** door te focussen op echte problemen
* **Alert-moeheid te verminderen** door verwachte gebruikersfouten
* **Beter inzicht te krijgen** in applicatie- versus gebruikersgegenereerde problemen

Dit patroon werkt voor elke Node.js-applicatie - of je nu e-commerce sites, SaaS-platforms, API's of microservices bouwt.

### Integratie met onze productie-logging {#integration-with-our-production-logging}

**Onze logger-integratie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Onze logger gebruikt `isCodeBug` om waarschuwingsniveaus en veldredactie te bepalen, zodat we op de hoogte worden gesteld van echte problemen terwijl we ruis in onze Node.js productieomgeving filteren.

### Gerelateerde Inhoud {#related-content-1}

Leer meer over onze foutafhandelingspatronen:

* [Betrouwbaar Betaalsysteem Bouwen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Foutafhandelingspatronen
* [E-mail Privacybescherming](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Beveiligingsfoutafhandeling


## Geavanceerde Prestatie-Debugging met v8-profiler-next en cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

We gebruiken geavanceerde profilingtools om heap snapshots te analyseren en OOM (Out of Memory) problemen, prestatieknelpunten en Node.js geheugenproblemen in onze productieomgeving te debuggen. Deze tools zijn essentieel voor elke Node.js applicatie die te maken heeft met geheugenlekken of prestatieproblemen.

### Onze Profiling Aanpak voor Node.js Productie {#our-profiling-approach-for-nodejs-production}

**Aanbevolen tools:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Voor het genereren van heap snapshots en CPU-profielen
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Voor het analyseren van CPU-profielen en heap snapshots

> \[!TIP]
> We gebruiken v8-profiler-next en cpupro samen om een complete prestatie-debugging workflow te creëren voor onze Node.js applicaties. Deze combinatie helpt ons geheugenlekken, prestatieknelpunten te identificeren en onze productiecode te optimaliseren.

### Hoe Wij Heap Snapshot Analyse Implementeren {#how-we-implement-heap-snapshot-analysis}

**Onze monitoring implementatie:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Onze productie monitoring omvat automatische generatie van heap snapshots wanneer geheugendrempels worden overschreden. Dit helpt ons OOM-problemen te debuggen voordat ze applicatiecrashes veroorzaken.

**Belangrijke implementatiepatronen:**

* **Automatische snapshots** wanneer heapgrootte de 2GB drempel overschrijdt
* **Signaal-gebaseerde profiling** voor analyse op aanvraag in productie
* **Beleid voor retentie** voor het beheren van snapshot opslag
* **Integratie met onze cleanup jobs** voor geautomatiseerd onderhoud

### Prestatie-Debugging Workflow {#performance-debugging-workflow}

**Bestudeer onze daadwerkelijke implementatie:**

* [Monitor server implementatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap monitoring en snapshot generatie
* [Cleanup job](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Snapshot retentie en opruiming
* [Logger integratie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Prestatie logging

### Aanbevolen Implementatie voor Uw Node.js Applicatie {#recommended-implementation-for-your-nodejs-application}

**Voor heap snapshot analyse:**

1. **Installeer v8-profiler-next** voor snapshot generatie
2. **Gebruik cpupro** voor het analyseren van de gegenereerde snapshots
3. **Implementeer monitoring drempels** vergelijkbaar met onze monitor-server.js
4. **Stel geautomatiseerde opruiming in** om snapshot opslag te beheren
5. **Maak signaal handlers aan** voor profiling op aanvraag in productie

**Voor CPU profiling:**

1. **Genereer CPU-profielen** tijdens periodes van hoge belasting
2. **Analyseer met cpupro** om knelpunten te identificeren
3. **Focus op hot paths** en optimalisatiemogelijkheden
4. **Monitor voor/na** prestatieverbeteringen

> \[!WARNING]
> Het genereren van heap snapshots en CPU-profielen kan de prestaties beïnvloeden. We raden aan throttling te implementeren en profiling alleen in te schakelen bij het onderzoeken van specifieke problemen of tijdens onderhoudsvensters.

### Integratie met Onze Productie Monitoring {#integration-with-our-production-monitoring}

Onze profilingtools integreren met onze bredere monitoringstrategie:

* **Automatische activering** op basis van geheugen/CPU drempels
* **Alert integratie** wanneer prestatieproblemen worden gedetecteerd
* **Historische analyse** om prestatie-trends in de tijd te volgen
* **Correlatie met applicatiemetrics** voor uitgebreide debugging
Deze aanpak heeft ons geholpen geheugenlekken te identificeren en op te lossen, hot code paths te optimaliseren en stabiele prestaties te behouden in onze Node.js productieomgeving.


## Node.js Productie Infrastructuur Beveiliging {#nodejs-production-infrastructure-security}

We implementeren uitgebreide beveiliging voor onze Node.js productie-infrastructuur via Ansible-automatisering. Deze praktijken zijn van toepassing op elke Node.js-applicatie:

### Systeemniveau Beveiliging voor Node.js Productie {#system-level-security-for-nodejs-production}

**Onze Ansible-implementatie:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Onze belangrijkste beveiligingsmaatregelen voor Node.js productieomgevingen:

* **Swap uitgeschakeld** om te voorkomen dat gevoelige gegevens naar de schijf worden geschreven
* **Core dumps uitgeschakeld** om geheugen dumps met gevoelige informatie te voorkomen
* **USB-opslag geblokkeerd** om ongeautoriseerde gegevens toegang te voorkomen
* **Kernel parameter tuning** voor zowel beveiliging als prestaties

> \[!WARNING]
> Bij het implementeren van best practices voor Node.js productie-implementatie kan het uitschakelen van swap leiden tot out-of-memory kills als uw applicatie de beschikbare RAM overschrijdt. We monitoren het geheugengebruik zorgvuldig en dimensioneren onze servers passend.

### Applicatiebeveiliging voor Node.js Applicaties {#application-security-for-nodejs-applications}

**Onze logveld redactie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

We redigeren gevoelige velden uit logs, waaronder wachtwoorden, tokens, API-sleutels en persoonlijke informatie. Dit beschermt de privacy van gebruikers terwijl debugging-mogelijkheden behouden blijven in elke Node.js productieomgeving.

### Automatisering van Infrastructuurbeveiliging {#infrastructure-security-automation}

**Onze complete Ansible-setup voor Node.js productie:**

* [Beveiligings playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-sleutelbeheer](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certificaatbeheer](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-configuratie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Onze Beveiligingsinhoud {#our-security-content}

Lees meer over onze beveiligingsaanpak:

* [Beste Beveiligingsauditbedrijven](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Veilige Versleutelde E-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Waarom Open Source E-mailbeveiliging](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Database Architectuur voor Node.js Applicaties {#database-architecture-for-nodejs-applications}

We gebruiken een hybride database-aanpak die is geoptimaliseerd voor onze Node.js-applicaties. Deze patronen kunnen worden aangepast voor elke Node.js-applicatie:

### SQLite Implementatie voor Node.js Productie {#sqlite-implementation-for-nodejs-production}

**Wat we gebruiken:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Onze configuratie:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

We gebruiken SQLite voor gebruikersspecifieke gegevens in onze Node.js-applicaties omdat het biedt:

* **Data-isolatie** per gebruiker/tenant
* **Betere prestaties** voor single-user queries
* **Vereenvoudigde back-up** en migratie
* **Verminderde complexiteit** vergeleken met gedeelde databases

Dit patroon werkt goed voor SaaS-applicaties, multi-tenant systemen of elke Node.js-applicatie die data-isolatie nodig heeft.

### MongoDB Implementatie voor Node.js Productie {#mongodb-implementation-for-nodejs-production}

**Wat we gebruiken:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Onze setup-implementatie:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Onze configuratie:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

We gebruiken MongoDB voor applicatiegegevens in onze Node.js productieomgeving omdat het biedt:

* **Flexibel schema** voor evoluerende datastructuren
* **Betere prestaties** voor complexe queries
* **Horizontale schaalbaarheid** mogelijkheden
* **Rijke querytaal**

> \[!NOTE]
> Onze hybride aanpak optimaliseert voor onze specifieke use case. Bestudeer onze daadwerkelijke databasegebruikspatronen in de codebase om te begrijpen of deze aanpak past bij de behoeften van jouw Node.js-applicatie.


## Node.js Productie Achtergrondtaakverwerking {#nodejs-production-background-job-processing}

We hebben onze achtergrondtaakarchitectuur gebouwd rond Bree voor betrouwbare Node.js productie-implementatie. Dit geldt voor elke Node.js-applicatie die achtergrondverwerking nodig heeft:

### Onze Bree Server Setup voor Productie {#our-bree-server-setup-for-production}

**Onze hoofdimplementatie:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Onze Ansible-implementatie:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Productie Taakvoorbeelden {#production-job-examples}

**Gezondheidsmonitoring:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Opruimautomatisering:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Al onze taken:** [Blader door onze volledige takenmap](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Deze patronen gelden voor elke Node.js-applicatie die nodig heeft:

* Geplande taken (gegevensverwerking, rapporten, opruiming)
* Achtergrondverwerking (afbeeldingsresizing, e-mailverzending, gegevensimport)
* Gezondheidsmonitoring en onderhoud
* Gebruik van worker threads voor CPU-intensieve taken

### Onze Taakplanningspatronen voor Node.js Productie {#our-job-scheduling-patterns-for-nodejs-production}

Bestudeer onze daadwerkelijke taakplanningspatronen in onze takenmap om te begrijpen:

* Hoe we cron-achtige planning implementeren in Node.js productie
* Onze foutafhandeling en retry-logica
* Hoe we worker threads gebruiken voor CPU-intensieve taken


## Geautomatiseerd Onderhoud voor Productie Node.js Applicaties {#automated-maintenance-for-production-nodejs-applications}

We implementeren proactief onderhoud om veelvoorkomende Node.js productieproblemen te voorkomen. Deze patronen gelden voor elke Node.js-applicatie:

### Onze Opruimimplementatie {#our-cleanup-implementation}

**Bron:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Ons geautomatiseerd onderhoud voor Node.js productieapplicaties richt zich op:

* **Tijdelijke bestanden** ouder dan 24 uur
* **Logbestanden** buiten bewaarbeperkingen
* **Cachebestanden** en tijdelijke data
* **Geüploade bestanden** die niet langer nodig zijn
* **Heap snapshots** van prestatie-debugging

Deze patronen gelden voor elke Node.js-applicatie die tijdelijke bestanden, logs of gecachte data genereert.

### Schijfruimtebeheer voor Node.js Productie {#disk-space-management-for-nodejs-production}

**Onze monitoringsdrempels:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Wachtrijlimieten** voor achtergrondverwerking
* **75% schijfgebruik** waarschuwingsdrempel
* **Automatische opruiming** wanneer drempels worden overschreden

### Automatisering van Infrastructuuronderhoud {#infrastructure-maintenance-automation}

**Onze Ansible-automatisering voor Node.js productie:**

* [Omgevingsimplementatie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Beheer van implementatiesleutels](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js Productie Implementatiehandleiding {#nodejs-production-deployment-implementation-guide}
### Bestudeer Onze Werkelijke Code voor Productie Best Practices {#study-our-actual-code-for-production-best-practices}

**Begin met deze belangrijke bestanden voor Node.js productieomgeving setup:**

1. **Configuratie:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoring:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Foutafhandeling:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logging:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Procesgezondheid:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Leer van Onze Blogposts {#learn-from-our-blog-posts}

**Onze technische implementatiehandleidingen voor Node.js productie:**

* [NPM Packages Ecosysteem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Betalingssystemen Bouwen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-mail Privacy Implementatie](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript Contactformulieren](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-mail Integratie](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastructuur Automatisering voor Node.js Productie {#infrastructure-automation-for-nodejs-production}

**Onze Ansible playbooks om te bestuderen voor Node.js productie-implementatie:**

* [Complete playbooks directory](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Beveiligingsversterking](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js setup](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Onze Case Studies {#our-case-studies}

**Onze enterprise implementaties:**

* [Linux Foundation Case Study](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Case Study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumni E-mail Doorsturen](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Conclusie: Node.js Productie-Implementatie Best Practices {#conclusion-nodejs-production-deployment-best-practices}

Onze Node.js productie-infrastructuur toont aan dat Node.js applicaties enterprise-grade betrouwbaarheid kunnen bereiken door:

* **Bewezen hardware keuzes** (AMD Ryzen voor 573% single core prestatieoptimalisatie)
* **Beproefde Node.js productie monitoring** met specifieke drempels en geautomatiseerde reacties
* **Slimme foutclassificatie** om incidentrespons in productieomgevingen te verbeteren
* **Geavanceerde prestatie-debugging** met v8-profiler-next en cpupro voor OOM preventie
* **Uitgebreide beveiligingsversterking** via Ansible automatisering
* **Hybride database architectuur** geoptimaliseerd voor applicatiebehoeften
* **Geautomatiseerd onderhoud** om veelvoorkomende Node.js productieproblemen te voorkomen

**Belangrijkste conclusie:** Bestudeer onze daadwerkelijke implementatiebestanden en blogposts in plaats van generieke best practices te volgen. Onze codebase biedt praktijkvoorbeelden voor Node.js productie-implementatie die aangepast kunnen worden voor elke Node.js applicatie - webapps, API's, microservices of achtergrondservices.


## Complete Bronnenlijst voor Node.js Productie {#complete-resource-list-for-nodejs-production}

### Onze Kern Implementatiebestanden {#our-core-implementation-files}

* [Hoofdconfiguratie](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Package afhankelijkheden](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Server monitoring](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Foutclassificatie](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logging systeem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 gezondheidschecks](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Geautomatiseerde opruiming](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Onze Serverimplementaties {#our-server-implementations}

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Onze Infrastructuurautomatisering {#our-infrastructure-automation}

* [Al onze Ansible playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Beveiligingsversterking](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js installatie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databaseconfiguratie](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Onze Technische Blogposts {#our-technical-blog-posts}

* [NPM Ecosysteem Analyse](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementatie van Betaalsysteem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Technische Gids voor E-mailprivacy](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript Contactformulieren](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React E-mailintegratie](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Zelfgehoste Oplossing Gids](https://forwardemail.net/blog/docs/self-hosted-solution)

### Onze Enterprise Case Studies {#our-enterprise-case-studies}

* [Linux Foundation Implementatie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu Case Study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Voldoen aan Overheidsvoorschriften](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni E-mailsystemen](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
