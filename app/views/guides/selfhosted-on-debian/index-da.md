# Forward Email Selvhostet Installationsvejledning for Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [Forudsætninger](#prerequisites)
* [Systemkrav](#system-requirements)
* [Trin-for-trin Installation](#step-by-step-installation)
  * [Trin 1: Initial Systemopsætning](#step-1-initial-system-setup)
  * [Trin 2: Konfigurer DNS-resolvere](#step-2-configure-dns-resolvers)
  * [Trin 3: Installer Systemafhængigheder](#step-3-install-system-dependencies)
  * [Trin 4: Installer og Konfigurer Snapd](#step-4-install-and-configure-snapd)
  * [Trin 5: Installer Snap Pakker](#step-5-install-snap-packages)
  * [Trin 6: Installer Docker](#step-6-install-docker)
  * [Trin 7: Konfigurer Docker Service](#step-7-configure-docker-service)
  * [Trin 8: Installer og Konfigurer UFW Firewall](#step-8-install-and-configure-ufw-firewall)
  * [Trin 9: Klon Forward Email Repository](#step-9-clone-forward-email-repository)
  * [Trin 10: Opsæt Miljøkonfiguration](#step-10-set-up-environment-configuration)
  * [Trin 11: Konfigurer Dit Domæne](#step-11-configure-your-domain)
  * [Trin 12: Generer SSL Certifikater](#step-12-generate-ssl-certificates)
  * [Trin 13: Generer Krypteringsnøgler](#step-13-generate-encryption-keys)
  * [Trin 14: Opdater SSL-stier i Konfigurationen](#step-14-update-ssl-paths-in-configuration)
  * [Trin 15: Opsæt Grundlæggende Autentifikation](#step-15-set-up-basic-authentication)
  * [Trin 16: Udrul med Docker Compose](#step-16-deploy-with-docker-compose)
  * [Trin 17: Verificer Installation](#step-17-verify-installation)
* [Efter-Installation Konfiguration](#post-installation-configuration)
  * [Opsætning af DNS-poster](#dns-records-setup)
  * [Første Login](#first-login)
* [Backup Konfiguration](#backup-configuration)
  * [Opsæt S3-kompatibel Backup](#set-up-s3-compatible-backup)
  * [Opsæt Backup Cron Jobs](#set-up-backup-cron-jobs)
* [Auto-Opdaterings Konfiguration](#auto-update-configuration)
* [Debian-specifikke Overvejelser](#debian-specific-considerations)
  * [Forskelle i Pakkehåndtering](#package-management-differences)
  * [Servicehåndtering](#service-management)
  * [Netværkskonfiguration](#network-configuration)
* [Vedligeholdelse og Overvågning](#maintenance-and-monitoring)
  * [Logplaceringer](#log-locations)
  * [Regelmæssige Vedligeholdelsesopgaver](#regular-maintenance-tasks)
  * [Certifikatfornyelse](#certificate-renewal)
* [Fejlfinding](#troubleshooting)
  * [Debian-specifikke Problemer](#debian-specific-issues)
  * [Almindelige Problemer](#common-issues)
  * [Få Hjælp](#getting-help)
* [Sikkerhedsbedste Praksis](#security-best-practices)
* [Konklusion](#conclusion)


## Oversigt {#overview}

Denne vejledning giver trin-for-trin instruktioner til installation af Forward Emails selvhostede løsning på Debian-systemer. Denne vejledning er specifikt tilpasset Debian 11 (Bullseye) og Debian 12 (Bookworm).


## Forudsætninger {#prerequisites}

Før du begynder installationen, skal du sikre dig, at du har:

* **Debian Server**: Version 11 (Bullseye) eller 12 (Bookworm)
* **Root-adgang**: Du skal kunne køre kommandoer som root (sudo-adgang)
* **Domænenavn**: Et domæne, som du kontrollerer med adgang til DNS-administration
* **Ren Server**: Anbefales at bruge en frisk Debian-installation
* **Internetforbindelse**: Påkrævet for at downloade pakker og Docker-billeder


## Systemkrav {#system-requirements}

* **RAM**: Minimum 2GB (4GB anbefales til produktion)
* **Lagerplads**: Minimum 20GB ledig plads (50GB+ anbefales til produktion)
* **CPU**: Minimum 1 vCPU (2+ vCPU anbefales til produktion)
* **Netværk**: Offentlig IP-adresse med følgende porte tilgængelige:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Trin-for-trin Installation {#step-by-step-installation}

### Trin 1: Initial Systemopsætning {#step-1-initial-system-setup}

Først skal du sikre, at dit system er opdateret, og skifte til root-bruger:

```bash
# Opdater systempakker
sudo apt update && sudo apt upgrade -y

# Skift til root-bruger (påkrævet for installationen)
sudo su -
```
### Step 2: Konfigurer DNS-resolvere {#step-2-configure-dns-resolvers}

Konfigurer dit system til at bruge Cloudflares DNS-servere for pålidelig certifikatgenerering:

```bash
# Stop og deaktiver systemd-resolved hvis det kører
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Konfigurer Cloudflare DNS-resolvere
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

### Step 3: Installer systemafhængigheder {#step-3-install-system-dependencies}

Installer de nødvendige pakker til Forward Email på Debian:

```bash
# Opdater pakkelisten
apt-get update -y

# Installer grundlæggende afhængigheder (Debian-specifik pakkeliste)
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

### Step 4: Installer og konfigurer Snapd {#step-4-install-and-configure-snapd}

Debian inkluderer ikke snapd som standard, så vi skal installere og konfigurere det:

```bash
# Installer snapd
apt-get install -y snapd

# Aktiver og start snapd-tjenesten
systemctl enable snapd
systemctl start snapd

# Opret symlink for at snap kan fungere korrekt
ln -sf /var/lib/snapd/snap /snap

# Vent på at snapd er klar
sleep 10

# Bekræft at snapd fungerer
snap version
```

### Step 5: Installer Snap-pakker {#step-5-install-snap-packages}

Installer AWS CLI og Certbot via snap:

```bash
# Installer AWS CLI
snap install aws-cli --classic

# Installer Certbot og DNS-plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Bekræft installationerne
aws --version
certbot --version
```

### Step 6: Installer Docker {#step-6-install-docker}

Installer Docker CE og Docker Compose på Debian:

```bash
# Tilføj Dockers officielle GPG-nøgle (Debian-specifik)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Tilføj Docker repository (Debian-specifik)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Opdater pakkeindeks og installer Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installer standalone docker-compose som fallback (hvis plugin ikke virker)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Bekræft Docker-installation
docker --version
docker compose version || docker-compose --version
```

### Step 7: Konfigurer Docker-tjenesten {#step-7-configure-docker-service}

Sørg for at Docker starter automatisk og kører:

```bash
# Aktiver og start Docker-tjenesten
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Bekræft at Docker kører
docker info
```

Hvis Docker ikke starter, prøv at starte det manuelt:

```bash
# Alternativ opstartsmåde hvis systemctl fejler
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Installer og konfigurer UFW-firewall {#step-8-install-and-configure-ufw-firewall}

Debian minimalinstallationer inkluderer måske ikke UFW, så installer det først:

```bash
# Installer UFW hvis det ikke er til stede
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Sæt standardpolitikker
ufw default deny incoming
ufw default allow outgoing

# Tillad SSH (vigtigt - lås dig ikke ude!)
ufw allow 22/tcp

# Tillad e-mail-relaterede porte
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (til Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternativ port)
ufw allow 2995/tcp  # POP3 (alternativ port)
ufw allow 3456/tcp  # Tilpasset serviceport
ufw allow 4000/tcp  # Tilpasset serviceport
ufw allow 5000/tcp  # Tilpasset serviceport

# Tillad lokale databaseforbindelser
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Aktiver firewall
echo "y" | ufw enable

# Tjek firewall-status
ufw status numbered
```
### Trin 9: Klon Forward Email Repository {#step-9-clone-forward-email-repository}

Download Forward Email kildekoden:

```bash
# Opsæt variabler
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Klon repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Bekræft at kloningen var succesfuld
ls -la
```

### Trin 10: Opsæt Miljøkonfiguration {#step-10-set-up-environment-configuration}

Forbered miljøkonfigurationen:

```bash
# Opsæt mappevariabler
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopiér standard miljøfil
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Opret SSL-mappe
mkdir -p "$SELF_HOST_DIR/ssl"

# Opret database-mapper
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Trin 11: Konfigurer Dit Domæne {#step-11-configure-your-domain}

Angiv dit domænenavn og opdater miljøvariabler:

```bash
# Erstat 'yourdomain.com' med dit faktiske domæne
DOMAIN="yourdomain.com"

# Funktion til at opdatere miljøfil
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Opdater domænerelaterede miljøvariabler
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

### Trin 12: Generer SSL-certifikater {#step-12-generate-ssl-certificates}

#### Mulighed A: Manuel DNS-udfordring (Anbefales til de fleste brugere) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generer certifikater ved hjælp af manuel DNS-udfordring
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Vigtigt**: Når du bliver bedt om det, skal du oprette TXT-poster i din DNS. Du kan se flere udfordringer for samme domæne – **opret ALLE**. Fjern ikke den første TXT-post, når du tilføjer den anden.

#### Mulighed B: Cloudflare DNS (Hvis du bruger Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Hvis dit domæne bruger Cloudflare til DNS, kan du automatisere certifikatgenereringen:

```bash
# Opret Cloudflare legitimationsfil
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Sæt korrekte tilladelser
chmod 600 /root/.cloudflare.ini

# Generer certifikater automatisk
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Kopiér Certifikater {#copy-certificates}

Efter certifikatgenerering, kopier dem til applikationsmappen:

```bash
# Kopiér certifikater til applikationens SSL-mappe
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Bekræft certifikaterne blev kopieret
ls -la "$SELF_HOST_DIR/ssl/"
```

### Trin 13: Generer Krypteringsnøgler {#step-13-generate-encryption-keys}

Opret de forskellige krypteringsnøgler, der kræves for sikker drift:

```bash
# Generer hjælper-krypteringsnøgle
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generer SRS hemmelighed til email videresendelse
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generer TXT krypteringsnøgle
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generer DKIM privat nøgle til email signering
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generer webhook signaturnøgle
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Sæt SMTP transport password
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Alle krypteringsnøgler er genereret succesfuldt"
```
### Step 14: Opdater SSL-stier i konfigurationen {#step-14-update-ssl-paths-in-configuration}

Konfigurer SSL-certifikatstierne i miljøfilen:

```bash
# Opdater SSL-stier til at pege på de korrekte certifikatfiler
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Opsæt grundlæggende godkendelse {#step-15-set-up-basic-authentication}

Opret midlertidige legitimationsoplysninger til grundlæggende godkendelse:

```bash
# Generer en sikker tilfældig adgangskode
PASSWORD=$(openssl rand -base64 16)

# Opdater miljøfilen med grundlæggende godkendelsesoplysninger
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Vis legitimationsoplysningerne (gem dem!)
echo ""
echo "🔐 VIGTIGT: Gem disse loginoplysninger!"
echo "=================================="
echo "Brugernavn: admin"
echo "Adgangskode: $PASSWORD"
echo "=================================="
echo ""
echo "Du får brug for disse for at få adgang til webgrænsefladen efter installation."
echo ""
```

### Step 16: Udrul med Docker Compose {#step-16-deploy-with-docker-compose}

Start alle Forward Email-tjenester:

```bash
# Angiv sti til Docker Compose-fil
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop eventuelle eksisterende containere
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Hent de nyeste billeder
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Start alle tjenester i detached mode
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Vent et øjeblik på at tjenesterne starter
sleep 10

# Tjek tjenestestatus
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Step 17: Bekræft installation {#step-17-verify-installation}

Kontroller at alle tjenester kører korrekt:

```bash
# Tjek Docker-containere
docker ps

# Tjek tjenestelogs for fejl
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Test forbindelse til webgrænsefladen
curl -I https://$DOMAIN

# Tjek om porte lytter
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Post-installationskonfiguration {#post-installation-configuration}

### Opsætning af DNS-poster {#dns-records-setup}

Du skal konfigurere følgende DNS-poster for dit domæne:

#### MX-post {#mx-record}

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

#### SPF-post {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-post {#dkim-record}

Hent din DKIM offentlige nøgle:

```bash
# Udtræk DKIM offentlig nøgle
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Opret DKIM DNS-post:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-post {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Første login {#first-login}

1. Åbn din webbrowser og gå til `https://yourdomain.com`
2. Indtast de grundlæggende godkendelsesoplysninger, du gemte tidligere
3. Fuldfør den indledende opsætningsguide
4. Opret din første emailkonto


## Backup-konfiguration {#backup-configuration}

### Opsæt S3-kompatibel backup {#set-up-s3-compatible-backup}

Konfigurer automatiserede backups til S3-kompatibel lagring:

```bash
# Opret AWS legitimationsmappe
mkdir -p ~/.aws

# Konfigurer AWS legitimationsoplysninger
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Konfigurer AWS indstillinger
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# For ikke-AWS S3 (som Cloudflare R2), tilføj endpoint URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Opsæt Backup Cron Jobs {#set-up-backup-cron-jobs}

```bash
# Gør backup scripts eksekverbare
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Tilføj MongoDB backup cron job (kører dagligt ved midnat)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Tilføj Redis backup cron job (kører dagligt ved midnat)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Bekræft at cron jobs blev tilføjet
crontab -l
```


## Automatisk Opdateringskonfiguration {#auto-update-configuration}

Opsæt automatiske opdateringer for din Forward Email installation:

```bash
# Opret auto-opdateringskommando (brug passende docker compose kommando)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Tilføj auto-opdaterings cron job (kører dagligt kl. 1)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Bekræft at cron job blev tilføjet
crontab -l
```


## Debian-Specifikke Overvejelser {#debian-specific-considerations}

### Forskelle i Pakkehåndtering {#package-management-differences}

* **Snapd**: Ikke installeret som standard på Debian, kræver manuel installation
* **Docker**: Bruger Debian-specifikke repositories og GPG-nøgler
* **UFW**: Kan mangle i minimale Debian installationer
* **systemd**: Adfærd kan variere en smule fra Ubuntu

### Servicehåndtering {#service-management}

```bash
# Tjek service status (Debian-specifikke kommandoer)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Genstart services hvis nødvendigt
systemctl restart snapd
systemctl restart docker
```

### Netværkskonfiguration {#network-configuration}

Debian kan have forskellige netværksinterface-navne eller konfigurationer:

```bash
# Tjek netværksinterfaces
ip addr show

# Tjek routing
ip route show

# Tjek DNS-opløsning
nslookup google.com
```


## Vedligeholdelse og Overvågning {#maintenance-and-monitoring}

### Logplaceringer {#log-locations}

* **Docker Compose logs**: Brug passende docker compose kommando baseret på installation
* **Systemlogs**: `/var/log/syslog`
* **Backup logs**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-opdateringslogs**: `/var/log/autoupdate.log`
* **Snapd logs**: `journalctl -u snapd`

### Regelmæssige Vedligeholdelsesopgaver {#regular-maintenance-tasks}

1. **Overvåg diskplads**: `df -h`
2. **Tjek service status**: Brug passende docker compose kommando
3. **Gennemgå logs**: Tjek både applikations- og systemlogs
4. **Opdater systempakker**: `apt update && apt upgrade`
5. **Overvåg snapd**: `snap list` og `snap refresh`

### Certifikatfornyelse {#certificate-renewal}

Certifikater bør fornyes automatisk, men du kan manuelt forny hvis nødvendigt:

```bash
# Manuel certifikatfornyelse
certbot renew

# Kopiér fornyede certifikater
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Genstart services for at bruge nye certifikater
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Fejlfinding {#troubleshooting}

### Debian-Specifikke Problemer {#debian-specific-issues}

#### 1. Snapd Virker Ikke {#1-snapd-not-working}

```bash
# Tjek snapd status
systemctl status snapd

# Genstart snapd
systemctl restart snapd

# Tjek snap sti
echo $PATH | grep snap

# Tilføj snap til PATH hvis mangler
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose Kommando Ikke Fundet {#2-docker-compose-command-not-found}

```bash
# Tjek hvilken docker compose kommando der er tilgængelig
command -v docker-compose
command -v docker

# Brug den passende kommando i scripts
if command -v docker-compose &> /dev/null; then
    echo "Bruger docker-compose"
else
    echo "Bruger docker compose"
fi
```
#### 3. Problemer med Pakkeinstallation {#3-package-installation-issues}

```bash
# Opdater pakkecache
apt update

# Ret ødelagte pakker
apt --fix-broken install

# Tjek for holdte pakker
apt-mark showhold
```

### Almindelige Problemer {#common-issues}

#### 1. Docker Service Starter Ikke {#1-docker-service-wont-start}

```bash
# Tjek Docker status
systemctl status docker

# Tjek Docker logs
journalctl -u docker

# Prøv alternativ opstart
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certifikatgenerering Fejler {#2-certificate-generation-fails}

* Sørg for at porte 80 og 443 er tilgængelige
* Bekræft at DNS-poster peger på din server
* Tjek firewall-indstillinger med `ufw status`

#### 3. Problemer med E-mail Levering {#3-email-delivery-issues}

* Bekræft at MX-poster er korrekte
* Tjek SPF, DKIM og DMARC-poster
* Sørg for at port 25 ikke er blokeret af din hostingudbyder

### Få Hjælp {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian Dokumentation**: <https://www.debian.org/doc/>


## Sikkerhedsbedste Praksis {#security-best-practices}

1. **Hold Systemet Opdateret**: Opdater regelmæssigt Debian og pakker
2. **Overvåg Logs**: Opsæt logovervågning og alarmering
3. **Backup Regelmæssigt**: Test backup- og gendannelsesprocedurer
4. **Brug Stærke Adgangskoder**: Generer stærke adgangskoder til alle konti
5. **Aktivér Fail2Ban**: Overvej at installere fail2ban for ekstra sikkerhed
6. **Regelmæssige Sikkerhedsrevisioner**: Gennemgå din konfiguration periodisk
7. **Overvåg Snapd**: Hold snap-pakker opdaterede med `snap refresh`


## Konklusion {#conclusion}

Din Forward Email selvhostede installation bør nu være færdig og kørende på Debian. Husk at:

1. Konfigurere dine DNS-poster korrekt
2. Teste afsendelse og modtagelse af e-mails
3. Opsætte regelmæssige backups
4. Overvåge dit system regelmæssigt
5. Holde din installation opdateret
6. Overvåge snapd og snap-pakker

De største forskelle fra Ubuntu er snapd-installationen og konfigurationen af Docker-repositoriet. Når disse er korrekt opsat, opfører Forward Email-applikationen sig ens på begge systemer.

For yderligere konfigurationsmuligheder og avancerede funktioner, se den officielle Forward Email dokumentation på <https://forwardemail.net/self-hosted#configuration>.
