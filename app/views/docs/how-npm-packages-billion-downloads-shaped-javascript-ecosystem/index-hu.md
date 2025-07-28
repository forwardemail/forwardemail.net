# Egy évtizednyi hatás: Hogyan érték el npm csomagjaink az 1 milliárd letöltést és hogyan formálták a JavaScriptet {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lusta" src="/img/articles/npm.webp" alt="" class="lekerekített-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Az úttörők, akik megbíznak bennünk: Isaac Z. Schlueter és az e-mail továbbítása](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Az npm létrehozásától a Node.js vezetésig](#from-npms-creation-to-nodejs-leadership)
* [Az építész a kód mögött: Nick Baugh utazása](#the-architect-behind-the-code-nick-baughs-journey)
  * [Expressz Technikai Bizottság és alapvető hozzájárulások](#express-technical-committee-and-core-contributions)
  * [Koa-keret-hozzájárulások](#koa-framework-contributions)
  * [Egyéni közreműködőből szervezetvezetővé](#from-individual-contributor-to-organization-leader)
* [GitHub-szervezeteink: Az innováció ökoszisztémái](#our-github-organizations-ecosystems-of-innovation)
  * [Kabin: Strukturált naplózás modern alkalmazásokhoz](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: az e-mailekkel való visszaélés elleni küzdelem](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern munkaütemezés dolgozói szálakkal](#bree-modern-job-scheduling-with-worker-threads)
  * [E-mail továbbítás: Nyílt forráskódú e-mail infrastruktúra](#forward-email-open-source-email-infrastructure)
  * [Lad: Essential Koa Utilities and Tools](#lad-essential-koa-utilities-and-tools)
  * [Üzemidő: Nyílt forráskódú üzemidő figyelés](#upptime-open-source-uptime-monitoring)
* [Hozzájárulásunk a Forward Email ökoszisztémához](#our-contributions-to-the-forward-email-ecosystem)
  * [A csomagoktól a gyártásig](#from-packages-to-production)
  * [A visszacsatolási hurok](#the-feedback-loop)
* [Továbbítás Az e-mail alapelvei: A kiválóság alapja](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Mindig fejlesztőbarát, biztonság-központú és átlátható](#always-developer-friendly-security-focused-and-transparent)
  * [Időtesztelt szoftverfejlesztési elvek betartása](#adherence-to-time-tested-software-development-principles)
  * [Célzás a Scrappy, Bootstrapped Fejlesztő](#targeting-the-scrappy-bootstrapped-developer)
  * [Gyakorlati alapelvek: A továbbított e-mail kódbázis](#principles-in-practice-the-forward-email-codebase)
  * [Adatvédelem tervezés által](#privacy-by-design)
  * [Fenntartható nyílt forráskódú](#sustainable-open-source)
* [A számok nem hazudnak: Megdöbbentő npm-statisztikáink letöltése](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Hatásunk madártávlatából](#a-birds-eye-view-of-our-impact)
  * [Napi hatás méretarányosan](#daily-impact-at-scale)
  * [Túl a nyers számokon](#beyond-the-raw-numbers)
* [Az ökoszisztéma támogatása: nyílt forráskódú szponzorációink](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Az e-mail infrastruktúra úttörője](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Biztonsági sebezhetőségek feltárása a JavaScript ökoszisztémában](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [A Koa-Router Rescue](#the-koa-router-rescue)
  * [A ReDoS sebezhetőségeinek kezelése](#addressing-redos-vulnerabilities)
  * [A Node.js és a Chromium Security támogatása](#advocating-for-nodejs-and-chromium-security)
  * [Az npm infrastruktúra biztosítása](#securing-npm-infrastructure)
* [Hozzájárulásunk a Forward Email ökoszisztémához](#our-contributions-to-the-forward-email-ecosystem-1)
  * [A Nodemailer alapvető funkcióinak javítása](#enhancing-nodemailers-core-functionality)
  * [Az e-mail hitelesítés fejlesztése a Mailauth segítségével](#advancing-email-authentication-with-mailauth)
  * [Főbb üzemidő-fejlesztések](#key-upptime-enhancements)
* [A ragasztó, amely mindent egyben tart: egyedi kód méretben](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Hatalmas fejlesztési erőfeszítés](#a-massive-development-effort)
  * [Alapvető függőségek integrációja](#core-dependencies-integration)
  * [DNS infrastruktúra Tangerine és mx-connect segítségével](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Vállalati hatás: a nyílt forráskódtól a küldetéskritikus megoldásokig](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Esettanulmányok a küldetéskritikus e-mail infrastruktúrában](#case-studies-in-mission-critical-email-infrastructure)
* [Nyílt forráskód egy évtizede: Várakozás](#a-decade-of-open-source-looking-forward)

## Előszó {#foreword}

A [JavaScript](https://en.wikipedia.org/wiki/JavaScript) és [Node.js](https://en.wikipedia.org/wiki/Node.js) világában egyes csomagok elengedhetetlenek – naponta milliószor töltik le őket, és világszerte alkalmazásokat működtetnek. Ezen eszközök mögött a nyílt forráskódú minőségre összpontosító fejlesztők állnak. Ma bemutatjuk, hogyan segít csapatunk olyan npm csomagok létrehozásában és karbantartásában, amelyek a JavaScript ökoszisztéma kulcsfontosságú részévé váltak.

## Az úttörők, akik megbíznak bennünk: Isaac Z. Schlueter és az e-mail továbbítása {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Büszkék vagyunk arra, hogy [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) felhasználónk van. Isaac létrehozta a [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) oldalt, és segített felépíteni a [Node.js](https://en.wikipedia.org/wiki/Node.js) oldalt. A Forward Emailbe vetett bizalma mutatja a minőségre és a biztonságra való összpontosításunkat. Isaac számos domainhez, köztük az izs.me-hez is használja a Forward Email szolgáltatást.

Isaac hatása a JavaScriptre óriási. 2009-ben ő volt az elsők között, akik felismerték a Node.js lehetőségeit, a platformot létrehozó [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl)-cel együttműködve. Ahogy Isaac egy [interjú az Increment magazinnal](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-ban mondta: „Egy nagyon kis közösség közepén, amely azon gondolkodott, hogyan lehetne megvalósítani a szerveroldali JS-t, Ryan Dahl előállt a Node-dal, ami egyértelműen a helyes megközelítés volt. Én is belevágtam, és 2009 közepén nagyon belemerültem.”

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### Az npm létrehozásától a Node.js vezetéséig {#from-npms-creation-to-nodejs-leadership}

Isaac 2009 szeptemberében alkotta meg az npm-et, az első használható verzió 2010 elején jelent meg. Ez a csomagkezelő kulcsfontosságú igényt elégített ki a Node.js-ben, lehetővé téve a fejlesztők számára a kód egyszerű megosztását és újrafelhasználását. A [Node.js Wikipédia oldal](https://en.wikipedia.org/wiki/Node.js) szerint: „2010 januárjában bevezették a Node.js környezethez az npm nevű csomagkezelőt. A csomagkezelő lehetővé teszi a programozók számára a Node.js csomagok közzétételét és megosztását a hozzájuk tartozó forráskóddal együtt, és a csomagok telepítésének, frissítésének és eltávolításának egyszerűsítésére szolgál.”

Amikor Ryan Dahl 2012 januárjában visszalépett a Node.js-től, Isaac vette át a projektvezetői posztot. Ahogy a [összefoglalója](https://izs.me/resume) oldalon is megjegyezték, „számos alapvető Node.js API fejlesztését vezette, beleértve a CommonJS modulrendszert, a fájlrendszer API-kat és a streameket”, és „két évig a projekt BDFL-jeként (Benevolent Dictator For Life) tevékenykedett, biztosítva a Node.js v0.6-tól v0.10-ig terjedő verzióinak folyamatosan növekvő minőségét és megbízható build folyamatát.”

Isaac végigvezette a Node.js-t egy kulcsfontosságú növekedési időszakon, és olyan szabványokat állított fel, amelyek a mai napig formálják a platformot. Később 2014-ben elindította az npm, Inc.-t, hogy támogassa az npm registry-t, amelyet korábban önállóan vezetett.

Köszönjük Isaacnak a JavaScripthez nyújtott hatalmas hozzájárulását, és továbbra is számos általa létrehozott csomagot használunk. Munkája megváltoztatta azt, ahogyan szoftvereket készítünk, és azt, hogy fejlesztők milliói osztják meg a kódot világszerte.

## A kód mögött álló építész: Nick Baugh utazása {#the-architect-behind-the-code-nick-baughs-journey}

Nyílt forráskódú sikerünk középpontjában Nick Baugh, a Forward Email alapítója és tulajdonosa áll. A JavaScript területén végzett munkája közel 20 évet ölel fel, és számtalan fejlesztő alakított ki alkalmazásokat. Nyílt forráskódú útja a technikai készségeket és a közösségi vezetést egyaránt mutatja.

### Expressz Műszaki Bizottság és Alapvető Hozzájárulások {#express-technical-committee-and-core-contributions}

Nick webes keretrendszerekkel kapcsolatos szakértelme helyet szerzett neki a [Expressz műszaki bizottság](https://expressjs.com/en/resources/community.html) oldalon, ahol az egyik leggyakrabban használt Node.js keretrendszerrel segített. Nick jelenleg inaktív tagként szerepel a [Expressz közösségi oldal](https://expressjs.com/en/resources/community.html) oldalon.

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

A [Expressz műszaki bizottság](https://expressjs.com/en/resources/community.html) tagjaként Nick nagy figyelmet fordított a részletekre olyan kérdésekben, mint a `req.originalUrl` dokumentációjának tisztázása és a többrészes űrlapkezelési problémák megoldása.

### Koa keretrendszer hozzájárulásai {#koa-framework-contributions}

Nick munkája a [Koa keret](https://github.com/koajs/koa)-tal – egy modern, könnyebb alternatívával az Expresshez, amelyet szintén TJ Holowaychuk készített – tovább mutatja elkötelezettségét a jobb webfejlesztő eszközök iránt. Koa-hozzájárulásai magukban foglalják mind a problémák megoldását, mind a kódot a pull requesteken keresztül, a hibakezelés, a tartalomtípus-kezelés és a dokumentáció fejlesztésének megoldását.

Az Expressz és a Koa területén végzett munkája egyedülálló képet ad neki a Node.js webfejlesztésről, segítve csapatunkat olyan csomagok létrehozásában, amelyek jól működnek több keretrendszerrel.

### Egyéni közreműködőtől szervezetvezetővé {#from-individual-contributor-to-organization-leader}

Ami a meglévő projektek segítésével indult, teljes csomag-ökoszisztémák létrehozásává és karbantartásává nőtte ki magát. Nick több GitHub szervezetet is alapított – köztük a [Kabin](https://github.com/cabinjs), [Spamkereső](https://github.com/spamscanner), [E-mail továbbítása](https://github.com/forwardemail), [Fiú](https://github.com/ladjs) és [Bree](https://github.com/breejs) –, amelyek mindegyike a JavaScript közösség speciális igényeit elégítette ki.

Ez a közreműködőből vezetővé váltás megmutatja Nick vízióját a jól megtervezett szoftverekről, amelyek valódi problémákat oldanak meg. A kapcsolódó csomagok fókuszált GitHub-szervezetek alatt történő szervezésével olyan eszközökoszisztémákat épített ki, amelyek együtt működnek, miközben modulárisak és rugalmasak maradnak a szélesebb fejlesztői közösség számára.

## GitHub-szervezeteink: Az innováció ökoszisztémái {#our-github-organizations-ecosystems-of-innovation}

Nyílt forráskódú munkánkat fókuszált GitHub-szervezetek köré szervezzük, amelyek mindegyike konkrét igényeket old meg JavaScriptben. Ez a struktúra összefüggő csomagcsaládokat hoz létre, amelyek jól együttműködnek, miközben modulárisak maradnak.

### Kabin: Strukturált naplózás modern alkalmazásokhoz {#cabin-structured-logging-for-modern-applications}

A [Kabin szervezés](https://github.com/cabinjs) a mi megközelítésünk az egyszerű, hatékony alkalmazásnaplózáshoz. A fő [`cabin`](https://github.com/cabinjs/cabin) csomag közel 900 GitHub-csillaggal és több mint 100 000 heti letöltéssel rendelkezik\[^1]. A Cabin strukturált naplózást biztosít, amely olyan népszerű szolgáltatásokkal működik, mint a Sentry, a LogDNA és a Papertrail.

A Cabin különlegességét az átgondolt API és bővítményrendszere adja. Az olyan támogatott csomagok, mint a [`axe`](https://github.com/cabinjs/axe) az Express middleware-hez és a [`parse-request`](https://github.com/cabinjs/parse-request) a HTTP kérések elemzéséhez, jól mutatják elkötelezettségünket a komplett megoldások, nem pedig az elszigetelt eszközök iránt.

A [`bson-objectid`](https://github.com/cabinjs/bson-objectid) csomag külön említést érdemel, több mint 1,7 millió letöltéssel mindössze két hónap alatt\[^2]. Ez a könnyű MongoDB ObjectID implementáció a teljes MongoDB függőségek nélküli azonosítókra szoruló fejlesztők kedvencévé vált.

### Spamszkenner: Az e-mailes visszaélések elleni küzdelem {#spam-scanner-fighting-email-abuse}

A [Spam Scanner szervezet](https://github.com/spamscanner) a valós problémák megoldása iránti elkötelezettségünket mutatja. A fő [`spamscanner`](https://github.com/spamscanner/spamscanner) csomag fejlett e-mail spam-észlelést biztosít, de a [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) csomag az, amelyik hihetetlenül népszerű.

Több mint 1,2 millió letöltéssel két hónap alatt\[^3], a `url-regex-safe` kritikus biztonsági problémákat javít más URL-észlelő reguláris kifejezésekben. Ez a csomag bemutatja a nyílt forráskódú szoftverekhez való hozzáállásunkat: egy gyakori probléma (jelen esetben [RedoS](https://en.wikipedia.org/wiki/ReDoS) sebezhetőségek az URL-érvényesítésben) megtalálása, egy szilárd megoldás létrehozása és gondos karbantartása.

### Bree: Modern munkaütemezés munkaszálakkal {#bree-modern-job-scheduling-with-worker-threads}

A [Bree szervezet](https://github.com/breejs) a válaszunk egy gyakori Node.js kihívásra: a megbízható feladatütemezésre. A fő [`bree`](https://github.com/breejs/bree) csomag, több mint 3100 GitHub csillaggal, egy modern feladatütemezőt biztosít, amely Node.js munkaszálakat használ a jobb teljesítmény és megbízhatóság érdekében.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Miben különbözik Bree más ütemezőktől, mint például az Agenda:

* **Nincsenek külső függőségek**: Az Agendával ellentétben, amely MongoDB-t igényel, a Bree nem igényel Redis-t vagy MongoDB-t a feladatok állapotának kezeléséhez.
* **Munkaszálak**: A Bree Node.js munkaszálakat használ a sandboxos folyamatokhoz, ami jobb izolációt és teljesítményt biztosít.
* **Egyszerű API**: A Bree részletes vezérlést kínál egyszerűséggel, megkönnyítve az összetett ütemezési igények megvalósítását.
* **Beépített támogatás**: Az olyan dolgok, mint a kecses újratöltés, a cron feladatok, a dátumok és az emberbarát időpontok alapértelmezés szerint benne vannak.

A Bree a [forwardemail.net](https://github.com/forwardemail/forwardemail.net) kulcsfontosságú része, olyan kritikus háttérfeladatokat kezel, mint az e-mailek feldolgozása, a tisztítás és az ütemezett karbantartás. A Bree használata a Forward Emailben jól mutatja elkötelezettségünket a saját eszközeink éles környezetben való használata iránt, biztosítva, hogy azok megfeleljenek a magas megbízhatósági szabványoknak.

Más nagyszerű munkaszál-csomagokat is használunk és nagyra értékelünk, mint például a [medence](https://github.com/piscinajs/piscina) és a HTTP klienseket, mint például a [tizenegy](https://github.com/nodejs/undici). Piscina, Bree-hez hasonlóan, Node.js munkaszálakat használ a hatékony feladatfeldolgozáshoz. Köszönetet mondunk [Matthew Hill](https://github.com/mcollina)-nak, aki az undici és a piscina karbantartója, a Node.js-hez való jelentős hozzájárulásáért. Matteo a Node.js Műszaki Irányító Bizottságának tagja, és jelentősen javította a Node.js HTTP kliens képességeit.

### E-mail továbbítása: Nyílt forráskódú e-mail infrastruktúra {#forward-email-open-source-email-infrastructure}

Legambiciózusabb projektünk a [E-mail továbbítása](https://github.com/forwardemail), egy nyílt forráskódú e-mail szolgáltatás, amely e-mail továbbítást, tárolást és API szolgáltatásokat kínál. A fő adattár több mint 1100 GitHub csillaggal rendelkezik\[^4], ami azt mutatja, hogy a közösség nagyra értékeli ezt az alternatívát a zárt e-mail szolgáltatásokkal szemben.

A szervezet [`preview-email`](https://github.com/forwardemail/preview-email) csomagja, amely két hónap alatt több mint 2,5 millió letöltést ért el\[^5], nélkülözhetetlen eszközzé vált az e-mail sablonokkal dolgozó fejlesztők számára. Azzal, hogy egyszerű módot kínál az e-mailek előnézetére a fejlesztés során, megold egy gyakori problémát az e-mail-alapú alkalmazások fejlesztése során.

### Lad: Alapvető Koa segédprogramok és eszközök {#lad-essential-koa-utilities-and-tools}

A [Legényszervezet](https://github.com/ladjs) alapvető segédprogramok és eszközök gyűjteményét kínálja, amelyek elsősorban a Koa keretrendszer ökoszisztémájának fejlesztésére összpontosítanak. Ezek a csomagok a webfejlesztés gyakori kihívásait oldják meg, és úgy lettek kialakítva, hogy zökkenőmentesen működjenek együtt, miközben önállóan is hasznosak maradnak.

#### koa-better-error-handler: Továbbfejlesztett hibakezelés a Koa {#koa-better-error-handler-improved-error-handling-for-koa} verziójához

A [`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) jobb hibakezelési megoldást kínál a Koa alkalmazásokhoz. Több mint 50 GitHub-csillaggal rendelkező csomag lehetővé teszi a `ctx.throw` felhasználóbarát hibaüzenetek létrehozását, miközben a Koa beépített hibakezelőjének számos korlátját orvosolja:

* Észleli és megfelelően kezeli a Node.js DNS-hibákat, Mongoose-hibákat és Redis-hibákat
* A [Fellendülés](https://github.com/hapijs/boom)-t használja a konzisztens, jól formázott hibaválaszok létrehozásához
* Megőrzi a fejléceket (ellentétben a Koa beépített kezelőjével)
* Megfelelő állapotkódokat tart fenn az alapértelmezett 500 helyett
* Támogatja a flash üzeneteket és a munkamenet-megőrzést
* HTML hibalistákat biztosít az érvényesítési hibákhoz
* Több választípust támogat (HTML, JSON és sima szöveg)

Ez a csomag különösen értékes, ha a [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) csomaggal együtt használják a Koa alkalmazások átfogó hibakezeléséhez.

#### útlevél: Hitelesítés {#passport-authentication-for-lad} fiú számára

A [`@ladjs/passport`](https://github.com/ladjs/passport) csomag a népszerű Passport.js hitelesítési köztes réteget bővíti a modern webes alkalmazásokhoz készült speciális fejlesztésekkel. Ez a csomag alapból több hitelesítési stratégiát támogat:

* Helyi hitelesítés e-mail címmel
* Bejelentkezés Apple-lel
* GitHub hitelesítés
* Google hitelesítés
* Egyszer használatos jelszó (OTP) hitelesítés

A csomag nagymértékben testreszabható, lehetővé téve a fejlesztők számára, hogy a mezőneveket és kifejezéseket az alkalmazás követelményeinek megfelelően módosítsák. Úgy tervezték, hogy zökkenőmentesen integrálódjon a Mongoose-szal a felhasználókezeléshez, így ideális megoldást jelent a robusztus hitelesítést igénylő Koa-alapú alkalmazásokhoz.

#### graceful: Elegáns alkalmazásleállítás {#graceful-elegant-application-shutdown}

A [`@ladjs/graceful`](https://github.com/ladjs/graceful) megoldja a Node.js alkalmazások szabályos leállításának kritikus kihívását. Több mint 70 GitHub-csillaggal ez a csomag biztosítja, hogy az alkalmazás zökkenőmentesen leállhasson adatvesztés vagy kapcsolatok lefagyása nélkül. Főbb jellemzők:

* HTTP szerverek szabályos lezárásának támogatása (Express/Koa/Fastify)
* Adatbázis-kapcsolatok tiszta leállítása (MongoDB/Mongoose)
* Redis kliensek megfelelő lezárása
* Bree job ütemezők kezelése
* Egyéni leállításkezelők támogatása
* Konfigurálható időtúllépési beállítások
* Integráció naplózó rendszerekkel

Ez a csomag elengedhetetlen az éles alkalmazásokhoz, ahol a váratlan leállások adatvesztéshez vagy -sérüléshez vezethetnek. A megfelelő leállítási eljárások megvalósításával a `@ladjs/graceful` segít biztosítani az alkalmazás megbízhatóságát és stabilitását.

### Uptime: Nyílt forráskódú üzemidő-monitorozás {#upptime-open-source-uptime-monitoring}

A [Uptime szervezet](https://github.com/upptime) az átlátható, nyílt forráskódú monitorozás iránti elkötelezettségünket képviseli. A fő [`upptime`](https://github.com/upptime/upptime) adattár több mint 13 000 GitHub-csillaggal rendelkezik, így ez az egyik legnépszerűbb projekt, amelyhez hozzájárulunk. Az Upptime egy GitHub-alapú üzemidő-monitort és állapotoldalt biztosít, amely teljes mértékben szerver nélkül működik.

Az Upptime-ot használjuk a saját állapotoldalunkhoz a <https://status.forwardemail.net> címen, a forráskód pedig a <https://github.com/forwardemail/status.forwardemail.net>. címen érhető el.

Ami az Upptime-ot különlegessé teszi, az az architektúrája:

* **100%-ban nyílt forráskódú**: Minden komponens teljesen nyílt forráskódú és testreszabható.
* **GitHub-alapú**: A GitHub Actions, Issues és Pages funkcióit használja ki egy szerver nélküli monitorozási megoldáshoz.
* **Nincs szükség szerverre**: A hagyományos monitorozó eszközökkel ellentétben az Upptime nem igényli szerver futtatását vagy karbantartását.
* **Automatikus állapotoldal**: Egy gyönyörű állapotoldalt generál, amely a GitHub Pages-en tárolható.
* **Hatékony értesítések**: Különböző értesítési csatornákkal integrálható, beleértve az e-mailt, az SMS-t és a Slacket.

A felhasználói élmény javítása érdekében integráltuk a [@octokit/core](https://github.com/octokit/core.js/) kódot a forwardemail.net kódbázisába, hogy valós idejű állapotfrissítéseket és incidenseket jelenítsen meg közvetlenül a weboldalunkon. Ez az integráció egyértelmű átláthatóságot biztosít felhasználóink számára a teljes rendszerünkben (weboldal, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree stb.) felmerülő problémák esetén azonnali értesítésekkel, jelvényikon-változásokkal, figyelmeztető színekkel és egyebekkel.

Az @octokit/core könyvtár lehetővé teszi számunkra, hogy valós idejű adatokat gyűjtsünk be az Upptime GitHub tárhelyünkből, feldolgozzuk és felhasználóbarát módon megjelenítsük. Ha bármely szolgáltatás kiesik vagy leromlott a teljesítménye, a felhasználók azonnal értesítést kapnak vizuális jelzőfényeken keresztül anélkül, hogy el kellene hagyniuk a fő alkalmazást. Ez a zökkenőmentes integráció biztosítja, hogy felhasználóink mindig naprakész információkkal rendelkezzenek rendszerünk állapotáról, növelve az átláthatóságot és a bizalmat.

Az Upptime-ot több száz szervezet vette át, amelyek átlátható, megbízható módot keresnek szolgáltatásaik nyomon követésére és állapotkommunikációjára a felhasználók felé. A projekt sikere megmutatja a meglévő infrastruktúrát (jelen esetben a GitHubot) kihasználó eszközök építésének erejét a gyakori problémák új módokon történő megoldására.

## Hozzájárulásunk az e-mail-továbbítási ökoszisztémához {#our-contributions-to-the-forward-email-ecosystem}

Míg nyílt forráskódú csomagjainkat a fejlesztők világszerte használják, ezek alkotják saját Forward Email szolgáltatásunk alapját is. Ez a kettős szerep – ezen eszközök létrehozóiként és használóiként egyaránt – egyedülálló perspektívát ad a valós alkalmazásukra, és folyamatos fejlődést ösztönöz.

### Csomagoktól az éles környezetig {#from-packages-to-production}

Az egyedi csomagoktól az összefüggő gyártási rendszerig vezető út gondos integrációt és bővítést igényel. E-mail továbbítás esetén ez a folyamat a következőket tartalmazza:

* **Egyéni bővítmények**: Forward Email-specifikus kiterjesztések fejlesztése nyílt forráskódú csomagjainkhoz, amelyek megfelelnek egyedi igényeinknek.
* **Integrációs minták**: Minták kidolgozása arra vonatkozóan, hogy ezek a csomagok hogyan működnek együtt éles környezetben.
* **Teljesítményoptimalizálás**: Azonosítjuk és kijavítjuk azokat a teljesítménybeli szűk keresztmetszeteket, amelyek csak nagy léptékben jelentkeznek.
* **Biztonsági szigorítás**: További biztonsági rétegek hozzáadása az e-mail-kezeléshez és a felhasználói adatok védelméhez.

Ez a munka több ezer órányi fejlesztést jelent magukon az alapvető csomagokon túl, ami egy robusztus, biztonságos e-mail szolgáltatást eredményez, amely kihasználja nyílt forráskódú hozzájárulásaink legjavát.

### A visszacsatolási hurok {#the-feedback-loop}

A saját csomagok termelésben való használatának talán legértékesebb aspektusa az általa létrehozott visszacsatolási hurok. Ha korlátozásokkal vagy szélsőséges esetekkel találkozunk a Forward Email szolgáltatásban, akkor nem csak helyileg javítjuk őket – javítjuk az alapul szolgáló csomagokat, ami mind a szolgáltatásunk, mind a szélesebb közösség javára válik.

Ez a megközelítés számos fejlesztést eredményezett:

* **A Bree szabályos leállítása**: A Forward Email nulla állásidejű telepítésekre való igénye a Bree szabályos leállítási képességeinek továbbfejlesztéséhez vezetett.
* **A Spam Scanner mintázatfelismerése**: A Forward Emailben talált valós spam minták befolyásolták a Spam Scanner észlelési algoritmusait.
* **A Cabin teljesítményoptimalizálása**: A nagy volumenű naplózás éles környezetben optimalizálási lehetőségeket tárt fel a Cabinban, amelyek minden felhasználó számára előnyösek.

A nyílt forráskódú munkánk és a termelési szolgáltatásunk közötti pozitív körfolyamat fenntartásával biztosítjuk, hogy csomagjaink gyakorlatias, harci tesztelt megoldások maradjanak, nem pedig elméleti megvalósítások.

## Az e-mail továbbításának alapelvei: A kiválóság alapja {#forward-emails-core-principles-a-foundation-for-excellence}

Az e-mailek továbbítását egy sor alapelv alapján terveztük, amelyek minden fejlesztési döntésünket irányítják. Ezek az alapelvek, amelyeket a [weboldal](/blog/docs/best-quantum-safe-encrypted-email-service#principles) dokumentumunkban részletezünk, biztosítják, hogy szolgáltatásunk fejlesztőbarát, biztonságos és a felhasználók adatainak védelmére összpontosító maradjon.

### Mindig fejlesztőbarát, biztonságközpontú és átlátható {#always-developer-friendly-security-focused-and-transparent}

Első és legfontosabb alapelvünk az, hogy fejlesztőbarát szoftvert készítsünk, miközben a legmagasabb szintű biztonsági és adatvédelmi követelményeket fenntartjuk. Hiszünk abban, hogy a technikai kiválóság soha nem mehet a használhatóság rovására, és az átláthatóság bizalmat épít közösségünkben.

Ez az elv megmutatkozik részletes dokumentációnkban, egyértelmű hibaüzeneteinkben és a sikerekről és a kihívásokról szóló nyílt kommunikációnkban. Azzal, hogy teljes kódbázisunkat nyílt forráskódúvá tesszük, ellenőrzésre és együttműködésre hívunk fel, erősítve ezzel szoftverünket és a szélesebb ökoszisztémát.

### Idővel bevált szoftverfejlesztési alapelvek betartása {#adherence-to-time-tested-software-development-principles}

Számos bevált szoftverfejlesztési elvet követünk, amelyek évtizedek óta bizonyították értéküket:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: A problémák szétválasztása a Model-View-Controller mintán keresztül
* **[Unix filozófia](https://en.wikipedia.org/wiki/Unix_philosophy)**: Moduláris komponensek létrehozása, amelyek egy dolgot csinálnak jól
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Egyszerűség és egyértelműség
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Ne ismételd magad, a kód újrafelhasználásának elősegítése
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nem lesz rá szükséged, a korai optimalizálás elkerülése
* **[Tizenkét tényező](https://12factor.net/)**: A modern, skálázható alkalmazások építésének legjobb gyakorlatainak követése
* **[Occam borotvája](https://en.wikipedia.org/wiki/Occam%27s_razor)**: A követelményeknek megfelelő legegyszerűbb megoldás kiválasztása
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Saját termékeink széles körű használata

Ezek az alapelvek nem csupán elméleti koncepciók – mindennapi fejlesztési gyakorlatainkba is beágyazódnak. Például a Unix filozófiához való ragaszkodásunk nyilvánvaló abban, ahogyan npm-csomagjainkat felépítettük: kicsi, fókuszált modulok, amelyek összetett problémák megoldása érdekében összeállíthatók.

### Célzottan a kapkodó, rendszerhibás fejlesztők {#targeting-the-scrappy-bootstrapped-developer}

Kifejezetten a kapkodó, kényszerű, és [ramen-nyereséges](https://www.paulgraham.com/ramenprofitable.html) fejlesztőket célozzuk meg. Ez a fókusz mindent meghatároz az árazási modellünktől a technikai döntéseinkig. Megértjük a korlátozott erőforrásokkal történő termékfejlesztés kihívásait, mert mi magunk is átéltük ezt a problémát.

Ez az elv különösen fontos a nyílt forráskód megközelítésében. Olyan csomagokat készítünk és karbantartunk, amelyek valódi problémákat oldanak meg a fejlesztők számára vállalati költségvetés nélkül, így hatékony eszközöket mindenki számára elérhetővé teszünk, erőforrásaitól függetlenül.

### Gyakorlati alapelvek: Az e-mail továbbítási kódbázisa {#principles-in-practice-the-forward-email-codebase}

Ezek az alapelvek jól láthatóak az E-mail továbbítás kódbázisában. A package.json fájlunk a függőségek átgondolt választékát tárja fel, amelyek mindegyikét úgy választottuk ki, hogy igazodjanak alapértékeinkhez:

* Biztonságra fókuszáló csomagok, mint például a `mailauth` az e-mail hitelesítéshez
* Fejlesztőbarát eszközök, mint például a `preview-email` az egyszerűbb hibakereséshez
* Moduláris komponensek, mint például a Sindre Sorhus különféle `p-*` segédprogramjai

Ezeket az elveket az idők során következetesen követve olyan szolgáltatást hoztunk létre, amelyre a fejlesztők rábízhatják e-mail infrastruktúrájukat – biztonságos, megbízható és a nyílt forráskódú közösség értékeivel összhangban.

### Beépített adatvédelem {#privacy-by-design}

Az adatvédelem nem egy utólagos gondolat vagy marketing funkció a Forward Email esetében – ez egy alapvető tervezési elv, amely szolgáltatásunk és kódunk minden aspektusáról tájékoztat:

* **Nulla hozzáférésű titkosítás**: Olyan rendszereket vezettünk be, amelyek technikailag lehetetlenné teszik számunkra a felhasználók e-mailjeinek elolvasását.
* **Minimális adatgyűjtés**: Csak a szolgáltatásunk nyújtásához szükséges adatokat gyűjtjük, semmi többet.
* **Átlátható szabályzatok**: Adatvédelmi szabályzatunk világos, érthető nyelven íródott, jogi zsargon nélkül.
* **Nyílt forráskódú ellenőrzés**: Nyílt forráskódú kódbázisunk lehetővé teszi a biztonsági kutatók számára, hogy ellenőrizzék adatvédelmi állításainkat.

Ez az elkötelezettség kiterjed nyílt forráskódú csomagjainkra is, amelyeket az alapoktól kezdve beépített biztonsági és adatvédelmi bevált gyakorlatokkal terveztünk.

### Fenntartható nyílt forráskódú {#sustainable-open-source}

Hiszünk abban, hogy a nyílt forráskódú szoftvereknek fenntartható modellekre van szükségük ahhoz, hogy hosszú távon boldoguljanak. Megközelítésünk a következőket tartalmazza:

* **Kereskedelmi támogatás**: Prémium támogatást és szolgáltatásokat kínálunk nyílt forráskódú eszközeinkhez.
* **Kiegyensúlyozott licencelés**: Olyan licencek használata, amelyek védik mind a felhasználói szabadságjogokat, mind a projekt fenntarthatóságát.
* **Közösségi szerepvállalás**: Aktív együttműködés a közreműködőkkel egy támogató közösség kiépítése érdekében.
* **Átlátható ütemtervek**: Fejlesztési terveink megosztása, hogy a felhasználók ennek megfelelően tervezhessenek.

A fenntarthatóságra összpontosítva biztosítjuk, hogy nyílt forráskódú hozzájárulásaink az idő múlásával tovább növekedhessenek és javuljanak ahelyett, hogy elhanyagolnák.

## A számok nem hazudnak: Megdöbbentő npm-es statisztikáink letöltése {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Amikor a nyílt forráskódú szoftverek hatásáról beszélünk, a letöltési statisztikák kézzelfogható mértéket adnak az elfogadásról és a bizalomról. Az általunk karbantartott csomagok közül sok elérte azt a skálát, amelyet csak kevés nyílt forráskódú projekt ér el, a letöltések együttes száma pedig milliárdokat tesz ki.

![Legnépszerűbb npm csomagok letöltések szerint](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### Hatásunk madártávlatból {#a-birds-eye-view-of-our-impact}

Mindössze a 2025. februártól márciusig tartó két hónapos időszakban a legjobb csomagok, amelyekhez hozzájárulunk, és segítünk fenntartani a megdöbbentő letöltési számokat:

* **[szuperügynök](https://www.npmjs.com/package/superagent)**: 84 575 829 letöltés\[^7] (eredetileg TJ Holowaychuk készítette)
* **[szuper teszt](https://www.npmjs.com/package/supertest)**: 76 432 591 letöltés\[^8] (eredetileg TJ Holowaychuk készítette)
* **[is](https://www.npmjs.com/package/koa)**: 28 539 295 letöltés\[^34] (eredetileg TJ Holowaychuk készítette)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 letöltés\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 letöltés\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 letöltések\[^37]
* **[preview-e-mail](https://www.npmjs.com/package/preview-email)**: 2 500 000 letöltés\[^9]
* **[kabin](https://www.npmjs.com/package/cabin)**: 1 800 000 letöltés\[^10]
* **[@breejs/később](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 letöltés\[^38]
* **[e-mail-sablonok](https://www.npmjs.com/package/email-templates)**: 1 128 139 letöltés\[^39]
* **[get-utak](https://www.npmjs.com/package/get-paths)**: 1 124 686 letöltés\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 letöltés\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 letöltések\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 letöltés\[^42]
* **[spam szkenner](https://www.npmjs.com/package/spamscanner)**: 145 000 letöltés\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 letöltés\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

Ezek nem csak lenyűgöző számok – valódi fejlesztőket jelentenek, akik valódi problémákat oldanak meg olyan kóddal, amelyet mi segítünk karbantartani. Minden letöltés egy olyan példa, amikor ezek a csomagok segítettek valakinek valami értelmeset építeni, a hobbiprojektektől a milliók által használt vállalati alkalmazásokig.

![Csomag kategóriák forgalmazása](/img/art/category_pie_chart.svg)

### Napi hatás nagy léptékben {#daily-impact-at-scale}

A napi letöltési minták következetes, nagy volumenű használatot mutatnak, a csúcsok elérik a napi több millió letöltést\[^13]. Ez az állandóság a csomagok stabilitására és megbízhatóságára utal – a fejlesztők nem csak kipróbálják őket, hanem integrálják az alapvető munkafolyamataikba, és nap mint nap támaszkodnak rájuk.

A heti letöltési minták még lenyűgözőbb számokat mutatnak, folyamatosan heti tízmillió letöltés körül mozognak\[^14]. Ez hatalmas lábnyomot jelent a JavaScript ökoszisztémában, mivel ezek a csomagok világszerte futnak éles környezetekben.

### A nyers számokon túl {#beyond-the-raw-numbers}

Noha a letöltési statisztikák önmagukban lenyűgözőek, mélyebb történetet mesélnek el a közösség által ezekbe a csomagokba vetett bizalomról. A csomagok ilyen léptékű fenntartása megingathatatlan elkötelezettséget igényel:

* **Visszafelé kompatibilitás**: A változtatásokat gondosan mérlegelni kell, hogy elkerüljük a meglévő implementációk hibáit.
* **Biztonság**: Mivel ezektől a csomagoktól több millió alkalmazás függ, a biztonsági réseknek messzemenő következményei lehetnek.
* **Teljesítmény**: Ezen a szinten még a kisebb teljesítményjavítások is jelentős összesített előnyökkel járhatnak.
* **Dokumentáció**: A világos, átfogó dokumentáció elengedhetetlen a fejlesztők által használt csomagokhoz, függetlenül a tapasztalati szinttől.

A letöltések számának folyamatos növekedése az idő múlásával azt tükrözi, hogy sikerült teljesíteni ezeket a kötelezettségvállalásokat, megbízható, jól karbantartott csomagok révén bizalmat építeni a fejlesztői közösséggel.

## Az ökoszisztéma támogatása: Nyílt forráskódú szoftverek támogatása {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

A JavaScript ökoszisztémához való közvetlen hozzájárulásunkon túl büszkék vagyunk arra, hogy kiemelkedő Node.js közreműködőket szponzorálhatunk, akik munkája számos modern alkalmazás alapját képezi. Szponzorációink közé tartozik:

### Andris Reinman: Az e-mail infrastruktúra úttörője {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) a [Nodemailer](https://github.com/nodemailer/nodemailer) megalkotója, amely a Node.js legnépszerűbb e-mail küldő könyvtára, több mint 14 millió letöltéssel hetente\[^15]. Munkássága kiterjed más kritikus e-mail infrastruktúra-összetevőkre is, mint például a [SMTP szerver](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) és [WildDuck](https://github.com/nodemailer/wildduck).

Szponzorációnk segít biztosítani ezeknek az alapvető eszközöknek a folyamatos karbantartását és fejlesztését, amelyek számtalan Node.js alkalmazás e-mail kommunikációját biztosítják, beleértve a saját Forward Email szolgáltatásunkat is.

### Sindre Sorhus: Segédprogramcsomag-fejlesztő {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) a JavaScript ökoszisztéma egyik legtermékenyebb nyílt forráskódú közreműködője, több mint 1000 npm csomaggal a nevéhez fűződik. Segédprogramjai, mint a [p-térkép](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) és [is-stream](https://github.com/sindresorhus/is-stream), alapvető építőelemek a Node.js ökoszisztémában.

Sindre munkájának támogatásával segítjük fenntartani ezeknek a kritikus segédprogramoknak a fejlesztését, amelyek hatékonyabbá és megbízhatóbbá teszik a JavaScript-fejlesztést.

Ezek a szponzorálások tükrözik a tágabb nyílt forráskódú ökoszisztéma iránti elkötelezettségünket. Elismerjük, hogy saját sikerünk ezen és más közreműködők által lefektetett alapokra épül, és elkötelezettek vagyunk a teljes ökoszisztéma fenntarthatóságának biztosításában.

## Biztonsági sebezhetőségek feltárása a JavaScript ökoszisztémában {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

A nyílt forráskód melletti elkötelezettségünk túlmutat a funkciók fejlesztésén, és magában foglalja azon biztonsági rések azonosítását és kezelését, amelyek fejlesztők millióit érinthetik. A JavaScript ökoszisztémához való legjelentősebb hozzájárulásunk közül több is a biztonság területén volt.

### A Koa-Router megmentése {#the-koa-router-rescue}

2019 februárjában Nick egy kritikus problémát azonosított a népszerű koa-router csomag karbantartásával kapcsolatban. Mivel [– számolt be a Hacker News](https://news.ycombinator.com/item?id=19156707) volt, a csomagot az eredeti karbantartója elhagyta, így a biztonsági réseket kezeletlenül hagyta, a közösség pedig frissítések nélkül maradt.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

Válaszul Nick létrehozta a [@koa/router](https://github.com/koajs/router) csomagot, és segített értesíteni a közösséget a helyzetről. Azóta is karbantartja ezt a kritikus fontosságú csomagot, biztosítva, hogy a Koa felhasználói biztonságos és jól karbantartott útválasztási megoldással rendelkezzenek.

### ReDoS sebezhetőségek kezelése {#addressing-redos-vulnerabilities}

2020-ban Nick azonosított és kijavított egy kritikus [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) sebezhetőséget a széles körben használt `url-regex` csomagban. Ez a sebezhetőség ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) lehetővé teheti a támadók számára, hogy szolgáltatásmegtagadást okozzanak speciálisan létrehozott bemenetükkel, ami katasztrofális visszalépést eredményez a reguláris kifejezésben.

Ahelyett, hogy egyszerűen csak javította volna a meglévő csomagot, Nick létrehozta a [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-t, egy teljesen átírt implementációt, amely a sebezhetőséget kezeli, miközben megőrzi a kompatibilitást az eredeti API-val. Emellett közzétett egy [átfogó blogbejegyzés](/blog/docs/url-regex-javascript-node-js)-t is, amely elmagyarázza a sebezhetőséget és annak enyhítésének módjait.

Ez a munka bemutatja a biztonsággal kapcsolatos megközelítésünket: nemcsak a problémák megoldását, hanem a közösség oktatását és olyan robusztus alternatívákat kínálunk, amelyek megakadályozzák a hasonló problémákat a jövőben.

### A Node.js és a Chromium biztonságának támogatása {#advocating-for-nodejs-and-chromium-security}

Nick aktívan küzdött a tágabb ökoszisztéma biztonsági fejlesztéseiért is. 2020 augusztusában jelentős biztonsági problémát azonosított a Node.js-ben a HTTP-fejlécek kezelésével kapcsolatban, amelyről a [A Nyilvántartás](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) hivatkozásban számolt be.

Ez a probléma, amely a Chromium javításából eredt, lehetővé teheti a támadók számára, hogy megkerüljék a biztonsági intézkedéseket. Nick támogatása segített abban, hogy a problémát azonnal orvosolják, és több millió Node.js-alkalmazást óvtak meg az esetleges kizsákmányolástól.

### Az npm infrastruktúra biztonságossá tétele {#securing-npm-infrastructure}

Ugyanebben a hónapban Nick egy másik kritikus biztonsági problémát azonosított, ezúttal az npm e-mail infrastruktúrájában. Amint arról a [A Nyilvántartás](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) cikkben beszámoltunk, az npm nem implementálta megfelelően a DMARC, SPF és DKIM e-mail hitelesítési protokollokat, ami lehetővé tette a támadók számára, hogy olyan adathalász e-maileket küldjenek, amelyek látszólag az npm-től származnak.

Nick jelentése az npm e-mail biztonsági helyzetének javításához vezetett, megvédve az npm-re támaszkodó fejlesztők millióit az esetleges adathalász támadásoktól.

## Hozzájárulásunk az e-mail-továbbítási ökoszisztémához {#our-contributions-to-the-forward-email-ecosystem-1}

A Forward Email számos kritikus nyílt forráskódú projektre épül, köztük a Nodemailer, a WildDuck és a mailauth projektekre. Csapatunk jelentős mértékben hozzájárult ezekhez a projektekhez, segítve az e-mailek kézbesítését és biztonságát érintő mély problémák azonosítását és kijavítását.

### A Nodemailer alapvető funkcióinak fejlesztése {#enhancing-nodemailers-core-functionality}

A [Nodemailer](https://github.com/nodemailer/nodemailer) a Node.js e-mail-küldésének gerincét alkotja, és a mi hozzájárulásaink hozzájárultak ahhoz, hogy robusztusabbá váljon:

* **SMTP szerver fejlesztések**: Kijavítottuk az elemzési hibákat, a streamkezelési problémákat és a TLS konfigurációs problémákat az SMTP szerver komponensben\[^16]\[^17].
* **Levél elemző fejlesztések**: Kijavítottuk a karaktersorozat dekódolásával kapcsolatos hibákat, és megoldottuk az elemzővel kapcsolatos problémákat, amelyek e-mail feldolgozási hibákat okozhattak\[^18]\[^19].

Ezek a hozzájárulások biztosítják, hogy a Nodemailer továbbra is megbízható alapot nyújtson az e-mail-feldolgozáshoz a Node.js alkalmazásokban, beleértve az e-mailek továbbítását is.

### E-mail-hitelesítés fejlesztése a Mailauth segítségével {#advancing-email-authentication-with-mailauth}

A [Mailauth](https://github.com/postalsys/mailauth) kritikus fontosságú e-mail-hitelesítési funkciókat biztosít, és hozzájárulásaink jelentősen javították a képességeit:

* **DKIM-ellenőrzési fejlesztések**: Felfedeztük és jelentettük, hogy az X/Twitter DNS-gyorsítótár-problémái DKIM-hibát okoztak a kimenő üzeneteknél. A Hacker One\[^20] oldalon jelentettük.
* **DMARC és ARC fejlesztések**: Kijavítottuk a DMARC és ARC ellenőrzésével kapcsolatos problémákat, amelyek helytelen hitelesítési eredményekhez vezethettek\[^21]\[^22].
* **Teljesítményoptimalizálások**: Olyan optimalizálásokat vezettünk be, amelyek javítják az e-mail-hitelesítési folyamatok teljesítményét\[^23]\[^24]\[^25]\[^26].

Ezek a fejlesztések biztosítják, hogy az e-mail-hitelesítés pontos és megbízható legyen, megvédve a felhasználókat az adathalász és a hamisító támadásoktól.

### Főbb üzemidő-fejlesztések {#key-upptime-enhancements}

Hozzájárulásunk az Upptime számára a következőket tartalmazza:

* **SSL tanúsítványfigyelés**: Hozzáadtunk egy funkciót az SSL tanúsítvány lejáratának figyeléséhez, megakadályozva a lejárt tanúsítványok miatti váratlan leállást\[^27].
* **Több SMS-szám támogatása**: Bevezettük a támogatást több csapattag SMS-ben történő értesítéséhez incidensek esetén, javítva a válaszidőket\[^28].
* **IPv6 ellenőrzési javítások**: Kijavítottuk az IPv6 kapcsolatellenőrzésekkel kapcsolatos problémákat, biztosítva a pontosabb figyelést a modern hálózati környezetekben\[^29].
* **Sötét/Világos mód támogatása**: Tématámogatást adtunk hozzá az állapotoldalak felhasználói élményének javítása érdekében\[^31].
* **Jobb TCP-Ping támogatás**: Továbbfejlesztettük a TCP ping funkciót a megbízhatóbb kapcsolattesztelés biztosítása érdekében\[^32].

Ezek a fejlesztések nemcsak a Forward Email állapotfigyelését szolgálják, hanem az Upptime felhasználók teljes közössége számára is elérhetők, bizonyítva elkötelezettségünket azon eszközök fejlesztése iránt, amelyektől függünk.

## Az összetartó erő: Egyedi kód nagy léptékben {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Bár az npm csomagjaink és a meglévő projektekhez való hozzájárulásaink jelentősek, az ezeket a komponenseket integráló egyéni kód az, ami igazán bemutatja technikai szakértelmünket. A Forward Email kódbázis egy évtizedes fejlesztési erőfeszítést képvisel, amely 2017-ig nyúlik vissza, amikor a projekt [ingyenes e-mail továbbítás](https://github.com/forwardemail/free-email-forwarding) néven indult, mielőtt egy monorepóba egyesítették volna.

### Hatalmas fejlesztési erőfeszítés {#a-massive-development-effort}

Ennek az egyéni integrációs kódnak a mérete lenyűgöző:

* **Összes közreműködés**: Több mint 3217 commit
* **Kódbázis mérete**: Több mint 421 545 sornyi kód JavaScript, Pug, CSS és JSON fájlokban\[^33]

Ez több ezer óra fejlesztési munkát, hibakeresési munkameneteket és teljesítményoptimalizálást jelent. Ez a „titkos szósz”, amely az egyes csomagokat egy összefüggő, megbízható szolgáltatássá alakítja, amelyet naponta több ezer vásárló vesz igénybe.

### Alapvető függőségek integrációja {#core-dependencies-integration}

A Forward Email kódbázis számos függőséget integrál egy zökkenőmentes egésszé:

* **E-mail feldolgozás**: Integrálja a Nodemailer-t a küldéshez, az SMTP szervert a fogadáshoz és a Mailparser-t az elemzéshez.* **Hitelesítés**: Mailauth-ot használ a DKIM, SPF, DMARC és ARC ellenőrzéshez.* **DNS feloldás**: Tangerine-t használ a DNS-over-HTTPS-hez globális gyorsítótárazással.* **MX kapcsolat**: Az mx-connect és a Tangerine integrációját használja a megbízható levelezőszerver-kapcsolatokhoz.* **Feladatütemezés**: Bree-t használ a megbízható háttérfeladat-feldolgozáshoz a munkaszálakkal.* **Sablonok**: E-mail sablonokat használ a webhelyről származó stíluslapok újrafelhasználásához az ügyfélkommunikációban.* **E-mail tárolás**: Egyedileg titkosított SQLite postaládákat valósít meg a better-sqlite3-multiple-ciphers és a ChaCha20-Poly1305 titkosítás használatával a kvantumbiztonságos adatvédelem érdekében, biztosítva a felhasználók közötti teljes elszigeteltséget, és azt, hogy csak a felhasználó férhessen hozzá a postaládájához.

Ezen integrációk mindegyike megköveteli a szélsőséges esetek, a teljesítményvonzatok és a biztonsági szempontok alapos mérlegelését. Az eredmény egy robusztus rendszer, amely több millió e-mail tranzakciót kezel megbízhatóan. Az SQLite implementációnk az msgpackr-t is felhasználja a hatékony bináris szerializáláshoz, a WebSockets-et (ws-n keresztül) pedig a valós idejű állapotfrissítésekhez infrastruktúránkban.

### DNS infrastruktúra Tangerine és mx-connect szolgáltatásokkal {#dns-infrastructure-with-tangerine-and-mx-connect}

A Forward Email infrastruktúrájának kritikus eleme a DNS-feloldó rendszerünk, amely két kulcsfontosságú csomagra épül:

* **[Mandarin](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: A Node.js DNS-over-HTTPS implementációnk a szabványos DNS-feloldó azonnal használható helyettesítője, beépített újrapróbálkozásokkal, időtúllépésekkel, intelligens szerverrotációval és gyorsítótárazási támogatással.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Ez a csomag TCP-kapcsolatokat hoz létre az MX-kiszolgálókkal, egy céltartományt vagy e-mail címet vesz fel, feloldja a megfelelő MX-kiszolgálókat, és prioritási sorrendben csatlakozik hozzájuk.

A Tangerine-t integráltuk az mx-connecttel a [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), biztosítva az alkalmazásrétegű DNS-t HTTP kérések felett a Forward Email teljes folyamatában. Ez globális gyorsítótárat biztosít a DNS számára nagy léptékben, 1:1 konzisztenciával bármely régióban, alkalmazásban vagy folyamatban – ez kritikus fontosságú a megbízható e-mail kézbesítéshez egy elosztott rendszerben.


## Vállalati hatás: A nyílt forráskódú szoftverektől a kritikus fontosságú megoldásokig {#enterprise-impact-from-open-source-to-mission-critical-solutions}

A nyílt forráskódú fejlesztésben eltöltött évtizedes utunk csúcspontja lehetővé tette a Forward Email számára, hogy ne csak az egyéni fejlesztőket, hanem a nyílt forráskódú mozgalom gerincét alkotó nagyobb vállalatokat és oktatási intézményeket is kiszolgálja.


### Esettanulmányok a kritikus fontosságú e-mail infrastruktúrában {#case-studies-in-mission-critical-email-infrastructure}

A megbízhatóság, az adatvédelem és a nyílt forráskódú elvek iránti elkötelezettségünk tette a Forward Emailt a megbízható választássá az igényes e-mail-követelményekkel rendelkező szervezetek számára:

* **Oktatási intézmények**: Ahogyan azt az [öregdiákok e-mail-továbbítási esettanulmányunkban] részletesen ismertettük.](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) linken keresztül. A nagyobb egyetemek infrastruktúránkra támaszkodnak, hogy megbízható e-mail-továbbítási szolgáltatásokon keresztül élethosszig tartó kapcsolatot tartsanak fenn több százezer öregdiákkal.

* **Vállalati Linux megoldások**: A [Kanonikus Ubuntu e-mail vállalati esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) bemutatja, hogy nyílt forráskódú megközelítésünk hogyan illeszkedik tökéletesen a vállalati Linux-szolgáltatók igényeihez, biztosítva számukra a szükséges átláthatóságot és kontrollt.

* **Nyílt forráskódú alapok**: Talán a legmegerősítőbb a Linux Foundationnel fennálló partnerségünk, amint azt a [Linux Foundation e-mail vállalati esettanulmány](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) dokumentálja, ahol szolgáltatásunk biztosítja a kommunikációt annak a szervezetnek, amely a Linux fejlesztésért felel.

Gyönyörű szimmetria van abban, ahogy a sok éven át gondosan karbantartott nyílt forráskódú csomagjaink lehetővé tették számunkra, hogy olyan e-mail szolgáltatást hozzunk létre, amely most éppen azokat a közösségeket és szervezeteket támogatja, amelyek a nyílt forráskódú szoftverekért küzdenek. Ez a teljes kört átfogó utazás – az egyedi csomagok hozzájárulásától a vállalati szintű e-mail infrastruktúra működtetéséig a nyílt forráskódú vezetők számára – a szoftverfejlesztési megközelítésünk végső érvényesítését jelenti.

## Egy évtizednyi nyílt forráskód: Előretekintés {#a-decade-of-open-source-looking-forward}

Ahogy visszatekintünk egy évtizednyi nyílt forráskódú hozzájárulásra, és előretekintünk a következő tíz évre, tele vagyunk hálával a közösségért, amely támogatta a munkánkat, és izgalommal várjuk az elkövetkezőket.

Figyelemreméltó volt az utunk a csomagok egyéni közreműködőitől a nagyvállalatok és nyílt forráskódú alapítványok által használt átfogó e-mail infrastruktúra fenntartóiig. Ez bizonyítja a nyílt forráskódú fejlesztés erejét és azt, hogy az átgondolt, jól karbantartott szoftver milyen hatással lehet a szélesebb ökoszisztémára.

Az elkövetkező években elkötelezettek vagyunk a következők mellett:

* **A meglévő csomagjaink folyamatos karbantartása és fejlesztése**, biztosítva, hogy azok továbbra is megbízható eszközök maradjanak a fejlesztők számára világszerte.
* **A kritikus infrastrukturális projektekhez való hozzájárulásunk bővítése**, különösen az e-mail és a biztonsági területeken.
* **A Forward Email képességeinek fejlesztése**, miközben fenntartjuk az adatvédelem, a biztonság és az átláthatóság iránti elkötelezettségünket.
* **A nyílt forráskódú közreműködők következő generációjának támogatása** mentorálás, szponzorálás és közösségi szerepvállalás révén.

Hiszünk abban, hogy a szoftverfejlesztés jövője nyitott, együttműködésen alapuló, és a bizalom alapjain alapul. Reméljük, hogy továbbra is kiváló minőségű, biztonságra összpontosító csomagokkal járulunk hozzá a JavaScript ökoszisztémához, reméljük, hogy kis szerepet játszhatunk ennek a jövőnek a felépítésében.

Köszönjük mindenkinek, aki igénybe vette csomagjainkat, hozzájárult projektjeinkhez, problémákat jelentett, vagy egyszerűen csak hírt terjesztett munkánkról. Az Ön támogatása lehetővé tette ezt az évtizedes hatást, és izgatottan várjuk, hogy mit érhetünk el együtt a következő tíz évben.

\[^1]: npm letöltési statisztikák a cabinhoz, 2025. április
\[^2]: npm letöltési statisztikák a bson-objectidhoz, 2025. február-március
\[^3]: npm letöltési statisztikák az url-regex-safe-hez, 2025. április
\[^4]: GitHub csillagok száma a forwardemail/forwardemail.net-hez 2025. áprilisi állapot szerint
\[^5]: npm letöltési statisztikák a preview-emailhez, 2025. április
\[^7]: npm letöltési statisztikák a superagenthez, 2025. február-március
\[^8]: npm letöltési statisztikák a supertesthez, 2025. február-március
\[^9]: npm letöltési statisztikák a preview-emailhez, 2025. február-március
\[^10]: npm letöltési statisztikák a cabinhoz, 2025. február-március
\[^11]: npm letöltési statisztikák az url-regex-safe-hez, február-március 2025
\[^12]: npm letöltési statisztikák a spamscannerhez, 2025. február-március
\[^13]: Napi letöltési minták az npm statisztikákból, 2025. április
\[^14]: Heti letöltési minták az npm statisztikákból, 2025. április
\[^15]: npm letöltési statisztikák a nodemailerhez, 2025. április
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
\[^27]: Az Upptime repositoryban található GitHub problémák alapján
\[^28]: Az Upptime repositoryban található GitHub problémák alapján
\[^29]: Az Upptime repositoryban található GitHub problémák alapján
\[^30]: npm letöltési statisztikák a bree-hez, 2025. február-március
\[^31]: Az Upptime-hoz intézett GitHub pull requestek alapján
\[^32]: Az Upptime-hoz intézett GitHub pull requestek alapján
\[^34]: npm letöltési statisztikák a koa-hoz, február-március 2025
\[^35]: npm letöltési statisztikák a @koa/routerhez, 2025. február-március
\[^36]: npm letöltési statisztikák a koa-routerhez, 2025. február-március
\[^37]: npm letöltési statisztikák az url-regexhez, 2025. február-március
\[^38]: npm letöltési statisztikák a @breejs/laterhez, 2025. február-március
\[^39]: npm letöltési statisztikák az e-mail-sablonokhoz, 2025. február-március
\[^40]: npm letöltési statisztikák a get-paths-höz, 2025. február-március
\[^41]: npm letöltési statisztikák a dotenv-parse-variableshez, 2025. február-március
\[^42]: npm letöltési statisztikák a @koa/multerhez, 2025. február-március