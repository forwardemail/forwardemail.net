# Guide d'installation de Forward Email en auto-hébergement pour Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Table des matières {#table-of-contents}

* [Aperçu](#overview)
* [Prérequis](#prerequisites)
* [Exigences système](#system-requirements)
* [Installation étape par étape](#step-by-step-installation)
  * [Étape 1 : Configuration initiale du système](#step-1-initial-system-setup)
  * [Étape 2 : Configurer les résolveurs DNS](#step-2-configure-dns-resolvers)
  * [Étape 3 : Installer les dépendances système](#step-3-install-system-dependencies)
  * [Étape 4 : Installer et configurer Snapd](#step-4-install-and-configure-snapd)
  * [Étape 5 : Installer les paquets Snap](#step-5-install-snap-packages)
  * [Étape 6 : Installer Docker](#step-6-install-docker)
  * [Étape 7 : Configurer le service Docker](#step-7-configure-docker-service)
  * [Étape 8 : Installer et configurer le pare-feu UFW](#step-8-install-and-configure-ufw-firewall)
  * [Étape 9 : Cloner le dépôt Forward Email](#step-9-clone-forward-email-repository)
  * [Étape 10 : Configurer l'environnement](#step-10-set-up-environment-configuration)
  * [Étape 11 : Configurer votre domaine](#step-11-configure-your-domain)
  * [Étape 12 : Générer les certificats SSL](#step-12-generate-ssl-certificates)
  * [Étape 13 : Générer les clés de chiffrement](#step-13-generate-encryption-keys)
  * [Étape 14 : Mettre à jour les chemins SSL dans la configuration](#step-14-update-ssl-paths-in-configuration)
  * [Étape 15 : Configurer l'authentification basique](#step-15-set-up-basic-authentication)
  * [Étape 16 : Déployer avec Docker Compose](#step-16-deploy-with-docker-compose)
  * [Étape 17 : Vérifier l'installation](#step-17-verify-installation)
* [Configuration post-installation](#post-installation-configuration)
  * [Configuration des enregistrements DNS](#dns-records-setup)
  * [Première connexion](#first-login)
* [Configuration des sauvegardes](#backup-configuration)
  * [Configurer une sauvegarde compatible S3](#set-up-s3-compatible-backup)
  * [Configurer les tâches cron de sauvegarde](#set-up-backup-cron-jobs)
* [Configuration de la mise à jour automatique](#auto-update-configuration)
* [Considérations spécifiques à Debian](#debian-specific-considerations)
  * [Différences dans la gestion des paquets](#package-management-differences)
  * [Gestion des services](#service-management)
  * [Configuration réseau](#network-configuration)
* [Maintenance et surveillance](#maintenance-and-monitoring)
  * [Emplacements des journaux](#log-locations)
  * [Tâches régulières de maintenance](#regular-maintenance-tasks)
  * [Renouvellement des certificats](#certificate-renewal)
* [Dépannage](#troubleshooting)
  * [Problèmes spécifiques à Debian](#debian-specific-issues)
  * [Problèmes courants](#common-issues)
  * [Obtenir de l'aide](#getting-help)
* [Bonnes pratiques de sécurité](#security-best-practices)
* [Conclusion](#conclusion)


## Aperçu {#overview}

Ce guide fournit des instructions étape par étape pour installer la solution auto-hébergée de Forward Email sur des systèmes Debian. Ce guide est spécialement conçu pour Debian 11 (Bullseye) et Debian 12 (Bookworm).


## Prérequis {#prerequisites}

Avant de commencer l'installation, assurez-vous de disposer de :

* **Serveur Debian** : Version 11 (Bullseye) ou 12 (Bookworm)
* **Accès root** : Vous devez pouvoir exécuter des commandes en tant que root (accès sudo)
* **Nom de domaine** : Un domaine que vous contrôlez avec accès à la gestion DNS
* **Serveur propre** : Il est recommandé d'utiliser une installation Debian fraîche
* **Connexion Internet** : Nécessaire pour télécharger les paquets et images Docker


## Exigences système {#system-requirements}

* **RAM** : Minimum 2 Go (4 Go recommandés pour la production)
* **Stockage** : Minimum 20 Go d'espace disponible (50 Go+ recommandés pour la production)
* **CPU** : 1 vCPU minimum (2+ vCPUs recommandés pour la production)
* **Réseau** : Adresse IP publique avec les ports suivants accessibles :
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Installation étape par étape {#step-by-step-installation}

### Étape 1 : Configuration initiale du système {#step-1-initial-system-setup}

Tout d'abord, assurez-vous que votre système est à jour et passez en utilisateur root :

```bash
# Mettre à jour les paquets système
sudo apt update && sudo apt upgrade -y

# Passer en utilisateur root (requis pour l'installation)
sudo su -
```
### Étape 2 : Configurer les résolveurs DNS {#step-2-configure-dns-resolvers}

Configurez votre système pour utiliser les serveurs DNS de Cloudflare afin d'assurer une génération fiable des certificats :

```bash
# Arrêter et désactiver systemd-resolved si en cours d'exécution
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configurer les résolveurs DNS Cloudflare
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

### Étape 3 : Installer les dépendances système {#step-3-install-system-dependencies}

Installez les paquets requis pour Forward Email sur Debian :

```bash
# Mettre à jour la liste des paquets
apt-get update -y

# Installer les dépendances de base (liste de paquets spécifique à Debian)
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

### Étape 4 : Installer et configurer Snapd {#step-4-install-and-configure-snapd}

Debian n'inclut pas snapd par défaut, il faut donc l'installer et le configurer :

```bash
# Installer snapd
apt-get install -y snapd

# Activer et démarrer le service snapd
systemctl enable snapd
systemctl start snapd

# Créer un lien symbolique pour que snap fonctionne correctement
ln -sf /var/lib/snapd/snap /snap

# Attendre que snapd soit prêt
sleep 10

# Vérifier que snapd fonctionne
snap version
```

### Étape 5 : Installer les paquets Snap {#step-5-install-snap-packages}

Installez AWS CLI et Certbot via snap :

```bash
# Installer AWS CLI
snap install aws-cli --classic

# Installer Certbot et le plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Vérifier les installations
aws --version
certbot --version
```

### Étape 6 : Installer Docker {#step-6-install-docker}

Installez Docker CE et Docker Compose sur Debian :

```bash
# Ajouter la clé GPG officielle de Docker (spécifique à Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Ajouter le dépôt Docker (spécifique à Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Mettre à jour l'index des paquets et installer Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installer docker-compose autonome en secours (si le plugin ne fonctionne pas)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Vérifier l'installation de Docker
docker --version
docker compose version || docker-compose --version
```

### Étape 7 : Configurer le service Docker {#step-7-configure-docker-service}

Assurez-vous que Docker démarre automatiquement et fonctionne :

```bash
# Activer et démarrer le service Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Vérifier que Docker fonctionne
docker info
```

Si Docker ne démarre pas, essayez de le lancer manuellement :

```bash
# Méthode alternative de démarrage si systemctl échoue
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Étape 8 : Installer et configurer le pare-feu UFW {#step-8-install-and-configure-ufw-firewall}

Les installations minimales de Debian peuvent ne pas inclure UFW, installez-le d'abord :

```bash
# Installer UFW si non présent
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Définir les politiques par défaut
ufw default deny incoming
ufw default allow outgoing

# Autoriser SSH (important - ne vous bloquez pas vous-même !)
ufw allow 22/tcp

# Autoriser les ports liés aux emails
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (pour Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (port alternatif)
ufw allow 2995/tcp  # POP3 (port alternatif)
ufw allow 3456/tcp  # Port service personnalisé
ufw allow 4000/tcp  # Port service personnalisé
ufw allow 5000/tcp  # Port service personnalisé

# Autoriser les connexions locales à la base de données
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Activer le pare-feu
echo "y" | ufw enable

# Vérifier le statut du pare-feu
ufw status numbered
```
### Étape 9 : Cloner le dépôt Forward Email {#step-9-clone-forward-email-repository}

Téléchargez le code source de Forward Email :

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

### Étape 10 : Configurer la configuration de l'environnement {#step-10-set-up-environment-configuration}

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

### Étape 11 : Configurez votre domaine {#step-11-configure-your-domain}

Définissez votre nom de domaine et mettez à jour les variables d'environnement :

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

### Étape 12 : Générer les certificats SSL {#step-12-generate-ssl-certificates}

#### Option A : Challenge DNS manuel (recommandé pour la plupart des utilisateurs) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Important** : Lorsque vous y êtes invité, vous devrez créer des enregistrements TXT dans votre DNS. Vous pouvez voir plusieurs challenges pour le même domaine - **créez TOUS ces enregistrements**. Ne supprimez pas le premier enregistrement TXT lorsque vous ajoutez le second.

#### Option B : DNS Cloudflare (si vous utilisez Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Si votre domaine utilise Cloudflare pour le DNS, vous pouvez automatiser la génération des certificats :

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

Après la génération des certificats, copiez-les dans le répertoire de l'application :

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Étape 13 : Générer les clés de chiffrement {#step-13-generate-encryption-keys}

Créez les différentes clés de chiffrement nécessaires au fonctionnement sécurisé :

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
### Étape 14 : Mettre à jour les chemins SSL dans la configuration {#step-14-update-ssl-paths-in-configuration}

Configurez les chemins des certificats SSL dans le fichier d'environnement :

```bash
# Mettre à jour les chemins SSL pour pointer vers les bons fichiers de certificat
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Étape 15 : Configurer l'authentification basique {#step-15-set-up-basic-authentication}

Créez des identifiants temporaires pour l'authentification basique :

```bash
# Générer un mot de passe aléatoire sécurisé
PASSWORD=$(openssl rand -base64 16)

# Mettre à jour le fichier d'environnement avec les identifiants d'authentification basique
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Afficher les identifiants (conservez-les !)
echo ""
echo "🔐 IMPORTANT : Sauvegardez ces identifiants de connexion !"
echo "=================================="
echo "Nom d'utilisateur : admin"
echo "Mot de passe : $PASSWORD"
echo "=================================="
echo ""
echo "Vous en aurez besoin pour accéder à l'interface web après l'installation."
echo ""
```

### Étape 16 : Déployer avec Docker Compose {#step-16-deploy-with-docker-compose}

Démarrez tous les services Forward Email :

```bash
# Définir le chemin du fichier Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Arrêter les conteneurs existants
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Télécharger les dernières images
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Démarrer tous les services en mode détaché
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Attendre un moment que les services démarrent
sleep 10

# Vérifier le statut des services
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Étape 17 : Vérifier l'installation {#step-17-verify-installation}

Vérifiez que tous les services fonctionnent correctement :

```bash
# Vérifier les conteneurs Docker
docker ps

# Vérifier les logs des services pour détecter d'éventuelles erreurs
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Tester la connectivité de l'interface web
curl -I https://$DOMAIN

# Vérifier si les ports sont à l'écoute
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Configuration post-installation {#post-installation-configuration}

### Configuration des enregistrements DNS {#dns-records-setup}

Vous devez configurer les enregistrements DNS suivants pour votre domaine :

#### Enregistrement MX {#mx-record}

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

#### Enregistrement SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Enregistrement DKIM {#dkim-record}

Récupérez votre clé publique DKIM :

```bash
# Extraire la clé publique DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Créez l'enregistrement DNS DKIM :

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Enregistrement DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Première connexion {#first-login}

1. Ouvrez votre navigateur web et rendez-vous sur `https://yourdomain.com`
2. Saisissez les identifiants d'authentification basique que vous avez sauvegardés précédemment
3. Complétez l'assistant de configuration initiale
4. Créez votre premier compte email


## Configuration de la sauvegarde {#backup-configuration}

### Configurer une sauvegarde compatible S3 {#set-up-s3-compatible-backup}

Configurez des sauvegardes automatisées vers un stockage compatible S3 :

```bash
# Créer le répertoire des identifiants AWS
mkdir -p ~/.aws

# Configurer les identifiants AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configurer les paramètres AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Pour un S3 non-AWS (comme Cloudflare R2), ajoutez l'URL de point de terminaison
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Configurer les tâches cron de sauvegarde {#set-up-backup-cron-jobs}

```bash
# Rendre les scripts de sauvegarde exécutables
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Ajouter la tâche cron de sauvegarde MongoDB (s’exécute tous les jours à minuit)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Ajouter la tâche cron de sauvegarde Redis (s’exécute tous les jours à minuit)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Vérifier que les tâches cron ont été ajoutées
crontab -l
```


## Configuration de la mise à jour automatique {#auto-update-configuration}

Configurez les mises à jour automatiques pour votre installation Forward Email :

```bash
# Créer la commande de mise à jour automatique (utiliser la commande docker compose appropriée)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Ajouter la tâche cron de mise à jour automatique (s’exécute tous les jours à 1h du matin)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Vérifier que la tâche cron a été ajoutée
crontab -l
```


## Considérations spécifiques à Debian {#debian-specific-considerations}

### Différences dans la gestion des paquets {#package-management-differences}

* **Snapd** : Non installé par défaut sur Debian, nécessite une installation manuelle
* **Docker** : Utilise des dépôts et clés GPG spécifiques à Debian
* **UFW** : Peut ne pas être inclus dans les installations minimales de Debian
* **systemd** : Le comportement peut légèrement différer d’Ubuntu

### Gestion des services {#service-management}

```bash
# Vérifier le statut des services (commandes spécifiques à Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Redémarrer les services si nécessaire
systemctl restart snapd
systemctl restart docker
```

### Configuration réseau {#network-configuration}

Debian peut avoir des noms ou configurations d’interfaces réseau différents :

```bash
# Vérifier les interfaces réseau
ip addr show

# Vérifier le routage
ip route show

# Vérifier la résolution DNS
nslookup google.com
```


## Maintenance et surveillance {#maintenance-and-monitoring}

### Emplacements des journaux {#log-locations}

* **Journaux Docker Compose** : Utiliser la commande docker compose appropriée selon l’installation
* **Journaux système** : `/var/log/syslog`
* **Journaux de sauvegarde** : `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Journaux de mise à jour automatique** : `/var/log/autoupdate.log`
* **Journaux Snapd** : `journalctl -u snapd`

### Tâches régulières de maintenance {#regular-maintenance-tasks}

1. **Surveiller l’espace disque** : `df -h`
2. **Vérifier le statut des services** : Utiliser la commande docker compose appropriée
3. **Consulter les journaux** : Vérifier les journaux de l’application et du système
4. **Mettre à jour les paquets système** : `apt update && apt upgrade`
5. **Surveiller snapd** : `snap list` et `snap refresh`

### Renouvellement des certificats {#certificate-renewal}

Les certificats doivent se renouveler automatiquement, mais vous pouvez les renouveler manuellement si nécessaire :

```bash
# Renouvellement manuel des certificats
certbot renew

# Copier les certificats renouvelés
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Redémarrer les services pour utiliser les nouveaux certificats
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Dépannage {#troubleshooting}

### Problèmes spécifiques à Debian {#debian-specific-issues}

#### 1. Snapd ne fonctionne pas {#1-snapd-not-working}

```bash
# Vérifier le statut de snapd
systemctl status snapd

# Redémarrer snapd
systemctl restart snapd

# Vérifier le chemin snap
echo $PATH | grep snap

# Ajouter snap au PATH si manquant
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Commande Docker Compose introuvable {#2-docker-compose-command-not-found}

```bash
# Vérifier quelle commande docker compose est disponible
command -v docker-compose
command -v docker

# Utiliser la commande appropriée dans les scripts
if command -v docker-compose &> /dev/null; then
    echo "Utilisation de docker-compose"
else
    echo "Utilisation de docker compose"
fi
```
#### 3. Problèmes d'installation des paquets {#3-package-installation-issues}

```bash
# Mettre à jour le cache des paquets
apt update

# Réparer les paquets cassés
apt --fix-broken install

# Vérifier les paquets en attente
apt-mark showhold
```

### Problèmes courants {#common-issues}

#### 1. Le service Docker ne démarre pas {#1-docker-service-wont-start}

```bash
# Vérifier le statut de Docker
systemctl status docker

# Consulter les logs de Docker
journalctl -u docker

# Essayer un démarrage alternatif
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Échec de la génération du certificat {#2-certificate-generation-fails}

* Assurez-vous que les ports 80 et 443 sont accessibles
* Vérifiez que les enregistrements DNS pointent vers votre serveur
* Contrôlez les règles du pare-feu avec `ufw status`

#### 3. Problèmes de livraison des e-mails {#3-email-delivery-issues}

* Vérifiez que les enregistrements MX sont corrects
* Contrôlez les enregistrements SPF, DKIM et DMARC
* Assurez-vous que le port 25 n'est pas bloqué par votre hébergeur

### Obtenir de l'aide {#getting-help}

* **Documentation** : <https://forwardemail.net/self-hosted>
* **Problèmes GitHub** : <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentation Debian** : <https://www.debian.org/doc/>


## Bonnes pratiques de sécurité {#security-best-practices}

1. **Maintenir le système à jour** : Mettez régulièrement à jour Debian et les paquets
2. **Surveiller les logs** : Configurez la surveillance et les alertes des journaux
3. **Sauvegarder régulièrement** : Testez les procédures de sauvegarde et de restauration
4. **Utiliser des mots de passe forts** : Générez des mots de passe robustes pour tous les comptes
5. **Activer Fail2Ban** : Envisagez d’installer fail2ban pour une sécurité supplémentaire
6. **Audits de sécurité réguliers** : Passez périodiquement en revue votre configuration
7. **Surveiller Snapd** : Maintenez les paquets snap à jour avec `snap refresh`


## Conclusion {#conclusion}

Votre installation auto-hébergée de Forward Email devrait maintenant être complète et fonctionner sous Debian. N’oubliez pas de :

1. Configurer correctement vos enregistrements DNS
2. Tester l’envoi et la réception des e-mails
3. Mettre en place des sauvegardes régulières
4. Surveiller régulièrement votre système
5. Maintenir votre installation à jour
6. Surveiller snapd et les paquets snap

Les principales différences avec Ubuntu concernent l’installation de snapd et la configuration du dépôt Docker. Une fois ces éléments correctement configurés, l’application Forward Email se comporte de manière identique sur les deux systèmes.

Pour des options de configuration supplémentaires et des fonctionnalités avancées, consultez la documentation officielle de Forward Email à <https://forwardemail.net/self-hosted#configuration>.
