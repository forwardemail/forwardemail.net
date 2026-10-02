# Tietosuojakäytäntö {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email tietosuojakäytäntö" class="rounded-lg" /> -->


## Sisällysluettelo {#table-of-contents}

* [Vastuuvapauslauseke](#disclaimer)
* [Tietoja, joita ei kerätä](#information-not-collected)
* [Kerätyt tiedot](#information-collected)
  * [Tilitiedot](#account-information)
  * [Sähköpostin tallennus](#email-storage)
  * [Virhelokit](#error-logs)
  * [Palvelinlokit](#server-logs)
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
* [Sovellukset ja webmail](#apps-and-webmail)
  * [Tiedot laitteellasi](#data-on-your-device)
  * [Tiedot, jotka sovellukset lähettävät meille](#data-the-apps-send-us)
  * [Push-ilmoitukset](#push-notifications)
  * [Kuvat ja linkit sähköposteissa](#images-and-links-in-emails)
  * [Muut yhteydet](#other-connections)
* [Jaetut tiedot](#information-shared)
* [Tietojen poisto](#information-removal)
* [Lisäilmoitukset](#additional-disclosures)


## Vastuuvapauslauseke {#disclaimer}

Ole hyvä ja tutustu [käyttöehtoihimme](/terms), sillä ne koskevat koko sivustoa.


## Tietoja, joita ei kerätä {#information-not-collected}

**Lukuun ottamatta tässä käytännössä nimenomaisesti kuvattuja tietoja (mukaan lukien [virhelokit](#error-logs), [palvelinlokit](#server-logs), [lähtevät SMTP-sähköpostit](#outbound-smtp-emails), [tilitiedot](#account-information), [väliaikainen tietojenkäsittely](#temporary-data-processing), [tarkastuslokit](#audit-logs), [evästeet ja istunnot](#cookies-and-sessions), [analytiikka](#analytics) sekä [sovellukset ja webmail](#apps-and-webmail)):**

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
* Ensimmäinen sivu, jolla vierailit sivustollamme ja jonka polussa arvot, kuten verkkotunnukset, ID-tunnisteet ja tunnukset, on korvattu paikkamerkeillä
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
* [Nopeusrajoitukseen](/faq#do-you-have-rate-limiting) ja [harmaalistaukseen](/faq#do-you-have-a-greylist) liittyvät virhelokit eivät ole saatavilla, koska yhteys katkeaa aikaisin (esim. ennen `RCPT TO` ja `MAIL FROM` -komentojen lähettämistä).
* Tallennamme 7 päivän ajaksi myös virhelokit verkkosivusto- ja API-pyynnöistä, jotka epäonnistuvat tai kestävät liian kauan, sekä IMAP-, POP3-, CalDAV- ja CardDAV-palvelimillamme tapahtuvista virheistä.
* Nämä lokit voivat sisältää IP-osoitteen, pyynnön URL-osoitteen (mukaan lukien kyselymerkkijonot, kuten hakusanat), pyynnön otsakkeet, kuten käyttäjäagentin, sekä asianomaisen tilin tai aliaksen.
* Salasanat, API-tunnukset, evästeet ja pyyntöjen sisällöt peitetään ennen kuin nämä lokit tallennetaan.

### Palvelinlokit {#server-logs}

* Palvelimemme kirjoittavat jokaisesta verkkosivusto- ja API-pyynnöstä lokirivin, joka voi sisältää IP-osoitteen, pyynnön metodin ja URL-osoitteen (mukaan lukien kyselymerkkijonot), pyynnön otsakkeet, vastauksen tilan sekä sisäänkirjautuneen tilin.
* Käytämme näitä lokeja ongelmien löytämiseen ja korjaamiseen sekä väärinkäytösten estämiseen, ja säilytämme niitä enintään 30 päivää.

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
  * [Analytiikka](#analytics): vierailusi ensimmäinen sivu, viittaavan sivuston verkkotunnus, kampanjaparametrit (UTM) ja sivumäärä


## Analytiikka {#analytics}

Käytämme omaa yksityisyyteen keskittyvää analytiikkajärjestelmää ymmärtääksemme, miten palvelujamme käytetään. Tämä järjestelmä on suunniteltu yksityisyyden periaatteen mukaisesti:

**Mitä emme KERÄÄ:**

* Emme tallenna IP-osoitteita
* Emme aseta erillistä evästettä analytiikkaa varten
* Emme käytä kolmansien osapuolten analytiikkapalveluita
* Emme seuraa vierailijoita päivien tai istuntojen yli, kun he eivät ole kirjautuneet sisään

**Mitä KERÄÄMME:**

* Yhdistetyt sivun katselut ja palvelun käyttö (SMTP, IMAP, POP3, API jne.)
* Selain- ja käyttöjärjestelmätyyppi ja -versio (käyttäjäagentista purettu, raakadata hylätty)
* Laitetyyppi (työpöytä, mobiili, tabletti)
* Viittaavan sivuston verkkotunnus (ei koko URL-osoitetta) ja kampanjaparametrit (UTM)
* Sähköpostiohjelman tyyppi postiprotokollille (esim. Thunderbird, Outlook)
* Pyydetty sivu tai API-polku, jossa arvot, kuten verkkotunnukset, ID-tunnisteet ja tunnukset, on korvattu paikkamerkeillä, sekä tieto siitä, onnistuiko pyyntö
* Verkkosivustovierailun ensimmäinen sivu ja sivumäärä, jotka säilytetään istunnossasi (katso [Evästeet ja istunnot](#cookies-and-sessions))
* Kun olet kirjautunut sisään, tilisi, aliaksesi tai verkkotunnuksesi tunniste, jotta näemme, miten kutakin palvelua käytetään, ja voimme selvittää ongelmia

**Tietojen säilytys:**

* Analytiikkatapahtumat poistetaan automaattisesti 30 päivän kuluttua
* Tuntikohtaiset kokonaismäärät, joita ei ole liitetty mihinkään tiliin, säilytetään 90 päivää
* Istuntotunnisteet vaihtuvat päivittäin eikä niitä voi käyttää vierailijoiden seuraamiseen päivien yli


## Sovellukset ja webmail {#apps-and-webmail}

Tämä osio koskee sähköpostisovelluksiamme iOS:lle, Androidille, macOS:lle, Windowsille ja Linuxille sekä webmail-palveluamme osoitteessa <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, jotka jakavat saman koodin. Sovellukset eivät sisällä mainos- tai seurantakoodia eivätkä kolmansien osapuolten analytiikkaa.

### Tiedot laitteellasi {#data-on-your-device}

* Sovellukset tallentavat sähköpostisi, yhteystietosi, kalenterisi, asetuksesi ja kirjautumistietosi laitteellesi, jotta ne latautuvat nopeasti ja toimivat myös ilman verkkoyhteyttä.
* Jos otat käyttöön App Lock -toiminnon, sovellus salaa tallennettujen sähköpostien sisällön, yhteystiedot ja kirjautumistiedot avaimella, jota suojaa PIN-koodisi tai pääsyavaimesi. Päivämäärät, kansiot, tunnisteet ja liput jäävät salaamatta, jotta sovellus voi lajitella ja laskea sähköpostisi.
* Kun kirjaudut ulos tililtä, sen tiedot poistetaan laitteeltasi.

### Tiedot, jotka sovellukset lähettävät meille {#data-the-apps-send-us}

* Aliaksesi sähköpostiosoite ja salasana lähetetään jokaisen pyynnön mukana, jotta voimme kirjata sinut sisään.
* Sähköpostit, yhteystiedot, kalenterit, tunnisteet ja suodattimet, joita lähetät, luot tai muutat. Tallennamme sähköpostit, yhteystiedot ja kalenterit kohdassa [Sähköpostin tallennus](#email-storage) kuvatulla tavalla ja lähettämäsi sähköpostit kohdassa [Lähtevät SMTP-sähköpostit](#outbound-smtp-emails) kuvatulla tavalla.
* Hakusanasi, jotta voimme hakea postilaatikostasi palvelimillamme. Hakusanat ovat osa pyynnön URL-osoitetta, joten ne voivat näkyä [virhelokeissa](#error-logs) ja [palvelinlokeissa](#server-logs).
* Palaute, jonka päätät lähettää sovelluksesta. Se lähetetään sähköpostina aliaksestasi tukitiimillemme yhdessä niiden diagnostiikkatietojen kanssa, jotka päätät liittää mukaan.
* Sähköpostit, jotka ilmoitat roskapostiksi. Sovellus välittää ne väärinkäytöksiä käsittelevälle tiimillemme (tai muuhun osoitteeseen, jonka määrität kohdassa Settings).

### Push-ilmoitukset {#push-notifications}

* Kun sallit ilmoitukset, sovellus rekisteröi push-tunnuksen palveluumme. Tallennamme sen yhdessä alustan, siihen liittyvän aliaksen ja tilin, sen viimeisimmän toimituksen ajankohdan ja laitenimen kanssa. Laitenimi otetaan sovelluksen käyttäjäagentista, joka sisältää käyttöjärjestelmäsi version ja Androidissa laitteesi mallin.
* Säilytämme push-tunnusta enintään yhden vuoden ajan sen viimeisestä käytöstä. Poistamme sen aiemmin, jos kirjaudut ulos sovelluksesta, jos toimitus epäonnistuu kolme kertaa peräkkäin, jos aliaksen salasana vaihtuu, jos poistat aliaksen tai tilisi tai jos alias siirtyy toiselle omistajalle.
* iOS:ssä ja macOS:ssä ilmoitukset kulkevat Apple Push Notification service -palvelun kautta. Google Play -kaupasta ladattavassa Android-sovelluksessamme ne kulkevat Firebase Cloud Messaging -palvelun kautta. Ilmoitukset uusista sähköposteista sisältävät lähettäjän nimen ja osoitteen, aiheen, lyhyen esikatselun ja kansion nimen myös silloin, kun sähköposti saapuu ilman näkyvää ilmoitusta, esimerkiksi kun se tallennetaan Roskaposti- tai Lähetetyt-kansioon. Kun sähköpostit, kalenterit tai yhteystiedot muuttuvat, lähetämme myös hiljaisia ilmoituksia, joissa on ID-tunnisteita mutta ei sähköpostien sisältöä, jotta sovellus pysyy ajan tasalla.
* Kun käytät Androidissa [UnifiedPush](https://unifiedpush.org/)-ilmoituksia tai ilmoituksia verkkoselaimessa, jokainen ilmoitus salataan niin, että vain laitteesi voi lukea sen.
* Google Play -kaupasta ladattava Android-sovelluksemme sisältää Firebase Cloud Messaging -palvelun, joka lähettää Googlelle Firebase-asennustunnuksen, sovelluksen version sekä laite- ja SDK-tiedot. GitHubista ladattava Google-vapaa Android-sovelluksemme ei sisällä Firebasea.

### Kuvat ja linkit sähköposteissa {#images-and-links-in-emails}

* Sähköpostien kuvat ladataan lähettäjän palvelimilta, jotka voivat nähdä IP-osoitteesi ja sen, milloin kuvat ladattiin.
* Sovellukset estävät seurantapikselit oletuksena. Voit myös estää kaikki ulkoiset kuvat kohdassa Settings > Privacy & Security ja ladata ne sitten yksi sähköposti kerrallaan.
* Sähköpostien linkit avautuvat verkkoselaimessasi.

### Muut yhteydet {#other-connections}

* Webmail-palvelumme kysyy GitHubilta uusinta versiotaan, kun se latautuu, kun palaat siihen ja 10 minuutin välein sen ollessa auki. About & Help -kohta kysyy GitHubilta uusinta työpöytäversiota, ja työpöytäsovellukset tarkistavat päivitykset GitHubista. GitHub saa IP-osoitteesi näiden pyyntöjen yhteydessä.


## Jaettu tieto {#information-shared}

Emme jaa tietojasi kolmansille osapuolille lukuun ottamatta palveluntarjoajia, jotka hoitavat osia palvelustamme, kuten Cloudflare (verkkosivuston suojaus ja salatut varmuuskopiot), Stripe ja PayPal (maksut), sekä palveluita, jotka toimittavat push-ilmoitukset laitteillesi (katso [Push-ilmoitukset](#push-notifications)).

Saatamme joutua noudattamaan tuomioistuimen määräyksiä (mutta pidä mielessä, että [emme kerää yllä mainittuja tietoja kohdassa "Tietoja, joita ei kerätä"](#information-not-collected), joten emme pysty toimittamaan niitä).


## Tietojen poisto {#information-removal}

Jos haluat milloin tahansa poistaa meille antamiasi tietoja, siirry kohtaan <a href="/my-account/security">Oma tili > Turvallisuus</a> ja klikkaa "Poista tili".

Väärinkäytösten estämiseksi tilisi poisto saattaa vaatia ylläpitäjiemme manuaalisen tarkistuksen, jos poistat sen 5 päivän sisällä ensimmäisestä maksustasi.

Tämä prosessi kestää yleensä alle 24 tuntia ja se otettiin käyttöön, koska käyttäjät spämmasivat palveluamme ja poistoivat tilinsä nopeasti – mikä esti meitä estämästä heidän maksutapojensa tunnisteita Stripe-palvelussa.

Kun poistat tilisi, myös hallinnoimasi verkkotunnukset, aliaksesi ja niille rekisteröidyt push-tunnukset poistetaan. Itse tilitietue säilyy, mutta sen sähköpostiosoite, laskutustiedot, salasana ja pääsyavaimet poistetaan ja sen kaksivaiheinen todennus ja API-tunnus kumotaan, ja säilytämme sen maksutietueet hyvityksiä ja kirjanpitoa varten. Tiliisi viittaavat lokit ja analytiikkatiedot poistetaan yllä kuvattujen aikataulujen mukaisesti.

Jos haluat poistaa sovellusten tiedot laitteelta, kirjaudu ulos sovelluksesta tai poista sen asennus.


## Lisäilmoitukset {#additional-disclosures}

Tätä sivustoa suojaa Cloudflare ja sen [Tietosuojakäytäntö](https://www.cloudflare.com/privacypolicy/) sekä [Palveluehdot](https://www.cloudflare.com/website-terms/) ovat voimassa.
