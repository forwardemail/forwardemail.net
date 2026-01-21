# Miért a nyílt forráskódú e-mail a jövő: Az e-mail továbbításának előnye {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [A nyílt forráskódú szoftverek előnye: több, mint marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Mit jelent az igazi nyílt forráskód?](#what-true-open-source-means)
  * [A háttérrendszer problémája: Ahol a legtöbb „nyílt forráskódú” e-mail szolgáltatás kudarcot vall](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [E-mail továbbítása: 100%-ban nyílt forráskódú, frontend ÉS backend felülettel is](#forward-email-100-open-source-frontend-and-backend)
  * [Egyedi műszaki megközelítésünk](#our-unique-technical-approach)
* [Az önálló tárhelyszolgáltatás lehetősége: A választás szabadsága](#the-self-hosting-option-freedom-of-choice)
  * [Miért támogatjuk az önkiszolgáló tárhelyet?](#why-we-support-self-hosting)
  * [Az önálló tárhelyszolgáltatással működő e-mailek valósága](#the-reality-of-self-hosting-email)
* [Miért van értelme fizetős szolgáltatásunknak (annak ellenére, hogy nyílt forráskódúak vagyunk)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Költség-összehasonlítás](#cost-comparison)
  * [A két világ legjava](#the-best-of-both-worlds)
* [A zárt forráskódú megtévesztés: Amit a Proton és a Tutanota nem mond el](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [A Proton Mail nyílt forráskódú állításai](#proton-mails-open-source-claims)
  * [Tutanota hasonló megközelítése](#tutanotas-similar-approach)
  * [Az adatvédelmi útmutatókról szóló vita](#the-privacy-guides-debate)
* [A jövő a nyílt forráskódú](#the-future-is-open-source)
  * [Miért nyerő a nyílt forráskódú technológia?](#why-open-source-is-winning)
* [Váltás az e-mail továbbítására](#making-the-switch-to-forward-email)
* [Konklúzió: Nyílt forráskódú e-mail a privát jövőért](#conclusion-open-source-email-for-a-private-future)

## Előszó {#foreword}

Egy olyan korban, amikor a digitális adatvédelemmel kapcsolatos aggodalmak minden eddiginél nagyobbak, az általunk választott e-mail szolgáltatások minden eddiginél fontosabbak. Míg sok szolgáltató azt állítja, hogy prioritásként kezeli az Ön adatainak védelmét, alapvető különbség van azok között, akik csupán beszélnek az adatvédelemről, és azok között, akik valóban megteszik a szükséges lépéseket. A Forward Emailnél szolgáltatásunkat a nyílt forráskódú fejlesztés révén a teljes átláthatóságra építettük – nemcsak a frontend alkalmazásainkban, hanem a teljes infrastruktúránkban is.

Ez a blogbejegyzés azt vizsgálja, hogy miért jobbak a nyílt forráskódú e-mail megoldások a zárt forráskódú alternatíváknál, miben különbözik a megközelítésünk a versenytársaktól, például a Proton Mailtől és a Tutanotától, és miért – az önálló tárhelyszolgáltatási lehetőségek iránti elkötelezettségünk ellenére – fizetős szolgáltatásunk kínálja a legjobb értéket a legtöbb felhasználó számára.

## A nyílt forráskódú szoftverek előnye: Több, mint marketing {#the-open-source-advantage-more-than-just-marketing}

A „nyílt forráskódú” kifejezés az utóbbi években népszerű marketingszlogenné vált, a globális nyílt forráskódú szolgáltatások piaca várhatóan több mint 16%-os éves összetett növekedési rátával (CAGR) fog növekedni 2024 és 2032 között\[^1]. De mit is jelent valóban nyílt forráskódúnak lenni, és miért fontos ez az e-mail-adatvédelem szempontjából?

### Mit jelent az igazi nyílt forráskód {#what-true-open-source-means}

A nyílt forráskódú szoftverek teljes forráskódját szabadon hozzáférhetővé teszik bárki számára, hogy megvizsgálhassa, módosíthassa és fejlessze. Ez az átláthatóság olyan környezetet teremt, ahol:

* A biztonsági réseket a fejlesztők globális közössége azonosíthatja és kijavíthatja.
* Az adatvédelmi igények független kódellenőrzéssel ellenőrizhetők.
* A felhasználók nincsenek bezárva a saját fejlesztésű ökoszisztémákba.
* Az innováció gyorsabban megvalósul az együttműködésen alapuló fejlesztés révén.

Ami az e-mailt illeti – az online identitás gerincét –, ez az átláthatóság nemcsak jó, ha van, hanem elengedhetetlen a valódi adatvédelem és biztonság szempontjából.

### A háttérrendszer problémája: Ahol a legtöbb „nyílt forráskódú” e-mail szolgáltatás kudarcot vall {#the-backend-problem-where-most-open-source-email-services-fall-short}

És itt kezd érdekessé válni a dolog. Sok népszerű, „adatvédelemre összpontosító” e-mail szolgáltató nyílt forráskódúként hirdeti magát, de van egy lényeges különbség, amit remélik, hogy nem fogsz észrevenni: **csak a frontendjeiket teszik nyílt forráskódúvá, miközben a backendjeik zárva maradnak**.

Mit jelent ez? A frontend az, amit látsz és amivel kapcsolatba lépsz – a webes felület vagy a mobilalkalmazás. A backend az, ahol a tényleges e-mail-feldolgozás történik – itt tárolják, titkosítják és továbbítják az üzeneteidet. Amikor egy szolgáltató zárt forráskódú backendet biztosít:

1. Nem tudod ellenőrizni, hogy az e-mailjeidet valójában hogyan dolgozzák fel.
2. Nem tudod megerősíteni, hogy az adatvédelmi állításaik jogosak-e.
3. Inkább marketing állításokban bízol, mint ellenőrizhető kódban.
4. A biztonsági réseket rejtve tarthatod a nyilvánosság elől.

Ahogy az Adatvédelmi Útmutatók fórumain folytatott beszélgetések rávilágítottak, mind a Proton Mail, mind a Tutanota nyílt forráskódúnak vallja magát, de a backendjeik továbbra is zártak és saját fejlesztésűek\[^2]. Ez jelentős bizalmi réseket teremt – arra kérik Önt, hogy higgyen az adatvédelmi ígéreteikben anélkül, hogy ellenőrizni tudná azokat.

## E-mail továbbítása: 100%-ban nyílt forráskódú, frontend ÉS backend {#forward-email-100-open-source-frontend-and-backend}

A Forward Emailnél alapvetően más megközelítést alkalmaztunk. A teljes kódbázisunk – mind a frontend, mind a backend – nyílt forráskódú, és bárki számára megtekinthető a <https://github.com/forwardemail/forwardemail.net>. címen.

Ez azt jelenti:

1. **Teljes átláthatóság**: Minden egyes kódsor, amely az e-mailjeidet feldolgozza, nyilvánosan ellenőrizhető.

2. **Ellenőrzhető adatvédelem**: Adatvédelmi állításaink nem marketingfogások – ezek ellenőrizhető tények, amelyeket bárki megerősíthet a kódunk vizsgálatával.

3. **Közösségvezérelt biztonság**: Biztonságunkat a globális fejlesztői közösség kollektív szakértelme erősíti.

4. **Nincsenek rejtett funkciók**: Amit látsz, azt kapod – nincs rejtett követés, nincsenek titkos hátsó ajtók.

### Egyedi technikai megközelítésünk {#our-unique-technical-approach}

Az adatvédelem iránti elkötelezettségünk túlmutat a nyílt forráskódú megoldásokon. Számos olyan technikai újítást vezettünk be, amelyek megkülönböztetnek minket a többitől:

#### Egyedileg titkosított SQLite postaládák {#individually-encrypted-sqlite-mailboxes}

A hagyományos e-mail-szolgáltatókkal ellentétben, amelyek megosztott relációs adatbázisokat használnak (ahol egyetlen behatolás is az összes felhasználó adatait nyilvánosságra hozhatja), mi minden postaládához külön titkosított SQLite fájlokat használunk. Ez azt jelenti, hogy:

* Minden postaláda külön titkosított fájl
* Az egyik felhasználó adataihoz való hozzáférés nem biztosít hozzáférést másoknak
* Még a saját alkalmazottaink sem férhetnek hozzá az adataidhoz – ez egy alapvető tervezési döntés

Ahogy az Adatvédelmi Útmutatókról szóló beszélgetésekben kifejtettük:

> „A megosztott relációs adatbázisok (pl. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL stb.) mind bejelentkezést igényelnek (felhasználónévvel/jelszóval) az adatbázis-kapcsolat létrehozásához. Ez azt jelenti, hogy bárki, aki rendelkezik ezzel a jelszóval, bármit lekérdezhet az adatbázisból. Legyen szó akár egy gazember alkalmazottról, akár egy gonosz szobalány támadásáról. Ez azt is jelenti, hogy ha hozzáférsz egy felhasználó adataihoz, akkor mindenki más adataihoz is hozzáférsz. Másrészt az SQLite tekinthető megosztott adatbázisnak, de ahogyan használjuk (minden postaláda = egyedi SQLite fájl), sandboxossá teszi.”\[^3]

#### Kvantumálló titkosítás {#quantum-resistant-encryption}

Míg más szolgáltatók még mindig utolérik a lemaradásukat, mi már bevezettünk kvantumrezisztens titkosítási módszereket, hogy biztosítsuk e-mail-adatvédelmed védelmét a kvantum-számítástechnika új fenyegetéseivel szemben.

#### Nincsenek harmadik féltől származó függőségek {#no-third-party-dependencies}

A versenytársainkkal ellentétben, akik olyan szolgáltatásokra támaszkodnak az e-mail kézbesítéshez, mint az Amazon SES, mi a teljes infrastruktúránkat házon belül építettük fel. Ez kiküszöböli a harmadik féltől származó szolgáltatásokon keresztüli adatvédelmi szivárgások lehetőségét, és teljes ellenőrzést biztosít számunkra a teljes e-mail folyamat felett.

## Az önálló tárhelyszolgáltatás lehetősége: A választás szabadsága {#the-self-hosting-option-freedom-of-choice}

A nyílt forráskódú szoftverek egyik legerősebb aspektusa a szabadság, amit nyújtanak. A Forward Email segítségével soha nem leszel bezárva – akár a teljes platformunkat is saját tárhelyen üzemeltetheted, ha úgy döntesz.

### Miért támogatjuk az önálló tárhelyszolgáltatást {#why-we-support-self-hosting}

Hiszünk abban, hogy a felhasználóknak teljes kontrollt kell adni az adataik felett. Ezért tettük teljes platformunkat önállóan tárhelyre állíthatóvá, átfogó dokumentációval és beállítási útmutatókkal. Ez a megközelítés:

* Maximális kontrollt biztosít a technikailag beállítottságú felhasználók számára
* Nincs szükség arra, hogy bennünk bízzon szolgáltatóként
* Lehetővé teszi a testreszabást az adott igényeknek megfelelően
* Biztosítja a szolgáltatás folytatását akkor is, ha cégünk nem működik

### Az önálló tárhelyszolgáltatású e-mailek valósága {#the-reality-of-self-hosting-email}

Bár az önálló tárhelyszolgáltatás egy hatékony megoldás, fontos megérteni a tényleges költségeket:

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

Tekintettel az önálló tárhelyszolgáltatás kihívásaira, fizetős szolgáltatásunk a két világ legjavát kínálja: a nyílt forráskódú szoftverek átláthatóságát és biztonságát a felügyelt szolgáltatás kényelmével és megbízhatóságával.

### Költség-összehasonlítás {#cost-comparison}

Ha figyelembe vesszük mind a pénzügyi, mind az időbeli költségeket, fizetős szolgáltatásunk kivételes értéket képvisel:

* **Saját tárhelyszolgáltatás teljes költsége**: $56-$252/hó (beleértve a szerverköltségeket és az időértékelést)
* **Email továbbítási fizetős csomagok**: $3-$9/hó

Fizetős szolgáltatásunk a következőket kínálja:

* Professzionális menedzsment és karbantartás
* Megbízható IP-cím a jobb kézbesítés érdekében
* Rendszeres biztonsági frissítések és felügyelet
* Támogatás problémák esetén
* A nyílt forráskódú megközelítésünk összes adatvédelmi előnye

### A két világ legjava {#the-best-of-both-worlds}

Az E-mail továbbítása opció kiválasztásával a következőket kapja:

1. **Ellenőrizhető adatvédelem**: Nyílt forráskódú kódbázisunknak köszönhetően megbízhat adatvédelmi állításainkban.
2. **Professzionális kezelés**: Nem kell e-mail szerver szakértővé válnia.
3. **Költséghatékonyság**: Alacsonyabb összköltség, mint a saját tárhelyszolgáltatásnál.
4. **A ragaszkodástól való mentesség**: Az önálló tárhelyszolgáltatás lehetősége mindig elérhető marad.

## A zárt forráskódú rendszerek megtévesztése: Amit Proton és Tutanota nem mond el {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Vizsgáljuk meg közelebbről, hogy miben különbözik a megközelítésünk a népszerű, „adatvédelemre összpontosító” e-mail-szolgáltatóktól.

### A Proton Mail nyílt forráskódú szoftverekre vonatkozó állításai {#proton-mails-open-source-claims}

A Proton Mail nyílt forráskódúként hirdeti magát, de ez csak a frontend alkalmazásaira vonatkozik. A backend rendszerük – ahol az e-maileket ténylegesen feldolgozzák és tárolják – továbbra is zárt forráskódú\[^7]. Ez azt jelenti:

* Nem tudod ellenőrizni, hogyan kezelik az e-mailjeidet.* Ellenőrzés nélkül meg kell bíznod az adatvédelmi állításaikban.* A háttérrendszerük biztonsági réseinek rejtve kell maradniuk a nyilvános ellenőrzés elől.* Saját tárhelyszolgáltatási lehetőségek nélkül az ökoszisztémájukhoz vagy kötve.

### Tutanota hasonló megközelítése {#tutanotas-similar-approach}

A Proton Mailhez hasonlóan a Tutanota is csak a frontendjét teszi nyílt forráskódúvá, miközben a backendjét saját fejlesztésűnek tartja\[^8]. Ugyanazokkal a bizalmi problémákkal szembesülnek:

* Nincs mód a háttérbeli adatvédelmi igények ellenőrzésére
* Korlátozott átláthatóság a tényleges e-mail-feldolgozásban
* A potenciális biztonsági problémák rejtve maradnak a nyilvánosság elől
* Beszállítóhoz kötöttség, nincs saját tárhely opció

### Az adatvédelmi útmutatók vitája {#the-privacy-guides-debate}

Ezek a korlátozások nem maradtak észrevétlenek az adatvédelmi közösségben. Az adatvédelmi útmutatókról szóló megbeszélések során kiemeltük ezt a fontos különbséget:

> „Azt állítja, hogy mind a Protonmail, mind a Tuta zárt forráskódú. Mert a backendjük valóban zárt forráskódú.”\[^9]

Azt is kijelentettük:

> „A jelenleg jegyzett PG e-mail szolgáltatók háttér-infrastruktúráiról nem történt nyilvánosan megosztott audit, és nem osztottak meg nyílt forráskódú kódrészleteket arról, hogyan dolgozzák fel a bejövő e-maileket.”\[^10]

Ez az átláthatóság hiánya alapvető bizalmi problémát okoz. Nyílt forráskódú háttérrendszerek nélkül a felhasználók kénytelenek a hitelesség, nem pedig az ellenőrzés alapján elfogadni az adatvédelmi igényeket.

## A jövő a nyílt forráskódú {#the-future-is-open-source}

A nyílt forráskódú megoldások felé irányuló trend felgyorsul a szoftveriparban. A legújabb kutatások szerint:

* A nyílt forráskódú szoftverek piaca 41,83 milliárd dollárról (2024) 48,92 milliárd dollárra (2025) növekszik\[^11]
* A vállalatok 80%-a számolt be a nyílt forráskódú szoftverek használatának növekedéséről az elmúlt évben\[^12]
* A nyílt forráskódú szoftverek elterjedése várhatóan továbbra is gyorsan fog bővülni

Ez a növekedés alapvető változást tükröz a szoftverbiztonságról és adatvédelemről alkotott képünkben. Ahogy a felhasználók egyre inkább tudatossá válnak az adatvédelemmel kapcsolatban, a nyílt forráskódú megoldásokon keresztül ellenőrizhető adatvédelem iránti igény csak növekedni fog.

### Miért nyer a nyílt forráskódú szoftver? {#why-open-source-is-winning}

A nyílt forráskódú szoftverek előnyei egyre nyilvánvalóbbak:

1. **Biztonság az átláthatóságon keresztül**: A nyílt forráskódú kódot több ezer szakértő is felülvizsgálhatja, nem csak egy belső csapat.
2. **Gyorsabb innováció**: Az együttműködésen alapuló fejlesztés felgyorsítja a fejlődést.
3. **Bizalom az ellenőrzésen keresztül**: Az állítások ellenőrizhetők, nem pedig hitből kiindulva.
4. **Szabadság a gyártóhoz való kötődéstől**: A felhasználók továbbra is kézben tartják adataik és szolgáltatásaik feletti ellenőrzést.
5. **Közösségi támogatás**: Egy globális közösség segít a problémák azonosításában és megoldásában.

## Váltás az e-mailek továbbítására {#making-the-switch-to-forward-email}

Az e-mailek továbbítására való áttérés egyszerű, függetlenül attól, hogy egy mainstream szolgáltatótól, például a Gmailtől, vagy más adatvédelemre összpontosító szolgáltatástól, például a Proton Mailtől vagy a Tutanotától érkezel.

Szolgáltatásunk a következőket kínálja:

* Korlátlan számú domain és alias
* Standard protokoll támogatás (SMTP, IMAP, POP3) saját hidak nélkül
* Zökkenőmentes integráció a meglévő e-mail kliensekkel
* Egyszerű beállítási folyamat átfogó dokumentációval
* Megfizethető árképzési csomagok már havi 3 dollártól

## Konklúzió: Nyílt forráskódú e-mail a privát jövőért {#conclusion-open-source-email-for-a-private-future}

Egy olyan világban, ahol a digitális adatvédelem egyre nagyobb veszélyben van, a nyílt forráskódú megoldások átláthatósága kulcsfontosságú védelmet nyújt. A Forward Emailnél büszkék vagyunk arra, hogy vezető szerepet töltünk be az e-mail adatvédelemmel kapcsolatos, teljesen nyílt forráskódú megközelítésünkkel.

A nyílt forráskódú technológiákat csak részben alkalmazó versenytársainkkal ellentétben mi a teljes platformunkat – a frontendet és a backendet egyaránt – nyilvános ellenőrzésre bocsátottuk. Ez az átláthatóság iránti elkötelezettségünk, innovatív technikai megközelítésünkkel kombinálva, olyan szintű ellenőrizhető adatvédelmet biztosít, amelyet a zárt forráskódú alternatívák egyszerűen nem tudnak elérni.

Akár a felügyelt szolgáltatásunkat használja, akár saját maga üzemelteti platformunkat, élvezheti a valóban nyílt forráskódú e-mail által nyújtott biztonság, adatvédelem és nyugalom előnyeit.

Az e-mail jövője a nyílt, átlátható és az adatvédelmet előtérbe helyező lesz. A jövő az e-mail továbbítása.

\[^1]: SNS Insider. „A nyílt forráskódú szolgáltatások piacát 2023-ban 28,6 milliárd USD-re becsülték, és 2032-re eléri a 114,8 milliárd USD-t, 2032-re 16,70%-os éves összetett növekedési ütemmel.” [Nyílt forráskódú szolgáltatások piacának mérete és elemzése 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Adatvédelmi útmutatók közössége. „E-mail továbbítása (e-mail szolgáltató) – Webhelyfejlesztés / Eszközjavaslatok.” [Adatvédelmi útmutatók megbeszélése](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Adatvédelmi útmutatók közössége. „E-mail továbbítása (e-mail szolgáltató) – Webhelyfejlesztés / Eszközjavaslatok.” [Adatvédelmi útmutatók megbeszélése](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. „Általánosságban elmondható, hogy havonta 5 és 50 dollár közötti összeget kell költeni egy alapvető virtuális magánszerverre (VPS), amely az e-mail szerver futtatásához szükséges.” [10 legjobb saját tárhelyen futó e-mail szerver platform 2025-ben](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Postai úton küldött levelek fóruma. „A karbantartás talán 16 órámba telt abban az időszakban...” [Saját tárhelyen működő levelezőszerver rosszallást kapott](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. „TL:DR: Mint minden saját tárhelyen futó dolog, EZ IS IDŐT IGÉNYEL. Ha nincs rá időd, mindig jobb, ha egy saját tárhelyen futónál maradsz...” [Saját tárhelyen üzemeltetett e-mail szerver? Miért vagy miért nem? Mi a népszerű?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: E-mail továbbítása. „A Proton Mail nyílt forráskódúnak vallja magát, de a háttérrendszerük valójában zárt forráskódú.” [Tutanota vs. Proton Mail összehasonlítás (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: E-mail továbbítása. „A Tutanota nyílt forráskódúnak vallja magát, de a háttérrendszerük valójában zárt forráskódú.” [Proton Mail vs. Tutanota összehasonlítás (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Adatvédelmi útmutatók közössége. „Azt állítja, hogy mind a Protonmail, mind a Tuta zárt forráskódú. Mert a backendjük valóban zárt forráskódú.” [E-mail továbbítása (e-mail szolgáltató) - Webhelyfejlesztés / Eszközjavaslatok](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Adatvédelmi útmutatók közössége. „A jelenleg listán szereplő PG e-mail szolgáltatók háttér-infrastruktúráiról nem történt nyilvánosan megosztott audit, és nem osztottak meg nyílt forráskódú kódrészleteket arról, hogyan dolgozzák fel a bejövő e-maileket.” [E-mail továbbítása (e-mail szolgáltató) - Webhelyfejlesztés / Eszközjavaslatok](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. „A nyílt forráskódú szoftverek piaca 41,83 milliárd USD-ről (2024) 48,92 milliárd USD-re (2025) fog növekedni, összetett...” [Mi a nyílt forráskódú szoftver?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. „Mivel a vállalatok 80%-a számolt be a nyílt forráskódú technológiák fokozott használatáról az elmúlt évben, ez...” [Feltörekvő trendek a nyílt forráskódú közösségekben 2024-ben](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)