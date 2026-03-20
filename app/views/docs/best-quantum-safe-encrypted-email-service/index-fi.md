# Kvanttiturvallinen sähköposti: Kuinka käytämme salattuja SQLite-postilaatikoita pitääksemme sähköpostisi turvassa {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Kvanttiturvallinen salattu sähköpostipalvelun kuvaus" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Sähköpostipalveluntarjoajien vertailu](#email-service-provider-comparison)
* [Miten se toimii](#how-does-it-work)
* [Teknologiat](#technologies)
  * [Tietokannat](#databases)
  * [Turvallisuus](#security)
  * [Postilaatikot](#mailboxes)
  * [Samaan aikaan toimiminen](#concurrency)
  * [Varakopiot](#backups)
  * [Haku](#search)
  * [Projektit](#projects)
  * [Tarjoajat](#providers)
* [Mietteitä](#thoughts)
  * [Periaatteet](#principles)
  * [Kokeilut](#experiments)
  * [Vaihtoehtojen puute](#lack-of-alternatives)
  * [Kokeile Forward Emailia](#try-out-forward-email)


## Esipuhe {#foreword}

> \[!IMPORTANT]
> Sähköpostipalvelumme on [100 % avoimen lähdekoodin](https://github.com/forwardemail) ja yksityisyyttä kunnioittava turvallisten ja salattujen SQLite-postilaatikoiden avulla.

Ennen kuin lanseerasimme [IMAP-tuen](/faq#do-you-support-receiving-email-with-imap), käytimme MongoDB:tä pysyvään tietovarastointiin.

Tämä teknologia on mahtava ja käytämme sitä edelleen – mutta MongoDB:n levossa olevan salauksen (encryption-at-rest) saamiseksi sinun täytyy käyttää palveluntarjoajaa, joka tarjoaa MongoDB Enterprisen, kuten Digital Ocean tai Mongo Atlas – tai maksaa yrityslisenssistä (ja sen jälkeen joutua odottamaan myyntitiimin vasteaikaa).

Tiimimme [Forward Emaililla](https://forwardemail.net) tarvitsi kehittäjäystävällisen, skaalautuvan, luotettavan ja salatun tallennusratkaisun IMAP-postilaatikoille. Avoimen lähdekoodin kehittäjinä teknologian käyttäminen, josta pitää maksaa lisenssimaksu saadakseen levossa olevan salauksen ominaisuuden, oli ristiriidassa [periaatteidemme](#principles) kanssa – joten kokeilimme, tutkimme ja kehitimme uuden ratkaisun alusta alkaen näiden tarpeiden täyttämiseksi.

Sen sijaan, että käyttäisimme jaettua tietokantaa postilaatikoidesi tallentamiseen, tallennamme ja salaamme postilaatikkosi yksilöllisesti salasanallasi (jonka vain sinä tiedät).  **Sähköpostipalvelumme on niin turvallinen, että jos unohdat salasanasi, menetät postilaatikkosi** (ja sinun täytyy palauttaa se offline-varakopioiden avulla tai aloittaa alusta).

Jatka lukemista, kun sukellamme syvemmälle alla [sähköpostipalveluntarjoajien vertailuun](#email-service-provider-comparison), [palvelumme toimintaan](#how-does-it-work), [teknologiapinoomme](#technologies) ja muuhun.


## Sähköpostipalveluntarjoajien vertailu {#email-service-provider-comparison}

Olemme ainoa 100 % avoimen lähdekoodin ja yksityisyyttä kunnioittava sähköpostipalveluntarjoaja, joka tallentaa yksilöllisesti salatut SQLite-postilaatikot, tarjoaa rajattomasti domaineja, aliaksia ja käyttäjiä sekä tukee lähtevää SMTP:tä, IMAP:ia ja POP3:ta:

**Toisin kuin muut sähköpostipalveluntarjoajat, sinun ei tarvitse maksaa tallennustilasta domain- tai aliaskohtaisesti Forward Emailin kanssa.** Tallennustila on jaettu koko tilisi kesken – joten jos sinulla on useita omia domain-nimiä ja useita aliaksia kussakin, olemme täydellinen ratkaisu sinulle. Huomaa, että voit halutessasi asettaa tallennusrajoja domain- tai aliaskohtaisesti.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lue sähköpostipalvelujen vertailu <i class="fa fa-search-plus"></i></a>


## Miten se toimii {#how-does-it-work}

1. Käyttämällä sähköpostiasiakastasi, kuten Apple Mailia, Thunderbirdiä, Gmailia tai Outlookia – yhdistät turvallisiin [IMAP](/faq#do-you-support-receiving-email-with-imap) -palvelimiimme käyttäjätunnuksellasi ja salasanallasi:

   * Käyttäjätunnuksesi on koko alias sähköpostiosoitteellasi, esimerkiksi `hello@example.com`.
   * Salasanasi on satunnaisesti luotu ja näytetään sinulle vain 30 sekunnin ajan, kun napsautat <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong> kohdasta <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset.
2. Kun yhteys on muodostettu, sähköpostiohjelmasi lähettää [IMAP-protokollan komentoja](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) IMAP-palvelimellemme pitääkseen postilaatikkosi synkronoituna. Tämä sisältää luonnosten kirjoittamisen ja tallentamisen sekä muut toimet, joita saatat tehdä (esim. merkitä sähköpostin Tärkeäksi tai liputtaa sähköpostin Roskapostiksi/Junk Mailiksi).

3. Sähköpostinvaihtopalvelimet (yleisesti tunnettuina "MX"-palvelimina) vastaanottavat uudet saapuvat sähköpostit ja tallentavat ne postilaatikkoosi. Kun tämä tapahtuu, sähköpostiohjelmasi saa ilmoituksen ja synkronoi postilaatikkosi. Sähköpostinvaihtopalvelimemme voivat edelleenlähettää sähköpostisi yhdelle tai useammalle vastaanottajalle (mukaan lukien [webhookit](/faq#do-you-support-webhooks)), tallentaa sähköpostisi salattuun IMAP-tallennustilaamme, **tai molempia**!

   > \[!TIP]
   > Haluatko oppia lisää? Lue [kuinka sähköpostin edelleenlähetys asetetaan](/faq#how-do-i-get-started-and-set-up-email-forwarding), [kuinka sähköpostinvaihtopalvelumme toimii](/faq#how-does-your-email-forwarding-system-work) tai katso [oppaamme](/guides).

4. Taustalla turvallinen sähköpostin tallennusratkaisumme toimii kahdella tavalla pitääkseen postilaatikkosi salattuina ja vain sinun käytettävissäsi:

   * Kun sinulle saapuu uutta sähköpostia lähettäjältä, sähköpostinvaihtopalvelimemme kirjoittavat yksilölliseen, väliaikaiseen ja salattuun postilaatikkoon sinulle.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Saapuva viesti vastaanotettu aliaksellesi (esim. you@yourdomain.com).
         MX->>SQLite: Viesti tallennetaan väliaikaiseen postilaatikkoon.
         Note over MX,SQLite: Lähettää edelleen muille vastaanottajille ja määritetyille webhookeille.
         MX->>Sender: Onnistui!
     ```

   * Kun yhdistät sähköpostiohjelmallasi IMAP-palvelimeemme, salasanasi salataan muistin sisällä ja sitä käytetään postilaatikkosi lukemiseen ja kirjoittamiseen. Postilaatikkoasi voi lukea ja siihen voi kirjoittaa vain tällä salasanalla. Muista, että koska olet ainoa, jolla on tämä salasana, **vain sinä** voit lukea ja kirjoittaa postilaatikkoosi, kun käytät sitä. Seuraavalla kerralla, kun sähköpostiohjelmasi yrittää hakea postia tai synkronoida, uudet viestisi siirretään tästä väliaikaisesta postilaatikosta ja tallennetaan varsinaiseen postilaatikkotiedostoosi käyttämällä antamaasi salasanaa. Huomaa, että tämä väliaikainen postilaatikko tyhjennetään ja poistetaan sen jälkeen, jotta vain salasanalla suojattu postilaatikkosi sisältää viestit.

   * **Jos olet yhteydessä IMAPiin (esim. käyttäen sähköpostiohjelmaa kuten Apple Mail tai Thunderbird), meidän ei tarvitse kirjoittaa väliaikaiseen levytilaan. Sen sijaan haetaan ja käytetään muistin sisällä salattua IMAP-salasanaasi. Reaaliajassa, kun viesti yritetään toimittaa sinulle, lähetämme WebSocket-pyynnön kaikille IMAP-palvelimille kysyen, onko heillä aktiivista istuntoa sinulle (tämä on hakuvaihe), ja sen jälkeen välitämme tämän salatun muistin sisällä olevan salasanan – joten meidän ei tarvitse kirjoittaa väliaikaiseen postilaatikkoon, voimme kirjoittaa varsinaiseen salattuun postilaatikkoosi käyttäen salattua salasanaasi.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Yhdistät IMAP-palvelimeen sähköpostiohjelmalla.
         IMAP->>SQLite: Siirtää viestin väliaikaisesta postilaatikosta aliaksesi postilaatikkoon.
         Note over IMAP,SQLite: Aliaksesi postilaatikko on saatavilla vain muistin sisällä IMAP-salasanalla.
         SQLite->>IMAP: Hakee viestit sähköpostiohjelman pyynnöstä.
         IMAP->>You: Onnistui!
     ```

5. [Salattujen postilaatikoidesi varmuuskopiot](#backups) tehdään päivittäin. Voit myös pyytää uutta varmuuskopiota milloin tahansa tai ladata uusimman varmuuskopion osoitteesta <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset. Jos päätät vaihtaa toiseen sähköpostipalveluun, voit helposti siirtää, ladata, viedä ja poistaa postilaatikkosi ja varmuuskopiosi milloin tahansa.


## Teknologiat {#technologies}

### Tietokannat {#databases}

Tutkimme muita mahdollisia tietokantakerroksia, mutta mikään ei täyttänyt vaatimuksiamme yhtä hyvin kuin SQLite:
| Tietokanta                                             |                                                                    Salaus levossa                                                                   |  [Säilötty](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Postilaatikot  |                           Lisenssi                           | [Käytössä kaikkialla](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: | :-----------------------------------------------------------: | :-------------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Kyllä [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) avulla                         |                                  :white_check_mark:                                    |               :white_check_mark: Public Domain                |                      :white_check_mark:                       |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Saatavilla vain MongoDB Enterprisessa"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Relaatiotietokanta                                 |                   :x: AGPL ja `SSPL-1.0`                      |                             :x:                               |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Vain verkossa](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Relaatiotietokanta                                 |                   :white_check_mark: `MIT`                    |                             :x:                               |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Testaamaton eikä vielä tuettu?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Testaamaton eikä vielä tuettu?](https://github.com/canonical/dqlite/issues/32)   |              :white_check_mark: `LGPL-3.0-only`               |                             :x:                               |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Kyllä](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Relaatiotietokanta                                 | :white_check_mark: `PostgreSQL` (samankaltainen kuin `BSD` tai `MIT`) |                             :x:                               |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Vain InnoDB:lle](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Relaatiotietokanta                                 |          :white_check_mark: `GPLv2` ja `BUSL-1.1`            |                             :x:                               |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Vain Enterprise-ominaisuus](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Relaatiotietokanta                                 |                  :x: `BUSL-1.1` ja muut                       |                             :x:                               |

> Tässä on [blogikirjoitus, joka vertaa useita SQLite-tietokannan tallennusvaihtoehtoja](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) yllä olevassa taulukossa.

### Turvallisuus {#security}

Käytämme aina [salausta levossa](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [salausta siirrossa](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") käyttäen :tangerine: [Tangerine](https://tangeri.ne) -palvelua, sekä [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) salausta postilaatikoissa. Lisäksi käytämme token-pohjaista kaksivaiheista tunnistautumista (toisin kuin tekstiviestipohjaista, joka on altis [man-in-the-middle-hyökkäyksille](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), kierrätettyjä SSH-avaimia, joiden root-käyttö on estetty, yksinoikeudella rajoitettuihin IP-osoitteisiin perustuvaa palvelimien käyttöä ja muuta.
Jos tapahtuu [evil maid -hyökkäys](https://en.wikipedia.org/wiki/Evil_maid_attack) tai kolmannen osapuolen toimittajan epäluotettava työntekijä, **postilaatikkosi voidaan silti avata vain luomallasi salasanalla**. Voit olla varma, että emme luota mihinkään kolmannen osapuolen toimittajiin lukuun ottamatta SOC Type 2 -vaatimustenmukaisia palveluntarjoajiamme Cloudflare, DataPacket, Digital Ocean, GitHub ja Vultr.

Tavoitteenamme on, että [yksittäisiä vikatilanteita](https://en.wikipedia.org/wiki/Single_point_of_failure) olisi mahdollisimman vähän.

### Postilaatikot {#mailboxes}

> **tldr;** IMAP-palvelimemme käyttävät erikseen salattuja SQLite-tietokantoja jokaiselle postilaatikollesi.

[SQLite on erittäin suosittu](https://www.sqlite.org/mostdeployed.html) upotettu tietokanta – se toimii tällä hetkellä puhelimessasi ja tietokoneessasi – [ja lähes kaikkien suurten teknologioiden käytössä](https://www.sqlite.org/famous.html).

Esimerkiksi salatuilla palvelimillamme on SQLite-tietokantapostilaatikko `linux@example.com`, `info@example.com`, `hello@example.com` ja niin edelleen – yksi jokaiselle `.sqlite`-tietokantatiedostona. Emme myöskään nimeä tietokantatiedostoja sähköpostiosoitteen mukaan – sen sijaan käytämme BSON ObjectID:tä ja uniikkeja UUID:ita, jotka eivät paljasta, kenelle postilaatikko kuuluu tai minkä sähköpostiosoitteen alla se on (esim. `353a03f21e534321f5d6e267.sqlite`).

Jokainen näistä tietokannoista on salattu itse käyttäen salasanaasi (joka on vain sinulla) [sqleetin](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) avulla ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Tämä tarkoittaa, että postilaatikkosi ovat erikseen salattuja, itsenäisiä, [sandboxattuja](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) ja siirrettäviä.

Olemme hienosäätäneet SQLitea seuraavilla [PRAGMA](https://www.sqlite.org/pragma.html) -asetuksilla:

| `PRAGMA`                 | Tarkoitus                                                                                                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [ChaCha20-Poly1305 SQLite -tietokannan salaus](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Katso `better-sqlite3-multiple-ciphers` kohdasta [Projects](#projects) saadaksesi lisätietoja.                              |
| `key="****************"` | Tämä on purettu muistissa oleva salasana, joka välitetään sähköpostiohjelmasi IMAP-yhteyden kautta palvelimellemme. Uudet tietokanta-instanssit luodaan ja suljetaan jokaiselle luku- ja kirjoitussessiolle (sandboxauksen ja eristyksen varmistamiseksi). |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [joka parantaa suorituskykyä ja sallii samanaikaisen lukuoikeuden](https://litestream.io/tips/#wal-journal-mode).                                                                             |
| `busy_timeout=5000`      | Estää kirjoituslukitusvirheitä [kun muita kirjoituksia tapahtuu](https://litestream.io/tips/#busy-timeout).                                                                                                                                              |
| `synchronous=NORMAL`     | Lisää transaktioiden kestävyyttä [ilman tietojen korruptioriskiä](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                       |
| `foreign_keys=ON`        | Pakottaa viittaukset vieraisiin avaimiin (esim. suhde taulusta toiseen) noudatettavaksi. [SQLite ei oletuksena käytä tätä](https://www.sqlite.org/foreignkeys.html), mutta validoinnin ja tietojen eheyden vuoksi se tulisi ottaa käyttöön.               |
| `encoding='UTF-8'`       | [Oletuskoodaus](https://www.sqlite.org/pragma.html#pragma_encoding) kehittäjän mielenrauhan varmistamiseksi.                                                                                                                                                |
> Kaikki muut oletusarvot ovat SQLitesta, kuten on määritelty [virallisessa PRAGMA-dokumentaatiossa](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Samanaikaisuus {#concurrency}

> **yhteenveto;** Käytämme `WebSocket`-yhteyttä samanaikaisiin lukuihin ja kirjoituksiin salatuissa SQLite-sähköpostilaatikoissasi.

#### Luvut {#reads}

Sähköpostiohjelmasi puhelimessa saattaa ratkaista `imap.forwardemail.net` osoittamaan johonkin Digital Oceanin IP-osoitteista – ja työpöytäasiakas saattaa ratkaista eri IP-osoitteen toiselta [palveluntarjoajalta](#providers).

Riippumatta siitä, mihin IMAP-palvelimeen sähköpostiohjelmasi yhdistää, haluamme yhteyden lukevan tietokannastasi reaaliajassa 100 % tarkkuudella. Tämä toteutetaan WebSocketien avulla.

#### Kirjoitukset {#writes}

Tietokantaan kirjoittaminen on hieman erilaista – koska SQLite on upotettu tietokanta ja sähköpostilaatikkosi sijaitsee oletuksena yhdessä tiedostossa.

Olimme tutkineet vaihtoehtoja kuten `litestream`, `rqlite` ja `dqlite` alla – mutta mikään näistä ei täyttänyt vaatimuksiamme.

Kirjoitusten toteuttamiseksi kirjoitusennakoinnin ("[WAL](https://www.sqlite.org/wal.html)") ollessa käytössä – meidän täytyy varmistaa, että vain yksi palvelin ("Primary") on vastuussa tästä. [WAL](https://www.sqlite.org/wal.html) nopeuttaa merkittävästi samanaikaisuutta ja sallii yhden kirjoittajan ja useita lukijoita.

Primary-palvelin toimii datapalvelimilla, joissa on liitetyt volumet, jotka sisältävät salatut sähköpostilaatikot. Jakelun näkökulmasta voit pitää kaikkia yksittäisiä IMAP-palvelimia `imap.forwardemail.net` takana toissijaisina palvelimina ("Secondary").

Saavutamme kaksisuuntaisen viestinnän [WebSocketien](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) avulla:

* Primary-palvelimet käyttävät [ws](https://github.com/websockets/ws) -kirjaston `WebSocketServer`-instanssia.
* Secondary-palvelimet käyttävät [ws](https://github.com/websockets/ws) -kirjaston `WebSocket`-asiakasinstanssia, joka on kääritty [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) ja [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) -kirjastoilla. Nämä kaksi käärettä varmistavat, että `WebSocket` yhdistää uudelleen ja voi lähettää sekä vastaanottaa dataa tiettyjä tietokantakirjoituksia varten.

### Varotoimet {#backups}

> **yhteenveto;** Salattujen sähköpostilaatikoidesi varmuuskopiot tehdään päivittäin. Voit myös välittömästi pyytää uutta varmuuskopiota tai ladata viimeisimmän varmuuskopion milloin tahansa osoitteesta <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Alias-nimet.

Varmuuskopioita varten suoritetaan yksinkertaisesti SQLite-komento `VACUUM INTO` joka päivä IMAP-komentojen käsittelyn aikana, joka hyödyntää salaustasi muistissa olevasta IMAP-yhteydestä. Varmuuskopiot tallennetaan, jos olemassa olevaa varmuuskopiota ei havaita tai jos tiedoston [SHA-256](https://en.wikipedia.org/wiki/SHA-2) -tiiviste on muuttunut verrattuna viimeisimpään varmuuskopioon.

Huomaa, että käytämme `VACUUM INTO` -komentoa sisäänrakennetun `backup`-komennon sijaan, koska jos sivua muokataan `backup`-komennon aikana, komennon täytyy aloittaa alusta. `VACUUM INTO` ottaa tilannevedoksen. Katso näitä kommentteja [GitHubissa](https://github.com/benbjohnson/litestream.io/issues/56) ja [Hacker Newsissa](https://news.ycombinator.com/item?id=31387556) lisätietoja varten.

Lisäksi käytämme `VACUUM INTO`-komentoa `backup`-komennon sijaan, koska `backup`-komento jättäisi tietokannan hetkeksi salaamattomaksi, kunnes `rekey` suoritetaan (katso tämä GitHub-kommentti [tästä](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) lisätietoja varten).

Secondary ohjaa Primarya `WebSocket`-yhteyden kautta suorittamaan varmuuskopion – ja Primary vastaanottaa komennon ja suorittaa sen jälkeen:

1. Yhdistää salattuun sähköpostilaatikkoosi.
2. Hankkii kirjoituslukon.
3. Suorittaa WAL-tarkistuspisteen komennolla `wal_checkpoint(PASSIVE)`.
4. Suorittaa SQLite-komennon `VACUUM INTO`.
5. Varmistaa, että kopioitu tiedosto voidaan avata salasanalla (turvatoimi).
6. Lataa sen Cloudflare R2 -palveluun tallennusta varten (tai omaan palveluntarjoajaasi, jos määritelty).
<!--
7. Pakkaa tuloksena oleva varmuuskopiotiedosto `gzip`-komennolla.
8. Lataa se Cloudflare R2:een tallennusta varten (tai omaan palveluntarjoajaasi, jos määritelty).
-->

Muista, että postilaatikkosi ovat salattuja – ja vaikka meillä on IP-rajoituksia ja muita todennustoimia WebSocket-yhteyksille – pahantekijän tapauksessa voit olla varma, että ellei WebSocketin sisältö sisällä IMAP-salasanaasi, se ei voi avata tietokantaasi.

Tällä hetkellä tallennetaan vain yksi varmuuskopio per postilaatikko, mutta tulevaisuudessa saatamme tarjota pisteaikapalautuksen ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Haku {#search}

IMAP-palvelimemme tukevat `SEARCH`-komentoa monimutkaisilla hauilla, säännöllisillä lausekkeilla ja muulla.

Nopea hakutoiminto on mahdollista [FTS5](https://www.sqlite.org/fts5.html) ja [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex) ansiosta.

Tallennamme `Date`-arvot SQLite-postilaatikoihin [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) -merkkijonoina käyttäen [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) -metodia (UTC-aikavyöhykkeellä, jotta yhtäsuuruusvertailut toimivat oikein).

Indeksit tallennetaan myös kaikille ominaisuuksille, joita haussa käytetään.

### Projektit {#projects}

Tässä on taulukko, joka kuvaa lähdekoodissamme ja kehitysprosessissamme käyttämiämme projekteja (aakkosjärjestyksessä):

| Projekti                                                                                     | Tarkoitus                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                         | DevOps-automaatioalusta, jolla ylläpidämme, skaalaamme ja hallinnoimme koko palvelinlaivastoamme helposti.                                                                                                                                                                                                                                                        |
| [Bree](https://github.com/breejs/bree)                                                      | Työaikatauluttaja Node.js:lle ja JavaScriptille, tukee cronia, päivämääriä, ms, later-kirjastoa ja ihmisläheistä käyttöä.                                                                                                                                                                                                                                         |
| [Cabin](https://github.com/cabinjs/cabin)                                                   | Kehittäjäystävällinen JavaScript- ja Node.js-lokin kirjastona, jossa huomioidaan turvallisuus ja yksityisyys.                                                                                                                                                                                                                                                     |
| [Lad](https://github.com/ladjs/lad)                                                         | Node.js-kehys, joka pyörittää koko arkkitehtuurimme ja suunnittelumme MVC:llä ja muulla.                                                                                                                                                                                                                                                                          |
| [MongoDB](https://www.mongodb.com/)                                                         | NoSQL-tietokantaratkaisu, jota käytämme kaiken muun datan tallentamiseen postilaatikoiden ulkopuolella (esim. tilisi, asetukset, domainit ja alias-määritykset).                                                                                                                                                                                                   |
| [Mongoose](https://github.com/Automattic/mongoose)                                          | MongoDB:n objektidokumenttimallinnus ("ODM"), jota käytämme koko pinossamme. Kirjoitimme erityisiä apuvälineitä, jotka mahdollistavat **Mongoose:n käytön SQLite:n kanssa** :tada:                                                                                                                                                                               |
| [Node.js](https://nodejs.org/en)                                                            | Node.js on avoimen lähdekoodin, monialustainen JavaScript-ajoympäristö, joka pyörittää kaikkia palvelinprosessejamme.                                                                                                                                                                                                                                             |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                      | Node.js-paketti sähköpostien lähettämiseen, yhteyksien luomiseen ja muuhun. Olemme tämän projektin virallinen sponsori.                                                                                                                                                                                                                                            |
| [Redis](https://redis.io/)                                                                  | Muistipohjainen tietokanta välimuistille, julkaisutilaus-kanaville ja DNS over HTTPS -pyynnöille.                                                                                                                                                                                                                                                                  |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                  | Salauslaajennus SQLite:lle, joka mahdollistaa koko tietokantatiedostojen salaamisen (mukaan lukien write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                              |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                 | Visuaalinen SQLite-editori (jota voit myös käyttää) kehityspostilaatikoiden testaamiseen, lataamiseen ja tarkasteluun.                                                                                                                                                                                                                                           |
| [SQLite](https://www.sqlite.org/about.html)                                                 | Upotettu tietokantakerros skaalautuvaan, itsenäiseen, nopeaan ja vikasietoiseen IMAP-tallennukseen.                                                                                                                                                                                                                                                                |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                  | Node.js:n roskapostinestotyökalu, sähköpostisuodatus ja kalastelunestotoiminto (vaihtoehtomme [Spam Assassinille](https://spamassassin.apache.org/) ja [rspamdille](https://github.com/rspamd/rspamd)).                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                             | DNS over HTTPS -pyynnöt Node.js:llä ja välimuisti Redisillä – joka takaa globaalin yhdenmukaisuuden ja paljon muuta.                                                                                                                                                                                                                                             |
| [Thunderbird](https://www.thunderbird.net/)                                                 | Kehitystiimimme käyttää tätä (ja suosittelee myös) **ensisijaisena sähköpostiohjelmana Forward Emailin kanssa**.                                                                                                                                                                                                                                                 |
| [UTM](https://github.com/utmapp/UTM)                                                        | Kehitystiimimme käyttää tätä luodakseen virtuaalikoneita iOS:lle ja macOS:lle testatakseen eri sähköpostiohjelmia (samanaikaisesti) IMAP- ja SMTP-palvelimillamme.                                                                                                                                                                                               |
| [Ubuntu](https://ubuntu.com/download/server)                                                | Moderni avoimen lähdekoodin Linux-pohjainen palvelinkäyttöjärjestelmä, joka pyörittää koko infrastruktuuriamme.                                                                                                                                                                                                                                                  |
| [WildDuck](https://github.com/nodemailer/wildduck)                                          | IMAP-palvelinkirjasto – katso sen muistiinpanot [liitetiedostojen duplikaattien poisto](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) ja [IMAP-protokollan tuki](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                 |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Nopea ja yksinkertainen API-kirjasto Node.js:lle SQLite3:n ohjelmalliseen käyttöön.                                                                                                                                                                                                                                                                                |
| [email-templates](https://github.com/forwardemail/email-templates)                          | Kehittäjäystävällinen sähköpostikehys mukautettujen sähköpostien luomiseen, esikatseluun ja lähettämiseen (esim. tilitiedotteet ja muuta).                                                                                                                                                                                                                         |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                      | SQL-kyselyrakentaja, joka käyttää Mongo-tyylistä syntaksia. Tämä säästää kehitystiimimme aikaa, koska voimme jatkaa Mongo-tyylin kirjoittamista koko pinossa tietokantariippumattomalla lähestymistavalla. **Se auttaa myös välttämään SQL-injektiohyökkäyksiä käyttämällä kyselyparametreja.**                                                               |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                      | SQL-työkalu olemassa olevan tietokantarakenteen tietojen poimimiseen. Tämä mahdollistaa meille helpon validoinnin, että kaikki indeksit, taulut, sarakkeet, rajoitteet ja muut ovat oikeita ja `1:1` sellaisia kuin niiden pitää olla. Kirjoitimme jopa automatisoituja apuvälineitä uusien sarakkeiden ja indeksien lisäämiseen, jos tietokantarakenteisiin tehdään muutoksia (erittäin yksityiskohtaisella virheilmoituksella). |
| [knex](https://github.com/knex/knex)                                                      | SQL-kyselyrakentaja, jota käytämme vain tietokantamigraatioihin ja skeeman validointiin `knex-schema-inspector`-työkalun kautta.                                                                                                                                                                                                                                  |
| [mandarin](https://github.com/ladjs/mandarin)                                             | Automaattinen [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) -lausekekäännös, joka tukee Markdownia käyttäen [Google Cloud Translation API:a](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                  |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                       | Node.js-paketti MX-palvelimien ratkaisemiseen ja yhteyksien muodostamiseen sekä virheiden käsittelyyn.                                                                                                                                                                                                                                                             |
| [pm2](https://github.com/Unitech/pm2)                                                     | Node.js:n tuotantoprosessien hallintaohjelma sisäänrakennetulla kuormantasaimella ([hienosäädetty](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) suorituskyvyn parantamiseksi).                                                                                                                                                              |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                  | SMTP-palvelinkirjasto – käytämme tätä postinvaihto- ("MX") ja lähtevien SMTP-palvelimien toteutukseen.                                                                                                                                                                                                                                                             |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                             | Kätevä työkalu IMAP-palvelimien testaamiseen vertailuarvoja ja RFC-spesifikaation IMAP-protokollan yhteensopivuutta vastaan. Tämä projekti on luotu [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) -tiimin toimesta (aktiivinen avoimen lähdekoodin IMAP- ja POP3-palvelin vuodesta 2002). Testasimme IMAP-palvelintamme laajasti tällä työkalulla.                                    |
> Löydät muita käyttämiämme projekteja [lähdekoodistamme GitHubissa](https://github.com/forwardemail).

### Tarjoajat {#providers}

| Tarjoaja                                        | Tarkoitus                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | DNS-tarjoaja, terveystarkastukset, kuormantasaimet ja varastointivaraukset käyttäen [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Lähdekoodin isännöinti, CI/CD ja projektinhallinta.                                                                          |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Omistettu palvelin ja hallinnoidut tietokannat.                                                                              |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Omistettu palvelin.                                                                                                           |
| [DataPacket](https://www.datapacket.com)        | Omistettu palvelin.                                                                                                           |


## Ajatuksia {#thoughts}

### Periaatteet {#principles}

Forward Email on suunniteltu näiden periaatteiden mukaisesti:

1. Ole aina kehittäjäystävällinen, turvallisuus- ja yksityisyyskeskeinen sekä läpinäkyvä.
2. Noudata [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occamin partaveitsiä](https://en.wikipedia.org/wiki/Occam%27s_razor) ja [dogfoodingia](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Kohdista pieneen, itse rahoitettuun ja [ramen-voittoiseen](http://www.paulgraham.com/ramenprofitable.html) kehittäjään.

### Kokeilut {#experiments}

> **tldr;** Lopulta S3-yhteensopivan objektivaraston ja/tai virtuaalitaulujen käyttäminen ei ole teknisesti toteuttamiskelpoinen suorituskykyrajoitusten vuoksi ja on altis virheille muistirajoitusten takia.

Olemme tehneet muutamia kokeiluja, jotka johtivat yllä käsiteltyyn lopulliseen SQLite-ratkaisuun.

Yksi näistä oli yrittää käyttää [rclonea]() ja SQLitea yhdessä S3-yhteensopivan tallennuskerroksen kanssa.

Tämä kokeilu auttoi meitä ymmärtämään ja löytämään reunatapauksia liittyen rcloneen, SQLiteen ja [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) -käyttöön:

* Jos otat käyttöön `--vfs-cache-mode writes` -lipun rclonessa, lukeminen toimii hyvin, mutta kirjoitukset välimuistitetaan.
  * Jos sinulla on useita maailmanlaajuisesti hajautettuja IMAP-palvelimia, välimuisti ei synkronoidu niiden välillä, ellei sinulla ole yhtä kirjoittajaa ja useita kuuntelijoita (esim. pub/sub-malli).
  * Tämä on uskomattoman monimutkaista, ja lisämonimutkaisuus johtaa useampiin yksittäisiin vikapisteisiin.
  * S3-yhteensopivat tallennuspalvelut eivät tue osittaisia tiedostomuutoksia – mikä tarkoittaa, että `.sqlite`-tiedoston jokainen muutos johtaa koko tietokannan uudelleenlähetykseen.
  * Muita ratkaisuja kuten `rsync` on olemassa, mutta ne eivät tue kirjoituslokia ("[WAL](https://www.sqlite.org/wal.html)") – joten päädyimme tarkastelemaan Litestreamiä. Onneksi salauksemme salaa jo [WAL](https://www.sqlite.org/wal.html) -tiedostot, joten emme tarvitse Litestreamiä siihen. Emme kuitenkaan olleet vielä varmoja Litestreamin tuotantokäytöstä ja alla on muutama huomio siitä.
  * Tämän `--vfs-cache-mode writes` -vaihtoehdon (ainoa tapa käyttää SQLitea kirjoituksiin rclonen yli) käyttäminen yrittää kopioida koko tietokannan alusta alkaen muistiin – yhden 10 GB postilaatikon käsittely on ok, mutta useiden erittäin suurten postilaatikoiden käsittely johtaa IMAP-palvelimien muistirajoituksiin, `ENOMEM`-virheisiin, segmentointivirheisiin ja tietojen vioittumiseen.
* Jos yrität käyttää SQLite [Virtuaalitauluja](https://www.sqlite.org/vtab.html) (esim. [s3db](https://github.com/jrhy/s3db)) saadaksesi datan elämään S3-yhteensopivalla tallennuskerroksella, kohtaat useita muita ongelmia:
  * Lukeminen ja kirjoittaminen on erittäin hidasta, koska S3-API-päätepisteisiin täytyy tehdä HTTP `GET`, `PUT`, `HEAD` ja `POST` -kutsuja.
  * Kehitystesteissä yli 500K-1M+ tietueen käsittely kuitu-internet-yhteydellä rajoittui edelleen S3-yhteensopivien tarjoajien kirjoitus- ja lukunopeuteen. Esimerkiksi kehittäjämme suorittivat `for`-silmukoita sekä peräkkäisille SQL `INSERT` -lauseille että suurten tietomäärien massakirjoituksille. Molemmissa tapauksissa suorituskyky oli hämmästyttävän hidas.
  * Virtuaalitauluilla **ei voi olla indeksejä**, `ALTER TABLE` -lauseita eikä [muita](https://stackoverflow.com/a/12507650) [rajoituksia](https://sqlite.org/lang_createvtab.html) – mikä johtaa jopa 1-2 minuutin tai pidempiin viiveisiin datan määrästä riippuen.
  * Objektit tallennettiin salaamattomina eikä natiivisti saatavilla ole salaustukea.
* Tutkimme myös [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) -projektia, joka on konseptuaalisesti ja teknisesti samanlainen kuin edellinen kohta (siis samat ongelmat). Mahdollisuus olisi käyttää räätälöityä `sqlite3`-käännöstä, joka on kääritty salauksella kuten [wxSQLite3](https://github.com/utelle/wxsqlite3) (jota käytämme ratkaisussamme yllä) muokkaamalla [asetustiedostoa](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Toinen mahdollinen lähestymistapa oli käyttää [multiplex-laajennusta](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), mutta siinä on 32 GB:n rajoitus ja se vaatisi monimutkaista rakentamista ja kehitystyötä.
* `ALTER TABLE` -lauseita tarvitaan (joten virtuaalitaulut ovat täysin poissuljettu vaihtoehto). Tarvitsemme `ALTER TABLE` -lauseita, jotta `knex-schema-inspector` -hookimme toimii oikein – tämä varmistaa, ettei data vahingoitu ja haetut rivit voidaan muuntaa kelvollisiksi dokumenteiksi `mongoose`-skeemojen mukaan (mukaan lukien rajoitteet, muuttujatyypit ja mielivaltaiset datan validoinnit).
* Lähes kaikki S3-yhteensopivat SQLite-projektit avoimen lähdekoodin yhteisössä ovat Pythonilla (eivät JavaScriptillä, jota käytämme koko pinossamme).
* Pakkauskirjastot kuten [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (katso [kommentit](https://news.ycombinator.com/item?id=32303762)) vaikuttavat lupaavilta, mutta [eivät ehkä ole vielä valmiita tuotantokäyttöön](https://github.com/phiresky/sqlite-zstd#usage). Sen sijaan sovelluspuolen pakkaus datatyypeille kuten `String`, `Object`, `Map`, `Array`, `Set` ja `Buffer` on siistimpi ja helpompi lähestymistapa (ja helpompi myös migroida, koska voisimme tallentaa `Boolean`-lipun tai sarakkeen – tai käyttää `PRAGMA` `user_version=1` pakkausta varten tai `user_version=0` ilman pakkausta tietokannan metatietona).
  * Onneksi meillä on jo liitetiedostojen duplikaattien poisto toteutettuna IMAP-palvelimen tallennuksessa – näin jokainen viesti, jossa on sama liite, ei säilytä kopiota liitteestä – vaan yksi liite tallennetaan useille viesteille ja ketjuille postilaatikossa (ja vierasviite käytetään sen jälkeen).
* Litestream-projekti, joka on SQLite:n replikaatio- ja varmuuskopiointiratkaisu, on erittäin lupaava ja todennäköisesti käytämme sitä tulevaisuudessa.
  * Emme halua vähätellä tekijöitä – koska rakastamme heidän työtään ja panostuksiaan avoimeen lähdekoodiin yli vuosikymmenen ajan – mutta käytännön kokemusten perusteella näyttää siltä, että [ongelmia](https://github.com/benbjohnson/litestream/issues) ja [mahdollisia tietojen menetyksiä](https://github.com/benbjohnson/litestream/issues/218) voi esiintyä.
* Varmuuskopioiden palautuksen tulee olla kitkatonta ja yksinkertaista. Ratkaisut kuten MongoDB `mongodump`- ja `mongoexport`-työkaluilla ovat paitsi työläitä, myös aikaa vieviä ja konfigurointinsa puolesta monimutkaisia.
  * SQLite-tietokannat tekevät siitä helppoa (se on yksi tiedosto).
  * Halusimme suunnitella ratkaisun, jossa käyttäjät voivat ottaa postilaatikkonsa ja poistua milloin tahansa.
    * Yksinkertaiset Node.js-komennot kuten `fs.unlink('mailbox.sqlite')` poistaa tiedoston pysyvästi levyltä.
    * Vastaavasti voimme käyttää S3-yhteensopivaa APIa HTTP `DELETE` -kutsulla helposti poistaaksemme snapshotit ja varmuuskopiot käyttäjiltä.
  * SQLite oli yksinkertaisin, nopein ja kustannustehokkain ratkaisu.
### Vaihtoehtojen puute {#lack-of-alternatives}

Tietojemme mukaan mikään muu sähköpostipalvelu ei ole suunniteltu tällä tavalla eikä ole avoimen lähdekoodin.

*Uskomme tämän johtuvan* siitä, että olemassa olevilla sähköpostipalveluilla on tuotannossa vanhentunutta teknologiaa, jossa on [spagettikoodia](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Useimmat, elleivät kaikki, nykyiset sähköpostipalveluntarjoajat ovat joko suljetun lähdekoodin tai mainostavat olevansa avoimen lähdekoodin, **mutta todellisuudessa vain niiden käyttöliittymä on avoimen lähdekoodin.**

**Sähköpostin herkin osa** (varsinainen tallennus/IMAP/SMTP-vuorovaikutus) **toteutetaan kokonaan taustapalvelimella (serverillä), eikä *asiakaspuolella* (clientissä).**

### Kokeile Forward Emailia {#try-out-forward-email}

Rekisteröidy tänään osoitteessa <https://forwardemail.net>! :rocket:
