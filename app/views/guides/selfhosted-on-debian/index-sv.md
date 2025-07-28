# Installationsguide för egenhosting av vidarebefordran av e-post för Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Innehållsförteckning {#table-of-contents}

* [Översikt](#overview)
* [Förkunskapskrav](#prerequisites)
* [Systemkrav](#system-requirements)
* [Steg-för-steg-installation](#step-by-step-installation)
  * [Steg 1: Initial systeminstallation](#step-1-initial-system-setup)
  * [Steg 2: Konfigurera DNS-upplösningar](#step-2-configure-dns-resolvers)
  * [Steg 3: Installera systemberoenden](#step-3-install-system-dependencies)
  * [Steg 4: Installera och konfigurera Snapd](#step-4-install-and-configure-snapd)
  * [Steg 5: Installera Snap-paket](#step-5-install-snap-packages)
  * [Steg 6: Installera Docker](#step-6-install-docker)
  * [Steg 7: Konfigurera Docker-tjänsten](#step-7-configure-docker-service)
  * [Steg 8: Installera och konfigurera UFW-brandväggen](#step-8-install-and-configure-ufw-firewall)
  * [Steg 9: Klona arkivet för vidarebefordran av e-post](#step-9-clone-forward-email-repository)
  * [Steg 10: Konfigurera miljökonfigurationen](#step-10-set-up-environment-configuration)
  * [Steg 11: Konfigurera din domän](#step-11-configure-your-domain)
  * [Steg 12: Generera SSL-certifikat](#step-12-generate-ssl-certificates)
  * [Steg 13: Generera krypteringsnycklar](#step-13-generate-encryption-keys)
  * [Steg 14: Uppdatera SSL-sökvägar i konfigurationen](#step-14-update-ssl-paths-in-configuration)
  * [Steg 15: Konfigurera grundläggande autentisering](#step-15-set-up-basic-authentication)
  * [Steg 16: Distribuera med Docker Compose](#step-16-deploy-with-docker-compose)
  * [Steg 17: Verifiera installationen](#step-17-verify-installation)
* [Konfiguration efter installation](#post-installation-configuration)
  * [Konfiguration av DNS-poster](#dns-records-setup)
  * [Första inloggningen](#first-login)
* [Säkerhetskopieringskonfiguration](#backup-configuration)
  * [Konfigurera S3-kompatibel säkerhetskopiering](#set-up-s3-compatible-backup)
  * [Konfigurera säkerhetskopierade Cron-jobb](#set-up-backup-cron-jobs)
* [Konfiguration för automatisk uppdatering](#auto-update-configuration)
* [Debianspecifika överväganden](#debian-specific-considerations)
  * [Skillnader i pakethantering](#package-management-differences)
  * [Tjänstehantering](#service-management)
  * [Nätverkskonfiguration](#network-configuration)
* [Underhåll och övervakning](#maintenance-and-monitoring)
  * [Loggplatser](#log-locations)
  * [Regelbundna underhållsuppgifter](#regular-maintenance-tasks)
  * [Förnyelse av certifikat](#certificate-renewal)
* [Felsökning](#troubleshooting)
  * [Debianspecifika problem](#debian-specific-issues)
  * [Vanliga problem](#common-issues)
  * [Få hjälp](#getting-help)
* [Bästa praxis för säkerhet](#security-best-practices)
* [Slutsats](#conclusion)

## Översikt {#overview}

Den här guiden ger steg-för-steg-instruktioner för att installera Forward Emails självhostade lösning på Debiansystem. Guiden är specifikt anpassad för Debian 11 (Bullseye) och Debian 12 (Bookworm).

## Förutsättningar {#prerequisites}

Innan du påbörjar installationen, se till att du har:

* **Debian Server**: Version 11 (Bullseye) eller 12 (Bookworm)
* **Root Access**: Du måste kunna köra kommandon som root (sudo access)
* **Domännamn**: En domän som du kontrollerar med DNS-hanteringsåtkomst
* **Clean Server**: Rekommenderas att använda en ny Debian-installation
* **Internetanslutning**: Krävs för att ladda ner paket och Docker-avbildningar

## Systemkrav {#system-requirements}

* **RAM**: Minst 2 GB (4 GB rekommenderas för produktion)
* **Lagring**: Minst 20 GB tillgängligt utrymme (50 GB+ rekommenderas för produktion)
* **CPU**: Minst 1 vCPU (2+ vCPU:er rekommenderas för produktion)
* **Nätverk**: Offentlig IP-adress med följande tillgängliga portar:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Steg-för-steg-installation {#step-by-step-installation}

### Steg 1: Initial systeminstallation {#step-1-initial-system-setup}

Se först till att ditt system är uppdaterat och byt till root-användare:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Steg 2: Konfigurera DNS-upplösningar {#step-2-configure-dns-resolvers}

Konfigurera ditt system för att använda Cloudflares DNS-servrar för tillförlitlig certifikatgenerering:

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

### Steg 3: Installera systemberoenden {#step-3-install-system-dependencies}

Installera de nödvändiga paketen för vidarebefordran av e-post på Debian:

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

### Steg 4: Installera och konfigurera Snapd {#step-4-install-and-configure-snapd}

Debian inkluderar inte snapd som standard, så vi behöver installera och konfigurera det:

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

### Steg 5: Installera Snap-paket {#step-5-install-snap-packages}

Installera AWS CLI och Certbot via snap:

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

### Steg 6: Installera Docker {#step-6-install-docker}

Installera Docker CE och Docker Compose på Debian:

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

### Steg 7: Konfigurera Docker-tjänsten {#step-7-configure-docker-service}

Se till att Docker startar automatiskt och körs:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Om Docker inte startar, försök att starta det manuellt:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Steg 8: Installera och konfigurera UFW-brandväggen {#step-8-install-and-configure-ufw-firewall}

Debians minimala installationer kanske inte inkluderar UFW, så installera det först:

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

### Steg 9: Klona arkivet för vidarebefordran av e-post {#step-9-clone-forward-email-repository}

Ladda ner källkoden för vidarebefordran av e-post:

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

### Steg 10: Konfigurera miljökonfiguration {#step-10-set-up-environment-configuration}

Förbered miljökonfigurationen:

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

### Steg 11: Konfigurera din domän {#step-11-configure-your-domain}

Ange ditt domännamn och uppdatera miljövariabler:

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

### Steg 12: Generera SSL-certifikat {#step-12-generate-ssl-certificates}

#### Alternativ A: Manuell DNS-utmaning (rekommenderas för de flesta användare) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Viktigt**: När du uppmanas att göra det måste du skapa TXT-poster i din DNS. Du kan se flera utmaningar för samma domän – **skapa ALLA**. Ta inte bort den första TXT-posten när du lägger till den andra.

#### Alternativ B: Cloudflare DNS (om du använder Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Om din domän använder Cloudflare för DNS kan du automatisera certifikatgenerering:

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

#### Kopiera certifikat {#copy-certificates}

Efter att certifikaten har genererats, kopiera dem till programkatalogen:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Steg 13: Generera krypteringsnycklar {#step-13-generate-encryption-keys}

Skapa de olika krypteringsnycklar som krävs för säker drift:

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

### Steg 14: Uppdatera SSL-sökvägar i konfigurationen {#step-14-update-ssl-paths-in-configuration}

Konfigurera SSL-certifikatets sökvägar i miljöfilen:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Steg 15: Konfigurera grundläggande autentisering {#step-15-set-up-basic-authentication}

Skapa tillfälliga grundläggande autentiseringsuppgifter:

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

### Steg 16: Distribuera med Docker Compose {#step-16-deploy-with-docker-compose}

Starta alla tjänster för vidarebefordran av e-post:

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

### Steg 17: Verifiera installationen {#step-17-verify-installation}

Kontrollera att alla tjänster fungerar korrekt:

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

## Konfiguration efter installation {#post-installation-configuration}

### Konfiguration av DNS-poster {#dns-records-setup}

Du behöver konfigurera följande DNS-poster för din domän:

#### MX-post {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-poster {#a-records}

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

#### SPF-post {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-post {#dkim-record}

Hämta din offentliga DKIM-nyckel:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Skapa DKIM DNS-post:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-post {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Första inloggning {#first-login}

1. Öppna din webbläsare och navigera till `https://yourdomain.com`
2. Ange de grundläggande autentiseringsuppgifterna du sparade tidigare
3. Slutför den inledande installationsguiden
4. Skapa ditt första e-postkonto

## Säkerhetskopieringskonfiguration {#backup-configuration}

### Konfigurera S3-kompatibel säkerhetskopiering {#set-up-s3-compatible-backup}

Konfigurera automatiska säkerhetskopior till S3-kompatibel lagring:

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

### Konfigurera säkerhetskopierade Cron-jobb {#set-up-backup-cron-jobs}

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

## Konfiguration för automatisk uppdatering {#auto-update-configuration}

Konfigurera automatiska uppdateringar för din installation av vidarebefordran av e-post:

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

## Debianspecifika överväganden {#debian-specific-considerations}

### Skillnader i pakethantering {#package-management-differences}

* **Snapd**: Inte installerat som standard på Debian, kräver manuell installation
* **Docker**: Använder Debianspecifika repositorier och GPG-nycklar
* **UFW**: Kan eventuellt inte inkluderas i minimala Debian-installationer
* **systemd**: Beteendet kan skilja sig något från Ubuntu

### Tjänstehantering {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Nätverkskonfiguration {#network-configuration}

Debian kan ha olika namn eller konfigurationer för nätverksgränssnitt:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Underhåll och övervakning {#maintenance-and-monitoring}

### Loggplatser {#log-locations}

* **Docker Compose-loggar**: Använd lämpligt docker compose-kommando baserat på installationen
* **Systemloggar**: `/var/log/syslog`
* **Säkerhetskopieringsloggar**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatisk uppdatering av loggar**: `/var/log/autoupdate.log`
* **Snapd-loggar**: `journalctl -u snapd`

### Regelbundna underhållsuppgifter {#regular-maintenance-tasks}

1. **Övervaka diskutrymme**: `df -h`
2. **Kontrollera tjänstens status**: Använd lämpligt docker compose-kommando
3. **Granska loggar**: Kontrollera både program- och systemloggar
4. **Uppdatera systempaket**: `apt update && apt upgrade`
5. **Övervaka snapd**: `snap list` och `snap refresh`

### Certifikatförnyelse {#certificate-renewal}

Certifikat bör förnyas automatiskt, men du kan förnya manuellt vid behov:

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

## Felsökning {#troubleshooting}

### Debianspecifika problem {#debian-specific-issues}

#### 1. Snapd fungerar inte {#1-snapd-not-working}

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

#### 2. Docker Compose-kommandot hittades inte {#2-docker-compose-command-not-found}

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

#### 3. Problem med paketinstallation {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Vanliga problem {#common-issues}

#### 1. Docker-tjänsten startar inte {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certifikatgenerering misslyckas {#2-certificate-generation-fails}

* Se till att portarna 80 och 443 är tillgängliga
* Verifiera att DNS-poster pekar mot din server
* Kontrollera brandväggsinställningarna med `ufw status`

#### 3. Problem med e-postleverans {#3-email-delivery-issues}

* Kontrollera att MX-posterna är korrekta
* Kontrollera SPF-, DKIM- och DMARC-posterna
* Se till att port 25 inte är blockerad av din webbhotellleverantör

### Få hjälp {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub-problem**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian-dokumentation**: <https://www.debian.org/doc/>

## Bästa säkerhetsmetoder {#security-best-practices}

1. **Håll systemet uppdaterat**: Uppdatera Debian och paket regelbundet
2. **Övervaka loggar**: Konfigurera loggövervakning och varningar
3. **Säkerhetskopiera regelbundet**: Testa säkerhetskopierings- och återställningsprocedurer
4. **Använd starka lösenord**: Generera starka lösenord för alla konton
5. **Aktivera Fail2Ban**: Överväg att installera fail2ban för ytterligare säkerhet
6. **Regelbundna säkerhetsgranskningar**: Granska regelbundet din konfiguration
7. **Övervaka Snapd**: Håll snap-paket uppdaterade med `snap refresh`

## Slutsats {#conclusion}

Din egenutvecklade installation av Vidarebefordra e-post borde nu vara klar och köras på Debian. Kom ihåg att:

1. Konfigurera dina DNS-poster korrekt
2. Testa att skicka och ta emot e-post
3. Ställ in regelbundna säkerhetskopior
4. Övervaka ditt system regelbundet
5. Håll din installation uppdaterad
6. Övervaka snapd och snap-paket

De största skillnaderna från Ubuntu är installationen av snapd och konfigurationen av Docker-arkivet. När dessa är korrekt konfigurerade fungerar programmet Vidarebefordra e-post identiskt på båda systemen.

För ytterligare konfigurationsalternativ och avancerade funktioner, se den officiella dokumentationen för vidarebefordran av e-post på <https://forwardemail.net/self-hosted#configuration>.