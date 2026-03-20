# Перетворіть свій Raspberry Pi на безпечний FTP-сервер з пересиланням електронної пошти {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

У вас є Raspberry Pi, який припадає пилом? Незалежно від того, чи це останній Pi 5, Pi 4, Pi Zero або навіть старіша модель, цей посібник покаже вам, як перетворити його на потужний автоматизований файловий сервер з можливістю пересилання електронної пошти. Ідеально підходить для камер спостереження, IoT-пристроїв та іншого.

**Сумісно з:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W та Raspberry Pi Zero.

> \[!NOTE]
> Цей посібник був протестований і перевірений на Raspberry Pi 3 Model B з Ubuntu Server 22.04 LTS.


## Зміст {#table-of-contents}

* [Що ми створюємо](#what-were-building)
* [Частина 1: Встановлення Ubuntu Server на ваш Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Що вам знадобиться](#what-youll-need)
  * [Запис ОС](#flashing-the-os)
  * [Запуск і підключення](#booting-up--connecting)
* [Частина 2: Налаштування безпечного FTP-сервера](#part-2-setting-up-a-secure-ftp-server)
  * [Встановлення та конфігурація](#installation--configuration)
  * [Створення FTP-користувача](#creating-an-ftp-user)
* [Частина 3: Брандмауер і захист від брутфорсу](#part-3-firewall-and-brute-force-protection)
  * [Налаштування UFW](#setting-up-ufw)
  * [Налаштування Fail2ban](#setting-up-fail2ban)
* [Частина 4: Автоматизована обробка файлів з повідомленнями електронною поштою](#part-4-automated-file-processing-with-email-notifications)
  * [Варіант 1: Використання Forward Email API (рекомендовано)](#option-1-using-forward-email-api-recommended)
  * [Варіант 2: Використання інших поштових провайдерів](#option-2-using-other-email-providers)
  * [Створення служби systemd](#create-a-systemd-service)
* [Частина 5: Поштові опції для застарілих пристроїв](#part-5-email-options-for-legacy-devices)
  * [Варіант 1: Використання застарілих портів TLS 1.0 Forward Email (рекомендовано)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Варіант 2: Налаштування Postfix SMTP Relay](#option-2-set-up-a-postfix-smtp-relay)
* [Вирішення проблем](#troubleshooting)
* [Підсумки](#wrapping-up)


## Що ми створюємо {#what-were-building}

Цей посібник проведе вас через налаштування повної системи, яка включає:

* **Ubuntu Server 22.04 LTS:** Надійна, легка ОС для Pi.
* **Безпечний FTP-сервер (vsftpd):** Для безпечного завантаження файлів.
* **Брандмауер (UFW) та Fail2ban:** Щоб тримати зловмисників поза доступом.
* **Автоматизований обробник файлів:** Скрипт, який забирає нові файли, надсилає їх як вкладення електронною поштою, а потім очищує після себе.
* **Поштові опції для застарілих пристроїв:** Два підходи для пристроїв, які не підтримують сучасний TLS:
  * Використання застарілих портів TLS 1.0 Forward Email (найпростіший)
  * Налаштування Postfix SMTP Relay (працює з будь-яким поштовим провайдером)

Готові? Почнемо.


## Частина 1: Встановлення Ubuntu Server на ваш Pi {#part-1-getting-ubuntu-server-on-your-pi}

Перш за все, встановіть Ubuntu Server на Raspberry Pi. Це дивовижно просто завдяки Raspberry Pi Imager.

### Що вам знадобиться {#what-youll-need}

* Будь-який сумісний Raspberry Pi (див. список вище)
* microSD карта (мінімум 8 ГБ, рекомендовано 16 ГБ і більше)
* Комп’ютер з кард-рідером для microSD
* Відповідний блок живлення для вашої моделі Pi
* Доступ до Інтернету (Ethernet або Wi-Fi)

> \[!NOTE]
> Старіші моделі, як Raspberry Pi 2 або Pi Zero, можуть працювати повільніше, але підходять для цього налаштування.

### Запис ОС {#flashing-the-os}

1. **Отримайте Raspberry Pi Imager:** Завантажте його з [офіційного сайту](https://www.raspberrypi.com/software/).

2. **Виберіть ОС:** У програмі виберіть "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Для 64-бітних моделей (Pi 3, 4, 5, Zero 2 W) виберіть **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Для старіших 32-бітних моделей (Pi 2, Pi Zero, Pi Zero W) виберіть **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Виберіть накопичувач:** Оберіть вашу microSD карту.

> \[!WARNING]
> Це видалить всі дані з вашої microSD карти. Переконайтеся, що ви зробили резервні копії важливих файлів.

4. **Розширені опції вам на допомогу:** Натисніть на іконку шестерні (⚙️), щоб налаштувати Pi для безголового режиму (без монітора та клавіатури).
   * **Ім’я хоста:** Дайте вашому Pi ім’я (наприклад, `pi-server`).
   * **SSH:** Увімкніть і встановіть ім’я користувача та пароль.
   * **Wi-Fi:** Якщо не використовуєте Ethernet, введіть дані Wi-Fi.
   * **Локалізація:** Встановіть часовий пояс і розкладку клавіатури.
5. **Пишіть!** Натисніть кнопку "WRITE" і дайте програмі для запису образу виконати свою роботу.

### Завантаження та підключення {#booting-up--connecting}

Коли запис образу завершиться, вставте microSD карту в Pi і підключіть його до живлення. Дайте кілька хвилин на завантаження. У фоновому режимі відбувається початкове налаштування. Знайдіть його IP-адресу на сторінці адміністратора вашого роутера, потім підключіться через SSH:

```bash
ssh your_username@your_pi_ip_address
```

Ви в системі! Raspberry Pi тепер готовий до налаштування.


## Частина 2: Налаштування безпечного FTP-сервера {#part-2-setting-up-a-secure-ftp-server}

Далі налаштуйте `vsftpd` (Very Secure FTP Daemon), сконфігурований для максимальної безпеки.

### Встановлення та конфігурація {#installation--configuration}

1. **Встановіть vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Створіть резервну копію конфігураційного файлу:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Відредагуйте конфігурацію:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Якщо рядок закоментований (починається з `#`), розкоментуйте його, видаливши `#`.

Зробіть такі зміни:

| Налаштування             | Значення | Призначення                                               |
| ------------------------ | -------- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`     | Вимкнути анонімний доступ до FTP                          |
| `local_enable`           | `YES`    | Дозволити локальним користувачам входити в систему       |
| `write_enable`           | `YES`    | Дозволити завантаження файлів                             |
| `local_umask`            | `022`    | Встановити права доступу до файлів (644 для файлів, 755 для директорій) |
| `chroot_local_user`      | `YES`    | Обмежити користувачів їх домашньою директорією           |
| `allow_writeable_chroot` | `YES`    | Дозволити завантаження у chroot-обмеженні                |

4. **Додайте діапазон пасивних портів:** Додайте ці рядки в кінець файлу. Це потрібно для файрвола.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Увімкніть логування:** Додайте ці рядки для увімкнення логування для Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Збережіть і перезапустіть:** Натисніть `Ctrl+O`, `Enter`, `Ctrl+X`, потім перезапустіть сервіс:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Створення FTP-користувача {#creating-an-ftp-user}

Створіть спеціального обмеженого користувача для доступу до FTP.

1. **Створіть користувача:**

   ```bash
   sudo adduser ftpuser
   ```

   Виконайте підказки для встановлення пароля. Інші поля (ім'я, телефон тощо) можна залишити порожніми.

2. **Створіть структуру директорій:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - основна FTP директорія
   * `/home/ftpuser/ftp/uploads` - місце для завантаження файлів

3. **Встановіть права доступу:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Частина 3: Фаєрвол і захист від брутфорсу {#part-3-firewall-and-brute-force-protection}

Захистіть Pi за допомогою UFW (Uncomplicated Firewall) та Fail2ban.

### Налаштування UFW {#setting-up-ufw}

1. **Встановіть UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Встановіть політики за замовчуванням:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Дозвольте SSH (критично!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Завжди дозволяйте SSH перед увімкненням файрвола, інакше ви заблокуєте собі доступ!

4. **Дозвольте порти FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Увімкніть файрвол:**

   ```bash
   sudo ufw enable
   ```

### Налаштування Fail2ban {#setting-up-fail2ban}

Fail2ban автоматично блокує IP-адреси після повторних невдалих спроб входу.

1. **Встановіть Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Створіть локальну конфігурацію:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Додайте ці налаштування:**
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

Зробіть файл виконуваним:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Створіть службу Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Додайте цей вміст:

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

Увімкніть і запустіть службу:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Перевірте статус:

```bash
sudo systemctl status ftp-monitor.service
```


## Частина 5: Параметри електронної пошти для застарілих пристроїв {#part-5-email-options-for-legacy-devices}

Пристрої, такі як камери FOSSCAM, часто не підтримують сучасні версії TLS. Існує два рішення:

### Варіант 1: Використання застарілих портів TLS 1.0 Forward Email (Рекомендовано) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Якщо ви користуєтесь Forward Email, це найпростіше рішення. Forward Email надає спеціальні застарілі порти TLS 1.0 саме для старих пристроїв, таких як камери, принтери, сканери та факси.

#### Ціни {#pricing}

Forward Email пропонує кілька планів:

| План                    | Ціна         | Функції                                |
| ----------------------- | ------------ | ------------------------------------- |
| Безкоштовний            | $0/місяць    | Лише пересилання пошти (без відправки) |
| **Розширений захист**   | **$3/місяць**| **Доступ до SMTP + застарілі порти TLS 1.0** |
| Команда                 | $9/місяць    | Розширені функції + командні можливості |
| Підприємство            | $250/місяць  | Команда + необмежені API-запити       |

> \[!IMPORTANT]
> Для доступу до SMTP та підтримки застарілих портів TLS 1.0 потрібен **план Розширений захист ($3/місяць)** або вищий.

Дізнайтеся більше на [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Створіть свій пароль {#generate-your-password}

Перед налаштуванням пристрою створіть пароль у Forward Email:

1. Увійдіть на [Forward Email](https://forwardemail.net)
2. Перейдіть у **Мій акаунт → Домени → \[Ваш домен] → Псевдоніми**
3. Створіть або виберіть псевдонім (наприклад, `camera@yourdomain.com`)
4. Натисніть **"Generate Password"** поруч із псевдонімом
5. Скопіюйте згенерований пароль — він знадобиться для SMTP-автентифікації

> \[!TIP]
> Кожен псевдонім може мати власний пароль. Це корисно для відстеження, який пристрій надіслав який лист.

#### Налаштуйте свій пристрій {#configure-your-device}

Використовуйте ці налаштування у вашій камері, принтері, сканері або іншому застарілому пристрої:

| Налаштування    | Значення                                         |
| --------------- | ------------------------------------------------ |
| SMTP-сервер     | `smtp.forwardemail.net`                          |
| Порт (SSL/TLS)  | `2455`                                           |
| Порт (STARTTLS) | `2555` (альтернативний)                          |
| Ім’я користувача| Ваша електронна адреса псевдоніма (наприклад, `camera@yourdomain.com`) |
| Пароль          | Пароль зі "Створити пароль"                      |
| Аутентифікація  | Обов’язкова                                     |
| Шифрування      | SSL/TLS (рекомендовано) або STARTTLS             |

> \[!WARNING]
> Ці порти використовують застарілий протокол TLS 1.0, який має відомі вразливості безпеки (BEAST, POODLE). Використовуйте лише якщо ваш пристрій не підтримує сучасний TLS 1.2+.

Просто налаштуйте пристрій із цими параметрами, і він надсилатиме листи безпосередньо через Forward Email без потреби в локальному релейному сервері.

Для детальнішої інформації дивіться [Forward Email FAQ про підтримку застарілого TLS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Варіант 2: Налаштування SMTP-реле Postfix {#option-2-set-up-a-postfix-smtp-relay}

Якщо ви не користуєтесь Forward Email або віддаєте перевагу локальному релейному рішенню, налаштуйте Postfix на Raspberry Pi як посередника. Це працює з будь-яким поштовим провайдером (Gmail, Outlook, Yahoo, AOL тощо).

#### Встановлення Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Під час встановлення:

* Виберіть **"Internet Site"**
* Введіть ім'я хоста вашого Pi (наприклад, `raspberrypi-ftp`) для "System mail name"

#### Виберіть свого поштового провайдера {#choose-your-email-provider}

| Провайдер | SMTP сервер           | Порт | Потрібен пароль додатку? |
| --------- | --------------------- | ---- | ------------------------ |
| Gmail     | smtp.gmail.com        | 587  | Так                      |
| Outlook   | smtp-mail.outlook.com | 587  | Так                      |
| Yahoo     | smtp.mail.yahoo.com   | 465  | Так                      |
| AOL       | smtp.aol.com          | 587  | Так                      |

#### Отримайте пароль додатку {#get-an-app-specific-password}

Більшість провайдерів вимагають паролі додатків для сторонніх програм. Згенеруйте його у налаштуваннях безпеки вашого поштового провайдера:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Ніколи не використовуйте свій звичайний пароль від електронної пошти. Завжди використовуйте пароль додатку.

#### Налаштуйте автентифікацію SASL {#configure-sasl-authentication}

Створіть файл паролів для обраного провайдера. У цьому прикладі використовується Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Додайте цей рядок (підкоригуйте сервер і порт для вашого провайдера):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Для Gmail використовуйте:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Захистіть і створіть хеш файлу:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Налаштуйте відображення електронних адрес {#configure-email-address-mapping}

Перепишіть локальні електронні адреси, щоб вони відповідали вашому поштовому провайдеру:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Додайте цей рядок (замініть `HOSTNAME` на ім'я хоста вашого Pi і використайте вашу електронну адресу):

```
/.+@HOSTNAME/    your_email@provider.com
```

Приклад:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Захистіть файл:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Налаштуйте основні параметри Postfix {#configure-postfix-main-settings}

Відредагуйте основний конфігураційний файл:

```bash
sudo nano /etc/postfix/main.cf
```

Знайдіть і оновіть relay host (або додайте в кінець):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Додайте ці налаштування в кінець файлу:

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
> Для Gmail (порт 587) встановіть `smtp_tls_wrappermode = no` замість `yes`.

> \[!WARNING]
> Оновіть `mynetworks` відповідно до вашого фактичного діапазону мережі. Додавайте лише довірені мережі — будь-який пристрій у цих мережах може надсилати пошту без автентифікації.

**Поширені діапазони мереж:**

| Діапазон мережі    | Діапазон IP-адрес           |
| ------------------ | --------------------------- |
| `192.168.0.0/24`   | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24`   | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`       | 10.0.0.0 - 10.255.255.255   |

#### Оновіть брандмауер і перезапустіть {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Перевірте, чи працює Postfix:

```bash
sudo systemctl status postfix
```

#### Перевірте ретрансляцію {#test-the-relay}

Надішліть тестовий лист:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Перегляньте логи:

```bash
sudo tail -f /var/log/mail.log
```

Шукайте `status=sent` для підтвердження успіху.

#### Налаштуйте ваш пристрій {#configure-your-device-1}

У налаштуваннях вашої камери або пристрою:
* **SMTP сервер:** IP-адреса вашого Pi (наприклад, `192.168.1.100`)
* **SMTP порт:** `25`
* **Аутентифікація:** Відсутня
* **Шифрування:** Відсутнє (тільки локальна мережа)


## Усунення несправностей {#troubleshooting}

Якщо виникають проблеми, перевірте ці журнали:

**FTP сервер:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Монітор файлів:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Пошта Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Переглянути чергу пошти
```


## Завершення {#wrapping-up}

Raspberry Pi тепер є повністю автоматизованою системою з безпечним завантаженням файлів, автоматичними email-повідомленнями з вкладеннями та можливостями SMTP ретрансляції для застарілих пристроїв. Незалежно від того, чи використовуєте ви застарілі TLS порти Forward Email або локальний ретранслятор Postfix, старі пристрої тепер можуть надійно надсилати електронні листи через сучасних поштових провайдерів.
