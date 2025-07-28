# Installationsvejledning til selvhosting af videresendelse af e-mail til Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [Forudsætninger](#prerequisites)
* [Systemkrav](#system-requirements)
* [Trin-for-trin installation](#step-by-step-installation)
  * [Trin 1: Indledende systemopsætning](#step-1-initial-system-setup)
  * [Trin 2: Konfigurer DNS-resolvere](#step-2-configure-dns-resolvers)
  * [Trin 3: Installer systemafhængigheder](#step-3-install-system-dependencies)
  * [Trin 4: Installer og konfigurer Snapd](#step-4-install-and-configure-snapd)
  * [Trin 5: Installer Snap-pakker](#step-5-install-snap-packages)
  * [Trin 6: Installer Docker](#step-6-install-docker)
  * [Trin 7: Konfigurer Docker-tjenesten](#step-7-configure-docker-service)
  * [Trin 8: Installer og konfigurer UFW Firewall](#step-8-install-and-configure-ufw-firewall)
  * [Trin 9: Klon videresendt e-mail-arkiv](#step-9-clone-forward-email-repository)
  * [Trin 10: Opsæt miljøkonfiguration](#step-10-set-up-environment-configuration)
  * [Trin 11: Konfigurer dit domæne](#step-11-configure-your-domain)
  * [Trin 12: Generer SSL-certifikater](#step-12-generate-ssl-certificates)
  * [Trin 13: Generer krypteringsnøgler](#step-13-generate-encryption-keys)
  * [Trin 14: Opdater SSL-stier i konfigurationen](#step-14-update-ssl-paths-in-configuration)
  * [Trin 15: Opsæt grundlæggende godkendelse](#step-15-set-up-basic-authentication)
  * [Trin 16: Implementer med Docker Compose](#step-16-deploy-with-docker-compose)
  * [Trin 17: Bekræft installationen](#step-17-verify-installation)
* [Konfiguration efter installation](#post-installation-configuration)
  * [Opsætning af DNS-poster](#dns-records-setup)
  * [Første login](#first-login)
* [Backupkonfiguration](#backup-configuration)
  * [Opsæt S3-kompatibel sikkerhedskopiering](#set-up-s3-compatible-backup)
  * [Opsæt backup af Cron-job](#set-up-backup-cron-jobs)
* [Automatisk opdateringskonfiguration](#auto-update-configuration)
* [Debian-specifikke overvejelser](#debian-specific-considerations)
  * [Forskelle i pakkehåndtering](#package-management-differences)
  * [Servicestyring](#service-management)
  * [Netværkskonfiguration](#network-configuration)
* [Vedligeholdelse og overvågning](#maintenance-and-monitoring)
  * [Logplaceringer](#log-locations)
  * [Regelmæssige vedligeholdelsesopgaver](#regular-maintenance-tasks)
  * [Fornyelse af certifikat](#certificate-renewal)
* [Fejlfinding](#troubleshooting)
  * [Debian-specifikke problemer](#debian-specific-issues)
  * [Almindelige problemer](#common-issues)
  * [Få hjælp](#getting-help)
* [Bedste praksis for sikkerhed](#security-best-practices)
* [Konklusion](#conclusion)

## Oversigt {#overview}

Denne vejledning giver trinvise instruktioner til installation af Forward Emails selvhostede løsning på Debian-systemer. Vejledningen er specifikt skræddersyet til Debian 11 (Bullseye) og Debian 12 (Bookworm).

## Forudsætninger {#prerequisites}

Før du starter installationen, skal du sørge for at have:

* **Debian Server**: Version 11 (Bullseye) eller 12 (Bookworm)
* **Root-adgang**: Du skal kunne køre kommandoer som root (sudo-adgang)
* **Domænenavn**: Et domæne, som du kontrollerer med DNS-administrationsadgang
* **Ren server**: Det anbefales at bruge en frisk Debian-installation
* **Internetforbindelse**: Kræves for at downloade pakker og Docker-aftryk

## Systemkrav {#system-requirements}

* **RAM**: Minimum 2 GB (4 GB anbefales til produktion)
* **Lagerplads**: Minimum 20 GB tilgængelig plads (50 GB+ anbefales til produktion)
* **CPU**: Minimum 1 vCPU (2+ vCPU'er anbefales til produktion)
* **Netværk**: Offentlig IP-adresse med følgende tilgængelige porte:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Trin-for-trin installation {#step-by-step-installation}

### Trin 1: Indledende systemopsætning {#step-1-initial-system-setup}

Først skal du sørge for, at dit system er opdateret, og skifte til root-bruger:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Trin 2: Konfigurer DNS-resolvere {#step-2-configure-dns-resolvers}

Konfigurer dit system til at bruge Cloudflares DNS-servere til pålidelig certifikatgenerering:

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

### Trin 3: Installer systemafhængigheder {#step-3-install-system-dependencies}

Installer de nødvendige pakker til videresendelse af e-mail på Debian:

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

### Trin 4: Installer og konfigurer Snapd {#step-4-install-and-configure-snapd}

Debian inkluderer ikke snapd som standard, så vi skal installere og konfigurere det:

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

### Trin 5: Installer Snap-pakker {#step-5-install-snap-packages}

Installer AWS CLI og Certbot via snap:

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

### Trin 6: Installer Docker {#step-6-install-docker}

Installer Docker CE og Docker Compose på Debian:

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

### Trin 7: Konfigurer Docker-tjenesten {#step-7-configure-docker-service}

Sørg for, at Docker starter automatisk og kører:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Hvis Docker ikke starter, kan du prøve at starte den manuelt:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Trin 8: Installer og konfigurer UFW Firewall {#step-8-install-and-configure-ufw-firewall}

Debians minimale installationer inkluderer muligvis ikke UFW, så installer det først:

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

### Trin 9: Klon arkivet for videresendelse af e-mails {#step-9-clone-forward-email-repository}

Download kildekoden til videresendelse af e-mail:

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

### Trin 10: Opsæt miljøkonfiguration {#step-10-set-up-environment-configuration}

Forbered miljøkonfigurationen:

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

### Trin 11: Konfigurer dit domæne {#step-11-configure-your-domain}

Angiv dit domænenavn og opdater miljøvariabler:

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

### Trin 12: Generer SSL-certifikater {#step-12-generate-ssl-certificates}

#### Mulighed A: Manuel DNS-udfordring (anbefales til de fleste brugere) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Vigtigt**: Når du bliver bedt om det, skal du oprette TXT-poster i din DNS. Du kan opleve flere udfordringer for det samme domæne - **opret ALLE**. Fjern ikke den første TXT-post, når du tilføjer den anden.

#### Mulighed B: Cloudflare DNS (hvis du bruger Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Hvis dit domæne bruger Cloudflare til DNS, kan du automatisere generering af certifikater:

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

#### Kopiér certifikater {#copy-certificates}

Efter generering af certifikater skal du kopiere dem til programmappen:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Trin 13: Generer krypteringsnøgler {#step-13-generate-encryption-keys}

Opret de forskellige krypteringsnøgler, der kræves for sikker drift:

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

### Trin 14: Opdater SSL-stier i konfigurationen {#step-14-update-ssl-paths-in-configuration}

Konfigurer SSL-certifikatstierne i miljøfilen:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Trin 15: Opsæt grundlæggende godkendelse {#step-15-set-up-basic-authentication}

Opret midlertidige grundlæggende godkendelsesoplysninger:

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

### Trin 16: Implementer med Docker Compose {#step-16-deploy-with-docker-compose}

Start alle tjenester til videresendelse af e-mail:

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

### Trin 17: Bekræft installation {#step-17-verify-installation}

Kontroller, at alle tjenester kører korrekt:

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

### Opsætning af DNS-poster {#dns-records-setup}

Du skal konfigurere følgende DNS-poster for dit domæne:

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

Få din offentlige DKIM-nøgle:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Opret DKIM DNS-post:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-post {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Første login {#first-login}

1. Åbn din webbrowser og naviger til `https://yourdomain.com`
2. Indtast de grundlæggende godkendelsesoplysninger, du gemte tidligere
3. Fuldfør den indledende opsætningsguide
4. Opret din første e-mailkonto

## Backupkonfiguration {#backup-configuration}

### Opsæt S3-kompatibel sikkerhedskopiering {#set-up-s3-compatible-backup}

Konfigurer automatiske sikkerhedskopier til S3-kompatibel lagring:

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

### Opsæt backup af Cron-job {#set-up-backup-cron-jobs}

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

## Konfiguration af automatisk opdatering {#auto-update-configuration}

Konfigurer automatiske opdateringer til din installation af videresendt e-mail:

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

## Debian-specifikke overvejelser {#debian-specific-considerations}

### Forskelle i pakkehåndtering {#package-management-differences}

* **Snapd**: Ikke installeret som standard på Debian, kræver manuel installation
* **Docker**: Bruger Debian-specifikke arkiver og GPG-nøgler
* **UFW**: Er muligvis ikke inkluderet i minimale Debian-installationer
* **systemd**: Opførsel kan afvige en smule fra Ubuntu

### Servicestyring {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Netværkskonfiguration {#network-configuration}

Debian kan have forskellige netværksgrænsefladenavne eller -konfigurationer:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Vedligeholdelse og overvågning {#maintenance-and-monitoring}

### Logplaceringer {#log-locations}

* **Docker Compose-logfiler**: Brug den relevante docker compose-kommando baseret på installationen
* **Systemlogfiler**: `/var/log/syslog`
* **Backup-logfiler**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatisk opdatering af logfiler**: `/var/log/autoupdate.log`
* **Snapd-logfiler**: `journalctl -u snapd`

### Regelmæssige vedligeholdelsesopgaver {#regular-maintenance-tasks}

1. **Overvåg diskplads**: `df -h`
2. **Kontroller servicestatus**: Brug den relevante docker compose-kommando
3. **Gennemgå logfiler**: Kontroller både program- og systemlogfiler
4. **Opdater systempakker**: `apt update && apt upgrade`
5. **Overvåg snapd**: `snap list` og `snap refresh`

### Certifikatfornyelse {#certificate-renewal}

Certifikater bør fornyes automatisk, men du kan forny dem manuelt, hvis det er nødvendigt:

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

## Fejlfinding {#troubleshooting}

### Debian-specifikke problemer {#debian-specific-issues}

#### 1. Snapd virker ikke {#1-snapd-not-working}

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

#### 2. Docker Compose-kommando ikke fundet {#2-docker-compose-command-not-found}

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

#### 3. Problemer med pakkeinstallation {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Almindelige problemer {#common-issues}

#### 1. Docker-tjenesten starter ikke {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certifikatgenerering mislykkes {#2-certificate-generation-fails}

* Sørg for, at port 80 og 443 er tilgængelige
* Bekræft, at DNS-poster peger på din server
* Tjek firewallindstillinger med `ufw status`

#### 3. Problemer med e-maillevering {#3-email-delivery-issues}

* Bekræft at MX-poster er korrekte
* Tjek SPF-, DKIM- og DMARC-poster
* Sørg for at port 25 ikke er blokeret af din hostingudbyder

### Sådan får du hjælp {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub-problemer**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian-dokumentation**: <https://www.debian.org/doc/>

## Bedste praksisser for sikkerhed {#security-best-practices}

1. **Hold systemet opdateret**: Opdater Debian og pakker regelmæssigt
2. **Overvåg logfiler**: Opsæt logovervågning og alarmer
3. **Sikkerhedskopier regelmæssigt**: Test sikkerhedskopierings- og gendannelsesprocedurer
4. **Brug stærke adgangskoder**: Generer stærke adgangskoder til alle konti
5. **Aktiver Fail2Ban**: Overvej at installere fail2ban for yderligere sikkerhed
6. **Regelmæssige sikkerhedsrevisioner**: Gennemgå din konfiguration med jævne mellemrum
7. **Overvåg Snapd**: Hold snap-pakker opdateret med `snap refresh`

## Konklusion {#conclusion}

Din selvhostede installation af Videresend Email burde nu være færdig og køre på Debian. Husk at:

1. Konfigurer dine DNS-poster korrekt
2. Test afsendelse og modtagelse af e-mails
3. Opsæt regelmæssige sikkerhedskopier
4. Overvåg dit system regelmæssigt
5. Hold din installation opdateret
6. Overvåg snapd og snap-pakker

De primære forskelle fra Ubuntu er snapd-installationen og Docker-repository-konfigurationen. Når disse er korrekt konfigureret, opfører Videresend Email-applikationen sig identisk på begge systemer.

For yderligere konfigurationsmuligheder og avancerede funktioner, se den officielle dokumentation til videresendelse af e-mail på <https://forwardemail.net/self-hosted#configuration>.