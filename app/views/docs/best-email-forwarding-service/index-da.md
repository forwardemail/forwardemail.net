# Hvordan videresendt e-mail beskytter dit privatliv, domæne og sikkerhed: Den tekniske dybdegående undersøgelse {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Filosofien om privatlivsbeskyttelse ved videresendelse af e-mails](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Holdbarhed og portabilitet for dine data](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kø- og gentagelsesmekanisme: Sikring af e-maillevering](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Ubegrænsede ressourcer med intelligent hastighedsbegrænsning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandbox-kryptering for forbedret sikkerhed](#sandboxed-encryption-for-enhanced-security)
* [E-mailbehandling i hukommelsen: Ingen disklagring for maksimal privatliv](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-End-kryptering med OpenPGP for fuldstændig privatliv](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Flerlags indholdsbeskyttelse for omfattende sikkerhed](#multi-layered-content-protection-for-comprehensive-security)
* [Hvordan vi adskiller os fra andre e-mailtjenester: Den tekniske fordel ved privatlivets fred](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Open Source Transparency for verificerbar privatliv](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverandørbinding for kompromisløs privatliv](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandbox-data til ægte isolation](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet og -kontrol](#data-portability-and-control)
* [De tekniske udfordringer ved videresendelse af e-mails med fokus på privatliv](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Hukommelsesstyring til e-mailbehandling uden logføring](#memory-management-for-no-logging-email-processing)
  * [Spamdetektion uden indholdsanalyse til privatlivsbevarende filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Opretholdelse af kompatibilitet med design, der fokuserer på privatlivets fred](#maintaining-compatibility-with-privacy-first-design)
* [Bedste praksis for privatliv for brugere af videresendelsesmail](#privacy-best-practices-for-forward-email-users)
* [Konklusion: Fremtiden for videresendelse af privat e-mail](#conclusion-the-future-of-private-email-forwarding)

## Forord {#foreword}

I dagens digitale landskab er e-mail-privatliv blevet vigtigere end nogensinde. Med databrud, bekymringer om overvågning og målrettet annoncering baseret på e-mailindhold søger brugerne i stigende grad løsninger, der prioriterer deres privatliv. Hos Forward Email har vi bygget vores tjeneste op fra bunden med privatliv som hjørnestenen i vores arkitektur. Dette blogindlæg udforsker de tekniske implementeringer, der gør vores tjeneste til en af de mest privatlivsfokuserede løsninger til videresendelse af e-mails, der er tilgængelige.

## Filosofien om privatlivsbeskyttelse af videresendelse af e-mails {#the-forward-email-privacy-philosophy}

Før vi dykker ned i de tekniske detaljer, er det vigtigt at forstå vores grundlæggende privatlivsfilosofi: **dine e-mails tilhører dig og kun dig**. Dette princip styrer alle tekniske beslutninger, vi træffer, lige fra hvordan vi håndterer videresendelse af e-mails til hvordan vi implementerer kryptering.

I modsætning til mange e-mailudbydere, der scanner dine beskeder til reklameformål eller gemmer dem på ubestemt tid på deres servere, fungerer Forward Email med en radikalt anderledes tilgang:

1. **Kun behandling i hukommelsen** - Vi gemmer ikke dine videresendte e-mails på disken
2. **Ingen metadatalagring** - Vi gemmer ikke, hvem der sender e-mails til hvem
3. **100% open source** - Hele vores kodebase er transparent og kan revideres
4. **End-to-end-kryptering** - Vi understøtter OpenPGP til fuldstændig privat kommunikation

## SQLite-implementering: Holdbarhed og portabilitet for dine data {#sqlite-implementation-durability-and-portability-for-your-data}

En af de vigtigste fordele ved at videresende e-mails med hensyn til privatliv er vores omhyggeligt udviklede [SQLite](https://en.wikipedia.org/wiki/SQLite)-implementering. Vi har finjusteret SQLite med specifikke PRAGMA-indstillinger og [Forhåndsregistrering (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) for at sikre både holdbarhed og portabilitet af dine data, samtidig med at de højeste standarder for privatliv og sikkerhed opretholdes.

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

Denne implementering sikrer, at dine data ikke kun er sikre, men også bærbare. Du kan til enhver tid tage din e-mail med dig ved at eksportere i [MBOX](https://en.wikipedia.org/wiki/Email#Storage)-, [EML](https://en.wikipedia.org/wiki/Email#Storage)- eller SQLite-formater. Og når du vil slette dine data, er de helt væk – vi sletter blot filerne fra disklageret i stedet for at køre SQL DELETE ROW-kommandoer, som kan efterlade spor i databasen.

Kvantekrypteringsaspektet af vores implementering bruger ChaCha20-Poly1305 som kryptering, når vi initialiserer databasen, hvilket giver stærk beskyttelse mod både nuværende og fremtidige trusler mod dit databeskyttelse.

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
> Dette er et uddrag af `getBounceInfo`-metoden og ikke den faktiske omfattende implementering. Du kan se den komplette kode på [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Vi forsøger at levere post igen i 5 dage, svarende til branchestandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), hvilket giver midlertidige problemer tid til at løse sig selv. Denne tilgang forbedrer leveringsraterne betydeligt, samtidig med at privatlivets fred opretholdes.

På samme måde redigerer vi også beskedindholdet i udgående SMTP-e-mails efter vellykket levering. Dette er konfigureret i vores lagringssystem med en standardopbevaringsperiode på 30 dage, som du kan justere i dit domænes avancerede indstillinger. Efter denne periode redigeres og slettes e-mailindholdet automatisk, så kun en pladsholdermeddelelse er tilbage:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Denne tilgang sikrer, at dine sendte e-mails ikke forbliver gemt på ubestemt tid, hvilket reducerer risikoen for databrud eller uautoriseret adgang til din kommunikation.

## Ubegrænsede ressourcer med intelligent hastighedsbegrænsning {#unlimited-resources-with-intelligent-rate-limiting}

Selvom Forward Email tilbyder et ubegrænset antal domæner og aliasser, har vi implementeret intelligent hastighedsbegrænsning for at beskytte vores system mod misbrug og sikre fair brug for alle brugere. For eksempel kan ikke-virksomhedskunder oprette op til 50+ aliasser om dagen, hvilket forhindrer, at vores database bliver spammet og oversvømmet, og det gør det muligt for vores funktioner til misbrug og beskyttelse i realtid at fungere effektivt.

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

Denne afbalancerede tilgang giver dig fleksibiliteten til at oprette så mange e-mailadresser, som du har brug for, for omfattende privatlivsstyring, samtidig med at vi opretholder integriteten og ydeevnen af vores tjeneste for alle brugere.

## Sandbox-kryptering for forbedret sikkerhed {#sandboxed-encryption-for-enhanced-security}

Vores unikke sandbox-krypteringsmetode giver en kritisk sikkerhedsfordel, som mange brugere overser, når de vælger en e-mailtjeneste. Lad os undersøge, hvorfor sandboxing af data, især e-mail, er så vigtigt.

Tjenester som Gmail og Proton bruger højst sandsynligt den delte [relationelle databaser](https://en.wikipedia.org/wiki/Relational_database), hvilket skaber en fundamental sikkerhedssårbarhed. I et delt databasemiljø, hvis nogen får adgang til én brugers data, har de potentielt også en adgang til andre brugeres data. Dette skyldes, at alle brugerdata findes i de samme databasetabeller, kun adskilt af bruger-id'er eller lignende identifikatorer.

Videresend e-mail har en fundamentalt anderledes tilgang med vores sandbox-kryptering:

1. **Fuldstændig isolation**: Hver brugers data gemmes i sin egen krypterede SQLite-databasefil, fuldstændig isoleret fra andre brugere.

2. **Uafhængige krypteringsnøgler**: Hver database er krypteret med sin egen unikke nøgle, der stammer fra brugerens adgangskode.

3. **Ingen delt lagring**: I modsætning til relationelle databaser, hvor alle brugeres e-mails kan være i en enkelt "e-mails"-tabel, sikrer vores tilgang, at data ikke blandes sammen.

4. **Dybdegående forsvar**: Selv hvis én brugers database på en eller anden måde blev kompromitteret, ville den ikke give adgang til andre brugeres data.

Denne sandkassebaserede tilgang minder om at have din e-mail i en separat fysisk boks i stedet for i et delt lager med interne skillevægge. Det er en fundamental arkitektonisk forskel, der forbedrer dit privatliv og din sikkerhed betydeligt.

## E-mailbehandling i hukommelsen: Ingen disklagring for maksimal privatliv {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

I vores e-mail-videresendelsestjeneste behandler vi e-mails udelukkende i RAM og skriver dem aldrig til disklagring eller databaser. Denne tilgang giver uovertruffen beskyttelse mod e-mailovervågning og indsamling af metadata.

Her er et forenklet overblik over, hvordan vores e-mailbehandling fungerer:

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

Denne tilgang betyder, at selvom vores servere blev kompromitteret, ville der ikke være nogen historiske e-maildata, som angribere kunne få adgang til. Dine e-mails passerer simpelthen gennem vores system og videresendes straks til deres destination uden at efterlade spor. Denne metode til videresendelse af e-mails uden logføring er fundamental for at beskytte din kommunikation mod overvågning.

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

Denne implementering sikrer, at dine e-mails krypteres, før de forlader din enhed, og kun kan dekrypteres af den tilsigtede modtager, hvilket holder din kommunikation privat, selv for os. Dette er afgørende for at beskytte følsom kommunikation mod uautoriseret adgang og overvågning.

## Flerlagsindholdsbeskyttelse for omfattende sikkerhed {#multi-layered-content-protection-for-comprehensive-security}

Videresend e-mail tilbyder flere lag af indholdsbeskyttelse, der er aktiveret som standard for at give omfattende sikkerhed mod forskellige trusler:

1. **Beskyttelse mod voksenindhold** - Filtrerer upassende indhold fra uden at gå på kompromis med privatlivets fred
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing)-beskyttelse** - Blokerer forsøg på at stjæle dine oplysninger, samtidig med at anonymiteten bevares
3. **Beskyttelse mod eksekverbare filer** - Forhindrer potentielt skadelige vedhæftede filer uden at scanne indhold
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus)-beskyttelse** - Scanner for malware ved hjælp af privatlivsbevarende teknikker

I modsætning til mange udbydere, der tilmelder sig disse funktioner, har vi gjort det muligt at fravælge dem, hvilket sikrer, at alle brugere som standard drager fordel af disse beskyttelser. Denne tilgang afspejler vores engagement i både privatliv og sikkerhed og skaber en balance, som mange e-mailtjenester ikke formår at opnå.

## Hvordan vi adskiller os fra andre e-mailtjenester: Den tekniske fordel ved privatlivets fred {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Når vi sammenligner Videresend Email med andre e-mailtjenester, fremhæver flere vigtige tekniske forskelle vores tilgang til privatliv:

### Open Source-transparens for verificerbar privatliv {#open-source-transparency-for-verifiable-privacy}

Selvom mange e-mailudbydere hævder at være open source, holder de ofte deres backend-kode lukket. Videresendt e-mail er 100% [åben kildekode](https://en.wikipedia.org/wiki/Open_source), inklusive både frontend- og backend-kode. Denne gennemsigtighed muliggør uafhængig sikkerhedsrevision af alle komponenter, hvilket sikrer, at vores privatlivskrav kan verificeres af alle.

### Ingen leverandørbinding for kompromisløs privatliv {#no-vendor-lock-in-for-privacy-without-compromise}

Mange e-mailudbydere med fokus på privatliv kræver, at du bruger deres egne apps eller broer. Videresend e-mail fungerer med alle standard e-mailklienter via protokollerne [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) og [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), hvilket giver dig friheden til at vælge din foretrukne e-mailsoftware uden at gå på kompromis med privatlivets fred.

### Sandbox-data til ægte isolation {#sandboxed-data-for-true-isolation}

I modsætning til tjenester, der bruger delte databaser, hvor alle brugeres data blandes, sikrer vores sandbox-tilgang, at hver brugers data er fuldstændig isoleret. Denne grundlæggende arkitekturforskel giver betydeligt stærkere privatlivsgarantier end det, de fleste e-mailtjenester tilbyder.

### Dataportabilitet og -kontrol {#data-portability-and-control}

Vi mener, at dine data tilhører dig, og derfor gør vi det nemt at eksportere dine e-mails i standardformater (MBOX, EML, SQLite) og slette dine data, når du vil. Dette kontrolniveau er sjældent blandt e-mailudbydere, men essentielt for ægte privatliv.

## De tekniske udfordringer ved videresendelse af e-mails med fokus på privatliv {#the-technical-challenges-of-privacy-first-email-forwarding}

Det er forbundet med betydelige tekniske udfordringer at opbygge en e-mailtjeneste, der sætter privatlivets fred først. Her er nogle af de hindringer, vi har overvundet:

### Hukommelsesstyring til e-mailbehandling uden logføring {#memory-management-for-no-logging-email-processing}

Behandling af e-mails i hukommelsen uden disklagring kræver omhyggelig hukommelsesstyring for at håndtere store mængder e-mailtrafik effektivt. Vi har implementeret avancerede hukommelsesoptimeringsteknikker for at sikre pålidelig ydeevne uden at gå på kompromis med vores politik om ingen lagring, som er en kritisk del af vores strategi for beskyttelse af personlige oplysninger.

### Spamdetektion uden indholdsanalyse til privatlivsbevarende filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De fleste [spam](https://en.wikipedia.org/wiki/Email_spam)-registreringssystemer er afhængige af at analysere e-mailindhold, hvilket er i konflikt med vores privatlivsprincipper. Vi har udviklet teknikker til at identificere spammønstre uden at læse indholdet af dine e-mails, og dermed finde en balance mellem privatliv og brugervenlighed, der bevarer fortroligheden af din kommunikation.

### Opretholdelse af kompatibilitet med design, der fokuserer på privatliv {#maintaining-compatibility-with-privacy-first-design}

Det har krævet kreative tekniske løsninger at sikre kompatibilitet med alle e-mailklienter og samtidig implementere avancerede privatlivsfunktioner. Vores team har arbejdet utrætteligt for at gøre privatlivets fred problemfrit, så du ikke behøver at vælge mellem bekvemmelighed og sikkerhed, når du beskytter din e-mailkommunikation.

## Bedste praksis for privatliv for brugere af videresendelse af e-mail {#privacy-best-practices-for-forward-email-users}

For at maksimere din beskyttelse mod e-mailovervågning og maksimere dit privatliv, når du bruger Videresend e-mail, anbefaler vi følgende bedste praksis:

1. **Brug unikke aliasser til forskellige tjenester** - Opret et forskelligt e-mail-alias for hver tjeneste, du tilmelder dig, for at forhindre sporing på tværs af tjenester.**
2. **Aktivér OpenPGP-kryptering** - Brug end-to-end-kryptering til følsom kommunikation for at sikre fuldstændig privatliv.**
3. **Roter regelmæssigt dine e-mail-aliasser** - Opdater regelmæssigt aliasser for vigtige tjenester for at minimere langsigtet dataindsamling.**
4. **Brug stærke, unikke adgangskoder** - Beskyt din konto til videresendelse af e-mails med en stærk adgangskode for at forhindre uautoriseret adgang.**
5. **Implementer [IP-adresse](https://en.wikipedia.org/wiki/IP_address)-anonymisering** - Overvej at bruge [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) sammen med videresendelse af e-mails for fuldstændig anonymitet.

## Konklusion: Fremtiden for videresendelse af private e-mails {#conclusion-the-future-of-private-email-forwarding}

Hos Forward Email mener vi, at privatliv ikke bare er en funktion – det er en grundlæggende rettighed. Vores tekniske implementeringer afspejler denne overbevisning og giver dig mulighed for at videresende e-mails, der respekterer dit privatliv på alle niveauer og beskytter dig mod e-mailovervågning og indsamling af metadata.

I takt med at vi fortsætter med at udvikle og forbedre vores service, forbliver vores engagement i privatlivets fred urokkelig. Vi forsker konstant i nye krypteringsmetoder, udforsker yderligere beskyttelse af privatlivets fred og forfiner vores kodebase for at give den sikreste e-mailoplevelse.

Ved at vælge Videresend e-mail vælger du ikke bare en e-mailtjeneste – du støtter en vision om internettet, hvor privatliv er standarden, ikke undtagelsen. Bliv en del af at opbygge en mere privat digital fremtid, én e-mail ad gangen.

<!-- *Nøgleord: privat videresendelse af e-mails, beskyttelse af e-mail-privatliv, sikker e-mailtjeneste, open source-e-mail, kvantesikker kryptering, OpenPGP-e-mail, e-mailbehandling i hukommelsen, e-mailtjeneste uden log, beskyttelse af e-mail-metadata, privatliv i e-mail-headere, end-to-end-krypteret e-mail, privatlivsfokuseret e-mail-videresendelse, bedste praksis for e-mail-sikkerhed, beskyttelse af e-mail-indhold, phishing-beskyttelse, virusscanning i e-mails, privatlivsfokuseret e-mailudbyder, sikre e-mail-headere, implementering af e-mail-privatliv, beskyttelse mod e-mail-overvågning, videresendelse af e-mail uden logføring, forhindre lækage af e-mail-metadata, teknikker til privatliv i e-mails, anonymisering af IP-adresser for e-mails, private e-mail-aliasser, sikkerhed til videresendelse af e-mails, privatliv i e-mails fra annoncører, kvantesikker e-mail-kryptering, e-mail-privatliv uden kompromis, SQLite-e-maillagring, sandbox-baseret e-mail-kryptering, dataportabilitet for e-mails* -->