# دليل تثبيت استضافة البريد الإلكتروني الذاتية لإعادة التوجيه لنظام التشغيل Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## جدول المحتويات {#table-of-contents}

* [ملخص](#overview)
* [المتطلبات الأساسية](#prerequisites)
* [متطلبات النظام](#system-requirements)
* [التثبيت خطوة بخطوة](#step-by-step-installation)
  * [الخطوة 1: الإعداد الأولي للنظام](#step-1-initial-system-setup)
  * [الخطوة 2: تكوين حلول DNS](#step-2-configure-dns-resolvers)
  * [الخطوة 3: تثبيت تبعيات النظام](#step-3-install-system-dependencies)
  * [الخطوة 4: تثبيت حزم Snap](#step-4-install-snap-packages)
  * [الخطوة 5: تثبيت Docker](#step-5-install-docker)
  * [الخطوة 6: تكوين خدمة Docker](#step-6-configure-docker-service)
  * [الخطوة 7: تكوين جدار الحماية](#step-7-configure-firewall)
  * [الخطوة 8: استنساخ مستودع البريد الإلكتروني الأمامي](#step-8-clone-forward-email-repository)
  * [الخطوة 9: إعداد تكوين البيئة](#step-9-set-up-environment-configuration)
  * [الخطوة 10: تكوين المجال الخاص بك](#step-10-configure-your-domain)
  * [الخطوة 11: إنشاء شهادات SSL](#step-11-generate-ssl-certificates)
  * [الخطوة 12: إنشاء مفاتيح التشفير](#step-12-generate-encryption-keys)
  * [الخطوة 13: تحديث مسارات SSL في التكوين](#step-13-update-ssl-paths-in-configuration)
  * [الخطوة 14: إعداد المصادقة الأساسية](#step-14-set-up-basic-authentication)
  * [الخطوة 15: النشر باستخدام Docker Compose](#step-15-deploy-with-docker-compose)
  * [الخطوة 16: التحقق من التثبيت](#step-16-verify-installation)
* [تكوين ما بعد التثبيت](#post-installation-configuration)
  * [إعداد سجلات DNS](#dns-records-setup)
  * [تسجيل الدخول الأول](#first-login)
* [تكوين النسخ الاحتياطي](#backup-configuration)
  * [إعداد النسخ الاحتياطي المتوافق مع S3](#set-up-s3-compatible-backup)
  * [إعداد مهام النسخ الاحتياطي Cron](#set-up-backup-cron-jobs)
* [تكوين التحديث التلقائي](#auto-update-configuration)
* [الصيانة والمراقبة](#maintenance-and-monitoring)
  * [مواقع السجلات](#log-locations)
  * [مهام الصيانة الدورية](#regular-maintenance-tasks)
  * [تجديد الشهادة](#certificate-renewal)
* [استكشاف الأخطاء وإصلاحها](#troubleshooting)
  * [القضايا الشائعة](#common-issues)
  * [الحصول على المساعدة](#getting-help)
* [أفضل ممارسات الأمان](#security-best-practices)
* [خاتمة](#conclusion)

## نظرة عامة {#overview}

يقدم هذا الدليل تعليمات خطوة بخطوة لتثبيت حل Forward Email المُستضاف ذاتيًا على أنظمة Ubuntu. صُمم هذا الدليل خصيصًا لإصدارات Ubuntu 20.04 و22.04 و24.04 LTS.

## المتطلبات الأساسية {#prerequisites}

قبل البدء في التثبيت، تأكد من أن لديك:

* **خادم أوبونتو**: 20.04، 22.04، أو 24.04 LTS
* **وصول الجذر**: يجب أن تكون قادرًا على تشغيل الأوامر بصلاحيات الجذر (sudo access)
* **اسم النطاق**: نطاق تتحكم فيه من خلال وصول إدارة DNS
* **خادم نظيف**: يُنصح باستخدام تثبيت أوبونتو جديد
* **اتصال بالإنترنت**: مطلوب لتنزيل الحزم وصور Docker

## متطلبات النظام {#system-requirements}

* **ذاكرة الوصول العشوائي**: الحد الأدنى ٢ غيغابايت (يُنصح بـ ٤ غيغابايت للإنتاج)
* **التخزين**: الحد الأدنى ٢٠ غيغابايت من المساحة المتوفرة (يُنصح بـ ٥٠ غيغابايت فأكثر للإنتاج)
* **وحدة المعالجة المركزية**: وحدة معالجة مركزية افتراضية واحدة على الأقل (يُنصح بوحدتي معالجة مركزية افتراضيتين أو أكثر للإنتاج)
* **الشبكة**: عنوان IP عام مع إمكانية الوصول إلى المنافذ التالية:
* ٢٢ (SSH)
* ٢٥ (SMTP)
* ٨٠ (HTTP)
* ٤٤٣ (HTTPS)
* ٤٦٥ (SMTPS)
* ٩٩٣ (IMAPS)
* ٩٩٥ (POP3S)

## التثبيت خطوة بخطوة {#step-by-step-installation}

### الخطوة 1: الإعداد الأولي للنظام {#step-1-initial-system-setup}

أولاً، تأكد من تحديث نظامك والتبديل إلى المستخدم الجذر:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### الخطوة 2: تكوين حلول DNS {#step-2-configure-dns-resolvers}

قم بتكوين نظامك لاستخدام خوادم DNS الخاصة بـ Cloudflare لتوليد الشهادات بشكل موثوق:

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

### الخطوة 3: تثبيت تبعيات النظام {#step-3-install-system-dependencies}

قم بتثبيت الحزم المطلوبة لإعادة توجيه البريد الإلكتروني:

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

### الخطوة 4: تثبيت حزم Snap {#step-4-install-snap-packages}

تثبيت AWS CLI وCertbot عبر snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### الخطوة 5: تثبيت Docker {#step-5-install-docker}

تثبيت Docker CE وDocker Compose:

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

### الخطوة 6: تكوين خدمة Docker {#step-6-configure-docker-service}

تأكد من بدء تشغيل Docker تلقائيًا وتشغيله:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

إذا فشل تشغيل Docker، فحاول تشغيله يدويًا:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### الخطوة 7: تكوين جدار الحماية {#step-7-configure-firewall}

إعداد جدار حماية UFW لتأمين الخادم الخاص بك:

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

### الخطوة 8: استنساخ مستودع البريد الإلكتروني الأمامي {#step-8-clone-forward-email-repository}

تنزيل كود مصدر البريد الإلكتروني الأمامي:

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

### الخطوة 9: إعداد تكوين البيئة {#step-9-set-up-environment-configuration}

إعداد تكوين البيئة:

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

### الخطوة 10: تكوين نطاقك {#step-10-configure-your-domain}

قم بتعيين اسم المجال الخاص بك وتحديث متغيرات البيئة:

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

### الخطوة 11: إنشاء شهادات SSL {#step-11-generate-ssl-certificates}

#### الخيار أ: تحدي DNS اليدوي (موصى به لمعظم المستخدمين) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**هام**: عند الطلب، ستحتاج إلى إنشاء سجلات TXT في نظام أسماء النطاقات (DNS). قد تظهر لك عدة تحديات للنطاق نفسه - **أنشئها جميعها**. لا تحذف سجل TXT الأول عند إضافة السجل الثاني.

#### الخيار ب: Cloudflare DNS (إذا كنت تستخدم Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

إذا كان نطاقك يستخدم Cloudflare لـ DNS، فيمكنك أتمتة إنشاء الشهادة:

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

#### نسخ الشهادات {#copy-certificates}

بعد إنشاء الشهادة، انسخها إلى دليل التطبيق:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### الخطوة 12: إنشاء مفاتيح التشفير {#step-12-generate-encryption-keys}

إنشاء مفاتيح التشفير المختلفة المطلوبة للتشغيل الآمن:

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

### الخطوة 13: تحديث مسارات SSL في التكوين {#step-13-update-ssl-paths-in-configuration}

قم بتكوين مسارات شهادة SSL في ملف البيئة:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### الخطوة 14: إعداد المصادقة الأساسية {#step-14-set-up-basic-authentication}

إنشاء بيانات اعتماد المصادقة الأساسية المؤقتة:

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

### الخطوة 15: النشر باستخدام Docker Compose {#step-15-deploy-with-docker-compose}

ابدأ جميع خدمات إعادة توجيه البريد الإلكتروني:

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

### الخطوة 16: التحقق من التثبيت {#step-16-verify-installation}

تأكد من تشغيل جميع الخدمات بشكل صحيح:

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

## تكوين ما بعد التثبيت {#post-installation-configuration}

### إعداد سجلات DNS {#dns-records-setup}

يجب عليك تكوين سجلات DNS التالية لنطاقك:

#### سجل MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### سجلات A {#a-records}

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

#### سجل SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

سجل DKIM {#dkim-record}

احصل على مفتاح DKIM العام الخاص بك:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

إنشاء سجل DKIM DNS:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

سجل DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### تسجيل الدخول الأول {#first-login}

1. افتح متصفح الويب وانتقل إلى `https://yourdomain.com`
2. أدخل بيانات اعتماد المصادقة الأساسية التي حفظتها سابقًا
3. أكمل معالج الإعداد الأولي
4. أنشئ حساب بريدك الإلكتروني الأول

## تكوين النسخ الاحتياطي {#backup-configuration}

### إعداد النسخ الاحتياطي المتوافق مع S3 {#set-up-s3-compatible-backup}

تكوين النسخ الاحتياطية التلقائية للتخزين المتوافق مع S3:

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

### إعداد مهام النسخ الاحتياطي Cron {#set-up-backup-cron-jobs}

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

## تكوين التحديث التلقائي {#auto-update-configuration}

إعداد التحديثات التلقائية لتثبيت البريد الإلكتروني الأمامي الخاص بك:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## الصيانة والمراقبة {#maintenance-and-monitoring}

### مواقع السجل {#log-locations}

* **سجلات Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **سجلات النظام**: `/var/log/syslog`
* **سجلات النسخ الاحتياطي**: `/var/log/mongo-backup.log`، `/var/log/redis-backup.log`
* **سجلات التحديث التلقائي**: `/var/log/autoupdate.log`

### مهام الصيانة الدورية {#regular-maintenance-tasks}

١. **مراقبة مساحة القرص**: `df -h`
٢. **التحقق من حالة الخدمة**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
٣. **مراجعة السجلات**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
٤. **تحديث حزم النظام**: `apt update && apt upgrade`
٥. **تجديد الشهادات**: يتم تجديد الشهادات تلقائيًا، ولكن مع مراقبة انتهاء صلاحيتها

### تجديد الشهادة {#certificate-renewal}

يجب أن يتم تجديد الشهادات تلقائيًا، ولكن يمكنك تجديدها يدويًا إذا لزم الأمر:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

### المشكلات الشائعة {#common-issues}

#### 1. لن تبدأ خدمة Docker {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. فشل إنشاء الشهادة {#2-certificate-generation-fails}

* تأكد من إمكانية الوصول إلى المنفذين 80 و443.
* تأكد من أن سجلات DNS تشير إلى خادمك.
* تحقق من إعدادات جدار الحماية.

#### 3. مشكلات تسليم البريد الإلكتروني {#3-email-delivery-issues}

* تأكد من صحة سجلات MX.
* تحقق من سجلات SPF وDKIM وDMARC.
* تأكد من عدم حظر المنفذ 25 من قِبل مزود الاستضافة.

#### 4. واجهة الويب غير قابلة للوصول {#4-web-interface-not-accessible}

* تحقق من إعدادات جدار الحماية: `ufw status`
* تحقق من شهادات SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* تحقق من بيانات اعتماد المصادقة الأساسية

### الحصول على المساعدة {#getting-help}

* **الوثائق**: <https://forwardemail.net/self-hosted>
* **مشاكل GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **دعم المجتمع**: تحقق من مناقشات المشروع على GitHub

## أفضل ممارسات الأمان {#security-best-practices}

١. **تحديث النظام باستمرار**: حدّث أوبونتو وحزمه بانتظام.
٢. **مراقبة السجلات**: جهّز مراقبة السجلات والتنبيهات.
٣. **النسخ الاحتياطي بانتظام**: اختبر إجراءات النسخ الاحتياطي والاستعادة.
٤. **استخدام كلمات مرور قوية**: أنشئ كلمات مرور قوية لجميع الحسابات.
٥. **تفعيل ميزة Fail2Ban**: فكّر في تثبيت ميزة Fail2Ban لمزيد من الأمان.
٦. **عمليات تدقيق أمان منتظمة**: راجع إعداداتك بشكل دوري.

## الخاتمة {#conclusion}

يجب أن يكون تثبيت خدمة البريد الإلكتروني المُستضاف ذاتيًا (Forward Email) جاهزًا ويعمل على نظام أوبونتو. تذكر:

١. ضبط سجلات DNS بشكل صحيح
٢. اختبار إرسال واستقبال البريد الإلكتروني
٣. إعداد نسخ احتياطية منتظمة
٤. مراقبة نظامك بانتظام
٥. تحديث نظامك باستمرار

للحصول على خيارات تكوين إضافية وميزات متقدمة، راجع وثائق إعادة توجيه البريد الإلكتروني الرسمية على <https://forwardemail.net/self-hosted#configuration>.