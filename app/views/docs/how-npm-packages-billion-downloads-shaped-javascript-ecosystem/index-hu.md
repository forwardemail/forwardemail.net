# Egy évtizednyi hatás: Hogyan érték el npm csomagjaink az 1 milliárd letöltést és hogyan formálták a JavaScriptet {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="lekerekített-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Az úttörők, akik megbíznak bennünk: Isaac Z. Schlueter és a Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Az npm létrehozásától a Node.js vezetéséig](#from-npms-creation-to-nodejs-leadership)
* [A kód mögött álló építész: Nick Baugh utazása](#the-architect-behind-the-code-nick-baughs-journey)
  * [Expressz Műszaki Bizottság és alapvető hozzájárulások](#express-technical-committee-and-core-contributions)
  * [Koa Keretrendszer Hozzájárulások](#koa-framework-contributions)
  * [Egyéni közreműködőből szervezetvezetővé](#from-individual-contributor-to-organization-leader)
* [GitHub-szervezeteink: Az innováció ökoszisztémái](#our-github-organizations-ecosystems-of-innovation)
  * [Kabin: Strukturált naplózás modern alkalmazásokhoz](#cabin-structured-logging-for-modern-applications)
  * [Spamszkenner: Az e-mailes visszaélések elleni küzdelem](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern munkaütemezés munkaszálakkal](#bree-modern-job-scheduling-with-worker-threads)
  * [E-mail továbbítása: Nyílt forráskódú e-mail infrastruktúra](#forward-email-open-source-email-infrastructure)
  * [Lad: Alapvető Koa segédprogramok és eszközök](#lad-essential-koa-utilities-and-tools)
  * [Uptime: Nyílt forráskódú üzemidő-figyelés](#upptime-open-source-uptime-monitoring)
* [Hozzájárulásunk az e-mail továbbítási ökoszisztémához](#our-contributions-to-the-forward-email-ecosystem)
  * [A csomagoktól a gyártásig](#from-packages-to-production)
  * [A visszacsatolási hurok](#the-feedback-loop)
* [A Forward Email alapelvei: A kiválóság alapjai](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Mindig fejlesztőbarát, biztonságközpontú és átlátható](#always-developer-friendly-security-focused-and-transparent)
  * [Idővel bevált szoftverfejlesztési alapelvek betartása](#adherence-to-time-tested-software-development-principles)
  * [A Scrappy, Bootstrapped fejlesztők megcélzása](#targeting-the-scrappy-bootstrapped-developer)
  * [Gyakorlati alapelvek: Az e-mail továbbítási kódbázisa](#principles-in-practice-the-forward-email-codebase)
  * [Beépített adatvédelem](#privacy-by-design)
  * [Fenntartható nyílt forráskódú](#sustainable-open-source)
* [A számok nem hazudnak: Megdöbbentő npm letöltési statisztikáink](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Madártávlatból a hatásunk](#a-birds-eye-view-of-our-impact)
  * [Napi hatás nagy léptékben](#daily-impact-at-scale)
  * [A nyers számokon túl](#beyond-the-raw-numbers)
* [Az ökoszisztéma támogatása: Nyílt forráskódú szoftverek támogatása](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Az e-mail infrastruktúra úttörője](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Biztonsági sebezhetőségek feltárása a JavaScript ökoszisztémában](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [A Koa-Router megmentése](#the-koa-router-rescue)
  * [ReDoS sebezhetőségek kezelése](#addressing-redos-vulnerabilities)
  * [A Node.js és a Chromium biztonságának támogatása](#advocating-for-nodejs-and-chromium-security)
  * [Az npm infrastruktúra biztosítása](#securing-npm-infrastructure)
* [Hozzájárulásunk az e-mail továbbítási ökoszisztémához](#our-contributions-to-the-forward-email-ecosystem-1)
  * [A Nodemailer alapvető funkcióinak fejlesztése](#enhancing-nodemailers-core-functionality)
  * [E-mail hitelesítés fejlesztése a Mailauth segítségével](#advancing-email-authentication-with-mailauth)
  * [Főbb üzemidő-fejlesztések](#key-upptime-enhancements)
* [Az összetartó erő: Egyedi kód nagy léptékben](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Hatalmas fejlesztési erőfeszítés](#a-massive-development-effort)
  * [Alapvető függőségek integrációja](#core-dependencies-integration)
  * [DNS infrastruktúra Tangerine és mx-connect segítségével](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Vállalati hatás: A nyílt forráskódú megoldásoktól a kritikus fontosságú megoldásokig](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Esettanulmányok a kritikus fontosságú e-mail infrastruktúrában](#case-studies-in-mission-critical-email-infrastructure)
* [Egy évtizednyi nyílt forráskód: Előretekintés](#a-decade-of-open-source-looking-forward)

## Előszó {#foreword}

A [JavaScript](https://en.wikipedia.org/wiki/JavaScript) és [Node.js](https://en.wikipedia.org/wiki/Node.js) világában egyes csomagok elengedhetetlenek – naponta milliószor töltik le őket, és világszerte alkalmazásokat működtetnek. Ezen eszközök mögött olyan fejlesztők állnak, akik a nyílt forráskódú minőségre összpontosítanak. Ma bemutatjuk, hogyan segít csapatunk olyan npm csomagok létrehozásában és karbantartásában, amelyek a JavaScript ökoszisztéma kulcsfontosságú részévé váltak.

## Az úttörők, akik megbíznak bennünk: Isaac Z. Schlueter és az e-mail továbbítása {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Büszkék vagyunk arra, hogy [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) felhasználónk van. Isaac létrehozta a [npm](https://en.wikipedia.org/wiki/Npm_\(software\)-t és segített a [Node.js](https://en.wikipedia.org/wiki/Node.js) felépítésében. A Forward Emailbe vetett bizalma mutatja a minőségre és a biztonságra való összpontosításunkat. Isaac több domainhez is használja a Forward Emailt, beleértve az izs.me-t is.

Isaac hatása a JavaScriptre óriási. 2009-ben ő volt az elsők között, akik felismerték a Node.js lehetőségeit, a platformot létrehozó [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl)-val együttműködve. Ahogy Isaac egy [interjú az Increment magazinnak](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-ben mondta: „Ebben a nagyon kis közösségben, amely azon gondolkodott, hogyan lehetne megvalósítani a szerveroldali JS-t, Ryan Dahl előállt a Node-dal, ami egyértelműen a helyes megközelítés volt. Én is belevágtam, és 2009 közepén kezdtem el igazán foglalkozni vele.”

> \[!NOTE]
> A Node.js története iránt érdeklődők számára kiváló dokumentumfilmek állnak rendelkezésre, amelyek krónikát készítenek a fejlesztéséről, beleértve a [A Node.js története](https://www.youtube.com/watch?v=LB8KwiiUGy0) és a [10 dolog, amit megbántam a Node.js-szel kapcsolatban - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I) címűeket. Ryan Dahl [személyes weboldal](https://tinyclouds.org/) című dokumentumfilmje is értékes betekintést nyújt a munkájába.

### Az npm létrehozásától a Node.js vezetéséig {#from-npms-creation-to-nodejs-leadership}

Isaac 2009 szeptemberében alkotta meg az npm-et, az első használható verzió 2010 elején jelent meg. Ez a csomagkezelő kulcsfontosságú igényt elégített ki a Node.js-ben, lehetővé téve a fejlesztők számára a kód egyszerű megosztását és újrafelhasználását. A [Node.js Wikipédia oldal](https://en.wikipedia.org/wiki/Node.js) szerint: „2010 januárjában bevezették a Node.js környezethez az npm nevű csomagkezelőt. A csomagkezelő lehetővé teszi a programozók számára a Node.js csomagok közzétételét és megosztását a hozzájuk tartozó forráskóddal együtt, és a csomagok telepítésének, frissítésének és eltávolításának egyszerűsítésére szolgál.”

Amikor Ryan Dahl 2012 januárjában visszalépett a Node.js-től, Isaac vette át a projektvezetői posztot. Ahogy a [az összefoglalója](https://izs.me/resume) oldalon is megjegyezték, „számos alapvető Node.js API fejlesztését vezette, beleértve a CommonJS modulrendszert, a fájlrendszer API-kat és a streameket”, és „két évig a projekt BDFL-jeként (Benevolent Dictator For Life) tevékenykedett, biztosítva a Node.js v0.6-tól v0.10-ig terjedő verzióinak folyamatosan növekvő minőségét és megbízható build folyamatát”.

Isaac egy kulcsfontosságú növekedési időszakon vezette át a Node.js-t, olyan szabványokat teremtve, amelyek a mai napig alakítják a platformot. Később, 2014-ben megalapította az npm, Inc.-t, hogy támogassa az npm nyilvántartást, amelyet korábban önállóan üzemeltetett.

Köszönjük Isaacnek a JavaScripthez való hatalmas hozzájárulását, és továbbra is használjuk az általa létrehozott számos csomagot. Munkássága megváltoztatta a szoftverfejlesztés módját és azt, hogy hogyan osztják meg a kódot fejlesztők milliói világszerte.

## A kód mögött álló építész: Nick Baugh utazása {#the-architect-behind-the-code-nick-baughs-journey}

Nyílt forráskódú sikereink középpontjában Nick Baugh, a Forward Email alapítója és tulajdonosa áll. JavaScript-tel kapcsolatos munkássága közel 20 évet ölel fel, és számtalan fejlesztő alkalmazásfejlesztési módszereit formálta. Nyílt forráskódú projektjei során szerzett tapasztalatai mind a technikai szakértelmet, mind a közösségi vezetői képességeket mutatják.

### Expressz Műszaki Bizottság és Alapvető Hozzájárulások {#express-technical-committee-and-core-contributions}

Nick webes keretrendszerekkel kapcsolatos szakértelme helyet szerzett neki a [Expressz Műszaki Bizottság](https://expressjs.com/en/resources/community.html) oldalon, ahol az egyik leggyakrabban használt Node.js keretrendszerrel segített. Nick jelenleg inaktív tagként szerepel a [Express közösségi oldal](https://expressjs.com/en/resources/community.html) oldalon.

> \[!IMPORTANT]
> Az Express-t eredetileg TJ Holowaychuk készítette, aki egy termékeny nyílt forráskódú közreműködő, és a Node.js ökoszisztéma nagy részét formálta. Hálásak vagyunk TJ alapvető munkájáért, és tiszteletben tartjuk [döntés a szünetről](https://news.ycombinator.com/item?id=37687017)-ként nyújtott hozzájárulását a nyílt forráskódú projektekhez.

A [Expressz Műszaki Bizottság](https://expressjs.com/en/resources/community.html) tagjaként Nick nagy figyelmet fordított a részletekre olyan problémákban, mint a `req.originalUrl` dokumentációjának tisztázása és a többrészes űrlapkezelési problémák megoldása.

### Koa keretrendszer hozzájárulásai {#koa-framework-contributions}

Nick munkája a [Koa keretrendszer](https://github.com/koajs/koa)-val – egy modern, könnyebb alternatívával az Expresshez, amelyet szintén TJ Holowaychuk készített – tovább mutatja elkötelezettségét a jobb webfejlesztő eszközök iránt. Koa-hozzájárulásai kiterjednek mind a problémákra, mind a kódra a pull requesteken keresztül, a hibakezelés, a tartalomtípus-kezelés és a dokumentáció fejlesztésének megoldására.

Az Express és a Koa platformokon végzett munkája egyedi rálátást biztosít számára a Node.js webfejlesztésre, segítve csapatunkat olyan csomagok létrehozásában, amelyek jól működnek több keretrendszer-ökoszisztémával.

### Egyéni közreműködőtől szervezetvezetővé {#from-individual-contributor-to-organization-leader}

Ami a meglévő projektek segítésével indult, az teljes csomag-ökoszisztémák létrehozásává és karbantartásává nőtte ki magát. Nick több GitHub szervezetet is alapított – köztük a [Kabin](https://github.com/cabinjs), [Spamkereső](https://github.com/spamscanner), [E-mail továbbítása](https://github.com/forwardemail), [Fiú](https://github.com/ladjs) és [Bree](https://github.com/breejs) szervezeteket –, amelyek mindegyike a JavaScript közösség speciális igényeit elégítette ki.

Ez a váltás a közreműködőből a vezetővé Nick vízióját mutatja a jól megtervezett, valós problémákat megoldó szoftverekről. Azzal, hogy a kapcsolódó csomagokat fókuszált GitHub szervezetek alá szervezte, olyan eszköz-ökoszisztémákat épített ki, amelyek együttműködnek, miközben modulárisak és rugalmasak maradnak a szélesebb fejlesztői közösség számára.

## GitHub-szervezeteink: Az innováció ökoszisztémái {#our-github-organizations-ecosystems-of-innovation}

Nyílt forráskódú munkánkat GitHub-szervezetekre szervezzük, amelyek mindegyike a JavaScript specifikus igényeit elégíti ki. Ez a struktúra összetartó csomagcsaládokat hoz létre, amelyek jól működnek együtt, miközben modulárisak maradnak.

### Kabin: Strukturált naplózás modern alkalmazásokhoz {#cabin-structured-logging-for-modern-applications}

A [Kabinszervezés](https://github.com/cabinjs) a mi megközelítésünk az egyszerű, hatékony alkalmazásnaplózáshoz. A fő [`cabin`](https://github.com/cabinjs/cabin) csomag közel 900 GitHub-csillaggal és több mint 100 000 heti letöltéssel rendelkezik\[^1]. A Cabin strukturált naplózást biztosít, amely olyan népszerű szolgáltatásokkal működik, mint a Sentry, a LogDNA és a Papertrail.

A Cabin különlegességét az átgondolt API és bővítményrendszere adja. Az olyan csomagok támogatása, mint a [`axe`](https://github.com/cabinjs/axe) az Express middleware-hez és a [`parse-request`](https://github.com/cabinjs/parse-request) a HTTP kérések elemzéséhez, jól mutatja elkötelezettségünket a komplett megoldások, nem pedig az elszigetelt eszközök iránt.

A [`bson-objectid`](https://github.com/cabinjs/bson-objectid) csomag külön említést érdemel, több mint 1,7 millió letöltéssel mindössze két hónap alatt\[^2]. Ez a könnyű MongoDB ObjectID implementáció a teljes MongoDB függőségek nélküli azonosítókra szoruló fejlesztők kedvencévé vált.

### Spamszkenner: Az e-mailes visszaélések elleni küzdelem {#spam-scanner-fighting-email-abuse}

A [Spamszkenner szervezet](https://github.com/spamscanner) a valós problémák megoldása iránti elkötelezettségünket mutatja. A fő [`spamscanner`](https://github.com/spamscanner/spamscanner) csomag fejlett e-mail spamészlelést biztosít, de a [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) csomag az, amelyik hihetetlenül népszerű.

Több mint 1,2 millió letöltéssel két hónap alatt\[^3], a `url-regex-safe` kritikus biztonsági problémákat javít más URL-észlelő reguláris kifejezésekben. Ez a csomag bemutatja a nyílt forráskódú szoftverekhez való hozzáállásunkat: egy gyakori probléma (jelen esetben a [RedoS](https://en.wikipedia.org/wiki/ReDoS) URL-érvényesítési sebezhetőségeinek) megtalálása, egy szilárd megoldás létrehozása és gondos karbantartása.

### Bree: Modern feladatütemezés munkaszálakkal {#bree-modern-job-scheduling-with-worker-threads}

A [Bree szervezet](https://github.com/breejs) a válaszunk egy gyakori Node.js kihívásra: a megbízható feladatütemezésre. A fő [`bree`](https://github.com/breejs/bree) csomag, több mint 3100 GitHub csillaggal, egy modern feladatütemezőt biztosít, amely Node.js munkaszálakat használ a jobb teljesítmény és megbízhatóság érdekében.

> \[!NOTE]
> A Bree-t azután hoztuk létre, hogy segítettünk a [Napirend](https://github.com/agenda/agenda) karbantartásában, és a tanulságokat felhasználva jobb feladatütemezőt hoztunk létre. A napirendhez való hozzájárulásaink segítettek megtalálni a módját a feladatütemezés javításának.

Mi különbözteti a Bree-t más ütemezőktől, mint például az Agenda:

* **Nincsenek külső függőségek**: Az Agendával ellentétben, amely MongoDB-t igényel, a Bree nem igényel Redis-t vagy MongoDB-t a feladatok állapotának kezeléséhez.
* **Munkaszálak**: A Bree Node.js munkaszálakat használ a sandboxos folyamatokhoz, ami jobb izolációt és teljesítményt biztosít.
* **Egyszerű API**: A Bree részletes vezérlést kínál egyszerűséggel, megkönnyítve az összetett ütemezési igények megvalósítását.
* **Beépített támogatás**: Az olyan dolgok, mint a kecses újratöltés, a cron feladatok, a dátumok és az emberbarát időpontok alapértelmezés szerint benne vannak.

A Bree a [forwardemail.net](https://github.com/forwardemail/forwardemail.net) kulcsfontosságú része, olyan kritikus háttérfeladatokat kezel, mint az e-mailek feldolgozása, a tisztítás és az ütemezett karbantartás. A Bree használata a Forward Emailben azt mutatja, hogy elkötelezettek vagyunk a saját eszközeink éles környezetben való használata iránt, biztosítva, hogy azok megfeleljenek a magas megbízhatósági szabványoknak.

Más nagyszerű munkaszál-csomagokat is használunk és nagyra értékelünk, mint például a [medence](https://github.com/piscinajs/piscina), és HTTP-klienseket, mint például a [tizenegy](https://github.com/nodejs/undici). Piscina, Bree-hez hasonlóan, Node.js munkaszálakat használ a hatékony feladatfeldolgozáshoz. Köszönetet mondunk [Máté-domb](https://github.com/mcollina)-nek, aki az undici és a piscina karbantartója, a Node.js-hez való jelentős hozzájárulásáért. Matteo a Node.js Műszaki Irányító Bizottságának tagja, és jelentősen javította a Node.js HTTP-kliens képességeit.

### E-mail továbbítása: Nyílt forráskódú e-mail infrastruktúra {#forward-email-open-source-email-infrastructure}

Legambiciózusabb projektünk a [E-mail továbbítása](https://github.com/forwardemail), egy nyílt forráskódú e-mail szolgáltatás, amely e-mail továbbítást, tárolást és API szolgáltatásokat kínál. A fő adattár több mint 1100 GitHub csillaggal rendelkezik\[^4], ami azt mutatja, hogy a közösség nagyra értékeli ezt az alternatívát a zárt e-mail szolgáltatásokkal szemben.

A szervezet [`preview-email`](https://github.com/forwardemail/preview-email) csomagja, amely két hónap alatt több mint 2,5 millió letöltést ért el\[^5], nélkülözhetetlen eszközzé vált az e-mail sablonokkal dolgozó fejlesztők számára. Azzal, hogy egyszerű módot biztosít az e-mailek előnézetére a fejlesztés során, megold egy gyakori problémát az e-mail-alapú alkalmazások fejlesztése során.

### Lad: Alapvető Koa segédprogramok és eszközök {#lad-essential-koa-utilities-and-tools}

A [Legényszervezet](https://github.com/ladjs) alapvető segédprogramok és eszközök gyűjteményét kínálja, amelyek elsősorban a Koa keretrendszer ökoszisztémájának fejlesztésére összpontosítanak. Ezek a csomagok a webfejlesztés gyakori kihívásait oldják meg, és úgy lettek kialakítva, hogy zökkenőmentesen működjenek együtt, miközben önállóan is hasznosak maradnak.

#### koa-better-error-handler: Továbbfejlesztett hibakezelés a Koa {#koa-better-error-handler-improved-error-handling-for-koa}} számára

A [`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) jobb hibakezelési megoldást kínál a Koa alkalmazásokhoz. Több mint 50 GitHub-csillaggal rendelkező csomag, amely lehetővé teszi a `ctx.throw` számára, hogy felhasználóbarát hibaüzeneteket generáljon, miközben a Koa beépített hibakezelőjének számos korlátját orvosolja:

* Észleli és megfelelően kezeli a Node.js DNS-hibákat, Mongoose-hibákat és Redis-hibákat.
* A [Fellendülés](https://github.com/hapijs/boom) függvényt használja a konzisztens, jól formázott hibaválaszok létrehozásához.
* Megőrzi a fejléceket (ellentétben a Koa beépített kezelőjével).
* Megfelelő állapotkódokat tart fenn az alapértelmezett 500 helyett.
* Támogatja a flash üzeneteket és a munkamenet-megőrzést.
* HTML hibalistákat biztosít az érvényesítési hibákhoz.
* Több választípust támogat (HTML, JSON és sima szöveg).

Ez a csomag különösen értékes, ha a [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) csomaggal együtt használják a Koa alkalmazások átfogó hibakezeléséhez.

#### útlevél: {#passport-authentication-for-lad} férfi hitelesítése

A [`@ladjs/passport`](https://github.com/ladjs/passport) a népszerű Passport.js hitelesítési köztes réteget bővíti ki a modern webes alkalmazásokhoz készült speciális fejlesztésekkel. Ez a csomag alapból több hitelesítési stratégiát is támogat:

* Helyi hitelesítés e-mail címmel
* Bejelentkezés Apple-lel
* GitHub hitelesítés
* Google hitelesítés
* Egyszer használatos jelszó (OTP) hitelesítés

A csomag nagymértékben testreszabható, lehetővé téve a fejlesztők számára, hogy a mezőneveket és kifejezéseket az alkalmazásuk követelményeihez igazítsák. Úgy tervezték, hogy zökkenőmentesen integrálható a Mongoose-zal a felhasználókezelés érdekében, így ideális megoldást jelent a robusztus hitelesítést igénylő Koa-alapú alkalmazások számára.

#### kecses: Elegáns alkalmazásleállítás {#graceful-elegant-application-shutdown}

A [`@ladjs/graceful`](https://github.com/ladjs/graceful) megoldja a Node.js alkalmazások szabályos leállításának kritikus kihívását. Több mint 70 GitHub-csillaggal ez a csomag biztosítja, hogy az alkalmazás zökkenőmentesen leállhasson adatvesztés vagy kapcsolatok lefagyása nélkül. Főbb jellemzők:

* HTTP szerverek szabályos lezárásának támogatása (Express/Koa/Fastify)
* Adatbázis-kapcsolatok tiszta leállítása (MongoDB/Mongoose)
* Redis kliensek megfelelő lezárása
* Bree job ütemezők kezelése
* Egyéni leállításkezelők támogatása
* Konfigurálható időtúllépési beállítások
* Integráció naplózó rendszerekkel

Ez a csomag elengedhetetlen az éles alkalmazásokhoz, ahol a váratlan leállások adatvesztéshez vagy -sérüléshez vezethetnek. A megfelelő leállítási eljárások megvalósításával a `@ladjs/graceful` segít biztosítani az alkalmazás megbízhatóságát és stabilitását.

### Uptime: Nyílt forráskódú üzemidő-figyelés {#upptime-open-source-uptime-monitoring}

A [Üzemidő-szervezés](https://github.com/upptime) az átlátható, nyílt forráskódú monitorozás iránti elkötelezettségünket jelképezi. A fő [`upptime`](https://github.com/upptime/upptime) adattár több mint 13 000 GitHub-csillaggal rendelkezik, így ez az egyik legnépszerűbb projekt, amelyhez hozzájárulunk. Az Upptime egy GitHub-alapú üzemidő-monitort és állapotoldalt biztosít, amely teljes mértékben szerver nélkül működik.

Az Upptime-ot használjuk a saját állapotoldalunkhoz a <https://status.forwardemail.net> címen, a forráskód pedig a <https://github.com/forwardemail/status.forwardemail.net>. címen érhető el.

Az Upptime különlegességét az architektúrája adja:

* **100%-ban nyílt forráskódú**: Minden komponens teljesen nyílt forráskódú és testreszabható.
* **GitHub-alapú**: A GitHub Actions, Issues és Pages funkcióit használja ki egy szerver nélküli monitorozási megoldáshoz.
* **Nincs szükség szerverre**: A hagyományos monitorozó eszközökkel ellentétben az Upptime nem igényli szerver futtatását vagy karbantartását.
* **Automatikus állapotoldal**: Egy gyönyörű állapotoldalt generál, amely a GitHub Pages-en tárolható.
* **Hatékony értesítések**: Különböző értesítési csatornákkal integrálható, beleértve az e-mailt, az SMS-t és a Slacket.

A felhasználói élmény javítása érdekében integráltuk a [@octokit/core](https://github.com/octokit/core.js/) kódot a forwardemail.net kódbázisába, hogy valós idejű állapotfrissítéseket és incidenseket jelenítsen meg közvetlenül a weboldalunkon. Ez az integráció egyértelmű átláthatóságot biztosít felhasználóink számára a teljes rendszerünkben (weboldal, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree stb.) felmerülő problémák esetén azonnali értesítésekkel, jelvényikon-változásokkal, figyelmeztető színekkel és egyebekkel.

Az @octokit/core könyvtár lehetővé teszi számunkra, hogy valós idejű adatokat kérjünk le az Upptime GitHub adattárunkból, feldolgozzuk és felhasználóbarát módon megjelenítsük azokat. Ha bármely szolgáltatásban kiesés vagy teljesítménycsökkenés tapasztalható, a felhasználók azonnal értesítést kapnak vizuális jelzőkön keresztül anélkül, hogy el kellene hagyniuk a fő alkalmazást. Ez a zökkenőmentes integráció biztosítja, hogy felhasználóink mindig naprakész információkkal rendelkezzenek a rendszer állapotáról, növelve az átláthatóságot és a bizalmat.

Az Upptime-ot több száz szervezet alkalmazta már, amelyek átlátható és megbízható módot keresnek szolgáltatásaik monitorozására és állapotuk felhasználókkal való kommunikációjára. A projekt sikere jól mutatja az olyan eszközök építésének erejét, amelyek a meglévő infrastruktúrát (ebben az esetben a GitHubot) kihasználva új módon oldják meg a gyakori problémákat.

## Hozzájárulásunk az e-mail-továbbítási ökoszisztémához {#our-contributions-to-the-forward-email-ecosystem}

Bár nyílt forráskódú csomagjainkat világszerte használják a fejlesztők, ezek képezik saját e-mail továbbítási szolgáltatásunk alapját is. Ez a kettős szerep – mint ezen eszközök létrehozói és felhasználói is – egyedi perspektívát biztosít számunkra a valós alkalmazásokra, és folyamatos fejlesztést ösztönöz.

### Csomagokból az éles környezetbe {#from-packages-to-production}

Az egyes csomagoktól az egységes termelési rendszerig vezető út gondos integrációt és bővítést igényel. A Forward Email esetében ez a folyamat a következőket foglalja magában:

* **Egyéni kiterjesztések**: Forward Email-specifikus kiterjesztések fejlesztése nyílt forráskódú csomagjainkhoz, amelyek megfelelnek egyedi igényeinknek.
* **Integrációs minták**: Minták kidolgozása arra vonatkozóan, hogy ezek a csomagok hogyan működnek együtt éles környezetben.
* **Teljesítményoptimalizálás**: Azonosítjuk és kijavítjuk azokat a teljesítménybeli szűk keresztmetszeteket, amelyek csak nagy léptékben jelentkeznek.
* **Biztonsági szigorítás**: További biztonsági rétegek hozzáadása az e-mail-kezeléshez és a felhasználói adatok védelméhez.

Ez a munka több ezer órányi fejlesztést jelent magukon az alapcsomagokon túl, aminek eredményeként egy robusztus, biztonságos e-mail szolgáltatás jött létre, amely kihasználja a nyílt forráskódú hozzájárulásaink legjavát.

### A visszacsatolási hurok {#the-feedback-loop}

A saját csomagjaink éles környezetben való használatának talán legértékesebb aspektusa a létrehozott visszacsatolási hurok. Amikor korlátozásokkal vagy szélsőséges esetekkel találkozunk a Forward Email szolgáltatásban, nem csak helyben javítjuk azokat – fejlesztjük az alapul szolgáló csomagokat, ami mind a szolgáltatásunk, mind a tágabb közösség számára előnyös.

Ez a megközelítés számos fejlesztést eredményezett:

* **A Bree szabályos leállítása**: A Forward Email nulla állásidejű telepítésekre való igénye a Bree szabályos leállítási képességeinek továbbfejlesztéséhez vezetett.
* **A Spam Scanner mintázatfelismerése**: A Forward Emailben talált valós spam minták befolyásolták a Spam Scanner észlelési algoritmusait.
* **A Cabin teljesítményoptimalizálása**: A nagy volumenű naplózás éles környezetben optimalizálási lehetőségeket tárt fel a Cabinban, amelyek minden felhasználó számára előnyösek.

Azzal, hogy fenntartjuk ezt az erényes ciklust a nyílt forráskódú munkánk és az éles szolgáltatásunk között, biztosítjuk, hogy csomagjaink továbbra is praktikus, harcban tesztelt megoldások maradjanak, ne pedig elméleti megvalósítások.

## Az e-mailek továbbításának alapelvei: A kiválóság alapja {#forward-emails-core-principles-a-foundation-for-excellence}

Az e-mail továbbítását egy sor alapelv alapján terveztük, amelyek minden fejlesztési döntésünket irányítják. Ezek az alapelvek, amelyeket a [weboldal](/blog/docs/best-quantum-safe-encrypted-email-service#principles) oldalon részletezünk, biztosítják, hogy szolgáltatásunk fejlesztőbarát, biztonságos és a felhasználók adatainak védelmére összpontosítson.

### Mindig fejlesztőbarát, biztonságközpontú és átlátható {#always-developer-friendly-security-focused-and-transparent}

Elsődleges alapelvünk, hogy fejlesztőbarát szoftvereket hozzunk létre, miközben fenntartjuk a legmagasabb biztonsági és adatvédelmi szabványokat. Hisszük, hogy a technikai kiválóság soha nem mehet a használhatóság rovására, és hogy az átláthatóság bizalmat épít közösségünkben.

Ez az elv részletes dokumentációnkban, egyértelmű hibaüzeneteinkben és a sikerekről és a kihívásokról szóló nyílt kommunikációban is megmutatkozik. Azzal, hogy teljes kódbázisunkat nyílt forráskódúvá tesszük, ösztönözzük az ellenőrzést és az együttműködést, erősítve mind a szoftverünket, mind a tágabb ökoszisztémát.

### Idővel bevált szoftverfejlesztési alapelvek betartása {#adherence-to-time-tested-software-development-principles}

Számos bevett szoftverfejlesztési elvet követünk, amelyek évtizedek óta bizonyítják értéküket:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: A problémák elkülönítése a Model-View-Controller mintán keresztül
* **[Unix filozófia](https://en.wikipedia.org/wiki/Unix_philosophy)**: Moduláris komponensek létrehozása, amelyek egy dolgot csinálnak jól
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Egyszerűség és egyértelműség megőrzése
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Ne ismételd magad, a kód újrafelhasználásának elősegítése
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nem lesz rá szükséged, a korai optimalizálás elkerülése
* **[Tizenkét tényező](https://12factor.net/)**: A modern, skálázható alkalmazások építésének legjobb gyakorlatainak követése
* **[Occam borotvája](https://en.wikipedia.org/wiki/Occam%27s_razor)**: A követelményeknek megfelelő legegyszerűbb megoldás kiválasztása
* **[Dogfood-tesztelés](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Saját termékeink széles körű használata

Ezek az alapelvek nem csupán elméleti fogalmak – beépültek a mindennapi fejlesztési gyakorlatunkba. Például az Unix filozófiához való ragaszkodásunk nyilvánvaló az npm csomagjaink strukturálásában: kicsi, fókuszált modulok, amelyekből összetett problémákat lehet összeállítani.

### Célközönség a kapkodó, rendszerhibás fejlesztők {#targeting-the-scrappy-bootstrapped-developer}

Kifejezetten a kapkodó, kényszerű, és IDEIGLENÜLI fejlesztőket célozzuk meg. Ez a fókusz mindent meghatároz az árazási modellünktől kezdve a technikai döntéseinkig. Megértjük a korlátozott erőforrásokkal történő termékfejlesztés kihívásait, mert mi magunk is átéltük ezt a problémát.

Ez az elv különösen fontos a nyílt forráskódú szoftverekhez való hozzáállásunkban. Olyan csomagokat hozunk létre és tartunk karban, amelyek valós problémákat oldanak meg a fejlesztők számára vállalati költségvetés nélkül, így hatékony eszközöket teszünk elérhetővé mindenki számára, függetlenül az erőforrásaitól.

### Gyakorlati alapelvek: Az e-mail továbbítási kódbázisa {#principles-in-practice-the-forward-email-codebase}

Ezek az alapelvek világosan láthatók a Forward Email kódbázisban. A package.json fájlunk a függőségek átgondolt kiválasztását mutatja be, amelyeket úgy választottunk ki, hogy összhangban legyenek alapvető értékeinkkel:

* Biztonságra fókuszáló csomagok, mint például a `mailauth` az e-mail hitelesítéshez
* Fejlesztőbarát eszközök, mint például a `preview-email` az egyszerűbb hibakereséshez
* Moduláris komponensek, mint például a Sindre Sorhus különféle `p-*` segédprogramjai

Azáltal, hogy ezeket az elveket következetesen követtük, olyan szolgáltatást építettünk, amelyben a fejlesztők megbízhatnak az e-mail infrastruktúrájukkal kapcsolatban – biztonságos, megbízható és összhangban van a nyílt forráskódú közösség értékeivel.

### Beépített adatvédelem {#privacy-by-design}

Az adatvédelem nem utólagos szempont vagy marketingfunkció a Forward Email esetében – ez egy alapvető tervezési elv, amely szolgáltatásunk és kódunk minden aspektusát meghatározza:

* **Nulla hozzáférésű titkosítás**: Olyan rendszereket vezettünk be, amelyek technikailag lehetetlenné teszik számunkra a felhasználók e-mailjeinek elolvasását.
* **Minimális adatgyűjtés**: Csak a szolgáltatásunk nyújtásához szükséges adatokat gyűjtjük, semmi többet.
* **Átlátható szabályzatok**: Adatvédelmi szabályzatunk világos, érthető nyelven íródott, jogi zsargon nélkül.
* **Nyílt forráskódú ellenőrzés**: Nyílt forráskódú kódbázisunk lehetővé teszi a biztonsági kutatók számára, hogy ellenőrizzék adatvédelmi állításainkat.

Ez az elkötelezettség kiterjed nyílt forráskódú csomagjainkra is, amelyeket a kezdetektől fogva beépített biztonsági és adatvédelmi legjobb gyakorlatokkal terveztünk.

### Fenntartható nyílt forráskódú {#sustainable-open-source}

Úgy gondoljuk, hogy a nyílt forráskódú szoftvereknek fenntartható modellekre van szükségük a hosszú távú virágzáshoz. Megközelítésünk a következőket foglalja magában:

* **Kereskedelmi támogatás**: Prémium támogatást és szolgáltatásokat kínálunk nyílt forráskódú eszközeinkhez.
* **Kiegyensúlyozott licencelés**: Olyan licencek használata, amelyek védik mind a felhasználói szabadságjogokat, mind a projekt fenntarthatóságát.
* **Közösségi szerepvállalás**: Aktív együttműködés a közreműködőkkel egy támogató közösség kiépítése érdekében.
* **Átlátható ütemtervek**: Fejlesztési terveink megosztása, hogy a felhasználók ennek megfelelően tervezhessenek.

A fenntarthatóságra összpontosítva biztosítjuk, hogy nyílt forráskódú hozzájárulásaink idővel folyamatosan növekedhessenek és fejlődhessenek, ahelyett, hogy elhanyagolnák őket.

## A számok nem hazudnak: Megdöbbentő npm-es statisztikáink letöltése {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Amikor a nyílt forráskódú szoftverek hatásáról beszélünk, a letöltési statisztikák kézzelfogható mérőszámot adnak az elfogadásról és a bizalomról. Sok olyan csomag, amelynek karbantartásában segédkezünk, olyan méretet ért el, amelyet kevés nyílt forráskódú projekt ér el, az összesített letöltések száma milliárdokban mérhető.

![Legnépszerűbb npm csomagok letöltések szerint](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Bár büszkék vagyunk arra, hogy számos, nagy számban letöltött csomagot tudunk karbantartani a JavaScript ökoszisztémában, szeretnénk elismerni, hogy ezek közül a csomagok közül sokat eredetileg más tehetséges fejlesztők készítettek. Az olyan csomagokat, mint a superagent és a supertest, eredetileg TJ Holowaychuk készítette, akinek a nyílt forráskódú projektekhez való hozzájárulása jelentős szerepet játszott a Node.js ökoszisztéma alakításában.

### Madártávlatból a hatásunk {#a-birds-eye-view-of-our-impact}

Mindössze a 2025 februárja és márciusa közötti két hónapos időszakban a legfontosabb csomagok, amelyekhez hozzájárulunk és amelyek fenntartásában segítünk, elképesztő letöltési számokat értek el:

* **[szuperügynök](https://www.npmjs.com/package/superagent)**: 84 575 829 letöltés\[^7] (eredetileg TJ Holowaychuk készítette)
* **[szuperteszt](https://www.npmjs.com/package/supertest)**: 76 432 591 letöltés\[^8] (eredetileg TJ Holowaychuk készítette)
* **[is](https://www.npmjs.com/package/koa)**: 28 539 295 letöltés\[^34] (eredetileg TJ Holowaychuk készítette)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 letöltés\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 letöltés\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 letöltés\[^37]
* **[előnézeti e-mail](https://www.npmjs.com/package/preview-email)**: 2 500 000 letöltések\[^9]
* **[kabin](https://www.npmjs.com/package/cabin)**: 1 800 000 letöltés\[^10]
* **[@breejs/később](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 letöltés\[^38]
* **[e-mail-sablonok](https://www.npmjs.com/package/email-templates)**: 1 128 139 letöltés\[^39]
* **__PROTECTED_LINK_259__0**: 1 124 686 letöltés\[^40]
* **__PROTECTED_LINK_259__1**: 1 200 000 letöltés\[^11]
* **__PROTECTED_LINK_259__2**: 894 666 letöltés\[^41]
* **__PROTECTED_LINK_259__3**: 839 585 letöltés\[^42]
* **__PROTECTED_LINK_259__4**: 145 000 letöltések\[^12]
* **IDEIGLEN_PLACE_HOLDER_15**: 24 270 letöltés\[^30]

> \[!NOTE]
> Számos más csomag, amelynek karbantartásában segédkezünk, de nem mi hoztuk létre, még magasabb letöltési számmal rendelkezik, beleértve a `form-data`-et (738 millió+ letöltés), a `toidentifier`-t (309 millió+ letöltés), a `stackframe`-at (116 millió+ letöltés) és a `error-stack-parser`-et (113 millió+ letöltés). Megtiszteltetés számunkra, hogy hozzájárulhatunk ezekhez a csomagokhoz, miközben tiszteletben tartjuk eredeti szerzőik munkáját.

Ezek nem csupán lenyűgöző számok – valódi fejlesztőket képviselnek, akik valódi problémákat oldanak meg olyan kóddal, amelynek karbantartásában mi is segédkezünk. Minden letöltés egy példa arra, hogy ezek a csomagok segítettek valakinek valami értelmeset létrehozni, a hobbiprojektektől kezdve a milliók által használt vállalati alkalmazásokig.

![Csomag kategóriák forgalmazása](/img/art/category_pie_chart.svg)

### Napi hatás nagy léptékben {#daily-impact-at-scale}

A napi letöltési minták következetes, nagy volumenű használatot mutatnak, a csúcsok elérik a napi több millió letöltést\[^13]. Ez az állandóság a csomagok stabilitására és megbízhatóságára utal – a fejlesztők nem csak kipróbálják őket, hanem integrálják az alapvető munkafolyamataikba, és nap mint nap támaszkodnak rájuk.

A heti letöltési minták még lenyűgözőbb számokat mutatnak, folyamatosan heti tízmillió letöltés körül mozognak\[^14]. Ez hatalmas lábnyomot jelent a JavaScript ökoszisztémában, mivel ezek a csomagok világszerte futnak éles környezetekben.

### A nyers számokon túl {#beyond-the-raw-numbers}

Bár a letöltési statisztikák önmagukban is lenyűgözőek, mélyebb képet festenek arról, hogy a közösség mennyire bízik ezekben a csomagokban. A csomagok ilyen mértékű fenntartása rendíthetetlen elkötelezettséget igényel a következők iránt:

* **Visszafelé kompatibilitás**: A változtatásokat gondosan mérlegelni kell, hogy elkerüljük a meglévő implementációk hibáit.
* **Biztonság**: Mivel ezektől a csomagoktól több millió alkalmazás függ, a biztonsági réseknek messzemenő következményei lehetnek.
* **Teljesítmény**: Ezen a szinten még a kisebb teljesítményjavítások is jelentős összesített előnyökkel járhatnak.
* **Dokumentáció**: A világos, átfogó dokumentáció elengedhetetlen a fejlesztők által használt csomagokhoz, függetlenül a tapasztalati szinttől.

A letöltési számok időbeli folyamatos növekedése tükrözi ezen kötelezettségvállalások teljesítésének sikerét, valamint a fejlesztői közösséggel való bizalom kiépítését megbízható, jól karbantartott csomagokon keresztül.

## Az ökoszisztéma támogatása: Nyílt forráskódú szponzorációink {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> A nyílt forráskódú szoftverek fenntarthatósága nem csak a kód hozzájárulásáról szól – hanem a kritikus infrastruktúrát fenntartó fejlesztők támogatásáról is.

A JavaScript ökoszisztémához való közvetlen hozzájárulásunkon túl büszkék vagyunk arra, hogy olyan kiemelkedő Node.js közreműködőket is támogatunk, akiknek munkája számos modern alkalmazás alapját képezi. Szponzorációink többek között:

### Andris Reinman: Az e-mail infrastruktúra úttörője {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) a [Nodemailer](https://github.com/nodemailer/nodemailer) megalkotója, amely a Node.js legnépszerűbb e-mail küldő könyvtára, több mint 14 millió letöltéssel hetente\[^15]. Munkássága kiterjed más kritikus e-mail infrastruktúra-összetevőkre is, mint például a [SMTP-kiszolgáló](https://github.com/nodemailer/smtp-server), [Levelezési elemző](https://github.com/nodemailer/mailparser) és [Vadkacsa](https://github.com/nodemailer/wildduck).

Szponzorációnk segít biztosítani ezen alapvető eszközök folyamatos karbantartását és fejlesztését, amelyek számtalan Node.js alkalmazás, beleértve a saját e-mail továbbítási szolgáltatásunkat is, e-mail kommunikációját működtetik.

### Sindre Sorhus: Utility Package Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) az egyik legtermékenyebb nyílt forráskódú közreműködő a JavaScript ökoszisztémában, több mint 1000 npm-es csomaggal a nevéhez fűződik. Segédprogramjai, mint például a [p-térkép](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) és [is-stream](https://github.com/sindresorhus/is-stream), alapvető építőelemek a Node.js ökoszisztémában.

Sindre munkájának támogatásával segítjük fenntartani ezen kritikus segédprogramok fejlesztését, amelyek hatékonyabbá és megbízhatóbbá teszik a JavaScript fejlesztését.

Ezek a szponzorációk tükrözik elkötelezettségünket a tágabb nyílt forráskódú ökoszisztéma iránt. Elismerjük, hogy saját sikereink az általuk és más közreműködők által lefektetett alapokra épülnek, és elkötelezettek vagyunk a teljes ökoszisztéma fenntarthatóságának biztosítása iránt.

## Biztonsági sebezhetőségek feltárása a JavaScript ökoszisztémában {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

A nyílt forráskódú szoftverek iránti elkötelezettségünk túlmutat a funkciófejlesztésen, és magában foglalja a biztonsági réseket, amelyek több millió fejlesztőt érinthetnek. A JavaScript ökoszisztémához való legjelentősebb hozzájárulásaink közül több is a biztonság területén történt.

### A Koa-Router megmentése {#the-koa-router-rescue}

2019 februárjában Nick egy kritikus problémát azonosított a népszerű koa-router csomag karbantartásával kapcsolatban. Mivel [a Hacker News-on számolt be róla](https://news.ycombinator.com/item?id=19156707) néven futott, a csomagot az eredeti karbantartója elhagyta, így a biztonsági réseket kezeletlenül hagyta, a közösség pedig frissítések nélkül maradt.

> \[!WARNING]
> A biztonsági réseket tartalmazó elhagyott csomagok jelentős kockázatot jelentenek az egész ökoszisztémára nézve, különösen akkor, ha hetente több milliószor töltik le őket.

Válaszul Nick létrehozta a [@koa/router](https://github.com/koajs/router) csomagot, és segített értesíteni a közösséget a helyzetről. Azóta is karbantartja ezt a kritikus fontosságú csomagot, biztosítva, hogy a Koa felhasználók biztonságos és jól karbantartott útválasztási megoldással rendelkezzenek.

### ReDoS sebezhetőségek kezelése {#addressing-redos-vulnerabilities}

2020-ban Nick azonosított és kijavított egy kritikus [Reguláris kifejezés szolgáltatásmegtagadás (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) sebezhetőséget a széles körben használt `url-regex` csomagban. Ez a sebezhetőség ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) lehetővé teheti a támadók számára, hogy szolgáltatásmegtagadást okozzanak speciálisan létrehozott bemenetükkel, ami katasztrofális visszalépést okozhat a reguláris kifejezésben.

Ahelyett, hogy egyszerűen csak javította volna a meglévő csomagot, Nick létrehozta a [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-t, egy teljesen átírt implementációt, amely a sebezhetőséget kezeli, miközben megőrzi a kompatibilitást az eredeti API-val. Emellett közzétett egy [átfogó blogbejegyzés](/blog/docs/url-regex-javascript-node-js)-et is, amely elmagyarázza a sebezhetőséget és annak enyhítésének módját.

Ez a munka bemutatja a biztonsághoz való hozzáállásunkat: nem csak a problémák megoldása, hanem a közösség oktatása és olyan robusztus alternatívák biztosítása, amelyek megakadályozzák a hasonló problémákat a jövőben.

### A Node.js és a Chromium biztonságának támogatása {#advocating-for-nodejs-and-chromium-security}

Nick aktívan küzdött a tágabb ökoszisztéma biztonsági fejlesztéseiért is. 2020 augusztusában egy jelentős biztonsági problémát azonosított a Node.js-ben, amely a HTTP-fejlécek kezelésével kapcsolatos, és amelyet a [A nyilvántartás](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) jelentésben jelentettek.

Ez a probléma, amely egy Chromium-javításból eredt, lehetővé tehette a támadók számára a biztonsági intézkedések megkerülését. Nick érdekképviselete segített biztosítani a probléma mielőbbi kezelését, megvédve több millió Node.js alkalmazást a potenciális visszaélésektől.

### Az npm infrastruktúra védelme {#securing-npm-infrastructure}

Ugyanebben a hónapban Nick egy másik kritikus biztonsági problémát azonosított, ezúttal az npm e-mail infrastruktúrájában. Amint azt a [A nyilvántartás](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) jelentésben is jelentették, az npm nem implementálta megfelelően a DMARC, SPF és DKIM e-mail hitelesítési protokollokat, ami lehetővé tette a támadók számára, hogy olyan adathalász e-maileket küldjenek, amelyek látszólag az npm-től származnak.

Nick jelentése az npm e-mail biztonsági helyzetének javulásához vezetett, megvédve a potenciális adathalász támadásoktól a csomagkezeléshez az npm-re támaszkodó több millió fejlesztőt.

## Hozzájárulásunk az e-mail-továbbítási ökoszisztémához {#our-contributions-to-the-forward-email-ecosystem-1}

A Forward Email számos kritikus, nyílt forráskódú projektre épül, többek között a Nodemailerre, a WildDuckra és a mailauthra. Csapatunk jelentős mértékben hozzájárult ezekhez a projektekhez, segítve az e-mail kézbesítést és biztonságot érintő mélyreható problémák azonosítását és megoldását.

### A Nodemailer alapvető funkcióinak fejlesztése {#enhancing-nodemailers-core-functionality}

A [Nodemailer](https://github.com/nodemailer/nodemailer) a Node.js e-mail-küldésének gerincét alkotja, és a hozzájárulásaink hozzájárultak ahhoz, hogy robusztusabbá váljon:

* **SMTP szerver fejlesztések**: Kijavítottuk az elemzési hibákat, a streamkezelési problémákat és a TLS konfigurációs problémákat az SMTP szerver komponensben\[^16]\[^17].
* **Levél elemző fejlesztések**: Kijavítottuk a karaktersorozat dekódolásával kapcsolatos hibákat, és megoldottuk az elemzővel kapcsolatos problémákat, amelyek e-mail feldolgozási hibákat okozhattak\[^18]\[^19].

Ezek a hozzájárulások biztosítják, hogy a Nodemailer továbbra is megbízható alapot nyújtson az e-mail-feldolgozáshoz a Node.js alkalmazásokban, beleértve a Forward Email funkciót is.

### E-mail-hitelesítés fejlesztése a Mailauth segítségével {#advancing-email-authentication-with-mailauth}

A [Mailauth](https://github.com/postalsys/mailauth) kritikus e-mail-hitelesítési funkciókat biztosít, és hozzájárulásaink jelentősen javították a képességeit:

* **DKIM-ellenőrzési fejlesztések**: Felfedeztük és jelentettük, hogy az X/Twitter DNS-gyorsítótár-problémái DKIM-hibát okoztak a kimenő üzeneteknél. A Hacker One\[^20] oldalon jelentettük.
* **DMARC és ARC fejlesztések**: Kijavítottuk a DMARC és ARC ellenőrzésével kapcsolatos problémákat, amelyek helytelen hitelesítési eredményekhez vezethettek\[^21]\[^22].
* **Teljesítményoptimalizálások**: Olyan optimalizálásokat vezettünk be, amelyek javítják az e-mail-hitelesítési folyamatok teljesítményét\[^23]\[^24]\[^25]\[^26].

Ezek a fejlesztések segítenek biztosítani az e-mail-hitelesítés pontosságát és megbízhatóságát, megvédve a felhasználókat az adathalász és hamisított támadásoktól.

### Főbb üzemidő-fejlesztések {#key-upptime-enhancements}

Az Upptime-hoz való hozzájárulásaink többek között:

* **SSL tanúsítványfigyelés**: Funkciót adtunk hozzá az SSL tanúsítvány lejáratának figyeléséhez, megakadályozva a lejárt tanúsítványok miatti váratlan leállást\[^27].
* **Több SMS-szám támogatása**: Támogatást nyújtottunk több csapattag SMS-ben történő értesítéséhez incidensek esetén, javítva a válaszidőket\[^28].
* **IPv6 ellenőrzési javítások**: Kijavítottuk az IPv6 kapcsolatellenőrzésekkel kapcsolatos problémákat, biztosítva a pontosabb figyelést a modern hálózati környezetekben\[^29].
* **Sötét/Világos mód támogatása**: Tématámogatást adtunk hozzá az állapotoldalak felhasználói élményének javítása érdekében\[^31].
* **Jobb TCP-Ping támogatás**: Továbbfejlesztettük a TCP ping funkciót a megbízhatóbb kapcsolattesztelés biztosítása érdekében\[^32].

Ezek a fejlesztések nemcsak a Forward Email állapotfigyelését segítik elő, hanem az Upptime felhasználóinak teljes közössége számára elérhetők, ami jól mutatja elkötelezettségünket az általunk használt eszközök fejlesztése iránt.

## Az összetartó erő: Egyedi kód méretarányosan {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Bár az npm csomagjaink és a meglévő projektekhez való hozzájárulásaink jelentősek, az ezeket a komponenseket integráló egyéni kód az, ami igazán bemutatja technikai szakértelmünket. A Forward Email kódbázis egy évtizedes fejlesztési erőfeszítést képvisel, amely 2017-ig nyúlik vissza, amikor a projekt [ingyenes e-mail-továbbítás](https://github.com/forwardemail/free-email-forwarding) néven indult, mielőtt egy monorepóba egyesítették volna.

### Egy hatalmas fejlesztési erőfeszítés {#a-massive-development-effort}

Ennek az egyéni integrációs kódnak a mérete lenyűgöző:

* **Összes közreműködés**: Több mint 3217 commit
* **Kódbázis mérete**: Több mint 421 545 sornyi kód JavaScript, Pug, CSS és JSON fájlokban\[^33]

Ez több ezer órányi fejlesztői munkát, hibakeresési munkamenetet és teljesítményoptimalizálást jelent. Ez az a „titkos összetevő”, amely az egyes csomagokat egy koherens, megbízható szolgáltatássá alakítja, amelyet naponta több ezer ügyfél használ.

### Alapvető függőségek integrációja {#core-dependencies-integration}

A Forward Email kódbázis számos függőséget integrál egyetlen zökkenőmentes egésszé:

* **E-mail feldolgozás**: Integrálja a Nodemailer-t a küldéshez, az SMTP szervert a fogadáshoz és a Mailparser-t az elemzéshez.* **Hitelesítés**: Mailauth-ot használ a DKIM, SPF, DMARC és ARC ellenőrzéshez.* **DNS feloldás**: Tangerine-t használ a DNS-over-HTTPS-hez globális gyorsítótárazással.* **MX kapcsolat**: Az mx-connect és a Tangerine integrációját használja a megbízható levelezőszerver-kapcsolatokhoz.* **Feladatütemezés**: Bree-t használ a megbízható háttérfeladat-feldolgozáshoz a munkaszálakkal.* **Sablonok**: E-mail sablonokat használ a webhelyről származó stíluslapok újrafelhasználásához az ügyfélkommunikációban.* **E-mail tárolás**: Egyedileg titkosított SQLite postaládákat valósít meg a better-sqlite3-multiple-ciphers és a ChaCha20-Poly1305 titkosítás használatával a kvantumbiztonságos adatvédelem érdekében, biztosítva a felhasználók közötti teljes elszigeteltséget, és azt, hogy csak a felhasználó férhessen hozzá a postaládájához.

Ezen integrációk mindegyike gondosan mérlegeli a peremhelyzeteket, a teljesítményvonzatokat és a biztonsági aggályokat. Az eredmény egy robusztus rendszer, amely megbízhatóan kezel több millió e-mail tranzakciót. SQLite implementációnk az msgpackr-t is kihasználja a hatékony bináris szerializáláshoz, valamint a WebSockets-et (ws-en keresztül) a valós idejű állapotfrissítésekhez az infrastruktúránkban.

### DNS infrastruktúra Tangerine és mx-connect szolgáltatással {#dns-infrastructure-with-tangerine-and-mx-connect}

A Forward Email infrastruktúrájának kritikus eleme a DNS-feloldó rendszerünk, amely két fő csomag köré épül:

* **[Mandarin](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: A Node.js DNS-over-HTTPS implementációnk a szabványos DNS-feloldó azonnal használható helyettesítője, beépített újrapróbálkozásokkal, időtúllépésekkel, intelligens szerverrotációval és gyorsítótárazási támogatással.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Ez a csomag TCP-kapcsolatokat hoz létre az MX-kiszolgálókkal, egy céltartományt vagy e-mail-címet vesz fel, feloldja a megfelelő MX-kiszolgálókat, és prioritási sorrendben csatlakozik hozzájuk.

A Tangerine-t integráltuk az mx-connecttel a [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), biztosítva az alkalmazásrétegű DNS-t HTTP kérések felett a Forward Email teljes folyamatában. Ez globális gyorsítótárazást biztosít a DNS számára nagy léptékben, 1:1 konzisztenciával bármely régióban, alkalmazásban vagy folyamatban – ez kritikus fontosságú a megbízható e-mail kézbesítéshez egy elosztott rendszerben.

## Vállalati hatás: A nyílt forráskódú szoftverektől a kritikus fontosságú megoldásokig {#enterprise-impact-from-open-source-to-mission-critical-solutions}

A nyílt forráskódú fejlesztésben eltöltött évtizedes utunk csúcspontja lehetővé tette a Forward Email számára, hogy ne csak az egyéni fejlesztőket, hanem a nyílt forráskódú mozgalom gerincét alkotó nagyobb vállalatokat és oktatási intézményeket is kiszolgálja.

### Esettanulmányok a kritikus fontosságú e-mail infrastruktúrában {#case-studies-in-mission-critical-email-infrastructure}

A megbízhatóság, az adatvédelem és a nyílt forráskódú elvek iránti elkötelezettségünk tette a Forward Emailt a megbízható választássá az igényes e-mail követelményekkel rendelkező szervezetek számára:

* **Oktatási intézmények**: Ahogyan azt az [öregdiákok e-mail továbbítási esettanulmányunkban] részletesen ismertettük.](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)-n keresztül. A nagyobb egyetemek infrastruktúránkra támaszkodnak, hogy megbízható e-mail-továbbítási szolgáltatásokon keresztül élethosszig tartó kapcsolatot tartsanak fenn több százezer öregdiákkal.

* **Vállalati Linux megoldások**: A [Canonical Ubuntu e-mail vállalati esettanulmány](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) bemutatja, hogy nyílt forráskódú megközelítésünk hogyan illeszkedik tökéletesen a vállalati Linux-szolgáltatók igényeihez, biztosítva számukra a szükséges átláthatóságot és kontrollt.

* **Nyílt forráskódú alapok**: Talán a legmegerősítőbb a Linux Foundationnel fennálló partnerségünk, amint azt a [Linux Foundation e-mail vállalati esettanulmány](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) dokumentálja, ahol szolgáltatásunk biztosítja a kommunikációt annak a szervezetnek, amely a Linux fejlesztésért felel.

Gyönyörű szimmetria figyelhető meg abban, ahogyan a nyílt forráskódú csomagjaink, amelyeket éveken át gondosan karbantartottunk, lehetővé tették számunkra egy olyan e-mail szolgáltatás felépítését, amely most éppen azokat a közösségeket és szervezeteket támogatja, amelyek a nyílt forráskódú szoftvereket támogatják. Ez a teljes körű út – az egyes csomagok kibocsátásától kezdve a vállalati szintű e-mail infrastruktúra működtetéséig a nyílt forráskódú vezetők számára – a szoftverfejlesztéshez való megközelítésünk végső megerősítését jelenti.

## Egy évtizednyi nyílt forráskód: Előretekintés {#a-decade-of-open-source-looking-forward}

Miközben visszatekintünk az elmúlt évtized nyílt forráskódú projektjeire, és előretekintünk a következő tíz évre, hálával tölt el minket a munkánkat támogató közösség, és izgatottan várjuk a jövőt.

Figyelemre méltó utunk volt az egyéni csomagfejlesztőktől a nagyvállalatok és nyílt forráskódú alapítványok által használt átfogó e-mail infrastruktúra fenntartóiig. Ez a nyílt forráskódú fejlesztés erejének és az átgondolt, jól karbantartott szoftverek tágabb ökoszisztémára gyakorolt hatásának bizonyítéka.

Az elkövetkező években elkötelezettek vagyunk a következők iránt:

* **A meglévő csomagjaink folyamatos karbantartása és fejlesztése**, biztosítva, hogy azok továbbra is megbízható eszközök maradjanak a fejlesztők számára világszerte.
* **A kritikus infrastrukturális projektekhez való hozzájárulásunk bővítése**, különösen az e-mail és a biztonsági területeken.
* **A Forward Email képességeinek fejlesztése**, miközben fenntartjuk az adatvédelem, a biztonság és az átláthatóság iránti elkötelezettségünket.
* **A nyílt forráskódú közreműködők következő generációjának támogatása** mentorálás, szponzorálás és közösségi szerepvállalás révén.

Hisszük, hogy a szoftverfejlesztés jövője a nyílt, együttműködő és a bizalomra épülő. Azzal, hogy továbbra is kiváló minőségű, biztonságközpontú csomagokat kínálunk a JavaScript ökoszisztémának, reméljük, hogy kis szerepet játszhatunk ennek a jövőnek az építésében.

Köszönjük mindenkinek, aki használta csomagjainkat, hozzájárult projektjeinkhez, problémákat jelentett, vagy egyszerűen csak hírét vitte munkánknak. Az Ön támogatása tette lehetővé ezt az évtizednyi hatást, és izgatottan várjuk, hogy mit érhetünk el együtt a következő tíz évben.

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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Az Upptime repository GitHub problémái alapján
\[^28]: Az Upptime repository GitHub problémái alapján
\[^29]: Az Upptime repository GitHub problémái alapján
\[^30]: npm letöltési statisztikák a bree-hez, 2025. február-március
\[^31]: Az Upptime-nak küldött GitHub pull requestek alapján
\[^32]: Az Upptime-nak küldött GitHub pull requestek alapján
\[^34]: npm letöltési statisztikák a koa-hoz, 2025. február-március
\[^35]: npm letöltési statisztikák a @koa/routerhez, 2025. február-március
\[^36]: npm letöltési statisztikák a koa-routerhez, február-március 2025
\[^37]: npm letöltési statisztikák az url-regexhez, 2025. február-március
\[^38]: npm letöltési statisztikák a @breejs/laterhez, 2025. február-március
\[^39]: npm letöltési statisztikák az e-mail-sablonokhoz, 2025. február-március
\[^40]: npm letöltési statisztikák a get-paths-hez, 2025. február-március
\[^41]: npm letöltési statisztikák a dotenv-parse-variables-hez, 2025. február-március
\[^42]: npm letöltési statisztikák a @koa/multerhez, 2025. február-március