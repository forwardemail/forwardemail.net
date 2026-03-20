# Komplettanleitung zur NAS-E-Mail-Einrichtung mit Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Die Einrichtung von E-Mail-Benachrichtigungen auf Ihrem NAS sollte keine Qual sein. Egal, ob Sie ein Synology, QNAP oder sogar ein Raspberry Pi Setup haben, diese Anleitung bringt Ihr Gerät dazu, mit Forward Email zu kommunizieren, damit Sie tatsächlich wissen, wenn etwas schiefgeht.

Die meisten NAS-Geräte können E-Mail-Benachrichtigungen für Festplattenausfälle, Temperaturwarnungen, Backup-Abschlüsse und Sicherheitsereignisse senden. Das Problem? Viele E-Mail-Anbieter sind in Bezug auf Sicherheit wählerisch geworden, und ältere Geräte können oft nicht mithalten. Hier kommt Forward Email ins Spiel – wir unterstützen sowohl moderne als auch ältere Geräte.

Diese Anleitung behandelt die E-Mail-Einrichtung für über 75 NAS-Anbieter mit Schritt-für-Schritt-Anleitungen, Kompatibilitätsinformationen und Fehlerbehebungstipps. Egal, welches Gerät Sie verwenden, wir bringen Ihre Benachrichtigungen zum Laufen.


## Inhaltsverzeichnis {#table-of-contents}

* [Warum Sie NAS-E-Mail-Benachrichtigungen benötigen](#why-you-need-nas-email-notifications)
* [Das TLS-Problem (und wie wir es lösen)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP-Einstellungen](#forward-email-smtp-settings)
* [Umfassende Kompatibilitätsmatrix für NAS-Anbieter](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS E-Mail-Konfiguration](#synology-nas-email-configuration)
  * [Konfigurationsschritte](#configuration-steps)
* [QNAP NAS E-Mail-Konfiguration](#qnap-nas-email-configuration)
  * [Konfigurationsschritte](#configuration-steps-1)
  * [Häufige QNAP-Fehlerbehebung](#common-qnap-troubleshooting-issues)
* [ReadyNAS Legacy-Konfiguration](#readynas-legacy-configuration)
  * [Legacy-Konfigurationsschritte](#legacy-configuration-steps)
  * [ReadyNAS Fehlerbehebung](#readynas-troubleshooting)
* [TerraMaster NAS-Konfiguration](#terramaster-nas-configuration)
* [ASUSTOR NAS-Konfiguration](#asustor-nas-configuration)
* [Buffalo TeraStation-Konfiguration](#buffalo-terastation-configuration)
* [Western Digital My Cloud-Konfiguration](#western-digital-my-cloud-configuration)
* [TrueNAS E-Mail-Konfiguration](#truenas-email-configuration)
* [OpenMediaVault-Konfiguration](#openmediavault-configuration)
* [Raspberry Pi NAS-Konfiguration](#raspberry-pi-nas-configuration)
  * [Erste Raspberry Pi Einrichtung](#initial-raspberry-pi-setup)
  * [Samba-Dateifreigabe-Konfiguration](#samba-file-sharing-configuration)
  * [FTP-Server-Einrichtung](#ftp-server-setup)
  * [E-Mail-Benachrichtigungs-Konfiguration](#email-notification-configuration)
  * [Erweiterte Raspberry Pi NAS-Funktionen](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi E-Mail-Fehlerbehebung](#raspberry-pi-email-troubleshooting)
  * [Leistungsoptimierung](#performance-optimization)
  * [Sicherheitsüberlegungen](#security-considerations)


## Warum Sie NAS-E-Mail-Benachrichtigungen benötigen {#why-you-need-nas-email-notifications}

Ihr NAS überwacht eine Menge – Festplattengesundheit, Temperatur, Netzwerkprobleme, Sicherheitsereignisse. Ohne E-Mail-Benachrichtigungen können Probleme wochenlang unbemerkt bleiben, was potenziell zu Datenverlust oder Sicherheitsverletzungen führt.

E-Mail-Benachrichtigungen geben Ihnen sofortige Warnungen, wenn Festplatten ausfallen, warnen vor unbefugten Zugriffsversuchen, bestätigen erfolgreiche Backups und halten Sie über den Systemzustand auf dem Laufenden. Forward Email stellt sicher, dass diese wichtigen Benachrichtigungen Sie tatsächlich erreichen.


## Das TLS-Problem (und wie wir es lösen) {#the-tls-problem-and-how-we-fix-it}

So sieht’s aus: Wenn Ihr NAS vor 2020 hergestellt wurde, unterstützt es wahrscheinlich nur TLS 1.0. Gmail, Outlook und die meisten Anbieter haben die Unterstützung dafür vor Jahren eingestellt. Ihr Gerät versucht, E-Mails zu senden, wird abgelehnt, und Sie bleiben im Dunkeln.

Forward Email löst das mit Dual-Port-Unterstützung. Moderne Geräte verwenden unsere Standardports (`465` und `587`), während ältere Geräte unsere Legacy-Ports (`2455` und `2555`) nutzen können, die noch TLS 1.0 unterstützen.

> \[!IMPORTANT]
> Forward Email unterstützt sowohl moderne als auch ältere NAS-Geräte durch unsere Dual-Port-Strategie. Verwenden Sie die Ports 465/587 für moderne Geräte mit TLS 1.2+ Unterstützung und die Ports 2455/2555 für Legacy-Geräte, die nur TLS 1.0 unterstützen.


## Forward Email SMTP-Einstellungen {#forward-email-smtp-settings}
Hier ist, was Sie über unsere SMTP-Einrichtung wissen müssen:

**Für moderne NAS-Geräte (2020+):** Verwenden Sie `smtp.forwardemail.net` mit Port `465` (SSL/TLS) oder Port `587` (STARTTLS). Diese funktionieren mit aktueller Firmware, die TLS 1.2+ unterstützt.

**Für ältere NAS-Geräte:** Verwenden Sie `smtp.forwardemail.net` mit Port `2455` (SSL/TLS) oder Port `2555` (STARTTLS). Diese unterstützen TLS 1.0 für Legacy-Geräte.

**Authentifizierung:** Verwenden Sie Ihren Forward Email-Alias als Benutzernamen und das generierte Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains) (nicht Ihr Kontopasswort).

> \[!CAUTION]
> Verwenden Sie niemals Ihr Kontologin-Passwort für die SMTP-Authentifizierung. Verwenden Sie immer das generierte Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains) für die NAS-Konfiguration.

> \[!TIP]
> Überprüfen Sie vor der Konfiguration die Firmware-Version und TLS-Unterstützung Ihres NAS-Geräts. Die meisten Geräte, die nach 2020 hergestellt wurden, unterstützen moderne TLS-Protokolle, während ältere Geräte typischerweise Legacy-Kompatibilitätsports benötigen.


## Umfassende NAS-Anbieter-Kompatibilitätsmatrix {#comprehensive-nas-provider-compatibility-matrix}

Die folgende Matrix bietet detaillierte Kompatibilitätsinformationen für wichtige NAS-Anbieter, einschließlich TLS-Unterstützungsstufen, Firmware-Status und empfohlene Forward Email-Konfigurationseinstellungen.

| NAS-Anbieter    | Aktuelle Modelle | TLS-Unterstützung | Firmware-Status | Empfohlene Ports | Häufige Probleme                                                                                                                                       | Einrichtungsanleitung/Screenshots                                                                                                              |
| --------------- | ---------------- | ----------------- | --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology        | DSM 7.x          | TLS 1.2+          | Aktiv           | `465`, `587`     | [STARTTLS-Konfiguration](https://community.synology.com/enu/forum/2/post/124584)                                                                      | [DSM E-Mail-Benachrichtigungs-Einrichtung](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                   |
| QNAP            | QTS 5.x          | TLS 1.2+          | Aktiv           | `465`, `587`     | [Benachrichtigungscenter-Ausfälle](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525) | [QTS E-Mail-Server-Konfiguration](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi    | Raspberry Pi OS  | TLS 1.2+          | Aktiv           | `465`, `587`     | [DNS-Auflösungsprobleme](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                  | [Raspberry Pi E-Mail-Einrichtungsanleitung](#raspberry-pi-nas-configuration)                                                                  |
| ASUSTOR         | ADM 4.x          | TLS 1.2+          | Aktiv           | `465`, `587`     | [Zertifikatsvalidierung](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                       | [ASUSTOR Benachrichtigungs-Einrichtung](https://www.asustor.com/en/online/online_help?id=8)                                                     |
| TerraMaster     | TOS 6.x          | TLS 1.2           | Aktiv           | `465`, `587`     | [SMTP-Authentifizierung](https://www.terra-master.com/global/forum/)                                                                                 | [TerraMaster E-Mail-Konfiguration](https://www.terra-master.com/global/support/download.php)                                                    |
| TrueNAS         | SCALE/CORE       | TLS 1.2+          | Aktiv           | `465`, `587`     | [SSL-Zertifikat-Einrichtung](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                       | [TrueNAS E-Mail-Einrichtungsanleitung](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)          |
| Buffalo         | TeraStation      | TLS 1.2           | Eingeschränkt   | `465`, `587`     | [Firmware-Kompatibilität](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)         | [TeraStation E-Mail-Einrichtung](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital | My Cloud OS 5    | TLS 1.2           | Eingeschränkt   | `465`, `587`     | [Legacy-OS-Kompatibilität](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                               | [My Cloud E-Mail-Konfiguration](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                     |
| OpenMediaVault  | OMV 7.x          | TLS 1.2+          | Aktiv           | `465`, `587`     | [Plugin-Abhängigkeiten](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                     | [OMV Benachrichtigungs-Einrichtung](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                        |
| Netgear ReadyNAS| OS 6.x           | Nur TLS 1.0       | Eingestellt     | `2455`, `2555`   | [Legacy TLS-Unterstützung](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                   | [ReadyNAS E-Mail-Alarm-Einrichtung](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)    |
| Drobo           | Dashboard        | TLS 1.2           | Eingestellt     | `465`, `587`     | [Begrenzte Unterstützung](https://myprojects.drobo.com/support/)                                                                                      | [Drobo E-Mail-Benachrichtigungen](https://www.drobo.com/support/)                                                                              |
Diese Matrix zeigt die klare Trennung zwischen modernen, aktiv gewarteten NAS-Systemen und Legacy-Geräten, die spezielle Kompatibilitätsüberlegungen erfordern. Die Mehrheit der aktuellen NAS-Geräte unterstützt moderne TLS-Standards und kann die primären SMTP-Ports von Forward Email ohne besondere Konfiguration verwenden.


## Synology NAS E-Mail-Konfiguration {#synology-nas-email-configuration}

Synology-Geräte mit DSM sind ziemlich einfach einzurichten. Sie unterstützen modernes TLS, sodass Sie unsere Standardports ohne Probleme verwenden können.

> \[!NOTE]
> Synology DSM 7.x bietet die umfassendsten Funktionen für E-Mail-Benachrichtigungen. Ältere DSM-Versionen haben möglicherweise eingeschränkte Konfigurationsmöglichkeiten.

### Konfigurationsschritte {#configuration-steps}

1. **Greifen Sie auf die DSM-Weboberfläche zu**, indem Sie die IP-Adresse Ihres NAS-Geräts oder die QuickConnect-ID in einem Webbrowser eingeben.

2. **Navigieren Sie zum Bedienfeld** und wählen Sie den Abschnitt „Benachrichtigung“, dann klicken Sie auf die Registerkarte „E-Mail“, um die E-Mail-Konfigurationsoptionen zu öffnen.

3. **Aktivieren Sie E-Mail-Benachrichtigungen**, indem Sie das Kontrollkästchen „E-Mail-Benachrichtigungen aktivieren“ markieren.

4. **Konfigurieren Sie den SMTP-Server**, indem Sie `smtp.forwardemail.net` als Serveradresse eingeben.

5. **Stellen Sie die Port-Konfiguration ein** auf Port 465 für SSL/TLS-Verbindungen (empfohlen). Port 587 mit STARTTLS wird ebenfalls als Alternative unterstützt.

6. **Konfigurieren Sie die Authentifizierung**, indem Sie „SMTP-Authentifizierung erforderlich“ auswählen und Ihren Forward Email-Alias im Benutzernamenfeld eingeben.

7. **Geben Sie Ihr Passwort ein**, das Sie unter [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains) generiert haben.

8. **Richten Sie Empfängeradressen ein**, indem Sie bis zu fünf E-Mail-Adressen eingeben, die Benachrichtigungen erhalten sollen.

9. **Konfigurieren Sie die Benachrichtigungsfilterung**, um zu steuern, welche Ereignisse E-Mail-Benachrichtigungen auslösen, damit keine Überflutung mit Benachrichtigungen entsteht und dennoch kritische Ereignisse gemeldet werden.

10. **Testen Sie die Konfiguration** mit der integrierten Testfunktion von DSM, um zu überprüfen, ob alle Einstellungen korrekt sind und die Kommunikation mit den Servern von Forward Email ordnungsgemäß funktioniert.

> \[!TIP]
> Synology erlaubt unterschiedliche Benachrichtigungstypen für verschiedene Empfänger, was Flexibilität bei der Verteilung von Warnungen im Team bietet.


## QNAP NAS E-Mail-Konfiguration {#qnap-nas-email-configuration}

QNAP-Geräte mit QTS funktionieren hervorragend mit Forward Email. Sie unterstützen modernes TLS und verfügen über eine benutzerfreundliche Weboberfläche zur Konfiguration.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 hatte ein bekanntes Problem mit E-Mail-Benachrichtigungen, das in [QTS 5.2.5 behoben wurde](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Stellen Sie sicher, dass Ihre Firmware aktualisiert ist, um Benachrichtigungsfehler zu vermeiden.

### Konfigurationsschritte {#configuration-steps-1}

1. **Greifen Sie auf die Weboberfläche Ihres QNAP-Geräts zu**, indem Sie dessen IP-Adresse in einem Webbrowser eingeben.

2. **Navigieren Sie zum Bedienfeld** und wählen Sie „Service Account and Device Pairing“, dann klicken Sie auf den Abschnitt „E-Mail“, um mit der E-Mail-Konfiguration zu beginnen.

3. **Klicken Sie auf „SMTP-Dienst hinzufügen“**, um eine neue E-Mail-Konfiguration zu erstellen.

4. **Konfigurieren Sie den SMTP-Server**, indem Sie `smtp.forwardemail.net` als SMTP-Serveradresse eingeben.

5. **Wählen Sie das passende Sicherheitsprotokoll** – wählen Sie „SSL/TLS“ mit Port `465` (empfohlen). Port `587` mit STARTTLS wird ebenfalls unterstützt.

6. **Konfigurieren Sie die Portnummer** – Port `465` mit SSL/TLS wird empfohlen. Port `587` mit STARTTLS ist ebenfalls verfügbar, falls benötigt.

7. **Geben Sie Ihre Authentifizierungsdaten ein**, verwenden Sie Ihren Forward Email-Alias als Benutzernamen und Ihr generiertes Passwort von [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains).

8. **Konfigurieren Sie die Absenderinformationen**, indem Sie einen beschreibenden Namen für das „Von“-Feld eingeben, z. B. „QNAP NAS System“ oder den Hostnamen Ihres Geräts.

9. **Richten Sie Empfängeradressen für verschiedene Benachrichtigungstypen ein**. QNAP erlaubt die Konfiguration mehrerer Empfängergruppen für unterschiedliche Alarmtypen.

10. **Testen Sie die Konfiguration** mit der integrierten E-Mail-Testfunktion von QNAP, um sicherzustellen, dass alle Einstellungen korrekt funktionieren.

> \[!TIP]
> Wenn Sie auf [Probleme bei der Gmail SMTP-Konfiguration](https://forum.qnap.com/viewtopic.php?t=152466) stoßen, gelten dieselben Schritte zur Fehlerbehebung auch für Forward Email. Stellen Sie sicher, dass die Authentifizierung korrekt aktiviert ist und die Zugangsdaten stimmen.
> \[!NOTE]
> QNAP-Geräte unterstützen eine erweiterte Benachrichtigungsplanung, mit der Sie Ruhezeiten konfigurieren können, in denen nicht-kritische Benachrichtigungen unterdrückt werden. Dies ist besonders in Geschäftsumgebungen nützlich.

### Häufige QNAP-Fehlerbehebungsprobleme {#common-qnap-troubleshooting-issues}

Wenn Ihr QNAP-Gerät [keine Benachrichtigungs-E-Mails sendet](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), überprüfen Sie Folgendes:

* Überprüfen Sie, ob Ihre Forward Email-Zugangsdaten korrekt sind
* Stellen Sie sicher, dass die SMTP-Serveradresse genau `smtp.forwardemail.net` lautet
* Bestätigen Sie, dass der Port Ihrer Verschlüsselungsmethode entspricht (`465` für SSL/TLS wird empfohlen; `587` für STARTTLS wird ebenfalls unterstützt)
* Prüfen Sie, ob Ihre [SMTP-Serverkonfiguration](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) die Verbindung zulässt


## ReadyNAS Legacy-Konfiguration {#readynas-legacy-configuration}

Netgear ReadyNAS-Geräte stellen aufgrund ihres eingestellten Firmware-Supports und der Abhängigkeit von Legacy-TLS-1.0-Protokollen besondere Herausforderungen dar. Forward Email's Legacy-Port-Unterstützung stellt jedoch sicher, dass diese Geräte weiterhin zuverlässig E-Mail-Benachrichtigungen senden können.

> \[!CAUTION]
> ReadyNAS OS 6.x unterstützt nur TLS 1.0, was die Legacy-Kompatibilitätsports `2455` und `2555` von Forward Email erfordert. Moderne Ports `465` und `587` funktionieren mit diesen Geräten nicht.

### Legacy-Konfigurationsschritte {#legacy-configuration-steps}

1. **Greifen Sie auf die ReadyNAS-Weboberfläche zu**, indem Sie die IP-Adresse des Geräts in einem Webbrowser eingeben.

2. **Navigieren Sie zu System > Einstellungen > Warnungen**, um den Bereich für die E-Mail-Konfiguration zu öffnen.

3. **Konfigurieren Sie den SMTP-Server**, indem Sie `smtp.forwardemail.net` als Serveradresse eingeben.

4. **Stellen Sie die Portkonfiguration ein** auf entweder `2455` für SSL/TLS-Verbindungen oder `2555` für STARTTLS-Verbindungen – dies sind die Legacy-Kompatibilitätsports von Forward Email.

5. **Aktivieren Sie die Authentifizierung** und geben Sie Ihren Forward Email-Alias als Benutzernamen sowie Ihr generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains) ein.

6. **Konfigurieren Sie die Absenderinformationen** mit einer aussagekräftigen „Von“-Adresse, um das ReadyNAS-Gerät zu identifizieren.

7. **Fügen Sie Empfänger-E-Mail-Adressen hinzu** über die + Schaltfläche im Bereich E-Mail-Kontakte.

8. **Testen Sie die Konfiguration**, um sicherzustellen, dass die Legacy-TLS-Verbindung ordnungsgemäß funktioniert.

> \[!IMPORTANT]
> ReadyNAS-Geräte benötigen die Legacy-Ports, da sie keine sicheren Verbindungen mit modernen TLS-Protokollen herstellen können. Dies ist eine [bekannte Einschränkung](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) der eingestellten Firmware.

### ReadyNAS-Fehlerbehebung {#readynas-troubleshooting}

Häufige Probleme bei der ReadyNAS-E-Mail-Konfiguration umfassen:

* **TLS-Version stimmt nicht überein**: Stellen Sie sicher, dass Sie die Ports `2455` oder `2555` verwenden, nicht die modernen Ports
* **Authentifizierungsfehler**: Überprüfen Sie, ob Ihre Forward Email-Zugangsdaten korrekt sind
* **Netzwerkverbindung**: Prüfen Sie, ob das ReadyNAS `smtp.forwardemail.net` erreichen kann
* **Firmware-Einschränkungen**: Einige ältere ReadyNAS-Modelle haben zusätzliche [HTTPS-Konfigurationsanforderungen](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

ReadyNAS-Geräte mit OS 6.x und früher unterstützen nur TLS 1.0-Verbindungen, die von den meisten modernen E-Mail-Anbietern nicht mehr akzeptiert werden. Die dedizierten Legacy-Ports von Forward Email (2455 und 2555) unterstützen speziell diese älteren Protokolle und gewährleisten so die fortgesetzte Funktionalität für ReadyNAS-Nutzer.

Um E-Mails auf ReadyNAS-Geräten zu konfigurieren, greifen Sie über die IP-Adresse auf die Weboberfläche des Geräts zu. Navigieren Sie zum Bereich System und wählen Sie „Benachrichtigungen“, um die E-Mail-Konfigurationsoptionen zu öffnen.

Im Bereich der E-Mail-Konfiguration aktivieren Sie E-Mail-Benachrichtigungen und geben smtp.forwardemail.net als SMTP-Server ein. Dies ist entscheidend – verwenden Sie die legacy-kompatiblen Ports von Forward Email anstelle der Standard-SMTP-Ports.

Für SSL/TLS-Verbindungen konfigurieren Sie Port 2455 anstelle des Standardports 465 (empfohlen). Für STARTTLS-Verbindungen verwenden Sie Port 2555 anstelle von Port 587. Diese speziellen Ports erhalten die TLS-1.0-Kompatibilität und bieten gleichzeitig die bestmögliche Sicherheit für Legacy-Geräte.
Geben Sie Ihren Forward Email-Alias als Benutzernamen und Ihr generiertes Passwort zur Authentifizierung ein. ReadyNAS-Geräte unterstützen SMTP-Authentifizierung, die für Forward Email-Verbindungen erforderlich ist.

Konfigurieren Sie die Absender-E-Mail-Adresse und die Empfängeradressen entsprechend Ihren Benachrichtigungsanforderungen. ReadyNAS erlaubt mehrere Empfängeradressen, sodass Sie Warnungen an verschiedene Teammitglieder oder E-Mail-Konten verteilen können.

Testen Sie die Konfiguration sorgfältig, da ReadyNAS-Geräte möglicherweise keine detaillierten Fehlermeldungen anzeigen, wenn die Konfiguration fehlschlägt. Wenn der Standardtest nicht funktioniert, überprüfen Sie, ob Sie die richtigen Legacy-Ports (2455 oder 2555) anstelle moderner SMTP-Ports verwenden.

Berücksichtigen Sie die Sicherheitsaspekte bei der Verwendung von Legacy-TLS-Protokollen. Während die Legacy-Ports von Forward Email die bestmögliche Sicherheit für ältere Geräte bieten, wird empfohlen, wenn möglich auf ein modernes NAS-System mit aktuellem TLS-Support umzusteigen.


## TerraMaster NAS-Konfiguration {#terramaster-nas-configuration}

TerraMaster-Geräte mit TOS 6.x unterstützen modernes TLS und funktionieren gut mit den Standardports von Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x bietet umfassende Funktionen für E-Mail-Benachrichtigungen. Stellen Sie sicher, dass Ihre Firmware auf dem neuesten Stand ist, um die beste Kompatibilität zu gewährleisten.

1. **Systemeinstellungen aufrufen**
   * Melden Sie sich in der TerraMaster-Weboberfläche an
   * Navigieren Sie zu **Systemsteuerung** > **Benachrichtigung**

2. **SMTP-Einstellungen konfigurieren**
   * Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, empfohlen) oder `587` (STARTTLS)
   * Benutzername: Ihr Forward Email-Alias
   * Passwort: Generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains)

3. **Benachrichtigungen aktivieren**
   * Wählen Sie die Benachrichtigungstypen aus, die Sie erhalten möchten
   * Testen Sie die Konfiguration mit der integrierten Testfunktion

> \[!TIP]
> TerraMaster-Geräte funktionieren am besten mit Port `465` für SSL/TLS-Verbindungen (empfohlen). Bei Problemen wird auch Port `587` mit STARTTLS unterstützt.


## ASUSTOR NAS-Konfiguration {#asustor-nas-configuration}

ASUSTOR-Geräte mit ADM 4.x bieten solide Unterstützung für E-Mail-Benachrichtigungen und arbeiten nahtlos mit Forward Email zusammen.

> \[!NOTE]
> ASUSTOR ADM 4.x enthält erweiterte Filteroptionen für Benachrichtigungen. Sie können anpassen, welche Ereignisse E-Mail-Warnungen auslösen.

1. **Benachrichtigungseinstellungen öffnen**
   * Greifen Sie auf die ADM-Weboberfläche zu
   * Gehen Sie zu **Einstellungen** > **Benachrichtigung**

2. **SMTP-Konfiguration einrichten**
   * SMTP-Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, empfohlen) oder `587` (STARTTLS)
   * Authentifizierung: Aktivieren
   * Benutzername: Ihr Forward Email-Alias
   * Passwort: Generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains)

3. **Alarmtypen konfigurieren**
   * Wählen Sie aus, welche Systemereignisse E-Mails auslösen sollen
   * Richten Sie Empfängeradressen ein
   * Testen Sie die Konfiguration

> \[!IMPORTANT]
> Bei ASUSTOR-Geräten muss die Authentifizierung in den SMTP-Einstellungen explizit aktiviert werden. Vergessen Sie nicht, diese Option zu aktivieren.


## Buffalo TeraStation-Konfiguration {#buffalo-terastation-configuration}

Buffalo TeraStation-Geräte verfügen über eingeschränkte, aber funktionale E-Mail-Benachrichtigungsfunktionen. Die Einrichtung ist einfach, sobald Sie wissen, wo Sie suchen müssen.

> \[!CAUTION]
> Firmware-Updates für Buffalo TeraStation sind selten. Stellen Sie sicher, dass Sie vor der Konfiguration der E-Mail die neueste verfügbare Firmware für Ihr Modell verwenden.

1. **Web-Konfiguration aufrufen**
   * Verbinden Sie sich mit der Weboberfläche Ihrer TeraStation
   * Navigieren Sie zu **System** > **Benachrichtigung**

2. **E-Mail-Einstellungen konfigurieren**
   * SMTP-Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, empfohlen) oder `587` (STARTTLS)
   * Benutzername: Ihr Forward Email-Alias
   * Passwort: Generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains)
   * SSL/TLS-Verschlüsselung aktivieren

3. **Benachrichtigungseinstellungen festlegen**
   * Wählen Sie aus, welche Ereignisse E-Mails auslösen (Festplattenfehler, Temperaturwarnungen usw.)
   * Geben Sie Empfänger-E-Mail-Adressen ein
   * Speichern und testen Sie die Konfiguration

> \[!NOTE]
> Einige ältere TeraStation-Modelle verfügen möglicherweise über eingeschränkte SMTP-Konfigurationsoptionen. Prüfen Sie die Dokumentation Ihres Modells auf spezifische Funktionen.
## Western Digital My Cloud Konfiguration {#western-digital-my-cloud-configuration}

Western Digital My Cloud Geräte mit OS 5 unterstützen E-Mail-Benachrichtigungen, obwohl die Oberfläche in den Einstellungen etwas versteckt sein kann.

> \[!WARNING]
> Western Digital hat den Support für viele My Cloud Modelle eingestellt. Prüfen Sie, ob Ihr Gerät noch Firmware-Updates erhält, bevor Sie sich auf E-Mail-Benachrichtigungen für kritische Warnungen verlassen.

1. **Navigieren Sie zu Einstellungen**
   * Öffnen Sie das My Cloud Web-Dashboard
   * Gehen Sie zu **Einstellungen** > **Allgemein** > **Benachrichtigungen**

2. **SMTP-Daten konfigurieren**
   * Mailserver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, empfohlen) oder `587` (STARTTLS)
   * Benutzername: Ihr Forward Email Alias
   * Passwort: Generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains)
   * Verschlüsselung aktivieren

3. **Alarmtypen einrichten**
   * Wählen Sie Benachrichtigungskategorien (Systemwarnungen, Festplattengesundheit, etc.)
   * Fügen Sie Empfänger-E-Mail-Adressen hinzu
   * Testen Sie die E-Mail-Konfiguration

> \[!TIP]
> Wir empfehlen die Verwendung von Port `465` mit SSL/TLS. Bei Problemen wird auch Port `587` mit STARTTLS unterstützt.


## TrueNAS E-Mail-Konfiguration {#truenas-email-configuration}

TrueNAS (sowohl SCALE als auch CORE) bietet exzellenten Support für E-Mail-Benachrichtigungen mit detaillierten Konfigurationsmöglichkeiten.

> \[!NOTE]
> TrueNAS bietet einige der umfassendsten E-Mail-Benachrichtigungsfunktionen unter NAS-Systemen. Sie können detaillierte Alarmregeln und mehrere Empfänger konfigurieren.

1. **Systemeinstellungen aufrufen**
   * Melden Sie sich in der TrueNAS Weboberfläche an
   * Navigieren Sie zu **System** > **E-Mail**

2. **SMTP-Einstellungen konfigurieren**
   * Ausgehender Mailserver: `smtp.forwardemail.net`
   * Mailserver-Port: `465` (empfohlen) oder `587`
   * Sicherheit: SSL/TLS (für 465, empfohlen) oder STARTTLS (für 587)
   * Benutzername: Ihr Forward Email Alias
   * Passwort: Generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains)

3. **Alarme einrichten**
   * Gehen Sie zu **System** > **Alarmdienste**
   * Konfigurieren Sie, welche Alarme per E-Mail gesendet werden sollen
   * Legen Sie Empfängeradressen und Alarmstufen fest
   * Testen Sie die Konfiguration mit der integrierten Testfunktion

> \[!IMPORTANT]
> TrueNAS ermöglicht die Konfiguration verschiedener Alarmstufen (INFO, NOTICE, WARNING, ERROR, CRITICAL). Wählen Sie geeignete Stufen, um E-Mail-Spam zu vermeiden und gleichzeitig kritische Probleme zu melden.


## OpenMediaVault Konfiguration {#openmediavault-configuration}

OpenMediaVault bietet solide E-Mail-Benachrichtigungsfunktionen über seine Weboberfläche. Der Einrichtungsprozess ist übersichtlich und unkompliziert.

> \[!NOTE]
> Das Benachrichtigungssystem von OpenMediaVault basiert auf Plugins. Stellen Sie sicher, dass das E-Mail-Benachrichtigungs-Plugin installiert und aktiviert ist.

1. **Benachrichtigungseinstellungen aufrufen**
   * Öffnen Sie die OpenMediaVault Weboberfläche
   * Gehen Sie zu **System** > **Benachrichtigung** > **E-Mail**

2. **SMTP-Parameter konfigurieren**
   * SMTP-Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, empfohlen) oder `587` (STARTTLS)
   * Benutzername: Ihr Forward Email Alias
   * Passwort: Generiertes Passwort aus [Mein Konto -> Domains -> Aliase](https://forwardemail.net/my-account/domains)
   * SSL/TLS aktivieren

3. **Benachrichtigungsregeln einrichten**
   * Navigieren Sie zu **System** > **Benachrichtigung** > **Benachrichtigungen**
   * Konfigurieren Sie, welche Systemereignisse E-Mails auslösen sollen
   * Legen Sie Empfängeradressen fest
   * Testen Sie die E-Mail-Funktionalität

> \[!TIP]
> OpenMediaVault ermöglicht die Konfiguration von Benachrichtigungsplänen. Sie können Ruhezeiten einstellen oder die Benachrichtigungsfrequenz begrenzen, um nicht von Warnungen überwältigt zu werden.


## Raspberry Pi NAS Konfiguration {#raspberry-pi-nas-configuration}

Der Raspberry Pi stellt einen ausgezeichneten Einstieg in die NAS-Funktionalität dar und bietet eine kostengünstige Lösung für Heim- und Kleinbüroumgebungen. Die Einrichtung eines Raspberry Pi als NAS-Gerät umfasst die Konfiguration von Dateifreigabeprotokollen, E-Mail-Benachrichtigungen und wichtigen Netzwerkdiensten.

> \[!TIP]
> Für Raspberry Pi Enthusiasten empfehlen wir dringend, Ihre NAS-Konfiguration mit [PiKVM](https://pikvm.org/) für die Fernverwaltung des Servers und [Pi-hole](https://pi-hole.net/) für netzwerkweiten Werbeblocker und DNS-Verwaltung zu ergänzen. Diese Tools schaffen eine umfassende Home-Lab-Umgebung.
### Erste Raspberry Pi Einrichtung {#initial-raspberry-pi-setup}

Bevor Sie NAS-Dienste konfigurieren, stellen Sie sicher, dass Ihr Raspberry Pi das neueste Raspberry Pi OS ausführt und über ausreichend Speicher verfügt. Eine hochwertige microSD-Karte (Klasse 10 oder besser) oder eine USB 3.0 SSD bietet bessere Leistung und Zuverlässigkeit für NAS-Betrieb.

1. **System aktualisieren** durch Ausführen von `sudo apt update && sudo apt upgrade -y`, um sicherzustellen, dass alle Pakete aktuell sind.

2. **SSH-Zugriff aktivieren** mit `sudo systemctl enable ssh && sudo systemctl start ssh` für die Fernverwaltung.

3. **Statische IP-Adresse konfigurieren** durch Bearbeiten von `/etc/dhcpcd.conf`, um einen konsistenten Netzwerkzugang zu gewährleisten.

4. **Externe Speicher einrichten** durch Anschließen und Einbinden von USB-Laufwerken oder Konfigurieren von RAID-Arrays für Datensicherheit.

### Samba-Dateifreigabe Konfiguration {#samba-file-sharing-configuration}

Samba bietet Windows-kompatible Dateifreigabe und macht Ihren Raspberry Pi von jedem Gerät im Netzwerk zugänglich. Der Konfigurationsprozess umfasst die Installation von Samba, das Erstellen von Freigaben und das Einrichten der Benutzerauthentifizierung.

Installieren Sie Samba mit `sudo apt install samba samba-common-bin` und konfigurieren Sie die Hauptkonfigurationsdatei unter `/etc/samba/smb.conf`. Erstellen Sie freigegebene Verzeichnisse und setzen Sie entsprechende Berechtigungen mit `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Konfigurieren Sie Samba-Freigaben, indem Sie Abschnitte für jedes freigegebene Verzeichnis zur Konfigurationsdatei hinzufügen. Richten Sie die Benutzerauthentifizierung mit `sudo smbpasswd -a username` ein, um Samba-spezifische Passwörter für den Netzwerkzugang zu erstellen.

> \[!IMPORTANT]
> Verwenden Sie immer starke Passwörter für Samba-Benutzer und erwägen Sie, den Gastzugang nur für nicht sensible freigegebene Ordner zu aktivieren. Überprüfen Sie die [offizielle Samba-Dokumentation](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) für erweiterte Sicherheitskonfigurationen.

### FTP-Server Einrichtung {#ftp-server-setup}

FTP bietet eine weitere Methode für den Dateizugriff, besonders nützlich für automatisierte Backups und Remote-Dateiverwaltung. Installieren und konfigurieren Sie vsftpd (Very Secure FTP Daemon) für zuverlässige FTP-Dienste.

Installieren Sie vsftpd mit `sudo apt install vsftpd` und konfigurieren Sie den Dienst durch Bearbeiten von `/etc/vsftpd.conf`. Aktivieren Sie den lokalen Benutzerzugang, konfigurieren Sie die Einstellungen für den passiven Modus und richten Sie geeignete Sicherheitsbeschränkungen ein.

Erstellen Sie FTP-Benutzer und konfigurieren Sie Verzeichniszugriffsberechtigungen. Ziehen Sie die Verwendung von SFTP (SSH File Transfer Protocol) anstelle von traditionellem FTP für erhöhte Sicherheit in Betracht, da es alle Datenübertragungen verschlüsselt.

> \[!CAUTION]
> Traditionelles FTP überträgt Passwörter im Klartext. Verwenden Sie immer SFTP oder konfigurieren Sie FTP mit TLS-Verschlüsselung für sichere Dateiübertragungen. Überprüfen Sie die [vsftpd Sicherheitsbest Practices](https://security.appspot.com/vsftpd.html) vor der Inbetriebnahme.

### E-Mail-Benachrichtigungs-Konfiguration {#email-notification-configuration}

Konfigurieren Sie Ihr Raspberry Pi NAS so, dass es E-Mail-Benachrichtigungen für Systemereignisse, Speicherwarnungen und Backup-Abschlussstatus sendet. Dies beinhaltet die Installation und Konfiguration eines Mail-Transfer-Agenten sowie die Einrichtung der Forward Email Integration.

Installieren Sie `msmtp` als leichtgewichtigen SMTP-Client mit `sudo apt install msmtp msmtp-mta`. Erstellen Sie die Konfigurationsdatei unter `/etc/msmtprc` mit den folgenden Einstellungen:

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

Konfigurieren Sie Systembenachrichtigungen durch Einrichten von Cron-Jobs und Systemüberwachungsskripten, die `msmtp` zum Senden von Warnungen verwenden. Erstellen Sie Skripte für Festplattenplatzüberwachung, Temperaturwarnungen und Backup-Abschlussbenachrichtigungen.

### Erweiterte Raspberry Pi NAS Funktionen {#advanced-raspberry-pi-nas-features}

Erweitern Sie Ihr Raspberry Pi NAS mit zusätzlichen Diensten und Überwachungsfunktionen. Installieren und konfigurieren Sie Netzwerküberwachungstools, automatisierte Backup-Lösungen und Fernzugriffsdienste.

Richten Sie [Nextcloud](https://nextcloud.com/) für cloudähnliche Funktionalität mit webbasiertem Dateizugriff, Kalender-Synchronisation und kollaborativen Funktionen ein. Installieren Sie es mit Docker oder der offiziellen Nextcloud-Installationsanleitung für Raspberry Pi.
Konfigurieren Sie automatisierte Backups mit `rsync` und `cron`, um geplante Sicherungen kritischer Daten zu erstellen. Richten Sie E-Mail-Benachrichtigungen für Backup-Abschluss und Fehlerwarnungen mit Ihrer Forward Email-Konfiguration ein.

Implementieren Sie Netzwerküberwachung mit Tools wie [Nagios](https://www.nagios.org/) oder [Zabbix](https://www.zabbix.com/), um Systemzustand, Netzwerkverbindung und Dienstverfügbarkeit zu überwachen.

> \[!NOTE]
> Für Benutzer, die Netzwerk-Infrastruktur verwalten, sollten Sie die Integration von [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) in Ihre PiKVM-Konfiguration für die Fernsteuerung physischer Schalter in Betracht ziehen. Diese [Python-Integrationsanleitung](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) bietet detaillierte Anweisungen zur Automatisierung der physischen Geräteverwaltung.

### Raspberry Pi E-Mail-Fehlerbehebung {#raspberry-pi-email-troubleshooting}

Häufige Probleme bei der Raspberry Pi E-Mail-Konfiguration umfassen DNS-Auflösungsprobleme, Firewall-Einschränkungen und Authentifizierungsfehler. Die leichte Bauweise von Raspberry Pi-Systemen kann manchmal Timing-Probleme bei SMTP-Verbindungen verursachen.

Wenn E-Mail-Benachrichtigungen fehlschlagen, prüfen Sie die `msmtp`-Protokolldatei unter `/var/log/msmtp.log` auf detaillierte Fehlermeldungen. Vergewissern Sie sich, dass Ihre Forward Email-Zugangsdaten korrekt sind und dass der Raspberry Pi `smtp.forwardemail.net` auflösen kann.

Testen Sie die E-Mail-Funktionalität über die Befehlszeile: `echo "Test message" | msmtp recipient@example.com`. Dies hilft, Konfigurationsprobleme von anwendungsspezifischen Problemen zu isolieren.

Konfigurieren Sie bei DNS-Auflösungsproblemen die richtigen DNS-Einstellungen in `/etc/resolv.conf`. Ziehen Sie in Betracht, öffentliche DNS-Server wie `8.8.8.8` oder `1.1.1.1` zu verwenden, wenn der lokale DNS unzuverlässig ist.

### Leistungsoptimierung {#performance-optimization}

Optimieren Sie die Leistung Ihres Raspberry Pi NAS durch richtige Konfiguration von Speicher, Netzwerkeinstellungen und Systemressourcen. Verwenden Sie hochwertige Speichermedien und konfigurieren Sie geeignete Dateisystemoptionen für Ihren Anwendungsfall.

Aktivieren Sie USB 3.0 Boot für bessere Speicherleistung, wenn Sie externe Laufwerke verwenden. Konfigurieren Sie die GPU-Speicheraufteilung mit `sudo raspi-config`, um mehr RAM für Systemoperationen statt für die Grafikverarbeitung zuzuweisen.

Überwachen Sie die Systemleistung mit Tools wie `htop`, `iotop` und `nethogs`, um Engpässe zu identifizieren und die Ressourcennutzung zu optimieren. Erwägen Sie ein Upgrade auf einen Raspberry Pi 4 mit 8 GB RAM für anspruchsvolle NAS-Anwendungen.

Implementieren Sie geeignete Kühlungslösungen, um thermisches Drosseln bei intensiven Operationen zu verhindern. Überwachen Sie die CPU-Temperatur mit `/opt/vc/bin/vcgencmd measure_temp` und sorgen Sie für ausreichende Belüftung.

### Sicherheitsüberlegungen {#security-considerations}

Sichern Sie Ihr Raspberry Pi NAS durch Implementierung geeigneter Zugriffskontrollen, Netzwerksicherheitsmaßnahmen und regelmäßiger Sicherheitsupdates. Ändern Sie Standardpasswörter, deaktivieren Sie unnötige Dienste und konfigurieren Sie Firewall-Regeln.

Installieren und konfigurieren Sie `fail2ban`, um Brute-Force-Angriffe auf SSH und andere Dienste zu verhindern. Richten Sie automatische Sicherheitsupdates mit `unattended-upgrades` ein, um kritische Sicherheitspatches zeitnah anzuwenden.

Konfigurieren Sie Netzwerkssegmentierung, um Ihr NAS nach Möglichkeit von anderen Netzwerkgeräten zu isolieren. Verwenden Sie VPN-Zugänge für Fernverbindungen, anstatt Dienste direkt dem Internet auszusetzen.

Sichern Sie regelmäßig Ihre Raspberry Pi-Konfiguration und Daten, um Datenverlust durch Hardwarefehler oder Sicherheitsvorfälle zu vermeiden. Testen Sie Wiederherstellungsverfahren, um die Datenwiederherstellung sicherzustellen.

Die Raspberry Pi NAS-Konfiguration bietet eine ausgezeichnete Grundlage zum Erlernen von Netzwerkspeicherkonzepten und liefert gleichzeitig praktische Funktionalität für Heim- und Kleinbüroumgebungen. Die Kombination mit Forward Email gewährleistet eine zuverlässige Zustellung von Benachrichtigungen für Systemüberwachung und Wartungswarnungen.
