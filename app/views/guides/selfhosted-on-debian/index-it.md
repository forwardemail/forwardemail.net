# Guida all'installazione dell'auto-hosting di Forward Email per Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Prerequisiti](#prerequisites)
* [Requisiti di sistema](#system-requirements)
* [Installazione passo passo](#step-by-step-installation)
  * [Fase 1: Configurazione iniziale del sistema](#step-1-initial-system-setup)
  * [Passaggio 2: configurare i risolutori DNS](#step-2-configure-dns-resolvers)
  * [Passaggio 3: installare le dipendenze di sistema](#step-3-install-system-dependencies)
  * [Passaggio 4: installare e configurare Snapd](#step-4-install-and-configure-snapd)
  * [Passaggio 5: installare i pacchetti Snap](#step-5-install-snap-packages)
  * [Passaggio 6: installare Docker](#step-6-install-docker)
  * [Passaggio 7: configurare il servizio Docker](#step-7-configure-docker-service)
  * [Passaggio 8: installare e configurare il firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Passaggio 9: clona il repository di posta elettronica inoltrata](#step-9-clone-forward-email-repository)
  * [Passaggio 10: impostare la configurazione dell'ambiente](#step-10-set-up-environment-configuration)
  * [Passaggio 11: configura il tuo dominio](#step-11-configure-your-domain)
  * [Passaggio 12: Generare certificati SSL](#step-12-generate-ssl-certificates)
  * [Passaggio 13: Generare le chiavi di crittografia](#step-13-generate-encryption-keys)
  * [Passaggio 14: aggiornare i percorsi SSL nella configurazione](#step-14-update-ssl-paths-in-configuration)
  * [Passaggio 15: impostare l'autenticazione di base](#step-15-set-up-basic-authentication)
  * [Passaggio 16: distribuzione con Docker Compose](#step-16-deploy-with-docker-compose)
  * [Passaggio 17: verifica dell'installazione](#step-17-verify-installation)
* [Configurazione post-installazione](#post-installation-configuration)
  * [Configurazione dei record DNS](#dns-records-setup)
  * [Primo accesso](#first-login)
* [Configurazione di backup](#backup-configuration)
  * [Imposta backup compatibile con S3](#set-up-s3-compatible-backup)
  * [Imposta i Cron Job di Backup](#set-up-backup-cron-jobs)
* [Configurazione di aggiornamento automatico](#auto-update-configuration)
* [Considerazioni specifiche di Debian](#debian-specific-considerations)
  * [Differenze nella gestione dei pacchetti](#package-management-differences)
  * [Gestione dei servizi](#service-management)
  * [Configurazione di rete](#network-configuration)
* [Manutenzione e monitoraggio](#maintenance-and-monitoring)
  * [Posizioni dei registri](#log-locations)
  * [Attività di manutenzione ordinaria](#regular-maintenance-tasks)
  * [Rinnovo del certificato](#certificate-renewal)
* [Risoluzione dei problemi](#troubleshooting)
  * [Problemi specifici di Debian](#debian-specific-issues)
  * [Problemi comuni](#common-issues)
  * [Ottenere aiuto](#getting-help)
* [Migliori pratiche di sicurezza](#security-best-practices)
* [Conclusione](#conclusion)

## Panoramica {#overview}

Questa guida fornisce istruzioni dettagliate per l'installazione della soluzione self-hosted di Forward Email su sistemi Debian. Questa guida è specificamente pensata per Debian 11 (Bullseye) e Debian 12 (Bookworm).

## Prerequisiti {#prerequisites}

Prima di iniziare l'installazione, assicurati di avere:

* **Server Debian**: Versione 11 (Bullseye) o 12 (Bookworm)
* **Accesso root**: Devi essere in grado di eseguire comandi come root (accesso sudo)
* **Nome dominio**: Un dominio che controlli con accesso di gestione DNS
* **Server pulito**: Si consiglia di utilizzare una nuova installazione Debian
* **Connessione Internet**: Necessaria per scaricare pacchetti e immagini Docker

## Requisiti di sistema {#system-requirements}

* **RAM**: minimo 2 GB (4 GB consigliati per la produzione)
* **Archiviazione**: minimo 20 GB di spazio disponibile (oltre 50 GB consigliati per la produzione)
* **CPU**: minimo 1 vCPU (oltre 2 vCPU consigliate per la produzione)
* **Rete**: indirizzo IP pubblico con le seguenti porte accessibili:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Installazione passo passo {#step-by-step-installation}

### Passaggio 1: configurazione iniziale del sistema {#step-1-initial-system-setup}

Per prima cosa, assicurati che il tuo sistema sia aggiornato e passa all'utente root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Passaggio 2: configurare i risolutori DNS {#step-2-configure-dns-resolvers}

Configura il tuo sistema per utilizzare i server DNS di Cloudflare per una generazione affidabile di certificati:

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

### Passaggio 3: Installa le dipendenze di sistema {#step-3-install-system-dependencies}

Installa i pacchetti necessari per Forward Email su Debian:

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

### Passaggio 4: installa e configura Snapd {#step-4-install-and-configure-snapd}

Debian non include snapd di default, quindi dobbiamo installarlo e configurarlo:

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

### Passaggio 5: Installa i pacchetti Snap {#step-5-install-snap-packages}

Installa AWS CLI e Certbot tramite snap:

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

### Passaggio 6: installa Docker {#step-6-install-docker}

Installa Docker CE e Docker Compose su Debian:

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

### Passaggio 7: configurare il servizio Docker {#step-7-configure-docker-service}

Assicurati che Docker si avvii automaticamente e sia in esecuzione:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Se Docker non si avvia, prova ad avviarlo manualmente:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Passaggio 8: Installa e configura il firewall UFW {#step-8-install-and-configure-ufw-firewall}

Le installazioni minime di Debian potrebbero non includere UFW, quindi installalo prima:

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

### Passaggio 9: Clona il repository di posta elettronica inoltro {#step-9-clone-forward-email-repository}

Scarica il codice sorgente di Forward Email:

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

### Passaggio 10: Imposta la configurazione dell'ambiente {#step-10-set-up-environment-configuration}

Preparare la configurazione dell'ambiente:

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

### Passaggio 11: configura il tuo dominio {#step-11-configure-your-domain}

Imposta il nome del tuo dominio e aggiorna le variabili d'ambiente:

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

### Passaggio 12: Genera certificati SSL {#step-12-generate-ssl-certificates}

#### Opzione A: Sfida DNS manuale (consigliata per la maggior parte degli utenti) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: quando richiesto, dovrai creare record TXT nel tuo DNS. Potresti visualizzare più richieste di verifica per lo stesso dominio: **creale TUTTE**. Non rimuovere il primo record TXT quando aggiungi il secondo.

#### Opzione B: DNS Cloudflare (se utilizzi Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Se il tuo dominio utilizza Cloudflare per DNS, puoi automatizzare la generazione del certificato:

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

#### Copia certificati {#copy-certificates}

Dopo aver generato il certificato, copiarlo nella directory dell'applicazione:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Passaggio 13: Genera chiavi di crittografia {#step-13-generate-encryption-keys}

Creare le varie chiavi di crittografia necessarie per un funzionamento sicuro:

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

### Passaggio 14: Aggiorna i percorsi SSL nella configurazione {#step-14-update-ssl-paths-in-configuration}

Configurare i percorsi del certificato SSL nel file di ambiente:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Passaggio 15: Imposta l'autenticazione di base {#step-15-set-up-basic-authentication}

Crea credenziali di autenticazione di base temporanee:

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

### Passaggio 16: distribuzione con Docker Compose {#step-16-deploy-with-docker-compose}

Avvia tutti i servizi di inoltro email:

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

### Passaggio 17: verifica dell'installazione {#step-17-verify-installation}

Verificare che tutti i servizi funzionino correttamente:

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

## Configurazione post-installazione {#post-installation-configuration}

### Configurazione record DNS {#dns-records-setup}

Devi configurare i seguenti record DNS per il tuo dominio:

#### Record MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A Registra {#a-records}

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

#### Record SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Record DKIM {#dkim-record}

Ottieni la tua chiave pubblica DKIM:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Crea record DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Record DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Primo accesso {#first-login}

1. Apri il browser web e vai a `https://yourdomain.com`
2. Inserisci le credenziali di autenticazione di base salvate in precedenza
3. Completa la configurazione guidata iniziale
4. Crea il tuo primo account email

## Configurazione di backup {#backup-configuration}

### Imposta backup compatibile con S3 {#set-up-s3-compatible-backup}

Configurare backup automatici su storage compatibile con S3:

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

### Imposta i cron job di backup {#set-up-backup-cron-jobs}

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

## Configurazione di aggiornamento automatico {#auto-update-configuration}

Imposta gli aggiornamenti automatici per l'installazione di Forward Email:

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

## Considerazioni specifiche per Debian {#debian-specific-considerations}

### Differenze nella gestione dei pacchetti {#package-management-differences}

* **Snapd**: Non installato di default su Debian, richiede l'installazione manuale
* **Docker**: Utilizza repository specifici di Debian e chiavi GPG
* **UFW**: Potrebbe non essere incluso nelle installazioni minime di Debian
* **systemd**: Il comportamento potrebbe differire leggermente da Ubuntu

### Gestione del servizio {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Configurazione di rete {#network-configuration}

Debian può avere nomi o configurazioni di interfaccia di rete diversi:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Manutenzione e monitoraggio {#maintenance-and-monitoring}

### Posizioni dei registri {#log-locations}

* **Log di Docker Compose**: utilizzare il comando Docker Compose appropriato in base all'installazione
* **Log di sistema**: `/var/log/syslog`
* **Log di backup**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Log di aggiornamento automatico**: `/var/log/autoupdate.log`
* **Log di Snapd**: `journalctl -u snapd`

### Attività di manutenzione ordinaria {#regular-maintenance-tasks}

1. **Monitoraggio dello spazio su disco**: `df -h`
2. **Controllo dello stato del servizio**: utilizzare il comando Docker Compose appropriato
3. **Controllo dei log**: controllare i log dell'applicazione e di sistema
4. **Aggiornare i pacchetti di sistema**: `apt update && apt upgrade`
5. **Monitoraggio di snapd**: `snap list` e `snap refresh`

### Rinnovo del certificato {#certificate-renewal}

I certificati dovrebbero rinnovarsi automaticamente, ma è possibile rinnovarli manualmente se necessario:

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

## Risoluzione dei problemi {#troubleshooting}

### Problemi specifici di Debian {#debian-specific-issues}

#### 1. Snapd non funziona {#1-snapd-not-working}

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

#### 2. Comando Docker Compose non trovato {#2-docker-compose-command-not-found}

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

#### 3. Problemi di installazione del pacchetto {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Problemi comuni {#common-issues}

#### 1. Il servizio Docker non si avvia {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. La generazione del certificato non riesce {#2-certificate-generation-fails}

* Assicurati che le porte 80 e 443 siano accessibili
* Verifica che i record DNS puntino al tuo server
* Controlla le impostazioni del firewall con `ufw status`

#### 3. Problemi di recapito delle e-mail {#3-email-delivery-issues}

* Verifica che i record MX siano corretti
* Controlla i record SPF, DKIM e DMARC
* Assicurati che la porta 25 non sia bloccata dal tuo provider di hosting

### Ottenere aiuto {#getting-help}

* **Documentazione**: <https://forwardemail.net/self-hosted>
* **Problemi GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentazione Debian**: <https://www.debian.org/doc/>

## Procedure consigliate per la sicurezza {#security-best-practices}

1. **Mantieni il sistema aggiornato**: Aggiorna regolarmente Debian e i pacchetti
2. **Monitora i log**: Imposta il monitoraggio dei log e gli avvisi
3. **Esegui backup regolari**: Testa le procedure di backup e ripristino
4. **Usa password complesse**: Genera password complesse per tutti gli account
5. **Abilita Fail2Ban**: Valuta l'installazione di fail2ban per una maggiore sicurezza
6. **Verifiche di sicurezza regolari**: Rivedi periodicamente la tua configurazione
7. **Monitora Snapd**: Mantieni aggiornati i pacchetti snap con `snap refresh`

## Conclusione {#conclusion}

L'installazione self-hosted di Forward Email dovrebbe ora essere completa e funzionante su Debian. Ricorda di:

1. Configura correttamente i tuoi record DNS
2. Testa l'invio e la ricezione delle email
3. Imposta backup regolari
4. Monitora regolarmente il tuo sistema
5. Mantieni aggiornata l'installazione
6. Monitora snapd e i pacchetti snap

Le principali differenze rispetto a Ubuntu sono l'installazione di snapd e la configurazione del repository Docker. Una volta configurati correttamente, l'applicazione Forward Email si comporta in modo identico su entrambi i sistemi.

Per ulteriori opzioni di configurazione e funzionalità avanzate, fare riferimento alla documentazione ufficiale di Forward Email all'indirizzo <https://forwardemail.net/self-hosted#configuration>.