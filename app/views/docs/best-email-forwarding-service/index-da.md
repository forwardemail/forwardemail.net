# Sådan beskytter videresendt e-mail dit privatliv, domæne og din sikkerhed: Den tekniske dybdegående undersøgelse {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Filosofien om Forward Email Privacy](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Holdbarhed og bærbarhed for dine data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kø og genforsøgsmekanisme: Sikring af e-maillevering](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Ubegrænsede ressourcer med intelligent satsbegrænsning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxed-kryptering for forbedret sikkerhed](#sandboxed-encryption-for-enhanced-security)
* [Behandling af e-mail i hukommelsen: Ingen disklager for maksimalt privatliv](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-end-kryptering med OpenPGP for komplet privatliv](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Flerlagsindholdsbeskyttelse for omfattende sikkerhed](#multi-layered-content-protection-for-comprehensive-security)
* [Hvordan vi adskiller os fra andre e-mail-tjenester: Den tekniske privatlivsfordel](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Open Source-gennemsigtighed for verificerbart privatliv](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverandørlås til privatlivets fred uden kompromis](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxed data til ægte isolation](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet og kontrol](#data-portability-and-control)
* [De tekniske udfordringer ved Privacy-First Email Videresendelse](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Hukommelsesstyring til e-mail-behandling uden logning](#memory-management-for-no-logging-email-processing)
  * [Spamregistrering uden indholdsanalyse til privatlivsbevarende filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Opretholdelse af kompatibilitet med Privacy-First Design](#maintaining-compatibility-with-privacy-first-design)
* [Best Practices for privatliv for videresend e-mail-brugere](#privacy-best-practices-for-forward-email-users)
* [Konklusion: Fremtiden for privat e-mail-videresendelse](#conclusion-the-future-of-private-email-forwarding)

## Forord {#foreword}

I nutidens digitale landskab er e-mailbeskyttelse blevet mere kritisk end nogensinde. Med databrud, overvågningsproblemer og målrettet annoncering baseret på e-mail-indhold søger brugere i stigende grad løsninger, der prioriterer deres privatliv. Hos Forward Email har vi bygget vores service op fra bunden med privatliv som hjørnestenen i vores arkitektur. Dette blogindlæg udforsker de tekniske implementeringer, der gør vores service til en af de mest privatlivsfokuserede e-mail-videresendelsesløsninger, der er tilgængelige.

## Filosofien om privatlivsbeskyttelse ved videresendelse af e-mails {#the-forward-email-privacy-philosophy}

Før vi dykker ned i de tekniske detaljer, er det vigtigt at forstå vores grundlæggende privatlivsfilosofi: **dine e-mails tilhører dig og kun dig**. Dette princip styrer alle tekniske beslutninger, vi træffer, lige fra hvordan vi håndterer videresendelse af e-mails til hvordan vi implementerer kryptering.

I modsætning til mange e-mail-udbydere, der scanner dine beskeder til reklameformål eller gemmer dem på ubestemt tid på deres servere, fungerer Forward Email med en radikalt anderledes tilgang:

1. **Kun behandling i hukommelsen** - Vi gemmer ikke dine videresendte e-mails på disken
2. **Ingen metadatalagring** - Vi gemmer ikke, hvem der sender e-mails til hvem
3. **100% open source** - Hele vores kodebase er transparent og kan revideres
4. **End-to-end-kryptering** - Vi understøtter OpenPGP til fuldstændig privat kommunikation

## SQLite-implementering: Holdbarhed og portabilitet for dine data {#sqlite-implementation-durability-and-portability-for-your-data}

En af de vigtigste fordele ved at videresende e-mails med hensyn til privatliv er vores omhyggeligt udviklede [SQLite](https://en.wikipedia.org/wiki/SQLite) implementering. Vi har finjusteret SQLite med specifikke PRAGMA-indstillinger og [Write-Ahead-logning (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) for at sikre både holdbarhed og portabilitet af dine data, samtidig med at de højeste standarder for privatliv og sikkerhed opretholdes.

Her er et overblik over, hvordan vi har implementeret SQLite med [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) som kryptering til kvanteresistent kryptering:

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

Denne implementering sikrer, at dine data ikke kun er sikre, men også bærbare. Du kan til enhver tid tage din e-mail med dig ved at eksportere i [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) eller SQLite-formater. Og når du vil slette dine data, er de helt væk – vi sletter blot filerne fra disklageret i stedet for at køre SQL DELETE ROW-kommandoer, som kan efterlade spor i databasen.

Kvantekrypteringsaspektet af vores implementering bruger ChaCha20-Poly1305 som chiffer, når vi initialiserer databasen, hvilket giver en stærk beskyttelse mod både nuværende og fremtidige trusler mod dit databeskyttelse.

## Smart kø- og gentagelsesmekanisme: Sikring af e-maillevering {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

I stedet for udelukkende at fokusere på håndtering af headere har vi implementeret en sofistikeret smart kø- og gentagelsesmekanisme med vores `getBounceInfo`-metode. Dette system sikrer, at dine e-mails har den bedste chance for at blive leveret, selv når der opstår midlertidige problemer.

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

Vi forsøger at levere post igen i 5 dage, svarende til branchestandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), hvilket giver midlertidige problemer tid til at løse sig selv. Denne tilgang forbedrer leveringsraterne betydeligt, samtidig med at privatlivets fred opretholdes.

På samme måde redigerer vi også beskedindholdet i udgående SMTP-e-mails efter vellykket levering. Dette er konfigureret i vores lagersystem med en standardopbevaringsperiode på 30 dage, som du kan justere i dit domænes avancerede indstillinger. Efter denne periode bliver e-mail-indholdet automatisk redigeret og slettet, med kun en pladsholdermeddelelse tilbage:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Denne tilgang sikrer, at dine sendte e-mails ikke forbliver gemt på ubestemt tid, hvilket reducerer risikoen for databrud eller uautoriseret adgang til din kommunikation.

## Ubegrænsede ressourcer med intelligent hastighedsbegrænsning {#unlimited-resources-with-intelligent-rate-limiting}

Mens Forward Email tilbyder ubegrænsede domæner og aliaser, har vi implementeret intelligent hastighedsbegrænsning for at beskytte vores system mod misbrug og sikre fair brug for alle brugere. For eksempel kan ikke-virksomhedskunder oprette op til 50+ aliaser om dagen, hvilket forhindrer vores database i at blive spammet og oversvømmet, og tillader vores misbrugs- og beskyttelsesfunktioner i realtid at fungere effektivt.

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

Denne afbalancerede tilgang giver dig fleksibiliteten til at oprette så mange e-mail-adresser, som du har brug for, til omfattende privatlivsstyring, mens du stadig opretholder integriteten og ydeevnen af vores tjeneste for alle brugere.

## Sandbox-kryptering for forbedret sikkerhed {#sandboxed-encryption-for-enhanced-security}

Vores unikke krypteringstilgang med sandkasse giver en kritisk sikkerhedsfordel, som mange brugere overser, når de vælger en e-mail-tjeneste. Lad os undersøge, hvorfor sandboxing-data, især e-mail, er så vigtige.

Tjenester som Gmail og Proton bruger højst sandsynligt delt [relationelle databaser](https://en.wikipedia.org/wiki/Relational_database), hvilket skaber en fundamental sikkerhedssårbarhed. I et delt databasemiljø, hvis nogen får adgang til én brugers data, har de potentielt også en adgang til andre brugeres data. Dette skyldes, at alle brugerdata findes i de samme databasetabeller, kun adskilt af bruger-id'er eller lignende identifikatorer.

Videresend e-mail har en fundamentalt anderledes tilgang med vores kryptering i sandkasse:

1. **Fuldstændig isolation**: Hver brugers data gemmes i sin egen krypterede SQLite-databasefil, fuldstændig isoleret fra andre brugere.

2. **Uafhængige krypteringsnøgler**: Hver database er krypteret med sin egen unikke nøgle, der stammer fra brugerens adgangskode.

3. **Ingen delt lagring**: I modsætning til relationelle databaser, hvor alle brugeres e-mails kan være i en enkelt "e-mails"-tabel, sikrer vores tilgang, at data ikke blandes sammen.

4. **Dybdegående forsvar**: Selv hvis én brugers database på en eller anden måde blev kompromitteret, ville den ikke give adgang til andre brugeres data.

Denne tilgang med sandkasse svarer til at have din e-mail i en separat fysisk boks i stedet for i en delt lagerfacilitet med interne opdelere. Det er en grundlæggende arkitektonisk forskel, der markant forbedrer dit privatliv og sikkerhed.

## E-mailbehandling i hukommelsen: Ingen disklagring for maksimal privatliv {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

For vores e-mail-videresendelsestjeneste behandler vi e-mails udelukkende i RAM og skriver dem aldrig til disklager eller databaser. Denne tilgang giver uovertruffen beskyttelse mod e-mailovervågning og metadataindsamling.

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

Denne tilgang betyder, at selv hvis vores servere blev kompromitteret, ville der ikke være nogen historiske e-mail-data for angribere at få adgang til. Dine e-mails passerer simpelthen gennem vores system og videresendes straks til deres destination uden at efterlade spor. Denne tilgang til videresendelse af e-mail uden logning er grundlæggende for at beskytte din kommunikation mod overvågning.

## End-to-End-kryptering med OpenPGP for fuldstændig privatliv {#end-to-end-encryption-with-openpgp-for-complete-privacy}

For brugere, der kræver det højeste niveau af privatlivsbeskyttelse fra e-mailovervågning, understøtter vi [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) til end-to-end-kryptering. I modsætning til mange e-mailudbydere, der kræver proprietære broer eller apps, fungerer vores implementering med standard e-mailklienter, hvilket gør sikker kommunikation tilgængelig for alle.

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

Denne implementering sikrer, at dine e-mails krypteres, før de forlader din enhed og kun kan dekrypteres af den tilsigtede modtager, hvilket holder din kommunikation privat, selv fra os. Dette er vigtigt for at beskytte følsom kommunikation mod uautoriseret adgang og overvågning.

## Flerlags indholdsbeskyttelse for omfattende sikkerhed {#multi-layered-content-protection-for-comprehensive-security}

Forward Email tilbyder flere lag af indholdsbeskyttelse, der er aktiveret som standard for at give omfattende sikkerhed mod forskellige trusler:

1. **Beskyttelse af voksenindhold** - Filtrerer upassende indhold fra uden at gå på kompromis med privatlivets fred
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing) beskyttelse** - Blokerer forsøg på at stjæle dine oplysninger, samtidig med at anonymiteten bevares
3. **Beskyttelse af eksekverbare filer** - Forhindrer potentielt skadelige vedhæftede filer uden at scanne indhold
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus) beskyttelse** - Scanner for malware ved hjælp af privatlivsbevarende teknikker

I modsætning til mange udbydere, der gør disse funktioner opt-in, har vi fået dem til at fravælge, hvilket sikrer, at alle brugere som standard nyder godt af disse beskyttelser. Denne tilgang afspejler vores forpligtelse til både privatliv og sikkerhed, hvilket giver en balance, som mange e-mail-tjenester ikke kan opnå.

## Hvordan vi adskiller os fra andre e-mailtjenester: Den tekniske fordel ved privatlivets fred {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Når du sammenligner Videresend e-mail med andre e-mail-tjenester, fremhæver flere vigtige tekniske forskelle vores tilgang til privatlivets fred først:

### Open Source-transparens for verificerbar privatliv {#open-source-transparency-for-verifiable-privacy}

Selvom mange e-mailudbydere hævder at være open source, holder de ofte deres backend-kode lukket. Videresendt e-mail er 100% __BESKYTTET_LINK_81__, inklusive både frontend- og backend-kode. Denne gennemsigtighed muliggør uafhængig sikkerhedsrevision af alle komponenter, hvilket sikrer, at vores privatlivskrav kan verificeres af alle.

### Ingen leverandørbinding for kompromisløs privatliv {#no-vendor-lock-in-for-privacy-without-compromise}

Mange e-mailudbydere med fokus på privatliv kræver, at du bruger deres egne apps eller broer. Videresend e-mail fungerer med alle standard e-mailklienter via protokollerne [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) og [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), hvilket giver dig friheden til at vælge din foretrukne e-mailsoftware uden at gå på kompromis med privatlivets fred.

### Sandbox-data til ægte isolation {#sandboxed-data-for-true-isolation}

I modsætning til tjenester, der bruger delte databaser, hvor alle brugeres data er blandet, sikrer vores sandboxed tilgang, at hver brugers data er fuldstændig isoleret. Denne grundlæggende arkitektoniske forskel giver betydeligt stærkere privatlivsgarantier end hvad de fleste e-mail-tjenester tilbyder.

### Dataportabilitet og -kontrol {#data-portability-and-control}

Vi mener, at dine data tilhører dig, og derfor gør vi det nemt at eksportere dine e-mails i standardformater (MBOX, EML, SQLite) og virkelig slette dine data, når du vil. Dette niveau af kontrol er sjældent blandt e-mail-udbydere, men er afgørende for ægte privatliv.

## De tekniske udfordringer ved videresendelse af e-mails med privatliv som hovedprioritet {#the-technical-challenges-of-privacy-first-email-forwarding}

Opbygningen af en e-mail-tjeneste, der tager udgangspunkt i privatlivets fred, byder på betydelige tekniske udfordringer. Her er nogle af de forhindringer, vi har overvundet:

### Hukommelsesstyring til e-mailbehandling uden logføring {#memory-management-for-no-logging-email-processing}

Behandling af e-mails i hukommelsen uden disklagring kræver omhyggelig hukommelsesstyring for at håndtere store mængder e-mail-trafik effektivt. Vi har implementeret avancerede hukommelsesoptimeringsteknikker for at sikre pålidelig ydeevne uden at gå på kompromis med vores politik om ikke-lagring, en kritisk komponent i vores strategi for beskyttelse af privatlivets fred.

### Spamdetektion uden indholdsanalyse til privatlivsbevarende filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De fleste [spam](https://en.wikipedia.org/wiki/Email_spam)-detekteringssystemer er afhængige af at analysere e-mailindhold, hvilket er i konflikt med vores privatlivsprincipper. Vi har udviklet teknikker til at identificere spammønstre uden at læse indholdet af dine e-mails, og dermed finde en balance mellem privatliv og brugervenlighed, der bevarer fortroligheden af din kommunikation.

### Opretholdelse af kompatibilitet med design, der fokuserer på privatliv {#maintaining-compatibility-with-privacy-first-design}

At sikre kompatibilitet med alle e-mail-klienter og samtidig implementere avancerede privatlivsfunktioner har krævet kreative tekniske løsninger. Vores team har arbejdet utrætteligt for at gøre privatlivets fred sømløst, så du ikke behøver at vælge mellem bekvemmelighed og sikkerhed, når du beskytter din e-mail-kommunikation.

## Bedste praksisser for privatlivsbeskyttelse for brugere af videresendelsesmails {#privacy-best-practices-for-forward-email-users}

For at maksimere din beskyttelse mod e-mail-overvågning og maksimere dit privatliv, når du bruger Videresend e-mail, anbefaler vi følgende bedste praksis:

1. **Brug unikke aliasser til forskellige tjenester** - Opret et forskelligt e-mail-alias for hver tjeneste, du tilmelder dig, for at forhindre sporing på tværs af tjenester.**
2. **Aktivér OpenPGP-kryptering** - Brug end-to-end-kryptering til følsom kommunikation for at sikre fuldstændig privatliv.**
3. **Roter regelmæssigt dine e-mail-aliasser** - Opdater regelmæssigt aliasser for vigtige tjenester for at minimere langsigtet dataindsamling.**
4. **Brug stærke, unikke adgangskoder** - Beskyt din konto til videresendelse af e-mails med en stærk adgangskode for at forhindre uautoriseret adgang.**
5. **Implementer [IP-adresse](https://en.wikipedia.org/wiki/IP_address) anonymisering** - Overvej at bruge en [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) sammen med videresendelse af e-mails for fuldstændig anonymitet.

## Konklusion: Fremtiden for videresendelse af private e-mails {#conclusion-the-future-of-private-email-forwarding}

Hos Forward Email mener vi, at privatlivets fred ikke kun er en funktion – det er en grundlæggende rettighed. Vores tekniske implementeringer afspejler denne overbevisning, og giver dig videresendelse af e-mail, der respekterer dit privatliv på alle niveauer og beskytter dig mod e-mailovervågning og metadataindsamling.

Mens vi fortsætter med at udvikle og forbedre vores service, forbliver vores forpligtelse til privatlivets fred urokkelig. Vi undersøger konstant nye krypteringsmetoder, udforsker yderligere beskyttelse af privatlivets fred og forfiner vores kodebase for at give den mest sikre e-mail-oplevelse som muligt.

Ved at vælge Videresend e-mail, vælger du ikke bare en e-mail-tjeneste – du understøtter en vision om internettet, hvor privatliv er standard, ikke undtagelsen. Vær med til at opbygge en mere privat digital fremtid, én e-mail ad gangen.

<!-- *Nøgleord: privat videresendelse af e-mails, beskyttelse af e-mail-privatliv, sikker e-mailtjeneste, open source-e-mail, kvantesikker kryptering, OpenPGP-e-mail, e-mailbehandling i hukommelsen, e-mailtjeneste uden log, beskyttelse af e-mail-metadata, privatliv i e-mail-headere, end-to-end-krypteret e-mail, privatlivsfokuseret e-mail-videresendelse, bedste praksis for e-mail-sikkerhed, beskyttelse af e-mail-indhold, phishing-beskyttelse, virusscanning i e-mails, privatlivsfokuseret e-mailudbyder, sikre e-mail-headere, implementering af e-mail-privatliv, beskyttelse mod e-mail-overvågning, videresendelse af e-mail uden logføring, forhindre lækage af e-mail-metadata, teknikker til privatliv i e-mails, anonymisering af IP-adresser for e-mails, private e-mail-aliasser, sikkerhed til videresendelse af e-mails, privatliv i e-mails fra annoncører, kvantesikker e-mail-kryptering, e-mail-privatliv uden kompromis, SQLite-e-maillagring, sandbox-baseret e-mail-kryptering, dataportabilitet for e-mails* -->