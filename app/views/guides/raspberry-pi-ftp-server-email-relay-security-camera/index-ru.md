# Превратите ваш Raspberry Pi в безопасный FTP-сервер с пересылкой электронной почты {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

У вас есть Raspberry Pi, который пылится без дела? Будь то новейший Pi 5, Pi 4, Pi Zero или даже более старая модель, это руководство покажет вам, как превратить его в мощный автоматизированный файловый сервер с возможностями пересылки электронной почты. Идеально подходит для камер видеонаблюдения, IoT-устройств и многого другого.

**Совместимо с:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W и Raspberry Pi Zero.

> \[!NOTE]
> Это руководство было протестировано и проверено на Raspberry Pi 3 Model B с Ubuntu Server 22.04 LTS.


## Содержание {#table-of-contents}

* [Что мы собираем](#what-were-building)
* [Часть 1: Установка Ubuntu Server на ваш Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Что вам понадобится](#what-youll-need)
  * [Запись ОС](#flashing-the-os)
  * [Загрузка и подключение](#booting-up--connecting)
* [Часть 2: Настройка безопасного FTP-сервера](#part-2-setting-up-a-secure-ftp-server)
  * [Установка и конфигурация](#installation--configuration)
  * [Создание FTP-пользователя](#creating-an-ftp-user)
* [Часть 3: Защита брандмауэром и от перебора паролей](#part-3-firewall-and-brute-force-protection)
  * [Настройка UFW](#setting-up-ufw)
  * [Настройка Fail2ban](#setting-up-fail2ban)
* [Часть 4: Автоматическая обработка файлов с уведомлениями по электронной почте](#part-4-automated-file-processing-with-email-notifications)
  * [Вариант 1: Использование Forward Email API (рекомендуется)](#option-1-using-forward-email-api-recommended)
  * [Вариант 2: Использование других почтовых провайдеров](#option-2-using-other-email-providers)
  * [Создание службы systemd](#create-a-systemd-service)
* [Часть 5: Почтовые опции для устаревших устройств](#part-5-email-options-for-legacy-devices)
  * [Вариант 1: Использование устаревших портов TLS 1.0 Forward Email (рекомендуется)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Вариант 2: Настройка SMTP-реле Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Устранение неполадок](#troubleshooting)
* [Заключение](#wrapping-up)


## Что мы собираем {#what-were-building}

Это руководство проведет вас через настройку полной системы, которая включает:

* **Ubuntu Server 22.04 LTS:** Надежная, легковесная ОС для Pi.
* **Безопасный FTP-сервер (vsftpd):** Для безопасной передачи файлов.
* **Брандмауэр (UFW) и Fail2ban:** Чтобы держать злоумышленников вне доступа.
* **Автоматический обработчик файлов:** Скрипт, который забирает новые файлы, отправляет их по электронной почте в виде вложений и затем очищает за собой.
* **Почтовые опции для устаревших устройств:** Два подхода для устройств, не поддерживающих современный TLS:
  * Использование устаревших портов TLS 1.0 Forward Email (проще всего)
  * Настройка SMTP-реле Postfix (работает с любым почтовым провайдером)

Готовы? Поехали.


## Часть 1: Установка Ubuntu Server на ваш Pi {#part-1-getting-ubuntu-server-on-your-pi}

Прежде всего, установите Ubuntu Server на Raspberry Pi. Это удивительно просто благодаря Raspberry Pi Imager.

### Что вам понадобится {#what-youll-need}

* Любой совместимый Raspberry Pi (см. список выше)
* Карта microSD (минимум 8 ГБ, рекомендуется 16 ГБ и больше)
* Компьютер с картридером microSD
* Подходящий блок питания для вашей модели Pi
* Доступ в интернет (Ethernet или Wi-Fi)

> \[!NOTE]
> Старые модели, такие как Raspberry Pi 2 или Pi Zero, могут работать медленнее, но подойдут для этой настройки.

### Запись ОС {#flashing-the-os}

1. **Скачайте Raspberry Pi Imager:** Загрузите его с [официального сайта](https://www.raspberrypi.com/software/).

2. **Выберите ОС:** В имейджере выберите "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Для 64-битных моделей (Pi 3, 4, 5, Zero 2 W) выберите **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Для старых 32-битных моделей (Pi 2, Pi Zero, Pi Zero W) выберите **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Выберите носитель:** Укажите вашу карту microSD.

> \[!WARNING]
> Это сотрет все данные на вашей карте microSD. Убедитесь, что вы сделали резервные копии важных данных.

4. **Расширенные настройки вам помогут:** Нажмите на значок шестеренки (⚙️), чтобы настроить Pi для безголового режима (без монитора и клавиатуры).
   * **Имя хоста:** Присвойте вашему Pi имя (например, `pi-server`).
   * **SSH:** Включите SSH и задайте имя пользователя и пароль.
   * **Wi-Fi:** Если вы не используете Ethernet, введите данные вашей Wi-Fi сети.
   * **Локализация:** Установите часовой пояс и раскладку клавиатуры.
5. **Пишите!** Нажмите кнопку "WRITE" и дайте имейджеру выполнить свою работу.

### Загрузка и подключение {#booting-up--connecting}

Когда имейджер завершит работу, вставьте microSD карту в Pi и включите его. Дайте несколько минут на загрузку. В фоновом режиме выполняется начальная настройка. Найдите его IP-адрес на странице администрирования вашего роутера, затем подключитесь через SSH:

```bash
ssh your_username@your_pi_ip_address
```

Вы внутри! Raspberry Pi теперь готов к настройке.


## Часть 2: Настройка безопасного FTP-сервера {#part-2-setting-up-a-secure-ftp-server}

Далее установите `vsftpd` (Very Secure FTP Daemon), настроенный для максимальной безопасности.

### Установка и настройка {#installation--configuration}

1. **Установите vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Создайте резервную копию конфигурационного файла:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Отредактируйте конфигурацию:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Если строка закомментирована (начинается с `#`), раскомментируйте её, удалив `#`.

Внесите следующие изменения:

| Параметр                 | Значение | Назначение                                               |
| ------------------------ | -------- | -------------------------------------------------------- |
| `anonymous_enable`       | `NO`     | Отключить анонимный доступ по FTP                        |
| `local_enable`           | `YES`    | Разрешить вход локальным пользователям                   |
| `write_enable`           | `YES`    | Включить загрузку файлов                                 |
| `local_umask`            | `022`    | Установить права на файлы (644 для файлов, 755 для папок)|
| `chroot_local_user`      | `YES`    | Ограничить пользователей их домашним каталогом          |
| `allow_writeable_chroot` | `YES`    | Разрешить загрузку в chroot-окружении                    |

4. **Добавьте диапазон пассивных портов:** Добавьте эти строки в конец файла. Это необходимо для работы файрвола.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Включите логирование:** Добавьте эти строки для включения логирования Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Сохраните и перезапустите:** Нажмите `Ctrl+O`, `Enter`, `Ctrl+X`, затем перезапустите сервис:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Создание FTP-пользователя {#creating-an-ftp-user}

Создайте выделенного, ограниченного пользователя для доступа по FTP.

1. **Создайте пользователя:**

   ```bash
   sudo adduser ftpuser
   ```

   Следуйте подсказкам для установки пароля. Остальные поля (имя, телефон и т.д.) можно оставить пустыми.

2. **Создайте структуру каталогов:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Главный каталог FTP
   * `/home/ftpuser/ftp/uploads` - Каталог для загрузки файлов

3. **Установите права доступа:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Часть 3: Фаервол и защита от перебора паролей {#part-3-firewall-and-brute-force-protection}

Защитите Pi с помощью UFW (Uncomplicated Firewall) и Fail2ban.

### Настройка UFW {#setting-up-ufw}

1. **Установите UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Установите политики по умолчанию:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Разрешите SSH (важно!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Всегда разрешайте SSH перед включением файрвола, иначе вы заблокируете себе доступ!

4. **Разрешите FTP-порты:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Включите файрвол:**

   ```bash
   sudo ufw enable
   ```

### Настройка Fail2ban {#setting-up-fail2ban}

Fail2ban автоматически блокирует IP-адреса после повторных неудачных попыток входа.

1. **Установите Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Создайте локальную конфигурацию:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Добавьте следующие настройки:**
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

Сделайте файл исполняемым:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Создайте службу Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Добавьте следующий контент:

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

Включите и запустите службу:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Проверьте статус:

```bash
sudo systemctl status ftp-monitor.service
```


## Часть 5: Параметры электронной почты для устаревших устройств {#part-5-email-options-for-legacy-devices}

Устройства, такие как камеры FOSSCAM, часто не поддерживают современные версии TLS. Есть два решения:

### Вариант 1: Использовать устаревшие порты TLS 1.0 Forward Email (рекомендуется) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Если вы используете Forward Email, это самое простое решение. Forward Email предоставляет выделенные устаревшие порты TLS 1.0 специально для старых устройств, таких как камеры, принтеры, сканеры и факсы.

#### Цены {#pricing}

Forward Email предлагает несколько тарифных планов:

| План                    | Цена         | Особенности                            |
| ----------------------- | ------------ | ------------------------------------- |
| Бесплатный              | $0/месяц     | Только переадресация почты (без отправки) |
| **Расширенная защита**  | **$3/месяц** | **Доступ к SMTP + устаревшие порты TLS 1.0** |
| Команда                 | $9/месяц     | Расширенные функции + команда         |
| Корпоративный           | $250/месяц   | Команда + неограниченные API-запросы |

> \[!IMPORTANT]
> Для доступа к SMTP и поддержки устаревших портов TLS 1.0 требуется **тариф Расширенная защита ($3/месяц)** или выше.

Подробнее на [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Создайте пароль {#generate-your-password}

Перед настройкой устройства создайте пароль в Forward Email:

1. Войдите на [Forward Email](https://forwardemail.net)
2. Перейдите в **Мой аккаунт → Домены → \[Ваш домен] → Псевдонимы**
3. Создайте или выберите псевдоним (например, `camera@yourdomain.com`)
4. Нажмите **"Создать пароль"** рядом с псевдонимом
5. Скопируйте сгенерированный пароль — он понадобится для SMTP-аутентификации

> \[!TIP]
> Для каждого псевдонима можно задать отдельный пароль. Это удобно для отслеживания, какое устройство отправило какое письмо.

#### Настройте устройство {#configure-your-device}

Используйте эти настройки в вашей камере, принтере, сканере или другом устаревшем устройстве:

| Параметр        | Значение                                         |
| --------------- | ------------------------------------------------ |
| SMTP-сервер     | `smtp.forwardemail.net`                          |
| Порт (SSL/TLS)  | `2455`                                           |
| Порт (STARTTLS) | `2555` (альтернативный)                          |
| Имя пользователя| Ваш email-псевдоним (например, `camera@yourdomain.com`) |
| Пароль          | Пароль из "Создать пароль"                        |
| Аутентификация  | Обязательна                                      |
| Шифрование      | SSL/TLS (рекомендуется) или STARTTLS             |

> \[!WARNING]
> Эти порты используют устаревший протокол TLS 1.0, который имеет известные уязвимости безопасности (BEAST, POODLE). Используйте только если ваше устройство не поддерживает современные версии TLS 1.2+.

Просто настройте устройство с этими параметрами, и оно будет отправлять письма напрямую через Forward Email без необходимости локального ретранслятора.

Для подробностей смотрите [Forward Email FAQ по поддержке устаревшего TLS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Вариант 2: Настройка SMTP-ретранслятора Postfix {#option-2-set-up-a-postfix-smtp-relay}

Если вы не используете Forward Email или предпочитаете локальное решение, настройте Postfix на Raspberry Pi в качестве посредника. Это работает с любым почтовым провайдером (Gmail, Outlook, Yahoo, AOL и др.).

#### Установка Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Во время установки:

* Выберите **"Internet Site"**
* Введите имя хоста вашего Pi (например, `raspberrypi-ftp`) для "System mail name"

#### Выберите вашего почтового провайдера {#choose-your-email-provider}

| Провайдер | SMTP сервер           | Порт | Требуется пароль приложения? |
| --------- | --------------------- | ---- | ---------------------------- |
| Gmail     | smtp.gmail.com        | 587  | Да                          |
| Outlook   | smtp-mail.outlook.com | 587  | Да                          |
| Yahoo     | smtp.mail.yahoo.com   | 465  | Да                          |
| AOL       | smtp.aol.com          | 587  | Да                          |

#### Получите пароль приложения {#get-an-app-specific-password}

Большинство провайдеров требуют пароли приложений для сторонних приложений. Создайте его в настройках безопасности вашего почтового провайдера:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Никогда не используйте обычный пароль от электронной почты. Всегда используйте пароль приложения.

#### Настройка аутентификации SASL {#configure-sasl-authentication}

Создайте файл паролей для выбранного провайдера. В этом примере используется Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Добавьте эту строку (откорректируйте сервер и порт для вашего провайдера):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Для Gmail используйте:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Защитите и хэшируйте файл:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Настройка сопоставления адресов электронной почты {#configure-email-address-mapping}

Перепишите локальные адреса электронной почты, чтобы они соответствовали вашему почтовому провайдеру:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Добавьте эту строку (замените `HOSTNAME` на имя хоста вашего Pi и используйте ваш email):

```
/.+@HOSTNAME/    your_email@provider.com
```

Пример:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Защитите файл:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Настройка основных параметров Postfix {#configure-postfix-main-settings}

Отредактируйте основной конфигурационный файл:

```bash
sudo nano /etc/postfix/main.cf
```

Найдите и обновите relay host (или добавьте в конце):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Добавьте эти настройки в конец файла:

```
# Конфигурация SMTP релея
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Сетевые настройки
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Для Gmail (порт 587) установите `smtp_tls_wrappermode = no` вместо `yes`.

> \[!WARNING]
> Обновите `mynetworks` с вашим реальным диапазоном сети. Добавляйте только доверенные сети — любое устройство в этих сетях сможет отправлять почту без аутентификации.

**Распространённые диапазоны сетей:**

| Диапазон сети    | Диапазон IP-адресов          |
| ---------------- | ---------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254  |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254  |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255    |

#### Обновите брандмауэр и перезапустите {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Проверьте, что Postfix запущен:

```bash
sudo systemctl status postfix
```

#### Проверьте релей {#test-the-relay}

Отправьте тестовое письмо:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Проверьте логи:

```bash
sudo tail -f /var/log/mail.log
```

Ищите `status=sent` для подтверждения успешной отправки.

#### Настройте ваше устройство {#configure-your-device-1}

В настройках вашей камеры или устройства:
* **SMTP сервер:** IP-адрес вашего Pi (например, `192.168.1.100`)
* **SMTP порт:** `25`
* **Аутентификация:** отсутствует
* **Шифрование:** отсутствует (только локальная сеть)


## Устранение неполадок {#troubleshooting}

Если возникают проблемы, проверьте эти журналы:

**FTP сервер:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Монитор файлов:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Почта Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Просмотр очереди почты
```


## Завершение {#wrapping-up}

Теперь Raspberry Pi — это полноценная автоматизированная система с безопасной загрузкой файлов, автоматическими уведомлениями по электронной почте с вложениями и возможностями SMTP-реле для устаревших устройств. Независимо от того, используются ли устаревшие TLS-порты Forward Email или локальное реле Postfix, старые устройства теперь могут надежно отправлять электронные письма через современные почтовые провайдеры.
