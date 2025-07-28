# Adatvédelmi irányelvek {#privacy-policy}

<img loading="lusta" src="/img/articles/privacy.webp" alt="" class="rounded-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Jogi nyilatkozat](#disclaimer)
* [Nem gyűjtött információk](#information-not-collected)
* [Összegyűjtött információk](#information-collected)
* [Megosztott információk](#information-shared)
* [Információ eltávolítása](#information-removal)
* [További közzétételek](#additional-disclosures)

## Jogi nyilatkozat {#disclaimer}

Kérjük, tartsák magukat a [Feltételek](/terms) dokumentumunkhoz, mivel az az egész webhelyre vonatkozik.

## Nem gyűjtött információk {#information-not-collected}

**A [hibák](/faq#do-you-store-error-logs), [kimenő SMTP e-mailek](/faq#do-you-support-sending-email-with-smtp) kivételével, és/vagy spam vagy rosszindulatú tevékenység észlelésekor (pl. sebességkorlátozás céljából):**

* Nem tárolunk továbbított e-maileket lemezen vagy adatbázisokban.
* Nem tárolunk metaadatokat az e-mailekről lemezen vagy adatbázisokban.
* Nem tárolunk naplókat vagy IP-címeket lemezen vagy adatbázisokban.

## Összegyűjtött információk {#information-collected}

Az átláthatóság érdekében bármikor <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">megtekintheti a forráskódunkat</a>, hogy megtudja, hogyan gyűjtjük és használjuk fel az alábbi információkat:

**Szigorúan a funkcionalitás és szolgáltatásunk fejlesztése érdekében a következő információkat gyűjtjük és tároljuk biztonságosan:**

* Az e-maileket és a naptáradatokat a [titkosított SQLite adatbázis](/blog/docs/best-quantum-safe-encrypted-email-service) fiókjában kizárólag az IMAP/POP3/CalDAV/CardDAV hozzáférés és a postaláda-funkciók céljából tároljuk.
* Felhívjuk figyelmét, hogy ha csak az e-mail-továbbítási szolgáltatásainkat használja, akkor a [Nem gyűjtött információk](#information-not-collected) részben leírtak szerint nem tárolunk e-maileket lemezen vagy adatbázisban.
* E-mail-továbbítási szolgáltatásaink csak a memóriában működnek (nincs írás lemezre vagy adatbázisba).
* Az IMAP/POP3/CalDAV/CardDAV tároló titkosítva van inaktív állapotban, titkosítva átvitel közben, és LUKS titkosítású lemezen tárolódik.
* Az IMAP/POP3/CalDAV/CardDAV tároló biztonsági mentései titkosítva vannak inaktív állapotban, titkosítva átvitel közben, és a [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) fiókban tárolódnak.
* Webhelyforgalmához egy munkamenetben sütit tárolunk.
* Az Ön által megadott e-mail címét tároljuk. * Az Ön által megadott domainneveket, aliasokat és konfigurációkat tároljuk.
* A `4xx` és `5xx` SMTP válaszkódokat, azaz a [hibanaplók](/faq#do-you-store-error-logs) kódot 7 napig tároljuk.
* A [kimenő SMTP e-mailek](/faq#do-you-support-sending-email-with-smtp) kódot ~30 napig tároljuk.
* Ez a hossz a "Dátum" fejléc alapján változik; mivel engedélyezzük az e-mailek küldését a jövőben is, ha létezik egy jövőbeli "Dátum" fejléc.
* **Felhívjuk figyelmét, hogy miután egy e-mail sikeresen kézbesült, vagy végleges hiba történt, akkor a szövegtörzset szerkesztjük és töröljük.**
* Ha azt szeretné, hogy a kimenő SMTP e-mail szövegtörzse az alapértelmezett 0 napnál hosszabb ideig maradjon meg (sikeres kézbesítés vagy végleges hiba után), akkor lépjen a domain Speciális beállításaihoz, és adjon meg egy `0` és `30` közötti értéket. * Néhány felhasználó szívesen használja a [Fiókom > E-mailek](/my-account/emails) előnézeti funkciót, hogy lássa, hogyan jelennek meg az e-mailjeik, ezért támogatjuk a konfigurálható megőrzési időszakot.
* Felhívjuk figyelmét, hogy a [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) funkciót is támogatjuk.
* Bármilyen további információ, amelyet önkéntesen megad nekünk, például e-mailben vagy a <a href="/help">súgó</a> oldalunkon beküldött megjegyzések vagy kérdések.

## Megosztott információk {#information-shared}

Nem osztjuk meg az adataidat harmadik féllel. Nem használunk harmadik féltől származó analitikai vagy telemetriai szoftverszolgáltatásokat sem.

Szükségünk lehet rá, és eleget is fogunk tenni a bíróság által elrendelt jogi kéréseknek (de ne feledje, hogy a [Nem gyűjtjük a fent említett „Nem gyűjtött információk” részben szereplő információkat.](#information-not-collected) pontot nem tudjuk biztosítani, így kezdetben nem tudjuk biztosítani).

## Információ eltávolítása {#information-removal}

Ha bármikor törölni szeretné a nekünk megadott információkat, lépjen a <a href="/my-account/security">Fiókom > Biztonság</a> menüpontra, és kattintson a „Fiók törlése” gombra.

A visszaélések megelőzése és mérséklése érdekében előfordulhat, hogy a fiókodat manuálisan felül kell vizsgálniuk az adminisztrátoraink, ha az első befizetésedtől számított 5 napon belül törlöd.

Ez a folyamat általában kevesebb mint 24 órát vesz igénybe, és azért vezettük be, mert a felhasználók spammeltek a szolgáltatásunkkal, majd gyorsan törölték a fiókjaikat – ami megakadályozta, hogy blokkoljuk a fizetési mód ujjlenyomatát a Stripe-ban.

## További közzétételek {#additional-disclosures}

Ezt az oldalt a Cloudflare védi, és a [Adatvédelmi irányelvek](https://www.cloudflare.com/privacypolicy/) és [Szolgáltatási feltételek](https://www.cloudflare.com/website-terms/) feltételek érvényesek rá.