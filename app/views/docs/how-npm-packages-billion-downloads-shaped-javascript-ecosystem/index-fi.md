# Vuosikymmenen vaikutus: Kuinka npm-pakettimme saavuttivat miljardin latauksen rajan ja muokkasivat JavaScriptiä {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Pioneerit, jotka luottavat meihin: Isaac Z. Schlueter ja Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm:n luomisesta Node.js:n johtajuuteen](#from-npms-creation-to-nodejs-leadership)
* [Koodin takana oleva arkkitehti: Nick Baughin matka](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express-tekninen komitea ja keskeiset panokset](#express-technical-committee-and-core-contributions)
  * [Koa-kehyksen panokset](#koa-framework-contributions)
  * [Yksittäisestä avustajasta organisaation johtajaksi](#from-individual-contributor-to-organization-leader)
* [GitHub-organisaatiomme: Innovaatioekosysteemit](#our-github-organizations-ecosystems-of-innovation)
  * [Mökki: Rakenteinen puunkorjuu nykyaikaisiin sovelluksiin](#cabin-structured-logging-for-modern-applications)
  * [Roskapostiskanneri: Sähköpostin väärinkäytön torjunta](#spam-scanner-fighting-email-abuse)
  * [Bree: Nykyaikainen työaikataulutus työntekijäsäikeillä](#bree-modern-job-scheduling-with-worker-threads)
  * [Sähköpostin välitys: Avoimen lähdekoodin sähköpostiinfrastruktuuri](#forward-email-open-source-email-infrastructure)
  * [Lad: Olennaiset Koa-apuohjelmat ja -työkalut](#lad-essential-koa-utilities-and-tools)
  * [Käyttöaika: Avoimen lähdekoodin käyttöajan seuranta](#upptime-open-source-uptime-monitoring)
* [Panoksemme sähköpostin välitysekosysteemiin](#our-contributions-to-the-forward-email-ecosystem)
  * [Paketeista tuotantoon](#from-packages-to-production)
  * [Palautesilmukka](#the-feedback-loop)
* [Sähköpostin välitysperiaatteet: Erinomaisuuden perusta](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Aina kehittäjäystävällinen, tietoturvakeskeinen ja läpinäkyvä](#always-developer-friendly-security-focused-and-transparent)
  * [Aikaansaattujen ohjelmistokehitysperiaatteiden noudattaminen](#adherence-to-time-tested-software-development-principles)
  * [Kohdentaminen Scrappy-, Bootstrapped-kehittäjään](#targeting-the-scrappy-bootstrapped-developer)
  * [Käytännön periaatteet: Sähköpostin edelleenlähetyskoodisto](#principles-in-practice-the-forward-email-codebase)
  * [Sisäänrakennettu tietosuoja](#privacy-by-design)
  * [Kestävä avoin lähdekoodi](#sustainable-open-source)
* [Numerot eivät valehtele: Hämmästyttävät npm-lataustilastomme](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Lintuperspektiivistä vaikutukseemme](#a-birds-eye-view-of-our-impact)
  * [Päivittäinen vaikutus skaalautuvasti](#daily-impact-at-scale)
  * [Raakojen numeroiden tuolla puolen](#beyond-the-raw-numbers)
* [Ekosysteemin tukeminen: Avoimen lähdekoodin sponsorointimme](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Sähköpostiinfrastruktuurin edelläkävijä](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [JavaScript-ekosysteemin tietoturvahaavoittuvuuksien paljastaminen](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-reitittimen pelastus](#the-koa-router-rescue)
  * [ReDoS-haavoittuvuuksien korjaaminen](#addressing-redos-vulnerabilities)
  * [Node.js:n ja Chromiumin tietoturvan puolustaminen](#advocating-for-nodejs-and-chromium-security)
  * [NPM-infrastruktuurin suojaaminen](#securing-npm-infrastructure)
* [Panoksemme sähköpostin välitysekosysteemiin](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailerin ydintoimintojen parantaminen](#enhancing-nodemailers-core-functionality)
  * [Sähköpostin todennuksen edistäminen Mailauthin avulla](#advancing-email-authentication-with-mailauth)
  * [Tärkeimmät käyttöajan parannukset](#key-upptime-enhancements)
* [Kaiken koossa pitävä liima: räätälöity koodi skaalautuvasti](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Massiivinen kehitysponnistus](#a-massive-development-effort)
  * [Ydinriippuvuuksien integrointi](#core-dependencies-integration)
  * [DNS-infrastruktuuri Tangerine- ja mx-connect-palveluiden avulla](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Yritysvaikutus: Avoimesta lähdekoodista kriittisiin ratkaisuihin](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Case-tutkimukset kriittisestä sähköposti-infrastruktuurista](#case-studies-in-mission-critical-email-infrastructure)
* [Avoimen lähdekoodin vuosikymmen: Katse tulevaisuuteen](#a-decade-of-open-source-looking-forward)

## Esipuhe {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript)- ja [Node.js](https://en.wikipedia.org/wiki/Node.js)-maailmassa jotkin paketit ovat välttämättömiä – niitä ladataan miljoonia kertoja päivässä ja ne pyörittävät sovelluksia maailmanlaajuisesti. Näiden työkalujen takana ovat kehittäjät, jotka keskittyvät avoimen lähdekoodin laatuun. Tänään näytämme, kuinka tiimimme auttaa rakentamaan ja ylläpitämään npm-paketteja, joista on tullut JavaScript-ekosysteemin keskeisiä osia.

## Pioneerit, jotka luottavat meihin: Isaac Z. Schlueter ja sähköpostin välitys {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Olemme ylpeitä siitä, että [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) on käyttäjämme. Isaac loi [npm](https://en.wikipedia.org/wiki/Npm_\(software\):n ja auttoi rakentamaan [Node.js](https://en.wikipedia.org/wiki/Node.js):n. Hänen luottamuksensa Forward Emailiin osoittaa keskittymisemme laatuun ja turvallisuuteen. Isaac käyttää Forward Emailia useilla verkkotunnuksilla, mukaan lukien izs.me.

Isaacin vaikutus JavaScriptiin on valtava. Vuonna 2009 hän oli ensimmäisten joukossa, jotka näkivät Node.js:n potentiaalin työskennellessään alustan luoneen [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl):n kanssa. Kuten Isaac sanoi [haastattelu Increment-lehden kanssa](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/)-viestissä: "Tämän hyvin pienen ihmisyhteisön keskellä, joka yritti selvittää, miten palvelinpuolen JS saataisiin toteutettua, Ryan Dahl esitteli Noden, joka oli selvästi oikea lähestymistapa. Panostin siihen ja aloin todella innostua vuoden 2009 puolivälissä."

> \[!NOTE]
> Node.js:n historiasta kiinnostuneille on saatavilla erinomaisia dokumentteja, jotka kertovat sen kehityksestä, mukaan lukien [Node.js:n tarina](https://www.youtube.com/watch?v=LB8KwiiUGy0) ja [10 asiaa, joita kadun Node.js:ssä - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Myös Ryan Dahlin [henkilökohtainen verkkosivusto](https://tinyclouds.org/) sisältää arvokkaita näkemyksiä hänen työstään.

### Npm:n luomisesta Node.js:n johtajuuteen {#from-npms-creation-to-nodejs-leadership}

Isaac loi npm:n syyskuussa 2009, ja ensimmäinen käyttökelpoinen versio julkaistiin vuoden 2010 alussa. Tämä pakettihallinta täytti Node.js:n keskeisen tarpeen, sillä se mahdollisti kehittäjille koodin helpon jakamisen ja uudelleenkäytön. [Node.js:n Wikipedia-sivu](https://en.wikipedia.org/wiki/Node.js):n mukaan "Tammikuussa 2010 Node.js-ympäristöön esiteltiin pakettihallinta nimeltä npm. Pakethallinta mahdollistaa ohjelmoijien julkaista ja jakaa Node.js-paketteja sekä niihin liittyvää lähdekoodia, ja se on suunniteltu yksinkertaistamaan pakettien asennusta, päivittämistä ja poistamista."

Kun Ryan Dahl jäi pois Node.js:ltä tammikuussa 2012, Isaac otti projektin vetäjän tehtävät. Kuten [hänen yhteenvetonsa](https://izs.me/resume)-sivustolla todetaan, hän "johti useiden Node.js:n perustavanlaatuisten ydin-API-rajapintojen, mukaan lukien CommonJS-moduulijärjestelmän, tiedostojärjestelmä-API-rajapintojen ja striimien, kehitystä" ja "toimi projektin BDFL:nä (Benevolent Dictator For Life) kahden vuoden ajan varmistaen jatkuvasti parantuvan laadun ja luotettavan käännösprosessin Node.js-versioille v0.6–v0.10".

Isaac johdatti Node.js:ää tärkeän kasvukauden läpi ja asetti standardeja, jotka edelleen muokkaavat alustaa. Myöhemmin hän perusti npm, Inc:n vuonna 2014 tukemaan npm-rekisteriä, jota hän oli aiemmin hoitanut itse.

Kiitämme Isaacia hänen valtavista panoksistaan JavaScriptiin ja käytämme edelleen monia hänen luomiaan paketteja. Hänen työnsä on muuttanut tapaamme rakentaa ohjelmistoja ja sitä, miten miljoonat kehittäjät jakavat koodia maailmanlaajuisesti.

## Koodin takana oleva arkkitehti: Nick Baughin matka {#the-architect-behind-the-code-nick-baughs-journey}

Avoimen lähdekoodin menestyksemme ytimessä on Nick Baugh, Forward Emailin perustaja ja omistaja. Hänen työnsä JavaScriptin parissa kestää lähes 20 vuotta ja on muokannut lukemattomien kehittäjien tapoja rakentaa sovelluksia. Hänen avoimen lähdekoodin matkansa osoittaa sekä teknistä taitoa että yhteisöjohtajuutta.

### Express-tekninen komitea ja ydinpanokset {#express-technical-committee-and-core-contributions}

Nickin web-kehysosaaminen ansaitsi hänelle paikan [Expressin tekninen komitea](https://expressjs.com/en/resources/community.html)-listalla, jossa hän auttoi yhden käytetyimmän Node.js-kehyksen kanssa. Nick on nyt listattu passiiviseksi jäseneksi [Express-yhteisösivu](https://expressjs.com/en/resources/community.html)-listalla.

> \[!IMPORTANT]
> Expressin loi alun perin TJ Holowaychuk, tuottelias avoimen lähdekoodin kehittäjä, joka on muokannut suurta osaa Node.js-ekosysteemistä. Olemme kiitollisia TJ:n perustavanlaatuisesta työstä ja kunnioitamme hänen [päätös pitää tauko](https://news.ycombinator.com/item?id=37687017) -panostaan laajoista avoimen lähdekoodin panoksistaan.

[Expressin tekninen komitea](https://expressjs.com/en/resources/community.html)-ryhmän jäsenenä Nick osoitti suurta huomiota yksityiskohtiin esimerkiksi `req.originalUrl`-ryhmän dokumentaation selventämisessä ja moniosaisten lomakkeiden käsittelyongelmien korjaamisessa.

### Koa-kehyksen kontribuutiot {#koa-framework-contributions}

Nickin työ [Koa-kehys](https://github.com/koajs/koa):n parissa – TJ Holowaychukin kehittämässä modernissa ja kevyemmässä Express-vaihtoehdossa – osoittaa entisestään hänen sitoutumisensa parempiin web-kehitystyökaluihin. Hänen Koa-panoksensa sisältävät sekä ongelmia että koodia pull-pyyntöjen kautta, virheiden käsittelyn, sisällön tyypin hallinnan ja dokumentaation parannuksia.

Hänen työnsä sekä Expressin että Koan parissa antaa hänelle ainutlaatuisen näkökulman Node.js-verkkokehitykseen ja auttaa tiimiämme luomaan paketteja, jotka toimivat hyvin useiden kehysekosysteemien kanssa.

### Yksittäisestä avustajasta organisaation johtajaksi {#from-individual-contributor-to-organization-leader}

Se, mikä alkoi olemassa olevien projektien auttamisena, kasvoi kokonaisten pakettiekosysteemien luomiseksi ja ylläpitämiseksi. Nick perusti useita GitHub-organisaatioita – mukaan lukien [Mökki](https://github.com/cabinjs), [Roskapostiskanneri](https://github.com/spamscanner), [Lähetä sähköpostia eteenpäin](https://github.com/forwardemail), [Poika](https://github.com/ladjs) ja [Bree](https://github.com/breejs) – joista jokainen ratkaisi JavaScript-yhteisön erityistarpeita.

Tämä siirtyminen avustajasta johtajaksi osoittaa Nickin vision hyvin suunnitellusta ohjelmistosta, joka ratkaisee todellisia ongelmia. Järjestämällä toisiinsa liittyviä paketteja kohdennettujen GitHub-organisaatioiden alle hän on rakentanut työkaluekosysteemejä, jotka toimivat yhdessä ja pysyvät modulaarisina ja joustavina laajemmalle kehittäjäyhteisölle.

## GitHub-organisaatiomme: Innovaatioekosysteemit {#our-github-organizations-ecosystems-of-innovation}

Järjestämme avoimen lähdekoodin työmme GitHub-organisaatioiden ympärille, joista jokainen ratkaisee tiettyjä JavaScript-tarpeita. Tämä rakenne luo yhtenäisiä pakettiperheitä, jotka toimivat hyvin yhdessä pysyen samalla modulaarisina.

### Cabin: Rakenteinen lokikirjaus nykyaikaisille sovelluksille {#cabin-structured-logging-for-modern-applications}

[Matkustamon organisointi](https://github.com/cabinjs) on meidän versiomme yksinkertaisesta ja tehokkaasta sovellusten lokikirjauksesta. [`cabin`](https://github.com/cabinjs/cabin)-pääpaketilla on lähes 900 GitHub-tähteä ja yli 100 000 viikoittaista latausta\[^1]. Cabin tarjoaa jäsennellyn lokikirjauksen, joka toimii suosittujen palveluiden, kuten Sentryn, LogDNA:n ja Papertrailin, kanssa.

Cabinin erityispiirre on sen harkittu API-rajapinta ja laajennusjärjestelmä. Tukemamme paketit, kuten [`axe`](https://github.com/cabinjs/axe) Express-väliohjelmistoille ja [`parse-request`](https://github.com/cabinjs/parse-request) HTTP-pyyntöjen jäsentämiseen, osoittavat sitoutumisemme kokonaisvaltaisiin ratkaisuihin yksittäisten työkalujen sijaan.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid)-paketti ansaitsee erityismaininnan, sillä sitä on ladattu yli 1,7 miljoonaa kertaa vain kahdessa kuukaudessa\[^2]. Tästä kevyestä MongoDB ObjectID -toteutuksesta on tullut kehittäjien, jotka tarvitsevat tunnisteita ilman täysiä MongoDB-riippuvuuksia, ensisijainen valinta.

### Roskapostiskanneri: Sähköpostin väärinkäytön torjunta {#spam-scanner-fighting-email-abuse}

[Roskapostiskanneriorganisaatio](https://github.com/spamscanner) osoittaa sitoutumisemme todellisten ongelmien ratkaisemiseen. Pääasiallinen [`spamscanner`](https://github.com/spamscanner/spamscanner)-paketti tarjoaa edistyneen sähköpostiroskapostin tunnistuksen, mutta [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-paketti on ottanut sen erittäin hyvin käyttöön.

Yli 1,2 miljoonalla latauksella kahdessa kuukaudessa\[^3] `url-regex-safe` korjaa kriittisiä tietoturvaongelmia muissa URL-tunnistuksen säännöllisissä lausekkeissa. Tämä paketti esittelee lähestymistapamme avoimeen lähdekoodiin: yleisen ongelman (tässä tapauksessa [Tee uudelleen](https://en.wikipedia.org/wiki/ReDoS) haavoittuvuudet URL-validoinnissa) löytämisen, vankan ratkaisun luomisen ja sen huolellisen ylläpidon.

### Bree: Nykyaikainen työaikataulutus työntekijäsäikeillä {#bree-modern-job-scheduling-with-worker-threads}

[Bree-organisaatio](https://github.com/breejs) on vastauksemme yleiseen Node.js:n haasteeseen: luotettavaan töiden ajoitukseen. Pääasiallinen [`bree`](https://github.com/breejs/bree)-paketti, jossa on yli 3 100 GitHub-tähteä, tarjoaa modernin töiden ajoittajan, joka käyttää Node.js:n työsäikeitä paremman suorituskyvyn ja luotettavuuden saavuttamiseksi.

> \[!NOTE]
> Bree luotiin sen jälkeen, kun olimme auttaneet ylläpitämään [Esityslista](https://github.com/agenda/agenda):tä ja soveltaneet saatuja oppeja paremman työaikatauluttajan rakentamiseen. Agenda-työhön osallistumisemme auttoivat meitä löytämään tapoja parantaa työaikataulutusta.

Mikä erottaa Breen muista aikataulutustyökaluista, kuten Agendasta:

* **Ei ulkoisia riippuvuuksia**: Toisin kuin Agenda, joka tarvitsee MongoDB:tä, Bree ei vaadi Redisiä tai MongoDB:tä työtilan hallintaan.
* **Työsäikeet**: Bree käyttää Node.js:n työsäikeitä hiekkalaatikkoprosesseille, mikä parantaa eristystä ja suorituskykyä.
* **Yksinkertainen API**: Bree tarjoaa yksityiskohtaista hallintaa yksinkertaisesti, mikä helpottaa monimutkaisten aikataulutustarpeiden toteuttamista.
* **Sisäänrakennettu tuki**: Oletusarvoisesti mukana ovat esimerkiksi sujuva uudelleenlataus, cron-työt, päivämäärät ja käyttäjäystävälliset ajat.

Bree on keskeinen osa [forwardemail.net](https://github.com/forwardemail/forwardemail.net):aa, ja se hoitaa kriittisiä taustatehtäviä, kuten sähköpostien käsittelyä, siivousta ja aikataulun mukaista ylläpitoa. Breen käyttö sähköpostin välittämisessä osoittaa sitoutumisemme omien työkalujemme käyttöön tuotannossa ja varmistaa, että ne täyttävät korkeat luotettavuusstandardit.

Käytämme ja arvostamme myös muita loistavia työsäikepaketteja, kuten [uima-allas](https://github.com/piscinajs/piscina), ja HTTP-asiakasohjelmia, kuten [yksitoista](https://github.com/nodejs/undici). Piscina, kuten Bree, käyttää Node.js:n työsäikeitä tehokkaaseen tehtävien käsittelyyn. Kiitämme [Matthew Hill](https://github.com/mcollina):ta, joka ylläpitää sekä undiciä että piscinaa, hänen merkittävästä panoksestaan Node.js:ään. Matteo toimii Node.js:n teknisessä ohjausryhmässä ja on parantanut huomattavasti HTTP-asiakasohjelman ominaisuuksia Node.js:ssä.

### Sähköpostin edelleenlähetys: Avoimen lähdekoodin sähköpostiinfrastruktuuri {#forward-email-open-source-email-infrastructure}

Kunnianhimoisin projektimme on [Lähetä sähköpostia eteenpäin](https://github.com/forwardemail), avoimen lähdekoodin sähköpostipalvelu, joka tarjoaa sähköpostin edelleenlähetystä, tallennusta ja API-palveluita. Pääarkistolla on yli 1 100 GitHub-tähteä\[^4], mikä osoittaa yhteisön arvostusta tälle vaihtoehdolle omille sähköpostipalveluille.

Tämän organisaation [`preview-email`](https://github.com/forwardemail/preview-email)-paketti, jota ladattiin yli 2,5 miljoonaa kertaa kahdessa kuukaudessa\[^5], on tullut välttämättömäksi työkaluksi sähköpostimallien kanssa työskenteleville kehittäjille. Tarjoamalla yksinkertaisen tavan esikatsella sähköposteja kehitysvaiheessa, se ratkaisee yleisen ongelman sähköpostisovellusten kehittämisessä.

### Lad: Olennaiset Koa-apuohjelmat ja -työkalut {#lad-essential-koa-utilities-and-tools}

[Lad-järjestö](https://github.com/ladjs) tarjoaa kokoelman keskeisiä apuohjelmia ja työkaluja, jotka keskittyvät ensisijaisesti Koa-kehysekosysteemin parantamiseen. Nämä paketit ratkaisevat yleisiä web-kehityksen haasteita ja ne on suunniteltu toimimaan saumattomasti yhdessä ja samalla itsenäisesti hyödyllisinä.

#### koa-better-error-handler: Parannettu virheiden käsittely Koa-kohteelle {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tarjoaa paremman virheidenkäsittelyratkaisun Koa-sovelluksille. Yli 50 GitHub-tähden ansiosta tämä paketti saa `ctx.throw`:n tuottamaan käyttäjäystävällisiä virheilmoituksia ja samalla korjaa useita Koa:n sisäänrakennetun virheenkäsittelijän rajoituksia:

* Havaitsee ja käsittelee oikein Node.js DNS-virheet, Mongoose-virheet ja Redis-virheet
* Käyttää [Puomi](https://github.com/hapijs/boom)-metodia johdonmukaisten ja hyvin muotoiltujen virhevastausten luomiseen
* Säilyttää otsikot (toisin kuin Koan sisäänrakennettu käsittelijä)
* Säilyttää asianmukaiset tilakoodit oletusarvon 500 sijaan
* Tukee flash-viestejä ja istunnon säilytystä
* Tarjoaa HTML-virheluetteloita validointivirheille
* Tukee useita vastaustyyppejä (HTML, JSON ja pelkkä teksti)

Tämä paketti on erityisen hyödyllinen käytettynä [`koa-404-handler`](https://github.com/ladjs/koa-404-handler):n rinnalla Koa-sovellusten kattavaan virheiden hallintaan.

#### passi: Todennus käyttäjälle {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) laajentaa suosittua Passport.js-todennusväliohjelmistoa tietyillä parannuksilla nykyaikaisia verkkosovelluksia varten. Tämä paketti tukee useita todennusstrategioita suoraan paketista:

* Paikallinen todennus sähköpostitse
* Kirjaudu sisään Applella
* GitHub-todennus
* Google-todennus
* Kertakäyttösalasanan (OTP) todennus

Paketti on erittäin muokattavissa, minkä ansiosta kehittäjät voivat mukauttaa kenttien nimiä ja lauseita sovelluksensa vaatimusten mukaisesti. Se on suunniteltu integroitumaan saumattomasti Mongooseen käyttäjähallintaa varten, mikä tekee siitä ihanteellisen ratkaisun Koa-pohjaisille sovelluksille, jotka tarvitsevat vankan todennuksen.

#### graceful: Elegantti sovelluksen sammutus {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) ratkaisee Node.js-sovellusten sujuvan sulkemisen kriittisen haasteen. Yli 70 GitHub-tähden ansiosta tämä paketti varmistaa, että sovelluksesi voi sulkeutua siististi menettämättä tietoja tai jättämättä yhteyksiä jumiin. Tärkeimpiä ominaisuuksia ovat:

* Tuki HTTP-palvelimien sulavalle sulkemiselle (Express/Koa/Fastify)
* Tietokantayhteyksien siisti sulkeminen (MongoDB/Mongoose)
* Redis-asiakkaiden asianmukainen sulkeminen
* Bree-työaikataulutusten käsittely
* Tuki mukautetuille sulkemiskäsittelijöille
* Määritettävät aikakatkaisuasetukset
* Integrointi lokikirjausjärjestelmiin

Tämä paketti on välttämätön tuotantosovelluksille, joissa odottamattomat sammumiset voivat johtaa tietojen menetykseen tai vioittumiseen. Toteuttamalla asianmukaiset sammutusmenettelyt `@ladjs/graceful` auttaa varmistamaan sovelluksesi luotettavuuden ja vakauden.

### Käyttöaika: Avoimen lähdekoodin käyttöajan valvonta {#upptime-open-source-uptime-monitoring}

[Käyttöaikaorganisaatio](https://github.com/upptime) edustaa sitoutumistamme läpinäkyvään ja avoimen lähdekoodin valvontaan. [`upptime`](https://github.com/upptime/upptime)-pääarkistossa on yli 13 000 GitHub-tähteä, mikä tekee siitä yhden suosituimmista projekteista, joihin osallistumme. Upptime tarjoaa GitHub-pohjaisen käyttöajan valvonnan ja tilasivun, joka toimii kokonaan ilman palvelinta.

Käytämme Upptimea omalla tilasivullamme osoitteessa <https://status.forwardemail.net>, jonka lähdekoodi on saatavilla osoitteessa <https://github.com/forwardemail/status.forwardemail.net>.

Uptimen erityispiirre on sen arkkitehtuuri:

* **100 % avoimen lähdekoodin**: Jokainen komponentti on täysin avoimen lähdekoodin ja muokattavissa.
* **GitHubin tarjoama**: Hyödyntää GitHubin toimintoja, ongelmia ja sivuja palvelimettomassa valvontaratkaisussa.
* **Palvelinta ei tarvita**: Toisin kuin perinteiset valvontatyökalut, Upptime ei vaadi palvelimen suorittamista tai ylläpitoa.
* **Automaattinen tilasivu**: Luo kauniin tilasivun, jota voidaan isännöidä GitHub-sivuilla.
* **Tehokkaat ilmoitukset**: Integroituu useisiin ilmoituskanaviin, kuten sähköpostiin, tekstiviesteihin ja Slackiin.

Parantaaksemme käyttäjäkokemusta olemme integroineet [@octokit/core](https://github.com/octokit/core.js/)-luokituksen forwardemail.net-koodikantaan, jotta reaaliaikaiset tilannepäivitykset ja ongelmat näkyvät suoraan verkkosivustollamme. Tämä integraatio tarjoaa käyttäjillemme selkeän läpinäkyvyyden mahdollisten ongelmien varalta koko palvelussamme (verkkosivusto, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree jne.) välittömien ilmoitusten, merkkikuvakkeiden muutosten, varoitusvärien ja muiden avulla.

@octokit/core-kirjaston avulla voimme hakea reaaliaikaista dataa Upptime GitHub -arkistostamme, käsitellä sitä ja näyttää sen käyttäjäystävällisellä tavalla. Kun palvelussa on käyttökatkos tai sen suorituskyky heikkenee, käyttäjille ilmoitetaan siitä välittömästi visuaalisten ilmaisimien avulla ilman, että heidän tarvitsee poistua pääsovelluksesta. Tämä saumaton integraatio varmistaa, että käyttäjillämme on aina ajantasaista tietoa järjestelmämme tilasta, mikä parantaa läpinäkyvyyttä ja luottamusta.

Sadat organisaatiot ovat ottaneet Uptimen käyttöön etsiessään läpinäkyvää ja luotettavaa tapaa valvoa palveluitaan ja viestiä niiden tilasta käyttäjille. Projektin menestys osoittaa, että työkaluja voidaan rakentaa hyödyntämään olemassa olevaa infrastruktuuria (tässä tapauksessa GitHubia) yleisten ongelmien ratkaisemiseksi uusilla tavoilla.

## Panoksemme sähköpostin edelleenlähetysekosysteemiin {#our-contributions-to-the-forward-email-ecosystem}

Vaikka avoimen lähdekoodin pakettejamme käyttävät kehittäjät maailmanlaajuisesti, ne muodostavat myös oman sähköpostinvälityspalvelumme perustan. Tämä kaksoisrooli – sekä näiden työkalujen luojina että käyttäjinä – antaa meille ainutlaatuisen näkökulman niiden käytännön sovelluksiin ja edistää jatkuvaa parantamista.

### Paketeista tuotantoon {#from-packages-to-production}

Matka yksittäisistä paketeista yhtenäiseksi tuotantojärjestelmäksi vaatii huolellista integrointia ja laajentamista. Forward Emailin osalta tämä prosessi sisältää seuraavat:

* **Mukautetut laajennukset**: Sähköpostikohtaisten laajennusten rakentaminen avoimen lähdekoodin paketteihimme, jotka vastaavat ainutlaatuisiin vaatimuksiimme.
* **Integraatiomallit**: Mallien kehittäminen näiden pakettien vuorovaikutukselle tuotantoympäristössä.
* **Suorituskyvyn optimoinnit**: Suorituskyvyn pullonkaulojen tunnistaminen ja ratkaiseminen, joita esiintyy vain skaalautuvasti.
* **Tietojen suojaamisen vahvistaminen**: Sähköpostin käsittelyyn ja käyttäjätietojen suojaukseen liittyvien lisätietoturvakerrosten lisääminen.

Tämä työ edustaa tuhansia tunteja kehitystyötä ydinpakettien ulkopuolella, minkä tuloksena on syntynyt vankka ja turvallinen sähköpostipalvelu, joka hyödyntää parhaita avoimen lähdekoodin panoksiamme.

### Palautesilmukka {#the-feedback-loop}

Ehkä arvokkain puoli omien pakettien käyttämisessä tuotannossa on sen luoma palautesilmukka. Kun kohtaamme rajoituksia tai reunatapauksia Forward Emailissa, emme vain korjaa niitä paikallisesti – parannamme pohjana olevia paketteja, mikä hyödyttää sekä palveluamme että laajempaa yhteisöä.

Tämä lähestymistapa on johtanut lukuisiin parannuksiin:

* **Breen sulava sulkeminen**: Forward Emailin tarve nollakäyttöisille käyttöönotuksille johti parannettuihin sulaviin sulkemisominaisuuksiin Breessä.
* **Roskapostiskannerin kuvioiden tunnistus**: Forward Emailissa havaitut reaalimaailman roskapostikuviot ovat vaikuttaneet roskapostiskannerin tunnistusalgoritmeihin.
* **Cabinin suorituskyvyn optimoinnit**: Suuren volyymin lokitietojen kerääminen tuotannossa paljasti Cabinissa optimointimahdollisuuksia, jotka hyödyttävät kaikkia käyttäjiä.

Ylläpitämällä tätä hyveellistä kierrettä avoimen lähdekoodin työmme ja tuotantopalvelumme välillä varmistamme, että pakettimme pysyvät käytännöllisinä ja käytännössä testattuina ratkaisuina teoreettisten toteutusten sijaan.

## Sähköpostin edelleenlähetyksen ydinperiaatteet: Erinomaisuuden perusta {#forward-emails-core-principles-a-foundation-for-excellence}

Sähköpostin edelleenlähetys on suunniteltu tiettyjen ydinperiaatteiden mukaisesti, jotka ohjaavat kaikkia kehityspäätöksiämme. Nämä periaatteet, jotka on yksityiskohtaisesti kuvattu [verkkosivusto](/blog/docs/best-quantum-safe-encrypted-email-service#principles)-sivullamme, varmistavat, että palvelumme pysyy kehittäjäystävällisenä, turvallisena ja keskittyy käyttäjien yksityisyyteen.

### Aina kehittäjäystävällinen, tietoturvakeskeinen ja läpinäkyvä {#always-developer-friendly-security-focused-and-transparent}

Ensimmäinen ja tärkein periaatteemme on luoda ohjelmistoja, jotka ovat kehittäjäystävällisiä ja samalla ylläpitävät korkeimpia turvallisuus- ja yksityisyysstandardeja. Uskomme, että tekninen huippuosaaminen ei saisi koskaan tulla käytettävyyden kustannuksella ja että läpinäkyvyys rakentaa luottamusta yhteisössämme.

Tämä periaate näkyy yksityiskohtaisessa dokumentaatiossamme, selkeissä virheilmoituksissamme ja avoimessa viestinnässämme sekä onnistumisista että haasteista. Tekemällä koko koodikannastamme avoimen lähdekoodin, kannustamme tarkasteluun ja yhteistyöhön, mikä vahvistaa sekä ohjelmistoamme että laajempaa ekosysteemiä.

### Aikaansa testattujen ohjelmistokehitysperiaatteiden noudattaminen {#adherence-to-time-tested-software-development-principles}

Noudatamme useita vakiintuneita ohjelmistokehityksen periaatteita, jotka ovat osoittaneet arvonsa vuosikymmenten ajan:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Erilaisten ongelmien erottaminen Model-View-Controller-mallin avulla
* **[Unix-filosofia](https://en.wikipedia.org/wiki/Unix_philosophy)**: Modulaaristen komponenttien luominen, jotka tekevät yhden asian hyvin
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Yksinkertaisena ja suoraviivaisena
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Älä toista itseäsi, edistä koodin uudelleenkäyttöä
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Et tule tarvitsemaan sitä, vältä ennenaikaista optimointia
* **[Kaksitoista tekijää](https://12factor.net/)**: Parhaiden käytäntöjen noudattaminen nykyaikaisten, skaalautuvien sovellusten rakentamiseksi
* **[Occamin partakone](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Yksinkertaisimman ratkaisun valitseminen, joka täyttää vaatimukset
* **[Koiratestaus](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Omien tuotteidemme laaja käyttö

Nämä periaatteet eivät ole vain teoreettisia käsitteitä – ne ovat osa päivittäisiä kehityskäytäntöjämme. Esimerkiksi sitoutumisemme Unix-filosofiaan näkyy siinä, miten olemme jäsentäneet npm-pakettimme: pienet, kohdennetut moduulit, jotka voidaan koota yhteen monimutkaisten ongelmien ratkaisemiseksi.

### Kohdistettuna rähjäisille ja motivoituneille kehittäjille {#targeting-the-scrappy-bootstrapped-developer}

Kohdistamme erityisesti sinnikkäät, itseohjautuneet ja [ramen-kannattava](https://www.paulgraham.com/ramenprofitable.html)-kehittäjät. Tämä keskittyminen muokkaa kaikkea hinnoittelumallista teknisiin päätöksiimme. Ymmärrämme tuotteiden rakentamisen haasteet rajallisilla resursseilla, koska olemme itse kokeneet sen.

Tämä periaate on erityisen tärkeä siinä, miten lähestymme avoimen lähdekoodin ratkaisuja. Luomme ja ylläpidämme paketteja, jotka ratkaisevat kehittäjien todellisia ongelmia ilman yritysbudjetteja, tehden tehokkaista työkaluista kaikkien saatavilla resursseista riippumatta.

### Käytännön periaatteet: Sähköpostin edelleenlähetyskoodisto {#principles-in-practice-the-forward-email-codebase}

Nämä periaatteet näkyvät selvästi Forward Email -koodikannassa. Package.json-tiedostomme paljastaa harkitun valikoiman riippuvuuksia, joista jokainen on valittu ydinarvojemme mukaisesti:

* Turvallisuuteen keskittyvät paketit, kuten `mailauth` sähköpostin todennukseen
* Kehittäjäystävälliset työkalut, kuten `preview-email` helpompaan virheenkorjaukseen
* Modulaariset komponentit, kuten Sindre Sorhusin erilaiset `p-*`-apuohjelmat

Noudattamalla näitä periaatteita johdonmukaisesti ajan kuluessa olemme rakentaneet palvelun, johon kehittäjät voivat luottaa sähköposti-infrastruktuurinsa suhteen – turvallisen, luotettavan ja avoimen lähdekoodin yhteisön arvojen mukaisen.

### Sisäänrakennettu tietosuoja {#privacy-by-design}

Tietosuoja ei ole jälkikäteen mietitty tai markkinointiominaisuus Forward Email -palvelussa – se on perusperiaate, joka ohjaa palvelumme ja koodimme jokaista osa-aluetta:

* **Zero-Access Encryption**: Olemme ottaneet käyttöön järjestelmiä, jotka tekevät käyttäjien sähköpostien lukemisen teknisesti mahdottomaksi.
* **Minimaalinen tiedonkeruu**: Keräämme vain palvelumme tarjoamiseen tarvittavat tiedot, ei mitään muuta.
* **Läpinäkyvät käytännöt**: Tietosuojakäytäntömme on kirjoitettu selkeällä ja ymmärrettävällä kielellä ilman lakikieltä.
* **Avoimen lähdekoodin varmennus**: Avoimen lähdekoodin koodikantaamme avulla tietoturvatutkijat voivat varmentaa tietosuojaväitteemme.

Tämä sitoutuminen ulottuu avoimen lähdekoodin paketteihimme, jotka on suunniteltu alusta alkaen turvallisuus- ja yksityisyyskäytäntöjä noudattaen.

### Kestävä avoimen lähdekoodin {#sustainable-open-source}

Uskomme, että avoimen lähdekoodin ohjelmistot tarvitsevat kestäviä malleja menestyäkseen pitkällä aikavälillä. Lähestymistapaamme kuuluu:

* **Kaupallinen tuki**: Tarjoamme ensiluokkaista tukea ja palveluita avoimen lähdekoodin työkaluillemme.
* **Tasapainoinen lisensointi**: Käytämme lisenssejä, jotka suojaavat sekä käyttäjien vapauksia että projektin kestävyyttä.
* **Yhteisön osallistaminen**: Aktiivinen vuorovaikutus avustajien kanssa tukevan yhteisön rakentamiseksi.
* **Läpinäkyvät etenemissuunnitelmat**: Jaamme kehityssuunnitelmiamme, jotta käyttäjät voivat suunnitella niitä niiden mukaisesti.

Keskittymällä kestävään kehitykseen varmistamme, että avoimen lähdekoodin tuotokset voivat kasvaa ja parantua ajan myötä sen sijaan, että ne jäisivät unohduksiin.

## Numerot eivät valehtele: Hämmästyttävät npm-lataustilastomme {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Kun puhumme avoimen lähdekoodin ohjelmistojen vaikutuksesta, lataustilastot tarjoavat konkreettisen mittarin käyttöönotosta ja luottamuksesta. Monet paketeista, joita autamme ylläpitämään, ovat saavuttaneet mittakaavan, johon harvat avoimen lähdekoodin projektit koskaan pääsevät, ja yhteenlaskettujen latausten määrä on miljardeja.

![Suosituimmat npm-paketit latausten mukaan](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Vaikka olemme ylpeitä voidessamme auttaa ylläpitämään useita JavaScript-ekosysteemin erittäin ladattuja paketteja, haluamme tunnustaa, että monet näistä paketeista ovat alun perin muiden lahjakkaiden kehittäjien luomia. Paketit, kuten superagent ja supertest, on alun perin luonut TJ Holowaychuk, jonka tuottelias panos avoimeen lähdekoodiin on ollut keskeisessä asemassa Node.js-ekosysteemin muokkaamisessa.

### Vaikutuksemme yleiskatsaus {#a-birds-eye-view-of-our-impact}

Vain kahden kuukauden aikana helmikuusta maaliskuuhun 2025 tärkeimmät paketit, joihin osallistumme ja joita autamme ylläpitämään, ennättivät hämmästyttävät latausmäärät:

* **[superagentti](https://www.npmjs.com/package/superagent)**: 84 575 829 latausta\[^7] (alkuperäinen luoja TJ Holowaychuk)
* **[supertesti](https://www.npmjs.com/package/supertest)**: 76 432 591 latausta\[^8] (alkuperäinen luoja TJ Holowaychuk)
* **[myös](https://www.npmjs.com/package/koa)**: 28 539 295 latausta\[^34] (alkuperäinen luoja TJ Holowaychuk)
* **[@koa/reititin](https://www.npmjs.com/package/@koa/router)**: 11 007 327 latausta\[^35]
* **[koa-reititin](https://www.npmjs.com/package/koa-router)**: 3 498 918 latausta\[^36]
* **[url-säännöllinen lauseke](https://www.npmjs.com/package/url-regex)**: 2 819 520 latausta\[^37]
* **[esikatselusähköposti](https://www.npmjs.com/package/preview-email)**: 2 500 000 lataukset\[^9]
* **[mökki](https://www.npmjs.com/package/cabin)**: 1 800 000 latausta\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 latausta\[^38]
* **[sähköpostimallit](https://www.npmjs.com/package/email-templates)**: 1 128 139 latausta\[^39]
* **__PROTECTED_LINK_259__0**: 1 124 686 latausta\[^40]
* **__PROTECTED_LINK_259__1**: 1 200 000 latausta\[^11]
* **__PROTECTED_LINK_259__2**: 894 666 latausta\[^41]
* **__PROTECTED_LINK_259__3**: 839 585 latausta\[^42]
* **__PROTECTED_LINK_259__4**: 145 000 lataukset\[^12]
* **__PROTECTED_LINK_259__5**: 24 270 latausta\[^30]

> \[!NOTE]
> Useilla muilla paketeilla, joiden ylläpidossa olemme auttaneet, mutta joita emme ole luoneet, on vielä suurempia latausmääriä, mukaan lukien `form-data` (yli 738 miljoonaa latausta), `toidentifier` (yli 309 miljoonaa latausta), `stackframe` (yli 116 miljoonaa latausta) ja `error-stack-parser` (yli 113 miljoonaa latausta). Olemme ylpeitä voidessamme osallistua näiden pakettien kehittämiseen samalla kunnioittaen niiden alkuperäisten tekijöiden työtä.

Nämä eivät ole vain vaikuttavia lukuja – ne edustavat oikeita kehittäjiä, jotka ratkaisevat oikeita ongelmia koodilla, jonka ylläpidossa autamme. Jokainen lataus on esimerkki siitä, miten nämä paketit ovat auttaneet jotakuta rakentamaan jotain merkityksellistä, harrastelijaprojekteista miljoonien käyttämiin yrityssovelluksiin.

![Pakkausluokat Jakelu](/img/art/category_pie_chart.svg)

### Päivittäinen vaikutus mittakaavassa {#daily-impact-at-scale}

Päivittäiset latausmallit paljastavat tasaisen, suuren käyttömäärän, ja huippujen mukaan latauksia on miljoonia päivässä\[^13]. Tämä yhdenmukaisuus kertoo näiden pakettien vakaudesta ja luotettavuudesta – kehittäjät eivät vain kokeile niitä, vaan he integroivat ne ydintoimintoihinsa ja ovat riippuvaisia niistä päivästä toiseen.

Viikoittaiset latauskäyttäytymiset osoittavat vieläkin vaikuttavampia lukuja, pysyen jatkuvasti kymmenien miljoonien latausten ympärillä viikossa\[^14]. Tämä edustaa valtavaa jalanjälkeä JavaScript-ekosysteemissä, sillä näitä paketteja käytetään tuotantoympäristöissä ympäri maailmaa.

### Raakojen lukujen tuolla puolen {#beyond-the-raw-numbers}

Vaikka lataustilastot itsessään ovat vaikuttavia, ne kertovat syvemmän tarinan yhteisön näihin paketteihin kohdistamasta luottamuksesta. Pakettien ylläpitäminen tässä mittakaavassa vaatii horjumatonta sitoutumista:

* **Takaisinpäin yhteensopivuus**: Muutoksia on harkittava huolellisesti, jotta vältetään olemassa olevien toteutusten rikkoutuminen.
* **Tietoturva**: Koska miljoonat sovellukset ovat riippuvaisia näistä paketeista, tietoturvahaavoittuvuuksilla voi olla kauaskantoisia seurauksia.
* **Suorituskyky**: Tässä mittakaavassa jopa pienillä suorituskyvyn parannuksilla voi olla merkittäviä kokonaishyötyjä.
* **Dokumentaatio**: Selkeä ja kattava dokumentaatio on välttämätöntä kaiken tasoisten kehittäjien käyttämille paketeille.

Latausmäärien tasainen kasvu ajan myötä heijastaa onnistumista näiden sitoumusten täyttämisessä ja luottamuksen rakentamisessa kehittäjäyhteisön kanssa luotettavien ja hyvin ylläpidettyjen pakettien avulla.

## Ekosysteemin tukeminen: Avoimen lähdekoodin sponsorointimme {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Avoimen lähdekoodin kestävä kehitys ei tarkoita pelkästään koodin tuottamista – se koskee myös kriittisen infrastruktuurin ylläpitäjien tukemista.

JavaScript-ekosysteemille antamamme suoran panoksen lisäksi olemme ylpeitä voidessamme tukea merkittäviä Node.js-avustajia, joiden työ muodostaa monien nykyaikaisten sovellusten perustan. Sponsoroihimme kuuluvat:

### Andris Reinman: Sähköpostiinfrastruktuurin edelläkävijä {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) on [Nodemailer](https://github.com/nodemailer/nodemailer):n luoja. __PROTECTED_LINK_276__ on Node.js:n suosituin sähköpostin lähetyskirjasto, jota ladataan yli 14 miljoonaa kertaa viikossa\[^15]. Hänen työnsä ulottuu muihin kriittisiin sähköpostiinfrastruktuurikomponentteihin, kuten [SMTP-palvelin](https://github.com/nodemailer/smtp-server):een, [Sähköpostin jäsentäjä](https://github.com/nodemailer/mailparser):een ja [Villiankka](https://github.com/nodemailer/wildduck):ään.

Sponsorointimme auttaa varmistamaan näiden olennaisten työkalujen jatkuvan ylläpidon ja kehityksen, jotka tukevat sähköpostiviestintää lukemattomissa Node.js-sovelluksissa, mukaan lukien oma sähköpostin edelleenlähetyspalvelumme.

### Sindre Sorhus: Utility Package Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) on yksi JavaScript-ekosysteemin tuotteliaimmista avoimen lähdekoodin kehittäjistä, ja hänellä on yli 1 000 npm-pakettia. Hänen apuohjelmansa, kuten [p-kartta](https://github.com/sindresorhus/p-map), [p-uudelleenyritys](https://github.com/sindresorhus/p-retry) ja [on-stream](https://github.com/sindresorhus/is-stream), ovat Node.js-ekosysteemin perustavanlaatuisia rakennuspalikoita.

Tukemalla Sindren työtä autamme ylläpitämään näiden kriittisten apuohjelmien kehitystä, jotka tekevät JavaScript-kehityksestä tehokkaampaa ja luotettavampaa.

Nämä sponsoroinnit heijastavat sitoutumistamme laajempaan avoimen lähdekoodin ekosysteemiin. Ymmärrämme, että oma menestyksemme perustuu näiden ja muiden osallistujien luomaan perustaan, ja olemme sitoutuneet varmistamaan koko ekosysteemin kestävyyden.

## JavaScript-ekosysteemin tietoturvahaavoittuvuuksien paljastaminen {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Sitoutumisemme avoimeen lähdekoodiin ulottuu ominaisuuksien kehittämisen ulkopuolelle ja kattaa myös miljooniin kehittäjiin mahdollisesti vaikuttavien tietoturvahaavoittuvuuksien tunnistamisen ja korjaamisen. Useat merkittävimmistä panoksistamme JavaScript-ekosysteemiin ovat olleet tietoturvan alueella.

### Koa-reitittimen pelastus {#the-koa-router-rescue}

Helmikuussa 2019 Nick tunnisti kriittisen ongelman suositun koa-router-paketin ylläpidossa. Koska hän oli [raportoitu Hacker Newsissa](https://news.ycombinator.com/item?id=19156707), alkuperäinen ylläpitäjä oli hylännyt paketin, minkä vuoksi tietoturva-aukkoihin ei puututtu eikä yhteisölle jäänyt päivityksiä.

> \[!WARNING]
> Hylätyt paketit, joissa on tietoturva-aukkoja, aiheuttavat merkittäviä riskejä koko ekosysteemille, varsinkin kun niitä ladataan miljoonia kertoja viikossa.

Vastauksena tähän Nick loi [@koa/reititin](https://github.com/koajs/router):n ja auttoi ilmoittamaan tilanteesta yhteisölle. Hän on ylläpitänyt tätä kriittistä pakettia siitä lähtien varmistaen, että Koa-käyttäjillä on turvallinen ja hyvin ylläpidetty reititysratkaisu.

### ReDoS-haavoittuvuuksien korjaaminen {#addressing-redos-vulnerabilities}

Vuonna 2020 Nick tunnisti ja korjasi kriittisen [Säännöllisten lausekkeiden palvelunesto (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-haavoittuvuuden laajalti käytetyssä `url-regex`-paketissa. Tämä haavoittuvuus ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) voi antaa hyökkääjille mahdollisuuden aiheuttaa palvelunestohyökkäyksiä antamalla erityisesti muotoiltua syötettä, joka voi aiheuttaa katastrofaalisen takaisinjäljityksen säännöllisessä lausekkeessa.

Sen sijaan, että Nick olisi vain korjannut olemassa olevan paketin, hän loi [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe):n, täysin uudelleenkirjoitetun toteutuksen, joka korjaa haavoittuvuuden säilyttäen samalla yhteensopivuuden alkuperäisen API:n kanssa. Hän julkaisi myös [kattava blogikirjoitus](/blog/docs/url-regex-javascript-node-js):n, jossa selitettiin haavoittuvuus ja sen lieventämismenetelmät.

Tämä työ osoittaa lähestymistapamme tietoturvaan: emme ainoastaan korjaa ongelmia, vaan koulutamme yhteisöä ja tarjoamme vankkoja vaihtoehtoja, jotka estävät vastaavia ongelmia tulevaisuudessa.

### Node.js:n ja Chromiumin tietoturvan puolustaminen {#advocating-for-nodejs-and-chromium-security}

Nick on myös aktiivisesti ajanut tietoturvaparannuksia laajemmassa ekosysteemissä. Elokuussa 2020 hän tunnisti Node.js:ssä merkittävän tietoturvaongelman, joka liittyi sen HTTP-otsikoiden käsittelyyn. Ongelmasta raportoitiin [Rekisteri](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/)-julkaisussa.

Tämä Chromiumin korjauspäivityksestä johtuva ongelma saattoi antaa hyökkääjille mahdollisuuden ohittaa turvatoimenpiteitä. Nickin edunvalvonta auttoi varmistamaan, että ongelmaan puututtiin nopeasti, mikä suojasi miljoonia Node.js-sovelluksia mahdollisilta hyökkäyksiltä.

### Npm-infrastruktuurin suojaaminen {#securing-npm-infrastructure}

Myöhemmin samassa kuussa Nick tunnisti toisen kriittisen tietoturvaongelman, tällä kertaa npm:n sähköpostiinfrastruktuurissa. Kuten [Rekisteri](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/)-tiedostossa raportoitiin, npm ei toteuttanut DMARC-, SPF- ja DKIM-sähköpostin todennusprotokollia oikein, minkä vuoksi hyökkääjät saattoivat lähettää tietojenkalasteluviestejä, jotka näyttivät tulevan npm:ltä.

Nickin raportti johti npm:n sähköpostin tietoturvan parannuksiin, suojaten miljoonia kehittäjiä, jotka ovat riippuvaisia npm:stä pakettienhallinnassa, mahdollisilta tietojenkalasteluhyökkäyksiltä.

## Panoksemme sähköpostin edelleenlähetysekosysteemiin {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email on rakennettu useiden kriittisten avoimen lähdekoodin projektien, kuten Nodemailerin, WildDuckin ja mailauthin, päälle. Tiimimme on antanut merkittäviä panoksia näihin projekteihin auttaen tunnistamaan ja korjaamaan sähköpostin toimitukseen ja tietoturvaan vaikuttavia vakavia ongelmia.

### Nodemailerin ydintoimintojen parantaminen {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) on sähköpostin lähettämisen selkäranka Node.js:ssä, ja panoksemme ovat auttaneet tekemään siitä entistä vankemman:

* **SMTP-palvelimen parannukset**: Olemme korjanneet jäsennysvirheitä, datavirran käsittelyongelmia ja TLS-määritysongelmia SMTP-palvelinkomponentissa\[^16]\[^17].
* **Sähköpostin jäsentimen parannukset**: Olemme korjanneet merkkijonojen dekoodausvirheitä ja jäsenninongelmia, jotka saattoivat aiheuttaa sähköpostin käsittelyvirheitä\[^18]\[^19].

Nämä panokset varmistavat, että Nodemailer pysyy luotettavana perustana sähköpostin käsittelylle Node.js-sovelluksissa, mukaan lukien Forward Email.

### Sähköpostin todennuksen tehostaminen Mailauthilla {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tarjoaa kriittisen sähköpostin todennustoiminnon, ja panoksemme ovat parantaneet sen ominaisuuksia merkittävästi:

* **DKIM-vahvistuksen parannukset**: Havaitsimme ja raportoimme, että X/Twitterillä oli DNS-välimuistiongelmia, jotka aiheuttivat DKIM-virheen lähtevissä viesteissä. Raportoimme tästä Hacker Onella\[^20].
* **DMARC- ja ARC-parannukset**: Olemme korjanneet DMARC- ja ARC-vahvistuksen ongelmia, jotka saattoivat johtaa virheellisiin todennustuloksiin\[^21]\[^22].
* **Suorituskyvyn optimoinnit**: Olemme tehneet optimointeja, jotka parantavat sähköpostin todennusprosessien suorituskykyä\[^23]\[^24]\[^25]\[^26].

Nämä parannukset auttavat varmistamaan, että sähköpostin todennus on tarkkaa ja luotettavaa, ja suojaavat käyttäjiä tietojenkalastelu- ja väärennyshyökkäyksiltä.

### Tärkeimmät käyttöajan parannukset {#key-upptime-enhancements}

Upptimelle antamamme panokset sisältävät:

* **SSL-varmenteen valvonta**: Lisäsimme toiminnon SSL-varmenteen vanhenemisen valvontaan, mikä estää odottamattomat käyttökatkokset vanhentuneiden varmenteiden vuoksi\[^27].
* **Useiden tekstiviestinumeroiden tuki**: Otimme käyttöön tuen useiden tiimin jäsenten hälyttämiseen tekstiviestitse häiriöistä, mikä parantaa vasteaikoja\[^28].
* **IPv6-tarkistusten korjaukset**: Korjasimme IPv6-yhteystarkistuksiin liittyviä ongelmia, mikä varmistaa tarkemman valvonnan nykyaikaisissa verkkoympäristöissä\[^29].
* **Tumma/vaalea tila -tuki**: Lisäsimme teematuen parantaaksemme tilasivujen käyttökokemusta\[^31].
* **Parempi TCP-ping-tuki**: Paransimme TCP-ping-toimintoa luotettavamman yhteystestauksen tarjoamiseksi\[^32].

Nämä parannukset eivät ainoastaan hyödytä Forward Emailin tilanvalvontaa, vaan ne ovat saatavilla koko Upptimen käyttäjäyhteisölle, mikä osoittaa sitoutumisemme työkalujen parantamiseen, joihin luotamme.

## Kaiken yhdistävä tekijä: Mukautettu koodi skaalautuvasti {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Vaikka npm-pakettimme ja panoksemme olemassa oleviin projekteihin ovat merkittäviä, juuri nämä komponentit integroiva mukautettu koodi todella osoittaa teknisen asiantuntemuksemme. Forward Email -koodikanta edustaa vuosikymmenen kehitystyötä, joka ulottuu vuoteen 2017, jolloin projekti alkoi nimellä [ilmainen sähköpostin edelleenlähetys](https://github.com/forwardemail/free-email-forwarding) ennen kuin se yhdistettiin monorepoon.

### Massiivinen kehitysponnistus {#a-massive-development-effort}

Tämän mukautetun integraatiokoodin mittakaava on vaikuttava:

* **Kokonaismuutoksia**: Yli 3 217 committia
* **Koodikannan koko**: Yli 421 545 riviä koodia JavaScript-, Pug-, CSS- ja JSON-tiedostoissa\[^33]

Tämä edustaa tuhansia tunteja kehitystyötä, virheenkorjausistuntoja ja suorituskyvyn optimointeja. Se on "salainen resepti", joka muuttaa yksittäiset paketit yhtenäiseksi ja luotettavaksi palveluksi, jota tuhannet asiakkaat käyttävät päivittäin.

### Ydinriippuvuuksien integrointi {#core-dependencies-integration}

Sähköpostin välityskoodisto yhdistää lukuisia riippuvuuksia saumattomaksi kokonaisuudeksi:

* **Sähköpostin käsittely**: Integroi Nodemailerin lähettämiseen, SMTP-palvelimen vastaanottamiseen ja Mailparserin jäsentämiseen.
* **Todennus**: Käyttää Mailauth-palvelua DKIM-, SPF-, DMARC- ja ARC-vahvistukseen.
* **DNS-selvitys**: Hyödyntää Tangerine-palvelua DNS-over-HTTPS:ään globaalilla välimuistilla.
* **MX-yhteys**: Käyttää mx-connectia Tangerine-integraation kanssa luotettavien sähköpostipalvelinyhteyksien luomiseksi.
* **Työn aikataulutus**: Käyttää Bree-palvelua luotettavaan taustatehtävien käsittelyyn työsäikeiden kanssa.
* **Mallipohjat**: Käyttää sähköpostimalleja verkkosivuston tyylitiedostojen uudelleenkäyttöön asiakasviestinnässä.
* **Sähköpostin tallennus**: Toteuttaa yksilöllisesti salatut SQLite-postilaatikot käyttämällä parempia sqlite3-monisalauksia ChaCha20-Poly1305-salauksella kvanttiturvallisen yksityisyyden takaamiseksi, varmistaen täydellisen eristyksen käyttäjien välillä ja sen, että vain käyttäjällä on pääsy postilaatikkoonsa.

Jokainen näistä integraatioista vaatii huolellista harkintaa reunatapauksissa, suorituskykyyn liittyvissä vaikutuksissa ja tietoturvaongelmissa. Tuloksena on vankka järjestelmä, joka käsittelee miljoonia sähköpostitapahtumia luotettavasti. SQLite-toteutuksemme hyödyntää myös msgpackr:ää tehokkaaseen binäärisarjoitukseen ja WebSocketsia (ws:n kautta) reaaliaikaisiin tilapäivityksiin koko infrastruktuurissamme.

### DNS-infrastruktuuri Tangerinen ja mx-connectin avulla {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Emailin infrastruktuurin kriittinen osa on DNS-selvitysjärjestelmämme, joka on rakennettu kahden keskeisen paketin ympärille:

* **[Mandariini](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS -toteutuksemme tarjoaa valmiin korvaajan tavalliselle DNS-resolverille, ja siinä on sisäänrakennetut uudelleenyritykset, aikakatkaisut, älykäs palvelimen rotaatio ja välimuistituki.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Tämä paketti muodostaa TCP-yhteyksiä MX-palvelimiin ottamalla kohdeverkkotunnuksen tai sähköpostiosoitteen, selvittämällä sopivat MX-palvelimet ja muodostamalla niihin yhteyden prioriteettijärjestyksessä.

Olemme integroineet Tangerinen mx-connectin kanssa [pull-pyyntö #4](https://github.com/zone-eu/mx-connect/pull/4), varmistaen sovelluskerroksen DNS:n HTTP-pyyntöjen kautta koko Forward Email -palvelun ajan. Tämä tarjoaa globaalin välimuistin DNS:lle skaalautuvasti 1:1-yhdenmukaisuudella millä tahansa alueella, sovelluksessa tai prosessissa – kriittistä luotettavalle sähköpostin toimitukselle hajautetussa järjestelmässä.

## Vaikutus yrityksiin: Avoimesta lähdekoodista kriittisiin ratkaisuihin {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kymmenen vuotta kestäneen avoimen lähdekoodin kehitystyömme huipentuma on mahdollistanut Forward Emailin palvelemisen paitsi yksittäisten kehittäjien myös suurten yritysten ja oppilaitosten kanssa, jotka muodostavat itse avoimen lähdekoodin liikkeen selkärangan.

### Case-tutkimukset kriittisestä sähköposti-infrastruktuurista {#case-studies-in-mission-critical-email-infrastructure}

Sitoutumisemme luotettavuuteen, yksityisyyteen ja avoimen lähdekoodin periaatteisiin on tehnyt Forward Emailista luotettavan valinnan organisaatioille, joilla on vaativia sähköpostivaatimuksia:

* **Oppilaitokset**: Kuten yksityiskohtaisesti kerrotaan [alumnien sähköpostin edelleenlähetystä koskevassa tapaustutkimuksessamme]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study):n kautta. Suuret yliopistot luottavat infrastruktuuriimme ylläpitääkseen elinikäisiä yhteyksiä satoihin tuhansiin alumneihin luotettavien sähköpostin edelleenlähetyspalveluiden kautta.

* **Yrityskäyttöön tarkoitetut Linux-ratkaisut**: [Canonical Ubuntu -sähköpostiyritysten tapaustutkimus](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) osoittaa, kuinka avoimen lähdekoodin lähestymistapamme sopii täydellisesti yrityskäyttöön tarkoitettujen Linux-palveluntarjoajien tarpeisiin ja tarjoaa heille tarvittavaa läpinäkyvyyttä ja hallintaa.

* **Avoimen lähdekoodin säätiöt**: Ehkäpä kaikkein validoin on kumppanuutemme Linux Foundationin kanssa, kuten [Linux Foundationin sähköpostiyritysten tapaustutkimus](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)-dokumentissa on dokumentoitu. Palvelumme mahdollistaa viestinnän juuri Linux-kehitystä valvovalle organisaatiolle.

Avoimen lähdekoodin pakettiemme huolella vuosien varrella ylläpitämässä sähköpostipalvelussa on kaunis symmetria, jonka avulla olemme voineet rakentaa juuri niitä yhteisöjä ja organisaatioita, jotka ajavat avoimen lähdekoodin ohjelmistoja. Tämä kokonaisvaltainen matka – yksittäisten pakettien luomisesta yritystason sähköposti-infrastruktuurin tarjoamiseen avoimen lähdekoodin johtajille – edustaa lopullista vahvistusta lähestymistavallemme ohjelmistokehitykseen.

## Avoimen lähdekoodin vuosikymmen: Katse tulevaan {#a-decade-of-open-source-looking-forward}

Kun katsomme taaksepäin kymmenen vuoden avoimen lähdekoodin projekteihin panostamiseen ja katsomme eteenpäin seuraaviin kymmeneen vuoteen, olemme täynnä kiitollisuutta työtämme tukeneelle yhteisölle ja innostusta tulevasta.

Matkamme yksittäisistä pakettien kehittäjistä suurten yritysten ja avoimen lähdekoodin säätiöiden käyttämän kattavan sähköposti-infrastruktuurin ylläpitäjiksi on ollut merkittävä. Se on osoitus avoimen lähdekoodin kehityksen voimasta ja siitä, miten harkittu ja hyvin ylläpidetty ohjelmisto voi vaikuttaa laajempaan ekosysteemiin.

Tulevina vuosina olemme sitoutuneet:

* **Jatkamme olemassa olevien pakettiemme ylläpitoa ja parantamista** varmistaen, että ne pysyvät luotettavina työkaluina kehittäjille maailmanlaajuisesti.
* **Laajennamme osallistumistamme kriittisiin infrastruktuurihankkeisiin**, erityisesti sähköpostin ja tietoturvan aloilla.
* **Parantamme Forward Emailin ominaisuuksia** säilyttäen samalla sitoutumisemme yksityisyyteen, tietoturvaan ja läpinäkyvyyteen.
* **Tuemme seuraavan sukupolven avoimen lähdekoodin kehittäjiä** mentoroinnin, sponsoroinnin ja yhteisötyön avulla.

Uskomme, että ohjelmistokehityksen tulevaisuus on avoin, yhteistyöhön perustuva ja luottamuksen varaan rakennettu. Jatkamalla korkealaatuisten ja tietoturvaan keskittyvien pakettien tuottamista JavaScript-ekosysteemiin toivomme voivamme olla pienellä osalla tämän tulevaisuuden rakentamista.

Kiitos kaikille, jotka ovat käyttäneet pakettejamme, osallistuneet projekteihimme, ilmoittaneet ongelmista tai yksinkertaisesti levittäneet tietoa työstämme. Tukenne on mahdollistanut tämän vuosikymmenen vaikuttavuuden, ja olemme innoissamme nähdessämme, mitä voimme yhdessä saavuttaa seuraavien kymmenen vuoden aikana.

\[^1]: npm lataustilastot cabinille, huhtikuu 2025
\[^2]: npm lataustilastot bson-objectidille, helmi-maaliskuu 2025
\[^3]: npm lataustilastot url-regex-safelle, huhtikuu 2025
\[^4]: GitHub-tähtien määrä forwardemailille/forwardemail.netille huhtikuusta 2025 lähtien
\[^5]: npm lataustilastot preview-emailille, huhtikuu 2025
\[^7]: npm lataustilastot superagentille, helmi-maaliskuu 2025
\[^8]: npm lataustilastot supertestille, helmi-maaliskuu 2025
\[^9]: npm lataustilastot preview-emailille, helmi-maaliskuu 2025
\[^10]: npm lataustilastot cabinille, helmi-maaliskuu 2025
\[^11]: npm lataustilastot url-regex-safelle, helmi-maaliskuu 2025
\[^12]: npm-lataustilastot roskapostin skannerille, helmi-maaliskuu 2025
\[^13]: Päivittäiset latausmallit npm-tilastoista, huhtikuu 2025
\[^14]: Viikoittaiset latausmallit npm-tilastoista, huhtikuu 2025
\[^15]: npm-lataustilastot nodemailerille, huhtikuu 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Perustuu GitHub-ongelmiin Upptime-arkistossa
\[^28]: Perustuu GitHub-ongelmiin Upptime-arkistossa
\[^29]: Perustuu GitHub-ongelmiin Upptime-arkistossa
\[^30]: npm lataustilastot breelle, helmikuu-maaliskuu 2025
\[^31]: Perustuu GitHubin pull-pyyntöihin Upptimelle
\[^32]: Perustuu GitHubin pull-pyyntöihin Upptimelle
\[^34]: npm lataustilastot koalle, helmikuu-maaliskuu 2025
\[^35]: npm lataustilastot @koa/routerille, helmikuu-maaliskuu 2025
\[^36]: npm lataustilastot koa-routerille, helmikuu-maaliskuu 2025
\[^37]: npm lataustilastot url-regexille, helmikuu-maaliskuu 2025
\[^38]: npm lataustilastot @breejs/laterille, helmikuu-maaliskuu 2025
\[^39]: npm lataustilastot sähköpostimalleille, helmikuu-maaliskuu 2025
\[^40]: npm lataustilastot get-pathsille, helmikuu-maaliskuu 2025
\[^41]: npm lataustilastot dotenv-parse-variablesille, helmikuu-maaliskuu 2025
\[^42]: npm lataustilastot @koa/multerille, helmikuu-maaliskuu 2025