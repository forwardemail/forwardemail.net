# Täydellinen opas tulostimen, kameran, faksin ja skannerin sähköpostiasetuksiin {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Toimistolaitteidesi täytyy lähettää sähköposteja – tulostimet ilmoittavat värikasetin tasosta, IP-kamerat ilmoittavat liikkeentunnistuksesta, faksit raportoivat lähetyksen tilasta ja skannerit vahvistavat asiakirjojen käsittelyn. Ongelma? Useimmat sähköpostipalveluntarjoajat lopettivat tuen vanhemmille laitteille, jolloin laitteesi eivät pysty lähettämään ilmoituksia.

[Microsoft Office 365 lopetti TLS 1.0- ja TLS 1.1 -tuen tammikuussa 2022](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), mikä rikkoi sähköpostitoiminnan tuhansilla laitteilla. Monet ennen vuotta 2020 valmistetut tulostimet, kamerat ja faksit tukevat vain näitä vanhoja protokollia, eikä niitä voi päivittää.

Forward Email ratkaisee tämän tukemalla sekä moderneja että vanhoja laitteita. Meillä on omat portit nykyisille laitteille ja erityiset vanhojen laitteiden portit, joita ei voi päivittää.

> \[!IMPORTANT]
> Forward Email tukee sekä moderneja että vanhoja laitteita kaksiporttistrategiamme kautta. Käytä porttia `465` (SSL/TLS, suositeltu) tai `587` (STARTTLS) moderneille laitteille, jotka tukevat TLS 1.2+:aa, ja portteja `2455`/`2555` vanhoille laitteille, jotka tukevat vain TLS 1.0:aa.


## Sisällysluettelo {#table-of-contents}

* [TLS-ongelman selitys](#the-tls-problem-explained)
* [Forward Email SMTP -asetusten yleiskatsaus](#forward-email-smtp-configuration-overview)
* [Laaja laiteyhteensopivuusmatriisi](#comprehensive-device-compatibility-matrix)
* [HP-tulostimen sähköpostiasetukset](#hp-printer-email-configuration)
  * [Modernit HP-tulostimet (2020 ja uudemmat)](#modern-hp-printers-2020-and-later)
  * [Vanhemmat HP-tulostimet (ennen 2020)](#legacy-hp-printers-pre-2020-models)
* [Canon-tulostimen sähköpostiasetukset](#canon-printer-email-configuration)
  * [Nykyiset Canon-tulostimet](#current-canon-printers)
  * [Vanhemmat Canon-tulostimet](#legacy-canon-printers)
* [Brother-tulostimen sähköpostiasetukset](#brother-printer-email-configuration)
  * [Brother MFC -sarjan asetukset](#brother-mfc-series-configuration)
  * [Brother-sähköpostiongelmien vianmääritys](#troubleshooting-brother-email-issues)
* [Foscam IP-kameran sähköpostiasetukset](#foscam-ip-camera-email-configuration)
  * [Foscam-sähköpostirajoitusten ymmärtäminen](#understanding-foscam-email-limitations)
  * [Foscam-sähköpostiasetusten vaiheet](#foscam-email-configuration-steps)
  * [Edistyneet Foscam-asetukset](#advanced-foscam-configuration)
* [Hikvision-valvontakameran sähköpostiasetukset](#hikvision-security-camera-email-configuration)
  * [Modernit Hikvision-kameran asetukset](#modern-hikvision-camera-configuration)
  * [Vanhemmat Hikvision-kameran asetukset](#legacy-hikvision-camera-configuration)
* [Dahua-valvontakameran sähköpostiasetukset](#dahua-security-camera-email-configuration)
  * [Dahua-kameran sähköpostiasetukset](#dahua-camera-email-setup)
  * [Dahua NVR:n sähköpostiasetukset](#dahua-nvr-email-configuration)
* [Xerox-monitoimilaitteen sähköpostiasetukset](#xerox-multifunction-device-email-configuration)
  * [Xerox MFD:n sähköpostiasetukset](#xerox-mfd-email-setup)
* [Ricoh-monitoimilaitteen sähköpostiasetukset](#ricoh-multifunction-device-email-configuration)
  * [Modernit Ricoh MFD -asetukset](#modern-ricoh-mfd-configuration)
  * [Vanhemmat Ricoh-laitteet](#legacy-ricoh-device-configuration)
* [Yleisten asetusten vianmääritys](#troubleshooting-common-configuration-issues)
  * [Todennus- ja tunnistetietojen ongelmat](#authentication-and-credential-issues)
  * [TLS- ja salausongelmat](#tls-and-encryption-problems)
  * [Verkkoyhteysongelmat](#network-connectivity-issues)
  * [Laitteiden erityiset asetushaasteet](#device-specific-configuration-challenges)
* [Turvallisuusnäkökohdat ja parhaat käytännöt](#security-considerations-and-best-practices)
  * [Tunnistetietojen hallinta](#credential-management)
  * [Verkkoturvallisuus](#network-security)
  * [Tietovuotoriskit](#information-disclosure)
  * [Valvonta ja ylläpito](#monitoring-and-maintenance)
* [Yhteenveto](#conclusion)
## TLS-ONGELMA SELITETTY {#the-tls-problem-explained}

Tapahtui näin: sähköpostin turvallisuus tiukkeni, mutta laitteesi eivät saaneet siitä tiedotetta. Moderni laitteisto tukee TLS 1.2+:ta, mutta vanhemmat laitteet ovat jumissa TLS 1.0:ssa. Useimmat sähköpostipalveluntarjoajat lopettivat TLS 1.0 -tuen, joten laitteesi eivät voi muodostaa yhteyttä.

Tämä vaikuttaa todelliseen toimintaan – valvontakamerat eivät voi lähettää hälytyksiä tapahtumien aikana, tulostimet eivät voi varoittaa huolto-ongelmista ja faksivahvistukset katoavat. Forward Emailin [SMTP-palvelimen asetukset](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) tarjoavat useita portteja, jotta kaikki toimii.

> \[!TIP]
> Tarkista laitteen laiteohjelmiston versio ja TLS-tuki ennen asetusten määrittämistä. Useimmat vuoden 2020 jälkeen valmistetut laitteet tukevat moderneja TLS-protokollia, kun taas vanhemmat laitteet tarvitsevat yleensä yhteensopivuusportteja.


## Forward Emailin SMTP-asetusten yleiskatsaus {#forward-email-smtp-configuration-overview}

Forward Email tarjoaa kattavan SMTP-palvelun, joka on suunniteltu erityisesti laitteiden sähköpostiasetusten ainutlaatuisten haasteiden ratkaisemiseksi. Infrastruktuurimme tukee useita yhteystyyppejä ja turvallisuustasoja, varmistaen yhteensopivuuden sekä huippuluokan laitteiden että edelleen käytössä olevien vanhempien laitteiden kanssa.

Modernien TLS 1.2+ -tukea omaavien laitteiden kanssa käytä ensisijaista SMTP-palvelintamme smtp.forwardemail.net portilla 465 SSL/TLS-yhteyksiin (suositeltu) tai porttia 587 STARTTLS-yhteyksiin. Nämä portit tarjoavat yritystason turvallisuuden ja ovat yhteensopivia kaikkien nykyisten laiteohjelmistoversioiden kanssa.

Vain TLS 1.0 -tukea omaavat vanhemmat laitteet voivat käyttää erikoistuneita yhteensopivuusporttejamme. Portti 2455 tarjoaa SSL/TLS-yhteyden TLS 1.0 -tuella, kun taas portti 2555 tarjoaa STARTTLS-yhteyden vanhemman protokollan yhteensopivuudella. Nämä portit ylläpitävät mahdollisimman korkeaa turvallisuutta varmistaen samalla vanhemman laitteiston toimivuuden.

Todennus vaaditaan kaikissa yhteyksissä käyttäen Forward Email -aliasiasi käyttäjänimenä ja [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains) -sivulta luotua salasanaa. Tämä lähestymistapa tarjoaa vahvan turvallisuuden säilyttäen laajan yhteensopivuuden eri laitetodennusjärjestelmien kanssa.

> \[!CAUTION]
> Älä koskaan käytä tilisi kirjautumissalasanaa SMTP-todennukseen. Käytä aina laiteasetuksissa [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains) -sivulta luotua salasanaa.


## Kattava laiteyhteensopivuusmatriisi {#comprehensive-device-compatibility-matrix}

Ymmärtäminen, mitkä laitteet tarvitsevat vanhempaa tukea ja mitkä modernia asetusta, auttaa virtaviivaistamaan asennusprosessia ja varmistaa luotettavan sähköpostin toimituksen koko laite-ekosysteemissäsi.

| Laitekategoriat           | Moderni TLS-tuki    | Vanhempi TLS vaaditaan | Suositellut portit | Yleiset ongelmat                                                                                                                                     | Asennusopas/Kuvakaappaukset                                                                                                                      |
| ------------------------- | ------------------- | ---------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| HP-tulostimet (2020+)     | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | [Sertifikaatin validointi](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707) | [HP LaserJet Pro MFP -asennusopas](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                                  |
| HP-tulostimet (ennen 2020) | ❌                  | ✅ Vain TLS 1.0         | `2455`, `2555`     | [Laiteohjelmistorajoitukset](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                                   | [Skannaa sähköpostiin -toiminto-opas](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                                |
| Canon-tulostimet (nykyiset) | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | [Todennuksen asetukset](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358)       | [Canon SMTP-todennusopas](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                                           |
| Canon-tulostimet (vanhat) | ❌                  | ✅ Vain TLS 1.0         | `2455`, `2555`     | [Sertifikaattiongelmat](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)        | [Edistyneet sähköpostiasetukset -opas](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                    |
| Brother-tulostimet (nykyiset) | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | [Porttiasetukset](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                          | [Brother SMTP-asennusopas](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)                    |
| Epson-tulostimet (nykyiset) | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | Verkkokäyttöliittymän käyttö                                                                                                                        | [Epsonin sähköpostihälytyksen asennus](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm)  |
| Foscam IP-kamerat          | ❌                  | ✅ Vain TLS 1.0         | `2455`, `2555`     | [Sertifikaatin validointi](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                        | [Foscam sähköpostiasennuksen UKK](https://www.foscam.com/faqs/view.html?id=63)                                                                  |
| Hikvision (2020+)          | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | SSL-vaatimukset                                                                                                                                      | [Hikvision sähköpostiasennusopas](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (vanhat)         | ❌                  | ✅ Vain TLS 1.0         | `2455`, `2555`     | Laiteohjelmistopäivitykset                                                                                                                          | [Vanhan Hikvisionin asetukset](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf)   |
| Dahua-kamerat (nykyiset)  | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | Todennus                                                                                                                                             | [Dahua sähköpostiasennuswiki](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                      |
| Xerox MFD:t (nykyiset)    | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | [TLS-asetukset](https://www.support.xerox.com/en-us/article/KB0032169)                                                                              | [Xerox TLS-asennusopas](https://www.support.xerox.com/en-us/article/KB0032169)                                                                   |
| Ricoh MFD:t (nykyiset)    | ✅ TLS 1.2+         | ❌                      | `465`, `587`       | SSL-asennus                                                                                                                                          | [Ricoh sähköpostiasetukset](https://www.ricoh.com/info/2025/0526_1)                                                                             |
| Ricoh MFD:t (vanhat)      | ❌                  | ✅ Vain TLS 1.0         | `2455`, `2555`     | [Perustodennuksen ongelmat](https://www.ricoh.com/info/2025/0526_1)                                                                                 | [Vanhan Ricohin asennus](https://www.ricoh.com/info/2025/0526_1)                                                                                 |
Tämä matriisi tarjoaa nopean viitteen oikean konfigurointitavan määrittämiseksi laitteillesi. Epävarmuustilanteissa aloita moderneista porteista ja siirry vanhempiin portteihin, jos yhteysongelmia ilmenee.

> \[!NOTE]
> Laitteen ikä ei aina ole luotettava TLS-tuen indikaattori. Jotkut valmistajat ovat tuoneet TLS 1.2 -tuen vanhempiin malleihin laiteohjelmistopäivitysten kautta, kun taas toiset ovat lopettaneet tuen vanhemmille tuotteille.


## HP-tulostimen sähköpostikonfiguraatio {#hp-printer-email-configuration}

HP-tulostimet muodostavat yhden suurimmista verkkoon liitettyjen tulostuslaitteiden asennuskannoista, malleina nykyiset LaserJet Pro -sarjan laitteet, joissa on täysi TLS 1.3 -tuki, sekä vanhemmat mallit, jotka tukevat vain TLS 1.0:aa. Konfigurointiprosessi vaihtelee merkittävästi modernien ja vanhempien laitteiden välillä, mikä vaatii erilaisia lähestymistapoja optimaalisen yhteensopivuuden saavuttamiseksi.

### Modernit HP-tulostimet (2020 ja uudemmat) {#modern-hp-printers-2020-and-later}

Modernit HP-tulostimet sisältävät LaserJet Pro MFP M404 -sarjan, Color LaserJet Pro MFP M479 -sarjan ja uudemmat mallit, jotka tukevat nykyisiä TLS-standardeja. Nämä laitteet tarjoavat kattavat sähköpostihälytysmahdollisuudet HP:n Embedded Web Server (EWS) -käyttöliittymän kautta.

1. **Avaa tulostimen verkkokäyttöliittymä** kirjoittamalla tulostimen IP-osoite verkkoselaimeen. IP-osoitteen löydät tulostamalla verkon konfiguraatiosivun tulostimen ohjauspaneelista.

2. **Siirry Verkko-välilehdelle** ja valitse "Email Server" tai "SMTP Settings" tulostinmallistasi riippuen. Joissakin HP-tulostimissa nämä asetukset löytyvät kohdasta "System" > "Email Alerts."

3. **Määritä SMTP-palvelimen asetukset** syöttämällä palvelimen osoitteeksi `smtp.forwardemail.net`. Valitse salausmenetelmäksi "SSL/TLS" ja porttinumeroiksi `465` luotettavimman yhteyden varmistamiseksi.

4. **Ota käyttöön todennus** aktivoimalla SMTP-todennus ja syöttämällä Forward Email -alias käyttäjänimeksi. Käytä salasanaa, joka on luotu kohdasta [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains), älä tilin kirjautumissalasanaa.

5. **Määritä lähettäjän tiedot** syöttämällä Forward Email -alias "From"-osoitteeksi ja kuvaava nimi, kuten "HP Printer - Office", jotta ilmoitusten lähde on helposti tunnistettavissa.

6. **Lisää vastaanottajien osoitteet** lisäämällä enintään viisi sähköpostiosoitetta, jotka saavat tulostimen ilmoitukset. HP-tulostimet sallivat eri ilmoitustyyppien lähettämisen eri vastaanottajille.

7. **Testaa konfiguraatio** käyttämällä HP:n sisäänrakennettua sähköpostin testitoimintoa. Tulostin lähettää testiviestin varmistaakseen, että kaikki asetukset ovat oikein ja yhteys Forward Emailin palvelimiin toimii.

> \[!TIP]
> HP-tulostimet tallentavat usein DNS-haut välimuistiin. Jos kohtaat yhteysongelmia, käynnistä tulostin uudelleen konfiguroinnin jälkeen tyhjentääksesi välimuistissa olevat DNS-tiedot.

### Vanhemmat HP-tulostimet (ennen 2020 malleja) {#legacy-hp-printers-pre-2020-models}

Vanhemmat HP-tulostimet, kuten LaserJet Pro MFP M277 ja vastaavat mallit, tukevat usein vain TLS 1.0:aa ja vaativat erityiskonfiguroinnin toimiakseen nykyaikaisten sähköpostipalveluntarjoajien kanssa. Nämä laitteet näyttävät usein "TLS certificate verification failed" -virheitä, kun ne yrittävät muodostaa yhteyttä tavallisiin SMTP-portteihin.

1. **Avaa tulostimen Embedded Web Server** kirjoittamalla tulostimen IP-osoite verkkoselaimeen. Vanhemmat HP-tulostimet saattavat vaatia Internet Explorerin tai yhteensopivuustilan täyden toiminnallisuuden saavuttamiseksi.

2. **Siirry Verkko- tai Järjestelmäasetuksiin** ja etsi "Email" tai "SMTP" -konfiguraatio-osio. Tarkka sijainti vaihtelee mallin ja laiteohjelmistoversion mukaan.

3. **Määritä Forward Emailin vanhat SMTP-asetukset** syöttämällä palvelimen osoitteeksi smtp.forwardemail.net. Tämä on ratkaisevan tärkeää – käytä porttia 2455 SSL/TLS-yhteyksiin tai porttia 2555 STARTTLS-yhteyksiin tavallisten porttien sijaan.

4. **Ota käyttöön todennus** aktivoimalla SMTP-todennus ja syöttämällä Forward Email -alias käyttäjänimeksi. Käytä luomaasi Forward Email -salasanaa todennukseen.

5. **Määritä salausasetukset** huolellisesti. Valitse "SSL/TLS", jos käytät porttia 2455, tai "STARTTLS", jos käytät porttia 2555. Joissakin vanhemmissa HP-tulostimissa nämä vaihtoehdot voivat olla nimetty eri tavalla.
6. **Aseta lähettäjän ja vastaanottajan tiedot** käyttämällä Forward Email -aliasiasi lähettäjän osoitteena ja määrittämällä sopivat vastaanottajaosoitteet ilmoituksia varten.

7. **Testaa asetukset** käyttämällä tulostimen testitoimintoa. Jos testi epäonnistuu varmennevirheiden vuoksi, varmista, että käytät oikeita legacy-portteja (2455 tai 2555) tavallisten SMTP-porttien sijaan.

> \[!CAUTION]
> Legacy HP -tulostimet eivät välttämättä saa laiteohjelmistopäivityksiä, jotka korjaavat TLS-yhteensopivuusongelmia. Jos asetusten määrittäminen epäonnistuu edelleen, harkitse paikallisen SMTP-välipalvelimen käyttöä väliaikaisena ratkaisuna.


## Canon-tulostimen sähköpostiasetukset {#canon-printer-email-configuration}

Canon-tulostimet tarjoavat kattavat sähköposti-ilmoitusominaisuudet imageRUNNER-, PIXMA- ja MAXIFY-tuotesarjoissaan. Nykyaikaiset Canon-laitteet tukevat laajoja TLS-määrityksiä, kun taas legacy-mallit saattavat vaatia erityisiä yhteensopivuusasetuksia toimiakseen nykyisten sähköpostipalveluntarjoajien kanssa.

### Nykyiset Canon-tulostimet {#current-canon-printers}

Nykyaikaiset Canon-tulostimet tarjoavat laajat sähköposti-ilmoitusominaisuudet Remote UI -verkkokäyttöliittymän kautta, tukien kaikkea perusilmoituksista yksityiskohtaisiin laitteen hallintailmoituksiin.

1. **Avaa Remote UI** kirjoittamalla tulostimen IP-osoite verkkoselaimeen. Canon-tulostimet käyttävät yleensä verkkopohjaista käyttöliittymää kaikkiin verkkoasetuksiin.

2. **Siirry kohtaan Asetukset/Rekisteröinti** ja valitse valikosta "Laitteen hallinta". Etsi "Sähköposti-ilmoitusasetukset" tai vastaavia vaihtoehtoja tulostinmallistasi riippuen.

3. **Määritä SMTP-palvelin** napsauttamalla "Lisää kohde" ja kirjoittamalla smtp.forwardemail.net palvelinosoitteeksi. Valitse salausmenetelmäksi "SSL" tai "TLS".

4. **Aseta porttinumero** arvoon 465 SSL/TLS-yhteyksille (suositeltu) tai 587 STARTTLS-yhteyksille. Canon-tulostimet erottelevat selkeästi nämä salausmenetelmät käyttöliittymässään.

5. **Määritä todennus** ottamalla SMTP-todennus käyttöön ja syöttämällä Forward Email -alias käyttäjänimeksi. Käytä salasanaa, jonka olet luonut kohdassa [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains).

6. **Aseta lähettäjän tiedot** kirjoittamalla Forward Email -alias lähettäjän osoitteeksi ja määrittämällä kuvaava näyttönimi ilmoitusten helppoa tunnistamista varten.

7. **Määritä ilmoitustyypit** valitsemalla, mitkä tapahtumat laukaisevat sähköposti-ilmoitukset. Canon-tulostimet tukevat tarkkaa hallintaa ilmoitustyypeistä, mukaan lukien virhetilanteet, huoltoilmoitukset ja turvallisuustapahtumat.

8. **Testaa sähköpostiasetukset** käyttämällä Canonin sisäänrakennettua testitoimintoa. Tulostin lähettää testiviestin varmistaakseen asetusten ja yhteyden toimivuuden.

> \[!NOTE]
> Canon-tulostimet antavat usein yksityiskohtaisia virheilmoituksia, jotka auttavat vianmäärityksessä. Kiinnitä huomiota erityisiin virhekoodiin nopeamman ongelmanratkaisun vuoksi.

### Legacy Canon -tulostimet {#legacy-canon-printers}

Vanhemmat Canon-tulostimet saattavat tukea TLS:ää rajoitetusti ja vaativat huolellista asetusten määrittämistä toimiakseen nykyaikaisten sähköpostipalveluntarjoajien kanssa. Näissä laitteissa tarvitaan usein legacy-yhteensopivia SMTP-asetuksia sähköposti-ilmoitusten toimivuuden varmistamiseksi.

1. **Avaa tulostimen verkkokäyttöliittymä** käyttämällä laitteen IP-osoitetta. Legacy Canon -tulostimet saattavat vaatia erityisiä selaimen yhteensopivuusasetuksia täyden toiminnallisuuden saavuttamiseksi.

2. **Siirry sähköpostiasetuksiin** laitteen hallinta- tai verkkoasetusten valikon kautta. Tarkka polku vaihtelee mallin ja laiteohjelmistoversion mukaan.

3. **Määritä Forward Emailin legacy SMTP -asetukset** kirjoittamalla palvelinosoitteeksi smtp.forwardemail.net ja käyttämällä porttia 2455 SSL-yhteyksille tai porttia 2555 STARTTLS-yhteyksille.

4. **Määritä todennus huolellisesti** ottamalla SMTP-todennus käyttöön ja käyttämällä Forward Email -aliasiasi ja luotua salasanaa. Legacy Canon -tulostimilla voi olla erityisiä todennusvaatimuksia.

5. **Määritä salausasetukset** valitsemalla valitsemallesi portille sopiva TLS-vaihtoehto. Varmista, että salausmenetelmä vastaa portin asetusta (SSL portille 2455, STARTTLS portille 2555).
6. **Testaa asetukset** ja seuraa varmenteen vahvistusvirheitä. Jos ongelmat jatkuvat, varmista, että käytät Forward Emailin legacy-yhteensopivia portteja tavallisten SMTP-porttien sijaan.

> \[!WARNING]
> Jotkut vanhemmat Canon-tulostimet eivät välttämättä tue palvelimen varmenteen vahvistusta. Vaikka tämä heikentää turvallisuutta, se voi olla tarpeen sähköpostitoiminnan jatkumiseksi vanhemmilla laitteilla.


## Brother-tulostimen sähköpostiasetukset {#brother-printer-email-configuration}

Brother-tulostimet, erityisesti MFC- ja DCP-sarjat, tarjoavat laajat skannaus-sähköpostiin ja ilmoituksiin liittyvät ominaisuudet. Monet käyttäjät kuitenkin raportoivat haasteita sähköpostitoimintojen asetuksissa, erityisesti Office 365:n ja muiden nykyaikaisten sähköpostipalveluntarjoajien kanssa, jotka ovat poistaneet käytöstä vanhat todennusmenetelmät.

### Brother MFC -sarjan asetukset {#brother-mfc-series-configuration}

Brother-monitoimitulostimet tarjoavat laajat sähköpostiominaisuudet, mutta asetusten määrittäminen voi olla monimutkaista käytettävissä olevien todennus- ja salausvaihtoehtojen vuoksi.

1. **Avaa tulostimen verkkokäyttöliittymä** kirjoittamalla tulostimen IP-osoite verkkoselaimeen. Brother-tulostimet tarjoavat kattavan verkkopohjaisen asetusten hallinnan.

2. **Siirry Verkkoasetuksiin** ja valitse "Email/IFAX" tai "Scan to Email" tulostinmallistasi riippuen. Joillakin Brother-tulostimilla nämä asetukset löytyvät "Järjestelmänvalvojan asetukset" alta.

3. **Määritä SMTP-palvelimen asetukset** syöttämällä palvelimen osoitteeksi smtp.forwardemail.net. Brother-tulostimet tukevat sekä SSL/TLS- että STARTTLS-salausmenetelmiä.

4. **Valitse oikea portti ja salaus** valitsemalla portti 465 SSL/TLS-salauksella (suositeltu) tai portti 587 STARTTLS-salauksella. Brother-tulostimet merkitsevät nämä vaihtoehdot selkeästi käyttöliittymässään.

5. **Määritä SMTP-todennus** ottamalla todennus käyttöön ja syöttämällä Forward Email -alias käyttäjänimeksi. Käytä salasanaa, jonka olet luonut kohdassa [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Aseta lähettäjän tiedot** määrittämällä Forward Email -alias lähettäjäosoitteeksi ja lisäämällä kuvaava nimi, jolla tunnistat tulostimen sähköposti-ilmoituksissa.

7. **Määritä skannaus-sähköpostiin asetukset** luomalla osoitekirjamerkinnät ja oletusskannausasetukset. Brother-tulostimet mahdollistavat laajan skannausparametrien ja vastaanottajien hallinnan.

8. **Testaa sekä sähköposti-ilmoitukset että skannaus-sähköpostitoiminto** varmistaaksesi, että asetukset ovat kunnossa. Brother-tulostimilla on erilliset testitoiminnot eri sähköpostiominaisuuksille.

> \[!TIP]
> Brother-tulostimet vaativat usein laiteohjelmistopäivityksiä sähköpostiasetusten ongelmien ratkaisemiseksi. Tarkista päivitykset ennen yhteysongelmien vianmääritystä.

### Brother-sähköpostiongelmien vianmääritys {#troubleshooting-brother-email-issues}

Brother-tulostimilla esiintyy usein tiettyjä asetuksiin liittyviä haasteita, jotka voidaan ratkaista kohdennetulla vianmäärityksellä.

Jos Brother-tulostimesi näyttää "Authentication Failed" -virheitä sähköpostiasetuksia testatessa, varmista, että käytät Forward Email -aliasiasi (et tilisi sähköpostiosoitetta) käyttäjänimenä ja salasanaa, jonka olet luonut kohdassa [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains). Brother-tulostimet ovat erityisen tarkkoja todennustietojen muotoilun suhteen.

Jos tulostin ei hyväksy skannaus-sähköpostin asetuksia, kokeile määrittää asetukset verkkokäyttöliittymän kautta tulostimen ohjauspaneelin sijaan. Verkkokäyttöliittymä tarjoaa usein yksityiskohtaisempia virheilmoituksia ja asetuksia.

SSL/TLS-yhteysvirheiden kohdalla varmista, että käytät oikeaa portti- ja salausyhdistelmää. Brother-tulostimet vaativat tarkkaa vastaavuutta porttien ja salausmenetelmien välillä – portti 465 käyttää SSL/TLS:ää (suositeltu), kun taas portti 587 käyttää STARTTLS:ää.

> \[!CAUTION]
> Joillakin Brother-tulostinmalleilla on tunnettuja ongelmia tiettyjen SMTP-palvelinasetusten kanssa. Jos tavalliset asetukset eivät toimi, tutustu Brotherin tukidokumentaatioon mallikohtaisten ratkaisujen löytämiseksi.
## Foscam IP-kameran sähköpostiasetukset {#foscam-ip-camera-email-configuration}

Foscam IP-kamerat edustavat yhtä haastavimmista laitekategoriosta sähköpostiasetusten kannalta niiden laajasti käytössä olevien vanhentuneiden TLS-protokollien ja rajallisen laiteohjelmistopäivitysten saatavuuden vuoksi. Useimmat Foscam-kamerat, mukaan lukien suositut mallit kuten R2-sarja, tukevat vain TLS 1.0 -protokollaa, eikä niitä voi päivittää tukemaan nykyaikaisia salausstandardeja.

### Foscam-sähköpostirajoitusten ymmärtäminen {#understanding-foscam-email-limitations}

Foscam-kamerat aiheuttavat ainutlaatuisia haasteita, jotka vaativat erityisiä konfigurointitapoja. Yleisin virheilmoitus on "TLS certificate verification failed: unable to get local issuer certificate", joka tarkoittaa, että kamera ei pysty vahvistamaan useimpien sähköpostipalveluntarjoajien käyttämiä moderneja SSL-varmenteita.

Tämä ongelma johtuu useista tekijöistä: vanhentuneista varmennevarastoista, joita ei voi päivittää, rajallisesta TLS-protokollatuesta, joka rajoittuu TLS 1.0:aan, sekä laiteohjelmiston rajoituksista, jotka estävät suojausprotokollien päivitykset. Lisäksi monet Foscam-mallit ovat saavuttaneet elinkaarensa lopun eivätkä enää saa laiteohjelmistopäivityksiä, jotka voisivat ratkaista yhteensopivuusongelmia.

Forward Emailin vanhat SMTP-portit on suunniteltu erityisesti näiden rajoitusten ratkaisemiseksi säilyttäen TLS 1.0 -yhteensopivuuden ja tarjoten samalla mahdollisimman korkean turvallisuustason näille vanhemmille laitteille.

### Foscam-sähköpostiasetusten vaiheet {#foscam-email-configuration-steps}

Sähköpostihälytysten konfigurointi Foscam-kameroissa vaatii huolellista porttivalintaa ja salausasetusten säätämistä laitteen TLS-rajoitusten kiertämiseksi.

1. **Avaa kameran verkkokäyttöliittymä** kirjoittamalla kameran IP-osoite verkkoselaimeen. Foscam-kamerat käyttävät tyypillisesti porttia 88 verkkokäyttöliittymään (esim. <http://192.168.1.100:88>).

2. **Siirry Asetukset-valikkoon** ja valitse "Mail Service" tai "Email Settings" kameramallisi mukaan. Joissakin Foscam-kameroissa nämä asetukset löytyvät kohdasta "Alarm" > "Mail Service".

3. **Määritä SMTP-palvelin** syöttämällä smtp.forwardemail.net palvelinosoitteeksi. Tämä on kriittistä – älä käytä tavallisten sähköpostipalveluntarjoajien SMTP-palvelimia, koska ne eivät enää tue TLS 1.0:aa.

4. **Aseta portti ja salaus** valitsemalla portti 2455 SSL-salaukselle tai portti 2555 STARTTLS-salaukselle. Nämä ovat Forward Emailin vanhat yhteensopivat portit, jotka on suunniteltu erityisesti Foscam-kameroille.

5. **Määritä todennus** ottamalla SMTP-todennus käyttöön ja syöttämällä Forward Email -alias käyttäjänimeksi. Käytä salasanaa, jonka olet luonut kohdassa [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Aseta lähettäjän ja vastaanottajan tiedot** määrittämällä Forward Email -alias lähettäjäosoitteeksi ja lisää vastaanottajien osoitteet liikkeentunnistusta ja järjestelmäilmoituksia varten.

7. **Määritä ilmoitusten laukaisimet** asettamalla liikkeentunnistuksen herkkyys, tallennusaikataulut ja muut tapahtumat, jotka laukaisevat sähköpostihälytykset.

8. **Testaa sähköpostiasetukset** käyttämällä Foscamin sisäänrakennettua testitoimintoa. Jos testi onnistuu, saat testisähköpostin, joka vahvistaa asetusten toimivuuden.

> \[!IMPORTANT]
> Foscam-kamerat vaativat Forward Emailin vanhat portit (2455 tai 2555) TLS 1.0 -rajoitusten vuoksi. Tavalliset SMTP-portit eivät toimi näiden laitteiden kanssa.

### Edistyneet Foscam-asetukset {#advanced-foscam-configuration}

Käyttäjille, jotka tarvitsevat monipuolisempia ilmoitusasetuksia, Foscam-kamerat tarjoavat lisäkonfigurointimahdollisuuksia, jotka voivat parantaa turvallisuusvalvonnan tehokkuutta.

Määritä liikkeentunnistusalueet vähentääksesi vääriä hälytyksiä rajaamalla kameran näkökentän tietyt alueet, jotka laukaisevat ilmoitukset. Tämä estää tarpeettomia sähköposteja ympäristötekijöistä, kuten liikkuvista puista tai ohiajavista ajoneuvoista.

Aseta tallennusaikataulut vastaamaan valvontatarpeitasi varmistaen, että sähköpostihälytykset lähetetään sopivina ajankohtina. Foscam-kamerat voivat estää ilmoitukset määriteltyinä aikoina estääkseen ei-kriittiset yöhälytykset.
Määritä useita vastaanottajaosoitteita eri tyyppisille hälytyksille, jolloin voit ohjata liikkeentunnistushälytykset turvallisuushenkilöstölle ja järjestelmän ylläpitohälytykset IT-henkilöstölle.

> \[!TIP]
> Foscam-kamerat voivat tuottaa merkittävän määrän sähköposteja, jos liikkeentunnistus on liian herkkä. Aloita konservatiivisilla asetuksilla ja säädä ympäristösi ominaisuuksien mukaan.


## Hikvision-valvontakameran sähköpostiasetukset {#hikvision-security-camera-email-configuration}

Hikvision-kamerat muodostavat merkittävän osan maailmanlaajuisesta valvontakameramarkkinasta, ja malleja on perus-IP-kameroista edistyneisiin tekoälypohjaisiin valvontajärjestelmiin. Sähköpostiasetusten määrittelyprosessi vaihtelee huomattavasti uusien TLS-tukea sisältävien mallien ja yhteensopivuusratkaisuja vaativien vanhempien laitteiden välillä.

### Modernin Hikvision-kameran asetukset {#modern-hikvision-camera-configuration}

Nykyiset Hikvision-kamerat, joissa on uudempi laiteohjelmisto, tukevat TLS 1.2+:aa ja tarjoavat kattavat sähköpostihälytysmahdollisuudet verkkopohjaisen käyttöliittymän kautta.

1. **Kirjaudu kameran verkkokäyttöliittymään** syöttämällä kameran IP-osoite verkkoselaimeen. Hikvision-kamerat käyttävät tyypillisesti standardeja HTTP/HTTPS-portteja verkkokäyttöön.

2. **Siirry kohtaan Configuration** ja valitse valikosta "Network" > "Advanced Settings" > "Email". Tarkka polku voi vaihdella kameramallin ja laiteohjelmistoversion mukaan.

3. **Määritä SMTP-palvelin** syöttämällä smtp.forwardemail.net palvelinosoitteeksi. Hikvision-kamerat vaativat erityisen SSL-konfiguraation sähköpostitoiminnallisuuden varmistamiseksi.

4. **Aseta salaus SSL:ksi** ja määritä portiksi 465. Hikvision-kamerat eivät tue STARTTLS:ää, joten SSL-salaus portissa 465 on suositeltu asetelma Forward Emailin yhteensopivuuden takaamiseksi.

5. **Ota SMTP-todennus käyttöön** ja syötä Forward Email -alias käyttäjänimeksi. Käytä [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) -sivulta luotua salasanaa todennukseen.

6. **Määritä lähettäjätiedot** asettamalla Forward Email -alias lähettäjäosoitteeksi ja lisäämällä kuvaava nimi kameran tunnistamiseksi sähköpostihälytyksissä.

7. **Lisää vastaanottajaosoitteet** lisäämällä sähköpostiosoitteet, jotka saavat turvallisuushälytykset, liikkeentunnistushälytykset ja järjestelmän tilapäivitykset.

8. **Määritä tapahtumakytkimet** asettamalla liikkeentunnistus, linjan ylityksen tunnistus, tunkeutumisen tunnistus ja muut tapahtumat, jotka laukaisevat sähköpostihälytykset.

9. **Testaa sähköpostiasetukset** käyttämällä Hikvisionin sisäänrakennettua testitoimintoa varmistaaksesi yhteyden ja todennuksen toimivuuden Forward Emailin palvelimien kanssa.

> \[!NOTE]
> Hikvision-kamerat vaativat uusimmat laiteohjelmistoversiot SSL- ja TLS-salauksen asianmukaiseen tukeen. Tarkista laiteohjelmistopäivitykset ennen sähköpostiasetusten määrittämistä.

### Vanhemman Hikvision-kameran asetukset {#legacy-hikvision-camera-configuration}

Vanhemmat Hikvision-kamerat saattavat tukea TLS:ää rajoitetusti ja vaativat Forward Emailin legacy-yhteensopivat SMTP-portit sähköpostitoiminnallisuuden ylläpitämiseksi.

1. **Kirjaudu kameran verkkokäyttöliittymään** ja siirry sähköpostiasetuksiin. Vanhemmissa Hikvision-kameroissa valikkorakenne voi poiketa nykyisistä malleista.

2. **Määritä Forward Emailin legacy SMTP -asetukset** syöttämällä smtp.forwardemail.net palvelinosoitteeksi ja käyttämällä porttia 2455 SSL-yhteyksille.

3. **Ota todennus käyttöön** käyttäen Forward Email -aliasiasi ja luotua salasanaa. Vanhemmilla Hikvision-kameroilla voi olla erityisiä todennusvaatimuksia tai rajoituksia.

4. **Määritä salausasetukset** valitsemalla SSL-salaus legacy-portin 2455 vaatimusten mukaisesti. Varmista, että salausmenetelmä vastaa portin vaatimuksia.

5. **Testaa asetukset** ja seuraa mahdollisia yhteysvirheitä. Vanhemmat Hikvision-kamerat voivat tarjota rajallista virheraportointia, mikä vaikeuttaa vianetsintää.

> \[!WARNING]
> Vanhemmissa Hikvision-kameroissa voi olla tunnettuja tietoturva-aukkoja. Varmista, että nämä laitteet ovat asianmukaisesti eristettyinä verkossasi ja harkitse päivitystä nykyisiin malleihin, kun se on mahdollista.
## Dahua-valvontakameran sähköpostiasetukset {#dahua-security-camera-email-configuration}

Dahua-kamerat tarjoavat vankat sähköposti-ilmoitusominaisuudet laajassa tuotevalikoimassaan, perus IP-kameroista edistyneisiin tekoälypohjaisiin valvontajärjestelmiin. Määrityksen tekeminen on yleensä suoraviivaista nykyaikaisilla laitteilla, ja ne tukevat kattavasti nykyisiä TLS-standardeja.

### Dahua-kameran sähköpostin asetukset {#dahua-camera-email-setup}

Dahua-kamerat tarjoavat käyttäjäystävällisen sähköpostiasetusten määrittelyn verkkokäyttöliittymän kautta, ja ne ovat hyvin yhteensopivia nykyaikaisten SMTP-standardien kanssa.

1. **Kirjaudu kameran verkkokäyttöliittymään** kirjoittamalla kameran IP-osoite verkkoselaimeen. Dahua-kamerat tarjoavat tyypillisesti intuitiiviset verkkopohjaiset määritysjärjestelmät.

2. **Siirry kohtaan Setup** ja valitse asetuksista "Network" > "Email". Dahua-kamerat järjestävät sähköpostiasetukset omaan osioonsa helppoa käyttöä varten.

3. **Määritä SMTP-palvelin** kirjoittamalla palvelimen osoitteeksi smtp.forwardemail.net. Dahua-kamerat tukevat sekä SSL- että STARTTLS-salausmenetelmiä.

4. **Aseta portti ja salaus** valitsemalla portti 465 SSL/TLS-salauksella (suositeltu) tai portti 587 STARTTLS-salauksella.

5. **Ota SMTP-todennus käyttöön** ja syötä Forward Email -alias käyttäjänimeksi. Käytä salasanaa, jonka olet luonut kohdassa [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Määritä lähettäjän tiedot** asettamalla Forward Email -alias lähettäjän osoitteeksi ja lisäämällä kuvaava nimi kameran tunnistamiseksi.

7. **Lisää vastaanottajien osoitteet** eri ilmoitustyypeille. Dahua-kamerat tukevat useita vastaanottajia eri hälytysten varalta.

8. **Määritä tapahtumakytkimet** asettamalla liikkeentunnistus, häirintäilmoitukset ja muut turvallisuustapahtumat, jotka laukaisevat sähköposti-ilmoitukset.

9. **Testaa sähköpostitoiminto** käyttämällä Dahuan sisäänrakennettua testitoimintoa varmistaaksesi oikean määrityksen ja yhteyden.

> \[!TIP]
> Dahua-kamerat tarjoavat usein yksityiskohtaiset määritysohjeet wiki-dokumentaationsa kautta. Katso [Dahuan sähköpostiasetusten opas](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) mallikohtaisia ohjeita varten.

### Dahua NVR:n sähköpostiasetukset {#dahua-nvr-email-configuration}

Dahua Network Video Recorderit (NVR) tarjoavat keskitetyn sähköposti-ilmoitusten hallinnan useille kameroille, mahdollistaen tehokkaan suuren valvontajärjestelmän hallinnan.

1. **Kirjaudu NVR:n verkkokäyttöliittymään** kirjoittamalla NVR:n IP-osoite verkkoselaimeen. Dahua NVR:t tarjoavat kattavat hallintaliittymät koko järjestelmän asetuksiin.

2. **Siirry sähköpostiasetuksiin** valitsemalla päävalikosta "Setup" > "Network" > "Email". NVR:t järjestävät sähköpostiasetukset tyypillisesti järjestelmätasolle.

3. **Määritä SMTP-palvelimen asetukset** kirjoittamalla palvelimeksi smtp.forwardemail.net ja valitsemalla portti 465 SSL/TLS-salauksella (suositeltu) tai portti 587 STARTTLS:llä.

4. **Ota käyttöön todennus** käyttämällä Forward Email -aliasiasi ja luomaasi salasanaa. NVR:t tukevat standardeja SMTP-todennusmenetelmiä.

5. **Määritä ilmoitusaikataulut** asettamalla ajanjaksot, jolloin sähköposti-ilmoitukset ovat aktiivisia. Tämä auttaa hallitsemaan ilmoitusmäärää hiljaisempina aikoina.

6. **Määritä tapahtumapohjaiset ilmoitukset** valitsemalla, mitkä kameratapahtumat laukaisevat sähköposti-ilmoitukset. NVR:t mahdollistavat tarkat asetukset ilmoituskytkimille useille kameroille.

7. **Testaa koko järjestelmän sähköpostiasetukset** varmistaaksesi toimivuuden kaikilla liitetyillä kameroilla ja valvontajärjestelmillä.


## Xerox-monitoimilaitteen sähköpostiasetukset {#xerox-multifunction-device-email-configuration}

Xerox-monitoimilaitteet tarjoavat yritystason sähköposti-ilmoitusominaisuudet kattavalla TLS-tuella ja edistyneillä määritysmahdollisuuksilla. Nykyaikaiset Xerox-laitteet tukevat nykyisiä turvallisuusstandardeja säilyttäen yhteensopivuuden erilaisissa verkkoympäristöissä.

### Xerox MFD:n sähköpostiasetukset {#xerox-mfd-email-setup}

Xerox-monitoimilaitteet tarjoavat kehittyneet sähköpostiasetukset verkkopohjaisen hallintaliittymän kautta, tukien sekä perusilmoituksia että edistynyttä työnkulkuintegraatiota.
1. **Siirry laitteen verkkokäyttöliittymään** kirjoittamalla laitteen IP-osoite verkkoselaimeen. Xerox-laitteet tarjoavat tyypillisesti kattavat verkkopohjaiset hallintatyökalut.

2. **Siirry kohtaan Ominaisuudet** ja valitse asetuksista "Yhteydet" > "Protokollat" > "SMTP". Xerox-laitteet järjestävät sähköpostiasetukset protokollien konfigurointiosioon.

3. **Määritä SMTP-palvelin** kirjoittamalla palvelimen osoitteeksi smtp.forwardemail.net. Xerox-laitteet tukevat konfiguroitavia TLS-versioita ja salausmenetelmiä.

4. **Aseta TLS-konfiguraatio** valitsemalla TLS 1.2 tai uudempi vähimmäistukevaksi versioksi. Xerox-laitteet antavat ylläpitäjille mahdollisuuden määrittää tarkat TLS-vaatimukset parannetun turvallisuuden takaamiseksi.

5. **Määritä portti ja salaus** asettamalla portiksi 465 SSL/TLS-yhteyksille (suositeltu) tai portti 587 STARTTLS-yhteyksille.

6. **Ota SMTP-todennus käyttöön** aktivoimalla todennus ja kirjoittamalla käyttäjänimeksi Forward Email -alias. Käytä salasanaa, jonka loit kohdassa [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains).

7. **Määritä lähettäjätiedot** asettamalla Forward Email -alias lähettäjäosoitteeksi ja määrittämällä sopivat vastausosoitteet ilmoitusten hallintaa varten.

8. **Määritä ilmoitustyypit** konfiguroimalla, mitkä laitteen tapahtumat laukaisevat sähköposti-ilmoitukset, mukaan lukien huoltoilmoitukset, virhetilanteet ja turvallisuustapahtumat.

9. **Testaa sähköpostiasetukset** käyttämällä Xeroxin kattavaa testijärjestelmää varmistaaksesi yhteyden ja todennuksen toimivuuden.

> \[!NOTE]
> Xerox-laitteet tarjoavat yksityiskohtaiset TLS-konfigurointivaihtoehdot, jotka mahdollistavat turvallisuusasetusten hienosäädön. Katso lisätietoja [Xeroxin TLS-konfigurointiohjeesta](https://www.support.xerox.com/en-us/article/KB0032169) edistyneitä turvallisuusvaatimuksia varten.


## Ricoh-monitoimilaitteen sähköpostiasetukset {#ricoh-multifunction-device-email-configuration}

Ricoh-monitoimilaitteet tarjoavat vahvat sähköpostiominaisuudet laajassa tuotevalikoimassaan, perustoimistotulostimista edistyneisiin tuotantojärjestelmiin. Kuitenkin [Ricoh on ilmoittanut merkittävistä muutoksista](https://www.ricoh.com/info/2025/0526_1) liittyen Microsoftin perusautentikoinnin lopettamiseen, mikä vaikuttaa sähköpostitoimintoihin.

### Moderni Ricoh MFD -konfiguraatio {#modern-ricoh-mfd-configuration}

Nykyiset Ricoh-laitteet tukevat moderneja TLS-standardeja ja tarjoavat kattavat sähköposti-ilmoitusmahdollisuudet verkkopohjaisen käyttöliittymän kautta.

1. **Siirry laitteen verkkokäyttöliittymään** kirjoittamalla laitteen IP-osoite verkkoselaimeen. Ricoh-laitteet tarjoavat intuitiiviset verkkopohjaiset konfigurointijärjestelmät.

2. **Siirry sähköpostiasetuksiin** valitsemalla valikosta "Järjestelmäasetukset" > "Ylläpitäjän työkalut" > "Verkko" > "Sähköposti".

3. **Määritä SMTP-palvelin** kirjoittamalla palvelimen osoitteeksi smtp.forwardemail.net. Ricoh-laitteet tukevat sekä SSL- että STARTTLS-salausmenetelmiä.

4. **Ota SSL käyttöön SMTP-palvelinsivulla** aktivoidaksesi TLS-salauksen. Ricohin käyttöliittymä voi olla kryptinen, mutta SSL:n aktivointi on välttämätöntä turvallisen sähköpostitoiminnon takaamiseksi.

5. **Aseta porttinumero** portiksi 465 SSL/TLS-yhteyksille (suositeltu) tai 587 STARTTLS-yhteyksille. Varmista, että salausmenetelmä vastaa valittua porttia.

6. **Määritä SMTP-todennus** ottamalla todennus käyttöön ja kirjoittamalla käyttäjänimeksi Forward Email -alias. Käytä salasanaa, jonka loit kohdassa [Oma tili -> Domainit -> Aliakset](https://forwardemail.net/my-account/domains).

7. **Määritä lähettäjätiedot** asettamalla Forward Email -alias lähettäjäosoitteeksi ja lisäämällä sopivat tunnistetiedot.

8. **Määritä ilmoitustyypit** konfiguroimalla skannaus-sähköpostiin, laitteen hälytykset ja huoltoilmoitukset toimintavaatimustesi mukaisesti.

9. **Testaa sähköpostitoiminto** käyttämällä Ricohin sisäänrakennettua testijärjestelmää varmistaaksesi oikean konfiguraation ja yhteyden.

> \[!IMPORTANT]
> Microsoftin perusautentikoinnin muutoksista kärsivät Ricoh-laitteet tarvitsevat päivitettyjä todennusmenetelmiä. Varmista, että laitteesi laiteohjelmisto tukee moderneja todennuksia tai käytä Forward Emailin yhteensopivuusominaisuuksia.
### Legacy Ricoh -laitteen asetukset {#legacy-ricoh-device-configuration}

Vanhemmat Ricoh-laitteet saattavat vaatia Forward Emailin legacy-yhteensopivia SMTP-portteja rajoitetun TLS-tuen ja todennusmenetelmärajoitusten vuoksi.

1. **Siirry laitteen verkkokäyttöliittymään** ja mene sähköpostiasetusten kohtaan. Legacy Ricoh -laitteissa voi olla erilaiset valikkorakenteet kuin nykyisissä malleissa.

2. **Määritä Forward Emailin legacy SMTP -asetukset** syöttämällä palvelimen osoitteeksi smtp.forwardemail.net ja käyttämällä porttia 2455 SSL-yhteyksille.

3. **Ota SSL-salaus käyttöön** vastaamaan legacy-porttiasetuksia. Varmista, että salausasetukset vastaavat portin 2455 vaatimuksia.

4. **Määritä todennus** käyttämällä Forward Email -aliasiasi ja luotua salasanaa. Legacy Ricoh -laitteissa voi olla erityisiä todennusrajoituksia.

5. **Testaa asetukset** ja seuraa todennus- tai yhteysvirheitä. Legacy-laitteet saattavat tarjota rajallisesti virheraportointia vianmääritystä varten.


## Yleisten asetusten ongelmien vianmääritys {#troubleshooting-common-configuration-issues}

Laitteen sähköpostiasetuksissa voi ilmetä erilaisia ongelmia verkkoasetusten, todennusongelmien tai protokollayhteensopivuushaasteiden vuoksi. Yleisten ongelmien ja niiden ratkaisujen ymmärtäminen auttaa varmistamaan luotettavan ilmoitusten toimituksen laiteympäristössäsi.

### Todennus- ja tunnistetietojen ongelmat {#authentication-and-credential-issues}

Todennusvirheet ovat yleisin sähköpostiasetusten ongelma kaikentyyppisissä laitteissa. Nämä ongelmat johtuvat tyypillisesti virheellisistä tunnistetiedoista, todennusmenetelmän yhteensopimattomuudesta tai tilin asetusten ongelmista.

Varmista, että käytät Forward Email -aliasiasi käyttäjänimenä, et tilisi sähköpostiosoitetta tai kirjautumistunnuksia. Monet laitteet ovat herkkiä käyttäjänimen muotoilulle ja vaativat täsmällisen vastaavuuden määritettyyn aliasiin.

Varmista, että käytät luotua salasanaa osoitteesta [Oma tili -> Domainit -> Aliasit](https://forwardemail.net/my-account/domains) etkä tilisi kirjautumissalasanaa. SMTP-todennus vaatii turvallisuussyistä juuri luodun salasanan, ja väärien tunnistetietojen käyttö johtaa todennusvirheisiin.

Tarkista, että Forward Email -tililläsi on asianmukainen SMTP-käyttöoikeus käytössä ja että kaksivaiheisen todennuksen vaatimukset on määritetty oikein. Joissakin tiliasetuksissa SMTP-käyttöoikeus voi olla rajoitettu, kunnes se on aktivoitu oikein.

> \[!TIP]
> Jos todennus epäonnistuu edelleen, luo uusi SMTP-salasana osoitteessa [Oma tili -> Domainit -> Aliasit](https://forwardemail.net/my-account/domains) ja päivitä laitteen asetukset uusilla tunnistetiedoilla.

### TLS- ja salausongelmat {#tls-and-encryption-problems}

TLS-ongelmat ilmenevät usein, kun laitteet yrittävät käyttää tukemattomia salausprotokollia tai kun porttiasetukset ja salausasetukset eivät vastaa toisiaan.

Nykyisissä laitteissa, joissa esiintyy TLS-virheitä, varmista, että käytät oikeaa portti- ja salausyhdistelmää: portti 465 SSL/TLS:llä (suositeltu) tai portti 587 STARTTLS:llä. Näiden asetusten on vastattava tarkasti, jotta yhteydet onnistuvat.

Legacy-laitteissa, joissa esiintyy varmenteen vahvistusvirheitä, tulisi käyttää Forward Emailin yhteensopivia portteja (2455 tai 2555) tavallisten SMTP-porttien sijaan. Nämä portit ylläpitävät TLS 1.0 -yhteensopivuutta tarjoten samalla asianmukaisen suojauksen vanhemmille laitteille.

Jos varmenteen vahvistus epäonnistuu edelleen legacy-laitteissa, tarkista, sallitaanko laitteen asetuksissa varmenteen vahvistuksen poistaminen käytöstä. Vaikka tämä heikentää turvallisuutta, se voi olla tarpeen toimivuuden jatkamiseksi laitteissa, joita ei voi päivittää.

> \[!CAUTION]
> Varmenteen vahvistuksen poistaminen käytöstä heikentää turvallisuutta, eikä sitä tulisi käyttää kuin viimeisenä keinona legacy-laitteissa, joita ei voi päivittää tai korvata.

### Verkkoyhteysongelmat {#network-connectivity-issues}

Verkkoyhteyksiin liittyvät ongelmat voivat estää laitteita saavuttamasta Forward Emailin SMTP-palvelimia, vaikka asetukset olisivat oikein.

Varmista, että verkossasi sallitaan lähtevät yhteydet määritetyille SMTP-porteille. Yritysten palomuurit tai rajoittavat verkkopolitiikat voivat estää tiettyjä portteja, jolloin palomuurisääntöjä on muutettava tai käytettävä vaihtoehtoisia porttiasetuksia.
Tarkista DNS-resoluutio varmistamalla, että laitteesi voivat ratkaista smtp.forwardemail.net oikeisiin IP-osoitteisiin. DNS-ongelmat voivat aiheuttaa yhteysvirheitä, vaikka verkkoyhteys muuten toimisi.

Testaa verkkoyhteys laitteen verkkodiagnostiikkatyökaluilla, jos saatavilla. Monet nykyaikaiset laitteet tarjoavat sisäänrakennettuja verkkotestausominaisuuksia, jotka voivat auttaa tunnistamaan yhteysongelmia.

Ota huomioon verkkoviive ja aikakatkaisuasetukset, jos laitteet sijaitsevat hitaita tai korkeaviiveisiä verkkoyhteyksiä käyttävissä verkoissa. Jotkut laitteet saattavat vaatia aikakatkaisujen säätämistä luotettavaa sähköpostin toimitusta varten.

### Laitteiden erityiset konfigurointiongelmat {#device-specific-configuration-challenges}

Eri laitevalmistajat toteuttavat sähköpostitoiminnallisuuden eri tavoin, mikä johtaa valmistajakohtaisiin konfigurointiongelmiin, jotka vaativat kohdennettuja ratkaisuja.

HP-tulostimet saattavat välimuistittaa DNS-kyselyjä ja vaativat uudelleenkäynnistyksen konfigurointimuutosten jälkeen. Jos yhteysongelmat jatkuvat konfiguroinnin jälkeen, käynnistä tulostin uudelleen välimuistissa olevan verkkotiedon tyhjentämiseksi.

Brother-tulostimet ovat erityisen herkkiä todennustietojen muotoilulle ja saattavat vaatia konfiguroinnin verkkokäyttöliittymän kautta luotettavaa asetusta varten laitteen ohjauspaneelin sijaan.

Foscam-kamerat vaativat erityisiä porttiasetuksia TLS-rajoitusten vuoksi eivätkä välttämättä tarjoa yksityiskohtaisia virheilmoituksia vianmääritykseen. Varmista, että käytät Forward Emailin vanhempia portteja (2455 tai 2555) näille laitteille.

Hikvision-kamerat vaativat SSL-salauksen eivätkä tue STARTTLS:ää, mikä rajoittaa konfigurointivaihtoehdot porttiin 465 SSL/TLS-salauksella.

> \[!NOTE]
> Kun ratkaiset laitekohtaisia ongelmia, tutustu valmistajan dokumentaatioon tunnetuista rajoituksista tai konfigurointivaatimuksista, jotka voivat vaikuttaa sähköpostitoiminnallisuuteen.


## Turvallisuusnäkökohdat ja parhaat käytännöt {#security-considerations-and-best-practices}

Sähköpostihälytysten konfigurointi verkkolaitteissa sisältää useita turvallisuusnäkökohtia, jotka auttavat suojaamaan järjestelmiäsi samalla kun varmistetaan luotettava hälytysten toimitus. Turvallisuuden parhaita käytäntöjä noudattamalla estetään luvaton pääsy ja varmistetaan asianmukainen tiedon paljastaminen hälytyksissä.

### Tunnistetietojen hallinta {#credential-management}

Käytä vahvoja, yksilöllisiä salasanoja Forward Email -tilillesi ja ota käyttöön kaksivaiheinen tunnistautuminen, jos saatavilla. Luotu SMTP-salasana tulee käsitellä arkaluontoisena tunnistetietona ja säilyttää turvallisesti laitekonfiguraatioissa.

Tarkista ja vaihda SMTP-salasanat säännöllisesti, erityisesti henkilöstömuutosten tai turvallisuuspoikkeamien jälkeen. Forward Email mahdollistaa salasanan uudelleenluonnin vaikuttamatta muihin tilin toimintoihin.

Vältä jaettujen tunnistetietojen käyttöä useissa laitteissa, jos mahdollista. Vaikka Forward Email tukee useiden laitteiden yhdistämistä samoilla tunnuksilla, yksittäiset laitetunnukset tarjoavat paremman turvallisuuseristyksen ja auditointimahdollisuudet.

Dokumentoi laitteiden tunnistetiedot turvallisesti ja sisällytä ne organisaatiosi tunnistetietojen hallintajärjestelmään. Asianmukainen dokumentointi varmistaa, että sähköpostikonfiguraatiot voidaan ylläpitää ja päivittää tarpeen mukaan.

### Verkon turvallisuus {#network-security}

Ota käyttöön asianmukainen verkkosegmentointi eristääksesi laitteet muista verkkoresursseista samalla kun ylläpidät tarvittavaa yhteyttä sähköpostihälytyksiä ja laillista pääsyä varten.

Konfiguroi palomuurisäännöt sallimaan tarvittava SMTP-liikenne ja estämään tarpeeton verkkoyhteys. Laitteet tarvitsevat tyypillisesti vain lähtevän pääsyn Forward Emailin SMTP-palvelimille hälytystoiminnallisuutta varten.

Seuraa laitteiden verkkoliikennettä tunnistaaksesi epätavalliset kuviot tai luvattomat yhteydenottopyynnöt. Odottamaton verkkotoiminta voi viitata turvallisuusongelmiin, jotka vaativat tutkimista.

Harkitse VLANien tai omistettujen verkkosegmenttien käyttöä laitehallintaliikenteelle, mukaan lukien sähköpostihälytykset, lisäturvallisuuden eristämiseksi.

### Tiedon paljastaminen {#information-disclosure}

Tarkista sähköpostihälytysten sisältö varmistaaksesi, etteivät ne sisällä arkaluontoista tietoa, josta hyökkääjät voisivat hyötyä. Jotkut laitteet sisältävät yksityiskohtaista järjestelmätietoa, verkkokonfiguraatioita tai tiedostopolkuja hälytyssähköposteissa.
Määritä ilmoitusten suodatus rajoittamaan sähköposti-ilmoituksiin sisällytettävien tietotyyppien määrää. Monet laitteet sallivat ilmoitussisällön mukauttamisen hyödyllisen tiedon ja turvallisuusvaatimusten tasapainottamiseksi.

Ota käyttöön asianmukaiset sähköpostin säilytys- ja käsittelykäytännöt laiteilmoituksille. Turvallisuuteen liittyvät ilmoitukset saatetaan joutua säilyttämään vaatimustenmukaisuuden tai rikostutkinnan vuoksi.

Ota huomioon vastaanottajien sähköpostiosoitteiden arkaluonteisuus ja varmista, että ilmoitukset lähetetään vain valtuutetuille henkilöille, joilla on oikeus saada tiedot.

### Valvonta ja ylläpito {#monitoring-and-maintenance}

Testaa säännöllisesti sähköposti-ilmoitusasetuksia varmistaaksesi niiden jatkuvan toimivuuden. Ajoittainen testaus auttaa havaitsemaan asetusten muuttumisen, verkkoympäristön muutokset tai palveluongelmat ennen kuin ne vaikuttavat kriittisten hälytysten toimitukseen.

Seuraa sähköposti-ilmoitusten kuvioita epäilyttävän toiminnan tai luvattomien pääsyyritysten merkkien varalta. Epätavalliset ilmoitusmäärät tai odottamattomat järjestelmätapahtumat voivat viitata turvallisuusongelmiin.

Pidä laitteiden laiteohjelmisto ajan tasalla mahdollisuuksien mukaan ylläpitääksesi nykyisiä turvallisuusstandardeja ja protokollatukea. Vaikka jotkut laitteet ovat saavuttaneet elinkaarensa lopun, saatavilla olevien tietoturvapäivitysten asentaminen auttaa suojaamaan tunnetuilta haavoittuvuuksilta.

Ota käyttöön varailmoitusmenetelmät kriittisille hälytyksille, kun se on mahdollista. Vaikka sähköposti-ilmoitukset ovat luotettavia, vaihtoehtoisten hälytysmenetelmien olemassaolo tarjoaa redundanssia tärkeimmille järjestelmätapahtumille.


## Yhteenveto {#conclusion}

Luotettavien sähköposti-ilmoitusten määrittäminen monipuolisissa laiteympäristöissä vaatii ymmärrystä TLS-yhteensopivuuden, todennusmenetelmien ja valmistajakohtaisten vaatimusten monimutkaisesta kentästä. Forward Emailin kattava SMTP-palvelu vastaa näihin haasteisiin tarjoamalla sekä nykyaikaiset turvallisuusstandardit nykyisille laitteille että yhteensopivuuden vanhemmille laitteille, joita ei voi päivittää.

Tässä oppaassa kuvatut määritysvaiheet tarjoavat yksityiskohtaiset, vaiheittaiset ohjeet suurille laitekategoriolle, varmistaen, että ylläpitäjät voivat luoda luotettavat sähköposti-ilmoitukset riippumatta heidän laitevalikoimastaan. Forward Emailin kaksikanavainen strategia vastaa erityisesti TLS-yhteensopivuuskriisiin, joka vaikuttaa miljooniin käytössä oleviin laitteisiin, tarjoten käytännöllisen ratkaisun, joka ylläpitää turvallisuutta ja varmistaa toimivuuden.

Sähköposti-ilmoitusasetusten säännöllinen testaus ja ylläpito varmistavat jatkuvan luotettavuuden ja auttavat tunnistamaan mahdolliset ongelmat ennen kuin ne vaikuttavat kriittisten hälytysten toimitukseen. Oppaan turvallisuuskäytäntöjen ja vianmääritysohjeiden noudattaminen auttaa ylläpitämään turvallisia ja luotettavia ilmoitusjärjestelmiä, jotka pitävät ylläpitäjät ajan tasalla laitteiden tilasta ja turvallisuustapahtumista.

Olipa kyseessä pieni toimisto, jossa on sekoitus tulostin- ja kameramerkkejä, tai yritysympäristö, jossa on satoja laitteita, Forward Email tarjoaa infrastruktuurin ja yhteensopivuuden luotettaville sähköposti-ilmoituksille. Palvelumme keskittyminen laiteyhteensopivuuteen yhdistettynä kattavaan dokumentaatioon ja tukeen varmistaa, että kriittiset järjestelmähälytykset tavoittavat sinut silloin, kun niitä eniten tarvitset.

Lisätukea laitteiden sähköpostiasetuksiin tai kysymyksiä Forward Emailin yhteensopivuudesta tiettyjen laitteiden kanssa varten löydät [SMTP-palvelimen määritysohjeista](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) tai ota yhteyttä tukitiimiimme. Olemme sitoutuneet auttamaan sinua ylläpitämään luotettavia sähköposti-ilmoituksia kaikissa verkkoon liitetyissä laitteissasi, iästä tai valmistajarajoituksista riippumatta.
