# E-mail továbbításának saját tárhelyszolgáltatás telepítési útmutatója Ubuntuhoz {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Előfeltételek](#prerequisites)
* [Rendszerkövetelmények](#system-requirements)
* [Lépésről lépésre telepítés](#step-by-step-installation)
  * [1. lépés: Kezdeti rendszerbeállítás](#step-1-initial-system-setup)
  * [2. lépés: DNS-feloldók konfigurálása](#step-2-configure-dns-resolvers)
  * [3. lépés: Rendszerfüggőségek telepítése](#step-3-install-system-dependencies)
  * [4. lépés: Telepítse a Snap csomagokat](#step-4-install-snap-packages)
  * [5. lépés: Docker telepítése](#step-5-install-docker)
  * [6. lépés: Docker szolgáltatás konfigurálása](#step-6-configure-docker-service)
  * [7. lépés: Tűzfal konfigurálása](#step-7-configure-firewall)
  * [8. lépés: Klónozza a továbbított e-mail-tárházat](#step-8-clone-forward-email-repository)
  * [9. lépés: Környezeti konfiguráció beállítása](#step-9-set-up-environment-configuration)
  * [10. lépés: A domain konfigurálása](#step-10-configure-your-domain)
  * [11. lépés: SSL-tanúsítványok generálása](#step-11-generate-ssl-certificates)
  * [12. lépés: Titkosítási kulcsok generálása](#step-12-generate-encryption-keys)
  * [13. lépés: SSL-útvonalak frissítése a konfigurációban](#step-13-update-ssl-paths-in-configuration)
  * [14. lépés: Alapvető hitelesítés beállítása](#step-14-set-up-basic-authentication)
  * [15. lépés: Telepítés a Docker Compose segítségével](#step-15-deploy-with-docker-compose)
  * [16. lépés: A telepítés ellenőrzése](#step-16-verify-installation)
* [Telepítés utáni konfiguráció](#post-installation-configuration)
  * [DNS-rekordok beállítása](#dns-records-setup)
  * [Első bejelentkezés](#first-login)
* [Biztonsági mentés konfigurációja](#backup-configuration)
  * [S3-kompatibilis biztonsági mentés beállítása](#set-up-s3-compatible-backup)
  * [Cron biztonsági mentési feladatok beállítása](#set-up-backup-cron-jobs)
* [Automatikus frissítési konfiguráció](#auto-update-configuration)
* [Karbantartás és felügyelet](#maintenance-and-monitoring)
  * [Naplóhelyek](#log-locations)
  * [Rendszeres karbantartási feladatok](#regular-maintenance-tasks)
  * [Tanúsítvány megújítása](#certificate-renewal)
* [Hibaelhárítás](#troubleshooting)
  * [Gyakori problémák](#common-issues)
  * [Segítségkérés](#getting-help)
* [Biztonsági bevált gyakorlatok](#security-best-practices)
* [Következtetés](#conclusion)

## Áttekintés {#overview}

Ez az útmutató lépésről lépésre bemutatja a Forward Email saját üzemeltetésű megoldásának telepítését Ubuntu rendszerekre. Ez az útmutató kifejezetten az Ubuntu 20.04, 22.04 és 24.04 LTS verziókhoz készült.

## Előfeltételek {#prerequisites}

A telepítés megkezdése előtt győződjön meg arról, hogy rendelkezik:

* **Ubuntu szerver**: 20.04, 22.04 vagy 24.04 LTS
* **Root hozzáférés**: Képesnek kell lenned parancsok futtatására root felhasználóként (sudo hozzáférés)
* **Domain név**: Egy olyan domain, amelyet DNS-kezelési hozzáféréssel vezérelsz
* **Tiszta szerver**: Friss Ubuntu telepítés használata ajánlott
* **Internetkapcsolat**: Csomagok és Docker képek letöltéséhez szükséges

## Rendszerkövetelmények {#system-requirements}

* **RAM**: Minimum 2 GB (4 GB ajánlott éles környezetben)
* **Tárhely**: Minimum 20 GB szabad tárhely (50 GB+ ajánlott éles környezetben)
* **CPU**: Minimum 1 vCPU (2+ vCPU ajánlott éles környezetben)
* **Hálózat**: Nyilvános IP-cím a következő elérhető portokkal:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Lépésről lépésre telepítés {#step-by-step-installation}

### 1. lépés: Kezdeti rendszerbeállítás {#step-1-initial-system-setup}

Először is győződj meg róla, hogy a rendszered naprakész, és válts root felhasználóra:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### 2. lépés: DNS-feloldók konfigurálása {#step-2-configure-dns-resolvers}

Konfigurálja rendszerét úgy, hogy a Cloudflare DNS-kiszolgálóit használja a megbízható tanúsítványgeneráláshoz:

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

### 3. lépés: Rendszerfüggőségek telepítése {#step-3-install-system-dependencies}

Telepítse a szükséges csomagokat az e-mail továbbításához:

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

### 4. lépés: Snap csomagok telepítése {#step-4-install-snap-packages}

Az AWS CLI és a Certbot telepítése snap-en keresztül:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### 5. lépés: Docker telepítése {#step-5-install-docker}

Docker CE és Docker Compose telepítése:

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

### 6. lépés: Docker szolgáltatás konfigurálása {#step-6-configure-docker-service}

Győződjön meg arról, hogy a Docker automatikusan elindul és fut:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Ha a Docker nem indul el, próbálja meg manuálisan elindítani:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### 7. lépés: Tűzfal konfigurálása {#step-7-configure-firewall}

UFW tűzfal beállítása a szerver védelme érdekében:

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

### 8. lépés: Továbbított e-mail-tárház klónozása {#step-8-clone-forward-email-repository}

Töltsd le az Email továbbítása forráskódját:

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

### 9. lépés: Környezeti konfiguráció beállítása {#step-9-set-up-environment-configuration}

A környezet konfigurációjának előkészítése:

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

### 10. lépés: A domain konfigurálása {#step-10-configure-your-domain}

Állítsa be a domainnevet és frissítse a környezeti változókat:

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

### 11. lépés: SSL-tanúsítványok generálása {#step-11-generate-ssl-certificates}

#### A lehetőség: Manuális DNS-lekérdezés (A legtöbb felhasználó számára ajánlott) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Fontos**: Amikor a rendszer kéri, létre kell hoznod TXT rekordokat a DNS-edben. Előfordulhat, hogy több kihívással is találkozol ugyanahhoz a domainhez – **hozd létre az összeset**. Ne távolítsd el az első TXT rekordot a második hozzáadásakor.

#### B. lehetőség: Cloudflare DNS (Ha Cloudflare-t használ) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Ha a domained Cloudflare-t használ DNS-hez, automatizálhatod a tanúsítványok generálását:

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

#### Tanúsítványok másolása {#copy-certificates}

A tanúsítványok létrehozása után másolja azokat az alkalmazás könyvtárába:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### 12. lépés: Titkosítási kulcsok generálása {#step-12-generate-encryption-keys}

Hozza létre a biztonságos működéshez szükséges különféle titkosítási kulcsokat:

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

### 13. lépés: SSL-útvonalak frissítése a {#step-13-update-ssl-paths-in-configuration}} konfigurációban

Konfigurálja az SSL tanúsítványok elérési útjait a környezeti fájlban:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### 14. lépés: Alapvető hitelesítés beállítása {#step-14-set-up-basic-authentication}

Ideiglenes alapvető hitelesítési adatok létrehozása:

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

### 15. lépés: Telepítés a Docker Compose {#step-15-deploy-with-docker-compose} használatával

Indítsa el az összes e-mail továbbítási szolgáltatást:

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

### 16. lépés: Telepítés ellenőrzése {#step-16-verify-installation}

Ellenőrizd, hogy minden szolgáltatás megfelelően fut-e:

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

## Telepítés utáni konfiguráció {#post-installation-configuration}

### DNS-rekordok beállítása {#dns-records-setup}

A következő DNS-rekordokat kell konfigurálnia a domainjéhez:

#### MX rekord {#mx-record}}

```
@ MX 10 mx.yourdomain.com
```

#### A Rekordok {#a-records}

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

#### SPF-rekord {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM rekord {#dkim-record}

Szerezd meg a DKIM nyilvános kulcsodat:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM DNS-rekord létrehozása:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC rekord {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Első bejelentkezés {#first-login}

1. Nyissa meg a webböngészőjét, és navigáljon a `https://yourdomain.com` oldalra.
2. Adja meg a korábban mentett alapvető hitelesítési adatokat.
3. Fejezze be a kezdeti beállítási varázslót.
4. Hozza létre első e-mail fiókját.

## Biztonsági mentés konfigurációja {#backup-configuration}

### S3-kompatibilis biztonsági mentés beállítása {#set-up-s3-compatible-backup}

Automatikus biztonsági mentések konfigurálása S3-kompatibilis tárolóra:

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

### Cron biztonsági mentési feladatok beállítása {#set-up-backup-cron-jobs}

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

## Automatikus frissítési konfiguráció {#auto-update-configuration}

Automatikus frissítések beállítása az e-mail továbbítási telepítéséhez:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Karbantartás és felügyelet {#maintenance-and-monitoring}

### Naplóhelyek {#log-locations}

* **Docker Compose naplók**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Rendszernaplók**: `/var/log/syslog`
* **Biztonsági mentési naplók**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatikus frissítési naplók**: `/var/log/autoupdate.log`

### Rendszeres karbantartási feladatok {#regular-maintenance-tasks}

1. **Lemezterület figyelése**: `df -h`
2. **Szolgáltatás állapotának ellenőrzése**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Naplók áttekintése**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Rendszercsomagok frissítése**: `apt update && apt upgrade`
5. **Tanúsítványok megújítása**: A tanúsítványok automatikusan megújulnak, de figyelik a lejáratukat

### Tanúsítvány megújítása {#certificate-renewal}

A tanúsítványoknak automatikusan megújulniuk kellene, de szükség esetén manuálisan is megújíthatja őket:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Hibaelhárítás {#troubleshooting}

### Gyakori problémák {#common-issues}

#### 1. A Docker szolgáltatás nem indul el {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. A tanúsítvány létrehozása sikertelen {#2-certificate-generation-fails}

* Győződjön meg arról, hogy a 80-as és 443-as portok elérhetők.* Ellenőrizze, hogy a DNS-rekordok a szerverére mutatnak-e.* Ellenőrizze a tűzfal beállításait.

#### 3. E-mail kézbesítési problémák {#3-email-delivery-issues}

* Ellenőrizze az MX rekordok helyességét.* Ellenőrizze az SPF, DKIM és DMARC rekordokat.* Győződjön meg arról, hogy a tárhelyszolgáltatója nem blokkolja a 25-ös portot.

#### 4. A webes felület nem elérhető {#4-web-interface-not-accessible}

* Tűzfalbeállítások ellenőrzése: `ufw status`
* SSL-tanúsítványok ellenőrzése: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Alapvető hitelesítő adatok ellenőrzése

### Segítség kérése {#getting-help}

* **Dokumentáció**: <https://forwardemail.net/self-hosted>
* **GitHub problémák**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Közösségi támogatás**: Nézd meg a projekt GitHub beszélgetéseit

## Biztonsági bevált gyakorlatok {#security-best-practices}

1. **A rendszer naprakészen tartása**: Az Ubuntu és a csomagok rendszeres frissítése
2. **Naplók figyelése**: Naplófigyelés és riasztások beállítása
3. **Rendszeres biztonsági mentés**: A biztonsági mentési és visszaállítási eljárások tesztelése
4. **Erős jelszavak használata**: Erős jelszavak generálása minden fiókhoz
5. **Fail2Ban engedélyezése**: A fokozott biztonság érdekében érdemes megfontolni a fail2ban telepítését
6. **Rendszeres biztonsági auditok**: A konfiguráció rendszeres ellenőrzése

## Következtetés {#conclusion}

A Forward Email önállóan üzemeltetett telepítésének most már be kell fejeződnie és futnia kell Ubuntu rendszeren. Ne feledd:

1. Konfigurálja megfelelően a DNS-rekordjait.
2. Tesztelje az e-mail küldését és fogadását.
3. Állítson be rendszeres biztonsági mentéseket.
4. Rendszeresen figyelje a rendszerét.
5. Tartsa naprakészen a telepítését.

További konfigurációs lehetőségekért és speciális funkciókért tekintse meg a hivatalos e-mail-továbbítási dokumentációt a <https://forwardemail.net/self-hosted#configuration>. címen.