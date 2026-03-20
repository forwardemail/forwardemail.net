# Kvantumbiztos e-mail: Hogyan használunk titkosított SQLite postaládákat az e-mailjeid biztonságáért {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Kvantumbiztos titkosított e-mail szolgáltatás illusztráció" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [E-mail szolgáltató összehasonlítás](#email-service-provider-comparison)
* [Hogyan működik](#how-does-it-work)
* [Technológiák](#technologies)
  * [Adatbázisok](#databases)
  * [Biztonság](#security)
  * [Postaládák](#mailboxes)
  * [Párhuzamosság](#concurrency)
  * [Biztonsági mentések](#backups)
  * [Keresés](#search)
  * [Projektek](#projects)
  * [Szolgáltatók](#providers)
* [Gondolatok](#thoughts)
  * [Elvek](#principles)
  * [Kísérletek](#experiments)
  * [Alternatívák hiánya](#lack-of-alternatives)
  * [Próbáld ki a Forward Emailt](#try-out-forward-email)


## Előszó {#foreword}

> \[!IMPORTANT]
> E-mail szolgáltatásunk [100%-ban nyílt forráskódú](https://github.com/forwardemail) és adatvédelmi szempontból fókuszált, biztonságos és titkosított SQLite postaládákat használ.

Amíg el nem indítottuk az [IMAP támogatást](/faq#do-you-support-receiving-email-with-imap), addig MongoDB-t használtunk az állandó adataink tárolására.

Ez a technológia csodálatos, és ma is használjuk – de ahhoz, hogy a MongoDB-vel titkosítást kapjunk az adatok tárolásakor, olyan szolgáltatót kell választani, amely MongoDB Enterprise-ot kínál, mint például a Digital Ocean vagy a Mongo Atlas – vagy meg kell vásárolni egy vállalati licencet (és ezután a sales csapat lassúságával kell dolgozni).

A [Forward Email](https://forwardemail.net) csapatának fejlesztőbarát, skálázható, megbízható és titkosított tárolási megoldásra volt szüksége az IMAP postaládákhoz. Nyílt forráskódú fejlesztőként egy olyan technológia használata, amelyhez licencdíjat kell fizetni a titkosítási funkcióért, ellentétes volt [elveinkkel](#principles) – ezért kísérleteztünk, kutattunk és egy teljesen új megoldást fejlesztettünk ki ezen igények kielégítésére.

Ahelyett, hogy egy megosztott adatbázist használnánk a postaládáid tárolására, egyénileg tároljuk és titkosítjuk a postaládáidat a jelszavaddal (amit csak te ismersz).  **E-mail szolgáltatásunk annyira biztonságos, hogy ha elfelejted a jelszavad, elveszíted a postaládádat** (és offline biztonsági mentésekből kell helyreállítanod vagy újrakezdened).

Olvass tovább, mert alaposan bemutatjuk az alábbiakat: [e-mail szolgáltató összehasonlítás](#email-service-provider-comparison), [hogyan működik a szolgáltatásunk](#how-does-it-work), [technológiai stackünk](#technologies) és még sok más.


## E-mail szolgáltató összehasonlítás {#email-service-provider-comparison}

Mi vagyunk az egyetlen 100%-ban nyílt forráskódú és adatvédelmi szempontból fókuszált e-mail szolgáltató, amely egyénileg titkosított SQLite postaládákat tárol, korlátlan domaineket, aliasokat és felhasználókat kínál, valamint támogatja a kimenő SMTP-t, IMAP-ot és POP3-at:

**Ellentétben más e-mail szolgáltatókkal, a Forward Email-nél nem kell domain vagy alias alapon fizetned a tárhelyért.**  A tárhely megosztott az egész fiókodban – tehát ha több egyedi domain neved és több aliasod van mindegyiken, akkor mi vagyunk a tökéletes megoldás számodra. Megjegyzés: ha szeretnéd, továbbra is érvényesíthetsz tárhelykorlátokat domain vagy alias alapon.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">E-mail szolgáltató összehasonlítás olvasása <i class="fa fa-search-plus"></i></a>


## Hogyan működik {#how-does-it-work}

1. Az e-mail klienseddel, például Apple Mail, Thunderbird, Gmail vagy Outlook segítségével – a felhasználóneveddel és jelszavaddal csatlakozol a biztonságos [IMAP](/faq#do-you-support-receiving-email-with-imap) szervereinkhez:

   * A felhasználóneved a teljes aliasod a domaineddel együtt, például `hello@example.com`.
   * A jelszavad véletlenszerűen generált, és csak 30 másodpercig jelenik meg, amikor rákattintasz a <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombra a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontban.
2. Miután csatlakoztál, az email kliensed [IMAP protokoll parancsokat](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) fog küldeni az IMAP szerverünkre, hogy szinkronban tartsa a postaládádat. Ez magában foglalja a piszkozat e-mailek írását és tárolását, valamint más műveleteket, amelyeket végezhetsz (pl. egy e-mail megjelölése Fontosként vagy Spam/Kéretlen levélként való megjelölése).

3. A levelező szerverek (közismert nevükön "MX" szerverek) fogadják az új bejövő e-maileket és tárolják azokat a postaládádban. Amikor ez megtörténik, az email kliensed értesítést kap és szinkronizálja a postaládádat. A levelező szervereink továbbíthatják az e-mailedet egy vagy több címzettnek (beleértve a [webhookokat](/faq#do-you-support-webhooks)), tárolhatják az e-mailedet az általunk biztosított titkosított IMAP tárolódban, **vagy akár mindkettőt**!

   > \[!TIP]
   > Érdekel többet megtudni? Olvasd el [hogyan állítsd be az email továbbítást](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hogyan működik a levelező szolgáltatásunk](/faq#how-does-your-email-forwarding-system-work), vagy nézd meg [útmutatóinkat](/guides).

4. A háttérben a biztonságos email tárolási rendszerünk két módon működik, hogy a postaládáid titkosítottak legyenek és csak te férhess hozzájuk:

   * Amikor új levelet kapsz egy feladótól, a levelező szervereink egy egyéni, ideiglenes és titkosított postaládába írnak neked.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Bejövő üzenet érkezett az aliasodhoz (pl. te@domaindod.hu).
         MX->>SQLite: Az üzenet egy ideiglenes postaládába kerül tárolásra.
         Note over MX,SQLite: Továbbítja a beállított további címzetteknek és webhookoknak.
         MX->>Sender: Siker!
     ```

   * Amikor az email klienseddel csatlakozol az IMAP szerverünkhöz, a jelszavad memóriában titkosítva kerül felhasználásra a postaládád olvasására és írására. A postaládádat csak ezzel a jelszóval lehet olvasni és írni. Ne feledd, hogy mivel csak neked van meg ez a jelszó, **csak te** férhetsz hozzá és írhatod a postaládádat, amikor használod azt. Amikor az email kliensed legközelebb megpróbál levelet lekérni vagy szinkronizálni, az új üzenetek átkerülnek ebből az ideiglenes postaládából és a megadott jelszóval titkosított valódi postaláda fájlba kerülnek tárolásra. Fontos, hogy ez az ideiglenes postaláda később törlésre és kiürítésre kerül, így csak a jelszóval védett postaládában maradnak meg az üzenetek.

   * **Ha IMAP-hoz vagy csatlakozva (pl. Apple Mail vagy Thunderbird email kliens használatával), akkor nincs szükség ideiglenes lemez tárolóra írni. Ehelyett a memóriában titkosított IMAP jelszó kerül lekérésre és felhasználásra. Valós időben, amikor egy üzenet kézbesítése történik, WebSocket kérést küldünk az összes IMAP szervernek, hogy van-e aktív munkamenet számodra (ez a lekérés része), majd ezt követően továbbítjuk a titkosított memóriában lévő jelszót – így nincs szükség ideiglenes postaládába írni, a valódi titkosított postaládádba írhatunk a titkosított jelszóval.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Csatlakozol az IMAP szerverhez email klienssel.
         IMAP->>SQLite: Átviszi az üzenetet az ideiglenes postaládából az aliasod postaládájába.
         Note over IMAP,SQLite: Az aliasod postaládája csak memóriában érhető el az IMAP jelszóval.
         SQLite->>IMAP: Lekéri az üzeneteket az email kliens kérésére.
         IMAP->>You: Siker!
     ```

5. [A titkosított postaládáid biztonsági mentései](#backups) naponta készülnek. Bármikor kérhetsz új biztonsági mentést, vagy letöltheted a legfrissebb mentést a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontból. Ha úgy döntesz, hogy másik email szolgáltatóra váltasz, akkor könnyedén migrálhatod, letöltheted, exportálhatod és törölheted a postaládáidat és biztonsági mentéseidet bármikor.


## Technológiák {#technologies}

### Adatbázisok {#databases}

Megvizsgáltunk más lehetséges adatbázis tároló rétegeket is, azonban egyik sem felelt meg annyira az igényeinknek, mint az SQLite:
| Adatbázis                                              |                                                                    Titkosítás nyugalmi állapotban                                                                   |  [Sandboxolt](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) postaládák  |                           Licenc                           | [Mindenhol Használt](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :---------------------------------------------------------: | :-----------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Igen a [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) segítségével                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                       |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Csak a MongoDB Enterprise verzióban elérhető"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relációs adatbázis                               |                   :x: AGPL és `SSPL-1.0`                   |                             :x:                               |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Csak hálózati titkosítás](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relációs adatbázis                               |                   :white_check_mark: `MIT`                  |                             :x:                               |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Nem tesztelt és még nem támogatott?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Nem tesztelt és még nem támogatott?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                               |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Igen](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relációs adatbázis                               | :white_check_mark: `PostgreSQL` (hasonló a `BSD` vagy `MIT`) |                             :x:                               |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Csak InnoDB-hez](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relációs adatbázis                               |          :white_check_mark: `GPLv2` és `BUSL-1.1`          |                             :x:                               |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Csak Enterprise funkció](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relációs adatbázis                               |                  :x: `BUSL-1.1` és mások                   |                             :x:                               |

> Itt található egy [blogbejegyzés, amely több SQLite adatbázis tárolási lehetőséget hasonlít össze](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) a fenti táblázatban.

### Biztonság {#security}

Minden esetben használunk [titkosítást nyugalmi állapotban](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [titkosítást átvitel közben](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") protokollt a :tangerine: [Tangerine](https://tangeri.ne) segítségével, valamint [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) titkosítást a postaládákon. Ezen felül token-alapú kétfaktoros hitelesítést alkalmazunk (szemben az SMS-sel, amely érzékeny a [man-in-the-middle támadásokra](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), forgatott SSH kulcsokat root hozzáférés letiltásával, kizárólagos hozzáférést a szerverekhez korlátozott IP-címeken keresztül, és még sok mást.
Egy [rosszindulatú szobalány támadás](https://en.wikipedia.org/wiki/Evil_maid_attack) vagy egy harmadik fél szolgáltatójának rosszindulatú alkalmazottja esetén **a postaládádat továbbra is csak a te általad generált jelszóval lehet megnyitni**. Nyugodj meg, nem támaszkodunk más harmadik fél szolgáltatókra, csak a Cloudflare, DataPacket, Digital Ocean, GitHub és Vultr SOC Type 2 megfelelőségi szerver szolgáltatóinkra.

Célunk, hogy minél kevesebb legyen az [egypontos hibák](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Postaládák {#mailboxes}

> **röviden;** Az IMAP szervereink egyénileg titkosított SQLite adatbázisokat használnak minden egyes postaládádhoz.

[Az SQLite egy rendkívül népszerű](https://www.sqlite.org/mostdeployed.html) beágyazott adatbázis – jelenleg a telefonodon és számítógépeden is fut – [és szinte minden nagyobb technológia használja](https://www.sqlite.org/famous.html).

Például a titkosított szervereinken van egy SQLite adatbázis postaláda `linux@example.com`, `info@example.com`, `hello@example.com` és így tovább – mindegyikhez egy `.sqlite` adatbázis fájl. Az adatbázis fájlokat nem az email cím alapján nevezzük el – helyette BSON ObjectID és egyedi UUID-ket használunk, amelyek nem árulják el, hogy kié a postaláda vagy melyik email címhez tartozik (pl. `353a03f21e534321f5d6e267.sqlite`).

Ezek az adatbázisok maguk is a te jelszavaddal vannak titkosítva (amit csak te ismersz) a [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) segítségével. Ez azt jelenti, hogy a postaládáid egyénileg titkosítottak, önállóak, [sandboxoltak](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) és hordozhatóak.

Finomhangoltuk az SQLite-ot a következő [PRAGMA](https://www.sqlite.org/pragma.html) beállításokkal:

| `PRAGMA`                 | Cél                                                                                                                                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite adatbázis titkosítás](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). További betekintésért lásd a `better-sqlite3-multiple-ciphers` projektet a [Projektek](#projects) alatt.                      |
| `key="****************"` | Ez a memóriában csak dekódolt jelszavad, amely az email kliensed IMAP kapcsolatán keresztül jut el a szerverünkre. Új adatbázis példányok jönnek létre és záródnak le minden olvasási és írási munkamenethez (a sandboxolás és izoláció biztosítása érdekében). |
| `journal_model=WAL`      | Írás-előtti napló ("[WAL](https://www.sqlite.org/wal.html)") [amely növeli a teljesítményt és lehetővé teszi az egyidejű olvasást](https://litestream.io/tips/#wal-journal-mode).                                                                         |
| `busy_timeout=5000`      | Megakadályozza az írási zárolási hibákat [amiközben más írások zajlanak](https://litestream.io/tips/#busy-timeout).                                                                                                                                         |
| `synchronous=NORMAL`     | Növeli a tranzakciók tartósságát [adatvesztés kockázata nélkül](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                          |
| `foreign_keys=ON`        | Biztosítja, hogy a külső kulcs hivatkozások (pl. egy tábla kapcsolat egy másikhoz) érvényesüljenek. [Alapértelmezés szerint ez nincs bekapcsolva az SQLite-ban](https://www.sqlite.org/foreignkeys.html), de az érvényesítés és adat integritás érdekében engedélyezni kell. |
| `encoding='UTF-8'`       | [Alapértelmezett kódolás](https://www.sqlite.org/pragma.html#pragma_encoding), amelyet a fejlesztői érthetőség biztosítására használunk.                                                                                                                |
> Minden egyéb alapértelmezett érték az SQLite-ból származik, az [hivatalos PRAGMA dokumentáció](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) szerint.

### Egyidejűség {#concurrency}

> **röviden;** A `WebSocket`-et használjuk az egyidejű olvasásokhoz és írásokhoz a titkosított SQLite postaládáidhoz.

#### Olvasások {#reads}

A telefonodon lévő e-mail kliensed az `imap.forwardemail.net` címet a Digital Ocean egyik IP-címére oldhatja fel – míg az asztali kliensed egy teljesen más [szolgáltató](#providers) IP-címét is feloldhatja.

Függetlenül attól, hogy melyik IMAP szerverhez csatlakozik az e-mail kliensed, azt szeretnénk, hogy a kapcsolat valós időben, 100%-os pontossággal olvasson az adatbázisodból. Ezt WebSocketeken keresztül valósítjuk meg.

#### Írások {#writes}

Az adatbázisba írás kicsit más – mivel az SQLite beágyazott adatbázis, és a postaládád alapértelmezés szerint egyetlen fájlban él.

Megvizsgáltunk olyan lehetőségeket, mint a `litestream`, `rqlite` és `dqlite` – azonban egyik sem felelt meg az igényeinknek.

Az írások végrehajtásához, a write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") engedélyezésével – biztosítanunk kell, hogy csak egy szerver ("Elsődleges") legyen felelős ezért. A [WAL](https://www.sqlite.org/wal.html) drasztikusan felgyorsítja az egyidejűséget, és lehetővé teszi egy író és több olvasó működését.

Az Elsődleges a titkosított postaládákat tartalmazó csatolt kötetekkel rendelkező adat szervereken fut. Elosztási szempontból az `imap.forwardemail.net` mögötti összes egyedi IMAP szervert másodlagos szervereknek ("Másodlagos") tekintheted.

Kétirányú kommunikációt valósítunk meg [WebSocketekkel](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Az Elsődleges szerverek a [ws](https://github.com/websockets/ws) `WebSocketServer` szerver példányát használják.
* A Másodlagos szerverek a [ws](https://github.com/websockets/ws) `WebSocket` kliens példányát használják, amelyet a [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) és a [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) csomagokkal burkolnak. Ezek a két burkoló biztosítja, hogy a `WebSocket` újracsatlakozzon, és képes legyen adatokat küldeni és fogadni az adott adatbázis-írásokhoz.

### Biztonsági mentések {#backups}

> **röviden;** A titkosított postaládáid biztonsági mentése naponta készül. Azonnal kérhetsz új biztonsági mentést, vagy bármikor letöltheted a legfrissebbet a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Tartományok</a> <i class="fa fa-angle-right"></i> Átirányítások menüpontból.

A biztonsági mentésekhez egyszerűen futtatjuk az SQLite `VACUUM INTO` parancsot minden nap az IMAP parancs feldolgozása közben, amely kihasználja a titkosított jelszavadat egy memóriabeli IMAP kapcsolaton keresztül. A biztonsági mentések akkor készülnek, ha nincs meglévő mentés, vagy ha a fájl [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash értéke megváltozott az utolsó mentéshez képest.

Megjegyzendő, hogy a `VACUUM INTO` parancsot használjuk a beépített `backup` parancs helyett, mert ha egy oldal módosul a `backup` parancs végrehajtása közben, akkor újra kell kezdeni. A `VACUUM INTO` parancs egy pillanatképet készít. Erről további információkat találsz ezekben a kommentekben a [GitHubon](https://github.com/benbjohnson/litestream.io/issues/56) és a [Hacker News-on](https://news.ycombinator.com/item?id=31387556).

Továbbá a `VACUUM INTO`-t használjuk a `backup` helyett, mert a `backup` parancs ideiglenesen titkosítatlanul hagyná az adatbázist, amíg a `rekey` meg nem történik (erről bővebben ebben a GitHub [kommentben](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)).

A Másodlagos a `WebSocket` kapcsolaton keresztül utasítja az Elsődleges szervert a biztonsági mentés végrehajtására – az Elsődleges pedig megkapja a parancsot, és ezt követően:

1. Csatlakozik a titkosított postaládádhoz.
2. Írási zárolást szerez.
3. Lefuttat egy WAL ellenőrzőpontot a `wal_checkpoint(PASSIVE)` segítségével.
4. Lefuttatja az SQLite `VACUUM INTO` parancsot.
5. Ellenőrzi, hogy a másolt fájl megnyitható-e a titkosított jelszóval (biztonsági ellenőrzés).
6. Feltölti a Cloudflare R2 tárhelyre (vagy a megadott saját szolgáltatódhoz).
<!--
7. Tömörítse a létrejött biztonsági mentési fájlt `gzip`-pel.
8. Töltse fel tárolásra a Cloudflare R2-be (vagy a megadott saját szolgáltatójához).
-->

Ne feledje, hogy a postaládái titkosítva vannak – és bár IP-korlátozásokat és egyéb hitelesítési intézkedéseket alkalmazunk a WebSocket kommunikációhoz – rosszindulatú szereplő esetén biztos lehet benne, hogy ha a WebSocket terhelés nem tartalmazza az IMAP jelszavát, akkor nem tudja megnyitni az adatbázisát.

Jelenleg postaládánként csak egy biztonsági mentés tárolódik, de a jövőben lehet, hogy kínálunk időpontra visszaállítást ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Keresés {#search}

IMAP szervereink támogatják a `SEARCH` parancsot összetett lekérdezésekkel, reguláris kifejezésekkel és egyebekkel.

A gyors keresési teljesítmény a [FTS5](https://www.sqlite.org/fts5.html) és a [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) használatának köszönhető.

A `Date` értékeket az SQLite postaládákban [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formátumú karakterláncként tároljuk a [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) segítségével (UTC időzónával, hogy az egyenlőség-összehasonlítások megfelelően működjenek).

Indexek is tárolódnak minden olyan tulajdonságra, amely keresési lekérdezésekben szerepel.

### Projektek {#projects}

Az alábbi táblázat a forráskódunkban és fejlesztési folyamatunkban használt projekteket mutatja be (ábécé sorrendben):

| Projekt                                                                                       | Cél                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | DevOps automatizációs platform, amely megkönnyíti a szerverparkunk karbantartását, skálázását és kezelését.                                                                                                                                                                                                                                                       |
| [Bree](https://github.com/breejs/bree)                                                        | Feladatütemező Node.js és JavaScript számára, cron, dátumok, ms, later és emberbarát támogatással.                                                                                                                                                                                                                                                                |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Fejlesztőbarát JavaScript és Node.js naplózó könyvtár, biztonság és adatvédelem szem előtt tartásával.                                                                                                                                                                                                                                                             |
| [Lad](https://github.com/ladjs/lad)                                                           | Node.js keretrendszer, amely az egész architektúránkat és mérnöki tervezésünket működteti MVC-vel és egyebekkel.                                                                                                                                                                                                                                                   |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL adatbázis megoldás, amelyet minden egyéb adat (például fiókja, beállítások, domainek és alias konfigurációk) tárolására használunk a postaládákon kívül.                                                                                                                                                                                                     |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB objektum dokumentum modellező ("ODM"), amelyet az egész stackünkben használunk. Külön segédfüggvényeket írtunk, amelyek lehetővé teszik, hogy egyszerűen folytathassuk a **Mongoose használatát SQLite-tal** :tada:                                                                                                                                          |
| [Node.js](https://nodejs.org/en)                                                              | A Node.js nyílt forráskódú, platformok közötti JavaScript futtatókörnyezet, amely az összes szerverfolyamatunkat futtatja.                                                                                                                                                                                                                                         |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Node.js csomag e-mailek küldésére, kapcsolatok létrehozására és egyebekre. Hivatalos támogatója vagyunk ennek a projektnek.                                                                                                                                                                                                                                       |
| [Redis](https://redis.io/)                                                                    | Memóriában futó adatbázis gyorsítótárazáshoz, publish/subscribe csatornákhoz és DNS over HTTPS kérésekhez.                                                                                                                                                                                                                                                        |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Titkosítási kiterjesztés SQLite-hoz, amely lehetővé teszi az egész adatbázis fájlok titkosítását (beleértve az írási előnapló ("[WAL](https://www.sqlite.org/wal.html)"), napló, visszavonás, …).                                                                                                                                                                      |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Vizualizált SQLite szerkesztő (amit Ön is használhat), fejlesztési postaládák tesztelésére, letöltésére és megtekintésére.                                                                                                                                                                                                                                         |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Beágyazott adatbázis réteg skálázható, önálló, gyors és ellenálló IMAP tároláshoz.                                                                                                                                                                                                                                                                                 |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Node.js alapú antispam, e-mail szűrő és adathalászat elleni eszköz (alternatívánk a [Spam Assassin](https://spamassassin.apache.org/) és [rspamd](https://github.com/rspamd/rspamd) helyett).                                                                                                                                                                         |
| [Tangerine](https://tangeri.ne)                                                               | DNS over HTTPS kérések Node.js-sel és Redis gyorsítótárazással – amely globális konzisztenciát és még sok mást biztosít.                                                                                                                                                                                                                                         |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Fejlesztői csapatunk ezt használja (és ajánlja is) mint **a Forward Email-hez ajánlott e-mail kliens**.                                                                                                                                                                                                                                                           |
| [UTM](https://github.com/utmapp/UTM)                                                          | Fejlesztői csapatunk ezt használja virtuális gépek létrehozására iOS és macOS rendszerekhez, hogy párhuzamosan tesztelhessük különböző e-mail klienseket az IMAP és SMTP szervereinkkel.                                                                                                                                                                            |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Modern, nyílt forráskódú Linux-alapú szerver operációs rendszer, amely az egész infrastruktúránkat működteti.                                                                                                                                                                                                                                                     |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | IMAP szerver könyvtár – lásd megjegyzéseit az [melléklet duplikáció eltávolításáról](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) és az [IMAP protokoll támogatásáról](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                               |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Gyors és egyszerű API könyvtár Node.js-hez, amely programozottan kezeli az SQLite3-at.                                                                                                                                                                                                                                                                              |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Fejlesztőbarát e-mail keretrendszer egyedi e-mailek létrehozásához, előnézetéhez és küldéséhez (pl. fiók értesítések és egyebek).                                                                                                                                                                                                                                   |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL lekérdezés építő Mongo-stílusú szintaxissal. Ez időt takarít meg fejlesztői csapatunknak, mivel az egész stackben Mongo-stílusban írhatunk adatbázis független megközelítéssel. **Segít elkerülni az SQL injekciós támadásokat is lekérdezési paraméterek használatával.**                                                                                     |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL eszköz meglévő adatbázis sémák információinak kinyerésére. Ez lehetővé teszi számunkra, hogy könnyen ellenőrizzük, hogy minden index, tábla, oszlop, megszorítás és egyéb érvényes és `1:1` megfelel annak, amilyennek lennie kell. Automatikus segédfüggvényeket is írtunk új oszlopok és indexek hozzáadására, ha változások történnek az adatbázis sémákban (rendkívül részletes hibajelzéssel). |
| [knex](https://github.com/knex/knex)                                                          | SQL lekérdezés építő, amelyet csak adatbázis migrációkhoz és séma ellenőrzéshez használunk a `knex-schema-inspector` segítségével.                                                                                                                                                                                                                                |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatikus [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) kifejezés fordítás Markdown támogatással a [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) használatával.                                                                                                                           |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Node.js csomag MX szerverek feloldására és kapcsolatok létrehozására, valamint hibakezelésre.                                                                                                                                                                                                                                                                      |
| [pm2](https://github.com/Unitech/pm2)                                                         | Node.js termelési folyamatkezelő beépített terheléselosztóval ([finomhangolva](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) a teljesítmény érdekében).                                                                                                                                                                                       |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | SMTP szerver könyvtár – ezt használjuk a levelezési ("MX") és kimenő SMTP szervereinkhez.                                                                                                                                                                                                                                                                          |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Hasznos eszköz IMAP szerverek tesztelésére benchmarkok és RFC specifikáció szerinti IMAP protokoll kompatibilitás ellenőrzésére. Ezt a projektet a [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) csapata hozta létre (egy aktív nyílt forráskódú IMAP és POP3 szerver 2002 júliusa óta). Ezzel az eszközzel alaposan teszteltük az IMAP szerverünket.
> Más projekteket, amelyeket használunk, megtalálhat [a forráskódunkban a GitHubon](https://github.com/forwardemail).

### Szolgáltatók {#providers}

| Szolgáltató                                     | Cél                                                                                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS szolgáltató, egészségügyi ellenőrzések, terheléselosztók és biztonsági mentés tárolása a [Cloudflare R2](https://developers.cloudflare.com/r2) használatával. |
| [GitHub](https://github.com/)                   | Forráskód tárolás, CI/CD és projektmenedzsment.                                                                             |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikált szerver hoszting és kezelt adatbázisok.                                                                             |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Dedikált szerver hoszting.                                                                                                   |
| [DataPacket](https://www.datapacket.com)        | Dedikált szerver hoszting.                                                                                                   |


## Gondolatok {#thoughts}

### Elvek {#principles}

A Forward Email az alábbi elvek szerint készült:

1. Mindig legyen fejlesztőbarát, biztonság- és adatvédelmi fókuszú, valamint átlátható.
2. Tartsa be az [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam borotvája](https://en.wikipedia.org/wiki/Occam%27s_razor) és a [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) elveket.
3. Célcsoport a szívós, saját erőből induló és [ramen-profitos](http://www.paulgraham.com/ramenprofitable.html) fejlesztő.

### Kísérletek {#experiments}

> **röviden;** Végül az S3-kompatibilis objektumtároló és/vagy a Virtuális Táblák használata technikailag nem kivitelezhető teljesítménybeli okok miatt, és memóriakorlátok miatt hibákra hajlamos.

Néhány kísérletet végeztünk a fent említett végleges SQLite megoldás előtt.

Egyik ilyen volt az [rclone]() és az SQLite együttes használata egy S3-kompatibilis tárolóréteggel.

Ez a kísérlet segített jobban megérteni és felfedezni az rclone, SQLite és a [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) használatával kapcsolatos szélsőséges eseteket:

* Ha engedélyezi az `--vfs-cache-mode writes` kapcsolót az rclone-nál, akkor az olvasások rendben lesznek, viszont az írások gyorsítótárazva lesznek.
  * Ha több globálisan elosztott IMAP szervere van, akkor a gyorsítótár nem lesz szinkronban közöttük, hacsak nincs egyetlen író és több hallgató (pl. pub/sub megközelítés).
  * Ez rendkívül bonyolult, és bármilyen további komplexitás hozzáadása több egyedi hibapontot eredményez.
  * Az S3-kompatibilis tárolók nem támogatják a részleges fájl módosításokat – ami azt jelenti, hogy a `.sqlite` fájl bármilyen változása az adatbázis teljes újrafeltöltését eredményezi.
  * Léteznek más megoldások, mint az `rsync`, de ezek nem fókuszálnak az előírásos napló ("[WAL](https://www.sqlite.org/wal.html)") támogatására – ezért végül a Litestreamet vizsgáltuk meg. Szerencsére az általunk használt titkosítás már titkosítja a [WAL](https://www.sqlite.org/wal.html) fájlokat, így nem kell a Litestreamre támaszkodnunk ebben. Azonban még nem voltunk teljesen biztosak a Litestream éles használatában, erről lentebb néhány megjegyzés található.
  * Az `--vfs-cache-mode writes` opció használata (az *egyetlen* mód az SQLite írására `rclone` felett) megpróbálja az egész adatbázist memóriában újra másolni – egy 10 GB-os postaláda kezelése még OK, de több nagy tárolású postaláda esetén az IMAP szerverek memóriakorlátokba ütköznek, `ENOMEM` hibák, szegmentációs hibák és adatkorruptáció léphet fel.
* Ha megpróbálja használni az SQLite [Virtuális Táblákat](https://www.sqlite.org/vtab.html) (pl. [s3db](https://github.com/jrhy/s3db) használatával) az adatok S3-kompatibilis tárolón való élő tárolására, akkor több további problémába ütközik:
  * Az olvasás és írás rendkívül lassú lesz, mivel az S3 API végpontokat HTTP `GET`, `PUT`, `HEAD` és `POST` metódusokkal kell elérni.
  * Fejlesztési tesztek azt mutatták, hogy 500K-1M+ rekord felett a fiber interneten is az S3-kompatibilis szolgáltatók írási és olvasási áteresztőképessége korlátozza a teljesítményt. Például fejlesztőink `for` ciklusokat futtattak szekvenciális SQL `INSERT` utasításokra és nagy mennyiségű adat tömeges írására is. Mindkét esetben a teljesítmény rendkívül lassú volt.
  * A virtuális táblák **nem tartalmazhatnak indexeket**, `ALTER TABLE` utasításokat és [egyéb](https://stackoverflow.com/a/12507650) [korlátozásokat](https://sqlite.org/lang_createvtab.html) – ami 1-2 perces vagy annál hosszabb késéseket eredményez az adatmennyiségtől függően.
  * Az objektumok titkosítatlanul voltak tárolva, és nincs natív titkosítási támogatás.
* Megvizsgáltuk az [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) használatát is, amely koncepcionálisan és technikailag hasonló az előző ponthoz (így ugyanazokkal a problémákkal rendelkezik). Egy lehetőség lehet egy egyedi `sqlite3` build használata titkosítással, például a [wxSQLite3](https://github.com/utelle/wxsqlite3) (amit jelenleg is használunk a fent említett megoldásban) segítségével, a [setup fájl szerkesztésével](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Egy másik lehetséges megközelítés a [multiplex kiterjesztés](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c) használata volt, de ennek 32 GB-os korlátja van, és bonyolult építési és fejlesztési problémákat okozna.
* `ALTER TABLE` utasításokra szükség van (ez teljesen kizárja a Virtuális Táblák használatát). Szükségünk van `ALTER TABLE` utasításokra, hogy a `knex-schema-inspector` hook megfelelően működjön – ez biztosítja, hogy az adatok ne sérüljenek, és a lekért sorok érvényes dokumentumokká konvertálhatók legyenek a `mongoose` séma definícióink szerint (beleértve a megszorításokat, változó típusokat és tetszőleges adatellenőrzést).
* Az összes S3-kompatibilis SQLite projektek az open-source közösségben szinte kizárólag Pythonban vannak (nem JavaScriptben, amit mi a teljes stack-ünkben használunk).
* Olyan tömörítő könyvtárak, mint a [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (lásd [hozzászólások](https://news.ycombinator.com/item?id=32303762)) ígéretesek, de [lehet, hogy még nem alkalmasak éles használatra](https://github.com/phiresky/sqlite-zstd#usage). Ehelyett az alkalmazásoldali tömörítés `String`, `Object`, `Map`, `Array`, `Set` és `Buffer` adattípusokra tisztább és könnyebb megoldás lesz (és könnyebb migrálni is, mivel tárolhatunk egy `Boolean` jelzőt vagy oszlopot – vagy akár használhatjuk a `PRAGMA` `user_version=1` tömörítéshez vagy `user_version=0` tömörítés nélkül adatbázis metaadatként).
  * Szerencsére már megvalósítottuk a mellékletek duplikációmentesítését az IMAP szerver tárolásában – így minden azonos mellékletű üzenet nem tárol külön másolatot, hanem egyetlen mellékletet tárolunk több üzenet és szál számára egy postaládában (és idegen hivatkozást használunk).
* A Litestream projekt, amely egy SQLite replikációs és biztonsági mentési megoldás, nagyon ígéretes, és valószínűleg a jövőben használni fogjuk.
  * Nem akarjuk a szerző(k) munkáját lekicsinyelni – mert nagyon szeretjük a munkájukat és hozzájárulásaikat az open-source-hoz több mint egy évtizede – de a valós használat alapján úgy tűnik, hogy [sok fejfájást okozhat](https://github.com/benbjohnson/litestream/issues) és [potenciális adatvesztés is előfordulhat](https://github.com/benbjohnson/litestream/issues/218).
* A biztonsági mentések visszaállítása súrlódásmentes és egyszerű kell legyen. Olyan megoldások használata, mint a MongoDB `mongodump` és `mongoexport` nemcsak fárasztó, hanem időigényes és konfigurációs bonyodalmakat okoz.
  * Az SQLite adatbázisok egyszerűek (egyetlen fájl).
  * Olyan megoldást akartunk tervezni, ahol a felhasználók bármikor elvihetik a postaládájukat.
    * Egyszerű Node.js parancsok, mint az `fs.unlink('mailbox.sqlite')`, és az véglegesen törlődik a lemezről.
    * Hasonlóképpen használhatunk S3-kompatibilis API-t HTTP `DELETE` metódussal a pillanatképek és biztonsági mentések egyszerű törléséhez a felhasználók számára.
  * Az SQLite volt a legegyszerűbb, leggyorsabb és leggazdaságosabb megoldás.
### Alternatívák hiánya {#lack-of-alternatives}

Tudomásunk szerint más e-mail szolgáltatások nem így vannak tervezve, és nem is nyílt forráskódúak.

Úgy *gondoljuk, hogy ennek oka lehet*, hogy a meglévő e-mail szolgáltatások örökölt technológiát használnak éles környezetben, [spagetti kóddal](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

A legtöbb, ha nem az összes meglévő e-mail szolgáltató vagy zárt forráskódú, vagy nyílt forráskódúnak hirdeti magát, **de valójában csak a front-endjük nyílt forráskódú.**

**Az e-mail legérzékenyebb része** (a tényleges tárolás/IMAP/SMTP interakció) **mind a back-end-en (szerveren) történik, és *nem* a front-end-en (kliensen).**

### Próbáld ki a Forward Emailt {#try-out-forward-email}

Regisztrálj még ma a <https://forwardemail.net> oldalon! :rocket:
