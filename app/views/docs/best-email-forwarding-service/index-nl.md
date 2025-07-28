# Hoe Forward Email uw privacy, domein en veiligheid beschermt: de technische diepgang {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [De Forward Email Privacy Filosofie](#the-forward-email-privacy-philosophy)
* [SQLite-implementatie: duurzaamheid en draagbaarheid voor uw gegevens](#sqlite-implementation-durability-and-portability-for-your-data)
* [Slimme wachtrij en herhaalmechanisme: e-mailbezorging garanderen](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Onbeperkte bronnen met intelligente snelheidsbeperking](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandbox-encryptie voor verbeterde beveiliging](#sandboxed-encryption-for-enhanced-security)
* [In-Memory e-mailverwerking: geen schijfruimte voor maximale privacy](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [End-to-end-encryptie met OpenPGP voor volledige privacy](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Meerlaagse inhoudsbeveiliging voor uitgebreide beveiliging](#multi-layered-content-protection-for-comprehensive-security)
* [Hoe wij ons onderscheiden van andere e-maildiensten: het technische privacyvoordeel](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Open Source Transparantie voor Verifieerbare Privacy](#open-source-transparency-for-verifiable-privacy)
  * [Geen leverancierslock-in voor privacy zonder compromissen](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandbox-gegevens voor echte isolatie](#sandboxed-data-for-true-isolation)
  * [Gegevensportabiliteit en -controle](#data-portability-and-control)
* [De technische uitdagingen van privacy-eerst e-mail doorsturen](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Geheugenbeheer voor e-mailverwerking zonder logboekregistratie](#memory-management-for-no-logging-email-processing)
  * [Spamdetectie zonder inhoudsanalyse voor privacybeschermende filtering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Compatibiliteit behouden met Privacy-First Design](#maintaining-compatibility-with-privacy-first-design)
* [Privacy-best practices voor Forward Email-gebruikers](#privacy-best-practices-for-forward-email-users)
* [Conclusie: De toekomst van privé-e-maildoorsturing](#conclusion-the-future-of-private-email-forwarding)

## Voorwoord {#foreword}

In het digitale landschap van vandaag is e-mailprivacy belangrijker dan ooit. Met datalekken, zorgen over toezicht en gerichte advertenties op basis van e-mailinhoud, zoeken gebruikers steeds vaker naar oplossingen die hun privacy vooropstellen. Bij Forward Email hebben we onze service vanaf de grond opgebouwd met privacy als hoeksteen van onze architectuur. Deze blogpost onderzoekt de technische implementaties die onze service tot een van de meest privacygerichte e-maildoorstuuroplossingen maken die beschikbaar zijn.

## De filosofie van Forward Email Privacy {#the-forward-email-privacy-philosophy}

Voordat we ingaan op de technische details, is het belangrijk om onze fundamentele privacyfilosofie te begrijpen: **uw e-mails zijn van u en alleen van u**. Dit principe vormt de basis voor elke technische beslissing die we nemen, van hoe we e-maildoorsturing afhandelen tot hoe we encryptie implementeren.

In tegenstelling tot veel e-mailproviders, die uw berichten scannen voor reclamedoeleinden of ze voor onbepaalde tijd op hun servers opslaan, hanteert Forward Email een radicaal andere aanpak:

1. **Alleen in-memory verwerking** - We slaan uw doorgestuurde e-mails niet op schijf op.
2. **Geen opslag van metadata** - We houden geen gegevens bij van wie wie e-mailt.
3. **100% open source** - Onze volledige codebase is transparant en controleerbaar.
4. **End-to-end encryptie** - We ondersteunen OpenPGP voor écht privécommunicatie.

## SQLite-implementatie: duurzaamheid en draagbaarheid voor uw gegevens {#sqlite-implementation-durability-and-portability-for-your-data}

Een van de belangrijkste privacyvoordelen van Forward Email is onze zorgvuldig ontworpen [SQLite](https://en.wikipedia.org/wiki/SQLite)-implementatie. We hebben SQLite verfijnd met specifieke PRAGMA-instellingen en [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) om zowel de duurzaamheid als de overdraagbaarheid van uw gegevens te garanderen, met behoud van de hoogste privacy- en beveiligingsnormen.

Hier ziet u hoe we SQLite hebben geïmplementeerd met [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) als de cipher voor kwantumbestendige encryptie:

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

Deze implementatie zorgt ervoor dat uw gegevens niet alleen veilig, maar ook draagbaar zijn. U kunt uw e-mail op elk gewenst moment meenemen door te exporteren in [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) of SQLite-formaat. En wanneer u uw gegevens wilt verwijderen, zijn ze echt weg – we verwijderen de bestanden gewoon van de schijfopslag in plaats van SQL DELETE ROW-opdrachten uit te voeren, die sporen in de database kunnen achterlaten.

Het kwantumversleutelingsaspect van onze implementatie gebruikt ChaCha20-Poly1305 als code wanneer we de database initialiseren. Dit biedt sterke bescherming tegen zowel huidige als toekomstige bedreigingen voor de privacy van uw gegevens.

## Slimme wachtrij en herhaalmechanisme: e-mailbezorging garanderen {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

In plaats van ons uitsluitend te richten op headerverwerking, hebben we een geavanceerd slim wachtrij- en retry-mechanisme geïmplementeerd met onze `getBounceInfo`-methode. Dit systeem zorgt ervoor dat uw e-mails de beste kans hebben om te worden afgeleverd, zelfs bij tijdelijke problemen.

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

We proberen e-mails 5 dagen lang opnieuw te bezorgen, vergelijkbaar met industriestandaarden zoals [Achtervoegsel](https://en.wikipedia.org/wiki/Postfix_\(software\), waardoor tijdelijke problemen de tijd krijgen om zichzelf op te lossen. Deze aanpak verbetert de bezorgsnelheid aanzienlijk en behoudt tegelijkertijd de privacy.

In een vergelijkbare noot redigeren we ook de berichtinhoud van uitgaande SMTP-e-mails na succesvolle levering. Dit is geconfigureerd in ons opslagsysteem met een standaardretentieperiode van 30 dagen, die u kunt aanpassen in de geavanceerde instellingen van uw domein. Na deze periode wordt de e-mailinhoud automatisch geredigeerd en verwijderd, met alleen een tijdelijke bericht dat overblijft:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Met deze aanpak voorkomt u dat uw verzonden e-mails voor onbepaalde tijd bewaard blijven. Zo verkleint u het risico op datalekken of ongeautoriseerde toegang tot uw communicatie.

## Onbeperkte bronnen met intelligente snelheidsbeperking {#unlimited-resources-with-intelligent-rate-limiting}

Hoewel Forward Email onbeperkte domeinen en aliassen biedt, hebben we intelligente tariefbeperking geïmplementeerd om ons systeem te beschermen tegen misbruik en eerlijk gebruik voor alle gebruikers te garanderen. Niet-zakelijke klanten kunnen bijvoorbeeld tot 50+ aliassen per dag aanmaken, wat voorkomt dat onze database wordt gespamd en overspoeld, en onze realtime misbruik- en beschermingsfuncties effectief laat functioneren.

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

Deze evenwichtige aanpak biedt u de flexibiliteit om zoveel e-mailadressen aan te maken als u nodig hebt voor uitgebreid privacybeheer, terwijl de integriteit en prestaties van onze service voor alle gebruikers behouden blijven.

## Sandbox-encryptie voor verbeterde beveiliging {#sandboxed-encryption-for-enhanced-security}

Onze unieke sandbox-encryptieaanpak biedt een cruciaal beveiligingsvoordeel dat veel gebruikers over het hoofd zien bij het kiezen van een e-mailservice. Laten we eens kijken waarom sandboxing van gegevens, met name e-mail, zo belangrijk is.

Diensten zoals Gmail en Proton gebruiken hoogstwaarschijnlijk gedeelde [relationele databases](https://en.wikipedia.org/wiki/Relational_database), wat een fundamenteel beveiligingslek creëert. Als iemand in een gedeelde databaseomgeving toegang krijgt tot de gegevens van één gebruiker, heeft diegene mogelijk ook toegang tot de gegevens van andere gebruikers. Dit komt doordat alle gebruikersgegevens zich in dezelfde databasetabellen bevinden, gescheiden door gebruikers-ID's of vergelijkbare identificatiegegevens.

Forward Email hanteert een fundamenteel andere aanpak met onze sandbox-encryptie:

1. **Volledige isolatie**: De gegevens van elke gebruiker worden opgeslagen in een eigen, versleutelde SQLite-database, volledig geïsoleerd van andere gebruikers.
2. **Onafhankelijke encryptiesleutels**: Elke database is versleuteld met een eigen unieke sleutel, afgeleid van het wachtwoord van de gebruiker.
3. **Geen gedeelde opslag**: In tegenstelling tot relationele databases, waar alle e-mails van gebruikers in één tabel met "e-mails" staan, zorgt onze aanpak ervoor dat gegevens niet worden vermengd.
4. **Diepgaande verdediging**: Zelfs als de database van één gebruiker op de een of andere manier wordt gecompromitteerd, biedt deze geen toegang tot de gegevens van een andere gebruiker.

Deze sandbox-aanpak is vergelijkbaar met het bewaren van uw e-mail in een aparte fysieke kluis in plaats van in een gedeelde opslagfaciliteit met interne scheidingswanden. Het is een fundamenteel architectonisch verschil dat uw privacy en beveiliging aanzienlijk verbetert.

## In-Memory e-mailverwerking: geen schijfruimte nodig voor maximale privacy {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Voor onze e-maildoorstuurservice verwerken we e-mails volledig in RAM en schrijven ze nooit naar schijfopslag of databases. Deze aanpak biedt ongeëvenaarde bescherming tegen e-mailbewaking en metadataverzameling.

Hieronder ziet u een vereenvoudigd overzicht van hoe onze e-mailverwerking werkt:

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

Deze aanpak betekent dat zelfs als onze servers gecompromitteerd zouden worden, er geen historische e-mailgegevens zouden zijn waar aanvallers toegang toe zouden hebben. Uw e-mails gaan gewoon door ons systeem en worden onmiddellijk doorgestuurd naar hun bestemming zonder een spoor achter te laten. Deze no-logging e-mail forwarding-aanpak is fundamenteel voor het beschermen van uw communicatie tegen surveillance.

## End-to-end-encryptie met OpenPGP voor volledige privacy {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Voor gebruikers die de hoogste mate van privacybescherming tegen e-mailsurveillance nodig hebben, ondersteunen we [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) voor end-to-end encryptie. In tegenstelling tot veel e-mailproviders die bedrijfseigen bruggen of apps vereisen, werkt onze implementatie met standaard e-mailclients, waardoor veilige communicatie voor iedereen toegankelijk is.

Zo implementeren wij OpenPGP-encryptie:

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

Deze implementatie zorgt ervoor dat uw e-mails worden gecodeerd voordat ze uw apparaat verlaten en alleen kunnen worden gedecodeerd door de beoogde ontvanger, waardoor uw communicatie privé blijft, zelfs voor ons. Dit is essentieel voor het beschermen van gevoelige communicatie tegen ongeautoriseerde toegang en bewaking.

## Meerlaagse inhoudsbeveiliging voor uitgebreide beveiliging {#multi-layered-content-protection-for-comprehensive-security}

Forward Email biedt meerdere lagen van inhoudsbeveiliging die standaard zijn ingeschakeld om uitgebreide beveiliging te bieden tegen verschillende bedreigingen:

1. **Bescherming voor inhoud voor volwassenen** - Filtert ongepaste inhoud zonder de privacy in gevaar te brengen
2. **[Phishing](https://en.wikipedia.org/wiki/Phishing)-beveiliging** - Blokkeert pogingen om uw gegevens te stelen en behoudt uw anonimiteit
3. **Bescherming voor uitvoerbare bestanden** - Voorkomt potentieel schadelijke bijlagen zonder de inhoud te scannen
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus)-beveiliging** - Scant op malware met behulp van privacybeschermende technieken

In tegenstelling tot veel providers die deze functies opt-in maken, hebben wij ze opt-out gemaakt, zodat alle gebruikers standaard profiteren van deze bescherming. Deze aanpak weerspiegelt onze toewijding aan zowel privacy als beveiliging, en biedt een balans die veel e-mailservices niet kunnen bereiken.

## Hoe wij ons onderscheiden van andere e-maildiensten: het technische privacyvoordeel {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Wanneer we Forward Email vergelijken met andere e-mailservices, benadrukken een aantal belangrijke technische verschillen onze privacy-eerste benadering:

### Open Source Transparantie voor Verifieerbare Privacy {#open-source-transparency-for-verifiable-privacy}

Hoewel veel e-mailproviders beweren open source te zijn, houden ze hun backendcode vaak gesloten. Forward Email is 100% [open bron](https://en.wikipedia.org/wiki/Open_source), inclusief zowel de frontend- als de backendcode. Deze transparantie maakt onafhankelijke beveiligingsaudits van alle componenten mogelijk, waardoor onze privacyclaims door iedereen geverifieerd kunnen worden.

### Geen leveranciersbinding voor privacy zonder compromissen {#no-vendor-lock-in-for-privacy-without-compromise}

Veel privacygerichte e-mailproviders vereisen dat u hun eigen apps of bruggen gebruikt. Forward Email werkt met elke standaard e-mailclient via de protocollen [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) en [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), waardoor u de vrijheid heeft om uw favoriete e-mailsoftware te kiezen zonder dat dit ten koste gaat van uw privacy.

### Sandbox-gegevens voor echte isolatie {#sandboxed-data-for-true-isolation}

In tegenstelling tot services die gedeelde databases gebruiken waarbij alle gebruikersgegevens worden vermengd, zorgt onze sandbox-aanpak ervoor dat de gegevens van elke gebruiker volledig geïsoleerd zijn. Dit fundamentele architecturale verschil biedt aanzienlijk sterkere privacygaranties dan wat de meeste e-mailservices bieden.

### Gegevensportabiliteit en -controle {#data-portability-and-control}

Wij geloven dat uw gegevens van u zijn, daarom maken we het eenvoudig om uw e-mails te exporteren in standaardformaten (MBOX, EML, SQLite) en uw gegevens echt te verwijderen wanneer u dat wilt. Dit niveau van controle is zeldzaam bij e-mailproviders, maar essentieel voor echte privacy.

## De technische uitdagingen van privacy-eerst e-mail doorsturen {#the-technical-challenges-of-privacy-first-email-forwarding}

Het bouwen van een privacy-first e-mailservice brengt aanzienlijke technische uitdagingen met zich mee. Hier zijn enkele van de obstakels die we hebben overwonnen:

### Geheugenbeheer voor e-mailverwerking zonder logboekregistratie {#memory-management-for-no-logging-email-processing}

Het verwerken van e-mails in het geheugen zonder schijfopslag vereist zorgvuldig geheugenbeheer om grote volumes e-mailverkeer efficiënt te verwerken. We hebben geavanceerde geheugenoptimalisatietechnieken geïmplementeerd om betrouwbare prestaties te garanderen zonder afbreuk te doen aan ons no-storage-beleid, een cruciaal onderdeel van onze privacybeschermingsstrategie.

### Spamdetectie zonder inhoudsanalyse voor privacybeschermende filtering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De meeste [spam](https://en.wikipedia.org/wiki/Email_spam) detectiesystemen zijn gebaseerd op het analyseren van e-mailinhoud, wat in strijd is met onze privacyprincipes. We hebben technieken ontwikkeld om spampatronen te identificeren zonder de inhoud van uw e-mails te lezen. Zo vinden we een balans tussen privacy en gebruiksgemak, waardoor de vertrouwelijkheid van uw communicatie behouden blijft.

### Compatibiliteit behouden met privacy-eerst ontwerp {#maintaining-compatibility-with-privacy-first-design}

Om compatibiliteit met alle e-mailclients te garanderen en tegelijkertijd geavanceerde privacyfuncties te implementeren, waren creatieve technische oplossingen nodig. Ons team heeft onvermoeibaar gewerkt om privacy naadloos te maken, zodat u niet hoeft te kiezen tussen gemak en veiligheid bij het beschermen van uw e-mailcommunicatie.

## Privacy-best practices voor doorstuurgebruikers van e-mail {#privacy-best-practices-for-forward-email-users}

Om uw bescherming tegen e-mailbewaking te maximaliseren en uw privacy te maximaliseren bij het gebruik van Forward Email, raden wij de volgende best practices aan:

1. **Gebruik unieke aliassen voor verschillende services** - Maak voor elke service waarvoor u zich aanmeldt een aparte e-mailalias aan om cross-service tracking te voorkomen.
2. **Schakel OpenPGP-versleuteling in** - Gebruik voor gevoelige communicatie end-to-end-versleuteling om volledige privacy te garanderen.
3. **Rouleer regelmatig uw e-mailaliassen** - Werk aliassen voor belangrijke services regelmatig bij om gegevensverzameling op de lange termijn te minimaliseren.
4. **Gebruik sterke, unieke wachtwoorden** - Bescherm uw Forward Email-account met een sterk wachtwoord om ongeautoriseerde toegang te voorkomen.
5. **Implementeer [IP-adres](https://en.wikipedia.org/wiki/IP_address) anonimisering** - Overweeg het gebruik van een [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) in combinatie met Forward Email voor volledige anonimiteit.

## Conclusie: De toekomst van privé-e-maildoorsturen {#conclusion-the-future-of-private-email-forwarding}

Bij Forward Email geloven we dat privacy niet alleen een functie is, maar een fundamenteel recht. Onze technische implementaties weerspiegelen dit geloof en bieden u e-mailforwarding die uw privacy op elk niveau respecteert en u beschermt tegen e-mailsurveillance en metadataverzameling.

Terwijl we onze service blijven ontwikkelen en verbeteren, blijft onze toewijding aan privacy onverminderd. We onderzoeken voortdurend nieuwe encryptiemethoden, verkennen aanvullende privacybeschermingen en verfijnen onze codebase om de meest veilige e-mailervaring mogelijk te maken.

Door Forward Email te kiezen, selecteert u niet alleen een e-mailservice, maar ondersteunt u een visie op het internet waarbij privacy de standaard is, niet de uitzondering. Doe met ons mee en bouw aan een meer private digitale toekomst, één e-mail per keer.

<!-- *Trefwoorden: privé-e-maildoorsturen, privacybescherming voor e-mail, beveiligde e-mailservice, open-source-e-mail, kwantumveilige encryptie, OpenPGP-e-mail, in-memory-e-mailverwerking, no-log e-mailservice, bescherming van e-mailmetadata, privacy van e-mailheader, end-to-end versleutelde e-mail, privacy-first e-mail, anonieme e-maildoorsturen, aanbevolen procedures voor e-mailbeveiliging, bescherming van e-mailinhoud, phishingbeveiliging, e-mailvirusscanning, e-mailprovider met privacyfocus, beveiligde e-mailheaders, implementatie van e-mailprivacy, bescherming tegen e-mailsurveillance, no-logging e-maildoorsturen, lekken van e-mailmetadata voorkomen, technieken voor e-mailprivacy, anonimisering van IP-adressen voor e-mail, privé-e-mailaliassen, beveiliging van e-maildoorsturen, privacy van e-mail tegen adverteerders, kwantumveilige e-mailversleuteling, privacy van e-mail zonder compromissen, SQLite-e-mailopslag, sandbox-e-mailversleuteling, gegevensportabiliteit voor e-mail* -->