# Průvodce instalací Forward Email pro vlastní hosting na Debianu {#forward-email-self-hosting-installation-guide-for-debian}


## Obsah {#table-of-contents}

* [Přehled](#overview)
* [Požadavky](#prerequisites)
* [Systémové požadavky](#system-requirements)
* [Krok za krokem instalace](#step-by-step-installation)
  * [Krok 1: Počáteční nastavení systému](#step-1-initial-system-setup)
  * [Krok 2: Konfigurace DNS resolverů](#step-2-configure-dns-resolvers)
  * [Krok 3: Instalace systémových závislostí](#step-3-install-system-dependencies)
  * [Krok 4: Instalace a konfigurace Snapd](#step-4-install-and-configure-snapd)
  * [Krok 5: Instalace Snap balíčků](#step-5-install-snap-packages)
  * [Krok 6: Instalace Dockeru](#step-6-install-docker)
  * [Krok 7: Konfigurace služby Docker](#step-7-configure-docker-service)
  * [Krok 8: Instalace a konfigurace firewallu UFW](#step-8-install-and-configure-ufw-firewall)
  * [Krok 9: Klonování repozitáře Forward Email](#step-9-clone-forward-email-repository)
  * [Krok 10: Nastavení konfiguračního prostředí](#step-10-set-up-environment-configuration)
  * [Krok 11: Konfigurace vaší domény](#step-11-configure-your-domain)
  * [Krok 12: Generování SSL certifikátů](#step-12-generate-ssl-certificates)
  * [Krok 13: Generování šifrovacích klíčů](#step-13-generate-encryption-keys)
  * [Krok 14: Aktualizace cest k SSL v konfiguraci](#step-14-update-ssl-paths-in-configuration)
  * [Krok 15: Nastavení základní autentizace](#step-15-set-up-basic-authentication)
  * [Krok 16: Nasazení pomocí Docker Compose](#step-16-deploy-with-docker-compose)
  * [Krok 17: Ověření instalace](#step-17-verify-installation)
* [Konfigurace po instalaci](#post-installation-configuration)
  * [Nastavení DNS záznamů](#dns-records-setup)
  * [První přihlášení](#first-login)
* [Zálohování konfigurace](#backup-configuration)
  * [Nastavení zálohování kompatibilního s S3](#set-up-s3-compatible-backup)
  * [Nastavení zálohovacích cron úloh](#set-up-backup-cron-jobs)
* [Konfigurace automatických aktualizací](#auto-update-configuration)
* [Specifika Debianu](#debian-specific-considerations)
  * [Rozdíly v správě balíčků](#package-management-differences)
  * [Správa služeb](#service-management)
  * [Konfigurace sítě](#network-configuration)
* [Údržba a monitoring](#maintenance-and-monitoring)
  * [Umístění logů](#log-locations)
  * [Pravidelné údržbové úkoly](#regular-maintenance-tasks)
  * [Obnova certifikátů](#certificate-renewal)
* [Řešení problémů](#troubleshooting)
  * [Specifické problémy Debianu](#debian-specific-issues)
  * [Běžné problémy](#common-issues)
  * [Získání pomoci](#getting-help)
* [Nejlepší bezpečnostní postupy](#security-best-practices)
* [Závěr](#conclusion)


## Přehled {#overview}

Tento průvodce poskytuje krok za krokem instrukce pro instalaci vlastní hostované verze Forward Email na systémech Debian. Průvodce je speciálně přizpůsoben pro Debian 11 (Bullseye) a Debian 12 (Bookworm).


## Požadavky {#prerequisites}

Před zahájením instalace se ujistěte, že máte:

* **Debian server**: Verze 11 (Bullseye) nebo 12 (Bookworm)
* **Root přístup**: Musíte být schopni spouštět příkazy jako root (přístup přes sudo)
* **Doménové jméno**: Doménu, kterou ovládáte s přístupem ke správě DNS
* **Čistý server**: Doporučuje se použít čerstvou instalaci Debianu
* **Připojení k internetu**: Potřebné pro stahování balíčků a Docker image


## Systémové požadavky {#system-requirements}

* **RAM**: Minimálně 2GB (doporučeno 4GB pro produkci)
* **Úložiště**: Minimálně 20GB volného místa (doporučeno 50GB+ pro produkci)
* **CPU**: Minimálně 1 vCPU (doporučeno 2+ vCPU pro produkci)
* **Síť**: Veřejná IP adresa s přístupnými následujícími porty:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Krok za krokem instalace {#step-by-step-installation}

### Krok 1: Počáteční nastavení systému {#step-1-initial-system-setup}

Nejprve se ujistěte, že je váš systém aktuální a přepněte se na uživatele root:

```bash
# Aktualizace systémových balíčků
sudo apt update && sudo apt upgrade -y

# Přepnutí na uživatele root (vyžadováno pro instalaci)
sudo su -
```
### Krok 2: Konfigurace DNS resolverů {#step-2-configure-dns-resolvers}

Nakonfigurujte svůj systém tak, aby používal DNS servery Cloudflare pro spolehlivou generaci certifikátů:

```bash
# Zastavte a zakažte systemd-resolved, pokud běží
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Nakonfigurujte DNS resolvery Cloudflare
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

### Krok 3: Instalace systémových závislostí {#step-3-install-system-dependencies}

Nainstalujte požadované balíčky pro Forward Email na Debianu:

```bash
# Aktualizace seznamu balíčků
apt-get update -y

# Instalace základních závislostí (seznam balíčků specifický pro Debian)
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

### Krok 4: Instalace a konfigurace Snapd {#step-4-install-and-configure-snapd}

Debian standardně neobsahuje snapd, proto jej musíme nainstalovat a nakonfigurovat:

```bash
# Instalace snapd
apt-get install -y snapd

# Povolení a spuštění služby snapd
systemctl enable snapd
systemctl start snapd

# Vytvoření symlinku, aby snap správně fungoval
ln -sf /var/lib/snapd/snap /snap

# Počkejte, až bude snapd připraven
sleep 10

# Ověření funkčnosti snapd
snap version
```

### Krok 5: Instalace Snap balíčků {#step-5-install-snap-packages}

Nainstalujte AWS CLI a Certbot přes snap:

```bash
# Instalace AWS CLI
snap install aws-cli --classic

# Instalace Certbot a DNS pluginu
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Ověření instalací
aws --version
certbot --version
```

### Krok 6: Instalace Dockeru {#step-6-install-docker}

Nainstalujte Docker CE a Docker Compose na Debianu:

```bash
# Přidání oficiálního GPG klíče Dockeru (specifické pro Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Přidání Docker repozitáře (specifické pro Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Aktualizace indexu balíčků a instalace Dockeru
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Instalace samostatného docker-compose jako záloha (pokud plugin nefunguje)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Ověření instalace Dockeru
docker --version
docker compose version || docker-compose --version
```

### Krok 7: Konfigurace služby Docker {#step-7-configure-docker-service}

Zajistěte, aby se Docker spouštěl automaticky a běžel:

```bash
# Povolení a spuštění služby Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Ověření, že Docker běží
docker info
```

Pokud Docker nelze spustit, zkuste jej spustit ručně:

```bash
# Alternativní způsob spuštění, pokud systemctl selže
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Krok 8: Instalace a konfigurace firewallu UFW {#step-8-install-and-configure-ufw-firewall}

Minimální instalace Debianu nemusí obsahovat UFW, proto jej nejprve nainstalujte:

```bash
# Instalace UFW, pokud není přítomen
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Nastavení výchozích pravidel
ufw default deny incoming
ufw default allow outgoing

# Povolení SSH (důležité - nezamkněte se!)
ufw allow 22/tcp

# Povolení portů souvisejících s e-mailem
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (pro Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternativní port)
ufw allow 2995/tcp  # POP3 (alternativní port)
ufw allow 3456/tcp  # Vlastní port služby
ufw allow 4000/tcp  # Vlastní port služby
ufw allow 5000/tcp  # Vlastní port služby

# Povolení lokálních připojení k databázím
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Povolení firewallu
echo "y" | ufw enable

# Kontrola stavu firewallu
ufw status numbered
```
### Krok 9: Naklonujte repozitář Forward Email {#step-9-clone-forward-email-repository}

Stáhněte zdrojový kód Forward Email:

```bash
# Nastavení proměnných
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Naklonování repozitáře
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Ověření úspěšného naklonování
ls -la
```

### Krok 10: Nastavení konfiguračního prostředí {#step-10-set-up-environment-configuration}

Připravte konfigurační prostředí:

```bash
# Nastavení proměnných adresářů
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopírování výchozího souboru prostředí
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Vytvoření adresáře SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Vytvoření adresářů databází
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Krok 11: Konfigurace vaší domény {#step-11-configure-your-domain}

Nastavte název domény a aktualizujte proměnné prostředí:

```bash
# Nahraďte 'yourdomain.com' vaší skutečnou doménou
DOMAIN="yourdomain.com"

# Funkce pro aktualizaci souboru prostředí
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Aktualizace proměnných prostředí souvisejících s doménou
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

### Krok 12: Generování SSL certifikátů {#step-12-generate-ssl-certificates}

#### Možnost A: Manuální DNS výzva (doporučeno pro většinu uživatelů) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generování certifikátů pomocí manuální DNS výzvy
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Důležité**: Po výzvě budete muset vytvořit TXT záznamy ve vaší DNS. Můžete vidět více výzev pro stejnou doménu – **vytvořte VŠECHNY z nich**. Nepřekrývejte první TXT záznam při přidávání druhého.

#### Možnost B: Cloudflare DNS (pokud používáte Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Pokud vaše doména používá Cloudflare pro DNS, můžete automatizovat generování certifikátů:

```bash
# Vytvoření souboru s přihlašovacími údaji pro Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Nastavení správných oprávnění
chmod 600 /root/.cloudflare.ini

# Automatické generování certifikátů
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Kopírování certifikátů {#copy-certificates}

Po vygenerování certifikátů je zkopírujte do adresáře aplikace:

```bash
# Kopírování certifikátů do SSL adresáře aplikace
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Ověření, že certifikáty byly zkopírovány
ls -la "$SELF_HOST_DIR/ssl/"
```

### Krok 13: Generování šifrovacích klíčů {#step-13-generate-encryption-keys}

Vytvořte různé šifrovací klíče potřebné pro bezpečný provoz:

```bash
# Generování pomocného šifrovacího klíče
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generování SRS tajemství pro přeposílání emailů
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generování TXT šifrovacího klíče
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generování DKIM privátního klíče pro podepisování emailů
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generování klíče pro podpis webhooku
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Nastavení hesla pro SMTP transport
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Všechny šifrovací klíče byly úspěšně vygenerovány"
```
### Krok 14: Aktualizace cest SSL v konfiguraci {#step-14-update-ssl-paths-in-configuration}

Nakonfigurujte cesty k SSL certifikátům v souboru prostředí:

```bash
# Aktualizujte cesty SSL tak, aby ukazovaly na správné soubory certifikátů
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Krok 15: Nastavení základní autentizace {#step-15-set-up-basic-authentication}

Vytvořte dočasné přihlašovací údaje pro základní autentizaci:

```bash
# Vygenerujte bezpečné náhodné heslo
PASSWORD=$(openssl rand -base64 16)

# Aktualizujte soubor prostředí s přihlašovacími údaji základní autentizace
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Zobrazte přihlašovací údaje (uložte si je!)
echo ""
echo "🔐 DŮLEŽITÉ: Uložte si tyto přihlašovací údaje!"
echo "=================================="
echo "Uživatelské jméno: admin"
echo "Heslo: $PASSWORD"
echo "=================================="
echo ""
echo "Tyto údaje budete potřebovat pro přístup k webovému rozhraní po instalaci."
echo ""
```

### Krok 16: Nasazení pomocí Docker Compose {#step-16-deploy-with-docker-compose}

Spusťte všechny služby Forward Email:

```bash
# Nastavte cestu k souboru Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Zastavte případné existující kontejnery
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Stáhněte nejnovější image
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Spusťte všechny služby v odpojeném režimu
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Počkejte chvíli, než se služby spustí
sleep 10

# Zkontrolujte stav služeb
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Krok 17: Ověření instalace {#step-17-verify-installation}

Zkontrolujte, že všechny služby běží správně:

```bash
# Zkontrolujte Docker kontejnery
docker ps

# Zkontrolujte logy služeb na případné chyby
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Otestujte připojení k webovému rozhraní
curl -I https://$DOMAIN

# Zkontrolujte, zda porty naslouchají
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Konfigurace po instalaci {#post-installation-configuration}

### Nastavení DNS záznamů {#dns-records-setup}

Musíte nakonfigurovat následující DNS záznamy pro vaši doménu:

#### MX záznam {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A záznamy {#a-records}

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

#### SPF záznam {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM záznam {#dkim-record}

Získejte svůj veřejný DKIM klíč:

```bash
# Extrahujte veřejný DKIM klíč
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Vytvořte DKIM DNS záznam:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC záznam {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### První přihlášení {#first-login}

1. Otevřete svůj webový prohlížeč a přejděte na `https://yourdomain.com`
2. Zadejte přihlašovací údaje základní autentizace, které jste si uložili dříve
3. Dokončete úvodní průvodce nastavením
4. Vytvořte svůj první e-mailový účet


## Konfigurace zálohování {#backup-configuration}

### Nastavení zálohování kompatibilního s S3 {#set-up-s3-compatible-backup}

Nakonfigurujte automatizované zálohy do úložiště kompatibilního se S3:

```bash
# Vytvořte adresář pro AWS přihlašovací údaje
mkdir -p ~/.aws

# Nakonfigurujte AWS přihlašovací údaje
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Nakonfigurujte AWS nastavení
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Pro S3 mimo AWS (např. Cloudflare R2) přidejte URL koncového bodu
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Nastavení zálohovacích cron úloh {#set-up-backup-cron-jobs}

```bash
# Nastavte spustitelnost zálohovacích skriptů
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Přidejte cron úlohu pro zálohu MongoDB (spouští se denně o půlnoci)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Přidejte cron úlohu pro zálohu Redis (spouští se denně o půlnoci)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Ověřte, že cron úlohy byly přidány
crontab -l
```


## Konfigurace automatické aktualizace {#auto-update-configuration}

Nastavte automatické aktualizace pro vaši instalaci Forward Email:

```bash
# Vytvořte příkaz pro automatickou aktualizaci (použijte odpovídající příkaz docker compose)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Přidejte cron úlohu pro automatickou aktualizaci (spouští se denně v 1:00)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Ověřte, že cron úloha byla přidána
crontab -l
```


## Specifika Debianu {#debian-specific-considerations}

### Rozdíly v správě balíčků {#package-management-differences}

* **Snapd**: Není na Debianu nainstalován ve výchozím stavu, vyžaduje ruční instalaci
* **Docker**: Používá repozitáře a GPG klíče specifické pro Debian
* **UFW**: Může chybět v minimálních instalacích Debianu
* **systemd**: Chování může mírně lišit od Ubuntu

### Správa služeb {#service-management}

```bash
# Zkontrolujte stav služeb (příkazy specifické pro Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restartujte služby, pokud je to potřeba
systemctl restart snapd
systemctl restart docker
```

### Konfigurace sítě {#network-configuration}

Debian může mít odlišná jména síťových rozhraní nebo konfigurace:

```bash
# Zobrazte síťová rozhraní
ip addr show

# Zobrazte směrování
ip route show

# Zkontrolujte DNS rozlišení
nslookup google.com
```


## Údržba a monitoring {#maintenance-and-monitoring}

### Umístění logů {#log-locations}

* **Logy Docker Compose**: Použijte odpovídající příkaz docker compose podle instalace
* **Systémové logy**: `/var/log/syslog`
* **Logy záloh**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logy automatické aktualizace**: `/var/log/autoupdate.log`
* **Logy snapd**: `journalctl -u snapd`

### Pravidelné údržbové úkoly {#regular-maintenance-tasks}

1. **Sledujte volné místo na disku**: `df -h`
2. **Kontrola stavu služeb**: Použijte odpovídající příkaz docker compose
3. **Prohlédněte si logy**: Kontrolujte jak aplikační, tak systémové logy
4. **Aktualizujte systémové balíčky**: `apt update && apt upgrade`
5. **Sledujte snapd**: `snap list` a `snap refresh`

### Obnova certifikátů {#certificate-renewal}

Certifikáty by se měly automaticky obnovovat, ale můžete je obnovit ručně, pokud je to potřeba:

```bash
# Ruční obnova certifikátů
certbot renew

# Zkopírujte obnovené certifikáty
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restartujte služby, aby používaly nové certifikáty
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Řešení problémů {#troubleshooting}

### Problémy specifické pro Debian {#debian-specific-issues}

#### 1. Snapd nefunguje {#1-snapd-not-working}

```bash
# Zkontrolujte stav snapd
systemctl status snapd

# Restartujte snapd
systemctl restart snapd

# Zkontrolujte cestu snap
echo $PATH | grep snap

# Přidejte snap do PATH, pokud chybí
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Příkaz Docker Compose nebyl nalezen {#2-docker-compose-command-not-found}

```bash
# Zkontrolujte, který příkaz docker compose je dostupný
command -v docker-compose
command -v docker

# Použijte odpovídající příkaz ve skriptech
if command -v docker-compose &> /dev/null; then
    echo "Používá se docker-compose"
else
    echo "Používá se docker compose"
fi
```
#### 3. Problémy s instalací balíčků {#3-package-installation-issues}

```bash
# Aktualizace cache balíčků
apt update

# Oprava poškozených balíčků
apt --fix-broken install

# Kontrola zadržených balíčků
apt-mark showhold
```

### Běžné problémy {#common-issues}

#### 1. Služba Docker se nespustí {#1-docker-service-wont-start}

```bash
# Kontrola stavu Dockeru
systemctl status docker

# Kontrola logů Dockeru
journalctl -u docker

# Zkuste alternativní spuštění
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Selhání generování certifikátu {#2-certificate-generation-fails}

* Ujistěte se, že porty 80 a 443 jsou přístupné
* Ověřte, že DNS záznamy směřují na váš server
* Zkontrolujte nastavení firewallu pomocí `ufw status`

#### 3. Problémy s doručováním e-mailů {#3-email-delivery-issues}

* Ověřte správnost MX záznamů
* Zkontrolujte SPF, DKIM a DMARC záznamy
* Ujistěte se, že port 25 není blokován vaším poskytovatelem hostingu

### Získání pomoci {#getting-help}

* **Dokumentace**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian Dokumentace**: <https://www.debian.org/doc/>


## Nejlepší bezpečnostní postupy {#security-best-practices}

1. **Udržujte systém aktualizovaný**: Pravidelně aktualizujte Debian a balíčky
2. **Monitorujte logy**: Nastavte sledování logů a upozornění
3. **Pravidelně zálohujte**: Testujte zálohovací a obnovovací postupy
4. **Používejte silná hesla**: Generujte silná hesla pro všechny účty
5. **Povolte Fail2Ban**: Zvažte instalaci fail2ban pro zvýšení bezpečnosti
6. **Pravidelné bezpečnostní audity**: Pravidelně kontrolujte konfiguraci
7. **Sledujte Snapd**: Udržujte snap balíčky aktuální pomocí `snap refresh`


## Závěr {#conclusion}

Vaše self-hosted instalace Forward Email by nyní měla být dokončena a běžet na Debianu. Nezapomeňte:

1. Správně nakonfigurovat DNS záznamy
2. Otestovat odesílání a přijímání e-mailů
3. Nastavit pravidelné zálohy
4. Pravidelně sledovat systém
5. Udržovat instalaci aktualizovanou
6. Monitorovat snapd a snap balíčky

Hlavní rozdíly oproti Ubuntu jsou instalace snapd a konfigurace Docker repozitáře. Jakmile jsou tyto správně nastaveny, aplikace Forward Email se chová na obou systémech identicky.

Pro další možnosti konfigurace a pokročilé funkce se podívejte do oficiální dokumentace Forward Email na <https://forwardemail.net/self-hosted#configuration>.
