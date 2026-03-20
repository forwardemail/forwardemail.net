# Itse Isännöity {#self-hosted}


## Sisällysluettelo {#table-of-contents}

* [Aloittaminen](#getting-started)
* [Vaatimukset](#requirements)
  * [Cloud-init / Käyttäjätiedot](#cloud-init--user-data)
* [Asennus](#install)
  * [Asennusskriptin virheenkorjaus](#debug-install-script)
  * [Kyselyt](#prompts)
  * [Alkuasetukset (Vaihtoehto 1)](#initial-setup-option-1)
* [Palvelut](#services)
  * [Tärkeät tiedostopolut](#important-file-paths)
* [Konfigurointi](#configuration)
  * [Alkuperäinen DNS-asetus](#initial-dns-setup)
* [Käyttöönotto](#onboarding)
* [Testaus](#testing)
  * [Ensimmäisen aliaksen luominen](#creating-your-first-alias)
  * [Ensimmäisen sähköpostin lähetys / vastaanotto](#sending--receiving-your-first-email)
* [Vianetsintä](#troubleshooting)
  * [Mikä on perusautentikoinnin käyttäjätunnus ja salasana](#what-is-the-basic-auth-username-and-password)
  * [Miten tiedän mitä on käynnissä](#how-do-i-know-what-is-running)
  * [Miten tiedän, jos jokin ei ole käynnissä, vaikka sen pitäisi olla](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Miten löydän lokitiedostot](#how-do-i-find-logs)
  * [Miksi lähtevät sähköpostini aikakatkaisevat](#why-are-my-outgoing-emails-timing-out)


## Aloittaminen {#getting-started}

Itse isännöity sähköpostiratkaisumme, kuten kaikki tuotteemme, on 100 % avoimen lähdekoodin – sekä käyttöliittymä että taustajärjestelmä. Tämä tarkoittaa:

1. **Täydellinen läpinäkyvyys**: Jokainen koodirivi, joka käsittelee sähköpostejasi, on julkisesti tarkasteltavissa
2. **Yhteisön panokset**: Kuka tahansa voi tehdä parannuksia tai korjata ongelmia
3. **Turvallisuus avoimuuden kautta**: Haavoittuvuudet voidaan tunnistaa ja korjata globaalin yhteisön toimesta
4. **Ei toimittajalukkoa**: Et ole koskaan riippuvainen yrityksemme olemassaolosta

Koko koodikanta on saatavilla GitHubissa osoitteessa <https://github.com/forwardemail/forwardemail.net>, lisensoitu MIT-lisenssillä.

Arkkitehtuuri sisältää kontit:

* SMTP-palvelin lähtevälle sähköpostille
* IMAP/POP3-palvelimet sähköpostin noutamiseen
* Verkkokäyttöliittymä hallinnointiin
* Tietokanta konfiguraation tallennukseen
* Redis välimuistiin ja suorituskykyyn
* SQLite turvalliseen, salattuun postilaatikon tallennukseen

> \[!NOTE]
> Muista tutustua [itse isännöityyn blogiimme](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Ja niille, jotka haluavat yksityiskohtaisemman vaiheittaisen version, katso [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) tai [Debian](https://forwardemail.net/guides/selfhosted-on-debian) -pohjaiset oppaamme.


## Vaatimukset {#requirements}

Ennen asennusskriptin suorittamista varmista, että sinulla on seuraavat:

* **Käyttöjärjestelmä**: Linux-pohjainen palvelin (tällä hetkellä tuetaan Ubuntu 22.04+).
* **Resurssit**: 1 vCPU ja 2GB RAM
* **Root-oikeudet**: Hallinnolliset oikeudet komentojen suorittamiseen.
* **Verkkotunnus**: Oma verkkotunnus DNS-konfiguraatiota varten.
* **Puhdas IP**: Varmista, että palvelimellasi on puhdas IP-osoite ilman aiempaa roskapostimaineetta tarkistamalla mustalistat. Lisätietoja [tästä](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Julkinen IP-osoite, jossa portti 25 on käytössä
* Mahdollisuus asettaa [käänteinen PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- ja IPv6-tuki

> \[!TIP]
> Katso listaamme [mahtavista sähköpostipalveluntarjoajista](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Käyttäjätiedot {#cloud-init--user-data}

Useimmat pilvipalveluntarjoajat tukevat cloud-init-konfiguraatiota, kun virtuaalipalvelin (VPS) otetaan käyttöön. Tämä on erinomainen tapa asettaa tiedostoja ja ympäristömuuttujia etukäteen skriptin alkuasetusten käyttöä varten, jolloin skripti ei kysy lisätietoja suorituksen aikana.

**Vaihtoehdot**

* `EMAIL` - sähköpostiosoite, jota käytetään certbotin vanhenemismuistutuksiin
* `DOMAIN` - oma verkkotunnus (esim. `example.com`), jota käytetään itseisännöintiasetuksissa
* `AUTH_BASIC_USERNAME` - käyttäjätunnus, jota käytetään ensimmäisessä asennuksessa sivuston suojaamiseen
* `AUTH_BASIC_PASSWORD` - salasana, jota käytetään ensimmäisessä asennuksessa sivuston suojaamiseen
* `/root/.cloudflare.ini` - (**vain Cloudflare-käyttäjille**) cloudflare-konfiguraatiotiedosto, jota certbot käyttää DNS-konfiguraatioon. Vaatii API-tokenin asettamisen `dns_cloudflare_api_token`-kenttään. Lue lisää [täältä](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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


## Asennus {#install}

Suorita seuraava komento palvelimellasi ladataksesi ja suorittaaksesi asennusskriptin:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Vianmäärityksen asennusskripti {#debug-install-script}

Lisää `DEBUG=true` asennusskriptin eteen saadaksesi yksityiskohtaisemman tulosteen:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Kehotevalinnat {#prompts}

```sh
1. Alkuasetukset
2. Varmuuskopioiden asetukset
3. Automaattiset päivitykset
4. Uudista sertifikaatit
5. Palauta varmuuskopiosta
6. Ohje
7. Poistu
```

* **Alkuasetukset**: Lataa uusin forward email -koodi, määritä ympäristö, kysy oma mukautettu domain ja asenna kaikki tarvittavat sertifikaatit, avaimet ja salaisuudet.
* **Varmuuskopioiden asetukset**: Asettaa cron-tehtävän varmuuskopioimaan mongoDB ja redis S3-yhteensopivaan tallennustilaan turvallista, etävarastointia varten. Erillisesti sqlite varmuuskopioidaan kirjautumisen yhteydessä, jos muutoksia on, turvallisia ja salattuja varmuuskopioita varten.
* **Automaattiset päivitykset**: Asettaa cron-tehtävän etsimään yöpäivityksiä, jotka turvallisesti rakentavat uudelleen ja käynnistävät infrastruktuurin komponentit.
* **Uudista sertifikaatit**: Certbot / lets encrypt -työkaluja käytetään SSL-sertifikaattien hallintaan, ja avaimet vanhenevat kolmen kuukauden välein. Tämä uudistaa domainisi sertifikaatit ja sijoittaa ne tarvittavaan kansioon, jotta siihen liittyvät komponentit voivat käyttää niitä. Katso [tärkeät tiedostopolut](#important-file-paths)
* **Palauta varmuuskopiosta**: Käynnistää mongodb:n ja redisin palauttamaan varmuuskopiotiedot.

### Alkuasetukset (Vaihtoehto 1) {#initial-setup-option-1}

Valitse vaihtoehto `1. Alkuasetukset` aloittaaksesi.

Kun prosessi on valmis, näet onnistumisviestin. Voit myös suorittaa `docker ps` nähdäksesi **käynnistetyt** komponentit. Lisätietoja komponenteista alla.


## Palvelut {#services}

| Palvelun nimi |         Oletusportti        | Kuvaus                                               |
| ------------ | :-------------------------: | ---------------------------------------------------- |
| Web          |            `443`            | Verkkokäyttöliittymä kaikille hallintatoiminnoille   |
| API          |            `4000`           | API-kerros tietokantojen abstraktointiin             |
| Bree         |             Ei ole          | Taustatyö- ja tehtävien suorittaja                    |
| SMTP         | `465` (suositeltu) / `587` | SMTP-palvelin lähtevälle sähköpostille                |
| SMTP Bree    |             Ei ole          | SMTP-taustatyö                                        |
| MX           |            `2525`           | Postinvaihtopalvelin saapuville sähköposteille ja edelleenlähetykselle |
| IMAP         |          `993/2993`         | IMAP-palvelin saapuville sähköposteille ja postilaatikon hallintaan |
| POP3         |          `995/2995`         | POP3-palvelin saapuville sähköposteille ja postilaatikon hallintaan |
| SQLite       |            `3456`           | SQLite-palvelin vuorovaikutukseen sqlite-tietokantojen kanssa |
| SQLite Bree  |             Ei ole          | SQLite-taustatyö                                      |
| CalDAV       |            `5000`           | CalDAV-palvelin kalenterinhallintaan                 |
| CardDAV      |            `6000`           | CardDAV-palvelin kalenterinhallintaan                |
| MongoDB      |           `27017`           | MongoDB-tietokanta suurimpaan osaan datanhallintaa   |
| Redis        |            `6379`           | Redis välimuistiin ja tilanhallintaan                 |
| SQLite       |             Ei ole          | SQLite-tietokanta(t) salattuja postilaatikoita varten |

### Tärkeät tiedostopolut {#important-file-paths}

Huom: *Isäntäkansio* alla on suhteessa polkuun `/root/forwardemail.net/self-hosting/`.

| Komponentti            |       Isäntäkansio       | Konttikansio                 |
| ---------------------- | :---------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`     | `/backups`                   |
| Redis                  |     `./redis-data`      | `/data`                      |
| Sqlite                 |    `./sqlite-data`      | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-tiedosto           |        `./.env`         | `/app/.env`                  |
| SSL-sertifikaatit/avaimet |        `./ssl`          | `/app/ssl/`                  |
| Yksityisavain          |  `./ssl/privkey.pem`    | `/app/ssl/privkey.pem`       |
| Täydellinen ketju      | `./ssl/fullchain.pem`   | `/app/ssl/fullchain.pem`     |
| CA-sertifikaatti       |    `./ssl/cert.pem`     | `/app/ssl/cert.pem`          |
| DKIM-yksityisavain     |    `./ssl/dkim.key`     | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Tallenna `.env`-tiedosto turvallisesti. Se on kriittinen palautuksen kannalta vikatilanteessa.
> Löydät tämän polusta `/root/forwardemail.net/self-hosting/.env`.


## Konfigurointi {#configuration}

### Alkuperäinen DNS-asetus {#initial-dns-setup}

Valitsemasi DNS-palveluntarjoajan hallintapaneelissa määritä sopivat DNS-tietueet. Huomaa, että kaikki hakasulkeissa (`<>`) olevat kohdat ovat dynaamisia ja ne tulee päivittää omilla arvoillasi.

| Tyyppi | Nimi               | Sisältö                      | TTL  |
| ------ | ------------------ | ---------------------------- | ---- |
| A      | "@", ".", tai tyhjä | <ip_address>                 | auto |
| CNAME  | api                | <domain_name>                | auto |
| CNAME  | caldav             | <domain_name>                | auto |
| CNAME  | carddav            | <domain_name>                | auto |
| CNAME  | fe-bounces         | <domain_name>                | auto |
| CNAME  | imap               | <domain_name>                | auto |
| CNAME  | mx                 | <domain_name>                | auto |
| CNAME  | pop3               | <domain_name>                | auto |
| CNAME  | smtp               | <domain_name>                | auto |
| MX     | "@", ".", tai tyhjä | mx.<domain_name> (prioriteetti 0) | auto |
| TXT    | "@", ".", tai tyhjä | "v=spf1 a -all"              | auto |

#### Käänteinen DNS / PTR-tietue {#reverse-dns--ptr-record}

Käänteinen DNS (rDNS) tai käänteiset osoitetietueet (PTR-tietueet) ovat tärkeitä sähköpostipalvelimille, koska ne auttavat varmistamaan sähköpostia lähettävän palvelimen aitouden. Jokainen pilvipalveluntarjoaja hoitaa tämän eri tavalla, joten sinun tulee etsiä ohjeet "Reverse DNS" -asetuksen lisäämiseksi, jolla isäntä ja IP osoitetaan vastaavaan isäntänimeen. Todennäköisesti tämä löytyy palveluntarjoajan verkkoasetuksista.

#### Portti 25 estetty {#port-25-blocked}

Jotkut internet-palveluntarjoajat ja pilvipalvelut estävät portin 25 estääkseen haitallista toimintaa. Saatat joutua avaamaan tukipyynnön portin 25 avaamiseksi SMTP:lle / lähtevälle sähköpostille.


## Käyttöönotto {#onboarding}

1. Avaa aloitussivu
   Siirry osoitteeseen https\://\<domain_name>, korvaten \<domain_name> DNS-asetuksissa määritellyllä verkkotunnuksella. Näet Forward Email -aloitussivun.

2. Kirjaudu sisään ja ota verkkotunnus käyttöön

* Kirjaudu sisään kelvollisella sähköpostilla ja salasanalla.
* Syötä verkkotunnus, jonka haluat määrittää (tämän on vastattava DNS-konfiguraatiota).
* Seuraa ohjeita lisätäksesi vaaditut **MX**- ja **TXT**-tietueet vahvistusta varten.

3. Viimeistele asennus

* Kun vahvistus on suoritettu, siirry Aliases-sivulle luodaksesi ensimmäisen aliaksesi.
* Halutessasi määritä **SMTP lähtevälle sähköpostille** **Domain Settings** -osiossa. Tämä vaatii lisä-DNS-tietueita.

> \[!NOTE]
> Mitään tietoja ei lähetetä palvelimesi ulkopuolelle. Itse isännöity vaihtoehto ja alkuperäinen tili ovat vain ylläpitäjän kirjautumista ja verkkonäkymää varten hallinnoimaan verkkotunnuksia, aliaksia ja niihin liittyviä sähköpostiasetuksia.


## Testaus {#testing}

### Ensimmäisen aliaksen luominen {#creating-your-first-alias}

1. Siirry Aliases-sivulle
   Avaa alias-hallintasivu:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Lisää uusi alias

* Klikkaa **Add Alias** (yläoikealla).
* Syötä aliaksen nimi ja säädä sähköpostiasetuksia tarpeen mukaan.
* (Valinnainen) Ota käyttöön **IMAP/POP3/CalDAV/CardDAV** -tuki valitsemalla valintaruutu.
* Klikkaa **Create Alias.**

3. Aseta salasana

* Klikkaa **Generate Password** luodaksesi turvallisen salasanan.
* Tätä salasanaa tarvitaan kirjautuessa sähköpostiohjelmaan.

4. Määritä sähköpostiohjelmasi

* Käytä sähköpostiohjelmaa kuten Thunderbird.
* Syötä aliaksen nimi ja luotu salasana.
* Määritä **IMAP**- ja **SMTP**-asetukset vastaavasti.

#### Sähköpostipalvelimen asetukset {#email-server-settings}

Käyttäjätunnus: `<alias name>`

| Tyyppi | Isäntänimi          | Portti | Yhteyden suojaus    | Todennus        |
| ------ | ------------------- | ------ | ------------------- | --------------- |
| SMTP   | smtp.<domain_name>  | 465    | SSL / TLS           | Normaali salasana |
| IMAP   | imap.<domain_name>  | 993    | SSL / TLS           | Normaali salasana |

### Ensimmäisen sähköpostin lähetys / vastaanotto {#sending--receiving-your-first-email}

Kun asetukset on tehty, sinun pitäisi pystyä lähettämään ja vastaanottamaan sähköpostia juuri luomaasi ja itse isännöimääsi sähköpostiosoitteeseen!
## Vianmääritys {#troubleshooting}

#### Miksi tämä ei toimi Ubuntu- ja Debian-järjestelmien ulkopuolella {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Tällä hetkellä pyrimme tukemaan MacOS:ää ja tulevaisuudessa muita järjestelmiä. Avaa [keskustelu](https://github.com/orgs/forwardemail/discussions) tai osallistu, jos haluat nähdä muiden järjestelmien tuen.

#### Miksi certbotin acme-haaste epäonnistuu {#why-is-the-certbot-acme-challenge-failing}

Yleisin sudenkuoppa on, että certbot / letsencrypt pyytää joskus **kahta** haastetta. Sinun täytyy varmistaa, että lisäät **MOLEMMAT** txt-tietueet.

Esimerkki:
Saatat nähdä kaksi haastetta näin:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

On myös mahdollista, että DNS:n levitys ei ole vielä valmis. Voit käyttää työkaluja kuten: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Tämä antaa sinulle käsityksen siitä, näkyvätkö TXT-tietueen muutokset. On myös mahdollista, että paikallinen DNS-välimuisti isäntäjärjestelmässäsi käyttää vielä vanhaa, vanhentunutta arvoa tai ei ole vielä hakenut viimeisimpiä muutoksia.

Toinen vaihtoehto on käyttää automaattisia certbotin DNS-muutoksia asettamalla `/root/.cloudflare.ini` -tiedosto API-tokenilla cloud-init / user-data -asetuksissa VPS:n alkuperäisessä asennuksessa tai luoda tämä tiedosto ja ajaa skripti uudelleen. Tämä hallinnoi DNS-muutoksia ja haastepäivityksiä automaattisesti.

### Mikä on perusautentikoinnin käyttäjätunnus ja salasana {#what-is-the-basic-auth-username-and-password}

Itse isännöinnissä lisäämme ensimmäisellä kerralla selaimen natiivin autentikointiponnahdusikkunan, jossa on yksinkertainen käyttäjätunnus (`admin`) ja salasana (satunnaisesti luotu alkuasetuksessa). Lisäämme tämän suojaukseksi siltä varalta, että automaatio / skriptit ehtisivät ensin rekisteröityä web-kokemukseen. Löydät tämän salasanan alkuasetuksen jälkeen `.env`-tiedostostasi kohdasta `AUTH_BASIC_USERNAME` ja `AUTH_BASIC_PASSWORD`.

### Miten tiedän, mitä on käynnissä {#how-do-i-know-what-is-running}

Voit ajaa `docker ps` nähdäksesi kaikki käynnissä olevat kontit, jotka käynnistetään `docker-compose-self-hosting.yml` -tiedostosta. Voit myös ajaa `docker ps -a` nähdäksesi kaiken (myös kontit, jotka eivät ole käynnissä).

### Miten tiedän, jos jokin, joka pitäisi olla käynnissä, ei ole {#how-do-i-know-if-something-isnt-running-that-should-be}

Voit ajaa `docker ps -a` nähdäksesi kaiken (myös kontit, jotka eivät ole käynnissä). Saatat nähdä poistumislokin tai huomautuksen.

### Miten löydän lokit {#how-do-i-find-logs}

Saat lisää lokitietoja komennolla `docker logs -f <container_name>`. Jos jokin on poistunut, se liittyy todennäköisesti `.env`-tiedoston virheelliseen konfigurointiin.

Web-käyttöliittymässä voit tarkastella `/admin/emails` ja `/admin/logs` ulospäin menevien sähköpostien lokeja ja virhelokeja.

### Miksi lähtevät sähköpostini aikakatkaisevat {#why-are-my-outgoing-emails-timing-out}

Jos näet viestin kuten Connection timed out when connecting to MX server..., sinun kannattaa tarkistaa, onko portti 25 estetty. On yleistä, että internet-palveluntarjoajat tai pilvipalveluntarjoajat estävät tämän oletuksena, jolloin sinun täytyy ottaa yhteyttä tukeen / tehdä tukipyyntö portin avaamiseksi.

#### Mitä työkaluja minun tulisi käyttää sähköpostin konfiguraation parhaiden käytäntöjen ja IP-maineen testaamiseen {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Tutustu [UKK-osioomme täällä](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
