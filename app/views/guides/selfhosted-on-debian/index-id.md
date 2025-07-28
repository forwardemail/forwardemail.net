# Panduan Instalasi Email Teruskan Hosting Mandiri untuk Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Daftar Isi {#table-of-contents}

* [Ringkasan](#overview)
* [Prasyarat](#prerequisites)
* [Persyaratan Sistem](#system-requirements)
* [Instalasi Langkah demi Langkah](#step-by-step-installation)
  * [Langkah 1: Pengaturan Sistem Awal](#step-1-initial-system-setup)
  * [Langkah 2: Konfigurasikan DNS Resolver](#step-2-configure-dns-resolvers)
  * [Langkah 3: Instal Ketergantungan Sistem](#step-3-install-system-dependencies)
  * [Langkah 4: Instal dan Konfigurasi Snapd](#step-4-install-and-configure-snapd)
  * [Langkah 5: Instal Paket Snap](#step-5-install-snap-packages)
  * [Langkah 6: Instal Docker](#step-6-install-docker)
  * [Langkah 7: Konfigurasikan Layanan Docker](#step-7-configure-docker-service)
  * [Langkah 8: Instal dan Konfigurasikan Firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Langkah 9: Kloning Repositori Email Teruskan](#step-9-clone-forward-email-repository)
  * [Langkah 10: Siapkan Konfigurasi Lingkungan](#step-10-set-up-environment-configuration)
  * [Langkah 11: Konfigurasikan Domain Anda](#step-11-configure-your-domain)
  * [Langkah 12: Hasilkan Sertifikat SSL](#step-12-generate-ssl-certificates)
  * [Langkah 13: Hasilkan Kunci Enkripsi](#step-13-generate-encryption-keys)
  * [Langkah 14: Perbarui Jalur SSL dalam Konfigurasi](#step-14-update-ssl-paths-in-configuration)
  * [Langkah 15: Siapkan Autentikasi Dasar](#step-15-set-up-basic-authentication)
  * [Langkah 16: Deploy dengan Docker Compose](#step-16-deploy-with-docker-compose)
  * [Langkah 17: Verifikasi Instalasi](#step-17-verify-installation)
* [Konfigurasi Pasca-Instalasi](#post-installation-configuration)
  * [Pengaturan Catatan DNS](#dns-records-setup)
  * [Login Pertama](#first-login)
* [Konfigurasi Cadangan](#backup-configuration)
  * [Siapkan Cadangan yang Kompatibel dengan S3](#set-up-s3-compatible-backup)
  * [Siapkan Pekerjaan Cron Cadangan](#set-up-backup-cron-jobs)
* [Konfigurasi Pembaruan Otomatis](#auto-update-configuration)
* [Pertimbangan Khusus Debian](#debian-specific-considerations)
  * [Perbedaan Manajemen Paket](#package-management-differences)
  * [Manajemen Layanan](#service-management)
  * [Konfigurasi Jaringan](#network-configuration)
* [Pemeliharaan dan Pemantauan](#maintenance-and-monitoring)
  * [Lokasi Log](#log-locations)
  * [Tugas Pemeliharaan Rutin](#regular-maintenance-tasks)
  * [Perpanjangan Sertifikat](#certificate-renewal)
* [Pemecahan Masalah](#troubleshooting)
  * [Masalah Khusus Debian](#debian-specific-issues)
  * [Masalah Umum](#common-issues)
  * [Mendapatkan Bantuan](#getting-help)
* [Praktik Terbaik Keamanan](#security-best-practices)
* [Kesimpulan](#conclusion)

## Ikhtisar {#overview}

Panduan ini memberikan petunjuk langkah demi langkah untuk menginstal solusi self-hosted Forward Email di sistem Debian. Panduan ini dirancang khusus untuk Debian 11 (Bullseye) dan Debian 12 (Bookworm).

## Prasyarat {#prerequisites}

Sebelum memulai instalasi, pastikan Anda memiliki:

* **Server Debian**: Versi 11 (Bullseye) atau 12 (Bookworm)
* **Akses Root**: Anda harus dapat menjalankan perintah sebagai root (akses sudo)
* **Nama Domain**: Domain yang Anda kendalikan dengan akses manajemen DNS
* **Server Bersih**: Disarankan menggunakan instalasi Debian baru
* **Koneksi Internet**: Diperlukan untuk mengunduh paket dan image Docker

## Persyaratan Sistem {#system-requirements}

* **RAM**: Minimal 2GB (disarankan 4GB untuk produksi)
* **Penyimpanan**: Minimal 20GB ruang kosong (disarankan 50GB+ untuk produksi)
* **CPU**: Minimal 1 vCPU (disarankan 2+ vCPU untuk produksi)
* **Jaringan**: Alamat IP publik dengan port berikut yang dapat diakses:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Instalasi Langkah demi Langkah {#step-by-step-installation}

### Langkah 1: Pengaturan Sistem Awal {#step-1-initial-system-setup}

Pertama, pastikan sistem Anda sudah diperbarui dan beralihlah ke pengguna root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Langkah 2: Konfigurasikan DNS Resolver {#step-2-configure-dns-resolvers}

Konfigurasikan sistem Anda untuk menggunakan server DNS Cloudflare untuk pembuatan sertifikat yang andal:

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

### Langkah 3: Instal Ketergantungan Sistem {#step-3-install-system-dependencies}

Instal paket yang diperlukan untuk Forward Email di Debian:

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

### Langkah 4: Instal dan Konfigurasi Snapd {#step-4-install-and-configure-snapd}

Debian tidak menyertakan snapd secara default, jadi kita perlu menginstal dan mengonfigurasinya:

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

### Langkah 5: Instal Paket Snap {#step-5-install-snap-packages}

Instal AWS CLI dan Certbot melalui snap:

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

### Langkah 6: Instal Docker {#step-6-install-docker}

Instal Docker CE dan Docker Compose di Debian:

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

### Langkah 7: Konfigurasikan Layanan Docker {#step-7-configure-docker-service}

Pastikan Docker dimulai secara otomatis dan berjalan:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Jika Docker gagal memulai, coba memulainya secara manual:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Langkah 8: Instal dan Konfigurasikan Firewall UFW {#step-8-install-and-configure-ufw-firewall}

Instalasi minimal Debian mungkin tidak menyertakan UFW, jadi instal terlebih dahulu:

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

### Langkah 9: Kloning Repositori Email Penerusan {#step-9-clone-forward-email-repository}

Unduh kode sumber Email Teruskan:

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

### Langkah 10: Siapkan Konfigurasi Lingkungan {#step-10-set-up-environment-configuration}

Siapkan konfigurasi lingkungan:

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

### Langkah 11: Konfigurasikan Domain Anda {#step-11-configure-your-domain}

Tetapkan nama domain Anda dan perbarui variabel lingkungan:

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

### Langkah 12: Buat Sertifikat SSL {#step-12-generate-ssl-certificates}

#### Opsi A: Tantangan DNS Manual (Disarankan untuk sebagian besar pengguna) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Penting**: Saat diminta, Anda perlu membuat data TXT di DNS Anda. Anda mungkin melihat beberapa tantangan untuk domain yang sama - **buat SEMUANYA**. Jangan hapus data TXT pertama saat menambahkan yang kedua.

#### Opsi B: DNS Cloudflare (Jika Anda menggunakan Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jika domain Anda menggunakan Cloudflare untuk DNS, Anda dapat mengotomatiskan pembuatan sertifikat:

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

#### Salin Sertifikat {#copy-certificates}

Setelah sertifikat dibuat, salin ke direktori aplikasi:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Langkah 13: Hasilkan Kunci Enkripsi {#step-13-generate-encryption-keys}

Buat berbagai kunci enkripsi yang diperlukan untuk operasi yang aman:

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

### Langkah 14: Perbarui Jalur SSL dalam Konfigurasi {#step-14-update-ssl-paths-in-configuration}

Konfigurasikan jalur sertifikat SSL dalam file lingkungan:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Langkah 15: Siapkan Autentikasi Dasar {#step-15-set-up-basic-authentication}

Buat kredensial autentikasi dasar sementara:

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

### Langkah 16: Deploy dengan Docker Compose {#step-16-deploy-with-docker-compose}

Mulai semua layanan Email Teruskan:

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

### Langkah 17: Verifikasi Instalasi {#step-17-verify-installation}

Periksa apakah semua layanan berjalan dengan benar:

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

## Konfigurasi Pasca-Instalasi {#post-installation-configuration}

### Penyiapan Rekaman DNS {#dns-records-setup}

Anda perlu mengonfigurasi catatan DNS berikut untuk domain Anda:

#### Rekaman MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

Rekaman A {####

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

#### Rekaman SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Rekaman DKIM {#dkim-record}

Dapatkan kunci publik DKIM Anda:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Buat rekaman DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Rekaman DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Login Pertama {#first-login}

1. Buka peramban web Anda dan navigasikan ke `https://yourdomain.com`
2. Masukkan kredensial autentikasi dasar yang Anda simpan sebelumnya
3. Selesaikan panduan pengaturan awal
4. Buat akun email pertama Anda

## Konfigurasi Pencadangan {#backup-configuration}

### Siapkan Cadangan yang Kompatibel dengan S3 {#set-up-s3-compatible-backup}

Konfigurasikan pencadangan otomatis ke penyimpanan yang kompatibel dengan S3:

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

### Siapkan Pekerjaan Cron Cadangan {#set-up-backup-cron-jobs}

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

## Konfigurasi Pembaruan Otomatis {#auto-update-configuration}

Siapkan pembaruan otomatis untuk instalasi Email Terusan Anda:

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

## Pertimbangan Khusus Debian {#debian-specific-considerations}

### Perbedaan Manajemen Paket {#package-management-differences}

* **Snapd**: Tidak terinstal secara default di Debian, memerlukan instalasi manual
* **Docker**: Menggunakan repositori khusus Debian dan kunci GPG
* **UFW**: Mungkin tidak disertakan dalam instalasi minimal Debian
* **systemd**: Perilakunya mungkin sedikit berbeda dari Ubuntu

### Manajemen Layanan {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Konfigurasi Jaringan {#network-configuration}

Debian mungkin memiliki nama antarmuka jaringan atau konfigurasi yang berbeda:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Pemeliharaan dan Pemantauan {#maintenance-and-monitoring}

### Lokasi Log {#log-locations}

**Log Docker Compose**: Gunakan perintah Docker Compose yang sesuai berdasarkan instalasi
* **Log Sistem**: `/var/log/syslog`
* **Log Cadangan**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Log Pembaruan Otomatis**: `/var/log/autoupdate.log`
* **Log Snapd**: `journalctl -u snapd`

### Tugas Pemeliharaan Reguler {#regular-maintenance-tasks}

1. **Pantau ruang disk**: `df -h`
2. **Periksa status layanan**: Gunakan perintah docker compose yang sesuai
3. **Tinjau log**: Periksa log aplikasi dan sistem
4. **Perbarui paket sistem**: `apt update && apt upgrade`
5. **Pantau snapd**: `snap list` dan `snap refresh`

### Pembaruan Sertifikat {#certificate-renewal}

Sertifikat harus diperbarui secara otomatis, tetapi Anda dapat memperbaruinya secara manual jika diperlukan:

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

## Pemecahan Masalah {#troubleshooting}

### Masalah Khusus Debian {#debian-specific-issues}

#### 1. Snapd Tidak Berfungsi {#1-snapd-not-working}

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

#### 2. Perintah Docker Compose Tidak Ditemukan {#2-docker-compose-command-not-found}

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

#### 3. Masalah Instalasi Paket {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Masalah Umum {#common-issues}

#### 1. Layanan Docker Tidak Dapat Dimulai {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Pembuatan Sertifikat Gagal {#2-certificate-generation-fails}

* Pastikan port 80 dan 443 dapat diakses
* Pastikan data DNS mengarah ke server Anda
* Periksa pengaturan firewall dengan `ufw status`

#### 3. Masalah Pengiriman Email {#3-email-delivery-issues}

* Pastikan data MX sudah benar
* Periksa data SPF, DKIM, dan DMARC
* Pastikan port 25 tidak diblokir oleh penyedia hosting Anda

### Mendapatkan Bantuan {#getting-help}

**Dokumentasi**: <https://forwardemail.net/self-hosted>
* **Masalah GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Dokumentasi Debian**: <https://www.debian.org/doc/>

## Praktik Terbaik Keamanan {#security-best-practices}

1. **Pastikan Sistem Tetap Terkini**: Perbarui Debian dan paket secara berkala
2. **Pantau Log**: Atur pemantauan dan pemberitahuan log
3. **Cadangkan Secara Berkala**: Uji prosedur pencadangan dan pemulihan
4. **Gunakan Kata Sandi yang Kuat**: Buat kata sandi yang kuat untuk semua akun
5. **Aktifkan Fail2Ban**: Pertimbangkan untuk menginstal fail2ban untuk keamanan tambahan
6. **Audit Keamanan Berkala**: Tinjau konfigurasi Anda secara berkala
7. **Pantau Snapd**: Pastikan paket snap selalu diperbarui dengan `snap refresh`

## Kesimpulan {#conclusion}

Instalasi Forward Email self-hosted Anda sekarang sudah selesai dan berjalan di Debian. Jangan lupa untuk:

1. Konfigurasikan rekaman DNS Anda dengan benar
2. Uji pengiriman dan penerimaan email
3. Siapkan pencadangan rutin
4. Pantau sistem Anda secara berkala
5. Selalu perbarui instalasi Anda
6. Pantau paket snapd dan snap

Perbedaan utama dari Ubuntu terletak pada instalasi snapd dan konfigurasi repositori Docker. Setelah keduanya diatur dengan benar, aplikasi Forward Email akan berfungsi sama di kedua sistem.

Untuk opsi konfigurasi tambahan dan fitur lanjutan, lihat dokumentasi Forward Email resmi di <https://forwardemail.net/self-hosted#configuration>.