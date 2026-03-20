# Forward Email Önmagad Által Üzemeltetett Telepítési Útmutató Ubuntuhoz {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Tartalomjegyzék {#table-of-contents}

* [Áttekintés](#overview)
* [Előfeltételek](#prerequisites)
* [Rendszerkövetelmények](#system-requirements)
* [Lépésről lépésre telepítés](#step-by-step-installation)
  * [1. lépés: Kezdeti rendszerbeállítás](#step-1-initial-system-setup)
  * [2. lépés: DNS feloldók konfigurálása](#step-2-configure-dns-resolvers)
  * [3. lépés: Rendszerfüggőségek telepítése](#step-3-install-system-dependencies)
  * [4. lépés: Snap csomagok telepítése](#step-4-install-snap-packages)
  * [5. lépés: Docker telepítése](#step-5-install-docker)
  * [6. lépés: Docker szolgáltatás konfigurálása](#step-6-configure-docker-service)
  * [7. lépés: Tűzfal konfigurálása](#step-7-configure-firewall)
  * [8. lépés: Forward Email tárház klónozása](#step-8-clone-forward-email-repository)
  * [9. lépés: Környezeti konfiguráció beállítása](#step-9-set-up-environment-configuration)
  * [10. lépés: Domain konfigurálása](#step-10-configure-your-domain)
  * [11. lépés: SSL tanúsítványok generálása](#step-11-generate-ssl-certificates)
  * [12. lépés: Titkosítási kulcsok generálása](#step-12-generate-encryption-keys)
  * [13. lépés: SSL útvonalak frissítése a konfigurációban](#step-13-update-ssl-paths-in-configuration)
  * [14. lépés: Alapvető hitelesítés beállítása](#step-14-set-up-basic-authentication)
  * [15. lépés: Telepítés Docker Compose-szal](#step-15-deploy-with-docker-compose)
  * [16. lépés: Telepítés ellenőrzése](#step-16-verify-installation)
* [Telepítés utáni konfiguráció](#post-installation-configuration)
  * [DNS rekordok beállítása](#dns-records-setup)
  * [Első bejelentkezés](#first-login)
* [Biztonsági mentés konfiguráció](#backup-configuration)
  * [S3-kompatibilis biztonsági mentés beállítása](#set-up-s3-compatible-backup)
  * [Biztonsági mentés cron feladatok beállítása](#set-up-backup-cron-jobs)
* [Automatikus frissítés konfiguráció](#auto-update-configuration)
* [Karbantartás és felügyelet](#maintenance-and-monitoring)
  * [Naplófájl helyek](#log-locations)
  * [Rendszeres karbantartási feladatok](#regular-maintenance-tasks)
  * [Tanúsítvány megújítás](#certificate-renewal)
* [Hibaelhárítás](#troubleshooting)
  * [Gyakori problémák](#common-issues)
  * [Segítségkérés](#getting-help)
* [Biztonsági legjobb gyakorlatok](#security-best-practices)
* [Összefoglalás](#conclusion)


## Áttekintés {#overview}

Ez az útmutató lépésről lépésre ad utasításokat a Forward Email önmagad által üzemeltetett megoldásának telepítéséhez Ubuntu rendszereken. Az útmutató kifejezetten az Ubuntu 20.04, 22.04 és 24.04 LTS verziókra készült.


## Előfeltételek {#prerequisites}

A telepítés megkezdése előtt győződj meg róla, hogy rendelkezel:

* **Ubuntu Server**: 20.04, 22.04 vagy 24.04 LTS
* **Root hozzáférés**: Képesnek kell lenned parancsokat rootként futtatni (sudo hozzáférés)
* **Domain név**: Egy olyan domain, amelyet te irányítasz DNS kezelési hozzáféréssel
* **Tiszta szerver**: Ajánlott egy friss Ubuntu telepítést használni
* **Internet kapcsolat**: Szükséges a csomagok és Docker képek letöltéséhez


## Rendszerkövetelmények {#system-requirements}

* **RAM**: Minimum 2GB (termeléshez 4GB ajánlott)
* **Tárhely**: Minimum 20GB szabad hely (termeléshez 50GB+ ajánlott)
* **CPU**: Minimum 1 vCPU (termeléshez 2+ vCPU ajánlott)
* **Hálózat**: Nyilvános IP cím a következő portok elérhetőségével:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Lépésről lépésre telepítés {#step-by-step-installation}

### 1. lépés: Kezdeti rendszerbeállítás {#step-1-initial-system-setup}

Először győződj meg róla, hogy a rendszer naprakész, majd válts root felhasználóra:

```bash
# Rendszer csomagok frissítése
sudo apt update && sudo apt upgrade -y

# Váltás root felhasználóra (a telepítéshez szükséges)
sudo su -
```

### 2. lépés: DNS feloldók konfigurálása {#step-2-configure-dns-resolvers}

Állítsd be a rendszered, hogy a Cloudflare DNS szervereit használja a megbízható tanúsítvány generáláshoz:

```bash
# systemd-resolved leállítása és letiltása, ha fut
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
### Step 3: Telepítse a rendszerfüggőségeket {#step-3-install-system-dependencies}

Telepítse a Forward Emailhez szükséges csomagokat:

```bash
# Csomaglista frissítése
apt-get update -y

# Alapvető függőségek telepítése
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Step 4: Telepítse a Snap csomagokat {#step-4-install-snap-packages}

Telepítse az AWS CLI-t és a Certbotot snap segítségével:

```bash
# AWS CLI telepítése
snap install aws-cli --classic

# Certbot és DNS plugin telepítése
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: Telepítse a Dockert {#step-5-install-docker}

Telepítse a Docker CE-t és a Docker Compose-t:

```bash
# Docker hivatalos GPG kulcsának hozzáadása
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Docker tároló hozzáadása
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Csomagindex frissítése és Docker telepítése
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker telepítés ellenőrzése
docker --version
docker compose version
```

### Step 6: Docker szolgáltatás konfigurálása {#step-6-configure-docker-service}

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

### Step 7: Tűzfal konfigurálása {#step-7-configure-firewall}

Állítsa be az UFW tűzfalat a szerver védelméhez:

```bash
# Alapértelmezett szabályok beállítása
ufw default deny incoming
ufw default allow outgoing

# SSH engedélyezése (fontos - ne zárja ki saját magát!)
ufw allow 22/tcp

# E-mailhez kapcsolódó portok engedélyezése
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (Let's Encrypt számára)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternatív port)
ufw allow 2995/tcp  # POP3 (alternatív port)
ufw allow 3456/tcp  # Egyedi szolgáltatás port
ufw allow 4000/tcp  # Egyedi szolgáltatás port
ufw allow 5000/tcp  # Egyedi szolgáltatás port

# Helyi adatbázis kapcsolatok engedélyezése
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Tűzfal engedélyezése
echo "y" | ufw enable

# Tűzfal állapotának ellenőrzése
ufw status numbered
```

### Step 8: Klónozza a Forward Email tárolót {#step-8-clone-forward-email-repository}

Töltse le a Forward Email forráskódját:

```bash
# Változók beállítása
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Tároló klónozása
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Klónozás sikerességének ellenőrzése
ls -la
```

### Step 9: Környezeti konfiguráció beállítása {#step-9-set-up-environment-configuration}

Készítse elő a környezeti konfigurációt:

```bash
# Könyvtár változók beállítása
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Alapértelmezett környezeti fájl másolása
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# SSL könyvtár létrehozása
mkdir -p "$SELF_HOST_DIR/ssl"

# Adatbázis könyvtárak létrehozása
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 10: Domain konfigurálása {#step-10-configure-your-domain}

Állítsa be a domain nevét és frissítse a környezeti változókat:

```bash
# Cserélje ki a 'yourdomain.com'-ot a saját domain nevére
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

# Domainhoz kapcsolódó környezeti változók frissítése
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
### 11. lépés: SSL tanúsítványok generálása {#step-11-generate-ssl-certificates}

#### A lehetőség: Manuális DNS kihívás (ajánlott a legtöbb felhasználónak) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Tanúsítványok generálása manuális DNS kihívással
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Fontos**: Amikor kéri, létre kell hoznod TXT rekordokat a DNS-edben. Több kihívást is láthatsz ugyanarra a domainre - **mindet hozd létre**. Ne távolítsd el az első TXT rekordot, amikor a másodikat hozzáadod.

#### B lehetőség: Cloudflare DNS (ha Cloudflare-t használsz) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Ha a domained Cloudflare-t használ DNS-hez, automatizálhatod a tanúsítvány generálást:

```bash
# Cloudflare hitelesítő adatok fájl létrehozása
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Megfelelő jogosultságok beállítása
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

A tanúsítványok generálása után másold őket az alkalmazás könyvtárába:

```bash
# Tanúsítványok másolása az alkalmazás SSL könyvtárába
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Ellenőrizd, hogy a tanúsítványok másolva lettek-e
ls -la "$SELF_HOST_DIR/ssl/"
```

### 12. lépés: Titkosítási kulcsok generálása {#step-12-generate-encryption-keys}

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

# SMTP szállítási jelszó beállítása
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Minden titkosítási kulcs sikeresen generálva"
```

### 13. lépés: SSL útvonalak frissítése a konfigurációban {#step-13-update-ssl-paths-in-configuration}

Állítsd be az SSL tanúsítvány útvonalakat a környezeti fájlban:

```bash
# SSL útvonalak frissítése a megfelelő tanúsítvány fájlokra mutatva
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### 14. lépés: Alapvető hitelesítés beállítása {#step-14-set-up-basic-authentication}

Hozz létre ideiglenes alapvető hitelesítési adatokat:

```bash
# Biztonságos véletlenszerű jelszó generálása
PASSWORD=$(openssl rand -base64 16)

# Környezeti fájl frissítése alapvető hitelesítési adatokkal
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Hitelesítési adatok megjelenítése (mentse el ezeket!)
echo ""
echo "🔐 FONTOS: Mentse el ezeket a bejelentkezési adatokat!"
echo "=================================="
echo "Felhasználónév: admin"
echo "Jelszó: $PASSWORD"
echo "=================================="
echo ""
echo "Ezekre szükséged lesz a webes felület eléréséhez a telepítés után."
echo ""
```

### 15. lépés: Telepítés Docker Compose-szal {#step-15-deploy-with-docker-compose}

Indítsd el az összes Forward Email szolgáltatást:

```bash
# Docker Compose fájl elérési útjának beállítása
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Létező konténerek leállítása
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Legfrissebb képek lehúzása
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Minden szolgáltatás indítása leválasztott módban
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Várj egy kicsit, hogy elinduljanak a szolgáltatások
sleep 10

# Szolgáltatások állapotának ellenőrzése
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### 16. lépés: Telepítés ellenőrzése {#step-16-verify-installation}

Ellenőrizze, hogy minden szolgáltatás megfelelően fut-e:

```bash
# Docker konténerek ellenőrzése
docker ps

# Szolgáltatás naplók ellenőrzése hibák után
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Webes felület kapcsolat tesztelése
curl -I https://$DOMAIN

# Ellenőrizze, hogy a portok figyelnek-e
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Telepítés utáni beállítások {#post-installation-configuration}

### DNS rekordok beállítása {#dns-records-setup}

A következő DNS rekordokat kell beállítania a domainjéhez:

#### MX rekord {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A rekordok {#a-records}

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

#### SPF rekord {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM rekord {#dkim-record}

Szerezze be a DKIM nyilvános kulcsát:

```bash
# DKIM nyilvános kulcs kinyerése
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Hozza létre a DKIM DNS rekordot:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC rekord {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Első bejelentkezés {#first-login}

1. Nyissa meg a böngészőjét, és navigáljon a `https://yourdomain.com` címre
2. Adja meg a korábban elmentett alapvető hitelesítési adatokat
3. Fejezze be az első beállító varázslót
4. Hozza létre az első e-mail fiókját


## Biztonsági mentés beállítása {#backup-configuration}

### S3-kompatibilis biztonsági mentés beállítása {#set-up-s3-compatible-backup}

Állítson be automatikus biztonsági mentéseket S3-kompatibilis tárolóra:

```bash
# AWS hitelesítő adatok könyvtár létrehozása
mkdir -p ~/.aws

# AWS hitelesítő adatok konfigurálása
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# AWS beállítások konfigurálása
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Nem AWS S3 esetén (pl. Cloudflare R2) adja hozzá az endpoint URL-t
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Biztonsági mentés cron feladatok beállítása {#set-up-backup-cron-jobs}

```bash
# Biztonsági mentés script-ek futtathatóvá tétele
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDB biztonsági mentés cron feladat hozzáadása (naponta éjfélkor fut)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redis biztonsági mentés cron feladat hozzáadása (naponta éjfélkor fut)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Ellenőrizze, hogy a cron feladatok hozzáadásra kerültek
crontab -l
```


## Automatikus frissítés beállítása {#auto-update-configuration}

Állítsa be a Forward Email telepítés automatikus frissítését:

```bash
# Automatikus frissítés parancs létrehozása
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Automatikus frissítés cron feladat hozzáadása (naponta 1 órakor fut)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Ellenőrizze, hogy a cron feladat hozzáadásra került
crontab -l
```


## Karbantartás és felügyelet {#maintenance-and-monitoring}

### Napló helyek {#log-locations}

* **Docker Compose naplók**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Rendszer naplók**: `/var/log/syslog`
* **Biztonsági mentés naplók**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatikus frissítés naplók**: `/var/log/autoupdate.log`

### Rendszeres karbantartási feladatok {#regular-maintenance-tasks}

1. **Lemezterület figyelése**: `df -h`
2. **Szolgáltatások állapotának ellenőrzése**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Naplók áttekintése**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Rendszer csomagok frissítése**: `apt update && apt upgrade`
5. **Tanúsítványok megújítása**: A tanúsítványok automatikusan megújulnak, de figyelje a lejáratot

### Tanúsítvány megújítása {#certificate-renewal}

A tanúsítványoknak automatikusan meg kell újulniuk, de szükség esetén manuálisan is megújíthatja:

```bash
# Tanúsítvány manuális megújítása
certbot renew

# Megújult tanúsítványok másolása
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Szolgáltatások újraindítása az új tanúsítványok használatához
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Hibakeresés {#troubleshooting}

### Gyakori problémák {#common-issues}

#### 1. A Docker szolgáltatás nem indul el {#1-docker-service-wont-start}

```bash
# Ellenőrizze a Docker állapotát
systemctl status docker

# Próbáljon alternatív indítást
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Tanúsítvány generálás sikertelen {#2-certificate-generation-fails}

* Győződjön meg róla, hogy a 80-as és 443-as portok elérhetőek
* Ellenőrizze, hogy a DNS rekordok a szerverére mutatnak
* Nézze meg a tűzfal beállításait

#### 3. E-mail kézbesítési problémák {#3-email-delivery-issues}

* Ellenőrizze, hogy az MX rekordok helyesek-e
* Nézze meg az SPF, DKIM és DMARC rekordokat
* Győződjön meg róla, hogy a 25-ös port nincs blokkolva a tárhelyszolgáltatója által

#### 4. Webes felület nem elérhető {#4-web-interface-not-accessible}

* Ellenőrizze a tűzfal beállításait: `ufw status`
* Ellenőrizze az SSL tanúsítványokat: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Ellenőrizze az alapvető hitelesítési adatokat

### Segítségkérés {#getting-help}

* **Dokumentáció**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Közösségi támogatás**: Nézze meg a projekt GitHub beszélgetéseit


## Biztonsági legjobb gyakorlatok {#security-best-practices}

1. **Rendszer frissítése**: Rendszeresen frissítse az Ubuntut és a csomagokat
2. **Naplók figyelése**: Állítson be naplófigyelést és riasztásokat
3. **Rendszeres biztonsági mentés**: Tesztelje a mentési és visszaállítási eljárásokat
4. **Erős jelszavak használata**: Generáljon erős jelszavakat minden fiókhoz
5. **Fail2Ban engedélyezése**: Fontolja meg a fail2ban telepítését további védelemként
6. **Rendszeres biztonsági auditok**: Időszakosan vizsgálja felül a konfigurációt


## Összefoglalás {#conclusion}

A Forward Email önálló telepítése most már befejeződött és fut Ubuntu alatt. Ne feledje:

1. Állítsa be helyesen a DNS rekordjait
2. Tesztelje az e-mailek küldését és fogadását
3. Állítson be rendszeres biztonsági mentéseket
4. Rendszeresen figyelje a rendszerét
5. Tartsa naprakészen a telepítését

További konfigurációs lehetőségekért és haladó funkciókért tekintse meg a hivatalos Forward Email dokumentációt a <https://forwardemail.net/self-hosted#configuration> címen.
