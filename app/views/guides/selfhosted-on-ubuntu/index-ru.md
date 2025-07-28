# Руководство по установке собственного хостинга для пересылки электронной почты для Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Содержание {#table-of-contents}

* [Обзор](#overview)
* [Предпосылки](#prerequisites)
* [Системные требования](#system-requirements)
* [Пошаговая установка](#step-by-step-installation)
  * [Шаг 1: Начальная настройка системы](#step-1-initial-system-setup)
  * [Шаг 2: Настройка DNS-резолверов](#step-2-configure-dns-resolvers)
  * [Шаг 3: Установка системных зависимостей](#step-3-install-system-dependencies)
  * [Шаг 4: Установка Snap-пакетов](#step-4-install-snap-packages)
  * [Шаг 5: Установка Docker](#step-5-install-docker)
  * [Шаг 6: Настройка службы Docker](#step-6-configure-docker-service)
  * [Шаг 7: Настройка брандмауэра](#step-7-configure-firewall)
  * [Шаг 8: Клонирование репозитория пересылаемой электронной почты](#step-8-clone-forward-email-repository)
  * [Шаг 9: Настройка конфигурации среды](#step-9-set-up-environment-configuration)
  * [Шаг 10: Настройте свой домен](#step-10-configure-your-domain)
  * [Шаг 11: Создание SSL-сертификатов](#step-11-generate-ssl-certificates)
  * [Шаг 12: Генерация ключей шифрования](#step-12-generate-encryption-keys)
  * [Шаг 13: Обновите пути SSL в конфигурации](#step-13-update-ssl-paths-in-configuration)
  * [Шаг 14: Настройте базовую аутентификацию](#step-14-set-up-basic-authentication)
  * [Шаг 15: Развертывание с помощью Docker Compose](#step-15-deploy-with-docker-compose)
  * [Шаг 16: Проверка установки](#step-16-verify-installation)
* [Конфигурация после установки](#post-installation-configuration)
  * [Настройка записей DNS](#dns-records-setup)
  * [Первый вход](#first-login)
* [Резервная конфигурация](#backup-configuration)
  * [Настройте резервное копирование, совместимое с S3](#set-up-s3-compatible-backup)
  * [Настройка заданий Cron для резервного копирования](#set-up-backup-cron-jobs)
* [Конфигурация автоматического обновления](#auto-update-configuration)
* [Техническое обслуживание и мониторинг](#maintenance-and-monitoring)
  * [Расположение журналов](#log-locations)
  * [Регулярные задачи по техническому обслуживанию](#regular-maintenance-tasks)
  * [Продление сертификата](#certificate-renewal)
* [Поиск неисправностей](#troubleshooting)
  * [Распространенные проблемы](#common-issues)
  * [Получение помощи](#getting-help)
* [Лучшие практики безопасности](#security-best-practices)
* [Заключение](#conclusion)

## Обзор {#overview}

Это руководство содержит пошаговые инструкции по установке решения Forward Email на системах Ubuntu. Это руководство специально разработано для версий Ubuntu 20.04, 22.04 и 24.04 LTS.

## Предпосылки {#prerequisites}

Перед началом установки убедитесь, что у вас есть:

* **Ubuntu Server**: 20.04, 22.04 или 24.04 LTS
* **Root Access**: вы должны иметь возможность запускать команды как root (доступ sudo)
* **Domain Name**: домен, который вы контролируете с помощью доступа к управлению DNS
* **Clean Server**: рекомендуется использовать новую установку Ubuntu
* **Internet Connection**: требуется для загрузки пакетов и образов Docker

## Системные требования {#system-requirements}

* **RAM**: минимум 2 ГБ (рекомендуется 4 ГБ для производства)
* **Storage**: минимум 20 ГБ доступного пространства (рекомендуется 50 ГБ+ для производства)
* **CPU**: минимум 1 vCPU (рекомендуется 2+ vCPU для производства)
* **Network**: публичный IP-адрес со следующими доступными портами:
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

### Шаг 2: Настройте DNS-резолверы {#step-2-configure-dns-resolvers}

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

Установите необходимые пакеты для пересылки электронной почты:

```bash
# Update package list
apt-get update -y

# Install basic dependencies
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Шаг 4: Установка пакетов Snap {#step-4-install-snap-packages}

Установите AWS CLI и Certbot с помощью snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Шаг 5: Установка Docker {#step-5-install-docker}

Установите Docker CE и Docker Compose:

```bash
# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update package index and install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify Docker installation
docker --version
docker compose version
```

### Шаг 6: Настройте службу Docker {#step-6-configure-docker-service}

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

### Шаг 7: Настройте брандмауэр {#step-7-configure-firewall}

Настройте брандмауэр UFW для защиты вашего сервера:

```bash
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

### Шаг 8: Клонирование репозитория пересылки электронной почты {#step-8-clone-forward-email-repository}

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

### Шаг 9: Настройка конфигурации среды {#step-9-set-up-environment-configuration}

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

### Шаг 10: Настройте свой домен {#step-10-configure-your-domain}

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

### Шаг 11: Создание SSL-сертификатов {#step-11-generate-ssl-certificates}

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

**Важно**: при появлении запроса вам нужно будет создать записи TXT в DNS. Вы можете увидеть несколько проблем для одного и того же домена — **создайте ВСЕ из них**. Не удаляйте первую запись TXT при добавлении второй.

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

После генерации сертификата скопируйте их в каталог приложения:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Шаг 12: Генерация ключей шифрования {#step-12-generate-encryption-keys}

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

### Шаг 13: Обновите пути SSL в конфигурации {#step-13-update-ssl-paths-in-configuration}

Настройте пути сертификатов SSL в файле среды:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Шаг 14: Настройка базовой аутентификации {#step-14-set-up-basic-authentication}

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

### Шаг 15: Развертывание с помощью Docker Compose {#step-15-deploy-with-docker-compose}

Запустите все службы пересылки электронной почты:

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop any existing containers
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Pull the latest images
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Start all services in detached mode
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Wait a moment for services to start
sleep 10

# Check service status
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```

### Шаг 16: Проверка установки {#step-16-verify-installation}

Проверьте, что все службы работают правильно:

```bash
# Check Docker containers
docker ps

# Check service logs for any errors
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Test web interface connectivity
curl -I https://$DOMAIN

# Check if ports are listening
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```

## Конфигурация после установки {#post-installation-configuration}

### Настройка записей DNS {#dns-records-setup}

Вам необходимо настроить следующие записи DNS для вашего домена:

#### Запись MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Записи A {#a-records}

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

Получите свой открытый ключ DKIM:

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

1. Откройте веб-браузер и перейдите к `https://yourdomain.com`
2. Введите базовые учетные данные аутентификации, которые вы сохранили ранее
3. Завершите работу мастера начальной настройки
4. Создайте свою первую учетную запись электронной почты

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
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Техническое обслуживание и мониторинг {#maintenance-and-monitoring}

### Расположение журналов {#log-locations}

* **Журналы Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Системные журналы**: `/var/log/syslog`
* **Журналы резервного копирования**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Журналы автоматического обновления**: `/var/log/autoupdate.log`

### Регулярные задачи по обслуживанию {#regular-maintenance-tasks}

1. **Мониторинг дискового пространства**: `df -h`
2. **Проверка состояния службы**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Просмотр журналов**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Обновление системных пакетов**: `apt update && apt upgrade`
5. **Обновление сертификатов**: Сертификаты автоматически обновляются, но отслеживают истечение срока действия

### Продление сертификата {#certificate-renewal}

Сертификаты должны обновляться автоматически, но при необходимости вы можете обновить их вручную:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Устранение неполадок {#troubleshooting}

### Распространенные проблемы {#common-issues}

#### 1. Служба Docker не запускается {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Сбой создания сертификата {#2-certificate-generation-fails}

* Убедитесь, что порты 80 и 443 доступны
* Убедитесь, что записи DNS указывают на ваш сервер
* Проверьте настройки брандмауэра

#### 3. Проблемы с доставкой электронной почты {#3-email-delivery-issues}

* Проверьте правильность записей MX
* Проверьте записи SPF, DKIM и DMARC
* Убедитесь, что порт 25 не заблокирован вашим хостинг-провайдером

#### 4. Веб-интерфейс недоступен {#4-web-interface-not-accessible}

* Проверьте настройки брандмауэра: `ufw status`
* Проверьте SSL-сертификаты: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Проверьте основные учетные данные аутентификации

### Получение помощи {#getting-help}

* **Документация**: <https://forwardemail.net/self-hosted>
* **Проблемы GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Поддержка сообщества**: Посетите обсуждения проекта на GitHub

## Рекомендации по обеспечению безопасности {#security-best-practices}

1. **Обновляйте систему**: регулярно обновляйте Ubuntu и пакеты
2. **Мониторинг журналов**: настройте мониторинг и оповещение журналов
3. **Регулярное резервное копирование**: тестируйте процедуры резервного копирования и восстановления
4. **Используйте надежные пароли**: создавайте надежные пароли для всех учетных записей
5. **Включите Fail2Ban**: рассмотрите возможность установки fail2ban для дополнительной безопасности
6. **Регулярные проверки безопасности**: периодически проверяйте свою конфигурацию

## Заключение {#conclusion}

Ваша самостоятельная установка Forward Email теперь должна быть завершена и запущена на Ubuntu. Не забудьте:

1. Правильно настройте записи DNS
2. Проверьте отправку и получение электронной почты
3. Настройте регулярное резервное копирование
4. Регулярно контролируйте свою систему
5. Поддерживайте актуальность установки

Дополнительные параметры конфигурации и расширенные функции см. в официальной документации по пересылке электронной почты по адресу <https://forwardemail.net/self-hosted#configuration>.