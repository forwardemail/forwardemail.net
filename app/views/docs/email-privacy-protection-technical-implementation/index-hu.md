# Hogyan működik az e-mail-továbbítás az e-mailek továbbításával: A teljes útmutató {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lusta" src="/img/articles/email-privacy.webp" alt="" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Mi az e-mail továbbítás](#what-is-email-forwarding)
* [Hogyan működik az e-mail továbbítás: a technikai magyarázat](#how-email-forwarding-works-the-technical-explanation)
  * [Az e-mail továbbítási folyamat](#the-email-forwarding-process)
  * [Az SRS (Sender Rewriting Scheme) szerepe](#the-role-of-srs-sender-rewriting-scheme)
* [Hogyan működik az e-mail továbbítás: az egyszerű magyarázat](#how-email-forwarding-works-the-simple-explanation)
* [Az e-mail továbbítás beállítása az e-mail továbbítással](#setting-up-email-forwarding-with-forward-email)
  * [1. Regisztráljon fiókot](#1-sign-up-for-an-account)
  * [2. Adja hozzá a domainjét](#2-add-your-domain)
  * [3. Állítsa be a DNS-rekordokat](#3-configure-dns-records)
  * [4. Hozzon létre e-mail-továbbításokat](#4-create-email-forwards)
  * [5. Kezdje el használni új e-mail címeit](#5-start-using-your-new-email-addresses)
* [Az e-mail továbbítás speciális funkciói](#advanced-features-of-forward-email)
  * [Eldobható címek](#disposable-addresses)
  * [Több címzett és helyettesítő karakterek](#multiple-recipients-and-wildcards)
  * ["E-mail küldése másként" integráció](#send-mail-as-integration)
  * [Kvantum-ellenálló biztonság](#quantum-resistant-security)
  * [Egyedileg titkosított SQLite postafiókok](#individually-encrypted-sqlite-mailboxes)
* [Miért válassza az e-mailek továbbítását a versenytársakkal szemben?](#why-choose-forward-email-over-competitors)
  * [1. 100%-ban nyílt forráskódú](#1-100-open-source)
  * [2. Adatvédelem-központú](#2-privacy-focused)
  * [3. Nincs harmadik féltől való függés](#3-no-third-party-reliance)
  * [4. Költséghatékony árképzés](#4-cost-effective-pricing)
  * [5. Korlátlan erőforrások](#5-unlimited-resources)
  * [6. A főbb szervezetek megbízásából](#6-trusted-by-major-organizations)
* [Az e-mail-továbbítás általános használati esetei](#common-use-cases-for-email-forwarding)
  * [Vállalkozásoknak](#for-businesses)
  * [Fejlesztőknek](#for-developers)
  * [Magánélet-tudatos egyéneknek](#for-privacy-conscious-individuals)
* [Az e-mail-továbbítás legjobb gyakorlatai](#best-practices-for-email-forwarding)
  * [1. Használjon leíró címeket](#1-use-descriptive-addresses)
  * [2. Végezze el a megfelelő hitelesítést](#2-implement-proper-authentication)
  * [3. Rendszeresen tekintse át előreküldéseit](#3-regularly-review-your-forwards)
  * [4. Állítsa be az "E-mail küldése másként" beállítást a zökkenőmentes válaszokhoz](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Óvatosan használja a Catch-All címeket](#5-use-catch-all-addresses-cautiously)
* [Következtetés](#conclusion)

## Előszó {#foreword}

Az e-mail továbbítás egy hatékony eszköz, amely átalakíthatja az online kommunikáció kezelését. Legyen szó üzleti tulajdonosról, aki professzionális e-mail címeket szeretne létrehozni egyéni domainjével, magánélet-tudatos egyén, aki meg akarja védeni elsődleges e-mailjeit, vagy rugalmas e-mail-kezelést igénylő fejlesztő, az e-mail-továbbítás megértése elengedhetetlen a mai digitális környezetben.

A Forward Emailnél a világ legbiztonságosabb, privát és legrugalmasabb e-mail-továbbítási szolgáltatását hoztuk létre. Ebben az átfogó útmutatóban elmagyarázzuk, hogyan működik az e-mail-továbbítás (technikai és gyakorlati szempontból is), végigvezetjük az egyszerű beállítási folyamaton, és rávilágítunk arra, hogy szolgáltatásunk miért tűnik ki a versenytársak közül.

## Mi az az e-mail-továbbítás? {#what-is-email-forwarding}

Az e-mail-átirányítás egy olyan folyamat, amely automatikusan átirányítja az egyik e-mail-címre küldött e-maileket egy másik célcímre. Például, amikor valaki e-mailt küld a <contact@yourdomain.com> címre, az üzenet automatikusan továbbítható a személyes Gmail, Outlook vagy bármely más e-mail fiókjába.

Ez a látszólag egyszerű képesség hatalmas előnyöket kínál:

* **Professzionális arculattervezés**: Használjon e-mail címeket egyéni domainnel (<ön@sajátdomain.com>), miközben mindent kezelhet meglévő személyes postaládájából.
* **Adatvédelem**: Hozzon létre eldobható vagy célspecifikus címeket, amelyek védik az elsődleges e-mail fiókját.
* **Egyszerűsített kezelés**: Több e-mail cím összevonása egyetlen postaládába.
* **Rugalmasság**: Korlátlan számú címet hozhat létre különböző célokra anélkül, hogy több fiókot kellene kezelnie.

## Hogyan működik az e-mail-továbbítás: A technikai magyarázat {#how-email-forwarding-works-the-technical-explanation}

Akit érdekelnek a technikai részletek, nézzük meg, mi történik a kulisszák mögött, amikor egy e-mailt továbbítanak.

### Az e-mail továbbítási folyamat {#the-email-forwarding-process}

1. **DNS-konfiguráció**: A folyamat a domain DNS-rekordjaival kezdődik. Az e-mail-továbbítás beállításakor MX (Mail Exchange) rekordokat kell konfigurálni, amelyek jelzik az internetnek, hogy hová kell kézbesíteni a domainhez tartozó e-maileket. Ezek a rekordok az e-mail-szervereinkre mutatnak.

2. **E-mail fogadása**: Amikor valaki e-mailt küld az egyéni domain címedre (pl. <ön@sajátdomain.com>), az e-mail szerverük kikeresi a domain MX rekordjait, és kézbesíti az üzenetet a szervereinknek.

3. **Feldolgozás és hitelesítés**: Szervereink fogadják az e-mailt, és számos kritikus funkciót látnak el:
* A feladó hitelességének ellenőrzése olyan protokollok használatával, mint az SPF, DKIM és DMARC
* Rosszindulatú tartalom keresése
* A címzett ellenőrzése a továbbítási szabályok alapján

4. **Feladó átírása**: Itt történik a varázslat. A Sender Rewriting Scheme (SRS) funkciót alkalmazzuk az e-mail válaszútjának módosítására. Ez azért kulcsfontosságú, mert sok e-mail szolgáltató elutasítja a továbbított e-maileket megfelelő SRS-megvalósítás nélkül, mivel azok hamisítottnak tűnhetnek.

5. **Továbbítás**: Az e-mail ezután az eredeti tartalommal sértetlenül elküldésre kerül a célcímedre.

6. **Kézbesítés**: Az e-mail megérkezik a postaládájába, és úgy jelenik meg, mintha a továbbítási címére küldték volna, megőrizve az egyéni domain professzionális megjelenését.

### Az SRS (küldő átírási séma) szerepe {#the-role-of-srs-sender-rewriting-scheme}

Az SRS külön figyelmet érdemel, mert elengedhetetlen a megbízható e-mail-továbbításhoz. Az e-mail továbbításakor a feladó címét át kell írni, hogy az e-mail átmenjen az SPF-ellenőrzéseken a végső célállomáson.

SRS nélkül a továbbított e-mailek gyakran meghiúsulnak az SPF-ellenőrzésen, és spamként jelölik meg őket, vagy teljesen elutasítják őket. Az SRS megvalósítása biztosítja, hogy továbbított e-mailjei megbízhatóan kézbesítve legyenek, miközben az eredeti feladó adatait az Ön számára átlátható módon megőrizzük.

## Hogyan működik az e-mail-továbbítás: Az egyszerű magyarázat {#how-email-forwarding-works-the-simple-explanation}

Ha a technikai részletek elsöprőnek tűnnek, itt van egy egyszerűbb módja az e-mail-továbbítás megértésének:

Gondoljon az e-mail-továbbításra, mint a fizikai levelek továbbítására. Amikor új otthonba költözik, megkérheti a postát, hogy továbbítsa az összes levelet a régi címéről az új címére. Az e-mail továbbítás hasonlóan működik, csak digitális üzeneteknél.

Továbbító e-maillel:

1. Ön megadja nekünk, hogy a domainjén mely e-mail címeket szeretné beállítani (például <ertekesites@yourdomain.com> vagy <contact@yourdomain.com>).

2. Ön megadja nekünk, hogy hová szeretné kézbesíteni ezeket az e-maileket (például a Gmail- vagy Outlook-fiókjába).
3. Mi kezeljük az összes technikai részletet, hogy az egyéni címeire küldött e-mailek biztonságban megérkezzenek a megadott postaládájába.

Ez ilyen egyszerű! Professzionális e-mail címeket használhat anélkül, hogy megváltoztatná meglévő e-mail munkafolyamatát.

## E-mail-továbbítás beállítása az E-mail továbbítása funkcióval {#setting-up-email-forwarding-with-forward-email}

A Forward Email egyik legnagyobb előnye a beállítás egyszerűsége. Íme egy lépésről lépésre útmutató:

### 1. Fiók regisztrálása {#1-sign-up-for-an-account}

Látogasson el a [forwardemail.net](https://forwardemail.net) oldalra, és hozzon létre egy ingyenes fiókot. A regisztráció kevesebb mint egy percet vesz igénybe.

### 2. Add hozzá a domainedet {#2-add-your-domain}

Miután bejelentkezett, adja hozzá az e-mail-továbbításhoz használni kívánt domaint. Ha még nem rendelkezik domainnel, először meg kell vásárolnia egy domainregisztrátortól.

### 3. DNS-rekordok konfigurálása {#3-configure-dns-records}

Pontos DNS-rekordokat biztosítunk Önnek, amelyeket hozzá kell adnia domainjéhez. Ez jellemzően a következőket foglalja magában:

* MX rekordok hozzáadása, amelyek az e-mail szervereinkre mutatnak
* TXT rekordok hozzáadása az ellenőrzés és a biztonság érdekében

A legtöbb domainregisztrátor egyszerű kezelőfelülettel rendelkezik ezen rekordok hozzáadásához. Részletes útmutatókat biztosítunk minden nagyobb domainregisztrátor számára, hogy ezt a folyamatot a lehető legzökkenőmentesebbé tegyük.

### 4. E-mail továbbítások létrehozása {#4-create-email-forwards}

A DNS-rekordok ellenőrzése után (ami általában csak néhány percet vesz igénybe), létrehozhat e-mail-továbbításokat. Egyszerűen adja meg:

* A domainhez tartozó e-mail cím (pl. <contact@yourdomain.com>)
* A célhely, ahová az e-maileket küldeni szeretné (pl. a személyes Gmail-címe)

### 5. Kezdje el használni az új e-mail címeit {#5-start-using-your-new-email-addresses}

Ennyi! Az egyéni domaincímekre küldött e-maileket a rendszer a megadott célállomásra továbbítja. Annyi továbbítást hozhat létre, amennyire szüksége van, beleértve a gyűjtőcímeket is, amelyek az összes e-mailt továbbítják a domain bármely címére.

## Az e-mail továbbításának speciális funkciói {#advanced-features-of-forward-email}

Míg az alapvető e-mail-továbbítás önmagában is hatékony, az E-mail továbbítása számos speciális funkciót kínál, amelyek megkülönböztetnek minket:

### Eldobható címek {#disposable-addresses}

Hozzon létre konkrét vagy névtelen e-mail címeket, amelyek a fő fiókjába továbbítanak. Bármikor címkéket rendelhet ezekhez a címekhez, és bármikor engedélyezheti vagy letilthatja a beérkező levelek mappáját. Valódi e-mail címe soha nem kerül nyilvánosságra.

### Több címzett és helyettesítő karakterek {#multiple-recipients-and-wildcards}

Továbbítson egyetlen címet több címzettnek, így egyszerűvé téve az információk megosztását egy csapattal. Használhat helyettesítő karakteres címeket is (a mindenre kiterjedő továbbítás) a domainje bármely címére küldött e-mailek fogadásához.

### „E-mail küldése másként” integráció {#send-mail-as-integration}

Soha többé nem kell elhagynod a postaládádat, ha egyéni domainedről szeretnél e-maileket küldeni. Küldj és válaszolj az üzenetekre úgy, mintha a <you@yourdomain.com> címről érkeznének, közvetlenül a Gmail- vagy Outlook-fiókodból.

### Kvantumálló biztonság {#quantum-resistant-security}

Mi vagyunk a világ első és egyetlen olyan e-mail szolgáltatása, amely kvantumálló titkosítást használ, így megvédi kommunikációját még a legfejlettebb jövőbeli fenyegetésekkel szemben is.

### Egyedileg titkosított SQLite postaládák {#individually-encrypted-sqlite-mailboxes}

Más szolgáltatókkal ellentétben, amelyek az összes felhasználói e-mailt megosztott adatbázisokban tárolják, mi egyedileg titkosított SQLite-postafiókokat használunk a páratlan adatvédelem és biztonság érdekében.

## Miért válassza az e-mail továbbítását a versenytársak helyett? {#why-choose-forward-email-over-competitors}

Az e-mail-továbbítási piacnak számos szereplője van, de az E-mail továbbítása több fontos szempontból is kiemelkedik:

### 1. 100%-ban nyílt forráskódú {#1-100-open-source}

Mi vagyunk az egyetlen e-mail-továbbítási szolgáltatás, amely teljesen nyílt forráskódú, beleértve a háttérkódunkat is. Ez az átláthatóság bizalmat épít, és független biztonsági auditokat tesz lehetővé. Más szolgáltatások nyílt forráskódúnak vallhatják magukat, de nem adják ki a háttérkódjukat.

### 2. Adatvédelemre összpontosító {#2-privacy-focused}

Ezt a szolgáltatást azért hoztuk létre, mert Önnek joga van a magánélethez. Robusztus titkosítást használunk a TLS-szel, nem tárolunk SMTP-naplókat (kivéve a hibákat és a kimenő SMTP-t), és nem írjuk az e-maileket a lemeztárolóra.

### 3. Harmadik félre való támaszkodás kizárása {#3-no-third-party-reliance}

Ellentétben a versenytársakkal, akik az Amazon SES-re vagy más harmadik féltől származó szolgáltatásokra támaszkodnak, mi teljes ellenőrzést tartunk fenn infrastruktúránk felett, javítva a megbízhatóságot és az adatvédelmet.

### 4. Költséghatékony árképzés {#4-cost-effective-pricing}

Árképzési modellünk lehetővé teszi a költséghatékony skálázást. Nem számítunk fel díjat felhasználónként, a tárhelyért pedig menet közben fizethet. 3 USD/hó áron több funkciót kínálunk alacsonyabb áron, mint a versenytársak, például a Gandi (3,99 USD/hó).

### 5. Korlátlan erőforrások {#5-unlimited-resources}

Nem szabunk meg mesterséges korlátozásokat a domainekre, álnevekre vagy e-mail címekre, mint ahogy azt sok versenytárs teszi.

### 6. Főbb szervezetek bíznak benne {#6-trusted-by-major-organizations}

Szolgáltatásunkat több mint 500 000 domain használja, köztük olyan neves szervezetek, mint a [Az Egyesült Államok Haditengerészeti Akadémiája](/blog/docs/federal-government-email-service-section-889-compliant), a Netflix, a [A Linux Alapítvány](/blog/docs/linux-foundation-email-enterprise-case-study), a [Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), a Disney Ad Sales és sok más.

## Az e-mail-továbbítás gyakori felhasználási esetei {#common-use-cases-for-email-forwarding}

Az e-mail továbbítás számos kihívást old meg a különböző típusú felhasználók számára:

### Vállalkozásoknak {#for-businesses}

* Professzionális e-mail címek létrehozása a különböző részlegek számára (sales@, support@, info@)
* A csapat e-mail kommunikációjának egyszerű kezelése
* A márka egységességének fenntartása minden kommunikációban
* Az e-mail kezelés egyszerűsítése a személyzetváltások során

### Fejlesztőknek {#for-developers}

* Automatizált értesítési rendszerek beállítása
* Célspecifikus címek létrehozása a különböző projektekhez
* Webhookokkal való integráció a fejlett automatizálás érdekében
* API-nk használata egyedi megvalósításokhoz

### Adatvédelmet tiszteletben tartó személyek számára {#for-privacy-conscious-individuals}

* Hozz létre külön e-mail címeket a különböző szolgáltatásokhoz, hogy nyomon tudd követni, ki osztja meg az adataidat.* Használj eldobható címeket az egyszeri regisztrációkhoz.* Őrizd meg az adatvédelmedet az elsődleges e-mail címed védelmével.* Könnyen letilthatod azokat a címeket, amelyek elkezdenek spameket kapni.

## Az e-mail-továbbítás bevált gyakorlatai {#best-practices-for-email-forwarding}

Ha a legtöbbet szeretné kihozni az e-mail-továbbításból, vegye figyelembe az alábbi bevált módszereket:

### 1. Használjon leíró címeket {#1-use-descriptive-addresses}

Olyan e-mail címeket hozz létre, amelyek egyértelműen jelzik a céljukat (pl. <hírlevél@domain.com>, <vásárlás@domain.com>), hogy könnyebben rendszerezhesd a bejövő leveleidet.

### 2. Megfelelő hitelesítés megvalósítása {#2-implement-proper-authentication}

Győződjön meg arról, hogy domainje megfelelő SPF-, DKIM- és DMARC-rekordokkal rendelkezik a kézbesítés maximalizálása érdekében. Az E-mail továbbítása ezt egyszerűvé teszi irányított beállításunkkal.

### 3. Rendszeresen tekintse át továbbított üzeneteit {#3-regularly-review-your-forwards}

Rendszeresen ellenőrizze az e-mailek továbbítását, hogy letiltja azokat, amelyekre már nincs szükség, vagy amelyek túl sok spamet kapnak.

### 4. Állítsa be az „E-mail küldése más néven” funkciót a zökkenőmentes válaszok érdekében {#4-set-up-send-mail-as-for-seamless-replies}

Állítsa be a fő levelezőprogramot úgy, hogy egyéni domaincímként küldje el az e-maileket, hogy az átirányított e-mailekre való válaszadás során egyenletes legyen.

### 5. Óvatosan használja a gyűjtőcímeket {#5-use-catch-all-addresses-cautiously}

Bár a gyűjtőcímek kényelmesek, potenciálisan több levélszemetet kaphatnak. Fontolja meg konkrét továbbítások létrehozását a fontos kommunikációkhoz.

## Következtetés {#conclusion}

Az e-mail továbbítás egy hatékony eszköz, amely professzionalizmust, adatvédelmet és egyszerűséget biztosít az e-mailes kommunikációjában. Az e-mail továbbítással az elérhető legbiztonságosabb, privát és legrugalmasabb e-mail-továbbítási szolgáltatást kapja.

Mint az egyetlen 100%-ban nyílt forráskódú szolgáltató, amely kvantumálló titkosítással és az adatvédelemre összpontosít, ezért olyan szolgáltatást hoztunk létre, amely tiszteletben tartja az Ön jogait, miközben kivételes funkcionalitást biztosít.

Akár professzionális e-mail címeket szeretne létrehozni vállalkozása számára, akár magánéletét eldobható címekkel szeretné megvédeni, akár több e-mail fiók kezelését szeretné leegyszerűsíteni, a Forward Email tökéletes megoldást kínál.

Készen áll arra, hogy átalakítsa e-mail-élményét? [Regisztrálj ingyenesen](https://forwardemail.net) még ma, és csatlakozzon több mint 500 000 domainhez, amelyek már most is élvezik szolgáltatásunk előnyeit.

---

*Ezt a blogbejegyzést a Forward Email csapata írta, a világ legbiztonságosabb, legprivátabb és legrugalmasabb e-mail-továbbító szolgáltatásának megalkotói. Látogasson el a [forwardemail.net](https://forwardemail.net) oldalra, ahol többet megtudhat szolgáltatásunkról, és magabiztosan elkezdheti az e-mailek továbbítását.*