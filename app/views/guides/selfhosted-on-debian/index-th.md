# คู่มือการติดตั้งการโฮสต์อีเมลด้วยตนเองสำหรับ Debian {#forward-email-self-hosting-installation-guide-for-debian}

## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ข้อกำหนดเบื้องต้น](#prerequisites)
* [ความต้องการของระบบ](#system-requirements)
* [การติดตั้งแบบทีละขั้นตอน](#step-by-step-installation)
  * [ขั้นตอนที่ 1: การตั้งค่าระบบเบื้องต้น](#step-1-initial-system-setup)
  * [ขั้นตอนที่ 2: กำหนดค่าตัวแก้ไข DNS](#step-2-configure-dns-resolvers)
  * [ขั้นตอนที่ 3: ติดตั้งระบบที่ขึ้นอยู่กับระบบ](#step-3-install-system-dependencies)
  * [ขั้นตอนที่ 4: ติดตั้งและกำหนดค่า Snapd](#step-4-install-and-configure-snapd)
  * [ขั้นตอนที่ 5: ติดตั้งแพ็คเกจ Snap](#step-5-install-snap-packages)
  * [ขั้นตอนที่ 6: ติดตั้ง Docker](#step-6-install-docker)
  * [ขั้นตอนที่ 7: กำหนดค่าบริการ Docker](#step-7-configure-docker-service)
  * [ขั้นตอนที่ 8: ติดตั้งและกำหนดค่าไฟร์วอลล์ UFW](#step-8-install-and-configure-ufw-firewall)
  * [ขั้นตอนที่ 9: โคลนที่เก็บข้อมูลอีเมลส่งต่อ](#step-9-clone-forward-email-repository)
  * [ขั้นตอนที่ 10: ตั้งค่าการกำหนดค่าสภาพแวดล้อม](#step-10-set-up-environment-configuration)
  * [ขั้นตอนที่ 11: กำหนดค่าโดเมนของคุณ](#step-11-configure-your-domain)
  * [ขั้นตอนที่ 12: สร้างใบรับรอง SSL](#step-12-generate-ssl-certificates)
  * [ขั้นตอนที่ 13: สร้างคีย์การเข้ารหัส](#step-13-generate-encryption-keys)
  * [ขั้นตอนที่ 14: อัปเดตเส้นทาง SSL ในการกำหนดค่า](#step-14-update-ssl-paths-in-configuration)
  * [ขั้นตอนที่ 15: ตั้งค่าการตรวจสอบสิทธิ์พื้นฐาน](#step-15-set-up-basic-authentication)
  * [ขั้นตอนที่ 16: ปรับใช้ด้วย Docker Compose](#step-16-deploy-with-docker-compose)
  * [ขั้นตอนที่ 17: ตรวจสอบการติดตั้ง](#step-17-verify-installation)
* [การกำหนดค่าหลังการติดตั้ง](#post-installation-configuration)
  * [การตั้งค่าระเบียน DNS](#dns-records-setup)
  * [การเข้าสู่ระบบครั้งแรก](#first-login)
* [การกำหนดค่าการสำรองข้อมูล](#backup-configuration)
  * [ตั้งค่าการสำรองข้อมูลที่เข้ากันได้กับ S3](#set-up-s3-compatible-backup)
  * [ตั้งค่างาน Cron สำรอง](#set-up-backup-cron-jobs)
* [การกำหนดค่าการอัพเดทอัตโนมัติ](#auto-update-configuration)
* [ข้อควรพิจารณาเฉพาะสำหรับ Debian](#debian-specific-considerations)
  * [ความแตกต่างในการจัดการแพ็คเกจ](#package-management-differences)
  * [การจัดการการบริการ](#service-management)
  * [การกำหนดค่าเครือข่าย](#network-configuration)
* [การบำรุงรักษาและการติดตาม](#maintenance-and-monitoring)
  * [ตำแหน่งการบันทึก](#log-locations)
  * [งานบำรุงรักษาตามปกติ](#regular-maintenance-tasks)
  * [การต่ออายุใบรับรอง](#certificate-renewal)
* [การแก้ไขปัญหา](#troubleshooting)
  * [ปัญหาเฉพาะของ Debian](#debian-specific-issues)
  * [ปัญหาทั่วไป](#common-issues)
  * [การได้รับความช่วยเหลือ](#getting-help)
* [แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย](#security-best-practices)
* [บทสรุป](#conclusion)

## ภาพรวม {#overview}

คู่มือนี้ให้คำแนะนำทีละขั้นตอนสำหรับการติดตั้งโซลูชันโฮสต์ด้วยตนเองของ Forward Email บนระบบ Debian คู่มือนี้ออกแบบมาโดยเฉพาะสำหรับ Debian 11 (Bullseye) และ Debian 12 (Bookworm)

## ข้อกำหนดเบื้องต้น {#prerequisites}

ก่อนจะเริ่มการติดตั้ง ให้แน่ใจว่าคุณมี:

* **เซิร์ฟเวอร์ Debian**: เวอร์ชัน 11 (Bullseye) หรือ 12 (Bookworm)
* **สิทธิ์การเข้าถึงรูท**: คุณต้องสามารถเรียกใช้คำสั่งในฐานะรูทได้ (สิทธิ์การเข้าถึง sudo)
* **ชื่อโดเมน**: โดเมนที่คุณควบคุมด้วยสิทธิ์การเข้าถึงการจัดการ DNS
* **เซิร์ฟเวอร์สะอาด**: แนะนำให้ใช้การติดตั้ง Debian ใหม่
* **การเชื่อมต่ออินเทอร์เน็ต**: จำเป็นสำหรับการดาวน์โหลดแพ็คเกจและอิมเมจ Docker

## ข้อกำหนดของระบบ {#system-requirements}

* **RAM**: ขั้นต่ำ 2GB (แนะนำให้ใช้ 4GB สำหรับการผลิต)
* **พื้นที่เก็บข้อมูล**: พื้นที่ว่างขั้นต่ำ 20GB (แนะนำให้ใช้ 50GB+ สำหรับการผลิต)
* **CPU**: ขั้นต่ำ 1 vCPU (แนะนำให้ใช้ 2+ vCPU สำหรับการผลิต)
* **เครือข่าย**: ที่อยู่ IP สาธารณะพร้อมพอร์ตต่อไปนี้ที่สามารถเข้าถึงได้:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## การติดตั้งทีละขั้นตอน {#step-by-step-installation}

### ขั้นตอนที่ 1: การตั้งค่าระบบเริ่มต้น {#step-1-initial-system-setup}

ขั้นแรก ให้แน่ใจว่าระบบของคุณเป็นเวอร์ชันล่าสุดแล้ว และเปลี่ยนเป็นผู้ใช้รูท:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### ขั้นตอนที่ 2: กำหนดค่าตัวแก้ไข DNS {#step-2-configure-dns-resolvers}

กำหนดค่าระบบของคุณให้ใช้เซิร์ฟเวอร์ DNS ของ Cloudflare เพื่อการสร้างใบรับรองที่เชื่อถือได้:

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

### ขั้นตอนที่ 3: ติดตั้งการอ้างอิงระบบ {#step-3-install-system-dependencies}

ติดตั้งแพ็คเกจที่จำเป็นสำหรับการส่งต่ออีเมลบน Debian:

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

### ขั้นตอนที่ 4: ติดตั้งและกำหนดค่า Snapd {#step-4-install-and-configure-snapd}

Debian ไม่รวม snapd ไว้ตามค่าเริ่มต้น ดังนั้นเราจำเป็นต้องติดตั้งและกำหนดค่า:

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

### ขั้นตอนที่ 5: ติดตั้งแพ็คเกจ Snap {#step-5-install-snap-packages}

ติดตั้ง AWS CLI และ Certbot ผ่าน snap:

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

### ขั้นตอนที่ 6: ติดตั้ง Docker {#step-6-install-docker}

ติดตั้ง Docker CE และ Docker Compose บน Debian:

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

### ขั้นตอนที่ 7: กำหนดค่าบริการ Docker {#step-7-configure-docker-service}

ตรวจสอบให้แน่ใจว่า Docker เริ่มทำงานโดยอัตโนมัติและกำลังทำงาน:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

หาก Docker ไม่สามารถเริ่มต้นได้ ให้ลองเริ่มด้วยตนเอง:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### ขั้นตอนที่ 8: ติดตั้งและกำหนดค่าไฟร์วอลล์ UFW {#step-8-install-and-configure-ufw-firewall}

การติดตั้ง Debian ขั้นต่ำอาจไม่รวม UFW ดังนั้นให้ติดตั้งก่อน:

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

### ขั้นตอนที่ 9: โคลนที่เก็บข้อมูลอีเมลแบบส่งต่อ {#step-9-clone-forward-email-repository}

ดาวน์โหลดซอร์สโค้ดการส่งต่ออีเมล:

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

### ขั้นตอนที่ 10: ตั้งค่าการกำหนดค่าสภาพแวดล้อม {#step-10-set-up-environment-configuration}

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

### ขั้นตอนที่ 11: กำหนดค่าโดเมนของคุณ {#step-11-configure-your-domain}

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

### ขั้นตอนที่ 12: สร้างใบรับรอง SSL {#step-12-generate-ssl-certificates}

#### ตัวเลือก A: การท้าทาย DNS ด้วยตนเอง (แนะนำสำหรับผู้ใช้ส่วนใหญ่) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**สำคัญ**: เมื่อได้รับแจ้ง คุณจะต้องสร้างระเบียน TXT ใน DNS ของคุณ คุณอาจเห็นปัญหาหลายรายการสำหรับโดเมนเดียวกัน - **สร้างทั้งหมด** อย่าลบระเบียน TXT แรกเมื่อเพิ่มระเบียนที่สอง

#### ตัวเลือก B: Cloudflare DNS (หากคุณใช้ Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

หากโดเมนของคุณใช้ Cloudflare สำหรับ DNS คุณสามารถทำให้การสร้างใบรับรองเป็นแบบอัตโนมัติได้:

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

หลังจากสร้างใบรับรองแล้ว ให้คัดลอกไปยังไดเร็กทอรีแอปพลิเคชัน:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### ขั้นตอนที่ 13: สร้างคีย์การเข้ารหัส {#step-13-generate-encryption-keys}

สร้างคีย์การเข้ารหัสต่างๆ ที่จำเป็นสำหรับการดำเนินการที่ปลอดภัย:

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

### ขั้นตอนที่ 14: อัปเดตเส้นทาง SSL ในการกำหนดค่า {#step-14-update-ssl-paths-in-configuration}

กำหนดค่าเส้นทางใบรับรอง SSL ในไฟล์สภาพแวดล้อม:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### ขั้นตอนที่ 15: ตั้งค่าการตรวจสอบสิทธิ์พื้นฐาน {#step-15-set-up-basic-authentication}

สร้างข้อมูลประจำตัวการตรวจสอบพื้นฐานชั่วคราว:

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

### ขั้นตอนที่ 16: ปรับใช้ด้วย Docker Compose {#step-16-deploy-with-docker-compose}

เริ่มต้นบริการส่งต่ออีเมล์ทั้งหมด:

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

### ขั้นตอนที่ 17: ตรวจสอบการติดตั้ง {#step-17-verify-installation}

ตรวจสอบว่าบริการทั้งหมดทำงานอย่างถูกต้อง:

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

## การกำหนดค่าหลังการติดตั้ง {#post-installation-configuration}

### การตั้งค่าระเบียน DNS {#dns-records-setup}

คุณต้องกำหนดค่าระเบียน DNS ต่อไปนี้สำหรับโดเมนของคุณ:

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
# Extract DKIM public key
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
2. ป้อนข้อมูลรับรองพื้นฐานที่คุณบันทึกไว้ก่อนหน้านี้
3. ทำตามขั้นตอนในตัวช่วยการตั้งค่าเริ่มต้นให้เสร็จสมบูรณ์
4. สร้างบัญชีอีเมลแรกของคุณ

## การกำหนดค่าการสำรองข้อมูล {#backup-configuration}

### ตั้งค่าการสำรองข้อมูลที่เข้ากันได้กับ S3 {#set-up-s3-compatible-backup}

กำหนดค่าการสำรองข้อมูลอัตโนมัติไปยังที่เก็บข้อมูลที่รองรับ S3:

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

### ตั้งค่างาน Cron สำรอง {#set-up-backup-cron-jobs}

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

## การกำหนดค่าการอัปเดตอัตโนมัติ {#auto-update-configuration}

ตั้งค่าการอัปเดตอัตโนมัติสำหรับการติดตั้ง Forward Email ของคุณ:

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

## ข้อควรพิจารณาเฉพาะ Debian {#debian-specific-considerations}

### ความแตกต่างในการจัดการแพ็คเกจ {#package-management-differences}

* **Snapd**: ไม่ได้ติดตั้งตามค่าเริ่มต้นบน Debian ต้องติดตั้งด้วยตนเอง
* **Docker**: ใช้คลังข้อมูลเฉพาะของ Debian และคีย์ GPG
* **UFW**: อาจไม่รวมอยู่ในโปรแกรมติดตั้ง Debian ขั้นต่ำ
* **systemd**: การทำงานอาจแตกต่างจาก Ubuntu เล็กน้อย

### การจัดการบริการ {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### การกำหนดค่าเครือข่าย {#network-configuration}

Debian อาจมีชื่อหรือการกำหนดค่าอินเทอร์เฟซเครือข่ายที่แตกต่างกัน:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## การบำรุงรักษาและการตรวจสอบ {#maintenance-and-monitoring}

### ตำแหน่งบันทึก {#log-locations}

* **บันทึก Docker Compose**: ใช้คำสั่ง docker compose ที่เหมาะสมตามการติดตั้ง
* **บันทึกระบบ**: `/var/log/syslog`
* **บันทึกการสำรองข้อมูล**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **อัปเดตบันทึกอัตโนมัติ**: `/var/log/autoupdate.log`
* **บันทึก Snapd**: `journalctl -u snapd`

### งานบำรุงรักษาปกติ {#regular-maintenance-tasks}

1. **ตรวจสอบพื้นที่ดิสก์**: `df -h`
2. **ตรวจสอบสถานะบริการ**: ใช้คำสั่ง docker compose ที่เหมาะสม
3. **ตรวจสอบบันทึก**: ตรวจสอบบันทึกทั้งแอปพลิเคชันและระบบ
4. **อัปเดตแพ็กเกจระบบ**: `apt update && apt upgrade`
5. **ตรวจสอบ snapd**: `snap list` และ `snap refresh`

### การต่ออายุใบรับรอง {#certificate-renewal}

ใบรับรองควรจะต่ออายุโดยอัตโนมัติ แต่คุณสามารถต่ออายุด้วยตนเองได้หากจำเป็น:

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

## การแก้ไขปัญหา {#troubleshooting}

### ปัญหาเฉพาะของ Debian {#debian-specific-issues}

#### 1. Snapd ไม่ทำงาน {#1-snapd-not-working}

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

#### 2. ไม่พบคำสั่ง Docker Compose {#2-docker-compose-command-not-found}

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

#### 3. ปัญหาการติดตั้งแพ็คเกจ {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### ปัญหาทั่วไป {#common-issues}

#### 1. บริการ Docker จะไม่เริ่มต้น {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. การสร้างใบรับรองล้มเหลว {#2-certificate-generation-fails}

* ตรวจสอบให้แน่ใจว่าสามารถเข้าถึงพอร์ต 80 และ 443 ได้
* ตรวจสอบว่าระเบียน DNS ชี้ไปที่เซิร์ฟเวอร์ของคุณ
* ตรวจสอบการตั้งค่าไฟร์วอลล์ด้วย `ufw status`

#### 3. ปัญหาในการส่งอีเมล {#3-email-delivery-issues}

* ตรวจสอบว่าระเบียน MX ถูกต้อง
* ตรวจสอบระเบียน SPF, DKIM และ DMARC
* ตรวจสอบว่าพอร์ต 25 ไม่ถูกบล็อกโดยผู้ให้บริการโฮสติ้งของคุณ

### รับความช่วยเหลือ {#getting-help}

* **เอกสาร**: <https://forwardemail.net/self-hosted>
* **ปัญหา GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **เอกสาร Debian**: <https://www.debian.org/doc/>

## แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย {#security-best-practices}

1. **อัปเดตระบบอยู่เสมอ**: อัปเดต Debian และแพ็กเกจเป็นประจำ
2. **ตรวจสอบบันทึก**: ตั้งค่าการตรวจสอบและแจ้งเตือนบันทึก
3. **สำรองข้อมูลเป็นประจำ**: ทดสอบขั้นตอนการสำรองข้อมูลและกู้คืน
4. **ใช้รหัสผ่านที่แข็งแกร่ง**: สร้างรหัสผ่านที่แข็งแกร่งสำหรับบัญชีทั้งหมด
5. **เปิดใช้งาน Fail2Ban**: พิจารณาติดตั้ง fail2ban เพื่อความปลอดภัยเพิ่มเติม
6. **การตรวจสอบความปลอดภัยเป็นประจำ**: ตรวจสอบการกำหนดค่าของคุณเป็นระยะๆ
7. **ตรวจสอบ Snapd**: อัปเดตแพ็กเกจ snap ด้วย `snap refresh`

## บทสรุป {#conclusion}

ตอนนี้การติดตั้ง Forward Email แบบโฮสต์ด้วยตนเองของคุณควรจะเสร็จสมบูรณ์และทำงานบน Debian แล้ว โปรดจำไว้ว่า:

1. กำหนดค่าระเบียน DNS ของคุณอย่างถูกต้อง
2. ทดสอบการส่งและรับอีเมล
3. ตั้งค่าการสำรองข้อมูลเป็นประจำ
4. ตรวจสอบระบบของคุณเป็นประจำ
5. อัปเดตการติดตั้งของคุณอยู่เสมอ
6. ตรวจสอบแพ็คเกจ snapd และ snap

ความแตกต่างหลักจาก Ubuntu คือการติดตั้ง snapd และการกำหนดค่าคลัง Docker เมื่อตั้งค่าเหล่านี้อย่างถูกต้องแล้ว แอปพลิเคชัน Forward Email จะทำงานเหมือนกันในทั้งสองระบบ

สำหรับตัวเลือกการกำหนดค่าเพิ่มเติมและคุณลักษณะขั้นสูง โปรดดูเอกสารการส่งต่ออีเมลอย่างเป็นทางการที่ <https://forwardemail.net/self-hosted#configuration>.