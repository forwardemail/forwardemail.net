# Sähköpostin edelleenlähetys toimii sähköpostin edelleenlähetyksen kanssa: Perimmäinen opas {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="laiska" src="/img/articles/email-privacy.webp" alt="" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Mikä on sähköpostin edelleenlähetys](#what-is-email-forwarding)
* [Miten sähköpostin edelleenlähetys toimii: tekninen selitys](#how-email-forwarding-works-the-technical-explanation)
  * [Sähköpostin edelleenlähetysprosessi](#the-email-forwarding-process)
  * [SRS:n rooli (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Miten sähköpostin edelleenlähetys toimii: yksinkertainen selitys](#how-email-forwarding-works-the-simple-explanation)
* [Sähköpostin edelleenlähetyksen määrittäminen sähköpostin edelleenlähetyksen kanssa](#setting-up-email-forwarding-with-forward-email)
  * [1. Luo tili](#1-sign-up-for-an-account)
  * [2. Lisää verkkotunnuksesi](#2-add-your-domain)
  * [3. Määritä DNS-tietueet](#3-configure-dns-records)
  * [4. Luo sähköpostien edelleenlähetykset](#4-create-email-forwards)
  * [5. Aloita uusien sähköpostiosoitteiden käyttö](#5-start-using-your-new-email-addresses)
* [Sähköpostin edelleenlähetyksen lisäominaisuudet](#advanced-features-of-forward-email)
  * [Kertakäyttöiset osoitteet](#disposable-addresses)
  * [Useita vastaanottajia ja jokerimerkkejä](#multiple-recipients-and-wildcards)
  * ["Lähetä sähköpostina" -integrointi](#send-mail-as-integration)
  * [Kvanttikestävä suojaus](#quantum-resistant-security)
  * [Yksilöllisesti salatut SQLite-postilaatikot](#individually-encrypted-sqlite-mailboxes)
* [Miksi valita sähköpostin edelleenlähetys kilpailijoiden sijaan](#why-choose-forward-email-over-competitors)
  * [1. 100 % avoimen lähdekoodin](#1-100-open-source)
  * [2. Yksityisyyteen keskittyvä](#2-privacy-focused)
  * [3. Ei kolmannen osapuolen riippuvuutta](#3-no-third-party-reliance)
  * [4. Kustannustehokas hinnoittelu](#4-cost-effective-pricing)
  * [5. Rajoittamattomat resurssit](#5-unlimited-resources)
  * [6. Suuret organisaatiot luottavat](#6-trusted-by-major-organizations)
* [Yleisiä sähköpostin edelleenlähetyksen tapauksia](#common-use-cases-for-email-forwarding)
  * [Yrityksille](#for-businesses)
  * [Kehittäjille](#for-developers)
  * [Yksityisyystietoisille henkilöille](#for-privacy-conscious-individuals)
* [Sähköpostin edelleenlähetyksen parhaat käytännöt](#best-practices-for-email-forwarding)
  * [1. Käytä kuvaavia osoitteita](#1-use-descriptive-addresses)
  * [2. Ota käyttöön oikea todennus](#2-implement-proper-authentication)
  * [3. Tarkista lähetyksiäsi säännöllisesti](#3-regularly-review-your-forwards)
  * [4. Määritä "Lähetä sähköposti nimellä" saumattomia vastauksia varten](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Käytä Catch-All-osoitteita varoen](#5-use-catch-all-addresses-cautiously)
* [Johtopäätös](#conclusion)

## Esipuhe {#foreword}

Sähköpostin edelleenlähetys on tehokas työkalu, joka voi muuttaa tapaa, jolla hallitset verkkoviestintääsi. Olitpa yrityksen omistaja, joka haluaa luoda ammattimaisia sähköpostiosoitteita mukautetulla verkkotunnuksellasi, yksityisyyttä kunnioittava henkilö, joka haluaa suojata ensisijaisen sähköpostisi, tai kehittäjä, joka tarvitsee joustavaa sähköpostin hallintaa, sähköpostin edelleenlähetyksen ymmärtäminen on välttämätöntä nykypäivän digitaalisessa ympäristössä.

Forward Emailissa olemme rakentaneet maailman turvallisimman, yksityisimmän ja joustavimman sähköpostin edelleenlähetyspalvelun. Tässä kattavassa oppaassa selitämme, miten sähköpostin edelleenlähetys toimii (sekä teknisestä että käytännön näkökulmasta), opastamme sinut yksinkertaisen asennusprosessin läpi ja korostamme, miksi palvelumme erottuu kilpailijoista.

## Mikä on sähköpostin edelleenlähetys {#what-is-email-forwarding}

Sähköpostin edelleenlähetys on prosessi, joka uudelleenohjaa automaattisesti yhteen sähköpostiosoitteeseen lähetetyt sähköpostit toiseen kohdeosoitteeseen. Esimerkiksi kun joku lähettää sähköpostia osoitteeseen <contact@yourdomain.com>, viesti voidaan automaattisesti edelleenlähettää henkilökohtaiseen Gmail-, Outlook- tai mihin tahansa muuhun sähköpostitiliisi.

Tämä näennäisesti yksinkertainen ominaisuus tarjoaa tehokkaita etuja:

* **Ammattimainen brändäys**: Käytä sähköpostiosoitteita mukautetulla verkkotunnuksellasi (<sinä@omaverkkotunnus.com>) ja hallinnoi kaikkea olemassa olevasta henkilökohtaisesta postilaatikostasi.
* **Tietosuoja**: Luo kertakäyttöisiä tai käyttötarkoitukseen sopivia osoitteita, jotka suojaavat ensisijaista sähköpostiasi.
* **Yksinkertaistettu hallinta**: Yhdistä useita sähköpostiosoitteita yhteen postilaatikkoon.
* **Joustavuus**: Luo rajattomasti osoitteita eri tarkoituksiin ilman useiden tilien hallintaa.

## Sähköpostin edelleenlähetyksen toimintaperiaate: tekninen selitys {#how-email-forwarding-works-the-technical-explanation}

Niille, jotka ovat kiinnostuneita teknisistä yksityiskohdista, tutkitaan, mitä tapahtuu kulissien takana, kun sähköposti lähetetään edelleen.

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

### SRS:n (Sender Rewriting Scheme) rooli {#the-role-of-srs-sender-rewriting-scheme}

SRS ansaitsee erityistä huomiota, koska se on välttämätön sähköpostin luotettavalle edelleenlähetykselle. Kun sähköposti lähetetään edelleen, lähettäjän osoite on kirjoitettava uudelleen, jotta sähköposti läpäisee SPF-tarkastukset lopullisessa kohteessa.

Ilman SRS:ää edelleen lähetetyt sähköpostit epäonnistuvat usein SPF-vahvistuksessa ja ne merkitään roskapostiksi tai hylätään kokonaan. SRS-toteuksemme varmistaa, että edelleenlähetetyt sähköpostisi toimitetaan luotettavasti samalla, kun alkuperäiset lähettäjätiedot säilyvät sinulle läpinäkyvällä tavalla.

## Sähköpostin edelleenlähetyksen toimintaperiaate: Yksinkertainen selitys {#how-email-forwarding-works-the-simple-explanation}

Jos tekniset yksityiskohdat vaikuttavat ylivoimaisilta, tässä on yksinkertaisempi tapa ymmärtää sähköpostin edelleenlähetystä:

Ajattele sähköpostin edelleenlähetystä, kuten fyysisen postin edelleenlähetystä. Kun muutat uuteen kotiin, voit pyytää postia välittämään kaikki postit vanhasta osoitteestasi uuteen. Sähköpostin edelleenlähetys toimii samalla tavalla, mutta digitaalisissa viesteissä.

Lähetä sähköpostilla:

1. Kerro meille, mitkä sähköpostiosoitteet verkkotunnuksellasi haluat määrittää (kuten <myynti@verkkotunnuksesi.com> tai <yhteystiedot@verkkotunnuksesi.com>).

2. Kerro meille, minne haluat sähköpostien toimitettavan (kuten Gmail- tai Outlook-tilillesi).

3. Hoidamme kaikki tekniset yksityiskohdat varmistaaksemme, että mukautettuihin osoitteisiin lähetetyt sähköpostit saapuvat turvallisesti määritettyyn postilaatikkoosi.

Se on niin yksinkertaista! Pääset käyttämään ammattimaisia sähköpostiosoitteita muuttamatta olemassa olevaa sähköpostin työnkulkua.

## Sähköpostin edelleenlähetyksen määrittäminen sähköpostin edelleenlähetystoiminnolla {#setting-up-email-forwarding-with-forward-email}

Yksi Forward Emailin suurimmista eduista on sen käyttöönotto. Tässä on vaiheittainen opas:

### 1. Luo tili {#1-sign-up-for-an-account}

Käy osoitteessa [forwardemail.net](https://forwardemail.net) ja luo ilmainen tili. Rekisteröitymisprosessimme kestää alle minuutin.

### 2. Lisää verkkotunnuksesi {#2-add-your-domain}

Kun olet kirjautunut sisään, lisää verkkotunnus, jota haluat käyttää sähköpostin edelleenlähetykseen. Jos et vielä omista verkkotunnusta, sinun on ensin ostettava se verkkotunnusten rekisteröijältä.

### 3. Määritä DNS-tietueet {#3-configure-dns-records}

Toimitamme sinulle tarkat DNS-tietueet, jotka sinun on lisättävä verkkotunnukseesi. Tyypillisesti tähän sisältyy:

* Sähköpostipalvelimiimme osoittavien MX-tietueiden lisääminen
* TXT-tietueiden lisääminen vahvistusta ja turvallisuutta varten

Useimmilla verkkotunnusten rekisteröintipalveluilla on yksinkertainen käyttöliittymä näiden tietueiden lisäämiseen. Tarjoamme yksityiskohtaisia oppaita kaikille tärkeimmille verkkotunnusten rekisteröijille, jotta tämä prosessi sujuisi mahdollisimman sujuvasti.

### 4. Luo sähköpostin edelleenlähetyksiä {#4-create-email-forwards}

Kun DNS-tietueesi on vahvistettu (mikä kestää yleensä vain muutaman minuutin), voit luoda sähköpostin edelleenlähetyksiä. Määritä vain:

* Verkkotunnuksesi sähköpostiosoite (esim. <contact@yourdomain.com>)
* Kohde, johon haluat sähköpostien lähetettävän (esim. henkilökohtainen Gmail-osoitteesi)

### 5. Aloita uusien sähköpostiosoitteidesi käyttö {#5-start-using-your-new-email-addresses}

Siinä se! Mukautettuihin verkkotunnusosoitteisiin lähetetyt sähköpostit välitetään nyt määritettyyn kohteeseen. Voit luoda niin monta edelleenlähetystä kuin tarvitset, mukaan lukien keräilyosoitteet, jotka välittävät kaikki verkkotunnuksesi mihin tahansa osoitteeseen lähetetyt sähköpostit.

## Sähköpostin edelleenlähetyksen lisäominaisuudet {#advanced-features-of-forward-email}

Vaikka perussähköpostin edelleenlähetys on sinänsä tehokasta, Forward Email tarjoaa useita edistyneitä ominaisuuksia, jotka erottavat meidät muista:

### Kertakäyttöiset osoitteet {#disposable-addresses}

Luo erityisiä tai nimettömiä sähköpostiosoitteita, jotka ohjaavat päätilillesi. Voit määrittää näille osoitteille tunnisteita ja ottaa ne käyttöön tai poistaa ne käytöstä milloin tahansa pitääksesi postilaatikkosi järjestyksessä. Todellinen sähköpostiosoitteesi ei koskaan paljasteta.

### Useita vastaanottajia ja jokerimerkkejä {#multiple-recipients-and-wildcards}

Välitä yksi osoite useille vastaanottajille, mikä helpottaa tietojen jakamista tiimin kanssa. Voit myös käyttää yleismerkkiosoitteita (catch all-edelleenlähetys) vastaanottaaksesi sähköpostit, jotka on lähetetty mihin tahansa verkkotunnuksesi osoitteeseen.

### "Lähetä sähköpostia osoitteena" -integraatio {#send-mail-as-integration}

Sinun ei koskaan tarvitse poistua postilaatikostasi lähettääksesi sähköposteja mukautetusta verkkotunnuksestasi. Lähetä ja vastaa viesteihin aivan kuin ne olisivat tulleet osoitteesta <sinä@omaverkkotunnus.com> suoraan Gmail- tai Outlook-tililtäsi.

### Kvanttisuojattu suojaus {#quantum-resistant-security}

Olemme maailman ensimmäinen ja ainoa sähköpostipalvelu, joka käyttää kvanttikestävää salausta ja suojaa viestintäsi edistyneimmiltä tulevaisuuden uhilta.

### Yksittäin salatut SQLite-postilaatikot {#individually-encrypted-sqlite-mailboxes}

Toisin kuin muut palveluntarjoajat, jotka tallentavat kaikki käyttäjien sähköpostit jaettuihin tietokantoihin, käytämme yksilöllisesti salattuja SQLite-postilaatikoita vertaansa vailla olevan yksityisyyden ja turvallisuuden takaamiseksi.

## Miksi valita sähköpostin edelleenlähetys kilpailijoiden sijaan {#why-choose-forward-email-over-competitors}

Sähköpostin edelleenlähetysmarkkinoilla on useita toimijoita, mutta Forward Email erottuu useilla tärkeillä tavoilla:

### 1. 100 % avoimen lähdekoodin {#1-100-open-source}

Olemme ainoa sähköpostin edelleenlähetyspalvelu, joka on täysin avoimen lähdekoodin, mukaan lukien taustakoodimme. Tämä läpinäkyvyys lisää luottamusta ja mahdollistaa riippumattomien tietoturvatarkastusten tekemisen. Muut palvelut voivat väittää olevansa avoimen lähdekoodin, mutta eivät julkaise taustakoodiaan.

### 2. Tietosuojaan keskittyvä {#2-privacy-focused}

Loimme tämän palvelun, koska sinulla on oikeus yksityisyyteen. Käytämme vahvaa salausta TLS:n kanssa, emme tallenna SMTP-lokeja (paitsi virheitä ja lähtevää SMTP:tä) emmekä kirjoita sähköpostejasi levymuistiin.

### 3. Ei kolmansien osapuolten riippuvuutta {#3-no-third-party-reliance}

Toisin kuin kilpailijat, jotka luottavat Amazon SES:ään tai muihin kolmannen osapuolen palveluihin, me hallitsemme infrastruktuuriamme täydellisesti, mikä parantaa sekä luotettavuutta että yksityisyyttä.

### 4. Kustannustehokas hinnoittelu {#4-cost-effective-pricing}

Hinnoittelumallimme avulla voit skaalata kustannustehokkaasti. Emme veloita käyttäjää kohden, ja voit maksaa tallennuksen mukaan. Hintaan 3 $/kk, tarjoamme enemmän ominaisuuksia halvemmalla kuin kilpailijat, kuten Gandi (3,99 $/kk).

### 5. Rajattomat resurssit {#5-unlimited-resources}

Emme aseta keinotekoisia rajoituksia verkkotunnuksille, aliaksille tai sähköpostiosoitteille, kuten monet kilpailijat tekevät.

### 6. Suurien organisaatioiden luottama {#6-trusted-by-major-organizations}

Palveluamme käyttää yli 500 000 verkkotunnusta, mukaan lukien merkittäviä organisaatioita, kuten [Yhdysvaltain laivastoakatemia](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [Linux-säätiö](/blog/docs/linux-foundation-email-enterprise-case-study), [Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales ja monet muut.

## Sähköpostin edelleenlähetyksen yleisiä käyttötapauksia {#common-use-cases-for-email-forwarding}

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

### Tietosuojatietoisille henkilöille {#for-privacy-conscious-individuals}

* Luo erilliset sähköpostiosoitteet eri palveluille seurataksesi, kuka jakaa tietojasi
* Käytä kertakäyttöisiä osoitteita kertakäyttöisiin rekisteröitymisiin
* Säilytä yksityisyys suojaamalla ensisijainen sähköpostiosoitteesi
* Poista helposti käytöstä osoitteet, jotka alkavat vastaanottaa roskapostia

## Sähköpostin edelleenlähetyksen parhaat käytännöt {#best-practices-for-email-forwarding}

Jotta saat kaiken irti sähköpostin edelleenlähetyksestä, harkitse näitä parhaita käytäntöjä:

### 1. Käytä kuvaavia osoitteita {#1-use-descriptive-addresses}

Luo sähköpostiosoitteita, jotka osoittavat selvästi niiden tarkoituksen (esim. <uutiskirje@omaverkkotunnus.com>, <ostokset@omaverkkotunnus.com>) saapuvan postin järjestämiseksi.

### 2. Ota käyttöön asianmukainen todennus {#2-implement-proper-authentication}

Varmista, että verkkotunnuksessasi on oikeat SPF-, DKIM- ja DMARC-tietueet toimitettavuuden maksimoimiseksi. Sähköpostin edelleenlähetys tekee tästä helppoa ohjatun asennuksen avulla.

### 3. Tarkista säännöllisesti edelleenlähetyksesi {#3-regularly-review-your-forwards}

Tarkista säännöllisesti sähköpostisi edelleenlähetykset, jotta voit poistaa käytöstä kaikki, joita ei enää tarvita tai jotka saavat liikaa roskapostia.

### 4. Määritä "Lähetä sähköpostia osoitteena" saumattomien vastausten saamiseksi {#4-set-up-send-mail-as-for-seamless-replies}

Määritä pääsähköpostiohjelmasi lähettämään sähköpostia mukautetuiksi verkkotunnuksesi osoitteiksi, jotta voit vastata edelleen lähetettyihin sähköposteihin yhtenäisen kokemuksen.

### 5. Käytä keräilyosoitteita varoen {#5-use-catch-all-addresses-cautiously}

Vaikka keräilyosoitteet ovat käteviä, ne voivat vastaanottaa enemmän roskapostia. Harkitse erityisten edelleenlähetysten luomista tärkeitä viestintää varten.

## Yhteenveto {#conclusion}

Sähköpostin edelleenlähetys on tehokas työkalu, joka tuo ammattimaisuutta, yksityisyyttä ja yksinkertaisuutta sähköpostiviestintään. Välitä sähköposti tarjoaa turvallisimman, yksityisimmän ja joustavamman sähköpostin edelleenlähetyspalvelun.

Ainoana 100-prosenttisesti avoimen lähdekoodin palveluntarjoajana, jolla on kvanttikestävä salaus ja joka keskittyy yksityisyyteen, olemme rakentaneet palvelun, joka kunnioittaa oikeuksiasi ja tarjoaa samalla poikkeuksellista toimivuutta.

Halusitpa sitten luoda ammattimaisia sähköpostiosoitteita yrityksellesi, suojata yksityisyyttäsi kertakäyttöisillä osoitteilla tai yksinkertaistaa useiden sähköpostitilien hallintaa, Lähetä sähköposti tarjoaa täydellisen ratkaisun.

Oletko valmis mullistamaan sähköpostikokemuksesi? [Rekisteröidy ilmaiseksi](https://forwardemail.net) tänään ja liity yli 500 000 verkkotunnuksen joukkoon, jotka jo hyötyvät palvelustamme.

---

*Tämän blogikirjoituksen kirjoitti Forward Email -tiimi, maailman turvallisimman, yksityisimmän ja joustavimman sähköpostin edelleenlähetyspalvelun luoja. Käy osoitteessa [forwardemail.net](https://forwardemail.net) saadaksesi lisätietoja palvelustamme ja aloittaaksesi sähköpostien edelleenlähettämisen luottavaisin mielin.*