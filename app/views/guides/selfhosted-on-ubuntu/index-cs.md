# Průvodce instalací Forward Email pro vlastní hosting na Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Obsah {#table-of-contents}

* [Přehled](#overview)
* [Požadavky](#prerequisites)
* [Systémové požadavky](#system-requirements)
* [Krok za krokem instalace](#step-by-step-installation)
  * [Krok 1: Počáteční nastavení systému](#step-1-initial-system-setup)
  * [Krok 2: Konfigurace DNS resolverů](#step-2-configure-dns-resolvers)
  * [Krok 3: Instalace systémových závislostí](#step-3-install-system-dependencies)
  * [Krok 4: Instalace Snap balíčků](#step-4-install-snap-packages)
  * [Krok 5: Instalace Dockeru](#step-5-install-docker)
  * [Krok 6: Konfigurace Docker služby](#step-6-configure-docker-service)
  * [Krok 7: Konfigurace firewallu](#step-7-configure-firewall)
  * [Krok 8: Klonování repozitáře Forward Email](#step-8-clone-forward-email-repository)
  * [Krok 9: Nastavení konfiguračního prostředí](#step-9-set-up-environment-configuration)
  * [Krok 10: Konfigurace vaší domény](#step-10-configure-your-domain)
  * [Krok 11: Generování SSL certifikátů](#step-11-generate-ssl-certificates)
  * [Krok 12: Generování šifrovacích klíčů](#step-12-generate-encryption-keys)
  * [Krok 13: Aktualizace SSL cest v konfiguraci](#step-13-update-ssl-paths-in-configuration)
  * [Krok 14: Nastavení základní autentizace](#step-14-set-up-basic-authentication)
  * [Krok 15: Nasazení pomocí Docker Compose](#step-15-deploy-with-docker-compose)
  * [Krok 16: Ověření instalace](#step-16-verify-installation)
* [Konfigurace po instalaci](#post-installation-configuration)
  * [Nastavení DNS záznamů](#dns-records-setup)
  * [První přihlášení](#first-login)
* [Zálohování konfigurace](#backup-configuration)
  * [Nastavení zálohování kompatibilního s S3](#set-up-s3-compatible-backup)
  * [Nastavení zálohovacích cron úloh](#set-up-backup-cron-jobs)
* [Konfigurace automatických aktualizací](#auto-update-configuration)
* [Údržba a monitoring](#maintenance-and-monitoring)
  * [Umístění logů](#log-locations)
  * [Pravidelné údržbové úkoly](#regular-maintenance-tasks)
  * [Obnova certifikátů](#certificate-renewal)
* [Řešení problémů](#troubleshooting)
  * [Běžné problémy](#common-issues)
  * [Získání pomoci](#getting-help)
* [Nejlepší bezpečnostní postupy](#security-best-practices)
* [Závěr](#conclusion)


## Přehled {#overview}

Tento průvodce poskytuje krok za krokem instrukce pro instalaci vlastního hostingu Forward Email na systémech Ubuntu. Průvodce je speciálně přizpůsoben pro verze Ubuntu 20.04, 22.04 a 24.04 LTS.


## Požadavky {#prerequisites}

Před zahájením instalace se ujistěte, že máte:

* **Ubuntu Server**: 20.04, 22.04 nebo 24.04 LTS
* **Root přístup**: Musíte být schopni spouštět příkazy jako root (přístup přes sudo)
* **Doménové jméno**: Doménu, kterou ovládáte s přístupem ke správě DNS
* **Čistý server**: Doporučuje se použít čerstvou instalaci Ubuntu
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

Nakonfigurujte systém tak, aby používal Cloudflare DNS servery pro spolehlivou generaci certifikátů:

```bash
# Zastavení a zakázání systemd-resolved, pokud běží
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Konfigurace Cloudflare DNS resolverů
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

Nainstalujte požadované balíčky pro Forward Email:

```bash
# Aktualizace seznamu balíčků
apt-get update -y

# Instalace základních závislostí
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Krok 4: Instalace Snap balíčků {#step-4-install-snap-packages}

Nainstalujte AWS CLI a Certbot přes snap:

```bash
# Instalace AWS CLI
snap install aws-cli --classic

# Instalace Certbot a DNS pluginu
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Krok 5: Instalace Dockeru {#step-5-install-docker}

Nainstalujte Docker CE a Docker Compose:

```bash
# Přidání oficiálního GPG klíče Dockeru
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Přidání Docker repozitáře
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Aktualizace indexu balíčků a instalace Dockeru
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Ověření instalace Dockeru
docker --version
docker compose version
```

### Krok 6: Konfigurace služby Docker {#step-6-configure-docker-service}

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

### Krok 7: Konfigurace firewallu {#step-7-configure-firewall}

Nastavte firewall UFW pro zabezpečení vašeho serveru:

```bash
# Nastavení výchozích pravidel
ufw default deny incoming
ufw default allow outgoing

# Povolení SSH (důležité - nezamkněte se ven!)
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

# Aktivace firewallu
echo "y" | ufw enable

# Kontrola stavu firewallu
ufw status numbered
```

### Krok 8: Klonování repozitáře Forward Email {#step-8-clone-forward-email-repository}

Stáhněte zdrojový kód Forward Email:

```bash
# Nastavení proměnných
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Klonování repozitáře
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Ověření úspěšného klonování
ls -la
```

### Krok 9: Nastavení konfiguračního prostředí {#step-9-set-up-environment-configuration}

Připravte konfigurační prostředí:

```bash
# Nastavení proměnných adresářů
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Kopírování výchozího konfiguračního souboru
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Vytvoření adresáře pro SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Vytvoření adresářů pro databáze
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Krok 10: Konfigurace vaší domény {#step-10-configure-your-domain}

Nastavte název domény a aktualizujte proměnné prostředí:

```bash
# Nahraďte 'yourdomain.com' vaší skutečnou doménou
DOMAIN="yourdomain.com"

# Funkce pro aktualizaci konfiguračního souboru
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
### Krok 11: Generování SSL certifikátů {#step-11-generate-ssl-certificates}

#### Možnost A: Manuální DNS výzva (Doporučeno pro většinu uživatelů) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generování certifikátů pomocí manuální DNS výzvy
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Důležité**: Po výzvě budete muset vytvořit TXT záznamy ve svém DNS. Můžete vidět více výzev pro stejnou doménu - **vytvořte VŠECHNY z nich**. Nepřidávejte druhý TXT záznam bez ponechání prvního.

#### Možnost B: Cloudflare DNS (Pokud používáte Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

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

### Krok 12: Generování šifrovacích klíčů {#step-12-generate-encryption-keys}

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

### Krok 13: Aktualizace cest SSL v konfiguraci {#step-13-update-ssl-paths-in-configuration}

Nakonfigurujte cesty k SSL certifikátům v souboru prostředí:

```bash
# Aktualizace cest SSL tak, aby ukazovaly na správné certifikáty
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Krok 14: Nastavení základní autentizace {#step-14-set-up-basic-authentication}

Vytvořte dočasné přihlašovací údaje pro základní autentizaci:

```bash
# Generování bezpečného náhodného hesla
PASSWORD=$(openssl rand -base64 16)

# Aktualizace souboru prostředí s přihlašovacími údaji pro základní autentizaci
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Zobrazení přihlašovacích údajů (uložte si je!)
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

### Krok 15: Nasazení pomocí Docker Compose {#step-15-deploy-with-docker-compose}

Spusťte všechny služby Forward Email:

```bash
# Nastavení cesty k Docker Compose souboru
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Zastavení všech existujících kontejnerů
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Stažení nejnovějších obrazů
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Spuštění všech služeb na pozadí
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Chvíli počkejte, než se služby spustí
sleep 10

# Kontrola stavu služeb
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Krok 16: Ověření instalace {#step-16-verify-installation}

Zkontrolujte, zda všechny služby běží správně:

```bash
# Zkontrolujte kontejnery Dockeru
docker ps

# Zkontrolujte logy služeb na případné chyby
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Otestujte konektivitu webového rozhraní
curl -I https://$DOMAIN

# Zkontrolujte, zda porty naslouchají
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
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
2. Zadejte základní autentizační údaje, které jste si dříve uložili
3. Dokončete úvodního průvodce nastavením
4. Vytvořte svůj první e-mailový účet


## Konfigurace záloh {#backup-configuration}

### Nastavení záloh kompatibilních se S3 {#set-up-s3-compatible-backup}

Nakonfigurujte automatické zálohy do úložiště kompatibilního se S3:

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

# Pro ne-AWS S3 (např. Cloudflare R2) přidejte URL koncového bodu
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Nastavení cron úloh pro zálohy {#set-up-backup-cron-jobs}

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


## Konfigurace automatických aktualizací {#auto-update-configuration}

Nastavte automatické aktualizace vaší instalace Forward Email:

```bash
# Vytvořte příkaz pro automatickou aktualizaci
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Přidejte cron úlohu pro automatickou aktualizaci (spouští se denně v 1 hodinu ráno)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Ověřte, že cron úloha byla přidána
crontab -l
```


## Údržba a monitoring {#maintenance-and-monitoring}

### Umístění logů {#log-locations}

* **Logy Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Systémové logy**: `/var/log/syslog`
* **Logy záloh**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logy automatických aktualizací**: `/var/log/autoupdate.log`

### Pravidelné údržbové úkoly {#regular-maintenance-tasks}

1. **Sledujte volné místo na disku**: `df -h`
2. **Zkontrolujte stav služeb**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Prohlédněte si logy**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Aktualizujte systémové balíčky**: `apt update && apt upgrade`
5. **Obnovujte certifikáty**: Certifikáty se obnovují automaticky, ale sledujte jejich expiraci

### Obnova certifikátů {#certificate-renewal}

Certifikáty by se měly obnovovat automaticky, ale můžete je obnovit i ručně:

```bash
# Ruční obnova certifikátu
certbot renew

# Zkopírujte obnovené certifikáty
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restartujte služby, aby používaly nové certifikáty
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Řešení problémů {#troubleshooting}

### Běžné problémy {#common-issues}

#### 1. Služba Docker se nespustí {#1-docker-service-wont-start}

```bash
# Zkontrolujte stav Dockeru
systemctl status docker

# Zkuste alternativní spuštění
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Generování certifikátu selže {#2-certificate-generation-fails}

* Ujistěte se, že porty 80 a 443 jsou přístupné
* Ověřte, že DNS záznamy směřují na váš server
* Zkontrolujte nastavení firewallu

#### 3. Problémy s doručováním e-mailů {#3-email-delivery-issues}

* Ověřte, že MX záznamy jsou správné
* Zkontrolujte SPF, DKIM a DMARC záznamy
* Ujistěte se, že port 25 není blokován vaším poskytovatelem hostingu

#### 4. Webové rozhraní není přístupné {#4-web-interface-not-accessible}

* Zkontrolujte nastavení firewallu: `ufw status`
* Ověřte SSL certifikáty: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Zkontrolujte přihlašovací údaje pro základní autentizaci

### Získání pomoci {#getting-help}

* **Dokumentace**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Podpora komunity**: Podívejte se na diskuse projektu na GitHubu


## Nejlepší bezpečnostní postupy {#security-best-practices}

1. **Udržujte systém aktualizovaný**: Pravidelně aktualizujte Ubuntu a balíčky
2. **Sledujte logy**: Nastavte monitorování logů a upozornění
3. **Pravidelně zálohujte**: Testujte zálohovací a obnovovací postupy
4. **Používejte silná hesla**: Generujte silná hesla pro všechny účty
5. **Povolte Fail2Ban**: Zvažte instalaci fail2ban pro zvýšení bezpečnosti
6. **Pravidelné bezpečnostní audity**: Pravidelně kontrolujte vaši konfiguraci


## Závěr {#conclusion}

Vaše self-hosted instalace Forward Email by nyní měla být dokončena a běžet na Ubuntu. Nezapomeňte:

1. Správně nakonfigurovat DNS záznamy
2. Otestovat odesílání a přijímání e-mailů
3. Nastavit pravidelné zálohy
4. Pravidelně sledovat systém
5. Udržovat instalaci aktualizovanou

Pro další možnosti konfigurace a pokročilé funkce se podívejte do oficiální dokumentace Forward Email na <https://forwardemail.net/self-hosted#configuration>.
