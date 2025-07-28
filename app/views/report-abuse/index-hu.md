# Visszaélés bejelentése {#report-abuse}

<img loading="lusta" src="/img/articles/report-abuse.webp" alt="" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Jogi nyilatkozat](#disclaimer)
* [Hogyan küldjünk be visszaélési bejelentést](#how-to-submit-an-abuse-report)
* [A nagyközönség számára](#for-the-general-public)
* [Rendvédelmi szervek számára](#for-law-enforcement)
  * [Milyen információk állnak rendelkezésre](#what-information-is-available)
  * [Milyen információk nem állnak rendelkezésre](#what-information-is-not-available)
  * [Az Egyesült Államokban működő bűnüldöző szervek](#law-enforcement-based-in-the-united-states)
  * [Az Egyesült Államokon kívül működő bűnüldöző szervek](#law-enforcement-based-outside-of-the-united-states)
  * [Rendvédelmi sürgősségi kérelmek](#law-enforcement-emergency-requests)
  * [A bűnüldöző szervek megkeresései fiókértesítéseket válthatnak ki](#law-enforcement-requests-may-trigger-account-notices)
  * [A bűnüldöző szervek információmegőrzési kérelmei](#law-enforcement-requests-to-preserve-information)
  * [Rendvédelmi kézbesítési folyamat](#law-enforcement-serving-process)

## Jogi nyilatkozat {#disclaimer}

Kérjük, tartsák magukat a [Feltételek](/terms) szabályzatunkhoz, mivel az az egész webhelyre vonatkozik.

## Visszaélés bejelentésének módja {#how-to-submit-an-abuse-report}

A visszaélési bejelentéseket eseti alapon, e-mailben vizsgáljuk felül, és a [nagyközönség](#for-the-general-public) és [bűnüldözés](#for-law-enforcement) szervezetekre vonatkozó információs kéréseket eseti alapon intézzük.

A felhasználókkal, e-mail címekkel, IP-címekkel és/vagy domainekkel kapcsolatos visszaélési jelentéseket és információigényléseket a továbbiakban együttesen „Fióknak” nevezzük.

A visszaélésekkel kapcsolatos kéréseivel vagy bejelentéseivel kapcsolatban a következő e-mail címünkre lehet válaszolni: `abuse@forwardemail.net`

Olvasd el az alábbi részeket további információkért, amelyek vonatkozhatnak rád.

## A nagyközönség számára {#for-the-general-public}

<u>**Ha Ön vagy valaki más közvetlen veszélyben van, kérjük, azonnal értesítse a rendőrséget és a mentőszolgálatokat.**</u>

<u>**Fiókjához elveszett hozzáférés visszaszerzéséhez vagy egy rosszindulatú szereplő megállításához forduljon szakértői jogi tanácsért.**</u>

Ha visszaélés áldozata lett egy olyan fiókból, amely a szolgáltatásunkat használja, kérjük, küldje el bejelentését e-mailben a fenti címre. Ha fiókját rosszindulatú szereplő vette át (pl. a domainje nemrég lejárt, és egy harmadik fél újraregisztrálta, majd visszaélésre használta), kérjük, küldjön bejelentést a fenti címre a pontos fiókadataival (pl. a domainneve). A korábbi tulajdonjog érvényesítése után segíthetünk [árnyéktilalom](https://en.wikipedia.org/wiki/Shadow_banning) a fiókjában. Felhívjuk figyelmét, hogy nincs hatáskörünk segíteni a fiókjához való hozzáférés visszaszerzésében.

Jogi képviselője azt tanácsolhatja Önnek, hogy vegye fel a kapcsolatot a bűnüldöző szervekkel, a fiókja tulajdonosával (pl. a domainnév regisztrátorával; azzal a weboldallal, ahol a domainnevet regisztrálta), és/vagy felszólíthatja Önt a [Az ICANN elveszett domainekről szóló oldala](https://www.icann.org/resources/pages/lost-domain-names) végrehajtására.

## Rendvédelmi szervek számára {#for-law-enforcement}

A kérelmek többségében az információk kiadására vonatkozó jogunkat a [Elektronikus hírközlési adatvédelmi törvény](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipédia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) és az azt követő („ECPA”) törvények szabályozzák. Az ECPA előírja, hogy bizonyos felhasználói adatokat csak bizonyos típusú jogi megkeresésekre, például idézésekre, bírósági végzésekre és házkutatási parancsokra válaszul adjunk ki a bűnüldöző szerveknek.

Ha Ön a bűnüldöző szervek tagja, és egy fiókkal kapcsolatos információt keres, akkor a kérésében szerepelnie kell a fiók adatainak, valamint a dátum- és időtartománynak. Nem dolgozhatunk fel túlságosan általános és/vagy homályos kéréseket – erre felhasználóink adatainak és bizalmának védelme, és ami a legfontosabb, adataik biztonságának megőrzése érdekében van szükségünk.

Ha a kérelme a [Feltételek](/terms) irányelvünk megsértését jelzi számunkra, akkor azt a visszaélések kezelésére vonatkozó, kizárólag belső használatra szánt legjobb gyakorlataink szerint dolgozzuk fel – vegye figyelembe, hogy bizonyos esetekben ez a fiók felfüggesztéséhez és/vagy kitiltásához vezethet.

**Mivel nem vagyunk domainnév-regisztrátor**, ha egy domainnévvel kapcsolatos korábbi DNS-rekordinformációkat szeretne keresni, akkor vegye fel a kapcsolatot a domainhez tartozó adott domainnév-regisztrátorral. Az olyan szolgáltatások, mint a [Security Trails]() , biztosíthatnak korábbi rekordok keresését, de a regisztrátor konkrétabb és pontosabb információkat is nyújthat. Annak meghatározásához, hogy kik a domainnév-regisztrátor és/vagy a DNS-névszerverek tulajdonosai egy adott domainhez, a `dig` és `whois` eszközök hasznosak lehetnek (pl. `whois example.com` vagy `dig example.com ns`). DNS-rekordkereséssel (pl. `dig example.com mx` és `dig example.com txt`) megállapíthatja, hogy egy fiók fizetős vagy ingyenes csomagban van-e a szolgáltatásunkban. Ha az MX rekordok nem adnak vissza olyan értékeket, mint a `mx1.forwardemail.net` és a `mx2.forwardemail.net`, akkor a domain nem használja a szolgáltatásunkat. Ha a TXT rekordok egy sima szöveges e-mail címet adnak vissza (pl. `forward-email=user@example.com`), akkor az a domain e-mail továbbítási címét jelzi. Ha ehelyett egy olyan értéket adnak vissza, mint a `forward-email-site-verification=XXXXXXXXXX`, akkor az azt jelzi, hogy fizetős csomagban van, és az továbbítási konfiguráció az adatbázisunkban a `XXXXXXXXXX` azonosító alatt van tárolva. Ha további információt szeretne kapni arról, hogyan működik szolgáltatásunk DNS-szinten, kérjük, tekintse meg a [FAQ](/faq) oldalunkat.

### Milyen információk érhetők el {#what-information-is-available}

Kérjük, tekintse meg az Adatvédelmi irányelveinket a [Összegyűjtött információk](/privacy#information-collected) pontban. A fiókok az adatmegőrzési és adatvédelmi törvényeknek megfelelően eltávolíthatják adataikat a rendszerünkből; a [Információ eltávolítása](/privacy#information-removal) pontban található Adatvédelmi irányelveinket pedig a __PROTECTED_LINK_63__ pontban. Ez azt jelenti, hogy a kért információk a fiók törlése miatt a kérés időpontjában esetleg nem állnak rendelkezésre.

### Milyen információk nem érhetők el {#what-information-is-not-available}

Kérjük, tekintse meg az Adatvédelmi irányelveinket a [Nem gyűjtött információk](/privacy#information-not-collected) oldalon.

### Az Egyesült Államokban működő bűnüldöző szervek {#law-enforcement-based-in-the-united-states}

A [vészhelyzetek kivételével](#law-enforcement-emergency-requests) esetében a Fiókadatokat csak érvényes idézés, ECPA US bírósági végzés és/vagy házkutatási parancs kézhezvétele esetén osztjuk meg.

Ezenkívül [értesítsen egy fiókot](#law-enforcement-requests-may-trigger-account-notices) tájékoztathatunk minket a bűnüldöző szervek megkereséséről, kivéve, ha ezt törvény vagy bírósági végzés tiltja számunkra.

Amennyiben érvényes idézést, ECPA szerinti bírósági végzést és/vagy házkutatási parancsot kapunk, akkor a legjobb tudásunk szerint biztosítjuk a releváns és rendelkezésre álló információkat.

### Az Egyesült Államokon kívüli bűnüldöző szervek {#law-enforcement-based-outside-of-the-united-states}

Előírjuk, hogy az Egyesült Államokon kívüli bűnüldöző szervek számára a kérelmeket az alábbi módok egyikén kell kézbesíteni:

* Az Egyesült Államok bírósága.
* Végrehajtó szerv a [Az Egyesült Államok kölcsönös jogsegélyszerződése](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipédia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT”) eljárásai szerint.
* Egy külföldi kormánytól származó végzés, amely végrehajtási megállapodás hatálya alá tartozik, amelyet az Egyesült Államok főügyésze megállapított és a Kongresszusnak hitelesített, megfelel a [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) követelményeinek.

### Rendvédelmi szervek sürgősségi kérelmei {#law-enforcement-emergency-requests}

Ahogy azt az Egyesült Államokban a törvények megengedik (pl. a [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)törvénynek megfelelően, ha egy kormányzati szerv jóhiszeműen úgy véli, hogy egy halálos vagy súlyos testi sérüléssel járó vészhelyzet bármely személytől késedelem nélkül köteles közölni a vészhelyzettel kapcsolatos kommunikációt), és [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Kivételek az ügyfélnyilvántartások nyilvánosságra hozatalára vonatkozóan. Az (a) alszakaszban leírt szolgáltató nyilvánosságra hozhatja az előfizetőre vagy az ilyen szolgáltatásra vonatkozó egyéb információkat (ide nem értve az (a) alszakasz (1) vagy (2) alszakaszban (%E2)80%94) tárgyalt kommunikációk tartalmát), amennyiben jóhiszeműen és a tény független ellenőrzésével történik. kérelmező – idézés, ECPA bírósági végzés és/vagy házkutatási parancs nélkül is kiadhatjuk és megoszthatjuk a Fiókadatokat a bűnüldöző szervekkel, ha úgy véljük, hogy erre késedelem nélkül szükség van haláleset vagy súlyos testi sérülés megelőzése érdekében.

A gyors és időben történő feldolgozás érdekében kérjük, hogy a sürgősségi adatigényléseket („EDR”) e-mailben küldjék el, és tartalmazzák az összes releváns információt.

Felhívjuk a figyelmet arra, hogy tisztában vagyunk a kifinomult hamisítási, adathalász és személyes adatokkal való visszaélési támadásokkal e-mailben (pl. lásd: [ez a cikk a The Guardianből](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Az EDR-ek feldolgozására vonatkozó szabályzatunk a következő:

1. Függetlenül kutasd fel az e-mail fejléc metaadatait (pl. DKIM/SPF/DMARC) (vagy azok hiányát) ellenőrzés céljából.

2. Jóhiszeműen (szükség esetén ismételt kísérletekkel) igyekszünk telefonon függetlenül felvenni a kapcsolatot a kérelmezővel – a kérelem hitelességének megerősítése érdekében. Például utánanézhetünk a kérelem forrásához tartozó joghatósághoz tartozó `.gov` weboldalon, majd felhívhatjuk az irodát a nyilvánosan közzétett hivatalos telefonszámukról a kérelem ellenőrzése érdekében.

### A bűnüldöző szervek kérései fiókértesítéseket válthatnak ki {#law-enforcement-requests-may-trigger-account-notices}

Értesíthetjük a Fiókot, és átadhatjuk neki a rá vonatkozó bűnüldözési megkeresés másolatát, kivéve, ha ezt törvény vagy bírósági végzés tiltja számunkra (pl. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Ilyen esetekben, adott esetben, értesíthetjük a Fiókot, amikor a titoktartási végzés lejárt.

Amennyiben a bűnüldöző szervek információkérése jogos, [megőrizni a szükséges és kért fiókadatokat](#law-enforcement-requests-to-preserve-information) és ésszerű erőfeszítéseket teszünk annak érdekében, hogy felvegyük a kapcsolatot a Fiók tulajdonosával a regisztrált és ellenőrzött e-mail címén (pl. 7 naptári napon belül). Ha időben (pl. 7 naptári napon belül) kapunk kifogást, akkor visszatartjuk a Fiókadatok megosztását, és szükség szerint folytatjuk a jogi eljárást.

### Rendvédelmi kérelmek az információk megőrzésére {#law-enforcement-requests-to-preserve-information}

A [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703) dokumentumnak megfelelően tiszteletben tartjuk a bűnüldöző szervek jogos kéréseit a Fiókra vonatkozó információk megőrzése érdekében. Felhívjuk a figyelmet, hogy az adatok megőrzése csak a kifejezetten kért és jelenleg rendelkezésre álló adatokra korlátozódik.

### Rendvédelmi kézbesítési folyamat {#law-enforcement-serving-process}

Elvárjuk, hogy minden érvényes bűnüldözési megkeresés esetén érvényes és működő e-mail címet adjon meg nekünk, amellyel levelezhetünk, és amelyre elektronikusan elküldhetjük a kért információkat.

Minden kérést a fenti [Hogyan küldjünk be visszaélési bejelentést](#how-to-submit-an-abuse-report) pontban megadott e-mail címre kell küldeni.

Minden bűnüldözési megkeresést hivatalos és releváns e-mail címről, aláírással kell ellátni, ügynökségi vagy minisztériumi levélpapíron (pl. PDF szkennelt mellékletként).

Ha egy [sürgősségi kérés](#law-enforcement-emergency-requests)-ra vonatkozik, akkor kérjük, az e-mail tárgyába írja be, hogy „Sürgősségi bűnüldözési kérés”.

Kérjük, vegye figyelembe, hogy legalább két hétbe telhet, mire felmérjük és megválaszoljuk a kérelmét.