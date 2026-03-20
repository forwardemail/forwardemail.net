# Gjør din Raspberry Pi til en sikker FTP-server med e-post videresending {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Har du en Raspberry Pi som samler støv? Enten det er den nyeste Pi 5, en Pi 4, Pi Zero eller til og med en eldre modell, vil denne guiden vise deg hvordan du kan gjøre den om til en kraftig, automatisert filserver med e-post videresending. Perfekt for sikkerhetskameraer, IoT-enheter og mer.

**Kompatibel med:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, og Raspberry Pi Zero.

> \[!NOTE]
> Denne guiden ble testet og verifisert på en Raspberry Pi 3 Model B som kjører Ubuntu Server 22.04 LTS.


## Innholdsfortegnelse {#table-of-contents}

* [Hva vi bygger](#what-were-building)
* [Del 1: Få Ubuntu Server på din Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Hva du trenger](#what-youll-need)
  * [Flashing av OS](#flashing-the-os)
  * [Oppstart og tilkobling](#booting-up--connecting)
* [Del 2: Sette opp en sikker FTP-server](#part-2-setting-up-a-secure-ftp-server)
  * [Installasjon og konfigurasjon](#installation--configuration)
  * [Opprette en FTP-bruker](#creating-an-ftp-user)
* [Del 3: Brannmur og beskyttelse mot brute-force](#part-3-firewall-and-brute-force-protection)
  * [Sette opp UFW](#setting-up-ufw)
  * [Sette opp Fail2ban](#setting-up-fail2ban)
* [Del 4: Automatisert filbehandling med e-postvarsler](#part-4-automated-file-processing-with-email-notifications)
  * [Alternativ 1: Bruke Forward Email API (anbefalt)](#option-1-using-forward-email-api-recommended)
  * [Alternativ 2: Bruke andre e-postleverandører](#option-2-using-other-email-providers)
  * [Opprett en systemd-tjeneste](#create-a-systemd-service)
* [Del 5: E-postalternativer for eldre enheter](#part-5-email-options-for-legacy-devices)
  * [Alternativ 1: Bruk Forward Emails eldre TLS 1.0-porter (anbefalt)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Alternativ 2: Sett opp en Postfix SMTP-relé](#option-2-set-up-a-postfix-smtp-relay)
* [Feilsøking](#troubleshooting)
* [Avslutning](#wrapping-up)


## Hva vi bygger {#what-were-building}

Denne guiden vil lede deg gjennom oppsettet av et komplett system som inkluderer:

* **Ubuntu Server 22.04 LTS:** Et solid, lettvekts operativsystem for Pi.
* **En sikker FTP-server (vsftpd):** For sikker filoverføring.
* **En brannmur (UFW) & Fail2ban:** For å holde uvedkommende ute.
* **En automatisert filbehandler:** Et skript som henter nye filer, sender dem som vedlegg på e-post, og deretter rydder opp.
* **E-postalternativer for eldre enheter:** To metoder for enheter som ikke støtter moderne TLS:
  * Bruk Forward Emails eldre TLS 1.0-porter (enklest)
  * Sett opp en Postfix SMTP-relé (fungerer med alle e-postleverandører)

Klar? La oss sette i gang.


## Del 1: Få Ubuntu Server på din Pi {#part-1-getting-ubuntu-server-on-your-pi}

Først og fremst, få Ubuntu Server til å kjøre på Raspberry Pi-en. Dette er overraskende enkelt takket være Raspberry Pi Imager.

### Hva du trenger {#what-youll-need}

* En kompatibel Raspberry Pi (se listen over)
* Et microSD-kort (minst 8GB, 16GB+ anbefalt)
* En datamaskin med microSD-kortleser
* Passende strømforsyning for din Pi-modell
* Internett-tilgang (Ethernet eller Wi-Fi)

> \[!NOTE]
> Eldre modeller som Raspberry Pi 2 eller Pi Zero kan være tregere, men fungerer fint for dette oppsettet.

### Flashing av OS {#flashing-the-os}

1. **Last ned Raspberry Pi Imager:** Last det ned fra [den offisielle nettsiden](https://www.raspberrypi.com/software/).

2. **Velg OS:** I imageren, velg "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * For 64-bit modeller (Pi 3, 4, 5, Zero 2 W), velg **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * For eldre 32-bit modeller (Pi 2, Pi Zero, Pi Zero W), velg **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Velg lagringsenhet:** Velg ditt microSD-kort.

> \[!WARNING]
> Dette vil slette microSD-kortet ditt. Sørg for at du har sikkerhetskopiert viktige filer.

4. **Avanserte innstillinger er din venn:** Klikk på tannhjulikonet (⚙️) for å sette opp Pi-en i headless-modus (ingen skjerm eller tastatur nødvendig).
   * **Vertsnavn:** Gi Pi-en et navn (f.eks. `pi-server`).
   * **SSH:** Aktiver det og sett brukernavn og passord.
   * **Wi-Fi:** Hvis du ikke bruker Ethernet, skriv inn Wi-Fi-detaljene dine.
   * **Lokalisering:** Sett tidssone og tastaturoppsett.
5. **Skriv!** Klikk på "WRITE"-knappen og la imageren gjøre jobben sin.

### Oppstart og tilkobling {#booting-up--connecting}

Når imageren er ferdig, sett microSD-kortet inn i Pi-en og koble den til. Gi den noen minutter til å starte opp. Den gjør noe initial oppsett i bakgrunnen. Finn IP-adressen fra ruteren din sin administrasjonsside, og koble til via SSH:

```bash
ssh your_username@your_pi_ip_address
```

Du er inne! Raspberry Pi-en er nå klar for konfigurasjon.


## Del 2: Sette opp en sikker FTP-server {#part-2-setting-up-a-secure-ftp-server}

Neste steg er å sette opp `vsftpd` (Very Secure FTP Daemon), konfigurert for maksimal sikkerhet.

### Installasjon og konfigurasjon {#installation--configuration}

1. **Installer vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Ta backup av konfigurasjonsfilen:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Rediger konfigurasjonen:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Hvis en linje er kommentert ut (starter med `#`), fjern `#` for å aktivere den.

Gjør disse endringene:

| Innstilling              | Verdi | Formål                                                   |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Deaktiver anonym FTP-tilgang                              |
| `local_enable`           | `YES` | Tillat lokale brukere å logge inn                         |
| `write_enable`           | `YES` | Aktiver filopplastinger                                   |
| `local_umask`            | `022` | Sett filrettigheter (644 for filer, 755 for mapper)       |
| `chroot_local_user`      | `YES` | Lås brukere til hjemmemappen deres                        |
| `allow_writeable_chroot` | `YES` | Tillat opplastinger i chroot jail                         |

4. **Legg til passiv portrekkevidde:** Legg til disse linjene på slutten av filen. Dette trengs for brannmuren.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Aktiver logging:** Legg til disse linjene for å aktivere logging for Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Lagre og start på nytt:** Trykk `Ctrl+O`, `Enter`, `Ctrl+X`, og start deretter tjenesten på nytt:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Opprette en FTP-bruker {#creating-an-ftp-user}

Opprett en dedikert, begrenset bruker for FTP-tilgang.

1. **Opprett brukeren:**

   ```bash
   sudo adduser ftpuser
   ```

   Følg instruksjonene for å sette passord. De andre feltene (navn, telefon, osv.) kan stå tomme.

2. **Opprett mappestrukturen:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Hoved FTP-mappe
   * `/home/ftpuser/ftp/uploads` - Der filer skal lastes opp

3. **Sett rettigheter:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Del 3: Brannmur og beskyttelse mot brute-force {#part-3-firewall-and-brute-force-protection}

Sikre Pi-en med UFW (Uncomplicated Firewall) og Fail2ban.

### Sette opp UFW {#setting-up-ufw}

1. **Installer UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Sett standardregler:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Tillat SSH (kritisk!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Tillat alltid SSH før du aktiverer brannmuren, ellers låser du deg ute!

4. **Tillat FTP-porter:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Aktiver brannmuren:**

   ```bash
   sudo ufw enable
   ```

### Sette opp Fail2ban {#setting-up-fail2ban}

Fail2ban blokkerer automatisk IP-adresser etter gjentatte mislykkede påloggingsforsøk.

1. **Installer Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Opprett lokal konfigurasjon:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Legg til disse konfigurasjonene:**
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

Gjør det kjørbart:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Opprett en Systemd-tjeneste {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Legg til dette innholdet:

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

Aktiver og start tjenesten:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Sjekk status:

```bash
sudo systemctl status ftp-monitor.service
```


## Del 5: E-postalternativer for eldre enheter {#part-5-email-options-for-legacy-devices}

Enheter som FOSSCAM-kameraer støtter ofte ikke moderne TLS-versjoner. Det finnes to løsninger:

### Alternativ 1: Bruk Forward Emails Legacy TLS 1.0-porter (anbefalt) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Hvis du bruker Forward Email, er dette den enkleste løsningen. Forward Email tilbyr dedikerte legacy TLS 1.0-porter spesielt for eldre enheter som kameraer, skrivere, skannere og faksmaskiner.

#### Priser {#pricing}

Forward Email tilbyr flere planer:

| Plan                    | Pris         | Funksjoner                             |
| ----------------------- | ------------ | ------------------------------------ |
| Gratis                  | $0/måned     | Kun e-postvideresending (ingen sending) |
| **Forbedret beskyttelse** | **$3/måned** | **SMTP-tilgang + legacy TLS 1.0-porter** |
| Team                    | $9/måned     | Forbedret + teamfunksjoner            |
| Enterprise              | $250/måned   | Team + ubegrensede API-forespørsler   |

> \[!IMPORTANT]
> **Forbedret beskyttelsesplan ($3/måned)** eller høyere kreves for SMTP-tilgang og støtte for legacy TLS 1.0-porter.

Lær mer på [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Generer passordet ditt {#generate-your-password}

Før du konfigurerer enheten din, generer et passord i Forward Email:

1. Logg inn på [Forward Email](https://forwardemail.net)
2. Gå til **Min konto → Domener → \[Ditt domene] → Alias**
3. Opprett eller velg et alias (f.eks. `camera@yourdomain.com`)
4. Klikk **"Generate Password"** ved siden av aliaset
5. Kopier det genererte passordet – dette bruker du til SMTP-autentisering

> \[!TIP]
> Hvert alias kan ha sitt eget passord. Dette er nyttig for å spore hvilken enhet som sendte hvilken e-post.

#### Konfigurer enheten din {#configure-your-device}

Bruk disse innstillingene i kameraet, skriveren, skanneren eller annen eldre enhet:

| Innstilling      | Verdi                                            |
| --------------- | ------------------------------------------------ |
| SMTP-server     | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (alternativ)                              |
| Brukernavn      | Din alias-e-post (f.eks. `camera@yourdomain.com`) |
| Passord         | Passordet fra "Generate Password"                |
| Autentisering   | Påkrevd                                          |
| Kryptering      | SSL/TLS (anbefalt) eller STARTTLS                |

> \[!WARNING]
> Disse portene bruker den utdaterte TLS 1.0-protokollen som har kjente sikkerhetssårbarheter (BEAST, POODLE). Bruk kun hvis enheten din ikke støtter moderne TLS 1.2+.

Konfigurer enheten din med disse innstillingene, så sender den e-post direkte gjennom Forward Email uten behov for en lokal reléserver.

For flere detaljer, se [Forward Email FAQ om Legacy TLS-støtte](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Alternativ 2: Sett opp en Postfix SMTP-relé {#option-2-set-up-a-postfix-smtp-relay}

Hvis du ikke bruker Forward Email, eller foretrekker en lokal reléløsning, sett opp Postfix på Raspberry Pi for å fungere som mellomledd. Dette fungerer med hvilken som helst e-postleverandør (Gmail, Outlook, Yahoo, AOL, osv.).

#### Installer Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Under installasjonen:

* Velg **"Internet Site"**
* Skriv inn Pi-ens vertsnavn (f.eks. `raspberrypi-ftp`) for "System mail name"

#### Velg din e-postleverandør {#choose-your-email-provider}

| Leverandør | SMTP-server           | Port | Krever app-passord? |
| ---------- | --------------------- | ---- | ------------------- |
| Gmail      | smtp.gmail.com        | 587  | Ja                  |
| Outlook    | smtp-mail.outlook.com | 587  | Ja                  |
| Yahoo      | smtp.mail.yahoo.com   | 465  | Ja                  |
| AOL        | smtp.aol.com          | 587  | Ja                  |

#### Skaff et app-spesifikt passord {#get-an-app-specific-password}

De fleste leverandører krever app-passord for tredjepartsapplikasjoner. Generer ett fra sikkerhetsinnstillingene til e-postleverandøren din:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Bruk aldri ditt vanlige e-postpassord. Bruk alltid et app-spesifikt passord.

#### Konfigurer SASL-autentisering {#configure-sasl-authentication}

Opprett passordfilen for valgt leverandør. Dette eksempelet bruker Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Legg til denne linjen (juster server og port for din leverandør):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

For Gmail, bruk:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Sikre og hashe filen:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Konfigurer e-postadresse-mapping {#configure-email-address-mapping}

Omskriv lokale e-postadresser for å matche e-postleverandøren din:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Legg til denne linjen (erstatt `HOSTNAME` med Pi-ens vertsnavn og bruk din e-post):

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

#### Konfigurer Postfix hovedinnstillinger {#configure-postfix-main-settings}

Rediger hovedkonfigurasjonen:

```bash
sudo nano /etc/postfix/main.cf
```

Finn og oppdater relay host (eller legg til på slutten):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Legg til disse innstillingene på slutten av filen:

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
> For Gmail (port 587), sett `smtp_tls_wrappermode = no` i stedet for `yes`.

> \[!WARNING]
> Oppdater `mynetworks` med ditt faktiske nettverksområde. Legg kun til pålitelige nettverk – enheter på disse nettverkene kan sende e-post uten autentisering.

**Vanlige nettverksområder:**

| Nettverksområde   | IP-adresseområde           |
| ----------------- | -------------------------- |
| `192.168.0.0/24`  | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24`  | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`      | 10.0.0.0 - 10.255.255.255   |

#### Oppdater brannmur og start på nytt {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Sjekk at Postfix kjører:

```bash
sudo systemctl status postfix
```

#### Test reléet {#test-the-relay}

Send en test-epost:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Sjekk loggene:

```bash
sudo tail -f /var/log/mail.log
```

Se etter `status=sent` for å bekrefte suksess.

#### Konfigurer enheten din {#configure-your-device-1}

I kamera- eller enhetsinnstillingene dine:
* **SMTP-server:** Din Pi sin IP-adresse (f.eks. `192.168.1.100`)
* **SMTP-port:** `25`
* **Autentisering:** Ingen
* **Kryptering:** Ingen (kun lokalt nettverk)


## Feilsøking {#troubleshooting}

Hvis problemer oppstår, sjekk disse loggfilene:

**FTP-server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Filovervåker:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Vis mail-kø
```


## Avslutning {#wrapping-up}

Raspberry Pi er nå et komplett automatisert system med sikre filopplastinger, automatiske e-postvarsler med vedlegg, og SMTP-relay-funksjoner for eldre enheter. Enten du bruker Forward Email sine eldre TLS-porter eller en lokal Postfix-relay, kan eldre enheter nå sende e-poster pålitelig gjennom moderne e-postleverandører.
