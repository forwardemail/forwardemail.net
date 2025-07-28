# Руководство по установке собственного хостинга для пересылки электронной почты для Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Содержание {#table-of-contents}

* [Обзор](#overview)
* [Предпосылки](#prerequisites)
* [Системные требования](#system-requirements)
* [Пошаговая установка](#step-by-step-installation)
  * [Шаг 1: Первоначальная настройка системы](#step-1-initial-system-setup)
  * [Шаг 2: Настройка DNS-резолверов](#step-2-configure-dns-resolvers)
  * [Шаг 3: Установка системных зависимостей](#step-3-install-system-dependencies)
  * [Шаг 4: Установка и настройка Snapd](#step-4-install-and-configure-snapd)
  * [Шаг 5: Установка пакетов Snap](#step-5-install-snap-packages)
  * [Шаг 6: Установка Docker](#step-6-install-docker)
  * [Шаг 7: Настройка службы Docker](#step-7-configure-docker-service)
  * [Шаг 8: Установка и настройка брандмауэра UFW](#step-8-install-and-configure-ufw-firewall)
  * [Шаг 9: Клонирование репозитория пересылаемой электронной почты](#step-9-clone-forward-email-repository)
  * [Шаг 10: Настройка конфигурации среды](#step-10-set-up-environment-configuration)
  * [Шаг 11: Настройте свой домен](#step-11-configure-your-domain)
  * [Шаг 12: Создание SSL-сертификатов](#step-12-generate-ssl-certificates)
  * [Шаг 13: Генерация ключей шифрования](#step-13-generate-encryption-keys)
  * [Шаг 14: Обновите пути SSL в конфигурации](#step-14-update-ssl-paths-in-configuration)
  * [Шаг 15: Настройте базовую аутентификацию](#step-15-set-up-basic-authentication)
  * [Шаг 16: Развертывание с помощью Docker Compose](#step-16-deploy-with-docker-compose)
  * [Шаг 17: Проверка установки](#step-17-verify-installation)
* [Конфигурация после установки](#post-installation-configuration)
  * [Настройка записей DNS](#dns-records-setup)
  * [Первый вход в систему](#first-login)
* [Резервная конфигурация](#backup-configuration)
  * [Настройте резервное копирование, совместимое с S3](#set-up-s3-compatible-backup)
  * [Настройка заданий Cron для резервного копирования](#set-up-backup-cron-jobs)
* [Конфигурация автоматического обновления](#auto-update-configuration)
* [Особенности Debian](#debian-specific-considerations)
  * [Различия в управлении пакетами](#package-management-differences)
  * [Управление услугами](#service-management)
  * [Конфигурация сети](#network-configuration)
* [Техническое обслуживание и мониторинг](#maintenance-and-monitoring)
  * [Расположение журналов](#log-locations)
  * [Регулярные задачи по техническому обслуживанию](#regular-maintenance-tasks)
  * [Продление сертификата](#certificate-renewal)
* [Поиск неисправностей](#troubleshooting)
  * [Проблемы, специфичные для Debian](#debian-specific-issues)
  * [Распространенные проблемы](#common-issues)
  * [Получение помощи](#getting-help)
* [Лучшие практики обеспечения безопасности](#security-best-practices)
* [Заключение](#conclusion)

## Обзор {#overview}

Это руководство содержит пошаговые инструкции по установке решения Forward Email на системах Debian. Оно специально разработано для Debian 11 (Bullseye) и Debian 12 (Bookworm).

## Предпосылки {#prerequisites}

Перед началом установки убедитесь, что у вас есть:

* **Сервер Debian**: версии 11 (Bullseye) или 12 (Bookworm)
* **Доступ с правами root**: необходимо иметь возможность выполнять команды от имени root (доступ sudo).
* **Имя домена**: домен, которым вы управляете с помощью доступа к управлению DNS.
* **Чистый сервер**: рекомендуется использовать новую установку Debian.
* **Подключение к Интернету**: требуется для загрузки пакетов и образов Docker.

## Системные требования {#system-requirements}

* **ОЗУ**: минимум 2 ГБ (рекомендуется 4 ГБ для продакшена)
* **Хранилище**: минимум 20 ГБ свободного места (рекомендуется более 50 ГБ для продакшена)
* **ЦП**: минимум 1 виртуальный ЦП (рекомендуется более 2 виртуальных ЦП для продакшена)
* **Сеть**: публичный IP-адрес со следующими доступными портами:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Пошаговая установка {#step-by-step-installation}

### Шаг 1: Начальная настройка системы {#step-1-initial-system-setup}

Сначала убедитесь, что ваша система обновлена, и переключитесь на пользователя root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Шаг 2: Настройка DNS-резолверов {#step-2-configure-dns-resolvers}

Настройте свою систему на использование DNS-серверов Cloudflare для надежной генерации сертификатов:

```bash
# Stop and disable systemd-resolved if running
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configure Cloudflare DNS resolvers
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

### Шаг 3: Установка системных зависимостей {#step-3-install-system-dependencies}

Установите необходимые пакеты для пересылки электронной почты в Debian:

```bash
# Update package list
apt-get update -y

# Install basic dependencies (Debian-specific package list)
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

### Шаг 4: Установка и настройка Snapd {#step-4-install-and-configure-snapd}

В Debian snapd по умолчанию не включен, поэтому нам необходимо установить и настроить его:

```bash
# Install snapd
apt-get install -y snapd

# Enable and start snapd service
systemctl enable snapd
systemctl start snapd

# Create symlink for snap to work properly
ln -sf /var/lib/snapd/snap /snap

# Wait for snapd to be ready
sleep 10

# Verify snapd is working
snap version
```

### Шаг 5: Установка пакетов Snap {#step-5-install-snap-packages}

Установите AWS CLI и Certbot с помощью snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verify installations
aws --version
certbot --version
```

### Шаг 6: Установка Docker {#step-6-install-docker}

Установка Docker CE и Docker Compose в Debian:

```bash
# Add Docker's official GPG key (Debian-specific)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository (Debian-specific)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update package index and install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install standalone docker-compose as fallback (if plugin doesn't work)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verify Docker installation
docker --version
docker compose version || docker-compose --version
```

### Шаг 7: Настройка службы Docker {#step-7-configure-docker-service}

Убедитесь, что Docker запускается автоматически и работает:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Если Docker не запускается, попробуйте запустить его вручную:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Шаг 8: Установка и настройка брандмауэра UFW {#step-8-install-and-configure-ufw-firewall}

Минимальные установки Debian могут не включать UFW, поэтому сначала установите его:

```bash
# Install UFW if not present
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow email-related ports
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (for Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternative port)
ufw allow 2995/tcp  # POP3 (alternative port)
ufw allow 3456/tcp  # Custom service port
ufw allow 4000/tcp  # Custom service port
ufw allow 5000/tcp  # Custom service port

# Allow local database connections
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Enable firewall
echo "y" | ufw enable

# Check firewall status
ufw status numbered
```

### Шаг 9: Клонирование репозитория пересылки электронной почты {#step-9-clone-forward-email-repository}

Загрузите исходный код пересылки электронной почты:

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

### Шаг 10: Настройка конфигурации среды {#step-10-set-up-environment-configuration}

Подготовьте конфигурацию среды:

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

### Шаг 11: Настройте свой домен {#step-11-configure-your-domain}

Задайте имя домена и обновите переменные среды:

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

### Шаг 12: Создание SSL-сертификатов {#step-12-generate-ssl-certificates}

#### Вариант A: Ручной вызов DNS (рекомендуется для большинства пользователей) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Важно**: При появлении запроса вам потребуется создать TXT-записи в DNS. Для одного и того же домена может появиться несколько запросов — **создайте их ВСЕ**. Не удаляйте первую TXT-запись при добавлении второй.

#### Вариант B: Cloudflare DNS (если вы используете Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Если ваш домен использует Cloudflare для DNS, вы можете автоматизировать генерацию сертификатов:

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

#### Копировать сертификаты {#copy-certificates}

После генерации сертификатов скопируйте их в каталог приложения:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Шаг 13: Генерация ключей шифрования {#step-13-generate-encryption-keys}

Создайте различные ключи шифрования, необходимые для безопасной работы:

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

echo "✅ All encryption keys generated successfully"
```

### Шаг 14: Обновите пути SSL в конфигурации {#step-14-update-ssl-paths-in-configuration}

Настройте пути SSL-сертификатов в файле среды:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Шаг 15: Настройка базовой аутентификации {#step-15-set-up-basic-authentication}

Создайте временные базовые учетные данные аутентификации:

```bash
# Generate a secure random password
PASSWORD=$(openssl rand -base64 16)

# Update environment file with basic auth credentials
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Display credentials (save these!)
echo ""
echo "🔐 IMPORTANT: Save these login credentials!"
echo "=================================="
echo "Username: admin"
echo "Password: $PASSWORD"
echo "=================================="
echo ""
echo "You'll need these to access the web interface after installation."
echo ""
```

### Шаг 16: Развертывание с помощью Docker Compose {#step-16-deploy-with-docker-compose}

Запустите все службы пересылки электронной почты:

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop any existing containers
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Pull the latest images
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Start all services in detached mode
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Wait a moment for services to start
sleep 10

# Check service status
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Шаг 17: Проверка установки {#step-17-verify-installation}

Проверьте, что все службы работают правильно:

```bash
# Check Docker containers
docker ps

# Check service logs for any errors
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Test web interface connectivity
curl -I https://$DOMAIN

# Check if ports are listening
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```

## Конфигурация после установки {#post-installation-configuration}

### Настройка записей DNS {#dns-records-setup}

Вам необходимо настроить следующие записи DNS для вашего домена:

#### MX-запись {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Записи {#a-records}

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

#### Запись SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Запись DKIM {#dkim-record}

Получите ваш открытый ключ DKIM:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Создайте DNS-запись DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Запись DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Первый вход {#first-login}

1. Откройте веб-браузер и перейдите в папку `https://yourdomain.com`.
2. Введите ранее сохраненные базовые учетные данные для аутентификации.
3. Завершите работу мастера первоначальной настройки.
4. Создайте свою первую учетную запись электронной почты.

## Конфигурация резервного копирования {#backup-configuration}

### Настройка резервного копирования, совместимого с S3 {#set-up-s3-compatible-backup}

Настройте автоматическое резервное копирование на S3-совместимое хранилище:

```bash
# Create AWS credentials directory
mkdir -p ~/.aws

# Configure AWS credentials
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configure AWS settings
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# For non-AWS S3 (like Cloudflare R2), add endpoint URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Настройка заданий Cron для резервного копирования {#set-up-backup-cron-jobs}

```bash
# Make backup scripts executable
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Add MongoDB backup cron job (runs daily at midnight)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Add Redis backup cron job (runs daily at midnight)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verify cron jobs were added
crontab -l
```

## Конфигурация автоматического обновления {#auto-update-configuration}

Настройте автоматические обновления для вашей установки пересылки электронной почты:

```bash
# Create auto-update command (use appropriate docker compose command)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Особенности Debian {#debian-specific-considerations}

### Различия в управлении пакетами {#package-management-differences}

* **Snapd**: Не устанавливается по умолчанию в Debian, требуется ручная установка.
* **Docker**: Использует специфичные для Debian репозитории и ключи GPG.
* **UFW**: Может не входить в минимальную установку Debian.
* **systemd**: Поведение может немного отличаться от Ubuntu.

### Управление службами {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Конфигурация сети {#network-configuration}

В Debian могут быть разные имена или конфигурации сетевых интерфейсов:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Техническое обслуживание и мониторинг {#maintenance-and-monitoring}

### Расположение журналов {#log-locations}

* **Логи Docker Compose**: используйте соответствующую команду Docker Compose в зависимости от установки.
* **Системные журналы**: `/var/log/syslog`
* **Журналы резервного копирования**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Журналы автообновления**: `/var/log/autoupdate.log`
* **Журналы Snapd**: `journalctl -u snapd`

### Регулярные задачи по обслуживанию {#regular-maintenance-tasks}

1. **Мониторинг дискового пространства**: `df -h`
2. **Проверка состояния службы**: Используйте соответствующую команду docker compose
3. **Просмотр журналов**: Проверьте журналы приложений и системные журналы
4. **Обновление системных пакетов**: `apt update && apt upgrade`
5. **Мониторинг snapd**: `snap list` и `snap refresh`

### Продление сертификата {#certificate-renewal}

Сертификаты должны обновляться автоматически, но при необходимости вы можете обновить их вручную:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```

## Устранение неполадок {#troubleshooting}

### Проблемы, специфичные для Debian {#debian-specific-issues}

#### 1. Snapd не работает {#1-snapd-not-working}

```bash
# Check snapd status
systemctl status snapd

# Restart snapd
systemctl restart snapd

# Check snap path
echo $PATH | grep snap

# Add snap to PATH if missing
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Команда Docker Compose не найдена {#2-docker-compose-command-not-found}

```bash
# Check which docker compose command is available
command -v docker-compose
command -v docker

# Use the appropriate command in scripts
if command -v docker-compose &> /dev/null; then
    echo "Using docker-compose"
else
    echo "Using docker compose"
fi
```

#### 3. Проблемы с установкой пакета {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Распространенные проблемы {#common-issues}

#### 1. Служба Docker не запускается {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Сбой генерации сертификата {#2-certificate-generation-fails}

* Убедитесь, что порты 80 и 443 доступны.
* Убедитесь, что записи DNS указывают на ваш сервер.
* Проверьте настройки брандмауэра с помощью `ufw status`.

#### 3. Проблемы с доставкой электронной почты {#3-email-delivery-issues}

* Проверьте правильность записей MX
* Проверьте записи SPF, DKIM и DMARC
* Убедитесь, что порт 25 не заблокирован вашим хостинг-провайдером

### Получение помощи {#getting-help}

* **Документация**: <https://forwardemail.net/self-hosted>
* **Проблемы GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Документация Debian**: <https://www.debian.org/doc/>

## Рекомендации по безопасности {#security-best-practices}

1. **Обновляйте систему**: Регулярно обновляйте Debian и пакеты.
2. **Мониторинг журналов**: Настройте мониторинг журналов и оповещения.
3. **Регулярное резервное копирование**: Тестируйте процедуры резервного копирования и восстановления.
4. **Используйте надёжные пароли**: Создавайте надёжные пароли для всех учётных записей.
5. **Включите Fail2Ban**: Рассмотрите возможность установки fail2ban для дополнительной безопасности.
6. **Регулярные аудиты безопасности**: Периодически проверяйте свою конфигурацию.
7. **Мониторинг Snapd**: Обновляйте пакеты Snap с помощью `snap refresh`.

## Заключение {#conclusion}

Ваша собственная установка Forward Email теперь должна быть завершена и работать на Debian. Не забудьте:

1. Правильно настройте записи DNS.
2. Проверьте отправку и получение электронной почты.
3. Настройте регулярное резервное копирование.
4. Регулярно проверяйте систему.
5. Регулярно обновляйте установленную систему.
6. Контролируйте пакеты snapd и snap.

Основные отличия от Ubuntu заключаются в установке snapd и настройке репозитория Docker. После их правильной настройки приложение Forward Email работает одинаково в обеих системах.

Дополнительные параметры конфигурации и расширенные функции см. в официальной документации по пересылке электронной почты по адресу <https://forwardemail.net/self-hosted#configuration>.