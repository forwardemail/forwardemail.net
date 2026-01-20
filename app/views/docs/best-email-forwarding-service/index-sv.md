# Hur vidarebefordran av e-post skyddar din integritet, domän och säkerhet: En teknisk djupdykning {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Filosofin för integritetsskydd för vidarebefordran av e-post](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Hållbarhet och portabilitet för dina data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kö- och återförsöksmekanism: Säkerställer e-postleverans](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Obegränsade resurser med intelligent hastighetsbegränsning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandlådebaserad kryptering för förbättrad säkerhet](#sandboxed-encryption-for-enhanced-security)
* [E-posthantering i minnet: Ingen disklagring för maximal integritet](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-End-kryptering med OpenPGP för fullständig integritet](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Flerskiktat innehållsskydd för omfattande säkerhet](#multi-layered-content-protection-for-comprehensive-security)
* [Hur vi skiljer oss från andra e-posttjänster: Den tekniska fördelen med integritet](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Öppen källkods transparens för verifierbar integritet](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverantörslåsning för kompromisslös integritet](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandbox-data för sann isolering](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet och kontroll](#data-portability-and-control)
* [De tekniska utmaningarna med vidarebefordran av e-post med integritet i första hand](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Minneshantering för e-postbehandling utan loggning](#memory-management-for-no-logging-email-processing)
  * [Skräppostdetektering utan innehållsanalys för integritetsbevarande filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Bibehålla kompatibilitet med integritetsfokuserad design](#maintaining-compatibility-with-privacy-first-design)
* [Bästa praxis för sekretess för användare som vidarebefordrar e-post](#privacy-best-practices-for-forward-email-users)
* [Slutsats: Framtiden för privat vidarebefordran av e-post](#conclusion-the-future-of-private-email-forwarding)

## Förord {#foreword}

I dagens digitala landskap har e-postsekretess blivit viktigare än någonsin. Med dataintrång, övervakningsproblem och riktad reklam baserad på e-postinnehåll söker användare i allt högre grad lösningar som prioriterar deras integritet. På Forward Email har vi byggt vår tjänst från grunden med integritet som hörnsten i vår arkitektur. Det här blogginlägget utforskar de tekniska implementeringar som gör vår tjänst till en av de mest integritetsfokuserade lösningarna för vidarebefordran av e-post som finns tillgängliga.

## Sekretessfilosofin för vidarebefordran av e-post {#the-forward-email-privacy-philosophy}

Innan vi går in på de tekniska detaljerna är det viktigt att förstå vår grundläggande integritetsfilosofi: **dina e-postmeddelanden tillhör dig och bara dig**. Denna princip vägleder alla tekniska beslut vi fattar, från hur vi hanterar vidarebefordran av e-post till hur vi implementerar kryptering.

Till skillnad från många e-postleverantörer som skannar dina meddelanden i reklamsyfte eller lagrar dem på obestämd tid på sina servrar, fungerar Forward Email med en radikalt annorlunda metod:

1. **Endast bearbetning i minnet** - Vi lagrar inte dina vidarebefordrade e-postmeddelanden på disk
2. **Ingen metadatalagring** - Vi för inte register över vem som skickar e-post till vem
3. **100 % öppen källkod** - Hela vår kodbas är transparent och granskningsbar
4. **End-to-end-kryptering** - Vi stöder OpenPGP för verkligt privat kommunikation

## SQLite-implementering: Hållbarhet och portabilitet för dina data {#sqlite-implementation-durability-and-portability-for-your-data}

En av de viktigaste integritetsfördelarna med Vidarebefordra e-post är vår noggrant utformade [SQLite](https://en.wikipedia.org/wiki/SQLite)-implementering. Vi har finjusterat SQLite med specifika PRAGMA-inställningar och [Förhandsloggning (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) för att säkerställa både hållbarhet och portabilitet för dina data, samtidigt som vi upprätthåller högsta möjliga standard för integritet och säkerhet.

Här är en titt på hur vi har implementerat SQLite med [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) som chiffer för kvantresistent kryptering:

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

Den här implementeringen säkerställer att dina data inte bara är säkra utan också portabla. Du kan ta med dig din e-post när som helst genom att exportera i formaten [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) eller SQLite. Och när du vill radera dina data är de verkligen borta – vi tar helt enkelt bort filerna från disklagringen istället för att köra SQL DELETE ROW-kommandon, vilket kan lämna spår i databasen.

Kvantkrypteringsaspekten av vår implementering använder ChaCha20-Poly1305 som chiffer när vi initierar databasen, vilket ger ett starkt skydd mot både nuvarande och framtida hot mot din dataintegritet.

## Smart kö och mekanism för återförsök: Säkerställer e-postleverans {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Istället för att enbart fokusera på hantering av headers har vi implementerat en sofistikerad smart kö- och återförsöksmekanism med vår `getBounceInfo`-metod. Det här systemet säkerställer att dina e-postmeddelanden har bästa möjliga chans att levereras, även när tillfälliga problem uppstår.

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
> Detta är ett utdrag av metoden `getBounceInfo` och inte den faktiska omfattande implementeringen. För den fullständiga koden kan du granska den på [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Vi försöker leverera posten igen i fem dagar, ungefär som branschstandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), vilket ger tillfälliga problem tid att lösa sig själva. Denna metod förbättrar leveransfrekvensen avsevärt samtidigt som sekretessen bibehålls.

På liknande sätt redigerar vi även meddelandeinnehållet i utgående SMTP-e-postmeddelanden efter lyckad leverans. Detta är konfigurerat i vårt lagringssystem med en standardlagringsperiod på 30 dagar, som du kan justera i din domäns avancerade inställningar. Efter denna period redigeras och rensas e-postinnehållet automatiskt, med endast ett platshållarmeddelande kvar:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Denna metod säkerställer att dina skickade e-postmeddelanden inte lagras på obestämd tid, vilket minskar risken för dataintrång eller obehörig åtkomst till din kommunikation.

## Obegränsade resurser med intelligent hastighetsbegränsning {#unlimited-resources-with-intelligent-rate-limiting}

Även om Forward Email erbjuder obegränsade domäner och alias, har vi implementerat intelligent hastighetsbegränsning för att skydda vårt system från missbruk och säkerställa rättvis användning för alla användare. Till exempel kan icke-företagskunder skapa upp till 50+ alias per dag, vilket förhindrar att vår databas spammas och översvämmas, och gör att våra funktioner för missbruk och skydd i realtid fungerar effektivt.

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

Denna balanserade strategi ger dig flexibiliteten att skapa så många e-postadresser som du behöver för omfattande integritetshantering, samtidigt som du bibehåller integriteten och prestandan för vår tjänst för alla användare.

## Sandlådebaserad kryptering för förbättrad säkerhet {#sandboxed-encryption-for-enhanced-security}

Vår unika krypteringsmetod i sandlådemiljö ger en avgörande säkerhetsfördel som många användare förbiser när de väljer en e-posttjänst. Låt oss utforska varför det är så viktigt att kryptera data i sandlådemiljö, särskilt e-post.

Tjänster som Gmail och Proton använder troligtvis delad [relationsdatabaser](https://en.wikipedia.org/wiki/Relational_database), vilket skapar en grundläggande säkerhetsbrist. I en delad databasmiljö, om någon får åtkomst till en användares data, har de potentiellt en väg att komma åt andra användares data också. Detta beror på att all användardata finns i samma databastabeller, endast separerade av användar-ID:n eller liknande identifierare.

Vidarebefordra e-post har en fundamentalt annorlunda strategi med vår sandlådebaserade kryptering:

1. **Fullständig isolering**: Varje användares data lagras i sin egen krypterade SQLite-databasfil, helt isolerad från andra användare.

2. **Oberoende krypteringsnycklar**: Varje databas är krypterad med sin egen unika nyckel som härleds från användarens lösenord.

3. **Ingen delad lagring**: Till skillnad från relationsdatabaser där alla användares e-postmeddelanden kan finnas i en enda "e-post"-tabell, säkerställer vår metod ingen sammanblandning av data.

4. **Djupgående försvar**: Även om en användares databas på något sätt komprometteras, skulle den inte ge åtkomst till någon annan användares data.

Denna sandlådebaserade metod liknar att ha din e-post i ett separat fysiskt valv snarare än i en delad lagringsanläggning med interna avdelare. Det är en grundläggande arkitekturskillnad som avsevärt förbättrar din integritet och säkerhet.

## E-postbehandling i minnet: Ingen disklagring för maximal integritet {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

För vår e-postvidarebefordringstjänst bearbetar vi e-postmeddelanden helt i RAM-minnet och skriver dem aldrig till disklagring eller databaser. Denna metod ger oöverträffat skydd mot e-postövervakning och insamling av metadata.

Här är en förenklad översikt över hur vår e-posthantering fungerar:

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

Den här metoden innebär att även om våra servrar komprometteras, skulle det inte finnas någon historisk e-postdata som angripare kan komma åt. Dina e-postmeddelanden passerar helt enkelt genom vårt system och vidarebefordras omedelbart till sin destination utan att lämna spår. Denna metod för vidarebefordran av e-post utan loggning är grundläggande för att skydda din kommunikation från övervakning.

## End-to-End-kryptering med OpenPGP för fullständig sekretess {#end-to-end-encryption-with-openpgp-for-complete-privacy}

För användare som behöver högsta möjliga nivå av integritetsskydd från e-postövervakning stöder vi [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) för end-to-end-kryptering. Till skillnad från många e-postleverantörer som kräver proprietära bryggor eller appar fungerar vår implementering med vanliga e-postklienter, vilket gör säker kommunikation tillgänglig för alla.

Så här implementerar vi OpenPGP-kryptering:

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

Denna implementering säkerställer att dina e-postmeddelanden krypteras innan de lämnar din enhet och endast kan dekrypteras av den avsedda mottagaren, vilket håller din kommunikation privat även för oss. Detta är viktigt för att skydda känslig kommunikation från obehörig åtkomst och övervakning.

## Flerskiktat innehållsskydd för omfattande säkerhet {#multi-layered-content-protection-for-comprehensive-security}

Vidarebefordra e-post erbjuder flera lager av innehållsskydd som är aktiverade som standard för att ge omfattande säkerhet mot olika hot:

1. **Skydd mot vuxeninnehåll** - Filtrerar bort olämpligt innehåll utan att kompromissa med integriteten
2. **[Nätfiske](https://en.wikipedia.org/wiki/Phishing)-skydd** - Blockerar försök att stjäla din information samtidigt som anonymiteten bevaras
3. **Skydd mot körbara filer** - Förhindrar potentiellt skadliga bilagor utan att skanna innehållet
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus)-skydd** - Skannar efter skadlig programvara med hjälp av integritetsbevarande tekniker

Till skillnad från många leverantörer som gör det möjligt att välja bort dessa funktioner, har vi gjort det möjligt att välja bort dem, vilket säkerställer att alla användare drar nytta av dessa skydd som standard. Denna strategi återspeglar vårt engagemang för både integritet och säkerhet, vilket ger en balans som många e-posttjänster misslyckas med att uppnå.

## Hur vi skiljer oss från andra e-posttjänster: Den tekniska sekretessfördelen {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

När man jämför vidarebefordran av e-post med andra e-posttjänster finns det flera viktiga tekniska skillnader som belyser vår integritetsfokuserade strategi:

### Öppen källkods transparens för verifierbar integritet {#open-source-transparency-for-verifiable-privacy}

Även om många e-postleverantörer påstår sig vara öppen källkod, håller de ofta sin backend-kod stängd. Vidarebefordran av e-post är 100 % [öppen källkod](https://en.wikipedia.org/wiki/Open_source), inklusive både frontend- och backend-kod. Denna transparens möjliggör oberoende säkerhetsgranskning av alla komponenter, vilket säkerställer att våra integritetspåståenden kan verifieras av vem som helst.

### Ingen leverantörslåsning för integritet utan kompromisser {#no-vendor-lock-in-for-privacy-without-compromise}

Många integritetsfokuserade e-postleverantörer kräver att du använder deras egna appar eller bryggor. Vidarebefordra e-post fungerar med alla vanliga e-postklienter via protokollen [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) och [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), vilket ger dig friheten att välja din föredragna e-postprogramvara utan att kompromissa med integriteten.

### Sandlådedata för sann isolering {#sandboxed-data-for-true-isolation}

Till skillnad från tjänster som använder delade databaser där alla användares data blandas, säkerställer vår sandlådebaserade metod att varje användares data är helt isolerad. Denna grundläggande arkitekturskillnad ger betydligt starkare integritetsgarantier än vad de flesta e-posttjänster erbjuder.

### Dataportabilitet och kontroll {#data-portability-and-control}

Vi anser att dina uppgifter tillhör dig, och det är därför vi gör det enkelt att exportera dina e-postmeddelanden i standardformat (MBOX, EML, SQLite) och radera dina data när du vill. Denna kontrollnivå är sällsynt bland e-postleverantörer men avgörande för verklig integritet.

## De tekniska utmaningarna med vidarebefordran av e-post med integritet i första hand {#the-technical-challenges-of-privacy-first-email-forwarding}

Att bygga en e-posttjänst som sätter integritet först och främst innebär betydande tekniska utmaningar. Här är några av de hinder vi har övervunnit:

### Minneshantering för e-postbehandling utan loggning {#memory-management-for-no-logging-email-processing}

Att bearbeta e-postmeddelanden i minnet utan disklagring kräver noggrann minneshantering för att hantera stora volymer e-posttrafik effektivt. Vi har implementerat avancerade minnesoptimeringstekniker för att säkerställa tillförlitlig prestanda utan att kompromissa med vår policy mot lagring, en viktig del av vår integritetsskyddsstrategi.

### Skräppostdetektering utan innehållsanalys för integritetsbevarande filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De flesta [skräppost](https://en.wikipedia.org/wiki/Email_spam)-detekteringssystem förlitar sig på att analysera e-postinnehåll, vilket strider mot våra integritetsprinciper. Vi har utvecklat tekniker för att identifiera skräppostmönster utan att läsa innehållet i dina e-postmeddelanden, och hitta en balans mellan integritet och användbarhet som bevarar konfidentialiteten i din kommunikation.

### Bibehålla kompatibilitet med integritetsfokuserad design {#maintaining-compatibility-with-privacy-first-design}

Att säkerställa kompatibilitet med alla e-postklienter samtidigt som avancerade sekretessfunktioner implementeras har krävt kreativa tekniska lösningar. Vårt team har arbetat outtröttligt för att göra sekretessen sömlös, så att du inte behöver välja mellan bekvämlighet och säkerhet när du skyddar din e-postkommunikation.

## Bästa praxis för sekretess för användare som vidarebefordrar e-post {#privacy-best-practices-for-forward-email-users}

För att maximera ditt skydd mot e-postövervakning och din integritet när du använder vidarebefordran av e-post rekommenderar vi följande bästa metoder:

1. **Använd unika alias för olika tjänster** - Skapa ett annat e-postalias för varje tjänst du registrerar dig för för att förhindra spårning mellan tjänster
2. **Aktivera OpenPGP-kryptering** - Använd end-to-end-kryptering för att säkerställa fullständig integritet
3. **Rotera regelbundet dina e-postalias** - Uppdatera regelbundet alias för viktiga tjänster för att minimera långsiktig datainsamling
4. **Använd starka, unika lösenord** - Skydda ditt konto för vidarebefordran av e-post med ett starkt lösenord för att förhindra obehörig åtkomst
5. **Implementera [IP-adress](https://en.wikipedia.org/wiki/IP_address)-anonymisering** - Överväg att använda [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) tillsammans med vidarebefordran av e-post för fullständig anonymitet

## Slutsats: Framtiden för vidarebefordran av privat e-post {#conclusion-the-future-of-private-email-forwarding}

På Forward Email anser vi att integritet inte bara är en funktion – det är en grundläggande rättighet. Våra tekniska implementeringar återspeglar denna övertygelse och ger dig vidarebefordran av e-post som respekterar din integritet på alla nivåer och skyddar dig från e-postövervakning och insamling av metadata.

I takt med att vi fortsätter att utveckla och förbättra vår tjänst förblir vårt engagemang för integritet orubbligt. Vi undersöker ständigt nya krypteringsmetoder, utforskar ytterligare integritetsskydd och förfinar vår kodbas för att ge den säkraste e-postupplevelsen som möjligt.

Genom att välja Vidarebefordra e-post väljer du inte bara en e-posttjänst – du stöder en vision av internet där integritet är standard, inte undantag. Följ med oss och bygg en mer privat digital framtid, ett e-postmeddelande i taget.

<!-- *Nyckelord: privat vidarebefordran av e-post, skydd av e-postsekretess, säker e-posttjänst, öppen källkods-e-post, kvantsäker kryptering, OpenPGP-e-post, e-postbehandling i minnet, e-posttjänst utan loggar, skydd av e-postmetadata, sekretess för e-postrubriker, end-to-end-krypterad e-post, sekretessprioriterat e-postmeddelande, anonym e-postvidarebefordran, bästa praxis för e-postsäkerhet, skydd av e-postinnehåll, nätfiskeskydd, virusskanning för e-post, sekretessfokuserad e-postleverantör, säkra e-postrubriker, implementering av e-postsekretess, skydd mot e-postövervakning, vidarebefordran av e-post utan loggar, förhindra läckage av e-postmetadata, tekniker för e-postsekretess, anonymisering av IP-adresser för e-post, privata e-postalias, säkerhet för vidarebefordran av e-post, e-postsekretess från annonsörer, kvantsäker e-postkryptering, e-postsekretess utan kompromisser, SQLite-e-postlagring, sandlådebaserad e-postkryptering, dataportabilitet för e-post* -->