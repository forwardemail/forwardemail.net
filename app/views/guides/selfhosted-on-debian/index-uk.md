# Керівництво з встановлення Forward Email для самостійного хостингу на Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Зміст {#table-of-contents}

* [Огляд](#overview)
* [Вимоги](#prerequisites)
* [Системні вимоги](#system-requirements)
* [Покрокове встановлення](#step-by-step-installation)
  * [Крок 1: Початкове налаштування системи](#step-1-initial-system-setup)
  * [Крок 2: Налаштування DNS резолверів](#step-2-configure-dns-resolvers)
  * [Крок 3: Встановлення системних залежностей](#step-3-install-system-dependencies)
  * [Крок 4: Встановлення та налаштування Snapd](#step-4-install-and-configure-snapd)
  * [Крок 5: Встановлення Snap пакетів](#step-5-install-snap-packages)
  * [Крок 6: Встановлення Docker](#step-6-install-docker)
  * [Крок 7: Налаштування служби Docker](#step-7-configure-docker-service)
  * [Крок 8: Встановлення та налаштування брандмауера UFW](#step-8-install-and-configure-ufw-firewall)
  * [Крок 9: Клонування репозиторію Forward Email](#step-9-clone-forward-email-repository)
  * [Крок 10: Налаштування конфігурації середовища](#step-10-set-up-environment-configuration)
  * [Крок 11: Налаштування вашого домену](#step-11-configure-your-domain)
  * [Крок 12: Генерація SSL сертифікатів](#step-12-generate-ssl-certificates)
  * [Крок 13: Генерація ключів шифрування](#step-13-generate-encryption-keys)
  * [Крок 14: Оновлення шляхів SSL у конфігурації](#step-14-update-ssl-paths-in-configuration)
  * [Крок 15: Налаштування базової автентифікації](#step-15-set-up-basic-authentication)
  * [Крок 16: Розгортання за допомогою Docker Compose](#step-16-deploy-with-docker-compose)
  * [Крок 17: Перевірка встановлення](#step-17-verify-installation)
* [Післявстановлювальна конфігурація](#post-installation-configuration)
  * [Налаштування DNS записів](#dns-records-setup)
  * [Перший вхід](#first-login)
* [Конфігурація резервного копіювання](#backup-configuration)
  * [Налаштування резервного копіювання сумісного з S3](#set-up-s3-compatible-backup)
  * [Налаштування cron-завдань для резервного копіювання](#set-up-backup-cron-jobs)
* [Конфігурація автооновлення](#auto-update-configuration)
* [Особливості Debian](#debian-specific-considerations)
  * [Відмінності в управлінні пакетами](#package-management-differences)
  * [Управління службами](#service-management)
  * [Налаштування мережі](#network-configuration)
* [Обслуговування та моніторинг](#maintenance-and-monitoring)
  * [Розташування логів](#log-locations)
  * [Регулярні завдання з обслуговування](#regular-maintenance-tasks)
  * [Оновлення сертифікатів](#certificate-renewal)
* [Вирішення проблем](#troubleshooting)
  * [Проблеми специфічні для Debian](#debian-specific-issues)
  * [Поширені проблеми](#common-issues)
  * [Отримання допомоги](#getting-help)
* [Кращі практики безпеки](#security-best-practices)
* [Висновок](#conclusion)


## Огляд {#overview}

Цей посібник надає покрокові інструкції для встановлення самостійного рішення Forward Email на системах Debian. Цей посібник спеціально адаптований для Debian 11 (Bullseye) та Debian 12 (Bookworm).


## Вимоги {#prerequisites}

Перед початком встановлення переконайтеся, що у вас є:

* **Сервер Debian**: версія 11 (Bullseye) або 12 (Bookworm)
* **Доступ root**: Ви повинні мати можливість виконувати команди від імені root (доступ sudo)
* **Доменне ім’я**: домен, яким ви керуєте з доступом до управління DNS
* **Чистий сервер**: рекомендується використовувати свіжу інсталяцію Debian
* **Інтернет-з’єднання**: необхідне для завантаження пакетів та образів Docker


## Системні вимоги {#system-requirements}

* **ОЗП**: мінімум 2 ГБ (рекомендується 4 ГБ для продуктивного середовища)
* **Дисковий простір**: мінімум 20 ГБ вільного місця (рекомендується 50 ГБ і більше для продуктивного середовища)
* **ЦПУ**: мінімум 1 віртуальний CPU (рекомендується 2 і більше для продуктивного середовища)
* **Мережа**: публічна IP-адреса з доступними наступними портами:
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
# Оновлення пакетів системи
sudo apt update && sudo apt upgrade -y

# Перехід до користувача root (потрібно для встановлення)
sudo su -
```
### Крок 2: Налаштування DNS резолверів {#step-2-configure-dns-resolvers}

Налаштуйте вашу систему для використання DNS серверів Cloudflare для надійного генерування сертифікатів:

```bash
# Зупинити та відключити systemd-resolved, якщо він запущений
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Налаштувати DNS резолвери Cloudflare
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

Встановіть необхідні пакети для Forward Email на Debian:

```bash
# Оновити список пакетів
apt-get update -y

# Встановити базові залежності (список пакетів для Debian)
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    lsb-release \
    apt-transport-https \
    software-properties-common
```

### Крок 4: Встановлення та налаштування Snapd {#step-4-install-and-configure-snapd}

Debian за замовчуванням не містить snapd, тому потрібно його встановити та налаштувати:

```bash
# Встановити snapd
apt-get install -y snapd

# Увімкнути та запустити службу snapd
systemctl enable snapd
systemctl start snapd

# Створити символічне посилання для коректної роботи snap
ln -sf /var/lib/snapd/snap /snap

# Почекати, поки snapd буде готовий
sleep 10

# Перевірити роботу snapd
snap version
```

### Крок 5: Встановлення пакетів Snap {#step-5-install-snap-packages}

Встановіть AWS CLI та Certbot через snap:

```bash
# Встановити AWS CLI
snap install aws-cli --classic

# Встановити Certbot та плагін DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Перевірити встановлення
aws --version
certbot --version
```

### Крок 6: Встановлення Docker {#step-6-install-docker}

Встановіть Docker CE та Docker Compose на Debian:

```bash
# Додати офіційний GPG ключ Docker (для Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Додати репозиторій Docker (для Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Оновити індекс пакетів та встановити Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Встановити автономний docker-compose як запасний варіант (якщо плагін не працює)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Перевірити встановлення Docker
docker --version
docker compose version || docker-compose --version
```

### Крок 7: Налаштування служби Docker {#step-7-configure-docker-service}

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

### Крок 8: Встановлення та налаштування брандмауера UFW {#step-8-install-and-configure-ufw-firewall}

Мінімальні інсталяції Debian можуть не містити UFW, тому спочатку встановіть його:

```bash
# Встановити UFW, якщо він відсутній
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

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

# Дозволити локальні підключення до баз даних
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Увімкнути брандмауер
echo "y" | ufw enable

# Перевірити статус брандмауера
ufw status numbered
```
### Крок 9: Клонування репозиторію Forward Email {#step-9-clone-forward-email-repository}

Завантажте вихідний код Forward Email:

```bash
# Set up variables
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clone the repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verify the clone was successful
ls -la
```

### Крок 10: Налаштування конфігурації середовища {#step-10-set-up-environment-configuration}

Підготуйте конфігурацію середовища:

```bash
# Set up directory variables
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copy default environment file
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Create SSL directory
mkdir -p "$SELF_HOST_DIR/ssl"

# Create database directories
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Крок 11: Налаштуйте свій домен {#step-11-configure-your-domain}

Встановіть ім’я вашого домену та оновіть змінні середовища:

```bash
# Replace 'yourdomain.com' with your actual domain
DOMAIN="yourdomain.com"

# Function to update environment file
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Update domain-related environment variables
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

### Крок 12: Генерація SSL сертифікатів {#step-12-generate-ssl-certificates}

#### Варіант A: Ручний DNS виклик (Рекомендовано для більшості користувачів) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Важливо**: Коли буде запитано, вам потрібно створити TXT записи у вашому DNS. Ви можете побачити кілька викликів для одного домену — **створіть ВСІ з них**. Не видаляйте перший TXT запис при додаванні другого.

#### Варіант B: Cloudflare DNS (Якщо ви використовуєте Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Якщо ваш домен використовує Cloudflare для DNS, ви можете автоматизувати генерацію сертифікатів:

```bash
# Create Cloudflare credentials file
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Set proper permissions
chmod 600 /root/.cloudflare.ini

# Generate certificates automatically
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

Після генерації сертифікатів скопіюйте їх у директорію застосунку:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Крок 13: Генерація ключів шифрування {#step-13-generate-encryption-keys}

Створіть різні ключі шифрування, необхідні для безпечної роботи:

```bash
# Generate helper encryption key
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generate SRS secret for email forwarding
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generate TXT encryption key
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generate DKIM private key for email signing
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generate webhook signature key
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Set SMTP transport password
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Усі ключі шифрування успішно згенеровані"
```
### Крок 14: Оновлення шляхів SSL у конфігурації {#step-14-update-ssl-paths-in-configuration}

Налаштуйте шляхи до SSL-сертифікатів у файлі середовища:

```bash
# Оновіть шляхи SSL, щоб вказувати на правильні файли сертифікатів
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Крок 15: Налаштування базової автентифікації {#step-15-set-up-basic-authentication}

Створіть тимчасові облікові дані для базової автентифікації:

```bash
# Згенеруйте надійний випадковий пароль
PASSWORD=$(openssl rand -base64 16)

# Оновіть файл середовища обліковими даними базової автентифікації
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Відобразіть облікові дані (збережіть їх!)
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

### Крок 16: Розгортання за допомогою Docker Compose {#step-16-deploy-with-docker-compose}

Запустіть усі сервіси Forward Email:

```bash
# Встановіть шлях до файлу Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Зупиніть усі існуючі контейнери
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Завантажте останні образи
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Запустіть усі сервіси у фоновому режимі
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Зачекайте кілька секунд, щоб сервіси запустилися
sleep 10

# Перевірте статус сервісів
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Крок 17: Перевірка встановлення {#step-17-verify-installation}

Переконайтеся, що всі сервіси працюють правильно:

```bash
# Перевірте контейнери Docker
docker ps

# Перевірте логи сервісів на наявність помилок
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Перевірте підключення до веб-інтерфейсу
curl -I https://$DOMAIN

# Перевірте, чи порти слухають
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Післявстановлювальна конфігурація {#post-installation-configuration}

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
# Витягніть публічний ключ DKIM
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
4. Створіть вашу першу електронну скриньку


## Конфігурація резервного копіювання {#backup-configuration}

### Налаштування резервного копіювання, сумісного з S3 {#set-up-s3-compatible-backup}

Налаштуйте автоматичне резервне копіювання на сховище, сумісне з S3:

```bash
# Створіть каталог для облікових даних AWS
mkdir -p ~/.aws

# Налаштуйте облікові дані AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Налаштуйте параметри AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Для S3, не пов’язаного з AWS (наприклад, Cloudflare R2), додайте URL кінцевої точки
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Налаштування Cron-завдань для резервного копіювання {#set-up-backup-cron-jobs}

```bash
# Зробити скрипти резервного копіювання виконуваними
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Додати cron-завдання для резервного копіювання MongoDB (щоденно опівночі)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Додати cron-завдання для резервного копіювання Redis (щоденно опівночі)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Перевірити, що cron-завдання додані
crontab -l
```


## Налаштування автоматичного оновлення {#auto-update-configuration}

Налаштуйте автоматичне оновлення вашої інсталяції Forward Email:

```bash
# Створити команду автооновлення (використовуйте відповідну команду docker compose)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Додати cron-завдання для автооновлення (щоденно о 1 годині ночі)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Перевірити, що cron-завдання додане
crontab -l
```


## Особливості Debian {#debian-specific-considerations}

### Відмінності в управлінні пакетами {#package-management-differences}

* **Snapd**: За замовчуванням не встановлений у Debian, потребує ручної інсталяції
* **Docker**: Використовує репозиторії та GPG-ключі, специфічні для Debian
* **UFW**: Може бути відсутнім у мінімальних інсталяціях Debian
* **systemd**: Поведінка може дещо відрізнятися від Ubuntu

### Управління сервісами {#service-management}

```bash
# Перевірити статус сервісів (команди специфічні для Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Перезапустити сервіси за потреби
systemctl restart snapd
systemctl restart docker
```

### Налаштування мережі {#network-configuration}

У Debian можуть бути інші імена мережевих інтерфейсів або конфігурації:

```bash
# Перевірити мережеві інтерфейси
ip addr show

# Перевірити маршрутизацію
ip route show

# Перевірити розв’язання DNS
nslookup google.com
```


## Обслуговування та моніторинг {#maintenance-and-monitoring}

### Розташування логів {#log-locations}

* **Логи Docker Compose**: Використовуйте відповідну команду docker compose залежно від інсталяції
* **Системні логи**: `/var/log/syslog`
* **Логи резервного копіювання**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Логи автооновлення**: `/var/log/autoupdate.log`
* **Логи snapd**: `journalctl -u snapd`

### Регулярні завдання з обслуговування {#regular-maintenance-tasks}

1. **Моніторинг вільного місця на диску**: `df -h`
2. **Перевірка статусу сервісів**: Використовуйте відповідну команду docker compose
3. **Перегляд логів**: Перевіряйте як логи додатків, так і системні логи
4. **Оновлення системних пакетів**: `apt update && apt upgrade`
5. **Моніторинг snapd**: `snap list` та `snap refresh`

### Оновлення сертифікатів {#certificate-renewal}

Сертифікати мають оновлюватися автоматично, але ви можете оновити їх вручну за потреби:

```bash
# Ручне оновлення сертифікатів
certbot renew

# Копіювання оновлених сертифікатів
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Перезапуск сервісів для використання нових сертифікатів
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Вирішення проблем {#troubleshooting}

### Проблеми, специфічні для Debian {#debian-specific-issues}

#### 1. Snapd не працює {#1-snapd-not-working}

```bash
# Перевірити статус snapd
systemctl status snapd

# Перезапустити snapd
systemctl restart snapd

# Перевірити шлях snap
echo $PATH | grep snap

# Додати snap до PATH, якщо відсутній
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Команда Docker Compose не знайдена {#2-docker-compose-command-not-found}

```bash
# Перевірити, яка команда docker compose доступна
command -v docker-compose
command -v docker

# Використовувати відповідну команду у скриптах
if command -v docker-compose &> /dev/null; then
    echo "Використовується docker-compose"
else
    echo "Використовується docker compose"
fi
```
#### 3. Проблеми з встановленням пакетів {#3-package-installation-issues}

```bash
# Оновити кеш пакетів
apt update

# Виправити пошкоджені пакети
apt --fix-broken install

# Перевірити утримувані пакети
apt-mark showhold
```

### Поширені проблеми {#common-issues}

#### 1. Служба Docker не запускається {#1-docker-service-wont-start}

```bash
# Перевірити статус Docker
systemctl status docker

# Перевірити логи Docker
journalctl -u docker

# Спробувати альтернативний запуск
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Не вдається згенерувати сертифікат {#2-certificate-generation-fails}

* Переконайтеся, що порти 80 і 443 доступні
* Перевірте, що DNS-записи вказують на ваш сервер
* Перевірте налаштування брандмауера за допомогою `ufw status`

#### 3. Проблеми з доставкою електронної пошти {#3-email-delivery-issues}

* Перевірте правильність MX-записів
* Перевірте записи SPF, DKIM та DMARC
* Переконайтеся, що порт 25 не заблокований вашим хостинг-провайдером

### Отримання допомоги {#getting-help}

* **Документація**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Документація Debian**: <https://www.debian.org/doc/>


## Найкращі практики безпеки {#security-best-practices}

1. **Підтримуйте систему в актуальному стані**: Регулярно оновлюйте Debian та пакети
2. **Моніторинг логів**: Налаштуйте моніторинг логів та сповіщення
3. **Регулярне резервне копіювання**: Тестуйте процедури резервного копіювання та відновлення
4. **Використовуйте надійні паролі**: Генеруйте надійні паролі для всіх облікових записів
5. **Увімкніть Fail2Ban**: Розгляньте можливість встановлення fail2ban для додаткового захисту
6. **Регулярні аудити безпеки**: Періодично переглядайте вашу конфігурацію
7. **Моніторинг Snapd**: Підтримуйте snap-пакети в актуальному стані за допомогою `snap refresh`


## Висновок {#conclusion}

Ваша самостійна інсталяція Forward Email тепер має бути завершена та працювати на Debian. Не забудьте:

1. Правильно налаштувати DNS-записи
2. Перевірити відправлення та отримання електронної пошти
3. Налаштувати регулярне резервне копіювання
4. Регулярно моніторити систему
5. Підтримувати інсталяцію в актуальному стані
6. Моніторити snapd та snap-пакети

Основні відмінності від Ubuntu — це встановлення snapd та налаштування репозиторію Docker. Після їх правильного налаштування додаток Forward Email працює однаково на обох системах.

Для додаткових параметрів конфігурації та розширених функцій звертайтеся до офіційної документації Forward Email за адресою <https://forwardemail.net/self-hosted#configuration>.
