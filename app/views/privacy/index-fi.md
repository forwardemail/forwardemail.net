# Tietosuojakäytäntö {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email tietosuojakäytäntö" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Vastuuvapauslauseke](#disclaimer)
* [Tietoja, joita ei kerätä](#information-not-collected)
* [Kerätyt tiedot](#information-collected)
  * [Tilitiedot](#account-information)
  * [Sähköpostin tallennus](#email-storage)
  * [Virhelokit](#error-logs)
  * [Lähtevät SMTP-sähköpostit](#outbound-smtp-emails)
* [Väliaikainen tietojenkäsittely](#temporary-data-processing)
  * [Nopeusrajoitus](#rate-limiting)
  * [Yhteyden seuranta](#connection-tracking)
  * [Todennusyritykset](#authentication-attempts)
* [Tarkastuslokit](#audit-logs)
  * [Tilin muutokset](#account-changes)
  * [Verkkotunnuksen asetusten muutokset](#domain-settings-changes)
* [Evästeet ja istunnot](#cookies-and-sessions)
* [Analytiikka](#analytics)
* [Jaetut tiedot](#information-shared)
* [Tietojen poisto](#information-removal)
* [Lisäilmoitukset](#additional-disclosures)


## Vastuuvapauslauseke {#disclaimer}

Ole hyvä ja tutustu [käyttöehtoihimme](/terms), sillä ne koskevat koko sivustoa.


## Tietoja, joita ei kerätä {#information-not-collected}

**Lukuun ottamatta tässä käytännössä nimenomaisesti kuvattuja tietoja — mukaan lukien [virhelokit](#error-logs), [lähtevät SMTP-sähköpostit](#outbound-smtp-emails), [tilitiedot](#account-information), [väliaikainen tietojenkäsittely](#temporary-data-processing), [tarkastuslokit](#audit-logs) sekä [evästeet ja istunnot](#cookies-and-sessions):**

* Emme tallenna mitään edelleenlähetettyjä sähköposteja levytilaan tai tietokantoihin.
* Emme tallenna mitään metatietoja edelleenlähetetyistä sähköposteista levytilaan tai tietokantoihin.
* Lukuun ottamatta sitä, mitä tässä käytännössä on nimenomaisesti kuvattu, emme tallenna lokeja tai IP-osoitteita levytilaan tai tietokantoihin.
* Emme käytä mitään kolmannen osapuolen analytiikka- tai telemetriapalveluja.


## Kerätyt tiedot {#information-collected}

Läpinäkyvyyden vuoksi voit milloin tahansa <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">katsoa lähdekoodimme</a> nähdäksesi, miten alla olevat tiedot kerätään ja käytetään.

**Ainoastaan toiminnallisuuden varmistamiseksi ja palvelumme parantamiseksi keräämme ja tallennamme turvallisesti seuraavat tiedot:**

### Tilitiedot {#account-information}

* Tallennamme sähköpostiosoitteesi, jonka annat meille.
* Tallennamme verkkotunnuksesi, aliaksesi ja asetuksesi, jotka annat meille.
* Tallennamme rajoitetusti tilin turvallisuuteen liittyviä metatietoja, joita tarvitaan tilisi suojaamiseen ja pääsyn hallintaan, mukaan lukien aktiiviset verkkosivuston istuntotunnisteet, epäonnistuneiden kirjautumisyritysten laskurit ja viimeisimmän kirjautumisyrityksen aikaleiman.
* Kaikki lisätiedot, jotka annat meille vapaaehtoisesti, kuten kommentit tai kysymykset, jotka lähetät meille sähköpostitse tai <a href="/help">help</a>-sivullamme.


**Rekisteröitymisen lähdetieto** (tallennetaan pysyvästi tilillesi):

Kun luot tilin, tallennamme seuraavat tiedot ymmärtääksemme, miten käyttäjät löytävät palvelumme:

* Viittaavan verkkosivuston verkkotunnus (ei koko URL-osoitetta)
* Ensimmäinen sivu, jolla vierailit sivustollamme
* UTM-kampanjaparametrit, jos ne ovat URL-osoitteessa

### Sähköpostin tallennus {#email-storage}

* Tallennamme sähköpostit ja kalenteritiedot [salattuun SQLite-tietokantaasi](/blog/docs/best-quantum-safe-encrypted-email-service) ainoastaan IMAP/POP3/CalDAV/CardDAV-käyttöäsi ja postilaatikon toiminnallisuutta varten.
  * Huomaa, että jos käytät vain sähköpostin edelleenlähetyspalvelujamme, sähköposteja ei tallenneta levylle tai tietokantaan kuten kohdassa [Tietoja, joita ei kerätä](#information-not-collected) on kuvattu.
  * Sähköpostin edelleenlähetyspalvelumme toimivat ainoastaan muistissa (ei kirjoiteta levylle tai tietokantoihin).
  * IMAP/POP3/CalDAV/CardDAV-tallennus on salattu levyllä, salattu siirron aikana ja tallennettu LUKS-salattuun levyyn.
  * Varmuuskopiot IMAP/POP3/CalDAV/CardDAV-tallennuksestasi ovat salattuja levyllä, salattuja siirron aikana ja tallennettu [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Virhelokit {#error-logs}

* Tallennamme `4xx` ja `5xx` SMTP-vastauskoodien [virhelokit](/faq#do-you-store-error-logs) 7 päivän ajaksi.
* Virhelokit sisältävät SMTP-virheen, kirjekuoren ja sähköpostin otsikot (emme **tallenna** sähköpostin sisältöä tai liitteitä).
* Virhelokit voivat sisältää IP-osoitteita ja lähettävien palvelimien isäntänimiä vianmääritystä varten.
* Nopeusrajoitukseen (/faq#do-you-have-rate-limiting) ja harmaalistaukseen (/faq#do-you-have-a-greylist) liittyvät virhelokit eivät ole saatavilla, koska yhteys katkeaa aikaisin (esim. ennen `RCPT TO` ja `MAIL FROM` -komentojen lähettämistä).
### Lähtevät SMTP-sähköpostit {#outbound-smtp-emails}

* Tallennamme [lähteviä SMTP-sähköposteja](/faq#do-you-support-sending-email-with-smtp) noin 30 päivän ajan.
  * Tämä aika vaihtelee "Date"-otsikon mukaan; koska sallimme sähköpostien lähettämisen tulevaisuuteen, jos tulevaisuuden "Date"-otsikko on olemassa.
  * **Huomaa, että kun sähköposti on onnistuneesti toimitettu tai pysyvästi virheellinen, poistamme ja tuhoamme viestin sisällön.**
  * Jos haluat määrittää lähtevän SMTP-sähköpostiviestin sisällön säilytettäväksi pidempään kuin oletusarvoinen 0 päivää (onnistuneen toimituksen tai pysyvän virheen jälkeen), siirry verkkotunnuksesi Lisäasetuksiin ja anna arvo väliltä `0`–`30`.
  * Jotkut käyttäjät käyttävät mielellään [Oma tili > Sähköpostit](/my-account/emails) -esikatselutoimintoa nähdäksesi, miten heidän sähköpostinsa renderöityvät, joten tuemme konfiguroitavaa säilytysaikaa.
  * Huomaa myös, että tuemme [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Väliaikainen tietojenkäsittely {#temporary-data-processing}

Seuraavia tietoja käsitellään väliaikaisesti muistissa tai Redisissä, eikä niitä tallenneta pysyvästi:

### Nopeuden rajoitus {#rate-limiting}

* IP-osoitteita käytetään väliaikaisesti Redisissä nopeuden rajoittamiseen.
* Nopeuden rajoitustiedot vanhenevat automaattisesti (yleensä 24 tunnin sisällä).
* Tämä estää väärinkäytökset ja varmistaa palveluidemme oikeudenmukaisen käytön.

### Yhteyksien seuranta {#connection-tracking}

* Samanaikaisten yhteyksien määrää seurataan IP-osoitteittain Redisissä.
* Tämä tieto vanhenee automaattisesti, kun yhteydet suljetaan tai lyhyen aikakatkaisun jälkeen.
* Käytetään yhteyksien väärinkäytön estämiseen ja palvelun saatavuuden varmistamiseen.

### Todennusyritykset {#authentication-attempts}

* Epäonnistuneita todennusyrityksiä seurataan IP-osoitekohtaisesti Rediksessä.
* Tallennamme myös rajoitetusti tilitason todennusmetatietoja, mukaan lukien epäonnistuneiden kirjautumisyritysten laskurit ja viimeisimmän kirjautumisyrityksen aikaleiman.
* Redis-pohjaiset todennusyritysten tiedot vanhenevat automaattisesti (yleensä 24 tunnin kuluessa).
* Käytetään estämään käyttäjätileihin kohdistuvia väsytyshyökkäyksiä.


## Tarkastuslokit {#audit-logs}

Auttaaksemme sinua valvomaan ja suojaamaan tiliäsi ja verkkotunnuksiasi ylläpidämme tarkastuslokitietoja tietyistä muutoksista. Näitä lokeja käytetään lähettämään ilmoitussähköposteja tilin haltijoille ja verkkotunnusten ylläpitäjille.

### Tilin muutokset {#account-changes}

* Seuraamme tärkeitä tilin asetusten muutoksia (esim. kaksivaiheinen todennus, näyttönimi, aikavyöhyke).
* Kun muutoksia havaitaan, lähetämme ilmoitussähköpostin rekisteröityyn sähköpostiosoitteeseesi.
* Arkaluonteiset kentät (esim. salasana, API-tunnukset, palautusavaimet) seurataan, mutta niiden arvot peitetään ilmoituksissa.
* Tarkastuslokimerkinnät poistetaan ilmoitussähköpostin lähettämisen jälkeen.

### Verkkotunnuksen asetusten muutokset {#domain-settings-changes}

Monen ylläpitäjän verkkotunnuksille tarjoamme yksityiskohtaisen tarkastuslokituksen, joka auttaa tiimejä seuraamaan konfiguraatiomuutoksia:

**Mitä seuraamme:**

* Verkkotunnuksen asetusten muutokset (esim. bounce-webhookit, roskapostisuodatus, DKIM-konfiguraatio)
* Kuka teki muutoksen (käyttäjän sähköpostiosoite)
* Milloin muutos tehtiin (aikaleima)
* IP-osoite, josta muutos tehtiin
* Selaimen/asiakasohjelman user-agent-merkkijono

**Miten se toimii:**

* Kaikki verkkotunnuksen ylläpitäjät saavat yhden koontisähköpostin, kun asetukset muuttuvat.
* Ilmoituksessa on taulukko, joka näyttää jokaisen muutoksen, käyttäjän, IP-osoitteen ja aikaleiman.
* Arkaluonteiset kentät (esim. webhook-avaimet, API-tunnukset, DKIM-yksityisavaimet) seurataan, mutta niiden arvot peitetään.
* User-agent-tiedot sisältyvät laajennettavaan "Tekniset tiedot" -osioon.
* Tarkastuslokimerkinnät poistetaan ilmoitussähköpostin lähettämisen jälkeen.

**Miksi keräämme tätä:**

* Auttaaksemme verkkotunnuksen ylläpitäjiä ylläpitämään turvallisuusvalvontaa
* Mahdollistaa tiimien tarkastaa, kuka teki konfiguraatiomuutokset
* Auttaa vianmäärityksessä, jos odottamattomia muutoksia tapahtuu
* Tarjoaa vastuullisuuden jaon verkkotunnuksen hallinnassa


## Evästeet ja istunnot {#cookies-and-sessions}

* Tallennamme HttpOnly-muotoisia, allekirjoitettuja evästeitä ja palvelinpuolen istuntotietoja verkkosivustosi liikennettä varten.
* Evästeet käyttävät SameSite-suojausta.
* Tallennamme aktiiviset verkkosivuston istuntotunnisteet tilillesi tukeaksemme ominaisuuksia kuten "log out other devices" ja turvallisuuteen liittyvää istunnon mitätöintiä.
* Istuntoevästeet vanhenevat 30 päivän toimettomuuden jälkeen.
* Emme luo istuntoja boteille tai indeksoijille.
* Käytämme evästeitä ja istuntoja seuraaviin tarkoituksiin:
  * Todennus ja kirjautumistila
  * Kaksivaiheisen todennuksen "remember me" -toiminnallisuus
  * Flash-viestit ja ilmoitukset


## Analytiikka {#analytics}

Käytämme omaa yksityisyyteen keskittyvää analytiikkajärjestelmää ymmärtääksemme, miten palvelujamme käytetään. Tämä järjestelmä on suunniteltu yksityisyyden periaatteen mukaisesti:

**Mitä emme KERÄÄ:**

* Emme tallenna IP-osoitteita
* Emme käytä evästeitä tai pysyviä tunnisteita analytiikkaan
* Emme käytä kolmansien osapuolten analytiikkapalveluita
* Emme seuraa käyttäjiä päivien tai istuntojen yli

**Mitä KERÄÄMME (anonymisoituna):**

* Yhdistetyt sivun katselut ja palvelun käyttö (SMTP, IMAP, POP3, API jne.)
* Selain- ja käyttöjärjestelmätyyppi (käyttäjäagentista purettu, raakadata hylätty)
* Laitetyyppi (työpöytä, mobiili, tabletti)
* Viittaavan sivuston verkkotunnus (ei koko URL-osoitetta)
* Sähköpostiohjelman tyyppi postiprotokollille (esim. Thunderbird, Outlook)

**Tietojen säilytys:**

* Analytiikkadata poistetaan automaattisesti 30 päivän kuluttua
* Istuntotunnisteet vaihtuvat päivittäin eikä niitä voi käyttää käyttäjien seuraamiseen päivien yli


## Jaettu tieto {#information-shared}

Emme jaa tietojasi kolmansille osapuolille.

Saatamme joutua noudattamaan tuomioistuimen määräyksiä (mutta pidä mielessä, että [emme kerää yllä mainittuja tietoja kohdassa "Tietoja, joita ei kerätä"](#information-not-collected), joten emme pysty toimittamaan niitä).


## Tietojen poisto {#information-removal}

Jos haluat milloin tahansa poistaa meille antamiasi tietoja, siirry kohtaan <a href="/my-account/security">Oma tili > Turvallisuus</a> ja klikkaa "Poista tili".

Väärinkäytösten estämiseksi tilisi poisto saattaa vaatia ylläpitäjiemme manuaalisen tarkistuksen, jos poistat sen 5 päivän sisällä ensimmäisestä maksustasi.

Tämä prosessi kestää yleensä alle 24 tuntia ja se otettiin käyttöön, koska käyttäjät spämmasivat palveluamme ja poistoivat tilinsä nopeasti – mikä esti meitä estämästä heidän maksutapojensa tunnisteita Stripe-palvelussa.


## Lisäilmoitukset {#additional-disclosures}

Tätä sivustoa suojaa Cloudflare ja sen [Tietosuojakäytäntö](https://www.cloudflare.com/privacypolicy/) sekä [Palveluehdot](https://www.cloudflare.com/website-terms/) ovat voimassa.
