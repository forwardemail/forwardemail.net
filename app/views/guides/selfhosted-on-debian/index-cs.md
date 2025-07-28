# Průvodce instalací samoobslužného hostingu pro přesměrování e-mailů v Debianu {#forward-email-self-hosting-installation-guide-for-debian}

__CHRÁNĚNÁ_URL_49__ Obsah {__CHRÁNĚNÁ_URL_50__

* [Přehled](#overview)
* [Předpoklady](#prerequisites)
* [Systémové požadavky](#system-requirements)
* [Instalace krok za krokem](#step-by-step-installation)
  * [Krok 1: Počáteční nastavení systému](#step-1-initial-system-setup)
  * [Krok 2: Konfigurace DNS resolverů](#step-2-configure-dns-resolvers)
  * [Krok 3: Instalace systémových závislostí](#step-3-install-system-dependencies)
  * [Krok 4: Instalace a konfigurace Snapdu](#step-4-install-and-configure-snapd)
  * [Krok 5: Instalace balíčků Snap](#step-5-install-snap-packages)
  * [Krok 6: Instalace Dockeru](#step-6-install-docker)
  * [Krok 7: Konfigurace služby Docker](#step-7-configure-docker-service)
  * [Krok 8: Instalace a konfigurace firewallu UFW](#step-8-install-and-configure-ufw-firewall)
  * [Krok 9: Klonování úložiště e-mailů pro přeposílání](#step-9-clone-forward-email-repository)
  * [Krok 10: Nastavení konfigurace prostředí](#step-10-set-up-environment-configuration)
  * [Krok 11: Konfigurace domény](#step-11-configure-your-domain)
  * [Krok 12: Generování SSL certifikátů](#step-12-generate-ssl-certificates)
  * [Krok 13: Generování šifrovacích klíčů](#step-13-generate-encryption-keys)
  * [Krok 14: Aktualizace cest SSL v konfiguraci](#step-14-update-ssl-paths-in-configuration)
  * [Krok 15: Nastavení základního ověřování](#step-15-set-up-basic-authentication)
  * [Krok 16: Nasazení pomocí Docker Compose](#step-16-deploy-with-docker-compose)
  * [Krok 17: Ověření instalace](#step-17-verify-installation)
* [Konfigurace po instalaci](#post-installation-configuration)
  * [Nastavení DNS záznamů](#dns-records-setup)
  * [První přihlášení](#first-login)
* [Konfigurace zálohy](#backup-configuration)
  * [Nastavení zálohování kompatibilního s S3](#set-up-s3-compatible-backup)
  * [Nastavení zálohování úloh Cron](#set-up-backup-cron-jobs)
* [Konfigurace automatické aktualizace](#auto-update-configuration)
* [Specifické aspekty Debianu](#debian-specific-considerations)
  * [Rozdíly ve správě balíčků](#package-management-differences)
  * [Správa služeb](#service-management)
  * [Konfigurace sítě](#network-configuration)
* [Údržba a monitorování](#maintenance-and-monitoring)
  * [Umístění protokolů](#log-locations)
  * [Pravidelné údržbářské práce](#regular-maintenance-tasks)
  * [Obnovení certifikátu](#certificate-renewal)
* [Odstraňování problémů](#troubleshooting)
  * [Problémy specifické pro Debian](#debian-specific-issues)
  * [Běžné problémy](#common-issues)
  * [Získání pomoci](#getting-help)
* [Nejlepší bezpečnostní postupy](#security-best-practices)
* [Závěr](#conclusion)

__CHRÁNĚNÁ_URL_51__ Přehled {__CHRÁNĚNÁ_URL_52__

Tato příručka poskytuje podrobné pokyny k instalaci samoobslužného řešení Forward Email na systémech Debian. Tato příručka je speciálně uzpůsobena pro Debian 11 (Bullseye) a Debian 12 (Bookworm).

## Předpoklady {#prerequisites}

Před zahájením instalace se ujistěte, že máte:

* **Debian Server**: Verze 11 (Bullseye) nebo 12 (Bookworm)
* **Přístup root**: Musíte být schopni spouštět příkazy jako root (přístup sudo)
* **Název domény**: Doména, kterou spravujete s přístupem pro správu DNS
* **Clean Server**: Doporučuje se použít novou instalaci Debianu
* **Připojení k internetu**: Vyžadováno pro stahování balíčků a obrazů Dockeru

## Systémové požadavky {#system-requirements}

* **RAM**: Minimálně 2 GB (pro produkční prostředí doporučeno 4 GB)
* **Úložiště**: Minimálně 20 GB dostupného místa (pro produkční prostředí doporučeno 50 GB+)
* **CPU**: Minimálně 1 vCPU (pro produkční prostředí doporučeno 2+ vCPU)
* **Síť**: Veřejná IP adresa s následujícími dostupnými porty:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Podrobná instalace {#step-by-step-installation}

### Krok 1: Počáteční nastavení systému {#step-1-initial-system-setup}

Nejprve se ujistěte, že máte aktuální systém, a přepněte se na uživatele root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Krok 2: Konfigurace DNS resolverů {#step-2-configure-dns-resolvers}

Nakonfigurujte svůj systém tak, aby pro spolehlivé generování certifikátů používal DNS servery Cloudflare:

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

### Krok 3: Instalace systémových závislostí {#step-3-install-system-dependencies}

Nainstalujte požadované balíčky pro přeposílání e-mailů na Debianu:

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

### Krok 4: Instalace a konfigurace Snapd {#step-4-install-and-configure-snapd}

Debian ve výchozím nastavení neobsahuje snapd, takže ho musíme nainstalovat a nakonfigurovat:

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

### Krok 5: Instalace balíčků Snap {#step-5-install-snap-packages}

Nainstalujte AWS CLI a Certbot pomocí modulu snap:

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

### Krok 6: Instalace Dockeru {#step-6-install-docker}

Nainstalujte Docker CE a Docker Compose na Debian:

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

### Krok 7: Konfigurace služby Docker {#step-7-configure-docker-service}

Ujistěte se, že se Docker automaticky spustí a běží:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Pokud se Docker nespustí, zkuste ho spustit ručně:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Krok 8: Instalace a konfigurace firewallu UFW {#step-8-install-and-configure-ufw-firewall}

Minimální instalace Debianu nemusí obsahovat UFW, proto jej nejprve nainstalujte:

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

### Krok 9: Klonování úložiště e-mailů pro přeposílání {#step-9-clone-forward-email-repository}

Stáhněte si zdrojový kód pro přeposílání e-mailů:

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

### Krok 10: Nastavení konfigurace prostředí {#step-10-set-up-environment-configuration}

Připravte konfiguraci prostředí:

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

### Krok 11: Konfigurace domény {#step-11-configure-your-domain}

Nastavte název domény a aktualizujte proměnné prostředí:

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

### Krok 12: Generování SSL certifikátů {#step-12-generate-ssl-certificates}

#### Možnost A: Ruční výzva DNS (doporučeno pro většinu uživatelů) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Důležité**: Po zobrazení výzvy budete muset ve svém DNS vytvořit záznamy TXT. Pro stejnou doménu se může zobrazit více výzev – **vytvořte VŠECHNY**. Při přidávání druhého záznamu TXT první záznam neodstraňujte.

#### Možnost B: Cloudflare DNS (pokud používáte Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Pokud vaše doména používá pro DNS Cloudflare, můžete generování certifikátů automatizovat:

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

#### Kopírovat certifikáty {#copy-certificates}

Po vygenerování certifikátů je zkopírujte do adresáře aplikace:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Krok 13: Generování šifrovacích klíčů {#step-13-generate-encryption-keys}

Vytvořte různé šifrovací klíče potřebné pro bezpečný provoz:

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

### Krok 14: Aktualizace cest SSL v konfiguraci {#step-14-update-ssl-paths-in-configuration}

Nakonfigurujte cesty k certifikátům SSL v souboru prostředí:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Krok 15: Nastavení základního ověřování {#step-15-set-up-basic-authentication}

Vytvořte dočasné základní ověřovací přihlašovací údaje:

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

### Krok 16: Nasazení pomocí Docker Compose {#step-16-deploy-with-docker-compose}

Spusťte všechny služby přeposílání e-mailů:

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

### Krok 17: Ověření instalace {#step-17-verify-installation}

Zkontrolujte, zda všechny služby běží správně:

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

## Konfigurace po instalaci {#post-installation-configuration}

Nastavení DNS záznamů ### {#dns-records-setup}

Pro vaši doménu je potřeba nakonfigurovat následující DNS záznamy:

Záznam MX #### {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

__CHRÁNĚNÁ_URL_105__ Záznamy {__CHRÁNĚNÁ_URL_106__

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

__CHRÁNĚNÁ_URL_107__ Záznam SPF {__CHRÁNĚNÁ_URL_108__

```
@ TXT "v=spf1 mx ~all"
```

__CHRÁNĚNÁ_URL_109__ Záznam DKIM {__CHRÁNĚNÁ_URL_110__

Získejte svůj veřejný klíč DKIM:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Vytvořit DNS záznam DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Záznam DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### První přihlášení {#first-login}

1. Otevřete webový prohlížeč a přejděte na adresu `https://yourdomain.com`
2. Zadejte základní ověřovací údaje, které jste si dříve uložili
3. Dokončete průvodce počátečním nastavením
4. Vytvořte si svůj první e-mailový účet

## Konfigurace zálohy {#backup-configuration}

### Nastavení zálohy kompatibilní s S3 {#set-up-s3-compatible-backup}

Konfigurace automatických záloh do úložiště kompatibilního s S3:

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

### Nastavení zálohování úloh Cron {#set-up-backup-cron-jobs}

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

## Konfigurace automatických aktualizací {#auto-update-configuration}

Nastavte automatické aktualizace pro instalaci služby Forward Email:

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

## Specifické aspekty Debianu {#debian-specific-considerations}

### Rozdíly ve správě balíčků {#package-management-differences}

* **Snapd**: Není ve výchozím nastavení nainstalován v Debianu, vyžaduje ruční instalaci.
* **Docker**: Používá repozitáře a GPG klíče specifické pro Debian.
* **UFW**: Nemusí být součástí minimálních instalací Debianu.
* **systemd**: Chování se může mírně lišit od Ubuntu.

### Správa služeb {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Konfigurace sítě {#network-configuration}

Debian může mít různé názvy nebo konfigurace síťových rozhraní:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Údržba a monitorování {#maintenance-and-monitoring}

### Umístění protokolů {#log-locations}

* **Protokoly Docker Compose**: Použijte příslušný příkaz Docker Compose na základě instalace
* **Systémové protokoly**: `/var/log/syslog`
* **Protokoly záloh**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Protokoly automatické aktualizace**: `/var/log/autoupdate.log`
* **Protokoly Snapd**: `journalctl -u snapd`

### Pravidelná údržba {#regular-maintenance-tasks}

1. **Monitorování místa na disku**: `df -h`
2. **Zkontrolovat stav služby**: Použít příslušný příkaz docker compose
3. **Zkontrolovat protokoly**: Zkontrolovat protokoly aplikace i systému
4. **Aktualizovat systémové balíčky**: `apt update && apt upgrade`
5. **Monitorování snapd**: `snap list` a `snap refresh`

### Obnovení certifikátu {#certificate-renewal}

Certifikáty by se měly obnovovat automaticky, ale v případě potřeby je můžete obnovit ručně:

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

## Řešení problémů {#troubleshooting}

### Problémy specifické pro Debian {#debian-specific-issues}

__CHRÁNĚNÁ_URL_143__ 1. Snapd nefunguje {__CHRÁNĚNÁ_URL_144__

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

#### 2. Příkaz Docker Compose nenalezen {#2-docker-compose-command-not-found}

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

#### 3. Problémy s instalací balíčků {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Časté problémy {#common-issues}

#### 1. Služba Docker se nespustí {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Generování certifikátu selhalo {#2-certificate-generation-fails}

* Zajistěte, aby porty 80 a 443 byly přístupné
* Ověřte, zda záznamy DNS odkazují na váš server
* Zkontrolujte nastavení firewallu pomocí `ufw status`

#### 3. Problémy s doručováním e-mailů {#3-email-delivery-issues}

* Ověřte správnost záznamů MX
* Zkontrolujte záznamy SPF, DKIM a DMARC
* Ujistěte se, že port 25 není blokován vaším poskytovatelem hostingu

### Získání pomoci {#getting-help}

* **Dokumentace**: <https://forwardemail.net/self-hosted>
* **Problémy s GitHubem**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Dokumentace k Debianu**: <https://www.debian.org/doc/>

## Nejlepší bezpečnostní postupy {#security-best-practices}

1. **Udržujte systém aktuální**: Pravidelně aktualizujte Debian a balíčky
2. **Monitorujte protokoly**: Nastavte monitorování protokolů a upozornění
3. **Pravidelně zálohujte**: Testujte postupy zálohování a obnovy
4. **Používejte silná hesla**: Generujte silná hesla pro všechny účty
5. **Povolte Fail2Ban**: Zvažte instalaci fail2ban pro zvýšení zabezpečení
6. **Pravidelné bezpečnostní audity**: Pravidelně kontrolujte konfiguraci
7. **Monitorujte Snapd**: Udržujte balíčky snap aktuální pomocí `snap refresh`

## Závěr {#conclusion}

Vaše vlastní instalace služby Forward Email by nyní měla být dokončena a běžet na Debianu. Nezapomeňte:

1. Správně nakonfigurujte záznamy DNS
2. Otestujte odesílání a příjem e-mailů
3. Nastavte pravidelné zálohy
4. Pravidelně monitorujte svůj systém
5. Udržujte instalaci aktualizovanou
6. Monitorujte balíčky Snapd a Snap

Hlavní rozdíly oproti Ubuntu spočívají v instalaci nástroje Snapd a konfiguraci repozitáře Docker. Jakmile jsou tyto funkce správně nastaveny, aplikace Forward Email se na obou systémech chová identicky.

Další možnosti konfigurace a pokročilé funkce naleznete v oficiální dokumentaci k Forward Email na adrese <https://forwardemail.net/self-hosted#configuration>.