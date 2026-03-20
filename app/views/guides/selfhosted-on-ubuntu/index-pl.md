# Przewodnik instalacji Forward Email na własnym serwerze dla Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Wymagania wstępne](#prerequisites)
* [Wymagania systemowe](#system-requirements)
* [Instalacja krok po kroku](#step-by-step-installation)
  * [Krok 1: Wstępna konfiguracja systemu](#step-1-initial-system-setup)
  * [Krok 2: Konfiguracja resolverów DNS](#step-2-configure-dns-resolvers)
  * [Krok 3: Instalacja zależności systemowych](#step-3-install-system-dependencies)
  * [Krok 4: Instalacja pakietów Snap](#step-4-install-snap-packages)
  * [Krok 5: Instalacja Dockera](#step-5-install-docker)
  * [Krok 6: Konfiguracja usługi Docker](#step-6-configure-docker-service)
  * [Krok 7: Konfiguracja zapory sieciowej](#step-7-configure-firewall)
  * [Krok 8: Klonowanie repozytorium Forward Email](#step-8-clone-forward-email-repository)
  * [Krok 9: Konfiguracja środowiska](#step-9-set-up-environment-configuration)
  * [Krok 10: Konfiguracja domeny](#step-10-configure-your-domain)
  * [Krok 11: Generowanie certyfikatów SSL](#step-11-generate-ssl-certificates)
  * [Krok 12: Generowanie kluczy szyfrowania](#step-12-generate-encryption-keys)
  * [Krok 13: Aktualizacja ścieżek SSL w konfiguracji](#step-13-update-ssl-paths-in-configuration)
  * [Krok 14: Konfiguracja podstawowej autoryzacji](#step-14-set-up-basic-authentication)
  * [Krok 15: Wdrożenie za pomocą Docker Compose](#step-15-deploy-with-docker-compose)
  * [Krok 16: Weryfikacja instalacji](#step-16-verify-installation)
* [Konfiguracja po instalacji](#post-installation-configuration)
  * [Konfiguracja rekordów DNS](#dns-records-setup)
  * [Pierwsze logowanie](#first-login)
* [Konfiguracja kopii zapasowej](#backup-configuration)
  * [Konfiguracja kopii zapasowej kompatybilnej z S3](#set-up-s3-compatible-backup)
  * [Konfiguracja zadań cron dla kopii zapasowej](#set-up-backup-cron-jobs)
* [Konfiguracja automatycznych aktualizacji](#auto-update-configuration)
* [Konserwacja i monitorowanie](#maintenance-and-monitoring)
  * [Lokalizacje logów](#log-locations)
  * [Regularne zadania konserwacyjne](#regular-maintenance-tasks)
  * [Odnawianie certyfikatów](#certificate-renewal)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Typowe problemy](#common-issues)
  * [Uzyskiwanie pomocy](#getting-help)
* [Najlepsze praktyki bezpieczeństwa](#security-best-practices)
* [Podsumowanie](#conclusion)


## Przegląd {#overview}

Ten przewodnik zawiera instrukcje krok po kroku dotyczące instalacji rozwiązania Forward Email na własnym serwerze na systemach Ubuntu. Przewodnik jest specjalnie dostosowany do wersji Ubuntu 20.04, 22.04 oraz 24.04 LTS.


## Wymagania wstępne {#prerequisites}

Przed rozpoczęciem instalacji upewnij się, że posiadasz:

* **Ubuntu Server**: 20.04, 22.04 lub 24.04 LTS
* **Dostęp root**: Musisz mieć możliwość uruchamiania poleceń jako root (dostęp sudo)
* **Nazwa domeny**: Domenę, którą kontrolujesz z dostępem do zarządzania DNS
* **Czysty serwer**: Zalecane jest użycie świeżej instalacji Ubuntu
* **Połączenie internetowe**: Wymagane do pobierania pakietów i obrazów Dockera


## Wymagania systemowe {#system-requirements}

* **RAM**: Minimum 2GB (zalecane 4GB dla produkcji)
* **Pamięć**: Minimum 20GB wolnego miejsca (zalecane 50GB+ dla produkcji)
* **CPU**: Minimum 1 vCPU (zalecane 2+ vCPU dla produkcji)
* **Sieć**: Publiczny adres IP z otwartymi następującymi portami:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Instalacja krok po kroku {#step-by-step-installation}

### Krok 1: Wstępna konfiguracja systemu {#step-1-initial-system-setup}

Najpierw upewnij się, że system jest aktualny i przełącz się na użytkownika root:

```bash
# Aktualizacja pakietów systemowych
sudo apt update && sudo apt upgrade -y

# Przełącz się na użytkownika root (wymagane do instalacji)
sudo su -
```

### Krok 2: Konfiguracja resolverów DNS {#step-2-configure-dns-resolvers}

Skonfiguruj system tak, aby korzystał z serwerów DNS Cloudflare dla niezawodnego generowania certyfikatów:

```bash
# Zatrzymaj i wyłącz systemd-resolved, jeśli działa
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Konfiguracja resolverów DNS Cloudflare
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
### Krok 3: Zainstaluj zależności systemowe {#step-3-install-system-dependencies}

Zainstaluj wymagane pakiety dla Forward Email:

```bash
# Aktualizuj listę pakietów
apt-get update -y

# Zainstaluj podstawowe zależności
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Krok 4: Zainstaluj pakiety Snap {#step-4-install-snap-packages}

Zainstaluj AWS CLI i Certbot za pomocą snap:

```bash
# Zainstaluj AWS CLI
snap install aws-cli --classic

# Zainstaluj Certbot i wtyczkę DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Krok 5: Zainstaluj Docker {#step-5-install-docker}

Zainstaluj Docker CE i Docker Compose:

```bash
# Dodaj oficjalny klucz GPG Dockera
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Dodaj repozytorium Dockera
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Zaktualizuj indeks pakietów i zainstaluj Dockera
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Sprawdź instalację Dockera
docker --version
docker compose version
```

### Krok 6: Skonfiguruj usługę Docker {#step-6-configure-docker-service}

Upewnij się, że Docker uruchamia się automatycznie i działa:

```bash
# Włącz i uruchom usługę Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Sprawdź, czy Docker działa
docker info
```

Jeśli Docker nie uruchamia się, spróbuj uruchomić go ręcznie:

```bash
# Alternatywna metoda uruchomienia, jeśli systemctl zawiedzie
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Krok 7: Skonfiguruj zaporę sieciową {#step-7-configure-firewall}

Skonfiguruj zaporę UFW, aby zabezpieczyć serwer:

```bash
# Ustaw domyślne zasady
ufw default deny incoming
ufw default allow outgoing

# Zezwól na SSH (ważne - nie zablokuj sobie dostępu!)
ufw allow 22/tcp

# Zezwól na porty związane z pocztą
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (dla Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternatywny port)
ufw allow 2995/tcp  # POP3 (alternatywny port)
ufw allow 3456/tcp  # Niestandardowy port usługi
ufw allow 4000/tcp  # Niestandardowy port usługi
ufw allow 5000/tcp  # Niestandardowy port usługi

# Zezwól na lokalne połączenia z bazą danych
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Włącz zaporę
echo "y" | ufw enable

# Sprawdź status zapory
ufw status numbered
```

### Krok 8: Sklonuj repozytorium Forward Email {#step-8-clone-forward-email-repository}

Pobierz kod źródłowy Forward Email:

```bash
# Ustaw zmienne
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Sklonuj repozytorium
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Sprawdź, czy klonowanie się powiodło
ls -la
```

### Krok 9: Przygotuj konfigurację środowiska {#step-9-set-up-environment-configuration}

Przygotuj konfigurację środowiska:

```bash
# Ustaw zmienne katalogów
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Skopiuj domyślny plik środowiskowy
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Utwórz katalog SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Utwórz katalogi baz danych
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Krok 10: Skonfiguruj swoją domenę {#step-10-configure-your-domain}

Ustaw nazwę domeny i zaktualizuj zmienne środowiskowe:

```bash
# Zamień 'yourdomain.com' na swoją faktyczną domenę
DOMAIN="yourdomain.com"

# Funkcja do aktualizacji pliku środowiskowego
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Zaktualizuj zmienne środowiskowe związane z domeną
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
### Krok 11: Generowanie certyfikatów SSL {#step-11-generate-ssl-certificates}

#### Opcja A: Ręczne wyzwanie DNS (zalecane dla większości użytkowników) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generowanie certyfikatów za pomocą ręcznego wyzwania DNS
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Ważne**: Po wyświetleniu monitu będziesz musiał utworzyć rekordy TXT w swojej DNS. Możesz zobaczyć wiele wyzwań dla tej samej domeny - **utwórz WSZYSTKIE z nich**. Nie usuwaj pierwszego rekordu TXT podczas dodawania drugiego.

#### Opcja B: Cloudflare DNS (jeśli używasz Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Jeśli Twoja domena korzysta z Cloudflare dla DNS, możesz zautomatyzować generowanie certyfikatów:

```bash
# Utwórz plik poświadczeń Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Ustaw odpowiednie uprawnienia
chmod 600 /root/.cloudflare.ini

# Automatyczne generowanie certyfikatów
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Kopiowanie certyfikatów {#copy-certificates}

Po wygenerowaniu certyfikatów skopiuj je do katalogu aplikacji:

```bash
# Skopiuj certyfikaty do katalogu SSL aplikacji
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Sprawdź, czy certyfikaty zostały skopiowane
ls -la "$SELF_HOST_DIR/ssl/"
```

### Krok 12: Generowanie kluczy szyfrowania {#step-12-generate-encryption-keys}

Utwórz różne klucze szyfrowania wymagane do bezpiecznego działania:

```bash
# Generuj pomocniczy klucz szyfrowania
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generuj sekret SRS do przekazywania e-maili
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generuj klucz szyfrowania TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generuj prywatny klucz DKIM do podpisywania e-maili
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generuj klucz podpisu webhooka
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Ustaw hasło transportu SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Wszystkie klucze szyfrowania zostały pomyślnie wygenerowane"
```

### Krok 13: Aktualizacja ścieżek SSL w konfiguracji {#step-13-update-ssl-paths-in-configuration}

Skonfiguruj ścieżki do certyfikatów SSL w pliku środowiskowym:

```bash
# Zaktualizuj ścieżki SSL, aby wskazywały na poprawne pliki certyfikatów
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Krok 14: Konfiguracja podstawowej autoryzacji {#step-14-set-up-basic-authentication}

Utwórz tymczasowe dane uwierzytelniające podstawowej autoryzacji:

```bash
# Wygeneruj bezpieczne losowe hasło
PASSWORD=$(openssl rand -base64 16)

# Zaktualizuj plik środowiskowy danymi uwierzytelniającymi podstawowej autoryzacji
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Wyświetl dane uwierzytelniające (zapisz je!)
echo ""
echo "🔐 WAŻNE: Zapisz te dane logowania!"
echo "=================================="
echo "Nazwa użytkownika: admin"
echo "Hasło: $PASSWORD"
echo "=================================="
echo ""
echo "Będziesz ich potrzebować, aby uzyskać dostęp do interfejsu webowego po instalacji."
echo ""
```

### Krok 15: Wdrażanie za pomocą Docker Compose {#step-15-deploy-with-docker-compose}

Uruchom wszystkie usługi Forward Email:

```bash
# Ustaw ścieżkę do pliku Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Zatrzymaj istniejące kontenery
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Pobierz najnowsze obrazy
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Uruchom wszystkie usługi w trybie odłączonym
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Odczekaj chwilę na uruchomienie usług
sleep 10

# Sprawdź status usług
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Krok 16: Weryfikacja instalacji {#step-16-verify-installation}

Sprawdź, czy wszystkie usługi działają poprawnie:

```bash
# Sprawdź kontenery Dockera
docker ps

# Sprawdź logi usług pod kątem błędów
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Przetestuj łączność z interfejsem webowym
curl -I https://$DOMAIN

# Sprawdź, czy porty nasłuchują
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Konfiguracja po instalacji {#post-installation-configuration}

### Konfiguracja rekordów DNS {#dns-records-setup}

Musisz skonfigurować następujące rekordy DNS dla swojej domeny:

#### Rekord MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Rekordy A {#a-records}

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

#### Rekord SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Rekord DKIM {#dkim-record}

Pobierz swój publiczny klucz DKIM:

```bash
# Wyodrębnij publiczny klucz DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Utwórz rekord DKIM w DNS:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Rekord DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Pierwsze logowanie {#first-login}

1. Otwórz przeglądarkę i przejdź do `https://yourdomain.com`
2. Wprowadź wcześniej zapisane dane uwierzytelniające podstawowej autoryzacji
3. Ukończ kreatora początkowej konfiguracji
4. Utwórz swoje pierwsze konto e-mail


## Konfiguracja kopii zapasowej {#backup-configuration}

### Konfiguracja kopii zapasowej zgodnej z S3 {#set-up-s3-compatible-backup}

Skonfiguruj automatyczne kopie zapasowe do magazynu zgodnego z S3:

```bash
# Utwórz katalog z poświadczeniami AWS
mkdir -p ~/.aws

# Skonfiguruj poświadczenia AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Skonfiguruj ustawienia AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Dla S3 niebędącego AWS (np. Cloudflare R2), dodaj URL endpointu
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Konfiguracja zadań cron dla kopii zapasowej {#set-up-backup-cron-jobs}

```bash
# Nadaj skryptom kopii zapasowej prawa do wykonania
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Dodaj zadanie cron dla kopii zapasowej MongoDB (uruchamiane codziennie o północy)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Dodaj zadanie cron dla kopii zapasowej Redis (uruchamiane codziennie o północy)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Zweryfikuj, czy zadania cron zostały dodane
crontab -l
```


## Konfiguracja automatycznych aktualizacji {#auto-update-configuration}

Skonfiguruj automatyczne aktualizacje instalacji Forward Email:

```bash
# Utwórz polecenie aktualizacji
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Dodaj zadanie cron do automatycznej aktualizacji (uruchamiane codziennie o 1 w nocy)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Zweryfikuj, czy zadanie cron zostało dodane
crontab -l
```


## Konserwacja i monitorowanie {#maintenance-and-monitoring}

### Lokalizacje logów {#log-locations}

* **Logi Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Logi systemowe**: `/var/log/syslog`
* **Logi kopii zapasowej**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logi automatycznych aktualizacji**: `/var/log/autoupdate.log`

### Regularne zadania konserwacyjne {#regular-maintenance-tasks}

1. **Monitoruj miejsce na dysku**: `df -h`
2. **Sprawdź status usług**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Przejrzyj logi**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Aktualizuj pakiety systemowe**: `apt update && apt upgrade`
5. **Odnawiaj certyfikaty**: Certyfikaty odnawiają się automatycznie, ale monitoruj datę wygaśnięcia

### Odnawianie certyfikatów {#certificate-renewal}

Certyfikaty powinny odnawiać się automatycznie, ale możesz je odnowić ręcznie, jeśli zajdzie taka potrzeba:

```bash
# Ręczne odnowienie certyfikatów
certbot renew

# Skopiuj odnowione certyfikaty
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Zrestartuj usługi, aby używały nowych certyfikatów
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Rozwiązywanie problemów {#troubleshooting}

### Częste problemy {#common-issues}

#### 1. Usługa Docker nie chce się uruchomić {#1-docker-service-wont-start}

```bash
# Sprawdź status Dockera
systemctl status docker

# Spróbuj alternatywnego uruchomienia
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Generowanie certyfikatu nie powiodło się {#2-certificate-generation-fails}

* Upewnij się, że porty 80 i 443 są dostępne
* Zweryfikuj, czy rekordy DNS wskazują na Twój serwer
* Sprawdź ustawienia zapory sieciowej

#### 3. Problemy z dostarczaniem e-maili {#3-email-delivery-issues}

* Zweryfikuj poprawność rekordów MX
* Sprawdź rekordy SPF, DKIM i DMARC
* Upewnij się, że port 25 nie jest zablokowany przez dostawcę hostingu

#### 4. Interfejs webowy jest niedostępny {#4-web-interface-not-accessible}

* Sprawdź ustawienia zapory: `ufw status`
* Zweryfikuj certyfikaty SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Sprawdź dane uwierzytelniające basic auth

### Uzyskiwanie pomocy {#getting-help}

* **Dokumentacja**: <https://forwardemail.net/self-hosted>
* **Zgłoszenia na GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Wsparcie społeczności**: Sprawdź dyskusje projektu na GitHub


## Najlepsze praktyki bezpieczeństwa {#security-best-practices}

1. **Utrzymuj system zaktualizowany**: Regularnie aktualizuj Ubuntu i pakiety
2. **Monitoruj logi**: Skonfiguruj monitorowanie logów i alerty
3. **Regularnie twórz kopie zapasowe**: Testuj procedury tworzenia i przywracania kopii zapasowych
4. **Używaj silnych haseł**: Generuj silne hasła dla wszystkich kont
5. **Włącz Fail2Ban**: Rozważ instalację fail2ban dla dodatkowego zabezpieczenia
6. **Regularne audyty bezpieczeństwa**: Okresowo przeglądaj swoją konfigurację


## Podsumowanie {#conclusion}

Twoja instalacja Forward Email w trybie self-hosted powinna być teraz kompletna i działać na Ubuntu. Pamiętaj, aby:

1. Poprawnie skonfigurować rekordy DNS
2. Przetestować wysyłanie i odbieranie e-maili
3. Skonfigurować regularne kopie zapasowe
4. Regularnie monitorować system
5. Utrzymywać instalację na bieżąco

Aby uzyskać dodatkowe opcje konfiguracji i zaawansowane funkcje, zapoznaj się z oficjalną dokumentacją Forward Email pod adresem <https://forwardemail.net/self-hosted#configuration>.
