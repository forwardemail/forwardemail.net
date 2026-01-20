# Visszaélés bejelentése {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

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

Kérjük, tekintse át a [Feltételek](/terms) pontunkat, mivel az az egész webhelyre vonatkozik.

## Visszaélési jelentés beküldése {#how-to-submit-an-abuse-report}

A visszaélési bejelentéseket eseti alapon, e-mailben vizsgáljuk felül, és a [nagyközönség](#for-the-general-public) és [bűnüldözés](#for-law-enforcement) tulajdonosokra vonatkozó információs kéréseket eseti alapon intézzük.

A felhasználókkal, e-mail címekkel, IP-címekkel és/vagy domainekkel kapcsolatos visszaélési jelentéseket és információigényléseket a továbbiakban együttesen „Fióknak” nevezzük.

A visszaélésekkel kapcsolatos kéréseivel vagy bejelentéseivel kapcsolatban a következő e-mail címünkre lehet válaszolni: `abuse@forwardemail.net`

Olvasd el az alábbi részeket további információkért, amelyek vonatkozhatnak rád.

## A nagyközönség számára {#for-the-general-public}

<u>**Ha Ön vagy valaki más közvetlen veszélyben van, kérjük, azonnal értesítse a rendőrséget és a mentőszolgálatokat.**</u>

<u>**Fiókjához elveszett hozzáférés visszaszerzéséhez vagy egy rosszindulatú szereplő megállításához forduljon szakértői jogi tanácsért.**</u>

Ha egy, a szolgáltatásunkat használó fiókból visszaélés áldozata lett, kérjük, küldje el bejelentését e-mailben a fenti címre. Ha fiókját egy rosszindulatú szereplő vette át (pl. a domainje nemrég lejárt, egy harmadik fél újraregisztrálta, majd visszaélésre használta), kérjük, küldjön bejelentést a fenti címre a pontos fiókadataival (pl. a domainneve). A korábbi tulajdonjog érvényesítése után segíthetünk a fiók ideiglenes visszaszerzésében ([árnyéktilalom](https://en.wikipedia.org/wiki/Shadow_banning)). Felhívjuk figyelmét, hogy nincs hatáskörünk segíteni a fiókjához való hozzáférés visszaszerzésében.

Jogi képviselője azt tanácsolhatja, hogy vegye fel a kapcsolatot a bűnüldöző szervekkel, a fiókja tulajdonosával (pl. a domainnév regisztrátorával; azzal a weboldallal, ahol a domainnevet regisztrálta), és/vagy halassza el Önt a [Az ICANN elveszett domainekről szóló oldala](https://www.icann.org/resources/pages/lost-domain-names)-ra.

## Rendvédelmi szervek számára {#for-law-enforcement}

A kérelmek többségénél az információk kiadására vonatkozó jogunkat a [Elektronikus hírközlési adatvédelmi törvény](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipédia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) és az azt követő törvények („ECPA”) szabályozzák. Az ECPA előírja, hogy bizonyos felhasználói adatokat csak bizonyos típusú jogi megkeresésekre, például idézésekre, bírósági végzésekre és házkutatási parancsokra válaszul adjunk ki a bűnüldöző szerveknek.

Ha Ön a bűnüldöző szervek tagja, és egy fiókkal kapcsolatos információt keres, akkor a kérésében szerepelnie kell a fiók adatainak, valamint a dátum- és időtartománynak. Nem dolgozhatunk fel túlságosan általános és/vagy homályos kéréseket – erre felhasználóink adatainak és bizalmának védelme, és ami a legfontosabb, adataik biztonságának megőrzése érdekében van szükségünk.

Ha a kérelme a [Feltételek](/terms) irányelvünk megsértését jelzi számunkra, akkor a visszaélések kezelésére vonatkozó, kizárólag belső használatra szánt legjobb gyakorlataink szerint dolgozzuk fel – vegye figyelembe, hogy bizonyos esetekben ez a fiók felfüggesztéséhez és/vagy kitiltásához vezethet.

**Mivel nem vagyunk domainnév-regisztrátor**, ha egy domainnévvel kapcsolatos korábbi DNS-rekordinformációkat szeretne keresni, akkor vegye fel a kapcsolatot a domainhez tartozó adott domainnév-regisztrátorral. Az olyan szolgáltatások, mint a [Security Trails]() , biztosíthatnak korábbi rekordok keresését, de a regisztrátor konkrétabb és pontosabb információkat is nyújthat. Annak meghatározásához, hogy kik a domainnév-regisztrátor és/vagy a DNS-névszerverek tulajdonosai egy adott domainhez, a `dig` és a `whois` eszközök hasznosak lehetnek (pl. `whois example.com` vagy `dig example.com ns`). DNS-rekordkereséssel (pl. `dig example.com mx` és `dig example.com txt`) megállapíthatja, hogy egy fiók fizetős vagy ingyenes csomagban van-e a szolgáltatásunkban. Ha az MX rekordok nem adnak vissza olyan értékeket, mint a `mx1.forwardemail.net` és a `mx2.forwardemail.net`, akkor a domain nem használja a szolgáltatásunkat. Ha a TXT rekordok egy sima szöveges e-mail címet adnak vissza (pl. `forward-email=user@example.com`), akkor az egy domain e-mail-átirányítási célcímét jelzi. Ha ehelyett egy `forward-email-site-verification=XXXXXXXXXX`-hez hasonló értéket adnak vissza, akkor az azt jelzi, hogy fizetős csomagban van, és az átirányítási konfiguráció az adatbázisunkban a `whois`0 azonosító alatt van tárolva. Ha további információt szeretne kapni arról, hogyan működik szolgáltatásunk DNS-szinten, kérjük, tekintse meg a `whois`1-et.

### Milyen információk érhetők el {#what-information-is-available}

Kérjük, tekintse át a [Összegyűjtött információk](/privacy#information-collected) fiókra vonatkozó adatvédelmi irányelveinket. A fiókok az adatmegőrzési és adatvédelmi törvényeknek megfelelően eltávolíthatják adataikat a rendszerünkből; a [Információ eltávolítása](/privacy#information-removal) fiókra vonatkozó adatvédelmi irányelveinket pedig tekintse át. Ez azt jelenti, hogy a kért információk a fiók törlése miatt a kérés időpontjában esetleg nem érhetők el.

### Milyen információk nem érhetők el {#what-information-is-not-available}

Kérjük, tekintse meg az Adatvédelmi irányelveinket a [Nem gyűjtött információk](/privacy#information-not-collected) esetében.

### Az Egyesült Államokban működő bűnüldöző szervek {#law-enforcement-based-in-the-united-states}

A [vészhelyzetek kivételével](#law-enforcement-emergency-requests) esetében a fiókadatokat csak érvényes idézés, ECPA (amerikai bírósági végzés) és/vagy házkutatási parancs kézhezvétele esetén osztjuk meg.

Ezenkívül [értesítsen egy fiókot](#law-enforcement-requests-may-trigger-account-notices) jogosultságot is adhatunk egy bűnüldöző szervekkel kapcsolatos kérésre vonatkozóan, kivéve, ha ezt törvény vagy bírósági végzés tiltja számunkra.

Amennyiben érvényes idézést, ECPA szerinti bírósági végzést és/vagy házkutatási parancsot kapunk, akkor a legjobb tudásunk szerint biztosítjuk a releváns és rendelkezésre álló információkat.

### Az Egyesült Államokon kívüli bűnüldöző szervek {#law-enforcement-based-outside-of-the-united-states}

Előírjuk, hogy az Egyesült Államokon kívüli bűnüldöző szervek számára a kérelmeket az alábbi módok egyikén kell kézbesíteni:

* Az Egyesült Államok bírósága.
* Végrehajtó szerv a [Az Egyesült Államok kölcsönös jogsegélyszerződése](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipédia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT”) eljárásai szerint.
* Egy külföldi kormánytól származó végzés, amelyre az Egyesült Államok főügyésze által megállapított és a Kongresszusnak hitelesített végrehajtási megállapodás vonatkozik, megfelel a [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) követelményeinek.

### Rendvédelmi vészhelyzeti kérelmek {#law-enforcement-emergency-requests}

Ahogy azt az Egyesült Államok törvényei megengedik (pl. a [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)törvénynek megfelelően, ha a szolgáltató jóhiszeműen úgy véli, hogy egy halálos vagy súlyos testi sérüléssel járó vészhelyzet bármely személytől késedelem nélkül köteles közölni a vészhelyzettel kapcsolatos kommunikációt), és [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Kivételek az ügyfélnyilvántartás%20közzétételére vonatkozóan.%20A szolgáltató%20leírt%20az%20alsection%20(a)%20lehet%20közzétenni%20feljegyzést%20vagy%20egyéb%20információt%20közölhet az előfizető%20vagy%20ügyfél%20ilyen%20szolgáltatás%20(ide nem értve a%20alsection%20(a)\(1)%20vagy%20(a)\(2)\)%E2%80%94) által lefedett kommunikációk%20tartalmát), amennyiben jóhiszeműen és a kérelmező független ellenőrzésével – jogosultak vagyunk Fiókadatokat idézés, ECPA bírósági végzés és/vagy házkutatási parancs nélkül nyilvánosságra hozni és megosztani a bűnüldöző szervekkel, ha úgy véljük, hogy erre késedelem nélkül szükség van haláleset vagy súlyos testi sérülés megelőzése érdekében.

A gyors és időben történő feldolgozás érdekében kérjük, hogy a sürgősségi adatigényléseket („EDR”) e-mailben küldjék el, és tartalmazzák az összes releváns információt.

Felhívjuk a figyelmet arra, hogy tisztában vagyunk a kifinomult hamisítási, adathalász és személyes adatokkal való visszaélési támadásokkal e-mailben (pl. lásd: [ez a cikk a The Guardianből](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Az EDR-ek feldolgozására vonatkozó szabályzatunk a következő:

1. Függetlenül kutasd fel az e-mail fejléc metaadatait (pl. DKIM/SPF/DMARC) (vagy azok hiányát) ellenőrzés céljából.

2. Jóhiszeműen (szükség esetén ismételt kísérletekkel) igyekszünk telefonon függetlenül felvenni a kapcsolatot a kérelmezővel – a kérelem hitelességének megerősítése érdekében. Például kutatunk a `.gov` weboldalon, amely a kérelem forrásához kapcsolódik, majd felhívjuk az irodát a nyilvánosan közzétett hivatalos telefonszámukról a kérelem ellenőrzése érdekében.

### A bűnüldöző szervek kérései fiókértesítéseket válthatnak ki. {#law-enforcement-requests-may-trigger-account-notices}

Értesíthetjük a Fiókot, és átadhatjuk neki a rá vonatkozó bűnüldözési megkeresés másolatát, kivéve, ha ezt törvény vagy bírósági végzés tiltja (pl. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Ilyen esetekben, adott esetben, értesíthetjük a Fiókot, amikor a titoktartási végzés lejárt.

Amennyiben a bűnüldöző szervek információkérése jogos, [megőrizni a szükséges és kért fiókadatokat](#law-enforcement-requests-to-preserve-information) módon és ésszerű erőfeszítéseket teszünk annak érdekében, hogy felvegyük a kapcsolatot a Fiók tulajdonosával a regisztrált és ellenőrzött e-mail címén (pl. 7 naptári napon belül). Ha időben (pl. 7 naptári napon belül) kapunk kifogást, akkor visszatartjuk a Fiókadatok megosztását, és szükség szerint folytatjuk a jogi eljárást.

### Rendvédelmi szervek kérelme az információk megőrzésére {#law-enforcement-requests-to-preserve-information}

A [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703) szerint tiszteletben tartjuk a bűnüldöző szervek érvényes kéréseit a Fiókra vonatkozó információk megőrzése érdekében. Felhívjuk a figyelmet, hogy az adatok megőrzése csak a kifejezetten kért és jelenleg elérhető adatokra korlátozódik.

### Rendvédelmi kézbesítési folyamat {#law-enforcement-serving-process}

Elvárjuk, hogy minden érvényes bűnüldözési megkeresés esetén érvényes és működő e-mail címet adjon meg nekünk, amellyel levelezhetünk, és amelyre elektronikusan elküldhetjük a kért információkat.

Minden kérést a fenti [Hogyan küldjünk be visszaélési bejelentést](#how-to-submit-an-abuse-report) alatt megadott e-mail címre kell küldeni.

Minden bűnüldözési megkeresést hivatalos és releváns e-mail címről, aláírással kell ellátni, ügynökségi vagy minisztériumi levélpapíron (pl. PDF szkennelt mellékletként).

Ha egy [sürgősségi kérés](#law-enforcement-emergency-requests) e-mailre vonatkozik, akkor kérjük, az e-mail tárgyába írja be: „Sürgősségi bűnüldözési kérelem”.

Kérjük, vegye figyelembe, hogy legalább két hétbe telhet, mire felmérjük és megválaszoljuk a kérelmét.