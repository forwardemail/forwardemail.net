# Forward Email Självhostad Installationsguide för Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Innehållsförteckning {#table-of-contents}

* [Översikt](#overview)
* [Förutsättningar](#prerequisites)
* [Systemkrav](#system-requirements)
* [Steg-för-steg Installation](#step-by-step-installation)
  * [Steg 1: Initial Systeminställning](#step-1-initial-system-setup)
  * [Steg 2: Konfigurera DNS-resolver](#step-2-configure-dns-resolvers)
  * [Steg 3: Installera Systemberoenden](#step-3-install-system-dependencies)
  * [Steg 4: Installera och Konfigurera Snapd](#step-4-install-and-configure-snapd)
  * [Steg 5: Installera Snap-paket](#step-5-install-snap-packages)
  * [Steg 6: Installera Docker](#step-6-install-docker)
  * [Steg 7: Konfigurera Docker-tjänst](#step-7-configure-docker-service)
  * [Steg 8: Installera och Konfigurera UFW-brandvägg](#step-8-install-and-configure-ufw-firewall)
  * [Steg 9: Klona Forward Email Repository](#step-9-clone-forward-email-repository)
  * [Steg 10: Ställ in Miljökonfiguration](#step-10-set-up-environment-configuration)
  * [Steg 11: Konfigurera Din Domän](#step-11-configure-your-domain)
  * [Steg 12: Generera SSL-certifikat](#step-12-generate-ssl-certificates)
  * [Steg 13: Generera Krypteringsnycklar](#step-13-generate-encryption-keys)
  * [Steg 14: Uppdatera SSL-sökvägar i Konfigurationen](#step-14-update-ssl-paths-in-configuration)
  * [Steg 15: Ställ in Grundläggande Autentisering](#step-15-set-up-basic-authentication)
  * [Steg 16: Distribuera med Docker Compose](#step-16-deploy-with-docker-compose)
  * [Steg 17: Verifiera Installation](#step-17-verify-installation)
* [Efterinstallationskonfiguration](#post-installation-configuration)
  * [DNS-poster Inställning](#dns-records-setup)
  * [Första Inloggning](#first-login)
* [Backup-konfiguration](#backup-configuration)
  * [Ställ in S3-kompatibel Backup](#set-up-s3-compatible-backup)
  * [Ställ in Backup Cron-jobb](#set-up-backup-cron-jobs)
* [Automatisk Uppdateringskonfiguration](#auto-update-configuration)
* [Debian-specifika Överväganden](#debian-specific-considerations)
  * [Skillnader i Paketförvaltning](#package-management-differences)
  * [Tjänstehantering](#service-management)
  * [Nätverkskonfiguration](#network-configuration)
* [Underhåll och Övervakning](#maintenance-and-monitoring)
  * [Loggplatser](#log-locations)
  * [Regelbundna Underhållsuppgifter](#regular-maintenance-tasks)
  * [Certifikatförnyelse](#certificate-renewal)
* [Felsökning](#troubleshooting)
  * [Debian-specifika Problem](#debian-specific-issues)
  * [Vanliga Problem](#common-issues)
  * [Få Hjälp](#getting-help)
* [Säkerhetsbästa Praxis](#security-best-practices)
* [Slutsats](#conclusion)


## Översikt {#overview}

Denna guide ger steg-för-steg instruktioner för att installera Forward Emails självhostade lösning på Debian-system. Guiden är särskilt anpassad för Debian 11 (Bullseye) och Debian 12 (Bookworm).


## Förutsättningar {#prerequisites}

Innan du påbörjar installationen, säkerställ att du har:

* **Debian-server**: Version 11 (Bullseye) eller 12 (Bookworm)
* **Root-åtkomst**: Du måste kunna köra kommandon som root (sudo-åtkomst)
* **Domännamn**: En domän som du kontrollerar med DNS-hanteringsåtkomst
* **Ren Server**: Rekommenderas att använda en färsk Debian-installation
* **Internetanslutning**: Krävs för att ladda ner paket och Docker-bilder


## Systemkrav {#system-requirements}

* **RAM**: Minst 2GB (4GB rekommenderas för produktion)
* **Lagring**: Minst 20GB ledigt utrymme (50GB+ rekommenderas för produktion)
* **CPU**: Minst 1 vCPU (2+ vCPU rekommenderas för produktion)
* **Nätverk**: Offentlig IP-adress med följande portar tillgängliga:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Steg-för-steg Installation {#step-by-step-installation}

### Steg 1: Initial Systeminställning {#step-1-initial-system-setup}

Först, säkerställ att ditt system är uppdaterat och byt till root-användare:

```bash
# Uppdatera systempaket
sudo apt update && sudo apt upgrade -y

# Byt till root-användare (krävs för installationen)
sudo su -
```
### Steg 2: Konfigurera DNS-resolverare {#step-2-configure-dns-resolvers}

Konfigurera ditt system för att använda Cloudflares DNS-servrar för pålitlig certifikatgenerering:

```bash
# Stoppa och inaktivera systemd-resolved om det körs
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Konfigurera Cloudflare DNS-resolverare
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

### Steg 3: Installera systemberoenden {#step-3-install-system-dependencies}

Installera de nödvändiga paketen för Forward Email på Debian:

```bash
# Uppdatera paketlistan
apt-get update -y

# Installera grundläggande beroenden (Debian-specifik paketlista)
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

### Steg 4: Installera och konfigurera Snapd {#step-4-install-and-configure-snapd}

Debian inkluderar inte snapd som standard, så vi behöver installera och konfigurera det:

```bash
# Installera snapd
apt-get install -y snapd

# Aktivera och starta snapd-tjänsten
systemctl enable snapd
systemctl start snapd

# Skapa symbolisk länk för att snap ska fungera korrekt
ln -sf /var/lib/snapd/snap /snap

# Vänta på att snapd ska bli redo
sleep 10

# Verifiera att snapd fungerar
snap version
```

### Steg 5: Installera Snap-paket {#step-5-install-snap-packages}

Installera AWS CLI och Certbot via snap:

```bash
# Installera AWS CLI
snap install aws-cli --classic

# Installera Certbot och DNS-plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verifiera installationerna
aws --version
certbot --version
```

### Steg 6: Installera Docker {#step-6-install-docker}

Installera Docker CE och Docker Compose på Debian:

```bash
# Lägg till Dockers officiella GPG-nyckel (Debian-specifik)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Lägg till Docker-repositoriet (Debian-specifik)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Uppdatera paketindex och installera Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installera fristående docker-compose som fallback (om plugin inte fungerar)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verifiera Docker-installationen
docker --version
docker compose version || docker-compose --version
```

### Steg 7: Konfigurera Docker-tjänsten {#step-7-configure-docker-service}

Se till att Docker startar automatiskt och körs:

```bash
# Aktivera och starta Docker-tjänsten
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verifiera att Docker körs
docker info
```

Om Docker inte startar, försök starta det manuellt:

```bash
# Alternativ startmetod om systemctl misslyckas
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Steg 8: Installera och konfigurera UFW-brandvägg {#step-8-install-and-configure-ufw-firewall}

Debian-minimalinstallationer inkluderar kanske inte UFW, så installera det först:

```bash
# Installera UFW om det inte finns
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Ställ in standardpolicyer
ufw default deny incoming
ufw default allow outgoing

# Tillåt SSH (viktigt - lås inte ute dig själv!)
ufw allow 22/tcp

# Tillåt e-postrelaterade portar
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (för Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternativ port)
ufw allow 2995/tcp  # POP3 (alternativ port)
ufw allow 3456/tcp  # Anpassad tjänsteport
ufw allow 4000/tcp  # Anpassad tjänsteport
ufw allow 5000/tcp  # Anpassad tjänsteport

# Tillåt lokala databasanslutningar
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Aktivera brandväggen
echo "y" | ufw enable

# Kontrollera brandväggens status
ufw status numbered
```
### Steg 9: Klona Forward Email Repository {#step-9-clone-forward-email-repository}

Ladda ner Forward Email källkod:

```bash
# Ställ in variabler
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Klona repositoryt
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verifiera att kloningen lyckades
ls -la
```

### Steg 10: Ställ in miljökonfiguration {#step-10-set-up-environment-configuration}

Förbered miljökonfigurationen:

```bash
# Ställ in katalogvariabler
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopiera standard miljöfil
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Skapa SSL-katalog
mkdir -p "$SELF_HOST_DIR/ssl"

# Skapa databas-kataloger
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Steg 11: Konfigurera din domän {#step-11-configure-your-domain}

Ange ditt domännamn och uppdatera miljövariabler:

```bash
# Byt ut 'yourdomain.com' mot din faktiska domän
DOMAIN="yourdomain.com"

# Funktion för att uppdatera miljöfil
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Uppdatera domänrelaterade miljövariabler
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

### Steg 12: Generera SSL-certifikat {#step-12-generate-ssl-certificates}

#### Alternativ A: Manuell DNS-utmaning (Rekommenderas för de flesta användare) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generera certifikat med manuell DNS-utmaning
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Viktigt**: När du uppmanas måste du skapa TXT-poster i din DNS. Du kan se flera utmaningar för samma domän – **skapa ALLA dem**. Ta inte bort den första TXT-posten när du lägger till den andra.

#### Alternativ B: Cloudflare DNS (Om du använder Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Om din domän använder Cloudflare för DNS kan du automatisera certifikatgenereringen:

```bash
# Skapa Cloudflare autentiseringsfil
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Sätt rätt behörigheter
chmod 600 /root/.cloudflare.ini

# Generera certifikat automatiskt
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Kopiera certifikat {#copy-certificates}

Efter certifikatgenerering, kopiera dem till applikationskatalogen:

```bash
# Kopiera certifikat till applikationens SSL-katalog
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verifiera att certifikaten kopierades
ls -la "$SELF_HOST_DIR/ssl/"
```

### Steg 13: Generera krypteringsnycklar {#step-13-generate-encryption-keys}

Skapa de olika krypteringsnycklar som krävs för säker drift:

```bash
# Generera hjälpkrypteringsnyckel
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generera SRS-hemlighet för e-post vidarebefordran
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generera TXT-krypteringsnyckel
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generera DKIM privat nyckel för e-postsignering
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generera webhook signeringsnyckel
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Sätt SMTP transportlösenord
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Alla krypteringsnycklar genererades framgångsrikt"
```
### Steg 14: Uppdatera SSL-sökvägar i konfigurationen {#step-14-update-ssl-paths-in-configuration}

Konfigurera sökvägarna för SSL-certifikaten i miljöfilen:

```bash
# Uppdatera SSL-sökvägar för att peka på rätt certifikatfiler
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Steg 15: Ställ in grundläggande autentisering {#step-15-set-up-basic-authentication}

Skapa tillfälliga inloggningsuppgifter för grundläggande autentisering:

```bash
# Generera ett säkert slumpmässigt lösenord
PASSWORD=$(openssl rand -base64 16)

# Uppdatera miljöfilen med grundläggande autentiseringsuppgifter
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Visa uppgifterna (spara dessa!)
echo ""
echo "🔐 VIKTIGT: Spara dessa inloggningsuppgifter!"
echo "=================================="
echo "Användarnamn: admin"
echo "Lösenord: $PASSWORD"
echo "=================================="
echo ""
echo "Du kommer behöva dessa för att komma åt webbgränssnittet efter installationen."
echo ""
```

### Steg 16: Distribuera med Docker Compose {#step-16-deploy-with-docker-compose}

Starta alla Forward Email-tjänster:

```bash
# Ange sökväg till Docker Compose-fil
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stoppa eventuella befintliga containrar
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Hämta de senaste bilderna
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Starta alla tjänster i detached-läge
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Vänta en stund för att tjänsterna ska starta
sleep 10

# Kontrollera tjänsternas status
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Steg 17: Verifiera installationen {#step-17-verify-installation}

Kontrollera att alla tjänster körs korrekt:

```bash
# Kontrollera Docker-containrar
docker ps

# Kontrollera tjänstloggar för eventuella fel
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Testa anslutning till webbgränssnittet
curl -I https://$DOMAIN

# Kontrollera om portar lyssnar
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Konfiguration efter installation {#post-installation-configuration}

### DNS-poster att konfigurera {#dns-records-setup}

Du behöver konfigurera följande DNS-poster för din domän:

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

Hämta din DKIM-nyckel:

```bash
# Extrahera DKIM-public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Skapa DKIM DNS-post:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-post {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Första inloggningen {#first-login}

1. Öppna din webbläsare och gå till `https://yourdomain.com`
2. Ange de grundläggande autentiseringsuppgifter du sparade tidigare
3. Slutför installationsguiden
4. Skapa ditt första e-postkonto


## Säkerhetskopieringskonfiguration {#backup-configuration}

### Ställ in S3-kompatibel säkerhetskopiering {#set-up-s3-compatible-backup}

Konfigurera automatiska säkerhetskopior till S3-kompatibel lagring:

```bash
# Skapa AWS credentials-katalog
mkdir -p ~/.aws

# Konfigurera AWS credentials
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Konfigurera AWS-inställningar
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# För icke-AWS S3 (som Cloudflare R2), lägg till endpoint URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Ställ in Backup Cron Jobs {#set-up-backup-cron-jobs}

```bash
# Gör backup-skript körbara
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Lägg till MongoDB backup cron-jobb (körs dagligen vid midnatt)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Lägg till Redis backup cron-jobb (körs dagligen vid midnatt)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verifiera att cron-jobben lades till
crontab -l
```


## Automatisk Uppdateringskonfiguration {#auto-update-configuration}

Ställ in automatiska uppdateringar för din Forward Email-installation:

```bash
# Skapa auto-uppdateringskommando (använd lämpligt docker compose-kommando)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Lägg till auto-uppdaterings cron-jobb (körs dagligen kl 01)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verifiera att cron-jobbet lades till
crontab -l
```


## Debian-specifika Överväganden {#debian-specific-considerations}

### Skillnader i Paketadministration {#package-management-differences}

* **Snapd**: Inte installerat som standard på Debian, kräver manuell installation
* **Docker**: Använder Debian-specifika repositories och GPG-nycklar
* **UFW**: Kan saknas i minimala Debian-installationer
* **systemd**: Beteendet kan skilja sig något från Ubuntu

### Tjänstehantering {#service-management}

```bash
# Kontrollera tjänstens status (Debian-specifika kommandon)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Starta om tjänster vid behov
systemctl restart snapd
systemctl restart docker
```

### Nätverkskonfiguration {#network-configuration}

Debian kan ha andra namn på nätverksgränssnitt eller konfigurationer:

```bash
# Kontrollera nätverksgränssnitt
ip addr show

# Kontrollera routing
ip route show

# Kontrollera DNS-upplösning
nslookup google.com
```


## Underhåll och Övervakning {#maintenance-and-monitoring}

### Loggplatser {#log-locations}

* **Docker Compose-loggar**: Använd lämpligt docker compose-kommando baserat på installation
* **Systemloggar**: `/var/log/syslog`
* **Backup-loggar**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-uppdateringsloggar**: `/var/log/autoupdate.log`
* **Snapd-loggar**: `journalctl -u snapd`

### Regelbundna Underhållsuppgifter {#regular-maintenance-tasks}

1. **Övervaka diskutrymme**: `df -h`
2. **Kontrollera tjänsters status**: Använd lämpligt docker compose-kommando
3. **Granska loggar**: Kontrollera både applikations- och systemloggar
4. **Uppdatera systempaket**: `apt update && apt upgrade`
5. **Övervaka snapd**: `snap list` och `snap refresh`

### Förnyelse av Certifikat {#certificate-renewal}

Certifikat bör förnyas automatiskt, men du kan förnya manuellt vid behov:

```bash
# Manuell certifikatförnyelse
certbot renew

# Kopiera förnyade certifikat
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Starta om tjänster för att använda nya certifikat
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Felsökning {#troubleshooting}

### Debian-specifika Problem {#debian-specific-issues}

#### 1. Snapd Fungerar Inte {#1-snapd-not-working}

```bash
# Kontrollera snapd-status
systemctl status snapd

# Starta om snapd
systemctl restart snapd

# Kontrollera snap path
echo $PATH | grep snap

# Lägg till snap i PATH om det saknas
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose-kommando Hittas Inte {#2-docker-compose-command-not-found}

```bash
# Kontrollera vilket docker compose-kommando som finns tillgängligt
command -v docker-compose
command -v docker

# Använd lämpligt kommando i skript
if command -v docker-compose &> /dev/null; then
    echo "Använder docker-compose"
else
    echo "Använder docker compose"
fi
```
#### 3. Problem med paketinstallation {#3-package-installation-issues}

```bash
# Uppdatera paketcache
apt update

# Åtgärda trasiga paket
apt --fix-broken install

# Kontrollera hållna paket
apt-mark showhold
```

### Vanliga problem {#common-issues}

#### 1. Docker-tjänsten startar inte {#1-docker-service-wont-start}

```bash
# Kontrollera Docker-status
systemctl status docker

# Kontrollera Docker-loggar
journalctl -u docker

# Försök alternativ start
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certifikatgenerering misslyckas {#2-certificate-generation-fails}

* Säkerställ att portar 80 och 443 är tillgängliga
* Verifiera att DNS-poster pekar på din server
* Kontrollera brandväggsinställningar med `ufw status`

#### 3. Problem med e-postleverans {#3-email-delivery-issues}

* Verifiera att MX-poster är korrekta
* Kontrollera SPF-, DKIM- och DMARC-poster
* Säkerställ att port 25 inte blockeras av din hosting-leverantör

### Få hjälp {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian-dokumentation**: <https://www.debian.org/doc/>


## Säkerhetsbästa praxis {#security-best-practices}

1. **Håll systemet uppdaterat**: Uppdatera regelbundet Debian och paket
2. **Övervaka loggar**: Sätt upp loggövervakning och larm
3. **Säkerhetskopiera regelbundet**: Testa säkerhetskopierings- och återställningsrutiner
4. **Använd starka lösenord**: Generera starka lösenord för alla konton
5. **Aktivera Fail2Ban**: Överväg att installera fail2ban för extra säkerhet
6. **Regelbundna säkerhetsgranskningar**: Granska din konfiguration periodiskt
7. **Övervaka Snapd**: Håll snap-paket uppdaterade med `snap refresh`


## Slutsats {#conclusion}

Din Forward Email självhostade installation bör nu vara klar och köras på Debian. Kom ihåg att:

1. Konfigurera dina DNS-poster korrekt
2. Testa att skicka och ta emot e-post
3. Sätt upp regelbundna säkerhetskopior
4. Övervaka ditt system regelbundet
5. Håll din installation uppdaterad
6. Övervaka snapd och snap-paket

De största skillnaderna från Ubuntu är snapd-installationen och konfigurationen av Docker-förrådet. När dessa är korrekt inställda beter sig Forward Email-applikationen identiskt på båda systemen.

För ytterligare konfigurationsalternativ och avancerade funktioner, se den officiella Forward Email-dokumentationen på <https://forwardemail.net/self-hosted#configuration>.
