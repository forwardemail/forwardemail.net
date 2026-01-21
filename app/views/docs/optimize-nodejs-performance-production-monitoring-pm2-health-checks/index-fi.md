# Node.js-tuotantoinfrastruktuurin optimointi: parhaat käytännöt {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [573 %:n yhden ytimen suorituskyvyn optimoinnin vallankumouksemme](#our-573-single-core-performance-optimization-revolution)
  * [Miksi yhden ytimen suorituskyvyn optimointi on tärkeää Node.js:lle](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Aiheeseen liittyvää sisältöä](#related-content)
* [Node.js-tuotantoympäristön asennus: Teknologiapinomme](#nodejs-production-environment-setup-our-technology-stack)
  * [Pakettien hallinta: pnpm tuotantotehokkuutta varten](#package-manager-pnpm-for-production-efficiency)
  * [Verkkokehys: Koa modernille Node.js-tuotannolle](#web-framework-koa-for-modern-nodejs-production)
  * [Taustatyön käsittely: Bree tuotannon luotettavuuden parantamiseksi](#background-job-processing-bree-for-production-reliability)
  * [Virheiden käsittely: @hapi/boom tuotannon luotettavuuden parantamiseksi](#error-handling-hapiboom-for-production-reliability)
* [Node.js-sovellusten valvonta tuotannossa](#how-to-monitor-nodejs-applications-in-production)
  * [Järjestelmätason Node.js-tuotannon valvonta](#system-level-nodejs-production-monitoring)
  * [Sovellustason valvonta Node.js-tuotantoympäristössä](#application-level-monitoring-for-nodejs-production)
  * [Sovelluskohtainen valvonta](#application-specific-monitoring)
* [Node.js-tuotannon seuranta PM2-terveystarkastuksilla](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2-terveystarkastusjärjestelmämme](#our-pm2-health-check-system)
  * [PM2-tuotantokokoonpanomme](#our-pm2-production-configuration)
  * [Automatisoitu PM2-käyttöönotto](#automated-pm2-deployment)
* [Tuotantovirheiden käsittely- ja luokittelujärjestelmä](#production-error-handling-and-classification-system)
  * [isCodeBug-toteutuksemme tuotantokäyttöön](#our-iscodebug-implementation-for-production)
  * [Integrointi tuotantolokitietojemme kanssa](#integration-with-our-production-logging)
  * [Aiheeseen liittyvää sisältöä](#related-content-1)
* [Edistynyt suorituskyvyn virheenkorjaus v8-profiler-nextin ja cpupron avulla](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Profilointimenetelmämme Node.js-tuotantoympäristöissä](#our-profiling-approach-for-nodejs-production)
  * [Kuinka toteutamme keon tilannekuva-analyysin](#how-we-implement-heap-snapshot-analysis)
  * [Suorituskyvyn virheenkorjauksen työnkulku](#performance-debugging-workflow)
  * [Suositeltu toteutus Node.js-sovelluksellesi](#recommended-implementation-for-your-nodejs-application)
  * [Integrointi tuotannonvalvontaamme](#integration-with-our-production-monitoring)
* [Node.js-tuotantoinfrastruktuurin tietoturva](#nodejs-production-infrastructure-security)
  * [Järjestelmätason suojaus Node.js-tuotantoympäristössä](#system-level-security-for-nodejs-production)
  * [Node.js-sovellusten sovellusturvallisuus](#application-security-for-nodejs-applications)
  * [Infrastruktuurin tietoturvan automaatio](#infrastructure-security-automation)
  * [Turvallisuussisältömme](#our-security-content)
* [Node.js-sovellusten tietokanta-arkkitehtuuri](#database-architecture-for-nodejs-applications)
  * [SQLite-toteutus Node.js-tuotantoympäristöön](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-toteutus Node.js-tuotantoympäristöön](#mongodb-implementation-for-nodejs-production)
* [Node.js-tuotannon taustatyön käsittely](#nodejs-production-background-job-processing)
  * [Bree-palvelimemme asennus tuotantokäyttöön](#our-bree-server-setup-for-production)
  * [Esimerkkejä tuotantotöistä](#production-job-examples)
  * [Työaikataulutusmallimme Node.js-tuotantoympäristöön](#our-job-scheduling-patterns-for-nodejs-production)
* [Node.js-sovellusten automaattinen ylläpito tuotantoympäristöissä](#automated-maintenance-for-production-nodejs-applications)
  * [Siivoustoimeksiantomme](#our-cleanup-implementation)
  * [Levytilan hallinta Node.js-tuotantoympäristössä](#disk-space-management-for-nodejs-production)
  * [Infrastruktuurin kunnossapidon automaatio](#infrastructure-maintenance-automation)
* [Node.js:n tuotantoympäristön käyttöönoton opas](#nodejs-production-deployment-implementation-guide)
  * [Tutki varsinaista tuotantoon tarkoitettua koodiamme parhaiden käytäntöjen löytämiseksi](#study-our-actual-code-for-production-best-practices)
  * [Opi blogikirjoituksistamme](#learn-from-our-blog-posts)
  * [Infrastruktuurin automatisointi Node.js-tuotantoympäristöön](#infrastructure-automation-for-nodejs-production)
  * [Tapaustutkimuksemme](#our-case-studies)
* [Yhteenveto: Node.js:n tuotantoympäristön käyttöönoton parhaat käytännöt](#conclusion-nodejs-production-deployment-best-practices)
* [Täydellinen resurssiluettelo Node.js-tuotantoympäristöön](#complete-resource-list-for-nodejs-production)
  * [Keskeiset käyttöönottotiedostomme](#our-core-implementation-files)
  * [Palvelintoteutuksemme](#our-server-implementations)
  * [Infrastruktuuriautomaatiomme](#our-infrastructure-automation)
  * [Tekniset blogikirjoituksemme](#our-technical-blog-posts)
  * [Yritystapaustutkimukseni](#our-enterprise-case-studies)

## Esipuhe {#foreword}

Forward Emaililla olemme vuosia hioneet Node.js-tuotantoympäristöämme. Tämä kattava opas jakaa taisteluissa testatut Node.js-tuotantoympäristön käyttöönoton parhaat käytännöt keskittyen suorituskyvyn optimointiin, valvontaan ja Node.js-sovellusten skaalaamisesta miljoonien päivittäisten tapahtumien käsittelyyn oppimiimme asioihin.

## Yhden ytimen suorituskyvyn optimoinnin vallankumouksemme, 573 % {#our-573-single-core-performance-optimization-revolution}

Kun siirryimme Intel-prosessoreista AMD Ryzen -prosessoreihin, saavutimme **573 %:n suorituskyvyn parannuksen** Node.js-sovelluksissamme. Tämä ei ollut vain pieni optimointi – se muutti perusteellisesti Node.js-sovellustemme suorituskykyä tuotannossa ja osoittaa yhden ytimen suorituskyvyn optimoinnin tärkeyden kaikissa Node.js-sovelluksissa.

> \[!TIP]
> Node.js:n tuotantokäyttöönoton parhaiden käytäntöjen kannalta laitteistovalinta on ratkaisevan tärkeää. Valitsimme DataPacket-hostingin erityisesti heidän AMD Ryzen -suorittimensa saatavuuden vuoksi, koska yhden ytimen suorituskyky on ratkaisevan tärkeää Node.js-sovelluksille, koska JavaScriptin suorittaminen on yksisäikeistä.

### Miksi yhden ytimen suorituskyvyn optimointi on tärkeää Node.js:lle {#why-single-core-performance-optimization-matters-for-nodejs}

Siirtymisemme Intelistä AMD Ryzeniin johti seuraaviin:

* **573 %:n suorituskyvyn parannus** pyyntöjen käsittelyssä (dokumentoitu kohdassa [statussivumme GitHub-ongelma #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Käsittelyviiveet poistettu** lähes välittömiin vastauksiin (mainittu kohdassa [GitHub-ongelma #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Parempi hinta-laatusuhde** Node.js-tuotantoympäristöissä
* **Parannetut vasteajat** kaikissa sovelluspäätepisteissämme

Suorituskyvyn parannus oli niin merkittävä, että pidämme nyt AMD Ryzen -prosessoreita välttämättöminä kaikissa vakavissa Node.js-tuotantoympäristöissä, olipa kyseessä sitten verkkosovellukset, API-rajapinnat, mikropalvelut tai muut Node.js-työkuormat.

### Aiheeseen liittyvää sisältöä {#related-content}

Lisätietoja infrastruktuurivalinnoistamme on täällä:

* [Paras sähköpostin edelleenlähetyspalvelu](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Suorituskykyvertailuja
* [Itse isännöity ratkaisu](https://forwardemail.net/blog/docs/self-hosted-solution) - Laitteistosuositukset

## Node.js-tuotantoympäristön asetukset: Teknologiapinomme {#nodejs-production-environment-setup-our-technology-stack}

Node.js-tuotannon käyttöönoton parhaisiin käytäntöihimme kuuluvat harkitut teknologiavalinnat, jotka perustuvat vuosien tuotantokokemukseen. Tässä on mitä käytämme ja miksi nämä valinnat pätevät kaikkiin Node.js-sovelluksiin:

### Pakettien hallinta: pnpm tuotantotehokkuudelle {#package-manager-pnpm-for-production-efficiency}

**Käytämme:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (kiinnitetty versio)

Valitsimme pnpm:n npm:n ja yarnin sijaan Node.js-tuotantoympäristömme asetuksiin, koska:

* **Nopeammat asennusajat** CI/CD-putkissa
* **Levytilan tehokkuus** kovan linkityksen avulla
* **Tiukka riippuvuuksien ratkaisu**, joka estää haamuriippuvuudet
* **Parempi suorituskyky** tuotantoympäristöissä

> \[!NOTE]
> Osana Node.js:n tuotantoympäristön käyttöönoton parhaita käytäntöjämme kiinnitämme kriittisten työkalujen, kuten pnpm:n, tarkat versiot varmistaaksemme yhdenmukaisen toiminnan kaikissa ympäristöissä ja tiimin jäsenten koneilla.

**Toteutuksen tiedot:**

* [Package.json-kokoonpanomme](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM-ekosysteemin blogikirjoituksemme](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Verkkokehys: Koa modernia Node.js-tuotantoa varten {#web-framework-koa-for-modern-nodejs-production}

**Mitä käytämme:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Valitsimme Koan Expressin sijaan Node.js-tuotantoinfrastruktuuriimme sen modernin async/await-tuen ja selkeämmän väliohjelmistorakenteen vuoksi. Perustajamme Nick Baugh osallistui sekä Expressin että Koan kehittämiseen, antaen meille syvällistä näkemystä molempien frameworkien tuotantokäytöstä.

Nämä mallit pätevät riippumatta siitä, rakennatko REST-rajapintoja, GraphQL-palvelimia, web-sovelluksia tai mikropalveluita.

**Toteutusesimerkkejämme:**

* [Web-palvelimen asennus](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-palvelimen kokoonpano](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Yhteydenottolomakkeiden käyttöönotto-opas](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Taustatyön käsittely: Bree tuotannon luotettavuuden varmistamiseksi {#background-job-processing-bree-for-production-reliability}

**Käytämme:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) -ajastinta

Loimme ja ylläpidämme Breetä, koska olemassa olevat työajoittajamme eivät vastanneet tarpeitamme työsäikeiden tuen ja nykyaikaisten JavaScript-ominaisuuksien suhteen Node.js-tuotantoympäristöissä. Tämä koskee kaikkia Node.js-sovelluksia, jotka tarvitsevat taustaprosessointia, ajoitettuja tehtäviä tai työsäikeitä.

**Toteutusesimerkkejämme:**

* [Bree-palvelimen asennus](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Kaikki työtehtävämme määritelmät](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2-terveystarkastustyö](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Siivoustyön toteutus](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Virheiden käsittely: @hapi/boom tuotannon luotettavuutta varten {#error-handling-hapiboom-for-production-reliability}

**Käytämme:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Käytämme @hapi/boom-mallia strukturoituihin virhevastauksiin kaikissa Node.js-tuotantosovelluksissamme. Tämä malli toimii kaikissa Node.js-sovelluksissa, jotka tarvitsevat yhdenmukaista virheenkäsittelyä.

**Toteutusesimerkkejämme:**

* [Virheiden luokittelun apuohjelma](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Loggerin toteutus](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Node.js-sovellusten valvonta tuotannossa {#how-to-monitor-nodejs-applications-in-production}

Lähestymistapamme Node.js-sovellusten valvontaan tuotannossa on kehittynyt vuosien mittakaavassa suoritettujen sovellusten myötä. Toteutamme valvontaa useilla tasoilla varmistaaksemme kaikenlaisten Node.js-sovellusten luotettavuuden ja suorituskyvyn.

### Järjestelmätason Node.js-tuotannon valvonta {#system-level-nodejs-production-monitoring}

**Ydintoteutuksemme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Käytämme:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Tuotannon valvontakynnyksemme (varsinaisesta tuotantokoodistamme):

* **2 Gt:n keon kokorajoitus** automaattisilla hälytyksillä
* **25 %:n muistin käyttöaste** -varoituskynnys
* **80 %:n suorittimen käyttöaste** -varoituskynnys
* **75 %:n levytilan käyttöaste** -varoituskynnys

> \[!WARNING]
> Nämä kynnysarvot toimivat tietyssä laitteistokokoonpanossamme. Kun otat käyttöön Node.js-tuotannon valvonnan, tarkista monitor-server.js-toteutuksemme ymmärtääksesi tarkan logiikan ja mukauttaaksesi arvot kokoonpanoosi.

### Sovellustason valvonta Node.js-tuotantoympäristössä {#application-level-monitoring-for-nodejs-production}

**Virheluokituksemme:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tämä apuohjelma erottaa toisistaan:

* **Varsinaisia koodivirheitä**, jotka vaativat välitöntä huomiota
* **Käyttäjävirheitä**, jotka ovat odotettua toimintaa
* **Ulkoisten palveluiden toimintahäiriöitä**, joita emme voi hallita

Tämä malli koskee kaikkia Node.js-sovelluksia – verkkosovelluksia, API-rajapintoja, mikropalveluita tai taustapalveluita.

**Lokikirjaustoteutuksemme:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Toteutamme kattavan kenttien hävityksen suojataksemme arkaluonteisia tietoja ja samalla säilyttääksemme hyödylliset virheenkorjausominaisuudet Node.js-tuotantoympäristössämme.

### Sovelluskohtainen valvonta {#application-specific-monitoring}

**Palvelintoteutuksemme:**

* [SMTP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Jonon valvonta:** Käytämme 5 Gt:n jonorajoituksia ja 180 sekunnin aikakatkaisuja pyyntöjen käsittelyssä resurssien loppumisen estämiseksi. Nämä mallit koskevat kaikkia Node.js-sovelluksia, joissa on jonoja tai taustalla tapahtuvaa käsittelyä.

## Node.js-tuotannon valvonta PM2-kuntotarkastuksilla {#nodejs-production-monitoring-with-pm2-health-checks}

Olemme hioneet Node.js-tuotantoympäristöämme PM2:lla vuosien tuotantokokemuksen perusteella. PM2:n kuntotarkistuksemme ovat välttämättömiä minkä tahansa Node.js-sovelluksen luotettavuuden ylläpitämiseksi.

### PM2-kuntotarkastusjärjestelmämme {#our-pm2-health-check-system}

**Ydintoteutuksemme:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Node.js-tuotannon valvontamme PM2-terveystarkastuksineen sisältää:

* **Suoritetaan 20 minuutin välein** cron-ajoituksen kautta
* **Vaatii vähintään 15 minuutin käyttöajan** ennen kuin prosessia pidetään terveenä
* **Tarkistaa prosessin tilan ja muistin käytön**
* **Käynnistää epäonnistuneet prosessit automaattisesti uudelleen**
* **Estää uudelleenkäynnistyssilmukat** älykkään kuntotarkistuksen avulla

> \[!CAUTION]
> Node.js:n tuotantokäyttöönoton parhaiden käytäntöjen mukaisesti vaadimme vähintään 15 minuutin käyttöaikaa ennen kuin prosessia pidetään terveenä, jotta vältetään uudelleenkäynnistyssilmukat. Tämä estää virheiden kaskadoitumisen, kun prosessit kamppailevat muistin tai muiden ongelmien kanssa.

### PM2-tuotantokonfiguraatiomme {#our-pm2-production-configuration}

**Ekosysteemimme asetukset:** Tutustu palvelimemme käynnistystiedostoihin Node.js-tuotantoympäristön asennusta varten:

* [Web-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-aikatauluttaja](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Nämä mallit pätevät riippumatta siitä, käytätkö Express-sovelluksia, Koa-palvelimia, GraphQL-rajapintoja tai mitä tahansa muuta Node.js-sovellusta.

### Automaattinen PM2-käyttöönotto {#automated-pm2-deployment}

**PM2-käyttöönotto:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatisoimme koko PM2-asennuksemme Ansiblen avulla varmistaaksemme Node.js:n yhdenmukaiset tuotantokäyttöönotot kaikilla palvelimillamme.

## Tuotantovirheiden käsittely- ja luokittelujärjestelmä {#production-error-handling-and-classification-system}

Yksi arvokkaimmista Node.js:n tuotantokäyttöönoton parhaista käytännöistämme on älykäs virheluokittelu, jota sovelletaan kaikkiin Node.js-sovelluksiin:

### isCodeBug-toteutuksemme tuotantoympäristöön {#our-iscodebug-implementation-for-production}

**Lähde:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tämä apuohjelma tarjoaa älykkään virheluokittelun Node.js-sovelluksille tuotannossa seuraaviin tarkoituksiin:

* **Priorisoi todelliset virheet** käyttäjien virheiden sijaan
* **Paranna tapauksiin reagointiamme** keskittymällä todellisiin ongelmiin
* **Vähennä odotettujen käyttäjävirheiden aiheuttamaa hälytysväsymystä**
* **Ymmärrä paremmin** sovellusten ja käyttäjien aiheuttamia ongelmia

Tämä malli toimii kaikissa Node.js-sovelluksissa – olitpa sitten rakentamassa verkkokauppasivustoja, SaaS-alustoja, API-rajapintoja tai mikropalveluita.

### Integrointi tuotantolokitietojemme kanssa {#integration-with-our-production-logging}

**Loggeri-integraatiomme:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Loggerimme käyttää `isCodeBug`-muuttujaa hälytystasojen ja kenttien hävittämisen määrittämiseen, varmistaen, että saamme ilmoituksen todellisista ongelmista ja suodatamme samalla pois kohinaa Node.js-tuotantoympäristössämme.

### Aiheeseen liittyvää sisältöä {#related-content-1}

Lue lisää virheiden käsittelymalleistamme:

* [Luotettavan maksujärjestelmän rakentaminen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Virheiden käsittelymallit
* [Sähköpostin yksityisyyden suojaus](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Tietoturvavirheiden käsittely

## Edistynyt suorituskyvyn virheenkorjaus v8-profiler-nextin ja cpupron avulla {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Käytämme edistyneitä profilointityökaluja keon tilannevedosten analysointiin ja muistin loppumisen (OOM, Out of Memory) ongelmien, suorituskyvyn pullonkaulojen ja Node.js-muistiongelmien vianmääritykseen tuotantoympäristössämme. Nämä työkalut ovat välttämättömiä kaikille Node.js-sovelluksille, joissa on muistivuotoja tai suorituskykyongelmia.

### Profilointimenetelmämme Node.js-tuotantoympäristössä {#our-profiling-approach-for-nodejs-production}

**Suosittelemamme työkalut:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Keon tilannevedosten ja suoritinprofiilien luomiseen
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Suoritinprofiilien ja keon tilannevedosten analysointiin

> \[!TIP]
> Käytämme v8-profiler-nextiä ja cpuproa yhdessä luodaksemme täydellisen suorituskyvyn virheenkorjaustyönkulun Node.js-sovelluksillemme. Tämä yhdistelmä auttaa meitä tunnistamaan muistivuotoja, suorituskyvyn pullonkauloja ja optimoimaan tuotantokoodiamme.

### Keon tilannevedosanalyysin toteuttaminen {#how-we-implement-heap-snapshot-analysis}

**Valvonnan toteutuksemme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Tuotannon valvontaamme kuuluu automaattinen keon tilannevedosten luonti, kun muistin kynnysarvot ylittyvät. Tämä auttaa meitä korjaamaan OOM-ongelmia ennen kuin ne aiheuttavat sovellusten kaatumisia.

**Tärkeimmät toteutusmallit:**

* **Automaattiset tilannevedokset**, kun keon koko ylittää 2 Gt:n kynnyksen
* **Signaalipohjainen profilointi** tuotantoympäristön tarvittaessa tapahtuvaa analysointia varten
* **Säilytyskäytännöt** tilannevedosten tallennuksen hallintaan
* **Integrointi puhdistustöihimme** automatisoitua ylläpitoa varten

### Suorituskyvyn virheenkorjauksen työnkulku {#performance-debugging-workflow}

**Tutki varsinaista toteutustamme:**

* [Näyttöpalvelimen toteutus](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Keon valvonta ja tilannevedosten luonti
* [Siivoustyö](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Tilannevedosten säilytys ja puhdistus
* [Loggeriintegraatio](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Suorituskyvyn lokikirjaus

### Suositeltu toteutus Node.js-sovelluksellesi {#recommended-implementation-for-your-nodejs-application}

**Kehon tilannevedosanalyysiä varten:**

1. **Asenna v8-profiler-next** tilannevedosten luomista varten.**Käytä cpuproa** luotujen tilannevedosten analysointiin.**Käytä valvontakynnysarvoja**, jotka ovat samanlaisia kuin monitor-server.js-tiedostossamme.**Määritä automaattinen puhdistus** tilannevedosten tallennuksen hallintaa varten.**Luo signaalinkäsittelijöitä** tuotantoympäristön tarvepohjaista profilointia varten.**

**Suorittimen profilointia varten:**

1. **Luo CPU-profiileja** korkean kuormituksen aikana
2. **Analysoi cpuprolla** pullonkaulojen tunnistamiseksi
3. **Keskity kuumiin polkuihin** ja optimointimahdollisuuksiin
4. **Seuraa suorituskyvyn parannuksia ennen/jälkeen**

> \[!WARNING]
> Keon tilannevedosten ja suoritinprofiilien luominen voi vaikuttaa suorituskykyyn. Suosittelemme rajoituksen käyttöönottoa ja profiloinnin sallimista vain tiettyjä ongelmia tutkittaessa tai huoltokatkosten aikana.

### Integrointi tuotannonvalvontaamme {#integration-with-our-production-monitoring}

Profilointityökalumme integroituvat laajempaan seurantastrategiaamme:

* **Automaattinen käynnistys** muistin/prosessorin kynnysarvojen perusteella
* **Hälytysten integrointi** suorituskykyongelmien havaitsemisen yhteydessä
* **Historiallinen analyysi** suorituskykytrendien seuraamiseksi ajan kuluessa
* **Korrelaatio sovellusmittareiden kanssa** kattavaa virheenkorjausta varten

Tämä lähestymistapa on auttanut meitä tunnistamaan ja ratkaisemaan muistivuotoja, optimoimaan kuumakoodipolkuja ja ylläpitämään vakaata suorituskykyä Node.js-tuotantoympäristössämme.

## Node.js-tuotantoinfrastruktuurin suojaus {#nodejs-production-infrastructure-security}

Toteutamme Node.js-tuotantoinfrastruktuurimme kattavan tietoturvan Ansible-automaation avulla. Nämä käytännöt koskevat kaikkia Node.js-sovelluksia:

### Järjestelmätason suojaus Node.js-tuotantoympäristössä {#system-level-security-for-nodejs-production}

**Ansible-toteutuksemme:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Keskeiset turvatoimenpiteemme Node.js-tuotantoympäristöissä:

* **Vaihtotoiminto poistettu käytöstä** estää arkaluonteisten tietojen kirjoittamisen levylle.
* **Ydinvedokset poistettu käytöstä** estää arkaluonteisia tietoja sisältävien muistivedosten tallentamisen.
* **USB-tallennustila estetty** estää luvattoman tietojen käytön.
* **Ydinparametrien säätö** sekä turvallisuuden että suorituskyvyn parantamiseksi.

> \[!WARNING]
> Kun Node.js:n tuotantokäyttöönoton parhaita käytäntöjä toteutetaan, swap-toiminnon poistaminen käytöstä voi aiheuttaa muistin loppumisesta johtuvia katkoksia, jos sovelluksesi ylittää käytettävissä olevan RAM-muistin. Seuraamme muistin käyttöä tarkasti ja mitoitamme palvelimemme asianmukaisesti.

### Sovelluksen suojaus Node.js-sovelluksille {#application-security-for-nodejs-applications}

**Lokikentän poisto:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Poistamme lokeista arkaluonteisia kenttiä, kuten salasanoja, tokeneita, API-avaimia ja henkilötietoja. Tämä suojaa käyttäjien yksityisyyttä ja säilyttää samalla virheenkorjausominaisuudet missä tahansa Node.js-tuotantoympäristössä.

### Infrastruktuurin tietoturvan automaatio {#infrastructure-security-automation}

**Täydellinen Ansible-kokoonpanomme Node.js-tuotantoa varten:**

* [Turvallisuusopas](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-avainten hallinta](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Varmenteiden hallinta](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-asetukset](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Turvallisuussisältömme {#our-security-content}

Lue lisää turvallisuuslähestymistavastamme:

* [Parhaat tietoturvatarkastusyritykset](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantum Safe -salattu sähköposti](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Miksi avoimen lähdekoodin sähköpostiturvallisuus](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Tietokannan arkkitehtuuri Node.js-sovelluksille {#database-architecture-for-nodejs-applications}

Käytämme Node.js-sovelluksillemme optimoitua hybriditietokantamallia. Näitä malleja voidaan soveltaa mihin tahansa Node.js-sovellukseen:

### SQLite-toteutus Node.js-tuotantoympäristöön {#sqlite-implementation-for-nodejs-production}

**Mitä käytämme:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Kokoonpanomme:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Käytämme SQLitea käyttäjäkohtaiseen dataan Node.js-sovelluksissamme, koska se tarjoaa:

* **Tietojen eristäminen** käyttäjää/vuokralaista kohden
* **Parempi suorituskyky** yhden käyttäjän kyselyissä
* **Yksinkertaistettu varmuuskopiointi** ja siirto
* **Vähemmän monimutkaisuutta** verrattuna jaettuihin tietokantoihin

Tämä malli toimii hyvin SaaS-sovelluksille, usean vuokralaisen järjestelmille tai mille tahansa Node.js-sovellukselle, joka tarvitsee datan eristämistä.

### MongoDB-toteutus Node.js-tuotantoympäristöön {#mongodb-implementation-for-nodejs-production}

**Mitä käytämme:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Asetuksemme toteutus:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Kokoonpanomme:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Käytämme MongoDB:tä sovellusdatalle Node.js-tuotantoympäristössämme, koska se tarjoaa:

* **Joustava skeema** kehittyville tietorakenteille
* **Parempi suorituskyky** monimutkaisille kyselyille
* **Vaakasuuntainen skaalaus** -ominaisuudet
* **Rikas kyselykieli**

> \[!NOTE]
> Hybridi-lähestymistapamme optimoituu juuri meidän käyttötapaukseemme. Tutki todellisia tietokannan käyttömalleja koodikannassamme ja selvitä, sopiiko tämä lähestymistapa Node.js-sovelluksesi tarpeisiin.

## Node.js-tuotannon taustatyön käsittely {#nodejs-production-background-job-processing}

Rakensimme taustatyöarkkitehtuurimme Breen ympärille luotettavaa Node.js-tuotantoympäristöä varten. Tämä koskee kaikkia Node.js-sovelluksia, jotka tarvitsevat taustaprosessointia:

### Bree-palvelimemme tuotantokäyttöönotto {#our-bree-server-setup-for-production}

**Päätoteutuksemme:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible-käyttöönottomme:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Tuotantotyön esimerkkejä {#production-job-examples}

**Terveydentilan seuranta:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Siivousautomaatio:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Kaikki työpaikkamme:** [Selaa koko työpaikkahakemistoamme](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Nämä mallit soveltuvat kaikkiin Node.js-sovelluksiin, jotka tarvitsevat:

* Ajoitetut tehtävät (tietojenkäsittely, raportit, siivous)
* Taustakäsittely (kuvien koon muuttaminen, sähköpostien lähettäminen, tietojen tuonti)
* Kunnonvalvonta ja ylläpito
* Työsäikeiden käyttöaste prosessoriintensiivisissä tehtävissä

### Node.js-tuotantoympäristön työajoitusmallimme {#our-job-scheduling-patterns-for-nodejs-production}

Tutki työpaikkahakemistossamme olevia todellisia työaikataulujamme ymmärtääksesi:

* Kuinka toteutamme cron-tyyppisen ajoituksen Node.js-tuotannossa
* Virheenkäsittely- ja uudelleenyrityslogiikkamme
* Työsäikeiden käyttö prosessoriintensiivisissä tehtävissä

## Automaattinen ylläpito Node.js-tuotantosovelluksille {#automated-maintenance-for-production-nodejs-applications}

Toteutamme ennakoivaa ylläpitoa estääksemme yleisiä Node.js-tuotanto-ongelmia. Nämä mallit pätevät kaikkiin Node.js-sovelluksiin:

### Siivoustoteutuksemme {#our-cleanup-implementation}

**Lähde:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Node.js-tuotantosovellusten automaattinen ylläpitomme kohdistuu seuraaviin tavoitteisiin:

* **Väliaikaiset tiedostot**, jotka ovat yli 24 tuntia vanhoja
* **Lokitiedostot**, jotka ovat säilytysrajan ulkopuolella
* **Välimuistitiedostot** ja väliaikaiset tiedot
* **Ladatut tiedostot**, joita ei enää tarvita
* **Kehon tilannevedokset** suorituskyvyn virheenkorjauksesta

Nämä mallit koskevat kaikkia Node.js-sovelluksia, jotka luovat väliaikaisia tiedostoja, lokeja tai välimuistissa olevia tietoja.

### Levytilan hallinta Node.js-tuotantoympäristössä {#disk-space-management-for-nodejs-production}

**Valvontakynnyksemme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Jonorajoitukset** taustakäsittelylle
* **75 %:n levytilan käyttöaste** varoituskynnys
* **Automaattinen puhdistus** kynnysten ylittyessä

### Infrastruktuurin ylläpidon automatisointi {#infrastructure-maintenance-automation}

**Ansible-automaatiomme Node.js-tuotantoon:**

* [Ympäristön käyttöönotto](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Käyttöönottoavainten hallinta](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Node.js:n tuotantokäyttöönoton toteutusopas {#nodejs-production-deployment-implementation-guide}

### Tutustu tuotantokäytön parhaisiin käytäntöihin varsinaisessa koodissamme {#study-our-actual-code-for-production-best-practices}

**Aloita näillä avaintiedostoilla Node.js-tuotantoympäristön asennusta varten:**

1. **Määritys:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Valvonta:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Virheiden käsittely:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Lokikirjaus:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Prosessin tila:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Opi blogikirjoituksistamme {#learn-from-our-blog-posts}

**Tekniset toteutusoppaamme Node.js-tuotantoon:**

* [NPM-pakettien ekosysteemi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Maksujärjestelmien rakentaminen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Sähköpostin yksityisyydensuojan käyttöönotto](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-yhteydenottolomakkeet](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React-sähköpostien integrointi](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastruktuurin automatisointi Node.js-tuotantoympäristöön {#infrastructure-automation-for-nodejs-production}

**Ansible-käsikirjamme Node.js:n tuotantokäyttöönottoa varten:**

* [Täydellinen pelikirjahakemisto](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Suojauksen koventaminen](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-asennus](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Tapaustutkimuksemme {#our-case-studies}

**Yrityskäyttöönottomme:**

* [Linux Foundationin tapaustutkimus](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Kanonisen Ubuntun tapaustutkimus](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumnien sähköpostien edelleenlähetys](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Yhteenveto: Node.js:n tuotantokäyttöönoton parhaat käytännöt {#conclusion-nodejs-production-deployment-best-practices}

Node.js-tuotantoinfrastruktuurimme osoittaa, että Node.js-sovellukset voivat saavuttaa yritystason luotettavuuden seuraavien ominaisuuksien ansiosta:

* **Todistetut laitteistovalinnat** (AMD Ryzen 573 %:n yhden ytimen suorituskyvyn optimointiin)
* **Taistelussa testattu Node.js-tuotannon valvonta** tietyillä kynnysarvoilla ja automaattisilla vasteilla
* **Älykäs virheluokittelu** parantaakseen tapahtumiin reagointia tuotantoympäristöissä
* **Edistynyt suorituskyvyn virheenkorjaus** v8-profiler-nextin ja cpupron avulla OOM:n estämiseksi
* **Kattava tietoturvan vahvistaminen** Ansible-automaation avulla
* **Hybriditietokanta-arkkitehtuuri** optimoitu sovellustarpeisiin
* **Automaattinen ylläpito** yleisten Node.js-tuotanto-ongelmien estämiseksi

**Tärkein oppi:** Tutki varsinaisia toteutustiedostojamme ja blogikirjoituksiamme yleisten parhaiden käytäntöjen noudattamisen sijaan. Koodikantaamme tarjoaa reaalimaailman malleja Node.js:n tuotantokäyttöönotolle, joita voidaan mukauttaa mihin tahansa Node.js-sovellukseen – verkkosovelluksiin, API-rajapintoihin, mikropalveluihin tai taustapalveluihin.

## Täydellinen resurssiluettelo Node.js-tuotantoa varten {#complete-resource-list-for-nodejs-production}

### Keskeiset toteutustiedostomme {#our-core-implementation-files}

* [Pääkonfiguraatio](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Pakettiriippuvuudet](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Palvelimen valvonta](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Virheiden luokittelu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Kirjausjärjestelmä](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2-terveystarkastukset](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automaattinen puhdistus](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Palvelintoteutuksemme {#our-server-implementations}

* [Web-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-aikatauluttaja](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Infrastruktuuriautomaatiomme {#our-infrastructure-automation}

* [Kaikki Ansible-pelioppaamme](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Suojauksen koventaminen](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-asennus](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Tietokannan konfigurointi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Tekniset blogikirjoituksemme {#our-technical-blog-posts}

* [NPM-ekosysteemianalyysi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Maksujärjestelmän käyttöönotto](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Sähköpostin tietosuojan tekninen opas](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-yhteydenottolomakkeet](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React-sähköpostien integrointi](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Itse isännöidyn ratkaisun opas](https://forwardemail.net/blog/docs/self-hosted-solution)

### Yritystapaustutkimukseni {#our-enterprise-case-studies}

* [Linux Foundationin käyttöönotto](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Kanonisen Ubuntun tapaustutkimus](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Liittovaltion hallituksen vaatimustenmukaisuus](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumnien sähköpostijärjestelmät](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)