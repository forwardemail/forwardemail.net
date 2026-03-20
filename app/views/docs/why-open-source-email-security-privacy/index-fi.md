# Miksi avoimen lähdekoodin sähköposti on tulevaisuus: Forward Emailin etu {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Avoimen lähdekoodin sähköpostin turvallisuus ja yksityisyys" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Avoimen lähdekoodin etu: enemmän kuin pelkkää markkinointia](#the-open-source-advantage-more-than-just-marketing)
  * [Mitä todellinen avoin lähdekoodi tarkoittaa](#what-true-open-source-means)
  * [Backend-ongelma: missä useimmat "avoin lähdekoodi" -sähköpostipalvelut epäonnistuvat](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100 % avoin lähdekoodi, frontend JA backend](#forward-email-100-open-source-frontend-and-backend)
  * [Meidän ainutlaatuinen tekninen lähestymistapamme](#our-unique-technical-approach)
* [Itseisännöintivaihtoehto: valinnanvapaus](#the-self-hosting-option-freedom-of-choice)
  * [Miksi tuemme itseisännöintiä](#why-we-support-self-hosting)
  * [Itseisännöidyn sähköpostin todellisuus](#the-reality-of-self-hosting-email)
* [Miksi maksullinen palvelumme on järkevä (vaikka olemme avoimen lähdekoodin)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Kustannusvertailu](#cost-comparison)
  * [Parasta molemmista maailmoista](#the-best-of-both-worlds)
* [Suljetun lähdekoodin harhautus: mitä Proton ja Tutanota eivät kerro](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mailin avoimen lähdekoodin väitteet](#proton-mails-open-source-claims)
  * [Tutanotan samanlainen lähestymistapa](#tutanotas-similar-approach)
  * [Yksityisyysoppaiden kiista](#the-privacy-guides-debate)
* [Tulevaisuus on avoin lähdekoodi](#the-future-is-open-source)
  * [Miksi avoin lähdekoodi voittaa](#why-open-source-is-winning)
* [Vaihtaminen Forward Emailiin](#making-the-switch-to-forward-email)
* [Yhteenveto: avoimen lähdekoodin sähköposti yksityiseen tulevaisuuteen](#conclusion-open-source-email-for-a-private-future)


## Esipuhe {#foreword}

Aikana, jolloin digitaalisen yksityisyyden huolenaiheet ovat ennätyskorkealla, valitsemillamme sähköpostipalveluilla on enemmän merkitystä kuin koskaan. Vaikka monet palveluntarjoajat väittävät asettavansa yksityisyytesi etusijalle, on perustavanlaatuinen ero niiden välillä, jotka vain puhuvat yksityisyydestä ja niiden, jotka todella toimivat sen mukaisesti. Forward Emaililla olemme rakentaneet palvelumme täydellisen läpinäkyvyyden pohjalle avoimen lähdekoodin kehityksen kautta — ei pelkästään frontend-sovelluksissamme, vaan koko infrastruktuurissamme.

Tämä blogikirjoitus käsittelee, miksi avoimen lähdekoodin sähköpostiratkaisut ovat parempia kuin suljetun lähdekoodin vaihtoehdot, miten lähestymistapamme eroaa kilpailijoista kuten Proton Mail ja Tutanota, ja miksi — huolimatta sitoutumisestamme itseisännöintivaihtoehtoihin — maksullinen palvelumme tarjoaa parhaan arvon useimmille käyttäjille.


## Avoimen lähdekoodin etu: enemmän kuin pelkkää markkinointia {#the-open-source-advantage-more-than-just-marketing}

Termi "avoin lähdekoodi" on noussut suosituksi markkinointitermiksi viime vuosina, ja maailmanlaajuisen avoimen lähdekoodin palvelumarkkinan ennustetaan kasvavan yli 16 %:n vuotuisella kasvuvauhdilla vuosina 2024–2032\[^1]. Mutta mitä todellinen avoin lähdekoodi tarkoittaa, ja miksi se on tärkeää sähköpostisi yksityisyydelle?

### Mitä todellinen avoin lähdekoodi tarkoittaa {#what-true-open-source-means}

Avoimen lähdekoodin ohjelmisto tekee koko lähdekoodinsa vapaasti saataville kenelle tahansa tarkasteltavaksi, muokattavaksi ja parannettavaksi. Tämä läpinäkyvyys luo ympäristön, jossa:

* Turvallisuusaukot voidaan tunnistaa ja korjata globaalin kehittäjäyhteisön toimesta
* Yksityisyysväitteet voidaan varmistaa riippumattoman koodikatselmoinnin avulla
* Käyttäjät eivät ole lukittuina suljettuihin ekosysteemeihin
* Innovaatio tapahtuu nopeammin yhteistyön kautta

Kun kyse on sähköpostista — verkkoidentiteettisi selkärangasta — tämä läpinäkyvyys ei ole pelkkä mukavuus, vaan välttämätön aitoon yksityisyyteen ja turvallisuuteen.

### Backend-ongelma: missä useimmat "avoin lähdekoodi" -sähköpostipalvelut epäonnistuvat {#the-backend-problem-where-most-open-source-email-services-fall-short}

Tässä tulee mielenkiintoinen kohta. Monet suositut "yksityisyyteen keskittyvät" sähköpostipalveluntarjoajat mainostavat itseään avoimen lähdekoodin palveluina, mutta on kriittinen ero, jonka he toivovat sinun jättävän huomaamatta: **he julkaisevat avoimen lähdekoodin vain frontendistään, mutta pitävät backendinsa suljettuna**.
Mitä tämä tarkoittaa? Frontend on se, mitä näet ja jonka kanssa olet vuorovaikutuksessa—verkkokäyttöliittymä tai mobiilisovellus. Backend on paikka, jossa varsinainen sähköpostin käsittely tapahtuu—missä viestisi tallennetaan, salataan ja välitetään. Kun palveluntarjoaja pitää backendinsä suljettuna lähdekoodina:

1. Et voi varmistaa, miten sähköpostisi todella käsitellään
2. Et voi vahvistaa, ovatko heidän yksityisyysväitteensä aitoja
3. Luotat markkinointiväitteisiin sen sijaan, että voisit tarkistaa koodin
4. Turva-aukot voivat jäädä julkiselta tarkastelulta piiloon

Kuten Privacy Guides -foorumien keskusteluissa on korostettu, sekä Proton Mail että Tutanota väittävät olevansa avoimen lähdekoodin palveluita, mutta niiden backendit pysyvät suljettuina ja omistusoikeudellisina\[^2]. Tämä luo merkittävän luottamusvajeen—sinua pyydetään uskomaan heidän yksityisyyslupauksiinsa ilman mahdollisuutta tarkistaa niitä.


## Forward Email: 100 % Avoin Lähdekoodi, Sekä Frontend että Backend {#forward-email-100-open-source-frontend-and-backend}

Forward Emaililla olemme ottaneet perustavanlaatuisesti erilaisen lähestymistavan. Koko koodipohjamme—sekä frontend että backend—on avoimen lähdekoodin ja saatavilla kenen tahansa tarkasteltavaksi osoitteessa <https://github.com/forwardemail/forwardemail.net>.

Tämä tarkoittaa:

1. **Täydellistä läpinäkyvyyttä**: Jokainen koodirivi, joka käsittelee sähköpostejasi, on julkisen tarkastelun kohteena.
2. **Tarkistettavaa yksityisyyttä**: Yksityisyysväitteemme eivät ole pelkkää markkinointipuhetta—ne ovat todennettavissa olevia faktoja, jotka kuka tahansa voi varmistaa tutkimalla koodiamme.
3. **Yhteisön vahvistama turvallisuus**: Turvallisuutemme vahvistuu globaalin kehittäjäyhteisön kollektiivisen asiantuntemuksen ansiosta.
4. **Ei piilotettuja toimintoja**: Mitä näet, sitä saat—ei piilotettua seurantaa, ei salaisia takaovia.

### Meidän ainutlaatuinen tekninen lähestymistapamme {#our-unique-technical-approach}

Sitoumuksemme yksityisyyteen menee pidemmälle kuin pelkkä avoimuus. Olemme toteuttaneet useita teknisiä innovaatioita, jotka erottavat meidät muista:

#### Yksilöllisesti salatut SQLite-postilaatikot {#individually-encrypted-sqlite-mailboxes}

Toisin kuin perinteiset sähköpostipalveluntarjoajat, jotka käyttävät jaettuja relaatiotietokantoja (joissa yksikin tietomurto voisi paljastaa kaikkien käyttäjien tiedot), me käytämme yksilöllisesti salattuja SQLite-tiedostoja jokaiselle postilaatikolle. Tämä tarkoittaa:

* Jokainen postilaatikko on erillinen salattu tiedosto
* Yhden käyttäjän tietoihin pääsy ei anna pääsyä muiden tietoihin
* Jopa omat työntekijämme eivät pääse tietoihisi—se on keskeinen suunnitteluratkaisu

Kuten selitimme Privacy Guides -keskusteluissa:

> "Jaetut relaatiotietokannat (esim. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL jne.) vaativat kaikki kirjautumisen (käyttäjä/salasana) tietokantayhteyden muodostamiseksi. Tämä tarkoittaa, että kuka tahansa, jolla on tämä salasana, voi tehdä kyselyjä tietokantaan. Olipa kyseessä pahantahtoinen työntekijä tai 'evil maid' -hyökkäys. Tämä tarkoittaa myös, että yhden käyttäjän tietoihin pääsy tarkoittaa pääsyä kaikkien muiden tietoihin. Toisaalta SQLite voidaan katsoa jaetuksi tietokannaksi, mutta tapa, jolla sitä käytämme (jokainen postilaatikko = yksittäinen SQLite-tiedosto) tekee siitä hiekkalaatikkoratkaisun."\[^3]

#### Kvanttikestävä salaus {#quantum-resistant-encryption}

Kun muut palveluntarjoajat ovat vielä kiinni kehityksessä, olemme jo toteuttaneet kvanttikestävät salausmenetelmät varmistaaksemme sähköpostisi yksityisyyden tulevaisuuden uhkia vastaan kvanttilaskennan saralla.

#### Ei kolmannen osapuolen riippuvuuksia {#no-third-party-dependencies}

Toisin kuin kilpailijat, jotka luottavat palveluihin kuten Amazon SES sähköpostin toimituksessa, olemme rakentaneet koko infrastruktuurimme itse. Tämä poistaa mahdolliset yksityisyysvuodot kolmansien osapuolien palveluiden kautta ja antaa meille täydellisen hallinnan koko sähköpostiputkesta.


## Itseisännöintivaihtoehto: Vapaus Valita {#the-self-hosting-option-freedom-of-choice}

Yksi avoimen lähdekoodin ohjelmistojen voimakkaimmista puolista on tarjoama vapaus. Forward Emailin kanssa et ole koskaan lukittu palveluun—voit itseisännöidä koko alustamme, jos haluat.

### Miksi tuemme itseisännöintiä {#why-we-support-self-hosting}

Uskomme käyttäjien täydelliseen hallintaan omista tiedoistaan. Siksi olemme tehneet koko alustamme itseisännöitäväksi kattavien dokumentaatioiden ja asennusohjeiden avulla. Tämä lähestymistapa:

* Tarjoaa maksimaalisen hallinnan teknisesti suuntautuneille käyttäjille
* Poistaa tarpeen luottaa meihin palveluntarjoajana
* Mahdollistaa räätälöinnin erityisvaatimusten täyttämiseksi
* Varmistaa palvelun jatkuvuuden, vaikka yrityksemme ei jatkaisikaan toimintaa
### Sähköpostin itseisännöinnin todellisuus {#the-reality-of-self-hosting-email}

Vaikka itseisännöinti on tehokas vaihtoehto, on tärkeää ymmärtää siihen liittyvät todelliset kustannukset:

#### Taloudelliset kustannukset {#financial-costs}

* VPS- tai palvelinkustannukset: 5–50 $/kuukausi perusasetukselle\[^4]
* Verkkotunnuksen rekisteröinti ja uusiminen: 10–20 $/vuosi
* SSL-sertifikaatit (vaikka Let's Encrypt tarjoaa ilmaisia vaihtoehtoja)
* Mahdolliset kustannukset valvontapalveluista ja varmuuskopiointiratkaisuista

#### Aikakustannukset {#time-costs}

* Alkuasetukset: Useita tunteja tai päiviä teknisestä osaamisesta riippuen
* Jatkuva ylläpito: 5–10 tuntia/kuukausi päivityksiin, tietoturvakorjauksiin ja vianmääritykseen\[^5]
* Oppimiskäyrä: Sähköpostiprotokollien, tietoturvakäytäntöjen ja palvelinhallinnan ymmärtäminen

#### Teknisiä haasteita {#technical-challenges}

* Sähköpostin toimitusongelmat (viestit merkitään roskapostiksi)
* Turvallisuusstandardien kehittymisen seuraaminen
* Korkean käytettävyyden ja luotettavuuden varmistaminen
* Roskapostisuodatuksen tehokas hallinta

Kuten eräs kokenut itseisännöijä totesi: "Sähköposti on hyödykepalvelu... On halvempaa isännöidä sähköpostini \[palveluntarjoajalla] kuin käyttää rahaa *ja* aikaa itseisännöintiin."\[^6]


## Miksi maksullinen palvelumme on järkevä valinta (vaikka olemme avoimen lähdekoodin) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Ottaen huomioon itseisännöinnin haasteet, maksullinen palvelumme tarjoaa molempien maailmojen parhaat puolet: avoimen lähdekoodin läpinäkyvyyden ja turvallisuuden sekä hallitun palvelun mukavuuden ja luotettavuuden.

### Kustannusvertailu {#cost-comparison}

Kun huomioit sekä taloudelliset että aikakustannukset, maksullinen palvelumme tarjoaa erinomaisen vastineen:

* **Itseisännöinnin kokonaiskustannus**: 56–252 $/kuukausi (sisältäen palvelinkustannukset ja ajan arvon)
* **Forward Emailin maksulliset suunnitelmat**: 3–9 $/kuukausi

Maksullinen palvelumme tarjoaa:

* Ammattimainen hallinta ja ylläpito
* Vakiintunut IP-maine paremman toimitettavuuden takaamiseksi
* Säännölliset tietoturvapäivitykset ja valvonta
* Tukea ongelmatilanteissa
* Kaikki avoimen lähdekoodin lähestymistapamme yksityisyyshyödyt

### Molempien maailmojen parhaat puolet {#the-best-of-both-worlds}

Valitsemalla Forward Emailin saat:

1. **Todennettavan yksityisyyden**: Avoimen lähdekoodin koodipohjamme ansiosta voit luottaa yksityisyysväitteisiimme
2. **Ammattimaisen hallinnan**: Ei tarvitse ryhtyä sähköpostipalvelimen asiantuntijaksi
3. **Kustannustehokkuuden**: Alhaisemmat kokonaiskustannukset kuin itseisännöinnissä
4. **Vapauden lukkiutumattomuuden**: Mahdollisuus itseisännöintiin on aina olemassa


## Suljetun lähdekoodin harhautus: Mitä Proton ja Tutanota eivät kerro sinulle {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Katsotaanpa tarkemmin, miten lähestymistapamme eroaa suosituista "yksityisyyteen keskittyvistä" sähköpostipalveluntarjoajista.

### Proton Mailin avoimen lähdekoodin väitteet {#proton-mails-open-source-claims}

Proton Mail mainostaa itseään avoimen lähdekoodin palveluna, mutta tämä koskee vain heidän käyttöliittymäsovelluksiaan. Heidän taustajärjestelmänsä — jossa sähköpostisi todella käsitellään ja tallennetaan — on suljettu lähdekoodi\[^7]. Tämä tarkoittaa:

* Et voi varmistaa, miten sähköpostejasi käsitellään
* Sinun on luotettava heidän yksityisyysväitteisiinsä ilman varmennusta
* Taustajärjestelmän tietoturva-aukot pysyvät julkiselta tarkastelulta piilossa
* Olet lukittu heidän ekosysteemiinsä ilman itseisännöintivaihtoehtoja

### Tutanotan samanlainen lähestymistapa {#tutanotas-similar-approach}

Kuten Proton Mail, myös Tutanota avaa vain käyttöliittymänsä lähdekoodin, pitäen taustajärjestelmänsä suljettuna\[^8]. Heillä on samat luottamusongelmat:

* Ei mahdollisuutta varmistaa taustajärjestelmän yksityisyysväitteitä
* Rajoitettu läpinäkyvyys varsinaiseen sähköpostinkäsittelyyn
* Mahdolliset tietoturvaongelmat piilossa julkiselta tarkastelulta
* Toimittajalukkiutuminen ilman itseisännöintimahdollisuutta

### Yksityisyysoppaiden keskustelu {#the-privacy-guides-debate}

Nämä rajoitukset eivät ole jääneet huomaamatta yksityisyysyhteisössä. Keskusteluissa Privacy Guides -sivustolla korostimme tätä kriittistä eroa:

> "Siinä todetaan, että sekä Protonmail että Tuta ovat suljettua lähdekoodia. Koska heidän taustajärjestelmänsä on tosiaan suljettu lähdekoodi."\[^9]

Me myös totesimme:

> "Ei ole julkaistu yhtään julkista auditointia minkään tällä hetkellä listatun PG-sähköpostipalveluntarjoajan taustajärjestelmistä eikä avoimen lähdekoodin koodinpätkiä siitä, miten he käsittelevät saapuvaa sähköpostia."\[^10]
Tämä läpinäkyvyyden puute luo perustavanlaatuisen luottamusongelman. Ilman avoimen lähdekoodin taustajärjestelmiä käyttäjien on pakko uskoa yksityisyysväitteisiin ilman mahdollisuutta varmistaa niitä.


## Tulevaisuus on avoin lähdekoodi {#the-future-is-open-source}

Avoimen lähdekoodin ratkaisujen suuntaus kiihtyy ohjelmistoalalla. Viimeaikaisten tutkimusten mukaan:

* Avoimen lähdekoodin ohjelmistomarkkinat kasvavat 41,83 miljardista dollarista vuonna 2024 48,92 miljardiin dollariin vuonna 2025\[^11]
* 80 % yrityksistä raportoi avoimen lähdekoodin käytön lisääntyneen viimeisen vuoden aikana\[^12]
* Avoimen lähdekoodin käyttöönoton odotetaan jatkavan nopeaa laajentumistaan

Tämä kasvu heijastaa perustavaa muutosta siinä, miten ajattelemme ohjelmistoturvallisuutta ja yksityisyyttä. Kun käyttäjät tulevat yhä tietoisemmiksi yksityisyydestään, tarve todennettavalle yksityisyydelle avoimen lähdekoodin ratkaisujen kautta kasvaa entisestään.

### Miksi avoin lähdekoodi voittaa {#why-open-source-is-winning}

Avoimen lähdekoodin edut käyvät yhä selvemmiksi:

1. **Turvallisuus läpinäkyvyyden kautta**: Avoimen lähdekoodin koodia voivat tarkastella tuhannet asiantuntijat, eivät vain sisäinen tiimi
2. **Nopeampi innovaatio**: Yhteistyöhön perustuva kehitys nopeuttaa parannuksia
3. **Luottamus varmistuksen kautta**: Väitteet voidaan tarkistaa, ei vain uskoa
4. **Vapaus toimittajalukituksesta**: Käyttäjät säilyttävät hallinnan omiin tietoihinsa ja palveluihinsa
5. **Yhteisön tuki**: Globaali yhteisö auttaa tunnistamaan ja korjaamaan ongelmia


## Vaihtaminen Forward Emailiin {#making-the-switch-to-forward-email}

Siirtyminen Forward Emailiin on helppoa, olitpa sitten tulossa suosituimmalta palveluntarjoajalta kuten Gmailista tai toiselta yksityisyyteen keskittyvältä palvelulta kuten Proton Mail tai Tutanota.

Palvelumme tarjoaa:

* Rajoittamattomasti domaineja ja aliaksia
* Standardiprotokollien tuki (SMTP, IMAP, POP3) ilman omistettuja siltoja
* Saumaton integraatio olemassa oleviin sähköpostiohjelmiin
* Yksinkertainen käyttöönotto kattavalla dokumentaatiolla
* Edulliset hinnoittelusuunnitelmat alkaen vain 3 $/kuukausi


## Yhteenveto: Avoimen lähdekoodin sähköposti yksityiseen tulevaisuuteen {#conclusion-open-source-email-for-a-private-future}

Maailmassa, jossa digitaalinen yksityisyys on yhä enemmän uhattuna, avoimen lähdekoodin ratkaisujen läpinäkyvyys tarjoaa tärkeän suojan. Forward Emaililla olemme ylpeitä siitä, että johdamme tietä täysin avoimen lähdekoodin lähestymistavallamme sähköpostin yksityisyyteen.

Toisin kuin kilpailijat, jotka omaksuvat avoimen lähdekoodin vain osittain, olemme tehneet koko alustamme—sekä käyttöliittymän että taustajärjestelmän—julkisen tarkastelun kohteeksi. Tämä sitoutuminen läpinäkyvyyteen, yhdistettynä innovatiiviseen tekniseen lähestymistapaamme, tarjoaa tason todennettavaa yksityisyyttä, johon suljetun lähdekoodin vaihtoehdot eivät yksinkertaisesti yllä.

Valitsitpa käyttää hallinnoimaamme palvelua tai isännöidä alustaa itse, hyödyt turvallisuudesta, yksityisyydestä ja mielenrauhasta, jonka aito avoimen lähdekoodin sähköposti tarjoaa.

Sähköpostin tulevaisuus on avoin, läpinäkyvä ja yksityisyyttä kunnioittava. Tulevaisuus on Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "TL:DR: Koska kaikki on itse isännöityä, SE VAATII AIKAASI. Jos sinulla ei ole aikaa käyttää siihen, on aina parempi pysyä isännöidyssä..." [Sähköpostipalvelimen itse isännöinti? Miksi tai miksi ei? Mikä on suosittua?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail väittää olevansa avoimen lähdekoodin, mutta heidän taustajärjestelmänsä on itse asiassa suljettu lähdekoodi." [Tutanota vs Proton Mail Vertailu (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota väittää olevansa avoimen lähdekoodin, mutta heidän taustajärjestelmänsä on itse asiassa suljettu lähdekoodi." [Proton Mail vs Tutanota Vertailu (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Siinä todetaan, että sekä Protonmail että Tuta ovat suljettua lähdekoodia. Koska heidän taustajärjestelmänsä on tosiaan suljettu lähdekoodi." [Forward Email (sähköpostipalveluntarjoaja) - Sivuston kehitys / Työkaluehdotukset](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Ei ole julkaistu yhtään julkista tarkastusta minkään tällä hetkellä listatun PG-sähköpostipalveluntarjoajan taustajärjestelmistä eikä avoimen lähdekoodin koodinpätkiä siitä, miten he käsittelevät saapuvaa sähköpostia." [Forward Email (sähköpostipalveluntarjoaja) - Sivuston kehitys / Työkaluehdotukset](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Avoimen lähdekoodin ohjelmistomarkkinat kasvavat 41,83 miljardista USD vuonna 2024 48,92 miljardiin USD vuonna 2025 yhdistetyn..." [Mitä on avoimen lähdekoodin ohjelmisto?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "80 % yrityksistä raportoi avoimen lähdekoodin teknologioiden käytön lisääntyneen viime vuoden aikana, ja se on..." [Nousevat trendit avoimen lähdekoodin yhteisöissä 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
