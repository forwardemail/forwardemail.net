# Installationshandbuch zum Weiterleiten von E-Mails zum Self-Hosting für Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [Voraussetzungen](#prerequisites)
* [Systemanforderungen](#system-requirements)
* [Schritt-für-Schritt-Installation](#step-by-step-installation)
  * [Schritt 1: Erstmalige Systemeinrichtung](#step-1-initial-system-setup)
  * [Schritt 2: Konfigurieren Sie DNS-Resolver](#step-2-configure-dns-resolvers)
  * [Schritt 3: Systemabhängigkeiten installieren](#step-3-install-system-dependencies)
  * [Schritt 4: Installieren Sie Snap-Pakete](#step-4-install-snap-packages)
  * [Schritt 5: Docker installieren](#step-5-install-docker)
  * [Schritt 6: Docker-Dienst konfigurieren](#step-6-configure-docker-service)
  * [Schritt 7: Firewall konfigurieren](#step-7-configure-firewall)
  * [Schritt 8: Weiterleitungs-E-Mail-Repository klonen](#step-8-clone-forward-email-repository)
  * [Schritt 9: Umgebungskonfiguration einrichten](#step-9-set-up-environment-configuration)
  * [Schritt 10: Konfigurieren Sie Ihre Domäne](#step-10-configure-your-domain)
  * [Schritt 11: SSL-Zertifikate generieren](#step-11-generate-ssl-certificates)
  * [Schritt 12: Verschlüsselungsschlüssel generieren](#step-12-generate-encryption-keys)
  * [Schritt 13: SSL-Pfade in der Konfiguration aktualisieren](#step-13-update-ssl-paths-in-configuration)
  * [Schritt 14: Basisauthentifizierung einrichten](#step-14-set-up-basic-authentication)
  * [Schritt 15: Bereitstellen mit Docker Compose](#step-15-deploy-with-docker-compose)
  * [Schritt 16: Installation überprüfen](#step-16-verify-installation)
* [Konfiguration nach der Installation](#post-installation-configuration)
  * [Einrichten von DNS-Einträgen](#dns-records-setup)
  * [Erste Anmeldung](#first-login)
* [Sicherungskonfiguration](#backup-configuration)
  * [S3-kompatibles Backup einrichten](#set-up-s3-compatible-backup)
  * [Einrichten von Backup-Cron-Jobs](#set-up-backup-cron-jobs)
* [Automatische Aktualisierung der Konfiguration](#auto-update-configuration)
* [Wartung und Überwachung](#maintenance-and-monitoring)
  * [Protokollspeicherorte](#log-locations)
  * [Regelmäßige Wartungsaufgaben](#regular-maintenance-tasks)
  * [Zertifikatserneuerung](#certificate-renewal)
* [Fehlerbehebung](#troubleshooting)
  * [Häufige Probleme](#common-issues)
  * [Hilfe bekommen](#getting-help)
* [Bewährte Sicherheitspraktiken](#security-best-practices)
* [Abschluss](#conclusion)

## Übersicht {#overview}

Diese Anleitung enthält Schritt-für-Schritt-Anweisungen zur Installation der selbstgehosteten Lösung von Forward Email auf Ubuntu-Systemen. Sie ist speziell auf die Ubuntu-LTS-Versionen 20.04, 22.04 und 24.04 zugeschnitten.

## Voraussetzungen {#prerequisites}

Stellen Sie vor Beginn der Installation sicher, dass Sie über Folgendes verfügen:

* **Ubuntu-Server**: 20.04, 22.04 oder 24.04 LTS
* **Root-Zugriff**: Sie müssen Befehle als Root ausführen können (Sudo-Zugriff).
* **Domänenname**: Eine Domäne, die Sie mit DNS-Verwaltungszugriff steuern.
* **Neuer Server**: Es wird empfohlen, eine neue Ubuntu-Installation zu verwenden.
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

Installieren Sie die erforderlichen Pakete für die E-Mail-Weiterleitung:

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

### Schritt 4: Snap-Pakete installieren {#step-4-install-snap-packages}

Installieren Sie AWS CLI und Certbot per Snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Schritt 5: Docker installieren {#step-5-install-docker}

Installieren Sie Docker CE und Docker Compose:

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

### Schritt 6: Docker-Dienst konfigurieren {#step-6-configure-docker-service}

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

### Schritt 7: Firewall konfigurieren {#step-7-configure-firewall}

Richten Sie eine UFW-Firewall ein, um Ihren Server zu sichern:

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

### Schritt 8: Weiterleitungs-E-Mail-Repository klonen {#step-8-clone-forward-email-repository}

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

### Schritt 9: Umgebungskonfiguration einrichten {#step-9-set-up-environment-configuration}

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

### Schritt 10: Konfigurieren Sie Ihre Domain {#step-10-configure-your-domain}

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

### Schritt 11: SSL-Zertifikate generieren {#step-11-generate-ssl-certificates}

#### Option A: Manuelle DNS-Challenge (für die meisten Benutzer empfohlen) {#option-a-manual-dns-challenge-recommended-for-most-users}

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

### Schritt 12: Verschlüsselungsschlüssel generieren {#step-12-generate-encryption-keys}

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

### Schritt 13: SSL-Pfade in der Konfiguration aktualisieren {#step-13-update-ssl-paths-in-configuration}

Konfigurieren Sie die SSL-Zertifikatpfade in der Umgebungsdatei:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Schritt 14: Basisauthentifizierung einrichten {#step-14-set-up-basic-authentication}

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

### Schritt 15: Bereitstellen mit Docker Compose {#step-15-deploy-with-docker-compose}

Starten Sie alle E-Mail-Weiterleitungsdienste:

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

### Schritt 16: Installation überprüfen {#step-16-verify-installation}

Überprüfen Sie, ob alle Dienste ordnungsgemäß ausgeführt werden:

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

## Konfiguration nach der Installation {#post-installation-configuration}

### DNS-Eintrags-Setup {#dns-records-setup}

Sie müssen die folgenden DNS-Einträge für Ihre Domäne konfigurieren:

#### MX-Eintrag {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-Datensätze {#a-records}

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

## Backup-Konfiguration {#backup-configuration}

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
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Wartung und Überwachung {#maintenance-and-monitoring}

### Protokollspeicherorte {#log-locations}

* **Docker Compose-Protokolle**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Systemprotokolle**: `/var/log/syslog`
* **Sicherungsprotokolle**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatisch aktualisierte Protokolle**: `/var/log/autoupdate.log`

### Regelmäßige Wartungsaufgaben {#regular-maintenance-tasks}

1. **Speicherplatz überwachen**: `df -h`
2. **Dienststatus prüfen**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Protokolle prüfen**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Systempakete aktualisieren**: `apt update && apt upgrade`
5. **Zertifikate erneuern**: Zertifikate werden automatisch erneuert, das Ablaufdatum wird jedoch überwacht.

### Zertifikatserneuerung {#certificate-renewal}

Zertifikate sollten automatisch erneuert werden, Sie können sie jedoch bei Bedarf manuell erneuern:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Fehlerbehebung {#troubleshooting}

### Häufige Probleme {#common-issues}

#### 1. Docker-Dienst startet nicht {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Zertifikatsgenerierung schlägt fehl {#2-certificate-generation-fails}

* Stellen Sie sicher, dass die Ports 80 und 443 erreichbar sind.
* Überprüfen Sie, ob die DNS-Einträge auf Ihren Server verweisen.
* Überprüfen Sie die Firewall-Einstellungen.

#### 3. Probleme bei der E-Mail-Zustellung {#3-email-delivery-issues}

* Überprüfen Sie, ob die MX-Einträge korrekt sind.
* Überprüfen Sie die SPF-, DKIM- und DMARC-Einträge.
* Stellen Sie sicher, dass Port 25 nicht von Ihrem Hosting-Anbieter blockiert wird.

#### 4. Web-Schnittstelle nicht zugänglich {#4-web-interface-not-accessible}

* Firewall-Einstellungen prüfen: `ufw status`
* SSL-Zertifikate verifizieren: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Grundlegende Authentifizierungsdaten prüfen

### Hilfe erhalten {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub-Probleme**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Community-Support**: Sehen Sie sich die GitHub-Diskussionen des Projekts an.

## Bewährte Sicherheitspraktiken {#security-best-practices}

1. **System aktuell halten**: Ubuntu und Pakete regelmäßig aktualisieren.
2. **Protokolle überwachen**: Protokollüberwachung und Warnmeldungen einrichten.
3. **Regelmäßige Sicherungen**: Sicherungs- und Wiederherstellungsverfahren testen.
4. **Sichere Passwörter verwenden**: Sichere Passwörter für alle Konten erstellen.
5. **Fail2Ban aktivieren**: Erwägen Sie die Installation von Fail2Ban für zusätzliche Sicherheit.
6. **Regelmäßige Sicherheitsüberprüfungen**: Überprüfen Sie regelmäßig Ihre Konfiguration.

## Fazit {#conclusion}

Ihre selbstgehostete Installation von Forward Email sollte nun abgeschlossen sein und unter Ubuntu ausgeführt werden. Beachten Sie Folgendes:

1. Konfigurieren Sie Ihre DNS-Einträge korrekt.
2. Testen Sie den E-Mail-Versand und -Empfang.
3. Richten Sie regelmäßige Backups ein.
4. Überwachen Sie Ihr System regelmäßig.
5. Halten Sie Ihre Installation auf dem neuesten Stand.

Weitere Konfigurationsoptionen und erweiterte Funktionen finden Sie in der offiziellen Forward Email-Dokumentation unter <https://forwardemail.net/self-hosted#configuration>.