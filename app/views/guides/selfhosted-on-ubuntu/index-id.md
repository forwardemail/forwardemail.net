# Panduan Instalasi Self-Hosting Forward Email untuk Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Daftar Isi {#table-of-contents}

* [Ikhtisar](#overview)
* [Prasyarat](#prerequisites)
* [Persyaratan Sistem](#system-requirements)
* [Instalasi Langkah demi Langkah](#step-by-step-installation)
  * [Langkah 1: Pengaturan Sistem Awal](#step-1-initial-system-setup)
  * [Langkah 2: Konfigurasi DNS Resolver](#step-2-configure-dns-resolvers)
  * [Langkah 3: Instalasi Dependensi Sistem](#step-3-install-system-dependencies)
  * [Langkah 4: Instalasi Paket Snap](#step-4-install-snap-packages)
  * [Langkah 5: Instalasi Docker](#step-5-install-docker)
  * [Langkah 6: Konfigurasi Layanan Docker](#step-6-configure-docker-service)
  * [Langkah 7: Konfigurasi Firewall](#step-7-configure-firewall)
  * [Langkah 8: Clone Repository Forward Email](#step-8-clone-forward-email-repository)
  * [Langkah 9: Siapkan Konfigurasi Lingkungan](#step-9-set-up-environment-configuration)
  * [Langkah 10: Konfigurasikan Domain Anda](#step-10-configure-your-domain)
  * [Langkah 11: Buat Sertifikat SSL](#step-11-generate-ssl-certificates)
  * [Langkah 12: Buat Kunci Enkripsi](#step-12-generate-encryption-keys)
  * [Langkah 13: Perbarui Jalur SSL dalam Konfigurasi](#step-13-update-ssl-paths-in-configuration)
  * [Langkah 14: Siapkan Otentikasi Dasar](#step-14-set-up-basic-authentication)
  * [Langkah 15: Deploy dengan Docker Compose](#step-15-deploy-with-docker-compose)
  * [Langkah 16: Verifikasi Instalasi](#step-16-verify-installation)
* [Konfigurasi Pasca-Instalasi](#post-installation-configuration)
  * [Pengaturan Rekaman DNS](#dns-records-setup)
  * [Login Pertama](#first-login)
* [Konfigurasi Backup](#backup-configuration)
  * [Siapkan Backup Kompatibel S3](#set-up-s3-compatible-backup)
  * [Siapkan Cron Job Backup](#set-up-backup-cron-jobs)
* [Konfigurasi Pembaruan Otomatis](#auto-update-configuration)
* [Pemeliharaan dan Pemantauan](#maintenance-and-monitoring)
  * [Lokasi Log](#log-locations)
  * [Tugas Pemeliharaan Rutin](#regular-maintenance-tasks)
  * [Perpanjangan Sertifikat](#certificate-renewal)
* [Pemecahan Masalah](#troubleshooting)
  * [Masalah Umum](#common-issues)
  * [Mendapatkan Bantuan](#getting-help)
* [Praktik Terbaik Keamanan](#security-best-practices)
* [Kesimpulan](#conclusion)


## Ikhtisar {#overview}

Panduan ini memberikan instruksi langkah demi langkah untuk menginstal solusi self-hosted Forward Email pada sistem Ubuntu. Panduan ini secara khusus disesuaikan untuk versi Ubuntu 20.04, 22.04, dan 24.04 LTS.


## Prasyarat {#prerequisites}

Sebelum memulai instalasi, pastikan Anda memiliki:

* **Ubuntu Server**: 20.04, 22.04, atau 24.04 LTS
* **Akses Root**: Anda harus dapat menjalankan perintah sebagai root (akses sudo)
* **Nama Domain**: Domain yang Anda kendalikan dengan akses manajemen DNS
* **Server Bersih**: Disarankan menggunakan instalasi Ubuntu yang baru
* **Koneksi Internet**: Diperlukan untuk mengunduh paket dan image Docker


## Persyaratan Sistem {#system-requirements}

* **RAM**: Minimum 2GB (4GB disarankan untuk produksi)
* **Penyimpanan**: Minimum 20GB ruang tersedia (50GB+ disarankan untuk produksi)
* **CPU**: Minimum 1 vCPU (2+ vCPU disarankan untuk produksi)
* **Jaringan**: Alamat IP publik dengan port berikut dapat diakses:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Instalasi Langkah demi Langkah {#step-by-step-installation}

### Langkah 1: Pengaturan Sistem Awal {#step-1-initial-system-setup}

Pertama, pastikan sistem Anda diperbarui dan beralih ke pengguna root:

```bash
# Update paket sistem
sudo apt update && sudo apt upgrade -y

# Beralih ke pengguna root (diperlukan untuk instalasi)
sudo su -
```

### Langkah 2: Konfigurasi DNS Resolver {#step-2-configure-dns-resolvers}

Konfigurasikan sistem Anda untuk menggunakan server DNS Cloudflare agar pembuatan sertifikat lebih andal:

```bash
# Hentikan dan nonaktifkan systemd-resolved jika sedang berjalan
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Konfigurasikan resolver DNS Cloudflare
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
### Langkah 3: Instalasi Dependensi Sistem {#step-3-install-system-dependencies}

Instal paket yang dibutuhkan untuk Forward Email:

```bash
# Perbarui daftar paket
apt-get update -y

# Instal dependensi dasar
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Langkah 4: Instal Paket Snap {#step-4-install-snap-packages}

Instal AWS CLI dan Certbot melalui snap:

```bash
# Instal AWS CLI
snap install aws-cli --classic

# Instal Certbot dan plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Langkah 5: Instal Docker {#step-5-install-docker}

Instal Docker CE dan Docker Compose:

```bash
# Tambahkan kunci GPG resmi Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Tambahkan repositori Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Perbarui indeks paket dan instal Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verifikasi instalasi Docker
docker --version
docker compose version
```

### Langkah 6: Konfigurasi Layanan Docker {#step-6-configure-docker-service}

Pastikan Docker mulai secara otomatis dan berjalan:

```bash
# Aktifkan dan mulai layanan Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verifikasi Docker berjalan
docker info
```

Jika Docker gagal mulai, coba mulai secara manual:

```bash
# Metode alternatif memulai jika systemctl gagal
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Langkah 7: Konfigurasi Firewall {#step-7-configure-firewall}

Atur firewall UFW untuk mengamankan server Anda:

```bash
# Atur kebijakan default
ufw default deny incoming
ufw default allow outgoing

# Izinkan SSH (penting - jangan terkunci keluar!)
ufw allow 22/tcp

# Izinkan port terkait email
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (untuk Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (port alternatif)
ufw allow 2995/tcp  # POP3 (port alternatif)
ufw allow 3456/tcp  # Port layanan khusus
ufw allow 4000/tcp  # Port layanan khusus
ufw allow 5000/tcp  # Port layanan khusus

# Izinkan koneksi database lokal
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Aktifkan firewall
echo "y" | ufw enable

# Periksa status firewall
ufw status numbered
```

### Langkah 8: Clone Repository Forward Email {#step-8-clone-forward-email-repository}

Unduh kode sumber Forward Email:

```bash
# Atur variabel
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clone repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verifikasi clone berhasil
ls -la
```

### Langkah 9: Siapkan Konfigurasi Lingkungan {#step-9-set-up-environment-configuration}

Persiapkan konfigurasi lingkungan:

```bash
# Atur variabel direktori
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Salin file lingkungan default
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Buat direktori SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Buat direktori database
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Langkah 10: Konfigurasikan Domain Anda {#step-10-configure-your-domain}

Tetapkan nama domain Anda dan perbarui variabel lingkungan:

```bash
# Ganti 'yourdomain.com' dengan domain Anda yang sebenarnya
DOMAIN="yourdomain.com"

# Fungsi untuk memperbarui file lingkungan
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Perbarui variabel lingkungan terkait domain
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
### Langkah 11: Hasilkan Sertifikat SSL {#step-11-generate-ssl-certificates}

#### Opsi A: Tantangan DNS Manual (Direkomendasikan untuk kebanyakan pengguna) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Hasilkan sertifikat menggunakan tantangan DNS manual
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Penting**: Saat diminta, Anda perlu membuat catatan TXT di DNS Anda. Anda mungkin melihat beberapa tantangan untuk domain yang sama - **buat SEMUA dari mereka**. Jangan hapus catatan TXT pertama saat menambahkan yang kedua.

#### Opsi B: Cloudflare DNS (Jika Anda menggunakan Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jika domain Anda menggunakan Cloudflare untuk DNS, Anda dapat mengotomatisasi pembuatan sertifikat:

```bash
# Buat file kredensial Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Atur izin yang tepat
chmod 600 /root/.cloudflare.ini

# Hasilkan sertifikat secara otomatis
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

Setelah pembuatan sertifikat, salin ke direktori aplikasi:

```bash
# Salin sertifikat ke direktori SSL aplikasi
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verifikasi sertifikat telah disalin
ls -la "$SELF_HOST_DIR/ssl/"
```

### Langkah 12: Hasilkan Kunci Enkripsi {#step-12-generate-encryption-keys}

Buat berbagai kunci enkripsi yang diperlukan untuk operasi yang aman:

```bash
# Hasilkan kunci enkripsi pembantu
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Hasilkan rahasia SRS untuk penerusan email
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Hasilkan kunci enkripsi TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Hasilkan kunci privat DKIM untuk penandatanganan email
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Hasilkan kunci tanda tangan webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Atur kata sandi transport SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Semua kunci enkripsi berhasil dibuat"
```

### Langkah 13: Perbarui Jalur SSL dalam Konfigurasi {#step-13-update-ssl-paths-in-configuration}

Konfigurasikan jalur sertifikat SSL di file lingkungan:

```bash
# Perbarui jalur SSL untuk menunjuk ke file sertifikat yang benar
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Langkah 14: Atur Otentikasi Dasar {#step-14-set-up-basic-authentication}

Buat kredensial otentikasi dasar sementara:

```bash
# Hasilkan kata sandi acak yang aman
PASSWORD=$(openssl rand -base64 16)

# Perbarui file lingkungan dengan kredensial otentikasi dasar
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Tampilkan kredensial (simpan ini!)
echo ""
echo "🔐 PENTING: Simpan kredensial login ini!"
echo "=================================="
echo "Nama Pengguna: admin"
echo "Kata Sandi: $PASSWORD"
echo "=================================="
echo ""
echo "Anda akan memerlukan ini untuk mengakses antarmuka web setelah instalasi."
echo ""
```

### Langkah 15: Deploy dengan Docker Compose {#step-15-deploy-with-docker-compose}

Mulai semua layanan Forward Email:

```bash
# Atur jalur file Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Hentikan kontainer yang ada
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Tarik gambar terbaru
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Mulai semua layanan dalam mode terpisah
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Tunggu sebentar agar layanan mulai
sleep 10

# Periksa status layanan
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Langkah 16: Verifikasi Instalasi {#step-16-verify-installation}

Periksa bahwa semua layanan berjalan dengan benar:

```bash
# Periksa kontainer Docker
docker ps

# Periksa log layanan untuk kesalahan
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Uji konektivitas antarmuka web
curl -I https://$DOMAIN

# Periksa apakah port sedang mendengarkan
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Konfigurasi Pasca-Instalasi {#post-installation-configuration}

### Pengaturan Rekaman DNS {#dns-records-setup}

Anda perlu mengonfigurasi rekaman DNS berikut untuk domain Anda:

#### Rekaman MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Rekaman A {#a-records}

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
# Ekstrak kunci publik DKIM
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

1. Buka browser web Anda dan navigasikan ke `https://yourdomain.com`
2. Masukkan kredensial autentikasi dasar yang Anda simpan sebelumnya
3. Selesaikan wizard pengaturan awal
4. Buat akun email pertama Anda


## Konfigurasi Cadangan {#backup-configuration}

### Atur Cadangan Kompatibel S3 {#set-up-s3-compatible-backup}

Konfigurasikan cadangan otomatis ke penyimpanan kompatibel S3:

```bash
# Buat direktori kredensial AWS
mkdir -p ~/.aws

# Konfigurasikan kredensial AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Konfigurasikan pengaturan AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Untuk S3 non-AWS (seperti Cloudflare R2), tambahkan URL endpoint
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Atur Cron Job Cadangan {#set-up-backup-cron-jobs}

```bash
# Jadikan skrip cadangan dapat dieksekusi
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Tambahkan cron job cadangan MongoDB (berjalan setiap hari pada tengah malam)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Tambahkan cron job cadangan Redis (berjalan setiap hari pada tengah malam)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verifikasi cron job telah ditambahkan
crontab -l
```


## Konfigurasi Pembaruan Otomatis {#auto-update-configuration}

Atur pembaruan otomatis untuk instalasi Forward Email Anda:

```bash
# Buat perintah pembaruan otomatis
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Tambahkan cron job pembaruan otomatis (berjalan setiap hari pukul 1 pagi)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verifikasi cron job telah ditambahkan
crontab -l
```


## Pemeliharaan dan Pemantauan {#maintenance-and-monitoring}

### Lokasi Log {#log-locations}

* **Log Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Log sistem**: `/var/log/syslog`
* **Log cadangan**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Log pembaruan otomatis**: `/var/log/autoupdate.log`

### Tugas Pemeliharaan Rutin {#regular-maintenance-tasks}

1. **Pantau ruang disk**: `df -h`
2. **Periksa status layanan**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Tinjau log**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Perbarui paket sistem**: `apt update && apt upgrade`
5. **Perbarui sertifikat**: Sertifikat diperbarui otomatis, tapi pantau masa berlakunya

### Pembaruan Sertifikat {#certificate-renewal}

Sertifikat harus diperbarui otomatis, tapi Anda dapat memperbarui secara manual jika diperlukan:

```bash
# Pembaruan sertifikat manual
certbot renew

# Salin sertifikat yang diperbarui
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart layanan untuk menggunakan sertifikat baru
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Pemecahan Masalah {#troubleshooting}

### Masalah Umum {#common-issues}

#### 1. Layanan Docker Tidak Mulai {#1-docker-service-wont-start}

```bash
# Periksa status Docker
systemctl status docker

# Coba startup alternatif
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Gagal Membuat Sertifikat {#2-certificate-generation-fails}

* Pastikan port 80 dan 443 dapat diakses
* Verifikasi catatan DNS mengarah ke server Anda
* Periksa pengaturan firewall

#### 3. Masalah Pengiriman Email {#3-email-delivery-issues}

* Verifikasi catatan MX sudah benar
* Periksa catatan SPF, DKIM, dan DMARC
* Pastikan port 25 tidak diblokir oleh penyedia hosting Anda

#### 4. Antarmuka Web Tidak Dapat Diakses {#4-web-interface-not-accessible}

* Periksa pengaturan firewall: `ufw status`
* Verifikasi sertifikat SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Periksa kredensial otentikasi dasar

### Mendapatkan Bantuan {#getting-help}

* **Dokumentasi**: <https://forwardemail.net/self-hosted>
* **Masalah GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Dukungan Komunitas**: Periksa diskusi GitHub proyek


## Praktik Terbaik Keamanan {#security-best-practices}

1. **Jaga Sistem Tetap Terbaru**: Perbarui Ubuntu dan paket secara rutin
2. **Pantau Log**: Atur pemantauan log dan pemberitahuan
3. **Cadangkan Secara Berkala**: Uji prosedur cadangan dan pemulihan
4. **Gunakan Kata Sandi Kuat**: Buat kata sandi kuat untuk semua akun
5. **Aktifkan Fail2Ban**: Pertimbangkan memasang fail2ban untuk keamanan tambahan
6. **Audit Keamanan Berkala**: Tinjau konfigurasi Anda secara berkala


## Kesimpulan {#conclusion}

Instalasi Forward Email self-hosted Anda sekarang seharusnya sudah selesai dan berjalan di Ubuntu. Ingat untuk:

1. Konfigurasikan catatan DNS Anda dengan benar
2. Uji pengiriman dan penerimaan email
3. Atur cadangan rutin
4. Pantau sistem Anda secara berkala
5. Jaga instalasi Anda tetap diperbarui

Untuk opsi konfigurasi tambahan dan fitur lanjutan, lihat dokumentasi resmi Forward Email di <https://forwardemail.net/self-hosted#configuration>.
