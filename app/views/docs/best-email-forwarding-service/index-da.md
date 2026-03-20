# Hvordan Forward Email beskytter dit privatliv, domæne og sikkerhed: Den tekniske dybdegående gennemgang {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Bedste e-mail videresendelsestjeneste sammenligning" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Forward Email's privatlivsfilosofi](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Holdbarhed og portabilitet for dine data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kø- og genforsøgs-mekanisme: Sikring af e-mail levering](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Ubegrænsede ressourcer med intelligent ratebegrænsning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxed kryptering for forbedret sikkerhed](#sandboxed-encryption-for-enhanced-security)
* [E-mail behandling i hukommelsen: Ingen disklagring for maksimal privatliv](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-end kryptering med OpenPGP for komplet privatliv](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Flerlaget indholdsbeskyttelse for omfattende sikkerhed](#multi-layered-content-protection-for-comprehensive-security)
* [Hvordan vi adskiller os fra andre e-mail tjenester: Den tekniske privatlivsfordel](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Open source gennemsigtighed for verificerbart privatliv](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverandørlåsning for privatliv uden kompromis](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxed data for ægte isolation](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet og kontrol](#data-portability-and-control)
* [De tekniske udfordringer ved privatlivsfokuseret e-mail videresendelse](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Hukommelsesstyring for logfri e-mail behandling](#memory-management-for-no-logging-email-processing)
  * [Spamdetektion uden indholdsanalyse for privatlivsbevarende filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Opretholdelse af kompatibilitet med privatlivsførste design](#maintaining-compatibility-with-privacy-first-design)
* [Privatlivs bedste praksis for Forward Email brugere](#privacy-best-practices-for-forward-email-users)
* [Konklusion: Fremtiden for privat e-mail videresendelse](#conclusion-the-future-of-private-email-forwarding)


## Forord {#foreword}

I dagens digitale landskab er e-mail privatliv blevet vigtigere end nogensinde. Med databrud, overvågningsbekymringer og målrettet reklame baseret på e-mail indhold søger brugere i stigende grad løsninger, der prioriterer deres privatliv. Hos Forward Email har vi bygget vores tjeneste fra bunden med privatliv som hjørnestenen i vores arkitektur. Dette blogindlæg udforsker de tekniske implementeringer, der gør vores tjeneste til en af de mest privatlivsfokuserede e-mail videresendelsesløsninger, der findes.


## Forward Email's privatlivsfilosofi {#the-forward-email-privacy-philosophy}

Før vi dykker ned i de tekniske detaljer, er det vigtigt at forstå vores grundlæggende privatlivsfilosofi: **dine e-mails tilhører dig og kun dig**. Dette princip styrer hver teknisk beslutning, vi træffer, fra hvordan vi håndterer e-mail videresendelse til hvordan vi implementerer kryptering.

I modsætning til mange e-mailudbydere, der scanner dine beskeder til reklameformål eller gemmer dem på ubestemt tid på deres servere, opererer Forward Email med en radikalt anderledes tilgang:

1. **Kun behandling i hukommelsen** - Vi gemmer ikke dine videresendte e-mails på disk
2. **Ingen metadata lagring** - Vi gemmer ikke optegnelser over, hvem der skriver til hvem
3. **100% open source** - Hele vores kodebase er gennemsigtig og kan revideres
4. **End-to-end kryptering** - Vi understøtter OpenPGP for virkelig private kommunikationer


## SQLite-implementering: Holdbarhed og portabilitet for dine data {#sqlite-implementation-durability-and-portability-for-your-data}

En af de mest betydningsfulde privatlivsfordele ved Forward Email er vores omhyggeligt designede [SQLite](https://en.wikipedia.org/wiki/SQLite) implementering. Vi har finjusteret SQLite med specifikke PRAGMA-indstillinger og [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) for at sikre både holdbarhed og portabilitet af dine data, samtidig med at vi opretholder de højeste standarder for privatliv og sikkerhed.
Here's a look at how we've implemented SQLite with [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) as the cipher for quantum-resistant encryption:

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

Denne implementering sikrer, at dine data ikke kun er sikre, men også bærbare. Du kan tage din e-mail med dig når som helst ved at eksportere i [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) eller SQLite-formater. Og når du vil slette dine data, er de virkelig væk – vi sletter simpelthen filerne fra diskopbevaringen i stedet for at køre SQL DELETE ROW-kommandoer, som kan efterlade spor i databasen.

Den kvantekrypteringsdel af vores implementering bruger ChaCha20-Poly1305 som chiffer, når vi initialiserer databasen, hvilket giver stærk beskyttelse mod både nuværende og fremtidige trusler mod dit dataprivatliv.


## Smart Queue and Retry Mechanism: Ensuring Email Delivery {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

I stedet for kun at fokusere på header-håndtering har vi implementeret en sofistikeret smart kø og genforsøgs-mekanisme med vores `getBounceInfo`-metode. Dette system sikrer, at dine e-mails har den bedste chance for at blive leveret, selv når midlertidige problemer opstår.

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
> Dette er et uddrag af `getBounceInfo`-metoden og ikke den faktiske omfattende implementering. For den komplette kode kan du gennemgå den på [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Vi forsøger at levere mail i 5 dage, ligesom branchestandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), hvilket giver midlertidige problemer tid til at løse sig selv. Denne tilgang forbedrer leveringsraterne betydeligt, samtidig med at privatlivets fred opretholdes.

På samme måde redigerer vi også beskedindholdet af udgående SMTP-e-mails efter vellykket levering. Dette er konfigureret i vores lagersystem med en standard opbevaringsperiode på 30 dage, som du kan justere i dit domænes Avancerede Indstillinger. Efter denne periode bliver e-mail-indholdet automatisk redigeret og slettet, hvor kun en pladsholderbesked forbliver:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```
Denne tilgang sikrer, at dine sendte e-mails ikke forbliver gemt på ubestemt tid, hvilket reducerer risikoen for databrud eller uautoriseret adgang til dine kommunikationer.


## Ubegrænsede ressourcer med intelligent hastighedsbegrænsning {#unlimited-resources-with-intelligent-rate-limiting}

Mens Forward Email tilbyder ubegrænsede domæner og aliaser, har vi implementeret intelligent hastighedsbegrænsning for at beskytte vores system mod misbrug og sikre fair brug for alle brugere. For eksempel kan ikke-virksomhedskunder oprette op til 50+ aliaser om dagen, hvilket forhindrer, at vores database bliver spammet og oversvømmet, og tillader vores realtidsfunktioner til misbrugsbekæmpelse og beskyttelse at fungere effektivt.

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

Denne afbalancerede tilgang giver dig fleksibiliteten til at oprette så mange e-mailadresser, som du har brug for til omfattende privatlivsstyring, samtidig med at integriteten og ydeevnen af vores service opretholdes for alle brugere.


## Sandboxed kryptering for forbedret sikkerhed {#sandboxed-encryption-for-enhanced-security}

Vores unikke sandboxed krypteringstilgang giver en kritisk sikkerhedsfordel, som mange brugere overser, når de vælger en e-mailtjeneste. Lad os undersøge, hvorfor sandboxing af data, især e-mail, er så vigtigt.

Tjenester som Gmail og Proton bruger sandsynligvis delte [relationelle databaser](https://en.wikipedia.org/wiki/Relational_database), hvilket skaber en grundlæggende sikkerhedssårbarhed. I et delt database-miljø, hvis nogen får adgang til en brugers data, har de potentielt en vej til at få adgang til andre brugeres data også. Dette skyldes, at alle brugerdata ligger i de samme databasetabeller, adskilt kun af bruger-ID'er eller lignende identifikatorer.

Forward Email tager en fundamentalt anderledes tilgang med vores sandboxed kryptering:

1. **Fuldstændig isolation**: Hver brugers data gemmes i sin egen krypterede SQLite-databasefil, fuldstændigt isoleret fra andre brugere
2. **Uafhængige krypteringsnøgler**: Hver database krypteres med sin egen unikke nøgle, der er afledt af brugerens adgangskode
3. **Ingen delt lagring**: I modsætning til relationelle databaser, hvor alle brugeres e-mails kan være i en enkelt "emails"-tabel, sikrer vores tilgang, at der ikke sker sammenblanding af data
4. **Forsvar i dybden**: Selv hvis en brugers database på en eller anden måde blev kompromitteret, ville det ikke give adgang til andre brugeres data

Denne sandboxed tilgang svarer til at have din e-mail i et separat fysisk pengeskab fremfor i et delt lagringsanlæg med interne skillevægge. Det er en grundlæggende arkitektonisk forskel, der væsentligt forbedrer dit privatliv og din sikkerhed.


## E-mailbehandling i hukommelsen: Ingen disklagring for maksimal privatliv {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

For vores e-mailvideresendelsestjeneste behandler vi e-mails udelukkende i RAM og skriver dem aldrig til disk eller databaser. Denne tilgang giver enestående beskyttelse mod e-mailovervågning og metadataindsamling.

Her er et forenklet kig på, hvordan vores e-mailbehandling fungerer:

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
Denne tilgang betyder, at selv hvis vores servere blev kompromitteret, ville der ikke være nogen historiske e-maildata for angribere at få adgang til. Dine e-mails passerer simpelthen gennem vores system og bliver straks videresendt til deres destination uden at efterlade spor. Denne no-logging e-mail videresendelsesmetode er grundlæggende for at beskytte dine kommunikationer mod overvågning.


## End-to-End Kryptering med OpenPGP for Fuldstændigt Privatliv {#end-to-end-encryption-with-openpgp-for-complete-privacy}

For brugere, der kræver det højeste niveau af privatlivsbeskyttelse mod e-mail overvågning, understøtter vi [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) til end-to-end kryptering. I modsætning til mange e-mailudbydere, der kræver proprietære broer eller apps, fungerer vores implementering med standard e-mailklienter, hvilket gør sikker kommunikation tilgængelig for alle.

Sådan implementerer vi OpenPGP-kryptering:

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

Denne implementering sikrer, at dine e-mails er krypterede, før de forlader din enhed, og kun kan dekrypteres af den tilsigtede modtager, hvilket holder dine kommunikationer private selv overfor os. Dette er essentielt for at beskytte følsomme kommunikationer mod uautoriseret adgang og overvågning.


## Flerlaget Indholdsbeskyttelse for Omfattende Sikkerhed {#multi-layered-content-protection-for-comprehensive-security}

Forward Email tilbyder flere lag af indholdsbeskyttelse, som er aktiveret som standard for at give omfattende sikkerhed mod forskellige trusler:

1. **Beskyttelse mod voksenindhold** - Filtrerer upassende indhold uden at gå på kompromis med privatlivet  
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing) beskyttelse** - Blokerer forsøg på at stjæle dine oplysninger samtidig med at anonymiteten bevares  
3. **Beskyttelse mod eksekverbare filer** - Forhindrer potentielt skadelige vedhæftninger uden at scanne indholdet  
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus) beskyttelse** - Scanner for malware ved hjælp af privatlivsbevarende teknikker  

I modsætning til mange udbydere, der gør disse funktioner valgfrie, har vi gjort dem valgfrie at fravælge, hvilket sikrer, at alle brugere som standard drager fordel af disse beskyttelser. Denne tilgang afspejler vores engagement i både privatliv og sikkerhed og giver en balance, som mange e-mailtjenester ikke formår.


## Hvordan Vi Adskiller Os fra Andre E-mailtjenester: Den Tekniske Privatlivsfordel {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Når man sammenligner Forward Email med andre e-mailtjenester, fremhæver flere nøgletekniske forskelle vores privatliv-først tilgang:

### Open Source Gennemsigtighed for Verificerbart Privatliv {#open-source-transparency-for-verifiable-privacy}

Mens mange e-mailudbydere hævder at være open source, holder de ofte deres backend-kode lukket. Forward Email er 100% [open source](https://en.wikipedia.org/wiki/Open_source), inklusive både frontend- og backend-kode. Denne gennemsigtighed muliggør uafhængig sikkerhedsrevision af alle komponenter, hvilket sikrer, at vores privatlivspåstande kan verificeres af alle.

### Ingen Leverandørlåsning for Privatliv Uden Kompromis {#no-vendor-lock-in-for-privacy-without-compromise}

Mange privatlivsfokuserede e-mailudbydere kræver, at du bruger deres proprietære apps eller broer. Forward Email fungerer med enhver standard e-mailklient via [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) og [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) protokoller, hvilket giver dig frihed til at vælge din foretrukne e-mailsoftware uden at gå på kompromis med privatlivet.
### Sandboxed data for ægte isolation {#sandboxed-data-for-true-isolation}

I modsætning til tjenester, der bruger delte databaser, hvor alle brugeres data blandes sammen, sikrer vores sandboxede tilgang, at hver brugers data er fuldstændigt isoleret. Denne grundlæggende arkitektoniske forskel giver betydeligt stærkere privatlivsgarantier end det, de fleste e-mailtjenester tilbyder.

### Dataportabilitet og kontrol {#data-portability-and-control}

Vi mener, at dine data tilhører dig, og derfor gør vi det nemt at eksportere dine e-mails i standardformater (MBOX, EML, SQLite) og virkelig slette dine data, når du ønsker det. Dette niveau af kontrol er sjældent blandt e-mailudbydere, men essentielt for ægte privatliv.


## De tekniske udfordringer ved privatlivsfokuseret e-mail videresendelse {#the-technical-challenges-of-privacy-first-email-forwarding}

At bygge en privatlivsfokuseret e-mailtjeneste indebærer betydelige tekniske udfordringer. Her er nogle af de forhindringer, vi har overvundet:

### Hukommelsesstyring til e-mailbehandling uden logning {#memory-management-for-no-logging-email-processing}

At behandle e-mails i hukommelsen uden lagring på disk kræver omhyggelig hukommelsesstyring for effektivt at håndtere store mængder e-mailtrafik. Vi har implementeret avancerede hukommelsesoptimeringsteknikker for at sikre pålidelig ydeevne uden at gå på kompromis med vores politik om ingen lagring, en kritisk komponent i vores privatlivsbeskyttelsesstrategi.

### Spamdetektion uden indholdsanalyse til privatlivsbevarende filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De fleste [spam](https://en.wikipedia.org/wiki/Email_spam)detekteringssystemer er afhængige af at analysere e-mailindhold, hvilket er i konflikt med vores privatlivsprincipper. Vi har udviklet teknikker til at identificere spammønstre uden at læse indholdet af dine e-mails, hvilket skaber en balance mellem privatliv og brugervenlighed, der bevarer fortroligheden af dine kommunikationer.

### Opretholdelse af kompatibilitet med privatlivsfokuseret design {#maintaining-compatibility-with-privacy-first-design}

At sikre kompatibilitet med alle e-mailklienter samtidig med implementering af avancerede privatlivsfunktioner har krævet kreative ingeniørløsninger. Vores team har arbejdet utrætteligt for at gøre privatliv sømløst, så du ikke behøver vælge mellem bekvemmelighed og sikkerhed, når du beskytter dine e-mailkommunikationer.


## Bedste privatlivspraksis for brugere af Forward Email {#privacy-best-practices-for-forward-email-users}

For at maksimere din beskyttelse mod e-mailovervågning og maksimere dit privatliv, når du bruger Forward Email, anbefaler vi følgende bedste praksis:

1. **Brug unikke aliaser til forskellige tjenester** - Opret et forskelligt e-mailalias for hver tjeneste, du tilmelder dig, for at forhindre krydstjenestesporing  
2. **Aktivér OpenPGP-kryptering** - Brug ende-til-ende-kryptering til følsomme kommunikationer for at sikre fuldstændigt privatliv  
3. **Roter regelmæssigt dine e-mailaliaser** - Opdater periodisk aliaser for vigtige tjenester for at minimere langsigtet datainnsamling  
4. **Brug stærke, unikke adgangskoder** - Beskyt din Forward Email-konto med en stærk adgangskode for at forhindre uautoriseret adgang  
5. **Implementér [IP-adresse](https://en.wikipedia.org/wiki/IP_address) anonymisering** - Overvej at bruge en [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) sammen med Forward Email for fuldstændig anonymitet  


## Konklusion: Fremtiden for privat e-mail videresendelse {#conclusion-the-future-of-private-email-forwarding}

Hos Forward Email mener vi, at privatliv ikke bare er en funktion—det er en grundlæggende ret. Vores tekniske implementeringer afspejler denne tro og giver dig e-mailvideresendelse, der respekterer dit privatliv på alle niveauer og beskytter dig mod e-mailovervågning og metadataindsamling.

Mens vi fortsætter med at udvikle og forbedre vores tjeneste, forbliver vores engagement i privatliv urokkeligt. Vi forsker konstant i nye krypteringsmetoder, udforsker yderligere privatlivsbeskyttelser og forfiner vores kodebase for at levere den mest sikre e-mailoplevelse muligt.

Ved at vælge Forward Email vælger du ikke bare en e-mailtjeneste—du støtter en vision om internettet, hvor privatliv er standarden, ikke undtagelsen. Deltag med os i at bygge en mere privat digital fremtid, én e-mail ad gangen.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

