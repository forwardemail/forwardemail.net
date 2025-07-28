# Kvantově odolný e-mail: Jak používáme šifrované poštovní schránky SQLite k zabezpečení vašeho e-mailu {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_70__ Obsah {__CHRÁNĚNÁ_URL_71__

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
  * [Vyzkoušejte Forward Email](#try-out-forward-email)

__CHRÁNĚNÁ_URL_72__ Předmluva {__CHRÁNĚNÁ_URL_73__

> \[!IMPORTANT]
> Our email service is [100% open-source](https://github.com/forwardemail) and privacy-focused through secure and encrypted SQLite mailboxes.

Než jsme spustili [podpora IMAP](/faq#do-you-support-receiving-email-with-imap), používali jsme pro naše potřeby trvalého ukládání dat MongoDB.

Tato technologie je úžasná a používáme ji dodnes – ale abyste mohli mít šifrování v klidu s MongoDB, musíte použít poskytovatele, který nabízí MongoDB Enterprise, jako je Digital Ocean nebo Mongo Atlas – nebo zaplatit podnikovou licenci (a následně musíte pracovat s latencí prodejního týmu).

Náš tým ve společnosti [Přeposlat e-mail](https://forwardemail.net) potřeboval vývojářsky přívětivé, škálovatelné, spolehlivé a šifrované úložné řešení pro poštovní schránky IMAP. Jako vývojáři s otevřeným zdrojovým kódem jsme používání technologie, za kterou je nutné zaplatit licenční poplatek, abyste získali funkci šifrování v klidu, popírali. Proto jsme experimentovali, zkoumali a vyvinuli zcela nové řešení, které tyto potřeby vyřeší.

Místo sdílené databáze pro ukládání vašich poštovních schránek ukládáme a šifrujeme vaše poštovní schránky jednotlivě s vaším heslem (které máte pouze vy). **Naše e-mailová služba je tak bezpečná, že pokud zapomenete heslo, ztratíte svou poštovní schránku** (a budete ji muset obnovit pomocí offline záloh nebo začít znovu).

Čtěte dál, níže se do toho podrobně ponoříme s [srovnání poskytovatelů e-mailových služeb](#email-service-provider-comparison), [jak naše služba funguje](#how-does-it-work), [náš technologický zásobník](#technologies) a dalšími.

## Porovnání poskytovatelů e-mailových služeb {#email-service-provider-comparison}

Jsme jediným 100% poskytovatelem e-mailových služeb s otevřeným zdrojovým kódem a zaměřeným na soukromí, který ukládá jednotlivě šifrované poštovní schránky SQLite, nabízí neomezený počet domén, aliasů a uživatelů a má odchozí podporu SMTP, IMAP a POP3:

**Na rozdíl od jiných poskytovatelů e-mailu nemusíte u služby Forward Email platit za úložiště pro každou doménu nebo alias.** Úložiště je sdíleno v rámci celého vašeho účtu – pokud tedy máte více vlastních domén a u každé z nich více aliasů, jsme pro vás ideálním řešením. Upozorňujeme, že v případě potřeby můžete i nadále vynucovat limity úložiště pro každou doménu nebo alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Přečtěte si srovnání e-mailových služeb <i class="fa fa-search-plus"></i></a>

__CHRÁNĚNÁ_URL_76__ Jak to funguje {__CHRÁNĚNÁ_URL_77__

1. Pomocí svého e-mailového klienta, jako je Apple Mail, Thunderbird, Gmail nebo Outlook – k našim zabezpečeným serverům [IMAP](/faq#do-you-support-receiving-email-with-imap) se připojíte pomocí svého uživatelského jména a hesla:

* Vaše uživatelské jméno je váš úplný alias u vaší domény, například `hello@example.com`.
* Vaše heslo je náhodně generováno a zobrazí se vám pouze 30 sekund po kliknutí na <strong class="text-success"><i class="fa fa-key"></i> Generovat heslo</strong> z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy.

2. Po připojení váš e-mailový klient odešle na náš IMAP server [Příkazy protokolu IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), aby vaše poštovní schránka byla synchronizovaná. To zahrnuje psaní a ukládání konceptů e-mailů a další akce, které můžete provést (např. označení e-mailu jako důležitého nebo nahlášení e-mailu jako spamu/nevyžádané pošty).

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

5. [Zálohy vašich šifrovaných poštovních schránek](#backups) se provádějí denně. Můžete si také kdykoli vyžádat novou zálohu nebo si stáhnout nejnovější zálohu z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy. Pokud se rozhodnete přejít na jinou e-mailovou službu, můžete své poštovní schránky a zálohy kdykoli snadno migrovat, stahovat, exportovat a mazat.

__CHRÁNĚNÁ_URL_78__ Technologie {__CHRÁNĚNÁ_URL_79__

### Databáze {#databases}

Prozkoumali jsme další možné vrstvy úložiště databáze, ale žádná nesplňovala naše požadavky tak jako SQLite:

| Databáze | Šifrování v klidu | Poštovní schránky [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) | Licence | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :hvězdička: | :white_check_mark: Ano s [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :white_check_mark: | :white_check_mark: Veřejná doména | :white_check_mark: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relační databáze | :x: AGPL a `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relační databáze | :white_check_mark: `MIT` | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: `LGPL-3.0-only` | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relační databáze | :white_check_mark: `PostgreSQL` (podobné jako `BSD` nebo `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relační databáze | :white_check_mark: `GPLv2` a `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relační databáze | :x: `BUSL-1.1` a další | :x: |

> Zde je __CHRÁNĚNÝ_LINK_141__ v tabulce výše.

__CHRÁNĚNÁ_URL_82__ Zabezpečení {__CHRÁNĚNÁ_URL_83__

U poštovních schránek vždy používáme šifrování [šifrování v klidu](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [šifrování při přenosu](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS přes HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") s využitím :tangerine: [Mandarinka](https://tangeri.ne) a [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Dále používáme dvoufaktorové ověřování založené na tokenech (na rozdíl od SMS, které je podezřelé z [man-in-the-middle-attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), rotované SSH klíče se zakázaným root přístupem, exkluzivní přístup k serverům prostřednictvím omezených IP adres a další.

V případě [útok zlé služky](https://en.wikipedia.org/wiki/Evil_maid_attack) nebo nepoctivého zaměstnance třetí strany bude **vaši poštovní schránku stále možné otevřít pouze s vámi vygenerovaným heslem**. Ujišťujeme vás, že se nespoléháme na žádné třetí strany kromě našich poskytovatelů serverů pro stížnosti SOC typu 2, jako jsou Cloudflare, DataPacket, Digital Ocean a Vultr.

Naším cílem je mít co nejméně [jediný bod selhání](https://en.wikipedia.org/wiki/Single_point_of_failure).

__CHRÁNĚNÁ_URL_84__ Poštovní schránky {__CHRÁNĚNÁ_URL_85__

> **tldr;** Naše IMAP servery používají individuálně šifrované databáze SQLite pro každou z vašich poštovních schránek.

[SQLite je velmi populární](https://www.sqlite.org/mostdeployed.html) vestavěná databáze – aktuálně běží na vašem telefonu a počítači – [a používají téměř všechny hlavní technologie](https://www.sqlite.org/famous.html).

Například na našich šifrovaných serverech existuje databázová schránka SQLite pro `linux@example.com`, `info@example.com`, `hello@example.com` a tak dále – jedna pro každou z nich jako databázový soubor `.sqlite`. Soubory databáze také nepojmenováváme e-mailovou adresou – místo toho používáme BSON ObjectID a vygenerované jedinečné UUID, které nesdílejí, komu schránka patří ani pod jakou e-mailovou adresou je (např. `353a03f21e534321f5d6e267.sqlite`).

Každá z těchto databází je šifrována pomocí vašeho hesla (které znáte pouze vy) s použitím [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). To znamená, že vaše poštovní schránky jsou individuálně šifrované, samostatné, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) a přenosné.

Doladili jsme SQLite pomocí následujícího [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Účel |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Pro více informací viz `better-sqlite3-multiple-ciphers` pod [Projects](#projects). |
| `key="****************"` | Toto je vaše dešifrované heslo pouze v paměti, které se předává prostřednictvím připojení IMAP vašeho e-mailového klienta k našemu serveru.  Pro každou relaci čtení a zápisu se vytvářejí a zavírají nové instance databáze (aby se zajistilo sandboxing a izolace). |
| `journal_model=WAL` | Záznam předzápisu („[WAL](https://www.sqlite.org/wal.html)“) [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Zabraňuje chybám zápisu [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Zvyšuje trvanlivost transakcí [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Vynucuje, aby byly vynuceny odkazy na cizí klíče (např. relace z jedné tabulky do druhé). [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), ale pro ověření a integritu dat by měla být povolena. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) pro zajištění bezpečnosti vývojářů. |

> Všechny ostatní výchozí hodnoty pocházejí z SQLite, jak je uvedeno v [oficiální dokumentace PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Souběžnost {#concurrency}

> **tldr;** Pro souběžné čtení a zápisy do vašich šifrovaných poštovních schránek SQLite používáme `WebSocket`.

#### Přečteno {#reads}

Váš e-mailový klient v telefonu může přeložit `imap.forwardemail.net` na jednu z našich IP adres Digital Ocean – a váš desktopový klient může přeložit jinou IP adresu z úplně jiné [poskytovatel](#providers).

Bez ohledu na to, ke kterému serveru IMAP se váš e-mailový klient připojuje, chceme, aby připojení načítalo z vaší databáze v reálném čase se 100% přesností.  To se provádí prostřednictvím WebSockets.

#### Zapisuje {#writes}

Zápis do vaší databáze je trochu jiný – protože SQLite je vestavěná databáze a vaše poštovní schránka žije ve výchozím nastavení v jediném souboru.

Prozkoumali jsme níže uvedené možnosti jako `litestream`, `rqlite` a `dqlite` – žádná z nich však nesplňovala naše požadavky.

Abychom mohli provádět zápisy s povoleným protokolováním předběžného zápisu („[WAL](https://www.sqlite.org/wal.html)“), musíme zajistit, aby za to byl zodpovědný pouze jeden server („primární“). [WAL](https://www.sqlite.org/wal.html) drasticky zrychluje souběžnost a umožňuje jeden zapisovač a více čtenářů.

Primární server běží na datových serverech s připojenými svazky obsahujícími šifrované poštovní schránky. Z hlediska distribuce byste mohli všechny jednotlivé servery IMAP za `imap.forwardemail.net` považovat za sekundární servery („Sekundární“).

Obousměrnou komunikaci zajišťujeme s [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primární servery používají instanci serveru `WebSocketServer` od [ws](https://github.com/websockets/ws).
* Sekundární servery používají instanci klienta `WebSocket` od [ws](https://github.com/websockets/ws), která je obalena pomocí [websocket-jak-slíbil](https://github.com/vitalets/websocket-as-promised) a [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Tyto dva obaly zajišťují, že se `WebSocket` znovu připojí a může odesílat a přijímat data pro specifické zápisy do databáze.

### Zálohy {#backups}

> **tldr;** Zálohy vašich šifrovaných poštovních schránek se vytvářejí denně. Můžete si také okamžitě vyžádat novou zálohu nebo si kdykoli stáhnout nejnovější zálohu z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy.

Pro zálohy jednoduše spouštíme každý den během zpracování příkazu IMAP příkaz SQLite `VACUUM INTO`, který využívá vaše šifrované heslo z připojení IMAP v paměti. Zálohy se ukládají, pokud není detekována žádná existující záloha nebo pokud se hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) v souboru změnil ve srovnání s nejnovější zálohou.

Všimněte si, že používáme příkaz `VACUUM INTO` na rozdíl od vestavěného příkazu `backup`, protože pokud je stránka upravena během operace s příkazem `backup`, musí začít znovu. Příkaz `VACUUM INTO` pořídí snímek stránky. Pro více informací si přečtěte tyto komentáře k [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) a [Hackerské zprávy](https://news.ycombinator.com/item?id=31387556).

Dále používáme `VACUUM INTO` na rozdíl od `backup`, protože příkaz `backup` by ponechal databázi na krátkou dobu nešifrovanou, dokud by nebyl vyvolán `rekey` (viz tento GitHub [komentář](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) pro více informací).

Sekundární server dá pokyn primárnímu serveru přes připojení `WebSocket` k provedení zálohy – a primární server poté obdrží příkaz k provedení této zálohy a následně:

1. Připojte se k vaší šifrované schránce.
2. Získejte zámek proti zápisu.
3. Spusťte kontrolní bod WAL pomocí `wal_checkpoint(PASSIVE)`.
4. Spusťte příkaz `VACUUM INTO` SQLite.
5. Ujistěte se, že zkopírovaný soubor lze otevřít pomocí šifrovaného hesla (ochrana/ochrana před falešnými hesly).
6. Nahrajte jej do Cloudflare R2 pro uložení (nebo k vašemu vlastnímu poskytovateli, pokud je uveden).

<!--
7. Výsledný záložní soubor zkomprimujte pomocí kódu `gzip`.
8. Nahrajte jej do úložiště Cloudflare R2 (nebo k vašemu vlastnímu poskytovateli, pokud je uveden).
-->

Pamatujte, že vaše e-mailové schránky jsou šifrované – a přestože máme pro komunikaci WebSocket zavedena omezení IP a další autentizační opatření – v případě špatného aktéra si můžete být jisti, že pokud obsah WebSocket nemá vaše heslo IMAP, nemůže otevřít vaši databázi.

V současné době je pro každou poštovní schránku uložena pouze jedna záloha, ale v budoucnu můžeme nabídnout obnovení k určitému bodu v čase („[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)“).

__CHRÁNĚNÁ_URL_94__ Hledat {__CHRÁNĚNÁ_URL_95__

Naše IMAP servery podporují příkaz `SEARCH` se složitými dotazy, regulárními výrazy a dalšími funkcemi.

Rychlé vyhledávání je možné díky [FTS5](https://www.sqlite.org/fts5.html) a [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Hodnoty `Date` ukládáme do poštovních schránek SQLite jako řetězce [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) prostřednictvím [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (s časovým pásmem UTC, aby porovnávání rovnosti fungovalo správně).

Indexy jsou také uloženy pro všechny vlastnosti, které jsou ve vyhledávacích dotazech.

__CHRÁNĚNÁ_URL_96__ Projekty {__CHRÁNĚNÁ_URL_97__

Zde je tabulka s přehledem projektů, které používáme v našem zdrojovém kódu a procesu vývoje (seřazeno abecedně):

| Projekt | Účel |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Automatizační platforma DevOps pro snadnou údržbu, škálování a správu celé naší flotily serverů. |
| [Bree](https://github.com/breejs/bree) | Plánovač úloh pro Node.js a JavaScript s podporou cronu, dat, ms, novější a uživatelsky přívětivou podporou. |
| [Cabin](https://github.com/cabinjs/cabin) | Vývojářská knihovna JavaScript a protokolování Node.js s ohledem na bezpečnost a soukromí. |
| [Lad](https://github.com/ladjs/lad) | Node.js framework, který pohání celou naši architekturu a inženýrský design s MVC a dalšími. |
| [MongoDB](https://www.mongodb.com/) | NoSQL databázové řešení, které používáme pro ukládání všech ostatních dat mimo poštovní schránky (např. váš účet, nastavení, domény a konfigurace aliasů). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modelování objektových dokumentů MongoDB („ODM“), které používáme v celém našem stacku. Napsali jsme speciální pomocníky, které nám umožňují jednoduše pokračovat v používání **Mongoose s SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js je open-source, multiplatformní běhové prostředí JavaScriptu, které spouští všechny naše serverové procesy. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Balíček Node.js pro odesílání e-mailů, vytváření spojení a další.  Jsme oficiálním sponzorem tohoto projektu. |
| [Redis](https://redis.io/) | Databáze v paměti pro ukládání do mezipaměti, kanály pro publikování/odběry a DNS přes požadavky HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Šifrovací rozšíření pro SQLite, které umožňuje šifrování celých databázových souborů (včetně protokolu předzápisu („[WAL](https://www.sqlite.org/wal.html)“), žurnálu, rollbacku atd.). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visual SQLite editor (který můžete také použít) k testování, stahování a prohlížení vývojových poštovních schránek. |
| [SQLite](https://www.sqlite.org/about.html) | Vestavěná databázová vrstva pro škálovatelné, samostatné, rychlé a odolné úložiště IMAP. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Nástroj Node.js pro ochranu před spamem, filtrování e-mailů a prevenci phishingu (naše alternativa k [Spam Assassin](https://spamassassin.apache.org/) a [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Požadavky DNS přes HTTPS s Node.js a ukládání do mezipaměti pomocí Redis – což zajišťuje globální konzistenci a mnoho dalšího. |
| [Thunderbird](https://www.thunderbird.net/) | Náš vývojový tým používá tento program (a také jej doporučuje) jako **preferovaného e-mailového klienta pro použití s funkcí Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Náš vývojový tým používá toto vytvoření virtuálních strojů pro iOS a macOS k testování různých e-mailových klientů (paralelně) s našimi servery IMAP a SMTP. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderní open-source serverový operační systém na bázi Linuxu, který pohání veškerou naši infrastrukturu. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Knihovna serveru IMAP – viz poznámky k [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) a [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Rychlá a jednoduchá knihovna API pro Node.js pro programovou interakci s SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Vývojářský e-mailový rámec pro vytváření, náhled a odesílání vlastních e-mailů (např. oznámení o účtu a další). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Tvůrce SQL dotazů s využitím syntaxe ve stylu Mongo. To šetří čas našemu vývojovému týmu, protože můžeme i nadále psát ve stylu Mongo napříč celým stackem s přístupem nezávislým na databázi. **Pomáhá to také vyhnout se útokům SQL injection pomocí parametrů dotazu.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL utilita pro extrakci informací o existujícím schématu databáze. To nám umožňuje snadno ověřit, zda jsou všechny indexy, tabulky, sloupce, omezení a další platné a zda odpovídají `1:1` tomu, jak by měly být. Dokonce jsme napsali automatické pomocníky pro přidání nových sloupců a indexů, pokud dojde ke změnám ve schématech databáze (a to i s extrémně podrobným upozorněním na chyby). |
| [knex](https://github.com/knex/knex) | Tvůrce SQL dotazů, který používáme pouze pro migrace databází a validaci schématu prostřednictvím `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatický překlad frází [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) s podporou Markdownu pomocí [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Balíček Node.js k vyřešení a navázání spojení se servery MX a zpracování chyb. |
| [pm2](https://github.com/Unitech/pm2) | Správce produkčních procesů Node.js s vestavěným vyvažovačem zátěže ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) pro výkon). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Knihovna serverů SMTP – používáme ji pro naše servery pro výměnu pošty ("MX") a odchozí SMTP servery. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Užitečný nástroj pro testování serverů IMAP oproti benchmarkům a kompatibilitě protokolu IMAP dle specifikace RFC. Tento projekt vytvořil tým [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (aktivní open-source server IMAP a POP3 od července 2002). S tímto nástrojem jsme náš server IMAP rozsáhle testovali. |

> Další projekty, které používáme, najdete na __CHRAŇENÝ_LINK_177__.

### Poskytovatelé {#providers}

| Poskytovatel | Účel |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Poskytovatel DNS, kontroly stavu, vyrovnávače zátěže a úložiště záloh pomocí [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikovaný server hosting a spravované databáze. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dedikovaný server hosting. |
| [DataPacket](https://www.datapacket.com) | Dedikovaný server hosting. |

## Myšlenky {#thoughts}

### Zásady {#principles}

Přeposílání e-mailů je navrženo podle těchto zásad:

1. Vždy buďte vstřícní k vývojářům, zaměření na bezpečnost a soukromí a transparentní.
2. Dodržujte [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Dvanáctý faktor](https://12factor.net/), [Occamova břitva](https://en.wikipedia.org/wiki/Occam%27s_razor) a [krmivo pro psy](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Zaměřte se na neetické, bootstrapované a [ramen-výnosný](http://www.paulgraham.com/ramenprofitable.html) vývojáře

__CHRÁNĚNÁ_URL_104__ Experimenty {__CHRÁNĚNÁ_URL_105__

> **tldr;** Použití objektového úložiště kompatibilního s S3 a/nebo virtuálních tabulek není z důvodu výkonu technicky proveditelné a je náchylné k chybám kvůli omezením paměti.

Udělali jsme několik experimentů vedoucích k našemu konečnému řešení SQLite, jak je uvedeno výše.

Jedním z nich bylo zkusit použít [rclone]() a SQLite společně s úložnou vrstvou kompatibilní s S3.

Tento experiment nás vedl k hlubšímu pochopení a objevení okrajových případů týkajících se používání rclone, SQLite a [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Pokud povolíte příznak `--vfs-cache-mode writes` pomocí rclone, čtení bude v pořádku, nicméně zápisy se budou ukládat do mezipaměti.
* Pokud máte více serverů IMAP distribuovaných globálně, mezipaměť bude napříč nimi vypnuta, pokud nemáte jeden zapisovač a více posluchačů (např. přístup pub/sub).
* Toto je neuvěřitelně složité a jakékoli přidání další složitosti, jako je toto, povede k více jednotlivým bodům selhání. (S3-compatible storage providers) nepodporují částečné změny souborů – což znamená, že jakákoli změna souboru `.sqlite` povede k úplné změně a opětovnému nahrání databáze.
* Existují i jiná řešení, jako je `rsync`, ale ta se nezaměřují na podporu protokolování předběžného zápisu („[WAL](https://www.sqlite.org/wal.html)“) – takže jsme nakonec recenzovali Litestream. Naštěstí naše šifrování již šifruje soubory [WAL](https://www.sqlite.org/wal.html), takže se v tomto případě nemusíme spoléhat na Litestream. Nicméně jsme si s Litestreamem pro produkční použití ještě nebyli jisti a níže k tomu uvádíme několik poznámek.
* Použití této možnosti `--vfs-cache-mode writes` (*jediný* způsob, jak použít SQLite přes `rclone` pro zápisy) se pokusí zkopírovat celou databázi od nuly do paměti – zpracování jedné 10GB poštovní schránky je v pořádku, nicméně zpracování více poštovních schránek s nadměrně velkým úložištěm způsobí, že servery IMAP narazí na omezení paměti a chyby `ENOMEM`, chyby segmentace a poškození dat.
* Pokud se pokusíte použít SQLite [Virtuální stoly](https://www.sqlite.org/vtab.html) (např. pomocí [s3db](https://github.com/jrhy/s3db)) pro uložení dat na úložné vrstvě kompatibilní s S3, narazíte na několik dalších problémů:
* Čtení a zápis budou extrémně pomalé, protože koncové body S3 API bude nutné oslovit metodami HTTP `GET`, `PUT`, `HEAD` a `POST`.
* Vývojové testy ukázaly, že překročení 500 000 až 1 milionu+ záznamů na optickém internetu je stále omezeno propustností zápisu a čtení do poskytovatelů kompatibilních s S3. Například naši vývojáři spustili smyčky `for` pro provedení jak sekvenčních příkazů SQL `INSERT`, tak i těch, které hromadně zapisovaly velké množství dat. V obou případech byl výkon ohromně pomalý.
* Virtuální tabulky **nemohou mít indexy**, příkazy `ALTER TABLE` a [ostatní](https://stackoverflow.com/a/12507650) [omezení](https://sqlite.org/lang_createvtab.html) – což vede ke zpožděním až 1–2 minuty nebo i více v závislosti na množství dat.
* Objekty byly uloženy nešifrované a není k dispozici žádná nativní podpora šifrování.
* Zkoumali jsme také použití [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs), které je koncepčně a technicky podobné předchozímu bodu (takže má stejné problémy). Možností by bylo použití vlastního `sqlite3` se šifrováním, jako například [wxSQLite3](https://github.com/utelle/wxsqlite3) (který aktuálně používáme v našem výše uvedeném řešení) prostřednictvím [editaci instalačního souboru](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Dalším možným přístupem bylo použití [multiplexní rozšíření](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), ale to má omezení 32 GB a vyžadovalo by to složité problémy s sestavováním a vývojem.
* Příkazy `ALTER TABLE` jsou povinné (takže to zcela vylučuje použití virtuálních tabulek). Aby náš hook s `knex-schema-inspector` fungoval správně, potřebujeme příkazy `ALTER TABLE` – což zajišťuje, že data nebudou poškozena a načtené řádky lze převést na platné dokumenty podle našich definic schématu `mongoose` (které zahrnují omezení, typ proměnné a validaci libovolných dat).
* Téměř všechny projekty kompatibilní s S3 související s SQLite v open-source komunitě jsou v Pythonu (a nikoli v JavaScriptu, který používáme pro 100 % našeho stacku).
* Kompresní knihovny jako [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (viz [komentáře](https://news.ycombinator.com/item?id=32303762)) vypadají slibně, ale [ještě nemusí být připraveno k produkčnímu použití](https://github.com/phiresky/sqlite-zstd#usage). Místo toho bude komprese na straně aplikace u datových typů, jako jsou `String`, `Object`, `Map`, `Array`, `Set` a `Buffer`, čistším a jednodušším přístupem (a také se snáze migruje, protože bychom mohli uložit příznak nebo sloupec `Boolean` – nebo dokonce použít `PRAGMA` `user_version=1` pro kompresi nebo `user_version=0` pro žádnou kompresi jako metadata databáze). * Naštěstí již máme v úložišti našeho IMAP serveru implementovanou deduplikaci příloh – proto si každá zpráva se stejnou přílohou neuchová kopii přílohy – místo toho se v poštovní schránce ukládá jedna příloha pro více zpráv a vláken (a následně se použije cizí odkaz).
* Projekt Litestream, což je řešení replikace a zálohování SQLite, je velmi slibný a s největší pravděpodobností ho v budoucnu využijeme.
* Nechci zdiskreditovat autora (autory) – protože jejich práci a příspěvky k open-source milujeme již více než deset let – nicméně z reálného používání se zdá, že existují [může hodně bolet hlava](https://github.com/benbjohnson/litestream/issues) a [potenciální ztrátu dat při používání](https://github.com/benbjohnson/litestream/issues/218).
* Obnova zálohy musí být bezproblémová a triviální. Použití řešení, jako je MongoDB s `mongodump` a `mongoexport`, je nejen zdlouhavé, ale i časově náročné a má složitou konfiguraci.
* Databáze SQLite to zjednodušují (je to jeden soubor).
* Chtěli jsme navrhnout řešení, kde by si uživatelé mohli kdykoli vzít svou poštovní schránku a odejít.
* Jednoduché příkazy Node.js pro `fs.unlink('mailbox.sqlite'))` a ta se trvale smaže z diskového úložiště.
* Podobně můžeme použít S3-kompatibilní API s HTTP `DELETE` pro snadné odstranění snapshotů a záloh pro uživatele.
* SQLite bylo nejjednodušší, nejrychlejší a cenově nejvýhodnější řešení.

### Nedostatek alternativ {#lack-of-alternatives}

Pokud je nám známo, žádné jiné e-mailové služby nejsou takto navrženy ani nejsou open source.

Myslíme si, že by to mohlo být způsobeno tím, že stávající e-mailové služby používají starší technologii v produkčním prostředí s [špagetové ocasy](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Většina, ne-li všichni stávající poskytovatelé e-mailových služeb, jsou buď poskytovatelé s uzavřeným zdrojovým kódem, nebo se inzerují jako poskytovatelé s otevřeným zdrojovým kódem, **ale ve skutečnosti je open-source pouze jejich front-end.**

**Nejcitlivější část e-mailu** (skutečné úložiště/interakce IMAP/SMTP) **probíhá na back-endu (serveru) a *nikoli* na front-endu (klientovi)**.

### Vyzkoušejte přeposílání e-mailů {#try-out-forward-email}

Zaregistrujte se ještě dnes na <https://forwardemail.net>! :rocket: