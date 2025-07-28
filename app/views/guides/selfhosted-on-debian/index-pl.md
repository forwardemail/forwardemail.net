# Przewodnik instalacji samodzielnego hostingu poczty e-mail dla systemu Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Wymagania wstępne](#prerequisites)
* [Wymagania systemowe](#system-requirements)
* [Instalacja krok po kroku](#step-by-step-installation)
  * [Krok 1: Początkowa konfiguracja systemu](#step-1-initial-system-setup)
  * [Krok 2: Skonfiguruj resolvery DNS](#step-2-configure-dns-resolvers)
  * [Krok 3: Zainstaluj zależności systemowe](#step-3-install-system-dependencies)
  * [Krok 4: Zainstaluj i skonfiguruj Snapd](#step-4-install-and-configure-snapd)
  * [Krok 5: Zainstaluj pakiety Snap](#step-5-install-snap-packages)
  * [Krok 6: Zainstaluj Dockera](#step-6-install-docker)
  * [Krok 7: Skonfiguruj usługę Docker](#step-7-configure-docker-service)
  * [Krok 8: Zainstaluj i skonfiguruj zaporę UFW](#step-8-install-and-configure-ufw-firewall)
  * [Krok 9: Klonuj repozytorium wiadomości e-mail](#step-9-clone-forward-email-repository)
  * [Krok 10: Skonfiguruj środowisko](#step-10-set-up-environment-configuration)
  * [Krok 11: Skonfiguruj swoją domenę](#step-11-configure-your-domain)
  * [Krok 12: Wygeneruj certyfikaty SSL](#step-12-generate-ssl-certificates)
  * [Krok 13: Wygeneruj klucze szyfrujące](#step-13-generate-encryption-keys)
  * [Krok 14: Zaktualizuj ścieżki SSL w konfiguracji](#step-14-update-ssl-paths-in-configuration)
  * [Krok 15: Skonfiguruj uwierzytelnianie podstawowe](#step-15-set-up-basic-authentication)
  * [Krok 16: Wdrażanie za pomocą Docker Compose](#step-16-deploy-with-docker-compose)
  * [Krok 17: Zweryfikuj instalację](#step-17-verify-installation)
* [Konfiguracja po instalacji](#post-installation-configuration)
  * [Konfiguracja rekordów DNS](#dns-records-setup)
  * [Pierwsze logowanie](#first-login)
* [Konfiguracja kopii zapasowej](#backup-configuration)
  * [Skonfiguruj kopię zapasową zgodną z S3](#set-up-s3-compatible-backup)
  * [Skonfiguruj zadania Cron kopii zapasowej](#set-up-backup-cron-jobs)
* [Konfiguracja automatycznej aktualizacji](#auto-update-configuration)
* [Zagadnienia specyficzne dla Debiana](#debian-specific-considerations)
  * [Różnice w zarządzaniu pakietami](#package-management-differences)
  * [Zarządzanie usługami](#service-management)
  * [Konfiguracja sieci](#network-configuration)
* [Konserwacja i monitorowanie](#maintenance-and-monitoring)
  * [Lokalizacje dzienników](#log-locations)
  * [Regularne zadania konserwacyjne](#regular-maintenance-tasks)
  * [Odnowienie certyfikatu](#certificate-renewal)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Problemy specyficzne dla Debiana](#debian-specific-issues)
  * [Typowe problemy](#common-issues)
  * [Uzyskiwanie pomocy](#getting-help)
* [Najlepsze praktyki bezpieczeństwa](#security-best-practices)
* [Wniosek](#conclusion)

## Przegląd {#overview}

Ten przewodnik zawiera instrukcje krok po kroku dotyczące instalacji rozwiązania Forward Email z własnym hostingiem w systemach Debian. Przewodnik jest specjalnie dostosowany do dystrybucji Debian 11 (Bullseye) i Debian 12 (Bookworm).

## Wymagania wstępne {#prerequisites}

Przed rozpoczęciem instalacji upewnij się, że masz:

* **Serwer Debian**: Wersja 11 (Bullseye) lub 12 (Bookworm)
* **Dostęp root**: Musisz mieć możliwość uruchamiania poleceń jako root (dostęp sudo)
* **Nazwa domeny**: Domena, którą kontrolujesz i posiadasz dostęp do zarządzania DNS
* **Czysty serwer**: Zalecane jest użycie nowej instalacji Debiana
* **Połączenie internetowe**: Wymagane do pobierania pakietów i obrazów Dockera

## Wymagania systemowe {#system-requirements}

* **RAM**: Minimum 2 GB (zalecane 4 GB do zastosowań produkcyjnych)
* **Pamięć masowa**: Minimum 20 GB dostępnej przestrzeni (zalecane 50 GB+ do zastosowań produkcyjnych)
* **CPU**: Minimum 1 wirtualny procesor (zalecane 2 lub więcej wirtualnych procesorów do zastosowań produkcyjnych)
* **Sieć**: Publiczny adres IP z następującymi dostępnymi portami:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Instalacja krok po kroku {#step-by-step-installation}

### Krok 1: Początkowa konfiguracja systemu {#step-1-initial-system-setup}

Najpierw upewnij się, że system jest aktualny i przełącz się na użytkownika root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Krok 2: Konfigurowanie resolverów DNS {#step-2-configure-dns-resolvers}

Skonfiguruj swój system tak, aby korzystał z serwerów DNS Cloudflare w celu niezawodnego generowania certyfikatów:

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

### Krok 3: Zainstaluj zależności systemowe {#step-3-install-system-dependencies}

Zainstaluj wymagane pakiety dla funkcji Forward Email w systemie Debian:

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

### Krok 4: Zainstaluj i skonfiguruj Snapd {#step-4-install-and-configure-snapd}

Debian domyślnie nie zawiera snapd, dlatego musimy go zainstalować i skonfigurować:

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

### Krok 5: Zainstaluj pakiety Snap {#step-5-install-snap-packages}

Zainstaluj AWS CLI i Certbot za pomocą Snap:

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

### Krok 6: Zainstaluj Docker {#step-6-install-docker}

Zainstaluj Docker CE i Docker Compose w systemie Debian:

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

### Krok 7: Skonfiguruj usługę Docker {#step-7-configure-docker-service}

Upewnij się, że Docker uruchamia się automatycznie i jest uruchomiony:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Jeśli nie uda się uruchomić Dockera, spróbuj uruchomić go ręcznie:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Krok 8: Zainstaluj i skonfiguruj zaporę UFW {#step-8-install-and-configure-ufw-firewall}

Minimalne instalacje Debiana mogą nie zawierać UFW, dlatego należy je najpierw zainstalować:

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

### Krok 9: Klonuj repozytorium wiadomości e-mail {#step-9-clone-forward-email-repository}

Pobierz kod źródłowy Forward Email:

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

### Krok 10: Skonfiguruj konfigurację środowiska {#step-10-set-up-environment-configuration}

Przygotuj konfigurację środowiska:

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

### Krok 11: Skonfiguruj swoją domenę {#step-11-configure-your-domain}

Ustaw nazwę swojej domeny i zaktualizuj zmienne środowiskowe:

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

### Krok 12: Wygeneruj certyfikaty SSL {#step-12-generate-ssl-certificates}

#### Opcja A: Ręczne wyzwanie DNS (zalecane dla większości użytkowników) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Ważne**: Gdy pojawi się monit, musisz utworzyć rekordy TXT w swoim systemie DNS. Możesz zobaczyć wiele wyzwań dla tej samej domeny – **utwórz WSZYSTKIE**. Nie usuwaj pierwszego rekordu TXT podczas dodawania drugiego.

#### Opcja B: Cloudflare DNS (jeśli używasz Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jeśli Twoja domena korzysta z Cloudflare do obsługi DNS, możesz zautomatyzować generowanie certyfikatów:

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

#### Kopiuj certyfikaty {#copy-certificates}

Po wygenerowaniu certyfikatu skopiuj go do katalogu aplikacji:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Krok 13: Wygeneruj klucze szyfrujące {#step-13-generate-encryption-keys}

Utwórz różne klucze szyfrujące wymagane do bezpiecznej operacji:

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

### Krok 14: Zaktualizuj ścieżki SSL w konfiguracji {#step-14-update-ssl-paths-in-configuration}

Skonfiguruj ścieżki certyfikatów SSL w pliku środowiskowym:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Krok 15: Skonfiguruj uwierzytelnianie podstawowe {#step-15-set-up-basic-authentication}

Utwórz tymczasowe podstawowe dane uwierzytelniające:

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

### Krok 16: Wdrażanie za pomocą Docker Compose {#step-16-deploy-with-docker-compose}

Uruchom wszystkie usługi przekazywania poczty elektronicznej:

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

### Krok 17: Zweryfikuj instalację {#step-17-verify-installation}

Sprawdź, czy wszystkie usługi działają prawidłowo:

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

## Konfiguracja po instalacji {#post-installation-configuration}

### Konfiguracja rekordów DNS {#dns-records-setup}

Musisz skonfigurować następujące rekordy DNS dla swojej domeny:

#### Rekord MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A Rekordy {#a-records}

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

#### Rekord SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Rekord DKIM {#dkim-record}

Uzyskaj swój klucz publiczny DKIM:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Utwórz rekord DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Rekord DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Pierwsze logowanie {#first-login}

1. Otwórz przeglądarkę internetową i przejdź do `https://yourdomain.com`
2. Wprowadź zapisane wcześniej podstawowe dane uwierzytelniające
3. Zakończ działanie kreatora konfiguracji początkowej
4. Utwórz swoje pierwsze konto e-mail

## Konfiguracja kopii zapasowej {#backup-configuration}

### Skonfiguruj kopię zapasową zgodną z S3 {#set-up-s3-compatible-backup}

Skonfiguruj automatyczne kopie zapasowe w pamięci masowej zgodnej z S3:

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

### Skonfiguruj zadania kopii zapasowej Cron {#set-up-backup-cron-jobs}

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

## Konfiguracja automatycznej aktualizacji {#auto-update-configuration}

Skonfiguruj automatyczne aktualizacje instalacji usługi Forward Email:

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

## Zagadnienia specyficzne dla Debiana {#debian-specific-considerations}

### Różnice w zarządzaniu pakietami {#package-management-differences}

* **Snapd**: Nie jest domyślnie instalowany w Debianie, wymaga ręcznej instalacji.
* **Docker**: Używa repozytoriów specyficznych dla Debiana i kluczy GPG.
* **UFW**: Może nie być uwzględniany w minimalnych instalacjach Debiana.
* **systemd**: Zachowanie może nieznacznie różnić się od Ubuntu.

### Zarządzanie usługami {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Konfiguracja sieci {#network-configuration}

Debian może mieć różne nazwy interfejsów sieciowych lub konfiguracje:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Konserwacja i monitorowanie {#maintenance-and-monitoring}

### Lokalizacje dzienników {#log-locations}

* **Logi Docker Compose**: Użyj odpowiedniego polecenia Docker Compose w zależności od instalacji.
* **Logi systemowe**: `/var/log/syslog`
* **Logi kopii zapasowych**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logi automatycznej aktualizacji**: `/var/log/autoupdate.log`
* **Logi Snapd**: `journalctl -u snapd`

### Regularne zadania konserwacyjne {#regular-maintenance-tasks}

1. **Monitoruj miejsce na dysku**: `df -h`
2. **Sprawdź stan usługi**: Użyj odpowiedniego polecenia docker compose
3. **Przejrzyj logi**: Sprawdź logi aplikacji i systemu
4. **Aktualizuj pakiety systemowe**: `apt update && apt upgrade`
5. **Monitoruj snapd**: `snap list` i `snap refresh`

### Odnowienie certyfikatu {#certificate-renewal}

Certyfikaty powinny odnawiać się automatycznie, ale w razie potrzeby możesz dokonać odnowienia ręcznego:

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

## Rozwiązywanie problemów {#troubleshooting}

### Problemy specyficzne dla Debiana {#debian-specific-issues}

#### 1. Snapd nie działa {#1-snapd-not-working}

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

#### 2. Polecenie Docker Compose nie zostało znalezione {#2-docker-compose-command-not-found}

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

#### 3. Problemy z instalacją pakietów {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Typowe problemy {#common-issues}

#### 1. Usługa Docker nie uruchamia się {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Generowanie certyfikatu nie powiodło się {#2-certificate-generation-fails}

* Upewnij się, że porty 80 i 443 są dostępne
* Sprawdź, czy rekordy DNS wskazują na Twój serwer
* Sprawdź ustawienia zapory sieciowej za pomocą `ufw status`

#### 3. Problemy z dostarczaniem wiadomości e-mail {#3-email-delivery-issues}

* Sprawdź poprawność rekordów MX
* Sprawdź rekordy SPF, DKIM i DMARC
* Upewnij się, że port 25 nie jest blokowany przez Twojego dostawcę hostingu

### Uzyskiwanie pomocy {#getting-help}

* **Dokumentacja**: <https://forwardemail.net/self-hosted>
* **Problemy z GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Dokumentacja Debiana**: <https://www.debian.org/doc/>

## Najlepsze praktyki bezpieczeństwa {#security-best-practices}

1. **Aktualizuj system**: Regularnie aktualizuj Debiana i pakiety
2. **Monitoruj logi**: Skonfiguruj monitorowanie logów i alerty
3. **Regularnie twórz kopie zapasowe**: Testuj procedury tworzenia kopii zapasowych i przywracania
4. **Używaj silnych haseł**: Generuj silne hasła dla wszystkich kont
5. **Włącz Fail2Ban**: Rozważ zainstalowanie fail2ban dla dodatkowego bezpieczeństwa
6. **Regularne audyty bezpieczeństwa**: Okresowo sprawdzaj konfigurację
7. **Monitoruj Snapd**: Aktualizuj pakiety snap za pomocą `snap refresh`

## Wniosek {#conclusion}

Instalacja Forward Email na własnym hostingu powinna być teraz ukończona i działać w systemie Debian. Pamiętaj, aby:

1. Skonfiguruj poprawnie swoje rekordy DNS
2. Przetestuj wysyłanie i odbieranie wiadomości e-mail
3. Skonfiguruj regularne kopie zapasowe
4. Regularnie monitoruj swój system
5. Aktualizuj instalację
6. Monitoruj snapd i pakiety snap

Główne różnice w stosunku do Ubuntu to instalacja Snapd i konfiguracja repozytorium Docker. Po ich poprawnym skonfigurowaniu aplikacja Forward Email zachowuje się identycznie w obu systemach.

Aby uzyskać dodatkowe opcje konfiguracji i zaawansowane funkcje, zapoznaj się z oficjalną dokumentacją usługi Forward Email pod adresem <https://forwardemail.net/self-hosted#configuration>.