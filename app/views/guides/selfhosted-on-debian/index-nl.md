# Forward Email Zelf-Hosting Installatiehandleiding voor Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Inhoudsopgave {#table-of-contents}

* [Overzicht](#overview)
* [Vereisten](#prerequisites)
* [Systeemvereisten](#system-requirements)
* [Stapsgewijze Installatie](#step-by-step-installation)
  * [Stap 1: Initiële Systeemconfiguratie](#step-1-initial-system-setup)
  * [Stap 2: DNS-Resolvers Configureren](#step-2-configure-dns-resolvers)
  * [Stap 3: Systeemafhankelijkheden Installeren](#step-3-install-system-dependencies)
  * [Stap 4: Snapd Installeren en Configureren](#step-4-install-and-configure-snapd)
  * [Stap 5: Snap Pakketten Installeren](#step-5-install-snap-packages)
  * [Stap 6: Docker Installeren](#step-6-install-docker)
  * [Stap 7: Docker Service Configureren](#step-7-configure-docker-service)
  * [Stap 8: UFW Firewall Installeren en Configureren](#step-8-install-and-configure-ufw-firewall)
  * [Stap 9: Forward Email Repository Klonen](#step-9-clone-forward-email-repository)
  * [Stap 10: Omgevingsconfiguratie Instellen](#step-10-set-up-environment-configuration)
  * [Stap 11: Configureer Je Domein](#step-11-configure-your-domain)
  * [Stap 12: SSL-certificaten Genereren](#step-12-generate-ssl-certificates)
  * [Stap 13: Encryptiesleutels Genereren](#step-13-generate-encryption-keys)
  * [Stap 14: SSL-paden Bijwerken in Configuratie](#step-14-update-ssl-paths-in-configuration)
  * [Stap 15: Basis Authenticatie Instellen](#step-15-set-up-basic-authentication)
  * [Stap 16: Uitrollen met Docker Compose](#step-16-deploy-with-docker-compose)
  * [Stap 17: Installatie Verifiëren](#step-17-verify-installation)
* [Configuratie na Installatie](#post-installation-configuration)
  * [DNS Records Instellen](#dns-records-setup)
  * [Eerste Aanmelding](#first-login)
* [Backup Configuratie](#backup-configuration)
  * [S3-compatibele Backup Instellen](#set-up-s3-compatible-backup)
  * [Backup Cron Jobs Instellen](#set-up-backup-cron-jobs)
* [Auto-Update Configuratie](#auto-update-configuration)
* [Debian-specifieke Overwegingen](#debian-specific-considerations)
  * [Verschillen in Pakketbeheer](#package-management-differences)
  * [Servicebeheer](#service-management)
  * [Netwerkconfiguratie](#network-configuration)
* [Onderhoud en Monitoring](#maintenance-and-monitoring)
  * [Loglocaties](#log-locations)
  * [Regelmatige Onderhoudstaken](#regular-maintenance-tasks)
  * [Certificaatvernieuwing](#certificate-renewal)
* [Probleemoplossing](#troubleshooting)
  * [Debian-specifieke Problemen](#debian-specific-issues)
  * [Veelvoorkomende Problemen](#common-issues)
  * [Hulp Krijgen](#getting-help)
* [Beveiligingsrichtlijnen](#security-best-practices)
* [Conclusie](#conclusion)


## Overzicht {#overview}

Deze handleiding biedt stapsgewijze instructies voor het installeren van de zelf-gehoste oplossing van Forward Email op Debian-systemen. Deze handleiding is specifiek afgestemd op Debian 11 (Bullseye) en Debian 12 (Bookworm).


## Vereisten {#prerequisites}

Voordat je begint met de installatie, zorg ervoor dat je:

* **Debian Server**: Versie 11 (Bullseye) of 12 (Bookworm)
* **Root Toegang**: Je moet commando's kunnen uitvoeren als root (sudo-toegang)
* **Domeinnaam**: Een domein dat je beheert met toegang tot DNS-beheer
* **Schone Server**: Aanbevolen om een verse Debian-installatie te gebruiken
* **Internetverbinding**: Vereist voor het downloaden van pakketten en Docker-images


## Systeemvereisten {#system-requirements}

* **RAM**: Minimaal 2GB (4GB aanbevolen voor productie)
* **Opslag**: Minimaal 20GB vrije ruimte (50GB+ aanbevolen voor productie)
* **CPU**: Minimaal 1 vCPU (2+ vCPU's aanbevolen voor productie)
* **Netwerk**: Publiek IP-adres met de volgende poorten toegankelijk:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Stapsgewijze Installatie {#step-by-step-installation}

### Stap 1: Initiële Systeemconfiguratie {#step-1-initial-system-setup}

Zorg er eerst voor dat je systeem up-to-date is en schakel over naar de root-gebruiker:

```bash
# Update systeem pakketten
sudo apt update && sudo apt upgrade -y

# Schakel over naar root-gebruiker (vereist voor de installatie)
sudo su -
```
### Stap 2: Configureer DNS-resolvers {#step-2-configure-dns-resolvers}

Configureer je systeem om de DNS-servers van Cloudflare te gebruiken voor betrouwbare certificaatgeneratie:

```bash
# Stop en schakel systemd-resolved uit als het actief is
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configureer Cloudflare DNS-resolvers
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

### Stap 3: Installeer systeemafhankelijkheden {#step-3-install-system-dependencies}

Installeer de vereiste pakketten voor Forward Email op Debian:

```bash
# Update pakketlijst
apt-get update -y

# Installeer basisafhankelijkheden (Debian-specifieke pakketlijst)
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

### Stap 4: Installeer en configureer Snapd {#step-4-install-and-configure-snapd}

Debian bevat standaard geen snapd, dus moeten we het installeren en configureren:

```bash
# Installeer snapd
apt-get install -y snapd

# Schakel snapd-service in en start deze
systemctl enable snapd
systemctl start snapd

# Maak symlink aan zodat snap correct werkt
ln -sf /var/lib/snapd/snap /snap

# Wacht tot snapd klaar is
sleep 10

# Controleer of snapd werkt
snap version
```

### Stap 5: Installeer Snap-pakketten {#step-5-install-snap-packages}

Installeer AWS CLI en Certbot via snap:

```bash
# Installeer AWS CLI
snap install aws-cli --classic

# Installeer Certbot en DNS-plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Controleer installaties
aws --version
certbot --version
```

### Stap 6: Installeer Docker {#step-6-install-docker}

Installeer Docker CE en Docker Compose op Debian:

```bash
# Voeg de officiële GPG-sleutel van Docker toe (Debian-specifiek)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Voeg Docker-repository toe (Debian-specifiek)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update pakketindex en installeer Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installeer standalone docker-compose als fallback (als plugin niet werkt)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Controleer Docker-installatie
docker --version
docker compose version || docker-compose --version
```

### Stap 7: Configureer Docker-service {#step-7-configure-docker-service}

Zorg dat Docker automatisch start en actief is:

```bash
# Schakel Docker-service in en start deze
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Controleer of Docker draait
docker info
```

Als Docker niet start, probeer het dan handmatig te starten:

```bash
# Alternatieve startmethode als systemctl faalt
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Stap 8: Installeer en configureer UFW-firewall {#step-8-install-and-configure-ufw-firewall}

Debian minimale installaties bevatten mogelijk geen UFW, installeer het daarom eerst:

```bash
# Installeer UFW als het niet aanwezig is
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Stel standaardbeleid in
ufw default deny incoming
ufw default allow outgoing

# Sta SSH toe (belangrijk - sluit jezelf niet buiten!)
ufw allow 22/tcp

# Sta e-mail gerelateerde poorten toe
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (voor Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternatieve poort)
ufw allow 2995/tcp  # POP3 (alternatieve poort)
ufw allow 3456/tcp  # Aangepaste servicepoort
ufw allow 4000/tcp  # Aangepaste servicepoort
ufw allow 5000/tcp  # Aangepaste servicepoort

# Sta lokale databaseverbindingen toe
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Schakel firewall in
echo "y" | ufw enable

# Controleer firewallstatus
ufw status numbered
```
### Stap 9: Clone Forward Email Repository {#step-9-clone-forward-email-repository}

Download de broncode van Forward Email:

```bash
# Stel variabelen in
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clone de repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Controleer of de clone succesvol was
ls -la
```

### Stap 10: Stel Omgevingsconfiguratie in {#step-10-set-up-environment-configuration}

Bereid de omgevingsconfiguratie voor:

```bash
# Stel directoryvariabelen in
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopieer standaard omgevingsbestand
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Maak SSL-directory aan
mkdir -p "$SELF_HOST_DIR/ssl"

# Maak database-directories aan
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Stap 11: Configureer Je Domein {#step-11-configure-your-domain}

Stel je domeinnaam in en werk omgevingsvariabelen bij:

```bash
# Vervang 'yourdomain.com' door je eigen domein
DOMAIN="yourdomain.com"

# Functie om omgevingsbestand bij te werken
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Werk domeingerelateerde omgevingsvariabelen bij
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

### Stap 12: Genereer SSL-certificaten {#step-12-generate-ssl-certificates}

#### Optie A: Handmatige DNS-uitdaging (Aanbevolen voor de meeste gebruikers) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Genereer certificaten met handmatige DNS-uitdaging
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Belangrijk**: Wanneer hierom wordt gevraagd, moet je TXT-records aanmaken in je DNS. Je kunt meerdere uitdagingen voor hetzelfde domein zien - **maak ze ALLEMAAL aan**. Verwijder het eerste TXT-record niet wanneer je het tweede toevoegt.

#### Optie B: Cloudflare DNS (Als je Cloudflare gebruikt) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Als je domein Cloudflare voor DNS gebruikt, kun je het genereren van certificaten automatiseren:

```bash
# Maak Cloudflare-gegevensbestand aan
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Stel juiste permissies in
chmod 600 /root/.cloudflare.ini

# Genereer certificaten automatisch
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Kopieer Certificaten {#copy-certificates}

Na het genereren van certificaten, kopieer ze naar de applicatiedirectory:

```bash
# Kopieer certificaten naar de SSL-directory van de applicatie
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Controleer of certificaten zijn gekopieerd
ls -la "$SELF_HOST_DIR/ssl/"
```

### Stap 13: Genereer Encryptiesleutels {#step-13-generate-encryption-keys}

Maak de verschillende encryptiesleutels aan die nodig zijn voor veilige werking:

```bash
# Genereer helper encryptiesleutel
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Genereer SRS-secret voor e-mail forwarding
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Genereer TXT encryptiesleutel
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Genereer DKIM private key voor e-mailondertekening
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Genereer webhook handtekening sleutel
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Stel SMTP transport wachtwoord in
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Alle encryptiesleutels succesvol gegenereerd"
```
### Stap 14: SSL-paden bijwerken in configuratie {#step-14-update-ssl-paths-in-configuration}

Configureer de SSL-certificaatpaden in het omgevingsbestand:

```bash
# Update SSL-paden om naar de juiste certificaatbestanden te verwijzen
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Stap 15: Basisverificatie instellen {#step-15-set-up-basic-authentication}

Maak tijdelijke basisverificatiegegevens aan:

```bash
# Genereer een veilig willekeurig wachtwoord
PASSWORD=$(openssl rand -base64 16)

# Werk het omgevingsbestand bij met basisverificatiegegevens
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Toon de gegevens (bewaar deze!)
echo ""
echo "🔐 BELANGRIJK: Bewaar deze inloggegevens!"
echo "=================================="
echo "Gebruikersnaam: admin"
echo "Wachtwoord: $PASSWORD"
echo "=================================="
echo ""
echo "Je hebt deze nodig om na installatie toegang te krijgen tot de webinterface."
echo ""
```

### Stap 16: Uitrollen met Docker Compose {#step-16-deploy-with-docker-compose}

Start alle Forward Email-services:

```bash
# Stel het pad naar het Docker Compose-bestand in
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop eventuele bestaande containers
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Haal de nieuwste images op
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Start alle services in gedetacheerde modus
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Wacht even tot de services zijn gestart
sleep 10

# Controleer de status van de services
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Stap 17: Installatie verifiëren {#step-17-verify-installation}

Controleer of alle services correct draaien:

```bash
# Controleer Docker-containers
docker ps

# Controleer servicelogboeken op fouten
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Test de connectiviteit van de webinterface
curl -I https://$DOMAIN

# Controleer of poorten luisteren
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Post-installatieconfiguratie {#post-installation-configuration}

### DNS-records instellen {#dns-records-setup}

Je moet de volgende DNS-records voor je domein configureren:

#### MX-record {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-records {#a-records}

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

#### SPF-record {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-record {#dkim-record}

Haal je DKIM-public key op:

```bash
# Haal de DKIM-public key op
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Maak het DKIM DNS-record aan:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-record {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Eerste aanmelding {#first-login}

1. Open je webbrowser en ga naar `https://yourdomain.com`
2. Voer de eerder opgeslagen basisverificatiegegevens in
3. Voltooi de eerste setup-wizard
4. Maak je eerste e-mailaccount aan


## Backup-configuratie {#backup-configuration}

### S3-compatibele backup instellen {#set-up-s3-compatible-backup}

Configureer geautomatiseerde backups naar S3-compatibele opslag:

```bash
# Maak de AWS-credentials map aan
mkdir -p ~/.aws

# Configureer AWS-credentials
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configureer AWS-instellingen
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Voor niet-AWS S3 (zoals Cloudflare R2), voeg endpoint-URL toe
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Backup Cron Jobs Instellen {#set-up-backup-cron-jobs}

```bash
# Maak backup scripts uitvoerbaar
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Voeg MongoDB backup cron job toe (draait dagelijks om middernacht)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Voeg Redis backup cron job toe (draait dagelijks om middernacht)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Controleer of cron jobs zijn toegevoegd
crontab -l
```


## Automatische Update Configuratie {#auto-update-configuration}

Stel automatische updates in voor je Forward Email installatie:

```bash
# Maak auto-update commando aan (gebruik passend docker compose commando)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Voeg auto-update cron job toe (draait dagelijks om 1 uur 's nachts)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Controleer of de cron job is toegevoegd
crontab -l
```


## Debian-specifieke Overwegingen {#debian-specific-considerations}

### Verschillen in Pakketbeheer {#package-management-differences}

* **Snapd**: Niet standaard geïnstalleerd op Debian, vereist handmatige installatie
* **Docker**: Gebruikt Debian-specifieke repositories en GPG-sleutels
* **UFW**: Mogelijk niet inbegrepen in minimale Debian-installaties
* **systemd**: Gedrag kan iets verschillen van Ubuntu

### Servicebeheer {#service-management}

```bash
# Controleer service status (Debian-specifieke commando's)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Herstart services indien nodig
systemctl restart snapd
systemctl restart docker
```

### Netwerkconfiguratie {#network-configuration}

Debian kan andere netwerkinterface-namen of configuraties hebben:

```bash
# Controleer netwerkinterfaces
ip addr show

# Controleer routing
ip route show

# Controleer DNS-resolutie
nslookup google.com
```


## Onderhoud en Monitoring {#maintenance-and-monitoring}

### Log Locaties {#log-locations}

* **Docker Compose logs**: Gebruik passend docker compose commando afhankelijk van installatie
* **Systeemlogs**: `/var/log/syslog`
* **Backup logs**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-update logs**: `/var/log/autoupdate.log`
* **Snapd logs**: `journalctl -u snapd`

### Regelmatige Onderhoudstaken {#regular-maintenance-tasks}

1. **Controleer schijfruimte**: `df -h`
2. **Controleer service status**: Gebruik passend docker compose commando
3. **Bekijk logs**: Controleer zowel applicatie- als systeemlogs
4. **Update systeem pakketten**: `apt update && apt upgrade`
5. **Monitor snapd**: `snap list` en `snap refresh`

### Certificaatvernieuwing {#certificate-renewal}

Certificaten zouden automatisch moeten vernieuwen, maar je kunt ze handmatig vernieuwen indien nodig:

```bash
# Handmatige certificaatvernieuwing
certbot renew

# Kopieer vernieuwde certificaten
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Herstart services om nieuwe certificaten te gebruiken
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Problemen Oplossen {#troubleshooting}

### Debian-specifieke Problemen {#debian-specific-issues}

#### 1. Snapd Werkt Niet {#1-snapd-not-working}

```bash
# Controleer snapd status
systemctl status snapd

# Herstart snapd
systemctl restart snapd

# Controleer snap pad
echo $PATH | grep snap

# Voeg snap toe aan PATH als het ontbreekt
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose Commando Niet Gevonden {#2-docker-compose-command-not-found}

```bash
# Controleer welk docker compose commando beschikbaar is
command -v docker-compose
command -v docker

# Gebruik het juiste commando in scripts
if command -v docker-compose &> /dev/null; then
    echo "Gebruik docker-compose"
else
    echo "Gebruik docker compose"
fi
```
#### 3. Problemen met Pakketinstallatie {#3-package-installation-issues}

```bash
# Update pakketcache
apt update

# Repareer kapotte pakketten
apt --fix-broken install

# Controleer vastgezette pakketten
apt-mark showhold
```

### Veelvoorkomende Problemen {#common-issues}

#### 1. Docker Service Start Niet {#1-docker-service-wont-start}

```bash
# Controleer Docker status
systemctl status docker

# Controleer Docker logs
journalctl -u docker

# Probeer alternatieve opstart
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certificaatgeneratie Mislukt {#2-certificate-generation-fails}

* Zorg dat poorten 80 en 443 toegankelijk zijn
* Verifieer dat DNS-records naar je server wijzen
* Controleer firewall-instellingen met `ufw status`

#### 3. Problemen met E-mailbezorging {#3-email-delivery-issues}

* Controleer of MX-records correct zijn
* Controleer SPF-, DKIM- en DMARC-records
* Zorg dat poort 25 niet geblokkeerd wordt door je hostingprovider

### Hulp Krijgen {#getting-help}

* **Documentatie**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian Documentatie**: <https://www.debian.org/doc/>


## Beste Beveiligingspraktijken {#security-best-practices}

1. **Houd Systeem Bij**: Werk Debian en pakketten regelmatig bij
2. **Monitor Logs**: Stel logmonitoring en waarschuwingen in
3. **Maak Regelmatig Back-ups**: Test back-up en herstelprocedures
4. **Gebruik Sterke Wachtwoorden**: Genereer sterke wachtwoorden voor alle accounts
5. **Activeer Fail2Ban**: Overweeg fail2ban te installeren voor extra beveiliging
6. **Regelmatige Beveiligingsaudits**: Beoordeel periodiek je configuratie
7. **Monitor Snapd**: Houd snap-pakketten up-to-date met `snap refresh`


## Conclusie {#conclusion}

Je Forward Email self-hosted installatie zou nu voltooid moeten zijn en draaien op Debian. Vergeet niet om:

1. Je DNS-records correct te configureren
2. E-mail verzenden en ontvangen te testen
3. Regelmatige back-ups in te stellen
4. Je systeem regelmatig te monitoren
5. Je installatie up-to-date te houden
6. Snapd en snap-pakketten te monitoren

De belangrijkste verschillen met Ubuntu zijn de snapd-installatie en de configuratie van de Docker-repository. Zodra deze correct zijn ingesteld, gedraagt de Forward Email-applicatie zich identiek op beide systemen.

Voor extra configuratieopties en geavanceerde functies, raadpleeg de officiële Forward Email documentatie op <https://forwardemail.net/self-hosted#configuration>.
