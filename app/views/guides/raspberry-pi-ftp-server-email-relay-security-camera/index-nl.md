# Zet je Raspberry Pi om in een veilige FTP-server met e-mail relay {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Heb je een Raspberry Pi die stof verzamelt? Of het nu de nieuwste Pi 5 is, een Pi 4, Pi Zero, of zelfs een ouder model, deze gids laat je zien hoe je er een krachtige, geautomatiseerde bestandsserver met e-mail relay mogelijkheden van maakt. Perfect voor beveiligingscamera's, IoT-apparaten en meer.

**Compatibel met:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, en Raspberry Pi Zero.

> \[!NOTE]
> Deze gids is getest en geverifieerd op een Raspberry Pi 3 Model B met Ubuntu Server 22.04 LTS.


## Inhoudsopgave {#table-of-contents}

* [Wat we bouwen](#what-were-building)
* [Deel 1: Ubuntu Server op je Pi krijgen](#part-1-getting-ubuntu-server-on-your-pi)
  * [Wat je nodig hebt](#what-youll-need)
  * [De OS flashen](#flashing-the-os)
  * [Opstarten & verbinden](#booting-up--connecting)
* [Deel 2: Een veilige FTP-server opzetten](#part-2-setting-up-a-secure-ftp-server)
  * [Installatie & configuratie](#installation--configuration)
  * [Een FTP-gebruiker aanmaken](#creating-an-ftp-user)
* [Deel 3: Firewall en brute-force bescherming](#part-3-firewall-and-brute-force-protection)
  * [UFW instellen](#setting-up-ufw)
  * [Fail2ban instellen](#setting-up-fail2ban)
* [Deel 4: Geautomatiseerde bestandsverwerking met e-mail notificaties](#part-4-automated-file-processing-with-email-notifications)
  * [Optie 1: Gebruik maken van Forward Email API (aanbevolen)](#option-1-using-forward-email-api-recommended)
  * [Optie 2: Gebruik maken van andere e-mailproviders](#option-2-using-other-email-providers)
  * [Een systemd-service aanmaken](#create-a-systemd-service)
* [Deel 5: E-mailopties voor legacy apparaten](#part-5-email-options-for-legacy-devices)
  * [Optie 1: Gebruik Forward Email’s legacy TLS 1.0 poorten (aanbevolen)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Optie 2: Een Postfix SMTP relay opzetten](#option-2-set-up-a-postfix-smtp-relay)
* [Probleemoplossing](#troubleshooting)
* [Afronden](#wrapping-up)


## Wat we bouwen {#what-were-building}

Deze gids leidt je door het opzetten van een compleet systeem dat omvat:

* **Ubuntu Server 22.04 LTS:** Een stabiel, lichtgewicht besturingssysteem voor de Pi.
* **Een veilige FTP-server (vsftpd):** Om bestanden veilig te uploaden.
* **Een firewall (UFW) & Fail2ban:** Om de slechte jongens buiten te houden.
* **Een geautomatiseerde bestandsverwerker:** Een script dat nieuwe bestanden pakt, ze als bijlagen e-mailt en daarna opruimt.
* **E-mailopties voor legacy apparaten:** Twee methodes voor apparaten die geen moderne TLS ondersteunen:
  * Gebruik Forward Email’s legacy TLS 1.0 poorten (makkelijkst)
  * Zet een Postfix SMTP relay op (werkt met elke e-mailprovider)

Klaar? Laten we beginnen.


## Deel 1: Ubuntu Server op je Pi krijgen {#part-1-getting-ubuntu-server-on-your-pi}

Allereerst, zorg dat Ubuntu Server draait op de Raspberry Pi. Dit is verrassend eenvoudig dankzij de Raspberry Pi Imager.

### Wat je nodig hebt {#what-youll-need}

* Elke compatibele Raspberry Pi (zie lijst hierboven)
* Een microSD-kaart (minimaal 8GB, 16GB+ aanbevolen)
* Een computer met een microSD-kaartlezer
* Passende voeding voor jouw Pi-model
* Internettoegang (Ethernet of Wi-Fi)

> \[!NOTE]
> Oudere modellen zoals de Raspberry Pi 2 of Pi Zero zijn misschien wat trager, maar werken prima voor deze setup.

### De OS flashen {#flashing-the-os}

1. **Download de Raspberry Pi Imager:** Haal hem binnen via de [officiële website](https://www.raspberrypi.com/software/).

2. **Kies het OS:** Selecteer in de imager "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Voor 64-bit modellen (Pi 3, 4, 5, Zero 2 W) kies **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Voor oudere 32-bit modellen (Pi 2, Pi Zero, Pi Zero W) kies **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Selecteer je opslag:** Kies je microSD-kaart.

> \[!WARNING]
> Dit wist je microSD-kaart volledig. Zorg dat je belangrijke data hebt geback-upt.

4. **Geavanceerde opties zijn je vriend:** Klik op het tandwiel-icoon (⚙️) om de Pi in headless modus in te stellen (geen monitor of toetsenbord nodig).
   * **Hostname:** Geef je Pi een naam (bijv. `pi-server`).
   * **SSH:** Zet aan en stel een gebruikersnaam en wachtwoord in.
   * **Wi-Fi:** Vul je Wi-Fi gegevens in als je geen Ethernet gebruikt.
   * **Locale:** Stel je tijdzone en toetsenbordindeling in.
5. **Schrijf!** Klik op de knop "WRITE" en laat de imager zijn werk doen.

### Opstarten & Verbinden {#booting-up--connecting}

Zodra de imager klaar is, steek je de microSD-kaart in de Pi en sluit je deze aan. Geef het een paar minuten om op te starten. Er wordt op de achtergrond wat initiële setup gedaan. Zoek het IP-adres op via de beheerderspagina van je router en maak vervolgens verbinding via SSH:

```bash
ssh your_username@your_pi_ip_address
```

Je bent binnen! De Raspberry Pi is nu klaar voor configuratie.


## Deel 2: Een Veilige FTP-server Opzetten {#part-2-setting-up-a-secure-ftp-server}

Vervolgens stel je `vsftpd` (Very Secure FTP Daemon) in, geconfigureerd voor maximale beveiliging.

### Installatie & Configuratie {#installation--configuration}

1. **Installeer vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Maak een back-up van het configuratiebestand:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Bewerk de configuratie:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Als een regel is uitgecommentarieerd (begint met een `#`), haal dan het `#` weg om deze te activeren.

Breng deze wijzigingen aan:

| Instelling               | Waarde | Doel                                                      |
| ------------------------ | ------ | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`   | Schakel anonieme FTP-toegang uit                          |
| `local_enable`           | `YES`  | Sta lokale gebruikers toe om in te loggen                 |
| `write_enable`           | `YES`  | Schakel het uploaden van bestanden in                     |
| `local_umask`            | `022`  | Stel bestandsrechten in (644 voor bestanden, 755 voor mappen) |
| `chroot_local_user`      | `YES`  | Zet gebruikers vast in hun home directory                  |
| `allow_writeable_chroot` | `YES`  | Sta uploads toe in de chroot jail                          |

4. **Voeg het passieve poortbereik toe:** Voeg deze regels toe aan het einde van het bestand. Dit is nodig voor de firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Schakel logging in:** Voeg deze regels toe om logging voor Fail2ban in te schakelen.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Opslaan en herstarten:** Druk op `Ctrl+O`, `Enter`, `Ctrl+X`, en herstart vervolgens de service:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Een FTP-gebruiker Aanmaken {#creating-an-ftp-user}

Maak een speciale, beperkte gebruiker aan voor FTP-toegang.

1. **Maak de gebruiker aan:**

   ```bash
   sudo adduser ftpuser
   ```

   Volg de aanwijzingen om een wachtwoord in te stellen. De overige velden (naam, telefoon, etc.) kunnen leeg blijven.

2. **Maak de mappenstructuur aan:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Hoofdmap voor FTP
   * `/home/ftpuser/ftp/uploads` - Waar bestanden worden geüpload

3. **Stel de rechten in:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Deel 3: Firewall en Bescherming tegen Brute-Force {#part-3-firewall-and-brute-force-protection}

Beveilig de Pi met UFW (Uncomplicated Firewall) en Fail2ban.

### UFW Instellen {#setting-up-ufw}

1. **Installeer UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Stel standaardbeleid in:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Sta SSH toe (kritisch!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Sta altijd SSH toe voordat je de firewall inschakelt, anders sluit je jezelf buiten!

4. **Sta FTP-poorten toe:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Schakel de firewall in:**

   ```bash
   sudo ufw enable
   ```

### Fail2ban Instellen {#setting-up-fail2ban}

Fail2ban blokkeert automatisch IP-adressen na herhaalde mislukte inlogpogingen.

1. **Installeer Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Maak een lokale configuratie aan:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Voeg deze configuraties toe:**
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

Maak het uitvoerbaar:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Maak een Systemd Service aan {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Voeg deze inhoud toe:

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

Activeer en start de service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Controleer de status:

```bash
sudo systemctl status ftp-monitor.service
```


## Deel 5: E-mailopties voor Legacy Apparaten {#part-5-email-options-for-legacy-devices}

Apparaten zoals FOSSCAM-camera's ondersteunen vaak geen moderne TLS-versies. Er zijn twee oplossingen:

### Optie 1: Gebruik Forward Email's Legacy TLS 1.0 Poorten (Aanbevolen) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Als je Forward Email gebruikt, is dit de eenvoudigste oplossing. Forward Email biedt speciale legacy TLS 1.0 poorten specifiek voor oudere apparaten zoals camera's, printers, scanners en faxapparaten.

#### Prijzen {#pricing}

Forward Email biedt verschillende plannen:

| Plan                    | Prijs        | Functies                               |
| ----------------------- | ------------ | -------------------------------------- |
| Gratis                  | $0/maand     | Alleen e-mail doorsturen (geen verzending)     |
| **Enhanced Protection** | **$3/maand** | **SMTP-toegang + legacy TLS 1.0 poorten** |
| Team                    | $9/maand     | Enhanced + teamfuncties               |
| Enterprise              | $250/maand   | Team + onbeperkte API-aanvragen          |

> \[!IMPORTANT]
> Het **Enhanced Protection-plan ($3/maand)** of hoger is vereist voor SMTP-toegang en ondersteuning van legacy TLS 1.0 poorten.

Lees meer op [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Genereer je wachtwoord {#generate-your-password}

Genereer een wachtwoord in Forward Email voordat je je apparaat configureert:

1. Log in op [Forward Email](https://forwardemail.net)
2. Ga naar **Mijn Account → Domeinen → \[Jouw Domein] → Aliassen**
3. Maak een alias aan of selecteer er een (bijv. `camera@jouwdomein.com`)
4. Klik naast de alias op **"Genereer Wachtwoord"**
5. Kopieer het gegenereerde wachtwoord - dit gebruik je voor SMTP-authenticatie

> \[!TIP]
> Elke alias kan een eigen wachtwoord hebben. Dit is handig om te zien welk apparaat welke e-mail heeft verzonden.

#### Configureer je apparaat {#configure-your-device}

Gebruik deze instellingen in je camera, printer, scanner of ander legacy apparaat:

| Instelling      | Waarde                                            |
| --------------- | ------------------------------------------------ |
| SMTP-server     | `smtp.forwardemail.net`                          |
| Poort (SSL/TLS) | `2455`                                           |
| Poort (STARTTLS)| `2555` (alternatief)                             |
| Gebruikersnaam  | Je alias e-mail (bijv. `camera@jouwdomein.com`) |
| Wachtwoord      | Het wachtwoord van "Genereer Wachtwoord"         |
| Authenticatie   | Vereist                                          |
| Encryptie       | SSL/TLS (aanbevolen) of STARTTLS                  |

> \[!WARNING]
> Deze poorten gebruiken het verouderde TLS 1.0 protocol dat bekende beveiligingsproblemen heeft (BEAST, POODLE). Gebruik alleen als je apparaat geen moderne TLS 1.2+ ondersteunt.

Configureer je apparaat simpelweg met deze instellingen en het zal e-mails direct via Forward Email versturen zonder een lokale relayserver nodig te hebben.

Voor meer details, zie de [Forward Email FAQ over Legacy TLS Ondersteuning](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Optie 2: Stel een Postfix SMTP Relay in {#option-2-set-up-a-postfix-smtp-relay}

Als je geen gebruik maakt van Forward Email, of liever een lokale relay-oplossing hebt, stel dan Postfix in op de Raspberry Pi als tussenpersoon. Dit werkt met elke e-mailprovider (Gmail, Outlook, Yahoo, AOL, enz.).

#### Installeer Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Tijdens de installatie:

* Selecteer **"Internet Site"**
* Voer de hostnaam van je Pi in (bijv. `raspberrypi-ftp`) voor "System mail name"

#### Kies je e-mailprovider {#choose-your-email-provider}

| Provider | SMTP-server          | Poort | App-wachtwoord vereist? |
| -------- | -------------------- | ----- | ----------------------- |
| Gmail    | smtp.gmail.com       | 587   | Ja                      |
| Outlook  | smtp-mail.outlook.com| 587   | Ja                      |
| Yahoo    | smtp.mail.yahoo.com  | 465   | Ja                      |
| AOL      | smtp.aol.com         | 587   | Ja                      |

#### Verkrijg een app-specifiek wachtwoord {#get-an-app-specific-password}

De meeste providers vereisen app-wachtwoorden voor applicaties van derden. Genereer er een via de beveiligingsinstellingen van je e-mailprovider:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Gebruik nooit je gewone e-mailwachtwoord. Gebruik altijd een app-specifiek wachtwoord.

#### Configureer SASL-authenticatie {#configure-sasl-authentication}

Maak het wachtwoordbestand aan voor je gekozen provider. Dit voorbeeld gebruikt Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Voeg deze regel toe (pas server en poort aan voor jouw provider):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Voor Gmail gebruik je:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Beveilig en hash het bestand:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Configureer e-mailadresmapping {#configure-email-address-mapping}

Herschrijf lokale e-mailadressen zodat ze overeenkomen met je e-mailprovider:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Voeg deze regel toe (vervang `HOSTNAME` door de hostnaam van je Pi en gebruik je eigen e-mailadres):

```
/.+@HOSTNAME/    your_email@provider.com
```

Voorbeeld:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Beveilig het bestand:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Configureer de hoofdinstellingen van Postfix {#configure-postfix-main-settings}

Bewerk de hoofdconfiguratie:

```bash
sudo nano /etc/postfix/main.cf
```

Zoek en werk de relayhost bij (of voeg toe aan het einde):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Voeg deze instellingen toe aan het einde van het bestand:

```
# SMTP Relay Configuratie
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Netwerkinstellingen
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Voor Gmail (poort 587), stel `smtp_tls_wrappermode = no` in in plaats van `yes`.

> \[!WARNING]
> Werk `mynetworks` bij met je daadwerkelijke netwerkbereik. Voeg alleen vertrouwde netwerken toe - elk apparaat op deze netwerken kan mail relayen zonder authenticatie.

**Veelvoorkomende netwerkranges:**

| Netwerkbereik    | IP-adresbereik             |
| ---------------- | -------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Update firewall en herstart {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP voor lokale apparaten'
sudo systemctl restart postfix
```

Controleer of Postfix draait:

```bash
sudo systemctl status postfix
```

#### Test de relay {#test-the-relay}

Stuur een testmail:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Bekijk de logs:

```bash
sudo tail -f /var/log/mail.log
```

Zoek naar `status=sent` om succes te bevestigen.

#### Configureer je apparaat {#configure-your-device-1}

In de instellingen van je camera of apparaat:
* **SMTP-server:** Het IP-adres van je Pi (bijv. `192.168.1.100`)
* **SMTP-poort:** `25`
* **Authenticatie:** Geen
* **Encryptie:** Geen (alleen lokaal netwerk)


## Problemen oplossen {#troubleshooting}

Als er problemen optreden, controleer dan deze logbestanden:

**FTP-server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Bestandsmonitor:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Bekijk mailwachtrij
```


## Afronden {#wrapping-up}

De Raspberry Pi is nu een compleet geautomatiseerd systeem met veilige bestanduploads, automatische e-mailmeldingen met bijlagen, en SMTP-relay mogelijkheden voor legacy apparaten. Of je nu de legacy TLS-poorten van Forward Email gebruikt of een lokale Postfix-relay, oudere apparaten kunnen nu betrouwbaar e-mails versturen via moderne e-mailproviders.
