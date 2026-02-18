# Kvanttisuojattu sähköposti: Kuinka käytämme salattuja SQLite-postilaatikoita sähköpostisi turvaamiseen {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Sähköpostipalveluntarjoajien vertailu](#email-service-provider-comparison)
* [Miten se toimii](#how-does-it-work)
* [Teknologiat](#technologies)
  * [Tietokannat](#databases)
  * [Turvallisuus](#security)
  * [Postilaatikot](#mailboxes)
  * [Samanaikaisuus](#concurrency)
  * [Varmuuskopiot](#backups)
  * [Haku](#search)
  * [Projektit](#projects)
  * [Palveluntarjoajat](#providers)
* [Ajatuksia](#thoughts)
  * [Periaatteet](#principles)
  * [Kokeet](#experiments)
  * [Vaihtoehtojen puute](#lack-of-alternatives)
  * [Kokeile sähköpostin edelleenlähetystä](#try-out-forward-email)

## Esipuhe {#foreword}

> \[!IMPORTANT]
> Sähköpostipalvelumme on [100 % avoimen lähdekoodin](https://github.com/forwardemail) ja yksityisyyteen keskittyvä suojattujen ja salattujen SQLite-postilaatikoiden kautta.

Ennen [IMAP-tuki](/faq#do-you-support-receiving-email-with-imap):n julkaisua käytimme MongoDB:tä pysyvien tietojen tallennustarpeisiimme.

Tämä teknologia on hämmästyttävä ja käytämme sitä edelleen – mutta jotta MongoDB:n salaus olisi levossa, sinun on käytettävä MongoDB Enterprisea tarjoavaa toimittajaa, kuten Digital Oceania tai Mongo Atlasia – tai maksettava yrityslisenssistä (ja sen seurauksena joudut työskentelemään myyntitiimin viiveen kanssa).

[Lähetä sähköpostia eteenpäin](https://forwardemail.net)-tiimimme tarvitsi kehittäjäystävällisen, skaalautuvan, luotettavan ja salatun tallennusratkaisun IMAP-postilaatikoille. Avoimen lähdekoodin kehittäjinä teknologian käyttö, jonka salaustoiminnon saamiseksi vaaditaan lisenssimaksu, oli [periaatteemme](#principles):n vastaista – siksi kokeilimme, tutkimme ja kehitimme uuden ratkaisun tyhjästä näiden tarpeiden ratkaisemiseksi.

Sen sijaan, että käyttäisimme jaettua tietokantaa postilaatikoiden tallentamiseen, tallennamme ja salaamme postilaatikot erikseen salasanallasi (joka on vain sinulla). **Sähköpostipalvelumme on niin turvallinen, että jos unohdat salasanasi, menetät postilaatikkosi** (ja sinun on palautettava se offline-varmuuskopioilla tai aloitettava alusta).

Jatka lukemista, sillä alla syvennymme tarkemmin muun muassa [sähköpostipalveluntarjoajien vertailu](#email-service-provider-comparison)-, [miten palvelumme toimii](#how-does-it-work)- ja [teknologiapinomme](#technologies)-tekijöihin.

## Sähköpostipalveluntarjoajien vertailu {#email-service-provider-comparison}

Olemme ainoa 100 % avoimen lähdekoodin ja yksityisyyteen keskittyvä sähköpostipalveluntarjoaja, joka tallentaa erikseen salattuja SQLite-postilaatikoita, tarjoaa rajattomasti verkkotunnuksia, aliaksia ja käyttäjiä sekä tukee lähtevää SMTP-, IMAP- ja POP3-postia:

**Toisin kuin muilla sähköpostipalveluntarjoajilla, sinun ei tarvitse maksaa tallennustilasta verkkotunnus- tai aliaskohtaisesti Forward Email -palvelun kanssa.** Tallennustila jaetaan koko tilisi kesken – joten jos sinulla on useita mukautettuja verkkotunnuksia ja useita aliaksia jokaisella, olemme täydellinen ratkaisu sinulle. Huomaa, että voit silti halutessasi asettaa tallennusrajoituksia verkkotunnus- tai aliaskohtaisesti.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lue sähköpostipalveluiden vertailu <i class="fa fa-search-plus"></i></a>

## Miten se toimii {#how-does-it-work}

1. Käyttämällä sähköpostiohjelmaasi, kuten Apple Mailia, Thunderbirdiä, Gmailia tai Outlookia, muodostat yhteyden suojattuihin [IMAP](/faq#do-you-support-receiving-email-with-imap)-palvelimiimme käyttäjätunnuksellasi ja salasanallasi:

* Käyttäjätunnuksesi on verkkotunnuksesi koko aliaksesi, kuten `hello@example.com`.
* Salasanasi luodaan satunnaisesti ja näytetään sinulle vain 30 sekunnin ajan, kun napsautat <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> -painiketta kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset.

2. Kun yhteys on muodostettu, sähköpostiohjelmasi lähettää [IMAP-protokollan komennot](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)-viestin IMAP-palvelimellemme sähköpostilaatikon synkronoimiseksi. Tämä sisältää luonnosviestien kirjoittamisen ja tallentamisen sekä muut mahdolliset toiminnot (esim. sähköpostin merkitsemisen tärkeäksi tai roskapostiksi).

3. Sähköpostinvaihtopalvelimet (yleisesti tunnettu nimellä "MX"-palvelimet) vastaanottavat uudet saapuvat sähköpostit ja tallentavat ne postilaatikkoosi. Kun näin tapahtuu, sähköpostiohjelmasi saa ilmoituksen ja synkronoi postilaatikkosi. Sähköpostinvaihtopalvelimemme voivat välittää sähköpostisi yhdelle tai useammalle vastaanottajalle (mukaan lukien [webhookit](/faq#do-you-support-webhooks)), tallentaa sähköpostisi puolestasi salattuun IMAP-tallennustilaan meillä, **tai molemmat**!

> \[!VINKKI]
> Kiinnostaako sinua oppia lisää? Lue [sähköpostin edelleenlähetyksen määrittäminen](/faq#how-do-i-get-started-and-set-up-email-forwarding), [miten postinvaihtopalvelumme toimii](/faq#how-does-your-email-forwarding-system-work) tai katso [oppaamme](/guides).

4. Kulissien takana turvallinen sähköpostin tallennusratkaisumme toimii kahdella tavalla pitääkseen postilaatikkosi salattuina ja vain sinä voit käyttää niitä:

* Kun vastaanotamme sinulle uutta postia lähettäjältä, sähköpostinvaihtopalvelimemme kirjoittavat sen sinulle tarkoitettuun henkilökohtaiseen, väliaikaiseen ja salattuun postilaatikkoon.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Kun muodostat yhteyden IMAP-palvelimeemme sähköpostiohjelmallasi, salasanasi salataan muistiin ja sitä käytetään postilaatikkosi lukemiseen ja kirjoittamiseen. Postilaatikkoasi voi lukea ja siihen voi kirjoittaa vain tällä salasanalla. Muista, että koska olet ainoa, jolla on tämä salasana, **vain sinä** voit lukea ja kirjoittaa postilaatikkoosi, kun käytät sitä. Kun sähköpostiohjelmasi seuraavan kerran yrittää kysellä postia tai synkronoida, uudet viestisi siirretään tästä väliaikaisesta postilaatikosta ja tallennetaan varsinaiseen postilaatikkotiedostoosi antamallasi salasanalla. Huomaa, että tämä väliaikainen postilaatikko tyhjennetään ja poistetaan myöhemmin, jotta viestit ovat vain salasanalla suojatussa postilaatikossasi.

* **Jos olet yhteydessä IMAP-protokollaan (esim. käyttämällä sähköpostiohjelmaa, kuten Apple Mailia tai Thunderbirdiä), meidän ei tarvitse kirjoittaa väliaikaiseen levytallennustilaan. Sen sijaan noudetaan ja käytetään muistissa olevaa salattua IMAP-salasanasi. Kun viestiä yritetään toimittaa sinulle reaaliajassa, lähetämme WebSocket-pyynnön kaikille IMAP-palvelimille kysyäksemme, onko heillä aktiivinen istunto sinulle (tämä on noutovaihe), ja välitämme sitten tämän salatun muistissa olevan salasanan eteenpäin – joten meidän ei tarvitse kirjoittaa väliaikaiseen postilaatikkoon, vaan voimme kirjoittaa varsinaiseen salattuun postilaatikkoosi salatulla salasanallasi.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Salattujen postilaatikoiden varmuuskopiot](#backups) luodaan päivittäin. Voit myös pyytää uuden varmuuskopion milloin tahansa tai ladata uusimman varmuuskopion osoitteesta <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset. Jos päätät vaihtaa toiseen sähköpostipalveluun, voit helposti siirtää, ladata, viedä ja tyhjentää postilaatikot ja varmuuskopiot milloin tahansa.

## Teknologiat {#technologies}

### Tietokannat {#databases}

Tutkimme muita mahdollisia tietokannan tallennuskerroksia, mutta mikään ei täyttänyt vaatimuksiamme yhtä hyvin kuin SQLite:

| Tietokanta | Salaus levossa | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postilaatikot | Lisenssi | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :tähti: | :white_check_mark: Kyllä, [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :valkoinen_tarkistusmerkki: | :white_check_mark: Julkinen omaisuus | :valkoinen_tarkistusmerkki: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relaatiotietokanta | :x: AGPL ja `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relaatiotietokanta | :white_check_mark: __SOLU_KOODI_0__ | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: __SOLU_KOODI_0__ | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relaatiotietokanta | :white_check_mark: `PostgreSQL` (samanlainen kuin `BSD` tai `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relaatiotietokanta | :white_check_mark: `GPLv2` ja `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relaatiotietokanta | :x: `BUSL-1.1` ja muut | :x: |

> Yllä olevassa taulukossa on [blogikirjoitus, jossa vertaillaan useita SQLite-tietokannan tallennusvaihtoehtoja](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/).

### Tietoturva {#security}

Käytämme aina [salaus levossa](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [salaus siirron aikana](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS HTTPS:n kautta](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") -salausta käyttäen :tangerine: [Mandariini](https://tangeri.ne) ja [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Lisäksi käytämme token-pohjaista kaksivaiheista todennusta (toisin kuin tekstiviestitse, joka on [välikäsihyökkäykset](https://en.wikipedia.org/wiki/Man-in-the-middle_attack):lle altis), kierrätettyjä SSH-avaimia, joissa pääkäyttäjän oikeudet on poistettu käytöstä, yksinoikeudella pääsyä palvelimille rajoitettujen IP-osoitteiden kautta ja paljon muuta.

Jos kyseessä on [pahan piian hyökkäys](https://en.wikipedia.org/wiki/Evil_maid_attack)-käyttäjä tai kolmannen osapuolen toimittajan luvaton työntekijä, **postilaatikkosi voidaan edelleen avata vain luomallasi salasanalla**. Voit olla varma, ettemme ole riippuvaisia muista kolmannen osapuolen toimittajista kuin SOC Type 2 -valituspalvelinpalveluntarjoajistamme, kuten Cloudflaresta, DataPacketista, Digital Oceanista ja Vultrista.

Tavoitteenamme on, että [yksittäinen vikapiste](https://en.wikipedia.org/wiki/Single_point_of_failure)-kohteita on mahdollisimman vähän.

### Postilaatikot {#mailboxes}

> **tldr;** IMAP-palvelimemme käyttävät erikseen salattuja SQLite-tietokantoja jokaiselle postilaatikollesi.

[SQLite on erittäin suosittu](https://www.sqlite.org/mostdeployed.html) upotettu tietokanta – se on tällä hetkellä käynnissä puhelimessasi ja tietokoneessasi – [ja sitä käyttävät lähes kaikki tärkeimmät teknologiat](https://www.sqlite.org/famous.html).

Esimerkiksi salatuilla palvelimillamme on SQLite-tietokannan postilaatikko `linux@example.com`:lle, `info@example.com`:lle, `hello@example.com`:lle ja niin edelleen – yksi kullekin `.sqlite`-tietokantatiedostona. Emme myöskään nimeä tietokantatiedostoja sähköpostiosoitteella – sen sijaan käytämme BSON ObjectID:tä ja luotuja yksilöllisiä UUID-tunnuksia, jotka eivät jaa postilaatikon haltijaa tai sähköpostiosoitetta (esim. `353a03f21e534321f5d6e267.sqlite`).

Jokainen näistä tietokannoista on salattu salasanallasi (joka on vain sinulla) käyttäen [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Tämä tarkoittaa, että postilaatikosi ovat erikseen salattuja, itsenäisiä ([hiekkalaatikko](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) ja siirrettäviä.

Olemme hienosäätäneet SQLiteä seuraavalla [PRAGMA](https://www.sqlite.org/pragma.html)-muuttujalla:

| `PRAGMA` | Tarkoitus |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Lisätietoja on kohdassa `better-sqlite3-multiple-ciphers` kohdassa [Projects](#projects). |
| `key="****************"` | Tämä on purettu, muistissa oleva salasanasi, joka välitetään sähköpostiohjelmasi IMAP-yhteyden kautta palvelimellemme. Uudet tietokantainstanssit luodaan ja suljetaan jokaista luku- ja kirjoitusistuntoa varten (hiekkalaatikon ja eristämisen varmistamiseksi). |
| `journal_model=WAL` | Kirjoita etukäteen lokitiedosto ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Estää kirjoituslukitusvirheet [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Parantaa tapahtumien kestävyyttä [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Pakottaa, että viiteavainten viittaukset (esim. relaatio taulukon ja toisen taulukon välillä) pakotetaan. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), mutta validoinnin ja tietojen eheyden vuoksi sen tulisi olla käytössä. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) käytettäväksi kehittäjän mielenterveyden varmistamiseksi. |

> Kaikki muut oletusarvot ovat SQLitestä, kuten [virallinen PRAGMA-dokumentaatio](https://www.sqlite.org/pragma.html#pragma_auto_vacuum):ssa on määritetty.

### Samanaikaisuus {#concurrency}

> **tldr;** Käytämme `WebSocket`-muistipaikkaa salattujen SQLite-postilaatikoiden samanaikaiseen lukemiseen ja kirjoittamiseen.

#### Lukee {#reads}

Puhelimesi sähköpostiohjelma saattaa selvittää `imap.forwardemail.net`-osoitteen yhdeksi Digital Oceanin IP-osoitteistamme – ja työpöytäsovelluksesi saattaa selvittää erillisen IP-osoitteen kokonaan toisesta [palveluntarjoaja](#providers)-osoitteesta.

Riippumatta siitä, mihin IMAP-palvelimeen sähköpostiohjelmasi muodostaa yhteyden, haluamme yhteyden lukevan tietokannastasi reaaliajassa 100 %:n tarkkuudella. Tämä tehdään WebSocketsin kautta.

#### Kirjoittaa {#writes}

Tietokantaan kirjoittaminen on hieman erilaista – koska SQLite on upotettu tietokanta ja postilaatikkosi sijaitsee oletusarvoisesti yhdessä tiedostossa.

Olimme tutkineet alla olevia vaihtoehtoja, kuten `litestream`, `rqlite` ja `dqlite`, mutta mikään näistä ei täyttänyt vaatimuksiamme.

Jotta kirjoitukset voidaan suorittaa etukäteen kirjoitettavan lokikirjauksen ("[WAL](https://www.sqlite.org/wal.html)") ollessa käytössä, meidän on varmistettava, että vain yksi palvelin ("Primary") on vastuussa siitä. [WAL](https://www.sqlite.org/wal.html) nopeuttaa huomattavasti samanaikaisuutta ja sallii yhden kirjoittajan ja useita lukijoita.

Ensisijainen palvelimia käytetään datapalvelimilla, joiden liitetyillä levyillä on salatut postilaatikot. Jakelun näkökulmasta kaikkia `imap.forwardemail.net`-palvelimen takana olevia yksittäisiä IMAP-palvelimia voidaan pitää toissijaisina palvelimina ("Secondary").

Toteutamme kaksisuuntaisen viestinnän [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):n kanssa:

* Ensisijaiset palvelimet käyttävät [ws](https://github.com/websockets/ws):n `WebSocketServer`-palvelimen instanssia.

* Toissijaiset palvelimet käyttävät [ws](https://github.com/websockets/ws):n `WebSocket`-asiakasohjelman instanssia, joka on kääritty [websocket-as-promised](https://github.com/vitalets/websocket-as-promised):n ja [websocketin uudelleenkytkeminen](https://github.com/opensumi/reconnecting-websocket):n kanssa. Nämä kaksi käärintäohjelmaa varmistavat, että `WebSocket` muodostaa uudelleen yhteyden ja voi lähettää ja vastaanottaa tietoja tiettyjä tietokannan kirjoituksia varten.

### Varmuuskopiot {#backups}

> **tldr;** Salattujen postilaatikoiden varmuuskopiot otetaan päivittäin. Voit myös pyytää uuden varmuuskopion välittömästi tai ladata uusimman varmuuskopion milloin tahansa kohdasta <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset.

Varmuuskopioita varten suoritamme SQLite `VACUUM INTO` -komennon joka päivä IMAP-komennon käsittelyn aikana. Tämä hyödyntää salattua salasanaasi muistissa olevasta IMAP-yhteydestä. Varmuuskopiot tallennetaan, jos olemassa olevaa varmuuskopiota ei havaita tai jos tiedoston [SHA-256](https://en.wikipedia.org/wiki/SHA-2)-hajautusarvo on muuttunut viimeisimpään varmuuskopioon verrattuna.

Huomaa, että käytämme `VACUUM INTO`-komentoa sisäänrakennetun `backup`-komennon sijaan, koska jos sivua muokataan `backup`-komennon aikana, se on aloitettava alusta. `VACUUM INTO`-komento ottaa tilannevedoksen. Katso lisätietoja näistä [GitHub](https://github.com/benbjohnson/litestream.io/issues/56)- ja [Hakkereiden uutiset](https://news.ycombinator.com/item?id=31387556)-komentoja koskevista kommenteista.

Lisäksi käytämme `VACUUM INTO`-komentoa `backup`-komennon sijaan, koska `backup`-komento jättäisi tietokannan salaamattomaksi lyhyeksi ajaksi, kunnes `rekey`-komentoa kutsutaan (katso lisätietoja tästä GitHubin [kommentti](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)-tiedostosta).

Toissijainen yksikkö käskee ensisijaista yksikköä suorittamaan varmuuskopioinnin `WebSocket`-yhteyden kautta – ja ensisijainen yksikkö vastaanottaa sitten komennon tehdä niin ja tekee sen jälkeen seuraavat toimenpiteet:

1. Yhdistä salattuun postilaatikkoosi.

2. Hanki kirjoituslukko.

3. Suorita WAL-tarkistuspiste `wal_checkpoint(PASSIVE)`:n kautta.

4. Suorita `VACUUM INTO` SQLite -komento.

5. Varmista, että kopioitu tiedosto voidaan avata salatulla salasanalla (suojaus/valesuojaus).

6. Lataa se Cloudflare R2:een tallennusta varten (tai omaan palveluntarjoajaasi, jos se on määritetty).

<!--
7. Pakkaa tuloksena oleva varmuuskopiotiedosto `gzip`-tiedostolla.
8. Lataa se Cloudflare R2:een tallennusta varten (tai omaan palveluntarjoajaasi, jos se on määritetty).
-->

Muista, että postilaatikkosi ovat salattuja – ja vaikka meillä on IP-rajoituksia ja muita todennusmenetelmiä WebSocket-tiedonsiirtoa varten – voit olla varma, että jos WebSocket-hyötykuorma ei tiedä IMAP-salasanaasi, se ei voi avata tietokantaasi, jos se on haitallisen tahon alainen.

Tällä hetkellä postilaatikkoa kohden tallennetaan vain yksi varmuuskopio, mutta tulevaisuudessa saatamme tarjota palautusta tietyn ajankohdan mukaan ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Hae {#search}

IMAP-palvelimemme tukevat `SEARCH`-komentoa monimutkaisten kyselyiden, säännöllisten lausekkeiden ja muiden toimintojen kanssa.

Nopea hakutoiminto on [FTS5](https://www.sqlite.org/fts5.html):n ja [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex):n ansiota.

Tallennamme `Date`-arvot SQLite-postilaatikoihin [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-merkkijonoina [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString)-metodin kautta (UTC-aikavyöhykkeellä, jotta yhtäläisyysvertailut toimivat oikein).

Indeksit tallennetaan myös kaikille hakukyselyissä oleville ominaisuuksille.

### Projektit {#projects}

Tässä on taulukko, jossa esitetään lähdekoodissamme ja kehitysprosessissamme käyttämämme projektit (aakkosjärjestyksessä):

| Projekti | Tarkoitus |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | DevOps-automaatioalusta koko palvelinkalustomme helppoon ylläpitoon, skaalaukseen ja hallintaan. |
| [Bree](https://github.com/breejs/bree) | Töiden ajoitus Node.js:lle ja JavaScriptille, jossa on cron, dates, ms, later ja käyttäjäystävällinen tuki. |
| [Cabin](https://github.com/cabinjs/cabin) | Kehittäjäystävällinen JavaScript- ja Node.js-lokikirjasto, joka on suunniteltu tietoturvaa ja yksityisyyttä ajatellen. |
| [Lad](https://github.com/ladjs/lad) | Node.js-kehys, joka tukee koko arkkitehtuuriamme ja suunnitteluamme MVC:n ja muiden elementtien avulla. |
| [MongoDB](https://www.mongodb.com/) | NoSQL-tietokantaratkaisu, jota käytämme kaikkien muiden postilaatikoiden ulkopuolisten tietojen (esim. tilisi, asetuksesi, verkkotunnuksesi ja alias-määritykset) tallentamiseen. |
| [Mongoose](https://github.com/Automattic/mongoose) | MongoDB-objektidokumenttimallinnus ("ODM"), jota käytämme koko DB-pinossamme. Kirjoitimme erityisiä apuohjelmia, joiden avulla voimme yksinkertaisesti jatkaa **Mongoosen käyttöä SQLite:n kanssa** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js on avoimen lähdekoodin, monialustainen JavaScript-suoritusympäristö, joka suorittaa kaikki palvelinprosessimme. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Node.js-paketti sähköpostien lähettämiseen, yhteyksien luomiseen ja muuhun. Olemme tämän projektin virallinen sponsori. |
| [Redis](https://redis.io/) | Muistissa oleva tietokanta välimuistiin tallentamiseen, julkaisu-/tilauskanaviin ja DNS:ään HTTPS-pyyntöjen kautta. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | SQLiten salauslaajennus, jonka avulla koko tietokantatiedostot voidaan salata (mukaan lukien etukäteen kirjoitettava loki ("[WAL](https://www.sqlite.org/wal.html)"), lokitiedosto, palautus jne.). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Visual SQLite -editori (jota voit myös käyttää) kehityspostilaatikoiden testaamiseen, lataamiseen ja tarkastelemiseen. |
| [SQLite](https://www.sqlite.org/about.html) | Upotettu tietokantakerros skaalautuvaa, itsenäistä, nopeaa ja vikasietoista IMAP-tallennusta varten. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Node.js-roskapostin, sähköpostin suodatuksen ja tietojenkalastelunestotyökalu (vaihtoehtomme [Spam Assassin](https://spamassassin.apache.org/)- ja [rspamd](https://github.com/rspamd/rspamd)-työkaluille). |
| [Tangerine](https://tangeri.ne) | DNS HTTPS-pyyntöjen kautta Node.js:n avulla ja välimuisti Redisin avulla – mikä varmistaa globaalin yhdenmukaisuuden ja paljon muuta. |
| [Thunderbird](https://www.thunderbird.net/) | Kehitystiimimme käyttää tätä (ja suosittelee myös) **suositeltuna sähköpostiohjelmana sähköpostin edelleenlähetyksen kanssa**. |
| [UTM](https://github.com/utmapp/UTM) | Kehitystiimimme käyttää tätä virtuaalikoneiden luomiseen iOS:lle ja macOS:lle testatakseen erilaisia sähköpostiohjelmia (rinnakkain) IMAP- ja SMTP-palvelimiemme kanssa. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderni avoimen lähdekoodin Linux-pohjainen palvelinkäyttöjärjestelmä, joka pyörittää kaikkea infrastruktuuriamme. |
| [WildDuck](https://github.com/nodemailer/wildduck) | IMAP-palvelinkirjasto – katso sen huomautukset [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) ja [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md) -kirjastoista. |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Nopea ja yksinkertainen API-kirjasto Node.js:n ohjelmalliseen vuorovaikutukseen SQLite3:n kanssa. |
| [email-templates](https://github.com/forwardemail/email-templates) | Kehittäjäystävällinen sähköpostijärjestelmä mukautettujen sähköpostien (esim. tili-ilmoitusten ja muiden) luomiseen, esikatseluun ja lähettämiseen. |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | SQL-kyselyiden rakentaja Mongo-tyylistä syntaksia käyttäen. Tämä säästää kehitystiimimme aikaa, koska voimme jatkaa kirjoittamista Mongo-tyyliin koko pinon läpi tietokannasta riippumattomalla lähestymistavalla. **Se auttaa myös välttämään SQL-injektiohyökkäyksiä käyttämällä kyselyparametreja.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | SQL-apuohjelma olemassa olevan tietokantakaavan tietojen poimimiseen. Tämän avulla voimme helposti varmistaa, että kaikki indeksit, taulukot, sarakkeet, rajoitteet ja muut ovat kelvollisia ja että ne ovat `1:1` oikeassa muodossa. Olemme jopa kirjoittaneet automaattisia apuohjelmia uusien sarakkeiden ja indeksien lisäämiseksi, jos tietokantakaavoihin tehdään muutoksia (ja niissä on myös erittäin yksityiskohtainen virheilmoitus). |
| [knex](https://github.com/knex/knex) | SQL-kyselyiden rakentaja, jota käytämme vain tietokantojen migraatioihin ja skeeman validointiin `knex-schema-inspector`:n kautta. |
| [mandarin](https://github.com/ladjs/mandarin) | Automaattinen [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) -lausekekäännös Markdown-tuella käyttäen [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Node.js-paketti MX-palvelimiin liittyvien yhteyksien ratkaisemiseen ja muodostamiseen sekä virheiden käsittelyyn. |
| [pm2](https://github.com/Unitech/pm2) | Node.js-tuotantoprosessien hallintaohjelma sisäänrakennetulla kuormituksen tasaajalla ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) suorituskyvyn parantamiseksi). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | SMTP-palvelinkirjasto – käytämme tätä sähköpostinvaihtoon ("MX") ja lähtevän postin SMTP-palvelimillemme. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Hyödyllinen työkalu IMAP-palvelimien testaamiseen vertailuarvoja ja RFC-spesifikaation mukaista IMAP-protokollan yhteensopivuutta vasten. Tämän projektin loi [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) -tiimi (aktiivinen avoimen lähdekoodin IMAP- ja POP3-palvelin heinäkuusta 2002 lähtien). Testasimme IMAP-palvelintamme laajasti tällä työkalulla. |

> Löydät muita käyttämiämme projekteja [lähdekoodimme GitHubissa](https://github.com/forwardemail)-kohdasta.

### Palveluntarjoajat {#providers}

| Palveluntarjoaja | Tarkoitus |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | DNS-palveluntarjoaja, terveystarkastukset, kuormituksen tasaajat ja varmuuskopiointi [Cloudflare R2](https://developers.cloudflare.com/r2) -palvelun avulla. |
| [GitHub](https://github.com/) | Source code hosting, CI/CD, and project management. |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedikoitu palvelinhosting ja hallinnoidut tietokannat. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Dedikoitu palvelinhosting. |
| [DataPacket](https://www.datapacket.com) | Dedikoitu palvelinhosting. |

## Ajatuksia {#thoughts}

### Periaatteet {#principles}

Sähköpostin edelleenlähetys on suunniteltu seuraavien periaatteiden mukaisesti:

1. Ole aina kehittäjäystävällinen, tietoturva- ja yksityisyyskeskeinen sekä läpinäkyvä.

2. Noudata [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)-, [Unix](https://en.wikipedia.org/wiki/Unix_philosophy)-, [KISS](https://en.wikipedia.org/wiki/KISS_principle)-, [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)-, [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)-, [Kaksitoista tekijää](https://12factor.net/)-, [Occamin partakone](https://en.wikipedia.org/wiki/Occam%27s_razor)- ja [koiranruokailu](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)-ohjeita.

3. Kohdista toimintasi irstailevaan, itseohjautuvaan ja [ramen-kannattava](http://www.paulgraham.com/ramenprofitable.html)-kehittäjään.

### Kokeet {#experiments}

> **tldr;** S3-yhteensopivan objektitallennuksen ja/tai virtuaalitaulujen käyttö ei ole teknisesti mahdollista suorituskykyyn liittyvistä syistä ja on altis virheille muistirajoitusten vuoksi.

Olemme tehneet muutamia kokeiluja ennen kuin päädyimme lopulliseen SQLite-ratkaisuumme, kuten edellä on käsitelty.

Yksi näistä oli kokeilla [rclone]():n ja SQLiten käyttöä yhdessä S3-yhteensopivan tallennuskerroksen kanssa.

Tuo kokeilu johti meidät ymmärtämään ja löytämään reunatapauksia, jotka liittyvät rclonen, SQLiten ja [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):n käyttöön:

* Jos otat `--vfs-cache-mode writes`-lipun käyttöön rclonella, lukeminen onnistuu, mutta kirjoitukset tallennetaan välimuistiin.
* Jos sinulla on useita IMAP-palvelimia maailmanlaajuisesti hajautettuna, välimuisti on pois päältä niiden välillä, ellet käytä yhtä kirjoittajaa ja useita kuuntelijoita (esim. pub/sub-lähestymistapa).
* Tämä on uskomattoman monimutkaista, ja tämänkaltainen monimutkaisuus johtaa useampiin yksittäisiin vikaantumiskohtiin.
* S3-yhteensopivat tallennuspalveluntarjoajat eivät tue osittaisia tiedostomuutoksia – mikä tarkoittaa, että `.sqlite`-tiedoston muutos johtaa täydelliseen muutokseen ja tietokannan uudelleenlataukseen.
* Muita ratkaisuja, kuten `rsync`, on olemassa, mutta ne eivät keskity etukäteen kirjoitettavan lokin ("[WAL](https://www.sqlite.org/wal.html)") tukeen – joten päädyimme tarkastelemaan Litestreamia. Onneksi salauskäyttömme salaa jo [WAL](https://www.sqlite.org/wal.html)-tiedostot puolestamme, joten meidän ei tarvitse luottaa Litestreamiin tässä asiassa. Emme kuitenkaan olleet vielä varmoja Litestreamin käytöstä tuotantokäytössä, ja meillä on siitä muutamia huomioita alla.
* Tämän `--vfs-cache-mode writes`-vaihtoehdon käyttäminen (*ainoa* tapa käyttää SQLiteä `rclone`:n sijaan kirjoituksiin) yrittää kopioida koko tietokannan tyhjästä muistista – yhden 10 Gt:n postilaatikon käsittely on OK, mutta useiden postilaatikoiden käsittely erittäin suurella tallennustilalla aiheuttaa IMAP-palvelimille muistirajoituksia ja `ENOMEM`-virheitä, segmentointivirheitä ja tietojen vioittumista.
* Jos yrität käyttää SQLite [Virtuaalipöydät](https://www.sqlite.org/vtab.html):aa (esim. käyttämällä [s3db](https://github.com/jrhy/s3db):ää) saadaksesi tiedot S3-yhteensopivalle tallennustasolle, kohtaat useita muita ongelmia:
* Lukeminen ja kirjoittaminen on erittäin hidasta, koska S3 API -päätepisteisiin on tartuttava HTTP `.sqlite`0-, `.sqlite`1-, `.sqlite`2- ja `.sqlite`3-metodeilla. * Kehitystestit osoittivat, että yli 500 000–1 000 000 tietueen ylittäminen kuituinternetissä on edelleen rajoitettua S3-yhteensopivien palveluntarjoajien kirjoittamisen ja lukemisen suorituskyvyllä. Esimerkiksi kehittäjämme suorittivat `.sqlite`4-silmukoita sekä peräkkäisten SQL `.sqlite`5 -lausekkeiden että suurten tietomäärien joukkokirjoittamiseen tarkoitettujen lausekkeiden tekemiseen. Molemmissa tapauksissa suorituskyky oli hämmästyttävän hidas.
* Virtuaalitaulukoilla **ei voi olla indeksejä**, `.sqlite`6-lausekkeita eikä `.sqlite`7 `.sqlite`8 -lausekkeita – mikä johtaa jopa 1–2 minuutin tai pidempiin viiveisiin tietomäärästä riippuen.
* Objektit tallennettiin salaamattomina, eikä natiivia salaustukea ole saatavilla.
* Tutkimme myös `.sqlite`9:n käyttöä, joka on käsitteellisesti ja teknisesti samanlainen kuin edellinen luettelokohta (joten siinä on samat ongelmat). Yksi mahdollisuus olisi käyttää mukautettua `rsync`0-rakennetta, joka on kääritty salauksella, kuten `rsync`1 (jota käytämme tällä hetkellä yllä olevassa ratkaisussamme) `rsync`2:n kautta.
* Toinen mahdollinen lähestymistapa olisi käyttää `rsync`3:a, mutta tällä on 32 Gt:n rajoitus ja se vaatisi monimutkaisia rakennus- ja kehitysongelmia.
* `rsync`4-lausekkeet ovat pakollisia (joten tämä sulkee täysin pois virtuaalitaulukoiden käytön). Tarvitsemme `rsync`5-lausekkeita, jotta `rsync`6-koukkumme toimisi oikein – mikä varmistaa, että tiedot eivät vioitu ja noudetut rivit voidaan muuntaa kelvollisiksi dokumenteiksi `rsync`7-skeemamääritysten mukaisesti (jotka sisältävät rajoitteen, muuttujatyypin ja mielivaltaisen datan validoinnin).
* Lähes kaikki avoimen lähdekoodin yhteisön SQLiteen liittyvät S3-yhteensopivat projektit ovat Pythonissa (eikä JavaScriptissä, jota käytämme 100 %:sti pinostamme).
* Pakkauskirjastot, kuten `rsync`8 (katso `rsync`9), näyttävät lupaavilta, mutta __PROTECTED_LINK_189__0. Sen sijaan sovelluspuolen pakkaus tietotyypeille, kuten __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 ja __PROTECTED_LINK_189__6, on puhtaampi ja helpompi lähestymistapa (ja se on myös helpompi siirtää, koska voisimme tallentaa __PROTECTED_LINK_189__7-lipun tai -sarakkeen – tai jopa käyttää __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 pakkaamiseen tai __PROTECTED_LINK_190__0 pakkaamattomuuteen tietokannan metatietoina).
* Onneksi meillä on jo käytössä liitteiden deduplikaatio IMAP-palvelimemme tallennustilassa – siksi jokainen saman liitteen sisältävä viesti ei säilytä kopiota liitteestä – sen sijaan yksi liite tallennetaan useille viesteille ja ketjuille postilaatikossa (ja käytetään myöhemmin ulkoista viittausta).
* Litestream-projekti, joka on SQLite-replikointi- ja varmuuskopiointiratkaisu, on erittäin lupaava, ja tulemme todennäköisesti käyttämään sitä tulevaisuudessa.
* En halua vähätellä tekijän/tekijöiden uskottavuutta – koska olemme rakastaneet heidän työtään ja panostaan avoimeen lähdekoodiin jo yli vuosikymmenen ajan – mutta käytännön käytöstä näyttää siltä, että __PROTECTED_LINK_190__1 ja __PROTECTED_LINK_190__2 ovat olemassa.
* Varmuuskopioiden palauttamisen on oltava kitkatonta ja yksinkertaista. MongoDB:n kaltaisen ratkaisun käyttö __PROTECTED_LINK_190__3:n ja __PROTECTED_LINK_190__4:n kanssa ei ole vain työlästä, vaan myös aikaa vievää ja konfigurointi on monimutkaista.
* SQLite-tietokannat tekevät siitä yksinkertaista (se on yksi tiedosto).
* Halusimme suunnitella ratkaisun, jossa käyttäjät voivat ottaa postilaatikkonsa ja poistua milloin tahansa.
* Yksinkertaiset Node.js-komennot __PROTECTED_LINK_190__5:lle, ja se poistetaan pysyvästi levytilasta. * Voimme samalla tavalla käyttää S3-yhteensopivaa API:a HTTP __PROTECTED_LINK_190__6:n kanssa poistaaksemme helposti käyttäjien tilannevedokset ja varmuuskopiot.
* SQLite oli yksinkertaisin, nopein ja kustannustehokkain ratkaisu.

### Vaihtoehtojen puute {#lack-of-alternatives}

Tietojemme mukaan muita sähköpostipalveluita ei ole suunniteltu tällä tavalla, eivätkä ne ole avoimen lähdekoodin palveluita.

*Mielestämme tämä saattaa johtua* siitä, että olemassa olevissa sähköpostipalveluissa on käytössä vanhaa teknologiaa [spagettikoodi](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti::n kanssa.

Useimmat, elleivät kaikki, nykyiset sähköpostipalveluntarjoajat ovat joko suljetun lähdekoodin ohjelmia tai mainostavat itseään avoimen lähdekoodin ohjelmina, **mutta todellisuudessa vain niiden käyttöliittymä on avoimen lähdekoodin ohjelmia.**

**Sähköpostin arkaluontoisin osa** (varsinainen tallennus/IMAP/SMTP-vuorovaikutus)** tapahtuu kaikki taustalla (palvelimella), *ei* käyttöliittymässä (asiakasohjelmassa)**.

### Kokeile sähköpostin edelleenlähetystä {#try-out-forward-email}

Rekisteröidy tänään osoitteessa <https://forwardemail.net>! :rocket: