# Verwandle Deinen Raspberry Pi in einen sicheren FTP-Server mit E-Mail-Relay {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Hast Du einen Raspberry Pi, der Staub ansetzt? Egal ob es der neueste Pi 5, ein Pi 4, Pi Zero oder sogar ein älteres Modell ist – diese Anleitung zeigt Dir, wie Du ihn in einen leistungsstarken, automatisierten Dateiserver mit E-Mail-Relay-Funktion verwandelst. Perfekt für Sicherheitskameras, IoT-Geräte und mehr.

**Kompatibel mit:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W und Raspberry Pi Zero.

> \[!NOTE]
> Diese Anleitung wurde auf einem Raspberry Pi 3 Model B mit Ubuntu Server 22.04 LTS getestet und verifiziert.


## Inhaltsverzeichnis {#table-of-contents}

* [Was wir bauen](#what-were-building)
* [Teil 1: Ubuntu Server auf Deinem Pi installieren](#part-1-getting-ubuntu-server-on-your-pi)
  * [Was Du brauchst](#what-youll-need)
  * [Das Betriebssystem flashen](#flashing-the-os)
  * [Starten & Verbinden](#booting-up--connecting)
* [Teil 2: Einen sicheren FTP-Server einrichten](#part-2-setting-up-a-secure-ftp-server)
  * [Installation & Konfiguration](#installation--configuration)
  * [Einen FTP-Benutzer anlegen](#creating-an-ftp-user)
* [Teil 3: Firewall- und Brute-Force-Schutz](#part-3-firewall-and-brute-force-protection)
  * [UFW einrichten](#setting-up-ufw)
  * [Fail2ban einrichten](#setting-up-fail2ban)
* [Teil 4: Automatisierte Dateiverarbeitung mit E-Mail-Benachrichtigungen](#part-4-automated-file-processing-with-email-notifications)
  * [Option 1: Forward Email API verwenden (empfohlen)](#option-1-using-forward-email-api-recommended)
  * [Option 2: Andere E-Mail-Anbieter verwenden](#option-2-using-other-email-providers)
  * [Einen Systemd-Dienst erstellen](#create-a-systemd-service)
* [Teil 5: E-Mail-Optionen für ältere Geräte](#part-5-email-options-for-legacy-devices)
  * [Option 1: Forward Email’s Legacy TLS 1.0 Ports verwenden (empfohlen)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Option 2: Einen Postfix SMTP-Relay einrichten](#option-2-set-up-a-postfix-smtp-relay)
* [Fehlerbehebung](#troubleshooting)
* [Abschluss](#wrapping-up)


## Was wir bauen {#what-were-building}

Diese Anleitung führt Dich durch die Einrichtung eines kompletten Systems, das Folgendes beinhaltet:

* **Ubuntu Server 22.04 LTS:** Ein stabiles, leichtgewichtiges Betriebssystem für den Pi.
* **Einen sicheren FTP-Server (vsftpd):** Zum sicheren Ablegen von Dateien.
* **Eine Firewall (UFW) & Fail2ban:** Um die bösen Buben draußen zu halten.
* **Einen automatisierten Dateiverarbeiter:** Ein Skript, das neue Dateien abholt, per E-Mail als Anhang versendet und anschließend aufräumt.
* **E-Mail-Optionen für ältere Geräte:** Zwei Ansätze für Geräte, die modernes TLS nicht unterstützen:
  * Verwende Forward Email’s Legacy TLS 1.0 Ports (am einfachsten)
  * Richte einen Postfix SMTP-Relay ein (funktioniert mit jedem E-Mail-Anbieter)

Bereit? Dann legen wir los.


## Teil 1: Ubuntu Server auf Deinem Pi installieren {#part-1-getting-ubuntu-server-on-your-pi}

Zuerst musst Du Ubuntu Server auf dem Raspberry Pi zum Laufen bringen. Das ist dank des Raspberry Pi Imagers überraschend einfach.

### Was Du brauchst {#what-youll-need}

* Einen kompatiblen Raspberry Pi (siehe Liste oben)
* Eine microSD-Karte (mindestens 8GB, 16GB+ empfohlen)
* Einen Computer mit microSD-Kartenleser
* Passendes Netzteil für Dein Pi-Modell
* Internetzugang (Ethernet oder WLAN)

> \[!NOTE]
> Ältere Modelle wie der Raspberry Pi 2 oder Pi Zero sind möglicherweise langsamer, funktionieren aber für diese Einrichtung problemlos.

### Das Betriebssystem flashen {#flashing-the-os}

1. **Raspberry Pi Imager herunterladen:** Lade ihn von der [offiziellen Webseite](https://www.raspberrypi.com/software/) herunter.

2. **Betriebssystem auswählen:** Im Imager wähle „CHOOSE OS“ > „Other general-purpose OS“ > „Ubuntu“.
   * Für 64-Bit-Modelle (Pi 3, 4, 5, Zero 2 W) wähle **„Ubuntu Server 22.04.1 LTS (64-bit)“**.
   * Für ältere 32-Bit-Modelle (Pi 2, Pi Zero, Pi Zero W) wähle **„Ubuntu Server 22.04.1 LTS (32-bit)“**.

3. **Speicher auswählen:** Wähle Deine microSD-Karte aus.

> \[!WARNING]
> Dadurch wird Deine microSD-Karte komplett gelöscht. Stelle sicher, dass Du wichtige Daten gesichert hast.

4. **Erweiterte Optionen sind Dein Freund:** Klicke auf das Zahnrad-Symbol (⚙️), um den Pi für den Headless-Betrieb einzurichten (kein Monitor oder Tastatur nötig).
   * **Hostname:** Vergib einen Namen für Deinen Pi (z. B. `pi-server`).
   * **SSH:** Aktiviere es und lege Benutzername und Passwort fest.
   * **WLAN:** Falls Du kein Ethernet nutzt, gib Deine WLAN-Daten ein.
   * **Locale:** Stelle Deine Zeitzone und Tastaturlayout ein.
5. **Schreiben!** Klicken Sie auf die Schaltfläche "WRITE" und lassen Sie den Imager seine Arbeit machen.

### Hochfahren & Verbinden {#booting-up--connecting}

Sobald der Imager fertig ist, stecken Sie die microSD-Karte in den Pi und schließen ihn an. Geben Sie ihm ein paar Minuten zum Hochfahren. Im Hintergrund wird eine erste Einrichtung durchgeführt. Finden Sie die IP-Adresse über die Admin-Seite Ihres Routers und verbinden Sie sich dann per SSH:

```bash
ssh your_username@your_pi_ip_address
```

Sie sind drin! Der Raspberry Pi ist nun bereit zur Konfiguration.


## Teil 2: Einrichten eines sicheren FTP-Servers {#part-2-setting-up-a-secure-ftp-server}

Als nächstes richten Sie `vsftpd` (Very Secure FTP Daemon) ein, konfiguriert für maximale Sicherheit.

### Installation & Konfiguration {#installation--configuration}

1. **vsftpd installieren:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Backup der Konfigurationsdatei:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Konfiguration bearbeiten:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Wenn eine Zeile auskommentiert ist (beginnt mit `#`), entfernen Sie das `#`, um sie zu aktivieren.

Nehmen Sie folgende Änderungen vor:

| Einstellung              | Wert  | Zweck                                                     |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Anonymen FTP-Zugang deaktivieren                           |
| `local_enable`           | `YES` | Lokalen Benutzern das Einloggen erlauben                   |
| `write_enable`           | `YES` | Datei-Uploads erlauben                                     |
| `local_umask`            | `022` | Dateiberechtigungen setzen (644 für Dateien, 755 für Verzeichnisse) |
| `chroot_local_user`      | `YES` | Benutzer in ihr Home-Verzeichnis einsperren                |
| `allow_writeable_chroot` | `YES` | Uploads im chroot Jail erlauben                            |

4. **Passiven Portbereich hinzufügen:** Fügen Sie diese Zeilen ans Ende der Datei an. Dies wird für die Firewall benötigt.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Logging aktivieren:** Fügen Sie diese Zeilen hinzu, um Logging für Fail2ban zu aktivieren.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Speichern und Neustarten:** Drücken Sie `Ctrl+O`, `Enter`, `Ctrl+X`, und starten Sie dann den Dienst neu:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Einen FTP-Benutzer anlegen {#creating-an-ftp-user}

Erstellen Sie einen dedizierten, eingeschränkten Benutzer für den FTP-Zugang.

1. **Benutzer anlegen:**

   ```bash
   sudo adduser ftpuser
   ```

   Folgen Sie den Eingabeaufforderungen, um ein Passwort zu setzen. Die anderen Felder (Name, Telefon, etc.) können leer bleiben.

2. **Verzeichnisstruktur erstellen:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Haupt-FTP-Verzeichnis
   * `/home/ftpuser/ftp/uploads` - Verzeichnis für hochgeladene Dateien

3. **Berechtigungen setzen:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Teil 3: Firewall- und Brute-Force-Schutz {#part-3-firewall-and-brute-force-protection}

Sichern Sie den Pi mit UFW (Uncomplicated Firewall) und Fail2ban ab.

### UFW einrichten {#setting-up-ufw}

1. **UFW installieren:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Standardrichtlinien setzen:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **SSH erlauben (kritisch!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Erlauben Sie immer SSH, bevor Sie die Firewall aktivieren, sonst sperren Sie sich aus!

4. **FTP-Ports erlauben:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Firewall aktivieren:**

   ```bash
   sudo ufw enable
   ```

### Fail2ban einrichten {#setting-up-fail2ban}

Fail2ban blockiert automatisch IP-Adressen nach wiederholten fehlgeschlagenen Login-Versuchen.

1. **Fail2ban installieren:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Lokale Konfiguration erstellen:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Fügen Sie diese Konfigurationen hinzu:**
   ```ini
   [DEFAULT]
   bantime = 3600
   findtime = 600
   maxretry = 5

   [sshd]
   enabled = true
   port = ssh
   logpath = /var/log/auth.log

   [vsftpd]
   enabled = true
   port = ftp,ftp-data,40000:50000
   logpath = /var/log/vsftpd.log
   maxretry = 3
   ```

4. **Restart Fail2ban:**

   ```bash
   sudo systemctl restart fail2ban
   ```


## Part 4: Automated File Processing with Email Notifications {#part-4-automated-file-processing-with-email-notifications}

Now for the magic: a script that monitors the FTP folder, emails new files as attachments, and deletes them. There are two approaches depending on your email provider:

### Option 1: Using Forward Email API (Recommended) {#option-1-using-forward-email-api-recommended}

If you have a Forward Email account, use the Email API for the most reliable delivery.

#### Get Your API Key {#get-your-api-key}

1. Log in to [Forward Email](https://forwardemail.net)
2. Navigate to [My Account → Security](https://forwardemail.net/my-account/security)
3. Scroll down to the **"Developer Access"** section at the bottom
4. Copy your API key

> \[!WARNING]
> Keep your API key private at all times. Never share it publicly or commit it to version control.

> \[!NOTE]
> The Enhanced Protection plan ($3/month) or higher is required for API access.

#### Install inotify-tools {#install-inotify-tools}

```bash
sudo apt install inotify-tools -y
```

#### Create the Monitoring Script {#create-the-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="noreply@yourdomain.com"
TO_EMAIL="your-email@example.com"
API_KEY="your_forward_email_api_key"  # Replace with your actual API key

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Base64 encode the file
    FILE_CONTENT=$(base64 -w 0 "$FILEPATH")

    # Send email with attachment via Forward Email API
    RESPONSE=$(curl -X POST https://api.forwardemail.net/v1/emails \
      -u "$API_KEY:" \
      -H "Content-Type: application/json" \
      -d '{
        "from": "'"$FROM_EMAIL"'",
        "to": "'"$TO_EMAIL"'",
        "subject": "'"$SUBJECT"'",
        "text": "New file uploaded: '"$FILENAME"'",
        "attachments": [
          {
            "filename": "'"$FILENAME"'",
            "content": "'"$FILE_CONTENT"'",
            "encoding": "base64"
          }
        ]
      }')

    # Check if email was sent successfully
    if echo "$RESPONSE" | grep -q '"statusCode":200'; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
        echo "Response: $RESPONSE"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Option 2: Using Other Email Providers {#option-2-using-other-email-providers}

If you prefer to use Gmail, Outlook, Yahoo, or another provider, modify the script to use `sendmail` or `msmtp` instead of the Forward Email API.

#### Install msmtp {#install-msmtp}

```bash
sudo apt install msmtp msmtp-mta -y
```

#### Configure msmtp {#configure-msmtp}

Create the configuration file:

```bash
sudo nano /etc/msmtprc
```

Add your provider's settings (example for Gmail):

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        gmail
host           smtp.gmail.com
port           587
from           your-email@gmail.com
user           your-email@gmail.com
password       your-app-password

account default : gmail
```

Secure the file:

```bash
sudo chmod 600 /etc/msmtprc
```

#### Create the Alternative Monitoring Script {#create-the-alternative-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="your-email@gmail.com"
TO_EMAIL="recipient@example.com"

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Send email with attachment using msmtp
    (
        echo "To: $TO_EMAIL"
        echo "From: $FROM_EMAIL"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: multipart/mixed; boundary=\"BOUNDARY\""
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: text/plain; charset=utf-8"
        echo ""
        echo "New file uploaded: $FILENAME"
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: application/octet-stream; name=\"$FILENAME\""
        echo "Content-Transfer-Encoding: base64"
        echo "Content-Disposition: attachment; filename=\"$FILENAME\""
        echo ""
        base64 "$FILEPATH"
        echo ""
        echo "--BOUNDARY--"
    ) | msmtp -t

    # Check if email was sent successfully
    if [ $? -eq 0 ]; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Erstellen eines Systemd-Dienstes {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Fügen Sie diesen Inhalt hinzu:

```ini
[Unit]
Description=FTP Upload Monitor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Dienst aktivieren und starten:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Status prüfen:

```bash
sudo systemctl status ftp-monitor.service
```


## Teil 5: E-Mail-Optionen für ältere Geräte {#part-5-email-options-for-legacy-devices}

Geräte wie FOSSCAM-Kameras unterstützen oft keine modernen TLS-Versionen. Es gibt zwei Lösungen:

### Option 1: Verwenden Sie Forward Emails Legacy TLS 1.0 Ports (Empfohlen) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Wenn Sie Forward Email verwenden, ist dies die einfachste Lösung. Forward Email stellt dedizierte Legacy TLS 1.0 Ports speziell für ältere Geräte wie Kameras, Drucker, Scanner und Faxgeräte bereit.

#### Preise {#pricing}

Forward Email bietet mehrere Pläne an:

| Plan                    | Preis        | Funktionen                             |
| ----------------------- | ------------ | ------------------------------------ |
| Kostenlos               | 0 $/Monat    | Nur E-Mail-Weiterleitung (kein Versand) |
| **Erweiterter Schutz**  | **3 $/Monat**| **SMTP-Zugang + Legacy TLS 1.0 Ports** |
| Team                    | 9 $/Monat    | Erweiterter Schutz + Team-Funktionen |
| Enterprise              | 250 $/Monat  | Team + unbegrenzte API-Anfragen      |

> \[!IMPORTANT]
> Der **Erweiterter Schutz-Plan (3 $/Monat)** oder höher ist erforderlich für SMTP-Zugang und Unterstützung der Legacy TLS 1.0 Ports.

Mehr erfahren unter [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Passwort generieren {#generate-your-password}

Bevor Sie Ihr Gerät konfigurieren, generieren Sie ein Passwort in Forward Email:

1. Melden Sie sich bei [Forward Email](https://forwardemail.net) an
2. Navigieren Sie zu **Mein Konto → Domains → \[Ihre Domain] → Aliase**
3. Erstellen oder wählen Sie einen Alias (z. B. `camera@yourdomain.com`)
4. Klicken Sie neben dem Alias auf **"Passwort generieren"**
5. Kopieren Sie das generierte Passwort – Sie benötigen es für die SMTP-Authentifizierung

> \[!TIP]
> Jeder Alias kann ein eigenes Passwort haben. Das ist nützlich, um nachzuverfolgen, welches Gerät welche E-Mail gesendet hat.

#### Gerät konfigurieren {#configure-your-device}

Verwenden Sie diese Einstellungen in Ihrer Kamera, Ihrem Drucker, Scanner oder anderem älteren Gerät:

| Einstellung     | Wert                                             |
| --------------- | ------------------------------------------------ |
| SMTP-Server     | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (Alternative)                             |
| Benutzername    | Ihre Alias-E-Mail (z. B. `camera@yourdomain.com`) |
| Passwort        | Das Passwort aus "Passwort generieren"           |
| Authentifizierung | Erforderlich                                   |
| Verschlüsselung | SSL/TLS (empfohlen) oder STARTTLS                 |

> \[!WARNING]
> Diese Ports verwenden das veraltete TLS 1.0 Protokoll, das bekannte Sicherheitslücken (BEAST, POODLE) aufweist. Verwenden Sie es nur, wenn Ihr Gerät kein modernes TLS 1.2+ unterstützt.

Konfigurieren Sie Ihr Gerät einfach mit diesen Einstellungen, und es sendet E-Mails direkt über Forward Email, ohne dass ein lokaler Relay-Server benötigt wird.

Weitere Details finden Sie in den [Forward Email FAQ zum Legacy TLS Support](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Option 2: Einrichten eines Postfix SMTP-Relays {#option-2-set-up-a-postfix-smtp-relay}

Wenn Sie Forward Email nicht verwenden oder eine lokale Relay-Lösung bevorzugen, richten Sie Postfix auf dem Raspberry Pi als Vermittler ein. Dies funktioniert mit jedem E-Mail-Anbieter (Gmail, Outlook, Yahoo, AOL usw.).

#### Postfix installieren {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Während der Installation:

* Wählen Sie **"Internet Site"**
* Geben Sie den Hostnamen Ihres Pi ein (z. B. `raspberrypi-ftp`) für "System mail name"

#### Wählen Sie Ihren E-Mail-Anbieter {#choose-your-email-provider}

| Anbieter | SMTP-Server           | Port | App-Passwort erforderlich? |
| -------- | --------------------- | ---- | -------------------------- |
| Gmail    | smtp.gmail.com        | 587  | Ja                         |
| Outlook  | smtp-mail.outlook.com | 587  | Ja                         |
| Yahoo    | smtp.mail.yahoo.com   | 465  | Ja                         |
| AOL      | smtp.aol.com          | 587  | Ja                         |

#### Holen Sie sich ein app-spezifisches Passwort {#get-an-app-specific-password}

Die meisten Anbieter verlangen App-Passwörter für Drittanbieter-Anwendungen. Erstellen Sie eines in den Sicherheitseinstellungen Ihres E-Mail-Anbieters:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Verwenden Sie niemals Ihr reguläres E-Mail-Passwort. Nutzen Sie immer ein app-spezifisches Passwort.

#### Konfigurieren Sie die SASL-Authentifizierung {#configure-sasl-authentication}

Erstellen Sie die Passwortdatei für Ihren gewählten Anbieter. Dieses Beispiel verwendet Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Fügen Sie diese Zeile hinzu (passen Sie Server und Port für Ihren Anbieter an):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Für Gmail verwenden Sie:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Sichern und hashen Sie die Datei:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Konfigurieren Sie die E-Mail-Adressenzuordnung {#configure-email-address-mapping}

Schreiben Sie lokale E-Mail-Adressen um, damit sie zu Ihrem E-Mail-Anbieter passen:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Fügen Sie diese Zeile hinzu (ersetzen Sie `HOSTNAME` durch den Hostnamen Ihres Pi und verwenden Sie Ihre E-Mail):

```
/.+@HOSTNAME/    your_email@provider.com
```

Beispiel:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Sichern Sie die Datei:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Konfigurieren Sie die Postfix-Haupteinstellungen {#configure-postfix-main-settings}

Bearbeiten Sie die Hauptkonfiguration:

```bash
sudo nano /etc/postfix/main.cf
```

Suchen und aktualisieren Sie den Relay-Host (oder fügen Sie ihn am Ende hinzu):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Fügen Sie diese Einstellungen am Ende der Datei hinzu:

```
# SMTP Relay Konfiguration
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Netzwerkeinstellungen
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Für Gmail (Port 587) setzen Sie `smtp_tls_wrappermode = no` anstelle von `yes`.

> \[!WARNING]
> Aktualisieren Sie `mynetworks` mit Ihrem tatsächlichen Netzwerkbereich. Fügen Sie nur vertrauenswürdige Netzwerke hinzu – jedes Gerät in diesen Netzwerken kann E-Mails ohne Authentifizierung weiterleiten.

**Gängige Netzwerkbereiche:**

| Netzwerkbereich  | IP-Adressbereich           |
| ---------------- | -------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Firewall aktualisieren und neu starten {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP für lokale Geräte'
sudo systemctl restart postfix
```

Überprüfen Sie, ob Postfix läuft:

```bash
sudo systemctl status postfix
```

#### Testen Sie den Relay {#test-the-relay}

Senden Sie eine Test-E-Mail:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Überprüfen Sie die Logs:

```bash
sudo tail -f /var/log/mail.log
```

Suchen Sie nach `status=sent`, um den Erfolg zu bestätigen.

#### Konfigurieren Sie Ihr Gerät {#configure-your-device-1}

In den Einstellungen Ihrer Kamera oder Ihres Geräts:
* **SMTP-Server:** Die IP-Adresse Ihres Pi (z. B. `192.168.1.100`)
* **SMTP-Port:** `25`
* **Authentifizierung:** Keine
* **Verschlüsselung:** Keine (nur lokales Netzwerk)


## Fehlerbehebung {#troubleshooting}

Falls Probleme auftreten, prüfen Sie diese Logdateien:

**FTP-Server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Dateiüberwachung:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix-Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Mail-Warteschlange anzeigen
```


## Abschluss {#wrapping-up}

Der Raspberry Pi ist nun ein vollständiges automatisiertes System mit sicheren Datei-Uploads, automatischen E-Mail-Benachrichtigungen mit Anhängen und SMTP-Relay-Fähigkeiten für ältere Geräte. Ob mit den Legacy-TLS-Ports von Forward Email oder einem lokalen Postfix-Relay – ältere Geräte können jetzt zuverlässig E-Mails über moderne E-Mail-Anbieter senden.
