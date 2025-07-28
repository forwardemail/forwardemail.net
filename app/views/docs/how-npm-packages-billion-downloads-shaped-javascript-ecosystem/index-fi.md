# Vuosikymmenen vaikutus: Kuinka npm-pakettimme saavuttivat miljardin latauksen rajan ja muokkasivat JavaScriptiä {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="laiska" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Pioneerit, jotka luottavat meihin: Isaac Z. Schlueter ja välitä sähköposti](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm:n luomisesta Node.js-johtajuuteen](#from-npms-creation-to-nodejs-leadership)
* [Arkkitehti koodin takana: Nick Baugh's Journey](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express tekninen komitea ja keskeiset panokset](#express-technical-committee-and-core-contributions)
  * [Koa Framework Contributions](#koa-framework-contributions)
  * [Yksittäisestä avustajasta organisaation johtajaksi](#from-individual-contributor-to-organization-leader)
* [GitHub-organisaatiomme: Innovaatioekosysteemit](#our-github-organizations-ecosystems-of-innovation)
  * [Mökki: Strukturoitu kirjaus nykyaikaisiin sovelluksiin](#cabin-structured-logging-for-modern-applications)
  * [Roskapostin skanneri: Sähköpostin väärinkäytön torjunta](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderni työaikataulu työntekijöiden säikeillä](#bree-modern-job-scheduling-with-worker-threads)
  * [Lähetä sähköposti edelleen: avoimen lähdekoodin sähköpostiinfrastruktuuri](#forward-email-open-source-email-infrastructure)
  * [Lad: Essential Koa Utilities and Tools](#lad-essential-koa-utilities-and-tools)
  * [Käyttöaika: avoimen lähdekoodin käyttöajan valvonta](#upptime-open-source-uptime-monitoring)
* [Avustuksemme Forward Email -ekosysteemiin](#our-contributions-to-the-forward-email-ecosystem)
  * [Paketeista tuotantoon](#from-packages-to-production)
  * [Palautesilmukka](#the-feedback-loop)
* [Välitä sähköpostin ydinperiaatteet: huippuosaamisen perusta](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Aina kehittäjäystävällinen, turvallisuuteen keskittyvä ja läpinäkyvä](#always-developer-friendly-security-focused-and-transparent)
  * [Aika-testattujen ohjelmistokehitysperiaatteiden noudattaminen](#adherence-to-time-tested-software-development-principles)
  * [Kohdennettuna romahtaneeseen, bootstrapped-kehittäjään](#targeting-the-scrappy-bootstrapped-developer)
  * [Käytännön periaatteet: Edelleenlähetyskoodikanta](#principles-in-practice-the-forward-email-codebase)
  * [Yksityisyys suunnittelusta](#privacy-by-design)
  * [Kestävä avoin lähdekoodi](#sustainable-open-source)
* [Numerot eivät valehtele: Hämmästyttävät npm-lataustilastot](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Lintuperspektiivistä näkemyksemme vaikutuksestamme](#a-birds-eye-view-of-our-impact)
  * [Päivittäinen vaikutus mittakaavassa](#daily-impact-at-scale)
  * [Raakalukujen ulkopuolella](#beyond-the-raw-numbers)
* [Ekosysteemin tukeminen: avoimen lähdekoodin sponsorointimme](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Sähköpostiinfrastruktuurin edelläkävijä](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [JavaScript-ekosysteemin tietoturva-aukkojen paljastaminen](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-reitittimen pelastus](#the-koa-router-rescue)
  * [ReDoS-haavoittuvuuksien korjaaminen](#addressing-redos-vulnerabilities)
  * [Node.js:n ja Chromium Securityn kannattaminen](#advocating-for-nodejs-and-chromium-security)
  * [npm-infrastruktuurin turvaaminen](#securing-npm-infrastructure)
* [Avustuksemme Forward Email -ekosysteemiin](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailerin ydintoimintojen parantaminen](#enhancing-nodemailers-core-functionality)
  * [Sähköpostin todennuksen edistäminen Mailauthin avulla](#advancing-email-authentication-with-mailauth)
  * [Tärkeimmät käyttöajan parannukset](#key-upptime-enhancements)
* [Liima, joka pitää kaiken yhdessä: räätälöity koodi mittakaavassa](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Valtava kehitystyö](#a-massive-development-effort)
  * [Keskeisten riippuvuuksien integrointi](#core-dependencies-integration)
  * [DNS-infrastruktuuri, jossa on Tangerine ja mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Yrityksen vaikutus: avoimesta lähdekoodista missiokriittisiin ratkaisuihin](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Tapaustutkimuksia mission kannalta kriittisestä sähköpostiinfrastruktuurista](#case-studies-in-mission-critical-email-infrastructure)
* [Avoimen lähdekoodin vuosikymmen: Katse eteenpäin](#a-decade-of-open-source-looking-forward)

## Esipuhe {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) ja [Node.js](https://en.wikipedia.org/wiki/Node.js) maailmassa jotkin paketit ovat välttämättömiä – niitä ladataan miljoonia kertoja päivittäin ja ne pyörittävät sovelluksia maailmanlaajuisesti. Näiden työkalujen takana ovat kehittäjät, jotka keskittyvät avoimen lähdekoodin laatuun. Tänään näytämme, kuinka tiimimme auttaa rakentamaan ja ylläpitämään npm-paketteja, joista on tullut JavaScript-ekosysteemin keskeisiä osia.

## Meihin luottavat pioneerit: Isaac Z. Schlueter ja sähköpostin välitys {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Olemme ylpeitä siitä, että meillä on käyttäjä [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac loi [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) ja auttoi rakentamaan [Node.js](https://en.wikipedia.org/wiki/Node.js). Hänen luottamuksensa Forward Emailiin osoittaa keskittymisemme laatuun ja turvallisuuteen. Isaac käyttää Forward Emailia useilla verkkotunnuksilla, mukaan lukien izs.me.

Isaacin vaikutus JavaScriptiin on valtava. Vuonna 2009 hän oli ensimmäisten joukossa, jotka näkivät Node.js:n potentiaalin työskennellessään alustan luoneen [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl):n kanssa. Kuten Isaac sanoi [Increment-lehden haastattelu](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/):ssa: "Tämän hyvin pienen ihmisyhteisön keskellä, joka yritti selvittää, miten palvelinpuolen JS saataisiin toteutettua, Ryan Dahl esitteli Noden, joka oli selvästi oikea lähestymistapa. Panostin siihen ja aloin todella innostua vuoden 2009 puolivälissä."

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### npm:n luomisesta Node.js:n johtajuuteen {#from-npms-creation-to-nodejs-leadership}

Isaac loi npm:n syyskuussa 2009, ja ensimmäinen käyttökelpoinen versio julkaistiin vuoden 2010 alussa. Tämä pakettihallinta täytti Node.js:n keskeisen tarpeen, sillä se mahdollisti kehittäjille koodin helpon jakamisen ja uudelleenkäytön. [Node.js Wikipedia-sivu](https://en.wikipedia.org/wiki/Node.js) -dokumentin mukaan "Tammikuussa 2010 Node.js-ympäristöön esiteltiin pakettihallinta nimeltä npm. Paketinhallinta mahdollistaa ohjelmoijien julkaista ja jakaa Node.js-paketteja sekä niihin liittyvää lähdekoodia, ja se on suunniteltu yksinkertaistamaan pakettien asennusta, päivittämistä ja poistamista."

Kun Ryan Dahl jäi pois Node.js:ltä tammikuussa 2012, Isaac otti projektin vetäjän tehtävät. Kuten [hänen yhteenvetonsa](https://izs.me/resume) -sivulla todettiin, hän "johti useiden Node.js:n perustavanlaatuisten ydin-API-rajapintojen kehitystä, mukaan lukien CommonJS-moduulijärjestelmä, tiedostojärjestelmä-API:t ja striimit" ja "toimi projektin BDFL:nä (Benevolent Dictator For Life) kahden vuoden ajan varmistaen jatkuvasti parantuvan laadun ja luotettavan käännösprosessin Node.js-versioille v0.6–v0.10".

Isaac ohjasi Node.js:n läpi keskeisen kasvukauden ja asetti standardit, jotka muovaavat alustaa edelleen. Myöhemmin hän perusti npm, Inc:n vuonna 2014 tukemaan npm-rekisteriä, jota hän oli aiemmin ajanut yksin.

Kiitämme Isaacia hänen valtavasta panoksestaan JavaScriptiin ja jatkamme monien hänen luomiensa pakettien käyttöä. Hänen työnsä on muuttanut tapaa, jolla rakennamme ohjelmistoja ja kuinka miljoonat kehittäjät jakavat koodia maailmanlaajuisesti.

## Koodin takana oleva arkkitehti: Nick Baughin matka {#the-architect-behind-the-code-nick-baughs-journey}

Avoimen lähdekoodin menestyksemme ytimessä on Nick Baugh, Forward Emailin perustaja ja omistaja. Hänen työnsä JavaScriptin parissa kestää lähes 20 vuotta ja on muokannut sitä, kuinka monet kehittäjät rakentavat sovelluksia. Hänen avoimen lähdekoodin matkansa osoittaa sekä teknistä taitoa että yhteisön johtajuutta.

### Expressin tekninen komitea ja keskeiset panokset {#express-technical-committee-and-core-contributions}

Nickin web-kehysosaaminen ansaitsi hänelle paikan [Express tekninen komitea](https://expressjs.com/en/resources/community.html) -listalla, jossa hän auttoi yhden käytetyimmän Node.js-kehyksen kanssa. Nick on nyt listattu passiiviseksi jäseneksi [Express yhteisön sivu](https://expressjs.com/en/resources/community.html) -listalla.

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

[Express tekninen komitea](https://expressjs.com/en/resources/community.html) -ryhmän jäsenenä Nick osoitti suurta huomiota yksityiskohtiin esimerkiksi `req.originalUrl` -dokumentaation selventämisessä ja moniosaisten lomakkeiden käsittelyongelmien korjaamisessa.

### Koa-kehyksen kontribuutiot {#koa-framework-contributions}

Nickin työ [Koa-kehys](https://github.com/koajs/koa):n parissa – TJ Holowaychukin kehittämässä modernissa ja kevyemmässä Express-vaihtoehdossa – osoittaa entisestään hänen sitoutumisensa parempiin web-kehitystyökaluihin. Hänen Koa-panoksensa sisältävät sekä ongelmia että koodia pull-pyyntöjen kautta, virheiden käsittelyn, sisällöntyypin hallinnan ja dokumentaation parannuksia.

Hänen työnsä sekä Expressissä että Koassa antaa hänelle ainutlaatuisen näkemyksen Node.js-verkkokehityksestä, mikä auttaa tiimiämme luomaan paketteja, jotka toimivat hyvin useiden kehysekosysteemien kanssa.

### Yksittäisestä avustajasta organisaation johtajaksi {#from-individual-contributor-to-organization-leader}

Se, mikä alkoi olemassa olevien projektien auttamisena, kasvoi kokonaisten pakettiekosysteemien luomiseksi ja ylläpitämiseksi. Nick perusti useita GitHub-organisaatioita – mukaan lukien [Mökki](https://github.com/cabinjs), [Roskapostiskanneri](https://github.com/spamscanner), [Lähetä sähköpostia eteenpäin](https://github.com/forwardemail), [Poika](https://github.com/ladjs) ja [Bree](https://github.com/breejs) – joista jokainen ratkaisi JavaScript-yhteisön erityistarpeita.

Tämä muutos avustajasta johtajaksi osoittaa Nickin näkemyksen hyvin suunnitellusta ohjelmistosta, joka ratkaisee todelliset ongelmat. Järjestämällä liittyviä paketteja keskittyneiden GitHub-organisaatioiden alle hän on rakentanut työkaluekosysteemejä, jotka toimivat yhdessä ja pysyvät modulaarisina ja joustavina laajemmalle kehittäjäyhteisölle.

## GitHub-organisaatiomme: Innovaatioekosysteemit {#our-github-organizations-ecosystems-of-innovation}

Järjestämme avoimen lähdekoodin työmme keskittyneiden GitHub-organisaatioiden ympärille, joista jokainen ratkaisee erityistarpeet JavaScriptillä. Tämä rakenne luo yhtenäisiä pakettiperheitä, jotka toimivat hyvin yhdessä ja pysyvät modulaarisina.

### Cabin: Rakenteinen lokikirjaus nykyaikaisiin sovelluksiin {#cabin-structured-logging-for-modern-applications}

[Mökin organisaatio](https://github.com/cabinjs) on meidän versiomme yksinkertaisesta ja tehokkaasta sovellusten lokikirjauksesta. Pääpaketilla [`cabin`](https://github.com/cabinjs/cabin) on lähes 900 GitHub-tähteä ja yli 100 000 viikoittaista latausta\[^1]. Cabin tarjoaa jäsennellyn lokikirjauksen, joka toimii suosittujen palveluiden, kuten Sentryn, LogDNA:n ja Papertrailin, kanssa.

Cabinin erityispiirre on sen harkittu API-rajapinta ja laajennusjärjestelmä. Tuetut paketit, kuten [`axe`](https://github.com/cabinjs/axe) Express-väliohjelmistoille ja [`parse-request`](https://github.com/cabinjs/parse-request) HTTP-pyyntöjen jäsennykselle, osoittavat sitoutumisemme kokonaisvaltaisiin ratkaisuihin yksittäisten työkalujen sijaan.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid)-paketti ansaitsee erityismaininnan, sillä sitä on ladattu yli 1,7 miljoonaa kertaa vain kahdessa kuukaudessa\[^2]. Tästä kevyestä MongoDB ObjectID -toteutuksesta on tullut kehittäjien, jotka tarvitsevat tunnisteita ilman täysiä MongoDB-riippuvuuksia, ensisijainen valinta.

### Roskapostiskanneri: Sähköpostin väärinkäytön torjunta {#spam-scanner-fighting-email-abuse}

[Roskapostinlukijaorganisaatio](https://github.com/spamscanner) osoittaa sitoutumisemme todellisten ongelmien ratkaisemiseen. [`spamscanner`](https://github.com/spamscanner/spamscanner) -pääpaketti tarjoaa edistyneen roskapostin tunnistuksen, mutta [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) -paketti on otettu erittäin hyvin käyttöön.

Yli 1,2 miljoonalla latauksella kahdessa kuukaudessa\[^3] `url-regex-safe` korjaa kriittisiä tietoturvaongelmia muissa URL-tunnistuksen säännöllisissä lausekkeissa. Tämä paketti esittelee lähestymistapamme avoimeen lähdekoodiin: yleisen ongelman löytämisen (tässä tapauksessa [RedoS](https://en.wikipedia.org/wiki/ReDoS) haavoittuvuudet URL-validoinnissa), vankan ratkaisun luomisen ja sen huolellisen ylläpidon.

### Bree: Nykyaikainen työaikataulutus työntekijäsäikeillä {#bree-modern-job-scheduling-with-worker-threads}

[Bree organisaatio](https://github.com/breejs) on vastauksemme yleiseen Node.js:n haasteeseen: luotettavaan töiden ajoitukseen. Pääpaketti [`bree`](https://github.com/breejs/bree), jossa on yli 3 100 GitHub-tähteä, tarjoaa modernin töiden ajoittajan, joka käyttää Node.js:n työsäikeitä paremman suorituskyvyn ja luotettavuuden saavuttamiseksi.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Mikä tekee Breesta eron muista ajoittajista, kuten Agenda:

* **Ei ulkoisia riippuvuuksia**: Toisin kuin Agenda, joka tarvitsee MongoDB:tä, Bree ei vaadi Redisiä tai MongoDB:tä työtilan hallintaan.
* **Työsäikeet**: Bree käyttää Node.js:n työsäikeitä hiekkalaatikkoprosesseille, mikä parantaa eristystä ja suorituskykyä.
* **Yksinkertainen API**: Bree tarjoaa yksityiskohtaista hallintaa yksinkertaisesti, mikä helpottaa monimutkaisten aikataulutustarpeiden toteuttamista.
* **Sisäänrakennettu tuki**: Oletusarvoisesti mukana ovat esimerkiksi sujuva uudelleenlataus, cron-työt, päivämäärät ja käyttäjäystävälliset ajat.

Bree on keskeinen osa [forwardemail.net](https://github.com/forwardemail/forwardemail.net) -palvelua, ja se hoitaa kriittisiä taustatehtäviä, kuten sähköpostien käsittelyä, siivousta ja aikataulun mukaista ylläpitoa. Breen käyttö sähköpostin edelleenlähetyksessä osoittaa sitoutumisemme omien työkalujemme käyttöön tuotannossa ja varmistaa, että ne täyttävät korkeat luotettavuusstandardit.

Käytämme ja arvostamme myös muita loistavia työsäikepaketteja, kuten [allas](https://github.com/piscinajs/piscina), ja HTTP-asiakasohjelmia, kuten [yksitoista](https://github.com/nodejs/undici). Piscina, kuten Bree, käyttää Node.js:n työsäikeitä tehokkaaseen tehtävien käsittelyyn. Kiitämme [Matthew Hill](https://github.com/mcollina):a, joka ylläpitää sekä undiciä että piscinaa, hänen merkittävästä panoksestaan Node.js:ään. Matteo toimii Node.js:n teknisessä ohjausryhmässä ja on parantanut huomattavasti HTTP-asiakasohjelman ominaisuuksia Node.js:ssä.

### Sähköpostin edelleenlähetys: Avoimen lähdekoodin sähköpostiinfrastruktuuri {#forward-email-open-source-email-infrastructure}

Kunnianhimoisin projektimme on [Lähetä sähköpostia eteenpäin](https://github.com/forwardemail), avoimen lähdekoodin sähköpostipalvelu, joka tarjoaa sähköpostin edelleenlähetystä, tallennusta ja API-palveluita. Pääarkistolla on yli 1 100 GitHub-tähteä\[^4], mikä osoittaa yhteisön arvostusta tälle vaihtoehdolle omille sähköpostipalveluille.

Tämän organisaation [`preview-email`](https://github.com/forwardemail/preview-email)-paketti, jota ladattiin yli 2,5 miljoonaa kertaa kahdessa kuukaudessa\[^5], on tullut välttämättömäksi työkaluksi sähköpostimallien kanssa työskenteleville kehittäjille. Tarjoamalla yksinkertaisen tavan esikatsella sähköposteja kehitysvaiheessa, se ratkaisee yleisen ongelman sähköpostisovellusten kehittämisessä.

### Lad: Olennaiset Koa-apuohjelmat ja -työkalut {#lad-essential-koa-utilities-and-tools}

[Poikajärjestö](https://github.com/ladjs) tarjoaa kokoelman keskeisiä apuohjelmia ja työkaluja, jotka keskittyvät ensisijaisesti Koa-kehysekosysteemin parantamiseen. Nämä paketit ratkaisevat yleisiä web-kehityksen haasteita ja ne on suunniteltu toimimaan saumattomasti yhdessä ja samalla itsenäisesti hyödyllisinä.

#### koa-better-error-handler: Parannettu virheiden käsittely Koalle {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tarjoaa paremman virheidenkäsittelyratkaisun Koa-sovelluksille. Yli 50 GitHub-tähden ansiosta tämä paketti saa `ctx.throw` tuottamaan käyttäjäystävällisiä virheilmoituksia ja korjaa samalla useita Koan sisäänrakennetun virheenkäsittelijän rajoituksia:

* Havaitsee ja käsittelee oikein Node.js DNS-virheet, Mongoose-virheet ja Redis-virheet
* Käyttää [Puomi](https://github.com/hapijs/boom) -protokollaa johdonmukaisten ja hyvin muotoiltujen virhevastausten luomiseen
* Säilyttää otsikot (toisin kuin Koan sisäänrakennettu käsittelijä)
* Säilyttää asianmukaiset tilakoodit oletusarvoisen 500:n sijaan
* Tukee flash-viestejä ja istunnon säilytystä
* Tarjoaa HTML-virheluetteloita validointivirheille
* Tukee useita vastaustyyppejä (HTML, JSON ja pelkkä teksti)

Tämä paketti on erityisen hyödyllinen käytettynä yhdessä [`koa-404-handler`](https://github.com/ladjs/koa-404-handler):n kanssa Koa-sovellusten kattavaan virheiden hallintaan.

#### passi: Todennus käyttäjälle Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) laajentaa suosittua Passport.js-todennusväliohjelmistoa tietyillä parannuksilla nykyaikaisia verkkosovelluksia varten. Tämä paketti tukee useita todennusstrategioita suoraan paketista:

* Paikallinen todennus sähköpostitse
* Kirjaudu sisään Applella
* GitHub-todennus
* Google-todennus
* Kertakäyttösalasanan (OTP) todennus

Paketti on hyvin muokattavissa, joten kehittäjät voivat säätää kenttien nimiä ja lauseita vastaamaan sovelluksensa vaatimuksia. Se on suunniteltu integroitumaan saumattomasti Mongoosen kanssa käyttäjien hallintaa varten, mikä tekee siitä ihanteellisen ratkaisun Koa-pohjaisille sovelluksille, jotka tarvitsevat vankan todennuksen.

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

### Käyttöaika: Avoimen lähdekoodin käyttöajan seuranta {#upptime-open-source-uptime-monitoring}

[Päätösajan organisaatio](https://github.com/upptime) edustaa sitoutumistamme läpinäkyvään ja avoimen lähdekoodin valvontaan. Pääasiallisessa [`upptime`](https://github.com/upptime/upptime) -arkistossa on yli 13 000 GitHub-tähteä, mikä tekee siitä yhden suosituimmista projekteista, joihin osallistumme. Upptime tarjoaa GitHub-pohjaisen käyttöajan valvonnan ja tilasivun, joka toimii kokonaan ilman palvelinta.

Käytämme Upptimea omalla statussivullamme osoitteessa <https://status.forwardemail.net>, jonka lähdekoodi on saatavilla osoitteessa <https://github.com/forwardemail/status.forwardemail.net>.

Upptimesta erikoisen tekee sen arkkitehtuuri:

* **100 % avoimen lähdekoodin**: Jokainen komponentti on täysin avoimen lähdekoodin ja muokattavissa.
* **GitHubin tarjoama**: Hyödyntää GitHubin toimintoja, ongelmia ja sivuja palvelimettomassa valvontaratkaisussa.
* **Palvelinta ei tarvita**: Toisin kuin perinteiset valvontatyökalut, Upptime ei vaadi palvelimen suorittamista tai ylläpitoa.
* **Automaattinen tilasivu**: Luo kauniin tilasivun, jota voidaan isännöidä GitHub-sivuilla.
* **Tehokkaat ilmoitukset**: Integroituu useisiin ilmoituskanaviin, kuten sähköpostiin, tekstiviesteihin ja Slackiin.

Parantaaksemme käyttäjäkokemusta olemme integroineet [@octokit/core](https://github.com/octokit/core.js/) -koodin forwardemail.net-koodikantaan, jotta reaaliaikaiset tilannepäivitykset ja ongelmat näkyvät suoraan verkkosivustollamme. Tämä integraatio tarjoaa käyttäjillemme selkeän läpinäkyvyyden mahdollisten ongelmien varalta koko palvelussamme (verkkosivusto, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree jne.) välittömien ilmoitusten, merkkikuvakkeiden muutosten, varoitusvärien ja muiden avulla.

@octokit/core-kirjaston avulla voimme noutaa reaaliaikaisia tietoja Upptime GitHub -tietovarastosta, käsitellä niitä ja näyttää ne käyttäjäystävällisellä tavalla. Kun jossakin palvelussa on katkos tai suorituskyky on heikentynyt, käyttäjät saavat välittömästi ilmoituksen visuaalisilla ilmaisimilla ilman, että heidän on poistuttava pääsovelluksesta. Tämä saumaton integrointi varmistaa, että käyttäjillämme on aina ajan tasalla olevaa tietoa järjestelmämme tilasta, mikä lisää läpinäkyvyyttä ja luottamusta.

Upptime on omaksunut sadat organisaatiot, jotka etsivät läpinäkyvää ja luotettavaa tapaa seurata palveluitaan ja viestiä tilasta käyttäjille. Projektin menestys osoittaa, kuinka voimaa on rakentaa työkaluja, jotka hyödyntävät olemassa olevaa infrastruktuuria (tässä tapauksessa GitHubia) yleisten ongelmien ratkaisemiseksi uusilla tavoilla.

## Panoksemme sähköpostin edelleenlähetysekosysteemiin {#our-contributions-to-the-forward-email-ecosystem}

Vaikka kehittäjät käyttävät avoimen lähdekoodin pakettejamme maailmanlaajuisesti, ne muodostavat myös oman Forward Email -palvelumme perustan. Tämä kaksoisrooli – sekä näiden työkalujen luojina että käyttäjinä – antaa meille ainutlaatuisen näkökulman heidän todelliseen sovellukseensa ja edistää jatkuvaa parantamista.

### Paketeista tuotantoon {#from-packages-to-production}

Matka yksittäisistä pakkauksista yhtenäiseen tuotantojärjestelmään edellyttää huolellista integrointia ja laajentamista. Sähköpostin edelleenlähettämisessä tämä prosessi sisältää:

* **Mukautetut laajennukset**: Sähköpostikohtaisten laajennusten rakentaminen avoimen lähdekoodin paketteihimme, jotka vastaavat ainutlaatuisiin vaatimuksiimme.
* **Integraatiomallit**: Mallien kehittäminen näiden pakettien vuorovaikutukselle tuotantoympäristössä.
* **Suorituskyvyn optimoinnit**: Suorituskyvyn pullonkaulojen tunnistaminen ja ratkaiseminen, joita esiintyy vain skaalautuvasti.
* **Tietojen suojaamisen vahvistaminen**: Sähköpostin käsittelyyn ja käyttäjätietojen suojaukseen liittyvien lisätietoturvakerrosten lisääminen.

Tämä työ edustaa tuhansia tunteja kehitystyötä itse ydinpakettien lisäksi, ja tuloksena on vankka, suojattu sähköpostipalvelu, joka hyödyntää avoimen lähdekoodin panostemme parhaita puolia.

### Palautejärjestelmä {#the-feedback-loop}

Ehkä arvokkain puoli omien pakettiemme käytössä tuotannossa on sen luoma palautesilmukka. Kun kohtaamme rajoituksia tai reunatapauksia Forward Emailissa, emme vain korjaa niitä paikallisesti – parannamme taustalla olevia paketteja, mikä hyödyttää sekä palveluamme että laajempaa yhteisöä.

Tämä lähestymistapa on johtanut lukuisiin parannuksiin:

* **Breen sulava sulkeminen**: Forward Emailin tarve nollakäyttöisille käyttöönotuksille johti parannettuihin sulaviin sulkemisominaisuuksiin Breessä.
* **Roskapostiskannerin kuvioiden tunnistus**: Forward Emailissa havaitut reaalimaailman roskapostikuviot ovat vaikuttaneet roskapostiskannerin tunnistusalgoritmeihin.
* **Cabinin suorituskyvyn optimoinnit**: Suuren volyymin lokitietojen kerääminen tuotannossa paljasti Cabinissa optimointimahdollisuuksia, jotka hyödyttävät kaikkia käyttäjiä.

Ylläpitämällä tätä kiertokulkua avoimen lähdekoodin työmme ja tuotantopalvelumme välillä varmistamme, että pakettimme pysyvät käytännöllisinä, taisteluissa testatuina ratkaisuina teoreettisten toteutusten sijaan.

## Sähköpostin edelleenlähetyksen ydinperiaatteet: Erinomaisuuden perusta {#forward-emails-core-principles-a-foundation-for-excellence}

Sähköpostin edelleenlähetys on suunniteltu tiettyjen ydinperiaatteiden mukaisesti, jotka ohjaavat kaikkia kehityspäätöksiämme. Nämä periaatteet, jotka on yksityiskohtaisesti kuvattu [verkkosivuilla](/blog/docs/best-quantum-safe-encrypted-email-service#principles) -linkissämme, varmistavat, että palvelumme pysyy kehittäjäystävällisenä, turvallisena ja keskittyy käyttäjien yksityisyyteen.

### Aina kehittäjäystävällinen, tietoturvakeskeinen ja läpinäkyvä {#always-developer-friendly-security-focused-and-transparent}

Ensimmäinen ja tärkein periaatteemme on luoda ohjelmistoja, jotka ovat kehittäjäystävällisiä ja säilyttävät korkeimmat turvallisuus- ja yksityisyysstandardit. Uskomme, että teknisen huippuosaamisen ei tulisi koskaan tapahtua käytettävyyden kustannuksella ja että läpinäkyvyys rakentaa luottamusta yhteisöömme.

Tämä periaate näkyy yksityiskohtaisessa dokumentaatiossamme, selkeissä virheilmoituksissamme ja avoimessa viestinnässämme sekä onnistumisista että haasteista. Tekemällä koko koodikantaamme avoimen lähdekoodin, kutsumme tarkastukseen ja yhteistyöhön, mikä vahvistaa sekä ohjelmistojamme että laajempaa ekosysteemiä.

### Aikaansaattujen ohjelmistokehitysperiaatteiden noudattaminen {#adherence-to-time-tested-software-development-principles}

Noudatamme useita vakiintuneita ohjelmistokehityksen periaatteita, jotka ovat osoittaneet arvonsa vuosikymmenten aikana:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Huolenaiheiden erottaminen Model-View-Controller-mallin avulla
* **[Unix-filosofia](https://en.wikipedia.org/wiki/Unix_philosophy)**: Modulaaristen komponenttien luominen, jotka tekevät yhden asian hyvin
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Yksinkertaisena ja suoraviivaisena
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Älä toista itseäsi, edistä koodin uudelleenkäyttöä
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Et tule tarvitsemaan sitä, vältä ennenaikaista optimointia
* **[Kaksitoista tekijää](https://12factor.net/)**: Parhaiden käytäntöjen noudattaminen nykyaikaisten, skaalautuvien sovellusten rakentamiseen
* **[Occamin partakone](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Yksinkertaisimman ratkaisun valitseminen, joka täyttää vaatimukset
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Käytämme omia tuotteitamme laajasti

Nämä periaatteet eivät ole vain teoreettisia käsitteitä, vaan ne on sisällytetty päivittäisiin kehityskäytäntöihimme. Noudatuksemme Unix-filosofiaan näkyy esimerkiksi npm-pakettimme rakenteesta: pieniä, kohdennettuja moduuleja, jotka voidaan koota yhteen ratkaisemaan monimutkaisia ongelmia.

### Kohdistamalla sotkuiset ja itseohjautuneet kehittäjät {#targeting-the-scrappy-bootstrapped-developer}

Kohdistamme erityisesti aloittelevat, omavaraiset ja [ramen-kannattava](https://www.paulgraham.com/ramenprofitable.html) kehittäjät. Tämä keskittyminen muokkaa kaikkea hinnoittelumallista teknisiin päätöksiimme. Ymmärrämme tuotteiden rakentamisen haasteet rajallisilla resursseilla, koska olemme itse kokeneet saman.

Tämä periaate on erityisen tärkeä siinä, miten lähestymme avointa lähdekoodia. Luomme ja ylläpidämme paketteja, jotka ratkaisevat todellisia ongelmia kehittäjille ilman yritysbudjettia, jolloin tehokkaat työkalut ovat kaikkien saatavilla heidän resursseistaan riippumatta.

### Käytännön periaatteet: Sähköpostin edelleenlähetyskoodisto {#principles-in-practice-the-forward-email-codebase}

Nämä periaatteet näkyvät selvästi Forward Email -koodikannassa. Package.json-tiedostomme paljastaa harkitun valikoiman riippuvuuksia, joista jokainen on valittu perusarvojemme mukaiseksi:

* Turvallisuuteen keskittyvät paketit, kuten `mailauth` sähköpostin todennukseen
* Kehittäjäystävälliset työkalut, kuten `preview-email` helpompaan virheenkorjaukseen
* Modulaariset komponentit, kuten Sindre Sorhusin erilaiset `p-*` -apuohjelmat

Noudattamalla näitä periaatteita johdonmukaisesti ajan mittaan olemme rakentaneet palvelun, johon kehittäjät voivat luottaa sähköpostiinfrastruktuurissaan. Se on turvallinen, luotettava ja avoimen lähdekoodin yhteisön arvojen mukainen.

### Sisäänrakennettu tietosuoja {#privacy-by-design}

Tietosuoja ei ole jälkikäteen tai markkinointiominaisuus Forward Emailille – se on suunnittelun perusperiaate, joka kertoo palvelumme ja koodimme kaikista näkökohdista:

* **Zero-Access Encryption**: Olemme ottaneet käyttöön järjestelmiä, jotka tekevät käyttäjien sähköpostien lukemisen teknisesti mahdottomaksi.
* **Minimaalinen tiedonkeruu**: Keräämme vain palvelumme tarjoamiseen tarvittavat tiedot, ei mitään muuta.
* **Läpinäkyvät käytännöt**: Tietosuojakäytäntömme on kirjoitettu selkeällä ja ymmärrettävällä kielellä ilman lakikieltä.
* **Avoimen lähdekoodin varmennus**: Avoimen lähdekoodin koodikantaamme avulla tietoturvatutkijat voivat varmentaa tietosuojaväitteemme.

Tämä sitoumus ulottuu avoimen lähdekoodin paketteihimme, jotka on suunniteltu turvallisuuden ja tietosuojan parhailla käytännöillä alusta alkaen.

### Kestävä avoimen lähdekoodin {#sustainable-open-source}

Uskomme, että avoimen lähdekoodin ohjelmistot tarvitsevat kestäviä malleja menestyäkseen pitkällä aikavälillä. Lähestymistapamme sisältää:

* **Kaupallinen tuki**: Tarjoamme ensiluokkaista tukea ja palveluita avoimen lähdekoodin työkaluillemme.
* **Tasapainoinen lisensointi**: Käytämme lisenssejä, jotka suojaavat sekä käyttäjien vapauksia että projektin kestävyyttä.
* **Yhteisön osallistaminen**: Aktiivinen vuorovaikutus avustajien kanssa tukevan yhteisön rakentamiseksi.
* **Läpinäkyvät etenemissuunnitelmat**: Jaamme kehityssuunnitelmiamme, jotta käyttäjät voivat suunnitella niitä niiden mukaisesti.

Keskittymällä kestävyyteen varmistamme, että avoimen lähdekoodin panoksemme voivat edelleen kasvaa ja kehittyä ajan myötä sen sijaan, että laiminlyödään.

## Numerot eivät valehtele: Hämmästyttävät npm-lataustilastomme {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Kun puhumme avoimen lähdekoodin ohjelmistojen vaikutuksista, lataustilastot tarjoavat konkreettisen osoituksen omaksumisesta ja luottamuksesta. Monet paketeista, joita autamme ylläpitämään, ovat saavuttaneet mittakaavan, jota harvat avoimen lähdekoodin projektit koskaan saavuttavat, ja yhdistettyjen latausten määrä on miljardeja.

![Suosituimmat npm-paketit latausten mukaan](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### Vaikutuksemme lintuperspektiivistä {#a-birds-eye-view-of-our-impact}

Vain kahden kuukauden helmikuusta maaliskuuhun 2025 välisenä aikana parhaimmat paketit, joihin osallistumme ja autamme ylläpitämään tallennettuja huikeita latausmääriä:

* **[superagentti](https://www.npmjs.com/package/superagent)**: 84 575 829 latausta\[^7] (alkuperäinen luoja TJ Holowaychuk)
* **[super testi](https://www.npmjs.com/package/supertest)**: 76 432 591 latausta\[^8] (alkuperäinen luoja TJ Holowaychuk)
* **[myös](https://www.npmjs.com/package/koa)**: 28 539 295 latausta\[^34] (alkuperäinen luoja TJ Holowaychuk)
* **[@koa/reititin](https://www.npmjs.com/package/@koa/router)**: 11 007 327 latausta\[^35]
* **[koa-reititin](https://www.npmjs.com/package/koa-router)**: 3 498 918 latausta\[^36]
* **[url-säännöllinen lauseke](https://www.npmjs.com/package/url-regex)**: 2 819 520 lataukset\[^37]
* **[esikatselu sähköposti](https://www.npmjs.com/package/preview-email)**: 2 500 000 latausta\[^9]
* **[hytti](https://www.npmjs.com/package/cabin)**: 1 800 000 latausta\[^10]
* **[@breejs/myöhemmin](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 latausta\[^38]
* **[sähköpostimallit](https://www.npmjs.com/package/email-templates)**: 1 128 139 latausta\[^39]
* **[pääsypolut](https://www.npmjs.com/package/get-paths)**: 1 124 686 latausta\[^40]
* **[url-regulex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 latausta\[^11]
* **[dotenv-parse-muuttujat](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 lataukset\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 latausta\[^42]
* **[roskapostin skanneri](https://www.npmjs.com/package/spamscanner)**: 145 000 latausta\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 latausta\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

Nämä eivät ole vain vaikuttavia lukuja – ne edustavat todellisia kehittäjiä, jotka ratkaisevat todellisia ongelmia koodilla, jota autamme ylläpitämään. Jokainen lataus on esimerkki, jossa nämä paketit ovat auttaneet jotakuta rakentamaan jotain merkityksellistä harrastajaprojekteista miljoonien käyttämiin yrityssovelluksiin.

![Pakkausluokat Jakelu](/img/art/category_pie_chart.svg)

### Päivittäinen vaikutus laajassa mittakaavassa {#daily-impact-at-scale}

Päivittäiset latausmallit paljastavat tasaisen, suuren käyttömäärän, ja huippujen mukaan latauksia on miljoonia päivässä\[^13]. Tämä yhdenmukaisuus kertoo näiden pakettien vakaudesta ja luotettavuudesta – kehittäjät eivät vain kokeile niitä, vaan he integroivat ne ydintoimintoihinsa ja ovat riippuvaisia niistä päivästä toiseen.

Viikoittaiset latauskäyttäytymiset osoittavat vieläkin vaikuttavampia lukuja, pysyen jatkuvasti kymmenien miljoonien latausten ympärillä viikossa\[^14]. Tämä edustaa valtavaa jalanjälkeä JavaScript-ekosysteemissä, sillä näitä paketteja käytetään tuotantoympäristöissä ympäri maailmaa.

### Raakojen numeroiden tuolla puolen {#beyond-the-raw-numbers}

Vaikka lataustilastot ovat itsessään vaikuttavia, ne kertovat syvemmän tarinan luottamuksesta, jota yhteisö kohdistaa näihin paketteihin. Pakettien säilyttäminen tässä mittakaavassa edellyttää horjumatonta sitoutumista:

* **Takaisinpäin yhteensopivuus**: Muutoksia on harkittava huolellisesti, jotta vältetään olemassa olevien toteutusten rikkoutuminen.
* **Tietoturva**: Koska miljoonat sovellukset ovat riippuvaisia näistä paketeista, tietoturvahaavoittuvuuksilla voi olla kauaskantoisia seurauksia.
* **Suorituskyky**: Tässä mittakaavassa jopa pienillä suorituskyvyn parannuksilla voi olla merkittäviä kokonaishyötyjä.
* **Dokumentaatio**: Selkeä ja kattava dokumentaatio on välttämätöntä kaiken tasoisten kehittäjien käyttämille paketeille.

Latausmäärien jatkuva kasvu ajan myötä heijastaa onnistumista näiden sitoumusten täyttämisessä ja luottamuksen rakentamisessa kehittäjäyhteisöön luotettavien, hyvin ylläpidettyjen pakettien avulla.

## Ekosysteemin tukeminen: Avoimen lähdekoodin sponsorointimme {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Sen lisäksi, että annamme suoran panoksen JavaScript-ekosysteemiin, olemme ylpeitä voidessamme sponsoroida merkittäviä Node.js-avustajia, joiden työ muodostaa perustan monille nykyaikaisille sovelluksille. Sponsoreihimme kuuluvat:

### Andris Reinman: Sähköpostiinfrastruktuurin edelläkävijä {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) on [Nodemailer](https://github.com/nodemailer/nodemailer):n luoja. __PROTECTED_LINK_267__ on Node.js:n suosituin sähköpostin lähetyskirjasto, jota ladataan yli 14 miljoonaa kertaa viikossa\[^15]. Hänen työnsä ulottuu muihin kriittisiin sähköpostiinfrastruktuurikomponentteihin, kuten [SMTP-palvelin](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) ja [Villiankka](https://github.com/nodemailer/wildduck).

Sponsorointimme auttaa varmistamaan näiden keskeisten työkalujen jatkuvan ylläpidon ja kehittämisen, jotka tukevat sähköpostiviestintää lukemattomille Node.js-sovelluksille, mukaan lukien oma Forward Email -palvelumme.

### Sindre Sorhus: Apuohjelmapakettien mestari {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) on yksi JavaScript-ekosysteemin tuotteliaimmista avoimen lähdekoodin kehittäjistä, ja hänellä on yli 1 000 npm-pakettia nimessään. Hänen apuohjelmansa, kuten [p-kartta](https://github.com/sindresorhus/p-map), [p-yritä uudelleen](https://github.com/sindresorhus/p-retry) ja [on-stream](https://github.com/sindresorhus/is-stream), ovat Node.js-ekosysteemin perusrakennuspalikoita.

Sponsoroimalla Sindren työtä autamme ylläpitämään näiden kriittisten apuohjelmien kehitystä, jotka tekevät JavaScript-kehityksestä tehokkaampaa ja luotettavampaa.

Nämä sponsoroinnit kuvastavat sitoutumistamme laajempaan avoimen lähdekoodin ekosysteemiin. Ymmärrämme, että oma menestymisemme rakentuu näiden ja muiden tekijöiden luomalle perustalle, ja olemme sitoutuneet varmistamaan koko ekosysteemin kestävyyden.

## JavaScript-ekosysteemin tietoturvahaavoittuvuuksien paljastaminen {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Sitoutumisemme avoimeen lähdekoodiin ulottuu ominaisuuksien kehittämisen lisäksi myös tietoturva-aukkojen tunnistamiseen ja korjaamiseen, jotka voivat vaikuttaa miljooniin kehittäjiin. Useat merkittävimmistä panoksistamme JavaScript-ekosysteemiin ovat olleet turvallisuuden alalla.

### Koa-reitittimen pelastus {#the-koa-router-rescue}

Helmikuussa 2019 Nick tunnisti kriittisen ongelman suositun koa-router-paketin ylläpidossa. Kuten hän [uutisoi Hacker News](https://news.ycombinator.com/item?id=19156707) totesi, alkuperäinen ylläpitäjä oli hylännyt paketin, minkä vuoksi tietoturva-aukkoihin ei puututtu eikä yhteisölle jäänyt päivityksiä.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

Vastauksena tähän Nick loi [@koa/reititin](https://github.com/koajs/router) ja auttoi tiedottamaan yhteisölle tilanteesta. Hän on ylläpitänyt tätä kriittistä pakettia siitä lähtien varmistaen, että Koa-käyttäjillä on turvallinen ja hyvin ylläpidetty reititysratkaisu.

### ReDoS-haavoittuvuuksien korjaaminen {#addressing-redos-vulnerabilities}

Vuonna 2020 Nick tunnisti ja korjasi kriittisen [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) haavoittuvuuden laajalti käytetyssä `url-regex` paketissa. Tämä haavoittuvuus ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) voi antaa hyökkääjille mahdollisuuden aiheuttaa palvelunestohyökkäyksiä antamalla erityisesti muotoiltua syötettä, joka voi aiheuttaa katastrofaalisen takaisinjäljityksen säännöllisessä lausekkeessa.

Sen sijaan, että Nick olisi vain korjannut olemassa olevan paketin, hän loi [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), täysin uudelleenkirjoitetun toteutuksen, joka korjaa haavoittuvuuden säilyttäen samalla yhteensopivuuden alkuperäisen API:n kanssa. Hän julkaisi myös [kattava blogikirjoitus](/blog/docs/url-regex-javascript-node-js), jossa selitettiin haavoittuvuus ja sen lieventämismenetelmät.

Tämä työ osoittaa lähestymistapamme turvallisuuteen: ei vain korjata ongelmia, vaan kouluttaa yhteisöä ja tarjota vankkoja vaihtoehtoja, jotka estävät samanlaisia ongelmia tulevaisuudessa.

### Node.js:n ja Chromiumin tietoturvan puolustaminen {#advocating-for-nodejs-and-chromium-security}

Nick on myös aktiivisesti ajanut tietoturvaparannuksia laajemmassa ekosysteemissä. Elokuussa 2020 hän tunnisti Node.js:ssä merkittävän tietoturvaongelman, joka liittyi sen HTTP-otsikoiden käsittelyyn. Ongelmasta raportoitiin julkaisussa [Rekisteri](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Tämä ongelma, joka johtui Chromiumin korjaustiedostosta, saattaa antaa hyökkääjille mahdollisuuden ohittaa turvatoimenpiteet. Nickin tuki auttoi varmistamaan, että ongelmaan puututtiin ripeästi, mikä suojasi miljoonia Node.js-sovelluksia mahdolliselta hyväksikäytöltä.

### Npm-infrastruktuurin suojaaminen {#securing-npm-infrastructure}

Myöhemmin samassa kuussa Nick tunnisti toisen kriittisen tietoturvaongelman, tällä kertaa npm:n sähköpostiinfrastruktuurissa. Kuten [Rekisteri](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) -julkaisussa raportoitiin, npm ei toteuttanut DMARC-, SPF- ja DKIM-sähköpostin todennusprotokollia oikein, minkä vuoksi hyökkääjät saattoivat lähettää tietojenkalasteluviestejä, jotka näyttivät tulevan npm:ltä.

Nickin raportti johti parannuksiin npm:n sähköpostin suojausasennossa, mikä suojaa miljoonia kehittäjiä, jotka luottavat npm:ään pakettien hallinnassa, mahdollisilta tietojenkalasteluhyökkäyksiä vastaan.

## Panoksemme sähköpostin edelleenlähetysekosysteemiin {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email on rakennettu useiden kriittisten avoimen lähdekoodin projektien päälle, mukaan lukien Nodemailer, WildDuck ja mailauth. Tiimimme on osallistunut merkittävästi näihin projekteihin auttaen tunnistamaan ja korjaamaan syvällisiä ongelmia, jotka vaikuttavat sähköpostin toimitukseen ja turvallisuuteen.

### Nodemailerin ydintoimintojen parantaminen {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) on sähköpostin lähettämisen selkäranka Node.js:ssä, ja panoksemme ovat auttaneet tekemään siitä entistä vankemman:

* **SMTP-palvelimen parannukset**: Olemme korjanneet jäsennysvirheitä, datavirran käsittelyongelmia ja TLS-määritysongelmia SMTP-palvelinkomponentissa\[^16]\[^17].
* **Sähköpostin jäsentimen parannukset**: Olemme korjanneet merkkijonojen dekoodausvirheitä ja jäsenninongelmia, jotka saattoivat aiheuttaa sähköpostin käsittelyvirheitä\[^18]\[^19].

Nämä panokset varmistavat, että Nodemailer pysyy luotettavana perustana sähköpostin käsittelylle Node.js-sovelluksissa, mukaan lukien sähköpostin edelleenlähetys.

### Sähköpostin todennuksen tehostaminen Mailauthin avulla {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tarjoaa kriittisen sähköpostin todennustoiminnon, ja panoksemme ovat parantaneet sen ominaisuuksia merkittävästi:

* **DKIM-vahvistuksen parannukset**: Havaitsimme ja raportoimme, että X/Twitterillä oli DNS-välimuistiongelmia, jotka aiheuttivat DKIM-virheen lähtevissä viesteissä. Raportoimme tästä Hacker Onella\[^20].
* **DMARC- ja ARC-parannukset**: Olemme korjanneet DMARC- ja ARC-vahvistuksen ongelmia, jotka saattoivat johtaa virheellisiin todennustuloksiin\[^21]\[^22].
* **Suorituskyvyn optimoinnit**: Olemme tehneet optimointeja, jotka parantavat sähköpostin todennusprosessien suorituskykyä\[^23]\[^24]\[^25]\[^26].

Nämä parannukset auttavat varmistamaan, että sähköpostin todennus on tarkka ja luotettava ja suojaa käyttäjiä tietojenkalastelu- ja huijaushyökkäyksiltä.

### Tärkeimmät käyttöajan parannukset {#key-upptime-enhancements}

Avustuksemme Upptimeen ovat:

* **SSL-varmenteen valvonta**: Lisäsimme toiminnon SSL-varmenteen vanhenemisen valvontaan, mikä estää odottamattomat käyttökatkokset vanhentuneiden varmenteiden vuoksi\[^27].
* **Useiden tekstiviestinumeroiden tuki**: Otimme käyttöön tuen useiden tiimin jäsenten hälyttämiseen tekstiviestitse häiriöistä, mikä parantaa vasteaikoja\[^28].
* **IPv6-tarkistusten korjaukset**: Korjasimme IPv6-yhteystarkistuksiin liittyviä ongelmia, mikä varmistaa tarkemman valvonnan nykyaikaisissa verkkoympäristöissä\[^29].
* **Tumma/vaalea tila -tuki**: Lisäsimme teematuen parantaaksemme tilasivujen käyttökokemusta\[^31].
* **Parempi TCP-ping-tuki**: Paransimme TCP-ping-toimintoa luotettavamman yhteystestauksen tarjoamiseksi\[^32].

Nämä parannukset eivät hyödy ainoastaan Forward Emailin tilanvalvontaa, vaan ne ovat saatavilla koko Upptime-käyttäjien yhteisölle, mikä osoittaa sitoutumisemme parantaa työkaluja, joista olemme riippuvaisia.

## Kaiken yhdistävä tekijä: Mukautettu koodi skaalautuvasti {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Vaikka npm-pakettimme ja panoksemme olemassa oleviin projekteihin ovat merkittäviä, juuri nämä komponentit integroiva mukautettu koodi todella osoittaa teknisen asiantuntemuksemme. Forward Email -koodikanta edustaa vuosikymmenen kehitystyötä, joka ulottuu vuoteen 2017, jolloin projekti alkoi nimellä [ilmainen sähköpostin edelleenlähetys](https://github.com/forwardemail/free-email-forwarding) ennen kuin se yhdistettiin monorepoon.

### Massiivinen kehitysponnistus {#a-massive-development-effort}

Tämän mukautetun integrointikoodin laajuus on vaikuttava:

* **Kokonaismuutoksia**: Yli 3 217 committia
* **Koodikannan koko**: Yli 421 545 riviä koodia JavaScript-, Pug-, CSS- ja JSON-tiedostoissa\[^33]

Tämä edustaa tuhansia tunteja kehitystyötä, virheenkorjausistuntoja ja suorituskyvyn optimointia. Se on "salainen kastike", joka muuttaa yksittäiset paketit yhtenäiseksi, luotettavaksi palveluksi, jota tuhannet asiakkaat käyttävät päivittäin.

### Ydinriippuvuuksien integrointi {#core-dependencies-integration}

Forward Email -koodikanta yhdistää lukuisia riippuvuuksia saumattomaksi kokonaisuudeksi:

* **Sähköpostin käsittely**: Integroi Nodemailerin lähettämiseen, SMTP-palvelimen vastaanottamiseen ja Mailparserin jäsentämiseen.
* **Todennus**: Käyttää Mailauth-palvelua DKIM-, SPF-, DMARC- ja ARC-vahvistukseen.
* **DNS-selvitys**: Hyödyntää Tangerine-palvelua DNS-over-HTTPS:ään globaalilla välimuistilla.
* **MX-yhteys**: Käyttää mx-connectia Tangerine-integraation kanssa luotettavien sähköpostipalvelinyhteyksien luomiseksi.
* **Työn aikataulutus**: Käyttää Bree-palvelua luotettavaan taustatehtävien käsittelyyn työsäikeiden kanssa.
* **Mallipohjat**: Käyttää sähköpostimalleja verkkosivuston tyylitiedostojen uudelleenkäyttöön asiakasviestinnässä.
* **Sähköpostin tallennus**: Toteuttaa yksilöllisesti salatut SQLite-postilaatikot käyttämällä parempia sqlite3-monisalauksia ChaCha20-Poly1305-salauksella kvanttiturvallisen yksityisyyden takaamiseksi, varmistaen täydellisen eristyksen käyttäjien välillä ja sen, että vain käyttäjällä on pääsy postilaatikkoonsa.

Jokainen näistä integraatioista edellyttää reunatapausten, suorituskykyvaikutusten ja turvallisuusnäkökohtien huolellista harkintaa. Tuloksena on vankka järjestelmä, joka käsittelee miljoonia sähköpostitapahtumia luotettavasti. SQLite-toteutuksellamme hyödynnetään myös msgpackria tehokkaaseen binääriserialisointiin ja WebSocketsia (ws:n kautta) reaaliaikaisiin tilapäivityksiin koko infrastruktuurissamme.

### DNS-infrastruktuuri Tangerinen ja mx-connectin avulla {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Emailin infrastruktuurin kriittinen osa on DNS-ratkaisujärjestelmämme, joka on rakennettu kahden keskeisen paketin ympärille:

* **[Mandariini](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js DNS-over-HTTPS -toteutuksemme tarjoaa valmiin korvaajan tavalliselle DNS-resolverille, ja siinä on sisäänrakennetut uudelleenyritykset, aikakatkaisut, älykäs palvelimen rotaatio ja välimuistituki.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Tämä paketti muodostaa TCP-yhteydet MX-palvelimiin ottamalla kohdeverkkotunnuksen tai sähköpostiosoitteen, selvittämällä sopivat MX-palvelimet ja muodostamalla niihin yhteyden prioriteettijärjestyksessä.

Olemme integroineet Tangerinen mx-connectin kanssa [pull-pyyntö #4](https://github.com/zone-eu/mx-connect/pull/4), varmistaen sovelluskerroksen DNS:n HTTP-pyyntöjen kautta koko Forward Email -palvelun ajan. Tämä tarjoaa globaalin välimuistin DNS:lle skaalautuvasti 1:1-yhdenmukaisuudella millä tahansa alueella, sovelluksessa tai prosessissa – kriittisen tärkeää luotettavalle sähköpostin toimitukselle hajautetussa järjestelmässä.


## Yritysvaikutus: Avoimesta lähdekoodista kriittisiin ratkaisuihin {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Vuosikymmenen mittaisen avoimen lähdekoodin kehitystyömme huipentuma on mahdollistanut Forward Emailin palvelemisen paitsi yksittäisten kehittäjien myös suurten yritysten ja oppilaitosten kanssa, jotka muodostavat itse avoimen lähdekoodin liikkeen selkärangan.


### Case-tutkimukset kriittisestä sähköposti-infrastruktuurista {#case-studies-in-mission-critical-email-infrastructure}

Sitoutumisemme luotettavuuteen, yksityisyyteen ja avoimen lähdekoodin periaatteisiin on tehnyt Forward Emailista luotettavan valinnan organisaatioille, joilla on vaativia sähköpostivaatimuksia:

* **Oppilaitokset**: Kuten yksityiskohtaisesti kerrotaan [alumnien sähköpostin edelleenlähetystä koskevassa tapaustutkimuksessamme]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) -linkin kautta. Suuret yliopistot luottavat infrastruktuuriimme ylläpitääkseen elinikäisiä yhteyksiä satoihin tuhansiin alumneihin luotettavien sähköpostin edelleenlähetyspalveluiden kautta.

* **Yritystason Linux-ratkaisut**: [Kanoninen Ubuntu sähköposti yritystapaustutkimus](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) osoittaa, kuinka avoimen lähdekoodin lähestymistapamme sopii täydellisesti yritystason Linux-toimittajien tarpeisiin ja tarjoaa heille tarvittavaa läpinäkyvyyttä ja hallintaa.

* **Avoimen lähdekoodin säätiöt**: Ehkäpä kaikkein validoin on kumppanuutemme Linux Foundationin kanssa, kuten [Linux Foundationin sähköpostin yritystapaustutkimus](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) dokumentoi. Palvelumme mahdollistaa viestinnän juuri Linux-kehitystä valvovalle organisaatiolle.

Monien vuosien huolella ylläpidettyjen avoimen lähdekoodin pakettiemme ansiosta olemme pystyneet rakentamaan sähköpostipalvelun, joka tukee nyt juuri niitä yhteisöjä ja organisaatioita, jotka kannattavat avoimen lähdekoodin ohjelmistoja. Tämä täyden ympyrän matka – yksittäisten pakettien tuottamisesta yritystason sähköpostiinfrastruktuurin tehostamiseen avoimen lähdekoodin johtajille – edustaa ohjelmistokehitykseen liittyvän lähestymistapamme lopullista validointia.

## Avoimen lähdekoodin vuosikymmen: Katse tulevaan {#a-decade-of-open-source-looking-forward}

Kun katsomme taaksepäin vuosikymmenen avoimen lähdekoodin panoksia ja eteenpäin seuraaviin kymmeneen vuoteen, olemme täynnä kiitollisuutta yhteisöstä, joka on tukenut työtämme, ja innostusta tulevasta.

Matkamme yksittäisistä pakettien tekijöistä suurten yritysten ja avoimen lähdekoodin säätiöiden käyttämän kattavan sähköpostiinfrastruktuurin ylläpitäjiin on ollut merkittävä. Se on osoitus avoimen lähdekoodin kehityksen voimasta ja vaikutuksista, joita harkituilla, hyvin ylläpidetyillä ohjelmistoilla voi olla laajempaan ekosysteemiin.

Tulevina vuosina olemme sitoutuneet:

* **Jatkamme olemassa olevien pakettiemme ylläpitoa ja parantamista** varmistaen, että ne pysyvät luotettavina työkaluina kehittäjille maailmanlaajuisesti.
* **Laajennamme osallistumistamme kriittisiin infrastruktuurihankkeisiin**, erityisesti sähköpostin ja tietoturvan aloilla.
* **Parantamme Forward Emailin ominaisuuksia** säilyttäen samalla sitoutumisemme yksityisyyteen, tietoturvaan ja läpinäkyvyyteen.
* **Tuemme seuraavan sukupolven avoimen lähdekoodin kehittäjiä** mentoroinnin, sponsoroinnin ja yhteisötyön avulla.

Uskomme, että ohjelmistokehityksen tulevaisuus on avoin, yhteistyökykyinen ja luottamuksen pohjalle rakennettu. Jatkamalla korkealaatuisten, turvallisuuteen keskittyvien pakettien lisäämistä JavaScript-ekosysteemiin, toivomme saavamme pienen osuuden tulevaisuuden rakentamisessa.

Kiitos kaikille, jotka ovat käyttäneet pakettejamme, osallistuneet projekteihimme, raportoineet ongelmista tai vain levittäneet sanaa työstämme. Tukesi on mahdollistanut tämän vuosikymmenen vaikuttamisen, ja olemme innoissamme nähdessämme, mitä voimme saada yhdessä aikaan seuraavan kymmenen vuoden aikana.

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
\[^12]: npm-lataustilastot roskapostin skannerille, helmikuu-maaliskuu 2025
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
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
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