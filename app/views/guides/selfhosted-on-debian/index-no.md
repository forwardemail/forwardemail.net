# Forward Email Selvhosting Installasjonsveiledning for Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Forutsetninger](#prerequisites)
* [Systemkrav](#system-requirements)
* [Trinnvis Installasjon](#step-by-step-installation)
  * [Trinn 1: Initial Systemoppsett](#step-1-initial-system-setup)
  * [Trinn 2: Konfigurer DNS-resolvere](#step-2-configure-dns-resolvers)
  * [Trinn 3: Installer Systemavhengigheter](#step-3-install-system-dependencies)
  * [Trinn 4: Installer og Konfigurer Snapd](#step-4-install-and-configure-snapd)
  * [Trinn 5: Installer Snap-pakker](#step-5-install-snap-packages)
  * [Trinn 6: Installer Docker](#step-6-install-docker)
  * [Trinn 7: Konfigurer Docker-tjeneste](#step-7-configure-docker-service)
  * [Trinn 8: Installer og Konfigurer UFW-brannmur](#step-8-install-and-configure-ufw-firewall)
  * [Trinn 9: Klon Forward Email Repository](#step-9-clone-forward-email-repository)
  * [Trinn 10: Sett Opp Miljøkonfigurasjon](#step-10-set-up-environment-configuration)
  * [Trinn 11: Konfigurer Ditt Domene](#step-11-configure-your-domain)
  * [Trinn 12: Generer SSL-sertifikater](#step-12-generate-ssl-certificates)
  * [Trinn 13: Generer Krypteringsnøkler](#step-13-generate-encryption-keys)
  * [Trinn 14: Oppdater SSL-stier i Konfigurasjonen](#step-14-update-ssl-paths-in-configuration)
  * [Trinn 15: Sett Opp Grunnleggende Autentisering](#step-15-set-up-basic-authentication)
  * [Trinn 16: Distribuer med Docker Compose](#step-16-deploy-with-docker-compose)
  * [Trinn 17: Verifiser Installasjonen](#step-17-verify-installation)
* [Etter-Installasjonskonfigurasjon](#post-installation-configuration)
  * [Oppsett av DNS-poster](#dns-records-setup)
  * [Første Innlogging](#first-login)
* [Backup-konfigurasjon](#backup-configuration)
  * [Sett Opp S3-kompatibel Backup](#set-up-s3-compatible-backup)
  * [Sett Opp Backup Cron-jobber](#set-up-backup-cron-jobs)
* [Auto-oppdateringskonfigurasjon](#auto-update-configuration)
* [Debian-spesifikke Betraktninger](#debian-specific-considerations)
  * [Forskjeller i Pakkehåndtering](#package-management-differences)
  * [Tjenesteadministrasjon](#service-management)
  * [Nettverkskonfigurasjon](#network-configuration)
* [Vedlikehold og Overvåking](#maintenance-and-monitoring)
  * [Logglokasjoner](#log-locations)
  * [Regelmessige Vedlikeholdsoppgaver](#regular-maintenance-tasks)
  * [Fornyelse av Sertifikater](#certificate-renewal)
* [Feilsøking](#troubleshooting)
  * [Debian-spesifikke Problemer](#debian-specific-issues)
  * [Vanlige Problemer](#common-issues)
  * [Få Hjelp](#getting-help)
* [Sikkerhets Beste Praksis](#security-best-practices)
* [Konklusjon](#conclusion)


## Oversikt {#overview}

Denne veiledningen gir trinnvise instruksjoner for å installere Forward Emails selvhostede løsning på Debian-systemer. Veiledningen er spesielt tilpasset Debian 11 (Bullseye) og Debian 12 (Bookworm).


## Forutsetninger {#prerequisites}

Før du begynner installasjonen, sørg for at du har:

* **Debian-server**: Versjon 11 (Bullseye) eller 12 (Bookworm)
* **Root-tilgang**: Du må kunne kjøre kommandoer som root (sudo-tilgang)
* **Domenenavn**: Et domene du kontrollerer med DNS-administrasjonstilgang
* **Ren Server**: Anbefales å bruke en fersk Debian-installasjon
* **Internett-tilkobling**: Kreves for nedlasting av pakker og Docker-images


## Systemkrav {#system-requirements}

* **RAM**: Minimum 2GB (4GB anbefalt for produksjon)
* **Lagring**: Minimum 20GB ledig plass (50GB+ anbefalt for produksjon)
* **CPU**: Minimum 1 vCPU (2+ vCPU anbefalt for produksjon)
* **Nettverk**: Offentlig IP-adresse med følgende porter tilgjengelige:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Trinnvis Installasjon {#step-by-step-installation}

### Trinn 1: Initial Systemoppsett {#step-1-initial-system-setup}

Først, sørg for at systemet ditt er oppdatert og bytt til root-bruker:

```bash
# Oppdater systempakker
sudo apt update && sudo apt upgrade -y

# Bytt til root-bruker (kreves for installasjonen)
sudo su -
```
### Step 2: Konfigurer DNS-resolvere {#step-2-configure-dns-resolvers}

Konfigurer systemet ditt til å bruke Cloudflares DNS-servere for pålitelig sertifikatgenerering:

```bash
# Stopp og deaktiver systemd-resolved hvis det kjører
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

### Step 3: Installer systemavhengigheter {#step-3-install-system-dependencies}

Installer nødvendige pakker for Forward Email på Debian:

```bash
# Oppdater pakkelisten
apt-get update -y

# Installer grunnleggende avhengigheter (Debian-spesifikk pakkeliste)
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

Debian inkluderer ikke snapd som standard, så vi må installere og konfigurere det:

```bash
# Installer snapd
apt-get install -y snapd

# Aktiver og start snapd-tjenesten
systemctl enable snapd
systemctl start snapd

# Lag symlink for at snap skal fungere riktig
ln -sf /var/lib/snapd/snap /snap

# Vent til snapd er klar
sleep 10

# Verifiser at snapd fungerer
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

# Verifiser installasjonene
aws --version
certbot --version
```

### Step 6: Installer Docker {#step-6-install-docker}

Installer Docker CE og Docker Compose på Debian:

```bash
# Legg til Dockers offisielle GPG-nøkkel (Debian-spesifikk)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Legg til Docker-repositoriet (Debian-spesifikk)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Oppdater pakkelisten og installer Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installer frittstående docker-compose som fallback (hvis plugin ikke fungerer)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verifiser Docker-installasjonen
docker --version
docker compose version || docker-compose --version
```

### Step 7: Konfigurer Docker-tjenesten {#step-7-configure-docker-service}

Sørg for at Docker starter automatisk og kjører:

```bash
# Aktiver og start Docker-tjenesten
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verifiser at Docker kjører
docker info
```

Hvis Docker ikke starter, prøv å starte den manuelt:

```bash
# Alternativ oppstartsmåte hvis systemctl feiler
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Installer og konfigurer UFW-brannmur {#step-8-install-and-configure-ufw-firewall}

Debian minimalinstallasjoner inkluderer kanskje ikke UFW, så installer det først:

```bash
# Installer UFW hvis det ikke er tilstede
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Sett standardregler
ufw default deny incoming
ufw default allow outgoing

# Tillat SSH (viktig - ikke lås deg ute!)
ufw allow 22/tcp

# Tillat e-postrelaterte porter
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (for Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternativ port)
ufw allow 2995/tcp  # POP3 (alternativ port)
ufw allow 3456/tcp  # Egendefinert tjenesteport
ufw allow 4000/tcp  # Egendefinert tjenesteport
ufw allow 5000/tcp  # Egendefinert tjenesteport

# Tillat lokale databaseforbindelser
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Aktiver brannmuren
echo "y" | ufw enable

# Sjekk brannmurstatus
ufw status numbered
```
### Step 9: Klon Forward Email Repository {#step-9-clone-forward-email-repository}

Last ned kildekoden til Forward Email:

```bash
# Sett opp variabler
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Klon repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verifiser at kloningen var vellykket
ls -la
```

### Step 10: Sett opp miljøkonfigurasjon {#step-10-set-up-environment-configuration}

Forbered miljøkonfigurasjonen:

```bash
# Sett opp katalogvariabler
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopier standard miljøfil
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Opprett SSL-katalog
mkdir -p "$SELF_HOST_DIR/ssl"

# Opprett databasekataloger
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 11: Konfigurer ditt domene {#step-11-configure-your-domain}

Sett ditt domenenavn og oppdater miljøvariablene:

```bash
# Erstatt 'yourdomain.com' med ditt faktiske domene
DOMAIN="yourdomain.com"

# Funksjon for å oppdatere miljøfil
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Oppdater domenerelaterte miljøvariabler
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

### Step 12: Generer SSL-sertifikater {#step-12-generate-ssl-certificates}

#### Alternativ A: Manuell DNS-utfordring (Anbefalt for de fleste brukere) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generer sertifikater med manuell DNS-utfordring
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Viktig**: Når du blir bedt om det, må du opprette TXT-poster i DNS-en din. Du kan se flere utfordringer for samme domene – **opprett ALLE**. Ikke fjern den første TXT-posten når du legger til den andre.

#### Alternativ B: Cloudflare DNS (Hvis du bruker Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Hvis domenet ditt bruker Cloudflare for DNS, kan du automatisere sertifikatgenereringen:

```bash
# Opprett Cloudflare-legitimasjonsfil
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Sett riktige tillatelser
chmod 600 /root/.cloudflare.ini

# Generer sertifikater automatisk
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

Etter sertifikatgenerering, kopier dem til applikasjonskatalogen:

```bash
# Kopier sertifikater til applikasjonens SSL-katalog
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verifiser at sertifikatene ble kopiert
ls -la "$SELF_HOST_DIR/ssl/"
```

### Step 13: Generer krypteringsnøkler {#step-13-generate-encryption-keys}

Lag de ulike krypteringsnøklene som kreves for sikker drift:

```bash
# Generer hjelpe-krypteringsnøkkel
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generer SRS-secret for e-postvideresending
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generer TXT-krypteringsnøkkel
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generer DKIM privatnøkkel for e-postsignering
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generer webhook signaturnøkkel
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Sett SMTP transportpassord
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Alle krypteringsnøkler generert med suksess"
```
### Step 14: Oppdater SSL-stier i konfigurasjonen {#step-14-update-ssl-paths-in-configuration}

Konfigurer SSL-sertifikatstiene i miljøfilen:

```bash
# Oppdater SSL-stier til å peke til riktige sertifikatfiler
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Sett opp grunnleggende autentisering {#step-15-set-up-basic-authentication}

Lag midlertidige grunnleggende autentiseringslegitimasjoner:

```bash
# Generer et sikkert tilfeldig passord
PASSWORD=$(openssl rand -base64 16)

# Oppdater miljøfilen med grunnleggende autentiseringslegitimasjoner
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Vis legitimasjonene (lagre disse!)
echo ""
echo "🔐 VIKTIG: Lagre disse påloggingsopplysningene!"
echo "=================================="
echo "Brukernavn: admin"
echo "Passord: $PASSWORD"
echo "=================================="
echo ""
echo "Du trenger disse for å få tilgang til webgrensesnittet etter installasjonen."
echo ""
```

### Step 16: Distribuer med Docker Compose {#step-16-deploy-with-docker-compose}

Start alle Forward Email-tjenestene:

```bash
# Sett Docker Compose-filbane
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stopp eventuelle eksisterende containere
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Hent de nyeste bildene
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Start alle tjenester i frakoblet modus
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Vent et øyeblikk for at tjenestene skal starte
sleep 10

# Sjekk tjenestestatus
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Step 17: Verifiser installasjonen {#step-17-verify-installation}

Sjekk at alle tjenester kjører korrekt:

```bash
# Sjekk Docker-containere
docker ps

# Sjekk tjenestelogger for eventuelle feil
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Test tilkobling til webgrensesnittet
curl -I https://$DOMAIN

# Sjekk om porter lytter
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Konfigurasjon etter installasjon {#post-installation-configuration}

### Oppsett av DNS-poster {#dns-records-setup}

Du må konfigurere følgende DNS-poster for domenet ditt:

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

Hent din DKIM offentlige nøkkel:

```bash
# Ekstraher DKIM offentlig nøkkel
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Lag DKIM DNS-post:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-post {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Første pålogging {#first-login}

1. Åpne nettleseren din og gå til `https://yourdomain.com`
2. Skriv inn de grunnleggende autentiseringslegitimasjonene du lagret tidligere
3. Fullfør den innledende oppsettsveiviseren
4. Opprett din første e-postkonto


## Backup-konfigurasjon {#backup-configuration}

### Sett opp S3-kompatibel backup {#set-up-s3-compatible-backup}

Konfigurer automatiserte sikkerhetskopier til S3-kompatibel lagring:

```bash
# Lag AWS-legitimasjonskatalog
mkdir -p ~/.aws

# Konfigurer AWS-legitimasjon
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Konfigurer AWS-innstillinger
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# For ikke-AWS S3 (som Cloudflare R2), legg til endepunkt-URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Sett opp backup cron-jobber {#set-up-backup-cron-jobs}

```bash
# Gjør backup-skript kjørbare
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Legg til MongoDB backup cron-jobb (kjører daglig ved midnatt)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Legg til Redis backup cron-jobb (kjører daglig ved midnatt)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verifiser at cron-jobbene ble lagt til
crontab -l
```


## Automatisk oppdateringskonfigurasjon {#auto-update-configuration}

Sett opp automatiske oppdateringer for din Forward Email-installasjon:

```bash
# Lag auto-oppdateringskommando (bruk passende docker compose-kommando)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Legg til auto-oppdaterings cron-jobb (kjører daglig kl 01:00)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verifiser at cron-jobben ble lagt til
crontab -l
```


## Debian-spesifikke hensyn {#debian-specific-considerations}

### Forskjeller i pakkebehandling {#package-management-differences}

* **Snapd**: Ikke installert som standard på Debian, krever manuell installasjon
* **Docker**: Bruker Debian-spesifikke repositorier og GPG-nøkler
* **UFW**: Kan mangle i minimale Debian-installasjoner
* **systemd**: Atferd kan avvike noe fra Ubuntu

### Tjenesteadministrasjon {#service-management}

```bash
# Sjekk tjenestestatus (Debian-spesifikke kommandoer)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Start tjenester på nytt om nødvendig
systemctl restart snapd
systemctl restart docker
```

### Nettverkskonfigurasjon {#network-configuration}

Debian kan ha andre navn på nettverksgrensesnitt eller konfigurasjoner:

```bash
# Sjekk nettverksgrensesnitt
ip addr show

# Sjekk ruting
ip route show

# Sjekk DNS-oppløsning
nslookup google.com
```


## Vedlikehold og overvåking {#maintenance-and-monitoring}

### Loggplasseringer {#log-locations}

* **Docker Compose-logger**: Bruk passende docker compose-kommando basert på installasjon
* **Systemlogger**: `/var/log/syslog`
* **Backup-logger**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-oppdateringslogger**: `/var/log/autoupdate.log`
* **Snapd-logger**: `journalctl -u snapd`

### Regelmessige vedlikeholdsoppgaver {#regular-maintenance-tasks}

1. **Overvåk diskplass**: `df -h`
2. **Sjekk tjenestestatus**: Bruk passende docker compose-kommando
3. **Gå gjennom logger**: Sjekk både applikasjons- og systemlogger
4. **Oppdater systempakker**: `apt update && apt upgrade`
5. **Overvåk snapd**: `snap list` og `snap refresh`

### Sertifikatfornyelse {#certificate-renewal}

Sertifikater skal fornys automatisk, men du kan fornye manuelt om nødvendig:

```bash
# Manuell sertifikatfornyelse
certbot renew

# Kopier fornyede sertifikater
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Start tjenester på nytt for å bruke nye sertifikater
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Feilsøking {#troubleshooting}

### Debian-spesifikke problemer {#debian-specific-issues}

#### 1. Snapd fungerer ikke {#1-snapd-not-working}

```bash
# Sjekk snapd-status
systemctl status snapd

# Start snapd på nytt
systemctl restart snapd

# Sjekk snap-path
echo $PATH | grep snap

# Legg til snap i PATH hvis mangler
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose-kommando ikke funnet {#2-docker-compose-command-not-found}

```bash
# Sjekk hvilken docker compose-kommando som er tilgjengelig
command -v docker-compose
command -v docker

# Bruk riktig kommando i skript
if command -v docker-compose &> /dev/null; then
    echo "Bruker docker-compose"
else
    echo "Bruker docker compose"
fi
```
#### 3. Problemer med pakkeinstallasjon {#3-package-installation-issues}

```bash
# Oppdater pakkekache
apt update

# Fiks ødelagte pakker
apt --fix-broken install

# Sjekk for holdte pakker
apt-mark showhold
```

### Vanlige problemer {#common-issues}

#### 1. Docker-tjenesten starter ikke {#1-docker-service-wont-start}

```bash
# Sjekk Docker-status
systemctl status docker

# Sjekk Docker-logger
journalctl -u docker

# Prøv alternativ oppstart
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Sertifikatgenerering feiler {#2-certificate-generation-fails}

* Sørg for at porter 80 og 443 er tilgjengelige
* Verifiser at DNS-poster peker til serveren din
* Sjekk brannmurinnstillinger med `ufw status`

#### 3. Problemer med e-postlevering {#3-email-delivery-issues}

* Verifiser at MX-poster er korrekte
* Sjekk SPF-, DKIM- og DMARC-poster
* Sørg for at port 25 ikke er blokkert av din hosting-leverandør

### Få hjelp {#getting-help}

* **Dokumentasjon**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian-dokumentasjon**: <https://www.debian.org/doc/>


## Sikkerhets beste praksis {#security-best-practices}

1. **Hold systemet oppdatert**: Oppdater Debian og pakker regelmessig
2. **Overvåk logger**: Sett opp logg-overvåkning og varsling
3. **Ta regelmessige sikkerhetskopier**: Test sikkerhetskopiering og gjenopprettingsprosedyrer
4. **Bruk sterke passord**: Generer sterke passord for alle kontoer
5. **Aktiver Fail2Ban**: Vurder å installere fail2ban for ekstra sikkerhet
6. **Regelmessige sikkerhetsrevisjoner**: Gjennomgå konfigurasjonen periodisk
7. **Overvåk Snapd**: Hold snap-pakker oppdatert med `snap refresh`


## Konklusjon {#conclusion}

Din Forward Email selvhostede installasjon skal nå være fullført og kjøre på Debian. Husk å:

1. Konfigurer DNS-postene dine riktig
2. Test sending og mottak av e-post
3. Sett opp regelmessige sikkerhetskopier
4. Overvåk systemet ditt jevnlig
5. Hold installasjonen oppdatert
6. Overvåk snapd og snap-pakker

De viktigste forskjellene fra Ubuntu er snapd-installasjonen og Docker-repositoriekonfigurasjonen. Når disse er riktig satt opp, oppfører Forward Email-applikasjonen seg likt på begge systemene.

For flere konfigurasjonsmuligheter og avanserte funksjoner, se den offisielle Forward Email-dokumentasjonen på <https://forwardemail.net/self-hosted#configuration>.
