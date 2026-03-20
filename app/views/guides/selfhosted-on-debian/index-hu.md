# Forward Email önálló hosztolás telepítési útmutató Debianhoz {#forward-email-self-hosting-installation-guide-for-debian}


## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Előfeltételek](#prerequisites)
* [Rendszerkövetelmények](#system-requirements)
* [Lépésről lépésre telepítés](#step-by-step-installation)
  * [1. lépés: Kezdeti rendszerbeállítás](#step-1-initial-system-setup)
  * [2. lépés: DNS feloldók konfigurálása](#step-2-configure-dns-resolvers)
  * [3. lépés: Rendszerfüggőségek telepítése](#step-3-install-system-dependencies)
  * [4. lépés: Snapd telepítése és konfigurálása](#step-4-install-and-configure-snapd)
  * [5. lépés: Snap csomagok telepítése](#step-5-install-snap-packages)
  * [6. lépés: Docker telepítése](#step-6-install-docker)
  * [7. lépés: Docker szolgáltatás konfigurálása](#step-7-configure-docker-service)
  * [8. lépés: UFW tűzfal telepítése és konfigurálása](#step-8-install-and-configure-ufw-firewall)
  * [9. lépés: Forward Email tároló klónozása](#step-9-clone-forward-email-repository)
  * [10. lépés: Környezeti konfiguráció beállítása](#step-10-set-up-environment-configuration)
  * [11. lépés: Domain konfigurálása](#step-11-configure-your-domain)
  * [12. lépés: SSL tanúsítványok generálása](#step-12-generate-ssl-certificates)
  * [13. lépés: Titkosítási kulcsok generálása](#step-13-generate-encryption-keys)
  * [14. lépés: SSL útvonalak frissítése a konfigurációban](#step-14-update-ssl-paths-in-configuration)
  * [15. lépés: Alapvető hitelesítés beállítása](#step-15-set-up-basic-authentication)
  * [16. lépés: Telepítés Docker Compose-szal](#step-16-deploy-with-docker-compose)
  * [17. lépés: Telepítés ellenőrzése](#step-17-verify-installation)
* [Telepítés utáni konfiguráció](#post-installation-configuration)
  * [DNS rekordok beállítása](#dns-records-setup)
  * [Első bejelentkezés](#first-login)
* [Biztonsági mentés konfiguráció](#backup-configuration)
  * [S3-kompatibilis biztonsági mentés beállítása](#set-up-s3-compatible-backup)
  * [Biztonsági mentés cron feladatok beállítása](#set-up-backup-cron-jobs)
* [Automatikus frissítés konfiguráció](#auto-update-configuration)
* [Debian-specifikus megfontolások](#debian-specific-considerations)
  * [Csomagkezelési különbségek](#package-management-differences)
  * [Szolgáltatáskezelés](#service-management)
  * [Hálózati konfiguráció](#network-configuration)
* [Karbantartás és felügyelet](#maintenance-and-monitoring)
  * [Naplófájlok helye](#log-locations)
  * [Rendszeres karbantartási feladatok](#regular-maintenance-tasks)
  * [Tanúsítvány megújítás](#certificate-renewal)
* [Hibaelhárítás](#troubleshooting)
  * [Debian-specifikus problémák](#debian-specific-issues)
  * [Gyakori problémák](#common-issues)
  * [Segítségkérés](#getting-help)
* [Biztonsági legjobb gyakorlatok](#security-best-practices)
* [Összefoglalás](#conclusion)


## Áttekintés {#overview}

Ez az útmutató lépésről lépésre ismerteti a Forward Email önálló hosztolásának telepítését Debian rendszereken. Kifejezetten a Debian 11 (Bullseye) és Debian 12 (Bookworm) verziókra szabott.


## Előfeltételek {#prerequisites}

A telepítés megkezdése előtt győződjön meg róla, hogy rendelkezik:

* **Debian szerver**: 11-es (Bullseye) vagy 12-es (Bookworm) verzió
* **Root hozzáférés**: Parancsokat rootként kell futtatnia (sudo hozzáférés)
* **Domain név**: Olyan domain, amelyet Ön irányít, és DNS kezelési hozzáféréssel rendelkezik
* **Tiszta szerver**: Ajánlott friss Debian telepítést használni
* **Internetkapcsolat**: Szükséges a csomagok és Docker képek letöltéséhez


## Rendszerkövetelmények {#system-requirements}

* **RAM**: Minimum 2GB (termeléshez 4GB ajánlott)
* **Tárhely**: Minimum 20GB szabad hely (termeléshez 50GB+ ajánlott)
* **CPU**: Minimum 1 vCPU (termeléshez 2+ vCPU ajánlott)
* **Hálózat**: Nyilvános IP-cím a következő portok elérhetőségével:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Lépésről lépésre telepítés {#step-by-step-installation}

### 1. lépés: Kezdeti rendszerbeállítás {#step-1-initial-system-setup}

Először győződjön meg róla, hogy rendszere naprakész, majd váltszon root felhasználóra:

```bash
# Rendszercsomagok frissítése
sudo apt update && sudo apt upgrade -y

# Váltás root felhasználóra (a telepítéshez szükséges)
sudo su -
```
### 2. lépés: DNS feloldók konfigurálása {#step-2-configure-dns-resolvers}

Állítsa be a rendszerét, hogy a Cloudflare DNS szervereit használja a megbízható tanúsítványkészítéshez:

```bash
# Állítsa le és tiltsa le a systemd-resolved szolgáltatást, ha fut
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Cloudflare DNS feloldók konfigurálása
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

Telepítse a Forward Email szükséges csomagjait Debianon:

```bash
# Csomaglista frissítése
apt-get update -y

# Alapvető függőségek telepítése (Debian-specifikus csomaglista)
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

### 4. lépés: Snapd telepítése és konfigurálása {#step-4-install-and-configure-snapd}

A Debian alapértelmezés szerint nem tartalmazza a snapd-t, ezért telepíteni és konfigurálni kell:

```bash
# Snapd telepítése
apt-get install -y snapd

# Snapd szolgáltatás engedélyezése és indítása
systemctl enable snapd
systemctl start snapd

# Szimbolikus link létrehozása a snap megfelelő működéséhez
ln -sf /var/lib/snapd/snap /snap

# Várakozás, amíg a snapd készen áll
sleep 10

# Ellenőrizze, hogy a snapd működik-e
snap version
```

### 5. lépés: Snap csomagok telepítése {#step-5-install-snap-packages}

Telepítse az AWS CLI-t és a Certbotot snap segítségével:

```bash
# AWS CLI telepítése
snap install aws-cli --classic

# Certbot és DNS plugin telepítése
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Telepítések ellenőrzése
aws --version
certbot --version
```

### 6. lépés: Docker telepítése {#step-6-install-docker}

Docker CE és Docker Compose telepítése Debianon:

```bash
# Docker hivatalos GPG kulcsának hozzáadása (Debian-specifikus)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Docker tároló hozzáadása (Debian-specifikus)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Csomagindex frissítése és Docker telepítése
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Különálló docker-compose telepítése tartalék megoldásként (ha a plugin nem működik)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Docker telepítésének ellenőrzése
docker --version
docker compose version || docker-compose --version
```

### 7. lépés: Docker szolgáltatás konfigurálása {#step-7-configure-docker-service}

Győződjön meg róla, hogy a Docker automatikusan indul és fut:

```bash
# Docker szolgáltatás engedélyezése és indítása
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Ellenőrizze, hogy a Docker fut-e
docker info
```

Ha a Docker nem indul el, próbálja meg kézzel indítani:

```bash
# Alternatív indítási mód, ha a systemctl nem működik
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### 8. lépés: UFW tűzfal telepítése és konfigurálása {#step-8-install-and-configure-ufw-firewall}

A Debian minimális telepítései nem mindig tartalmazzák az UFW-t, ezért először telepítse:

```bash
# UFW telepítése, ha nincs jelen
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Alapértelmezett szabályok beállítása
ufw default deny incoming
ufw default allow outgoing

# SSH engedélyezése (fontos - ne zárja ki saját magát!)
ufw allow 22/tcp

# E-mailhez kapcsolódó portok engedélyezése
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (a Let's Encrypt számára)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternatív port)
ufw allow 2995/tcp  # POP3 (alternatív port)
ufw allow 3456/tcp  # Egyedi szolgáltatás port
ufw allow 4000/tcp  # Egyedi szolgáltatás port
ufw allow 5000/tcp  # Egyedi szolgáltatás port

# Helyi adatbázis-kapcsolatok engedélyezése
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Tűzfal engedélyezése
echo "y" | ufw enable

# Tűzfal állapotának ellenőrzése
ufw status numbered
```
### 9. lépés: Klónozd a Forward Email tárházat {#step-9-clone-forward-email-repository}

Töltsd le a Forward Email forráskódját:

```bash
# Változók beállítása
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# A tárház klónozása
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Ellenőrizd, hogy a klónozás sikeres volt-e
ls -la
```

### 10. lépés: Állítsd be a környezeti konfigurációt {#step-10-set-up-environment-configuration}

Készítsd elő a környezeti konfigurációt:

```bash
# Könyvtárváltozók beállítása
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Másold át az alapértelmezett környezeti fájlt
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Hozd létre az SSL könyvtárat
mkdir -p "$SELF_HOST_DIR/ssl"

# Hozd létre az adatbázis könyvtárakat
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### 11. lépés: Állítsd be a domain nevedet {#step-11-configure-your-domain}

Add meg a domain nevedet és frissítsd a környezeti változókat:

```bash
# Cseréld le a 'yourdomain.com'-ot a saját domain nevedre
DOMAIN="yourdomain.com"

# Függvény a környezeti fájl frissítéséhez
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Frissítsd a domainhez kapcsolódó környezeti változókat
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

### 12. lépés: Generáld le az SSL tanúsítványokat {#step-12-generate-ssl-certificates}

#### A lehetőség: Manuális DNS kihívás (Ajánlott a legtöbb felhasználónak) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Tanúsítványok generálása manuális DNS kihívással
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Fontos**: Amikor kéri, létre kell hoznod TXT rekordokat a DNS-ben. Több kihívást is láthatsz ugyanarra a domainre – **mindet hozd létre**. Ne töröld az első TXT rekordot, amikor a másodikat adod hozzá.

#### B lehetőség: Cloudflare DNS (Ha Cloudflare-t használsz) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Ha a domain-ed Cloudflare-t használ DNS-hez, automatizálhatod a tanúsítvány generálást:

```bash
# Cloudflare hitelesítő adatok fájl létrehozása
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Jogosultságok beállítása
chmod 600 /root/.cloudflare.ini

# Tanúsítványok automatikus generálása
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

A tanúsítványok generálása után másold át őket az alkalmazás könyvtárába:

```bash
# Tanúsítványok másolása az alkalmazás SSL könyvtárába
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Ellenőrizd, hogy a tanúsítványok át lettek-e másolva
ls -la "$SELF_HOST_DIR/ssl/"
```

### 13. lépés: Generáld le a titkosítási kulcsokat {#step-13-generate-encryption-keys}

Hozd létre a biztonságos működéshez szükséges különböző titkosítási kulcsokat:

```bash
# Segéd titkosítási kulcs generálása
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# SRS titok generálása az email továbbításhoz
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# TXT titkosítási kulcs generálása
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# DKIM privát kulcs generálása az email aláíráshoz
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Webhook aláírási kulcs generálása
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# SMTP átviteli jelszó beállítása
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Minden titkosítási kulcs sikeresen generálva"
```
### Step 14: Update SSL Paths in Configuration {#step-14-update-ssl-paths-in-configuration}

Állítsa be az SSL tanúsítvány elérési útjait a környezeti fájlban:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Set Up Basic Authentication {#step-15-set-up-basic-authentication}

Hozzon létre ideiglenes alapvető hitelesítési adatokat:

```bash
# Generate a secure random password
PASSWORD=$(openssl rand -base64 16)

# Update environment file with basic auth credentials
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Display credentials (save these!)
echo ""
echo "🔐 FONTOS: Mentse el ezeket a bejelentkezési adatokat!"
echo "=================================="
echo "Felhasználónév: admin"
echo "Jelszó: $PASSWORD"
echo "=================================="
echo ""
echo "Ezekre szüksége lesz a webes felület eléréséhez a telepítés után."
echo ""
```

### Step 16: Deploy with Docker Compose {#step-16-deploy-with-docker-compose}

Indítsa el az összes Forward Email szolgáltatást:

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

### Step 17: Verify Installation {#step-17-verify-installation}

Ellenőrizze, hogy az összes szolgáltatás megfelelően fut-e:

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


## Post-Installation Configuration {#post-installation-configuration}

### DNS Records Setup {#dns-records-setup}

A következő DNS rekordokat kell beállítania a domainjéhez:

#### MX Record {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A Records {#a-records}

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

#### SPF Record {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM Record {#dkim-record}

Szerezze be a DKIM nyilvános kulcsát:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Hozza létre a DKIM DNS rekordot:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC Record {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### First Login {#first-login}

1. Nyissa meg a böngészőjét, és navigáljon a `https://yourdomain.com` címre
2. Adja meg az előzőleg elmentett alapvető hitelesítési adatokat
3. Fejezze be az első beállító varázslót
4. Hozza létre az első e-mail fiókját


## Backup Configuration {#backup-configuration}

### Set Up S3-Compatible Backup {#set-up-s3-compatible-backup}

Állítson be automatikus biztonsági mentéseket S3-kompatibilis tárolóra:

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
### Biztonsági mentés Cron feladatok beállítása {#set-up-backup-cron-jobs}

```bash
# Tegyük futtathatóvá a biztonsági mentés szkripteket
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDB biztonsági mentés cron feladat hozzáadása (naponta éjfélkor fut)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redis biztonsági mentés cron feladat hozzáadása (naponta éjfélkor fut)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Ellenőrizzük, hogy a cron feladatok hozzáadásra kerültek-e
crontab -l
```


## Automatikus frissítés beállítása {#auto-update-configuration}

Állítsa be a Forward Email telepítés automatikus frissítését:

```bash
# Automatikus frissítő parancs létrehozása (használja a megfelelő docker compose parancsot)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Automatikus frissítés cron feladat hozzáadása (naponta 1 órakor fut)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Ellenőrizzük, hogy a cron feladat hozzáadásra került-e
crontab -l
```


## Debian-specifikus megfontolások {#debian-specific-considerations}

### Csomagkezelési különbségek {#package-management-differences}

* **Snapd**: Alapértelmezetten nincs telepítve Debianon, kézi telepítés szükséges
* **Docker**: Debian-specifikus tárolókat és GPG kulcsokat használ
* **UFW**: Lehet, hogy nem része a minimális Debian telepítésnek
* **systemd**: Viselkedése kissé eltérhet az Ubuntutól

### Szolgáltatáskezelés {#service-management}

```bash
# Szolgáltatás állapotának ellenőrzése (Debian-specifikus parancsok)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Szolgáltatások újraindítása szükség esetén
systemctl restart snapd
systemctl restart docker
```

### Hálózati konfiguráció {#network-configuration}

Debian eltérő hálózati interfész neveket vagy konfigurációkat használhat:

```bash
# Hálózati interfészek ellenőrzése
ip addr show

# Útvonalak ellenőrzése
ip route show

# DNS feloldás ellenőrzése
nslookup google.com
```


## Karbantartás és felügyelet {#maintenance-and-monitoring}

### Naplófájlok helye {#log-locations}

* **Docker Compose naplók**: Használja a telepítésnek megfelelő docker compose parancsot
* **Rendszernaplók**: `/var/log/syslog`
* **Biztonsági mentés naplók**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatikus frissítés naplók**: `/var/log/autoupdate.log`
* **Snapd naplók**: `journalctl -u snapd`

### Rendszeres karbantartási feladatok {#regular-maintenance-tasks}

1. **Lemezterület figyelése**: `df -h`
2. **Szolgáltatás állapotának ellenőrzése**: Használja a megfelelő docker compose parancsot
3. **Naplók átnézése**: Ellenőrizze az alkalmazás és a rendszer naplóit
4. **Rendszercsomagok frissítése**: `apt update && apt upgrade`
5. **Snapd figyelése**: `snap list` és `snap refresh`

### Tanúsítvány megújítása {#certificate-renewal}

A tanúsítványok automatikusan megújulnak, de szükség esetén manuálisan is megújíthatók:

```bash
# Tanúsítvány manuális megújítása
certbot renew

# Megújított tanúsítványok másolása
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Szolgáltatások újraindítása az új tanúsítványok használatához
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Hibakeresés {#troubleshooting}

### Debian-specifikus problémák {#debian-specific-issues}

#### 1. Snapd nem működik {#1-snapd-not-working}

```bash
# Snapd állapotának ellenőrzése
systemctl status snapd

# Snapd újraindítása
systemctl restart snapd

# Snap elérési út ellenőrzése
echo $PATH | grep snap

# Snap hozzáadása a PATH-hoz, ha hiányzik
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose parancs nem található {#2-docker-compose-command-not-found}

```bash
# Ellenőrizze, melyik docker compose parancs érhető el
command -v docker-compose
command -v docker

# Használja a megfelelő parancsot a szkriptekben
if command -v docker-compose &> /dev/null; then
    echo "docker-compose használata"
else
    echo "docker compose használata"
fi
```
#### 3. Csomagtelepítési problémák {#3-package-installation-issues}

```bash
# Csomagtár frissítése
apt update

# Sérült csomagok javítása
apt --fix-broken install

# Tartott csomagok ellenőrzése
apt-mark showhold
```

### Gyakori problémák {#common-issues}

#### 1. A Docker szolgáltatás nem indul el {#1-docker-service-wont-start}

```bash
# Docker állapotának ellenőrzése
systemctl status docker

# Docker naplók megtekintése
journalctl -u docker

# Alternatív indítási mód kipróbálása
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Tanúsítvány generálás sikertelen {#2-certificate-generation-fails}

* Győződjön meg róla, hogy a 80-as és 443-as portok elérhetők
* Ellenőrizze, hogy a DNS rekordok a szerverére mutatnak
* Ellenőrizze a tűzfal beállításait a `ufw status` paranccsal

#### 3. E-mail kézbesítési problémák {#3-email-delivery-issues}

* Ellenőrizze, hogy az MX rekordok helyesek-e
* Ellenőrizze az SPF, DKIM és DMARC rekordokat
* Győződjön meg róla, hogy a 25-ös portot nem blokkolja a tárhelyszolgáltatója

### Segítségkérés {#getting-help}

* **Dokumentáció**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian dokumentáció**: <https://www.debian.org/doc/>


## Biztonsági legjobb gyakorlatok {#security-best-practices}

1. **Rendszer frissen tartása**: Rendszeresen frissítse a Debian-t és a csomagokat
2. **Naplók figyelése**: Állítson be naplófigyelést és riasztásokat
3. **Rendszeres biztonsági mentés**: Tesztelje a mentési és visszaállítási eljárásokat
4. **Erős jelszavak használata**: Generáljon erős jelszavakat minden fiókhoz
5. **Fail2Ban engedélyezése**: Fontolja meg a fail2ban telepítését további védelemként
6. **Rendszeres biztonsági auditok**: Időszakosan vizsgálja felül a konfigurációt
7. **Snapd figyelése**: Tartsa naprakészen a snap csomagokat a `snap refresh` paranccsal


## Összefoglalás {#conclusion}

A Forward Email önálló telepítése most már befejeződött és fut Debian alatt. Ne feledje:

1. Helyesen konfigurálja a DNS rekordokat
2. Tesztelje az e-mailek küldését és fogadását
3. Állítson be rendszeres biztonsági mentéseket
4. Rendszeresen figyelje a rendszert
5. Tartsa naprakészen a telepítést
6. Figyelje a snapd-t és a snap csomagokat

Az Ubuntu-hoz képest a fő különbségek a snapd telepítése és a Docker tároló konfigurációja. Ha ezek megfelelően be vannak állítva, a Forward Email alkalmazás mindkét rendszeren azonos módon működik.

További konfigurációs lehetőségekért és haladó funkciókért tekintse meg a hivatalos Forward Email dokumentációt a <https://forwardemail.net/self-hosted#configuration> címen.
