# Miksi avoimen lähdekoodin sähköposti on tulevaisuus: Sähköpostin edelleenlähetyksen etu {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="laiska" src="/img/articles/open-source.webp" alt="" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Avoimen lähdekoodin etu: enemmän kuin pelkkä markkinointi](#the-open-source-advantage-more-than-just-marketing)
  * [Mitä todellinen avoimen lähdekoodin tarkoittaa](#what-true-open-source-means)
  * [Taustaongelma: Useimmat "avoimen lähdekoodin" sähköpostipalvelut jäävät vajaaksi](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Lähetä sähköposti edelleen: 100 % avoin lähdekoodi, käyttöliittymä JA tausta](#forward-email-100-open-source-frontend-and-backend)
  * [Ainutlaatuinen tekninen lähestymistapamme](#our-unique-technical-approach)
* [Itseisännöintivaihtoehto: valinnanvapaus](#the-self-hosting-option-freedom-of-choice)
  * [Miksi tuemme itsepalvelumajoitusta](#why-we-support-self-hosting)
  * [Itsepalvelusähköpostin todellisuus](#the-reality-of-self-hosting-email)
* [Miksi maksullisessa palvelussamme on järkeä (vaikka olemmekin avoimen lähdekoodin palveluja)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Kustannusten vertailu](#cost-comparison)
  * [Ihanneratkaisu](#the-best-of-both-worlds)
* [Suljetun lähteen petos: mitä Proton ja Tutanota eivät kerro sinulle](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mailin avoimen lähdekoodin väitteet](#proton-mails-open-source-claims)
  * [Tutanotan samanlainen lähestymistapa](#tutanotas-similar-approach)
  * [Tietosuojaoppaiden keskustelu](#the-privacy-guides-debate)
* [Tulevaisuus on avoimen lähdekoodin](#the-future-is-open-source)
  * [Miksi avoin lähdekoodi voittaa](#why-open-source-is-winning)
* [Vaihda sähköpostin edelleenlähetykseen](#making-the-switch-to-forward-email)
* [Johtopäätös: avoimen lähdekoodin sähköposti yksityistä tulevaisuutta varten](#conclusion-open-source-email-for-a-private-future)

## Esipuhe {#foreword}

Aikakaudella, jolloin digitaaliseen tietosuojaan liittyvät huolenaiheet ovat kaikkien aikojen korkeimmillaan, valitsemamme sähköpostipalvelut ovat tärkeämpiä kuin koskaan. Vaikka monet palveluntarjoajat väittävät priorisoivansa yksityisyyttäsi, on olemassa perustavanlaatuinen ero niiden välillä, jotka vain puhuvat yksityisyydestä, ja niiden välillä, jotka todella kävelevät. Forward Emailissa olemme rakentaneet palvelumme täydellisen läpinäkyvyyden perustalle avoimen lähdekoodin kehittämisen avulla – ei vain käyttöliittymäsovelluksissamme vaan koko infrastruktuurissamme.

Tämä blogiviesti tutkii, miksi avoimen lähdekoodin sähköpostiratkaisut ovat parempia kuin suljetun lähdekoodin vaihtoehdot, kuinka lähestymistapamme eroaa kilpailijoista, kuten Proton Mail ja Tutanota, ja miksi – huolimatta sitoutumisestamme itseisännöintivaihtoehtoihin – maksullinen palvelumme tarjoaa parhaan vastineen useimmille käyttäjille.

## Avoimen lähdekoodin etu: Enemmän kuin vain markkinointia {#the-open-source-advantage-more-than-just-marketing}

Termistä "avoimen lähdekoodin" on tullut viime vuosina suosittu markkinointisana, ja avoimen lähdekoodin palvelumarkkinoiden ennustetaan kasvavan maailmanlaajuisesti yli 16 prosentin vuotuisella kasvuvauhdilla vuosien 2024 ja 2032 välillä\[^1]. Mutta mitä aidosti avoimen lähdekoodin palvelu tarkoittaa, ja miksi sillä on merkitystä sähköpostin yksityisyyden kannalta?

### Mitä aito avoimen lähdekoodin tarkoittaa {#what-true-open-source-means}

Avoimen lähdekoodin ohjelmisto antaa koko lähdekoodinsa vapaasti kaikkien tarkastettavaksi, muokattavaksi ja parantamiseksi. Tämä läpinäkyvyys luo ympäristön, jossa:

* Maailmanlaajuinen kehittäjäyhteisö voi tunnistaa ja korjata tietoturvahaavoittuvuudet
* Tietosuojaväitteet voidaan varmistaa riippumattoman koodin tarkistuksen avulla
* Käyttäjät eivät ole sidottuja suljetun sektorin ekosysteemeihin
* Innovaatioita tapahtuu nopeammin yhteistyöhön perustuvan parantamisen avulla

Mitä tulee sähköpostiin – verkkoidentiteettisi selkäranka – tämä läpinäkyvyys ei ole vain mukavaa; se on välttämätöntä aidon yksityisyyden ja turvallisuuden kannalta.

### Taustajärjestelmän ongelma: Missä useimmat "avoimen lähdekoodin" sähköpostipalvelut jäävät vajaaksi {#the-backend-problem-where-most-open-source-email-services-fall-short}

Tässä kohtaa asiat muuttuvat mielenkiintoisiksi. Monet suositut "yksityisyyteen keskittyvät" sähköpostipalveluntarjoajat mainostavat itseään avoimen lähdekoodin palveluntarjoajina, mutta on olemassa tärkeä ero, jota he toivovat sinun olevan huomaamatta: **he tekevät avoimen lähdekoodin vain käyttöliittymänsä pitäen taustansa suljettuina**.

Mitä tämä tarkoittaa? Käyttöliittymä on se, mitä näet ja jonka kanssa olet vuorovaikutuksessa – verkkokäyttöliittymä tai mobiilisovellus. Varsinainen sähköpostin käsittely tapahtuu taustajärjestelmässä – jossa viestisi tallennetaan, salataan ja lähetetään. Kun palveluntarjoaja pitää taustansa suljettuna lähdekoodina:

1. Et voi varmistaa, miten sähköpostejasi todella käsitellään.
2. Et voi vahvistaa, ovatko heidän yksityisyyttään koskevat väitteensä oikeutettuja.
3. Luotat markkinointiväitteisiin todennettavan koodin sijaan.
4. Tietoturvahaavoittuvuudet saattavat pysyä piilossa julkiselta tarkastelulta.

Kuten Privacy Guides -foorumeilla käydyissä keskusteluissa on korostunut, sekä Proton Mail että Tutanota väittävät olevansa avoimen lähdekoodin palveluita, mutta niiden taustajärjestelmät pysyvät suljettuina ja suljetuina\[^2]. Tämä luo merkittävän luottamuskuilun – sinua pyydetään uskomaan heidän tietosuojalupauksiinsa ilman, että voit varmistaa niiden paikkansapitävyyden.

## Sähköpostin edelleenlähetys: 100 % avoimen lähdekoodin, käyttöliittymä JA taustajärjestelmä {#forward-email-100-open-source-frontend-and-backend}

Forward Emaililla olemme omaksuneet perustavanlaatuisen erilaisen lähestymistavan. Koko koodikanta – sekä käyttöliittymä että taustajärjestelmä – on avoimen lähdekoodin ja kaikkien saatavilla osoitteessa <https://github.com/forwardemail/forwardemail.net>.

Tämä tarkoittaa:

1. **Täydellinen läpinäkyvyys**: Jokainen sähköpostiasi käsittelevä koodirivi on julkisesti tarkasteltavissa.

2. **Todennettavissa oleva yksityisyys**: Tietosuojaväitteemme eivät ole markkinointikieltä – ne ovat todennettavissa olevia faktoja, jotka kuka tahansa voi vahvistaa tutkimalla koodiamme.

3. **Yhteisölähtöinen tietoturva**: Tietoturvaamme vahvistaa maailmanlaajuisen kehittäjäyhteisön yhteinen asiantuntemus.

4. **Ei piilotettuja toimintoja**: Saat mitä näet – ei piilotettua seurantaa, ei salaisia takaportteja.

### Ainutlaatuinen tekninen lähestymistapamme {#our-unique-technical-approach}

Sitoutumisemme yksityisyyteen ylittää vain avoimen lähdekoodin. Olemme ottaneet käyttöön useita teknisiä innovaatioita, jotka erottavat meidät muista:

#### Yksittäin salatut SQLite-postilaatikot {#individually-encrypted-sqlite-mailboxes}

Toisin kuin perinteiset sähköpostipalveluntarjoajat, jotka käyttävät jaettuja relaatiotietokantoja (joissa yksittäinen tietomurto voi paljastaa kaikkien käyttäjien tiedot), käytämme erikseen salattuja SQLite-tiedostoja jokaisessa postilaatikossa. Tämä tarkoittaa:

* Jokainen postilaatikko on erillinen salattu tiedosto
* Yhden käyttäjän tietojen käyttöoikeus ei anna pääsyä muille
* Edes omat työntekijämme eivät pääse käsiksi tietoihisi – se on keskeinen suunnittelupäätös

Kuten selostimme Privacy Guides -keskusteluissa:

> "Jaetut relaatiotietokannat (esim. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL jne.) vaativat kirjautumisen (käyttäjätunnuksella ja salasanalla) tietokantayhteyden muodostamiseksi. Tämä tarkoittaa, että kuka tahansa tällä salasanalla voi tehdä tietokannasta kyselyjä mitä tahansa. Olipa kyseessä sitten epärehellinen työntekijä tai ilkeä piikahyökkäys. Tämä tarkoittaa myös sitä, että yhden käyttäjän tietojen käyttöoikeus tarkoittaa myös kaikkien muiden tietojen käyttöoikeutta. Toisaalta SQLiteä voitaisiin pitää jaettuna tietokantana, mutta käyttötapamme (jokainen postilaatikko = yksittäinen SQLite-tiedosto) tekee siitä hiekkalaatikossa toimivan."\[^3]

#### Kvanttisuojattu salaus {#quantum-resistant-encryption}

Vaikka muut palveluntarjoajat ovat vielä kuromassa kiinni, olemme jo ottaneet käyttöön kvanttiresistenttejä salausmenetelmiä suojataksemme sähköpostisi yksityisyyttäsi kvanttilaskennan uusilta uhilta.

#### Ei kolmannen osapuolen riippuvuuksia {#no-third-party-dependencies}

Toisin kuin kilpailijat, jotka luottavat sähköpostin toimittamiseen Amazon SES:n kaltaisiin palveluihin, olemme rakentaneet koko infrastruktuurimme talon sisällä. Tämä eliminoi mahdolliset tietosuojavuodot kolmannen osapuolen palveluiden kautta ja antaa meille täydellisen hallinnan koko sähköpostiputkesta.

## Itsepalveluvaihtoehto: Valinnanvapaus {#the-self-hosting-option-freedom-of-choice}

Yksi avoimen lähdekoodin ohjelmistojen tehokkaimmista puolista on sen tarjoama vapaus. Forward Email -palvelun avulla et ole koskaan lukittu sisään – voit halutessasi isännöidä koko alustamme itse.

### Miksi tuemme itsepalvelua {#why-we-support-self-hosting}

Uskomme, että käyttäjät voivat hallita tietojaan täydellisesti. Siksi olemme tehneet koko alustamme itseisännöivän kattavan dokumentaation ja asennusoppaiden avulla. Tämä lähestymistapa:

* Tarjoaa maksimaalisen hallinnan teknisesti taipuvaisille käyttäjille
* Poistaa tarpeen luottaa meihin palveluntarjoajana
* Mahdollistaa räätälöinnin tiettyjen vaatimusten täyttämiseksi
* Varmistaa, että palvelu voi jatkua, vaikka yrityksemme ei pystyisikään

### Itsepalvelusähköpostin todellisuus {#the-reality-of-self-hosting-email}

Vaikka itsepalvelu on tehokas vaihtoehto, on tärkeää ymmärtää todelliset kustannukset:

#### Taloudelliset kustannukset {#financial-costs}

* VPS- tai palvelinkustannukset: 5–50 dollaria/kuukausi perusasennukselle\[^4]
* Verkkotunnuksen rekisteröinti ja uusiminen: 10–20 dollaria/vuosi
* SSL-varmenteet (vaikka Let's Encrypt tarjoaa ilmaisia vaihtoehtoja)
* Mahdolliset valvontapalveluiden ja varmuuskopiointiratkaisujen kustannukset

#### Aikakustannukset {#time-costs}

* Alkuasennus: Useista tunneista päiviin teknisestä asiantuntemuksesta riippuen
* Jatkuva ylläpito: 5–10 tuntia kuukaudessa päivityksiin, tietoturvakorjauksiin ja vianmääritykseen\[^5]
* Oppimiskäyrä: Sähköpostiprotokollien, tietoturvan parhaiden käytäntöjen ja palvelimen hallinnan ymmärtäminen

#### Tekniset haasteet {#technical-challenges}

* Sähköpostin toimitettavuusongelmat (viestien merkitseminen roskapostiksi)
* Kehittyvien tietoturvastandardien seuraaminen
* Korkean saatavuuden ja luotettavuuden varmistaminen
* Roskapostin suodatuksen tehokas hallinta

Kuten eräs kokenut itsepalveluylläpitäjä asian ilmaisi: "Sähköposti on hyödykepalvelu... Sähköpostin ylläpito \[palveluntarjoajalla] on halvempaa kuin sen itse ylläpitoon kuluttaa rahaa *ja* aikaa."\[^6]

## Miksi maksullinen palvelumme on järkevä (vaikka olemme avoimen lähdekoodin tuotteita) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Kun otetaan huomioon itseisännöinnin haasteet, maksullinen palvelumme tarjoaa molempien maailmojen parhaat puolet: avoimen lähdekoodin läpinäkyvyyttä ja turvallisuutta sekä hallitun palvelun mukavuutta ja luotettavuutta.

### Kustannusvertailu {#cost-comparison}

Kun huomioidaan sekä taloudelliset että aikakustannukset, maksullinen palvelumme tarjoaa poikkeuksellista lisäarvoa:

* **Itsepalvelun kokonaiskustannukset**: 56–252 dollaria/kk (sisältäen palvelinkustannukset ja ajan arvioinnin)
* **Maksulliset sähköpostin edelleenlähetyspaketit**: 3–9 dollaria/kk

Maksullinen palvelumme tarjoaa:

* Ammattimainen hallinta ja ylläpito
* Vakiintunut IP-maine paremman toimituksen takaamiseksi
* Säännölliset tietoturvapäivitykset ja valvonta
* Tuki ongelmien ilmetessä
* Kaikki avoimen lähdekoodin lähestymistapamme yksityisyydensuojaedut

### Molempien maailmojen parhaat puolet {#the-best-of-both-worlds}

Valitsemalla Lähetä sähköposti eteenpäin, saat:

1. **Todennettavissa oleva yksityisyys**: Avoimen lähdekoodin koodikanta tarkoittaa, että voit luottaa yksityisyysväitteisiimme
2. **Ammattimainen hallinta**: Ei tarvitse ryhtyä sähköpostipalvelinasiantuntijaksi
3. **Kustannustehokkuus**: Alhaisemmat kokonaiskustannukset kuin itse isännöinnissä
4. **Ei sidotusta**: Itse isännöintimahdollisuus on aina käytettävissä

## Suljetun lähdekoodin petos: Mitä Proton ja Tutanota eivät kerro sinulle {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Katsotaanpa tarkemmin, kuinka lähestymistapamme eroaa suosituista "yksityisyyteen keskittyneistä" sähköpostipalveluntarjoajista.

### Proton Mailin avoimen lähdekoodin väitteet {#proton-mails-open-source-claims}

Proton Mail mainostaa itseään avoimen lähdekoodin sovelluksena, mutta tämä koskee vain heidän käyttöliittymäsovelluksiaan. Heidän taustajärjestelmänsä – jossa sähköpostisi itse asiassa käsitellään ja tallennetaan – pysyy suljetun lähdekoodin sovelluksena\[^7]. Tämä tarkoittaa:

* Et voi varmistaa, miten sähköpostejasi käsitellään
* Sinun on luotettava heidän tietosuojaväitteisiinsä ilman vahvistusta
* Heidän taustajärjestelmän tietoturvahaavoittuvuudet pysyvät piilossa julkiselta tarkastelulta
* Olet lukittuna heidän ekosysteemiinsä ilman omatoimisia hosting-vaihtoehtoja

### Tutanotan samankaltainen lähestymistapa {#tutanotas-similar-approach}

Kuten Proton Mail, Tutanota julkaisee avoimen lähdekoodin vain käyttöliittymänsä ja pitää taustansa omistusoikeudella suojattuna\[^8]. He kohtaavat samoja luottamusongelmia:

* Ei keinoa varmistaa taustajärjestelmän tietosuojaväitteitä
* Rajallinen läpinäkyvyys sähköpostin varsinaiseen käsittelyyn
* Mahdolliset tietoturvaongelmat piilotettu julkisesti
* Toimittajariippuvuus ilman itsenäisen ylläpidon vaihtoehtoa

### Tietosuojaoppaiden keskustelu {#the-privacy-guides-debate}

Nämä rajoitukset eivät ole jääneet huomaamatta yksityisyysyhteisössä. Tietosuojaoppaista käydyissä keskusteluissa korostimme tätä kriittistä eroa:

> "Siinä todetaan, että sekä Protonmail että Tuta ovat suljetun lähdekoodin tiedostoja. Koska niiden taustajärjestelmä on todellakin suljetun lähdekoodin tiedostoja."\[^9]

Totesimme myös:

> "Minkään tällä hetkellä listatun PG-sähköpostipalveluntarjoajan taustajärjestelmien infrastruktuureista ei ole tehty julkisesti jaettuja auditointeja eikä heidän saapuvan sähköpostin käsittelystä ole jaettu avoimen lähdekoodin koodinpätkiä."\[^10]

Tämä läpinäkyvyyden puute luo perustavanlaatuisen luottamusongelman. Ilman avoimen lähdekoodin taustaohjelmia käyttäjät pakotetaan ottamaan yksityisyyttä koskevat väitteet uskon perusteella vahvistuksen sijaan.

## Tulevaisuus on avoimen lähdekoodin {#the-future-is-open-source}

Suuntaus kohti avoimen lähdekoodin ratkaisuja kiihtyy koko ohjelmistoteollisuudessa. Tuoreen tutkimuksen mukaan:

* Avoimen lähdekoodin ohjelmistomarkkinat kasvavat 41,83 miljardista dollarista vuonna 2024 48,92 miljardiin dollariin vuonna 2025\[^11]
* 80 % yrityksistä raportoi avoimen lähdekoodin käytön lisääntyneen viimeisen vuoden aikana\[^12]
* Avoimen lähdekoodin käyttöönoton ennustetaan jatkavan nopeaa kasvuaan

Tämä kasvu kuvastaa perustavanlaatuista muutosta siinä, miten ajattelemme ohjelmistojen turvallisuudesta ja yksityisyydestä. Kun käyttäjät ovat tietoisempia yksityisyydestä, avoimen lähdekoodin ratkaisujen todennettavissa olevan yksityisyyden kysyntä vain kasvaa.

### Miksi avoin lähdekoodi on menestys {#why-open-source-is-winning}

Avoimen lähdekoodin edut käyvät yhä selvemmiksi:

1. **Turvallisuutta läpinäkyvyyden kautta**: Avoimen lähdekoodin koodia voivat tarkistaa tuhannet asiantuntijat, ei vain sisäinen tiimi
2. **Nopeampi innovaatio**: Yhteistyössä tehty kehitys nopeuttaa parantamista
3. **Luottamus varmentamisen kautta**: Väitteet voidaan varmentaa sen sijaan, että niihin luotettaisiin uskossa
4. **Vapaus toimittajariippuvuudesta**: Käyttäjät säilyttävät hallinnan tietoihinsa ja palveluihinsa
5. **Yhteisön tuki**: Globaali yhteisö auttaa tunnistamaan ja korjaamaan ongelmia

## Sähköpostin edelleenlähetyksen vaihtaminen {#making-the-switch-to-forward-email}

Eteenpäin sähköpostiin siirtyminen on yksinkertaista, tulitpa sitten yleiseltä palveluntarjoajalta, kuten Gmail, tai muulta yksityisyyteen keskittyvältä palvelulta, kuten Proton Mail tai Tutanota.

Palvelumme tarjoaa:

* Rajoittamaton määrä verkkotunnuksia ja aliaksia
* Vakioprotokollien tuki (SMTP, IMAP, POP3) ilman omia siltoja
* Saumaton integrointi olemassa olevien sähköpostiohjelmien kanssa
* Yksinkertainen asennusprosessi ja kattava dokumentaatio
* Edulliset hinnoittelupaketit alkaen vain 3 dollaria/kk

## Yhteenveto: Avoimen lähdekoodin sähköposti yksityiseen tulevaisuuteen {#conclusion-open-source-email-for-a-private-future}

Maailmassa, jossa digitaalinen yksityisyys on yhä uhattuna, avoimen lähdekoodin ratkaisujen läpinäkyvyys on tärkeä suoja. Forward Emaililla olemme ylpeitä voidessamme olla edelläkävijöitä täysin avoimen lähdekoodin lähestymistavalla sähköpostin tietosuojaan.

Toisin kuin kilpailijat, jotka hyväksyvät avoimen lähdekoodin vain osittain, olemme saaneet koko alustamme – käyttöliittymän ja taustajärjestelmän – julkisen tarkastelun saataville. Tämä sitoutuminen avoimuuteen yhdistettynä innovatiiviseen tekniseen lähestymistapaamme tarjoaa todennettavissa olevan yksityisyyden tason, jota suljetun lähdekoodin vaihtoehdot eivät yksinkertaisesti pysty vastaamaan.

Valitsetpa sitten hallitun palvelumme käyttämisen tai alustamme itseisännöinnin, hyödyt aidosti avoimen lähdekoodin sähköpostin turvallisuudesta, yksityisyydestä ja mielenrauhasta.

Sähköpostin tulevaisuus on avoin, läpinäkyvä ja yksityisyyteen keskittyvä. Tulevaisuus on Lähetä sähköposti.

\[^1]: SNS Insider. "Avoimen lähdekoodin palvelumarkkinoiden arvoksi arvioitiin 28,6 miljardia Yhdysvaltain dollaria vuonna 2023, ja ne saavuttavat 114,8 miljardia Yhdysvaltain dollaria vuoteen 2032 mennessä. Kasvuvauhti on 16,70 % vuoteen 2032 mennessä." [Avoimen lähdekoodin palvelumarkkinoiden koko- ja analyysiraportti 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Tietosuojaoppaiden yhteisö. "Sähköpostin edelleenlähetys (sähköpostipalveluntarjoaja) - Sivuston kehittäminen / Työkaluehdotuksia." [Tietosuojaoppaiden keskustelu](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Tietosuojaoppaiden yhteisö. "Sähköpostin edelleenlähetys (sähköpostipalveluntarjoaja) - Sivuston kehittäminen / Työkaluehdotuksia." [Tietosuojaoppaiden keskustelu](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Yleensä sähköpostipalvelimen ylläpitämiseen käytettävän perusvirtuaalisen yksityispalvelimen (VPS) kuukausikustannukset ovat 5–50 dollaria." [10 parasta käytettävää itseisännöityä sähköpostipalvelinalustaa vuonna 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Postilaatikossa-foorumi. "Ylläpitoon meni ehkä 16 tuntia tuona aikana..." [Itseisännöivä sähköpostipalvelin paheksui](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Kuten kaikki itse isännöity palvelu, SE VAATII AIKAASI. Jos sinulla ei ole aikaa käyttää siihen, on aina parempi pitäytyä isännöidyssä palvelussa..." [Isännöitkö itse sähköpostipalvelinta? Miksi tai miksi ei? Mikä on suosittua?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Sähköpostin edelleenlähetys. "Proton Mail väittää olevansa avoimen lähdekoodin, mutta heidän taustajärjestelmänsä on todellisuudessa suljetun lähdekoodin." [Tutanota vs Proton Mail -vertailu (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Lähetä sähköpostia eteenpäin. "Tutanota väittää olevansa avoimen lähdekoodin ohjelmisto, mutta heidän taustajärjestelmänsä on itse asiassa suljetun lähdekoodin ohjelmisto." [Proton Mail vs Tutanota -vertailu (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Tietosuojaoppaiden yhteisö. "Siinä todetaan, että sekä Protonmail että Tuta ovat suljetun lähdekoodin ohjelmistoja. Koska niiden taustajärjestelmä on todellakin suljetun lähdekoodin ohjelmisto." [Lähetä sähköposti edelleen (sähköpostin tarjoaja) - Sivuston kehitys / työkaluehdotukset](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Tietosuojaoppaiden yhteisö. "Minkään tällä hetkellä listatun PG-sähköpostipalveluntarjoajan taustajärjestelmien infrastruktuureista ei ole tehty julkisesti jaettuja auditointeja eikä heidän saapuvan sähköpostin käsittelystä ole jaettu avoimen lähdekoodin koodinpätkiä." [Lähetä sähköposti edelleen (sähköpostin tarjoaja) - Sivuston kehitys / työkaluehdotukset](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Avoimen lähdekoodin ohjelmistomarkkinat kasvavat 41,83 miljardista Yhdysvaltain dollarista vuonna 2024 48,92 miljardiin Yhdysvaltain dollariin vuonna 2025 yhdistelmä..." [Mikä on avoimen lähdekoodin ohjelmisto?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Koska 80 % yrityksistä raportoi avoimen lähdekoodin teknologioiden käytön lisääntyneen viimeisen vuoden aikana, se on..." [Uusia trendejä avoimen lähdekoodin yhteisöissä 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)