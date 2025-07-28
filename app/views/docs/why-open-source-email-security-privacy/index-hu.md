# Miért a nyílt forráskódú e-mail a jövő: Az e-mail továbbításának előnye {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lusta" src="/img/articles/open-source.webp" alt="" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [A nyílt forráskódú előny: több, mint marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Mit jelent a valódi nyílt forráskód?](#what-true-open-source-means)
  * [A háttérprobléma: ahol a legtöbb „nyílt forráskódú” e-mail szolgáltatás elmarad](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [E-mail továbbítása: 100%-ban nyílt forráskódú, előtér és háttér](#forward-email-100-open-source-frontend-and-backend)
  * [Egyedülálló műszaki megközelítésünk](#our-unique-technical-approach)
* [A saját hosting lehetőség: a választás szabadsága](#the-self-hosting-option-freedom-of-choice)
  * [Miért támogatjuk az öntárhely szolgáltatást?](#why-we-support-self-hosting)
  * [Az önkiszolgáló e-mail valósága](#the-reality-of-self-hosting-email)
* [Miért van értelme fizetős szolgáltatásunknak (annak ellenére, hogy nyílt forráskódúak vagyunk)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Költség-összehasonlítás](#cost-comparison)
  * [Mindkét világ legjobbja](#the-best-of-both-worlds)
* [A zárt forrású megtévesztés: amit a Proton és a Tutanota nem mond el neked](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [A Proton Mail nyílt forráskódú követelései](#proton-mails-open-source-claims)
  * [Tutanota hasonló megközelítése](#tutanotas-similar-approach)
  * [Az adatvédelmi útmutatók vita](#the-privacy-guides-debate)
* [A jövő nyílt forráskódú](#the-future-is-open-source)
  * [Miért nyer a nyílt forráskód?](#why-open-source-is-winning)
* [Váltás e-mail továbbításra](#making-the-switch-to-forward-email)
* [Következtetés: Nyílt forráskódú e-mail a magánjövőért](#conclusion-open-source-email-for-a-private-future)

## Előszó {#foreword}

Egy olyan korszakban, amikor a digitális adatvédelemmel kapcsolatos aggodalmak minden korábbinál magasabbak, az általunk választott e-mail szolgáltatások minden eddiginél fontosabbak. Bár sok szolgáltató azt állítja, hogy az Ön magánéletét prioritásként kezeli, alapvető különbség van azok között, akik csak beszélnek a magánéletről, és azok között, akik valóban sétálnak. A Forward Emailnél szolgáltatásunkat a nyílt forráskódú fejlesztés révén a teljes átláthatóság alapjára építettük – nem csak a frontend alkalmazásainkban, hanem a teljes infrastruktúránkban.

Ez a blogbejegyzés azt mutatja be, hogy a nyílt forráskódú e-mail megoldások miért jobbak a zárt forráskódú alternatíváknál, miben tér el a mi megközelítésünk a versenytársaktól, például a Proton Mailtől és a Tutanotától, és miért kínálja fizetős szolgáltatásunk a legtöbb felhasználó számára a legjobb értéket – annak ellenére, hogy elköteleztük magunkat az önálló tárolási lehetőségek mellett.

## A nyílt forráskódú szoftverek előnye: Több, mint marketing {#the-open-source-advantage-more-than-just-marketing}

A „nyílt forráskódú” kifejezés az utóbbi években népszerű marketingszlogenné vált, a globális nyílt forráskódú szolgáltatások piaca várhatóan több mint 16%-os éves összetett növekedési rátával (CAGR) fog növekedni 2024 és 2032 között\[^1]. De mit is jelent valóban nyílt forráskódúnak lenni, és miért fontos ez az e-mail-adatvédelem szempontjából?

### Mit jelent az igazi nyílt forráskódú szoftver {#what-true-open-source-means}

A nyílt forráskódú szoftver a teljes forráskódját szabadon hozzáférhetővé teszi bárki számára, hogy megtekinthesse, módosíthassa és javítsa. Ez az átláthatóság olyan környezetet teremt, ahol:

* A biztonsági réseket a fejlesztők globális közössége azonosíthatja és kijavíthatja.
* Az adatvédelmi igények független kódellenőrzéssel ellenőrizhetők.
* A felhasználók nincsenek bezárva a saját fejlesztésű ökoszisztémákba.
* Az innováció gyorsabban megvalósul az együttműködésen alapuló fejlesztés révén.

Ami az e-mailt illeti – az online identitás gerincét képezi –, ez az átláthatóság nem csak jó dolog; elengedhetetlen a valódi magánélethez és biztonsághoz.

### A háttérrendszer problémája: Ahol a legtöbb „nyílt forráskódú” e-mail szolgáltatás kudarcot vall {#the-backend-problem-where-most-open-source-email-services-fall-short}

És itt kezd érdekessé válni a dolog. Sok népszerű, „adatvédelemre összpontosító” e-mail szolgáltató nyílt forráskódúként hirdeti magát, de van egy lényeges különbség, amit remélik, hogy nem fogsz észrevenni: **csak a frontendjeiket teszik nyílt forráskódúvá, miközben a backendjeik zárva maradnak**.

Ez mit jelent? A frontend az, amit lát, és amivel kommunikál – a webes felület vagy a mobilalkalmazás. A háttérben történik az e-mailek tényleges feldolgozása – ahol az üzeneteket tárolják, titkosítják és továbbítják. Amikor egy szolgáltató zárt forráskódú háttérrendszert tart:

1. Nem tudod ellenőrizni, hogy az e-mailjeidet valójában hogyan dolgozzák fel.
2. Nem tudod megerősíteni, hogy az adatvédelmi állításaik jogosak-e.
3. Inkább marketing állításokban bízol, mint ellenőrizhető kódban.
4. A biztonsági réseket rejtve tarthatod a nyilvánosság elől.

Ahogy az Adatvédelmi Útmutatók fórumain folytatott beszélgetések rávilágítottak, mind a Proton Mail, mind a Tutanota nyílt forráskódúnak vallja magát, de a backendjeik továbbra is zártak és saját fejlesztésűek\[^2]. Ez jelentős bizalmi réseket teremt – arra kérik Önt, hogy higgyen az adatvédelmi ígéreteikben anélkül, hogy ellenőrizni tudná azokat.

## E-mail továbbítása: 100%-ban nyílt forráskódú, frontend ÉS backend {#forward-email-100-open-source-frontend-and-backend}

A Forward Emailnél alapvetően más megközelítést alkalmaztunk. A teljes kódbázisunk – mind a frontend, mind a backend – nyílt forráskódú, és bárki számára megtekinthető a <https://github.com/forwardemail/forwardemail.net>. címen.

Ez azt jelenti:

1. **Teljes átláthatóság**: Az e-mailjeidet feldolgozó kód minden sora nyilvános ellenőrzésre rendelkezésre áll.

2. **Ellenőrzhető adatvédelem**: Adatvédelmi állításaink nem marketingfogások – ezek ellenőrizhető tények, amelyeket bárki megerősíthet a kódunk vizsgálatával.

3. **Közösségvezérelt biztonság**: Biztonságunkat a globális fejlesztői közösség kollektív szakértelme erősíti.

4. **Nincsenek rejtett funkciók**: Amit látsz, azt kapod – nincs rejtett követés, nincsenek titkos hátsó ajtók.

### Egyedi technikai megközelítésünk {#our-unique-technical-approach}

Az adatvédelem iránti elkötelezettségünk túlmutat a nyílt forráskóddal. Számos technikai újítást vezettünk be, amelyek megkülönböztetnek minket:

#### Egyedileg titkosított SQLite postaládák {#individually-encrypted-sqlite-mailboxes}

Ellentétben a hagyományos e-mail szolgáltatókkal, amelyek megosztott relációs adatbázisokat használnak (ahol egyetlen incidens felfedheti az összes felhasználó adatait), mi egyedileg titkosított SQLite fájlokat használunk minden postafiókhoz. Ez azt jelenti:

* Minden postaláda külön titkosított fájl
* Az egyik felhasználó adataihoz való hozzáférés nem biztosít hozzáférést másoknak
* Még a saját alkalmazottaink sem férhetnek hozzá az adataidhoz – ez egy alapvető tervezési döntés

Amint azt az Adatvédelmi útmutatók megbeszéléseiben kifejtettük:

> „A megosztott relációs adatbázisok (pl. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL stb.) mind bejelentkezést igényelnek (felhasználónévvel/jelszóval) az adatbázis-kapcsolat létrehozásához. Ez azt jelenti, hogy bárki, aki rendelkezik ezzel a jelszóval, bármit lekérdezhet az adatbázisból. Legyen szó akár egy gazember alkalmazottról, akár egy gonosz szobalány támadásáról. Ez azt is jelenti, hogy ha hozzáférsz egy felhasználó adataihoz, akkor mindenki más adataihoz is hozzáférsz. Másrészt az SQLite tekinthető megosztott adatbázisnak, de ahogyan használjuk (minden postaláda = egyedi SQLite fájl), sandboxossá teszi.”\[^3]

#### Kvantumálló titkosítás {#quantum-resistant-encryption}

Míg más szolgáltatók még mindig felzárkóznak, mi már bevezettünk kvantumálló titkosítási módszereket, hogy megvédjük e-mailjeit a jövőben a kvantumszámítástechnikából származó fenyegetésekkel szemben.

#### Nincsenek harmadik féltől származó függőségek {#no-third-party-dependencies}

Ellentétben a versenytársakkal, akik olyan szolgáltatásokra támaszkodnak, mint az Amazon SES az e-mailek kézbesítéséhez, mi a teljes infrastruktúránkat házon belül építettük ki. Ez kiküszöböli a harmadik féltől származó szolgáltatásokon keresztüli esetleges adatszivárgást, és teljes ellenőrzést biztosít a teljes e-mail-folyamat felett.

## Az önálló tárhelyszolgáltatás lehetősége: A választás szabadsága {#the-self-hosting-option-freedom-of-choice}

A nyílt forráskódú szoftverek egyik legerősebb aspektusa az általa nyújtott szabadság. Az e-mailek továbbítása révén soha nincs bezárva – ha úgy dönt, teljes platformunkat önállóan kezelheti.

### Miért támogatjuk az önálló tárhelyszolgáltatást {#why-we-support-self-hosting}

Hiszünk abban, hogy a felhasználók teljes ellenőrzést biztosítsanak adataik felett. Ezért teljes körű dokumentációval és beállítási útmutatókkal teljes platformunkat önkiszolgálóvá tettük. Ez a megközelítés:

* Maximális kontrollt biztosít a technikailag beállítottságú felhasználók számára
* Nincs szükség arra, hogy bennünk bízzon szolgáltatóként
* Lehetővé teszi a testreszabást az adott igényeknek megfelelően
* Biztosítja a szolgáltatás folytatását akkor is, ha cégünk nem működik

### Az önállóan tárhelyszolgáltató e-mailek valósága {#the-reality-of-self-hosting-email}

Noha az önálló üzemeltetés hatékony lehetőség, fontos megérteni a tényleges költségeket:

#### Pénzügyi költségek {#financial-costs}

* VPS vagy szerver költségei: $5-$50/hó alap beállítás esetén\[^4]
* Domain regisztráció és megújítás: $10-20/év
* SSL tanúsítványok (bár a Let's Encrypt ingyenes opciókat is kínál)
* A monitorozási szolgáltatások és a biztonsági mentési megoldások lehetséges költségei

#### Időköltségek {#time-costs}

* Kezdeti beállítás: Több óra vagy nap, a technikai szakértelemtől függően
* Folyamatos karbantartás: 5-10 óra/hónap frissítések, biztonsági javítások és hibaelhárítás céljából\[^5]
* Tanulási görbe: E-mail protokollok, biztonsági legjobb gyakorlatok és szerveradminisztráció megértése

#### Technikai kihívások {#technical-challenges}

* E-mail kézbesítési problémák (üzenetek spamként való megjelölése)
* A fejlődő biztonsági szabványok követése
* Magas szintű rendelkezésre állás és megbízhatóság biztosítása
* A spam szűrésének hatékony kezelése

Ahogy egy tapasztalt, saját tárhelyen működő szolgáltató fogalmazott: „Az e-mail egy alapvető szolgáltatás... Olcsóbb az e-mailjeimet \[egy szolgáltatónál] tárolni, mint pénzt *és* időt költeni arra, hogy saját tárhelyen tároljam őket.”\[^6]

## Miért van értelme fizetős szolgáltatásunknak (annak ellenére, hogy nyílt forráskódúak vagyunk) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Tekintettel a saját üzemeltetéssel járó kihívásokra, fizetős szolgáltatásunk mindkét világból a legjobbat kínálja: a nyílt forráskód átláthatóságát és biztonságát a felügyelt szolgáltatás kényelmével és megbízhatóságával.

### Költség-összehasonlítás {#cost-comparison}

Ha az anyagi és időköltségeket is figyelembe veszi, fizetős szolgáltatásunk kivételes értéket kínál:

* **Saját tárhelyszolgáltatás teljes költsége**: $56-$252/hó (beleértve a szerverköltségeket és az időértékelést)
* **Fizetős e-mail-továbbítási csomagok**: $3-$9/hó

Fizetős szolgáltatásunk:

* Professzionális menedzsment és karbantartás
* Megbízható IP-cím a jobb kézbesítés érdekében
* Rendszeres biztonsági frissítések és felügyelet
* Támogatás problémák esetén
* A nyílt forráskódú megközelítésünk összes adatvédelmi előnye

### A két világ legjava {#the-best-of-both-worlds}

Az E-mail továbbítása lehetőséget választva a következőket kapja:

1. **Ellenőrizhető adatvédelem**: Nyílt forráskódú kódbázisunknak köszönhetően megbízhat adatvédelmi állításainkban.
2. **Professzionális kezelés**: Nem kell e-mail szerver szakértővé válnia.
3. **Költséghatékonyság**: Alacsonyabb összköltség, mint a saját tárhelyszolgáltatásnál.
4. **A kötődésmentesség mentes**: Az önálló tárhelyszolgáltatás lehetősége mindig elérhető marad.

## A zárt forráskódú megtévesztés: Amit Proton és Tutanota nem mond el {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Nézzük meg közelebbről, miben tér el megközelítésünk a népszerű „adatvédelmi központú” e-mail szolgáltatóktól.

### A Proton Mail nyílt forráskódú állításai {#proton-mails-open-source-claims}

A Proton Mail nyílt forráskódúként hirdeti magát, de ez csak a frontend alkalmazásaira vonatkozik. A backend rendszerük – ahol az e-maileket ténylegesen feldolgozzák és tárolják – továbbra is zárt forráskódú\[^7]. Ez azt jelenti:

* Nem tudod ellenőrizni, hogyan kezelik az e-mailjeidet.* Ellenőrzés nélkül meg kell bíznod az adatvédelmi állításaikban.* A háttérrendszerük biztonsági réseinek rejtve kell maradniuk a nyilvános ellenőrzés elől.* Saját tárhelyszolgáltatási lehetőségek nélkül az ökoszisztémájukhoz vagy kötve.

### Tutanota hasonló megközelítése {#tutanotas-similar-approach}

A Proton Mailhez hasonlóan a Tutanota is csak a frontendjét teszi nyílt forráskódúvá, miközben a backendjét saját fejlesztésűnek tartja\[^8]. Ugyanazokkal a bizalmi problémákkal szembesülnek:

* Nincs mód a háttérbeli adatvédelmi igények ellenőrzésére
* Korlátozott átláthatóság a tényleges e-mail-feldolgozásban
* A potenciális biztonsági problémák rejtve maradnak a nyilvánosság elől
* Beszállítóhoz kötöttség, nincs saját tárhely opció

### Az adatvédelmi útmutatók vitája {#the-privacy-guides-debate}

Ezek a korlátozások nem maradtak észrevétlenül az adatvédelmi közösségben. Az adatvédelmi útmutatókkal kapcsolatos megbeszélések során kiemeltük ezt a kritikus megkülönböztetést:

> „Azt állítja, hogy mind a Protonmail, mind a Tuta zárt forráskódú. Mert a backendjük valóban zárt forráskódú.”\[^9]

Azt is közöltük:

> „A jelenleg jegyzett PG e-mail szolgáltatók háttér-infrastruktúráiról nem történt nyilvánosan megosztott audit, és nem osztottak meg nyílt forráskódú kódrészleteket arról, hogyan dolgozzák fel a bejövő e-maileket.”\[^10]

Az átláthatóság hiánya alapvető bizalmi problémát okoz. Nyílt forráskódú háttérrendszerek nélkül a felhasználók kénytelenek az adatvédelmi igényeket a hitre, nem pedig az ellenőrzésre hivatkozni.

## A jövő a nyílt forráskódú {#the-future-is-open-source}

A nyílt forráskódú megoldások irányába mutató tendencia az egész szoftveriparban felgyorsul. A legújabb kutatások szerint:

* A nyílt forráskódú szoftverek piaca 41,83 milliárd dollárról (2024) 48,92 milliárd dollárra (2025) növekszik\[^11]
* A vállalatok 80%-a számolt be a nyílt forráskódú szoftverek használatának növekedéséről az elmúlt évben\[^12]
* A nyílt forráskódú szoftverek elterjedése várhatóan továbbra is gyorsan fog bővülni

Ez a növekedés alapvető változást tükröz a szoftverbiztonságról és adatvédelemről való gondolkodásunkban. Ahogy a felhasználók egyre tudatosabbá válnak a magánélet védelmében, a nyílt forráskódú megoldások révén ellenőrizhető adatvédelem iránti igény csak növekedni fog.

### Miért nyer a nyílt forráskódú szoftverek? {#why-open-source-is-winning}

A nyílt forráskód előnyei egyre nyilvánvalóbbak:

1. **Biztonság az átláthatóságon keresztül**: A nyílt forráskódú kódot több ezer szakértő is felülvizsgálhatja, nem csak egy belső csapat.
2. **Gyorsabb innováció**: Az együttműködésen alapuló fejlesztés felgyorsítja a fejlődést.
3. **Bizalom az ellenőrzésen keresztül**: Az állítások ellenőrizhetők, nem pedig hitből kiindulva.
4. **Szabadság a gyártóhoz való kötődéstől**: A felhasználók továbbra is kézben tartják adataik és szolgáltatásaik feletti ellenőrzést.
5. **Közösségi támogatás**: Egy globális közösség segít a problémák azonosításában és megoldásában.

## Átállás az e-mailek továbbítására {#making-the-switch-to-forward-email}

A Továbbított e-mailre való átállás egyszerű, függetlenül attól, hogy egy olyan fő szolgáltatótól érkezik, mint a Gmail, vagy más, az adatvédelemre összpontosító szolgáltatást, például a Proton Mail vagy a Tutanota.

Szolgáltatásunk a következőket kínálja:

* Korlátlan számú domain és alias
* Standard protokoll támogatás (SMTP, IMAP, POP3) saját hidak nélkül
* Zökkenőmentes integráció a meglévő e-mail kliensekkel
* Egyszerű beállítási folyamat átfogó dokumentációval
* Megfizethető árcsomagok már havi 3 dollártól

## Konklúzió: Nyílt forráskódú e-mail a privát jövőért {#conclusion-open-source-email-for-a-private-future}

Egy olyan világban, ahol a digitális adatvédelem egyre nagyobb veszélyben van, a nyílt forráskódú megoldások átláthatósága kulcsfontosságú biztosítékot jelent. A Forward Emailnél büszkék vagyunk arra, hogy az e-mailek adatvédelmének teljes mértékben nyílt forráskódú megközelítésével élen járunk.

Ellentétben azokkal a versenytársakkal, akik csak részben alkalmazzák a nyílt forráskódot, a teljes platformunkat – a frontendet és a backendet – elérhetővé tettük nyilvános ellenőrzés számára. Ez az átláthatóság iránti elkötelezettség innovatív technikai megközelítésünkkel kombinálva olyan ellenőrizhető adatvédelmet biztosít, amelyhez a zárt forráskódú alternatívák egyszerűen nem férnek hozzá.

Függetlenül attól, hogy felügyelt szolgáltatásunkat használja, vagy saját maga működteti platformunkat, élvezheti a valóban nyílt forráskódú e-mailek biztonságát, adatvédelmét és nyugalmát.

Az e-mail jövője nyitott, átlátható és az adatvédelemre összpontosít. A jövő az E-mail továbbítása.

\[^1]: SNS Insider. „A nyílt forráskódú szolgáltatások piacát 2023-ban 28,6 milliárd USD-re becsülték, és 2032-re eléri a 114,8 milliárd USD-t, 2032-re 16,70%-os éves összetett növekedési ütemmel.” [Nyílt forráskódú szolgáltatások piacának méretéről és elemzéséről szóló jelentés, 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Adatvédelmi útmutatók közössége. „E-mail továbbítása (e-mail szolgáltató) – Webhelyfejlesztés / Eszközjavaslatok.” [Adatvédelmi útmutatók megbeszélése](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Adatvédelmi útmutatók közössége. „E-mail továbbítása (e-mail szolgáltató) – Webhelyfejlesztés / Eszközjavaslatok.” [Adatvédelmi útmutatók megbeszélése](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. „Általánosságban elmondható, hogy havonta 5 és 50 dollár közötti összeget kell költeni egy alapvető virtuális magánszerverre (VPS), amely az e-mail szervert futtatja.” [A 10 legjobb saját üzemeltetésű e-mail szerverplatform 2025-ben](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Postai úton küldött levelek fóruma. „A karbantartás talán 16 órámba telt abban az időszakban...” [Az önkiszolgáló levelezőszerver rosszallóan nézett rá](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. „TL:DR: Mint minden saját tárhelyen futó dolog, EZ IS IDŐT IGÉNYEL. Ha nincs rá időd, mindig jobb, ha egy saját tárhelyen futó platformnál maradsz...” [E-mail szerver saját üzemeltetése? Miért vagy miért nem? Mi a népszerű?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: E-mail továbbítása. „A Proton Mail azt állítja magáról, hogy nyílt forráskódú, de a háttérrendszerük valójában zárt forráskódú.” [Tutanota vs Proton Mail összehasonlítás (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: E-mail továbbítása. „A Tutanota nyílt forráskódúnak vallja magát, de a háttérrendszerük valójában zárt forráskódú.” [Proton Mail vs Tutanota összehasonlítás (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Adatvédelmi útmutatók közössége. „Azt állítja, hogy mind a Protonmail, mind a Tuta zárt forráskódú. Mert a backendjük valóban zárt forráskódú.” [E-mail továbbítása (e-mail szolgáltató) – Webhelyfejlesztés / Eszközjavaslatok](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Adatvédelmi útmutatók közössége. „A jelenleg jegyzett PG e-mail szolgáltatók háttér-infrastruktúráiról nem történt nyilvánosan megosztott audit, és nem osztottak meg nyílt forráskódú kódrészleteket arról, hogyan dolgozzák fel a bejövő e-maileket.” [E-mail továbbítása (e-mail szolgáltató) – Webhelyfejlesztés / Eszközjavaslatok](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. „A nyílt forráskódú szoftverek piaca 41,83 milliárd USD-ről (2024) 48,92 milliárd USD-re (2025) fog növekedni egy összetett...” [Mi az a nyílt forráskódú szoftver?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. „Mivel a vállalatok 80%-a számolt be a nyílt forráskódú technológiák fokozott használatáról az elmúlt évben, ez...” [Feltörekvő trendek a nyílt forráskódú közösségekben 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)