# Hoe Forward Email Uw Privacy, Domein en Beveiliging Beschermt: De Technische Diepgaande Analyse {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Beste e-mail doorstuurservice vergelijking" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [De Privacyfilosofie van Forward Email](#the-forward-email-privacy-philosophy)
* [SQLite-Implementatie: Duurzaamheid en Draagbaarheid voor Uw Gegevens](#sqlite-implementation-durability-and-portability-for-your-data)
* [Slimme Wachtrij en Herprobeermechanisme: Zekerheid van E-mailbezorging](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Onbeperkte Middelen met Intelligente Snelheidsbeperking](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxed Encryptie voor Verbeterde Beveiliging](#sandboxed-encryption-for-enhanced-security)
* [E-mailverwerking in Geheugen: Geen Schijfopslag voor Maximale Privacy](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-End Encryptie met OpenPGP voor Volledige Privacy](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Meervoudige Laag Contentbescherming voor Uitgebreide Beveiliging](#multi-layered-content-protection-for-comprehensive-security)
* [Hoe Wij Verschillen van Andere E-maildiensten: Het Technische Privacyvoordeel](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Open Source Transparantie voor Verifieerbare Privacy](#open-source-transparency-for-verifiable-privacy)
  * [Geen Vendor Lock-In voor Privacy Zonder Compromis](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandboxed Data voor Echte Isolatie](#sandboxed-data-for-true-isolation)
  * [Gegevensdraagbaarheid en Controle](#data-portability-and-control)
* [De Technische Uitdagingen van Privacy-First E-maildoorsturing](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Geheugenbeheer voor Geen-Logging E-mailverwerking](#memory-management-for-no-logging-email-processing)
  * [Spamdetectie Zonder Contentanalyse voor Privacybewarende Filtering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Compatibiliteit Behouden met Privacy-First Ontwerp](#maintaining-compatibility-with-privacy-first-design)
* [Privacy Best Practices voor Forward Email Gebruikers](#privacy-best-practices-for-forward-email-users)
* [Conclusie: De Toekomst van Privé E-maildoorsturing](#conclusion-the-future-of-private-email-forwarding)


## Voorwoord {#foreword}

In het digitale landschap van vandaag is e-mailprivacy belangrijker dan ooit. Met datalekken, zorgen over surveillance en gerichte reclame gebaseerd op e-mailinhoud, zoeken gebruikers steeds vaker naar oplossingen die hun privacy vooropstellen. Bij Forward Email hebben we onze dienst vanaf de grond opgebouwd met privacy als hoeksteen van onze architectuur. Deze blogpost onderzoekt de technische implementaties die onze dienst tot een van de meest privacygerichte e-maildoorstuuroplossingen maken.


## De Privacyfilosofie van Forward Email {#the-forward-email-privacy-philosophy}

Voordat we in de technische details duiken, is het belangrijk onze fundamentele privacyfilosofie te begrijpen: **uw e-mails behoren toe aan u en alleen u**. Dit principe stuurt elke technische beslissing die we nemen, van hoe we e-maildoorsturing afhandelen tot hoe we encryptie implementeren.

In tegenstelling tot veel e-mailproviders die uw berichten scannen voor advertentiedoeleinden of ze onbeperkt op hun servers opslaan, werkt Forward Email met een radicaal andere aanpak:

1. **Alleen verwerking in geheugen** - We slaan uw doorgestuurde e-mails niet op de schijf op
2. **Geen opslag van metadata** - We bewaren geen gegevens over wie aan wie e-mailt
3. **100% open source** - Onze volledige codebase is transparant en controleerbaar
4. **End-to-end encryptie** - We ondersteunen OpenPGP voor echt privé communicatie


## SQLite-Implementatie: Duurzaamheid en Draagbaarheid voor Uw Gegevens {#sqlite-implementation-durability-and-portability-for-your-data}

Een van de belangrijkste privacyvoordelen van Forward Email is onze zorgvuldig ontworpen [SQLite](https://en.wikipedia.org/wiki/SQLite) implementatie. We hebben SQLite geoptimaliseerd met specifieke PRAGMA-instellingen en [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) om zowel duurzaamheid als draagbaarheid van uw gegevens te garanderen, terwijl we de hoogste normen voor privacy en beveiliging handhaven.
Hier is een overzicht van hoe we SQLite hebben geïmplementeerd met [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) als de cipher voor kwantumresistente encryptie:

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

Deze implementatie zorgt ervoor dat je gegevens niet alleen veilig zijn, maar ook draagbaar. Je kunt je e-mail op elk moment meenemen door te exporteren in [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) of SQLite-formaten. En wanneer je je gegevens wilt verwijderen, zijn ze echt weg – we verwijderen simpelweg de bestanden van de schijfopslag in plaats van SQL DELETE ROW-commando’s uit te voeren, die sporen in de database kunnen achterlaten.

Het kwantum-encryptieaspect van onze implementatie gebruikt ChaCha20-Poly1305 als de cipher wanneer we de database initialiseren, wat sterke bescherming biedt tegen zowel huidige als toekomstige bedreigingen voor je gegevensprivacy.


## Slimme Wachtrij en Herprobeermechanisme: Zorgen voor E-mailbezorging {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

In plaats van ons alleen te richten op headerverwerking, hebben we een geavanceerd slim wachtrij- en herprobeermechanisme geïmplementeerd met onze `getBounceInfo`-methode. Dit systeem zorgt ervoor dat je e-mails de beste kans hebben om bezorgd te worden, zelfs wanneer tijdelijke problemen zich voordoen.

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
> Dit is een fragment van de `getBounceInfo`-methode en niet de daadwerkelijke uitgebreide implementatie. Voor de volledige code kun je deze bekijken op [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

We proberen de mailbezorging 5 dagen opnieuw, vergelijkbaar met industriestandaarden zoals [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), waardoor tijdelijke problemen de tijd krijgen om zichzelf op te lossen. Deze aanpak verbetert de bezorgingspercentages aanzienlijk terwijl de privacy behouden blijft.

In een vergelijkbare lijn redigeren we ook de berichtinhoud van uitgaande SMTP-e-mails na succesvolle bezorging. Dit is geconfigureerd in ons opslagsysteem met een standaard bewaartermijn van 30 dagen, die je kunt aanpassen in de Geavanceerde Instellingen van je domein. Na deze periode wordt de e-mailinhoud automatisch geredigeerd en verwijderd, waarbij alleen een tijdelijke placeholder-tekst overblijft:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```
Deze aanpak zorgt ervoor dat je verzonden e-mails niet onbeperkt worden opgeslagen, waardoor het risico op datalekken of ongeautoriseerde toegang tot je communicatie wordt verminderd.


## Onbeperkte bronnen met intelligente snelheidsbeperking {#unlimited-resources-with-intelligent-rate-limiting}

Hoewel Forward Email onbeperkte domeinen en aliassen biedt, hebben we intelligente snelheidsbeperking geïmplementeerd om ons systeem te beschermen tegen misbruik en eerlijke gebruik voor alle gebruikers te waarborgen. Bijvoorbeeld, niet-enterprise klanten kunnen tot 50+ aliassen per dag aanmaken, wat voorkomt dat onze database wordt gespamd en overspoeld, en onze realtime misbruik- en beschermingsfuncties effectief laat functioneren.

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

Deze gebalanceerde aanpak geeft je de flexibiliteit om zoveel e-mailadressen aan te maken als je nodig hebt voor uitgebreide privacybeheer, terwijl de integriteit en prestaties van onze dienst voor alle gebruikers behouden blijven.


## Gesandboxte encryptie voor verbeterde beveiliging {#sandboxed-encryption-for-enhanced-security}

Onze unieke gesandboxte encryptiebenadering biedt een cruciaal beveiligingsvoordeel dat veel gebruikers over het hoofd zien bij het kiezen van een e-maildienst. Laten we onderzoeken waarom het sandboxen van data, vooral e-mail, zo belangrijk is.

Diensten zoals Gmail en Proton gebruiken hoogstwaarschijnlijk gedeelde [relationele databases](https://en.wikipedia.org/wiki/Relational_database), wat een fundamentele beveiligingskwetsbaarheid creëert. In een gedeelde databaseomgeving, als iemand toegang krijgt tot de data van één gebruiker, heeft diegene mogelijk ook een weg om toegang te krijgen tot de data van andere gebruikers. Dit komt omdat alle gebruikersdata in dezelfde databasetabellen staat, alleen gescheiden door gebruikers-ID's of soortgelijke identificatoren.

Forward Email hanteert een fundamenteel andere aanpak met onze gesandboxte encryptie:

1. **Volledige isolatie**: De data van elke gebruiker wordt opgeslagen in een eigen versleuteld SQLite databasebestand, volledig geïsoleerd van andere gebruikers
2. **Onafhankelijke encryptiesleutels**: Elke database is versleuteld met een unieke sleutel die is afgeleid van het wachtwoord van de gebruiker
3. **Geen gedeelde opslag**: In tegenstelling tot relationele databases waar alle e-mails van gebruikers in één "emails" tabel kunnen staan, zorgt onze aanpak ervoor dat data niet wordt vermengd
4. **Verdediging in diepte**: Zelfs als de database van één gebruiker op de een of andere manier gecompromitteerd zou worden, geeft dit geen toegang tot de data van andere gebruikers

Deze gesandboxte aanpak is vergelijkbaar met het hebben van je e-mail in een aparte fysieke kluis in plaats van in een gedeelde opslagfaciliteit met interne scheidingen. Het is een fundamenteel architectonisch verschil dat je privacy en beveiliging aanzienlijk verbetert.


## E-mailverwerking in het geheugen: geen schijfopslag voor maximale privacy {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Voor onze e-maildoorstuurservice verwerken we e-mails volledig in het RAM-geheugen en schrijven we ze nooit naar schijfopslag of databases. Deze aanpak biedt ongeëvenaarde bescherming tegen e-mailbewaking en metadata-verzameling.

Hier is een vereenvoudigde weergave van hoe onze e-mailverwerking werkt:

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
Deze aanpak betekent dat zelfs als onze servers zouden worden gecompromitteerd, er geen historische e-mailgegevens zijn waar aanvallers toegang toe kunnen krijgen. Je e-mails passeren simpelweg ons systeem en worden onmiddellijk doorgestuurd naar hun bestemming zonder een spoor achter te laten. Deze no-logging e-mail forwarding aanpak is fundamenteel voor het beschermen van je communicatie tegen surveillance.


## End-to-End Encryptie met OpenPGP voor Volledige Privacy {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Voor gebruikers die het hoogste niveau van privacybescherming tegen e-mail surveillance vereisen, ondersteunen we [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) voor end-to-end encryptie. In tegenstelling tot veel e-mailproviders die propriëtaire bridges of apps vereisen, werkt onze implementatie met standaard e-mailclients, waardoor veilige communicatie voor iedereen toegankelijk is.

Dit is hoe we OpenPGP-encryptie implementeren:

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

Deze implementatie zorgt ervoor dat je e-mails worden versleuteld voordat ze je apparaat verlaten en alleen kunnen worden ontsleuteld door de bedoelde ontvanger, waardoor je communicatie privé blijft, zelfs voor ons. Dit is essentieel voor het beschermen van gevoelige communicatie tegen ongeautoriseerde toegang en surveillance.


## Meervoudige Laag Contentbescherming voor Uitgebreide Beveiliging {#multi-layered-content-protection-for-comprehensive-security}

Forward Email biedt meerdere lagen contentbescherming die standaard zijn ingeschakeld om uitgebreide beveiliging te bieden tegen diverse bedreigingen:

1. **Bescherming tegen volwassen inhoud** - Filtert ongepaste inhoud zonder de privacy aan te tasten
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing) bescherming** - Blokkeert pogingen om je informatie te stelen terwijl anonimiteit behouden blijft
3. **Bescherming tegen uitvoerbare bestanden** - Voorkomt potentieel schadelijke bijlagen zonder inhoud te scannen
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus) bescherming** - Scant op malware met privacybeschermende technieken

In tegenstelling tot veel providers die deze functies opt-in maken, hebben wij ze opt-out gemaakt, zodat alle gebruikers standaard profiteren van deze bescherming. Deze aanpak weerspiegelt onze toewijding aan zowel privacy als beveiliging, en biedt een balans die veel e-maildiensten niet bereiken.


## Hoe Wij Verschillen van Andere E-maildiensten: Het Technische Privacyvoordeel {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Bij het vergelijken van Forward Email met andere e-maildiensten, benadrukken verschillende belangrijke technische verschillen onze privacy-first aanpak:

### Open Source Transparantie voor Verifieerbare Privacy {#open-source-transparency-for-verifiable-privacy}

Hoewel veel e-mailproviders beweren open source te zijn, houden ze vaak hun backend-code gesloten. Forward Email is 100% [open source](https://en.wikipedia.org/wiki/Open_source), inclusief zowel frontend- als backend-code. Deze transparantie maakt onafhankelijke beveiligingsaudits van alle componenten mogelijk, waardoor onze privacyclaims door iedereen geverifieerd kunnen worden.

### Geen Vendor Lock-In voor Privacy Zonder Compromis {#no-vendor-lock-in-for-privacy-without-compromise}

Veel privacygerichte e-mailproviders vereisen dat je hun propriëtaire apps of bridges gebruikt. Forward Email werkt met elke standaard e-mailclient via [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) en [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) protocollen, waardoor je de vrijheid hebt om je favoriete e-mailsoftware te kiezen zonder concessies te doen aan privacy.
### Gesandboxte Gegevens voor Echte Isolatie {#sandboxed-data-for-true-isolation}

In tegenstelling tot diensten die gedeelde databases gebruiken waar alle gebruikersgegevens worden vermengd, zorgt onze gesandboxte aanpak ervoor dat de gegevens van elke gebruiker volledig geïsoleerd zijn. Dit fundamentele architecturale verschil biedt aanzienlijk sterkere privacygaranties dan wat de meeste e-maildiensten bieden.

### Gegevensoverdraagbaarheid en Controle {#data-portability-and-control}

Wij geloven dat uw gegevens van u zijn, daarom maken we het gemakkelijk om uw e-mails te exporteren in standaardformaten (MBOX, EML, SQLite) en uw gegevens echt te verwijderen wanneer u dat wilt. Dit niveau van controle is zeldzaam onder e-mailproviders maar essentieel voor echte privacy.


## De Technische Uitdagingen van Privacy-First E-maildoorsturing {#the-technical-challenges-of-privacy-first-email-forwarding}

Het bouwen van een privacy-first e-maildienst brengt aanzienlijke technische uitdagingen met zich mee. Hier zijn enkele obstakels die we hebben overwonnen:

### Geheugenbeheer voor Geen-Logging E-mailverwerking {#memory-management-for-no-logging-email-processing}

E-mails in het geheugen verwerken zonder opslag op schijf vereist zorgvuldig geheugenbeheer om hoge volumes e-mailverkeer efficiënt te verwerken. We hebben geavanceerde geheugenoptimalisatietechnieken geïmplementeerd om betrouwbare prestaties te garanderen zonder concessies te doen aan ons geen-opslagbeleid, een cruciaal onderdeel van onze privacybeschermingsstrategie.

### Spamdetectie Zonder Inhoudsanalyse voor Privacybehoudende Filtering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De meeste [spam](https://en.wikipedia.org/wiki/Email_spam) detectiesystemen zijn afhankelijk van het analyseren van e-mailinhoud, wat in strijd is met onze privacyprincipes. We hebben technieken ontwikkeld om spampatronen te identificeren zonder de inhoud van uw e-mails te lezen, waarmee we een balans vinden tussen privacy en bruikbaarheid die de vertrouwelijkheid van uw communicatie bewaart.

### Compatibiliteit Behouden met Privacy-First Ontwerp {#maintaining-compatibility-with-privacy-first-design}

Het waarborgen van compatibiliteit met alle e-mailclients terwijl we geavanceerde privacyfuncties implementeren, vereiste creatieve technische oplossingen. Ons team heeft onvermoeibaar gewerkt om privacy naadloos te maken, zodat u niet hoeft te kiezen tussen gemak en veiligheid bij het beschermen van uw e-mailcommunicatie.


## Privacy Beste Praktijken voor Forward Email Gebruikers {#privacy-best-practices-for-forward-email-users}

Om uw bescherming tegen e-mailbewaking te maximaliseren en uw privacy te vergroten bij het gebruik van Forward Email, raden wij de volgende beste praktijken aan:

1. **Gebruik unieke aliassen voor verschillende diensten** - Maak voor elke dienst waarvoor u zich aanmeldt een ander e-mailalias aan om cross-service tracking te voorkomen
2. **Schakel OpenPGP-encryptie in** - Gebruik end-to-end encryptie voor gevoelige communicatie om volledige privacy te garanderen
3. **Roteer regelmatig uw e-mailaliassen** - Werk periodiek aliassen bij voor belangrijke diensten om langdurige gegevensverzameling te minimaliseren
4. **Gebruik sterke, unieke wachtwoorden** - Bescherm uw Forward Email-account met een sterk wachtwoord om ongeautoriseerde toegang te voorkomen
5. **Implementeer [IP-adres](https://en.wikipedia.org/wiki/IP_address) anonimisatie** - Overweeg het gebruik van een [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) in combinatie met Forward Email voor volledige anonimiteit


## Conclusie: De Toekomst van Privé E-maildoorsturing {#conclusion-the-future-of-private-email-forwarding}

Bij Forward Email geloven we dat privacy niet zomaar een functie is—het is een fundamenteel recht. Onze technische implementaties weerspiegelen dit geloof en bieden u e-maildoorsturing die uw privacy op elk niveau respecteert en u beschermt tegen e-mailbewaking en metadata-verzameling.

Terwijl we onze dienst blijven ontwikkelen en verbeteren, blijft onze toewijding aan privacy onwankelbaar. We doen voortdurend onderzoek naar nieuwe encryptiemethoden, verkennen aanvullende privacybeschermingen en verfijnen onze codebase om de meest veilige e-mailervaring mogelijk te bieden.

Door te kiezen voor Forward Email kiest u niet alleen een e-maildienst—u steunt een visie van het internet waar privacy de standaard is, niet de uitzondering. Doe met ons mee aan het bouwen van een meer privé digitale toekomst, één e-mail tegelijk.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

