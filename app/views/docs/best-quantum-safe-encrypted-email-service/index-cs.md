# Quantum Resistant Email: Jak používáme šifrované SQLite schránky k ochraně vašich e-mailů {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Porovnání poskytovatelů e-mailových služeb](#email-service-provider-comparison)
* [Jak to funguje](#how-does-it-work)
* [Technologie](#technologies)
  * [Databáze](#databases)
  * [Bezpečnost](#security)
  * [Schránky](#mailboxes)
  * [Současnost](#concurrency)
  * [Zálohy](#backups)
  * [Vyhledávání](#search)
  * [Projekty](#projects)
  * [Poskytovatelé](#providers)
* [Úvahy](#thoughts)
  * [Principy](#principles)
  * [Experimenty](#experiments)
  * [Nedostatek alternativ](#lack-of-alternatives)
  * [Vyzkoušejte Forward Email](#try-out-forward-email)


## Předmluva {#foreword}

> \[!IMPORTANT]
> Naše e-mailová služba je [100% open-source](https://github.com/forwardemail) a zaměřená na soukromí díky zabezpečeným a šifrovaným SQLite schránkám.

Dokud jsme nespustili [podporu IMAP](/faq#do-you-support-receiving-email-with-imap), používali jsme MongoDB pro naše potřeby trvalého ukládání dat.

Tato technologie je úžasná a stále ji používáme – ale abyste měli šifrování dat v klidu (encryption-at-rest) u MongoDB, musíte použít poskytovatele, který nabízí MongoDB Enterprise, jako je Digital Ocean nebo Mongo Atlas – nebo zaplatit za enterprise licenci (a následně řešit zpoždění se sales týmem).

Náš tým ve [Forward Email](https://forwardemail.net) potřeboval vývojářsky přívětivé, škálovatelné, spolehlivé a šifrované úložiště pro IMAP schránky. Jako open-source vývojáři bylo používání technologie, za kterou musíte platit licenci, abyste získali funkci šifrování dat v klidu, proti [našim principům](#principles) – a tak jsme experimentovali, zkoumali a vyvinuli nové řešení od základu, abychom tyto potřeby vyřešili.

Místo používání sdílené databáze pro ukládání vašich schránek, ukládáme a šifrujeme každou schránku individuálně vaším heslem (které znáte pouze vy).  **Naše e-mailová služba je tak bezpečná, že pokud zapomenete své heslo, přijdete o svou schránku** (a musíte ji obnovit z offline záloh nebo začít znovu).

Pokračujte ve čtení, kde se podrobně podíváme na [porovnání poskytovatelů e-mailových služeb](#email-service-provider-comparison), [jak naše služba funguje](#how-does-it-work), [náš technologický stack](#technologies) a další.


## Porovnání poskytovatelů e-mailových služeb {#email-service-provider-comparison}

Jsme jediný 100% open-source a na soukromí zaměřený poskytovatel e-mailových služeb, který ukládá individuálně šifrované SQLite schránky, nabízí neomezené domény, aliasy a uživatele a podporuje odchozí SMTP, IMAP a POP3:

**Na rozdíl od jiných poskytovatelů e-mailu nemusíte u Forward Email platit za úložiště na základě domény nebo aliasu.** Úložiště je sdílené napříč celým vaším účtem – takže pokud máte více vlastních domén a na každé více aliasů, jsme pro vás ideálním řešením. Poznámka: stále můžete nastavit limity úložiště na základě domény nebo aliasu, pokud si přejete.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Přečtěte si porovnání e-mailových služeb <i class="fa fa-search-plus"></i></a>


## Jak to funguje {#how-does-it-work}

1. Pomocí svého e-mailového klienta, jako je Apple Mail, Thunderbird, Gmail nebo Outlook, se připojíte k našim zabezpečeným [IMAP](/faq#do-you-support-receiving-email-with-imap) serverům pomocí svého uživatelského jména a hesla:

   * Vaše uživatelské jméno je váš plný alias s doménou, například `hello@example.com`.
   * Vaše heslo je náhodně vygenerované a zobrazuje se vám pouze 30 sekund po kliknutí na <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy.
2. Po připojení váš e-mailový klient bude odesílat [příkazy protokolu IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) na náš IMAP server, aby udržel vaši poštovní schránku synchronizovanou. To zahrnuje psaní a ukládání konceptů e-mailů a další akce, které můžete provádět (např. označit e-mail jako Důležitý nebo označit e-mail jako Spam/Nevyžádaná pošta).

3. Servery pro výměnu pošty (běžně známé jako "MX" servery) přijímají nové příchozí e-maily a ukládají je do vaší poštovní schránky. Když k tomu dojde, váš e-mailový klient bude upozorněn a synchronizuje vaši poštovní schránku. Naše servery pro výměnu pošty mohou přeposlat váš e-mail jednomu nebo více příjemcům (včetně [webhooků](/faq#do-you-support-webhooks)), uložit váš e-mail pro vás v našem šifrovaném IMAP úložišti, **nebo obojí**!

   > \[!TIP]
   > Máte zájem dozvědět se více? Přečtěte si [jak nastavit přeposílání e-mailů](/faq#how-do-i-get-started-and-set-up-email-forwarding), [jak funguje náš systém pro výměnu pošty](/faq#how-does-your-email-forwarding-system-work) nebo si prohlédněte [naše návody](/guides).

4. V zákulisí náš bezpečný design úložiště e-mailů funguje dvěma způsoby, aby vaše poštovní schránky zůstaly šifrované a přístupné pouze vám:

   * Když je pro vás přijata nová pošta od odesílatele, naše servery pro výměnu pošty zapíší do individuální, dočasné a šifrované poštovní schránky pro vás.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Příchozí zpráva přijata pro váš alias (např. vy@vasedomena.cz).
         MX->>SQLite: Zpráva je uložena v dočasné poštovní schránce.
         Note over MX,SQLite: Přeposílá ostatním příjemcům a nakonfigurovaným webhookům.
         MX->>Sender: Úspěch!
     ```

   * Když se připojíte k našemu IMAP serveru pomocí e-mailového klienta, vaše heslo je poté zašifrováno v paměti a použito k čtení a zápisu do vaší poštovní schránky. Vaše poštovní schránka může být čtena a zapisována pouze s tímto heslem. Mějte na paměti, že protože jste jediný, kdo toto heslo má, **pouze vy** můžete číst a zapisovat do své poštovní schránky, když k ní přistupujete. Při dalším pokusu vašeho e-mailového klienta o kontrolu pošty nebo synchronizaci budou vaše nové zprávy přeneseny z této dočasné poštovní schránky a uloženy do vašeho skutečného souboru poštovní schránky pomocí vámi zadaného hesla. Všimněte si, že tato dočasná poštovní schránka je následně vymazána a odstraněna, takže zprávy jsou pouze ve vaší heslem chráněné poštovní schránce.

   * **Pokud jste připojeni k IMAP (např. pomocí e-mailového klienta jako Apple Mail nebo Thunderbird), pak nemusíme zapisovat na dočasné diskové úložiště. Vaše zašifrované heslo IMAP v paměti je místo toho načteno a použito. V reálném čase, když se zpráva pokouší být doručena vám, odesíláme WebSocket požadavek všem IMAP serverům, zda mají aktivní relaci pro vás (to je část načítání), a následně předáme toto zašifrované heslo v paměti – takže nemusíme zapisovat do dočasné poštovní schránky, můžeme zapisovat do vaší skutečné zašifrované poštovní schránky pomocí vašeho zašifrovaného hesla.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Připojíte se k IMAP serveru pomocí e-mailového klienta.
         IMAP->>SQLite: Přenese zprávu z dočasné poštovní schránky do poštovní schránky vašeho aliasu.
         Note over IMAP,SQLite: Poštovní schránka vašeho aliasu je dostupná pouze v paměti pomocí IMAP hesla.
         SQLite->>IMAP: Načte zprávy dle požadavku e-mailového klienta.
         IMAP->>You: Úspěch!
     ```

5. [Zálohy vašich zašifrovaných poštovních schránek](#backups) jsou vytvářeny denně. Můžete také kdykoli požádat o novou zálohu nebo stáhnout nejnovější zálohu z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy. Pokud se rozhodnete přejít k jinému e-mailovému poskytovateli, můžete své poštovní schránky a zálohy kdykoli snadno migrovat, stáhnout, exportovat a vymazat.


## Technologie {#technologies}

### Databáze {#databases}

Prozkoumali jsme jiné možné vrstvy úložiště databází, avšak žádná nesplnila naše požadavky tak dobře jako SQLite:
| Databáze                                               |                                                                    Šifrování v klidu                                                                   |  [Sandboxované](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Poštovní schránky  |                           Licence                           | [Používá se všude](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ano s [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Veřejná doména              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Dostupné pouze v MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relační databáze                               |                   :x: AGPL a `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Pouze síťové](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relační databáze                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Netestováno a zatím nepodporováno?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Netestováno a zatím nepodporováno?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ano](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relační databáze                               | :white_check_mark: `PostgreSQL` (podobné `BSD` nebo `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Pouze pro InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relační databáze                               |          :white_check_mark: `GPLv2` a `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Funkce pouze pro Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relační databáze                               |                  :x: `BUSL-1.1` a další                  |                             :x:                             |

> Zde je [blogový příspěvek, který porovnává několik možností ukládání databáze SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) v tabulce výše.

### Bezpečnost {#security}

Vždy používáme [šifrování v klidu](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [šifrování při přenosu](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS přes HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") pomocí :tangerine: [Tangerine](https://tangeri.ne), a [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) šifrování poštovních schránek. Dále používáme dvoufaktorovou autentizaci založenou na tokenu (na rozdíl od SMS, která je náchylná k [útokům typu man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), rotované SSH klíče s deaktivovaným root přístupem, exkluzivní přístup k serverům přes omezené IP adresy a další.
V případě [útoku zlého služebníka](https://en.wikipedia.org/wiki/Evil_maid_attack) nebo zrádného zaměstnance třetí strany **lze vaši schránku otevřít pouze pomocí vašeho vygenerovaného hesla**. Buďte ujištěni, že nespoléháme na žádné třetí strany kromě našich poskytovatelů serverů s certifikací SOC Type 2, kterými jsou Cloudflare, DataPacket, Digital Ocean, GitHub a Vultr.

Naším cílem je mít co nejméně [jediných bodů selhání](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Schránky {#mailboxes}

> **shrnutí;** Naše IMAP servery používají individuálně šifrované SQLite databáze pro každou vaši schránku.

[SQLite je extrémně populární](https://www.sqlite.org/mostdeployed.html) vestavěná databáze – momentálně běží na vašem telefonu i počítači – [a používá ji téměř všechny hlavní technologie](https://www.sqlite.org/famous.html).

Například na našich šifrovaných serverech je SQLite databáze schránky pro `linux@example.com`, `info@example.com`, `hello@example.com` a tak dále – jedna pro každou jako `.sqlite` databázový soubor. Databázové soubory také nenazýváme podle e-mailové adresy – místo toho používáme BSON ObjectID a unikátní UUID, které neprozrazují, komu schránka patří nebo pod jakou e-mailovou adresou je (např. `353a03f21e534321f5d6e267.sqlite`).

Každá z těchto databází je sama o sobě šifrována pomocí vašeho hesla (které máte pouze vy) pomocí [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). To znamená, že vaše schránky jsou individuálně šifrované, samostatné, [sandboxované](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) a přenosné.

SQLite jsme doladili pomocí následujících [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Účel                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Šifrování SQLite databáze ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Pro více informací viz `better-sqlite3-multiple-ciphers` v sekci [Projects](#projects).                                     |
| `key="****************"` | Toto je vaše dešifrované heslo pouze v paměti, které je předáváno přes IMAP připojení vašeho e-mailového klienta na náš server. Nové instance databáze jsou vytvářeny a uzavírány pro každou čtecí a zápisovou relaci (pro zajištění sandboxingu a izolace). |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [který zvyšuje výkon a umožňuje současný přístup ke čtení](https://litestream.io/tips/#wal-journal-mode).                                                                                     |
| `busy_timeout=5000`      | Zabraňuje chybám zámku zápisu [zatímco probíhají jiné zápisy](https://litestream.io/tips/#busy-timeout).                                                                                                                                                  |
| `synchronous=NORMAL`     | Zvyšuje odolnost transakcí [bez rizika poškození dat](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                                   |
| `foreign_keys=ON`        | Vynucuje, aby byly dodržovány cizí klíče (např. vztah z jedné tabulky do druhé). [Ve výchozím nastavení není v SQLite zapnuto](https://www.sqlite.org/foreignkeys.html), ale pro validaci a integritu dat by mělo být povoleno.                           |
| `encoding='UTF-8'`       | [Výchozí kódování](https://www.sqlite.org/pragma.html#pragma_encoding) používané pro zajištění přehlednosti vývojáře.                                                                                                                                      |
> Všechny ostatní výchozí hodnoty jsou ze SQLite, jak je uvedeno v [oficiální dokumentaci PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Současný přístup {#concurrency}

> **shrnutí;** Používáme `WebSocket` pro současné čtení a zápis do vašich šifrovaných SQLite poštovních schránek.

#### Čtení {#reads}

Váš e-mailový klient na telefonu může rozlišit `imap.forwardemail.net` na jednu z našich IP adres Digital Ocean – a váš desktopový klient může rozlišit jinou IP adresu od jiného [poskytovatele](#providers).

Bez ohledu na to, ke kterému IMAP serveru se váš e-mailový klient připojuje, chceme, aby připojení četlo z vaší databáze v reálném čase s 100% přesností. To je realizováno pomocí WebSocketů.

#### Zápisy {#writes}

Zápis do vaší databáze je trochu jiný – protože SQLite je vestavěná databáze a vaše poštovní schránka je ve výchozím nastavení uložena v jednom souboru.

Prozkoumali jsme možnosti jako `litestream`, `rqlite` a `dqlite` níže – ale žádná z nich nesplnila naše požadavky.

Pro provádění zápisů s povoleným write-ahead-loggingem ("[WAL](https://www.sqlite.org/wal.html)") – musíme zajistit, že pouze jeden server ("Primární") je za to zodpovědný.  [WAL](https://www.sqlite.org/wal.html) výrazně zrychluje souběžnost a umožňuje jednoho zapisovatele a více čtenářů.

Primární server běží na datových serverech s připojenými svazky obsahujícími šifrované poštovní schránky. Z hlediska distribuce můžete považovat všechny jednotlivé IMAP servery za `imap.forwardemail.net` za sekundární servery ("Sekundární").

Dvoustrannou komunikaci realizujeme pomocí [WebSocketů](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Primární servery používají instanci serveru `WebSocketServer` z [ws](https://github.com/websockets/ws).
* Sekundární servery používají instanci klienta `WebSocket` z [ws](https://github.com/websockets/ws), která je zabalena pomocí [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) a [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Tyto dva obaly zajišťují, že se `WebSocket` znovu připojí a může odesílat a přijímat data pro konkrétní zápisy do databáze.

### Zálohy {#backups}

> **shrnutí;** Zálohy vašich šifrovaných poštovních schránek se vytvářejí denně. Můžete také kdykoli okamžitě požádat o novou zálohu nebo stáhnout nejnovější zálohu z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasů.

Pro zálohy jednoduše spouštíme příkaz SQLite `VACUUM INTO` každý den během zpracování IMAP příkazů, který využívá vaše šifrované heslo z paměťového IMAP připojení. Zálohy jsou ukládány, pokud není detekována žádná existující záloha nebo pokud se změnil [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash souboru ve srovnání s nejnovější zálohou.

Všimněte si, že používáme příkaz `VACUUM INTO` místo vestavěného příkazu `backup`, protože pokud je stránka během operace příkazu `backup` upravena, musí se operace začít znovu. Příkaz `VACUUM INTO` pořídí snímek. Více informací najdete v těchto komentářích na [GitHubu](https://github.com/benbjohnson/litestream.io/issues/56) a [Hacker News](https://news.ycombinator.com/item?id=31387556).

Dále používáme `VACUUM INTO` místo `backup`, protože příkaz `backup` by nechal databázi krátce nešifrovanou, dokud není vyvolán příkaz `rekey` (viz tento komentář na GitHubu [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)).

Sekundární server nařídí Primárnímu přes připojení `WebSocket` provést zálohu – a Primární pak obdrží příkaz k provedení a následně:

1. Připojí se k vaší šifrované poštovní schránce.
2. Získá zámek pro zápis.
3. Provede WAL checkpoint pomocí `wal_checkpoint(PASSIVE)`.
4. Spustí příkaz SQLite `VACUUM INTO`.
5. Zajistí, že zkopírovaný soubor lze otevřít pomocí šifrovaného hesla (zajištění/dummyproofing).
6. Nahraje jej do Cloudflare R2 pro uložení (nebo do vašeho vlastního poskytovatele, pokud je specifikován).
<!--
7. Komprimujte výsledný záložní soubor pomocí `gzip`.
8. Nahrajte jej do Cloudflare R2 pro uložení (nebo u svého vlastního poskytovatele, pokud je uveden).
-->

Pamatujte, že vaše poštovní schránky jsou šifrované – a i když máme omezení IP a další autentizační opatření pro komunikaci přes WebSocket – v případě útočníka si můžete být jisti, že pokud WebSocket payload neobsahuje vaše IMAP heslo, nemůže otevřít vaši databázi.

V současné době je uložena pouze jedna záloha na poštovní schránku, ale v budoucnu můžeme nabídnout obnovu k určitému časovému bodu ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Vyhledávání {#search}

Naše IMAP servery podporují příkaz `SEARCH` s komplexními dotazy, regulárními výrazy a dalšími funkcemi.

Rychlý výkon vyhledávání je díky [FTS5](https://www.sqlite.org/fts5.html) a [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Hodnoty `Date` ukládáme v SQLite poštovních schránkách jako řetězce ve formátu [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) pomocí [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (s časovým pásmem UTC, aby porovnání rovnosti fungovalo správně).

Indexy jsou také ukládány pro všechny vlastnosti, které se používají v dotazech vyhledávání.

### Projekty {#projects}

Zde je tabulka s projekty, které používáme v našem zdrojovém kódu a vývojovém procesu (seřazeno abecedně):

| Projekt                                                                                       | Účel                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | Platforma pro automatizaci DevOps pro snadnou údržbu, škálování a správu celé naší flotily serverů.                                                                                                                                                                                                                                                               |
| [Bree](https://github.com/breejs/bree)                                                        | Plánovač úloh pro Node.js a JavaScript s podporou cron, dat, ms, later a přátelským uživatelským rozhraním.                                                                                                                                                                                                                                                       |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Vývojářsky přívětivá knihovna pro logování v JavaScriptu a Node.js s ohledem na bezpečnost a soukromí.                                                                                                                                                                                                                                                             |
| [Lad](https://github.com/ladjs/lad)                                                           | Framework Node.js, který pohání celou naši architekturu a návrh inženýrství s MVC a dalšími funkcemi.                                                                                                                                                                                                                                                             |
| [MongoDB](https://www.mongodb.com/)                                                           | NoSQL databázové řešení, které používáme pro ukládání všech ostatních dat mimo poštovní schránky (např. váš účet, nastavení, domény a konfigurace aliasů).                                                                                                                                                                                                        |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | MongoDB objektový dokumentový model ("ODM"), který používáme v celém našem stacku. Napsali jsme speciální pomocníky, kteří nám umožňují jednoduše pokračovat v používání **Mongoose se SQLite** :tada:                                                                                                                                                            |
| [Node.js](https://nodejs.org/en)                                                              | Node.js je open-source, multiplatformní runtime prostředí JavaScriptu, které spouští všechny naše serverové procesy.                                                                                                                                                                                                                                              |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Balíček Node.js pro odesílání e-mailů, vytváření spojení a další. Jsme oficiálním sponzorem tohoto projektu.                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                    | In-memory databáze pro cache, publish/subscribe kanály a DNS přes HTTPS požadavky.                                                                                                                                                                                                                                                                                 |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Šifrovací rozšíření pro SQLite umožňující šifrování celých databázových souborů (včetně write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journalu, rollbacku, …).                                                                                                                                                                                     |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Vizualní editor SQLite (který můžete také použít) pro testování, stahování a prohlížení vývojových poštovních schránek.                                                                                                                                                                                                                                           |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Vložená databázová vrstva pro škálovatelné, samostatné, rychlé a odolné IMAP úložiště.                                                                                                                                                                                                                                                                             |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Nástroj pro Node.js proti spamu, filtrování e-mailů a prevenci phishingu (naše alternativa k [Spam Assassin](https://spamassassin.apache.org/) a [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                        |
| [Tangerine](https://tangeri.ne)                                                               | DNS přes HTTPS požadavky s Node.js a cache pomocí Redis – což zajišťuje globální konzistenci a mnohem více.                                                                                                                                                                                                                                                       |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Náš vývojový tým používá tento (a také doporučuje) jako **preferovaného e-mailového klienta pro použití s Forward Email**.                                                                                                                                                                                                                                        |
| [UTM](https://github.com/utmapp/UTM)                                                          | Náš vývojový tým používá tento nástroj k vytváření virtuálních strojů pro iOS a macOS, aby testoval různé e-mailové klienty (paralelně) s našimi IMAP a SMTP servery.                                                                                                                                                                                              |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Moderní open-source linuxový serverový operační systém, který pohání celou naši infrastrukturu.                                                                                                                                                                                                                                                                   |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | Knihovna IMAP serveru – viz poznámky o [de-duplicitě příloh](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) a [podpoře IMAP protokolu](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                          |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Rychlá a jednoduchá API knihovna pro Node.js pro programovou interakci s SQLite3.                                                                                                                                                                                                                                                                                  |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Vývojářsky přívětivý e-mailový framework pro vytváření, náhled a odesílání vlastních e-mailů (např. oznámení o účtu a další).                                                                                                                                                                                                                                     |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | SQL builder dotazů používající Mongo-styl syntaxe. To šetří náš vývojový tým čas, protože můžeme pokračovat v psaní v Mongo-stylu v celém stacku s databázově agnostickým přístupem. **Také pomáhá předcházet SQL injection útokům použitím parametrů dotazů.**                                                                                                      |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | SQL nástroj pro extrakci informací o existujícím databázovém schématu. To nám umožňuje snadno ověřit, že všechny indexy, tabulky, sloupce, omezení a další jsou platné a odpovídají přesně tomu, jak by měly být. Dokonce jsme napsali automatizované pomocníky pro přidávání nových sloupců a indexů, pokud dojde ke změnám v databázových schématech (s velmi podrobným hlášením chyb). |
| [knex](https://github.com/knex/knex)                                                          | SQL builder dotazů, který používáme pouze pro databázové migrace a validaci schématu přes `knex-schema-inspector`.                                                                                                                                                                                                                                               |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatický překlad frází [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) s podporou Markdown pomocí [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                           |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Balíček Node.js pro vyhledávání a navazování spojení s MX servery a zpracování chyb.                                                                                                                                                                                                                                                                              |
| [pm2](https://github.com/Unitech/pm2)                                                         | Produkční správce procesů Node.js s vestavěným load balancerem ([jemně laděným](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) pro výkon).                                                                                                                                                                                                   |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | Knihovna SMTP serveru – používáme ji pro naše mail exchange ("MX") a odchozí SMTP servery.                                                                                                                                                                                                                                                                        |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Užitečný nástroj pro testování IMAP serverů vůči benchmarkům a kompatibilitě s RFC specifikací IMAP protokolu. Tento projekt vytvořil tým [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (aktivní open-source IMAP a POP3 server od července 2002). Náš IMAP server jsme s tímto nástrojem důkladně testovali.                                    |
> Další projekty, které používáme, najdete v [našem zdrojovém kódu na GitHubu](https://github.com/forwardemail).

### Poskytovatelé {#providers}

| Poskytovatel                                    | Účel                                                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Poskytovatel DNS, kontrola stavu, load balancery a zálohovací úložiště pomocí [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting zdrojového kódu, CI/CD a řízení projektů.                                                                            |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting dedikovaných serverů a spravované databáze.                                                                           |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hosting dedikovaných serverů.                                                                                                |
| [DataPacket](https://www.datapacket.com)        | Hosting dedikovaných serverů.                                                                                                |


## Myšlenky {#thoughts}

### Principy {#principles}

Forward Email je navržen podle těchto principů:

1. Vždy být přívětivý k vývojářům, zaměřený na bezpečnost a soukromí a transparentní.
2. Dodržovat [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occamovu břitvu](https://en.wikipedia.org/wiki/Occam%27s_razor) a [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Cílit na šikovné, bootstrapped a [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) vývojáře

### Experimenty {#experiments}

> **tldr;** Nakonec použití S3-kompatibilního objektového úložiště a/nebo Virtuálních tabulek není technicky proveditelné z důvodů výkonu a je náchylné k chybám kvůli omezením paměti.

Provedli jsme několik experimentů vedoucích k našemu konečnému řešení SQLite, jak je uvedeno výše.

Jedním z nich bylo zkusit použít [rclone]() a SQLite společně s vrstvou úložiště kompatibilní se S3.

Tento experiment nás přivedl k dalšímu pochopení a objevení okrajových případů týkajících se rclone, SQLite a použití [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Pokud povolíte příznak `--vfs-cache-mode writes` u rclone, pak čtení bude v pořádku, ale zápisy budou ukládány do cache.
  * Pokud máte více IMAP serverů rozprostřených globálně, pak bude cache mezi nimi neaktuální, pokud nemáte jednoho zapisovatele a více posluchačů (např. přístup pub/sub).
  * To je neuvěřitelně složité a přidání jakékoli další složitosti tímto způsobem povede k více jediným bodům selhání.
  * Poskytovatelé úložišť kompatibilních se S3 nepodporují částečné změny souborů – což znamená, že jakákoli změna souboru `.sqlite` povede k úplné změně a opětovnému nahrání databáze.
  * Existují i jiná řešení jako `rsync`, ale nejsou zaměřena na podporu write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – proto jsme nakonec zkoumali Litestream. Naštěstí naše šifrování již šifruje soubory [WAL](https://www.sqlite.org/wal.html) za nás, takže nemusíme na Litestream spoléhat. Nicméně jsme ještě neměli dostatečnou důvěru v Litestream pro produkční použití a níže máme několik poznámek k tomu.
  * Použití této volby `--vfs-cache-mode writes` (jediný způsob, jak používat SQLite přes `rclone` pro zápisy) se pokusí zkopírovat celou databázi znovu v paměti – zvládnutí jedné 10 GB schránky je v pořádku, ale zvládnutí více schránek s extrémně vysokým úložištěm způsobí, že IMAP servery narazí na omezení paměti a chyby `ENOMEM`, segmentační chyby a poškození dat.
* Pokud se pokusíte použít SQLite [Virtuální tabulky](https://www.sqlite.org/vtab.html) (např. pomocí [s3db](https://github.com/jrhy/s3db)) za účelem mít data uložená na vrstvě úložiště kompatibilní se S3, narazíte na několik dalších problémů:
  * Čtení a zápisy budou extrémně pomalé, protože je potřeba volat S3 API endpointy s HTTP metodami `GET`, `PUT`, `HEAD` a `POST`.
  * Vývojové testy ukázaly, že překročení 500K-1M+ záznamů na optickém internetu je stále omezeno propustností zápisu a čtení u poskytovatelů kompatibilních se S3. Například naši vývojáři spustili `for` smyčky pro sekvenční SQL příkazy `INSERT` i pro hromadné zápisy velkého množství dat. V obou případech byl výkon ohromně pomalý.
  * Virtuální tabulky **nemohou mít indexy**, příkazy `ALTER TABLE` a [další](https://stackoverflow.com/a/12507650) [omezení](https://sqlite.org/lang_createvtab.html) – což vede k prodlevám až 1-2 minut nebo více v závislosti na množství dat.
  * Objekty byly uloženy nešifrované a není k dispozici nativní podpora šifrování.
* Také jsme zkoumali použití [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs), což je konceptuálně a technicky podobné předchozímu bodu (takže má stejné problémy). Možností by bylo použít vlastní sestavení `sqlite3` zabalené s šifrováním jako [wxSQLite3](https://github.com/utelle/wxsqlite3) (které aktuálně používáme v našem řešení výše) přes [úpravu setup souboru](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Další potenciální přístup byl použít [multiplex extension](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), ale to má omezení 32 GB a vyžadovalo by složité sestavování a vývojové komplikace.
* Příkazy `ALTER TABLE` jsou vyžadovány (takže to zcela vylučuje použití Virtuálních tabulek). Potřebujeme příkazy `ALTER TABLE`, aby náš hook s `knex-schema-inspector` fungoval správně – což zajišťuje, že data nejsou poškozena a načtené řádky lze převést na platné dokumenty podle našich definic schématu `mongoose` (což zahrnuje omezení, typ proměnné a libovolnou validaci dat).
* Téměř všechny projekty kompatibilní se S3 týkající se SQLite v open-source komunitě jsou v Pythonu (a ne v JavaScriptu, který používáme pro 100 % našeho stacku).
* Kompresní knihovny jako [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (viz [komentáře](https://news.ycombinator.com/item?id=32303762)) vypadají slibně, ale [možná ještě nejsou připravené pro produkční použití](https://github.com/phiresky/sqlite-zstd#usage). Místo toho bude komprese na straně aplikace u datových typů jako `String`, `Object`, `Map`, `Array`, `Set` a `Buffer` čistší a jednodušší přístup (a také snazší migrace, protože bychom mohli uložit `Boolean` příznak nebo sloupec – nebo dokonce použít `PRAGMA` `user_version=1` pro kompresi nebo `user_version=0` pro žádnou kompresi jako metadata databáze).
  * Naštěstí již máme implementovanou deduplikaci příloh v našem úložišti IMAP serveru – takže každá zpráva se stejnou přílohou neuchovává kopii přílohy – místo toho je jedna příloha uložena pro více zpráv a vláken ve schránce (a následně je použito cizí odkazování).
* Projekt Litestream, což je řešení pro replikaci a zálohování SQLite, je velmi slibný a pravděpodobně ho v budoucnu použijeme.
  * Nechceme zpochybňovat autora/autory – protože milujeme jejich práci a příspěvky do open-source již více než deset let – ale z reálného používání se zdá, že [může být spousta problémů](https://github.com/benbjohnson/litestream/issues) a [potenciální ztráty dat z používání](https://github.com/benbjohnson/litestream/issues/218).
* Obnova záloh musí být bezproblémová a triviální. Použití řešení jako MongoDB s `mongodump` a `mongoexport` není jen únavné, ale časově náročné a má složitost konfigurace.
  * SQLite databáze to zjednodušují (je to jediný soubor).
  * Chtěli jsme navrhnout řešení, kde uživatelé mohou kdykoli vzít svou schránku a odejít.
    * Jednoduché příkazy Node.js jako `fs.unlink('mailbox.sqlite')` a je trvale smazána z diskového úložiště.
    * Podobně můžeme použít API kompatibilní se S3 s HTTP `DELETE` pro snadné odstranění snapshotů a záloh pro uživatele.
  * SQLite bylo nejjednodušší, nejrychlejší a nejefektivnější řešení z hlediska nákladů.
### Nedostatek alternativ {#lack-of-alternatives}

Podle našich znalostí nejsou žádné jiné e-mailové služby navrženy tímto způsobem ani nejsou open-source.

*Domníváme se, že to může být* způsobeno tím, že stávající e-mailové služby mají v produkci zastaralou technologii s [spaghetti kódem](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Většina, pokud ne všechny, stávajících poskytovatelů e-mailových služeb je buď uzavřená, nebo se prezentují jako open-source, **ale ve skutečnosti je open-source pouze jejich front-end.**

**Nejsenzitivnější část e-mailu** (skutečné ukládání/IMAP/SMTP interakce) **je zpracovávána na back-endu (serveru), a *nikoli* na front-endu (klientovi)**.

### Vyzkoušejte Forward Email {#try-out-forward-email}

Zaregistrujte se ještě dnes na <https://forwardemail.net>! :rocket:
