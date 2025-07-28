# Debian용 이메일 셀프 호스팅 설치 가이드 {#forward-email-self-hosting-installation-guide-for-debian}

## 목차 {#table-of-contents}

* [개요](#overview)
* [필수 조건](#prerequisites)
* [시스템 요구 사항](#system-requirements)
* [단계별 설치](#step-by-step-installation)
  * [1단계: 초기 시스템 설정](#step-1-initial-system-setup)
  * [2단계: DNS 확인자 구성](#step-2-configure-dns-resolvers)
  * [3단계: 시스템 종속성 설치](#step-3-install-system-dependencies)
  * [4단계: Snapd 설치 및 구성](#step-4-install-and-configure-snapd)
  * [5단계: Snap 패키지 설치](#step-5-install-snap-packages)
  * [6단계: Docker 설치](#step-6-install-docker)
  * [7단계: Docker 서비스 구성](#step-7-configure-docker-service)
  * [8단계: UFW 방화벽 설치 및 구성](#step-8-install-and-configure-ufw-firewall)
  * [9단계: 전달 이메일 저장소 복제](#step-9-clone-forward-email-repository)
  * [10단계: 환경 구성 설정](#step-10-set-up-environment-configuration)
  * [11단계: 도메인 구성](#step-11-configure-your-domain)
  * [12단계: SSL 인증서 생성](#step-12-generate-ssl-certificates)
  * [13단계: 암호화 키 생성](#step-13-generate-encryption-keys)
  * [14단계: 구성에서 SSL 경로 업데이트](#step-14-update-ssl-paths-in-configuration)
  * [15단계: 기본 인증 설정](#step-15-set-up-basic-authentication)
  * [16단계: Docker Compose를 사용하여 배포](#step-16-deploy-with-docker-compose)
  * [17단계: 설치 확인](#step-17-verify-installation)
* [설치 후 구성](#post-installation-configuration)
  * [DNS 레코드 설정](#dns-records-setup)
  * [첫 번째 로그인](#first-login)
* [백업 구성](#backup-configuration)
  * [S3 호환 백업 설정](#set-up-s3-compatible-backup)
  * [백업 Cron 작업 설정](#set-up-backup-cron-jobs)
* [자동 업데이트 구성](#auto-update-configuration)
* [데비안 특정 고려 사항](#debian-specific-considerations)
  * [패키지 관리 차이점](#package-management-differences)
  * [서비스 관리](#service-management)
  * [네트워크 구성](#network-configuration)
* [유지 관리 및 모니터링](#maintenance-and-monitoring)
  * [로그 위치](#log-locations)
  * [정기 유지 관리 작업](#regular-maintenance-tasks)
  * [인증서 갱신](#certificate-renewal)
* [문제 해결](#troubleshooting)
  * [데비안 관련 문제](#debian-specific-issues)
  * [일반적인 문제](#common-issues)
  * [도움 받기](#getting-help)
* [보안 모범 사례](#security-best-practices)
* [결론](#conclusion)

## 개요 {#overview}

이 가이드는 데비안 시스템에 Forward Email의 셀프 호스팅 솔루션을 설치하는 단계별 지침을 제공합니다. 이 가이드는 데비안 11(Bullseye)과 데비안 12(Bookworm)에 맞춰 특별히 제작되었습니다.

## 필수 조건 {#prerequisites}

설치를 시작하기 전에 다음 사항을 확인하세요.

* **데비안 서버**: 버전 11(Bullseye) 또는 12(Bookworm)
* **루트 액세스**: 루트 권한으로 명령을 실행할 수 있어야 합니다(sudo 액세스).
* **도메인 이름**: DNS 관리 액세스 권한이 있는 도메인
* **클린 서버**: 새로 설치된 데비안을 사용하는 것이 좋습니다.
* **인터넷 연결**: 패키지 및 Docker 이미지 다운로드에 필요합니다.

## 시스템 요구 사항 {#system-requirements}

* **RAM**: 최소 2GB (운영 환경에서는 4GB 권장)
* **저장 공간**: 최소 20GB의 사용 가능 공간 (운영 환경에서는 50GB 이상 권장)
* **CPU**: 최소 1개의 vCPU (운영 환경에서는 2개 이상의 vCPU 권장)
* **네트워크**: 다음 포트에 접근 가능한 공용 IP 주소:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## 단계별 설치 {#step-by-step-installation}

### 1단계: 초기 시스템 설정 {#step-1-initial-system-setup}

먼저, 시스템이 최신 상태인지 확인하고 루트 사용자로 전환하세요.

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### 2단계: DNS 확인자 구성 {#step-2-configure-dns-resolvers}

안정적인 인증서 생성을 위해 Cloudflare의 DNS 서버를 사용하도록 시스템을 구성하세요.

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

### 3단계: 시스템 종속성 설치 {#step-3-install-system-dependencies}

Debian에 Forward Email에 필요한 패키지를 설치하세요:

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

### 4단계: Snapd 설치 및 구성 {#step-4-install-and-configure-snapd}

Debian에는 기본적으로 snapd가 포함되어 있지 않으므로, 다음과 같이 설치하고 구성해야 합니다.

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

### 5단계: Snap 패키지 설치 {#step-5-install-snap-packages}

스냅을 통해 AWS CLI와 Certbot을 설치하세요:

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

### 6단계: Docker 설치 {#step-6-install-docker}

Debian에 Docker CE와 Docker Compose를 설치하세요:

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

### 7단계: Docker 서비스 구성 {#step-7-configure-docker-service}

Docker가 자동으로 시작되고 실행 중인지 확인하세요.

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Docker가 시작되지 않으면 수동으로 시작해 보세요.

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### 8단계: UFW 방화벽 설치 및 구성 {#step-8-install-and-configure-ufw-firewall}

Debian 최소 설치에는 UFW가 포함되지 않을 수 있으므로 먼저 설치하세요.

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

### 9단계: 전달 이메일 저장소 복제 {#step-9-clone-forward-email-repository}

Forward Email 소스 코드를 다운로드하세요:

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

### 10단계: 환경 구성 설정 {#step-10-set-up-environment-configuration}

환경 구성을 준비하세요:

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

### 11단계: 도메인 구성 {#step-11-configure-your-domain}

도메인 이름을 설정하고 환경 변수를 업데이트하세요.

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

### 12단계: SSL 인증서 생성 {#step-12-generate-ssl-certificates}

#### 옵션 A: 수동 DNS 챌린지(대부분 사용자에게 권장) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**중요**: 메시지가 표시되면 DNS에 TXT 레코드를 생성해야 합니다. 동일한 도메인에 대해 여러 개의 챌린지가 표시될 수 있습니다. **모두 생성하세요**. 두 번째 TXT 레코드를 추가할 때 첫 번째 TXT 레코드를 삭제하지 마세요.

#### 옵션 B: Cloudflare DNS(Cloudflare를 사용하는 경우) {#option-b-cloudflare-dns-if-you-use-cloudflare}

도메인이 DNS에 Cloudflare를 사용하는 경우 인증서 생성을 자동화할 수 있습니다.

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

#### 인증서 복사 {#copy-certificates}

인증서 생성 후 이를 애플리케이션 디렉토리에 복사합니다.

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### 13단계: 암호화 키 생성 {#step-13-generate-encryption-keys}

안전한 운영에 필요한 다양한 암호화 키를 생성합니다.

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

### 14단계: 구성에서 SSL 경로 업데이트 {#step-14-update-ssl-paths-in-configuration}

환경 파일에서 SSL 인증서 경로를 구성합니다.

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### 15단계: 기본 인증 설정 {#step-15-set-up-basic-authentication}

임시 기본 인증 자격 증명을 만듭니다.

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

### 16단계: Docker Compose로 배포 {#step-16-deploy-with-docker-compose}

모든 이메일 전달 서비스를 시작합니다.

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

### 17단계: 설치 확인 {#step-17-verify-installation}

모든 서비스가 올바르게 실행되고 있는지 확인하세요.

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

## 설치 후 구성 {#post-installation-configuration}

### DNS 레코드 설정 {#dns-records-setup}

도메인에 대해 다음 DNS 레코드를 구성해야 합니다.

#### MX 레코드 {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A 레코드 {#a-records}

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

#### SPF 레코드 {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM 레코드 {#dkim-record}

DKIM 공개 키를 받으세요:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM DNS 레코드 생성:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC 레코드 {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### 첫 로그인 {#first-login}

1. 웹 브라우저를 열고 `https://yourdomain.com`으로 이동합니다.
2. 앞서 저장한 기본 인증 정보를 입력합니다.
3. 초기 설정 마법사를 완료합니다.
4. 첫 번째 이메일 계정을 생성합니다.

## 백업 구성 {#backup-configuration}

### S3 호환 백업 설정 {#set-up-s3-compatible-backup}

S3 호환 스토리지에 대한 자동 백업을 구성합니다.

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

### 백업 Cron 작업 설정 {#set-up-backup-cron-jobs}

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

## 자동 업데이트 구성 {#auto-update-configuration}

Forward Email 설치에 대한 자동 업데이트를 설정하세요.

```bash
# Create auto-update command (use appropriate docker compose command)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## 데비안 관련 고려 사항 {#debian-specific-considerations}

### 패키지 관리 차이점 {#package-management-differences}

* **Snapd**: Debian에 기본적으로 설치되지 않으며, 수동 설치가 필요합니다.
* **Docker**: Debian 전용 저장소 및 GPG 키를 사용합니다.
* **UFW**: Debian 최소 설치에는 포함되지 않을 수 있습니다.
* **systemd**: Ubuntu와 동작이 약간 다를 수 있습니다.

### 서비스 관리 {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### 네트워크 구성 {#network-configuration}

데비안은 네트워크 인터페이스 이름이나 구성이 다를 수 있습니다.

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## 유지 관리 및 모니터링 {#maintenance-and-monitoring}

### 로그 위치 {#log-locations}

* **Docker Compose 로그**: 설치 환경에 맞는 적절한 docker compose 명령을 사용하세요.
* **시스템 로그**: `/var/log/syslog`
* **백업 로그**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **자동 업데이트 로그**: `/var/log/autoupdate.log`
* **Snapd 로그**: `journalctl -u snapd`

### 정기 유지 관리 작업 {#regular-maintenance-tasks}

1. **디스크 공간 모니터링**: `df -h`
2. **서비스 상태 확인**: 적절한 docker compose 명령 사용
3. **로그 검토**: 애플리케이션 및 시스템 로그 모두 확인
4. **시스템 패키지 업데이트**: `apt update && apt upgrade`
5. **snapd 모니터링**: `snap list` 및 `snap refresh`

### 인증서 갱신 {#certificate-renewal}

인증서는 자동으로 갱신되지만 필요한 경우 수동으로 갱신할 수 있습니다.

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```

## 문제 해결 {#troubleshooting}

### 데비안 관련 문제 {#debian-specific-issues}

#### 1. Snapd가 작동하지 않습니다 {#1-snapd-not-working}

```bash
# Check snapd status
systemctl status snapd

# Restart snapd
systemctl restart snapd

# Check snap path
echo $PATH | grep snap

# Add snap to PATH if missing
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose 명령을 찾을 수 없습니다. {#2-docker-compose-command-not-found}

```bash
# Check which docker compose command is available
command -v docker-compose
command -v docker

# Use the appropriate command in scripts
if command -v docker-compose &> /dev/null; then
    echo "Using docker-compose"
else
    echo "Using docker compose"
fi
```

#### 3. 패키지 설치 문제 {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### 일반적인 문제 {#common-issues}

#### 1. Docker 서비스가 시작되지 않습니다. {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 인증서 생성 실패 {#2-certificate-generation-fails}

* 80번과 443번 포트에 접근할 수 있는지 확인하세요.
* DNS 레코드가 서버를 가리키는지 확인하세요.
* `ufw status`으로 방화벽 설정을 확인하세요.

#### 3. 이메일 전송 문제 {#3-email-delivery-issues}

* MX 레코드가 올바른지 확인하세요.
* SPF, DKIM, DMARC 레코드를 확인하세요.
* 호스팅 제공업체가 포트 25를 차단하지 않았는지 확인하세요.

### 도움말 받기 {#getting-help}

* **문서**: <https://forwardemail.net/self-hosted>
* **GitHub 이슈**: <https://github.com/forwardemail/forwardemail.net/issues>
* **데비안 문서**: <https://www.debian.org/doc/>

## 보안 모범 사례 {#security-best-practices}

1. **시스템 업데이트 유지**: Debian 및 패키지를 정기적으로 업데이트합니다.
2. **로그 모니터링**: 로그 모니터링 및 알림을 설정합니다.
3. **정기적으로 백업**: 백업 및 복원 절차를 테스트합니다.
4. **강력한 비밀번호 사용**: 모든 계정에 강력한 비밀번호를 생성합니다.
5. **Fail2Ban 활성화**: 보안 강화를 위해 fail2ban 설치를 고려합니다.
6. **정기적인 보안 감사**: 구성을 정기적으로 검토합니다.
7. **Snapd 모니터링**: `snap refresh`을 사용하여 snap 패키지를 최신 상태로 유지합니다.

## 결론 {#conclusion}

이제 Debian에서 Forward Email 셀프호스팅 설치가 완료되어 실행 중일 것입니다. 다음 사항을 기억하세요.

1. DNS 레코드를 올바르게 구성하세요.
2. 이메일 송수신 테스트
3. 정기 백업 설정
4. 시스템을 정기적으로 모니터링하세요.
5. 설치를 최신 상태로 유지하세요.
6. snapd 및 snap 패키지를 모니터링하세요.

Ubuntu와의 주요 차이점은 snapd 설치와 Docker 저장소 구성입니다. 이 두 가지가 제대로 설정되면 Forward Email 애플리케이션은 두 시스템에서 동일하게 작동합니다.

추가 구성 옵션 및 고급 기능에 대해서는 <https://forwardemail.net/self-hosted#configuration>.>의 공식 Forward Email 문서를 참조하세요.