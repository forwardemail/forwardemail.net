# Teljes útmutató NAS e-mail beállításhoz a Forward Email-lel {#complete-guide-to-nas-email-setup-with-forward-email}

Az e-mail értesítések beállítása a NAS-on nem kell, hogy problémás legyen. Akár Synology, QNAP, vagy akár Raspberry Pi készüléked van, ez az útmutató segít, hogy az eszközöd kommunikáljon a Forward Email-lel, így tényleg értesülsz, ha valami baj történik.

A legtöbb NAS eszköz képes e-mail értesítéseket küldeni meghajtóhibákról, hőmérséklet figyelmeztetésekről, biztonsági mentések befejezéséről és biztonsági eseményekről. A probléma? Sok e-mail szolgáltató egyre szigorúbb a biztonság terén, és a régebbi eszközök gyakran nem tudnak lépést tartani. Itt jön képbe a Forward Email – támogatjuk a modern és a régebbi eszközöket egyaránt.

Ez az útmutató több mint 75 NAS szolgáltató e-mail beállításait tartalmazza lépésről lépésre, kompatibilitási információkkal és hibakeresési tippekkel. Bármit is használsz, segítünk, hogy az értesítéseid működjenek.


## Tartalomjegyzék {#table-of-contents}

* [Miért van szükséged NAS e-mail értesítésekre](#why-you-need-nas-email-notifications)
* [A TLS probléma (és hogyan oldjuk meg)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP beállítások](#forward-email-smtp-settings)
* [Átfogó NAS szolgáltató kompatibilitási mátrix](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS e-mail konfiguráció](#synology-nas-email-configuration)
  * [Konfigurációs lépések](#configuration-steps)
* [QNAP NAS e-mail konfiguráció](#qnap-nas-email-configuration)
  * [Konfigurációs lépések](#configuration-steps-1)
  * [Gyakori QNAP hibakeresési problémák](#common-qnap-troubleshooting-issues)
* [ReadyNAS régi konfiguráció](#readynas-legacy-configuration)
  * [Régi konfigurációs lépések](#legacy-configuration-steps)
  * [ReadyNAS hibakeresés](#readynas-troubleshooting)
* [TerraMaster NAS konfiguráció](#terramaster-nas-configuration)
* [ASUSTOR NAS konfiguráció](#asustor-nas-configuration)
* [Buffalo TeraStation konfiguráció](#buffalo-terastation-configuration)
* [Western Digital My Cloud konfiguráció](#western-digital-my-cloud-configuration)
* [TrueNAS e-mail konfiguráció](#truenas-email-configuration)
* [OpenMediaVault konfiguráció](#openmediavault-configuration)
* [Raspberry Pi NAS konfiguráció](#raspberry-pi-nas-configuration)
  * [Kezdeti Raspberry Pi beállítás](#initial-raspberry-pi-setup)
  * [Samba fájlmegosztás konfiguráció](#samba-file-sharing-configuration)
  * [FTP szerver beállítás](#ftp-server-setup)
  * [E-mail értesítés konfiguráció](#email-notification-configuration)
  * [Fejlett Raspberry Pi NAS funkciók](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi e-mail hibakeresés](#raspberry-pi-email-troubleshooting)
  * [Teljesítmény optimalizálás](#performance-optimization)
  * [Biztonsági megfontolások](#security-considerations)


## Miért van szükséged NAS e-mail értesítésekre {#why-you-need-nas-email-notifications}

A NAS-od rengeteg dolgot figyel – meghajtó állapotát, hőmérsékletet, hálózati problémákat, biztonsági eseményeket. E-mail értesítések nélkül a problémák hetekig észrevétlenek maradhatnak, ami adatvesztéshez vagy biztonsági incidensekhez vezethet.

Az e-mail értesítések azonnali figyelmeztetéseket adnak, amikor a meghajtók elkezdenek hibásodni, figyelmeztetnek illetéktelen hozzáférési kísérletekre, megerősítik a sikeres biztonsági mentéseket, és tájékoztatnak a rendszer állapotáról. A Forward Email gondoskodik róla, hogy ezek a kritikus értesítések valóban eljussanak hozzád.


## A TLS probléma (és hogyan oldjuk meg) {#the-tls-problem-and-how-we-fix-it}

A helyzet a következő: ha a NAS-od 2020 előtt készült, valószínűleg csak a TLS 1.0-t támogatja. A Gmail, Outlook és a legtöbb szolgáltató már évekkel ezelőtt megszüntette ennek támogatását. Az eszközöd megpróbál e-mailt küldeni, elutasítják, és te a sötétben maradsz.

A Forward Email ezt kettős port támogatással oldja meg. A modern eszközök a szabványos portjainkat használják (`465` és `587`), míg a régebbi eszközök a régi portjainkat (`2455` és `2555`), amelyek még támogatják a TLS 1.0-t.

> \[!IMPORTANT]
> A Forward Email mind a modern, mind a régi NAS eszközöket támogatja kettős port stratégiánk révén. Használd a 465/587 portokat a TLS 1.2+ támogatással rendelkező modern eszközökhöz, és a 2455/2555 portokat a csak TLS 1.0-t támogató régi eszközökhöz.


## Forward Email SMTP beállítások {#forward-email-smtp-settings}
Itt van, amit tudnod kell az SMTP beállításunkról:

**Modern NAS eszközökhöz (2020+):** Használd a `smtp.forwardemail.net` címet a `465` (SSL/TLS) vagy a `587` (STARTTLS) porttal. Ezek működnek a TLS 1.2+ támogatást nyújtó aktuális firmware-rel.

**Régebbi NAS eszközökhöz:** Használd a `smtp.forwardemail.net` címet a `2455` (SSL/TLS) vagy a `2555` (STARTTLS) porttal. Ezek támogatják a TLS 1.0-t régebbi eszközök számára.

**Hitelesítés:** Használd a Forward Email aliasodat felhasználónévként, és a [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszót (nem a fiók jelszavadat).

> \[!CAUTION]
> Soha ne használd a fiók bejelentkezési jelszavadat SMTP hitelesítéshez. Mindig a [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszót használd NAS konfigurációhoz.

> \[!TIP]
> Ellenőrizd NAS eszközöd firmware verzióját és TLS támogatását a konfiguráció előtt. A 2020 után gyártott eszközök többsége támogatja a modern TLS protokollokat, míg a régebbi eszközök általában a régi kompatibilitási portokat igénylik.


## Átfogó NAS szolgáltató kompatibilitási mátrix {#comprehensive-nas-provider-compatibility-matrix}

Az alábbi mátrix részletes kompatibilitási információkat nyújt a főbb NAS szolgáltatókról, beleértve a TLS támogatási szinteket, firmware állapotot és a javasolt Forward Email konfigurációs beállításokat.

| NAS szolgáltató | Aktuális modellek | TLS támogatás | Firmware állapot | Ajánlott portok | Gyakori problémák                                                                                                                                       | Beállítási útmutató/Képernyőképek                                                                                                                |
| ---------------- | ----------------- | ------------- | ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x           | TLS 1.2+      | Aktív            | `465`, `587`    | [STARTTLS konfiguráció](https://community.synology.com/enu/forum/2/post/124584)                                                                        | [DSM Email értesítés beállítása](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                              |
| QNAP             | QTS 5.x           | TLS 1.2+      | Aktív            | `465`, `587`    | [Értesítési központ hibák](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)    | [QTS Email szerver konfiguráció](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS    | TLS 1.2+      | Aktív            | `465`, `587`    | [DNS feloldási problémák](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                   | [Raspberry Pi Email beállítási útmutató](#raspberry-pi-nas-configuration)                                                                       |
| ASUSTOR          | ADM 4.x           | TLS 1.2+      | Aktív            | `465`, `587`    | [Tanúsítvány érvényesítés](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                     | [ASUSTOR értesítés beállítása](https://www.asustor.com/en/online/online_help?id=8)                                                              |
| TerraMaster      | TOS 6.x           | TLS 1.2       | Aktív            | `465`, `587`    | [SMTP hitelesítés](https://www.terra-master.com/global/forum/)                                                                                        | [TerraMaster Email konfiguráció](https://www.terra-master.com/global/support/download.php)                                                       |
| TrueNAS          | SCALE/CORE        | TLS 1.2+      | Aktív            | `465`, `587`    | [SSL tanúsítvány beállítás](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                          | [TrueNAS Email beállítási útmutató](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)               |
| Buffalo          | TeraStation       | TLS 1.2       | Korlátozott      | `465`, `587`    | [Firmware kompatibilitás](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)          | [TeraStation Email beállítás](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5     | TLS 1.2       | Korlátozott      | `465`, `587`    | [Régi OS kompatibilitás](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                  | [My Cloud Email konfiguráció](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                        |
| OpenMediaVault   | OMV 7.x           | TLS 1.2+      | Aktív            | `465`, `587`    | [Plugin függőségek](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                          | [OMV értesítés beállítása](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                 |
| Netgear ReadyNAS | OS 6.x            | Csak TLS 1.0  | Megszűnt         | `2455`, `2555`  | [Régi TLS támogatás](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                          | [ReadyNAS Email értesítés beállítása](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)   |
| Drobo            | Dashboard         | TLS 1.2       | Megszűnt         | `465`, `587`    | [Korlátozott támogatás](https://myprojects.drobo.com/support/)                                                                                         | [Drobo Email értesítések](https://www.drobo.com/support/)                                                                                       |
Ez a mátrix jól szemlélteti a modern, aktívan karbantartott NAS rendszerek és a speciális kompatibilitási megfontolásokat igénylő régebbi eszközök közötti egyértelmű különbséget. A jelenlegi NAS eszközök többsége támogatja a modern TLS szabványokat, és a Forward Email elsődleges SMTP portjait külön konfiguráció nélkül használhatják.


## Synology NAS e-mail beállítás {#synology-nas-email-configuration}

A DSM-mel rendelkező Synology eszközök beállítása meglehetősen egyszerű. Támogatják a modern TLS-t, így a szabványos portjainkat gond nélkül használhatod.

> \[!NOTE]
> A Synology DSM 7.x a legátfogóbb e-mail értesítési funkciókat kínálja. A régebbi DSM verziók korlátozottabb konfigurációs lehetőségekkel rendelkezhetnek.

### Beállítási lépések {#configuration-steps}

1. **Lépj be a DSM webes felületére** úgy, hogy beírod a NAS eszköz IP-címét vagy QuickConnect azonosítóját a böngészőbe.

2. **Navigálj a Vezérlőpultba**, válaszd az „Értesítés” részt, majd kattints az „E-mail” fülre az e-mail beállítások eléréséhez.

3. **Engedélyezd az e-mail értesítéseket** az „E-mail értesítések engedélyezése” jelölőnégyzet bejelölésével.

4. **Állítsd be az SMTP szervert** a `smtp.forwardemail.net` szervercím megadásával.

5. **Állítsd be a portot** az SSL/TLS kapcsolathoz az 465-ös portra (ajánlott). Alternatívaként a 587-es port STARTTLS-sel is támogatott.

6. **Állítsd be az autentikációt** az „SMTP hitelesítés szükséges” kiválasztásával, és írd be a Forward Email aliasodat a felhasználónév mezőbe.

7. **Add meg a jelszavadat** a [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) alatt generált jelszóval.

8. **Állítsd be a címzetteket** legfeljebb öt e-mail cím megadásával, akik értesítéseket kapjanak.

9. **Állítsd be az értesítési szűrést**, hogy szabályozd, mely események váltanak ki e-mail értesítést, így elkerülve a túl sok értesítést, miközben a kritikus eseményekről biztosan értesülsz.

10. **Teszteld a beállítást** a DSM beépített tesztfunkciójával, hogy meggyőződj róla, minden helyesen működik, és a kommunikáció a Forward Email szervereivel rendben van.

> \[!TIP]
> A Synology lehetővé teszi, hogy különböző értesítési típusokat különböző címzetteknek állíts be, így rugalmasan oszthatod el az értesítéseket a csapatod között.


## QNAP NAS e-mail beállítás {#qnap-nas-email-configuration}

A QNAP eszközök QTS-sel jól működnek a Forward Email-lel. Támogatják a modern TLS-t, és szép webes felületük van a konfigurációhoz.

> \[!IMPORTANT]
> A QNAP QTS 5.2.4 ismert problémával rendelkezett az e-mail értesítésekkel kapcsolatban, amelyet [a QTS 5.2.5-ben javítottak](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Győződj meg róla, hogy a firmware frissítve van, hogy elkerüld az értesítési hibákat.

### Beállítási lépések {#configuration-steps-1}

1. **Lépj be a QNAP eszköz webes felületére** az IP-címének beírásával a böngészőbe.

2. **Navigálj a Vezérlőpultba**, válaszd a „Szolgáltatásfiók és eszközpárosítás” részt, majd kattints az „E-mail” szekcióra az e-mail beállítások megkezdéséhez.

3. **Kattints az „SMTP szolgáltatás hozzáadása” gombra** egy új e-mail konfiguráció létrehozásához.

4. **Állítsd be az SMTP szervert** a `smtp.forwardemail.net` SMTP szervercím megadásával.

5. **Válaszd ki a megfelelő biztonsági protokollt** – válaszd az „SSL/TLS” opciót az 465-ös porttal (ajánlott). A 587-es port STARTTLS-sel szintén támogatott.

6. **Állítsd be a portszámot** – az SSL/TLS-hez az 465-ös port ajánlott. Szükség esetén a 587-es port STARTTLS-sel is elérhető.

7. **Add meg az autentikációs adatokat** a Forward Email aliasoddal felhasználónévként és a [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) alatt generált jelszóval.

8. **Állítsd be a feladó adatait** egy leíró név megadásával a „Feladó” mezőben, például „QNAP NAS rendszer” vagy az eszköz hosztneve.

9. **Állítsd be a címzetteket** különböző értesítési típusokhoz. A QNAP lehetővé teszi több címzettcsoport konfigurálását különböző riasztási típusokhoz.

10. **Teszteld a beállítást** a QNAP beépített e-mail tesztfunkciójával, hogy meggyőződj róla, minden helyesen működik.

> \[!TIP]
> Ha [Gmail SMTP konfigurációs problémákkal](https://forum.qnap.com/viewtopic.php?t=152466) találkozol, ugyanazok a hibaelhárítási lépések érvényesek a Forward Email-re is. Győződj meg róla, hogy az autentikáció megfelelően engedélyezve van, és az adatok helyesek.
> \[!NOTE]
> A QNAP eszközök támogatják a fejlett értesítési ütemezést, amely lehetővé teszi a csendes órák beállítását, amikor a nem kritikus értesítések elnyomásra kerülnek. Ez különösen hasznos üzleti környezetben.

### Gyakori QNAP hibakeresési problémák {#common-qnap-troubleshooting-issues}

Ha a QNAP eszközöd [nem küld értesítő e-maileket](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), ellenőrizd a következőket:

* Ellenőrizd, hogy a Forward Email hitelesítő adataid helyesek-e
* Győződj meg róla, hogy az SMTP szerver címe pontosan `smtp.forwardemail.net`
* Erősítsd meg, hogy a port megfelel a titkosítási módszerednek (`465` az SSL/TLS-hez ajánlott; `587` a STARTTLS is támogatott)
* Ellenőrizd, hogy az [SMTP szerver konfigurációja](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) engedélyezi-e a kapcsolatot


## ReadyNAS régi konfiguráció {#readynas-legacy-configuration}

A Netgear ReadyNAS eszközök egyedi kihívásokat jelentenek a megszűnt firmware támogatásuk és a régi TLS 1.0 protokollokra való támaszkodás miatt. Azonban a Forward Email régi port támogatása biztosítja, hogy ezek az eszközök megbízhatóan továbbra is küldhessenek e-mail értesítéseket.

> \[!CAUTION]
> A ReadyNAS OS 6.x csak a TLS 1.0-t támogatja, amihez a Forward Email régi kompatibilitási portjai, a `2455` és `2555` szükségesek. A modern `465` és `587` portok nem működnek ezekkel az eszközökkel.

### Régi konfiguráció lépései {#legacy-configuration-steps}

1. **Lépj be a ReadyNAS webes felületére** az eszköz IP-címének megadásával egy böngészőben.

2. **Navigálj a Rendszer > Beállítások > Értesítések** menüpontra az e-mail konfigurációs rész eléréséhez.

3. **Állítsd be az SMTP szervert** úgy, hogy a szerver címe `smtp.forwardemail.net` legyen.

4. **Állítsd be a portot** `2455`-re SSL/TLS kapcsolathoz vagy `2555`-re STARTTLS kapcsolathoz – ezek a Forward Email régi kompatibilitási portjai.

5. **Engedélyezd a hitelesítést**, és add meg a Forward Email aliasodat felhasználónévként, valamint a [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszavadat.

6. **Állítsd be a feladó adatait** egy leíró "Feladó" címmel, hogy azonosítani lehessen a ReadyNAS eszközt.

7. **Add hozzá a címzettek e-mail címeit** az e-mail kapcsolatok szekcióban a + gombbal.

8. **Teszteld a konfigurációt**, hogy megbizonyosodj arról, hogy a régi TLS kapcsolat megfelelően működik.

> \[!IMPORTANT]
> A ReadyNAS eszközöknek a régi portokra van szükségük, mert nem tudnak biztonságos kapcsolatot létesíteni modern TLS protokollokkal. Ez egy [ismert korlátozás](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) a megszűnt firmware esetében.

### ReadyNAS hibakeresés {#readynas-troubleshooting}

A ReadyNAS e-mail konfigurációjával kapcsolatos gyakori problémák:

* **TLS verzió eltérés**: Győződj meg róla, hogy a `2455` vagy `2555` portokat használod, nem a modern portokat
* **Hitelesítési hibák**: Ellenőrizd, hogy a Forward Email hitelesítő adataid helyesek-e
* **Hálózati kapcsolat**: Ellenőrizd, hogy a ReadyNAS eléri-e a `smtp.forwardemail.net` címet
* **Firmware korlátozások**: Néhány régebbi ReadyNAS modell további [HTTPS konfigurációs követelményekkel](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system) rendelkezhet

A ReadyNAS eszközök, amelyek OS 6.x vagy korábbi verziót futtatnak, csak TLS 1.0 kapcsolatokat támogatnak, amelyeket a legtöbb modern e-mail szolgáltató már nem fogad el. A Forward Email dedikált régi portjai (2455 és 2555) kifejezetten ezeket a régi protokollokat támogatják, biztosítva a folyamatos működést a ReadyNAS felhasználók számára.

Az e-mail konfigurálásához a ReadyNAS eszközökön lépj be az eszköz webes felületére az IP-címén keresztül. Navigálj a Rendszer szekcióba, és válaszd az "Értesítések" menüpontot az e-mail konfigurációs lehetőségek eléréséhez.

Az e-mail konfigurációs részben engedélyezd az e-mail értesítéseket, és add meg az smtp.forwardemail.net címet SMTP szerverként. Ez kulcsfontosságú – a Forward Email régi kompatibilis portjait használd a szabványos SMTP portok helyett.

SSL/TLS kapcsolatokhoz állítsd be a 2455-ös portot a szokásos 465-ös helyett (ajánlott). STARTTLS kapcsolatokhoz használd a 2555-ös portot a 587-es helyett. Ezek a speciális portok megőrzik a TLS 1.0 kompatibilitást, miközben a lehető legjobb biztonságot nyújtják a régi eszközök számára.
Add meg a Forward Email aliasodat felhasználónévként és a generált jelszavadat az azonosításhoz. A ReadyNAS eszközök támogatják az SMTP hitelesítést, amely szükséges a Forward Email kapcsolatokhoz.

Állítsd be a feladó e-mail címet és a címzettek címeit az értesítési igényeid szerint. A ReadyNAS lehetővé teszi több címzett címének megadását, így az értesítéseket különböző csapattagoknak vagy e-mail fiókoknak küldheted.

Teszteld alaposan a beállítást, mivel a ReadyNAS eszközök nem mindig adnak részletes hibaüzeneteket, ha a konfiguráció sikertelen. Ha a szokásos tesztelés nem működik, ellenőrizd, hogy a helyes régi portokat (2455 vagy 2555) használod-e a modern SMTP portok helyett.

Fontold meg a régi TLS protokollok használatának biztonsági következményeit. Bár a Forward Email régi portjai a legjobb elérhető biztonságot nyújtják az idősebb eszközök számára, ha lehetséges, ajánlott egy modern NAS rendszerre váltani, amely támogatja a jelenlegi TLS protokollokat.


## TerraMaster NAS konfiguráció {#terramaster-nas-configuration}

A TOS 6.x-et futtató TerraMaster eszközök támogatják a modern TLS-t, és jól működnek a Forward Email szabványos portjaival.

> \[!NOTE]
> A TerraMaster TOS 6.x átfogó e-mail értesítési funkciókat kínál. Győződj meg róla, hogy a firmware naprakész a legjobb kompatibilitás érdekében.

1. **Rendszerbeállítások elérése**
   * Jelentkezz be a TerraMaster webes felületére
   * Navigálj a **Vezérlőpult** > **Értesítés** menüponthoz

2. **SMTP beállítások konfigurálása**
   * Szerver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, ajánlott) vagy `587` (STARTTLS)
   * Felhasználónév: A Forward Email aliasod
   * Jelszó: A [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszó

3. **Értesítések engedélyezése**
   * Jelöld be a kívánt értesítési típusokat
   * Teszteld a beállítást a beépített teszt funkcióval

> \[!TIP]
> A TerraMaster eszközök a legjobb eredményt a `465`-ös porton keresztüli SSL/TLS kapcsolattal érik el (ajánlott). Ha problémák adódnak, a `587`-es port STARTTLS-sel is támogatott.


## ASUSTOR NAS konfiguráció {#asustor-nas-configuration}

Az ADM 4.x-et futtató ASUSTOR eszközök stabil e-mail értesítési támogatással rendelkeznek, és zökkenőmentesen működnek a Forward Email-lel.

> \[!NOTE]
> Az ASUSTOR ADM 4.x fejlett értesítési szűrési lehetőségeket tartalmaz. Testreszabhatod, hogy mely események váltanak ki e-mail értesítést.

1. **Értesítési beállítások megnyitása**
   * Lépj be az ADM webes felületére
   * Menj a **Beállítások** > **Értesítés** menüponthoz

2. **SMTP konfiguráció beállítása**
   * SMTP szerver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, ajánlott) vagy `587` (STARTTLS)
   * Hitelesítés: Engedélyezve
   * Felhasználónév: A Forward Email aliasod
   * Jelszó: A [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszó

3. **Értesítési típusok beállítása**
   * Válaszd ki, mely rendszeresemények váltanak ki e-maileket
   * Állítsd be a címzettek címeit
   * Teszteld a konfigurációt

> \[!IMPORTANT]
> Az ASUSTOR eszközökön az SMTP beállításoknál kifejezetten engedélyezni kell a hitelesítést. Ne felejtsd el ezt az opciót bekapcsolni.


## Buffalo TeraStation konfiguráció {#buffalo-terastation-configuration}

A Buffalo TeraStation eszközök korlátozott, de működőképes e-mail értesítési lehetőségekkel rendelkeznek. A beállítás egyszerű, ha tudod, hol keresd.

> \[!CAUTION]
> A Buffalo TeraStation firmware frissítések ritkák. Győződj meg róla, hogy a legfrissebb elérhető firmware-t használod a készülékedhez, mielőtt beállítod az e-mailt.

1. **Webes konfiguráció elérése**
   * Csatlakozz a TeraStation webes felületéhez
   * Navigálj a **Rendszer** > **Értesítés** menüponthoz

2. **E-mail beállítások konfigurálása**
   * SMTP szerver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, ajánlott) vagy `587` (STARTTLS)
   * Felhasználónév: A Forward Email aliasod
   * Jelszó: A [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszó
   * SSL/TLS titkosítás engedélyezése

3. **Értesítési beállítások megadása**
   * Válaszd ki, mely események váltanak ki e-maileket (lemezhibák, hőmérséklet-értesítések stb.)
   * Add meg a címzettek e-mail címeit
   * Mentsd el és teszteld a konfigurációt

> \[!NOTE]
> Néhány régebbi TeraStation modell korlátozott SMTP konfigurációs lehetőségekkel rendelkezhet. Ellenőrizd a készülék dokumentációját a pontos funkciókért.
## Western Digital My Cloud konfiguráció {#western-digital-my-cloud-configuration}

Az OS 5-öt futtató Western Digital My Cloud eszközök támogatják az e-mail értesítéseket, bár a felület egy kicsit el van rejtve a beállítások között.

> \[!WARNING]
> A Western Digital megszüntette sok My Cloud modell támogatását. Ellenőrizze, hogy az eszköze még kap-e firmware-frissítéseket, mielőtt kritikus riasztásokhoz e-mail értesítésekre támaszkodna.

1. **Navigáljon a Beállításokhoz**
   * Nyissa meg a My Cloud webes irányítópultját
   * Menjen a **Beállítások** > **Általános** > **Értesítések** menüpontra

2. **SMTP adatok konfigurálása**
   * Levélkiszolgáló: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, ajánlott) vagy `587` (STARTTLS)
   * Felhasználónév: Az Ön Forward Email aliasa
   * Jelszó: A [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszó
   * Titkosítás engedélyezése

3. **Riasztástípusok beállítása**
   * Válassza ki az értesítési kategóriákat (rendszerriasztások, lemez állapota stb.)
   * Adja hozzá a címzett e-mail címeit
   * Tesztelje az e-mail konfigurációt

> \[!TIP]
> Ajánljuk a `465`-ös port használatát SSL/TLS-sel. Ha problémák merülnek fel, a `587`-es port STARTTLS-sel szintén támogatott.


## TrueNAS e-mail konfiguráció {#truenas-email-configuration}

A TrueNAS (mind a SCALE, mind a CORE) kiváló e-mail értesítési támogatással rendelkezik részletes konfigurációs lehetőségekkel.

> \[!NOTE]
> A TrueNAS az egyik legátfogóbb e-mail értesítési funkciókat kínálja a NAS rendszerek között. Részletes riasztási szabályokat és több címzettet is beállíthat.

1. **Rendszerbeállítások elérése**
   * Jelentkezzen be a TrueNAS webes felületére
   * Navigáljon a **Rendszer** > **E-mail** menüpontra

2. **SMTP beállítások konfigurálása**
   * Kimenő levelezőszerver: `smtp.forwardemail.net`
   * Levélkiszolgáló port: `465` (ajánlott) vagy `587`
   * Biztonság: SSL/TLS (465-höz, ajánlott) vagy STARTTLS (587-hez)
   * Felhasználónév: Az Ön Forward Email aliasa
   * Jelszó: A [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszó

3. **Riasztások beállítása**
   * Menjen a **Rendszer** > **Riasztási szolgáltatások** menüpontra
   * Állítsa be, mely riasztások legyenek e-mailben küldve
   * Adja meg a címzettek címeit és a riasztási szinteket
   * Tesztelje a konfigurációt a beépített tesztfunkcióval

> \[!IMPORTANT]
> A TrueNAS lehetővé teszi különböző riasztási szintek (INFO, NOTICE, WARNING, ERROR, CRITICAL) beállítását. Válassza ki a megfelelő szinteket, hogy elkerülje az e-mail spamet, miközben a kritikus problémák jelentése biztosított.


## OpenMediaVault konfiguráció {#openmediavault-configuration}

Az OpenMediaVault stabil e-mail értesítési lehetőségeket kínál webes felületén keresztül. A beállítási folyamat tiszta és egyszerű.

> \[!NOTE]
> Az OpenMediaVault értesítési rendszere plugin-alapú. Győződjön meg róla, hogy az e-mail értesítési plugin telepítve és engedélyezve van.

1. **Értesítési beállítások elérése**
   * Nyissa meg az OpenMediaVault webes felületét
   * Menjen a **Rendszer** > **Értesítés** > **E-mail** menüpontra

2. **SMTP paraméterek konfigurálása**
   * SMTP szerver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, ajánlott) vagy `587` (STARTTLS)
   * Felhasználónév: Az Ön Forward Email aliasa
   * Jelszó: A [Saját fiók -> Domain-ek -> Aliasok](https://forwardemail.net/my-account/domains) alatt generált jelszó
   * SSL/TLS engedélyezése

3. **Értesítési szabályok beállítása**
   * Navigáljon a **Rendszer** > **Értesítés** > **Értesítések** menüpontra
   * Állítsa be, mely rendszeresemények indítsanak e-maileket
   * Adja meg a címzettek címeit
   * Tesztelje az e-mail funkciót

> \[!TIP]
> Az OpenMediaVault lehetővé teszi az értesítési ütemezések beállítását. Beállíthat csendes időszakokat vagy korlátozhatja az értesítések gyakoriságát, hogy elkerülje a túl sok riasztást.


## Raspberry Pi NAS konfiguráció {#raspberry-pi-nas-configuration}

A Raspberry Pi kiváló belépőpontot jelent a NAS funkciók világába, költséghatékony megoldást kínálva otthoni és kis irodai környezetek számára. A Raspberry Pi NAS eszközként való beállítása magában foglalja a fájlmegosztási protokollok, e-mail értesítések és alapvető hálózati szolgáltatások konfigurálását.

> \[!TIP]
> Raspberry Pi rajongóknak erősen ajánljuk, hogy egészítsék ki NAS beállításukat a [PiKVM](https://pikvm.org/) távoli szerverkezeléshez és a [Pi-hole](https://pi-hole.net/) hálózati szintű hirdetésblokkoláshoz és DNS-kezeléshez. Ezek az eszközök átfogó otthoni laboratóriumi környezetet teremtenek.
### Kezdeti Raspberry Pi beállítás {#initial-raspberry-pi-setup}

Mielőtt konfigurálná a NAS szolgáltatásokat, győződjön meg róla, hogy a Raspberry Pi a legfrissebb Raspberry Pi OS-t futtatja, és megfelelő tárhellyel rendelkezik. Egy jó minőségű microSD kártya (10-es osztály vagy jobb) vagy USB 3.0 SSD jobb teljesítményt és megbízhatóságot biztosít a NAS műveletekhez.

1. **Frissítse a rendszert** a `sudo apt update && sudo apt upgrade -y` parancs futtatásával, hogy minden csomag naprakész legyen.

2. **Engedélyezze az SSH hozzáférést** a `sudo systemctl enable ssh && sudo systemctl start ssh` paranccsal a távoli adminisztrációhoz.

3. **Állítson be statikus IP címet** az `/etc/dhcpcd.conf` szerkesztésével a következetes hálózati elérés érdekében.

4. **Állítson be külső tárolót** USB meghajtók csatlakoztatásával és csatolásával, vagy RAID tömbök konfigurálásával az adatbiztonság érdekében.

### Samba fájlmegosztás konfiguráció {#samba-file-sharing-configuration}

A Samba Windows-kompatibilis fájlmegosztást biztosít, így a Raspberry Pi elérhető bármely eszközről a hálózatán. A konfiguráció magában foglalja a Samba telepítését, megosztások létrehozását és a felhasználói hitelesítés beállítását.

Telepítse a Sambát a `sudo apt install samba samba-common-bin` paranccsal, és konfigurálja a fő konfigurációs fájlt az `/etc/samba/smb.conf` helyen. Hozzon létre megosztott könyvtárakat, és állítsa be a megfelelő jogosultságokat a `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared` paranccsal.

Konfigurálja a Samba megosztásokat úgy, hogy szekciókat ad hozzá a konfigurációs fájlhoz minden megosztott könyvtárhoz. Állítsa be a felhasználói hitelesítést a `sudo smbpasswd -a username` paranccsal, hogy Samba-specifikus jelszavakat hozzon létre a hálózati hozzáféréshez.

> \[!IMPORTANT]
> Mindig használjon erős jelszavakat a Samba felhasználók számára, és fontolja meg a vendég hozzáférés engedélyezését csak nem érzékeny megosztott mappákhoz. Tekintse át a [hivatalos Samba dokumentációt](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) a fejlett biztonsági beállításokért.

### FTP szerver beállítása {#ftp-server-setup}

Az FTP egy másik módszert kínál a fájlok elérésére, különösen hasznos automatizált mentésekhez és távoli fájlkezeléshez. Telepítse és konfigurálja a vsftpd-t (Very Secure FTP Daemon) a megbízható FTP szolgáltatásokhoz.

Telepítse a vsftpd-t a `sudo apt install vsftpd` paranccsal, és konfigurálja a szolgáltatást az `/etc/vsftpd.conf` szerkesztésével. Engedélyezze a helyi felhasználói hozzáférést, állítsa be a passzív mód beállításait, és alkalmazzon megfelelő biztonsági korlátozásokat.

Hozzon létre FTP felhasználókat, és konfigurálja a könyvtárhozzáférési jogosultságokat. Fontolja meg az SFTP (SSH File Transfer Protocol) használatát a hagyományos FTP helyett a fokozott biztonság érdekében, mivel az titkosítja az összes adatátvitelt.

> \[!CAUTION]
> A hagyományos FTP jelszavakat titkosítatlanul továbbítja. Mindig használjon SFTP-t, vagy konfigurálja az FTP-t TLS titkosítással a biztonságos fájlátvitelhez. Telepítés előtt tekintse át a [vsftpd biztonsági legjobb gyakorlatait](https://security.appspot.com/vsftpd.html).

### E-mail értesítések konfigurálása {#email-notification-configuration}

Állítsa be a Raspberry Pi NAS-t, hogy e-mail értesítéseket küldjön rendszereseményekről, tárhelyfigyelmeztetésekről és mentési állapotokról. Ez magában foglalja egy levelező átviteli ügynök telepítését és konfigurálását, valamint a Forward Email integráció beállítását.

Telepítse az `msmtp`-t, mint könnyű SMTP klienst a `sudo apt install msmtp msmtp-mta` paranccsal. Hozza létre a konfigurációs fájlt az `/etc/msmtprc` helyen az alábbi beállításokkal:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Állítsa be a rendszer értesítéseket cron feladatok és rendszerfigyelő szkriptek létrehozásával, amelyek az `msmtp`-t használják az értesítések küldésére. Készítsen szkripteket a lemezterület figyelésére, hőmérséklet figyelmeztetésekre és mentési befejezési értesítésekre.

### Fejlett Raspberry Pi NAS funkciók {#advanced-raspberry-pi-nas-features}

Bővítse Raspberry Pi NAS-át további szolgáltatásokkal és megfigyelési képességekkel. Telepítsen és konfiguráljon hálózatfigyelő eszközöket, automatizált mentési megoldásokat és távoli hozzáférési szolgáltatásokat.

Állítsa be a [Nextcloud](https://nextcloud.com/) szolgáltatást felhő-szerű funkciókhoz, webes fájlhozzáféréssel, naptár szinkronizálással és együttműködési lehetőségekkel. Telepítse Dockeren keresztül vagy a hivatalos Nextcloud Raspberry Pi telepítési útmutató alapján.
Automatizált biztonsági mentések konfigurálása `rsync` és `cron` használatával az kritikus adatok ütemezett mentése érdekében. Állíts be e-mail értesítéseket a mentés befejezéséről és hibajelzésekről a Forward Email konfigurációd segítségével.

Hálózatfigyelés megvalósítása olyan eszközökkel, mint a [Nagios](https://www.nagios.org/) vagy a [Zabbix](https://www.zabbix.com/), a rendszer állapotának, hálózati kapcsolatok és szolgáltatások elérhetőségének figyelésére.

> \[!NOTE]
> A hálózati infrastruktúrát kezelő felhasználók számára érdemes megfontolni a [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) integrálását a PiKVM rendszerrel a távoli fizikai kapcsolóvezérléshez. Ez a [Python integrációs útmutató](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) részletes utasításokat nyújt a fizikai eszközök automatizált kezeléséhez.

### Raspberry Pi e-mail hibakeresés {#raspberry-pi-email-troubleshooting}

A Raspberry Pi e-mail konfigurációjával kapcsolatos gyakori problémák közé tartoznak a DNS feloldási hibák, tűzfal korlátozások és hitelesítési sikertelenségek. A Raspberry Pi rendszerek könnyűsúlyú jellege néha időzítési problémákat okozhat az SMTP kapcsolatoknál.

Ha az e-mail értesítések nem működnek, ellenőrizd az `msmtp` naplófájlt a `/var/log/msmtp.log` helyen a részletes hibaüzenetekért. Győződj meg róla, hogy a Forward Email hitelesítő adataid helyesek, és hogy a Raspberry Pi képes feloldani a `smtp.forwardemail.net` címet.

Teszteld az e-mail funkciót a parancssorban: `echo "Test message" | msmtp recipient@example.com`. Ez segít elkülöníteni a konfigurációs problémákat az alkalmazás-specifikus hibáktól.

Állítsd be a megfelelő DNS beállításokat a `/etc/resolv.conf` fájlban, ha DNS feloldási problémákat tapasztalsz. Érdemes nyilvános DNS szervereket használni, mint a `8.8.8.8` vagy `1.1.1.1`, ha a helyi DNS nem megbízható.

### Teljesítményoptimalizálás {#performance-optimization}

Optimalizáld Raspberry Pi NAS teljesítményét a tároló, hálózati beállítások és rendszererőforrások megfelelő konfigurálásával. Használj kiváló minőségű tárolóeszközöket, és állítsd be a fájlrendszer opciókat az adott felhasználási esethez.

Engedélyezd az USB 3.0 bootolást a jobb tároló teljesítmény érdekében, ha külső meghajtókat használsz. Állítsd be a GPU memória megosztást a `sudo raspi-config` segítségével, hogy több RAM jusson a rendszer műveletekhez a grafikus feldolgozás helyett.

Figyeld a rendszer teljesítményét olyan eszközökkel, mint a `htop`, `iotop` és `nethogs`, hogy azonosítsd a szűk keresztmetszeteket és optimalizáld az erőforrás-használatot. Fontold meg a Raspberry Pi 4 8GB RAM-mal való frissítését igényes NAS alkalmazásokhoz.

Valósíts meg megfelelő hűtési megoldásokat a hőmiatti teljesítménycsökkenés elkerülése érdekében intenzív műveletek során. Figyeld a CPU hőmérsékletét a `/opt/vc/bin/vcgencmd measure_temp` paranccsal, és gondoskodj megfelelő szellőzésről.

### Biztonsági megfontolások {#security-considerations}

Biztosítsd Raspberry Pi NAS-odat megfelelő hozzáférés-vezérléssel, hálózati biztonsági intézkedésekkel és rendszeres biztonsági frissítésekkel. Változtasd meg az alapértelmezett jelszavakat, tiltsd le a szükségtelen szolgáltatásokat, és állíts be tűzfal szabályokat.

Telepítsd és konfiguráld a `fail2ban`-t az SSH és más szolgáltatások elleni brute force támadások elleni védelemhez. Állíts be automatikus biztonsági frissítéseket a `unattended-upgrades` segítségével, hogy a kritikus biztonsági javítások időben települjenek.

Konfiguráld a hálózati szegmentálást, hogy lehetőség szerint elkülönítsd a NAS-t a többi hálózati eszköztől. Távoli kapcsolatokhoz használj VPN hozzáférést a szolgáltatások közvetlen internetes kitettsége helyett.

Rendszeresen készíts biztonsági mentést a Raspberry Pi konfigurációról és adatokról, hogy elkerüld az adatvesztést hardverhibák vagy biztonsági incidensek esetén. Teszteld a mentések visszaállítási eljárásait az adatvisszanyerési képességek biztosítására.

A Raspberry Pi NAS konfiguráció kiváló alapot nyújt a hálózati tárolási fogalmak elsajátításához, miközben gyakorlati funkcionalitást biztosít otthoni és kis irodai környezetekben. A Forward Email kombinációja megbízható értesítéskézbesítést garantál a rendszerfigyelés és karbantartási riasztások számára.
