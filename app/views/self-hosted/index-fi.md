# Itse isännöity {#self-hosted}

## Sisällysluettelo {#table-of-contents}

* [Aloittaminen](#getting-started)
* [Vaatimukset](#requirements)
  * [Pilvialustus / Käyttäjätiedot](#cloud-init--user-data)
* [Asentaa](#install)
  * [Virheenkorjausasennusskripti](#debug-install-script)
  * [Kehotteet](#prompts)
  * [Alkuasetukset (vaihtoehto 1)](#initial-setup-option-1)
* [Palvelut](#services)
  * [Tärkeät tiedostopolut](#important-file-paths)
* [Kokoonpano](#configuration)
  * [DNS-alkuasetukset](#initial-dns-setup)
* [Perehdytys](#onboarding)
* [Testaus](#testing)
  * [Ensimmäisen aliaksen luominen](#creating-your-first-alias)
  * [Ensimmäisen sähköpostin lähettäminen / vastaanottaminen](#sending--receiving-your-first-email)
* [Vianmääritys](#troubleshooting)
  * [Mikä on perusvaltuutuksen käyttäjätunnus ja salasana?](#what-is-the-basic-auth-username-and-password)
  * [Mistä tiedän, mikä on käynnissä](#how-do-i-know-what-is-running)
  * [Mistä tiedän, jos jokin ei toimi, vaikka sen pitäisi toimia](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Miten löydän lokit](#how-do-i-find-logs)
  * [Miksi lähtevät sähköpostini aikakatkaistaan](#why-are-my-outgoing-emails-timing-out)

## Aloittaminen {#getting-started}

Itse isännöity sähköpostiratkaisumme, kuten kaikki tuotteemme, on 100 % avoimen lähdekoodin – sekä käyttöliittymän että taustajärjestelmän osalta. Tämä tarkoittaa:

1. **Täydellinen läpinäkyvyys**: Jokainen sähköpostiasi käsittelevä koodirivi on julkisesti tarkasteltavissa.
2. **Yhteisön panokset**: Kuka tahansa voi osallistua parannuksiin tai korjata ongelmia.
3. **Turvallisuus avoimuuden kautta**: Haavoittuvuudet voidaan tunnistaa ja korjata globaalin yhteisön toimesta.
4. **Ei toimittajasidonnaisuutta**: Et ole koskaan riippuvainen yrityksemme olemassaolosta.

Koko koodikanta on saatavilla GitHubissa osoitteessa <https://github.com/forwardemail/forwardemail.net>, MIT-lisenssin alaisuudessa.

Arkkitehtuuri sisältää säilöt seuraaville:

* SMTP-palvelin lähtevälle sähköpostille
* IMAP/POP3-palvelimet sähköpostin noutamiseen
* Web-käyttöliittymä hallintaan
* Tietokanta konfiguraation tallentamiseen
* Redis välimuistin ja suorituskyvyn parantamiseen
* SQLite turvalliseen ja salattuun postilaatikoiden tallennukseen

> \[!NOTE]
> Muista tutustua [itse isännöity blogi](https://forwardemail.net/blog/docs/self-hosted-solution)-oppaaseemme
>
> Ja jos olet kiinnostunut yksityiskohtaisemmasta vaiheittaisesta versiosta, katso [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- tai [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-pohjaiset oppaamme.

## Vaatimukset {#requirements}

Ennen asennusskriptin suorittamista varmista, että sinulla on seuraavat:

* **Käyttöjärjestelmä**: Linux-pohjainen palvelin (tukee tällä hetkellä Ubuntu 22.04+).
* **Resurssit**: 1 vCPU ja 2 Gt RAM-muistia
* **Pääkäyttäjän oikeudet**: Järjestelmänvalvojan oikeudet komentojen suorittamiseen.
* **Verkkotunnus**: Mukautettu verkkotunnus, joka on valmis DNS-konfigurointiin.
* **Puhdas IP-osoite**: Varmista, että palvelimellasi on puhdas IP-osoite, jolla ei ole aiempaa roskapostimainetta, tarkistamalla mustat listat. Lisätietoja [tässä](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Julkinen IP-osoite portin 25 tuella
* Mahdollisuus asettaa [käänteinen PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- ja IPv6-tuki

> \[!TIP]
> Katso luettelomme [mahtavia sähköpostipalvelinten tarjoajia](https://github.com/forwardemail/awesome-mail-server-providers)-kohteista

### Pilvi-init / Käyttäjätiedot {#cloud-init--user-data}

Useimmat pilvipalveluntarjoajat tukevat pilvipohjaista init-määritystä virtuaalisen yksityispalvelimen (VPS) käyttöönottoa varten. Tämä on loistava tapa asettaa joitakin tiedostoja ja ympäristömuuttujia etukäteen skriptien alkuasennuslogiikan käyttöön, jolloin skriptiä ei tarvitse pyytää lisätietoja suorituksen aikana.

**Asetukset**

* `EMAIL` - sähköpostiosoite, jota käytetään certbotin vanhenemismuistutuksiin
* `DOMAIN` - mukautettu verkkotunnus (esim. `example.com`), jota käytetään omatoimisen ylläpidon määrittämiseen
* `AUTH_BASIC_USERNAME` - käyttäjätunnus, jota käytettiin ensimmäisessä määrityksessä sivuston suojaamiseksi
* `AUTH_BASIC_PASSWORD` - salasana, jota käytettiin ensimmäisessä määrityksessä sivuston suojaamiseksi
* `/root/.cloudflare.ini` - (**Vain Cloudflaren käyttäjille**) cloudflaren määritystiedosto, jota certbot käyttää DNS-määritykseen. Se edellyttää API-tunnuksen asettamista `dns_cloudflare_api_token`:n kautta. Lue lisää [tässä](https://certbot-dns-cloudflare.readthedocs.io/en/stable/):stä.

Esimerkki:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Asenna {#install}

Suorita seuraava komento palvelimellasi ladataksesi ja suorittaaksesi asennusskriptin:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Virheenkorjausasennusskripti {#debug-install-script}

Lisää `DEBUG=true` asennusskriptin eteen saadaksesi yksityiskohtaisen tulosteen:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Kehotteet {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Alkuasetukset**: Lataa uusin sähköpostin edelleenlähetyskoodi, määritä ympäristö, kysy mukautettua verkkotunnustasi ja määritä kaikki tarvittavat varmenteet, avaimet ja salaisuudet.
* **Varmuuskopioinnin määrittäminen**: Määrittää cronin varmuuskopioimaan mongoDB:n ja redisin S3-yhteensopivaan tallennustilaan turvallista etätallennusta varten. SQLite varmuuskopioidaan erikseen kirjautumisen yhteydessä, jos turvallisia, salattuja varmuuskopioita varten tehdään muutoksia.
* **Päivityksen määrittäminen**: Määritä cron etsimään yöllisiä päivityksiä, jotka rakentavat infrastruktuurikomponentit uudelleen ja käynnistävät ne uudelleen turvallisesti.
* **Uusi varmenteet**: Certbot /lets encrypt -komentoa käytetään SSL-varmenteille, ja avaimet vanhenevat 3 kuukauden välein. Tämä uusii verkkotunnuksesi varmenteet ja sijoittaa ne tarvittavaan kansioon, jotta niihin liittyvät komponentit voivat käyttää niitä. Katso [tärkeät tiedostopolut](#important-file-paths)
* **Palauta varmuuskopiosta**: Käynnistää mongodb:n ja redisin palauttamaan tiedot varmuuskopiosta.

### Alkuasetukset (vaihtoehto 1) {#initial-setup-option-1}

Aloita valitsemalla vaihtoehto `1. Initial setup`.

Kun prosessi on valmis, sinun pitäisi nähdä onnistumisviesti. Voit jopa ajaa `docker ps`-komennon nähdäksesi komponenttien käynnistyvän. Lisätietoja komponenteista alla.

## Palvelut {#services}

| Palvelun nimi | Oletusportti | Kuvaus |
| ------------ | :----------: | ------------------------------------------------------ |
| Verkko | `443` | Verkkokäyttöliittymä kaikille järjestelmänvalvojan vuorovaikutuksille |
| API | `4000` | API-kerros abstrakteihin tietokantoihin |
| Bree | Ei mitään | Taustatyö ja tehtävien suorittaja |
| SMTP | `465/587` | SMTP-palvelin lähtevälle sähköpostille |
| SMTP Bree | Ei mitään | SMTP-taustatyö |
| MX | `2525` | Saapuvan sähköpostin vaihto ja sähköpostin edelleenlähetys |
| IMAP | `993/2993` | IMAP-palvelin saapuvan sähköpostin ja postilaatikon hallintaan |
| POP3 | `995/2995` | POP3-palvelin saapuvan sähköpostin ja postilaatikon hallintaan |
| SQLite | `3456` | SQLite-palvelin SQLite-tietokantojen kanssa vuorovaikutukseen |
| SQLite Bree | Ei mitään | SQLite-taustatyö |
| CalDAV | `5000` | CalDAV-palvelin kalenterin hallintaan |
| CardDAV | `6000` | CardDAV-palvelin kalenterin hallintaan |
| MongoDB | `27017` | MongoDB-tietokanta useimpiin tiedonhallinnan tarpeisiin |
| Redis | `6379` | Redis välimuistiin ja tilanhallintaan |
| SQLite | Ei mitään | SQLite-tietokanta(t) salatuille postilaatikoille |

### Tärkeät tiedostopolut {#important-file-paths}

Huomautus: Alla oleva *Isäntäpolku* on suhteessa `/root/forwardemail.net/self-hosting/`:aan.

| Komponentti | Isäntäpolku | Säiliön polku |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-tiedosto | `./.env` | `/app/.env` |
| SSL-varmenteet/avaimet | `./ssl` | `/app/ssl/` |
| Yksityinen avain | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Koko ketjun sertifikaatti | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Sertifioidut varmentajat | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM-yksityinen avain | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Tallenna `.env`-tiedosto turvallisesti. Se on kriittinen palautusta varten mahdollisen virheen sattuessa.
> Löydät sen kansiosta `/root/forwardemail.net/self-hosting/.env`.

##-määritys {#configuration}

### DNS-alkuasetukset {#initial-dns-setup}

Määritä valitsemassasi DNS-palveluntarjoajassa asianmukaiset DNS-tietueet. Huomaa, että hakasulkeissa (`<>`) olevat tiedot ovat dynaamisia ja ne on päivitettävä määrittämälläsi arvolla.

| Tyyppi | Nimi | Sisältö | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." tai tyhjä | <ip-osoite> | auto |
| CNAME | API | <verkkotunnuksen_nimi> | auto |
| CNAME | caldav | <verkkotunnuksen_nimi> | auto |
| CNAME | carddav | <verkkotunnuksen_nimi> | auto |
| CNAME | fe-pomppii | <verkkotunnuksen_nimi> | auto |
| CNAME | IMAP | <verkkotunnuksen_nimi> | auto |
| CNAME | mx | <verkkotunnuksen_nimi> | auto |
| CNAME | pop3 | <verkkotunnuksen_nimi> | auto |
| CNAME | smtp | <verkkotunnuksen_nimi> | auto |
| MX | "@", "." tai tyhjä | mx.<verkkotunnuksen_nimi> (prioriteetti 0) | auto |
| TXT | "@", "." tai tyhjä | "v=spf1 a-all" | auto |

#### Käänteinen DNS/PTR-tietue {#reverse-dns--ptr-record}

Käänteisen DNS:n (rDNS) tai käänteisen osoittimen (PTR) tietueet ovat välttämättömiä sähköpostipalvelimille, koska ne auttavat varmistamaan sähköpostia lähettävän palvelimen oikeellisuuden. Jokainen pilvipalveluntarjoaja tekee tämän eri tavalla, joten sinun on etsittävä, miten "Käänteinen DNS" lisätään isännän ja IP-osoitteen yhdistämiseksi vastaavaan isäntänimeen. Todennäköisesti se löytyy palveluntarjoajan verkko-osiosta.

#### Portti 25 estetty {#port-25-blocked}

Jotkut internet-palveluntarjoajat ja pilvipalveluntarjoajat estävät portin 25 välttääkseen haitallisia toimijoita. Sinun on ehkä lähetettävä tukipyyntö avataksesi portin 25 SMTP:lle / lähtevälle sähköpostille.

## Käyttöönotto {#onboarding}

1. Avaa aloitussivu
Siirry osoitteeseen https\://\<verkkotunnus> ja korvaa \<verkkotunnus> DNS-asetuksissasi määritetyllä verkkotunnuksella. Sinun pitäisi nähdä Sähköpostin välitys -aloitussivu.

2. Kirjaudu sisään ja lisää verkkotunnuksesi

* Kirjaudu sisään voimassa olevalla sähköpostiosoitteella ja salasanalla.
* Anna verkkotunnus, jonka haluat määrittää (tämän on vastattava DNS-määritystä).
* Lisää vaaditut **MX**- ja **TXT**-tietueet vahvistusta varten noudattamalla ohjeita.

3. Suorita asennus loppuun

* Kun olet vahvistanut aliaksesi, siirry Alias-sivulle luodaksesi ensimmäisen aliaksesi.

* Voit halutessasi määrittää **SMTP lähtevälle sähköpostille** **Verkkotunnuksen asetuksissa**. Tämä vaatii lisää DNS-tietueita.

> \[!NOTE]
> Palvelimesi ulkopuolelle ei lähetetä tietoja. Itse isännöity vaihtoehto ja alkuperäinen tili on tarkoitettu vain järjestelmänvalvojan kirjautumiseen ja verkkonäkymään verkkotunnusten, aliasten ja niihin liittyvien sähköpostimääritysten hallintaan.

## Testataan {#testing}

### Ensimmäisen aliaksen luominen {#creating-your-first-alias}

1. Siirry Aliaksien sivulle
Avaa aliasten hallintasivu:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Lisää uusi alias

* Napsauta **Lisää alias** (oikeassa yläkulmassa).
* Anna aliaksen nimi ja muuta sähköpostiasetuksia tarpeen mukaan.
* (Valinnainen) Ota käyttöön **IMAP/POP3/CalDAV/CardDAV**-tuki valitsemalla valintaruutu.
* Napsauta **Luo alias**.

3. Aseta salasana

* Luo turvallinen salasana napsauttamalla **Luo salasana**.
* Tätä salasanaa tarvitaan sähköpostiohjelmaan kirjautumiseen.

4. Sähköpostiohjelman määrittäminen

* Käytä sähköpostiohjelmaa, kuten Thunderbirdiä.
* Syötä alias ja luotu salasana.
* Määritä **IMAP**- ja **SMTP**-asetukset vastaavasti.

#### Sähköpostipalvelimen asetukset {#email-server-settings}

Käyttäjätunnus: `<alias name>`

| Tyyppi | Isäntänimi | Portti | Yhteyden suojaus | Todennus |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<verkkotunnuksen_nimi> | 465 | SSL / TLS | Normaali salasana |
| IMAP | imap.<verkkotunnuksen_nimi> | 993 | SSL / TLS | Normaali salasana |

### Ensimmäisen sähköpostin lähettäminen / vastaanottaminen {#sending--receiving-your-first-email}

Kun olet määrittänyt sen, sinun pitäisi pystyä lähettämään ja vastaanottamaan sähköpostia juuri luomaasi ja itse isännöityyn sähköpostiosoitteeseesi!

## Vianmääritys {#troubleshooting}

#### Miksi tämä ei toimi Ubuntun ja Debianin ulkopuolella {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Etsimme parhaillaan tukea macOS:lle ja tulemme etsimään muita. Avaa [keskustelu](https://github.com/orgs/forwardemail/discussions) tai osallistu, jos haluat nähdä muita tuettuja.

#### Miksi certbot acme -haaste epäonnistuu {#why-is-the-certbot-acme-challenge-failing}

Yleisin sudenkuoppa on, että certbot / letsencrypt pyytää joskus **2**-haastetta. Sinun on varmistettava, että lisäät **MOLEMMAT** tekstitietueet.

Esimerkki:
Saatat nähdä kaksi tällaista haastetta:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

On myös mahdollista, että DNS-levitys ei ole valmis. Voit käyttää työkaluja, kuten `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Tämä antaa sinulle käsityksen siitä, pitäisikö TXT-tietueesi muutosten näkyä. On myös mahdollista, että isäntäpalvelimesi paikallinen DNS-välimuisti käyttää edelleen vanhaa, vanhentunutta arvoa tai ei ole havainnut viimeisimpiä muutoksia.

Toinen vaihtoehto on käyttää cerbotin automatisoituja DNS-muutoksia asettamalla `/root/.cloudflare.ini`-tiedosto API-tokenilla cloud-init / user-data -hakemistoon VPS:n alkuasennuksen yhteydessä tai luomalla tämä tiedosto ja suorittamalla komentosarja uudelleen. Tämä hallitsee DNS-muutoksia ja haastepäivityksiä automaattisesti.

### Mikä on perusvalidointikäyttäjätunnus ja -salasana {#what-is-the-basic-auth-username-and-password}

Omaa hostingia varten lisäämme ensimmäisellä käyttökerralla selaimen omaan todennusikkunaan yksinkertaisen käyttäjätunnuksen (`admin`) ja salasanan (luodaan satunnaisesti alkuasennuksen yhteydessä). Lisäämme tämän suojaksi siltä varalta, että automaatio tai tiedonkaappaajat jotenkin ehtivät ohittaa sinut rekisteröityessäsi verkkokokemukseen. Löydät tämän salasanan alkuasennuksen jälkeen `.env`-tiedostostasi kohdista `AUTH_BASIC_USERNAME` ja `AUTH_BASIC_PASSWORD`.

### Mistä tiedän, mikä on käynnissä {#how-do-i-know-what-is-running}

Voit suorittaa komennon `docker ps` nähdäksesi kaikki käynnissä olevat säilöt, jotka käynnistetään tiedostosta `docker-compose-self-hosting.yml`. Voit myös suorittaa komennon `docker ps -a` nähdäksesi kaiken (myös säilöt, jotka eivät ole käynnissä).

### Mistä tiedän, että jokin ei ole käynnissä, vaikka sen pitäisi olla {#how-do-i-know-if-something-isnt-running-that-should-be}

Voit nähdä kaiken (myös säilöt, jotka eivät ole käynnissä) suorittamalla komennon `docker ps -a`. Saatat nähdä poistumislokin tai muistiinpanon.

### Miten löydän lokit {#how-do-i-find-logs}

Voit saada lisää lokeja `docker logs -f <container_name>`-tiedoston kautta. Jos jokin poistui, se liittyy todennäköisesti `.env`-tiedoston virheellisiin konfiguraatioihin.

Verkkokäyttöliittymässä voit tarkastella lähtevien sähköpostien lokeja `/admin/emails`:ssa ja virhelokeja `/admin/logs`:ssä.

### Miksi lähtevien sähköpostien aikakatkaisu on käynnissä? {#why-are-my-outgoing-emails-timing-out}

Jos näet viestin, kuten Yhteys aikakatkaistiin yhdistettäessä MX-palvelimeen..., sinun on ehkä tarkistettava, onko portti 25 estetty. On yleistä, että internet-palveluntarjoajat tai pilvipalveluntarjoajat estävät tämän oletusarvoisesti, jolloin sinun on ehkä otettava yhteyttä tukeen tai lähetettävä tukipyyntö avataksesi tämän.

#### Mitä työkaluja minun pitäisi käyttää sähköpostin määritysten parhaiden käytäntöjen ja IP-osoitteen maineen testaamiseen {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Katso [Usein kysytyt kysymykset täällä](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) -paikkaamme.