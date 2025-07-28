# Kvantumálló e-mail: Hogyan használjuk a titkosított SQLite postafiókokat az e-mailek biztonságának megőrzése érdekében {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lusta" src="/img/articles/quantum.webp" alt="" class="lekerekített-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Előszó](#foreword)
* [E-mail szolgáltatók összehasonlítása](#email-service-provider-comparison)
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
  * [Alapelvek](#principles)
  * [Kísérletek](#experiments)
  * [Alternatívák hiánya](#lack-of-alternatives)
  * [Próbálja ki az E-mail továbbítását](#try-out-forward-email)

## Előszó {#foreword}

> \[!IMPORTANT]
> Our email service is [100% open-source](https://github.com/forwardemail) and privacy-focused through secure and encrypted SQLite mailboxes.

A [IMAP-támogatás](/faq#do-you-support-receiving-email-with-imap) elindítása előtt a MongoDB-t használtuk az állandó adattárolási igényeinkre.

Ez a technológia lenyűgöző, és még ma is használjuk – de ahhoz, hogy a MongoDB-vel inaktív titkosítást használjunk, olyan szolgáltatót kell használnunk, amely MongoDB Enterprise-t kínál, például a Digital Oceant vagy a Mongo Atlast – vagy vállalati licencet kell fizetnünk (és ennek következtében az értékesítési csapat késleltetésével kell foglalkoznunk).

A [E-mail továbbítása](https://forwardemail.net) csapatunknak egy fejlesztőbarát, skálázható, megbízható és titkosított tárolási megoldásra volt szüksége az IMAP postaládákhoz. Nyílt forráskódú fejlesztőkként a [alapelveink](#principles) ellentmondott egy olyan technológia használatának, amelyhez licencdíjat kell fizetni a titkosítás inaktív állapotban funkció használatáért – ezért kísérleteztünk, kutattunk és a nulláról fejlesztettünk ki egy új megoldást ezen igények kielégítésére.

Ahelyett, hogy megosztott adatbázisban tárolnánk a postaládáit, azokat egyenként tároljuk és titkosítjuk a jelszavával (amelyet csak Ön birtokol). **E-mail szolgáltatásunk olyan biztonságos, hogy ha elfelejti jelszavát, akkor elveszíti postaládáját** (és offline biztonsági mentésekkel kell helyreállítania, vagy újra kell kezdenie az egész folyamatot).

Olvasson tovább, mivel alább mélyebben belemerülünk egy [e-mail szolgáltatók összehasonlítása](#email-service-provider-comparison), [hogyan működik a szolgáltatásunk](#how-does-it-work), [a technológiai rendszerünk](#technologies) és további tartalommal.

## E-mail szolgáltatók összehasonlítása {#email-service-provider-comparison}

Mi vagyunk az egyetlen 100%-ban nyílt forráskódú és adatvédelmet szem előtt tartó e-mail szolgáltató, amely egyedileg titkosított SQLite postafiókokat tárol, korlátlan számú domaint, aliast és felhasználót kínál, valamint támogatja a kimenő SMTP, IMAP és POP3 e-maileket:

**Más e-mail szolgáltatókkal ellentétben a Forward Email esetében nem kell domainenként vagy aliasonként fizetni a tárhelyért.** A tárhely a teljes fiókod között megosztott – tehát ha több egyéni domainneved és mindegyikhez több aliasod van, akkor mi vagyunk a tökéletes megoldás számodra. Fontos megjegyezni, hogy továbbra is beállíthatsz tárhelykorlátokat domainenként vagy aliasonként.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Olvassa el az e-mail szolgáltatások összehasonlítását <i class="fa fa-search-plus"></i></a>

## Hogyan működik {#how-does-it-work}

1. E-mail kliens, például Apple Mail, Thunderbird, Gmail vagy Outlook használatával – felhasználónevével és jelszavával csatlakozik biztonságos [IMAP](/faq#do-you-support-receiving-email-with-imap) szervereinkhez:

* A felhasználóneved a domainedhez tartozó teljes aliasod, például `hello@example.com`.
* A jelszavad véletlenszerűen generálódik, és csak 30 másodpercig jelenik meg számodra, amikor a <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> lehetőségre kattintasz a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontból.

2. A csatlakozás után az e-mail kliens a következőt küldi el az IMAP szerverünknek: [IMAP protokollparancsok](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), hogy a postaládád szinkronban maradjon. Ez magában foglalja az e-mailek piszkozatainak írását és tárolását, valamint egyéb műveleteket, amelyeket elvégezhetsz (pl. egy e-mail megjelölése fontosként vagy egy e-mail megjelölése spamként/levélszemétként).

3. A levelezőszerverek (közismert nevén „MX” szerverek) fogadják az új bejövő e-maileket, és tárolják azokat a postaládádban. Amikor ez megtörténik, az e-mail kliens értesítést kap, és szinkronizálja a postaládádat. Levelezőszervereink képesek továbbítani az e-maileket egy vagy több címzettnek (beleértve a [webhookok](/faq#do-you-support-webhooks) címzettet is), tárolni az e-maileket az Ön titkosított IMAP tárhelyén nálunk, **vagy mindkettőt**!

> \[!TIP]
> Érdekli a további információk megszerzése? Olvassa el a [hogyan kell beállítani az e-mail továbbítást](/faq#how-do-i-get-started-and-set-up-email-forwarding), [hogyan működik a levélváltási szolgáltatásunk](/faq#how-does-your-email-forwarding-system-work), vagy tekintse meg a [kalauzaink](/guides) oldalt.

4. A színfalak mögött biztonságos e-mail-tárolási megoldásunk kétféleképpen működik, hogy postaládái titkosítva legyenek, és csak Ön férhessen hozzájuk:

* Amikor új levelet kapsz egy feladótól, levelezőszervereink egy egyedi, ideiglenes és titkosított postafiókba írják az e-mailt.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Amikor levelezőprogramjával csatlakozik az IMAP-kiszolgálónkhoz, jelszavát a memóriában titkosítjuk, és a postaládájába való írásra és olvasásra használjuk. A postaládájából csak ezzel a jelszóval lehet olvasni és írni. Ne feledje, hogy mivel Ön az egyetlen, aki rendelkezik ezzel a jelszóval, **csak Ön** tudja olvasni és írni a postaládáját, amikor hozzáfér hozzá. Amikor a levelezőprogram legközelebb megpróbál leveleket lekérdezni vagy szinkronizálni, az új üzenetei ebből az ideiglenes postaládából kerülnek át, és a megadott jelszóval tárolódnak a tényleges postaládafájlban. Vegye figyelembe, hogy ez az ideiglenes postaláda utána törlődik, így csak a jelszóval védett postaládájában találhatók meg az üzenetek.

* **Ha IMAP-hoz csatlakozol (pl. egy e-mail klienst, például Apple Mailt vagy Thunderbirdet használsz), akkor nem kell ideiglenes lemezre írnunk. Ehelyett a memóriában tárolt titkosított IMAP-jelszavadat kérjük le és használjuk. Valós időben, amikor egy üzenetet megpróbálunk kézbesíteni neked, egy WebSocket kérést küldünk az összes IMAP-kiszolgálónak, megkérdezve tőlük, hogy van-e aktív munkamenetük az számodra (ez a lekérés része), majd ezt követően továbbítjuk ezt a titkosított, memóriában tárolt jelszót – így nem kell egy ideiglenes postaládába írnunk, hanem a tényleges titkosított postaládádba írhatunk a titkosított jelszavaddal.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Titkosított postaládáinak biztonsági mentései](#backups) naponta készül. Bármikor kérhet új biztonsági mentést, vagy letöltheti a legújabb biztonsági mentést a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontból. Ha úgy dönt, hogy másik e-mail szolgáltatásra vált, bármikor könnyedén migrálhatja, letöltheti, exportálhatja és törölheti postaládáit és biztonsági mentéseit.

## Technológiák {#technologies}

### Adatbázisok {#databases}

Más lehetséges adatbázis-tárolási rétegeket is megvizsgáltunk, de egyik sem elégítette ki annyira az igényeinket, mint az SQLite:

| Adatbázis | Inaktív titkosítás | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postaládák | Engedély | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :csillag: | :white_check_mark: Igen, [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) címmel | :fehér_pipa_jel: | :white_check_mark: Közkincs | :fehér_pipa_jel: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relációs adatbázis | :x: AGPL és `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relációs adatbázis | :white_check_mark: __CELLA_KÓD_0__ | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: __CELLA_KÓD_0__ | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relációs adatbázis | :white_check_mark: `PostgreSQL` (hasonlóan a `BSD` vagy `MIT`-hoz) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relációs adatbázis | :white_check_mark: `GPLv2` és `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relációs adatbázis | :x: `BUSL-1.1` és mások | :x: |

> Itt egy [blogbejegyzés, amely összehasonlítja a különböző SQLite adatbázis-tárolási lehetőségeket](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) a fenti táblázatban.

### Biztonság {#security}

Mindenkor [titkosítás inaktív állapotban](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [átvitel közbeni titkosítás](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS HTTPS-en keresztül](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") titkosítást használunk a postaládákon :tangerine: [Mandarin](https://tangeri.ne), és [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) titkosítással. Ezenkívül token alapú kétfaktoros hitelesítést (szemben az SMS-sel, amely gyanús a [közbeavatkozó támadások](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)-ra), rotált SSH-kulcsokat használunk letiltott root hozzáféréssel, kizárólagos hozzáférést a szerverekhez korlátozott IP-címeken keresztül és egyebeket.

Amennyiben egy [gonosz szobalány támadás](https://en.wikipedia.org/wiki/Evil_maid_attack) vagy harmadik féltől származó alkalmazott hibázik, **a postaládája továbbra is csak az Ön által generált jelszóval nyitható meg**. Biztosíthatjuk, hogy nem támaszkodunk harmadik féltől származó szolgáltatókra, kivéve a SOC Type 2 panaszkiszolgáló-szolgáltatóinkat, mint például a Cloudflare, a DataPacket, a Digital Ocean és a Vultr.

A célunk, hogy a lehető legkevesebb [egyetlen meghibásodási pont](https://en.wikipedia.org/wiki/Single_point_of_failure) legyen.

### Postaládák {#mailboxes}

> **tldr;** IMAP-szervereink minden egyes postaládájához külön-külön titkosított SQLite adatbázisokat használnak.

[Az SQLite egy rendkívül népszerű](https://www.sqlite.org/mostdeployed.html) beágyazott adatbázis – jelenleg a telefonján és a számítógépén fut – [és szinte minden nagyobb technológia használja](https://www.sqlite.org/famous.html).

Például a titkosított szervereinken van egy SQLite adatbázis postafiók a `linux@example.com`, `info@example.com`, `hello@example.com` és így tovább fájlokhoz – mindegyikhez egy-egy `.sqlite` adatbázisfájlként. Az adatbázisfájlokat nem az e-mail címmel nevezzük el – ehelyett BSON ObjectID-t és egyedi UUID-kat használunk, amelyek nem osztják meg, hogy kihez tartozik a postafiók, vagy melyik e-mail cím alatt található (pl. `353a03f21e534321f5d6e267.sqlite`).

Ezen adatbázisok mindegyike titkosítva van a jelszavaddal (amelyet csak te birtokolsz) a [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) segítségével. Ez azt jelenti, hogy a postaládáid egyenként titkosítottak, önállóak ([homokozóban](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) és hordozhatóak.

A következő [PRAGMA](https://www.sqlite.org/pragma.html) értékkel finomhangoltuk az SQLite-ot:

| `PRAGMA` | Cél |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). További információkért lásd a `better-sqlite3-multiple-ciphers` kódot a [Projects](#projects) alatt. |
| `key="****************"` | Ez a visszafejtett, csak memóriában tárolt jelszava, amely az e-mail kliens IMAP-kapcsolatán keresztül jut el a szerverünkhöz. Minden olvasási és írási munkamenethez új adatbázis-példányok jönnek létre és záródnak be (a sandboxing és az izoláció biztosítása érdekében). |
| `journal_model=WAL` | Előreírt napló ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Megakadályozza az írászárolási hibákat [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Növeli a tranzakciók tartósságát [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Kikényszeríti az idegen kulcshivatkozások (pl. egy tábla és egy másik közötti reláció) kikényszerítését. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), de az érvényesítés és az adatintegritás érdekében engedélyezni kell. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) a fejlesztői józanság biztosítása érdekében. |

> Minden más alapértelmezett érték az SQLite-ból származik, a [hivatalos PRAGMA dokumentáció](https://www.sqlite.org/pragma.html#pragma_auto_vacuum) fájlban meghatározottak szerint.

### Párhuzamosság {#concurrency}

> **tldr;** A `WebSocket` kódot használjuk a titkosított SQLite postaládák egyidejű olvasásához és írásához.

#### Olvasások: {#reads}

Előfordulhat, hogy a telefonodon lévő e-mail kliens a `imap.forwardemail.net` címet a Digital Ocean egyik IP-címünkre értelmezi – az asztali kliens pedig egy teljesen más [szolgáltató](#providers) címről származó, különálló IP-címet értelmez.

Függetlenül attól, hogy melyik IMAP-kiszolgálóhoz csatlakozik az e-mail kliens, azt szeretnénk, hogy a kapcsolat valós időben, 100%-os pontossággal olvassa be az adatbázisból az adatokat. Ezt WebSockets-en keresztül végezzük.

#### Írja a következőt: {#writes}

Az adatbázisba írás egy kicsit más – mivel az SQLite egy beágyazott adatbázis, és a postaládád alapértelmezés szerint egyetlen fájlban található.

Olyan lehetőségeket vizsgáltunk meg, mint a `litestream`, `rqlite` és `dqlite`, azonban egyik sem felelt meg az igényeinknek.

Ahhoz, hogy az írási műveleteket engedélyezett írási naplózással ("[WAL](https://www.sqlite.org/wal.html)") lehessen végrehajtani, biztosítanunk kell, hogy csak egy szerver ("Elsődleges") legyen felelős ezért. A [WAL](https://www.sqlite.org/wal.html) jelentősen felgyorsítja a párhuzamos működést, és egy írót és több olvasót tesz lehetővé.

Az Elsődleges szerver azokon az adatszervereken fut, amelyekhez a titkosított postaládákat tartalmazó csatlakoztatott kötetek tartoznak. Terjesztési szempontból a `imap.forwardemail.net` mögötti összes egyedi IMAP-szerver másodlagos szervernek („Másodlagos”) tekinthető.

Kétirányú kommunikációt valósítunk meg a [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) segítségével:

* Az elsődleges szerverek a [ws](https://github.com/websockets/ws) `WebSocketServer` szerverének egy példányát használják.

* A másodlagos szerverek a [ws](https://github.com/websockets/ws) `WebSocket` kliensének egy példányát használják, amely a [websocket-ahogy-ígért](https://github.com/vitalets/websocket-as-promised) és a [újracsatlakozó websocket](https://github.com/opensumi/reconnecting-websocket) csomagokban található. Ez a két csomagoló biztosítja, hogy a `WebSocket` újracsatlakozzon, és adatokat küldhessen és fogadhasson adott adatbázis-írásokhoz.

### Biztonsági mentések {#backups}

> **tldr;** A titkosított postaládákról naponta készülnek biztonsági mentések. Bármikor azonnal kérhet új biztonsági mentést, vagy letöltheti a legújabb biztonsági mentést a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontból.

Biztonsági mentésekhez egyszerűen lefuttatjuk az SQLite `VACUUM INTO` parancsot minden nap az IMAP parancsok feldolgozása során, amely a memóriában tárolt IMAP kapcsolat titkosított jelszavát használja. A biztonsági mentések akkor kerülnek mentésre, ha nem észlelhető meglévő biztonsági mentés, vagy ha a [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash megváltozott a fájlban a legutóbbi biztonsági mentéshez képest.

Megjegyzendő, hogy a `VACUUM INTO` parancsot használjuk a beépített `backup` parancs helyett, mert ha egy oldal módosul egy `backup` parancsművelet során, akkor újra kell kezdenie. A `VACUUM INTO` parancs pillanatképet készít. További információkért lásd a [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) és [Hacker hírek](https://news.ycombinator.com/item?id=31387556) dokumentumokkal kapcsolatos megjegyzéseket.

Ezenkívül a `VACUUM INTO` parancsot használjuk a `backup` helyett, mivel a `backup` parancs rövid ideig titkosítatlanul hagyná az adatbázist, amíg a `rekey` parancsot meg nem hívjuk (lásd a GitHub [megjegyzés](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) hivatkozását a részletekért).

A Másodlagos kiszolgáló a `WebSocket` kapcsolaton keresztül utasítja az Elsődleges kiszolgálót a biztonsági mentés végrehajtására – az Elsődleges kiszolgáló ezután megkapja az ehhez szükséges parancsot, és ezt követően a következőket teszi:

1. Csatlakozzon titkosított postaládájához.

2. Szerezzen be írási zárat.

3. Futtasson egy WAL ellenőrzőpontot a `wal_checkpoint(PASSIVE)` parancs segítségével.

4. Futtassa a `VACUUM INTO` SQLite parancsot.

5. Győződjön meg arról, hogy a másolt fájl megnyitható a titkosított jelszóval (biztonsági/álvédelmi védelem).

6. Töltse fel a Cloudflare R2-be tárolás céljából (vagy a saját szolgáltatójára, ha meg van adva).

<!--
7. Tömörítse a kapott biztonsági mentésfájlt a `gzip` kóddal.
8. Töltse fel a Cloudflare R2 tárhelyére (vagy a saját szolgáltatójára, ha meg van adva).
-->

Ne feledd, hogy a postaládáid titkosítva vannak – és bár IP-korlátozások és egyéb hitelesítési intézkedések vannak érvényben a WebSocket kommunikációhoz –, rosszindulatú szereplő esetén biztos lehetsz benne, hogy ha a WebSocket hasznos adata nem rendelkezik az IMAP-jelszavaddal, akkor nem tudja megnyitni az adatbázisodat.

Jelenleg postaládánként csak egy biztonsági mentés kerül tárolásra, de a jövőben lehetőség lesz adott időpontban történő helyreállításra ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Keresés: {#search}

IMAP-szervereink támogatják a `SEARCH` parancsot összetett lekérdezésekkel, reguláris kifejezésekkel és egyebekkel.

A gyors keresési teljesítmény a [FTS5](https://www.sqlite.org/fts5.html) és a [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) funkcióknak köszönhető.

A `Date` értékeket [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) karakterláncként tároljuk az SQLite postaládákban [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)-on keresztül (UTC időzónával az egyenlőség-összehasonlítások megfelelő működése érdekében).

Az indexek a keresési lekérdezésekben szereplő összes tulajdonsághoz is tárolódnak.

### Projektek {#projects}

Íme egy táblázat, amely felvázolja a forráskódunkban és a fejlesztési folyamatunkban használt projekteket (betűrendben):

| Projekt | Cél |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps automatizálási platform a teljes szerverflottánk egyszerű karbantartásához, skálázásához és kezeléséhez. |
| [Bree](https://github.com/breejs/bree) | Feladatütemező Node.js-hez és JavaScripthez cron, dates, ms, later és felhasználóbarát támogatással. |
| [Cabin](https://github.com/cabinjs/cabin) | Fejlesztőbarát JavaScript és Node.js naplózókönyvtár, amely a biztonságot és az adatvédelmet szem előtt tartja. |
| [Lad](https://github.com/ladjs/lad) | Node.js keretrendszer, amely az MVC és más technológiák felhasználásával működteti a teljes architektúránkat és mérnöki tervezésünket. |
| [MongoDB](https://www.mongodb.com/) | NoSQL adatbázis-megoldás, amelyet a postaládákon kívüli összes többi adat (pl. fiók, beállítások, domainek és alias konfigurációk) tárolására használunk. |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB objektumdokumentum-modellezés ("ODM"), amelyet a teljes rendszerünkben használunk. Speciális segítőket írtunk, amelyek lehetővé teszik számunkra, hogy egyszerűen folytassuk a **Mongoose használatát SQLite-tal** :tada: |
| [Node.js](https://nodejs.org/en) | A Node.js egy nyílt forráskódú, platformfüggetlen JavaScript futtatókörnyezet, amely az összes szerverfolyamatunkat futtatja. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js csomag e-mailek küldéséhez, kapcsolatok létrehozásához és egyebekhez. A projekt hivatalos szponzorai vagyunk. |
| [Redis](https://redis.io/) | Memórián belüli adatbázis gyorsítótárazáshoz, közzétételi/feliratkozási csatornákhoz és HTTPS-kéréseken keresztüli DNS-hez. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Titkosítási bővítmény az SQLite-hoz, amely lehetővé teszi a teljes adatbázisfájlok titkosítását (beleértve az előre írási naplót ("[WAL](https://www.sqlite.org/wal.html)"), a naplót, a visszagörgetést stb.). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visual SQLite szerkesztő (amit te is használhatsz) a fejlesztői postaládák teszteléséhez, letöltéséhez és megtekintéséhez. |
| [SQLite](https://www.sqlite.org/about.html) | Beágyazott adatbázis réteg a skálázható, önálló, gyors és rugalmas IMAP-tároláshoz. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js anti-spam, e-mail szűrő és adathalászat elleni eszköz (alternatívánk a [Spam Assassin](https://spamassassin.apache.org/) és [rspamd](https://github.com/rspamd/rspamd) helyett). |
| [Tangerine](https://tangeri.ne) | DNS HTTPS kéréseken keresztül Node.js-sel és gyorsítótárazás Redis használatával – ami globális konzisztenciát és még sok minden mást biztosít. |
| [Thunderbird](https://www.thunderbird.net/) | Fejlesztőcsapatunk ezt használja (és ajánlja is) **a Forward Email funkcióhoz preferált e-mail kliensként**. |
| [UTM](https://github.com/utmapp/UTM) | Fejlesztőcsapatunk ezt a virtuális gépeket használja iOS és macOS rendszerekhez, hogy különböző e-mail klienseket (párhuzamosan) tesztelhessen az IMAP és SMTP szervereinkkel. |
| [Ubuntu](https://ubuntu.com/download/server) | Modern, nyílt forráskódú, Linux alapú szerver operációs rendszer, amely az összes infrastruktúránkat működteti. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP szerverkönyvtár – lásd a [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) és [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) könyvtárakra vonatkozó megjegyzéseit. |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Gyors és egyszerű API könyvtár a Node.js és az SQLite3 programozott interakciójához. |
| [email-templates](https://github.com/forwardemail/email-templates) | Fejlesztőbarát e-mail keretrendszer egyéni e-mailek (pl. fiókértesítések és egyebek) létrehozásához, előnézetéhez és küldéséhez. |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL lekérdezésszerkesztő Mongo stílusú szintaxissal. Ez időt takarít meg a fejlesztőcsapatunknak, mivel továbbra is Mongo stílusban írhatunk a teljes veremben, adatbázis-agnosztikus megközelítéssel. **A lekérdezési paraméterek használatával segít elkerülni az SQL injekciós támadásokat is.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL segédprogram a meglévő adatbázissémák információinak kinyerésére. Ez lehetővé teszi számunkra, hogy könnyedén ellenőrizzük, hogy az összes index, tábla, oszlop, megszorítás és egyebek érvényesek-e, és a `1:1` megfelelő-e. Még automatizált segítőket is írtunk, amelyek új oszlopokat és indexeket adnak hozzá, ha az adatbázissémákban változások történnek (rendkívül részletes hibajelzéssel). |
| [knex](https://github.com/knex/knex) | SQL lekérdezésszerkesztő, amelyet csak adatbázis-migrációkhoz és sémaérvényesítéshez használunk a `knex-schema-inspector` cella segítségével. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatikus [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) kifejezésfordítás Markdown-támogatással [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest) használatával. |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js csomag az MX szerverekkel való kapcsolatok feloldásához és létrehozásához, valamint a hibák kezeléséhez. |
| [pm2](https://github.com/Unitech/pm2) | Node.js éles folyamatkezelő beépített terheléselosztóval ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) a teljesítmény érdekében). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP szerverkönyvtár – ezt használjuk a levélcsere ("MX") és a kimenő SMTP szervereinkhez. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Hasznos eszköz az IMAP-kiszolgálók benchmarkok és az RFC-specifikáció szerinti IMAP protokoll kompatibilitásának teszteléséhez. Ezt a projektet a [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) csapata hozta létre (egy aktív, nyílt forráskódú IMAP és POP3 szerver 2002 júliusa óta). Ezzel az eszközzel széles körben teszteltük az IMAP-kiszolgálónkat. |

> További, általunk használt projekteket a [forráskódunk a GitHub-on](https://github.com/forwardemail) oldalon talál.

### Szolgáltatók {#providers}

| Szolgáltató | Cél |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-szolgáltató, állapotellenőrzések, terheléselosztók és biztonsági mentési tárhely a [Cloudflare R2](https://developers.cloudflare.com/r2) használatával. |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikált szerver hosting és menedzselt adatbázisok. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dedikált szerver hosting. |
| [DataPacket](https://www.datapacket.com) | Dedikált szerver hosting. |

## Gondolatok {#thoughts}

### Alapelvek {#principles}

Az e-mail továbbítása a következő elvek szerint történik:

1. Mindig fejlesztőbarát, biztonság- és adatvédelmi fókuszú, valamint átlátható módon kell eljárni.

2. Tartsa be a [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Tizenkét tényező](https://12factor.net/), [Occam borotvája](https://en.wikipedia.org/wiki/Occam%27s_razor) és [kutyaeledel](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) irányelveket.

3. Célozza meg a kapkodó, befektetett erőforrásokat használó és [ramen-nyereséges](http://www.paulgraham.com/ramenprofitable.html) fejlesztőket.

### Kísérletek {#experiments}

> **tldr;** Végső soron az S3-kompatibilis objektumtárolás és/vagy virtuális táblák használata teljesítménybeli okokból technikailag nem megvalósítható, és a memóriakorlátok miatt hibákra hajlamos.

A fent említett végső SQLite megoldásunkhoz néhány kísérletet végeztünk.

Az egyik ilyen módszer az [rclone]() és az SQLite együttes használata volt egy S3-kompatibilis tárolási réteggel.

Ez a kísérlet vezetett minket az rclone, az SQLite és a [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) használatát övező peremhelyzetek jobb megértéséhez és felfedezéséhez:

* Ha engedélyezed a `--vfs-cache-mode writes` jelzőt az rclone-nal, akkor az olvasások rendben lesznek, de az írások gyorsítótárba kerülnek.
* Ha több IMAP szervered van globálisan elosztva, akkor a gyorsítótár nem fog működni közöttük, kivéve, ha egyetlen íród és több figyelőd van (pl. pub/sub megközelítés).
* Ez hihetetlenül bonyolult, és minden további bonyolultság hozzáadása további egyedi meghibásodási pontokat eredményez.
* Az S3-kompatibilis tárolószolgáltatók nem támogatják a részleges fájlmódosításokat – ami azt jelenti, hogy a `.sqlite` fájl bármilyen módosítása az adatbázis teljes módosítását és újratöltését eredményezi.
* Léteznek más megoldások is, mint például a `rsync`, de ezek nem az előre írásos naplózás ("[WAL](https://www.sqlite.org/wal.html)") támogatására összpontosítanak – így végül a Litestreamet vizsgáltuk meg. Szerencsére a titkosítási módszerünk már titkosítja a [WAL](https://www.sqlite.org/wal.html) fájlokat, így ehhez nem kell a Litestreamre hagyatkoznunk. Azonban még nem voltunk biztosak a Litestream használatában éles környezetben, és erről alább néhány megjegyzést teszünk.

* A `--vfs-cache-mode writes` opció használata (az *egyetlen* módja az SQLite használatának a `rclone` helyett íráshoz) megpróbálja a teljes adatbázist a memóriából a semmiből másolni – egy 10 GB-os postafiók kezelése rendben van, azonban több, rendkívül nagy tárhelyű postafiók kezelése az IMAP-kiszolgálók memóriakorlátozásába, valamint `ENOMEM` hibákba, szegmentálási hibákba és adatsérülésbe ütközik. * Ha az SQLite [Virtuális asztalok](https://www.sqlite.org/vtab.html) (pl. a [s3db](https://github.com/jrhy/s3db)) használatával próbálod meg az adatokat élőben tárolni egy S3-kompatibilis tárolási rétegen, akkor további problémákba fogsz ütközni:
* Az olvasás és írás rendkívül lassú lesz, mivel az S3 API végpontokat HTTP `GET`, `PUT`, `HEAD` és `POST` metódusokkal kell elérni.
* A fejlesztői tesztek azt mutatták, hogy az optikai kábelen az 500K-1M+ rekordok túllépése továbbra is korlátozott az S3-kompatibilis szolgáltatók felé történő írás és olvasás átviteli sebessége miatt. Például a fejlesztőink `for` ciklusokat futtattak mind a szekvenciális SQL `INSERT` utasítások, mind a nagy mennyiségű adatot tömegesen író utasítások végrehajtásához. Mindkét esetben a teljesítmény megdöbbentően lassú volt.
* A virtuális táblák **nem tartalmazhatnak indexeket**, `ALTER TABLE` utasításokat és [más](https://stackoverflow.com/a/12507650) [korlátozások](https://sqlite.org/lang_createvtab.html) – ami az adatmennyiségtől függően akár 1-2 perces vagy annál hosszabb késéseket is okozhat.
* Az objektumokat titkosítatlanul tároltuk, és nem áll rendelkezésre natív titkosítási támogatás.
* A [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) használatát is megvizsgáltuk, amely fogalmilag és technikailag hasonló az előző ponthoz (tehát ugyanazokkal a problémákkal küzd). Egy lehetséges megoldás egy egyéni `sqlite3` build használata titkosítással, például a [wxSQLite3](https://github.com/utelle/wxsqlite3) (amelyet jelenleg a fenti megoldásunkban használunk) a [a beállítófájl szerkesztése](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276)-on keresztül.

* Egy másik lehetséges megközelítés a [multiplex kiterjesztés](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c) használata volt, azonban ennek 32 GB-os korlátja van, és összetett építési és fejlesztési fejfájást igényelne.
* A `ALTER TABLE` utasítások szükségesek (tehát ez teljesen kizárja a virtuális táblák használatát). A `ALTER TABLE` utasításokra van szükségünk ahhoz, hogy a `knex-schema-inspector`-val rendelkező hook megfelelően működjön – ami biztosítja, hogy az adatok ne sérüljenek meg, és a lekért sorok érvényes dokumentumokká konvertálhatók legyenek a `mongoose` sémadefinícióink szerint (amelyek magukban foglalják a korlátozást, a változótípust és az önkényes adatérvényesítést).
* A nyílt forráskódú közösségben az SQLite-hoz kapcsolódó S3-kompatibilis projektek szinte mindegyike Pythonban van (és nem JavaScriptben, amelyet a verem 100%-ában használunk).
* Az olyan tömörítési könyvtárak, mint a [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (lásd [hozzászólások](https://news.ycombinator.com/item?id=32303762)), ígéretesnek tűnnek, de a [lehet, hogy még nem áll készen a termelési használatra](https://github.com/phiresky/sqlite-zstd#usage). Ehelyett az alkalmazásoldali tömörítés olyan adattípusokon, mint a `String`, `Object`, `Map`, `Array`, `Set` és `Buffer`, tisztább és egyszerűbb megközelítést kínál (és könnyebben migrálható is, mivel tárolhatunk egy `Boolean` jelzőt vagy oszlopot – vagy akár használhatjuk a `PRAGMA` `user_version=1` tömörítést, vagy a `user_version=0` tömörítés nélküli adattípusokat adatbázis-metaadatokként). * Szerencsére már implementáltuk a mellékletek duplikációmentesítését az IMAP szerverünk tárolójában – ezért minden azonos melléklettel rendelkező üzenet nem őriz meg másolatot a mellékletről – ehelyett egyetlen mellékletet tárolunk több üzenethez és szálhoz egy postaládában (és ezt követően egy idegen hivatkozást használunk).
* A Litestream projekt, amely egy SQLite replikációs és biztonsági mentési megoldás, nagyon ígéretes, és valószínűleg a jövőben is használni fogjuk.
* Nem akarom lejáratni a szerző(ke)t – mert már több mint egy évtizede szeretjük a munkájukat és a nyílt forráskódú projektekhez való hozzájárulásukat –, azonban a valós használatból úgy tűnik, hogy [sok fejfájás lehet](https://github.com/benbjohnson/litestream/issues) és [használatból eredő adatvesztés lehetősége](https://github.com/benbjohnson/litestream/issues/218) létezik.
* A biztonsági mentések visszaállításának zökkenőmentesnek és triviálisnak kell lennie. Egy olyan megoldás használata, mint a MongoDB a `mongodump` és `mongoexport` kóddal, nemcsak fárasztó, de időigényes és konfigurációs bonyolultsággal jár.
* Az SQLite adatbázisok egyszerűvé teszik (egyetlen fájlról van szó).
* Olyan megoldást szerettünk volna tervezni, ahol a felhasználók bármikor elvihetik és elhagyhatják postaládájukat.
* Egyszerű Node.js parancsok a `fs.unlink('mailbox.sqlite'))` parancshoz, és az véglegesen törlődik a lemezes tárhelyről.
* Hasonlóképpen használhatunk egy S3-kompatibilis API-t HTTP `DELETE` protokollal a pillanatképek és biztonsági mentések egyszerű eltávolításához a felhasználók számára.
* Az SQLite volt a legegyszerűbb, leggyorsabb és legköltséghatékonyabb megoldás.

### Alternatívák hiánya {#lack-of-alternatives}

Tudomásunk szerint egyetlen más e-mail szolgáltatás sem ilyen módon lett megtervezve, és nem is nyílt forráskódúak.

Úgy *gondoljuk,* hogy ez annak tudható be*, hogy a meglévő e-mail szolgáltatásokban a [spagetti kód](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti: régebbi technológiája van éles üzemben.

A legtöbb, ha nem az összes meglévő e-mail szolgáltató vagy zárt forráskódú, vagy nyílt forráskódúként hirdeti magát, **de a valóságban csak a front-endjük nyílt forráskódú.**

**Az e-mail legérzékenyebb része** (a tényleges tárolási/IMAP/SMTP interakció) **a háttérrendszeren (szerveren) történik, *nem* a front-end rendszeren (kliensen)**.

### Próbálja ki az e-mail továbbítását {#try-out-forward-email}

Regisztrálj még ma a <https://forwardemail.net>! :rocket: oldalon