# Complete gids voor NAS e-mailinstellingen met Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Het instellen van e-mailmeldingen op je NAS hoeft geen gedoe te zijn. Of je nu een Synology, QNAP of zelfs een Raspberry Pi gebruikt, deze gids zorgt ervoor dat je apparaat met Forward Email communiceert zodat je daadwerkelijk weet wanneer er iets misgaat.

De meeste NAS-apparaten kunnen e-mailwaarschuwingen versturen bij schijffouten, temperatuurwaarschuwingen, voltooiing van back-ups en beveiligingsgebeurtenissen. Het probleem? Veel e-mailproviders zijn streng geworden op het gebied van beveiliging, en oudere apparaten kunnen vaak niet meer meekomen. Daar komt Forward Email om de hoek kijken - wij ondersteunen zowel moderne als oudere apparaten.

Deze gids behandelt de e-mailinstellingen voor meer dan 75 NAS-providers met stapsgewijze instructies, compatibiliteitsinformatie en tips voor probleemoplossing. Ongeacht welk apparaat je gebruikt, wij zorgen dat je meldingen werken.


## Inhoudsopgave {#table-of-contents}

* [Waarom je NAS e-mailmeldingen nodig hebt](#why-you-need-nas-email-notifications)
* [Het TLS-probleem (en hoe wij het oplossen)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP-instellingen](#forward-email-smtp-settings)
* [Uitgebreide compatibiliteitsmatrix voor NAS-providers](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS e-mailconfiguratie](#synology-nas-email-configuration)
  * [Configuratiestappen](#configuration-steps)
* [QNAP NAS e-mailconfiguratie](#qnap-nas-email-configuration)
  * [Configuratiestappen](#configuration-steps-1)
  * [Veelvoorkomende QNAP-problemen oplossen](#common-qnap-troubleshooting-issues)
* [ReadyNAS legacy-configuratie](#readynas-legacy-configuration)
  * [Legacy configuratiestappen](#legacy-configuration-steps)
  * [ReadyNAS probleemoplossing](#readynas-troubleshooting)
* [TerraMaster NAS-configuratie](#terramaster-nas-configuration)
* [ASUSTOR NAS-configuratie](#asustor-nas-configuration)
* [Buffalo TeraStation-configuratie](#buffalo-terastation-configuration)
* [Western Digital My Cloud-configuratie](#western-digital-my-cloud-configuration)
* [TrueNAS e-mailconfiguratie](#truenas-email-configuration)
* [OpenMediaVault-configuratie](#openmediavault-configuration)
* [Raspberry Pi NAS-configuratie](#raspberry-pi-nas-configuration)
  * [Eerste Raspberry Pi setup](#initial-raspberry-pi-setup)
  * [Samba-bestandsdeling configuratie](#samba-file-sharing-configuration)
  * [FTP-server setup](#ftp-server-setup)
  * [E-mailmeldingen configureren](#email-notification-configuration)
  * [Geavanceerde Raspberry Pi NAS-functies](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi e-mail probleemoplossing](#raspberry-pi-email-troubleshooting)
  * [Prestatieoptimalisatie](#performance-optimization)
  * [Beveiligingsoverwegingen](#security-considerations)


## Waarom je NAS e-mailmeldingen nodig hebt {#why-you-need-nas-email-notifications}

Je NAS houdt van alles in de gaten - schijfgezondheid, temperatuur, netwerkproblemen, beveiligingsgebeurtenissen. Zonder e-mailwaarschuwingen kunnen problemen wekenlang onopgemerkt blijven, wat mogelijk dataverlies of beveiligingsinbreuken veroorzaakt.

E-mailmeldingen geven je directe waarschuwingen wanneer schijven beginnen te falen, waarschuwen voor ongeautoriseerde toegangspogingen, bevestigen succesvolle back-ups en houden je op de hoogte van de systeemstatus. Forward Email zorgt ervoor dat deze kritieke meldingen je daadwerkelijk bereiken.


## Het TLS-probleem (en hoe wij het oplossen) {#the-tls-problem-and-how-we-fix-it}

Dit is het probleem: als je NAS van vóór 2020 is, ondersteunt deze waarschijnlijk alleen TLS 1.0. Gmail, Outlook en de meeste providers zijn daar jaren geleden mee gestopt. Je apparaat probeert e-mail te versturen, wordt geweigerd, en je blijft in het ongewisse.

Forward Email lost dit op met dual-port ondersteuning. Moderne apparaten gebruiken onze standaardpoorten (`465` en `587`), terwijl oudere apparaten onze legacy-poorten (`2455` en `2555`) kunnen gebruiken die nog TLS 1.0 ondersteunen.

> \[!IMPORTANT]
> Forward Email ondersteunt zowel moderne als legacy NAS-apparaten via onze dual-port strategie. Gebruik poorten 465/587 voor moderne apparaten met TLS 1.2+ ondersteuning, en poorten 2455/2555 voor legacy apparaten die alleen TLS 1.0 ondersteunen.


## Forward Email SMTP-instellingen {#forward-email-smtp-settings}
Hier is wat je moet weten over onze SMTP-configuratie:

**Voor moderne NAS-apparaten (2020+):** Gebruik `smtp.forwardemail.net` met poort `465` (SSL/TLS) of poort `587` (STARTTLS). Deze werken met de huidige firmware die TLS 1.2+ ondersteunt.

**Voor oudere NAS-apparaten:** Gebruik `smtp.forwardemail.net` met poort `2455` (SSL/TLS) of poort `2555` (STARTTLS). Deze ondersteunen TLS 1.0 voor legacy-apparaten.

**Authenticatie:** Gebruik je Forward Email-alias als gebruikersnaam en het gegenereerde wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains) (niet je accountwachtwoord).

> \[!CAUTION]
> Gebruik nooit je accountloginwachtwoord voor SMTP-authenticatie. Gebruik altijd het gegenereerde wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains) voor NAS-configuratie.

> \[!TIP]
> Controleer de firmwareversie en TLS-ondersteuning van je NAS-apparaat voordat je gaat configureren. De meeste apparaten die na 2020 zijn vervaardigd ondersteunen moderne TLS-protocollen, terwijl oudere apparaten meestal legacy-compatibiliteitspoorten vereisen.


## Uitgebreide NAS-provider compatibiliteitsmatrix {#comprehensive-nas-provider-compatibility-matrix}

De volgende matrix biedt gedetailleerde compatibiliteitsinformatie voor grote NAS-providers, inclusief TLS-ondersteuningsniveaus, firmwarestatus en aanbevolen Forward Email-configuratie-instellingen.

| NAS Provider     | Huidige Modellen | TLS-ondersteuning | Firmwarestatus | Aanbevolen Poorten | Veelvoorkomende Problemen                                                                                                                               | Installatiehandleiding/Screenshots                                                                                                              |
| ---------------- | ---------------- | ----------------- | -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x          | TLS 1.2+          | Actief         | `465`, `587`       | [STARTTLS-configuratie](https://community.synology.com/enu/forum/2/post/124584)                                                                         | [DSM E-mailmeldingen instellen](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                              |
| QNAP             | QTS 5.x          | TLS 1.2+          | Actief         | `465`, `587`       | [Meldingscentrum-fouten](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)       | [QTS E-mailserverconfiguratie](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS  | TLS 1.2+          | Actief         | `465`, `587`       | [DNS-resolutieproblemen](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                     | [Raspberry Pi E-mailconfiguratiehandleiding](#raspberry-pi-nas-configuration)                                                                  |
| ASUSTOR          | ADM 4.x          | TLS 1.2+          | Actief         | `465`, `587`       | [Certificaatvalidatie](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                            | [ASUSTOR Meldingsconfiguratie](https://www.asustor.com/en/online/online_help?id=8)                                                              |
| TerraMaster      | TOS 6.x          | TLS 1.2           | Actief         | `465`, `587`       | [SMTP-authenticatie](https://www.terra-master.com/global/forum/)                                                                                        | [TerraMaster E-mailconfiguratie](https://www.terra-master.com/global/support/download.php)                                                       |
| TrueNAS          | SCALE/CORE       | TLS 1.2+          | Actief         | `465`, `587`       | [SSL-certificaatinstelling](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                          | [TrueNAS E-mailconfiguratiehandleiding](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)         |
| Buffalo          | TeraStation      | TLS 1.2           | Beperkt        | `465`, `587`       | [Firmwarecompatibiliteit](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)          | [TeraStation E-mailconfiguratie](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)  |
| Western Digital  | My Cloud OS 5    | TLS 1.2           | Beperkt        | `465`, `587`       | [Legacy OS-compatibiliteit](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                | [My Cloud E-mailconfiguratie](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                      |
| OpenMediaVault   | OMV 7.x          | TLS 1.2+          | Actief         | `465`, `587`       | [Plugin-afhankelijkheden](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                    | [OMV Meldingsconfiguratie](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                 |
| Netgear ReadyNAS | OS 6.x           | Alleen TLS 1.0    | Uitgefaseerd   | `2455`, `2555`     | [Legacy TLS-ondersteuning](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                      | [ReadyNAS E-mailwaarschuwingconfiguratie](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) |
| Drobo            | Dashboard        | TLS 1.2           | Uitgefaseerd   | `465`, `587`       | [Beperkte ondersteuning](https://myprojects.drobo.com/support/)                                                                                         | [Drobo E-mailmeldingen](https://www.drobo.com/support/)                                                                                         |
Deze matrix toont de duidelijke scheiding tussen moderne, actief onderhouden NAS-systemen en legacy-apparaten die speciale compatibiliteitsoverwegingen vereisen. De meerderheid van de huidige NAS-apparaten ondersteunt moderne TLS-standaarden en kan de primaire SMTP-poorten van Forward Email gebruiken zonder speciale configuratie.


## Synology NAS E-mailconfiguratie {#synology-nas-email-configuration}

Synology-apparaten met DSM zijn vrij eenvoudig in te stellen. Ze ondersteunen moderne TLS, dus je kunt onze standaardpoorten zonder problemen gebruiken.

> \[!NOTE]
> Synology DSM 7.x biedt de meest uitgebreide e-mailmeldingsfuncties. Oudere DSM-versies kunnen beperkte configuratieopties hebben.

### Configuratiestappen {#configuration-steps}

1. **Toegang tot de DSM-webinterface** door het IP-adres van je NAS-apparaat of QuickConnect-ID in een webbrowser in te voeren.

2. **Ga naar Configuratiescherm** en selecteer de sectie "Meldingen", klik vervolgens op het tabblad "E-mail" om de e-mailconfiguratie-opties te openen.

3. **Schakel e-mailmeldingen in** door het selectievakje "E-mailmeldingen inschakelen" aan te vinken.

4. **Configureer de SMTP-server** door `smtp.forwardemail.net` als serveradres in te voeren.

5. **Stel de poortconfiguratie in** op poort 465 voor SSL/TLS-verbindingen (aanbevolen). Poort 587 met STARTTLS wordt ook ondersteund als alternatief.

6. **Configureer authenticatie** door "SMTP-authenticatie vereist" te selecteren en je Forward Email-alias in te voeren in het gebruikersnaamveld.

7. **Voer je wachtwoord in** met het wachtwoord dat is gegenereerd via [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains).

8. **Stel ontvangeradressen in** door maximaal vijf e-mailadressen in te voeren die meldingen moeten ontvangen.

9. **Configureer meldingsfiltering** om te bepalen welke gebeurtenissen e-mailwaarschuwingen activeren, zodat je meldingenoverload voorkomt en toch kritieke gebeurtenissen worden gerapporteerd.

10. **Test de configuratie** met de ingebouwde testfunctie van DSM om te verifiëren dat alle instellingen correct zijn en de communicatie met de servers van Forward Email goed werkt.

> \[!TIP]
> Synology staat verschillende meldingssoorten toe voor verschillende ontvangers, wat flexibiliteit biedt in hoe waarschuwingen binnen je team worden verspreid.


## QNAP NAS E-mailconfiguratie {#qnap-nas-email-configuration}

QNAP-apparaten met QTS werken uitstekend met Forward Email. Ze ondersteunen moderne TLS en hebben een mooie webinterface voor configuratie.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 had een bekend probleem met e-mailmeldingen dat [opgelost is in QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Zorg dat je firmware is bijgewerkt om meldingsfouten te voorkomen.

### Configuratiestappen {#configuration-steps-1}

1. **Toegang tot de webinterface van je QNAP-apparaat** door het IP-adres in een webbrowser in te voeren.

2. **Ga naar het Configuratiescherm** en selecteer "Service Account and Device Pairing", klik vervolgens op de sectie "E-mail" om met de e-mailconfiguratie te beginnen.

3. **Klik op "Add SMTP Service"** om een nieuwe e-mailconfiguratie aan te maken.

4. **Configureer de SMTP-server** door `smtp.forwardemail.net` als SMTP-serveradres in te voeren.

5. **Selecteer het juiste beveiligingsprotocol** - kies "SSL/TLS" met poort `465` (aanbevolen). Poort `587` met STARTTLS wordt ook ondersteund.

6. **Configureer het poortnummer** - poort `465` met SSL/TLS wordt aanbevolen. Poort `587` met STARTTLS is ook beschikbaar indien nodig.

7. **Voer je authenticatiegegevens in** met je Forward Email-alias als gebruikersnaam en je gegenereerde wachtwoord via [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains).

8. **Configureer afzenderinformatie** door een beschrijvende naam in te voeren voor het veld "Van", zoals "QNAP NAS System" of de hostnaam van je apparaat.

9. **Stel ontvangeradressen in** voor verschillende meldingssoorten. QNAP staat toe meerdere ontvangersgroepen te configureren voor verschillende waarschuwingstypen.

10. **Test de configuratie** met de ingebouwde e-mailtestfunctie van QNAP om te verifiëren dat alle instellingen correct werken.

> \[!TIP]
> Als je [problemen ondervindt met Gmail SMTP-configuratie](https://forum.qnap.com/viewtopic.php?t=152466), gelden dezelfde stappen voor het oplossen van problemen ook voor Forward Email. Zorg dat authenticatie correct is ingeschakeld en de inloggegevens kloppen.
> \[!NOTE]
> QNAP-apparaten ondersteunen geavanceerde meldingsplanning, waarmee je stille uren kunt instellen waarin niet-kritieke meldingen worden onderdrukt. Dit is vooral handig in zakelijke omgevingen.

### Veelvoorkomende QNAP-problemen bij het oplossen {#common-qnap-troubleshooting-issues}

Als je QNAP-apparaat [geen meldings-e-mails verstuurt](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), controleer dan het volgende:

* Controleer of je Forward Email-inloggegevens correct zijn
* Zorg ervoor dat het SMTP-serveradres exact `smtp.forwardemail.net` is
* Bevestig dat de poort overeenkomt met je versleutelingsmethode (`465` voor SSL/TLS wordt aanbevolen; `587` voor STARTTLS wordt ook ondersteund)
* Controleer of je [SMTP-serverconfiguratie](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) de verbinding toestaat


## ReadyNAS Legacy-configuratie {#readynas-legacy-configuration}

Netgear ReadyNAS-apparaten brengen unieke uitdagingen met zich mee vanwege hun stopgezette firmware-ondersteuning en afhankelijkheid van legacy TLS 1.0-protocollen. Forward Email's legacy-poortondersteuning zorgt er echter voor dat deze apparaten e-mailmeldingen betrouwbaar kunnen blijven verzenden.

> \[!CAUTION]
> ReadyNAS OS 6.x ondersteunt alleen TLS 1.0, wat de legacy-compatibiliteitspoorten `2455` en `2555` van Forward Email vereist. Moderne poorten `465` en `587` werken niet met deze apparaten.

### Legacy-configuratiestappen {#legacy-configuration-steps}

1. **Open de ReadyNAS-webinterface** door het IP-adres van het apparaat in een webbrowser in te voeren.

2. **Ga naar Systeem > Instellingen > Meldingen** om de e-mailconfiguratie te openen.

3. **Configureer de SMTP-server** door `smtp.forwardemail.net` als serveradres in te voeren.

4. **Stel de poortconfiguratie in** op `2455` voor SSL/TLS-verbindingen of `2555` voor STARTTLS-verbindingen - dit zijn de legacy-compatibiliteitspoorten van Forward Email.

5. **Schakel authenticatie in** en voer je Forward Email-alias in als gebruikersnaam en je gegenereerde wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains).

6. **Configureer afzenderinformatie** met een beschrijvend "Van"-adres om het ReadyNAS-apparaat te identificeren.

7. **Voeg ontvanger-e-mailadressen toe** met de + knop in het e-mailcontactgedeelte.

8. **Test de configuratie** om te controleren of de legacy TLS-verbinding correct werkt.

> \[!IMPORTANT]
> ReadyNAS-apparaten hebben de legacy-poorten nodig omdat ze geen beveiligde verbindingen kunnen maken met moderne TLS-protocollen. Dit is een [bekende beperking](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) van de stopgezette firmware.

### ReadyNAS-probleemoplossing {#readynas-troubleshooting}

Veelvoorkomende problemen met ReadyNAS e-mailconfiguratie zijn onder andere:

* **TLS-versie komt niet overeen**: Zorg dat je poorten `2455` of `2555` gebruikt, niet de moderne poorten
* **Authenticatiefouten**: Controleer of je Forward Email-inloggegevens correct zijn
* **Netwerkconnectiviteit**: Controleer of de ReadyNAS `smtp.forwardemail.net` kan bereiken
* **Firmwarebeperkingen**: Sommige oudere ReadyNAS-modellen kunnen aanvullende [HTTPS-configuratievereisten](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system) hebben

ReadyNAS-apparaten met OS 6.x en eerdere versies ondersteunen alleen TLS 1.0-verbindingen, die de meeste moderne e-mailproviders niet meer accepteren. De speciale legacy-poorten van Forward Email (2455 en 2555) ondersteunen specifiek deze oudere protocollen, wat zorgt voor blijvende functionaliteit voor ReadyNAS-gebruikers.

Om e-mail op ReadyNAS-apparaten te configureren, open je de webinterface van het apparaat via het IP-adres. Ga naar het gedeelte Systeem en selecteer "Meldingen" om de e-mailconfiguratie-opties te openen.

Schakel in het e-mailconfiguratiegedeelte e-mailmeldingen in en voer smtp.forwardemail.net in als SMTP-server. Dit is cruciaal - gebruik de legacy-compatibele poorten van Forward Email in plaats van standaard SMTP-poorten.

Voor SSL/TLS-verbindingen configureer je poort 2455 in plaats van de standaardpoort 465 (aanbevolen). Voor STARTTLS-verbindingen gebruik je poort 2555 in plaats van poort 587. Deze speciale poorten behouden TLS 1.0-compatibiliteit en bieden de best mogelijke beveiliging voor legacy-apparaten.
Voer uw Forward Email-alias in als gebruikersnaam en uw gegenereerde wachtwoord voor authenticatie. ReadyNAS-apparaten ondersteunen SMTP-authenticatie, wat vereist is voor Forward Email-verbindingen.

Configureer het afzender-e-mailadres en de ontvangeradressen volgens uw meldingsvereisten. ReadyNAS staat meerdere ontvangeradressen toe, zodat u waarschuwingen kunt verspreiden naar verschillende teamleden of e-mailaccounts.

Test de configuratie zorgvuldig, aangezien ReadyNAS-apparaten mogelijk geen gedetailleerde foutmeldingen geven als de configuratie mislukt. Als standaardtesten niet werkt, controleer dan of u de juiste legacy-poorten (2455 of 2555) gebruikt in plaats van moderne SMTP-poorten.

Houd rekening met de beveiligingsimplicaties van het gebruik van legacy TLS-protocollen. Hoewel de legacy-poorten van Forward Email de best beschikbare beveiliging bieden voor oudere apparaten, wordt aanbevolen om indien mogelijk te upgraden naar een modern NAS-systeem met actuele TLS-ondersteuning.


## TerraMaster NAS Configuratie {#terramaster-nas-configuration}

TerraMaster-apparaten met TOS 6.x ondersteunen moderne TLS en werken goed met de standaardpoorten van Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x biedt uitgebreide e-mailmeldingsfuncties. Zorg dat uw firmware up-to-date is voor de beste compatibiliteit.

1. **Toegang tot Systeeminstellingen**
   * Log in op uw TerraMaster webinterface
   * Navigeer naar **Configuratiescherm** > **Melding**

2. **Configureer SMTP-instellingen**
   * Server: `smtp.forwardemail.net`
   * Poort: `465` (SSL/TLS, aanbevolen) of `587` (STARTTLS)
   * Gebruikersnaam: Uw Forward Email-alias
   * Wachtwoord: Gegeneerd wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains)

3. **Schakel Meldingen In**
   * Vink de meldingssoorten aan die u wilt ontvangen
   * Test de configuratie met de ingebouwde testfunctie

> \[!TIP]
> TerraMaster-apparaten werken het beste met poort `465` voor SSL/TLS-verbindingen (aanbevolen). Als u problemen ondervindt, wordt poort `587` met STARTTLS ook ondersteund.


## ASUSTOR NAS Configuratie {#asustor-nas-configuration}

ASUSTOR-apparaten met ADM 4.x hebben solide e-mailmeldingsondersteuning en werken naadloos samen met Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x bevat geavanceerde opties voor meldingsfiltering. U kunt aanpassen welke gebeurtenissen e-mailwaarschuwingen activeren.

1. **Open Meldingsinstellingen**
   * Toegang tot ADM webinterface
   * Ga naar **Instellingen** > **Melding**

2. **Stel SMTP-configuratie in**
   * SMTP-server: `smtp.forwardemail.net`
   * Poort: `465` (SSL/TLS, aanbevolen) of `587` (STARTTLS)
   * Authenticatie: Inschakelen
   * Gebruikersnaam: Uw Forward Email-alias
   * Wachtwoord: Gegeneerd wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains)

3. **Configureer Waarschuwingssoorten**
   * Selecteer welke systeemgebeurtenissen e-mails moeten triggeren
   * Stel ontvangeradressen in
   * Test de configuratie

> \[!IMPORTANT]
> ASUSTOR-apparaten vereisen dat authenticatie expliciet wordt ingeschakeld in de SMTP-instellingen. Vergeet deze optie niet aan te vinken.


## Buffalo TeraStation Configuratie {#buffalo-terastation-configuration}

Buffalo TeraStation-apparaten hebben beperkte maar functionele e-mailmeldingsmogelijkheden. De setup is eenvoudig zodra u weet waar u moet zoeken.

> \[!CAUTION]
> Firmware-updates voor Buffalo TeraStation zijn zeldzaam. Zorg dat u de nieuwste beschikbare firmware voor uw model gebruikt voordat u e-mail configureert.

1. **Toegang tot Webconfiguratie**
   * Verbind met de webinterface van uw TeraStation
   * Navigeer naar **Systeem** > **Melding**

2. **Configureer E-mailinstellingen**
   * SMTP-server: `smtp.forwardemail.net`
   * Poort: `465` (SSL/TLS, aanbevolen) of `587` (STARTTLS)
   * Gebruikersnaam: Uw Forward Email-alias
   * Wachtwoord: Gegeneerd wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains)
   * Schakel SSL/TLS-encryptie in

3. **Stel Meldingsvoorkeuren in**
   * Kies welke gebeurtenissen e-mails triggeren (schijf fouten, temperatuurwaarschuwingen, enz.)
   * Voer ontvanger-e-mailadressen in
   * Sla op en test de configuratie

> \[!NOTE]
> Sommige oudere TeraStation-modellen hebben mogelijk beperkte SMTP-configuratieopties. Raadpleeg de documentatie van uw model voor specifieke mogelijkheden.
## Western Digital My Cloud Configuratie {#western-digital-my-cloud-configuration}

Western Digital My Cloud-apparaten die OS 5 draaien ondersteunen e-mailmeldingen, hoewel de interface wat verstopt kan zijn in de instellingen.

> \[!WARNING]
> Western Digital heeft de ondersteuning voor veel My Cloud-modellen stopgezet. Controleer of uw apparaat nog firmware-updates ontvangt voordat u vertrouwt op e-mailmeldingen voor kritieke waarschuwingen.

1. **Navigeer naar Instellingen**
   * Open het My Cloud webdashboard
   * Ga naar **Instellingen** > **Algemeen** > **Meldingen**

2. **Configureer SMTP-gegevens**
   * Mailserver: `smtp.forwardemail.net`
   * Poort: `465` (SSL/TLS, aanbevolen) of `587` (STARTTLS)
   * Gebruikersnaam: Uw Forward Email-alias
   * Wachtwoord: Gemaakt wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains)
   * Schakel encryptie in

3. **Stel waarschuwingstypen in**
   * Selecteer notificatiecategorieën (systeemwaarschuwingen, schijfgezondheid, enz.)
   * Voeg e-mailadressen van ontvangers toe
   * Test de e-mailconfiguratie

> \[!TIP]
> We raden aan poort `465` met SSL/TLS te gebruiken. Als u problemen ondervindt, wordt poort `587` met STARTTLS ook ondersteund.


## TrueNAS E-mailconfiguratie {#truenas-email-configuration}

TrueNAS (zowel SCALE als CORE) biedt uitstekende ondersteuning voor e-mailmeldingen met gedetailleerde configuratieopties.

> \[!NOTE]
> TrueNAS biedt enkele van de meest uitgebreide e-mailmeldingsfuncties onder NAS-systemen. U kunt gedetailleerde waarschuwingsregels en meerdere ontvangers configureren.

1. **Toegang tot Systeeminstellingen**
   * Log in op de TrueNAS webinterface
   * Navigeer naar **Systeem** > **E-mail**

2. **Configureer SMTP-instellingen**
   * Uitgaande mailserver: `smtp.forwardemail.net`
   * Mailserverpoort: `465` (aanbevolen) of `587`
   * Beveiliging: SSL/TLS (voor 465, aanbevolen) of STARTTLS (voor 587)
   * Gebruikersnaam: Uw Forward Email-alias
   * Wachtwoord: Gemaakt wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains)

3. **Stel waarschuwingen in**
   * Ga naar **Systeem** > **Waarschuwingsdiensten**
   * Configureer welke waarschuwingen per e-mail moeten worden verzonden
   * Stel ontvangersadressen en waarschuwingsniveaus in
   * Test de configuratie met de ingebouwde testfunctie

> \[!IMPORTANT]
> TrueNAS stelt u in staat verschillende waarschuwingsniveaus te configureren (INFO, NOTICE, WARNING, ERROR, CRITICAL). Kies geschikte niveaus om e-mailspam te vermijden en toch kritieke problemen te melden.


## OpenMediaVault Configuratie {#openmediavault-configuration}

OpenMediaVault biedt degelijke e-mailmeldingsmogelijkheden via zijn webinterface. Het installatieproces is overzichtelijk en eenvoudig.

> \[!NOTE]
> Het notificatiesysteem van OpenMediaVault is plugin-gebaseerd. Zorg ervoor dat u de e-mailmeldingsplugin hebt geïnstalleerd en ingeschakeld.

1. **Toegang tot notificatie-instellingen**
   * Open de OpenMediaVault webinterface
   * Ga naar **Systeem** > **Notificatie** > **E-mail**

2. **Configureer SMTP-parameters**
   * SMTP-server: `smtp.forwardemail.net`
   * Poort: `465` (SSL/TLS, aanbevolen) of `587` (STARTTLS)
   * Gebruikersnaam: Uw Forward Email-alias
   * Wachtwoord: Gemaakt wachtwoord van [Mijn Account -> Domeinen -> Aliassen](https://forwardemail.net/my-account/domains)
   * Schakel SSL/TLS in

3. **Stel notificatieregels in**
   * Navigeer naar **Systeem** > **Notificatie** > **Meldingen**
   * Configureer welke systeemgebeurtenissen e-mails moeten triggeren
   * Stel ontvangersadressen in
   * Test de e-mailfunctionaliteit

> \[!TIP]
> OpenMediaVault stelt u in staat notificatieschema’s te configureren. U kunt stille uren instellen of de frequentie van meldingen beperken om overweldiging door waarschuwingen te voorkomen.


## Raspberry Pi NAS Configuratie {#raspberry-pi-nas-configuration}

De Raspberry Pi is een uitstekende instap in NAS-functionaliteit en biedt een kosteneffectieve oplossing voor thuis- en kleine kantooromgevingen. Het instellen van een Raspberry Pi als NAS-apparaat omvat het configureren van bestandsdeelprotocollen, e-mailmeldingen en essentiële netwerkdiensten.

> \[!TIP]
> Voor Raspberry Pi-liefhebbers raden we sterk aan uw NAS-configuratie aan te vullen met [PiKVM](https://pikvm.org/) voor remote serverbeheer en [Pi-hole](https://pi-hole.net/) voor netwerkbrede advertentieblokkering en DNS-beheer. Deze tools creëren een uitgebreide home lab-omgeving.
### Initiële Raspberry Pi Setup {#initial-raspberry-pi-setup}

Voordat je NAS-diensten configureert, zorg ervoor dat je Raspberry Pi draait op de nieuwste Raspberry Pi OS en voldoende opslag heeft. Een hoogwaardige microSD-kaart (Class 10 of beter) of USB 3.0 SSD biedt betere prestaties en betrouwbaarheid voor NAS-operaties.

1. **Werk het systeem bij** door `sudo apt update && sudo apt upgrade -y` uit te voeren om ervoor te zorgen dat alle pakketten up-to-date zijn.

2. **Schakel SSH-toegang in** met `sudo systemctl enable ssh && sudo systemctl start ssh` voor externe administratie.

3. **Configureer statische IP-adressering** door `/etc/dhcpcd.conf` te bewerken om consistente netwerktoegang te garanderen.

4. **Stel externe opslag in** door USB-stations aan te sluiten en te mounten of RAID-arrays te configureren voor gegevensredundantie.

### Samba Bestandsdeling Configuratie {#samba-file-sharing-configuration}

Samba biedt Windows-compatibele bestandsdeling, waardoor je Raspberry Pi toegankelijk is vanaf elk apparaat in je netwerk. Het configuratieproces omvat het installeren van Samba, het aanmaken van shares en het instellen van gebruikersauthenticatie.

Installeer Samba met `sudo apt install samba samba-common-bin` en configureer het hoofdconfiguratiebestand in `/etc/samba/smb.conf`. Maak gedeelde mappen aan en stel de juiste permissies in met `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Configureer Samba-shares door secties toe te voegen aan het configuratiebestand voor elke gedeelde map. Stel gebruikersauthenticatie in met `sudo smbpasswd -a gebruikersnaam` om Samba-specifieke wachtwoorden voor netwerktoegang aan te maken.

> \[!IMPORTANT]
> Gebruik altijd sterke wachtwoorden voor Samba-gebruikers en overweeg gasttoegang alleen in te schakelen voor niet-gevoelige gedeelde mappen. Bekijk de [officiële Samba-documentatie](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) voor geavanceerde beveiligingsconfiguraties.

### FTP Server Setup {#ftp-server-setup}

FTP biedt een andere methode voor bestands toegang, vooral handig voor geautomatiseerde back-ups en externe bestandsbeheer. Installeer en configureer vsftpd (Very Secure FTP Daemon) voor betrouwbare FTP-diensten.

Installeer vsftpd met `sudo apt install vsftpd` en configureer de service door `/etc/vsftpd.conf` te bewerken. Schakel lokale gebruikers toegang in, configureer passive mode-instellingen en stel passende beveiligingsbeperkingen in.

Maak FTP-gebruikers aan en configureer directorytoegangsrechten. Overweeg het gebruik van SFTP (SSH File Transfer Protocol) in plaats van traditioneel FTP voor verbeterde beveiliging, omdat het alle datatransmissie versleutelt.

> \[!CAUTION]
> Traditionele FTP verzendt wachtwoorden in platte tekst. Gebruik altijd SFTP of configureer FTP met TLS-encryptie voor veilige bestandsoverdrachten. Bekijk [vsftpd beveiligingsrichtlijnen](https://security.appspot.com/vsftpd.html) vóór implementatie.

### E-mail Notificatie Configuratie {#email-notification-configuration}

Configureer je Raspberry Pi NAS om e-mailmeldingen te verzenden voor systeemgebeurtenissen, opslagwaarschuwingen en back-up voltooiingsstatus. Dit omvat het installeren en configureren van een mail transfer agent en het instellen van Forward Email-integratie.

Installeer `msmtp` als een lichte SMTP-client met `sudo apt install msmtp msmtp-mta`. Maak het configuratiebestand aan in `/etc/msmtprc` met de volgende instellingen:

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

Configureer systeemmeldingen door cronjobs en systeemmonitoringscripts in te stellen die `msmtp` gebruiken om waarschuwingen te verzenden. Maak scripts voor schijfruimtebewaking, temperatuurwaarschuwingen en back-up voltooiingsmeldingen.

### Geavanceerde Raspberry Pi NAS Functies {#advanced-raspberry-pi-nas-features}

Breid je Raspberry Pi NAS uit met extra diensten en monitoringmogelijkheden. Installeer en configureer netwerkmonitoringtools, geautomatiseerde back-upoplossingen en externe toegangsdiensten.

Stel [Nextcloud](https://nextcloud.com/) in voor cloudachtige functionaliteit met webgebaseerde bestands toegang, kalender synchronisatie en samenwerkingsfuncties. Installeer met Docker of de officiële Nextcloud-installatiehandleiding voor Raspberry Pi.
Configureer geautomatiseerde back-ups met `rsync` en `cron` om geplande back-ups van kritieke gegevens te maken. Stel e-mailmeldingen in voor voltooiing van back-ups en foutmeldingen met behulp van je Forward Email-configuratie.

Implementeer netwerkmonitoring met tools zoals [Nagios](https://www.nagios.org/) of [Zabbix](https://www.zabbix.com/) om de systeemprestaties, netwerkconnectiviteit en beschikbaarheid van diensten te bewaken.

> \[!NOTE]
> Voor gebruikers die netwerkapparatuur beheren, overweeg om [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) te integreren met je PiKVM-setup voor externe fysieke schakelbediening. Deze [Python-integratiehandleiding](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) biedt gedetailleerde instructies voor het automatiseren van fysiek apparaatbeheer.

### Raspberry Pi E-mail Probleemoplossing {#raspberry-pi-email-troubleshooting}

Veelvoorkomende problemen met de e-mailconfiguratie van Raspberry Pi zijn onder andere DNS-resolutieproblemen, firewallbeperkingen en authenticatiefouten. De lichte aard van Raspberry Pi-systemen kan soms timingproblemen veroorzaken bij SMTP-verbindingen.

Als e-mailmeldingen niet werken, controleer dan het `msmtp` logbestand op `/var/log/msmtp.log` voor gedetailleerde foutmeldingen. Verifieer dat je Forward Email-inloggegevens correct zijn en dat de Raspberry Pi `smtp.forwardemail.net` kan resolven.

Test de e-mailfunctionaliteit via de opdrachtregel: `echo "Test message" | msmtp recipient@example.com`. Dit helpt om configuratieproblemen te onderscheiden van applicatiespecifieke problemen.

Configureer de juiste DNS-instellingen in `/etc/resolv.conf` als je DNS-resolutieproblemen ondervindt. Overweeg het gebruik van publieke DNS-servers zoals `8.8.8.8` of `1.1.1.1` als lokale DNS onbetrouwbaar is.

### Prestatieoptimalisatie {#performance-optimization}

Optimaliseer de prestaties van je Raspberry Pi NAS door de juiste configuratie van opslag, netwerkinstellingen en systeembronnen. Gebruik hoogwaardige opslagapparaten en configureer geschikte bestandssysteemopties voor jouw gebruikssituatie.

Schakel USB 3.0-boot in voor betere opslagprestaties als je externe schijven gebruikt. Configureer de GPU-geheugensplitsing met `sudo raspi-config` om meer RAM toe te wijzen aan systeemprocessen in plaats van grafische verwerking.

Monitor systeemprestaties met tools zoals `htop`, `iotop` en `nethogs` om knelpunten te identificeren en het gebruik van bronnen te optimaliseren. Overweeg een upgrade naar een Raspberry Pi 4 met 8GB RAM voor veeleisende NAS-toepassingen.

Implementeer geschikte koelingsoplossingen om thermische throttling tijdens intensieve bewerkingen te voorkomen. Monitor de CPU-temperatuur met `/opt/vc/bin/vcgencmd measure_temp` en zorg voor voldoende ventilatie.

### Beveiligingsoverwegingen {#security-considerations}

Beveilig je Raspberry Pi NAS door juiste toegangscontroles, netwerkbeveiligingsmaatregelen en regelmatige beveiligingsupdates te implementeren. Verander standaardwachtwoorden, schakel onnodige diensten uit en configureer firewallregels.

Installeer en configureer `fail2ban` om brute force-aanvallen op SSH en andere diensten te voorkomen. Stel automatische beveiligingsupdates in met `unattended-upgrades` om ervoor te zorgen dat kritieke beveiligingspatches snel worden toegepast.

Configureer netwerksegmentatie om je NAS indien mogelijk te isoleren van andere netwerkapparaten. Gebruik VPN-toegang voor externe verbindingen in plaats van diensten direct aan het internet bloot te stellen.

Maak regelmatig een back-up van je Raspberry Pi-configuratie en gegevens om dataverlies door hardwarestoringen of beveiligingsincidenten te voorkomen. Test back-upherstelprocedures om de mogelijkheden voor gegevensherstel te waarborgen.

De Raspberry Pi NAS-configuratie biedt een uitstekende basis om netwerkopslagconcepten te leren en levert praktische functionaliteit voor thuis- en kleine kantooromgevingen. De combinatie met Forward Email zorgt voor betrouwbare notificatieaflevering voor systeemmonitoring en onderhoudsmeldingen.
