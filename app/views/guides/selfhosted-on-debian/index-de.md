# Forward Email Self-Hosting Installationshandbuch für Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [Voraussetzungen](#prerequisites)
* [Systemanforderungen](#system-requirements)
* [Schritt-für-Schritt-Installation](#step-by-step-installation)
  * [Schritt 1: Erstmalige Systemeinrichtung](#step-1-initial-system-setup)
  * [Schritt 2: Konfigurieren Sie DNS-Resolver](#step-2-configure-dns-resolvers)
  * [Schritt 3: Systemabhängigkeiten installieren](#step-3-install-system-dependencies)
  * [Schritt 4: Installieren und Konfigurieren von Snapd](#step-4-install-and-configure-snapd)
  * [Schritt 5: Installieren Sie Snap-Pakete](#step-5-install-snap-packages)
  * [Schritt 6: Docker installieren](#step-6-install-docker)
  * [Schritt 7: Docker-Dienst konfigurieren](#step-7-configure-docker-service)
  * [Schritt 8: Installieren und Konfigurieren der UFW-Firewall](#step-8-install-and-configure-ufw-firewall)
  * [Schritt 9: Weiterleitungs-E-Mail-Repository klonen](#step-9-clone-forward-email-repository)
  * [Schritt 10: Umgebungskonfiguration einrichten](#step-10-set-up-environment-configuration)
  * [Schritt 11: Konfigurieren Sie Ihre Domäne](#step-11-configure-your-domain)
  * [Schritt 12: SSL-Zertifikate generieren](#step-12-generate-ssl-certificates)
  * [Schritt 13: Verschlüsselungsschlüssel generieren](#step-13-generate-encryption-keys)
  * [Schritt 14: SSL-Pfade in der Konfiguration aktualisieren](#step-14-update-ssl-paths-in-configuration)
  * [Schritt 15: Einrichten der Basisauthentifizierung](#step-15-set-up-basic-authentication)
  * [Schritt 16: Bereitstellen mit Docker Compose](#step-16-deploy-with-docker-compose)
  * [Schritt 17: Installation überprüfen](#step-17-verify-installation)
* [Konfiguration nach der Installation](#post-installation-configuration)
  * [Einrichten von DNS-Einträgen](#dns-records-setup)
  * [Erste Anmeldung](#first-login)
* [Sicherungskonfiguration](#backup-configuration)
  * [S3-kompatibles Backup einrichten](#set-up-s3-compatible-backup)
  * [Einrichten von Backup-Cron-Jobs](#set-up-backup-cron-jobs)
* [Automatische Aktualisierung der Konfiguration](#auto-update-configuration)
* [Debian-spezifische Überlegungen](#debian-specific-considerations)
  * [Unterschiede in der Paketverwaltung](#package-management-differences)
  * [Serviceverwaltung](#service-management)
  * [Netzwerkkonfiguration](#network-configuration)
* [Wartung und Überwachung](#maintenance-and-monitoring)
  * [Protokollspeicherorte](#log-locations)
  * [Regelmäßige Wartungsaufgaben](#regular-maintenance-tasks)
  * [Zertifikatserneuerung](#certificate-renewal)
* [Fehlerbehebung](#troubleshooting)
  * [Debian-spezifische Probleme](#debian-specific-issues)
  * [Häufige Probleme](#common-issues)
  * [Hilfe bekommen](#getting-help)
* [Bewährte Sicherheitspraktiken](#security-best-practices)
* [Abschluss](#conclusion)

## Übersicht {#overview}

Diese Anleitung enthält eine Schritt-für-Schritt-Anleitung zur Installation der selbstgehosteten Lösung von Forward Email auf Debian-Systemen. Sie ist speziell auf Debian 11 (Bullseye) und Debian 12 (Bookworm) zugeschnitten.

## Voraussetzungen {#prerequisites}

Stellen Sie vor Beginn der Installation sicher, dass Sie über Folgendes verfügen:

* **Debian-Server**: Version 11 (Bullseye) oder 12 (Bookworm)
* **Root-Zugriff**: Sie müssen Befehle als Root ausführen können (Sudo-Zugriff).
* **Domänenname**: Eine von Ihnen verwaltete Domäne mit DNS-Verwaltungszugriff.
* **Neuer Server**: Empfohlen wird eine neue Debian-Installation.
* **Internetverbindung**: Erforderlich zum Herunterladen von Paketen und Docker-Images.

## Systemanforderungen {#system-requirements}

* **RAM**: Mindestens 2 GB (4 GB für die Produktion empfohlen)
* **Speicher**: Mindestens 20 GB freier Speicherplatz (50 GB+ für die Produktion empfohlen)
* **CPU**: Mindestens 1 vCPU (2+ vCPUs für die Produktion empfohlen)
* **Netzwerk**: Öffentliche IP-Adresse mit folgenden erreichbaren Ports:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Schritt-für-Schritt-Installation {#step-by-step-installation}

### Schritt 1: Erstmalige Systemeinrichtung {#step-1-initial-system-setup}

Stellen Sie zunächst sicher, dass Ihr System auf dem neuesten Stand ist, und wechseln Sie zum Root-Benutzer:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Schritt 2: DNS-Resolver konfigurieren {#step-2-configure-dns-resolvers}

Konfigurieren Sie Ihr System so, dass es die DNS-Server von Cloudflare zur zuverlässigen Zertifikatsgenerierung verwendet:

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

### Schritt 3: Systemabhängigkeiten installieren {#step-3-install-system-dependencies}

Installieren Sie die erforderlichen Pakete für Forward Email unter Debian:

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

### Schritt 4: Installieren und konfigurieren Sie Snapd {#step-4-install-and-configure-snapd}

Debian enthält standardmäßig kein Snapd, daher müssen wir es installieren und konfigurieren:

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

### Schritt 5: Snap-Pakete installieren {#step-5-install-snap-packages}

Installieren Sie AWS CLI und Certbot per Snap:

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

### Schritt 6: Docker installieren {#step-6-install-docker}

Installieren Sie Docker CE und Docker Compose unter Debian:

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

### Schritt 7: Docker-Dienst konfigurieren {#step-7-configure-docker-service}

Stellen Sie sicher, dass Docker automatisch startet und ausgeführt wird:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Wenn Docker nicht startet, versuchen Sie, es manuell zu starten:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Schritt 8: Installieren und Konfigurieren der UFW-Firewall {#step-8-install-and-configure-ufw-firewall}

Debian-Minimalinstallationen enthalten möglicherweise kein UFW. Installieren Sie es daher zuerst:

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

### Schritt 9: Weiterleitungs-E-Mail-Repository klonen {#step-9-clone-forward-email-repository}

Laden Sie den Quellcode für die E-Mail-Weiterleitung herunter:

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

### Schritt 10: Umgebungskonfiguration einrichten {#step-10-set-up-environment-configuration}

Bereiten Sie die Umgebungskonfiguration vor:

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

### Schritt 11: Konfigurieren Sie Ihre Domain {#step-11-configure-your-domain}

Legen Sie Ihren Domänennamen fest und aktualisieren Sie die Umgebungsvariablen:

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

### Schritt 12: SSL-Zertifikate generieren {#step-12-generate-ssl-certificates}

#### Option A: Manuelle DNS-Herausforderung (für die meisten Benutzer empfohlen) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Wichtig**: Wenn Sie dazu aufgefordert werden, müssen Sie TXT-Einträge in Ihrem DNS erstellen. Möglicherweise werden mehrere Herausforderungen für dieselbe Domain angezeigt. **Erstellen Sie ALLE**. Entfernen Sie den ersten TXT-Eintrag nicht, wenn Sie den zweiten hinzufügen.

#### Option B: Cloudflare DNS (wenn Sie Cloudflare verwenden) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Wenn Ihre Domäne Cloudflare für DNS verwendet, können Sie die Zertifikatsgenerierung automatisieren:

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

#### Zertifikate kopieren {#copy-certificates}

Kopieren Sie die Zertifikate nach der Generierung in das Anwendungsverzeichnis:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Schritt 13: Verschlüsselungsschlüssel generieren {#step-13-generate-encryption-keys}

Erstellen Sie die verschiedenen Verschlüsselungsschlüssel, die für einen sicheren Betrieb erforderlich sind:

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

### Schritt 14: SSL-Pfade in der Konfiguration aktualisieren {#step-14-update-ssl-paths-in-configuration}

Konfigurieren Sie die SSL-Zertifikatpfade in der Umgebungsdatei:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Schritt 15: Basisauthentifizierung einrichten {#step-15-set-up-basic-authentication}

Erstellen Sie temporäre Anmeldeinformationen für die Basisauthentifizierung:

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

### Schritt 16: Bereitstellen mit Docker Compose {#step-16-deploy-with-docker-compose}

Starten Sie alle E-Mail-Weiterleitungsdienste:

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

### Schritt 17: Installation überprüfen {#step-17-verify-installation}

Überprüfen Sie, ob alle Dienste ordnungsgemäß ausgeführt werden:

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

## Konfiguration nach der Installation {#post-installation-configuration}

### DNS-Eintrags-Setup {#dns-records-setup}

Sie müssen die folgenden DNS-Einträge für Ihre Domäne konfigurieren:

#### MX-Eintrag {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A Datensätze {#a-records}

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

#### SPF-Eintrag {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-Eintrag {#dkim-record}

Holen Sie sich Ihren öffentlichen DKIM-Schlüssel:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM-DNS-Eintrag erstellen:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-Eintrag {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Erste Anmeldung {#first-login}

1. Öffnen Sie Ihren Webbrowser und navigieren Sie zu `https://yourdomain.com`.
2. Geben Sie die zuvor gespeicherten Anmeldedaten für die Standardauthentifizierung ein.
3. Schließen Sie den Einrichtungsassistenten ab.
4. Erstellen Sie Ihr erstes E-Mail-Konto.

## Sicherungskonfiguration {#backup-configuration}

### S3-kompatibles Backup einrichten {#set-up-s3-compatible-backup}

Konfigurieren Sie automatische Sicherungen auf S3-kompatiblem Speicher:

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

### Backup-Cron-Jobs einrichten {#set-up-backup-cron-jobs}

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

## Automatische Aktualisierung der Konfiguration {#auto-update-configuration}

Richten Sie automatische Updates für Ihre Forward Email-Installation ein:

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

## Debian-spezifische Überlegungen {#debian-specific-considerations}

### Unterschiede in der Paketverwaltung {#package-management-differences}

* **Snapd**: Unter Debian nicht standardmäßig installiert, erfordert manuelle Installation.
* **Docker**: Verwendet Debian-spezifische Repositories und GPG-Schlüssel.
* **UFW**: Ist möglicherweise nicht in minimalen Debian-Installationen enthalten.
* **systemd**: Das Verhalten kann leicht von Ubuntu abweichen.

### Serviceverwaltung {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Netzwerkkonfiguration {#network-configuration}

Debian kann andere Netzwerkschnittstellennamen oder -konfigurationen haben:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Wartung und Überwachung {#maintenance-and-monitoring}

### Protokollspeicherorte {#log-locations}

* **Docker Compose-Protokolle**: Verwenden Sie den entsprechenden Docker Compose-Befehl basierend auf der Installation.
* **Systemprotokolle**: `/var/log/syslog`
* **Sicherungsprotokolle**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatisch aktualisierte Protokolle**: `/var/log/autoupdate.log`
* **Snapd-Protokolle**: `journalctl -u snapd`

### Regelmäßige Wartungsaufgaben {#regular-maintenance-tasks}

1. **Speicherplatz überwachen**: `df -h`
2. **Dienststatus prüfen**: Verwenden Sie den entsprechenden Docker-Compose-Befehl.
3. **Protokolle prüfen**: Überprüfen Sie sowohl Anwendungs- als auch Systemprotokolle.
4. **Systempakete aktualisieren**: `apt update && apt upgrade`
5. **Snapd überwachen**: `snap list` und `snap refresh`

### Zertifikatserneuerung {#certificate-renewal}

Zertifikate sollten automatisch erneuert werden, Sie können sie jedoch bei Bedarf manuell erneuern:

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

## Fehlerbehebung {#troubleshooting}

### Debian-spezifische Probleme {#debian-specific-issues}

#### 1. Snapd funktioniert nicht {#1-snapd-not-working}

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

#### 2. Docker Compose-Befehl nicht gefunden {#2-docker-compose-command-not-found}

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

#### 3. Probleme bei der Paketinstallation {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Häufige Probleme {#common-issues}

#### 1. Docker-Dienst startet nicht {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Zertifikatsgenerierung schlägt fehl {#2-certificate-generation-fails}

* Stellen Sie sicher, dass die Ports 80 und 443 erreichbar sind.
* Überprüfen Sie, ob die DNS-Einträge auf Ihren Server verweisen.
* Überprüfen Sie die Firewall-Einstellungen mit `ufw status`.

#### 3. Probleme bei der E-Mail-Zustellung {#3-email-delivery-issues}

* Überprüfen Sie, ob die MX-Einträge korrekt sind.
* Überprüfen Sie die SPF-, DKIM- und DMARC-Einträge.
* Stellen Sie sicher, dass Port 25 nicht von Ihrem Hosting-Anbieter blockiert wird.

### Hilfe erhalten {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub-Probleme**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian-Dokumentation**: <https://www.debian.org/doc/>

## Best Practices für die Sicherheit {#security-best-practices}

1. **System aktuell halten**: Debian und Pakete regelmäßig aktualisieren.
2. **Protokolle überwachen**: Protokollüberwachung und -warnungen einrichten.
3. **Regelmäßige Sicherungen durchführen**: Sicherungs- und Wiederherstellungsverfahren testen.
4. **Sichere Passwörter verwenden**: Sichere Passwörter für alle Konten erstellen.
5. **Fail2Ban aktivieren**: Erwägen Sie die Installation von Fail2Ban für zusätzliche Sicherheit.
6. **Regelmäßige Sicherheitsüberprüfungen**: Überprüfen Sie regelmäßig Ihre Konfiguration.
7. **Snapd überwachen**: Snap-Pakete mit `snap refresh` auf dem neuesten Stand halten.

## Fazit {#conclusion}

Ihre selbstgehostete Installation von Forward Email sollte nun abgeschlossen sein und unter Debian ausgeführt werden. Beachten Sie Folgendes:

1. Konfigurieren Sie Ihre DNS-Einträge korrekt.
2. Testen Sie den E-Mail-Versand und -Empfang.
3. Richten Sie regelmäßige Backups ein.
4. Überwachen Sie Ihr System regelmäßig.
5. Halten Sie Ihre Installation auf dem neuesten Stand.
6. Überwachen Sie Snapd und Snap-Pakete.

Die Hauptunterschiede zu Ubuntu liegen in der Snapd-Installation und der Konfiguration des Docker-Repositorys. Sobald diese ordnungsgemäß eingerichtet sind, verhält sich die Anwendung „Forward Email“ auf beiden Systemen identisch.

Weitere Konfigurationsoptionen und erweiterte Funktionen finden Sie in der offiziellen Forward Email-Dokumentation unter <https://forwardemail.net/self-hosted#configuration>.