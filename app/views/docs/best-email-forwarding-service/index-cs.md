# Jak Forward Email chrání vaše soukromí, doménu a bezpečnost: Technický hluboký ponor {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Nejlepší srovnání služeb přeposílání e-mailů" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Filozofie soukromí Forward Email](#the-forward-email-privacy-philosophy)
* [Implementace SQLite: Trvanlivost a přenositelnost vašich dat](#sqlite-implementation-durability-and-portability-for-your-data)
* [Chytrý fronta a mechanismus opakování: Zajištění doručení e-mailu](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Neomezené zdroje s inteligentním omezením rychlosti](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxované šifrování pro zvýšenou bezpečnost](#sandboxed-encryption-for-enhanced-security)
* [Zpracování e-mailů v paměti: Žádné ukládání na disk pro maximální soukromí](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-end šifrování s OpenPGP pro úplné soukromí](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Vícevrstvá ochrana obsahu pro komplexní bezpečnost](#multi-layered-content-protection-for-comprehensive-security)
* [Jak se lišíme od ostatních e-mailových služeb: Technická výhoda v ochraně soukromí](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparentnost open source pro ověřitelné soukromí](#open-source-transparency-for-verifiable-privacy)
  * [Žádné uzamčení u dodavatele pro soukromí bez kompromisů](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxovaná data pro skutečnou izolaci](#sandboxed-data-for-true-isolation)
  * [Přenositelnost a kontrola dat](#data-portability-and-control)
* [Technické výzvy přeposílání e-mailů s prioritou soukromí](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Správa paměti pro zpracování e-mailů bez protokolování](#memory-management-for-no-logging-email-processing)
  * [Detekce spamu bez analýzy obsahu pro filtrování šetřící soukromí](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Udržování kompatibility s designem zaměřeným na soukromí](#maintaining-compatibility-with-privacy-first-design)
* [Nejlepší postupy ochrany soukromí pro uživatele Forward Email](#privacy-best-practices-for-forward-email-users)
* [Závěr: Budoucnost soukromého přeposílání e-mailů](#conclusion-the-future-of-private-email-forwarding)


## Předmluva {#foreword}

V dnešním digitálním prostředí je ochrana soukromí e-mailů důležitější než kdy dříve. S úniky dat, obavami ze sledování a cílenou reklamou založenou na obsahu e-mailů uživatelé stále více hledají řešení, která upřednostňují jejich soukromí. Ve Forward Email jsme vybudovali naši službu od základu s důrazem na soukromí jako základní kámen naší architektury. Tento blogový příspěvek zkoumá technické implementace, které činí naši službu jedním z nejvíce na soukromí zaměřených řešení pro přeposílání e-mailů dostupných na trhu.


## Filozofie soukromí Forward Email {#the-forward-email-privacy-philosophy}

Než se ponoříme do technických detailů, je důležité pochopit naši základní filozofii soukromí: **vaše e-maily patří vám a pouze vám**. Tento princip řídí každé technické rozhodnutí, které činíme, od způsobu, jakým zpracováváme přeposílání e-mailů, až po implementaci šifrování.

Na rozdíl od mnoha poskytovatelů e-mailů, kteří skenují vaše zprávy pro reklamní účely nebo je trvale ukládají na svých serverech, Forward Email funguje s radikálně odlišným přístupem:

1. **Zpracování pouze v paměti** – nepřechováváme vaše přeposlané e-maily na disku
2. **Žádné ukládání metadat** – neuchováváme záznamy o tom, kdo komu posílá e-maily
3. **100% open-source** – celý náš kód je transparentní a auditovatelný
4. **End-to-end šifrování** – podporujeme OpenPGP pro skutečně soukromou komunikaci


## Implementace SQLite: Trvanlivost a přenositelnost vašich dat {#sqlite-implementation-durability-and-portability-for-your-data}

Jednou z nejvýznamnějších výhod ochrany soukromí Forward Email je naše pečlivě navržená implementace [SQLite](https://en.wikipedia.org/wiki/SQLite). Optimalizovali jsme SQLite pomocí specifických nastavení PRAGMA a [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), abychom zajistili jak trvanlivost, tak přenositelnost vašich dat, přičemž zachováváme nejvyšší standardy ochrany soukromí a bezpečnosti.
Podívejme se, jak jsme implementovali SQLite s [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) jako šifrou pro kvantově odolné šifrování:

```javascript
// Inicializace databáze s better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Nastavení šifrování pomocí šifry ChaCha20-Poly1305
db.pragma(`key="${decrypt(session.user.password)}"`);

// Povolení Write-Ahead Logging pro trvanlivost a výkon
db.pragma('journal_mode=WAL');

// Přepis smazaného obsahu nulami pro ochranu soukromí
db.pragma('secure_delete=ON');

// Povolení automatického vakuování pro efektivní správu úložiště
db.pragma('auto_vacuum=FULL');

// Nastavení timeoutu při obsazenosti pro zpracování současného přístupu
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimalizace synchronizace pro spolehlivost
db.pragma('synchronous=NORMAL');

// Povolení cizích klíčů pro integritu dat
db.pragma('foreign_keys=ON');

// Nastavení kódování UTF-8 pro podporu mezinárodních znaků
db.pragma(`encoding='UTF-8'`);

// Optimalizace výkonu databáze
db.pragma('optimize=0x10002;');

// Použití disku pro dočasné úložiště místo paměti
db.pragma('temp_store=1;');
```

Tato implementace zajišťuje, že vaše data nejsou jen bezpečná, ale také přenosná. Svůj e-mail si můžete kdykoli vzít s sebou exportem ve formátech [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) nebo SQLite. A když chcete svá data smazat, jsou skutečně pryč – jednoduše smažeme soubory z diskového úložiště místo spouštění SQL příkazů DELETE ROW, které mohou v databázi zanechat stopy.

Kvantově-šifrovací aspekt naší implementace používá ChaCha20-Poly1305 jako šifru při inicializaci databáze, což poskytuje silnou ochranu proti současným i budoucím hrozbám pro vaše soukromí dat.


## Chytrý fronta a mechanismus opakování: Zajištění doručení e-mailu {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Místo zaměření se pouze na zpracování hlaviček jsme implementovali sofistikovaný chytrý fronta a mechanismus opakování s naší metodou `getBounceInfo`. Tento systém zajišťuje, že vaše e-maily mají nejlepší šanci být doručeny, i když nastanou dočasné problémy.

```javascript
function getBounceInfo(err) {
  // Inicializace informací o odrazu s výchozími hodnotami
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analýza odpovědi chyby pro určení vhodné akce
  const response = err.response || err.message || '';

  // Určení, zda je problém dočasný nebo trvalý
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Kategorizace důvodu odrazu pro vhodné zpracování
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> Toto je úryvek metody `getBounceInfo` a nikoli její úplná rozsáhlá implementace. Kompletní kód si můžete prohlédnout na [GitHubu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Opakujeme doručení pošty po dobu 5 dnů, podobně jako průmyslové standardy jako [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), což dává dočasným problémům čas na vyřešení. Tento přístup výrazně zlepšuje míru doručení při zachování soukromí.

Podobně také po úspěšném doručení redigujeme obsah zprávy odchozích SMTP e-mailů. Toto je nastaveno v našem úložišti s výchozí dobou uchování 30 dní, kterou můžete upravit v pokročilých nastaveních vaší domény. Po uplynutí této doby je obsah e-mailu automaticky redigován a vymazán, přičemž zůstává pouze zástupná zpráva:

```txt
Tato zpráva byla úspěšně odeslána. Pro vaše zabezpečení a soukromí byla redigována a vymazána. Pokud chcete prodloužit dobu uchování zpráv, přejděte prosím na stránku Pokročilá nastavení vaší domény.
```
Tento přístup zajišťuje, že vaše odeslané e-maily nezůstanou uloženy navždy, čímž se snižuje riziko úniku dat nebo neoprávněného přístupu k vašim komunikacím.


## Neomezené zdroje s inteligentním omezením rychlosti {#unlimited-resources-with-intelligent-rate-limiting}

Zatímco Forward Email nabízí neomezené domény a aliasy, zavedli jsme inteligentní omezení rychlosti, abychom ochránili náš systém před zneužitím a zajistili spravedlivé používání pro všechny uživatele. Například zákazníci bez podnikových účtů mohou vytvořit až 50+ aliasů denně, což zabraňuje zahlcení naší databáze spamem a umožňuje efektivní fungování našich funkcí pro ochranu a detekci zneužití v reálném čase.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

Tento vyvážený přístup vám poskytuje flexibilitu vytvořit tolik e-mailových adres, kolik potřebujete pro komplexní správu soukromí, přičemž zároveň zachovává integritu a výkon naší služby pro všechny uživatele.


## Izolované šifrování pro zvýšenou bezpečnost {#sandboxed-encryption-for-enhanced-security}

Náš jedinečný přístup s izolovaným šifrováním poskytuje zásadní bezpečnostní výhodu, kterou mnoho uživatelů při výběru e-mailové služby přehlíží. Pojďme se podívat, proč je izolace dat, zejména e-mailů, tak důležitá.

Služby jako Gmail a Proton pravděpodobně používají sdílené [relační databáze](https://en.wikipedia.org/wiki/Relational_database), což vytváří základní bezpečnostní zranitelnost. V prostředí sdílené databáze, pokud někdo získá přístup k datům jednoho uživatele, potenciálně má cestu k přístupu i k datům ostatních uživatelů. Je to proto, že všechna uživatelská data jsou uložena ve stejných tabulkách databáze, oddělená pouze uživatelskými ID nebo podobnými identifikátory.

Forward Email přistupuje k šifrování zcela odlišně:

1. **Úplná izolace**: Data každého uživatele jsou uložena ve vlastním zašifrovaném souboru SQLite databáze, zcela odděleně od ostatních uživatelů
2. **Nezávislé šifrovací klíče**: Každá databáze je zašifrována vlastním unikátním klíčem odvozeným z uživatelského hesla
3. **Žádné sdílené úložiště**: Na rozdíl od relačních databází, kde mohou být všechny e-maily uživatelů v jedné tabulce „emails“, náš přístup zajišťuje, že nedochází ke smíchání dat
4. **Obrana v hloubce**: I kdyby byla databáze jednoho uživatele nějak kompromitována, neposkytne přístup k datům jiných uživatelů

Tento izolovaný přístup je podobný tomu, jako kdybyste měli svůj e-mail v samostatné fyzické trezoru místo ve sdíleném skladovacím zařízení s vnitřními přepážkami. Je to zásadní architektonický rozdíl, který výrazně zvyšuje vaše soukromí a bezpečnost.


## Zpracování e-mailů v paměti: Žádné ukládání na disk pro maximální soukromí {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Pro naši službu přeposílání e-mailů zpracováváme e-maily zcela v paměti RAM a nikdy je nezapisujeme na disk ani do databází. Tento přístup poskytuje bezkonkurenční ochranu proti sledování e-mailů a sběru metadat.

Zde je zjednodušený pohled na to, jak naše zpracování e-mailů funguje:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```
Tento přístup znamená, že i kdyby naše servery byly kompromitovány, útočníci by neměli přístup k žádným historickým datům e-mailů. Vaše e-maily jednoduše procházejí naším systémem a jsou okamžitě přeposílány na své cílové místo, aniž by zanechaly stopu. Tento přístup k přeposílání e-mailů bez logování je zásadní pro ochranu vašich komunikací před sledováním.


## End-to-End šifrování s OpenPGP pro úplné soukromí {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Pro uživatele, kteří vyžadují nejvyšší úroveň ochrany soukromí před sledováním e-mailů, podporujeme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) pro end-to-end šifrování. Na rozdíl od mnoha poskytovatelů e-mailů, kteří vyžadují proprietární můstky nebo aplikace, naše implementace funguje se standardními e-mailovými klienty, což zpřístupňuje bezpečnou komunikaci všem.

Takto implementujeme OpenPGP šifrování:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Tato implementace zajišťuje, že vaše e-maily jsou zašifrovány ještě před tím, než opustí vaše zařízení, a mohou je dešifrovat pouze zamýšlený příjemci, čímž zůstává vaše komunikace soukromá i před námi. To je nezbytné pro ochranu citlivých komunikací před neoprávněným přístupem a sledováním.


## Vícevrstvá ochrana obsahu pro komplexní bezpečnost {#multi-layered-content-protection-for-comprehensive-security}

Forward Email nabízí více vrstev ochrany obsahu, které jsou ve výchozím nastavení zapnuté, aby poskytly komplexní zabezpečení proti různým hrozbám:

1. **Ochrana před nevhodným obsahem** – Filtruje nevhodný obsah bez kompromisů na soukromí
2. **Ochrana proti [phishingu](https://en.wikipedia.org/wiki/Phishing)** – Blokuje pokusy o krádež vašich informací při zachování anonymity
3. **Ochrana před spustitelnými soubory** – Zabraňuje potenciálně škodlivým přílohám bez skenování obsahu
4. **Ochrana proti [virům](https://en.wikipedia.org/wiki/Computer_virus)** – Skenuje malware pomocí technik zachovávajících soukromí

Na rozdíl od mnoha poskytovatelů, kteří tyto funkce nabízejí jako volitelné, jsme je nastavili jako výchozí, takže všichni uživatelé z těchto ochran automaticky těží. Tento přístup odráží náš závazek k ochraně soukromí i bezpečnosti a poskytuje rovnováhu, kterou mnoho e-mailových služeb nedokáže zajistit.


## Jak se lišíme od ostatních e-mailových služeb: Technická výhoda v ochraně soukromí {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Při porovnání Forward Email s ostatními e-mailovými službami několik klíčových technických rozdílů zdůrazňuje náš přístup zaměřený na soukromí:

### Transparentnost open source pro ověřitelné soukromí {#open-source-transparency-for-verifiable-privacy}

Zatímco mnoho poskytovatelů e-mailů tvrdí, že jsou open source, často si nechávají backendový kód uzavřený. Forward Email je 100% [open source](https://en.wikipedia.org/wiki/Open_source), včetně kódu frontend i backend. Tato transparentnost umožňuje nezávislý bezpečnostní audit všech komponent, což zajišťuje, že naše tvrzení o ochraně soukromí může ověřit kdokoli.

### Žádné vázání na dodavatele pro soukromí bez kompromisů {#no-vendor-lock-in-for-privacy-without-compromise}

Mnoho poskytovatelů zaměřených na soukromí vyžaduje použití jejich proprietárních aplikací nebo můstků. Forward Email funguje s jakýmkoli standardním e-mailovým klientem přes protokoly [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) a [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), což vám dává svobodu vybrat si preferovaný e-mailový software bez kompromisů na soukromí.
### Izolovaná data pro skutečnou izolaci {#sandboxed-data-for-true-isolation}

Na rozdíl od služeb, které používají sdílené databáze, kde jsou data všech uživatelů smíchána dohromady, náš izolovaný přístup zajišťuje, že data každého uživatele jsou zcela oddělena. Tento zásadní architektonický rozdíl poskytuje výrazně silnější záruky soukromí než většina e-mailových služeb.

### Přenositelnost a kontrola dat {#data-portability-and-control}

Věříme, že vaše data patří vám, a proto usnadňujeme export vašich e-mailů ve standardních formátech (MBOX, EML, SQLite) a skutečné smazání vašich dat, kdykoli chcete. Tato úroveň kontroly je mezi poskytovateli e-mailů vzácná, ale nezbytná pro skutečné soukromí.


## Technické výzvy e-mailového přeposílání zaměřeného na soukromí {#the-technical-challenges-of-privacy-first-email-forwarding}

Vytvoření e-mailové služby zaměřené na soukromí přináší významné technické výzvy. Zde jsou některé překážky, které jsme překonali:

### Správa paměti pro zpracování e-mailů bez ukládání záznamů {#memory-management-for-no-logging-email-processing}

Zpracování e-mailů v paměti bez ukládání na disk vyžaduje pečlivou správu paměti, aby bylo možné efektivně zvládat vysoký objem e-mailového provozu. Implementovali jsme pokročilé techniky optimalizace paměti, které zajišťují spolehlivý výkon bez kompromisů s naší politikou bez ukládání dat, což je klíčová součást naší strategie ochrany soukromí.

### Detekce spamu bez analýzy obsahu pro filtrování zachovávající soukromí {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Většina systémů pro detekci [spamu](https://en.wikipedia.org/wiki/Email_spam) spoléhá na analýzu obsahu e-mailů, což je v rozporu s našimi zásadami ochrany soukromí. Vyvinuli jsme techniky pro identifikaci vzorců spamu bez čtení obsahu vašich e-mailů, čímž dosahujeme rovnováhy mezi soukromím a použitelností, která zachovává důvěrnost vaší komunikace.

### Zachování kompatibility s designem zaměřeným na soukromí {#maintaining-compatibility-with-privacy-first-design}

Zajištění kompatibility se všemi e-mailovými klienty při implementaci pokročilých funkcí ochrany soukromí vyžadovalo kreativní inženýrská řešení. Náš tým pracoval neúnavně, aby bylo soukromí bezproblémové, takže nemusíte volit mezi pohodlím a bezpečností při ochraně vaší e-mailové komunikace.


## Nejlepší postupy ochrany soukromí pro uživatele Forward Email {#privacy-best-practices-for-forward-email-users}

Pro maximální ochranu před sledováním e-mailů a zvýšení vašeho soukromí při používání Forward Email doporučujeme následující nejlepší postupy:

1. **Používejte unikátní aliasy pro různé služby** - Vytvořte si pro každou službu, na kterou se registrujete, jiný e-mailový alias, abyste zabránili sledování napříč službami
2. **Povolte šifrování OpenPGP** - Pro citlivou komunikaci používejte end-to-end šifrování, které zajistí úplné soukromí
3. **Pravidelně měňte své e-mailové aliasy** - Pravidelně aktualizujte aliasy pro důležité služby, abyste minimalizovali dlouhodobé shromažďování dat
4. **Používejte silná a unikátní hesla** - Chraňte svůj účet Forward Email silným heslem, aby se zabránilo neoprávněnému přístupu
5. **Implementujte [anonymizaci IP adres](https://en.wikipedia.org/wiki/IP_address)** - Zvažte použití [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) společně s Forward Email pro úplnou anonymitu


## Závěr: Budoucnost soukromého přeposílání e-mailů {#conclusion-the-future-of-private-email-forwarding}

Ve Forward Email věříme, že soukromí není jen funkcí – je to základní právo. Naše technické implementace toto přesvědčení odrážejí a poskytují vám přeposílání e-mailů, které respektuje vaše soukromí na každé úrovni a chrání vás před sledováním e-mailů a sběrem metadat.

Jak pokračujeme ve vývoji a zlepšování naší služby, naše závazky k ochraně soukromí zůstávají neochvějné. Neustále zkoumáme nové metody šifrování, zkoumáme další ochrany soukromí a zdokonalujeme náš kód, abychom poskytli co nejbezpečnější e-mailový zážitek.

Volbou Forward Email nevybíráte jen e-mailovou službu – podporujete vizi internetu, kde je soukromí výchozím nastavením, nikoli výjimkou. Připojte se k nám při budování soukromější digitální budoucnosti, jeden e-mail za druhým.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

