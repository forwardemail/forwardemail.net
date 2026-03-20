# Tietojenkäsittelysopimus {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email tietojenkäsittelysopimus" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Keskeiset termit](#key-terms)
* [Sopimuksen muutokset](#changes-to-the-agreement)
* [1. Käsittelijän ja alikäsittelijän suhteet](#1-processor-and-subprocessor-relationships)
  * [1. Palveluntarjoaja käsittelijänä](#1-provider-as-processor)
  * [2. Palveluntarjoaja alikäsittelijänä](#2-provider-as-subprocessor)
* [2. Käsittely](#2-processing)
  * [1. Käsittelyn yksityiskohdat](#1-processing-details)
  * [2. Käsittelyohjeet](#2-processing-instructions)
  * [3. Käsittely palveluntarjoajan toimesta](#3-processing-by-provider)
  * [4. Asiakkaan käsittely](#4-customer-processing)
  * [5. Suostumus käsittelyyn](#5-consent-to-processing)
  * [6. Alikäsittelijät](#6-subprocessors)
* [3. Rajoitetut siirrot](#3-restricted-transfers)
  * [1. Valtuutus](#1-authorization)
  * [2. Siirrot ETA:n ulkopuolelle](#2-ex-eea-transfers)
  * [3. Siirrot Iso-Britannian ulkopuolelle](#3-ex-uk-transfers)
  * [4. Muut kansainväliset siirrot](#4-other-international-transfers)
* [4. Tietoturvaloukkausten käsittely](#4-security-incident-response)
* [5. Auditoinnit ja raportit](#5-audit--reports)
  * [1. Auditointioikeudet](#1-audit-rights)
  * [2. Tietoturvaraportit](#2-security-reports)
  * [3. Tietoturvan due diligence](#3-security-due-diligence)
* [6. Yhteensovitus ja yhteistyö](#6-coordination--cooperation)
  * [1. Vastaaminen tiedusteluihin](#1-response-to-inquiries)
  * [2. DPIA:t ja DTIA:t](#2-dpias-and-dtias)
* [7. Asiakkaan henkilötietojen poistaminen](#7-deletion-of-customer-personal-data)
  * [1. Poisto asiakkaan toimesta](#1-deletion-by-customer)
  * [2. Poisto sopimuksen päättyessä](#2-deletion-at-dpa-expiration)
* [8. Vastuunrajoitus](#8-limitation-of-liability)
  * [1. Vastuun enimmäismäärät ja vahingonkorvausluopumus](#1-liability-caps-and-damages-waiver)
  * [2. Kolmansien osapuolten vaatimukset](#2-related-party-claims)
  * [3. Poikkeukset](#3-exceptions)
* [9. Asiakirjojen ristiriidat](#9-conflicts-between-documents)
* [10. Sopimuksen voimassaoloaika](#10-term-of-agreement)
* [11. Sovellettava laki ja valitut tuomioistuimet](#11-governing-law-and-chosen-courts)
* [12. Palveluntarjoajasuhde](#12-service-provider-relationship)
* [13. Määritelmät](#13-definitions)
* [Kiitokset](#credits)


## Keskeiset termit {#key-terms}

| Termi                                      | Arvo                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Sopimus</strong>                    | Tämä tietojenkäsittelysopimus täydentää [Palveluehtoja](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                   |
| <strong>Hyväksytyt alikäsittelijät</strong> | [Cloudflare](https://cloudflare.com) (Yhdysvallat; DNS, verkko- ja tietoturvapalvelut), [DataPacket](https://www.datapacket.com/) (Yhdysvallat/Iso-Britannia; hosting-palvelut), [Digital Ocean](https://digitalocean.com) (Yhdysvallat; hosting-palvelut), [GitHub](https://github.com) (Yhdysvallat; lähdekoodin hosting, CI/CD ja projektinhallinta), [Vultr](https://www.vultr.com) (Yhdysvallat; hosting-palvelut), [Stripe](https://stripe.com) (Yhdysvallat; maksunvälittäjä), [PayPal](https://paypal.com) (Yhdysvallat; maksunvälittäjä) |
| <strong>Palveluntarjoajan tietoturvakontakti</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Tietoturvapolitiikka</strong>      | Katso [tietoturvapolitiikkamme GitHubissa](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                      |
| <strong>Sovellettava valtio</strong>        | Delaware, Yhdysvallat                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
## Sopimuksen muutokset {#changes-to-the-agreement}

Tämä asiakirja on johdannainen [Common Paper DPA Standard Terms (Versio 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) -asiakirjasta, ja siihen on tehty seuraavat muutokset:

1. [Sovellettava laki ja valitut tuomioistuimet](#11-governing-law-and-chosen-courts) on sisällytetty alla olevaan osioon, jossa on määritelty `Soveltuva valtio` yllä.
2. [Palveluntarjoajan suhde](#12-service-provider-relationship) on sisällytetty alla olevaan osioon.


## 1. Käsittelijän ja alikäsittelijän suhteet {#1-processor-and-subprocessor-relationships}

### 1. Palveluntarjoaja käsittelijänä {#1-provider-as-processor}

Tilanteissa, joissa <strong>Asiakas</strong> on Asiakastietojen rekisterinpitäjä, <strong>Palveluntarjoajaa</strong> pidetään henkilötietojen käsittelijänä, joka käsittelee henkilötietoja <strong>Asiakkaan</strong> puolesta.

### 2. Palveluntarjoaja alikäsittelijänä {#2-provider-as-subprocessor}

Tilanteissa, joissa <strong>Asiakas</strong> on Asiakastietojen käsittelijä, <strong>Palveluntarjoajaa</strong> pidetään Asiakastietojen alikäsittelijänä.


## 2. Käsittely {#2-processing}

### 1. Käsittelyn tiedot {#1-processing-details}

Liite I(B) kansilehdellä kuvaa tämän käsittelyn kohteen, luonteen, tarkoituksen ja keston sekä kerätyt <strong>Henkilötietojen luokat</strong> ja <strong>Rekisteröityjen luokat</strong>.

### 2. Käsittelyohjeet {#2-processing-instructions}

<strong>Asiakas</strong> ohjeistaa <strong>Palveluntarjoajaa</strong> käsittelemään Asiakastietoja: (a) palvelun tarjoamiseksi ja ylläpitämiseksi; (b) kuten voidaan tarkentaa <strong>Asiakkaan</strong> palvelun käytön kautta; (c) kuten on dokumentoitu <strong>Sopimuksessa</strong>; ja (d) kuten on dokumentoitu muissa kirjallisissa ohjeissa, jotka <strong>Asiakas</strong> on antanut ja jotka <strong>Palveluntarjoaja</strong> on hyväksynyt koskien Asiakastietojen käsittelyä tämän DPA:n nojalla. <strong>Palveluntarjoaja</strong> noudattaa näitä ohjeita, ellei sovellettava laki estä sitä. <strong>Palveluntarjoaja</strong> ilmoittaa välittömästi <strong>Asiakkaalle</strong>, jos se ei pysty noudattamaan käsittelyohjeita. <strong>Asiakas</strong> on antanut ja antaa vain ohjeita, jotka ovat sovellettavien lakien mukaisia.

### 3. Palveluntarjoajan käsittely {#3-processing-by-provider}

<strong>Palveluntarjoaja</strong> käsittelee Asiakastietoja vain tämän DPA:n mukaisesti, mukaan lukien kansilehden tiedot. Jos <strong>Palveluntarjoaja</strong> päivittää palvelua lisätäkseen olemassa olevia tai uusia tuotteita, ominaisuuksia tai toiminnallisuuksia, <strong>Palveluntarjoaja</strong> voi muuttaa <strong>Rekisteröityjen luokkia</strong>, <strong>Henkilötietojen luokkia</strong>, <strong>Erityisiä henkilötietoryhmiä</strong>, <strong>Erityisten henkilötietoryhmien rajoituksia tai suojatoimia</strong>, <strong>Siirtojen tiheyttä</strong>, <strong>Käsittelyn luonnetta ja tarkoitusta</strong> sekä <strong>Käsittelyn kestoa</strong> tarpeen mukaan heijastamaan päivityksiä ilmoittamalla <strong>Asiakkaalle</strong> päivityksistä ja muutoksista.

### 4. Asiakkaan käsittely {#4-customer-processing}

Kun <strong>Asiakas</strong> on käsittelijä ja <strong>Palveluntarjoaja</strong> alikäsittelijä, <strong>Asiakas</strong> noudattaa kaikkia sovellettavia lakeja, jotka koskevat <strong>Asiakkaan</strong> Asiakastietojen käsittelyä. <strong>Asiakkaan</strong> sopimus rekisterinpitäjänsä kanssa edellyttää vastaavasti, että <strong>Asiakas</strong> noudattaa kaikkia sovellettavia lakeja, jotka koskevat <strong>Asiakasta</strong> käsittelijänä. Lisäksi <strong>Asiakas</strong> noudattaa alikäsittelijää koskevia vaatimuksia <strong>Asiakkaan</strong> sopimuksessa rekisterinpitäjänsä kanssa.

### 5. Suostumus käsittelyyn {#5-consent-to-processing}

<strong>Asiakas</strong> on noudattanut ja jatkaa kaikkien sovellettavien tietosuojalakien noudattamista koskien Asiakastietojen luovuttamista <strong>Palveluntarjoajalle</strong> ja/tai palvelulle, mukaan lukien kaikki ilmoitukset, suostumusten hankkiminen, riittävän valinnan tarjoaminen ja sovellettavien tietosuojalakien edellyttämien asianmukaisten suojatoimien toteuttaminen.
### 6. Alikäsittelijät {#6-subprocessors}

a. <strong>Palveluntarjoaja</strong> ei toimita, siirrä tai luovuta Asiakkaan henkilötietoja alikäsittelijälle, ellei <strong>Asiakas</strong> ole hyväksynyt alikäsittelijää. Nykyinen <strong>Hyväksyttyjen alikäsittelijöiden</strong> lista sisältää alikäsittelijöiden henkilöllisyydet, niiden sijaintimaan sekä niiden odotetut käsittelytehtävät. <strong>Palveluntarjoaja</strong> ilmoittaa <strong>Asiakkaalle</strong> vähintään 10 työpäivää etukäteen ja kirjallisesti kaikista suunnitelluista muutoksista <strong>Hyväksyttyihin alikäsittelijöihin</strong>, olipa kyseessä alikäsittelijän lisääminen tai korvaaminen, mikä antaa <strong>Asiakkaalle</strong> riittävästi aikaa vastustaa muutoksia ennen kuin <strong>Palveluntarjoaja</strong> alkaa käyttää uutta(a) alikäsittelijää(tä). <strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> tarvittavat tiedot, jotta <strong>Asiakas</strong> voi käyttää oikeuttaan vastustaa muutosta <strong>Hyväksyttyihin alikäsittelijöihin</strong>. <strong>Asiakkaalla</strong> on 30 päivää ilmoituksesta <strong>Hyväksyttyjen alikäsittelijöiden</strong> muutoksesta vastustaa sitä, muuten <strong>Asiakas</strong> katsotaan hyväksyneen muutokset. Jos <strong>Asiakas</strong> vastustaa muutosta 30 päivän kuluessa ilmoituksesta, <strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> tekevät yhteistyötä hyvässä uskossa ratkaistakseen <strong>Asiakkaan</strong> vastalauseen tai huolen.

b. Kun <strong>Palveluntarjoaja</strong> käyttää alikäsittelijää, sillä on kirjallinen sopimus alikäsittelijän kanssa, joka varmistaa, että alikäsittelijä pääsee käsiksi ja käyttää Asiakkaan henkilötietoja (i) vain siinä määrin kuin on tarpeen sille alihankittujen velvoitteiden suorittamiseksi, ja (ii) <strong>Sopimuksen</strong> ehtojen mukaisesti.

c. Jos GDPR soveltuu Asiakkaan henkilötietojen käsittelyyn, (i) tässä DPA:ssa kuvatut tietosuojavelvoitteet (kuten GDPR:n 28 artiklan 3 kohdassa, jos sovellettavissa) koskevat myös alikäsittelijää, ja (ii) <strong>Palveluntarjoajan</strong> sopimus alikäsittelijän kanssa sisältää nämä velvoitteet, mukaan lukien tiedot siitä, miten <strong>Palveluntarjoaja</strong> ja sen alikäsittelijä koordinoivat vastatakseen tiedusteluihin tai pyyntöihin Asiakkaan henkilötietojen käsittelystä. Lisäksi <strong>Palveluntarjoaja</strong> jakaa <strong>Asiakkaan</strong> pyynnöstä kopion sopimuksistaan (mukaan lukien mahdolliset muutokset) alikäsittelijöidensä kanssa. Liiketoimintasalaisuuksien tai muun luottamuksellisen tiedon, mukaan lukien henkilötietojen, suojaamiseksi <strong>Palveluntarjoaja</strong> voi sensuroida sopimustekstin ennen kopion jakamista.

d. <strong>Palveluntarjoaja</strong> on edelleen täysin vastuussa kaikista alikäsittelijöilleen alihankituista velvoitteista, mukaan lukien alikäsittelijöiden teot ja laiminlyönnit Asiakkaan henkilötietojen käsittelyssä. <strong>Palveluntarjoaja</strong> ilmoittaa Asiakkaalle kaikista alikäsittelijöidensä olennaisten velvoitteiden laiminlyönneistä Asiakkaan henkilötietojen osalta <strong>Palveluntarjoajan</strong> ja alikäsittelijän välisen sopimuksen mukaisesti.


## 3. Rajoitetut siirrot {#3-restricted-transfers}

### 1. Valtuutus {#1-authorization}

<strong>Asiakas</strong> hyväksyy, että <strong>Palveluntarjoaja</strong> voi siirtää Asiakkaan henkilötietoja Euroopan talousalueen (ETA), Yhdistyneen kuningaskunnan tai muun soveltuvan maantieteellisen alueen ulkopuolelle tarpeen mukaan Palvelun tarjoamiseksi. Jos <strong>Palveluntarjoaja</strong> siirtää Asiakkaan henkilötietoja alueelle, jolle Euroopan komissio tai muu soveltuva valvontaviranomainen ei ole antanut riittävyyspäätöstä, <strong>Palveluntarjoaja</strong> toteuttaa asianmukaiset suojatoimet Asiakkaan henkilötietojen siirrolle kyseiselle alueelle sovellettavien tietosuojalakien mukaisesti.

### 2. ETA:n ulkopuoliset siirrot {#2-ex-eea-transfers}

<strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> sopivat, että jos GDPR suojaa Asiakkaan henkilötietojen siirtoa, siirto tapahtuu <strong>Asiakkaalta</strong> ETA:n sisältä <strong>Palveluntarjoajalle</strong> ETA:n ulkopuolella, eikä siirtoa säädä Euroopan komission tekemä riittävyyspäätös, niin tämän DPA:n solmimisen myötä <strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> katsotaan allekirjoittaneen ETA:n vakiosopimuslausekkeet (SCC) ja niiden liitteet, jotka sisältyvät viittauksella. Kaikki tällaiset siirrot tehdään ETA:n SCC:n mukaisesti, jotka täytetään seuraavasti:
a. EEA:n SCC-sopimusten moduuli kaksi (rekisterinpitäjältä käsittelijälle) soveltuu, kun <strong>Asiakas</strong> on rekisterinpitäjä ja <strong>Palveluntarjoaja</strong> käsittelee Asiakkaan henkilötietoja <strong>Asiakkaan</strong> puolesta käsittelijänä.

b. EEA:n SCC-sopimusten moduuli kolme (käsittelijältä alikäsittelijälle) soveltuu, kun <strong>Asiakas</strong> on käsittelijä ja <strong>Palveluntarjoaja</strong> käsittelee Asiakkaan henkilötietoja <strong>Asiakkaan</strong> puolesta alikäsittelijänä.

c. Kullekin moduulille sovelletaan seuraavaa (kun sovellettavissa):

1. Valinnainen liittämisehto kohdassa 7 ei sovellu;

2. Kohdassa 9 sovelletaan vaihtoehtoa 2 (yleinen kirjallinen valtuutus), ja alikäsittelijän muutoksista annettavan ennakkoilmoituksen vähimmäisaika on 10 työpäivää;

3. Kohdassa 11 valinnainen kieli ei sovellu;

4. Kaikki hakasulkeet kohdassa 13 poistetaan;

5. Kohdassa 17 (vaihtoehto 1) EEA:n SCC-sopimuksia säätelevät <strong>Soveltuvan jäsenvaltion</strong> lait;

6. Kohdassa 18(b) riidat ratkaistaan <strong>Soveltuvan jäsenvaltion</strong> tuomioistuimissa; ja

7. Tämän tietojenkäsittelysopimuksen kansilehti sisältää EEA:n SCC-sopimusten liitteissä I, II ja III vaaditut tiedot.

### 3. Ex-UK-siirrot {#3-ex-uk-transfers}

<strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> sopivat, että jos UK GDPR suojaa Asiakkaan henkilötietojen siirtoa, siirto tapahtuu <strong>Asiakkaalta</strong> Yhdistyneen kuningaskunnan sisältä <strong>Palveluntarjoajalle</strong> Yhdistyneen kuningaskunnan ulkopuolelle, eikä siirtoa säätele Yhdistyneen kuningaskunnan valtionministerin tekemä riittävyyspäätös, niin tämän tietojenkäsittelysopimuksen tekemisellä <strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> katsotaan allekirjoittaneen UK-lisäyksen ja sen liitteet, jotka sisältyvät viittauksella. Tällainen siirto tehdään UK-lisäyksen mukaisesti, joka täytetään seuraavasti:

a. Tämän tietojenkäsittelysopimuksen kohta 3.2 sisältää UK-lisäyksen taulukon 2 edellyttämät tiedot.

b. UK-lisäyksen taulukkoa 4 muutetaan seuraavasti: Kumpikaan osapuoli ei voi päättää UK-lisäystä UK-lisäyksen kohdan 19 mukaisesti; siinä määrin kuin ICO antaa UK-lisäyksen kohdan 18 mukaisesti uudistetun hyväksytyn lisäyksen, osapuolet toimivat hyvässä uskossa muuttaakseen tämän tietojenkäsittelysopimuksen vastaavasti.

c. Kansilehti sisältää UK-lisäyksen liitteiden 1A, 1B, II ja III edellyttämät tiedot.

### 4. Muut kansainväliset siirrot {#4-other-international-transfers}

Henkilötietojen siirroissa, joissa sovelletaan Sveitsin lakia (eikä minkään EEA:n jäsenvaltion tai Yhdistyneen kuningaskunnan lakia) siirron kansainvälisen luonteen vuoksi, viittaukset GDPR:ään EEA:n SCC-sopimusten kohdassa 4 muutetaan, siinä määrin kuin laki edellyttää, viittaamaan Sveitsin liittovaltion tietosuojalakiin tai sen seuraajaan, ja valvontaviranomaisen käsite sisältää Sveitsin liittovaltion tietosuojan ja tiedonantajan komissaarin.

## 4. Tietoturvaloukkauksen käsittely {#4-security-incident-response}

1. Heti kun <strong>Palveluntarjoaja</strong> saa tietoonsa tietoturvaloukkauksen, se: (a) ilmoittaa <strong>Asiakkaalle</strong> viipymättä, kun se on mahdollista, mutta viimeistään 72 tunnin kuluessa tietoturvaloukkauksen havaitsemisesta; (b) antaa ajantasaista tietoa tietoturvaloukkauksesta sitä mukaa kun se tulee tunnetuksi tai kun <strong>Asiakas</strong> kohtuudella pyytää; ja (c) ryhtyy viipymättä kohtuullisiin toimiin tietoturvaloukkauksen rajoittamiseksi ja tutkimiseksi. <strong>Palveluntarjoajan</strong> ilmoitus tai reagointi tietoturvaloukkaukseen tämän tietojenkäsittelysopimuksen mukaisesti ei tulkita <strong>Palveluntarjoajan</strong> myöntymykseksi virheestä tai vastuusta tietoturvaloukkauksessa.

## 5. Auditoinnit ja raportit {#5-audit--reports}

### 1. Auditointioikeudet {#1-audit-rights}

<strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> kaikki kohtuudella tarpeelliset tiedot tämän tietojenkäsittelysopimuksen noudattamisen osoittamiseksi ja sallii sekä osallistuu auditointeihin, mukaan lukien <strong>Asiakkaan</strong> suorittamat tarkastukset, arvioidakseen <strong>Palveluntarjoajan</strong> tämän tietojenkäsittelysopimuksen noudattamista. Kuitenkin <strong>Palveluntarjoaja</strong> voi rajoittaa pääsyä tietoihin tai aineistoon, jos <strong>Asiakkaan</strong> pääsy tietoihin vaikuttaisi negatiivisesti <strong>Palveluntarjoajan</strong> immateriaalioikeuksiin, salassapitovelvoitteisiin tai muihin sovellettavien lakien mukaisiin velvoitteisiin. <strong>Asiakas</strong> tunnustaa ja hyväksyy, että se käyttää auditointioikeuksiaan tämän tietojenkäsittelysopimuksen ja sovellettavien tietosuojalakien mukaisesti ainoastaan antamalla <strong>Palveluntarjoajalle</strong> ohjeet noudattaa alla olevia raportointi- ja huolellisuusvaatimuksia. <strong>Palveluntarjoaja</strong> säilyttää todisteet tämän tietojenkäsittelysopimuksen noudattamisesta 3 vuotta sopimuksen päättymisen jälkeen.
### 2. Turvallisuusraportit {#2-security-reports}

<strong>Asiakas</strong> tunnustaa, että <strong>Palveluntarjoajaa</strong> auditoidaan säännöllisesti riippumattomien kolmansien osapuolten toimesta <strong>Turvallisuuspolitiikassa</strong> määriteltyjen standardien mukaisesti. Kirjallisesta pyynnöstä <strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> luottamuksellisesti yhteenvedon sen sillä hetkellä voimassa olevasta Raportista, jotta <strong>Asiakas</strong> voi varmistaa <strong>Palveluntarjoajan</strong> noudattavan <strong>Turvallisuuspolitiikassa</strong> määriteltyjä standardeja.

### 3. Turvallisuustarkastus {#3-security-due-diligence}

Raportin lisäksi <strong>Palveluntarjoaja</strong> vastaa kohtuullisiin <strong>Asiakkaan</strong> tekemiin tiedusteluihin vahvistaakseen <strong>Palveluntarjoajan</strong> tämän DPA:n noudattamisen, mukaan lukien vastaukset tietoturvaan, due diligenceen ja auditointikyselyihin tai antamalla lisätietoja tietoturvaohjelmastaan. Kaikkien tällaisten pyyntöjen on oltava kirjallisia ja osoitettu <strong>Palveluntarjoajan turvallisuusyhteyshenkilölle</strong>, ja niitä saa tehdä vain kerran vuodessa.


## 6. Koordinointi ja yhteistyö {#6-coordination--cooperation}

### 1. Vastaaminen tiedusteluihin {#1-response-to-inquiries}

Jos <strong>Palveluntarjoaja</strong> saa keneltä tahansa tiedustelun tai pyynnön liittyen Asiakkaan henkilötietojen käsittelyyn, <strong>Palveluntarjoaja</strong> ilmoittaa <strong>Asiakkaalle</strong> pyynnöstä eikä vastaa siihen ilman <strong>Asiakkaan</strong> etukäteistä suostumusta. Esimerkkejä tällaisista tiedusteluista ja pyynnöistä ovat oikeudellinen, hallinnollinen tai sääntelyviranomaisen määräys Asiakkaan henkilötiedoista, jolloin <strong>Asiakkaan</strong> ilmoittaminen ei ole sovellettavan lain mukaan kiellettyä, tai rekisteröidyn pyyntö. Jos sovellettava laki sallii, <strong>Palveluntarjoaja</strong> noudattaa <strong>Asiakkaan</strong> kohtuullisia ohjeita näiden pyyntöjen osalta, mukaan lukien tilannepäivitysten ja muiden kohtuullisesti pyydettyjen tietojen antaminen <strong>Asiakkaalle</strong>. Jos rekisteröity tekee sovellettavien tietosuojalakien mukaisen pätevän pyynnön poistaa tai kieltää <strong>Asiakkaan</strong> henkilötietojen luovuttamisen <strong>Palveluntarjoajalle</strong>, <strong>Palveluntarjoaja</strong> auttaa <strong>Asiakasta</strong> pyynnön täyttämisessä sovellettavan tietosuojalain mukaisesti. <strong>Palveluntarjoaja</strong> tekee yhteistyötä ja antaa kohtuullista apua <strong>Asiakkaalle</strong>, <strong>Asiakkaan</strong> kustannuksella, kaikissa oikeudellisissa vastauksissa tai muissa menettelytoimissa, joita <strong>Asiakas</strong> tekee kolmannen osapuolen pyynnön johdosta liittyen <strong>Palveluntarjoajan</strong> Asiakkaan henkilötietojen käsittelyyn tämän DPA:n nojalla.

### 2. DPIA:t ja DTIA:t {#2-dpias-and-dtias}

Jos sovellettavat tietosuojalait edellyttävät, <strong>Palveluntarjoaja</strong> auttaa kohtuullisesti <strong>Asiakasta</strong> suorittamaan vaaditut tietosuojavaikutusten arvioinnit tai tietojen siirron vaikutusten arvioinnit sekä neuvottelut asianomaisten tietosuojaviranomaisten kanssa ottaen huomioon käsittelyn luonteen ja Asiakkaan henkilötiedot.


## 7. Asiakkaan henkilötietojen poistaminen {#7-deletion-of-customer-personal-data}

### 1. Poisto Asiakkaan toimesta {#1-deletion-by-customer}

<strong>Palveluntarjoaja</strong> mahdollistaa <strong>Asiakkaan</strong> poistaa Asiakkaan henkilötiedot palveluiden toiminnallisuuden mukaisesti. <strong>Palveluntarjoaja</strong> noudattaa tätä ohjetta mahdollisimman pian kohtuullisesti toteutettavissa olevalla tavalla, paitsi jos sovellettava laki edellyttää Asiakkaan henkilötietojen säilyttämistä pidempään.

### 2. Poisto DPA:n päättyessä {#2-deletion-at-dpa-expiration}

a. DPA:n päätyttyä <strong>Palveluntarjoaja</strong> palauttaa tai poistaa Asiakkaan henkilötiedot <strong>Asiakkaan</strong> ohjeiden mukaisesti, ellei sovellettava laki edellytä tai salli henkilötietojen säilyttämistä pidempään. Jos palautus tai tuhoaminen on käytännössä mahdotonta tai sovellettavien lakien kieltämää, <strong>Palveluntarjoaja</strong> pyrkii kohtuullisesti estämään Asiakkaan henkilötietojen lisäkäsittelyn ja jatkaa Asiakkaan henkilötietojen suojaamista, jotka ovat sen hallussa, hallinnassa tai valvonnassa. Esimerkiksi sovellettavat lait voivat edellyttää, että <strong>Palveluntarjoaja</strong> jatkaa Asiakkaan henkilötietojen isännöintiä tai käsittelyä.
b. Jos <strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> ovat sisällyttäneet EEA:n SCC:t tai UK:n lisäosan osaksi tätä DPA:ta, <strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> henkilötietojen poistamisen todistuksen, joka on kuvattu EEA:n SCC:iden kohdissa 8.1(d) ja 8.5, vain jos <strong>Asiakas</strong> pyytää sitä.


## 8. Vastuunrajoitukset {#8-limitation-of-liability}

### 1. Vastuun enimmäismäärät ja vahingonkorvausluopumukset {#1-liability-caps-and-damages-waiver}

**Sovellettavien tietosuojalakien sallimassa laajuudessa kummankin osapuolen kokonaisvastuu toiselle osapuolelle tästä DPA:sta johtuvista tai siihen liittyvistä asioista on rajoitettu <strong>Sopimuksessa</strong> mainittuihin luopumisiin, poissulkemisiin ja vastuunrajoituksiin.**

### 2. Kolmansien osapuolten vaatimukset {#2-related-party-claims}

**Kaikki vaatimukset, joita esitetään <strong>Palveluntarjoajaa</strong> tai sen tytäryhtiöitä kohtaan tästä DPA:sta johtuen tai siihen liittyen, voivat tehdä vain <strong>Asiakas</strong> -yksikkö, joka on osapuolena <strong>Sopimuksessa</strong>.**

### 3. Poikkeukset {#3-exceptions}

1. Tämä DPA ei rajoita yksilön vastuuta yksilön tietosuojaoikeuksien osalta sovellettavien tietosuojalakien mukaisesti. Lisäksi tämä DPA ei rajoita osapuolten välistä vastuuta EEA:n SCC:iden tai UK:n lisäosan rikkomuksista.


## 9. Asiakirjojen ristiriidat {#9-conflicts-between-documents}

1. Tämä DPA on osa ja täydentää Sopimusta. Jos tässä DPA:ssa, <strong>Sopimuksessa</strong> tai niiden osissa on ristiriita, aikaisemmin mainittu osa on etusijalla myöhempään nähden kyseisessä ristiriidassa: (1) EEA:n SCC:t tai UK:n lisäosa, (2) tämä DPA ja sitten (3) <strong>Sopimus</strong>.


## 10. Sopimuksen voimassaoloaika {#10-term-of-agreement}

Tämä DPA alkaa, kun <strong>Palveluntarjoaja</strong> ja <strong>Asiakas</strong> sopivat DPA:n kansilehdestä ja allekirjoittavat tai hyväksyvät sähköisesti <strong>Sopimuksen</strong>, ja jatkuu siihen asti, kun <strong>Sopimus</strong> päättyy tai irtisanotaan. Kuitenkin <strong>Palveluntarjoaja</strong> ja <strong>Asiakas</strong> ovat kumpikin velvollisia noudattamaan tämän DPA:n ja sovellettavien tietosuojalakien velvoitteita, kunnes <strong>Asiakas</strong> lopettaa Asiakastietojen siirtämisen <strong>Palveluntarjoajalle</strong> ja <strong>Palveluntarjoaja</strong> lopettaa Asiakastietojen käsittelyn.


## 11. Sovellettava laki ja valitut tuomioistuimet {#11-governing-law-and-chosen-courts}

Riippumatta <strong>Sopimuksen</strong> sovellettavaa lakia tai vastaavia määräyksiä koskevista kohdista, tämän DPA:n tulkinnat ja riidat ratkaistaan <strong>Hallintovaltiossa</strong> voimassa olevan lain mukaisesti ilman lainvalintasäännösten huomioon ottamista. Lisäksi, riippumatta <strong>Sopimuksen</strong> foorumin valintaa, toimivaltaa tai vastaavia määräyksiä koskevista kohdista, osapuolet suostuvat viemään kaikki tämän DPA:n oikeudelliset kanteet, toimet tai menettelyt <strong>Hallintovaltioon</strong> ja kumpikin osapuoli alistuu peruuttamattomasti <strong>Hallintovaltioon</strong> kuuluvien tuomioistuinten yksinomaiselle toimivalalle.


## 12. Palveluntarjoajasuhde {#12-service-provider-relationship}

Siltä osin kuin Kalifornian kuluttajan yksityisyydensuojalaki, Cal. Civ. Code § 1798.100 ja seuraavat ("CCPA") soveltuvat, osapuolet tunnustavat ja hyväksyvät, että <strong>Palveluntarjoaja</strong> on palveluntarjoaja ja vastaanottaa henkilötietoja <strong>Asiakkaalta</strong> tarjotakseen Palvelun <strong>Sopimuksen</strong> mukaisesti, mikä muodostaa liiketoimintatarkoituksen. <strong>Palveluntarjoaja</strong> ei myy mitään <strong>Asiakkaan</strong> <strong>Sopimuksen</strong> nojalla toimittamia henkilötietoja. Lisäksi <strong>Palveluntarjoaja</strong> ei säilytä, käytä tai luovuta mitään <strong>Asiakkaan</strong> <strong>Sopimuksen</strong> nojalla toimittamia henkilötietoja, paitsi mitä on tarpeen Palvelun tarjoamiseksi <strong>Asiakkaalle</strong>, kuten <strong>Sopimuksessa</strong> on todettu, tai mitä sovellettavat tietosuojalait sallivat. <strong>Palveluntarjoaja</strong> vahvistaa ymmärtävänsä tämän kohdan rajoitukset.
## 13. Määritelmät {#13-definitions}

1. **"Sovellettavat lait"** tarkoittaa soveltuvia hallituksen viranomaisen lakeja, sääntöjä, asetuksia, tuomioistuimen määräyksiä ja muita sitovia vaatimuksia, jotka koskevat tai säätelevät osapuolta.

2. **"Sovellettavat tietosuojalait"** tarkoittaa sovellettavia lakeja, jotka säätelevät, miten Palvelu voi käsitellä tai käyttää yksilön henkilötietoja, henkilötietoja, henkilökohtaisesti tunnistettavia tietoja tai muuta vastaavaa termiä.

3. **"Rekisterinpitäjä"** tarkoittaa sovellettavissa tietosuojalaeissa annettua merkitystä yritykselle, joka määrittää henkilötietojen käsittelyn tarkoituksen ja laajuuden.

4. **"Kansilehti"** tarkoittaa asiakirjaa, joka on allekirjoitettu tai sähköisesti hyväksytty osapuolten toimesta ja joka sisältää nämä DPA:n vakioehdot sekä tunnistaa <strong>Palveluntarjoajan</strong>, <strong>Asiakkaan</strong> ja tietojenkäsittelyn kohteen ja yksityiskohdat.

5. **"Asiakkaan henkilötiedot"** tarkoittaa henkilötietoja, jotka <strong>Asiakas</strong> lataa tai toimittaa <strong>Palveluntarjoajalle</strong> osana Palvelua ja joita tämä DPA säätelee.

6. **"DPA"** tarkoittaa näitä DPA:n vakioehtoja, <strong>Palveluntarjoajan</strong> ja <strong>Asiakkaan</strong> välistä Kansilehteä sekä Kansilehdessä viitattuja tai siihen liitettyjä politiikkoja ja asiakirjoja.

7. **"ETA:n SCC:t"** tarkoittaa Euroopan komission täytäntöönpanoasetuksen 2021/914 liitteenä olevia vakiosopimuslausekkeita, jotka koskevat henkilötietojen siirtoa kolmansiin maihin Euroopan parlamentin ja neuvoston asetuksen (EU) 2016/679 mukaisesti.

8. **"Euroopan talousalue"** tai **"ETA"** tarkoittaa Euroopan unionin jäsenvaltioita, Norjaa, Islantiä ja Liechtensteinia.

9. **"GDPR"** tarkoittaa Euroopan unionin asetusta 2016/679, joka on toteutettu paikallisella lainsäädännöllä kyseisessä ETA:n jäsenvaltiossa.

10. **"Henkilötiedot"** tarkoittaa sovellettavissa tietosuojalaeissa annettua merkitystä henkilötiedoille, henkilötiedoille tai muulle vastaavalle termille.

11. **"Käsittely"** tai **"Käsitellä"** tarkoittaa sovellettavissa tietosuojalaeissa annettua merkitystä henkilötietojen käytölle tai tietokoneoperaation suorittamiselle henkilötiedoille, mukaan lukien automaattiset menetelmät.

12. **"Käsittelijä"** tarkoittaa sovellettavissa tietosuojalaeissa annettua merkitystä yritykselle, joka käsittelee henkilötietoja rekisterinpitäjän puolesta.

13. **"Raportti"** tarkoittaa toisen yrityksen laatimia tarkastusraportteja, jotka on valmistettu Turvapolitiikassa määriteltyjen standardien mukaisesti Palveluntarjoajan puolesta.

14. **"Rajoitettu siirto"** tarkoittaa (a) GDPR:n soveltuessa henkilötietojen siirtoa ETA:sta ETA:n ulkopuolelle maahan, jota Euroopan komissio ei ole todennut riittävän suojaavaksi; ja (b) UK GDPR:n soveltuessa henkilötietojen siirtoa Yhdistyneestä kuningaskunnasta mihin tahansa muuhun maahan, jota ei ole säädelty Yhdistyneen kuningaskunnan tietosuojalain 2018 17A §:n mukaisesti hyväksytyillä riittävyyssäännöksillä.

15. **"Tietoturvaloukkaus"** tarkoittaa henkilötietojen tietoturvaloukkausta, kuten GDPR:n 4 artiklassa määritelty.

16. **"Palvelu"** tarkoittaa <strong>Sopimuksessa</strong> kuvattua tuotetta ja/tai palveluja.

17. **"Erityiset henkilötietoryhmät"** tarkoittaa GDPR:n 9 artiklassa määriteltyä merkitystä.

18. **"Alikäsittelijä"** tarkoittaa sovellettavissa tietosuojalaeissa annettua merkitystä yritykselle, joka rekisterinpitäjän hyväksynnällä ja hyväksymisellä avustaa Käsittelijää henkilötietojen käsittelyssä rekisterinpitäjän puolesta.

19. **"UK GDPR"** tarkoittaa Euroopan unionin asetusta 2016/679, joka on toteutettu Yhdistyneen kuningaskunnan Euroopan unionista eroamista koskevan lain (Withdrawal Act) 2018 3 §:n mukaisesti Yhdistyneessä kuningaskunnassa.

20. **"UK-lisäys"** tarkoittaa kansainvälistä tietojen siirtoa koskevaa lisäystä ETA:n SCC:ihin, jonka on julkaissut tietosuojavaltuutettu osapuolille, jotka tekevät rajoitettuja siirtoja S119A(1) Tietosuojalain 2018 mukaisesti.


## Tekijänoikeudet {#credits}

Tämä asiakirja on johdannainen [Common Paper DPA Standard Terms (Versio 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) -asiakirjasta ja se on lisensoitu [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)-lisenssillä.
