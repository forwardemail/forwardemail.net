# Forward Email Selvhosting Installasjonsveiledning for Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Forutsetninger](#prerequisites)
* [Systemkrav](#system-requirements)
* [Trinnvis Installasjon](#step-by-step-installation)
  * [Trinn 1: Initial Systemoppsett](#step-1-initial-system-setup)
  * [Trinn 2: Konfigurer DNS-resolvere](#step-2-configure-dns-resolvers)
  * [Trinn 3: Installer Systemavhengigheter](#step-3-install-system-dependencies)
  * [Trinn 4: Installer Snap-pakker](#step-4-install-snap-packages)
  * [Trinn 5: Installer Docker](#step-5-install-docker)
  * [Trinn 6: Konfigurer Docker-tjeneste](#step-6-configure-docker-service)
  * [Trinn 7: Konfigurer Brannmur](#step-7-configure-firewall)
  * [Trinn 8: Klon Forward Email Repository](#step-8-clone-forward-email-repository)
  * [Trinn 9: Sett opp Miljøkonfigurasjon](#step-9-set-up-environment-configuration)
  * [Trinn 10: Konfigurer Ditt Domene](#step-10-configure-your-domain)
  * [Trinn 11: Generer SSL-sertifikater](#step-11-generate-ssl-certificates)
  * [Trinn 12: Generer Krypteringsnøkler](#step-12-generate-encryption-keys)
  * [Trinn 13: Oppdater SSL-stier i Konfigurasjonen](#step-13-update-ssl-paths-in-configuration)
  * [Trinn 14: Sett opp Grunnleggende Autentisering](#step-14-set-up-basic-authentication)
  * [Trinn 15: Distribuer med Docker Compose](#step-15-deploy-with-docker-compose)
  * [Trinn 16: Verifiser Installasjonen](#step-16-verify-installation)
* [Konfigurasjon etter Installasjon](#post-installation-configuration)
  * [Oppsett av DNS-poster](#dns-records-setup)
  * [Første Innlogging](#first-login)
* [Backup-konfigurasjon](#backup-configuration)
  * [Sett opp S3-kompatibel Backup](#set-up-s3-compatible-backup)
  * [Sett opp Backup Cron-jobber](#set-up-backup-cron-jobs)
* [Auto-oppdateringskonfigurasjon](#auto-update-configuration)
* [Vedlikehold og Overvåking](#maintenance-and-monitoring)
  * [Logglokasjoner](#log-locations)
  * [Regelmessige Vedlikeholdsoppgaver](#regular-maintenance-tasks)
  * [Fornyelse av Sertifikater](#certificate-renewal)
* [Feilsøking](#troubleshooting)
  * [Vanlige Problemer](#common-issues)
  * [Få Hjelp](#getting-help)
* [Sikkerhets Beste Praksis](#security-best-practices)
* [Konklusjon](#conclusion)


## Oversikt {#overview}

Denne veiledningen gir trinnvise instruksjoner for å installere Forward Emails selvhostede løsning på Ubuntu-systemer. Veiledningen er spesielt tilpasset Ubuntu 20.04, 22.04 og 24.04 LTS-versjoner.


## Forutsetninger {#prerequisites}

Før du begynner installasjonen, sørg for at du har:

* **Ubuntu Server**: 20.04, 22.04 eller 24.04 LTS
* **Root-tilgang**: Du må kunne kjøre kommandoer som root (sudo-tilgang)
* **Domenenavn**: Et domene du kontrollerer med DNS-administrasjonstilgang
* **Rent Servermiljø**: Anbefales å bruke en fersk Ubuntu-installasjon
* **Internett-tilkobling**: Nødvendig for nedlasting av pakker og Docker-images


## Systemkrav {#system-requirements}

* **RAM**: Minimum 2GB (4GB anbefalt for produksjon)
* **Lagring**: Minimum 20GB ledig plass (50GB+ anbefalt for produksjon)
* **CPU**: 1 vCPU minimum (2+ vCPU anbefalt for produksjon)
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

### Trinn 2: Konfigurer DNS-resolvere {#step-2-configure-dns-resolvers}

Konfigurer systemet ditt til å bruke Cloudflares DNS-servere for pålitelig sertifikatgenerering:

```bash
# Stopp og deaktiver systemd-resolved hvis den kjører
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

Installer de nødvendige pakkene for Forward Email:

```bash
# Oppdater pakkelisten
apt-get update -y

# Installer grunnleggende avhengigheter
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Step 4: Installer Snap-pakker {#step-4-install-snap-packages}

Installer AWS CLI og Certbot via snap:

```bash
# Installer AWS CLI
snap install aws-cli --classic

# Installer Certbot og DNS-plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: Installer Docker {#step-5-install-docker}

Installer Docker CE og Docker Compose:

```bash
# Legg til Dockers offisielle GPG-nøkkel
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Legg til Docker-repositoriet
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Oppdater pakkelisten og installer Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verifiser Docker-installasjonen
docker --version
docker compose version
```

### Step 6: Konfigurer Docker-tjenesten {#step-6-configure-docker-service}

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

### Step 7: Konfigurer brannmur {#step-7-configure-firewall}

Sett opp UFW-brannmur for å sikre serveren din:

```bash
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

### Step 8: Klon Forward Email-repositoriet {#step-8-clone-forward-email-repository}

Last ned kildekoden til Forward Email:

```bash
# Sett opp variabler
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Klon repositoriet
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verifiser at kloningen var vellykket
ls -la
```

### Step 9: Sett opp miljøkonfigurasjon {#step-9-set-up-environment-configuration}

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

### Step 10: Konfigurer domenet ditt {#step-10-configure-your-domain}

Sett domenenavnet ditt og oppdater miljøvariablene:

```bash
# Erstatt 'yourdomain.com' med ditt faktiske domene
DOMAIN="yourdomain.com"

# Funksjon for å oppdatere miljøfilen
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
### Trinn 11: Generer SSL-sertifikater {#step-11-generate-ssl-certificates}

#### Alternativ A: Manuell DNS-utfordring (Anbefalt for de fleste brukere) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generer sertifikater ved bruk av manuell DNS-utfordring
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Viktig**: Når du blir bedt om det, må du opprette TXT-poster i DNS-en din. Du kan se flere utfordringer for samme domene - **opprett ALLE**. Ikke fjern den første TXT-posten når du legger til den andre.

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

### Trinn 12: Generer krypteringsnøkler {#step-12-generate-encryption-keys}

Opprett de ulike krypteringsnøklene som kreves for sikker drift:

```bash
# Generer hjelpe-krypteringsnøkkel
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generer SRS-hemmelighet for e-postvideresending
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

### Trinn 13: Oppdater SSL-stier i konfigurasjonen {#step-13-update-ssl-paths-in-configuration}

Konfigurer SSL-sertifikatstiene i miljøfilen:

```bash
# Oppdater SSL-stier til å peke til riktige sertifikatfiler
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Trinn 14: Sett opp grunnleggende autentisering {#step-14-set-up-basic-authentication}

Opprett midlertidige legitimasjoner for grunnleggende autentisering:

```bash
# Generer et sikkert tilfeldig passord
PASSWORD=$(openssl rand -base64 16)

# Oppdater miljøfilen med legitimasjon for grunnleggende autentisering
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Vis legitimasjon (lagre disse!)
echo ""
echo "🔐 VIKTIG: Lagre disse påloggingsopplysningene!"
echo "=================================="
echo "Brukernavn: admin"
echo "Passord: $PASSWORD"
echo "=================================="
echo ""
echo "Du vil trenge disse for å få tilgang til webgrensesnittet etter installasjon."
echo ""
```

### Trinn 15: Distribuer med Docker Compose {#step-15-deploy-with-docker-compose}

Start alle Forward Email-tjenestene:

```bash
# Sett Docker Compose-filbane
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stopp eventuelle eksisterende containere
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Hent de nyeste bildene
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Start alle tjenester i frakoblet modus
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Vent et øyeblikk for at tjenestene skal starte
sleep 10

# Sjekk tjenestestatus
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Trinn 16: Verifiser installasjon {#step-16-verify-installation}

Sjekk at alle tjenester kjører riktig:

```bash
# Sjekk Docker-kontainere
docker ps

# Sjekk tjenestelogger for eventuelle feil
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Test tilkobling til webgrensesnitt
curl -I https://$DOMAIN

# Sjekk om porter lytter
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
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

Opprett DKIM DNS-post:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-post {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Første pålogging {#first-login}

1. Åpne nettleseren din og gå til `https://yourdomain.com`
2. Skriv inn grunnleggende autentiseringsinformasjon du lagret tidligere
3. Fullfør den innledende oppsettsveiviseren
4. Opprett din første e-postkonto


## Backup-konfigurasjon {#backup-configuration}

### Sett opp S3-kompatibel backup {#set-up-s3-compatible-backup}

Konfigurer automatiserte sikkerhetskopier til S3-kompatibel lagring:

```bash
# Opprett AWS-legitimasjonsmappe
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


## Auto-oppdateringskonfigurasjon {#auto-update-configuration}

Sett opp automatiske oppdateringer for din Forward Email-installasjon:

```bash
# Opprett auto-oppdateringskommando
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Legg til auto-oppdaterings cron-jobb (kjører daglig kl 01:00)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verifiser at cron-jobben ble lagt til
crontab -l
```


## Vedlikehold og overvåking {#maintenance-and-monitoring}

### Logglokasjoner {#log-locations}

* **Docker Compose-logger**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Systemlogger**: `/var/log/syslog`
* **Backup-logger**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-oppdateringslogger**: `/var/log/autoupdate.log`

### Regelmessige vedlikeholdsoppgaver {#regular-maintenance-tasks}

1. **Overvåk diskplass**: `df -h`
2. **Sjekk tjenestestatus**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Gå gjennom logger**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Oppdater systempakker**: `apt update && apt upgrade`
5. **Forny sertifikater**: Sertifikater fornyes automatisk, men overvåk utløp

### Fornyelse av sertifikater {#certificate-renewal}

Sertifikater skal fornyes automatisk, men du kan fornye manuelt om nødvendig:

```bash
# Manuell fornyelse av sertifikat
certbot renew

# Kopier fornyede sertifikater
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Start tjenester på nytt for å bruke nye sertifikater
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Feilsøking {#troubleshooting}

### Vanlige problemer {#common-issues}

#### 1. Docker-tjenesten starter ikke {#1-docker-service-wont-start}

```bash
# Sjekk Docker-status
systemctl status docker

# Prøv alternativ oppstart
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Sertifikatgenerering mislykkes {#2-certificate-generation-fails}

* Sørg for at porter 80 og 443 er tilgjengelige
* Verifiser at DNS-poster peker til serveren din
* Sjekk brannmurinnstillinger

#### 3. Problemer med e-postlevering {#3-email-delivery-issues}

* Verifiser at MX-poster er korrekte
* Sjekk SPF-, DKIM- og DMARC-poster
* Sørg for at port 25 ikke er blokkert av din hosting-leverandør

#### 4. Webgrensesnittet er ikke tilgjengelig {#4-web-interface-not-accessible}

* Sjekk brannmurinnstillinger: `ufw status`
* Verifiser SSL-sertifikater: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Sjekk grunnleggende autentiseringsinformasjon

### Få hjelp {#getting-help}

* **Dokumentasjon**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Fellesskapsstøtte**: Sjekk prosjektets GitHub-diskusjoner


## Sikkerhets beste praksis {#security-best-practices}

1. **Hold systemet oppdatert**: Oppdater Ubuntu og pakker regelmessig
2. **Overvåk logger**: Sett opp logg-overvåking og varsling
3. **Ta regelmessige sikkerhetskopier**: Test sikkerhetskopierings- og gjenopprettingsprosedyrer
4. **Bruk sterke passord**: Generer sterke passord for alle kontoer
5. **Aktiver Fail2Ban**: Vurder å installere fail2ban for ekstra sikkerhet
6. **Regelmessige sikkerhetsrevisjoner**: Gjennomgå konfigurasjonen din periodisk


## Konklusjon {#conclusion}

Din Forward Email selvhostede installasjon skal nå være fullført og kjøre på Ubuntu. Husk å:

1. Konfigurer DNS-postene dine riktig
2. Test sending og mottak av e-post
3. Sett opp regelmessige sikkerhetskopier
4. Overvåk systemet ditt jevnlig
5. Hold installasjonen oppdatert

For flere konfigurasjonsmuligheter og avanserte funksjoner, se den offisielle Forward Email-dokumentasjonen på <https://forwardemail.net/self-hosted#configuration>.
