# Installatiehandleiding voor zelfhosting van e-mail doorsturen voor Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Inhoudsopgave {#table-of-contents}

* [Overzicht](#overview)
* [Vereisten](#prerequisites)
* [Systeemvereisten](#system-requirements)
* [Stap-voor-stap installatie](#step-by-step-installation)
  * [Stap 1: Initiële systeeminstallatie](#step-1-initial-system-setup)
  * [Stap 2: DNS-resolvers configureren](#step-2-configure-dns-resolvers)
  * [Stap 3: Systeemafhankelijkheden installeren](#step-3-install-system-dependencies)
  * [Stap 4: Snapd installeren en configureren](#step-4-install-and-configure-snapd)
  * [Stap 5: Snap-pakketten installeren](#step-5-install-snap-packages)
  * [Stap 6: Docker installeren](#step-6-install-docker)
  * [Stap 7: Docker-service configureren](#step-7-configure-docker-service)
  * [Stap 8: UFW Firewall installeren en configureren](#step-8-install-and-configure-ufw-firewall)
  * [Stap 9: Kloon de doorstuur-e-mailrepository](#step-9-clone-forward-email-repository)
  * [Stap 10: Omgevingsconfiguratie instellen](#step-10-set-up-environment-configuration)
  * [Stap 11: Configureer uw domein](#step-11-configure-your-domain)
  * [Stap 12: SSL-certificaten genereren](#step-12-generate-ssl-certificates)
  * [Stap 13: Genereer encryptiesleutels](#step-13-generate-encryption-keys)
  * [Stap 14: SSL-paden bijwerken in Configuratie](#step-14-update-ssl-paths-in-configuration)
  * [Stap 15: Basisverificatie instellen](#step-15-set-up-basic-authentication)
  * [Stap 16: Implementeren met Docker Compose](#step-16-deploy-with-docker-compose)
  * [Stap 17: Controleer de installatie](#step-17-verify-installation)
* [Configuratie na installatie](#post-installation-configuration)
  * [DNS-records instellen](#dns-records-setup)
  * [Eerste aanmelding](#first-login)
* [Back-upconfiguratie](#backup-configuration)
  * [S3-compatibele back-up instellen](#set-up-s3-compatible-backup)
  * [Back-up cron-jobs instellen](#set-up-backup-cron-jobs)
* [Automatische updateconfiguratie](#auto-update-configuration)
* [Debian-specifieke overwegingen](#debian-specific-considerations)
  * [Verschillen in pakketbeheer](#package-management-differences)
  * [Servicemanagement](#service-management)
  * [Netwerkconfiguratie](#network-configuration)
* [Onderhoud en monitoring](#maintenance-and-monitoring)
  * [Logboeklocaties](#log-locations)
  * [Regelmatige onderhoudswerkzaamheden](#regular-maintenance-tasks)
  * [Certificaatvernieuwing](#certificate-renewal)
* [Probleemoplossing](#troubleshooting)
  * [Debian-specifieke problemen](#debian-specific-issues)
  * [Veelvoorkomende problemen](#common-issues)
  * [Hulp krijgen](#getting-help)
* [Aanbevolen beveiligingspraktijken](#security-best-practices)
* [Conclusie](#conclusion)

## Overzicht {#overview}

Deze handleiding biedt stapsgewijze instructies voor het installeren van de zelfgehoste oplossing van Forward Email op Debian-systemen. Deze handleiding is specifiek afgestemd op Debian 11 (Bullseye) en Debian 12 (Bookworm).

## Vereisten {#prerequisites}

Voordat u met de installatie begint, moet u ervoor zorgen dat u het volgende heeft:

* **Debian Server**: Versie 11 (Bullseye) of 12 (Bookworm)
* **Root-toegang**: U moet opdrachten als root kunnen uitvoeren (sudo-toegang)
* **Domeinnaam**: Een domein dat u beheert met DNS-beheertoegang
* **Schone server**: Aanbevolen om een nieuwe Debian-installatie te gebruiken
* **Internetverbinding**: Vereist voor het downloaden van pakketten en Docker-images

## Systeemvereisten {#system-requirements}

* **RAM**: Minimaal 2 GB (4 GB aanbevolen voor productie)
* **Opslag**: Minimaal 20 GB beschikbare ruimte (50 GB+ aanbevolen voor productie)
* **CPU**: Minimaal 1 vCPU (2+ vCPU's aanbevolen voor productie)
* **Netwerk**: Openbaar IP-adres met de volgende toegankelijke poorten:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Stapsgewijze installatie {#step-by-step-installation}

### Stap 1: Initiële systeeminstallatie {#step-1-initial-system-setup}

Zorg er eerst voor dat uw systeem up-to-date is en schakel over naar rootgebruiker:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Stap 2: DNS-resolvers configureren {#step-2-configure-dns-resolvers}

Configureer uw systeem om de DNS-servers van Cloudflare te gebruiken voor betrouwbare certificaatgeneratie:

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

### Stap 3: Systeemafhankelijkheden installeren {#step-3-install-system-dependencies}

Installeer de vereiste pakketten voor Forward Email op Debian:

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

### Stap 4: Snapd {#step-4-install-and-configure-snapd} installeren en configureren

Debian bevat snapd standaard niet, dus we moeten het installeren en configureren:

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

### Stap 5: Snap-pakketten installeren {#step-5-install-snap-packages}

Installeer AWS CLI en Certbot via snap:

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

### Stap 6: Docker installeren {#step-6-install-docker}

Docker CE en Docker Compose installeren op Debian:

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

### Stap 7: Docker-service configureren {#step-7-configure-docker-service}

Zorg ervoor dat Docker automatisch start en draait:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Als Docker niet start, probeer het dan handmatig te starten:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Stap 8: UFW Firewall installeren en configureren {#step-8-install-and-configure-ufw-firewall}

Minimale Debian-installaties bevatten mogelijk geen UFW, dus installeer het eerst:

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

### Stap 9: Kloon doorstuur-e-mailrepository {#step-9-clone-forward-email-repository}

Download de broncode van Forward Email:

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

### Stap 10: Omgevingsconfiguratie instellen {#step-10-set-up-environment-configuration}

De omgevingsconfiguratie voorbereiden:

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

### Stap 11: Configureer uw domein {#step-11-configure-your-domain}

Stel uw domeinnaam in en werk de omgevingsvariabelen bij:

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

### Stap 12: SSL-certificaten genereren {#step-12-generate-ssl-certificates}

#### Optie A: Handmatige DNS-uitdaging (aanbevolen voor de meeste gebruikers) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Belangrijk**: Wanneer u hierom wordt gevraagd, moet u TXT-records aanmaken in uw DNS. Mogelijk ziet u meerdere problemen voor hetzelfde domein - **maak ze ALLEMAAL aan**. Verwijder het eerste TXT-record niet wanneer u het tweede toevoegt.

#### Optie B: Cloudflare DNS (als u Cloudflare gebruikt) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Als uw domein Cloudflare voor DNS gebruikt, kunt u de certificaatgeneratie automatiseren:

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

#### Certificaten kopiëren {#copy-certificates}

Kopieer de certificaten na het genereren naar de toepassingsmap:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Stap 13: Genereer encryptiesleutels {#step-13-generate-encryption-keys}

Maak de verschillende encryptiesleutels aan die nodig zijn voor een veilige werking:

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

### Stap 14: SSL-paden bijwerken in configuratie {#step-14-update-ssl-paths-in-configuration}

Configureer de SSL-certificaatpaden in het omgevingsbestand:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Stap 15: Basisverificatie instellen {#step-15-set-up-basic-authentication}

Tijdelijke basisauthenticatiegegevens aanmaken:

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

### Stap 16: Implementeren met Docker Compose {#step-16-deploy-with-docker-compose}

Start alle Forward Email-services:

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

### Stap 17: Controleer installatie {#step-17-verify-installation}

Controleer of alle services correct werken:

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

## Configuratie na installatie {#post-installation-configuration}

### DNS-records instellen {#dns-records-setup}

U moet de volgende DNS-records voor uw domein configureren:

#### MX-record {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A registreert {#a-records}

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

#### SPF-record {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-record {#dkim-record}

Haal uw DKIM-openbare sleutel op:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM DNS-record maken:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-record {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Eerste aanmelding {#first-login}

1. Open je webbrowser en ga naar `https://yourdomain.com`
2. Voer de basisauthenticatiegegevens in die je eerder hebt opgeslagen
3. Voltooi de wizard voor de eerste installatie
4. Maak je eerste e-mailaccount aan

## Back-upconfiguratie {#backup-configuration}

### S3-compatibele back-up instellen {#set-up-s3-compatible-backup}

Automatische back-ups configureren naar S3-compatibele opslag:

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

### Back-up cron-taken instellen {#set-up-backup-cron-jobs}

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

## Automatische updateconfiguratie {#auto-update-configuration}

Stel automatische updates in voor uw Forward Email-installatie:

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

## Debian-specifieke overwegingen {#debian-specific-considerations}

### Verschillen in pakketbeheer {#package-management-differences}

* **Snapd**: Niet standaard geïnstalleerd op Debian, vereist handmatige installatie
* **Docker**: Gebruikt Debian-specifieke repositories en GPG-sleutels
* **UFW**: Mogelijk niet inbegrepen in minimale Debian-installaties
* **systemd**: Gedrag kan enigszins afwijken van Ubuntu

### Servicebeheer {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Netwerkconfiguratie {#network-configuration}

Debian kan verschillende netwerkinterfacenamen of -configuraties hebben:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Onderhoud en monitoring {#maintenance-and-monitoring}

### Logboeklocaties {#log-locations}

* **Docker Compose-logs**: Gebruik de juiste docker compose-opdracht op basis van de installatie
* **Systeemlogs**: `/var/log/syslog`
* **Back-uplogs**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logs voor automatische updates**: `/var/log/autoupdate.log`
* **Snapd-logs**: `journalctl -u snapd`

### Regelmatige onderhoudstaken {#regular-maintenance-tasks}

1. **Schijfruimte controleren**: `df -h`
2. **Servicestatus controleren**: Gebruik de juiste docker compose-opdracht
3. **Logboeken bekijken**: Controleer zowel de applicatie- als de systeemlogboeken
4. **Systeempakketten bijwerken**: `apt update && apt upgrade`
5. **Snapd controleren**: `snap list` en `snap refresh`

### Certificaatvernieuwing {#certificate-renewal}

Certificaten worden automatisch verlengd, maar u kunt ze indien nodig handmatig verlengen:

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

## Problemen oplossen met {#troubleshooting}

### Debian-specifieke problemen {#debian-specific-issues}

#### 1. Snapd werkt niet {#1-snapd-not-working}

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

#### 2. Docker Compose-opdracht niet gevonden {#2-docker-compose-command-not-found}

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

#### 3. Problemen met pakketinstallatie {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Veelvoorkomende problemen {#common-issues}

#### 1. Docker-service start niet {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certificaatgeneratie mislukt {#2-certificate-generation-fails}

* Zorg ervoor dat poorten 80 en 443 toegankelijk zijn
* Controleer of DNS-records naar uw server verwijzen
* Controleer de firewallinstellingen met `ufw status`

#### 3. Problemen met e-mailbezorging {#3-email-delivery-issues}

* Controleer of de MX-records correct zijn
* Controleer de SPF-, DKIM- en DMARC-records
* Zorg ervoor dat poort 25 niet geblokkeerd is door je hostingprovider

### Hulp krijgen {#getting-help}

* **Documentatie**: <https://forwardemail.net/self-hosted>
* **GitHub-problemen**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian-documentatie**: <https://www.debian.org/doc/>

## Aanbevolen beveiligingspraktijken {#security-best-practices}

1. **Systeem up-to-date houden**: Debian en pakketten regelmatig bijwerken
2. **Logs monitoren**: Logmonitoring en waarschuwingen instellen
3. **Regelmatig back-ups maken**: Back-up- en herstelprocedures testen
4. **Sterke wachtwoorden gebruiken**: Sterke wachtwoorden genereren voor alle accounts
5. **Fail2Ban inschakelen**: Overweeg de installatie van fail2ban voor extra beveiliging
6. **Regelmatige beveiligingscontroles**: Controleer uw configuratie regelmatig
7. **Snapd monitoren**: Snap-pakketten up-to-date houden met `snap refresh`

## Conclusie {#conclusion}

Uw zelfgehoste installatie van Forward Email zou nu voltooid moeten zijn en op Debian moeten draaien. Vergeet niet om:

1. Configureer uw DNS-records correct
2. Test het verzenden en ontvangen van e-mail
3. Stel regelmatig back-ups in
4. Controleer uw systeem regelmatig
5. Houd uw installatie up-to-date
6. Controleer snapd en snap-pakketten

De belangrijkste verschillen met Ubuntu zijn de snapd-installatie en de configuratie van de Docker-repository. Zodra deze correct zijn ingesteld, werkt de applicatie Forward Email op beide systemen identiek.

Voor aanvullende configuratieopties en geavanceerde functies raadpleegt u de officiële documentatie voor het doorsturen van e-mails op <https://forwardemail.net/self-hosted#configuration>.