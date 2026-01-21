# A PayPal 11 éves API-katasztrófája: Hogyan dolgoztunk ki kerülő megoldásokat, miközben ők figyelmen kívül hagyták a fejlesztőket {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="lekerekített-lg" />

<p class="lead mt-3">A Forward Emailnél több mint egy évtizede küzdünk a PayPal hibás API-jaival. Ami apró frusztrációként indult, az teljes katasztrófává fajult, ami arra kényszerített minket, hogy saját megoldásokat dolgozzunk ki, blokkoljuk az adathalász sablonokat, és végül leállítsuk az összes PayPal-fizetést egy kritikus fiókmigráció során.</p>
<p class="lead mt-3">Ez a PayPal 11 évének története, amely során figyelmen kívül hagyta az alapvető fejlesztői igényeket, miközben mi mindent megpróbáltunk, hogy a platformjuk működjön.</p>

## Tartalomjegyzék {#table-of-contents}

* [A hiányzó darab: Nincs mód az előfizetések listázására](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Felbukkan a probléma](#2014-2017-the-problem-emerges)
* [2020: Kiterjedt visszajelzést adunk nekik](#2020-we-give-them-extensive-feedback)
  * [A 27 elemből álló visszajelzési lista](#the-27-item-feedback-list)
  * [Csapatok csatlakoztak, ígéretek hangzottak el](#teams-got-involved-promises-were-made)
  * [Az eredmény? Semmi.](#the-result-nothing)
* [A vezetői kivonulás: Hogyan veszítette el a PayPal minden intézményi emlékezetét](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Új vezetés, ugyanazok a problémák](#2025-new-leadership-same-problems)
  * [Az új vezérigazgató bekapcsolódik](#the-new-ceo-gets-involved)
  * [Michelle Gill válasza](#michelle-gills-response)
  * [Válaszunk: Nincs több megbeszélés](#our-response-no-more-meetings)
  * [Marty Brodbeck túlmérnöki válasza](#marty-brodbecks-overengineering-response)
  * [Az „Egyszerű CRUD” ellentmondás](#the-simple-crud-contradiction)
  * [A kapcsolatvesztés egyértelművé válik](#the-disconnect-becomes-clear)
* [Évekig tartó hibajelentések, amiket figyelmen kívül hagytak](#years-of-bug-reports-they-ignored)
  * [2016: Korai UI/UX panaszok](#2016-early-uiux-complaints)
  * [2021: Üzleti e-mail hibajelentés](#2021-business-email-bug-report)
  * [2021: Felhasználói felület fejlesztésére vonatkozó javaslatok](#2021-ui-improvement-suggestions)
  * [2021: Sandbox környezeti hibák](#2021-sandbox-environment-failures)
  * [2021: A jelentéskészítő rendszer teljesen összeomlott](#2021-reports-system-completely-broken)
  * [2022: Hiányzik az alap API funkció (ismét)](#2022-core-api-feature-missing-again)
* [A fejlesztői élmény rémálma](#the-developer-experience-nightmare)
  * [Hibás felhasználói felület](#broken-user-interface)
  * [SDK-problémák](#sdk-problems)
  * [Tartalombiztonsági irányelvek megsértése](#content-security-policy-violations)
  * [Dokumentációs káosz](#documentation-chaos)
  * [Biztonsági sebezhetőségek](#security-vulnerabilities)
  * [Munkamenet-kezelési katasztrófa](#session-management-disaster)
* [2025. július: Az utolsó csepp a pohárban](#july-2025-the-final-straw)
* [Miért nem hagyhatjuk csak úgy el a PayPalt?](#why-we-cant-just-drop-paypal)
* [A közösségi megoldás](#the-community-workaround)
* [PayPal sablonok blokkolása adathalászat miatt](#blocking-paypal-templates-due-to-phishing)
  * [Az igazi probléma: A PayPal sablonjai átverésnek tűnnek](#the-real-problem-paypals-templates-look-like-scams)
  * [A mi megvalósításunk](#our-implementation)
  * [Miért kellett blokkolnunk a PayPalt](#why-we-had-to-block-paypal)
  * [A probléma mértéke](#the-scale-of-the-problem)
  * [Az irónia](#the-irony)
  * [Valós hatás: Újszerű PayPal-csalások](#real-world-impact-novel-paypal-scams)
* [A PayPal fordított KYC folyamata](#paypals-backwards-kyc-process)
  * [Hogyan kellene működnie](#how-it-should-work)
  * [Hogyan működik valójában a PayPal](#how-paypal-actually-works)
  * [A valós hatás](#the-real-world-impact)
  * [A 2025. júliusi fiókmigrációs katasztrófa](#the-july-2025-account-migration-disaster)
  * [Miért fontos ez?](#why-this-matters)
* [Hogyan csinálja jól minden más fizetési processzor](#how-every-other-payment-processor-does-it-right)
  * [Csík](#stripe)
  * [Evezős](#paddle)
  * [Coinbase Kereskedelem](#coinbase-commerce)
  * [Négyzet](#square)
  * [Az iparági szabvány](#the-industry-standard)
  * [Mit kínálnak más adatfeldolgozók a PayPal-lal szemben?](#what-other-processors-provide-vs-paypal)
* [A PayPal szisztematikus eltussolása: 6 millió hang elhallgattatása](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [A nagy törlés](#the-great-erasure)
  * [A harmadik fél általi mentés](#the-third-party-rescue)
* [A 11 éves capture bug katasztrófa: 1899 dollár és ez a szám még csak növekszik](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Az e-mail továbbítása 1899 dolláros veszteséget jelent](#forward-emails-1899-loss)
  * [A 2013-as eredeti jelentés: Több mint 11 évnyi hanyagság](#the-2013-original-report-11-years-of-negligence)
  * [A 2016-os beismerés: A PayPal feltörte a saját SDK-ját](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [A 2024-es eszkaláció: Még mindig hibás](#the-2024-escalation-still-broken)
  * [A webhook megbízhatósági katasztrófája](#the-webhook-reliability-disaster)
  * [A szisztematikus hanyagság mintázata](#the-pattern-of-systematic-negligence)
  * [A dokumentálatlan követelmény](#the-undocumented-requirement)
* [A PayPal megtévesztési mintázata szélesebb körben elterjedt](#paypals-broader-pattern-of-deception)
  * [A New York-i Pénzügyi Szolgáltatási Minisztérium akciója](#the-new-york-department-of-financial-services-action)
  * [A mézper: Partnerlinkek átírása](#the-honey-lawsuit-rewriting-affiliate-links)
  * [A PayPal hanyagságának ára](#the-cost-of-paypals-negligence)
  * [A dokumentációs hazugság](#the-documentation-lie)
* [Mit jelent ez a fejlesztők számára?](#what-this-means-for-developers)

## A hiányzó rész: Nincs mód az előfizetések listázására {#the-missing-piece-no-way-to-list-subscriptions}

Ami viszont megdöbbentő: a PayPal 2014 óta számláz előfizetések alapján, de soha nem biztosítottak lehetőséget a kereskedőknek arra, hogy listázzák a saját előfizetéseiket.

Gondolkozz el ezen egy pillanatra. Létrehozhatsz előfizetéseket, lemondhatod őket, ha megvan az azonosítód, de nem kaphatod meg a fiókodhoz tartozó összes aktív előfizetés listáját. Olyan ez, mintha egy adatbázisod lenne SELECT utasítás nélkül.

Az alapvető üzleti műveletekhez erre van szükségünk:

* Ügyfélszolgálat (amikor valaki e-mailben érdeklődik az előfizetésével kapcsolatban)
* Pénzügyi jelentések és egyeztetés
* Automatizált számlázáskezelés
* Megfelelőség és auditálás

De a PayPal? Egyszerűen... sosem fejlesztették ki.

## 2014-2017: Felmerül a probléma {#2014-2017-the-problem-emerges}

Az előfizetési listázással kapcsolatos probléma először a PayPal közösségi fórumain jelent meg 2017-ben. A fejlesztők a nyilvánvaló kérdést tették fel: „Hogyan kaphatom meg az összes előfizetésem listáját?”

A PayPal válasza? Tücskök.

A közösség tagjai elkezdtek frusztráltak lenni:

> „Nagyon furcsa mulasztás, ha egy kereskedő nem tudja listázni az összes aktív megállapodást. Ha a megállapodás azonosítója elveszik, az azt jelenti, hogy csak a felhasználó mondhatja le vagy függesztheti fel a megállapodást.” - leafspider

> „+1. Majdnem 3 éve történt.” - laudukang (ami azt jelenti, hogy a probléma ~2014 óta fennáll)

A 2017-es [eredeti közösségi bejegyzés](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) azt mutatja, hogy a fejlesztők könyörögnek ezért az alapvető funkcióért. A PayPal válasza az volt, hogy archiválta azt a tárhelyet, ahol az emberek jelentették a problémát.

## 2020: Kiterjedt visszajelzést adunk nekik {#2020-we-give-them-extensive-feedback}

2020 októberében a PayPal megkeresett minket egy hivatalos visszajelzési megbeszélés keretében. Ez nem egy kötetlen beszélgetés volt – egy 45 perces Microsoft Teams hívást szerveztek 8 PayPal-vezetővel, köztük Sri Shivanandával (műszaki igazgató), Edwin Aokival, Jim Magatsszal, John Kunzéval és másokkal.

### A 27 elemből álló visszajelzési lista {#the-27-item-feedback-list}

Felkészülten érkeztünk. Miután 6 órát próbálkoztunk az API-jaik integrációjával, 27 konkrét problémát gyűjtöttünk össze. Mark Stuart, a PayPal Checkout csapatától, ezt mondta:

> Szia Nick, köszönöm, hogy megosztottad ma mindenkivel! Szerintem ez katalizátorként szolgál majd ahhoz, hogy a csapatunk további támogatást és befektetést kapjon, hogy megoldhassuk ezeket a problémákat. Nehéz volt ilyen tartalmas visszajelzéseket kapni, mint amilyeneket eddig hagytál nekünk.

A visszajelzés nem elméleti jellegű volt – valós integrációs kísérletekből származott:

1. **A hozzáférési token generálása nem működik**:

> A hozzáférési tokenek generálása nem működik. Ezenkívül nem csak cURL példáknak kellene lenniük.

2. **Nincs webes felhasználói felület az előfizetés létrehozásához**:

> Hogy a csudába lehet előfizetéseket létrehozni anélkül, hogy cURL-t kellene használnod? Úgy tűnik, nincs webes felhasználói felület ehhez (mint a Stripe-nak).

Mark Stuart a hozzáférési token problémáját különösen aggasztónak találta:

> Általában nem hallunk problémákról a hozzáférési tokenek generálásával kapcsolatban.

### Csapatok vettek részt, ígéretek hangzottak el {#teams-got-involved-promises-were-made}

Ahogy egyre több problémát fedeztünk fel, a PayPal egyre több csapatot vett fel a beszélgetésbe. Darshan Raju, az Előfizetések kezelési felhasználói felületének csapatától csatlakozott, és a következőket mondta:

> Ismerd el a hiányosságot. Nyomon követjük és orvosoljuk. Köszönjük a visszajelzést!

A foglalkozás leírása szerint a következőket keresték:

> őszinte beszámoló a tapasztalataidról

hogy:

> a PayPalt olyanná kell tenni, amilyennek a fejlesztők számára lennie kellene.

### Az eredmény? Semmi. {#the-result-nothing}

A hivatalos visszajelzési ülés, a kiterjedt, 27 elemből álló lista, a több csapat bevonása és az ígéretek ellenére, amelyek a következőkre vonatkoznak:

> követés és cím

problémák, abszolút semmi sem lett megoldva.

## A vezetői exodus: Hogyan veszítette el a PayPal az összes intézményi emlékezetét {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

És itt jön be igazán az érdekesség. Mindenki, aki megkapta a 2020-as visszajelzésünket, elhagyta a PayPalt:

**Vezetői változások:**

* [Dan Schulman (vezérigazgató 9 évig) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (2023. szeptember)
* [Sri Shivananda (a visszajelzéseket szervező műszaki igazgató) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (2024. január)

**Műszaki vezetők, akik ígéreteket tettek, majd távoztak:**

* **Mark Stuart** (az ígért visszajelzés „katalizátorként” fog szolgálni) → IDEIGLENES_PLACEHOLDER_0
* **Jim Magats** (18 éves PayPal-veterán) → IDEIGLENES_PLACEHOLDER_1 (2022)
* **John Kunze** (globális fogyasztási cikkekért felelős alelnök) → IDEIGLENES_PLACEHOLDER_2 (2023)
* **Edwin Aoki** (az utolsók egyike) → IDEIGLENES_PLACEHOLDER_3 (2025. január)

A PayPal egy forgóajtóvá vált, ahol a vezetők fejlesztői visszajelzéseket gyűjtenek, ígéreteket tesznek, majd jobb cégekhez, például a JPMorganhoz, a Ripple-höz és más fintech cégekhez távoznak.

Ez magyarázza, hogy a 2025-ös GitHub-problémára adott válasz miért tűnt teljesen függetlennek a 2020-as visszajelzésünktől – szó szerint mindenki, aki megkapta ezt a visszajelzést, elhagyta a PayPalt.

## 2025: Új vezetés, ugyanazok a problémák {#2025-new-leadership-same-problems}

Ha előreugrunk 2025-re, pontosan ugyanaz a minta rajzolódik ki. Évekig tartó előrelépés nélkül a PayPal új vezetése ismét kapcsolatba lépett.

### Az új vezérigazgató bekapcsolódik {#the-new-ceo-gets-involved}

2025. június 30-án közvetlenül a PayPal új vezérigazgatójához, Alex Chrisshez fordultunk az ügyben. Válasza rövid volt:

> Szia Nick! – Köszönöm a hozzászólásodat és a visszajelzést. Michelle (cc'd) a csapatával együtt készen áll arra, hogy együttműködjenek veled és megbeszéljék ezt. Köszönöm -A

### Michelle Gill válasza {#michelle-gills-response}

Michelle Gill, a Kisvállalkozásokért és Pénzügyi Szolgáltatásokért felelős alelnök és vezérigazgató így válaszolt:

> Nagyon szépen köszönöm Nick, Alexet áthelyeztem a titkos másolat csoportba. Az előző bejegyzésed óta vizsgáljuk ezt az ügyet. Még a hét vége előtt felhívunk. Elküldenéd nekem az elérhetőségeidet, hogy az egyik kollégám felvehesse veled a kapcsolatot? Michelle

### Válaszunk: Nincs több megbeszélés {#our-response-no-more-meetings}

Elutasítottunk egy újabb találkozót, a következőképpen magyarázva csalódottságunkat:

> Köszönöm. Azonban nem érzem úgy, hogy egy telefonhívás bármit is eredményezne. Íme, miért... Korábban már felhívtam, és az sehová sem vezetett. Több mint 2 órát pazaroltam arra, hogy az egész csapattal és a vezetőséggel beszéljek, és semmi sem történt... Rengeteg e-mail oda-vissza. Semmi sem történt. A visszajelzések sehová sem vezettek. Évekig próbálkoztam, meghallgattak, és aztán sehová sem jutottam.

### Marty Brodbeck túlmérnöki válasza {#marty-brodbecks-overengineering-response}

Aztán Marty Brodbeck, a PayPal fogyasztói mérnöki részlegének vezetője megkereste:

> Szia Nick, Marty Brodbeck vagyok. Én vezetem a PayPal fogyasztói mérnöki feladatait, és én irányítottam a cég API-fejlesztését. Meg tudnánk beszélni veled és velem, hogy milyen problémával szembesülsz, és hogyan segíthetünk?

Amikor elmagyaráztuk az előfizetési listázási végpont egyszerű szükségességét, a válasza feltárta a pontos problémát:

> Köszönöm Nick, éppen egy egyetlen előfizetési API létrehozásán dolgozunk teljes SDK-val (teljes hibakezelést, eseményalapú előfizetés-követést és robusztus üzemidőt támogat), ahol a számlázás is külön API-ként van szétválasztva, hogy a kereskedők a válaszadáshoz ne kelljen több végponton keresztül koordinálniuk a folyamatot.

Ez pontosan a rossz megközelítés. Nincs szükségünk hónapokig tartó komplex architektúrára. Egyetlen egyszerű REST végpontra van szükségünk, amely listázza az előfizetéseket – valami olyasmire, aminek már 2014 óta léteznie kellett volna.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Az „Egyszerű CRUD” ellentmondás {#the-simple-crud-contradiction}

Amikor rámutattunk, hogy ez egy alapvető CRUD funkció, amelynek már 2014 óta léteznie kellett volna, Marty válasza sokatmondó volt:

> Az egyszerű Crud műveletek az alap API részét képezik barátom, szóval nem fog hónapokig tartó fejlesztést igényelni.

A PayPal TypeScript SDK, amely hónapokig tartó fejlesztés után jelenleg csak három végpontot támogat, a korábbi idővonalával együtt egyértelműen azt mutatja, hogy az ilyen projektek befejezése több hónapot vesz igénybe.

Ez a válasz azt mutatja, hogy nem érti a saját API-ját. Ha „az egyszerű CRUD műveletek az alap API részét képezik”, akkor hol van az előfizetési lista végpontja? Válaszoltunk:

> Ha „az egyszerű CRUD műveletek az alapvető API részét képezik”, akkor hol van az előfizetési listázási végpont? A fejlesztők 2014 óta kérik ezt az „egyszerű CRUD műveletet”. Már 11 éve. Minden más fizetési processzor az első naptól kezdve rendelkezett ezzel az alapvető funkcióval.

### A kapcsolat megszakadása egyértelművé válik {#the-disconnect-becomes-clear}

A 2025-ös Alex Chriss, Michelle Gill és Marty Brodbeck közötti eszmecserék ugyanazt a szervezeti működési zavart mutatják:

1. **Az új vezetésnek nincsenek ismeretei a korábbi visszajelzési megbeszélésekről**
2. **Ugyanazokat a túlbonyolított megoldásokat javasolják**
3. **Nem értik a saját API-korlátaikat**
4. **Több megbeszélést szeretnének ahelyett, hogy csak a problémát oldanák meg**

Ez a minta magyarázza, hogy a PayPal csapatai miért tűnnek teljesen elszakadva a 2020-ban kapott kiterjedt visszajelzésektől – azok az emberek, akik ezt a visszajelzést kapták, már nem élnek, és az új vezetés ugyanazokat a hibákat követi el.

## Évek óta figyelmen kívül hagyott hibajelentések {#years-of-bug-reports-they-ignored}

Nem csak hiányzó funkciókra panaszkodtunk. Aktívan jelentettük a hibákat, és megpróbáltunk segíteni a fejlesztésükben. Íme egy átfogó idővonal a dokumentált problémákról:

### 2016: Korai UI/UX panaszok {#2016-early-uiux-complaints}

Már 2016-ban is nyilvánosan megkerestük a PayPal vezetőségét, köztük Dan Schulmant is, a felhasználói felülettel és a használhatósággal kapcsolatos problémákkal kapcsolatban. Ez 9 évvel ezelőtt történt, és ugyanazok a felhasználói felülettel/felhasználói élménynel kapcsolatos problémák ma is fennállnak.

### 2021: Üzleti e-mail hibajelentés {#2021-business-email-bug-report}

2021 márciusában arról számoltunk be, hogy a PayPal üzleti e-mail rendszere helytelen lemondási értesítéseket küldött. Az e-mail sablon változói helytelenül jelenítettek meg, ami zavaró üzeneteket jelenített meg az ügyfeleknek.

Mark Stuart elismerte a problémát:

> Köszönöm Nick! Áttérek a BCC-re. @Prasy, a te csapatod felelős ezért az e-mailért, vagy tudod, hogy ki? A „Niftylettuce, LLC, többé nem számlázunk” szöveg miatt azt hiszem, hogy összekeveredett a címzett és az e-mail tartalma.

**Eredmény**: Tényleg kijavították ezt! Mark Stuart megerősítette:

> Épp most hallottam az értesítési csapattól, hogy az e-mail sablont kijavították és bevezették. Köszönjük, hogy jelentetted. Köszönjük!

Ez azt mutatja, hogy MEG KÉPESEK javítani a dolgokat, amikor akarják – csak a legtöbb problémánál inkább nem teszik.

### 2021: Felhasználói felület fejlesztésére vonatkozó javaslatok {#2021-ui-improvement-suggestions}

2021 februárjában részletes visszajelzést adtunk az irányítópult felhasználói felületéről, különösen a „PayPal legutóbbi tevékenység” részről:

> Szerintem a paypal.com irányítópultját, különösen a "PayPal legutóbbi tevékenységek" részt fejleszteni kellene. Szerintem nem kellene megjeleníteni a 0 dolláros ismétlődő fizetés "Létrehozva" állapotsorait - csak egy csomó extra sort ad hozzá, és nem lehet egy pillantással áttekinteni, hogy mennyi bevételt generált a nap/az elmúlt néhány nap.

Mark Stuart továbbította a fogyasztói termékekért felelős csapatnak:

> Köszönöm! Nem vagyok benne biztos, hogy melyik csapat felelős az Aktivitásért, de továbbítottam a fogyasztói termékek vezetőjének, hogy megtalálják a megfelelő csapatot. A 0,00 dolláros ismétlődő fizetés hibának tűnik. Valószínűleg ki kellene szűrni.

**Eredmény**: Soha nem javítva. A felhasználói felület továbbra is megjeleníti ezeket a haszontalan $0 bejegyzéseket.

### 2021: Sandbox környezeti hibák {#2021-sandbox-environment-failures}

2021 novemberében kritikus problémákat jelentettünk a PayPal tesztkörnyezetével kapcsolatban:

* A sandbox titkos API-kulcsai véletlenszerűen megváltoztak és letiltásra kerültek.
* Az összes sandbox tesztfiókot előzetes értesítés nélkül törölték.
* Hibaüzenetek jelentek meg a sandbox fiók adatainak megtekintésekor.
* Időszakos betöltési hibák.

> Valamiért a sandbox titkos API-kulcsom megváltozott és letiltásra került. Emellett az összes régi Sandbox tesztfiókomat is törölték.

> Néha betöltődik, néha nem. Ez elképesztően frusztráló.

**Eredmény**: Nincs válasz, nincs javítás. A fejlesztők továbbra is megbízhatósági problémákkal küzdenek a sandboxban.

### 2021: A jelentéskészítő rendszer teljesen összeomlott {#2021-reports-system-completely-broken}

2021 májusában arról számoltunk be, hogy a PayPal tranzakciós jelentések letöltési rendszere teljesen összeomlott:

> Úgy tűnik, a letöltések jelentése most sem működik, és egész nap sem. Valószínűleg e-mail értesítést is kellene kapnom, ha nem sikerül.

Rámutattunk a munkamenet-kezelési katasztrófára is:

> Továbbá, ha 5 percig inaktív vagy, miközben be vagy jelentkezve a PayPalba, kijelentkezteted magad. Tehát amikor újra frissíted a gombot a jelentés mellett, amelynek az állapotát ellenőrizni szeretnéd (miután egy örökkévalóságot vártál), kellemetlen lesz újra bejelentkezni.

Mark Stuart elismerte a munkamenet időtúllépésével kapcsolatos problémát:

> Emlékszem, hogy a múltban arról számoltál be, hogy a munkameneted gyakran lejárt és megzavarta a fejlesztési folyamatot, miközben az IDE és a developer.paypal.com vagy a kereskedői irányítópult között váltogattál, majd visszatértél és újra kijelentkeztettek.

**Eredmény**: A munkamenetek időtúllépései továbbra is 60 másodpercesek. A jelentéskészítő rendszer továbbra is rendszeresen leáll.

### 2022: Hiányzik az alap API-funkció (ismét) {#2022-core-api-feature-missing-again}

2022 januárjában ismét eszkaláltuk az előfizetési listával kapcsolatos problémát, ezúttal még részletesebben ismertetve a dokumentációjuk hibás voltát:

> Nincs olyan GET függvény, amely felsorolja az összes előfizetést (korábban számlázási szerződéseknek nevezték)

Felfedeztük, hogy a hivatalos dokumentációjuk teljesen pontatlan:

> Az API dokumentáció is teljesen pontatlan. Azt gondoltuk, hogy megkerülő megoldásként letölthetünk egy fixen kódolt listát az előfizetés-azonosítókról. De még ez sem működik!

> A hivatalos dokumentáció szerint... Azt mondják, ezt megteheted... Itt a lényeg - sehol sincs kipipálható "Előfizetés-azonosító" mező.

Christina Monti a PayPaltól így válaszolt:

> Elnézést kérünk a hibás lépések okozta kellemetlenségekért, a héten kijavítjuk.

Sri Shivananda (CTO) megköszönte nekünk:

> Köszönjük a folyamatos segítségedet, amivel jobbá teszel minket. Nagyra értékeljük.

**Eredmény**: A dokumentációt soha nem javították. Az előfizetési lista végpontját soha nem hozták létre.

## A fejlesztői élmény rémálma {#the-developer-experience-nightmare}

A PayPal API-jaival dolgozni olyan, mintha 10 évet visszamennénk az időben. Íme a dokumentált technikai problémák:

### Hibás felhasználói felület {#broken-user-interface}

A PayPal fejlesztői irányítópultja egy katasztrófa. Íme, mivel foglalkozunk nap mint nap:

<figure>
<figcaption><div class="alert alert-danger small text-center">
A PayPal felhasználói felülete annyira hibás, hogy még az értesítéseket sem lehet eltüntetni.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
A böngésződ nem támogatja a videó címkét.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
A fejlesztői irányítópulton szó szerint húzogatni kell egy csúszkát, majd 60 másodperc után kijelentkeztetni.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
A böngésződ nem támogatja a videó címkét.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
További felhasználói felületi katasztrófák a PayPal fejlesztői felületén, hibás munkafolyamatokkal
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
A böngésződ nem támogatja a videó címkét.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Az előfizetés-kezelő felület – a felület annyira rossz, hogy kódra kellett hagyatkoznunk a termékek és előfizetési csomagok generálásához.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
A hibás előfizetési felület nézete hiányzó funkciókkal (nem lehet könnyen termékeket/csomagokat/előfizetéseket létrehozni &ndash; és úgy tűnik, nincs mód a termékek vagy csomagok törlésére a felhasználói felületen a létrehozás után)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Tipikus PayPal hibaüzenetek - rejtélyesek és nem túl hasznosak
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problémák {#sdk-problems}

* Nem tudja egyszerre fizetni és előfizetni az egyszeri fizetéseket és az előfizetéseket is bonyolult kerülő megoldások nélkül, amelyek magukban foglalják a gombok cseréjét és újrarenderelését az SDK szkriptcímkékkel történő újratöltése során.
* A JavaScript SDK megsérti az alapvető konvenciókat (kisbetűs osztálynevek, nincs példányellenőrzés).
* A hibaüzenetek nem jelzik, hogy mely mezők hiányoznak.
* Inkonzisztens adattípusok (számok helyett karakterlánc-összegeket igényel).

### Tartalombiztonsági irányelvek megsértése {#content-security-policy-violations}

Az SDK-juk unsafe-inline és unsafe-eval funkciókat igényel a CSP-ben, **ami arra kényszerít, hogy veszélyeztesse webhelye biztonságát**.

### Dokumentációs káosz {#documentation-chaos}

Maga Mark Stuart is elismerte:

> Egyetértek, hogy abszurd mennyiségű régi és új API van. Nagyon nehéz megtalálni, amit keresni kellene (még nekünk is, akik itt dolgozunk).

### Biztonsági réseket {#security-vulnerabilities}

**A PayPal 2FA implementációja fordított.** Még ha a TOTP alkalmazások engedélyezve is vannak, akkor SMS-ellenőrzést kényszerítenek ki, ami sebezhetővé teszi a fiókokat a SIM-kártya-csere támadásokkal szemben. Ha a TOTP engedélyezve van, akkor kizárólag azt kellene használnia. A tartalék megoldásnak e-mailnek kell lennie, nem SMS-nek.

### Munkamenet-kezelési katasztrófa {#session-management-disaster}

**A fejlesztői irányítópultjuk 60 másodperc tétlenség után kijelentkeztet**. Ha bármi hasznos dolgot próbálsz csinálni, folyamatosan ezt a folyamatot kell végrehajtanod: bejelentkezés → captcha → 2FA → kijelentkezés → ismétlés. VPN-t használsz? Sok sikert!

## 2025. július: Az utolsó csepp a pohárban {#july-2025-the-final-straw}

11 évnyi ugyanazon problémák után a töréspont egy rutinszerű fiókmigráció során jött el. Új PayPal-számlára kellett átállnunk, hogy az megegyezzen a "Forward Email LLC" cégnevünkkel a tisztább könyvelés érdekében.

Aminek egyszerűnek kellett volna lennie, teljes katasztrófává vált:

* A kezdeti tesztek azt mutatták, hogy minden megfelelően működött.
* Órákkal később a PayPal hirtelen, előzetes értesítés nélkül blokkolta az összes előfizetési fizetést.
* Az ügyfelek nem tudtak fizetni, ami zavart és támogatási terhet okozott.
* A PayPal támogatása ellentmondásos válaszokat adott, azt állítva, hogy a fiókok ellenőrizve vannak.
* Kénytelenek voltunk teljesen leállítani a PayPal-fizetéseket.

<figure>
<figcaption><div class="alert alert-danger small text-center">
A hiba, amit az ügyfelek láttak fizetéskor - nincs magyarázat, nincsenek naplók, semmi
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
A PayPal ügyfélszolgálata azt állította, hogy minden rendben volt, miközben a fizetések teljesen hibásak voltak. Az utolsó üzenetben azt látják, hogy azt mondják, hogy "visszaállítottak néhány funkciót", de továbbra is további, meghatározatlan információkat kérnek - klasszikus PayPal támogatási színház
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="lekerekített-hosszú" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="lekerekített-hosszú" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
A személyazonosság-ellenőrzési folyamat, ami állítólag semmit sem "javított meg"
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="lekerekített-hosszú" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="lekerekített-hosszú" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="lekerekített-hosszú" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Homályos üzenet és továbbra sincs megoldás. Semmilyen információ, értesítés vagy bármi arról, hogy milyen további információkra van szükség. Az ügyfélszolgálat hallgat.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Miért nem tudjuk csak úgy elvetni a PayPalt {#why-we-cant-just-drop-paypal}

Mindezen problémák ellenére sem hagyhatjuk el teljesen a PayPalt, mivel egyes ügyfelek csak a PayPalt választhatják fizetési lehetőségként. Ahogy az egyik ügyfél mondta a [állapotoldal](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) oldalon:

> A PayPal az egyetlen fizetési lehetőségem

**Megragadtunk egy hibás platform támogatásával, mert a PayPal fizetési monopóliumot hozott létre bizonyos felhasználók számára.**

## Közösségi kerülő megoldás {#the-community-workaround}

Mivel a PayPal nem biztosít alapvető előfizetési listázási funkciókat, a fejlesztői közösség megkerülő megoldásokat dolgozott ki. Létrehoztunk egy szkriptet, amely segít a PayPal-előfizetések kezelésében: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Ez a szkript egy [közösségi lényeg](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)-ra hivatkozik, ahol a fejlesztők megosztják a megoldásaikat. A felhasználók valójában [megköszönve nekünk](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)-ként szerepelnek, mert olyan dolgokat kínálnak, amiket a PayPalnak évekkel ezelőtt kellett volna létrehoznia.

## PayPal-sablonok blokkolása adathalászat miatt {#blocking-paypal-templates-due-to-phishing}

A problémák túlmutatnak az API-kon. A PayPal e-mail sablonjai annyira rosszul vannak megtervezve, hogy speciális szűrést kellett bevezetnünk az e-mail szolgáltatásunkban, mivel ezek megkülönböztethetetlenek az adathalász kísérletektől.

### Az igazi probléma: A PayPal sablonjai átverésnek tűnnek {#the-real-problem-paypals-templates-look-like-scams}

Rendszeresen kapunk jelentéseket PayPal-os e-mailekről, amelyek pontosan adathalász kísérleteknek tűnnek. Íme egy valós példa a visszaélési jelentéseink közül:

**Tárgy:** IDEIGLENES_HELYTARTÓ_0

Ez az e-mail továbbításra került a `abuse@microsoft.com` címre, mert adathalász kísérletnek tűnt. Mi a probléma? Valójában a PayPal sandbox környezetéből érkezett, de a sablonjuk annyira gyenge, hogy elindítja az adathalászat-észlelő rendszereket.

### A mi implementációnk {#our-implementation}

A PayPal-specifikus szűrésünket a [e-mail szűrőkód](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) paraméterben láthatja:

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

Ezt azért vezettük be, mert a PayPal a visszaélésekkel foglalkozó csapatoknak küldött többszöri jelentéseink ellenére sem volt hajlandó kijavítani a hatalmas spam/adathalászat/csalási problémákat. Az általunk blokkolt konkrét e-mail típusok a következők:

* **RT000238** - Gyanús számlákkal kapcsolatos értesítések
* **PPC001017** - Problémás fizetési visszaigazolások
* **RT000542** - Ajándéküzenetek feltörési kísérletei

### A probléma mértéke {#the-scale-of-the-problem}

A spamszűrő naplóink azt mutatják, hogy naponta hatalmas mennyiségű PayPal-számlára érkező spam-et dolgozunk fel. A blokkolt témák például a következők:

* „Számla a PayPal számlázási csapatától:- Ez a tétel automatikusan terhelésre kerül a számlájáról. Kérjük, azonnal vegye fel velünk a kapcsolatot a következő telefonszámon: \[TELEFONSZÁM]”
* „Számla a következő cégtől: \[CÉGNÉV] (\[RENDELÉSI AZONOSÍTÓ])”
* Több változat különböző telefonszámokkal és hamis rendelési azonosítókkal

Ezek az e-mailek gyakran `outlook.com` hosztokról érkeznek, de úgy tűnik, hogy a PayPal legitim rendszereiből származnak, ami különösen veszélyessé teszi őket. Az e-mailek SPF, DKIM és DMARC hitelesítésen esnek át, mivel a PayPal tényleges infrastruktúráján keresztül küldik őket.

Technikai naplóink szerint ezek a spam e-mailek érvényes PayPal-fejléceket tartalmaznak:

* `X-Email-Type-Id: RT000238` (ugyanaz az azonosító, amit blokkolunk)
* `From: "service@paypal.com" <service@paypal.com>`
* Érvényes DKIM aláírások a `paypal.com`-től
* Megfelelő SPF-rekordok, amelyek a PayPal levelezőszervereit mutatják

Ez lehetetlen helyzetet teremt: a legitim PayPal e-mailek és a spam technikai jellemzői megegyeznek.

### Az irónia {#the-irony}

A PayPal, egy olyan vállalat, amelynek vezető szerepet kellene vállalnia a pénzügyi csalások elleni küzdelemben, olyan rosszul megtervezett e-mail sablonokkal rendelkezik, hogy adathalászat elleni rendszereket aktiválnak. Kénytelenek vagyunk blokkolni a legitim PayPal e-maileket, mivel azok megkülönböztethetetlenek a csalásoktól.

Ez a [Óvakodj a PayPal új címével kapcsolatos csalásoktól](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) biztonsági kutatásban dokumentálva van, amely bemutatja, hogyan használják ki a PayPal saját rendszereit csalásokra.

### Valós hatás: Új PayPal-csalások {#real-world-impact-novel-paypal-scams}

A probléma túlmutat a rossz sablontervezésen. A PayPal számlázási rendszerét annyira könnyű kihasználni, hogy a csalók rendszeresen visszaélnek vele, hogy legitimnek tűnő, csalárd számlákat küldjenek. Gavin Anderegg biztonsági kutató dokumentálta a [Egy újszerű PayPal-átverés](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) esetet, ahol a csalók valódi PayPal-számlákat küldenek, amelyek minden hitelesítési ellenőrzésen átmennek:

> „A forrást megvizsgálva úgy tűnt, hogy az e-mail valójában a PayPal-tól érkezett (az SPF, a DKIM és a DMARC is megfelelt). A gomb egy legitim PayPal URL-re is mutatott... Egy pillanatba telt, mire rájöttem, hogy ez egy legitim e-mail. Épp most kaptam egy véletlenszerű „számlát” egy csalótól.”

<figure>
<figcaption><div class="alert alert-danger small text-center">
Képernyőkép, amelyen több hamis PayPal-számla árasztja el a beérkező leveleket, amelyek mindegyike jogosnak tűnik, mivel valójában a PayPal rendszereiből származik.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

A kutató megjegyezte:

> „Úgy tűnik, ez egy olyan kényelmi funkció, amelynek a lezárását a PayPalnak meg kellene fontolnia. Azonnal azt hittem, hogy ez valami átverés, és csak a technikai részletek érdekeltek. Túl könnyűnek tűnik megvalósítani, és attól tartok, hogy mások bedőlhetnek neki.”

Ez tökéletesen illusztrálja a problémát: a PayPal saját legitim rendszerei annyira rosszul vannak megtervezve, hogy lehetővé teszik a csalást, miközben a legitim kommunikációt gyanúsnak tüntetik fel.

Ráadásul ez a Yahoo-val való kézbesítésünket is befolyásolta, ami ügyfélpanaszokhoz, valamint órákig tartó aprólékos teszteléshez és mintaellenőrzéshez vezetett.

## A PayPal fordított KYC folyamata {#paypals-backwards-kyc-process}

A PayPal platformjának egyik legfrusztrálóbb aspektusa a megfelelőségi és az „Ismerd meg az ügyfeledet” (KYC) eljárások fordított megközelítése. Minden más fizetési processzorral ellentétben a PayPal lehetővé teszi a fejlesztők számára, hogy integrálják API-jaikat, és elkezdjék a fizetések beszedését éles környezetben, mielőtt elvégeznék a megfelelő ellenőrzést.

### Hogyan kellene működnie {#how-it-should-work}

Minden legitim fizetésfeldolgozó a következő logikai sorrendet követi:

1. **Először végezze el a KYC-ellenőrzést**
2. **Jóváhagyja a kereskedői fiókot**
3. **Adjon meg termelési API-hozzáférést**
4. **Engedélyezze a fizetések beszedését**

Ez mind a fizetésfeldolgozót, mind a kereskedőt védi azáltal, hogy biztosítja a megfelelést, mielőtt bármilyen pénz gazdát cserélne.

### Hogyan működik valójában a PayPal {#how-paypal-actually-works}

A PayPal folyamata teljesen fordított:

1. **Azonnal biztosítson API-hozzáférést az éles környezetben**
2. **Engedélyezze a fizetések beszedését órákra vagy napokra**
3. **Hirtelen, értesítés nélküli blokkolja a fizetéseket**
4. **Kövesse a KYC dokumentációt, miután az ügyfeleket már érinti a probléma**
5. **Ne értesítse a kereskedőt**
6. **Hagyja, hogy az ügyfelek felfedezzék és jelentsék a problémát**

### A valós hatás {#the-real-world-impact}

Ez a fordított folyamat katasztrófákat okoz a vállalkozások számára:

* **A csúcsidőszakokban a vásárlók nem tudják befejezni a vásárlásaikat**
* **Nincs előzetes figyelmeztetés** arról, hogy ellenőrzésre van szükség
* **Nincs e-mail értesítés**, ha a fizetések blokkolva vannak
* **A kereskedők az összezavarodott vásárlóktól értesülnek a problémákról**
* **Bevételkiesés** kritikus üzleti időszakokban
* **A vásárlói bizalom romlása**, amikor a fizetések rejtélyes módon meghiúsulnak

### A 2025. júliusi fiókmigrációs katasztrófa {#the-july-2025-account-migration-disaster}

Pontosan ez a forgatókönyv játszódott le a 2025 júliusi rutinszerű fiókmigrációnk során. A PayPal kezdetben engedélyezte a fizetéseket, majd hirtelen, mindenféle értesítés nélkül blokkolta azokat. Csak akkor vettük észre a problémát, amikor az ügyfelek elkezdték jelenteni, hogy nem tudnak fizetni.

Amikor felvettük a kapcsolatot az ügyfélszolgálattal, ellentmondásos válaszokat kaptunk a szükséges dokumentációkról, a megoldásra vonatkozó egyértelmű határidő nélkül. Emiatt kénytelenek voltunk teljesen leállítani a PayPal-fizetéseket, összezavarva azokat az ügyfeleket, akiknek nem volt más fizetési lehetőségük.

### Miért fontos ez? {#why-this-matters}

A PayPal megfelelési megközelítése alapvető félreértést mutat a vállalkozások működésével kapcsolatban. A megfelelő KYC-nek **a termelési integráció előtt** kell történnie, nem pedig azután, hogy az ügyfelek már megpróbálnak fizetni. A proaktív kommunikáció hiánya a problémák felmerülésekor a PayPal kereskedői igényektől való eltávolodását mutatja.

Ez a fordított folyamat a PayPal tágabb szervezeti problémáinak tünete: a belső folyamataikat helyezik előtérbe a kereskedői és ügyfélélménnyel szemben, ami olyan működési katasztrófákhoz vezet, amelyek elriasztják a vállalkozásokat a platformjuktól.

## Hogyan csinálja ezt helyesen minden más fizetési szolgáltató {#how-every-other-payment-processor-does-it-right}

Az előfizetési lista funkció, amelyet a PayPal nem hajlandó bevezetni, több mint egy évtizede szabványos az iparágban. Így kezelik ezt az alapvető követelményt más fizetési szolgáltatók:

### Csík {#stripe}

A Stripe az API indulása óta rendelkezik előfizetési listázással. A dokumentációjuk világosan bemutatja, hogyan lehet lekérni egy ügyfél- vagy kereskedői fiók összes előfizetését. Ez alapvető CRUD funkciónak számít.

### Evező {#paddle}

A Paddle átfogó előfizetés-kezelési API-kat kínál, beleértve a listázást, a szűrést és a lapozást. Megértik, hogy a kereskedőknek látniuk kell a visszatérő bevételi forrásaikat.

### Coinbase Commerce {#coinbase-commerce}

Még a kriptovaluta-fizetési szolgáltatók, mint például a Coinbase Commerce, is jobb előfizetés-kezelést biztosítanak, mint a PayPal.

### Négyzet {#square}

A Square API-ja alapvető funkcióként tartalmazza az előfizetési listázást, nem pedig utólagos gondolatként.

### Az iparági szabvány {#the-industry-standard}

Minden modern fizetési processzor a következőket kínálja:

* Összes előfizetés listázása
* Szűrés állapot, dátum, ügyfél szerint
* Oldalszámozás nagy adathalmazokhoz
* Webhook értesítések az előfizetés-változásokról
* Átfogó dokumentáció működő példákkal

### Mit kínálnak más adatfeldolgozók a PayPalhoz képest {#what-other-processors-provide-vs-paypal}

**Stripe – Összes előfizetés listázása:**

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

**Csík - Szűrés állapot szerint:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal – Amit valójában kapsz:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**A PayPal elérhető végpontjai:**

* `POST /v1/billing/subscriptions` - Előfizetés létrehozása
* `GET /v1/billing/subscriptions/{id}` - EGY előfizetés beszerzése (ha ismeri az azonosítót)
* `PATCH /v1/billing/subscriptions/{id}` - Előfizetés frissítése
* `POST /v1/billing/subscriptions/{id}/cancel` - Előfizetés lemondása
* `POST /v1/billing/subscriptions/{id}/suspend` - Előfizetés felfüggesztése

**Ami hiányzik a PayPalból:**

* ❌ Nincs `GET /v1/billing/subscriptions` (összes listázása)
* ❌ Nincs keresési funkció
* ❌ Nincs szűrés állapot, ügyfél, dátum szerint
* ❌ Nincs oldalszámozás támogatás

A PayPal az egyetlen jelentős fizetési szolgáltató, amely arra kényszeríti a fejlesztőket, hogy manuálisan kövessék nyomon az előfizetési azonosítókat a saját adatbázisaikban.

## A PayPal szisztematikus eltussolása: 6 millió hang elhallgattatása {#paypals-systematic-cover-up-silencing-6-million-voices}

A PayPal kritikák kezeléséhez való hozzáállását tökéletesen megtestesítő lépésként nemrégiben offline állapotba hozták teljes közösségi fórumukat, gyakorlatilag elhallgattatva több mint 6 millió tagot, és törölve több százezer, a hibáikat dokumentáló bejegyzést.

### A nagy törlés {#the-great-erasure}

Az eredeti PayPal közösség a `paypal-community.com` címen **6 003 558 tagot** számlált, és több százezer bejegyzést, hibajelentést, panaszt és beszélgetést tartalmazott a PayPal API-hibáiról. Ez több mint egy évtizednyi dokumentált bizonyítékot jelentett a PayPal szisztematikus problémáira.

2025. június 30-án a PayPal csendben leállította a teljes fórumot. Az összes `paypal-community.com` link most 404-es hibát ad vissza. Ez nem migráció vagy frissítés volt.

### Harmadik féltől származó mentés {#the-third-party-rescue}

Szerencsére egy harmadik féltől származó szolgáltatás a [ppl.lithium.com](https://ppl.lithium.com/) címen megőrizte a tartalom egy részét, lehetővé téve számunkra, hogy hozzáférjünk azokhoz a beszélgetésekhez, amelyeket a PayPal megpróbált elrejteni. Ez a harmadik fél általi megőrzés azonban nem teljes, és bármikor eltűnhet.

A bizonyítékok elrejtésének ez a mintája nem új a PayPal számára. Dokumentált múlttal rendelkeznek a következőkről:

* Kritikus hibajelentések eltávolítása a nyilvánosság elől
* Fejlesztői eszközök értesítés nélküli megszüntetése
* API-k megfelelő dokumentáció nélküli módosítása
* A hibáikról szóló közösségi viták elhallgattatása

A fórumtörlés a legagyalázatosabb kísérlet arra, hogy a nyilvánosság elől elrejtsék a rendszerszintű hibáikat.

## A 11 éve tartó capture hiba katasztrófája: 1899 dollár, és ez a szám még növekszik {#the-11-year-capture-bug-disaster-1899-and-counting}

Miközben a PayPal a visszajelzési megbeszélések szervezésével és ígéretek tételével volt elfoglalva, az alapvető fizetésfeldolgozó rendszerük több mint 11 éve alapvetően összeomlott. A bizonyítékok lesújtóak.

### Továbbított e-mail 1899 dolláros vesztesége {#forward-emails-1899-loss}

Éles rendszereinkben 108 PayPal-fizetést fedeztünk fel, összesen **1899 USD** értékben, amelyek a PayPal rögzítési hibái miatt elvesztek. Ezek a fizetések következetes mintát mutatnak:

* `CHECKOUT.ORDER.APPROVED` webhookok érkeztek
* A PayPal capture API-ja 404 hibát adott vissza
* A megrendelések elérhetetlenné váltak a PayPal API-ján keresztül

Lehetetlen megállapítani, hogy az ügyfeleknek felszámították-e a díjat, mivel a PayPal 14 nap elteltével teljesen elrejti a hibakeresési naplókat, és törli az irányítópultról a nem rögzített rendelési azonosítókhoz tartozó összes adatot.

Ez csak egyetlen vállalkozást képvisel. **A több ezer kereskedő összesített vesztesége több mint 11 év alatt valószínűleg több millió dollárt tesz ki.**

**Újra hangsúlyozzuk: több ezer kereskedő összesített veszteségei több mint 11 év alatt valószínűleg több millió dollárt tesznek ki.**

Az egyetlen ok, amiért ezt felfedeztük, az az, hogy hihetetlenül aprólékosak és adatvezéreltek vagyunk.

### A 2013-as eredeti jelentés: Több mint 11 évnyi hanyagság {#the-2013-original-report-11-years-of-negligence}

A probléma legkorábbi dokumentált jelentése a [Stack Overflow 2013 novemberében](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivált](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) címen található:

> „Folyamatosan 404-es hibát kapunk Rest API-val rögzítés közben”

A 2013-ban jelentett hiba **azonos** azzal, amit a Forward Email 2024-ben tapasztalt:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

A közösség reakciója 2013-ban sokatmondó volt:

> „Jelenleg jelentettünk egy problémát a REST API-val. A PayPal dolgozik a megoldásán.”

**Több mint 11 évvel később még mindig „dolgoznak rajta”.**

### A 2016-os beismerés: A PayPal feltörte a saját SDK-ját {#the-2016-admission-paypal-breaks-their-own-sdk}

2016-ban a PayPal saját GitHub adattára dokumentálta, hogy a [hatalmas befogási kudarcok](https://github.com/paypal/PayPal-PHP-SDK/issues/660) hatással volt a hivatalos PHP SDK-jukra. A mérték megdöbbentő volt:

> „2016. szeptember 20. óta az összes PayPal-rögzítési kísérlet „INVALID_RESOURCE_ID - A kért erőforrás-azonosító nem található” hibával sikertelen. Szeptember 19. és szeptember 20. között semmi sem változott az API-integrációban. **September 20. óta a rögzítési kísérletek 100%-a ezt a hibát adta vissza.**”

Egy kereskedő jelentette:

> „**Az elmúlt 24 órában több mint 1400 sikertelen rögzítési kísérletem volt**, mindegyik INVALID_RESOURCE_ID hibaválaszjel.”

A PayPal kezdeti válasza az volt, hogy a kereskedőt hibáztatta, és technikai támogatáshoz irányította. Csak hatalmas nyomásgyakorlás után ismerték el a hibájukat:

> „Friss értesítést kaptam a termékfejlesztőinktől. Észrevették a küldött fejlécekben, hogy a PayPal-Request-ID 42 karakterből áll, de **úgy tűnik, hogy nemrégiben történt egy változás, amely ezt az azonosítót mindössze 38 karakterre korlátozza.**”

Ez a beismerés a PayPal szisztematikus hanyagságát fedi fel:

1. **Dokumentálatlan, törésmutató változtatásokat hajtottak végre**
2. **A saját hivatalos SDK-jukat tették tönkre**
3. **Először a kereskedőket hibáztatták**
4. **Csak nyomás alatt ismerték el a hibájukat**

A probléma „megoldása” után is a kereskedők a következőkről számoltak be:

> „Frissítettem az SDK-t 1.7.4-es verzióra, és **a probléma továbbra is fennáll**.”

### A 2024-es eszkaláció: Még mindig hibás {#the-2024-escalation-still-broken}

A megőrzött PayPal-közösség legfrissebb jelentései szerint a probléma valójában rosszabbodott. A [2024. szeptemberi megbeszélés](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivált](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) pontosan ugyanazokat a problémákat dokumentálja:

> „A probléma csak körülbelül 2 hete kezdett jelentkezni, és nem érinti az összes rendelést. **A sokkal gyakoribbnak tűnik a 404-es hiba a rögzítéskor.**”

A kereskedő ugyanazt a mintát írja le, mint amit az e-mail továbbításakor tapasztalt:

> „A megrendelés rögzítésére tett kísérlet után a PayPal 404-es hibát ad vissza. A megrendelés részleteinek lekérésekor: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Ez a mi oldalunkon a sikeres rögzítésnek semmilyen nyomát nem mutatja.**”

### A webhook megbízhatósági katasztrófája {#the-webhook-reliability-disaster}

Egy másik [megőrzött közösségi beszélgetés](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) felfedi, hogy a PayPal webhook rendszere alapvetően megbízhatatlan:

> „Elméletileg két eseménynek kellene lennie (CHECKOUT.ORDER.APPROVED és PAYMENT.CAPTURE.COMPLETED) a Webhook eseménytől. Valójában**ez a két esemény ritkán érkezik be azonnal, a PAYMENT.CAPTURE.COMPLETED a legtöbb esetben nem, vagy csak néhány órán belül érkezne meg.”

Előfizetési fizetések esetén:

> „**A 'PAYMENT.SALE.COMPLETED' fizetési művelet néha csak néhány óra elteltével érkezett meg.”**”

A kereskedő kérdései rávilágítanak a PayPal megbízhatósági problémáinak mélységére:

1. **„Miért történik ez?”** - A PayPal webhook rendszere alapvetően hibás.
2. **„Ha a rendelés állapota „BEFEJEZVE”, akkor feltételezhetem, hogy megkaptam a pénzt?”** - A kereskedők nem bízhatnak a PayPal API-válaszaiban.
3. **„Miért nem talál naplókat az „Eseménynaplók->Webhook események” menüpont?”** - Még a PayPal saját naplózórendszere sem működik.

### A szisztematikus hanyagság mintázata {#the-pattern-of-systematic-negligence}

A bizonyítékok több mint 11 évet ölelnek fel, és egyértelmű mintázatot mutatnak:

* **2013**: „A PayPal dolgozik rajta”
* **2016**: A PayPal elismeri a hibás változást, és hibás javítást nyújt
* **2024**: Ugyanazok a hibák továbbra is előfordulnak, amelyek a Forward Email és számtalan más szolgáltatást érintenek

Ez nem hiba – **ez szisztematikus hanyagság.** A PayPal több mint egy évtizede tud ezekről a kritikus fizetésfeldolgozási hibákról, és következetesen:

1. **A kereskedőket hibáztatták a PayPal hibáiért**
2. **Nem dokumentált, hibás változtatásokat eszközöltek**
3. **Nem megfelelő, de nem működő javításokat biztosítottak**
4. **Figyelmen kívül hagyták a vállalkozásokra gyakorolt pénzügyi hatásokat**
5. **Bizonyítékokat rejtettek el a közösségi fórumok eltávolításával**

### A nem dokumentált követelmény {#the-undocumented-requirement}

A PayPal hivatalos dokumentációjában sehol sem említik, hogy a kereskedőknek újrapróbálkozási logikát kellene alkalmazniuk a rögzítési műveletekhez. A dokumentációjuk szerint a kereskedőknek „a jóváhagyás után azonnal rögzíteniük kell”, de nem említik, hogy az API-juk véletlenszerűen 404-es hibákat ad vissza, amelyek összetett újrapróbálkozási mechanizmusokat igényelnek.

Ez minden kereskedőt arra kényszerít, hogy:

* Exponenciális visszatartási újrapróbálkozási logika megvalósítása
* Inkonzisztens webhook-kézbesítés kezelése
* Komplex állapotkezelő rendszerek létrehozása
* Sikertelen rögzítések manuális figyelése

**Minden más fizetésfeldolgozó megbízható, elsőre működő rögzítési API-kat kínál.**

## A PayPal megtévesztési gyakorlatának szélesebb körű elterjedtsége {#paypals-broader-pattern-of-deception}

A capture bug katasztrófa csak egy példa a PayPal szisztematikus megközelítésére az ügyfelek megtévesztésére és a hibáik eltitkolására.

### A New York-i Pénzügyi Szolgáltatások Minisztériumának intézkedése {#the-new-york-department-of-financial-services-action}

2025 januárjában a New York-i Pénzügyi Szolgáltatások Minisztériuma [végrehajtási intézkedés a PayPal ellen](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) számú figyelmeztetést adott ki megtévesztő gyakorlatok miatt, ami azt mutatja, hogy a PayPal megtévesztő gyakorlata messze túlmutat az API-jain.

Ez a szabályozási intézkedés azt mutatja, hogy a PayPal hajlandó megtévesztő gyakorlatokat folytatni a teljes üzleti tevékenységében, nem csak a fejlesztői eszközeiben.

### A mézper: Partnerlinkek átírása {#the-honey-lawsuit-rewriting-affiliate-links}

A PayPal Honey felvásárlása [perek, amelyek azt állítják, hogy Honey átírja affiliate linkeket](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) címet eredményezett, jutalékokat lopva el tartalomkészítőktől és influenszerektől. Ez a szisztematikus megtévesztés egy másik formáját képviseli, ahol a PayPal olyan bevételek átirányításával profitál, amelyeknek másoknak kellene menniük.

A minta egyértelmű:

1. **API hibák**: Hibás funkciók elrejtése, kereskedők hibáztatása
2. **Közösség elhallgattatása**: A problémák bizonyítékainak eltávolítása
3. **Szabályozási jogsértések**: Megtévesztő gyakorlatok folytatása
4. **Partnerlopás**: Jutalékok ellopása technikai manipulációval

### A PayPal hanyagságának ára {#the-cost-of-paypals-negligence}

A Forward Email 1899 dolláros vesztesége csak a jéghegy csúcsa. Vegyük figyelembe a tágabb hatást is:

* **Egyéni kereskedők**: Több ezer dolláros veszteség fejenként
* **Vállalati ügyfelek**: Potenciálisan több millió dolláros bevételkiesés
* **Fejlesztői idő**: Számtalan óra a PayPal hibás API-jainak megkerülő megoldásainak kidolgozásával
* **Ügyfélbizalom**: Vállalkozások veszítenek ügyfeleket a PayPal fizetési hibái miatt

Ha egyetlen kis e-mail szolgáltatás közel 2000 dolláros veszteséget szenvedett el, és ez a probléma több mint 11 éve fennáll, és több ezer kereskedőt érint, akkor a teljes pénzügyi kár valószínűleg **több százmillió dollár**.

### A dokumentációs hazugság {#the-documentation-lie}

A PayPal hivatalos dokumentációja következetesen nem említi a kereskedők által tapasztalható kritikus korlátozásokat és hibákat. Például:

* **Rögzítési API**: Nincs említés arról, hogy a 404-es hibák gyakoriak és újrapróbálkozási logikát igényelnek.
* **Webhook megbízhatósága**: Nincs említés arról, hogy a webhookok gyakran órákkal késnek.
* **Előfizetési listázás**: A dokumentáció szerint a listázás akkor is lehetséges, ha nincs végpont.
* **Munkamenet-időtúllépések**: Nincs említés az agresszív 60 másodperces időtúllépésekről.

A kritikus információk szisztematikus elhallgatása arra kényszeríti a kereskedőket, hogy a termelési rendszerekben próbálgatással és hibákkal fedezzék fel a PayPal korlátait, ami gyakran pénzügyi veszteségekhez vezet.

## Mit jelent ez a fejlesztők számára? {#what-this-means-for-developers}

A PayPal szisztematikus kudarca az alapvető fejlesztői igények kielégítésében, miközben kiterjedt visszajelzéseket gyűjt, egy alapvető szervezeti problémára utal. A visszajelzések gyűjtését a tényleges problémák megoldásának helyettesítőjeként kezelik.

A minta egyértelmű:

1. A fejlesztők jelentik a problémákat.
2. A PayPal visszajelzési megbeszéléseket szervez a vezetőkkel.
3. Kiterjedt visszajelzéseket adnak.
4. A csapatok elismerik a hiányosságokat, és megígérik, hogy „nyomon követik és kezelik azokat”.
5. Semmi sem kerül megvalósításra.
6. A vezetők jobb cégekhez távoznak.
7. Az új csapatok ugyanazt a visszajelzést kérik.
8. A ciklus ismétlődik.

Eközben a fejlesztők kénytelenek megkerülő megoldásokat találni, veszélyeztetni a biztonságot és hibás felhasználói felületekkel foglalkozni, csak hogy elfogadhassák a fizetéseket.

Ha fizetési rendszert építesz, tanulj a tapasztalatainkból: építsd fel a [trifecta megközelítés](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal)-dat több processzorral, de ne várd el a PayPaltól, hogy biztosítsa a szükséges alapvető funkciókat. Tervezd meg a kerülő megoldások kidolgozását az első naptól kezdve.

> Ez a bejegyzés a Forward Email PayPal API-jaival szerzett 11 éves tapasztalatunkat dokumentálja. Minden kódpélda és link a tényleges éles rendszereinkből származik. A problémák ellenére továbbra is támogatjuk a PayPal-fizetéseket, mivel egyes ügyfeleknek nincs más lehetőségük.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />