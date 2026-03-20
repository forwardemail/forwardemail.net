# Forvandl din Raspberry Pi til en sikker FTP-server med email-relæ {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Har du en Raspberry Pi, der samler støv? Uanset om det er den nyeste Pi 5, en Pi 4, Pi Zero eller endda en ældre model, vil denne guide vise dig, hvordan du forvandler den til en kraftfuld, automatiseret filserver med email-relæfunktioner. Perfekt til sikkerhedskameraer, IoT-enheder og mere.

**Kompatibel med:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W og Raspberry Pi Zero.

> \[!NOTE]
> Denne guide er testet og verificeret på en Raspberry Pi 3 Model B med Ubuntu Server 22.04 LTS.


## Indholdsfortegnelse {#table-of-contents}

* [Hvad vi bygger](#what-were-building)
* [Del 1: Få Ubuntu Server på din Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Hvad du får brug for](#what-youll-need)
  * [Flash OS'et](#flashing-the-os)
  * [Opstart og forbindelse](#booting-up--connecting)
* [Del 2: Opsætning af en sikker FTP-server](#part-2-setting-up-a-secure-ftp-server)
  * [Installation og konfiguration](#installation--configuration)
  * [Opret en FTP-bruger](#creating-an-ftp-user)
* [Del 3: Firewall og beskyttelse mod brute-force](#part-3-firewall-and-brute-force-protection)
  * [Opsætning af UFW](#setting-up-ufw)
  * [Opsætning af Fail2ban](#setting-up-fail2ban)
* [Del 4: Automatiseret filbehandling med email-notifikationer](#part-4-automated-file-processing-with-email-notifications)
  * [Mulighed 1: Brug af Forward Email API (anbefalet)](#option-1-using-forward-email-api-recommended)
  * [Mulighed 2: Brug af andre email-udbydere](#option-2-using-other-email-providers)
  * [Opret en systemd-service](#create-a-systemd-service)
* [Del 5: Email-muligheder for ældre enheder](#part-5-email-options-for-legacy-devices)
  * [Mulighed 1: Brug Forward Emails ældre TLS 1.0-porte (anbefalet)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Mulighed 2: Opsæt en Postfix SMTP-relæ](#option-2-set-up-a-postfix-smtp-relay)
* [Fejlfinding](#troubleshooting)
* [Afslutning](#wrapping-up)


## Hvad vi bygger {#what-were-building}

Denne guide vil føre dig igennem opsætningen af et komplet system, der inkluderer:

* **Ubuntu Server 22.04 LTS:** Et stabilt, letvægts-OS til Pi’en.
* **En sikker FTP-server (vsftpd):** Til sikker aflevering af filer.
* **En firewall (UFW) & Fail2ban:** For at holde de dårlige ude.
* **En automatiseret filbehandler:** Et script, der henter nye filer, sender dem som email-vedhæftninger og rydder op efter sig.
* **Email-muligheder for ældre enheder:** To metoder til enheder, der ikke understøtter moderne TLS:
  * Brug Forward Emails ældre TLS 1.0-porte (nemmest)
  * Opsæt en Postfix SMTP-relæ (virker med enhver email-udbyder)

Klar? Lad os gå i gang.


## Del 1: Få Ubuntu Server på din Pi {#part-1-getting-ubuntu-server-on-your-pi}

Først og fremmest skal du have Ubuntu Server til at køre på Raspberry Pi’en. Det er overraskende nemt takket være Raspberry Pi Imager.

### Hvad du får brug for {#what-youll-need}

* En kompatibel Raspberry Pi (se listen ovenfor)
* Et microSD-kort (mindst 8GB, 16GB+ anbefales)
* En computer med microSD-kortlæser
* Passende strømforsyning til din Pi-model
* Internetadgang (Ethernet eller Wi-Fi)

> \[!NOTE]
> Ældre modeller som Raspberry Pi 2 eller Pi Zero kan være langsommere, men fungerer fint til denne opsætning.

### Flash OS'et {#flashing-the-os}

1. **Hent Raspberry Pi Imager:** Download det fra [den officielle hjemmeside](https://www.raspberrypi.com/software/).

2. **Vælg OS:** I imageren vælg "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * For 64-bit modeller (Pi 3, 4, 5, Zero 2 W) vælg **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * For ældre 32-bit modeller (Pi 2, Pi Zero, Pi Zero W) vælg **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Vælg dit lager:** Vælg dit microSD-kort.

> \[!WARNING]
> Dette vil slette dit microSD-kort. Sørg for at have taget backup af vigtige data.

4. **Avancerede indstillinger er din ven:** Klik på tandhjulsikonet (⚙️) for at sætte Pi’en op til headless mode (ingen skærm eller tastatur nødvendigt).
   * **Hostname:** Giv din Pi et navn (f.eks. `pi-server`).
   * **SSH:** Aktiver det og sæt brugernavn og adgangskode.
   * **Wi-Fi:** Hvis du ikke bruger Ethernet, indtast dine Wi-Fi-oplysninger.
   * **Locale:** Sæt din tidszone og tastaturlayout.
5. **Skriv!** Klik på knappen "WRITE" og lad imageren gøre sit arbejde.

### Opstart & Tilslutning {#booting-up--connecting}

Når imageren er færdig, sæt microSD-kortet i Pi'en og tænd den. Giv den et par minutter til at starte op. Den laver noget initial opsætning i baggrunden. Find dens IP-adresse via din routers administrationsside, og forbind derefter via SSH:

```bash
ssh your_username@your_pi_ip_address
```

Du er inde! Raspberry Pi'en er nu klar til konfiguration.


## Del 2: Opsætning af en sikker FTP-server {#part-2-setting-up-a-secure-ftp-server}

Dernæst opsættes `vsftpd` (Very Secure FTP Daemon), konfigureret til maksimal sikkerhed.

### Installation & Konfiguration {#installation--configuration}

1. **Installer vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Backup af konfigurationsfilen:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Rediger konfigurationen:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Hvis en linje er kommenteret ud (starter med `#`), fjern `#` for at aktivere den.

Foretag disse ændringer:

| Indstilling              | Værdi | Formål                                                   |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Deaktiver anonym FTP-adgang                              |
| `local_enable`           | `YES` | Tillad lokale brugere at logge ind                       |
| `write_enable`           | `YES` | Aktiver fil-upload                                       |
| `local_umask`            | `022` | Sæt filrettigheder (644 for filer, 755 for mapper)       |
| `chroot_local_user`      | `YES` | Begræns brugere til deres hjemmemappe                    |
| `allow_writeable_chroot` | `YES` | Tillad uploads i chroot jail                             |

4. **Tilføj Passive Port Range:** Tilføj disse linjer til slutningen af filen. Dette er nødvendigt for firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Aktiver logning:** Tilføj disse linjer for at aktivere logning til Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Gem og genstart:** Tryk `Ctrl+O`, `Enter`, `Ctrl+X`, og genstart derefter servicen:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Oprettelse af en FTP-bruger {#creating-an-ftp-user}

Opret en dedikeret, begrænset bruger til FTP-adgang.

1. **Opret brugeren:**

   ```bash
   sudo adduser ftpuser
   ```

   Følg vejledningen for at sætte en adgangskode. De øvrige felter (navn, telefon osv.) kan efterlades tomme.

2. **Opret mappestrukturen:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Hoved FTP-mappe
   * `/home/ftpuser/ftp/uploads` - Hvor filer uploades

3. **Sæt rettigheder:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Del 3: Firewall og beskyttelse mod brute-force {#part-3-firewall-and-brute-force-protection}

Sikre Pi'en med UFW (Uncomplicated Firewall) og Fail2ban.

### Opsætning af UFW {#setting-up-ufw}

1. **Installer UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Sæt standardpolitikker:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Tillad SSH (kritisk!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Tillad altid SSH før du aktiverer firewall, ellers låser du dig ude!

4. **Tillad FTP-porte:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Aktiver firewall:**

   ```bash
   sudo ufw enable
   ```

### Opsætning af Fail2ban {#setting-up-fail2ban}

Fail2ban blokerer automatisk IP-adresser efter gentagne mislykkede loginforsøg.

1. **Installer Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Opret en lokal konfiguration:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Tilføj disse konfigurationer:**
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

### Opret en Systemd Service {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Tilføj dette indhold:

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

Aktivér og start servicen:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Tjek status:

```bash
sudo systemctl status ftp-monitor.service
```


## Del 5: Emailmuligheder for ældre enheder {#part-5-email-options-for-legacy-devices}

Enheder som FOSSCAM-kameraer understøtter ofte ikke moderne TLS-versioner. Der er to løsninger:

### Mulighed 1: Brug Forward Emails Legacy TLS 1.0-porte (Anbefalet) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Hvis du bruger Forward Email, er dette den nemmeste løsning. Forward Email tilbyder dedikerede legacy TLS 1.0-porte specielt til ældre enheder som kameraer, printere, scannere og faxmaskiner.

#### Priser {#pricing}

Forward Email tilbyder flere planer:

| Plan                    | Pris         | Funktioner                             |
| ----------------------- | ------------ | ------------------------------------ |
| Gratis                  | $0/måned     | Kun videresendelse af email (ingen afsendelse) |
| **Forbedret beskyttelse** | **$3/måned** | **SMTP-adgang + legacy TLS 1.0-porte** |
| Team                    | $9/måned     | Forbedret + teamfunktioner            |
| Enterprise              | $250/måned   | Team + ubegrænsede API-forespørgsler  |

> \[!IMPORTANT]
> **Forbedret beskyttelsesplanen ($3/måned)** eller højere er påkrævet for SMTP-adgang og support af legacy TLS 1.0-porte.

Læs mere på [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Generer dit kodeord {#generate-your-password}

Før du konfigurerer din enhed, generer et kodeord i Forward Email:

1. Log ind på [Forward Email](https://forwardemail.net)
2. Gå til **Min konto → Domæner → \[Dit domæne] → Aliasser**
3. Opret eller vælg en alias (f.eks. `camera@yourdomain.com`)
4. Klik på **"Generate Password"** ved siden af aliaset
5. Kopiér det genererede kodeord – det skal bruges til SMTP-godkendelse

> \[!TIP]
> Hver alias kan have sit eget kodeord. Det er nyttigt til at spore, hvilken enhed der har sendt hvilken email.

#### Konfigurer din enhed {#configure-your-device}

Brug disse indstillinger i dit kamera, printer, scanner eller anden ældre enhed:

| Indstilling     | Værdi                                            |
| --------------- | ------------------------------------------------ |
| SMTP-server     | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (alternativ)                              |
| Brugernavn      | Din alias-email (f.eks. `camera@yourdomain.com`) |
| Kodeord         | Kodeordet fra "Generate Password"                |
| Godkendelse     | Påkrævet                                         |
| Kryptering      | SSL/TLS (anbefalet) eller STARTTLS               |

> \[!WARNING]
> Disse porte bruger den forældede TLS 1.0-protokol, som har kendte sikkerhedssårbarheder (BEAST, POODLE). Brug kun hvis din enhed ikke kan understøtte moderne TLS 1.2+.

Konfigurer blot din enhed med disse indstillinger, og den vil sende emails direkte gennem Forward Email uden behov for en lokal relay-server.

For flere detaljer, se [Forward Email FAQ om Legacy TLS Support](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Mulighed 2: Opsæt en Postfix SMTP Relay {#option-2-set-up-a-postfix-smtp-relay}

Hvis du ikke bruger Forward Email, eller foretrækker en lokal relay-løsning, kan du opsætte Postfix på Raspberry Pi som en mellemmand. Dette virker med enhver emailudbyder (Gmail, Outlook, Yahoo, AOL osv.).

#### Installer Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Under installation:

* Vælg **"Internet Site"**
* Indtast din Pi's værtsnavn (f.eks. `raspberrypi-ftp`) for "System mail name"

#### Vælg din emailudbyder {#choose-your-email-provider}

| Udbyder | SMTP-server          | Port | App-adgangskode påkrævet? |
| ------- | -------------------- | ---- | ------------------------- |
| Gmail   | smtp.gmail.com       | 587  | Ja                        |
| Outlook | smtp-mail.outlook.com| 587  | Ja                        |
| Yahoo   | smtp.mail.yahoo.com  | 465  | Ja                        |
| AOL     | smtp.aol.com         | 587  | Ja                        |

#### Få en app-specifik adgangskode {#get-an-app-specific-password}

De fleste udbydere kræver app-adgangskoder til tredjepartsapplikationer. Generer en fra din emailudbyders sikkerhedsindstillinger:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Brug aldrig din almindelige email-adgangskode. Brug altid en app-specifik adgangskode.

#### Konfigurer SASL-godkendelse {#configure-sasl-authentication}

Opret adgangskodefilen til din valgte udbyder. Dette eksempel bruger Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Tilføj denne linje (tilpas server og port til din udbyder):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

For Gmail, brug:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Sikre og hash filen:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Konfigurer emailadresse-mapping {#configure-email-address-mapping}

Omskriv lokale emailadresser, så de matcher din emailudbyder:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Tilføj denne linje (erstat `HOSTNAME` med din Pi's værtsnavn og brug din email):

```
/.+@HOSTNAME/    your_email@provider.com
```

Eksempel:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Sikre filen:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Konfigurer Postfix hovedindstillinger {#configure-postfix-main-settings}

Rediger hovedkonfigurationen:

```bash
sudo nano /etc/postfix/main.cf
```

Find og opdater relay host (eller tilføj i bunden):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Tilføj disse indstillinger i bunden af filen:

```
# SMTP Relay Configuration
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Network settings
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> For Gmail (port 587), sæt `smtp_tls_wrappermode = no` i stedet for `yes`.

> \[!WARNING]
> Opdater `mynetworks` med dit faktiske netværksområde. Tilføj kun betroede netværk – enhver enhed på disse netværk kan sende mail uden godkendelse.

**Almindelige netværksområder:**

| Netværksområde   | IP-adresseområde           |
| ---------------- | -------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Opdater firewall og genstart {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Bekræft at Postfix kører:

```bash
sudo systemctl status postfix
```

#### Test relayet {#test-the-relay}

Send en test-email:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Tjek logfilerne:

```bash
sudo tail -f /var/log/mail.log
```

Se efter `status=sent` for at bekræfte succes.

#### Konfigurer din enhed {#configure-your-device-1}

I dine kamera- eller enhedsindstillinger:
* **SMTP-server:** Din Pi's IP-adresse (f.eks. `192.168.1.100`)
* **SMTP-port:** `25`
* **Autentificering:** Ingen
* **Kryptering:** Ingen (kun lokalt netværk)


## Fejlfinding {#troubleshooting}

Hvis der opstår problemer, tjek disse logfiler:

**FTP-server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Filovervågning:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix-mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Se mailkø
```


## Afslutning {#wrapping-up}

Raspberry Pi er nu et komplet automatiseret system med sikre filuploads, automatiske e-mail-notifikationer med vedhæftede filer og SMTP-relæfunktioner til ældre enheder. Uanset om du bruger Forward Emails ældre TLS-porte eller et lokalt Postfix-relæ, kan ældre enheder nu sende e-mails pålideligt gennem moderne e-mail-udbydere.
