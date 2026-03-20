# Kompletn Guide til NAS Email Opsætning med Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Opsætning af email-notifikationer på din NAS behøver ikke være besværligt. Uanset om du har en Synology, QNAP eller endda en Raspberry Pi opsætning, vil denne guide få din enhed til at kommunikere med Forward Email, så du rent faktisk ved, når noget går galt.

De fleste NAS-enheder kan sende email-advarsler ved diskfejl, temperaturadvarsler, backup-færdiggørelse og sikkerhedshændelser. Problemet? Mange email-udbydere er blevet kræsne med sikkerheden, og ældre enheder kan ofte ikke følge med. Her kommer Forward Email ind i billedet – vi understøtter både moderne og ældre enheder.

Denne guide dækker email-opsætning for 75+ NAS-udbydere med trin-for-trin instruktioner, kompatibilitetsinfo og fejlfindingstips. Uanset hvilken enhed du bruger, får vi dine notifikationer til at fungere.


## Indholdsfortegnelse {#table-of-contents}

* [Hvorfor Du Har Brug for NAS Email Notifikationer](#why-you-need-nas-email-notifications)
* [TLS Problemet (Og Hvordan Vi Løser Det)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP Indstillinger](#forward-email-smtp-settings)
* [Omfattende NAS Udbyder Kompatibilitetsmatrix](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS Email Konfiguration](#synology-nas-email-configuration)
  * [Konfigurations Trin](#configuration-steps)
* [QNAP NAS Email Konfiguration](#qnap-nas-email-configuration)
  * [Konfigurations Trin](#configuration-steps-1)
  * [Almindelige QNAP Fejlfinding Problemer](#common-qnap-troubleshooting-issues)
* [ReadyNAS Legacy Konfiguration](#readynas-legacy-configuration)
  * [Legacy Konfigurations Trin](#legacy-configuration-steps)
  * [ReadyNAS Fejlfinding](#readynas-troubleshooting)
* [TerraMaster NAS Konfiguration](#terramaster-nas-configuration)
* [ASUSTOR NAS Konfiguration](#asustor-nas-configuration)
* [Buffalo TeraStation Konfiguration](#buffalo-terastation-configuration)
* [Western Digital My Cloud Konfiguration](#western-digital-my-cloud-configuration)
* [TrueNAS Email Konfiguration](#truenas-email-configuration)
* [OpenMediaVault Konfiguration](#openmediavault-configuration)
* [Raspberry Pi NAS Konfiguration](#raspberry-pi-nas-configuration)
  * [Initial Raspberry Pi Opsætning](#initial-raspberry-pi-setup)
  * [Samba Fildeling Konfiguration](#samba-file-sharing-configuration)
  * [FTP Server Opsætning](#ftp-server-setup)
  * [Email Notifikations Konfiguration](#email-notification-configuration)
  * [Avancerede Raspberry Pi NAS Funktioner](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi Email Fejlfinding](#raspberry-pi-email-troubleshooting)
  * [Ydelsesoptimering](#performance-optimization)
  * [Sikkerhedsovervejelser](#security-considerations)


## Hvorfor Du Har Brug for NAS Email Notifikationer {#why-you-need-nas-email-notifications}

Din NAS overvåger tonsvis af ting – diskhelbred, temperatur, netværksproblemer, sikkerhedshændelser. Uden email-advarsler kan problemer gå ubemærket hen i ugevis, hvilket potentielt kan føre til datatab eller sikkerhedsbrud.

Email-notifikationer giver dig øjeblikkelige advarsler, når diske begynder at fejle, advarer om uautoriserede adgangsforsøg, bekræfter vellykkede backups og holder dig informeret om systemets helbred. Forward Email sikrer, at disse kritiske notifikationer rent faktisk når frem til dig.


## TLS Problemet (Og Hvordan Vi Løser Det) {#the-tls-problem-and-how-we-fix-it}

Sådan er sagen: hvis din NAS er lavet før 2020, understøtter den sandsynligvis kun TLS 1.0. Gmail, Outlook og de fleste udbydere droppede support for det for år tilbage. Din enhed prøver at sende email, bliver afvist, og du står i mørket.

Forward Email løser dette med dual-port support. Moderne enheder bruger vores standardporte (`465` og `587`), mens ældre enheder kan bruge vores legacy-porte (`2455` og `2555`), som stadig understøtter TLS 1.0.

> \[!IMPORTANT]
> Forward Email understøtter både moderne og legacy NAS-enheder gennem vores dual-port strategi. Brug portene 465/587 til moderne enheder med TLS 1.2+ support, og portene 2455/2555 til legacy enheder, der kun understøtter TLS 1.0.


## Forward Email SMTP Indstillinger {#forward-email-smtp-settings}
Her er, hvad du skal vide om vores SMTP-opsætning:

**For moderne NAS-enheder (2020+):** Brug `smtp.forwardemail.net` med port `465` (SSL/TLS) eller port `587` (STARTTLS). Disse fungerer med den aktuelle firmware, der understøtter TLS 1.2+.

**For ældre NAS-enheder:** Brug `smtp.forwardemail.net` med port `2455` (SSL/TLS) eller port `2555` (STARTTLS). Disse understøtter TLS 1.0 for ældre enheder.

**Autentificering:** Brug dit Forward Email-alias som brugernavn og den genererede adgangskode fra [Min konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains) (ikke din kontoadgangskode).

> \[!CAUTION]
> Brug aldrig din kontologin-adgangskode til SMTP-autentificering. Brug altid den genererede adgangskode fra [Min konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains) til NAS-konfiguration.

> \[!TIP]
> Tjek din NAS-enheds firmwareversion og TLS-understøttelse før konfiguration. De fleste enheder fremstillet efter 2020 understøtter moderne TLS-protokoller, mens ældre enheder typisk kræver porte til ældre kompatibilitet.


## Omfattende kompatibilitetsmatrix for NAS-udbydere {#comprehensive-nas-provider-compatibility-matrix}

Følgende matrix giver detaljerede kompatibilitetsoplysninger for større NAS-udbydere, inklusive TLS-understøttelsesniveauer, firmwarestatus og anbefalede Forward Email-konfigurationsindstillinger.

| NAS-udbyder     | Nuværende modeller | TLS-understøttelse | Firmwarestatus | Anbefalede porte | Almindelige problemer                                                                                                                                    | Opsætningsvejledning/Skærmbilleder                                                                                                              |
| ---------------- | ------------------ | ------------------ | -------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Synology         | DSM 7.x            | TLS 1.2+           | Aktiv          | `465`, `587`     | [STARTTLS-konfiguration](https://community.synology.com/enu/forum/2/post/124584)                                                                         | [DSM Email Notification Setup](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                |
| QNAP             | QTS 5.x            | TLS 1.2+           | Aktiv          | `465`, `587`     | [Notification Center-fejl](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)       | [QTS Email Server Configuration](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS     | TLS 1.2+           | Aktiv          | `465`, `587`     | [DNS-opløsningsproblemer](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                     | [Raspberry Pi Email Setup Guide](#raspberry-pi-nas-configuration)                                                                               |
| ASUSTOR          | ADM 4.x            | TLS 1.2+           | Aktiv          | `465`, `587`     | [Certifikatvalidering](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                            | [ASUSTOR Notification Setup](https://www.asustor.com/en/online/online_help?id=8)                                                                |
| TerraMaster      | TOS 6.x            | TLS 1.2            | Aktiv          | `465`, `587`     | [SMTP-autentificering](https://www.terra-master.com/global/forum/)                                                                                      | [TerraMaster Email Configuration](https://www.terra-master.com/global/support/download.php)                                                     |
| TrueNAS          | SCALE/CORE          | TLS 1.2+           | Aktiv          | `465`, `587`     | [SSL-certifikatopsætning](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                              | [TrueNAS Email Setup Guide](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                     |
| Buffalo          | TeraStation        | TLS 1.2            | Begrænset      | `465`, `587`     | [Firmwarekompatibilitet](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)            | [TeraStation Email Setup](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)  |
| Western Digital  | My Cloud OS 5      | TLS 1.2            | Begrænset      | `465`, `587`     | [Ældre OS-kompatibilitet](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                  | [My Cloud Email Configuration](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                      |
| OpenMediaVault   | OMV 7.x            | TLS 1.2+           | Aktiv          | `465`, `587`     | [Plugin-afhængigheder](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                        | [OMV Notification Setup](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                   |
| Netgear ReadyNAS | OS 6.x             | TLS 1.0 kun        | Udfaset       | `2455`, `2555`   | [Ældre TLS-understøttelse](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                      | [ReadyNAS Email Alert Setup](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)           |
| Drobo            | Dashboard          | TLS 1.2            | Udfaset       | `465`, `587`     | [Begrænset understøttelse](https://myprojects.drobo.com/support/)                                                                                       | [Drobo Email Notifications](https://www.drobo.com/support/)                                                                                     |
Denne matrix demonstrerer den klare opdeling mellem moderne, aktivt vedligeholdte NAS-systemer og ældre enheder, der kræver særlige kompatibilitetsforanstaltninger. Størstedelen af nuværende NAS-enheder understøtter moderne TLS-standarder og kan bruge Forward Emails primære SMTP-porte uden nogen særlig konfiguration.


## Synology NAS Email Konfiguration {#synology-nas-email-configuration}

Synology-enheder med DSM er ret ligetil at sætte op. De understøtter moderne TLS, så du kan bruge vores standardporte uden problemer.

> \[!NOTE]
> Synology DSM 7.x tilbyder de mest omfattende e-mail notifikationsfunktioner. Ældre DSM-versioner kan have begrænsede konfigurationsmuligheder.

### Konfigurationstrin {#configuration-steps}

1. **Få adgang til DSM webgrænsefladen** ved at indtaste din NAS-enheds IP-adresse eller QuickConnect ID i en webbrowser.

2. **Naviger til Kontrolpanel** og vælg sektionen "Notifikation", klik derefter på fanen "Email" for at få adgang til e-mail konfigurationsmuligheder.

3. **Aktivér e-mail notifikationer** ved at markere afkrydsningsfeltet "Aktivér e-mail notifikationer".

4. **Konfigurer SMTP-serveren** ved at indtaste `smtp.forwardemail.net` som serveradresse.

5. **Indstil portkonfigurationen** til port 465 for SSL/TLS-forbindelser (anbefalet). Port 587 med STARTTLS understøttes også som et alternativ.

6. **Konfigurer autentificering** ved at vælge "SMTP autentificering påkrævet" og indtaste dit Forward Email alias i brugernavn-feltet.

7. **Indtast din adgangskode** ved at bruge den adgangskode, der er genereret fra [Min Konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains).

8. **Opsæt modtageradresser** ved at indtaste op til fem e-mailadresser, som skal modtage notifikationer.

9. **Konfigurer notifikationsfiltrering** for at kontrollere, hvilke hændelser der udløser e-mail advarsler, så du undgår overbelastning af notifikationer, samtidig med at kritiske hændelser rapporteres.

10. **Test konfigurationen** ved hjælp af DSM's indbyggede testfunktion for at verificere, at alle indstillinger er korrekte, og at kommunikationen med Forward Emails servere fungerer korrekt.

> \[!TIP]
> Synology tillader forskellige notifikationstyper for forskellige modtagere, hvilket giver fleksibilitet i, hvordan advarsler distribueres i dit team.


## QNAP NAS Email Konfiguration {#qnap-nas-email-configuration}

QNAP-enheder med QTS fungerer godt med Forward Email. De understøtter moderne TLS og har en flot webgrænseflade til konfiguration.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 havde et kendt problem med e-mail notifikationer, som blev [fikset i QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Sørg for, at din firmware er opdateret for at undgå fejl i notifikationer.

### Konfigurationstrin {#configuration-steps-1}

1. **Få adgang til din QNAP-enheds webgrænseflade** ved at indtaste dens IP-adresse i en webbrowser.

2. **Naviger til Kontrolpanel** og vælg "Servicekonto og Enhedsparring", klik derefter på sektionen "E-mail" for at begynde e-mail konfigurationen.

3. **Klik på "Tilføj SMTP-tjeneste"** for at oprette en ny e-mail konfiguration.

4. **Konfigurer SMTP-serveren** ved at indtaste `smtp.forwardemail.net` som SMTP-serveradresse.

5. **Vælg det passende sikkerhedsprotokol** - vælg "SSL/TLS" med port `465` (anbefalet). Port `587` med STARTTLS understøttes også.

6. **Konfigurer portnummeret** - port `465` med SSL/TLS anbefales. Port `587` med STARTTLS er også tilgængelig, hvis nødvendigt.

7. **Indtast dine autentificeringsoplysninger** ved at bruge dit Forward Email alias som brugernavn og din genererede adgangskode fra [Min Konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains).

8. **Konfigurer afsenderinformation** ved at indtaste et beskrivende navn til "Fra"-feltet, såsom "QNAP NAS System" eller din enheds værtsnavn.

9. **Opsæt modtageradresser** for forskellige notifikationstyper. QNAP tillader, at du konfigurerer flere modtagergrupper for forskellige advarselstyper.

10. **Test konfigurationen** ved hjælp af QNAP's indbyggede e-mail testfunktion for at sikre, at alle indstillinger fungerer korrekt.

> \[!TIP]
> Hvis du støder på [Gmail SMTP konfigurationsproblemer](https://forum.qnap.com/viewtopic.php?t=152466), gælder de samme fejlfindingstrin for Forward Email. Sørg for, at autentificering er korrekt aktiveret, og at legitimationsoplysningerne er korrekte.
> \[!NOTE]
> QNAP-enheder understøtter avanceret notifikationsplanlægning, så du kan konfigurere stille timer, hvor ikke-kritiske notifikationer undertrykkes. Dette er særligt nyttigt i erhvervsmiljøer.

### Almindelige QNAP-fejlfindingsproblemer {#common-qnap-troubleshooting-issues}

Hvis din QNAP-enhed [ikke sender notifikations-e-mails](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), skal du tjekke følgende:

* Bekræft, at dine Forward Email-legitimationsoplysninger er korrekte
* Sørg for, at SMTP-serveradressen er præcis `smtp.forwardemail.net`
* Bekræft, at porten matcher din krypteringsmetode (`465` for SSL/TLS anbefales; `587` for STARTTLS understøttes også)
* Tjek, at din [SMTP-serverkonfiguration](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) tillader forbindelsen


## ReadyNAS Legacy-konfiguration {#readynas-legacy-configuration}

Netgear ReadyNAS-enheder udgør unikke udfordringer på grund af deres ophørte firmwareunderstøttelse og afhængighed af ældre TLS 1.0-protokoller. Dog sikrer Forward Emails legacy-portunderstøttelse, at disse enheder fortsat kan sende e-mail-notifikationer pålideligt.

> \[!CAUTION]
> ReadyNAS OS 6.x understøtter kun TLS 1.0, hvilket kræver Forward Emails legacy-kompatible porte `2455` og `2555`. Moderne porte `465` og `587` fungerer ikke med disse enheder.

### Legacy-konfigurationstrin {#legacy-configuration-steps}

1. **Få adgang til ReadyNAS-webgrænsefladen** ved at indtaste enhedens IP-adresse i en webbrowser.

2. **Naviger til System > Indstillinger > Advarsler** for at få adgang til e-mail-konfigurationssektionen.

3. **Konfigurer SMTP-serveren** ved at indtaste `smtp.forwardemail.net` som serveradresse.

4. **Indstil portkonfigurationen** til enten `2455` for SSL/TLS-forbindelser eller `2555` for STARTTLS-forbindelser - disse er Forward Emails legacy-kompatible porte.

5. **Aktivér godkendelse** og indtast dit Forward Email-alias som brugernavn og din genererede adgangskode fra [Min konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains).

6. **Konfigurer afsenderoplysninger** med en beskrivende "Fra"-adresse for at identificere ReadyNAS-enheden.

7. **Tilføj modtager-e-mailadresser** ved hjælp af + knappen i e-mail-kontaktsektionen.

8. **Test konfigurationen** for at sikre, at legacy TLS-forbindelsen fungerer korrekt.

> \[!IMPORTANT]
> ReadyNAS-enheder kræver legacy-portene, fordi de ikke kan etablere sikre forbindelser ved hjælp af moderne TLS-protokoller. Dette er en [kendt begrænsning](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) i den ophørte firmware.

### ReadyNAS-fejlretning {#readynas-troubleshooting}

Almindelige problemer med ReadyNAS e-mail-konfiguration inkluderer:

* **TLS-version mismatch**: Sørg for, at du bruger portene `2455` eller `2555`, ikke de moderne porte
* **Godkendelsesfejl**: Bekræft, at dine Forward Email-legitimationsoplysninger er korrekte
* **Netværksforbindelse**: Tjek, at ReadyNAS kan nå `smtp.forwardemail.net`
* **Firmwarebegrænsninger**: Nogle ældre ReadyNAS-modeller kan have yderligere [HTTPS-konfigurationskrav](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

ReadyNAS-enheder, der kører OS 6.x og tidligere versioner, understøtter kun TLS 1.0-forbindelser, som de fleste moderne e-mail-udbydere ikke længere accepterer. Forward Emails dedikerede legacy-porte (2455 og 2555) understøtter specifikt disse ældre protokoller og sikrer fortsat funktionalitet for ReadyNAS-brugere.

For at konfigurere e-mail på ReadyNAS-enheder skal du få adgang til enhedens webgrænseflade via dens IP-adresse. Naviger til System-sektionen og vælg "Notifikationer" for at få adgang til e-mail-konfigurationsmuligheder.

I e-mail-konfigurationssektionen skal du aktivere e-mail-notifikationer og indtaste smtp.forwardemail.net som SMTP-server. Dette er afgørende - brug Forward Emails legacy-kompatible porte i stedet for standard SMTP-porte.

For SSL/TLS-forbindelser skal du konfigurere port 2455 i stedet for standardport 465 (anbefalet). For STARTTLS-forbindelser skal du bruge port 2555 i stedet for port 587. Disse specielle porte opretholder TLS 1.0-kompatibilitet samtidig med, at de giver den bedste tilgængelige sikkerhed for legacy-enheder.
Indtast dit Forward Email-alias som brugernavn og din genererede adgangskode til godkendelse. ReadyNAS-enheder understøtter SMTP-godkendelse, hvilket er påkrævet for Forward Email-forbindelser.

Konfigurer afsenderens e-mailadresse og modtageradresser i henhold til dine notifikationskrav. ReadyNAS tillader flere modtageradresser, så du kan distribuere advarsler til forskellige teammedlemmer eller e-mailkonti.

Test konfigurationen grundigt, da ReadyNAS-enheder muligvis ikke giver detaljerede fejlmeddelelser, hvis konfigurationen fejler. Hvis standardtest ikke virker, skal du kontrollere, at du bruger de korrekte legacy-porte (2455 eller 2555) i stedet for moderne SMTP-porte.

Overvej sikkerhedsmæssige konsekvenser ved brug af legacy TLS-protokoller. Mens Forward Emails legacy-porte giver den bedste tilgængelige sikkerhed for ældre enheder, anbefales det at opgradere til et moderne NAS-system med aktuel TLS-understøttelse, når det er muligt.


## TerraMaster NAS-konfiguration {#terramaster-nas-configuration}

TerraMaster-enheder med TOS 6.x understøtter moderne TLS og fungerer godt med Forward Emails standardporte.

> \[!NOTE]
> TerraMaster TOS 6.x tilbyder omfattende e-mailnotifikationsfunktioner. Sørg for, at din firmware er opdateret for bedst mulig kompatibilitet.

1. **Åbn systemindstillinger**
   * Log ind på din TerraMaster-webgrænseflade
   * Gå til **Kontrolpanel** > **Notifikation**

2. **Konfigurer SMTP-indstillinger**
   * Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalet) eller `587` (STARTTLS)
   * Brugernavn: Dit Forward Email-alias
   * Adgangskode: Genereret adgangskode fra [Min konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Aktivér notifikationer**
   * Marker de notifikationstyper, du ønsker at modtage
   * Test konfigurationen med den indbyggede testfunktion

> \[!TIP]
> TerraMaster-enheder fungerer bedst med port `465` til SSL/TLS-forbindelser (anbefalet). Hvis du oplever problemer, understøttes port `587` med STARTTLS også.


## ASUSTOR NAS-konfiguration {#asustor-nas-configuration}

ASUSTOR-enheder med ADM 4.x har solid e-mailnotifikationsunderstøttelse og fungerer problemfrit med Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x inkluderer avancerede filtreringsmuligheder for notifikationer. Du kan tilpasse, hvilke hændelser der udløser e-mailadvarsler.

1. **Åbn notifikationsindstillinger**
   * Gå til ADM-webgrænsefladen
   * Vælg **Indstillinger** > **Notifikation**

2. **Opsæt SMTP-konfiguration**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalet) eller `587` (STARTTLS)
   * Godkendelse: Aktivér
   * Brugernavn: Dit Forward Email-alias
   * Adgangskode: Genereret adgangskode fra [Min konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Konfigurer alarmtyper**
   * Vælg hvilke systemhændelser der skal udløse e-mails
   * Opsæt modtageradresser
   * Test konfigurationen

> \[!IMPORTANT]
> ASUSTOR-enheder kræver, at godkendelse eksplicit aktiveres i SMTP-indstillingerne. Glem ikke at markere denne mulighed.


## Buffalo TeraStation-konfiguration {#buffalo-terastation-configuration}

Buffalo TeraStation-enheder har begrænsede, men funktionelle e-mailnotifikationsmuligheder. Opsætningen er enkel, når du ved, hvor du skal kigge.

> \[!CAUTION]
> Firmwareopdateringer til Buffalo TeraStation er sjældne. Sørg for, at du bruger den nyeste tilgængelige firmware til din model, før du konfigurerer e-mail.

1. **Åbn webkonfiguration**
   * Forbind til din TeraStations webgrænseflade
   * Gå til **System** > **Notifikation**

2. **Konfigurer e-mailindstillinger**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalet) eller `587` (STARTTLS)
   * Brugernavn: Dit Forward Email-alias
   * Adgangskode: Genereret adgangskode fra [Min konto -> Domæner -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktivér SSL/TLS-kryptering

3. **Indstil notifikationspræferencer**
   * Vælg hvilke hændelser der skal udløse e-mails (diskfejl, temperaturadvarsler osv.)
   * Indtast modtager-e-mailadresser
   * Gem og test konfigurationen

> \[!NOTE]
> Nogle ældre TeraStation-modeller kan have begrænsede SMTP-konfigurationsmuligheder. Tjek dokumentationen for din model for specifikke funktioner.
## Western Digital My Cloud Konfiguration {#western-digital-my-cloud-configuration}

Western Digital My Cloud-enheder, der kører OS 5, understøtter e-mail-notifikationer, selvom grænsefladen kan være lidt gemt i indstillingerne.

> \[!WARNING]
> Western Digital har ophørt med at støtte mange My Cloud-modeller. Tjek om din enhed stadig modtager firmwareopdateringer, før du stoler på e-mail-notifikationer til kritiske advarsler.

1. **Naviger til Indstillinger**
   * Åbn My Cloud web-dashboardet
   * Gå til **Indstillinger** > **Generelt** > **Notifikationer**

2. **Konfigurer SMTP-detaljer**
   * Mailserver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalet) eller `587` (STARTTLS)
   * Brugernavn: Dit Forward Email alias
   * Adgangskode: Genereret adgangskode fra [Min Konto -> Domæner -> Aliasser](https://forwardemail.net/my-account/domains)
   * Aktiver kryptering

3. **Opsæt Alert-typer**
   * Vælg notifikationskategorier (systemadvarsler, diskhelbred osv.)
   * Tilføj modtager-e-mailadresser
   * Test e-mail-konfigurationen

> \[!TIP]
> Vi anbefaler at bruge port `465` med SSL/TLS. Hvis du oplever problemer, understøttes port `587` med STARTTLS også.


## TrueNAS Email Konfiguration {#truenas-email-configuration}

TrueNAS (både SCALE og CORE) har fremragende understøttelse af e-mail-notifikationer med detaljerede konfigurationsmuligheder.

> \[!NOTE]
> TrueNAS tilbyder nogle af de mest omfattende e-mail-notifikationsfunktioner blandt NAS-systemer. Du kan konfigurere detaljerede alarmregler og flere modtagere.

1. **Adgang til Systemindstillinger**
   * Log ind på TrueNAS webgrænsefladen
   * Naviger til **System** > **Email**

2. **Konfigurer SMTP-indstillinger**
   * Udgående mailserver: `smtp.forwardemail.net`
   * Mailserverport: `465` (anbefalet) eller `587`
   * Sikkerhed: SSL/TLS (for 465, anbefalet) eller STARTTLS (for 587)
   * Brugernavn: Dit Forward Email alias
   * Adgangskode: Genereret adgangskode fra [Min Konto -> Domæner -> Aliasser](https://forwardemail.net/my-account/domains)

3. **Opsæt Advarsler**
   * Gå til **System** > **Alert Services**
   * Konfigurer hvilke advarsler der skal sendes via e-mail
   * Indstil modtageradresser og alarmniveauer
   * Test konfigurationen med den indbyggede testfunktion

> \[!IMPORTANT]
> TrueNAS giver dig mulighed for at konfigurere forskellige alarmniveauer (INFO, NOTICE, WARNING, ERROR, CRITICAL). Vælg passende niveauer for at undgå e-mail-spam samtidig med, at kritiske problemer rapporteres.


## OpenMediaVault Konfiguration {#openmediavault-configuration}

OpenMediaVault tilbyder solide e-mail-notifikationsmuligheder gennem sin webgrænseflade. Opsætningsprocessen er enkel og ligetil.

> \[!NOTE]
> OpenMediaVaults notifikationssystem er plugin-baseret. Sørg for, at du har installeret og aktiveret e-mail-notifikationsplugin'et.

1. **Adgang til Notifikationsindstillinger**
   * Åbn OpenMediaVault webgrænsefladen
   * Gå til **System** > **Notifikation** > **Email**

2. **Konfigurer SMTP-parametre**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalet) eller `587` (STARTTLS)
   * Brugernavn: Dit Forward Email alias
   * Adgangskode: Genereret adgangskode fra [Min Konto -> Domæner -> Aliasser](https://forwardemail.net/my-account/domains)
   * Aktiver SSL/TLS

3. **Opsæt Notifikationsregler**
   * Naviger til **System** > **Notifikation** > **Notifikationer**
   * Konfigurer hvilke systembegivenheder der skal udløse e-mails
   * Indstil modtageradresser
   * Test e-mail-funktionaliteten

> \[!TIP]
> OpenMediaVault giver dig mulighed for at konfigurere notifikationsplaner. Du kan sætte stille timer eller begrænse notifikationsfrekvensen for at undgå at blive overvældet af advarsler.


## Raspberry Pi NAS Konfiguration {#raspberry-pi-nas-configuration}

Raspberry Pi repræsenterer et fremragende indgangspunkt til NAS-funktionalitet og tilbyder en omkostningseffektiv løsning til hjemmet og små kontormiljøer. Opsætning af en Raspberry Pi som NAS-enhed involverer konfiguration af fildelingsprotokoller, e-mail-notifikationer og essentielle netværkstjenester.

> \[!TIP]
> For Raspberry Pi-entusiaster anbefaler vi stærkt at supplere din NAS-opsætning med [PiKVM](https://pikvm.org/) til fjernserveradministration og [Pi-hole](https://pi-hole.net/) til netværksdækkende annonceblokering og DNS-administration. Disse værktøjer skaber et omfattende hjemmelaboratorium.
### Initial Raspberry Pi Setup {#initial-raspberry-pi-setup}

Før du konfigurerer NAS-tjenester, skal du sikre dig, at din Raspberry Pi kører den nyeste Raspberry Pi OS og har tilstrækkelig lagerplads. Et mikroSD-kort af høj kvalitet (klasse 10 eller bedre) eller en USB 3.0 SSD giver bedre ydeevne og pålidelighed til NAS-drift.

1. **Opdater systemet** ved at køre `sudo apt update && sudo apt upgrade -y` for at sikre, at alle pakker er opdaterede.

2. **Aktivér SSH-adgang** ved hjælp af `sudo systemctl enable ssh && sudo systemctl start ssh` til fjernadministration.

3. **Konfigurer statisk IP-adressering** ved at redigere `/etc/dhcpcd.conf` for at sikre konsekvent netværksadgang.

4. **Opsæt ekstern lagring** ved at tilslutte og mounte USB-drev eller konfigurere RAID-arrays for datadobbeltsikring.

### Samba File Sharing Configuration {#samba-file-sharing-configuration}

Samba leverer Windows-kompatibel fildeling, hvilket gør din Raspberry Pi tilgængelig fra enhver enhed på dit netværk. Konfigurationsprocessen involverer installation af Samba, oprettelse af shares og opsætning af brugergodkendelse.

Installer Samba ved hjælp af `sudo apt install samba samba-common-bin` og konfigurer hovedkonfigurationsfilen på `/etc/samba/smb.conf`. Opret delte mapper og sæt passende tilladelser med `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Konfigurer Samba-shares ved at tilføje sektioner til konfigurationsfilen for hver delt mappe. Opsæt brugergodkendelse med `sudo smbpasswd -a username` for at oprette Samba-specifikke adgangskoder til netværksadgang.

> \[!IMPORTANT]
> Brug altid stærke adgangskoder til Samba-brugere, og overvej kun at aktivere gæsteadgang for ikke-følsomme delte mapper. Gennemgå den [officielle Samba-dokumentation](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) for avancerede sikkerhedskonfigurationer.

### FTP Server Setup {#ftp-server-setup}

FTP tilbyder en anden metode til filadgang, særligt nyttig til automatiserede backups og fjernfilhåndtering. Installer og konfigurer vsftpd (Very Secure FTP Daemon) for pålidelige FTP-tjenester.

Installer vsftpd med `sudo apt install vsftpd` og konfigurer tjenesten ved at redigere `/etc/vsftpd.conf`. Aktivér lokal brugeradgang, konfigurer passive mode-indstillinger, og opsæt passende sikkerhedsrestriktioner.

Opret FTP-brugere og konfigurer adgangstilladelser til mapper. Overvej at bruge SFTP (SSH File Transfer Protocol) i stedet for traditionel FTP for øget sikkerhed, da det krypterer al datatransmission.

> \[!CAUTION]
> Traditionel FTP sender adgangskoder i klar tekst. Brug altid SFTP eller konfigurer FTP med TLS-kryptering for sikre filoverførsler. Gennemgå [vsftpd sikkerhedspraksis](https://security.appspot.com/vsftpd.html) før implementering.

### Email Notification Configuration {#email-notification-configuration}

Konfigurer din Raspberry Pi NAS til at sende e-mail-notifikationer for systembegivenheder, lageradvarsler og backupstatus. Dette involverer installation og konfiguration af en mail transfer agent samt opsætning af Forward Email-integration.

Installer `msmtp` som en letvægts SMTP-klient med `sudo apt install msmtp msmtp-mta`. Opret konfigurationsfilen på `/etc/msmtprc` med følgende indstillinger:

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

Konfigurer systemnotifikationer ved at opsætte cron-jobs og systemovervågningsscripts, der bruger `msmtp` til at sende alarmer. Opret scripts til overvågning af diskplads, temperaturadvarsler og backupfærdiggørelsesnotifikationer.

### Advanced Raspberry Pi NAS Features {#advanced-raspberry-pi-nas-features}

Forbedr din Raspberry Pi NAS med yderligere tjenester og overvågningsmuligheder. Installer og konfigurer netværksovervågningsværktøjer, automatiserede backup-løsninger og fjernadgangstjenester.

Opsæt [Nextcloud](https://nextcloud.com/) for cloud-lignende funktionalitet med webbaseret filadgang, kalender-synkronisering og samarbejdsfunktioner. Installer ved hjælp af Docker eller den officielle Nextcloud installationsvejledning til Raspberry Pi.
Konfigurer automatiserede backups ved hjælp af `rsync` og `cron` for at oprette planlagte backups af kritiske data. Opsæt e-mail notifikationer for backup fuldførelse og fejlalarmer ved hjælp af din Forward Email konfiguration.

Implementer netværksovervågning ved hjælp af værktøjer som [Nagios](https://www.nagios.org/) eller [Zabbix](https://www.zabbix.com/) for at overvåge systemets sundhed, netværksforbindelse og service tilgængelighed.

> \[!NOTE]
> For brugere, der administrerer netværksinfrastruktur, overvej at integrere [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) med dit PiKVM setup for fjernstyring af fysiske kontakter. Denne [Python integrationsguide](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) giver detaljerede instruktioner til automatisering af fysisk enhedsstyring.

### Raspberry Pi Email Fejlfinding {#raspberry-pi-email-troubleshooting}

Almindelige problemer med Raspberry Pi e-mail konfiguration inkluderer DNS-opløsningsproblemer, firewall-begrænsninger og autentificeringsfejl. Den lette karakter af Raspberry Pi systemer kan nogle gange forårsage timing-problemer med SMTP-forbindelser.

Hvis e-mail notifikationer fejler, tjek `msmtp` logfilen på `/var/log/msmtp.log` for detaljerede fejlmeddelelser. Bekræft, at dine Forward Email legitimationsoplysninger er korrekte, og at Raspberry Pi kan løse `smtp.forwardemail.net`.

Test e-mail funktionalitet ved hjælp af kommandolinjen: `echo "Test message" | msmtp recipient@example.com`. Dette hjælper med at isolere konfigurationsproblemer fra applikationsspecifikke problemer.

Konfigurer korrekte DNS-indstillinger i `/etc/resolv.conf`, hvis du oplever DNS-opløsningsproblemer. Overvej at bruge offentlige DNS-servere som `8.8.8.8` eller `1.1.1.1`, hvis lokal DNS er upålidelig.

### Ydelsesoptimering {#performance-optimization}

Optimer din Raspberry Pi NAS ydeevne gennem korrekt konfiguration af lager, netværksindstillinger og systemressourcer. Brug lagringsenheder af høj kvalitet og konfigurer passende filsystemindstillinger til dit brugstilfælde.

Aktivér USB 3.0 boot for bedre lagerydelse, hvis du bruger eksterne drev. Konfigurer GPU hukommelsesdeling ved hjælp af `sudo raspi-config` for at tildele mere RAM til systemoperationer frem for grafikbehandling.

Overvåg systemets ydeevne ved hjælp af værktøjer som `htop`, `iotop` og `nethogs` for at identificere flaskehalse og optimere ressourceforbruget. Overvej at opgradere til en Raspberry Pi 4 med 8GB RAM til krævende NAS-applikationer.

Implementer passende køleløsninger for at forhindre termisk nedskalering under intensive operationer. Overvåg CPU-temperaturen ved hjælp af `/opt/vc/bin/vcgencmd measure_temp` og sørg for tilstrækkelig ventilation.

### Sikkerhedsovervejelser {#security-considerations}

Sikre din Raspberry Pi NAS ved at implementere korrekte adgangskontroller, netværkssikkerhedsforanstaltninger og regelmæssige sikkerhedsopdateringer. Skift standardadgangskoder, deaktiver unødvendige tjenester, og konfigurer firewall-regler.

Installer og konfigurer `fail2ban` for at beskytte mod brute force angreb på SSH og andre tjenester. Opsæt automatiske sikkerhedsopdateringer ved hjælp af `unattended-upgrades` for at sikre, at kritiske sikkerhedsrettelser anvendes hurtigt.

Konfigurer netværkssegmentering for at isolere din NAS fra andre netværksenheder, når det er muligt. Brug VPN-adgang til fjernforbindelser i stedet for at eksponere tjenester direkte mod internettet.

Tag regelmæssige backups af din Raspberry Pi konfiguration og data for at forhindre datatab ved hardwarefejl eller sikkerhedshændelser. Test backup-gendannelsesprocedurer for at sikre datagendannelsesmuligheder.

Raspberry Pi NAS konfigurationen giver et fremragende fundament for at lære netværkslagringskoncepter samtidig med at den leverer praktisk funktionalitet til hjem og små kontormiljøer. Kombinationen med Forward Email sikrer pålidelig notifikationslevering til systemovervågning og vedligeholdelsesalarmer.
