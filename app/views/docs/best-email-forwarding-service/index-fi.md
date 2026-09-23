# Kuinka Forward Email suojaa yksityisyyttäsi, domainiasi ja turvallisuuttasi: Tekninen syväluotaus {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<!-- <img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Paras sähköpostin edelleenlähetyspalveluvertailu" class="rounded-lg" /> -->


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Forward Emailin yksityisyysfilosofia](#the-forward-email-privacy-philosophy)
* [SQLite-toteutus: Tietojesi kestävyys ja siirrettävyys](#sqlite-implementation-durability-and-portability-for-your-data)
* [Älykäs jono ja uudelleenyritysmekanismi: Sähköpostin toimituksen varmistaminen](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Rajoittamaton resurssien käyttö älykkäällä nopeudenrajoituksella](#unlimited-resources-with-intelligent-rate-limiting)
* [Suojaus hiekkalaatikossa parannetun turvallisuuden takaamiseksi](#sandboxed-encryption-for-enhanced-security)
* [Muistissa tapahtuva sähköpostinkäsittely: Ei levyvarastointia maksimaalisen yksityisyyden takaamiseksi](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Päästä päähän -salauksen OpenPGP:llä täydelliseen yksityisyyteen](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Monikerroksinen sisällön suojaus kattavaan turvallisuuteen](#multi-layered-content-protection-for-comprehensive-security)
* [Miten eroamme muista sähköpostipalveluista: Tekninen yksityisyysetu](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Avoimen lähdekoodin läpinäkyvyys varmennettuun yksityisyyteen](#open-source-transparency-for-verifiable-privacy)
  * [Ei toimittajalukkoa kompromisseitta yksityisyydestä](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Hiekkalaatikkoon eristetyt tiedot todelliseen eristykseen](#sandboxed-data-for-true-isolation)
  * [Tietojen siirrettävyys ja hallinta](#data-portability-and-control)
* [Yksityisyyttä korostavan sähköpostin edelleenlähetyksen tekniset haasteet](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Muistinhallinta lokittomalle sähköpostinkäsittelylle](#memory-management-for-no-logging-email-processing)
  * [Roskapostin tunnistus ilman sisällön analysointia yksityisyyttä suojaavassa suodatuksessa](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Yhteensopivuuden ylläpito yksityisyyttä korostavassa suunnittelussa](#maintaining-compatibility-with-privacy-first-design)
* [Yksityisyyden parhaat käytännöt Forward Emailin käyttäjille](#privacy-best-practices-for-forward-email-users)
* [Yhteenveto: Yksityisen sähköpostin edelleenlähetyksen tulevaisuus](#conclusion-the-future-of-private-email-forwarding)


## Esipuhe {#foreword}

Nykyisessä digitaalisessa ympäristössä sähköpostin yksityisyys on tärkeämpää kuin koskaan. Tietomurtojen, valvontahuolien ja sähköpostisisältöön perustuvan kohdennetun mainonnan vuoksi käyttäjät etsivät yhä enemmän ratkaisuja, jotka asettavat yksityisyyden etusijalle. Forward Emailissa olemme rakentaneet palvelumme alusta alkaen yksityisyyden ollessa arkkitehtuurimme kulmakivi. Tässä blogikirjoituksessa tarkastelemme teknisiä toteutuksia, jotka tekevät palvelustamme yhden yksityisyyteen keskittyneimmistä sähköpostin edelleenlähetysratkaisuista.


## Forward Emailin yksityisyysfilosofia {#the-forward-email-privacy-philosophy}

Ennen teknisiin yksityiskohtiin sukeltamista on tärkeää ymmärtää perusperiaatteemme yksityisyydestä: **sähköpostisi kuuluvat sinulle ja vain sinulle**. Tämä periaate ohjaa jokaista teknistä päätöstämme, siitä miten käsittelemme sähköpostin edelleenlähetystä aina salauksen toteutukseen asti.

Toisin kuin monet sähköpostipalveluntarjoajat, jotka skannaavat viestejäsi mainostarkoituksiin tai säilyttävät niitä loputtomasti palvelimillaan, Forward Email toimii radikaalisti eri tavalla:

1. **Pelkkä muistissa tapahtuva käsittely** – Emme tallenna edelleenlähetettyjä sähköpostejasi levylle
2. **Ei metatietojen tallennusta** – Emme pidä kirjaa siitä, kuka lähettää kenelle
3. **100 % avoin lähdekoodi** – Koko koodipohjamme on läpinäkyvä ja auditoitavissa
4. **Päästä päähän -salaukset** – Tuemme OpenPGP:tä aidosti yksityisiin viestintään


## SQLite-toteutus: Tietojesi kestävyys ja siirrettävyys {#sqlite-implementation-durability-and-portability-for-your-data}

Yksi merkittävimmistä yksityisyysetuistamme on huolellisesti suunniteltu [SQLite](https://en.wikipedia.org/wiki/SQLite) -toteutuksemme. Olemme hienosäätäneet SQLitea erityisillä PRAGMA-asetuksilla ja [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) -tekniikalla varmistaaksemme tietojesi kestävyyden ja siirrettävyyden, samalla kun ylläpidämme korkeimpia yksityisyyden ja turvallisuuden standardeja.
Tässä on katsaus siihen, miten olemme toteuttaneet SQLite:n käyttäen [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) -salausta kvanttivarmana salausmenetelmänä:

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

Tämä toteutus varmistaa, että tietosi eivät ole ainoastaan suojattuja, vaan myös siirrettäviä. Voit viedä sähköpostisi ja lähteä milloin tahansa [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) tai SQLite-muodoissa. Ja kun haluat poistaa tietosi, ne ovat todella poissa – poistamme tiedostot suoraan levyasemalta sen sijaan, että suorittaisimme SQL DELETE ROW -komentoja, jotka voivat jättää jälkiä tietokantaan.

Kvanttisalauspuoli toteutuksessamme käyttää ChaCha20-Poly1305-salausta, kun alustamme tietokannan, tarjoten vahvan suojan sekä nykyisiä että tulevia uhkia vastaan tietosuojallesi.


## Älykäs jono ja uudelleenyritysmekanismi: Sähköpostin toimituksen varmistaminen {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Sen sijaan, että keskitymme pelkästään otsikoiden käsittelyyn, olemme toteuttaneet kehittyneen älykkään jonon ja uudelleenyritysmekanismin `getBounceInfo`-metodillamme. Tämä järjestelmä varmistaa, että sähköpostisi saavat parhaan mahdollisen toimitusmahdollisuuden, vaikka tilapäisiä ongelmia ilmenisi.

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
> Tämä on ote `getBounceInfo`-metodista, ei koko laajaa toteutusta. Koko koodin voit tarkistaa [GitHubista](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Yritämme toimittaa sähköpostia uudelleen 5 päivän ajan, kuten alan standardit, esimerkiksi [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), antaen tilapäisille ongelmille aikaa ratketa. Tämä lähestymistapa parantaa merkittävästi toimitusprosentteja samalla kun yksityisyys säilyy.

Samoin poistamme lähtevien SMTP-sähköpostien viestisisällön toimituksen jälkeen. Tämä on määritelty tallennusjärjestelmässämme oletuksena 30 päivän säilytysajalla, jonka voit muuttaa verkkotunnuksesi Lisäasetuksissa. Tämän ajan jälkeen sähköpostin sisältö poistetaan automaattisesti ja puhdistetaan, jäljelle jää vain paikkamerkki:

```txt
Tämä viesti lähetettiin onnistuneesti. Se on poistettu ja puhdistettu turvallisuutesi ja yksityisyytesi vuoksi. Jos haluat pidentää viestiesi säilytysaikaa, siirry verkkotunnuksesi Lisäasetukset-sivulle.
```
Tämä lähestymistapa varmistaa, että lähettämäsi sähköpostit eivät jää tallennetuiksi ikuisesti, mikä vähentää tietomurtojen tai luvattoman pääsyn riskiä viestintääsi.


## Rajoittamaton resurssit älykkäällä nopeudenrajoituksella {#unlimited-resources-with-intelligent-rate-limiting}

Vaikka Forward Email tarjoaa rajattomasti domaineja ja aliaksia, olemme ottaneet käyttöön älykkään nopeudenrajoituksen suojellaksemme järjestelmäämme väärinkäytöksiltä ja varmistaaksemme reilun käytön kaikille käyttäjille. Esimerkiksi ei-yrityskäyttäjät voivat luoda yli 50 aliasta päivässä, mikä estää tietokantamme roskapostittamisen ja ylikuormittamisen sekä mahdollistaa reaaliaikaisten väärinkäytösten ja suojauksen toimintojen tehokkaan toiminnan.

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

Tämä tasapainoinen lähestymistapa antaa sinulle joustavuutta luoda niin monta sähköpostiosoitetta kuin tarvitset kattavaan yksityisyyden hallintaan, samalla kun säilytämme palvelumme eheyden ja suorituskyvyn kaikille käyttäjille.


## Hiekkalaatikko-salaus parannetun turvallisuuden takaamiseksi {#sandboxed-encryption-for-enhanced-security}

Ainutlaatuinen hiekkalaatikko-salausmenetelmämme tarjoaa kriittisen turvallisuusedun, jonka monet käyttäjät unohtavat valitessaan sähköpostipalvelua. Tarkastellaanpa, miksi datan, erityisesti sähköpostin, hiekkalaatikkoistaminen on niin tärkeää.

Palvelut kuten Gmail ja Proton käyttävät todennäköisesti jaettuja [relaatiotietokantoja](https://en.wikipedia.org/wiki/Relational_database), mikä luo perustavanlaatuisen turvallisuusaukkojen riskin. Jaetussa tietokantaympäristössä, jos joku saa pääsyn yhden käyttäjän tietoihin, hänellä on potentiaalinen reitti päästä käsiksi myös muiden käyttäjien tietoihin. Tämä johtuu siitä, että kaikki käyttäjätiedot sijaitsevat samoissa tietokantatauluissa, eroteltuna vain käyttäjätunnuksilla tai vastaavilla tunnisteilla.

Forward Email lähestyy asiaa täysin eri tavalla hiekkalaatikko-salauksellamme:

1. **Täydellinen eristys**: Jokaisen käyttäjän tiedot tallennetaan omaan salattuun SQLite-tietokantatiedostoon, täysin erillään muista käyttäjistä
2. **Itsenäiset salausavaimet**: Jokainen tietokanta on salattu omalla ainutlaatuisella avaimellaan, joka johdetaan käyttäjän salasanasta
3. **Ei jaettua tallennustilaa**: Toisin kuin relaatiotietokannoissa, joissa kaikkien käyttäjien sähköpostit voivat olla yhdessä "emails"-taulussa, lähestymistapamme varmistaa, ettei tietoja sekoiteta
4. **Syvällinen puolustus**: Vaikka yhden käyttäjän tietokanta jostain syystä vaarantuisi, se ei tarjoa pääsyä muiden käyttäjien tietoihin

Tämä hiekkalaatikkomalli on verrattavissa siihen, että sähköpostisi olisi erillisessä fyysisessä holvissa eikä jaetussa varastotilassa sisäisillä väliseinillä. Se on perustavanlaatuinen arkkitehtoninen ero, joka parantaa merkittävästi yksityisyyttäsi ja turvallisuuttasi.


## Muistissa tapahtuva sähköpostinkäsittely: Ei levytilaa maksimaalisen yksityisyyden takaamiseksi {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Sähköpostin edelleenlähetyspalvelussamme käsittelemme sähköpostit kokonaan RAM-muistissa emmekä koskaan kirjoita niitä levylle tai tietokantoihin. Tämä lähestymistapa tarjoaa vertaansa vailla olevan suojan sähköpostin valvontaa ja metatietojen keruuta vastaan.

Tässä yksinkertaistettu kuvaus siitä, miten sähköpostinkäsittelymme toimii:

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
Tämä lähestymistapa tarkoittaa, että vaikka palvelimemme joutuisivatkin vaarantuneiksi, hyökkääjillä ei olisi pääsyä historiallisiin sähköpostitietoihin. Sähköpostisi kulkevat yksinkertaisesti järjestelmämme läpi ja välitetään välittömästi määränpäähänsä jättämättä jälkiä. Tämä lokittamaton sähköpostin välitystapa on keskeinen viestiesi suojaamisessa valvonnalta.


## Päästä päähän -salauksen OpenPGP:llä täydelliseen yksityisyyteen {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Käyttäjille, jotka tarvitsevat korkeimman tason yksityisyyden suojan sähköpostivalvonnalta, tuemme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) -päästä päähän -salausta. Toisin kuin monet sähköpostipalveluntarjoajat, jotka vaativat omia siltoja tai sovelluksia, toteutuksemme toimii tavallisten sähköpostiohjelmien kanssa, tehden turvallisesta viestinnästä kaikkien saavutettavissa olevaa.

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

Tämä toteutus varmistaa, että sähköpostisi salataan ennen kuin ne lähtevät laitteeltasi, ja ne voi purkaa vain tarkoitettu vastaanottaja, pitäen viestisi yksityisinä myös meiltä. Tämä on olennaista arkaluontoisten viestien suojaamiseksi luvattomalta pääsyltä ja valvonnalta.


## Monikerroksinen sisällön suojaus kattavaan turvallisuuteen {#multi-layered-content-protection-for-comprehensive-security}

Forward Email tarjoaa useita sisällön suojaustasoja, jotka ovat oletuksena käytössä tarjoten kattavan suojan erilaisia uhkia vastaan:

1. **Aikuisviestien suojaus** – Suodattaa sopimattoman sisällön vaarantamatta yksityisyyttä
2. **[Tietojenkalastelun](https://en.wikipedia.org/wiki/Phishing) suojaus** – Estää yritykset varastaa tietojasi säilyttäen anonymiteetin
3. **Suoritettavien tiedostojen suojaus** – Estää mahdollisesti haitalliset liitteet ilman sisällön skannausta
4. **[Virusten](https://en.wikipedia.org/wiki/Computer_virus) suojaus** – Tarkistaa haittaohjelmat yksityisyyttä kunnioittavin menetelmin

Toisin kuin monet palveluntarjoajat, jotka tekevät nämä ominaisuudet valinnaisiksi, me olemme tehneet ne oletuksena päällä oleviksi, varmistaen että kaikki käyttäjät hyötyvät näistä suojauksista automaattisesti. Tämä lähestymistapa heijastaa sitoutumistamme sekä yksityisyyteen että turvallisuuteen tarjoten tasapainon, jota monet sähköpostipalvelut eivät saavuta.


## Miten eroamme muista sähköpostipalveluista: tekninen yksityisyysetu {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Kun vertaamme Forward Emailia muihin sähköpostipalveluihin, useat keskeiset tekniset erot korostavat yksityisyyttä ensisijaisesti painottavaa lähestymistapaamme:

### Avoimen lähdekoodin läpinäkyvyys varmennettuun yksityisyyteen {#open-source-transparency-for-verifiable-privacy}

Vaikka monet sähköpostipalveluntarjoajat väittävät olevansa avoimen lähdekoodin, he usein pitävät taustakoodinsa suljettuna. Forward Email on 100 % [avoin lähdekoodi](https://en.wikipedia.org/wiki/Open_source), sisältäen sekä käyttöliittymän että taustajärjestelmän koodin. Tämä läpinäkyvyys mahdollistaa riippumattoman turvallisuustarkastuksen kaikista osista, varmistaen että yksityisyysväitteemme voidaan kuka tahansa tarkistaa.

### Ei toimittajalukkoa yksityisyyteen ilman kompromisseja {#no-vendor-lock-in-for-privacy-without-compromise}

Monet yksityisyyteen keskittyvät sähköpostipalveluntarjoajat vaativat käyttämään heidän omia sovelluksiaan tai siltojaan. Forward Email toimii minkä tahansa tavallisen sähköpostiohjelman kanssa [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) ja [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) -protokollien kautta, antaen sinulle vapauden valita suosikkisähköpostiohjelmasi ilman yksityisyyden vaarantamista.
### Sandboxed Data for True Isolation {#sandboxed-data-for-true-isolation}

Toisin kuin palvelut, jotka käyttävät jaettuja tietokantoja, joissa kaikkien käyttäjien tiedot ovat sekoittuneet, meidän sandbox-lähestymistapamme varmistaa, että jokaisen käyttäjän tiedot ovat täysin eristettyjä. Tämä perustavanlaatuinen arkkitehtoninen ero tarjoaa merkittävästi vahvemmat yksityisyystakuut kuin mitä useimmat sähköpostipalvelut tarjoavat.

### Data Portability and Control {#data-portability-and-control}

Uskomme, että tietosi kuuluvat sinulle, minkä vuoksi teemme sähköpostiesi vientiin standardimuodoissa (MBOX, EML, SQLite) helppoa ja mahdollistamme tietojesi todellisen poistamisen silloin kun haluat. Tämä hallinnan taso on harvinaista sähköpostipalveluntarjoajien keskuudessa, mutta olennaista aidon yksityisyyden kannalta.


## The Technical Challenges of Privacy-First Email Forwarding {#the-technical-challenges-of-privacy-first-email-forwarding}

Yksityisyyttä korostavan sähköpostin edelleenlähetyspalvelun rakentaminen tuo mukanaan merkittäviä teknisiä haasteita. Tässä joitakin esteitä, jotka olemme voittaneet:

### Memory Management for No-Logging Email Processing {#memory-management-for-no-logging-email-processing}

Sähköpostien käsittely muistissa ilman levytallennusta vaatii huolellista muistin hallintaa, jotta suuri sähköpostiliikenne voidaan käsitellä tehokkaasti. Olemme toteuttaneet edistyneitä muistin optimointitekniikoita varmistaaksemme luotettavan suorituskyvyn ilman tallennuskäytäntöjemme rikkomista, mikä on keskeinen osa yksityisyyden suojausstrategiaamme.

### Spam Detection Without Content Analysis for Privacy-Preserving Filtering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Useimmat [roskapostin](https://en.wikipedia.org/wiki/Email_spam) tunnistusjärjestelmät perustuvat sähköpostin sisällön analysointiin, mikä on ristiriidassa yksityisyysperiaatteidemme kanssa. Olemme kehittäneet tekniikoita roskapostimallien tunnistamiseen lukematta sähköpostiesi sisältöä, saavuttaen tasapainon yksityisyyden ja käytettävyyden välillä, joka säilyttää viestiesi luottamuksellisuuden.

### Maintaining Compatibility with Privacy-First Design {#maintaining-compatibility-with-privacy-first-design}

Yhteensopivuuden varmistaminen kaikkien sähköpostiohjelmien kanssa samalla kun toteutetaan edistyneitä yksityisyysominaisuuksia on vaatinut luovia insinööriratkaisuja. Tiimimme on työskennellyt väsymättä tehdäkseen yksityisyydestä saumattoman, jotta sinun ei tarvitse valita mukavuuden ja turvallisuuden välillä suojatessasi sähköpostiviestintääsi.


## Privacy Best Practices for Forward Email Users {#privacy-best-practices-for-forward-email-users}

Sähköpostivalvontaa vastaan suojautumisen maksimoimiseksi ja yksityisyytesi parantamiseksi Forward Emailin käytössä suosittelemme seuraavia parhaita käytäntöjä:

1. **Käytä uniikkeja aliaksia eri palveluille** - Luo eri sähköpostialias jokaiselle palvelulle, johon rekisteröidyt, estääksesi palveluiden välisen seurannan
2. **Ota käyttöön OpenPGP-salaus** - Herkissä viesteissä käytä päästä-päähän salausta varmistaaksesi täydellisen yksityisyyden
3. **Kierrätä sähköpostialiasiasi säännöllisesti** - Päivitä aliasit tärkeille palveluille ajoittain minimoidaksesi pitkäaikaisen tietojen keruun
4. **Käytä vahvoja, uniikkeja salasanoja** - Suojaa Forward Email -tilisi vahvalla salasanalla estääksesi luvattoman pääsyn
5. **Ota käyttöön [IP-osoitteen](https://en.wikipedia.org/wiki/IP_address) anonymisointi** - Harkitse [VPN:n](https://en.wikipedia.org/wiki/Virtual_private_network) käyttöä yhdessä Forward Emailin kanssa täydellisen anonymiteetin saavuttamiseksi


## Conclusion: The Future of Private Email Forwarding {#conclusion-the-future-of-private-email-forwarding}

Forward Emaililla uskomme, että yksityisyys ei ole vain ominaisuus — se on perusoikeus. Tekninen toteutuksemme heijastaa tätä uskomusta tarjoten sinulle sähköpostin edelleenlähetyksen, joka kunnioittaa yksityisyyttäsi kaikilla tasoilla ja suojaa sinua sähköpostivalvonnalta ja metatietojen keruulta.

Jatkaessamme palvelumme kehittämistä ja parantamista sitoutumisemme yksityisyyteen pysyy horjumattomana. Tutkimme jatkuvasti uusia salausmenetelmiä, tutkimme lisäyksityisyyden suojakeinoja ja hiomme koodipohjaamme tarjotaksemme mahdollisimman turvallisen sähköpostikokemuksen.

Valitsemalla Forward Emailin et valitse pelkästään sähköpostipalvelua — tuet internetin visiota, jossa yksityisyys on oletus, ei poikkeus. Liity mukaan rakentamaan yksityisempää digitaalista tulevaisuutta, yksi sähköposti kerrallaan.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

