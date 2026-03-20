# Керівництво з встановлення Forward Email для самостійного хостингу на Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Зміст {#table-of-contents}

* [Огляд](#overview)
* [Вимоги](#prerequisites)
* [Системні вимоги](#system-requirements)
* [Покрокове встановлення](#step-by-step-installation)
  * [Крок 1: Початкове налаштування системи](#step-1-initial-system-setup)
  * [Крок 2: Налаштування DNS резолверів](#step-2-configure-dns-resolvers)
  * [Крок 3: Встановлення системних залежностей](#step-3-install-system-dependencies)
  * [Крок 4: Встановлення Snap пакетів](#step-4-install-snap-packages)
  * [Крок 5: Встановлення Docker](#step-5-install-docker)
  * [Крок 6: Налаштування служби Docker](#step-6-configure-docker-service)
  * [Крок 7: Налаштування брандмауера](#step-7-configure-firewall)
  * [Крок 8: Клонування репозиторію Forward Email](#step-8-clone-forward-email-repository)
  * [Крок 9: Налаштування конфігурації середовища](#step-9-set-up-environment-configuration)
  * [Крок 10: Налаштування вашого домену](#step-10-configure-your-domain)
  * [Крок 11: Генерація SSL сертифікатів](#step-11-generate-ssl-certificates)
  * [Крок 12: Генерація ключів шифрування](#step-12-generate-encryption-keys)
  * [Крок 13: Оновлення шляхів SSL у конфігурації](#step-13-update-ssl-paths-in-configuration)
  * [Крок 14: Налаштування базової автентифікації](#step-14-set-up-basic-authentication)
  * [Крок 15: Розгортання за допомогою Docker Compose](#step-15-deploy-with-docker-compose)
  * [Крок 16: Перевірка встановлення](#step-16-verify-installation)
* [Післявстановлювальна конфігурація](#post-installation-configuration)
  * [Налаштування DNS записів](#dns-records-setup)
  * [Перший вхід](#first-login)
* [Конфігурація резервного копіювання](#backup-configuration)
  * [Налаштування резервного копіювання сумісного з S3](#set-up-s3-compatible-backup)
  * [Налаштування cron-завдань для резервного копіювання](#set-up-backup-cron-jobs)
* [Конфігурація автооновлення](#auto-update-configuration)
* [Обслуговування та моніторинг](#maintenance-and-monitoring)
  * [Розташування логів](#log-locations)
  * [Регулярні завдання з обслуговування](#regular-maintenance-tasks)
  * [Оновлення сертифікатів](#certificate-renewal)
* [Вирішення проблем](#troubleshooting)
  * [Поширені проблеми](#common-issues)
  * [Отримання допомоги](#getting-help)
* [Кращі практики безпеки](#security-best-practices)
* [Висновок](#conclusion)


## Огляд {#overview}

Цей посібник надає покрокові інструкції для встановлення самостійного рішення Forward Email на системах Ubuntu. Посібник спеціально адаптований для версій Ubuntu 20.04, 22.04 та 24.04 LTS.


## Вимоги {#prerequisites}

Перед початком встановлення переконайтеся, що у вас є:

* **Ubuntu Server**: 20.04, 22.04 або 24.04 LTS
* **Доступ root**: Ви повинні мати можливість виконувати команди від імені root (доступ sudo)
* **Доменне ім’я**: Домен, яким ви керуєте з доступом до управління DNS
* **Чистий сервер**: Рекомендується використовувати свіжу інсталяцію Ubuntu
* **Інтернет-з’єднання**: Потрібне для завантаження пакетів та образів Docker


## Системні вимоги {#system-requirements}

* **ОЗП**: Мінімум 2 ГБ (рекомендується 4 ГБ для продуктивного середовища)
* **Дисковий простір**: Мінімум 20 ГБ вільного місця (рекомендується 50 ГБ+ для продуктивного середовища)
* **ЦПУ**: Мінімум 1 віртуальний процесор (рекомендується 2+ віртуальних процесорів для продуктивного середовища)
* **Мережа**: Публічна IP-адреса з доступними наступними портами:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Покрокове встановлення {#step-by-step-installation}

### Крок 1: Початкове налаштування системи {#step-1-initial-system-setup}

Спочатку переконайтеся, що ваша система оновлена, і перейдіть до користувача root:

```bash
# Оновлення системних пакетів
sudo apt update && sudo apt upgrade -y

# Перехід до користувача root (потрібно для встановлення)
sudo su -
```

### Крок 2: Налаштування DNS резолверів {#step-2-configure-dns-resolvers}

Налаштуйте систему на використання DNS-серверів Cloudflare для надійної генерації сертифікатів:

```bash
# Зупинити та відключити systemd-resolved, якщо він запущений
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Налаштування DNS резолверів Cloudflare
tee /etc/resolv.conf > /dev/null <<EOF
nameserver 1.1.1.1
nameserver 2606:4700:4700::1111
nameserver 1.0.0.1
nameserver 2606:4700:4700::1001
nameserver 8.8.8.8
nameserver 2001:4860:4860::8888
nameserver 8.8.4.4
nameserver 2001:4860:4860::8844
EOF
```
### Крок 3: Встановлення системних залежностей {#step-3-install-system-dependencies}

Встановіть необхідні пакунки для Forward Email:

```bash
# Оновити список пакунків
apt-get update -y

# Встановити базові залежності
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Крок 4: Встановлення пакунків Snap {#step-4-install-snap-packages}

Встановіть AWS CLI та Certbot через snap:

```bash
# Встановити AWS CLI
snap install aws-cli --classic

# Встановити Certbot та плагін DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Крок 5: Встановлення Docker {#step-5-install-docker}

Встановіть Docker CE та Docker Compose:

```bash
# Додати офіційний GPG ключ Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Додати репозиторій Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Оновити індекс пакунків та встановити Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Перевірити встановлення Docker
docker --version
docker compose version
```

### Крок 6: Налаштування служби Docker {#step-6-configure-docker-service}

Переконайтеся, що Docker запускається автоматично і працює:

```bash
# Увімкнути та запустити службу Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Перевірити, що Docker працює
docker info
```

Якщо Docker не запускається, спробуйте запустити його вручну:

```bash
# Альтернативний спосіб запуску, якщо systemctl не працює
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Крок 7: Налаштування брандмауера {#step-7-configure-firewall}

Налаштуйте брандмауер UFW для захисту вашого сервера:

```bash
# Встановити політики за замовчуванням
ufw default deny incoming
ufw default allow outgoing

# Дозволити SSH (важливо - не заблокуйте себе!)
ufw allow 22/tcp

# Дозволити порти, пов’язані з електронною поштою
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (для Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (альтернативний порт)
ufw allow 2995/tcp  # POP3 (альтернативний порт)
ufw allow 3456/tcp  # Користувацький порт сервісу
ufw allow 4000/tcp  # Користувацький порт сервісу
ufw allow 5000/tcp  # Користувацький порт сервісу

# Дозволити локальні підключення до бази даних
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Увімкнути брандмауер
echo "y" | ufw enable

# Перевірити статус брандмауера
ufw status numbered
```

### Крок 8: Клонування репозиторію Forward Email {#step-8-clone-forward-email-repository}

Завантажте вихідний код Forward Email:

```bash
# Встановити змінні
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Клонувати репозиторій
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Перевірити успішність клонування
ls -la
```

### Крок 9: Підготовка конфігурації середовища {#step-9-set-up-environment-configuration}

Підготуйте конфігурацію середовища:

```bash
# Встановити змінні директорій
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Скопіювати файл конфігурації за замовчуванням
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Створити директорію SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Створити директорії для баз даних
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Крок 10: Налаштування вашого домену {#step-10-configure-your-domain}

Встановіть ім’я домену та оновіть змінні середовища:

```bash
# Замініть 'yourdomain.com' на ваш фактичний домен
DOMAIN="yourdomain.com"

# Функція для оновлення файлу середовища
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Оновити змінні середовища, пов’язані з доменом
update_env_file "DOMAIN" "$DOMAIN"
update_env_file "NODE_ENV" "production"
update_env_file "HTTP_PROTOCOL" "https"
update_env_file "WEB_HOST" "$DOMAIN"
update_env_file "WEB_PORT" "443"
update_env_file "CALDAV_HOST" "caldav.$DOMAIN"
update_env_file "CARDDAV_HOST" "carddav.$DOMAIN"
update_env_file "API_HOST" "api.$DOMAIN"
update_env_file "APP_NAME" "$DOMAIN"
update_env_file "SMTP_HOST" "smtp.$DOMAIN"
update_env_file "SMTP_PORT" "465"
update_env_file "IMAP_HOST" "imap.$DOMAIN"
update_env_file "IMAP_PORT" "993"
update_env_file "POP3_HOST" "pop3.$DOMAIN"
update_env_file "POP3_PORT" "995"
update_env_file "MX_HOST" "mx.$DOMAIN"
update_env_file "SMTP_EXCHANGE_DOMAINS" "mx.$DOMAIN"
update_env_file "SELF_HOSTED" "true"
update_env_file "WEBSITE_URL" "$DOMAIN"
update_env_file "AUTH_BASIC_ENABLED" "true"
```
### Крок 11: Генерація SSL сертифікатів {#step-11-generate-ssl-certificates}

#### Варіант A: Ручний DNS виклик (Рекомендовано для більшості користувачів) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Генерація сертифікатів за допомогою ручного DNS виклику
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Важливо**: Коли буде запитано, вам потрібно створити TXT записи у вашому DNS. Ви можете побачити кілька викликів для одного домену - **створіть ВСІ з них**. Не видаляйте перший TXT запис при додаванні другого.

#### Варіант B: Cloudflare DNS (Якщо ви використовуєте Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Якщо ваш домен використовує Cloudflare для DNS, ви можете автоматизувати генерацію сертифікатів:

```bash
# Створіть файл облікових даних Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Встановіть правильні права доступу
chmod 600 /root/.cloudflare.ini

# Автоматична генерація сертифікатів
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Копіювання сертифікатів {#copy-certificates}

Після генерації сертифікатів скопіюйте їх у директорію додатку:

```bash
# Копіювання сертифікатів у директорію SSL додатку
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Перевірка, що сертифікати скопійовані
ls -la "$SELF_HOST_DIR/ssl/"
```

### Крок 12: Генерація ключів шифрування {#step-12-generate-encryption-keys}

Створіть різні ключі шифрування, необхідні для безпечної роботи:

```bash
# Генерація допоміжного ключа шифрування
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Генерація секрету SRS для пересилання пошти
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Генерація TXT ключа шифрування
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Генерація приватного ключа DKIM для підписування пошти
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Генерація ключа підпису webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Встановлення пароля для SMTP транспорту
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Всі ключі шифрування успішно згенеровані"
```

### Крок 13: Оновлення шляхів SSL у конфігурації {#step-13-update-ssl-paths-in-configuration}

Налаштуйте шляхи до SSL сертифікатів у файлі середовища:

```bash
# Оновлення шляхів SSL для вказівки на правильні файли сертифікатів
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Крок 14: Налаштування базової автентифікації {#step-14-set-up-basic-authentication}

Створіть тимчасові облікові дані базової автентифікації:

```bash
# Генерація надійного випадкового пароля
PASSWORD=$(openssl rand -base64 16)

# Оновлення файлу середовища з обліковими даними базової автентифікації
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Відображення облікових даних (збережіть їх!)
echo ""
echo "🔐 ВАЖЛИВО: Збережіть ці облікові дані для входу!"
echo "=================================="
echo "Ім'я користувача: admin"
echo "Пароль: $PASSWORD"
echo "=================================="
echo ""
echo "Вони знадобляться для доступу до веб-інтерфейсу після встановлення."
echo ""
```

### Крок 15: Розгортання за допомогою Docker Compose {#step-15-deploy-with-docker-compose}

Запустіть усі сервіси Forward Email:

```bash
# Встановлення шляху до файлу Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Зупинка існуючих контейнерів
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Завантаження останніх образів
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Запуск усіх сервісів у фоновому режимі
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Зачекайте кілька секунд для запуску сервісів
sleep 10

# Перевірка статусу сервісів
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Крок 16: Перевірка встановлення {#step-16-verify-installation}

Переконайтеся, що всі сервіси працюють правильно:

```bash
# Перевірка контейнерів Docker
docker ps

# Перевірка логів сервісів на наявність помилок
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Тестування підключення до веб-інтерфейсу
curl -I https://$DOMAIN

# Перевірка, чи порти слухають
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Конфігурація після встановлення {#post-installation-configuration}

### Налаштування DNS-записів {#dns-records-setup}

Вам потрібно налаштувати наступні DNS-записи для вашого домену:

#### MX-запис {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-записи {#a-records}

```
@ A YOUR_SERVER_IP
mx A YOUR_SERVER_IP
smtp A YOUR_SERVER_IP
imap A YOUR_SERVER_IP
pop3 A YOUR_SERVER_IP
api A YOUR_SERVER_IP
caldav A YOUR_SERVER_IP
carddav A YOUR_SERVER_IP
```

#### SPF-запис {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-запис {#dkim-record}

Отримайте ваш публічний ключ DKIM:

```bash
# Витяг публічного ключа DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Створіть DKIM DNS-запис:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-запис {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Перший вхід {#first-login}

1. Відкрийте ваш веб-браузер і перейдіть за адресою `https://yourdomain.com`
2. Введіть облікові дані базової автентифікації, які ви зберегли раніше
3. Завершіть початковий майстер налаштувань
4. Створіть вашу першу електронну поштову скриньку


## Конфігурація резервного копіювання {#backup-configuration}

### Налаштування резервного копіювання, сумісного з S3 {#set-up-s3-compatible-backup}

Налаштуйте автоматичне резервне копіювання у сховище, сумісне з S3:

```bash
# Створення директорії для AWS облікових даних
mkdir -p ~/.aws

# Налаштування AWS облікових даних
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Налаштування параметрів AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Для не-AWS S3 (наприклад, Cloudflare R2) додайте URL кінцевої точки
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Налаштування cron-завдань для резервного копіювання {#set-up-backup-cron-jobs}

```bash
# Робимо скрипти резервного копіювання виконуваними
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Додаємо cron-завдання для резервного копіювання MongoDB (щоденно опівночі)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Додаємо cron-завдання для резервного копіювання Redis (щоденно опівночі)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Перевірка доданих cron-завдань
crontab -l
```


## Конфігурація автооновлення {#auto-update-configuration}

Налаштуйте автоматичне оновлення вашої установки Forward Email:

```bash
# Створення команди автооновлення
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Додаємо cron-завдання для автооновлення (щоденно о 1 годині ночі)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Перевірка доданого cron-завдання
crontab -l
```


## Обслуговування та моніторинг {#maintenance-and-monitoring}

### Розташування логів {#log-locations}

* **Логи Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Системні логи**: `/var/log/syslog`
* **Логи резервного копіювання**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Логи автооновлення**: `/var/log/autoupdate.log`

### Регулярні завдання з обслуговування {#regular-maintenance-tasks}

1. **Моніторинг вільного місця на диску**: `df -h`
2. **Перевірка стану сервісів**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Перегляд логів**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Оновлення системних пакетів**: `apt update && apt upgrade`
5. **Оновлення сертифікатів**: Сертифікати оновлюються автоматично, але слідкуйте за терміном дії

### Оновлення сертифікатів {#certificate-renewal}

Сертифікати мають оновлюватися автоматично, але ви можете оновити їх вручну за потреби:

```bash
# Ручне оновлення сертифікатів
certbot renew

# Копіювання оновлених сертифікатів
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Перезапуск сервісів для використання нових сертифікатів
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Усунення несправностей {#troubleshooting}

### Поширені проблеми {#common-issues}

#### 1. Служба Docker не запускається {#1-docker-service-wont-start}

```bash
# Перевірте статус Docker
systemctl status docker

# Спробуйте альтернативний запуск
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Помилка генерації сертифіката {#2-certificate-generation-fails}

* Переконайтеся, що порти 80 і 443 доступні
* Перевірте, що DNS-записи вказують на ваш сервер
* Перевірте налаштування брандмауера

#### 3. Проблеми з доставкою електронної пошти {#3-email-delivery-issues}

* Перевірте правильність MX-записів
* Перевірте записи SPF, DKIM і DMARC
* Переконайтеся, що порт 25 не заблокований вашим хостинг-провайдером

#### 4. Веб-інтерфейс недоступний {#4-web-interface-not-accessible}

* Перевірте налаштування брандмауера: `ufw status`
* Перевірте SSL-сертифікати: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Перевірте облікові дані базової автентифікації

### Отримання допомоги {#getting-help}

* **Документація**: <https://forwardemail.net/self-hosted>
* **Проблеми на GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Підтримка спільноти**: Перегляньте обговорення проекту на GitHub


## Найкращі практики безпеки {#security-best-practices}

1. **Підтримуйте систему в актуальному стані**: Регулярно оновлюйте Ubuntu та пакети
2. **Моніторинг журналів**: Налаштуйте моніторинг журналів та сповіщення
3. **Регулярне резервне копіювання**: Тестуйте процедури резервного копіювання та відновлення
4. **Використовуйте надійні паролі**: Генеруйте складні паролі для всіх облікових записів
5. **Увімкніть Fail2Ban**: Розгляньте можливість встановлення fail2ban для додаткового захисту
6. **Регулярні аудити безпеки**: Періодично переглядайте вашу конфігурацію


## Висновок {#conclusion}

Ваша самостійна інсталяція Forward Email тепер має бути завершена та працювати на Ubuntu. Не забудьте:

1. Правильно налаштувати DNS-записи
2. Перевірити відправлення та отримання електронної пошти
3. Налаштувати регулярне резервне копіювання
4. Регулярно моніторити систему
5. Підтримувати інсталяцію в актуальному стані

Для додаткових параметрів конфігурації та розширених функцій звертайтеся до офіційної документації Forward Email за адресою <https://forwardemail.net/self-hosted#configuration>.
