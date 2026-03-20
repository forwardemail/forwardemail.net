# دليل تثبيت خدمة إعادة توجيه البريد الإلكتروني المستضافة ذاتيًا على ديبيان {#forward-email-self-hosting-installation-guide-for-debian}


## جدول المحتويات {#table-of-contents}

* [نظرة عامة](#overview)
* [المتطلبات الأساسية](#prerequisites)
* [متطلبات النظام](#system-requirements)
* [التثبيت خطوة بخطوة](#step-by-step-installation)
  * [الخطوة 1: الإعداد الأولي للنظام](#step-1-initial-system-setup)
  * [الخطوة 2: تكوين محللات DNS](#step-2-configure-dns-resolvers)
  * [الخطوة 3: تثبيت تبعيات النظام](#step-3-install-system-dependencies)
  * [الخطوة 4: تثبيت وتكوين Snapd](#step-4-install-and-configure-snapd)
  * [الخطوة 5: تثبيت حزم Snap](#step-5-install-snap-packages)
  * [الخطوة 6: تثبيت Docker](#step-6-install-docker)
  * [الخطوة 7: تكوين خدمة Docker](#step-7-configure-docker-service)
  * [الخطوة 8: تثبيت وتكوين جدار الحماية UFW](#step-8-install-and-configure-ufw-firewall)
  * [الخطوة 9: استنساخ مستودع Forward Email](#step-9-clone-forward-email-repository)
  * [الخطوة 10: إعداد تكوين البيئة](#step-10-set-up-environment-configuration)
  * [الخطوة 11: تكوين نطاقك](#step-11-configure-your-domain)
  * [الخطوة 12: إنشاء شهادات SSL](#step-12-generate-ssl-certificates)
  * [الخطوة 13: إنشاء مفاتيح التشفير](#step-13-generate-encryption-keys)
  * [الخطوة 14: تحديث مسارات SSL في التكوين](#step-14-update-ssl-paths-in-configuration)
  * [الخطوة 15: إعداد المصادقة الأساسية](#step-15-set-up-basic-authentication)
  * [الخطوة 16: النشر باستخدام Docker Compose](#step-16-deploy-with-docker-compose)
  * [الخطوة 17: التحقق من التثبيت](#step-17-verify-installation)
* [تكوين ما بعد التثبيت](#post-installation-configuration)
  * [إعداد سجلات DNS](#dns-records-setup)
  * [تسجيل الدخول الأول](#first-login)
* [تكوين النسخ الاحتياطي](#backup-configuration)
  * [إعداد النسخ الاحتياطي المتوافق مع S3](#set-up-s3-compatible-backup)
  * [إعداد مهام Cron للنسخ الاحتياطي](#set-up-backup-cron-jobs)
* [تكوين التحديث التلقائي](#auto-update-configuration)
* [اعتبارات خاصة بديبيان](#debian-specific-considerations)
  * [اختلافات إدارة الحزم](#package-management-differences)
  * [إدارة الخدمة](#service-management)
  * [تكوين الشبكة](#network-configuration)
* [الصيانة والمراقبة](#maintenance-and-monitoring)
  * [مواقع السجلات](#log-locations)
  * [مهام الصيانة الدورية](#regular-maintenance-tasks)
  * [تجديد الشهادات](#certificate-renewal)
* [استكشاف الأخطاء وإصلاحها](#troubleshooting)
  * [مشاكل خاصة بديبيان](#debian-specific-issues)
  * [مشاكل شائعة](#common-issues)
  * [الحصول على المساعدة](#getting-help)
* [أفضل ممارسات الأمان](#security-best-practices)
* [الخاتمة](#conclusion)


## نظرة عامة {#overview}

يوفر هذا الدليل تعليمات خطوة بخطوة لتثبيت حل Forward Email المستضاف ذاتيًا على أنظمة ديبيان. هذا الدليل مخصص خصيصًا لإصدارات ديبيان 11 (Bullseye) وديبيان 12 (Bookworm).


## المتطلبات الأساسية {#prerequisites}

قبل بدء التثبيت، تأكد من توفر:

* **خادم ديبيان**: الإصدار 11 (Bullseye) أو 12 (Bookworm)
* **وصول الجذر**: يجب أن تكون قادرًا على تشغيل الأوامر كجذر (وصول sudo)
* **اسم نطاق**: نطاق تملكه مع إمكانية إدارة DNS
* **خادم نظيف**: يُفضل استخدام تثبيت ديبيان جديد
* **اتصال بالإنترنت**: مطلوب لتنزيل الحزم وصور Docker


## متطلبات النظام {#system-requirements}

* **الذاكرة العشوائية (RAM)**: 2 جيجابايت كحد أدنى (4 جيجابايت موصى بها للإنتاج)
* **التخزين**: 20 جيجابايت مساحة متاحة كحد أدنى (50 جيجابايت أو أكثر موصى بها للإنتاج)
* **المعالج (CPU)**: نواة افتراضية واحدة كحد أدنى (2 أو أكثر موصى بها للإنتاج)
* **الشبكة**: عنوان IP عام مع فتح المنافذ التالية:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## التثبيت خطوة بخطوة {#step-by-step-installation}

### الخطوة 1: الإعداد الأولي للنظام {#step-1-initial-system-setup}

أولاً، تأكد من تحديث نظامك وانتقل إلى مستخدم الجذر:

```bash
# تحديث حزم النظام
sudo apt update && sudo apt upgrade -y

# التبديل إلى مستخدم الجذر (مطلوب للتثبيت)
sudo su -
```
### الخطوة 2: تكوين محللات DNS {#step-2-configure-dns-resolvers}

قم بتكوين نظامك لاستخدام خوادم DNS الخاصة بـ Cloudflare لتوليد الشهادات بشكل موثوق:

```bash
# إيقاف وتعطيل systemd-resolved إذا كان يعمل
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# تكوين محللات DNS الخاصة بـ Cloudflare
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

قم بتثبيت الحزم المطلوبة لـ Forward Email على ديبيان:

```bash
# تحديث قائمة الحزم
apt-get update -y

# تثبيت التبعيات الأساسية (قائمة الحزم الخاصة بديبيان)
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

### الخطوة 4: تثبيت وتكوين Snapd {#step-4-install-and-configure-snapd}

ديبيان لا يتضمن snapd بشكل افتراضي، لذا نحتاج لتثبيته وتكوينه:

```bash
# تثبيت snapd
apt-get install -y snapd

# تمكين وبدء خدمة snapd
systemctl enable snapd
systemctl start snapd

# إنشاء رابط رمزي ليعمل snap بشكل صحيح
ln -sf /var/lib/snapd/snap /snap

# الانتظار حتى يصبح snapd جاهزًا
sleep 10

# التحقق من عمل snapd
snap version
```

### الخطوة 5: تثبيت حزم Snap {#step-5-install-snap-packages}

قم بتثبيت AWS CLI و Certbot عبر snap:

```bash
# تثبيت AWS CLI
snap install aws-cli --classic

# تثبيت Certbot والإضافة الخاصة بـ DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# التحقق من التثبيتات
aws --version
certbot --version
```

### الخطوة 6: تثبيت Docker {#step-6-install-docker}

قم بتثبيت Docker CE و Docker Compose على ديبيان:

```bash
# إضافة مفتاح GPG الرسمي لـ Docker (خاص بديبيان)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# إضافة مستودع Docker (خاص بديبيان)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# تحديث فهرس الحزم وتثبيت Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# تثبيت docker-compose المستقل كخيار احتياطي (إذا لم تعمل الإضافة)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# التحقق من تثبيت Docker
docker --version
docker compose version || docker-compose --version
```

### الخطوة 7: تكوين خدمة Docker {#step-7-configure-docker-service}

تأكد من بدء Docker تلقائيًا وأنه يعمل:

```bash
# تمكين وبدء خدمة Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# التحقق من تشغيل Docker
docker info
```

إذا فشل Docker في البدء، حاول تشغيله يدويًا:

```bash
# طريقة بدء بديلة إذا فشل systemctl
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### الخطوة 8: تثبيت وتكوين جدار الحماية UFW {#step-8-install-and-configure-ufw-firewall}

قد لا تتضمن تثبيتات ديبيان الحد الأدنى UFW، لذا قم بتثبيته أولاً:

```bash
# تثبيت UFW إذا لم يكن موجودًا
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# تعيين السياسات الافتراضية
ufw default deny incoming
ufw default allow outgoing

# السماح بالاتصال عبر SSH (مهم - لا تقفل نفسك!)
ufw allow 22/tcp

# السماح بالمنافذ المتعلقة بالبريد الإلكتروني
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (لـ Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (منفذ بديل)
ufw allow 2995/tcp  # POP3 (منفذ بديل)
ufw allow 3456/tcp  # منفذ خدمة مخصص
ufw allow 4000/tcp  # منفذ خدمة مخصص
ufw allow 5000/tcp  # منفذ خدمة مخصص

# السماح باتصالات قاعدة البيانات المحلية
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# تفعيل جدار الحماية
echo "y" | ufw enable

# التحقق من حالة جدار الحماية
ufw status numbered
```
### الخطوة 9: استنساخ مستودع بريد التوجيه {#step-9-clone-forward-email-repository}

قم بتنزيل شفرة مصدر بريد التوجيه:

```bash
# إعداد المتغيرات
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# استنساخ المستودع
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# التحقق من نجاح الاستنساخ
ls -la
```

### الخطوة 10: إعداد تكوين البيئة {#step-10-set-up-environment-configuration}

قم بتحضير تكوين البيئة:

```bash
# إعداد متغيرات الدليل
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# نسخ ملف البيئة الافتراضي
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# إنشاء دليل SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# إنشاء دلائل قاعدة البيانات
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### الخطوة 11: تكوين نطاقك {#step-11-configure-your-domain}

قم بتعيين اسم النطاق الخاص بك وتحديث متغيرات البيئة:

```bash
# استبدل 'yourdomain.com' بنطاقك الفعلي
DOMAIN="yourdomain.com"

# دالة لتحديث ملف البيئة
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# تحديث متغيرات البيئة المتعلقة بالنطاق
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

### الخطوة 12: إنشاء شهادات SSL {#step-12-generate-ssl-certificates}

#### الخيار أ: تحدي DNS يدوي (موصى به لمعظم المستخدمين) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# إنشاء الشهادات باستخدام تحدي DNS اليدوي
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**مهم**: عند الطلب، ستحتاج إلى إنشاء سجلات TXT في DNS الخاص بك. قد ترى عدة تحديات لنفس النطاق - **قم بإنشاء جميعها**. لا تقم بإزالة سجل TXT الأول عند إضافة الثاني.

#### الخيار ب: DNS من Cloudflare (إذا كنت تستخدم Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

إذا كان نطاقك يستخدم Cloudflare لـ DNS، يمكنك أتمتة إنشاء الشهادات:

```bash
# إنشاء ملف بيانات اعتماد Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# تعيين الأذونات المناسبة
chmod 600 /root/.cloudflare.ini

# إنشاء الشهادات تلقائيًا
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

بعد إنشاء الشهادات، قم بنسخها إلى دليل التطبيق:

```bash
# نسخ الشهادات إلى دليل SSL الخاص بالتطبيق
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# التحقق من نسخ الشهادات
ls -la "$SELF_HOST_DIR/ssl/"
```

### الخطوة 13: إنشاء مفاتيح التشفير {#step-13-generate-encryption-keys}

قم بإنشاء مفاتيح التشفير المختلفة المطلوبة للتشغيل الآمن:

```bash
# إنشاء مفتاح تشفير مساعد
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# إنشاء سر SRS لإعادة توجيه البريد الإلكتروني
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# إنشاء مفتاح تشفير TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# إنشاء مفتاح DKIM الخاص لتوقيع البريد الإلكتروني
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# إنشاء مفتاح توقيع webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# تعيين كلمة مرور نقل SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ تم إنشاء جميع مفاتيح التشفير بنجاح"
```
### الخطوة 14: تحديث مسارات SSL في التكوين {#step-14-update-ssl-paths-in-configuration}

قم بتكوين مسارات شهادة SSL في ملف البيئة:

```bash
# تحديث مسارات SSL للإشارة إلى ملفات الشهادة الصحيحة
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### الخطوة 15: إعداد المصادقة الأساسية {#step-15-set-up-basic-authentication}

أنشئ بيانات اعتماد المصادقة الأساسية المؤقتة:

```bash
# إنشاء كلمة مرور عشوائية وآمنة
PASSWORD=$(openssl rand -base64 16)

# تحديث ملف البيئة ببيانات اعتماد المصادقة الأساسية
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# عرض بيانات الاعتماد (احفظها!)
echo ""
echo "🔐 مهم: احفظ بيانات اعتماد تسجيل الدخول هذه!"
echo "=================================="
echo "اسم المستخدم: admin"
echo "كلمة المرور: $PASSWORD"
echo "=================================="
echo ""
echo "ستحتاج هذه للوصول إلى واجهة الويب بعد التثبيت."
echo ""
```

### الخطوة 16: النشر باستخدام Docker Compose {#step-16-deploy-with-docker-compose}

ابدأ جميع خدمات Forward Email:

```bash
# تعيين مسار ملف Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# إيقاف أي حاويات موجودة
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# سحب أحدث الصور
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# بدء جميع الخدمات في وضع الخلفية
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# الانتظار قليلاً لبدء الخدمات
sleep 10

# التحقق من حالة الخدمة
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### الخطوة 17: التحقق من التثبيت {#step-17-verify-installation}

تحقق من أن جميع الخدمات تعمل بشكل صحيح:

```bash
# التحقق من حاويات Docker
docker ps

# التحقق من سجلات الخدمة لأي أخطاء
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# اختبار اتصال واجهة الويب
curl -I https://$DOMAIN

# التحقق من استماع المنافذ
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## تكوين ما بعد التثبيت {#post-installation-configuration}

### إعداد سجلات DNS {#dns-records-setup}

تحتاج إلى تكوين سجلات DNS التالية لنطاقك:

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

#### سجل DKIM {#dkim-record}

احصل على مفتاح DKIM العام الخاص بك:

```bash
# استخراج مفتاح DKIM العام
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

أنشئ سجل DKIM في DNS:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### سجل DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### أول تسجيل دخول {#first-login}

1. افتح متصفح الويب وانتقل إلى `https://yourdomain.com`
2. أدخل بيانات اعتماد المصادقة الأساسية التي حفظتها سابقًا
3. أكمل معالج الإعداد الأولي
4. أنشئ حساب البريد الإلكتروني الأول الخاص بك


## تكوين النسخ الاحتياطي {#backup-configuration}

### إعداد النسخ الاحتياطي المتوافق مع S3 {#set-up-s3-compatible-backup}

قم بتكوين النسخ الاحتياطية التلقائية إلى تخزين متوافق مع S3:

```bash
# إنشاء مجلد بيانات اعتماد AWS
mkdir -p ~/.aws

# تكوين بيانات اعتماد AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# تكوين إعدادات AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# بالنسبة إلى S3 غير التابع لـ AWS (مثل Cloudflare R2)، أضف عنوان نقطة النهاية
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### إعداد مهام النسخ الاحتياطي المجدولة {#set-up-backup-cron-jobs}

```bash
# جعل سكربتات النسخ الاحتياطي قابلة للتنفيذ
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# إضافة مهمة النسخ الاحتياطي لـ MongoDB إلى الكرون (تعمل يوميًا عند منتصف الليل)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# إضافة مهمة النسخ الاحتياطي لـ Redis إلى الكرون (تعمل يوميًا عند منتصف الليل)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# التحقق من إضافة مهام الكرون
crontab -l
```


## إعداد التحديث التلقائي {#auto-update-configuration}

قم بإعداد التحديثات التلقائية لتثبيت Forward Email الخاص بك:

```bash
# إنشاء أمر التحديث التلقائي (استخدم أمر docker compose المناسب)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# إضافة مهمة التحديث التلقائي إلى الكرون (تعمل يوميًا عند الساعة 1 صباحًا)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# التحقق من إضافة مهمة الكرون
crontab -l
```


## اعتبارات خاصة بـ Debian {#debian-specific-considerations}

### اختلافات إدارة الحزم {#package-management-differences}

* **Snapd**: غير مثبت افتراضيًا على Debian، يتطلب التثبيت اليدوي
* **Docker**: يستخدم مستودعات Debian ومفاتيح GPG الخاصة به
* **UFW**: قد لا يكون مدرجًا في تثبيتات Debian الحد الأدنى
* **systemd**: قد يختلف السلوك قليلاً عن Ubuntu

### إدارة الخدمات {#service-management}

```bash
# التحقق من حالة الخدمات (أوامر خاصة بـ Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# إعادة تشغيل الخدمات إذا لزم الأمر
systemctl restart snapd
systemctl restart docker
```

### تكوين الشبكة {#network-configuration}

قد يكون لدى Debian أسماء أو تكوينات مختلفة لواجهات الشبكة:

```bash
# التحقق من واجهات الشبكة
ip addr show

# التحقق من التوجيه
ip route show

# التحقق من حل DNS
nslookup google.com
```


## الصيانة والمراقبة {#maintenance-and-monitoring}

### مواقع السجلات {#log-locations}

* **سجلات Docker Compose**: استخدم أمر docker compose المناسب بناءً على التثبيت
* **سجلات النظام**: `/var/log/syslog`
* **سجلات النسخ الاحتياطي**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **سجلات التحديث التلقائي**: `/var/log/autoupdate.log`
* **سجلات Snapd**: `journalctl -u snapd`

### مهام الصيانة الدورية {#regular-maintenance-tasks}

1. **مراقبة مساحة القرص**: `df -h`
2. **التحقق من حالة الخدمات**: استخدم أمر docker compose المناسب
3. **مراجعة السجلات**: تحقق من سجلات التطبيق والنظام
4. **تحديث حزم النظام**: `apt update && apt upgrade`
5. **مراقبة snapd**: `snap list` و `snap refresh`

### تجديد الشهادات {#certificate-renewal}

يجب أن تتجدد الشهادات تلقائيًا، لكن يمكنك تجديدها يدويًا إذا لزم الأمر:

```bash
# تجديد الشهادة يدويًا
certbot renew

# نسخ الشهادات المجددة
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# إعادة تشغيل الخدمات لاستخدام الشهادات الجديدة
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## استكشاف الأخطاء وإصلاحها {#troubleshooting}

### مشاكل خاصة بـ Debian {#debian-specific-issues}

#### 1. عدم عمل Snapd {#1-snapd-not-working}

```bash
# التحقق من حالة snapd
systemctl status snapd

# إعادة تشغيل snapd
systemctl restart snapd

# التحقق من مسار snap
echo $PATH | grep snap

# إضافة snap إلى PATH إذا كان مفقودًا
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. أمر Docker Compose غير موجود {#2-docker-compose-command-not-found}

```bash
# التحقق من الأمر المتوفر لـ docker compose
command -v docker-compose
command -v docker

# استخدام الأمر المناسب في السكربتات
if command -v docker-compose &> /dev/null; then
    echo "استخدام docker-compose"
else
    echo "استخدام docker compose"
fi
```
#### 3. مشاكل تثبيت الحزم {#3-package-installation-issues}

```bash
# تحديث ذاكرة التخزين المؤقت للحزم
apt update

# إصلاح الحزم المعطوبة
apt --fix-broken install

# التحقق من الحزم المحتجزة
apt-mark showhold
```

### المشاكل الشائعة {#common-issues}

#### 1. خدمة Docker لا تبدأ {#1-docker-service-wont-start}

```bash
# التحقق من حالة Docker
systemctl status docker

# التحقق من سجلات Docker
journalctl -u docker

# محاولة بدء تشغيل بديل
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. فشل إنشاء الشهادة {#2-certificate-generation-fails}

* تأكد من أن المنافذ 80 و443 متاحة
* تحقق من أن سجلات DNS تشير إلى خادمك
* تحقق من إعدادات جدار الحماية باستخدام `ufw status`

#### 3. مشاكل تسليم البريد الإلكتروني {#3-email-delivery-issues}

* تحقق من صحة سجلات MX
* تحقق من سجلات SPF وDKIM وDMARC
* تأكد من أن المنفذ 25 غير محظور من قبل مزود الاستضافة الخاص بك

### الحصول على المساعدة {#getting-help}

* **التوثيق**: <https://forwardemail.net/self-hosted>
* **قضايا GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **توثيق Debian**: <https://www.debian.org/doc/>


## أفضل ممارسات الأمان {#security-best-practices}

1. **حافظ على تحديث النظام**: قم بتحديث Debian والحزم بانتظام
2. **مراقبة السجلات**: قم بإعداد مراقبة وتنبيه للسجلات
3. **النسخ الاحتياطي بانتظام**: اختبر إجراءات النسخ الاحتياطي والاستعادة
4. **استخدم كلمات مرور قوية**: أنشئ كلمات مرور قوية لجميع الحسابات
5. **تفعيل Fail2Ban**: فكر في تثبيت fail2ban لمزيد من الأمان
6. **مراجعات أمان دورية**: راجع إعداداتك بشكل دوري
7. **مراقبة Snapd**: حافظ على تحديث حزم snap باستخدام `snap refresh`


## الخاتمة {#conclusion}

يجب أن يكون تثبيت Forward Email المستضاف ذاتيًا الآن مكتملًا ويعمل على Debian. تذكر أن:

1. تقوم بتكوين سجلات DNS بشكل صحيح
2. تختبر إرسال واستقبال البريد الإلكتروني
3. تضبط النسخ الاحتياطية المنتظمة
4. تراقب نظامك بانتظام
5. تحافظ على تحديث التثبيت الخاص بك
6. تراقب snapd وحزم snap

الاختلافات الرئيسية عن Ubuntu هي تثبيت snapd وتكوين مستودع Docker. بمجرد إعداد هذه بشكل صحيح، يعمل تطبيق Forward Email بنفس الطريقة على كلا النظامين.

لخيارات التكوين الإضافية والميزات المتقدمة، راجع التوثيق الرسمي لـ Forward Email على <https://forwardemail.net/self-hosted#configuration>.
