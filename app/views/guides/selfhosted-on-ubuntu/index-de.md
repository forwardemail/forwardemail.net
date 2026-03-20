# Forward Email Self-Hosting Installationsanleitung für Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Inhaltsverzeichnis {#table-of-contents}

* [Übersicht](#overview)
* [Voraussetzungen](#prerequisites)
* [Systemanforderungen](#system-requirements)
* [Schritt-für-Schritt Installation](#step-by-step-installation)
  * [Schritt 1: Erste Systemeinrichtung](#step-1-initial-system-setup)
  * [Schritt 2: DNS-Resolver konfigurieren](#step-2-configure-dns-resolvers)
  * [Schritt 3: Systemabhängigkeiten installieren](#step-3-install-system-dependencies)
  * [Schritt 4: Snap-Pakete installieren](#step-4-install-snap-packages)
  * [Schritt 5: Docker installieren](#step-5-install-docker)
  * [Schritt 6: Docker-Dienst konfigurieren](#step-6-configure-docker-service)
  * [Schritt 7: Firewall konfigurieren](#step-7-configure-firewall)
  * [Schritt 8: Forward Email Repository klonen](#step-8-clone-forward-email-repository)
  * [Schritt 9: Umgebungs-Konfiguration einrichten](#step-9-set-up-environment-configuration)
  * [Schritt 10: Ihre Domain konfigurieren](#step-10-configure-your-domain)
  * [Schritt 11: SSL-Zertifikate generieren](#step-11-generate-ssl-certificates)
  * [Schritt 12: Verschlüsselungsschlüssel generieren](#step-12-generate-encryption-keys)
  * [Schritt 13: SSL-Pfade in der Konfiguration aktualisieren](#step-13-update-ssl-paths-in-configuration)
  * [Schritt 14: Basis-Authentifizierung einrichten](#step-14-set-up-basic-authentication)
  * [Schritt 15: Mit Docker Compose bereitstellen](#step-15-deploy-with-docker-compose)
  * [Schritt 16: Installation überprüfen](#step-16-verify-installation)
* [Nach der Installation konfigurieren](#post-installation-configuration)
  * [DNS-Einträge einrichten](#dns-records-setup)
  * [Erste Anmeldung](#first-login)
* [Backup-Konfiguration](#backup-configuration)
  * [S3-kompatibles Backup einrichten](#set-up-s3-compatible-backup)
  * [Backup-Cronjobs einrichten](#set-up-backup-cron-jobs)
* [Auto-Update-Konfiguration](#auto-update-configuration)
* [Wartung und Überwachung](#maintenance-and-monitoring)
  * [Log-Standorte](#log-locations)
  * [Regelmäßige Wartungsaufgaben](#regular-maintenance-tasks)
  * [Zertifikatserneuerung](#certificate-renewal)
* [Fehlerbehebung](#troubleshooting)
  * [Häufige Probleme](#common-issues)
  * [Hilfe erhalten](#getting-help)
* [Sicherheits-Best-Practices](#security-best-practices)
* [Fazit](#conclusion)


## Übersicht {#overview}

Diese Anleitung bietet Schritt-für-Schritt-Anweisungen zur Installation der selbst gehosteten Lösung von Forward Email auf Ubuntu-Systemen. Diese Anleitung ist speziell auf die Ubuntu-Versionen 20.04, 22.04 und 24.04 LTS zugeschnitten.


## Voraussetzungen {#prerequisites}

Bevor Sie mit der Installation beginnen, stellen Sie sicher, dass Sie Folgendes haben:

* **Ubuntu Server**: 20.04, 22.04 oder 24.04 LTS
* **Root-Zugriff**: Sie müssen Befehle als Root ausführen können (sudo-Zugriff)
* **Domainname**: Eine Domain, die Sie kontrollieren, mit Zugriff auf die DNS-Verwaltung
* **Sauberer Server**: Es wird empfohlen, eine frische Ubuntu-Installation zu verwenden
* **Internetverbindung**: Erforderlich zum Herunterladen von Paketen und Docker-Images


## Systemanforderungen {#system-requirements}

* **RAM**: Mindestens 2GB (4GB empfohlen für den Produktivbetrieb)
* **Speicher**: Mindestens 20GB verfügbarer Speicherplatz (50GB+ empfohlen für den Produktivbetrieb)
* **CPU**: Mindestens 1 vCPU (2+ vCPUs empfohlen für den Produktivbetrieb)
* **Netzwerk**: Öffentliche IP-Adresse mit folgenden zugänglichen Ports:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Schritt-für-Schritt Installation {#step-by-step-installation}

### Schritt 1: Erste Systemeinrichtung {#step-1-initial-system-setup}

Stellen Sie zunächst sicher, dass Ihr System auf dem neuesten Stand ist, und wechseln Sie zum Root-Benutzer:

```bash
# Systempakete aktualisieren
sudo apt update && sudo apt upgrade -y

# Zum Root-Benutzer wechseln (für die Installation erforderlich)
sudo su -
```

### Schritt 2: DNS-Resolver konfigurieren {#step-2-configure-dns-resolvers}

Konfigurieren Sie Ihr System so, dass es die DNS-Server von Cloudflare für eine zuverlässige Zertifikatserstellung verwendet:

```bash
# systemd-resolved stoppen und deaktivieren, falls aktiv
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Cloudflare DNS-Resolver konfigurieren
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
### Schritt 3: Systemabhängigkeiten installieren {#step-3-install-system-dependencies}

Installieren Sie die erforderlichen Pakete für Forward Email:

```bash
# Paketliste aktualisieren
apt-get update -y

# Grundlegende Abhängigkeiten installieren
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Schritt 4: Snap-Pakete installieren {#step-4-install-snap-packages}

Installieren Sie AWS CLI und Certbot über snap:

```bash
# AWS CLI installieren
snap install aws-cli --classic

# Certbot und DNS-Plugin installieren
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Schritt 5: Docker installieren {#step-5-install-docker}

Installieren Sie Docker CE und Docker Compose:

```bash
# Offiziellen GPG-Schlüssel von Docker hinzufügen
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Docker-Repository hinzufügen
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Paketindex aktualisieren und Docker installieren
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker-Installation überprüfen
docker --version
docker compose version
```

### Schritt 6: Docker-Dienst konfigurieren {#step-6-configure-docker-service}

Stellen Sie sicher, dass Docker automatisch startet und läuft:

```bash
# Docker-Dienst freischalten, aktivieren und starten
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Überprüfen, ob Docker läuft
docker info
```

Wenn Docker nicht startet, versuchen Sie es manuell zu starten:

```bash
# Alternative Startmethode, falls systemctl fehlschlägt
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Schritt 7: Firewall konfigurieren {#step-7-configure-firewall}

Richten Sie die UFW-Firewall ein, um Ihren Server zu sichern:

```bash
# Standardrichtlinien setzen
ufw default deny incoming
ufw default allow outgoing

# SSH erlauben (wichtig – sperren Sie sich nicht aus!)
ufw allow 22/tcp

# E-Mail-bezogene Ports erlauben
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (für Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternativer Port)
ufw allow 2995/tcp  # POP3 (alternativer Port)
ufw allow 3456/tcp  # Benutzerdefinierter Dienstport
ufw allow 4000/tcp  # Benutzerdefinierter Dienstport
ufw allow 5000/tcp  # Benutzerdefinierter Dienstport

# Lokale Datenbankverbindungen erlauben
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Firewall aktivieren
echo "y" | ufw enable

# Firewall-Status prüfen
ufw status numbered
```

### Schritt 8: Forward Email Repository klonen {#step-8-clone-forward-email-repository}

Laden Sie den Quellcode von Forward Email herunter:

```bash
# Variablen festlegen
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Repository klonen
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Überprüfen, ob das Klonen erfolgreich war
ls -la
```

### Schritt 9: Umgebungs-Konfiguration einrichten {#step-9-set-up-environment-configuration}

Bereiten Sie die Umgebungs-Konfiguration vor:

```bash
# Verzeichnisvariablen festlegen
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Standard-Umgebungsdatei kopieren
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# SSL-Verzeichnis erstellen
mkdir -p "$SELF_HOST_DIR/ssl"

# Datenbankverzeichnisse erstellen
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Schritt 10: Ihre Domain konfigurieren {#step-10-configure-your-domain}

Legen Sie Ihren Domainnamen fest und aktualisieren Sie die Umgebungsvariablen:

```bash
# Ersetzen Sie 'yourdomain.com' durch Ihre tatsächliche Domain
DOMAIN="yourdomain.com"

# Funktion zum Aktualisieren der Umgebungsdatei
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Domain-bezogene Umgebungsvariablen aktualisieren
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
### Schritt 11: SSL-Zertifikate generieren {#step-11-generate-ssl-certificates}

#### Option A: Manuelle DNS-Challenge (Empfohlen für die meisten Benutzer) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Zertifikate mit manueller DNS-Challenge generieren
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Wichtig**: Wenn Sie dazu aufgefordert werden, müssen Sie TXT-Einträge in Ihrem DNS erstellen. Möglicherweise sehen Sie mehrere Challenges für dieselbe Domain – **erstellen Sie ALLE davon**. Entfernen Sie den ersten TXT-Eintrag nicht, wenn Sie den zweiten hinzufügen.

#### Option B: Cloudflare DNS (Wenn Sie Cloudflare verwenden) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Wenn Ihre Domain Cloudflare für DNS verwendet, können Sie die Zertifikatserstellung automatisieren:

```bash
# Cloudflare-Zugangsdaten-Datei erstellen
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Richtige Berechtigungen setzen
chmod 600 /root/.cloudflare.ini

# Zertifikate automatisch generieren
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Zertifikate kopieren {#copy-certificates}

Nach der Zertifikatserstellung kopieren Sie diese in das Anwendungsverzeichnis:

```bash
# Zertifikate in das SSL-Verzeichnis der Anwendung kopieren
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Überprüfen, ob die Zertifikate kopiert wurden
ls -la "$SELF_HOST_DIR/ssl/"
```

### Schritt 12: Verschlüsselungsschlüssel generieren {#step-12-generate-encryption-keys}

Erstellen Sie die verschiedenen Verschlüsselungsschlüssel, die für den sicheren Betrieb erforderlich sind:

```bash
# Hilfsschlüssel für Verschlüsselung generieren
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# SRS-Geheimnis für E-Mail-Weiterleitung generieren
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# TXT-Verschlüsselungsschlüssel generieren
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# DKIM-Privatschlüssel für E-Mail-Signierung generieren
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Webhook-Signaturschlüssel generieren
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# SMTP-Transport-Passwort setzen
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Alle Verschlüsselungsschlüssel erfolgreich generiert"
```

### Schritt 13: SSL-Pfade in der Konfiguration aktualisieren {#step-13-update-ssl-paths-in-configuration}

Konfigurieren Sie die SSL-Zertifikatspfade in der Umgebungsdatei:

```bash
# SSL-Pfade aktualisieren, um auf die korrekten Zertifikatdateien zu verweisen
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Schritt 14: Basis-Authentifizierung einrichten {#step-14-set-up-basic-authentication}

Erstellen Sie temporäre Basis-Authentifizierungsdaten:

```bash
# Sicheres zufälliges Passwort generieren
PASSWORD=$(openssl rand -base64 16)

# Umgebungsdatei mit Basis-Auth-Daten aktualisieren
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Anmeldedaten anzeigen (bitte speichern!)
echo ""
echo "🔐 WICHTIG: Speichern Sie diese Anmeldedaten!"
echo "=================================="
echo "Benutzername: admin"
echo "Passwort: $PASSWORD"
echo "=================================="
echo ""
echo "Sie benötigen diese, um nach der Installation auf die Weboberfläche zuzugreifen."
echo ""
```

### Schritt 15: Mit Docker Compose bereitstellen {#step-15-deploy-with-docker-compose}

Starten Sie alle Forward Email-Dienste:

```bash
# Pfad zur Docker Compose-Datei setzen
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Vorhandene Container stoppen
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Neueste Images herunterladen
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Alle Dienste im Hintergrund starten
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Einen Moment warten, bis die Dienste gestartet sind
sleep 10

# Dienststatus prüfen
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Schritt 16: Installation überprüfen {#step-16-verify-installation}

Überprüfen Sie, ob alle Dienste korrekt laufen:

```bash
# Docker-Container überprüfen
docker ps

# Dienstprotokolle auf Fehler prüfen
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Webinterface-Konnektivität testen
curl -I https://$DOMAIN

# Prüfen, ob Ports lauschen
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Nach der Installation konfigurieren {#post-installation-configuration}

### DNS-Einträge einrichten {#dns-records-setup}

Sie müssen die folgenden DNS-Einträge für Ihre Domain konfigurieren:

#### MX-Eintrag {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A-Einträge {#a-records}

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

#### SPF-Eintrag {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM-Eintrag {#dkim-record}

Holen Sie Ihren DKIM-Public-Key:

```bash
# DKIM-Public-Key extrahieren
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Erstellen Sie den DKIM-DNS-Eintrag:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC-Eintrag {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Erster Login {#first-login}

1. Öffnen Sie Ihren Webbrowser und navigieren Sie zu `https://yourdomain.com`
2. Geben Sie die zuvor gespeicherten Basis-Authentifizierungsdaten ein
3. Schließen Sie den Einrichtungsassistenten ab
4. Erstellen Sie Ihr erstes E-Mail-Konto


## Backup-Konfiguration {#backup-configuration}

### S3-kompatibles Backup einrichten {#set-up-s3-compatible-backup}

Konfigurieren Sie automatisierte Backups zu einem S3-kompatiblen Speicher:

```bash
# AWS-Credentials-Verzeichnis erstellen
mkdir -p ~/.aws

# AWS-Credentials konfigurieren
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# AWS-Einstellungen konfigurieren
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Für Nicht-AWS S3 (z.B. Cloudflare R2) Endpunkt-URL hinzufügen
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Backup-Cronjobs einrichten {#set-up-backup-cron-jobs}

```bash
# Backup-Skripte ausführbar machen
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDB-Backup-Cronjob hinzufügen (läuft täglich um Mitternacht)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redis-Backup-Cronjob hinzufügen (läuft täglich um Mitternacht)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Cronjobs überprüfen
crontab -l
```


## Auto-Update-Konfiguration {#auto-update-configuration}

Richten Sie automatische Updates für Ihre Forward Email-Installation ein:

```bash
# Auto-Update-Befehl erstellen
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Auto-Update-Cronjob hinzufügen (läuft täglich um 1 Uhr)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Cronjob überprüfen
crontab -l
```


## Wartung und Überwachung {#maintenance-and-monitoring}

### Speicherorte der Protokolle {#log-locations}

* **Docker Compose-Protokolle**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Systemprotokolle**: `/var/log/syslog`
* **Backup-Protokolle**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-Update-Protokolle**: `/var/log/autoupdate.log`

### Regelmäßige Wartungsaufgaben {#regular-maintenance-tasks}

1. **Festplattenspeicher überwachen**: `df -h`
2. **Dienststatus prüfen**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Protokolle prüfen**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Systempakete aktualisieren**: `apt update && apt upgrade`
5. **Zertifikate erneuern**: Zertifikate erneuern sich automatisch, aber Ablauf überwachen

### Zertifikatserneuerung {#certificate-renewal}

Zertifikate sollten automatisch erneuert werden, Sie können sie aber bei Bedarf manuell erneuern:

```bash
# Manuelle Zertifikatserneuerung
certbot renew

# Erneuerte Zertifikate kopieren
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Dienste neu starten, um neue Zertifikate zu verwenden
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Fehlerbehebung {#troubleshooting}

### Häufige Probleme {#common-issues}

#### 1. Docker-Dienst startet nicht {#1-docker-service-wont-start}

```bash
# Docker-Status prüfen
systemctl status docker

# Alternativen Start versuchen
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Zertifikatserstellung schlägt fehl {#2-certificate-generation-fails}

* Stellen Sie sicher, dass die Ports 80 und 443 zugänglich sind
* Überprüfen Sie, ob DNS-Einträge auf Ihren Server zeigen
* Prüfen Sie die Firewall-Einstellungen

#### 3. Probleme bei der E-Mail-Zustellung {#3-email-delivery-issues}

* Überprüfen Sie, ob die MX-Einträge korrekt sind
* Prüfen Sie SPF-, DKIM- und DMARC-Einträge
* Stellen Sie sicher, dass Port 25 von Ihrem Hosting-Anbieter nicht blockiert wird

#### 4. Weboberfläche nicht erreichbar {#4-web-interface-not-accessible}

* Prüfen Sie die Firewall-Einstellungen: `ufw status`
* Überprüfen Sie SSL-Zertifikate: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Prüfen Sie die Basic-Auth-Zugangsdaten

### Hilfe erhalten {#getting-help}

* **Dokumentation**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Community-Support**: Prüfen Sie die GitHub-Diskussionen des Projekts


## Sicherheits-Best-Practices {#security-best-practices}

1. **System aktuell halten**: Aktualisieren Sie regelmäßig Ubuntu und Pakete
2. **Logs überwachen**: Richten Sie Log-Überwachung und Benachrichtigungen ein
3. **Regelmäßig sichern**: Testen Sie Backup- und Wiederherstellungsverfahren
4. **Starke Passwörter verwenden**: Generieren Sie starke Passwörter für alle Konten
5. **Fail2Ban aktivieren**: Ziehen Sie die Installation von fail2ban für zusätzliche Sicherheit in Betracht
6. **Regelmäßige Sicherheitsprüfungen**: Überprüfen Sie Ihre Konfiguration periodisch


## Fazit {#conclusion}

Ihre Forward Email Self-Hosted-Installation sollte nun abgeschlossen sein und unter Ubuntu laufen. Denken Sie daran:

1. Konfigurieren Sie Ihre DNS-Einträge korrekt
2. Testen Sie das Senden und Empfangen von E-Mails
3. Richten Sie regelmäßige Backups ein
4. Überwachen Sie Ihr System regelmäßig
5. Halten Sie Ihre Installation aktuell

Für zusätzliche Konfigurationsoptionen und erweiterte Funktionen lesen Sie die offizielle Forward Email Dokumentation unter <https://forwardemail.net/self-hosted#configuration>.
