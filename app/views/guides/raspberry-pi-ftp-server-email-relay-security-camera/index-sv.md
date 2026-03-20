# Förvandla din Raspberry Pi till en säker FTP-server med e-postrelay {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Har du en Raspberry Pi som samlar damm? Oavsett om det är senaste Pi 5, en Pi 4, Pi Zero eller till och med en äldre modell, visar den här guiden hur du förvandlar den till en kraftfull, automatiserad filserver med e-postrelay-funktioner. Perfekt för säkerhetskameror, IoT-enheter och mer.

**Kompatibel med:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W och Raspberry Pi Zero.

> \[!NOTE]
> Den här guiden testades och verifierades på en Raspberry Pi 3 Model B som kör Ubuntu Server 22.04 LTS.


## Innehållsförteckning {#table-of-contents}

* [Vad vi bygger](#what-were-building)
* [Del 1: Installera Ubuntu Server på din Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Vad du behöver](#what-youll-need)
  * [Flashning av operativsystemet](#flashing-the-os)
  * [Starta upp & ansluta](#booting-up--connecting)
* [Del 2: Sätta upp en säker FTP-server](#part-2-setting-up-a-secure-ftp-server)
  * [Installation & konfiguration](#installation--configuration)
  * [Skapa en FTP-användare](#creating-an-ftp-user)
* [Del 3: Brandvägg och skydd mot brute-force-attacker](#part-3-firewall-and-brute-force-protection)
  * [Sätta upp UFW](#setting-up-ufw)
  * [Sätta upp Fail2ban](#setting-up-fail2ban)
* [Del 4: Automatiserad filhantering med e-postnotiser](#part-4-automated-file-processing-with-email-notifications)
  * [Alternativ 1: Använda Forward Email API (rekommenderas)](#option-1-using-forward-email-api-recommended)
  * [Alternativ 2: Använda andra e-postleverantörer](#option-2-using-other-email-providers)
  * [Skapa en systemd-tjänst](#create-a-systemd-service)
* [Del 5: E-postalternativ för äldre enheter](#part-5-email-options-for-legacy-devices)
  * [Alternativ 1: Använd Forward Emails äldre TLS 1.0-portar (rekommenderas)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Alternativ 2: Sätt upp en Postfix SMTP-relä](#option-2-set-up-a-postfix-smtp-relay)
* [Felsökning](#troubleshooting)
* [Avslutning](#wrapping-up)


## Vad vi bygger {#what-were-building}

Den här guiden leder dig genom att sätta upp ett komplett system som inkluderar:

* **Ubuntu Server 22.04 LTS:** Ett stabilt, lättviktigt operativsystem för Pi.
* **En säker FTP-server (vsftpd):** För att säkert lämna filer.
* **En brandvägg (UFW) & Fail2ban:** För att hålla ovälkomna ute.
* **En automatiserad filhanterare:** Ett skript som hämtar nya filer, skickar dem som bilagor via e-post och sedan städar upp efter sig.
* **E-postalternativ för äldre enheter:** Två metoder för enheter som inte stödjer modern TLS:
  * Använd Forward Emails äldre TLS 1.0-portar (enklast)
  * Sätt upp en Postfix SMTP-relä (fungerar med vilken e-postleverantör som helst)

Redo? Då kör vi.


## Del 1: Installera Ubuntu Server på din Pi {#part-1-getting-ubuntu-server-on-your-pi}

Först och främst, få Ubuntu Server att köra på din Raspberry Pi. Det är förvånansvärt enkelt tack vare Raspberry Pi Imager.

### Vad du behöver {#what-youll-need}

* En kompatibel Raspberry Pi (se listan ovan)
* Ett microSD-kort (minst 8GB, 16GB+ rekommenderas)
* En dator med microSD-kortläsare
* Passande strömförsörjning för din Pi-modell
* Internetuppkoppling (Ethernet eller Wi-Fi)

> \[!NOTE]
> Äldre modeller som Raspberry Pi 2 eller Pi Zero kan vara långsammare men fungerar bra för denna installation.

### Flashning av operativsystemet {#flashing-the-os}

1. **Skaffa Raspberry Pi Imager:** Ladda ner det från [den officiella webbplatsen](https://www.raspberrypi.com/software/).

2. **Välj operativsystem:** I imager, välj "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * För 64-bitarsmodeller (Pi 3, 4, 5, Zero 2 W), välj **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * För äldre 32-bitarsmodeller (Pi 2, Pi Zero, Pi Zero W), välj **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Välj lagring:** Välj ditt microSD-kort.

> \[!WARNING]
> Detta kommer att radera allt på ditt microSD-kort. Se till att du har säkerhetskopierat viktiga filer.

4. **Avancerade inställningar är din vän:** Klicka på kugghjulsikonen (⚙️) för att ställa in Pi för headless-läge (ingen skärm eller tangentbord behövs).
   * **Hostname:** Ge din Pi ett namn (t.ex. `pi-server`).
   * **SSH:** Aktivera och ange användarnamn och lösenord.
   * **Wi-Fi:** Om du inte använder Ethernet, ange dina Wi-Fi-uppgifter.
   * **Locale:** Ställ in din tidszon och tangentbordslayout.
5. **Skriv!** Klicka på knappen "WRITE" och låt imager göra sitt jobb.

### Starta upp & ansluta {#booting-up--connecting}

När imager är klar, sätt in microSD-kortet i Pi och koppla in den. Ge den några minuter att starta upp. Den gör en del initial konfiguration i bakgrunden. Hitta dess IP-adress från din routers administrationssida och anslut sedan via SSH:

```bash
ssh your_username@your_pi_ip_address
```

Du är inne! Raspberry Pi är nu redo för konfiguration.


## Del 2: Ställa in en säker FTP-server {#part-2-setting-up-a-secure-ftp-server}

Nästa steg är att installera `vsftpd` (Very Secure FTP Daemon), konfigurerad för maximal säkerhet.

### Installation & konfiguration {#installation--configuration}

1. **Installera vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Säkerhetskopiera konfigurationsfilen:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Redigera konfigurationen:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Om en rad är kommenterad (börjar med `#`), ta bort `#` för att avkommentera den.

Gör dessa ändringar:

| Inställning              | Värde | Syfte                                                    |
| ------------------------ | ----- | -------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Inaktivera anonym FTP-åtkomst                            |
| `local_enable`           | `YES` | Tillåt lokala användare att logga in                     |
| `write_enable`           | `YES` | Aktivera filuppladdningar                                |
| `local_umask`            | `022` | Sätt filbehörigheter (644 för filer, 755 för kataloger) |
| `chroot_local_user`      | `YES` | Lås användare till deras hemkatalog                      |
| `allow_writeable_chroot` | `YES` | Tillåt uppladdningar i chroot-jail                       |

4. **Lägg till passiv portintervall:** Lägg till dessa rader i slutet av filen. Detta behövs för brandväggen.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Aktivera loggning:** Lägg till dessa rader för att aktivera loggning för Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Spara och starta om:** Tryck `Ctrl+O`, `Enter`, `Ctrl+X`, och starta sedan om tjänsten:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Skapa en FTP-användare {#creating-an-ftp-user}

Skapa en dedikerad, begränsad användare för FTP-åtkomst.

1. **Skapa användaren:**

   ```bash
   sudo adduser ftpuser
   ```

   Följ instruktionerna för att sätta ett lösenord. De andra fälten (namn, telefon, etc.) kan lämnas tomma.

2. **Skapa katalogstrukturen:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Huvudkatalog för FTP
   * `/home/ftpuser/ftp/uploads` - Där filer kommer att laddas upp

3. **Sätt behörigheter:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Del 3: Brandvägg och skydd mot brute-force-attacker {#part-3-firewall-and-brute-force-protection}

Säkra Pi med UFW (Uncomplicated Firewall) och Fail2ban.

### Ställa in UFW {#setting-up-ufw}

1. **Installera UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Sätt standardpolicyer:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Tillåt SSH (kritiskt!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Tillåt alltid SSH innan du aktiverar brandväggen, annars låser du ute dig själv!

4. **Tillåt FTP-portar:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Aktivera brandväggen:**

   ```bash
   sudo ufw enable
   ```

### Ställa in Fail2ban {#setting-up-fail2ban}

Fail2ban blockerar automatiskt IP-adresser efter upprepade misslyckade inloggningsförsök.

1. **Installera Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Skapa en lokal konfiguration:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Lägg till dessa konfigurationer:**
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

Gör det körbart:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Skapa en Systemd-tjänst {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Lägg till detta innehåll:

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

Aktivera och starta tjänsten:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Kontrollera status:

```bash
sudo systemctl status ftp-monitor.service
```


## Del 5: E-postalternativ för äldre enheter {#part-5-email-options-for-legacy-devices}

Enheter som FOSSCAM-kameror stödjer ofta inte moderna TLS-versioner. Det finns två lösningar:

### Alternativ 1: Använd Forward Emails Legacy TLS 1.0-portar (Rekommenderas) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Om du använder Forward Email är detta den enklaste lösningen. Forward Email tillhandahåller dedikerade legacy TLS 1.0-portar specifikt för äldre enheter som kameror, skrivare, skannrar och faxmaskiner.

#### Prissättning {#pricing}

Forward Email erbjuder flera planer:

| Plan                    | Pris         | Funktioner                             |
| ----------------------- | ------------ | ------------------------------------ |
| Gratis                  | 0 $/månad    | Endast e-post vidarebefordran (ingen sändning) |
| **Förbättrat skydd**    | **3 $/månad**| **SMTP-åtkomst + legacy TLS 1.0-portar** |
| Team                    | 9 $/månad    | Förbättrat + teamfunktioner           |
| Enterprise              | 250 $/månad  | Team + obegränsade API-förfrågningar |

> \[!IMPORTANT]
> **Förbättrat skydd-planen (3 $/månad)** eller högre krävs för SMTP-åtkomst och stöd för legacy TLS 1.0-portar.

Läs mer på [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Generera ditt lösenord {#generate-your-password}

Innan du konfigurerar din enhet, generera ett lösenord i Forward Email:

1. Logga in på [Forward Email](https://forwardemail.net)
2. Gå till **Mitt konto → Domäner → \[Din domän] → Aliaser**
3. Skapa eller välj en alias (t.ex. `camera@yourdomain.com`)
4. Klicka på **"Generate Password"** bredvid aliaset
5. Kopiera det genererade lösenordet – du kommer använda detta för SMTP-autentisering

> \[!TIP]
> Varje alias kan ha sitt eget lösenord. Detta är användbart för att spåra vilken enhet som skickade vilken e-post.

#### Konfigurera din enhet {#configure-your-device}

Använd dessa inställningar i din kamera, skrivare, skanner eller annan äldre enhet:

| Inställning     | Värde                                            |
| --------------- | ------------------------------------------------ |
| SMTP-server     | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (alternativ)                              |
| Användarnamn    | Din alias-e-post (t.ex. `camera@yourdomain.com`) |
| Lösenord        | Lösenordet från "Generate Password"              |
| Autentisering   | Krävs                                            |
| Kryptering      | SSL/TLS (rekommenderas) eller STARTTLS           |

> \[!WARNING]
> Dessa portar använder det föråldrade TLS 1.0-protokollet som har kända säkerhetssårbarheter (BEAST, POODLE). Använd endast om din enhet inte kan stödja moderna TLS 1.2+.

Konfigurera helt enkelt din enhet med dessa inställningar så skickar den e-post direkt via Forward Email utan att behöva en lokal relay-server.

För mer information, se [Forward Email FAQ om Legacy TLS Support](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Alternativ 2: Ställ in en Postfix SMTP-relä {#option-2-set-up-a-postfix-smtp-relay}

Om du inte använder Forward Email, eller föredrar en lokal relay-lösning, konfigurera Postfix på Raspberry Pi för att agera som mellanhand. Detta fungerar med vilken e-postleverantör som helst (Gmail, Outlook, Yahoo, AOL, etc.).

#### Installera Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Under installation:

* Välj **"Internet Site"**
* Ange din Pi:s värdnamn (t.ex. `raspberrypi-ftp`) för "System mail name"

#### Välj din e-postleverantör {#choose-your-email-provider}

| Leverantör | SMTP-server          | Port | App-lösenord krävs?   |
| ---------- | -------------------- | ---- | --------------------- |
| Gmail      | smtp.gmail.com       | 587  | Ja                    |
| Outlook    | smtp-mail.outlook.com| 587  | Ja                    |
| Yahoo      | smtp.mail.yahoo.com  | 465  | Ja                    |
| AOL        | smtp.aol.com         | 587  | Ja                    |

#### Skaffa ett app-specifikt lösenord {#get-an-app-specific-password}

De flesta leverantörer kräver app-lösenord för tredjepartsapplikationer. Skapa ett från din e-postleverantörs säkerhetsinställningar:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Använd aldrig ditt vanliga e-postlösenord. Använd alltid ett app-specifikt lösenord.

#### Konfigurera SASL-autentisering {#configure-sasl-authentication}

Skapa lösenordsfilen för din valda leverantör. Detta exempel använder Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Lägg till denna rad (justera server och port för din leverantör):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

För Gmail, använd:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Säkra och hasha filen:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Konfigurera e-postadressmappning {#configure-email-address-mapping}

Omskriv lokala e-postadresser för att matcha din e-postleverantör:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Lägg till denna rad (byt ut `HOSTNAME` mot din Pi:s värdnamn och använd din e-post):

```
/.+@HOSTNAME/    your_email@provider.com
```

Exempel:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Säkra filen:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Konfigurera Postfix huvudinställningar {#configure-postfix-main-settings}

Redigera huvudkonfigurationen:

```bash
sudo nano /etc/postfix/main.cf
```

Hitta och uppdatera relay host (eller lägg till längst ner):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Lägg till dessa inställningar längst ner i filen:

```
# SMTP Relay-konfiguration
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Nätverksinställningar
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> För Gmail (port 587), sätt `smtp_tls_wrappermode = no` istället för `yes`.

> \[!WARNING]
> Uppdatera `mynetworks` med ditt faktiska nätverksområde. Lägg endast till betrodda nätverk – alla enheter i dessa nätverk kan skicka mail utan autentisering.

**Vanliga nätverksområden:**

| Nätverksområde   | IP-adressintervall          |
| ---------------- | --------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Uppdatera brandvägg och starta om {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP för lokala enheter'
sudo systemctl restart postfix
```

Verifiera att Postfix körs:

```bash
sudo systemctl status postfix
```

#### Testa reläet {#test-the-relay}

Skicka ett testmail:

```bash
echo "Test från Postfix" | mail -s "Test" your_email@provider.com
```

Kontrollera loggarna:

```bash
sudo tail -f /var/log/mail.log
```

Sök efter `status=sent` för att bekräfta framgång.

#### Konfigurera din enhet {#configure-your-device-1}

I din kamera eller enhets inställningar:
* **SMTP-server:** Din Pi:s IP-adress (t.ex. `192.168.1.100`)
* **SMTP-port:** `25`
* **Autentisering:** Ingen
* **Kryptering:** Ingen (endast lokalt nätverk)


## Felsökning {#troubleshooting}

Om problem uppstår, kontrollera dessa loggfiler:

**FTP-server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Filövervakare:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix-mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Visa mailkö
```


## Avslutning {#wrapping-up}

Raspberry Pi är nu ett komplett automatiserat system med säkra filuppladdningar, automatiska e-postaviseringar med bilagor och SMTP-reläfunktioner för äldre enheter. Oavsett om du använder Forward Emails äldre TLS-portar eller en lokal Postfix-relä kan äldre enheter nu skicka e-post pålitligt via moderna e-postleverantörer.
