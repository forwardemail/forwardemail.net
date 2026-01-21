# Itse isännöity sähköposti: Sitoutuminen avoimeen lähdekoodiin {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Miksi itse isännöity sähköposti on tärkeä](#why-self-hosted-email-matters)
  * [Perinteisten sähköpostipalveluiden ongelma](#the-problem-with-traditional-email-services)
  * [Itse isännöity vaihtoehto](#the-self-hosted-alternative)
* [Itse isännöity toteutuksemme: Tekninen yleiskatsaus](#our-self-hosted-implementation-technical-overview)
  * [Docker-pohjainen arkkitehtuuri yksinkertaisuutta ja siirrettävyyttä varten](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-komentosarjan asennus: Esteettömyys kohtaa turvallisuuden](#bash-script-installation-accessibility-meets-security)
  * [Kvanttiturvallinen salaus tulevaisuudenkestävää yksityisyyttä varten](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatisoitu ylläpito ja päivitykset](#automated-maintenance-and-updates)
* [Avoimen lähdekoodin sitoumus](#the-open-source-commitment)
* [Itse isännöity vs. hallinnoitu: oikean valinnan tekeminen](#self-hosted-vs-managed-making-the-right-choice)
  * [Itsenäisen sähköpostin todellisuus](#the-reality-of-self-hosting-email)
  * [Milloin valita hallinnoitu palvelumme](#when-to-choose-our-managed-service)
* [Itse isännöidyn sähköpostin edelleenlähetyksen aloittaminen](#getting-started-with-self-hosted-forward-email)
  * [Järjestelmävaatimukset](#system-requirements)
  * [Asennusvaiheet](#installation-steps)
* [Itse isännöidyn sähköpostin tulevaisuus](#the-future-of-self-hosted-email)
* [Johtopäätös: Sähköpostin vapaus kaikille](#conclusion-email-freedom-for-everyone)
* [Viitteet](#references)

## Esipuhe {#foreword}

Nykypäivän digitaalisessa maailmassa sähköposti on edelleen verkkoidentiteettimme ja -viestintämme selkäranka. Yksityisyydensuojan kasvaessa monet käyttäjät kohtaavat kuitenkin vaikean valinnan: mukavuus yksityisyyden kustannuksella vai yksityisyys mukavuuden kustannuksella. Forward Emaililla olemme aina uskoneet, ettei sinun pitäisi joutua valitsemaan näiden kahden välillä.

Tänään meillä on ilo ilmoittaa merkittävästä virstanpylväästä matkallamme: itse isännöidyn sähköpostiratkaisumme lanseerauksesta. Tämä ominaisuus edustaa syvintä sitoutumistamme avoimen lähdekoodin periaatteisiin, yksityisyyttä kunnioittavaan suunnitteluun ja käyttäjien voimaannuttamiseen. Itse isännöidyn vaihtoehtomme avulla annamme sähköpostiviestintäsi täyden hallinnan suoraan käsiisi.

Tässä blogikirjoituksessa tarkastellaan itse isännöidyn ratkaisumme taustalla olevaa filosofiaa, sen teknistä toteutusta ja sitä, miksi se on tärkeää käyttäjille, jotka asettavat digitaalisessa viestinnässään etusijalle sekä yksityisyyden että omistajuuden.

## Miksi itse isännöity sähköposti on tärkeä {#why-self-hosted-email-matters}

Itse isännöity sähköpostiratkaisumme on selkein osoitus uskomuksestamme, että todellinen yksityisyys tarkoittaa hallintaa, ja hallinta alkaa avoimesta lähdekoodista. Käyttäjille, jotka vaativat täyttä vastuuta digitaalisesta viestinnästään, itse isännöinti ei ole enää marginaalinen ajatus – se on olennainen oikeus. Olemme ylpeitä voidessamme seistä tämän uskomuksen takana täysin avoimella ja todennettavissa olevalla alustalla, jota voit käyttää omilla ehdoillasi.

### Perinteisten sähköpostipalveluiden ongelma {#the-problem-with-traditional-email-services}

Perinteiset sähköpostipalvelut asettavat useita perustavanlaatuisia haasteita yksityisyyttä tiedostaville käyttäjille:

1. **Luottamusvaatimukset**: Sinun on luotettava palveluntarjoajaan, ettei se käytä, analysoi tai jaa tietojasi.
2. **Keskitetty hallinta**: Käyttöoikeutesi voidaan peruuttaa milloin tahansa mistä tahansa syystä.
3. **Valvonnan haavoittuvuus**: Keskitetyt palvelut ovat ensisijaisia valvonnan kohteita.
4. **Rajoitettu läpinäkyvyys**: Useimmat palvelut käyttävät suljetun lähdekoodin ohjelmistoja.
5. **Toimittajariippuvuus**: Näistä palveluista pois siirtyminen voi olla vaikeaa tai mahdotonta.

Jopa "yksityisyyteen keskittyvät" sähköpostipalveluntarjoajat epäonnistuvat usein tarjoamalla avoimen lähdekoodin vain käyttöliittymäsovelluksilleen, mutta pitämällä taustajärjestelmänsä omistusoikeudellisina ja suljettuina. Tämä luo merkittävän luottamuskuilun – sinua pyydetään uskomaan heidän tietosuojalupauksiinsa ilman, että voit varmistaa niiden paikkansapitävyyden.

### Itse isännöity vaihtoehto {#the-self-hosted-alternative}

Sähköpostin itse isännöinti tarjoaa perustavanlaatuisen lähestymistavan:

1. **Täydellinen hallinta**: Omistat ja hallitset koko sähköpostiinfrastruktuuria.
2. **Todennettavissa oleva yksityisyys**: Koko järjestelmä on läpinäkyvä ja auditoitavissa.
3. **Ei luottamusta vaadita**: Sinun ei tarvitse luottaa viestintääsi kolmanteen osapuoleen.
4. **Mukauttamisen vapaus**: Sovita järjestelmä omiin tarpeisiisi.
5. **Jätevyys**: Palvelusi jatkuu riippumatta yrityksen päätöksistä.

Kuten eräs käyttäjä asian ilmaisi: "Sähköpostin itse ylläpitäminen on digitaalinen vastine oman ruoan kasvattamiselle – se vaatii enemmän työtä, mutta tiedän tarkalleen, mitä siellä on."

## Itse isännöity toteutuksemme: tekninen yleiskatsaus {#our-self-hosted-implementation-technical-overview}

Itse isännöity sähköpostiratkaisumme perustuu samoihin yksityisyyttä etusijalle asettaviin periaatteisiin, jotka ohjaavat kaikkia tuotteitamme. Tutustutaanpa tekniseen toteutukseen, joka mahdollistaa tämän.

### Docker-pohjainen arkkitehtuuri yksinkertaisuutta ja siirrettävyyttä varten {#docker-based-architecture-for-simplicity-and-portability}

Olemme paketoineet koko sähköposti-infrastruktuurimme Dockerin avulla, mikä helpottaa sen käyttöönottoa käytännössä missä tahansa Linux-pohjaisessa järjestelmässä. Tämä konttipohjainen lähestymistapa tarjoaa useita keskeisiä etuja:

1. **Yksinkertaistettu käyttöönotto**: Koko infrastruktuuri voidaan määrittää yhdellä komennolla.
2. **Yhdenmukainen ympäristö**: Poistaa "toimii omalla koneellani" -ongelmat.
3. **Eristetyt komponentit**: Jokainen palvelu toimii omassa säilössään turvallisuuden takaamiseksi.
4. **Helppo päivitys**: Yksinkertaiset komennot koko pinon päivittämiseen.
5. **Minimaaliset riippuvuudet**: Vaatii vain Dockerin ja Docker Composen.

Arkkitehtuuri sisältää säilöt seuraaville:

* Web-käyttöliittymä hallintaan
* SMTP-palvelin lähtevälle sähköpostille
* IMAP/POP3-palvelimet sähköpostin noutamiseen
* CalDAV-palvelin kalentereille
* CardDAV-palvelin yhteystiedoille
* Tietokanta kokoonpanon tallennukseen
* Redis välimuistin ja suorituskyvyn parantamiseen
* SQLite turvalliseen ja salattuun postilaatikoiden tallennukseen

> \[!NOTE]
> Muista tutustua [itse isännöidyn kehittäjän opas](https://forwardemail.net/self-hosted)-sivustoomme

### Bash-komentosarjan asennus: Esteettömyys kohtaa tietoturvan {#bash-script-installation-accessibility-meets-security}

Olemme suunnitelleet asennusprosessin mahdollisimman yksinkertaiseksi ja samalla noudattaneet parhaita turvallisuuskäytäntöjä:

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

Niille, jotka ovat huolissaan skriptien putkittamisesta ja jakamisesta (kuten teidän pitäisikin olla!), suosittelemme skriptin tarkistamista ennen sen suorittamista. Se on täysin avoimen lähdekoodin ja saatavilla tarkastettavaksi.

### Kvanttiturvallinen salaus tulevaisuudenkestävää yksityisyyttä varten {#quantum-safe-encryption-for-future-proof-privacy}

Kuten isännöity palvelumme, myös itse isännöity ratkaisumme toteuttaa kvanttisuojatun salauksen käyttäen ChaCha20-Poly1305-salausmenetelmää SQLite-tietokannoissa. Tämä lähestymistapa suojaa sähköpostitietojasi paitsi nykyisiltä uhilta myös tulevaisuuden kvanttilaskentahyökkäyksiltä.

Jokainen postilaatikko tallennetaan omaan salattuun SQLite-tietokantatiedostoonsa, mikä tarjoaa täydellisen eristyksen käyttäjien välillä – merkittävä tietoturvaetu perinteisiin jaettuihin tietokantamenetelmiin verrattuna.

### Automaattinen ylläpito ja päivitykset {#automated-maintenance-and-updates}

Olemme rakentaneet kattavat ylläpito-apuohjelmat suoraan itse isännöityyn ratkaisuun:

1. **Automaattiset varmuuskopiot**: Kaikkien kriittisten tietojen ajoitetut varmuuskopiot
2. **Varmenteen uusiminen**: Automaattinen Let's Encrypt -varmenteiden hallinta
3. **Järjestelmäpäivitykset**: Yksinkertainen komento uusimpaan versioon päivittämiseen
4. **Kunnonvalvonta**: Sisäänrakennetut tarkistukset järjestelmän eheyden varmistamiseksi

Näihin apuohjelmiin pääsee yksinkertaisen interaktiivisen valikon kautta:

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

Itse isännöity sähköpostiratkaisumme, kuten kaikki tuotteemme, on 100 % avoimen lähdekoodin – sekä käyttöliittymän että taustajärjestelmän osalta. Tämä tarkoittaa:

1. **Täydellinen läpinäkyvyys**: Jokainen sähköpostiasi käsittelevä koodirivi on julkisesti tarkasteltavissa.
2. **Yhteisön panokset**: Kuka tahansa voi osallistua parannuksiin tai korjata ongelmia.
3. **Turvallisuus avoimuuden kautta**: Haavoittuvuudet voidaan tunnistaa ja korjata globaalin yhteisön toimesta.
4. **Ei toimittajasidonnaisuutta**: Et ole koskaan riippuvainen yrityksemme olemassaolosta.

Koko koodikanta on saatavilla GitHubissa osoitteessa <https://github.com/forwardemail/forwardemail.net>.

## Itse isännöity vs. hallinnoitu: Oikean valinnan tekeminen {#self-hosted-vs-managed-making-the-right-choice}

Vaikka olemme ylpeitä voidessamme tarjota itse isännöidyn vaihtoehdon, ymmärrämme, ettei se ole oikea valinta kaikille. Itse isännöityyn sähköpostiin liittyy todellisia vastuita ja haasteita:

### Itseisännöidyn sähköpostin todellisuus {#the-reality-of-self-hosting-email}

#### Tekniset huomioitavat asiat {#technical-considerations}

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

Monille käyttäjille hallinnoitu palvelumme on edelleen paras vaihtoehto:

1. **Kätevyys**: Hoidamme kaiken ylläpidon, päivitykset ja valvonnan
2. **Luotettavuus**: Hyödynnä vakiintunutta infrastruktuuriamme ja asiantuntemustamme
3. **Tuki**: Saat apua ongelmatilanteissa
4. **Toimitettavuus**: Hyödynnä vakiintunutta IP-mainettamme
5. **Kustannustehokkuus**: Kun otat huomioon aikakustannukset, palvelumme on usein taloudellisempi

Molemmat vaihtoehdot tarjoavat samat yksityisyydensuojan edut ja avoimen lähdekoodin läpinäkyvyyden – ero on yksinkertaisesti siinä, kuka hallinnoi infrastruktuuria.

## Itse isännöidyn sähköpostin edelleenlähetyksen aloittaminen {#getting-started-with-self-hosted-forward-email}

Oletko valmis ottamaan sähköposti-infrastruktuurisi hallintaasi? Näin pääset alkuun:

### Järjestelmävaatimukset {#system-requirements}

* Ubuntu 20.04 LTS tai uudempi (suositus)
* Vähintään 1 Gt RAM-muistia (suositus yli 2 Gt)
* Suositus 20 Gt tallennustilaa
* Hallitsemasi verkkotunnus
* Julkinen IP-osoite, jossa on portti 25 -tuki
* Mahdollisuus asettaa [käänteinen PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- ja IPv6-tuki

> \[!TIP]
> Suosittelemme useita sähköpostipalvelinpalveluntarjoajia osoitteessa <https://forwardemail.net/blog/docs/best-mail-server-providers> (lähde osoitteessa <https://github.com/forwardemail/awesome-mail-server-providers>)

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

Itse isännöity ratkaisumme on vasta alkua. Olemme sitoutuneet parantamaan tätä tarjontaa jatkuvasti seuraavilla tavoilla:

1. **Parannetut hallintatyökalut**: Tehokkaampi verkkopohjainen hallinta
2. **Lisätodennusvaihtoehdot**: Sisältää laitteiston suojausavaimen tuen
3. **Edistynyt valvonta**: Parempia tietoja järjestelmän kunnosta ja suorituskyvystä
4. **Usean palvelimen käyttöönotto**: Vaihtoehtoja korkean käytettävyyden kokoonpanoille
5. **Yhteisön tekemät parannukset**: Käyttäjien panosten sisällyttäminen

## Yhteenveto: Sähköpostin vapaus kaikille {#conclusion-email-freedom-for-everyone}

Itse isännöidyn sähköpostiratkaisumme lanseeraus on merkittävä virstanpylväs tavoitteessamme tarjota yksityisyyteen keskittyviä ja läpinäkyviä sähköpostipalveluita. Riippumatta siitä, valitsetko hallitun palvelumme vai itse isännöidyn vaihtoehdon, hyödyt horjumattomasta sitoutumisestamme avoimen lähdekoodin periaatteisiin ja yksityisyys etusijalle asetettavaan suunnitteluun.

Sähköposti on liian tärkeä suljetuille, suljetuille järjestelmille, jotka asettavat tiedonkeruun etusijalle käyttäjien yksityisyyden kustannuksella. Forward Emailin itse isännöidyn ratkaisun avulla tarjoamme ylpeänä aidon vaihtoehdon – sellaisen, joka antaa sinulle täyden hallinnan digitaalisesta viestinnästäsi.

Uskomme, että yksityisyys ei ole vain ominaisuus, vaan perusoikeus. Ja itse isännöidyn sähköpostivaihtoehdon avulla teemme tästä oikeudesta helpommin saavutettavan kuin koskaan ennen.

Oletko valmis ottamaan sähköpostisi hallintaasi? [Aloita jo tänään](https://forwardemail.net/self-hosted) tai tutustu [GitHub-arkisto](https://github.com/forwardemail/forwardemail.net)-sivustoomme saadaksesi lisätietoja.

## Viitteet {#references}

\[1] Sähköpostin edelleenlähetys GitHub-arkistoon: <https://github.com/forwardemail/forwardemail.net>

\[2] Itse isännöity dokumentaatio: <https://forwardemail.net/en/self-hosted>

\[3] Sähköpostin yksityisyyden tekninen toteutus: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Miksi avoimen lähdekoodin sähköposti on tärkeää: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>