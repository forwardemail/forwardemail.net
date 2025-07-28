# Przewodnik instalacji samodzielnego hostingu poczty e-mail dla Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Wymagania wstępne](#prerequisites)
* [Wymagania systemowe](#system-requirements)
* [Instalacja krok po kroku](#step-by-step-installation)
  * [Krok 1: Początkowa konfiguracja systemu](#step-1-initial-system-setup)
  * [Krok 2: Skonfiguruj resolvery DNS](#step-2-configure-dns-resolvers)
  * [Krok 3: Zainstaluj zależności systemowe](#step-3-install-system-dependencies)
  * [Krok 4: Zainstaluj pakiety Snap](#step-4-install-snap-packages)
  * [Krok 5: Zainstaluj Dockera](#step-5-install-docker)
  * [Krok 6: Konfigurowanie usługi Docker](#step-6-configure-docker-service)
  * [Krok 7: Skonfiguruj zaporę sieciową](#step-7-configure-firewall)
  * [Krok 8: Klonuj repozytorium wiadomości e-mail](#step-8-clone-forward-email-repository)
  * [Krok 9: Skonfiguruj środowisko](#step-9-set-up-environment-configuration)
  * [Krok 10: Skonfiguruj swoją domenę](#step-10-configure-your-domain)
  * [Krok 11: Wygeneruj certyfikaty SSL](#step-11-generate-ssl-certificates)
  * [Krok 12: Wygeneruj klucze szyfrujące](#step-12-generate-encryption-keys)
  * [Krok 13: Aktualizacja ścieżek SSL w konfiguracji](#step-13-update-ssl-paths-in-configuration)
  * [Krok 14: Skonfiguruj podstawowe uwierzytelnianie](#step-14-set-up-basic-authentication)
  * [Krok 15: Wdrażanie za pomocą Docker Compose](#step-15-deploy-with-docker-compose)
  * [Krok 16: Sprawdź instalację](#step-16-verify-installation)
* [Konfiguracja po instalacji](#post-installation-configuration)
  * [Konfiguracja rekordów DNS](#dns-records-setup)
  * [Pierwsze logowanie](#first-login)
* [Konfiguracja kopii zapasowej](#backup-configuration)
  * [Konfigurowanie kopii zapasowej zgodnej z S3](#set-up-s3-compatible-backup)
  * [Konfigurowanie zadań kopii zapasowej Cron](#set-up-backup-cron-jobs)
* [Konfiguracja automatycznej aktualizacji](#auto-update-configuration)
* [Konserwacja i monitorowanie](#maintenance-and-monitoring)
  * [Lokalizacje dzienników](#log-locations)
  * [Regularne zadania konserwacyjne](#regular-maintenance-tasks)
  * [Odnowienie certyfikatu](#certificate-renewal)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Typowe problemy](#common-issues)
  * [Uzyskiwanie pomocy](#getting-help)
* [Najlepsze praktyki bezpieczeństwa](#security-best-practices)
* [Wniosek](#conclusion)

## Przegląd {#overview}

Ten przewodnik zawiera instrukcje krok po kroku dotyczące instalacji samodzielnie hostowanego rozwiązania Forward Email w systemach Ubuntu. Ten przewodnik jest specjalnie dostosowany do wersji Ubuntu 20.04, 22.04 i 24.04 LTS.

## Wymagania wstępne {#prerequisites}

Przed rozpoczęciem instalacji upewnij się, że masz:

* **Serwer Ubuntu**: 20.04, 22.04 lub 24.04 LTS
* **Dostęp root**: Musisz mieć możliwość uruchamiania poleceń jako root (dostęp sudo)
* **Nazwa domeny**: Domena, którą kontrolujesz z dostępem do zarządzania DNS
* **Czysty serwer**: Zalecane jest użycie nowej instalacji Ubuntu
* **Połączenie internetowe**: Wymagane do pobierania pakietów i obrazów Docker

## Wymagania systemowe {#system-requirements}

* **RAM**: Minimum 2 GB (zalecane 4 GB do produkcji)
* **Pamięć masowa**: Minimum 20 GB dostępnej przestrzeni (zalecane 50 GB+ do produkcji)
* **CPU**: Minimum 1 vCPU (zalecane 2+ vCPU do produkcji)
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

Najpierw upewnij się, że system jest aktualny i zmień konto na użytkownika root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Krok 2: Skonfiguruj resolvery DNS {#step-2-configure-dns-resolvers}

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

Zainstaluj wymagane pakiety dla funkcji Forward Email:

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

### Krok 4: Zainstaluj pakiety Snap {#step-4-install-snap-packages}

Zainstaluj AWS CLI i Certbot za pomocą Snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Krok 5: Zainstaluj Dockera {#step-5-install-docker}

Zainstaluj Docker CE i Docker Compose:

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

### Krok 6: Skonfiguruj usługę Docker {#step-6-configure-docker-service}

Upewnij się, że Docker uruchamia się automatycznie i działa:

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

### Krok 7: Skonfiguruj zaporę sieciową {#step-7-configure-firewall}

Skonfiguruj zaporę UFW, aby zabezpieczyć swój serwer:

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

### Krok 8: Klonuj repozytorium wiadomości e-mail {#step-8-clone-forward-email-repository}

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

### Krok 9: Skonfiguruj środowisko {#step-9-set-up-environment-configuration}

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

### Krok 10: Skonfiguruj swoją domenę {#step-10-configure-your-domain}

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

### Krok 11: Wygeneruj certyfikaty SSL {#step-11-generate-ssl-certificates}

#### Opcja A: Ręczne sprawdzanie DNS (zalecane dla większości użytkowników) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Ważne**: Gdy pojawi się monit, musisz utworzyć rekordy TXT w swoim DNS. Możesz zobaczyć wiele wyzwań dla tej samej domeny - **utwórz WSZYSTKIE**. Nie usuwaj pierwszego rekordu TXT podczas dodawania drugiego.

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

### Krok 12: Wygeneruj klucze szyfrujące {#step-12-generate-encryption-keys}

Utwórz różne klucze szyfrujące wymagane do bezpiecznej pracy:

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

### Krok 13: Zaktualizuj ścieżki SSL w konfiguracji {#step-13-update-ssl-paths-in-configuration}

Skonfiguruj ścieżki certyfikatów SSL w pliku środowiskowym:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Krok 14: Skonfiguruj uwierzytelnianie podstawowe {#step-14-set-up-basic-authentication}

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

### Krok 15: Wdrażanie za pomocą Docker Compose {#step-15-deploy-with-docker-compose}

Uruchom wszystkie usługi przekazywania poczty e-mail:

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

### Krok 16: Zweryfikuj instalację {#step-16-verify-installation}

Sprawdź, czy wszystkie usługi działają prawidłowo:

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

## Konfiguracja po instalacji {#post-installation-configuration}

### Konfiguracja rekordów DNS {#dns-records-setup}

Musisz skonfigurować następujące rekordy DNS dla swojej domeny:

#### Rekord MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Rekordy A {#a-records}

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
2. Wprowadź podstawowe dane uwierzytelniające, które wcześniej zapisałeś
3. Ukończ kreatora konfiguracji początkowej
4. Utwórz swoje pierwsze konto e-mail

## Konfiguracja kopii zapasowej {#backup-configuration}

### Skonfiguruj kopię zapasową zgodną z S3 {#set-up-s3-compatible-backup}

Skonfiguruj automatyczne kopie zapasowe w pamięci masowej zgodnej ze standardem S3:

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
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Konserwacja i monitorowanie {#maintenance-and-monitoring}

### Lokalizacje dzienników {#log-locations}

* **Dzienniki Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Dzienniki systemowe**: `/var/log/syslog`
* **Dzienniki kopii zapasowych**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Dzienniki automatycznej aktualizacji**: `/var/log/autoupdate.log`

### Regularne zadania konserwacyjne {#regular-maintenance-tasks}

1. **Monitoruj przestrzeń dyskową**: `df -h`
2. **Sprawdź stan usługi**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Przejrzyj dzienniki**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Aktualizuj pakiety systemowe**: `apt update && apt upgrade`
5. **Odnów certyfikaty**: Certyfikaty odnawiają się automatycznie, ale monitorują wygaśnięcie

### Odnowienie certyfikatu {#certificate-renewal}

Certyfikaty powinny odnawiać się automatycznie, ale w razie potrzeby możesz to zrobić ręcznie:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Rozwiązywanie problemów {#troubleshooting}

### Typowe problemy {#common-issues}

#### 1. Usługa Docker nie uruchamia się {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Generowanie certyfikatu nie powiodło się {#2-certificate-generation-fails}

* Upewnij się, że porty 80 i 443 są dostępne
* Sprawdź, czy rekordy DNS wskazują na Twój serwer
* Sprawdź ustawienia zapory

#### 3. Problemy z dostarczaniem wiadomości e-mail {#3-email-delivery-issues}

* Sprawdź, czy rekordy MX są poprawne
* Sprawdź rekordy SPF, DKIM i DMARC
* Upewnij się, że port 25 nie jest blokowany przez Twojego dostawcę hostingu

#### 4. Interfejs sieciowy niedostępny {#4-web-interface-not-accessible}

* Sprawdź ustawienia zapory: `ufw status`
* Sprawdź certyfikaty SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Sprawdź podstawowe dane uwierzytelniające

### Uzyskiwanie pomocy {#getting-help}

* **Dokumentacja**: <https://forwardemail.net/self-hosted>
* **Problemy w GitHubie**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Wsparcie społeczności**: Sprawdź dyskusje projektu w GitHubie

## Najlepsze praktyki bezpieczeństwa {#security-best-practices}

1. **Aktualizuj system**: Regularnie aktualizuj Ubuntu i pakiety
2. **Monitoruj dzienniki**: Skonfiguruj monitorowanie dzienników i alerty
3. **Regularnie twórz kopie zapasowe**: Testuj procedury tworzenia kopii zapasowych i przywracania
4. **Używaj silnych haseł**: Generuj silne hasła dla wszystkich kont
5. **Włącz Fail2Ban**: Rozważ zainstalowanie fail2ban w celu zapewnienia dodatkowego bezpieczeństwa
6. **Regularnie przeprowadzaj audyty bezpieczeństwa**: Okresowo przeglądaj swoją konfigurację

## Wnioski {#conclusion}

Twoja instalacja Forward Email self-hosted powinna być teraz ukończona i działać na Ubuntu. Pamiętaj, aby:

1. Skonfiguruj poprawnie swoje rekordy DNS
2. Przetestuj wysyłanie i odbieranie wiadomości e-mail
3. Skonfiguruj regularne kopie zapasowe
4. Regularnie monitoruj swój system
5. Aktualizuj swoją instalację

Aby uzyskać dodatkowe opcje konfiguracji i zaawansowane funkcje, zapoznaj się z oficjalną dokumentacją usługi Forward Email pod adresem <https://forwardemail.net/self-hosted#configuration>.