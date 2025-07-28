# Kuinka sähköpostin edelleenlähetys suojaa yksityisyyttäsi, verkkotunnustasi ja tietoturvaasi: tekninen perusteellinen katsaus {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="laiska" src="/img/articles/email-forwarding.webp" alt="" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Eteenpäin sähköpostin tietosuojafilosofia](#the-forward-email-privacy-philosophy)
* [SQLite-toteutus: Tietojesi kestävyys ja siirrettävyys](#sqlite-implementation-durability-and-portability-for-your-data)
* [Älykäs jono- ja uudelleenyritysmekanismi: sähköpostin toimituksen varmistaminen](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Rajoittamattomat resurssit älykkäällä nopeudenrajoituksella](#unlimited-resources-with-intelligent-rate-limiting)
* [Sandboxed-salaus parantaa turvallisuutta](#sandboxed-encryption-for-enhanced-security)
* [Muistissa sähköpostin käsittely: Ei levytilaa maksimaalisen yksityisyyden takaamiseksi](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Päästä päähän -salaus OpenPGP:llä täydellisen yksityisyyden takaamiseksi](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Monikerroksinen sisällön suojaus kattavaan tietoturvaan](#multi-layered-content-protection-for-comprehensive-security)
* [Miten eroamme muista sähköpostipalveluista: Tekninen tietosuojaetu](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Avoimen lähdekoodin läpinäkyvyys todennettavissa olevaan yksityisyyteen](#open-source-transparency-for-verifiable-privacy)
  * [Ei toimittajan lukitusta yksityisyyden takaamiseksi ilman kompromisseja](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Sandbox-tiedot todellista eristämistä varten](#sandboxed-data-for-true-isolation)
  * [Tietojen siirrettävyys ja hallinta](#data-portability-and-control)
* [Tietosuojan tekniset haasteet - ensimmäinen sähköpostin edelleenlähetys](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Muistinhallinta kirjautumattomaan sähköpostin käsittelyyn](#memory-management-for-no-logging-email-processing)
  * [Roskapostin tunnistus ilman sisältöanalyysiä yksityisyyden suojaamiseksi](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Yhteensopivuuden säilyttäminen Privacy-First Designin kanssa](#maintaining-compatibility-with-privacy-first-design)
* [Parhaat tietosuojakäytännöt edelleenlähettäville sähköpostin käyttäjille](#privacy-best-practices-for-forward-email-users)
* [Johtopäätös: Yksityisen sähköpostin edelleenlähetyksen tulevaisuus](#conclusion-the-future-of-private-email-forwarding)

## Esipuhe {#foreword}

Nykypäivän digitaalisessa ympäristössä sähköpostin tietosuoja on tullut kriittisemmäksi kuin koskaan. Tietomurtojen, valvontaongelmien ja sähköpostin sisältöön perustuvan kohdistetun mainonnan myötä käyttäjät etsivät yhä enemmän ratkaisuja, jotka asettavat heidän yksityisyytensä etusijalle. Forward Emailissa olemme rakentaneet palvelumme alusta alkaen siten, että yksityisyys on arkkitehtuurimme kulmakivi. Tämä blogikirjoitus tutkii teknisiä toteutuksia, jotka tekevät palvelustamme yhden kaikkein yksityisyyteen keskittyvistä sähköpostin edelleenlähetysratkaisuista.

## Sähköpostin edelleenlähetyksen tietosuojafilosofia {#the-forward-email-privacy-philosophy}

Ennen kuin syvennymme teknisiin yksityiskohtiin, on tärkeää ymmärtää perusperiaatteitamme yksityisyyden suojaan: **sähköpostisi kuuluvat sinulle ja vain sinulle**. Tämä periaate ohjaa kaikkia teknisiä päätöksiämme sähköpostin edelleenlähetyksestä salauksen toteuttamiseen.

Toisin kuin monet sähköpostipalveluntarjoajat, jotka skannaavat viestejäsi mainostarkoituksiin tai tallentavat niitä rajoituksetta palvelimilleen, Forward Email toimii radikaalisti erilaisella lähestymistavalla:

1. **Vain muistissa tapahtuvaa käsittelyä** - Emme tallenna edelleenlähetettyjä sähköpostejasi levylle
2. **Ei metatietojen tallennusta** - Emme pidä kirjaa siitä, kuka lähettää sähköpostia kenelle
3. **100 % avoimen lähdekoodin** - Koko koodikanta on läpinäkyvä ja auditoitavissa
4. **Päästä päähän -salaus** - Tuemme OpenPGP:tä todella yksityisen viestinnän takaamiseksi

## SQLite-toteutus: Tietojesi kestävyys ja siirrettävyys {#sqlite-implementation-durability-and-portability-for-your-data}

Yksi Forward Emailin merkittävimmistä yksityisyydensuojaeduista on huolellisesti suunniteltu [SQLite](https://en.wikipedia.org/wiki/SQLite) -toteutuksemme. Olemme hienosäätäneet SQLiteä erityisillä PRAGMA-asetuksilla ja [Eteenpäin kirjoitettava kirjaus (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) varmistaaksemme sekä tietojesi kestävyyden että siirrettävyyden säilyttäen samalla korkeimmat yksityisyyden ja turvallisuuden standardit.

Tässä katsaus siihen, miten olemme toteuttaneet SQLiten käyttäen [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) -koodia kvanttiresistentin salauksen salausmenetelmänä:

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

Tämä toteutus varmistaa, että tietosi ovat paitsi turvassa myös siirrettävissä. Voit ottaa sähköpostisi mukaasi milloin tahansa viemällä ne [MBOX](https://en.wikipedia.org/wiki/Email#Storage)-, [EML](https://en.wikipedia.org/wiki/Email#Storage)- tai SQLite-muodoissa. Ja kun haluat poistaa tietosi, ne ovat todellakin poissa – poistamme tiedostot vain levytallennustilasta SQL DELETE ROW -komentojen suorittamisen sijaan, jotka voivat jättää jälkiä tietokantaan.

Käyttöönottomme kvanttisalaus käyttää ChaCha20-Poly1305-salauksena tietokannan alustaessa, mikä tarjoaa vahvan suojan sekä nykyisiä että tulevia tietosuojaasi uhkaavia uhkia vastaan.

## Älykäs jonotus- ja uudelleenyritysmekanismi: Sähköpostin toimituksen varmistaminen {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Sen sijaan, että keskittyisimme pelkästään otsikoiden käsittelyyn, olemme ottaneet käyttöön hienostuneen älykkään jonotus- ja uudelleenyritysmekanismin `getBounceInfo` -menetelmällämme. Tämä järjestelmä varmistaa, että sähköposteillasi on parhaat mahdollisuudet perille, vaikka tilapäisiä ongelmia ilmenisi.

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

Yritämme postin toimitusta uudelleen viiden päivän ajan, alan standardien, kuten [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\), mukaisesti, antaen tilapäisille ongelmille aikaa ratkaista itsensä. Tämä lähestymistapa parantaa merkittävästi toimitusprosenttia ja samalla säilyttää yksityisyyden.

Samoin poistamme myös lähtevien SMTP-sähköpostien viestisisällön onnistuneen toimituksen jälkeen. Tämä on määritetty tallennusjärjestelmässämme oletusarvoiseksi 30 päivän säilytysajaksi, jota voit säätää verkkotunnuksesi lisäasetuksissa. Tämän ajanjakson jälkeen sähköpostin sisältö poistetaan ja tyhjennetään automaattisesti, ja jäljelle jää vain paikkamerkkiviesti:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Tämä lähestymistapa varmistaa, että lähettämiäsi sähköpostiviestejä ei säilytetä loputtomiin, mikä vähentää tietomurtojen tai luvattoman pääsyn riskiä viestintään.

## Rajattomat resurssit älykkäällä nopeudenrajoituksella {#unlimited-resources-with-intelligent-rate-limiting}

Vaikka Forward Email tarjoaa rajoittamattoman määrän verkkotunnuksia ja aliaksia, olemme ottaneet käyttöön älykkään nopeusrajoituksen suojellaksemme järjestelmäämme väärinkäytöksiltä ja varmistaaksemme oikeudenmukaisen käytön kaikille käyttäjille. Esimerkiksi muut kuin yritysasiakkaat voivat luoda jopa 50+ aliasta päivässä, mikä estää tietokantaamme joutumasta roskapostiin ja tulviin ja mahdollistaa reaaliaikaisten väärinkäyttö- ja suojausominaisuuksiemme toiminnan tehokkaasti.

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

Tämä tasapainoinen lähestymistapa tarjoaa sinulle joustavuuden luoda niin monta sähköpostiosoitetta kuin tarvitset kattavaan tietosuojan hallintaan, samalla kun säilytät palvelumme eheyden ja suorituskyvyn kaikille käyttäjille.

## Hiekkalaatikkosalaus parannetun turvallisuuden takaamiseksi {#sandboxed-encryption-for-enhanced-security}

Ainutlaatuinen hiekkalaatikkosalaustapamme tarjoaa kriittisen tietoturvaedun, jonka monet käyttäjät jättävät huomiotta valitessaan sähköpostipalvelua. Tutkitaan, miksi hiekkalaatikkotiedot, erityisesti sähköposti, ovat niin tärkeitä.

Palvelut, kuten Gmail ja Proton, käyttävät todennäköisesti jaettua [relaatiotietokannat](https://en.wikipedia.org/wiki/Relational_database) -linkkiä, mikä luo perustavanlaatuisen tietoturvahaavoittuvuuden. Jaetussa tietokantaympäristössä, jos joku saa pääsyn yhden käyttäjän tietoihin, hänellä on mahdollisesti polku myös muiden käyttäjien tietoihin. Tämä johtuu siitä, että kaikki käyttäjätiedot sijaitsevat samoissa tietokantataulukoissa, eroteltuina toisistaan vain käyttäjätunnuksilla tai vastaavilla tunnisteilla.

Sähköpostin edelleenlähetys käyttää täysin erilaista lähestymistapaa hiekkalaatikkosalauksellamme:

1. **Täydellinen eristäminen**: Jokaisen käyttäjän tiedot tallennetaan omaan salattuun SQLite-tietokantatiedostoonsa, täysin erillään muista käyttäjistä.
2. **Itsenäiset salausavaimet**: Jokainen tietokanta salataan omalla yksilöllisellä avaimellaan, joka on johdettu käyttäjän salasanasta.
3. **Ei jaettua tallennustilaa**: Toisin kuin relaatiotietokannoissa, joissa kaikkien käyttäjien sähköpostit voivat olla yhdessä "sähköpostit"-taulukossa, lähestymistapamme varmistaa, ettei tiedot sekoitu.
4. **Syvyysaikainen puolustus**: Vaikka yhden käyttäjän tietokanta jotenkin vaarantuisi, se ei tarjoa pääsyä minkään muun käyttäjän tietoihin.

Tämä hiekkalaatikkolähestymistapa on samanlainen kuin sähköpostisi sijoittaminen erilliseen fyysiseen holviin eikä jaettuun tallennustilaan, jossa on sisäiset jakajat. Se on perustavanlaatuinen arkkitehtoninen ero, joka parantaa merkittävästi yksityisyyttäsi ja turvallisuuttasi.

## Muistissa oleva sähköpostin käsittely: Ei levytilaa maksimaalisen yksityisyyden takaamiseksi {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Sähköpostin välityspalvelussa käsittelemme sähköpostit kokonaan RAM-muistissa emmekä koskaan kirjoita niitä levymuistiin tai tietokantoihin. Tämä lähestymistapa tarjoaa vertaansa vailla olevan suojan sähköpostin valvontaa ja metatietojen keräämistä vastaan.

Tässä on yksinkertaistettu katsaus sähköpostin käsittelyyn:

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

Tämä lähestymistapa tarkoittaa, että vaikka palvelimemme vaarantuisivat, hyökkääjillä ei olisi historiallisia sähköpostitietoja. Sähköpostisi yksinkertaisesti kulkevat järjestelmämme läpi ja välitetään välittömästi määränpäähänsä jättämättä jälkiä. Tämä kirjautumaton sähköpostin edelleenlähetystapa on keskeinen viestintäsi suojaamisessa valvonnalta.

## Päästä päähän -salaus OpenPGP:llä täydellisen yksityisyyden takaamiseksi {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Käyttäjille, jotka tarvitsevat korkeimman tason yksityisyyden suojaa sähköpostin valvontaa vastaan, tuemme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) -protokollaa päästä päähän -salaukseen. Toisin kuin monet sähköpostipalveluntarjoajat, jotka vaativat omia siltoja tai sovelluksia, toteutuksemme toimii tavallisten sähköpostiohjelmien kanssa, mikä tekee turvallisesta viestinnästä kaikkien saatavilla.

Näin toteutamme OpenPGP-salauksen:

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

Tämä toteutus varmistaa, että sähköpostisi salataan ennen kuin ne lähtevät laitteestasi ja että vain aiottu vastaanottaja voi purkaa salauksen, jolloin viestintäsi pysyy yksityisenä jopa meiltä. Tämä on välttämätöntä arkaluonteisen viestinnän suojaamiseksi luvattomalta käytöltä ja valvonnalta.

## Monikerroksinen sisällönsuojaus kattavaa turvallisuutta varten {#multi-layered-content-protection-for-comprehensive-security}

Välitä sähköposti tarjoaa useita sisällön suojaustasoja, jotka ovat oletuksena käytössä kattavan suojan tarjoamiseksi eri uhkia vastaan:

1. **Aikuisille suunnatun sisällön suojaus** – Suodattaa pois sopimattoman sisällön vaarantamatta yksityisyyttä
2. **[Tietojenkalastelu](https://en.wikipedia.org/wiki/Phishing) suojaus** – Estää tietojesi varastamisyritykset säilyttäen samalla anonymiteetin
3. **Suoritettavien tiedostojen suojaus** – Estää mahdollisesti haitalliset liitteet tarkistamatta sisältöä
4. **[Virus](https://en.wikipedia.org/wiki/Computer_virus) suojaus** – Tarkistaa haittaohjelmien varalta yksityisyyttä suojaavilla tekniikoilla

Toisin kuin monet palveluntarjoajat, jotka ottavat nämä ominaisuudet käyttöön, olemme poistaneet ne käytöstä varmistaen, että kaikki käyttäjät hyötyvät oletusarvoisesti näistä suojauksista. Tämä lähestymistapa kuvastaa sitoutumistamme sekä yksityisyyteen että turvallisuuteen ja tarjoaa tasapainon, jota monet sähköpostipalvelut eivät saavuta.

## Miten eroamme muista sähköpostipalveluista: Tekninen tietosuojaetu {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Verrattaessa sähköpostin edelleenlähetystä muihin sähköpostipalveluihin, useat keskeiset tekniset erot korostavat tietosuojaa etusijalla olevaa lähestymistapaamme:

### Avoimen lähdekoodin läpinäkyvyys todennettavan yksityisyyden takaamiseksi {#open-source-transparency-for-verifiable-privacy}

Vaikka monet sähköpostipalveluntarjoajat väittävät olevansa avoimen lähdekoodin tarjoajia, he usein pitävät taustakoodinsa suljettuna. Forward Email on 100 % [avoimen lähdekoodin](https://en.wikipedia.org/wiki/Open_source) suojattu, mukaan lukien sekä käyttöliittymän että taustakoodin. Tämä läpinäkyvyys mahdollistaa kaikkien komponenttien riippumattoman tietoturvatarkastuksen, mikä varmistaa, että kuka tahansa voi vahvistaa tietosuojaväitteemme.

### Ei toimittajasidonnaisuutta yksityisyyden suojaan ilman kompromisseja {#no-vendor-lock-in-for-privacy-without-compromise}

Monet yksityisyyteen keskittyvät sähköpostipalveluntarjoajat edellyttävät omien sovellustensa tai siltojensa käyttöä. Forward Email toimii minkä tahansa tavallisen sähköpostiohjelman kanssa [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)-, [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)- ja [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)-protokollien kautta, mikä antaa sinulle vapauden valita haluamasi sähköpostiohjelmiston tinkimättä yksityisyydestä.

### Hiekkalaatikkodataa todelliseen eristämiseen {#sandboxed-data-for-true-isolation}

Toisin kuin palvelut, jotka käyttävät jaettuja tietokantoja, joissa kaikki käyttäjien tiedot sekoitetaan, hiekkalaatikkomenetelmämme varmistaa, että jokaisen käyttäjän tiedot ovat täysin eristettyjä. Tämä perustavanlaatuinen arkkitehtoninen ero tarjoaa huomattavasti vahvemmat tietosuojatakuut kuin useimmat sähköpostipalvelut tarjoavat.

### Tietojen siirrettävyys ja hallinta {#data-portability-and-control}

Uskomme, että tietosi kuuluvat sinulle, minkä vuoksi helpotamme sähköpostien vientiä vakiomuodoissa (MBOX, EML, SQLite) ja poistamme tietosi todella halutessasi. Tämän tason hallinta on harvinaista sähköpostipalveluntarjoajien keskuudessa, mutta se on välttämätöntä todellisen yksityisyyden kannalta.

## Yksityisyyden suojaan keskittyvän sähköpostin edelleenlähetyksen tekniset haasteet {#the-technical-challenges-of-privacy-first-email-forwarding}

Yksityisyys etusijalla olevan sähköpostipalvelun rakentamiseen liittyy merkittäviä teknisiä haasteita. Tässä on joitain esteitä, jotka olemme voitettu:

### Muistinhallinta lokikirjaamattomaan sähköpostien käsittelyyn {#memory-management-for-no-logging-email-processing}

Sähköpostien käsittely muistissa ilman levytilaa vaatii huolellista muistinhallintaa, jotta suuria sähköpostiliikennemääriä voidaan käsitellä tehokkaasti. Olemme ottaneet käyttöön kehittyneitä muistin optimointitekniikoita varmistaaksemme luotettavan suorituskyvyn tinkimättä tallennuskieltokäytännöstämme, joka on tärkeä osa tietosuojastrategiaamme.

### Roskapostin tunnistus ilman sisällön analysointia yksityisyyttä suojaavaa suodatusta varten {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Useimmat [roskaposti](https://en.wikipedia.org/wiki/Email_spam) -tunnistusjärjestelmät perustuvat sähköpostisisällön analysointiin, mikä on ristiriidassa tietosuojaperiaatteidemme kanssa. Olemme kehittäneet tekniikoita roskapostikuvioiden tunnistamiseksi ilman sähköpostiesi sisällön lukemista, mikä tasapainottaa yksityisyyden ja käytettävyyden ja säilyttää viestintäsi luottamuksellisuuden.

### Yhteensopivuuden ylläpitäminen yksityisyyttä ensisijaisen suunnittelun kanssa {#maintaining-compatibility-with-privacy-first-design}

Yhteensopivuuden varmistaminen kaikkien sähköpostiohjelmien kanssa edistyneiden tietosuojaominaisuuksien käyttöönoton yhteydessä on vaatinut luovia suunnitteluratkaisuja. Tiimimme on työskennellyt väsymättä tehdäkseen yksityisyydestä saumattoman, joten sinun ei tarvitse valita mukavuuden ja turvallisuuden välillä suojellessasi sähköpostiviestintääsi.

## Tietosuojakäytännöt sähköpostin edelleenlähetyskäyttäjille {#privacy-best-practices-for-forward-email-users}

Suosittelemme seuraavia parhaita käytäntöjä, jotta voit maksimoida suojauksesi sähköpostin valvonnalta ja maksimoidaksesi yksityisyytesi edelleenlähetyssähköpostin käytön aikana:

1. **Käytä eri palveluille yksilöllisiä aliaksia** - Luo jokaiselle rekisteröidylle palvelulle eri sähköpostialias estääksesi palveluiden välisen seurannan.
2. **Ota käyttöön OpenPGP-salaus** - Käytä arkaluonteisessa viestinnässä päästä päähän -salausta täydellisen yksityisyyden varmistamiseksi.
3. **Vaihda sähköpostialiaksiasi säännöllisesti** - Päivitä tärkeiden palveluiden aliakset säännöllisesti pitkäaikaisen tiedonkeruun minimoimiseksi.
4. **Käytä vahvoja, yksilöllisiä salasanoja** - Suojaa sähköpostin edelleenlähetystilisi vahvalla salasanalla luvattoman käytön estämiseksi.
5. **Ota käyttöön [IP-osoite](https://en.wikipedia.org/wiki/IP_address) anonymisointi** - Harkitse [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) käyttöä yhdessä sähköpostin edelleenlähetyksen kanssa täydellisen anonymiteetin saavuttamiseksi.

## Yhteenveto: Yksityisten sähköpostien edelleenlähetyksen tulevaisuus {#conclusion-the-future-of-private-email-forwarding}

Me Forward Emailissa uskomme, että yksityisyys ei ole vain ominaisuus – se on perusoikeus. Tekniset toteutuksemme heijastavat tätä uskomusta tarjoamalla sinulle sähköpostin edelleenlähetyksen, joka kunnioittaa yksityisyyttäsi kaikilla tasoilla ja suojaa sinua sähköpostin valvonnalta ja metatietojen keräämiseltä.

Kun jatkamme palvelumme kehittämistä ja parantamista, sitoutumisemme yksityisyyteen pysyy horjumattomana. Tutkimme jatkuvasti uusia salausmenetelmiä, tutkimme lisää yksityisyyden suojauksia ja tarkennamme koodikantaamme tarjotaksemme turvallisimman mahdollisen sähköpostikokemuksen.

Valitsemalla Lähetä edelleen sähköposti et valitse vain sähköpostipalvelua, vaan tuet visiota Internetistä, jossa tietosuoja on oletusarvo, ei poikkeus. Liity kanssamme rakentamaan yksityisempää digitaalista tulevaisuutta, yksi sähköposti kerrallaan.

<!-- *Avainsanat: yksityinen sähköpostin edelleenlähetys, sähköpostin yksityisyyden suojaus, turvallinen sähköpostipalvelu, avoimen lähdekoodin sähköposti, kvanttiturvallinen salaus, OpenPGP-sähköposti, muistissa oleva sähköpostin käsittely, lokiton sähköpostipalvelu, sähköpostin metatietojen suojaus, sähköpostin otsikon yksityisyys, päästä päähän salattu sähköposti, yksityisyyttä ensin huomioiva sähköposti, anonyymi sähköpostin edelleenlähetys, sähköpostin tietoturvan parhaat käytännöt, sähköpostin sisällön suojaus, tietojenkalastelusuojaus, sähköpostin virustarkistus, yksityisyyteen keskittyvä sähköpostipalveluntarjoaja, turvalliset sähköpostin otsikot, sähköpostin yksityisyyden toteutus, suojaus sähköpostin valvonnalta, lokiton sähköpostin edelleenlähetys, sähköpostin metatietojen vuotamisen estäminen, sähköpostin yksityisyystekniikat, IP-osoitteen anonymisointi sähköpostissa, yksityiset sähköpostialiakset, sähköpostin edelleenlähetyksen turvallisuus, sähköpostin yksityisyys mainostajilta, kvanttisuojattu sähköpostin salaus, sähköpostin yksityisyys ilman kompromisseja, SQLite-sähköpostin tallennustila, sähköpostin hiekkalaatikkosalaus, sähköpostin tietojen siirrettävyys* -->