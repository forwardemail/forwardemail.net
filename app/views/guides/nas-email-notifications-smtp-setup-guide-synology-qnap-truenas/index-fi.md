# Täydellinen opas NAS-sähköpostin asetuksiin Forward Emailin kanssa {#complete-guide-to-nas-email-setup-with-forward-email}

Sähköpostihälytysten asettaminen NAS-laitteellesi ei pitäisi olla hankalaa. Olipa sinulla Synology, QNAP tai jopa Raspberry Pi -asennus, tämä opas saa laitteesi kommunikoimaan Forward Emailin kanssa, jotta tiedät oikeasti, kun jokin menee pieleen.

Useimmat NAS-laitteet voivat lähettää sähköpostihälytyksiä levyvikojen, lämpötilavaroitusten, varmuuskopioinnin valmistumisen ja turvallisuustapahtumien yhteydessä. Ongelma? Monet sähköpostipalveluntarjoajat ovat tiukentaneet turvallisuusvaatimuksiaan, ja vanhemmat laitteet eivät usein pysy mukana. Tässä Forward Email astuu kuvaan – tuemme sekä moderneja että vanhempia laitteita.

Tämä opas kattaa sähköpostin asetukset yli 75 NAS-valmistajalle vaihe vaiheelta ohjeineen, yhteensopivuustietoineen ja vianmääritysvinkeillä. Riippumatta siitä, mitä laitetta käytät, saamme hälytyksesi toimimaan.


## Sisällysluettelo {#table-of-contents}

* [Miksi tarvitset NAS-sähköpostihälytyksiä](#why-you-need-nas-email-notifications)
* [TLS-ongelma (ja miten korjaamme sen)](#the-tls-problem-and-how-we-fix-it)
* [Forward Emailin SMTP-asetukset](#forward-email-smtp-settings)
* [Laaja NAS-valmistajien yhteensopivuusmatriisi](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS -sähköpostin määritys](#synology-nas-email-configuration)
  * [Määritysvaiheet](#configuration-steps)
* [QNAP NAS -sähköpostin määritys](#qnap-nas-email-configuration)
  * [Määritysvaiheet](#configuration-steps-1)
  * [Yleiset QNAP-vianmääritysongelmat](#common-qnap-troubleshooting-issues)
* [ReadyNAS Legacy -määritys](#readynas-legacy-configuration)
  * [Legacy-määritysvaiheet](#legacy-configuration-steps)
  * [ReadyNAS-vianmääritys](#readynas-troubleshooting)
* [TerraMaster NAS -määritys](#terramaster-nas-configuration)
* [ASUSTOR NAS -määritys](#asustor-nas-configuration)
* [Buffalo TeraStation -määritys](#buffalo-terastation-configuration)
* [Western Digital My Cloud -määritys](#western-digital-my-cloud-configuration)
* [TrueNAS-sähköpostin määritys](#truenas-email-configuration)
* [OpenMediaVault-määritys](#openmediavault-configuration)
* [Raspberry Pi NAS -määritys](#raspberry-pi-nas-configuration)
  * [Alkuperäinen Raspberry Pi -asennus](#initial-raspberry-pi-setup)
  * [Samba-tiedostojen jakamisen määritys](#samba-file-sharing-configuration)
  * [FTP-palvelimen asennus](#ftp-server-setup)
  * [Sähköpostihälytysten määritys](#email-notification-configuration)
  * [Edistyneet Raspberry Pi NAS -ominaisuudet](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi -sähköpostin vianmääritys](#raspberry-pi-email-troubleshooting)
  * [Suorituskyvyn optimointi](#performance-optimization)
  * [Turvallisuusnäkökohdat](#security-considerations)


## Miksi tarvitset NAS-sähköpostihälytyksiä {#why-you-need-nas-email-notifications}

NAS-laitteesi valvoo valtavasti asioita – levyn kuntoa, lämpötilaa, verkkohäiriöitä, turvallisuustapahtumia. Ilman sähköpostihälytyksiä ongelmat voivat jäädä huomaamatta viikoiksi, mikä voi johtaa tietojen menetykseen tai tietoturvaloukkauksiin.

Sähköpostihälytykset antavat sinulle välittömiä ilmoituksia, kun levyt alkavat pettää, varoittavat luvattomista pääsyyrityksistä, vahvistavat onnistuneet varmuuskopiot ja pitävät sinut ajan tasalla järjestelmän kunnosta. Forward Email varmistaa, että nämä kriittiset ilmoitukset todella tavoittavat sinut.


## TLS-ongelma (ja miten korjaamme sen) {#the-tls-problem-and-how-we-fix-it}

Tilanne on tämä: jos NAS-laitteesi on valmistettu ennen vuotta 2020, se tukee todennäköisesti vain TLS 1.0 -protokollaa. Gmail, Outlook ja useimmat muut palveluntarjoajat lopettivat sen tuen jo vuosia sitten. Laitteesi yrittää lähettää sähköpostia, se hylätään, ja sinä jäät pimentoon.

Forward Email ratkaisee tämän kaksoisporttituen avulla. Modernit laitteet käyttävät standardeja porttejamme (`465` ja `587`), kun taas vanhemmat laitteet voivat käyttää legacy-porttejamme (`2455` ja `2555`), jotka tukevat edelleen TLS 1.0:aa.

> \[!IMPORTANT]
> Forward Email tukee sekä moderneja että legacy-NAS-laitteita kaksoisporttistrategiamme kautta. Käytä portteja 465/587 moderneille laitteille, joissa on TLS 1.2+ -tuki, ja portteja 2455/2555 legacy-laitteille, jotka tukevat vain TLS 1.0:aa.


## Forward Emailin SMTP-asetukset {#forward-email-smtp-settings}
Tässä on mitä sinun tulee tietää SMTP-asetuksistamme:

**Nykyisille NAS-laitteille (2020+):** Käytä `smtp.forwardemail.net` portilla `465` (SSL/TLS) tai portilla `587` (STARTTLS). Nämä toimivat nykyisellä laiteohjelmistolla, joka tukee TLS 1.2+:ta.

**Vanhemmille NAS-laitteille:** Käytä `smtp.forwardemail.net` portilla `2455` (SSL/TLS) tai portilla `2555` (STARTTLS). Nämä tukevat TLS 1.0:aa vanhemmille laitteille.

**Todennus:** Käytä Forward Email -aliasiasi käyttäjänimenä ja [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains) -sivulta luotua salasanaa (ei tilisi salasanaa).

> \[!CAUTION]
> Älä koskaan käytä tilisi kirjautumissalasanaa SMTP-todennukseen. Käytä aina [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains) -sivulta luotua salasanaa NAS-konfiguraatiossa.

> \[!TIP]
> Tarkista NAS-laitteesi laiteohjelmiston versio ja TLS-tuki ennen konfigurointia. Useimmat vuoden 2020 jälkeen valmistetut laitteet tukevat moderneja TLS-protokollia, kun taas vanhemmat laitteet vaativat yleensä yhteensopivuusportteja vanhemmille protokollille.


## Kattava NAS-toimittajien yhteensopivuusmatriisi {#comprehensive-nas-provider-compatibility-matrix}

Seuraava matriisi tarjoaa yksityiskohtaista yhteensopivuustietoa suurimmista NAS-toimittajista, mukaan lukien TLS-tukitasot, laiteohjelmiston tila ja suositellut Forward Email -asetukset.

| NAS-toimittaja   | Nykyiset mallit | TLS-tuki    | Laiteohjelmiston tila | Suositellut portit | Yleiset ongelmat                                                                                                                                       | Asennusopas/Kuvakaappaukset                                                                                                                    |
| ---------------- | --------------- | ----------- | --------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x         | TLS 1.2+    | Aktiivinen            | `465`, `587`       | [STARTTLS-konfiguraatio](https://community.synology.com/enu/forum/2/post/124584)                                                                      | [DSM-sähköposti-ilmoitusten asennus](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                         |
| QNAP             | QTS 5.x         | TLS 1.2+    | Aktiivinen            | `465`, `587`       | [Ilmoituskeskuksen virheet](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)  | [QTS-sähköpostipalvelimen konfigurointi](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+    | Aktiivinen            | `465`, `587`       | [DNS-ratkaisun ongelmat](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                  | [Raspberry Pi -sähköpostin asennusopas](#raspberry-pi-nas-configuration)                                                                       |
| ASUSTOR          | ADM 4.x         | TLS 1.2+    | Aktiivinen            | `465`, `587`       | [Sertifikaatin validointi](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                     | [ASUSTOR-ilmoitusasetukset](https://www.asustor.com/en/online/online_help?id=8)                                                                |
| TerraMaster      | TOS 6.x         | TLS 1.2     | Aktiivinen            | `465`, `587`       | [SMTP-todennus](https://www.terra-master.com/global/forum/)                                                                                           | [TerraMaster-sähköpostin konfigurointi](https://www.terra-master.com/global/support/download.php)                                                |
| TrueNAS          | SCALE/CORE      | TLS 1.2+    | Aktiivinen            | `465`, `587`       | [SSL-sertifikaatin asennus](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                         | [TrueNAS-sähköpostin asennusopas](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                |
| Buffalo          | TeraStation     | TLS 1.2     | Rajoitettu            | `465`, `587`       | [Laiteohjelmiston yhteensopivuus](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) | [TeraStation-sähköpostin asennus](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5   | TLS 1.2     | Rajoitettu            | `465`, `587`       | [Vanhan käyttöjärjestelmän yhteensopivuus](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                               | [My Cloud -sähköpostin konfigurointi](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                               |
| OpenMediaVault   | OMV 7.x         | TLS 1.2+    | Aktiivinen            | `465`, `587`       | [Lisäosien riippuvuudet](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                   | [OMV-ilmoitusasetukset](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                    |
| Netgear ReadyNAS | OS 6.x          | Vain TLS 1.0| Poistettu käytöstä    | `2455`, `2555`     | [Vanhan TLS-tuen ongelmat](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                   | [ReadyNAS-sähköposti-ilmoitusasetukset](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) |
| Drobo            | Dashboard       | TLS 1.2     | Poistettu käytöstä    | `465`, `587`       | [Rajoitettu tuki](https://myprojects.drobo.com/support/)                                                                                            | [Drobo-sähköposti-ilmoitukset](https://www.drobo.com/support/)                                                                                   |
Tämä matriisi osoittaa selkeän eron modernien, aktiivisesti ylläpidettyjen NAS-järjestelmien ja vanhempien laitteiden välillä, jotka vaativat erityisiä yhteensopivuusjärjestelyjä. Suurin osa nykyisistä NAS-laitteista tukee moderneja TLS-standardeja ja voi käyttää Forward Emailin ensisijaisia SMTP-portteja ilman erityisiä asetuksia.


## Synology NAS Sähköpostiasetukset {#synology-nas-email-configuration}

Synology-laitteiden DSM on melko helppo ottaa käyttöön. Ne tukevat modernia TLS:ää, joten voit käyttää vakioporttejamme ilman ongelmia.

> \[!NOTE]
> Synology DSM 7.x tarjoaa kattavimmat sähköposti-ilmoitusominaisuudet. Vanhemmissa DSM-versioissa voi olla rajoitetut asetukset.

### Asetusvaiheet {#configuration-steps}

1. **Kirjaudu DSM-verkkokäyttöliittymään** syöttämällä NAS-laitteesi IP-osoite tai QuickConnect ID verkkoselaimeen.

2. **Siirry Ohjauspaneeliin** ja valitse "Ilmoitukset" -osio, napsauta sitten "Sähköposti" -välilehteä päästäksesi sähköpostiasetuksiin.

3. **Ota sähköposti-ilmoitukset käyttöön** valitsemalla "Ota sähköposti-ilmoitukset käyttöön" -valintaruutu.

4. **Määritä SMTP-palvelin** syöttämällä palvelimen osoitteeksi `smtp.forwardemail.net`.

5. **Aseta porttiasetukseksi** portti 465 SSL/TLS-yhteyksille (suositeltu). Portti 587 STARTTLS:llä on myös tuettu vaihtoehto.

6. **Määritä todennus** valitsemalla "SMTP-todennus vaaditaan" ja syöttämällä Forward Email -alias käyttäjänimeksi.

7. **Syötä salasanasi** käyttäen salasanaa, jonka olet luonut kohdassa [Oma tili -> Domainit -> Alias-nimet](https://forwardemail.net/my-account/domains).

8. **Määritä vastaanottajien osoitteet** syöttämällä enintään viisi sähköpostiosoitetta, jotka saavat ilmoitukset.

9. **Määritä ilmoitusten suodatus** hallitaksesi, mitkä tapahtumat laukaisevat sähköposti-ilmoitukset, estäen ilmoitusten ylitarjonnan ja varmistaen, että kriittiset tapahtumat raportoidaan.

10. **Testaa asetukset** käyttämällä DSM:n sisäänrakennettua testitoimintoa varmistaaksesi, että kaikki asetukset ovat oikein ja yhteys Forward Emailin palvelimiin toimii.

> \[!TIP]
> Synology mahdollistaa eri ilmoitustyyppien määrittämisen eri vastaanottajille, tarjoten joustavuutta hälytysten jakelussa tiimissäsi.


## QNAP NAS Sähköpostiasetukset {#qnap-nas-email-configuration}

QNAP-laitteet, joissa on QTS, toimivat erinomaisesti Forward Emailin kanssa. Ne tukevat modernia TLS:ää ja niissä on selkeä verkkokäyttöliittymä asetusten tekemiseen.

> \[!IMPORTANT]
> QNAP QTS 5.2.4:ssä oli tunnettu ongelma sähköposti-ilmoituksissa, joka [korjattiin versiossa QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Varmista, että laiteohjelmistosi on päivitetty ilmoitusvirheiden välttämiseksi.

### Asetusvaiheet {#configuration-steps-1}

1. **Kirjaudu QNAP-laitteesi verkkokäyttöliittymään** syöttämällä sen IP-osoite selaimeen.

2. **Siirry Ohjauspaneeliin** ja valitse "Palvelutili ja laitteen paritus", napsauta sitten "Sähköposti" -osiota aloittaaksesi sähköpostiasetukset.

3. **Napsauta "Lisää SMTP-palvelu"** luodaksesi uuden sähköpostiasetuksen.

4. **Määritä SMTP-palvelin** syöttämällä SMTP-palvelimen osoitteeksi `smtp.forwardemail.net`.

5. **Valitse sopiva suojausprotokolla** - valitse "SSL/TLS" portilla `465` (suositeltu). Portti `587` STARTTLS:llä on myös tuettu.

6. **Määritä porttinumero** - portti `465` SSL/TLS:llä on suositeltu. Portti `587` STARTTLS:llä on myös käytettävissä tarvittaessa.

7. **Syötä todennustiedot** käyttäen Forward Email -aliasiasi käyttäjänimenä ja luomaasi salasanaa kohdasta [Oma tili -> Domainit -> Alias-nimet](https://forwardemail.net/my-account/domains).

8. **Määritä lähettäjän tiedot** syöttämällä kuvaava nimi "Lähettäjä" -kenttään, esimerkiksi "QNAP NAS -järjestelmä" tai laitteen isäntänimi.

9. **Määritä vastaanottajien osoitteet** eri ilmoitustyypeille. QNAP mahdollistaa useiden vastaanottajaryhmien määrittämisen eri hälytystyypeille.

10. **Testaa asetukset** käyttämällä QNAP:n sisäänrakennettua sähköpostin testitoimintoa varmistaaksesi, että kaikki asetukset toimivat oikein.

> \[!TIP]
> Jos kohtaat [Gmailin SMTP-asetusten ongelmia](https://forum.qnap.com/viewtopic.php?t=152466), samat vianmääritysvaiheet pätevät myös Forward Emailiin. Varmista, että todennus on oikein käytössä ja tunnistetiedot ovat oikein.
> \[!NOTE]
> QNAP-laitteet tukevat kehittynyttä ilmoitusten aikataulutusta, jonka avulla voit määrittää hiljaiset ajat, jolloin ei-kriittiset ilmoitukset estetään. Tämä on erityisen hyödyllistä yritysympäristöissä.

### Yleiset QNAP-ongelmat ja vianmääritys {#common-qnap-troubleshooting-issues}

Jos QNAP-laitteesi [ei lähetä ilmoitussähköposteja](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), tarkista seuraavat:

* Varmista, että Forward Email -tunnuksesi ovat oikein
* Varmista, että SMTP-palvelimen osoite on täsmälleen `smtp.forwardemail.net`
* Vahvista, että portti vastaa salausmenetelmääsi (`465` SSL/TLS:lle on suositeltu; `587` STARTTLS:lle on myös tuettu)
* Tarkista, että [SMTP-palvelimen asetukset](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) sallivat yhteyden


## ReadyNAS Legacy -konfiguraatio {#readynas-legacy-configuration}

Netgear ReadyNAS -laitteet aiheuttavat erityisiä haasteita, koska niiden laiteohjelmistotuki on lopetettu ja ne käyttävät vanhentuneita TLS 1.0 -protokollia. Forward Emailin legacy-porttien tuki varmistaa kuitenkin, että nämä laitteet voivat jatkaa sähköposti-ilmoitusten luotettavaa lähettämistä.

> \[!CAUTION]
> ReadyNAS OS 6.x tukee vain TLS 1.0 -protokollaa, mikä vaatii Forward Emailin legacy-yhteensopivat portit `2455` ja `2555`. Modernit portit `465` ja `587` eivät toimi näiden laitteiden kanssa.

### Legacy-konfiguraation vaiheet {#legacy-configuration-steps}

1. **Avaa ReadyNASin verkkokäyttöliittymä** kirjoittamalla laitteen IP-osoite selaimeen.

2. **Siirry kohtaan System > Settings > Alerts** päästäksesi sähköpostiasetuksiin.

3. **Määritä SMTP-palvelin** syöttämällä palvelimen osoitteeksi `smtp.forwardemail.net`.

4. **Aseta porttiasetukseksi** joko `2455` SSL/TLS-yhteyksille tai `2555` STARTTLS-yhteyksille – nämä ovat Forward Emailin legacy-yhteensopivia portteja.

5. **Ota käyttöön todennus** ja syötä Forward Email -alias käyttäjänimeksi sekä luomasi salasana kohdasta [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Määritä lähettäjän tiedot** kuvaavalla "From"-osoitteella ReadyNAS-laitteen tunnistamiseksi.

7. **Lisää vastaanottajien sähköpostiosoitteet** käyttämällä + -painiketta sähköpostikontaktien osiossa.

8. **Testaa asetukset** varmistaaksesi, että legacy TLS -yhteys toimii oikein.

> \[!IMPORTANT]
> ReadyNAS-laitteet tarvitsevat legacy-portit, koska ne eivät pysty muodostamaan turvallisia yhteyksiä moderneilla TLS-protokollilla. Tämä on [tunnettu rajoitus](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) lopetetussa laiteohjelmistossa.

### ReadyNAS-vianmääritys {#readynas-troubleshooting}

Yleisiä ReadyNAS-sähköpostiasetusten ongelmia ovat:

* **TLS-version yhteensopimattomuus**: Varmista, että käytät portteja `2455` tai `2555`, etkä moderneja portteja
* **Todennusvirheet**: Tarkista, että Forward Email -tunnuksesi ovat oikein
* **Verkkoyhteysongelmat**: Varmista, että ReadyNAS pääsee käsiksi `smtp.forwardemail.net` -osoitteeseen
* **Laiteohjelmiston rajoitukset**: Joillakin vanhemmilla ReadyNAS-malleilla voi olla lisävaatimuksia [HTTPS-asetuksille](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

ReadyNAS-laitteet, joissa on OS 6.x tai sitä vanhempi versio, tukevat vain TLS 1.0 -yhteyksiä, joita useimmat nykyaikaiset sähköpostipalveluntarjoajat eivät enää hyväksy. Forward Emailin omistetut legacy-portit (2455 ja 2555) tukevat erityisesti näitä vanhempia protokollia, varmistaen ReadyNAS-käyttäjille jatkuvan toimivuuden.

Sähköpostin määrittämiseksi ReadyNAS-laitteissa, avaa laitteen verkkokäyttöliittymä sen IP-osoitteen kautta. Siirry System-osioon ja valitse "Notifications" päästäksesi sähköpostiasetuksiin.

Sähköpostiasetuksissa ota sähköposti-ilmoitukset käyttöön ja syötä SMTP-palvelimeksi smtp.forwardemail.net. Tämä on ratkaisevan tärkeää – käytä Forward Emailin legacy-yhteensopivia portteja tavallisten SMTP-porttien sijaan.

SSL/TLS-yhteyksille määritä portiksi 2455 tavallisen portin 465 sijaan (suositeltu). STARTTLS-yhteyksille käytä porttia 2555 portin 587 sijaan. Nämä erityisportit säilyttävät TLS 1.0 -yhteensopivuuden tarjoten samalla parhaan mahdollisen suojan legacy-laitteille.
Syötä Forward Email -alias käyttäjänimeksi ja luomasi salasana todennusta varten. ReadyNAS-laitteet tukevat SMTP-todennusta, joka vaaditaan Forward Email -yhteyksissä.

Määritä lähettäjän sähköpostiosoite ja vastaanottajien osoitteet ilmoitusvaatimustesi mukaisesti. ReadyNAS sallii useita vastaanottajaosoitteita, jolloin voit jakaa hälytykset eri tiimin jäsenille tai sähköpostitileille.

Testaa määritystä huolellisesti, sillä ReadyNAS-laitteet eivät välttämättä anna yksityiskohtaisia virheilmoituksia, jos määritys epäonnistuu. Jos tavallinen testaus ei toimi, varmista, että käytät oikeita vanhoja portteja (2455 tai 2555) modernien SMTP-porttien sijaan.

Ota huomioon vanhojen TLS-protokollien turvallisuusvaikutukset. Vaikka Forward Emailin vanhat portit tarjoavat parhaan saatavilla olevan suojan vanhemmille laitteille, on suositeltavaa päivittää nykyaikaiseen NAS-järjestelmään, jossa on nykyinen TLS-tuki, kun se on mahdollista.


## TerraMaster NAS -määritys {#terramaster-nas-configuration}

TerraMaster-laitteet, joissa on TOS 6.x, tukevat nykyaikaista TLS:ää ja toimivat hyvin Forward Emailin vakioporttien kanssa.

> \[!NOTE]
> TerraMaster TOS 6.x tarjoaa kattavat sähköposti-ilmoitusominaisuudet. Varmista, että laiteohjelmistosi on ajan tasalla parhaan yhteensopivuuden takaamiseksi.

1. **Avaa järjestelmäasetukset**
   * Kirjaudu TerraMasterin verkkokäyttöliittymään
   * Siirry kohtaan **Ohjauspaneeli** > **Ilmoitukset**

2. **Määritä SMTP-asetukset**
   * Palvelin: `smtp.forwardemail.net`
   * Portti: `465` (SSL/TLS, suositeltu) tai `587` (STARTTLS)
   * Käyttäjänimi: Forward Email -alias
   * Salasana: Luotu salasana kohdasta [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains)

3. **Ota ilmoitukset käyttöön**
   * Valitse vastaanotettavat ilmoitustyypit
   * Testaa määritys sisäänrakennetulla testitoiminnolla

> \[!TIP]
> TerraMaster-laitteet toimivat parhaiten portin `465` kanssa SSL/TLS-yhteyksissä (suositeltu). Jos kohtaat ongelmia, portti `587` STARTTLS:llä on myös tuettu.


## ASUSTOR NAS -määritys {#asustor-nas-configuration}

ASUSTOR-laitteet, joissa on ADM 4.x, tarjoavat vankan sähköposti-ilmoitustuen ja toimivat saumattomasti Forward Emailin kanssa.

> \[!NOTE]
> ASUSTOR ADM 4.x sisältää kehittyneet ilmoitussuodatusvaihtoehdot. Voit mukauttaa, mitkä tapahtumat laukaisevat sähköposti-ilmoitukset.

1. **Avaa ilmoitusasetukset**
   * Kirjaudu ADM-verkkokäyttöliittymään
   * Siirry kohtaan **Asetukset** > **Ilmoitukset**

2. **Määritä SMTP-asetukset**
   * SMTP-palvelin: `smtp.forwardemail.net`
   * Portti: `465` (SSL/TLS, suositeltu) tai `587` (STARTTLS)
   * Todennus: Ota käyttöön
   * Käyttäjänimi: Forward Email -alias
   * Salasana: Luotu salasana kohdasta [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains)

3. **Määritä hälytystyypit**
   * Valitse, mitkä järjestelmätapahtumat laukaisevat sähköpostit
   * Määritä vastaanottajaosoitteet
   * Testaa määritys

> \[!IMPORTANT]
> ASUSTOR-laitteissa todennus on otettava nimenomaisesti käyttöön SMTP-asetuksissa. Älä unohda valita tätä asetusta.


## Buffalo TeraStation -määritys {#buffalo-terastation-configuration}

Buffalo TeraStation -laitteilla on rajalliset mutta toimivat sähköposti-ilmoitusmahdollisuudet. Määritys on suoraviivaista, kun tiedät mistä etsiä.

> \[!CAUTION]
> Buffalo TeraStationin laiteohjelmistopäivitykset ovat harvinaisia. Varmista, että käytössäsi on uusin saatavilla oleva laiteohjelmisto mallillesi ennen sähköpostin määritystä.

1. **Avaa verkkokäyttöliittymä**
   * Yhdistä TeraStationin verkkokäyttöliittymään
   * Siirry kohtaan **Järjestelmä** > **Ilmoitukset**

2. **Määritä sähköpostiasetukset**
   * SMTP-palvelin: `smtp.forwardemail.net`
   * Portti: `465` (SSL/TLS, suositeltu) tai `587` (STARTTLS)
   * Käyttäjänimi: Forward Email -alias
   * Salasana: Luotu salasana kohdasta [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains)
   * Ota SSL/TLS-salaus käyttöön

3. **Määritä ilmoitusasetukset**
   * Valitse, mitkä tapahtumat laukaisevat sähköpostit (levyvirheet, lämpötilahälytykset jne.)
   * Syötä vastaanottajien sähköpostiosoitteet
   * Tallenna ja testaa määritys

> \[!NOTE]
> Joillakin vanhemmilla TeraStation-malleilla voi olla rajalliset SMTP-määritysmahdollisuudet. Tarkista mallisi dokumentaatiosta tarkemmat ominaisuudet.
## Western Digital My Cloud -asetukset {#western-digital-my-cloud-configuration}

Western Digital My Cloud -laitteet, joissa on OS 5, tukevat sähköposti-ilmoituksia, vaikka käyttöliittymä voi olla hieman piilotettu asetuksiin.

> \[!WARNING]
> Western Digital on lopettanut tuen monille My Cloud -malleille. Tarkista, saako laitteesi edelleen laiteohjelmistopäivityksiä ennen kuin luotat sähköposti-ilmoituksiin kriittisissä hälytyksissä.

1. **Siirry asetuksiin**
   * Avaa My Cloud -verkkohallintapaneeli
   * Mene kohtaan **Settings** > **General** > **Notifications**

2. **Määritä SMTP-tiedot**
   * Sähköpostipalvelin: `smtp.forwardemail.net`
   * Portti: `465` (SSL/TLS, suositeltu) tai `587` (STARTTLS)
   * Käyttäjätunnus: Forward Email -aliasisi
   * Salasana: Luotu salasana kohdasta [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Ota salaus käyttöön

3. **Määritä hälytystyypit**
   * Valitse ilmoituskategoriat (järjestelmän hälytykset, levyn kunto jne.)
   * Lisää vastaanottajien sähköpostiosoitteet
   * Testaa sähköpostiasetukset

> \[!TIP]
> Suosittelemme käyttämään porttia `465` SSL/TLS:llä. Jos kohtaat ongelmia, portti `587` STARTTLS:llä on myös tuettu.


## TrueNAS-sähköpostiasetukset {#truenas-email-configuration}

TrueNAS (sekä SCALE että CORE) tarjoaa erinomaiset sähköposti-ilmoitusmahdollisuudet yksityiskohtaisilla asetuksilla.

> \[!NOTE]
> TrueNAS tarjoaa joitakin kattavimmista sähköposti-ilmoitusominaisuuksista NAS-järjestelmien joukossa. Voit määrittää yksityiskohtaisia hälytyssääntöjä ja useita vastaanottajia.

1. **Avaa järjestelmäasetukset**
   * Kirjaudu TrueNASin verkkokäyttöliittymään
   * Siirry kohtaan **System** > **Email**

2. **Määritä SMTP-asetukset**
   * Lähtevä sähköpostipalvelin: `smtp.forwardemail.net`
   * Sähköpostipalvelimen portti: `465` (suositeltu) tai `587`
   * Turvallisuus: SSL/TLS (465:lle, suositeltu) tai STARTTLS (587:lle)
   * Käyttäjätunnus: Forward Email -aliasisi
   * Salasana: Luotu salasana kohdasta [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Määritä hälytykset**
   * Mene kohtaan **System** > **Alert Services**
   * Määritä, mitkä hälytykset lähetetään sähköpostitse
   * Aseta vastaanottajien osoitteet ja hälytystasot
   * Testaa asetukset sisäänrakennetulla testitoiminnolla

> \[!IMPORTANT]
> TrueNAS antaa mahdollisuuden määrittää erilaisia hälytystasoja (INFO, NOTICE, WARNING, ERROR, CRITICAL). Valitse sopivat tasot välttääksesi sähköpostispämmiä ja varmistaaksesi, että kriittiset ongelmat raportoidaan.


## OpenMediaVault-asetukset {#openmediavault-configuration}

OpenMediaVault tarjoaa vankat sähköposti-ilmoitusmahdollisuudet verkkokäyttöliittymän kautta. Asennusprosessi on selkeä ja suoraviivainen.

> \[!NOTE]
> OpenMediaVaultin ilmoitusjärjestelmä perustuu lisäosiin. Varmista, että sinulla on sähköposti-ilmoituslisäosa asennettuna ja käytössä.

1. **Avaa ilmoitusasetukset**
   * Avaa OpenMediaVaultin verkkokäyttöliittymä
   * Mene kohtaan **System** > **Notification** > **Email**

2. **Määritä SMTP-parametrit**
   * SMTP-palvelin: `smtp.forwardemail.net`
   * Portti: `465` (SSL/TLS, suositeltu) tai `587` (STARTTLS)
   * Käyttäjätunnus: Forward Email -aliasisi
   * Salasana: Luotu salasana kohdasta [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Ota SSL/TLS käyttöön

3. **Määritä ilmoitussäännöt**
   * Siirry kohtaan **System** > **Notification** > **Notifications**
   * Määritä, mitkä järjestelmätapahtumat laukaisevat sähköpostit
   * Aseta vastaanottajien osoitteet
   * Testaa sähköpostitoiminto

> \[!TIP]
> OpenMediaVault antaa mahdollisuuden määrittää ilmoitusaikatauluja. Voit asettaa hiljaiset ajat tai rajoittaa ilmoitusten tiheyttä välttääksesi ilmoitusten tulvan.


## Raspberry Pi NAS -asetukset {#raspberry-pi-nas-configuration}

Raspberry Pi tarjoaa erinomaisen lähtökohdan NAS-toiminnallisuuteen, tarjoten kustannustehokkaan ratkaisun koti- ja pienyritysympäristöihin. Raspberry Pi:n käyttöönotto NAS-laitteena sisältää tiedostojen jakoprotokollien, sähköposti-ilmoitusten ja olennaisten verkkopalveluiden konfiguroinnin.

> \[!TIP]
> Raspberry Pi -harrastajille suosittelemme lämpimästi täydentämään NAS-asennuksen [PiKVM](https://pikvm.org/) -etähallinnalla ja [Pi-hole](https://pi-hole.net/) -verkkojen mainosten estolla ja DNS-hallinnalla. Nämä työkalut luovat kattavan kotilaboratorioympäristön.
### Alkuperäinen Raspberry Pi -asennus {#initial-raspberry-pi-setup}

Ennen NAS-palveluiden määrittämistä varmista, että Raspberry Pi:ssäsi on uusin Raspberry Pi OS ja riittävästi tallennustilaa. Laadukas microSD-kortti (luokka 10 tai parempi) tai USB 3.0 SSD tarjoaa paremman suorituskyvyn ja luotettavuuden NAS-toimintoihin.

1. **Päivitä järjestelmä** suorittamalla `sudo apt update && sudo apt upgrade -y` varmistaaksesi, että kaikki paketit ovat ajan tasalla.

2. **Ota SSH-käyttöön** komennolla `sudo systemctl enable ssh && sudo systemctl start ssh` etähallintaa varten.

3. **Määritä staattinen IP-osoite** muokkaamalla tiedostoa `/etc/dhcpcd.conf` varmistaaksesi johdonmukaisen verkkoyhteyden.

4. **Ota käyttöön ulkoinen tallennustila** liittämällä ja liittämällä USB-asemat tai määrittämällä RAID-taulukoita datan redundanssia varten.

### Samba-tiedostojen jakamisen määritys {#samba-file-sharing-configuration}

Samba tarjoaa Windows-yhteensopivan tiedostojen jakamisen, jolloin Raspberry Pi on käytettävissä verkon kaikilta laitteilta. Määritysprosessi sisältää Samban asentamisen, jaettujen kansioiden luomisen ja käyttäjätunnistuksen määrittämisen.

Asenna Samba komennolla `sudo apt install samba samba-common-bin` ja määritä pääkonfiguraatiotiedosto `/etc/samba/smb.conf`. Luo jaetut hakemistot ja aseta sopivat käyttöoikeudet komennolla `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Määritä Samba-jaot lisäämällä osiot konfiguraatiotiedostoon jokaiselle jaetulle hakemistolle. Määritä käyttäjätunnistus komennolla `sudo smbpasswd -a käyttäjänimi` luodaksesi Samba-spesifiset salasanat verkon käyttöä varten.

> \[!IMPORTANT]
> Käytä aina vahvoja salasanoja Samba-käyttäjille ja harkitse vieraskäytön sallimista vain ei-sensitiivisille jaetuille kansioille. Tutustu [viralliseen Samba-dokumentaatioon](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) edistyneitä turvallisuusasetuksia varten.

### FTP-palvelimen määritys {#ftp-server-setup}

FTP tarjoaa toisen tavan tiedostojen käyttöön, erityisesti automatisoituihin varmuuskopioihin ja etähallintaan. Asenna ja määritä vsftpd (Very Secure FTP Daemon) luotettavia FTP-palveluita varten.

Asenna vsftpd komennolla `sudo apt install vsftpd` ja määritä palvelu muokkaamalla tiedostoa `/etc/vsftpd.conf`. Ota paikallisten käyttäjien käyttöön pääsy, määritä passiivisen tilan asetukset ja aseta sopivat turvallisuusrajoitukset.

Luo FTP-käyttäjiä ja määritä hakemiston käyttöoikeudet. Harkitse SFTP:n (SSH File Transfer Protocol) käyttöä perinteisen FTP:n sijaan parannetun turvallisuuden vuoksi, koska se salaa kaiken tiedonsiirron.

> \[!CAUTION]
> Perinteinen FTP lähettää salasanat selväkielisinä. Käytä aina SFTP:tä tai määritä FTP TLS-salauksella turvallisia tiedostonsiirtoja varten. Tutustu [vsftpd:n turvallisuuskäytäntöihin](https://security.appspot.com/vsftpd.html) ennen käyttöönottoa.

### Sähköposti-ilmoitusten määritys {#email-notification-configuration}

Määritä Raspberry Pi NAS lähettämään sähköposti-ilmoituksia järjestelmätapahtumista, tallennustilan hälytyksistä ja varmuuskopioinnin valmistumisesta. Tämä sisältää sähköpostin välityspalvelimen asentamisen ja Forward Email -integraation määrittämisen.

Asenna kevyt SMTP-asiakas `msmtp` komennolla `sudo apt install msmtp msmtp-mta`. Luo konfiguraatiotiedosto `/etc/msmtprc` seuraavilla asetuksilla:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Määritä järjestelmäilmoitukset luomalla cron-tehtäviä ja järjestelmän valvontascriptejä, jotka käyttävät `msmtp`-ohjelmaa hälytysten lähettämiseen. Luo skriptejä levyn tilan valvontaan, lämpötilahälytyksiin ja varmuuskopioinnin valmistumisilmoituksiin.

### Edistyneet Raspberry Pi NAS -ominaisuudet {#advanced-raspberry-pi-nas-features}

Paranna Raspberry Pi NAS:ia lisäpalveluilla ja valvontamahdollisuuksilla. Asenna ja määritä verkkovalvontatyökaluja, automatisoituja varmuuskopiointiratkaisuja ja etäkäyttöpalveluita.

Ota käyttöön [Nextcloud](https://nextcloud.com/) pilvimäiseen toiminnallisuuteen, jossa on verkkopohjainen tiedostojen käyttö, kalenterin synkronointi ja yhteistyöominaisuudet. Asenna Dockerin avulla tai virallisen Nextcloud-asennusoppaan mukaisesti Raspberry Pi:lle.
Määritä automatisoidut varmuuskopiot käyttämällä `rsync` ja `cron` luodaksesi ajoitettuja varmuuskopioita kriittisistä tiedoista. Ota käyttöön sähköposti-ilmoitukset varmuuskopioinnin valmistumisesta ja virheistä Forward Email -asetuksesi avulla.

Ota käyttöön verkon valvonta käyttämällä työkaluja kuten [Nagios](https://www.nagios.org/) tai [Zabbix](https://www.zabbix.com/) järjestelmän tilan, verkkoyhteyksien ja palveluiden saatavuuden seuraamiseksi.

> \[!NOTE]
> Verkon infrastruktuuria hallinnoiville käyttäjille kannattaa harkita [Switchbotin](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) integroimista PiKVM-asennukseen etäfyysistä kytkimen hallintaa varten. Tämä [Python-integrointiohje](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) tarjoaa yksityiskohtaiset ohjeet fyysisten laitteiden hallinnan automatisointiin.

### Raspberry Pi -sähköpostin vianmääritys {#raspberry-pi-email-troubleshooting}

Yleisiä ongelmia Raspberry Pi:n sähköpostiasetuksissa ovat DNS-ratkaisun ongelmat, palomuurirajoitukset ja todennusvirheet. Raspberry Pi -järjestelmien kevyt rakenne voi joskus aiheuttaa ajoitusongelmia SMTP-yhteyksissä.

Jos sähköposti-ilmoitukset epäonnistuvat, tarkista `msmtp`-lokitiedosto osoitteesta `/var/log/msmtp.log` saadaksesi yksityiskohtaiset virheilmoitukset. Varmista, että Forward Email -tunnuksesi ovat oikein ja että Raspberry Pi pystyy ratkaisemaan `smtp.forwardemail.net`-osoitteen.

Testaa sähköpostitoiminto komentoriviltä komennolla: `echo "Test message" | msmtp recipient@example.com`. Tämä auttaa erottamaan asetuksiin liittyvät ongelmat sovelluskohtaisista virheistä.

Määritä oikeat DNS-asetukset tiedostossa `/etc/resolv.conf`, jos kohtaat DNS-ratkaisun ongelmia. Harkitse julkisten DNS-palvelimien, kuten `8.8.8.8` tai `1.1.1.1`, käyttöä, jos paikallinen DNS on epäluotettava.

### Suorituskyvyn optimointi {#performance-optimization}

Optimoi Raspberry Pi NAS:n suorituskyky oikeilla tallennus-, verkko- ja järjestelmäresurssien asetuksilla. Käytä laadukkaita tallennuslaitteita ja määritä sopivat tiedostojärjestelmäasetukset käyttötarkoitukseesi.

Ota käyttöön USB 3.0 -käynnistys paremman tallennussuorituskyvyn saavuttamiseksi, jos käytät ulkoisia asemia. Määritä GPU-muistin jako komennolla `sudo raspi-config` allokoidaksesi enemmän RAM-muistia järjestelmätoiminnoille graafisen käsittelyn sijaan.

Seuraa järjestelmän suorituskykyä työkaluilla kuten `htop`, `iotop` ja `nethogs` pullonkaulojen tunnistamiseksi ja resurssien käytön optimoimiseksi. Harkitse päivittämistä Raspberry Pi 4:ään, jossa on 8 Gt RAM-muistia vaativiin NAS-sovelluksiin.

Ota käyttöön asianmukaiset jäähdytysratkaisut estämään lämpötilan aiheuttamaa hidastumista intensiivisten toimintojen aikana. Seuraa suorittimen lämpötilaa komennolla `/opt/vc/bin/vcgencmd measure_temp` ja varmista riittävä ilmanvaihto.

### Turvallisuusnäkökohdat {#security-considerations}

Suojaa Raspberry Pi NAS toteuttamalla asianmukaiset käyttöoikeuksien hallinnat, verkkoturvatoimet ja säännölliset tietoturvapäivitykset. Vaihda oletussalasanat, poista tarpeettomat palvelut käytöstä ja määritä palomuurisäännöt.

Asenna ja määritä `fail2ban` suojaamaan SSH:n ja muiden palveluiden brute force -hyökkäyksiltä. Ota käyttöön automaattiset tietoturvapäivitykset `unattended-upgrades`-työkalulla varmistaaksesi kriittisten tietoturvakorjausten nopean asentamisen.

Määritä verkkosegmentointi eristämään NAS muista verkkolaitteista mahdollisuuksien mukaan. Käytä VPN-yhteyttä etäyhteyksissä sen sijaan, että altistat palveluita suoraan internetiin.

Varmuuskopioi Raspberry Pi -asetukset ja tiedot säännöllisesti estääksesi tietojen menetyksen laitteistovikojen tai tietoturvaongelmien vuoksi. Testaa varmuuskopioiden palautusmenettelyt varmistaaksesi tietojen palautusmahdollisuudet.

Raspberry Pi NAS -konfiguraatio tarjoaa erinomaisen pohjan verkon tallennuskonseptien oppimiseen samalla kun se tarjoaa käytännöllistä toiminnallisuutta koti- ja pienyritysympäristöissä. Yhdistelmä Forward Emailin kanssa takaa luotettavan ilmoitusten toimituksen järjestelmän valvontaa ja ylläpitohälytyksiä varten.
