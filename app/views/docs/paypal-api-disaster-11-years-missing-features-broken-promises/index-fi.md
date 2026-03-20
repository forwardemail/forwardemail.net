# PayPalin 11-vuotinen API-katastrofi: Kuinka rakensimme kiertoteitä heidän sivuuttaessaan kehittäjät {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Onnistui! PayPal on vihdoin lisännyt `GET /v1/billing/subscriptions` -päätepisteen.**
>
> Julkaisun jälkeen ja sen lähettämisen jälkeen PayPalin johtoryhmälle heidän tiiminsä toteuttivat kipeästi tarvittavan päätepisteen tilauslistaukselle. Muutos ilmestyi jossain vaiheessa [25. kesäkuuta 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) ja [9. heinäkuuta 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/) välillä.
>
> Kuitenkin tyypilliseen PayPal-tyyliin he eivät koskaan ilmoittaneet meille. Huomasimme päivityksen itse vasta joulukuussa 2025, kuukausia sen jälkeen kun ominaisuus julkaistiin hiljaisesti.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Forward Emaililla olemme kamppailleet PayPalin rikkinäisten API-rajapintojen kanssa yli vuosikymmenen ajan. Pienistä turhautumisista alkaneesta on kasvanut täydellinen katastrofi, joka pakotti meidät rakentamaan omia kiertoteitä, estämään heidän kalastelupohjaisia mallipohjia ja lopulta pysäyttämään kaikki PayPal-maksut kriittisen tilisiirron aikana.</p>
<p class="lead mt-3">Tämä on tarina 11 vuodesta, jolloin PayPal on sivuuttanut kehittäjien perustarpeet samalla kun me olemme tehneet kaikkemme saadaksemme heidän alustansa toimimaan.</p>


## Sisällysluettelo {#table-of-contents}

* [Puuttuva palanen: Ei tapaa listata tilauksia](#the-missing-piece-no-way-to-list-subscriptions)
* [2014–2017: Ongelma ilmenee](#2014-2017-the-problem-emerges)
* [2020: Annamme laajaa palautetta](#2020-we-give-them-extensive-feedback)
  * [27 kohdan palautelista](#the-27-item-feedback-list)
  * [Tiimit osallistuivat, lupauksia annettiin](#teams-got-involved-promises-were-made)
  * [Tulos? Ei mitään.](#the-result-nothing)
* [Johtajien lähtö: Kuinka PayPal menetti kaiken institutionaalisen muistin](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Uusi johto, samat ongelmat](#2025-new-leadership-same-problems)
  * [Uusi toimitusjohtaja osallistuu](#the-new-ceo-gets-involved)
  * [Michelle Gillin vastaus](#michelle-gills-response)
  * [Meidän vastauksemme: Ei enää kokouksia](#our-response-no-more-meetings)
  * [Marty Brodbeckin ylisuunnitteluvastaus](#marty-brodbecks-overengineering-response)
  * [”Yksinkertainen CRUD” -ristiriita](#the-simple-crud-contradiction)
  * [Katkos selkiytyy](#the-disconnect-becomes-clear)
* [Vuodet bugiraportteja, joita he sivuuttivat](#years-of-bug-reports-they-ignored)
  * [2016: Varhaiset käyttöliittymä- ja käyttökokemuspalauteet](#2016-early-uiux-complaints)
  * [2021: Business Email -bugiraportti](#2021-business-email-bug-report)
  * [2021: Käyttöliittymän parannusehdotukset](#2021-ui-improvement-suggestions)
  * [2021: Sandbox-ympäristön epäonnistumiset](#2021-sandbox-environment-failures)
  * [2021: Raportointijärjestelmä täysin rikki](#2021-reports-system-completely-broken)
  * [2022: Keskeinen API-ominaisuus puuttuu (taas)](#2022-core-api-feature-missing-again)
* [Kehittäjäkokemuksen painajainen](#the-developer-experience-nightmare)
  * [Rikkinäinen käyttöliittymä](#broken-user-interface)
  * [SDK-ongelmat](#sdk-problems)
  * [Sisällön turvallisuuspolitiikan rikkomukset](#content-security-policy-violations)
  * [Dokumentaation kaaos](#documentation-chaos)
  * [Turva-aukot](#security-vulnerabilities)
  * [Istunnonhallinnan katastrofi](#session-management-disaster)
* [Heinäkuu 2025: Viimeinen pisara](#july-2025-the-final-straw)
* [Miksi emme voi vain hylätä PayPalia](#why-we-cant-just-drop-paypal)
* [Yhteisön kiertotie](#the-community-workaround)
* [PayPalin mallipohjien estäminen kalastelun vuoksi](#blocking-paypal-templates-due-to-phishing)
  * [Todellinen ongelma: PayPalin mallipohjat näyttävät huijauksilta](#the-real-problem-paypals-templates-look-like-scams)
  * [Meidän toteutuksemme](#our-implementation)
  * [Miksi meidän piti estää PayPal](#why-we-had-to-block-paypal)
  * [Ongelman laajuus](#the-scale-of-the-problem)
  * [Ironia](#the-irony)
  * [Todellinen vaikutus: Uudet PayPal-huijaukset](#real-world-impact-novel-paypal-scams)
* [PayPalin taaksepäin suuntautuva KYC-prosessi](#paypals-backwards-kyc-process)
  * [Miten sen pitäisi toimia](#how-it-should-work)
  * [Miten PayPal oikeasti toimii](#how-paypal-actually-works)
  * [Todellinen vaikutus](#the-real-world-impact)
  * [Heinäkuun 2025 tilisiirtokatastrofi](#the-july-2025-account-migration-disaster)
  * [Miksi tämä on tärkeää](#why-this-matters)
* [Miten muut maksupalvelut tekevät sen oikein](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Alan standardi](#the-industry-standard)
  * [Mitä muut tarjoavat vs. PayPal](#what-other-processors-provide-vs-paypal)
* [PayPalin järjestelmällinen peittely: 6 miljoonan äänen vaientaminen](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Suuri pyyhkäisy](#the-great-erasure)
  * [Kolmannen osapuolen pelastus](#the-third-party-rescue)
* [11-vuotinen capture-bugin katastrofi: 1 899 dollaria ja kasvussa](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Emailin 1 899 dollarin tappio](#forward-emails-1899-loss)
  * [Vuoden 2013 alkuperäinen raportti: yli 11 vuotta huolimattomuutta](#the-2013-original-report-11-years-of-negligence)
  * [Vuoden 2016 myönnös: PayPal rikkoo oman SDK:nsa](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Vuoden 2024 eskalaatio: Vielä rikki](#the-2024-escalation-still-broken)
  * [Webhookin luotettavuuskatastrofi](#the-webhook-reliability-disaster)
  * [Järjestelmällisen huolimattomuuden kaava](#the-pattern-of-systematic-negligence)
  * [Dokumentoimaton vaatimus](#the-undocumented-requirement)
* [PayPalin laajempi petoskuvio](#paypals-broader-pattern-of-deception)
  * [New Yorkin finanssivalvonnan toimet](#the-new-york-department-of-financial-services-action)
  * [Honey-kanteen: kumppanilinkkien uudelleenkirjoitus](#the-honey-lawsuit-rewriting-affiliate-links)
  * [PayPalin huolimattomuuden kustannukset](#the-cost-of-paypals-negligence)
  * [Dokumentaation valhe](#the-documentation-lie)
* [Mitä tämä tarkoittaa kehittäjille](#what-this-means-for-developers)
## Puuttuva palanen: Ei tapaa listata tilauksia {#the-missing-piece-no-way-to-list-subscriptions}

Tässä on se juttu, joka saa meidät haukkomaan henkeämme: PayPalilla on ollut tilauslaskutus vuodesta 2014 lähtien, mutta he eivät ole koskaan tarjonneet kauppiaille tapaa listata omia tilauksiaan.

Ajattelepa hetki. Voit luoda tilauksia, voit peruuttaa ne, jos sinulla on ID, mutta et voi saada listaa kaikista aktiivisista tilauksista tililläsi. Se on kuin tietokanta ilman SELECT-lausetta.

Tarvitsemme tätä perusliiketoiminnan toimintoihin:

* Asiakastuki (kun joku lähettää sähköpostia kysyen tilauksestaan)
* Talousraportointi ja täsmäytys
* Automaattinen laskutuksen hallinta
* Säädösten noudattaminen ja auditointi

Mutta PayPal? He vain... eivät koskaan rakentaneet sitä.


## 2014-2017: Ongelma ilmenee {#2014-2017-the-problem-emerges}

Tilausten listausongelma ilmestyi ensimmäisen kerran PayPalin yhteisöfoorumeilla vuonna 2017. Kehittäjät kysyivät ilmiselvää kysymystä: "Miten saan listan kaikista tilauksistani?"

PayPalin vastaus? Hiljaisuus.

Yhteisön jäsenet alkoivat turhautua:

> "Todella outo puute, jos kauppias ei voi listata kaikkia aktiivisia sopimuksia. Jos sopimuksen ID katoaa, vain käyttäjä voi peruuttaa tai keskeyttää sopimuksen." - leafspider

> "+1. On kulunut melkein 3 vuotta." - laudukang (eli ongelma on ollut olemassa noin vuodesta 2014)

[Alkuperäinen yhteisöpostaus](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) vuodelta 2017 näyttää kehittäjien anovan tätä perustoiminnallisuutta. PayPal vastasi arkistoimalla repositorion, jossa ihmiset raportoivat ongelmasta.


## 2020: Annamme heille laajaa palautetta {#2020-we-give-them-extensive-feedback}

Lokakuussa 2020 PayPal otti meihin yhteyttä muodollista palautesessiota varten. Tämä ei ollut mikään rento keskustelu – he järjestivät 45 minuutin Microsoft Teams -puhelun, johon osallistui 8 PayPalin johtajaa, mukaan lukien Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze ja muita.

### 27 kohdan palautelista {#the-27-item-feedback-list}

Olimme valmistautuneet. Kuuden tunnin yrityksen jälkeen integroitua heidän API:ihinsa, olimme koonneet 27 erityistä ongelmaa. Mark Stuart PayPal Checkout -tiimistä sanoi:

> Hei Nick, kiitos että jaoit tämän kaikkien kanssa tänään! Uskon, että tämä toimii katalysaattorina saadaksemme lisää tukea ja investointeja tiimillemme korjata nämä asiat. On ollut vaikeaa saada näin kattavaa palautetta kuin mitä olet tähän mennessä jättänyt.

Palaute ei ollut teoreettista – se tuli todellisista integraatiopyrkimyksistä:

1. **Access tokenin generointi ei toimi**:

> Access tokenin generointi ei toimi. Lisäksi pitäisi olla enemmän kuin vain cURL-esimerkkejä.

2. **Ei web-käyttöliittymää tilauksen luomiseen**:

> Miten ihmeessä voi luoda tilauksia ilman, että tekee sen cURLilla? Näyttää siltä, ettei ole web-käyttöliittymää tähän (kuten Stripellä on)

Mark Stuart piti access token -ongelmaa erityisen huolestuttavana:

> Emme yleensä kuule ongelmista access tokenin generoinnissa.

### Tiimit osallistuivat, lupauksia annettiin {#teams-got-involved-promises-were-made}

Kun löysimme lisää ongelmia, PayPal lisäsi keskusteluun yhä useampia tiimejä. Darshan Raju Tilausten hallinnan käyttöliittymätiimistä liittyi mukaan ja sanoi:

> Tunnistamme aukon. Seuraamme ja käsittelemme tämän. Kiitos vielä palautteestasi!

Sessiota kuvattiin etsivänä:

> rehellistä läpikäyntiä kokemuksestasi

tehdäkseen:

> PayPalista sen, mitä sen pitäisi olla kehittäjille.

### Tuloksena? Ei mitään. {#the-result-nothing}

Muodollisesta palautesessiosta, laajasta 27 kohdan listasta, useiden tiimien osallistumisesta ja lupauksista:

> seurata ja käsitellä

ongelmia, ei mitään korjattu.


## Johtajien lähtö: Kuinka PayPal menetti kaiken institutionaalisen muistin {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Tässä tulee todella mielenkiintoista. Jokainen henkilö, joka sai palautteemme vuonna 2020, on lähtenyt PayPalilta:

**Johtajuuden muutokset:**

* [Dan Schulman (toimitusjohtaja 9 vuotta) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (syyskuu 2023)
* [Sri Shivananda (CTO, joka järjesti palautteen) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (tammikuu 2024)
**Tekniset johtajat, jotka antoivat lupauksia ja sitten lähtivät:**

* **Mark Stuart** (lupasi palautteen olevan "katalyytti") → [Nyt Ripplellä](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 vuoden PayPal-veteraani) → [MX:n toimitusjohtaja](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Eläkkeellä](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (yksi viimeisistä jäljellä olevista) → [Lähtenyt juuri Nasdaqille](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (tammikuu 2025)

PayPalista on tullut pyöröovi, jossa johtajat keräävät kehittäjäpalautetta, antavat lupauksia ja sitten siirtyvät parempiin yrityksiin kuten JPMorgan, Ripple ja muihin fintech-yrityksiin.

Tämä selittää, miksi vuoden 2025 GitHub-ongelman vastaus vaikutti täysin irti meidän vuoden 2020 palautteestamme – kirjaimellisesti kaikki, jotka saivat tuon palautteen, ovat lähteneet PayPalista.


## 2025: Uusi johto, samat ongelmat {#2025-new-leadership-same-problems}

Nopeasti vuoteen 2025, ja sama kaava toistuu. Vuosien edistymättömyyden jälkeen PayPalin uusi johto ottaa jälleen yhteyttä.

### Uusi toimitusjohtaja osallistuu {#the-new-ceo-gets-involved}

30. kesäkuuta 2025 otimme suoraan yhteyttä PayPalin uuteen toimitusjohtajaan Alex Chrissiin. Hänen vastauksensa oli lyhyt:

> Hei Nick – Kiitos yhteydenotosta ja palautteesta. Michelle (kopioitu) on tiiminsä kanssa valmiina sitoutumaan ja työskentelemään tämän asian parissa kanssasi. Kiitos -A

### Michelle Gillin vastaus {#michelle-gills-response}

Michelle Gill, EVP ja pienten yritysten ja rahoituspalveluiden johtaja, vastasi:

> Kiitos paljon Nick, siirrän Alexin piilokopioon. Olemme tutkineet tätä aiemmasta viestistäsi lähtien. Soitamme sinulle ennen viikon loppua. Voisitko lähettää minulle yhteystietosi, jotta joku kollegoistani voi ottaa sinuun yhteyttä. Michelle

### Meidän vastauksemme: Ei enää kokouksia {#our-response-no-more-meetings}

Kieltäydyimme uudesta kokouksesta ja selitimme turhautumisemme:

> Kiitos. En kuitenkaan usko, että puheluun osallistuminen auttaa mitään. Tässä syy... Olen ollut puhelussa aiemmin, eikä siitä tullut mitään. Käytin yli 2 tuntia aikaa puhuen koko tiimille ja johdolle, eikä mitään tapahtunut... Paljon sähköposteja edestakaisin. Ei mitään tehty. Palaute ei johtanut mihinkään. Yritin vuosia, minut kuunneltiin, ja sitten ei tapahtunut mitään.

### Marty Brodbeckin ylisuunnitteluvastaus {#marty-brodbecks-overengineering-response}

Sitten Marty Brodbeck, joka johtaa kuluttajatekniikkaa PayPalilla, otti yhteyttä:

> Hei Nick, tässä Marty Brodbeck. Johdan täällä PayPalilla kaikkea kuluttajatekniikkaa ja olen vetänyt yrityksen API-kehitystä. Voimmeko keskustella kohtaamastasi ongelmasta ja siitä, miten voimme auttaa.

Kun selitimme yksinkertaisen tarpeen tilauslistausrajapinnalle, hänen vastauksensa paljasti juuri ongelman:

> Kiitos Nick, olemme luomassa yhtä tilausten APIa täydellä SDK:lla (tukee täydellistä virheenkäsittelyä, tapahtumapohjaista tilausten seurantaa, vankkaa käyttöaikaa), jossa laskutus on myös erillinen API, johon kauppiaiden tulee mennä sen sijaan, että heidän pitäisi orkestroida useiden rajapintojen kautta saadakseen yhden vastauksen.

Tämä on juuri väärä lähestymistapa. Emme tarvitse kuukausien monimutkaista arkkitehtuuria. Tarvitsemme yhden yksinkertaisen REST-päätepisteen, joka listaa tilaukset – jotain, joka olisi pitänyt olla olemassa jo vuodesta 2014 lähtien.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "Yksinkertainen CRUD" -ristiriita {#the-simple-crud-contradiction}

Kun huomautimme, että tämä on perus-CRUD-toiminnallisuus, joka olisi pitänyt olla olemassa jo vuodesta 2014, Martyn vastaus oli merkittävä:

> Yksinkertaiset CRUD-toiminnot ovat osa ydintä API:ssa, ystäväni, joten niiden kehittäminen ei vie kuukausia

PayPalin TypeScript SDK, joka tukee tällä hetkellä vain kolmea päätepistettä kuukausien kehityksen jälkeen, sekä sen historiallinen aikajana osoittavat selvästi, että tällaiset projektit vaativat enemmän kuin muutaman kuukauden valmistuakseen.
Tämä vastaus osoittaa, ettei hän ymmärrä omaa APIaan. Jos "yksinkertaiset CRUD-toiminnot ovat osa ydintä APIa," niin missä on tilauslistauspäätepiste? Vastasimme:

> Jos 'yksinkertaiset CRUD-toiminnot ovat osa ydintä APIa', niin missä on tilauslistauspäätepiste? Kehittäjät ovat pyytäneet tätä 'yksinkertaista CRUD-toimintoa' vuodesta 2014 lähtien. Siitä on 11 vuotta. Kaikilla muilla maksupalveluntarjoajilla on ollut tämä perustoiminnallisuus alusta asti.

### Yhteyden katkeaminen käy selväksi {#the-disconnect-becomes-clear}

Vuoden 2025 keskustelut Alex Chrissin, Michelle Gillin ja Marty Brodbeckin kanssa osoittavat saman organisaation toimintahäiriön:

1. **Uudella johdolla ei ole tietoa aiemmista palautesessioista**
2. **He ehdottavat samoja ylisuunniteltuja ratkaisuja**
3. **He eivät ymmärrä oman APIensa rajoituksia**
4. **He haluavat lisää kokouksia sen sijaan, että korjaisivat ongelman**

Tämä kaava selittää, miksi PayPalin tiimit vuonna 2025 vaikuttavat täysin irti laajasta vuonna 2020 annetusta palautteesta – ne henkilöt, jotka saivat palautteen, ovat poissa, ja uusi johto toistaa samoja virheitä.


## Vuodet virheraportteja, joita he jättivät huomiotta {#years-of-bug-reports-they-ignored}

Emme valittaneet vain puuttuvista ominaisuuksista. Ilmoitimme aktiivisesti virheistä ja yritimme auttaa heitä parantamaan. Tässä on kattava aikajana dokumentoiduista ongelmista:

### 2016: Varhaiset UI/UX-valitukset {#2016-early-uiux-complaints}

Jo vuonna 2016 otimme julkisesti yhteyttä PayPalin johtoon, mukaan lukien Dan Schulman, käyttöliittymäongelmista ja käytettävyysongelmista. Tämä oli 9 vuotta sitten, ja samat UI/UX-ongelmat jatkuvat edelleen.

### 2021: Yritys-sähköpostin virheraportti {#2021-business-email-bug-report}

Maaliskuussa 2021 ilmoitimme, että PayPalin yrityssähköpostijärjestelmä lähetti virheellisiä peruutusilmoituksia. Sähköpostipohjan muuttujat renderöityivät väärin, mikä näytti asiakkaille hämmentäviä viestejä.

Mark Stuart tunnusti ongelman:

> Kiitos Nick! Siirrytään BCC:hen. @Prasy, onko tiimisi vastuussa tästä sähköpostista tai tiedätkö kuka on? "Niftylettuce, LLC, emme enää veloita sinua" saa minut uskomaan, että osoitteessa ja sähköpostin sisällössä on sekaannus.

**Tulos**: He korjasivat tämän! Mark Stuart vahvisti:

> Kuulin juuri ilmoitustiimiltä, että sähköpostipohja on korjattu ja otettu käyttöön. Arvostan, että otit yhteyttä ja ilmoitit siitä. Kiitos!

Tämä osoittaa, että he OSAVAT korjata asioita, kun haluavat – he vain päättävät olla korjaamatta useimpia ongelmia.

### 2021: UI-parannusehdotukset {#2021-ui-improvement-suggestions}

Helmikuussa 2021 annoimme yksityiskohtaista palautetta heidän hallintapaneelinsa käyttöliittymästä, erityisesti "PayPal Recent Activity" -osiosta:

> Mielestäni paypal.comin hallintapaneelia, erityisesti "PayPal Recent Activity" -osiota, pitäisi parantaa. En usko, että pitäisi näyttää $0 toistuvien maksujen "Luotu" -tilarivejä – ne vain lisäävät valtavasti ylimääräisiä rivejä, eikä yhdellä silmäyksellä näe helposti, kuinka paljon tuloja kertyy päivältä/viimeisiltä päiviltä.

Mark Stuart välitti sen kuluttajatuotetiimille:

> Kiitos! En ole varma, mikä tiimi vastaa Activity-osasta, mutta välitin sen kuluttajatuotetiimin johtajalle löytääkseni oikean tiimin. $0.00 toistuva maksu vaikuttaa virheeltä. Se pitäisi varmaan suodattaa pois.

**Tulos**: Ei koskaan korjattu. Käyttöliittymä näyttää edelleen nämä turhat $0 merkinnät.

### 2021: Sandbox-ympäristön toimintahäiriöt {#2021-sandbox-environment-failures}

Marraskuussa 2021 ilmoitimme kriittisistä ongelmista PayPalin sandbox-ympäristössä:

* Sandboxin salaiset API-avaimet vaihdettiin ja poistettiin käytöstä satunnaisesti
* Kaikki sandbox-testitilit poistettiin ilman ilmoitusta
* Virheilmoituksia yritettäessä tarkastella sandbox-tilin tietoja
* Satunnaisia latausvirheitä

> Jostain syystä sandboxin salainen API-avaimeni vaihdettiin ja se poistettiin käytöstä. Myös kaikki vanhat sandbox-testitilini poistettiin.

> Joskus ne latautuvat ja joskus eivät. Tämä on äärimmäisen turhauttavaa.

**Tulos**: Ei vastausta, ei korjausta. Kehittäjät kohtaavat edelleen sandboxin luotettavuusongelmia.

### 2021: Raportointijärjestelmä täysin rikki {#2021-reports-system-completely-broken}
Toukokuussa 2021 raportoimme, että PayPalin latausjärjestelmä tapahtumaraporteille oli täysin rikki:

> Vaikuttaa siltä, että raporttien lataukset eivät toimi tällä hetkellä eivätkä ole toimineet koko päivän. Lisäksi pitäisi varmaan saada sähköposti-ilmoitus, jos lataus epäonnistuu.

Me myös korostimme istunnonhallinnan katastrofia:

> Lisäksi jos olet passiivinen PayPaliin kirjautuneena noin 5 minuuttia, sinut kirjataan ulos. Joten kun päivität napin uudelleen sen raportin vieressä, jonka tilaa haluat tarkistaa (sen jälkeen kun olet odottanut ikuisuuden), on todella ärsyttävää joutua kirjautumaan takaisin sisään.

Mark Stuart myönsi istunnon aikakatkaisun ongelman:

> Muistan, että olit aiemmin raportoinut istuntosi usein vanhentuvan ja häiritsevän kehitystyötäsi, kun vaihdat IDE:si ja developer.paypal.comin tai kauppiaan hallintapaneelin välillä, ja sitten palaat takaisin ja olet taas uloskirjautunut.

**Tulos**: Istunnon aikakatkaisu on edelleen 60 sekuntia. Raportointijärjestelmä epäonnistuu edelleen säännöllisesti.

### 2022: Keskeinen API-ominaisuus puuttuu (taas) {#2022-core-api-feature-missing-again}

Tammikuussa 2022 eskaloimme tilauslistausongelman uudelleen, tällä kertaa vielä yksityiskohtaisemmin siitä, miten heidän dokumentaationsa oli väärässä:

> Ei ole GET-pyyntöä, joka listaisi kaikki tilaukset (aiemmin kutsuttu laskutussopimuksiksi)

Huomasimme, että heidän virallinen dokumentaationsa oli täysin epätarkkaa:

> API-dokumentit ovat myös täysin epätarkkoja. Luulimme voivamme kiertää ongelman lataamalla kovakoodatun listan tilaus-ID:istä. Mutta se ei toimi edes!

> Virallisista dokumenteista täällä... Siinä sanotaan, että voit tehdä tämän... Tässä on juju – "Subscription ID" -kenttää ei ole lainkaan missään löydettävissä tarkistettavaksi.

Christina Monti PayPalilta vastasi:

> Pahoittelemme näistä vääristä ohjeista aiheutuneita turhautumisia, korjaamme asian tällä viikolla.

Sri Shivananda (CTO) kiitti meitä:

> Kiitos jatkuvasta avustasi, joka auttaa meitä parantumaan. Arvostamme sitä suuresti.

**Tulos**: Dokumentaatiota ei koskaan korjattu. Tilauslistauspäätepistettä ei koskaan luotu.


## Kehittäjäkokemuksen painajainen {#the-developer-experience-nightmare}

Työskentely PayPalin API:en kanssa on kuin astuisi ajassa taaksepäin 10 vuotta. Tässä ovat dokumentoidut tekniset ongelmat:

### Rikkinäinen käyttöliittymä {#broken-user-interface}

PayPalin kehittäjähallintapaneeli on katastrofi. Tässä mitä kohtaamme päivittäin:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPalin käyttöliittymä on niin rikki, ettet voi edes sulkea ilmoituksia
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Selaimesi ei tue video-tägää.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Kehittäjähallintapaneeli pakottaa sinut vetämään liukusäädintä ja kirjautuu ulos 60 sekunnin jälkeen
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Selaimesi ei tue video-tägää.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Lisää käyttöliittymäkatastrofeja PayPalin kehittäjäkäyttöliittymässä, jotka näyttävät rikkinäisiä työnkulkuja
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Selaimesi ei tue video-tägää.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tilausten hallintaliittymä – käyttöliittymä on niin huono, että jouduimme turvautumaan koodiin tuotteiden ja tilaussuunnitelmien luomiseksi
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal-tilausten kuvakaappaus" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Näkymä rikkinäisestä tilausliittymästä, jossa toiminnallisuutta puuttuu (et voi helposti luoda tuotteita/suunnitelmia/tilauksia – eikä käyttöliittymässä näytä olevan lainkaan tapaa poistaa tuotteita tai suunnitelmia, kun ne on luotu)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal-tilausten kuvakaappaus 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tyypilliset PayPal-virheilmoitukset - kryptisiä ja hyödyttömiä
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-ongelmat {#sdk-problems}

* Ei pysty käsittelemään sekä kertamaksuja että tilauksia ilman monimutkaisia kiertoteitä, jotka sisältävät nappien vaihtamista ja uudelleenrenderöintiä samalla kun SDK ladataan uudelleen skriptitunnisteilla
* JavaScript SDK rikkoo peruskonventioita (pienet luokkien nimet, ei instanssitarkistuksia)
* Virheilmoitukset eivät kerro, mitkä kentät puuttuvat
* Epäjohdonmukaiset tietotyypit (vaativat summat merkkijonoina numeroiden sijaan)

### Sisällön turvallisuuspolitiikan rikkomukset {#content-security-policy-violations}

Heidän SDK vaatii unsafe-inline ja unsafe-eval asetukset CSP:ssäsi, **pakottaen sinut vaarantamaan sivustosi turvallisuuden**.

### Dokumentaation kaaos {#documentation-chaos}

Mark Stuart itse myönsi:

> Sovittu, että on absurdi määrä vanhoja ja uusia API:ita. Todella vaikea löytää mitä etsiä (jopa meille, jotka työskentelemme täällä).

### Turvallisuusaukot {#security-vulnerabilities}

**PayPalin 2FA-toteutus on takaperoista**. Vaikka TOTP-sovellukset olisivat käytössä, he pakottavat SMS-varmennuksen - tehden tileistä alttiita SIM-kortin vaihto -hyökkäyksille. Jos sinulla on TOTP käytössä, sen pitäisi olla ainoa käytössä oleva menetelmä. Varamenetelmänä pitäisi olla sähköposti, ei SMS.

### Istunnonhallinnan katastrofi {#session-management-disaster}

**Heidän kehittäjäportaalinsa kirjautuu ulos 60 sekunnin käyttämättömyyden jälkeen**. Yritä tehdä jotain tuottavaa ja joudut jatkuvasti käymään läpi: kirjautuminen → captcha → 2FA → uloskirjautuminen → toista. Käytätkö VPN:ää? Onnea matkaan.


## Heinäkuu 2025: Viimeinen pisara {#july-2025-the-final-straw}

11 vuoden saman ongelman jälkeen katkaisukohta tuli rutiininomaisen tilisiirron aikana. Meidän piti siirtyä uuteen PayPal-tiliin, joka vastaisi yrityksemme nimeä "Forward Email LLC" siistimmän kirjanpidon vuoksi.

Mikä olisi pitänyt olla yksinkertaista, muuttui täydelliseksi katastrofiksi:

* Alkuperäiset testit osoittivat kaiken toimivan oikein
* Tunteja myöhemmin PayPal yhtäkkiä esti kaikki tilausmaksut ilman varoitusta
* Asiakkaat eivät voineet maksaa, aiheuttaen sekaannusta ja tukikuormaa
* PayPalin tuki antoi ristiriitaisia vastauksia väittäen, että tilit oli vahvistettu
* Meidät pakotettiin pysäyttämään PayPal-maksut kokonaan

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Virhe, jonka asiakkaat näkivät yrittäessään maksaa - ei selitystä, ei lokitietoja, ei mitään
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPalin tuki väittää kaiken olevan kunnossa, vaikka maksut olivat täysin rikki. Viimeinen viesti näyttää heidän sanovan "palauttaneensa joitain ominaisuuksia", mutta silti pyytävän lisää määrittelemätöntä tietoa - klassista PayPalin tukiteatteria
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
  Henkilöllisyyden vahvistusprosessi, joka väitetysti "ei korjannut" mitään
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
  Epämääräinen viesti eikä vieläkään ratkaisua. Ei lainkaan tietoa, ilmoituksia tai mitään siitä, mitä lisätietoja tarvitaan. Asiakastuki vaikenee.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Miksi Emme Voi Vain Luopua PayPalista {#why-we-cant-just-drop-paypal}

Kaikista näistä ongelmista huolimatta emme voi täysin hylätä PayPalia, koska joillakin asiakkailla on maksuvaihtoehtona vain PayPal. Kuten yksi asiakas sanoi meidän [tilasivullamme](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal on ainoa maksuvaihtoehtoni

**Olemme jumissa tukemassa rikkinäistä alustaa, koska PayPal on luonut maksumonopolin tietyille käyttäjille.**


## Yhteisön Kiertotie {#the-community-workaround}

Koska PayPal ei tarjoa perustoiminnallisuutta tilauslistauksen hallintaan, kehittäjäyhteisö on rakentanut kiertoteitä. Me loimme skriptin, joka auttaa hallitsemaan PayPal-tilauksia: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Tämä skripti viittaa [yhteisön gistiin](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), jossa kehittäjät jakavat ratkaisuja. Käyttäjät itse asiassa [kiittävät meitä](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) siitä, että tarjoamme sen, mitä PayPal olisi pitänyt rakentaa jo vuosia sitten.


## PayPalin Mallien Estäminen Phishingin Takia {#blocking-paypal-templates-due-to-phishing}

Ongelmia on enemmän kuin API-rajapinnat. PayPalin sähköpostimallit ovat niin huonosti suunniteltuja, että jouduimme toteuttamaan erityisen suodatuksen sähköpostipalvelussamme, koska ne ovat erotettavissa vain vaikeasti phishing-yrityksistä.

### Todellinen Ongelma: PayPalin Mallit Näyttävät Huijauksilta {#the-real-problem-paypals-templates-look-like-scams}

Saamme säännöllisesti raportteja PayPalin sähköposteista, jotka näyttävät täsmälleen phishing-yrityksiltä. Tässä on todellinen esimerkki väärinkäytösraporteistamme:

**Aihe:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Tämä sähköposti välitettiin osoitteeseen `abuse@microsoft.com`, koska se vaikutti phishing-yritykseltä. Ongelma? Se oli itse asiassa PayPalin sandbox-ympäristöstä, mutta heidän mallisuunnittelunsa on niin huono, että se laukaisee phishing-tunnistusjärjestelmät.

### Meidän Toteutuksemme {#our-implementation}

Voit nähdä PayPal-spesifisen suodatuksemme toteutettuna meidän [sähköpostisuodatuskoodissamme](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// tarkista paypal-huijaus (erittäin tiukka, kunnes PayPal korjaa phishingin omalla puolellaan)
// (näyttää tulevan vain "outlook.com" ja "paypal.com" isänniltä)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = lahjaviestin hakkerointi
// RT002947 = paypal-laskuspämmi
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
    'Jatkuvan PayPal-laskuspämmin vuoksi sinun on lähetettävä laskulinkki manuaalisesti'
  );
  err.isCodeBug = true; // hälytä ylläpitäjät tarkastusta varten
  throw err;
}
```

### Miksi Jouduimme Estämään PayPalin {#why-we-had-to-block-paypal}

Toteutimme tämän, koska PayPal kieltäytyi korjaamasta valtavia roskaposti/phishing/petoksia koskevia ongelmia, huolimatta toistuvista raporteistamme heidän väärinkäytöstiimeilleen. Estämämme erityiset sähköpostityypit sisältävät:

* **RT000238** - Epäilyttävät laskuilmoitukset
* **PPC001017** - Ongelmalliset maksuvahvistukset
* **RT000542** - Lahjaviestin hakkerointiyritykset

### Ongelman Laajuus {#the-scale-of-the-problem}

Roskapostisuodatuslokimme näyttävät valtavan määrän PayPal-laskuspämmiä, jota käsittelemme päivittäin. Estettyjen aiheiden esimerkkejä ovat:

* "Lasku PayPal Billing Teamiltä:- Tämä veloitus peritään automaattisesti tililtäsi. Ota meihin välittömästi yhteyttä numeroon \[PHONE]"
* "Lasku yritykseltä \[COMPANY NAME] (\[ORDER-ID])"
* Useita variaatioita eri puhelinnumeroilla ja väärennetyillä tilausnumeroilla
Nämä sähköpostit tulevat usein `outlook.com`-palvelimilta, mutta näyttävät tulevan PayPalin laillisista järjestelmistä, mikä tekee niistä erityisen vaarallisia. Sähköpostit läpäisevät SPF-, DKIM- ja DMARC-todennuksen, koska ne lähetetään PayPalin todellisen infrastruktuurin kautta.

Tekniset lokimme osoittavat, että näissä roskapostiviesteissä on aitoja PayPal-otsikoita:

* `X-Email-Type-Id: RT000238` (sama tunnus, jonka estämme)
* `From: "service@paypal.com" <service@paypal.com>`
* Voimassa olevat DKIM-allekirjoitukset `paypal.com`-osoitteesta
* Oikeat SPF-tietueet, jotka osoittavat PayPalin postipalvelimet

Tämä luo mahdottoman tilanteen: aidot PayPal-sähköpostit ja roskaposti ovat teknisesti identtisiä.

### Ironia {#the-irony}

PayPal, yritys, jonka pitäisi johtaa taistelua talouspetoksia vastaan, käyttää sähköpostimalleja, jotka on suunniteltu niin huonosti, että ne laukaisevat kalastelunestojärjestelmät. Meidän on pakko estää aidot PayPal-sähköpostit, koska niitä ei voi erottaa huijauksista.

Tämä on dokumentoitu tietoturvatutkimuksissa: [Varo PayPalin uutta osoitehuijausta](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – joka näyttää, miten PayPalin omia järjestelmiä hyödynnetään petoksiin.

### Todellinen vaikutus: Uudet PayPal-huijaukset {#real-world-impact-novel-paypal-scams}

Ongelma ulottuu huonon mallin suunnittelua pidemmälle. PayPalin laskutusjärjestelmää on niin helppo hyväksikäyttää, että huijarit käyttävät sitä säännöllisesti lähettääkseen aidon näköisiä petollisia laskuja. Tietoturvatutkija Gavin Anderegg dokumentoi [Uuden PayPal-huijauksen](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), jossa huijarit lähettävät oikeita PayPal-laskuja, jotka läpäisevät kaikki todennusvarmistukset:

> "Lähdettä tarkastellessa sähköposti näytti todellakin tulevan PayPalilta (SPF, DKIM ja DMARC kaikki läpäisty). Painike linkitti myös näennäisesti aitoon PayPal-URL-osoitteeseen... Kesti hetken tajuta, että kyseessä oli aito sähköposti. Minulle oli juuri lähetetty satunnainen 'lasku' huijarilta."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Kuvakaappaus, joka näyttää useita petollisia PayPal-laskuja tulvimassa postilaatikkoon, kaikki näyttävät aidoilta, koska ne todella tulevat PayPalin järjestelmistä
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal-huijausvaroituksen kuvakaappaus" class="rounded-lg" />
</figure>

Tutkija totesi:

> "Tämä vaikuttaa myös kätevyyteen liittyvältä ominaisuudelta, jonka PayPalin pitäisi harkita lukitsevansa. Oletin heti, että kyseessä oli jonkinlainen huijaus ja olin kiinnostunut vain teknisistä yksityiskohdista. Se vaikuttaa liian helpolta toteuttaa, ja pelkään, että muut saattavat langeta siihen."

Tämä havainnollistaa ongelman täydellisesti: PayPalin omat aidot järjestelmät on suunniteltu niin huonosti, että ne mahdollistavat petokset samalla kun tekevät aidoista viesteistä epäilyttäviä.

Pahentaakseen tilannetta tämä vaikutti toimitettavuuteemme Yahoo-palvelussa, mikä johti asiakasvalituksiin ja tunteihin kestäneeseen huolelliseen testaukseen ja kaavojen tarkistukseen.


## PayPalin taaksepäin toimiva KYC-prosessi {#paypals-backwards-kyc-process}

Yksi turhauttavimmista asioista PayPalin alustalla on heidän taaksepäin toimiva lähestymistapansa vaatimustenmukaisuuteen ja Know Your Customer (KYC) -menettelyihin. Toisin kuin muut maksunvälittäjät, PayPal sallii kehittäjien integroida API:t ja aloittaa maksujen keräämisen tuotannossa ennen asianmukaisen varmennuksen suorittamista.

### Miten sen pitäisi toimia {#how-it-should-work}

Jokainen laillinen maksunvälittäjä noudattaa tätä loogista järjestystä:

1. **Suorita KYC-varmennus ensin**
2. **Hyväksy kauppiastili**
3. **Tarjoa tuotannon API-käyttöoikeus**
4. **Salli maksujen kerääminen**

Tämä suojaa sekä maksunvälittäjää että kauppiasta varmistamalla vaatimustenmukaisuuden ennen kuin rahaa vaihtaa omistajaa.

### Miten PayPal todellisuudessa toimii {#how-paypal-actually-works}

PayPalin prosessi on täysin päinvastainen:

1. **Tarjoa tuotannon API-käyttöoikeus välittömästi**
2. **Salli maksujen kerääminen tunteja tai päiviä**
3. **Estä maksut äkillisesti ilman ennakkoilmoitusta**
4. **Vaadi KYC-asiakirjoja vasta kun asiakkaat ovat jo kärsineet**
5. **Älä ilmoita kauppiaalle ongelmasta**
6. **Anna asiakkaiden löytää ongelma ja raportoida siitä**
### Todelliset vaikutukset käytännössä {#the-real-world-impact}

Tämä taaksepäin suuntautuva prosessi aiheuttaa katastrofeja yrityksille:

* **Asiakkaat eivät voi suorittaa ostoksia loppuun** myynnin huippusesonkien aikana
* **Ei ennakkoilmoitusta** siitä, että vahvistus tarvitaan
* **Ei sähköpostihälytyksiä** kun maksut estetään
* **Myyjät saavat tietää ongelmista hämmentyneiltä asiakkailta**
* **Tulonmenetyksiä** kriittisinä liiketoiminta-aikoina
* **Asiakassuhteen luottamuksen heikkeneminen** kun maksut epäonnistuvat salaperäisesti

### Heinäkuun 2025 tilisiirto-katastrofi {#the-july-2025-account-migration-disaster}

Tämä tarkka skenaario toteutui rutiininomaisen tilisiirron yhteydessä heinäkuussa 2025. PayPal salli maksujen toimia aluksi, mutta esti ne äkillisesti ilman mitään ilmoitusta. Huomasimme ongelman vasta, kun asiakkaat alkoivat raportoida, etteivät pysty maksamaan.

Kun otimme yhteyttä tukeen, saimme ristiriitaisia vastauksia siitä, mitä dokumentaatiota tarvitaan, eikä selvää aikataulua ratkaisulle ollut. Tämä pakotti meidät keskeyttämään PayPal-maksut kokonaan, mikä sekoitti asiakkaita, joilla ei ollut muita maksuvaihtoehtoja.

### Miksi tämä on tärkeää {#why-this-matters}

PayPalin lähestymistapa vaatimustenmukaisuuteen osoittaa perustavanlaatuisen väärinymmärryksen siitä, miten yritykset toimivat. Asianmukainen KYC tulisi tehdä **ennen** tuotantointegraatiota, ei sen jälkeen kun asiakkaat jo yrittävät maksaa. Proaktiivisen viestinnän puute ongelmien ilmetessä osoittaa PayPalin irtaantumisen myyjien tarpeista.

Tämä taaksepäin suuntautuva prosessi on oire PayPalin laajemmista organisatorisista ongelmista: he priorisoivat sisäisiä prosessejaan myyjien ja asiakkaiden kokemuksen sijaan, mikä johtaa sellaisiin operatiivisiin katastrofeihin, jotka ajavat yritykset pois heidän alustaltaan.


## Miten muut maksunvälittäjät tekevät sen oikein {#how-every-other-payment-processor-does-it-right}

Tilauksen listausominaisuus, jota PayPal kieltäytyy toteuttamasta, on ollut alan standardi yli vuosikymmenen ajan. Näin muut maksunvälittäjät hoitavat tämän perusvaatimuksen:

### Stripe {#stripe}

Striipillä on ollut tilauslistaus siitä lähtien, kun heidän API julkaistiin. Heidän dokumentaationsa näyttää selkeästi, miten kaikki tilaukset haetaan asiakkaalle tai myyjätilille. Tätä pidetään perus CRUD-toiminnallisuutena.

### Paddle {#paddle}

Paddle tarjoaa kattavat tilauksenhallinnan API:t, mukaan lukien listaus, suodatus ja sivutus. He ymmärtävät, että myyjien on nähtävä toistuvat tulovirrat.

### Coinbase Commerce {#coinbase-commerce}

Jopa kryptovaluuttamaksujen välittäjät kuten Coinbase Commerce tarjoavat parempaa tilauksenhallintaa kuin PayPal.

### Square {#square}

Squaren API sisältää tilauslistauksen perustavanlaatuisena ominaisuutena, ei jälkikäteen lisättynä.

### Alan standardi {#the-industry-standard}

Jokainen nykyaikainen maksunvälittäjä tarjoaa:

* Listaa kaikki tilaukset
* Suodata tilan, päivämäärän, asiakkaan mukaan
* Sivutus suurille tietomäärille
* Webhook-ilmoitukset tilauksen muutoksista
* Kattava dokumentaatio toimivilla esimerkeillä

### Mitä muut välittäjät tarjoavat vs PayPal {#what-other-processors-provide-vs-paypal}

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

**PayPal - Mitä saat todellisuudessa:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Voit saada VAIN YHDEN tilauksen, jos tiedät ID:n
# Ei ole mitään päätepistettä kaikkien tilausten listaamiseen
# Ei ole mitään tapaa hakea tai suodattaa
# Sinun täytyy seurata kaikkia tilaus-ID:itä itse
```

**PayPalin saatavilla olevat päätepisteet:**

* `POST /v1/billing/subscriptions` - Luo tilaus
* `GET /v1/billing/subscriptions/{id}` - Hae YKSI tilaus (jos tiedät ID:n)
* `PATCH /v1/billing/subscriptions/{id}` - Päivitä tilaus
* `POST /v1/billing/subscriptions/{id}/cancel` - Peruuta tilaus
* `POST /v1/billing/subscriptions/{id}/suspend` - Keskeytä tilaus
**Mitä PayPalilta puuttuu:**

* ❌ Ei `GET /v1/billing/subscriptions` (listaa kaikki)
* ❌ Ei hakutoimintoa
* ❌ Ei suodatusta tilan, asiakkaan, päivämäärän mukaan
* ❌ Ei sivutustukea

PayPal on ainoa suuri maksupalveluntarjoaja, joka pakottaa kehittäjät seuraamaan tilaus-ID:tä manuaalisesti omissa tietokannoissaan.


## PayPalin järjestelmällinen peittely: 6 miljoonan äänen vaientaminen {#paypals-systematic-cover-up-silencing-6-million-voices}

Toiminnalla, joka tiivistää täydellisesti PayPalin lähestymistavan kritiikin käsittelyyn, he ottivat hiljattain koko yhteisöfooruminsa pois verkosta, vaientamalla yli 6 miljoonaa jäsentä ja pyyhkien pois satoja tuhansia viestejä, jotka dokumentoivat heidän epäonnistumisensa.

### Suuri pyyhkäisy {#the-great-erasure}

Alkuperäinen PayPal Community osoitteessa `paypal-community.com` isännöi **6 003 558 jäsentä** ja sisälsi satoja tuhansia viestejä, bugiraportteja, valituksia ja keskusteluja PayPalin API-ongelmista. Tämä edusti yli vuosikymmenen dokumentoitua todistusaineistoa PayPalin järjestelmällisistä ongelmista.

30. kesäkuuta 2025 PayPal otti koko foorumin hiljaisesti pois verkosta. Kaikki `paypal-community.com`-linkit palauttavat nyt 404-virheitä. Tämä ei ollut migraatio tai päivitys.

### Kolmannen osapuolen pelastus {#the-third-party-rescue}

Onneksi kolmannen osapuolen palvelu osoitteessa [ppl.lithium.com](https://ppl.lithium.com/) on säilyttänyt osan sisällöstä, mikä antaa meille mahdollisuuden päästä käsiksi keskusteluihin, jotka PayPal yritti piilottaa. Tämä kolmannen osapuolen säilytys on kuitenkin epätäydellinen ja voi kadota milloin tahansa.

Tämä todisteiden piilottamisen kaava ei ole PayPalille uusi. Heillä on dokumentoitu historia:

* Kriittisten bugiraporttien poistamisesta julkisesta näkyvyydestä
* Kehittäjätyökalujen lopettamisesta ilman ennakkoilmoitusta
* API-muutoksista ilman asianmukaista dokumentaatiota
* Yhteisökeskustelujen vaientamisesta heidän epäonnistumisistaan

Foorumin alasajo on räikein yritys tähän mennessä piilottaa heidän järjestelmälliset epäonnistumisensa julkiselta tarkastelulta.


## 11 vuoden Capture-bugin katastrofi: 1 899 dollaria ja kasvussa {#the-11-year-capture-bug-disaster-1899-and-counting}

Sillä aikaa kun PayPal järjesti palautesessioita ja antoi lupauksia, heidän ydinsuoritusjärjestelmänsä on ollut perustavanlaatuisesti rikki yli 11 vuotta. Todisteet ovat musertavia.

### Forward Emailin 1 899 dollarin tappio {#forward-emails-1899-loss}

Tuotantojärjestelmissämme havaitsimme 108 PayPal-maksua, joiden yhteissumma oli **1 899 dollaria**, jotka menetettiin PayPalin capture-virheiden vuoksi. Nämä maksut osoittavat johdonmukaisen kaavan:

* `CHECKOUT.ORDER.APPROVED` webhookit vastaanotettiin
* PayPalin capture-API palautti 404-virheitä
* Tilaukset muuttuivat saavuttamattomiksi PayPalin API:n kautta

On mahdotonta selvittää, veloitettiinko asiakkaita, koska PayPal piilottaa debug-lokit kokonaan 14 päivän jälkeen ja poistaa kaikki tiedot kojelaudalta tilaus-ID:istä, joita ei ole capturoitu.

Tämä edustaa vain yhtä yritystä. **Kokonaistappiot tuhansien kauppiaiden kesken yli 11 vuoden ajalta ovat todennäköisesti miljoonia dollareita.**

**Sanomme tämän uudelleen: kokonaistappiot tuhansien kauppiaiden kesken yli 11 vuoden ajalta ovat todennäköisesti miljoonia dollareita.**

Ainoa syy, miksi löysimme tämän, on se, että olemme uskomattoman tarkkoja ja datalähtöisiä.

### Vuoden 2013 alkuperäinen raportti: yli 11 vuotta huolimattomuutta {#the-2013-original-report-11-years-of-negligence}

Varhaisin dokumentoitu raportti tästä tarkasta ongelmasta löytyy [Stack Overflowsta marraskuulta 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkistoitu](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Keep receiving 404 Error with Rest API when doing a capture"

Vuonna 2013 raportoitu virhe on **täsmälleen sama** kuin mitä Forward Email koki vuonna 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Yhteisön vastaus vuonna 2013 oli kuvaava:

> "There is a reported problem at the moment with REST API. PayPal are working on it."
**Yli 11 vuotta myöhemmin, he "työskentelevät sen parissa" edelleen.**

### Vuoden 2016 myönnös: PayPal rikkoo oman SDK:nsä {#the-2016-admission-paypal-breaks-their-own-sdk}

Vuonna 2016 PayPalin oma GitHub-repositorio dokumentoi [massiivisia virhetilanteita](https://github.com/paypal/PayPal-PHP-SDK/issues/660), jotka vaikuttivat heidän viralliseen PHP SDK:han. Laajuus oli häkellyttävä:

> "20.9.2016 lähtien kaikki PayPalin capture-yritykset ovat epäonnistuneet virheellä 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. API-integraatiossa ei tehty muutoksia 19.9. ja 20.9. välillä. **100 % capture-yrityksistä 20.9. jälkeen on palauttanut tämän virheen.**"

Yksi kauppias raportoi:

> "Minulla on ollut **yli 1 400 epäonnistunutta capture-yritystä viimeisen 24 tunnin aikana**, kaikki INVALID_RESOURCE_ID-virhevastauksella."

PayPalin alkuperäinen vastaus oli syyttää kauppiasta ja ohjata heidät tekniseen tukeen. Vasta valtavan paineen alla he myönsivät virheen:

> "Minulla on päivitys tuotekehittäjiltämme. He ovat huomanneet lähetetyissä otsikoissa, että PayPal-Request-ID lähetetään 42 merkin pituisena, mutta **näyttää siltä, että äskettäin tehtiin muutos, joka rajoittaa tämän ID:n pituuden vain 38 merkkiin.**"

Tämä myönnös paljastaa PayPalin järjestelmällisen huolimattomuuden:

1. **He tekivät dokumentoimattomia rikkomuksia**
2. **He rikkoivat oman virallisen SDK:nsä**
3. **He syyttivät ensin kauppiaita**
4. **He myönsivät virheen vasta paineen alla**

Vaikka ongelma "korjattiin", kauppiaat raportoivat:

> "Päivitetty SDK versioon v1.7.4 ja **ongelma esiintyy edelleen.**"

### Vuoden 2024 eskalaatio: edelleen rikki {#the-2024-escalation-still-broken}

Viimeaikaiset raportit säilytetystä PayPal-yhteisöstä osoittavat, että ongelma on itse asiassa pahentunut. [Syyskuun 2024 keskustelu](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkistoitu](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentoi täsmälleen samat ongelmat:

> "Ongelma on alkanut ilmetä vasta noin 2 viikkoa sitten eikä koske kaikkia tilauksia. **Paljon yleisempi ongelma näyttää olevan 404-virheet capture-vaiheessa.**"

Kauppias kuvailee samaa kaavaa, jonka Forward Email koki:

> "Yritettyäni capturea tilaukselle, PayPal palauttaa 404:n. Kun haetaan tilauksen tietoja: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Tämä tapahtuu ilman minkäänlaista merkkiä onnistuneesta capturesta meidän puoleltamme.**"

### Webhookien luotettavuuskatastrofi {#the-webhook-reliability-disaster}

Toinen [säilytetty yhteisökeskustelu](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) paljastaa, että PayPalin webhook-järjestelmä on perustavanlaatuisesti epäluotettava:

> "Teoreettisesti pitäisi olla kaksi tapahtumaa (CHECKOUT.ORDER.APPROVED ja PAYMENT.CAPTURE.COMPLETED) webhook-tapahtumista. Todellisuudessa **näitä kahta tapahtumaa harvoin vastaanotetaan välittömästi, PAYMENT.CAPTURE.COMPLETED:tä ei useimmiten saada tai se saapuu vasta muutaman tunnin kuluttua.**"

Tilauksen maksujen osalta:

> "**'PAYMENT.SALE.COMPLETED' ei joskus saapunut lainkaan tai vasta muutaman tunnin kuluttua.**"

Kauppiaan kysymykset paljastavat PayPalin luotettavuusongelmien syvyyden:

1. **"Miksi näin tapahtuu?"** - PayPalin webhook-järjestelmä on perustavanlaatuisesti rikki
2. **"Jos tilauksen tila on 'COMPLETED', voinko olettaa, että rahat on vastaanotettu?"** - Kauppiaat eivät voi luottaa PayPalin API-vastauksiin
3. **"Miksi 'Event Logs->Webhook Events' ei löydä mitään lokitietoja?"** - Jopa PayPalin oma lokitusjärjestelmä ei toimi

### Järjestelmällisen huolimattomuuden kaava {#the-pattern-of-systematic-negligence}

Todisteet kattavat yli 11 vuotta ja osoittavat selkeän kaavan:

* **2013**: "PayPal työskentelee sen parissa"
* **2016**: PayPal myöntää rikkomuksen, tarjoaa rikkinäisen korjauksen
* **2024**: Samat virheet esiintyvät edelleen, vaikuttaen Forward Emailiin ja lukemattomiin muihin

Tämä ei ole bugi - **tämä on järjestelmällistä huolimattomuutta.** PayPal on tiennyt näistä kriittisistä maksujen käsittelyongelmista yli vuosikymmenen ajan ja on johdonmukaisesti:
1. **Syytti kauppiaita PayPalin virheistä**
2. **Tekivät dokumentoimattomia rikkomuksia**
3. **Tarjosivat riittämättömiä korjauksia, jotka eivät toimi**
4. **Sivuutti taloudelliset vaikutukset yrityksille**
5. **Piilotti todisteita poistamalla yhteisöfoorumeita**

### Dokumentoimaton vaatimus {#the-undocumented-requirement}

Missään PayPalin virallisessa dokumentaatiossa ei mainita, että kauppiaiden täytyy toteuttaa uudelleenyritysmekanismi capture-operaatioille. Dokumentaatio sanoo, että kauppiaiden tulisi "ottaa kiinni heti hyväksynnän jälkeen", mutta ei mainitse, että heidän API palauttaa satunnaisesti 404-virheitä, jotka vaativat monimutkaisia uudelleenyritysmekanismeja.

Tämä pakottaa jokaisen kauppiaan:

* Toteuttamaan eksponentiaalisen takaisinkytkennän uudelleenyritysmekanismin
* Käsittelemään epäjohdonmukaista webhook-toimitusta
* Rakentamaan monimutkaisia tilanhallintajärjestelmiä
* Valvomaan epäonnistuneita captureja manuaalisesti

**Kaikki muut maksupalveluntarjoajat tarjoavat luotettavia capture-API:ita, jotka toimivat ensimmäisellä kerralla.**


## PayPalin laajempi petoskuvio {#paypals-broader-pattern-of-deception}

Capture-virhe on vain yksi esimerkki PayPalin järjestelmällisestä tavasta huijata asiakkaita ja peitellä epäonnistumisiaan.

### New Yorkin finanssivalvonnan toimenpide {#the-new-york-department-of-financial-services-action}

Tammikuussa 2025 New Yorkin finanssivalvonta antoi [toimenpiteen PayPalia vastaan](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) harhaanjohtavista käytännöistä, mikä osoittaa, että PayPalin petoskuvio ulottuu paljon pidemmälle kuin heidän APIensa rajapintoihin.

Tämä sääntelytoimi osoittaa PayPalin halukkuuden harjoittaa petollisia käytäntöjä koko liiketoiminnassaan, ei vain kehittäjätyökaluissaan.

### Honey-kanteet: kumppanilinkkien uudelleenkirjoitus {#the-honey-lawsuit-rewriting-affiliate-links}

PayPalin Honey-yrityskauppa on johtanut [kanteisiin, joissa väitetään, että Honey muokkaa kumppanilinkkejä](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), varastaen komissioita sisällöntuottajilta ja vaikuttajilta. Tämä on toinen järjestelmällisen petoksen muoto, jossa PayPal hyötyy ohjaamalla tuloja, jotka pitäisi maksaa muille.

Kuvio on selvä:

1. **API-virheet**: Peitä rikkinäinen toiminnallisuus, syytä kauppiaita
2. **Yhteisön vaientaminen**: Poista todisteet ongelmista
3. **Sääntelyrikkomukset**: Harhaanjohtavien käytäntöjen harjoittaminen
4. **Kumppanivarkaus**: Varasta komissioita teknisellä manipuloinnilla

### PayPalin huolimattomuuden kustannukset {#the-cost-of-paypals-negligence}

Forward Emailin 1 899 dollarin tappio on vasta jäävuoren huippu. Tarkastellaan laajempaa vaikutusta:

* **Yksittäiset kauppiaat**: Tuhannet menettävät satoja tai tuhansia dollareita kukin
* **Yritysasiakkaat**: Mahdollisesti miljoonia menetettyä tuloa
* **Kehittäjien aika**: Lukemattomia tunteja kiertotapojen rakentamiseen PayPalin rikkinäisille API:ille
* **Asiakassuhteet**: Yritykset menettävät asiakkaita PayPalin maksujen epäonnistumisten vuoksi

Jos pieni sähköpostipalvelu menetti lähes 2 000 dollaria, ja tämä ongelma on ollut olemassa yli 11 vuotta vaikuttaen tuhansiin kauppiaisiin, kollektiivinen taloudellinen vahinko on todennäköisesti **satoja miljoonia dollareita**.

### Dokumentaation valhe {#the-documentation-lie}

PayPalin virallinen dokumentaatio epäonnistuu jatkuvasti mainitsemaan kriittiset rajoitukset ja virheet, joihin kauppiaat törmäävät. Esimerkiksi:

* **Capture API**: Ei mainintaa, että 404-virheet ovat yleisiä ja vaativat uudelleenyritysmekanismin
* **Webhookien luotettavuus**: Ei mainintaa, että webhookit viivästyvät usein tunteja
* **Tilauksen listaus**: Dokumentaatio antaa ymmärtää, että listaus on mahdollista, vaikka päätepistettä ei ole
* **Istunnon aikakatkaisut**: Ei mainintaa aggressiivisista 60 sekunnin aikakatkaisuista

Tämä järjestelmällinen kriittisen tiedon poisjättäminen pakottaa kauppiaat löytämään PayPalin rajoitukset kokeilemalla tuotantojärjestelmissä, mikä usein johtaa taloudellisiin menetyksiin.


## Mitä tämä tarkoittaa kehittäjille {#what-this-means-for-developers}

PayPalin järjestelmällinen epäonnistuminen vastata perustavanlaatuisiin kehittäjien tarpeisiin samalla kun se kerää laajasti palautetta osoittaa perustavanlaatuisen organisaatio-ongelman. He käsittelevät palautteen keräämistä korvikkeena ongelmien todelliselle korjaamiselle.
Kaava on selvä:

1. Kehittäjät raportoivat ongelmista  
2. PayPal järjestää palautesessioita johtajien kanssa  
3. Laajaa palautetta annetaan  
4. Tiimit myöntävät puutteet ja lupaavat "seurata ja korjata"  
5. Mitään ei toteuteta  
6. Johtajat siirtyvät parempiin yrityksiin  
7. Uudet tiimit pyytävät samaa palautetta  
8. Sykli toistuu  

Sillä välin kehittäjät joutuvat rakentamaan kiertoteitä, tinkimään turvallisuudesta ja käsittelemään rikkinäisiä käyttöliittymiä vain hyväksyäkseen maksuja.

Jos rakennat maksujärjestelmää, opi kokemuksistamme: rakenna [trifecta-lähestymistapasi](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) useilla maksunvälittäjillä, mutta älä odota PayPalin tarjoavan tarvitsemaasi perustoiminnallisuutta. Suunnittele kiertoteiden rakentaminen alusta alkaen.

> Tämä kirjoitus dokumentoi 11 vuoden kokemuksemme PayPalin API:sta Forward Emailillä. Kaikki koodiesimerkit ja linkit ovat todellisista tuotantojärjestelmistämme. Jatkamme PayPal-maksujen tukemista näistä ongelmista huolimatta, koska joillakin asiakkailla ei ole muita vaihtoehtoja

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
