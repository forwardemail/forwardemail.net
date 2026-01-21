# E-mail odolný vůči kvantovým hrozbám: Jak používáme šifrované poštovní schránky SQLite k zabezpečení vašeho e-mailu {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Porovnání poskytovatelů e-mailových služeb](#email-service-provider-comparison)
* [Jak to funguje](#how-does-it-work)
* [Technologie](#technologies)
  * [Databáze](#databases)
  * [Zabezpečení](#security)
  * [Poštovní schránky](#mailboxes)
  * [Souběžnost](#concurrency)
  * [Zálohy](#backups)
  * [Vyhledávání](#search)
  * [Projekty](#projects)
  * [Poskytovatelé](#providers)
* [Myšlenky](#thoughts)
  * [Zásady](#principles)
  * [Experimenty](#experiments)
  * [Nedostatek alternativ](#lack-of-alternatives)
  * [Vyzkoušejte přeposílání e-mailů](#try-out-forward-email)

## Předmluva {#foreword}

> \[!IMPORTANT]
> Naše e-mailová služba je [100% open-source](https://github.com/forwardemail) a je zaměřena na soukromí prostřednictvím zabezpečených a šifrovaných poštovních schránek SQLite.

Než jsme spustili [Podpora IMAPu](/faq#do-you-support-receiving-email-with-imap), používali jsme pro naše potřeby trvalého ukládání dat MongoDB.

Tato technologie je úžasná a používáme ji dodnes – ale abyste mohli mít šifrování v klidu s MongoDB, musíte použít poskytovatele, který nabízí MongoDB Enterprise, jako je Digital Ocean nebo Mongo Atlas – nebo si zaplatit za podnikovou licenci (a následně se muset vypořádat s latencí obchodního týmu).

Náš tým v [Přeposlat e-mail](https://forwardemail.net) potřeboval vývojářsky přívětivé, škálovatelné, spolehlivé a šifrované úložné řešení pro poštovní schránky IMAP. Jako vývojáři s otevřeným zdrojovým kódem jsme pro [naše zásady](#principles) museli zaplatit licenční poplatek za funkci šifrování v klidu a používání technologie bylo v rozporu s __PROTECTED_LINK_131__ – a proto jsme experimentovali, zkoumali a vyvinuli zcela nové řešení, které tyto potřeby vyřeší.

Místo sdílené databáze pro ukládání vašich poštovních schránek ukládáme a šifrujeme vaše poštovní schránky jednotlivě pomocí vašeho hesla (které máte pouze vy). **Naše e-mailová služba je tak bezpečná, že pokud zapomenete heslo, ztratíte svou poštovní schránku** (a budete ji muset obnovit pomocí offline záloh nebo začít znovu).

Čtěte dál, níže se podrobněji ponoříme do [srovnání poskytovatelů e-mailových služeb](#email-service-provider-comparison), [jak naše služba funguje](#how-does-it-work), [náš technologický stack](#technologies) a dalších.

## Porovnání poskytovatelů e-mailových služeb {#email-service-provider-comparison}

Jsme jediný poskytovatel e-mailových služeb se 100% otevřeným zdrojovým kódem a zaměřením na soukromí, který ukládá jednotlivě šifrované poštovní schránky SQLite, nabízí neomezený počet domén, aliasů a uživatelů a podporuje odchozí protokoly SMTP, IMAP a POP3:

**Na rozdíl od jiných poskytovatelů e-mailu nemusíte u služby Forward Email platit za úložiště pro každou doménu nebo alias.** Úložiště je sdíleno v rámci celého vašeho účtu – pokud tedy máte více vlastních domén a u každé z nich více aliasů, jsme pro vás ideálním řešením. Upozorňujeme, že v případě potřeby můžete i nadále vynucovat limity úložiště pro každou doménu nebo alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Přečtěte si srovnání e-mailových služeb <i class="fa fa-search-plus"></i></a>

## Jak to funguje {#how-does-it-work}

1. Pomocí e-mailového klienta, jako je Apple Mail, Thunderbird, Gmail nebo Outlook – k našim zabezpečeným serverům [IMAP](/faq#do-you-support-receiving-email-with-imap) se připojíte pomocí svého uživatelského jména a hesla:

* Vaše uživatelské jméno je váš úplný alias u vaší domény, například `hello@example.com`.
* Vaše heslo je náhodně generováno a zobrazí se vám pouze 30 sekund po kliknutí na <strong class="text-success"><i class="fa fa-key"></i> Generovat heslo</strong> z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy.

2. Po připojení váš e-mailový klient odešle na náš IMAP server hodnotu [Příkazy protokolu IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), aby vaše poštovní schránka byla synchronizovaná. To zahrnuje psaní a ukládání konceptů e-mailů a další akce, které můžete provést (např. označení e-mailu jako důležitého nebo nahlášení e-mailu jako spamu/nevyžádané pošty).

3. Servery pro výměnu pošty (běžně označované jako servery „MX“) přijímají nové příchozí e-maily a ukládají je do vaší poštovní schránky. Když k tomu dojde, váš e-mailový klient bude upozorněn a synchronizuje vaši schránku. Naše servery pro výměnu pošty mohou přeposlat váš e-mail jednomu nebo více příjemcům (včetně [webhooky](/faq#do-you-support-webhooks)), uložit váš e-mail za vás do vašeho šifrovaného úložiště IMAP u nás **nebo obojí**!

> \[!TIP]
> Chcete se dozvědět více? Přečtěte si [jak nastavit přeposílání e-mailů](/faq#how-do-i-get-started-and-set-up-email-forwarding), [jak funguje naše služba výměny pošty](/faq#how-does-your-email-forwarding-system-work) nebo si prohlédněte [naši průvodci](/guides).

4. V zákulisí funguje náš návrh zabezpečeného úložiště e-mailů dvěma způsoby, aby vaše poštovní schránky byly šifrované a přístupné pouze vám:

* Když od odesílatele obdržíte novou poštu, naše servery pro výměnu pošty zapíší do individuální, dočasné a šifrované poštovní schránky.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Když se připojíte k našemu IMAP serveru pomocí svého e-mailového klienta, vaše heslo je zašifrováno v paměti a použito ke čtení a zápisu do vaší poštovní schránky. Z vaší poštovní schránky lze číst a do ní zapisovat pouze s tímto heslem. Mějte na paměti, že jelikož toto heslo máte pouze vy, můžete do své schránky číst a zapisovat do ní, když k ní přistupujete. Až se váš e-mailový klient příště pokusí o dotazování na poštu nebo synchronizaci, vaše nové zprávy budou přeneseny z této dočasné schránky a uloženy do vašeho skutečného souboru poštovní schránky s použitím vámi zadaného hesla. Upozorňujeme, že tato dočasná schránka je následně vymazána, takže zprávy budou obsahovat pouze vaše schránka chráněná heslem.

* **Pokud jste připojeni k protokolu IMAP (např. pomocí e-mailového klienta, jako je Apple Mail nebo Thunderbird), nemusíme zapisovat do dočasného úložiště na disku. Místo toho se načte a použije vaše šifrované heslo IMAP uložené v paměti. V reálném čase, když se vám pokouší doručit zprávu, odešleme všem serverům IMAP požadavek WebSocket s dotazem, zda pro vás mají aktivní relaci (toto je část načtení), a následně toto šifrované heslo uložené v paměti předáme dál – takže nemusíme zapisovat do dočasné poštovní schránky, můžeme zapisovat do vaší skutečné šifrované schránky s použitím vašeho šifrovaného hesla.**

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

5. Denně se provádějí [Zálohy vašich šifrovaných poštovních schránek](#backups). Můžete si také kdykoli vyžádat novou zálohu nebo si stáhnout nejnovější zálohu z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy. Pokud se rozhodnete přejít na jinou e-mailovou službu, můžete své poštovní schránky a zálohy kdykoli snadno migrovat, stahovat, exportovat a mazat.

## Technologie {#technologies}

### Databáze {#databases}

Prozkoumali jsme i další možné vrstvy úložiště databáze, ale žádná z nich nesplňovala naše požadavky tak dobře jako SQLite:

| Databáze | Šifrování v klidu | Poštovní schránky [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) | Licence | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :hvězdička: | :white_check_mark: Ano s [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :white_check_mark: | :white_check_mark: Veřejná doména | :white_check_mark: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relační databáze | :x: AGPL a `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relační databáze | :white_check_mark: `MIT` | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: `LGPL-3.0-only` | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relační databáze | :white_check_mark: `PostgreSQL` (podobné jako `BSD` nebo `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relační databáze | :white_check_mark: `GPLv2` a `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relační databáze | :x: `BUSL-1.1` a další | :x: |

> Zde je v tabulce výše [blogový příspěvek, který porovnává několik možností úložiště databáze SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/).

### Zabezpečení {#security}

U poštovních schránek vždy používáme šifrování [šifrování v klidu](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [šifrování při přenosu](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS přes HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") s využitím :tangerine: [Mandarinka](https://tangeri.ne) a [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Dále používáme dvoufaktorové ověřování založené na tokenech (na rozdíl od SMS, které je podezřelé z [útoky typu „man-in-the-middle“](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), rotované SSH klíče s deaktivovaným root přístupem, exkluzivní přístup k serverům prostřednictvím omezených IP adres a další.

V případě DOČASNÉHO_ZÁSTUPCE_0 nebo nepoctivého zaměstnance od třetí strany bude **vaši poštovní schránku stále možné otevřít pouze s vámi vygenerovaným heslem**. Ujišťujeme vás, že se nespoléháme na žádné třetí strany kromě našich poskytovatelů serverů pro stížnosti SOC typu 2, jako jsou Cloudflare, DataPacket, Digital Ocean a Vultr.

Naším cílem je mít co nejméně [jediný bod selhání](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Poštovní schránky {#mailboxes}

> **tldr;** Naše IMAP servery používají individuálně šifrované databáze SQLite pro každou z vašich poštovních schránek.

Vestavěná databáze [SQLite je extrémně populární](https://www.sqlite.org/mostdeployed.html) – aktuálně běží na vašem telefonu a počítači – [a používá se téměř všemi hlavními technologiemi](https://www.sqlite.org/famous.html).

Například na našich šifrovaných serverech existuje poštovní schránka databáze SQLite pro `linux@example.com`, `info@example.com`, `hello@example.com` a tak dále – jedna pro každou z nich jako databázový soubor `.sqlite`. Soubory databáze také nepojmenováváme e-mailovou adresou – místo toho používáme BSON ObjectID a vygenerované jedinečné UUID, které nesdílejí, komu schránka patří ani pod jakou e-mailovou adresou je (např. `353a03f21e534321f5d6e267.sqlite`).

Každá z těchto databází je šifrována pomocí vašeho hesla (které máte pouze vy) s parametrem [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). To znamená, že vaše poštovní schránky jsou šifrovány jednotlivě, samostatně, [sandboxu](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) a přenositelné.

Doladili jsme SQLite s následujícím [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Účel |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Pro více informací viz `better-sqlite3-multiple-ciphers` pod [Projects](#projects). |
| `key="****************"` | Toto je vaše dešifrované heslo uložené pouze v paměti, které se předává přes IMAP připojení vašeho e-mailového klienta k našemu serveru. Pro každou relaci čtení a zápisu se vytvářejí a zavírají nové instance databáze (aby se zajistil sandbox a izolace). |
| `journal_model=WAL` | Záznam předzápisu („[WAL](https://www.sqlite.org/wal.html)“) [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Zabraňuje chybám zápisu [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Zvyšuje trvanlivost transakcí [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Vynucuje, aby byly vynuceny odkazy na cizí klíče (např. relace z jedné tabulky do druhé). [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), ale pro ověření a integritu dat by měla být povolena. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) pro zajištění bezpečnosti vývojářů. |

> Všechny ostatní výchozí hodnoty jsou z SQLite, jak je specifikováno v [oficiální dokumentace PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Souběžnost {#concurrency}

> **tldr;** Pro souběžné čtení a zápisy do vašich šifrovaných poštovních schránek SQLite používáme `WebSocket`.

#### Čtení {#reads}

Váš e-mailový klient v telefonu může přeložit `imap.forwardemail.net` na jednu z našich IP adres Digital Ocean – a váš desktopový klient může přeložit jinou IP adresu z úplně jiné [poskytovatel](#providers).

Bez ohledu na to, ke kterému IMAP serveru se váš e-mailový klient připojuje, chceme, aby připojení četlo z vaší databáze v reálném čase se 100% přesností. To se provádí prostřednictvím WebSockets.

#### Zapisuje {#writes}

Zápis do databáze je trochu jiný – SQLite je totiž vestavěná databáze a vaše poštovní schránka se standardně nachází v jednom souboru.

Prozkoumali jsme níže uvedené možnosti jako `litestream`, `rqlite` a `dqlite` – žádná z nich však nesplňovala naše požadavky.

Abychom mohli provádět zápisy s povoleným protokolováním předběžného zápisu („[WAL](https://www.sqlite.org/wal.html)“), musíme zajistit, aby za to byl zodpovědný pouze jeden server („primární“). [WAL](https://www.sqlite.org/wal.html) drasticky zrychluje souběžnost a umožňuje jeden zapisovač a více čtenářů.

Primární server běží na datových serverech s připojenými svazky obsahujícími šifrované poštovní schránky. Z distribučního hlediska byste mohli všechny jednotlivé servery IMAP za `imap.forwardemail.net` považovat za sekundární servery („Sekundární“).

S [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) uskutečňujeme obousměrnou komunikaci:

* Primární servery používají instanci serveru `WebSocketServer` třídy [ws](https://github.com/websockets/ws). * Sekundární servery používají instanci klienta `WebSocket` třídy [ws](https://github.com/websockets/ws), která je obalena třídami [websocket-as-slibed](https://github.com/vitalets/websocket-as-promised) a [opětovné připojení webového socketu](https://github.com/opensumi/reconnecting-websocket). Tyto dva obaly zajišťují, že se třída `WebSocket` znovu připojí a může odesílat a přijímat data pro specifické zápisy do databáze.

### Zálohy {#backups}

> **tldr;** Zálohy vašich šifrovaných poštovních schránek se vytvářejí denně. Můžete si také okamžitě vyžádat novou zálohu nebo si kdykoli stáhnout nejnovější zálohu z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy.

Pro zálohy jednoduše spouštíme příkaz SQLite `VACUUM INTO` každý den během zpracování příkazu IMAP, který využívá vaše šifrované heslo z připojení IMAP v paměti. Zálohy se ukládají, pokud není detekována žádná existující záloha nebo pokud se hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) v souboru změnil ve srovnání s nejnovější zálohou.

Všimněte si, že používáme příkaz `VACUUM INTO` na rozdíl od vestavěného příkazu `backup`, protože pokud je stránka upravena během operace s příkazem `backup`, musí se začít znovu. Příkaz `VACUUM INTO` pořídí snímek. Další informace naleznete v těchto komentářích k příkazům [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) a [Hackerské zprávy](https://news.ycombinator.com/item?id=31387556).

Dále používáme `VACUUM INTO` na rozdíl od `backup`, protože příkaz `backup` by ponechal databázi na krátkou dobu nešifrovanou, dokud by nebyl vyvolán `rekey` (viz tento GitHub [komentář](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) pro více informací).

Sekundární server dá pokyn primárnímu serveru přes připojení `WebSocket` k provedení zálohy – a primární server poté obdrží příkaz k provedení této zálohy a následně provede následující:

1. Připojte se k vaší šifrované poštovní schránce.
2. Získejte zámek proti zápisu.
3. Spusťte kontrolní bod WAL přes `wal_checkpoint(PASSIVE)`.
4. Spusťte příkaz SQLite `VACUUM INTO`.
5. Ujistěte se, že zkopírovaný soubor lze otevřít pomocí šifrovaného hesla (ochrana/ochrana před falešnými hesly).
6. Nahrajte jej do Cloudflare R2 pro uložení (nebo k vašemu vlastnímu poskytovateli, pokud je uveden).

<!--
7. Výsledný záložní soubor zkomprimujte pomocí parametru `gzip`.
8. Nahrajte jej do úložiště Cloudflare R2 (nebo k vašemu vlastnímu poskytovateli, pokud je uveden).
-->

Nezapomeňte, že vaše poštovní schránky jsou šifrované – a přestože máme pro komunikaci přes WebSocket zavedena omezení IP adres a další ověřovací opatření – v případě zneužití si můžete být jisti, že pokud datová část WebSocket neobsahuje vaše heslo IMAP, nemůže vaši databázi otevřít.

V současné době je pro každou poštovní schránku uložena pouze jedna záloha, ale v budoucnu můžeme nabídnout obnovení k určitému bodu v čase („[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)“).

### Hledat {#search}

Naše IMAP servery podporují příkaz `SEARCH` se složitými dotazy, regulárními výrazy a dalšími funkcemi.

Rychlé vyhledávání je možné díky parametrům [FTS5](https://www.sqlite.org/fts5.html) a [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Hodnoty `Date` ukládáme do poštovních schránek SQLite jako řetězce [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) prostřednictvím [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (s časovým pásmem UTC, aby porovnávání rovnosti fungovalo správně).

Indexy se také ukládají pro všechny vlastnosti, které se nacházejí ve vyhledávacích dotazech.

### Projekty {#projects}

Zde je tabulka s přehledem projektů, které používáme v našem zdrojovém kódu a vývojovém procesu (seřazeno abecedně):

| Projekt | Účel |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Platforma pro automatizaci DevOps pro snadnou údržbu, škálování a správu celé naší flotily serverů. |
| [Bree](https://github.com/breejs/bree) | Plánovač úloh pro Node.js a JavaScript s podporou cronu, dat, ms, later a uživatelsky přívětivou podporou. |
| [Cabin](https://github.com/cabinjs/cabin) | Vývojářsky přívětivá knihovna pro logování v JavaScriptu a Node.js s ohledem na bezpečnost a soukromí. |
| [Lad](https://github.com/ladjs/lad) | Framework Node.js, který pohání celou naši architekturu a technický návrh s využitím MVC a dalších technologií. |
| [MongoDB](https://www.mongodb.com/) | NoSQL databázové řešení, které používáme pro ukládání všech ostatních dat mimo poštovní schránky (např. váš účet, nastavení, domény a konfigurace aliasů). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modelování objektových dokumentů MongoDB („ODM“), které používáme v celém našem stacku. Napsali jsme speciální pomocníky, které nám umožňují jednoduše pokračovat v používání **Mongoose s SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js je open-source, multiplatformní běhové prostředí JavaScriptu, které spouští všechny naše serverové procesy. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Balíček Node.js pro odesílání e-mailů, vytváření spojení a další. Jsme oficiálním sponzorem tohoto projektu. |
| [Redis](https://redis.io/) | Databáze v paměti pro ukládání do mezipaměti, kanály publikování/odebírání a požadavky DNS přes HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Šifrovací rozšíření pro SQLite, které umožňuje šifrování celých databázových souborů (včetně protokolu předzápisu („[WAL](https://www.sqlite.org/wal.html)“), žurnálu, rollbacku atd.). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Vizuální editor SQLite (který můžete také použít) pro testování, stahování a prohlížení vývojových poštovních schránek. |
| [SQLite](https://www.sqlite.org/about.html) | Vestavěná databázová vrstva pro škálovatelné, samostatné, rychlé a odolné úložiště IMAP. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Nástroj Node.js pro ochranu před spamem, filtrování e-mailů a prevenci phishingu (naše alternativa k [Spam Assassin](https://spamassassin.apache.org/) a [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | DNS přes HTTPS požadavky s Node.js a ukládáním do mezipaměti pomocí Redis – což zajišťuje globální konzistenci a mnoho dalšího. |
| [Thunderbird](https://www.thunderbird.net/) | Náš vývojový tým používá tento program (a také jej doporučuje) jako **preferovaného e-mailového klienta pro použití s funkcí Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Náš vývojový tým používá tyto virtuální počítače pro iOS a macOS k testování různých e-mailových klientů (paralelně) s našimi IMAP a SMTP servery. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderní serverový operační systém s otevřeným zdrojovým kódem založený na Linuxu, který pohání veškerou naši infrastrukturu. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Knihovna serveru IMAP – viz poznámky k [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) a [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Rychlá a jednoduchá API knihovna pro Node.js pro programovou interakci s SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Vývojářsky přívětivý e-mailový framework pro vytváření, náhled a odesílání vlastních e-mailů (např. oznámení o účtech a další). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Tvůrce SQL dotazů s využitím syntaxe ve stylu Mongo. To šetří čas našemu vývojovému týmu, protože můžeme i nadále psát ve stylu Mongo napříč celým stackem s přístupem nezávislým na databázi. **Pomáhá to také vyhnout se útokům SQL injection pomocí parametrů dotazu.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL utilita pro extrakci informací o existujícím schématu databáze. To nám umožňuje snadno ověřit, zda jsou všechny indexy, tabulky, sloupce, omezení a další platné a zda odpovídají `1:1` tomu, jak by měly být. Dokonce jsme napsali automatické pomocníky pro přidání nových sloupců a indexů, pokud dojde ke změnám ve schématech databáze (a to i s extrémně podrobným upozorněním na chyby). |
| [knex](https://github.com/knex/knex) | Tvůrce SQL dotazů, který používáme pouze pro migrace databází a validaci schématu prostřednictvím `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatický překlad frází [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) s podporou Markdownu pomocí [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Balíček Node.js pro řešení a navazování spojení se servery MX a zpracování chyb. |
| [pm2](https://github.com/Unitech/pm2) | Správce produkčních procesů Node.js s vestavěným vyvažovačem zátěže ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) pro výkon). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Knihovna SMTP serveru – používáme ji pro naši výměnu pošty („MX“) a odchozí SMTP servery. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Užitečný nástroj pro testování serverů IMAP oproti benchmarkům a kompatibilitě protokolu IMAP dle specifikace RFC. Tento projekt vytvořil tým [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (aktivní open-source server IMAP a POP3 od července 2002). S tímto nástrojem jsme náš server IMAP rozsáhle testovali. |

> Další projekty, které používáme, najdete v [náš zdrojový kód na GitHubu](https://github.com/forwardemail).

### Poskytovatelé {#providers}

| Poskytovatel | Účel |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Poskytovatel DNS, kontroly stavu, vyrovnávače zátěže a úložiště záloh pomocí [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikovaný serverový hosting a spravované databáze. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hosting dedikovaného serveru. |
| [DataPacket](https://www.datapacket.com) | Hosting dedikovaného serveru. |

## Myšlenky {#thoughts}

### Principy {#principles}

Přeposílání e-mailů je navrženo podle těchto principů:

1. Vždy buďte vstřícní k vývojářům, zaměření na bezpečnost a soukromí a transparentní.
2. Dodržujte pravidla [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Dvanáctifaktor](https://12factor.net/), [Occamova břitva](https://en.wikipedia.org/wiki/Occam%27s_razor) a [interní testování](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Zaměřte se na neetické, bootstrapované a [ramen-rentabilní](http://www.paulgraham.com/ramenprofitable.html) vývojáře

### Experimenty {#experiments}

> **tldr;** Použití objektového úložiště kompatibilního s S3 a/nebo virtuálních tabulek není z důvodu výkonu technicky proveditelné a je náchylné k chybám kvůli omezením paměti.

Provedli jsme několik experimentů vedoucích k našemu finálnímu řešení SQLite, jak je popsáno výše.

Jedním z nich bylo zkusit použít [rclone]() a SQLite společně s úložnou vrstvou kompatibilní s S3.

Tento experiment nás vedl k hlubšímu pochopení a objevení okrajových případů týkajících se použití rclone, SQLite a [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Pokud povolíte příznak `--vfs-cache-mode writes` pomocí rclone, čtení bude v pořádku, nicméně zápisy se budou ukládat do mezipaměti. * Pokud máte více serverů IMAP distribuovaných globálně, mezipaměť bude na všech serverech vypnuta, pokud nemáte jeden zapisovač a více posluchačů (např. přístup pub/sub).
* Toto je neuvěřitelně složité a jakékoli přidání další složitosti povede k většímu počtu jednotlivých bodů selhání. * Poskytovatelé úložišť kompatibilní s S3 nepodporují částečné změny souborů – což znamená, že jakákoli změna souboru `.sqlite` bude mít za následek úplnou změnu a opětovné nahrání databáze. * Existují i jiná řešení, jako je `rsync`, ale ta se nezaměřují na podporu protokolování předběžného zápisu („[WAL](https://www.sqlite.org/wal.html)“) – takže jsme nakonec zkontrolovali Litestream. Naštěstí naše šifrování již šifruje soubory [WAL](https://www.sqlite.org/wal.html), takže se v tomto případě nemusíme spoléhat na Litestream. Nicméně jsme si pro produkční použití ještě nebyli jisti Litestreamem a níže k tomu uvádíme několik poznámek.
* Použití této možnosti `--vfs-cache-mode writes` (*jediný* způsob, jak použít SQLite místo `rclone` pro zápisy) se pokusí zkopírovat celou databázi od nuly do paměti – zpracování jedné 10GB poštovní schránky je v pořádku, nicméně zpracování více poštovních schránek s nadměrně velkým úložným prostorem způsobí, že servery IMAP narazí na omezení paměti a chyby `ENOMEM`, chyby segmentace a poškození dat.
* Pokud se pokusíte použít SQLite [Virtuální tabulky](https://www.sqlite.org/vtab.html) (např. pomocí [s3db](https://github.com/jrhy/s3db)) pro uložení dat na úložné vrstvě kompatibilní s S3, narazíte na několik dalších problémů:
* Čtení a zápis budou extrémně pomalé, protože koncové body S3 API bude nutné zasáhnout metodami HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 a `.sqlite`3.
* Vývojové testy ukázaly, že překročení 500 000 až 1 milionu+ záznamů na optickém internetu je stále omezeno propustností zápisu a čtení u poskytovatelů kompatibilních s S3. Naši vývojáři například spouštěli cykly `.sqlite`4 pro provádění sekvenčních příkazů SQL `.sqlite`5 i příkazů, které hromadně zapisovaly velké množství dat. V obou případech byl výkon ohromně pomalý.
* Virtuální tabulky **nemohou mít indexy**, příkazy `.sqlite`6 a `.sqlite`7 `.sqlite`8 – což vede ke zpožděním až 1–2 minuty nebo i více v závislosti na množství dat.
* Objekty byly uloženy nešifrované a není k dispozici žádná nativní podpora šifrování. * Zkoumali jsme také použití `.sqlite`9, který je koncepčně a technicky podobný předchozímu bodu (takže má stejné problémy). Možností by bylo použít vlastní sestavení `rsync`0 obalené šifrováním, jako je `rsync`1 (které aktuálně používáme v našem výše uvedeném řešení) prostřednictvím `rsync`2.
* Dalším možným přístupem bylo použití `rsync`3, ale to má omezení 32 GB a vyžadovalo by složité problémy s sestavováním a vývojem.
* Jsou vyžadovány příkazy `rsync`4 (takže to zcela vylučuje použití virtuálních tabulek). Potřebujeme příkazy `rsync`5, aby náš hook s `rsync`6 fungoval správně – což zajišťuje, že data nebudou poškozena a načtené řádky lze převést na platné dokumenty podle našich definic schématu `rsync`7 (které zahrnují omezení, typ proměnné a validaci libovolných dat).
* Téměř všechny projekty kompatibilní s S3 související s SQLite v komunitě open-source jsou v Pythonu (a nikoli v JavaScriptu, který používáme pro 100 % našeho stacku).
* Kompresní knihovny jako `rsync`8 (viz `rsync`9) vypadají slibně, ale __PROTECTED_LINK_189__0. Místo toho bude komprese na straně aplikace u datových typů jako __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 a __PROTECTED_LINK_189__6 čistším a jednodušším přístupem (a také se snáze migruje, protože bychom mohli uložit příznak nebo sloupec __PROTECTED_LINK_189__7 – nebo dokonce použít __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 pro kompresi nebo __PROTECTED_LINK_190__0 pro žádnou kompresi jako metadata databáze).
* Naštěstí již máme v úložišti našeho IMAP serveru implementovanou deduplikaci příloh – proto každá zpráva se stejnou přílohou neuchová kopii přílohy – místo toho se pro více zpráv a vláken v poštovní schránce ukládá jedna příloha (a následně se používá cizí odkaz).
* Projekt Litestream, což je řešení pro replikaci a zálohování SQLite, je velmi slibný a s největší pravděpodobností ho v budoucnu využijeme.
* Nechci diskreditovat autora (autory) – protože jejich práci a přínos k open-source máme rádi již více než deset let – nicméně z reálného používání se zdá, že existují __PROTECTED_LINK_190__1 a __PROTECTED_LINK_190__2.
* Obnova zálohy musí být bezproblémová a triviální. Použití řešení, jako je MongoDB s __PROTECTED_LINK_190__3 a __PROTECTED_LINK_190__4, je nejen zdlouhavé, ale i časově náročné a má složitou konfiguraci.
* Databáze SQLite to zjednodušují (jedná se o jeden soubor).
* Chtěli jsme navrhnout řešení, kde by si uživatelé mohli kdykoli vzít svou poštovní schránku a odejít.
* Jednoduché příkazy Node.js pro __PROTECTED_LINK_190__5 a je trvale smazán z diskového úložiště.
* Podobně můžeme použít API kompatibilní s S3 s HTTP __PROTECTED_LINK_190__6 pro snadné odebrání snapshotů a záloh pro uživatele.
* SQLite byl nejjednodušší, nejrychlejší a nejlevnější řešení.

### Nedostatek alternativ {#lack-of-alternatives}

Pokud je nám známo, žádné jiné e-mailové služby nejsou navrženy tímto způsobem ani nejsou open-source.

Myslíme si, že by to mohlo být způsobeno tím, že stávající e-mailové služby mají v produkčním prostředí starší technologii s [kód špaget](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Většina, ne-li všichni stávající poskytovatelé e-mailových služeb, jsou buď poskytovatelé s uzavřeným zdrojovým kódem, nebo se inzerují jako poskytovatelé s otevřeným zdrojovým kódem, **ale ve skutečnosti je open-source pouze jejich front-end.**

**Nejcitlivější část e-mailu** (skutečné úložiště/interakce IMAP/SMTP) **probíhá na back-endu (serveru) a *nikoli* na front-endu (klientovi)**.

### Vyzkoušejte přeposílání e-mailů {#try-out-forward-email}

Zaregistrujte se ještě dnes na <https://forwardemail.net>! :rocket: