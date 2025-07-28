# Itse isännöity sähköposti: Sitoutuminen avoimeen lähdekoodiin {#self-hosted-email-commitment-to-open-source}

<img loading="laiska" src="/img/articles/self-hosted.webp" alt="" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Miksi itseisännöidyt sähköpostit ovat tärkeitä](#why-self-hosted-email-matters)
  * [Perinteisten sähköpostipalvelujen ongelma](#the-problem-with-traditional-email-services)
  * [Itseisännöity vaihtoehto](#the-self-hosted-alternative)
* [Itse isännöity toteutus: tekninen yleiskatsaus](#our-self-hosted-implementation-technical-overview)
  * [Docker-pohjainen arkkitehtuuri yksinkertaisuuteen ja siirrettävyyteen](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-skriptin asennus: Helppokäyttöisyys täyttää suojauksen](#bash-script-installation-accessibility-meets-security)
  * [Kvanttiturvallinen salaus tulevaisuuden varmaa yksityisyyttä varten](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatisoitu ylläpito ja päivitykset](#automated-maintenance-and-updates)
* [Avoimen lähdekoodin sitoumus](#the-open-source-commitment)
* [Itseisännöity vs. hallinnoitu: oikean valinnan tekeminen](#self-hosted-vs-managed-making-the-right-choice)
  * [Itsepalvelusähköpostin todellisuus](#the-reality-of-self-hosting-email)
  * [Milloin valita hallittu palvelumme](#when-to-choose-our-managed-service)
* [Itseisännöidyn edelleenlähetyssähköpostin käytön aloittaminen](#getting-started-with-self-hosted-forward-email)
  * [Järjestelmävaatimukset](#system-requirements)
  * [Asennusvaiheet](#installation-steps)
* [Itseisännöidyn sähköpostin tulevaisuus](#the-future-of-self-hosted-email)
* [Johtopäätös: Sähköpostin vapaus kaikille](#conclusion-email-freedom-for-everyone)
* [Viitteet](#references)

## Esipuhe {#foreword}

Nykypäivän digitaalisessa ympäristössä sähköposti on edelleen verkkoidentiteettimme ja -viestintämme selkäranka. Kuitenkin, kun tietosuojahuolet kasvavat, monet käyttäjät joutuvat vaikean valinnan eteen: mukavuus yksityisyyden kustannuksella tai yksityisyys mukavuuden kustannuksella. Forward Emailissa olemme aina uskoneet, että sinun ei tarvitse valita näiden kahden välillä.

Tänään meillä on ilo ilmoittaa merkittävästä virstanpylvästä matkallamme: itseisännöidyn sähköpostiratkaisumme lanseerauksesta. Tämä ominaisuus edustaa syvimpää sitoutumistamme avoimen lähdekoodin periaatteisiin, yksityisyyteen keskittyvään suunnitteluun ja käyttäjien voimaannuttamiseen. Itseisännöidyllä vaihtoehdolla annamme sähköpostiviestinnän täyden tehon ja hallinnan suoraan käsiisi.

Tämä blogikirjoitus tutkii itse isännöidyn ratkaisumme taustalla olevaa filosofiaa, sen teknistä toteutusta ja sitä, miksi sillä on merkitystä käyttäjille, jotka asettavat sekä yksityisyyden että omistajuuden etusijalle digitaalisessa viestinnässään.

## Miksi itse isännöity sähköposti on tärkeä {#why-self-hosted-email-matters}

Itse isännöity sähköpostiratkaisumme on selkein osoitus uskostamme, että todellinen yksityisyys tarkoittaa hallintaa, ja valvonta alkaa avoimesta lähdekoodista. Käyttäjille, jotka vaativat täydellistä omistusta digitaaliseen viestintään, itseisännöinti ei ole enää reuna-ajatus – se on olennainen oikeus. Olemme ylpeitä voidessamme seistä tämän uskomuksen takana täysin avoimella, todennettavissa olevalla alustalla, jota voit käyttää omin ehdoin.

### Perinteisten sähköpostipalveluiden ongelma {#the-problem-with-traditional-email-services}

Perinteiset sähköpostipalvelut asettavat useita perustavanlaatuisia haasteita tietosuojatietoisille käyttäjille:

1. **Luottamusvaatimukset**: Sinun on luotettava palveluntarjoajaan, ettei se käytä, analysoi tai jaa tietojasi.
2. **Keskitetty hallinta**: Käyttöoikeutesi voidaan peruuttaa milloin tahansa mistä tahansa syystä.
3. **Valvonnan haavoittuvuus**: Keskitetyt palvelut ovat ensisijaisia valvonnan kohteita.
4. **Rajoitettu läpinäkyvyys**: Useimmat palvelut käyttävät suljetun lähdekoodin ohjelmistoja.
5. **Toimittajariippuvuus**: Näistä palveluista pois siirtyminen voi olla vaikeaa tai mahdotonta.

Jopa "yksityisyyteen keskittyvät" sähköpostipalveluntarjoajat jäävät usein vajaaksi, koska ne käyttävät vain avoimen lähdekoodin käyttöliittymäsovelluksia ja pitävät taustajärjestelmänsä omistusoikeudellisina ja suljettuina. Tämä luo merkittävän luottamuksen kuilun – sinua pyydetään uskomaan heidän tietosuojalupauksiinsa ilman kykyä vahvistaa niitä.

### Itse isännöity vaihtoehto {#the-self-hosted-alternative}

Sähköpostisi itseisännöiminen tarjoaa täysin erilaisen lähestymistavan:

1. **Täydellinen hallinta**: Omistat ja hallitset koko sähköpostiinfrastruktuuria.
2. **Todennettavissa oleva yksityisyys**: Koko järjestelmä on läpinäkyvä ja auditoitavissa.
3. **Ei luottamusta vaadita**: Sinun ei tarvitse luottaa viestintääsi kolmanteen osapuoleen.
4. **Mukauttamisen vapaus**: Sovita järjestelmä omiin tarpeisiisi.
5. **Jätevyys**: Palvelusi jatkuu riippumatta yrityksen päätöksistä.

Kuten eräs käyttäjä sanoi: "Sähköpostini itseisännöiminen on digitaalinen vastine oman ruoani kasvattamiselle – se vaatii enemmän työtä, mutta tiedän tarkalleen, mitä siinä on."

## Itse isännöity toteutuksemme: Tekninen yleiskatsaus {#our-self-hosted-implementation-technical-overview}

Itse isännöimä sähköpostiratkaisumme on rakennettu samoihin yksityisyys etusijalle -periaatteisiin, jotka ohjaavat kaikkia tuotteitamme. Tutkitaanpa teknistä toteutusta, joka tekee tämän mahdolliseksi.

### Docker-pohjainen arkkitehtuuri yksinkertaisuutta ja siirrettävyyttä varten {#docker-based-architecture-for-simplicity-and-portability}

Olemme pakkaaneet koko sähköpostiinfrastruktuurimme Dockerin avulla, mikä tekee siitä helpon ottaa käyttöön käytännössä missä tahansa Linux-pohjaisessa järjestelmässä. Tämä konttimuotoinen lähestymistapa tarjoaa useita keskeisiä etuja:

1. **Yksinkertaistettu käyttöönotto**: Koko infrastruktuuri voidaan määrittää yhdellä komennolla.
2. **Yhdenmukainen ympäristö**: Poistaa "toimii omalla koneellani" -ongelmat.
3. **Eristetyt komponentit**: Jokainen palvelu toimii omassa säilössään turvallisuuden takaamiseksi.
4. **Helppo päivitys**: Yksinkertaiset komennot koko pinon päivittämiseen.
5. **Minimaaliset riippuvuudet**: Vaatii vain Dockerin ja Docker Composen.

Arkkitehtuuri sisältää säiliöitä:

* Web-käyttöliittymä hallintaan
* SMTP-palvelin lähtevälle sähköpostille
* IMAP/POP3-palvelimet sähköpostin noutamiseen
* CalDAV-palvelin kalentereille
* CardDAV-palvelin yhteystiedoille
* Tietokanta kokoonpanon tallennukseen
* Redis välimuistin ja suorituskyvyn parantamiseen
* SQLite turvalliseen ja salattuun postilaatikoiden tallennukseen

> \[!NOTE]
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Bash-komentosarjan asennus: Esteettömyys kohtaa turvallisuuden {#bash-script-installation-accessibility-meets-security}

Olemme suunnitelleet asennusprosessin mahdollisimman yksinkertaiseksi säilyttäen samalla turvallisuuden parhaat käytännöt:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Tämä yksittäinen komento:

1. Tarkistaa järjestelmävaatimukset
2. Opastaa sinua konfiguroinnissa
3. Määrittää DNS-tietueet
4. Konfiguroi TLS-varmenteet
5. Ottaa käyttöön Docker-kontit
6. Suorittaa alustavan suojauksen vahvistamisen

Niille, jotka ovat huolissaan komentosarjojen ohjaamisesta bashiin (kuten sinun pitäisi olla!), suosittelemme skriptin tarkistamista ennen sen suorittamista. Se on täysin avoimen lähdekoodin ja saatavilla tarkastettavaksi.

### Kvanttiturvallinen salaus tulevaisuudenkestävää yksityisyyttä varten {#quantum-safe-encryption-for-future-proof-privacy}

Kuten isännöity palvelumme, itseisännöity ratkaisumme toteuttaa kvanttikestävän salauksen käyttämällä ChaCha20-Poly1305:tä SQLite-tietokantojen salauksena. Tämä lähestymistapa suojaa sähköpostitietojasi ei vain nykyisiltä uhilta, vaan myös tulevilta kvanttitietokonehyökkäyksiä vastaan.

Jokainen postilaatikko on tallennettu omaan salattuun SQLite-tietokantatiedostoonsa, mikä tarjoaa täydellisen eristyksen käyttäjien välillä – merkittävä tietoturvaetu perinteisiin jaettuihin tietokantoihin verrattuna.

### Automaattinen ylläpito ja päivitykset {#automated-maintenance-and-updates}

Olemme rakentaneet kattavat ylläpitoapuohjelmat suoraan itse isännöityyn ratkaisuun:

1. **Automaattiset varmuuskopiot**: Kaikkien kriittisten tietojen ajoitetut varmuuskopiot
2. **Varmenteen uusiminen**: Automaattinen Let's Encrypt -varmenteiden hallinta
3. **Järjestelmäpäivitykset**: Yksinkertainen komento uusimpaan versioon päivittämiseen
4. **Kunnonvalvonta**: Sisäänrakennetut tarkistukset järjestelmän eheyden varmistamiseksi

Nämä apuohjelmat ovat käytettävissä yksinkertaisen interaktiivisen valikon kautta:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Avoimen lähdekoodin sitoumus {#the-open-source-commitment}

Itse isännöity sähköpostiratkaisumme, kuten kaikki tuotteemme, on 100-prosenttisesti avoimen lähdekoodin – sekä käyttöliittymä että taustajärjestelmä. Tämä tarkoittaa:

1. **Täydellinen läpinäkyvyys**: Jokainen sähköpostiasi käsittelevä koodirivi on julkisesti tarkasteltavissa.
2. **Yhteisön panokset**: Kuka tahansa voi osallistua parannuksiin tai korjata ongelmia.
3. **Turvallisuus avoimuuden kautta**: Haavoittuvuudet voidaan tunnistaa ja korjata globaalin yhteisön toimesta.
4. **Ei toimittajasidonnaisuutta**: Et ole koskaan riippuvainen yrityksemme olemassaolosta.

Koko koodikanta on saatavilla GitHubissa osoitteessa <https://github.com/forwardemail/forwardemail.net>.

## Itse isännöity vs. hallinnoitu: Oikean valinnan tekeminen {#self-hosted-vs-managed-making-the-right-choice}

Vaikka olemme ylpeitä voidessamme tarjota itseisännöidyn vaihtoehdon, ymmärrämme, että se ei ole oikea valinta kaikille. Itse isännöivä sähköposti sisältää todellisia velvollisuuksia ja haasteita:

### Itsepalvelusähköpostin todellisuus {#the-reality-of-self-hosting-email}

#### Tekniset huomiot {#technical-considerations}

* **Palvelimen hallinta**: Sinun on ylläpidettävä VPS:ää tai erillistä palvelinta.* **DNS-konfiguraatio**: Oikea DNS-konfiguraatio on ratkaisevan tärkeää toimitusten kannalta.* **Tietoturvapäivitykset**: Tietoturvakorjausten ajan tasalla pysyminen on olennaista.* **Roskapostin hallinta**: Sinun on huolehdittava roskapostin suodatuksesta.* **Varmuuskopiointistrategia**: Luotettavien varmuuskopioiden toteuttaminen on sinun vastuullasi.

#### Aikainvestointi {#time-investment}

* **Alkuasennus**: Aikaa asennukseen, tarkistamiseen ja dokumentaation lukemiseen
* **Jatkuva ylläpito**: Satunnaisia päivityksiä ja valvontaa
* **Vianmääritys**: Satunnaista aikaa ongelmien ratkaisemiseen

#### Taloudelliset näkökohdat {#financial-considerations}

* **Palvelinkustannukset**: 5–20 dollaria/kk perus-VPS:lle
* **Verkkotunnuksen rekisteröinti**: 10–20 dollaria/vuosi
* **Aika-arvo**: Aikainvestoinnillasi on todellista arvoa

### Milloin valita hallinnoitu palvelumme {#when-to-choose-our-managed-service}

Monille käyttäjille hallittu palvelumme on edelleen paras vaihtoehto:

1. **Kätevyys**: Hoidamme kaiken ylläpidon, päivitykset ja valvonnan
2. **Luotettavuus**: Hyödynnä vakiintunutta infrastruktuuriamme ja asiantuntemustamme
3. **Tuki**: Saat apua ongelmatilanteissa
4. **Toimitettavuus**: Hyödynnä vakiintunutta IP-mainettamme
5. **Kustannustehokkuus**: Kun otat huomioon aikakustannukset, palvelumme on usein taloudellisempi

Molemmat vaihtoehdot tarjoavat samat tietosuojaedut ja avoimen lähdekoodin läpinäkyvyyden – ero on vain siinä, kuka hallinnoi infrastruktuuria.

## Itse isännöidyn sähköpostin edelleenlähetyksen aloittaminen {#getting-started-with-self-hosted-forward-email}

Oletko valmis ottamaan sähköpostisi infrastruktuurin hallintaan? Näin pääset alkuun:

### Järjestelmävaatimukset {#system-requirements}

* Ubuntu 20.04 LTS tai uudempi (suositus)
* Vähintään 1 Gt RAM-muistia (suositus yli 2 Gt)
* Suositus 20 Gt tallennustilaa
* Hallitsemasi verkkotunnus
* Julkinen IP-osoite, jossa on portti 25 -tuki
* Mahdollisuus asettaa [käänteinen PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- ja IPv6-tuki

> \[!TIP]
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

### Asennusvaiheet {#installation-steps}

1. **Suorita asennusskripti**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Noudata interaktiivisia kehotteita**:
* Anna verkkotunnuksesi nimi
* Määritä järjestelmänvalvojan tunnistetiedot
* Määritä DNS-tietueet ohjeiden mukaisesti
* Valitse haluamasi määritysvaihtoehdot

3. **Tarkista asennus**:
Kun asennus on valmis, voit varmistaa, että kaikki toimii:
* Tarkistamalla säilön tilan: `docker ps`
* Lähettämällä testisähköpostin
* Kirjaudumalla verkkokäyttöliittymään

## Itse isännöidyn sähköpostin tulevaisuus {#the-future-of-self-hosted-email}

Itsenäinen ratkaisumme on vasta alkua. Olemme sitoutuneet parantamaan tätä tarjontaa jatkuvasti seuraavilla tavoilla:

1. **Parannetut hallintatyökalut**: Tehokkaampi verkkopohjainen hallinta
2. **Lisätodennusvaihtoehdot**: Sisältää laitteiston suojausavaimen tuen
3. **Edistynyt valvonta**: Parempia tietoja järjestelmän kunnosta ja suorituskyvystä
4. **Usean palvelimen käyttöönotto**: Vaihtoehtoja korkean käytettävyyden kokoonpanoille
5. **Yhteisön tekemät parannukset**: Käyttäjien panosten sisällyttäminen

## Yhteenveto: Sähköpostin vapaus kaikille {#conclusion-email-freedom-for-everyone}

Itseisännöidyn sähköpostiratkaisumme lanseeraus on merkittävä virstanpylväs tehtävässämme tarjota yksityisyyteen keskittyviä, läpinäkyviä sähköpostipalveluita. Valitsetpa hallitun palvelumme tai itseisännöidyn vaihtoehdon, hyödyt horjumattomasta sitoutumisestamme avoimen lähdekoodin periaatteisiin ja yksityisyyden etusijalle.

Sähköposti on liian tärkeä hallitakseen sitä suljetuilla omistusjärjestelmillä, jotka asettavat tiedonkeruun etusijalle käyttäjien yksityisyyden sijaan. Forward Emailin itseisännöidyn ratkaisun avulla olemme ylpeitä voidessamme tarjota aidon vaihtoehdon – sellaisen, jonka avulla voit hallita digitaalista viestintääsi täysin.

Uskomme, että yksityisyys ei ole vain ominaisuus; se on perusoikeus. Ja itse isännöidyllä sähköpostivaihtoehdollamme teemme tästä oikeudesta helpomman kuin koskaan ennen.

Oletko valmis ottamaan sähköpostisi hallintaasi? [Aloita tänään](https://forwardemail.net/self-hosted) tai tutustu [GitHub-arkisto](https://github.com/forwardemail/forwardemail.net) saadaksesi lisätietoja.

## Viitteet {#references}

\[1] Sähköpostin edelleenlähetys GitHub-arkisto: <https://github.com/forwardemail/forwardemail.net>

\[2] Itse isännöity dokumentaatio: <https://forwardemail.net/en/self-hosted>

\[3] Sähköpostin yksityisyyden tekninen toteutus: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Miksi avoimen lähdekoodin sähköposti on tärkeää: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>