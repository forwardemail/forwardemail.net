# คู่มือการติดตั้ง Forward Email แบบโฮสต์เองสำหรับ Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ข้อกำหนดเบื้องต้น](#prerequisites)
* [ความต้องการของระบบ](#system-requirements)
* [การติดตั้งทีละขั้นตอน](#step-by-step-installation)
  * [ขั้นตอนที่ 1: การตั้งค่าระบบเบื้องต้น](#step-1-initial-system-setup)
  * [ขั้นตอนที่ 2: กำหนดค่า DNS Resolvers](#step-2-configure-dns-resolvers)
  * [ขั้นตอนที่ 3: ติดตั้ง Dependencies ของระบบ](#step-3-install-system-dependencies)
  * [ขั้นตอนที่ 4: ติดตั้งแพ็กเกจ Snap](#step-4-install-snap-packages)
  * [ขั้นตอนที่ 5: ติดตั้ง Docker](#step-5-install-docker)
  * [ขั้นตอนที่ 6: กำหนดค่าบริการ Docker](#step-6-configure-docker-service)
  * [ขั้นตอนที่ 7: กำหนดค่าไฟร์วอลล์](#step-7-configure-firewall)
  * [ขั้นตอนที่ 8: โคลนที่เก็บ Forward Email](#step-8-clone-forward-email-repository)
  * [ขั้นตอนที่ 9: ตั้งค่าการกำหนดค่าสภาพแวดล้อม](#step-9-set-up-environment-configuration)
  * [ขั้นตอนที่ 10: กำหนดค่าโดเมนของคุณ](#step-10-configure-your-domain)
  * [ขั้นตอนที่ 11: สร้างใบรับรอง SSL](#step-11-generate-ssl-certificates)
  * [ขั้นตอนที่ 12: สร้างกุญแจเข้ารหัส](#step-12-generate-encryption-keys)
  * [ขั้นตอนที่ 13: อัปเดตเส้นทาง SSL ในการกำหนดค่า](#step-13-update-ssl-paths-in-configuration)
  * [ขั้นตอนที่ 14: ตั้งค่าการตรวจสอบสิทธิ์พื้นฐาน](#step-14-set-up-basic-authentication)
  * [ขั้นตอนที่ 15: ดีพลอยด้วย Docker Compose](#step-15-deploy-with-docker-compose)
  * [ขั้นตอนที่ 16: ตรวจสอบการติดตั้ง](#step-16-verify-installation)
* [การกำหนดค่าหลังการติดตั้ง](#post-installation-configuration)
  * [การตั้งค่าบันทึก DNS](#dns-records-setup)
  * [การเข้าสู่ระบบครั้งแรก](#first-login)
* [การสำรองข้อมูล](#backup-configuration)
  * [ตั้งค่าการสำรองข้อมูลแบบเข้ากันได้กับ S3](#set-up-s3-compatible-backup)
  * [ตั้งค่างาน Cron สำหรับสำรองข้อมูล](#set-up-backup-cron-jobs)
* [การกำหนดค่าอัปเดตอัตโนมัติ](#auto-update-configuration)
* [การบำรุงรักษาและการตรวจสอบ](#maintenance-and-monitoring)
  * [ตำแหน่งบันทึก](#log-locations)
  * [งานบำรุงรักษาปกติ](#regular-maintenance-tasks)
  * [การต่ออายุใบรับรอง](#certificate-renewal)
* [การแก้ไขปัญหา](#troubleshooting)
  * [ปัญหาที่พบบ่อย](#common-issues)
  * [การขอความช่วยเหลือ](#getting-help)
* [แนวทางปฏิบัติด้านความปลอดภัยที่ดีที่สุด](#security-best-practices)
* [บทสรุป](#conclusion)


## ภาพรวม {#overview}

คู่มือนี้ให้คำแนะนำทีละขั้นตอนสำหรับการติดตั้งโซลูชัน Forward Email แบบโฮสต์เองบนระบบ Ubuntu คู่มือนี้ออกแบบมาเฉพาะสำหรับเวอร์ชัน Ubuntu 20.04, 22.04 และ 24.04 LTS


## ข้อกำหนดเบื้องต้น {#prerequisites}

ก่อนเริ่มการติดตั้ง โปรดตรวจสอบให้แน่ใจว่าคุณมี:

* **Ubuntu Server**: 20.04, 22.04 หรือ 24.04 LTS
* **สิทธิ์ root**: คุณต้องสามารถรันคำสั่งในฐานะ root (เข้าถึง sudo)
* **ชื่อโดเมน**: โดเมนที่คุณควบคุมพร้อมสิทธิ์จัดการ DNS
* **เซิร์ฟเวอร์สะอาด**: แนะนำให้ใช้การติดตั้ง Ubuntu ใหม่
* **การเชื่อมต่ออินเทอร์เน็ต**: จำเป็นสำหรับการดาวน์โหลดแพ็กเกจและอิมเมจ Docker


## ความต้องการของระบบ {#system-requirements}

* **RAM**: อย่างน้อย 2GB (แนะนำ 4GB สำหรับการใช้งานจริง)
* **พื้นที่เก็บข้อมูล**: อย่างน้อย 20GB พื้นที่ว่าง (แนะนำ 50GB+ สำหรับการใช้งานจริง)
* **CPU**: อย่างน้อย 1 vCPU (แนะนำ 2+ vCPU สำหรับการใช้งานจริง)
* **เครือข่าย**: ที่อยู่ IP สาธารณะพร้อมพอร์ตต่อไปนี้ที่เข้าถึงได้:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## การติดตั้งทีละขั้นตอน {#step-by-step-installation}

### ขั้นตอนที่ 1: การตั้งค่าระบบเบื้องต้น {#step-1-initial-system-setup}

ก่อนอื่น ให้แน่ใจว่าระบบของคุณเป็นเวอร์ชันล่าสุดและสลับไปยังผู้ใช้ root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### ขั้นตอนที่ 2: กำหนดค่า DNS Resolvers {#step-2-configure-dns-resolvers}

กำหนดค่าระบบของคุณให้ใช้ DNS ของ Cloudflare เพื่อความน่าเชื่อถือในการสร้างใบรับรอง:

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
### Step 3: ติดตั้ง Dependencies ของระบบ {#step-3-install-system-dependencies}

ติดตั้งแพ็กเกจที่จำเป็นสำหรับ Forward Email:

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

### Step 4: ติดตั้งแพ็กเกจ Snap {#step-4-install-snap-packages}

ติดตั้ง AWS CLI และ Certbot ผ่าน snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: ติดตั้ง Docker {#step-5-install-docker}

ติดตั้ง Docker CE และ Docker Compose:

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

### Step 6: กำหนดค่า Docker Service {#step-6-configure-docker-service}

ตรวจสอบให้แน่ใจว่า Docker เริ่มทำงานโดยอัตโนมัติและกำลังทำงานอยู่:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

หาก Docker เริ่มทำงานไม่สำเร็จ ให้ลองเริ่มด้วยตนเอง:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 7: กำหนดค่า Firewall {#step-7-configure-firewall}

ตั้งค่าไฟร์วอลล์ UFW เพื่อปกป้องเซิร์ฟเวอร์ของคุณ:

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

### Step 8: โคลน Forward Email Repository {#step-8-clone-forward-email-repository}

ดาวน์โหลดซอร์สโค้ดของ Forward Email:

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

### Step 9: ตั้งค่าการกำหนดค่าสภาพแวดล้อม {#step-9-set-up-environment-configuration}

เตรียมการกำหนดค่าสภาพแวดล้อม:

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

### Step 10: กำหนดค่าชื่อโดเมนของคุณ {#step-10-configure-your-domain}

ตั้งชื่อโดเมนของคุณและอัปเดตตัวแปรสภาพแวดล้อม:

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
### ขั้นตอนที่ 11: สร้างใบรับรอง SSL {#step-11-generate-ssl-certificates}

#### ตัวเลือก A: การท้าทาย DNS ด้วยตนเอง (แนะนำสำหรับผู้ใช้ส่วนใหญ่) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# สร้างใบรับรองโดยใช้การท้าทาย DNS ด้วยตนเอง
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**สำคัญ**: เมื่อมีการแจ้งเตือน คุณจะต้องสร้างระเบียน TXT ใน DNS ของคุณ อาจเห็นการท้าทายหลายรายการสำหรับโดเมนเดียวกัน - **สร้างทั้งหมด** อย่าลบระเบียน TXT แรกเมื่อเพิ่มระเบียนที่สอง

#### ตัวเลือก B: Cloudflare DNS (ถ้าคุณใช้ Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

ถ้าโดเมนของคุณใช้ Cloudflare สำหรับ DNS คุณสามารถทำให้การสร้างใบรับรองเป็นอัตโนมัติได้:

```bash
# สร้างไฟล์ข้อมูลรับรอง Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# ตั้งค่าสิทธิ์ที่เหมาะสม
chmod 600 /root/.cloudflare.ini

# สร้างใบรับรองโดยอัตโนมัติ
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### คัดลอกใบรับรอง {#copy-certificates}

หลังจากสร้างใบรับรองแล้ว ให้คัดลอกไปยังไดเรกทอรีแอปพลิเคชัน:

```bash
# คัดลอกใบรับรองไปยังไดเรกทอรี SSL ของแอปพลิเคชัน
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# ตรวจสอบว่าใบรับรองถูกคัดลอกแล้ว
ls -la "$SELF_HOST_DIR/ssl/"
```

### ขั้นตอนที่ 12: สร้างกุญแจเข้ารหัส {#step-12-generate-encryption-keys}

สร้างกุญแจเข้ารหัสต่างๆ ที่จำเป็นสำหรับการทำงานอย่างปลอดภัย:

```bash
# สร้างกุญแจช่วยเข้ารหัส
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# สร้างความลับ SRS สำหรับการส่งต่ออีเมล
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# สร้างกุญแจเข้ารหัส TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# สร้างกุญแจส่วนตัว DKIM สำหรับการลงนามอีเมล
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# สร้างกุญแจลายเซ็น webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# ตั้งรหัสผ่านสำหรับการส่ง SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ สร้างกุญแจเข้ารหัสทั้งหมดสำเร็จ"
```

### ขั้นตอนที่ 13: อัปเดตเส้นทาง SSL ในการตั้งค่า {#step-13-update-ssl-paths-in-configuration}

กำหนดเส้นทางใบรับรอง SSL ในไฟล์ environment:

```bash
# อัปเดตเส้นทาง SSL ให้ชี้ไปยังไฟล์ใบรับรองที่ถูกต้อง
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### ขั้นตอนที่ 14: ตั้งค่าการตรวจสอบสิทธิ์พื้นฐาน {#step-14-set-up-basic-authentication}

สร้างข้อมูลรับรองการตรวจสอบสิทธิ์พื้นฐานชั่วคราว:

```bash
# สร้างรหัสผ่านสุ่มที่ปลอดภัย
PASSWORD=$(openssl rand -base64 16)

# อัปเดตไฟล์ environment ด้วยข้อมูลรับรองการตรวจสอบสิทธิ์พื้นฐาน
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# แสดงข้อมูลรับรอง (โปรดบันทึกไว้!)
echo ""
echo "🔐 สำคัญ: โปรดบันทึกข้อมูลเข้าสู่ระบบเหล่านี้!"
echo "=================================="
echo "ชื่อผู้ใช้: admin"
echo "รหัสผ่าน: $PASSWORD"
echo "=================================="
echo ""
echo "คุณจะต้องใช้ข้อมูลเหล่านี้เพื่อเข้าถึงเว็บอินเทอร์เฟซหลังการติดตั้ง"
echo ""
```

### ขั้นตอนที่ 15: ติดตั้งด้วย Docker Compose {#step-15-deploy-with-docker-compose}

เริ่มบริการ Forward Email ทั้งหมด:

```bash
# กำหนดเส้นทางไฟล์ Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# หยุดคอนเทนเนอร์ที่มีอยู่
docker compose -f "$DOCKER_COMPOSE_FILE" down

# ดึงอิมเมจล่าสุด
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# เริ่มบริการทั้งหมดในโหมด detached
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# รอสักครู่เพื่อให้บริการเริ่มทำงาน
sleep 10

# ตรวจสอบสถานะบริการ
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### ขั้นตอนที่ 16: ตรวจสอบการติดตั้ง {#step-16-verify-installation}

ตรวจสอบให้แน่ใจว่าบริการทั้งหมดทำงานอย่างถูกต้อง:

```bash
# ตรวจสอบคอนเทนเนอร์ Docker
docker ps

# ตรวจสอบบันทึกบริการสำหรับข้อผิดพลาดใดๆ
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# ทดสอบการเชื่อมต่ออินเทอร์เฟซเว็บ
curl -I https://$DOMAIN

# ตรวจสอบว่าพอร์ตกำลังฟังอยู่หรือไม่
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## การตั้งค่าหลังการติดตั้ง {#post-installation-configuration}

### การตั้งค่าบันทึก DNS {#dns-records-setup}

คุณต้องกำหนดค่าบันทึก DNS ต่อไปนี้สำหรับโดเมนของคุณ:

#### บันทึก MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### บันทึก A {#a-records}

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

#### บันทึก SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### บันทึก DKIM {#dkim-record}

รับคีย์สาธารณะ DKIM ของคุณ:

```bash
# ดึงคีย์สาธารณะ DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

สร้างบันทึก DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### บันทึก DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### การเข้าสู่ระบบครั้งแรก {#first-login}

1. เปิดเว็บเบราว์เซอร์ของคุณและไปที่ `https://yourdomain.com`
2. ป้อนข้อมูลรับรองการยืนยันตัวตนพื้นฐานที่คุณบันทึกไว้ก่อนหน้านี้
3. ทำตามวิซาร์ดการตั้งค่าเริ่มต้นให้เสร็จสิ้น
4. สร้างบัญชีอีเมลแรกของคุณ


## การตั้งค่าการสำรองข้อมูล {#backup-configuration}

### ตั้งค่าการสำรองข้อมูลแบบเข้ากันได้กับ S3 {#set-up-s3-compatible-backup}

กำหนดค่าการสำรองข้อมูลอัตโนมัติไปยังที่เก็บข้อมูลแบบเข้ากันได้กับ S3:

```bash
# สร้างไดเรกทอรีข้อมูลรับรอง AWS
mkdir -p ~/.aws

# กำหนดค่าข้อมูลรับรอง AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# กำหนดค่าการตั้งค่า AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# สำหรับ S3 ที่ไม่ใช่ AWS (เช่น Cloudflare R2) ให้เพิ่ม URL จุดสิ้นสุด
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### ตั้งค่างาน cron สำรองข้อมูล {#set-up-backup-cron-jobs}

```bash
# ทำให้สคริปต์สำรองข้อมูลสามารถรันได้
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# เพิ่มงาน cron สำรองข้อมูล MongoDB (รันทุกวันตอนเที่ยงคืน)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# เพิ่มงาน cron สำรองข้อมูล Redis (รันทุกวันตอนเที่ยงคืน)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# ตรวจสอบว่างาน cron ถูกเพิ่มแล้ว
crontab -l
```


## การตั้งค่าการอัปเดตอัตโนมัติ {#auto-update-configuration}

ตั้งค่าการอัปเดตอัตโนมัติสำหรับการติดตั้ง Forward Email ของคุณ:

```bash
# สร้างคำสั่งอัปเดตอัตโนมัติ
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# เพิ่มงาน cron อัปเดตอัตโนมัติ (รันทุกวันตอน 1 โมงเช้า)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# ตรวจสอบว่างาน cron ถูกเพิ่มแล้ว
crontab -l
```


## การบำรุงรักษาและการตรวจสอบ {#maintenance-and-monitoring}

### ตำแหน่งบันทึก {#log-locations}

* **บันทึก Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **บันทึกระบบ**: `/var/log/syslog`
* **บันทึกการสำรองข้อมูล**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **บันทึกการอัปเดตอัตโนมัติ**: `/var/log/autoupdate.log`

### งานบำรุงรักษาปกติ {#regular-maintenance-tasks}

1. **ตรวจสอบพื้นที่ดิสก์**: `df -h`
2. **ตรวจสอบสถานะบริการ**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **ตรวจสอบบันทึก**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **อัปเดตแพ็กเกจระบบ**: `apt update && apt upgrade`
5. **ต่ออายุใบรับรอง**: ใบรับรองจะต่ออายุอัตโนมัติ แต่ควรตรวจสอบวันหมดอายุ

### การต่ออายุใบรับรอง {#certificate-renewal}

ใบรับรองควรต่ออายุอัตโนมัติ แต่คุณสามารถต่ออายุด้วยตนเองหากจำเป็น:

```bash
# ต่ออายุใบรับรองด้วยตนเอง
certbot renew

# คัดลอกใบรับรองที่ต่ออายุแล้ว
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# รีสตาร์ทบริการเพื่อใช้ใบรับรองใหม่
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## การแก้ไขปัญหา {#troubleshooting}

### ปัญหาทั่วไป {#common-issues}

#### 1. บริการ Docker ไม่เริ่มทำงาน {#1-docker-service-wont-start}

```bash
# ตรวจสอบสถานะ Docker
systemctl status docker

# ลองเริ่มต้นใช้งานแบบทางเลือก
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. การสร้างใบรับรองล้มเหลว {#2-certificate-generation-fails}

* ตรวจสอบให้แน่ใจว่า port 80 และ 443 สามารถเข้าถึงได้
* ยืนยันว่า DNS records ชี้ไปยังเซิร์ฟเวอร์ของคุณ
* ตรวจสอบการตั้งค่าไฟร์วอลล์

#### 3. ปัญหาการส่งอีเมล {#3-email-delivery-issues}

* ตรวจสอบว่า MX records ถูกต้อง
* ตรวจสอบ SPF, DKIM และ DMARC records
* ตรวจสอบว่า port 25 ไม่ถูกบล็อกโดยผู้ให้บริการโฮสติ้งของคุณ

#### 4. ไม่สามารถเข้าถึงเว็บอินเทอร์เฟซ {#4-web-interface-not-accessible}

* ตรวจสอบการตั้งค่าไฟร์วอลล์: `ufw status`
* ยืนยันใบรับรอง SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* ตรวจสอบข้อมูลรับรองการยืนยันตัวตนแบบ basic auth

### การขอความช่วยเหลือ {#getting-help}

* **เอกสารประกอบ**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **ชุมชนสนับสนุน**: ตรวจสอบการสนทนาใน GitHub ของโครงการ


## แนวทางปฏิบัติด้านความปลอดภัยที่ดีที่สุด {#security-best-practices}

1. **อัปเดตระบบอย่างสม่ำเสมอ**: อัปเดต Ubuntu และแพ็กเกจต่างๆ อย่างสม่ำเสมอ
2. **ตรวจสอบบันทึก**: ตั้งค่าการตรวจสอบและแจ้งเตือนบันทึก
3. **สำรองข้อมูลเป็นประจำ**: ทดสอบกระบวนการสำรองและกู้คืนข้อมูล
4. **ใช้รหัสผ่านที่แข็งแรง**: สร้างรหัสผ่านที่แข็งแรงสำหรับบัญชีทั้งหมด
5. **เปิดใช้งาน Fail2Ban**: พิจารณาติดตั้ง fail2ban เพื่อเพิ่มความปลอดภัย
6. **ตรวจสอบความปลอดภัยเป็นประจำ**: ทบทวนการตั้งค่าของคุณเป็นระยะ


## สรุป {#conclusion}

การติดตั้ง Forward Email แบบโฮสต์เองของคุณควรเสร็จสมบูรณ์และทำงานบน Ubuntu แล้ว โปรดจำไว้ว่า:

1. กำหนดค่า DNS records ของคุณอย่างถูกต้อง
2. ทดสอบการส่งและรับอีเมล
3. ตั้งค่าการสำรองข้อมูลเป็นประจำ
4. ตรวจสอบระบบของคุณอย่างสม่ำเสมอ
5. อัปเดตการติดตั้งของคุณอย่างต่อเนื่อง

สำหรับตัวเลือกการกำหนดค่าเพิ่มเติมและฟีเจอร์ขั้นสูง โปรดดูเอกสารอย่างเป็นทางการของ Forward Email ที่ <https://forwardemail.net/self-hosted#configuration>.
