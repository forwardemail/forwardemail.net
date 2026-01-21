# PayPalin 11 vuotta kestänyt API-katastrofi: Miten loimme kiertoteitä, kun he jättivät kehittäjät huomiotta {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Me Forward Emaililla olemme käsitelleet PayPalin rikkinäisiä API-rajapintoja yli vuosikymmenen ajan. Se, mikä alkoi pieninä turhautumisina, on muuttunut täydelliseksi katastrofiksi, joka pakotti meidät kehittämään omia kiertoteitä, estämään heidän tietojenkalastelumallinsa ja lopulta pysäyttämään kaikki PayPal-maksut kriittisen tilin siirron aikana.</p>
<p class="lead mt-3">Tämä on tarina 11 vuodesta, jolloin PayPal jätti huomiotta kehittäjien perustarpeet, kun me yritimme kaikkea saadaksemme heidän alustansa toimimaan.</p>

## Sisällysluettelo {#table-of-contents}

* [Puuttuva pala: Ei tapaa listata tilauksia](#the-missing-piece-no-way-to-list-subscriptions)
* [2014–2017: Ongelma ilmenee](#2014-2017-the-problem-emerges)
* [2020: Annamme heille laajaa palautetta](#2020-we-give-them-extensive-feedback)
  * [27 kohdan palautelista](#the-27-item-feedback-list)
  * [Tiimit osallistuivat, lupauksia annettiin](#teams-got-involved-promises-were-made)
  * [Tulos? Ei mitään.](#the-result-nothing)
* [Johtajien pakomatka: Kuinka PayPal menetti kaiken institutionaalisen muistin](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Uusi johto, samat ongelmat](#2025-new-leadership-same-problems)
  * [Uusi toimitusjohtaja osallistuu](#the-new-ceo-gets-involved)
  * [Michelle Gillin vastaus](#michelle-gills-response)
  * [Vastauksemme: Ei enää kokouksia](#our-response-no-more-meetings)
  * [Marty Brodbeckin ylisuunnittelun vastaus](#marty-brodbecks-overengineering-response)
  * ["Yksinkertainen roska" -ristiriita](#the-simple-crud-contradiction)
  * [Yhteyden katkeaminen selvenee](#the-disconnect-becomes-clear)
* [Vuosien bugiraportit, jotka he jättivät huomiotta](#years-of-bug-reports-they-ignored)
  * [2016: Varhaiset käyttöliittymä-/käyttäjäkokemusvalitukset](#2016-early-uiux-complaints)
  * [2021: Yrityssähköpostin virheraportti](#2021-business-email-bug-report)
  * [2021: Käyttöliittymän parannusehdotuksia](#2021-ui-improvement-suggestions)
  * [2021: Hiekkalaatikkoympäristöjen epäonnistumiset](#2021-sandbox-environment-failures)
  * [2021: Raportointijärjestelmä täysin rikki](#2021-reports-system-completely-broken)
  * [2022: Ydin-API-ominaisuus puuttuu (taas)](#2022-core-api-feature-missing-again)
* [Kehittäjäkokemuksen painajainen](#the-developer-experience-nightmare)
  * [Rikkoutunut käyttöliittymä](#broken-user-interface)
  * [SDK-ongelmat](#sdk-problems)
  * [Sisällön turvallisuuskäytäntöjen rikkomukset](#content-security-policy-violations)
  * [Dokumentaatiokaaos](#documentation-chaos)
  * [Tietoturvahaavoittuvuudet](#security-vulnerabilities)
  * [Istunnonhallinnan katastrofi](#session-management-disaster)
* [Heinäkuu 2025: Viimeinen pisara](#july-2025-the-final-straw)
* [Miksi emme voi vain hylätä PayPalia](#why-we-cant-just-drop-paypal)
* [Yhteisön kiertotapa](#the-community-workaround)
* [PayPal-mallien estäminen tietojenkalastelun vuoksi](#blocking-paypal-templates-due-to-phishing)
  * [Todellinen ongelma: PayPalin mallit näyttävät huijauksilta](#the-real-problem-paypals-templates-look-like-scams)
  * [Toteutuksemme](#our-implementation)
  * [Miksi meidän piti estää PayPal](#why-we-had-to-block-paypal)
  * [Ongelman laajuus](#the-scale-of-the-problem)
  * [Ironia](#the-irony)
  * [Vaikutus tosielämässä: Uudet PayPal-huijaukset](#real-world-impact-novel-paypal-scams)
* [PayPalin taaksepäin suuntautuva KYC-prosessi](#paypals-backwards-kyc-process)
  * [Miten sen pitäisi toimia](#how-it-should-work)
  * [Miten PayPal oikeasti toimii](#how-paypal-actually-works)
  * [Todellisen maailman vaikutus](#the-real-world-impact)
  * [Tilinsiirtokatastrofi heinäkuussa 2025](#the-july-2025-account-migration-disaster)
  * [Miksi tämä on tärkeää](#why-this-matters)
* [Miten jokainen muu maksunvälittäjä tekee sen oikein](#how-every-other-payment-processor-does-it-right)
  * [Raita](#stripe)
  * [Meloa](#paddle)
  * [Coinbase-kauppa](#coinbase-commerce)
  * [Neliö](#square)
  * [Alan standardi](#the-industry-standard)
  * [Mitä muut käsittelijät tarjoavat verrattuna PayPaliin](#what-other-processors-provide-vs-paypal)
* [PayPalin järjestelmällinen peittely: 6 miljoonan äänen vaientaminen](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Suuri pyyhkiminen](#the-great-erasure)
  * [Kolmannen osapuolen pelastus](#the-third-party-rescue)
* [11 vuotta kestänyt sieppausvirheen katastrofi: 1 899 dollaria ja lisää tulee](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Sähköpostin edelleenlähetyksen 1 899 dollarin tappio](#forward-emails-1899-loss)
  * [Vuoden 2013 alkuperäinen raportti: Yli 11 vuotta huolimattomuutta](#the-2013-original-report-11-years-of-negligence)
  * [Vuoden 2016 tunnustus: PayPal rikkoo oman SDK:nsa](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Vuoden 2024 eskalaatio: Yhä rikki](#the-2024-escalation-still-broken)
  * [Webhookin luotettavuuskatastrofi](#the-webhook-reliability-disaster)
  * [Systemaattisen laiminlyönnin malli](#the-pattern-of-systematic-negligence)
  * [Dokumentoimaton vaatimus](#the-undocumented-requirement)
* [PayPalin laajempi petosmalli](#paypals-broader-pattern-of-deception)
  * [New Yorkin finanssipalveluviraston toimintasuunnitelma](#the-new-york-department-of-financial-services-action)
  * [Hunajaa koskeva oikeusjuttu: Affiliate-linkkien uudelleenkirjoittaminen](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPalin laiminlyönnin hinta](#the-cost-of-paypals-negligence)
  * [Dokumentaatiovalhe](#the-documentation-lie)
* [Mitä tämä tarkoittaa kehittäjille](#what-this-means-for-developers)

## Puuttuva pala: Tilausten listaaminen ei onnistu {#the-missing-piece-no-way-to-list-subscriptions}

Tässä on se asia, joka räjäyttää tajuntamme: PayPalilla on ollut tilauslaskutus vuodesta 2014 lähtien, mutta he eivät ole koskaan tarjonneet kauppiaille tapaa listata omia tilauksiaan.

Mietipä tätä hetki. Voit luoda tilauksia ja peruuttaa ne, jos sinulla on ID, mutta et voi saada listaa kaikista aktiivisista tilauksista tilillesi. Se on kuin sinulla olisi tietokanta ilman SELECT-lauseketta.

Tarvitsemme tätä perusliiketoimintaa varten:

* Asiakastuki (kun joku kysyy sähköpostitse tilauksestaan)
* Taloudellinen raportointi ja täsmäytys
* Automatisoitu laskutuksen hallinta
* Vaatimustenmukaisuus ja tilintarkastus

Mutta PayPal? He eivät vain... koskaan kehittäneet sitä.

## 2014–2017: Ongelma ilmenee {#2014-2017-the-problem-emerges}

Tilauslistausongelma ilmestyi ensimmäisen kerran PayPalin yhteisöfoorumeilla vuonna 2017. Kehittäjät kysyivät ilmeistä kysymystä: "Miten saan luettelon kaikista tilauksistani?"

PayPalin vastaus? Sirkat.

Yhteisön jäsenet alkoivat turhautua:

> "Hyvin outo puute, jos kauppias ei pysty listaamaan kaikkia aktiivisia sopimuksia. Jos sopimustunnus katoaa, vain käyttäjä voi peruuttaa tai keskeyttää sopimuksen." - leafspider

> "+1. Siitä on kulunut lähes 3 vuotta." - laudukang (eli ongelma on ollut olemassa vuodesta \~2014 lähtien)

Vuoden 2017 [alkuperäinen yhteisöviesti](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066)-muuttujassa kehittäjät anelevat tätä perustoimintoa. PayPal vastasi arkistoimalla tietovaraston, jossa ongelmasta ilmoitettiin.

## 2020: Annamme heille laajaa palautetta {#2020-we-give-them-extensive-feedback}

Lokakuussa 2020 PayPal otti meihin yhteyttä virallista palautekeskustelua varten. Kyseessä ei ollut mikään satunnainen keskustelu – he järjestivät 45 minuutin Microsoft Teams -puhelun kahdeksan PayPalin johtajan kanssa, mukaan lukien Sri Shivananda (teknologiajohtaja), Edwin Aoki, Jim Magats, John Kunze ja muita.

### 27 kohdan palautelista {#the-27-item-feedback-list}

Tulimme valmistautuneina. Kuuden tunnin API-integraatioyrityksen jälkeen olimme koonneet 27 erityisongelmaa. Mark Stuart PayPal Checkout -tiimistä sanoi:

> Hei Nick, kiitos että jaoit tämän tänään kaikkien kanssa! Uskon, että tämä on katalysaattori sille, että tiimimme saa lisää tukea ja panostusta näiden asioiden korjaamiseen. On ollut vaikeaa saada näin rikasta palautetta kuin sinä olet meille tähän mennessä antanut.

Palaute ei ollut teoreettista – se tuli todellisista integraatioyrityksistä:

1. **Käyttöoikeustunnuksen luonti ei toimi**:

> Käyttöoikeustunnuksen luonti ei toimi. Lisäksi pitäisi olla enemmän kuin vain cURL-esimerkkejä.

2. **Ei verkkokäyttöliittymää tilauksen luomiseen**:

> Miten ihmeessä voit luoda tilauksia ilman cURL:ää? Tähän ei näytä olevan verkkokäyttöliittymää (kuten Stripellä on).

Mark Stuart koki käyttöoikeustunnuksen ongelman erityisesti seuraavia asioita koskien:

> Emme yleensä kuule ongelmista käyttöoikeustunnuksen luomisessa.

### Tiimit osallistuivat, lupaukset annettiin {#teams-got-involved-promises-were-made}

Kun löysimme lisää ongelmia, PayPal lisäsi keskusteluun lisää tiimejä. Darshan Raju tilausten hallintakäyttöliittymätiimistä liittyi mukaan ja sanoi:

> Tunnustamme puutteen. Seuraamme asiaa ja korjaamme sen. Kiitos vielä kerran palautteestasi!

Istuntoa kuvailtiin etsittäväksi:

>rehellinen katsaus kokemukseesi

kohteeseen:

> tehdä PayPalista juuri sitä, mitä sen pitäisi olla kehittäjille.

### Tulos? Ei mitään. {#the-result-nothing}

Virallisesta palautetilaisuudesta, laajasta 27 kohdan listasta, useiden tiimien osallistumisesta ja lupauksista huolimatta:

> seuranta ja osoite

ongelmia, mitään ei korjattu.

## Johtajien irtautuminen: Kuinka PayPal menetti kaiken institutionaalisen muistin {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Tässä kohtaa asia menee todella mielenkiintoiseksi. Jokainen vuoden 2020 palautteesi saanut henkilö on poistunut PayPalista:

**Johtokunnan muutokset:**

* [Dan Schulman (toimitusjohtaja 9 vuotta) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (syyskuu 2023)
* [Sri Shivananda (teknologiajohtaja, joka organisoi palautteen) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (tammikuu 2024)

**Tekniset johtajat, jotka antoivat lupauksia ja sitten lähtivät:**

* **Mark Stuart** (luvattu palaute olisi "katalyytti") → [Nyt Ripplessä](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 vuotta PayPal-veteraani) → [MX:n toimitusjohtaja](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (globaalin kuluttajatuotejohtaja) → [Eläkkeellä](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (yksi viimeisistä jäljellä olevista) → [Juuri lähdin Nasdaqiin](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (tammikuu 2025)

PayPalista on tullut pyöröovi, jossa johtajat keräävät kehittäjien palautetta, antavat lupauksia ja siirtyvät sitten parempiin yrityksiin, kuten JPMorganiin, Rippleen ja muihin fintech-yrityksiin.

Tämä selittää, miksi vuoden 2025 GitHub-ongelmaan liittyvä vastaus vaikutti täysin irralliselta vuoden 2020 palautteestamme – kirjaimellisesti kaikki palautteen saaneet ovat poistuneet PayPalista.

## 2025: Uusi johto, samat ongelmat {#2025-new-leadership-same-problems}

Vuoteen 2025 asti sama kaava toistuu. Vuosien edistyksen pysähtymisen jälkeen PayPalin uusi johto ottaa jälleen yhteyttä.

### Uusi toimitusjohtaja osallistuu {#the-new-ceo-gets-involved}

30. kesäkuuta 2025 otimme asian suoraan yhteyttä PayPalin uuteen toimitusjohtajaan Alex Chrissiin. Hänen vastauksensa oli lyhyt:

> Hei Nick – Kiitos yhteydenotostasi ja palautteestasi. Michelle (cc'd) on paikalla tiiminsä kanssa ja valmis käsittelemään tätä asiaa kanssasi. Kiitos -A

### Michelle Gillin vastaus {#michelle-gills-response}

Michelle Gill, pienyritysten ja rahoituspalveluiden johtaja ja varatoimitusjohtaja, vastasi:

> Kiitos paljon Nick, Alexin siirtämisestä piilokopioon. Olemme tutkineet tätä aiemmasta viestistäsi lähtien. Soitamme sinulle ennen viikon loppua. Voisitko lähettää minulle yhteystietosi, jotta joku kollegoistani voi ottaa sinuun yhteyttä? Michelle

### Vastauksemme: Ei enää kokouksia {#our-response-no-more-meetings}

Kieltäydyimme toisesta tapaamisesta ja selitimme turhautumistamme:

> Kiitos. En kuitenkaan usko, että puheluun soittaminen auttaisi mitään. Tässä syy... Soitin aiemmin puhelun, eikä se johtanut mihinkään. Tuhlasin yli kaksi tuntia aikaani puhumalla koko tiimin ja johdon kanssa, eikä mitään tapahtunut... Tonnikaupalla sähköposteja edestakaisin. Mitään ei tapahtunut. Palaute ei johtanut mihinkään. Yritin vuosia, minua kuunneltiin, ja sitten se ei johtanut mihinkään.

### Marty Brodbeckin ylisuunnittelun vastaus {#marty-brodbecks-overengineering-response}

Sitten Marty Brodbeck, joka johtaa PayPalin kuluttajatekniikkaa, otti yhteyttä:

> Hei Nick, täällä Marty Brodbeck. Vastaan kaikesta kuluttajasuunnittelusta täällä PayPalilla ja olen johtanut yrityksen API-kehitystä. Voisimmeko keskustella kanssasi kohtaamasi ongelman ja sen suhteen, miten voisimme auttaa sinua.

Kun selitimme yksinkertaisen tarpeen tilauslistauspäätepisteelle, hänen vastauksensa paljasti tarkalleen ongelman:

> Kiitos Nick, olemme luomassa yhtä tilaus-API:a täydellä SDK:lla (tukee täydellistä virheenkäsittelyä, tapahtumapohjaista tilausten seurantaa ja vankkaa käyttöaikaa), jossa laskutus on myös jaettu erilliseksi API:ksi, johon kauppiaat voivat siirtyä sen sijaan, että heidän tarvitsisi koordinoida useiden päätepisteiden välillä saadakseen yhden vastauksen.

Tämä on täysin väärä lähestymistapa. Emme tarvitse kuukausien monimutkaista arkkitehtuuria. Tarvitsemme yhden yksinkertaisen REST-päätepisteen, joka listaa tilaukset – jotain, jonka olisi pitänyt olla olemassa vuodesta 2014 lähtien.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "Yksinkertainen roska" -ristiriita {#the-simple-crud-contradiction}

Kun huomautimme, että kyseessä oli CRUD:n perustoiminnallisuus, jonka olisi pitänyt olla olemassa vuodesta 2014 lähtien, Martyn vastaus oli paljastava:

> Yksinkertaiset Crud-operaatiot ovat osa ydin-API:a, ystäväni, joten niiden kehittäminen ei vie kuukausia

PayPal TypeScript SDK, joka kuukausien kehityksen jälkeen tukee tällä hetkellä vain kolmea päätepistettä, sekä sen historiallinen aikajana osoittavat selvästi, että tällaisten projektien valmistuminen vie enemmän kuin muutaman kuukauden.

Tämä vastaus osoittaa, ettei hän ymmärrä omaa API:aan. Jos "yksinkertaiset CRUD-operaatiot ovat osa ydin-API:a", niin missä on tilauslistauksen päätepiste? Vastasimme:

> Jos ”yksinkertaiset CRUD-operaatiot ovat osa ydin-API:a”, niin missä on tilauslistauksen päätepiste? Kehittäjät ovat pyytäneet tätä ”yksinkertaista CRUD-operaatiota” vuodesta 2014 lähtien. Siitä on kulunut 11 vuotta. Kaikilla muilla maksupalveluntarjoajilla on ollut tämä perustoiminto alusta asti.

### Yhteyden katkeaminen selkeytyy {#the-disconnect-becomes-clear}

Vuoden 2025 keskustelut Alex Chrissin, Michelle Gillin ja Marty Brodbeckin kanssa osoittavat saman organisaation toimintahäiriön:

1. **Uudella johdolla ei ole tietoa aiemmista palautekeskusteluista**
2. **He ehdottavat samoja ylimitoitettuja ratkaisuja**
3. **He eivät ymmärrä omia API-rajoituksiaan**
4. **He haluavat lisää kokouksia pelkän ongelman korjaamisen sijaan**

Tämä kaava selittää, miksi PayPal-tiimit vuonna 2025 tuntuvat olevan täysin irrallaan vuonna 2020 annetusta laajasta palautteesta – palautetta saaneet ihmiset ovat poissa, ja uusi johto toistaa samoja virheitä.

## Vuosien varrella virheraportteja, jotka he jättivät huomiotta {#years-of-bug-reports-they-ignored}

Emme valittaneet vain puuttuvista ominaisuuksista. Raportoimme aktiivisesti bugeista ja yritimme auttaa heitä parantamaan. Tässä on kattava aikajana dokumentoimistamme ongelmista:

### 2016: Varhaiset käyttöliittymä-/käyttäjäkokemusvalitukset {#2016-early-uiux-complaints}

Jo vuonna 2016 otimme julkisesti yhteyttä PayPalin johtoon, mukaan lukien Dan Schulmaniin, käyttöliittymäongelmista ja käytettävyysongelmista. Tästä on yhdeksän vuotta, ja samat käyttöliittymä- ja käyttökokemusongelmat jatkuvat edelleen.

### 2021: Yrityssähköpostin virheraportti {#2021-business-email-bug-report}

Maaliskuussa 2021 raportoimme, että PayPalin yrityssähköpostijärjestelmä lähetti virheellisiä peruutusilmoituksia. Sähköpostimallissa oli muuttujia, jotka oli renderöity väärin, mikä näytti asiakkaille hämmentäviä viestejä.

Mark Stuart myönsi ongelman:

> Kiitos Nick! Siirrytään piilokopioon. @Prasy, onko tiimisi vastuussa tästä sähköpostista vai tiedätkö kuka on? "Niftylettuce, LLC, emme enää laskuta sinua" -teksti antaa ymmärtää, että sähköpostin vastaanottajassa ja sisällössä on sekaannusta.

**Tulos**: He todella korjasivat tämän! Mark Stuart vahvisti:

> Kuulin juuri ilmoitustiimiltä, että sähköpostipohja on korjattu ja otettu käyttöön. Arvostamme, että otit yhteyttä ilmoittaaksesi siitä. Kiitos!

Tämä osoittaa, että he VOIVAT korjata asioita milloin haluavat – useimmissa ongelmissa he vain päättävät olla tekemättä niin.

### 2021: Käyttöliittymän parannusehdotuksia {#2021-ui-improvement-suggestions}

Helmikuussa 2021 annoimme yksityiskohtaista palautetta heidän hallintapaneelinsa käyttöliittymästä, erityisesti "PayPalin viimeaikainen toiminta" -osiosta:

> Mielestäni paypal.com-sivuston kojelautaa, erityisesti "PayPalin viimeaikaiset tapahtumat", pitäisi parantaa. Mielestäni 0 dollarin toistuvan maksun "Luotu"-tilariviä ei pitäisi näyttää – se vain lisää paljon ylimääräisiä rivejä, eikä yhdellä silmäyksellä näe helposti, kuinka paljon tuloja päivän/viime päivien aikana on kertynyt.

Mark Stuart välitti sen kuluttajatuotetiimille:

> Kiitos! En ole varma, mikä tiimi on vastuussa toiminnasta, mutta lähetin sen kuluttajatuotepäällikölle oikean tiimin löytämiseksi. 0,00 dollarin toistuva maksu vaikuttaa bugilta. Se pitäisi luultavasti suodattaa pois.

**Tulos**: Ei koskaan korjattu. Käyttöliittymä näyttää edelleen näitä turhia $0-merkintöjä.

### 2021: Sandbox-ympäristön virheet {#2021-sandbox-environment-failures}

Marraskuussa 2021 raportoimme kriittisistä ongelmista PayPalin hiekkalaatikkoympäristössä:

* Sandboxin salaiset API-avaimet muutettiin ja poistettiin käytöstä satunnaisesti
* Kaikki sandbox-testitilit poistettiin ilman erillistä ilmoitusta
* Virheilmoituksia yritettäessä tarkastella sandbox-tilin tietoja
* Ajoittaisia latausvirheitä

> Jostain syystä hiekkalaatikon salainen API-avaimeni muutettiin ja se poistettiin käytöstä. Myös kaikki vanhat hiekkalaatikon testitilini poistettiin.

> Joskus ne latautuvat ja joskus eivät. Tämä on järjettömän turhauttavaa.

**Tulos**: Ei vastausta, ei korjausta. Kehittäjät kohtaavat edelleen hiekkalaatikon luotettavuusongelmia.

### 2021: Raporttijärjestelmä täysin rikki {#2021-reports-system-completely-broken}

Toukokuussa 2021 raportoimme, että PayPalin tapahtumaraporttien latausjärjestelmä oli täysin rikki:

> Näyttää siltä, että latausten raportointi ei toimi juuri nyt eikä ole toiminut koko päivänä. Pitäisi myös luultavasti saada sähköposti-ilmoitus, jos se epäonnistuu.

Huomasimme myös istunnonhallinnan katastrofista:

> Myös jos olet ollut passiivinen kirjautuneena PayPaliin noin viiteen minuuttiin, sinut kirjataan ulos. Joten kun päivität painikkeen uudelleen sen raportin vieressä, jonka tilan haluat tarkistaa (odottettuasi ikuisuuden), on ikävää joutua kirjautumaan sisään uudelleen.

Mark Stuart myönsi istunnon aikakatkaisuongelman:

> Muistin, että aiemmin raportoit istuntosi usein vanhentuneen ja kehitystyötäsi häirinneen vaihtaessasi IDE:n ja developer.paypal.comin tai kauppiaan hallintapaneelin välillä. Sitten sinut kirjattiin ulos uudelleen.

**Tulos**: Istuntojen aikakatkaisut ovat edelleen 60 sekuntia. Raporttijärjestelmä epäonnistuu edelleen säännöllisesti.

### 2022: Ydin-API-ominaisuus puuttuu (taas) {#2022-core-api-feature-missing-again}

Tammikuussa 2022 otimme tilauslistausongelman uudelleen käsittelyyn, tällä kertaa kertoen entistä tarkemmin siitä, miten heidän dokumentaationsa oli virheellinen:

> Ei ole GET-funktiota, joka listaisi kaikki tilaukset (aiemmin laskutussopimukset)

Havaitsimme, että heidän viralliset dokumenttinsa olivat täysin epätarkkoja:

> API-dokumentaatio on myös täysin epätarkka. Ajattelimme, että voisimme tehdä kiertotien lataamalla kiinteästi koodatun luettelon tilaus-ID:istä. Mutta sekään ei toimi!

> Virallisista dokumenteista täällä... Niissä sanotaan, että voit tehdä tämän... Tässäpä se juju - missään ei ole "Tilauksen tunnus" -kenttää, josta voisi rastittaa pois.

Christina Monti PayPalilta vastasi:

> Pahoittelemme näiden virheellisten vaiheiden aiheuttamia harmia. Korjaamme asian tällä viikolla.

Sri Shivananda (teknologiajohtaja) kiitti meitä:

> Kiitos jatkuvasta avustasi meidän parantamisessa. Arvostamme sitä suuresti.

**Tulos**: Dokumentaatiota ei koskaan korjattu. Tilauslistauksen päätepistettä ei koskaan luotu.

## Kehittäjäkokemuksen painajainen {#the-developer-experience-nightmare}

PayPalin API-rajapintojen kanssa työskentely on kuin astuisi ajassa taaksepäin 10 vuotta. Tässä ovat dokumentoimamme tekniset ongelmat:

### Rikkinäinen käyttöliittymä {#broken-user-interface}

PayPalin kehittäjien kojelauta on katastrofi. Tässä on mitä painiskelemme päivittäin:

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPalin käyttöliittymä on niin rikki, ettei ilmoituksia voi edes ohittaa.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Selaimesi ei tue video-tagia.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Kehittäjän kojelauta pakottaa sinut kirjaimellisesti vetämään liukusäädintä ja kirjaamaan sinut ulos 60 sekunnin kuluttua.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Selaimesi ei tue video-tagia.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Lisää käyttöliittymäkatastrofeja PayPalin kehittäjäkäyttöliittymässä, jotka näyttävät rikkinäisiä työnkulkuja
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Selaimesi ei tue video-tunnistetta.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Tilausten hallintaliittymä - käyttöliittymä on niin huono, että jouduimme turvautumaan koodiin tuotteiden ja tilaussuunnitelmien luomiseen.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Näkymä rikkinäisestä tilauskäyttöliittymästä, josta puuttuu toimintoja (tuotteita/sopimuksia/tilauksia ei voi helposti luoda – eikä käyttöliittymässä näytä olevan mitään keinoa poistaa tuotteita tai sopimuksia niiden luomisen jälkeen)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Tyypillisiä PayPal-virheilmoituksia - kryptisiä ja hyödyttömiä
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-ongelmat {#sdk-problems}

* Ei pysty käsittelemään sekä kertaluonteisia maksuja että tilauksia ilman monimutkaisia kiertoteitä, joihin liittyy painikkeiden vaihtaminen ja uudelleenrenderöinti SDK:n uudelleenlatauksen aikana skriptitunnisteilla.
* JavaScript SDK rikkoo peruskäytäntöjä (luokkanimet pienellä kirjaimella, ei instanssitarkistusta).
* Virheilmoitukset eivät osoita, mitkä kentät puuttuvat.
* Epäjohdonmukaiset tietotyypit (vaativat merkkijonojen määriä numeroiden sijaan).

### Sisällön tietoturvakäytäntöjen rikkomukset {#content-security-policy-violations}

Heidän SDK:nsa vaatii CSP:ltäsi unsafe-inline- ja unsafe-eval-ominaisuuksia, **pakottaen sinut vaarantamaan sivustosi turvallisuuden**.

### Dokumentaatiokaaos {#documentation-chaos}

Mark Stuart itse myönsi:

> Olen samaa mieltä siitä, että vanhoja ja uusia API-rajapintoja on järjetön määrä. Todella vaikea löytää etsimään sopivaa (jopa meille täällä työskenteleville).

### Tietoturvahaavoittuvuudet {#security-vulnerabilities}

**PayPalin 2FA-toteutus on käänteinen**. Vaikka TOTP-sovellukset olisivat käytössä, ne pakottavat tekstiviestivahvistuksen – mikä tekee tileistä alttiita SIM-kortinvaihtohyökkäyksille. Jos TOTP on käytössä, sen tulisi käyttää sitä yksinomaan. Varamenetelmänä tulisi olla sähköposti, ei tekstiviesti.

### Istunnonhallinnan katastrofi {#session-management-disaster}

**Heidän kehittäjähallintapaneelinsa kirjaa sinut ulos 60 sekunnin käyttämättömyyden jälkeen**. Yritä tehdä jotain tuottavaa, ja joudut jatkuvasti käymään läpi: kirjautuminen → captcha → 2FA → uloskirjautuminen → toista. Käytätkö VPN:ää? Onnea matkaan.

## Heinäkuu 2025: Viimeinen pisara {#july-2025-the-final-straw}

Yhdentoista vuoden samojen ongelmien jälkeen käännekohta tuli rutiininomaisen tilinsiirron aikana. Meidän piti siirtyä uuteen PayPal-tiliin, joka vastaisi yrityksemme nimeä "Forward Email LLC", selkeämmän kirjanpidon takaamiseksi.

Yksinkertaiseksi muuttunutkin asia muuttui täydelliseksi katastrofiksi:

* Alustavat testit osoittivat, että kaikki toimi oikein
* Tunteja myöhemmin PayPal yhtäkkiä esti kaikki tilausmaksut ilman erillistä ilmoitusta
* Asiakkaat eivät voineet maksaa, mikä aiheutti hämmennystä ja tukitaakkaa
* PayPalin tuki antoi ristiriitaisia vastauksia väittäen, että tilit oli vahvistettu
* Meidät pakotettiin keskeyttämään PayPal-maksut kokonaan

<figure>
<figcaption><div class="alert alert-danger small text-center">
Virhe, jonka asiakkaat näkivät yrittäessään maksaa - ei selitystä, ei lokeja, ei mitään
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPalin tuki väitti kaiken olevan kunnossa, vaikka maksut olivat täysin rikki. Viimeisessä viestissä he sanovat "palauttaneensa joitakin ominaisuuksia", mutta pyytävät silti lisätietoja - klassinen PayPal-tukiteatteri
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Henkilöllisyyden varmennusprosessi, jonka väitettiin "korjaavan" mitään
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Epämääräinen viesti eikä vieläkään ratkaisua. Ei mitään tietoa, ilmoitusta tai mitään siitä, mitä lisätietoja tarvitaan. Asiakastuki on hiljaa.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Miksi emme voi vain poistaa PayPalia {#why-we-cant-just-drop-paypal}

Kaikista näistä ongelmista huolimatta emme voi kokonaan hylätä PayPalia, koska joillakin asiakkailla on maksuvaihtoehtona vain PayPal. Kuten eräs asiakas sanoi [tilasivu](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)-sivullamme:

> PayPal on ainoa maksuvaihtoehtoni

**Olemme jumissa tukemassa rikkinäistä alustaa, koska PayPal on luonut maksumonopolin tietyille käyttäjille.**

## Yhteisön kiertotapa {#the-community-workaround}

Koska PayPal ei tarjoa perustilauslistaustoimintoja, kehittäjäyhteisö on rakentanut kiertoteitä. Loimme skriptin, joka auttaa hallitsemaan PayPal-tilauksia: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Tämä skripti viittaa [yhteisön ydin](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4)-kohteeseen, jossa kehittäjät jakavat ratkaisuja. Käyttäjät ovat itse asiassa [kiittää meitä](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775)-kohteita, koska he tarjoavat sen, mitä PayPalin olisi pitänyt rakentaa vuosia sitten.

## PayPal-mallien estäminen tietojenkalastelun vuoksi {#blocking-paypal-templates-due-to-phishing}

Ongelmat ulottuvat API-rajapintojen ulkopuolelle. PayPalin sähköpostipohjat on suunniteltu niin huonosti, että meidän piti ottaa käyttöön erityinen suodatus sähköpostipalvelussamme, koska niitä ei voida erottaa tietojenkalasteluyrityksistä.

### Todellinen ongelma: PayPalin mallit näyttävät huijauksilta {#the-real-problem-paypals-templates-look-like-scams}

Saamme säännöllisesti ilmoituksia PayPal-sähköposteista, jotka näyttävät täsmälleen tietojenkalasteluyrityksiltä. Tässä on konkreettinen esimerkki väärinkäyttöraporteistamme:

**Aihe:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Tämä sähköposti lähetettiin edelleen osoitteeseen `abuse@microsoft.com`, koska se vaikutti olevan tietojenkalasteluyritys. Ongelma? Se oli itse asiassa PayPalin hiekkalaatikkoympäristöstä, mutta heidän mallipohjansa on niin huono, että se laukaisee tietojenkalasteluhyökkäykset.

### Toteutuksemme {#our-implementation}

Voit nähdä PayPal-kohtaisen suodatuksemme toteutuksen [sähköpostin suodatuskoodi](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172)-tiedostossamme:

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Miksi meidän piti estää PayPal {#why-we-had-to-block-paypal}

Toteutimme tämän, koska PayPal kieltäytyi korjaamasta laajoja roskaposti-/tietojenkalastelu-/petosongelmia huolimatta toistuvista raporteistamme heidän väärinkäyttötiimeilleen. Estämämme sähköpostityypit ovat muun muassa:

* **RT000238** - Epäilyttävistä laskuista ilmoituksia
* **PPC001017** - Ongelmallisia maksuvahvistuksia
* **RT000542** - Lahjaviestien hakkerointiyrityksiä

### Ongelman laajuus {#the-scale-of-the-problem}

Roskapostisuodatuslokimme osoittavat päivittäin käsittelemämme valtavan määrän PayPal-laskujen roskapostia. Esimerkkejä estetyistä aiheista ovat:

* "Lasku PayPalin laskutustiimiltä: - Tämä maksu veloitetaan automaattisesti tililtäsi. Ota meihin välittömästi yhteyttä numeroon \[PHONE]"
* "Lasku \[COMPANY NAME] (\[TILAUKSEN TUNNUS])"
* Useita muunnelmia eri puhelinnumeroilla ja väärennetyillä tilaustunnuksilla

Nämä sähköpostit tulevat usein `outlook.com`-isänniltä, mutta näyttävät olevan peräisin PayPalin laillisista järjestelmistä, mikä tekee niistä erityisen vaarallisia. Sähköpostit läpäisevät SPF-, DKIM- ja DMARC-todennuksen, koska ne lähetetään PayPalin varsinaisen infrastruktuurin kautta.

Teknisten lokiemme mukaan nämä roskapostit sisältävät laillisia PayPal-otsikoita:

* `X-Email-Type-Id: RT000238` (sama ID, jonka estämme)
* `From: "service@paypal.com" <service@paypal.com>`
* Kelvolliset DKIM-allekirjoitukset `paypal.com`:lta
* Oikeat SPF-tietueet, jotka näyttävät PayPalin sähköpostipalvelimet

Tämä luo mahdottoman tilanteen: sekä laillisilla PayPal-sähköposteilla että roskapostilla on identtiset tekniset ominaisuudet.

### Ironia {#the-irony}

PayPal, yritys, jonka pitäisi johtaa taistelua talouspetoksia vastaan, käyttää niin huonosti suunniteltuja sähköpostipohjia, että ne laukaisevat tietojenkalastelunestojärjestelmät. Meidän on pakko estää lailliset PayPal-sähköpostit, koska niitä on mahdotonta erottaa huijauksista.

Tämä on dokumentoitu tietoturvatutkimuksessa: [Varo PayPalin uuden osoitteen huijausta](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - joka osoittaa, miten PayPalin omia järjestelmiä hyödynnetään petoksiin.

### Vaikutus käytännössä: Uudet PayPal-huijaukset {#real-world-impact-novel-paypal-scams}

Ongelma ulottuu pelkän huonon laskupohjan suunnittelun ulkoasuun. PayPalin laskutusjärjestelmää on niin helppo hyödyntää, että huijarit käyttävät sitä säännöllisesti hyväkseen lähettääkseen laillisen näköisiä vilpillisiä laskuja. Tietoturvatutkija Gavin Anderegg dokumentoi [Uusi PayPal-huijaus](https://anderegg.ca/2023/02/01/a-novel-paypal-scam)-tapauksen, jossa huijarit lähettävät aitoja PayPal-laskuja, jotka läpäisevät kaikki todennustarkastukset:

> "Lähdettä tarkasteltaessa sähköposti näytti siltä, että se oli aidosti tullut PayPalilta (SPF, DKIM ja DMARC kaikki läpäisivät tarkastukset). Painike linkitti myös näennäisesti lailliselle PayPal-URL-osoitteelle... Kesti hetken tajuta, että kyseessä oli laillinen sähköposti. Olin juuri saanut satunnaisen "laskun" huijarilta."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Kuvakaappaus, jossa näkyy useita vilpillisiä PayPal-laskuja tulvimassa postilaatikkoon. Kaikki laskut näyttävät laillisilta, koska ne ovat peräisin PayPalin järjestelmistä.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Tutkija totesi:

> "Se vaikuttaa myös mukavuusominaisuudelta, jonka PayPalin pitäisi harkita sulkemista. Oletin heti, että kyseessä on jonkinlainen huijaus ja olin kiinnostunut vain teknisistä yksityiskohdista. Se vaikuttaa aivan liian helpolta toteuttaa, ja pelkään, että muut saattavat langeta sen ansaan."

Tämä havainnollistaa ongelmaa täydellisesti: PayPalin omat lailliset järjestelmät on suunniteltu niin huonosti, että ne mahdollistavat petokset ja samalla saavat laillisen viestinnän näyttämään epäilyttäviltä.

Mikä pahinta, tämä vaikutti toimitukseemme Yahoon kanssa, mikä johti asiakasvalituksiin ja tuntikausien huolelliseen testaukseen ja kaavojen tarkistamiseen.

## PayPalin taaksepäin suuntautuva KYC-prosessi {#paypals-backwards-kyc-process}

Yksi PayPalin alustan turhauttavimmista puolista on heidän käänteinen lähestymistapansa vaatimustenmukaisuuteen ja Tunne asiakkaasi (KYC) -menettelyihin. Toisin kuin kaikki muut maksunvälittäjät, PayPal antaa kehittäjille mahdollisuuden integroida API-rajapintansa ja aloittaa maksujen keräämisen tuotannossa ennen asianmukaisen vahvistuksen suorittamista.

### Miten sen pitäisi toimia {#how-it-should-work}

Jokainen laillinen maksunvälittäjä noudattaa tätä loogista järjestystä:

1. **Suorita ensin KYC-vahvistus**
2. **Hyväksy kauppiastili**
3. **Anna tuotanto-API-käyttöoikeus**
4. **Salli maksujen kerääminen**

Tämä suojaa sekä maksupalveluntarjoajaa että kauppiasta varmistamalla vaatimustenmukaisuuden ennen kuin rahat siirtyvät omistajaa.

### Miten PayPal oikeasti toimii {#how-paypal-actually-works}

PayPalin prosessi on täysin päinvastainen:

1. **Anna tuotantoympäristön API-käyttöoikeus välittömästi**
2. **Salli maksujen keräämisen tunneiksi tai päiviksi**
3. **Estä maksut äkillisesti ilman erillistä ilmoitusta**
4. **Vaadi KYC-dokumentaatiota sen jälkeen, kun asia on jo vaikuttanut asiakkaisiin**
5. **Älä ilmoita kauppiaalle**
6. **Anna asiakkaiden löytää ongelma ja ilmoittaa siitä**

### Vaikutus käytännössä {#the-real-world-impact}

Tämä käänteinen prosessi aiheuttaa katastrofeja yrityksille:

* **Asiakkaat eivät voi suorittaa ostoksia loppuun** huippumyyntien aikana
* **Ei ennakkovaroitusta** vahvistuksen tarpeesta
* **Ei sähköposti-ilmoituksia**, kun maksut on estetty
* **Kauppiaat saavat tietää ongelmista hämmentyneiltä asiakkailta**
* **Tuottojen menetys** kriittisinä liiketoiminta-aikoina
* **Asiakkaiden luottamus heikkenee**, kun maksut epäonnistuvat mystisesti

### Heinäkuun 2025 tilinsiirtokatastrofi {#the-july-2025-account-migration-disaster}

Juuri tämä skenaario toistui rutiininomaisen tilisiirron aikana heinäkuussa 2025. PayPal salli maksujen aluksi toimia, mutta yhtäkkiä esti ne ilman erillistä ilmoitusta. Huomasimme ongelman vasta, kun asiakkaat alkoivat ilmoittaa, etteivät he pystyneet maksamaan.

Kun otimme yhteyttä tukeen, saimme ristiriitaisia vastauksia tarvittavista asiakirjoista, eikä selkeää ratkaisuaikataulua ollut. Tämä pakotti meidät keskeyttämään PayPal-maksut kokonaan, mikä hämmensi asiakkaita, joilla ei ollut muita maksuvaihtoehtoja.

### Miksi tämä on tärkeää {#why-this-matters}

PayPalin lähestymistapa vaatimustenmukaisuuteen osoittaa perustavanlaatuisen väärinkäsityksen yritysten toiminnasta. Asianmukaisen asiakkaan tuntemisen tulisi tapahtua **ennen** tuotannon integrointia, ei sen jälkeen, kun asiakkaat ovat jo yrittäneet maksaa. Ennakoivan viestinnän puute ongelmien ilmetessä osoittaa PayPalin irtautumisen kauppiaiden tarpeista.

Tämä käänteinen prosessi on oire PayPalin laajemmista organisaatio-ongelmista: he priorisoivat sisäisiä prosessejaan kauppiaan ja asiakkaan kokemuksen edelle, mikä johtaa sellaisiin operatiivisiin katastrofeihin, jotka ajavat yrityksiä pois alustaltaan.

## Miten kaikki muut maksunvälittäjät tekevät sen oikein {#how-every-other-payment-processor-does-it-right}

Tilauslistaustoiminto, jota PayPal kieltäytyy toteuttamasta, on ollut alan standardi yli vuosikymmenen ajan. Näin muut maksupalveluntarjoajat käsittelevät tätä perusvaatimusta:

### Raita {#stripe}

Stripellä on ollut tilauslistaus API:n julkaisusta lähtien. Heidän dokumentaationsa osoittaa selvästi, miten kaikki asiakas- tai kauppiastilin tilaukset noudetaan. Tätä pidetään CRUD-perustoiminnallisuutena.

### Mela {#paddle}

Paddle tarjoaa kattavat tilausten hallinta-APIt, mukaan lukien listauksen, suodatuksen ja sivutuksen. He ymmärtävät, että kauppiaiden on nähtävä toistuvat tulovirtansa.

### Coinbase Commerce {#coinbase-commerce}

Jopa kryptovaluuttojen maksupalveluntarjoajat, kuten Coinbase Commerce, tarjoavat paremman tilausten hallinnan kuin PayPal.

### Neliö {#square}

Squaren API sisältää tilauslistauksen perusominaisuuden, ei jälkikäteen tehtynä.

### Alan standardi {#the-industry-standard}

Jokainen nykyaikainen maksupalveluntarjoaja tarjoaa:

* Listaa kaikki tilaukset
* Suodata tilan, päivämäärän tai asiakkaan mukaan
* Sivutus suurille tietojoukoille
* Webhook-ilmoitukset tilausmuutoksista
* Kattava dokumentaatio toimivilla esimerkeillä

### Mitä muut käsittelijät tarjoavat verrattuna PayPaliin {#what-other-processors-provide-vs-paypal}

**Stripe - Listaa kaikki tilaukset:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Suodata asiakkaan mukaan:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Suodata tilan mukaan:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal – Mitä oikeasti saat:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPalin käytettävissä olevat päätepisteet:**

* `POST /v1/billing/subscriptions` - Luo tilaus
* `GET /v1/billing/subscriptions/{id}` - Hanki YKSI tilaus (jos tiedät ID:n)
* `PATCH /v1/billing/subscriptions/{id}` - Päivitä tilaus
* `POST /v1/billing/subscriptions/{id}/cancel` - Peruuta tilaus
* `POST /v1/billing/subscriptions/{id}/suspend` - Keskeytä tilaus

**Mitä PayPalista puuttuu:**

* ❌ Ei `GET /v1/billing/subscriptions` (listaa kaikki)
* ❌ Ei hakutoimintoa
* ❌ Ei suodatusta tilan, asiakkaan tai päivämäärän mukaan
* ❌ Ei sivutustukea

PayPal on ainoa merkittävä maksupalveluntarjoaja, joka pakottaa kehittäjät seuraamaan tilaustunnuksia manuaalisesti omissa tietokannoissaan.

## PayPalin järjestelmällinen peittely: Kuuden miljoonan äänen vaientaminen {#paypals-systematic-cover-up-silencing-6-million-voices}

PayPalin kritiikin käsittelytapaa täydellisesti kiteyttävä toimenpide oli äskettäin koko yhteisöfooruminsa poistaminen verkosta, mikä vaiensi tehokkaasti yli kuusi miljoonaa jäsentä ja poisti satojatuhansia heidän epäonnistumisiaan dokumentoivia viestejä.

### Suuri pyyhkiytyminen {#the-great-erasure}

Alkuperäinen PayPal-yhteisö osoitteessa `paypal-community.com` isännöi **6 003 558 jäsentä** ja sisälsi satojatuhansia julkaisuja, virheraportteja, valituksia ja keskusteluja PayPalin API-virheistä. Tämä edusti yli vuosikymmenen dokumentoitua näyttöä PayPalin systemaattisista ongelmista.

PayPal poisti koko foorumin hiljaisesti käytöstä 30. kesäkuuta 2025. Kaikki `paypal-community.com`-linkit palauttavat nyt 404-virheet. Tämä ei ollut siirto tai päivitys.

### Kolmannen osapuolen pelastus {#the-third-party-rescue}

Onneksi kolmannen osapuolen palvelu osoitteessa [ppl.lithium.com](https://ppl.lithium.com/) on säilyttänyt osan sisällöstä, minkä ansiosta voimme käyttää keskusteluja, jotka PayPal yritti piilottaa. Tämä kolmannen osapuolen säilyttämä sisältö on kuitenkin epätäydellinen ja voi kadota milloin tahansa.

Tämä todisteiden piilottamisen malli ei ole uusi PayPalille. Heillä on dokumentoitu historia seuraavista asioista:

* Kriittisten virheraporttien poistaminen julkisista näkyvistä
* Kehittäjätyökalujen lopettaminen ilman erillistä ilmoitusta
* API-rajapintojen muuttaminen ilman asianmukaista dokumentaatiota
* Yhteisön keskustelujen hiljentäminen niiden virheistä

Foorumin sulkeminen on tähän mennessä röyhkein yritys piilottaa heidän systemaattiset epäonnistumisensa julkiselta tarkastelulta.

## 11 vuotta kestänyt tallennusvirheen katastrofi: 1 899 dollaria ja lisää tulee {#the-11-year-capture-bug-disaster-1899-and-counting}

Samalla kun PayPal järjesti kiireisesti palautekeskusteluja ja antoi lupauksia, heidän maksujärjestelmänsä on ollut perusteellisesti rikki yli 11 vuoden ajan. Todisteet tästä ovat musertavat.

### Sähköpostin edelleenlähetyksen 1 899 dollarin tappio {#forward-emails-1899-loss}

Tuotantojärjestelmistämme löysimme 108 PayPal-maksua, joiden yhteissumma oli **1 899 dollaria** ja jotka katosivat PayPalin tallennusvirheiden vuoksi. Nämä maksut osoittavat yhdenmukaista kaavaa:

* `CHECKOUT.ORDER.APPROVED` webhookit vastaanotettiin
* PayPalin kaappausrajapinta palautti 404 virhettä
* Tilaukset muuttuivat käyttökelvottomiksi PayPalin rajapinnan kautta

On mahdotonta selvittää, veloitettiinko asiakkailta maksuja, koska PayPal piilottaa virheenkorjauslokit kokonaan 14 päivän kuluttua ja poistaa kojelaudasta kaikki tiedot tilaustunnuksista, joita ei tallennettu.

Tämä edustaa vain yhtä yritystä. **Tuhansien kauppiaiden yhteenlasketut tappiot yli 11 vuoden aikana ovat todennäköisesti miljoonia dollareita.**

**Toistamme sen uudelleen: tuhansien kauppiaiden yhteenlasketut tappiot yli 11 vuoden aikana ovat todennäköisesti miljoonia dollareita.**

Ainoa syy miksi huomasimme tämän on se, että olemme uskomattoman huolellisia ja datalähtöisiä.

### Vuoden 2013 alkuperäinen raportti: Yli 11 vuotta huolimattomuutta {#the-2013-original-report-11-years-of-negligence}

Tämän ongelman varhaisin dokumentoitu raportti löytyy [Stack Overflow marraskuussa 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture):sta ([arkistoitu](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Saa jatkuvasti 404-virheen Rest API:lla kaappaustoimintoa suoritettaessa"

Vuonna 2013 raportoitu virhe on **identtinen** Forward Emailin vuonna 2024 kokeman virheen kanssa:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Yhteisön reaktio vuonna 2013 oli paljastava:

> "REST API:ssa on raportoitu tällä hetkellä ongelma. PayPal työskentelee sen parissa."

**Yli 11 vuotta myöhemmin he edelleen "työstävät sitä".**

### Vuoden 2016 tunnustus: PayPal rikkoo oman SDK:nsa {#the-2016-admission-paypal-breaks-their-own-sdk}

Vuonna 2016 PayPalin oma GitHub-arkisto dokumentoi [massiiviset kaappausvirheet](https://github.com/paypal/PayPal-PHP-SDK/issues/660)-muuttujan vaikuttavan heidän viralliseen PHP SDK:hon. Laajakuva oli hämmästyttävä:

> "20.9.2016 lähtien kaikki PayPalin kaappausyritykset ovat epäonnistuneet virheellä 'INVALID_RESOURCE_ID - Pyydettyä resurssitunnusta ei löytynyt'. API-integraatioon ei tehty muutoksia 19.9. ja 20.9. välillä. **100 % kaappausyrityksistä 20.9. jälkeen on palauttanut tämän virheen.**"

Eräs kauppias raportoi:

> "Minulla on ollut **yli 1 400 epäonnistunutta kaappausyritystä viimeisen 24 tunnin aikana**, ja kaikki ne ovat saaneet INVALID_RESOURCE_ID-virhevastauksen."

PayPalin alkuperäinen vastaus oli syyttää kauppiasta ja ohjata heidät tekniseen tukeen. Vasta valtavan painostuksen jälkeen he myönsivät virheen:

> "Tuotekehittäjiltämme on tullut päivitys. He ovat huomanneet lähetetyissä otsikoissa, että PayPal-Request-ID lähetetään 42 merkin pituisena, mutta **näyttää siltä, että äskettäin on tehty muutos, joka rajoittaa tunnuksen vain 38 merkkiin**."

Tämä tunnustus paljastaa PayPalin systemaattisen laiminlyönnin:

1. **He tekivät dokumentoimattomia, rikkovia muutoksia**
2. **He rikkoivat oman virallisen SDK:nsa**
3. **He syyttivät kauppiaita ensin**
4. **He myönsivät virheen vasta paineen alla**

Ongelman "korjaamisen" jälkeenkin kauppiaat raportoivat:

> "Päivitin SDK:n versioon 1.7.4 ja **ongelma esiintyy edelleen.**"

### Vuoden 2024 eskalaatio: Yhä rikki {#the-2024-escalation-still-broken}

Säilytetyn PayPal-yhteisön viimeaikaiset raportit osoittavat, että ongelma on itse asiassa pahentunut. [Syyskuun 2024 keskustelu](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkistoitu](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentoi täsmälleen samat ongelmat:

> "Ongelma alkoi ilmetä vasta noin 2 viikkoa sitten, eikä se vaikuta kaikkiin tilauksiin. **Paljon yleisempi ongelma näyttää olevan 404-virheet kaappauksen yhteydessä.**"

Kauppias kuvailee samaa kaavaa kuin sähköpostin edelleenlähetys:

> "Yritettyään tallentaa tilauksen PayPal palauttaa 404-virheen. Tilauksen tietoja haettaessa: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Tämä tapahtuu ilman mitään jälkeä onnistuneesta kaappauksesta meidän puolellamme.**"

### Webhookin luotettavuuskatastrofi {#the-webhook-reliability-disaster}

Toinen [säilytetty yhteisökeskustelu](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) paljastaa, että PayPalin webhook-järjestelmä on perustavanlaatuisesti epäluotettava:

> "Teoriassa sillä pitäisi olla kaksi tapahtumaa (CHECKOUT.ORDER.APPROVED ja PAYMENT.CAPTURE.COMPLETED) Webhook-tapahtumasta. Itse asiassa **näitä kahta tapahtumaa vastaanotetaan harvoin välittömästi, PAYMENT.CAPTURE.COMPLETED-tapahtumaa ei voida vastaanottaa useimmiten tai se vastaanotettaisiin muutaman tunnin kuluttua**"

Tilausmaksuja varten:

> "**'PAYMENT.SALE.COMPLETED' ei aina vastaanotettu tai se tapahtui vasta muutaman tunnin kuluttua.**"

Kauppiaan kysymykset paljastavat PayPalin luotettavuusongelmien syvyyden:

1. **"Miksi näin tapahtuu?"** - PayPalin webhook-järjestelmä on perustavanlaatuisesti rikki
2. **"Jos tilauksen tila on 'VALMIS', voinko olettaa vastaanottaneeni rahat?"** - Kauppiaat eivät voi luottaa PayPalin API-vastauksiin
3. **"Miksi 'Tapahtumalokit->Webhook-tapahtumat' ei löydä lokeja?"** - Edes PayPalin oma lokijärjestelmä ei toimi

### Systemaattisen laiminlyönnin kaava {#the-pattern-of-systematic-negligence}

Todisteet kattavat yli 11 vuotta ja osoittavat selkeän kaavan:

* **2013**: "PayPal työskentelee asian parissa"
* **2016**: PayPal myöntää rikkomuksen ja tarjoaa korjauksen
* **2024**: Samat virheet toistuvat edelleen, vaikuttaen sähköpostin edelleenlähetykseen ja lukemattomiin muihin

Tämä ei ole bugi – **tämä on systemaattista huolimattomuutta.** PayPal on tiennyt näistä kriittisistä maksujen käsittelyn virheistä yli vuosikymmenen ajan ja on johdonmukaisesti:

1. **Syytti kauppiaita PayPalin bugeista**
2. **Teki dokumentoimattomia, rikkovia muutoksia**
3. **Tarjosi riittämättömiä korjauksia, jotka eivät toimi**
4. **Jätti huomiotta yritysten taloudelliset vaikutukset**
5. **Piilotti todisteita poistamalla yhteisöfoorumeita**

### Dokumentoimaton vaatimus {#the-undocumented-requirement}

PayPalin virallisessa dokumentaatiossa ei mainita missään, että kauppiaiden on käytettävä uudelleenyrityslogiikkaa sieppausoperaatioille. Dokumentaatiossa todetaan, että kauppiaiden tulisi "sisäännyttää tiedot heti hyväksynnän jälkeen", mutta siinä ei mainita, että heidän API-sovellusliittymänsä palauttaa satunnaisesti 404-virheitä, jotka vaativat monimutkaisia uudelleenyritysmekanismeja.

Tämä pakottaa jokaisen kauppiaan:

* Toteuta eksponentiaalinen peruutusyrityslogiikka
* Käsittele epäjohdonmukaista webhook-toimitusta
* Rakenna monimutkaisia tilanhallintajärjestelmiä
* Valvo epäonnistuneita sieppauksia manuaalisesti

**Jokainen muu maksupalveluntarjoaja tarjoaa luotettavia kaappaus-API-rajapintoja, jotka toimivat ensimmäisellä kerralla.**

## PayPalin laajempi petosmalli {#paypals-broader-pattern-of-deception}

Tietojen kaappausvirheen aiheuttama katastrofi on vain yksi esimerkki PayPalin systemaattisesta lähestymistavasta asiakkaiden huijaamiseen ja heidän epäonnistumistensa peittämiseen.

### New Yorkin finanssipalveluviraston toimintasuunnitelma {#the-new-york-department-of-financial-services-action}

Tammikuussa 2025 New Yorkin finanssipalveluvirasto antoi [PayPalia vastaan kohdistuva täytäntöönpanotoimenpide](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)-varoituskirjeen harhaanjohtavista käytännöistä, mikä osoittaa, että PayPalin harhaanjohtava toimintamalli ulottuu paljon API-rajapintojen ulkopuolelle.

Tämä sääntelytoimenpide osoittaa PayPalin halukkuutta harjoittaa harhaanjohtavia käytäntöjä koko liiketoiminnassaan, ei vain kehitystyökaluissaan.

### Hunajaa koskeva oikeusjuttu: Kumppanuuslinkkien uudelleenkirjoittaminen {#the-honey-lawsuit-rewriting-affiliate-links}

PayPalin Honey-yrityskauppa on johtanut [oikeusjuttuja, joissa väitetään, että Honey kirjoittaa uudelleen affiliate-linkkejä](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer)-tapaukseen, jossa PayPal varastaa palkkioita sisällöntuottajilta ja vaikuttajilta. Tämä edustaa jälleen yhtä järjestelmällisen harhaanjohtamisen muotoa, jossa PayPal hyötyy ohjaamalla tuloja, joiden pitäisi mennä muille.

Kaava on selvä:

1. **API-viat**: Piilota rikkinäiset toiminnot, syytä kauppiaita
2. **Yhteisön vaientaminen**: Poista todisteet ongelmista
3. **Sääntelyrikkomukset**: Harjoittele harhaanjohtavasti
4. **Kumppanuusmarkkinoijien varkaudet**: Varasta palkkioita teknisen manipuloinnin avulla

### PayPalin laiminlyönnin hinta {#the-cost-of-paypals-negligence}

Forward Emailin 1 899 dollarin tappio on vain jäävuoren huippu. Harkitse laajempaa vaikutusta:

* **Yksittäiset kauppiaat**: Tuhannet menettävät satoja tai jopa tuhansia dollareita kukin
* **Yritysasiakkaat**: Mahdollisesti miljoonien dollarien menetykset tuloissa
* **Kehittäjän aika**: Lukemattomia tunteja PayPalin rikkinäisten API-rajapintojen kiertoteiden kehittämiseen
* **Asiakkaiden luottamus**: Yritykset menettävät asiakkaita PayPalin maksuhäiriöiden vuoksi

Jos yksi pieni sähköpostipalvelu menetti lähes 2 000 dollaria ja tämä ongelma on jatkunut yli 11 vuotta ja vaikuttanut tuhansiin kauppiaisiin, yhteenlaskettu taloudellinen vahinko on todennäköisesti **satoja miljoonia dollareita**.

### Dokumentaatiovalhe {#the-documentation-lie}

PayPalin virallisessa dokumentaatiossa ei johdonmukaisesti mainita kriittisiä rajoituksia ja bugeja, joita kauppiaat kohtaavat. Esimerkiksi:

* **Capture API**: Ei mainintaa siitä, että 404-virheet ovat yleisiä ja vaativat uudelleenyrityslogiikan
* **Webhookin luotettavuus**: Ei mainintaa siitä, että webhookit ovat usein tuntikausien viiveellä
* **Tilausten listaaminen**: Dokumentaatio viittaa siihen, että listaaminen on mahdollista, kun päätepistettä ei ole
* **Istunnon aikakatkaisut**: Ei mainintaa aggressiivisista 60 sekunnin aikakatkaisuista

Tämä kriittisten tietojen systemaattinen poisjättäminen pakottaa kauppiaat löytämään PayPalin rajoitukset kokeilemalla tuotantojärjestelmiä, mikä johtaa usein taloudellisiin tappioihin.

## Mitä tämä tarkoittaa kehittäjille {#what-this-means-for-developers}

PayPalin systemaattinen kyvyttömyys vastata kehittäjien perustarpeisiin samalla, kun se kerää laajaa palautetta, osoittaa perustavanlaatuisen organisaatio-ongelman. He pitävät palautteen keräämistä korvikkeena varsinaisten ongelmien korjaamiselle.

Kaava on selvä:

1. Kehittäjät raportoivat ongelmista
2. PayPal järjestää palautekeskusteluja johdon kanssa
3. Palautetta annetaan laajasti
4. Tiimit tunnustavat puutteet ja lupaavat "seurata ja korjata ne"
5. Mitään ei toteuteta
6. Johtajat lähtevät parempiin yrityksiin
7. Uudet tiimit pyytävät samaa palautetta
8. Sykli toistuu

Samaan aikaan kehittäjien on pakko löytää kiertoteitä, vaarantaa tietoturvaa ja käsitellä rikkinäisiä käyttöliittymiä vain hyväksyäkseen maksuja.

Jos olet rakentamassa maksujärjestelmää, opi kokemuksestamme: rakenna [trifecta-lähestymistapa](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) useilla prosessoreilla, mutta älä odota PayPalin tarjoavan tarvitsemiasi perustoimintoja. Suunnittele kiertoteiden rakentaminen alusta alkaen.

> Tämä viesti dokumentoi 11 vuoden kokemuksemme PayPalin API-rajapinnoista Forward Emaililla. Kaikki koodiesimerkit ja linkit ovat peräisin todellisista tuotantojärjestelmistämme. Jatkamme PayPal-maksujen tukemista näistä ongelmista huolimatta, koska joillakin asiakkailla ei ole muuta vaihtoehtoa.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />