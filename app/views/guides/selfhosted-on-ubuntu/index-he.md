# מדריך התקנה של העברת דוא"ל לאירוח עצמי עבור אובונטו {#forward-email-self-hosting-installation-guide-for-ubuntu}

תוכן עניינים {##

* [סקירה כללית](#overview)
* [דרישות מוקדמות](#prerequisites)
* [דרישות מערכת](#system-requirements)
* [התקנה שלב אחר שלב](#step-by-step-installation)
  * [שלב 1: הגדרת מערכת ראשונית](#step-1-initial-system-setup)
  * [שלב 2: הגדרת פותרי DNS](#step-2-configure-dns-resolvers)
  * [שלב 3: התקנת תלויות מערכת](#step-3-install-system-dependencies)
  * [שלב 4: התקנת חבילות Snap](#step-4-install-snap-packages)
  * [שלב 5: התקנת Docker](#step-5-install-docker)
  * [שלב 6: הגדרת שירות Docker](#step-6-configure-docker-service)
  * [שלב 7: הגדרת חומת אש](#step-7-configure-firewall)
  * [שלב 8: שכפול מאגר דוא"ל עתידי](#step-8-clone-forward-email-repository)
  * [שלב 9: הגדרת תצורת סביבה](#step-9-set-up-environment-configuration)
  * [שלב 10: הגדרת הדומיין שלך](#step-10-configure-your-domain)
  * [שלב 11: יצירת תעודות SSL](#step-11-generate-ssl-certificates)
  * [שלב 12: יצירת מפתחות הצפנה](#step-12-generate-encryption-keys)
  * [שלב 13: עדכון נתיבי SSL בתצורה](#step-13-update-ssl-paths-in-configuration)
  * [שלב 14: הגדרת אימות בסיסי](#step-14-set-up-basic-authentication)
  * [שלב 15: פריסה עם Docker Compose](#step-15-deploy-with-docker-compose)
  * [שלב 16: אימות ההתקנה](#step-16-verify-installation)
* [תצורה לאחר ההתקנה](#post-installation-configuration)
  * [הגדרת רשומות DNS](#dns-records-setup)
  * [כניסה ראשונה](#first-login)
* [תצורת גיבוי](#backup-configuration)
  * [הגדר גיבוי תואם S3](#set-up-s3-compatible-backup)
  * [הגדרת גיבוי של עבודות Cron](#set-up-backup-cron-jobs)
* [תצורת עדכון אוטומטי](#auto-update-configuration)
* [תחזוקה ומעקב](#maintenance-and-monitoring)
  * [מיקומי יומן](#log-locations)
  * [משימות תחזוקה שוטפות](#regular-maintenance-tasks)
  * [חידוש תעודה](#certificate-renewal)
* [פתרון בעיות](#troubleshooting)
  * [בעיות נפוצות](#common-issues)
  * [קבלת עזרה](#getting-help)
* [שיטות עבודה מומלצות לאבטחה](#security-best-practices)
* [מַסְקָנָה](#conclusion)

## סקירה כללית {#overview}

מדריך זה מספק הוראות שלב אחר שלב להתקנת פתרון אירוח עצמי של Forward Email במערכות Ubuntu. מדריך זה מותאם במיוחד לגרסאות Ubuntu 20.04, 22.04 ו-24.04 LTS.

## דרישות קדם {#prerequisites}

לפני תחילת ההתקנה, ודא שיש לך:

* **שרת אובונטו**: 20.04, 22.04, או 24.04 LTS
* **גישת Root**: עליך להיות מסוגל להריץ פקודות כ-root (גישת sudo)
* **שם דומיין**: דומיין שאתה שולט בו עם גישת ניהול DNS
* **שרת נקי**: מומלץ להשתמש בהתקנה חדשה של אובונטו
* **חיבור לאינטרנט**: נדרש להורדת חבילות ותמונות Docker

## דרישות מערכת {#system-requirements}

* **זיכרון RAM**: מינימום 2GB (מומלץ 4GB לייצור)
* **אחסון**: מינימום 20GB שטח פנוי (מומלץ 50GB+ לייצור)
* **מעבד**: מינימום vCPU אחד (מומלץ 2+ vCPU לייצור)
* **רשת**: כתובת IP ציבורית עם הפורטים הבאים נגישים:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## התקנה שלב אחר שלב {#step-by-step-installation}

### שלב 1: הגדרת מערכת ראשונית {#step-1-initial-system-setup}

ראשית, ודא שהמערכת שלך מעודכנת ועבור למשתמש root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### שלב 2: הגדרת פותרי DNS {#step-2-configure-dns-resolvers}

הגדר את המערכת שלך לשימוש בשרתי ה-DNS של Cloudflare ליצירת אישורים אמינה:

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

### שלב 3: התקנת תלויות מערכת {#step-3-install-system-dependencies}

התקן את החבילות הנדרשות עבור העברת דוא"ל:

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

### שלב 4: התקנת חבילות Snap {#step-4-install-snap-packages}

התקנת AWS CLI ו-Certbot דרך snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### שלב 5: התקנת Docker {#step-5-install-docker}

התקנת Docker CE ו-Docker Compose:

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

### שלב 6: הגדרת שירות Docker {#step-6-configure-docker-service}

ודא ש-Docker מופעל אוטומטית ופועל:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

אם Docker לא מצליח להפעיל אותו, נסה להפעיל אותו ידנית:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### שלב 7: הגדרת חומת אש {#step-7-configure-firewall}

הגדר חומת אש של UFW כדי לאבטח את השרת שלך:

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

### שלב 8: שכפול מאגר דוא"ל להעברה {#step-8-clone-forward-email-repository}

הורד את קוד המקור של העברת דוא"ל:

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

### שלב 9: הגדרת תצורת סביבה {#step-9-set-up-environment-configuration}

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

### שלב 10: הגדרת הדומיין שלך {#step-10-configure-your-domain}

הגדר את שם הדומיין שלך ועדכן משתני סביבה:

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

### שלב 11: יצירת תעודות SSL {#step-11-generate-ssl-certificates}

#### אפשרות א': אתגר DNS ידני (מומלץ לרוב המשתמשים) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**חשוב**: כאשר תתבקש, תצטרך ליצור רשומות TXT ב-DNS שלך. ייתכן שתראה מספר אתגרים עבור אותו דומיין - **צור את כולן**. אל תסיר את רשומת ה-TXT הראשונה בעת הוספת השנייה.

#### אפשרות ב': DNS של Cloudflare (אם אתם משתמשים ב-Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

אם הדומיין שלך משתמש ב-Cloudflare עבור DNS, תוכל להפוך את יצירת האישורים לאוטומטית:

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

לאחר יצירת התעודה, העתיקו אותה לתיקיית היישום:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### שלב 12: יצירת מפתחות הצפנה {#step-12-generate-encryption-keys}

צור את מפתחות ההצפנה השונים הנדרשים לפעולה מאובטחת:

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

### שלב 13: עדכון נתיבי SSL בתצורה {#step-13-update-ssl-paths-in-configuration}

הגדר את נתיבי אישורי ה-SSL בקובץ הסביבה:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### שלב 14: הגדרת אימות בסיסי {#step-14-set-up-basic-authentication}

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
echo "Username: admin"
echo "Password: $PASSWORD"
echo "=================================="
echo ""
echo "You'll need these to access the web interface after installation."
echo ""
```

### שלב 15: פריסה עם Docker Compose {#step-15-deploy-with-docker-compose}

הפעל את כל שירותי העברת הדוא"ל:

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

### שלב 16: אימות התקנה {#step-16-verify-installation}

בדוק שכל השירותים פועלים כראוי:

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

## הגדרות לאחר התקנה {#post-installation-configuration}

### הגדרת רשומות DNS {#dns-records-setup}

עליך להגדיר את רשומות ה-DNS הבאות עבור הדומיין שלך:

#### רשומת MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### רשומות A {#a-records}

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

#### רשומת SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### רשומת DKIM {#dkim-record}

קבל את המפתח הציבורי של DKIM שלך:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

צור רשומת DNS של DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### רשומת DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### כניסה ראשונה {#first-login}

1. פתחו את דפדפן האינטרנט שלכם ונווטו אל `https://yourdomain.com`
2. הזינו את פרטי האימות הבסיסיים ששמרתם קודם לכן
3. השלמו את אשף ההגדרה הראשונית
4. צרו את חשבון הדוא"ל הראשון שלכם

## תצורת גיבוי {#backup-configuration}

### הגדר גיבוי תואם S3 {#set-up-s3-compatible-backup}

הגדרת גיבויים אוטומטיים לאחסון תואם S3:

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

### הגדרת גיבוי של עבודות Cron {#set-up-backup-cron-jobs}

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

## תצורת עדכון אוטומטי {#auto-update-configuration}

הגדר עדכונים אוטומטיים עבור התקנת העברת דוא"ל שלך:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## תחזוקה וניטור {#maintenance-and-monitoring}

### מיקומי יומן {#log-locations}

* **יומני Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **יומני מערכת**: `/var/log/syslog`
* **יומני גיבוי**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **יומני עדכון אוטומטי**: `/var/log/autoupdate.log`

### משימות תחזוקה שוטפות {#regular-maintenance-tasks}

1. **ניטור שטח דיסק**: `df -h`
2. **בדיקת סטטוס שירות**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **סקירת יומני רישום**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **עדכון חבילות מערכת**: `apt update && apt upgrade`
5. **חידוש אישורים**: אישורים מתחדשים אוטומטית, אך עוקבים אחר תפוגת התוקף

### חידוש תעודה {#certificate-renewal}

התעודות אמורות להתחדש אוטומטית, אך ניתן לחדש אותן ידנית במידת הצורך:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## פתרון בעיות {#troubleshooting}

### בעיות נפוצות {#common-issues}

#### 1. שירות Docker לא יופעל {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. יצירת אישור נכשלת {#2-certificate-generation-fails}

* ודא שפורטים 80 ו-443 נגישים
* ודא שרשומות DNS מצביעות לשרת שלך
* בדוק את הגדרות חומת האש

#### 3. בעיות במסירת דוא"ל {#3-email-delivery-issues}

* ודא שרשומות ה-MX נכונות
* בדוק את רשומות SPF, DKIM ו-DMARC
* ודא שפורט 25 אינו חסום על ידי ספק האירוח שלך

#### 4. ממשק האינטרנט אינו נגיש {#4-web-interface-not-accessible}

* בדוק את הגדרות חומת האש: `ufw status`
* אימות אישורי SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* בדוק את אישורי האימות הבסיסיים

### קבלת עזרה {#getting-help}

* **תיעוד**: <https://forwardemail.net/self-hosted>
* **בעיות ב-GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **תמיכה קהילתית**: בדקו את דיוני הפרויקט ב-GitHub

## שיטות עבודה מומלצות לאבטחה {#security-best-practices}

1. **עדכן את המערכת**: עדכן באופן קבוע את אובונטו והחבילות
2. **ניטור יומני רישום**: הגדר ניטור והתראות של יומני רישום
3. **גיבוי באופן קבוע**: בדוק נהלי גיבוי ושחזור
4. **השתמש בסיסמאות חזקות**: צור סיסמאות חזקות עבור כל החשבונות
5. **הפעלת Fail2Ban**: שקול להתקין את fail2ban לאבטחה נוספת
6. **ביקורות אבטחה תקופתיות**: בדוק את התצורה שלך באופן תקופתי

## מסקנה {#conclusion}

התקנת "Forward Email" שלך באחסון עצמי אמורה כעת להיות הושלמה ולפעול על אובונטו. זכור:

1. הגדר את רשומות ה-DNS שלך כראוי
2. בדוק שליחה וקבלה של דוא"ל
3. הגדר גיבויים קבועים
4. ניטור המערכת שלך באופן קבוע
5. שמור על ההתקנה שלך מעודכנת

לאפשרויות תצורה נוספות ותכונות מתקדמות, עיינו בתיעוד הרשמי של העברת דוא"ל בכתובת <https://forwardemail.net/self-hosted#configuration>.