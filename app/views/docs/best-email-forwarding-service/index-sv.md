# Hur Forward Email skyddar din integritet, domän och säkerhet: Den tekniska djupdykningen {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Bästa e-postvidarebefordranstjänst jämförelse" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Forward Emails integritetsfilosofi](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Hållbarhet och portabilitet för dina data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kö- och omförsöksmekanism: Säkerställer e-postleverans](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Obegränsade resurser med intelligent hastighetsbegränsning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxad kryptering för förbättrad säkerhet](#sandboxed-encryption-for-enhanced-security)
* [E-postbehandling i minnet: Ingen lagring på disk för maximal integritet](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-end-kryptering med OpenPGP för fullständig integritet](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Flerlagers innehållsskydd för omfattande säkerhet](#multi-layered-content-protection-for-comprehensive-security)
* [Hur vi skiljer oss från andra e-posttjänster: Den tekniska integritetsfördelen](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Öppen källkodstransparens för verifierbar integritet](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverantörslåsning för integritet utan kompromisser](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxade data för verklig isolering](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet och kontroll](#data-portability-and-control)
* [De tekniska utmaningarna med integritetsfokuserad e-postvidarebefordran](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Minneshantering för loggfri e-postbehandling](#memory-management-for-no-logging-email-processing)
  * [Spamdetektion utan innehållsanalys för integritetsbevarande filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Bibehållen kompatibilitet med integritetsfokuserad design](#maintaining-compatibility-with-privacy-first-design)
* [Integritetsbästa praxis för Forward Email-användare](#privacy-best-practices-for-forward-email-users)
* [Slutsats: Framtiden för privat e-postvidarebefordran](#conclusion-the-future-of-private-email-forwarding)


## Förord {#foreword}

I dagens digitala landskap har e-postintegritet blivit viktigare än någonsin. Med dataintrång, övervakningsbekymmer och riktad reklam baserad på e-postinnehåll söker användare i allt högre grad lösningar som prioriterar deras integritet. På Forward Email har vi byggt vår tjänst från grunden med integritet som hörnstenen i vår arkitektur. Detta blogginlägg utforskar de tekniska implementationerna som gör vår tjänst till en av de mest integritetsfokuserade e-postvidarebefordringslösningarna som finns tillgängliga.


## Forward Emails integritetsfilosofi {#the-forward-email-privacy-philosophy}

Innan vi dyker in i de tekniska detaljerna är det viktigt att förstå vår grundläggande integritetsfilosofi: **dina e-postmeddelanden tillhör dig och bara dig**. Denna princip styr varje tekniskt beslut vi tar, från hur vi hanterar e-postvidarebefordran till hur vi implementerar kryptering.

Till skillnad från många e-postleverantörer som skannar dina meddelanden för reklamändamål eller lagrar dem på obestämd tid på sina servrar, arbetar Forward Email med en radikalt annorlunda metod:

1. **Endast bearbetning i minnet** – Vi lagrar inte dina vidarebefordrade e-postmeddelanden på disk
2. **Ingen metadata lagring** – Vi sparar inga register över vem som mejlar vem
3. **100 % öppen källkod** – Vår hela kodbas är transparent och granskbar
4. **End-to-end-kryptering** – Vi stödjer OpenPGP för verkligt privata kommunikationer


## SQLite-implementering: Hållbarhet och portabilitet för dina data {#sqlite-implementation-durability-and-portability-for-your-data}

En av de mest betydande integritetsfördelarna med Forward Email är vår noggrant utformade [SQLite](https://en.wikipedia.org/wiki/SQLite)-implementering. Vi har finjusterat SQLite med specifika PRAGMA-inställningar och [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) för att säkerställa både hållbarhet och portabilitet för dina data, samtidigt som vi upprätthåller de högsta standarderna för integritet och säkerhet.
Här är en översikt över hur vi har implementerat SQLite med [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) som chiffer för kvantresistent kryptering:

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

Denna implementation säkerställer att dina data inte bara är säkra utan också portabla. Du kan ta med dig din e-post när som helst genom att exportera i [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) eller SQLite-format. Och när du vill radera dina data är de verkligen borta – vi tar helt enkelt bort filerna från lagringen på disken istället för att köra SQL DELETE ROW-kommandon, vilket kan lämna spår i databasen.

Den kvantkrypteringsaspekt som vår implementation använder är ChaCha20-Poly1305 som chiffer när vi initierar databasen, vilket ger starkt skydd mot både nuvarande och framtida hot mot din datasekretess.


## Smart kö och återförsöksmekanism: Säkerställa e-postleverans {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Istället för att enbart fokusera på hantering av headers har vi implementerat en sofistikerad smart kö och återförsöksmekanism med vår `getBounceInfo`-metod. Detta system säkerställer att dina e-postmeddelanden har bästa möjliga chans att levereras, även när tillfälliga problem uppstår.

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
> Detta är ett utdrag ur `getBounceInfo`-metoden och inte den faktiska omfattande implementationen. För hela koden kan du granska den på [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Vi försöker leverera e-post i 5 dagar, liknande branschstandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), vilket ger tillfälliga problem tid att lösa sig själva. Detta tillvägagångssätt förbättrar leveransgraden avsevärt samtidigt som sekretessen bibehålls.

På liknande sätt redigerar vi också innehållet i utgående SMTP-e-postmeddelanden efter lyckad leverans. Detta konfigureras i vårt lagringssystem med en standard behållningstid på 30 dagar, som du kan justera i din domäns Avancerade inställningar. Efter denna period redigeras och rensas e-postinnehållet automatiskt, med endast ett platshållarmeddelande kvar:

```txt
Detta meddelande skickades framgångsrikt. Det har redigerats och rensats för din säkerhet och integritet. Om du vill öka din meddelande behållningstid, gå till sidan Avancerade inställningar för din domän.
```
Denna metod säkerställer att dina skickade e-postmeddelanden inte lagras på obestämd tid, vilket minskar risken för dataintrång eller obehörig åtkomst till dina kommunikationer.


## Obegränsade resurser med intelligent hastighetsbegränsning {#unlimited-resources-with-intelligent-rate-limiting}

Medan Forward Email erbjuder obegränsade domäner och alias, har vi implementerat intelligent hastighetsbegränsning för att skydda vårt system från missbruk och säkerställa rättvis användning för alla användare. Till exempel kan icke-företagskunder skapa upp till 50+ alias per dag, vilket förhindrar att vår databas spammas och översvämmas, och gör det möjligt för våra realtidsfunktioner för missbruks- och skydd att fungera effektivt.

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

Denna balanserade metod ger dig flexibiliteten att skapa så många e-postadresser du behöver för omfattande sekretesshantering, samtidigt som den upprätthåller integriteten och prestandan för vår tjänst för alla användare.


## Sandlåds-kryptering för förbättrad säkerhet {#sandboxed-encryption-for-enhanced-security}

Vår unika sandlåds-krypteringsmetod ger en kritisk säkerhetsfördel som många användare förbiser när de väljer en e-posttjänst. Låt oss utforska varför sandlådsisolering av data, särskilt e-post, är så viktigt.

Tjänster som Gmail och Proton använder troligen delade [relationsdatabaser](https://en.wikipedia.org/wiki/Relational_database), vilket skapar en grundläggande säkerhetssårbarhet. I en delad databas-miljö, om någon får åtkomst till en användares data, har de potentiellt en väg för att komma åt andra användares data också. Detta beror på att all användardata finns i samma databastabeller, separerade endast av användar-ID:n eller liknande identifierare.

Forward Email tar en fundamentalt annorlunda ansats med vår sandlåds-kryptering:

1. **Fullständig isolering**: Varje användares data lagras i sin egen krypterade SQLite-databasfil, helt isolerad från andra användare
2. **Oberoende krypteringsnycklar**: Varje databas krypteras med sin egen unika nyckel härledd från användarens lösenord
3. **Ingen delad lagring**: Till skillnad från relationsdatabaser där alla användares e-post kan finnas i en enda "emails"-tabell, säkerställer vår metod att data inte blandas ihop
4. **Djupförsvar**: Även om en användares databas på något sätt skulle komprometteras, skulle det inte ge åtkomst till någon annan användares data

Denna sandlådsmetod är likt att ha din e-post i ett separat fysiskt valv snarare än i en delad lagringsanläggning med interna avdelare. Det är en grundläggande arkitektonisk skillnad som avsevärt förbättrar din sekretess och säkerhet.


## E-postbehandling i minnet: Ingen lagring på disk för maximal sekretess {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

För vår e-postvidarebefordran behandlar vi e-postmeddelanden helt i RAM och skriver aldrig dem till disk eller databaser. Denna metod ger oöverträffat skydd mot e-postövervakning och metadata-insamling.

Här är en förenklad bild av hur vår e-postbehandling fungerar:

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
Denna metod innebär att även om våra servrar skulle bli komprometterade, finns det ingen historisk e-postdata för angripare att komma åt. Dina e-postmeddelanden passerar helt enkelt genom vårt system och vidarebefordras omedelbart till sin destination utan att lämna några spår. Denna e-postvidarebefordran utan loggning är grundläggande för att skydda dina kommunikationer från övervakning.


## End-to-End-kryptering med OpenPGP för fullständig sekretess {#end-to-end-encryption-with-openpgp-for-complete-privacy}

För användare som kräver högsta nivå av sekretessskydd mot e-postövervakning stödjer vi [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) för end-to-end-kryptering. Till skillnad från många e-postleverantörer som kräver proprietära bryggor eller appar fungerar vår implementation med standard e-postklienter, vilket gör säker kommunikation tillgänglig för alla.

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

Denna implementation säkerställer att dina e-postmeddelanden är krypterade innan de lämnar din enhet och endast kan dekrypteras av den avsedda mottagaren, vilket håller dina kommunikationer privata även för oss. Detta är avgörande för att skydda känslig kommunikation från obehörig åtkomst och övervakning.


## Flerlagers innehållsskydd för omfattande säkerhet {#multi-layered-content-protection-for-comprehensive-security}

Forward Email erbjuder flera lager av innehållsskydd som är aktiverade som standard för att ge omfattande skydd mot olika hot:

1. **Skydd mot vuxeninnehåll** – Filtrerar bort olämpligt innehåll utan att kompromissa med sekretessen  
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing)-skydd** – Blockerar försök att stjäla din information samtidigt som anonymiteten bevaras  
3. **Skydd mot körbara filer** – Förhindrar potentiellt skadliga bilagor utan att skanna innehållet  
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus)-skydd** – Skannar efter skadlig kod med sekretessbevarande tekniker  

Till skillnad från många leverantörer som gör dessa funktioner valbara har vi gjort dem valfria att stänga av, vilket säkerställer att alla användare drar nytta av dessa skydd som standard. Denna metod speglar vårt engagemang för både sekretess och säkerhet och ger en balans som många e-posttjänster misslyckas med att uppnå.


## Hur vi skiljer oss från andra e-posttjänster: Den tekniska sekretessfördelen {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

När man jämför Forward Email med andra e-posttjänster framhäver flera viktiga tekniska skillnader vårt sekretessfokuserade tillvägagångssätt:

### Öppen källkodstransparens för verifierbar sekretess {#open-source-transparency-for-verifiable-privacy}

Medan många e-postleverantörer påstår sig vara öppen källkod håller de ofta sin backend-kod stängd. Forward Email är 100 % [öppen källkod](https://en.wikipedia.org/wiki/Open_source), inklusive både frontend- och backend-kod. Denna transparens möjliggör oberoende säkerhetsgranskning av alla komponenter, vilket säkerställer att våra sekretesspåståenden kan verifieras av vem som helst.

### Ingen leverantörslåsning för sekretess utan kompromisser {#no-vendor-lock-in-for-privacy-without-compromise}

Många sekretessfokuserade e-postleverantörer kräver att du använder deras proprietära appar eller bryggor. Forward Email fungerar med vilken standard e-postklient som helst via [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) och [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)-protokollen, vilket ger dig friheten att välja din föredragna e-postprogramvara utan att kompromissa med sekretessen.
### Sandlådedata för verklig isolering {#sandboxed-data-for-true-isolation}

Till skillnad från tjänster som använder delade databaser där all användardata blandas, säkerställer vår sandlådelösning att varje användares data är helt isolerad. Denna grundläggande arkitektoniska skillnad ger betydligt starkare integritetsgarantier än vad de flesta e-posttjänster erbjuder.

### Dataöverförbarhet och kontroll {#data-portability-and-control}

Vi tror att din data tillhör dig, vilket är anledningen till att vi gör det enkelt att exportera dina e-postmeddelanden i standardformat (MBOX, EML, SQLite) och verkligen radera din data när du vill. Denna nivå av kontroll är sällsynt bland e-postleverantörer men avgörande för verklig integritet.


## De tekniska utmaningarna med integritetsfokuserad e-postvidarebefordran {#the-technical-challenges-of-privacy-first-email-forwarding}

Att bygga en integritetsfokuserad e-posttjänst innebär betydande tekniska utmaningar. Här är några av de hinder vi har övervunnit:

### Minneshantering för e-postbearbetning utan loggning {#memory-management-for-no-logging-email-processing}

Att bearbeta e-postmeddelanden i minnet utan lagring på disk kräver noggrann minneshantering för att effektivt hantera stora volymer e-posttrafik. Vi har implementerat avancerade minnesoptimeringstekniker för att säkerställa pålitlig prestanda utan att kompromissa med vår policy om ingen lagring, en kritisk del av vår integritetsskyddsstrategi.

### Spamdetektion utan innehållsanalys för integritetsbevarande filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De flesta [spam](https://en.wikipedia.org/wiki/Email_spam)-detekteringssystem förlitar sig på att analysera e-postinnehåll, vilket strider mot våra integritetsprinciper. Vi har utvecklat tekniker för att identifiera spammönster utan att läsa innehållet i dina e-postmeddelanden, vilket skapar en balans mellan integritet och användbarhet som bevarar sekretessen i din kommunikation.

### Upprätthålla kompatibilitet med integritetsfokuserad design {#maintaining-compatibility-with-privacy-first-design}

Att säkerställa kompatibilitet med alla e-postklienter samtidigt som avancerade integritetsfunktioner implementeras har krävt kreativa ingenjörslösningar. Vårt team har arbetat outtröttligt för att göra integritet sömlös, så att du inte behöver välja mellan bekvämlighet och säkerhet när du skyddar din e-postkommunikation.


## Bästa integritetspraxis för användare av Forward Email {#privacy-best-practices-for-forward-email-users}

För att maximera ditt skydd mot e-postövervakning och maximera din integritet när du använder Forward Email rekommenderar vi följande bästa praxis:

1. **Använd unika alias för olika tjänster** – Skapa ett annat e-postalias för varje tjänst du registrerar dig hos för att förhindra spårning mellan tjänster
2. **Aktivera OpenPGP-kryptering** – För känslig kommunikation, använd end-to-end-kryptering för att säkerställa fullständig integritet
3. **Rotera dina e-postalias regelbundet** – Uppdatera alias för viktiga tjänster med jämna mellanrum för att minimera långsiktig datainsamling
4. **Använd starka, unika lösenord** – Skydda ditt Forward Email-konto med ett starkt lösenord för att förhindra obehörig åtkomst
5. **Implementera [IP-adress](https://en.wikipedia.org/wiki/IP_address)-anonymisering** – Överväg att använda en [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) tillsammans med Forward Email för fullständig anonymitet


## Slutsats: Framtiden för privat e-postvidarebefordran {#conclusion-the-future-of-private-email-forwarding}

På Forward Email tror vi att integritet inte bara är en funktion – det är en grundläggande rättighet. Våra tekniska implementationer speglar denna tro och ger dig e-postvidarebefordran som respekterar din integritet på alla nivåer och skyddar dig från e-postövervakning och metadata-insamling.

När vi fortsätter att utveckla och förbättra vår tjänst förblir vårt engagemang för integritet orubbligt. Vi forskar ständigt på nya krypteringsmetoder, utforskar ytterligare integritetsskydd och förfinar vår kodbas för att erbjuda den mest säkra e-postupplevelsen möjligt.

Genom att välja Forward Email väljer du inte bara en e-posttjänst – du stödjer en vision om internet där integritet är standard, inte undantaget. Följ med oss i att bygga en mer privat digital framtid, ett e-postmeddelande i taget.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

