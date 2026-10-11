# Forward Email webmail útmutató {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>Röviden:</strong> A <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">webmailben</a> olvasod és küldöd a leveleidet. A <a href="/my-account/domains">webes irányítópulton</a> állítod be a domaineket, aliasokat és jelszavakat. A webmailbe egy alias címmel és az irányítópulton generált jelszóval jelentkezel be. A webmail ingyenes és <a href="/faq#do-you-offer-a-webmail-client">nyílt forráskódú</a>, és ugyanaz az alkalmazás fut böngészőben, asztali gépen, mobilon és terminálban.
</p>


## Tartalomjegyzék {#table-of-contents}

* [Hol érhető el a webmail](#where-to-get-webmail)
* [A webmail és a webes irányítópult](#webmail-and-the-web-dashboard)
* [Bejelentkezés](#signing-in)
  * [Alias jelszó generálása](#generate-an-alias-password)
  * [Bejelentkezés a webmailbe](#sign-in-to-webmail)
* [Több fiók használata](#using-more-than-one-account)
  * [Küldés egy másik bejelentkezett fiók nevében](#send-as-another-signed-in-account)
* [Küldés bármely címről a domaineden](#send-from-any-address-on-your-domain)
  * [1. lépés: Catch-all jelszó generálása az irányítópulton](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [2. lépés: Mentés a webmailben](#step-2-save-it-in-webmail)
  * [3. lépés: Válaszd ki a címet íráskor](#step-3-pick-the-address-when-you-compose)
  * [Amit a catch-all küldésről tudni érdemes](#what-to-know-about-catch-all-sending)
* [A webmail beállításai dióhéjban](#webmail-settings-at-a-glance)
* [Adatvédelem és App Lock](#privacy-and-app-lock)
* [Hibaelhárítás](#troubleshooting)


## Hol érhető el a webmail {#where-to-get-webmail}

| Platform                        | Hol                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Böngésző                        | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (telepítés nélkül)  |
| Asztali (macOS, Windows, Linux) | A <a href="/download">letöltési oldalunkon</a>                                                                                  |
| Mobil (Android, iOS)            | A <a href="/download">letöltési oldalunkon</a>                                                                                  |
| Terminál                        | A `forwardemail` parancs. Lásd: [Van terminálos alkalmazásotok](/faq#do-you-have-a-terminal-app)                                |

Mindegyik ugyanabból a nyílt forráskódú projektből készül, így ennek az útmutatónak minden része mindegyikre érvényes. A beállításokat és a mentett jelszavakat minden eszköz külön tárolja, ezért állítsd be őket minden használt eszközön.


## A webmail és a webes irányítópult {#webmail-and-the-web-dashboard}

A Forward Emailben két külön helyre lehet bejelentkezni, és ezek eltérő hitelesítő adatokat használnak:

|                                | Webes irányítópult (forwardemail.net)                                                                                     | Webmail (mail.forwardemail.net és az alkalmazások)                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Bejelentkezés ezzel**        | A Forward Email fiókod e-mail címe és jelszava (plusz 2FA vagy passkey)                                                   | Egy alias cím (például `you@example.com`) és a hozzá generált jelszó                  |
| **Mire való**                  | Domainek, DNS, aliasok, számlázás, csapattagok hozzáadása, jelszavak generálása, Speciális beállítások                    | Levelek olvasása és küldése, mappák, címkék, keresés, naptár, névjegyek, szűrők       |
| **Itt készült jelszavak**      | Alias jelszavak és catch-all jelszavak                                                                                    | Nincs. A webmail az irányítópulton készített jelszavakat használja                    |

Egy gyakori beállítás így néz ki:

1. Az irányítópulton add hozzá a domainedet, és állítsd be a DNS-t.
2. Hozz létre egy aliast bekapcsolt IMAP tárhellyel (például `you@example.com`).
3. Generálj jelszót ehhez az aliashoz.
4. Jelentkezz be a webmailbe ezzel az aliasszal és jelszóval.

A levélküldéshez a domainednél be kell kapcsolni a kimenő SMTP-t is a <a href="/my-account/domains">Saját fiók <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Speciális beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció alatt, ugyanúgy, mint bármely más levelezőprogramnál.


## Bejelentkezés {#signing-in}

### Alias jelszó generálása {#generate-an-alias-password}

1. Menj a <a href="/my-account/domains">Saját fiók <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok oldalra.
2. Az alias mellett kattints a **Jelszó generálása** gombra.
3. Másold ki a jelszót. Csak egyszer jelenik meg.

Ez ugyanaz a jelszó, amelyet IMAP, POP3, SMTP, CalDAV és CardDAV esetén használnál. A webes irányítópultra nem lehet vele bejelentkezni.

### Bejelentkezés a webmailbe {#sign-in-to-webmail}

Nyisd meg a webmailt, és add meg a teljes alias címet és a generált jelszót. Ha előbb csak körülnéznél, próbáld ki a demót a bejelentkezési képernyőről.


## Több fiók használata {#using-more-than-one-account}

Egyszerre több aliasba is bejelentkezhetsz, akár különböző domaineken is. A fiókmenüben válthatsz közöttük, és a **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts** alatt kezelheted őket. A fiókok azon az eszközön maradnak, ahol hozzáadtad őket, és nincsenek szinkronizálva.

### Küldés egy másik bejelentkezett fiók nevében {#send-as-another-signed-in-account}

Íráskor a **From** menü felsorolja az ezen az eszközön bejelentkezett összes fiókot. Válassz egyet, hogy arról a címről küldj. Az üzenet annak a fióknak a saját jelszavával megy el, a másolata pedig annak a fióknak az Elküldött mappájába kerül.


## Küldés bármely címről a domaineden {#send-from-any-address-on-your-domain}

Ha van saját domained, bármely rajta lévő címről küldhetsz, például `billing@example.com` vagy `no-reply@example.com` címről, anélkül hogy mindegyikhez aliast hoznál létre és bejelentkeznél. Ehhez a domain **catch-all jelszavát** használod.

A webmailbe **nem** wildcard vagy catch-all fiókként jelentkezel be, és nincs bekapcsolandó funkció sem. A catch-all jelszót egyszer elmented a webmail beállításaiban, és utána a From menüben bármely címet beírhatsz azon a domainen.

### 1. lépés: Catch-all jelszó generálása az irányítópulton {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Menj a <a href="/my-account/domains">Saját fiók <i class="fa fa-angle-right"></i> Domainek</a> oldalra, és válaszd ki a domainedet.
2. Nyisd meg a **Speciális beállítások** részt, és keresd meg a **Gyűjtőjelszavak** szakaszt.
3. Kattints a **Jelszó generálása** gombra. Hagyd üresen a mezőt, ha erős, véletlenszerű jelszót szeretnél, és ha akarod, adj meg egy leírást (például „Webmail a laptopomon”).
4. Másold ki a jelszót. Csak egyszer jelenik meg.

Ezt a szakaszt csak a domain adminisztrátorai látják. Ugyanitt a **Jelszavak kezelése** gombbal később megnézheted vagy törölheted a catch-all jelszavakat. Ha törölsz egyet, az mindenhol leáll, ahová el van mentve.

### 2. lépés: Mentés a webmailben {#step-2-save-it-in-webmail}

1. A webmailben nyisd meg a **Settings <i class="fa fa-angle-right"></i> General** részt.
2. Keresd meg a **Send from any address** kártyát, közvetlenül a **Your accounts** alatt.
3. Kattints a **Add catch-all password** gombra.
4. Add meg a domaint (például `example.com`), és illeszd be a catch-all jelszót.
5. Kattints a **Save** gombra. Ezt fogod látni: "You can now send from any address @example.com".

Annyi domainhez menthetsz jelszót, amennyihez csak szeretnél. Egy jelszó eltávolításához kattints a mellette lévő kuka ikonra.

### 3. lépés: Válaszd ki a címet íráskor {#step-3-pick-the-address-when-you-compose}

1. Kezdj egy új üzenetet.
2. Nyisd meg a **From** menüt. A bejelentkezett fiókjaid alatt minden mentett domainhez van egy bejegyzés: **Other address @example.com…**
3. Válaszd ki. A From sor szövegmezővé alakul, utána `@example.com` áll.
4. Írd be a @ előtti részt (például `billing`), és küldd el.

A piszkozatok megtartják a beírt címet, így egy mentett piszkozat ugyanazzal a From címmel nyílik meg újra.

### Amit a catch-all küldésről tudni érdemes {#what-to-know-about-catch-all-sending}

* **Csak küldésre jó.** A catch-all jelszó csak küldésre használható. Postafiókot nem tud megnyitni, így nem olvashatod vele a `billing@example.com` leveleit. A válaszok olvasásához hozz létre egy aliast (vagy egy hozzád továbbító catch-all aliast) ahhoz a címhez.
* **Az elküldött másolatok a használt fiókba kerülnek.** A `billing@example.com` címről küldött üzenet annak a fióknak az Elküldött mappájába kerül, amelyből írtad.
* **Az eszköz minden fiókjából működik.** A mentett jelszó nincs egyetlen bejelentkezett fiókhoz kötve. Az eszközön bármelyik fiók használhatja.
* **Ezen az eszközön marad.** A jelszó csak azon az eszközön van tárolva, ahol elmentetted. Nincs szinkronizálva, és a QR-kódos eszközpárosítás sem másolja át. Add hozzá újra minden eszközön.
* **Az App Lock védi.** Ha az App Lock be van kapcsolva, a jelszó a többi helyi adatoddal együtt titkosítva van, és a **Other address** bejegyzések rejtve maradnak, amíg az alkalmazás zárolva van.
* **Az ütemezett küldés nem érhető el** a catch-all jelszóval küldött címeknél, mert ez a jelszó nem tudja visszaolvasni vagy visszavonni az ütemezett üzenetet. Küldd el azonnal, vagy egy bejelentkezett fiók nevében.
* **A hibás jelszó nem jelentkeztet ki.** Ha a catch-all jelszó hibás, vagy törölték az irányítópulton, a küldés hibaüzenettel meghiúsul, de bejelentkezve maradsz.


## A webmail beállításai dióhéjban {#webmail-settings-at-a-glance}

| Szakasz                | Mit tartalmaz                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **General**            | Fiókjaid, küldés bármely címről (catch-all jelszavak), értesítések, tárhely                         |
| **Appearance**         | Téma, elrendezés, sűrűség, szerkesztő alapbeállításai, aláírás, betűtípus, külső hivatkozások       |
| **Privacy & Security** | App Lock, PGP titkosítás, adatvédelmi beállítások, spam jelentése                                   |
| **Folders & Labels**   | Speciális mappák, saját mappáid, címkék                                                             |
| **Filters**            | Levélszűrők a bejelentkezett aliashoz                                                               |
| **Calendar**           | A hét kezdőnapja és feladatok                                                                       |
| **Search**             | Keresési indexelés, index állapota, mentett keresések, keresési operátorok                          |
| **Advanced**           | Postafiók tárhely, helyi gyorsítótár és az alkalmazás visszaállítása                                |
| **Keyboard Shortcuts** | Az összes billentyűparancs                                                                          |
| **About & Help**       | Verzió, asztali alkalmazás letöltése, visszajelzés és hivatkozások                                  |

A domainhez vagy aliashoz tartozó dolgokat, mint a DNS, a továbbítási címzettek, a tárhelykorlátok, az automatikus válaszok, a catch-all jelszavak és a spamszűrés, a <a href="/my-account/domains">webes irányítópulton</a> állíthatod be.


## Adatvédelem és App Lock {#privacy-and-app-lock}

A webmail helyi másolatot tart a leveleidről, így gyors és offline is működik. Az **App Lock** (a **Settings <i class="fa fa-angle-right"></i> Privacy & Security** alatt) titkosítja ezeket a helyi adatokat, a beállításaidat és a mentett jelszavaidat az eszközön, és passkey-vel vagy PIN-kóddal oldható fel. A levelek és az élő frissítések közvetlenül az alkalmazás és a Forward Email között közlekednek, közöttük nincs semmilyen hirdetési vagy követő szolgáltatás.


## Hibaelhárítás {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

A webmailnek ezen az eszközön nincs jelszava ehhez a címhez. Vagy jelentkezz be abba az aliasba, vagy mentsd el a domain catch-all jelszavát a **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address** alatt. Ha az alkalmazás zárolva van, előbb oldd fel.

**Az „Other address” bejegyzés hiányzik a From menüből.**

Ellenőrizd, hogy elmentetted-e a catch-all jelszót ezen az eszközön, és hogy az App Lock fel van-e oldva.

**A küldés catch-all címről hitelesítési hibával meghiúsul.**

Lehet, hogy a catch-all jelszót törölték vagy elgépelték. Generálj egy újat az irányítópulton, majd a webmailben távolítsd el a régit, és add hozzá az újat.

**Az irányítópult jelszavam nem működik a webmailben.**

A webmailhez alias jelszó kell, nem az irányítópult jelszava. Lásd: [Alias jelszó generálása](#generate-an-alias-password).

Még mindig elakadtál? Nézd meg a <a href="/faq">GYIK</a> oldalunkat, vagy <a href="/help">lépj kapcsolatba velünk</a>.
