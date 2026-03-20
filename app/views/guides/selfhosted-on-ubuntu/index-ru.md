# Руководство по установке Forward Email для самостоятельного хостинга на Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Содержание {#table-of-contents}

* [Обзор](#overview)
* [Требования](#prerequisites)
* [Системные требования](#system-requirements)
* [Пошаговая установка](#step-by-step-installation)
  * [Шаг 1: Начальная настройка системы](#step-1-initial-system-setup)
  * [Шаг 2: Настройка DNS-резолверов](#step-2-configure-dns-resolvers)
  * [Шаг 3: Установка системных зависимостей](#step-3-install-system-dependencies)
  * [Шаг 4: Установка пакетов Snap](#step-4-install-snap-packages)
  * [Шаг 5: Установка Docker](#step-5-install-docker)
  * [Шаг 6: Настройка службы Docker](#step-6-configure-docker-service)
  * [Шаг 7: Настройка брандмауэра](#step-7-configure-firewall)
  * [Шаг 8: Клонирование репозитория Forward Email](#step-8-clone-forward-email-repository)
  * [Шаг 9: Настройка конфигурации окружения](#step-9-set-up-environment-configuration)
  * [Шаг 10: Настройка вашего домена](#step-10-configure-your-domain)
  * [Шаг 11: Генерация SSL-сертификатов](#step-11-generate-ssl-certificates)
  * [Шаг 12: Генерация ключей шифрования](#step-12-generate-encryption-keys)
  * [Шаг 13: Обновление путей SSL в конфигурации](#step-13-update-ssl-paths-in-configuration)
  * [Шаг 14: Настройка базовой аутентификации](#step-14-set-up-basic-authentication)
  * [Шаг 15: Развертывание с помощью Docker Compose](#step-15-deploy-with-docker-compose)
  * [Шаг 16: Проверка установки](#step-16-verify-installation)
* [Конфигурация после установки](#post-installation-configuration)
  * [Настройка DNS-записей](#dns-records-setup)
  * [Первый вход](#first-login)
* [Резервное копирование конфигурации](#backup-configuration)
  * [Настройка резервного копирования, совместимого с S3](#set-up-s3-compatible-backup)
  * [Настройка cron-задач для резервного копирования](#set-up-backup-cron-jobs)
* [Настройка автообновления](#auto-update-configuration)
* [Обслуживание и мониторинг](#maintenance-and-monitoring)
  * [Расположение логов](#log-locations)
  * [Регулярные задачи обслуживания](#regular-maintenance-tasks)
  * [Обновление сертификатов](#certificate-renewal)
* [Устранение неполадок](#troubleshooting)
  * [Распространённые проблемы](#common-issues)
  * [Получение помощи](#getting-help)
* [Рекомендации по безопасности](#security-best-practices)
* [Заключение](#conclusion)


## Обзор {#overview}

Это руководство содержит пошаговые инструкции по установке решения Forward Email для самостоятельного хостинга на системах Ubuntu. Руководство специально адаптировано для версий Ubuntu 20.04, 22.04 и 24.04 LTS.


## Требования {#prerequisites}

Перед началом установки убедитесь, что у вас есть:

* **Ubuntu Server**: 20.04, 22.04 или 24.04 LTS
* **Доступ root**: возможность выполнять команды от имени root (доступ через sudo)
* **Доменное имя**: домен, которым вы управляете, с доступом к управлению DNS
* **Чистый сервер**: рекомендуется использовать свежую установку Ubuntu
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

Настройте систему на использование DNS-серверов Cloudflare для надежной генерации сертификатов:

```bash
# Остановить и отключить systemd-resolved, если он запущен
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Настройка DNS-резолверов Cloudflare
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

Установите необходимые пакеты для Forward Email:

```bash
# Обновить список пакетов
apt-get update -y

# Установить базовые зависимости
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

Установите AWS CLI и Certbot через snap:

```bash
# Установить AWS CLI
snap install aws-cli --classic

# Установить Certbot и плагин DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Шаг 5: Установка Docker {#step-5-install-docker}

Установите Docker CE и Docker Compose:

```bash
# Добавить официальный GPG ключ Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Добавить репозиторий Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Обновить индекс пакетов и установить Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Проверить установку Docker
docker --version
docker compose version
```

### Шаг 6: Настройка службы Docker {#step-6-configure-docker-service}

Убедитесь, что Docker запускается автоматически и работает:

```bash
# Включить и запустить службу Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Проверить, что Docker запущен
docker info
```

Если Docker не запускается, попробуйте запустить его вручную:

```bash
# Альтернативный способ запуска, если systemctl не работает
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Шаг 7: Настройка брандмауэра {#step-7-configure-firewall}

Настройте брандмауэр UFW для защиты вашего сервера:

```bash
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

### Шаг 8: Клонирование репозитория Forward Email {#step-8-clone-forward-email-repository}

Скачайте исходный код Forward Email:

```bash
# Установить переменные
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Клонировать репозиторий
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Проверить успешность клонирования
ls -la
```

### Шаг 9: Настройка конфигурации окружения {#step-9-set-up-environment-configuration}

Подготовьте конфигурацию окружения:

```bash
# Установить переменные директорий
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Скопировать файл окружения по умолчанию
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Создать директорию для SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Создать директории для баз данных
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Шаг 10: Настройка вашего домена {#step-10-configure-your-domain}

Установите имя вашего домена и обновите переменные окружения:

```bash
# Замените 'yourdomain.com' на ваш реальный домен
DOMAIN="yourdomain.com"

# Функция для обновления файла окружения
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Обновить переменные окружения, связанные с доменом
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
### Шаг 11: Генерация SSL сертификатов {#step-11-generate-ssl-certificates}

#### Вариант A: Ручной DNS-челлендж (Рекомендуется для большинства пользователей) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Генерация сертификатов с использованием ручного DNS-челленджа
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
# Создание файла учетных данных Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Установка правильных прав доступа
chmod 600 /root/.cloudflare.ini

# Автоматическая генерация сертификатов
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

После генерации сертификатов скопируйте их в каталог приложения:

```bash
# Копирование сертификатов в каталог SSL приложения
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Проверка, что сертификаты скопированы
ls -la "$SELF_HOST_DIR/ssl/"
```

### Шаг 12: Генерация ключей шифрования {#step-12-generate-encryption-keys}

Создайте различные ключи шифрования, необходимые для безопасной работы:

```bash
# Генерация вспомогательного ключа шифрования
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Генерация секрета SRS для пересылки почты
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Генерация ключа шифрования TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Генерация приватного ключа DKIM для подписи почты
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Генерация ключа подписи webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Установка пароля для SMTP транспорта
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Все ключи шифрования успешно сгенерированы"
```

### Шаг 13: Обновление путей SSL в конфигурации {#step-13-update-ssl-paths-in-configuration}

Настройте пути к SSL сертификатам в файле окружения:

```bash
# Обновление путей SSL для указания на правильные файлы сертификатов
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Шаг 14: Настройка базовой аутентификации {#step-14-set-up-basic-authentication}

Создайте временные учетные данные для базовой аутентификации:

```bash
# Генерация надежного случайного пароля
PASSWORD=$(openssl rand -base64 16)

# Обновление файла окружения с учетными данными базовой аутентификации
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Отображение учетных данных (сохраните их!)
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

### Шаг 15: Развертывание с помощью Docker Compose {#step-15-deploy-with-docker-compose}

Запустите все сервисы Forward Email:

```bash
# Установка пути к файлу Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Остановка всех существующих контейнеров
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Загрузка последних образов
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Запуск всех сервисов в фоновом режиме
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Небольшая пауза для запуска сервисов
sleep 10

# Проверка статуса сервисов
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Шаг 16: Проверка установки {#step-16-verify-installation}

Проверьте, что все сервисы работают корректно:

```bash
# Проверка контейнеров Docker
docker ps

# Проверка логов сервисов на наличие ошибок
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Тестирование подключения к веб-интерфейсу
curl -I https://$DOMAIN

# Проверка прослушиваемых портов
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Конфигурация после установки {#post-installation-configuration}

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
# Извлечение публичного ключа DKIM
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

1. Откройте ваш веб-браузер и перейдите на `https://yourdomain.com`
2. Введите сохранённые ранее учетные данные базовой аутентификации
3. Завершите мастер первоначальной настройки
4. Создайте вашу первую почтовую учетную запись


## Конфигурация резервного копирования {#backup-configuration}

### Настройка резервного копирования в S3-совместимое хранилище {#set-up-s3-compatible-backup}

Настройте автоматическое резервное копирование в S3-совместимое хранилище:

```bash
# Создание директории для AWS учетных данных
mkdir -p ~/.aws

# Настройка AWS учетных данных
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Настройка параметров AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Для не-AWS S3 (например, Cloudflare R2) добавьте URL конечной точки
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Настройка cron-задач для резервного копирования {#set-up-backup-cron-jobs}

```bash
# Сделать скрипты резервного копирования исполняемыми
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Добавить cron-задачу для резервного копирования MongoDB (ежедневно в полночь)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Добавить cron-задачу для резервного копирования Redis (ежедневно в полночь)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Проверить добавленные cron-задачи
crontab -l
```


## Конфигурация автообновления {#auto-update-configuration}

Настройте автоматическое обновление установки Forward Email:

```bash
# Создать команду автообновления
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Добавить cron-задачу автообновления (ежедневно в 1 час ночи)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Проверить добавленную cron-задачу
crontab -l
```


## Обслуживание и мониторинг {#maintenance-and-monitoring}

### Расположение логов {#log-locations}

* **Логи Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Системные логи**: `/var/log/syslog`
* **Логи резервного копирования**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Логи автообновления**: `/var/log/autoupdate.log`

### Регулярные задачи обслуживания {#regular-maintenance-tasks}

1. **Мониторинг свободного места на диске**: `df -h`
2. **Проверка статуса сервисов**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Просмотр логов**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Обновление системных пакетов**: `apt update && apt upgrade`
5. **Обновление сертификатов**: Сертификаты обновляются автоматически, но следите за сроком действия

### Обновление сертификатов {#certificate-renewal}

Сертификаты должны обновляться автоматически, но вы можете обновить их вручную при необходимости:

```bash
# Ручное обновление сертификатов
certbot renew

# Копирование обновленных сертификатов
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Перезапуск сервисов для использования новых сертификатов
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Устранение неполадок {#troubleshooting}

### Распространённые проблемы {#common-issues}

#### 1. Служба Docker не запускается {#1-docker-service-wont-start}

```bash
# Проверить статус Docker
systemctl status docker

# Попробовать альтернативный запуск
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Ошибка генерации сертификата {#2-certificate-generation-fails}

* Убедитесь, что порты 80 и 443 доступны
* Проверьте, что DNS-записи указывают на ваш сервер
* Проверьте настройки брандмауэра

#### 3. Проблемы с доставкой электронной почты {#3-email-delivery-issues}

* Проверьте правильность MX-записей
* Проверьте записи SPF, DKIM и DMARC
* Убедитесь, что порт 25 не заблокирован вашим хостинг-провайдером

#### 4. Веб-интерфейс недоступен {#4-web-interface-not-accessible}

* Проверьте настройки брандмауэра: `ufw status`
* Проверьте SSL-сертификаты: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Проверьте учетные данные базовой аутентификации

### Получение помощи {#getting-help}

* **Документация**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Поддержка сообщества**: Ознакомьтесь с обсуждениями проекта на GitHub


## Лучшие практики безопасности {#security-best-practices}

1. **Держите систему в актуальном состоянии**: Регулярно обновляйте Ubuntu и пакеты
2. **Мониторинг логов**: Настройте мониторинг логов и оповещения
3. **Регулярное резервное копирование**: Тестируйте процедуры резервного копирования и восстановления
4. **Используйте сложные пароли**: Генерируйте надежные пароли для всех аккаунтов
5. **Включите Fail2Ban**: Рассмотрите возможность установки fail2ban для дополнительной безопасности
6. **Регулярные аудиты безопасности**: Периодически проверяйте вашу конфигурацию


## Заключение {#conclusion}

Ваша самостоятельная установка Forward Email теперь должна быть завершена и работать на Ubuntu. Не забудьте:

1. Правильно настроить DNS-записи
2. Протестировать отправку и получение электронной почты
3. Настроить регулярное резервное копирование
4. Регулярно мониторить систему
5. Держать установку в актуальном состоянии

Для дополнительных параметров конфигурации и расширенных функций обратитесь к официальной документации Forward Email по адресу <https://forwardemail.net/self-hosted#configuration>.
