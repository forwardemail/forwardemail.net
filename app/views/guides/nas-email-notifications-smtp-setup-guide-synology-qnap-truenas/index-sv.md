# Komplett guide för NAS-e-postinställning med Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Att ställa in e-postaviseringar på din NAS ska inte vara svårt. Oavsett om du har en Synology, QNAP eller till och med en Raspberry Pi, kommer denna guide att få din enhet att kommunicera med Forward Email så att du faktiskt vet när något går fel.

De flesta NAS-enheter kan skicka e-postvarningar för diskfel, temperaturvarningar, slutförda säkerhetskopior och säkerhetshändelser. Problemet? Många e-postleverantörer har blivit kräsna när det gäller säkerhet, och äldre enheter kan ofta inte hänga med. Det är där Forward Email kommer in – vi stödjer både moderna och äldre enheter.

Denna guide täcker e-postinställningar för över 75 NAS-leverantörer med steg-för-steg-instruktioner, kompatibilitetsinformation och felsökningstips. Oavsett vilken enhet du använder, får vi dina aviseringar att fungera.


## Innehållsförteckning {#table-of-contents}

* [Varför du behöver NAS-e-postaviseringar](#why-you-need-nas-email-notifications)
* [TLS-problemet (och hur vi löser det)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP-inställningar](#forward-email-smtp-settings)
* [Omfattande kompatibilitetsmatris för NAS-leverantörer](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS e-postkonfiguration](#synology-nas-email-configuration)
  * [Konfigurationssteg](#configuration-steps)
* [QNAP NAS e-postkonfiguration](#qnap-nas-email-configuration)
  * [Konfigurationssteg](#configuration-steps-1)
  * [Vanliga QNAP-felsökningsproblem](#common-qnap-troubleshooting-issues)
* [ReadyNAS Legacy-konfiguration](#readynas-legacy-configuration)
  * [Legacy-konfigurationssteg](#legacy-configuration-steps)
  * [ReadyNAS-felsökning](#readynas-troubleshooting)
* [TerraMaster NAS-konfiguration](#terramaster-nas-configuration)
* [ASUSTOR NAS-konfiguration](#asustor-nas-configuration)
* [Buffalo TeraStation-konfiguration](#buffalo-terastation-configuration)
* [Western Digital My Cloud-konfiguration](#western-digital-my-cloud-configuration)
* [TrueNAS e-postkonfiguration](#truenas-email-configuration)
* [OpenMediaVault-konfiguration](#openmediavault-configuration)
* [Raspberry Pi NAS-konfiguration](#raspberry-pi-nas-configuration)
  * [Initial Raspberry Pi-inställning](#initial-raspberry-pi-setup)
  * [Samba-fildelningskonfiguration](#samba-file-sharing-configuration)
  * [FTP-serverinställning](#ftp-server-setup)
  * [E-postavisering konfiguration](#email-notification-configuration)
  * [Avancerade Raspberry Pi NAS-funktioner](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi e-postfelsökning](#raspberry-pi-email-troubleshooting)
  * [Prestandaoptimering](#performance-optimization)
  * [Säkerhetsaspekter](#security-considerations)


## Varför du behöver NAS-e-postaviseringar {#why-you-need-nas-email-notifications}

Din NAS övervakar massor av saker – diskhälsa, temperatur, nätverksproblem, säkerhetshändelser. Utan e-postaviseringar kan problem gå obemärkta i veckor, vilket potentiellt kan orsaka dataförlust eller säkerhetsintrång.

E-postaviseringar ger dig omedelbara varningar när diskar börjar fallera, varnar för obehöriga åtkomstförsök, bekräftar lyckade säkerhetskopior och håller dig informerad om systemets hälsa. Forward Email ser till att dessa kritiska aviseringar faktiskt når dig.


## TLS-problemet (och hur vi löser det) {#the-tls-problem-and-how-we-fix-it}

Så här är det: om din NAS tillverkades före 2020 stöder den troligen bara TLS 1.0. Gmail, Outlook och de flesta leverantörer slutade stödja det för flera år sedan. Din enhet försöker skicka e-post, blir nekad och du blir lämnad i mörkret.

Forward Email löser detta med stöd för dubbla portar. Moderna enheter använder våra standardportar (`465` och `587`), medan äldre enheter kan använda våra legacy-portar (`2455` och `2555`) som fortfarande stödjer TLS 1.0.

> \[!IMPORTANT]
> Forward Email stödjer både moderna och äldre NAS-enheter genom vår strategi med dubbla portar. Använd portar 465/587 för moderna enheter med TLS 1.2+ stöd, och portar 2455/2555 för äldre enheter som endast stödjer TLS 1.0.


## Forward Email SMTP-inställningar {#forward-email-smtp-settings}
Här är vad du behöver veta om vår SMTP-inställning:

**För moderna NAS-enheter (2020+):** Använd `smtp.forwardemail.net` med port `465` (SSL/TLS) eller port `587` (STARTTLS). Dessa fungerar med aktuell firmware som stöder TLS 1.2+.

**För äldre NAS-enheter:** Använd `smtp.forwardemail.net` med port `2455` (SSL/TLS) eller port `2555` (STARTTLS). Dessa stöder TLS 1.0 för äldre enheter.

**Autentisering:** Använd din Forward Email-alias som användarnamn och det genererade lösenordet från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains) (inte ditt kontolösenord).

> \[!CAUTION]
> Använd aldrig ditt kontoinloggningslösenord för SMTP-autentisering. Använd alltid det genererade lösenordet från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains) för NAS-konfiguration.

> \[!TIP]
> Kontrollera din NAS-enhets firmwareversion och TLS-stöd innan konfiguration. De flesta enheter tillverkade efter 2020 stöder moderna TLS-protokoll, medan äldre enheter vanligtvis kräver portar för äldre kompatibilitet.


## Omfattande kompatibilitetsmatris för NAS-leverantörer {#comprehensive-nas-provider-compatibility-matrix}

Följande matris ger detaljerad kompatibilitetsinformation för stora NAS-leverantörer, inklusive TLS-stödnivåer, firmwarestatus och rekommenderade Forward Email-konfigurationsinställningar.

| NAS-leverantör  | Nuvarande modeller | TLS-stöd    | Firmwarestatus | Rekommenderade portar | Vanliga problem                                                                                                                                       | Installationsguide/Skärmbilder                                                                                                                  |
| --------------- | ------------------ | ----------- | -------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology        | DSM 7.x            | TLS 1.2+    | Aktiv          | `465`, `587`          | [STARTTLS-konfiguration](https://community.synology.com/enu/forum/2/post/124584)                                                                     | [DSM Email Notification Setup](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                |
| QNAP            | QTS 5.x            | TLS 1.2+    | Aktiv          | `465`, `587`          | [Notification Center-fel](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)   | [QTS Email Server Configuration](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi    | Raspberry Pi OS     | TLS 1.2+    | Aktiv          | `465`, `587`          | [DNS-upplösningsproblem](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                 | [Raspberry Pi Email Setup Guide](#raspberry-pi-nas-configuration)                                                                               |
| ASUSTOR         | ADM 4.x             | TLS 1.2+    | Aktiv          | `465`, `587`          | [Certifikatvalidering](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                        | [ASUSTOR Notification Setup](https://www.asustor.com/en/online/online_help?id=8)                                                                |
| TerraMaster     | TOS 6.x             | TLS 1.2     | Aktiv          | `465`, `587`          | [SMTP-autentisering](https://www.terra-master.com/global/forum/)                                                                                    | [TerraMaster Email Configuration](https://www.terra-master.com/global/support/download.php)                                                     |
| TrueNAS         | SCALE/CORE           | TLS 1.2+    | Aktiv          | `465`, `587`          | [SSL-certifikatinställning](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                        | [TrueNAS Email Setup Guide](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                     |
| Buffalo         | TeraStation          | TLS 1.2     | Begränsad     | `465`, `587`          | [Firmwarekompatibilitet](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)        | [TeraStation Email Setup](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)  |
| Western Digital | My Cloud OS 5        | TLS 1.2     | Begränsad     | `465`, `587`          | [Kompatibilitet med äldre OS](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                            | [My Cloud Email Configuration](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                      |
| OpenMediaVault  | OMV 7.x              | TLS 1.2+    | Aktiv          | `465`, `587`          | [Pluginberoenden](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                          | [OMV Notification Setup](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                   |
| Netgear ReadyNAS| OS 6.x               | Endast TLS 1.0 | Utgått       | `2455`, `2555`        | [Stöd för äldre TLS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                        | [ReadyNAS Email Alert Setup](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)           |
| Drobo           | Dashboard            | TLS 1.2     | Utgått         | `465`, `587`          | [Begränsat stöd](https://myprojects.drobo.com/support/)                                                                                             | [Drobo Email Notifications](https://www.drobo.com/support/)                                                                                     |
Denna matris visar den tydliga uppdelningen mellan moderna, aktivt underhållna NAS-system och äldre enheter som kräver särskilda kompatibilitetsöverväganden. Majoriteten av nuvarande NAS-enheter stödjer moderna TLS-standarder och kan använda Forward Emails primära SMTP-portar utan någon särskild konfiguration.


## Synology NAS Email Configuration {#synology-nas-email-configuration}

Synology-enheter med DSM är ganska enkla att konfigurera. De stödjer modern TLS, så du kan använda våra standardportar utan några problem.

> \[!NOTE]
> Synology DSM 7.x erbjuder de mest omfattande funktionerna för e-postaviseringar. Äldre DSM-versioner kan ha begränsade konfigurationsalternativ.

### Configuration Steps {#configuration-steps}

1. **Öppna DSM webbgränssnitt** genom att ange din NAS-enhets IP-adress eller QuickConnect-ID i en webbläsare.

2. **Navigera till Kontrollpanelen** och välj avsnittet "Avisering", klicka sedan på fliken "E-post" för att komma åt e-postkonfigurationsalternativen.

3. **Aktivera e-postaviseringar** genom att markera kryssrutan "Aktivera e-postaviseringar".

4. **Konfigurera SMTP-servern** genom att ange `smtp.forwardemail.net` som serveradress.

5. **Ställ in portkonfigurationen** till port 465 för SSL/TLS-anslutningar (rekommenderas). Port 587 med STARTTLS stöds också som ett alternativ.

6. **Konfigurera autentisering** genom att välja "SMTP-autentisering krävs" och ange din Forward Email-alias i användarnamnfältet.

7. **Ange ditt lösenord** med lösenordet som genererats från [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **Ställ in mottagaradresser** genom att ange upp till fem e-postadresser som ska ta emot aviseringar.

9. **Konfigurera aviseringfiltrering** för att kontrollera vilka händelser som utlöser e-postvarningar, vilket förhindrar överbelastning av aviseringar samtidigt som kritiska händelser rapporteras.

10. **Testa konfigurationen** med DSM:s inbyggda testfunktion för att verifiera att alla inställningar är korrekta och att kommunikationen med Forward Emails servrar fungerar som den ska.

> \[!TIP]
> Synology tillåter olika typer av aviseringar för olika mottagare, vilket ger flexibilitet i hur varningar distribueras inom ditt team.


## QNAP NAS Email Configuration {#qnap-nas-email-configuration}

QNAP-enheter med QTS fungerar utmärkt med Forward Email. De stödjer modern TLS och har ett trevligt webbgränssnitt för konfiguration.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 hade ett känt problem med e-postaviseringar som [åtgärdades i QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Se till att din firmware är uppdaterad för att undvika aviseringfel.

### Configuration Steps {#configuration-steps-1}

1. **Öppna ditt QNAP-enhets webbgränssnitt** genom att ange dess IP-adress i en webbläsare.

2. **Navigera till Kontrollpanelen** och välj "Service Account and Device Pairing", klicka sedan på avsnittet "E-mail" för att börja e-postkonfigurationen.

3. **Klicka på "Add SMTP Service"** för att skapa en ny e-postkonfiguration.

4. **Konfigurera SMTP-servern** genom att ange `smtp.forwardemail.net` som SMTP-serveradress.

5. **Välj lämpligt säkerhetsprotokoll** – välj "SSL/TLS" med port `465` (rekommenderas). Port `587` med STARTTLS stöds också.

6. **Konfigurera portnumret** – port `465` med SSL/TLS rekommenderas. Port `587` med STARTTLS finns också tillgänglig vid behov.

7. **Ange dina autentiseringsuppgifter** med din Forward Email-alias som användarnamn och ditt genererade lösenord från [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **Konfigurera avsändarinformation** genom att ange ett beskrivande namn för "Från"-fältet, till exempel "QNAP NAS System" eller din enhets värdnamn.

9. **Ställ in mottagaradresser** för olika typer av aviseringar. QNAP tillåter att du konfigurerar flera mottagargrupper för olika varningstyper.

10. **Testa konfigurationen** med QNAP:s inbyggda e-posttestfunktion för att verifiera att alla inställningar fungerar korrekt.

> \[!TIP]
> Om du stöter på [Gmail SMTP-konfigurationsproblem](https://forum.qnap.com/viewtopic.php?t=152466) gäller samma felsökningssteg för Forward Email. Se till att autentisering är korrekt aktiverad och att uppgifterna är rätta.
> \[!NOTE]
> QNAP-enheter stöder avancerad schemaläggning av aviseringar, vilket gör att du kan konfigurera tysta timmar när icke-kritiska aviseringar undertrycks. Detta är särskilt användbart i affärsmiljöer.

### Vanliga felsökningsproblem för QNAP {#common-qnap-troubleshooting-issues}

Om din QNAP-enhet [misslyckas med att skicka aviseringar via e-post](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), kontrollera följande:

* Verifiera att dina Forward Email-uppgifter är korrekta
* Säkerställ att SMTP-serveradressen är exakt `smtp.forwardemail.net`
* Bekräfta att porten matchar din krypteringsmetod (`465` för SSL/TLS rekommenderas; `587` för STARTTLS stöds också)
* Kontrollera att din [SMTP-serverkonfiguration](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) tillåter anslutningen


## ReadyNAS Legacy-konfiguration {#readynas-legacy-configuration}

Netgear ReadyNAS-enheter innebär unika utmaningar på grund av deras avbrutna firmware-stöd och beroende av äldre TLS 1.0-protokoll. Dock säkerställer Forward Email:s stöd för legacy-portar att dessa enheter kan fortsätta skicka e-postaviseringar pålitligt.

> \[!CAUTION]
> ReadyNAS OS 6.x stöder endast TLS 1.0, vilket kräver Forward Email:s legacy-kompatibilitetsportar `2455` och `2555`. Moderna portar `465` och `587` fungerar inte med dessa enheter.

### Steg för legacy-konfiguration {#legacy-configuration-steps}

1. **Öppna ReadyNAS webbgränssnitt** genom att ange enhetens IP-adress i en webbläsare.

2. **Navigera till System > Inställningar > Aviseringar** för att komma åt e-postkonfigurationssektionen.

3. **Konfigurera SMTP-servern** genom att ange `smtp.forwardemail.net` som serveradress.

4. **Ställ in portkonfigurationen** till antingen `2455` för SSL/TLS-anslutningar eller `2555` för STARTTLS-anslutningar – dessa är Forward Email:s legacy-kompatibilitetsportar.

5. **Aktivera autentisering** och ange ditt Forward Email-alias som användarnamn samt ditt genererade lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains).

6. **Konfigurera avsändarinformation** med en beskrivande "Från"-adress för att identifiera ReadyNAS-enheten.

7. **Lägg till mottagare** med hjälp av + -knappen i e-postkontaktssektionen.

8. **Testa konfigurationen** för att säkerställa att legacy TLS-anslutningen fungerar korrekt.

> \[!IMPORTANT]
> ReadyNAS-enheter kräver legacy-portarna eftersom de inte kan upprätta säkra anslutningar med moderna TLS-protokoll. Detta är en [känd begränsning](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) i den avbrutna firmwaren.

### Felsökning för ReadyNAS {#readynas-troubleshooting}

Vanliga problem med ReadyNAS e-postkonfiguration inkluderar:

* **TLS-version som inte matchar**: Säkerställ att du använder portarna `2455` eller `2555`, inte de moderna portarna
* **Autentiseringsfel**: Verifiera att dina Forward Email-uppgifter är korrekta
* **Nätverksanslutning**: Kontrollera att ReadyNAS kan nå `smtp.forwardemail.net`
* **Firmware-begränsningar**: Vissa äldre ReadyNAS-modeller kan ha ytterligare [HTTPS-konfigurationskrav](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

ReadyNAS-enheter som kör OS 6.x och tidigare versioner stöder endast TLS 1.0-anslutningar, vilket de flesta moderna e-postleverantörer inte längre accepterar. Forward Email:s dedikerade legacy-portar (2455 och 2555) stödjer specifikt dessa äldre protokoll, vilket säkerställer fortsatt funktionalitet för ReadyNAS-användare.

För att konfigurera e-post på ReadyNAS-enheter, öppna enhetens webbgränssnitt via dess IP-adress. Navigera till System-sektionen och välj "Aviseringar" för att komma åt e-postkonfigurationsalternativen.

I e-postkonfigurationssektionen, aktivera e-postaviseringar och ange smtp.forwardemail.net som SMTP-server. Detta är avgörande – använd Forward Email:s legacy-kompatibla portar istället för standard SMTP-portar.

För SSL/TLS-anslutningar, konfigurera port 2455 istället för standardport 465 (rekommenderas). För STARTTLS-anslutningar, använd port 2555 istället för port 587. Dessa specialportar bibehåller TLS 1.0-kompatibilitet samtidigt som de ger bästa möjliga säkerhet för legacy-enheter.
Ange ditt Forward Email-alias som användarnamn och ditt genererade lösenord för autentisering. ReadyNAS-enheter stödjer SMTP-autentisering, vilket krävs för Forward Email-anslutningar.

Konfigurera avsändarens e-postadress och mottagaradresser enligt dina notifieringsbehov. ReadyNAS tillåter flera mottagaradresser, vilket gör att du kan distribuera varningar till olika teammedlemmar eller e-postkonton.

Testa konfigurationen noggrant, eftersom ReadyNAS-enheter kanske inte ger detaljerade felmeddelanden om konfigurationen misslyckas. Om standardtestning inte fungerar, kontrollera att du använder rätt legacy-portar (2455 eller 2555) istället för moderna SMTP-portar.

Tänk på säkerhetsimplikationerna av att använda legacy TLS-protokoll. Medan Forward Emails legacy-portar ger bästa tillgängliga säkerhet för äldre enheter, rekommenderas det att uppgradera till ett modernt NAS-system med aktuellt TLS-stöd när det är möjligt.


## TerraMaster NAS-konfiguration {#terramaster-nas-configuration}

TerraMaster-enheter som kör TOS 6.x stödjer modern TLS och fungerar bra med Forward Emails standardportar.

> \[!NOTE]
> TerraMaster TOS 6.x erbjuder omfattande funktioner för e-postnotifieringar. Se till att din firmware är uppdaterad för bästa kompatibilitet.

1. **Öppna systeminställningar**
   * Logga in på din TerraMaster webbgränssnitt
   * Navigera till **Kontrollpanel** > **Notifiering**

2. **Konfigurera SMTP-inställningar**
   * Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, rekommenderat) eller `587` (STARTTLS)
   * Användarnamn: Ditt Forward Email-alias
   * Lösenord: Genererat lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Aktivera notifieringar**
   * Markera de notifieringstyper du vill ta emot
   * Testa konfigurationen med den inbyggda testfunktionen

> \[!TIP]
> TerraMaster-enheter fungerar bäst med port `465` för SSL/TLS-anslutningar (rekommenderat). Om du upplever problem stöds även port `587` med STARTTLS.


## ASUSTOR NAS-konfiguration {#asustor-nas-configuration}

ASUSTOR-enheter med ADM 4.x har stabilt stöd för e-postnotifieringar och fungerar sömlöst med Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x inkluderar avancerade filteralternativ för notifieringar. Du kan anpassa vilka händelser som ska trigga e-postvarningar.

1. **Öppna notifieringsinställningar**
   * Gå in i ADM webbgränssnitt
   * Gå till **Inställningar** > **Notifiering**

2. **Ställ in SMTP-konfiguration**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, rekommenderat) eller `587` (STARTTLS)
   * Autentisering: Aktivera
   * Användarnamn: Ditt Forward Email-alias
   * Lösenord: Genererat lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Konfigurera varningstyper**
   * Välj vilka systemhändelser som ska trigga e-post
   * Ställ in mottagaradresser
   * Testa konfigurationen

> \[!IMPORTANT]
> ASUSTOR-enheter kräver att autentisering uttryckligen aktiveras i SMTP-inställningarna. Glöm inte att markera detta alternativ.


## Buffalo TeraStation-konfiguration {#buffalo-terastation-configuration}

Buffalo TeraStation-enheter har begränsade men fungerande funktioner för e-postnotifieringar. Installationen är enkel när du vet var du ska leta.

> \[!CAUTION]
> Buffalo TeraStation firmwareuppdateringar är sällsynta. Se till att du använder den senaste tillgängliga firmwaren för din modell innan du konfigurerar e-post.

1. **Öppna webbkonfiguration**
   * Anslut till din TeraStations webbgränssnitt
   * Navigera till **System** > **Notifiering**

2. **Konfigurera e-postinställningar**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, rekommenderat) eller `587` (STARTTLS)
   * Användarnamn: Ditt Forward Email-alias
   * Lösenord: Genererat lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktivera SSL/TLS-kryptering

3. **Ställ in notifieringspreferenser**
   * Välj vilka händelser som ska trigga e-post (diskfel, temperaturvarningar, etc.)
   * Ange mottagande e-postadresser
   * Spara och testa konfigurationen

> \[!NOTE]
> Vissa äldre TeraStation-modeller kan ha begränsade SMTP-konfigurationsalternativ. Kontrollera din modells dokumentation för specifika funktioner.
## Western Digital My Cloud-konfiguration {#western-digital-my-cloud-configuration}

Western Digital My Cloud-enheter som kör OS 5 stödjer e-postaviseringar, även om gränssnittet kan vara lite dolt i inställningarna.

> \[!WARNING]
> Western Digital har upphört med support för många My Cloud-modeller. Kontrollera om din enhet fortfarande får firmwareuppdateringar innan du förlitar dig på e-postaviseringar för kritiska larm.

1. **Navigera till Inställningar**
   * Öppna My Cloud webbpanel
   * Gå till **Inställningar** > **Allmänt** > **Aviseringar**

2. **Konfigurera SMTP-detaljer**
   * Mailserver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, rekommenderas) eller `587` (STARTTLS)
   * Användarnamn: Din Forward Email-alias
   * Lösenord: Genererat lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktivera kryptering

3. **Ställ in larmtyper**
   * Välj aviseringstyper (systemlarm, diskhälsa, etc.)
   * Lägg till mottagares e-postadresser
   * Testa e-postkonfigurationen

> \[!TIP]
> Vi rekommenderar att använda port `465` med SSL/TLS. Om du upplever problem stöds även port `587` med STARTTLS.


## TrueNAS e-postkonfiguration {#truenas-email-configuration}

TrueNAS (både SCALE och CORE) har utmärkt stöd för e-postaviseringar med detaljerade konfigurationsmöjligheter.

> \[!NOTE]
> TrueNAS erbjuder några av de mest omfattande funktionerna för e-postaviseringar bland NAS-system. Du kan konfigurera detaljerade larmregler och flera mottagare.

1. **Öppna systeminställningar**
   * Logga in i TrueNAS webbgränssnitt
   * Navigera till **System** > **E-post**

2. **Konfigurera SMTP-inställningar**
   * Utgående mailserver: `smtp.forwardemail.net`
   * Mailserverport: `465` (rekommenderas) eller `587`
   * Säkerhet: SSL/TLS (för 465, rekommenderas) eller STARTTLS (för 587)
   * Användarnamn: Din Forward Email-alias
   * Lösenord: Genererat lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Ställ in larm**
   * Gå till **System** > **Larmtjänster**
   * Konfigurera vilka larm som ska skickas via e-post
   * Ange mottagaradresser och larmnivåer
   * Testa konfigurationen med den inbyggda testfunktionen

> \[!IMPORTANT]
> TrueNAS låter dig konfigurera olika larmnivåer (INFO, NOTICE, WARNING, ERROR, CRITICAL). Välj lämpliga nivåer för att undvika e-postspam samtidigt som kritiska problem rapporteras.


## OpenMediaVault-konfiguration {#openmediavault-configuration}

OpenMediaVault erbjuder stabila e-postaviseringar via sitt webbgränssnitt. Installationsprocessen är enkel och tydlig.

> \[!NOTE]
> OpenMediaVaults aviseringar är plugin-baserade. Se till att du har e-postavisering-plugin installerad och aktiverad.

1. **Öppna aviseringar**
   * Öppna OpenMediaVault webbgränssnitt
   * Gå till **System** > **Avisering** > **E-post**

2. **Konfigurera SMTP-parametrar**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, rekommenderas) eller `587` (STARTTLS)
   * Användarnamn: Din Forward Email-alias
   * Lösenord: Genererat lösenord från [Mitt konto -> Domäner -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktivera SSL/TLS

3. **Ställ in aviseringregler**
   * Navigera till **System** > **Avisering** > **Aviseringar**
   * Konfigurera vilka systemhändelser som ska trigga e-post
   * Ange mottagaradresser
   * Testa e-postfunktionen

> \[!TIP]
> OpenMediaVault låter dig konfigurera aviseringstider. Du kan ställa in tysta timmar eller begränsa aviseringarnas frekvens för att undvika att bli överväldigad av larm.


## Raspberry Pi NAS-konfiguration {#raspberry-pi-nas-configuration}

Raspberry Pi är en utmärkt ingångspunkt till NAS-funktionalitet och erbjuder en kostnadseffektiv lösning för hem- och småkontorsmiljöer. Att konfigurera en Raspberry Pi som NAS-enhet innebär att ställa in fildelningsprotokoll, e-postaviseringar och viktiga nätverkstjänster.

> \[!TIP]
> För Raspberry Pi-entusiaster rekommenderar vi starkt att komplettera din NAS-konfiguration med [PiKVM](https://pikvm.org/) för fjärrhantering av servern och [Pi-hole](https://pi-hole.net/) för nätverksomfattande annonsblockering och DNS-hantering. Dessa verktyg skapar en komplett hemmalabbmiljö.
### Initial Raspberry Pi Setup {#initial-raspberry-pi-setup}

Innan du konfigurerar NAS-tjänster, se till att din Raspberry Pi kör den senaste Raspberry Pi OS och har tillräckligt med lagringsutrymme. Ett högkvalitativt microSD-kort (klass 10 eller bättre) eller USB 3.0 SSD ger bättre prestanda och tillförlitlighet för NAS-operationer.

1. **Uppdatera systemet** genom att köra `sudo apt update && sudo apt upgrade -y` för att säkerställa att alla paket är aktuella.

2. **Aktivera SSH-åtkomst** med `sudo systemctl enable ssh && sudo systemctl start ssh` för fjärradministration.

3. **Konfigurera statisk IP-adressering** genom att redigera `/etc/dhcpcd.conf` för att säkerställa konsekvent nätverksåtkomst.

4. **Ställ in extern lagring** genom att ansluta och montera USB-enheter eller konfigurera RAID-arrayer för datadubblering.

### Samba File Sharing Configuration {#samba-file-sharing-configuration}

Samba tillhandahåller Windows-kompatibel fildelning, vilket gör din Raspberry Pi tillgänglig från vilken enhet som helst i ditt nätverk. Konfigurationsprocessen innebär att installera Samba, skapa delningar och ställa in användarautentisering.

Installera Samba med `sudo apt install samba samba-common-bin` och konfigurera huvudkonfigurationsfilen på `/etc/samba/smb.conf`. Skapa delade kataloger och ställ in lämpliga behörigheter med `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Konfigurera Samba-delningar genom att lägga till sektioner i konfigurationsfilen för varje delad katalog. Ställ in användarautentisering med `sudo smbpasswd -a username` för att skapa Samba-specifika lösenord för nätverksåtkomst.

> \[!IMPORTANT]
> Använd alltid starka lösenord för Samba-användare och överväg att aktivera gäståtkomst endast för icke-känsliga delade mappar. Granska den [officiella Samba-dokumentationen](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) för avancerade säkerhetskonfigurationer.

### FTP Server Setup {#ftp-server-setup}

FTP erbjuder en annan metod för filåtkomst, särskilt användbar för automatiserade säkerhetskopior och fjärrfilhantering. Installera och konfigurera vsftpd (Very Secure FTP Daemon) för pålitliga FTP-tjänster.

Installera vsftpd med `sudo apt install vsftpd` och konfigurera tjänsten genom att redigera `/etc/vsftpd.conf`. Aktivera lokal användaråtkomst, konfigurera passivt läge och ställ in lämpliga säkerhetsbegränsningar.

Skapa FTP-användare och konfigurera katalogåtkomstbehörigheter. Överväg att använda SFTP (SSH File Transfer Protocol) istället för traditionell FTP för förbättrad säkerhet, eftersom det krypterar all datatrafik.

> \[!CAUTION]
> Traditionell FTP skickar lösenord i klartext. Använd alltid SFTP eller konfigurera FTP med TLS-kryptering för säkra filöverföringar. Granska [vsftpd:s säkerhetsriktlinjer](https://security.appspot.com/vsftpd.html) innan driftsättning.

### Email Notification Configuration {#email-notification-configuration}

Konfigurera din Raspberry Pi NAS för att skicka e-postaviseringar för systemhändelser, lagringsvarningar och status för säkerhetskopiering. Detta innebär att installera och konfigurera en mail transfer agent och ställa in Forward Email-integration.

Installera `msmtp` som en lättviktig SMTP-klient med `sudo apt install msmtp msmtp-mta`. Skapa konfigurationsfilen på `/etc/msmtprc` med följande inställningar:

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

Konfigurera systemaviseringar genom att ställa in cron-jobb och systemövervakningsskript som använder `msmtp` för att skicka varningar. Skapa skript för övervakning av diskutrymme, temperaturvarningar och aviseringar om slutförd säkerhetskopiering.

### Advanced Raspberry Pi NAS Features {#advanced-raspberry-pi-nas-features}

Förbättra din Raspberry Pi NAS med ytterligare tjänster och övervakningsmöjligheter. Installera och konfigurera nätverksövervakningsverktyg, automatiserade säkerhetskopieringslösningar och fjärråtkomsttjänster.

Ställ in [Nextcloud](https://nextcloud.com/) för molnliknande funktionalitet med webbaserad filåtkomst, kalendersynkronisering och samarbetsfunktioner. Installera med Docker eller den officiella Nextcloud-installationsguiden för Raspberry Pi.
Konfigurera automatiska säkerhetskopior med `rsync` och `cron` för att skapa schemalagda säkerhetskopior av kritisk data. Ställ in e-postaviseringar för slutförda säkerhetskopior och felmeddelanden med hjälp av din Forward Email-konfiguration.

Implementera nätverksövervakning med verktyg som [Nagios](https://www.nagios.org/) eller [Zabbix](https://www.zabbix.com/) för att övervaka systemhälsa, nätverksanslutning och tjänsters tillgänglighet.

> \[!NOTE]
> För användare som hanterar nätverksinfrastruktur, överväg att integrera [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) med din PiKVM-installation för fjärrstyrning av fysiska strömbrytare. Denna [Python-integrationsguide](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) ger detaljerade instruktioner för automatisering av fysisk enhetshantering.

### Raspberry Pi E-postfelsökning {#raspberry-pi-email-troubleshooting}

Vanliga problem med Raspberry Pi e-postkonfiguration inkluderar DNS-upplösningsproblem, brandväggsrestriktioner och autentiseringsfel. Raspberry Pi-systemens lätta natur kan ibland orsaka timingproblem med SMTP-anslutningar.

Om e-postaviseringar misslyckas, kontrollera `msmtp` loggfilen på `/var/log/msmtp.log` för detaljerade felmeddelanden. Verifiera att dina Forward Email-uppgifter är korrekta och att Raspberry Pi kan lösa `smtp.forwardemail.net`.

Testa e-postfunktionen med kommandoraden: `echo "Test message" | msmtp recipient@example.com`. Detta hjälper till att isolera konfigurationsproblem från applikationsspecifika problem.

Konfigurera korrekta DNS-inställningar i `/etc/resolv.conf` om du stöter på DNS-upplösningsproblem. Överväg att använda publika DNS-servrar som `8.8.8.8` eller `1.1.1.1` om lokal DNS är opålitlig.

### Prestandaoptimering {#performance-optimization}

Optimera din Raspberry Pi NAS-prestanda genom korrekt konfiguration av lagring, nätverksinställningar och systemresurser. Använd högkvalitativa lagringsenheter och konfigurera lämpliga filsystemsalternativ för ditt användningsområde.

Aktivera USB 3.0-boot för bättre lagringsprestanda om du använder externa enheter. Konfigurera GPU-minnesfördelning med `sudo raspi-config` för att tilldela mer RAM till systemoperationer snarare än grafikbehandling.

Övervaka systemprestanda med verktyg som `htop`, `iotop` och `nethogs` för att identifiera flaskhalsar och optimera resursanvändningen. Överväg att uppgradera till en Raspberry Pi 4 med 8GB RAM för krävande NAS-applikationer.

Implementera lämpliga kylsystem för att förhindra termisk nedklockning under intensiva operationer. Övervaka CPU-temperaturen med `/opt/vc/bin/vcgencmd measure_temp` och säkerställ tillräcklig ventilation.

### Säkerhetsaspekter {#security-considerations}

Säkra din Raspberry Pi NAS genom att implementera korrekta åtkomstkontroller, nätverkssäkerhetsåtgärder och regelbundna säkerhetsuppdateringar. Byt standardlösenord, inaktivera onödiga tjänster och konfigurera brandväggsregler.

Installera och konfigurera `fail2ban` för att skydda mot brute force-attacker på SSH och andra tjänster. Ställ in automatiska säkerhetsuppdateringar med `unattended-upgrades` för att säkerställa att kritiska säkerhetspatchar tillämpas snabbt.

Konfigurera nätverkssegmentering för att isolera din NAS från andra nätverksenheter när det är möjligt. Använd VPN-åtkomst för fjärranslutningar istället för att exponera tjänster direkt mot internet.

Säkerhetskopiera regelbundet din Raspberry Pi-konfiguration och data för att förhindra dataförlust vid hårdvarufel eller säkerhetsincidenter. Testa återställningsprocedurer för säkerhetskopior för att säkerställa återställningsmöjligheter.

Raspberry Pi NAS-konfigurationen ger en utmärkt grund för att lära sig nätverkslagringskoncept samtidigt som den levererar praktisk funktionalitet för hem- och småkontorsmiljöer. Kombinationen med Forward Email säkerställer pålitlig leverans av aviseringar för systemövervakning och underhållslarm.
