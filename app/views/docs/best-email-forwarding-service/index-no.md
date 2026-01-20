# Hvordan videresendt e-post beskytter personvernet, domenet og sikkerheten din: Den tekniske dybden {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Filosofien om personvern for videresending av e-post](#the-forward-email-privacy-philosophy)
* [SQLite-implementering: Holdbarhet og portabilitet for dataene dine](#sqlite-implementation-durability-and-portability-for-your-data)
* [Smart kø og mekanisme for nye forsøk: Sikre e-postlevering](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Ubegrensede ressurser med intelligent hastighetsbegrensning](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandkassekryptering for forbedret sikkerhet](#sandboxed-encryption-for-enhanced-security)
* [E-postbehandling i minnet: Ingen disklagring for maksimal personvern](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Ende-til-ende-kryptering med OpenPGP for fullstendig personvern](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Flerlags innholdsbeskyttelse for omfattende sikkerhet](#multi-layered-content-protection-for-comprehensive-security)
* [Hvordan vi skiller oss fra andre e-posttjenester: Den tekniske personvernfordelen](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Åpen kildekode-transparens for verifiserbart personvern](#open-source-transparency-for-verifiable-privacy)
  * [Ingen leverandørbinding for personvern uten kompromisser](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandkassedata for ekte isolasjon](#sandboxed-data-for-true-isolation)
  * [Dataportabilitet og kontroll](#data-portability-and-control)
* [De tekniske utfordringene med videresending av e-post med personvern som hovedprioritet](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Minnehåndtering for e-postbehandling uten logging](#memory-management-for-no-logging-email-processing)
  * [Spamdeteksjon uten innholdsanalyse for personvernbevarende filtrering](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Opprettholde kompatibilitet med personvern-først-design](#maintaining-compatibility-with-privacy-first-design)
* [Beste praksis for personvern for brukere av videresendt e-post](#privacy-best-practices-for-forward-email-users)
* [Konklusjon: Fremtiden for privat videresending av e-post](#conclusion-the-future-of-private-email-forwarding)

## Forord {#foreword}

I dagens digitale landskap har personvern knyttet til e-post blitt viktigere enn noensinne. Med datainnbrudd, bekymringer rundt overvåking og målrettet annonsering basert på e-postinnhold, søker brukere i økende grad løsninger som prioriterer personvernet deres. Hos Forward Email har vi bygget tjenesten vår fra grunnen av med personvern som hjørnesteinen i arkitekturen vår. Dette blogginnlegget utforsker de tekniske implementeringene som gjør tjenesten vår til en av de mest personvernfokuserte løsningene for videresending av e-post som er tilgjengelige.

## Filosofien om personvern for videresending av e-post {#the-forward-email-privacy-philosophy}

Før vi dykker ned i de tekniske detaljene, er det viktig å forstå vår grunnleggende personvernfilosofi: **e-postene dine tilhører deg og bare deg**. Dette prinsippet styrer alle tekniske avgjørelser vi tar, fra hvordan vi håndterer videresending av e-post til hvordan vi implementerer kryptering.

I motsetning til mange e-postleverandører som skanner meldingene dine for reklameformål eller lagrer dem på ubestemt tid på serverne sine, opererer Forward Email med en radikalt annerledes tilnærming:

1. **Kun behandling i minnet** – Vi lagrer ikke dine videresendte e-poster på disk
2. **Ingen lagring av metadata** – Vi fører ikke oversikt over hvem som sender e-post til hvem
3. **100 % åpen kildekode** – Hele kodebasen vår er transparent og reviderbar
4. **End-to-end-kryptering** – Vi støtter OpenPGP for virkelig privat kommunikasjon

## SQLite-implementering: Holdbarhet og portabilitet for dataene dine {#sqlite-implementation-durability-and-portability-for-your-data}

En av de viktigste personvernfordelene med Videresendt e-post er vår nøye konstruerte [SQLite](https://en.wikipedia.org/wiki/SQLite)-implementering. Vi har finjustert SQLite med spesifikke PRAGMA-innstillinger og [Forhåndsskrivingslogging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) for å sikre både holdbarhet og portabilitet for dataene dine, samtidig som vi opprettholder de høyeste standardene for personvern og sikkerhet.

Her er en titt på hvordan vi har implementert SQLite med [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) som kryptering for kvantebestandig kryptering:

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

Denne implementeringen sikrer at dataene dine ikke bare er sikre, men også bærbare. Du kan ta med deg e-posten din når som helst ved å eksportere i [MBOX](https://en.wikipedia.org/wiki/Email#Storage)-, [EML](https://en.wikipedia.org/wiki/Email#Storage)- eller SQLite-formater. Og når du vil slette dataene dine, er de virkelig borte – vi sletter ganske enkelt filene fra disklagringen i stedet for å kjøre SQL DELETE ROW-kommandoer, som kan etterlate spor i databasen.

Kvantekrypteringsaspektet ved implementeringen vår bruker ChaCha20-Poly1305 som kryptering når vi initialiserer databasen, noe som gir sterk beskyttelse mot både nåværende og fremtidige trusler mot personvernet ditt.

## Smart kø og mekanisme for nye forsøk: Sikre e-postlevering {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

I stedet for å fokusere utelukkende på håndtering av overskrifter, har vi implementert en sofistikert smart kø- og nytt forsøksmekanisme med vår `getBounceInfo`-metode. Dette systemet sikrer at e-postene dine har best mulig sjanse til å bli levert, selv når det oppstår midlertidige problemer.

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
> Dette er et utdrag av `getBounceInfo`-metoden og ikke den faktiske omfattende implementeringen. Du kan se hele koden på [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Vi prøver å levere posten på nytt i fem dager, i likhet med bransjestandarder som [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), og gir midlertidige problemer tid til å løse seg selv. Denne tilnærmingen forbedrer leveringsratene betydelig samtidig som personvernet ivaretas.

På samme måte redigerer vi også meldingsinnholdet i utgående SMTP-e-poster etter vellykket levering. Dette er konfigurert i lagringssystemet vårt med en standard oppbevaringsperiode på 30 dager, som du kan justere i domenets avanserte innstillinger. Etter denne perioden redigeres og slettes e-postinnholdet automatisk, med bare en midlertidig melding igjen:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Denne tilnærmingen sikrer at sendte e-poster ikke lagres på ubestemt tid, noe som reduserer risikoen for datainnbrudd eller uautorisert tilgang til kommunikasjonen din.

## Ubegrensede ressurser med intelligent hastighetsbegrensning {#unlimited-resources-with-intelligent-rate-limiting}

Selv om Forward Email tilbyr et ubegrenset antall domener og aliaser, har vi implementert intelligent hastighetsbegrensning for å beskytte systemet vårt mot misbruk og sikre rettferdig bruk for alle brukere. For eksempel kan ikke-bedriftskunder opprette opptil 50+ aliaser per dag, noe som forhindrer at databasen vår blir spammet og oversvømmet, og lar våre funksjoner for misbruk og beskyttelse i sanntid fungere effektivt.

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

Denne balanserte tilnærmingen gir deg fleksibiliteten til å opprette så mange e-postadresser du trenger for omfattende personvernadministrasjon, samtidig som du opprettholder integriteten og ytelsen til tjenesten vår for alle brukere.

## Sandkassekryptering for forbedret sikkerhet {#sandboxed-encryption-for-enhanced-security}

Vår unike sandkasse-krypteringstilnærming gir en kritisk sikkerhetsfordel som mange brukere overser når de velger en e-posttjeneste. La oss utforske hvorfor sandkasse-kryptering av data, spesielt e-post, er så viktig.

Tjenester som Gmail og Proton bruker mest sannsynlig delt [relasjonsdatabaser](https://en.wikipedia.org/wiki/Relational_database), noe som skaper et grunnleggende sikkerhetsproblem. I et delt databasemiljø, hvis noen får tilgang til én brukers data, har de potensielt en måte å få tilgang til andre brukeres data også. Dette er fordi alle brukerdata ligger i de samme databasetabellene, kun atskilt av bruker-ID-er eller lignende identifikatorer.

Videresend e-post har en fundamentalt annerledes tilnærming med vår sandkasse-kryptering:

1. **Fullstendig isolasjon**: Hver brukers data lagres i sin egen krypterte SQLite-databasefil, fullstendig isolert fra andre brukere.

2. **Uavhengige krypteringsnøkler**: Hver database er kryptert med sin egen unike nøkkel utledet fra brukerens passord.

3. **Ingen delt lagring**: I motsetning til relasjonsdatabaser der alle brukernes e-poster kan være i en enkelt "e-post"-tabell, sikrer vår tilnærming ingen sammenblanding av data.

4. **Dyptgående forsvar**: Selv om én brukers database på en eller annen måte ble kompromittert, ville den ikke gi tilgang til andre brukeres data.

Denne sandkassebaserte tilnærmingen ligner på å ha e-posten din i et separat fysisk hvelv i stedet for i et delt lagringsanlegg med interne skillevegger. Det er en grunnleggende arkitektonisk forskjell som forbedrer personvernet og sikkerheten din betydelig.

## E-postbehandling i minnet: Ingen disklagring for maksimal personvern {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

For vår e-postvideresendingstjeneste behandler vi e-poster utelukkende i RAM og skriver dem aldri til disklagring eller databaser. Denne tilnærmingen gir enestående beskyttelse mot e-postovervåking og innsamling av metadata.

Her er en forenklet oversikt over hvordan e-postbehandlingen vår fungerer:

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

Denne tilnærmingen betyr at selv om serverne våre ble kompromittert, ville det ikke være noen historiske e-postdata som angripere kunne få tilgang til. E-postene dine passerer ganske enkelt gjennom systemet vårt og videresendes umiddelbart til destinasjonen sin uten å etterlate spor. Denne metoden for videresending av e-post uten logging er grunnleggende for å beskytte kommunikasjonen din mot overvåking.

## Ende-til-ende-kryptering med OpenPGP for fullstendig personvern {#end-to-end-encryption-with-openpgp-for-complete-privacy}

For brukere som trenger det høyeste nivået av personvernbeskyttelse fra e-postovervåking, støtter vi [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) for ende-til-ende-kryptering. I motsetning til mange e-postleverandører som krever proprietære broer eller apper, fungerer implementeringen vår med standard e-postklienter, noe som gjør sikker kommunikasjon tilgjengelig for alle.

Slik implementerer vi OpenPGP-kryptering:

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

Denne implementeringen sikrer at e-postene dine krypteres før de forlater enheten din, og at de bare kan dekrypteres av den tiltenkte mottakeren. Dette holder kommunikasjonen din privat, selv for oss. Dette er viktig for å beskytte sensitiv kommunikasjon mot uautorisert tilgang og overvåking.

## Flerlags innholdsbeskyttelse for omfattende sikkerhet {#multi-layered-content-protection-for-comprehensive-security}

Videresend e-post tilbyr flere lag med innholdsbeskyttelse som er aktivert som standard for å gi omfattende sikkerhet mot ulike trusler:

1. **Beskyttelse mot voksent innhold** – Filtrerer ut upassende innhold uten å kompromittere personvernet.
2. **[Nettfisking](https://en.wikipedia.org/wiki/Phishing)-beskyttelse** – Blokkerer forsøk på å stjele informasjonen din samtidig som anonymiteten bevares.
3. **Beskyttelse mot kjørbare filer** – Forhindrer potensielt skadelige vedlegg uten å skanne innhold.
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus)-beskyttelse** – Skanner etter skadelig programvare ved hjelp av personvernbevarende teknikker.

I motsetning til mange leverandører som velger å aktivere disse funksjonene, har vi gjort det mulig å velge dem bort, slik at alle brukere drar nytte av denne beskyttelsen som standard. Denne tilnærmingen gjenspeiler vår forpliktelse til både personvern og sikkerhet, og gir en balanse som mange e-posttjenester ikke klarer å oppnå.

## Hvordan vi skiller oss fra andre e-posttjenester: Den tekniske personvernfordelen {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Når vi sammenligner Videresendt E-post med andre e-posttjenester, er det flere viktige tekniske forskjeller som fremhever vår personvernfokuserte tilnærming:

### Åpen kildekode-transparens for verifiserbart personvern {#open-source-transparency-for-verifiable-privacy}

Selv om mange e-postleverandører hevder å være åpen kildekode, holder de ofte backend-koden sin lukket. Videresendt e-post er 100 % [åpen kildekode](https://en.wikipedia.org/wiki/Open_source), inkludert både frontend- og backend-kode. Denne åpenheten muliggjør uavhengig sikkerhetsrevisjon av alle komponenter, noe som sikrer at våre personvernkrav kan bekreftes av alle.

### Ingen leverandørbinding for personvern uten kompromisser {#no-vendor-lock-in-for-privacy-without-compromise}

Mange personvernfokuserte e-postleverandører krever at du bruker deres proprietære apper eller broer. Videresend e-post fungerer med alle standard e-postklienter gjennom protokollene [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) og [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), noe som gir deg friheten til å velge din foretrukne e-postprogramvare uten at det går på bekostning av personvernet.

### Sandbox-data for ekte isolasjon {#sandboxed-data-for-true-isolation}

I motsetning til tjenester som bruker delte databaser der alle brukernes data blandes, sikrer vår sandkassebaserte tilnærming at hver brukers data er fullstendig isolert. Denne grunnleggende arkitekturforskjellen gir betydelig sterkere personverngarantier enn det de fleste e-posttjenester tilbyr.

### Dataportabilitet og -kontroll {#data-portability-and-control}

Vi mener at dataene dine tilhører deg, og derfor gjør vi det enkelt å eksportere e-postene dine i standardformater (MBOX, EML, SQLite) og slette dataene dine når du vil. Dette kontrollnivået er sjeldent blant e-postleverandører, men avgjørende for ekte personvern.

## De tekniske utfordringene med videresending av e-post med personvern først {#the-technical-challenges-of-privacy-first-email-forwarding}

Å bygge en e-posttjeneste med personvern i fokus kommer med betydelige tekniske utfordringer. Her er noen av hindringene vi har overvunnet:

### Minnehåndtering for e-postbehandling uten logging {#memory-management-for-no-logging-email-processing}

Behandling av e-poster i minnet uten disklagring krever nøye minnehåndtering for å håndtere store mengder e-posttrafikk effektivt. Vi har implementert avanserte minneoptimaliseringsteknikker for å sikre pålitelig ytelse uten at det går på bekostning av vår policy om ingen lagring, en kritisk del av vår personvernstrategi.

### Spamdeteksjon uten innholdsanalyse for personvernbevarende filtrering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

De fleste [spam](https://en.wikipedia.org/wiki/Email_spam)-deteksjonssystemene er avhengige av å analysere e-postinnhold, noe som er i konflikt med våre personvernprinsipper. Vi har utviklet teknikker for å identifisere spammønstre uten å lese innholdet i e-postene dine, og finner en balanse mellom personvern og brukervennlighet som bevarer konfidensialiteten til kommunikasjonen din.

### Opprettholde kompatibilitet med personvern-først-design {#maintaining-compatibility-with-privacy-first-design}

Å sikre kompatibilitet med alle e-postklienter samtidig som man implementerer avanserte personvernfunksjoner har krevd kreative tekniske løsninger. Teamet vårt har jobbet utrettelig for å gjøre personvern sømløst, slik at du ikke trenger å velge mellom bekvemmelighet og sikkerhet når du beskytter e-postkommunikasjonen din.

## Beste praksis for personvern for brukere av videresending av e-post {#privacy-best-practices-for-forward-email-users}

For å maksimere beskyttelsen mot e-postovervåking og maksimere personvernet ditt når du bruker videresendt e-post, anbefaler vi følgende beste praksis:

1. **Bruk unike aliaser for forskjellige tjenester** – Opprett et annet e-postalias for hver tjeneste du registrerer deg for for å forhindre sporing på tvers av tjenester.**
2. **Aktiver OpenPGP-kryptering** – Bruk ende-til-ende-kryptering for sensitiv kommunikasjon for å sikre fullstendig personvern.**
3. **Rotér e-postaliasene dine regelmessig** – Oppdater aliaser for viktige tjenester med jevne mellomrom for å minimere langsiktig datainnsamling.**
4. **Bruk sterke, unike passord** – Beskytt kontoen din for videresending av e-post med et sterkt passord for å forhindre uautorisert tilgang.**
5. **Implementer [IP-adresse](https://en.wikipedia.org/wiki/IP_address)-anonymisering** – Vurder å bruke [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) sammen med videresending av e-post for fullstendig anonymitet.

## Konklusjon: Fremtiden for videresending av privat e-post {#conclusion-the-future-of-private-email-forwarding}

Hos Forward Email mener vi at personvern ikke bare er en funksjon – det er en grunnleggende rettighet. Våre tekniske implementeringer gjenspeiler denne oppfatningen, og gir deg videresending av e-post som respekterer personvernet ditt på alle nivåer og beskytter deg mot e-postovervåking og innsamling av metadata.

Etter hvert som vi fortsetter å utvikle og forbedre tjenesten vår, forblir vår forpliktelse til personvern urokkelig. Vi forsker kontinuerlig på nye krypteringsmetoder, utforsker ytterligere personvernbeskyttelse og forbedrer kodebasen vår for å gi den sikreste e-postopplevelsen som mulig.

Ved å velge Videresend e-post, velger du ikke bare en e-posttjeneste – du støtter en visjon om internett der personvern er standard, ikke unntaket. Bli med oss i å bygge en mer privat digital fremtid, én e-post om gangen.

<!-- *Nøkkelord: privat videresending av e-post, personvernbeskyttelse av e-post, sikker e-posttjeneste, åpen kildekode-e-post, kvantesikker kryptering, OpenPGP-e-post, e-postbehandling i minnet, e-posttjeneste uten loggføring, beskyttelse av e-postmetadata, personvern i e-posthoder, ende-til-ende-kryptert e-post, personvern først-e-post, anonym e-postvideresending, beste praksis for e-postsikkerhet, beskyttelse av e-postinnhold, phishing-beskyttelse, virusskanning i e-post, personvernfokusert e-postleverandør, sikre e-posthoder, implementering av e-postpersonvern, beskyttelse mot e-postovervåking, videresending av e-post uten logging, forhindre lekkasje av e-postmetadata, teknikker for e-postpersonvern, anonymisering av IP-adresser for e-post, private e-postaliaser, sikkerhet for videresending av e-post, e-postpersonvern fra annonsører, kvantesikker e-postkryptering, e-postpersonvern uten kompromisser, SQLite-e-postlagring, sandkasse-e-postkryptering, dataportabilitet for e-post* -->