# Sähköpostin edelleenlähetys toimii sähköpostin edelleenlähetyksen kanssa: Perimmäinen opas {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Email privacy protection technical implementation" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Mikä on sähköpostin edelleenlähetys](#what-is-email-forwarding)
* [Sähköpostin edelleenlähetys toimii: tekninen selitys](#how-email-forwarding-works-the-technical-explanation)
  * [Sähköpostin edelleenlähetysprosessi](#the-email-forwarding-process)
  * [SRS:n (lähettäjän uudelleenkirjoitusjärjestelmän) rooli](#the-role-of-srs-sender-rewriting-scheme)
* [Sähköpostin edelleenlähetys toimii: Yksinkertainen selitys](#how-email-forwarding-works-the-simple-explanation)
* [Sähköpostin edelleenlähetyksen määrittäminen Lähetä sähköpostia -toiminnolla](#setting-up-email-forwarding-with-forward-email)
  * [1. Rekisteröidy tilille](#1-sign-up-for-an-account)
  * [2. Lisää verkkotunnuksesi](#2-add-your-domain)
  * [3. DNS-tietueiden määrittäminen](#3-configure-dns-records)
  * [4. Luo sähköpostin edelleenlähetyksiä](#4-create-email-forwards)
  * [5. Aloita uusien sähköpostiosoitteidesi käyttö](#5-start-using-your-new-email-addresses)
* [Sähköpostin edelleenlähetyksen lisäominaisuudet](#advanced-features-of-forward-email)
  * [Kertakäyttöiset osoitteet](#disposable-addresses)
  * [Useita vastaanottajia ja jokerimerkkejä](#multiple-recipients-and-wildcards)
  * ["Lähetä sähköpostia osoitteena" -integraatio](#send-mail-as-integration)
  * [Kvanttiresistentti turvallisuus](#quantum-resistant-security)
  * [Yksittäin salatut SQLite-postilaatikot](#individually-encrypted-sqlite-mailboxes)
* [Miksi valita sähköpostin edelleenlähetys kilpailijoiden sijaan](#why-choose-forward-email-over-competitors)
  * [1. 100 % avoimen lähdekoodin](#1-100-open-source)
  * [2. Yksityisyyteen keskittynyt](#2-privacy-focused)
  * [3. Ei riippuvuutta kolmansista osapuolista](#3-no-third-party-reliance)
  * [4. Kustannustehokas hinnoittelu](#4-cost-effective-pricing)
  * [5. Rajattomat resurssit](#5-unlimited-resources)
  * [6. Suurten organisaatioiden luottama](#6-trusted-by-major-organizations)
* [Yleisiä käyttötapauksia sähköpostin edelleenlähetykselle](#common-use-cases-for-email-forwarding)
  * [Yrityksille](#for-businesses)
  * [Kehittäjille](#for-developers)
  * [Yksityisyyttä arvostaville henkilöille](#for-privacy-conscious-individuals)
* [Sähköpostin edelleenlähetyksen parhaat käytännöt](#best-practices-for-email-forwarding)
  * [1. Käytä kuvailevia osoitteita](#1-use-descriptive-addresses)
  * [2. Toteuta asianmukainen todennus](#2-implement-proper-authentication)
  * [3. Tarkista säännöllisesti välityspyyntösi](#3-regularly-review-your-forwards)
  * [4. Määritä "Lähetä sähköpostia osoitteena" saumattomien vastausten saamiseksi](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Käytä yleisiä osoitteita varoen](#5-use-catch-all-addresses-cautiously)
* [Johtopäätös](#conclusion)

## Esipuhe {#foreword}

Sähköpostin edelleenlähetys on tehokas työkalu, joka voi mullistaa verkkoviestinnän hallinnan. Oletpa sitten yrityksen omistaja, joka haluaa luoda ammattimaisia sähköpostiosoitteita omalla verkkotunnuksellasi, yksityisyyttäsi arvostava henkilö, joka haluaa suojata ensisijaista sähköpostiaan, tai kehittäjä, joka tarvitsee joustavaa sähköpostinhallintaa, sähköpostin edelleenlähetyksen ymmärtäminen on olennaista nykypäivän digitaalisessa maisemassa.

Forward Emaililla olemme rakentaneet maailman turvallisimman, yksityisimmän ja joustavimman sähköpostin edelleenlähetyspalvelun. Tässä kattavassa oppaassa selitämme, miten sähköpostin edelleenlähetys toimii (sekä teknisestä että käytännön näkökulmasta), käymme läpi yksinkertaisen asennusprosessimme ja korostamme, miksi palvelumme erottuu kilpailijoista.

## Mikä on sähköpostin edelleenlähetys {#what-is-email-forwarding}

Sähköpostin edelleenlähetys on prosessi, joka uudelleenohjaa automaattisesti yhteen sähköpostiosoitteeseen lähetetyt sähköpostit toiseen kohdeosoitteeseen. Esimerkiksi kun joku lähettää sähköpostia osoitteeseen <contact@yourdomain.com>, viesti voidaan automaattisesti edelleenlähettää henkilökohtaiseen Gmail-, Outlook- tai mihin tahansa muuhun sähköpostitiliisi.

Tämä näennäisen yksinkertainen ominaisuus tarjoaa tehokkaita etuja:

* **Ammattimainen brändäys**: Käytä sähköpostiosoitteita mukautetulla verkkotunnuksellasi (<sinä@verkkotunnuksesi.com>) ja hallinnoi kaikkea olemassa olevasta henkilökohtaisesta postilaatikostasi.
* **Tietosuojaus**: Luo kertakäyttöisiä tai käyttötarkoitukseen sopivia osoitteita, jotka suojaavat ensisijaista sähköpostiasi.
* **Yksinkertaistettu hallinta**: Yhdistä useita sähköpostiosoitteita yhteen postilaatikkoon.
* **Joustavuus**: Luo rajattomasti osoitteita eri tarkoituksiin ilman useiden tilien hallintaa.

## Sähköpostin edelleenlähetyksen toimintaperiaate: tekninen selitys {#how-email-forwarding-works-the-technical-explanation}

Teknisistä yksityiskohdista kiinnostuneille tutkitaanpa, mitä kulissien takana tapahtuu, kun sähköposti lähetetään edelleen.

### Sähköpostin edelleenlähetysprosessi {#the-email-forwarding-process}

1. **DNS-konfigurointi**: Prosessi alkaa verkkotunnuksesi DNS-tietueista. Kun määrität sähköpostin edelleenlähetyksen, määrität MX (Mail Exchange) -tietueet, jotka kertovat internetille, minne verkkotunnuksesi sähköpostit tulisi toimittaa. Nämä tietueet osoittavat sähköpostipalvelimillemme.

2. **Sähköpostin vastaanotto**: Kun joku lähettää sähköpostia mukautettuun verkkotunnukseesi (esim. <sinä@omaverkkotunnus.com>), heidän sähköpostipalvelimensa hakee verkkotunnuksesi MX-tietueet ja toimittaa viestin palvelimillemme.

3. **Käsittely ja todennus**: Palvelimemme vastaanottavat sähköpostin ja suorittavat useita kriittisiä toimintoja:
* Lähettäjän aitouden tarkistaminen SPF:n, DKIM:n ja DMARC:n kaltaisilla protokollilla
* Haitallisen sisällön tarkistaminen
* Vastaanottajan tarkistaminen edelleenlähetyssääntöjen mukaisesti

4. **Lähettäjän uudelleenkirjoitus**: Tässä kohtaa taika tapahtuu. Käytämme lähettäjän uudelleenkirjoitusjärjestelmää (SRS) sähköpostin paluureitin muokkaamiseksi. Tämä on ratkaisevan tärkeää, koska monet sähköpostipalveluntarjoajat hylkäävät edelleenlähetetyt sähköpostit ilman asianmukaista SRS-toteutusta, koska ne voivat vaikuttaa väärennöksiltä.

5. **Edelleenlähetys**: Sähköposti lähetetään sitten kohdeosoitteeseesi alkuperäisen sisällön säilyttäen.

6. **Toimitus**: Sähköposti saapuu postilaatikkoosi ja näyttää siltä kuin se olisi lähetetty edelleenlähetysosoitteeseesi, säilyttäen mukautetun verkkotunnuksesi ammattimaisen ulkoasun.

### SRS:n (lähettäjän uudelleenkirjoitusjärjestelmän) rooli {#the-role-of-srs-sender-rewriting-scheme}

SRS ansaitsee erityistä huomiota, koska se on olennainen luotettavan sähköpostin edelleenlähetyksen kannalta. Kun sähköposti lähetetään edelleen, lähettäjän osoite on kirjoitettava uudelleen, jotta varmistetaan, että sähköposti läpäisee SPF-tarkistukset lopullisessa määränpäässä.

Ilman SRS:ää edelleenlähetetyt sähköpostit usein epäonnistuvat SPF-vahvistuksessa ja ne merkitään roskapostiksi tai hylätään kokonaan. SRS-toteutuksemme varmistaa, että edelleenlähetetyt sähköpostisi toimitetaan luotettavasti ja samalla alkuperäisen lähettäjän tiedot säilyvät sinulle läpinäkyvästi.

## Sähköpostin edelleenlähetyksen toimintaperiaate: Yksinkertainen selitys {#how-email-forwarding-works-the-simple-explanation}

Jos tekniset yksityiskohdat tuntuvat ylivoimaisilta, tässä on yksinkertaisempi tapa ymmärtää sähköpostin edelleenlähetystä:

Ajattele sähköpostin edelleenlähetystä kuin fyysisen postin edelleenlähetystä. Kun muutat uuteen kotiin, voit pyytää postipalvelua välittämään kaiken postin vanhasta osoitteestasi uuteen. Sähköpostin edelleenlähetys toimii samalla tavalla, mutta digitaalisten viestien osalta.

Sähköpostin edelleenlähetys:

1. Kerro meille, mitkä sähköpostiosoitteet verkkotunnuksellasi haluat määrittää (kuten <myynti@verkkotunnuksesi.com> tai <yhteystiedot@verkkotunnuksesi.com>).

2. Kerro meille, minne haluat sähköpostien toimitettavan (kuten Gmail- tai Outlook-tilillesi).

3. Hoidamme kaikki tekniset yksityiskohdat varmistaaksemme, että mukautettuihin osoitteisiin lähetetyt sähköpostit saapuvat turvallisesti määritettyyn postilaatikkoosi.

Niin yksinkertaista se on! Voit käyttää ammattimaisia sähköpostiosoitteita muuttamatta nykyistä sähköpostin työnkulkuasi.

## Sähköpostin edelleenlähetyksen määrittäminen sähköpostin edelleenlähetystoiminnolla {#setting-up-email-forwarding-with-forward-email}

Yksi sähköpostin edelleenlähetyksen suurimmista eduista on sen helppo käyttöönotto. Tässä vaiheittainen opas:

### 1. Luo tili {#1-sign-up-for-an-account}

Käy osoitteessa [forwardemail.net](https://forwardemail.net) ja luo ilmainen tili. Rekisteröitymisprosessimme kestää alle minuutin.

### 2. Lisää verkkotunnuksesi {#2-add-your-domain}

Kun olet kirjautunut sisään, lisää verkkotunnus, jota haluat käyttää sähköpostin edelleenlähetykseen. Jos sinulla ei vielä ole verkkotunnusta, sinun on ensin ostettava sellainen verkkotunnusten rekisteröijältä.

### 3. DNS-tietueiden määrittäminen {#3-configure-dns-records}

Toimitamme sinulle tarkat DNS-tietueet, jotka sinun on lisättävä verkkotunnukseesi. Tyypillisesti tämä sisältää seuraavat:

* Sähköpostipalvelimiimme osoittavien MX-tietueiden lisääminen
* TXT-tietueiden lisääminen vahvistusta ja turvallisuutta varten

Useimmilla verkkotunnusten rekisteröijillä on yksinkertainen käyttöliittymä näiden tietueiden lisäämiseen. Tarjoamme yksityiskohtaiset oppaat kaikille tärkeimmille verkkotunnusten rekisteröijille, jotta tämä prosessi olisi mahdollisimman sujuva.

### 4. Luo sähköpostin edelleenlähetyksiä {#4-create-email-forwards}

Kun DNS-tietueesi on vahvistettu (mikä yleensä kestää vain muutaman minuutin), voit luoda sähköpostin edelleenlähetyksiä. Määritä vain:

* Verkkotunnuksesi sähköpostiosoite (esim. <contact@yourdomain.com>)
* Kohde, johon haluat sähköpostien lähetettävän (esim. henkilökohtainen Gmail-osoitteesi)

### 5. Aloita uusien sähköpostiosoitteidesi käyttö {#5-start-using-your-new-email-addresses}

Siinä kaikki! Mukautettuihin verkkotunnusosoitteisiin lähetetyt sähköpostit välitetään nyt määrittämääsi kohteeseen. Voit luoda niin monta edelleenlähetystä kuin tarvitset, mukaan lukien keräilyosoitteita, jotka välittävät kaikki verkkotunnuksesi osoitteisiin lähetetyt sähköpostit.

## Sähköpostin edelleenlähetyksen lisäominaisuudet {#advanced-features-of-forward-email}

Vaikka perussähköpostin edelleenlähetys on itsessään tehokasta, Lähetä sähköpostia tarjoaa useita edistyneitä ominaisuuksia, jotka erottavat meidät muista:

### Kertakäyttöiset osoitteet {#disposable-addresses}

Luo erityisiä tai anonyymejä sähköpostiosoitteita, jotka lähettävät viestit päätilillesi. Voit liittää näihin osoitteisiin tunnisteita ja ottaa ne käyttöön tai poistaa ne käytöstä milloin tahansa pitääksesi postilaatikkosi järjestyksessä. Todellista sähköpostiosoitettasi ei koskaan paljasteta.

### Useita vastaanottajia ja jokerimerkkejä {#multiple-recipients-and-wildcards}

Lähetä yksi osoite edelleen useille vastaanottajille, mikä helpottaa tiedon jakamista tiimin kanssa. Voit myös käyttää jokerimerkkiosoitteita (kaikkien sähköpostien edelleenlähetys) vastaanottaaksesi sähköposteja, jotka lähetetään mihin tahansa verkkotunnuksesi osoitteeseen.

### "Lähetä sähköpostia osoitteena" -integraatio {#send-mail-as-integration}

Sinun ei koskaan tarvitse poistua postilaatikostasi lähettääksesi sähköposteja mukautetusta verkkotunnuksestasi. Lähetä ja vastaa viesteihin aivan kuin ne olisivat tulleet osoitteesta <sinä@omaverkkotunnus.com> suoraan Gmail- tai Outlook-tililtäsi.

### Kvanttiresistentti suojaus {#quantum-resistant-security}

Olemme maailman ensimmäinen ja ainoa sähköpostipalvelu, joka käyttää kvanttisuojattua salausta, joka suojaa viestintääsi jopa tulevaisuuden kehittyneimmiltä uhilta.

### Yksittäin salatut SQLite-postilaatikot {#individually-encrypted-sqlite-mailboxes}

Toisin kuin muut palveluntarjoajat, jotka tallentavat kaikki käyttäjien sähköpostit jaettuihin tietokantoihin, me käytämme yksilöllisesti salattuja SQLite-postilaatikoita vertaansa vailla olevan yksityisyyden ja turvallisuuden takaamiseksi.

## Miksi valita sähköpostin edelleenlähetys kilpailijoiden sijaan {#why-choose-forward-email-over-competitors}

Sähköpostin edelleenlähetysmarkkinoilla on useita toimijoita, mutta Forward Email erottuu joukosta useilla tärkeillä tavoilla:

### 1. 100 % avoimen lähdekoodin {#1-100-open-source}

Olemme ainoa sähköpostin edelleenlähetyspalvelu, joka on täysin avoimen lähdekoodin, myös taustakoodimme, mukainen. Tämä läpinäkyvyys rakentaa luottamusta ja mahdollistaa riippumattomat tietoturvatarkastukset. Muut palvelut saattavat väittää olevansa avoimen lähdekoodin tarjoajia, mutta eivät julkaise taustakoodiaan.

### 2. Tietosuojaan keskittyvä {#2-privacy-focused}

Loimme tämän palvelun, koska sinulla on oikeus yksityisyyteen. Käytämme vankkaa TLS-salausta, emme tallenna SMTP-lokeja (virheitä ja lähtevää SMTP-viestintää lukuun ottamatta) emmekä kirjoita sähköpostejasi levylle.

### 3. Ei kolmannen osapuolen riippuvuutta {#3-no-third-party-reliance}

Toisin kuin kilpailijamme, jotka luottavat Amazon SES:ään tai muihin kolmansien osapuolten palveluihin, meillä on täysi hallinta infrastruktuuriimme, mikä parantaa sekä luotettavuutta että yksityisyyttä.

### 4. Kustannustehokas hinnoittelu {#4-cost-effective-pricing}

Hinnoittelumallimme ansiosta voit skaalata tallennustilaa kustannustehokkaasti. Emme veloita käyttäjäkohtaisesti, ja voit maksaa tallennustilasta käytön mukaan. 3 dollarin kuukausihinnalla tarjoamme enemmän ominaisuuksia halvemmalla hinnalla kuin kilpailijamme, kuten Gandi (3,99 dollaria/kk).

### 5. Rajattomat resurssit {#5-unlimited-resources}

Emme aseta keinotekoisia rajoituksia verkkotunnuksille, aliaksille tai sähköpostiosoitteille, kuten monet kilpailijat tekevät.

### 6. Suurien organisaatioiden luottama {#6-trusted-by-major-organizations}

Palveluamme käyttää yli 500 000 verkkotunnusta, mukaan lukien merkittäviä organisaatioita, kuten [Yhdysvaltain laivastoakatemia](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [Linux-säätiö](/blog/docs/linux-foundation-email-enterprise-case-study), [Kanoninen/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales ja monet muut.

## Yleisiä käyttötapauksia sähköpostin edelleenlähetykselle {#common-use-cases-for-email-forwarding}

Sähköpostin edelleenlähetys ratkaisee lukuisia haasteita erityyppisille käyttäjille:

### Yrityksille {#for-businesses}

* Luo ammattimaiset sähköpostiosoitteet eri osastoille (myynti@, tuki@, info@)
* Hallitse helposti tiimin sähköpostiviestintää
* Säilytä brändin yhtenäisyys kaikessa viestinnässä
* Yksinkertaista sähköpostinhallintaa henkilöstövaihdosten aikana

### Kehittäjille {#for-developers}

* Luo automatisoituja ilmoitusjärjestelmiä
* Luo käyttötarkoitukseen sopivia osoitteita eri projekteille
* Integroi webhookien kanssa edistynyttä automaatiota varten
* Hyödynnä API-rajapintaamme mukautettuihin toteutuksiin

### Tietosuojaa arvostaville henkilöille {#for-privacy-conscious-individuals}

* Luo erilliset sähköpostiosoitteet eri palveluille seurataksesi, kuka jakaa tietojasi
* Käytä kertakäyttöisiä osoitteita kertakäyttöisiin rekisteröitymisiin
* Säilytä yksityisyys suojaamalla ensisijainen sähköpostiosoitteesi
* Poista helposti käytöstä osoitteet, jotka alkavat vastaanottaa roskapostia

## Sähköpostin edelleenlähetyksen parhaat käytännöt {#best-practices-for-email-forwarding}

Saadaksesi kaiken irti sähköpostin edelleenlähetyksestä, harkitse näitä parhaita käytäntöjä:

### 1. Käytä kuvaavia osoitteita {#1-use-descriptive-addresses}

Luo sähköpostiosoitteita, jotka osoittavat selvästi niiden tarkoituksen (esim. <uutiskirje@omaverkkotunnus.com>, <ostokset@omaverkkotunnus.com>) saapuvan postin järjestämiseksi.

### 2. Ota käyttöön asianmukainen todennus {#2-implement-proper-authentication}

Varmista, että verkkotunnuksellasi on asianmukaiset SPF-, DKIM- ja DMARC-tietueet maksimoidaksesi toimituksen. Sähköpostin edelleenlähetys tekee tästä helppoa ohjatun asennuksemme avulla.

### 3. Tarkista säännöllisesti edelleenlähetyksesi {#3-regularly-review-your-forwards}

Tarkista sähköpostien edelleenlähetyksesi säännöllisesti ja poista käytöstä sellaiset viestit, joita ei enää tarvita tai jotka saavat liikaa roskapostia.

### 4. Määritä "Lähetä sähköpostia osoitteena" saumattomia vastauksia varten {#4-set-up-send-mail-as-for-seamless-replies}

Määritä pääasiallinen sähköpostiohjelmasi lähettämään sähköpostia mukautettuina verkkotunnusosoitteinasi, jotta saat yhdenmukaisen kokemuksen vastatessasi edelleenlähetettyihin sähköposteihin.

### 5. Käytä keräilyosoitteita varoen {#5-use-catch-all-addresses-cautiously}

Vaikka keräilyosoitteet ovat käteviä, ne voivat mahdollisesti vastaanottaa enemmän roskapostia. Harkitse erityisten edelleenlähetysten luomista tärkeille viesteille.

## Johtopäätös {#conclusion}

Sähköpostin edelleenlähetys on tehokas työkalu, joka tuo ammattimaisuutta, yksityisyyttä ja yksinkertaisuutta sähköpostiviestintään. Sähköpostin edelleenlähetyksen avulla saat käyttöösi turvallisimman, yksityisimmän ja joustavimman saatavilla olevan sähköpostin edelleenlähetyspalvelun.

Ainoana täysin avoimen lähdekoodin tarjoajana, joka käyttää kvanttisuojattua salausta ja keskittyy yksityisyyteen, olemme rakentaneet palvelun, joka kunnioittaa oikeuksiasi ja tarjoaa samalla poikkeuksellisen toiminnallisuuden.

Etsitpä sitten ammattimaisia sähköpostiosoitteita yrityksellesi, haluatko suojata yksityisyyttäsi kertakäyttöisillä osoitteilla tai yksinkertaistaa useiden sähköpostitilien hallintaa, Forward Email tarjoaa täydellisen ratkaisun.

Oletko valmis mullistamaan sähköpostikokemuksesi? [Rekisteröidy ilmaiseksi](https://forwardemail.net) tänään ja liity yli 500 000 verkkotunnuksen joukkoon, jotka jo hyötyvät palvelustamme.

---

*Tämän blogikirjoituksen kirjoitti Forward Email -tiimi, maailman turvallisimman, yksityisimmän ja joustavimman sähköpostin edelleenlähetyspalvelun luoja. Käy osoitteessa [forwardemail.net](https://forwardemail.net) saadaksesi lisätietoja palvelustamme ja aloittaaksesi sähköpostien edelleenlähettämisen luottavaisin mielin.*