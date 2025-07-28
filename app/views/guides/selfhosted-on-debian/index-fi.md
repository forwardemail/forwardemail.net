# Sähköpostin edelleenlähetyksen omaishosting-asennusopas Debianille {#forward-email-self-hosting-installation-guide-for-debian}

## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Edellytykset](#prerequisites)
* [Järjestelmävaatimukset](#system-requirements)
* [Vaiheittainen asennus](#step-by-step-installation)
  * [Vaihe 1: Järjestelmän alkuasetukset](#step-1-initial-system-setup)
  * [Vaihe 2: DNS-selvityspalveluiden määrittäminen](#step-2-configure-dns-resolvers)
  * [Vaihe 3: Asenna järjestelmäriippuvuudet](#step-3-install-system-dependencies)
  * [Vaihe 4: Asenna ja määritä Snapd](#step-4-install-and-configure-snapd)
  * [Vaihe 5: Asenna Snap-paketit](#step-5-install-snap-packages)
  * [Vaihe 6: Asenna Docker](#step-6-install-docker)
  * [Vaihe 7: Docker-palvelun määrittäminen](#step-7-configure-docker-service)
  * [Vaihe 8: Asenna ja määritä UFW-palomuuri](#step-8-install-and-configure-ufw-firewall)
  * [Vaihe 9: Kloonaa edelleenlähetyssähköpostien arkisto](#step-9-clone-forward-email-repository)
  * [Vaihe 10: Ympäristön konfiguroinnin määrittäminen](#step-10-set-up-environment-configuration)
  * [Vaihe 11: Määritä verkkotunnuksesi](#step-11-configure-your-domain)
  * [Vaihe 12: Luo SSL-varmenteita](#step-12-generate-ssl-certificates)
  * [Vaihe 13: Luo salausavaimet](#step-13-generate-encryption-keys)
  * [Vaihe 14: Päivitä SSL-polut määrityksissä](#step-14-update-ssl-paths-in-configuration)
  * [Vaihe 15: Perustodennuksen määrittäminen](#step-15-set-up-basic-authentication)
  * [Vaihe 16: Käyttöönotto Docker Composen avulla](#step-16-deploy-with-docker-compose)
  * [Vaihe 17: Asennuksen tarkistaminen](#step-17-verify-installation)
* [Asennuksen jälkeinen määritys](#post-installation-configuration)
  * [DNS-tietueiden asetukset](#dns-records-setup)
  * [Ensimmäinen kirjautuminen](#first-login)
* [Varmuuskopiointiasetukset](#backup-configuration)
  * [S3-yhteensopivan varmuuskopioinnin määrittäminen](#set-up-s3-compatible-backup)
  * [Cron-varmuuskopiointitöiden määrittäminen](#set-up-backup-cron-jobs)
* [Automaattisen päivityksen määritys](#auto-update-configuration)
* [Debian-kohtaisia huomioitavia asioita](#debian-specific-considerations)
  * [Pakettienhallinnan erot](#package-management-differences)
  * [Palvelunhallinta](#service-management)
  * [Verkkoasetukset](#network-configuration)
* [Huolto ja valvonta](#maintenance-and-monitoring)
  * [Lokien sijainnit](#log-locations)
  * [Säännölliset huoltotehtävät](#regular-maintenance-tasks)
  * [Todistuksen uusiminen](#certificate-renewal)
* [Vianmääritys](#troubleshooting)
  * [Debian-kohtaiset ongelmat](#debian-specific-issues)
  * [Yleisiä ongelmia](#common-issues)
  * [Avun saaminen](#getting-help)
* [Tietoturvan parhaat käytännöt](#security-best-practices)
* [Johtopäätös](#conclusion)

## Yleiskatsaus {#overview}

Tämä opas tarjoaa vaiheittaiset ohjeet Forward Emailin itse isännöidyn ratkaisun asentamiseen Debian-järjestelmiin. Tämä opas on räätälöity erityisesti Debian 11:lle (Bullseye) ja Debian 12:lle (Bookworm).

## Edellytykset {#prerequisites}

Ennen asennuksen aloittamista varmista, että sinulla on:

* **Debian-palvelin**: Versio 11 (Bullseye) tai 12 (Bookworm)
* **Pääkäyttäjän oikeudet**: Sinun on voitava suorittaa komentoja pääkäyttäjänä (sudo-oikeudet)
* **Verkkotunnus**: Verkkotunnus, jota hallitset DNS-hallintaoikeuksilla
* **Puhdas palvelin**: Suositellaan käyttämään tuoretta Debian-asennusta
* **Internet-yhteys**: Vaaditaan pakettien ja Docker-kuvien lataamiseen

## Järjestelmävaatimukset {#system-requirements}

* **RAM**: Vähintään 2 Gt (tuotantoympäristössä suositellaan 4 Gt)
* **Tallennustila**: Vähintään 20 Gt käytettävissä olevaa tilaa (tuotantoympäristössä suositellaan yli 50 Gt)
* **Suoritin**: Vähintään 1 virtuaaliprosessori (tuotantoympäristössä suositellaan yli 2 virtuaaliprosessoria)
* **Verkko**: Julkinen IP-osoite, jossa seuraavat portit ovat käytettävissä:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Vaiheittainen asennus {#step-by-step-installation}

### Vaihe 1: Järjestelmän alkuasetukset {#step-1-initial-system-setup}

Varmista ensin, että järjestelmäsi on ajan tasalla ja vaihda pääkäyttäjäksi:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Vaihe 2: Määritä DNS-selvittäjät {#step-2-configure-dns-resolvers}

Määritä järjestelmäsi käyttämään Cloudflaren DNS-palvelimia luotettavaa varmenteiden luontia varten:

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

### Vaihe 3: Asenna järjestelmäriippuvuudet {#step-3-install-system-dependencies}

Asenna Debianin sähköpostin edelleenlähetystä varten tarvittavat paketit:

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

### Vaihe 4: Asenna ja määritä Snapd {#step-4-install-and-configure-snapd}

Debian ei sisällä oletuksena snapd:tä, joten meidän on asennettava ja konfiguroitava se:

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

### Vaihe 5: Asenna Snap-paketit {#step-5-install-snap-packages}

Asenna AWS CLI ja Certbot Snapin kautta:

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

### Vaihe 6: Asenna Docker {#step-6-install-docker}

Asenna Docker CE ja Docker Compose Debianiin:

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

### Vaihe 7: Docker-palvelun {#step-7-configure-docker-service}} määrittäminen

Varmista, että Docker käynnistyy automaattisesti ja on käynnissä:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Jos Docker ei käynnisty, kokeile käynnistää se manuaalisesti:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Vaihe 8: Asenna ja määritä UFW-palomuuri {#step-8-install-and-configure-ufw-firewall}

Debianin minimaaliset asennukset eivät välttämättä sisällä UFW:tä, joten asenna se ensin:

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

### Vaihe 9: Kloonaa edelleenlähetyssähköpostien tietovarasto {#step-9-clone-forward-email-repository}

Lataa sähköpostin edelleenlähetyksen lähdekoodi:

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

### Vaihe 10: Ympäristön konfiguroinnin määrittäminen {#step-10-set-up-environment-configuration}

Valmistele ympäristön kokoonpano:

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

### Vaihe 11: Määritä verkkotunnuksesi {#step-11-configure-your-domain}

Aseta verkkotunnuksesi nimi ja päivitä ympäristömuuttujat:

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

### Vaihe 12: Luo SSL-varmenteet {#step-12-generate-ssl-certificates}

#### Vaihtoehto A: Manuaalinen DNS-haaste (suositellaan useimmille käyttäjille) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Tärkeää**: Kun sinua pyydetään tekemään niin, sinun on luotava TXT-tietueet DNS-palvelimellesi. Saatat nähdä useita haasteita samalle verkkotunnukselle – **luo ne KAIKKI**. Älä poista ensimmäistä TXT-tietuetta, kun lisäät toisen.

#### Vaihtoehto B: Cloudflare DNS (jos käytät Cloudflarea) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jos verkkotunnuksesi käyttää Cloudflarea DNS:ään, voit automatisoida varmenteiden luomisen:

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

#### Kopioi varmenteet {#copy-certificates}

Varmenteiden luomisen jälkeen kopioi ne sovellushakemistoon:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Vaihe 13: Luo salausavaimet {#step-13-generate-encryption-keys}

Luo turvallisen toiminnan edellyttämät erilaiset salausavaimet:

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

### Vaihe 14: Päivitä SSL-polut määrityksissä {#step-14-update-ssl-paths-in-configuration}

Määritä SSL-varmennepolut ympäristötiedostossa:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Vaihe 15: Määritä perustunnistus {#step-15-set-up-basic-authentication}

Luo väliaikaiset perustunnistustiedot:

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

### Vaihe 16: Käyttöönotto Docker Composen avulla {#step-16-deploy-with-docker-compose}

Käynnistä kaikki sähköpostin edelleenlähetyspalvelut:

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

### Vaihe 17: Asennuksen tarkistaminen {#step-17-verify-installation}

Tarkista, että kaikki palvelut toimivat oikein:

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

## Asennuksen jälkeinen määritys {#post-installation-configuration}

### DNS-tietueiden määritys {#dns-records-setup}

Sinun on määritettävä seuraavat DNS-tietueet verkkotunnuksellesi:

#### MX-tietue {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-tietueet {#a-records}

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

#### SPF-tietue {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-tietue {#dkim-record}

Hanki DKIM-julkinen avaimesi:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Luo DKIM DNS -tietue:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-tietue {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Ensimmäinen kirjautuminen {#first-login}

1. Avaa verkkoselaimesi ja siirry osoitteeseen `https://yourdomain.com`
2. Syötä aiemmin tallentamasi perustunnistustiedot
3. Suorita alkuasennustoiminto loppuun
4. Luo ensimmäinen sähköpostitilisi

## Varmuuskopiointiasetukset {#backup-configuration}

### Määritä S3-yhteensopiva varmuuskopiointi {#set-up-s3-compatible-backup}

Määritä automaattiset varmuuskopiot S3-yhteensopivaan tallennustilaan:

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

### Varmuuskopiointi Cron-töiden määrittäminen {#set-up-backup-cron-jobs}

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

## Automaattisen päivityksen määritys {#auto-update-configuration}

Määritä automaattiset päivitykset sähköpostin edelleenlähetysasennuksellesi:

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

## Debian-kohtaisia huomioita {#debian-specific-considerations}

### Paketinhallinnan erot {#package-management-differences}

* **Snapd**: Ei asenneta oletuksena Debianiin, vaatii manuaalisen asennuksen
* **Docker**: Käyttää Debian-kohtaisia repositorioita ja GPG-avaimia
* **UFW**: Ei välttämättä sisälly Debianin minimaalisiin asennuksiin
* **systemd**: Toiminta voi poiketa hieman Ubuntusta

### Palvelunhallinta {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Verkkoasetukset {#network-configuration}

Debianilla voi olla erilaisia verkkorajapintojen nimiä tai kokoonpanoja:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Ylläpito ja valvonta {#maintenance-and-monitoring}

### Lokisijainnit {#log-locations}

* **Docker Compose -lokit**: Käytä asennuksen perusteella asianmukaista Docker Compose -komentoa
* **Järjestelmälokit**: `/var/log/syslog`
* **Varmuuskopiolokit**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automaattisen päivityksen lokit**: `/var/log/autoupdate.log`
* **Lisätyt lokit**: `journalctl -u snapd`

### Säännölliset ylläpitotehtävät {#regular-maintenance-tasks}

1. **Levytilan valvonta**: `df -h`
2. **Palvelun tilan tarkistus**: Käytä asianmukaista Dockerin compose-komentoa
3. **Lokien tarkastelu**: Tarkista sekä sovellus- että järjestelmälokit
4. **Järjestelmäpakettien päivitys**: `apt update && apt upgrade`
5. **Snapd-tiedoston valvonta**: `snap list` ja `snap refresh`

### Varmenteen uusiminen {#certificate-renewal}

Sertifikaattien pitäisi uusiutua automaattisesti, mutta voit uusia ne tarvittaessa manuaalisesti:

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

## Vianmääritys {#troubleshooting}

### Debian-kohtaiset ongelmat {#debian-specific-issues}

#### 1. Snapd ei toimi {#1-snapd-not-working}

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

#### 2. Dockerin kirjoituskomentoa ei löytynyt {#2-docker-compose-command-not-found}

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

#### 3. Paketin asennusongelmat {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Yleisiä ongelmia {#common-issues}

#### 1. Docker-palvelu ei käynnisty {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Varmenteen luonti epäonnistuu {#2-certificate-generation-fails}

* Varmista, että portit 80 ja 443 ovat käytettävissä
* Varmista, että DNS-tietueet osoittavat palvelimellesi
* Tarkista palomuurin asetukset `ufw status`-komennolla

#### 3. Sähköpostin toimitusongelmat {#3-email-delivery-issues}

* Varmista, että MX-tietueet ovat oikein.* Tarkista SPF-, DKIM- ja DMARC-tietueet.* Varmista, ettei hosting-palveluntarjoajasi ole estänyt porttia 25.

### Avun saaminen {#getting-help}

* **Dokumentaatio**: <https://forwardemail.net/self-hosted>
* **GitHub-ongelmat**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debianin dokumentaatio**: <https://www.debian.org/doc/>

## Tietoturvan parhaat käytännöt {#security-best-practices}

1. **Pidä järjestelmä ajan tasalla**: Päivitä Debian ja paketit säännöllisesti
2. **Valvo lokeja**: Määritä lokien valvonta ja hälytykset
3. **Varmuuskopioi säännöllisesti**: Testaa varmuuskopiointi- ja palautusmenettelyjä
4. **Käytä vahvoja salasanoja**: Luo vahvat salasanat kaikille tileille
5. **Ota käyttöön Fail2Ban**: Harkitse Fail2Banin asentamista lisäturvallisuuden takaamiseksi
6. **Säännölliset tietoturvatarkastukset**: Tarkista kokoonpanosi säännöllisesti
7. **Valvo Snapdiä**: Pidä Snap-paketit ajan tasalla `snap refresh`:lla

## Johtopäätös {#conclusion}

Sähköpostinvälityspalvelun asennuksen pitäisi nyt olla valmis ja käynnissä Debianissa. Muista:

1. Määritä DNS-tietueesi oikein
2. Testaa sähköpostin lähettäminen ja vastaanottaminen
3. Ota käyttöön säännölliset varmuuskopiot
4. Valvo järjestelmääsi säännöllisesti
5. Pidä asennuksesi ajan tasalla
6. Valvo snapd- ja snap-paketteja

Tärkeimmät erot Ubuntuun verrattuna ovat snapd-asennus ja Docker-arkiston konfigurointi. Kun nämä on määritetty oikein, Forward Email -sovellus toimii samalla tavalla molemmissa järjestelmissä.

Lisätietoja määritysvaihtoehdoista ja edistyneistä ominaisuuksista on virallisessa sähköpostin edelleenlähetysdokumentaatiossa osoitteessa <https://forwardemail.net/self-hosted#configuration>.