# Forward Emailin webmail-opas {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmailissa</a> luet ja lähetät postia. <a href="/my-account/domains">Verkon hallintapaneelissa</a> määrität verkkotunnukset, aliakset ja salasanat. Kirjaudut webmailiin aliasosoitteella ja hallintapaneelissa luodulla salasanalla. Webmail on ilmainen ja <a href="/faq#do-you-offer-a-webmail-client">avointa lähdekoodia</a>, ja sama sovellus toimii selaimessa, työpöydällä, mobiilissa ja terminaalissa.
</p>


## Sisällysluettelo {#table-of-contents}

* [Mistä webmailin saa](#where-to-get-webmail)
* [Webmail ja verkon hallintapaneeli](#webmail-and-the-web-dashboard)
* [Kirjautuminen](#signing-in)
  * [Luo aliaksen salasana](#generate-an-alias-password)
  * [Kirjaudu webmailiin](#sign-in-to-webmail)
* [Useamman tilin käyttäminen](#using-more-than-one-account)
  * [Lähetä toisena kirjautuneena tilinä](#send-as-another-signed-in-account)
* [Lähetä mistä tahansa verkkotunnuksesi osoitteesta](#send-from-any-address-on-your-domain)
  * [Vaihe 1: Luo catch-all-salasana hallintapaneelissa](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Vaihe 2: Tallenna se webmailiin](#step-2-save-it-in-webmail)
  * [Vaihe 3: Valitse osoite viestiä kirjoittaessa](#step-3-pick-the-address-when-you-compose)
  * [Mitä catch-all-lähettämisestä kannattaa tietää](#what-to-know-about-catch-all-sending)
* [Webmailin asetukset yhdellä silmäyksellä](#webmail-settings-at-a-glance)
* [Yksityisyys ja App Lock](#privacy-and-app-lock)
* [Vianmääritys](#troubleshooting)


## Mistä webmailin saa {#where-to-get-webmail}

| Alusta                            | Mistä                                                                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Selain                            | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (ei asennusta) |
| Työpöytä (macOS, Windows, Linux)  | <a href="/download">Lataussivultamme</a>                                                                                   |
| Mobiili (Android, iOS)            | <a href="/download">Lataussivultamme</a>                                                                                   |
| Terminaali                        | `forwardemail`-komento. Katso [Onko teillä terminaalisovellusta](/faq#do-you-have-a-terminal-app)                          |

Kaikki on rakennettu samasta avoimen lähdekoodin projektista, joten kaikki tässä oppaassa kerrottu koskee jokaista niistä. Asetukset ja tallennetut salasanat säilytetään kullakin laitteella, joten määritä ne jokaisella käyttämälläsi laitteella.


## Webmail ja verkon hallintapaneeli {#webmail-and-the-web-dashboard}

Forward Emailissa on kaksi erillistä paikkaa, joihin kirjaudutaan, ja ne käyttävät eri tunnuksia:

|                               | Verkon hallintapaneeli (forwardemail.net)                                                                  | Webmail (mail.forwardemail.net ja sovellukset)                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Kirjaudu käyttäen**         | Forward Email -tilisi sähköpostiosoitetta ja salasanaa (sekä 2FA:ta tai pääsyavainta)                      | Aliasosoitetta (kuten `you@example.com`) ja sen luotua salasanaa                        |
| **Käyttötarkoitus**           | Verkkotunnusten lisääminen, DNS, aliakset, laskutus, tiimin jäsenet, salasanojen luominen, Lisäasetukset   | Postin lukeminen ja lähettäminen, kansiot, tunnisteet, haku, kalenteri, yhteystiedot, suodattimet |
| **Täällä luodut salasanat**   | Aliasten salasanat ja catch-all-salasanat                                                                  | Ei mitään. Webmail käyttää hallintapaneelissa luomiasi salasanoja                       |

Tavallinen määritys näyttää tältä:

1. Lisää verkkotunnuksesi ja määritä DNS hallintapaneelissa.
2. Luo alias, jossa IMAP-tallennustila on käytössä (esimerkiksi `you@example.com`).
3. Luo salasana tälle aliakselle.
4. Kirjaudu webmailiin tällä aliaksella ja salasanalla.

Jotta voit lähettää postia, verkkotunnuksellasi on myös oltava lähtevä SMTP käytössä kohdassa <a href="/my-account/domains">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Lisäasetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n konfigurointi, samoin kuin minkä tahansa muun sähköpostiohjelman kanssa.


## Kirjautuminen {#signing-in}

### Luo aliaksen salasana {#generate-an-alias-password}

1. Siirry kohtaan <a href="/my-account/domains">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset.
2. Napsauta aliaksen vieressä **Luo salasana**.
3. Kopioi salasana. Se näytetään vain kerran.

Tämä on sama salasana, jota käyttäisit IMAPille, POP3:lle, SMTP:lle, CalDAVille ja CardDAVille. Sillä ei voi kirjautua verkon hallintapaneeliin.

### Kirjaudu webmailiin {#sign-in-to-webmail}

Avaa webmail ja syötä koko aliasosoite ja luotu salasana. Jos haluat ensin vain katsella ympärillesi, kokeile demoa kirjautumisnäytöltä.


## Useamman tilin käyttäminen {#using-more-than-one-account}

Voit kirjautua useisiin aliaksiin samanaikaisesti, myös eri verkkotunnuksilla. Vaihda niiden välillä tilivalikosta ja hallitse niitä kohdassa **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Tilit säilytetään laitteella, jolla ne lisättiin, eikä niitä synkronoida.

### Lähetä toisena kirjautuneena tilinä {#send-as-another-signed-in-account}

Kun kirjoitat viestiä, **From**-valikossa näkyvät kaikki tällä laitteella kirjautuneet tilit. Valitse yksi lähettääksesi sen osoitteesta. Viesti lähetetään kyseisen tilin omalla salasanalla, ja kopio menee kyseisen tilin Lähetetyt-kansioon.


## Lähetä mistä tahansa verkkotunnuksesi osoitteesta {#send-from-any-address-on-your-domain}

Jos omistat verkkotunnuksen, voit lähettää mistä tahansa sen osoitteesta, kuten `billing@example.com` tai `no-reply@example.com`, luomatta aliasta ja kirjautumatta jokaiseen erikseen. Tämä tehdään verkkotunnuksen **catch-all-salasanalla**.

Et kirjaudu webmailiin jokerimerkki- tai catch-all-tilinä, eikä mitään toimintoa tarvitse ottaa käyttöön. Tallennat catch-all-salasanan kerran webmailin asetuksiin, ja sen jälkeen From-valikossa voit kirjoittaa minkä tahansa kyseisen verkkotunnuksen osoitteen.

### Vaihe 1: Luo catch-all-salasana hallintapaneelissa {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Siirry kohtaan <a href="/my-account/domains">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> ja valitse verkkotunnuksesi.
2. Avaa **Lisäasetukset** ja etsi **Yleiset salasanat**.
3. Napsauta **Luo salasana**. Jätä kenttä tyhjäksi saadaksesi vahvan satunnaisen salasanan, ja lisää halutessasi kuvaus (esimerkiksi "Webmail kannettavallani").
4. Kopioi salasana. Se näytetään vain kerran.

Sinun on oltava verkkotunnuksen ylläpitäjä nähdäksesi tämän osion. Käytä samassa paikassa olevaa **Hallitse salasanoja** -toimintoa catch-all-salasanojen tarkasteluun tai poistamiseen myöhemmin. Kun poistat salasanan, se lakkaa toimimasta kaikkialla, minne se on tallennettu.

### Vaihe 2: Tallenna se webmailiin {#step-2-save-it-in-webmail}

1. Avaa webmailissa **Settings <i class="fa fa-angle-right"></i> General**.
2. Etsi kortti nimeltä **Send from any address**, heti kohdan **Your accounts** alta.
3. Napsauta **Add catch-all password**.
4. Syötä verkkotunnus (esimerkiksi `example.com`) ja liitä catch-all-salasana.
5. Napsauta **Save**. Näet viestin "You can now send from any address @example.com".

Voit tallentaa salasanoja niin monelle verkkotunnukselle kuin haluat. Poista salasana napsauttamalla sen vieressä olevaa roskakorikuvaketta.

### Vaihe 3: Valitse osoite viestiä kirjoittaessa {#step-3-pick-the-address-when-you-compose}

1. Aloita uusi viesti.
2. Avaa **From**-valikko. Kirjautuneiden tiliesi alla on rivi jokaiselle tallennetulle verkkotunnukselle: **Other address @example.com…**
3. Valitse se. From-rivi muuttuu tekstikentäksi, jonka perässä on `@example.com`.
4. Kirjoita @-merkkiä edeltävä osa (esimerkiksi `billing`) ja lähetä.

Luonnokset säilyttävät kirjoittamasi osoitteen, joten tallennettu luonnos avautuu uudelleen samalla From-osoitteella.

### Mitä catch-all-lähettämisestä kannattaa tietää {#what-to-know-about-catch-all-sending}

* **Sillä voi vain lähettää.** Catch-all-salasana toimii vain lähettämiseen. Sillä ei voi avata postilaatikkoa, joten et voi lukea osoitteen `billing@example.com` postia sillä. Jos haluat lukea vastaukset, luo kyseiselle osoitteelle alias (tai catch-all-alias, joka välittää postin sinulle).
* **Lähetetyt kopiot menevät käyttämällesi tilille.** Osoitteesta `billing@example.com` lähetetty viesti tallennetaan sen tilin Lähetetyt-kansioon, josta kirjoitit viestin.
* **Se toimii kaikilta laitteen tileiltä.** Tallennettu salasana ei ole sidottu yhteen kirjautuneeseen tiliin. Mikä tahansa laitteen tili voi käyttää sitä.
* **Se pysyy tällä laitteella.** Salasana tallennetaan vain laitteelle, jolla tallensit sen. Sitä ei synkronoida, eikä laitteiden QR-yhdistäminen kopioi sitä. Lisää se uudelleen jokaisella laitteella.
* **App Lock suojaa sen.** Jos App Lock on käytössä, salasana salataan muiden paikallisten tietojesi kanssa, ja **Other address** -rivit piilotetaan, kun sovellus on lukittu.
* **Ajastettu lähetys ei ole käytettävissä** osoitteille, joista lähetetään catch-all-salasanalla, koska kyseisellä salasanalla ei voi lukea takaisin tai peruuttaa ajastettua viestiä. Lähetä heti tai lähetä kirjautuneena tilinä.
* **Väärä salasana ei kirjaa sinua ulos.** Jos catch-all-salasana on väärä tai se on poistettu hallintapaneelissa, lähetys epäonnistuu virheeseen, ja pysyt kirjautuneena.


## Webmailin asetukset yhdellä silmäyksellä {#webmail-settings-at-a-glance}

| Osio                   | Mitä se sisältää                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **General**            | Tilisi, lähettäminen mistä tahansa osoitteesta (catch-all-salasanat), ilmoitukset, tallennustila         |
| **Appearance**         | Teema, asettelu, tiiviys, viestieditorin oletukset, allekirjoitus, fontti, ulkoiset linkit                |
| **Privacy & Security** | App Lock, PGP-salaus, yksityisyysasetukset, roskapostin ilmoittaminen                                    |
| **Folders & Labels**   | Erikoiskansiot, omat kansiosi, tunnisteet                                                                |
| **Filters**            | Postisuodattimet kirjautuneelle aliakselle                                                               |
| **Calendar**           | Viikon aloituspäivä ja tehtävät                                                                          |
| **Search**             | Hakuindeksointi, indeksin kunto, tallennetut haut, hakuoperaattorit                                      |
| **Advanced**           | Postilaatikon tallennustila, paikallinen välimuisti ja sovelluksen nollaus                               |
| **Keyboard Shortcuts** | Kaikki pikanäppäimet                                                                                     |
| **About & Help**       | Versio, työpöytäsovelluksen lataus, palaute ja linkit                                                    |

Verkkotunnukseen tai aliakseen itseensä liittyvät asiat, kuten DNS, edelleenlähetyksen vastaanottajat, tallennustilan rajat, lomavastaajat, catch-all-salasanat ja roskapostitarkistus, määritetään <a href="/my-account/domains">verkon hallintapaneelissa</a>.


## Yksityisyys ja App Lock {#privacy-and-app-lock}

Webmail säilyttää paikallisen kopion postistasi, jotta se on nopea ja toimii ilman verkkoyhteyttä. **App Lock** (kohdassa **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) salaa nämä paikalliset tiedot, asetuksesi ja tallennetut salasanasi laitteella, ja sen lukitus avataan pääsyavaimella tai PIN-koodilla. Posti ja reaaliaikaiset päivitykset kulkevat suoraan sovelluksen ja Forward Emailin välillä ilman välissä olevia mainonta- tai seurantapalveluita.


## Vianmääritys {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmaililla ei ole tälle osoitteelle salasanaa tällä laitteella. Kirjaudu kyseiseen aliakseen tai tallenna verkkotunnuksen catch-all-salasana kohtaan **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Jos sovellus on lukittu, avaa lukitus ensin.

**"Other address" -rivi puuttuu From-valikosta.**

Tarkista, että olet tallentanut catch-all-salasanan tälle laitteelle ja että App Lock on avattu.

**Lähettäminen catch-all-osoitteesta epäonnistuu todennusvirheeseen.**

Catch-all-salasana on ehkä poistettu tai kirjoitettu väärin. Luo uusi hallintapaneelissa, poista sitten vanha webmailista ja lisää uusi.

**Hallintapaneelin salasanani ei toimi webmailissa.**

Webmail tarvitsee aliaksen salasanan, ei hallintapaneelin salasanaasi. Katso [Luo aliaksen salasana](#generate-an-alias-password).

Etkö vieläkään pääse eteenpäin? Katso <a href="/faq">usein kysytyt kysymykset</a> tai <a href="/help">ota meihin yhteyttä</a>.
