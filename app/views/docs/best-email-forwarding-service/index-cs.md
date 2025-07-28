# Jak přeposílání e-mailů chrání vaše soukromí, doménu a zabezpečení: Podrobný technický přehled {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_9__ Obsah {__CHRÁNĚNÁ_URL_10__

* [Předmluva](#foreword)
* [Filosofie ochrany osobních údajů předávání e-mailů](#the-forward-email-privacy-philosophy)
* [Implementace SQLite: Trvanlivost a přenositelnost vašich dat](#sqlite-implementation-durability-and-portability-for-your-data)
* [Inteligentní fronta a mechanismus opakování: Zajištění doručování e-mailů](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Neomezené zdroje s inteligentním omezením rychlosti](#unlimited-resources-with-intelligent-rate-limiting)
* [Šifrování v izolovaném prostoru pro zvýšenou bezpečnost](#sandboxed-encryption-for-enhanced-security)
* [Zpracování e-mailu v paměti: Žádné diskové úložiště pro maximální soukromí](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-End šifrování s OpenPGP pro úplné soukromí](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Vícevrstvá ochrana obsahu pro komplexní zabezpečení](#multi-layered-content-protection-for-comprehensive-security)
* [Čím se lišíme od ostatních e-mailových služeb: Technická výhoda ochrany soukromí](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparentnost otevřeného zdroje pro ověřitelné soukromí](#open-source-transparency-for-verifiable-privacy)
  * [Žádné uzamčení dodavatele pro soukromí bez kompromisů](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Data v izolovaném prostoru pro skutečnou izolaci](#sandboxed-data-for-true-isolation)
  * [Přenositelnost a kontrola dat](#data-portability-and-control)
* [Technické výzvy ochrany soukromí – přeposílání e-mailů na prvním místě](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Správa paměti pro zpracování e-mailů bez protokolování](#memory-management-for-no-logging-email-processing)
  * [Detekce spamu bez analýzy obsahu pro filtrování na ochranu soukromí](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Zachování kompatibility s designem Privacy-First](#maintaining-compatibility-with-privacy-first-design)
* [Doporučené postupy ochrany soukromí pro přeposílání e-mailových uživatelů](#privacy-best-practices-for-forward-email-users)
* [Závěr: Budoucnost soukromého přeposílání e-mailů](#conclusion-the-future-of-private-email-forwarding)

__CHRÁNĚNÁ_URL_11__ Předmluva {__CHRÁNĚNÁ_URL_12__

V dnešním digitálním prostředí se ochrana soukromí e-mailů stala důležitější než kdy jindy. S narušením dat, obavami o sledování a cílenou reklamou založenou na obsahu e-mailů uživatelé stále více hledají řešení, která upřednostňují jejich soukromí. Ve Forward Email jsme naši službu od základů vybudovali se soukromím jako základním kamenem naší architektury. Tento blogový příspěvek zkoumá technické implementace, díky kterým je naše služba jedním z dostupných řešení pro přeposílání e-mailů zaměřených na ochranu soukromí.

## Filozofie ochrany osobních údajů při přeposílání e-mailů {#the-forward-email-privacy-philosophy}

Než se ponoříme do technických detailů, je důležité pochopit naši základní filozofii ochrany osobních údajů: **vaše e-maily patří vám a pouze vám**. Tato zásada řídí každé naše technické rozhodnutí, od způsobu přeposílání e-mailů až po implementaci šifrování.

Na rozdíl od mnoha poskytovatelů e-mailu, kteří skenují vaše zprávy pro reklamní účely nebo je ukládají na neurčito na svých serverech, Forward Email pracuje s radikálně odlišným přístupem:

1. **Pouze zpracování v paměti** - Vaše přeposlané e-maily neukládáme na disk.
2. **Žádné ukládání metadat** - Neuchováváme záznamy o tom, kdo komu e-maily píše.
3. **100% open-source** - Celá naše kódová základna je transparentní a auditovatelná.
4. **End-to-end šifrování** - Podporujeme OpenPGP pro skutečně soukromou komunikaci.

## Implementace SQLite: Trvanlivost a přenositelnost vašich dat {#sqlite-implementation-durability-and-portability-for-your-data}

Jednou z nejvýznamnějších výhod ochrany soukromí při přeposílání e-mailů je naše pečlivě navržená implementace [SQLite](https://en.wikipedia.org/wiki/SQLite). Vyladili jsme SQLite pomocí specifických nastavení PRAGMA a [Záznam napřed (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), abychom zajistili odolnost i přenositelnost vašich dat a zároveň zachovali nejvyšší standardy ochrany soukromí a zabezpečení.

Zde se podíváme na to, jak jsme implementovali SQLite s [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) jako šifrou pro kvantově odolné šifrování:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Tato implementace zajišťuje, že vaše data jsou nejen bezpečná, ale i přenosná. Svůj e-mail si můžete kdykoli vzít a nechat ho exportovat ve formátech [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) nebo SQLite. A když chcete svá data smazat, jsou skutečně pryč – soubory jednoduše smažeme z diskového úložiště, místo abychom spouštěli příkazy SQL DELETE ROW, které mohou zanechat stopy v databázi.

Aspekt kvantového šifrování naší implementace používá ChaCha20-Poly1305 jako šifru, když inicializujeme databázi, což poskytuje silnou ochranu před současnými i budoucími hrozbami pro vaše soukromí dat.

## Inteligentní mechanismus fronty a opakování: Zajištění doručení e-mailů {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Místo abychom se zaměřovali pouze na zpracování hlaviček, implementovali jsme sofistikovaný inteligentní mechanismus fronty a opakování s naší metodou `getBounceInfo`. Tento systém zajišťuje, že vaše e-maily mají nejlepší šanci na doručení, a to i v případě dočasných problémů.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
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
> This is an excerpt of the `getBounceInfo` method and not the actual extensive implementation. For the complete code, you can review it on [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Pokusy o doručení pošty opakujeme po dobu 5 dnů, podobně jako v oborových standardech (např. [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), což dává dočasným problémům čas na jejich vyřešení. Tento přístup výrazně zlepšuje míru doručování a zároveň zachovává soukromí.

V podobném duchu také redigujeme obsah zpráv odchozích e-mailů SMTP po úspěšném doručení. Toto je nakonfigurováno v našem systému úložiště s výchozí dobou uchování 30 dní, kterou můžete upravit v pokročilých nastaveních vaší domény. Po uplynutí této doby je obsah e-mailu automaticky redigován a vyčištěn, přičemž zůstane pouze zástupná zpráva:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Tento přístup zajišťuje, že vaše odeslané e-maily nezůstanou uloženy po neomezenou dobu, což snižuje riziko narušení dat nebo neoprávněného přístupu k vaší komunikaci.

## Neomezené zdroje s inteligentním omezením rychlosti {#unlimited-resources-with-intelligent-rate-limiting}

I když Forward Email nabízí neomezený počet domén a aliasů, zavedli jsme inteligentní omezení rychlosti, abychom chránili náš systém před zneužitím a zajistili spravedlivé používání pro všechny uživatele. Nepodnikoví zákazníci mohou například vytvořit až 50+ aliasů denně, což zabraňuje spamování a zahlcení naší databáze a umožňuje efektivní fungování našich funkcí proti zneužití a ochraně v reálném čase.

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

Tento vyvážený přístup vám poskytuje flexibilitu při vytváření tolika e-mailových adres, kolik potřebujete pro komplexní správu soukromí, při zachování integrity a výkonu naší služby pro všechny uživatele.

## Šifrování v sandboxu pro vylepšené zabezpečení {#sandboxed-encryption-for-enhanced-security}

Náš jedinečný přístup k šifrování v izolovaném prostoru poskytuje zásadní bezpečnostní výhodu, kterou mnoho uživatelů při výběru e-mailové služby přehlíží. Pojďme prozkoumat, proč jsou data v sandboxu, zejména e-mail, tak důležitá.

Služby jako Gmail a Proton s největší pravděpodobností používají sdílený [relační databáze](https://en.wikipedia.org/wiki/Relational_database), což vytváří zásadní bezpečnostní zranitelnost. V prostředí sdílené databáze, pokud někdo získá přístup k datům jednoho uživatele, potenciálně má cestu k přístupu i k datům ostatních uživatelů. Je to proto, že všechna uživatelská data se nacházejí ve stejných databázových tabulkách, oddělená pouze uživatelskými ID nebo podobnými identifikátory.

Forward Email využívá zásadně odlišný přístup s naším sandboxovým šifrováním:

1. **Úplná izolace**: Data každého uživatele jsou uložena ve vlastním šifrovaném souboru databáze SQLite, zcela izolovaná od ostatních uživatelů.
2. **Nezávislé šifrovací klíče**: Každá databáze je šifrována vlastním jedinečným klíčem odvozeným z hesla uživatele.
3. **Žádné sdílené úložiště**: Na rozdíl od relačních databází, kde všechny e-maily uživatelů mohou být v jedné tabulce „e-maily“, náš přístup zajišťuje, že nedochází ke smíchání dat.
4. **Hloubková ochrana**: I kdyby byla databáze jednoho uživatele nějakým způsobem ohrožena, neposkytla by přístup k datům žádného jiného uživatele.

Tento izolovaný přístup je podobný tomu, jako byste měli svůj e-mail v samostatném fyzickém trezoru spíše než ve sdíleném úložišti s vnitřními přepážkami. Je to zásadní architektonický rozdíl, který výrazně zvyšuje vaše soukromí a bezpečnost.

## Zpracování e-mailů v paměti: Žádné úložiště na disku pro maximální soukromí {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Pro naši službu přeposílání e-mailů zpracováváme e-maily výhradně v paměti RAM a nikdy je nezapisujeme na diskové úložiště nebo do databází. Tento přístup poskytuje bezkonkurenční ochranu proti sledování e-mailů a sběru metadat.

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

Tento přístup znamená, že i kdyby byly naše servery kompromitovány, útočníci by neměli k dispozici žádná historická e-mailová data. Vaše e-maily jednoduše projdou naším systémem a jsou okamžitě předány na místo určení bez zanechání stopy. Tento přístup k předávání e-mailů bez protokolování je zásadní pro ochranu vaší komunikace před dohledem.

## Šifrování typu End-to-End s OpenPGP pro naprosté soukromí {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Pro uživatele, kteří vyžadují nejvyšší úroveň ochrany soukromí před sledováním e-mailů, podporujeme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) pro end-to-end šifrování. Na rozdíl od mnoha poskytovatelů e-mailových služeb, kteří vyžadují proprietární mosty nebo aplikace, naše implementace funguje se standardními e-mailovými klienty, takže bezpečná komunikace je přístupná všem.

Zde je návod, jak implementujeme šifrování OpenPGP:

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

Tato implementace zajišťuje, že vaše e-maily jsou zašifrovány dříve, než opustí vaše zařízení, a dešifrovat je může pouze zamýšlený příjemce, takže vaše komunikace zůstane soukromá i před námi. To je nezbytné pro ochranu citlivé komunikace před neoprávněným přístupem a sledováním.

## Vícevrstvá ochrana obsahu pro komplexní zabezpečení {#multi-layered-content-protection-for-comprehensive-security}

Forward Email nabízí více vrstev ochrany obsahu, které jsou ve výchozím nastavení povoleny, aby poskytovaly komplexní zabezpečení proti různým hrozbám:

1. **Ochrana obsahu pro dospělé** – Filtruje nevhodný obsah bez ohrožení soukromí
2. **Ochrana [Phishing](https://en.wikipedia.org/wiki/Phishing)** – Blokuje pokusy o krádež vašich informací a zároveň zachovává anonymitu
3. **Ochrana spustitelných souborů** – Zabraňuje potenciálně škodlivým přílohám bez skenování obsahu
4. **Ochrana [Virus](https://en.wikipedia.org/wiki/Computer_virus)** – Prohledává malware pomocí technik zachovávajících soukromí

Na rozdíl od mnoha poskytovatelů, kteří tyto funkce aktivují, jsme je odhlásili, abychom zajistili, že všichni uživatelé budou mít z těchto ochran ve výchozím nastavení prospěch. Tento přístup odráží náš závazek k ochraně soukromí a zabezpečení a poskytuje rovnováhu, kterou mnoho e-mailových služeb nedokáže dosáhnout.

## Čím se lišíme od ostatních e-mailových služeb: Technická výhoda v oblasti soukromí {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Při porovnávání přeposílání e-mailů s jinými e-mailovými službami několik klíčových technických rozdílů zdůrazňuje náš přístup na prvním místě:

### Transparentnost otevřeného zdrojového kódu pro ověřitelné soukromí {#open-source-transparency-for-verifiable-privacy}

Přestože mnoho poskytovatelů e-mailů tvrdí, že jsou open source, často svůj backendový kód drží uzavřený. Forward Email je 100% [open source](https://en.wikipedia.org/wiki/Open_source), a to včetně frontendového i backendového kódu. Tato transparentnost umožňuje nezávislý bezpečnostní audit všech komponent a zajišťuje, že naše tvrzení o ochraně soukromí může kdokoli ověřit.

### Žádná vazba na dodavatele pro soukromí bez kompromisů {#no-vendor-lock-in-for-privacy-without-compromise}

Mnoho poskytovatelů e-mailových služeb zaměřených na soukromí vyžaduje používání jejich proprietárních aplikací nebo mostů. Přeposílání e-mailů funguje s jakýmkoli standardním e-mailovým klientem prostřednictvím protokolů [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) a [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), což vám dává svobodu výběru preferovaného e-mailového softwaru bez kompromisů v oblasti soukromí.

### Data v sandboxu pro skutečnou izolaci {#sandboxed-data-for-true-isolation}

Na rozdíl od služeb, které využívají sdílené databáze, kde jsou data všech uživatelů smíchána, náš sandboxový přístup zajišťuje, že data každého uživatele jsou zcela izolovaná. Tento zásadní architektonický rozdíl poskytuje výrazně silnější záruky soukromí, než jaké nabízí většina e-mailových služeb.

### Přenositelnost a kontrola dat {#data-portability-and-control}

Věříme, že vaše data patří vám, a proto usnadňujeme export vašich e-mailů ve standardních formátech (MBOX, EML, SQLite) a skutečně vaše data smažeme, když budete chtít. Tato úroveň kontroly je mezi poskytovateli e-mailu vzácná, ale je nezbytná pro skutečné soukromí.

## Technické výzvy přeposílání e-mailů s důrazem na soukromí {#the-technical-challenges-of-privacy-first-email-forwarding}

Vybudování e-mailové služby zaměřené na ochranu soukromí přináší značné technické problémy. Zde jsou některé z překážek, které jsme překonali:

### Správa paměti pro zpracování e-mailů bez protokolování {#memory-management-for-no-logging-email-processing}

Zpracování e-mailů v paměti bez diskového úložiště vyžaduje pečlivou správu paměti, aby bylo možné efektivně zvládnout velké objemy e-mailového provozu. Implementovali jsme pokročilé techniky optimalizace paměti, abychom zajistili spolehlivý výkon bez kompromisů v oblasti zásad bez ukládání, což je kritická součást naší strategie ochrany soukromí.

### Detekce spamu bez analýzy obsahu pro filtrování s ohledem na soukromí {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Většina detekčních systémů [spam](https://en.wikipedia.org/wiki/Email_spam) se spoléhá na analýzu obsahu e-mailů, což je v rozporu s našimi zásadami ochrany osobních údajů. Vyvinuli jsme techniky k identifikaci spamových vzorců bez čtení obsahu vašich e-mailů, čímž dosahujeme rovnováhy mezi soukromím a použitelností a zároveň zachováváme důvěrnost vaší komunikace.

### Zachování kompatibility s designem zaměřeným na ochranu soukromí {#maintaining-compatibility-with-privacy-first-design}

Zajištění kompatibility se všemi e-mailovými klienty při implementaci pokročilých funkcí ochrany osobních údajů vyžaduje kreativní inženýrská řešení. Náš tým neúnavně pracoval na zajištění bezproblémového soukromí, takže při ochraně e-mailové komunikace nemusíte volit mezi pohodlím a zabezpečením.

## Nejlepší postupy ochrany osobních údajů pro uživatele přeposílaných e-mailů {#privacy-best-practices-for-forward-email-users}

Chcete-li maximalizovat svou ochranu před sledováním e-mailů a maximalizovat své soukromí při používání přeposílání e-mailů, doporučujeme následující osvědčené postupy:

1. **Používejte jedinečné aliasy pro různé služby** - Vytvořte si pro každou službu, ke které se zaregistrujete, jiný alias e-mailu, abyste zabránili sledování mezi službami.
2. **Povolte šifrování OpenPGP** - Pro citlivou komunikaci používejte šifrování end-to-end, abyste zajistili úplné soukromí.
3. **Pravidelně střídejte aliasy e-mailů** - Pravidelně aktualizujte aliasy důležitých služeb, abyste minimalizovali dlouhodobý sběr dat.
4. **Používejte silná a jedinečná hesla** - Chraňte svůj účet Forward Email silným heslem, abyste zabránili neoprávněnému přístupu.
5. **Implementujte anonymizaci [IP adresa](https://en.wikipedia.org/wiki/IP_address)** - Zvažte použití [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) ve spojení s Forward Email pro úplnou anonymitu.

## Závěr: Budoucnost přeposílání soukromých e-mailů {#conclusion-the-future-of-private-email-forwarding}

Ve společnosti Forward Email věříme, že soukromí není jen funkcí – je to základní právo. Naše technické implementace odrážejí toto přesvědčení a poskytují vám přeposílání e-mailů, které respektuje vaše soukromí na všech úrovních a chrání vás před sledováním e-mailů a shromažďováním metadat.

Jak pokračujeme ve vývoji a zlepšování našich služeb, náš závazek k ochraně soukromí zůstává neochvějný. Neustále zkoumáme nové metody šifrování, zkoumáme další ochranu soukromí a vylepšujeme naši kódovou základnu, abychom poskytovali co nejbezpečnější e-mail.

Pokud zvolíte Forward Email, nevybíráte pouze e-mailovou službu – podporujete vizi internetu, kde je soukromí výchozím nastavením, nikoli výjimkou. Připojte se k nám a vytvořte soukromější digitální budoucnost, jeden e-mail po druhém.

<!-- *Klíčová slova: přeposílání soukromých e-mailů, ochrana soukromí e-mailů, zabezpečená e-mailová služba, e-mail s otevřeným zdrojovým kódem, kvantově bezpečné šifrování, e-mail OpenPGP, zpracování e-mailů v paměti, e-mailová služba bez protokolování, ochrana metadat e-mailů, soukromí v záhlavích e-mailů, e-mail šifrovaný end-to-end, e-mail zaměřený na soukromí, anonymní přeposílání e-mailů, osvědčené postupy zabezpečení e-mailů, ochrana obsahu e-mailů, ochrana před phishingem, antivirová kontrola e-mailů, poskytovatel e-mailů zaměřený na soukromí, bezpečné záhlaví e-mailů, implementace soukromí e-mailů, ochrana před sledováním e-mailů, přeposílání e-mailů bez protokolování, zabránění úniku metadat e-mailů, techniky ochrany soukromí e-mailů, anonymizace IP adres pro e-maily, aliasy soukromých e-mailů, zabezpečení přeposílání e-mailů, soukromí e-mailů před inzerenty, kvantově odolné šifrování e-mailů, soukromí e-mailů bez kompromisů, úložiště e-mailů SQLite, šifrování e-mailů v sandboxu, přenositelnost dat pro e-maily* -->