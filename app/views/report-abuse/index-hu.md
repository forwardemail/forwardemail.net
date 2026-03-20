# Visszaélés jelentése {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Visszaélés és spam jelentése a Forward Emailnek" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Jogi nyilatkozat](#disclaimer)
* [Hogyan nyújtsunk be visszaélésről szóló jelentést](#how-to-submit-an-abuse-report)
* [A nagyközönség számára](#for-the-general-public)
* [A rendőrség számára](#for-law-enforcement)
  * [Milyen információk állnak rendelkezésre](#what-information-is-available)
  * [Milyen információk nem állnak rendelkezésre](#what-information-is-not-available)
  * [Az Egyesült Államokban működő rendőrség](#law-enforcement-based-in-the-united-states)
  * [Az Egyesült Államokon kívüli rendőrség](#law-enforcement-based-outside-of-the-united-states)
  * [Rendőrségi sürgősségi kérelmek](#law-enforcement-emergency-requests)
  * [A rendőrségi kérelmek fiókértesítéseket válthatnak ki](#law-enforcement-requests-may-trigger-account-notices)
  * [Rendőrségi kérelmek az információk megőrzésére](#law-enforcement-requests-to-preserve-information)
  * [Rendőrségi kézbesítési eljárás](#law-enforcement-serving-process)


## Jogi nyilatkozat {#disclaimer}

Kérjük, vegye figyelembe a [Felhasználási feltételeinket](/terms), amelyek az egész oldalra érvényesek.


## Hogyan nyújtsunk be visszaélésről szóló jelentést {#how-to-submit-an-abuse-report}

Esetenként e-mailben vizsgáljuk a visszaélésről szóló jelentéseket és szolgáltatjuk az információkéréseket a [nagyközönség](#for-the-general-public) és a [rendőrség](#for-law-enforcement) számára.

A felhasználókra, e-mailekre, IP-címekre és/vagy domainekre vonatkozó visszaélésről szóló jelentéseket és információkéréseket az alábbiakban együttesen „Fiók”-ként említjük.

Az e-mail címeink, amelyeken keresztül visszaélésre vonatkozó kérelmét vagy jelentését elküldheti: `support@forwardemail.net`, `abuse@forwardemail.net` és `security@forwardemail.net`.

Kérjük, ha lehetséges, küldjön másolatot mindezekre az e-mail címekre, és küldjön emlékeztető e-maileket is, ha 24-48+ órán belül nem kap választ.

Az alábbi szakaszokat olvassa el további, Önre vonatkozó információkért.


## A nagyközönség számára {#for-the-general-public}

<u>**Ha Ön vagy valaki más közvetlen veszélyben van, kérjük, azonnal hívja a rendőrséget és a sürgősségi szolgálatokat.**</u>

<u>**Szakmai jogi tanácsot kell kérnie, hogy visszaszerezze elveszett hozzáférését a Fiókjához, vagy hogy megállítsa egy rosszindulatú szereplőt.**</u>

Ha Ön visszaélés áldozata egy olyan Fiók által, amely a szolgáltatásunkat használja, kérjük, küldje el jelentését az előzőekben megadott e-mail címre. Ha a Fiókját rosszindulatú szereplő vette át (pl. a domainje nemrég lejárt, egy harmadik fél újra regisztrálta, majd visszaélésekre használta), kérjük, küldjön nekünk jelentést az előzőekben megadott címre a pontos Fiókadataival (pl. domain neve). Segíthetünk a Fiók [árnyéktiltásában](https://en.wikipedia.org/wiki/Shadow_banning) az Ön korábbi tulajdonjogának érvényesítése után. Felhívjuk a figyelmet, hogy nincs hatáskörünk a Fiókhoz való hozzáférés visszaszerzésében.

Jogi képviselője tanácsolhatja, hogy forduljon a rendőrséghez, a Fiók tulajdonosához (pl. a domain név regisztrátorához; a weboldalhoz, ahol a domain nevet regisztrálta), és/vagy irányítsa Önt az [ICANN elveszett domainekről szóló oldalára](https://www.icann.org/resources/pages/lost-domain-names).


## A rendőrség számára {#for-law-enforcement}

A kérelmek többségénél az információk kiadására vonatkozó képességünket az [Elektronikus Kommunikációs Adatvédelmi Törvény](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), az [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) és az azt követő rendelkezések („ECPA”) szabályozzák. Az ECPA előírja, hogy bizonyos felhasználói adatokat csak meghatározott jogi kérelmekre, például idézésekre, bírósági végzésekre és házkutatási parancsokra adhatunk ki a rendőrség számára.

Ha Ön a rendőrség tagja, és egy Fiókra vonatkozó információt kér, kérjük, hogy a kérelem tartalmazza a Fiók adatait, valamint a dátum- és időintervallumot. Nem tudunk feldolgozni túl általános és/vagy homályos kérelmeket – ez a felhasználóink adatainak és bizalmának védelme, valamint legfőképpen az adataik biztonságának megőrzése érdekében történik.
Ha a kérésed a [Felhasználási feltételeink](/terms) megsértésére utal, akkor azt belső, kizárólagos visszaéléskezelési gyakorlatunk szerint dolgozzuk fel – megjegyzendő, hogy bizonyos esetekben ez azzal járhat, hogy a Fiókot felfüggesztjük és/vagy kitiltjuk.

**Mivel nem vagyunk domain név regisztrátor**, ha történeti DNS rekord információt szeretnél egy domain névvel kapcsolatban, akkor a megfelelő domain név regisztrátorhoz kell fordulnod. Olyan szolgáltatások, mint a [Security Trails]() nyújthatnak történeti rekord lekérdezést, de pontosabb és részletesebb információkat a regisztrátor tud adni. Annak megállapításához, hogy ki a domain név regisztrátora és/vagy a DNS névszerver tulajdonosa, hasznosak lehetnek a `dig` és `whois` eszközök (pl. `whois example.com` vagy `dig example.com ns`). Megállapíthatod, hogy egy Fiók fizetős vagy ingyenes csomagon van-e a szolgáltatásunkban DNS rekord lekérdezéssel (pl. `dig example.com mx` és `dig example.com txt`). Ha az MX rekordok nem adnak vissza olyan értékeket, mint `mx1.forwardemail.net` és `mx2.forwardemail.net`, akkor a domain nem használja a szolgáltatásunkat. Ha a TXT rekordok visszaadnak egy egyszerű szöveges email címet (pl. `forward-email=user@example.com`), akkor ez a domain email továbbítási címét jelzi. Ha ehelyett olyan értéket ad vissza, mint `forward-email-site-verification=XXXXXXXXXX`, akkor az azt jelzi, hogy fizetős csomagon van, és a továbbítási beállítások az adatbázisunkban az `XXXXXXXXXX` azonosító alatt vannak tárolva. A szolgáltatásunk DNS szintű működéséről további információért kérjük, tekintsd meg a [GYIK](/faq) szekciót.

### Milyen információk érhetők el {#what-information-is-available}

Kérjük, tekintsd meg az Adatvédelmi Szabályzatunk [Gyűjtött információk](/privacy#information-collected) részét. A fiókok jogosultak eltávolítani adataikat rendszerünkből az adatmegőrzési és adatvédelmi törvényeknek megfelelően; erről bővebben az Adatvédelmi Szabályzat [Adatok eltávolítása](/privacy#information-removal) részében olvashatsz. Ez azt jelenti, hogy a kért információ a kérés időpontjában nem biztos, hogy elérhető a fiók törlése miatt.

### Milyen információk nem érhetők el {#what-information-is-not-available}

Kérjük, tekintsd meg az Adatvédelmi Szabályzatunk [Nem gyűjtött információk](/privacy#information-not-collected) részét.

### Az Egyesült Államokban működő jogérvényesítő szervek {#law-enforcement-based-in-the-united-states}

[A vészhelyzetek kivételével](#law-enforcement-emergency-requests) csak érvényes idézés, ECPA amerikai bírósági végzés és/vagy házkutatási parancs kézhezvétele esetén osztunk meg fiókinformációkat.

Továbbá [értesíthetjük a fiókot](#law-enforcement-requests-may-trigger-account-notices) a jogérvényesítő szervek kéréséről, kivéve, ha ezt törvény vagy bírósági végzés tiltja.

Érvényes idézés, ECPA bírósági végzés és/vagy házkutatási parancs esetén a lehető legteljesebb és elérhető információkat szolgáltatjuk.

### Az Egyesült Államokon kívül működő jogérvényesítő szervek {#law-enforcement-based-outside-of-the-united-states}

Követeljük, hogy az Egyesült Államokon kívüli jogérvényesítő szervek kérelmei az alábbi módok egyikén keresztül érkezzenek:

* Egy Egyesült Államokbeli bíróságon keresztül.
* Egy végrehajtó hatóság által egy [Egyesült Államok kölcsönös jogsegélyi egyezmény](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT") eljárásai szerint.
* Egy külföldi kormányzati végzés, amely egy végrehajtási megállapodás tárgyát képezi, amelyet az Egyesült Államok főügyésze megállapított és a Kongresszusnak igazolt, hogy megfelel az [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) követelményeinek.

### Jogérvényesítő szervek vészhelyzeti kérelmei {#law-enforcement-emergency-requests}

Az Egyesült Államokban a törvény által engedélyezett módon (pl. a [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) és [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), jóhiszeműen és a kérelmező független ellenőrzésével – idézés, ECPA bírósági végzés és/vagy házkutatási parancs nélkül is kiadhatunk és megoszthatunk fiókinformációkat a jogérvényesítő szervekkel, ha úgy véljük, hogy a halál vagy súlyos testi sérülés megelőzése érdekében haladéktalanul szükséges a közlés.
Vészhelyzeti adatkérelmeket ("EDR") kizárólag e-mailben fogadunk el, és kérjük, hogy minden releváns információt tartalmazzanak a gyors és hatékony feldolgozás érdekében.

Felhívjuk a figyelmet arra, hogy tisztában vagyunk az e-mailekkel kapcsolatos kifinomult hamisítási, adathalászati és személyazonosság-lopási támadásokkal (pl. lásd [ezt a cikket a The Guardian-től](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Az EDR-ek feldolgozására vonatkozó irányelveink a következők:

1. Függetlenül megvizsgáljuk az e-mail fejléc metaadatait (pl. DKIM/SPF/DMARC) (vagy azok hiányát) az ellenőrzés érdekében.

2. Jóhiszeműen a legjobb erőfeszítést tesszük (szükség esetén ismételt próbálkozásokkal) arra, hogy telefonon közvetlenül felvegyük a kapcsolatot a kérelmezővel – a kérés hitelességének megerősítése céljából. Például megvizsgálhatjuk a kérelmező joghatóságához tartozó `.gov` weboldalt, majd a nyilvánosan elérhető hivatalos telefonszámról felhívhatjuk az irodát a kérés ellenőrzése érdekében.

### A rendőrségi kérelmek fiókértesítéseket válthatnak ki {#law-enforcement-requests-may-trigger-account-notices}

Értesíthetjük a fiókot, és megoszthatunk velük egy példányt a rájuk vonatkozó rendőrségi kérelemről, kivéve, ha törvény vagy bírósági végzés (pl. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)) tiltja ezt. Ezekben az esetekben, ha alkalmazható, akkor a titoktartási végzés lejárta után értesíthetjük a fiókot.

Ha a rendőrségi információkérés érvényes, akkor [megőrizzük a szükséges és kért fiókinformációkat](#law-enforcement-requests-to-preserve-information), és ésszerű erőfeszítést teszünk, hogy a regisztrált és ellenőrzött e-mail címen keresztül felvegyük a kapcsolatot a fiók tulajdonosával (pl. 7 naptári napon belül). Ha időben érkezik ellenvetés (pl. 7 naptári napon belül), akkor visszatartjuk a fiókinformációk megosztását, és szükség szerint folytatjuk a jogi eljárást.

### Rendőrségi kérelmek az információ megőrzésére {#law-enforcement-requests-to-preserve-information}

Érvényes rendőrségi kérelmek esetén tiszteletben tartjuk az információ megőrzésére vonatkozó kéréseket a fiókkal kapcsolatban az [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703) alapján. Felhívjuk a figyelmet, hogy az adatok megőrzése kizárólag a kifejezetten kért és jelenleg elérhető adatokra korlátozódik.

### Rendőrségi kézbesítés {#law-enforcement-serving-process}

Minden érvényes rendőrségi kérelem esetén megköveteljük, hogy érvényes és működő e-mail címet biztosítsanak, amelyen keresztül levelezhetünk és elektronikusan megküldhetjük a kért információkat.

Minden kérelmet a fentebb megadott [Hogyan nyújtsunk be visszaélésről szóló jelentést](#how-to-submit-an-abuse-report) szakaszban megadott e-mail címre kell küldeni.

Minden rendőrségi kérelmet ügynökségi vagy osztályfejléccel kell ellátni (pl. PDF-be szkennelt mellékletként), hivatalos és releváns e-mail címről kell küldeni, és alá kell írni.

Ha vészhelyzeti kérelemről van szó ([emergency request](#law-enforcement-emergency-requests)), kérjük, írja az e-mail tárgyába: "Vészhelyzeti rendőrségi kérelem".

Kérjük, vegye figyelembe, hogy a kérelem átvizsgálása és megválaszolása legalább két hétig is eltarthat.
