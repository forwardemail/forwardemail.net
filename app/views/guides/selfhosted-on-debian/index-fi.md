# Forward Email Itseisännöinnin Asennusopas Debianille {#forward-email-self-hosting-installation-guide-for-debian}


## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Esivaatimukset](#prerequisites)
* [Järjestelmävaatimukset](#system-requirements)
* [Asennus vaihe vaiheelta](#step-by-step-installation)
  * [Vaihe 1: Järjestelmän alkuasetukset](#step-1-initial-system-setup)
  * [Vaihe 2: DNS-resolverien määrittäminen](#step-2-configure-dns-resolvers)
  * [Vaihe 3: Järjestelmäriippuvuuksien asennus](#step-3-install-system-dependencies)
  * [Vaihe 4: Snapd:n asennus ja konfigurointi](#step-4-install-and-configure-snapd)
  * [Vaihe 5: Snap-pakettien asennus](#step-5-install-snap-packages)
  * [Vaihe 6: Dockerin asennus](#step-6-install-docker)
  * [Vaihe 7: Docker-palvelun konfigurointi](#step-7-configure-docker-service)
  * [Vaihe 8: UFW-palomuuri asennus ja konfigurointi](#step-8-install-and-configure-ufw-firewall)
  * [Vaihe 9: Forward Email -varaston kloonaus](#step-9-clone-forward-email-repository)
  * [Vaihe 10: Ympäristökonfiguraation määrittäminen](#step-10-set-up-environment-configuration)
  * [Vaihe 11: Domainin konfigurointi](#step-11-configure-your-domain)
  * [Vaihe 12: SSL-sertifikaattien luominen](#step-12-generate-ssl-certificates)
  * [Vaihe 13: Salausavainten luominen](#step-13-generate-encryption-keys)
  * [Vaihe 14: SSL-polkujen päivittäminen konfiguraatiossa](#step-14-update-ssl-paths-in-configuration)
  * [Vaihe 15: Perusautentikoinnin määrittäminen](#step-15-set-up-basic-authentication)
  * [Vaihe 16: Julkaisu Docker Composella](#step-16-deploy-with-docker-compose)
  * [Vaihe 17: Asennuksen tarkistus](#step-17-verify-installation)
* [Asennuksen jälkeinen konfigurointi](#post-installation-configuration)
  * [DNS-tietueiden määrittäminen](#dns-records-setup)
  * [Ensimmäinen kirjautuminen](#first-login)
* [Varmuuskopioinnin konfigurointi](#backup-configuration)
  * [S3-yhteensopivan varmuuskopion määrittäminen](#set-up-s3-compatible-backup)
  * [Varmuuskopiointiaikataulujen määrittäminen](#set-up-backup-cron-jobs)
* [Automaattisen päivityksen konfigurointi](#auto-update-configuration)
* [Debian-spesifit seikat](#debian-specific-considerations)
  * [Paketinhallinnan erot](#package-management-differences)
  * [Palvelun hallinta](#service-management)
  * [Verkkokonfiguraatio](#network-configuration)
* [Ylläpito ja valvonta](#maintenance-and-monitoring)
  * [Lokien sijainnit](#log-locations)
  * [Säännölliset ylläpitotehtävät](#regular-maintenance-tasks)
  * [Sertifikaatin uusiminen](#certificate-renewal)
* [Vianmääritys](#troubleshooting)
  * [Debian-spesifit ongelmat](#debian-specific-issues)
  * [Yleiset ongelmat](#common-issues)
  * [Avun saaminen](#getting-help)
* [Turvallisuuden parhaat käytännöt](#security-best-practices)
* [Yhteenveto](#conclusion)


## Yleiskatsaus {#overview}

Tämä opas tarjoaa vaiheittaiset ohjeet Forward Emailin itseisännöidyn ratkaisun asentamiseen Debian-järjestelmiin. Opas on erityisesti suunnattu Debian 11 (Bullseye) ja Debian 12 (Bookworm) -versioille.


## Esivaatimukset {#prerequisites}

Ennen asennuksen aloittamista varmista, että sinulla on:

* **Debian-palvelin**: Versio 11 (Bullseye) tai 12 (Bookworm)
* **Root-käyttöoikeus**: Sinun tulee pystyä suorittamaan komentoja root-käyttäjänä (sudo-oikeudet)
* **Domain-nimi**: Hallitsemasi domain, johon sinulla on DNS-hallintaoikeudet
* **Puhdas palvelin**: Suositellaan käytettäväksi uutta Debian-asennusta
* **Internet-yhteys**: Tarvitaan pakettien ja Docker-kuvien lataamiseen


## Järjestelmävaatimukset {#system-requirements}

* **RAM**: Vähintään 2GB (4GB suositeltu tuotantoon)
* **Tallennustila**: Vähintään 20GB vapaata tilaa (50GB+ suositeltu tuotantoon)
* **CPU**: Vähintään 1 vCPU (2+ vCPU suositeltu tuotantoon)
* **Verkko**: Julkinen IP-osoite, johon seuraavat portit ovat avoinna:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Asennus vaihe vaiheelta {#step-by-step-installation}

### Vaihe 1: Järjestelmän alkuasetukset {#step-1-initial-system-setup}

Varmista ensin, että järjestelmäsi on ajan tasalla ja vaihda root-käyttäjäksi:

```bash
# Päivitä järjestelmäpaketit
sudo apt update && sudo apt upgrade -y

# Vaihda root-käyttäjäksi (vaaditaan asennukseen)
sudo su -
```
### Step 2: Määritä DNS-resolverit {#step-2-configure-dns-resolvers}

Määritä järjestelmäsi käyttämään Cloudflaren DNS-palvelimia luotettavaa sertifikaattien luontia varten:

```bash
# Pysäytä ja poista käytöstä systemd-resolved jos se on käynnissä
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Määritä Cloudflaren DNS-resolverit
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

### Step 3: Asenna järjestelmän riippuvuudet {#step-3-install-system-dependencies}

Asenna tarvittavat paketit Forward Emailille Debianissa:

```bash
# Päivitä pakettien lista
apt-get update -y

# Asenna perusriippuvuudet (Debian-spesifinen pakettivalikoima)
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

### Step 4: Asenna ja määritä Snapd {#step-4-install-and-configure-snapd}

Debian ei sisällä snapdia oletuksena, joten meidän täytyy asentaa ja määrittää se:

```bash
# Asenna snapd
apt-get install -y snapd

# Ota snapd-palvelu käyttöön ja käynnistä se
systemctl enable snapd
systemctl start snapd

# Luo symbolinen linkki, jotta snap toimii oikein
ln -sf /var/lib/snapd/snap /snap

# Odota, että snapd on valmis
sleep 10

# Varmista, että snapd toimii
snap version
```

### Step 5: Asenna Snap-paketit {#step-5-install-snap-packages}

Asenna AWS CLI ja Certbot snapin kautta:

```bash
# Asenna AWS CLI
snap install aws-cli --classic

# Asenna Certbot ja DNS-laajennus
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Varmista asennukset
aws --version
certbot --version
```

### Step 6: Asenna Docker {#step-6-install-docker}

Asenna Docker CE ja Docker Compose Debianissa:

```bash
# Lisää Dockerin virallinen GPG-avain (Debian-spesifinen)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Lisää Dockerin arkisto (Debian-spesifinen)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Päivitä pakettien indeksi ja asenna Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Asenna itsenäinen docker-compose varalle (jos plugin ei toimi)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Varmista Dockerin asennus
docker --version
docker compose version || docker-compose --version
```

### Step 7: Määritä Docker-palvelu {#step-7-configure-docker-service}

Varmista, että Docker käynnistyy automaattisesti ja on käynnissä:

```bash
# Ota Docker-palvelu käyttöön ja käynnistä se
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Varmista, että Docker on käynnissä
docker info
```

Jos Docker ei käynnisty, kokeile käynnistää se manuaalisesti:

```bash
# Vaihtoehtoinen käynnistystapa, jos systemctl epäonnistuu
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Asenna ja määritä UFW-palomuuri {#step-8-install-and-configure-ufw-firewall}

Debianin minimiasennuksissa UFW ei välttämättä ole mukana, joten asenna se ensin:

```bash
# Asenna UFW jos sitä ei ole
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Aseta oletuskäytännöt
ufw default deny incoming
ufw default allow outgoing

# Salli SSH (tärkeää - älä lukitse itseäsi ulos!)
ufw allow 22/tcp

# Salli sähköpostiin liittyvät portit
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (Let's Encryptiä varten)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (vaihtoehtoinen portti)
ufw allow 2995/tcp  # POP3 (vaihtoehtoinen portti)
ufw allow 3456/tcp  # Mukautettu palvelinportti
ufw allow 4000/tcp  # Mukautettu palvelinportti
ufw allow 5000/tcp  # Mukautettu palvelinportti

# Salli paikalliset tietokantayhteydet
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Ota palomuuri käyttöön
echo "y" | ufw enable

# Tarkista palomuurin tila
ufw status numbered
```
### Vaihe 9: Kloonaa Forward Email -varasto {#step-9-clone-forward-email-repository}

Lataa Forward Email -lähdekoodi:

```bash
# Määritä muuttujat
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Kloonaa varasto
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Varmista, että kloonaus onnistui
ls -la
```

### Vaihe 10: Määritä Ympäristökonfiguraatio {#step-10-set-up-environment-configuration}

Valmistele ympäristökonfiguraatio:

```bash
# Määritä hakemistomuuttujat
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopioi oletusympäristötiedosto
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Luo SSL-hakemisto
mkdir -p "$SELF_HOST_DIR/ssl"

# Luo tietokantahakemistot
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Vaihe 11: Määritä Verkkotunnuksesi {#step-11-configure-your-domain}

Aseta verkkotunnuksesi nimi ja päivitä ympäristömuuttujat:

```bash
# Korvaa 'yourdomain.com' omalla verkkotunnuksellasi
DOMAIN="yourdomain.com"

# Funktio ympäristötiedoston päivittämiseen
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Päivitä verkkotunnukseen liittyvät ympäristömuuttujat
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

### Vaihe 12: Luo SSL-sertifikaatit {#step-12-generate-ssl-certificates}

#### Vaihtoehto A: Manuaalinen DNS-haaste (Suositeltu useimmille käyttäjille) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Luo sertifikaatit manuaalisella DNS-haasteella
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Tärkeää**: Kun sinua pyydetään, sinun tulee luoda TXT-tietueita DNS:ään. Saatat nähdä useita haasteita samalle verkkotunnukselle – **luo KAIKKI niistä**. Älä poista ensimmäistä TXT-tietuetta lisätessäsi toista.

#### Vaihtoehto B: Cloudflare DNS (Jos käytät Cloudflarea) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jos verkkotunnuksesi käyttää Cloudflarea DNS:ään, voit automatisoida sertifikaattien luomisen:

```bash
# Luo Cloudflare-tunnistetiedostot
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Aseta oikeat käyttöoikeudet
chmod 600 /root/.cloudflare.ini

# Luo sertifikaatit automaattisesti
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Kopioi Sertifikaatit {#copy-certificates}

Sertifikaattien luomisen jälkeen kopioi ne sovellushakemistoon:

```bash
# Kopioi sertifikaatit sovelluksen SSL-hakemistoon
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Varmista, että sertifikaatit kopioitiin
ls -la "$SELF_HOST_DIR/ssl/"
```

### Vaihe 13: Luo Salausavaimet {#step-13-generate-encryption-keys}

Luo erilaiset salausavaimet turvallista toimintaa varten:

```bash
# Luo apusalausavain
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Luo SRS-salaisuus sähköpostin edelleenlähetystä varten
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Luo TXT-salausavain
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Luo DKIM-yksityisavain sähköpostin allekirjoitusta varten
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Luo webhook-allekirjoitusavain
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Aseta SMTP-siirtosalasana
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Kaikki salausavaimet luotu onnistuneesti"
```
### Vaihe 14: Päivitä SSL-polut konfiguraatiossa {#step-14-update-ssl-paths-in-configuration}

Määritä SSL-varmenteiden polut ympäristötiedostossa:

```bash
# Päivitä SSL-polut osoittamaan oikeisiin varmennetiedostoihin
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Vaihe 15: Perusautentikoinnin määrittäminen {#step-15-set-up-basic-authentication}

Luo väliaikaiset perusautentikointitunnukset:

```bash
# Luo turvallinen satunnainen salasana
PASSWORD=$(openssl rand -base64 16)

# Päivitä ympäristötiedosto perusautentikointitiedoilla
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Näytä tunnukset (tallenna nämä!)
echo ""
echo "🔐 TÄRKEÄÄ: Tallenna nämä kirjautumistiedot!"
echo "=================================="
echo "Käyttäjätunnus: admin"
echo "Salasana: $PASSWORD"
echo "=================================="
echo ""
echo "Tarvitset näitä päästäksesi web-käyttöliittymään asennuksen jälkeen."
echo ""
```

### Vaihe 16: Käyttöönotto Docker Composella {#step-16-deploy-with-docker-compose}

Käynnistä kaikki Forward Email -palvelut:

```bash
# Määritä Docker Compose -tiedoston polku
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Pysäytä mahdolliset olemassa olevat kontit
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Vedä uusimmat kuvat
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Käynnistä kaikki palvelut irrotetussa tilassa
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Odota hetki, että palvelut käynnistyvät
sleep 10

# Tarkista palveluiden tila
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Vaihe 17: Asennuksen tarkistus {#step-17-verify-installation}

Varmista, että kaikki palvelut toimivat oikein:

```bash
# Tarkista Docker-kontit
docker ps

# Tarkista palvelulokit virheiden varalta
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Testaa web-käyttöliittymän yhteys
curl -I https://$DOMAIN

# Tarkista, kuuntelevatko portit
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Asennuksen jälkeinen konfigurointi {#post-installation-configuration}

### DNS-tietueiden määrittäminen {#dns-records-setup}

Sinun tulee määrittää seuraavat DNS-tietueet domainillesi:

#### MX-tietue {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-tietueet {#a-records}

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

#### SPF-tietue {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-tietue {#dkim-record}

Hanki DKIM-julkinen avain:

```bash
# Ota DKIM-julkinen avain talteen
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Luo DKIM DNS -tietue:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-tietue {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Ensimmäinen kirjautuminen {#first-login}

1. Avaa verkkoselaimesi ja siirry osoitteeseen `https://yourdomain.com`
2. Syötä aiemmin tallentamasi perusautentikointitiedot
3. Täytä alkuasetusten ohjattu toiminto
4. Luo ensimmäinen sähköpostitilisi


## Varmuuskopioinnin konfigurointi {#backup-configuration}

### S3-yhteensopivan varmuuskopion määrittäminen {#set-up-s3-compatible-backup}

Määritä automatisoidut varmuuskopiot S3-yhteensopivaan tallennustilaan:

```bash
# Luo AWS-tunnistetiedostojen hakemisto
mkdir -p ~/.aws

# Määritä AWS-tunnistetiedot
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Määritä AWS-asetukset
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Ei-AWS S3:lle (kuten Cloudflare R2) lisää päätepisteen URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Varmuuskopiointiaikataulujen asettaminen {#set-up-backup-cron-jobs}

```bash
# Tee varmuuskopiointiskripteistä suoritettavia
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Lisää MongoDB-varmuuskopiointiaikataulu (suoritetaan päivittäin keskiyöllä)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Lisää Redis-varmuuskopiointiaikataulu (suoritetaan päivittäin keskiyöllä)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Varmista, että aikataulut lisättiin
crontab -l
```


## Automaattisen päivityksen määritys {#auto-update-configuration}

Aseta automaattiset päivitykset Forward Email -asennuksellesi:

```bash
# Luo automaattisen päivityksen komento (käytä sopivaa docker compose -komentoa)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Lisää automaattisen päivityksen aikataulu (suoritetaan päivittäin klo 1)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Varmista, että aikataulu lisättiin
crontab -l
```


## Debian-spesifiset seikat {#debian-specific-considerations}

### Pakettien hallinnan erot {#package-management-differences}

* **Snapd**: Ei asennettu oletuksena Debianissa, vaatii manuaalisen asennuksen
* **Docker**: Käyttää Debian-spesifisiä arkistoja ja GPG-avaimia
* **UFW**: Ei välttämättä sisälly minimiasennuksiin Debianissa
* **systemd**: Käyttäytyminen voi poiketa hieman Ubuntusta

### Palveluiden hallinta {#service-management}

```bash
# Tarkista palveluiden tila (Debian-spesifiset komennot)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Käynnistä palvelut uudelleen tarvittaessa
systemctl restart snapd
systemctl restart docker
```

### Verkkokonfiguraatio {#network-configuration}

Debianissa verkkoliittymien nimet tai asetukset voivat olla erilaiset:

```bash
# Tarkista verkkoliittymät
ip addr show

# Tarkista reititys
ip route show

# Tarkista DNS-resoluutio
nslookup google.com
```


## Ylläpito ja valvonta {#maintenance-and-monitoring}

### Lokien sijainnit {#log-locations}

* **Docker Compose -lokit**: Käytä asennuksen mukaista docker compose -komentoa
* **Järjestelmälokit**: `/var/log/syslog`
* **Varmuuskopiolokit**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automaattisen päivityksen lokit**: `/var/log/autoupdate.log`
* **Snapd-lokit**: `journalctl -u snapd`

### Säännölliset ylläpitotehtävät {#regular-maintenance-tasks}

1. **Seuraa levytilaa**: `df -h`
2. **Tarkista palveluiden tila**: Käytä sopivaa docker compose -komentoa
3. **Tarkista lokit**: Tarkista sekä sovellus- että järjestelmälokit
4. **Päivitä järjestelmäpaketit**: `apt update && apt upgrade`
5. **Valvo snapd:tä**: `snap list` ja `snap refresh`

### Sertifikaattien uusiminen {#certificate-renewal}

Sertifikaattien pitäisi uusiutua automaattisesti, mutta voit uusia ne manuaalisesti tarvittaessa:

```bash
# Manuaalinen sertifikaatin uusiminen
certbot renew

# Kopioi uusitut sertifikaatit
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Käynnistä palvelut uudelleen käyttämään uusia sertifikaatteja
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Vianmääritys {#troubleshooting}

### Debian-spesifiset ongelmat {#debian-specific-issues}

#### 1. Snapd ei toimi {#1-snapd-not-working}

```bash
# Tarkista snapd:n tila
systemctl status snapd

# Käynnistä snapd uudelleen
systemctl restart snapd

# Tarkista snap-polku
echo $PATH | grep snap

# Lisää snap PATH:iin, jos puuttuu
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose -komentoa ei löydy {#2-docker-compose-command-not-found}

```bash
# Tarkista, kumpi docker compose -komento on käytettävissä
command -v docker-compose
command -v docker

# Käytä sopivaa komentoa skripteissä
if command -v docker-compose &> /dev/null; then
    echo "Käytetään docker-compose"
else
    echo "Käytetään docker compose"
fi
```
#### 3. Pakettien Asennusongelmat {#3-package-installation-issues}

```bash
# Päivitä pakettivälimuisti
apt update

# Korjaa rikkinäiset paketit
apt --fix-broken install

# Tarkista pidätetyt paketit
apt-mark showhold
```

### Yleiset Ongelmät {#common-issues}

#### 1. Docker-palvelu Ei Käynnisty {#1-docker-service-wont-start}

```bash
# Tarkista Dockerin tila
systemctl status docker

# Tarkista Dockerin lokit
journalctl -u docker

# Kokeile vaihtoehtoista käynnistystä
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Sertifikaatin Luonti Epäonnistuu {#2-certificate-generation-fails}

* Varmista, että portit 80 ja 443 ovat saavutettavissa
* Tarkista, että DNS-tietueet osoittavat palvelimellesi
* Tarkista palomuuriasetukset komennolla `ufw status`

#### 3. Sähköpostin Toimitusongelmat {#3-email-delivery-issues}

* Varmista, että MX-tietueet ovat oikein
* Tarkista SPF-, DKIM- ja DMARC-tietueet
* Varmista, ettei portti 25 ole estetty hosting-palveluntarjoajasi toimesta

### Apua Saatavilla {#getting-help}

* **Dokumentaatio**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian Dokumentaatio**: <https://www.debian.org/doc/>


## Turvallisuuden Parhaat Käytännöt {#security-best-practices}

1. **Pidä Järjestelmä Päivitettynä**: Päivitä Debian ja paketit säännöllisesti
2. **Seuraa Lokitiedostoja**: Ota käyttöön lokien seuranta ja hälytykset
3. **Varmuuskopioi Säännöllisesti**: Testaa varmuuskopiointi- ja palautusmenettelyt
4. **Käytä Vahvoja Salasanoja**: Luo vahvat salasanat kaikille tileille
5. **Ota Fail2Ban Käyttöön**: Harkitse fail2banin asentamista lisäturvaksi
6. **Säännölliset Turvatarkastukset**: Tarkista kokoonpano aika ajoin
7. **Seuraa Snapd:tä**: Pidä snap-paketit ajan tasalla komennolla `snap refresh`


## Yhteenveto {#conclusion}

Forward Email -itseisännöity asennuksesi pitäisi nyt olla valmis ja toiminnassa Debianilla. Muista:

1. Määritä DNS-tietueesi oikein
2. Testaa sähköpostin lähetys ja vastaanotto
3. Ota käyttöön säännölliset varmuuskopiot
4. Seuraa järjestelmääsi säännöllisesti
5. Pidä asennuksesi ajan tasalla
6. Seuraa snapd:tä ja snap-paketteja

Suurimmat erot Ubuntuun verrattuna ovat snapd:n asennus ja Dockerin arkiston konfigurointi. Kun nämä on asetettu oikein, Forward Email -sovellus käyttäytyy molemmissa järjestelmissä identtisesti.

Lisäasetuksia ja edistyneitä ominaisuuksia varten katso virallinen Forward Email -dokumentaatio osoitteessa <https://forwardemail.net/self-hosted#configuration>.
