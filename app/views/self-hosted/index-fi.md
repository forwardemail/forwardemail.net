# Itse isännöity {#self-hosted}

## Sisällysluettelo {#table-of-contents}

* [Aloitus](#getting-started)
* [Vaatimukset](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Asentaa](#install)
  * [Debug asennusskripti](#debug-install-script)
  * [Kehotteet](#prompts)
  * [Alkuasetukset (vaihtoehto 1)](#initial-setup-option-1)
* [Palvelut](#services)
  * [Tärkeitä tiedostopolkuja](#important-file-paths)
* [Kokoonpano](#configuration)
  * [Alkuperäinen DNS-asetus](#initial-dns-setup)
* [Käyttöönotto](#onboarding)
* [Testaus](#testing)
  * [Ensimmäisen aliaksen luominen](#creating-your-first-alias)
  * [Ensimmäisen sähköpostin lähettäminen / vastaanottaminen](#sending--receiving-your-first-email)
* [Vianetsintä](#troubleshooting)
  * [Mikä on perusauth-käyttäjätunnus ja salasana](#what-is-the-basic-auth-username-and-password)
  * [Mistä tiedän, mikä on käynnissä](#how-do-i-know-what-is-running)
  * [Mistä tiedän, jos jokin ei toimi, sen pitäisi olla?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Miten löydän lokit](#how-do-i-find-logs)
  * [Miksi lähtevien sähköpostini aikakatkaisu?](#why-are-my-outgoing-emails-timing-out)

## Aloittaminen {#getting-started}

Itse isännöity sähköpostiratkaisumme, kuten kaikki tuotteemme, on 100-prosenttisesti avoimen lähdekoodin – sekä käyttöliittymä että taustajärjestelmä. Tämä tarkoittaa:

1. **Täydellinen läpinäkyvyys**: Jokainen sähköpostiasi käsittelevä koodirivi on julkisesti tarkasteltavissa.
2. **Yhteisön panokset**: Kuka tahansa voi osallistua parannuksiin tai korjata ongelmia.
3. **Turvallisuus avoimuuden kautta**: Haavoittuvuudet voidaan tunnistaa ja korjata globaalin yhteisön toimesta.
4. **Ei toimittajasidonnaisuutta**: Et ole koskaan riippuvainen yrityksemme olemassaolosta.

Koko koodikanta on saatavilla GitHubissa osoitteessa <https://github.com/forwardemail/forwardemail.net>, MIT-lisenssin alaisena.

Arkkitehtuuri sisältää säiliöitä:

* SMTP-palvelin lähtevälle sähköpostille
* IMAP/POP3-palvelimet sähköpostin noutamiseen
* Web-käyttöliittymä hallintaan
* Tietokanta konfiguraation tallentamiseen
* Redis välimuistin ja suorituskyvyn parantamiseen
* SQLite turvalliseen ja salattuun postilaatikoiden tallennukseen

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Vaatimukset {#requirements}

Ennen kuin suoritat asennusohjelman, varmista, että sinulla on seuraavat asiat:

* **Käyttöjärjestelmä**: Linux-pohjainen palvelin (tukee tällä hetkellä Ubuntu 22.04+).
* **Resurssit**: 1 vCPU ja 2 Gt RAM-muistia
* **Pääkäyttäjän oikeudet**: Järjestelmänvalvojan oikeudet komentojen suorittamiseen.
* **Verkkotunnus**: Mukautettu verkkotunnus, joka on valmis DNS-konfigurointiin.
* **Puhdas IP-osoite**: Varmista, että palvelimellasi on puhdas IP-osoite ilman aiempaa roskapostimainetta tarkistamalla mustat listat. Lisätietoja [tässä](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Julkinen IP-osoite portin 25 tuella
* Mahdollisuus asettaa [käänteinen PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- ja IPv6-tuki

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Pilvialustus / Käyttäjätiedot {#cloud-init--user-data}

Useimmat pilvipalvelun toimittajat tukevat pilvi-init-kokoonpanoa, kun virtuaalinen yksityinen palvelin (VPS) on käytössä. Tämä on loistava tapa asettaa tiedostoja ja ympäristömuuttujia etukäteen käytettäväksi komentosarjojen alkuasetuslogiikassa, mikä ohittaa tarpeen pyytää lisätietoa komentosarjan ollessa käynnissä.

**Asetukset**

* `EMAIL` - sähköpostiosoite, jota käytetään certbotin vanhenemismuistutuksiin
* `DOMAIN` - mukautettu verkkotunnus (esim. `example.com`), jota käytetään omatoimisen webhotellin asennukseen
* `AUTH_BASIC_USERNAME` - käyttäjätunnus, jota käytettiin ensimmäisessä asennuksessa sivuston suojaamiseksi
* `AUTH_BASIC_PASSWORD` - salasana, jota käytettiin ensimmäisessä asennuksessa sivuston suojaamiseksi
* `/root/.cloudflare.ini` - (**Vain Cloudflare-käyttäjille**) cloudflare-määritystiedosto, jota certbot käyttää DNS-määritykseen. Se edellyttää, että asetat API-tunnuksesi `dns_cloudflare_api_token`:n kautta. Lue lisää [tässä](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

Lataa ja suorita asennuskomentosarja suorittamalla seuraava komento palvelimellasi:

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
* **Päivityksen määrittäminen**: Määritä cron etsimään yöllisiä päivityksiä, jotka rakentavat infrastruktuurikomponentit turvallisesti uudelleen ja käynnistävät ne uudelleen.
* **Uusi varmenteet**: Certbot /lets encrypt -komentoa käytetään SSL-varmenteille, ja avaimet vanhenevat 3 kuukauden välein. Tämä uusii verkkotunnuksesi varmenteet ja sijoittaa ne tarvittavaan kansioon, jotta niihin liittyvät komponentit voivat käyttää niitä. Katso [tärkeitä tiedostopolkuja](#important-file-paths)
* **Palauta varmuuskopiosta**: Käynnistää mongodb:n ja redisin palauttamaan tiedot varmuuskopiotiedoista.

### Alkuasetukset (vaihtoehto 1) {#initial-setup-option-1}

Aloita valitsemalla vaihtoehto `1. Initial setup`.

Kun prosessi on valmis, sinun pitäisi nähdä onnistumisviesti. Voit jopa suorittaa komennon `docker ps` nähdäksesi komponenttien käynnistyvän. Lisätietoja komponenteista alla.

## Palvelut {#services}

| Palvelun nimi | Oletusportti | Kuvaus |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Verkkokäyttöliittymä kaikkeen järjestelmänvalvojan vuorovaikutukseen |
| API | `4000` | Api-kerros abstrakteihin tietokantoihin |
| Bree | Ei mitään | Taustatyön ja tehtävien juoksija |
| SMTP | `465/587` | SMTP-palvelin lähteville sähköpostiviesteille |
| SMTP Bree | Ei mitään | SMTP-taustatyö |
| MX | `2525` | Sähköpostin vaihto saapuvaan sähköpostiin ja sähköpostin edelleenlähetykseen |
| IMAP | `993/2993` | IMAP-palvelin saapuvan sähköpostin ja postilaatikon hallintaan |
| POP3 | `995/2995` | POP3-palvelin saapuvan sähköpostin ja postilaatikon hallintaan |
| SQLite | `3456` | SQLite-palvelin vuorovaikutukseen sqlite-tietokantojen kanssa |
| SQLite Bree | Ei mitään | SQLite-taustatyö |
| CalDAV | `5000` | CalDAV-palvelin kalenterinhallintaan |
| CardDAV | `6000` | CardDAV-palvelin kalenterin hallintaan |
| MongoDB | `27017` | MongoDB-tietokanta useimpiin tiedonhallintaan |
| Redis | `6379` | Redis välimuistiin ja tilanhallintaan |
| SQLite | Ei mitään | SQLite-tietokanta(t) salatuille postilaatikoille |

### Tärkeät tiedostopolut {#important-file-paths}

Huomautus: Alla oleva *Isäntäpolku* on suhteessa `/root/forwardemail.net/self-hosting/`-polkuun.

| Komponentti | Isäntäpolku | Kontin polku |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-tiedosto | `./.env` | `/app/.env` |
| SSL-sertifikaatit/avaimet | `./ssl` | `/app/ssl/` |
| Yksityinen avain | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Koko ketjun sertifikaatti | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA-varmenteita | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM yksityinen avain | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## Konfiguraatio {#configuration}

### DNS-alkuasetukset {#initial-dns-setup}

Määritä valitsemassasi DNS-palveluntarjoajassa asianmukaiset DNS-tietueet. Huomaa, että hakasulkeissa (`<>`) olevat tiedot ovat dynaamisia ja ne on päivitettävä määrittämälläsi arvolla.

| Tyyppi | Nimi | Sisältö | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." tai tyhjä | <ip_osoite> | auto |
| CNAME | api | <verkkotunnuksen_nimi> | auto |
| CNAME | caldav | <verkkotunnuksen_nimi> | auto |
| CNAME | carddav | <verkkotunnuksen_nimi> | auto |
| CNAME | fe-pomppii | <verkkotunnuksen_nimi> | auto |
| CNAME | imap | <verkkotunnuksen_nimi> | auto |
| CNAME | mx | <verkkotunnuksen_nimi> | auto |
| CNAME | pop3 | <verkkotunnuksen_nimi> | auto |
| CNAME | smtp | <verkkotunnuksen_nimi> | auto |
| MX | "@", "." tai tyhjä | mx.<verkkotunnuksen_nimi> (prioriteetti 0) | auto |
| TXT | "@", "." tai tyhjä | "v=spf1 a -all" | auto |

#### Käänteinen DNS/PTR-tietue {#reverse-dns--ptr-record}

Reverse DNS (rDNS) tai käänteiset osoitintietueet (PTR-tietueet) ovat tärkeitä sähköpostipalvelimille, koska ne auttavat varmistamaan sähköpostin lähettävän palvelimen laillisuuden. Jokainen pilvipalveluntarjoaja tekee tämän eri tavalla, joten sinun on etsittävä, kuinka "käänteinen DNS" lisätään, jotta isäntä ja IP voidaan yhdistää sitä vastaavaan isäntänimeen. Todennäköisesti palveluntarjoajan verkko-osiossa.

#### Portti 25 estetty {#port-25-blocked}

Jotkut Internet-palveluntarjoajat ja pilvipalveluntarjoajat estävät 25:n huonojen toimijoiden välttämiseksi. Saatat joutua lähettämään tukipyynnön avataksesi portin 25 SMTP:lle / lähtevälle sähköpostille.

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
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

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

Kun olet määrittänyt, sinun pitäisi pystyä lähettämään ja vastaanottamaan sähköpostia äskettäin luotuun ja itse isännöityyn sähköpostiosoitteeseesi!

## Vianmääritys {#troubleshooting}

#### Miksi tämä ei toimi Ubuntun ja Debianin ulkopuolella {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Pyrimme parhaillaan tukemaan MacOS:ää ja tulemme etsimään muita. Avaa [keskustelua](https://github.com/orgs/forwardemail/discussions) tai osallistu, jos haluat nähdä muidenkin tuen.

#### Miksi certbot acme -haaste epäonnistuu {#why-is-the-certbot-acme-challenge-failing}

Yleisin sudenkuoppa on, että certbot / letsencrypt pyytää joskus **2**-haastetta. Sinun on varmistettava, että lisäät **MOLEMAT** tekstitietueet.

Esimerkki:
Saatat nähdä kaksi tällaista haastetta:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

On myös mahdollista, että DNS-levitys ei ole valmis. Voit käyttää työkaluja, kuten: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Tämä antaa sinulle käsityksen siitä, pitäisikö TXT-tietueesi muutosten näkyä. On myös mahdollista, että isäntäpalvelimesi paikallinen DNS-välimuisti käyttää edelleen vanhaa, vanhentunutta arvoa tai ei ole tunnistanut viimeisimpiä muutoksia.

Toinen vaihtoehto on käyttää cerbotin automatisoituja DNS-muutoksia asettamalla `/root/.cloudflare.ini` -tiedosto API-tokenilla cloud-init / user-data -hakemistoon VPS:n alkuasennuksen yhteydessä tai luomalla tämä tiedosto ja suorittamalla komentosarja uudelleen. Tämä hallitsee DNS-muutoksia ja haastepäivityksiä automaattisesti.

### Mikä on perusvalidointikäyttäjätunnus ja -salasana {#what-is-the-basic-auth-username-and-password}

Omaa hostingia varten lisäämme ensimmäisellä käyttökerralla selaimen natiivin todennusponnahdusikkunan, jossa on yksinkertainen käyttäjätunnus (`admin`) ja salasana (luodaan satunnaisesti alkuasennuksen yhteydessä). Lisäämme tämän suojaksi siltä varalta, että automaatio tai kaapijat jotenkin ehtivät ohittaa sinut rekisteröityessäsi verkkokokemukseen. Löydät tämän salasanan alkuasennuksen jälkeen `.env` -tiedostostasi hakemistoista `AUTH_BASIC_USERNAME` ja `AUTH_BASIC_PASSWORD`.

### Mistä tiedän, mikä {#how-do-i-know-what-is-running} on käynnissä?

Voit suorittaa komennon `docker ps` nähdäksesi kaikki käynnissä olevat säilöt, jotka kehitetään `docker-compose-self-hosting.yml`-tiedostosta. Voit myös suorittaa komennon `docker ps -a` nähdäksesi kaiken (myös säilöt, jotka eivät ole käynnissä).

### Mistä tiedän, että jokin ei ole käynnissä, vaikka sen pitäisi olla {#how-do-i-know-if-something-isnt-running-that-should-be}

Voit nähdä kaiken (myös säilöt, jotka eivät ole käynnissä) suorittamalla komennon `docker ps -a`. Saatat nähdä poistumislokin tai muistiinpanon.

### Miten löydän lokit {#how-do-i-find-logs}

Voit saada lisää lokeja tiedoston `docker logs -f <container_name>` kautta. Jos jokin poistui, se liittyy todennäköisesti tiedoston `.env` virheellisiin konfiguraatioihin.

Verkkokäyttöliittymässä voit tarkastella lähtevien sähköpostien lokeja `/admin/emails` ja virhelokeja `/admin/logs`.

### Miksi lähtevien sähköpostien aikakatkaisu on käynnissä {#why-are-my-outgoing-emails-timing-out}

Jos näet viestin, kuten Yhteys aikakatkaistiin, kun muodostat yhteyden MX-palvelimeen..., sinun on ehkä tarkistettava, onko portti 25 tukossa. On yleistä, että Internet-palveluntarjoajat tai pilvipalveluntarjoajat estävät tämän oletusarvoisesti, jolloin saatat joutua ottamaan yhteyttä tukeen / jättämään lippusi tämän avaamiseksi.

#### Mitä työkaluja minun pitäisi käyttää sähköpostin määritysten parhaiden käytäntöjen ja IP-osoitteen maineen testaamiseen {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Katso [FAQ täällä](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)-sivuamme.