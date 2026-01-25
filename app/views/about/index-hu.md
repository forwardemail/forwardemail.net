# Az e-mail továbbításáról {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="lekerekített-lg" />

# Az e-mail továbbításáról {#about-forward-email-1}

## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Alapító és küldetés](#founder-and-mission)
* [Idővonal](#timeline)
  * [2017 - Alapítás és indulás](#2017---founding-and-launch)
  * [2018 – Infrastruktúra és integráció](#2018---infrastructure-and-integration)
  * [2019 - Teljesítményforradalom](#2019---performance-revolution)
  * [2020 – Adatvédelem és biztonság fókuszban](#2020---privacy-and-security-focus)
  * [2021 – Platformmodernizáció](#2021---platform-modernization)
  * [2023 – Infrastruktúra és funkcióbővítés](#2023---infrastructure-and-feature-expansion)
  * [2024 – Szolgáltatásoptimalizálás és fejlett funkciók](#2024---service-optimization-and-advanced-features)
  * [2025 - Folyamatos innováció](#2025---continued-innovation)
* [Alapelvek](#core-principles)
* [Jelenlegi állapot](#current-status)

## Áttekintés {#overview}

> \[!TIP]
> Az architektúránkkal, biztonsági megvalósításainkkal és ütemtervünkkel kapcsolatos technikai részletekért lásd a [Műszaki tanulmány](https://forwardemail.net/technical-whitepaper.pdf) dokumentumot.

A Forward Email egy [ingyenes és nyílt forráskódú](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [e-mail továbbítás](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") szolgáltatás, amely a felhasználók [a magánélethez való jog](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") fiókjára összpontosít. Ami 2017-ben egy egyszerű e-mail-továbbítási megoldásként indult, mára egy átfogó e-mail platformmá fejlődött, amely korlátlan számú egyéni domainnevet, korlátlan számú e-mail-címet és aliast, korlátlan számú eldobható e-mail-címet, spam- és adathalászat elleni védelmet, titkosított postaláda-tárhelyet és számos fejlett funkciót kínál.

A szolgáltatást az eredeti alapító tervezőkből és fejlesztőkből álló csapat tartja karban és birtokolja. 100%-ban nyílt forráskódú szoftverekkel készült, [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") és [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP") használatával.

## Alapító és küldetés {#founder-and-mission}

A Forward Emailt **Nicholas Baugh** alapította 2017-ben. A [E-mail továbbítása – technikai tanulmány](https://forwardemail.net/technical-whitepaper.pdf) szerint Baugh kezdetben egy költséghatékony és egyszerű megoldást keresett az e-mailek engedélyezésére a mellékprojektjeiben használt domainneveken. Miután megvizsgálta a rendelkezésre álló lehetőségeket, elkezdte fejleszteni a saját megoldását, és 2017. október 2-án megvásárolta a `forwardemail.net` domaint.

A Forward Email küldetése túlmutat az e-mail szolgáltatások nyújtásán – célja, hogy átalakítsa az iparág e-mail adatvédelméhez és biztonságához való hozzáállását. A vállalat alapvető értékei közé tartozik az átláthatóság, a felhasználói ellenőrzés és az adatvédelem a technikai megvalósításon keresztül, nem pedig pusztán a szabályzati ígéretek révén.

## Idővonal {#timeline}

### 2017 - Alapítás és indulás {#2017---founding-and-launch}

**2017. október 2.**: Nicholas Baugh megvásárolta a `forwardemail.net` domaint, miután költséghatékony e-mail megoldásokat keresett mellékprojektjeihez.

**2017. november 5.**: Baugh létrehozott egy 634 soros JavaScript fájlt a [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") használatával, hogy e-maileket továbbítson bármilyen egyéni domainnévhez. Ez a kezdeti implementáció nyílt forráskódúként jelent meg a [GitHub](https://github.com/forwardemail) számára, a szolgáltatást pedig a GitHub Pages segítségével indították el.

**2017. november**: A Forward Email hivatalosan is elindult a kezdeti kiadás után. A korai verzió tisztán DNS-alapú volt, fiókregisztráció vagy regisztráció nélkül – egyszerűen egy Markdown nyelven írt README fájllal és utasításokkal. A felhasználók az e-mail-továbbítást úgy állíthatták be, hogy az MX rekordokat a `mx1.forwardemail.net` és a `mx2.forwardemail.net` rekordokra konfigurálták, és hozzáadtak egy TXT rekordot a `forward-email=user@gmail.com` rekorddal.

A megoldás egyszerűsége és hatékonysága felkeltette a kiemelkedő fejlesztők figyelmét, köztük [David Heinemeier Hansson](https://dhh.dk) (a Ruby on Rails megalkotója), aki a mai napig használja a Forward Email funkciót a `dhh.dk` domainjén.

### 2018 – Infrastruktúra és integráció {#2018---infrastructure-and-integration}

**2018. április**: Amikor a [Felhőlobbanás](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") elindította a [adatvédelmet elsődleges fogyasztói DNS-szolgáltatás](https://blog.cloudflare.com/announcing-1111/) szolgáltatását, a Forward Email szolgáltatás a [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") szolgáltatásról a [Felhőlobbanás](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") szolgáltatásra váltott a [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") keresések kezelésére, ezzel is bizonyítva a vállalat elkötelezettségét az adatvédelmet szemléltető infrastrukturális döntések iránt.

**2018. október**: Az E-mail továbbítása funkció lehetővé tette a felhasználók számára a „Küldés másként” funkciót a [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") és a [Kilátások](https://en.wikipedia.org/wiki/Outlook "Outlook") paraméterekkel, bővítve ezzel az integrációs lehetőségeket a népszerű e-mail-szolgáltatókkal.

### 2019 – Teljesítményforradalom {#2019---performance-revolution}

**2019. május**: Kiadták a Forward Email 2. verzióját, amely jelentős átdolgozást jelentett a kezdeti verziókhoz képest. Ez a frissítés a [teljesítmény](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") fejlesztéseire összpontosított a [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [patakok](https://en.wikipedia.org/wiki/Streams "Streams") verziójának felhasználásával, lerakva a platform skálázhatóságának alapjait.

### 2020 – Adatvédelem és biztonság – fókuszban {#2020---privacy-and-security-focus}

**2020. február**: A Forward Email kiadta a továbbfejlesztett adatvédelmi csomagot, amely lehetővé teszi a felhasználók számára, hogy kikapcsolják a nyilvános DNS-rekordok beállítását az e-mail-továbbítási konfigurációs aliasaikkal. Ezzel a csomaggal a felhasználó e-mail-alias-adatai rejtve maradnak, így azok nyilvánosan nem kereshetők az interneten. A vállalat kiadott egy funkciót is, amellyel engedélyezhetők vagy letilthatók bizonyos aliasok, miközben továbbra is érvényes e-mail-címként jelennek meg, és sikeres [SMTP állapotkódok](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") értéket adnak vissza, az e-maileket pedig azonnal törlik (hasonlóan a kimenet [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device") értékre történő továbbításához).

**2020. április**: Miután számtalan akadályba ütközött a Forward Email adatvédelmi irányelveit semmibe vevő spamészlelő megoldásaival, a vállalat kiadta a Spam Scanner kezdeti alfa verzióját. Ez a teljesen ingyenes és nyílt forráskódú [spam szűrés](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") megoldás a [Naiv Bayes spamszűrő](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") megközelítést használja a [adathalászat elleni védelem](https://en.wikipedia.org/wiki/Phishing "Phishing") és [IDN homográf támadás](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") védelemmel kombinálva. A Forward Email kiadta a [kétfaktoros hitelesítés](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) megoldást is, amely a [egyszer használatos jelszavak](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) védelmet használja a fokozott fiókbiztonság érdekében.

**2020. május**: Az e-mail továbbítása lehetővé tette a felhasználók számára az egyéni [porttovábbítás](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") használatát megkerülő megoldásként a [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") általi portblokkolás megkerülésére. A vállalat kiadta a [Ingyenes e-mail továbbító RESTful API](email-api)-t is teljes dokumentációval és valós idejű kérés- és válaszpéldákkal, valamint a webhookok támogatásával.

**2020. augusztus**: A Forward Email funkció támogatást adott a [Hitelesített fogadott lánc](arc) („ARC”) e-mail-hitelesítési rendszerhez, tovább erősítve az e-mailek biztonságát és kézbesíthetőségét.

**2020. november 23.**: A Forward Email nyilvánosan elindult a béta programjából, ami jelentős mérföldkő a platform fejlesztésében.

### 2021 – Platformmodernizáció {#2021---platform-modernization}

**2021. február**: A Forward Email átdolgozta a kódbázisát, eltávolítva az összes [Piton](https://en.wikipedia.org/wiki/Python_\(programming_language\) („Python (programozási nyelv)”) függőséget, így a stackjük 100%-ban [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") és [Node.js](https://en.wikipedia.org/wiki/Node.js) függőséggé vált. Ez az architektúrális döntés összhangban volt a vállalat azon elkötelezettségével, hogy egy következetes, nyílt forráskódú technológiai stacket tartsanak fenn.

**2021. szeptember 27.**: A [hozzáadott támogatás](email-forwarding-regex-pattern-filter) e-mail cím továbbítása az e-mail-továbbítási aliasokhoz a [reguláris kifejezések](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") e-mail címmel megegyező címre, kifinomultabb e-mail-útválasztási lehetőségeket biztosítva a felhasználók számára.

### 2023 – Infrastruktúra és funkciók bővítése {#2023---infrastructure-and-feature-expansion}

**2023. január**: A Forward Email elindított egy újratervezett és a lapbetöltési sebességre optimalizált weboldalt, amely javítja a felhasználói élményt és a teljesítményt.

**2023. február**: A vállalat támogatást adott a [hibanaplók](/faq#do-you-store-error-logs) színsémához, és bevezette a [sötét mód](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) weboldal színsémáját, amely megfelel a felhasználói preferenciáknak és az akadálymentesítési igényeknek.

**2023. március**: A Forward Email kiadta a [Mandarin](https://github.com/forwardemail/tangerine#readme)-t, és integrálta azt az infrastruktúrájába, lehetővé téve a [DNS HTTPS-en keresztül](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH”) használatát az alkalmazásrétegen. A vállalat emellett támogatást adott a [MTA-STS](/faq#do-you-support-mta-sts)-höz, és a [hCaptcha](/)-ról a [Cloudflare forgókapu](https://developers.cloudflare.com/turnstile)-re váltott.

**2023. április**: A Forward Email teljesen új infrastruktúrát vezetett be és automatizált. A teljes szolgáltatás globálisan elosztott terhelésű és közelségalapú DNS-en kezdett futni, állapotellenőrzésekkel és feladatátvétellel a [Felhőlobbanás](https://cloudflare.com) használatával, amely felváltotta a korábbi körforgásos DNS-megközelítést. A vállalat **csupasz fém szerverekre** váltott több szolgáltatónál, beleértve a [Vultr](https://www.vultr.com/?ref=429848)-et és a [Digitális óceán](https://m.do.co/c/a7cecd27e071)-t is, amelyek mindkettő SOC 2 Type 1-kompatibilis szolgáltató. A MongoDB és Redis adatbázisokat fürtözött konfigurációkba helyezték át elsődleges és készenléti csomópontokkal a magas rendelkezésre állás, a végpontok közötti SSL-titkosítás, a nyugalmi állapotban lévő titkosítás és az időponthoz igazodó helyreállítás (PITR) érdekében.

**2023. május**: A Forward Email elindította a **kimenő SMTP** funkcióját a [e-mail küldése SMTP-vel](/faq#do-you-support-sending-email-with-smtp) és [e-mail küldése API-val](/faq#do-you-support-sending-email-with-api) kérésekhez. Ez a funkció beépített védelmet tartalmaz a magas kézbesítési hatékonyság biztosítása érdekében, modern és robusztus várakozási sor- és újrapróbálkozási rendszert, valamint a [támogatja a valós idejű hibanaplózást](/faq#do-you-store-error-logs) szolgáltatást.

**2023. november**: A Forward Email elindította a [**titkosított postaláda-tárhely**](/blog/docs/best-quantum-safe-encrypted-email-service) funkcióját a [IMAP-támogatás](/faq#do-you-support-receiving-email-with-imap) fiókhoz, ami jelentős előrelépést jelent az e-mailek adatvédelme és biztonsága terén.

**2023. december**: A [hozzáadott támogatás](/faq#do-you-support-pop3) vállalat a [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [jelszók és WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [beérkezési idő](/faq#i) monitorozására és a [OpenPGP IMAP-tároláshoz](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)-re vonatkozóan.

### 2024 – Szolgáltatásoptimalizálás és speciális funkciók {#2024---service-optimization-and-advanced-features}

**2024. február**: E-mail továbbítása [naptár (CalDAV) támogatás hozzáadva](/faq#do-you-support-calendars-caldav), a platform képességeinek kiterjesztése az e-mailen túlra, a naptár szinkronizálásával.

**2024. március–július**: A Forward Email jelentős optimalizálásokat és fejlesztéseket tett közzé IMAP, POP3 és CalDAV szolgáltatásaiban, azzal a céllal, hogy szolgáltatásukat a lehető leggyorsabbá, ha nem gyorsabbá tegyék az alternatíváknál.

**2024. július**: A [iOS Push támogatás hozzáadva](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) vállalat orvosolni kívánja az Apple Mail on iOS IMAP `IDLE` parancstámogatásának hiányát, lehetővé téve a valós idejű értesítéseket az Apple iOS eszközökön. A Forward Email emellett időt adott a beérkező levelek („TTI”) figyelésére saját szolgáltatásában és a Yahoo/AOL-ban, és lehetővé teszi a felhasználók számára, hogy titkosítsák teljes DNS TXT rekordjukat még az ingyenes csomagban is. A [Adatvédelmi útmutatók megbeszélései](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) és [GitHub-problémák](https://github.com/forwardemail/forwardemail.net/issues/254) kéréseinek megfelelően a vállalat lehetővé tette az aliasok számára, hogy letiltás esetén csendben elutasítsák a `250` parancsot, lágyan elutasítsák a `421` parancsot, vagy véglegesen elutasítsák a `550` parancsot.

**2024. augusztus**: A Forward Email funkció támogatta a postafiókok [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) és [Mbox](https://en.wikipedia.org/wiki/Mbox) formátumban történő exportálását (a meglévő [SQLite](https://en.wikipedia.org/wiki/SQLite) exportformátum mellett). A [Webhook aláírás támogatás hozzáadva](https://forwardemail.net/faq#do-you-support-bounce-webhooks) formátumot is bevezette, és a vállalat elkezdte engedélyezni a felhasználóknak hírlevelek, bejelentések és e-mail marketingüzenetek küldését a kimenő SMTP-szolgáltatásukon keresztül. Domainszintű és alias-specifikus tárolási kvótákat is bevezettek az IMAP/POP3/CalDAV protokollokhoz.

### 2025 - Folyamatos innováció {#2025---continued-innovation}

**2024. szeptember – 2025. január**: E-mail továbbítása [hozzáadott egy nagyon kért vakációs válasz funkciót és OpenPGP/WKD titkosítást az e-mail továbbításhoz](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) címre, a már megvalósított titkosított postaláda-tárolási képességeikre építve.

**2025. január 21.**: Az alapító legjobb barátja, „Jack”, hűséges kutyatársa, közel 11 éves korában békésen elhunyt. Jack [mindig emlékezni fogunk rá](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) köszönet a Forward Email létrehozását támogató rendíthetetlen társaságáért. Az IDEIGLEN KITÜNTETETT KITÜNTETŐ_1 Jack emlékére készült, elismerve a szolgáltatás fejlesztésében játszott szerepét.

**2025. február**: A Forward Email a [Adatcsomag](https://www.datapacket.com)-ra váltott új elsődleges adatközpont-szolgáltatóként, és egyedi, teljesítményorientált, bare metal hardvereket vezetett be a szolgáltatás megbízhatóságának és sebességének további növelése érdekében.

**2025. június**: A Forward Email elindította a [CardDAV protokoll](/faq#do-you-support-contacts-carddav) támogatását, kibővítve a platform képességeit a meglévő e-mail- és naptárszolgáltatások mellett a névjegyek szinkronizálásával is.

### 2026 - RFC-megfelelőség és fejlett szűrés {#2026---rfc-compliance-and-advanced-filtering}

**2026. január**: A Forward Email kiadott egy átfogó [RFC protokoll megfelelőségi dokumentumot](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison), amely részletezi a teljes szabványtámogatást az SMTP, IMAP, POP3 és CalDAV terén. A platform hozzáadta a [REQUIRETLS támogatást (RFC 8689)](/faq#requiretls-support) a kényszerített TLS titkosításhoz az e-mail átvitelben, [S/MIME titkosítást (RFC 8551)](/faq#do-you-support-smime-encryption) a biztonságos üzenet aláíráshoz és titkosításhoz, valamint átfogó [Sieve e-mail szűrést (RFC 5228)](/faq#do-you-support-sieve-email-filtering) [ManageSieve protokoll (RFC 5804)](/faq#do-you-support-sieve-email-filtering) támogatással a szerveroldali e-mail szűréshez. A [REST API](/email-api) kibővült 39 végpontra, amelyek lefedik az üzeneteket, mappákat, névjegyeket, naptárakat és naptáreseményeket.

## Alapelvek {#core-principles}

A Forward Email megalakulása óta rendíthetetlenül elkötelezett az adatvédelem és a biztonság alapelvei iránt:

**100%-ban nyílt forráskódú filozófia**: A versenytársakkal ellentétben, akik csak a frontendjeiket teszik nyílt forráskódúvá, miközben a backendeket zárva tartják, a Forward Email teljes kódbázisát – mind a frontendet, mind a backendet – nyilvánosan elérhetővé tette a [GitHub](https://github.com/forwardemail) oldalon.

**Adatvédelem-első tervezés**: A Forward Email az első naptól kezdve egy egyedi, memórián belüli feldolgozási megközelítést vezetett be, amely elkerüli az e-mailek lemezre írását, ezzel megkülönböztetve azt a hagyományos e-mail szolgáltatásoktól, amelyek adatbázisokban vagy fájlrendszerekben tárolják az üzeneteket.

**Folyamatos innováció**: A szolgáltatás egy egyszerű e-mail-továbbítási megoldásból egy átfogó e-mail platformmá fejlődött, amely olyan funkciókkal rendelkezik, mint a titkosított postafiókok, a kvantumrezisztens titkosítás, valamint a szabványos protokollok, többek között az SMTP, IMAP, POP3 és CalDAV támogatása.

**Átláthatóság**: Minden kód nyílt forráskódúvá és ellenőrzésre elérhetővé tétele, biztosítva, hogy a felhasználók ellenőrizhessék az adatvédelmi állításokat ahelyett, hogy egyszerűen csak a marketingnyilatkozatokban bíznának.

**Felhasználói vezérlés**: Lehetőségek biztosítása a felhasználók számára, beleértve a teljes platform önálló üzemeltetésének lehetőségét is, ha szükséges.

## Jelenlegi állapot {#current-status}

2025-től a Forward Email több mint 500 000 domaint szolgál ki világszerte, beleértve olyan neves szervezeteket és iparági vezetőket, mint:

* **Technológiai vállalatok**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Médiaszervezetek**: Fox News Radio, Disney Ad Sales
* **Oktatási intézmények**: Cambridge-i Egyetem, Marylandi Egyetem, Washingtoni Egyetem, Tufts Egyetem, Swarthmore Főiskola
* **Kormányzati szervek**: Dél-Ausztrália kormánya, Dominikai Köztársaság kormánya
* **Egyéb szervezetek**: RCD Hotels, Fly<span>.</span>io
* **Nevezetes fejlesztők**: Isaac Z. Schlueter (npm alkotója), David Heinemeier Hansson (Ruby on Rails alkotója)

A platform folyamatosan fejlődik a rendszeres funkciókiadásoknak és az infrastrukturális fejlesztéseknek köszönhetően, miközben továbbra is az egyetlen 100%-ban nyílt forráskódú, titkosított, adatvédelmet biztosító, átlátható és kvantum-rezisztens e-mail szolgáltatásként őrzi meg pozícióját.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="lekerekített-lg" />