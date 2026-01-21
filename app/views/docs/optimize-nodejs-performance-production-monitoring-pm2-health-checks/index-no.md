# Slik optimaliserer du Node.js produksjonsinfrastruktur: Beste praksis {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Vår 573 % revolusjon innen ytelsesoptimalisering med én kjerne](#our-573-single-core-performance-optimization-revolution)
  * [Hvorfor ytelsesoptimalisering med én kjerne er viktig for Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Relatert innhold](#related-content)
* [Oppsett av Node.js-produksjonsmiljø: Vår teknologistabel](#nodejs-production-environment-setup-our-technology-stack)
  * [Pakkebehandler: pnpm for produksjonseffektivitet](#package-manager-pnpm-for-production-efficiency)
  * [Web Framework: Koa for moderne Node.js-produksjon](#web-framework-koa-for-modern-nodejs-production)
  * [Bakgrunnsjobbbehandling: Bree for produksjonspålitelighet](#background-job-processing-bree-for-production-reliability)
  * [Feilhåndtering: @hapi/boom for produksjonspålitelighet](#error-handling-hapiboom-for-production-reliability)
* [Slik overvåker du Node.js-applikasjoner i produksjon](#how-to-monitor-nodejs-applications-in-production)
  * [Systemnivå Node.js produksjonsovervåking](#system-level-nodejs-production-monitoring)
  * [Applikasjonsnivåovervåking for Node.js-produksjon](#application-level-monitoring-for-nodejs-production)
  * [Applikasjonsspesifikk overvåking](#application-specific-monitoring)
* [Node.js-produksjonsovervåking med PM2-helsesjekker](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Vårt PM2 helsesjekksystem](#our-pm2-health-check-system)
  * [Vår PM2-produksjonskonfigurasjon](#our-pm2-production-configuration)
  * [Automatisert PM2-distribusjon](#automated-pm2-deployment)
* [System for håndtering og klassifisering av produksjonsfeil](#production-error-handling-and-classification-system)
  * [Vår isCodeBug-implementering for produksjon](#our-iscodebug-implementation-for-production)
  * [Integrasjon med vår produksjonslogging](#integration-with-our-production-logging)
  * [Relatert innhold](#related-content-1)
* [Avansert ytelsesfeilsøking med v8-profiler-next og cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Vår profileringstilnærming for Node.js-produksjon](#our-profiling-approach-for-nodejs-production)
  * [Hvordan vi implementerer Heap Snapshot-analyse](#how-we-implement-heap-snapshot-analysis)
  * [Arbeidsflyt for ytelsesfeilsøking](#performance-debugging-workflow)
  * [Anbefalt implementering for Node.js-applikasjonen din](#recommended-implementation-for-your-nodejs-application)
  * [Integrasjon med vår produksjonsovervåking](#integration-with-our-production-monitoring)
* [Node.js produksjonsinfrastruktursikkerhet](#nodejs-production-infrastructure-security)
  * [Systemnivåsikkerhet for Node.js-produksjon](#system-level-security-for-nodejs-production)
  * [Applikasjonssikkerhet for Node.js-applikasjoner](#application-security-for-nodejs-applications)
  * [Automatisering av infrastruktursikkerhet](#infrastructure-security-automation)
  * [Vårt sikkerhetsinnhold](#our-security-content)
* [Databasearkitektur for Node.js-applikasjoner](#database-architecture-for-nodejs-applications)
  * [SQLite-implementering for Node.js-produksjon](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-implementering for Node.js-produksjon](#mongodb-implementation-for-nodejs-production)
* [Node.js produksjonsbakgrunnsjobbbehandling](#nodejs-production-background-job-processing)
  * [Vårt Bree-serveroppsett for produksjon](#our-bree-server-setup-for-production)
  * [Eksempler på produksjonsjobber](#production-job-examples)
  * [Våre jobbplanleggingsmønstre for Node.js-produksjon](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatisert vedlikehold for Node.js-produksjonsapplikasjoner](#automated-maintenance-for-production-nodejs-applications)
  * [Vår oppryddingimplementering](#our-cleanup-implementation)
  * [Diskplasshåndtering for Node.js-produksjon](#disk-space-management-for-nodejs-production)
  * [Automatisering av infrastrukturvedlikehold](#infrastructure-maintenance-automation)
* [Implementeringsveiledning for Node.js-produksjon](#nodejs-production-deployment-implementation-guide)
  * [Studer vår faktiske kode for beste praksis i produksjon](#study-our-actual-code-for-production-best-practices)
  * [Lær av blogginnleggene våre](#learn-from-our-blog-posts)
  * [Infrastrukturautomatisering for Node.js-produksjon](#infrastructure-automation-for-nodejs-production)
  * [Våre casestudier](#our-case-studies)
* [Konklusjon: Beste praksis for Node.js-produksjonsdistribusjon](#conclusion-nodejs-production-deployment-best-practices)
* [Komplett ressursliste for Node.js-produksjon](#complete-resource-list-for-nodejs-production)
  * [Våre kjerneimplementeringsfiler](#our-core-implementation-files)
  * [Våre serverimplementeringer](#our-server-implementations)
  * [Vår infrastrukturautomatisering](#our-infrastructure-automation)
  * [Våre tekniske blogginnlegg](#our-technical-blog-posts)
  * [Våre casestudier for bedrifter](#our-enterprise-case-studies)

## Forord {#foreword}

Hos Forward Email har vi brukt årevis på å perfeksjonere oppsettet vårt for Node.js-produksjonsmiljøet. Denne omfattende veiledningen deler våre velprøvde beste praksiser for Node.js-produksjonsdistribusjon, med fokus på ytelsesoptimalisering, overvåking og lærdommene vi har lært av å skalere Node.js-applikasjoner for å håndtere millioner av daglige transaksjoner.

## Vår 573 % revolusjon innen ytelsesoptimalisering med én kjerne {#our-573-single-core-performance-optimization-revolution}

Da vi migrerte fra Intel- til AMD Ryzen-prosessorer, oppnådde vi en ytelsesforbedring på **573 %** i Node.js-applikasjonene våre. Dette var ikke bare en mindre optimalisering – den endret fundamentalt hvordan Node.js-applikasjonene våre yter i produksjon, og demonstrerer viktigheten av ytelsesoptimalisering med én kjerne for alle Node.js-applikasjoner.

> \[!TIP]
> For beste praksis for Node.js-produksjonsdistribusjon er valg av maskinvare kritisk. Vi valgte spesifikt DataPacket-hosting på grunn av deres AMD Ryzen-tilgjengelighet fordi ytelse med én kjerne er avgjørende for Node.js-applikasjoner siden JavaScript-kjøring er enkelttrådet.

### Hvorfor ytelsesoptimalisering med én kjerne er viktig for Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Migreringen vår fra Intel til AMD Ryzen resulterte i:

* **573 % ytelsesforbedring** i forespørselsbehandling (dokumentert i [GitHub-problemet vårt på statussiden #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminert behandlingsforsinkelser** til nesten umiddelbare svar (nevnt i [GitHub-problemet #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Bedre forhold mellom pris og ytelse** for Node.js-produksjonsmiljøer
* **Forbedrede responstider** på tvers av alle applikasjonsendepunktene våre

Ytelsesøkningen var så betydelig at vi nå anser AMD Ryzen-prosessorer som essensielle for enhver seriøs Node.js-produksjonsdistribusjon, enten du kjører webapplikasjoner, API-er, mikrotjenester eller annen Node.js-arbeidsmengde.

### Relatert innhold {#related-content}

For mer informasjon om våre infrastrukturvalg, sjekk ut:

* [Beste tjeneste for videresending av e-post](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Ytelsessammenligninger)
* [Selvhostet løsning](https://forwardemail.net/blog/docs/self-hosted-solution) - Maskinvareanbefalinger

## Oppsett av Node.js-produksjonsmiljø: Vår teknologistabel {#nodejs-production-environment-setup-our-technology-stack}

Våre beste praksiser for Node.js-produksjonsdistribusjon inkluderer bevisste teknologivalg basert på mange års produksjonserfaring. Her er hva vi bruker og hvorfor disse valgene gjelder for alle Node.js-applikasjoner:

### Pakkebehandler: pnpm for produksjonseffektivitet {#package-manager-pnpm-for-production-efficiency}

**Hva vi bruker:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (festet versjon)

Vi valgte pnpm fremfor npm og yarn for Node.js-produksjonsmiljøoppsettet vårt fordi:

* **Raskere installasjonstider** i CI/CD-pipelines
* **Effektiv diskplass** gjennom hard linking
* **Streng avhengighetsløsning** som forhindrer fantomavhengigheter
* **Bedre ytelse** i produksjonsdistribusjoner

> \[!NOTE]
> Som en del av våre beste praksiser for Node.js-produksjonsdistribusjon, fester vi eksakte versjoner av kritiske verktøy som pnpm for å sikre konsistent oppførsel på tvers av alle miljøer og teammedlemmenes maskiner.

**Implementeringsdetaljer:**

* [Vår package.json-konfigurasjon](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Blogginnlegget vårt om NPM-økosystemet](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Nettrammeverk: Koa for moderne Node.js-produksjon {#web-framework-koa-for-modern-nodejs-production}

**Hva vi bruker:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi valgte Koa fremfor Express for vår Node.js-produksjonsinfrastruktur på grunn av dens moderne async/await-støtte og renere mellomvaresammensetning. Grunnleggeren vår, Nick Baugh, bidro til både Express og Koa, noe som ga oss dyp innsikt i begge rammeverkene for produksjonsbruk.

Disse mønstrene gjelder enten du bygger REST API-er, GraphQL-servere, webapplikasjoner eller mikrotjenester.

**Våre implementeringseksempler:**

* [Oppsett av webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-serverkonfigurasjon](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Implementeringsveiledning for kontaktskjemaer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Bakgrunnsjobbbehandling: Bree for produksjonspålitelighet {#background-job-processing-bree-for-production-reliability}

**Hva vi bruker:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) planlegger

Vi opprettet og vedlikeholder Bree fordi eksisterende jobbplanleggere ikke oppfylte våre behov for støtte for arbeidstråder og moderne JavaScript-funksjoner i Node.js-produksjonsmiljøer. Dette gjelder alle Node.js-applikasjoner som trenger bakgrunnsbehandling, planlagte oppgaver eller arbeidstråder.

**Våre implementeringseksempler:**

* [Bree-serveroppsett](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Alle våre jobbdefinisjoner](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 helsesjekkjobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementering av opprydningsjobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Feilhåndtering: @hapi/boom for produksjonspålitelighet {#error-handling-hapiboom-for-production-reliability}

**Hva vi bruker:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vi bruker @hapi/boom for strukturerte feilresponser i alle Node.js-produksjonsapplikasjonene våre. Dette mønsteret fungerer for alle Node.js-applikasjoner som trenger konsekvent feilhåndtering.

**Våre implementeringseksempler:**

* [Hjelp for feilklassifisering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Loggerimplementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Slik overvåker du Node.js-applikasjoner i produksjon {#how-to-monitor-nodejs-applications-in-production}

Vår tilnærming til overvåking av Node.js-applikasjoner i produksjon har utviklet seg gjennom årevis med kjøring av applikasjoner i stor skala. Vi implementerer overvåking på flere lag for å sikre pålitelighet og ytelse for alle typer Node.js-applikasjoner.

### Produksjonsovervåking av Node.js på systemnivå {#system-level-nodejs-production-monitoring}

**Vår kjerneimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Hva vi bruker:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Våre terskler for produksjonsovervåking (fra vår faktiske produksjonskode):

* **2 GB heapstørrelsesgrense** med automatiske varsler
* **25 % minnebruk** advarselsterskel
* **80 % CPU-bruk** advarselsterskel
* **75 % diskbruk** advarselsterskel

> \[!WARNING]
> Disse tersklene fungerer for vår spesifikke maskinvarekonfigurasjon. Når du implementerer Node.js-produksjonsovervåking, bør du se gjennom monitor-server.js-implementeringen vår for å forstå den nøyaktige logikken og tilpasse verdiene for oppsettet ditt.

### Overvåking på applikasjonsnivå for Node.js-produksjon {#application-level-monitoring-for-nodejs-production}

**Vår feilklassifisering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denne hjelperen skiller mellom:

* **Faktiske kodefeil** som krever umiddelbar oppmerksomhet
* **Brukerfeil** som er forventet oppførsel
* **Eksterne tjenestefeil** som vi ikke kan kontrollere

Dette mønsteret gjelder for alle Node.js-applikasjoner – webapper, API-er, mikrotjenester eller bakgrunnstjenester.

**Vår loggingimplementering:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi implementerer omfattende feltredigering for å beskytte sensitiv informasjon, samtidig som vi opprettholder nyttige feilsøkingsmuligheter i Node.js-produksjonsmiljøet vårt.

### Applikasjonsspesifikk overvåking {#application-specific-monitoring}

**Våre serverimplementeringer:**

* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-tjener](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Køovervåking:** Vi implementerer køgrenser på 5 GB og tidsavbrudd på 180 sekunder for forespørselsbehandling for å forhindre ressursutmattelse. Disse mønstrene gjelder for alle Node.js-applikasjoner med køer eller bakgrunnsbehandling.

## Node.js-produksjonsovervåking med PM2-helsesjekker {#nodejs-production-monitoring-with-pm2-health-checks}

Vi har forbedret oppsettet vårt for Node.js-produksjonsmiljø med PM2 gjennom mange års produksjonserfaring. Våre PM2-helsekontroller er avgjørende for å opprettholde påliteligheten i enhver Node.js-applikasjon.

### Vårt PM2-helsesjekksystem {#our-pm2-health-check-system}

**Vår kjerneimplementering:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Vår Node.js-produksjonsovervåking med PM2-helsesjekker inkluderer:

* **Kjører hvert 20. minutt** via cron-planlegging
* **Krever minimum 15 minutters oppetid** før en prosess anses som sunn
* **Validerer prosessstatus og minnebruk**
* **Starter automatisk mislykkede prosesser på nytt**
* **Forhindrer omstartsløkker** gjennom intelligent helsesjekk

> \[!CAUTION]
> For beste praksis for Node.js-produksjonsdistribusjon krever vi 15+ minutters oppetid før vi anser en prosess som sunn for å unngå omstartsløkker. Dette forhindrer kaskadefeil når prosesser sliter med minne eller andre problemer.

### Vår PM2-produksjonskonfigurasjon {#our-pm2-production-configuration}

**Oppsett av økosystemet vårt:** Studer serveroppstartsfilene våre for oppsett av Node.js-produksjonsmiljøet:

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-planlegger](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Disse mønstrene gjelder enten du kjører Express-apper, Koa-servere, GraphQL API-er eller andre Node.js-applikasjoner.

### Automatisert PM2-distribusjon {#automated-pm2-deployment}

**PM2-distribusjon:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Vi automatiserer hele PM2-oppsettet vårt gjennom Ansible for å sikre konsistente Node.js-produksjonsdistribusjoner på tvers av alle serverne våre.

## System for håndtering og klassifisering av produksjonsfeil {#production-error-handling-and-classification-system}

En av våre mest verdifulle beste praksiser for Node.js-produksjonsdistribusjon er intelligent feilklassifisering som gjelder for alle Node.js-applikasjoner:

### Vår isCodeBug-implementering for produksjon {#our-iscodebug-implementation-for-production}

**Kilde:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Denne hjelperen tilbyr intelligent feilklassifisering for Node.js-applikasjoner i produksjon for å:

* **Prioriter faktiske feil** fremfor brukerfeil
* **Forbedre hendelsesresponsen vår** ved å fokusere på reelle problemer
* **Reduser varslingstretthet** fra forventede brukerfeil
* **Forstå applikasjonsproblemer kontra brukergenererte problemer bedre**

Dette mønsteret fungerer for alle Node.js-applikasjoner – enten du bygger e-handelsnettsteder, SaaS-plattformer, API-er eller mikrotjenester.

### Integrasjon med vår produksjonslogging {#integration-with-our-production-logging}

**Vår loggerintegrasjon:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Loggeren vår bruker `isCodeBug` til å bestemme varslingsnivåer og feltredigering, slik at vi blir varslet om reelle problemer samtidig som vi filtrerer ut støy i Node.js-produksjonsmiljøet vårt.

### Relatert innhold {#related-content-1}

Lær mer om våre feilhåndteringsmønstre:

* [Bygge et pålitelig betalingssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Feilhåndteringsmønstre
* [Personvernbeskyttelse via e-post](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Håndtering av sikkerhetsfeil

## Avansert ytelsesfeilsøking med v8-profiler-next og cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Vi bruker avanserte profileringsverktøy for å analysere heap-snapshots og feilsøke OOM (Out of Memory)-problemer, ytelsesflaskehalser og Node.js-minneproblemer i produksjonsmiljøet vårt. Disse verktøyene er viktige for alle Node.js-applikasjoner som opplever minnelekkasjer eller ytelsesproblemer.

### Vår profileringstilnærming for Node.js-produksjon {#our-profiling-approach-for-nodejs-production}

**Verktøy vi anbefaler:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) – For å generere heap-snapshots og CPU-profiler
* [`cpupro`](https://github.com/discoveryjs/cpupro) – For å analysere CPU-profiler og heap-snapshots

> \[!TIP]
> Vi bruker v8-profiler-next og cpupro sammen for å lage en komplett arbeidsflyt for feilsøking av ytelse for Node.js-applikasjonene våre. Denne kombinasjonen hjelper oss med å identifisere minnelekkasjer, ytelsesflaskehalser og optimalisere produksjonskoden vår.

### Hvordan vi implementerer Heap Snapshot-analyse {#how-we-implement-heap-snapshot-analysis}

**Vår overvåkingsimplementering:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Produksjonsovervåkingen vår inkluderer automatisk generering av heap-snapshots når minneterskler overskrides. Dette hjelper oss med å feilsøke OOM-problemer før de forårsaker applikasjonskrasj.

**Viktige implementeringsmønstre:**

* **Automatiske øyeblikksbilder** når heap-størrelsen overstiger 2 GB-terskelen
* **Signalbasert profilering** for analyse på forespørsel i produksjon
* **Oppbevaringspolicyer** for administrasjon av øyeblikksbilderlagring
* **Integrasjon med våre oppryddingsjobber** for automatisert vedlikehold

### Arbeidsflyt for ytelsesfeilsøking {#performance-debugging-workflow}

**Studer vår faktiske implementering:**

* [Overvåk serverimplementering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap-overvåking og generering av øyeblikksbilder
* [Opprydningsjobb](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Oppbevaring og opprydding av øyeblikksbilder
* [Logger-integrasjon](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Ytelseslogging

### Anbefalt implementering for Node.js-applikasjonen din {#recommended-implementation-for-your-nodejs-application}

**For analyse av heap-snapshots:**

1. **Installer v8-profiler-next** for generering av øyeblikksbilder
2. Bruk cpupro** for å analysere de genererte øyeblikksbildene
3. Implementer overvåkingsterskler** som ligner på vår monitor-server.js
4. Konfigurer automatisert opprydding** for å administrere lagring av øyeblikksbilder
5. Opprett signalbehandlere** for profilering på forespørsel i produksjon

**For CPU-profilering:**

1. **Generer CPU-profiler** i perioder med høy belastning
2. **Analyser med cpupro** for å identifisere flaskehalser
3. **Fokuser på «hot paths»** og optimaliseringsmuligheter
4. **Overvåk ytelsesforbedringer før/etter**

> \[!WARNING]
> Generering av heap-snapshots og CPU-profiler kan påvirke ytelsen. Vi anbefaler å implementere begrensning og bare aktivere profilering når du undersøker spesifikke problemer eller i vedlikeholdsvinduer.

### Integrasjon med vår produksjonsovervåking {#integration-with-our-production-monitoring}

Våre profileringsverktøy integreres med vår bredere overvåkingsstrategi:

* **Automatisk utløsning** basert på minne-/CPU-terskler
* **Varslingsintegrasjon** når ytelsesproblemer oppdages
* **Historisk analyse** for å spore ytelsestrender over tid
* **Korrelasjon med applikasjonsmålinger** for omfattende feilsøking

Denne tilnærmingen har hjulpet oss med å identifisere og løse minnelekkasjer, optimalisere stier for aktiv kode og opprettholde stabil ytelse i Node.js-produksjonsmiljøet vårt.

## Node.js produksjonsinfrastruktursikkerhet {#nodejs-production-infrastructure-security}

Vi implementerer omfattende sikkerhet for vår Node.js-produksjonsinfrastruktur gjennom Ansible-automatisering. Disse fremgangsmåtene gjelder for alle Node.js-applikasjoner:

### Sikkerhet på systemnivå for Node.js-produksjon {#system-level-security-for-nodejs-production}

**Vår Ansible-implementering:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Våre viktigste sikkerhetstiltak for Node.js-produksjonsmiljøer:

* **Bytte deaktivert** for å forhindre at sensitive data skrives til disk
* **Kjernedumper deaktivert** for å forhindre minnedumper som inneholder sensitiv informasjon
* **USB-lagring blokkert** for å forhindre uautorisert datatilgang
* **Justering av kjerneparametere** for både sikkerhet og ytelse

> \[!WARNING]
> Når du implementerer beste praksis for Node.js-produksjonsdistribusjon, kan deaktivering av swap føre til minnedød hvis applikasjonen din overskrider tilgjengelig RAM. Vi overvåker minnebruken nøye og dimensjonerer serverne våre deretter.

### Applikasjonssikkerhet for Node.js-applikasjoner {#application-security-for-nodejs-applications}

**Redigering av loggfeltet vårt:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Vi redigerer sensitive felt fra logger, inkludert passord, tokener, API-nøkler og personlig informasjon. Dette beskytter brukerens personvern samtidig som det opprettholder feilsøkingsfunksjoner i ethvert Node.js-produksjonsmiljø.

### Infrastruktursikkerhetsautomatisering {#infrastructure-security-automation}

**Vårt komplette Ansible-oppsett for Node.js-produksjon:**

* [Sikkerhetshåndbok](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-nøkkelhåndtering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Sertifikatadministrasjon](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-oppsett](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Vårt sikkerhetsinnhold {#our-security-content}

Lær mer om vår sikkerhetstilnærming:

* [Beste sikkerhetsrevisjonsselskaper](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe kryptert e-post](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Hvorfor åpen kildekode for e-postsikkerhet](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Databasearkitektur for Node.js-applikasjoner {#database-architecture-for-nodejs-applications}

Vi bruker en hybrid databasetilnærming som er optimalisert for Node.js-applikasjonene våre. Disse mønstrene kan tilpasses for alle Node.js-applikasjoner:

### SQLite-implementering for Node.js-produksjon {#sqlite-implementation-for-nodejs-production}

**Hva vi bruker:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vår konfigurasjon:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Vi bruker SQLite for brukerspesifikke data i Node.js-applikasjonene våre fordi det tilbyr:

* **Dataisolering** per bruker/leietaker
* **Bedre ytelse** for spørringer fra én bruker
* **Forenklet sikkerhetskopiering** og migrering
* **Redusert kompleksitet** sammenlignet med delte databaser

Dette mønsteret fungerer bra for SaaS-applikasjoner, systemer med flere leietakere eller andre Node.js-applikasjoner som trenger dataisolering.

### MongoDB-implementering for Node.js-produksjon {#mongodb-implementation-for-nodejs-production}

**Hva vi bruker:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Vår implementering av oppsettet:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Vår konfigurasjon:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Vi bruker MongoDB for applikasjonsdata i Node.js-produksjonsmiljøet vårt fordi det tilbyr:

* **Fleksibelt skjema** for utviklende datastrukturer
* **Bedre ytelse** for komplekse spørringer
* **Horisontal skalering**
* **Rikt spørrespråk**

> \[!NOTE]
> Vår hybride tilnærming optimaliserer for vårt spesifikke brukstilfelle. Studer våre faktiske databasebruksmønstre i kodebasen for å forstå om denne tilnærmingen passer dine Node.js-applikasjonsbehov.

## Node.js produksjonsbakgrunnsjobbbehandling {#nodejs-production-background-job-processing}

Vi bygde bakgrunnsjobbarkitekturen vår rundt Bree for pålitelig Node.js-produksjonsdistribusjon. Dette gjelder for alle Node.js-applikasjoner som trenger bakgrunnsbehandling:

### Vårt Bree-serveroppsett for produksjon {#our-bree-server-setup-for-production}

**Vår hovedimplementering:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Vår Ansible-distribusjon:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Eksempler på produksjonsjobber {#production-job-examples}

**Helseovervåking:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisering av opprydding:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Alle våre jobber:** [Bla gjennom vår komplette jobbkatalog](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Disse mønstrene gjelder for alle Node.js-applikasjoner som trenger:

* Planlagte oppgaver (databehandling, rapporter, opprydding)
* Bakgrunnsbehandling (endring av bildestørrelse, sending av e-post, dataimport)
* Helseovervåking og vedlikehold
* Utnyttelse av arbeidstråder for CPU-intensive oppgaver

### Våre jobbplanleggingsmønstre for Node.js-produksjon {#our-job-scheduling-patterns-for-nodejs-production}

Studer våre faktiske jobbplanleggingsmønstre i jobbkatalogen vår for å forstå:

* Hvordan vi implementerer cron-lignende planlegging i Node.js-produksjon
* Vår feilhåndtering og logikk for nye forsøk
* Hvordan vi bruker arbeidstråder for CPU-intensive oppgaver

## Automatisert vedlikehold for Node.js-produksjonsapplikasjoner {#automated-maintenance-for-production-nodejs-applications}

Vi implementerer proaktivt vedlikehold for å forhindre vanlige Node.js-produksjonsproblemer. Disse mønstrene gjelder for alle Node.js-applikasjoner:

### Vår oppryddingimplementering {#our-cleanup-implementation}

**Kilde:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Vårt automatiserte vedlikehold for Node.js-produksjonsapplikasjoner har følgende mål:

* **Midlertidige filer** eldre enn 24 timer
* **Loggfiler** utover oppbevaringsgrenser
* **Bufferfiler** og midlertidige data
* **Opplastede filer** som ikke lenger er nødvendige
* **Heap-øyeblikksbilder** fra ytelsesfeilsøking

Disse mønstrene gjelder for alle Node.js-applikasjoner som genererer midlertidige filer, logger eller hurtigbufrede data.

### Diskplasshåndtering for Node.js-produksjon {#disk-space-management-for-nodejs-production}

**Våre overvåkingsterskler:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Køgrenser** for bakgrunnsbehandling
* **Advarselsterskel for 75 % diskbruk**
* **Automatisk opprydding** når terskler overskrides

### Automatisering av infrastrukturvedlikehold {#infrastructure-maintenance-automation}

**Vår Ansible-automatisering for Node.js-produksjon:**

* [Miljøimplementering](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Administrasjon av distribusjonsnøkler](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Implementeringsveiledning for Node.js-produksjon {#nodejs-production-deployment-implementation-guide}

### Studer vår faktiske kode for beste praksis i produksjon {#study-our-actual-code-for-production-best-practices}

**Start med disse nøkkelfilene for oppsett av Node.js-produksjonsmiljøet:**

1. **Konfigurasjon:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Overvåking:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Feilhåndtering:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logging:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Prosesshelse:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Lær av blogginnleggene våre {#learn-from-our-blog-posts}

**Våre tekniske implementeringsveiledninger for Node.js-produksjon:**

* [NPM-pakkers økosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Bygge betalingssystemer](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementering av personvern for e-post](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktskjemaer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email-integrasjon](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastrukturautomatisering for Node.js-produksjon {#infrastructure-automation-for-nodejs-production}

**Våre Ansible-strategibøker for å studere for Node.js-produksjonsdistribusjon:**

* [Komplett katalog over spillbøker](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sikkerhetsherding](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-oppsett](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Våre casestudier {#our-case-studies}

**Våre bedriftsimplementeringer:**

* [Casestudie av Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Kanonisk Ubuntu-casestudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Videresending av e-post fra alumner](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Konklusjon: Beste praksis for Node.js-produksjonsdistribusjon {#conclusion-nodejs-production-deployment-best-practices}

Vår Node.js-produksjonsinfrastruktur viser at Node.js-applikasjoner kan oppnå pålitelighet på bedriftsnivå gjennom:

* **Prøvde maskinvarevalg** (AMD Ryzen for 573 % optimalisering av ytelse med én kjerne)
* **Kamptestet Node.js-produksjonsovervåking** med spesifikke terskler og automatiserte responser
* **Smart feilklassifisering** for å forbedre hendelsesrespons i produksjonsmiljøer
* **Avansert ytelsesfeilsøking** med v8-profiler-next og cpupro for OOM-forebygging
* **Omfattende sikkerhetsherding** gjennom Ansible-automatisering
* **Hybrid databasearkitektur** optimalisert for applikasjonsbehov
* **Automatisert vedlikehold** for å forhindre vanlige Node.js-produksjonsproblemer

**Viktig konklusjon:** Studer våre faktiske implementeringsfiler og blogginnlegg i stedet for å følge generiske beste praksiser. Kodebasen vår gir virkelige mønstre for Node.js-produksjonsdistribusjon som kan tilpasses for enhver Node.js-applikasjon – webapper, API-er, mikrotjenester eller bakgrunnstjenester.

## Komplett ressursliste for Node.js-produksjon {#complete-resource-list-for-nodejs-production}

### Våre kjerneimplementeringsfiler {#our-core-implementation-files}

* [Hovedkonfigurasjon](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Pakkeavhengigheter](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverovervåking](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Feilklassifisering](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Loggingssystem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 helsesjekker](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatisert opprydding](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Våre serverimplementeringer {#our-server-implementations}

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-planlegger](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-tjener](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Vår infrastrukturautomatisering {#our-infrastructure-automation}

* [Alle våre Ansible-håndbøker](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sikkerhetsherding](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-oppsett](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Databasekonfigurasjon](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Våre tekniske blogginnlegg {#our-technical-blog-posts}

* [NPM økosystemanalyse](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementering av betalingssystem](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Teknisk veiledning for personvern på e-post](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-kontaktskjemaer](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React Email-integrasjon](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Veiledning for selvhostede løsninger](https://forwardemail.net/blog/docs/self-hosted-solution)

### Våre casestudier for bedrifter {#our-enterprise-case-studies}

* [Linux Foundation-implementering](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Kanonisk Ubuntu-casestudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Overholdelse av føderale myndigheter](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [E-postsystemer for alumner](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)