# Jak optimalizovat produkční infrastrukturu Node.js: nejlepší postupy {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Průvodce optimalizací výkonu Node.js" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Naše revoluce v optimalizaci výkonu na jedno jádro o 573 %](#our-573-single-core-performance-optimization-revolution)
  * [Proč je optimalizace výkonu na jedno jádro důležitá pro Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Související obsah](#related-content)
* [Nastavení produkčního prostředí Node.js: náš technologický stack](#nodejs-production-environment-setup-our-technology-stack)
  * [Správce balíčků: pnpm pro produkční efektivitu](#package-manager-pnpm-for-production-efficiency)
  * [Webový framework: Koa pro moderní produkci Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Zpracování pozadí úloh: Bree pro produkční spolehlivost](#background-job-processing-bree-for-production-reliability)
  * [Zpracování chyb: @hapi/boom pro produkční spolehlivost](#error-handling-hapiboom-for-production-reliability)
* [Jak monitorovat aplikace Node.js v produkci](#how-to-monitor-nodejs-applications-in-production)
  * [Systémové monitorování produkce Node.js](#system-level-nodejs-production-monitoring)
  * [Monitorování na úrovni aplikace pro produkci Node.js](#application-level-monitoring-for-nodejs-production)
  * [Specifické monitorování aplikací](#application-specific-monitoring)
* [Monitorování produkce Node.js pomocí PM2 Health Checks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Náš systém PM2 Health Check](#our-pm2-health-check-system)
  * [Naše produkční konfigurace PM2](#our-pm2-production-configuration)
  * [Automatizované nasazení PM2](#automated-pm2-deployment)
* [Systém zpracování a klasifikace chyb v produkci](#production-error-handling-and-classification-system)
  * [Naše implementace isCodeBug pro produkci](#our-iscodebug-implementation-for-production)
  * [Integrace s naším produkčním logováním](#integration-with-our-production-logging)
  * [Související obsah](#related-content-1)
* [Pokročilé ladění výkonu s v8-profiler-next a cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Náš přístup k profilování pro produkci Node.js](#our-profiling-approach-for-nodejs-production)
  * [Jak implementujeme analýzu heap snapshotů](#how-we-implement-heap-snapshot-analysis)
  * [Pracovní postup ladění výkonu](#performance-debugging-workflow)
  * [Doporučená implementace pro vaši aplikaci Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integrace s naším produkčním monitorováním](#integration-with-our-production-monitoring)
* [Bezpečnost produkční infrastruktury Node.js](#nodejs-production-infrastructure-security)
  * [Systémová bezpečnost pro produkci Node.js](#system-level-security-for-nodejs-production)
  * [Bezpečnost aplikací pro Node.js](#application-security-for-nodejs-applications)
  * [Automatizace bezpečnosti infrastruktury](#infrastructure-security-automation)
  * [Náš bezpečnostní obsah](#our-security-content)
* [Databázová architektura pro aplikace Node.js](#database-architecture-for-nodejs-applications)
  * [Implementace SQLite pro produkci Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementace MongoDB pro produkci Node.js](#mongodb-implementation-for-nodejs-production)
* [Zpracování pozadí úloh v produkci Node.js](#nodejs-production-background-job-processing)
  * [Naše nastavení serveru Bree pro produkci](#our-bree-server-setup-for-production)
  * [Příklady produkčních úloh](#production-job-examples)
  * [Naše vzory plánování úloh pro produkci Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatizovaná údržba produkčních aplikací Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Naše implementace čištění](#our-cleanup-implementation)
  * [Správa místa na disku pro produkci Node.js](#disk-space-management-for-nodejs-production)
  * [Automatizace údržby infrastruktury](#infrastructure-maintenance-automation)
* [Průvodce implementací nasazení produkce Node.js](#nodejs-production-deployment-implementation-guide)
  * [Studujte náš skutečný kód pro nejlepší produkční postupy](#study-our-actual-code-for-production-best-practices)
  * [Poučte se z našich blogových příspěvků](#learn-from-our-blog-posts)
  * [Automatizace infrastruktury pro produkci Node.js](#infrastructure-automation-for-nodejs-production)
  * [Naše případové studie](#our-case-studies)
* [Závěr: nejlepší postupy nasazení produkce Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Kompletní seznam zdrojů pro produkci Node.js](#complete-resource-list-for-nodejs-production)
  * [Naše hlavní implementační soubory](#our-core-implementation-files)
  * [Naše serverové implementace](#our-server-implementations)
  * [Naše automatizace infrastruktury](#our-infrastructure-automation)
  * [Naše technické blogové příspěvky](#our-technical-blog-posts)
  * [Naše podnikové případové studie](#our-enterprise-case-studies)
## Předmluva {#foreword}

Ve Forward Email jsme strávili roky zdokonalováním našeho produkčního prostředí Node.js. Tento komplexní průvodce sdílí naše osvědčené nejlepší postupy nasazení Node.js do produkce, zaměřené na optimalizaci výkonu, monitorování a lekce, které jsme se naučili při škálování aplikací Node.js pro zpracování milionů denních transakcí.


## Naše revoluce v optimalizaci výkonu na jedno jádro o 573 % {#our-573-single-core-performance-optimization-revolution}

Když jsme přešli z procesorů Intel na AMD Ryzen, dosáhli jsme **573% zlepšení výkonu** v našich aplikacích Node.js. Nebyla to jen drobná optimalizace – zásadně to změnilo, jak naše aplikace Node.js fungují v produkci, a ukazuje to důležitost optimalizace výkonu na jedno jádro pro jakoukoli aplikaci Node.js.

> \[!TIP]
> Pro nejlepší postupy nasazení Node.js do produkce je kritická volba hardwaru. Konkrétně jsme zvolili hosting DataPacket kvůli dostupnosti AMD Ryzen, protože výkon na jedno jádro je pro aplikace Node.js klíčový, jelikož vykonávání JavaScriptu je jednovláknové.

### Proč je optimalizace výkonu na jedno jádro důležitá pro Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Naše migrace z Intel na AMD Ryzen přinesla:

* **573% zlepšení výkonu** při zpracování požadavků (zdokumentováno v [naší status stránce GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminaci zpoždění zpracování** na téměř okamžité odpovědi (zmíněno v [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Lepší poměr cena/výkon** pro produkční prostředí Node.js
* **Zlepšené doby odezvy** na všech našich aplikačních koncových bodech

Zvýšení výkonu bylo natolik významné, že nyní považujeme procesory AMD Ryzen za nezbytné pro jakékoli seriózní produkční nasazení Node.js, ať už provozujete webové aplikace, API, mikroslužby nebo jakoukoli jinou zátěž Node.js.

### Související obsah {#related-content}

Pro více informací o našich infrastrukturních volbách si prohlédněte:

* [Nejlepší služba pro přeposílání e-mailů](https://forwardemail.net/blog/docs/best-email-forwarding-service) – srovnání výkonu
* [Řešení pro vlastní hosting](https://forwardemail.net/blog/docs/self-hosted-solution) – doporučení hardwaru


## Nastavení produkčního prostředí Node.js: Náš technologický stack {#nodejs-production-environment-setup-our-technology-stack}

Naše nejlepší postupy nasazení Node.js do produkce zahrnují promyšlené technologické volby založené na letech produkčních zkušeností. Toto používáme a proč jsou tyto volby vhodné pro jakoukoli aplikaci Node.js:

### Správce balíčků: pnpm pro produkční efektivitu {#package-manager-pnpm-for-production-efficiency}

**Co používáme:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (přesná verze)

Zvolili jsme pnpm místo npm a yarn pro naše produkční prostředí Node.js, protože:

* **Rychlejší doby instalace** v CI/CD pipelinech
* **Efektivita využití místa na disku** díky hard linkům
* **Přísné řešení závislostí**, které zabraňuje neviditelným závislostem
* **Lepší výkon** při produkčním nasazení

> \[!NOTE]
> Jako součást našich nejlepších postupů nasazení Node.js do produkce připínáme přesné verze kritických nástrojů jako pnpm, abychom zajistili konzistentní chování ve všech prostředích a na strojích členů týmu.

**Detaily implementace:**

* [Naše konfigurace package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Náš blogový příspěvek o ekosystému NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webový framework: Koa pro moderní produkci Node.js {#web-framework-koa-for-modern-nodejs-production}

**Co používáme:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Vybrali jsme Koa místo Express pro naši produkční infrastrukturu Node.js kvůli jeho moderní podpoře async/await a čistší kompozici middleware. Náš zakladatel Nick Baugh přispěl jak do Express, tak do Koa, což nám poskytlo hluboký vhled do obou frameworků pro produkční použití.

Tyto vzory platí bez ohledu na to, zda vytváříte REST API, GraphQL servery, webové aplikace nebo mikroslužby.

**Naše příklady implementace:**

* [Nastavení webového serveru](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Konfigurace API serveru](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Průvodce implementací kontaktních formulářů](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Zpracování úloh na pozadí: Bree pro produkční spolehlivost {#background-job-processing-bree-for-production-reliability}

**Co používáme:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) plánovač

Vytvořili jsme a udržujeme Bree, protože stávající plánovače úloh nesplňovaly naše požadavky na podporu worker threadů a moderní funkce JavaScriptu v produkčních prostředích Node.js. Toto platí pro jakoukoli aplikaci Node.js, která potřebuje zpracování na pozadí, plánované úlohy nebo worker threaddy.

**Naše příklady implementace:**

* [Nastavení Bree serveru](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Všechny naše definice úloh](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Úloha kontroly zdraví PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementace úklidové úlohy](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Zpracování chyb: @hapi/boom pro produkční spolehlivost {#error-handling-hapiboom-for-production-reliability}

**Co používáme:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Používáme @hapi/boom pro strukturované chybové odpovědi v našich produkčních aplikacích Node.js. Tento vzor funguje pro jakoukoli aplikaci Node.js, která potřebuje konzistentní zpracování chyb.

**Naše příklady implementace:**

* [Pomocník pro klasifikaci chyb](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementace loggeru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Jak monitorovat aplikace Node.js v produkci {#how-to-monitor-nodejs-applications-in-production}

Náš přístup k monitorování aplikací Node.js v produkci se vyvíjel během let provozu aplikací ve velkém měřítku. Implementujeme monitorování na několika úrovních, abychom zajistili spolehlivost a výkon pro jakýkoli typ aplikace Node.js.

### Monitorování produkce Node.js na systémové úrovni {#system-level-nodejs-production-monitoring}

**Naše základní implementace:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Co používáme:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Naše prahové hodnoty pro produkční monitorování (z našeho skutečného produkčního kódu):

* **Limit velikosti heapu 2GB** s automatickými upozorněními
* **Varovný práh využití paměti 25%**
* **Upozornění při využití CPU 80%**
* **Varovný práh využití disku 75%**

> \[!WARNING]
> Tyto prahové hodnoty fungují pro naši konkrétní hardwarovou konfiguraci. Při implementaci produkčního monitorování Node.js si prostudujte naši implementaci monitor-server.js, abyste pochopili přesnou logiku a přizpůsobili hodnoty pro vaše prostředí.

### Monitorování na úrovni aplikace pro produkci Node.js {#application-level-monitoring-for-nodejs-production}

**Naše klasifikace chyb:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tento pomocník rozlišuje mezi:

* **Skutečnými chybami v kódu**, které vyžadují okamžitou pozornost
* **Chybami uživatele**, které jsou očekávaným chováním
* **Selháními externích služeb**, která nemůžeme ovlivnit

Tento vzor platí pro jakoukoli aplikaci Node.js – webové aplikace, API, mikroslužby nebo služby na pozadí.
**Naše implementace logování:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementujeme komplexní redakci polí pro ochranu citlivých informací při zachování užitečných možností ladění v našem produkčním prostředí Node.js.

### Monitorování specifické pro aplikaci {#application-specific-monitoring}

**Naše implementace serverů:**

* [SMTP server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitorování front:** Zavádíme limity fronty 5GB a časové limity 180 sekund pro zpracování požadavků, abychom zabránili vyčerpání zdrojů. Tyto vzory platí pro jakoukoli aplikaci Node.js s frontami nebo zpracováním na pozadí.


## Produkční monitorování Node.js s PM2 health checks {#nodejs-production-monitoring-with-pm2-health-checks}

Naše nastavení produkčního prostředí Node.js s PM2 jsme vylepšili během let produkčních zkušeností. Naše PM2 health checks jsou nezbytné pro udržení spolehlivosti v jakékoli aplikaci Node.js.

### Náš systém PM2 health checks {#our-pm2-health-check-system}

**Naše základní implementace:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Naše produkční monitorování Node.js s PM2 health checks zahrnuje:

* **Spouští se každých 20 minut** pomocí cron plánování
* **Vyžaduje minimálně 15 minut provozu** před tím, než je proces považován za zdravý
* **Ověřuje stav procesu a využití paměti**
* **Automaticky restartuje selhané procesy**
* **Zabraňuje restartovacím smyčkám** pomocí inteligentního kontrolování stavu

> \[!CAUTION]
> Pro nejlepší postupy nasazení produkce Node.js vyžadujeme 15+ minut provozu před tím, než je proces považován za zdravý, aby se zabránilo restartovacím smyčkám. To zabraňuje kaskádovým selháním, když procesy bojují s pamětí nebo jinými problémy.

### Naše produkční konfigurace PM2 {#our-pm2-production-configuration}

**Naše nastavení ekosystému:** Prostudujte si naše soubory pro spuštění serveru pro nastavení produkčního prostředí Node.js:

* [Webový server](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Plánovač Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Tyto vzory platí, ať už provozujete aplikace Express, servery Koa, GraphQL API nebo jakoukoli jinou aplikaci Node.js.

### Automatizované nasazení PM2 {#automated-pm2-deployment}

**Nasazení PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizujeme celé naše nastavení PM2 pomocí Ansible, abychom zajistili konzistentní produkční nasazení Node.js na všech našich serverech.


## Produkční systém zpracování a klasifikace chyb {#production-error-handling-and-classification-system}

Jedním z našich nejcennějších osvědčených postupů nasazení produkce Node.js je inteligentní klasifikace chyb, která platí pro jakoukoli aplikaci Node.js:

### Naše implementace isCodeBug pro produkci {#our-iscodebug-implementation-for-production}

**Zdroj:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tento pomocník poskytuje inteligentní klasifikaci chyb pro aplikace Node.js v produkci, aby:

* **Upřednostnil skutečné chyby** před uživatelskými chybami
* **Zlepšil naši reakci na incidenty** zaměřením na reálné problémy
* **Snížil únavu z upozornění** způsobenou očekávanými uživatelskými chybami
* **Lépe porozuměl** problémům aplikace vs. uživatelem generovaným problémům

Tento vzor funguje pro jakoukoli aplikaci Node.js – ať už vytváříte e-commerce stránky, SaaS platformy, API nebo mikroslužby.

### Integrace s naším produkčním logováním {#integration-with-our-production-logging}

**Naše integrace loggeru:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Náš logger používá `isCodeBug` k určení úrovní upozornění a redakce polí, což zajišťuje, že dostáváme oznámení o skutečných problémech, zatímco filtruje šum v našem produkčním prostředí Node.js.

### Související obsah {#related-content-1}

Zjistěte více o našich vzorcích zpracování chyb:

* [Budování spolehlivého platebního systému](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Vzory zpracování chyb
* [Ochrana soukromí e-mailů](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Zpracování bezpečnostních chyb


## Pokročilé ladění výkonu s v8-profiler-next a cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Používáme pokročilé nástroje pro profilování k analýze snapshotů haldy a ladění problémů OOM (Out of Memory), úzkých míst výkonu a problémů s pamětí Node.js v našem produkčním prostředí. Tyto nástroje jsou nezbytné pro jakoukoli aplikaci Node.js, která zažívá úniky paměti nebo problémy s výkonem.

### Náš přístup k profilování pro produkci Node.js {#our-profiling-approach-for-nodejs-production}

**Nástroje, které doporučujeme:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Pro generování snapshotů haldy a CPU profilů
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Pro analýzu CPU profilů a snapshotů haldy

> \[!TIP]
> Používáme v8-profiler-next a cpupro společně k vytvoření kompletního workflow ladění výkonu pro naše aplikace Node.js. Tato kombinace nám pomáhá identifikovat úniky paměti, úzká místa výkonu a optimalizovat náš produkční kód.

### Jak implementujeme analýzu snapshotů haldy {#how-we-implement-heap-snapshot-analysis}

**Naše implementace monitoringu:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Náš produkční monitoring zahrnuje automatické generování snapshotů haldy při překročení prahových hodnot paměti. To nám pomáhá ladit problémy OOM dříve, než způsobí pád aplikace.

**Klíčové implementační vzory:**

* **Automatické snapshoty** při překročení velikosti haldy 2GB
* **Profilování na základě signálů** pro analýzu na vyžádání v produkci
* **Politiky uchovávání** pro správu úložiště snapshotů
* **Integrace s našimi úklidovými úlohami** pro automatickou údržbu

### Workflow ladění výkonu {#performance-debugging-workflow}

**Prostudujte si naši aktuální implementaci:**

* [Implementace monitor serveru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoring haldy a generování snapshotů
* [Úklidová úloha](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Uchovávání a úklid snapshotů
* [Integrace loggeru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Logování výkonu

### Doporučená implementace pro vaši aplikaci Node.js {#recommended-implementation-for-your-nodejs-application}

**Pro analýzu snapshotů haldy:**

1. **Nainstalujte v8-profiler-next** pro generování snapshotů
2. **Použijte cpupro** pro analýzu vygenerovaných snapshotů
3. **Implementujte prahové hodnoty monitoringu** podobně jako v monitor-server.js
4. **Nastavte automatický úklid** pro správu úložiště snapshotů
5. **Vytvořte handlery signálů** pro profilování na vyžádání v produkci

**Pro CPU profilování:**

1. **Generujte CPU profily** během období vysoké zátěže
2. **Analyzujte pomocí cpupro** k identifikaci úzkých míst
3. **Zaměřte se na horké cesty** a možnosti optimalizace
4. **Monitorujte výkon před a po** zlepšeních

> \[!WARNING]
> Generování snapshotů haldy a CPU profilů může ovlivnit výkon. Doporučujeme implementovat omezení a povolovat profilování pouze při vyšetřování konkrétních problémů nebo během údržbových oken.

### Integrace s naším produkčním monitoringem {#integration-with-our-production-monitoring}

Naše nástroje pro profilování se integrují s naší širší strategií monitoringu:

* **Automatické spouštění** na základě prahových hodnot paměti/CPU
* **Integrace upozornění** při detekci problémů s výkonem
* **Historická analýza** pro sledování trendů výkonu v čase
* **Korelace s metrikami aplikace** pro komplexní ladění
Tento přístup nám pomohl identifikovat a vyřešit úniky paměti, optimalizovat kritické části kódu a udržet stabilní výkon v našem produkčním prostředí Node.js.


## Bezpečnost produkční infrastruktury Node.js {#nodejs-production-infrastructure-security}

Implementujeme komplexní zabezpečení naší produkční infrastruktury Node.js pomocí automatizace Ansible. Tyto postupy platí pro jakoukoli aplikaci Node.js:

### Bezpečnost na úrovni systému pro produkci Node.js {#system-level-security-for-nodejs-production}

**Naše implementace Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Naše klíčová bezpečnostní opatření pro produkční prostředí Node.js:

* **Swap zakázán** aby se zabránilo zápisu citlivých dat na disk
* **Core dumpy zakázány** aby se zabránilo výpisům paměti obsahujícím citlivé informace
* **USB úložiště zablokováno** aby se zabránil neoprávněný přístup k datům
* **Ladění parametrů jádra** pro bezpečnost i výkon

> \[!WARNING]
> Při zavádění osvědčených postupů nasazení produkce Node.js může zakázání swapu způsobit ukončení procesu kvůli nedostatku paměti, pokud vaše aplikace překročí dostupnou RAM. Pečlivě sledujeme využití paměti a správně dimenzujeme naše servery.

### Bezpečnost aplikací pro Node.js {#application-security-for-nodejs-applications}

**Naše redakce polí v logu:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Redigujeme citlivá pole v logech včetně hesel, tokenů, API klíčů a osobních údajů. To chrání soukromí uživatelů a zároveň zachovává možnosti ladění v jakémkoli produkčním prostředí Node.js.

### Automatizace bezpečnosti infrastruktury {#infrastructure-security-automation}

**Naše kompletní nastavení Ansible pro produkci Node.js:**

* [Bezpečnostní playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Správa SSH klíčů](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Správa certifikátů](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Nastavení DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Náš bezpečnostní obsah {#our-security-content}

Zjistěte více o našem bezpečnostním přístupu:

* [Nejlepší společnosti pro bezpečnostní audity](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Kvantově bezpečný šifrovaný e-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Proč otevřený zdroj pro bezpečnost e-mailu](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Architektura databáze pro aplikace Node.js {#database-architecture-for-nodejs-applications}

Používáme hybridní databázový přístup optimalizovaný pro naše aplikace Node.js. Tyto vzory lze přizpůsobit pro jakoukoli aplikaci Node.js:

### Implementace SQLite pro produkci Node.js {#sqlite-implementation-for-nodejs-production}

**Co používáme:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Naše konfigurace:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Používáme SQLite pro uživatelská data v našich aplikacích Node.js, protože poskytuje:

* **Izolaci dat** pro každého uživatele/nájemce
* **Lepší výkon** pro dotazy jednoho uživatele
* **Zjednodušenou zálohu** a migraci
* **Sníženou složitost** ve srovnání se sdílenými databázemi

Tento vzor dobře funguje pro SaaS aplikace, multi-tenant systémy nebo jakoukoli aplikaci Node.js, která potřebuje izolaci dat.

### Implementace MongoDB pro produkci Node.js {#mongodb-implementation-for-nodejs-production}

**Co používáme:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Naše implementace nastavení:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Naše konfigurace:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Používáme MongoDB pro data aplikace v našem produkčním prostředí Node.js, protože poskytuje:

* **Flexibilní schéma** pro vyvíjející se datové struktury
* **Lepší výkon** pro složité dotazy
* **Možnosti horizontálního škálování**
* **Bohatý dotazovací jazyk**

> \[!NOTE]
> Náš hybridní přístup je optimalizován pro náš konkrétní případ použití. Prostudujte si skutečné vzory využití databáze v kódu, abyste pochopili, zda tento přístup vyhovuje potřebám vaší aplikace Node.js.


## Zpracování pozadí úloh v produkci Node.js {#nodejs-production-background-job-processing}

Naši architekturu pozadí úloh jsme postavili kolem Bree pro spolehlivé nasazení produkce Node.js. Toto platí pro jakoukoli aplikaci Node.js, která potřebuje zpracování na pozadí:

### Naše nastavení Bree serveru pro produkci {#our-bree-server-setup-for-production}

**Naše hlavní implementace:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Naše nasazení Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Příklady produkčních úloh {#production-job-examples}

**Monitorování stavu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatizace úklidu:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Všechny naše úlohy:** [Prohlédněte si náš kompletní adresář úloh](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Tyto vzory platí pro jakoukoli aplikaci Node.js, která potřebuje:

* Plánované úkoly (zpracování dat, reporty, úklid)
* Zpracování na pozadí (změna velikosti obrázků, odesílání e-mailů, importy dat)
* Monitorování stavu a údržbu
* Využití pracovních vláken pro CPU náročné úkoly

### Naše vzory plánování úloh pro produkci Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Prostudujte si skutečné vzory plánování úloh v našem adresáři úloh, abyste pochopili:

* Jak implementujeme plánování podobné cron v produkci Node.js
* Naše zpracování chyb a logiku opakování
* Jak používáme pracovní vlákna pro CPU náročné úkoly


## Automatizovaná údržba pro produkční aplikace Node.js {#automated-maintenance-for-production-nodejs-applications}

Implementujeme proaktivní údržbu, abychom předešli běžným problémům produkce Node.js. Tyto vzory platí pro jakoukoli aplikaci Node.js:

### Naše implementace úklidu {#our-cleanup-implementation}

**Zdroj:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Naše automatizovaná údržba pro produkční aplikace Node.js cílí na:

* **Dočasné soubory** starší než 24 hodin
* **Log soubory** přesahující limity uchovávání
* **Cache soubory** a dočasná data
* **Nahrané soubory**, které již nejsou potřeba
* **Heap snapshoty** z ladění výkonu

Tyto vzory platí pro jakoukoli aplikaci Node.js, která generuje dočasné soubory, logy nebo cache data.

### Správa místa na disku pro produkci Node.js {#disk-space-management-for-nodejs-production}

**Naše prahové hodnoty monitorování:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limity fronty** pro zpracování na pozadí
* **Varování při 75 % využití disku**
* **Automatický úklid** při překročení prahových hodnot

### Automatizace údržby infrastruktury {#infrastructure-maintenance-automation}

**Naše Ansible automatizace pro produkci Node.js:**

* [Nasazení prostředí](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Správa klíčů nasazení](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Průvodce implementací produkčního nasazení Node.js {#nodejs-production-deployment-implementation-guide}
### Studujte náš skutečný kód pro nejlepší postupy v produkci {#study-our-actual-code-for-production-best-practices}

**Začněte s těmito klíčovými soubory pro nastavení produkčního prostředí Node.js:**

1. **Konfigurace:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitorování:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Zpracování chyb:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logování:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Zdraví procesu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Naučte se z našich blogových příspěvků {#learn-from-our-blog-posts}

**Naše technické průvodce implementací pro produkci Node.js:**

* [Ekosystém balíčků NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Budování platebních systémů](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementace ochrany soukromí e-mailů](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript kontaktní formuláře](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrace e-mailů v Reactu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatizace infrastruktury pro produkci Node.js {#infrastructure-automation-for-nodejs-production}

**Naše Ansible playbooky ke studiu pro nasazení produkce Node.js:**

* [Kompletní adresář playbooků](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Zpevnění bezpečnosti](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Nastavení Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Naše případové studie {#our-case-studies}

**Naše podnikové implementace:**

* [Případová studie Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Případová studie Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Přeposílání e-mailů absolventů](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Závěr: Nejlepší postupy nasazení produkce Node.js {#conclusion-nodejs-production-deployment-best-practices}

Naše produkční infrastruktura Node.js ukazuje, že aplikace Node.js mohou dosáhnout podnikové spolehlivosti díky:

* **Ověřeným hardwarovým volbám** (AMD Ryzen pro optimalizaci výkonu jednoho jádra o 573 %)
* **Ověřenému monitorování produkce Node.js** s konkrétními prahy a automatizovanými reakcemi
* **Chytré klasifikaci chyb** pro zlepšení reakce na incidenty v produkčním prostředí
* **Pokročilému ladění výkonu** s v8-profiler-next a cpupro pro prevenci OOM
* **Komplexnímu zpevnění bezpečnosti** pomocí Ansible automatizace
* **Hybridní databázové architektuře** optimalizované pro potřeby aplikace
* **Automatizované údržbě** k prevenci běžných problémů produkce Node.js

**Hlavní závěr:** Studujte naše skutečné implementační soubory a blogové příspěvky místo sledování obecných nejlepších postupů. Naše kódová základna poskytuje reálné vzory pro nasazení produkce Node.js, které lze přizpůsobit jakékoli aplikaci Node.js – webovým aplikacím, API, mikroslužbám nebo pozadním službám.


## Kompletní seznam zdrojů pro produkci Node.js {#complete-resource-list-for-nodejs-production}

### Naše hlavní implementační soubory {#our-core-implementation-files}

* [Hlavní konfigurace](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Závislosti balíčků](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitorování serveru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Klasifikace chyb](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Systém logování](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Kontroly zdraví PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatické čištění](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Naše implementace serverů {#our-server-implementations}

* [Webový server](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Plánovač Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Naše automatizace infrastruktury {#our-infrastructure-automation}

* [Všechny naše Ansible playbooky](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Zpevnění bezpečnosti](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Nastavení Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Konfigurace databáze](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Naše technické blogové příspěvky {#our-technical-blog-posts}

* [Analýza ekosystému NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementace platebního systému](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Technická příručka ochrany soukromí e-mailů](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript kontaktní formuláře](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrace e-mailů v Reactu](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Průvodce vlastní hostovaným řešením](https://forwardemail.net/blog/docs/self-hosted-solution)

### Naše podnikové případové studie {#our-enterprise-case-studies}

* [Implementace Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Případová studie Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Soulad s federální vládou](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [E-mailové systémy absolventů](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
