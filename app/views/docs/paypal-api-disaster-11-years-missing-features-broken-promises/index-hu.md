# PayPal 11 éves API katasztrófája: Hogyan építettünk megoldásokat, miközben ők figyelmen kívül hagyták a fejlesztőket {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Siker! A PayPal végre hozzáadta a `GET /v1/billing/subscriptions` végpontot.**
>
> Miután közzétettük ezt a bejegyzést és elküldtük a PayPal vezetői csapatának, ők megvalósították a régóta várt előfizetés-listázó végpontot. A változás valamikor [2025. június 25.](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) és [2025. július 9.](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/) között jelent meg.
>
> Azonban, a PayPal szokásos módján, minket erről soha nem értesítettek. Csak 2025 decemberében fedeztük fel önállóan ezt a frissítést, hónapokkal azután, hogy a funkció csendben megjelent.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API katasztrófa illusztráció" class="rounded-lg" />

<p class="lead mt-3">A Forward Email-nél több mint egy évtizede küzdünk a PayPal hibás API-jaival. Ami kezdetben kisebb bosszúság volt, az teljes katasztrófává vált, amely arra kényszerített minket, hogy saját megoldásokat építsünk, blokkoljuk a phishing sablonjaikat, és végül egy kritikus fiókátállás alatt leállítsuk az összes PayPal fizetést.</p>
<p class="lead mt-3">Ez a történet 11 évről szól, amikor a PayPal figyelmen kívül hagyta az alapvető fejlesztői igényeket, miközben mi mindent megtettünk, hogy működésre bírjuk a platformjukat.</p>


## Tartalomjegyzék {#table-of-contents}

* [A hiányzó darab: nincs mód az előfizetések listázására](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: A probléma megjelenése](#2014-2017-the-problem-emerges)
* [2020: Részletes visszajelzést adunk](#2020-we-give-them-extensive-feedback)
  * [A 27 pontos visszajelzési lista](#the-27-item-feedback-list)
  * [Csapatok bevonása, ígéretek születtek](#teams-got-involved-promises-were-made)
  * [Az eredmény? Semmi.](#the-result-nothing)
* [A vezetői kivonulás: Hogyan veszítette el a PayPal az intézményi emlékezetét](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Új vezetés, ugyanazok a problémák](#2025-new-leadership-same-problems)
  * [Az új vezérigazgató bekapcsolódik](#the-new-ceo-gets-involved)
  * [Michelle Gill válasza](#michelle-gills-response)
  * [A mi válaszunk: Nincs több találkozó](#our-response-no-more-meetings)
  * [Marty Brodbeck túlkomplikált válasza](#marty-brodbecks-overengineering-response)
  * [Az „Egyszerű CRUD” ellentmondás](#the-simple-crud-contradiction)
  * [A kapcsolat megszakadása világossá válik](#the-disconnect-becomes-clear)
* [Évekig figyelmen kívül hagyott hibajelentések](#years-of-bug-reports-they-ignored)
  * [2016: Korai UI/UX panaszok](#2016-early-uiux-complaints)
  * [2021: Üzleti e-mail hibajelentés](#2021-business-email-bug-report)
  * [2021: UI fejlesztési javaslatok](#2021-ui-improvement-suggestions)
  * [2021: Sandbox környezet hibái](#2021-sandbox-environment-failures)
  * [2021: Jelentésrendszer teljesen tönkrement](#2021-reports-system-completely-broken)
  * [2022: Alap API funkció hiányzik (megint)](#2022-core-api-feature-missing-again)
* [A fejlesztői élmény rémálma](#the-developer-experience-nightmare)
  * [Törött felhasználói felület](#broken-user-interface)
  * [SDK problémák](#sdk-problems)
  * [Tartalombiztonsági szabályzat megsértései](#content-security-policy-violations)
  * [Dokumentációs káosz](#documentation-chaos)
  * [Biztonsági sebezhetőségek](#security-vulnerabilities)
  * [Munkamenet-kezelési katasztrófa](#session-management-disaster)
* [2025 július: Az utolsó csepp](#july-2025-the-final-straw)
* [Miért nem dobhatjuk el egyszerűen a PayPalt](#why-we-cant-just-drop-paypal)
* [A közösségi megoldás](#the-community-workaround)
* [PayPal sablonok blokkolása phishing miatt](#blocking-paypal-templates-due-to-phishing)
  * [Az igazi probléma: a PayPal sablonok csalásnak tűnnek](#the-real-problem-paypals-templates-look-like-scams)
  * [A mi megvalósításunk](#our-implementation)
  * [Miért kellett blokkolnunk a PayPalt](#why-we-had-to-block-paypal)
  * [A probléma mérete](#the-scale-of-the-problem)
  * [Az irónia](#the-irony)
  * [Valós hatás: új PayPal csalások](#real-world-impact-novel-paypal-scams)
* [A PayPal visszafelé működő KYC folyamata](#paypals-backwards-kyc-process)
  * [Hogyan kellene működnie](#how-it-should-work)
  * [Hogyan működik valójában a PayPal](#how-paypal-actually-works)
  * [A valós hatás](#the-real-world-impact)
  * [2025 júliusi fiókátállási katasztrófa](#the-july-2025-account-migration-disaster)
  * [Miért fontos ez](#why-this-matters)
* [Hogyan csinálják jól a többi fizetési szolgáltató](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Az iparági szabvány](#the-industry-standard)
  * [Mit nyújtanak más szolgáltatók a PayPalhoz képest](#what-other-processors-provide-vs-paypal)
* [A PayPal rendszerszintű eltussolása: 6 millió hang elnémítása](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [A nagy eltörlés](#the-great-erasure)
  * [A harmadik fél általi mentés](#the-third-party-rescue)
* [Az 11 éves capture bug katasztrófa: 1 899 dollár és még mindig növekszik](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [A Forward Email 1 899 dolláros vesztesége](#forward-emails-1899-loss)
  * [Az eredeti 2013-as jelentés: több mint 11 év hanyagság](#the-2013-original-report-11-years-of-negligence)
  * [A 2016-os beismerés: a PayPal tönkreteszi a saját SDK-ját](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [A 2024-es eszkaláció: még mindig hibás](#the-2024-escalation-still-broken)
  * [A webhook megbízhatósági katasztrófa](#the-webhook-reliability-disaster)
  * [A rendszerszintű hanyagság mintázata](#the-pattern-of-systematic-negligence)
  * [A dokumentálatlan követelmény](#the-undocumented-requirement)
* [A PayPal szélesebb körű megtévesztési mintázata](#paypals-broader-pattern-of-deception)
  * [A New York-i Pénzügyi Szolgáltatások Minisztériumának lépése](#the-new-york-department-of-financial-services-action)
  * [A Honey per: partnerlinkek átírása](#the-honey-lawsuit-rewriting-affiliate-links)
  * [A PayPal hanyagságának költsége](#the-cost-of-paypals-negligence)
  * [A dokumentációs hazugság](#the-documentation-lie)
* [Mit jelent ez a fejlesztők számára](#what-this-means-for-developers)
## A Hiányzó Darab: Nincs Mód az Előfizetések Listázására {#the-missing-piece-no-way-to-list-subscriptions}

Ez az, ami teljesen elképeszt minket: a PayPal 2014 óta kínál előfizetéses számlázást, de soha nem biztosított módot arra, hogy a kereskedők listázhassák saját előfizetéseiket.

Gondolj erre egy pillanatra. Tudsz előfizetéseket létrehozni, le tudod mondani őket, ha megvan az azonosítójuk, de nem tudsz lekérni egy listát az összes aktív előfizetésről a fiókodban. Olyan, mintha lenne egy adatbázisod, de nem lenne SELECT utasítás.

Erre szükségünk van az alapvető üzleti műveletekhez:

* Ügyfélszolgálat (amikor valaki e-mailben érdeklődik az előfizetéséről)
* Pénzügyi jelentések és egyeztetés
* Automatizált számlakezelés
* Megfelelőség és auditálás

De a PayPal? Egyszerűen... soha nem építette meg.


## 2014-2017: A Probléma Felbukkan {#2014-2017-the-problem-emerges}

Az előfizetés-listázási probléma először 2017-ben jelent meg a PayPal közösségi fórumain. A fejlesztők feltették az egyértelmű kérdést: „Hogyan tudom lekérni az összes előfizetésem listáját?”

A PayPal válasza? Csönd.

A közösség tagjai kezdtek frusztrálttá válni:

> „Nagyon furcsa hiányosság, ha egy kereskedő nem tudja listázni az összes aktív megállapodást. Ha az azonosító elveszik, csak a felhasználó tudja lemondani vagy felfüggeszteni a megállapodást.” - leafspider

> „+1. Már majdnem 3 éve.” - laudukang (ami azt jelenti, hogy a probléma kb. 2014 óta fennáll)

A [2017-es eredeti közösségi bejegyzés](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) fejlesztők könyörgését mutatja be ezért az alapvető funkcióért. A PayPal válasza az volt, hogy archiválta azt a tárhelyet, ahol az emberek jelentették a problémát.


## 2020: Részletes Visszajelzést Adtunk Nekik {#2020-we-give-them-extensive-feedback}

2020 októberében a PayPal hivatalos visszajelzési ülésre hívott minket. Ez nem volt egy laza beszélgetés – egy 45 perces Microsoft Teams hívást szerveztek 8 PayPal vezetővel, köztük Sri Shivanandával (CTO), Edwin Aoki-val, Jim Magats-szal, John Kunze-vel és másokkal.

### A 27 Pontból Álló Visszajelzési Lista {#the-27-item-feedback-list}

Felkészültünk. Hat óra API integrációs próbálkozás után összeállítottunk 27 konkrét problémát. Mark Stuart a PayPal Checkout csapatából ezt mondta:

> Hé Nick, köszi, hogy megosztottad mindenkivel ma! Azt hiszem, ez lesz az a katalizátor, ami több támogatást és befektetést hoz a csapatunknak, hogy megoldjuk ezeket a dolgokat. Nehéz volt ilyen részletes visszajelzést kapni, mint amit eddig adtál.

A visszajelzés nem elméleti volt – valódi integrációs kísérletekből származott:

1. **Hozzáférési token generálás nem működik**:

> A hozzáférési token generálás nem működik. Emellett több példának kellene lennie, nem csak cURL példáknak.

2. **Nincs webes felület az előfizetés létrehozásához**:

> Hogyan a fenébe lehet előfizetéseket létrehozni anélkül, hogy cURL-t használnánk? Úgy tűnik, nincs webes felület erre (mint amilyen a Stripe-nak van)

Mark Stuart különösen aggasztónak találta a hozzáférési token problémát:

> Általában nem hallunk hozzáférési token generálási problémákról.

### Több Csapat Is Bekapcsolódott, Ígéretek Születtek {#teams-got-involved-promises-were-made}

Ahogy egyre több problémát fedeztünk fel, a PayPal egyre több csapatot vont be a beszélgetésbe. Darshan Raju a Subscriptions kezelő UI csapatból csatlakozott és ezt mondta:

> Elismerjük a hiányosságot. Követni és kezelni fogjuk ezt. Köszönjük ismét a visszajelzést!

Az ülést úgy írták le, mint egy:

> őszinte végigjárást a tapasztalataidról

hogy:

> a PayPalt azzá tegyük, aminek fejlesztők számára lennie kell.

### Az Eredmény? Semmi. {#the-result-nothing}

A hivatalos visszajelzési ülés, a részletes 27 pontos lista, a több csapat részvétele és az ígéretek ellenére, hogy:

> követni és kezelni fogják

a problémákat, semmi sem lett javítva.


## A Vezetői Távozás: Hogyan Vesztette El a PayPal Az Összes Intézményi Tudást {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Itt válik igazán érdekessé a történet. Minden egyes személy, aki megkapta a 2020-as visszajelzésünket, elhagyta a PayPalt:

**Vezetői Változások:**

* [Dan Schulman (9 évig vezérigazgató) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (2023 szeptember)
* [Sri Shivananda (CTO, aki szervezte a visszajelzést) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (2024 január)
**Műszaki vezetők, akik ígéreteket tettek, majd távoztak:**

* **Mark Stuart** (ígérte, hogy a visszajelzés "katalizátor" lesz) → [Most a Ripple-nél](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 éves PayPal veterán) → [Az MX vezérigazgatója](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (globális fogyasztói termék alelnök) → [Nyugdíjba vonult](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (az utolsó megmaradtak egyike) → [Most épp a Nasdaq-hoz távozott](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (2025 január)

A PayPal egy forgóajtóvá vált, ahol a vezetők összegyűjtik a fejlesztői visszajelzéseket, ígéreteket tesznek, majd jobb cégekhez, mint a JPMorgan, Ripple és más fintech vállalatok távoznak.

Ez magyarázza, hogy miért tűnt a 2025-ös GitHub issue válasz teljesen elszakadtnak a 2020-as visszajelzéseinktől – szó szerint mindenki, aki megkapta azt a visszajelzést, elhagyta a PayPalt.


## 2025: Új vezetés, ugyanazok a problémák {#2025-new-leadership-same-problems}

Gyorsan ugorjunk 2025-be, és ugyanaz a minta jelenik meg. Évek stagnálása után a PayPal új vezetése ismét megkeres minket.

### Az új vezérigazgató bekapcsolódik {#the-new-ceo-gets-involved}

2025. június 30-án közvetlenül a PayPal új vezérigazgatójához, Alex Chrisshez fordultunk. Válasza rövid volt:

> Szia Nick – Köszönöm, hogy megkerestél és a visszajelzést. Michelle (másolatban) a csapatával azon dolgozik, hogy bevonódjon és együttműködjön veled. Köszönöm -A

### Michelle Gill válasza {#michelle-gills-response}

Michelle Gill, a Kisvállalkozások és Pénzügyi Szolgáltatások EVP-je és ügyvezető igazgatója így válaszolt:

> Nagyon köszönöm Nick, Alexet áthelyezem bcc-be. Már az előző posztod óta vizsgáljuk ezt. Hívni fogunk a hét vége előtt. Kérlek, küldd el az elérhetőséged, hogy egyik kollégám fel tudja venni veled a kapcsolatot. Michelle

### A mi válaszunk: Több találkozót nem {#our-response-no-more-meetings}

Elutasítottunk egy újabb találkozót, kifejtve csalódottságunkat:

> Köszönöm. Azonban nem hiszem, hogy egy hívás bármit is megoldana. Íme, miért... Korábban már volt ilyen hívásom, és sehova sem vezetett. Több mint 2 órát pazaroltam az időmből, hogy az egész csapattal és vezetőséggel beszéljek, és semmi sem történt... Rengeteg e-mail oda-vissza. Semmi sem történt. A visszajelzés nem vezetett sehova. Évekig próbálkoztam, meghallgattak, aztán semmi sem lett belőle.

### Marty Brodbeck túlbonyolító válasza {#marty-brodbecks-overengineering-response}

Ezután Marty Brodbeck, a PayPal fogyasztói mérnökségének vezetője kereste meg:

> Szia Nick, Marty Brodbeck vagyok. Én vezetem a fogyasztói mérnökséget itt a PayPalnál, és én irányítom az API fejlesztést a cégnél. Tudnánk beszélni a problémáról, amivel szembesülsz, és arról, hogyan segíthetünk.

Amikor elmagyaráztuk az egyszerű előfizetés-listázó végpont szükségességét, válasza megmutatta a pontos problémát:

> Köszönöm Nick, éppen egy egységes előfizetés API-t készítünk teljes SDK-val (teljes hibakezelést támogat, eseményalapú előfizetéskövetést, robusztus rendelkezésre állást), ahol a számlázás külön API-ként van szétválasztva, hogy a kereskedőknek ne kelljen több végponton át koordinálniuk egyetlen válaszért.

Ez pontosan a rossz megközelítés. Nincs szükségünk hónapokig tartó bonyolult architektúrára. Egy egyszerű REST végpontra van szükségünk, amely listázza az előfizetéseket – olyasmire, ami 2014 óta léteznie kellene.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Az "Egyszerű CRUD" ellentmondás {#the-simple-crud-contradiction}

Amikor rámutattunk, hogy ez alapvető CRUD funkció, ami 2014 óta léteznie kellene, Marty válasza beszédes volt:

> Az egyszerű CRUD műveletek a core API részei, barátom, szóval nem fog hónapokig tartani a fejlesztés

A PayPal TypeScript SDK, amely jelenleg csak három végpontot támogat hónapok fejlesztése után, valamint a történelmi idővonal egyértelműen mutatja, hogy az ilyen projektek befejezése több mint néhány hónapot igényel.
Ez a válasz azt mutatja, hogy nem érti a saját API-ját. Ha a „egyszerű CRUD műveletek a mag API részét képezik”, akkor hol van az előfizetés-listázó végpont? Így válaszoltunk:

> Ha az „egyszerű CRUD műveletek a mag API részét képezik”, akkor hol van az előfizetés-listázó végpont? A fejlesztők 2014 óta kérik ezt az „egyszerű CRUD műveletet”. Már 11 éve. Minden más fizetési feldolgozó már az első naptól rendelkezik ezzel az alapvető funkcióval.

### A kapcsolat megszakadása világossá válik {#the-disconnect-becomes-clear}

Az Alex Chriss-szel, Michelle Gill-lel és Marty Brodbeckkel folytatott 2025-ös egyeztetések ugyanazt a szervezeti diszfunkciót mutatják:

1. **Az új vezetés nem ismeri a korábbi visszajelzési üléseket**
2. **Ugyanazokat a túlkomplikált megoldásokat javasolják**
3. **Nem értik a saját API-juk korlátait**
4. **Több értekezletet akarnak a probléma megoldása helyett**

Ez a minta megmagyarázza, hogy a PayPal csapatai 2025-ben miért tűnnek teljesen elszakadtnak a 2020-ban adott kiterjedt visszajelzésektől – azok az emberek, akik megkapták ezeket a visszajelzéseket, már nincsenek ott, és az új vezetés ugyanazokat a hibákat ismétli.

## Évek óta figyelmen kívül hagyott hibajelentések {#years-of-bug-reports-they-ignored}

Nem csak hiányzó funkciókról panaszkodtunk. Aktívan jelentettünk hibákat és próbáltunk segíteni a fejlesztésben. Íme egy átfogó idővonal a dokumentált problémákról:

### 2016: Korai UI/UX panaszok {#2016-early-uiux-complaints}

Már 2016-ban is nyilvánosan fordultunk a PayPal vezetéséhez, köztük Dan Schulmanhez, a felület és használhatóság problémáival kapcsolatban. Ez 9 évvel ezelőtt volt, és ugyanazok a UI/UX problémák ma is fennállnak.

### 2021: Üzleti e-mail hibajelentés {#2021-business-email-bug-report}

2021 márciusában jelentettük, hogy a PayPal üzleti e-mail rendszere hibás lemondási értesítéseket küld. Az e-mail sablon változói helytelenül jelentek meg, zavaró üzeneteket mutatva az ügyfeleknek.

Mark Stuart elismerte a problémát:

> Köszi Nick! Átállunk BCC-re. @Prasy, a te csapatod felelős ezért az e-mailért, vagy tudod, ki az? A „Niftylettuce, LLC, többé nem számlázunk” arra utal, hogy összekeveredett, kinek szól és mi van az e-mailben.

**Eredmény**: Ezt tényleg megjavították! Mark Stuart megerősítette:

> Épp most hallottam az értesítési csapattól, hogy az e-mail sablon javítva lett és bevezetésre került. Köszönöm, hogy jelezted. Köszönöm!

Ez azt mutatja, hogy képesek javítani, ha akarnak – csak a legtöbb problémánál nem akarják.

### 2021: UI fejlesztési javaslatok {#2021-ui-improvement-suggestions}

2021 februárjában részletes visszajelzést adtunk a dashboard UI-járól, különösen a „PayPal Recent Activity” szekcióról:

> Szerintem a paypal.com dashboardja, különösen a „PayPal Recent Activity” javításra szorul. Nem kellene mutatni a $0 ismétlődő fizetés „Created” státusz sorait – csak rengeteg felesleges sort ad hozzá, és nem lehet egy pillantással látni, mennyi bevétel keletkezik az adott napon/az elmúlt napokban.

Mark Stuart továbbította a fogyasztói termékek csapatának:

> Köszi! Nem tudom, melyik csapat felelős az Activityért, de továbbítottam a fogyasztói termékek vezetőjének, hogy megtalálják a megfelelő csapatot. Egy $0.00 ismétlődő fizetés hibának tűnik. Valószínűleg ki kellene szűrni.

**Eredmény**: Soha nem javították. Az UI továbbra is mutatja ezeket a haszontalan $0 bejegyzéseket.

### 2021: Sandbox környezet hibái {#2021-sandbox-environment-failures}

2021 novemberében kritikus problémákat jelentettünk a PayPal sandbox környezetével kapcsolatban:

* A sandbox titkos API kulcsokat véletlenszerűen megváltoztatták és letiltották
* Minden sandbox tesztfiókot értesítés nélkül töröltek
* Hibák jelentek meg a sandbox fiók adatok megtekintésekor
* Időszakos betöltési hibák

> Valamiért megváltoztatták a sandbox titkos API kulcsomat és letiltották. Emellett az összes régi sandbox tesztfiókomat törölték.

> Néha betölt, néha nem is. Ez hihetetlenül frusztráló.

**Eredmény**: Nincs válasz, nincs javítás. A fejlesztők továbbra is megbízhatatlan sandbox környezettel küzdenek.

### 2021: Jelentésrendszer teljesen tönkrement {#2021-reports-system-completely-broken}
2021 májusában arról számoltunk be, hogy a PayPal tranzakciós jelentések letöltési rendszere teljesen tönkrement:

> Úgy tűnik, hogy a jelentések letöltése most nem működik, és egész nap nem is működött. Valószínűleg e-mail értesítést is kellene kapni, ha sikertelen.

Felhívtuk a figyelmet a munkamenet-kezelés katasztrófájára is:

> Ha 5 percig inaktív vagy a PayPalba bejelentkezve, akkor kijelentkeztet. Szóval amikor frissíted a gombot a jelentés mellett, aminek az állapotát ellenőrizni akarod (miután örökké vártál), nagyon idegesítő újra bejelentkezni.

Mark Stuart elismerte a munkamenet időtúllépés problémáját:

> Emlékszem, hogy korábban jelezted, hogy a munkameneted gyakran lejár, és ez megzavarja a fejlesztési folyamatodat, miközben az IDE-d és a developer.paypal.com vagy a kereskedői irányítópult között váltogatsz, majd visszatérve újra kijelentkeztet.

**Eredmény**: A munkamenet időtúllépések továbbra is 60 másodpercesek. A jelentésrendszer továbbra is rendszeresen hibás.

### 2022: Hiányzó alap API funkció (megint) {#2022-core-api-feature-missing-again}

2022 januárjában ismét jeleztük az előfizetés-listázási problémát, ezúttal még részletesebben arról, hogy a dokumentációjuk hibás:

> Nincs olyan GET, ami az összes előfizetést listázná (korábban számlázási megállapodásoknak hívták)

Felfedeztük, hogy a hivatalos dokumentációjuk teljesen pontatlan:

> Az API dokumentációk is teljesen pontatlanok. Azt hittük, megoldás lehet, ha letöltünk egy keménykódolt listát az előfizetés azonosítókról. De ez sem működik!

> A hivatalos dokumentáció itt... Azt írja, hogy ezt meg lehet csinálni... A csavar az, hogy sehol nincs "Előfizetés azonosító" mező, amit be lehetne jelölni.

Christina Monti a PayPaltól válaszolt:

> Elnézést kérünk a hibás lépések okozta frusztrációért, ezen a héten javítjuk.

Sri Shivananda (CTO) megköszönte nekünk:

> Köszönjük a folyamatos segítséget, hogy jobbá tegyük magunkat. Nagyon értékeljük.

**Eredmény**: A dokumentációt soha nem javították ki. Az előfizetés-listázó végpontot soha nem hozták létre.


## A fejlesztői élmény rémálma {#the-developer-experience-nightmare}

A PayPal API-ival dolgozni olyan, mintha 10 évvel ezelőttre lépnénk vissza az időben. Íme a dokumentált technikai problémák:

### Tönkrement felhasználói felület {#broken-user-interface}

A PayPal fejlesztői irányítópultja katasztrófa. Így néz ki a napi helyzet:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  A PayPal felhasználói felülete annyira tönkrement, hogy még az értesítéseket sem lehet elutasítani
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    A böngészője nem támogatja a videó címkét.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  A fejlesztői irányítópult szó szerint arra kényszerít, hogy húzz egy csúszkát, majd 60 másodperc után kijelentkeztet
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    A böngészője nem támogatja a videó címkét.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  További felhasználói felület katasztrófák a PayPal fejlesztői felületén, amelyek törött munkafolyamatokat mutatnak
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    A böngészője nem támogatja a videó címkét.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Az előfizetés-kezelő felület – a felület annyira rossz, hogy kódra kellett hagyatkoznunk termékek és előfizetési tervek generálásához
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal előfizetések képernyőkép" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Egy nézet a törött előfizetés-kezelő felületről hiányzó funkciókkal (nem lehet könnyen termékeket/terveket/előfizetéseket létrehozni – és úgy tűnik, hogy a felületen egyáltalán nincs mód termékek vagy tervek törlésére, ha egyszer létre lettek hozva)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal előfizetések képernyőkép 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tipikus PayPal hibaüzenetek – titokzatosak és nem segítőkészek
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK problémák {#sdk-problems}

* Nem képes egyszerre kezelni az egyszeri fizetéseket és az előfizetéseket bonyolult megoldások nélkül, amelyek gombok cseréjét és újrarenderelését, valamint az SDK script tagekkel történő újratöltését igénylik
* A JavaScript SDK megsérti az alapvető konvenciókat (kisbetűs osztálynevek, nincs példányellenőrzés)
* A hibaüzenetek nem jelzik, mely mezők hiányoznak
* Inkonzisztens adattípusok (számok helyett string összegeket követel meg)

### Tartalombiztonsági szabályzat megsértései {#content-security-policy-violations}

Az SDK-jukhoz szükség van unsafe-inline és unsafe-eval engedélyezésére a CSP-ben, **ami arra kényszeríti, hogy feláldozza a webhelye biztonságát**.

### Dokumentációs káosz {#documentation-chaos}

Mark Stuart maga is elismerte:

> Egyetértek, hogy abszurd mennyiségű régi és új API van. Nagyon nehéz megtalálni, amit keresünk (még nekünk is, akik itt dolgozunk).

### Biztonsági sebezhetőségek {#security-vulnerabilities}

**A PayPal 2FA megvalósítása fordított**. Még ha engedélyezve is van a TOTP alkalmazás, SMS-ellenőrzést kényszerítenek – így a fiókok ki vannak téve a SIM-csere támadásoknak. Ha engedélyezve van a TOTP, akkor kizárólag azt kellene használni. A tartalék megoldásnak emailnek kellene lennie, nem SMS-nek.

### Munkamenet-kezelési katasztrófa {#session-management-disaster}

**A fejlesztői irányítópultjuk 60 másodperc inaktivitás után kijelentkeztet**. Próbáljon meg bármit is produktívan csinálni, és folyamatosan át kell mennie: bejelentkezés → captcha → 2FA → kijelentkezés → ismétlés. VPN-t használ? Sok szerencsét.


## 2025 július: Az utolsó csepp {#july-2025-the-final-straw}

11 évnyi ugyanazokkal a problémákkal a töréspont egy rutinszerű fiókmigráció során jött el. Át kellett térnünk egy új PayPal fiókra, hogy egyezzen a cégnevünkkel, a "Forward Email LLC"-vel a tisztább könyvelés érdekében.

Ami egyszerűnek kellett volna lennie, az teljes katasztrófává vált:

* Az első tesztek azt mutatták, hogy minden rendben működik
* Néhány órával később a PayPal váratlanul minden előfizetéses fizetést blokkolt értesítés nélkül
* Az ügyfelek nem tudtak fizetni, ami zavart és támogatási terhet okozott
* A PayPal ügyfélszolgálat ellentmondásos válaszokat adott, azt állítva, hogy a fiókok ellenőrizve vannak
* Kénytelenek voltunk teljesen leállítani a PayPal fizetéseket

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Az a hiba, amit az ügyfelek láttak fizetés közben – sem magyarázat, sem napló, semmi
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  A PayPal ügyfélszolgálat azt állítja, hogy minden rendben van, miközben a fizetések teljesen működésképtelenek. Az utolsó üzenetben azt mondják, hogy "visszaállítottak néhány funkciót", de még mindig további meg nem határozott információkat kérnek – klasszikus PayPal ügyfélszolgálati színház
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Az azonosítási folyamat, ami állítólag semmit sem "javított"
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Homályos üzenet és még mindig nincs megoldás. Nulla információ, értesítés vagy bármi arról, hogy milyen további információkra van szükség. Az ügyfélszolgálat elhallgat.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Miért nem dobhatjuk el egyszerűen a PayPalt {#why-we-cant-just-drop-paypal}

Mindezek ellenére nem hagyhatjuk el teljesen a PayPalt, mert egyes ügyfeleknek csak a PayPal áll rendelkezésre fizetési lehetőségként. Ahogy egy ügyfél mondta a [státusz oldalunkon](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> A PayPal az egyetlen fizetési lehetőségem

**Egy hibás platformot vagyunk kénytelenek támogatni, mert a PayPal fizetési monopóliumot hozott létre bizonyos felhasználók számára.**


## A közösség megoldása {#the-community-workaround}

Mivel a PayPal nem biztosít alapvető előfizetés-listázási funkciót, a fejlesztői közösség megoldásokat épített. Készítettünk egy szkriptet, amely segít kezelni a PayPal előfizetéseket: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Ez a szkript hivatkozik egy [közösségi gistre](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), ahol a fejlesztők megosztják a megoldásokat. A felhasználók valójában [köszönetet mondanak nekünk](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) azért, amit a PayPal évekkel ezelőtt kellett volna megépítenie.


## PayPal sablonok blokkolása adathalászat miatt {#blocking-paypal-templates-due-to-phishing}

A problémák túlmutatnak az API-kon. A PayPal e-mail sablonjai annyira rosszul vannak megtervezve, hogy kénytelenek voltunk speciális szűrést bevezetni az e-mail szolgáltatásunkban, mert megkülönböztethetetlenek az adathalász kísérletektől.

### Az igazi probléma: a PayPal sablonjai csalásnak tűnnek {#the-real-problem-paypals-templates-look-like-scams}

Rendszeresen kapunk jelentéseket olyan PayPal e-mailekről, amelyek pontosan úgy néznek ki, mint az adathalász kísérletek. Íme egy valós példa az visszaélésekről szóló jelentéseinkből:

**Tárgy:** `[Sandbox] TESZT - Új számla a PaypalBilling434567 sandbox #A4D369E8-0001`

Ezt az e-mailt továbbították az `abuse@microsoft.com` címre, mert adathalász kísérletnek tűnt. A probléma? Valójában a PayPal sandbox környezetéből származott, de a sablontervük annyira rossz, hogy kiváltja az adathalászat-észlelő rendszereket.

### A mi megvalósításunk {#our-implementation}

Megtekintheted a PayPal-specifikus szűrésünket a [levelező szűrő kódunkban](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Miért kellett blokkolnunk a PayPalt {#why-we-had-to-block-paypal}

Ezt azért vezettük be, mert a PayPal megtagadta a hatalmas spam/adathalászat/csalás problémák javítását annak ellenére, hogy többször is jelentettük azokat az ő visszaélés kezelő csapataiknak. A blokkolt e-mail típusok a következők:

* **RT000238** - Gyanús számla értesítések
* **PPC001017** - Problémás fizetési visszaigazolások
* **RT000542** - Ajándéküzenet hack kísérletek

### A probléma mérete {#the-scale-of-the-problem}

A spam szűrési naplóink mutatják a hatalmas mennyiségű PayPal számla spamet, amit naponta feldolgozunk. A blokkolt tárgyak példái:

* "Számla a PayPal Billing Team-től:- Ez a díj automatikusan levonásra kerül a számládról. Kérjük, azonnal lépj kapcsolatba velünk a \[TELEFONSZÁM] számon"
* "Számla a \[CÉGNÉV] részéről (\[RENDELÉSI AZONOSÍTÓ])"
* Több változat különböző telefonszámokkal és hamis rendelési azonosítókkal
Ezek az e-mailek gyakran `outlook.com` hosztokról érkeznek, de úgy tűnik, hogy a PayPal legitim rendszereiből származnak, ami különösen veszélyessé teszi őket. Az e-mailek átmennek az SPF, DKIM és DMARC hitelesítésen, mert a PayPal valódi infrastruktúráján keresztül küldik őket.

Műszaki naplóink azt mutatják, hogy ezek a spam e-mailek tartalmaznak legitim PayPal fejlécet:

* `X-Email-Type-Id: RT000238` (ugyanaz az azonosító, amit blokkolunk)
* `From: "service@paypal.com" <service@paypal.com>`
* Érvényes DKIM aláírások a `paypal.com`-tól
* Megfelelő SPF rekordok, amelyek a PayPal levelezőszervereit mutatják

Ez lehetetlen helyzetet teremt: a legitim PayPal e-mailek és a spamek műszakilag azonos jellemzőkkel bírnak.

### A Szarkazmus {#the-irony}

A PayPal, amelynek vezetnie kellene a pénzügyi csalások elleni harcot, olyan rosszul megtervezett e-mail sablonokat használ, hogy azok kiváltják az adathalászat elleni rendszereket. Kénytelenek vagyunk blokkolni a legitim PayPal e-maileket, mert megkülönböztethetetlenek a csalásoktól.

Ezt dokumentálja a biztonsági kutatás is: [Vigyázat a PayPal új cím csalásra](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – amely bemutatja, hogyan használják ki a PayPal saját rendszereit csalásra.

### Valós Hatás: Új PayPal Csalások {#real-world-impact-novel-paypal-scams}

A probléma túlmutat a rossz sablontervezésen. A PayPal számlázási rendszere annyira könnyen kihasználható, hogy a csalók rendszeresen visszaélnek vele, és legitimnek tűnő hamis számlákat küldenek. Gavin Anderegg biztonsági kutató dokumentálta [Egy új PayPal csalást](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), ahol a csalók valódi PayPal számlákat küldenek, amelyek minden hitelesítési ellenőrzést átmennek:

> „A forrás ellenőrzésekor az e-mail úgy nézett ki, mintha valóban a PayPaltól származna (SPF, DKIM és DMARC mind átment). A gomb is egy legitim PayPal URL-re mutatott... Egy pillanatig tartott rájönni, hogy ez egy legitim e-mail. Éppen egy véletlenszerű 'számlát' kaptam egy csalótól.”

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Képernyőkép, amely több hamis PayPal számlát mutat, amelyek egy postaládát elárasztanak, mind legitimnek tűnnek, mert valójában a PayPal rendszereiből érkeznek
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal csalás figyelmeztető képernyőkép" class="rounded-lg" />
</figure>

A kutató megjegyezte:

> „Úgy tűnik, ez egy kényelmi funkció is, amit a PayPalnak érdemes lenne lezárnia. Azonnal azt feltételeztem, hogy valamilyen csalásról van szó, és csak a műszaki részletek érdekeltek. Ez túl könnyen kivitelezhetőnek tűnik, és aggódom, hogy mások is bedőlhetnek neki.”

Ez tökéletesen illusztrálja a problémát: a PayPal saját legitim rendszerei annyira rosszul vannak megtervezve, hogy lehetővé teszik a csalást, miközben a legitim kommunikációkat gyanúsnak tüntetik fel.

Ráadásul ez rontotta a kézbesíthetőségünket a Yahoo-nál, ami ügyfélpanaszokhoz és órákig tartó alapos teszteléshez, valamint mintázatellenőrzéshez vezetett.


## A PayPal Fordított KYC Folyamata {#paypals-backwards-kyc-process}

A PayPal platform egyik legfrusztrálóbb aspektusa a megfelelés és az Ügyfél-azonosítás (KYC) eljárásainak fordított megközelítése. Ellentétben minden más fizetési szolgáltatóval, a PayPal lehetővé teszi a fejlesztők számára, hogy integrálják az API-jukat és elkezdjenek fizetéseket fogadni éles környezetben, mielőtt a megfelelő ellenőrzést elvégeznék.

### Hogyan Kellene Működnie {#how-it-should-work}

Minden legitim fizetési szolgáltató a következő logikus sorrendet követi:

1. **Először a KYC ellenőrzés elvégzése**
2. **A kereskedői fiók jóváhagyása**
3. **Éles API hozzáférés biztosítása**
4. **Fizetések fogadásának engedélyezése**

Ez védi mind a fizetési szolgáltatót, mind a kereskedőt azzal, hogy biztosítja a megfelelést, mielőtt pénzmozgás történik.

### Hogyan Működik Valójában a PayPal {#how-paypal-actually-works}

A PayPal folyamata teljesen fordított:

1. **Azonnal biztosít éles API hozzáférést**
2. **Órákig vagy napokig engedi a fizetések fogadását**
3. **Hirtelen blokkolja a fizetéseket értesítés nélkül**
4. **KYC dokumentációt követel meg, miután az ügyfelek már érintettek**
5. **Nem értesíti a kereskedőt**
6. **Hagyja, hogy az ügyfelek fedezzék fel a problémát és jelentsék azt**
### A valós világ hatása {#the-real-world-impact}

Ez a visszafelé zajló folyamat katasztrófákat okoz a vállalkozások számára:

* **Az ügyfelek nem tudják befejezni a vásárlásokat** a csúcsidőszakokban
* **Nincs előzetes figyelmeztetés** arról, hogy ellenőrzés szükséges
* **Nincsenek e-mail értesítések**, amikor a fizetéseket blokkolják
* **A kereskedők a problémákról összezavarodott ügyfelektől értesülnek**
* **Bevételkiesés** kritikus üzleti időszakokban
* **Az ügyfélbizalom sérülése**, amikor a fizetések rejtélyesen meghiúsulnak

### A 2025 júliusi fiókátviteli katasztrófa {#the-july-2025-account-migration-disaster}

Pontosan ez a forgatókönyv játszódott le a szokásos fiókátvitelünk során 2025 júliusában. A PayPal eleinte engedélyezte a fizetéseket, majd hirtelen értesítés nélkül blokkolta azokat. Csak akkor fedeztük fel a problémát, amikor az ügyfelek elkezdték jelezni, hogy nem tudnak fizetni.

Amikor felvettük a kapcsolatot az ügyfélszolgálattal, ellentmondásos válaszokat kaptunk arról, hogy milyen dokumentáció szükséges, és nem volt világos határidő a megoldásra. Ez arra kényszerített minket, hogy teljesen leállítsuk a PayPal fizetéseket, ami összezavarta az ügyfeleket, akiknek nem volt más fizetési lehetőségük.

### Miért fontos ez {#why-this-matters}

A PayPal megfelelőségi megközelítése alapvető félreértést mutat arról, hogyan működnek a vállalkozások. A megfelelő KYC-nek **a termelési integráció előtt** kell megtörténnie, nem pedig akkor, amikor az ügyfelek már fizetni próbálnak. Az, hogy nincs proaktív kommunikáció a problémák felmerülésekor, azt mutatja, hogy a PayPal nincs összhangban a kereskedők igényeivel.

Ez a visszafelé zajló folyamat a PayPal szélesebb körű szervezeti problémáinak tünete: a belső folyamataikat helyezik előtérbe a kereskedői és ügyfélélmény helyett, ami olyan működési katasztrófákhoz vezet, amelyek elriasztják a vállalkozásokat a platformtól.


## Hogyan csinálják jól a többi fizetési szolgáltatók {#how-every-other-payment-processor-does-it-right}

Az előfizetés-listázási funkció, amit a PayPal megtagad a bevezetéstől, több mint egy évtizede iparági szabvány. Így kezelik ezt az alapvető követelményt más fizetési szolgáltatók:

### Stripe {#stripe}

A Stripe az API indítása óta rendelkezik előfizetés-listázással. Dokumentációjuk világosan bemutatja, hogyan lehet lekérni az összes előfizetést egy ügyfél vagy kereskedői fiók számára. Ezt alapvető CRUD funkciónak tekintik.

### Paddle {#paddle}

A Paddle átfogó előfizetés-kezelő API-kat kínál, beleértve a listázást, szűrést és lapozást. Értik, hogy a kereskedőknek látnia kell a visszatérő bevételi forrásaikat.

### Coinbase Commerce {#coinbase-commerce}

Még a kriptovaluta fizetési szolgáltatók, mint a Coinbase Commerce is jobb előfizetés-kezelést nyújtanak, mint a PayPal.

### Square {#square}

A Square API-ja az előfizetés-listázást alapvető funkcióként tartalmazza, nem utólagos gondolatként.

### Az iparági szabvány {#the-industry-standard}

Minden modern fizetési szolgáltató biztosítja:

* Az összes előfizetés listázását
* Szűrést státusz, dátum, ügyfél szerint
* Lapozást nagy adathalmazokhoz
* Webhook értesítéseket előfizetés-változásokról
* Átfogó dokumentációt működő példákkal

### Amit a többi szolgáltató nyújt vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Az összes előfizetés listázása:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Szűrés ügyfél szerint:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Szűrés státusz szerint:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Amit valójában kapsz:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# CSAK EGY előfizetést kaphatsz, ha már ismered az ID-t
# NINCS végpont az összes előfizetés listázására
# NINCS mód keresésre vagy szűrésre
# Minden előfizetés ID-t neked kell nyomon követned
```

**PayPal elérhető végpontjai:**

* `POST /v1/billing/subscriptions` - Előfizetés létrehozása
* `GET /v1/billing/subscriptions/{id}` - EGY előfizetés lekérése (ha ismered az ID-t)
* `PATCH /v1/billing/subscriptions/{id}` - Előfizetés frissítése
* `POST /v1/billing/subscriptions/{id}/cancel` - Előfizetés lemondása
* `POST /v1/billing/subscriptions/{id}/suspend` - Előfizetés felfüggesztése
**Mi hiányzik a PayPalból:**

* ❌ Nincs `GET /v1/billing/subscriptions` (összes listázása)
* ❌ Nincs keresési funkció
* ❌ Nincs szűrés státusz, ügyfél, dátum szerint
* ❌ Nincs lapozási támogatás

A PayPal az egyetlen nagy fizetési szolgáltató, amely arra kényszeríti a fejlesztőket, hogy manuálisan kövessék a feliratkozási azonosítókat a saját adatbázisaikban.


## A PayPal rendszerszintű eltussolása: 6 millió hang elnémítása {#paypals-systematic-cover-up-silencing-6-million-voices}

Egy lépésben, amely tökéletesen összefoglalja a PayPal kritikakezelési módszerét, nemrég teljes közösségi fórumukat leállították, ezzel több mint 6 millió tagot némítva el, és több százezer, a hibáikat dokumentáló bejegyzést törölve.

### A nagy eltörlés {#the-great-erasure}

Az eredeti PayPal Közösség a `paypal-community.com` oldalon **6 003 558 tagot** foglalt magában, és több százezer bejegyzést, hibajelentést, panaszt és vitát tartalmazott a PayPal API hibáiról. Ez több mint egy évtizednyi dokumentált bizonyítékot jelentett a PayPal rendszerszintű problémáiról.

2025. június 30-án a PayPal csendben leállította az egész fórumot. Minden `paypal-community.com` link most 404-es hibát ad vissza. Ez nem migráció vagy frissítés volt.

### A harmadik fél általi mentés {#the-third-party-rescue}

Szerencsére egy harmadik fél szolgáltatás a [ppl.lithium.com](https://ppl.lithium.com/) megőrzött némi tartalmat, így hozzáférhetünk azokhoz a vitákhoz, amelyeket a PayPal el akart rejteni. Ez a harmadik fél általi megőrzés azonban hiányos, és bármikor eltűnhet.

Ez a bizonyítékok eltüntetésének mintázata nem új a PayPal számára. Dokumentált múltjuk van:

* Kritikus hibajelentések eltávolítása a nyilvánosság elől
* Fejlesztői eszközök értesítés nélküli megszüntetése
* API-k dokumentáció nélküli megváltoztatása
* Közösségi viták elnémítása a hibáikról

A fórum leállítása a legnyíltabb kísérlet arra, hogy rendszerszintű hibáikat elrejtsék a nyilvánosság elől.


## A 11 éves capture bug katasztrófa: 1 899 dollár és még mindig nő {#the-11-year-capture-bug-disaster-1899-and-counting}

Miközben a PayPal visszajelzési üléseket szervezett és ígéreteket tett, alapvető fizetési feldolgozó rendszerük több mint 11 éve alapvetően hibás. A bizonyítékok lesújtóak.

### A Forward Email 1 899 dolláros vesztesége {#forward-emails-1899-loss}

A termelési rendszereinkben 108 PayPal fizetést találtunk, összesen **1 899 dollár értékben**, amelyeket a PayPal capture hibái miatt veszítettünk el. Ezek a fizetések következetes mintát mutatnak:

* `CHECKOUT.ORDER.APPROVED` webhookokat kaptunk
* A PayPal capture API 404-es hibákat adott vissza
* A megrendelések elérhetetlenné váltak a PayPal API-n keresztül

Lehetetlen megállapítani, hogy az ügyfeleket megterhelték-e, mivel a PayPal 14 nap után teljesen elrejti a hibakeresési naplókat, és törli az összes adatot a műszerfalról azoknál a megrendelésazonosítóknál, amelyeket nem sikerült capture-ölni.

Ez csak egy vállalkozás vesztesége. **A több ezer kereskedő összesített vesztesége több mint 11 év alatt valószínűleg millió dollárokban mérhető.**

**Még egyszer megismételjük: a több ezer kereskedő összesített vesztesége több mint 11 év alatt valószínűleg millió dollárokban mérhető.**

Az egyetlen ok, hogy ezt felfedeztük, az, hogy rendkívül aprólékosak és adatvezéreltek vagyunk.

### Az eredeti 2013-as jelentés: több mint 11 év gondatlanság {#the-2013-original-report-11-years-of-negligence}

A probléma legkorábbi dokumentált jelentése [a Stack Overflow-n 2013 novemberében](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) található ([archivált](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "404-es hibát kapok a REST API-nál capture végrehajtásakor"

A 2013-ban jelentett hiba **azonos** azzal, amit a Forward Email 2024-ben tapasztalt:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "A kért erőforrásazonosító nem található",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

A közösség válasza 2013-ban beszédes volt:

> "Jelenleg jelentett probléma van a REST API-val. A PayPal dolgozik rajta."
**Több mint 11 év elteltével még mindig "dolgoznak rajta."**

### A 2016-os beismerés: A PayPal tönkretette a saját SDK-ját {#the-2016-admission-paypal-breaks-their-own-sdk}

2016-ban a PayPal saját GitHub tárolója dokumentálta a [nagyarányú sikertelen capture kísérleteket](https://github.com/paypal/PayPal-PHP-SDK/issues/660), amelyek az ő hivatalos PHP SDK-jukat érintették. A méret lenyűgöző volt:

> "2016.09.20. óta minden PayPal capture kísérlet 'INVALID_RESOURCE_ID - Requested resource ID was not found.' hibával sikertelen. 09.19. és 09.20. között nem történt változtatás az API integráción. **A 09.20. óta történt capture kísérletek 100%-a ezt a hibát adta vissza.**"

Egy kereskedő így számolt be:

> "Az elmúlt 24 órában **több mint 1400 sikertelen capture kísérletem volt**, mind az INVALID_RESOURCE_ID hibaválasszal."

A PayPal kezdeti válasza az volt, hogy a kereskedőt hibáztatták és technikai támogatáshoz irányították. Csak hatalmas nyomás alatt ismerték el a hibát:

> "Frissítésem van a termékfejlesztőinktől. Észrevették a küldött fejlécben, hogy a PayPal-Request-ID 42 karakter hosszú, de **úgy tűnik, egy nemrégiben történt változás ezt az azonosítót csak 38 karakterre korlátozza.**"

Ez a beismerés felfedi a PayPal szisztematikus hanyagságát:

1. **Dokumentálatlan törő változtatásokat hajtottak végre**
2. **Saját hivatalos SDK-jukat tették tönkre**
3. **Először a kereskedőket hibáztatták**
4. **Csak nyomás hatására ismerték el a hibát**

Még az "javítás" után is a kereskedők arról számoltak be:

> "Frissítettem az SDK-t v1.7.4-re és **a probléma még mindig fennáll.**"

### A 2024-es eszkaláció: Még mindig hibás {#the-2024-escalation-still-broken}

A PayPal közösség megőrzött jelentései szerint a probléma valójában súlyosbodott. Egy [2024 szeptemberi beszélgetés](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivált](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentálja ugyanazokat a problémákat:

> "A probléma kb. 2 hete kezdődött és nem érint minden rendelést. **A sokkal gyakoribb hiba a capture 404-es hibája.**"

A kereskedő ugyanazt a mintát írja le, amit a Forward Email tapasztalt:

> "A rendelés capture kísérlete után a PayPal 404-et ad vissza. A rendelés részleteinek lekérésekor: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Ez anélkül történik, hogy bármilyen sikeres capture nyoma lenne nálunk.**"

### A webhook megbízhatósági katasztrófa {#the-webhook-reliability-disaster}

Egy másik [megőrzött közösségi beszélgetés](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) feltárja, hogy a PayPal webhook rendszere alapvetően megbízhatatlan:

> "Elméletileg két eseménynek kellene érkeznie (CHECKOUT.ORDER.APPROVED és PAYMENT.CAPTURE.COMPLETED) a webhook eseményekből. Valójában **ezeket az eseményeket ritkán kapjuk meg azonnal, a PAYMENT.CAPTURE.COMPLETED-et legtöbbször nem kapjuk meg vagy csak néhány óra múlva.**"

Előfizetéses fizetések esetén:

> "**A 'PAYMENT.SALE.COMPLETED' néha nem érkezik meg vagy csak néhány óra múlva.**"

A kereskedő kérdései feltárják a PayPal megbízhatósági problémáinak mélységét:

1. **"Miért történik ez?"** - A PayPal webhook rendszere alapvetően hibás
2. **"Ha a rendelés státusza 'COMPLETED', feltételezhetem, hogy megkaptam a pénzt?"** - A kereskedők nem bízhatnak a PayPal API válaszaiban
3. **"Miért nem találok semmilyen naplót az 'Eseménynaplók->Webhook események' között?"** - Még a PayPal saját naplózó rendszere sem működik

### A szisztematikus hanyagság mintázata {#the-pattern-of-systematic-negligence}

A bizonyítékok több mint 11 évre nyúlnak vissza és egyértelmű mintát mutatnak:

* **2013**: "A PayPal dolgozik rajta"
* **2016**: A PayPal beismeri a törő változást, hibás javítást ad
* **2024**: Ugyanazok a hibák továbbra is fennállnak, érintve a Forward Emailt és számtalan másikat

Ez nem egy hiba - **ez szisztematikus hanyagság.** A PayPal több mint egy évtizede tud ezekről a kritikus fizetésfeldolgozási hibákról, és következetesen:
1. **A kereskedőket hibáztatta a PayPal hibáiért**
2. **Dokumentálatlan, működést megszakító változtatásokat vezetett be**
3. **Nem megfelelő javításokat nyújtott, amelyek nem működnek**
4. **Figyelmen kívül hagyta az üzletekre gyakorolt pénzügyi hatást**
5. **Elrejtette a bizonyítékokat a közösségi fórumok eltávolításával**

### A dokumentálatlan követelmény {#the-undocumented-requirement}

A PayPal hivatalos dokumentációjában sehol sem említik, hogy a kereskedőknek újrapróbálkozási logikát kell bevezetniük a capture műveletekhez. Dokumentációjuk szerint a kereskedőknek „azonnal jóvá kell hagyniuk a capture-t”, de nem említik, hogy az API véletlenszerűen 404-es hibákat ad vissza, amelyek összetett újrapróbálkozási mechanizmusokat igényelnek.

Ez minden kereskedőt arra kényszerít, hogy:

* Exponenciális visszalépéses újrapróbálkozási logikát valósítson meg
* Kezelje az inkonzisztens webhook kézbesítést
* Összetett állapotkezelő rendszereket építsen
* Kézzel figyelje a sikertelen capture műveleteket

**Minden más fizetési szolgáltató megbízható capture API-kat biztosít, amelyek elsőre működnek.**


## A PayPal szélesebb megtévesztési mintázata {#paypals-broader-pattern-of-deception}

A capture hibakatasztrófa csak egy példa a PayPal rendszerszintű megközelítésére, amellyel megtéveszti az ügyfeleket és elrejti a hibáit.

### A New York-i Pénzügyi Szolgáltatások Minisztériumának intézkedése {#the-new-york-department-of-financial-services-action}

2025 januárjában a New York-i Pénzügyi Szolgáltatások Minisztériuma [intézkedést hozott a PayPal ellen](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) megtévesztő gyakorlatok miatt, bizonyítva, hogy a PayPal megtévesztési mintázata messze túlmutat az API-kon.

Ez a szabályozói intézkedés azt mutatja, hogy a PayPal kész megtévesztő gyakorlatokat folytatni az egész üzletágában, nem csak a fejlesztői eszközeiben.

### A Honey per: Affiliate linkek átírása {#the-honey-lawsuit-rewriting-affiliate-links}

A PayPal Honey felvásárlása [peres ügyekhez vezetett, amelyek szerint a Honey átírja az affiliate linkeket](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), ellopva a jutalékokat a tartalomkészítőktől és influencerektől. Ez egy újabb rendszerszintű megtévesztési forma, ahol a PayPal azáltal profitál, hogy átirányítja a bevételeket, amelyek másokhoz kellene, hogy kerüljenek.

A mintázat egyértelmű:

1. **API hibák**: Elrejtik a hibás funkciókat, a kereskedőket hibáztatják
2. **Közösség elhallgattatása**: Eltávolítják a problémák bizonyítékait
3. **Szabályozói jogsértések**: Megtévesztő gyakorlatokat folytatnak
4. **Affiliate lopás**: Technikai manipulációval lopják a jutalékokat

### A PayPal hanyagságának költsége {#the-cost-of-paypals-negligence}

A Forward Email 1 899 dolláros vesztesége csak a jéghegy csúcsa. Vegyük figyelembe a szélesebb hatást:

* **Egyéni kereskedők**: Több ezer kereskedő, akik százaktól ezer dollárokig veszteséget szenvednek el
* **Vállalati ügyfelek**: Potenciálisan milliós bevételkiesés
* **Fejlesztői idő**: Számtalan óra, amit a PayPal hibás API-jainak megkerülésére fordítanak
* **Ügyfélbizalom**: Üzletek veszítenek ügyfeleket a PayPal fizetési hibái miatt

Ha egy kis e-mail szolgáltatás majdnem 2 000 dollárt veszített, és ez a probléma több mint 11 éve fennáll, több ezer kereskedőt érintve, a kollektív pénzügyi kár valószínűleg **többszáz millió dollár**.

### A dokumentáció hazugsága {#the-documentation-lie}

A PayPal hivatalos dokumentációja következetesen elmulasztja megemlíteni azokat a kritikus korlátokat és hibákat, amelyekkel a kereskedők szembesülnek. Például:

* **Capture API**: Nem említi, hogy a 404-es hibák gyakoriak és újrapróbálkozási logikát igényelnek
* **Webhook megbízhatóság**: Nem említi, hogy a webhookok gyakran órákig késnek
* **Előfizetés lista**: A dokumentáció azt sugallja, hogy a lista lekérdezhető, miközben nincs ilyen végpont
* **Munkamenet időtúllépések**: Nem említi az agresszív 60 másodperces időtúllépéseket

Ez a kritikus információk szisztematikus elhallgatása arra kényszeríti a kereskedőket, hogy a PayPal korlátait próbálgatással fedezzék fel éles rendszerekben, ami gyakran pénzügyi veszteségekhez vezet.


## Mit jelent ez a fejlesztők számára {#what-this-means-for-developers}

A PayPal rendszerszintű mulasztása az alapvető fejlesztői igények kezelésében, miközben széles körű visszajelzéseket gyűjt, alapvető szervezeti problémát jelez. A visszajelzések gyűjtését a problémák tényleges megoldásának helyettesítőjeként kezeli.
A minta világos:

1. A fejlesztők problémákat jelentenek
2. A PayPal vezetőkkel szervez visszajelzési üléseket
3. Kiterjedt visszajelzést adnak
4. A csapatok elismerik a hiányosságokat és megígérik, hogy „követik és kezelik” azokat
5. Semmi sem valósul meg
6. A vezetők jobb cégekhez távoznak
7. Az új csapatok ugyanazt a visszajelzést kérik
8. A ciklus ismétlődik

Közben a fejlesztők kénytelenek megoldásokat építeni, kompromisszumot kötni a biztonság terén, és hibás felhasználói felületekkel küzdeni csak azért, hogy elfogadják a fizetéseket.

Ha fizetési rendszert építesz, tanulj a tapasztalatainkból: építsd fel a [hárompontos megközelítésedet](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) több feldolgozóval, de ne várd el, hogy a PayPal biztosítsa az alapvető funkciókat, amikre szükséged van. Tervezd meg, hogy az első naptól kezdve megoldásokat kell építened.

> Ez a bejegyzés a PayPal API-kal kapcsolatos 11 éves tapasztalatunkat dokumentálja a Forward Emailnél. Minden kódpélda és link a tényleges éles rendszereinkből származik. Ezek ellenére továbbra is támogatjuk a PayPal fizetéseket, mert néhány ügyfélnek nincs más lehetősége

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
