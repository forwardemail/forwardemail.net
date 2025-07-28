# Guide d'installation de l'auto-hébergement de courrier électronique transféré pour Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Table des matières {#table-of-contents}

* [Aperçu](#overview)
* [Prérequis](#prerequisites)
* [Configuration requise](#system-requirements)
* [Installation étape par étape](#step-by-step-installation)
  * [Étape 1 : Configuration initiale du système](#step-1-initial-system-setup)
  * [Étape 2 : Configurer les résolveurs DNS](#step-2-configure-dns-resolvers)
  * [Étape 3 : installer les dépendances système](#step-3-install-system-dependencies)
  * [Étape 4 : Installer les packages Snap](#step-4-install-snap-packages)
  * [Étape 5 : Installer Docker](#step-5-install-docker)
  * [Étape 6 : Configurer le service Docker](#step-6-configure-docker-service)
  * [Étape 7 : Configurer le pare-feu](#step-7-configure-firewall)
  * [Étape 8 : Cloner le référentiel de courrier électronique transféré](#step-8-clone-forward-email-repository)
  * [Étape 9 : Configurer l'environnement](#step-9-set-up-environment-configuration)
  * [Étape 10 : Configurez votre domaine](#step-10-configure-your-domain)
  * [Étape 11 : Générer des certificats SSL](#step-11-generate-ssl-certificates)
  * [Étape 12 : Générer des clés de chiffrement](#step-12-generate-encryption-keys)
  * [Étape 13 : Mettre à jour les chemins SSL dans la configuration](#step-13-update-ssl-paths-in-configuration)
  * [Étape 14 : Configurer l’authentification de base](#step-14-set-up-basic-authentication)
  * [Étape 15 : Déployer avec Docker Compose](#step-15-deploy-with-docker-compose)
  * [Étape 16 : Vérifier l’installation](#step-16-verify-installation)
* [Configuration post-installation](#post-installation-configuration)
  * [Configuration des enregistrements DNS](#dns-records-setup)
  * [Première connexion](#first-login)
* [Configuration de sauvegarde](#backup-configuration)
  * [Configurer une sauvegarde compatible S3](#set-up-s3-compatible-backup)
  * [Configurer les tâches de sauvegarde Cron](#set-up-backup-cron-jobs)
* [Configuration de mise à jour automatique](#auto-update-configuration)
* [Maintenance et surveillance](#maintenance-and-monitoring)
  * [Emplacements des journaux](#log-locations)
  * [Tâches de maintenance régulières](#regular-maintenance-tasks)
  * [Renouvellement du certificat](#certificate-renewal)
* [Dépannage](#troubleshooting)
  * [Problèmes courants](#common-issues)
  * [Obtenir de l'aide](#getting-help)
* [Meilleures pratiques de sécurité](#security-best-practices)
* [Conclusion](#conclusion)

## Présentation {#overview}

Ce guide fournit des instructions étape par étape pour installer la solution auto-hébergée de Forward Email sur les systèmes Ubuntu. Ce guide est spécialement conçu pour les versions Ubuntu 20.04, 22.04 et 24.04 LTS.

## Conditions préalables {#prerequisites}

Avant de commencer l'installation, assurez-vous d'avoir :

* **Serveur Ubuntu** : 20.04, 22.04 ou 24.04 LTS
* **Accès root** : Vous devez pouvoir exécuter des commandes en tant que root (accès sudo)
* **Nom de domaine** : Un domaine que vous contrôlez avec un accès DNS
* **Serveur propre** : Il est recommandé d'utiliser une nouvelle installation d'Ubuntu
* **Connexion Internet** : Requise pour télécharger les paquets et les images Docker

Configuration requise pour ## {#system-requirements}

* **RAM** : 2 Go minimum (4 Go recommandés pour la production)
* **Stockage** : 20 Go minimum d’espace disponible (50 Go minimum recommandés pour la production)
* **CPU** : 1 vCPU minimum (2 vCPU minimum recommandés pour la production)
* **Réseau** : Adresse IP publique avec les ports suivants accessibles :
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Installation étape par étape {#step-by-step-installation}

### Étape 1 : Configuration initiale du système {#step-1-initial-system-setup}

Tout d’abord, assurez-vous que votre système est à jour et passez en utilisateur root :

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Étape 2 : Configurer les résolveurs DNS {#step-2-configure-dns-resolvers}

Configurez votre système pour utiliser les serveurs DNS de Cloudflare pour une génération de certificats fiable :

```bash
# Stop and disable systemd-resolved if running
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configure Cloudflare DNS resolvers
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

### Étape 3 : Installer les dépendances système {#step-3-install-system-dependencies}

Installez les packages requis pour le transfert d'e-mails :

```bash
# Update package list
apt-get update -y

# Install basic dependencies
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Étape 4 : Installer les packages Snap {#step-4-install-snap-packages}

Installez AWS CLI et Certbot via snap :

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Étape 5 : Installer Docker {#step-5-install-docker}

Installer Docker CE et Docker Compose :

```bash
# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update package index and install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify Docker installation
docker --version
docker compose version
```

### Étape 6 : Configurer le service Docker {#step-6-configure-docker-service}

Assurez-vous que Docker démarre automatiquement et est en cours d’exécution :

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Si Docker ne démarre pas, essayez de le démarrer manuellement :

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Étape 7 : Configurer le pare-feu {#step-7-configure-firewall}

Configurez le pare-feu UFW pour sécuriser votre serveur :

```bash
# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow email-related ports
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (for Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternative port)
ufw allow 2995/tcp  # POP3 (alternative port)
ufw allow 3456/tcp  # Custom service port
ufw allow 4000/tcp  # Custom service port
ufw allow 5000/tcp  # Custom service port

# Allow local database connections
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Enable firewall
echo "y" | ufw enable

# Check firewall status
ufw status numbered
```

### Étape 8 : Cloner le référentiel de courrier électronique de transfert {#step-8-clone-forward-email-repository}

Téléchargez le code source de Forward Email :

```bash
# Set up variables
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clone the repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verify the clone was successful
ls -la
```

### Étape 9 : Configurer l'environnement {#step-9-set-up-environment-configuration}

Préparez la configuration de l'environnement :

```bash
# Set up directory variables
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copy default environment file
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Create SSL directory
mkdir -p "$SELF_HOST_DIR/ssl"

# Create database directories
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Étape 10 : Configurez votre domaine {#step-10-configure-your-domain}

Définissez votre nom de domaine et mettez à jour les variables d’environnement :

```bash
# Replace 'yourdomain.com' with your actual domain
DOMAIN="yourdomain.com"

# Function to update environment file
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Update domain-related environment variables
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

### Étape 11 : Générer des certificats SSL {#step-11-generate-ssl-certificates}

#### Option A : Défi DNS manuel (recommandé pour la plupart des utilisateurs) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Important** : Lorsque vous y êtes invité, vous devrez créer des enregistrements TXT dans votre DNS. Plusieurs problèmes peuvent survenir pour un même domaine ; **créez-les TOUS**. Ne supprimez pas le premier enregistrement TXT lors de l'ajout du second.

#### Option B : DNS Cloudflare (si vous utilisez Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Si votre domaine utilise Cloudflare pour DNS, vous pouvez automatiser la génération de certificats :

```bash
# Create Cloudflare credentials file
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Set proper permissions
chmod 600 /root/.cloudflare.ini

# Generate certificates automatically
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Copier les certificats {#copy-certificates}

Après la génération du certificat, copiez-le dans le répertoire de l'application :

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Étape 12 : Générer les clés de chiffrement {#step-12-generate-encryption-keys}

Créez les différentes clés de chiffrement nécessaires à un fonctionnement sécurisé :

```bash
# Generate helper encryption key
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generate SRS secret for email forwarding
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generate TXT encryption key
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generate DKIM private key for email signing
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generate webhook signature key
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Set SMTP transport password
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ All encryption keys generated successfully"
```

### Étape 13 : Mettre à jour les chemins SSL dans la configuration {#step-13-update-ssl-paths-in-configuration}

Configurez les chemins d’accès au certificat SSL dans le fichier d’environnement :

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Étape 14 : Configurer l'authentification de base {#step-14-set-up-basic-authentication}

Créer des informations d’authentification de base temporaires :

```bash
# Generate a secure random password
PASSWORD=$(openssl rand -base64 16)

# Update environment file with basic auth credentials
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Display credentials (save these!)
echo ""
echo "🔐 IMPORTANT: Save these login credentials!"
echo "=================================="
echo "Username: admin"
echo "Password: $PASSWORD"
echo "=================================="
echo ""
echo "You'll need these to access the web interface after installation."
echo ""
```

### Étape 15 : Déployer avec Docker Compose {#step-15-deploy-with-docker-compose}

Démarrez tous les services de transfert de courrier électronique :

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop any existing containers
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Pull the latest images
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Start all services in detached mode
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Wait a moment for services to start
sleep 10

# Check service status
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```

### Étape 16 : Vérifier l'installation {#step-16-verify-installation}

Vérifiez que tous les services fonctionnent correctement :

```bash
# Check Docker containers
docker ps

# Check service logs for any errors
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Test web interface connectivity
curl -I https://$DOMAIN

# Check if ports are listening
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```

## Configuration post-installation {#post-installation-configuration}

Configuration des enregistrements DNS ### {#dns-records-setup}

Vous devez configurer les enregistrements DNS suivants pour votre domaine :

Enregistrement MX #### {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Enregistrements A {#a-records}

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

Enregistrement SPF #### {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

Enregistrement DKIM #### {#dkim-record}

Obtenez votre clé publique DKIM :

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Créer un enregistrement DNS DKIM :

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

Enregistrement DMARC #### {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Première connexion {#first-login}

1. Ouvrez votre navigateur web et accédez à `https://yourdomain.com`
2. Saisissez les identifiants d'authentification de base enregistrés précédemment.
3. Suivez l'assistant de configuration initiale.
4. Créez votre premier compte e-mail.

## Configuration de sauvegarde {#backup-configuration}

### Configurer une sauvegarde compatible S3 {#set-up-s3-compatible-backup}

Configurer des sauvegardes automatisées sur un stockage compatible S3 :

```bash
# Create AWS credentials directory
mkdir -p ~/.aws

# Configure AWS credentials
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configure AWS settings
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# For non-AWS S3 (like Cloudflare R2), add endpoint URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Configurer les tâches de sauvegarde cron {#set-up-backup-cron-jobs}

```bash
# Make backup scripts executable
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Add MongoDB backup cron job (runs daily at midnight)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Add Redis backup cron job (runs daily at midnight)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verify cron jobs were added
crontab -l
```

## Configuration de mise à jour automatique {#auto-update-configuration}

Configurer les mises à jour automatiques pour votre installation Forward Email :

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Maintenance et surveillance {#maintenance-and-monitoring}

### Emplacements des journaux {#log-locations}

* **Journaux Docker Compose** : `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Journaux système** : `/var/log/syslog`
* **Journaux de sauvegarde** : `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Journaux de mise à jour automatique** : `/var/log/autoupdate.log`

### Tâches de maintenance régulières {#regular-maintenance-tasks}

1. **Surveiller l'espace disque** : `df -h`
2. **Vérifier l'état du service** : `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Consulter les journaux** : `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Mettre à jour les packages système** : `apt update && apt upgrade`
5. **Renouveler les certificats** : Les certificats se renouvellent automatiquement, mais leur expiration est surveillée.

### Renouvellement du certificat {#certificate-renewal}

Les certificats doivent se renouveler automatiquement, mais vous pouvez les renouveler manuellement si nécessaire :

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Dépannage {#troubleshooting}

### Problèmes courants {#common-issues}

#### 1. Le service Docker ne démarre pas {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. La génération du certificat échoue {#2-certificate-generation-fails}

* Assurez-vous que les ports 80 et 443 sont accessibles
* Vérifiez que les enregistrements DNS pointent vers votre serveur
* Vérifiez les paramètres du pare-feu

#### 3. Problèmes de livraison des e-mails {#3-email-delivery-issues}

* Vérifiez que les enregistrements MX sont corrects
* Vérifiez les enregistrements SPF, DKIM et DMARC
* Assurez-vous que le port 25 n'est pas bloqué par votre hébergeur

#### 4. Interface Web non accessible {#4-web-interface-not-accessible}

* Vérifier les paramètres du pare-feu : `ufw status`
* Vérifier les certificats SSL : `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Vérifier les identifiants d'authentification de base

### Obtenir de l'aide {#getting-help}

* **Documentation** : <https://forwardemail.net/self-hosted>
* **Problèmes GitHub** : <https://github.com/forwardemail/forwardemail.net/issues>
* **Support communautaire** : Consultez les discussions GitHub du projet

## Meilleures pratiques de sécurité {#security-best-practices}

1. **Maintenir le système à jour** : Mettre à jour régulièrement Ubuntu et ses paquets
2. **Surveiller les journaux** : Configurer la surveillance et les alertes des journaux
3. **Sauvegarder régulièrement** : Tester les procédures de sauvegarde et de restauration
4. **Utiliser des mots de passe forts** : Générer des mots de passe forts pour tous les comptes
5. **Activer Fail2Ban** : Envisager d'installer Fail2Ban pour plus de sécurité
6. **Audits de sécurité réguliers** : Vérifier régulièrement votre configuration

Conclusion

Votre installation auto-hébergée de Forward Email devrait maintenant être terminée et opérationnelle sur Ubuntu. N'oubliez pas :

1. Configurez correctement vos enregistrements DNS
2. Testez l'envoi et la réception des e-mails
3. Configurez des sauvegardes régulières
4. Surveillez régulièrement votre système
5. Maintenez votre installation à jour

Pour des options de configuration supplémentaires et des fonctionnalités avancées, reportez-vous à la documentation officielle de Forward Email à l'adresse <https://forwardemail.net/self-hosted#configuration>.