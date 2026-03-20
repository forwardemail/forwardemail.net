# Kuinka Sähköpostin Uudelleenlähetys Toimii Forward Emailin Kanssa: Täydellinen Opas {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Sähköpostin yksityisyyden suojaamisen tekninen toteutus" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Mitä on Sähköpostin Uudelleenlähetys](#what-is-email-forwarding)
* [Kuinka Sähköpostin Uudelleenlähetys Toimii: Tekninen Selitys](#how-email-forwarding-works-the-technical-explanation)
  * [Sähköpostin Uudelleenlähetysprosessi](#the-email-forwarding-process)
  * [SRS:n (Sender Rewriting Scheme) Rooli](#the-role-of-srs-sender-rewriting-scheme)
* [Kuinka Sähköpostin Uudelleenlähetys Toimii: Yksinkertainen Selitys](#how-email-forwarding-works-the-simple-explanation)
* [Sähköpostin Uudelleenlähetyksen Asettaminen Forward Emaililla](#setting-up-email-forwarding-with-forward-email)
  * [1. Luo Tili](#1-sign-up-for-an-account)
  * [2. Lisää Verkkotunnuksesi](#2-add-your-domain)
  * [3. Määritä DNS-tietueet](#3-configure-dns-records)
  * [4. Luo Sähköpostin Uudelleenlähetykset](#4-create-email-forwards)
  * [5. Ala Käyttää Uusia Sähköpostiosoitteitasi](#5-start-using-your-new-email-addresses)
* [Forward Emailin Edistyneet Ominaisuudet](#advanced-features-of-forward-email)
  * [Kertakäyttöiset Osoitteet](#disposable-addresses)
  * [Useat Vastaanottajat ja Jokerimerkit](#multiple-recipients-and-wildcards)
  * ["Lähetä Sähköpostina" Integraatio](#send-mail-as-integration)
  * [Kvanttikestävä Turvallisuus](#quantum-resistant-security)
  * [Yksilöllisesti Salatut SQLite-sähköpostilaatikot](#individually-encrypted-sqlite-mailboxes)
* [Miksi Valita Forward Email Kilpailijoiden Sijaan](#why-choose-forward-email-over-competitors)
  * [1. 100 % Avoimen Lähdekoodin](#1-100-open-source)
  * [2. Yksityisyyttä Korostava](#2-privacy-focused)
  * [3. Ei Riippuvuutta Kolmansista Osapuolista](#3-no-third-party-reliance)
  * [4. Edullinen Hinnoittelu](#4-cost-effective-pricing)
  * [5. Rajoittamattomat Resurssit](#5-unlimited-resources)
  * [6. Suurten Organisaatioiden Luottama](#6-trusted-by-major-organizations)
* [Yleiset Käyttötarkoitukset Sähköpostin Uudelleenlähetykselle](#common-use-cases-for-email-forwarding)
  * [Yrityksille](#for-businesses)
  * [Kehittäjille](#for-developers)
  * [Yksityisyyttä Arvostaville Henkilöille](#for-privacy-conscious-individuals)
* [Parhaat Käytännöt Sähköpostin Uudelleenlähetyksessä](#best-practices-for-email-forwarding)
  * [1. Käytä Kuvaavia Osoitteita](#1-use-descriptive-addresses)
  * [2. Toteuta Oikea Todennus](#2-implement-proper-authentication)
  * [3. Tarkista Uudelleenlähetykset Säännöllisesti](#3-regularly-review-your-forwards)
  * [4. Aseta "Lähetä Sähköpostina" Saumattomia Vastauksia Varten](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Käytä Catch-All-osoitteita Varovaisesti](#5-use-catch-all-addresses-cautiously)
* [Yhteenveto](#conclusion)


## Esipuhe {#foreword}

Sähköpostin uudelleenlähetys on tehokas työkalu, joka voi muuttaa tapasi hallita verkkoviestintääsi. Olitpa sitten yrityksen omistaja, joka haluaa luoda ammattimaisia sähköpostiosoitteita omalla verkkotunnuksellasi, yksityisyyttä arvostava henkilö, joka haluaa suojata pääsähköpostinsa, tai kehittäjä, joka tarvitsee joustavaa sähköpostinhallintaa, sähköpostin uudelleenlähetyksen ymmärtäminen on olennaista nykypäivän digitaalisessa maailmassa.

Forward Emaililla olemme rakentaneet maailman turvallisimman, yksityisimmän ja joustavimman sähköpostin uudelleenlähetyspalvelun. Tässä kattavassa oppaassa selitämme, kuinka sähköpostin uudelleenlähetys toimii (sekä teknisestä että käytännön näkökulmasta), opastamme sinut yksinkertaisen asennusprosessimme läpi ja korostamme, miksi palvelumme erottuu kilpailijoista.


## Mitä on Sähköpostin Uudelleenlähetys {#what-is-email-forwarding}

Sähköpostin uudelleenlähetys on prosessi, joka automaattisesti ohjaa yhdelle sähköpostiosoitteelle lähetetyt viestit toiseen kohdeosoitteeseen. Esimerkiksi, kun joku lähettää sähköpostin osoitteeseen <contact@yourdomain.com>, viesti voidaan automaattisesti uudelleenohjata henkilökohtaiseen Gmail-, Outlook- tai muuhun sähköpostitiliisi.

Tämä näennäisen yksinkertainen ominaisuus tarjoaa voimakkaita etuja:

* **Ammattimainen Brändäys**: Käytä sähköpostiosoitteita omalla verkkotunnuksellasi (<you@yourdomain.com>) hallinnoiden kaikkea nykyisestä henkilökohtaisesta postilaatikostasi
* **Yksityisyyden Suoja**: Luo kertakäyttöisiä tai tarkoitukseen sidottuja osoitteita, jotka suojaavat pääsähköpostiasi
* **Yksinkertaistettu Hallinta**: Yhdistä useita sähköpostiosoitteita yhteen postilaatikkoon
* **Joustavuus**: Luo rajattomasti osoitteita eri tarkoituksiin ilman, että sinun tarvitsee hallita useita tilejä
## Kuinka Sähköpostin Uudelleenlähetys Toimii: Tekninen Selitys {#how-email-forwarding-works-the-technical-explanation}

Niille, joita kiinnostavat tekniset yksityiskohdat, tutkitaan mitä tapahtuu kulissien takana, kun sähköposti uudelleenlähetetään.

### Sähköpostin Uudelleenlähetysprosessi {#the-email-forwarding-process}

1. **DNS-konfiguraatio**: Prosessi alkaa verkkotunnuksesi DNS-tietueista. Kun asetat sähköpostin uudelleenlähetyksen, määrität MX (Mail Exchange) -tietueet, jotka kertovat internetille, minne sähköpostit verkkotunnuksellesi tulee toimittaa. Nämä tietueet osoittavat sähköpostipalvelimillemme.

2. **Sähköpostin vastaanotto**: Kun joku lähettää sähköpostin mukautettuun verkkotunnuksesi osoitteeseen (esim. <you@yourdomain.com>), heidän sähköpostipalvelimensa hakee verkkotunnuksesi MX-tietueet ja toimittaa viestin palvelimillemme.

3. **Käsittely ja todennus**: Palvelimemme vastaanottavat sähköpostin ja suorittavat useita kriittisiä toimintoja:
   * Varmistavat lähettäjän aitouden protokollien kuten SPF, DKIM ja DMARC avulla
   * Skannaavat haitallisen sisällön varalta
   * Tarkistavat vastaanottajan uudelleenlähetyssääntöjesi mukaan

4. **Lähettäjän uudelleenkirjoitus**: Tässä tapahtuu taika. Toteutamme Sender Rewriting Scheme (SRS) -menetelmän muuttaaksemme sähköpostin paluupolkua. Tämä on ratkaisevan tärkeää, koska monet sähköpostipalveluntarjoajat hylkäävät uudelleenlähetetyt sähköpostit ilman asianmukaista SRS-toteutusta, sillä ne voivat näyttää väärennetyiltä.

5. **Uudelleenlähetys**: Sähköposti lähetetään sitten määränpääosoitteeseesi alkuperäinen sisältö säilyttäen.

6. **Toimitus**: Sähköposti saapuu postilaatikkoosi näyttäen siltä kuin se olisi lähetetty uudelleenlähetysosoitteeseesi, säilyttäen ammattimaisen ilmeen mukautetulle verkkotunnuksellesi.

### SRS:n (Sender Rewriting Scheme) Rooli {#the-role-of-srs-sender-rewriting-scheme}

SRS ansaitsee erityishuomion, koska se on välttämätön luotettavalle sähköpostin uudelleenlähetykselle. Kun sähköposti uudelleenlähetetään, lähettäjän osoite täytyy kirjoittaa uudelleen, jotta sähköposti läpäisee SPF-tarkistukset lopullisessa määränpäässä.

Ilman SRS:ää uudelleenlähetetyt sähköpostit epäonnistuvat usein SPF-varmennuksessa ja merkitään roskapostiksi tai ne hylätään kokonaan. Meidän SRS-toteutuksemme varmistaa, että uudelleenlähetetyt sähköpostisi toimitetaan luotettavasti samalla kun alkuperäinen lähettäjätieto säilyy tavalla, joka on sinulle läpinäkyvä.


## Kuinka Sähköpostin Uudelleenlähetys Toimii: Yksinkertainen Selitys {#how-email-forwarding-works-the-simple-explanation}

Jos tekniset yksityiskohdat tuntuvat ylivoimaisilta, tässä on yksinkertaisempi tapa ymmärtää sähköpostin uudelleenlähetys:

Ajattele sähköpostin uudelleenlähetystä kuin postin uudelleenlähetystä fyysiselle postille. Kun muutat uuteen kotiin, voit pyytää postipalvelua uudelleenlähettämään kaiken postin vanhasta osoitteestasi uuteen. Sähköpostin uudelleenlähetys toimii samalla tavalla, mutta digitaalisille viesteille.

Forward Emailin kanssa:

1. Kerrot meille, mitkä sähköpostiosoitteet verkkotunnuksellasi haluat määrittää (kuten <sales@yourdomain.com> tai <contact@yourdomain.com>)
2. Kerrot meille, mihin haluat näiden sähköpostien toimitettavan (kuten Gmail- tai Outlook-tilillesi)
3. Me hoidamme kaikki tekniset yksityiskohdat varmistaaksemme, että mukautettuihin osoitteisiisi lähetetyt sähköpostit saapuvat turvallisesti määritettyyn postilaatikkoosi

Se on niin yksinkertaista! Saat käyttää ammattimaisia sähköpostiosoitteita muuttamatta nykyistä sähköpostityöskentelyäsi.


## Sähköpostin Uudelleenlähetyksen Määrittäminen Forward Emailin Kanssa {#setting-up-email-forwarding-with-forward-email}

Yksi Forward Emailin suurimmista eduista on sen helppokäyttöisyys. Tässä vaiheittainen opas:

### 1. Luo Tili {#1-sign-up-for-an-account}

Vieraile osoitteessa [forwardemail.net](https://forwardemail.net) ja luo ilmainen tili. Rekisteröitymisprosessimme kestää alle minuutin.

### 2. Lisää Verkkotunnuksesi {#2-add-your-domain}

Kirjautumisen jälkeen lisää verkkotunnus, jota haluat käyttää sähköpostin uudelleenlähetykseen. Jos sinulla ei vielä ole verkkotunnusta, sinun täytyy ensin ostaa sellainen verkkotunnusrekisteröijältä.

### 3. Määritä DNS-tietueet {#3-configure-dns-records}

Annamme sinulle tarkat DNS-tietueet, jotka sinun tulee lisätä verkkotunnukseesi. Tyypillisesti tämä sisältää:

* MX-tietueiden lisäämisen, jotka osoittavat sähköpostipalvelimillemme
* TXT-tietueiden lisäämisen varmennusta ja turvallisuutta varten

Useimmilla verkkotunnusrekisteröijillä on yksinkertainen käyttöliittymä näiden tietueiden lisäämiseen. Tarjoamme yksityiskohtaiset ohjeet kaikille suurimmille verkkotunnusrekisteröijille, jotta tämä prosessi sujuu mahdollisimman vaivattomasti.
### 4. Luo Sähköpostin Uudelleenlähetyksiä {#4-create-email-forwards}

Kun DNS-tietueesi on vahvistettu (mikä yleensä kestää vain muutaman minuutin), voit luoda sähköpostin uudelleenlähetyksiä. Määritä yksinkertaisesti:

* Sähköpostiosoite omalla verkkotunnuksellasi (esim. <contact@yourdomain.com>)
* Kohde, johon haluat sähköpostien lähetettävän (esim. henkilökohtainen Gmail-osoitteesi)

### 5. Aloita Uusien Sähköpostiosoitteidesi Käyttö {#5-start-using-your-new-email-addresses}

Siinä kaikki! Verkkotunnuksesi mukaisiin osoitteisiin lähetetyt sähköpostit uudelleenlähetetään nyt määrittämääsi kohteeseen. Voit luoda niin monta uudelleenlähetystä kuin tarvitset, mukaan lukien catch-all-osoitteet, jotka uudelleenlähettävät kaikki verkkotunnuksesi mille tahansa osoitteelle lähetetyt sähköpostit.


## Forward Emailin Edistyneet Ominaisuudet {#advanced-features-of-forward-email}

Vaikka perussähköpostin uudelleenlähetys onkin itsessään tehokas, Forward Email tarjoaa useita edistyneitä ominaisuuksia, jotka erottavat meidät muista:

### Kertakäyttöiset Osoitteet {#disposable-addresses}

Luo tiettyjä tai anonyymejä sähköpostiosoitteita, jotka uudelleenlähetetään päätilillesi. Voit liittää näihin osoitteisiin tunnisteita ja ottaa ne käyttöön tai poistaa käytöstä milloin tahansa pitääksesi postilaatikkosi järjestyksessä. Todellinen sähköpostiosoitteesi ei koskaan paljastu.

### Useita Vastaanottajia ja Jokerimerkkejä {#multiple-recipients-and-wildcards}

Uudelleenlähetä yksi osoite useille vastaanottajille, mikä helpottaa tiedon jakamista tiimissä. Voit myös käyttää jokerimerkki-osoitteita (catch-all-uudelleenlähetys) vastaanottaaksesi sähköposteja, jotka on lähetetty mille tahansa verkkotunnuksesi osoitteelle.

### "Lähetä Sähköpostina" -integraatio {#send-mail-as-integration}

Sinun ei koskaan tarvitse poistua postilaatikostasi lähettääksesi sähköposteja omalla verkkotunnuksellasi. Lähetä ja vastaa viesteihin ikään kuin ne olisivat osoitteesta <you@yourdomain.com> suoraan Gmail- tai Outlook-tililtäsi.

### Kvanttikestävä Tietoturva {#quantum-resistant-security}

Olemme maailman ensimmäinen ja ainoa sähköpostipalvelu, joka käyttää kvanttikestävää salausta, suojaten viestintäsi jopa kehittyneimmiltä tulevaisuuden uhkilta.

### Yksilöllisesti Salatut SQLite-postilaatikot {#individually-encrypted-sqlite-mailboxes}

Toisin kuin muut palveluntarjoajat, jotka tallentavat kaikki käyttäjien sähköpostit jaettuihin tietokantoihin, me käytämme yksilöllisesti salattuja SQLite-postilaatikoita vertaansa vailla olevan yksityisyyden ja tietoturvan takaamiseksi.


## Miksi Valita Forward Email Kilpailijoiden Sijaan {#why-choose-forward-email-over-competitors}

Sähköpostin uudelleenlähetyksen markkinoilla on useita toimijoita, mutta Forward Email erottuu useilla tärkeillä tavoilla:

### 1. 100 % Avoimen Lähdekoodin {#1-100-open-source}

Olemme ainoa täysin avoimen lähdekoodin sähköpostin uudelleenlähetyspalvelu, mukaan lukien taustajärjestelmämme koodi. Tämä läpinäkyvyys rakentaa luottamusta ja mahdollistaa riippumattomat tietoturvatarkastukset. Muut palvelut saattavat väittää olevansa avoimen lähdekoodin, mutta eivät julkaise taustakoodiaan.

### 2. Yksityisyyttä Korostava {#2-privacy-focused}

Loimme tämän palvelun, koska sinulla on oikeus yksityisyyteen. Käytämme vahvaa salausta TLS:llä, emme tallenna SMTP-lokeja (paitsi virheistä ja lähtevästä SMTP:stä), emmekä kirjoita sähköpostejasi levylle.

### 3. Ei Kolmansien Osapuolien Riippuvuutta {#3-no-third-party-reliance}

Toisin kuin kilpailijat, jotka luottavat Amazon SES:ään tai muihin kolmannen osapuolen palveluihin, me hallitsemme infrastruktuuriamme kokonaan itse, mikä parantaa sekä luotettavuutta että yksityisyyttä.

### 4. Kustannustehokas Hinnoittelu {#4-cost-effective-pricing}

Hinnoittelumallimme mahdollistaa kustannustehokkaan skaalautuvuuden. Emme veloita käyttäjää kohden, ja voit maksaa tallennustilasta käytön mukaan. 3 dollarilla kuukaudessa tarjoamme enemmän ominaisuuksia edullisemmin kuin kilpailijat kuten Gandi (3,99 $/kk).

### 5. Rajoittamattomat Resurssit {#5-unlimited-resources}

Emme aseta keinotekoisia rajoja verkkotunnuksille, aliaksille tai sähköpostiosoitteille kuten monet kilpailijat tekevät.

### 6. Suurten Organisaatioiden Luottama {#6-trusted-by-major-organizations}

Palveluamme käyttää yli 500 000 verkkotunnusta, mukaan lukien merkittäviä organisaatioita kuten [The U.S. Naval Academy](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [The Linux Foundation](/blog/docs/linux-foundation-email-enterprise-case-study), [Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales ja monet muut.


## Yleiset Käyttötapaukset Sähköpostin Uudelleenlähetykselle {#common-use-cases-for-email-forwarding}
Sähköpostin edelleenlähetys ratkaisee monia haasteita eri käyttäjätyypeille:

### Yrityksille {#for-businesses}

* Luo ammattimaisia sähköpostiosoitteita eri osastoille (sales@, support@, info@)
* Hallitse tiimin sähköpostiviestintää helposti
* Säilytä brändin yhtenäisyys kaikessa viestinnässä
* Yksinkertaista sähköpostinhallintaa henkilöstömuutosten aikana

### Kehittäjille {#for-developers}

* Määritä automatisoituja ilmoitusjärjestelmiä
* Luo tarkoituksenmukaisia osoitteita eri projekteille
* Integroi webhooksien avulla edistyneeseen automaatioon
* Hyödynnä APIamme räätälöityihin toteutuksiin

### Yksityisyyttä arvostaville {#for-privacy-conscious-individuals}

* Luo erillisiä sähköpostiosoitteita eri palveluille seuratakseen, kuka jakaa tietojasi
* Käytä kertakäyttöisiä osoitteita yksittäisiin rekisteröitymisiin
* Säilytä yksityisyys suojaamalla pääsähköpostiosoitteesi
* Poista helposti käytöstä osoitteet, jotka alkavat vastaanottaa roskapostia


## Parhaat käytännöt sähköpostin edelleenlähetykseen {#best-practices-for-email-forwarding}

Saadaksesi parhaan hyödyn sähköpostin edelleenlähetyksestä, ota huomioon nämä parhaat käytännöt:

### 1. Käytä kuvaavia osoitteita {#1-use-descriptive-addresses}

Luo sähköpostiosoitteita, jotka selkeästi ilmaisevat tarkoituksensa (esim. <newsletter@yourdomain.com>, <shopping@yourdomain.com>) auttaaksesi saapuvan postin järjestämisessä.

### 2. Ota käyttöön asianmukainen todennus {#2-implement-proper-authentication}

Varmista, että verkkotunnuksellasi on asianmukaiset SPF-, DKIM- ja DMARC-tietueet toimitettavuuden maksimoimiseksi. Forward Email tekee tämän helpoksi opastetun asennuksen avulla.

### 3. Tarkista edelleenlähetykset säännöllisesti {#3-regularly-review-your-forwards}

Tarkasta ajoittain sähköpostin edelleenlähetykset poistaaksesi käytöstä tarpeettomat tai liikaa roskapostia vastaanottavat osoitteet.

### 4. Määritä "Lähetä sähköpostina" saumattomia vastauksia varten {#4-set-up-send-mail-as-for-seamless-replies}

Konfiguroi pääsähköpostiohjelmasi lähettämään sähköpostia mukautetuilla verkkotunnusosoitteillasi yhtenäisen kokemuksen takaamiseksi vastatessasi edelleenlähetettyihin sähköposteihin.

### 5. Käytä catch-all-osoitteita varoen {#5-use-catch-all-addresses-cautiously}

Vaikka catch-all-osoitteet ovat käteviä, ne voivat vastaanottaa enemmän roskapostia. Harkitse erityisten edelleenlähetysten luomista tärkeille viestinnöille.


## Yhteenveto {#conclusion}

Sähköpostin edelleenlähetys on tehokas työkalu, joka tuo ammattimaisuutta, yksityisyyttä ja yksinkertaisuutta sähköpostiviestintään. Forward Emailin avulla saat turvallisimman, yksityisimmän ja joustavimman sähköpostin edelleenlähetyspalvelun.

Ainoana 100 % avoimen lähdekoodin tarjoajana, jolla on kvanttiturvallinen salaus ja yksityisyyteen keskittyminen, olemme rakentaneet palvelun, joka kunnioittaa oikeuksiasi tarjoten samalla poikkeuksellista toiminnallisuutta.

Etsitpä sitten ammattimaisia sähköpostiosoitteita yrityksellesi, yksityisyyden suojaa kertakäyttöisillä osoitteilla tai haluat yksinkertaistaa useiden sähköpostitilien hallintaa, Forward Email tarjoaa täydellisen ratkaisun.

Valmis muuttamaan sähköpostikokemuksesi? [Rekisteröidy ilmaiseksi](https://forwardemail.net) jo tänään ja liity yli 500 000 verkkotunnuksen joukkoon, jotka hyötyvät palvelustamme.

---

*Tämän blogikirjoituksen on kirjoittanut Forward Email -tiimi, maailman turvallisimman, yksityisimmän ja joustavimman sähköpostin edelleenlähetyspalvelun luojat. Vieraile osoitteessa [forwardemail.net](https://forwardemail.net) saadaksesi lisätietoja palvelustamme ja aloittaaksesi sähköpostien edelleenlähetyksen luottavaisin mielin.*
