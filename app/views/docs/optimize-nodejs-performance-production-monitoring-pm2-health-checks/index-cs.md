# Jak optimalizovat produkční infrastrukturu Node.js: Nejlepší postupy {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Naše revoluce v optimalizaci výkonu jednoho jádra s 573% výkonem](#our-573-single-core-performance-optimization-revolution)
  * [Proč je optimalizace výkonu jednoho jádra důležitá pro Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Související obsah](#related-content)
* [Nastavení produkčního prostředí Node.js: Náš technologický stack](#nodejs-production-environment-setup-our-technology-stack)
  * [Správce balíčků: pnpm pro efektivitu produkce](#package-manager-pnpm-for-production-efficiency)
  * [Webový framework: Koa pro moderní produkci Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Zpracování úloh na pozadí: Bree pro spolehlivost produkce](#background-job-processing-bree-for-production-reliability)
  * [Ošetření chyb: @hapi/boom pro spolehlivost produkce](#error-handling-hapiboom-for-production-reliability)
* [Jak monitorovat aplikace Node.js v produkčním prostředí](#how-to-monitor-nodejs-applications-in-production)
  * [Monitorování produkce Node.js na úrovni systému](#system-level-nodejs-production-monitoring)
  * [Monitorování na úrovni aplikací pro produkční prostředí Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitorování specifické pro aplikaci](#application-specific-monitoring)
* [Monitorování produkce Node.js pomocí kontrol stavu PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Náš systém kontroly stavu PM2](#our-pm2-health-check-system)
  * [Naše konfigurace výroby PM2](#our-pm2-production-configuration)
  * [Automatizované nasazení PM2](#automated-pm2-deployment)
* [Systém pro zpracování a klasifikaci výrobních chyb](#production-error-handling-and-classification-system)
  * [Naše implementace isCodeBug pro produkční prostředí](#our-iscodebug-implementation-for-production)
  * [Integrace s naším systémem logování produkce](#integration-with-our-production-logging)
  * [Související obsah](#related-content-1)
* [Pokročilé ladění výkonu s v8-profiler-next a cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Náš přístup k profilování pro produkční prostředí Node.js](#our-profiling-approach-for-nodejs-production)
  * [Jak implementujeme analýzu snímků haldy](#how-we-implement-heap-snapshot-analysis)
  * [Pracovní postup ladění výkonu](#performance-debugging-workflow)
  * [Doporučená implementace pro vaši aplikaci Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integrace s naším monitorováním výroby](#integration-with-our-production-monitoring)
* [Zabezpečení produkční infrastruktury Node.js](#nodejs-production-infrastructure-security)
  * [Zabezpečení na úrovni systému pro produkční prostředí Node.js](#system-level-security-for-nodejs-production)
  * [Zabezpečení aplikací pro Node.js](#application-security-for-nodejs-applications)
  * [Automatizace zabezpečení infrastruktury](#infrastructure-security-automation)
  * [Náš bezpečnostní obsah](#our-security-content)
* [Architektura databáze pro aplikace Node.js](#database-architecture-for-nodejs-applications)
  * [Implementace SQLite pro produkční prostředí Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementace MongoDB pro produkční prostředí Node.js](#mongodb-implementation-for-nodejs-production)
* [Zpracování úloh na pozadí produkčního prostředí Node.js](#nodejs-production-background-job-processing)
  * [Naše nastavení serveru Bree pro produkční účely](#our-bree-server-setup-for-production)
  * [Příklady produkčních prací](#production-job-examples)
  * [Naše vzory plánování úloh pro produkční prostředí Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatizovaná údržba produkčních aplikací Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Naše implementace úklidu](#our-cleanup-implementation)
  * [Správa diskového prostoru pro produkční prostředí Node.js](#disk-space-management-for-nodejs-production)
  * [Automatizace údržby infrastruktury](#infrastructure-maintenance-automation)
* [Průvodce implementací produkčního nasazení Node.js](#nodejs-production-deployment-implementation-guide)
  * [Prostudujte si náš skutečný kód pro osvědčené postupy v produkčním prostředí](#study-our-actual-code-for-production-best-practices)
  * [Učte se z našich blogových příspěvků](#learn-from-our-blog-posts)
  * [Automatizace infrastruktury pro produkční prostředí Node.js](#infrastructure-automation-for-nodejs-production)
  * [Naše případové studie](#our-case-studies)
* [Závěr: Nejlepší postupy pro nasazení Node.js v produkčním prostředí](#conclusion-nodejs-production-deployment-best-practices)
* [Kompletní seznam zdrojů pro produkční prostředí Node.js](#complete-resource-list-for-nodejs-production)
  * [Naše základní implementační soubory](#our-core-implementation-files)
  * [Naše implementace serverů](#our-server-implementations)
  * [Automatizace naší infrastruktury](#our-infrastructure-automation)
  * [Naše technické příspěvky na blogu](#our-technical-blog-posts)
  * [Případové studie našich podniků](#our-enterprise-case-studies)

## Předmluva {#foreword}

Ve Forward Email jsme strávili roky zdokonalováním našeho produkčního prostředí Node.js. Tato komplexní příručka sdílí naše osvědčené postupy pro nasazení produkčního prostředí Node.js se zaměřením na optimalizaci výkonu, monitorování a poznatky, které jsme získali při škálování aplikací Node.js pro zpracování milionů transakcí denně.

## Naše revoluce v optimalizaci výkonu jednoho jádra s 573% úspěšností {#our-573-single-core-performance-optimization-revolution}

Když jsme migrovali z procesorů Intel na procesory AMD Ryzen, dosáhli jsme **573% zlepšení výkonu** v našich aplikacích Node.js. Nešlo jen o drobnou optimalizaci – zásadně to změnilo způsob, jakým naše aplikace Node.js fungují v produkčním prostředí, a demonstruje to důležitost optimalizace výkonu jednoho jádra pro jakoukoli aplikaci Node.js.

> \[!TIP]
> Pro osvědčené postupy nasazení Node.js v produkčním prostředí je výběr hardwaru klíčový. Zvolili jsme hosting DataPacket konkrétně kvůli dostupnosti procesorů AMD Ryzen, protože výkon jednoho jádra je pro aplikace Node.js klíčový, jelikož spouštění JavaScriptu je jednovláknové.

### Proč je optimalizace výkonu jednoho jádra důležitá pro Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Naše migrace z Intelu na AMD Ryzen přinesla:

* **573% zlepšení výkonu** při zpracování požadavků (dokumentováno v [Problém na GitHubu na naší stránce se stavem #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminováno zpoždění zpracování** na téměř okamžité odpovědi (zmíněno v [Problém na GitHubu #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Lepší poměr ceny a výkonu** pro produkční prostředí Node.js
* **Zlepšené doby odezvy** napříč všemi koncovými body našich aplikací

Zvýšení výkonu bylo tak významné, že nyní považujeme procesory AMD Ryzen za nezbytné pro jakékoli seriózní produkční nasazení Node.js, ať už provozujete webové aplikace, API, mikroslužby nebo jakoukoli jinou pracovní zátěž Node.js.

### Související obsah {#related-content}

Další podrobnosti o našich možnostech infrastruktury naleznete zde:

* [Nejlepší služba pro přeposílání e-mailů](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Porovnání výkonu
* [Řešení s vlastním hostováním](https://forwardemail.net/blog/docs/self-hosted-solution) - Doporučení ohledně hardwaru

## Nastavení produkčního prostředí Node.js: Náš technologický stack {#nodejs-production-environment-setup-our-technology-stack}

Naše osvědčené postupy pro nasazení Node.js v produkčním prostředí zahrnují promyšlenou volbu technologií založenou na dlouholetých zkušenostech s produkčním prostředím. Zde je seznam toho, co používáme a proč se tyto volby vztahují na jakoukoli aplikaci Node.js:

### Správce balíčků: pnpm pro efektivitu produkce {#package-manager-pnpm-for-production-efficiency}

**Co používáme:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (připnutá verze)

Pro naše produkční prostředí Node.js jsme zvolili pnpm před npm a yarn, protože:

* **Rychlejší doba instalace** v CI/CD pipelines
* **Efektivita využití místa na disku** díky hard linkingu
* **Přísné rozlišení závislostí**, které zabraňuje fiktivním závislostem
* **Lepší výkon** v produkčních nasazeních

> \[!NOTE]
> V rámci našich osvědčených postupů pro nasazení Node.js v produkčním prostředí používáme přesné verze klíčových nástrojů, jako je pnpm, abychom zajistili konzistentní chování ve všech prostředích a na všech počítačích členů týmu.

**Podrobnosti implementace:**

* [Naše konfigurace package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Náš blogový příspěvek o ekosystému NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webový framework: Koa pro moderní produkční prostředí Node.js {#web-framework-koa-for-modern-nodejs-production}

**Co používáme:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Pro naši produkční infrastrukturu Node.js jsme zvolili Koa před Expressem kvůli jeho moderní podpoře async/await a čistšímu složení middlewaru. Náš zakladatel Nick Baugh přispěl k Expressu i Koa a poskytl nám hluboký vhled do obou frameworků pro produkční použití.

Tyto vzory platí pro všechny typy aplikací, ať už vytváříte REST API, servery GraphQL, webové aplikace nebo mikroslužby.

**Naše příklady implementace:**

* [Nastavení webového serveru](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Konfigurace API serveru](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Průvodce implementací kontaktních formulářů](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Zpracování úlohy na pozadí: Bree pro spolehlivost produkce {#background-job-processing-bree-for-production-reliability}

**Co používáme:** Plánovač [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Vytvořili jsme a udržujeme Bree, protože stávající plánovače úloh nesplňovaly naše potřeby na podporu pracovních vláken a moderní funkce JavaScriptu v produkčním prostředí Node.js. To platí pro všechny aplikace Node.js, které potřebují zpracování na pozadí, plánované úlohy nebo pracovní vlákna.

**Naše příklady implementace:**

* [Nastavení serveru Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Všechny naše definice pracovních pozic](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Úloha kontroly stavu PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementace úklidové úlohy](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Zpracování chyb: @hapi/boom pro spolehlivost produkce {#error-handling-hapiboom-for-production-reliability}

**Co používáme:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Pro strukturované odpovědi na chyby v našich produkčních aplikacích Node.js používáme @hapi/boom. Tento vzor funguje pro jakoukoli aplikaci Node.js, která vyžaduje konzistentní zpracování chyb.

**Naše příklady implementace:**

* [Pomocník pro klasifikaci chyb](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementace loggeru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Jak monitorovat aplikace Node.js v produkčním prostředí {#how-to-monitor-nodejs-applications-in-production}

Náš přístup k monitorování Node.js aplikací v produkčním prostředí se vyvíjel v průběhu let provozování aplikací ve velkém měřítku. Monitorování implementujeme na více vrstvách, abychom zajistili spolehlivost a výkon pro jakýkoli typ Node.js aplikace.

### Monitorování produkce Node.js na úrovni systému {#system-level-nodejs-production-monitoring}

**Naše základní implementace:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Co používáme:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Naše prahové hodnoty pro monitorování produkce (z našeho skutečného produkčního kódu):

* **Limit velikosti haldy 2 GB** s automatickými upozorněními
* **25% využití paměti** prahová hodnota upozornění
* **80% využití CPU** prahová hodnota upozornění
* **75% využití disku** prahová hodnota upozornění

> \[!WARNING]
> Tyto prahové hodnoty fungují pro naši specifickou hardwarovou konfiguraci. Při implementaci monitorování produkce Node.js si projděte naši implementaci monitor-server.js, abyste pochopili přesnou logiku a upravili hodnoty pro vaše nastavení.

### Monitorování na úrovni aplikací pro produkční prostředí Node.js {#application-level-monitoring-for-nodejs-production}

**Naše klasifikace chyby:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tento pomocník rozlišuje mezi:

* **Skutečné chyby v kódu**, které vyžadují okamžitou pozornost
* **Uživatelské chyby**, které představují očekávané chování
* **Selhání externích služeb**, která nemůžeme ovlivnit

Tento vzor platí pro jakoukoli aplikaci Node.js – webové aplikace, API, mikroslužby nebo služby na pozadí.

Naše implementace protokolování: [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementujeme komplexní redakci polí, abychom chránili citlivé informace a zároveň zachovali užitečné ladicí funkce v našem produkčním prostředí Node.js.

### Monitorování specifické pro aplikaci {#application-specific-monitoring}

**Naše implementace serverů:**

* [SMTP server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitorování front:** Implementujeme limity front 5 GB a 180sekundové časové limity pro zpracování požadavků, abychom zabránili vyčerpání zdrojů. Tyto vzorce platí pro všechny aplikace Node.js s frontami nebo zpracováním na pozadí.

## Monitorování produkce Node.js s kontrolami stavu PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Během let zkušeností s produkčním prostředím Node.js jsme vylepšili nastavení našeho produkčního prostředí Node.js pomocí PM2. Naše kontroly stavu PM2 jsou nezbytné pro udržení spolehlivosti v jakékoli aplikaci Node.js.

### Náš systém kontroly stavu PM2 {#our-pm2-health-check-system}

**Naše základní implementace:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Naše monitorování produkce Node.js s kontrolami stavu PM2 zahrnuje:

* **Spouštění každých 20 minut** pomocí plánování cron
* **Vyžaduje minimálně 15 minut provozuschopnosti** předtím, než je proces považován za zdravý
* **Ověřuje stav procesu a využití paměti**
* **Automaticky restartuje neúspěšné procesy**
* **Zabraňuje smyčkám restartu** pomocí inteligentní kontroly stavu

> \[!CAUTION]
> V rámci osvědčených postupů pro nasazení Node.js v produkčním prostředí požadujeme alespoň 15 minut provozuschopnosti, než proces považujeme za v pořádku, abychom se vyhnuli smyčkám restartování. Tím se zabrání kaskádovým selháním, když procesy mají potíže s pamětí nebo jiné problémy.

### Naše produkční konfigurace PM2 {#our-pm2-production-configuration}

**Nastavení našeho ekosystému:** Prostudujte si spouštěcí soubory našeho serveru pro nastavení produkčního prostředí Node.js:

* [Webový server](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Plánovač Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Tyto vzory platí bez ohledu na to, zda používáte aplikace Express, servery Koa, rozhraní GraphQL API nebo jakoukoli jinou aplikaci Node.js.

### Automatizované nasazení PM2 {#automated-pm2-deployment}

**Nasazení PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Celé nastavení PM2 automatizujeme prostřednictvím Ansible, abychom zajistili konzistentní nasazení Node.js v produkčním prostředí na všech našich serverech.

## Systém pro zpracování a klasifikaci produkčních chyb {#production-error-handling-and-classification-system}

Jedním z našich nejcennějších osvědčených postupů pro nasazení Node.js v produkčním prostředí je inteligentní klasifikace chyb, která se vztahuje na jakoukoli aplikaci Node.js:

### Naše implementace isCodeBug pro produkční prostředí {#our-iscodebug-implementation-for-production}

**Zdroj:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tento pomocník poskytuje inteligentní klasifikaci chyb pro aplikace Node.js v produkčním prostředí pro:

* **Upřednostnit skutečné chyby** před uživatelskými chybami
* **Zlepšit naši reakci na incidenty** zaměřením se na skutečné problémy
* **Snížit únavu z upozornění** na očekávané uživatelské chyby
* **Lepší pochopení** problémů s aplikacemi vs. problémů generovaných uživateli

Tento vzor funguje pro jakoukoli aplikaci Node.js – ať už vytváříte e-commerce weby, SaaS platformy, API nebo mikroslužby.

### Integrace s naším produkčním protokolováním {#integration-with-our-production-logging}

**Integrace našeho loggeru:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Náš logger používá `isCodeBug` k určení úrovní upozornění a redakce polí, čímž zajišťuje, že dostáváme upozornění na skutečné problémy a zároveň filtrujeme šum v našem produkčním prostředí Node.js.

### Související obsah {#related-content-1}

Zjistěte více o našich vzorcích pro zpracování chyb:

* [Budování spolehlivého platebního systému](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Vzory pro zpracování chyb
* [Ochrana soukromí e-mailů](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Zpracování chyb zabezpečení

## Pokročilé ladění výkonu s v8-profiler-next a cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

V našem produkčním prostředí používáme pokročilé nástroje pro profilování k analýze snapshotů haldy a ladění problémů s OOM (Out of Memory), úzkých míst s výkonem a problémů s pamětí Node.js. Tyto nástroje jsou nezbytné pro jakoukoli aplikaci Node.js, která má problémy s úniky paměti nebo výkonem.

### Náš přístup k profilování pro produkční prostředí Node.js {#our-profiling-approach-for-nodejs-production}

**Nářadí, které doporučujeme:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) – Pro generování snímků paměti a profilů CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) – Pro analýzu profilů CPU a snímků paměti

> \[!TIP]
> Pro vytvoření kompletního pracovního postupu pro ladění výkonu našich Node.js aplikací používáme v8-profiler-next a cpupro. Tato kombinace nám pomáhá identifikovat úniky paměti, úzká místa ve výkonu a optimalizovat náš produkční kód.

### Jak implementujeme analýzu snímků haldy {#how-we-implement-heap-snapshot-analysis}

**Naše implementace monitorování:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Náš produkční monitoring zahrnuje automatické generování snapshotů haldy při překročení prahových hodnot paměti. To nám pomáhá ladit problémy s OOM dříve, než způsobí pády aplikace.

**Klíčové implementační vzorce:**

* **Automatické snímky**, když velikost haldy překročí prahovou hodnotu 2 GB
* **Profilování na základě signálů** pro analýzu na vyžádání v produkčním prostředí
* **Zásady uchovávání** pro správu úložiště snímků
* **Integrace s našimi úlohami čištění** pro automatizovanou údržbu

### Pracovní postup ladění výkonu {#performance-debugging-workflow}

**Prostudujte si naši skutečnou implementaci:**

* [Monitorování implementace serveru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitorování haldy a generování snímků
* [Úklidová práce](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Uchovávání a čištění snímků
* [Integrace loggeru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Záznam výkonu

### Doporučená implementace pro vaši aplikaci Node.js {#recommended-implementation-for-your-nodejs-application}

**Pro analýzu snímků haldy:**

1. **Nainstalujte v8-profiler-next** pro generování snapshotů
2. **Použijte cpupro** pro analýzu vygenerovaných snapshotů
3. **Implementujte monitorovací prahy** podobně jako v našem monitor-server.js
4. **Nastavte automatické čištění** pro správu úložiště snapshotů
5. **Vytvořte obslužné rutiny signálů** pro profilování na vyžádání v produkčním prostředí

**Pro profilování CPU:**

1. **Generování profilů CPU** během období vysokého zatížení
2. **Analýza pomocí cpupro** pro identifikaci úzkých míst
3. **Zaměření na aktivní cesty** a optimalizační příležitosti
4. **Monitorování výkonu před/po**

> \[!WARNING]
> Generování snímků paměti haldy a profilů CPU může ovlivnit výkon. Doporučujeme implementovat omezení a profilování povolit pouze při zkoumání konkrétních problémů nebo během intervalů údržby.

### Integrace s naším monitorováním produkce {#integration-with-our-production-monitoring}

Naše nástroje pro profilování se integrují s naší širší strategií monitorování:

* **Automatické spouštění** na základě prahových hodnot paměti/CPU
* **Integrace upozornění** při zjištění problémů s výkonem
* **Historická analýza** pro sledování trendů výkonu v čase
* **Korelace s metrikami aplikace** pro komplexní ladění

Tento přístup nám pomohl identifikovat a vyřešit úniky paměti, optimalizovat cesty k aktivnímu kódu a udržovat stabilní výkon v našem produkčním prostředí Node.js.

## Zabezpečení produkční infrastruktury Node.js {#nodejs-production-infrastructure-security}

Pro naši produkční infrastrukturu Node.js implementujeme komplexní zabezpečení prostřednictvím automatizace Ansible. Tyto postupy platí pro všechny aplikace Node.js:

### Zabezpečení na úrovni systému pro produkční prostředí Node.js {#system-level-security-for-nodejs-production}

Naše implementace v Ansible: [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Naše klíčová bezpečnostní opatření pro produkční prostředí Node.js:

* **Swap zakázán**, aby se zabránilo zápisu citlivých dat na disk
* **Výpisy jádra zakázány**, aby se zabránilo výpisům paměti obsahujícím citlivé informace
* **USB úložiště zablokováno**, aby se zabránilo neoprávněnému přístupu k datům
* **Ladění parametrů jádra** pro zabezpečení i výkon

> \[!WARNING]
> Při implementaci osvědčených postupů pro nasazení Node.js v produkčním prostředí může zakázání swapu způsobit ukončení z důvodu nedostatku paměti, pokud vaše aplikace překročí dostupnou paměť RAM. Využití paměti pečlivě monitorujeme a naše servery dimenzujeme odpovídajícím způsobem.

### Zabezpečení aplikací pro Node.js {#application-security-for-nodejs-applications}

**Redakce pole protokolu:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Z protokolů odstraňujeme citlivá pole, včetně hesel, tokenů, klíčů API a osobních údajů. To chrání soukromí uživatelů a zároveň zachovává možnosti ladění v jakémkoli produkčním prostředí Node.js.

### Automatizace zabezpečení infrastruktury {#infrastructure-security-automation}

Naše kompletní nastavení Ansible pro produkční prostředí Node.js:

* [Bezpečnostní příručka](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Správa SSH klíčů](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Správa certifikátů](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Nastavení DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Náš bezpečnostní obsah {#our-security-content}

Zjistěte více o našem bezpečnostním přístupu:

* [Nejlepší společnosti pro bezpečnostní audity](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe šifrovaný e-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Proč zabezpečení e-mailů s otevřeným zdrojovým kódem](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Architektura databáze pro aplikace Node.js {#database-architecture-for-nodejs-applications}

Používáme hybridní databázový přístup optimalizovaný pro naše Node.js aplikace. Tyto vzory lze přizpůsobit pro jakoukoli Node.js aplikaci:

### Implementace SQLite pro produkční prostředí Node.js {#sqlite-implementation-for-nodejs-production}

**Co používáme:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Naše konfigurace: [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

V našich Node.js aplikacích používáme SQLite pro uživatelsky specifická data, protože poskytuje:

* **Izolace dat** na uživatele/nájemce
* **Lepší výkon** pro dotazy jednoho uživatele
* **Zjednodušené zálohování** a migrace
* **Snížení složitosti** ve srovnání se sdílenými databázemi

Tento vzor funguje dobře pro SaaS aplikace, multi-tenant systémy nebo jakoukoli aplikaci Node.js, která vyžaduje izolaci dat.

### Implementace MongoDB pro produkční prostředí Node.js {#mongodb-implementation-for-nodejs-production}

**Co používáme:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Naše implementace nastavení:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

Naše konfigurace: [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

V našem produkčním prostředí Node.js používáme MongoDB pro aplikační data, protože poskytuje:

* **Flexibilní schéma** pro vyvíjející se datové struktury
* **Lepší výkon** pro složité dotazy
* **Možnosti horizontálního škálování**
* **Bohatý dotazovací jazyk**

> \[!NOTE]
> Náš hybridní přístup optimalizuje náš specifický případ použití. Prostudujte si skutečné vzorce využití databáze v kódové základně, abyste zjistili, zda tento přístup vyhovuje potřebám vaší aplikace Node.js.

## Zpracování úlohy na pozadí produkčního prostředí Node.js {#nodejs-production-background-job-processing}

Naši architekturu úloh na pozadí jsme postavili kolem Bree pro spolehlivé nasazení Node.js v produkčním prostředí. To platí pro jakoukoli aplikaci Node.js, která vyžaduje zpracování na pozadí:

### Nastavení našeho serveru Bree pro produkční prostředí {#our-bree-server-setup-for-production}

**Naše hlavní implementace:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

Naše nasazení Ansible: [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Příklady produkčních úloh {#production-job-examples}

**Monitorování stavu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatizace čištění:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Všechny naše pracovní nabídky:** [Prohlédněte si náš kompletní adresář pracovních nabídek](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Tyto vzory platí pro jakoukoli aplikaci Node.js, která potřebuje:

* Plánované úlohy (zpracování dat, reporty, čištění)
* Zpracování na pozadí (změna velikosti obrázků, odesílání e-mailů, import dat)
* Monitorování a údržba stavu systému
* Využití pracovních vláken pro úlohy náročné na CPU

### Naše vzory plánování úloh pro produkční prostředí Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Prostudujte si naše skutečné vzorce plánování úloh v našem adresáři pracovních nabídek, abyste pochopili:

* Jak implementujeme plánování podobné cronu v produkčním prostředí Node.js
* Naše logika pro zpracování chyb a opakování
* Jak používáme pracovní vlákna pro úlohy náročné na CPU

## Automatizovaná údržba produkčních aplikací Node.js {#automated-maintenance-for-production-nodejs-applications}

Pro prevenci běžných problémů s produkčním prostředím Node.js implementujeme proaktivní údržbu. Tyto postupy platí pro jakoukoli aplikaci Node.js:

### Naše implementace čištění {#our-cleanup-implementation}

**Zdroj:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Naše automatizovaná údržba produkčních aplikací Node.js se zaměřuje na:

* **Dočasné soubory** starší než 24 hodin
* **Soubory protokolů** překračující limity uchování
* **Soubory mezipaměti** a dočasná data
* **Nahrané soubory**, které již nejsou potřeba
* **Snímky paměti** z ladění výkonu

Tyto vzory platí pro jakoukoli aplikaci Node.js, která generuje dočasné soubory, protokoly nebo data v mezipaměti.

### Správa místa na disku pro produkční prostředí Node.js {#disk-space-management-for-nodejs-production}

**Naše monitorovací prahy:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limity front** pro zpracování na pozadí
* **75% využití disku** varovný práh
* **Automatické čištění** při překročení prahových hodnot

### Automatizace údržby infrastruktury {#infrastructure-maintenance-automation}

Naše automatizace Ansible pro produkci Node.js:

* [Nasazení prostředí](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Správa nasadovacích klíčů](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Průvodce implementací produkčního nasazení Node.js {#nodejs-production-deployment-implementation-guide}

### Prostudujte si náš skutečný kód pro osvědčené postupy v produkčním prostředí {#study-our-actual-code-for-production-best-practices}

Začněte s těmito klíčovými soubory pro nastavení produkčního prostředí Node.js:

1. **Konfigurace:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitorování:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Ošetření chyb:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Protokolování:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Stav procesu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Učte se z našich příspěvků na blogu {#learn-from-our-blog-posts}

Naše technické implementační příručky pro produkční prostředí Node.js:

* [Ekosystém balíčků NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Budování platebních systémů](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementace ochrany osobních údajů v e-mailu](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Kontaktní formuláře v JavaScriptu](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrace e-mailů s React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatizace infrastruktury pro produkční prostředí Node.js {#infrastructure-automation-for-nodejs-production}

Naše playbooky Ansible k nastudování pro produkční nasazení Node.js:

* [Kompletní adresář herních knih](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Zpevnění zabezpečení](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Nastavení Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Naše případové studie {#our-case-studies}

Naše podnikové implementace:

* [Případová studie Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Případová studie kanonického Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Přeposílání e-mailů absolventům](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Závěr: Nejlepší postupy pro nasazení Node.js v produkčním prostředí {#conclusion-nodejs-production-deployment-best-practices}

Naše produkční infrastruktura Node.js ukazuje, že aplikace Node.js mohou dosáhnout spolehlivosti podnikové úrovně prostřednictvím:

* **Osvědčené hardwarové možnosti** (AMD Ryzen pro 573% optimalizaci výkonu jednoho jádra)
* **Ověřené monitorování produkce Node.js** se specifickými prahovými hodnotami a automatizovanými reakcemi
* **Inteligentní klasifikace chyb** pro zlepšení reakce na incidenty v produkčním prostředí
* **Pokročilé ladění výkonu** s v8-profiler-next a cpupro pro prevenci OOM
* **Komplexní posílení zabezpečení** prostřednictvím automatizace Ansible
* **Hybridní databázová architektura** optimalizovaná pro potřeby aplikací
* **Automatizovaná údržba** pro prevenci běžných produkčních problémů Node.js

**Klíčové shrnutí:** Prostudujte si naše implementační soubory a příspěvky na blogu, místo abyste se řídili obecnými osvědčenými postupy. Naše kódová základna poskytuje reálné vzory pro produkční nasazení Node.js, které lze přizpůsobit pro jakoukoli aplikaci Node.js – webové aplikace, API, mikroslužby nebo služby na pozadí.

## Kompletní seznam zdrojů pro produkční verzi Node.js {#complete-resource-list-for-nodejs-production}

### Naše základní implementační soubory {#our-core-implementation-files}

* [Hlavní konfigurace](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Závislosti balíčků](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitorování serveru](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Klasifikace chyb](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Systém protokolování](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Kontroly stavu PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatizované čištění](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Naše implementace serveru {#our-server-implementations}

* [Webový server](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Plánovač Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Naše automatizace infrastruktury {#our-infrastructure-automation}

* [Všechny naše herní příručky Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Zpevnění zabezpečení](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Nastavení Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Konfigurace databáze](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Naše technické příspěvky na blogu {#our-technical-blog-posts}

* [Analýza ekosystému NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementace platebního systému](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Technická příručka k ochraně osobních údajů v e-mailu](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Kontaktní formuláře v JavaScriptu](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrace e-mailů s React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Průvodce řešením s vlastním hostováním](https://forwardemail.net/blog/docs/self-hosted-solution)

### Naše podnikové případové studie {#our-enterprise-case-studies}

* [Implementace Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Případová studie kanonického Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Soulad federální vlády s předpisy](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [E-mailové systémy pro absolventy](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)