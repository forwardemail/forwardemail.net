# מדריך התקנת Forward Email Self-Hosting עבור Debian {#forward-email-self-hosting-installation-guide-for-debian}


## תוכן העניינים {#table-of-contents}

* [סקירה כללית](#overview)
* [דרישות מוקדמות](#prerequisites)
* [דרישות מערכת](#system-requirements)
* [התקנה שלב אחר שלב](#step-by-step-installation)
  * [שלב 1: הגדרת מערכת ראשונית](#step-1-initial-system-setup)
  * [שלב 2: הגדרת מפענחי DNS](#step-2-configure-dns-resolvers)
  * [שלב 3: התקנת תלות מערכת](#step-3-install-system-dependencies)
  * [שלב 4: התקנה והגדרת Snapd](#step-4-install-and-configure-snapd)
  * [שלב 5: התקנת חבילות Snap](#step-5-install-snap-packages)
  * [שלב 6: התקנת Docker](#step-6-install-docker)
  * [שלב 7: הגדרת שירות Docker](#step-7-configure-docker-service)
  * [שלב 8: התקנה והגדרת חומת אש UFW](#step-8-install-and-configure-ufw-firewall)
  * [שלב 9: שכפול מאגר Forward Email](#step-9-clone-forward-email-repository)
  * [שלב 10: הגדרת קונפיגורציית סביבה](#step-10-set-up-environment-configuration)
  * [שלב 11: הגדרת הדומיין שלך](#step-11-configure-your-domain)
  * [שלב 12: יצירת תעודות SSL](#step-12-generate-ssl-certificates)
  * [שלב 13: יצירת מפתחות הצפנה](#step-13-generate-encryption-keys)
  * [שלב 14: עדכון נתיבי SSL בקונפיגורציה](#step-14-update-ssl-paths-in-configuration)
  * [שלב 15: הגדרת אימות בסיסי](#step-15-set-up-basic-authentication)
  * [שלב 16: פריסה עם Docker Compose](#step-16-deploy-with-docker-compose)
  * [שלב 17: אימות ההתקנה](#step-17-verify-installation)
* [קונפיגורציה לאחר התקנה](#post-installation-configuration)
  * [הגדרת רשומות DNS](#dns-records-setup)
  * [כניסה ראשונה](#first-login)
* [קונפיגורציית גיבוי](#backup-configuration)
  * [הגדרת גיבוי תואם S3](#set-up-s3-compatible-backup)
  * [הגדרת משימות Cron לגיבוי](#set-up-backup-cron-jobs)
* [קונפיגורציית עדכון אוטומטי](#auto-update-configuration)
* [שיקולים ספציפיים ל-Debian](#debian-specific-considerations)
  * [הבדלים בניהול חבילות](#package-management-differences)
  * [ניהול שירותים](#service-management)
  * [הגדרת רשת](#network-configuration)
* [תחזוקה ומעקב](#maintenance-and-monitoring)
  * [מיקומי לוגים](#log-locations)
  * [משימות תחזוקה שוטפות](#regular-maintenance-tasks)
  * [חידוש תעודות](#certificate-renewal)
* [פתרון בעיות](#troubleshooting)
  * [בעיות ספציפיות ל-Debian](#debian-specific-issues)
  * [בעיות נפוצות](#common-issues)
  * [קבלת עזרה](#getting-help)
* [המלצות אבטחה](#security-best-practices)
* [סיכום](#conclusion)


## סקירה כללית {#overview}

מדריך זה מספק הוראות שלב אחר שלב להתקנת פתרון ה-self-hosted של Forward Email על מערכות Debian. מדריך זה מותאם במיוחד עבור Debian 11 (Bullseye) ו-Debian 12 (Bookworm).


## דרישות מוקדמות {#prerequisites}

לפני תחילת ההתקנה, ודא שיש לך:

* **שרת Debian**: גרסה 11 (Bullseye) או 12 (Bookworm)
* **גישה כ-root**: עליך להיות מסוגל להריץ פקודות כ-root (גישה עם sudo)
* **שם דומיין**: דומיין שבשליטתך עם גישה לניהול DNS
* **שרת נקי**: מומלץ להשתמש בהתקנת Debian חדשה
* **חיבור אינטרנט**: נדרש להורדת חבילות ותמונות Docker


## דרישות מערכת {#system-requirements}

* **זיכרון RAM**: מינימום 2GB (מומלץ 4GB לייצור)
* **אחסון**: מינימום 20GB שטח פנוי (מומלץ 50GB+ לייצור)
* **מעבד CPU**: מינימום 1 vCPU (מומלץ 2+ vCPUs לייצור)
* **רשת**: כתובת IP ציבורית עם הפתחים הבאים נגישים:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## התקנה שלב אחר שלב {#step-by-step-installation}

### שלב 1: הגדרת מערכת ראשונית {#step-1-initial-system-setup}

ראשית, ודא שהמערכת שלך מעודכנת והחלף למשתמש root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```
### Step 2: Configure DNS Resolvers {#step-2-configure-dns-resolvers}

הגדר את המערכת שלך להשתמש בשרתי ה-DNS של Cloudflare לצורך יצירת תעודות אמינות:

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

### Step 3: Install System Dependencies {#step-3-install-system-dependencies}

התקן את החבילות הנדרשות עבור Forward Email בדביאן:

```bash
# Update package list
apt-get update -y

# Install basic dependencies (Debian-specific package list)
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

### Step 4: Install and Configure Snapd {#step-4-install-and-configure-snapd}

בדביאן לא כלול snapd כברירת מחדל, לכן יש להתקין ולהגדיר אותו:

```bash
# Install snapd
apt-get install -y snapd

# Enable and start snapd service
systemctl enable snapd
systemctl start snapd

# Create symlink for snap to work properly
ln -sf /var/lib/snapd/snap /snap

# Wait for snapd to be ready
sleep 10

# Verify snapd is working
snap version
```

### Step 5: Install Snap Packages {#step-5-install-snap-packages}

התקן את AWS CLI ו-Certbot דרך snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verify installations
aws --version
certbot --version
```

### Step 6: Install Docker {#step-6-install-docker}

התקן את Docker CE ו-Docker Compose בדביאן:

```bash
# Add Docker's official GPG key (Debian-specific)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository (Debian-specific)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update package index and install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install standalone docker-compose as fallback (if plugin doesn't work)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verify Docker installation
docker --version
docker compose version || docker-compose --version
```

### Step 7: Configure Docker Service {#step-7-configure-docker-service}

ודא ש-Docker יתחיל אוטומטית ופועל:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

אם Docker נכשל בהפעלה, נסה להפעילו ידנית:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Install and Configure UFW Firewall {#step-8-install-and-configure-ufw-firewall}

התקנות מינימליות של דביאן עשויות לא לכלול את UFW, לכן התקן אותו תחילה:

```bash
# Install UFW if not present
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

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
### שלב 9: שכפל את מאגר Forward Email {#step-9-clone-forward-email-repository}

הורד את קוד המקור של Forward Email:

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

### שלב 10: הגדר את תצורת הסביבה {#step-10-set-up-environment-configuration}

הכן את תצורת הסביבה:

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

### שלב 11: הגדר את הדומיין שלך {#step-11-configure-your-domain}

הגדר את שם הדומיין שלך ועדכן את משתני הסביבה:

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

### שלב 12: צור תעודות SSL {#step-12-generate-ssl-certificates}

#### אפשרות א: אתגר DNS ידני (מומלץ לרוב המשתמשים) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**חשוב**: כאשר תתבקש, תצטרך ליצור רשומות TXT ב-DNS שלך. ייתכן שתראה מספר אתגרים עבור אותו דומיין - **צור את כולם**. אל תסיר את רשומת ה-TXT הראשונה כשאתה מוסיף את השנייה.

#### אפשרות ב: DNS של Cloudflare (אם אתה משתמש ב-Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

אם הדומיין שלך משתמש ב-Cloudflare עבור DNS, תוכל לאוטומט את יצירת התעודות:

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

#### העתק תעודות {#copy-certificates}

לאחר יצירת התעודות, העתק אותן לתיקיית האפליקציה:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### שלב 13: צור מפתחות הצפנה {#step-13-generate-encryption-keys}

צור את מפתחות ההצפנה השונים הדרושים להפעלה מאובטחת:

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
### Step 14: Update SSL Paths in Configuration {#step-14-update-ssl-paths-in-configuration}

הגדר את נתיבי תעודת ה-SSL בקובץ הסביבה:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Set Up Basic Authentication {#step-15-set-up-basic-authentication}

צור אישורי אימות בסיסיים זמניים:

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
echo "שם משתמש: admin"
echo "סיסמה: $PASSWORD"
echo "=================================="
echo ""
echo "תזדקק לאלה כדי לגשת לממשק האינטרנט לאחר ההתקנה."
echo ""
```

### Step 16: Deploy with Docker Compose {#step-16-deploy-with-docker-compose}

הפעל את כל שירותי Forward Email:

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop any existing containers
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Pull the latest images
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Start all services in detached mode
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Wait a moment for services to start
sleep 10

# Check service status
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Step 17: Verify Installation {#step-17-verify-installation}

בדוק שכל השירותים פועלים כראוי:

```bash
# Check Docker containers
docker ps

# Check service logs for any errors
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Test web interface connectivity
curl -I https://$DOMAIN

# Check if ports are listening
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Post-Installation Configuration {#post-installation-configuration}

### DNS Records Setup {#dns-records-setup}

עליך להגדיר את רשומות ה-DNS הבאות עבור הדומיין שלך:

#### MX Record {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A Records {#a-records}

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

#### SPF Record {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM Record {#dkim-record}

קבל את מפתח ה-DKIM הציבורי שלך:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

צור רשומת DKIM ב-DNS:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC Record {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### First Login {#first-login}

1. פתח את דפדפן האינטרנט שלך וגש ל- `https://yourdomain.com`
2. הזן את אישורי האימות הבסיסיים ששמרת קודם
3. השלם את אשף ההגדרה הראשוני
4. צור את חשבון האימייל הראשון שלך


## Backup Configuration {#backup-configuration}

### Set Up S3-Compatible Backup {#set-up-s3-compatible-backup}

הגדר גיבויים אוטומטיים לאחסון תואם S3:

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
### הגדרת עבודות Cron לגיבוי {#set-up-backup-cron-jobs}

```bash
# הפוך את סקריפטי הגיבוי לביצועים
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# הוסף עבודת cron לגיבוי MongoDB (רצה מדי יום בחצות)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# הוסף עבודת cron לגיבוי Redis (רצה מדי יום בחצות)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# אמת שעבודות ה-cron נוספו
crontab -l
```


## הגדרת עדכון אוטומטי {#auto-update-configuration}

הגדר עדכונים אוטומטיים להתקנת Forward Email שלך:

```bash
# צור פקודת עדכון אוטומטי (השתמש בפקודת docker compose המתאימה)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# הוסף עבודת cron לעדכון אוטומטי (רצה מדי יום בשעה 1 בלילה)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# אמת שעבודת ה-cron נוספה
crontab -l
```


## שיקולים ספציפיים ל-Debian {#debian-specific-considerations}

### הבדלים בניהול חבילות {#package-management-differences}

* **Snapd**: לא מותקן כברירת מחדל ב-Debian, דורש התקנה ידנית
* **Docker**: משתמש במאגרי Debian ספציפיים ומפתחות GPG
* **UFW**: ייתכן שלא ייכלל בהתקנות מינימליות של Debian
* **systemd**: ההתנהגות עשויה להיות שונה במעט מאובונטו

### ניהול שירותים {#service-management}

```bash
# בדוק סטטוס שירותים (פקודות ספציפיות ל-Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# הפעל מחדש שירותים במידת הצורך
systemctl restart snapd
systemctl restart docker
```

### תצורת רשת {#network-configuration}

ייתכן של-Debian יש שמות או תצורות שונות לממשקי רשת:

```bash
# בדוק ממשקי רשת
ip addr show

# בדוק ניתוב
ip route show

# בדוק פתרון DNS
nslookup google.com
```


## תחזוקה ומעקב {#maintenance-and-monitoring}

### מיקומי לוגים {#log-locations}

* **לוגים של Docker Compose**: השתמש בפקודת docker compose המתאימה לפי ההתקנה
* **לוגי מערכת**: `/var/log/syslog`
* **לוגי גיבוי**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **לוגי עדכון אוטומטי**: `/var/log/autoupdate.log`
* **לוגי Snapd**: `journalctl -u snapd`

### משימות תחזוקה שוטפות {#regular-maintenance-tasks}

1. **נטר שטח דיסק**: `df -h`
2. **בדוק סטטוס שירותים**: השתמש בפקודת docker compose המתאימה
3. **סקור לוגים**: בדוק גם לוגים של האפליקציה וגם של המערכת
4. **עדכן חבילות מערכת**: `apt update && apt upgrade`
5. **נטר את snapd**: `snap list` ו-`snap refresh`

### חידוש תעודות SSL {#certificate-renewal}

התעודות אמורות להתחדש אוטומטית, אך ניתן לחדש ידנית במידת הצורך:

```bash
# חידוש תעודה ידני
certbot renew

# העתקת תעודות מחודשות
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# הפעל מחדש שירותים לשימוש בתעודות החדשות
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## פתרון בעיות {#troubleshooting}

### בעיות ספציפיות ל-Debian {#debian-specific-issues}

#### 1. Snapd לא עובד {#1-snapd-not-working}

```bash
# בדוק סטטוס snapd
systemctl status snapd

# הפעל מחדש את snapd
systemctl restart snapd

# בדוק את PATH של snap
echo $PATH | grep snap

# הוסף את snap ל-PATH אם חסר
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. פקודת Docker Compose לא נמצאה {#2-docker-compose-command-not-found}

```bash
# בדוק איזו פקודת docker compose זמינה
command -v docker-compose
command -v docker

# השתמש בפקודה המתאימה בסקריפטים
if command -v docker-compose &> /dev/null; then
    echo "משתמש ב-docker-compose"
else
    echo "משתמש ב-docker compose"
fi
```
#### 3. בעיות בהתקנת חבילות {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### בעיות נפוצות {#common-issues}

#### 1. שירות Docker לא מתחיל {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. כשל ביצירת תעודה {#2-certificate-generation-fails}

* ודא שפורט 80 ו-443 נגישים
* אמת שרשומות ה-DNS מפנות לשרת שלך
* בדוק את הגדרות חומת האש עם `ufw status`

#### 3. בעיות בהעברת דואר אלקטרוני {#3-email-delivery-issues}

* אמת שרשומות MX נכונות
* בדוק רשומות SPF, DKIM ו-DMARC
* ודא שפורט 25 אינו חסום על ידי ספק האירוח שלך

### קבלת עזרה {#getting-help}

* **תיעוד**: <https://forwardemail.net/self-hosted>
* **בעיות ב-GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **תיעוד דביאן**: <https://www.debian.org/doc/>


## שיטות עבודה מומלצות לאבטחה {#security-best-practices}

1. **שמור על המערכת מעודכנת**: עדכן באופן קבוע את דביאן והחבילות
2. **נטר יומנים**: הגדר ניטור והתראות ליומנים
3. **גבה באופן קבוע**: בדוק נהלי גיבוי ושחזור
4. **השתמש בסיסמאות חזקות**: צור סיסמאות חזקות לכל החשבונות
5. **הפעל Fail2Ban**: שקול להתקין fail2ban לאבטחה נוספת
6. **בצע ביקורות אבטחה תקופתיות**: בדוק את התצורה שלך מעת לעת
7. **נטר את Snapd**: שמור על חבילות snap מעודכנות עם `snap refresh`


## סיכום {#conclusion}

התקנת Forward Email עצמאית שלך אמורה להיות כעת מלאה ופועלת על דביאן. זכור:

1. הגדר את רשומות ה-DNS שלך כראוי
2. בדוק שליחת וקבלת דואר אלקטרוני
3. הגדר גיבויים קבועים
4. נטר את המערכת שלך באופן קבוע
5. שמור על ההתקנה מעודכנת
6. נטר את snapd וחבילות ה-snap

ההבדלים העיקריים מאובונטו הם התקנת snapd והגדרת מאגר Docker. לאחר שהדברים הללו מוגדרים כראוי, אפליקציית Forward Email מתנהגת זהה בשתי המערכות.

לאפשרויות תצורה נוספות ותכונות מתקדמות, עיין בתיעוד הרשמי של Forward Email בכתובת <https://forwardemail.net/self-hosted#configuration>.
