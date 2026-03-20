# Hogyan optimalizáljuk a Node.js termelési infrastruktúrát: Legjobb gyakorlatok {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js teljesítményoptimalizálási útmutató" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [A 573%-os egymagos teljesítményoptimalizálási forradalmunk](#our-573-single-core-performance-optimization-revolution)
  * [Miért fontos az egymagos teljesítményoptimalizálás a Node.js esetében](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Kapcsolódó tartalom](#related-content)
* [Node.js termelési környezet beállítása: Technológiai stackünk](#nodejs-production-environment-setup-our-technology-stack)
  * [Csomagkezelő: pnpm a termelési hatékonyságért](#package-manager-pnpm-for-production-efficiency)
  * [Webkeretrendszer: Koa a modern Node.js termeléshez](#web-framework-koa-for-modern-nodejs-production)
  * [Háttérfeladat-feldolgozás: Bree a termelési megbízhatóságért](#background-job-processing-bree-for-production-reliability)
  * [Hibakezelés: @hapi/boom a termelési megbízhatóságért](#error-handling-hapiboom-for-production-reliability)
* [Hogyan figyeljük a Node.js alkalmazásokat termelésben](#how-to-monitor-nodejs-applications-in-production)
  * [Rendszerszintű Node.js termelési monitorozás](#system-level-nodejs-production-monitoring)
  * [Alkalmazásszintű monitorozás Node.js termeléshez](#application-level-monitoring-for-nodejs-production)
  * [Alkalmazásspecifikus monitorozás](#application-specific-monitoring)
* [Node.js termelési monitorozás PM2 egészségügyi ellenőrzésekkel](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2 egészségügyi ellenőrző rendszerünk](#our-pm2-health-check-system)
  * [PM2 termelési konfigurációnk](#our-pm2-production-configuration)
  * [Automatizált PM2 telepítés](#automated-pm2-deployment)
* [Termelési hibakezelési és osztályozási rendszer](#production-error-handling-and-classification-system)
  * [isCodeBug megvalósításunk termeléshez](#our-iscodebug-implementation-for-production)
  * [Integráció termelési naplózásunkkal](#integration-with-our-production-logging)
  * [Kapcsolódó tartalom](#related-content-1)
* [Fejlett teljesítményhibakeresés v8-profiler-next és cpupro segítségével](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Profilozási megközelítésünk Node.js termeléshez](#our-profiling-approach-for-nodejs-production)
  * [Heap snapshot elemzés megvalósítása](#how-we-implement-heap-snapshot-analysis)
  * [Teljesítményhibakeresési munkafolyamat](#performance-debugging-workflow)
  * [Ajánlott megvalósítás a te Node.js alkalmazásodhoz](#recommended-implementation-for-your-nodejs-application)
  * [Integráció termelési monitorozásunkkal](#integration-with-our-production-monitoring)
* [Node.js termelési infrastruktúra biztonság](#nodejs-production-infrastructure-security)
  * [Rendszerszintű biztonság Node.js termeléshez](#system-level-security-for-nodejs-production)
  * [Alkalmazásbiztonság Node.js alkalmazásokhoz](#application-security-for-nodejs-applications)
  * [Infrastruktúra biztonsági automatizálás](#infrastructure-security-automation)
  * [Biztonsági tartalmaink](#our-security-content)
* [Adatbázis architektúra Node.js alkalmazásokhoz](#database-architecture-for-nodejs-applications)
  * [SQLite megvalósítás Node.js termeléshez](#sqlite-implementation-for-nodejs-production)
  * [MongoDB megvalósítás Node.js termeléshez](#mongodb-implementation-for-nodejs-production)
* [Node.js termelési háttérfeladat-feldolgozás](#nodejs-production-background-job-processing)
  * [Bree szerver beállításunk termeléshez](#our-bree-server-setup-for-production)
  * [Termelési feladat példák](#production-job-examples)
  * [Feladatütemezési mintáink Node.js termeléshez](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatizált karbantartás termelési Node.js alkalmazásokhoz](#automated-maintenance-for-production-nodejs-applications)
  * [Takarítási megvalósításunk](#our-cleanup-implementation)
  * [Lemezterület-kezelés Node.js termeléshez](#disk-space-management-for-nodejs-production)
  * [Infrastruktúra karbantartási automatizálás](#infrastructure-maintenance-automation)
* [Node.js termelési telepítési megvalósítási útmutató](#nodejs-production-deployment-implementation-guide)
  * [Tanulmányozd tényleges kódunkat a termelési legjobb gyakorlatokért](#study-our-actual-code-for-production-best-practices)
  * [Tanulj blogbejegyzéseinkből](#learn-from-our-blog-posts)
  * [Infrastruktúra automatizálás Node.js termeléshez](#infrastructure-automation-for-nodejs-production)
  * [Esettanulmányaink](#our-case-studies)
* [Összefoglaló: Node.js termelési telepítés legjobb gyakorlatai](#conclusion-nodejs-production-deployment-best-practices)
* [Teljes erőforráslista Node.js termeléshez](#complete-resource-list-for-nodejs-production)
  * [Alapvető megvalósítási fájljaink](#our-core-implementation-files)
  * [Szerver megvalósításaink](#our-server-implementations)
  * [Infrastruktúra automatizálásunk](#our-infrastructure-automation)
  * [Műszaki blogbejegyzéseink](#our-technical-blog-posts)
  * [Vállalati esettanulmányaink](#our-enterprise-case-studies)
## Előszó {#foreword}

A Forward Email-nél évekig tökéletesítettük Node.js éles környezetünk beállítását. Ez az átfogó útmutató megosztja velünk a harcedzett Node.js éles telepítési legjobb gyakorlatokat, különös tekintettel a teljesítményoptimalizálásra, a monitorozásra és azokra a tanulságokra, amelyeket a Node.js alkalmazások napi milliós tranzakciók kezelésére való skálázása során szereztünk.


## A 573%-os Egymagos Teljesítményoptimalizációs Forradalmunk {#our-573-single-core-performance-optimization-revolution}

Amikor Intelről AMD Ryzen processzorokra váltottunk, **573%-os teljesítménynövekedést** értünk el Node.js alkalmazásainkban. Ez nem csupán egy apró optimalizáció volt – alapjaiban változtatta meg, hogyan teljesítenek Node.js alkalmazásaink éles környezetben, és jól mutatja az egymagos teljesítményoptimalizáció fontosságát bármely Node.js alkalmazás esetén.

> \[!TIP]
> A Node.js éles telepítési legjobb gyakorlatok esetén a hardverválasztás kritikus. Kifejezetten a DataPacket szolgáltatást választottuk AMD Ryzen elérhetőségük miatt, mert az egymagos teljesítmény kulcsfontosságú a Node.js alkalmazások számára, mivel a JavaScript végrehajtása egyszálú.

### Miért Fontos az Egymagos Teljesítményoptimalizáció a Node.js Számára {#why-single-core-performance-optimization-matters-for-nodejs}

Az Intelről AMD Ryzenre való váltásunk eredményei:

* **573%-os teljesítménynövekedés** a kérések feldolgozásában (dokumentálva [a státusz oldalunk GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671) bejegyzésében)
* **Feldolgozási késések megszüntetése** majdnem azonnali válaszidőkre (említve a [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298) bejegyzésben)
* **Jobb ár-teljesítmény arány** Node.js éles környezetekhez
* **Javított válaszidők** az összes alkalmazásunk végpontján

A teljesítménynövekedés olyan jelentős volt, hogy ma már az AMD Ryzen processzorokat elengedhetetlennek tartjuk bármilyen komoly Node.js éles telepítéshez, legyen szó webalkalmazásokról, API-król, mikroszolgáltatásokról vagy bármilyen más Node.js munkaterhelésről.

### Kapcsolódó Tartalom {#related-content}

Részletesebb információkért infrastruktúra választásainkról, tekintsd meg:

* [Legjobb Email Továbbító Szolgáltatás](https://forwardemail.net/blog/docs/best-email-forwarding-service) – Teljesítmény összehasonlítások
* [Önmagad Által Üzemeltetett Megoldás](https://forwardemail.net/blog/docs/self-hosted-solution) – Hardver ajánlások


## Node.js Éles Környezet Beállítása: Technológiai Stackszerkezetünk {#nodejs-production-environment-setup-our-technology-stack}

Node.js éles telepítési legjobb gyakorlataiként tudatos technológiai választásokat alkalmazunk, amelyek évek tapasztalatán alapulnak. Íme, mit használunk, és miért alkalmazhatók ezek a választások bármely Node.js alkalmazásra:

### Csomagkezelő: pnpm a Hatékony Éles Használathoz {#package-manager-pnpm-for-production-efficiency}

**Amit használunk:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (rögzített verzió)

A pnpm-et választottuk az npm és a yarn helyett Node.js éles környezetünk beállításához, mert:

* **Gyorsabb telepítési idők** CI/CD folyamatokban
* **Lemezterület-hatékonyság** hard linkeléssel
* **Szigorú függőségfeloldás**, amely megakadályozza a fantom függőségeket
* **Jobb teljesítmény** éles telepítések során

> \[!NOTE]
> A Node.js éles telepítési legjobb gyakorlataink részeként rögzítjük a kritikus eszközök, például a pnpm pontos verzióját, hogy biztosítsuk a következetes viselkedést minden környezetben és a csapat tagjainak gépein.

**Megvalósítás részletei:**

* [A package.json konfigurációnk](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM ökoszisztéma blogbejegyzésünk](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webkeretrendszer: Koa a Modern Node.js Éles Környezethez {#web-framework-koa-for-modern-nodejs-production}

**Amit használunk:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
A Node.js termelési infrastruktúránkhoz a Koa-t választottuk az Express helyett a modern async/await támogatása és a tisztább middleware összetétel miatt. Alapítónk, Nick Baugh mind az Expresshez, mind a Koához hozzájárult, így mély betekintést nyertünk mindkét keretrendszer termelési használatába.

Ezek a minták alkalmazhatók REST API-k, GraphQL szerverek, webalkalmazások vagy mikroszolgáltatások építésekor.

**Megvalósítási példáink:**

* [Web szerver beállítása](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API szerver konfiguráció](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Kapcsolati űrlapok megvalósítási útmutató](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Háttérfeladat-feldolgozás: Bree a termelési megbízhatóságért {#background-job-processing-bree-for-production-reliability}

**Amit használunk:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) ütemező

A Bree-t azért hoztuk létre és tartjuk karban, mert a meglévő feladatütemezők nem feleltek meg a munkamenet szál támogatás és a modern JavaScript funkciók termelési Node.js környezetben támasztott igényeinek. Ez bármely Node.js alkalmazásra vonatkozik, amely háttérfeldolgozást, ütemezett feladatokat vagy munkamenet szálakat igényel.

**Megvalósítási példáink:**

* [Bree szerver beállítása](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Minden feladatdefiníciónk](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2 egészségügyi ellenőrző feladat](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Takarító feladat megvalósítása](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Hibakezelés: @hapi/boom a termelési megbízhatóságért {#error-handling-hapiboom-for-production-reliability}

**Amit használunk:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Az @hapi/boom-ot használjuk strukturált hibaválaszokhoz Node.js termelési alkalmazásainkban. Ez a minta bármely Node.js alkalmazásra alkalmazható, amelynek következetes hibakezelésre van szüksége.

**Megvalósítási példáink:**

* [Hibakategorizáló segéd](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Naplózó megvalósítása](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Hogyan figyeljük a Node.js alkalmazásokat termelésben {#how-to-monitor-nodejs-applications-in-production}

A Node.js alkalmazások termelési megfigyeléséhez való megközelítésünk évek során alakult ki, miközben nagy léptékben futtattunk alkalmazásokat. Több rétegben valósítjuk meg a megfigyelést, hogy bármilyen típusú Node.js alkalmazás megbízhatóságát és teljesítményét biztosítsuk.

### Rendszerszintű Node.js termelési megfigyelés {#system-level-nodejs-production-monitoring}

**Alap megvalósításunk:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Amit használunk:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Termelési megfigyelési küszöbértékeink (a tényleges termelési kódunkból):

* **2GB heap méret korlát** automatikus riasztásokkal
* **25% memóriahasználat** figyelmeztetési küszöb
* **80% CPU használat** riasztási küszöb
* **75% lemezhasználat** figyelmeztetési küszöb

> \[!WARNING]
> Ezek a küszöbértékek a mi konkrét hardverkonfigurációnkra vonatkoznak. Node.js termelési megfigyelés bevezetésekor tekintsd át a monitor-server.js megvalósításunkat, hogy megértsd a pontos logikát, és igazítsd az értékeket a saját környezetedhez.

### Alkalmazásszintű megfigyelés Node.js termeléshez {#application-level-monitoring-for-nodejs-production}

**Hibakategorizálásunk:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ez a segéd megkülönbözteti:

* **Valódi kódhibákat**, amelyek azonnali figyelmet igényelnek
* **Felhasználói hibákat**, amelyek elvárt viselkedésnek számítanak
* **Külső szolgáltatás hibákat**, amelyeket nem tudunk befolyásolni

Ez a minta bármely Node.js alkalmazásra érvényes – webalkalmazásokra, API-kra, mikroszolgáltatásokra vagy háttérszolgáltatásokra.
**Naplózás megvalósításunk:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Átfogó mezőelrejtést valósítunk meg az érzékeny információk védelme érdekében, miközben hasznos hibakeresési képességeket tartunk fenn Node.js éles környezetünkben.

### Alkalmazás-specifikus megfigyelés {#application-specific-monitoring}

**Szerver megvalósításaink:**

* [SMTP szerver](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP szerver](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 szerver](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Sorfigyelés:** 5 GB-os sor korlátokat és 180 másodperces időkorlátokat alkalmazunk a kérésfeldolgozásnál az erőforrás-kimerülés megelőzésére. Ezek a minták bármely Node.js alkalmazásra érvényesek, amely sorokat vagy háttérfeldolgozást használ.


## Node.js éles környezet megfigyelése PM2 egészségellenőrzésekkel {#nodejs-production-monitoring-with-pm2-health-checks}

Évek éles környezetben szerzett tapasztalatával finomítottuk Node.js éles környezetünk beállítását PM2-vel. PM2 egészségellenőrzéseink elengedhetetlenek a megbízhatóság fenntartásához bármely Node.js alkalmazásban.

### PM2 egészségellenőrző rendszerünk {#our-pm2-health-check-system}

**Alap megvalósításunk:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Node.js éles környezet megfigyelésünk PM2 egészségellenőrzésekkel tartalmazza:

* **20 percenként fut** cron ütemezéssel
* **Minimum 15 perc üzemidőt igényel** a folyamat egészségesnek tekintéséhez
* **Ellenőrzi a folyamat állapotát és memóriahasználatát**
* **Automatikusan újraindítja a hibás folyamatokat**
* **Megakadályozza az újraindítási ciklusokat** intelligens egészségellenőrzéssel

> \[!CAUTION]
> Node.js éles környezetbe való telepítés legjobb gyakorlataihoz 15+ perc üzemidőt követelünk meg a folyamat egészségesnek tekintéséhez, hogy elkerüljük az újraindítási ciklusokat. Ez megakadályozza a láncreakciós hibákat, amikor a folyamatok memória- vagy egyéb problémákkal küzdenek.

### PM2 éles környezet konfigurációnk {#our-pm2-production-configuration}

**Ökoszisztéma beállításunk:** Tanulmányozd szerver indító fájljainkat Node.js éles környezet beállításához:

* [Web szerver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API szerver](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree ütemező](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP szerver](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Ezek a minták alkalmazhatók Express alkalmazások, Koa szerverek, GraphQL API-k vagy bármely más Node.js alkalmazás futtatásakor.

### Automatikus PM2 telepítés {#automated-pm2-deployment}

**PM2 telepítés:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Teljes PM2 beállításunkat Ansible segítségével automatizáljuk, hogy következetes Node.js éles környezet telepítéseket biztosítsunk minden szerverünkön.


## Éles környezet hibakezelési és osztályozási rendszer {#production-error-handling-and-classification-system}

Az egyik legértékesebb Node.js éles környezetbe való telepítési legjobb gyakorlatunk az intelligens hibakategorizálás, amely bármely Node.js alkalmazásra alkalmazható:

### isCodeBug megvalósításunk éles környezethez {#our-iscodebug-implementation-for-production}

**Forrás:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ez a segédfunkció intelligens hibakategorizálást biztosít Node.js alkalmazások számára éles környezetben, hogy:

* **Az igazi hibákat helyezze előtérbe** a felhasználói hibákkal szemben
* **Javítsa az incidens válaszadást** az igazi problémákra fókuszálva
* **Csökkentse az értesítési fáradtságot** a várt felhasználói hibák miatt
* **Jobban megértse** az alkalmazás- és felhasználó által generált problémákat

Ez a minta bármely Node.js alkalmazásra működik – legyen szó e-kereskedelmi oldalakról, SaaS platformokról, API-król vagy mikroszolgáltatásokról.

### Integráció éles környezetbeli naplózásunkkal {#integration-with-our-production-logging}

**Naplózó integrációnk:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
A naplónk az `isCodeBug` értéket használja az értesítési szintek és a mezők elrejtésének meghatározására, biztosítva, hogy valódi problémákról kapjunk értesítést, miközben kiszűrjük a zajt a Node.js éles környezetünkben.

### Kapcsolódó tartalom {#related-content-1}

Ismerje meg jobban a hibakezelési mintáinkat:

* [Megbízható fizetési rendszer építése](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Hibakezelési minták
* [E-mail adatvédelem](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Biztonsági hibakezelés


## Fejlett teljesítményhibakeresés v8-profiler-next és cpupro segítségével {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Fejlett profilozó eszközöket használunk a heap pillanatképek elemzésére és az OOM (memóriahiány) problémák, teljesítménybeli szűk keresztmetszetek, valamint Node.js memória problémák hibakeresésére az éles környezetünkben. Ezek az eszközök elengedhetetlenek bármely Node.js alkalmazás számára, amely memória szivárgást vagy teljesítményproblémákat tapasztal.

### Profilozási megközelítésünk Node.js éles környezethez {#our-profiling-approach-for-nodejs-production}

**Ajánlott eszközeink:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Heap pillanatképek és CPU profilok generálásához
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU profilok és heap pillanatképek elemzéséhez

> \[!TIP]
> A v8-profiler-next és a cpupro együttes használatával teljes körű teljesítményhibakeresési munkafolyamatot hozunk létre Node.js alkalmazásaink számára. Ez a kombináció segít azonosítani a memória szivárgásokat, a teljesítménybeli szűk keresztmetszeteket, és optimalizálni az éles kódunkat.

### Hogyan valósítjuk meg a heap pillanatkép elemzést {#how-we-implement-heap-snapshot-analysis}

**Monitorozási megvalósításunk:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Az éles környezetbeli monitorozásunk automatikus heap pillanatkép generálást tartalmaz, ha a memória küszöbértékeket túllépik. Ez segít az OOM problémák hibakeresésében, mielőtt azok alkalmazás összeomláshoz vezetnének.

**Fő megvalósítási minták:**

* **Automatikus pillanatképek** készítése, ha a heap mérete meghaladja a 2GB küszöböt
* **Jel alapú profilozás** az igény szerinti elemzéshez éles környezetben
* **Megőrzési szabályzatok** a pillanatképek tárolásának kezelésére
* **Integráció a takarító feladatainkkal** az automatizált karbantartás érdekében

### Teljesítményhibakeresési munkafolyamat {#performance-debugging-workflow}

**Tanulmányozza tényleges megvalósításunkat:**

* [Monitor szerver megvalósítása](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Heap monitorozás és pillanatkép generálás
* [Takarító feladat](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Pillanatkép megőrzés és takarítás
* [Naplózó integráció](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Teljesítmény naplózás

### Ajánlott megvalósítás az Ön Node.js alkalmazásához {#recommended-implementation-for-your-nodejs-application}

**Heap pillanatkép elemzéshez:**

1. **Telepítse a v8-profiler-next-et** a pillanatképek generálásához
2. **Használja a cpupro-t** a generált pillanatképek elemzéséhez
3. **Valósítson meg monitorozási küszöbértékeket** hasonlóan a monitor-server.js-hez
4. **Állítson be automatizált takarítást** a pillanatképek tárolásának kezelésére
5. **Hozzon létre jelkezelőket** az igény szerinti profilozáshoz éles környezetben

**CPU profilozáshoz:**

1. **Generáljon CPU profilokat** magas terhelés idején
2. **Elemezze cpupro-val** a szűk keresztmetszetek azonosításához
3. **Fókuszáljon a forró útvonalakra** és az optimalizálási lehetőségekre
4. **Figyelje a teljesítményt** a javítások előtt és után

> \[!WARNING]
> A heap pillanatképek és CPU profilok generálása befolyásolhatja a teljesítményt. Ajánljuk a korlátozás bevezetését, és a profilozás csak konkrét problémák vizsgálata vagy karbantartási időszakok alatt történő engedélyezését.

### Integráció az éles környezetbeli monitorozásunkkal {#integration-with-our-production-monitoring}

Profilozó eszközeink integrálódnak a szélesebb körű monitorozási stratégiánkba:

* **Automatikus indítás** memória/CPU küszöbértékek alapján
* **Értesítési integráció** teljesítményproblémák észlelésekor
* **Történeti elemzés** a teljesítmény trendek nyomon követéséhez időben
* **Alkalmazás metrikákkal való korreláció** a teljes körű hibakeresés érdekében
Ez a megközelítés segített azonosítani és megoldani a memória szivárgásokat, optimalizálni a forró kódrészleteket, és fenntartani a stabil teljesítményt Node.js éles környezetünkben.


## Node.js Éles Infrastruktúra Biztonság {#nodejs-production-infrastructure-security}

Átfogó biztonságot valósítunk meg Node.js éles infrastruktúránk számára Ansible automatizálás segítségével. Ezek a gyakorlatok bármely Node.js alkalmazásra érvényesek:

### Rendszerszintű Biztonság Node.js Éles Környezethez {#system-level-security-for-nodejs-production}

**Ansible megvalósításunk:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Fő biztonsági intézkedéseink Node.js éles környezetekhez:

* **Swap letiltva** annak érdekében, hogy érzékeny adatok ne kerüljenek lemezre
* **Core dumpok letiltva** hogy megakadályozzuk az érzékeny információkat tartalmazó memória dumpokat
* **USB tároló blokkolva** az illetéktelen adat-hozzáférés megakadályozására
* **Kernel paraméterek hangolása** mind biztonsági, mind teljesítménybeli okokból

> \[!WARNING]
> Node.js éles telepítési legjobb gyakorlatok bevezetésekor a swap letiltása okozhat memóriahiány miatti folyamatleállítást, ha az alkalmazás meghaladja a rendelkezésre álló RAM-ot. Gondosan figyeljük a memóriahasználatot és megfelelően méretezzük szervereinket.

### Alkalmazásbiztonság Node.js Alkalmazásokhoz {#application-security-for-nodejs-applications}

**Naplómező elrejtésünk:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Érzékeny mezőket rejtünk el a naplókban, beleértve jelszavakat, tokeneket, API kulcsokat és személyes adatokat. Ez védi a felhasználók magánéletét, miközben megőrzi a hibakeresési lehetőségeket bármely Node.js éles környezetben.

### Infrastruktúra Biztonsági Automatizálás {#infrastructure-security-automation}

**Teljes Ansible beállításunk Node.js éles környezethez:**

* [Biztonsági playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH kulcsok kezelése](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Tanúsítványkezelés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM beállítás](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Biztonsági Tartalmunk {#our-security-content}

Tudjon meg többet biztonsági megközelítésünkről:

* [Legjobb Biztonsági Audit Cégek](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Kvantumbiztos Titkosított E-mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Miért Nyílt Forráskódú az E-mail Biztonság](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Adatbázis Architektúra Node.js Alkalmazásokhoz {#database-architecture-for-nodejs-applications}

Hibrid adatbázis megközelítést használunk, amely optimalizált Node.js alkalmazásainkhoz. Ezek a minták bármely Node.js alkalmazásra adaptálhatók:

### SQLite Megvalósítás Node.js Éles Környezethez {#sqlite-implementation-for-nodejs-production}

**Amit használunk:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Konfigurációnk:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

SQLite-t használunk felhasználóspecifikus adatokhoz Node.js alkalmazásainkban, mert:

* **Adatszigetelés** felhasználónként/bérlőnként
* **Jobb teljesítmény** egyszemélyes lekérdezésekhez
* **Egyszerűsített biztonsági mentés** és migráció
* **Csökkentett komplexitás** megosztott adatbázisokhoz képest

Ez a minta jól működik SaaS alkalmazásokhoz, többbérlős rendszerekhez vagy bármely Node.js alkalmazáshoz, amely adat izolációt igényel.

### MongoDB Megvalósítás Node.js Éles Környezethez {#mongodb-implementation-for-nodejs-production}

**Amit használunk:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Beállítási megvalósításunk:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Konfigurációnk:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

A Node.js éles környezetünkben az alkalmazás adatainak tárolására a MongoDB-t használjuk, mert az biztosítja:

* **Rugalmas sémát** az alakuló adatstruktúrákhoz
* **Jobb teljesítményt** összetett lekérdezések esetén
* **Horizontális skálázási** képességeket
* **Gazdag lekérdező nyelvet**

> \[!NOTE]
> Hibrid megközelítésünk az adott felhasználási esetünkre optimalizált. Tanulmányozd a tényleges adatbázis-használati mintáinkat a kódbázisban, hogy megértsd, ez a megközelítés megfelel-e a Node.js alkalmazásod igényeinek.


## Node.js éles háttérfeladat-feldolgozás {#nodejs-production-background-job-processing}

A háttérfeladat-architektúránkat a Bree köré építettük a megbízható Node.js éles telepítés érdekében. Ez bármely olyan Node.js alkalmazásra vonatkozik, amely háttérfeldolgozást igényel:

### Bree szerver beállításunk éles környezethez {#our-bree-server-setup-for-production}

**Fő megvalósításunk:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible telepítésünk:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Éles feladatpéldák {#production-job-examples}

**Állapotfigyelés:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Takarítás automatizálása:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Minden feladatunk:** [Böngészd a teljes feladatkönyvtárunkat](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Ezek a minták bármely olyan Node.js alkalmazásra vonatkoznak, amely:

* Ütemezett feladatokat igényel (adatfeldolgozás, jelentések, takarítás)
* Háttérfeldolgozást végez (képátméretezés, e-mail küldés, adatimportok)
* Állapotfigyelést és karbantartást igényel
* Munkameneteket használ CPU-intenzív feladatokhoz

### Ütemezési mintáink Node.js éles környezethez {#our-job-scheduling-patterns-for-nodejs-production}

Tanulmányozd a tényleges ütemezési mintáinkat a feladatkönyvtárunkban, hogy megértsd:

* Hogyan valósítjuk meg a cron-szerű ütemezést Node.js éles környezetben
* Hibakezelési és újrapróbálkozási logikánkat
* Hogyan használjuk a munkameneteket CPU-intenzív feladatokhoz


## Automatizált karbantartás Node.js éles alkalmazásokhoz {#automated-maintenance-for-production-nodejs-applications}

Proaktív karbantartást valósítunk meg a gyakori Node.js éles problémák megelőzésére. Ezek a minták bármely Node.js alkalmazásra vonatkoznak:

### Takarítási megvalósításunk {#our-cleanup-implementation}

**Forrás:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Automatizált karbantartásunk a Node.js éles alkalmazásokhoz az alábbiakat célozza:

* **24 óránál régebbi ideiglenes fájlok**
* **Megőrzési időn túli naplófájlok**
* **Gyorsítótár fájlok** és ideiglenes adatok
* **Feltöltött fájlok**, amelyekre már nincs szükség
* **Heap snapshotok** a teljesítményhibakereséshez

Ezek a minták bármely olyan Node.js alkalmazásra vonatkoznak, amely ideiglenes fájlokat, naplókat vagy gyorsítótárazott adatokat generál.

### Lemezterület-kezelés Node.js éles környezetben {#disk-space-management-for-nodejs-production}

**Figyelési küszöbértékeink:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Sor korlátok** a háttérfeldolgozáshoz
* **75%-os lemezhasználat** figyelmeztetési küszöb
* **Automatikus takarítás** a küszöbértékek túllépésekor

### Infrastruktúra karbantartás automatizálása {#infrastructure-maintenance-automation}

**Ansible automatizációnk Node.js éles környezethez:**

* [Környezet telepítése](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Telepítési kulcsok kezelése](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js éles telepítési megvalósítási útmutató {#nodejs-production-deployment-implementation-guide}
### Tanulmányozza valós kódunkat a termelési legjobb gyakorlatokért {#study-our-actual-code-for-production-best-practices}

**Kezdje ezekkel a kulcsfontosságú fájlokkal a Node.js termelési környezet beállításához:**

1. **Konfiguráció:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitorozás:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Hibakezelés:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Naplózás:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Folyamat egészség:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Tanuljon blogbejegyzéseinkből {#learn-from-our-blog-posts}

**Műszaki megvalósítási útmutatóink Node.js termeléshez:**

* [NPM csomagok ökoszisztémája](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Fizetési rendszerek építése](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-mail adatvédelem megvalósítása](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript kapcsolati űrlapok](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React e-mail integráció](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastruktúra automatizálás Node.js termeléshez {#infrastructure-automation-for-nodejs-production}

**Ansible playbookjaink tanulmányozásra Node.js termelési telepítéshez:**

* [Teljes playbook könyvtár](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Biztonsági megerősítés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js beállítás](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Esettanulmányaink {#our-case-studies}

**Vállalati megvalósításaink:**

* [Linux Foundation esettanulmány](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumni e-mail továbbítás](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Következtetés: Node.js termelési telepítés legjobb gyakorlatai {#conclusion-nodejs-production-deployment-best-practices}

Node.js termelési infrastruktúránk bizonyítja, hogy a Node.js alkalmazások vállalati szintű megbízhatóságot érhetnek el a következőkkel:

* **Bevált hardverválasztások** (AMD Ryzen a 573%-os egymagos teljesítményoptimalizálásért)
* **Bevált Node.js termelési monitorozás** specifikus küszöbértékekkel és automatizált válaszokkal
* **Okos hibabesorolás** a termelési környezetekben történő incidensválasz javítására
* **Fejlett teljesítményhibakeresés** v8-profiler-next és cpupro segítségével az OOM megelőzésére
* **Átfogó biztonsági megerősítés** Ansible automatizálással
* **Hibrid adatbázis-architektúra** az alkalmazás igényeihez optimalizálva
* **Automatizált karbantartás** a gyakori Node.js termelési problémák megelőzésére

**Fő tanulság:** Tanulmányozza valós megvalósítási fájljainkat és blogbejegyzéseinket ahelyett, hogy általános legjobb gyakorlatokat követne. Kódalapunk valós mintákat kínál Node.js termelési telepítéshez, amely bármilyen Node.js alkalmazásra adaptálható – webalkalmazásokra, API-kra, mikroszolgáltatásokra vagy háttérszolgáltatásokra.


## Teljes erőforráslista Node.js termeléshez {#complete-resource-list-for-nodejs-production}

### Alapvető megvalósítási fájljaink {#our-core-implementation-files}

* [Fő konfiguráció](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Csomagfüggőségek](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Szerver monitorozás](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Hibabesorolás](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Naplózó rendszer](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 egészségellenőrzések](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatizált takarítás](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Szerver Implementációink {#our-server-implementations}

* [Web szerver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API szerver](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree ütemező](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP szerver](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP szerver](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 szerver](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Infrastruktúra Automatizációnk {#our-infrastructure-automation}

* [Minden Ansible playbookunk](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Biztonsági megerősítés](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js beállítás](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Adatbázis konfiguráció](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Műszaki Blogbejegyzéseink {#our-technical-blog-posts}

* [NPM ökoszisztéma elemzés](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Fizetési rendszer megvalósítása](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [E-mail adatvédelem műszaki útmutató](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript kapcsolati űrlapok](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React e-mail integráció](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Önmagunk által hosztolt megoldás útmutató](https://forwardemail.net/blog/docs/self-hosted-solution)

### Vállalati Esettanulmányaink {#our-enterprise-case-studies}

* [Linux Foundation megvalósítás](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Szövetségi kormányzati megfelelőség](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni e-mail rendszerek](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
