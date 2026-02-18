# Tietojenkäsittelysopimus {#data-processing-agreement}

<!-- v1.0 osoitteesta <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Keskeiset termit](#key-terms)
* [Sopimuksen muutokset](#changes-to-the-agreement)
* [1. Käsittelijän ja alihankkijan väliset suhteet](#1-processor-and-subprocessor-relationships)
  * [1. Palveluntarjoaja käsittelijänä](#1-provider-as-processor)
  * [2. Palveluntarjoaja alihankkijana](#2-provider-as-subprocessor)
* [2. Käsittely](#2-processing)
  * [1. Käsittelytiedot](#1-processing-details)
  * [2. Käsittelyohjeet](#2-processing-instructions)
  * [3. Palveluntarjoajan suorittama käsittely](#3-processing-by-provider)
  * [4. Asiakastietojen käsittely](#4-customer-processing)
  * [5. Suostumus käsittelyyn](#5-consent-to-processing)
  * [6. Alikäsittelijät](#6-subprocessors)
* [3. Rajoitetut siirrot](#3-restricted-transfers)
  * [1. Valtuutus](#1-authorization)
  * [2. Siirrot ETA-alueen ulkopuolelle](#2-ex-eea-transfers)
  * [3. Siirrot Yhdistyneen kuningaskunnan ulkopuolelle](#3-ex-uk-transfers)
  * [4. Muut kansainväliset siirrot](#4-other-international-transfers)
* [4. Tietoturvapoikkeamiin reagointi](#4-security-incident-response)
* [5. Tarkastus ja raportit](#5-audit--reports)
  * [1. Tarkastusoikeudet](#1-audit-rights)
  * [2. Tietoturvaraportit](#2-security-reports)
  * [3. Turvallisuusselvitys](#3-security-due-diligence)
* [6. Koordinointi ja yhteistyö](#6-coordination--cooperation)
  * [1. Vastaukset tiedusteluihin](#1-response-to-inquiries)
  * [2. Tietosuoja- ja suoravaikutuksen vaikutustenarvioinnit](#2-dpias-and-dtias)
* [7. Asiakkaan henkilötietojen poistaminen](#7-deletion-of-customer-personal-data)
  * [1. Asiakkaan suorittama poistaminen](#1-deletion-by-customer)
  * [2. Poistaminen DPA:n voimassaolon päättyessä](#2-deletion-at-dpa-expiration)
* [8. Vastuunrajoitus](#8-limitation-of-liability)
  * [1. Vastuun ylärajat ja vahingonkorvausvelvollisuuden raukeaminen](#1-liability-caps-and-damages-waiver)
  * [2. Lähipiirin vaateet](#2-related-party-claims)
  * [3. Poikkeukset](#3-exceptions)
* [9. Asiakirjojen väliset ristiriidat](#9-conflicts-between-documents)
* [10. Sopimuksen voimassaoloaika](#10-term-of-agreement)
* [11. Sovellettava laki ja valitut tuomioistuimet](#11-governing-law-and-chosen-courts)
* [12. Palveluntarjoajasuhde](#12-service-provider-relationship)
* [13. Määritelmät](#13-definitions)
* [Tekijät](#credits)

## Keskeiset termit {#key-terms}

| Termi | Arvo |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sopimus | Tämä tietosuojasopimus täydentää [Terms of Service](/terms)-sopimusta |
| <strong>Hyväksytyt alihankkijat</strong> | [Cloudflare](https://cloudflare.com) (Yhdysvallat; DNS-, verkko- ja tietoturvapalveluntarjoaja), [DataPacket](https://www.datapacket.com/) (Yhdysvallat/Iso-Britannia; hosting-palveluntarjoaja), [Digital Ocean](https://digitalocean.com) (Yhdysvallat; hosting-palveluntarjoaja), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (Yhdysvallat; hosting-palveluntarjoaja), [Stripe](https://stripe.com) (Yhdysvallat; maksujen käsittelijä), [PayPal](https://paypal.com) (Yhdysvallat; maksujen käsittelijä) |
| <strong>Palveluntarjoajan tietoturvayhteyshenkilö</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Turvallisuuskäytäntö</strong> | Näytä [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Hallitseva osavaltio</strong> | Delawaren osavaltio, Yhdysvallat |

## Sopimuksen muutokset {#changes-to-the-agreement}

Tämä asiakirja on johdannainen [Yleiset paperiset DPA-vakioehdot (versio 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0)-asiakirjasta, ja siihen on tehty seuraavat muutokset:

1. [Sovellettava laki ja valitut tuomioistuimet](#11-governing-law-and-chosen-courts) on lisätty alla olevaksi osioksi, ja `Governing State` on tunnistettu yllä.

2. [Palveluntarjoajasuhde](#12-service-provider-relationship) on lisätty alla olevaksi osioksi.

## 1. Käsittelijän ja alihankkijan väliset suhteet {#1-processor-and-subprocessor-relationships}

### 1. Palveluntarjoaja käsittelijänä {#1-provider-as-processor}

Tilanteissa, joissa **Asiakas** on asiakkaan henkilötietojen rekisterinpitäjä, **Palveluntarjoaja** katsotaan käsittelijäksi, joka käsittelee henkilötietoja **Asiakkaan** puolesta.

### 2. Palveluntarjoaja alikäsittelijänä {#2-provider-as-subprocessor}

Tilanteissa, joissa **Asiakas** on asiakkaan henkilötietojen käsittelijä, **Palveluntarjoaja** katsotaan asiakkaan henkilötietojen alihankkijaksi.

## 2. Käsitellään kohdetta {#2-processing}

### 1. Käsittelytiedot {#1-processing-details}

Kansisivun liitteessä I(B) kuvataan tämän käsittelyn kohde, luonne, tarkoitus ja kesto sekä kerättyjen henkilötietojen luokat ja rekisteröityjen luokat.

### 2. Käsittelyohjeet {#2-processing-instructions}

<strong>Asiakas</strong> ohjeistaa <strong>Palveluntarjoajaa</strong> käsittelemään asiakkaan henkilötietoja: (a) Palvelun tarjoamiseksi ja ylläpitämiseksi; (b) Asiakkaan Palvelun käytön kautta mahdollisesti tarkemmin määritellyllä tavalla; (c) <strong>Sopimuksessa</strong> dokumentoidulla tavalla; ja (d) Asiakkaan <strong>an antamien ja <strong>Palveluntarjoajan</strong> vahvistamien muiden kirjallisten ohjeiden mukaisesti, jotka koskevat asiakkaan henkilötietojen käsittelyä tämän Tietojenkäsittelysopimuksen mukaisesti. <strong>Palveluntarjoaja</strong> noudattaa näitä ohjeita, ellei sovellettava lainsäädäntö sitä kiellä. <strong>Palveluntarjoaja</strong> ilmoittaa välittömästi <strong>Asiakkaalle</strong>, jos se ei pysty noudattamaan käsittelyohjeita. <strong>Asiakas</strong> on antanut ja antaa ainoastaan ohjeita, jotka ovat sovellettavan lainsäädännön mukaisia.

### 3. Palveluntarjoajan suorittama käsittely {#3-processing-by-provider}

<strong>Palveluntarjoaja</strong> käsittelee asiakkaan henkilötietoja ainoastaan tämän tietosuojasopimuksen mukaisesti, mukaan lukien kansilehden tiedot. Jos <strong>Palveluntarjoaja</strong> päivittää Palvelua päivittääkseen olemassa olevia tai lisätäkseen uusia tuotteita, ominaisuuksia tai toimintoja, <strong>Palveluntarjoaja</strong> voi muuttaa <strong>Rekisteröityjen luokkia</strong>, <strong>Henkilötietojen luokkia</strong>, <strong>Erityisten tietoluokkien tietoja</strong>, <strong>Erityisten tietoluokkien rajoituksia tai suojatoimia</strong>, <strong>Siirtotiheyttä</strong>, <strong>Käsittelyn luonnetta ja tarkoitusta</strong> ja <strong>Käsittelyn kestoa</strong> tarpeen mukaan päivitysten huomioon ottamiseksi ilmoittamalla <strong>Asiakkaalle</strong> päivityksistä ja muutoksista.

### 4. Asiakkaan käsittely {#4-customer-processing}

Jos **Asiakas** on käsittelijä ja **Palveluntarjoaja** on alihankkija, **Asiakas** noudattaa kaikkia sovellettavia lakeja, jotka koskevat **Asiakkaan** henkilötietojen käsittelyä. **Asiakkaan** sopimus rekisterinpitäjän kanssa edellyttää vastaavasti **Asiakasta** noudattavan kaikkia sovellettavia lakeja, jotka koskevat **Asiakasta** käsittelijänä. Lisäksi **Asiakas** noudattaa **Asiakkaan** ja rekisterinpitäjän välisen sopimuksen alihankkijaa koskevia vaatimuksia.

### 5. Suostumus käsittelyyn {#5-consent-to-processing}

<strong>Asiakas</strong> on noudattanut ja noudattaa edelleen kaikkia sovellettavia tietosuojalakeja, jotka koskevat asiakkaan henkilötietojen toimittamista <strong>Palveluntarjoajalle</strong> ja/tai Palvelulle, mukaan lukien kaikkien tietojen luovuttaminen, kaikkien suostumusten hankkiminen, riittävän valinnanvaran tarjoaminen ja sovellettavien tietosuojalakien edellyttämien asiaankuuluvien suojatoimien toteuttaminen.

### 6. Alikäsittelijät {#6-subprocessors}

a. <strong>Palveluntarjoaja</strong> ei anna, siirrä tai luovuta Asiakkaan henkilötietoja Alikäsittelijälle, ellei <strong>Asiakas</strong> ole hyväksynyt kyseistä Alikäsittelijää. Nykyinen <strong>Hyväksytyn Alikäsittelijän</strong> luettelo sisältää Alikäsittelijöiden henkilöllisyydet, heidän sijaintimaansa ja heidän odotetut Käsittelytehtävänsä. <strong>Palveluntarjoaja</strong> ilmoittaa <strong>Asiakkaalle</strong> vähintään 10 arkipäivää etukäteen ja kirjallisesti kaikista suunnitelluista muutoksista <strong>Hyväksyttyihin Alikäsittelijöihin</strong>, olipa kyse sitten Alikäsittelijän lisäämisestä tai korvaamisesta, jotta <strong>Asiakkaalla</strong> on riittävästi aikaa vastustaa muutoksia ennen kuin <strong>Palveluntarjoaja</strong> alkaa käyttää uusia Alikäsittelijöitä. <strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> tarvittavat tiedot, jotta <strong>Asiakas</strong> voi käyttää oikeuttaan vastustaa muutosta <strong>Hyväksyttyihin Alikäsittelijöihin</strong>. <strong>Asiakkaalla</strong> on 30 päivää aikaa ilmoituksen jälkeen <strong>Hyväksytyistä alihankkijoista</strong> vastustaa muutosta, muuten <strong>Asiakkaan</strong> katsotaan hyväksyneen muutokset. Jos <strong>Asiakas</strong> vastustaa muutosta 30 päivän kuluessa ilmoituksesta, <strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> tekevät yhteistyötä vilpittömässä mielessä ratkaistakseen <strong>Asiakkaan</strong> vastalauseen tai huolenaiheen.

b. Käyttäessään alihankkijaa **Palveluntarjoajalla** on oltava alihankkijan kanssa kirjallinen sopimus, joka varmistaa, että alihankkija käyttää asiakkaan henkilötietoja vain (i) siinä laajuudessa kuin se on tarpeen sille alihankintana annettujen velvoitteiden suorittamiseksi ja (ii) **Sopimuksen** ehtojen mukaisesti.

c. Jos GDPR soveltuu asiakkaan henkilötietojen käsittelyyn, (i) tässä tietosuojasopimuksessa kuvatut tietosuojavelvoitteet (kuten GDPR:n 28(3) artiklassa tarkoitetaan, jos sovellettavissa) koskevat myös alikäsittelijää, ja (ii) **Palveluntarjoajan** sopimus alikäsittelijän kanssa sisältää nämä velvoitteet, mukaan lukien tiedot siitä, miten **Palveluntarjoaja** ja sen alikäsittelijä koordinoivat toimiaan vastatakseen asiakkaan henkilötietojen käsittelyä koskeviin tiedusteluihin tai pyyntöihin. Lisäksi **Palveluntarjoaja** jakaa **Asiakkaan** pyynnöstä kopion sopimuksistaan (mukaan lukien mahdolliset muutokset) alikäsittelijöidensä kanssa. Siinä määrin kuin se on tarpeen liikesalaisuuksien tai muiden luottamuksellisten tietojen, mukaan lukien henkilötietojen, suojaamiseksi, **Palveluntarjoaja** voi muokata alikäsittelijänsä kanssa tekemänsä sopimuksen tekstiä ennen kopion jakamista.

d. <strong>Tarjoaja</strong> on täysin vastuussa kaikista alihankkijoilleen alihankkijana toimivista velvoitteista, mukaan lukien alihankkijoidensa teot ja laiminlyönnit asiakkaan henkilötietojen käsittelyssä. <strong>Tarjoaja</strong> ilmoittaa asiakkaalle kaikista alihankkijoidensa laiminlyönneistä täyttää olennaisen velvoitteen asiakkaan henkilötietojen käsittelyssä <strong>Tarjoajan</strong> ja alihankkijan välisen sopimuksen mukaisesti.

## 3. Rajoitetut siirrot {#3-restricted-transfers}

### 1. Valtuutus {#1-authorization}

<strong>Asiakas</strong> hyväksyy, että <strong>Palveluntarjoaja</strong> voi siirtää Asiakkaan henkilötietoja ETA-alueen, Yhdistyneen kuningaskunnan tai muun asiaankuuluvan maantieteellisen alueen ulkopuolelle, jos se on tarpeen Palvelun tarjoamiseksi. Jos <strong>Palveluntarjoaja</strong> siirtää Asiakkaan henkilötietoja alueelle, jolle Euroopan komissio tai muu asiaankuuluva valvontaviranomainen ei ole antanut tietosuojan riittävyyttä koskevaa päätöstä, <strong>Palveluntarjoaja</strong> toteuttaa asianmukaiset suojatoimet Asiakkaan henkilötietojen siirtämiseksi kyseiselle alueelle sovellettavien tietosuojalakien mukaisesti.

### 2. ETA:n ulkopuoliset siirrot {#2-ex-eea-transfers}

<strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> sopivat, että jos GDPR suojaa Asiakkaan henkilötietojen siirtoa, siirto tapahtuu <strong>Asiakkaalta</strong> ETA-alueen sisältä <strong>Palveluntarjoajalle</strong> ETA-alueen ulkopuolelle, eikä siirtoon sovelleta Euroopan komission tekemää tietosuojan riittävyyspäätöstä, tämän tietosuojasopimuksen allekirjoittamisen myötä <strong>Asiakkaan</strong> ja <strong>Palveluntarjoajan</strong> katsotaan allekirjoittaneen ETA-alueen vakiosopimuslausekkeet ja niiden liitteet, jotka sisällytetään tähän viittauksella. Tällaiset siirrot tehdään ETA-alueen vakiosopimuslausekkeiden mukaisesti, jotka täytetään seuraavasti:

a. ETA-sopimuksen kaksi moduulia (rekisterinpitäjältä käsittelijälle) sovelletaan, kun **Asiakas** on rekisterinpitäjä ja **Palveluntarjoaja** käsittelee asiakkaan henkilötietoja **Asiakkaan** puolesta käsittelijänä.

b. ETA-sopimuslausekkeiden moduuli kolme (käsittelijältä alihankkijalle) sovelletaan, kun **Asiakas** on käsittelijä ja **Palveluntarjoaja** käsittelee asiakkaan henkilötietoja **Asiakkaan** puolesta alihankkijana.

c. Jokaiseen moduuliin sovelletaan seuraavaa (soveltuvin osin):

1. Kohdan 7 mukaista valinnaista telakointilauseketta ei sovelleta;

2. Kohdassa 9 sovelletaan vaihtoehtoa 2 (yleinen kirjallinen valtuutus), ja alikäsittelijän muutoksista on ilmoitettava etukäteen vähintään 10 arkipäivää.

3. Kohdassa 11 valinnaista sanamuotoa ei sovelleta;

4. Kaikki hakasulkeet 13. kohdasta poistetaan;

5. Kohdassa 17 (vaihtoehto 1) ETA:n vakiosopimuslausekkeisiin sovelletaan **hallintojäsenvaltion** lakia.

6. Kohdassa 18(b) riidat ratkaistaan **hallintojäsenvaltion** tuomioistuimissa; ja

7. Tämän tietosuojasopimuksen kansilehti sisältää ETA-sopimuslausekkeiden liitteissä I, II ja III vaaditut tiedot.

### 3. Siirrot Yhdistyneen kuningaskunnan ulkopuolelle {#3-ex-uk-transfers}

<strong>Asiakas</strong> ja <strong>Palveluntarjoaja</strong> sopivat, että jos Yhdistyneen kuningaskunnan GDPR suojaa Asiakkaan henkilötietojen siirtoa, siirto tapahtuu <strong>Asiakkaalta</strong> Yhdistyneen kuningaskunnan sisältä <strong>Palveluntarjoajalle</strong> Yhdistyneen kuningaskunnan ulkopuolelle, eikä siirtoon sovelleta Yhdistyneen kuningaskunnan ulkoministerin tekemää tietosuojan riittävyyspäätöstä, tämän tietosuojasopimuksen allekirjoittamisen myötä <strong>Asiakkaan</strong> ja <strong>Palveluntarjoajan</strong> katsotaan allekirjoittaneen Yhdistyneen kuningaskunnan lisäsopimuksen ja sen liitteet, jotka sisällytetään tähän viittauksella. Tällaiset siirrot tehdään Yhdistyneen kuningaskunnan lisäsopimuksen mukaisesti, joka on täytetty seuraavasti:

a. Tämän DPA:n kohta 3.2 sisältää Yhdistyneen kuningaskunnan lisäyksen taulukossa 2 vaaditut tiedot.

b. Yhdistyneen kuningaskunnan lisäsopimuksen taulukkoa 4 muutetaan seuraavasti: Kumpikaan osapuoli ei voi irtisanoa Yhdistyneen kuningaskunnan lisäsopimusta Yhdistyneen kuningaskunnan lisäsopimuksen 19 §:n mukaisesti; siltä osin kuin ICO julkaisee tarkistetun hyväksytyn lisäsopimuksen Yhdistyneen kuningaskunnan lisäsopimuksen 18 §:n mukaisesti, osapuolet työskentelevät vilpittömässä mielessä tarkistaakseen tätä tietojenkäsittelysopimusta vastaavasti.

c. Kansilehti sisältää Yhdistyneen kuningaskunnan lisäsopimuksen liitteissä 1A, 1B, II ja III vaaditut tiedot.

### 4. Muut kansainväliset siirrot {#4-other-international-transfers}

Henkilötietojen siirroissa, joissa siirron kansainväliseen luonteeseen sovelletaan Sveitsin lakia (eikä minkään ETA-maan tai Yhdistyneen kuningaskunnan lakia), ETA-sopimuslausekkeiden 4 §:n viittaukset yleiseen tietosuoja-asetukseen muutetaan, siinä määrin kuin se on laissa edellytetty, viittaamaan Sveitsin liittovaltion tietosuojalakiin tai sen seuraajaan, ja valvontaviranomaisen käsite sisältää Sveitsin liittovaltion tietosuoja- ja tietosovvaltuutetun.

## 4. Tietoturvahäiriön vaste {#4-security-incident-response}

1. Saatuaan tiedon tietoturvaloukkauksesta **Palveluntarjoajan** tulee: (a) ilmoittaa **Asiakkaalle** ilman aiheetonta viivytystä, kun se on mahdollista, mutta viimeistään 72 tunnin kuluessa siitä, kun **Tietoturvaloukkauksesta** on tullut tietoiseksi; (b) antaa **Tietoturvaloukkauksesta** oikea-aikaista tietoa, kun se tulee tietoiseksi tai **Asiakkaan** kohtuudella pyytäessä; ja (c) ryhtyä viipymättä kohtuullisiin toimenpiteisiin tietoturvaloukkauksen estämiseksi ja tutkimiseksi. **Tarjoajan** tämän tietosuojasopimuksen edellyttämää ilmoitusta tai vastausta tietoturvaloukkaukseen ei tulkita **Tarjoajan** myöntämiseksi mistään tietoturvaloukkaukseen liittyvästä syystä tai vastuusta.

## 5. Tarkastus ja raportit {#5-audit--reports}

### 1. Tarkastusoikeudet {#1-audit-rights}

<strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> kaikki kohtuullisesti tarvittavat tiedot sen osoittamiseksi, että se noudattaa tätä tietosuojasopimusta, ja <strong>Palveluntarjoaja</strong> sallii ja osallistuu tarkastuksiin, mukaan lukien <strong>Asiakkaan</strong> suorittamat tarkastukset, jotta voidaan arvioida <strong>Palveluntarjoajan</strong> tämän tietosuojasopimuksen noudattamista. <strong>Palveluntarjoaja</strong> voi kuitenkin rajoittaa pääsyä tietoihin, jos <strong>Asiakkaan</strong> pääsy tietoihin vaikuttaisi kielteisesti <strong>Palveluntarjoajan</strong> immateriaalioikeuksiin, luottamuksellisuusvelvoitteisiin tai muihin sovellettavien lakien mukaisiin velvoitteisiin. <strong>Asiakas</strong> vahvistaa ja hyväksyy, että se käyttää tämän tietosuojasopimuksen mukaisia tarkastusoikeuksiaan ja sovellettavien tietosuojalakien myöntämiä tarkastusoikeuksiaan vain ohjeistamalla <strong>Palveluntarjoajaa</strong> noudattamaan alla olevia raportointi- ja huolellisuusvelvoitteita. <strong>Palveluntarjoaja</strong> säilyttää tietoja tämän tietosuojasopimuksen noudattamisesta 3 vuotta tietosuojasopimuksen päättymisen jälkeen.

### 2. Tietoturvaraportit {#2-security-reports}

<strong>Asiakas</strong> hyväksyy, että <strong>Palveluntarjoajaa</strong> auditoidaan säännöllisesti <strong>tietoturvakäytännössä</strong> määriteltyjen standardien mukaisesti riippumattomien kolmannen osapuolen auditoijien toimesta. Kirjallisesta pyynnöstä <strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> luottamuksellisesti tiivistelmän ajantasaisesta raportistaan, jotta <strong>Asiakas</strong> voi varmistaa, että <strong>Palveluntarjoaja</strong> noudattaa <strong>tietoturvakäytännössä</strong> määriteltyjä standardeja.

### 3. Turvallisuusselvitys {#3-security-due-diligence}

Raportin lisäksi **Palveluntarjoaja** vastaa **Asiakkaan** kohtuullisiin tietopyyntöihin vahvistaakseen **Palveluntarjoajan** tämän Tietojenkäsittelysopimuksen noudattamisen, mukaan lukien vastaukset tietoturva-, due diligence- ja auditointikyselyihin tai antamalla lisätietoja sen tietoturvaohjelmasta. Kaikki tällaiset pyynnöt on tehtävä kirjallisesti **Palveluntarjoajan tietoturvayhteyshenkilölle**, ja niitä saa tehdä vain kerran vuodessa.

## 6. Koordinointi ja yhteistyö {#6-coordination--cooperation}

### 1. Vastaus tiedusteluihin {#1-response-to-inquiries}

Jos **Palveluntarjoaja** vastaanottaa keneltä tahansa muulta tiedustelun tai pyynnön asiakkaan henkilötietojen käsittelystä, **Palveluntarjoaja** ilmoittaa **Asiakkaalle** pyynnöstä, eikä **Palveluntarjoaja** vastaa pyyntöön ilman **Asiakkaan** etukäteistä suostumusta. Esimerkkejä tällaisista tiedusteluista ja pyynnöistä ovat oikeudellisen, hallinnollisen tai sääntelyviranomaisen määräys asiakkaan henkilötiedoista, jos **Asiakkaalle** ilmoittaminen ei ole sovellettavan lain kieltämää, tai rekisteröidyn pyyntö. Jos sovellettava laki sen sallii, **Palveluntarjoaja** noudattaa **Asiakkaan** kohtuullisia ohjeita näistä pyynnöistä, mukaan lukien tilannepäivitysten ja muiden **Asiakkaan** kohtuudella pyytämien tietojen toimittaminen. Jos rekisteröity tekee sovellettavien tietosuojalakien mukaisen pätevän pyynnön poistaa Asiakkaan henkilötietoja tai estää heitä luovuttamasta henkilötietoja Palveluntarjoajalle, Palveluntarjoaja avustaa Asiakasta pyynnön täyttämisessä sovellettavan tietosuojalain mukaisesti. Palveluntarjoaja tekee yhteistyötä Asiakkaan kanssa ja tarjoaa Asiakkaalle kohtuullista apua Asiakkaan kustannuksella kaikissa Asiakkaan oikeudellisissa vastauksissa tai muissa prosessuaalisissa toimissa, joita Asiakas suorittaa vastauksena kolmannen osapuolen pyyntöön Palveluntarjoajan suorittamasta Asiakkaan henkilötietojen käsittelystä tämän Tietojenkäsittelysopimuksen nojalla.

### 2. DPIA:t ja DTIA:t {#2-dpias-and-dtias}

Jos sovellettavat tietosuojalait sitä edellyttävät, **Palveluntarjoaja** avustaa **Asiakasta** kohtuullisesti pakollisten tietosuojavaikutusten arviointien tai tiedonsiirron vaikutusten arviointien sekä asiaankuuluvien tietosuojaviranomaisten kanssa tehtävien neuvottelujen suorittamisessa ottaen huomioon käsittelyn luonteen ja asiakkaan henkilötiedot.

## 7. Asiakkaan henkilötietojen poistaminen {#7-deletion-of-customer-personal-data}

### 1. Asiakkaan tekemä poisto {#1-deletion-by-customer}

<strong>Palveluntarjoaja</strong> antaa <strong>Asiakkaalle</strong> mahdollisuuden poistaa Asiakkaan henkilötietoja Palveluiden toiminnallisuuden edellyttämällä tavalla. <strong>Palveluntarjoaja</strong> noudattaa tätä ohjetta niin pian kuin se on kohtuudella mahdollista, paitsi jos Asiakkaan henkilötietojen lisäsäilytystä edellytetään sovellettavan lain nojalla.

### 2. Poisto DPA:n vanhentuessa {#2-deletion-at-dpa-expiration}

a. Tietojenkäsittelysopimuksen (DPA) päättymisen jälkeen **Palveluntarjoaja** palauttaa tai poistaa asiakkaan henkilötiedot **Asiakkaan** ohjeiden mukaisesti, ellei sovellettava laki vaadi tai salli asiakkaan henkilötietojen lisäsäilytystä. Jos palauttaminen tai tuhoaminen on käytännössä mahdotonta tai sovellettava laki kieltää sen, **Palveluntarjoaja** ryhtyy kohtuullisiin toimiin estääkseen asiakkaan henkilötietojen lisäkäsittelyn ja jatkaa hallussaan, säilytyksessään tai valvonnassaan olevien asiakkaan henkilötietojen suojaamista. Sovellettava laki voi esimerkiksi edellyttää **Palveluntarjoajaa** jatkamaan asiakkaan henkilötietojen säilyttämistä tai käsittelyä.

b. Jos **Asiakas** ja **Palveluntarjoaja** ovat allekirjoittaneet ETA-sopimuksen vakiolausekkeet tai Yhdistyneen kuningaskunnan lisäsopimuksen osana tätä tietojenkäsittelysopimusta, **Palveluntarjoaja** myöntää **Asiakkaalle** ETA-sopimuslausekkeiden 8.1(d) ja 8.5 kohdassa kuvatun henkilötietojen poistotodistuksen vain, jos **Asiakas** sitä pyytää.

## 8. Vastuunrajoitus {#8-limitation-of-liability}

### 1. Vastuun ylärajat ja vahingonkorvausvastuun vapauslauseke {#1-liability-caps-and-damages-waiver}

**Sovellettavien tietosuojalakien sallimissa rajoissa kummankin osapuolen kokonaisvastuu toista osapuolta kohtaan, joka johtuu tästä tietojenkäsittelysopimuksesta tai liittyy siihen, on **Sopimuksessa** mainittujen vastuuvapauslausekkeiden, poissulkemisten ja vastuunrajoitusten alainen.**

### 2. Lähipiirin vaatimukset {#2-related-party-claims}

**Kaikki tähän tietosuojasopimukseen (DPA) liittyvät tai siitä johtuvat vaatimukset **Palveluntarjoajaa** tai sen tytäryhtiöitä vastaan voi esittää ainoastaan **Sopimuksen** osapuoli.**

### 3. Poikkeukset {#3-exceptions}

1. Tämä tietosuojasopimus ei rajoita yksilön vastuuta hänen tietosuojaoikeuksistaan sovellettavien tietosuojalakien nojalla. Lisäksi tämä tietosuojasopimus ei rajoita osapuolten välistä vastuuta ETA-sopimuksen tai Yhdistyneen kuningaskunnan lisäsopimuksen rikkomisesta.

## 9. Ristiriidat asiakirjojen välillä {#9-conflicts-between-documents}

1. Tämä tietosuojasopimus on osa sopimusta ja täydentää sitä. Jos tämän tietosuojasopimuksen, **Sopimuksen** tai jonkin niiden osan välillä on ristiriitaisuuksia, aiemmin luetellulla osalla on etusija myöhemmin lueteltuun osaan nähden kyseisen ristiriidan osalta: (1) ETA:n vakiosopimuslausekkeet tai Yhdistyneen kuningaskunnan lisäys, (2) tämä tietosuojasopimus ja sitten (3) **Sopimus**.

## 10. Sopimuksen voimassaoloaika {#10-term-of-agreement}

Tämä tietosuojasopimus tulee voimaan, kun **Palveluntarjoaja** ja **Asiakas** sopivat tietosuojasopimuksen kansilehdestä ja allekirjoittavat tai hyväksyvät **Sopimuksen** sähköisesti, ja se jatkuu, kunnes **Sopimus** vanhenee tai irtisanotaan. **Palveluntarjoaja** ja **Asiakas** ovat kuitenkin edelleen tämän tietosuojasopimuksen ja sovellettavien tietosuojalakien velvoitteiden alaisia, kunnes **Asiakas** lopettaa asiakkaan henkilötietojen siirtämisen **Palveluntarjoajalle** ja **Palveluntarjoaja** lopettaa asiakkaan henkilötietojen käsittelyn.

## 11. Sovellettava laki ja valitut tuomioistuimet {#11-governing-law-and-chosen-courts}

Sovellettavasta laista tai **Sopimuksen** vastaavista lausekkeista huolimatta kaikkiin tätä Tietojenkäsittelysopimusta koskeviin tulkintoihin ja riitoihin sovelletaan **hallintovaltion** lakia ottamatta huomioon sen lainvalintasäännöksiä. Lisäksi ja **sopimuksen** oikeuspaikan valintaa, lainkäyttövaltaa tai vastaavia lausekkeita lukuun ottamatta osapuolet sopivat nostavansa kaikki tätä Tietojenkäsittelysopimusta koskevat kanteet, toimet tai menettelyt **hallintovaltion** tuomioistuimissa, ja kumpikin osapuoli peruuttamattomasti alistuu kyseisen valtion** tuomioistuinten yksinomaiseen toimivaltaan.

## 12. Palveluntarjoajan suhde {#12-service-provider-relationship}

Siltä osin kuin Kalifornian kuluttajien tietosuojalakia, Cal. Civ. Code § 1798.100 et seq ("CCPA") sovelletaan, osapuolet ymmärtävät ja sopivat, että **Palveluntarjoaja** on palveluntarjoaja ja vastaanottaa henkilötietoja **Asiakkaalta** tarjotakseen **Sopimuksessa** sovitun **Palveluntarjoajan** mukaisesti, mikä muodostaa liiketoimintatarkoituksen. **Palveluntarjoaja** ei myy **Asiakkaan** **Sopimuksen** nojalla toimittamia henkilötietoja. Lisäksi **Palveluntarjoaja** ei säilytä, käytä tai luovuta **Asiakkaan** **Sopimuksen** nojalla toimittamia henkilötietoja, paitsi siltä osin kuin se on tarpeen **Asiakkaalle** **Sopimuksessa** mainitulla tavalla tai sovellettavien tietosuojalakien sallimalla tavalla. **Palveluntarjoaja** vakuuttaa ymmärtävänsä tämän kappaleen rajoitukset.

## 13. Määritelmät {#13-definitions}

1. **"Sovellettavat lait"** tarkoittaa lakeja, sääntöjä, määräyksiä, tuomioistuimen määräyksiä ja muita asiaankuuluvan viranomaisen sitovia vaatimuksia, jotka koskevat osapuolta tai joita sovelletaan häneen.

2. **"Sovellettavat tietosuojalait"** tarkoittaa sovellettavia lakeja, jotka säätelevät, miten Palvelu voi käsitellä tai käyttää yksilön henkilötietoja, henkilötietoja, henkilökohtaisesti tunnistettavia tietoja tai muita vastaavia termejä.

3. **"Rekisterinpitäjä"** on määritelty sovellettavissa tietosuojalaeissa sen yrityksen osalta, joka määrittää henkilötietojen käsittelyn tarkoituksen ja laajuuden.

4. **"Kansilehti"** tarkoittaa osapuolten allekirjoittamaa tai sähköisesti hyväksymää asiakirjaa, joka sisältää nämä Tietojenkäsittelysopimuksen vakioehdot ja jossa yksilöidään **Toimittaja**, **Asiakas** sekä tietojenkäsittelyn kohde ja yksityiskohdat.

5. **"Asiakkaan henkilötiedot"** tarkoittaa henkilötietoja, jotka **Asiakas** lataa tai toimittaa **Palveluntarjoajalle** osana Palvelua ja joita säännellään tällä Tietojenkäsittelysopimuksella.

6. **"DPA"** tarkoittaa näitä DPA-vakioehtoja, **Palveluntarjoajan** ja **Asiakkaan** välistä kansilehteä sekä kansilehdellä viitattuja tai siihen liitettyjä käytäntöjä ja asiakirjoja.

7. **”ETA:n vakiosopimuslausekkeet”** tarkoittavat mallisopimuslausekkeita, jotka on liitetty Euroopan komission 4. kesäkuuta 2021 antamaan täytäntöönpanopäätökseen 2021/914 mallisopimuslausekkeista henkilötietojen siirtoa kolmansiin maihin varten Euroopan parlamentin ja neuvoston asetuksen (EU) 2016/679 nojalla.

8. **"Euroopan talousalue"** tai **"ETA"** tarkoittaa Euroopan unionin jäsenvaltioita, Norjaa, Islantia ja Liechtensteinia.

9. **"GDPR"** tarkoittaa Euroopan unionin asetusta 2016/679 sellaisena kuin se on pantu täytäntöön paikallisella lainsäädännöllä kyseisessä ETA-jäsenvaltiossa.

10. **"Henkilötiedoilla"** on sama merkitys kuin sovellettavissa tietosuojalaeissa henkilötiedoille, henkilötiedoille tai muille vastaaville termeille on annettu.

11. **"Käsittelyllä** tai **"Prosessilla"** on sama merkitys kuin sovellettavissa tietosuojalaeissa, jotka koskevat henkilötietojen käyttöä tai niihin kohdistuvien tietokonetoimintojen suorittamista, mukaan lukien automaattiset menetelmät.

12. **"Käsittelijä"** on määritelty sovellettavissa tietosuojalaeissa rekisterinpitäjän puolesta henkilötietoja käsittelevälle yritykselle.

13. **"Raportti"** tarkoittaa toisen yrityksen Palveluntarjoajan puolesta turvallisuuskäytännössä määriteltyjen standardien mukaisesti laatimia tarkastusraportteja.

14. **"Rajoitettu siirto"** tarkoittaa (a) jos GDPR:ää sovelletaan, henkilötietojen siirtoa ETA-alueelta ETA-alueen ulkopuoliseen maahan, johon Euroopan komissio ei ole tehnyt tietosuojan riittävyysmääritystä; ja (b) jos Yhdistyneen kuningaskunnan GDPR:ää sovelletaan, henkilötietojen siirtoa Yhdistyneestä kuningaskunnasta mihin tahansa muuhun maahan, johon ei sovelleta Yhdistyneen kuningaskunnan vuoden 2018 tietosuojalain 17A §:n nojalla annettuja tietosuojan riittävyyssäännöksiä.

15. **"Tietoturvaloukkaus"** tarkoittaa henkilötietojen tietoturvaloukkausta, joka on määritelty GDPR:n 4 artiklassa.

16. **"Palvelu"** tarkoittaa **Sopimuksessa** kuvattua tuotetta ja/tai palveluita.**

17. **”Erityisryhmiin kuuluvilla tiedoilla”** on sama merkitys kuin GDPR:n 9 artiklassa.

18. **"Alihankkijalla"** on sama merkitys kuin sovellettavissa tietosuojalaeissa yritykselle, joka rekisterinpitäjän hyväksynnällä ja suostumuksella avustaa käsittelijää henkilötietojen käsittelyssä rekisterinpitäjän puolesta.

19. **"Yhdistyneen kuningaskunnan GDPR"** tarkoittaa Euroopan unionin asetusta 2016/679, sellaisena kuin se on pantu täytäntöön Yhdistyneessä kuningaskunnassa vuoden 2018 Euroopan unionista eroamislain 3 §:llä.

20. **"Yhdistyneen kuningaskunnan lisäys"** tarkoittaa ETA:n vakiosopimusehtojen kansainvälistä tiedonsiirtoa koskevaa lisäystä, jonka on antanut tietosuojavaltuutettu osapuolille, jotka tekevät rajoitettuja tiedonsiirtoja vuoden 2018 tietosuojalain S119A(1) nojalla.

## Tekijät {#credits}

Tämä asiakirja on johdannainen asiakirjasta [Yleiset paperiset DPA-vakioehdot (versio 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) ja siihen sovelletaan [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)-lisenssiä.