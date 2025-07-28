# Hur vidarebefordran av e-post skyddar din integritet, domän och säkerhet: En teknisk djupdykning {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [The Forward Email Privacy Philosophy](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Hållbarhet och portabilitet för dina data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kö- och försöksmekanism: Säkerställer e-postleverans](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Obegränsade resurser med intelligent hastighetsbegränsning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandlådekryptering för förbättrad säkerhet](#sandboxed-encryption-for-enhanced-security)
* [E-postbearbetning i minnet: Ingen disklagring för maximal sekretess](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-end-kryptering med OpenPGP för fullständig integritet](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Innehållsskydd i flera lager för omfattande säkerhet](#multi-layered-content-protection-for-comprehensive-security)
* [Hur vi skiljer oss från andra e-posttjänster: Den tekniska integritetsfördelen](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Öppen källkodstransparens för verifierbar integritet](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverantörslåsning för integritet utan kompromisser](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandlådedata för sann isolering](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet och kontroll](#data-portability-and-control)
* [De tekniska utmaningarna med Privacy-First Email Forwarding](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Minneshantering för e-postbearbetning utan loggning](#memory-management-for-no-logging-email-processing)
  * [Spamdetektering utan innehållsanalys för sekretessbevarande filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Upprätthålla kompatibilitet med Privacy-First Design](#maintaining-compatibility-with-privacy-first-design)
* [Bästa metoder för sekretess för vidarebefordran av e-postanvändare](#privacy-best-practices-for-forward-email-users)
* [Slutsats: Framtiden för privat vidarebefordran av e-post](#conclusion-the-future-of-private-email-forwarding)

## Förord {#foreword}

I dagens digitala landskap har e-postsekretess blivit mer kritisk än någonsin. Med dataintrång, övervakningsproblem och riktad reklam baserad på e-postinnehåll, söker användare alltmer lösningar som prioriterar deras integritet. På Forward Email har vi byggt vår tjänst från grunden med integritet som hörnstenen i vår arkitektur. Det här blogginlägget utforskar de tekniska implementeringarna som gör vår tjänst till en av de mest sekretessfokuserade lösningarna för vidarebefordran av e-post som finns.

## Integritetsfilosofin för vidarebefordran av e-post {#the-forward-email-privacy-philosophy}

Innan vi går in på de tekniska detaljerna är det viktigt att förstå vår grundläggande integritetsfilosofi: **dina e-postmeddelanden tillhör dig och bara dig**. Denna princip vägleder alla tekniska beslut vi fattar, från hur vi hanterar vidarebefordran av e-post till hur vi implementerar kryptering.

Till skillnad från många e-postleverantörer som skannar dina meddelanden i reklamsyfte eller lagrar dem på obestämd tid på sina servrar, fungerar Forward Email med ett radikalt annorlunda tillvägagångssätt:

1. **Endast bearbetning i minnet** - Vi lagrar inte dina vidarebefordrade e-postmeddelanden på disk
2. **Ingen metadatalagring** - Vi för inte register över vem som skickar e-post till vem
3. **100 % öppen källkod** - Hela vår kodbas är transparent och granskningsbar
4. **End-to-end-kryptering** - Vi stöder OpenPGP för verkligt privat kommunikation

## SQLite-implementering: Hållbarhet och portabilitet för dina data {#sqlite-implementation-durability-and-portability-for-your-data}

En av de viktigaste integritetsfördelarna med Vidarebefordra e-post är vår noggrant konstruerade [SQLite](https://en.wikipedia.org/wiki/SQLite)-implementering. Vi har finjusterat SQLite med specifika PRAGMA-inställningar och [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) för att säkerställa både hållbarhet och portabilitet för dina data, samtidigt som vi upprätthåller högsta möjliga standard för integritet och säkerhet.

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

Den här implementeringen säkerställer att dina data inte bara är säkra utan också portabla. Du kan ta med dig din e-post när som helst genom att exportera i [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) eller SQLite-format. Och när du vill radera dina data är de verkligen borta – vi raderar helt enkelt filerna från disklagringen istället för att köra SQL DELETE ROW-kommandon, vilket kan lämna spår i databasen.

Kvantkrypteringsaspekten av vår implementering använder ChaCha20-Poly1305 som chiffer när vi initierar databasen, vilket ger ett starkt skydd mot både nuvarande och framtida hot mot din datasekretess.

## Smart kö och mekanism för återförsök: Säkerställer e-postleverans {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Istället för att enbart fokusera på hantering av rubriker har vi implementerat en sofistikerad smart kö- och återförsöksmekanism med vår `getBounceInfo`-metod. Detta system säkerställer att dina e-postmeddelanden har bästa möjliga chans att levereras, även när tillfälliga problem uppstår.

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

Vi försöker leverera posten igen i 5 dagar, ungefär som branschstandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), vilket ger tillfälliga problem tid att lösa sig själva. Denna metod förbättrar leveransfrekvensen avsevärt samtidigt som sekretessen bibehålls.

På liknande sätt redigerar vi också meddelandeinnehållet i utgående SMTP-e-postmeddelanden efter framgångsrik leverans. Detta är konfigurerat i vårt lagringssystem med en standardlagringsperiod på 30 dagar, som du kan justera i din domäns avancerade inställningar. Efter denna period redigeras och rensas e-postinnehållet automatiskt, med endast ett platshållarmeddelande kvar:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Detta tillvägagångssätt säkerställer att dina skickade e-postmeddelanden inte förblir lagrade på obestämd tid, vilket minskar risken för dataintrång eller obehörig åtkomst till din kommunikation.

## Obegränsade resurser med intelligent hastighetsbegränsning {#unlimited-resources-with-intelligent-rate-limiting}

Medan Forward Email erbjuder ett obegränsat antal domäner och alias, har vi implementerat intelligent hastighetsbegränsning för att skydda vårt system från missbruk och säkerställa rättvis användning för alla användare. Till exempel kan icke-företagskunder skapa upp till 50+ alias per dag, vilket förhindrar vår databas från att spammas och översvämmas, och gör att våra funktioner för missbruk och skydd i realtid fungerar effektivt.

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

Detta balanserade tillvägagångssätt ger dig flexibiliteten att skapa så många e-postadresser som du behöver för omfattande integritetshantering, samtidigt som integriteten och prestandan för vår tjänst bibehålls för alla användare.

## Sandlådebaserad kryptering för förbättrad säkerhet {#sandboxed-encryption-for-enhanced-security}

Vår unika krypteringsmetod i sandlåde ger en kritisk säkerhetsfördel som många användare förbiser när de väljer en e-posttjänst. Låt oss utforska varför sandlådedata, särskilt e-post, är så viktigt.

Tjänster som Gmail och Proton använder troligtvis delad [relationsdatabaser](https://en.wikipedia.org/wiki/Relational_database), vilket skapar en grundläggande säkerhetsbrist. I en delad databasmiljö, om någon får åtkomst till en användares data, har de potentiellt en väg att komma åt andra användares data också. Detta beror på att all användardata finns i samma databastabeller, endast separerade av användar-ID:n eller liknande identifierare.

Vidarebefordra e-post har ett fundamentalt annorlunda tillvägagångssätt med vår kryptering i sandlåde:

1. **Fullständig isolering**: Varje användares data lagras i sin egen krypterade SQLite-databasfil, helt isolerad från andra användare.

2. **Oberoende krypteringsnycklar**: Varje databas är krypterad med sin egen unika nyckel som härleds från användarens lösenord.

3. **Ingen delad lagring**: Till skillnad från relationsdatabaser där alla användares e-postmeddelanden kan finnas i en enda "e-post"-tabell, säkerställer vår metod ingen sammanblandning av data.

4. **Djupgående försvar**: Även om en användares databas på något sätt komprometteras, skulle den inte ge åtkomst till någon annan användares data.

Den här sandlådemetoden liknar att ha din e-post i ett separat fysiskt valv snarare än i en delad lagringsanläggning med interna avdelare. Det är en grundläggande arkitektonisk skillnad som avsevärt förbättrar din integritet och säkerhet.

## E-postbehandling i minnet: Ingen disklagring för maximal integritet {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

För vår tjänst för vidarebefordran av e-post behandlar vi e-postmeddelanden helt i RAM-minne och skriver dem aldrig till disklagring eller databaser. Detta tillvägagångssätt ger ett oöverträffat skydd mot e-postövervakning och insamling av metadata.

Här är en förenklad titt på hur vår e-postbehandling fungerar:

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

Detta tillvägagångssätt innebär att även om våra servrar äventyrades, skulle det inte finnas några historiska e-postdata för angripare att komma åt. Dina e-postmeddelanden passerar helt enkelt genom vårt system och vidarebefordras omedelbart till sin destination utan att lämna ett spår. Denna metod för vidarebefordran av e-post utan loggning är grundläggande för att skydda din kommunikation från övervakning.

## End-to-End-kryptering med OpenPGP för fullständig integritet {#end-to-end-encryption-with-openpgp-for-complete-privacy}

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

Denna implementering säkerställer att dina e-postmeddelanden krypteras innan de lämnar din enhet och endast kan dekrypteras av den avsedda mottagaren, vilket håller din kommunikation privat även från oss. Detta är viktigt för att skydda känslig kommunikation från obehörig åtkomst och övervakning.

## Flerskiktat innehållsskydd för omfattande säkerhet {#multi-layered-content-protection-for-comprehensive-security}

Forward Email erbjuder flera lager av innehållsskydd som är aktiverade som standard för att ge omfattande säkerhet mot olika hot:

1. **Skydd för vuxeninnehåll** - Filtrerar bort olämpligt innehåll utan att kompromissa med integriteten
2. **[Nätfiske](https://en.wikipedia.org/wiki/Phishing)-skydd** - Blockerar försök att stjäla din information samtidigt som anonymiteten bibehålls
3. **Skydd för körbara filer** - Förhindrar potentiellt skadliga bilagor utan att skanna innehållet
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus)-skydd** - Skannar efter skadlig programvara med hjälp av integritetsbevarande tekniker

Till skillnad från många leverantörer som gör att dessa funktioner väljer att välja, har vi gjort att de väljer bort dem, vilket säkerställer att alla användare drar nytta av dessa skydd som standard. Detta tillvägagångssätt återspeglar vårt engagemang för både integritet och säkerhet, vilket ger en balans som många e-posttjänster misslyckas med.

## Hur vi skiljer oss från andra e-posttjänster: Den tekniska fördelen med integritet {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

När du jämför vidarebefordra e-post med andra e-posttjänster, framhäver flera viktiga tekniska skillnader vårt tillvägagångssätt med integritet först:

### Öppen källkods transparens för verifierbar integritet {#open-source-transparency-for-verifiable-privacy}

Även om många e-postleverantörer påstår sig vara öppen källkod, håller de ofta sin backend-kod stängd. Vidarebefordran av e-post är 100 % __SKYDDAD_LINK_81__, inklusive både frontend- och backend-kod. Denna transparens möjliggör oberoende säkerhetsgranskning av alla komponenter, vilket säkerställer att våra integritetspåståenden kan verifieras av vem som helst.

### Ingen leverantörslåsning för integritet utan kompromisser {#no-vendor-lock-in-for-privacy-without-compromise}

Många integritetsfokuserade e-postleverantörer kräver att du använder deras egna appar eller bryggor. Vidarebefordra e-post fungerar med alla vanliga e-postklienter via protokollen [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) och [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), vilket ger dig friheten att välja din föredragna e-postprogramvara utan att kompromissa med integriteten.

### Sandlådedata för sann isolering {#sandboxed-data-for-true-isolation}

Till skillnad från tjänster som använder delade databaser där alla användares data blandas, säkerställer vår sandlådelösning att varje användares data är helt isolerad. Denna grundläggande arkitektoniska skillnad ger betydligt starkare integritetsgarantier än vad de flesta e-posttjänster erbjuder.

### Dataportabilitet och kontroll {#data-portability-and-control}

Vi tror att din data tillhör dig, varför vi gör det enkelt att exportera dina e-postmeddelanden i standardformat (MBOX, EML, SQLite) och verkligen radera din data när du vill. Denna kontrollnivå är sällsynt bland e-postleverantörer men nödvändig för verklig integritet.

## De tekniska utmaningarna med vidarebefordran av e-post med integritet i första hand {#the-technical-challenges-of-privacy-first-email-forwarding}

Att bygga en e-posttjänst i första hand med sekretess kommer med betydande tekniska utmaningar. Här är några av de hinder vi har övervunnit:

### Minneshantering för e-postbehandling utan loggning {#memory-management-for-no-logging-email-processing}

Att behandla e-postmeddelanden i minnet utan disklagring kräver noggrann minneshantering för att hantera stora volymer e-posttrafik effektivt. Vi har implementerat avancerade minnesoptimeringstekniker för att säkerställa tillförlitlig prestanda utan att kompromissa med vår policy om ingen lagring, en kritisk komponent i vår strategi för integritetsskydd.

### Skräppostdetektering utan innehållsanalys för integritetsbevarande filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De flesta [spam](https://en.wikipedia.org/wiki/Email_spam)-detekteringssystem förlitar sig på att analysera e-postinnehåll, vilket strider mot våra integritetsprinciper. Vi har utvecklat tekniker för att identifiera skräppostmönster utan att läsa innehållet i dina e-postmeddelanden, och hitta en balans mellan integritet och användbarhet som bevarar konfidentialiteten i din kommunikation.

### Bibehålla kompatibilitet med integritetsfokuserad design {#maintaining-compatibility-with-privacy-first-design}

Att säkerställa kompatibilitet med alla e-postklienter samtidigt som avancerade sekretessfunktioner implementeras har krävt kreativa tekniska lösningar. Vårt team har arbetat outtröttligt för att göra integriteten sömlös, så att du inte behöver välja mellan bekvämlighet och säkerhet när du skyddar din e-postkommunikation.

## Bästa praxis för sekretess för användare som vidarebefordrar e-post {#privacy-best-practices-for-forward-email-users}

För att maximera ditt skydd mot e-postövervakning och maximera din integritet när du använder Vidarebefordra e-post rekommenderar vi följande bästa praxis:

1. **Använd unika alias för olika tjänster** - Skapa ett annat e-postalias för varje tjänst du registrerar dig för för att förhindra spårning mellan tjänster
2. **Aktivera OpenPGP-kryptering** - För känslig kommunikation, använd end-to-end-kryptering för att säkerställa fullständig integritet
3. **Rotera regelbundet dina e-postalias** - Uppdatera regelbundet alias för viktiga tjänster för att minimera långsiktig datainsamling
4. **Använd starka, unika lösenord** - Skydda ditt konto för vidarebefordran av e-post med ett starkt lösenord för att förhindra obehörig åtkomst
5. **Implementera [IP-adress](https://en.wikipedia.org/wiki/IP_address) anonymisering** - Överväg att använda en [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) tillsammans med vidarebefordran av e-post för fullständig anonymitet

## Slutsats: Framtiden för vidarebefordran av privat e-post {#conclusion-the-future-of-private-email-forwarding}

På Forward Email tror vi att integritet inte bara är en funktion – det är en grundläggande rättighet. Våra tekniska implementeringar återspeglar denna övertygelse och ger dig vidarebefordran av e-post som respekterar din integritet på alla nivåer och skyddar dig från e-postövervakning och insamling av metadata.

När vi fortsätter att utveckla och förbättra vår tjänst förblir vårt engagemang för integritet orubbligt. Vi undersöker ständigt nya krypteringsmetoder, utforskar ytterligare integritetsskydd och förfinar vår kodbas för att ge den säkraste e-postupplevelsen som möjligt.

Genom att välja Vidarebefordra e-post väljer du inte bara en e-posttjänst – du stödjer en vision om internet där integritet är standard, inte undantag. Var med och bygg en mer privat digital framtid, ett e-postmeddelande i taget.

<!-- *Nyckelord: privat vidarebefordran av e-post, skydd av e-postsekretess, säker e-posttjänst, öppen källkods-e-post, kvantsäker kryptering, OpenPGP-e-post, e-postbehandling i minnet, e-posttjänst utan loggar, skydd av e-postmetadata, sekretess för e-postrubriker, end-to-end-krypterad e-post, sekretessprioriterat e-postmeddelande, anonym e-postvidarebefordran, bästa praxis för e-postsäkerhet, skydd av e-postinnehåll, nätfiskeskydd, virusskanning för e-post, sekretessfokuserad e-postleverantör, säkra e-postrubriker, implementering av e-postsekretess, skydd mot e-postövervakning, vidarebefordran av e-post utan loggar, förhindra läckage av e-postmetadata, tekniker för e-postsekretess, anonymisering av IP-adresser för e-post, privata e-postalias, säkerhet för vidarebefordran av e-post, e-postsekretess från annonsörer, kvantsäker e-postkryptering, e-postsekretess utan kompromisser, SQLite-e-postlagring, sandlådebaserad e-postkryptering, dataportabilitet för e-post* -->