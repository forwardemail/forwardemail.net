# Guida all'Installazione di Forward Email in Self-Hosting per Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Prerequisiti](#prerequisites)
* [Requisiti di Sistema](#system-requirements)
* [Installazione Passo-Passo](#step-by-step-installation)
  * [Passo 1: Configurazione Iniziale del Sistema](#step-1-initial-system-setup)
  * [Passo 2: Configurare i Resolver DNS](#step-2-configure-dns-resolvers)
  * [Passo 3: Installare le Dipendenze di Sistema](#step-3-install-system-dependencies)
  * [Passo 4: Installare i Pacchetti Snap](#step-4-install-snap-packages)
  * [Passo 5: Installare Docker](#step-5-install-docker)
  * [Passo 6: Configurare il Servizio Docker](#step-6-configure-docker-service)
  * [Passo 7: Configurare il Firewall](#step-7-configure-firewall)
  * [Passo 8: Clonare il Repository di Forward Email](#step-8-clone-forward-email-repository)
  * [Passo 9: Configurare l'Ambiente](#step-9-set-up-environment-configuration)
  * [Passo 10: Configurare il Tuo Dominio](#step-10-configure-your-domain)
  * [Passo 11: Generare i Certificati SSL](#step-11-generate-ssl-certificates)
  * [Passo 12: Generare le Chiavi di Crittografia](#step-12-generate-encryption-keys)
  * [Passo 13: Aggiornare i Percorsi SSL nella Configurazione](#step-13-update-ssl-paths-in-configuration)
  * [Passo 14: Configurare l'Autenticazione Base](#step-14-set-up-basic-authentication)
  * [Passo 15: Distribuire con Docker Compose](#step-15-deploy-with-docker-compose)
  * [Passo 16: Verificare l'Installazione](#step-16-verify-installation)
* [Configurazione Post-Installazione](#post-installation-configuration)
  * [Configurazione dei Record DNS](#dns-records-setup)
  * [Primo Accesso](#first-login)
* [Configurazione del Backup](#backup-configuration)
  * [Configurare il Backup Compatibile S3](#set-up-s3-compatible-backup)
  * [Configurare i Cron Job per il Backup](#set-up-backup-cron-jobs)
* [Configurazione dell'Aggiornamento Automatico](#auto-update-configuration)
* [Manutenzione e Monitoraggio](#maintenance-and-monitoring)
  * [Posizione dei Log](#log-locations)
  * [Attività di Manutenzione Regolari](#regular-maintenance-tasks)
  * [Rinnovo dei Certificati](#certificate-renewal)
* [Risoluzione dei Problemi](#troubleshooting)
  * [Problemi Comuni](#common-issues)
  * [Come Ottenere Aiuto](#getting-help)
* [Best Practice di Sicurezza](#security-best-practices)
* [Conclusione](#conclusion)


## Panoramica {#overview}

Questa guida fornisce istruzioni passo-passo per installare la soluzione self-hosted di Forward Email su sistemi Ubuntu. La guida è specificamente pensata per le versioni Ubuntu 20.04, 22.04 e 24.04 LTS.


## Prerequisiti {#prerequisites}

Prima di iniziare l'installazione, assicurati di avere:

* **Ubuntu Server**: 20.04, 22.04 o 24.04 LTS
* **Accesso Root**: Devi poter eseguire comandi come root (accesso sudo)
* **Nome Dominio**: Un dominio che controlli con accesso alla gestione DNS
* **Server Pulito**: Si consiglia di usare un'installazione Ubuntu fresca
* **Connessione Internet**: Necessaria per scaricare pacchetti e immagini Docker


## Requisiti di Sistema {#system-requirements}

* **RAM**: Minimo 2GB (4GB consigliati per la produzione)
* **Storage**: Minimo 20GB di spazio disponibile (50GB+ consigliati per la produzione)
* **CPU**: Minimo 1 vCPU (2+ vCPU consigliati per la produzione)
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

### Passo 2: Configurare i Resolver DNS {#step-2-configure-dns-resolvers}

Configura il sistema per usare i server DNS di Cloudflare per una generazione affidabile dei certificati:

```bash
# Ferma e disabilita systemd-resolved se in esecuzione
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
### Step 3: Installa le Dipendenze di Sistema {#step-3-install-system-dependencies}

Installa i pacchetti richiesti per Forward Email:

```bash
# Aggiorna la lista dei pacchetti
apt-get update -y

# Installa le dipendenze di base
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Step 4: Installa i Pacchetti Snap {#step-4-install-snap-packages}

Installa AWS CLI e Certbot tramite snap:

```bash
# Installa AWS CLI
snap install aws-cli --classic

# Installa Certbot e il plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: Installa Docker {#step-5-install-docker}

Installa Docker CE e Docker Compose:

```bash
# Aggiungi la chiave GPG ufficiale di Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Aggiungi il repository Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Aggiorna l'indice dei pacchetti e installa Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verifica l'installazione di Docker
docker --version
docker compose version
```

### Step 6: Configura il Servizio Docker {#step-6-configure-docker-service}

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

### Step 7: Configura il Firewall {#step-7-configure-firewall}

Configura il firewall UFW per proteggere il tuo server:

```bash
# Imposta le politiche predefinite
ufw default deny incoming
ufw default allow outgoing

# Consenti SSH (importante - non bloccarti fuori!)
ufw allow 22/tcp

# Consenti le porte relative alle email
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

### Step 8: Clona il Repository di Forward Email {#step-8-clone-forward-email-repository}

Scarica il codice sorgente di Forward Email:

```bash
# Imposta le variabili
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clona il repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verifica che il clone sia andato a buon fine
ls -la
```

### Step 9: Configura l'Ambiente {#step-9-set-up-environment-configuration}

Prepara la configurazione dell'ambiente:

```bash
# Imposta le variabili delle directory
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copia il file di ambiente di default
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Crea la directory SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Crea le directory per i database
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 10: Configura il Tuo Dominio {#step-10-configure-your-domain}

Imposta il nome del tuo dominio e aggiorna le variabili d'ambiente:

```bash
# Sostituisci 'yourdomain.com' con il tuo dominio reale
DOMAIN="yourdomain.com"

# Funzione per aggiornare il file di ambiente
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Aggiorna le variabili d'ambiente relative al dominio
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
### Passo 11: Generare i Certificati SSL {#step-11-generate-ssl-certificates}

#### Opzione A: Sfida DNS Manuale (Consigliata per la maggior parte degli utenti) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Genera certificati usando la sfida DNS manuale
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Quando richiesto, dovrai creare record TXT nel tuo DNS. Potresti vedere più sfide per lo stesso dominio - **crea TUTTE**. Non rimuovere il primo record TXT quando aggiungi il secondo.

#### Opzione B: DNS Cloudflare (Se usi Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Se il tuo dominio usa Cloudflare per il DNS, puoi automatizzare la generazione dei certificati:

```bash
# Crea il file delle credenziali Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Imposta i permessi corretti
chmod 600 /root/.cloudflare.ini

# Genera i certificati automaticamente
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Copia dei Certificati {#copy-certificates}

Dopo la generazione dei certificati, copiali nella directory dell'applicazione:

```bash
# Copia i certificati nella directory SSL dell'applicazione
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verifica che i certificati siano stati copiati
ls -la "$SELF_HOST_DIR/ssl/"
```

### Passo 12: Generare le Chiavi di Crittografia {#step-12-generate-encryption-keys}

Crea le varie chiavi di crittografia necessarie per il funzionamento sicuro:

```bash
# Genera la chiave di crittografia helper
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Genera il segreto SRS per l'inoltro email
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Genera la chiave di crittografia TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Genera la chiave privata DKIM per la firma delle email
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Genera la chiave di firma webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Imposta la password per il trasporto SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Tutte le chiavi di crittografia sono state generate con successo"
```

### Passo 13: Aggiornare i Percorsi SSL nella Configurazione {#step-13-update-ssl-paths-in-configuration}

Configura i percorsi dei certificati SSL nel file di ambiente:

```bash
# Aggiorna i percorsi SSL per puntare ai file di certificato corretti
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Passo 14: Configurare l'Autenticazione Base {#step-14-set-up-basic-authentication}

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

### Passo 15: Distribuire con Docker Compose {#step-15-deploy-with-docker-compose}

Avvia tutti i servizi Forward Email:

```bash
# Imposta il percorso del file Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Ferma eventuali container esistenti
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Scarica le immagini più recenti
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Avvia tutti i servizi in modalità detached
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Attendi un momento per l'avvio dei servizi
sleep 10

# Controlla lo stato dei servizi
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Step 16: Verifica dell'Installazione {#step-16-verify-installation}

Controlla che tutti i servizi siano in esecuzione correttamente:

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
# Extract DKIM public key
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

1. Apri il tuo browser e vai su `https://yourdomain.com`
2. Inserisci le credenziali di autenticazione di base che hai salvato in precedenza
3. Completa la procedura guidata di configurazione iniziale
4. Crea il tuo primo account email


## Configurazione del Backup {#backup-configuration}

### Configurazione Backup Compatibile S3 {#set-up-s3-compatible-backup}

Configura backup automatici su storage compatibile S3:

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

### Configurazione Cron Job per Backup {#set-up-backup-cron-jobs}

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


## Configurazione Aggiornamenti Automatici {#auto-update-configuration}

Configura aggiornamenti automatici per la tua installazione di Forward Email:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```


## Manutenzione e Monitoraggio {#maintenance-and-monitoring}

### Posizione dei Log {#log-locations}

* **Log di Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Log di sistema**: `/var/log/syslog`
* **Log dei backup**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Log degli aggiornamenti automatici**: `/var/log/autoupdate.log`

### Attività di Manutenzione Regolare {#regular-maintenance-tasks}

1. **Monitora lo spazio su disco**: `df -h`
2. **Controlla lo stato dei servizi**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Rivedi i log**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Aggiorna i pacchetti di sistema**: `apt update && apt upgrade`
5. **Rinnova i certificati**: I certificati si rinnovano automaticamente, ma monitora la scadenza

### Rinnovo dei Certificati {#certificate-renewal}

I certificati dovrebbero rinnovarsi automaticamente, ma puoi rinnovarli manualmente se necessario:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Risoluzione dei Problemi {#troubleshooting}

### Problemi Comuni {#common-issues}

#### 1. Il Servizio Docker Non Si Avvia {#1-docker-service-wont-start}

```bash
# Controlla lo stato di Docker
systemctl status docker

# Prova un avvio alternativo
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Fallimento nella Generazione del Certificato {#2-certificate-generation-fails}

* Assicurati che le porte 80 e 443 siano accessibili
* Verifica che i record DNS puntino al tuo server
* Controlla le impostazioni del firewall

#### 3. Problemi di Consegna Email {#3-email-delivery-issues}

* Verifica che i record MX siano corretti
* Controlla i record SPF, DKIM e DMARC
* Assicurati che la porta 25 non sia bloccata dal tuo provider di hosting

#### 4. Interfaccia Web Non Accessibile {#4-web-interface-not-accessible}

* Controlla le impostazioni del firewall: `ufw status`
* Verifica i certificati SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Controlla le credenziali di autenticazione base

### Ottenere Aiuto {#getting-help}

* **Documentazione**: <https://forwardemail.net/self-hosted>
* **Problemi su GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Supporto della Comunità**: Consulta le discussioni su GitHub del progetto


## Best Practice di Sicurezza {#security-best-practices}

1. **Mantieni il Sistema Aggiornato**: Aggiorna regolarmente Ubuntu e i pacchetti
2. **Monitora i Log**: Configura il monitoraggio e gli avvisi dei log
3. **Esegui Backup Regolari**: Testa le procedure di backup e ripristino
4. **Usa Password Forti**: Genera password robuste per tutti gli account
5. **Abilita Fail2Ban**: Considera l’installazione di fail2ban per una sicurezza aggiuntiva
6. **Audit di Sicurezza Regolari**: Rivedi periodicamente la tua configurazione


## Conclusione {#conclusion}

La tua installazione self-hosted di Forward Email dovrebbe ora essere completa e funzionante su Ubuntu. Ricorda di:

1. Configurare correttamente i record DNS
2. Testare l’invio e la ricezione delle email
3. Impostare backup regolari
4. Monitorare regolarmente il sistema
5. Mantenere aggiornata l’installazione

Per opzioni di configurazione aggiuntive e funzionalità avanzate, consulta la documentazione ufficiale di Forward Email su <https://forwardemail.net/self-hosted#configuration>.
