# Руководство по установке Forward Email для самостоятельного хостинга на Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Содержание {#table-of-contents}

* [Обзор](#overview)
* [Требования](#prerequisites)
* [Системные требования](#system-requirements)
* [Пошаговая установка](#step-by-step-installation)
  * [Шаг 1: Начальная настройка системы](#step-1-initial-system-setup)
  * [Шаг 2: Настройка DNS-резолверов](#step-2-configure-dns-resolvers)
  * [Шаг 3: Установка системных зависимостей](#step-3-install-system-dependencies)
  * [Шаг 4: Установка и настройка Snapd](#step-4-install-and-configure-snapd)
  * [Шаг 5: Установка пакетов Snap](#step-5-install-snap-packages)
  * [Шаг 6: Установка Docker](#step-6-install-docker)
  * [Шаг 7: Настройка службы Docker](#step-7-configure-docker-service)
  * [Шаг 8: Установка и настройка брандмауэра UFW](#step-8-install-and-configure-ufw-firewall)
  * [Шаг 9: Клонирование репозитория Forward Email](#step-9-clone-forward-email-repository)
  * [Шаг 10: Настройка конфигурации окружения](#step-10-set-up-environment-configuration)
  * [Шаг 11: Настройка вашего домена](#step-11-configure-your-domain)
  * [Шаг 12: Генерация SSL-сертификатов](#step-12-generate-ssl-certificates)
  * [Шаг 13: Генерация ключей шифрования](#step-13-generate-encryption-keys)
  * [Шаг 14: Обновление путей SSL в конфигурации](#step-14-update-ssl-paths-in-configuration)
  * [Шаг 15: Настройка базовой аутентификации](#step-15-set-up-basic-authentication)
  * [Шаг 16: Развертывание с помощью Docker Compose](#step-16-deploy-with-docker-compose)
  * [Шаг 17: Проверка установки](#step-17-verify-installation)
* [Конфигурация после установки](#post-installation-configuration)
  * [Настройка DNS-записей](#dns-records-setup)
  * [Первый вход](#first-login)
* [Резервное копирование](#backup-configuration)
  * [Настройка резервного копирования, совместимого с S3](#set-up-s3-compatible-backup)
  * [Настройка cron-задач для резервного копирования](#set-up-backup-cron-jobs)
* [Настройка автообновления](#auto-update-configuration)
* [Особенности Debian](#debian-specific-considerations)
  * [Отличия в управлении пакетами](#package-management-differences)
  * [Управление службами](#service-management)
  * [Настройка сети](#network-configuration)
* [Обслуживание и мониторинг](#maintenance-and-monitoring)
  * [Расположение логов](#log-locations)
  * [Регулярные задачи обслуживания](#regular-maintenance-tasks)
  * [Обновление сертификатов](#certificate-renewal)
* [Устранение неполадок](#troubleshooting)
  * [Проблемы, специфичные для Debian](#debian-specific-issues)
  * [Распространённые проблемы](#common-issues)
  * [Получение помощи](#getting-help)
* [Рекомендации по безопасности](#security-best-practices)
* [Заключение](#conclusion)


## Обзор {#overview}

Это руководство содержит пошаговые инструкции по установке решения Forward Email для самостоятельного хостинга на системах Debian. Руководство специально адаптировано для Debian 11 (Bullseye) и Debian 12 (Bookworm).


## Требования {#prerequisites}

Перед началом установки убедитесь, что у вас есть:

* **Сервер Debian**: версия 11 (Bullseye) или 12 (Bookworm)
* **Доступ root**: возможность выполнять команды от имени root (доступ через sudo)
* **Доменное имя**: домен, которым вы управляете с доступом к настройкам DNS
* **Чистый сервер**: рекомендуется использовать свежую установку Debian
* **Подключение к интернету**: необходимо для загрузки пакетов и образов Docker


## Системные требования {#system-requirements}

* **ОЗУ**: минимум 2 ГБ (рекомендуется 4 ГБ для продакшена)
* **Хранилище**: минимум 20 ГБ свободного места (рекомендуется 50 ГБ и более для продакшена)
* **ЦПУ**: минимум 1 виртуальное ядро (рекомендуется 2 и более для продакшена)
* **Сеть**: публичный IP-адрес с доступными следующими портами:
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
# Обновление системных пакетов
sudo apt update && sudo apt upgrade -y

# Переключение на пользователя root (требуется для установки)
sudo su -
```
### Шаг 2: Настройка DNS-резолверов {#step-2-configure-dns-resolvers}

Настройте вашу систему на использование DNS-серверов Cloudflare для надежной генерации сертификатов:

```bash
# Остановить и отключить systemd-resolved, если он запущен
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Настроить DNS-резолверы Cloudflare
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

Установите необходимые пакеты для Forward Email на Debian:

```bash
# Обновить список пакетов
apt-get update -y

# Установить базовые зависимости (список пакетов для Debian)
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

В Debian snapd не установлен по умолчанию, поэтому его нужно установить и настроить:

```bash
# Установить snapd
apt-get install -y snapd

# Включить и запустить службу snapd
systemctl enable snapd
systemctl start snapd

# Создать символическую ссылку для корректной работы snap
ln -sf /var/lib/snapd/snap /snap

# Подождать, пока snapd будет готов
sleep 10

# Проверить работу snapd
snap version
```

### Шаг 5: Установка пакетов Snap {#step-5-install-snap-packages}

Установите AWS CLI и Certbot через snap:

```bash
# Установить AWS CLI
snap install aws-cli --classic

# Установить Certbot и плагин DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Проверить установки
aws --version
certbot --version
```

### Шаг 6: Установка Docker {#step-6-install-docker}

Установите Docker CE и Docker Compose на Debian:

```bash
# Добавить официальный GPG-ключ Docker (для Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Добавить репозиторий Docker (для Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Обновить индекс пакетов и установить Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Установить standalone docker-compose на случай, если плагин не работает
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Проверить установку Docker
docker --version
docker compose version || docker-compose --version
```

### Шаг 7: Настройка службы Docker {#step-7-configure-docker-service}

Убедитесь, что Docker запускается автоматически и работает:

```bash
# Включить и запустить службу Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Проверить, что Docker работает
docker info
```

Если Docker не запускается, попробуйте запустить его вручную:

```bash
# Альтернативный способ запуска, если systemctl не работает
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Шаг 8: Установка и настройка брандмауэра UFW {#step-8-install-and-configure-ufw-firewall}

Минимальные установки Debian могут не включать UFW, поэтому сначала установите его:

```bash
# Установить UFW, если он отсутствует
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Установить политики по умолчанию
ufw default deny incoming
ufw default allow outgoing

# Разрешить SSH (важно — не заблокируйте себя!)
ufw allow 22/tcp

# Разрешить порты, связанные с электронной почтой
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (для Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (альтернативный порт)
ufw allow 2995/tcp  # POP3 (альтернативный порт)
ufw allow 3456/tcp  # Пользовательский порт сервиса
ufw allow 4000/tcp  # Пользовательский порт сервиса
ufw allow 5000/tcp  # Пользовательский порт сервиса

# Разрешить локальные подключения к базе данных
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Включить брандмауэр
echo "y" | ufw enable

# Проверить статус брандмауэра
ufw status numbered
```
### Шаг 9: Клонирование репозитория Forward Email {#step-9-clone-forward-email-repository}

Скачайте исходный код Forward Email:

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

### Шаг 10: Настройка конфигурации окружения {#step-10-set-up-environment-configuration}

Подготовьте конфигурацию окружения:

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

### Шаг 11: Настройте ваш домен {#step-11-configure-your-domain}

Установите имя вашего домена и обновите переменные окружения:

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

### Шаг 12: Генерация SSL сертификатов {#step-12-generate-ssl-certificates}

#### Вариант A: Ручной DNS-челлендж (Рекомендуется для большинства пользователей) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Важно**: При запросе вам нужно будет создать TXT-записи в вашем DNS. Вы можете увидеть несколько челленджей для одного и того же домена — **создайте ВСЕ из них**. Не удаляйте первую TXT-запись при добавлении второй.

#### Вариант B: Cloudflare DNS (Если вы используете Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

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

#### Копирование сертификатов {#copy-certificates}

После генерации сертификатов скопируйте их в директорию приложения:

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

echo "✅ Все ключи шифрования успешно сгенерированы"
```
### Шаг 14: Обновление путей SSL в конфигурации {#step-14-update-ssl-paths-in-configuration}

Настройте пути к SSL-сертификатам в файле окружения:

```bash
# Обновите пути SSL, чтобы они указывали на правильные файлы сертификатов
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Шаг 15: Настройка базовой аутентификации {#step-15-set-up-basic-authentication}

Создайте временные учетные данные для базовой аутентификации:

```bash
# Сгенерировать надежный случайный пароль
PASSWORD=$(openssl rand -base64 16)

# Обновить файл окружения с учетными данными базовой аутентификации
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Показать учетные данные (сохраните их!)
echo ""
echo "🔐 ВАЖНО: Сохраните эти данные для входа!"
echo "=================================="
echo "Имя пользователя: admin"
echo "Пароль: $PASSWORD"
echo "=================================="
echo ""
echo "Эти данные понадобятся для доступа к веб-интерфейсу после установки."
echo ""
```

### Шаг 16: Развертывание с помощью Docker Compose {#step-16-deploy-with-docker-compose}

Запустите все сервисы Forward Email:

```bash
# Установить путь к файлу Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Остановить все существующие контейнеры
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Загрузить последние образы
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Запустить все сервисы в фоновом режиме
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Подождать немного, чтобы сервисы запустились
sleep 10

# Проверить статус сервисов
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Шаг 17: Проверка установки {#step-17-verify-installation}

Проверьте, что все сервисы работают корректно:

```bash
# Проверить контейнеры Docker
docker ps

# Проверить логи сервисов на наличие ошибок
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Проверить доступность веб-интерфейса
curl -I https://$DOMAIN

# Проверить, слушают ли порты
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Постустановочная конфигурация {#post-installation-configuration}

### Настройка DNS-записей {#dns-records-setup}

Вам нужно настроить следующие DNS-записи для вашего домена:

#### MX-запись {#mx-record}

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

#### SPF-запись {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-запись {#dkim-record}

Получите ваш публичный ключ DKIM:

```bash
# Извлечь публичный ключ DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Создайте DKIM DNS-запись:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-запись {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Первый вход {#first-login}

1. Откройте ваш веб-браузер и перейдите по адресу `https://yourdomain.com`
2. Введите учетные данные базовой аутентификации, которые вы сохранили ранее
3. Завершите мастер первоначальной настройки
4. Создайте вашу первую учетную запись электронной почты


## Конфигурация резервного копирования {#backup-configuration}

### Настройка резервного копирования, совместимого с S3 {#set-up-s3-compatible-backup}

Настройте автоматическое резервное копирование в хранилище, совместимое с S3:

```bash
# Создать каталог для учетных данных AWS
mkdir -p ~/.aws

# Настроить учетные данные AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Настроить параметры AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Для S3, не относящегося к AWS (например, Cloudflare R2), добавьте URL конечной точки
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Настройка резервных заданий Cron {#set-up-backup-cron-jobs}

```bash
# Сделать скрипты резервного копирования исполняемыми
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Добавить задание cron для резервного копирования MongoDB (ежедневно в полночь)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Добавить задание cron для резервного копирования Redis (ежедневно в полночь)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Проверить, что задания cron добавлены
crontab -l
```


## Конфигурация автообновления {#auto-update-configuration}

Настройте автоматическое обновление вашей установки Forward Email:

```bash
# Создать команду автообновления (используйте соответствующую команду docker compose)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Добавить задание cron для автообновления (ежедневно в 1 час ночи)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Проверить, что задание cron добавлено
crontab -l
```


## Особенности Debian {#debian-specific-considerations}

### Отличия в управлении пакетами {#package-management-differences}

* **Snapd**: не установлен по умолчанию в Debian, требует ручной установки
* **Docker**: использует репозитории и GPG-ключи, специфичные для Debian
* **UFW**: может отсутствовать в минимальных установках Debian
* **systemd**: поведение может немного отличаться от Ubuntu

### Управление сервисами {#service-management}

```bash
# Проверить статус сервисов (команды для Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Перезапустить сервисы при необходимости
systemctl restart snapd
systemctl restart docker
```

### Настройка сети {#network-configuration}

В Debian могут использоваться другие имена сетевых интерфейсов или конфигурации:

```bash
# Проверить сетевые интерфейсы
ip addr show

# Проверить маршрутизацию
ip route show

# Проверить разрешение DNS
nslookup google.com
```


## Обслуживание и мониторинг {#maintenance-and-monitoring}

### Местоположение логов {#log-locations}

* **Логи Docker Compose**: используйте соответствующую команду docker compose в зависимости от установки
* **Системные логи**: `/var/log/syslog`
* **Логи резервного копирования**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Логи автообновления**: `/var/log/autoupdate.log`
* **Логи snapd**: `journalctl -u snapd`

### Регулярные задачи обслуживания {#regular-maintenance-tasks}

1. **Мониторинг свободного места на диске**: `df -h`
2. **Проверка статуса сервисов**: используйте соответствующую команду docker compose
3. **Просмотр логов**: проверяйте как логи приложений, так и системные логи
4. **Обновление системных пакетов**: `apt update && apt upgrade`
5. **Мониторинг snapd**: `snap list` и `snap refresh`

### Обновление сертификатов {#certificate-renewal}

Сертификаты должны обновляться автоматически, но вы можете обновить их вручную при необходимости:

```bash
# Ручное обновление сертификатов
certbot renew

# Копирование обновленных сертификатов
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Перезапуск сервисов для использования новых сертификатов
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
# Проверить статус snapd
systemctl status snapd

# Перезапустить snapd
systemctl restart snapd

# Проверить путь snap
echo $PATH | grep snap

# Добавить snap в PATH, если отсутствует
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Команда Docker Compose не найдена {#2-docker-compose-command-not-found}

```bash
# Проверить, какая команда docker compose доступна
command -v docker-compose
command -v docker

# Использовать соответствующую команду в скриптах
if command -v docker-compose &> /dev/null; then
    echo "Используется docker-compose"
else
    echo "Используется docker compose"
fi
```
#### 3. Проблемы с установкой пакетов {#3-package-installation-issues}

```bash
# Обновить кэш пакетов
apt update

# Исправить сломанные пакеты
apt --fix-broken install

# Проверить удерживаемые пакеты
apt-mark showhold
```

### Распространённые проблемы {#common-issues}

#### 1. Служба Docker не запускается {#1-docker-service-wont-start}

```bash
# Проверить статус Docker
systemctl status docker

# Проверить логи Docker
journalctl -u docker

# Попробовать альтернативный запуск
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Ошибка генерации сертификата {#2-certificate-generation-fails}

* Убедитесь, что порты 80 и 443 доступны
* Проверьте, что DNS-записи указывают на ваш сервер
* Проверьте настройки брандмауэра с помощью `ufw status`

#### 3. Проблемы с доставкой электронной почты {#3-email-delivery-issues}

* Проверьте правильность MX-записей
* Проверьте записи SPF, DKIM и DMARC
* Убедитесь, что порт 25 не заблокирован вашим хостинг-провайдером

### Получение помощи {#getting-help}

* **Документация**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Документация Debian**: <https://www.debian.org/doc/>


## Лучшие практики безопасности {#security-best-practices}

1. **Держите систему в актуальном состоянии**: Регулярно обновляйте Debian и пакеты
2. **Мониторинг логов**: Настройте мониторинг логов и оповещения
3. **Регулярное резервное копирование**: Тестируйте процедуры резервного копирования и восстановления
4. **Используйте надёжные пароли**: Генерируйте сильные пароли для всех аккаунтов
5. **Включите Fail2Ban**: Рассмотрите установку fail2ban для дополнительной безопасности
6. **Регулярные аудиты безопасности**: Периодически проверяйте вашу конфигурацию
7. **Мониторинг Snapd**: Держите snap-пакеты обновлёнными с помощью `snap refresh`


## Заключение {#conclusion}

Ваша самостоятельная установка Forward Email теперь должна быть завершена и работать на Debian. Не забудьте:

1. Правильно настроить DNS-записи
2. Протестировать отправку и получение электронной почты
3. Настроить регулярное резервное копирование
4. Регулярно мониторить систему
5. Держать установку в актуальном состоянии
6. Следить за snapd и snap-пакетами

Основные отличия от Ubuntu — это установка snapd и настройка репозитория Docker. После правильной настройки этих компонентов приложение Forward Email работает одинаково на обеих системах.

Для дополнительных параметров конфигурации и расширенных функций обратитесь к официальной документации Forward Email по адресу <https://forwardemail.net/self-hosted#configuration>.
