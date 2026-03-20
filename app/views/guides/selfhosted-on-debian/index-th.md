# คู่มือการติดตั้ง Forward Email แบบโฮสต์เองสำหรับ Debian {#forward-email-self-hosting-installation-guide-for-debian}


## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ข้อกำหนดเบื้องต้น](#prerequisites)
* [ความต้องการของระบบ](#system-requirements)
* [การติดตั้งทีละขั้นตอน](#step-by-step-installation)
  * [ขั้นตอนที่ 1: การตั้งค่าระบบเบื้องต้น](#step-1-initial-system-setup)
  * [ขั้นตอนที่ 2: กำหนดค่า DNS Resolvers](#step-2-configure-dns-resolvers)
  * [ขั้นตอนที่ 3: ติดตั้ง Dependencies ของระบบ](#step-3-install-system-dependencies)
  * [ขั้นตอนที่ 4: ติดตั้งและกำหนดค่า Snapd](#step-4-install-and-configure-snapd)
  * [ขั้นตอนที่ 5: ติดตั้งแพ็กเกจ Snap](#step-5-install-snap-packages)
  * [ขั้นตอนที่ 6: ติดตั้ง Docker](#step-6-install-docker)
  * [ขั้นตอนที่ 7: กำหนดค่าบริการ Docker](#step-7-configure-docker-service)
  * [ขั้นตอนที่ 8: ติดตั้งและกำหนดค่าไฟร์วอลล์ UFW](#step-8-install-and-configure-ufw-firewall)
  * [ขั้นตอนที่ 9: โคลน Forward Email Repository](#step-9-clone-forward-email-repository)
  * [ขั้นตอนที่ 10: ตั้งค่าการกำหนดค่าสภาพแวดล้อม](#step-10-set-up-environment-configuration)
  * [ขั้นตอนที่ 11: กำหนดค่าชื่อโดเมนของคุณ](#step-11-configure-your-domain)
  * [ขั้นตอนที่ 12: สร้างใบรับรอง SSL](#step-12-generate-ssl-certificates)
  * [ขั้นตอนที่ 13: สร้างกุญแจเข้ารหัส](#step-13-generate-encryption-keys)
  * [ขั้นตอนที่ 14: อัปเดตเส้นทาง SSL ในการกำหนดค่า](#step-14-update-ssl-paths-in-configuration)
  * [ขั้นตอนที่ 15: ตั้งค่าการพิสูจน์ตัวตนแบบ Basic Authentication](#step-15-set-up-basic-authentication)
  * [ขั้นตอนที่ 16: ดีพลอยด้วย Docker Compose](#step-16-deploy-with-docker-compose)
  * [ขั้นตอนที่ 17: ตรวจสอบการติดตั้ง](#step-17-verify-installation)
* [การกำหนดค่าหลังการติดตั้ง](#post-installation-configuration)
  * [การตั้งค่า DNS Records](#dns-records-setup)
  * [การเข้าสู่ระบบครั้งแรก](#first-login)
* [การสำรองข้อมูล](#backup-configuration)
  * [ตั้งค่าการสำรองข้อมูลแบบเข้ากันได้กับ S3](#set-up-s3-compatible-backup)
  * [ตั้งค่างาน Cron สำหรับการสำรองข้อมูล](#set-up-backup-cron-jobs)
* [การกำหนดค่าอัปเดตอัตโนมัติ](#auto-update-configuration)
* [ข้อควรพิจารณาเฉพาะ Debian](#debian-specific-considerations)
  * [ความแตกต่างในการจัดการแพ็กเกจ](#package-management-differences)
  * [การจัดการบริการ](#service-management)
  * [การกำหนดค่าเครือข่าย](#network-configuration)
* [การบำรุงรักษาและการตรวจสอบ](#maintenance-and-monitoring)
  * [ตำแหน่งของบันทึก](#log-locations)
  * [งานบำรุงรักษาปกติ](#regular-maintenance-tasks)
  * [การต่ออายุใบรับรอง](#certificate-renewal)
* [การแก้ไขปัญหา](#troubleshooting)
  * [ปัญหาเฉพาะ Debian](#debian-specific-issues)
  * [ปัญหาทั่วไป](#common-issues)
  * [การขอความช่วยเหลือ](#getting-help)
* [แนวทางปฏิบัติด้านความปลอดภัยที่ดีที่สุด](#security-best-practices)
* [บทสรุป](#conclusion)


## ภาพรวม {#overview}

คู่มือนี้ให้คำแนะนำทีละขั้นตอนสำหรับการติดตั้งโซลูชัน Forward Email แบบโฮสต์เองบนระบบ Debian คู่มือนี้ออกแบบมาเฉพาะสำหรับ Debian 11 (Bullseye) และ Debian 12 (Bookworm)


## ข้อกำหนดเบื้องต้น {#prerequisites}

ก่อนเริ่มการติดตั้ง โปรดตรวจสอบให้แน่ใจว่าคุณมี:

* **เซิร์ฟเวอร์ Debian**: เวอร์ชัน 11 (Bullseye) หรือ 12 (Bookworm)
* **สิทธิ์ root**: คุณต้องสามารถรันคำสั่งในฐานะ root (เข้าถึง sudo)
* **ชื่อโดเมน**: โดเมนที่คุณควบคุมพร้อมสิทธิ์จัดการ DNS
* **เซิร์ฟเวอร์สะอาด**: แนะนำให้ใช้การติดตั้ง Debian ใหม่
* **การเชื่อมต่ออินเทอร์เน็ต**: จำเป็นสำหรับการดาวน์โหลดแพ็กเกจและอิมเมจ Docker


## ความต้องการของระบบ {#system-requirements}

* **RAM**: อย่างน้อย 2GB (แนะนำ 4GB สำหรับการใช้งานจริง)
* **พื้นที่เก็บข้อมูล**: อย่างน้อย 20GB พื้นที่ว่าง (แนะนำ 50GB+ สำหรับการใช้งานจริง)
* **CPU**: อย่างน้อย 1 vCPU (แนะนำ 2+ vCPU สำหรับการใช้งานจริง)
* **เครือข่าย**: ที่อยู่ IP สาธารณะพร้อมพอร์ตต่อไปนี้ที่สามารถเข้าถึงได้:
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
### Step 2: กำหนดค่า DNS Resolvers {#step-2-configure-dns-resolvers}

กำหนดค่าระบบของคุณให้ใช้เซิร์ฟเวอร์ DNS ของ Cloudflare เพื่อการสร้างใบรับรองที่เชื่อถือได้:

```bash
# หยุดและปิดใช้งาน systemd-resolved หากกำลังทำงานอยู่
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# กำหนดค่า Cloudflare DNS resolvers
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

ติดตั้งแพ็กเกจที่จำเป็นสำหรับ Forward Email บน Debian:

```bash
# อัปเดตรายการแพ็กเกจ
apt-get update -y

# ติดตั้ง dependencies พื้นฐาน (รายการแพ็กเกจเฉพาะ Debian)
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

### Step 4: ติดตั้งและกำหนดค่า Snapd {#step-4-install-and-configure-snapd}

Debian ไม่มี snapd มาให้โดยค่าเริ่มต้น ดังนั้นเราต้องติดตั้งและกำหนดค่า:

```bash
# ติดตั้ง snapd
apt-get install -y snapd

# เปิดใช้งานและเริ่มบริการ snapd
systemctl enable snapd
systemctl start snapd

# สร้าง symlink เพื่อให้ snap ทำงานได้อย่างถูกต้อง
ln -sf /var/lib/snapd/snap /snap

# รอให้ snapd พร้อมใช้งาน
sleep 10

# ตรวจสอบว่า snapd ทำงานได้
snap version
```

### Step 5: ติดตั้ง Snap Packages {#step-5-install-snap-packages}

ติดตั้ง AWS CLI และ Certbot ผ่าน snap:

```bash
# ติดตั้ง AWS CLI
snap install aws-cli --classic

# ติดตั้ง Certbot และปลั๊กอิน DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# ตรวจสอบการติดตั้ง
aws --version
certbot --version
```

### Step 6: ติดตั้ง Docker {#step-6-install-docker}

ติดตั้ง Docker CE และ Docker Compose บน Debian:

```bash
# เพิ่มกุญแจ GPG อย่างเป็นทางการของ Docker (เฉพาะ Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# เพิ่มที่เก็บ Docker (เฉพาะ Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# อัปเดตดัชนีแพ็กเกจและติดตั้ง Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# ติดตั้ง docker-compose แบบสแตนด์อโลนเป็นตัวสำรอง (ถ้าปลั๊กอินไม่ทำงาน)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# ตรวจสอบการติดตั้ง Docker
docker --version
docker compose version || docker-compose --version
```

### Step 7: กำหนดค่าบริการ Docker {#step-7-configure-docker-service}

ตรวจสอบให้แน่ใจว่า Docker เริ่มทำงานโดยอัตโนมัติและกำลังทำงานอยู่:

```bash
# เปิดใช้งานและเริ่มบริการ Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# ตรวจสอบว่า Docker กำลังทำงาน
docker info
```

ถ้า Docker เริ่มทำงานไม่ได้ ให้ลองเริ่มด้วยตนเอง:

```bash
# วิธีเริ่มต้นสำรองหาก systemctl ล้มเหลว
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: ติดตั้งและกำหนดค่า UFW Firewall {#step-8-install-and-configure-ufw-firewall}

การติดตั้ง Debian แบบ minimal อาจไม่มี UFW ดังนั้นให้ติดตั้งก่อน:

```bash
# ติดตั้ง UFW หากยังไม่มี
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# ตั้งค่านโยบายเริ่มต้น
ufw default deny incoming
ufw default allow outgoing

# อนุญาต SSH (สำคัญ - อย่าล็อกตัวเองออก!)
ufw allow 22/tcp

# อนุญาตพอร์ตที่เกี่ยวข้องกับอีเมล
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (สำหรับ Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (พอร์ตทางเลือก)
ufw allow 2995/tcp  # POP3 (พอร์ตทางเลือก)
ufw allow 3456/tcp  # พอร์ตบริการที่กำหนดเอง
ufw allow 4000/tcp  # พอร์ตบริการที่กำหนดเอง
ufw allow 5000/tcp  # พอร์ตบริการที่กำหนดเอง

# อนุญาตการเชื่อมต่อฐานข้อมูลภายในเครื่อง
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# เปิดใช้งานไฟร์วอลล์
echo "y" | ufw enable

# ตรวจสอบสถานะไฟร์วอลล์
ufw status numbered
```
### Step 9: โคลน Forward Email Repository {#step-9-clone-forward-email-repository}

ดาวน์โหลดซอร์สโค้ด Forward Email:

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

### Step 10: ตั้งค่าการกำหนดค่าสภาพแวดล้อม {#step-10-set-up-environment-configuration}

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

### Step 11: กำหนดค่าชื่อโดเมนของคุณ {#step-11-configure-your-domain}

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

### Step 12: สร้างใบรับรอง SSL {#step-12-generate-ssl-certificates}

#### ตัวเลือก A: การท้าทาย DNS แบบแมนนวล (แนะนำสำหรับผู้ใช้ส่วนใหญ่) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**สำคัญ**: เมื่อได้รับแจ้ง คุณจะต้องสร้างระเบียน TXT ใน DNS ของคุณ คุณอาจเห็นการท้าทายหลายรายการสำหรับโดเมนเดียวกัน - **สร้างระเบียนทั้งหมด** อย่าลบระเบียน TXT แรกเมื่อเพิ่มระเบียนที่สอง

#### ตัวเลือก B: Cloudflare DNS (ถ้าคุณใช้ Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

ถ้าโดเมนของคุณใช้ Cloudflare สำหรับ DNS คุณสามารถทำให้การสร้างใบรับรองเป็นอัตโนมัติได้:

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

#### คัดลอกใบรับรอง {#copy-certificates}

หลังจากสร้างใบรับรองแล้ว ให้คัดลอกไปยังไดเรกทอรีแอปพลิเคชัน:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Step 13: สร้างกุญแจเข้ารหัส {#step-13-generate-encryption-keys}

สร้างกุญแจเข้ารหัสต่างๆ ที่จำเป็นสำหรับการทำงานอย่างปลอดภัย:

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
### ขั้นตอนที่ 14: อัปเดตเส้นทาง SSL ในการตั้งค่า {#step-14-update-ssl-paths-in-configuration}

กำหนดเส้นทางใบรับรอง SSL ในไฟล์ environment:

```bash
# อัปเดตเส้นทาง SSL ให้ชี้ไปยังไฟล์ใบรับรองที่ถูกต้อง
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### ขั้นตอนที่ 15: ตั้งค่าการยืนยันตัวตนแบบ Basic {#step-15-set-up-basic-authentication}

สร้างข้อมูลรับรองการยืนยันตัวตนแบบ Basic ชั่วคราว:

```bash
# สร้างรหัสผ่านแบบสุ่มที่ปลอดภัย
PASSWORD=$(openssl rand -base64 16)

# อัปเดตไฟล์ environment ด้วยข้อมูลรับรอง basic auth
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

### ขั้นตอนที่ 16: ดีพลอยด้วย Docker Compose {#step-16-deploy-with-docker-compose}

เริ่มต้นบริการ Forward Email ทั้งหมด:

```bash
# กำหนดเส้นทางไฟล์ Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# หยุดคอนเทนเนอร์ที่มีอยู่
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# ดึงอิมเมจล่าสุด
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# เริ่มบริการทั้งหมดในโหมด detached
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# รอสักครู่ให้บริการเริ่มทำงาน
sleep 10

# ตรวจสอบสถานะบริการ
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### ขั้นตอนที่ 17: ตรวจสอบการติดตั้ง {#step-17-verify-installation}

ตรวจสอบว่าบริการทั้งหมดทำงานอย่างถูกต้อง:

```bash
# ตรวจสอบคอนเทนเนอร์ Docker
docker ps

# ตรวจสอบบันทึกบริการสำหรับข้อผิดพลาดใดๆ
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# ทดสอบการเชื่อมต่อเว็บอินเทอร์เฟซ
curl -I https://$DOMAIN

# ตรวจสอบว่าพอร์ตกำลังฟังอยู่หรือไม่
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## การตั้งค่าหลังการติดตั้ง {#post-installation-configuration}

### การตั้งค่าบันทึก DNS {#dns-records-setup}

คุณต้องกำหนดบันทึก DNS ต่อไปนี้สำหรับโดเมนของคุณ:

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

1. เปิดเว็บเบราว์เซอร์และไปที่ `https://yourdomain.com`
2. ป้อนข้อมูลรับรองการยืนยันตัวตนแบบ basic ที่คุณบันทึกไว้ก่อนหน้านี้
3. ทำตามวิซาร์ดการตั้งค่าเริ่มต้นให้เสร็จสมบูรณ์
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

# สำหรับ S3 ที่ไม่ใช่ AWS (เช่น Cloudflare R2) ให้เพิ่ม URL endpoint
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### ตั้งค่าการสำรองข้อมูลด้วย Cron Jobs {#set-up-backup-cron-jobs}

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


## การตั้งค่าอัปเดตอัตโนมัติ {#auto-update-configuration}

ตั้งค่าให้อัปเดตอัตโนมัติสำหรับการติดตั้ง Forward Email ของคุณ:

```bash
# สร้างคำสั่งอัปเดตอัตโนมัติ (ใช้คำสั่ง docker compose ที่เหมาะสม)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# เพิ่มงาน cron อัปเดตอัตโนมัติ (รันทุกวันตอนตี 1)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# ตรวจสอบว่างาน cron ถูกเพิ่มแล้ว
crontab -l
```


## ข้อควรพิจารณาเฉพาะ Debian {#debian-specific-considerations}

### ความแตกต่างในการจัดการแพ็กเกจ {#package-management-differences}

* **Snapd**: ไม่ได้ติดตั้งมาโดยค่าเริ่มต้นบน Debian ต้องติดตั้งเอง
* **Docker**: ใช้ที่เก็บแพ็กเกจและกุญแจ GPG เฉพาะ Debian
* **UFW**: อาจไม่มีใน Debian แบบติดตั้งแบบ minimal
* **systemd**: พฤติกรรมอาจแตกต่างเล็กน้อยจาก Ubuntu

### การจัดการบริการ {#service-management}

```bash
# ตรวจสอบสถานะบริการ (คำสั่งเฉพาะ Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# รีสตาร์ทบริการถ้าจำเป็น
systemctl restart snapd
systemctl restart docker
```

### การตั้งค่าเครือข่าย {#network-configuration}

Debian อาจมีชื่อหรือการตั้งค่าอินเทอร์เฟซเครือข่ายที่แตกต่าง:

```bash
# ตรวจสอบอินเทอร์เฟซเครือข่าย
ip addr show

# ตรวจสอบเส้นทางเครือข่าย
ip route show

# ตรวจสอบการแก้ไขชื่อ DNS
nslookup google.com
```


## การบำรุงรักษาและการตรวจสอบ {#maintenance-and-monitoring}

### ตำแหน่งบันทึกล็อก {#log-locations}

* **ล็อก Docker Compose**: ใช้คำสั่ง docker compose ที่เหมาะสมตามการติดตั้ง
* **ล็อกระบบ**: `/var/log/syslog`
* **ล็อกสำรองข้อมูล**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **ล็อกอัปเดตอัตโนมัติ**: `/var/log/autoupdate.log`
* **ล็อก Snapd**: `journalctl -u snapd`

### งานบำรุงรักษาปกติ {#regular-maintenance-tasks}

1. **ตรวจสอบพื้นที่ดิสก์**: `df -h`
2. **ตรวจสอบสถานะบริการ**: ใช้คำสั่ง docker compose ที่เหมาะสม
3. **ตรวจสอบล็อก**: ตรวจสอบทั้งล็อกแอปพลิเคชันและระบบ
4. **อัปเดตแพ็กเกจระบบ**: `apt update && apt upgrade`
5. **ตรวจสอบ snapd**: `snap list` และ `snap refresh`

### การต่ออายุใบรับรอง {#certificate-renewal}

ใบรับรองควรต่ออายุอัตโนมัติ แต่คุณสามารถต่ออายุด้วยตนเองได้ถ้าจำเป็น:

```bash
# ต่ออายุใบรับรองด้วยตนเอง
certbot renew

# คัดลอกใบรับรองที่ต่ออายุแล้ว
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# รีสตาร์ทบริการเพื่อใช้ใบรับรองใหม่
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## การแก้ไขปัญหา {#troubleshooting}

### ปัญหาเฉพาะ Debian {#debian-specific-issues}

#### 1. Snapd ไม่ทำงาน {#1-snapd-not-working}

```bash
# ตรวจสอบสถานะ snapd
systemctl status snapd

# รีสตาร์ท snapd
systemctl restart snapd

# ตรวจสอบ path ของ snap
echo $PATH | grep snap

# เพิ่ม snap ใน PATH ถ้าไม่มี
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. คำสั่ง Docker Compose ไม่พบ {#2-docker-compose-command-not-found}

```bash
# ตรวจสอบคำสั่ง docker compose ที่มีอยู่
command -v docker-compose
command -v docker

# ใช้คำสั่งที่เหมาะสมในสคริปต์
if command -v docker-compose &> /dev/null; then
    echo "ใช้ docker-compose"
else
    echo "ใช้ docker compose"
fi
```
#### 3. ปัญหาการติดตั้งแพ็กเกจ {#3-package-installation-issues}

```bash
# อัปเดตแคชแพ็กเกจ
apt update

# แก้ไขแพ็กเกจที่เสียหาย
apt --fix-broken install

# ตรวจสอบแพ็กเกจที่ถูกล็อก
apt-mark showhold
```

### ปัญหาทั่วไป {#common-issues}

#### 1. บริการ Docker ไม่เริ่มทำงาน {#1-docker-service-wont-start}

```bash
# ตรวจสอบสถานะ Docker
systemctl status docker

# ตรวจสอบบันทึก Docker
journalctl -u docker

# ลองเริ่มต้นแบบทางเลือก
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. การสร้างใบรับรองล้มเหลว {#2-certificate-generation-fails}

* ตรวจสอบให้แน่ใจว่าเปิดพอร์ต 80 และ 443
* ยืนยันว่าบันทึก DNS ชี้ไปยังเซิร์ฟเวอร์ของคุณ
* ตรวจสอบการตั้งค่าไฟร์วอลล์ด้วย `ufw status`

#### 3. ปัญหาการส่งอีเมล {#3-email-delivery-issues}

* ยืนยันว่าบันทึก MX ถูกต้อง
* ตรวจสอบบันทึก SPF, DKIM และ DMARC
* ตรวจสอบให้แน่ใจว่าพอร์ต 25 ไม่ถูกบล็อกโดยผู้ให้บริการโฮสติ้งของคุณ

### การขอความช่วยเหลือ {#getting-help}

* **เอกสารประกอบ**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **เอกสาร Debian**: <https://www.debian.org/doc/>


## แนวทางปฏิบัติด้านความปลอดภัยที่ดีที่สุด {#security-best-practices}

1. **อัปเดตระบบอย่างสม่ำเสมอ**: อัปเดต Debian และแพ็กเกจอย่างสม่ำเสมอ
2. **ตรวจสอบบันทึก**: ตั้งค่าการตรวจสอบและแจ้งเตือนบันทึก
3. **สำรองข้อมูลเป็นประจำ**: ทดสอบกระบวนการสำรองและกู้คืนข้อมูล
4. **ใช้รหัสผ่านที่แข็งแรง**: สร้างรหัสผ่านที่แข็งแรงสำหรับทุกบัญชี
5. **เปิดใช้งาน Fail2Ban**: พิจารณาติดตั้ง fail2ban เพื่อความปลอดภัยเพิ่มเติม
6. **ตรวจสอบความปลอดภัยเป็นระยะ**: ทบทวนการตั้งค่าของคุณเป็นระยะ
7. **ตรวจสอบ Snapd**: อัปเดตแพ็กเกจ snap ด้วยคำสั่ง `snap refresh`


## สรุป {#conclusion}

การติดตั้ง Forward Email แบบโฮสต์เองของคุณควรเสร็จสมบูรณ์และทำงานบน Debian แล้ว โปรดจำไว้ว่า:

1. กำหนดค่าบันทึก DNS ของคุณอย่างถูกต้อง
2. ทดสอบการส่งและรับอีเมล
3. ตั้งค่าการสำรองข้อมูลเป็นประจำ
4. ตรวจสอบระบบของคุณอย่างสม่ำเสมอ
5. อัปเดตการติดตั้งของคุณอย่างต่อเนื่อง
6. ตรวจสอบ snapd และแพ็กเกจ snap

ความแตกต่างหลักจาก Ubuntu คือการติดตั้ง snapd และการตั้งค่าที่เก็บ Docker เมื่อกำหนดค่าเหล่านี้อย่างถูกต้อง แอป Forward Email จะทำงานเหมือนกันทั้งสองระบบ

สำหรับตัวเลือกการตั้งค่าเพิ่มเติมและฟีเจอร์ขั้นสูง โปรดดูเอกสารอย่างเป็นทางการของ Forward Email ที่ <https://forwardemail.net/self-hosted#configuration>.
