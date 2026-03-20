# Kuinka Optimoida Node.js Tuotantoinfrastruktuuri: Parhaat Käytännöt {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Meidän 573% Ydinperformanssin Optimointivallankumous](#our-573-single-core-performance-optimization-revolution)
  * [Miksi Ydinperformanssin Optimointi On Tärkeää Node.js:lle](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Aiheeseen Liittyvä Sisältö](#related-content)
* [Node.js Tuotantoympäristön Asetus: Meidän Teknologiapino](#nodejs-production-environment-setup-our-technology-stack)
  * [Paketinhallinta: pnpm Tuotannon Tehokkuuteen](#package-manager-pnpm-for-production-efficiency)
  * [Web-kehys: Koa Moderniin Node.js Tuotantoon](#web-framework-koa-for-modern-nodejs-production)
  * [Taustatyöprosessointi: Bree Tuotannon Luotettavuuteen](#background-job-processing-bree-for-production-reliability)
  * [Virheenkäsittely: @hapi/boom Tuotannon Luotettavuuteen](#error-handling-hapiboom-for-production-reliability)
* [Kuinka Valvoa Node.js Sovelluksia Tuotannossa](#how-to-monitor-nodejs-applications-in-production)
  * [Järjestelmätason Node.js Tuotantovalvonta](#system-level-nodejs-production-monitoring)
  * [Sovellustason Valvonta Node.js Tuotannossa](#application-level-monitoring-for-nodejs-production)
  * [Sovelluskohtainen Valvonta](#application-specific-monitoring)
* [Node.js Tuotantovalvonta PM2:n Terveystarkastuksilla](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Meidän PM2 Terveystarkastusjärjestelmä](#our-pm2-health-check-system)
  * [Meidän PM2 Tuotantokonfiguraatio](#our-pm2-production-configuration)
  * [Automaattinen PM2 Käyttöönotto](#automated-pm2-deployment)
* [Tuotannon Virheenkäsittely ja Luokittelujärjestelmä](#production-error-handling-and-classification-system)
  * [Meidän isCodeBug Toteutus Tuotantoon](#our-iscodebug-implementation-for-production)
  * [Integraatio Meidän Tuotantolokin Kanssa](#integration-with-our-production-logging)
  * [Aiheeseen Liittyvä Sisältö](#related-content-1)
* [Edistynyt Suorituskyvyn Virheenkorjaus v8-profiler-nextillä ja cpuprolla](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Meidän Profilointimenetelmä Node.js Tuotantoon](#our-profiling-approach-for-nodejs-production)
  * [Kuinka Toteutamme Heap Snapshot Analyysin](#how-we-implement-heap-snapshot-analysis)
  * [Suorituskyvyn Virheenkorjaus Työnkulku](#performance-debugging-workflow)
  * [Suositeltu Toteutus Sinun Node.js Sovelluksellesi](#recommended-implementation-for-your-nodejs-application)
  * [Integraatio Meidän Tuotantovalvontaan](#integration-with-our-production-monitoring)
* [Node.js Tuotantoinfrastruktuurin Turvallisuus](#nodejs-production-infrastructure-security)
  * [Järjestelmätason Turvallisuus Node.js Tuotannossa](#system-level-security-for-nodejs-production)
  * [Sovellusturvallisuus Node.js Sovelluksille](#application-security-for-nodejs-applications)
  * [Infrastruktuurin Turvallisuusautomaatiot](#infrastructure-security-automation)
  * [Meidän Turvallisuussisältö](#our-security-content)
* [Tietokanta-arkkitehtuuri Node.js Sovelluksille](#database-architecture-for-nodejs-applications)
  * [SQLite Toteutus Node.js Tuotantoon](#sqlite-implementation-for-nodejs-production)
  * [MongoDB Toteutus Node.js Tuotantoon](#mongodb-implementation-for-nodejs-production)
* [Node.js Tuotannon Taustatyöprosessointi](#nodejs-production-background-job-processing)
  * [Meidän Bree Palvelinasetus Tuotantoon](#our-bree-server-setup-for-production)
  * [Tuotantotyöesimerkit](#production-job-examples)
  * [Meidän Työaikataulumallit Node.js Tuotantoon](#our-job-scheduling-patterns-for-nodejs-production)
* [Automaattinen Ylläpito Node.js Tuotantosovelluksille](#automated-maintenance-for-production-nodejs-applications)
  * [Meidän Siivoustoteutus](#our-cleanup-implementation)
  * [Levyn Tilanhallinta Node.js Tuotannossa](#disk-space-management-for-nodejs-production)
  * [Infrastruktuurin Ylläpitoautomaatiot](#infrastructure-maintenance-automation)
* [Node.js Tuotantokäyttöönoton Toteutusopas](#nodejs-production-deployment-implementation-guide)
  * [Tutki Meidän Todellista Koodia Tuotannon Parhaista Käytännöistä](#study-our-actual-code-for-production-best-practices)
  * [Opi Meidän Blogikirjoituksistamme](#learn-from-our-blog-posts)
  * [Infrastruktuuriautomaatiot Node.js Tuotantoon](#infrastructure-automation-for-nodejs-production)
  * [Meidän Case-esimerkit](#our-case-studies)
* [Yhteenveto: Node.js Tuotantokäyttöönoton Parhaat Käytännöt](#conclusion-nodejs-production-deployment-best-practices)
* [Täydellinen Resurssilista Node.js Tuotantoon](#complete-resource-list-for-nodejs-production)
  * [Meidän Ydinimplementaatiotiedostot](#our-core-implementation-files)
  * [Meidän Palvelinimplementaatiot](#our-server-implementations)
  * [Meidän Infrastruktuuriautomaatio](#our-infrastructure-automation)
  * [Meidän Teknisiä Blogikirjoituksia](#our-technical-blog-posts)
  * [Meidän Yrityscaset](#our-enterprise-case-studies)
## Esipuhe {#foreword}

Forward Emaililla olemme käyttäneet vuosia Node.js-tuotantoympäristön asennuksen hiomiseen. Tämä kattava opas jakaa taisteltuja Node.js-tuotantoon käyttöönoton parhaita käytäntöjä, keskittyen suorituskyvyn optimointiin, valvontaan ja oppeihin, joita olemme saaneet skaalaamalla Node.js-sovelluksia käsittelemään miljoonia päivittäisiä tapahtumia.


## Meidän 573 % Ydinsuorituskyvyn Optimointivallankumouksemme {#our-573-single-core-performance-optimization-revolution}

Kun siirryimme Intelistä AMD Ryzen -prosessoreihin, saavutimme **573 % suorituskyvyn parannuksen** Node.js-sovelluksissamme. Tämä ei ollut vain pieni optimointi — se muutti perustavanlaatuisesti sitä, miten Node.js-sovelluksemme toimivat tuotannossa, ja osoittaa yksiydinsuorituskyvyn optimoinnin tärkeyden mille tahansa Node.js-sovellukselle.

> \[!TIP]
> Node.js-tuotantoon käyttöönoton parhaiden käytäntöjen kannalta laitteiston valinta on kriittinen. Valitsimme erityisesti DataPacket-hostauksen heidän AMD Ryzen -saatavuutensa vuoksi, koska yksiydinsuorituskyky on ratkaisevan tärkeää Node.js-sovelluksille, sillä JavaScriptin suoritus on yksisäikeistä.

### Miksi Ydinsuorituskyvyn Optimointi On Tärkeää Node.js:lle {#why-single-core-performance-optimization-matters-for-nodejs}

Siirtymämme Intelistä AMD Ryzen -prosessoreihin johti:

* **573 % suorituskyvyn parannukseen** pyyntöjen käsittelyssä (dokumentoituna [status-sivumme GitHub Issue #1519:ssa](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Käsittelyviiveiden poistumiseen** lähes välittömiin vastauksiin (mainittu [GitHub Issue #298:ssa](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Parempaan hinta-suorituskykysuhteeseen** Node.js-tuotantoympäristöissä
* **Parantuneisiin vasteaikoihin** kaikissa sovelluksemme päätepisteissä

Suorituskyvyn parannus oli niin merkittävä, että pidämme nyt AMD Ryzen -prosessoreita välttämättöminä mille tahansa vakavalle Node.js-tuotantokäyttöönotolle, olipa kyseessä verkkosovellukset, API:t, mikropalvelut tai mikä tahansa muu Node.js-kuormitus.

### Aiheeseen Liittyvää Sisältöä {#related-content}

Lisätietoja infrastruktuurivalinnoistamme löydät:

* [Paras Sähköpostin Uudelleenohjauspalvelu](https://forwardemail.net/blog/docs/best-email-forwarding-service) – Suorituskykyvertailut
* [Itse Isännöity Ratkaisu](https://forwardemail.net/blog/docs/self-hosted-solution) – Laitteistosuositukset


## Node.js-tuotantoympäristön Asennus: Teknologiapinomme {#nodejs-production-environment-setup-our-technology-stack}

Node.js-tuotantoon käyttöönoton parhaat käytäntömme sisältävät harkittuja teknologisia valintoja vuosien tuotantokokemuksen pohjalta. Tässä mitä käytämme ja miksi nämä valinnat pätevät mihin tahansa Node.js-sovellukseen:

### Pakettien Hallinta: pnpm Tuotannon Tehokkuuteen {#package-manager-pnpm-for-production-efficiency}

**Mitä käytämme:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (lukittu versio)

Valitsimme pnpm:n npm:n ja yarnin sijaan Node.js-tuotantoympäristömme asennukseen, koska:

* **Nopeammat asennusajat** CI/CD-putkissa
* **Levytilan tehokkuus** kovien linkkien avulla
* **Tiukka riippuvuuksien ratkaisu** joka estää näkymättömät riippuvuudet
* **Parempi suorituskyky** tuotantokäyttöönotossa

> \[!NOTE]
> Osana Node.js-tuotantoon käyttöönoton parhaita käytäntöjä lukitsemme kriittisten työkalujen, kuten pnpm:n, tarkat versiot varmistaaksemme johdonmukaisen toiminnan kaikissa ympäristöissä ja tiimin jäsenten koneilla.

**Toteutuksen yksityiskohdat:**

* [Paketti.json-konfiguraatiomme](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPM-ekosysteemin blogikirjoituksemme](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web-kehys: Koa Moderniin Node.js-tuotantoon {#web-framework-koa-for-modern-nodejs-production}

**Mitä käytämme:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Valitsimme Koa:n Expressin sijaan Node.js -tuotantoinfrastruktuuriimme sen modernin async/await-tuen ja siistimmän middleware-komposition vuoksi. Perustajamme Nick Baugh on osallistunut sekä Expressin että Koan kehitykseen, mikä antaa meille syvällisen näkemyksen molemmista kehyksistä tuotantokäyttöön.

Nämä mallit pätevät, olitpa rakentamassa REST-rajapintoja, GraphQL-palvelimia, web-sovelluksia tai mikropalveluita.

**Esimerkkejä toteutuksistamme:**

* [Web-palvelimen asennus](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-palvelimen konfigurointi](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Yhteydenottolomakkeiden toteutusopas](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Taustatyöprosessointi: Bree tuotannon luotettavuuteen {#background-job-processing-bree-for-production-reliability}

**Käytössämme:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) ajastin

Loimme ja ylläpidämme Bree:tä, koska olemassa olevat työnajastimet eivät täyttäneet tarpeitamme työntekijäthreadien tuen ja modernien JavaScript-ominaisuuksien osalta tuotannon Node.js -ympäristöissä. Tämä pätee mihin tahansa Node.js -sovellukseen, joka tarvitsee taustaprosessointia, ajoitettuja tehtäviä tai työntekijäthreadit.

**Esimerkkejä toteutuksistamme:**

* [Bree-palvelimen asennus](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Kaikki työnmäärityksemme](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2:n terveystarkastus tehtävä](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Siivoustehtävän toteutus](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Virheenkäsittely: @hapi/boom tuotannon luotettavuuteen {#error-handling-hapiboom-for-production-reliability}

**Käytössämme:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Käytämme @hapi/boom:ia rakenteellisiin virhevastauksiin kaikissa Node.js -tuotantosovelluksissamme. Tämä malli toimii missä tahansa Node.js -sovelluksessa, joka tarvitsee johdonmukaista virheenkäsittelyä.

**Esimerkkejä toteutuksistamme:**

* [Virheiden luokittelun apuri](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Lokitus toteutus](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Kuinka valvoa Node.js -sovelluksia tuotannossa {#how-to-monitor-nodejs-applications-in-production}

Lähestymistapamme Node.js -sovellusten valvontaan tuotannossa on kehittynyt vuosien mittaan, kun olemme ajaneet sovelluksia suuressa mittakaavassa. Toteutamme valvonnan useilla tasoilla varmistaaksemme luotettavuuden ja suorituskyvyn kaikentyyppisille Node.js -sovelluksille.

### Järjestelmätason Node.js -tuotantovalvonta {#system-level-nodejs-production-monitoring}

**Ydin toteutuksemme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Käytössämme:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Tuotantovalvontamme kynnysarvot (todellisesta tuotantokoodistamme):

* **2GB heap-koko raja** automaattisilla hälytyksillä
* **25% muistin käyttö** varoituskynnys
* **80% CPU:n käyttö** hälytyskynnys
* **75% levyn käyttö** varoituskynnys

> \[!WARNING]
> Nämä kynnysarvot toimivat meidän laitteistokonfiguraatiollamme. Kun toteutat Node.js -tuotantovalvontaa, tutustu monitor-server.js -toteutukseemme ymmärtääksesi tarkka logiikka ja mukauta arvot omaan ympäristöösi.

### Sovellustason valvonta Node.js -tuotannossa {#application-level-monitoring-for-nodejs-production}

**Virheiden luokittelumme:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tämä apuri erottaa:

* **Todelliset koodivirheet**, jotka vaativat välitöntä huomiota
* **Käyttäjävirheet**, jotka ovat odotettua käyttäytymistä
* **Ulkoiset palvelun häiriöt**, joita emme voi hallita

Tämä malli pätee mihin tahansa Node.js -sovellukseen - web-sovelluksiin, rajapintoihin, mikropalveluihin tai taustapalveluihin.
**Lokituksemme toteutus:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Toteutamme kattavan kenttien sensuroinnin suojataksemme arkaluontoisia tietoja samalla kun säilytämme hyödylliset virheenkorjausmahdollisuudet Node.js-tuotantoympäristössämme.

### Sovelluskohtainen valvonta {#application-specific-monitoring}

**Palvelintoteutuksemme:**

* [SMTP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Jonon valvonta:** Toteutamme 5GB jonorajat ja 180 sekunnin aikakatkaisut pyyntöjen käsittelyssä resurssien loppumisen estämiseksi. Nämä mallit soveltuvat mihin tahansa Node.js-sovellukseen, jossa on jonoja tai taustaprosessointia.


## Node.js-tuotantovalvonta PM2-terveystarkastuksilla {#nodejs-production-monitoring-with-pm2-health-checks}

Olemme hioneet Node.js-tuotantoympäristömme asetuksia PM2:n avulla vuosien tuotantokokemuksen perusteella. PM2-terveystarkastuksemme ovat välttämättömiä luotettavuuden ylläpitämiseksi missä tahansa Node.js-sovelluksessa.

### PM2-terveystarkastusjärjestelmämme {#our-pm2-health-check-system}

**Ydinimplementaatiomme:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Node.js-tuotantovalvontamme PM2-terveystarkastuksilla sisältää:

* **Suoritetaan 20 minuutin välein** cron-ajastuksen avulla
* **Vaatii vähintään 15 minuutin käyttöajan** ennen prosessin terveeksi katsomista
* **Varmistaa prosessin tilan ja muistin käytön**
* **Käynnistää epäonnistuneet prosessit automaattisesti uudelleen**
* **Estää uudelleenkäynnistys-silmukat** älykkään terveystarkastuksen avulla

> \[!CAUTION]
> Node.js-tuotantoon liittyvien parhaiden käytäntöjen vuoksi vaadimme 15+ minuutin käyttöajan ennen prosessin terveeksi katsomista uudelleenkäynnistys-silmukoiden välttämiseksi. Tämä estää ketjureaktiovirheet, kun prosessit kamppailevat muistin tai muiden ongelmien kanssa.

### PM2-tuotantokonfiguraatiomme {#our-pm2-production-configuration}

**Ekosysteemin asetuksemme:** Tutustu palvelimen käynnistystiedostoihimme Node.js-tuotantoympäristön asetuksissa:

* [Web-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-ajastin](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Nämä mallit soveltuvat riippumatta siitä, käytätkö Express-sovelluksia, Koa-palvelimia, GraphQL-rajapintoja tai muita Node.js-sovelluksia.

### Automaattinen PM2-julkaisu {#automated-pm2-deployment}

**PM2-julkaisu:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatisoimme koko PM2-asetuksemme Ansiblella varmistaaksemme yhdenmukaiset Node.js-tuotantojulkaisut kaikilla palvelimillamme.


## Tuotantovirheiden käsittely- ja luokitusjärjestelmä {#production-error-handling-and-classification-system}

Yksi arvokkaimmista Node.js-tuotantojulkaisuun liittyvistä parhaista käytännöistämme on älykäs virheiden luokittelu, joka soveltuu mihin tahansa Node.js-sovellukseen:

### isCodeBug-toteutuksemme tuotantoon {#our-iscodebug-implementation-for-production}

**Lähde:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Tämä apuväline tarjoaa älykkään virheiden luokittelun Node.js-sovelluksille tuotannossa, jotta:

* **Todelliset virheet priorisoidaan** käyttäjävirheiden yli
* **Parannamme häiriötilanteiden hallintaa** keskittymällä todellisiin ongelmiin
* **Vähennämme hälytysväsymystä** odotetuista käyttäjävirheistä
* **Ymmärrämme paremmin** sovelluksen ja käyttäjän aiheuttamat ongelmat

Tämä malli toimii missä tahansa Node.js-sovelluksessa – olipa kyseessä verkkokaupat, SaaS-alustat, rajapinnat tai mikropalvelut.

### Integraatio tuotantolokitukseemme {#integration-with-our-production-logging}

**Lokitusintegraatiomme:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Our logger käyttää `isCodeBug`-arvoa hälytystasojen ja kenttien peittämisen määrittämiseen, varmistaen, että saamme ilmoituksia todellisista ongelmista samalla kun suodatamme pois melua Node.js-tuotantoympäristössämme.

### Related Content {#related-content-1}

Lue lisää virheenkäsittelymalleistamme:

* [Luotettavan maksujärjestelmän rakentaminen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Virheenkäsittelymallit
* [Sähköpostin yksityisyyden suojaus](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Turvallisuuden virheenkäsittely


## Edistynyt suorituskyvyn virheenkorjaus v8-profiler-nextillä ja cpuprolla {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Käytämme edistyneitä profilointityökaluja kasamuistikuvausten analysointiin ja OOM (muistin loppuminen) -ongelmien, suorituskykypullonkaulojen sekä Node.js-muistiongelmien virheenkorjaukseen tuotantoympäristössämme. Nämä työkalut ovat välttämättömiä kaikille Node.js-sovelluksille, jotka kokevat muistivuotoja tai suorituskykyongelmia.

### Profilointilähestymistapamme Node.js-tuotantoon {#our-profiling-approach-for-nodejs-production}

**Suosittelemamme työkalut:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Kasamuistikuvausten ja CPU-profiilien luomiseen
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU-profiilien ja kasamuistikuvausten analysointiin

> \[!TIP]
> Käytämme v8-profiler-nextiä ja cpuproa yhdessä luodaksemme täydellisen suorituskyvyn virheenkorjausprosessin Node.js-sovelluksillemme. Tämä yhdistelmä auttaa tunnistamaan muistivuodot, suorituskykypullonkaulat ja optimoimaan tuotantokoodimme.

### Kuinka toteutamme kasamuistikuvausanalyysin {#how-we-implement-heap-snapshot-analysis}

**Valvontatoteutuksemme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Tuotantovalvontamme sisältää automaattisen kasamuistikuvausten luomisen, kun muistirajat ylittyvät. Tämä auttaa meitä virheenkorjaamaan OOM-ongelmia ennen kuin ne aiheuttavat sovelluksen kaatumisia.

**Keskeiset toteutusmallit:**

* **Automaattiset kuvaukset** kun kasamuistin koko ylittää 2GB-rajan
* **Signaalipohjainen profilointi** pyynnöstä tuotannossa
* **Säilytyskäytännöt** kuvauksien tallennuksen hallintaan
* **Integraatio siivoustöihimme** automaattista ylläpitoa varten

### Suorituskyvyn virheenkorjausprosessi {#performance-debugging-workflow}

**Tutustu toteutukseemme:**

* [Monitor-palvelimen toteutus](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Kasamuistin valvonta ja kuvauksen luonti
* [Siivoustyö](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Kuvauksien säilytys ja siivous
* [Lokitusintegraatio](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Suorituskyvyn lokitus

### Suositeltu toteutus Node.js-sovelluksellesi {#recommended-implementation-for-your-nodejs-application}

**Kasamuistikuvausanalyysiin:**

1. **Asenna v8-profiler-next** kuvauksien luontiin
2. **Käytä cpuproa** luotujen kuvausten analysointiin
3. **Toteuta valvontarajat** vastaavasti kuin monitor-server.js:ssä
4. **Ota käyttöön automaattinen siivous** kuvauksien tallennuksen hallintaan
5. **Luo signaalinkäsittelijät** pyynnöstä tehtävään profilointiin tuotannossa

**CPU-profilointiin:**

1. **Luo CPU-profiileja** kuormitushuippujen aikana
2. **Analysoi cpuprolla** pullonkaulojen tunnistamiseksi
3. **Keskity kuumiin polkuihin** ja optimointimahdollisuuksiin
4. **Valvo ennen/jälkeen** suorituskyvyn parannuksia

> \[!WARNING]
> Kasamuistikuvausten ja CPU-profiilien luominen voi vaikuttaa suorituskykyyn. Suosittelemme rajoittamaan profilointia ja ottamaan sen käyttöön vain tiettyjen ongelmien tutkimiseen tai ylläpitokatkojen aikana.

### Integraatio tuotantovalvontamme kanssa {#integration-with-our-production-monitoring}

Profilointityökalumme integroituvat laajempaan valvontastrategiaamme:

* **Automaattinen käynnistys** muisti-/CPU-rajojen perusteella
* **Hälytysintegratio** suorituskykyongelmien havaitsemiseksi
* **Historiallinen analyysi** suorituskykytrendejä seuraamaan
* **Sovellusmittareiden korrelaatio** kattavaan virheenkorjaukseen
Tämä lähestymistapa on auttanut meitä tunnistamaan ja korjaamaan muistivuotoja, optimoimaan kuumia koodipolkuja ja ylläpitämään vakaata suorituskykyä Node.js-tuotantoympäristössämme.


## Node.js-tuotantoinfrastruktuurin turvallisuus {#nodejs-production-infrastructure-security}

Toteutamme kattavan turvallisuuden Node.js-tuotantoinfrastruktuurillemme Ansible-automaatioiden avulla. Nämä käytännöt koskevat mitä tahansa Node.js-sovellusta:

### Järjestelmätason turvallisuus Node.js-tuotannossa {#system-level-security-for-nodejs-production}

**Ansible-toteutuksemme:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Keskeiset turvallisuustoimenpiteemme Node.js-tuotantoympäristöissä:

* **Swap pois käytöstä** estämään arkaluontoisten tietojen kirjoittaminen levylle
* **Core dumpit pois käytöstä** estämään muistidumppien sisältämät arkaluontoiset tiedot
* **USB-tallennustilan esto** estämään luvaton tiedonsaanti
* **Kernel-parametrien säätö** sekä turvallisuuden että suorituskyvyn parantamiseksi

> \[!WARNING]
> Node.js-tuotantokäyttöönoton parhaiden käytäntöjen toteuttamisessa swapin poistaminen käytöstä voi aiheuttaa muistin loppumiseen liittyviä prosessien tappamisia, jos sovelluksesi ylittää käytettävissä olevan RAM-muistin. Seuraamme muistinkäyttöä tarkasti ja mitoittamme palvelimemme asianmukaisesti.

### Sovellusturvallisuus Node.js-sovelluksille {#application-security-for-nodejs-applications}

**Lokikenttien sensurointimme:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Sensuroimme lokitiedoista arkaluontoiset kentät, kuten salasanat, tokenit, API-avaimet ja henkilötiedot. Tämä suojaa käyttäjien yksityisyyttä samalla kun säilyttää virheenkorjausmahdollisuudet missä tahansa Node.js-tuotantoympäristössä.

### Infrastruktuurin turvallisuusautomaatio {#infrastructure-security-automation}

**Täydellinen Ansible-asetuksemme Node.js-tuotantoon:**

* [Turvallisuus playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-avainten hallinta](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Sertifikaattien hallinta](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-asetukset](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Turvallisuussisältömme {#our-security-content}

Lisätietoja turvallisuuslähestymistavastamme:

* [Parhaat turvallisuusauditointiyritykset](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Kvanteenkestävä salattu sähköposti](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Miksi avoimen lähdekoodin sähköpostiturvallisuus](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Tietokanta-arkkitehtuuri Node.js-sovelluksille {#database-architecture-for-nodejs-applications}

Käytämme hybridi-tietokantaratkaisua, joka on optimoitu Node.js-sovelluksillemme. Näitä malleja voidaan soveltaa mihin tahansa Node.js-sovellukseen:

### SQLite-toteutus Node.js-tuotantoon {#sqlite-implementation-for-nodejs-production}

**Käyttämämme:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Konfiguraatiomme:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Käytämme SQLitea käyttäjäkohtaisiin tietoihin Node.js-sovelluksissamme, koska se tarjoaa:

* **Tietojen eristämisen** käyttäjä-/vuokralaiskohtaisesti
* **Parempi suorituskyky** yksittäiskäyttäjän kyselyissä
* **Yksinkertaistetun varmuuskopioinnin** ja migraation
* **Vähemmän monimutkaisuutta** verrattuna jaettuihin tietokantoihin

Tämä malli toimii hyvin SaaS-sovelluksissa, monivuokralaisjärjestelmissä tai missä tahansa Node.js-sovelluksessa, joka tarvitsee tietojen eristämistä.

### MongoDB-toteutus Node.js-tuotantoon {#mongodb-implementation-for-nodejs-production}

**Käyttämämme:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Meidän asennuksemme toteutus:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Meidän konfiguraatiomme:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Käytämme MongoDB:tä sovellustietojen tallentamiseen Node.js -tuotantoympäristössämme, koska se tarjoaa:

* **Joustavan skeeman** kehittyville tietorakenteille
* **Parempaa suorituskykyä** monimutkaisissa kyselyissä
* **Vaakasuoran skaalaamisen** mahdollisuudet
* **Rikkaan kyselykielen**

> \[!NOTE]
> Hybridimenetelmämme on optimoitu meidän erityiseen käyttötapaukseemme. Tutki todellisia tietokannan käyttömallejamme koodipohjassa ymmärtääksesi, sopiiko tämä lähestymistapa sinun Node.js -sovelluksesi tarpeisiin.


## Node.js -tuotannon taustatehtävien käsittely {#nodejs-production-background-job-processing}

Rakensimme taustatehtäväarkkitehtuurimme Bree:n ympärille luotettavaa Node.js -tuotantokäyttöä varten. Tämä koskee mitä tahansa Node.js -sovellusta, joka tarvitsee taustaprosessointia:

### Meidän Bree-palvelinasetuksemme tuotantoon {#our-bree-server-setup-for-production}

**Meidän pääasiallinen toteutuksemme:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Meidän Ansible-julkaisu:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Tuotannon tehtäväesimerkit {#production-job-examples}

**Terveystarkkailu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Siivousautomaatio:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Kaikki tehtävämme:** [Selaa täydellistä tehtäväkansiotamme](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Nämä mallit koskevat mitä tahansa Node.js -sovellusta, joka tarvitsee:

* Aikataulutettuja tehtäviä (tietojenkäsittely, raportit, siivous)
* Taustaprosessointia (kuvien koon muuttaminen, sähköpostien lähetys, tietojen tuonti)
* Terveystarkkailua ja ylläpitoa
* Työntekijäketjujen hyödyntämistä CPU-intensiivisiin tehtäviin

### Meidän tehtävien aikataulutusmallimme Node.js -tuotantoon {#our-job-scheduling-patterns-for-nodejs-production}

Tutki todellisia tehtävien aikataulutusmallejamme tehtäväkansiossamme ymmärtääksesi:

* Kuinka toteutamme cron-tyyppisen aikataulutuksen Node.js -tuotannossa
* Virheenkäsittely- ja uudelleenyrityslogiikkamme
* Kuinka käytämme työntekijäketjuja CPU-intensiivisiin tehtäviin


## Automaattinen ylläpito Node.js -tuotantosovelluksille {#automated-maintenance-for-production-nodejs-applications}

Toteutamme ennakoivaa ylläpitoa estääksemme yleisiä Node.js -tuotanto-ongelmia. Nämä mallit koskevat mitä tahansa Node.js -sovellusta:

### Meidän siivoustoteutuksemme {#our-cleanup-implementation}

**Lähde:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Automaattinen ylläpitomme Node.js -tuotantosovelluksille kohdistuu:

* **Väliaikaisiin tiedostoihin**, jotka ovat yli 24 tuntia vanhoja
* **Lokitiedostoihin**, jotka ylittävät säilytysrajat
* **Välimuistitiedostoihin** ja väliaikaiseen dataan
* **Ladattuihin tiedostoihin**, joita ei enää tarvita
* **Heap-snapshoteihin** suorituskyvyn virheenkorjauksesta

Nämä mallit koskevat mitä tahansa Node.js -sovellusta, joka tuottaa väliaikaisia tiedostoja, lokeja tai välimuistitietoja.

### Levyn tilan hallinta Node.js -tuotannossa {#disk-space-management-for-nodejs-production}

**Meidän valvontakynnyksemme:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Jonorajat** taustaprosessointiin
* **75 % levynkäyttö** varoituskynnys
* **Automaattinen siivous** kun kynnysarvot ylittyvät

### Infrastruktuurin ylläpidon automaatio {#infrastructure-maintenance-automation}

**Meidän Ansible-automaatio Node.js -tuotantoon:**

* [Ympäristön käyttöönotto](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Julkaisujen avainten hallinta](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js -tuotannon käyttöönoton toteutusopas {#nodejs-production-deployment-implementation-guide}
### Tutki Todellista Koodiamme Tuotantokäytäntöjen Parhaiden Käytäntöjen Osalta {#study-our-actual-code-for-production-best-practices}

**Aloita näistä keskeisistä tiedostoista Node.js-tuotantoympäristön asetuksissa:**

1. **Konfigurointi:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Valvonta:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Virheenkäsittely:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Lokitus:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Prosessin terveystarkastukset:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Opi Blogikirjoituksistamme {#learn-from-our-blog-posts}

**Tekniset toteutusoppaamme Node.js-tuotantoon:**

* [NPM-pakettien ekosysteemi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Maksujärjestelmien rakentaminen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Sähköpostin yksityisyyden toteutus](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-yhteydenottolomakkeet](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React-sähköpostin integrointi](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastruktuurin automaatio Node.js-tuotantoon {#infrastructure-automation-for-nodejs-production}

**Ansible-playbookimme Node.js-tuotantoon käyttöönoton opetteluun:**

* [Täydellinen playbook-kansio](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Turvallisuuden koventaminen](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-asennus](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Case-esimerkkimme {#our-case-studies}

**Yritysratkaisumme:**

* [Linux Foundationin case-esimerkki](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntun case-esimerkki](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumnien sähköpostin edelleenlähetys](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Yhteenveto: Node.js-tuotantokäyttöönoton parhaat käytännöt {#conclusion-nodejs-production-deployment-best-practices}

Node.js-tuotantoinfrastruktuurimme osoittaa, että Node.js-sovellukset voivat saavuttaa yritystason luotettavuuden seuraavilla keinoilla:

* **Todistetut laitteistovalinnat** (AMD Ryzen 573 %:n yksiydinsuorituskyvyn optimointiin)
* **Käytännössä testattu Node.js-tuotantovalvonta** tarkkoine kynnysarvoineen ja automaattisine vasteineen
* **Älykäs virheiden luokittelu** parantamaan häiriötilanteiden hallintaa tuotantoympäristöissä
* **Edistynyt suorituskyvyn virheenkorjaus** v8-profiler-nextillä ja cpuprolla OOM-tilanteiden estämiseksi
* **Kattava turvallisuuden koventaminen** Ansible-automaatioiden avulla
* **Hybriditietokanta-arkkitehtuuri** sovelluksen tarpeisiin optimoituna
* **Automaattinen ylläpito** yleisten Node.js-tuotanto-ongelmien ehkäisemiseksi

**Keskeinen opetus:** Tutki todellisia toteutustiedostojamme ja blogikirjoituksiamme sen sijaan, että seuraisit geneerisiä parhaita käytäntöjä. Koodipohjamme tarjoaa käytännön malleja Node.js-tuotantokäyttöönottoon, joita voi soveltaa mihin tahansa Node.js-sovellukseen – verkkosovelluksiin, API:hin, mikropalveluihin tai taustapalveluihin.


## Täydellinen resurssilista Node.js-tuotantoon {#complete-resource-list-for-nodejs-production}

### Keskeiset toteutustiedostomme {#our-core-implementation-files}

* [Pääkonfiguraatio](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Pakettiriippuvuudet](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Palvelimen valvonta](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Virheiden luokittelu](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Lokitusjärjestelmä](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2-terveystarkastukset](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automaattinen siivous](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Palvelinratkaisumme {#our-server-implementations}

* [Verkkopalvelin](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-ajastin](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-palvelin](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Infrastruktuuriemme automaatio {#our-infrastructure-automation}

* [Kaikki Ansible-playbookimme](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Turvallisuuden koventaminen](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-asennus](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Tietokantakonfiguraatio](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Teknisiä blogikirjoituksiamme {#our-technical-blog-posts}

* [NPM-ekosysteemin analyysi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Maksujärjestelmän toteutus](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Sähköpostin yksityisyyden tekninen opas](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-yhteydenottolomakkeet](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React-sähköpostin integrointi](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Itseisännöity ratkaisun opas](https://forwardemail.net/blog/docs/self-hosted-solution)

### Yritysasiakastapauksemme {#our-enterprise-case-studies}

* [Linux Foundationin toteutus](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntun tapaustutkimus](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Liittovaltion hallituksen vaatimustenmukaisuus](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumnien sähköpostijärjestelmät](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
