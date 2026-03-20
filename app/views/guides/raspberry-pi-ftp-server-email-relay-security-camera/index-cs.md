# Přeměňte svůj Raspberry Pi na zabezpečený FTP server s přeposíláním e-mailů {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Máte Raspberry Pi, které jen sbírá prach? Ať už je to nejnovější Pi 5, Pi 4, Pi Zero nebo i starší model, tento průvodce vám ukáže, jak z něj udělat výkonný, automatizovaný souborový server s možností přeposílání e-mailů. Ideální pro bezpečnostní kamery, IoT zařízení a další.

**Kompatibilní s:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W a Raspberry Pi Zero.

> \[!NOTE]
> Tento průvodce byl testován a ověřen na Raspberry Pi 3 Model B s Ubuntu Server 22.04 LTS.


## Obsah {#table-of-contents}

* [Co budujeme](#what-were-building)
* [Část 1: Instalace Ubuntu Server na váš Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Co budete potřebovat](#what-youll-need)
  * [Nahrání OS](#flashing-the-os)
  * [Spuštění a připojení](#booting-up--connecting)
* [Část 2: Nastavení zabezpečeného FTP serveru](#part-2-setting-up-a-secure-ftp-server)
  * [Instalace a konfigurace](#installation--configuration)
  * [Vytvoření FTP uživatele](#creating-an-ftp-user)
* [Část 3: Firewall a ochrana proti hrubé síle](#part-3-firewall-and-brute-force-protection)
  * [Nastavení UFW](#setting-up-ufw)
  * [Nastavení Fail2ban](#setting-up-fail2ban)
* [Část 4: Automatizované zpracování souborů s e-mailovými upozorněními](#part-4-automated-file-processing-with-email-notifications)
  * [Možnost 1: Použití Forward Email API (doporučeno)](#option-1-using-forward-email-api-recommended)
  * [Možnost 2: Použití jiných poskytovatelů e-mailů](#option-2-using-other-email-providers)
  * [Vytvoření systemd služby](#create-a-systemd-service)
* [Část 5: E-mailové možnosti pro starší zařízení](#part-5-email-options-for-legacy-devices)
  * [Možnost 1: Použití legacy TLS 1.0 portů Forward Email (doporučeno)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Možnost 2: Nastavení Postfix SMTP relé](#option-2-set-up-a-postfix-smtp-relay)
* [Řešení problémů](#troubleshooting)
* [Závěr](#wrapping-up)


## Co budujeme {#what-were-building}

Tento průvodce vás provede nastavením kompletního systému, který zahrnuje:

* **Ubuntu Server 22.04 LTS:** Stabilní, lehký operační systém pro Pi.
* **Zabezpečený FTP server (vsftpd):** Pro bezpečné ukládání souborů.
* **Firewall (UFW) a Fail2ban:** Pro ochranu proti neoprávněnému přístupu.
* **Automatizovaný zpracovatel souborů:** Skript, který zachytí nové soubory, odešle je jako přílohy e-mailem a poté je smaže.
* **E-mailové možnosti pro starší zařízení:** Dva přístupy pro zařízení, která nepodporují moderní TLS:
  * Použití legacy TLS 1.0 portů Forward Email (nejjednodušší)
  * Nastavení Postfix SMTP relé (funguje s jakýmkoli poskytovatelem e-mailu)

Připraveni? Pojďme na to.


## Část 1: Instalace Ubuntu Server na váš Pi {#part-1-getting-ubuntu-server-on-your-pi}

Nejdříve si na Raspberry Pi nainstalujte Ubuntu Server. Díky Raspberry Pi Imageru je to překvapivě snadné.

### Co budete potřebovat {#what-youll-need}

* Jakýkoli kompatibilní Raspberry Pi (viz seznam výše)
* microSD kartu (minimálně 8GB, doporučeno 16GB a více)
* Počítač s čtečkou microSD karet
* Vhodný napájecí zdroj pro váš model Pi
* Připojení k internetu (Ethernet nebo Wi-Fi)

> \[!NOTE]
> Starší modely jako Raspberry Pi 2 nebo Pi Zero mohou být pomalejší, ale pro toto nastavení budou fungovat dobře.

### Nahrání OS {#flashing-the-os}

1. **Získejte Raspberry Pi Imager:** Stáhněte si ho z [oficiálních stránek](https://www.raspberrypi.com/software/).

2. **Vyberte OS:** V imageru zvolte "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Pro 64bitové modely (Pi 3, 4, 5, Zero 2 W) vyberte **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Pro starší 32bitové modely (Pi 2, Pi Zero, Pi Zero W) vyberte **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Vyberte úložiště:** Zvolte svou microSD kartu.

> \[!WARNING]
> Tímto se microSD karta kompletně vymaže. Ujistěte se, že máte zálohované všechny důležité soubory.

4. **Pokročilé možnosti jsou váš přítel:** Klikněte na ikonu ozubeného kola (⚙️) pro nastavení Pi do headless režimu (bez monitoru a klávesnice).
   * **Hostname:** Pojmenujte svůj Pi (např. `pi-server`).
   * **SSH:** Povolit a nastavit uživatelské jméno a heslo.
   * **Wi-Fi:** Pokud nepoužíváte Ethernet, zadejte údaje k Wi-Fi.
   * **Locale:** Nastavte časové pásmo a rozložení klávesnice.
5. **Pište!** Klikněte na tlačítko "WRITE" a nechte imager pracovat.

### Spuštění a připojení {#booting-up--connecting}

Jakmile imager dokončí, vložte microSD kartu do Pi a zapojte jej. Dejte mu pár minut na spuštění. Na pozadí probíhá počáteční nastavení. Najděte jeho IP adresu na stránce administrace vašeho routeru a připojte se přes SSH:

```bash
ssh your_username@your_pi_ip_address
```

Jste připojeni! Raspberry Pi je nyní připraveno k nastavení.


## Část 2: Nastavení zabezpečeného FTP serveru {#part-2-setting-up-a-secure-ftp-server}

Dále nastavte `vsftpd` (Very Secure FTP Daemon), nakonfigurovaný pro maximální bezpečnost.

### Instalace a konfigurace {#installation--configuration}

1. **Nainstalujte vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Zálohujte konfigurační soubor:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Upravte konfiguraci:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Pokud je řádek zakomentovaný (začíná `#`), odkomentujte jej odstraněním `#`.

Proveďte tyto změny:

| Nastavení                | Hodnota | Účel                                                      |
| ------------------------ | ------- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`    | Zakázat anonymní přístup k FTP                            |
| `local_enable`           | `YES`   | Povolit přihlášení místních uživatelů                     |
| `write_enable`           | `YES`   | Povolit nahrávání souborů                                 |
| `local_umask`            | `022`   | Nastavit oprávnění souborů (644 pro soubory, 755 pro složky) |
| `chroot_local_user`      | `YES`   | Uzamknout uživatele do jejich domovského adresáře        |
| `allow_writeable_chroot` | `YES`   | Povolit nahrávání v chroot jailu                          |

4. **Přidejte rozsah pasivních portů:** Přidejte tyto řádky na konec souboru. Je to potřeba pro firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Povolit logování:** Přidejte tyto řádky pro povolení logování pro Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Uložte a restartujte:** Stiskněte `Ctrl+O`, `Enter`, `Ctrl+X`, poté restartujte službu:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Vytvoření FTP uživatele {#creating-an-ftp-user}

Vytvořte dedikovaného, omezeného uživatele pro FTP přístup.

1. **Vytvořte uživatele:**

   ```bash
   sudo adduser ftpuser
   ```

   Postupujte podle pokynů pro nastavení hesla. Ostatní pole (jméno, telefon atd.) můžete nechat prázdná.

2. **Vytvořte adresářovou strukturu:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Hlavní FTP adresář
   * `/home/ftpuser/ftp/uploads` - Kam budou nahrávány soubory

3. **Nastavte oprávnění:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Část 3: Firewall a ochrana proti hrubé síle {#part-3-firewall-and-brute-force-protection}

Zabezpečte Pi pomocí UFW (Uncomplicated Firewall) a Fail2ban.

### Nastavení UFW {#setting-up-ufw}

1. **Nainstalujte UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Nastavte výchozí pravidla:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Povolte SSH (kritické!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Vždy povolte SSH před zapnutím firewallu, jinak se zablokujete!

4. **Povolte FTP porty:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Zapněte firewall:**

   ```bash
   sudo ufw enable
   ```

### Nastavení Fail2ban {#setting-up-fail2ban}

Fail2ban automaticky blokuje IP adresy po opakovaných neúspěšných pokusech o přihlášení.

1. **Nainstalujte Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Vytvořte lokální konfiguraci:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Přidejte tyto konfigurace:**
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

### Vytvoření služby Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Přidejte tento obsah:

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

Povolte a spusťte službu:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Zkontrolujte stav:

```bash
sudo systemctl status ftp-monitor.service
```


## Část 5: E-mailové možnosti pro starší zařízení {#part-5-email-options-for-legacy-devices}

Zařízení jako kamery FOSSCAM často nepodporují moderní verze TLS. Existují dvě řešení:

### Možnost 1: Použijte legacy TLS 1.0 porty Forward Email (doporučeno) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Pokud používáte Forward Email, je to nejjednodušší řešení. Forward Email poskytuje speciální legacy TLS 1.0 porty určené právě pro starší zařízení jako kamery, tiskárny, skenery a faxy.

#### Ceník {#pricing}

Forward Email nabízí několik plánů:

| Plán                    | Cena         | Funkce                                  |
| ----------------------- | ------------ | -------------------------------------- |
| Zdarma                  | 0 $/měsíc    | Pouze přeposílání e-mailů (bez odesílání) |
| **Enhanced Protection** | **3 $/měsíc**| **Přístup k SMTP + legacy TLS 1.0 porty** |
| Team                    | 9 $/měsíc    | Enhanced + týmové funkce                |
| Enterprise              | 250 $/měsíc  | Team + neomezené API požadavky          |

> \[!IMPORTANT]
> Pro přístup k SMTP a podporu legacy TLS 1.0 portů je vyžadován **plán Enhanced Protection (3 $/měsíc)** nebo vyšší.

Více informací na [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Vygenerujte si heslo {#generate-your-password}

Před konfigurací zařízení si v Forward Email vygenerujte heslo:

1. Přihlaste se na [Forward Email](https://forwardemail.net)
2. Přejděte do **Můj účet → Domény → \[Vaše doména] → Alias**
3. Vytvořte nebo vyberte alias (např. `camera@yourdomain.com`)
4. Klikněte na **"Generate Password"** vedle aliasu
5. Zkopírujte vygenerované heslo – použijete ho pro SMTP autentizaci

> \[!TIP]
> Každý alias může mít své vlastní heslo. To je užitečné pro sledování, které zařízení odeslalo který e-mail.

#### Nakonfigurujte své zařízení {#configure-your-device}

Použijte tato nastavení ve své kameře, tiskárně, skeneru nebo jiném starším zařízení:

| Nastavení      | Hodnota                                           |
| -------------- | ------------------------------------------------ |
| SMTP server    | `smtp.forwardemail.net`                           |
| Port (SSL/TLS) | `2455`                                            |
| Port (STARTTLS)| `2555` (alternativa)                              |
| Uživatelské jméno | Váš alias e-mail (např. `camera@yourdomain.com`) |
| Heslo          | Heslo z "Generate Password"                       |
| Autentizace    | Povinná                                          |
| Šifrování      | SSL/TLS (doporučeno) nebo STARTTLS                |

> \[!WARNING]
> Tyto porty používají zastaralý protokol TLS 1.0, který má známé bezpečnostní zranitelnosti (BEAST, POODLE). Používejte pouze pokud vaše zařízení nepodporuje moderní TLS 1.2+.

Jednoduše nakonfigurujte zařízení s těmito nastaveními a bude odesílat e-maily přímo přes Forward Email bez potřeby lokálního relé serveru.

Pro více informací viz [Forward Email FAQ o podpoře legacy TLS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Možnost 2: Nastavení Postfix SMTP relé {#option-2-set-up-a-postfix-smtp-relay}

Pokud nepoužíváte Forward Email nebo preferujete lokální relé řešení, nastavte Postfix na Raspberry Pi jako prostředníka. Funguje s jakýmkoliv poskytovatelem e-mailu (Gmail, Outlook, Yahoo, AOL atd.).

#### Instalace Postfixu {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Během instalace:

* Vyberte **"Internet Site"**
* Zadejte hostname vašeho Pi (např. `raspberrypi-ftp`) pro "System mail name"

#### Vyberte svého poskytovatele e-mailu {#choose-your-email-provider}

| Poskytovatel | SMTP server           | Port | Vyžaduje heslo aplikace? |
| ------------ | --------------------- | ---- | ------------------------ |
| Gmail        | smtp.gmail.com        | 587  | Ano                      |
| Outlook      | smtp-mail.outlook.com | 587  | Ano                      |
| Yahoo        | smtp.mail.yahoo.com   | 465  | Ano                      |
| AOL          | smtp.aol.com          | 587  | Ano                      |

#### Získejte heslo specifické pro aplikaci {#get-an-app-specific-password}

Většina poskytovatelů vyžaduje hesla aplikací pro aplikace třetích stran. Vygenerujte si ho v nastavení zabezpečení vašeho poskytovatele e-mailu:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Nikdy nepoužívejte své běžné heslo k e-mailu. Vždy používejte heslo specifické pro aplikaci.

#### Nakonfigurujte SASL autentizaci {#configure-sasl-authentication}

Vytvořte soubor s heslem pro vašeho vybraného poskytovatele. Tento příklad používá Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Přidejte tento řádek (upravte server a port podle vašeho poskytovatele):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Pro Gmail použijte:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Zabezpečte a zahashujte soubor:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Nakonfigurujte mapování e-mailových adres {#configure-email-address-mapping}

Přepište lokální e-mailové adresy tak, aby odpovídaly vašemu poskytovateli e-mailu:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Přidejte tento řádek (nahraďte `HOSTNAME` hostname vašeho Pi a použijte svůj e-mail):

```
/.+@HOSTNAME/    your_email@provider.com
```

Příklad:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Zabezpečte soubor:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Nakonfigurujte hlavní nastavení Postfixu {#configure-postfix-main-settings}

Upravte hlavní konfiguraci:

```bash
sudo nano /etc/postfix/main.cf
```

Najděte a aktualizujte relay hosta (nebo přidejte na konec):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Přidejte tato nastavení na konec souboru:

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
> Pro Gmail (port 587) nastavte `smtp_tls_wrappermode = no` místo `yes`.

> \[!WARNING]
> Aktualizujte `mynetworks` podle vaší skutečné síťové rozsahu. Přidávejte pouze důvěryhodné sítě – jakékoli zařízení v těchto sítích může odesílat poštu bez autentizace.

**Běžné síťové rozsahy:**

| Síťový rozsah    | Rozsah IP adres               |
| ---------------- | ----------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254   |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254   |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255     |

#### Aktualizujte firewall a restartujte {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Ověřte, že Postfix běží:

```bash
sudo systemctl status postfix
```

#### Otestujte relay {#test-the-relay}

Pošlete testovací e-mail:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Zkontrolujte logy:

```bash
sudo tail -f /var/log/mail.log
```

Hledejte `status=sent` pro potvrzení úspěchu.

#### Nakonfigurujte své zařízení {#configure-your-device-1}

V nastavení vaší kamery nebo zařízení:
* **SMTP Server:** IP adresa vašeho Pi (např. `192.168.1.100`)
* **SMTP Port:** `25`
* **Autentizace:** Žádná
* **Šifrování:** Žádné (pouze lokální síť)


## Řešení problémů {#troubleshooting}

Pokud nastanou problémy, zkontrolujte tyto logovací soubory:

**FTP Server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Monitor souborů:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Zobrazit frontu pošty
```


## Závěr {#wrapping-up}

Raspberry Pi je nyní kompletní automatizovaný systém s bezpečnými nahráváními souborů, automatickými emailovými upozorněními s přílohami a schopnostmi SMTP relé pro starší zařízení. Ať už používáte legacy TLS porty Forward Email nebo lokální Postfix relé, starší zařízení nyní mohou spolehlivě odesílat emaily přes moderní poskytovatele emailů.
