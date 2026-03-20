# Zamień swojego Raspberry Pi w bezpieczny serwer FTP z przekazywaniem e-maili {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Masz Raspberry Pi zbierające kurz? Niezależnie od tego, czy to najnowszy Pi 5, Pi 4, Pi Zero, czy nawet starszy model, ten przewodnik pokaże Ci, jak zamienić go w potężny, zautomatyzowany serwer plików z możliwością przekazywania e-maili. Idealne dla kamer bezpieczeństwa, urządzeń IoT i nie tylko.

**Kompatybilne z:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W oraz Raspberry Pi Zero.

> \[!NOTE]
> Ten przewodnik był testowany i zweryfikowany na Raspberry Pi 3 Model B z systemem Ubuntu Server 22.04 LTS.


## Spis treści {#table-of-contents}

* [Co budujemy](#what-were-building)
* [Część 1: Instalacja Ubuntu Server na Twoim Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Co będzie potrzebne](#what-youll-need)
  * [Nagrywanie systemu](#flashing-the-os)
  * [Uruchamianie i łączenie](#booting-up--connecting)
* [Część 2: Konfiguracja bezpiecznego serwera FTP](#part-2-setting-up-a-secure-ftp-server)
  * [Instalacja i konfiguracja](#installation--configuration)
  * [Tworzenie użytkownika FTP](#creating-an-ftp-user)
* [Część 3: Zapora sieciowa i ochrona przed atakami brute-force](#part-3-firewall-and-brute-force-protection)
  * [Konfiguracja UFW](#setting-up-ufw)
  * [Konfiguracja Fail2ban](#setting-up-fail2ban)
* [Część 4: Automatyczne przetwarzanie plików z powiadomieniami e-mail](#part-4-automated-file-processing-with-email-notifications)
  * [Opcja 1: Użycie Forward Email API (zalecane)](#option-1-using-forward-email-api-recommended)
  * [Opcja 2: Użycie innych dostawców e-mail](#option-2-using-other-email-providers)
  * [Tworzenie usługi systemd](#create-a-systemd-service)
* [Część 5: Opcje e-mail dla starszych urządzeń](#part-5-email-options-for-legacy-devices)
  * [Opcja 1: Użycie starszych portów TLS 1.0 Forward Email (zalecane)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Opcja 2: Konfiguracja relaya SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Rozwiązywanie problemów](#troubleshooting)
* [Podsumowanie](#wrapping-up)


## Co budujemy {#what-were-building}

Ten przewodnik przeprowadzi Cię przez konfigurację kompletnego systemu, który obejmuje:

* **Ubuntu Server 22.04 LTS:** Solidny, lekki system operacyjny dla Pi.
* **Bezpieczny serwer FTP (vsftpd):** Do bezpiecznego przesyłania plików.
* **Zapora sieciowa (UFW) i Fail2ban:** Aby trzymać nieproszonych gości z daleka.
* **Automatyczny procesor plików:** Skrypt, który pobiera nowe pliki, wysyła je jako załączniki e-mail i sprząta po sobie.
* **Opcje e-mail dla starszych urządzeń:** Dwa podejścia dla urządzeń, które nie obsługują nowoczesnego TLS:
  * Użycie starszych portów TLS 1.0 Forward Email (najprostsze)
  * Konfiguracja relaya SMTP Postfix (działa z każdym dostawcą e-mail)

Gotowy? Zaczynamy.


## Część 1: Instalacja Ubuntu Server na Twoim Pi {#part-1-getting-ubuntu-server-on-your-pi}

Na początek uruchom Ubuntu Server na Raspberry Pi. To zaskakująco proste dzięki Raspberry Pi Imager.

### Co będzie potrzebne {#what-youll-need}

* Dowolne kompatybilne Raspberry Pi (patrz lista powyżej)
* Karta microSD (minimum 8GB, zalecane 16GB+)
* Komputer z czytnikiem kart microSD
* Odpowiedni zasilacz dla Twojego modelu Pi
* Dostęp do internetu (Ethernet lub Wi-Fi)

> \[!NOTE]
> Starsze modele, takie jak Raspberry Pi 2 lub Pi Zero, mogą działać wolniej, ale będą odpowiednie do tej konfiguracji.

### Nagrywanie systemu {#flashing-the-os}

1. **Pobierz Raspberry Pi Imager:** Pobierz go z [oficjalnej strony](https://www.raspberrypi.com/software/).

2. **Wybierz system operacyjny:** W imagerze wybierz "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Dla modeli 64-bitowych (Pi 3, 4, 5, Zero 2 W) wybierz **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Dla starszych modeli 32-bitowych (Pi 2, Pi Zero, Pi Zero W) wybierz **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Wybierz nośnik:** Wskaż swoją kartę microSD.

> \[!WARNING]
> To wyczyści kartę microSD. Upewnij się, że wykonałeś kopię zapasową ważnych danych.

4. **Opcje zaawansowane są Twoim sprzymierzeńcem:** Kliknij ikonę koła zębatego (⚙️), aby skonfigurować Pi do trybu bezgłowego (bez monitora i klawiatury).
   * **Nazwa hosta:** Nadaj swojemu Pi nazwę (np. `pi-server`).
   * **SSH:** Włącz i ustaw nazwę użytkownika oraz hasło.
   * **Wi-Fi:** Jeśli nie używasz Ethernetu, wpisz dane swojej sieci Wi-Fi.
   * **Lokalizacja:** Ustaw strefę czasową i układ klawiatury.
5. **Napisz!** Kliknij przycisk "WRITE" i pozwól, aby imager wykonał swoje zadanie.

### Uruchamianie i łączenie się {#booting-up--connecting}

Gdy imager skończy, włóż kartę microSD do Pi i podłącz je do zasilania. Poczekaj kilka minut na uruchomienie. W tle odbywa się wstępna konfiguracja. Znajdź jego adres IP na stronie administracyjnej routera, a następnie połącz się przez SSH:

```bash
ssh your_username@your_pi_ip_address
```

Jesteś w środku! Raspberry Pi jest teraz gotowe do konfiguracji.


## Część 2: Konfiguracja bezpiecznego serwera FTP {#part-2-setting-up-a-secure-ftp-server}

Następnie skonfiguruj `vsftpd` (Very Secure FTP Daemon), skonfigurowany dla maksymalnego bezpieczeństwa.

### Instalacja i konfiguracja {#installation--configuration}

1. **Zainstaluj vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Zrób kopię zapasową pliku konfiguracyjnego:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Edytuj konfigurację:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Jeśli linia jest zakomentowana (zaczyna się od `#`), odkomentuj ją usuwając `#`.

Wprowadź następujące zmiany:

| Ustawienie               | Wartość | Cel                                                        |
| ------------------------ | ------- | ---------------------------------------------------------- |
| `anonymous_enable`       | `NO`    | Wyłącz dostęp anonimowy do FTP                             |
| `local_enable`           | `YES`   | Pozwól lokalnym użytkownikom na logowanie                  |
| `write_enable`           | `YES`   | Włącz możliwość przesyłania plików                          |
| `local_umask`            | `022`   | Ustaw uprawnienia plików (644 dla plików, 755 dla katalogów) |
| `chroot_local_user`      | `YES`   | Ogranicz użytkowników do ich katalogu domowego             |
| `allow_writeable_chroot` | `YES`   | Pozwól na przesyłanie plików w chroot jail                 |

4. **Dodaj zakres portów pasywnych:** Dodaj te linie na końcu pliku. Jest to potrzebne dla zapory sieciowej.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Włącz logowanie:** Dodaj te linie, aby włączyć logowanie dla Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Zapisz i zrestartuj:** Naciśnij `Ctrl+O`, `Enter`, `Ctrl+X`, a następnie zrestartuj usługę:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Tworzenie użytkownika FTP {#creating-an-ftp-user}

Utwórz dedykowanego, ograniczonego użytkownika do dostępu FTP.

1. **Utwórz użytkownika:**

   ```bash
   sudo adduser ftpuser
   ```

   Postępuj zgodnie z instrukcjami, aby ustawić hasło. Pozostałe pola (imię, telefon itp.) można pozostawić puste.

2. **Utwórz strukturę katalogów:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Główny katalog FTP
   * `/home/ftpuser/ftp/uploads` - Miejsce przesyłania plików

3. **Ustaw uprawnienia:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Część 3: Zapora sieciowa i ochrona przed atakami brute-force {#part-3-firewall-and-brute-force-protection}

Zabezpiecz Pi za pomocą UFW (Uncomplicated Firewall) i Fail2ban.

### Konfiguracja UFW {#setting-up-ufw}

1. **Zainstaluj UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Ustaw domyślne zasady:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Zezwól na SSH (krytyczne!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Zawsze zezwól na SSH przed włączeniem zapory, inaczej zablokujesz sobie dostęp!

4. **Zezwól na porty FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Włącz zaporę:**

   ```bash
   sudo ufw enable
   ```

### Konfiguracja Fail2ban {#setting-up-fail2ban}

Fail2ban automatycznie blokuje adresy IP po wielokrotnych nieudanych próbach logowania.

1. **Zainstaluj Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Utwórz lokalną konfigurację:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Dodaj następujące konfiguracje:**
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

### Utwórz usługę Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Dodaj tę zawartość:

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

Włącz i uruchom usługę:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Sprawdź status:

```bash
sudo systemctl status ftp-monitor.service
```


## Część 5: Opcje e-mail dla starszych urządzeń {#part-5-email-options-for-legacy-devices}

Urządzenia takie jak kamery FOSSCAM często nie obsługują nowoczesnych wersji TLS. Istnieją dwa rozwiązania:

### Opcja 1: Użyj portów Legacy TLS 1.0 Forward Email (zalecane) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Jeśli korzystasz z Forward Email, to najprostsze rozwiązanie. Forward Email udostępnia dedykowane porty legacy TLS 1.0 specjalnie dla starszych urządzeń, takich jak kamery, drukarki, skanery i faksy.

#### Cennik {#pricing}

Forward Email oferuje kilka planów:

| Plan                    | Cena         | Funkcje                               |
| ----------------------- | ------------ | ------------------------------------ |
| Free                    | 0 USD/mies.  | Tylko przekazywanie e-maili (bez wysyłania) |
| **Enhanced Protection** | **3 USD/mies.** | **Dostęp SMTP + porty legacy TLS 1.0** |
| Team                    | 9 USD/mies.  | Enhanced + funkcje zespołowe          |
| Enterprise              | 250 USD/mies.| Team + nieograniczone zapytania API   |

> \[!IMPORTANT]
> Plan **Enhanced Protection (3 USD/mies.)** lub wyższy jest wymagany do dostępu SMTP i obsługi portów legacy TLS 1.0.

Dowiedz się więcej na [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Wygeneruj swoje hasło {#generate-your-password}

Przed skonfigurowaniem urządzenia wygeneruj hasło w Forward Email:

1. Zaloguj się na [Forward Email](https://forwardemail.net)
2. Przejdź do **Moje konto → Domeny → \[Twoja domena] → Aliasy**
3. Utwórz lub wybierz alias (np. `camera@yourdomain.com`)
4. Kliknij **"Generate Password"** obok aliasu
5. Skopiuj wygenerowane hasło – będzie potrzebne do uwierzytelniania SMTP

> \[!TIP]
> Każdy alias może mieć własne hasło. To przydatne do śledzenia, które urządzenie wysłało jaki e-mail.

#### Skonfiguruj swoje urządzenie {#configure-your-device}

Użyj tych ustawień w swojej kamerze, drukarce, skanerze lub innym starszym urządzeniu:

| Ustawienie      | Wartość                                         |
| --------------- | ----------------------------------------------- |
| Serwer SMTP     | `smtp.forwardemail.net`                         |
| Port (SSL/TLS)  | `2455`                                          |
| Port (STARTTLS) | `2555` (alternatywny)                           |
| Nazwa użytkownika | Twój alias e-mail (np. `camera@yourdomain.com`) |
| Hasło           | Hasło z "Generate Password"                      |
| Uwierzytelnianie| Wymagane                                       |
| Szyfrowanie     | SSL/TLS (zalecane) lub STARTTLS                  |

> \[!WARNING]
> Te porty używają przestarzałego protokołu TLS 1.0, który ma znane luki bezpieczeństwa (BEAST, POODLE). Używaj tylko, jeśli Twoje urządzenie nie obsługuje nowoczesnego TLS 1.2+.

Po prostu skonfiguruj urządzenie z tymi ustawieniami, a będzie wysyłać e-maile bezpośrednio przez Forward Email bez potrzeby lokalnego serwera pośredniczącego.

Więcej szczegółów znajdziesz w [Forward Email FAQ dotyczące wsparcia Legacy TLS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Opcja 2: Skonfiguruj lokalny serwer SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Jeśli nie korzystasz z Forward Email lub wolisz lokalne rozwiązanie pośredniczące, skonfiguruj Postfix na Raspberry Pi jako pośrednika. Działa to z dowolnym dostawcą e-mail (Gmail, Outlook, Yahoo, AOL itp.).

#### Instalacja Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Podczas instalacji:

* Wybierz **"Internet Site"**
* Wprowadź nazwę hosta swojego Pi (np. `raspberrypi-ftp`) dla "System mail name"

#### Wybierz swojego dostawcę poczty {#choose-your-email-provider}

| Dostawca | Serwer SMTP           | Port | Wymagane hasło aplikacji? |
| -------- | --------------------- | ---- | ------------------------- |
| Gmail    | smtp.gmail.com        | 587  | Tak                       |
| Outlook  | smtp-mail.outlook.com | 587  | Tak                       |
| Yahoo    | smtp.mail.yahoo.com   | 465  | Tak                       |
| AOL      | smtp.aol.com          | 587  | Tak                       |

#### Uzyskaj hasło specyficzne dla aplikacji {#get-an-app-specific-password}

Większość dostawców wymaga haseł aplikacji dla aplikacji firm trzecich. Wygeneruj je w ustawieniach bezpieczeństwa swojego dostawcy poczty:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Nigdy nie używaj swojego zwykłego hasła do poczty. Zawsze używaj hasła specyficznego dla aplikacji.

#### Skonfiguruj uwierzytelnianie SASL {#configure-sasl-authentication}

Utwórz plik z hasłem dla wybranego dostawcy. Ten przykład używa Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Dodaj tę linię (dostosuj serwer i port do swojego dostawcy):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Dla Gmaila użyj:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Zabezpiecz i zahashuj plik:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Skonfiguruj mapowanie adresów e-mail {#configure-email-address-mapping}

Przepisz lokalne adresy e-mail, aby pasowały do twojego dostawcy poczty:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Dodaj tę linię (zamień `HOSTNAME` na nazwę hosta swojego Pi i użyj swojego e-maila):

```
/.+@HOSTNAME/    your_email@provider.com
```

Przykład:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Zabezpiecz plik:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Skonfiguruj główne ustawienia Postfix {#configure-postfix-main-settings}

Edytuj główną konfigurację:

```bash
sudo nano /etc/postfix/main.cf
```

Znajdź i zaktualizuj hosta przekaźnika (lub dodaj na końcu):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Dodaj te ustawienia na końcu pliku:

```
# Konfiguracja przekaźnika SMTP
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Ustawienia sieciowe
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Dla Gmaila (port 587) ustaw `smtp_tls_wrappermode = no` zamiast `yes`.

> \[!WARNING]
> Zaktualizuj `mynetworks` o rzeczywisty zakres swojej sieci. Dodaj tylko zaufane sieci – każde urządzenie w tych sieciach może wysyłać pocztę bez uwierzytelniania.

**Typowe zakresy sieci:**

| Zakres sieci     | Zakres adresów IP           |
| ---------------- | --------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Zaktualizuj zaporę i uruchom ponownie {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Sprawdź, czy Postfix działa:

```bash
sudo systemctl status postfix
```

#### Przetestuj przekaźnik {#test-the-relay}

Wyślij testowy e-mail:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Sprawdź logi:

```bash
sudo tail -f /var/log/mail.log
```

Szukaj `status=sent`, aby potwierdzić powodzenie.

#### Skonfiguruj swoje urządzenie {#configure-your-device-1}

W ustawieniach kamery lub urządzenia:
* **Serwer SMTP:** Adres IP Twojego Raspberry Pi (np. `192.168.1.100`)
* **Port SMTP:** `25`
* **Uwierzytelnianie:** Brak
* **Szyfrowanie:** Brak (tylko sieć lokalna)


## Rozwiązywanie problemów {#troubleshooting}

Jeśli pojawią się problemy, sprawdź te pliki dziennika:

**Serwer FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Monitor plików:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Poczta Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Wyświetl kolejkę poczty
```


## Podsumowanie {#wrapping-up}

Raspberry Pi jest teraz kompletnym, zautomatyzowanym systemem z bezpiecznym przesyłaniem plików, automatycznymi powiadomieniami e-mail z załącznikami oraz możliwością relaya SMTP dla starszych urządzeń. Niezależnie od tego, czy korzystasz z legacy TLS portów Forward Email, czy lokalnego relaya Postfix, starsze urządzenia mogą teraz niezawodnie wysyłać e-maile przez nowoczesnych dostawców poczty.
