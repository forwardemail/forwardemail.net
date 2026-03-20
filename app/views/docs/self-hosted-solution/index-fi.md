# Itseisännöity sähköposti: Sitoutuminen avoimeen lähdekoodiin {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Itseisännöity sähköpostiratkaisu -kuvitus" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Miksi itseisännöity sähköposti on tärkeää](#why-self-hosted-email-matters)
  * [Perinteisten sähköpostipalveluiden ongelma](#the-problem-with-traditional-email-services)
  * [Itseisännöity vaihtoehto](#the-self-hosted-alternative)
* [Itseisännöity toteutuksemme: Tekninen yleiskatsaus](#our-self-hosted-implementation-technical-overview)
  * [Docker-pohjainen arkkitehtuuri yksinkertaisuuden ja siirrettävyyden vuoksi](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-skriptiasennus: saavutettavuus kohtaa turvallisuuden](#bash-script-installation-accessibility-meets-security)
  * [Kvantisuojaus salauksessa tulevaisuuden yksityisyyden turvaamiseksi](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automaattinen ylläpito ja päivitykset](#automated-maintenance-and-updates)
* [Avoimen lähdekoodin sitoutuminen](#the-open-source-commitment)
* [Itseisännöity vs. hallinnoitu: oikean valinnan tekeminen](#self-hosted-vs-managed-making-the-right-choice)
  * [Itseisännöinnin todellisuus](#the-reality-of-self-hosting-email)
  * [Milloin valita hallinnoitu palvelumme](#when-to-choose-our-managed-service)
* [Aloittaminen itseisännöidyn edelleenlähetyssähköpostin kanssa](#getting-started-with-self-hosted-forward-email)
  * [Järjestelmävaatimukset](#system-requirements)
  * [Asennusvaiheet](#installation-steps)
* [Itseisännöidyn sähköpostin tulevaisuus](#the-future-of-self-hosted-email)
* [Yhteenveto: Sähköpostivapaus kaikille](#conclusion-email-freedom-for-everyone)
* [Lähteet](#references)


## Esipuhe {#foreword}

Nykyisessä digitaalisessa ympäristössä sähköposti on edelleen verkkohenkilöllisyytemme ja viestintämme selkäranka. Kuitenkin yksityisyyshuolien kasvaessa monet käyttäjät kohtaavat vaikean valinnan: mukavuus yksityisyyden kustannuksella tai yksityisyys mukavuuden kustannuksella. Forward Emaililla olemme aina uskoneet, ettei sinun tarvitse valita näiden kahden välillä.

Tänään olemme innoissamme voidessamme ilmoittaa merkittävästä virstanpylväästä matkallamme: itseisännöidyn sähköpostiratkaisumme lanseerauksesta. Tämä ominaisuus edustaa syvintä sitoutumistamme avoimen lähdekoodin periaatteisiin, yksityisyyttä korostavaan suunnitteluun ja käyttäjien voimaannuttamiseen. Itseisännöidyllä vaihtoehdollamme annamme koko sähköpostiviestinnän voiman ja hallinnan suoraan sinun käsiisi.

Tämä blogikirjoitus tutkii filosofiaa itseisännöidyn ratkaisumme takana, sen teknistä toteutusta ja miksi se on tärkeää käyttäjille, jotka arvostavat sekä yksityisyyttä että omistajuutta digitaalisessa viestinnässään.


## Miksi itseisännöity sähköposti on tärkeää {#why-self-hosted-email-matters}

Itseisännöity sähköpostiratkaisumme on selkein ilmaus uskomuksestamme, että todellinen yksityisyys tarkoittaa hallintaa, ja hallinta alkaa avoimesta lähdekoodista. Käyttäjille, jotka vaativat täyttä omistajuutta digitaalisesta viestinnästään, itseisännöinti ei ole enää marginaalinen ajatus — se on olennainen oikeus. Olemme ylpeitä seistä tämän uskomuksen takana täysin avoimella, varmennettavalla alustalla, jota voit käyttää omilla ehdoillasi.

### Perinteisten sähköpostipalveluiden ongelma {#the-problem-with-traditional-email-services}

Perinteiset sähköpostipalvelut aiheuttavat useita perustavanlaatuisia haasteita yksityisyyttä arvostaville käyttäjille:

1. **Luottamusvaatimukset**: Sinun on luotettava palveluntarjoajaan, ettei se pääse käsiksi, analysoi tai jaa tietojasi
2. **Keskitetty hallinta**: Käyttöoikeutesi voidaan peruuttaa milloin tahansa mistä tahansa syystä
3. **Valvonnan haavoittuvuus**: Keskitetyt palvelut ovat valvonnan ensisijaisia kohteita
4. **Rajoitettu läpinäkyvyys**: Useimmat palvelut käyttävät suljettua, omistettua ohjelmistoa
5. **Toimittajalukko**: Näistä palveluista siirtyminen voi olla vaikeaa tai mahdotonta

Jopa "yksityisyyttä korostavat" sähköpostipalveluntarjoajat epäonnistuvat usein avaamalla vain käyttöliittymänsä lähdekoodin, kun taas taustajärjestelmät pysyvät omistettuina ja suljettuina. Tämä luo merkittävän luottamusaukko—sinua pyydetään uskomaan heidän yksityisyyslupauksiinsa ilman mahdollisuutta varmistaa niitä.

### Itseisännöity vaihtoehto {#the-self-hosted-alternative}
Sähköpostin itseisännöinti tarjoaa perustavanlaatuisesti erilaisen lähestymistavan:

1. **Täysi hallinta**: Omistat ja hallitset koko sähköpostiinfrastruktuurin
2. **Todennettavissa oleva yksityisyys**: Koko järjestelmä on läpinäkyvä ja auditoitavissa
3. **Ei luottamuksen tarvetta**: Sinun ei tarvitse luottaa kolmanteen osapuoleen viestinnässäsi
4. **Mukautusvapaus**: Sovita järjestelmä omiin erityistarpeisiisi
5. **Kestävyys**: Palvelusi jatkuu riippumatta yritysten päätöksistä

Kuten eräs käyttäjä totesi: "Sähköpostini itseisännöinti on digitaalinen vastine oman ruoan kasvattamiselle—se vaatii enemmän työtä, mutta tiedän tarkalleen, mitä siinä on."


## Itseisännöity toteutuksemme: Tekninen yleiskatsaus {#our-self-hosted-implementation-technical-overview}

Itseisännöity sähköpostiratkaisumme perustuu samoihin yksityisyyslähtöisiin periaatteisiin, jotka ohjaavat kaikkia tuotteitamme. Tutustutaan tekniseen toteutukseen, joka tekee tämän mahdolliseksi.

### Docker-pohjainen arkkitehtuuri yksinkertaisuuden ja siirrettävyyden vuoksi {#docker-based-architecture-for-simplicity-and-portability}

Olemme paketoineet koko sähköpostiinfrastruktuurimme Dockerilla, mikä tekee sen käyttöönotosta helppoa käytännössä millä tahansa Linux-pohjaisella järjestelmällä. Tämä konttipohjainen lähestymistapa tarjoaa useita keskeisiä etuja:

1. **Yksinkertaistettu käyttöönotto**: Yksi komento pystyttää koko infrastruktuurin
2. **Johdonmukainen ympäristö**: Poistaa "toimii koneellani" -ongelmat
3. **Eristetyt komponentit**: Jokainen palvelu toimii omassa kontissaan turvallisuuden vuoksi
4. **Helppo päivitys**: Yksinkertaiset komennot koko pinon päivittämiseen
5. **Minimaaliset riippuvuudet**: Tarvitsee vain Dockerin ja Docker Composen

Arkkitehtuuri sisältää kontteja:

* Hallintaa varten web-käyttöliittymä
* SMTP-palvelin lähtevälle sähköpostille
* IMAP/POP3-palvelimet sähköpostin noutoon
* CalDAV-palvelin kalentereille
* CardDAV-palvelin yhteystiedoille
* Tietokanta konfiguraation tallennukseen
* Redis välimuistiin ja suorituskykyyn
* SQLite turvalliseen, salattuun postilaatikon tallennukseen

> \[!NOTE]
> Muista tutustua [itseisännöintikehittäjän oppaaseemme](https://forwardemail.net/self-hosted)

### Bash-skriptin asennus: saavutettavuus kohtaa turvallisuuden {#bash-script-installation-accessibility-meets-security}

Olemme suunnitelleet asennusprosessin mahdollisimman yksinkertaiseksi säilyttäen samalla turvallisuuden parhaat käytännöt:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Tämä yksittäinen komento:

1. Tarkistaa järjestelmävaatimukset
2. Opastaa sinua konfiguroinnissa
3. Määrittää DNS-tietueet
4. Konfiguroi TLS-varmenteet
5. Käyttöönottaa Docker-kontit
6. Suorittaa alkuperäisen turvallisuuden kovennuksen

Niille, jotka ovat huolissaan skriptin putkittamisesta bashille (kuten pitääkin!), suosittelemme skriptin tarkastamista ennen suorittamista. Se on täysin avoimen lähdekoodin ja saatavilla tarkastettavaksi.

### Kvanttikestävä salaus tulevaisuuden yksityisyyden turvaamiseksi {#quantum-safe-encryption-for-future-proof-privacy}

Kuten isännöidyssä palvelussamme, myös itseisännöity ratkaisu toteuttaa kvanttikestävän salauksen käyttäen ChaCha20-Poly1305-salausta SQLite-tietokannoille. Tämä lähestymistapa suojaa sähköpostitietojasi paitsi nykyisiltä uhkilta myös tulevilta kvanttilaskennan hyökkäyksiltä.

Jokainen postilaatikko tallennetaan omaan salattuun SQLite-tietokantatiedostoonsa, tarjoten täydellisen eristyksen käyttäjien välillä—merkittävä turvallisuusetu perinteisiin jaettuihin tietokantaratkaisuihin verrattuna.

### Automaattinen ylläpito ja päivitykset {#automated-maintenance-and-updates}

Olemme rakentaneet kattavat ylläpitotyökalut suoraan itseisännöityyn ratkaisuun:

1. **Automaattiset varmuuskopiot**: Ajoitetut varmuuskopiot kaikesta kriittisestä datasta
2. **Varmenteiden uusinta**: Automaattinen Let's Encrypt -varmenteiden hallinta
3. **Järjestelmäpäivitykset**: Yksinkertainen komento uusimpaan versioon päivittämiseen
4. **Terveystarkastukset**: Sisäänrakennetut tarkistukset järjestelmän eheyden varmistamiseksi

Nämä työkalut ovat käytettävissä yksinkertaisen interaktiivisen valikon kautta:

```bash
# script prompt

1. Alkuasetukset
2. Varmuuskopioiden asennus
3. Automaattisten päivitysten asennus
4. Varmennusten uusinta
5. Palautus varmuuskopiosta
6. Ohje
7. Poistu
```


## Avoimen lähdekoodin sitoumus {#the-open-source-commitment}

Itseisännöity sähköpostiratkaisumme, kuten kaikki tuotteemme, on 100 % avoimen lähdekoodin—sekä frontend että backend. Tämä tarkoittaa:
1. **Täysi läpinäkyvyys**: Jokainen koodirivi, joka käsittelee sähköpostejasi, on julkisesti tarkasteltavissa  
2. **Yhteisön panokset**: Kuka tahansa voi tehdä parannuksia tai korjata ongelmia  
3. **Turvallisuus avoimuuden kautta**: Haavoittuvuudet voidaan tunnistaa ja korjata globaalin yhteisön toimesta  
4. **Ei toimittajalukkoa**: Et ole koskaan riippuvainen yrityksemme olemassaolosta  

Koko koodikanta on saatavilla GitHubissa osoitteessa <https://github.com/forwardemail/forwardemail.net>.


## Itseisännöity vs. Hallinnoitu: Oikean valinnan tekeminen {#self-hosted-vs-managed-making-the-right-choice}

Vaikka olemme ylpeitä tarjotessamme itseisännöityä vaihtoehtoa, tunnustamme, ettei se ole oikea valinta kaikille. Sähköpostin itseisännöinti tuo mukanaan todellisia vastuuta ja haasteita:

### Sähköpostin itseisännöinnin todellisuus {#the-reality-of-self-hosting-email}

#### Teknisiä huomioita {#technical-considerations}

* **Palvelimen hallinta**: Sinun tulee ylläpitää VPS- tai dedikoitua palvelinta  
* **DNS-konfiguraatio**: Oikea DNS-asetus on kriittinen toimitettavuuden kannalta  
* **Turvapäivitykset**: Turvapäivitysten seuraaminen on välttämätöntä  
* **Roskapostinhallinta**: Sinun tulee hoitaa roskapostisuodatus  
* **Varmuuskopiointistrategia**: Luotettavien varmuuskopioiden toteuttaminen on sinun vastuullasi  

#### Ajan investointi {#time-investment}

* **Alkuasetukset**: Aikaa asennukseen, vahvistamiseen ja dokumentaation lukemiseen  
* **Jatkuva ylläpito**: Satunnaiset päivitykset ja valvonta  
* **Vianmääritys**: Satunnaista aikaa ongelmien ratkaisuun  

#### Taloudelliset näkökohdat {#financial-considerations}

* **Palvelinkustannukset**: 5–20 $/kk perus-VPS:stä  
* **Verkkotunnuksen rekisteröinti**: 10–20 $/vuosi  
* **Ajan arvo**: Ajan investoinnilla on todellinen arvo  

### Milloin valita hallinnoitu palvelumme {#when-to-choose-our-managed-service}

Monille käyttäjille hallinnoitu palvelumme on edelleen paras vaihtoehto:

1. **Mukavuus**: Me hoidamme kaiken ylläpidon, päivitykset ja valvonnan  
2. **Luotettavuus**: Hyödynnä vakiintunutta infrastruktuuriamme ja asiantuntemustamme  
3. **Tuki**: Saat apua ongelmatilanteissa  
4. **Toimitettavuus**: Hyödynnä vakiintunutta IP-maineemme  
5. **Kustannustehokkuus**: Kun huomioit ajan kustannukset, palvelumme on usein taloudellisempi  

Molemmat vaihtoehdot tarjoavat samat yksityisyysedut ja avoimen lähdekoodin läpinäkyvyyden – ero on yksinkertaisesti siinä, kuka hallinnoi infrastruktuuria.


## Aloittaminen itseisännöidyllä Forward Emaililla {#getting-started-with-self-hosted-forward-email}

Valmiina ottamaan sähköpostiinfrastruktuurisi hallintaan? Näin pääset alkuun:

### Järjestelmävaatimukset {#system-requirements}

* Ubuntu 20.04 LTS tai uudempi (suositeltu)  
* Vähintään 1 Gt RAM (2 Gt+ suositeltu)  
* 20 Gt tallennustilaa suositeltu  
* Hallitsemasi verkkotunnus  
* Julkinen IP-osoite, jossa portti 25 tuettu  
* Mahdollisuus asettaa [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* IPv4- ja IPv6-tuki  

> \[!TIP]  
> Suosittelemme useita sähköpostipalvelimen tarjoajia osoitteessa <https://forwardemail.net/blog/docs/best-mail-server-providers> (lähde osoitteessa <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Asennusvaiheet {#installation-steps}

1. **Suorita asennusskripti**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Seuraa vuorovaikutteisia ohjeita**:  
   * Syötä verkkotunnuksesi  
   * Määritä ylläpitäjän tunnistetiedot  
   * Aseta DNS-tietueet ohjeiden mukaan  
   * Valitse haluamasi konfiguraatiovaihtoehdot  

3. **Vahvista asennus**:  
   Kun asennus on valmis, voit varmistaa kaiken toimivuuden:  
   * Tarkistamalla konttien tilan: `docker ps`  
   * Lähettämällä testisähköpostin  
   * Kirjautumalla web-käyttöliittymään  


## Itseisännöidyn sähköpostin tulevaisuus {#the-future-of-self-hosted-email}

Itseisännöity ratkaisumme on vasta alkua. Olemme sitoutuneet jatkuvasti parantamaan tätä tarjontaa:

1. **Parannetut hallintatyökalut**: Tehokkaampi web-pohjainen hallinta  
2. **Lisää todennusvaihtoehtoja**: Mukaan lukien laitteistoturva-avaintuki  
3. **Edistynyt valvonta**: Paremmat näkymät järjestelmän terveyteen ja suorituskykyyn  
4. **Monipalvelinratkaisut**: Vaihtoehtoja korkean käytettävyyden kokoonpanoihin  
5. **Yhteisölähtöiset parannukset**: Käyttäjien panosten hyödyntäminen
## Yhteenveto: Sähköpostivapaus kaikille {#conclusion-email-freedom-for-everyone}

Itseisännöimämme sähköpostiratkaisun lanseeraus merkitsee merkittävää virstanpylvästä missiossamme tarjota yksityisyyteen keskittyviä, läpinäkyviä sähköpostipalveluita. Valitsitpa hallinnoidun palvelumme tai itseisännöidyn vaihtoehdon, hyödyt horjumattomasta sitoutumisestamme avoimen lähdekoodin periaatteisiin ja yksityisyyttä ensisijaisesti huomioivaan suunnitteluun.

Sähköposti on liian tärkeä ollakseen suljettujen, omistusoikeudellisten järjestelmien hallinnassa, jotka asettavat tiedonkeruun käyttäjän yksityisyyden edelle. Forward Emailin itseisännöidyllä ratkaisulla olemme ylpeitä voidessamme tarjota aidon vaihtoehdon—sellaisen, joka antaa sinulle täydellisen hallinnan digitaalisiin viestintävälineisiisi.

Uskomme, että yksityisyys ei ole vain ominaisuus; se on perustavanlaatuinen oikeus. Ja itseisännöidyllä sähköpostivaihtoehdollamme teemme tästä oikeudesta entistä saavutettavamman kuin koskaan ennen.

Valmiina ottamaan sähköpostisi hallintaasi? [Aloita tänään](https://forwardemail.net/self-hosted) tai tutustu [GitHub-repositoroomme](https://github.com/forwardemail/forwardemail.net) saadaksesi lisätietoja.


## Lähteet {#references}

\[1] Forward Email GitHub Repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Itseisännöity Dokumentaatio: <https://forwardemail.net/en/self-hosted>

\[3] Sähköpostin Yksityisyyden Tekninen Toteutus: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Miksi Avoimen Lähdekoodin Sähköposti On Tärkeää: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
