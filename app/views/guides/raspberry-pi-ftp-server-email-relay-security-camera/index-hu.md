# Alakítsd Raspberry Pi-d biztonságos FTP szerverré email továbbítással {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Porosodik egy Raspberry Pi-d? Legyen az legújabb Pi 5, Pi 4, Pi Zero vagy akár egy régebbi modell, ez az útmutató megmutatja, hogyan alakíthatod át egy erőteljes, automatizált fájlszerverré email továbbítási képességekkel. Tökéletes biztonsági kamerákhoz, IoT eszközökhöz és még sok máshoz.

**Kompatibilis:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W és Raspberry Pi Zero.

> \[!NOTE]
> Ezt az útmutatót egy Raspberry Pi 3 Model B-n teszteltük és igazoltuk Ubuntu Server 22.04 LTS futtatásával.


## Tartalomjegyzék {#table-of-contents}

* [Mit építünk](#what-were-building)
* [1. rész: Ubuntu Server telepítése a Pi-dre](#part-1-getting-ubuntu-server-on-your-pi)
  * [Amire szükséged lesz](#what-youll-need)
  * [Az operációs rendszer telepítése](#flashing-the-os)
  * [Indítás és csatlakozás](#booting-up--connecting)
* [2. rész: Biztonságos FTP szerver beállítása](#part-2-setting-up-a-secure-ftp-server)
  * [Telepítés és konfiguráció](#installation--configuration)
  * [FTP felhasználó létrehozása](#creating-an-ftp-user)
* [3. rész: Tűzfal és brute-force védelem](#part-3-firewall-and-brute-force-protection)
  * [UFW beállítása](#setting-up-ufw)
  * [Fail2ban beállítása](#setting-up-fail2ban)
* [4. rész: Automatizált fájlkezelés email értesítéssel](#part-4-automated-file-processing-with-email-notifications)
  * [1. opció: Forward Email API használata (ajánlott)](#option-1-using-forward-email-api-recommended)
  * [2. opció: Más email szolgáltatók használata](#option-2-using-other-email-providers)
  * [Systemd szolgáltatás létrehozása](#create-a-systemd-service)
* [5. rész: Email opciók régebbi eszközökhöz](#part-5-email-options-for-legacy-devices)
  * [1. opció: Forward Email régi TLS 1.0 portok használata (ajánlott)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [2. opció: Postfix SMTP relay beállítása](#option-2-set-up-a-postfix-smtp-relay)
* [Hibaelhárítás](#troubleshooting)
* [Összefoglalás](#wrapping-up)


## Mit építünk {#what-were-building}

Ez az útmutató végigvezet egy teljes rendszer beállításán, amely tartalmazza:

* **Ubuntu Server 22.04 LTS:** Egy szilárd, könnyű operációs rendszer a Pi-hez.
* **Biztonságos FTP szerver (vsftpd):** Biztonságos fájlátvitelhez.
* **Tűzfal (UFW) és Fail2ban:** Hogy távol tartsuk a rosszindulatúkat.
* **Automatizált fájlkezelő:** Egy script, amely új fájlokat fogad, email mellékletként elküldi, majd takarít maga után.
* **Email opciók régebbi eszközökhöz:** Két megoldás olyan eszközöknek, amelyek nem támogatják a modern TLS-t:
  * Forward Email régi TLS 1.0 portjainak használata (legkönnyebb)
  * Postfix SMTP relay beállítása (bármely email szolgáltatóval működik)

Készen állsz? Vágjunk bele.


## 1. rész: Ubuntu Server telepítése a Pi-dre {#part-1-getting-ubuntu-server-on-your-pi}

Először is, futtasd az Ubuntu Servert a Raspberry Pi-n. Ez meglepően egyszerű a Raspberry Pi Imager segítségével.

### Amire szükséged lesz {#what-youll-need}

* Bármely kompatibilis Raspberry Pi (lásd fent)
* Egy microSD kártya (minimum 8GB, ajánlott 16GB+)
* Egy számítógép microSD kártya olvasóval
* Megfelelő tápegység a Pi modellhez
* Internetkapcsolat (Ethernet vagy Wi-Fi)

> \[!NOTE]
> Régebbi modellek, mint a Raspberry Pi 2 vagy Pi Zero lassabbak lehetnek, de ez a beállítás jól működik velük is.

### Az operációs rendszer telepítése {#flashing-the-os}

1. **Szerezd be a Raspberry Pi Imager-t:** Töltsd le a [hivatalos weboldalról](https://www.raspberrypi.com/software/).

2. **Válaszd ki az operációs rendszert:** Az imagerben válaszd a "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu" menüpontot.
   * 64-bites modellekhez (Pi 3, 4, 5, Zero 2 W) válaszd a **"Ubuntu Server 22.04.1 LTS (64-bit)"** verziót.
   * Régebbi 32-bites modellekhez (Pi 2, Pi Zero, Pi Zero W) válaszd a **"Ubuntu Server 22.04.1 LTS (32-bit)"** verziót.

3. **Válaszd ki a tárolót:** Válaszd ki a microSD kártyádat.

> \[!WARNING]
> Ez törölni fogja a microSD kártyád tartalmát. Győződj meg róla, hogy minden fontos adatot lementettél.

4. **Haladó beállítások a barátod:** Kattints a fogaskerék ikonra (⚙️), hogy beállítsd a Pi-t headless módra (monitor és billentyűzet nélkül).
   * **Hostname:** Adj nevet a Pi-dnek (pl. `pi-server`).
   * **SSH:** Engedélyezd, és állíts be felhasználónevet és jelszót.
   * **Wi-Fi:** Ha nem Ethernetet használsz, add meg a Wi-Fi adataidat.
   * **Locale:** Állítsd be az időzónát és a billentyűzetkiosztást.
5. **Írj!** Kattints a "WRITE" gombra, és hagyd, hogy az imager elvégezze a dolgát.

### Indítás és csatlakozás {#booting-up--connecting}

Miután az imager befejezte, helyezd be a microSD kártyát a Pi-be, és csatlakoztasd. Adj neki néhány percet az indításhoz. Háttérben némi kezdeti beállítást végez. Keresd meg az IP-címét a router admin oldalán, majd csatlakozz SSH-n keresztül:

```bash
ssh your_username@your_pi_ip_address
```

Bent vagy! A Raspberry Pi most már készen áll a konfigurálásra.


## 2. rész: Biztonságos FTP szerver beállítása {#part-2-setting-up-a-secure-ftp-server}

Ezután állítsd be a `vsftpd`-t (Very Secure FTP Daemon), maximális biztonságra konfigurálva.

### Telepítés és konfiguráció {#installation--configuration}

1. **Telepítsd a vsftpd-t:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Készíts biztonsági másolatot a konfigurációs fájlról:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Szerkeszd a konfigurációt:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Ha egy sor ki van kommentelve (a `#` jellel kezdődik), távolítsd el a `#`-t a sor elejéről.

Végezd el ezeket a módosításokat:

| Beállítás                | Érték | Cél                                                       |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Anonim FTP hozzáférés letiltása                            |
| `local_enable`           | `YES` | Helyi felhasználók bejelentkezésének engedélyezése        |
| `write_enable`           | `YES` | Fájl feltöltések engedélyezése                             |
| `local_umask`            | `022` | Fájl jogosultságok beállítása (644 fájloknak, 755 könyvtáraknak) |
| `chroot_local_user`      | `YES` | Felhasználók korlátozása a saját home könyvtárukra        |
| `allow_writeable_chroot` | `YES` | Feltöltések engedélyezése a chroot jail-ben                |

4. **Passzív port tartomány hozzáadása:** Add hozzá ezeket a sorokat a fájl végéhez. Ez szükséges a tűzfalhoz.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Naplózás engedélyezése:** Add hozzá ezeket a sorokat a Fail2ban naplózásának engedélyezéséhez.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Mentés és újraindítás:** Nyomd meg a `Ctrl+O`, `Enter`, `Ctrl+X` billentyűket, majd indítsd újra a szolgáltatást:

   ```bash
   sudo systemctl restart vsftpd
   ```

### FTP felhasználó létrehozása {#creating-an-ftp-user}

Hozz létre egy dedikált, korlátozott felhasználót az FTP hozzáféréshez.

1. **Felhasználó létrehozása:**

   ```bash
   sudo adduser ftpuser
   ```

   Kövesd az utasításokat a jelszó beállításához. A többi mezőt (név, telefon, stb.) hagyhatod üresen.

2. **Könyvtárstruktúra létrehozása:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Fő FTP könyvtár
   * `/home/ftpuser/ftp/uploads` - Ide kerülnek a feltöltött fájlok

3. **Jogosultságok beállítása:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## 3. rész: Tűzfal és brute-force védelem {#part-3-firewall-and-brute-force-protection}

Biztosítsd a Pi-t UFW-vel (Egyszerűsített tűzfal) és Fail2ban-nel.

### UFW beállítása {#setting-up-ufw}

1. **Telepítsd az UFW-t:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Állítsd be az alapértelmezett szabályokat:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Engedélyezd az SSH-t (kritikus!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Mindig engedélyezd az SSH-t a tűzfal bekapcsolása előtt, különben kizárod magad!

4. **Engedélyezd az FTP portokat:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Kapcsold be a tűzfalat:**

   ```bash
   sudo ufw enable
   ```

### Fail2ban beállítása {#setting-up-fail2ban}

A Fail2ban automatikusan blokkolja az IP-címeket ismételt sikertelen bejelentkezési kísérletek után.

1. **Telepítsd a Fail2ban-t:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Hozz létre egy helyi konfigurációt:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Add hozzá ezeket a konfigurációkat:**
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

Tedd futtathatóvá:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Hozz létre egy Systemd szolgáltatást {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Add hozzá ezt a tartalmat:

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

Engedélyezd és indítsd el a szolgáltatást:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Ellenőrizd az állapotot:

```bash
sudo systemctl status ftp-monitor.service
```


## 5. rész: E-mail beállítások régi eszközökhöz {#part-5-email-options-for-legacy-devices}

Az olyan eszközök, mint a FOSSCAM kamerák gyakran nem támogatják a modern TLS verziókat. Két megoldás létezik:

### 1. lehetőség: Használd a Forward Email régi TLS 1.0 portjait (ajánlott) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Ha Forward Emailt használsz, ez a legegyszerűbb megoldás. A Forward Email dedikált régi TLS 1.0 portokat biztosít kifejezetten régebbi eszközök, például kamerák, nyomtatók, szkennerek és faxgépek számára.

#### Árazás {#pricing}

A Forward Email több csomagot kínál:

| Csomag                  | Ár           | Jellemzők                              |
| ----------------------- | ------------ | ------------------------------------ |
| Ingyenes                | $0/hó        | Csak e-mail továbbítás (küldés nélkül) |
| **Fokozott védelem**    | **$3/hó**    | **SMTP hozzáférés + régi TLS 1.0 portok** |
| Csapat                  | $9/hó        | Fokozott + csapat funkciók            |
| Vállalati               | $250/hó      | Csapat + korlátlan API kérések        |

> \[!IMPORTANT]
> Az **Fokozott védelem csomag ($3/hó)** vagy magasabb szükséges az SMTP hozzáféréshez és a régi TLS 1.0 port támogatásához.

További információk: [Forward Email Árazás](https://forwardemail.net/en/pricing).

#### Jelszó generálása {#generate-your-password}

A készülék konfigurálása előtt generálj jelszót a Forward Emailben:

1. Jelentkezz be a [Forward Email](https://forwardemail.net) oldalra
2. Navigálj a **Saját fiók → Domain-ek → \[A te domain-ed] → Álnév** menüpontra
3. Hozz létre vagy válassz ki egy álnevet (pl. `camera@yourdomain.com`)
4. Kattints az **"Jelszó generálása"** gombra az álnév mellett
5. Másold ki a generált jelszót – ezt fogod használni az SMTP hitelesítéshez

> \[!TIP]
> Minden álnévhez külön jelszó rendelhető. Ez hasznos, hogy nyomon tudd követni, melyik eszköz melyik e-mailt küldte.

#### A készülék konfigurálása {#configure-your-device}

Használd ezeket a beállításokat a kamerádban, nyomtatódban, szkenneredben vagy más régi eszközödben:

| Beállítás       | Érték                                            |
| --------------- | ------------------------------------------------ |
| SMTP szerver    | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (alternatív)                              |
| Felhasználónév  | Az álneved e-mail címe (pl. `camera@yourdomain.com`) |
| Jelszó          | A "Jelszó generálása" által létrehozott jelszó   |
| Hitelesítés     | Kötelező                                         |
| Titkosítás      | SSL/TLS (ajánlott) vagy STARTTLS                  |

> \[!WARNING]
> Ezek a portok az elavult TLS 1.0 protokollt használják, amely ismert biztonsági sebezhetőségekkel rendelkezik (BEAST, POODLE). Csak akkor használd, ha az eszközöd nem támogatja a modern TLS 1.2+-t.

Egyszerűen konfiguráld az eszközöd ezekkel a beállításokkal, és az e-maileket közvetlenül a Forward Emailen keresztül küldi majd, helyi relay szerver nélkül.

További részletekért lásd a [Forward Email GYIK a régi TLS támogatásról](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### 2. lehetőség: Postfix SMTP relay beállítása {#option-2-set-up-a-postfix-smtp-relay}

Ha nem használod a Forward Emailt, vagy helyi relay megoldást szeretnél, állítsd be a Postfixet a Raspberry Pi-n, hogy közvetítőként működjön. Ez bármely e-mail szolgáltatóval működik (Gmail, Outlook, Yahoo, AOL stb.).

#### Postfix telepítése {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Telepítés közben:

* Válassza a **"Internet Site"** lehetőséget
* Adja meg a Pi hosztnevét (pl. `raspberrypi-ftp`) a "System mail name" mezőbe

#### Válassza ki az e-mail szolgáltatóját {#choose-your-email-provider}

| Szolgáltató | SMTP szerver          | Port | Szükséges alkalmazásjelszó? |
| ----------- | --------------------- | ---- | --------------------------- |
| Gmail       | smtp.gmail.com        | 587  | Igen                        |
| Outlook     | smtp-mail.outlook.com | 587  | Igen                        |
| Yahoo       | smtp.mail.yahoo.com   | 465  | Igen                        |
| AOL         | smtp.aol.com          | 587  | Igen                        |

#### Szerezzen alkalmazás-specifikus jelszót {#get-an-app-specific-password}

A legtöbb szolgáltató alkalmazásjelszót kér harmadik féltől származó alkalmazásokhoz. Generáljon egyet az e-mail szolgáltatója biztonsági beállításaiban:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Soha ne használja a szokásos e-mail jelszavát. Mindig alkalmazás-specifikus jelszót használjon.

#### SASL hitelesítés beállítása {#configure-sasl-authentication}

Hozza létre a jelszófájlt a választott szolgáltatóhoz. Ez a példa a Yahoo-t használja:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Adja hozzá ezt a sort (állítsa be a szervert és portot a szolgáltatója szerint):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Gmail esetén használja:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Biztosítsa és titkosítsa a fájlt:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### E-mail cím leképezés beállítása {#configure-email-address-mapping}

Írja át a helyi e-mail címeket, hogy megfeleljenek az e-mail szolgáltatójának:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Adja hozzá ezt a sort (cserélje le a `HOSTNAME`-et a Pi hosztnevére, és használja a saját e-mail címét):

```
/.+@HOSTNAME/    your_email@provider.com
```

Példa:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Biztosítsa a fájlt:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Postfix fő beállításainak konfigurálása {#configure-postfix-main-settings}

Szerkessze a fő konfigurációt:

```bash
sudo nano /etc/postfix/main.cf
```

Keresse meg és frissítse a relay hostot (vagy adja hozzá a végén):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Adja hozzá ezeket a beállításokat a fájl végéhez:

```
# SMTP Relay konfiguráció
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Hálózati beállítások
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Gmail esetén (587-es port) állítsa a `smtp_tls_wrappermode = no` értékre a `yes` helyett.

> \[!WARNING]
> Frissítse a `mynetworks` értékét a tényleges hálózati tartományával. Csak megbízható hálózatokat adjon hozzá – ezekről a hálózatokról bármely eszköz hitelesítés nélkül képes levelet továbbítani.

**Gyakori hálózati tartományok:**

| Hálózati tartomány | IP cím tartomány           |
| ------------------ | -------------------------- |
| `192.168.0.0/24`   | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24`   | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`       | 10.0.0.0 - 10.255.255.255   |

#### Tűzfal frissítése és újraindítás {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Ellenőrizze, hogy a Postfix fut-e:

```bash
sudo systemctl status postfix
```

#### Tesztelje a relay-t {#test-the-relay}

Küldjön teszt e-mailt:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Ellenőrizze a naplókat:

```bash
sudo tail -f /var/log/mail.log
```

Keresse a `status=sent` bejegyzést a siker megerősítéséhez.

#### Eszköz konfigurálása {#configure-your-device-1}

A kamerája vagy eszköze beállításaiban:
* **SMTP szerver:** A Pi IP-címe (pl. `192.168.1.100`)
* **SMTP port:** `25`
* **Hitelesítés:** Nincs
* **Titkosítás:** Nincs (csak helyi hálózat)


## Hibakeresés {#troubleshooting}

Ha problémák merülnek fel, ellenőrizze ezeket a naplófájlokat:

**FTP szerver:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Fájlfigyelő:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix levél:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Levél sor megtekintése
```


## Befejezés {#wrapping-up}

A Raspberry Pi most már egy teljesen automatizált rendszer biztonságos fájlfeltöltéssel, automatikus e-mail értesítésekkel mellékletekkel, és SMTP átjátszó képességekkel régebbi eszközök számára. Akár a Forward Email régi TLS portjait, akár egy helyi Postfix átjátszót használ, a régebbi eszközök most már megbízhatóan küldhetnek e-maileket modern e-mail szolgáltatókon keresztül.
