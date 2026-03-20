# Forward Email Itseisännöinnin Asennusopas Ubuntulle {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Esivaatimukset](#prerequisites)
* [Järjestelmävaatimukset](#system-requirements)
* [Asennus vaihe vaiheelta](#step-by-step-installation)
  * [Vaihe 1: Järjestelmän alkuasetukset](#step-1-initial-system-setup)
  * [Vaihe 2: DNS-resolverien konfigurointi](#step-2-configure-dns-resolvers)
  * [Vaihe 3: Järjestelmäriippuvuuksien asennus](#step-3-install-system-dependencies)
  * [Vaihe 4: Snap-pakettien asennus](#step-4-install-snap-packages)
  * [Vaihe 5: Dockerin asennus](#step-5-install-docker)
  * [Vaihe 6: Docker-palvelun konfigurointi](#step-6-configure-docker-service)
  * [Vaihe 7: Palomuurin konfigurointi](#step-7-configure-firewall)
  * [Vaihe 8: Forward Email -varaston kloonaus](#step-8-clone-forward-email-repository)
  * [Vaihe 9: Ympäristökonfiguraation asettaminen](#step-9-set-up-environment-configuration)
  * [Vaihe 10: Domainin konfigurointi](#step-10-configure-your-domain)
  * [Vaihe 11: SSL-sertifikaattien luonti](#step-11-generate-ssl-certificates)
  * [Vaihe 12: Salausavainten luonti](#step-12-generate-encryption-keys)
  * [Vaihe 13: SSL-polkujen päivittäminen konfiguraatiossa](#step-13-update-ssl-paths-in-configuration)
  * [Vaihe 14: Perustodennuksen asettaminen](#step-14-set-up-basic-authentication)
  * [Vaihe 15: Julkaisu Docker Composella](#step-15-deploy-with-docker-compose)
  * [Vaihe 16: Asennuksen tarkistus](#step-16-verify-installation)
* [Asennuksen jälkeinen konfigurointi](#post-installation-configuration)
  * [DNS-tietueiden asettaminen](#dns-records-setup)
  * [Ensimmäinen kirjautuminen](#first-login)
* [Varmuuskopioinnin konfigurointi](#backup-configuration)
  * [S3-yhteensopivan varmuuskopion asettaminen](#set-up-s3-compatible-backup)
  * [Varmuuskopiointiaikataulujen asettaminen](#set-up-backup-cron-jobs)
* [Automaattisen päivityksen konfigurointi](#auto-update-configuration)
* [Ylläpito ja valvonta](#maintenance-and-monitoring)
  * [Lokien sijainnit](#log-locations)
  * [Säännölliset ylläpitotehtävät](#regular-maintenance-tasks)
  * [Sertifikaatin uusiminen](#certificate-renewal)
* [Vianmääritys](#troubleshooting)
  * [Yleiset ongelmat](#common-issues)
  * [Avun saaminen](#getting-help)
* [Turvallisuuden parhaat käytännöt](#security-best-practices)
* [Yhteenveto](#conclusion)


## Yleiskatsaus {#overview}

Tämä opas tarjoaa vaiheittaiset ohjeet Forward Emailin itseisännöidyn ratkaisun asentamiseen Ubuntu-järjestelmiin. Opas on erityisesti räätälöity Ubuntu 20.04, 22.04 ja 24.04 LTS -versioille.


## Esivaatimukset {#prerequisites}

Ennen asennuksen aloittamista varmista, että sinulla on:

* **Ubuntu Server**: 20.04, 22.04 tai 24.04 LTS
* **Root-käyttöoikeus**: Sinun tulee pystyä suorittamaan komentoja root-käyttäjänä (sudo-oikeudet)
* **Domain-nimi**: Hallitsemasi domain, johon sinulla on DNS-hallintaoikeudet
* **Puhdas palvelin**: Suositellaan käytettäväksi uutta Ubuntu-asennusta
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

### Vaihe 2: DNS-resolverien konfigurointi {#step-2-configure-dns-resolvers}

Konfiguroi järjestelmäsi käyttämään Cloudflaren DNS-palvelimia luotettavaa sertifikaattien luontia varten:

```bash
# Pysäytä ja poista käytöstä systemd-resolved jos se on käynnissä
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Konfiguroi Cloudflaren DNS-resolverit
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

Asenna Forward Email -palvelun tarvitsemat paketit:

```bash
# Päivitä pakettien lista
apt-get update -y

# Asenna perusriippuvuudet
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Step 4: Asenna Snap-paketit {#step-4-install-snap-packages}

Asenna AWS CLI ja Certbot snapin kautta:

```bash
# Asenna AWS CLI
snap install aws-cli --classic

# Asenna Certbot ja DNS-laajennus
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: Asenna Docker {#step-5-install-docker}

Asenna Docker CE ja Docker Compose:

```bash
# Lisää Dockerin virallinen GPG-avain
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Lisää Dockerin arkisto
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Päivitä pakettien indeksi ja asenna Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vahvista Dockerin asennus
docker --version
docker compose version
```

### Step 6: Määritä Docker-palvelu {#step-6-configure-docker-service}

Varmista, että Docker käynnistyy automaattisesti ja on käynnissä:

```bash
# Ota Docker-palvelu käyttöön ja käynnistä se
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Tarkista, että Docker on käynnissä
docker info
```

Jos Docker ei käynnisty, kokeile käynnistää se manuaalisesti:

```bash
# Vaihtoehtoinen käynnistystapa, jos systemctl epäonnistuu
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 7: Määritä palomuuri {#step-7-configure-firewall}

Ota UFW-palomuuri käyttöön ja suojaa palvelimesi:

```bash
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

### Step 8: Kopioi Forward Email -varasto {#step-8-clone-forward-email-repository}

Lataa Forward Email -lähdekoodi:

```bash
# Määritä muuttujat
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Kopioi varasto
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Vahvista, että kopiointi onnistui
ls -la
```

### Step 9: Valmistele ympäristöasetukset {#step-9-set-up-environment-configuration}

Valmistele ympäristökonfiguraatio:

```bash
# Määritä hakemistomuuttujat
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopioi oletustiedosto ympäristölle
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Luo SSL-hakemisto
mkdir -p "$SELF_HOST_DIR/ssl"

# Luo tietokantahakemistot
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 10: Määritä domainisi {#step-10-configure-your-domain}

Aseta domain-nimesi ja päivitä ympäristömuuttujat:

```bash
# Korvaa 'yourdomain.com' omalla domainillasi
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

# Päivitä domainiin liittyvät ympäristömuuttujat
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
### Vaihe 11: Luo SSL-sertifikaatit {#step-11-generate-ssl-certificates}

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

**Tärkeää**: Kun sinua pyydetään, sinun tulee luoda TXT-tietueita DNS:ään. Saatat nähdä useita haasteita samalle domainille - **luo KAIKKI niistä**. Älä poista ensimmäistä TXT-tietuetta lisätessäsi toista.

#### Vaihtoehto B: Cloudflare DNS (Jos käytät Cloudflareä) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jos domainisi käyttää Cloudflareä DNS:ään, voit automatisoida sertifikaattien luomisen:

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

#### Kopioi sertifikaatit {#copy-certificates}

Sertifikaattien luomisen jälkeen kopioi ne sovelluskansioon:

```bash
# Kopioi sertifikaatit sovelluksen SSL-kansioon
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Varmista, että sertifikaatit kopioitiin
ls -la "$SELF_HOST_DIR/ssl/"
```

### Vaihe 12: Luo salausavaimet {#step-12-generate-encryption-keys}

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

# Luo DKIM-yksityinen avain sähköpostin allekirjoitusta varten
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Luo webhookin allekirjoitusavain
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Aseta SMTP-siirtosalasana
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Kaikki salausavaimet luotu onnistuneesti"
```

### Vaihe 13: Päivitä SSL-polut asetustiedostossa {#step-13-update-ssl-paths-in-configuration}

Määritä SSL-sertifikaattien polut ympäristötiedostossa:

```bash
# Päivitä SSL-polut osoittamaan oikeisiin sertifikaattitiedostoihin
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Vaihe 14: Ota käyttöön perusautentikointi {#step-14-set-up-basic-authentication}

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
echo "Tarvitset nämä päästäksesi web-käyttöliittymään asennuksen jälkeen."
echo ""
```

### Vaihe 15: Ota käyttöön Docker Composella {#step-15-deploy-with-docker-compose}

Käynnistä kaikki Forward Email -palvelut:

```bash
# Määritä Docker Compose -tiedoston polku
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Pysäytä mahdolliset olemassa olevat kontit
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Vedä uusimmat kuvat
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Käynnistä kaikki palvelut irrotetussa tilassa
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Odota hetki, että palvelut käynnistyvät
sleep 10

# Tarkista palveluiden tila
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Vaihe 16: Vahvista asennus {#step-16-verify-installation}

Tarkista, että kaikki palvelut toimivat oikein:

```bash
# Tarkista Docker-kontit
docker ps

# Tarkista palvelulokit virheiden varalta
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Testaa verkkokäyttöliittymän yhteys
curl -I https://$DOMAIN

# Tarkista, kuuntelevatko portit
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
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

Hanki DKIM-julkinen avaimesi:

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
3. Suorita alkuasetusten ohjattu toiminto loppuun
4. Luo ensimmäinen sähköpostitilisi


## Varmuuskopioinnin konfigurointi {#backup-configuration}

### S3-yhteensopivan varmuuskopion määrittäminen {#set-up-s3-compatible-backup}

Määritä automaattiset varmuuskopiot S3-yhteensopivaan tallennustilaan:

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

### Varmuuskopiointiaikataulujen määrittäminen {#set-up-backup-cron-jobs}

```bash
# Tee varmuuskopiointiskriptit suoritettaviksi
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Lisää MongoDB-varmuuskopiointiaikataulu (suoritetaan päivittäin keskiyöllä)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Lisää Redis-varmuuskopiointiaikataulu (suoritetaan päivittäin keskiyöllä)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Varmista, että aikataulut lisättiin
crontab -l
```


## Automaattisen päivityksen konfigurointi {#auto-update-configuration}

Määritä automaattiset päivitykset Forward Email -asennuksellesi:

```bash
# Luo automaattisen päivityksen komento
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Lisää automaattisen päivityksen aikataulu (suoritetaan päivittäin klo 1)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Varmista, että aikataulu lisättiin
crontab -l
```


## Ylläpito ja valvonta {#maintenance-and-monitoring}

### Lokien sijainnit {#log-locations}

* **Docker Compose -lokit**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Järjestelmälokit**: `/var/log/syslog`
* **Varmuuskopiolokit**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Automaattisen päivityksen lokit**: `/var/log/autoupdate.log`

### Säännölliset ylläpitotehtävät {#regular-maintenance-tasks}

1. **Seuraa levytilaa**: `df -h`
2. **Tarkista palveluiden tila**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Tarkastele lokitiedostoja**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Päivitä järjestelmäpaketit**: `apt update && apt upgrade`
5. **Uudista varmenteet**: Varmenteet uusiutuvat automaattisesti, mutta seuraa niiden vanhenemista

### Varmenneuudistus {#certificate-renewal}

Varmenteiden pitäisi uusiutua automaattisesti, mutta voit myös uusia ne manuaalisesti tarvittaessa:

```bash
# Manuaalinen varmenteen uusiminen
certbot renew

# Kopioi uusitut varmenteet
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Käynnistä palvelut uudelleen käyttämään uusia varmenteita
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Vianmääritys {#troubleshooting}

### Yleiset ongelmat {#common-issues}

#### 1. Docker-palvelu ei käynnisty {#1-docker-service-wont-start}

```bash
# Tarkista Dockerin tila
systemctl status docker

# Kokeile vaihtoehtoista käynnistystä
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Sertifikaatin luonti epäonnistuu {#2-certificate-generation-fails}

* Varmista, että portit 80 ja 443 ovat saavutettavissa
* Tarkista, että DNS-tietueet osoittavat palvelimellesi
* Tarkista palomuurin asetukset

#### 3. Sähköpostin toimitusongelmat {#3-email-delivery-issues}

* Varmista, että MX-tietueet ovat oikein
* Tarkista SPF-, DKIM- ja DMARC-tietueet
* Varmista, ettei portti 25 ole estetty hosting-palveluntarjoajasi toimesta

#### 4. Verkkokäyttöliittymä ei ole saavutettavissa {#4-web-interface-not-accessible}

* Tarkista palomuurin asetukset: `ufw status`
* Varmista SSL-sertifikaatit: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Tarkista perusautentikoinnin tunnistetiedot

### Apua {#getting-help}

* **Dokumentaatio**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Yhteisön tuki**: Tarkista projektin GitHub-keskustelut


## Turvallisuuden parhaat käytännöt {#security-best-practices}

1. **Pidä järjestelmä ajan tasalla**: Päivitä Ubuntu ja paketit säännöllisesti
2. **Seuraa lokitiedostoja**: Ota käyttöön lokien seuranta ja hälytykset
3. **Varmuuskopioi säännöllisesti**: Testaa varmuuskopiointi- ja palautusmenettelyt
4. **Käytä vahvoja salasanoja**: Luo vahvat salasanat kaikille tileille
5. **Ota Fail2Ban käyttöön**: Harkitse fail2banin asentamista lisäturvaksi
6. **Säännölliset turvallisuustarkastukset**: Tarkista kokoonpano aika ajoin


## Yhteenveto {#conclusion}

Forward Email -itseisännöity asennuksesi pitäisi nyt olla valmis ja toiminnassa Ubuntulla. Muista:

1. Määritä DNS-tietueesi oikein
2. Testaa sähköpostin lähetys ja vastaanotto
3. Ota käyttöön säännölliset varmuuskopiot
4. Seuraa järjestelmääsi säännöllisesti
5. Pidä asennuksesi ajan tasalla

Lisäasetuksia ja edistyneitä ominaisuuksia varten katso virallinen Forward Email -dokumentaatio osoitteessa <https://forwardemail.net/self-hosted#configuration>.
