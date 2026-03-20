# Egy évtized hatása: Hogyan érték el npm csomagjaink az 1 milliárd letöltést és formálták a JavaScriptet {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM csomagok milliárdos letöltési ökoszisztéma" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Az úttörők, akik bíznak bennünk: Isaac Z. Schlueter és a Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Az npm létrejöttétől a Node.js vezetéséig](#from-npms-creation-to-nodejs-leadership)
* [A kód mögötti építész: Nick Baugh útja](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express Műszaki Bizottság és alapvető hozzájárulások](#express-technical-committee-and-core-contributions)
  * [Koa keretrendszer hozzájárulások](#koa-framework-contributions)
  * [Egyéni közreműködőtől szervezeti vezetőig](#from-individual-contributor-to-organization-leader)
* [GitHub szervezeteink: Innováció ökoszisztémái](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturált naplózás modern alkalmazásokhoz](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Az e-mail visszaélések elleni harc](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern feladatütemezés worker thread-ekkel](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Nyílt forráskódú e-mail infrastruktúra](#forward-email-open-source-email-infrastructure)
  * [Lad: Alapvető Koa segédprogramok és eszközök](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Nyílt forráskódú rendelkezésre állás figyelés](#upptime-open-source-uptime-monitoring)
* [Hozzájárulásaink a Forward Email ökoszisztémához](#our-contributions-to-the-forward-email-ecosystem)
  * [A csomagoktól a termelésig](#from-packages-to-production)
  * [A visszacsatolási kör](#the-feedback-loop)
* [A Forward Email alapelvei: A kiválóság alapja](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Mindig fejlesztőbarát, biztonságközpontú és átlátható](#always-developer-friendly-security-focused-and-transparent)
  * [Időpróbált szoftverfejlesztési elvek betartása](#adherence-to-time-tested-software-development-principles)
  * [A kitartó, önfenntartó fejlesztő célzása](#targeting-the-scrappy-bootstrapped-developer)
  * [Elvek a gyakorlatban: A Forward Email kódalapja](#principles-in-practice-the-forward-email-codebase)
  * [Adatvédelem tervezés szerint](#privacy-by-design)
  * [Fenntartható nyílt forráskód](#sustainable-open-source)
* [A számok nem hazudnak: Megdöbbentő npm letöltési statisztikáink](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Madártávlatból a hatásunk](#a-birds-eye-view-of-our-impact)
  * [Napi hatás nagy léptékben](#daily-impact-at-scale)
  * [A nyers számokon túl](#beyond-the-raw-numbers)
* [Az ökoszisztéma támogatása: Nyílt forráskódú szponzorációink](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: E-mail infrastruktúra úttörő](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Segédcsomag zseni](#sindre-sorhus-utility-package-mastermind)
* [Biztonsági sebezhetőségek feltárása a JavaScript ökoszisztémában](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [A Koa-Router megmentése](#the-koa-router-rescue)
  * [ReDoS sebezhetőségek kezelése](#addressing-redos-vulnerabilities)
  * [A Node.js és Chromium biztonságának támogatása](#advocating-for-nodejs-and-chromium-security)
  * [Az npm infrastruktúra biztosítása](#securing-npm-infrastructure)
* [Hozzájárulásaink a Forward Email ökoszisztémához](#our-contributions-to-the-forward-email-ecosystem-1)
  * [A Nodemailer alapfunkcióinak fejlesztése](#enhancing-nodemailers-core-functionality)
  * [E-mail hitelesítés előmozdítása a Mailauth segítségével](#advancing-email-authentication-with-mailauth)
  * [Fontos Upptime fejlesztések](#key-upptime-enhancements)
* [Az összetartó ragasztó: Egyedi kód nagy léptékben](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Egy hatalmas fejlesztési erőfeszítés](#a-massive-development-effort)
  * [Alapvető függőségek integrálása](#core-dependencies-integration)
  * [DNS infrastruktúra a Tangerine-nel és mx-connect-tel](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Vállalati hatás: A nyílt forráskódtól a kritikus fontosságú megoldásokig](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Esettanulmányok kritikus fontosságú e-mail infrastruktúrában](#case-studies-in-mission-critical-email-infrastructure)
* [Egy évtized nyílt forráskód: Előre tekintve](#a-decade-of-open-source-looking-forward)
## Előszó {#foreword}

A [JavaScript](https://en.wikipedia.org/wiki/JavaScript) és a [Node.js](https://en.wikipedia.org/wiki/Node.js) világában néhány csomag elengedhetetlen—naponta milliószor töltik le őket, és világszerte alkalmazásokat működtetnek. Ezek mögött az eszközök mögött olyan fejlesztők állnak, akik az open source minőségre összpontosítanak. Ma megmutatjuk, hogyan segíti csapatunk az npm csomagok építését és karbantartását, amelyek a JavaScript ökoszisztéma kulcsfontosságú részeivé váltak.


## Az úttörők, akik megbíznak bennünk: Isaac Z. Schlueter és a Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Büszkék vagyunk arra, hogy [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) felhasználónk. Isaac létrehozta az [npm](https://en.wikipedia.org/wiki/Npm_\(software\))-t és segített a [Node.js](https://en.wikipedia.org/wiki/Node.js) fejlesztésében. Az ő bizalma a Forward Email iránt azt mutatja, hogy a minőségre és a biztonságra összpontosítunk. Isaac több domainhez is használja a Forward Emailt, köztük az izs.me-t.

Isaac hatása a JavaScriptre óriási. 2009-ben az elsők között ismerte fel a Node.js potenciálját, együtt dolgozva [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl)-lal, aki megalkotta a platformot. Ahogy Isaac egy [Increment magazinnak adott interjúban](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) mondta: „Ebben a nagyon kis közösségben, ahol egy csomó ember próbálta kitalálni, hogyan lehet megvalósítani a szerveroldali JS-t, Ryan Dahl előállt a Node-dal, ami egyértelműen a helyes megközelítés volt. Én erre tettem fel a lapjaimat, és 2009 közepén nagyon belemerültem.”

> \[!NOTE]
> Akiket érdekel a Node.js története, kiváló dokumentumfilmek állnak rendelkezésre, amelyek bemutatják a fejlesztését, többek között a [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) és a [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl [személyes weboldala](https://tinyclouds.org/) szintén értékes betekintést nyújt munkájába.

### Az npm létrehozásától a Node.js vezetéséig {#from-npms-creation-to-nodejs-leadership}

Isaac 2009 szeptemberében hozta létre az npm-et, az első használható verziót 2010 elején adták ki. Ez a csomagkezelő kulcsfontosságú igényt elégített ki a Node.js-ben, lehetővé téve a fejlesztők számára a kód egyszerű megosztását és újrafelhasználását. A [Node.js Wikipédia oldalán](https://en.wikipedia.org/wiki/Node.js) olvasható: „2010 januárjában bevezettek egy csomagkezelőt a Node.js környezethez, amelyet npm-nek neveztek. A csomagkezelő lehetővé teszi a programozók számára, hogy Node.js csomagokat, valamint a hozzájuk tartozó forráskódot publikáljanak és megosszák, és célja a csomagok telepítésének, frissítésének és eltávolításának egyszerűsítése.”

Amikor Ryan Dahl 2012 januárjában visszalépett a Node.js-től, Isaac vette át a projekt vezetését. Ahogy [önéletrajzában](https://izs.me/resume) megjegyzi, „Számos alapvető Node.js core API fejlesztését vezette, beleértve a CommonJS modulrendszert, a fájlrendszer API-kat és a stream-eket” és „2 évig a projekt BDFL-je (Benevolent Dictator For Life) volt, biztosítva a folyamatosan növekvő minőséget és a megbízható build folyamatot a Node.js v0.6-tól v0.10-ig terjedő verzióihoz.”

Isaac kulcsfontosságú növekedési időszakon vezette át a Node.js-t, olyan szabványokat állítva fel, amelyek ma is alakítják a platformot. Később 2014-ben megalapította az npm, Inc.-t az npm regisztráció támogatására, amelyet korábban egyedül működtetett.

Köszönjük Isaacnek a JavaScripthez tett hatalmas hozzájárulásait, és továbbra is sok általa létrehozott csomagot használunk. Munkája megváltoztatta a szoftverfejlesztés módját és azt, hogy milliók hogyan osztják meg a kódot világszerte.


## A kód mögötti építész: Nick Baugh útja {#the-architect-behind-the-code-nick-baughs-journey}

Nyílt forráskódú sikereink középpontjában Nick Baugh áll, a Forward Email alapítója és tulajdonosa. JavaScriptben végzett munkája közel 20 éve tart, és formálta, hogy számtalan fejlesztő hogyan épít alkalmazásokat. Nyílt forráskódú útja egyszerre mutat technikai tudást és közösségi vezetést.

### Express Műszaki Bizottság és alapvető hozzájárulások {#express-technical-committee-and-core-contributions}

Nick webes keretrendszer szakértelme révén helyet kapott az [Express Műszaki Bizottságban](https://expressjs.com/en/resources/community.html), ahol az egyik leggyakrabban használt Node.js keretrendszer fejlesztésében segített. Nick jelenleg inaktív tagként szerepel az [Express közösségi oldalán](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Az Express eredetileg TJ Holowaychuk által lett létrehozva, aki egy termékeny nyílt forráskódú közreműködő, és aki nagyban alakította a Node.js ökoszisztémát. Hálásak vagyunk TJ alapvető munkájáért, és tiszteletben tartjuk a [döntését, hogy szünetet tart](https://news.ycombinator.com/item?id=37687017) a kiterjedt nyílt forráskódú hozzájárulásaitól.

Az [Express Műszaki Bizottság](https://expressjs.com/en/resources/community.html) tagjaként Nick nagy figyelmet fordított olyan kérdésekre, mint a `req.originalUrl` dokumentációjának tisztázása és a multipart űrlapkezelési problémák javítása.

### Koa Framework hozzájárulások {#koa-framework-contributions}

Nick munkája a [Koa framework](https://github.com/koajs/koa) kapcsán — amely egy modern, könnyebb alternatíva az Expresshez, szintén TJ Holowaychuk által létrehozva — tovább mutatja elkötelezettségét a jobb webfejlesztési eszközök iránt. Koa hozzájárulásai közé tartoznak hibajegyek és kód is pull requesteken keresztül, amelyek hibakezelést, tartalomtípus-kezelést és dokumentációs fejlesztéseket érintenek.

Mind az Express, mind a Koa területén végzett munkája egyedülálló rálátást ad neki a Node.js webfejlesztésre, segítve csapatunkat olyan csomagok létrehozásában, amelyek jól működnek több keretrendszer ökoszisztémájával.

### Egyéni közreműködőtől szervezeti vezetőig {#from-individual-contributor-to-organization-leader}

A meglévő projektek segítéséből kinőtt az egész csomag ökoszisztémák létrehozása és fenntartása. Nick több GitHub szervezetet alapított — többek között a [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) és [Bree](https://github.com/breejs) szervezeteket — amelyek mind a JavaScript közösség specifikus igényeit oldják meg.

Ez a váltás a közreműködőből vezetővé mutatja Nick vízióját a jól megtervezett szoftverekről, amelyek valós problémákat oldanak meg. Azáltal, hogy a kapcsolódó csomagokat fókuszált GitHub szervezetek alá rendezi, olyan eszközök ökoszisztémáit építette fel, amelyek együttműködnek, miközben modulárisak és rugalmasak maradnak a szélesebb fejlesztői közösség számára.


## GitHub szervezeteink: az innováció ökoszisztémái {#our-github-organizations-ecosystems-of-innovation}

Nyílt forráskódú munkánkat fókuszált GitHub szervezetek köré szervezzük, amelyek mindegyike a JavaScript specifikus igényeit oldja meg. Ez a struktúra összetartó csomagcsaládokat hoz létre, amelyek jól működnek együtt, miközben modulárisak maradnak.

### Cabin: Strukturált naplózás modern alkalmazásokhoz {#cabin-structured-logging-for-modern-applications}

A [Cabin szervezet](https://github.com/cabinjs) a mi megközelítésünk az egyszerű, erőteljes alkalmazásnaplózásra. A fő [`cabin`](https://github.com/cabinjs/cabin) csomagnak közel 900 GitHub csillaga és több mint 100 000 heti letöltése van\[^1]. A Cabin strukturált naplózást biztosít, amely népszerű szolgáltatásokkal, mint a Sentry, LogDNA és Papertrail, működik együtt.

Ami különlegessé teszi a Cabint, az átgondolt API-ja és plugin rendszere. Támogató csomagok, mint az [`axe`](https://github.com/cabinjs/axe) az Express middleware-hez és a [`parse-request`](https://github.com/cabinjs/parse-request) a HTTP kérés elemzéséhez, mutatják elkötelezettségünket a teljes megoldások iránt, nem pedig elszigetelt eszközök iránt.

A [`bson-objectid`](https://github.com/cabinjs/bson-objectid) csomag külön említést érdemel, több mint 1,7 millió letöltéssel mindössze két hónap alatt\[^2]. Ez a könnyű MongoDB ObjectID megvalósítás vált a fejlesztők körében az alapértelmezetté, akik ID-ket igényelnek teljes MongoDB függőségek nélkül.

### Spam Scanner: Az e-mail visszaélések elleni küzdelem {#spam-scanner-fighting-email-abuse}

A [Spam Scanner szervezet](https://github.com/spamscanner) elkötelezettségünket mutatja a valós problémák megoldása iránt. A fő [`spamscanner`](https://github.com/spamscanner/spamscanner) csomag fejlett e-mail spam felismerést biztosít, de az [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) csomag az, amely elképesztő elfogadottságot ért el.

Több mint 1,2 millió letöltéssel két hónap alatt\[^3], az `url-regex-safe` kritikus biztonsági hibákat javít más URL felismerő reguláris kifejezésekben. Ez a csomag megmutatja nyílt forráskódú megközelítésünket: egy közös probléma (jelen esetben a [ReDoS](https://en.wikipedia.org/wiki/ReDoS) sebezhetőségek az URL érvényesítésben) megtalálása, egy szilárd megoldás létrehozása és gondos fenntartása.
### Bree: Modern munkabeosztás worker thread-ekkel {#bree-modern-job-scheduling-with-worker-threads}

A [Bree szervezet](https://github.com/breejs) válaszunk egy gyakori Node.js kihívásra: megbízható munkabeosztás. A fő [`bree`](https://github.com/breejs/bree) csomag, több mint 3,100 GitHub csillaggal, modern munkabeosztót kínál Node.js worker thread-ek használatával a jobb teljesítmény és megbízhatóság érdekében.

> \[!NOTE]
> A Bree-t azután hoztuk létre, hogy segítettünk karbantartani az [Agenda](https://github.com/agenda/agenda) projektet, és a tanultakat felhasználva építettünk egy jobb munkabeosztót. Agenda hozzájárulásaink segítettek megtalálni a munkabeosztás fejlesztésének módjait.

Ami megkülönbözteti a Bree-t más ütemezőktől, mint például az Agenda:

* **Nincs külső függőség**: Ellentétben az Agendával, amely MongoDB-t igényel, a Bree nem használ Redis-t vagy MongoDB-t a munkák állapotának kezelésére.
* **Worker thread-ek**: A Bree Node.js worker thread-eket használ sandboxolt folyamatokhoz, jobb izolációt és teljesítményt biztosítva.
* **Egyszerű API**: A Bree részletes vezérlést kínál egyszerűséggel, megkönnyítve a komplex ütemezési igények megvalósítását.
* **Beépített támogatás**: Alapból tartalmaz olyan funkciókat, mint a zökkenőmentes újratöltés, cron munkák, dátumok és emberbarát időpontok.

A Bree kulcsfontosságú része a [forwardemail.net](https://github.com/forwardemail/forwardemail.net) projektnek, amely kritikus háttérfeladatokat kezel, mint az e-mailek feldolgozása, takarítás és ütemezett karbantartás. A Bree használata a Forward Email-ben azt mutatja, hogy elkötelezettek vagyunk saját eszközeink éles használata mellett, biztosítva azok magas megbízhatósági szintjét.

Más nagyszerű worker thread csomagokat is használunk és értékelünk, mint például a [piscina](https://github.com/piscinajs/piscina) és HTTP kliens csomagokat, mint az [undici](https://github.com/nodejs/undici). A Piscina, akárcsak a Bree, Node.js worker thread-eket használ a hatékony feladatfeldolgozáshoz. Köszönet [Matteo Collina](https://github.com/mcollina)-nak, aki mind az undici, mind a piscina karbantartója, jelentős hozzájárulásaiért a Node.js-hez. Matteo a Node.js Műszaki Irányító Bizottságának tagja, és nagyban fejlesztette a HTTP kliens képességeket a Node.js-ben.

### Forward Email: Nyílt forráskódú e-mail infrastruktúra {#forward-email-open-source-email-infrastructure}

Legambiciózusabb projektünk a [Forward Email](https://github.com/forwardemail), egy nyílt forráskódú e-mail szolgáltatás, amely e-mail továbbítást, tárolást és API szolgáltatásokat nyújt. A fő tároló több mint 1,100 GitHub csillagot kapott\[^4], ami a közösség elismerését mutatja ezen alternatív tulajdonosi e-mail szolgáltatásokkal szemben.

A szervezet [`preview-email`](https://github.com/forwardemail/preview-email) csomagja, több mint 2,5 millió letöltéssel két hónap alatt\[^5], alapvető eszközzé vált a fejlesztők számára, akik e-mail sablonokkal dolgoznak. Egyszerű módot biztosít az e-mailek előnézetére fejlesztés közben, megoldva egy gyakori problémát az e-mail funkciókat használó alkalmazások építése során.

### Lad: Alapvető Koa segédprogramok és eszközök {#lad-essential-koa-utilities-and-tools}

A [Lad szervezet](https://github.com/ladjs) alapvető segédprogramok és eszközök gyűjteményét kínálja, elsősorban a Koa keretrendszer ökoszisztéma fejlesztésére fókuszálva. Ezek a csomagok megoldják a webfejlesztés gyakori kihívásait, és úgy vannak tervezve, hogy zökkenőmentesen működjenek együtt, miközben önállóan is hasznosak maradnak.

#### koa-better-error-handler: Fejlettebb hibakezelés Koa-hoz {#koa-better-error-handler-improved-error-handling-for-koa}

A [`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) jobb hibakezelési megoldást kínál Koa alkalmazásokhoz. Több mint 50 GitHub csillaggal ez a csomag a `ctx.throw`-ot felhasználóbarát hibaüzeneteket generálóvá teszi, miközben több Koa beépített hibakezelőjének korlátját is kezeli:

* Felismeri és megfelelően kezeli a Node.js DNS hibákat, Mongoose hibákat és Redis hibákat
* A [Boom](https://github.com/hapijs/boom) használatával egységes, jól formázott hibaválaszokat hoz létre
* Megőrzi a fejléc adatokat (ellentétben a Koa beépített kezelőjével)
* Megtartja a megfelelő státuszkódokat, nem állítja alapértelmezettként 500-ra
* Támogatja a flash üzeneteket és a munkamenet megőrzését
* HTML hibalistákat biztosít érvényesítési hibákhoz
* Több válasz típust támogat (HTML, JSON és sima szöveg)
Ez a csomag különösen értékes, ha a [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) csomaggal együtt használják a Koa alkalmazások átfogó hibakezeléséhez.

#### passport: Hitelesítés a Lad számára {#passport-authentication-for-lad}

Az [`@ladjs/passport`](https://github.com/ladjs/passport) kiterjeszti a népszerű Passport.js hitelesítési middleware-t speciális fejlesztésekkel a modern webalkalmazások számára. Ez a csomag több hitelesítési stratégiát támogat alapértelmezés szerint:

* Helyi hitelesítés e-mail címmel
* Bejelentkezés Apple-lel
* GitHub hitelesítés
* Google hitelesítés
* Egyszer használatos jelszó (OTP) hitelesítés

A csomag rendkívül testreszabható, lehetővé téve a fejlesztők számára, hogy a mezőneveket és kifejezéseket az alkalmazásuk igényeihez igazítsák. Kifejezetten úgy tervezték, hogy zökkenőmentesen integrálódjon a Mongoose-szal a felhasználókezeléshez, így ideális megoldás Koa-alapú alkalmazások számára, amelyek erős hitelesítést igényelnek.

#### graceful: Elegáns alkalmazásleállítás {#graceful-elegant-application-shutdown}

Az [`@ladjs/graceful`](https://github.com/ladjs/graceful) megoldja a kritikus kihívást, hogy a Node.js alkalmazások leállítása zökkenőmentes legyen. Több mint 70 GitHub csillaggal ez a csomag biztosítja, hogy az alkalmazás tisztán leálljon adatvesztés vagy függőben maradt kapcsolatok nélkül. Főbb jellemzők:

* Támogatás HTTP szerverek (Express/Koa/Fastify) zökkenőmentes lezárásához
* Adatbázis-kapcsolatok (MongoDB/Mongoose) tiszta leállítása
* Redis kliensek megfelelő lezárása
* Bree munkafolyamat ütemezők kezelése
* Egyedi leállítási kezelők támogatása
* Konfigurálható időkorlát beállítások
* Integráció naplózó rendszerekkel

Ez a csomag elengedhetetlen a termelési környezetekben, ahol a váratlan leállások adatvesztéshez vagy adatkárosodáshoz vezethetnek. A megfelelő leállítási eljárások megvalósításával az `@ladjs/graceful` segít biztosítani az alkalmazás megbízhatóságát és stabilitását.

### Upptime: Nyílt forráskódú rendelkezésre állás-figyelés {#upptime-open-source-uptime-monitoring}

Az [Upptime szervezet](https://github.com/upptime) elkötelezettségünket jelenti az átlátható, nyílt forráskódú monitorozás iránt. A fő [`upptime`](https://github.com/upptime/upptime) tároló több mint 13 000 GitHub csillaggal rendelkezik, így az egyik legnépszerűbb projekt, amelyhez hozzájárulunk. Az Upptime egy GitHub-alapú rendelkezésre állás-figyelőt és állapotoldalt biztosít, amely teljesen szerver nélküli működésű.

Az Upptime-ot a saját állapotoldalunkon használjuk a <https://status.forwardemail.net> címen, melynek forráskódja elérhető a <https://github.com/forwardemail/status.forwardemail.net> címen.

Az Upptime különlegessége az architektúrájában rejlik:

* **100% Nyílt forráskódú**: Minden komponens teljesen nyílt forráskódú és testreszabható.
* **GitHub által működtetve**: GitHub Actions, Issues és Pages használata egy szerver nélküli monitorozási megoldáshoz.
* **Nem igényel szervert**: A hagyományos monitorozó eszközökkel ellentétben az Upptime nem igényli szerver futtatását vagy karbantartását.
* **Automatikus állapotoldal**: Gyönyörű állapotoldalt generál, amely GitHub Pages-en hosztolható.
* **Erőteljes értesítések**: Integrálható különféle értesítési csatornákkal, beleértve az e-mailt, SMS-t és Slack-et.

A felhasználói élmény javítása érdekében integráltuk a [@octokit/core](https://github.com/octokit/core.js/) könyvtárat a forwardemail.net kódbázisába, hogy valós idejű állapotfrissítéseket és incidenseket jelenítsen meg közvetlenül a weboldalunkon. Ez az integráció világos átláthatóságot biztosít felhasználóink számára bármilyen probléma esetén az egész rendszerünkben (Weboldal, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree stb.) azonnali toast értesítésekkel, jelvényikon változásokkal, figyelmeztető színekkel és egyebekkel.

Az @octokit/core könyvtár lehetővé teszi számunkra, hogy valós idejű adatokat kérjünk le az Upptime GitHub tárolónkból, feldolgozzuk azokat, és felhasználóbarát módon jelenítsük meg. Amikor bármely szolgáltatás kiesik vagy teljesítménye romlik, a felhasználók azonnal értesülnek vizuális jelzéseken keresztül anélkül, hogy el kellene hagyniuk az alkalmazás fő felületét. Ez a zökkenőmentes integráció biztosítja, hogy felhasználóink mindig naprakész információkkal rendelkezzenek rendszerünk állapotáról, növelve az átláthatóságot és a bizalmat.

Az Upptime-ot több száz szervezet vette át, amelyek átlátható, megbízható módot keresnek szolgáltatásaik monitorozására és az állapot kommunikálására a felhasználók felé. A projekt sikere azt mutatja, hogy milyen erő rejlik olyan eszközök építésében, amelyek meglévő infrastruktúrát (jelen esetben GitHub-ot) használnak fel a gyakori problémák új megközelítésű megoldására.
## Hozzájárulásaink a Forward Email ökoszisztémához {#our-contributions-to-the-forward-email-ecosystem}

Miközben nyílt forráskódú csomagjainkat világszerte fejlesztők használják, ezek képezik saját Forward Email szolgáltatásunk alapját is. Ez a kettős szerep — mint ezeknek az eszközöknek a készítői és felhasználói — egyedi nézőpontot ad a valós alkalmazásukról, és folyamatos fejlesztésre ösztönöz.

### A csomagoktól a termelésig {#from-packages-to-production}

Az egyedi csomagoktól egy összefüggő termelési rendszerig vezető út gondos integrációt és kiterjesztést igényel. A Forward Email esetében ez a folyamat a következőket tartalmazza:

* **Egyedi kiterjesztések**: Forward Email-specifikus kiterjesztések építése nyílt forráskódú csomagjainkhoz, amelyek egyedi igényeinket kezelik.
* **Integrációs minták**: Minták kidolgozása arra, hogyan lépnek interakcióba ezek a csomagok egy termelési környezetben.
* **Teljesítmény-optimalizálások**: Teljesítménybeli szűk keresztmetszetek azonosítása és kezelése, amelyek csak nagy léptékben jelentkeznek.
* **Biztonsági megerősítés**: További biztonsági rétegek hozzáadása, amelyek kifejezetten az e-mail kezelésre és a felhasználói adatok védelmére vonatkoznak.

Ez a munka több ezer fejlesztési órát jelent a magcsomagokon túl, eredményeként egy robusztus, biztonságos e-mail szolgáltatás jön létre, amely a nyílt forráskódú hozzájárulásaink legjavát használja ki.

### A visszacsatolási kör {#the-feedback-loop}

Talán a legértékesebb aspektusa annak, hogy saját csomagjainkat használjuk termelésben, az a visszacsatolási kör, amit létrehoz. Amikor a Forward Email-ben korlátokkal vagy szélsőséges esetekkel találkozunk, nem csak helyileg javítjuk őket — fejlesztjük az alapul szolgáló csomagokat, ami mind szolgáltatásunknak, mind a szélesebb közösségnek előnyt jelent.

Ez a megközelítés számos fejlesztéshez vezetett:

* **Bree zökkenőmentes leállítása**: A Forward Email nulla leállási idővel történő telepítési igénye fejlesztette Bree zökkenőmentes leállítási képességeit.
* **Spam Scanner mintafelismerése**: A Forward Email-ben tapasztalt valós spamminták befolyásolták a Spam Scanner detektáló algoritmusait.
* **Cabin teljesítmény-optimalizálásai**: A termelésben tapasztalt nagy volumenű naplózás optimalizálási lehetőségeket tárt fel a Cabin számára, ami minden felhasználónak előnyös.

Ezzel az erénykörrel fenntartva a kapcsolatot nyílt forráskódú munkánk és termelési szolgáltatásunk között, biztosítjuk, hogy csomagjaink gyakorlati, harcedzett megoldások maradjanak, nem pedig elméleti implementációk.


## A Forward Email alapelvei: a kiválóság alapja {#forward-emails-core-principles-a-foundation-for-excellence}

A Forward Email egy olyan alapelvek szerint készült, amelyek minden fejlesztési döntésünket irányítják. Ezek az alapelvek, amelyeket részletesen ismertetünk a [weboldalunkon](/blog/docs/best-quantum-safe-encrypted-email-service#principles), biztosítják, hogy szolgáltatásunk fejlesztőbarát, biztonságos és a felhasználói adatvédelemre fókuszált maradjon.

### Mindig fejlesztőbarát, biztonságközpontú és átlátható {#always-developer-friendly-security-focused-and-transparent}

Elsődleges alapelvünk, hogy olyan szoftvert hozzunk létre, amely fejlesztőbarát, miközben a legmagasabb biztonsági és adatvédelmi szabványokat tartja. Hiszünk abban, hogy a műszaki kiválóság soha nem mehet a használhatóság rovására, és hogy az átláthatóság bizalmat épít közösségünkkel.

Ez az elv megjelenik részletes dokumentációnkban, világos hibaüzeneteinkben és nyílt kommunikációnkban mind a sikerekről, mind a kihívásokról. Azáltal, hogy az egész kódalapunk nyílt forráskódú, meghívjuk a vizsgálatot és az együttműködést, erősítve mind a szoftverünket, mind a szélesebb ökoszisztémát.

### Időpróbált szoftverfejlesztési alapelvek betartása {#adherence-to-time-tested-software-development-principles}

Számos bevált szoftverfejlesztési alapelvet követünk, amelyek évtizedek alatt bizonyították értéküket:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Az elkülönített felelősségek a Model-View-Controller mintán keresztül
* **[Unix filozófia](https://en.wikipedia.org/wiki/Unix_philosophy)**: Moduláris komponensek létrehozása, amelyek egy dolgot jól csinálnak
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Tartsd egyszerűnek és egyenesnek
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Ne ismételd magad, a kód újrafelhasználásának előmozdítása
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nem fogod szükségét érezni, az idő előtti optimalizálás elkerülése
* **[Twelve Factor](https://12factor.net/)**: A modern, skálázható alkalmazások építésének legjobb gyakorlatai
* **[Occam borotvája](https://en.wikipedia.org/wiki/Occam%27s_razor)**: A legegyszerűbb megoldás választása, amely megfelel a követelményeknek
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Saját termékeink széles körű használata
Ezek az elvek nem csupán elméleti fogalmak—beépülnek a napi fejlesztési gyakorlatunkba. Például a Unix filozófia iránti elkötelezettségünk megmutatkozik abban, ahogyan az npm csomagjainkat felépítettük: kis, fókuszált modulok, amelyeket összekapcsolva komplex problémákat oldhatunk meg.

### A küzdős, önfinanszírozott fejlesztő megcélzása {#targeting-the-scrappy-bootstrapped-developer}

Kifejezetten a küzdős, önfinanszírozott és [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) fejlesztőt célozzuk meg. Ez a fókusz alakítja az árképzési modellünket és a műszaki döntéseinket egyaránt. Értjük a korlátozott erőforrásokkal történő termékfejlesztés kihívásait, mert mi magunk is átmentünk ezen.

Ez az elv különösen fontos az open source megközelítésünkben. Olyan csomagokat hozunk létre és tartunk karban, amelyek valódi problémákat oldanak meg fejlesztők számára, akik nem rendelkeznek vállalati költségvetéssel, így erőteljes eszközöket teszünk elérhetővé mindenki számára, erőforrásaiktól függetlenül.

### Elvek a gyakorlatban: a Forward Email kódalap {#principles-in-practice-the-forward-email-codebase}

Ezek az elvek jól láthatóak a Forward Email kódalapjában. A package.json fájlunk átgondolt függőségválasztást mutat, mindegyiket úgy választottuk, hogy összhangban legyen alapértékeinkkel:

* Biztonságközpontú csomagok, mint a `mailauth` az email hitelesítéshez
* Fejlesztőbarát eszközök, mint a `preview-email` a könnyebb hibakereséshez
* Moduláris komponensek, mint a különféle `p-*` segédprogramok Sindre Sorhustól

Az elvek következetes betartásával idővel olyan szolgáltatást építettünk, amelyben a fejlesztők megbízhatnak az email infrastruktúrájuk kezelésében—biztonságos, megbízható és összhangban az open source közösség értékeivel.

### Privacy by Design {#privacy-by-design}

A magánélet nem utólagos gondolat vagy marketing funkció a Forward Email esetében—ez egy alapvető tervezési elv, amely minden szolgáltatásunk és kódunk minden aspektusát meghatározza:

* **Zero-Access Encryption**: Olyan rendszereket valósítottunk meg, amelyek technikailag lehetetlenné teszik számunkra a felhasználók emaileinek olvasását.
* **Minimális adatgyűjtés**: Csak azokat az adatokat gyűjtjük, amelyek a szolgáltatásunk nyújtásához szükségesek, semmi többet.
* **Átlátható szabályzatok**: Adatvédelmi szabályzatunk világos, érthető nyelven íródott, jogi zsargontól mentesen.
* **Open Source ellenőrzés**: Nyílt forráskódú kódalapunk lehetővé teszi a biztonsági kutatók számára, hogy ellenőrizzék adatvédelmi állításainkat.

Ez az elkötelezettség kiterjed az open source csomagjainkra is, amelyeket a biztonság és adatvédelem legjobb gyakorlataival tervezünk meg az alapoktól kezdve.

### Fenntartható open source {#sustainable-open-source}

Hisszük, hogy az open source szoftvereknek fenntartható modellekre van szükségük a hosszú távú fejlődéshez. Megközelítésünk magában foglalja:

* **Kereskedelmi támogatás**: Prémium támogatás és szolgáltatások kínálata open source eszközeink körül.
* **Kiegyensúlyozott licencelés**: Olyan licencek használata, amelyek védik a felhasználói szabadságokat és a projekt fenntarthatóságát egyaránt.
* **Közösségi részvétel**: Aktív kapcsolattartás a közreműködőkkel egy támogató közösség építéséhez.
* **Átlátható ütemtervek**: Fejlesztési terveink megosztása, hogy a felhasználók ennek megfelelően tudjanak tervezni.

A fenntarthatóságra fókuszálva biztosítjuk, hogy open source hozzájárulásaink idővel tovább növekedhessenek és fejlődhessenek, a hanyatlás helyett.


## A számok nem hazudnak: lenyűgöző npm letöltési statisztikáink {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Amikor az open source szoftverek hatásáról beszélünk, a letöltési statisztikák kézzelfogható mérőszámot adnak az elfogadottságra és a bizalomra. Számos általunk karbantartott csomag olyan méretet ért el, amit kevés open source projekt valaha, a letöltések száma milliárdos nagyságrendű.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Bár büszkék vagyunk arra, hogy több, a JavaScript ökoszisztéma egyik leggyakrabban letöltött csomagját is karbantartjuk, elismerjük, hogy ezek közül sokat eredetileg más tehetséges fejlesztők hoztak létre. Ilyen csomagok például a superagent és a supertest, amelyeket eredetileg TJ Holowaychuk készített, akinek termékeny hozzájárulásai az open source-hoz kulcsfontosságúak voltak a Node.js ökoszisztéma alakításában.
### Madártávlatból a hatásunkról {#a-birds-eye-view-of-our-impact}

Csak a 2025 február és március közötti két hónap alatt a legfontosabb csomagok, amelyekhez hozzájárulunk és amelyeket segítünk karbantartani, elképesztő letöltési számokat értek el:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84,575,829 letöltés\[^7] (eredetileg TJ Holowaychuk által létrehozva)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76,432,591 letöltés\[^8] (eredetileg TJ Holowaychuk által létrehozva)
* **[koa](https://www.npmjs.com/package/koa)**: 28,539,295 letöltés\[^34] (eredetileg TJ Holowaychuk által létrehozva)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11,007,327 letöltés\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3,498,918 letöltés\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 letöltés\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2,500,000 letöltés\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1,800,000 letöltés\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 letöltés\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1,128,139 letöltés\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1,124,686 letöltés\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 letöltés\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 letöltés\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 letöltés\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145,000 letöltés\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24,270 letöltés\[^30]

> \[!NOTE]
> Számos más csomag, amelyet segítünk karbantartani, de nem mi hoztunk létre, még magasabb letöltési számokat ér el, többek között a `form-data` (738M+ letöltés), `toidentifier` (309M+ letöltés), `stackframe` (116M+ letöltés) és `error-stack-parser` (113M+ letöltés). Büszkék vagyunk arra, hogy hozzájárulhatunk ezekhez a csomagokhoz, miközben tiszteletben tartjuk eredeti szerzőik munkáját.

Ezek nem csupán lenyűgöző számok — valódi fejlesztőket jelentenek, akik valódi problémákat oldanak meg olyan kóddal, amelyet mi segítünk karbantartani. Minden letöltés egy olyan alkalom, amikor ezek a csomagok segítettek valakinek valami értelmeset építeni, a hobbi projektekből a több millió felhasználó által használt vállalati alkalmazásokig.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Napi hatás nagy léptékben {#daily-impact-at-scale}

A napi letöltési minták következetes, nagy volumenű használatot mutatnak, a csúcsok elérik a napi több millió letöltést\[^13]. Ez a következetesség a csomagok stabilitására és megbízhatóságára utal — a fejlesztők nem csak kipróbálják őket; beépítik őket alapvető munkafolyamataikba, és nap mint nap számítanak rájuk.

A heti letöltési minták még lenyűgözőbb számokat mutatnak, következetesen a heti több tízmillió letöltés körül mozogva\[^14]. Ez hatalmas lábnyomot jelent a JavaScript ökoszisztémában, ezek a csomagok világszerte termelési környezetekben futnak.

### A nyers számokon túl {#beyond-the-raw-numbers}

Bár a letöltési statisztikák önmagukban is lenyűgözőek, mélyebb történetet mesélnek el a közösség bizalmáról ezekben a csomagokban. A csomagok ilyen léptékű karbantartása rendíthetetlen elkötelezettséget igényel a következők iránt:

* **Visszafelé kompatibilitás**: A változtatásokat gondosan kell mérlegelni, hogy elkerüljük a meglévő megvalósítások megszakítását.
* **Biztonság**: Több millió alkalmazás támaszkodik ezekre a csomagokra, így a biztonsági sebezhetőségek messzemenő következményekkel járhatnak.
* **Teljesítmény**: Ilyen léptékben még a kisebb teljesítményjavulások is jelentős összhatású előnyökkel járhatnak.
* **Dokumentáció**: Világos, átfogó dokumentáció elengedhetetlen minden tapasztalati szintű fejlesztő számára használt csomagok esetén.

A letöltési számok következetes növekedése az idő múlásával azt tükrözi, hogy sikerült megfelelni ezeknek az elvárásoknak, és megbízható, jól karbantartott csomagokon keresztül építeni a fejlesztői közösség bizalmát.
## Az ökoszisztéma támogatása: Nyílt forráskódú szponzorációink {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> A nyílt forráskód fenntarthatósága nem csak a kód hozzájárulásáról szól — hanem arról is, hogy támogatjuk azokat a fejlesztőket, akik a kritikus infrastruktúrát karbantartják.

A JavaScript ökoszisztéma közvetlen hozzájárulásain túl büszkék vagyunk arra, hogy szponzoráljuk a kiemelkedő Node.js közreműködőket, akik munkája számos modern alkalmazás alapját képezi. Szponzorációink közé tartoznak:

### Andris Reinman: E-mail infrastruktúra úttörő {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) a [Nodemailer](https://github.com/nodemailer/nodemailer) alkotója, a legnépszerűbb e-mail küldő könyvtár Node.js-hez, amelynek heti letöltésszáma meghaladja a 14 milliót\[^15]. Munkája kiterjed más kritikus e-mail infrastruktúra komponensekre is, mint például az [SMTP Server](https://github.com/nodemailer/smtp-server), a [Mailparser](https://github.com/nodemailer/mailparser) és a [WildDuck](https://github.com/nodemailer/wildduck).

Szponzorációnk segít biztosítani ezen alapvető eszközök folyamatos karbantartását és fejlesztését, amelyek számtalan Node.js alkalmazás, köztük a saját Forward Email szolgáltatásunk e-mail kommunikációját működtetik.

### Sindre Sorhus: Hasznos csomagok mestere {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) a JavaScript ökoszisztéma egyik legtermékenyebb nyílt forráskódú közreműködője, több mint 1000 npm csomag fűződik a nevéhez. Olyan segédprogramjai, mint a [p-map](https://github.com/sindresorhus/p-map), a [p-retry](https://github.com/sindresorhus/p-retry) és az [is-stream](https://github.com/sindresorhus/is-stream) alapvető építőelemek, amelyeket a Node.js ökoszisztéma széles körben használ.

Sindre munkájának szponzorálásával hozzájárulunk ezen kritikus segédprogramok fejlesztésének fenntartásához, amelyek hatékonyabbá és megbízhatóbbá teszik a JavaScript fejlesztést.

Ezek a szponzorációk tükrözik elkötelezettségünket a szélesebb nyílt forráskódú ökoszisztéma iránt. Felismerjük, hogy saját sikerünk ezen és más közreműködők által lefektetett alapokra épül, és elkötelezettek vagyunk az egész ökoszisztéma fenntarthatóságának biztosítása mellett.


## Biztonsági sebezhetőségek feltárása a JavaScript ökoszisztémában {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

A nyílt forráskód iránti elkötelezettségünk túlmutat a funkciófejlesztésen, és magában foglalja a biztonsági sebezhetőségek azonosítását és kezelését is, amelyek milliók fejlesztőit érinthetik. JavaScript ökoszisztémához fűződő legjelentősebb hozzájárulásaink közül több is a biztonság területén történt.

### A Koa-Router megmentése {#the-koa-router-rescue}

2019 februárjában Nick egy kritikus problémát azonosított a népszerű koa-router csomag karbantartásával kapcsolatban. Ahogy azt [a Hacker News-on beszámolta](https://news.ycombinator.com/item?id=19156707), a csomagot az eredeti karbantartója elhagyta, így a biztonsági sebezhetőségek kezeletlenek maradtak, és a közösség frissítések nélkül maradt.

> \[!WARNING]
> Az elhagyott csomagok, amelyek biztonsági sebezhetőségeket tartalmaznak, jelentős kockázatot jelentenek az egész ökoszisztéma számára, különösen, ha ezeket hetente milliószor töltik le.

Válaszul Nick létrehozta az [@koa/router](https://github.com/koajs/router) csomagot, és segített figyelmeztetni a közösséget a helyzetre. Azóta is karbantartja ezt a kritikus csomagot, biztosítva, hogy a Koa felhasználók biztonságos, jól karbantartott útválasztási megoldáshoz jussanak.

### ReDoS sebezhetőségek kezelése {#addressing-redos-vulnerabilities}

2020-ban Nick azonosított és kezelte a széles körben használt `url-regex` csomagban található kritikus [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) sebezhetőséget. Ez a sebezhetőség ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) lehetővé tehette a támadók számára, hogy szolgáltatásmegtagadást idézzenek elő speciálisan kialakított bemenetekkel, amelyek katasztrofális visszalépést okoztak a reguláris kifejezésben.

Ahelyett, hogy egyszerűen javította volna a meglévő csomagot, Nick létrehozta a [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) csomagot, amely egy teljesen újraírt megvalósítás, amely kezeli a sebezhetőséget, miközben kompatibilis marad az eredeti API-val. Emellett közzétett egy [átfogó blogbejegyzést](/blog/docs/url-regex-javascript-node-js), amely elmagyarázza a sebezhetőséget és annak enyhítését.
Ez a munka bemutatja a biztonsághoz való hozzáállásunkat: nem csak a problémák javítását, hanem a közösség oktatását és olyan robusztus alternatívák biztosítását, amelyek megakadályozzák a hasonló problémákat a jövőben.

### Node.js és Chromium biztonságának támogatása {#advocating-for-nodejs-and-chromium-security}

Nick aktívan részt vett a biztonsági fejlesztések támogatásában a szélesebb ökoszisztémában is. 2020 augusztusában egy jelentős biztonsági problémát azonosított a Node.js-ben, amely az HTTP fejlécek kezelésével kapcsolatos volt, és amelyről a [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) számolt be.

Ez a probléma, amely egy Chromium javításból ered, potenciálisan lehetővé tette a támadók számára a biztonsági intézkedések megkerülését. Nick támogatása hozzájárult ahhoz, hogy a problémát gyorsan orvosolják, ezzel védve a milliónyi Node.js alkalmazást a potenciális kihasználástól.

### Az npm infrastruktúra biztonságossá tétele {#securing-npm-infrastructure}

Ugyanebben a hónapban Nick egy másik kritikus biztonsági problémát azonosított, ezúttal az npm e-mail infrastruktúrájában. Ahogy a [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) beszámolt róla, az npm nem megfelelően valósította meg a DMARC, SPF és DKIM e-mail hitelesítési protokollokat, ami lehetővé tehette a támadók számára, hogy olyan adathalász e-maileket küldjenek, amelyek npm-től származónak tűntek.

Nick jelentése javításokat eredményezett az npm e-mail biztonsági helyzetében, megvédve a milliónyi fejlesztőt, akik az npm-re támaszkodnak csomagkezeléshez a potenciális adathalász támadásokkal szemben.


## Hozzájárulásaink a Forward Email ökoszisztémához {#our-contributions-to-the-forward-email-ecosystem-1}

A Forward Email több kritikus nyílt forráskódú projektre épül, beleértve a Nodemailer-t, a WildDuck-ot és a mailauth-t. Csapatunk jelentős hozzájárulásokat tett ezekhez a projektekhez, segítve mély problémák azonosítását és javítását, amelyek befolyásolják az e-mailek kézbesítését és biztonságát.

### Nodemailer alapfunkcionalitásának fejlesztése {#enhancing-nodemailers-core-functionality}

A [Nodemailer](https://github.com/nodemailer/nodemailer) a Node.js-ben az e-mail küldés gerince, és hozzájárulásaink segítettek abban, hogy még megbízhatóbb legyen:

* **SMTP szerver fejlesztések**: Javítottuk az elemzési hibákat, a stream kezelés problémáit és a TLS konfigurációs gondokat az SMTP szerver komponensben\[^16]\[^17].
* **Levél elemző fejlesztések**: Kezeltük a karakterlánc dekódolási hibákat és a cím elemző problémákat, amelyek e-mail feldolgozási hibákat okozhattak\[^18]\[^19].

Ezek a hozzájárulások biztosítják, hogy a Nodemailer megbízható alap maradjon az e-mail feldolgozásban Node.js alkalmazásokban, beleértve a Forward Email-t is.

### E-mail hitelesítés fejlesztése a Mailauth segítségével {#advancing-email-authentication-with-mailauth}

A [Mailauth](https://github.com/postalsys/mailauth) kritikus e-mail hitelesítési funkciókat biztosít, és hozzájárulásaink jelentősen javították képességeit:

* **DKIM ellenőrzés fejlesztései**: Felfedeztük és jelentettük, hogy az X/Twitter DNS gyorsítótár problémákkal küzdött, ami DKIM hibát okozott a kimenő üzeneteiknél, és ezt a Hacker One-on jelentettük\[^20].
* **DMARC és ARC fejlesztések**: Javítottuk a DMARC és ARC ellenőrzési hibákat, amelyek helytelen hitelesítési eredményekhez vezethettek\[^21]\[^22].
* **Teljesítmény optimalizálások**: Hozzájárultunk optimalizációkhoz, amelyek javítják az e-mail hitelesítési folyamatok teljesítményét\[^23]\[^24]\[^25]\[^26].

Ezek a fejlesztések segítenek biztosítani, hogy az e-mail hitelesítés pontos és megbízható legyen, védve a felhasználókat az adathalász és hamisítási támadások ellen.

### Fontos Upptime fejlesztések {#key-upptime-enhancements}

Hozzájárulásaink az Upptime-hoz:

* **SSL tanúsítvány figyelés**: Hozzáadtunk funkciót az SSL tanúsítvány lejáratának figyelésére, megelőzve a váratlan leállásokat a lejárt tanúsítványok miatt\[^27].
* **Több SMS szám támogatása**: Megvalósítottuk a több csapattag SMS értesítésének támogatását incidensek esetén, javítva a válaszidőt\[^28].
* **IPv6 ellenőrzések javítása**: Javítottuk az IPv6 kapcsolódási ellenőrzéseket, biztosítva a pontosabb monitorozást a modern hálózati környezetekben\[^29].
* **Sötét/világos mód támogatás**: Hozzáadtunk tématámogatást a státuszoldalak felhasználói élményének javítására\[^31].
* **Jobb TCP-Ping támogatás**: Fejlesztettük a TCP ping funkciót, hogy megbízhatóbb kapcsolat tesztelést biztosítson\[^32].
Ezek a fejlesztések nemcsak a Forward Email állapotfigyelését javítják, hanem az egész Upptime felhasználói közösség számára elérhetők, ezzel is bizonyítva elkötelezettségünket az általunk használt eszközök fejlesztése iránt.


## Az összetartó erő: Egyedi kód nagy léptékben {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Bár npm csomagjaink és meglévő projektekhez való hozzájárulásaink jelentősek, az igazán technikai szakértelmünket az egyedi kód mutatja meg, amely ezeket az összetevőket integrálja. A Forward Email kódbázisa egy évtizedes fejlesztési munkát képvisel, amely 2017-re nyúlik vissza, amikor a projekt még [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) néven indult, mielőtt egy monorepóba olvadt volna.

### Egy hatalmas fejlesztési erőfeszítés {#a-massive-development-effort}

Az egyedi integrációs kód mérete lenyűgöző:

* **Összes hozzájárulás**: Több mint 3,217 commit
* **Kódbázis mérete**: Több mint 421,545 sor kód JavaScript, Pug, CSS és JSON fájlokban\[^33]

Ez több ezer óra fejlesztési munkát, hibakeresést és teljesítményoptimalizálást jelent. Ez a „titkos összetevő”, amely az egyedi csomagokat egy összefüggő, megbízható szolgáltatássá alakítja, amelyet naponta több ezer ügyfél használ.

### Alapvető függőségek integrációja {#core-dependencies-integration}

A Forward Email kódbázisa számos függőséget integrál egy zökkenőmentes egésszé:

* **E-mail feldolgozás**: Nodemailer integrálása küldéshez, SMTP Server fogadáshoz, és Mailparser elemzéshez
* **Hitelesítés**: Mailauth használata DKIM, SPF, DMARC és ARC ellenőrzéshez
* **DNS feloldás**: Tangerine használata DNS-over-HTTPS-hez globális gyorsítótárazással
* **MX kapcsolat**: mx-connect használata Tangerine integrációval megbízható levelezőszerver kapcsolatokhoz
* **Feladatütemezés**: Bree alkalmazása megbízható háttérfeladat-feldolgozáshoz munkamenetekkel
* **Sablonkezelés**: email-templates használata a weboldal stíluslapjainak újrafelhasználásához az ügyfélkommunikációban
* **E-mail tárolás**: Egyedileg titkosított SQLite postaládák megvalósítása better-sqlite3-multiple-ciphers segítségével ChaCha20-Poly1305 titkosítással a kvantumbiztos adatvédelem érdekében, biztosítva a teljes izolációt a felhasználók között, és hogy csak a felhasználó férjen hozzá a postaládájához

Ezek az integrációk mind gondos figyelmet igényelnek a szélsőséges esetekre, a teljesítményre és a biztonsági aggályokra. Az eredmény egy robusztus rendszer, amely megbízhatóan kezeli a milliós e-mail tranzakciókat. SQLite megvalósításunk emellett msgpackr-t használ a hatékony bináris szerializációhoz és WebSocketeket (ws segítségével) a valós idejű állapotfrissítésekhez az infrastruktúránkban.

### DNS infrastruktúra Tangerine-nel és mx-connect-tel {#dns-infrastructure-with-tangerine-and-mx-connect}

A Forward Email infrastruktúrájának kritikus eleme a DNS feloldó rendszerünk, amely két kulcsfontosságú csomagra épül:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS megvalósításunk, amely a szabványos DNS feloldó helyettesítőjeként szolgál, beépített újrapróbálkozásokkal, időkorlátokkal, intelligens szerverforgatással és gyorsítótárazási támogatással.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Ez a csomag TCP kapcsolatokat létesít MX szerverekhez, egy cél domain vagy e-mail cím alapján feloldja a megfelelő MX szervereket, és prioritási sorrendben kapcsolódik hozzájuk.

A Tangerine-t az mx-connect-tel integráltuk a [pull request #4](https://github.com/zone-eu/mx-connect/pull/4) révén, biztosítva az alkalmazásrétegű DNS-over-HTTP kéréseket a Forward Email egészében. Ez globális gyorsítótárazást biztosít DNS-hez nagy léptékben, 1:1 konzisztenciával bármely régió, alkalmazás vagy folyamat között – ami kritikus a megbízható e-mail kézbesítéshez egy elosztott rendszerben.


## Vállalati hatás: Nyílt forrástól a küldetéskritikus megoldásokig {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Tízéves nyílt forráskódú fejlesztési utunk csúcspontjaként a Forward Email nemcsak egyéni fejlesztőket szolgál ki, hanem nagyvállalatokat és oktatási intézményeket is, amelyek maguk az open source mozgalom gerincét alkotják.
### Küldetéskritikus e-mail infrastruktúra esettanulmányai {#case-studies-in-mission-critical-email-infrastructure}

Elkötelezettségünk a megbízhatóság, az adatvédelem és a nyílt forráskódú elvek iránt tette a Forward Emailt a megbízható választássá azoknak a szervezeteknek, amelyek magas követelményeket támasztanak az e-mailekkel kapcsolatban:

* **Oktatási intézmények**: Ahogy azt részletesen bemutatja az [alumni e-mail továbbítás esettanulmányunk](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), nagy egyetemek infrastruktúránkra támaszkodnak, hogy megbízható e-mail továbbítási szolgáltatások révén életre szóló kapcsolatot tartsanak fenn több százezer alumnival.

* **Vállalati Linux megoldások**: A [Canonical Ubuntu e-mail vállalati esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) bemutatja, hogyan illeszkedik nyílt forráskódú megközelítésünk tökéletesen a vállalati Linux szolgáltatók igényeihez, biztosítva számukra az átláthatóságot és az irányítást, amelyre szükségük van.

* **Nyílt forráskódú alapítványok**: Talán a legmegerősítőbb a Linux Foundation-nel való partnerségünk, amelyet a [Linux Foundation e-mail vállalati esettanulmány](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) dokumentál, ahol szolgáltatásunk támogatja annak a szervezetnek a kommunikációját, amely a Linux fejlesztését felügyeli.

Gyönyörű szimmetria van abban, hogy nyílt forráskódú csomagjaink, amelyeket sok éven át gondosan karbantartottunk, lehetővé tették számunkra egy olyan e-mail szolgáltatás kiépítését, amely most támogatja azokat a közösségeket és szervezeteket, amelyek a nyílt forráskódú szoftvereket képviselik. Ez a teljes körű út – az egyéni csomagok hozzájárulásától a vállalati szintű e-mail infrastruktúra működtetéséig a nyílt forráskódú vezetők számára – a szoftverfejlesztési megközelítésünk végső igazolását jelenti.


## Egy évtized nyílt forráskód: előre tekintve {#a-decade-of-open-source-looking-forward}

Ahogy visszatekintünk egy évtizednyi nyílt forráskódú hozzájárulásra, és előre tekintünk a következő tíz évre, hálával tölt el minket a közösség, amely támogatta munkánkat, és izgatottsággal várjuk, mi következik.

Utunk az egyéni csomagfejlesztőktől egy átfogó e-mail infrastruktúra karbantartóivá, amelyet nagyvállalatok és nyílt forráskódú alapítványok használnak, figyelemre méltó volt. Ez a nyílt forráskódú fejlesztés erejének és annak a hatásnak a bizonyítéka, amelyet a gondosan karbantartott, átgondolt szoftver gyakorolhat a szélesebb ökoszisztémára.

A következő években elkötelezettek vagyunk:

* **Meglévő csomagjaink folyamatos karbantartása és fejlesztése** annak érdekében, hogy megbízható eszközök maradjanak a fejlesztők számára világszerte.
* **Hozzájárulásaink bővítése kritikus infrastruktúra projektekhez**, különösen az e-mail és biztonsági területeken.
* **A Forward Email képességeinek fejlesztése**, miközben megőrizzük elkötelezettségünket az adatvédelem, a biztonság és az átláthatóság iránt.
* **A következő generációs nyílt forráskódú hozzájárulók támogatása** mentorálás, szponzorálás és közösségi részvétel révén.

Hisszük, hogy a szoftverfejlesztés jövője nyitott, együttműködő és a bizalom alapjaira épül. Azáltal, hogy továbbra is magas minőségű, biztonságközpontú csomagokat járulunk hozzá a JavaScript ökoszisztémához, reméljük, hogy kis részünket hozzájárulhatjuk ennek a jövőnek az építéséhez.

Köszönjük mindenkinek, aki használta csomagjainkat, hozzájárult projektjeinkhez, hibákat jelentett, vagy egyszerűen csak terjesztette a munkánkról szóló hírt. Támogatásotok tette lehetővé ezt a hatékony évtizedet, és izgatottan várjuk, mit érhetünk el együtt a következő tíz évben.

\[^1]: npm letöltési statisztikák a cabin csomagra, 2025 április
\[^2]: npm letöltési statisztikák a bson-objectid csomagra, 2025 február-március
\[^3]: npm letöltési statisztikák az url-regex-safe csomagra, 2025 április
\[^4]: GitHub csillagok száma a forwardemail/forwardemail.net projektben 2025 áprilisában
\[^5]: npm letöltési statisztikák a preview-email csomagra, 2025 április
\[^7]: npm letöltési statisztikák a superagent csomagra, 2025 február-március
\[^8]: npm letöltési statisztikák a supertest csomagra, 2025 február-március
\[^9]: npm letöltési statisztikák a preview-email csomagra, 2025 február-március
\[^10]: npm letöltési statisztikák a cabin csomagra, 2025 február-március
\[^11]: npm letöltési statisztikák az url-regex-safe csomagra, 2025 február-március
\[^12]: npm letöltési statisztikák a spamscanner csomagra, 2025 február-március
\[^13]: Napi letöltési minták az npm statisztikák alapján, 2025 április
\[^14]: Heti letöltési minták az npm statisztikák alapján, 2025 április
\[^15]: npm letöltési statisztikák a nodemailer csomagra, 2025 április
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Az Upptime repozitórium GitHub hibái alapján
\[^28]: Az Upptime repozitórium GitHub hibái alapján
\[^29]: Az Upptime repozitórium GitHub hibái alapján
\[^30]: npm letöltési statisztikák a bree csomagra, 2025 február-március
\[^31]: Az Upptime GitHub pull requestjei alapján
\[^32]: Az Upptime GitHub pull requestjei alapján
\[^34]: npm letöltési statisztikák a koa csomagra, 2025 február-március
\[^35]: npm letöltési statisztikák az @koa/router csomagra, 2025 február-március
\[^36]: npm letöltési statisztikák a koa-router csomagra, 2025 február-március
\[^37]: npm letöltési statisztikák az url-regex csomagra, 2025 február-március
\[^38]: npm letöltési statisztikák az @breejs/later csomagra, 2025 február-március
\[^39]: npm letöltési statisztikák az email-templates csomagra, 2025 február-március
\[^40]: npm letöltési statisztikák a get-paths csomagra, 2025 február-március
\[^41]: npm letöltési statisztikák a dotenv-parse-variables csomagra, 2025 február-március
\[^42]: npm letöltési statisztikák az @koa/multer csomagra, 2025 február-március
