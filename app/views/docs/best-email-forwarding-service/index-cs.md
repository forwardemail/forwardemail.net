# Jak přeposílání e-mailů chrání vaše soukromí, doménu a zabezpečení: Podrobný technický přehled {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Obsah {#table-of-contents}

* [Předmluva](#foreword)
* [Filozofie ochrany osobních údajů při přeposílání e-mailů](#the-forward-email-privacy-philosophy)
* [Implementace SQLite: Trvanlivost a přenositelnost vašich dat](#sqlite-implementation-durability-and-portability-for-your-data)
* [Inteligentní mechanismus fronty a opakování: Zajištění doručení e-mailů](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Neomezené zdroje s inteligentním omezením rychlosti](#unlimited-resources-with-intelligent-rate-limiting)
* [Šifrování v sandboxu pro vyšší zabezpečení](#sandboxed-encryption-for-enhanced-security)
* [Zpracování e-mailů v paměti: Žádné úložiště na disku pro maximální soukromí](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-End šifrování s OpenPGP pro naprosté soukromí](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Vícevrstvá ochrana obsahu pro komplexní zabezpečení](#multi-layered-content-protection-for-comprehensive-security)
* [Jak se lišíme od ostatních e-mailových služeb: Technická výhoda v oblasti soukromí](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparentnost otevřeného zdrojového kódu pro ověřitelné soukromí](#open-source-transparency-for-verifiable-privacy)
  * [Žádná vazba na dodavatele pro soukromí bez kompromisů](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxovaná data pro skutečnou izolaci](#sandboxed-data-for-true-isolation)
  * [Přenositelnost a kontrola dat](#data-portability-and-control)
* [Technické výzvy přeposílání e-mailů s ohledem na soukromí](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Správa paměti pro zpracování e-mailů bez protokolování](#memory-management-for-no-logging-email-processing)
  * [Detekce spamu bez analýzy obsahu pro filtrování s ohledem na soukromí](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Zachování kompatibility s designem zaměřeným na soukromí](#maintaining-compatibility-with-privacy-first-design)
* [Nejlepší postupy ochrany osobních údajů pro uživatele přeposílaných e-mailů](#privacy-best-practices-for-forward-email-users)
* [Závěr: Budoucnost přeposílání soukromých e-mailů](#conclusion-the-future-of-private-email-forwarding)

## Předmluva {#foreword}

V dnešní digitální krajině je ochrana soukromí v e-mailech důležitější než kdy dříve. Vzhledem k únikům dat, obavám z dohledu a cílené reklamě založené na obsahu e-mailů hledají uživatelé stále častěji řešení, která upřednostňují jejich soukromí. Ve společnosti Forward Email jsme naši službu vybudovali od základů s ochranou soukromí jako základním kamenem naší architektury. Tento blogový příspěvek zkoumá technické implementace, díky nimž je naše služba jedním z nejvíce zaměřených řešení pro přeposílání e-mailů na ochranu soukromí.

## Filozofie ochrany osobních údajů při přeposílání e-mailů {#the-forward-email-privacy-philosophy}

Než se ponoříme do technických detailů, je důležité pochopit naši základní filozofii ochrany osobních údajů: **vaše e-maily patří vám a pouze vám**. Tato zásada řídí každé naše technické rozhodnutí, od způsobu přeposílání e-mailů až po implementaci šifrování.

Na rozdíl od mnoha poskytovatelů e-mailových služeb, kteří skenují vaše zprávy pro reklamní účely nebo je ukládají na dobu neurčitou na svých serverech, Forward Email funguje radikálně odlišným způsobem:

1. **Pouze zpracování v paměti** - Vaše přeposlané e-maily neukládáme na disk.
2. **Žádné ukládání metadat** - Neuchováváme záznamy o tom, kdo komu e-maily píše.
3. **100% open-source** - Celá naše kódová základna je transparentní a auditovatelná.
4. **End-to-end šifrování** - Podporujeme OpenPGP pro skutečně soukromou komunikaci.

## Implementace SQLite: Trvanlivost a přenositelnost vašich dat {#sqlite-implementation-durability-and-portability-for-your-data}

Jednou z nejvýznamnějších výhod ochrany soukromí při přeposílání e-mailů je naše pečlivě navržená implementace [SQLite](https://en.wikipedia.org/wiki/SQLite). Vyladili jsme SQLite pomocí specifických nastavení PRAGMA a [Protokolování předzápisu (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), abychom zajistili odolnost i přenositelnost vašich dat a zároveň zachovali nejvyšší standardy ochrany soukromí a zabezpečení.

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

Tato implementace zajišťuje nejen bezpečnost vašich dat, ale i jejich přenositelnost. Svůj e-mail si můžete kdykoli vzít a nechat ho exportovat ve formátech [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) nebo SQLite. A když chcete svá data smazat, jsou skutečně pryč – soubory jednoduše smažeme z diskového úložiště, místo abychom spouštěli příkazy SQL DELETE ROW, které mohou zanechat stopy v databázi.

Aspekt kvantového šifrování v naší implementaci používá při inicializaci databáze jako šifru ChaCha20-Poly1305, což poskytuje silnou ochranu před současnými i budoucími hrozbami pro vaše soukromí.

## Inteligentní mechanismus fronty a opakování: Zajištění doručení e-mailů {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Místo toho, abychom se zaměřovali pouze na zpracování hlaviček, implementovali jsme sofistikovaný inteligentní mechanismus fronty a opakování s naší metodou `getBounceInfo`. Tento systém zajišťuje, že vaše e-maily mají nejlepší šanci na doručení, a to i v případě dočasných problémů.

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
> Toto je výňatek z metody `getBounceInfo` a nikoli skutečná rozsáhlá implementace. Úplný kód si můžete prohlédnout na [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Pokusy o doručení pošty opakujeme po dobu 5 dnů, podobně jako v oborových standardech (např. [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), což dává dočasným problémům čas na jejich vyřešení. Tento přístup výrazně zlepšuje míru doručování a zároveň zachovává soukromí.

Podobně také po úspěšném doručení redigujeme obsah odchozích SMTP e-mailů. Toto je v našem úložném systému nakonfigurováno s výchozí dobou uchovávání 30 dnů, kterou můžete upravit v pokročilém nastavení vaší domény. Po uplynutí této doby je obsah e-mailu automaticky redigován a smazán, přičemž zůstane pouze zástupná zpráva:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Tento přístup zajišťuje, že vaše odeslané e-maily nezůstanou uloženy na dobu neurčitou, což snižuje riziko úniku dat nebo neoprávněného přístupu k vaší komunikaci.

## Neomezené zdroje s inteligentním omezením rychlosti {#unlimited-resources-with-intelligent-rate-limiting}

Přestože Forward Email nabízí neomezený počet domén a aliasů, implementovali jsme inteligentní omezení rychlosti, abychom chránili náš systém před zneužitím a zajistili spravedlivé používání pro všechny uživatele. Například zákazníci z jiných firem si mohou vytvořit až 50+ aliasů denně, což zabraňuje spamu a zahlcení naší databáze a umožňuje efektivní fungování našich funkcí pro detekci zneužití a ochranu v reálném čase.

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

Tento vyvážený přístup vám poskytuje flexibilitu vytvořit si tolik e-mailových adres, kolik potřebujete pro komplexní správu soukromí, a zároveň zachovat integritu a výkon našich služeb pro všechny uživatele.

## Šifrování v sandboxu pro vylepšené zabezpečení {#sandboxed-encryption-for-enhanced-security}

Náš unikátní přístup k sandboxovému šifrování poskytuje klíčovou bezpečnostní výhodu, kterou mnoho uživatelů při výběru e-mailové služby přehlíží. Pojďme se podívat, proč je sandboxování dat, zejména e-mailů, tak důležité.

Služby jako Gmail a Proton s největší pravděpodobností používají sdílený [relační databáze](https://en.wikipedia.org/wiki/Relational_database), což vytváří zásadní bezpečnostní zranitelnost. V prostředí sdílené databáze, pokud někdo získá přístup k datům jednoho uživatele, potenciálně má cestu k přístupu i k datům ostatních uživatelů. Je to proto, že všechna uživatelská data se nacházejí ve stejných databázových tabulkách, oddělená pouze uživatelskými ID nebo podobnými identifikátory.

Přeposílání e-mailů využívá zásadně odlišný přístup s naším sandboxovým šifrováním:

1. **Úplná izolace**: Data každého uživatele jsou uložena ve vlastním šifrovaném souboru databáze SQLite, zcela izolovaná od ostatních uživatelů.
2. **Nezávislé šifrovací klíče**: Každá databáze je šifrována vlastním jedinečným klíčem odvozeným z hesla uživatele.
3. **Žádné sdílené úložiště**: Na rozdíl od relačních databází, kde všechny e-maily uživatelů mohou být v jedné tabulce „e-maily“, náš přístup zajišťuje, že nedochází ke smíchání dat.
4. **Hloubková ochrana**: I kdyby byla databáze jednoho uživatele nějakým způsobem ohrožena, neposkytla by přístup k datům žádného jiného uživatele.

Tento přístup sandboxu je podobný tomu, jako byste měli e-maily v samostatném fyzickém trezoru, nikoli ve sdíleném úložišti s vnitřními přepážkami. Jedná se o zásadní architektonický rozdíl, který výrazně zvyšuje vaše soukromí a zabezpečení.

## Zpracování e-mailů v paměti: Žádné úložiště na disku pro maximální soukromí {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

V rámci naší služby přeposílání e-mailů zpracováváme e-maily výhradně v paměti RAM a nikdy je nezapisujeme na diskový úložiště ani do databází. Tento přístup poskytuje bezkonkurenční ochranu před sledováním e-mailů a shromažďováním metadat.

Zde je zjednodušený pohled na to, jak funguje naše zpracování e-mailů:

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

Tento přístup znamená, že i kdyby byly naše servery napadeny, útočníci by neměli přístup k žádným historickým datům e-mailů. Vaše e-maily jednoduše projdou naším systémem a jsou okamžitě přeposlány na místo určení bez zanechání stopy. Tento přístup k přeposílání e-mailů bez protokolování je zásadní pro ochranu vaší komunikace před sledováním.

## Šifrování typu end-to-end s OpenPGP pro naprosté soukromí {#end-to-end-encryption-with-openpgp-for-complete-privacy}

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

Tato implementace zajišťuje, že vaše e-maily jsou šifrovány předtím, než opustí vaše zařízení, a dešifrovat je může pouze zamýšlený příjemce, čímž se zachovává soukromí vaší komunikace i před námi. To je nezbytné pro ochranu citlivé komunikace před neoprávněným přístupem a sledováním.

## Vícevrstvá ochrana obsahu pro komplexní zabezpečení {#multi-layered-content-protection-for-comprehensive-security}

Přeposílání e-mailů nabízí několik vrstev ochrany obsahu, které jsou ve výchozím nastavení povoleny a poskytují komplexní zabezpečení před různými hrozbami:

1. **Ochrana obsahu pro dospělé** – Filtruje nevhodný obsah bez ohrožení soukromí
2. **Ochrana [Phishing](https://en.wikipedia.org/wiki/Phishing)** – Blokuje pokusy o krádež vašich informací a zároveň zachovává anonymitu
3. **Ochrana spustitelných souborů** – Zabraňuje potenciálně škodlivým přílohám bez skenování obsahu
4. **Ochrana [Virus](https://en.wikipedia.org/wiki/Computer_virus)** – Prohledává malware pomocí technik zachování soukromí

Na rozdíl od mnoha poskytovatelů, kteří tyto funkce umožňují volbu, my jsme je povolili, abychom zajistili, že všichni uživatelé budou mít z těchto ochranných opatření automaticky prospěch. Tento přístup odráží náš závazek k ochraně soukromí i zabezpečení a poskytuje rovnováhu, které se mnoha e-mailovým službám nedaří dosáhnout.

## Jak se lišíme od ostatních e-mailových služeb: Technická výhoda v oblasti soukromí {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Při porovnávání služby Forward Email s jinými e-mailovými službami je patrné několik klíčových technických rozdílů, které zdůrazňují náš přístup kladený na ochranu soukromí:

### Transparentnost otevřeného zdrojového kódu pro ověřitelné soukromí {#open-source-transparency-for-verifiable-privacy}

Přestože mnoho poskytovatelů e-mailů tvrdí, že jsou open source, často nechávají svůj backendový kód uzavřený. Přeposílaní e-mailů je 100% [otevřený zdrojový kód](https://en.wikipedia.org/wiki/Open_source), včetně frontendového i backendového kódu. Tato transparentnost umožňuje nezávislý bezpečnostní audit všech komponent a zajišťuje, že naše tvrzení o ochraně soukromí může kdokoli ověřit.

### Žádná vazba na dodavatele pro ochranu soukromí bez kompromisů {#no-vendor-lock-in-for-privacy-without-compromise}

Mnoho poskytovatelů e-mailů zaměřených na soukromí vyžaduje používání jejich proprietárních aplikací nebo mostů. Funkce Forward Email funguje s jakýmkoli standardním e-mailovým klientem prostřednictvím protokolů [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) a [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), což vám dává svobodu vybrat si preferovaný e-mailový software bez kompromisů v oblasti soukromí.

### Data v sandboxu pro skutečnou izolaci {#sandboxed-data-for-true-isolation}

Na rozdíl od služeb, které používají sdílené databáze, kde jsou data všech uživatelů smíchána, náš přístup s využitím sandboxu zajišťuje, že data každého uživatele jsou zcela izolována. Tento zásadní architektonický rozdíl poskytuje výrazně silnější záruky soukromí než většina e-mailových služeb.

### Přenositelnost a kontrola dat {#data-portability-and-control}

Věříme, že vaše data patří vám, a proto vám umožňujeme snadno exportovat vaše e-maily ve standardních formátech (MBOX, EML, SQLite) a skutečně smazat vaše data, kdykoli si to přejete. Tato úroveň kontroly je u poskytovatelů e-mailových služeb vzácná, ale pro skutečné soukromí je nezbytná.

## Technické výzvy přeposílání e-mailů s důrazem na soukromí {#the-technical-challenges-of-privacy-first-email-forwarding}

Vytvoření e-mailové služby, která klade důraz na soukromí, s sebou nese značné technické výzvy. Zde jsou některé z překážek, které jsme překonali:

### Správa paměti pro zpracování e-mailů bez protokolování {#memory-management-for-no-logging-email-processing}

Zpracování e-mailů v paměti bez nutnosti ukládání na disk vyžaduje pečlivou správu paměti, aby bylo možné efektivně zvládat velké objemy e-mailového provozu. Implementovali jsme pokročilé techniky optimalizace paměti, abychom zajistili spolehlivý výkon bez kompromisů v naší politice neukládání dat, která je klíčovou součástí naší strategie ochrany soukromí.

### Detekce spamu bez analýzy obsahu pro filtrování s ohledem na zachování soukromí {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Většina detekčních systémů [spam](https://en.wikipedia.org/wiki/Email_spam) se spoléhá na analýzu obsahu e-mailů, což je v rozporu s našimi zásadami ochrany osobních údajů. Vyvinuli jsme techniky k identifikaci spamových vzorců bez čtení obsahu vašich e-mailů, čímž dosahujeme rovnováhy mezi ochranou soukromí a použitelností a zároveň zachováváme důvěrnost vaší komunikace.

### Zachování kompatibility s designem zaměřeným na ochranu soukromí {#maintaining-compatibility-with-privacy-first-design}

Zajištění kompatibility se všemi e-mailovými klienty a zároveň implementace pokročilých funkcí ochrany osobních údajů vyžadovalo kreativní technická řešení. Náš tým neúnavně pracoval na tom, aby bylo soukromí bezproblémové, takže si při ochraně své e-mailové komunikace nemusíte vybírat mezi pohodlím a zabezpečením.

## Nejlepší postupy ochrany osobních údajů pro uživatele přeposílaných e-mailů {#privacy-best-practices-for-forward-email-users}

Pro maximalizaci ochrany před sledováním e-mailů a zajištění soukromí při používání funkce Forward Email doporučujeme následující osvědčené postupy:

1. **Používejte jedinečné aliasy pro různé služby** - Vytvořte si pro každou službu, ke které se zaregistrujete, jiný alias e-mailu, abyste zabránili sledování mezi službami.
2. **Povolte šifrování OpenPGP** - Pro citlivou komunikaci používejte šifrování end-to-end, abyste zajistili úplné soukromí.
3. **Pravidelně střídejte aliasy e-mailů** - Pravidelně aktualizujte aliasy důležitých služeb, abyste minimalizovali dlouhodobý sběr dat.
4. **Používejte silná a jedinečná hesla** - Chraňte svůj účet Forward Email silným heslem, abyste zabránili neoprávněnému přístupu.
5. **Implementujte anonymizaci [IP adresa](https://en.wikipedia.org/wiki/IP_address)** - Zvažte použití [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) ve spojení s Forward Email pro úplnou anonymitu.

## Závěr: Budoucnost přeposílání soukromých e-mailů {#conclusion-the-future-of-private-email-forwarding}

Ve společnosti Forward Email věříme, že soukromí není jen funkce – je to základní právo. Naše technické implementace toto přesvědčení odrážejí a poskytují vám přeposílání e-mailů, které respektuje vaše soukromí na všech úrovních a chrání vás před sledováním e-mailů a shromažďováním metadat.

I když neustále vyvíjíme a vylepšujeme naše služby, náš závazek k ochraně soukromí zůstává neochvějný. Neustále zkoumáme nové metody šifrování, zkoumáme další možnosti ochrany soukromí a zdokonalujeme naši kódovou základnu, abychom vám poskytli co nejbezpečnější e-mailový zážitek.

Volbou možnosti Přeposílání e-mailů si nejen vybíráte e-mailovou službu – podporujete také vizi internetu, kde je soukromí výchozím nastavením, nikoli výjimkou. Přidejte se k nám a budujte soukromější digitální budoucnost, jeden e-mail po druhém.

<!-- *Klíčová slova: přeposílání soukromých e-mailů, ochrana soukromí e-mailů, zabezpečená e-mailová služba, e-mail s otevřeným zdrojovým kódem, kvantově bezpečné šifrování, e-mail OpenPGP, zpracování e-mailů v paměti, e-mailová služba bez protokolování, ochrana metadat e-mailů, soukromí v záhlavích e-mailů, e-mail šifrovaný end-to-end, e-mail zaměřený na soukromí, anonymní přeposílání e-mailů, osvědčené postupy zabezpečení e-mailů, ochrana obsahu e-mailů, ochrana před phishingem, antivirová kontrola e-mailů, poskytovatel e-mailů zaměřený na soukromí, bezpečné záhlaví e-mailů, implementace soukromí e-mailů, ochrana před sledováním e-mailů, přeposílání e-mailů bez protokolování, zabránění úniku metadat e-mailů, techniky ochrany soukromí e-mailů, anonymizace IP adres pro e-maily, aliasy soukromých e-mailů, zabezpečení přeposílání e-mailů, soukromí e-mailů před inzerenty, kvantově odolné šifrování e-mailů, soukromí e-mailů bez kompromisů, úložiště e-mailů SQLite, šifrování e-mailů v sandboxu, přenositelnost dat pro e-maily* -->