# A Node.js éles infrastruktúra optimalizálása: Bevált gyakorlatok {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lusta" src="/img/articles/nodejs-performance.webp" alt="" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [573%-os egymagos teljesítményoptimalizálási forradalmunk](#our-573-single-core-performance-optimization-revolution)
  * [Miért fontos az egymagos teljesítményoptimalizálás a Node.js számára?](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Kapcsolódó tartalom](#related-content)
* [Node.js éles környezet beállítása: Technológiai veremünk](#nodejs-production-environment-setup-our-technology-stack)
  * [Csomagkezelő: pnpm a termelési hatékonyság érdekében](#package-manager-pnpm-for-production-efficiency)
  * [Webes keretrendszer: Koa modern Node.js éles környezethez](#web-framework-koa-for-modern-nodejs-production)
  * [Háttérfeladat-feldolgozás: Bree a termelési megbízhatóságért](#background-job-processing-bree-for-production-reliability)
  * [Hibakezelés: @hapi/boom a termelési megbízhatóság érdekében](#error-handling-hapiboom-for-production-reliability)
* [Node.js alkalmazások monitorozása éles környezetben](#how-to-monitor-nodejs-applications-in-production)
  * [Rendszerszintű Node.js éles környezet monitorozása](#system-level-nodejs-production-monitoring)
  * [Alkalmazásszintű monitorozás Node.js éles környezetben](#application-level-monitoring-for-nodejs-production)
  * [Alkalmazásspecifikus monitorozás](#application-specific-monitoring)
* [Node.js termelési monitorozás PM2 állapotfelméréssel](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2 állapotfelmérő rendszerünk](#our-pm2-health-check-system)
  * [PM2 termelési konfigurációnk](#our-pm2-production-configuration)
  * [Automatizált PM2 telepítés](#automated-pm2-deployment)
* [Gyártási hibakezelési és osztályozási rendszer](#production-error-handling-and-classification-system)
  * [Az isCodeBug implementációnk éles környezetben](#our-iscodebug-implementation-for-production)
  * [Integráció a termelési naplózásunkkal](#integration-with-our-production-logging)
  * [Kapcsolódó tartalom](#related-content-1)
* [Speciális teljesítmény-hibakeresés a v8-profiler-next és a cpupro segítségével](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Profilozási megközelítésünk Node.js éles környezetben](#our-profiling-approach-for-nodejs-production)
  * [Hogyan implementáljuk a Heap Snapshot Analysis-t?](#how-we-implement-heap-snapshot-analysis)
  * [Teljesítmény-hibakeresési munkafolyamat](#performance-debugging-workflow)
  * [Ajánlott megvalósítás a Node.js alkalmazáshoz](#recommended-implementation-for-your-nodejs-application)
  * [Integráció a termelésfelügyeleti rendszerünkkel](#integration-with-our-production-monitoring)
* [Node.js éles infrastruktúra biztonsága](#nodejs-production-infrastructure-security)
  * [Rendszerszintű biztonság Node.js éles környezetben](#system-level-security-for-nodejs-production)
  * [Alkalmazásbiztonság Node.js alkalmazásokhoz](#application-security-for-nodejs-applications)
  * [Infrastruktúra biztonsági automatizálás](#infrastructure-security-automation)
  * [Biztonsági tartalmaink](#our-security-content)
* [Adatbázis-architektúra Node.js alkalmazásokhoz](#database-architecture-for-nodejs-applications)
  * [SQLite implementáció Node.js éles környezetben](#sqlite-implementation-for-nodejs-production)
  * [MongoDB implementáció Node.js éles környezetben](#mongodb-implementation-for-nodejs-production)
* [Node.js éles háttérfeladatok feldolgozása](#nodejs-production-background-job-processing)
  * [Bree szerverünk beállítása éles környezethez](#our-bree-server-setup-for-production)
  * [Termelési munkapéldák](#production-job-examples)
  * [Node.js éles környezetben alkalmazott feladatütemezési mintáink](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatizált karbantartás éles Node.js alkalmazásokhoz](#automated-maintenance-for-production-nodejs-applications)
  * [Takarítási megvalósításunk](#our-cleanup-implementation)
  * [Lemezterület-kezelés Node.js éles környezetben](#disk-space-management-for-nodejs-production)
  * [Infrastruktúra-karbantartási automatizálás](#infrastructure-maintenance-automation)
* [Node.js éles telepítési megvalósítási útmutató](#nodejs-production-deployment-implementation-guide)
  * [Tanulmányozd a jelenlegi kódunkat a legjobb gyártási gyakorlatokhoz](#study-our-actual-code-for-production-best-practices)
  * [Tanulj blogbejegyzéseinkből](#learn-from-our-blog-posts)
  * [Infrastruktúra automatizálás Node.js éles környezetben](#infrastructure-automation-for-nodejs-production)
  * [Esettanulmányaink](#our-case-studies)
* [Konklúzió: Node.js éles telepítési bevált gyakorlatok](#conclusion-nodejs-production-deployment-best-practices)
* [Teljes erőforráslista a Node.js éles környezethez](#complete-resource-list-for-nodejs-production)
  * [Alapvető megvalósítási fájljaink](#our-core-implementation-files)
  * [Szerver implementációink](#our-server-implementations)
  * [Infrastruktúra-automatizálásunk](#our-infrastructure-automation)
  * [Műszaki blogbejegyzéseink](#our-technical-blog-posts)
  * [Vállalati esettanulmányaink](#our-enterprise-case-studies)

## Előszó {#foreword}

A Forward Emailnél éveket töltöttünk a Node.js éles környezetünk tökéletesítésével. Ez az átfogó útmutató bemutatja a keményen tesztelt Node.js éles környezetben történő telepítés legjobb gyakorlatait, különös tekintettel a teljesítményoptimalizálásra, a monitorozásra és a Node.js alkalmazások napi több millió tranzakció kezelésére való skálázásával kapcsolatos tanulságokra.

## 573%-os egymagos teljesítményoptimalizálási forradalmunk {#our-573-single-core-performance-optimization-revolution}

Amikor Intelről AMD Ryzen processzorokra váltottunk, **573%-os teljesítményjavulást** értünk el a Node.js alkalmazásainkban. Ez nem csupán egy apró optimalizálás volt – alapvetően megváltoztatta a Node.js alkalmazásaink teljesítményét éles környezetben, és jól mutatja az egymagos teljesítményoptimalizálás fontosságát minden Node.js alkalmazás esetében.

> \[!TIP]
> For Node.js production deployment best practices, hardware choice is critical. We specifically chose DataPacket hosting for their AMD Ryzen availability because single-core performance is crucial for Node.js applications since JavaScript execution is single-threaded.

### Miért fontos az egymagos teljesítményoptimalizálás a Node.js számára {#why-single-core-performance-optimization-matters-for-nodejs}

Az Intelről AMD Ryzenre való átállásunk a következőket eredményezte:

* **573%-os teljesítményjavulás** a kérésfeldolgozásban (dokumentálva a [státuszoldalunk GitHub hibája #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Megszüntetett feldolgozási késedelmek**, közel azonnali válaszok (a [GitHub hibája #298](https://github.com/forwardemail/forwardemail.net/issues/298)] részben említve)
* **Jobb ár-teljesítmény arány** a Node.js éles környezetekben
* **Javított válaszidők** az összes alkalmazásvégpontunkon

A teljesítménynövekedés olyan jelentős volt, hogy az AMD Ryzen processzorokat most már elengedhetetlennek tartjuk minden komoly Node.js éles környezetben, függetlenül attól, hogy webes alkalmazásokat, API-kat, mikroszolgáltatásokat vagy bármilyen más Node.js munkaterhelést futtat.

### Kapcsolódó tartalom {#related-content}

Infrastruktúra-választásainkkal kapcsolatos további részletekért tekintse meg:

* [Legjobb e-mail-továbbító szolgáltatás](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Teljesítmény-összehasonlításokban
* [Saját üzemeltetésű megoldás](https://forwardemail.net/blog/docs/self-hosted-solution) - Hardverajánlások

## Node.js éles környezet beállítása: Technológiai veremünk {#nodejs-production-environment-setup-our-technology-stack}

Node.js éles környezetben történő telepítésére vonatkozó legjobb gyakorlataink magukban foglalják a több éves gyártási tapasztalaton alapuló, tudatos technológiai döntéseket. Íme, hogy mit használunk, és miért vonatkoznak ezek a választások minden Node.js alkalmazásra:

### Csomagkezelő: pnpm a termelési hatékonyság érdekében {#package-manager-pnpm-for-production-efficiency}

**Amit használunk:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (rögzített verzió)

A Node.js termelési környezetünk beállításához a pnpm-et választottuk az npm és a yarn helyett, mert:

* **Gyorsabb telepítési idők** CI/CD folyamatokban
* **Lemezterület-hatékonyság** hardveres összekapcsolás révén
* **Szigorú függőségfeloldás**, amely megakadályozza a fantomfüggőségeket
* **Jobb teljesítmény** éles környezetben

> \[!NOTE]
> As part of our Node.js production deployment best practices, we pin exact versions of critical tools like pnpm to ensure consistent behavior across all environments and team members' machines.

**Megvalósítás részletei:**

* [A package.json konfigurációnk](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM ökoszisztéma blogbejegyzésünk](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webes keretrendszer: Koa modern Node.js éles környezetben {#web-framework-koa-for-modern-nodejs-production}

**Amit használunk:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

A Node.js éles infrastruktúránk kialakításához a Koa-t választottuk az Express helyett, mivel modern aszinkron/await támogatást és letisztultabb köztes rétegrendszert kínál. Alapítónk, Nick Baugh mind az Express, mind a Koa fejlesztésében közreműködött, mélyreható betekintést nyújtva mindkét keretrendszer éles használatába.

Ezek a minták akkor is érvényesek, ha REST API-kat, GraphQL-kiszolgálókat, webalkalmazásokat vagy mikroszolgáltatásokat építesz.

**Megvalósítási példáink:**

* [Webszerver beállítása](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-kiszolgáló konfigurációja](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Kapcsolatfelvételi űrlapok megvalósítási útmutatója](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Háttérben futó feladatok feldolgozása: Bree a termelési megbízhatóság érdekében {#background-job-processing-bree-for-production-reliability}

**Amit használunk:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) ütemező

A Bree-t azért hoztuk létre és tartjuk karban, mert a meglévő feladatütemezők nem feleltek meg a munkaszálak támogatására és a modern JavaScript funkciókra vonatkozó igényeinknek az éles Node.js környezetekben. Ez minden olyan Node.js alkalmazásra vonatkozik, amely háttérfeldolgozást, ütemezett feladatokat vagy munkaszálakat igényel.

**Megvalósítási példáink:**

* [Bree szerver beállítása](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Minden munkaköri definíciónk](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 állapotfelmérés](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Takarítási feladat megvalósítása](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Hibakezelés: @hapi/boom a termelési megbízhatóság érdekében {#error-handling-hapiboom-for-production-reliability}

**Amit használunk:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

A @hapi/boom mintát használjuk a strukturált hibaválaszokhoz a Node.js éles alkalmazásainkban. Ez a minta minden olyan Node.js alkalmazásnál működik, amely konzisztens hibakezelést igényel.

**Megvalósítási példáink:**

* [Hibabesorolási segéd](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Naplózó megvalósítása](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Node.js alkalmazások monitorozása éles környezetben {#how-to-monitor-nodejs-applications-in-production}

A Node.js alkalmazások éles környezetben történő monitorozásának megközelítésünket az alkalmazások nagymértékű futtatása során fejlesztettük ki. Több rétegű monitorozást valósítunk meg, hogy biztosítsuk bármilyen típusú Node.js alkalmazás megbízhatóságát és teljesítményét.

### Rendszerszintű Node.js éles környezet monitorozása {#system-level-nodejs-production-monitoring}

**Alap implementációnk:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Amit használunk:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Termelési monitorozási küszöbértékeink (a tényleges gyártási kódunkból):

* **2 GB-os memória-korlát** automatikus riasztásokkal
* **25%-os memóriahasználat** figyelmeztetési küszöbérték
* **80%-os CPU-használat** riasztási küszöbérték
* **75%-os lemezhasználat** figyelmeztetési küszöbérték

> \[!WARNING]
> These thresholds work for our specific hardware configuration. When implementing Node.js production monitoring, review our monitor-server.js implementation to understand the exact logic and adapt the values for your setup.

### Alkalmazásszintű monitorozás Node.js éles környezetben {#application-level-monitoring-for-nodejs-production}

**Hibabesorolásunk:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ez a segédprogram különbséget tesz a következők között:

* **Valós kódhibák**, amelyek azonnali figyelmet igényelnek
* **Felhasználói hibák**, amelyek várható viselkedésnek számítanak
* **Külső szolgáltatáshibák**, amelyeket nem tudunk befolyásolni

Ez a minta minden Node.js alkalmazásra vonatkozik – webalkalmazásokra, API-kra, mikroszolgáltatásokra vagy háttérszolgáltatásokra.

**Naplózási implementációnk:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Átfogó mezőkihagyást alkalmazunk az érzékeny információk védelme érdekében, miközben hasznos hibakeresési lehetőségeket tartunk fenn Node.js éles környezetünkben.

### Alkalmazásspecifikus monitorozás {#application-specific-monitoring}

**Szerver implementációink:**

* [SMTP-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Várólista-figyelés:** 5 GB-os várólista-korlátokat és 180 másodperces időtúllépéseket alkalmazunk a kérésfeldolgozáshoz az erőforrások kimerülésének megakadályozása érdekében. Ezek a minták minden olyan Node.js alkalmazásra vonatkoznak, amely várólistákat vagy háttérfeldolgozást használ.

## Node.js éles környezet monitorozása PM2 állapotfelméréssel {#nodejs-production-monitoring-with-pm2-health-checks}

Több éves gyártási tapasztalatunk során a PM2 segítségével finomítottuk Node.js éles környezetünket. A PM2 állapotfelméréseink elengedhetetlenek a megbízhatóság fenntartásához bármely Node.js alkalmazásban.

### PM2 állapotfelmérő rendszerünk {#our-pm2-health-check-system}

**Alapvető implementációnk:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Node.js éles környezetünk monitorozása PM2 állapotfelméréssel a következőket foglalja magában:

* **20 percenként lefut** cron ütemezéssel
* **Legalább 15 perc üzemidő szükséges** a folyamat egészségesnek minősítéséhez
* **Ellenőrzi a folyamat állapotát és a memóriahasználatot**
* **Automatikusan újraindítja a sikertelen folyamatokat**
* **Megakadályozza az újraindítási ciklusokat** intelligens állapotellenőrzéssel

> \[!CAUTION]
> For Node.js production deployment best practices, we require 15+ minutes uptime before considering a process healthy to avoid restart loops. This prevents cascading failures when processes are struggling with memory or other issues.

### PM2 termelési konfigurációnk {#our-pm2-production-configuration}

**Az ökoszisztémánk beállítása:** Tanulmányozd a szerverindító fájljainkat a Node.js éles környezet beállításához:

* [Webszerver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree ütemező](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Ezek a minták akkor is érvényesek, ha Express alkalmazásokat, Koa szervereket, GraphQL API-kat vagy bármilyen más Node.js alkalmazást futtatsz.

### Automatizált PM2 telepítés {#automated-pm2-deployment}

**PM2 telepítés:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

A teljes PM2 beállításunkat automatizáljuk az Ansible segítségével, hogy biztosítsuk a Node.js konzisztens éles telepítését minden szerverünkön.

## Gyártási hibakezelési és osztályozási rendszer {#production-error-handling-and-classification-system}

Az egyik legértékesebb Node.js éles telepítési bevált gyakorlatunk az intelligens hibaosztályozás, amely minden Node.js alkalmazásra vonatkozik:

### Az isCodeBug implementációnk éles környezetben {#our-iscodebug-implementation-for-production}

**Forrás:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ez a segítő intelligens hibaosztályozást biztosít a Node.js alkalmazásokhoz éles környezetben a következőkhöz:

* **A tényleges hibákat előtérbe helyezzük** a felhasználói hibákkal szemben
* **Javítsuk az incidensekre adott válaszainkat** a valós problémákra összpontosítva
* **Csökkentsük a várható felhasználói hibák miatti riasztási fáradtságot**
* **Jobban megértsük** az alkalmazás és a felhasználók által generált problémákat

Ez a minta bármilyen Node.js alkalmazásnál működik – akár e-kereskedelmi webhelyeket, SaaS platformokat, API-kat vagy mikroszolgáltatásokat építesz.

### Integráció a termelési naplózásunkkal {#integration-with-our-production-logging}

**Naplózó integrációnk:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

A loggerünk a `isCodeBug` kódot használja a riasztási szintek és a mezőkihagyások meghatározásához, biztosítva, hogy értesítést kapjunk a valódi problémákról, miközben kiszűrjük a zajt a Node.js éles környezetünkben.

### Kapcsolódó tartalom {#related-content-1}

Tudjon meg többet a hibakezelési mintáinkról:

* [Megbízható fizetési rendszer kiépítése](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Hibakezelési minták
* [E-mail adatvédelem](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Biztonsági hibakezelés

## Speciális teljesítmény-hibakeresés a v8-profiler-next és a cpupro segítségével {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Fejlett profilkészítő eszközöket használunk a halom pillanatképek elemzésére, valamint az OOM (Out of Memory) problémák, a teljesítménybeli szűk keresztmetszetek és a Node.js memóriaproblémák hibakeresésére éles környezetünkben. Ezek az eszközök elengedhetetlenek minden olyan Node.js alkalmazás számára, amely memóriaszivárgással vagy teljesítményproblémákkal küzd.

### Profilalkotási megközelítésünk Node.js éles környezetben {#our-profiling-approach-for-nodejs-production}

**Az általunk ajánlott eszközök:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Heap pillanatképek és CPU profilok generálásához
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU profilok és heap pillanatképek elemzéséhez

> \[!TIP]
> We use v8-profiler-next and cpupro together to create a complete performance debugging workflow for our Node.js applications. This combination helps us identify memory leaks, performance bottlenecks, and optimize our production code.

### Hogyan implementáljuk a halompillanat-elemzést {#how-we-implement-heap-snapshot-analysis}

**A monitorozási megvalósításunk:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Éles környezetünk monitorozása magában foglalja az automatikus memória-pillanatkép-generálást a memória-küszöbértékek túllépése esetén. Ez segít a környezeti problémák hibakeresésében, mielőtt azok alkalmazásösszeomlásokat okoznának.

**Főbb megvalósítási minták:**

* **Automatikus pillanatképek**, ha a halom mérete meghaladja a 2 GB-os küszöbértéket
* **Jel alapú profilalkotás** igény szerinti elemzéshez éles környezetben
* **Megőrzési szabályzatok** a pillanatképek tárolásának kezeléséhez
* **Integráció a takarítási feladatainkkal** az automatizált karbantartáshoz

### Teljesítmény-hibakeresési munkafolyamat {#performance-debugging-workflow}

**Tanulmányozd a tényleges megvalósításunkat:**

* [Monitor szerver implementáció](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Halomfigyelés és pillanatkép generálása
* [Takarítási feladat](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Pillanatképek megőrzése és tisztítása
* [Naplózó integráció](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Teljesítménynaplózás

### Ajánlott megvalósítás a Node.js alkalmazásához {#recommended-implementation-for-your-nodejs-application}

**A halom pillanatképének elemzéséhez:**

1. **Telepítse a v8-profiler-next** csomagot pillanatképek generálásához.**Használja a cpupro csomagot** a létrehozott pillanatképek elemzéséhez.**Implementáljon monitorozási küszöbértékeket**, hasonlóan a monitor-server.js fájlunkhoz.**Állítson be automatikus tisztítást** a pillanatképek tárolásának kezeléséhez.**Hozzon létre jelkezelőket** az igény szerinti profilalkotáshoz éles környezetben.

**CPU profilalkotáshoz:**

1. **CPU profilok generálása** nagy terhelésű időszakokban
2. **Elemzés a cpupro segítségével** a szűk keresztmetszetek azonosítása érdekében
3. **A forró útvonalakra** és az optimalizálási lehetőségekre összpontosítás
4. **Teljesítményjavulás figyelése előtte/utána**

> \[!WARNING]
> Generating heap snapshots and CPU profiles can impact performance. We recommend implementing throttling and only enabling profiling when investigating specific issues or during maintenance windows.

### Integráció a termelésfelügyeletünkkel {#integration-with-our-production-monitoring}

Profilozó eszközeink integrálódnak tágabb monitorozási stratégiánkba:

* **Automatikus aktiválás** memória/CPU küszöbértékek alapján
* **Riasztások integrációja** teljesítményproblémák észlelésekor
* **Előzmények elemzése** a teljesítménytrendek időbeli nyomon követéséhez
* **Korreláció az alkalmazásmetrikákkal** az átfogó hibakereséshez

Ez a megközelítés segített azonosítani és megoldani a memóriaszivárgásokat, optimalizálni a gyorskód-útvonalakat, és stabil teljesítményt fenntartani Node.js éles környezetünkben.

## Node.js éles infrastruktúra biztonsága {#nodejs-production-infrastructure-security}

Átfogó biztonságot valósítunk meg Node.js termelési infrastruktúránkhoz az Ansible automatizáláson keresztül. Ezek a gyakorlatok minden Node.js alkalmazásra vonatkoznak:

### Rendszerszintű biztonság Node.js éles környezetben {#system-level-security-for-nodejs-production}

**Ansible implementációnk:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Főbb biztonsági intézkedéseink Node.js éles környezetekhez:

* **A **swap letiltva** a bizalmas adatok lemezre írásának megakadályozása érdekében.* **A memória-memória dump-jai letiltva** a bizalmas információkat tartalmazó memória-dump-ok megakadályozása érdekében.* **Az USB-tároló blokkolva** a jogosulatlan adathozzáférés megakadályozása érdekében.* **A kernel paramétereinek finomhangolása** a biztonság és a teljesítmény érdekében.

> \[!WARNING]
> When implementing Node.js production deployment best practices, disabling swap can cause out-of-memory kills if your application exceeds available RAM. We monitor memory usage carefully and size our servers appropriately.

### Alkalmazásbiztonság Node.js alkalmazásokhoz {#application-security-for-nodejs-applications}

**Naplómező-kizárásunk:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

A naplókból eltávolítjuk az érzékeny mezőket, beleértve a jelszavakat, tokeneket, API-kulcsokat és személyes adatokat. Ez védi a felhasználók adatait, miközben fenntartja a hibakeresési lehetőségeket bármely Node.js éles környezetben.

### Infrastruktúra-biztonsági automatizálás {#infrastructure-security-automation}

**Teljes Ansible beállításunk Node.js éles környezethez:**

* [Biztonsági kézikönyv](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH kulcskezelés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Tanúsítványkezelés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM beállítás](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Biztonsági tartalmaink {#our-security-content}

Tudjon meg többet biztonsági megközelítésünkről:

* [A legjobb biztonsági audit cégek](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe titkosított e-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Miért a nyílt forráskódú e-mail biztonság?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Adatbázis-architektúra Node.js alkalmazásokhoz {#database-architecture-for-nodejs-applications}

Egy hibrid adatbázis-megközelítést használunk, amelyet a Node.js alkalmazásainkhoz optimalizáltunk. Ezek a minták bármely Node.js alkalmazáshoz adaptálhatók:

### SQLite implementáció Node.js éles környezetben {#sqlite-implementation-for-nodejs-production}

**Amit használunk:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Konfigurációnk:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

A Node.js alkalmazásainkban az SQLite-ot használjuk felhasználóspecifikus adatokhoz, mert a következőket biztosítja:

* **Adat elkülönítés** felhasználónként/bérlőnként
* **Jobb teljesítmény** egyfelhasználós lekérdezések esetén
* **Egyszerűsített biztonsági mentés** és migráció
* **Kevesebb bonyolultság** a megosztott adatbázisokhoz képest

Ez a minta jól működik SaaS-alkalmazások, több-bérlős rendszerek vagy bármely olyan Node.js alkalmazás esetében, amely adatizolációt igényel.

### MongoDB implementáció Node.js éles környezetben {#mongodb-implementation-for-nodejs-production}

**Amit használunk:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**A beállításunk megvalósítása:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Konfigurációnk:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

A Node.js éles környezetünkben a MongoDB-t használjuk az alkalmazásadatokhoz, mert a következőket biztosítja:

* **Rugalmas séma** a fejlődő adatstruktúrákhoz
* **Jobb teljesítmény** összetett lekérdezésekhez
* **Vízszintes skálázási** képességek
* **Gazdag lekérdezőnyelv**

> \[!NOTE]
> Our hybrid approach optimizes for our specific use case. Study our actual database usage patterns in the codebase to understand if this approach fits your Node.js application needs.

## Node.js éles háttérfeladat-feldolgozás {#nodejs-production-background-job-processing}

A háttérben futó feladatarchitektúránkat a Bree köré építettük a megbízható Node.js éles telepítés érdekében. Ez minden olyan Node.js alkalmazásra vonatkozik, amely háttérfeldolgozást igényel:

### Bree szerverünk beállítása éles környezethez {#our-bree-server-setup-for-production}

**Fő implementációnk:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible telepítésünk:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Termelési feladatpéldák {#production-job-examples}

**Állapotfigyelés:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Takarítási automatizálás:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Összes állásajánlatunk:** [Böngésszen teljes állásajánlat-katalógusunkban](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Ezek a minták minden olyan Node.js alkalmazásra vonatkoznak, amelyre szükség van:

* Ütemezett feladatok (adatfeldolgozás, jelentések, tisztítás)
* Háttérfeldolgozás (képek átméretezése, e-mail küldése, adatimportálás)
* Állapotfigyelés és karbantartás
* Munkaszálak kihasználtsága CPU-igényes feladatokhoz

### Feladatütemezési mintáink Node.js éles környezetben {#our-job-scheduling-patterns-for-nodejs-production}

Tanulmányozd a tényleges munkabeosztási mintáinkat az álláskeresőnkben, hogy megértsd:

* Hogyan implementálunk cron-szerű ütemezést Node.js éles környezetben
* Hibakezelési és újrapróbálkozási logikánk
* Hogyan használjuk a munkaszálakat CPU-igényes feladatokhoz

## Automatizált karbantartás éles Node.js alkalmazásokhoz {#automated-maintenance-for-production-nodejs-applications}

Proaktív karbantartást alkalmazunk a gyakori Node.js éles környezetben jelentkező problémák megelőzése érdekében. Ezek a minták minden Node.js alkalmazásra vonatkoznak:

### A mi takarítási implementációnk {#our-cleanup-implementation}

**Forrás:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

A Node.js éles alkalmazások automatizált karbantartása a következőket célozza meg:

* **24 óránál régebbi ideiglenes fájlok**
* **Naplófájlok** a megőrzési korláton túl
* **Gyorsítótárfájlok** és ideiglenes adatok
* **Feltöltött fájlok**, amelyekre már nincs szükség
* **Halmok pillanatképei** teljesítményhiba-keresésből

Ezek a minták minden olyan Node.js alkalmazásra vonatkoznak, amely ideiglenes fájlokat, naplókat vagy gyorsítótárazott adatokat generál.

### Lemezterület-kezelés Node.js éles környezetben {#disk-space-management-for-nodejs-production}

**Figyelemmel kísérési küszöbértékeink:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Várólista-korlátok** a háttérben történő feldolgozáshoz
* **75%-os lemezhasználat** figyelmeztetési küszöbérték
* **Automatikus tisztítás** küszöbértékek túllépése esetén

### Infrastruktúra-karbantartási automatizálás {#infrastructure-maintenance-automation}

**Ansible automatizálásunk Node.js éles környezetben:**

* [Környezet telepítése](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Telepítési kulcsok kezelése](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Node.js éles telepítési megvalósítási útmutató {#nodejs-production-deployment-implementation-guide}

### Tanulmányozd a kódunkat az éles környezetben ajánlott gyakorlatokért {#study-our-actual-code-for-production-best-practices}

**A Node.js éles környezet beállításához először ezekkel a kulcsfájlokkal kell kezdeni:**

1. **Konfiguráció:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitorozás:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Hibakezelés:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Naplózás:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Folyamat állapota:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Tanuljon blogbejegyzéseinkből {#learn-from-our-blog-posts}

**Technikai megvalósítási útmutatóink Node.js éles környezethez:**

* [NPM csomagok ökoszisztémája](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Fizetési rendszerek építése](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-mail adatvédelem megvalósítása](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript kapcsolatfelvételi űrlapok](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React e-mail integráció](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastruktúra automatizálás Node.js éles környezetben {#infrastructure-automation-for-nodejs-production}

**Ansible forgatókönyveink, amelyeket érdemes tanulmányozni a Node.js éles telepítéséhez:**

* [Teljes forgatókönyv-könyvtár](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Biztonsági megerősítés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js beállítás](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Esettanulmányaink {#our-case-studies}

**Vállalati megvalósításaink:**

* [Linux Foundation esettanulmány](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Kanonikus Ubuntu esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Öregdiákok e-mail továbbítása](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Következtetés: Node.js éles környezetben történő telepítésének ajánlott gyakorlatai {#conclusion-nodejs-production-deployment-best-practices}

Node.js éles infrastruktúránk bizonyítja, hogy a Node.js alkalmazások vállalati szintű megbízhatóságot érhetnek el az alábbiak révén:

* **Bizonyított hardverválaszték** (AMD Ryzen az 573%-os egymagos teljesítményoptimalizáláshoz)
* **Harcban tesztelt Node.js éles környezet monitorozása** specifikus küszöbértékekkel és automatizált válaszokkal
* **Intelligens hibabesorolás** az incidensekre adott válaszok javítása érdekében éles környezetekben
* **Fejlett teljesítmény-hibakeresés** a v8-profiler-next és a cpupro segítségével az OOM megelőzésére
* **Átfogó biztonsági megerősítés** az Ansible automatizáláson keresztül
* **Hibrid adatbázis-architektúra**, az alkalmazásigényekhez optimalizálva
* **Automatizált karbantartás** a gyakori Node.js éles környezeti problémák megelőzésére

**Főbb tanulság:** Ahelyett, hogy általános bevált gyakorlatokat követnél, tanulmányozd a tényleges implementációs fájljainkat és blogbejegyzéseinket. Kódbázisunk valós mintákat biztosít a Node.js éles környezetben történő telepítéséhez, amelyek bármilyen Node.js alkalmazáshoz adaptálhatók – webalkalmazásokhoz, API-khoz, mikroszolgáltatásokhoz vagy háttérszolgáltatásokhoz.

## Teljes erőforráslista a Node.js éles környezetéhez {#complete-resource-list-for-nodejs-production}

### Alapvető megvalósítási fájljaink {#our-core-implementation-files}

* [Fő konfiguráció](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Csomagfüggőségek](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Szerverfelügyelet](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Hibabesorolás](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Naplózó rendszer](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 állapotfelmérések](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatizált tisztítás](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Szerveres megvalósításaink {#our-server-implementations}

* [Webszerver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree ütemező](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-kiszolgáló](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Infrastruktúra-automatizálásunk {#our-infrastructure-automation}

* [Az összes Ansible kézikönyvünk](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Biztonsági megerősítés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js beállítás](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Adatbázis-konfiguráció](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Műszaki blogbejegyzéseink {#our-technical-blog-posts}

* [NPM ökoszisztéma-elemzés](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Fizetési rendszer bevezetése](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-mail adatvédelmi technikai útmutató](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript kapcsolatfelvételi űrlapok](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React e-mail integráció](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Saját üzemeltetésű megoldások útmutatója](https://forwardemail.net/blog/docs/self-hosted-solution)

### Vállalati esettanulmányaink {#our-enterprise-case-studies}

* [Linux Foundation implementáció](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Kanonikus Ubuntu esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Szövetségi kormányzati megfelelés](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni e-mail rendszerek](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)