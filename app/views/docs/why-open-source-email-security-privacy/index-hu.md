# Miért az open-source email a jövő: A Forward Email előnye {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [Az open-source előnye: Több mint marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Mit jelent a valódi open-source](#what-true-open-source-means)
  * [A backend probléma: Hol hibáznak a legtöbb "open-source" email szolgáltatások](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% open-source, frontend ÉS backend](#forward-email-100-open-source-frontend-and-backend)
  * [Egyedi technikai megközelítésünk](#our-unique-technical-approach)
* [Az önálló hosztolás lehetősége: A választás szabadsága](#the-self-hosting-option-freedom-of-choice)
  * [Miért támogatjuk az önálló hosztolást](#why-we-support-self-hosting)
  * [Az önálló hosztolás valósága az email esetében](#the-reality-of-self-hosting-email)
* [Miért éri meg fizetős szolgáltatásunk (még ha open-source is vagyunk)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Költségösszehasonlítás](#cost-comparison)
  * [A legjobb a két világban](#the-best-of-both-worlds)
* [A zárt forráskódú megtévesztés: Amit a Proton és a Tutanota nem mond el](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [A Proton Mail open-source állításai](#proton-mails-open-source-claims)
  * [A Tutanota hasonló megközelítése](#tutanotas-similar-approach)
  * [A privacy guide-ok vitája](#the-privacy-guides-debate)
* [A jövő open-source](#the-future-is-open-source)
  * [Miért nyer az open-source](#why-open-source-is-winning)
* [Áttérés a Forward Email-re](#making-the-switch-to-forward-email)
* [Összegzés: Open-source email egy privát jövőért](#conclusion-open-source-email-for-a-private-future)


## Előszó {#foreword}

Egy olyan korban, amikor a digitális adatvédelem iránti aggodalmak soha nem látott magasságokban vannak, az általunk választott email szolgáltatások jelentősége soha nem volt nagyobb. Míg sok szolgáltató azt állítja, hogy prioritásként kezeli az adatvédelmet, alapvető különbség van azok között, akik csak beszélnek róla, és azok között, akik valóban meg is teszik. A Forward Email-nél szolgáltatásunkat teljes átláthatóságra építettük az open-source fejlesztés révén – nem csak a frontend alkalmazásainkban, hanem az egész infrastruktúránkban.

Ez a blogbejegyzés azt vizsgálja, hogy miért jobbak az open-source email megoldások a zárt forráskódú alternatíváknál, hogyan különbözik megközelítésünk a Proton Mail és a Tutanota versenytársaktól, és miért kínál fizetős szolgáltatásunk a legtöbb felhasználó számára jobb értéket annak ellenére, hogy támogatjuk az önálló hosztolási lehetőségeket.


## Az open-source előnye: Több mint marketing {#the-open-source-advantage-more-than-just-marketing}

Az "open-source" kifejezés az utóbbi években népszerű marketing szlogenné vált, a globális open-source szolgáltatások piaca pedig várhatóan évi több mint 16%-os CAGR-rel növekszik 2024 és 2032 között\[^1]. De mit jelent valójában a valódi open-source, és miért fontos ez az email adatvédelem szempontjából?

### Mit jelent a valódi open-source {#what-true-open-source-means}

Az open-source szoftverek teljes forráskódjukat szabadon elérhetővé teszik bárki számára, hogy megvizsgálhassa, módosíthassa és fejleszthesse azt. Ez az átláthatóság olyan környezetet teremt, ahol:

* A biztonsági sebezhetőségek globális fejlesztői közösség által azonosíthatók és javíthatók
* Az adatvédelmi állítások független kódellenőrzéssel igazolhatók
* A felhasználók nem ragadnak be zárt ökoszisztémákba
* Az innováció gyorsabban történik együttműködés révén

Az email esetében – amely az online identitásod alapja – ez az átláthatóság nem csak előny, hanem elengedhetetlen a valódi adatvédelem és biztonság érdekében.

### A backend probléma: Hol hibáznak a legtöbb "open-source" email szolgáltatások {#the-backend-problem-where-most-open-source-email-services-fall-short}

Itt válik érdekessé a dolog. Sok népszerű "adatvédelem-központú" email szolgáltató open-source-ként hirdeti magát, de van egy kritikus különbség, amit remélhetőleg nem veszel észre: **csak a frontendjeiket teszik nyilvánossá, miközben a backendjük zárt marad**.
Mit jelent ez? A frontend az, amit látsz és amivel interakcióba lépsz—a webes felület vagy mobilalkalmazás. A backend az, ahol a tényleges e-mail feldolgozás történik—ahol az üzeneteid tárolódnak, titkosítva vannak és továbbítódnak. Amikor egy szolgáltató a backendjét zárt forráskódúként tartja:

1. Nem tudod ellenőrizni, hogyan dolgozzák fel valójában az e-mailjeidet
2. Nem tudod megerősíteni, hogy a magánéletre vonatkozó állításaik jogosak-e
3. Marketing állításokban bízol a helyett, hogy ellenőrizhető kódot látnál
4. A biztonsági sebezhetőségek rejtve maradhatnak a nyilvános vizsgálat elől

Ahogy a Privacy Guides fórumain folytatott viták is kiemelték, mind a Proton Mail, mind a Tutanota azt állítja, hogy nyílt forráskódú, de a backendjük zárt és tulajdonosi marad\[^2]. Ez jelentős bizalmi rést teremt—arra kérnek, hogy higgy a magánéletre vonatkozó ígéreteikben anélkül, hogy ellenőrizni tudnád azokat.


## Forward Email: 100% Nyílt Forráskódú, Frontend ÉS Backend {#forward-email-100-open-source-frontend-and-backend}

A Forward Emailnél alapvetően más megközelítést alkalmazunk. Az egész kódalapunk—frontend és backend egyaránt—nyílt forráskódú, és bárki számára elérhető megtekintésre a <https://github.com/forwardemail/forwardemail.net> címen.

Ez azt jelenti:

1. **Teljes Átláthatóság**: Minden egyes kódsor, amely az e-mailjeidet feldolgozza, nyilvános vizsgálatra elérhető.
2. **Ellenőrizhető Magánélet**: A magánéletre vonatkozó állításaink nem marketing szövegek—ellenőrizhető tények, amelyeket bárki megerősíthet a kódunk vizsgálatával.
3. **Közösség-vezérelt Biztonság**: Biztonságunkat a globális fejlesztői közösség kollektív szakértelme erősíti.
4. **Nincs Rejtett Funkcionalitás**: Amit látsz, azt kapod—nincs rejtett követés, nincs titkos hátsó ajtó.

### Egyedi Technikai Megközelítésünk {#our-unique-technical-approach}

A magánélet iránti elkötelezettségünk túlmutat a nyílt forráskódúságon. Számos technikai újítást vezettünk be, amelyek megkülönböztetnek minket:

#### Egyedileg Titkosított SQLite Postafiókok {#individually-encrypted-sqlite-mailboxes}

A hagyományos e-mail szolgáltatókkal ellentétben, amelyek megosztott relációs adatbázisokat használnak (ahol egyetlen biztonsági rés az összes felhasználó adatát veszélyeztetheti), mi egyedileg titkosított SQLite fájlokat használunk minden egyes postafiókhoz. Ez azt jelenti:

* Minden postafiók külön titkosított fájl
* Egy felhasználó adatainak elérése nem biztosít hozzáférést másokéhoz
* Még a saját munkatársaink sem férhetnek hozzá az adataidhoz—ez egy alapvető tervezési döntés

Ahogy a Privacy Guides vitákban is elmagyaráztuk:

> "A megosztott relációs adatbázisok (pl. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL stb.) mindegyike bejelentkezést igényel (felhasználónév/jelszó) az adatbázis-kapcsolat létrehozásához. Ez azt jelenti, hogy bárki, akinek megvan ez a jelszó, lekérdezheti az adatbázist bármire. Legyen az egy rosszindulatú alkalmazott vagy egy rosszakaró takarítónő támadása. Ez azt is jelenti, hogy ha hozzáférsz egy felhasználó adataihoz, akkor hozzáférsz mindenki másához is. Másrészt az SQLite megosztott adatbázisként tekinthető, de ahogyan használjuk (minden postafiók = egyedi SQLite fájl), az sandboxolt."\[^3]

#### Kvantumálló Titkosítás {#quantum-resistant-encryption}

Míg más szolgáltatók még csak most kezdenek lépést tartani, mi már bevezettük a kvantumálló titkosítási módszereket, hogy az e-mail magánéletedet megvédjük a kvantumszámítástechnika feltörekvő fenyegetéseivel szemben.

#### Harmadik Fél Függőségek Nélkül {#no-third-party-dependencies}

Ellentétben a versenytársakkal, akik olyan szolgáltatásokra támaszkodnak, mint az Amazon SES az e-mailek kézbesítéséhez, mi az egész infrastruktúránkat házon belül építettük fel. Ez kiküszöböli a harmadik fél szolgáltatásokon keresztüli esetleges adatvédelmi szivárgásokat, és teljes irányítást ad az egész e-mail folyamat felett.


## Az Önhostolás Lehetősége: A Választás Szabadsága {#the-self-hosting-option-freedom-of-choice}

A nyílt forráskódú szoftver egyik legerősebb aspektusa a szabadság, amit nyújt. A Forward Email-lel soha nem vagy bezárva—ha akarod, önhostolhatod az egész platformunkat.

### Miért Támogatjuk az Önhostolást {#why-we-support-self-hosting}

Hisszük, hogy a felhasználóknak teljes irányítást kell adni az adataik felett. Ezért tettük lehetővé, hogy az egész platformunk önhostolható legyen átfogó dokumentációval és telepítési útmutatókkal. Ez a megközelítés:

* Maximális kontrollt biztosít a technikailag jártas felhasználóknak
* Megszünteti a szolgáltatóba vetett bizalom szükségességét
* Lehetővé teszi a testreszabást speciális igényekhez
* Biztosítja a szolgáltatás folytatását akkor is, ha a cégünk nem folytatná tovább
### Az e-mail önálló üzemeltetésének valósága {#the-reality-of-self-hosting-email}

Bár az önálló üzemeltetés erőteljes lehetőség, fontos megérteni a valódi költségeket:

#### Pénzügyi költségek {#financial-costs}

* VPS vagy szerverköltségek: 5-50 USD/hó egy alap beállításhoz\[^4]
* Domain regisztráció és megújítás: 10-20 USD/év
* SSL tanúsítványok (bár a Let's Encrypt ingyenes lehetőségeket kínál)
* Esetleges költségek a felügyeleti szolgáltatásokért és biztonsági mentési megoldásokért

#### Időköltségek {#time-costs}

* Kezdeti beállítás: néhány órától napokig terjed, a technikai tudástól függően
* Folyamatos karbantartás: 5-10 óra/hó frissítésekre, biztonsági javításokra és hibakeresésre\[^5]
* Tanulási görbe: az e-mail protokollok, biztonsági legjobb gyakorlatok és szerveradminisztráció megértése

#### Műszaki kihívások {#technical-challenges}

* E-mail kézbesítési problémák (üzenetek spamként való jelölése)
* A folyamatosan változó biztonsági szabványok követése
* Magas rendelkezésre állás és megbízhatóság biztosítása
* A spam szűrés hatékony kezelése

Ahogy egy tapasztalt önálló üzemeltető fogalmazott: „Az e-mail egy árucikk szolgáltatás... Olcsóbb a leveleimet egy [szolgáltatónál] tárolni, mint pénzt *és* időt költeni az önálló üzemeltetésre."\[^6]


## Miért éri meg a fizetős szolgáltatásunk (még ha nyílt forráskódú is) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Az önálló üzemeltetés kihívásait figyelembe véve, fizetős szolgáltatásunk a legjobb mindkét világból kínálja: a nyílt forráskód átláthatóságát és biztonságát a kezelt szolgáltatás kényelmével és megbízhatóságával.

### Költségösszehasonlítás {#cost-comparison}

Ha figyelembe vesszük a pénzügyi és időbeli költségeket is, fizetős szolgáltatásunk kivételes értéket kínál:

* **Önálló üzemeltetés teljes költsége**: 56-252 USD/hó (beleértve a szerverköltségeket és az idő értékelését)
* **Forward Email fizetős csomagok**: 3-9 USD/hó

Fizetős szolgáltatásunk biztosítja:

* Professzionális menedzsment és karbantartás
* Megalapozott IP-hírnév a jobb kézbesíthetőségért
* Rendszeres biztonsági frissítések és felügyelet
* Támogatás problémák esetén
* Minden adatvédelmi előny a nyílt forráskódú megközelítésünkből

### A legjobb mindkét világból {#the-best-of-both-worlds}

A Forward Email választásával Ön kapja:

1. **Ellenőrizhető adatvédelem**: Nyílt forráskódú kódalapunk miatt megbízhat adatvédelmi állításainkban
2. **Professzionális menedzsment**: Nem kell e-mail szerver szakértővé válnia
3. **Költséghatékonyság**: Alacsonyabb teljes költség, mint az önálló üzemeltetés
4. **Függetlenség a bezártságtól**: Mindig elérhető az önálló üzemeltetés lehetősége


## A zárt forráskódú megtévesztés: Amit a Proton és a Tutanota nem mond el Önnek {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Nézzük meg közelebbről, hogyan különbözik megközelítésünk a népszerű „adatvédelem-központú” e-mail szolgáltatóktól.

### A Proton Mail nyílt forráskódú állításai {#proton-mails-open-source-claims}

A Proton Mail nyílt forráskódúnak hirdeti magát, de ez csak a frontend alkalmazásokra vonatkozik. A backendjük — ahol az e-mailjeit ténylegesen feldolgozzák és tárolják — zárt forráskódú marad\[^7]. Ez azt jelenti:

* Nem ellenőrizheti, hogyan kezelik az e-mailjeit
* Bizalmat kell szavaznia adatvédelmi állításaiknak ellenőrzés nélkül
* A backend biztonsági sebezhetőségei rejtve maradnak a nyilvános vizsgálat elől
* Be van zárva az ökoszisztémájukba, önálló üzemeltetési lehetőség nélkül

### A Tutanota hasonló megközelítése {#tutanotas-similar-approach}

A Proton Mailhez hasonlóan a Tutanota csak a frontendjét teszi nyílt forráskódúvá, miközben a backendje zárt forráskódú marad\[^8]. Ugyanazokkal a bizalmi problémákkal néznek szembe:

* Nincs mód a backend adatvédelmi állításainak ellenőrzésére
* Korlátozott átláthatóság a tényleges e-mail feldolgozásban
* Potenciális biztonsági problémák rejtve a nyilvánosság elől
* Szállítói bezártság önálló üzemeltetési lehetőség nélkül

### Az adatvédelmi útmutatók vitája {#the-privacy-guides-debate}

Ezeket a korlátokat az adatvédelmi közösség sem hagyta figyelmen kívül. A Privacy Guides vitáiban kiemeltük ezt a kritikus különbséget:

> „Azt állítja, hogy mind a Protonmail, mind a Tuta zárt forráskódú. Mert a backendjük valóban zárt forráskódú."\[^9]

Ezenkívül kijelentettük:

> „Eddig nem volt nyilvánosan megosztott audit egyetlen jelenleg listázott PG e-mail szolgáltató backend infrastruktúrájáról sem, és nem osztottak meg nyílt forráskódú kódrészleteket arról, hogyan dolgozzák fel a bejövő e-maileket."\[^10]
Ez az átláthatóság hiánya alapvető bizalmi problémát teremt. Nyílt forráskódú háttérrendszerek nélkül a felhasználóknak hit alapján kell elfogadniuk a magánéletre vonatkozó állításokat, nem pedig ellenőrzés alapján.


## A jövő nyílt forráskódú {#the-future-is-open-source}

A nyílt forráskódú megoldások iránti trend felgyorsul a szoftveriparban. A legfrissebb kutatások szerint:

* A nyílt forráskódú szoftverpiac 2024-ben 41,83 milliárd dollárról 2025-re 48,92 milliárd dollárra nő\[^11]
* A vállalatok 80%-a számolt be a nyílt forráskódú használat növekedéséről az elmúlt évben\[^12]
* A nyílt forráskódú megoldások elfogadottsága várhatóan tovább gyorsul

Ez a növekedés alapvető változást tükröz abban, ahogyan a szoftverbiztonságról és a magánéletről gondolkodunk. Ahogy a felhasználók egyre tudatosabbak a magánélet védelmében, a nyílt forráskódú megoldások által nyújtott ellenőrizhető adatvédelem iránti igény csak nőni fog.

### Miért nyer a nyílt forráskód {#why-open-source-is-winning}

A nyílt forráskód előnyei egyre világosabbá válnak:

1. **Biztonság átláthatóságon keresztül**: A nyílt forráskódot több ezer szakértő is átnézheti, nem csak egy belső csapat
2. **Gyorsabb innováció**: Az együttműködéses fejlesztés felgyorsítja a fejlődést
3. **Bizalom ellenőrzés által**: Az állítások ellenőrizhetők, nem csak hit alapján fogadandók el
4. **Függetlenség a szolgáltatóktól**: A felhasználók megtartják az irányítást adataik és szolgáltatásaik felett
5. **Közösségi támogatás**: Egy globális közösség segít azonosítani és javítani a problémákat


## Áttérés a Forward Email-re {#making-the-switch-to-forward-email}

A Forward Email-re való áttérés egyszerű, akár egy mainstream szolgáltatótól, mint a Gmail, akár egy másik adatvédelmi fókuszú szolgáltatótól, mint a Proton Mail vagy a Tutanota érkezel.

Szolgáltatásunk kínálja:

* Korlátlan domainek és aliasok
* Szabványos protokoll támogatás (SMTP, IMAP, POP3) saját fejlesztésű hidak nélkül
* Zökkenőmentes integráció meglévő e-mail kliensekkel
* Egyszerű beállítási folyamat átfogó dokumentációval
* Megfizethető árképzési csomagok már havi 3 dollártól


## Összegzés: Nyílt forráskódú e-mail a privát jövőért {#conclusion-open-source-email-for-a-private-future}

Egy olyan világban, ahol a digitális magánélet egyre inkább veszélyben van, a nyílt forráskódú megoldások átláthatósága létfontosságú védelmet nyújt. A Forward Email-nél büszkék vagyunk arra, hogy teljesen nyílt forráskódú megközelítésünkkel vezetjük az e-mail adatvédelem jövőjét.

Ellentétben a versenytársakkal, akik csak részben alkalmazzák a nyílt forráskódot, mi az egész platformunkat – frontend és backend egyaránt – nyilvános vizsgálatra bocsátottuk. Ez az átláthatóság iránti elkötelezettség, valamint innovatív technikai megközelítésünk olyan ellenőrizhető adatvédelmi szintet biztosít, amelyet a zárt forráskódú alternatívák egyszerűen nem tudnak nyújtani.

Akár a kezelt szolgáltatásunkat választod, akár önállóan hosztolod platformunkat, a valóban nyílt forráskódú e-mailből származó biztonság, adatvédelem és nyugalom előnyeit élvezheted.

Az e-mail jövője nyílt, átlátható és adatvédelmi fókuszú. A jövő a Forward Email.

\[^1]: SNS Insider. "A nyílt forráskódú szolgáltatások piaca 2023-ban 28,6 milliárd USD értékű volt, és 2032-re eléri a 114,8 milliárd USD-t, 16,70%-os CAGR-rel 2032-ig." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Általában havi 5 és 50 dollár között várható egy alapvető virtuális privát szerver (VPS) költsége az e-mail szerver futtatásához." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "A karbantartás talán 16 órát vett igénybe ebben az időszakban..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "Röviden: Mint minden önállóan hosztolt dolog, EZ IDŐT IGÉNYEL. Ha nincs időd rá, mindig jobb egy hosztolt megoldás mellett maradni..." [Önállóan hosztolt e-mail szerver? Miért vagy miért nem? Mi a népszerű?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "A Proton Mail azt állítja, hogy nyílt forráskódú, de a háttérrendszerük valójában zárt forráskódú." [Tutanota vs Proton Mail összehasonlítás (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "A Tutanota azt állítja, hogy nyílt forráskódú, de a háttérrendszerük valójában zárt forráskódú." [Proton Mail vs Tutanota összehasonlítás (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Azt állítják, hogy mind a Protonmail, mind a Tuta zárt forráskódú. Mert a háttérrendszerük valóban zárt forráskódú." [Forward Email (e-mail szolgáltató) - Webhelyfejlesztés / Eszközjavaslatok](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Eddig egyetlen nyilvánosan megosztott audit sem készült a jelenleg listázott PG e-mail szolgáltatók háttérrendszereiről, sem nyílt forráskódú kódrészletek nem kerültek megosztásra arról, hogyan dolgozzák fel a bejövő e-maileket." [Forward Email (e-mail szolgáltató) - Webhelyfejlesztés / Eszközjavaslatok](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "A nyílt forráskódú szoftverek piaca 2024-ben 41,83 milliárd USD-ről 2025-re 48,92 milliárd USD-re fog nőni összetett..." [Mi az a nyílt forráskódú szoftver?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "A vállalatok 80%-a számolt be arról, hogy az elmúlt évben nőtt a nyílt forráskódú technológiák használata, így..." [Feltörekvő trendek a nyílt forráskódú közösségekben 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
