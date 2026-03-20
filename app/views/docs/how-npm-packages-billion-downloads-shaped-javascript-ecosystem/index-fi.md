# Kymmenen Vuoden Vaikutus: Kuinka npm-pakettimme Saavuttivat 1 Miljardia Latausta ja Muokkasivat JavaScriptiä {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Edelläkävijät, jotka Luottavat Meihin: Isaac Z. Schlueter ja Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npm:n Luomisesta Node.js:n Johtajuuteen](#from-npms-creation-to-nodejs-leadership)
* [Koodin Arkkitehti: Nick Baugh'n Matka](#the-architect-behind-the-code-nick-baughs-journey)
  * [Expressin Tekninen Komitea ja Ydinpanokset](#express-technical-committee-and-core-contributions)
  * [Koa-kehyksen Panokset](#koa-framework-contributions)
  * [Yksittäisestä Panostajasta Organisaation Johtajaksi](#from-individual-contributor-to-organization-leader)
* [GitHub-organisaatiomme: Innovaation Ekosysteemit](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Rakenteellinen Lokitus Moderneille Sovelluksille](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Sähköpostin Väärinkäytön Torjunta](#spam-scanner-fighting-email-abuse)
  * [Bree: Moderni Työaikataulutus Worker Threadseillä](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Avoimen Lähdekoodin Sähköpostin Infrastruktuuri](#forward-email-open-source-email-infrastructure)
  * [Lad: Keskeiset Koa-apuvälineet ja Työkalut](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Avoimen Lähdekoodin Käytettävyysvalvonta](#upptime-open-source-uptime-monitoring)
* [Panoksemme Forward Email -ekosysteemiin](#our-contributions-to-the-forward-email-ecosystem)
  * [Paketeista Tuotantoon](#from-packages-to-production)
  * [Palautejärjestelmä](#the-feedback-loop)
* [Forward Emailin Ydinarvot: Perusta Erinomaiseen](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Aina Kehittäjäystävällinen, Turvallisuuskeskeinen ja Läpinäkyvä](#always-developer-friendly-security-focused-and-transparent)
  * [Ajan Koeteltujen Ohjelmistokehityksen Periaatteiden Noudattaminen](#adherence-to-time-tested-software-development-principles)
  * [Kohdistettu Sitkeälle, Itse Rahoitetulle Kehittäjälle](#targeting-the-scrappy-bootstrapped-developer)
  * [Periaatteet Käytännössä: Forward Emailin Koodikanta](#principles-in-practice-the-forward-email-codebase)
  * [Tietosuoja Suunnittelusta Alkaen](#privacy-by-design)
  * [Kestävä Avoin Lähdekoodi](#sustainable-open-source)
* [Numerot Eivät Valehtele: Hämmästyttävät npm-lataustilastomme](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Yleiskatsaus Vaikutukseemme](#a-birds-eye-view-of-our-impact)
  * [Päivittäinen Vaikutus Suurissa Mittakaavoissa](#daily-impact-at-scale)
  * [Pelkkien Lukujen Tuolla Puolen](#beyond-the-raw-numbers)
* [Ekosysteemin Tukeminen: Avoimen Lähdekoodin Sponsorointimme](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Sähköpostin Infrastruktuurin Edelläkävijä](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Apupakettien Mestarimieli](#sindre-sorhus-utility-package-mastermind)
* [Turvallisuusaukkojen Paljastaminen JavaScript-ekosysteemissä](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Routerin Pelastus](#the-koa-router-rescue)
  * [ReDoS-haavoittuvuuksien Käsittely](#addressing-redos-vulnerabilities)
  * [Node.js:n ja Chromiumin Turvallisuuden Puolustaminen](#advocating-for-nodejs-and-chromium-security)
  * [npm-infrastruktuurin Turvaaminen](#securing-npm-infrastructure)
* [Panoksemme Forward Email -ekosysteemiin](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailerin Ydintoiminnallisuuden Parantaminen](#enhancing-nodemailers-core-functionality)
  * [Sähköpostin Todentamisen Edistäminen Mailauthilla](#advancing-email-authentication-with-mailauth)
  * [Keskeiset Upptimen Parannukset](#key-upptime-enhancements)
* [Liima, Joka Pitää Kaiken Koossa: Räätälöity Koodi Suurissa Mittakaavoissa](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Massiivinen Kehitystyö](#a-massive-development-effort)
  * [Ydiriippuvuuksien Integrointi](#core-dependencies-integration)
  * [DNS-infrastruktuuri Tangerinen ja mx-connectin Kanssa](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Yritysvaikutus: Avoimesta Lähdekoodista Liiketoimintakriittisiin Ratkaisuihin](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Tapaustutkimuksia Liiketoimintakriittisestä Sähköpostin Infrastruktuurista](#case-studies-in-mission-critical-email-infrastructure)
* [Kymmenen Vuotta Avoimen Lähdekoodin Parissa: Katsaus Tulevaan](#a-decade-of-open-source-looking-forward)
## Esipuhe {#foreword}

[JavaScriptin](https://en.wikipedia.org/wiki/JavaScript) ja [Node.js:n](https://en.wikipedia.org/wiki/Node.js) maailmassa jotkut paketit ovat välttämättömiä—niitä ladataan miljoonia kertoja päivittäin ja ne pyörittävät sovelluksia ympäri maailmaa. Näiden työkalujen takana ovat kehittäjät, jotka keskittyvät avoimen lähdekoodin laatuun. Tänään näytämme, miten tiimimme auttaa rakentamaan ja ylläpitämään npm-paketteja, jotka ovat muodostuneet keskeisiksi osiksi JavaScript-ekosysteemiä.


## Edelläkävijät, jotka luottavat meihin: Isaac Z. Schlueter ja Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Olemme ylpeitä saadessamme käyttäjäksemme [Isaac Z. Schlueterin](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac loi [npm:n](https://en.wikipedia.org/wiki/Npm_\(software\)) ja auttoi rakentamaan [Node.js:n](https://en.wikipedia.org/wiki/Node.js). Hänen luottamuksensa Forward Emailiin osoittaa sitoutumisemme laatuun ja turvallisuuteen. Isaac käyttää Forward Emailia useilla domaineilla, mukaan lukien izs.me.

Isaacin vaikutus JavaScriptiin on valtava. Vuonna 2009 hän oli yksi ensimmäisistä, joka näki Node.js:n potentiaalin, työskennellen yhdessä [Ryan Dahlin](https://en.wikipedia.org/wiki/Ryan_Dahl) kanssa, joka loi alustan. Kuten Isaac sanoi [Increment-lehden haastattelussa](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Tämän hyvin pienen yhteisön keskellä, jossa joukko ihmisiä yritti keksiä, miten palvelinpuolen JS saataisiin toimimaan, Ryan Dahl tuli esiin Noden kanssa, joka oli selvästi oikea lähestymistapa. Panin panokseni siihen ja osallistuin hyvin aktiivisesti noin vuoden 2009 puolivälissä."

> \[!NOTE]
> Node.js:n historiasta kiinnostuneille on saatavilla erinomaisia dokumentteja, jotka kertovat sen kehityksestä, mukaan lukien [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) ja [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahlin [henkilökohtainen verkkosivusto](https://tinyclouds.org/) sisältää myös arvokkaita näkemyksiä hänen työstään.

### Npm:n luomisesta Node.js:n johtajuuteen {#from-npms-creation-to-nodejs-leadership}

Isaac loi npm:n syyskuussa 2009, ja ensimmäinen käyttökelpoinen versio julkaistiin vuoden 2010 alussa. Tämä pakettienhallinta täytti keskeisen tarpeen Node.js:ssä, mahdollistaen kehittäjien jakaa ja käyttää koodia helposti uudelleen. [Node.js:n Wikipedia-sivun](https://en.wikipedia.org/wiki/Node.js) mukaan "Tammikuussa 2010 Node.js-ympäristöön otettiin käyttöön pakettienhallinta nimeltä npm. Pakettienhallinta antaa ohjelmoijille mahdollisuuden julkaista ja jakaa Node.js-paketteja sekä niihin liittyvää lähdekoodia, ja se on suunniteltu helpottamaan pakettien asennusta, päivitystä ja poistamista."

Kun Ryan Dahl vetäytyi Node.js:n kehityksestä tammikuussa 2012, Isaac otti projektin johtajuuden. Kuten hänen [ansioluettelossaan](https://izs.me/resume) todetaan, hän "Johti useiden keskeisten Node.js-ydin-API:en kehitystä, mukaan lukien CommonJS-moduulijärjestelmä, tiedostojärjestelmä-API:t ja streamit" ja "Toimi projektin BDFL:nä (Benevolent Dictator For Life) 2 vuoden ajan varmistaen jatkuvasti kasvavan laadun ja luotettavan rakennusprosessin Node.js-versioille v0.6–v0.10."

Isaac ohjasi Node.js:n keskeisen kasvuvaiheen, asettaen standardeja, jotka muokkaavat alustaa edelleen tänä päivänä. Hän perusti myöhemmin npm, Inc.:n vuonna 2014 tukemaan npm-rekisteriä, jota hän oli aiemmin pyörittänyt yksin.

Kiitämme Isaacia hänen valtavista panoksistaan JavaScriptiin ja jatkamme monien hänen luomiensa pakettien käyttöä. Hänen työnsä on muuttanut tapaa, jolla rakennamme ohjelmistoja ja miten miljoonat kehittäjät jakavat koodia maailmanlaajuisesti.


## Koodin arkkitehti: Nick Baughin matka {#the-architect-behind-the-code-nick-baughs-journey}

Avoimen lähdekoodin menestyksemme ytimessä on Nick Baugh, Forward Emailin perustaja ja omistaja. Hänen työnsä JavaScriptin parissa kattaa lähes 20 vuotta ja on muokannut lukemattomien kehittäjien tapaa rakentaa sovelluksia. Hänen avoimen lähdekoodin matkansa osoittaa sekä teknistä taitoa että yhteisön johtajuutta.

### Expressin tekninen komitea ja ydspanokset {#express-technical-committee-and-core-contributions}

Nickin web-kehysosaaminen ansaitsi hänelle paikan [Expressin teknisessä komiteassa](https://expressjs.com/en/resources/community.html), jossa hän auttoi yhdessä käytetyimmistä Node.js-kehyksistä. Nick on nyt merkitty passiiviseksi jäseneksi [Expressin yhteisösivulla](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express luotiin alun perin TJ Holowaychukin toimesta, tuotteliaan avoimen lähdekoodin kontribuuttorin, joka on muokannut merkittävästi Node.js-ekosysteemiä. Olemme kiitollisia TJ:n perustavanlaatuisesta työstä ja kunnioitamme hänen [päätöstään pitää taukoa](https://news.ycombinator.com/item?id=37687017) laajoista avoimen lähdekoodin panoksistaan.

Expressin teknisen komitean jäsenenä [Express Technical Committee](https://expressjs.com/en/resources/community.html) Nick osoitti suurta tarkkuutta yksityiskohdissa, kuten `req.originalUrl` -dokumentaation selkeyttämisessä ja moniosaisen lomakkeen käsittelyongelmien korjaamisessa.

### Koa Framework Contributions {#koa-framework-contributions}

Nickin työ [Koa-kehyksen](https://github.com/koajs/koa) parissa — modernin, kevyemmän vaihtoehdon Expressille, jonka myös TJ Holowaychuk loi — osoittaa hänen sitoutumisensa parempiin web-kehitystyökaluihin. Hänen Koa-panoksensa sisältävät sekä ongelmien raportointia että koodia pull requestien kautta, käsitellen virheenkäsittelyä, sisältötyyppien hallintaa ja dokumentaation parannuksia.

Hänen työnsä sekä Expressin että Koan parissa antaa hänelle ainutlaatuisen näkemyksen Node.js-verkkokehityksestä, auttaen tiimiämme luomaan paketteja, jotka toimivat hyvin useiden kehys-ekosysteemien kanssa.

### From Individual Contributor to Organization Leader {#from-individual-contributor-to-organization-leader}

Mikä alkoi olemassa olevien projektien auttamisesta, kasvoi kokonaisiksi pakettiekosysteemeiksi. Nick perusti useita GitHub-organisaatioita — mukaan lukien [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) ja [Bree](https://github.com/breejs) — jotka kukin ratkaisevat JavaScript-yhteisön erityistarpeita.

Tämä siirtymä kontribuuttorista johtajaksi osoittaa Nickin vision hyvin suunnitellusta ohjelmistosta, joka ratkaisee todellisia ongelmia. Järjestämällä liittyvät paketit keskittyneiden GitHub-organisaatioiden alle hän on rakentanut työkaluekosysteemejä, jotka toimivat yhdessä pysyen samalla modulaarisina ja joustavina laajemmalle kehittäjäyhteisölle.


## Our GitHub Organizations: Ecosystems of Innovation {#our-github-organizations-ecosystems-of-innovation}

Järjestämme avoimen lähdekoodin työmme keskittyneiden GitHub-organisaatioiden ympärille, jotka kukin ratkaisevat JavaScriptin erityistarpeita. Tämä rakenne luo yhtenäisiä pakettiperheitä, jotka toimivat hyvin yhdessä pysyen samalla modulaarisina.

### Cabin: Structured Logging for Modern Applications {#cabin-structured-logging-for-modern-applications}

[Cabin-organisaatio](https://github.com/cabinjs) on meidän näkemyksemme yksinkertaisesta, tehokkaasta sovelluslokituksesta. Pääasiallisella [`cabin`](https://github.com/cabinjs/cabin) paketilla on lähes 900 GitHub-tähteä ja yli 100 000 viikoittaista latausta\[^1]. Cabin tarjoaa jäsennellyn lokituksen, joka toimii suosittujen palveluiden kuten Sentryn, LogDNAn ja Papertrailin kanssa.

Cabinin erityisyyden muodostaa sen harkittu API ja laajennusjärjestelmä. Tukipaketit kuten [`axe`](https://github.com/cabinjs/axe) Expressin middlewarelle ja [`parse-request`](https://github.com/cabinjs/parse-request) HTTP-pyyntöjen jäsentämiseen osoittavat sitoutumisemme kokonaisvaltaisiin ratkaisuihin erillisten työkalujen sijaan.

[`bson-objectid`](https://github.com/cabinjs/bson-objectid) paketti ansaitsee erityismaininnan, sillä sillä on yli 1,7 miljoonaa latausta vain kahdessa kuukaudessa\[^2]. Tämä kevyt MongoDB ObjectID -toteutus on muodostunut kehittäjien suosikiksi, jotka tarvitsevat tunnisteita ilman täydellisiä MongoDB-riippuvuuksia.

### Spam Scanner: Fighting Email Abuse {#spam-scanner-fighting-email-abuse}

[Spam Scanner -organisaatio](https://github.com/spamscanner) osoittaa sitoutumisemme todellisten ongelmien ratkaisemiseen. Pääasiallinen [`spamscanner`](https://github.com/spamscanner/spamscanner) paketti tarjoaa kehittynyttä sähköpostin roskapostin tunnistusta, mutta [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) paketti on saanut uskomatonta suosiota.

Yli 1,2 miljoonalla latauksella kahdessa kuukaudessa\[^3], `url-regex-safe` korjaa kriittisiä turvallisuusongelmia muissa URL-tunnistuksen säännöllisissä lausekkeissa. Tämä paketti kuvastaa lähestymistapaamme avoimeen lähdekoodiin: löytää yleinen ongelma (tässä tapauksessa [ReDoS](https://en.wikipedia.org/wiki/ReDoS) haavoittuvuudet URL-validoinnissa), luoda vankka ratkaisu ja ylläpitää sitä huolellisesti.
### Bree: Moderni työn ajoitus worker threadien avulla {#bree-modern-job-scheduling-with-worker-threads}

[Bree-organisaatio](https://github.com/breejs) on vastauksemme yleiseen Node.js-haasteeseen: luotettava työn ajoitus. Pääasiallinen [`bree`](https://github.com/breejs/bree) -paketti, jolla on yli 3 100 GitHub-tähteä, tarjoaa modernin työn ajastimen käyttäen Node.js worker threadeja paremman suorituskyvyn ja luotettavuuden saavuttamiseksi.

> \[!NOTE]
> Bree luotiin sen jälkeen, kun autoimme ylläpitämään [Agenda](https://github.com/agenda/agenda) -projektia, soveltaen opittuja asioita paremman työn ajastimen rakentamiseksi. Agenda-panoksemme auttoivat meitä löytämään tapoja parantaa työn ajoitusta.

Mikä erottaa Breen muista ajastimista kuten Agendasta:

* **Ei ulkoisia riippuvuuksia**: Toisin kuin Agenda, joka tarvitsee MongoDB:n, Bree ei vaadi Redis- tai MongoDB-palvelimia työn tilan hallintaan.
* **Worker Threadit**: Bree käyttää Node.js worker threadeja hiekkalaatikkoprosesseihin, tarjoten paremman eristyksen ja suorituskyvyn.
* **Yksinkertainen API**: Bree tarjoaa yksityiskohtaista hallintaa yksinkertaisuudella, tehden monimutkaisten ajoitustarpeiden toteuttamisesta helpompaa.
* **Sisäänrakennettu tuki**: Ominaisuudet kuten sulava uudelleenlataus, cron-työt, päivämäärät ja ihmisläheiset ajat sisältyvät oletuksena.

Bree on keskeinen osa [forwardemail.net](https://github.com/forwardemail/forwardemail.net) -palvelua, hoitaen kriittisiä taustatehtäviä kuten sähköpostin käsittelyä, siivousta ja ajoitettua ylläpitoa. Breen käyttö Forward Emailissa osoittaa sitoutumisemme käyttää omia työkaluja tuotannossa varmistaen niiden korkean luotettavuuden.

Käytämme ja arvostamme myös muita erinomaisia worker thread -paketteja kuten [piscina](https://github.com/piscinajs/piscina) ja HTTP-asiakkaita kuten [undici](https://github.com/nodejs/undici). Piscina, kuten Bree, käyttää Node.js worker threadeja tehokkaaseen tehtävien käsittelyyn. Kiitämme [Matteo Collinaa](https://github.com/mcollina), joka ylläpitää sekä undicia että piscinaa, hänen merkittävistä panoksistaan Node.js:ään. Matteo toimii Node.js:n teknisen ohjauskomitean jäsenenä ja on parantanut merkittävästi HTTP-asiakasominaisuuksia Node.js:ssä.

### Forward Email: Avoimen lähdekoodin sähköpostin infrastruktuuri {#forward-email-open-source-email-infrastructure}

Kehityshankkeistamme kunnianhimoisin on [Forward Email](https://github.com/forwardemail), avoimen lähdekoodin sähköpostipalvelu, joka tarjoaa sähköpostin edelleenlähetyksen, tallennuksen ja API-palvelut. Päävarastolla on yli 1 100 GitHub-tähteä\[^4], mikä osoittaa yhteisön arvostuksen tätä vaihtoehtoa omistettuihin sähköpostipalveluihin kohtaan.

Tämän organisaation [`preview-email`](https://github.com/forwardemail/preview-email) -paketti, jolla on yli 2,5 miljoonaa latausta kahden kuukauden aikana\[^5], on muodostunut olennaiseksi työkaluksi kehittäjille, jotka työskentelevät sähköpostipohjien kanssa. Tarjoamalla yksinkertaisen tavan esikatsella sähköposteja kehityksen aikana, se ratkaisee yleisen kipupisteen sähköpostia tukevien sovellusten rakentamisessa.

### Lad: Välttämättömät Koa-apuvälineet ja työkalut {#lad-essential-koa-utilities-and-tools}

[Lad-organisaatio](https://github.com/ladjs) tarjoaa kokoelman välttämättömiä apuvälineitä ja työkaluja, jotka keskittyvät ensisijaisesti Koa-kehyksen ekosysteemin parantamiseen. Nämä paketit ratkaisevat yleisiä web-kehityksen haasteita ja on suunniteltu toimimaan saumattomasti yhdessä säilyttäen samalla itsenäisen hyödyllisyyden.

#### koa-better-error-handler: Parannettu virheenkäsittely Koalle {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) tarjoaa paremman virheenkäsittelyratkaisun Koa-sovelluksille. Yli 50 GitHub-tähden arvoinen paketti saa `ctx.throw`-kutsun tuottamaan käyttäjäystävällisiä virheilmoituksia samalla kun se korjaa useita Koa:n sisäänrakennetun virheenkäsittelijän rajoituksia:

* Havaitsee ja käsittelee oikein Node.js:n DNS-virheitä, Mongoose-virheitä ja Redis-virheitä
* Käyttää [Boomia](https://github.com/hapijs/boom) johdonmukaisten, hyvin muotoiltujen virhevastausten luomiseen
* Säilyttää otsikot (toisin kuin Koa:n sisäänrakennettu käsittelijä)
* Säilyttää asianmukaiset tilakoodit sen sijaan, että oletusarvoisesti käyttäisi 500:aa
* Tukee flash-viestejä ja istunnon säilyttämistä
* Tarjoaa HTML-virhelistoja validointivirheille
* Tukee useita vastaustyyppejä (HTML, JSON ja pelkkä teksti)
Tämä paketti on erityisen arvokas käytettäessä yhdessä [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) kanssa kattavaan virheiden hallintaan Koa-sovelluksissa.

#### passport: Autentikointi Ladille {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) laajentaa suositun Passport.js-autentikointiväliohjelman nykyaikaisten web-sovellusten erityisillä parannuksilla. Tämä paketti tukee useita autentikointistrategioita suoraan laatikosta:

* Paikallinen autentikointi sähköpostilla
* Kirjautuminen Applella
* GitHub-autentikointi
* Google-autentikointi
* Kertakäyttöinen salasana (OTP) -autentikointi

Paketti on erittäin muokattavissa, jolloin kehittäjät voivat säätää kenttien nimiä ja lauseita sovelluksensa vaatimusten mukaisesti. Se on suunniteltu integroitumaan saumattomasti Mongooseen käyttäjähallintaa varten, tehden siitä ihanteellisen ratkaisun Koa-pohjaisille sovelluksille, jotka tarvitsevat vankan autentikoinnin.

#### graceful: Tyylikäs sovelluksen sammutus {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) ratkaisee kriittisen haasteen Node.js-sovellusten tyylikkäässä sammutuksessa. Yli 70 GitHub-tähdellä tämä paketti varmistaa, että sovelluksesi voi sulkeutua siististi menettämättä dataa tai jättämättä yhteyksiä roikkumaan. Keskeisiä ominaisuuksia ovat:

* Tuki HTTP-palvelimien (Express/Koa/Fastify) tyylikkäälle sulkemiselle
* Tietokantayhteyksien (MongoDB/Mongoose) siisti sammutus
* Redis-asiakkaiden asianmukainen sulkeminen
* Bree-työaikatauluttimien käsittely
* Tuki mukautetuille sammutuskäsittelijöille
* Konfiguroitavat aikakatkaisuasetukset
* Integraatio lokitusjärjestelmiin

Tämä paketti on välttämätön tuotantosovelluksille, joissa odottamattomat sammutukset voivat johtaa datan menetykseen tai vioittumiseen. Toteuttamalla asianmukaiset sammutusmenettelyt `@ladjs/graceful` auttaa varmistamaan sovelluksesi luotettavuuden ja vakauden.

### Upptime: Avoimen lähdekoodin käyttöaikavalvonta {#upptime-open-source-uptime-monitoring}

[Upptime-organisaatio](https://github.com/upptime) edustaa sitoutumistamme läpinäkyvään, avoimen lähdekoodin valvontaan. Pääasiallisella [`upptime`](https://github.com/upptime/upptime) -varastolla on yli 13 000 GitHub-tähteä, mikä tekee siitä yhden suosituimmista projekteista, joihin osallistumme. Upptime tarjoaa GitHubin voimalla toimivan käyttöaikavalvonnan ja tilasivun, joka toimii täysin ilman palvelinta.

Käytämme Upptimea omalla tilasivullamme osoitteessa <https://status.forwardemail.net>, jonka lähdekoodi on saatavilla osoitteessa <https://github.com/forwardemail/status.forwardemail.net>.

Mikä tekee Upptimesta erityisen, on sen arkkitehtuuri:

* **100 % avoimen lähdekoodin**: Jokainen komponentti on täysin avoimen lähdekoodin ja muokattavissa.
* **GitHubin voimalla**: Hyödyntää GitHub Actionsia, Issuesia ja Pagesia palvelimettomaan valvontaratkaisuun.
* **Ei palvelinta vaadita**: Toisin kuin perinteiset valvontatyökalut, Upptime ei vaadi palvelimen ajamista tai ylläpitoa.
* **Automaattinen tilasivu**: Luo kauniin tilasivun, joka voidaan isännöidä GitHub Pagesissa.
* **Tehokkaat ilmoitukset**: Integroituu useisiin ilmoituskanaviin, kuten sähköposti, SMS ja Slack.

Parantaaksemme käyttäjiemme kokemusta, olemme integroineet [@octokit/core](https://github.com/octokit/core.js/) forwardemail.net-koodipohjaan näyttämään reaaliaikaiset tilapäivitykset ja häiriöt suoraan verkkosivustollamme. Tämä integraatio tarjoaa selkeän läpinäkyvyyden käyttäjillemme mahdollisissa ongelmatilanteissa koko pinossamme (Verkkosivusto, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree jne.) välittömillä toast-ilmoituksilla, tunnistekuvakkeen muutoksilla, varoitusväreillä ja muulla.

@octokit/core-kirjasto mahdollistaa reaaliaikaisten tietojen hakemisen Upptime GitHub -varastostamme, niiden käsittelyn ja käyttäjäystävällisen esittämisen. Kun jokin palvelu kokee katkoksia tai suorituskyvyn heikkenemistä, käyttäjät saavat välittömästi visuaaliset ilmoitukset ilman, että heidän tarvitsee poistua pääsovelluksesta. Tämä saumaton integraatio varmistaa, että käyttäjillämme on aina ajantasaiset tiedot järjestelmän tilasta, mikä lisää läpinäkyvyyttä ja luottamusta.

Upptime on otettu käyttöön sadoissa organisaatioissa, jotka etsivät läpinäkyvää ja luotettavaa tapaa valvoa palveluitaan ja viestiä tilasta käyttäjille. Projektin menestys osoittaa työkalujen rakentamisen voiman, jotka hyödyntävät olemassa olevaa infrastruktuuria (tässä tapauksessa GitHubia) ratkaistakseen yleisiä ongelmia uusilla tavoilla.
## Panoksemme Forward Email -ekosysteemiin {#our-contributions-to-the-forward-email-ecosystem}

Vaikka avoimen lähdekoodin pakettejamme käyttävät kehittäjät ympäri maailmaa, ne muodostavat myös oman Forward Email -palvelumme perustan. Tämä kaksoisrooli — sekä työkalujen luojina että käyttäjinä — antaa meille ainutlaatuisen näkökulman niiden käytännön soveltamiseen ja ohjaa jatkuvaa parantamista.

### Paketeista tuotantoon {#from-packages-to-production}

Matka yksittäisistä paketeista yhtenäiseksi tuotantojärjestelmäksi vaatii huolellista integrointia ja laajentamista. Forward Emailin osalta tämä prosessi sisältää:

* **Mukautetut laajennukset**: Forward Email -kohtaiset laajennukset avoimen lähdekoodin paketteihimme, jotka vastaavat ainutlaatuisiin vaatimuksiimme.
* **Integraatiomallit**: Mallien kehittäminen sille, miten nämä paketit toimivat yhdessä tuotantoympäristössä.
* **Suorituskyvyn optimoinnit**: Suorituskykyongelmien tunnistaminen ja ratkaiseminen, jotka ilmenevät vasta suuressa mittakaavassa.
* **Turvallisuuden vahvistaminen**: Lisäturvakerrosten lisääminen erityisesti sähköpostin käsittelyyn ja käyttäjätietojen suojaamiseen.

Tämä työ edustaa tuhansia kehitystunteja ydinkomponenttien ulkopuolella, mikä johtaa vankkaan, turvalliseen sähköpostipalveluun, joka hyödyntää parhaita avoimen lähdekoodin panoksiamme.

### Palautesilmukka {#the-feedback-loop}

Ehkä arvokkain osa omien pakettiemme käyttöä tuotannossa on palautesilmukka, jonka se luo. Kun kohtaamme rajoituksia tai erityistapauksia Forward Emailissa, emme vain korjaa niitä paikallisesti — parannamme taustalla olevia paketteja, hyödyttäen sekä palveluamme että laajempaa yhteisöä.

Tämä lähestymistapa on johtanut lukuisiin parannuksiin:

* **Breen sulava sammutus**: Forward Emailin tarve nollakatkon käyttöönottoihin johti parannettuihin sulavan sammutuksen ominaisuuksiin Breessä.
* **Spam Scannerin kuvion tunnistus**: Forward Emailissa kohdattujen todellisten roskapostikuvioiden perusteella Spam Scannerin tunnistusalgoritmeja on kehitetty.
* **Cabinin suorituskyvyn optimoinnit**: Suurten lokimäärien käsittely tuotannossa paljasti optimointimahdollisuuksia Cabinissa, jotka hyödyttävät kaikkia käyttäjiä.

Ylläpitämällä tätä hyveellistä sykliä avoimen lähdekoodin työn ja tuotantopalvelun välillä varmistamme, että paketit pysyvät käytännöllisinä, koeteltuina ratkaisuna eivätkä pelkkinä teoreettisina toteutuksina.


## Forward Emailin keskeiset periaatteet: Perusta erinomaisuudelle {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email on suunniteltu joukolla keskeisiä periaatteita, jotka ohjaavat kaikkia kehityspäätöksiämme. Nämä periaatteet, jotka on kuvattu tarkemmin [verkkosivuillamme](/blog/docs/best-quantum-safe-encrypted-email-service#principles), varmistavat, että palvelumme pysyy kehittäjäystävällisenä, turvallisena ja käyttäjän yksityisyyteen keskittyvänä.

### Aina kehittäjäystävällinen, turvallisuuteen keskittyvä ja läpinäkyvä {#always-developer-friendly-security-focused-and-transparent}

Ensimmäinen ja tärkein periaatteemme on luoda ohjelmisto, joka on kehittäjäystävällinen säilyttäen samalla korkeimmat turvallisuus- ja yksityisyysstandardit. Uskomme, että tekninen huippuosaaminen ei saa koskaan tapahtua käytettävyyden kustannuksella, ja että läpinäkyvyys rakentaa luottamusta yhteisöömme.

Tämä periaate näkyy yksityiskohtaisessa dokumentaatiossamme, selkeissä virheilmoituksissa ja avoimessa viestinnässä sekä onnistumisista että haasteista. Tekemällä koko koodipohjamme avoimeksi lähdekoodiksi kutsumme tarkasteluun ja yhteistyöhön, vahvistaen sekä ohjelmistoamme että laajempaa ekosysteemiä.

### Ajan koeteltujen ohjelmistokehityksen periaatteiden noudattaminen {#adherence-to-time-tested-software-development-principles}

Noudatamme useita vakiintuneita ohjelmistokehityksen periaatteita, jotka ovat osoittaneet arvonsa vuosikymmenten aikana:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Huolien erottelu Model-View-Controller-mallin avulla
* **[Unix-filosofia](https://en.wikipedia.org/wiki/Unix_philosophy)**: Modulaaristen komponenttien luominen, jotka tekevät yhden asian hyvin
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Pidä asiat yksinkertaisina ja suoraviivaisina
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Älä toista itseäsi, edistää koodin uudelleenkäyttöä
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Et tule tarvitsemaan sitä, välttää ennenaikaista optimointia
* **[Twelve Factor](https://12factor.net/)**: Parhaiden käytäntöjen noudattaminen modernien, skaalautuvien sovellusten rakentamisessa
* **[Occamin partaveitsi](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Yksinkertaisimman vaatimukset täyttävän ratkaisun valinta
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Omien tuotteidemme laaja käyttö
Nämä periaatteet eivät ole pelkkiä teoreettisia käsitteitä — ne ovat sisäänrakennettuja päivittäisiin kehityskäytäntöihimme. Esimerkiksi sitoutumisemme Unix-filosofiaan näkyy siinä, miten olemme jäsentäneet npm-pakettimme: pieniä, keskittyneitä moduuleja, joita voidaan yhdistellä ratkaisemaan monimutkaisia ongelmia.

### Kohdistaminen sitkeälle, omarahoitteiselle kehittäjälle {#targeting-the-scrappy-bootstrapped-developer}

Kohdistamme erityisesti sitkeään, omarahoitteiseen ja [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) kehittäjään. Tämä painopiste muokkaa kaikkea hinnoittelumallistamme teknisiin päätöksiimme. Ymmärrämme tuotteiden rakentamisen haasteet rajallisilla resursseilla, koska olemme itse olleet samassa tilanteessa.

Tämä periaate on erityisen tärkeä lähestymistavassamme avoimeen lähdekoodiin. Luomme ja ylläpidämme paketteja, jotka ratkaisevat todellisia ongelmia kehittäjille ilman yritysbudjetteja, tehden tehokkaista työkaluista kaikkien saatavilla olevia riippumatta heidän resursseistaan.

### Periaatteet käytännössä: Forward Email -koodikanta {#principles-in-practice-the-forward-email-codebase}

Nämä periaatteet näkyvät selvästi Forward Email -koodikannassa. package.json-tiedostomme paljastaa harkitun riippuvuuksien valinnan, joista jokainen on valittu vastaamaan ydinarvojamme:

* Turvallisuuteen keskittyneet paketit kuten `mailauth` sähköpostin todennukseen
* Kehittäjäystävälliset työkalut kuten `preview-email` helpompaan virheenkorjaukseen
* Modulaariset komponentit kuten erilaiset Sindre Sorhuksen `p-*`-apuohjelmat

Noudattamalla näitä periaatteita johdonmukaisesti ajan myötä olemme rakentaneet palvelun, johon kehittäjät voivat luottaa sähköpostin infrastruktuurissaan — turvallinen, luotettava ja avoimen lähdekoodin yhteisön arvojen mukainen.

### Yksityisyys suunnittelussa {#privacy-by-design}

Yksityisyys ei ole Forward Emailille jälkikäteen lisätty tai markkinointiominaisuus — se on perustavanlaatuinen suunnitteluperiaate, joka ohjaa palvelumme ja koodimme jokaista osa-aluetta:

* **Nolla-pääsy-salaus**: Olemme toteuttaneet järjestelmiä, jotka tekevät teknisesti mahdottomaksi lukea käyttäjien sähköposteja.
* **Minimaalinen tiedonkeruu**: Keräämme vain palvelumme tarjoamiseen välttämättömät tiedot, emme mitään ylimääräistä.
* **Läpinäkyvät käytännöt**: Tietosuojakäytäntömme on kirjoitettu selkeällä, ymmärrettävällä kielellä ilman juridista ammattikieltä.
* **Avoimen lähdekoodin varmennus**: Avoin lähdekoodimme mahdollistaa tietoturvatutkijoiden vahvistaa yksityisyysväitteemme.

Tämä sitoutuminen ulottuu myös avoimen lähdekoodin paketteihimme, jotka on suunniteltu turvallisuus- ja yksityisyyskäytäntöjen parhaiden käytäntöjen mukaisesti alusta alkaen.

### Kestävä avoin lähdekoodi {#sustainable-open-source}

Uskomme, että avoimen lähdekoodin ohjelmistojen on oltava kestäviä menestyäkseen pitkällä aikavälillä. Lähestymistapamme sisältää:

* **Kaupallinen tuki**: Tarjoamme premium-tukea ja palveluita avoimen lähdekoodin työkalujemme ympärillä.
* **Tasapainoinen lisensointi**: Käytämme lisenssejä, jotka suojaavat sekä käyttäjien vapauksia että projektin kestävyyttä.
* **Yhteisön osallistaminen**: Osallistumme aktiivisesti yhteisön jäseniin rakentaaksemme tukevan yhteisön.
* **Läpinäkyvät tiekartat**: Jaamme kehityssuunnitelmamme, jotta käyttäjät voivat suunnitella niiden mukaisesti.

Keskittymällä kestävyyteen varmistamme, että avoimen lähdekoodin panoksemme voivat jatkaa kasvuaan ja kehittymistään ajan myötä sen sijaan, että ne jäisivät unohduksiin.


## Numerot eivät valehtele: Hämmästyttävät npm-lataustilastomme {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Kun puhumme avoimen lähdekoodin ohjelmistojen vaikutuksesta, lataustilastot tarjoavat konkreettisen mittarin käyttöönotosta ja luottamuksesta. Monet ylläpitämistämme paketeista ovat saavuttaneet mittakaavan, johon harvat avoimen lähdekoodin projektit koskaan yltävät, yhdistettyjen latausten määrän ollessa miljardeja.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Vaikka olemme ylpeitä siitä, että autamme ylläpitämään useita erittäin ladattuja paketteja JavaScript-ekosysteemissä, haluamme tunnustaa, että monet näistä paketeista ovat alun perin muiden lahjakkaiden kehittäjien luomia. Paketit kuten superagent ja supertest ovat alun perin TJ Holowaychukin luomia, jonka runsaat panokset avoimeen lähdekoodiin ovat olleet keskeisiä Node.js-ekosysteemin muovaamisessa.
### Yleisnäkymä Vaikutuksestamme {#a-birds-eye-view-of-our-impact}

Vain kahden kuukauden aikana helmikuusta maaliskuuhun 2025, tärkeimmät pakettimme, joihin osallistumme ja joita autamme ylläpitämään, rekisteröivät huikeat latausmäärät:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 latausta\[^7] (alkuperäisen luoja TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 latausta\[^8] (alkuperäisen luoja TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28 539 295 latausta\[^34] (alkuperäisen luoja TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 latausta\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 latausta\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 latausta\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2 500 000 latausta\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1 800 000 latausta\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 latausta\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1 128 139 latausta\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1 124 686 latausta\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 latausta\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 latausta\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 latausta\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145 000 latausta\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 latausta\[^30]

> \[!NOTE]
> Useat muut paketit, joita autamme ylläpitämään mutta emme ole luoneet, ovat vielä suuremmilla latausmäärillä, mukaan lukien `form-data` (yli 738M latausta), `toidentifier` (yli 309M latausta), `stackframe` (yli 116M latausta) ja `error-stack-parser` (yli 113M latausta). Olemme kunnia-asiamme osallistua näiden pakettien ylläpitoon kunnioittaen niiden alkuperäisten tekijöiden työtä.

Nämä eivät ole pelkästään vaikuttavia lukuja — ne edustavat todellisia kehittäjiä, jotka ratkaisevat todellisia ongelmia koodilla, jota me autamme ylläpitämään. Jokainen lataus on hetki, jolloin nämä paketit ovat auttaneet jotakuta rakentamaan jotain merkityksellistä, harrastusprojekteista miljoonien käyttämien yrityssovellusten kehittämiseen.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Päivittäinen Vaikutus Suurissa Määrissä {#daily-impact-at-scale}

Päivittäiset latauskuviot paljastavat johdonmukaisen, suuren volyymin käytön, huippujen yltäessä miljooniin latauksiin päivässä\[^13]. Tämä johdonmukaisuus kertoo näiden pakettien vakaudesta ja luotettavuudesta — kehittäjät eivät vain kokeile niitä; he integroivat ne ydintyöprosesseihinsa ja luottavat niihin päivä toisensa jälkeen.

Viikoittaiset latauskuviot näyttävät vielä vaikuttavampia lukuja, pysyen johdonmukaisesti kymmenissä miljoonissa latauksissa viikossa\[^14]. Tämä edustaa valtavaa jalanjälkeä JavaScript-ekosysteemissä, näiden pakettien toimiessa tuotantoympäristöissä ympäri maailmaa.

### Pelkkien Lukujen Tuolla Puolen {#beyond-the-raw-numbers}

Vaikka lataustilastot ovat vaikuttavia itsessään, ne kertovat syvemmän tarinan yhteisön luottamuksesta näihin paketteihin. Pakettien ylläpito näin suuressa mittakaavassa vaatii horjumatonta sitoutumista:

* **Taaksepäin Yhteensopivuus**: Muutokset on harkittava huolellisesti, jotta olemassa olevat toteutukset eivät rikkoudu.
* **Turvallisuus**: Miljoonien sovellusten luottaessa näihin paketteihin, turvallisuusaukot voivat aiheuttaa laajoja seurauksia.
* **Suorituskyky**: Tässä mittakaavassa jopa pienet suorituskyvyn parannukset voivat tuoda merkittäviä kokonaisetuja.
* **Dokumentaatio**: Selkeä ja kattava dokumentaatio on välttämätöntä kehittäjille kaikilla kokemustasoilla.

Latausmäärien johdonmukainen kasvu ajan myötä heijastaa onnistumista näiden sitoumusten täyttämisessä, rakentaen luottamusta kehittäjäyhteisöön luotettavien, hyvin ylläpidettyjen pakettien kautta.
## Ekosysteemin tukeminen: Avoimen lähdekoodin sponsorointimme {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Avoimen lähdekoodin kestävyys ei tarkoita pelkästään koodin kontribuointia — se tarkoittaa myös kehittäjien tukemista, jotka ylläpitävät kriittistä infrastruktuuria.

Suorien panostustemme lisäksi JavaScript-ekosysteemiin olemme ylpeitä sponsoroidessamme merkittäviä Node.js:n kontribuuttoreita, joiden työ muodostaa perustan monille nykyaikaisille sovelluksille. Sponsorointimme kattaa:

### Andris Reinman: Sähköpostin infrastruktuurin edelläkävijä {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) on [Nodemailer](https://github.com/nodemailer/nodemailer) luoja, joka on suosituin sähköpostin lähetyskirjasto Node.js:lle yli 14 miljoonalla viikoittaisella latauksella\[^15]. Hänen työnsä ulottuu myös muihin kriittisiin sähköpostin infrastruktuurikomponentteihin kuten [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) ja [WildDuck](https://github.com/nodemailer/wildduck).

Sponsorointimme auttaa varmistamaan näiden olennaisten työkalujen jatkuvan ylläpidon ja kehityksen, jotka mahdollistavat sähköpostiviestinnän lukemattomille Node.js-sovelluksille, mukaan lukien oma Forward Email -palvelumme.

### Sindre Sorhus: Apupakettien mestari {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) on yksi tuotteliaimmista avoimen lähdekoodin kontribuuttoreista JavaScript-ekosysteemissä, yli 1 000 npm-paketin tekijä. Hänen apuvälineensä kuten [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) ja [is-stream](https://github.com/sindresorhus/is-stream) ovat keskeisiä rakennuspalikoita, joita käytetään laajasti Node.js-ekosysteemissä.

Sponsoroimalla Sindren työtä autamme ylläpitämään näiden kriittisten apuvälineiden kehitystä, jotka tekevät JavaScript-kehityksestä tehokkaampaa ja luotettavampaa.

Nämä sponsoroinnit heijastavat sitoutumistamme laajempaan avoimen lähdekoodin ekosysteemiin. Tunnustamme, että oma menestyksemme rakentuu näiden ja muiden kontribuuttoreiden luomalle perustalle, ja olemme omistautuneet varmistamaan koko ekosysteemin kestävyyden.


## Turva-aukkojen paljastaminen JavaScript-ekosysteemissä {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Sitoutumisemme avoimeen lähdekoodiin ulottuu ominaisuuksien kehittämisen lisäksi myös turvallisuusaukkojen tunnistamiseen ja korjaamiseen, jotka voisivat vaikuttaa miljooniin kehittäjiin. Useimmat merkittävimmistä panoksistamme JavaScript-ekosysteemiin liittyvät turvallisuuteen.

### Koa-routerin pelastus {#the-koa-router-rescue}

Helmikuussa 2019 Nick havaitsi kriittisen ongelman suositun koa-router-paketin ylläpidossa. Kuten hän [raportoi Hacker Newsissa](https://news.ycombinator.com/item?id=19156707), paketti oli hylätty alkuperäisen ylläpitäjän toimesta, jättäen turvallisuusaukot korjaamatta ja yhteisön ilman päivityksiä.

> \[!WARNING]
> Hylätyt paketit, joissa on turvallisuusaukkoja, aiheuttavat merkittäviä riskejä koko ekosysteemille, erityisesti kun niitä ladataan miljoonia kertoja viikossa.

Vastauksena Nick loi [@koa/router](https://github.com/koajs/router) ja auttoi varoittamaan yhteisöä tilanteesta. Hän on ylläpitänyt tätä kriittistä pakettia siitä lähtien varmistaen, että Koa-käyttäjillä on turvallinen ja hyvin ylläpidetty reititysrakenne.

### ReDoS-haavoittuvuuksien korjaaminen {#addressing-redos-vulnerabilities}

Vuonna 2020 Nick tunnisti ja korjasi kriittisen [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) -haavoittuvuuden laajasti käytetyssä `url-regex`-paketissa. Tämä haavoittuvuus ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) saattoi antaa hyökkääjille mahdollisuuden aiheuttaa palvelunestohyökkäyksen toimittamalla erityisesti muotoiltua syötettä, joka aiheutti katastrofaalista takautuvaa etsintää säännöllisessä lausekkeessa.

Sen sijaan, että olisi vain korjannut olemassa olevan paketin, Nick loi [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), täysin uudelleen kirjoitetun toteutuksen, joka korjaa haavoittuvuuden säilyttäen yhteensopivuuden alkuperäisen API:n kanssa. Hän julkaisi myös [laajan blogikirjoituksen](/blog/docs/url-regex-javascript-node-js), jossa selitetään haavoittuvuus ja miten sitä voidaan lieventää.
Tämä työ esittelee lähestymistapamme turvallisuuteen: emme pelkästään korjaa ongelmia, vaan koulutamme yhteisöä ja tarjoamme vahvoja vaihtoehtoja, jotka estävät samanlaisten ongelmien syntymisen tulevaisuudessa.

### Node.js:n ja Chromiumin turvallisuuden puolesta {#advocating-for-nodejs-and-chromium-security}

Nick on myös ollut aktiivinen turvallisuuden parantamisen puolestapuhujana laajemmassa ekosysteemissä. Elokuussa 2020 hän havaitsi merkittävän turvallisuusongelman Node.js:ssä, joka liittyi HTTP-otsikoiden käsittelyyn, ja tästä raportoitiin [The Registerissä](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Tämä ongelma, joka johtui Chromiumin korjauksesta, olisi voinut mahdollistaa hyökkääjien ohittaa turvatoimia. Nickin puolestapuhuminen varmisti, että ongelma korjattiin nopeasti, suojellen miljoonia Node.js-sovelluksia mahdolliselta hyväksikäytöltä.

### npm-infrastruktuurin suojaaminen {#securing-npm-infrastructure}

Saman kuukauden aikana Nick havaitsi toisen kriittisen turvallisuusongelman, tällä kertaa npm:n sähköpostiinfrastruktuurissa. Kuten [The Registerissä](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) raportoitiin, npm ei toteuttanut DMARC-, SPF- ja DKIM-sähköpostin todennusprotokollia asianmukaisesti, mikä olisi voinut sallia hyökkääjien lähettää kalastelusähköposteja, jotka näyttivät tulevan npm:ltä.

Nickin raportti johti parannuksiin npm:n sähköpostiturvallisuudessa, suojellen miljoonia kehittäjiä, jotka luottavat npm:ään pakettien hallinnassa, mahdollisilta kalasteluhyökkäyksiltä.


## Panoksemme Forward Email -ekosysteemiin {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email rakentuu useiden kriittisten avoimen lähdekoodin projektien päälle, mukaan lukien Nodemailer, WildDuck ja mailauth. Tiimimme on tehnyt merkittäviä panoksia näihin projekteihin, auttaen tunnistamaan ja korjaamaan syvällisiä ongelmia, jotka vaikuttavat sähköpostin toimitukseen ja turvallisuuteen.

### Nodemailerin ydintoiminnallisuuden parantaminen {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) on sähköpostin lähettämisen selkäranka Node.js:ssä, ja panoksemme ovat auttaneet tekemään siitä luotettavamman:

* **SMTP-palvelimen parannukset**: Olemme korjanneet jäsentämisvirheitä, virtojen käsittelyongelmia ja TLS-konfiguraatio-ongelmia SMTP-palvelinkomponentissa\[^16]\[^17].
* **Sähköpostin jäsentimen parannukset**: Olemme korjanneet merkkijonojen dekoodausvirheitä ja osoitteiden jäsentämisongelmia, jotka olisivat voineet aiheuttaa sähköpostin käsittelyvirheitä\[^18]\[^19].

Nämä panokset varmistavat, että Nodemailer pysyy luotettavana perustana sähköpostin käsittelyssä Node.js-sovelluksissa, mukaan lukien Forward Email.

### Sähköpostin todennuksen edistäminen Mailauthilla {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) tarjoaa kriittisen sähköpostin todennustoiminnallisuuden, ja panoksemme ovat merkittävästi parantaneet sen kykyjä:

* **DKIM-varmennuksen parannukset**: Löysimme ja raportoitimme, että X/Twitterillä oli DNS-välimuistiongelmia, jotka aiheuttivat DKIM-epäonnistumisia heidän lähtevissä viesteissään, ja raportointi tehtiin Hacker Onelle\[^20].
* **DMARC- ja ARC-parannukset**: Olemme korjanneet DMARC- ja ARC-varmennukseen liittyviä ongelmia, jotka olisivat voineet johtaa virheellisiin todennustuloksiin\[^21]\[^22].
* **Suorituskyvyn optimoinnit**: Olemme osallistuneet optimointeihin, jotka parantavat sähköpostin todennusprosessien suorituskykyä\[^23]\[^24]\[^25]\[^26].

Nämä parannukset auttavat varmistamaan, että sähköpostin todennus on tarkkaa ja luotettavaa, suojellen käyttäjiä kalastelu- ja väärentämishyökkäyksiltä.

### Keskeiset Upptimen parannukset {#key-upptime-enhancements}

Panoksemme Upptimeen sisältävät:

* **SSL-varmenteiden seuranta**: Lisäsimme toiminnallisuuden seurata SSL-varmenteiden vanhenemista, estäen odottamattomat käyttökatkot vanhentuneiden varmenteiden vuoksi\[^27].
* **Useiden SMS-numeroiden tuki**: Toteutimme tuen useiden tiimin jäsenten hälyttämiselle SMS:llä, kun tapahtuu häiriöitä, parantaen reagointiaikoja\[^28].
* **IPv6-tarkistusten korjaukset**: Korjasimme ongelmia IPv6-yhteystarkistuksissa, varmistaen tarkemman valvonnan nykyaikaisissa verkkoympäristöissä\[^29].
* **Tumma/vaalea tila -tuki**: Lisäsimme teematuki parantamaan tilasivujen käyttökokemusta\[^31].
* **Parempi TCP-ping-tuki**: Paransimme TCP-ping-toiminnallisuutta tarjoamaan luotettavampaa yhteyden testausta\[^32].
Nämä parannukset hyödyttävät paitsi Forward Emailin tilan seurantaa myös koko Upptimen käyttäjäyhteisöä, mikä osoittaa sitoutumisemme parantaa työkaluja, joihin luotamme.


## Liima, joka pitää kaiken koossa: Räätälöity koodi suuressa mittakaavassa {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Vaikka npm-pakettimme ja panoksemme olemassa oleviin projekteihin ovat merkittäviä, on räätälöity koodi, joka yhdistää nämä komponentit, se joka todella osoittaa teknisen asiantuntemuksemme. Forward Emailin koodikanta edustaa vuosikymmenen kehitystyötä, joka alkoi vuonna 2017 projektina nimeltä [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) ennen kuin se yhdistettiin monorepoon.

### Massiivinen kehitystyö {#a-massive-development-effort}

Tämän räätälöidyn integraatiokoodin laajuus on vaikuttava:

* **Yhteensä kontribuutioita**: Yli 3 217 committia
* **Koodikannan koko**: Yli 421 545 koodiriviä JavaScript-, Pug-, CSS- ja JSON-tiedostoissa\[^33]

Tämä edustaa tuhansia tunteja kehitystyötä, virheenkorjaussessioita ja suorituskyvyn optimointeja. Se on "salainen kastike", joka muuttaa yksittäiset paketit yhtenäiseksi, luotettavaksi palveluksi, jota tuhannet asiakkaat käyttävät päivittäin.

### Ydiriippuvuuksien integrointi {#core-dependencies-integration}

Forward Emailin koodikanta integroi lukuisia riippuvuuksia saumattomaksi kokonaisuudeksi:

* **Sähköpostin käsittely**: Integroi Nodemailerin lähettämiseen, SMTP Serverin vastaanottamiseen ja Mailparserin jäsentämiseen
* **Todennus**: Käyttää Mailauthia DKIM-, SPF-, DMARC- ja ARC-varmennukseen
* **DNS-ratkaisu**: Hyödyntää Tangerinea DNS-over-HTTPS:lle globaalilla välimuistilla
* **MX-yhteys**: Käyttää mx-connectiä Tangerine-integraatiolla luotettaviin postipalvelinyhteyksiin
* **Työaikataulutus**: Käyttää Bree:tä luotettavaan taustatehtävien käsittelyyn worker-threadien avulla
* **Mallipohjat**: Käyttää email-templatesia uudelleenkäyttämään verkkosivuston tyylit asiakasviestinnässä
* **Sähköpostin tallennus**: Toteuttaa yksilöllisesti salatut SQLite-postilaatikot better-sqlite3-multiple-ciphersillä ChaCha20-Poly1305-salauksella kvanttiturvalliseen yksityisyyteen, varmistaen täydellisen eristyksen käyttäjien välillä ja että vain käyttäjällä on pääsy omaan postilaatikkoonsa

Jokainen näistä integraatioista vaatii huolellista reunaehtojen, suorituskyvyn ja turvallisuuden huomioimista. Tuloksena on vankka järjestelmä, joka käsittelee miljoonia sähköpostitapahtumia luotettavasti. SQLite-toteutuksemme hyödyntää myös msgpackria tehokkaaseen binääriseen serialisointiin ja WebSocketeja (ws:n kautta) reaaliaikaisiin tilapäivityksiin infrastruktuurissamme.

### DNS-infrastruktuuri Tangerinen ja mx-connectin avulla {#dns-infrastructure-with-tangerine-and-mx-connect}

Keskeinen osa Forward Emailin infrastruktuuria on DNS-ratkaisujärjestelmämme, joka rakentuu kahden keskeisen paketin ympärille:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Node.js-pohjainen DNS-over-HTTPS -toteutuksemme tarjoaa suoran korvaajan standardille DNS-resolverille, sisältäen sisäänrakennetut uudelleenyrittämiset, aikakatkaisut, älykkään palvelinpyörityksen ja välimuistituen.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Tämä paketti muodostaa TCP-yhteydet MX-palvelimille, ottaen kohdeverkkotunnuksen tai sähköpostiosoitteen, ratkaisten sopivat MX-palvelimet ja yhdistäen niihin prioriteettijärjestyksessä.

Olemme integroineet Tangerinen mx-connectiin [pull requestin #4](https://github.com/zone-eu/mx-connect/pull/4) kautta, varmistaen sovelluskerroksen DNS-over-HTTP -pyynnöt koko Forward Emailissa. Tämä tarjoaa globaalin välimuistin DNS:lle suuressa mittakaavassa 1:1-yhtenäisyydellä missä tahansa alueella, sovelluksessa tai prosessissa—välttämätöntä luotettavalle sähköpostin toimitukselle hajautetussa järjestelmässä.


## Yritysvaikutus: Avoimen lähdekoodin projekteista kriittisiin ratkaisuihin {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kymmenvuotisen avoimen lähdekoodin kehitysmatkamme huipentuma on mahdollistanut Forward Emailin palvelevan paitsi yksittäisiä kehittäjiä myös suuria yrityksiä ja oppilaitoksia, jotka muodostavat avoimen lähdekoodin liikkeen selkärangan.
### Tapaustutkimuksia kriittisessä sähköpostiinfrastruktuurissa {#case-studies-in-mission-critical-email-infrastructure}

Sitoutumisemme luotettavuuteen, yksityisyyteen ja avoimen lähdekoodin periaatteisiin on tehnyt Forward Emailista luotetun valinnan organisaatioille, joilla on vaativat sähköpostitarpeet:

* **Koulutuslaitokset**: Kuten yksityiskohtaisesti kerrotaan [alumni-sähköpostin edelleenlähetyksen tapaustutkimuksessa](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), suuret yliopistot luottavat infrastruktuuriimme ylläpitääkseen elinikäisiä yhteyksiä satoihin tuhansiin alumneihin luotettavien sähköpostin edelleenlähetyspalveluiden avulla.

* **Yritysten Linux-ratkaisut**: [Canonical Ubuntun sähköpostin yritystapaustutkimus](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) osoittaa, kuinka avoimen lähdekoodin lähestymistapamme sopii täydellisesti yritysten Linux-toimittajien tarpeisiin tarjoten heille vaaditun läpinäkyvyyden ja hallinnan.

* **Avoimen lähdekoodin säätiöt**: Ehkä kaikkein vakuuttavin on yhteistyömme Linux Foundationin kanssa, kuten on dokumentoitu [Linux Foundationin sähköpostin yritystapaustutkimuksessa](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), jossa palvelumme tukee viestintää juuri siinä organisaatiossa, joka ohjaa Linuxin kehitystä.

On kaunista nähdä, miten avoimen lähdekoodin paketit, joita on ylläpidetty huolella monien vuosien ajan, ovat mahdollistaneet sähköpostipalvelun rakentamisen, joka nyt tukee juuri niitä yhteisöjä ja organisaatioita, jotka puolustavat avointa lähdekoodia. Tämä täysi ympyrä – yksittäisistä paketeista yritystason sähköpostiinfrastruktuurin ylläpitoon avoimen lähdekoodin johtajille – edustaa lähestymistapamme lopullista vahvistusta ohjelmistokehityksessä.


## Kymmenen vuotta avointa lähdekoodia: katse tulevaisuuteen {#a-decade-of-open-source-looking-forward}

Kun katsomme taaksepäin kymmenen vuoden avoimen lähdekoodin panostuksiin ja eteenpäin seuraaviin kymmeneen vuoteen, olemme täynnä kiitollisuutta yhteisölle, joka on tukenut työtämme, ja innostusta tulevasta.

Matkamme yksittäisistä pakettien tekijöistä kattavan sähköpostiinfrastruktuurin ylläpitäjiksi, jota käyttävät suuret yritykset ja avoimen lähdekoodin säätiöt, on ollut merkittävä. Se on osoitus avoimen lähdekoodin kehityksen voimasta ja siitä vaikutuksesta, jonka harkittu, hyvin ylläpidetty ohjelmisto voi saada laajempaan ekosysteemiin.

Tulevina vuosina sitoudumme:

* **Jatkamaan olemassa olevien pakettiemme ylläpitoa ja parantamista**, varmistaen, että ne pysyvät luotettavina työkaluina kehittäjille maailmanlaajuisesti.
* **Laajentamaan panostuksiamme kriittisiin infrastruktuurihankkeisiin**, erityisesti sähköpostin ja tietoturvan aloilla.
* **Parantamaan Forward Emailin ominaisuuksia** säilyttäen samalla sitoutumisemme yksityisyyteen, turvallisuuteen ja läpinäkyvyyteen.
* **Tukemaan seuraavaa sukupolvea avoimen lähdekoodin tekijöitä** mentoroinnin, sponsoroinnin ja yhteisön osallistamisen kautta.

Uskomme, että ohjelmistokehityksen tulevaisuus on avoin, yhteistyöhön perustuva ja luottamuksen varaan rakennettu. Jatkamalla korkealaatuisten, tietoturvaan keskittyvien pakettien tarjoamista JavaScript-ekosysteemiin toivomme olevan pieni osa tämän tulevaisuuden rakentamista.

Kiitos kaikille, jotka ovat käyttäneet pakettejamme, osallistuneet projekteihimme, raportoineet ongelmista tai yksinkertaisesti levittäneet sanaa työstämme. Tukenne on tehnyt tämän vaikuttavan vuosikymmenen mahdolliseksi, ja olemme innoissamme siitä, mitä voimme saavuttaa yhdessä seuraavien kymmenen vuoden aikana.

\[^1]: npm-lataustilastot paketille cabin, huhtikuu 2025  
\[^2]: npm-lataustilastot paketille bson-objectid, helmikuu-maaliskuu 2025  
\[^3]: npm-lataustilastot paketille url-regex-safe, huhtikuu 2025  
\[^4]: GitHub-tähtien määrä forwardemail/forwardemail.net -projektissa huhtikuussa 2025  
\[^5]: npm-lataustilastot paketille preview-email, huhtikuu 2025  
\[^7]: npm-lataustilastot paketille superagent, helmikuu-maaliskuu 2025  
\[^8]: npm-lataustilastot paketille supertest, helmikuu-maaliskuu 2025  
\[^9]: npm-lataustilastot paketille preview-email, helmikuu-maaliskuu 2025  
\[^10]: npm-lataustilastot paketille cabin, helmikuu-maaliskuu 2025  
\[^11]: npm-lataustilastot paketille url-regex-safe, helmikuu-maaliskuu 2025  
\[^12]: npm-lataustilastot paketille spamscanner, helmikuu-maaliskuu 2025  
\[^13]: Päivittäiset latauskuviot npm-tilastoista, huhtikuu 2025  
\[^14]: Viikoittaiset latauskuviot npm-tilastoista, huhtikuu 2025  
\[^15]: npm-lataustilastot paketille nodemailer, huhtikuu 2025  
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
\[^27]: Perustuu GitHub-ongelmiin Upptime-repositoriossa  
\[^28]: Perustuu GitHub-ongelmiin Upptime-repositoriossa  
\[^29]: Perustuu GitHub-ongelmiin Upptime-repositoriossa  
\[^30]: npm-lataustilastot paketille bree, helmikuu-maaliskuu 2025  
\[^31]: Perustuu GitHub-pull requesteihin Upptimessa  
\[^32]: Perustuu GitHub-pull requesteihin Upptimessa  
\[^34]: npm-lataustilastot paketille koa, helmikuu-maaliskuu 2025  
\[^35]: npm-lataustilastot paketille @koa/router, helmikuu-maaliskuu 2025  
\[^36]: npm-lataustilastot paketille koa-router, helmikuu-maaliskuu 2025  
\[^37]: npm-lataustilastot paketille url-regex, helmikuu-maaliskuu 2025  
\[^38]: npm-lataustilastot paketille @breejs/later, helmikuu-maaliskuu 2025  
\[^39]: npm-lataustilastot paketille email-templates, helmikuu-maaliskuu 2025  
\[^40]: npm-lataustilastot paketille get-paths, helmikuu-maaliskuu 2025  
\[^41]: npm-lataustilastot paketille dotenv-parse-variables, helmikuu-maaliskuu 2025  
\[^42]: npm-lataustilastot paketille @koa/multer, helmikuu-maaliskuu 2025
