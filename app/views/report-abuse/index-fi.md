# Ilmoita väärinkäytöstä {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Ilmoita väärinkäytöksistä ja roskapostista Forward Emailille" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Vastuuvapauslauseke](#disclaimer)
* [Kuinka tehdä väärinkäyttöilmoitus](#how-to-submit-an-abuse-report)
* [Yleisölle](#for-the-general-public)
* [Viranomaisille](#for-law-enforcement)
  * [Mitä tietoja on saatavilla](#what-information-is-available)
  * [Mitä tietoja ei ole saatavilla](#what-information-is-not-available)
  * [Yhdysvalloissa toimivat viranomaiset](#law-enforcement-based-in-the-united-states)
  * [Yhdysvaltojen ulkopuolella toimivat viranomaiset](#law-enforcement-based-outside-of-the-united-states)
  * [Viranomaisten hätäpyynnöt](#law-enforcement-emergency-requests)
  * [Viranomaisten pyynnöt voivat laukaista tilailmoituksia](#law-enforcement-requests-may-trigger-account-notices)
  * [Viranomaisten pyynnöt tietojen säilyttämiseksi](#law-enforcement-requests-to-preserve-information)
  * [Viranomaisten palveluprosessi](#law-enforcement-serving-process)


## Vastuuvapauslauseke {#disclaimer}

Tutustu [käyttöehtoihimme](/terms), sillä ne koskevat koko sivustoa.


## Kuinka tehdä väärinkäyttöilmoitus {#how-to-submit-an-abuse-report}

Käsittelemme väärinkäyttöilmoituksia ja palvelemme tietopyyntöjä [yleisölle](#for-the-general-public) ja [viranomaisille](#for-law-enforcement) tapauskohtaisesti sähköpostitse.

Käyttäjiin, sähköposteihin, IP-osoitteisiin ja/tai domaineihin liittyvät väärinkäyttöilmoitukset ja tietopyynnöt kutsutaan alla yhteisesti "Tiliksi".

Sähköpostiosoitteemme, joihin voit lähettää pyyntösi tai ilmoituksesi väärinkäytöstä, ovat: `support@forwardemail.net`, `abuse@forwardemail.net` ja `security@forwardemail.net`.

Lähetä kopio kaikille näille sähköpostiosoitteille, jos mahdollista, ja lähetä muistutussähköposteja, jos emme vastaa 24-48+ tunnin kuluessa.

Lue alla olevat osiot saadaksesi lisätietoja, jotka saattavat koskea sinua.


## Yleisölle {#for-the-general-public}

<u>**Jos sinä tai joku muu on välittömässä vaarassa, ota heti yhteys poliisiin ja hätäkeskukseen.**</u>

<u>**Sinun tulisi hakea ammatillista oikeudellista neuvontaa saadaksesi takaisin pääsyn tilillesi tai estääksesi haitallisen toimijan.**</u>

Jos olet joutunut väärinkäytöksen uhriksi tililtä, joka käyttää palveluamme, lähetä meille ilmoituksesi yllä olevaan sähköpostiosoitteeseen. Jos tilisi on kaapattu haitallisen toimijan toimesta (esim. domainisi on äskettäin vanhentunut ja kolmas osapuoli on rekisteröinyt sen uudelleen ja käyttänyt väärinkäytöksiin), lähetä meille sähköpostilla ilmoitus yllä olevaan osoitteeseen tarkkojen tilitietojesi (esim. domain-nimesi) kanssa. Voimme auttaa [varjokieltoon](https://en.wikipedia.org/wiki/Shadow_banning) tilin omistajuuden vahvistamisen jälkeen. Huomaa, että meillä ei ole valtuuksia auttaa sinua palauttamaan pääsyä tilillesi.

Oikeudellinen edustajasi saattaa neuvoa sinua ottamaan yhteyttä viranomaisiin, tilin omistajaan (esim. domain-nimen rekisterinpitäjään; verkkosivustoon, jossa rekisteröit domainin) ja/tai ohjata sinut [ICANNin sivulle kadonneista domaineista](https://www.icann.org/resources/pages/lost-domain-names).


## Viranomaisille {#for-law-enforcement}

Suurimmassa osassa pyyntöjä tietojen luovuttamista säätelee [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) ja sitä seuraavat ("ECPA"). ECPA edellyttää, että luovutamme tiettyjä käyttäjätietoja viranomaisille vain tiettyihin oikeudellisiin pyyntöihin, kuten haastehakemuksiin, tuomioistuimen määräyksiin ja kotietsintälupiin vastauksena.

Jos olet viranomaisen jäsen ja pyydät tietoja tilistä, pyynnössä tulee olla mukana tilin tiedot sekä päivämäärä- ja aikaväli. Emme voi käsitellä liian laajoja ja/tai epämääräisiä pyyntöjä – tämä on käyttäjiemme tietojen ja luottamuksen suojelemiseksi sekä ennen kaikkea heidän tietojensa turvaamiseksi.
Jos pyyntösi viittaa meille rikkomukseen meidän [Käyttöehdoissamme](/terms), käsittelemme sen sisäisten parhaiden käytäntöjemme mukaisesti väärinkäytösten käsittelyssä – huomaa, että joissain tapauksissa tämä voi johtaa Tilin keskeyttämiseen ja/tai estämiseen.

**Koska emme ole verkkotunnuksen rekisteröijä**, jos haluat hakea historiallista DNS-tietuetta verkkotunnuksesta, sinun tulisi ottaa yhteyttä kyseisen verkkotunnuksen rekisteröijään. Palvelut kuten [Security Trails]() saattavat tarjota historiallisten tietueiden hakua, mutta tarkempaa ja täsmällisempää tietoa voi saada rekisteröijältä. Selvittääksesi, kuka on verkkotunnuksen rekisteröijä ja/tai DNS-nimipalvelimien omistaja, työkalut `dig` ja `whois` voivat olla hyödyllisiä (esim. `whois example.com` tai `dig example.com ns`). Voit selvittää, onko Tili maksullisella vai ilmaisella palvelutasolla tekemällä DNS-tietuehaun (esim. `dig example.com mx` ja `dig example.com txt`). Jos MX-tietueet eivät palauta arvoja kuten `mx1.forwardemail.net` ja `mx2.forwardemail.net`, verkkotunnus ei käytä palveluamme. Jos TXT-tietueet palauttavat selkokielisen sähköpostiosoitteen (esim. `forward-email=user@example.com`), se osoittaa verkkotunnuksen sähköpostin edelleenlähetyskohteen. Jos sen sijaan palautuu arvo kuten `forward-email-site-verification=XXXXXXXXXX`, se tarkoittaa, että tili on maksullisella tasolla ja edelleenlähetysasetukset on tallennettu tietokantaamme tunnuksella `XXXXXXXXXX`. Lisätietoja palvelumme toiminnasta DNS-tasolla löydät [UKK-sivultamme](/faq).

### Mitä tietoja on saatavilla {#what-information-is-available}

Katso tietosuojakäytäntömme osio [Kerätyt tiedot](/privacy#information-collected). Tilit voivat poistaa tietonsa järjestelmästämme tietojen säilytys- ja tietosuojalakien mukaisesti; katso tietosuojakäytännöstä osio [Tietojen poistaminen](/privacy#information-removal). Tämä tarkoittaa, että pyydettyjä tietoja ei välttämättä ole saatavilla pyynnön hetkellä tilin poistamisen vuoksi.

### Mitä tietoja ei ole saatavilla {#what-information-is-not-available}

Katso tietosuojakäytännöstä osio [Keräämättömät tiedot](/privacy#information-not-collected).

### Yhdysvalloissa toimiva lainvalvonta {#law-enforcement-based-in-the-united-states}

[Lukuun ottamatta hätätilanteita](#law-enforcement-emergency-requests), jaamme tilitiedot vain voimassa olevan haasteen, ECPA:n Yhdysvaltain tuomioistuimen määräyksen ja/tai kotietsintälupauksen vastaanottamisen jälkeen.

Voimme lisäksi [ilmoittaa tilille](#law-enforcement-requests-may-trigger-account-notices) lainvalvontapyynnöstä, ellei laki tai tuomioistuimen määräys estä meitä tekemästä niin.

Jos saamme voimassa olevan haasteen, ECPA-tuomioistuimen määräyksen ja/tai kotietsintäluvan, annamme parhaamme mukaan asiaankuuluvat ja saatavilla olevat tiedot.

### Yhdysvaltojen ulkopuolella toimiva lainvalvonta {#law-enforcement-based-outside-of-the-united-states}

Vaadimme, että Yhdysvaltojen ulkopuolella toimivan lainvalvonnan pyynnöt toimitetaan jollakin seuraavista tavoista:

* Yhdysvaltain tuomioistuimen kautta.
* Täytäntöönpanoviranomaiselle [Yhdysvaltojen keskinäisen oikeudellisen avun sopimuksen](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT") mukaisesti.
* Ulkomaisen hallituksen määräyksellä, joka perustuu toimeenpanevaan sopimukseen, jonka Yhdysvaltain oikeusministeri on todennut ja sertifioinut kongressille täyttävän [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523) vaatimukset.

### Lainvalvonnan hätäpyynnöt {#law-enforcement-emergency-requests}

Kuten Yhdysvaltain laki sallii (esim. [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) ja [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), hyvässä uskossa ja pyytäjän itsenäisen varmennuksen perusteella – voimme ilman haastetta, ECPA-tuomioistuimen määräystä ja/tai kotietsintälupaa luovuttaa ja jakaa tilitietoja lainvalvonnalle, kun uskomme, että viivytyksettä toimiminen on tarpeen kuoleman tai vakavan fyysisen vamman estämiseksi.
Vaadimme, että hätätilanteen tietopyynnöt ("EDR") lähetetään sähköpostitse ja että niissä on kaikki asiaankuuluvat tiedot, jotta voimme tarjota nopean ja tehostetun käsittelyprosessin.

Huomaa, että olemme tietoisia kehittyneistä sähköpostin väärentämis-, kalastelu- ja esiintymisuhkista (esim. katso [tämä artikkeli The Guardianilta](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Politiikkamme EDR-pyyntöjen käsittelyssä on seuraava:

1. Tutkia itsenäisesti sähköpostin otsikkometatiedot (esim. DKIM/SPF/DMARC) (tai niiden puuttuminen) varmennusta varten.

2. Tehdä parhaamme hyvässä uskossa (tarvittaessa toistuvin yrityksin) ottaa itsenäisesti yhteyttä puhelimitse pyytäjään – vahvistaaksemme pyynnön aitouden. Esimerkiksi voimme tutkia pyynnön lainkäyttöalueeseen liittyvän `.gov`-verkkosivuston ja soittaa sitten virastoon heidän julkisesti listatusta virallisesta puhelinnumerostaan pyynnön vahvistamiseksi.

### Viranomaisten pyynnöt voivat laukaista tilin ilmoitukset {#law-enforcement-requests-may-trigger-account-notices}

Saatamme ilmoittaa tilille ja antaa heille kopion heihin liittyvästä viranomaispyynnöstä, ellei laki tai tuomioistuimen määräys estä meitä tekemästä niin (esim. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Näissä tapauksissa, jos sovellettavissa, voimme ilmoittaa tilille, kun salassapitoon liittyvä määräys on päättynyt.

Jos viranomaisen tietopyyntö on pätevä, [säilytämme tarvittavat ja pyydetyt tilitiedot](#law-enforcement-requests-to-preserve-information) ja teemme kohtuullisen yrityksen ottaa yhteyttä tilin omistajaan heidän rekisteröidyn ja varmennetun sähköpostiosoitteensa kautta (esim. 7 kalenteripäivän sisällä). Jos saamme ajoissa vastalauseen (esim. 7 kalenteripäivän sisällä), pidätämme tilitietojen jakamisen ja jatkamme tarvittaessa oikeudellista prosessia.

### Viranomaisten pyynnöt tietojen säilyttämiseksi {#law-enforcement-requests-to-preserve-information}

Kunnioitamme viranomaisten päteviä pyyntöjä säilyttää tilitietoja [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703) mukaisesti. Huomaa, että tietojen säilyttäminen rajoittuu vain nimenomaisesti pyydettyihin ja tällä hetkellä saatavilla oleviin tietoihin.

### Viranomaisten prosessin toimittaminen {#law-enforcement-serving-process}

Vaadimme, että kaikki pätevät viranomaispyynnöt sisältävät meille toimivan ja voimassa olevan sähköpostiosoitteen, johon voimme vastata ja toimittaa pyydetyt tiedot sähköisesti.

Kaikki pyynnöt tulee lähettää yllä olevan [Miten tehdä väärinkäytösilmoitus](#how-to-submit-an-abuse-report) -kohdassa mainittuun sähköpostiosoitteeseen.

Kaikkien viranomaispyyntöjen on oltava viraston tai osaston kirjelomakkeella (esim. PDF-skannattu liite), virallisesta ja asiaankuuluvasta sähköpostiosoitteesta lähetettyjä ja allekirjoitettuja.

Jos pyyntö koskee [hätätilanteen pyyntöä](#law-enforcement-emergency-requests), kirjoita sähköpostin Aihe-kenttään "Emergency law enforcement request".

Huomaa, että pyyntösi tarkastelu ja siihen vastaaminen voi kestää vähintään kaksi viikkoa.
