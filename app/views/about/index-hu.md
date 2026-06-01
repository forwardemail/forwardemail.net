# A Forward Email-ről {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email csapat és cég története" class="rounded-lg" />

# A Forward Email-ről {#about-forward-email-1}


## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Alapító és Küldetés](#founder-and-mission)
* [Idővonal](#timeline)
  * [2017 - Alapítás és Indítás](#2017---founding-and-launch)
  * [2018 - Infrastruktúra és Integráció](#2018---infrastructure-and-integration)
  * [2019 - Teljesítmény Forradalom](#2019---performance-revolution)
  * [2020 - Adatvédelem és Biztonság Központúság](#2020---privacy-and-security-focus)
  * [2021 - Platform Modernizáció](#2021---platform-modernization)
  * [2023 - Infrastruktúra és Funkcióbővítés](#2023---infrastructure-and-feature-expansion)
  * [2024 - Szolgáltatás Optimalizálás és Fejlett Funkciók](#2024---service-optimization-and-advanced-features)
  * [2025 - Adatvédelmi Fejlesztések és Protokoll Támogatás {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC Megfelelés és Fejlett Szűrés {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Alapelvek](#core-principles)
* [Jelenlegi Állapot](#current-status)


## Áttekintés {#overview}

> \[!TIP]
> Műszaki részletekért az architektúránkról, biztonsági megvalósításokról és ütemtervről lásd a [Műszaki Fehér Könyvet](https://forwardemail.net/technical-whitepaper.pdf).

A Forward Email egy [ingyenes és nyílt forráskódú](https://en.wikipedia.org/wiki/Free_and_open-source "Ingyenes és nyílt forráskódú") [email továbbító](https://en.wikipedia.org/wiki/Email_forwarding "Email továbbító") szolgáltatás, amely a felhasználók [adatvédelmi jogára](https://en.wikipedia.org/wiki/Right_to_privacy "Adatvédelmi jog") fókuszál. Ami 2017-ben egy egyszerű email továbbító megoldásként indult, mára egy átfogó email platformmá fejlődött, amely korlátlan egyedi domain neveket, korlátlan email címeket és aliasokat, korlátlan egyszer használatos email címeket, spam és adathalászat elleni védelmet, titkosított postaláda tárolást és számos fejlett funkciót kínál.

A szolgáltatást az eredeti alapító tervező és fejlesztő csapat tartja fenn és birtokolja. 100%-ban nyílt forráskódú szoftverrel készült, használva a [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") és [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP") technológiákat.


## Alapító és Küldetés {#founder-and-mission}

A Forward Email-t **Nicholas Baugh** alapította 2017-ben. A [Forward Email Műszaki Fehér Könyv](https://forwardemail.net/technical-whitepaper.pdf) szerint Baugh eredetileg egy költséghatékony és egyszerű megoldást keresett, hogy emailt biztosítson domain neveken a mellékprojektjeihez. A rendelkezésre álló lehetőségek kutatása után elkezdte saját megoldását fejleszteni, és 2017. október 2-án megvásárolta a `forwardemail.net` domaint.

A Forward Email küldetése túlmutat az email szolgáltatások nyújtásán — célja, hogy átalakítsa az iparág email adatvédelemhez és biztonsághoz való hozzáállását. A cég alapértékei közé tartozik az átláthatóság, a felhasználói kontroll és az adatvédelem technikai megvalósítása, nem csupán szabályzati ígéretek által.


## Idővonal {#timeline}

### 2017 - Alapítás és Indítás {#2017---founding-and-launch}

**2017. október 2.**: Nicholas Baugh megvásárolta a `forwardemail.net` domaint, miután költséghatékony email megoldásokat keresett mellékprojektjeihez.

**2017. november 5.**: Baugh létrehozott egy 634 soros JavaScript fájlt a [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") használatával, amely bármely egyedi domain névhez továbbította az emaileket. Ezt a kezdeti megvalósítást nyílt forráskódúként publikálta a [GitHub](https://github.com/forwardemail) oldalon, és a szolgáltatást GitHub Pages segítségével indította el.
**2017 november**: A Forward Email hivatalosan is elindult az első kiadás után. A korai verzió kizárólag DNS-alapú volt, nem igényelt fiókregisztrációt vagy bejelentkezést — egyszerűen egy Markdownban írt README fájl tartalmazta az utasításokat. A felhasználók az MX rekordokat úgy állíthatták be, hogy azok a `mx1.forwardemail.net` és `mx2.forwardemail.net` címekre mutassanak, valamint hozzáadhattak egy TXT rekordot `forward-email=user@gmail.com` értékkel az e-mail továbbítás beállításához.

A megoldás egyszerűsége és hatékonysága felkeltette neves fejlesztők figyelmét, köztük [David Heinemeier Hansson](https://dhh.dk) (a Ruby on Rails alkotója) is, aki a mai napig használja a Forward Emailt a `dhh.dk` domainjén.

### 2018 - Infrastruktúra és integráció {#2018---infrastructure-and-integration}

**2018 április**: Amikor a [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") elindította [adatvédelmi szempontból elsődleges fogyasztói DNS szolgáltatását](https://blog.cloudflare.com/announcing-1111/), a Forward Email áttért az [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") helyett a [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") használatára a [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") lekérdezések kezeléséhez, ezzel is bizonyítva az adatvédelemre fókuszáló infrastruktúra választását.

**2018 október**: A Forward Email lehetővé tette a felhasználók számára, hogy "Küldjön levelet mint" a [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") és [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook") szolgáltatásokkal, bővítve az integrációs lehetőségeket a népszerű e-mail szolgáltatókkal.

### 2019 - Teljesítmény forradalom {#2019---performance-revolution}

**2019 május**: A Forward Email kiadta a v2 verziót, amely jelentős újraírást jelentett az eredeti verziókhoz képest. Ez a frissítés a [teljesítmény](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") javítására fókuszált a [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [streams](https://en.wikipedia.org/wiki/Streams "Streams") használatával, megalapozva a platform skálázhatóságát.

### 2020 - Adatvédelem és biztonság fókusz {#2020---privacy-and-security-focus}

**2020 február**: A Forward Email kiadta a Kiterjesztett Adatvédelmi Védelmi tervet, amely lehetővé tette a felhasználók számára, hogy kikapcsolják a nyilvános DNS rekordbejegyzések létrehozását az e-mail továbbítási konfigurációs aliasaikkal. Ezzel a tervvel a felhasználó e-mail alias információi rejtve maradnak a nyilvános internetes keresések elől. A cég egy olyan funkciót is kiadott, amely lehetővé teszi bizonyos aliasok engedélyezését vagy letiltását úgy, hogy azok továbbra is érvényes e-mail címekként jelenjenek meg és sikeres [SMTP státuszkódokat](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") adjanak vissza, miközben az e-mailek azonnal eldobásra kerülnek (hasonlóan a kimenet átirányításához a [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device") eszközre).

**2020 április**: Miután számos akadályba ütköztek a meglévő spamészlelő megoldásokkal, amelyek nem tartották tiszteletben a Forward Email adatvédelmi irányelveit, a cég kiadta a Spam Scanner kezdeti alfa verzióját. Ez a teljesen ingyenes és nyílt forráskódú [spamellenes szűrő](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") megoldás egy [Naive Bayes spam szűrő](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") megközelítést alkalmaz, amelyet [adathalászat elleni](https://en.wikipedia.org/wiki/Phishing "Phishing") és [IDN homográf támadás](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") védelem egészít ki. A Forward Email emellett kiadta a [kétfaktoros hitelesítést](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) [egyszer használatos jelszavakkal](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) a fokozott fiókbiztonság érdekében.

**2020 május**: A Forward Email lehetővé tette az egyedi [port továbbítást](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") mint megoldást a felhasználók számára, hogy megkerüljék az internetszolgáltatójuk ([ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")) által alkalmazott portblokkolást. A cég kiadta továbbá az ingyenes E-mail továbbító RESTful API-ját (email-api) teljes dokumentációval és valós idejű kérés-válasz példákkal, valamint webhook támogatással.
**2020 augusztus**: A Forward Email hozzáadta a támogatást az [Authenticated Received Chain](arc) ("ARC") e-mail hitelesítési rendszerhez, tovább erősítve az e-mail biztonságot és kézbesíthetőséget.

**2020. november 23.**: A Forward Email nyilvánosan elindult a béta programból, jelentős mérföldkövet jelezve a platform fejlesztésében.

### 2021 - Platform modernizáció {#2021---platform-modernization}

**2021 február**: A Forward Email átdolgozta a kódalapját, eltávolítva minden [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programozási nyelv)") függőséget, lehetővé téve, hogy a stack 100%-ban [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") és [Node.js](https://en.wikipedia.org/wiki/Node.js) legyen. Ez az architekturális döntés összhangban állt a cég elkötelezettségével a következetes, nyílt forráskódú technológiai stack fenntartása mellett.

**2021. szeptember 27.**: A Forward Email [hozzáadta a támogatást](email-forwarding-regex-pattern-filter) az e-mail továbbító aliasokhoz, hogy megfeleljenek a [reguláris kifejezéseknek](https://en.wikipedia.org/wiki/Regular_expression "Reguláris kifejezés"), fejlettebb e-mail irányítási lehetőségeket biztosítva a felhasználóknak.

### 2023 - Infrastruktúra és funkcióbővítés {#2023---infrastructure-and-feature-expansion}

**2023 január**: A Forward Email elindított egy újratervezett és oldalbetöltési sebességre optimalizált weboldalt, javítva a felhasználói élményt és a teljesítményt.

**2023 február**: A cég hozzáadta a támogatást az [hiba naplókhoz](/faq#do-you-store-error-logs) és bevezette a [sötét módot](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) a weboldalon, reagálva a felhasználói preferenciákra és az akadálymentességi igényekre.

**2023 március**: A Forward Email kiadta a [Tangerine](https://github.com/forwardemail/tangerine#readme) alkalmazást és integrálta azt az infrastruktúrába, lehetővé téve a [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") használatát az alkalmazás rétegben. A cég továbbá hozzáadta a támogatást az [MTA-STS](/faq#do-you-support-mta-sts) számára és áttért a [hCaptcha](/)-ról a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile) használatára.

**2023 április**: A Forward Email teljesen új infrastruktúrát valósított meg és automatizált. Az egész szolgáltatás globálisan terhelt és közelség-alapú DNS-en fut egészségügyi ellenőrzésekkel és failover-rel a [Cloudflare](https://cloudflare.com) segítségével, lecserélve a korábbi körbeforgó DNS megoldást. A cég áttért **bare metal szerverekre** több szolgáltatónál, beleértve a [Vultr](https://www.vultr.com/?ref=429848) és [Digital Ocean](https://m.do.co/c/a7cecd27e071) szolgáltatókat, amelyek mind SOC 2 Type 1 megfelelőséggel rendelkeznek. A MongoDB és Redis adatbázisokat klaszterezett konfigurációba helyezték elsődleges és tartalék node-okkal a magas rendelkezésre állás, végponttól végpontig tartó SSL titkosítás, adattárolási titkosítás és pont-idő szerinti helyreállítás (PITR) érdekében.

**2023 május**: A Forward Email elindította a **kimenő SMTP** funkcióját az [SMTP-vel történő e-mail küldéshez](/faq#do-you-support-sending-email-with-smtp) és az [API-n keresztüli e-mail küldéshez](/faq#do-you-support-sending-email-with-api). Ez a funkció beépített védelmi mechanizmusokat tartalmaz a magas kézbesíthetőség biztosítására, modern és robusztus sor- és újrapróbálkozási rendszerrel, valamint [valós idejű hibanapló támogatással](/faq#do-you-store-error-logs).

**2023 november**: A Forward Email elindította a [**titkosított postaláda tárolás**](/blog/docs/best-quantum-safe-encrypted-email-service) funkcióját az [IMAP támogatáshoz](/faq#do-you-support-receiving-email-with-imap), amely jelentős előrelépést jelent az e-mail magánélet és biztonság terén.

**2023 december**: A cég [hozzáadta a támogatást](/faq#do-you-support-pop3) a [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkey-ekhez és WebAuthn-hoz](/faq#do-you-support-passkeys-and-webauthn), [beérkezési idő monitorozáshoz](/faq#i) és az [OpenPGP IMAP tároláshoz](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Szolgáltatás optimalizálás és fejlett funkciók {#2024---service-optimization-and-advanced-features}

**2024 február**: A Forward Email [hozzáadta a naptár (CalDAV) támogatást](/faq#do-you-support-calendars-caldav), bővítve a platform képességeit az e-mailen túlmenően naptár szinkronizációval.
**2024 márciustól júliusig**: A Forward Email jelentős optimalizációkat és fejlesztéseket adott ki IMAP, POP3 és CalDAV szolgáltatásaihoz, azzal a céllal, hogy szolgáltatásuk legalább olyan gyors legyen, ha nem gyorsabb, mint az alternatívák.

**2024 július**: A cég [hozzáadta az iOS Push támogatást](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016), hogy kezelje az Apple Mail iOS-en az IMAP `IDLE` parancs támogatásának hiányát, lehetővé téve a valós idejű értesítéseket Apple iOS eszközök számára. A Forward Email emellett hozzáadta a beérkezett levelek idő ("TTI") monitorozását saját szolgáltatásuk és a Yahoo/AOL esetében, és elkezdte engedélyezni a felhasználóknak, hogy az egész DNS TXT rekordjukat titkosítsák még az ingyenes csomagon is. A [Privacy Guides beszélgetésekben](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) és a [GitHub issue-kban](https://github.com/forwardemail/forwardemail.net/issues/254) kért módon a cég lehetővé tette, hogy az aliasok kikapcsoláskor vagy csendben elutasítsák a `250` választ, vagy lágy elutasítást (`421`), vagy kemény elutasítást (`550`).

**2024 augusztus**: A Forward Email támogatást adott hozzá a postafiókok exportálásához [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) és [Mbox](https://en.wikipedia.org/wiki/Mbox) formátumban (a meglévő [SQLite](https://en.wikipedia.org/wiki/SQLite) export formátum mellett). [Webhook aláírás támogatás került bevezetésre](https://forwardemail.net/faq#do-you-support-bounce-webhooks), és a cég elkezdte engedélyezni a felhasználóknak, hogy hírleveleket, bejelentéseket és e-mail marketinget küldjenek ki a kimenő SMTP szolgáltatáson keresztül. Domain-szintű és alias-specifikus tárolási kvóták is bevezetésre kerültek IMAP/POP3/CalDAV szolgáltatásokhoz.

### 2025 - Adatvédelmi fejlesztések és protokoll támogatás {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**2024 szeptemberétől 2025 januárjáig**: A Forward Email [hozzáadta a nagyon várt szabadságválaszoló funkciót és OpenPGP/WKD titkosítást az e-mail továbbításhoz](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), tovább építve a már meglévő titkosított postafiók tárolási képességekre.

**2025. január 21.**: Az alapító legjobb barátja, "Jack", hűséges kutyája békésen elhunyt, közel 11 éves korában. Jack [mindig emlékezetes marad](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) rendíthetetlen társaságáért, amely támogatta a Forward Email létrejöttét. A [Forward Email Műszaki Fehér Könyv](https://forwardemail.net/technical-whitepaper.pdf) Jacknek van dedikálva, elismerve szerepét a szolgáltatás fejlesztésében.

**2025 február**: A Forward Email áttért a [DataPacket](https://www.datapacket.com) szolgáltatóra új elsődleges adatközpontként, egyedi, teljesítményközpontú, bare-metal hardvereket alkalmazva a szolgáltatás megbízhatóságának és sebességének további javítása érdekében.

**2025 március**: A Forward Email 1.0 verziója hivatalosan megjelent.

**2025 április**: Megjelent a [Forward Email Műszaki Fehér Könyv](https://forwardemail.net/technical-whitepaper.pdf) első verziója, és a cég elkezdte elfogadni a kriptovaluta fizetéseket.

**2025 május**: A szolgáltatás új API dokumentációt indított a [Scalar](https://github.com/scalar/scalar) használatával.

**2025 június**: A Forward Email elindította a [CardDAV protokoll](/faq#do-you-support-contacts-carddav) támogatását, bővítve a platform képességeit, hogy a meglévő e-mail és naptár szolgáltatások mellett a névjegyek szinkronizálását is támogassa.

**2025 augusztus**: A platform hozzáadta a [CalDAV VTODO/feladat támogatást](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), lehetővé téve a feladatkezelést a naptári események mellett.

**2025 november**: A platform biztonságát tovább növelték a jelszóhashelés PBKDF2-ről [Argon2id](https://en.wikipedia.org/wiki/Argon2) algoritmusra való áttéréssel, és az infrastruktúrát Redis-ről [Valkey](https://github.com/valkey-io/valkey) rendszerre migrálták.

**2025 december**: Megjelent a 2.0 verzió, amely bevezette a [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) támogatást a kötelező TLS titkosításhoz az e-mail átvitel során, valamint frissítette az OpenPGP.js-t a 6-os verzióra.
### 2026 - RFC megfelelés és fejlett szűrés {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**2026 január**: A Forward Email kiadott egy átfogó [RFC protokoll megfelelőségi dokumentumot](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison), és hozzáadta a támogatást az [S/MIME titkosításhoz (RFC 8551)](/faq#do-you-support-smime-encryption) valamint az átfogó [Sieve e-mail szűréshez (RFC 5228)](/faq#do-you-support-sieve-email-filtering) a [ManageSieve protokollal (RFC 5804)](/faq#do-you-support-sieve-email-filtering). A REST API-t is kibővítették 39 végponttal.

**2026 február**: Az hivatalos, nyílt forráskódú webmail kliens elindult a [mail.forwardemail.net](https://mail.forwardemail.net) címen ([forráskód a GitHubon](https://github.com/forwardemail/mail.forwardemail.net)). A platform támogatást adott a [CalDAV ütemezési kiterjesztésekhez (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA-hoz (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) és a [Domain Connecthez](https://domainconnect.org) az egykattintásos DNS beállításhoz. Valós idejű push értesítések indultak IMAP, CalDAV és CardDAV számára WebSocketek használatával.

**2026 március**: Támogatás került bevezetésre domainenként egyedi, S3-kompatibilis tárhelyhez, valamint egy parancssori eszköz a kezeléshez. Elkezdődött a többplatformos asztali és mobil alkalmazások fejlesztése macOS, Windows, Linux, iOS és Android rendszerekre ugyanazzal a nyílt forráskódú webmail kódbázissal, amelyet a [Tauri](https://tauri.app) segítségével építenek.


## Alapelvek {#core-principles}

A kezdetektől fogva a Forward Email szilárd elkötelezettséget mutatott a magánélet és biztonság elvei iránt:

**100%-ban nyílt forráskódú filozófia**: Ellentétben azokkal a versenytársakkal, akik csak a frontendjeiket teszik nyílt forráskódúvá, miközben a backend zárt marad, a Forward Email teljes kódbázisát – frontend és backend egyaránt – nyilvánosan elérhetővé tette a [GitHubon](https://github.com/forwardemail).

**Adatvédelmi szemléletű tervezés**: Már az első naptól kezdve a Forward Email egyedi memóriában történő feldolgozási megközelítést alkalmaz, amely elkerüli az e-mailek lemezre írását, megkülönböztetve ezzel a hagyományos e-mail szolgáltatóktól, amelyek üzeneteket tárolnak adatbázisokban vagy fájlrendszerekben.

**Folyamatos innováció**: A szolgáltatás egyszerű e-mail továbbító megoldásból átfogó e-mail platformmá fejlődött, olyan funkciókkal, mint a titkosított postaládák, kvantumrezisztens titkosítás, és a szabványos protokollok támogatása, beleértve az SMTP-t, IMAP-ot, POP3-at és CalDAV-t.

**Átláthatóság**: Minden kód nyílt forráskódúvá tétele és elérhetővé tétele az ellenőrzéshez, biztosítva, hogy a felhasználók ellenőrizhessék az adatvédelmi állításokat, nem csak a marketing állításokra hagyatkozzanak.

**Felhasználói kontroll**: A felhasználók számára lehetőségek biztosítása, beleértve a teljes platform önálló üzemeltetésének lehetőségét is, ha azt kívánják.


## Jelenlegi állapot {#current-status}

2026 márciusáig a Forward Email több mint 500 000 domaint szolgál ki világszerte, beleértve jelentős szervezeteket és iparági vezetőket, mint például:

* **Technológiai cégek**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Média szervezetek**: Fox News Radio, Disney Ad Sales
* **Oktatási intézmények**: Cambridge Egyetem, Maryland Egyetem, Washington Egyetem, Tufts Egyetem, Swarthmore Főiskola
* **Kormányzati szervek**: Dél-Ausztrália kormánya, Dominikai Köztársaság kormánya
* **Egyéb szervezetek**: RCD Hotels, Fly<span>.</span>io
* **Jelentős fejlesztők**: Isaac Z. Schlueter (npm alkotója), David Heinemeier Hansson (Ruby on Rails alkotója)

A platform folyamatosan fejlődik rendszeres funkciófrissítésekkel és infrastruktúra fejlesztésekkel, megőrizve pozícióját, mint az egyetlen 100%-ban nyílt forráskódú, titkosított, adatvédelmi fókuszú, átlátható és kvantumrezisztens e-mail szolgáltatás, amely ma elérhető.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
