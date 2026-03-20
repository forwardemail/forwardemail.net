# Guide d'installation de Forward Email en auto-hébergement pour Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Table des matières {#table-of-contents}

* [Aperçu](#overview)
* [Prérequis](#prerequisites)
* [Exigences système](#system-requirements)
* [Installation étape par étape](#step-by-step-installation)
  * [Étape 1 : Configuration initiale du système](#step-1-initial-system-setup)
  * [Étape 2 : Configurer les résolveurs DNS](#step-2-configure-dns-resolvers)
  * [Étape 3 : Installer les dépendances système](#step-3-install-system-dependencies)
  * [Étape 4 : Installer les paquets Snap](#step-4-install-snap-packages)
  * [Étape 5 : Installer Docker](#step-5-install-docker)
  * [Étape 6 : Configurer le service Docker](#step-6-configure-docker-service)
  * [Étape 7 : Configurer le pare-feu](#step-7-configure-firewall)
  * [Étape 8 : Cloner le dépôt Forward Email](#step-8-clone-forward-email-repository)
  * [Étape 9 : Configurer l'environnement](#step-9-set-up-environment-configuration)
  * [Étape 10 : Configurer votre domaine](#step-10-configure-your-domain)
  * [Étape 11 : Générer les certificats SSL](#step-11-generate-ssl-certificates)
  * [Étape 12 : Générer les clés de chiffrement](#step-12-generate-encryption-keys)
  * [Étape 13 : Mettre à jour les chemins SSL dans la configuration](#step-13-update-ssl-paths-in-configuration)
  * [Étape 14 : Configurer l'authentification basique](#step-14-set-up-basic-authentication)
  * [Étape 15 : Déployer avec Docker Compose](#step-15-deploy-with-docker-compose)
  * [Étape 16 : Vérifier l'installation](#step-16-verify-installation)
* [Configuration post-installation](#post-installation-configuration)
  * [Configuration des enregistrements DNS](#dns-records-setup)
  * [Première connexion](#first-login)
* [Configuration des sauvegardes](#backup-configuration)
  * [Configurer une sauvegarde compatible S3](#set-up-s3-compatible-backup)
  * [Configurer les tâches cron de sauvegarde](#set-up-backup-cron-jobs)
* [Configuration de la mise à jour automatique](#auto-update-configuration)
* [Maintenance et surveillance](#maintenance-and-monitoring)
  * [Emplacements des journaux](#log-locations)
  * [Tâches régulières de maintenance](#regular-maintenance-tasks)
  * [Renouvellement des certificats](#certificate-renewal)
* [Dépannage](#troubleshooting)
  * [Problèmes courants](#common-issues)
  * [Obtenir de l'aide](#getting-help)
* [Bonnes pratiques de sécurité](#security-best-practices)
* [Conclusion](#conclusion)


## Aperçu {#overview}

Ce guide fournit des instructions étape par étape pour installer la solution auto-hébergée de Forward Email sur des systèmes Ubuntu. Ce guide est spécialement conçu pour les versions Ubuntu 20.04, 22.04 et 24.04 LTS.


## Prérequis {#prerequisites}

Avant de commencer l'installation, assurez-vous de disposer de :

* **Serveur Ubuntu** : 20.04, 22.04 ou 24.04 LTS
* **Accès root** : Vous devez pouvoir exécuter des commandes en tant que root (accès sudo)
* **Nom de domaine** : Un domaine que vous contrôlez avec accès à la gestion DNS
* **Serveur propre** : Il est recommandé d'utiliser une installation Ubuntu fraîche
* **Connexion Internet** : Nécessaire pour télécharger les paquets et les images Docker


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

Installez les paquets requis pour Forward Email :

```bash
# Mettre à jour la liste des paquets
apt-get update -y

# Installer les dépendances de base
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Étape 4 : Installer les paquets Snap {#step-4-install-snap-packages}

Installez AWS CLI et Certbot via snap :

```bash
# Installer AWS CLI
snap install aws-cli --classic

# Installer Certbot et le plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Étape 5 : Installer Docker {#step-5-install-docker}

Installez Docker CE et Docker Compose :

```bash
# Ajouter la clé GPG officielle de Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Ajouter le dépôt Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Mettre à jour l'index des paquets et installer Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier l'installation de Docker
docker --version
docker compose version
```

### Étape 6 : Configurer le service Docker {#step-6-configure-docker-service}

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

### Étape 7 : Configurer le pare-feu {#step-7-configure-firewall}

Configurez le pare-feu UFW pour sécuriser votre serveur :

```bash
# Définir les politiques par défaut
ufw default deny incoming
ufw default allow outgoing

# Autoriser SSH (important - ne vous bloquez pas l'accès !)
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

### Étape 8 : Cloner le dépôt Forward Email {#step-8-clone-forward-email-repository}

Téléchargez le code source de Forward Email :

```bash
# Définir les variables
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Cloner le dépôt
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Vérifier que le clonage a réussi
ls -la
```

### Étape 9 : Configurer l'environnement {#step-9-set-up-environment-configuration}

Préparez la configuration de l'environnement :

```bash
# Définir les variables de répertoire
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copier le fichier d'environnement par défaut
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Créer le répertoire SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Créer les répertoires de base de données
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Étape 10 : Configurer votre domaine {#step-10-configure-your-domain}

Définissez votre nom de domaine et mettez à jour les variables d'environnement :

```bash
# Remplacez 'yourdomain.com' par votre domaine réel
DOMAIN="yourdomain.com"

# Fonction pour mettre à jour le fichier d'environnement
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Mettre à jour les variables d'environnement liées au domaine
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
### Étape 11 : Générer les certificats SSL {#step-11-generate-ssl-certificates}

#### Option A : Challenge DNS manuel (Recommandé pour la plupart des utilisateurs) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Générer les certificats en utilisant le challenge DNS manuel
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Important** : Lorsque vous y êtes invité, vous devrez créer des enregistrements TXT dans votre DNS. Vous pouvez voir plusieurs challenges pour le même domaine - **créez TOUS ces enregistrements**. Ne supprimez pas le premier enregistrement TXT lorsque vous ajoutez le second.

#### Option B : DNS Cloudflare (Si vous utilisez Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Si votre domaine utilise Cloudflare pour le DNS, vous pouvez automatiser la génération des certificats :

```bash
# Créer le fichier d'identifiants Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Définir les permissions appropriées
chmod 600 /root/.cloudflare.ini

# Générer les certificats automatiquement
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

Après la génération des certificats, copiez-les dans le répertoire de l’application :

```bash
# Copier les certificats dans le répertoire SSL de l’application
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Vérifier que les certificats ont été copiés
ls -la "$SELF_HOST_DIR/ssl/"
```

### Étape 12 : Générer les clés de chiffrement {#step-12-generate-encryption-keys}

Créez les différentes clés de chiffrement nécessaires au fonctionnement sécurisé :

```bash
# Générer la clé de chiffrement auxiliaire
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Générer le secret SRS pour le transfert d’email
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Générer la clé de chiffrement TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Générer la clé privée DKIM pour la signature des emails
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Générer la clé de signature webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Définir le mot de passe du transport SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Toutes les clés de chiffrement ont été générées avec succès"
```

### Étape 13 : Mettre à jour les chemins SSL dans la configuration {#step-13-update-ssl-paths-in-configuration}

Configurez les chemins des certificats SSL dans le fichier d’environnement :

```bash
# Mettre à jour les chemins SSL pour pointer vers les bons fichiers de certificat
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Étape 14 : Configurer l’authentification basique {#step-14-set-up-basic-authentication}

Créez des identifiants temporaires pour l’authentification basique :

```bash
# Générer un mot de passe aléatoire sécurisé
PASSWORD=$(openssl rand -base64 16)

# Mettre à jour le fichier d’environnement avec les identifiants d’authentification basique
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Afficher les identifiants (conservez-les !)
echo ""
echo "🔐 IMPORTANT : Sauvegardez ces identifiants de connexion !"
echo "=================================="
echo "Nom d’utilisateur : admin"
echo "Mot de passe : $PASSWORD"
echo "=================================="
echo ""
echo "Vous en aurez besoin pour accéder à l’interface web après l’installation."
echo ""
```

### Étape 15 : Déployer avec Docker Compose {#step-15-deploy-with-docker-compose}

Démarrez tous les services Forward Email :

```bash
# Définir le chemin du fichier Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Arrêter les conteneurs existants
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Télécharger les dernières images
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Démarrer tous les services en mode détaché
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Attendre un moment que les services démarrent
sleep 10

# Vérifier le statut des services
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Étape 16 : Vérifier l'installation {#step-16-verify-installation}

Vérifiez que tous les services fonctionnent correctement :

```bash
# Vérifier les conteneurs Docker
docker ps

# Vérifier les journaux des services pour toute erreur
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Tester la connectivité de l'interface web
curl -I https://$DOMAIN

# Vérifier si les ports sont à l'écoute
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
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

Obtenez votre clé publique DKIM :

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
2. Saisissez les identifiants d'authentification de base que vous avez enregistrés précédemment
3. Complétez l'assistant de configuration initiale
4. Créez votre premier compte email


## Configuration des sauvegardes {#backup-configuration}

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

# Pour un S3 non-AWS (comme Cloudflare R2), ajoutez l'URL du point de terminaison
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Configurer les tâches cron de sauvegarde {#set-up-backup-cron-jobs}

```bash
# Rendre les scripts de sauvegarde exécutables
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Ajouter la tâche cron de sauvegarde MongoDB (exécutée tous les jours à minuit)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Ajouter la tâche cron de sauvegarde Redis (exécutée tous les jours à minuit)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Vérifier que les tâches cron ont été ajoutées
crontab -l
```


## Configuration de la mise à jour automatique {#auto-update-configuration}

Configurez les mises à jour automatiques pour votre installation Forward Email :

```bash
# Créer la commande de mise à jour automatique
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Ajouter la tâche cron de mise à jour automatique (exécutée tous les jours à 1h du matin)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Vérifier que la tâche cron a été ajoutée
crontab -l
```


## Maintenance et surveillance {#maintenance-and-monitoring}

### Emplacements des journaux {#log-locations}

* **Journaux Docker Compose** : `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Journaux système** : `/var/log/syslog`
* **Journaux de sauvegarde** : `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Journaux de mise à jour automatique** : `/var/log/autoupdate.log`

### Tâches régulières de maintenance {#regular-maintenance-tasks}

1. **Surveiller l'espace disque** : `df -h`
2. **Vérifier le statut des services** : `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Consulter les journaux** : `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Mettre à jour les paquets système** : `apt update && apt upgrade`
5. **Renouveler les certificats** : Les certificats se renouvellent automatiquement, mais surveillez leur expiration

### Renouvellement des certificats {#certificate-renewal}

Les certificats doivent se renouveler automatiquement, mais vous pouvez les renouveler manuellement si nécessaire :

```bash
# Renouvellement manuel des certificats
certbot renew

# Copier les certificats renouvelés
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Redémarrer les services pour utiliser les nouveaux certificats
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Dépannage {#troubleshooting}

### Problèmes Courants {#common-issues}

#### 1. Le service Docker ne démarre pas {#1-docker-service-wont-start}

```bash
# Vérifier le statut de Docker
systemctl status docker

# Essayer un démarrage alternatif
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Échec de la génération du certificat {#2-certificate-generation-fails}

* Assurez-vous que les ports 80 et 443 sont accessibles
* Vérifiez que les enregistrements DNS pointent vers votre serveur
* Contrôlez les paramètres du pare-feu

#### 3. Problèmes de livraison des emails {#3-email-delivery-issues}

* Vérifiez que les enregistrements MX sont corrects
* Contrôlez les enregistrements SPF, DKIM et DMARC
* Assurez-vous que le port 25 n’est pas bloqué par votre hébergeur

#### 4. Interface web inaccessible {#4-web-interface-not-accessible}

* Vérifiez les paramètres du pare-feu : `ufw status`
* Vérifiez les certificats SSL : `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Contrôlez les identifiants d’authentification basique

### Obtenir de l’aide {#getting-help}

* **Documentation** : <https://forwardemail.net/self-hosted>
* **Problèmes GitHub** : <https://github.com/forwardemail/forwardemail.net/issues>
* **Support Communautaire** : Consultez les discussions GitHub du projet


## Bonnes pratiques de sécurité {#security-best-practices}

1. **Maintenez le système à jour** : Mettez régulièrement à jour Ubuntu et les paquets
2. **Surveillez les journaux** : Configurez la surveillance et les alertes des logs
3. **Sauvegardez régulièrement** : Testez les procédures de sauvegarde et de restauration
4. **Utilisez des mots de passe forts** : Générez des mots de passe robustes pour tous les comptes
5. **Activez Fail2Ban** : Envisagez d’installer fail2ban pour une sécurité supplémentaire
6. **Audits de sécurité réguliers** : Passez périodiquement en revue votre configuration


## Conclusion {#conclusion}

Votre installation self-hosted de Forward Email devrait maintenant être complète et fonctionner sous Ubuntu. N’oubliez pas de :

1. Configurer correctement vos enregistrements DNS
2. Tester l’envoi et la réception des emails
3. Mettre en place des sauvegardes régulières
4. Surveiller votre système régulièrement
5. Maintenir votre installation à jour

Pour des options de configuration supplémentaires et des fonctionnalités avancées, consultez la documentation officielle de Forward Email à <https://forwardemail.net/self-hosted#configuration>.
