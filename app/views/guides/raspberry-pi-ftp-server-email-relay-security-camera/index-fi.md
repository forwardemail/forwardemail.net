# Muuta Raspberry Pi turvalliseksi FTP-palvelimeksi sähköpostin välityksellä {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Onko sinulla Raspberry Pi pölyttymässä? Olipa kyseessä uusin Pi 5, Pi 4, Pi Zero tai jopa vanhempi malli, tämä opas näyttää, miten siitä tehdään tehokas, automatisoitu tiedostopalvelin sähköpostin välitysominaisuuksilla. Täydellinen valvontakameroille, IoT-laitteille ja muille.

**Yhteensopiva:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W ja Raspberry Pi Zero.

> \[!NOTE]
> Tämä opas testattiin ja varmistettiin Raspberry Pi 3 Model B:llä, jossa on Ubuntu Server 22.04 LTS.


## Sisällysluettelo {#table-of-contents}

* [Mitä rakennamme](#what-were-building)
* [Osa 1: Ubuntu Serverin asentaminen Pi:lle](#part-1-getting-ubuntu-server-on-your-pi)
  * [Mitä tarvitset](#what-youll-need)
  * [Käyttöjärjestelmän kirjoittaminen](#flashing-the-os)
  * [Käynnistys ja yhteyden muodostus](#booting-up--connecting)
* [Osa 2: Turvallisen FTP-palvelimen asentaminen](#part-2-setting-up-a-secure-ftp-server)
  * [Asennus ja konfigurointi](#installation--configuration)
  * [FTP-käyttäjän luominen](#creating-an-ftp-user)
* [Osa 3: Palomuuri ja brute-force-suojaus](#part-3-firewall-and-brute-force-protection)
  * [UFW:n asennus](#setting-up-ufw)
  * [Fail2banin asennus](#setting-up-fail2ban)
* [Osa 4: Automaattinen tiedostojen käsittely sähköpostihälytyksillä](#part-4-automated-file-processing-with-email-notifications)
  * [Vaihtoehto 1: Forward Email API:n käyttö (suositeltu)](#option-1-using-forward-email-api-recommended)
  * [Vaihtoehto 2: Muiden sähköpostipalveluntarjoajien käyttö](#option-2-using-other-email-providers)
  * [Systemd-palvelun luominen](#create-a-systemd-service)
* [Osa 5: Sähköpostivaihtoehdot vanhemmille laitteille](#part-5-email-options-for-legacy-devices)
  * [Vaihtoehto 1: Forward Emailin vanhat TLS 1.0 -portit (suositeltu)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Vaihtoehto 2: Postfix SMTP -välityspalvelimen asennus](#option-2-set-up-a-postfix-smtp-relay)
* [Vianetsintä](#troubleshooting)
* [Yhteenveto](#wrapping-up)


## Mitä rakennamme {#what-were-building}

Tämä opas ohjaa sinut läpi täydellisen järjestelmän asennuksen, joka sisältää:

* **Ubuntu Server 22.04 LTS:** Vakaa, kevyt käyttöjärjestelmä Pi:lle.
* **Turvallinen FTP-palvelin (vsftpd):** Tiedostojen turvalliseen siirtoon.
* **Palomuuri (UFW) & Fail2ban:** Pidä pahikset ulkona.
* **Automaattinen tiedostojen käsittelijä:** Skripti, joka noutaa uudet tiedostot, lähettää ne sähköpostin liitteinä ja siivoaa peräänsä.
* **Sähköpostivaihtoehdot vanhemmille laitteille:** Kaksi tapaa laitteille, jotka eivät tue nykyaikaista TLS:ää:
  * Käytä Forward Emailin vanhoja TLS 1.0 -portteja (helpoin)
  * Asenna Postfix SMTP -välityspalvelin (toimii minkä tahansa sähköpostipalveluntarjoajan kanssa)

Valmiina? Aloitetaan.


## Osa 1: Ubuntu Serverin asentaminen Pi:lle {#part-1-getting-ubuntu-server-on-your-pi}

Ensimmäiseksi asenna Ubuntu Server Raspberry Pi:lle. Tämä on yllättävän helppoa Raspberry Pi Imagerin ansiosta.

### Mitä tarvitset {#what-youll-need}

* Mikä tahansa yhteensopiva Raspberry Pi (katso yllä oleva lista)
* microSD-kortti (vähintään 8GB, suositus 16GB+)
* Tietokone, jossa on microSD-kortinlukija
* Sopiva virtalähde Pi-mallillesi
* Internet-yhteys (Ethernet tai Wi-Fi)

> \[!NOTE]
> Vanhemmat mallit kuten Raspberry Pi 2 tai Pi Zero voivat olla hitaampia, mutta toimivat hyvin tässä asennuksessa.

### Käyttöjärjestelmän kirjoittaminen {#flashing-the-os}

1. **Hanki Raspberry Pi Imager:** Lataa se [viralliselta sivustolta](https://www.raspberrypi.com/software/).

2. **Valitse käyttöjärjestelmä:** Imagerissa valitse "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * 64-bittisille malleille (Pi 3, 4, 5, Zero 2 W) valitse **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Vanhemmille 32-bittisille malleille (Pi 2, Pi Zero, Pi Zero W) valitse **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Valitse tallennusväline:** Valitse microSD-korttisi.

> \[!WARNING]
> Tämä tyhjentää microSD-korttisi. Varmista, että olet varmuuskopioinut tärkeät tiedot.

4. **Lisäasetukset ovat ystäväsi:** Klikkaa rataskuvaketta (⚙️) asettaaksesi Pi:n headless-tilaan (näyttöä tai näppäimistöä ei tarvita).
   * **Isäntänimi:** Anna Pi:lle nimi (esim. `pi-server`).
   * **SSH:** Ota käyttöön ja aseta käyttäjänimi ja salasana.
   * **Wi-Fi:** Jos et käytä Ethernetiä, syötä Wi-Fi-tiedot.
   * **Alueasetukset:** Aseta aikavyöhyke ja näppäimistöasettelu.
5. **Kirjoita!** Klikkaa "WRITE"-painiketta ja anna imagerin hoitaa hommansa.

### Käynnistys ja yhdistäminen {#booting-up--connecting}

Kun imager on valmis, laita microSD-kortti Pi:hin ja kytke se päälle. Anna sen käynnistyä muutama minuutti. Se tekee taustalla alkuasetuksia. Etsi sen IP-osoite reitittimesi hallintasivulta ja yhdistä sitten SSH:lla:

```bash
ssh your_username@your_pi_ip_address
```

Olet sisällä! Raspberry Pi on nyt valmis konfiguroitavaksi.


## Osa 2: Turvallisen FTP-palvelimen asentaminen {#part-2-setting-up-a-secure-ftp-server}

Seuraavaksi asenna `vsftpd` (Very Secure FTP Daemon), konfiguroituna maksimaalista turvallisuutta varten.

### Asennus ja konfigurointi {#installation--configuration}

1. **Asenna vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Varmuuskopioi konfiguraatiotiedosto:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Muokkaa konfiguraatiota:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Jos rivi on kommentoitu (alkaa `#`-merkillä), poista `#` ottaaksesi sen käyttöön.

Tee nämä muutokset:

| Asetus                   | Arvo  | Tarkoitus                                                |
| ------------------------ | ----- | -------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Poista anonyymi FTP-käyttö käytöstä                      |
| `local_enable`           | `YES` | Salli paikallisten käyttäjien kirjautuminen              |
| `write_enable`           | `YES` | Salli tiedostojen lataaminen                              |
| `local_umask`            | `022` | Aseta tiedostojen oikeudet (644 tiedostoille, 755 kansioille) |
| `chroot_local_user`      | `YES` | Rajoita käyttäjät kotihakemistoonsa                       |
| `allow_writeable_chroot` | `YES` | Salli lataukset chroot-ympäristössä                       |

4. **Lisää passiivinen porttialue:** Lisää nämä rivit tiedoston loppuun. Tämä tarvitaan palomuuria varten.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Ota lokitus käyttöön:** Lisää nämä rivit Fail2ban-lokitusta varten.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Tallenna ja käynnistä uudelleen:** Paina `Ctrl+O`, `Enter`, `Ctrl+X`, ja käynnistä palvelu uudelleen:

   ```bash
   sudo systemctl restart vsftpd
   ```

### FTP-käyttäjän luominen {#creating-an-ftp-user}

Luo oma rajoitettu käyttäjä FTP-käyttöä varten.

1. **Luo käyttäjä:**

   ```bash
   sudo adduser ftpuser
   ```

   Seuraa ohjeita ja aseta salasana. Muut kentät (nimi, puhelin jne.) voi jättää tyhjiksi.

2. **Luo hakemistorakenne:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Pää-FTP-hakemisto
   * `/home/ftpuser/ftp/uploads` - Hakemisto tiedostojen lataamista varten

3. **Aseta oikeudet:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Osa 3: Palomuuri ja brute-force-suojaus {#part-3-firewall-and-brute-force-protection}

Suojaa Pi UFW:llä (Uncomplicated Firewall) ja Fail2banilla.

### UFW:n asentaminen {#setting-up-ufw}

1. **Asenna UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Aseta oletuskäytännöt:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Salli SSH (välttämätön!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Salli aina SSH ennen palomuurin käyttöönottoa, muuten lukitset itsesi ulos!

4. **Salli FTP-portit:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Ota palomuuri käyttöön:**

   ```bash
   sudo ufw enable
   ```

### Fail2banin asentaminen {#setting-up-fail2ban}

Fail2ban estää automaattisesti IP-osoitteita toistuvien epäonnistuneiden kirjautumisyritysten jälkeen.

1. **Asenna Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Luo paikallinen konfiguraatio:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Lisää nämä asetukset:**
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

Tee se suoritettavaksi:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Luo Systemd-palvelu {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Lisää tämä sisältö:

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

Ota palvelu käyttöön ja käynnistä se:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Tarkista tila:

```bash
sudo systemctl status ftp-monitor.service
```


## Osa 5: Sähköpostivaihtoehdot vanhoille laitteille {#part-5-email-options-for-legacy-devices}

Laitteet kuten FOSSCAM-kamerat eivät usein tue moderneja TLS-versioita. On kaksi ratkaisua:

### Vaihtoehto 1: Käytä Forward Emailin Legacy TLS 1.0 -portteja (Suositeltu) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Jos käytät Forward Emailia, tämä on helpoin ratkaisu. Forward Email tarjoaa omistetut legacy TLS 1.0 -portit erityisesti vanhemmille laitteille kuten kameroille, tulostimille, skannereille ja fakseille.

#### Hinnoittelu {#pricing}

Forward Email tarjoaa useita suunnitelmia:

| Suunnitelma             | Hinta        | Ominaisuudet                          |
| ----------------------- | ------------ | ------------------------------------ |
| Ilmainen                | 0 $/kuukausi | Vain sähköpostin edelleenlähetys (ei lähettämistä) |
| **Parannettu suojaus**  | **3 $/kuukausi** | **SMTP-yhteys + legacy TLS 1.0 -portit** |
| Tiimi                   | 9 $/kuukausi | Parannettu + tiimitoiminnot          |
| Yritys                  | 250 $/kuukausi | Tiimi + rajattomat API-kutsut        |

> \[!IMPORTANT]
> **Parannettu suojaus -suunnitelma (3 $/kuukausi)** tai sitä korkeampi vaaditaan SMTP-yhteyteen ja legacy TLS 1.0 -porttien tukeen.

Lisätietoja osoitteessa [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Luo salasana {#generate-your-password}

Ennen laitteen konfigurointia, luo salasana Forward Emailissa:

1. Kirjaudu sisään osoitteessa [Forward Email](https://forwardemail.net)
2. Siirry kohtaan **Oma tili → Domainit → \[Sinun domainisi] → Aliakset**
3. Luo tai valitse alias (esim. `camera@yourdomain.com`)
4. Klikkaa **"Generate Password"** aliaksen vieressä
5. Kopioi luotu salasana – tätä käytät SMTP-todennukseen

> \[!TIP]
> Jokaisella aliaksella voi olla oma salasana. Tämä on hyödyllistä, kun haluat seurata, mikä laite lähetti minkäkin sähköpostin.

#### Konfiguroi laitteesi {#configure-your-device}

Käytä näitä asetuksia kamerassasi, tulostimessasi, skannerissasi tai muussa vanhassa laitteessa:

| Asetus          | Arvo                                             |
| --------------- | ------------------------------------------------ |
| SMTP-palvelin   | `smtp.forwardemail.net`                          |
| Portti (SSL/TLS)| `2455`                                           |
| Portti (STARTTLS)| `2555` (vaihtoehtoinen)                         |
| Käyttäjätunnus  | Aliaksesi sähköpostiosoite (esim. `camera@yourdomain.com`) |
| Salasana        | "Generate Password" -kohdassa luotu salasana    |
| Todennus        | Pakollinen                                       |
| Salaus          | SSL/TLS (suositeltu) tai STARTTLS                |

> \[!WARNING]
> Nämä portit käyttävät vanhentunutta TLS 1.0 -protokollaa, jolla on tunnettuja tietoturva-aukkoja (BEAST, POODLE). Käytä vain, jos laitteesi ei tue moderneja TLS 1.2+ -versioita.

Konfiguroi laitteesi näillä asetuksilla, niin se lähettää sähköpostit suoraan Forward Emailin kautta ilman paikallista välipalvelinta.

Lisätietoja löytyy [Forward Emailin UKK:sta Legacy TLS -tuesta](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Vaihtoehto 2: Perusta Postfix SMTP -välipalvelin {#option-2-set-up-a-postfix-smtp-relay}

Jos et käytä Forward Emailia tai haluat paikallisen välipalveluratkaisun, asenna Postfix Raspberry Pi:hin toimimaan välittäjänä. Tämä toimii minkä tahansa sähköpostipalveluntarjoajan kanssa (Gmail, Outlook, Yahoo, AOL jne.).

#### Asenna Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Asennuksen aikana:

* Valitse **"Internet Site"**
* Syötä Pi:n isäntänimi (esim. `raspberrypi-ftp`) kohtaan "System mail name"

#### Valitse Sähköpostipalveluntarjoajasi {#choose-your-email-provider}

| Palveluntarjoaja | SMTP-palvelin          | Portti | Sovellussalasana vaaditaan? |
| ---------------- | ---------------------- | ------ | --------------------------- |
| Gmail            | smtp.gmail.com         | 587    | Kyllä                      |
| Outlook          | smtp-mail.outlook.com  | 587    | Kyllä                      |
| Yahoo            | smtp.mail.yahoo.com    | 465    | Kyllä                      |
| AOL              | smtp.aol.com           | 587    | Kyllä                      |

#### Hanki Sovellussalasana {#get-an-app-specific-password}

Useimmat palveluntarjoajat vaativat sovellussalasanoja kolmannen osapuolen sovelluksille. Luo sellainen sähköpostipalveluntarjoajasi suojausasetuksista:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Älä koskaan käytä tavallista sähköpostisalasanasi. Käytä aina sovellussalasanaa.

#### Määritä SASL-todennus {#configure-sasl-authentication}

Luo salasana tiedosto valitsemallesi palveluntarjoajalle. Tässä esimerkissä käytetään Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Lisää tämä rivi (säädä palvelin ja portti palveluntarjoajasi mukaan):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Gmailille käytä:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Suojaa ja hajauta tiedosto:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Määritä Sähköpostiosoitteiden Uudelleenkirjoitus {#configure-email-address-mapping}

Uudelleenkirjoita paikalliset sähköpostiosoitteet vastaamaan sähköpostipalveluntarjoajaasi:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Lisää tämä rivi (korvaa `HOSTNAME` Pi:n isäntänimelläsi ja käytä omaa sähköpostiasi):

```
/.+@HOSTNAME/    your_email@provider.com
```

Esimerkki:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Suojaa tiedosto:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Määritä Postfixin Pääasetukset {#configure-postfix-main-settings}

Muokkaa pääkonfiguraatiota:

```bash
sudo nano /etc/postfix/main.cf
```

Etsi ja päivitä relay host (tai lisää tiedoston loppuun):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Lisää nämä asetukset tiedoston loppuun:

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
> Gmailille (portti 587) aseta `smtp_tls_wrappermode = no` `yes` sijaan.

> \[!WARNING]
> Päivitä `mynetworks` todellisella verkkoalueellasi. Lisää vain luotetut verkot – kaikki näissä verkoissa olevat laitteet voivat välittää sähköpostia ilman todennusta.

**Yleisiä verkkoalueita:**

| Verkkoväli       | IP-osoitealue              |
| ---------------- | -------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Päivitä Palomuuri ja Käynnistä Uudelleen {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Varmista, että Postfix on käynnissä:

```bash
sudo systemctl status postfix
```

#### Testaa Välitys {#test-the-relay}

Lähetä testisähköposti:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Tarkista lokit:

```bash
sudo tail -f /var/log/mail.log
```

Etsi `status=sent` vahvistukseksi onnistumisesta.

#### Määritä Laitteesi {#configure-your-device-1}

Kamerasi tai laitteen asetuksissa:
* **SMTP-palvelin:** Pi:n IP-osoite (esim. `192.168.1.100`)
* **SMTP-portti:** `25`
* **Todennus:** Ei
* **Salaus:** Ei (vain paikallisverkossa)


## Vianmääritys {#troubleshooting}

Jos ongelmia ilmenee, tarkista nämä lokitiedostot:

**FTP-palvelin:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Tiedostovalvonta:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix-sähköposti:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Näytä postijono
```


## Yhteenveto {#wrapping-up}

Raspberry Pi on nyt täydellinen automatisoitu järjestelmä, jossa on turvalliset tiedostojen lataukset, automaattiset sähköposti-ilmoitukset liitteineen sekä SMTP-välitysominaisuudet vanhemmille laitteille. Käytitpä sitten Forward Emailin vanhoja TLS-portteja tai paikallista Postfix-välitystä, vanhemmat laitteet voivat nyt lähettää sähköposteja luotettavasti nykyaikaisten sähköpostipalveluntarjoajien kautta.
