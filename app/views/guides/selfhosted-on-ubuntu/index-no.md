# Installasjonsveiledning for selvhosting av videresendt e-post for Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Forutsetninger](#prerequisites)
* [Systemkrav](#system-requirements)
* [Steg-for-steg-installasjon](#step-by-step-installation)
  * [Trinn 1: Første systemoppsett](#step-1-initial-system-setup)
  * [Trinn 2: Konfigurer DNS-resolvere](#step-2-configure-dns-resolvers)
  * [Trinn 3: Installer systemavhengigheter](#step-3-install-system-dependencies)
  * [Trinn 4: Installer Snap-pakker](#step-4-install-snap-packages)
  * [Trinn 5: Installer Docker](#step-5-install-docker)
  * [Trinn 6: Konfigurer Docker-tjenesten](#step-6-configure-docker-service)
  * [Trinn 7: Konfigurer brannmur](#step-7-configure-firewall)
  * [Trinn 8: Klon arkivet for videresendt e-post](#step-8-clone-forward-email-repository)
  * [Trinn 9: Konfigurer miljøkonfigurasjon](#step-9-set-up-environment-configuration)
  * [Trinn 10: Konfigurer domenet ditt](#step-10-configure-your-domain)
  * [Trinn 11: Generer SSL-sertifikater](#step-11-generate-ssl-certificates)
  * [Trinn 12: Generer krypteringsnøkler](#step-12-generate-encryption-keys)
  * [Trinn 13: Oppdater SSL-stier i konfigurasjonen](#step-13-update-ssl-paths-in-configuration)
  * [Trinn 14: Konfigurer grunnleggende autentisering](#step-14-set-up-basic-authentication)
  * [Trinn 15: Implementer med Docker Compose](#step-15-deploy-with-docker-compose)
  * [Trinn 16: Bekreft installasjonen](#step-16-verify-installation)
* [Konfigurasjon etter installasjon](#post-installation-configuration)
  * [Oppsett av DNS-oppføringer](#dns-records-setup)
  * [Første innlogging](#first-login)
* [Sikkerhetskopieringskonfigurasjon](#backup-configuration)
  * [Konfigurer S3-kompatibel sikkerhetskopiering](#set-up-s3-compatible-backup)
  * [Konfigurer sikkerhetskopier av Cron-jobber](#set-up-backup-cron-jobs)
* [Konfigurasjon for automatisk oppdatering](#auto-update-configuration)
* [Vedlikehold og overvåking](#maintenance-and-monitoring)
  * [Loggplasseringer](#log-locations)
  * [Regelmessige vedlikeholdsoppgaver](#regular-maintenance-tasks)
  * [Fornyelse av sertifikat](#certificate-renewal)
* [Feilsøking](#troubleshooting)
  * [Vanlige problemer](#common-issues)
  * [Få hjelp](#getting-help)
* [Beste praksis for sikkerhet](#security-best-practices)
* [Konklusjon](#conclusion)

## Oversikt {#overview}

Denne veiledningen gir trinnvise instruksjoner for installasjon av Forward Emails selvhostede løsning på Ubuntu-systemer. Denne veiledningen er spesielt skreddersydd for Ubuntu 20.04, 22.04 og 24.04 LTS-versjoner.

## Forutsetninger {#prerequisites}

Før du starter installasjonen, sørg for at du har:

* **Ubuntu-server**: 20.04, 22.04 eller 24.04 LTS
* **Root-tilgang**: Du må kunne kjøre kommandoer som root (sudo-tilgang)
* **Domenenavn**: Et domene du kontrollerer med DNS-administrasjonstilgang
* **Ren server**: Anbefales å bruke en ny Ubuntu-installasjon
* **Internettforbindelse**: Kreves for nedlasting av pakker og Docker-avbildninger

## Systemkrav {#system-requirements}

* **RAM**: Minimum 2 GB (4 GB anbefales for produksjon)
* **Lagring**: Minimum 20 GB tilgjengelig plass (50 GB+ anbefales for produksjon)
* **CPU**: Minimum 1 vCPU (2+ vCPU-er anbefales for produksjon)
* **Nettverk**: Offentlig IP-adresse med følgende tilgjengelige porter:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Trinnvis installasjon {#step-by-step-installation}

### Trinn 1: Første systemoppsett {#step-1-initial-system-setup}

Først må du sørge for at systemet ditt er oppdatert og bytte til root-bruker:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Trinn 2: Konfigurer DNS-resolvere {#step-2-configure-dns-resolvers}

Konfigurer systemet ditt til å bruke Cloudflares DNS-servere for pålitelig sertifikatgenerering:

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

### Trinn 3: Installer systemavhengigheter {#step-3-install-system-dependencies}

Installer de nødvendige pakkene for videresending av e-post:

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

### Trinn 4: Installer Snap-pakker {#step-4-install-snap-packages}

Installer AWS CLI og Certbot via snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Trinn 5: Installer Docker {#step-5-install-docker}

Installer Docker CE og Docker Compose:

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

### Trinn 6: Konfigurer Docker-tjenesten {#step-6-configure-docker-service}

Sørg for at Docker starter automatisk og kjører:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Hvis Docker ikke starter, kan du prøve å starte den manuelt:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Trinn 7: Konfigurer brannmur {#step-7-configure-firewall}

Sett opp UFW-brannmur for å sikre serveren din:

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

### Trinn 8: Klon arkivet for videresendt e-post {#step-8-clone-forward-email-repository}

Last ned kildekoden for videresending av e-post:

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

### Trinn 9: Konfigurer miljøkonfigurasjon {#step-9-set-up-environment-configuration}

Klargjør miljøkonfigurasjonen:

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

### Trinn 10: Konfigurer domenet ditt {#step-10-configure-your-domain}

Angi domenenavnet ditt og oppdater miljøvariabler:

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

### Trinn 11: Generer SSL-sertifikater {#step-11-generate-ssl-certificates}

#### Alternativ A: Manuell DNS-utfordring (anbefales for de fleste brukere) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Viktig**: Når du blir bedt om det, må du opprette TXT-oppføringer i DNS-en din. Du kan se flere utfordringer for samme domene – **opprett ALLE**. Ikke fjern den første TXT-oppføringen når du legger til den andre.

#### Alternativ B: Cloudflare DNS (Hvis du bruker Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Hvis domenet ditt bruker Cloudflare for DNS, kan du automatisere sertifikatgenerering:

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

#### Kopier sertifikater {#copy-certificates}

Etter at sertifikatet er generert, kopier dem til programkatalogen:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Trinn 12: Generer krypteringsnøkler {#step-12-generate-encryption-keys}

Opprett de forskjellige krypteringsnøklene som kreves for sikker drift:

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

### Trinn 13: Oppdater SSL-baner i konfigurasjonen {#step-13-update-ssl-paths-in-configuration}

Konfigurer SSL-sertifikatbanene i miljøfilen:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Trinn 14: Konfigurer grunnleggende autentisering {#step-14-set-up-basic-authentication}

Opprett midlertidig grunnleggende autentiseringslegitimasjon:

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

### Trinn 15: Implementer med Docker Compose {#step-15-deploy-with-docker-compose}

Start alle tjenestene for videresending av e-post:

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

### Trinn 16: Bekreft installasjon {#step-16-verify-installation}

Sjekk at alle tjenestene kjører som de skal:

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

## Konfigurasjon etter installasjon {#post-installation-configuration}

### Oppsett av DNS-oppføringer {#dns-records-setup}

Du må konfigurere følgende DNS-poster for domenet ditt:

#### MX-oppføring {#mx-record}

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

#### SPF-oppføring {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-oppføring {#dkim-record}

Få din offentlige DKIM-nøkkel:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Opprett DKIM DNS-oppføring:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-oppføring {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Første pålogging {#first-login}

1. Åpne nettleseren din og naviger til `https://yourdomain.com`
2. Skriv inn de grunnleggende autentiseringslegitimasjonene du lagret tidligere
3. Fullfør veiviseren for første oppsett
4. Opprett din første e-postkonto

## Sikkerhetskopieringskonfigurasjon {#backup-configuration}

### Konfigurer S3-kompatibel sikkerhetskopiering {#set-up-s3-compatible-backup}

Konfigurer automatiserte sikkerhetskopier til S3-kompatibel lagring:

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

### Konfigurer sikkerhetskopier av Cron-jobber {#set-up-backup-cron-jobs}

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

## Konfigurasjon for automatisk oppdatering {#auto-update-configuration}

Konfigurer automatiske oppdateringer for installasjonen av videresendt e-post:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Vedlikehold og overvåking {#maintenance-and-monitoring}

### Loggplasseringer {#log-locations}

* **Docker Compose-logger**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Systemlogger**: `/var/log/syslog`
* **Sikkerhetskopieringslogger**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automatisk oppdatering av logger**: `/var/log/autoupdate.log`

### Vanlige vedlikeholdsoppgaver {#regular-maintenance-tasks}

1. **Overvåk diskplass**: `df -h`
2. **Sjekk tjenestestatus**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Gjennomgå logger**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Oppdater systempakker**: `apt update && apt upgrade`
5. **Forny sertifikater**: Sertifikater fornyes automatisk, men overvåker utløpsdatoen

### Sertifikatfornyelse {#certificate-renewal}

Sertifikater skal fornyes automatisk, men du kan fornye dem manuelt om nødvendig:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Feilsøking {#troubleshooting}

### Vanlige problemer {#common-issues}

#### 1. Docker-tjenesten starter ikke {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Sertifikatgenerering mislykkes {#2-certificate-generation-fails}

* Sørg for at port 80 og 443 er tilgjengelige
* Bekreft at DNS-oppføringer peker til serveren din
* Sjekk brannmurinnstillingene

#### 3. Problemer med e-postlevering {#3-email-delivery-issues}

* Bekreft at MX-postene er riktige
* Sjekk SPF-, DKIM- og DMARC-postene
* Sørg for at port 25 ikke er blokkert av hostingleverandøren din

#### 4. Nettgrensesnittet er ikke tilgjengelig {#4-web-interface-not-accessible}

* Sjekk brannmurinnstillingene: `ufw status`
* Bekreft SSL-sertifikater: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Sjekk grunnleggende autentiseringslegitimasjon

### Få hjelp {#getting-help}

* **Dokumentasjon**: <https://forwardemail.net/self-hosted>
* **GitHub-problemer**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Fellesskapsstøtte**: Sjekk prosjektets GitHub-diskusjoner

## Beste praksis for sikkerhet {#security-best-practices}

1. **Hold systemet oppdatert**: Oppdater Ubuntu og pakker regelmessig
2. **Overvåk logger**: Sett opp loggovervåking og varsling
3. **Sikkerhetskopier regelmessig**: Test sikkerhetskopierings- og gjenopprettingsprosedyrer
4. **Bruk sterke passord**: Generer sterke passord for alle kontoer
5. **Aktiver Fail2Ban**: Vurder å installere fail2ban for ekstra sikkerhet
6. **Regelmessige sikkerhetsrevisjoner**: Gjennomgå konfigurasjonen med jevne mellomrom

## Konklusjon {#conclusion}

Din selvhostede installasjon av Videresend e-post skal nå være fullført og kjøre på Ubuntu. Husk å:

1. Konfigurer DNS-oppføringene dine riktig
2. Test sending og mottak av e-post
3. Sett opp regelmessige sikkerhetskopier
4. Overvåk systemet ditt regelmessig
5. Hold installasjonen oppdatert

For ytterligere konfigurasjonsalternativer og avanserte funksjoner, se den offisielle dokumentasjonen for videresending av e-post på <https://forwardemail.net/self-hosted#configuration>.