# Forward Email Kendi Kendine Barındırma Kurulum Rehberi Debian için {#forward-email-self-hosting-installation-guide-for-debian}


## İçindekiler {#table-of-contents}

* [Genel Bakış](#overview)
* [Ön Koşullar](#prerequisites)
* [Sistem Gereksinimleri](#system-requirements)
* [Adım Adım Kurulum](#step-by-step-installation)
  * [Adım 1: İlk Sistem Kurulumu](#step-1-initial-system-setup)
  * [Adım 2: DNS Çözücülerini Yapılandırma](#step-2-configure-dns-resolvers)
  * [Adım 3: Sistem Bağımlılıklarını Yükleme](#step-3-install-system-dependencies)
  * [Adım 4: Snapd Kurulumu ve Yapılandırması](#step-4-install-and-configure-snapd)
  * [Adım 5: Snap Paketlerini Yükleme](#step-5-install-snap-packages)
  * [Adım 6: Docker Kurulumu](#step-6-install-docker)
  * [Adım 7: Docker Servisini Yapılandırma](#step-7-configure-docker-service)
  * [Adım 8: UFW Güvenlik Duvarını Kurma ve Yapılandırma](#step-8-install-and-configure-ufw-firewall)
  * [Adım 9: Forward Email Deposu Klonlama](#step-9-clone-forward-email-repository)
  * [Adım 10: Ortam Yapılandırmasını Ayarlama](#step-10-set-up-environment-configuration)
  * [Adım 11: Alan Adınızı Yapılandırma](#step-11-configure-your-domain)
  * [Adım 12: SSL Sertifikaları Oluşturma](#step-12-generate-ssl-certificates)
  * [Adım 13: Şifreleme Anahtarları Oluşturma](#step-13-generate-encryption-keys)
  * [Adım 14: Yapılandırmadaki SSL Yollarını Güncelleme](#step-14-update-ssl-paths-in-configuration)
  * [Adım 15: Temel Kimlik Doğrulamayı Ayarlama](#step-15-set-up-basic-authentication)
  * [Adım 16: Docker Compose ile Dağıtım](#step-16-deploy-with-docker-compose)
  * [Adım 17: Kurulumu Doğrulama](#step-17-verify-installation)
* [Kurulum Sonrası Yapılandırma](#post-installation-configuration)
  * [DNS Kayıtlarının Ayarlanması](#dns-records-setup)
  * [İlk Giriş](#first-login)
* [Yedekleme Yapılandırması](#backup-configuration)
  * [S3 Uyumlu Yedekleme Kurulumu](#set-up-s3-compatible-backup)
  * [Yedekleme Cron İşlerinin Ayarlanması](#set-up-backup-cron-jobs)
* [Otomatik Güncelleme Yapılandırması](#auto-update-configuration)
* [Debian’a Özgü Hususlar](#debian-specific-considerations)
  * [Paket Yönetimi Farklılıkları](#package-management-differences)
  * [Servis Yönetimi](#service-management)
  * [Ağ Yapılandırması](#network-configuration)
* [Bakım ve İzleme](#maintenance-and-monitoring)
  * [Log Konumları](#log-locations)
  * [Düzenli Bakım Görevleri](#regular-maintenance-tasks)
  * [Sertifika Yenileme](#certificate-renewal)
* [Sorun Giderme](#troubleshooting)
  * [Debian’a Özgü Sorunlar](#debian-specific-issues)
  * [Yaygın Sorunlar](#common-issues)
  * [Yardım Alma](#getting-help)
* [Güvenlik En İyi Uygulamaları](#security-best-practices)
* [Sonuç](#conclusion)


## Genel Bakış {#overview}

Bu rehber, Forward Email’in kendi kendine barındırılan çözümünün Debian sistemlerine kurulumu için adım adım talimatlar sağlar. Bu rehber özellikle Debian 11 (Bullseye) ve Debian 12 (Bookworm) için hazırlanmıştır.


## Ön Koşullar {#prerequisites}

Kuruluma başlamadan önce, aşağıdakilere sahip olduğunuzdan emin olun:

* **Debian Sunucu**: Sürüm 11 (Bullseye) veya 12 (Bookworm)
* **Root Erişimi**: Komutları root olarak çalıştırabilmelisiniz (sudo erişimi)
* **Alan Adı**: DNS yönetim erişimine sahip kontrol ettiğiniz bir alan adı
* **Temiz Sunucu**: Taze bir Debian kurulumu kullanmanız önerilir
* **İnternet Bağlantısı**: Paketler ve Docker imajları indirmek için gereklidir


## Sistem Gereksinimleri {#system-requirements}

* **RAM**: Minimum 2GB (üretim için 4GB önerilir)
* **Depolama**: Minimum 20GB boş alan (üretim için 50GB+ önerilir)
* **CPU**: Minimum 1 vCPU (üretim için 2+ vCPU önerilir)
* **Ağ**: Aşağıdaki portların erişilebilir olduğu genel IP adresi:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Adım Adım Kurulum {#step-by-step-installation}

### Adım 1: İlk Sistem Kurulumu {#step-1-initial-system-setup}

Öncelikle, sisteminizin güncel olduğundan emin olun ve root kullanıcısına geçin:

```bash
# Sistem paketlerini güncelle
sudo apt update && sudo apt upgrade -y

# Root kullanıcısına geç (kurulum için gerekli)
sudo su -
```
### Adım 2: DNS Çözücülerini Yapılandırma {#step-2-configure-dns-resolvers}

Sisteminizin güvenilir sertifika oluşturma için Cloudflare'ın DNS sunucularını kullanacak şekilde yapılandırın:

```bash
# systemd-resolved çalışıyorsa durdur ve devre dışı bırak
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Cloudflare DNS çözücülerini yapılandır
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

### Adım 3: Sistem Bağımlılıklarını Yükleme {#step-3-install-system-dependencies}

Debian üzerinde Forward Email için gerekli paketleri yükleyin:

```bash
# Paket listesini güncelle
apt-get update -y

# Temel bağımlılıkları yükle (Debian'a özgü paket listesi)
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

### Adım 4: Snapd'i Yükleyip Yapılandırma {#step-4-install-and-configure-snapd}

Debian varsayılan olarak snapd içermez, bu yüzden yükleyip yapılandırmamız gerekiyor:

```bash
# Snapd'i yükle
apt-get install -y snapd

# Snapd servisini etkinleştir ve başlat
systemctl enable snapd
systemctl start snapd

# Snap'ın düzgün çalışması için sembolik bağlantı oluştur
ln -sf /var/lib/snapd/snap /snap

# Snapd'nin hazır olmasını bekle
sleep 10

# Snapd'nin çalıştığını doğrula
snap version
```

### Adım 5: Snap Paketlerini Yükleme {#step-5-install-snap-packages}

AWS CLI ve Certbot'u snap ile yükleyin:

```bash
# AWS CLI'yı yükle
snap install aws-cli --classic

# Certbot ve DNS eklentisini yükle
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Yüklemeleri doğrula
aws --version
certbot --version
```

### Adım 6: Docker'ı Yükleme {#step-6-install-docker}

Debian üzerinde Docker CE ve Docker Compose'u yükleyin:

```bash
# Docker'ın resmi GPG anahtarını ekle (Debian'a özgü)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Docker deposunu ekle (Debian'a özgü)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Paket indeksini güncelle ve Docker'ı yükle
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Eklenti çalışmazsa yedek olarak bağımsız docker-compose'u yükle
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Docker kurulumunu doğrula
docker --version
docker compose version || docker-compose --version
```

### Adım 7: Docker Servisini Yapılandırma {#step-7-configure-docker-service}

Docker'ın otomatik başlamasını sağlayın ve çalıştığından emin olun:

```bash
# Docker servisini etkinleştir ve başlat
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Docker'ın çalıştığını doğrula
docker info
```

Docker başlamazsa, elle başlatmayı deneyin:

```bash
# systemctl başarısız olursa alternatif başlatma yöntemi
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Adım 8: UFW Güvenlik Duvarını Yükleyip Yapılandırma {#step-8-install-and-configure-ufw-firewall}

Debian minimal kurulumlarında UFW olmayabilir, önce yükleyin:

```bash
# UFW yoksa yükle
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Varsayılan politikaları ayarla
ufw default deny incoming
ufw default allow outgoing

# SSH'ye izin ver (önemli - kendinizi kilitlemeyin!)
ufw allow 22/tcp

# E-posta ile ilgili portlara izin ver
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (Let's Encrypt için)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternatif port)
ufw allow 2995/tcp  # POP3 (alternatif port)
ufw allow 3456/tcp  # Özel servis portu
ufw allow 4000/tcp  # Özel servis portu
ufw allow 5000/tcp  # Özel servis portu

# Yerel veritabanı bağlantılarına izin ver
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Güvenlik duvarını etkinleştir
echo "y" | ufw enable

# Güvenlik duvarı durumunu kontrol et
ufw status numbered
```
### Adım 9: Forward Email Deposu Klonlama {#step-9-clone-forward-email-repository}

Forward Email kaynak kodunu indirin:

```bash
# Değişkenleri ayarla
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Depoyu klonla
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Klonlamanın başarılı olduğunu doğrula
ls -la
```

### Adım 10: Ortam Yapılandırmasını Ayarlama {#step-10-set-up-environment-configuration}

Ortam yapılandırmasını hazırlayın:

```bash
# Dizin değişkenlerini ayarla
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Varsayılan ortam dosyasını kopyala
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# SSL dizini oluştur
mkdir -p "$SELF_HOST_DIR/ssl"

# Veritabanı dizinlerini oluştur
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Adım 11: Alan Adınızı Yapılandırma {#step-11-configure-your-domain}

Alan adınızı belirleyin ve ortam değişkenlerini güncelleyin:

```bash
# 'yourdomain.com' yerine gerçek alan adınızı yazın
DOMAIN="yourdomain.com"

# Ortam dosyasını güncelleme fonksiyonu
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Alan adı ile ilgili ortam değişkenlerini güncelle
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

### Adım 12: SSL Sertifikaları Oluşturma {#step-12-generate-ssl-certificates}

#### Seçenek A: Manuel DNS Doğrulaması (Çoğu kullanıcı için önerilir) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Manuel DNS doğrulaması kullanarak sertifikaları oluştur
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Önemli**: İstendiğinde DNS'inize TXT kayıtları oluşturmanız gerekecek. Aynı alan adı için birden fazla doğrulama görebilirsiniz - **HEPSİNİ oluşturun**. İkinci TXT kaydını eklerken ilk TXT kaydını silmeyin.

#### Seçenek B: Cloudflare DNS (Cloudflare kullanıyorsanız) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Alan adınız DNS için Cloudflare kullanıyorsa, sertifika oluşturmayı otomatikleştirebilirsiniz:

```bash
# Cloudflare kimlik bilgileri dosyasını oluştur
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Doğru izinleri ayarla
chmod 600 /root/.cloudflare.ini

# Sertifikaları otomatik oluştur
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Sertifikaları Kopyalama {#copy-certificates}

Sertifika oluşturulduktan sonra, uygulama dizinine kopyalayın:

```bash
# Sertifikaları uygulamanın SSL dizinine kopyala
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Sertifikaların kopyalandığını doğrula
ls -la "$SELF_HOST_DIR/ssl/"
```

### Adım 13: Şifreleme Anahtarları Oluşturma {#step-13-generate-encryption-keys}

Güvenli çalışma için gerekli çeşitli şifreleme anahtarlarını oluşturun:

```bash
# Yardımcı şifreleme anahtarı oluştur
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# E-posta yönlendirme için SRS sırrı oluştur
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# TXT şifreleme anahtarı oluştur
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# E-posta imzalama için DKIM özel anahtarı oluştur
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Webhook imza anahtarı oluştur
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# SMTP taşıma şifresi ayarla
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Tüm şifreleme anahtarları başarıyla oluşturuldu"
```
### Adım 14: Yapılandırmadaki SSL Yollarını Güncelle {#step-14-update-ssl-paths-in-configuration}

Ortam dosyasındaki SSL sertifika yollarını yapılandırın:

```bash
# SSL yollarını doğru sertifika dosyalarına işaret edecek şekilde güncelle
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Adım 15: Temel Kimlik Doğrulamayı Kur {#step-15-set-up-basic-authentication}

Geçici temel kimlik doğrulama bilgileri oluşturun:

```bash
# Güvenli rastgele bir parola oluştur
PASSWORD=$(openssl rand -base64 16)

# Ortam dosyasını temel kimlik bilgileri ile güncelle
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Kimlik bilgilerini göster (bunları kaydedin!)
echo ""
echo "🔐 ÖNEMLİ: Bu giriş bilgilerini kaydedin!"
echo "=================================="
echo "Kullanıcı Adı: admin"
echo "Parola: $PASSWORD"
echo "=================================="
echo ""
echo "Kurulumdan sonra web arayüzüne erişmek için bunlara ihtiyacınız olacak."
echo ""
```

### Adım 16: Docker Compose ile Dağıtım Yap {#step-16-deploy-with-docker-compose}

Tüm Forward Email servislerini başlatın:

```bash
# Docker Compose dosya yolunu ayarla
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Var olan konteynerleri durdur
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# En son imajları çek
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Tüm servisleri ayrık modda başlat
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Servislerin başlaması için biraz bekle
sleep 10

# Servis durumunu kontrol et
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Adım 17: Kurulumu Doğrula {#step-17-verify-installation}

Tüm servislerin doğru çalıştığını kontrol edin:

```bash
# Docker konteynerlerini kontrol et
docker ps

# Servis loglarını hata için kontrol et
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Web arayüzü bağlantısını test et
curl -I https://$DOMAIN

# Portların dinlenip dinlenmediğini kontrol et
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Kurulum Sonrası Yapılandırma {#post-installation-configuration}

### DNS Kayıtlarının Ayarlanması {#dns-records-setup}

Alan adınız için aşağıdaki DNS kayıtlarını yapılandırmanız gerekir:

#### MX Kaydı {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A Kayıtları {#a-records}

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

#### SPF Kaydı {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM Kaydı {#dkim-record}

DKIM açık anahtarınızı alın:

```bash
# DKIM açık anahtarını çıkar
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM DNS kaydını oluşturun:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC Kaydı {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### İlk Giriş {#first-login}

1. Web tarayıcınızı açın ve `https://yourdomain.com` adresine gidin
2. Daha önce kaydettiğiniz temel kimlik doğrulama bilgilerini girin
3. İlk kurulum sihirbazını tamamlayın
4. İlk e-posta hesabınızı oluşturun


## Yedekleme Yapılandırması {#backup-configuration}

### S3-Uyumlu Yedekleme Kurulumu {#set-up-s3-compatible-backup}

Otomatik yedeklemeleri S3-uyumlu depolamaya yapılandırın:

```bash
# AWS kimlik bilgileri dizini oluştur
mkdir -p ~/.aws

# AWS kimlik bilgilerini yapılandır
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# AWS ayarlarını yapılandır
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# AWS dışı S3 için (örneğin Cloudflare R2) endpoint URL'si ekle
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Yedekleme Cron İşlerini Kurma {#set-up-backup-cron-jobs}

```bash
# Yedekleme betiklerini çalıştırılabilir yap
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDB yedekleme cron işi ekle (her gün gece yarısı çalışır)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redis yedekleme cron işi ekle (her gün gece yarısı çalışır)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Cron işlerinin eklendiğini doğrula
crontab -l
```


## Otomatik Güncelleme Yapılandırması {#auto-update-configuration}

Forward Email kurulumunuz için otomatik güncellemeleri ayarlayın:

```bash
# Otomatik güncelleme komutunu oluştur (uygun docker compose komutunu kullan)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Otomatik güncelleme cron işi ekle (her gün saat 1'de çalışır)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Cron işinin eklendiğini doğrula
crontab -l
```


## Debian'a Özgü Hususlar {#debian-specific-considerations}

### Paket Yönetimi Farklılıkları {#package-management-differences}

* **Snapd**: Debian'da varsayılan olarak yüklü değildir, manuel kurulum gerektirir
* **Docker**: Debian'a özgü depolar ve GPG anahtarları kullanır
* **UFW**: Minimal Debian kurulumlarında bulunmayabilir
* **systemd**: Davranış Ubuntu'dan biraz farklı olabilir

### Servis Yönetimi {#service-management}

```bash
# Servis durumunu kontrol et (Debian'a özgü komutlar)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Gerekirse servisleri yeniden başlat
systemctl restart snapd
systemctl restart docker
```

### Ağ Yapılandırması {#network-configuration}

Debian farklı ağ arayüzü isimlerine veya yapılandırmalarına sahip olabilir:

```bash
# Ağ arayüzlerini kontrol et
ip addr show

# Yönlendirmeyi kontrol et
ip route show

# DNS çözümlemesini kontrol et
nslookup google.com
```


## Bakım ve İzleme {#maintenance-and-monitoring}

### Günlük Dosyalarının Konumları {#log-locations}

* **Docker Compose günlükleri**: Kuruluma bağlı uygun docker compose komutunu kullanın
* **Sistem günlükleri**: `/var/log/syslog`
* **Yedekleme günlükleri**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Otomatik güncelleme günlükleri**: `/var/log/autoupdate.log`
* **Snapd günlükleri**: `journalctl -u snapd`

### Düzenli Bakım Görevleri {#regular-maintenance-tasks}

1. **Disk alanını izle**: `df -h`
2. **Servis durumunu kontrol et**: Uygun docker compose komutunu kullan
3. **Günlükleri incele**: Hem uygulama hem sistem günlüklerini kontrol et
4. **Sistem paketlerini güncelle**: `apt update && apt upgrade`
5. **Snapd'i izle**: `snap list` ve `snap refresh`

### Sertifika Yenileme {#certificate-renewal}

Sertifikalar otomatik yenilenmelidir, ancak gerekirse manuel yenileyebilirsiniz:

```bash
# Manuel sertifika yenileme
certbot renew

# Yenilenmiş sertifikaları kopyala
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Yeni sertifikaları kullanmak için servisleri yeniden başlat
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Sorun Giderme {#troubleshooting}

### Debian'a Özgü Sorunlar {#debian-specific-issues}

#### 1. Snapd Çalışmıyor {#1-snapd-not-working}

```bash
# Snapd durumunu kontrol et
systemctl status snapd

# Snapd'i yeniden başlat
systemctl restart snapd

# Snap yolunu kontrol et
echo $PATH | grep snap

# Eksikse snap'i PATH'e ekle
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose Komutu Bulunamadı {#2-docker-compose-command-not-found}

```bash
# Hangi docker compose komutunun mevcut olduğunu kontrol et
command -v docker-compose
command -v docker

# Betiklerde uygun komutu kullan
if command -v docker-compose &> /dev/null; then
    echo "docker-compose kullanılıyor"
else
    echo "docker compose kullanılıyor"
fi
```
#### 3. Paket Kurulum Sorunları {#3-package-installation-issues}

```bash
# Paket önbelleğini güncelle
apt update

# Kırık paketleri düzelt
apt --fix-broken install

# Tutulan paketleri kontrol et
apt-mark showhold
```

### Yaygın Sorunlar {#common-issues}

#### 1. Docker Servisi Başlamıyor {#1-docker-service-wont-start}

```bash
# Docker durumunu kontrol et
systemctl status docker

# Docker günlüklerini kontrol et
journalctl -u docker

# Alternatif başlatmayı dene
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Sertifika Oluşturma Başarısız Oluyor {#2-certificate-generation-fails}

* 80 ve 443 portlarının erişilebilir olduğundan emin olun
* DNS kayıtlarının sunucunuza işaret ettiğini doğrulayın
* `ufw status` ile güvenlik duvarı ayarlarını kontrol edin

#### 3. E-posta Teslim Sorunları {#3-email-delivery-issues}

* MX kayıtlarının doğru olduğunu doğrulayın
* SPF, DKIM ve DMARC kayıtlarını kontrol edin
* 25 numaralı portun barındırma sağlayıcınız tarafından engellenmediğinden emin olun

### Yardım Alma {#getting-help}

* **Dokümantasyon**: <https://forwardemail.net/self-hosted>
* **GitHub Sorunları**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian Dokümantasyonu**: <https://www.debian.org/doc/>


## Güvenlik En İyi Uygulamaları {#security-best-practices}

1. **Sistemi Güncel Tutun**: Debian ve paketleri düzenli olarak güncelleyin
2. **Günlükleri İzleyin**: Günlük izleme ve uyarı sistemi kurun
3. **Düzenli Yedek Alın**: Yedekleme ve geri yükleme prosedürlerini test edin
4. **Güçlü Parolalar Kullanın**: Tüm hesaplar için güçlü parolalar oluşturun
5. **Fail2Ban Etkinleştirin**: Ek güvenlik için fail2ban kurmayı düşünün
6. **Düzenli Güvenlik Denetimleri Yapın**: Yapılandırmanızı periyodik olarak gözden geçirin
7. **Snapd’yi İzleyin**: Snap paketlerini `snap refresh` ile güncel tutun


## Sonuç {#conclusion}

Forward Email kendi kendine barındırma kurulumunuz artık tamamlanmış ve Debian üzerinde çalışıyor olmalıdır. Unutmayın:

1. DNS kayıtlarınızı doğru yapılandırın
2. E-posta gönderme ve alma testleri yapın
3. Düzenli yedeklemeler kurun
4. Sistemizi düzenli olarak izleyin
5. Kurulumunuzu güncel tutun
6. Snapd ve snap paketlerini izleyin

Ubuntu’dan temel farklar snapd kurulumu ve Docker depo yapılandırmasıdır. Bunlar doğru şekilde ayarlandığında, Forward Email uygulaması her iki sistemde de aynı şekilde çalışır.

Ek yapılandırma seçenekleri ve gelişmiş özellikler için resmi Forward Email dokümantasyonuna <https://forwardemail.net/self-hosted#configuration> adresinden bakabilirsiniz.
