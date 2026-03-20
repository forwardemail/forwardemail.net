# Adatfeldolgozási Megállapodás {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email adatfeldolgozási megállapodás" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Kulcsfogalmak](#key-terms)
* [A megállapodás módosításai](#changes-to-the-agreement)
* [1. Feldolgozó és alfeldolgozó kapcsolatok](#1-processor-and-subprocessor-relationships)
  * [1. Szolgáltató mint feldolgozó](#1-provider-as-processor)
  * [2. Szolgáltató mint alfeldolgozó](#2-provider-as-subprocessor)
* [2. Feldolgozás](#2-processing)
  * [1. Feldolgozás részletei](#1-processing-details)
  * [2. Feldolgozási utasítások](#2-processing-instructions)
  * [3. Feldolgozás a szolgáltató által](#3-processing-by-provider)
  * [4. Ügyfél általi feldolgozás](#4-customer-processing)
  * [5. Hozzájárulás a feldolgozáshoz](#5-consent-to-processing)
  * [6. Alfeldolgozók](#6-subprocessors)
* [3. Korlátozott adatátvitelek](#3-restricted-transfers)
  * [1. Engedélyezés](#1-authorization)
  * [2. EGT-n kívüli átvittek](#2-ex-eea-transfers)
  * [3. Egyesült Királyságon kívüli átvittek](#3-ex-uk-transfers)
  * [4. Egyéb nemzetközi átvittek](#4-other-international-transfers)
* [4. Biztonsági események kezelése](#4-security-incident-response)
* [5. Audit és jelentések](#5-audit--reports)
  * [1. Audit jogok](#1-audit-rights)
  * [2. Biztonsági jelentések](#2-security-reports)
  * [3. Biztonsági átvilágítás](#3-security-due-diligence)
* [6. Koordináció és együttműködés](#6-coordination--cooperation)
  * [1. Kérdésekre adott válaszok](#1-response-to-inquiries)
  * [2. DPIA-k és DTIÁ-k](#2-dpias-and-dtias)
* [7. Ügyfél személyes adatainak törlése](#7-deletion-of-customer-personal-data)
  * [1. Törlés az ügyfél által](#1-deletion-by-customer)
  * [2. Törlés a DPA lejáratakor](#2-deletion-at-dpa-expiration)
* [8. Felelősség korlátozása](#8-limitation-of-liability)
  * [1. Felelősségi korlátok és kártérítési lemondás](#1-liability-caps-and-damages-waiver)
  * [2. Kapcsolódó felek igényei](#2-related-party-claims)
  * [3. Kivételek](#3-exceptions)
* [9. Dokumentumok közötti ellentmondások](#9-conflicts-between-documents)
* [10. A megállapodás időtartama](#10-term-of-agreement)
* [11. Irányadó jog és választott bíróságok](#11-governing-law-and-chosen-courts)
* [12. Szolgáltató kapcsolat](#12-service-provider-relationship)
* [13. Meghatározások](#13-definitions)
* [Köszönetnyilvánítások](#credits)


## Kulcsfogalmak {#key-terms}

| Fogalom                                    | Érték                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Megállapodás</strong>              | Ez a DPA kiegészíti a [Szolgáltatási Feltételeket](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <strong>Jóváhagyott alfeldolgozók</strong> | [Cloudflare](https://cloudflare.com) (USA; DNS, hálózat és biztonsági szolgáltató), [DataPacket](https://www.datapacket.com/) (USA/UK; tárhelyszolgáltató), [Digital Ocean](https://digitalocean.com) (USA; tárhelyszolgáltató), [GitHub](https://github.com) (USA; forráskód tárolás, CI/CD és projektmenedzsment), [Vultr](https://www.vultr.com) (USA; tárhelyszolgáltató), [Stripe](https://stripe.com) (USA; fizetési feldolgozó), [PayPal](https://paypal.com) (USA; fizetési feldolgozó) |
| <strong>Szolgáltató biztonsági kapcsolattartója</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Biztonsági irányelv</strong>       | Tekintse meg [biztonsági irányelvünket a GitHubon](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                               |
| <strong>Irányadó állam</strong>             | Delaware állam, Egyesült Államok                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
## A megállapodás módosításai {#changes-to-the-agreement}

Ez a dokumentum a [Common Paper DPA Standard Terms (1.0 verzió)](https://commonpaper.com/standards/data-processing-agreement/1.0) származéka, és a következő módosításokat tartalmazza:

1. A [Irányadó jog és választott bíróságok](#11-governing-law-and-chosen-courts) alfejezetként került beillesztésre az alábbiakban, az „Irányadó állam” fent megjelölve.
2. A [Szolgáltató és alvállalkozó viszonya](#12-service-provider-relationship) alfejezetként került beillesztésre az alábbiakban.


## 1. Feldolgozó és alvállalkozó viszonyok {#1-processor-and-subprocessor-relationships}

### 1. Szolgáltató mint feldolgozó {#1-provider-as-processor}

Olyan esetekben, amikor a <strong>Megrendelő</strong> az Ügyfél személyes adatok adatkezelője, a <strong>Szolgáltató</strong> feldolgozónak minősül, aki a <strong>Megrendelő</strong> nevében dolgozza fel a személyes adatokat.

### 2. Szolgáltató mint alvállalkozó {#2-provider-as-subprocessor}

Olyan esetekben, amikor a <strong>Megrendelő</strong> az Ügyfél személyes adatok feldolgozója, a <strong>Szolgáltató</strong> az Ügyfél személyes adatok alvállalkozójának minősül.


## 2. Adatfeldolgozás {#2-processing}

### 1. Az adatfeldolgozás részletei {#1-processing-details}

A borítólapon található I(B) melléklet ismerteti az adatfeldolgozás tárgyát, jellegét, célját és időtartamát, valamint a gyűjtött <strong>Személyes adatok kategóriáit</strong> és az érintett <strong>Adatkezelési kategóriákat</strong>.

### 2. Adatfeldolgozási utasítások {#2-processing-instructions}

A <strong>Megrendelő</strong> utasítja a <strong>Szolgáltatót</strong>, hogy dolgozza fel az Ügyfél személyes adatait: (a) a Szolgáltatás nyújtása és fenntartása érdekében; (b) az esetleges további, a <strong>Megrendelő</strong> által a Szolgáltatás használatával meghatározott célokra; (c) a <strong>Megállapodásban</strong> dokumentált módon; és (d) bármely más, a <strong>Megrendelő</strong> által írásban adott és a <strong>Szolgáltató</strong> által elismert utasítás szerint, amely a jelen DPA szerinti Ügyfél személyes adatok feldolgozására vonatkozik. A <strong>Szolgáltató</strong> ezen utasításokat betartja, kivéve, ha az alkalmazandó jogszabályok ezt tiltják. A <strong>Szolgáltató</strong> haladéktalanul értesíti a <strong>Megrendelőt</strong>, ha nem tudja követni az adatfeldolgozási utasításokat. A <strong>Megrendelő</strong> csak olyan utasításokat ad, amelyek megfelelnek az alkalmazandó jogszabályoknak.

### 3. Adatfeldolgozás a Szolgáltató által {#3-processing-by-provider}

A <strong>Szolgáltató</strong> kizárólag a jelen DPA és a borítólapon szereplő részletek szerint dolgozza fel az Ügyfél személyes adatait. Ha a <strong>Szolgáltató</strong> frissíti a Szolgáltatást meglévő vagy új termékekkel, funkciókkal vagy szolgáltatásokkal, a <strong>Szolgáltató</strong> megváltoztathatja az <strong>Adatkezelési kategóriákat</strong>, a <strong>Személyes adatok kategóriáit</strong>, a <strong>Különleges kategóriájú adatokat</strong>, a <strong>Különleges kategóriájú adatok korlátozásait vagy védelmi intézkedéseit</strong>, az <strong>Átviteli gyakoriságot</strong>, az <strong>Adatfeldolgozás jellegét és célját</strong>, valamint az <strong>Adatfeldolgozás időtartamát</strong>, amennyiben szükséges a frissítések tükrözéséhez, erről értesítve a <strong>Megrendelőt</strong>.

### 4. Megrendelői adatfeldolgozás {#4-customer-processing}

Amennyiben a <strong>Megrendelő</strong> feldolgozóként, a <strong>Szolgáltató</strong> pedig alvállalkozóként jár el, a <strong>Megrendelő</strong> köteles betartani minden alkalmazandó jogszabályt, amely az Ügyfél személyes adatok feldolgozására vonatkozik. A <strong>Megrendelő</strong> és az adatkezelője közötti megállapodás hasonlóan előírja, hogy a <strong>Megrendelő</strong> mint feldolgozó köteles betartani az összes alkalmazandó jogszabályt. Ezen túlmenően a <strong>Megrendelő</strong> köteles betartani az alvállalkozói követelményeket, amelyek a <strong>Megrendelő</strong> és az adatkezelője közötti megállapodásban szerepelnek.

### 5. Hozzájárulás az adatfeldolgozáshoz {#5-consent-to-processing}

A <strong>Megrendelő</strong> eleget tett, és továbbra is eleget tesz minden alkalmazandó adatvédelmi jogszabálynak az Ügyfél személyes adatainak a <strong>Szolgáltató</strong> és/vagy a Szolgáltatás részére történő átadásával kapcsolatban, beleértve minden közzétételt, hozzájárulás beszerzését, megfelelő választási lehetőség biztosítását és az alkalmazandó adatvédelmi jogszabályok által előírt releváns védelmi intézkedések végrehajtását.
### 6. Alfeldolgozók {#6-subprocessors}

a. <strong>Szolgáltató</strong> nem ad át, nem továbbít és nem bocsát rendelkezésre semmilyen Ügyfél Személyes Adatot alfeldolgozó részére, kivéve, ha azt <strong>Ügyfél</strong> jóváhagyta. A jelenlegi <strong>Jóváhagyott Alfeldolgozók</strong> listája tartalmazza az alfeldolgozók személyazonosságát, tartózkodási országukat és a várható feldolgozási feladatokat. <strong>Szolgáltató</strong> legalább 10 munkanappal előre, írásban értesíti <strong>Ügyfelet</strong> a <strong>Jóváhagyott Alfeldolgozók</strong> bármilyen tervezett változásáról, legyen az alfeldolgozó hozzáadása vagy cseréje, amely lehetővé teszi <strong>Ügyfél</strong> számára, hogy elegendő idővel rendelkezzen a változások elleni kifogás benyújtására, mielőtt <strong>Szolgáltató</strong> az új alfeldolgozót használni kezdi. <strong>Szolgáltató</strong> megadja <strong>Ügyfél</strong> számára a szükséges információkat, hogy <strong>Ügyfél</strong> gyakorolhassa a jogát a <strong>Jóváhagyott Alfeldolgozók</strong> változásával szembeni kifogás benyújtására. <strong>Ügyfél</strong> a <strong>Jóváhagyott Alfeldolgozók</strong> változásáról szóló értesítéstől számított 30 napon belül kifogást emelhet, ellenkező esetben a változásokat elfogadottnak kell tekinteni. Ha <strong>Ügyfél</strong> a változásról szóló értesítéstől számított 30 napon belül kifogást emel, <strong>Ügyfél</strong> és <strong>Szolgáltató</strong> jóhiszeműen együttműködik a kifogás vagy aggály megoldása érdekében.

b. Alfeldolgozó igénybevétele esetén <strong>Szolgáltató</strong> írásbeli megállapodást köt az alfeldolgozóval, amely biztosítja, hogy az alfeldolgozó csak az Ügyfél Személyes Adatokhoz fér hozzá és használja azokat (i) a rá átruházott kötelezettségek teljesítéséhez szükséges mértékben, és (ii) a <strong>Megállapodás</strong> feltételeivel összhangban.

c. Ha a GDPR alkalmazandó az Ügyfél Személyes Adatainak feldolgozására, (i) a jelen DPA-ban leírt adatvédelmi kötelezettségek (amint azt a GDPR 28. cikk (3) bekezdése hivatkozza, ha alkalmazandó) az alfeldolgozóra is vonatkoznak, és (ii) <strong>Szolgáltató</strong> alfeldolgozóval kötött megállapodása tartalmazza ezeket a kötelezettségeket, beleértve a részleteket arról, hogyan koordinálják <strong>Szolgáltató</strong> és alfeldolgozója az Ügyfél Személyes Adatainak feldolgozásával kapcsolatos megkeresések vagy kérelmek kezelését. Ezen felül <strong>Szolgáltató</strong> kérésre megosztja <strong>Ügyféllel</strong> az alfeldolgozóival kötött megállapodásainak (beleértve a módosításokat is) másolatát. Az üzleti titkok vagy más bizalmas információk, beleértve a személyes adatokat, védelme érdekében <strong>Szolgáltató</strong> jogosult az alfeldolgozóval kötött megállapodás szövegét a másolat megosztása előtt kitakarni.

d. <strong>Szolgáltató</strong> teljes mértékben felelős az alfeldolgozóinak átruházott kötelezettségekért, beleértve az alfeldolgozók Ügyfél Személyes Adatainak feldolgozásával kapcsolatos cselekményeit és mulasztásait. <strong>Szolgáltató</strong> értesíti <strong>Ügyfelet</strong> bármilyen olyan esetben, amikor alfeldolgozója nem teljesít egy lényeges kötelezettséget az Ügyfél Személyes Adatainak kezelésével kapcsolatban a <strong>Szolgáltató</strong> és az alfeldolgozó közötti megállapodás alapján.


## 3. Korlátozott Átadások {#3-restricted-transfers}

### 1. Engedélyezés {#1-authorization}

<strong>Ügyfél</strong> elfogadja, hogy <strong>Szolgáltató</strong> az Ügyfél Személyes Adatait az EGT-n, az Egyesült Királyságon vagy más releváns földrajzi területen kívül is átadhatja, amennyiben az a Szolgáltatás nyújtásához szükséges. Ha <strong>Szolgáltató</strong> olyan területre továbbítja az Ügyfél Személyes Adatait, amelyre az Európai Bizottság vagy más illetékes felügyeleti hatóság nem adott ki megfelelőségi döntést, <strong>Szolgáltató</strong> megfelelő garanciákat alkalmaz az Ügyfél Személyes Adatai ilyen területre történő továbbítására az Alkalmazandó Adatvédelmi Jogszabályokkal összhangban.

### 2. EGT-n kívüli átadások {#2-ex-eea-transfers}

<strong>Ügyfél</strong> és <strong>Szolgáltató</strong> megállapodnak abban, hogy ha a GDPR védi az Ügyfél Személyes Adatai továbbítását, az átadás <strong>Ügyfél</strong> részéről az EGT-n belülről történik <strong>Szolgáltató</strong> részére az EGT-n kívül, és az átadás nem az Európai Bizottság által hozott megfelelőségi döntés hatálya alá tartozik, akkor a jelen DPA megkötésével <strong>Ügyfél</strong> és <strong>Szolgáltató</strong> úgy tekintendők, mintha aláírták volna az EGT SCC-ket és azok mellékleteit, amelyek hivatkozással beépülnek. Az ilyen átadás az EGT SCC-k alapján történik, amelyeket az alábbiak szerint töltenek ki:
a. Az EGT ÁSZF második modulja (Adatkezelőtől Adatfeldolgozóig) akkor alkalmazandó, amikor a <strong>Megrendelő</strong> Adatkezelő, és a <strong>Szolgáltató</strong> a Megrendelő személyes adatait a Megrendelő számára Adatfeldolgozóként kezeli.

b. Az EGT ÁSZF harmadik modulja (Adatfeldolgozótól Alfeldolgozóig) akkor alkalmazandó, amikor a <strong>Megrendelő</strong> Adatfeldolgozó, és a <strong>Szolgáltató</strong> a Megrendelő személyes adatait a Megrendelő nevében Alfeldolgozóként kezeli.

c. Minden modul esetében az alábbiak érvényesek (amennyiben alkalmazható):

1. A 7. pontban szereplő opcionális csatlakozási záradék nem alkalmazandó;

2. A 9. pontban a 2. opció (általános írásbeli engedélyezés) alkalmazandó, és az alfeldolgozó változásáról szóló előzetes értesítés minimális időtartama 10 munkanap;

3. A 11. pontban az opcionális nyelvezet nem alkalmazandó;

4. A 13. pontban minden szögletes zárójel eltávolításra kerül;

5. A 17. pontban (1. opció) az EGT ÁSZF-eket a <strong>irányadó tagállam</strong> jogszabályai irányítják;

6. A 18(b) pontban a vitákat a <strong>irányadó tagállam</strong> bíróságai rendezik; és

7. A jelen DPA fedőlapja tartalmazza az EGT ÁSZF I., II. és III. mellékletében előírt információkat.

### 3. Ex-UK Átviteli Műveletek {#3-ex-uk-transfers}

A <strong>Megrendelő</strong> és a <strong>Szolgáltató</strong> megállapodnak abban, hogy ha az Egyesült Királyság GDPR-je védi a Megrendelő személyes adatainak átadását, az átadás a <strong>Megrendelő</strong> részéről az Egyesült Királyság területéről történik a <strong>Szolgáltató</strong> részére az Egyesült Királyságon kívül, és az átadás nem az Egyesült Királyság Államtitkára által hozott megfelelőségi döntés hatálya alá tartozik, akkor a jelen DPA aláírásával a <strong>Megrendelő</strong> és a <strong>Szolgáltató</strong> úgy tekintendők, mintha aláírták volna az Egyesült Királyság Kiegészítő Megállapodását és annak mellékleteit, amelyek hivatkozással beépülnek. Az ilyen átadás az Egyesült Királyság Kiegészítő Megállapodása alapján történik, amely az alábbiak szerint kerül kitöltésre:

a. A jelen DPA 3.2 pontja tartalmazza az Egyesült Királyság Kiegészítő Megállapodásának 2. táblázatában előírt információkat.

b. Az Egyesült Királyság Kiegészítő Megállapodásának 4. táblázata az alábbiak szerint módosul: egyik fél sem szüntetheti meg az Egyesült Királyság Kiegészítő Megállapodását az Egyesült Királyság Kiegészítő Megállapodásának 19. pontjában foglaltak szerint; amennyiben az ICO az Egyesült Királyság Kiegészítő Megállapodásának 18. pontja alapján módosított Jóváhagyott Kiegészítő Megállapodást bocsát ki, a felek jóhiszeműen együttműködnek a jelen DPA ennek megfelelő módosításában.

c. A fedőlap tartalmazza az Egyesült Királyság Kiegészítő Megállapodásának 1A, 1B, II. és III. mellékleteiben előírt információkat.

### 4. Egyéb Nemzetközi Átviteli Műveletek {#4-other-international-transfers}

Az olyan személyes adatátviteli műveletek esetén, ahol a nemzetközi átadásra a svájci jog (és nem az EGT tagállamok vagy az Egyesült Királyság joga) vonatkozik, az EGT ÁSZF 4. pontjában a GDPR-ra való hivatkozások, amennyiben jogilag szükséges, a Svájci Szövetségi Adatvédelmi Törvényre vagy annak utódjára módosulnak, és a felügyeleti hatóság fogalma magában foglalja a Svájci Szövetségi Adatvédelmi és Információs Biztost.

## 4. Biztonsági Események Kezelése {#4-security-incident-response}

1. Amint a <strong>Szolgáltató</strong> tudomást szerez bármilyen biztonsági eseményről, (a) haladéktalanul, de legkésőbb 72 órán belül értesíti a <strong>Megrendelőt</strong>, amikor ez lehetséges; (b) időben tájékoztatást nyújt a biztonsági eseményről, amint az ismertté válik vagy a <strong>Megrendelő</strong> ésszerűen kéri; és (c) haladéktalanul ésszerű lépéseket tesz a biztonsági esemény korlátozására és kivizsgálására. A jelen DPA szerinti biztonsági eseményről szóló értesítés vagy válaszadás nem minősül a <strong>Szolgáltató</strong> részéről a biztonsági eseményért való felelősség vagy hibás magatartás elismerésének.

## 5. Audit és Jelentések {#5-audit--reports}

### 1. Audit Jogok {#1-audit-rights}

A <strong>Szolgáltató</strong> minden ésszerűen szükséges információt megad a <strong>Megrendelő</strong> részére a jelen DPA-nek való megfelelés igazolásához, és lehetővé teszi, valamint hozzájárul az auditokhoz, beleértve a <strong>Megrendelő</strong> általi ellenőrzéseket is, hogy értékeljék a <strong>Szolgáltató</strong> megfelelését a jelen DPA-nek. Ugyanakkor a <strong>Szolgáltató</strong> korlátozhatja az adatokhoz vagy információkhoz való hozzáférést, ha a <strong>Megrendelő</strong> hozzáférése negatívan befolyásolná a <strong>Szolgáltató</strong> szellemi tulajdonjogait, titoktartási kötelezettségeit vagy egyéb, az alkalmazandó jogszabályok szerinti kötelezettségeit. A <strong>Megrendelő</strong> tudomásul veszi és elfogadja, hogy audit jogait a jelen DPA és az alkalmazandó adatvédelmi jogszabályok által biztosított audit jogokat kizárólag úgy gyakorolja, hogy a <strong>Szolgáltatót</strong> utasítja a lentiek szerinti jelentési és gondossági követelmények teljesítésére. A <strong>Szolgáltató</strong> a jelen DPA-nek való megfelelésről szóló nyilvántartásokat a DPA megszűnését követő 3 évig megőrzi.
### 2. Biztonsági jelentések {#2-security-reports}

<strong>Ügyfél</strong> elismeri, hogy a <strong>Szolgáltató</strong> rendszeresen független harmadik fél auditorok által auditált a <strong>Biztonsági Szabályzatban</strong> meghatározott szabványok szerint. Írásbeli kérésre a <strong>Szolgáltató</strong> bizalmas alapon átadja az <strong>Ügyfélnek</strong> az akkor aktuális Jelentés összefoglaló példányát, hogy az <strong>Ügyfél</strong> ellenőrizhesse a <strong>Szolgáltató</strong> megfelelőségét a <strong>Biztonsági Szabályzatban</strong> meghatározott szabványoknak.

### 3. Biztonsági átvilágítás {#3-security-due-diligence}

A Jelentésen túlmenően a <strong>Szolgáltató</strong> ésszerű információkérésekre válaszol, amelyeket az <strong>Ügyfél</strong> tesz a <strong>Szolgáltató</strong> megfelelőségének megerősítése érdekében jelen DPA szerint, beleértve az információbiztonsági, átvilágítási és audit kérdőívekre adott válaszokat, vagy további információk megadását az információbiztonsági programjáról. Minden ilyen kérésnek írásban kell történnie, és a <strong>Szolgáltató Biztonsági Kapcsolattartójához</strong> kell érkeznie, és évente csak egyszer tehető meg.

## 6. Koordináció és együttműködés {#6-coordination--cooperation}

### 1. Válaszadás megkeresésekre {#1-response-to-inquiries}

Ha a <strong>Szolgáltató</strong> bármilyen megkeresést vagy kérelmet kap bárkitől az Ügyfél személyes adatainak feldolgozásával kapcsolatban, a <strong>Szolgáltató</strong> értesíti az <strong>Ügyfelet</strong> a kérelemről, és a <strong>Szolgáltató</strong> nem válaszol a kérelemre az <strong>Ügyfél</strong> előzetes hozzájárulása nélkül. Ilyen megkeresések és kérelmek például bírósági, közigazgatási vagy szabályozó hatósági határozatok az Ügyfél személyes adataival kapcsolatban, ahol az értesítés nem tiltott az Alkalmazandó Jogszabályok által, vagy egy érintett személy kérelme. Ha az Alkalmazandó Jogszabályok megengedik, a <strong>Szolgáltató</strong> követi az <strong>Ügyfél</strong> ésszerű utasításait ezekkel a kérelmekkel kapcsolatban, beleértve az állapotfrissítések és egyéb, az <strong>Ügyfél</strong> által ésszerűen kért információk megadását. Ha egy érintett személy érvényes kérelmet tesz az Alkalmazandó Adatvédelmi Jogszabályok szerint az Ügyfél személyes adatainak törlésére vagy az adatok átadásának megtagadására a <strong>Szolgáltató</strong> részére, a <strong>Szolgáltató</strong> segíti az <strong>Ügyfelet</strong> a kérelem teljesítésében az Alkalmazandó Adatvédelmi Jogszabályok szerint. A <strong>Szolgáltató</strong> együttműködik és ésszerű segítséget nyújt az <strong>Ügyfélnek</strong>, az <strong>Ügyfél</strong> költségére, bármilyen jogi válasz vagy egyéb eljárási intézkedés során, amelyet az <strong>Ügyfél</strong> tesz egy harmadik fél kérelmére a <strong>Szolgáltató</strong> Ügyfél személyes adatainak feldolgozásával kapcsolatban jelen DPA alapján.

### 2. DPIA-k és DTIA-k {#2-dpias-and-dtias}

Ha az Alkalmazandó Adatvédelmi Jogszabályok előírják, a <strong>Szolgáltató</strong> ésszerű segítséget nyújt az <strong>Ügyfélnek</strong> bármilyen előírt adatvédelmi hatásvizsgálat vagy adatátviteli hatásvizsgálat elvégzésében, valamint a releváns adatvédelmi hatóságokkal folytatott konzultációkban, figyelembe véve a feldolgozás jellegét és az Ügyfél személyes adatait.

## 7. Ügyfél személyes adatainak törlése {#7-deletion-of-customer-personal-data}

### 1. Törlés az Ügyfél által {#1-deletion-by-customer}

A <strong>Szolgáltató</strong> lehetővé teszi az <strong>Ügyfél</strong> számára az Ügyfél személyes adatainak törlését a Szolgáltatások funkcióinak megfelelő módon. A <strong>Szolgáltató</strong> a lehető leghamarabb eleget tesz ennek az utasításnak, kivéve, ha az Alkalmazandó Jogszabály további tárolást ír elő az Ügyfél személyes adatai számára.

### 2. Törlés a DPA lejártakor {#2-deletion-at-dpa-expiration}

a. A DPA lejárta után a <strong>Szolgáltató</strong> az <strong>Ügyfél</strong> utasítása szerint visszaadja vagy törli az Ügyfél személyes adatait, kivéve, ha az Alkalmazandó Jogszabály további tárolást ír elő vagy engedélyez. Ha a visszaadás vagy megsemmisítés nem kivitelezhető vagy tiltott az Alkalmazandó Jogszabályok szerint, a <strong>Szolgáltató</strong> ésszerű erőfeszítéseket tesz az Ügyfél személyes adatainak további feldolgozásának megakadályozására, és továbbra is védi azokat az Ügyfél személyes adatait, amelyek a birtokában, felügyelete alatt vagy irányítása alatt maradnak. Például az Alkalmazandó Jogszabályok előírhatják, hogy a <strong>Szolgáltató</strong> folytassa az Ügyfél személyes adatainak tárolását vagy feldolgozását.
b. Ha a <strong>Vevő</strong> és a <strong>Szolgáltató</strong> az EGT SCC-ket vagy az Egyesült Királyság Kiegészítését beépítette ebbe az Adatfeldolgozási Megállapodásba (DPA), a <strong>Szolgáltató</strong> csak akkor adja át a <strong>Vevő</strong> részére a személyes adatok törléséről szóló igazolást, amelyet az EGT SCC-k 8.1(d) és 8.5 pontja ír le, ha a <strong>Vevő</strong> kéri azt.


## 8. Felelősségkorlátozás {#8-limitation-of-liability}

### 1. Felelősségi plafonok és kártérítési lemondás {#1-liability-caps-and-damages-waiver}

**A vonatkozó adatvédelmi jogszabályok által megengedett legteljesebb mértékben mindkét fél összesített felelőssége a másik fél felé, amely ebből a DPA-ból ered vagy azzal kapcsolatos, a <strong>Megállapodás</strong> szerinti lemondások, kizárások és felelősségkorlátozások hatálya alá tartozik.**

### 2. Kapcsolódó fél általi igények {#2-related-party-claims}

**Bármilyen, a <strong>Szolgáltató</strong> vagy annak kapcsolt vállalkozásai ellen ezen DPA-ból eredő vagy azzal kapcsolatos igényeket kizárólag az a <strong>Vevő</strong> entitás érvényesíthet, amely a <strong>Megállapodás</strong> félként szerepel.**

### 3. Kivételek {#3-exceptions}

1. Ez a DPA nem korlátozza az egyénnel szembeni felelősséget az egyén adatvédelmi jogai tekintetében a vonatkozó adatvédelmi jogszabályok alapján. Ezen túlmenően ez a DPA nem korlátozza a felek közötti felelősséget az EGT SCC-k vagy az Egyesült Királyság Kiegészítésének megsértése esetén.


## 9. Dokumentumok közötti ellentmondások {#9-conflicts-between-documents}

1. Ez a DPA a Megállapodás része és kiegészítője. Ha bármilyen ellentmondás van e DPA, a <strong>Megállapodás</strong> vagy azok bármely rész között, az előbb felsorolt rész elsőbbséget élvez az utóbbival szemben az adott ellentmondás tekintetében: (1) az EGT SCC-k vagy az Egyesült Királyság Kiegészítése, (2) ez a DPA, majd (3) a <strong>Megállapodás</strong>.


## 10. A megállapodás időtartama {#10-term-of-agreement}

Ez a DPA akkor lép hatályba, amikor a <strong>Szolgáltató</strong> és a <strong>Vevő</strong> elfogad egy DPA fedőlapot, és aláírja vagy elektronikus úton elfogadja a <strong>Megállapodást</strong>, és hatályban marad mindaddig, amíg a <strong>Megállapodás</strong> le nem jár vagy meg nem szűnik. Azonban a <strong>Szolgáltató</strong> és a <strong>Vevő</strong> mindketten kötelesek betartani a jelen DPA-ban és a vonatkozó adatvédelmi jogszabályokban foglalt kötelezettségeket mindaddig, amíg a <strong>Vevő</strong> nem szünteti meg az Ügyfél személyes adatainak továbbítását a <strong>Szolgáltató</strong> részére, és a <strong>Szolgáltató</strong> nem szünteti meg az Ügyfél személyes adatainak feldolgozását.


## 11. Irányadó jog és választott bíróságok {#11-governing-law-and-chosen-courts}

A <strong>Megállapodás</strong> irányadó jogára vagy hasonló rendelkezéseire való tekintet nélkül, a jelen DPA értelmezésére és az abból eredő vitákra a <strong>Irányadó Állam</strong> jogszabályai az irányadók, figyelmen kívül hagyva az ütköző jogi szabályokat. Ezen túlmenően, és a fórumválasztásra, illetékességre vagy hasonló rendelkezésekre való tekintet nélkül a <strong>Megállapodás</strong> esetében, a felek megállapodnak abban, hogy a jelen DPA-val kapcsolatos bármely jogi keresetet, pert vagy eljárást a <strong>Irányadó Állam</strong> bíróságainál indítanak, és mindkét fél visszavonhatatlanul aláveti magát ezen bíróságok kizárólagos illetékességének.


## 12. Szolgáltató és megbízó viszonya {#12-service-provider-relationship}

Amennyiben alkalmazandó a Kaliforniai Fogyasztói Adatvédelmi Törvény, Cal. Civ. Code § 1798.100 és következői ("CCPA"), a felek elismerik és elfogadják, hogy a <strong>Szolgáltató</strong> adatfeldolgozóként működik, és a <strong>Vevőtől</strong> személyes adatokat kap a Szolgáltatás nyújtásához a <strong>Megállapodás</strong> szerint, amely üzleti célnak minősül. A <strong>Szolgáltató</strong> nem értékesíti a <strong>Vevő</strong> által a <strong>Megállapodás</strong> alapján átadott személyes adatokat. Ezen túlmenően a <strong>Szolgáltató</strong> nem őrzi meg, nem használja fel és nem hozza nyilvánosságra a <strong>Vevő</strong> által a <strong>Megállapodás</strong> alapján átadott személyes adatokat, kivéve, ha az a Szolgáltatás nyújtásához szükséges a <strong>Vevő</strong> részére, ahogy azt a <strong>Megállapodás</strong> előírja, vagy ha azt a vonatkozó adatvédelmi jogszabályok megengedik. A <strong>Szolgáltató</strong> igazolja, hogy megérti ezen bekezdés korlátozásait.
## 13. Meghatározások {#13-definitions}

1. **„Alkalmazandó jogszabályok”** jelentik azokat a törvényeket, szabályokat, rendeleteket, bírósági határozatokat és egyéb kötelező érvényű előírásokat, amelyeket egy illetékes kormányzati hatóság alkalmaz vagy amelyek egy felet szabályoznak.

2. **„Alkalmazandó adatvédelmi jogszabályok”** jelentik azokat az Alkalmazandó jogszabályokat, amelyek szabályozzák, hogy a Szolgáltatás hogyan dolgozhat fel vagy használhat fel egyéni személyes adatokat, személyes információkat, azonosítható személyes adatokat vagy egyéb hasonló kifejezést.

3. **„Adatkezelő”** az Alkalmazandó adatvédelmi jogszabályokban meghatározott jelentéssel bír azon társaság esetében, amely meghatározza a személyes adatok feldolgozásának célját és mértékét.

4. **„Fedőlap”** olyan dokumentum, amelyet a felek aláírnak vagy elektronikus úton elfogadnak, amely magában foglalja ezeket a DPA szabványos feltételeket, és azonosítja a <strong>Szolgáltatót</strong>, a <strong>Megrendelőt</strong>, valamint az adatfeldolgozás tárgyát és részleteit.

5. **„Megrendelő személyes adatai”** jelentik azokat a személyes adatokat, amelyeket a <strong>Megrendelő</strong> feltölt vagy biztosít a <strong>Szolgáltató</strong> részére a Szolgáltatás keretében, és amelyeket ez a DPA szabályoz.

6. **„DPA”** jelenti ezeket a DPA szabványos feltételeket, a <strong>Szolgáltató</strong> és a <strong>Megrendelő</strong> közötti Fedőlapot, valamint a Fedőlapban hivatkozott vagy ahhoz csatolt irányelveket és dokumentumokat.

7. **„EEA SCC-k”** jelentik az Európai Bizottság 2021. június 4-i 2021/914 végrehajtási határozatához mellékelt szabványos szerződéses záradékokat, amelyek a személyes adatok harmadik országokba történő továbbítására vonatkoznak az Európai Parlament és a Tanács (EU) 2016/679 rendelete alapján.

8. **„Európai Gazdasági Térség”** vagy **„EGT”** jelentik az Európai Unió tagállamait, Norvégiát, Izlandot és Liechtensteint.

9. **„GDPR”** jelenti az Európai Unió 2016/679 rendeletét, amelyet a releváns EGT tagállamban helyi jogszabályként hajtanak végre.

10. **„Személyes adat”** az Alkalmazandó adatvédelmi jogszabályokban meghatározott jelentéssel bír a személyes információkra, személyes adatokra vagy egyéb hasonló kifejezésre.

11. **„Feldolgozás”** vagy **„Feldolgoz”** az Alkalmazandó adatvédelmi jogszabályokban meghatározott jelentéssel bír bármely személyes adat használatára vagy számítógépes művelet végrehajtására, beleértve az automatikus módszereket is.

12. **„Adatfeldolgozó”** az Alkalmazandó adatvédelmi jogszabályokban meghatározott jelentéssel bír azon társaság esetében, amely az Adatkezelő nevében dolgozza fel a személyes adatokat.

13. **„Jelentés”** jelent audit jelentéseket, amelyeket egy másik társaság készít a Biztonsági Irányelvben meghatározott szabványok szerint a Szolgáltató nevében.

14. **„Korlátozott továbbítás”** jelent (a) ahol a GDPR alkalmazandó, a személyes adatok EGT-ből olyan harmadik országba történő továbbítását, amely nem rendelkezik az Európai Bizottság által elfogadott megfelelősségi határozattal; és (b) ahol az Egyesült Királyság GDPR-je alkalmazandó, a személyes adatok Egyesült Királyságból bármely más országba történő továbbítását, amely nem rendelkezik az Egyesült Királyság 2018. évi Adatvédelmi törvényének 17A. szakasza szerinti megfelelősségi szabályozással.

15. **„Biztonsági esemény”** jelent a GDPR 4. cikkében meghatározott személyes adatvédelmi incidens.

16. **„Szolgáltatás”** jelenti a <strong>Szerződésben</strong> leírt terméket és/vagy szolgáltatásokat.

17. **„Különleges kategóriájú adatok”** jelentése a GDPR 9. cikkében meghatározott.

18. **„Alfeldolgozó”** az Alkalmazandó adatvédelmi jogszabályokban meghatározott jelentéssel bír azon társaság esetében, amely az Adatkezelő jóváhagyásával és elfogadásával segíti az Adatfeldolgozót az Adatkezelő nevében történő személyes adat feldolgozásában.

19. **„UK GDPR”** jelenti az Európai Unió 2016/679 rendeletét, amelyet az Egyesült Királyság 2018-as Európai Unió (Kilépési) törvényének 3. szakasza hajt végre az Egyesült Királyságban.

20. **„UK Kiegészítés”** jelenti az EEA SCC-khez kiadott nemzetközi adatátviteli kiegészítőt az Információs Biztosító által azon felek számára, akik korlátozott továbbításokat végeznek az 2018. évi Adatvédelmi törvény S119A(1) szakasza alapján.


## Köszönetnyilvánítás {#credits}

Ez a dokumentum a [Common Paper DPA Standard Terms (1.0 verzió)](https://commonpaper.com/standards/data-processing-agreement/1.0) alapján készült, és a [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) licenc alatt áll.
