# Guida all'Installazione di Forward Email in Self-Hosting per Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Prerequisiti](#prerequisites)
* [Requisiti di Sistema](#system-requirements)
* [Installazione Passo-Passo](#step-by-step-installation)
  * [Passo 1: Configurazione Iniziale del Sistema](#step-1-initial-system-setup)
  * [Passo 2: Configurare i Resolver DNS](#step-2-configure-dns-resolvers)
  * [Passo 3: Installare le Dipendenze di Sistema](#step-3-install-system-dependencies)
  * [Passo 4: Installare e Configurare Snapd](#step-4-install-and-configure-snapd)
  * [Passo 5: Installare i Pacchetti Snap](#step-5-install-snap-packages)
  * [Passo 6: Installare Docker](#step-6-install-docker)
  * [Passo 7: Configurare il Servizio Docker](#step-7-configure-docker-service)
  * [Passo 8: Installare e Configurare il Firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Passo 9: Clonare il Repository di Forward Email](#step-9-clone-forward-email-repository)
  * [Passo 10: Configurare l'Ambiente](#step-10-set-up-environment-configuration)
  * [Passo 11: Configurare il Tuo Dominio](#step-11-configure-your-domain)
  * [Passo 12: Generare i Certificati SSL](#step-12-generate-ssl-certificates)
  * [Passo 13: Generare le Chiavi di Crittografia](#step-13-generate-encryption-keys)
  * [Passo 14: Aggiornare i Percorsi SSL nella Configurazione](#step-14-update-ssl-paths-in-configuration)
  * [Passo 15: Configurare l'Autenticazione Base](#step-15-set-up-basic-authentication)
  * [Passo 16: Deploy con Docker Compose](#step-16-deploy-with-docker-compose)
  * [Passo 17: Verificare l'Installazione](#step-17-verify-installation)
* [Configurazione Post-Installazione](#post-installation-configuration)
  * [Configurazione dei Record DNS](#dns-records-setup)
  * [Primo Accesso](#first-login)
* [Configurazione Backup](#backup-configuration)
  * [Configurare Backup Compatibile S3](#set-up-s3-compatible-backup)
  * [Configurare Cron Job per Backup](#set-up-backup-cron-jobs)
* [Configurazione Auto-Aggiornamento](#auto-update-configuration)
* [Considerazioni Specifiche per Debian](#debian-specific-considerations)
  * [Differenze nella Gestione dei Pacchetti](#package-management-differences)
  * [Gestione dei Servizi](#service-management)
  * [Configurazione di Rete](#network-configuration)
* [Manutenzione e Monitoraggio](#maintenance-and-monitoring)
  * [Posizione dei Log](#log-locations)
  * [Attività di Manutenzione Regolari](#regular-maintenance-tasks)
  * [Rinnovo dei Certificati](#certificate-renewal)
* [Risoluzione dei Problemi](#troubleshooting)
  * [Problemi Specifici di Debian](#debian-specific-issues)
  * [Problemi Comuni](#common-issues)
  * [Come Ottenere Aiuto](#getting-help)
* [Best Practice di Sicurezza](#security-best-practices)
* [Conclusione](#conclusion)


## Panoramica {#overview}

Questa guida fornisce istruzioni passo-passo per installare la soluzione self-hosted di Forward Email su sistemi Debian. La guida è specificamente pensata per Debian 11 (Bullseye) e Debian 12 (Bookworm).


## Prerequisiti {#prerequisites}

Prima di iniziare l'installazione, assicurati di avere:

* **Server Debian**: Versione 11 (Bullseye) o 12 (Bookworm)
* **Accesso Root**: Devi poter eseguire comandi come root (accesso sudo)
* **Nome Dominio**: Un dominio che controlli con accesso alla gestione DNS
* **Server Pulito**: Si consiglia di usare un'installazione Debian fresca
* **Connessione Internet**: Necessaria per scaricare pacchetti e immagini Docker


## Requisiti di Sistema {#system-requirements}

* **RAM**: Minimo 2GB (4GB consigliati per produzione)
* **Storage**: Minimo 20GB di spazio disponibile (50GB+ consigliati per produzione)
* **CPU**: Minimo 1 vCPU (2+ vCPU consigliati per produzione)
* **Rete**: Indirizzo IP pubblico con le seguenti porte accessibili:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Installazione Passo-Passo {#step-by-step-installation}

### Passo 1: Configurazione Iniziale del Sistema {#step-1-initial-system-setup}

Per prima cosa, assicurati che il sistema sia aggiornato e passa all'utente root:

```bash
# Aggiorna i pacchetti di sistema
sudo apt update && sudo apt upgrade -y

# Passa all'utente root (richiesto per l'installazione)
sudo su -
```
### Step 2: Configurare i Resolver DNS {#step-2-configure-dns-resolvers}

Configura il tuo sistema per utilizzare i server DNS di Cloudflare per una generazione affidabile dei certificati:

```bash
# Stoppa e disabilita systemd-resolved se in esecuzione
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configura i resolver DNS di Cloudflare
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

### Step 3: Installare le Dipendenze di Sistema {#step-3-install-system-dependencies}

Installa i pacchetti richiesti per Forward Email su Debian:

```bash
# Aggiorna la lista dei pacchetti
apt-get update -y

# Installa le dipendenze di base (lista pacchetti specifica per Debian)
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

### Step 4: Installare e Configurare Snapd {#step-4-install-and-configure-snapd}

Debian non include snapd di default, quindi dobbiamo installarlo e configurarlo:

```bash
# Installa snapd
apt-get install -y snapd

# Abilita e avvia il servizio snapd
systemctl enable snapd
systemctl start snapd

# Crea un collegamento simbolico per far funzionare correttamente snap
ln -sf /var/lib/snapd/snap /snap

# Attendi che snapd sia pronto
sleep 10

# Verifica che snapd funzioni
snap version
```

### Step 5: Installare i Pacchetti Snap {#step-5-install-snap-packages}

Installa AWS CLI e Certbot tramite snap:

```bash
# Installa AWS CLI
snap install aws-cli --classic

# Installa Certbot e il plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verifica le installazioni
aws --version
certbot --version
```

### Step 6: Installare Docker {#step-6-install-docker}

Installa Docker CE e Docker Compose su Debian:

```bash
# Aggiungi la chiave GPG ufficiale di Docker (specifica per Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Aggiungi il repository Docker (specifico per Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Aggiorna l'indice dei pacchetti e installa Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installa docker-compose standalone come fallback (se il plugin non funziona)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verifica l'installazione di Docker
docker --version
docker compose version || docker-compose --version
```

### Step 7: Configurare il Servizio Docker {#step-7-configure-docker-service}

Assicurati che Docker si avvii automaticamente e sia in esecuzione:

```bash
# Abilita e avvia il servizio Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verifica che Docker sia in esecuzione
docker info
```

Se Docker non si avvia, prova ad avviarlo manualmente:

```bash
# Metodo alternativo di avvio se systemctl fallisce
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Installare e Configurare il Firewall UFW {#step-8-install-and-configure-ufw-firewall}

Le installazioni minime di Debian potrebbero non includere UFW, quindi installalo prima:

```bash
# Installa UFW se non presente
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Imposta le politiche predefinite
ufw default deny incoming
ufw default allow outgoing

# Consenti SSH (importante - non chiuderti fuori!)
ufw allow 22/tcp

# Consenti le porte relative all'email
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (per Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (porta alternativa)
ufw allow 2995/tcp  # POP3 (porta alternativa)
ufw allow 3456/tcp  # Porta servizio personalizzata
ufw allow 4000/tcp  # Porta servizio personalizzata
ufw allow 5000/tcp  # Porta servizio personalizzata

# Consenti connessioni locali al database
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Abilita il firewall
echo "y" | ufw enable

# Controlla lo stato del firewall
ufw status numbered
```
### Passo 9: Clona il Repository di Forward Email {#step-9-clone-forward-email-repository}

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

### Passo 10: Configura l'Ambiente {#step-10-set-up-environment-configuration}

Prepara la configurazione dell'ambiente:

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

### Passo 11: Configura il Tuo Dominio {#step-11-configure-your-domain}

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

### Passo 12: Genera i Certificati SSL {#step-12-generate-ssl-certificates}

#### Opzione A: Sfida DNS Manuale (Consigliata per la maggior parte degli utenti) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Quando richiesto, dovrai creare record TXT nel tuo DNS. Potresti vedere più sfide per lo stesso dominio - **crea TUTTE**. Non rimuovere il primo record TXT quando aggiungi il secondo.

#### Opzione B: DNS Cloudflare (Se usi Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Se il tuo dominio utilizza Cloudflare per il DNS, puoi automatizzare la generazione dei certificati:

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

#### Copia i Certificati {#copy-certificates}

Dopo la generazione dei certificati, copiali nella directory dell'applicazione:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Passo 13: Genera le Chiavi di Crittografia {#step-13-generate-encryption-keys}

Crea le varie chiavi di crittografia necessarie per il funzionamento sicuro:

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

echo "✅ Tutte le chiavi di crittografia sono state generate con successo"
```
### Passo 14: Aggiorna i Percorsi SSL nella Configurazione {#step-14-update-ssl-paths-in-configuration}

Configura i percorsi del certificato SSL nel file di ambiente:

```bash
# Aggiorna i percorsi SSL per puntare ai file di certificato corretti
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Passo 15: Configura l'Autenticazione Base {#step-15-set-up-basic-authentication}

Crea credenziali temporanee per l'autenticazione base:

```bash
# Genera una password casuale sicura
PASSWORD=$(openssl rand -base64 16)

# Aggiorna il file di ambiente con le credenziali di autenticazione base
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Mostra le credenziali (salvale!)
echo ""
echo "🔐 IMPORTANTE: Salva queste credenziali di accesso!"
echo "=================================="
echo "Username: admin"
echo "Password: $PASSWORD"
echo "=================================="
echo ""
echo "Ti serviranno per accedere all'interfaccia web dopo l'installazione."
echo ""
```

### Passo 16: Distribuisci con Docker Compose {#step-16-deploy-with-docker-compose}

Avvia tutti i servizi di Forward Email:

```bash
# Imposta il percorso del file Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Ferma eventuali container esistenti
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Scarica le immagini più recenti
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Avvia tutti i servizi in modalità detached
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Attendi un momento per l'avvio dei servizi
sleep 10

# Controlla lo stato dei servizi
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Passo 17: Verifica l'Installazione {#step-17-verify-installation}

Controlla che tutti i servizi siano in esecuzione correttamente:

```bash
# Controlla i container Docker
docker ps

# Controlla i log dei servizi per eventuali errori
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Testa la connettività dell'interfaccia web
curl -I https://$DOMAIN

# Controlla se le porte sono in ascolto
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Configurazione Post-Installazione {#post-installation-configuration}

### Configurazione dei Record DNS {#dns-records-setup}

Devi configurare i seguenti record DNS per il tuo dominio:

#### Record MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Record A {#a-records}

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
# Estrai la chiave pubblica DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Crea il record DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Record DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Primo Accesso {#first-login}

1. Apri il tuo browser web e vai su `https://yourdomain.com`
2. Inserisci le credenziali di autenticazione base che hai salvato in precedenza
3. Completa la procedura guidata di configurazione iniziale
4. Crea il tuo primo account email


## Configurazione del Backup {#backup-configuration}

### Configura Backup Compatibile S3 {#set-up-s3-compatible-backup}

Configura backup automatici su storage compatibile S3:

```bash
# Crea la directory per le credenziali AWS
mkdir -p ~/.aws

# Configura le credenziali AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configura le impostazioni AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Per S3 non AWS (come Cloudflare R2), aggiungi l'URL endpoint
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Configurare i Cron Job per il Backup {#set-up-backup-cron-jobs}

```bash
# Rendi eseguibili gli script di backup
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Aggiungi il cron job per il backup di MongoDB (esegue ogni giorno a mezzanotte)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Aggiungi il cron job per il backup di Redis (esegue ogni giorno a mezzanotte)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verifica che i cron job siano stati aggiunti
crontab -l
```


## Configurazione dell'Aggiornamento Automatico {#auto-update-configuration}

Configura gli aggiornamenti automatici per la tua installazione di Forward Email:

```bash
# Crea il comando di auto-aggiornamento (usa il comando docker compose appropriato)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Aggiungi il cron job per l'auto-aggiornamento (esegue ogni giorno alle 1 di notte)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verifica che il cron job sia stato aggiunto
crontab -l
```


## Considerazioni Specifiche per Debian {#debian-specific-considerations}

### Differenze nella Gestione dei Pacchetti {#package-management-differences}

* **Snapd**: Non installato di default su Debian, richiede installazione manuale
* **Docker**: Usa repository e chiavi GPG specifiche per Debian
* **UFW**: Potrebbe non essere incluso nelle installazioni minime di Debian
* **systemd**: Il comportamento può differire leggermente da Ubuntu

### Gestione dei Servizi {#service-management}

```bash
# Controlla lo stato dei servizi (comandi specifici per Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Riavvia i servizi se necessario
systemctl restart snapd
systemctl restart docker
```

### Configurazione di Rete {#network-configuration}

Debian potrebbe avere nomi o configurazioni delle interfacce di rete differenti:

```bash
# Controlla le interfacce di rete
ip addr show

# Controlla il routing
ip route show

# Controlla la risoluzione DNS
nslookup google.com
```


## Manutenzione e Monitoraggio {#maintenance-and-monitoring}

### Posizione dei Log {#log-locations}

* **Log di Docker Compose**: Usa il comando docker compose appropriato in base all'installazione
* **Log di sistema**: `/var/log/syslog`
* **Log di backup**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Log di auto-aggiornamento**: `/var/log/autoupdate.log`
* **Log di Snapd**: `journalctl -u snapd`

### Attività di Manutenzione Regolare {#regular-maintenance-tasks}

1. **Monitora lo spazio su disco**: `df -h`
2. **Controlla lo stato dei servizi**: Usa il comando docker compose appropriato
3. **Rivedi i log**: Controlla sia i log dell'applicazione che quelli di sistema
4. **Aggiorna i pacchetti di sistema**: `apt update && apt upgrade`
5. **Monitora snapd**: `snap list` e `snap refresh`

### Rinnovo del Certificato {#certificate-renewal}

I certificati dovrebbero rinnovarsi automaticamente, ma puoi rinnovarli manualmente se necessario:

```bash
# Rinnovo manuale del certificato
certbot renew

# Copia i certificati rinnovati
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Riavvia i servizi per usare i nuovi certificati
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Risoluzione dei Problemi {#troubleshooting}

### Problemi Specifici di Debian {#debian-specific-issues}

#### 1. Snapd non funziona {#1-snapd-not-working}

```bash
# Controlla lo stato di snapd
systemctl status snapd

# Riavvia snapd
systemctl restart snapd

# Controlla il percorso di snap
echo $PATH | grep snap

# Aggiungi snap al PATH se manca
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Comando Docker Compose non trovato {#2-docker-compose-command-not-found}

```bash
# Controlla quale comando docker compose è disponibile
command -v docker-compose
command -v docker

# Usa il comando appropriato negli script
if command -v docker-compose &> /dev/null; then
    echo "Usando docker-compose"
else
    echo "Usando docker compose"
fi
```
#### 3. Problemi di Installazione dei Pacchetti {#3-package-installation-issues}

```bash
# Aggiorna la cache dei pacchetti
apt update

# Risolvi pacchetti danneggiati
apt --fix-broken install

# Controlla i pacchetti bloccati
apt-mark showhold
```

### Problemi Comuni {#common-issues}

#### 1. Il Servizio Docker Non Si Avvia {#1-docker-service-wont-start}

```bash
# Controlla lo stato di Docker
systemctl status docker

# Controlla i log di Docker
journalctl -u docker

# Prova un avvio alternativo
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Fallimento nella Generazione del Certificato {#2-certificate-generation-fails}

* Assicurati che le porte 80 e 443 siano accessibili
* Verifica che i record DNS puntino al tuo server
* Controlla le impostazioni del firewall con `ufw status`

#### 3. Problemi di Consegna Email {#3-email-delivery-issues}

* Verifica che i record MX siano corretti
* Controlla i record SPF, DKIM e DMARC
* Assicurati che la porta 25 non sia bloccata dal tuo provider di hosting

### Ottenere Aiuto {#getting-help}

* **Documentazione**: <https://forwardemail.net/self-hosted>
* **Problemi su GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentazione Debian**: <https://www.debian.org/doc/>


## Best Practice di Sicurezza {#security-best-practices}

1. **Mantieni il Sistema Aggiornato**: Aggiorna regolarmente Debian e i pacchetti
2. **Monitora i Log**: Configura il monitoraggio e gli avvisi dei log
3. **Esegui Backup Regolari**: Testa le procedure di backup e ripristino
4. **Usa Password Forti**: Genera password robuste per tutti gli account
5. **Abilita Fail2Ban**: Considera l’installazione di fail2ban per una sicurezza aggiuntiva
6. **Audit di Sicurezza Regolari**: Rivedi periodicamente la tua configurazione
7. **Monitora Snapd**: Mantieni aggiornati i pacchetti snap con `snap refresh`


## Conclusione {#conclusion}

La tua installazione self-hosted di Forward Email dovrebbe ora essere completa e funzionante su Debian. Ricorda di:

1. Configurare correttamente i record DNS
2. Testare l’invio e la ricezione delle email
3. Impostare backup regolari
4. Monitorare regolarmente il sistema
5. Mantenere aggiornata l’installazione
6. Monitorare snapd e i pacchetti snap

Le principali differenze rispetto a Ubuntu sono l’installazione di snapd e la configurazione del repository Docker. Una volta configurati correttamente, l’applicazione Forward Email si comporta in modo identico su entrambi i sistemi.

Per opzioni di configurazione aggiuntive e funzionalità avanzate, consulta la documentazione ufficiale di Forward Email su <https://forwardemail.net/self-hosted#configuration>.
