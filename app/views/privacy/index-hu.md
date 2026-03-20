# Adatvédelmi Szabályzat {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email adatvédelmi szabályzat" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Nyilatkozat](#disclaimer)
* [Nem gyűjtött információk](#information-not-collected)
* [Gyűjtött információk](#information-collected)
  * [Fiókinformációk](#account-information)
  * [E-mailek tárolása](#email-storage)
  * [Hibanaplók](#error-logs)
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
* [Megosztott információk](#information-shared)
* [Információ eltávolítása](#information-removal)
* [További közzétételek](#additional-disclosures)


## Nyilatkozat {#disclaimer}

Kérjük, tekintse meg a [Felhasználási feltételeinket](/terms), mivel azok az egész oldalra érvényesek.


## Nem gyűjtött információk {#information-not-collected}

**Kivéve a [hibanaplókat](#error-logs), [kimenő SMTP e-maileket](#outbound-smtp-emails), és/vagy amikor spam vagy rosszindulatú tevékenységet észlelünk (pl. korlátozás miatt):**

* Nem tárolunk továbbított e-maileket sem lemezen, sem adatbázisban.
* Nem tárolunk továbbított e-mailekhez kapcsolódó metaadatokat sem lemezen, sem adatbázisban.
* Nem tárolunk naplókat vagy IP-címeket sem lemezen, sem adatbázisban.
* Nem használunk harmadik féltől származó elemző vagy telemetria szolgáltatásokat.


## Gyűjtött információk {#information-collected}

Átláthatóság érdekében bármikor megtekintheti <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">forráskódunkat</a>, hogy lássa, hogyan gyűjtjük és használjuk az alábbi információkat.

**Kizárólag a működés érdekében és szolgáltatásunk fejlesztéséhez a következő információkat gyűjtjük és tároljuk biztonságosan:**

### Fiókinformációk {#account-information}

* Tároljuk az Ön által megadott e-mail címet.
* Tároljuk az Ön által megadott domain neveket, aliasokat és konfigurációkat.
* Bármilyen további információt, amelyet önkéntesen megad, például e-mailben vagy <a href="/help">segítség</a> oldalunkon beküldött megjegyzéseket vagy kérdéseket.

**Regisztrációs attribúció** (állandóan tárolva a fiókjában):

Fiók létrehozásakor az alábbi információkat tároljuk, hogy megértsük, hogyan találják meg felhasználóink a szolgáltatásunkat:

* A hivatkozó weboldal domainje (nem a teljes URL)
* Az első oldal, amelyet meglátogatott az oldalunkon
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

* Sikertelen hitelesítési kísérleteket IP-címenként követünk nyomon Redis-ben.
* Ezek az adatok automatikusan lejárnak (általában 24 órán belül).
* Ezt a felhasználói fiókok elleni brute-force támadások megelőzésére használjuk.


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

* Süti tárolódik a munkamenetben a webhelyed forgalmához.
* A sütik HTTP-only, aláírtak és SameSite védelemmel rendelkeznek.
* A munkamenet sütik 30 nap inaktivitás után lejárnak.
* Nem hozunk létre munkameneteket botok vagy keresőrobotok számára.
* A sütiket a következőkre használjuk:
  * Hitelesítés és bejelentkezési állapot
  * Kétfaktoros hitelesítés "emlékezz rám" funkció
  * Flash üzenetek és értesítések
## Analytics {#analytics}

Saját, adatvédelmet előtérbe helyező elemző rendszerünket használjuk annak megértésére, hogyan használják szolgáltatásainkat. Ez a rendszer az adatvédelem alapelvével készült:

**Mit NEM gyűjtünk:**

* Nem tárolunk IP-címeket
* Nem használunk sütiket vagy tartós azonosítókat elemzéshez
* Nem használunk harmadik fél elemző szolgáltatásokat
* Nem követjük a felhasználókat napokon vagy munkameneteken át

**Mit GYŰJTÜNK (anonimizáltan):**

* Összesített oldalmegtekintések és szolgáltatáshasználat (SMTP, IMAP, POP3, API stb.)
* Böngésző és operációs rendszer típusa (a user agentből kinyert, nyers adat eldobva)
* Eszköz típusa (asztali, mobil, tablet)
* Hivatkozó domain (nem teljes URL)
* E-mail kliens típusa a levelezési protokollokhoz (pl. Thunderbird, Outlook)

**Adatmegőrzés:**

* Az elemzési adatokat automatikusan töröljük 30 nap után
* A munkamenet-azonosítók naponta cserélődnek, és nem használhatók fel a felhasználók napokon át történő követésére


## Megosztott információk {#information-shared}

Nem osztjuk meg az Ön adatait harmadik felekkel.

Előfordulhat, hogy bírósági határozattal rendelkező jogi kérelmeknek eleget teszünk (de vegye figyelembe, hogy [nem gyűjtünk adatokat a "Nem gyűjtött információk" alatt említettek szerint](#information-not-collected), így azokat eleve nem tudjuk megadni).


## Információ eltávolítása {#information-removal}

Ha bármikor szeretné eltávolítani az általunk tárolt adatait, lépjen a <a href="/my-account/security">Saját fiók > Biztonság</a> menüpontra, és kattintson a „Fiók törlése” gombra.

A visszaélések megelőzése és kezelése érdekében előfordulhat, hogy az adminisztrátoraink manuálisan felülvizsgálják a fiók törlését, ha azt az első fizetésétől számított 5 napon belül kéri.

Ez a folyamat általában kevesebb, mint 24 órát vesz igénybe, és azért vezettük be, mert voltak felhasználók, akik spammeltek a szolgáltatásunkkal, majd gyorsan törölték fiókjaikat – ami megakadályozta, hogy blokkoljuk a fizetési módjuk ujjlenyomatát a Stripe-ban.


## További tájékoztatások {#additional-disclosures}

Ez az oldal a Cloudflare védelme alatt áll, és annak [Adatvédelmi irányelve](https://www.cloudflare.com/privacypolicy/) és [Szolgáltatási feltételei](https://www.cloudflare.com/website-terms/) érvényesek.
