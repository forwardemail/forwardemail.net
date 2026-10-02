# Adatvédelmi Szabályzat {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email adatvédelmi szabályzat" class="rounded-lg" /> -->


## Tartalomjegyzék {#table-of-contents}

* [Nyilatkozat](#disclaimer)
* [Nem gyűjtött információk](#information-not-collected)
* [Gyűjtött információk](#information-collected)
  * [Fiókinformációk](#account-information)
  * [E-mailek tárolása](#email-storage)
  * [Hibanaplók](#error-logs)
  * [Szervernaplók](#server-logs)
  * [Kimenő SMTP e-mailek](#outbound-smtp-emails)
* [Ideiglenes adatfeldolgozás](#temporary-data-processing)
  * [Korlátozás](#rate-limiting)
  * [Kapcsolatkövetés](#connection-tracking)
  * [Hitelesítési kísérletek](#authentication-attempts)
* [Audit naplók](#audit-logs)
  * [Fiókváltozások](#account-changes)
  * [Domain beállítások változásai](#domain-settings-changes)
* [Sütik és munkamenetek](#cookies-and-sessions)
* [Elemzés](#analytics)
* [Alkalmazások és webmail](#apps-and-webmail)
  * [Adatok az Ön eszközén](#data-on-your-device)
  * [Az alkalmazások által nekünk küldött adatok](#data-the-apps-send-us)
  * [Push értesítések](#push-notifications)
  * [Képek és hivatkozások az e-mailekben](#images-and-links-in-emails)
  * [Egyéb kapcsolatok](#other-connections)
* [Megosztott információk](#information-shared)
* [Információ eltávolítása](#information-removal)
* [További közzétételek](#additional-disclosures)


## Nyilatkozat {#disclaimer}

Kérjük, tekintse meg a [Felhasználási feltételeinket](/terms), mivel azok az egész oldalra érvényesek.


## Nem gyűjtött információk {#information-not-collected}

**A jelen szabályzatban kifejezetten leírt információk kivételével (beleértve a [hibanaplókat](#error-logs), a [szervernaplókat](#server-logs), a [kimenő SMTP e-maileket](#outbound-smtp-emails), a [fiókinformációkat](#account-information), az [ideiglenes adatfeldolgozást](#temporary-data-processing), az [ellenőrzési naplókat](#audit-logs), a [sütiket és munkameneteket](#cookies-and-sessions), az [elemzést](#analytics), valamint az [alkalmazásokat és a webmailt](#apps-and-webmail)):**

* Nem tárolunk semmilyen továbbított e-mailt sem lemezes tárolókon, sem adatbázisokban.
* Nem tárolunk semmilyen metaadatot a továbbított e-mailekről sem lemezes tárolókon, sem adatbázisokban.
* A jelen szabályzatban kifejezetten leírtak kivételével nem tárolunk naplókat vagy IP-címeket sem lemezes tárolókon, sem adatbázisokban.
* Nem használunk harmadik féltől származó analitikai vagy telemetriai szolgáltatásokat.


## Gyűjtött információk {#information-collected}

Átláthatóság érdekében bármikor megtekintheti <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">forráskódunkat</a>, hogy lássa, hogyan gyűjtjük és használjuk az alábbi információkat.

**Kizárólag a működés érdekében és szolgáltatásunk fejlesztéséhez a következő információkat gyűjtjük és tároljuk biztonságosan:**

### Fiókinformációk {#account-information}

* Tároljuk az Ön által megadott e-mail címet.
* Tároljuk az Ön által megadott domain neveket, aliasokat és konfigurációkat.
* Korlátozott fiókbiztonsági metaadatokat tárolunk, amelyek a fiókja védelméhez és a hozzáférés kezeléséhez szükségesek, beleértve az aktív weboldal-munkamenet azonosítókat, a sikertelen bejelentkezési kísérletek számlálóit és az utolsó bejelentkezési kísérlet időbélyegét.
* Minden további információt, amelyet önkéntesen ad meg nekünk, például az e-mailben vagy a <a href="/help">súgó</a> oldalunkon beküldött megjegyzéseket vagy kérdéseket.


**Regisztrációs attribúció** (állandóan tárolva a fiókjában):

Fiók létrehozásakor az alábbi információkat tároljuk, hogy megértsük, hogyan találják meg felhasználóink a szolgáltatásunkat:

* A hivatkozó weboldal domainje (nem a teljes URL)
* Az első oldal, amelyet meglátogatott az oldalunkon, és amelynek útvonalában az olyan értékeket, mint a domainnevek, az azonosítók és a tokenek, helyőrzőkre cseréljük
* UTM kampányparaméterek, ha jelen vannak az URL-ben

### E-mailek tárolása {#email-storage}

* E-maileket és naptárinformációkat tárolunk az Ön [titkosított SQLite adatbázisában](/blog/docs/best-quantum-safe-encrypted-email-service), kizárólag az IMAP/POP3/CalDAV/CardDAV hozzáférés és a postaláda funkciók érdekében.
  * Vegye figyelembe, hogy ha csak az e-mail továbbító szolgáltatásainkat használja, akkor nem tárolunk e-maileket sem lemezen, sem adatbázisban, ahogy azt a [Nem gyűjtött információk](#information-not-collected) részben leírtuk.
  * E-mail továbbító szolgáltatásaink kizárólag memóriában működnek (nem írnak lemezre vagy adatbázisba).
  * Az IMAP/POP3/CalDAV/CardDAV tárolás titkosított nyugalmi állapotban, titkosított átvitel alatt, és LUKS titkosított lemezen történik.
  * Az IMAP/POP3/CalDAV/CardDAV tárolás biztonsági mentése titkosított nyugalmi állapotban, titkosított átvitel alatt, és a [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) szolgáltatásban történik.

### Hibanaplók {#error-logs}

* Tároljuk a `4xx` és `5xx` SMTP válaszkódú [hibanaplókat](/faq#do-you-store-error-logs) 7 napig.
* A hibanaplók tartalmazzák az SMTP hibát, a borítékot és az e-mail fejléceket (az e-mail törzsét és a csatolmányokat **nem** tároljuk).
* A hibanaplók tartalmazhatnak IP-címeket és küldő szerverek hosztneveit hibakeresési célokra.
* A [korlátozás](/faq#do-you-have-rate-limiting) és [szürkelista](/faq#do-you-have-a-greylist) hibanaplók nem hozzáférhetők, mivel a kapcsolat korán megszakad (pl. az `RCPT TO` és `MAIL FROM` parancsok továbbítása előtt).
* A sikertelen vagy túl sokáig tartó weboldal- és API-kérések, valamint az IMAP-, POP3-, CalDAV- és CardDAV-szervereinken előforduló hibák hibanaplóit is tároljuk 7 napig.
* Ezek a naplók tartalmazhatják az IP-címet, a kérés URL-jét (beleértve a lekérdezési karakterláncokat, például a keresési kifejezéseket), a kérés fejléceit, például a user agentet, valamint az érintett fiókot vagy aliast.
* A jelszavakat, API tokeneket, sütiket és a kérések törzsét tárolás előtt eltávolítjuk ezekből a naplókból.

### Szervernaplók {#server-logs}

* Szervereink minden weboldal- és API-kérésről egy naplósort írnak, amely tartalmazhatja az IP-címet, a kérés metódusát és URL-jét (beleértve a lekérdezési karakterláncokat), a kérés fejléceit, a válasz állapotát, valamint a bejelentkezett fiókot.
* Ezeket a naplókat a problémák felderítésére és javítására, valamint a visszaélések megállítására használjuk, és legfeljebb 30 napig őrizzük meg.

### Kimenő SMTP E-mailek {#outbound-smtp-emails}

* [Kimenő SMTP e-maileket](/faq#do-you-support-sending-email-with-smtp) körülbelül 30 napig tárolunk.
  * Ez az időtartam a "Date" fejléc alapján változik; mivel engedélyezzük, hogy e-mailek jövőbeli időponttal legyenek elküldve, ha létezik jövőbeli "Date" fejléc.
  * **Fontos, hogy ha egy e-mail sikeresen kézbesítésre került vagy véglegesen hibás, akkor a levél törzsét töröljük és eltávolítjuk.**
  * Ha szeretnéd, hogy a kimenő SMTP e-mail üzenet törzse hosszabb ideig megmaradjon az alapértelmezett 0 napnál (sikeres kézbesítés vagy végleges hiba után), akkor menj a domained Speciális beállításaihoz, és adj meg egy értéket `0` és `30` között.
  * Néhány felhasználó szereti használni a [Fiókom > E-mailek](/my-account/emails) előnézeti funkciót, hogy lássa, hogyan jelennek meg az e-mailjeik, ezért támogatjuk a konfigurálható megőrzési időt.
  * Megjegyzendő, hogy támogatjuk az [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) használatát is.


## Ideiglenes Adatfeldolgozás {#temporary-data-processing}

Az alábbi adatokat ideiglenesen memóriában vagy Redis-ben dolgozzuk fel, és **nem** tároljuk véglegesen:

### Korlátozás (Rate Limiting) {#rate-limiting}

* IP-címeket ideiglenesen használunk Redis-ben a korlátozási célokra.
* A korlátozási adatok automatikusan lejárnak (általában 24 órán belül).
* Ez megakadályozza a visszaéléseket és biztosítja a szolgáltatásaink tisztességes használatát.

### Kapcsolatkövetés {#connection-tracking}

* Egyidejű kapcsolatok száma IP-címenként kerül nyilvántartásra Redis-ben.
* Ezek az adatok automatikusan lejárnak, amikor a kapcsolatok lezárulnak vagy egy rövid időkorlát után.
* Ezt a kapcsolat-visszaélések megelőzésére és a szolgáltatás elérhetőségének biztosítására használjuk.

### Hitelesítési Kísérletek {#authentication-attempts}

* A sikertelen hitelesítési kísérleteket IP-címenként követjük nyomon a Redisben.
* Korlátozott, fiókszintű hitelesítési metaadatokat is tárolunk, beleértve a sikertelen bejelentkezési kísérletek számlálóit és az utolsó bejelentkezési kísérlet időbélyegét.
* A Redis-alapú hitelesítési kísérletek adatai automatikusan lejárnak (általában 24 órán belül).
* A felhasználói fiókok elleni brute-force támadások megelőzésére szolgál.


## Audit Naplók {#audit-logs}

Azért, hogy segítsünk a fiókod és domainjeid felügyeletében és biztonságban tartásában, bizonyos változásokra audit naplókat vezetünk. Ezeket a naplókat értesítő e-mailek küldésére használjuk a fióktulajdonosok és domain adminisztrátorok számára.

### Fiókváltozások {#account-changes}

* Fontos fiókbeállítások változásait követjük nyomon (pl. kétfaktoros hitelesítés, megjelenítendő név, időzóna).
* Ha változást észlelünk, értesítő e-mailt küldünk a regisztrált e-mail címedre.
* Érzékeny mezők (pl. jelszó, API tokenek, helyreállítási kulcsok) nyomon vannak követve, de értékeik az értesítésekben el vannak takarva.
* Az audit napló bejegyzéseket töröljük az értesítő e-mail elküldése után.

### Domain Beállítások Változásai {#domain-settings-changes}

Több adminisztrátorral rendelkező domainek esetén részletes audit naplózást biztosítunk, hogy a csapatok nyomon követhessék a konfigurációs változásokat:

**Mit követünk nyomon:**

* Domain beállítások változásai (pl. visszapattanó webhookok, spam szűrés, DKIM konfiguráció)
* Ki hajtotta végre a változást (a felhasználó e-mail címe)
* Mikor történt a változás (időbélyeg)
* Melyik IP-címről történt a változtatás
* A böngésző/ügyfél user-agent stringje

**Hogyan működik:**

* Minden domain adminisztrátor egyetlen összesített értesítő e-mailt kap, amikor beállítások változnak.
* Az értesítés tartalmaz egy táblázatot, amely megmutatja az egyes változásokat, a változtatót, az IP-címet és az időbélyeget.
* Érzékeny mezők (pl. webhook kulcsok, API tokenek, DKIM privát kulcsok) nyomon vannak követve, de értékeik el vannak takarva.
* A user-agent információk egy összecsukható "Technikai részletek" szekcióban találhatók.
* Az audit napló bejegyzéseket töröljük az értesítő e-mail elküldése után.

**Miért gyűjtjük ezt:**

* Hogy segítsük a domain adminisztrátorokat a biztonsági felügyelet fenntartásában
* Hogy a csapatok auditálhassák, ki hajtott végre konfigurációs változásokat
* Hogy segítséget nyújtsunk hibakereséskor, ha váratlan változások történnek
* Hogy felelősségre vonhatóságot biztosítsunk a megosztott domain kezelésében


## Süti és Munkamenetek {#cookies-and-sessions}

* Csak HTTP-n keresztül elérhető, aláírt sütiket és szerveroldali munkamenet-adatokat tárolunk a weboldal forgalmához.
* A sütik SameSite védelmet használnak.
* Aktív weboldal-munkamenet azonosítókat tárolunk a fiókjában az olyan funkciók támogatására, mint a "log out other devices" és a biztonsággal kapcsolatos munkamenet-érvénytelenítés.
* A munkamenet sütik 30 nap inaktivitás után lejárnak.
* Nem hozunk létre munkameneteket botok vagy lánctalpasok számára.
* A sütiket és munkameneteket a következőkre használjuk:
  * Hitelesítés és bejelentkezési állapot
  * Kétfaktoros hitelesítés "remember me" funkciója
  * Flash üzenetek és értesítések
  * [Elemzés](#analytics): az Ön látogatásának első oldala, a hivatkozó domain, a kampányparaméterek (UTM) és a megtekintett oldalak száma


## Analytics {#analytics}

Saját, adatvédelmet előtérbe helyező elemző rendszerünket használjuk annak megértésére, hogyan használják szolgáltatásainkat. Ez a rendszer az adatvédelem alapelvével készült:

**Mit NEM gyűjtünk:**

* Nem tárolunk IP-címeket
* Nem állítunk be külön sütit elemzéshez
* Nem használunk harmadik fél elemző szolgáltatásokat
* Nem követjük a látogatókat napokon vagy munkameneteken át, amikor nincsenek bejelentkezve

**Mit GYŰJTÜNK:**

* Összesített oldalmegtekintések és szolgáltatáshasználat (SMTP, IMAP, POP3, API stb.)
* Böngésző és operációs rendszer típusa és verziója (a user agentből kinyert, nyers adat eldobva)
* Eszköz típusa (asztali, mobil, tablet)
* Hivatkozó domain (nem teljes URL) és kampányparaméterek (UTM)
* E-mail kliens típusa a levelezési protokollokhoz (pl. Thunderbird, Outlook)
* A lekért oldal vagy API útvonala, amelyben az olyan értékeket, mint a domainnevek, az azonosítók és a tokenek, helyőrzőkre cseréljük, valamint az, hogy a kérés sikeres volt-e
* Weboldal-látogatások esetén a látogatás első oldala és a megtekintett oldalak száma, amelyeket a munkamenetében tárolunk (lásd a [Sütik és munkamenetek](#cookies-and-sessions) részt)
* Ha be van jelentkezve, a fiókja, aliasa vagy domainje azonosítója, hogy lássuk, hogyan használják az egyes szolgáltatásokat, és elháríthassuk a problémákat

**Adatmegőrzés:**

* Az elemzési eseményeket automatikusan töröljük 30 nap után
* Az óránkénti összesítéseket, amelyek egyetlen fiókhoz sem kapcsolódnak, 90 napig őrizzük meg
* A munkamenet-azonosítók naponta cserélődnek, és nem használhatók fel a látogatók napokon át történő követésére


## Alkalmazások és webmail {#apps-and-webmail}

Ez a szakasz az iOS, Android, macOS, Windows és Linux rendszerekre készült e-mail alkalmazásainkra, valamint a <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> címen elérhető webmailünkre vonatkozik, amelyek ugyanazt a kódot használják. Az alkalmazások nem tartalmaznak sem reklám-, sem nyomkövető kódot, sem harmadik féltől származó analitikát.

### Adatok az Ön eszközén {#data-on-your-device}

* Az alkalmazások az Ön eszközén tárolják az e-mailjeit, névjegyeit, naptárait, beállításait és bejelentkezési adatait, hogy gyorsan betöltődjenek és offline is működjenek.
* Ha bekapcsolja az App Lock funkciót, az alkalmazás az e-mailek tárolt tartalmát, a névjegyeket és a bejelentkezési adatokat egy olyan kulccsal titkosítja, amelyet az Ön PIN-kódja vagy passkey-je véd. A dátumok, mappák, címkék és jelzők titkosítatlanok maradnak, hogy az alkalmazás rendezni és számolni tudja az e-mailjeit.
* Ha kijelentkezik egy fiókból, annak adatai törlődnek az eszközéről.

### Az alkalmazások által nekünk küldött adatok {#data-the-apps-send-us}

* Az aliasa e-mail címe és jelszava, amelyeket az alkalmazás minden kéréssel elküld, hogy bejelentkeztethessük Önt.
* Az Ön által küldött, létrehozott vagy módosított e-mailek, névjegyek, naptárak, címkék és szűrők. Az e-maileket, névjegyeket és naptárakat az [E-mailek tárolása](#email-storage) részben leírtak szerint tároljuk, az Ön által küldött e-maileket pedig a [Kimenő SMTP e-mailek](#outbound-smtp-emails) részben leírtak szerint.
* A keresési kifejezései, hogy a szervereinken kereshessünk a postaládájában. A keresési kifejezések a kérés URL-jének részei, ezért megjelenhetnek a [hibanaplókban](#error-logs) és a [szervernaplókban](#server-logs).
* Az alkalmazásból önként küldött visszajelzés, amely e-mailben jut el az aliasáról a támogatási csapatunkhoz, azokkal a diagnosztikai adatokkal együtt, amelyeket Ön mellékelni szeretne.
* Az Ön által spamként jelentett e-mailek, amelyeket az alkalmazás továbbít a visszaélésekkel foglalkozó csapatunknak (vagy egy másik, a beállításokban megadott címre).

### Push értesítések {#push-notifications}

* Ha engedélyezi az értesítéseket, az alkalmazás regisztrál nálunk egy push tokent. Ezt együtt tároljuk a platformmal, a hozzá tartozó aliasszal és fiókkal, a legutóbbi kézbesítés időpontjával és az alkalmazás user agentjéből vett eszköznévvel, amely tartalmazza az operációs rendszere verzióját, Androidon pedig az eszköze modelljét is.
* A push tokent legfeljebb egy évig őrizzük meg az utolsó használatától számítva. Hamarabb töröljük, ha kijelentkezik az alkalmazásból, ha a kézbesítés egymás után háromszor sikertelen, ha megváltozik az alias jelszava, ha törli az aliast, illetve a fiókját, vagy ha az alias másik tulajdonoshoz kerül.
* iOS-en és macOS-en az értesítéseket az Apple Push Notification service továbbítja. A Google Playről letöltött Android-alkalmazásunk esetén a Firebase Cloud Messaging továbbítja őket. Az új e-mailekről szóló értesítések tartalmazzák a feladó nevét és címét, a tárgyat, egy rövid előnézetet és a mappa nevét, azoknál az e-maileknél is, amelyek figyelmeztetés nélkül érkeznek, például a Levélszemét vagy az Elküldött mappába kerülő e-maileknél. Amikor e-mailek, naptárak vagy névjegyek változnak, csendes értesítéseket is küldünk azonosítókkal, de az e-mailek tartalma nélkül, hogy az alkalmazás naprakész maradjon.
* Androidon a [UnifiedPush](https://unifiedpush.org/) használatakor, valamint a webböngészőben kapott értesítéseknél minden értesítés úgy van titkosítva, hogy csak az Ön eszköze tudja elolvasni.
* A Google Playről letöltött Android-alkalmazásunk tartalmazza a Firebase Cloud Messaginget, amely elküldi a Google-nek a Firebase telepítési azonosítót, az alkalmazás verzióját, valamint az eszköz és az SDK adatait. A GitHubról elérhető, Google-mentes Android-alkalmazásunk nem tartalmazza a Firebase-t.

### Képek és hivatkozások az e-mailekben {#images-and-links-in-emails}

* Az e-mailekben lévő képek a feladó szervereiről töltődnek be, amelyek láthatják az Ön IP-címét és azt, hogy mikor töltődtek be a képek.
* Az alkalmazások alapértelmezés szerint letiltják a nyomkövető pixeleket. A Settings > Privacy & Security menüpontban az összes külső képet is letilthatja, majd e-mailenként töltheti be őket.
* Az e-mailekben lévő hivatkozások a webböngészőjében nyílnak meg.

### Egyéb kapcsolatok {#other-connections}

* Webmailünk lekérdezi a GitHubtól a legújabb verzióját betöltéskor, amikor Ön visszatér hozzá, és 10 percenként, amíg nyitva van. Az About & Help menüpont lekérdezi a GitHubtól a legújabb asztali kiadást, az asztali alkalmazások pedig a GitHubon keresnek frissítéseket. Ezekkel a kérésekkel a GitHub megkapja az Ön IP-címét.


## Megosztott információk {#information-shared}

Nem osztjuk meg az Ön adatait harmadik felekkel, kivéve a szolgáltatásunk egyes részeit működtető szolgáltatókat, például a Cloudflare-t (weboldalvédelem és titkosított biztonsági mentések), a Stripe-ot és a PayPalt (fizetések), valamint azokat a szolgáltatásokat, amelyek a push értesítéseket kézbesítik az eszközeire (lásd a [Push értesítések](#push-notifications) részt).

Előfordulhat, hogy bírósági határozattal rendelkező jogi kérelmeknek eleget teszünk (de vegye figyelembe, hogy [nem gyűjtünk adatokat a "Nem gyűjtött információk" alatt említettek szerint](#information-not-collected), így azokat eleve nem tudjuk megadni).


## Információ eltávolítása {#information-removal}

Ha bármikor szeretné eltávolítani az általunk tárolt adatait, lépjen a <a href="/my-account/security">Saját fiók > Biztonság</a> menüpontra, és kattintson a „Fiók törlése” gombra.

A visszaélések megelőzése és kezelése érdekében előfordulhat, hogy az adminisztrátoraink manuálisan felülvizsgálják a fiók törlését, ha azt az első fizetésétől számított 5 napon belül kéri.

Ez a folyamat általában kevesebb, mint 24 órát vesz igénybe, és azért vezettük be, mert voltak felhasználók, akik spammeltek a szolgáltatásunkkal, majd gyorsan törölték fiókjaikat – ami megakadályozta, hogy blokkoljuk a fizetési módjuk ujjlenyomatát a Stripe-ban.

A fiók törlésével az Ön által adminisztrált domainek, az aliasai és a hozzájuk regisztrált push tokenek is törlődnek. Maga a fiókrekord megmarad, de az e-mail címet, a számlázási adatokat, a jelszót és az azonosítókulcsokat eltávolítjuk belőle, a kétfaktoros hitelesítést és az API tokent visszavonjuk, a hozzá tartozó fizetési nyilvántartásokat pedig megőrizzük a visszatérítésekhez és a könyveléshez. A fiókjára hivatkozó naplók és elemzési adatok a fent leírt ütemezés szerint törlődnek.

Ha egy eszközről törölni szeretné az alkalmazások adatait, jelentkezzen ki az alkalmazásból, vagy távolítsa el.


## További tájékoztatások {#additional-disclosures}

Ez az oldal a Cloudflare védelme alatt áll, és annak [Adatvédelmi irányelve](https://www.cloudflare.com/privacypolicy/) és [Szolgáltatási feltételei](https://www.cloudflare.com/website-terms/) érvényesek.
