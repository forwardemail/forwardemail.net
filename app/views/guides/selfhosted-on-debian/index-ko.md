# Debian용 Forward Email 셀프 호스팅 설치 가이드 {#forward-email-self-hosting-installation-guide-for-debian}


## 목차 {#table-of-contents}

* [개요](#overview)
* [사전 준비 사항](#prerequisites)
* [시스템 요구 사항](#system-requirements)
* [단계별 설치](#step-by-step-installation)
  * [1단계: 초기 시스템 설정](#step-1-initial-system-setup)
  * [2단계: DNS 리졸버 구성](#step-2-configure-dns-resolvers)
  * [3단계: 시스템 종속성 설치](#step-3-install-system-dependencies)
  * [4단계: Snapd 설치 및 구성](#step-4-install-and-configure-snapd)
  * [5단계: Snap 패키지 설치](#step-5-install-snap-packages)
  * [6단계: Docker 설치](#step-6-install-docker)
  * [7단계: Docker 서비스 구성](#step-7-configure-docker-service)
  * [8단계: UFW 방화벽 설치 및 구성](#step-8-install-and-configure-ufw-firewall)
  * [9단계: Forward Email 저장소 복제](#step-9-clone-forward-email-repository)
  * [10단계: 환경 구성 설정](#step-10-set-up-environment-configuration)
  * [11단계: 도메인 구성](#step-11-configure-your-domain)
  * [12단계: SSL 인증서 생성](#step-12-generate-ssl-certificates)
  * [13단계: 암호화 키 생성](#step-13-generate-encryption-keys)
  * [14단계: 구성에서 SSL 경로 업데이트](#step-14-update-ssl-paths-in-configuration)
  * [15단계: 기본 인증 설정](#step-15-set-up-basic-authentication)
  * [16단계: Docker Compose로 배포](#step-16-deploy-with-docker-compose)
  * [17단계: 설치 확인](#step-17-verify-installation)
* [설치 후 구성](#post-installation-configuration)
  * [DNS 레코드 설정](#dns-records-setup)
  * [첫 로그인](#first-login)
* [백업 구성](#backup-configuration)
  * [S3 호환 백업 설정](#set-up-s3-compatible-backup)
  * [백업 크론 작업 설정](#set-up-backup-cron-jobs)
* [자동 업데이트 구성](#auto-update-configuration)
* [Debian 전용 고려 사항](#debian-specific-considerations)
  * [패키지 관리 차이점](#package-management-differences)
  * [서비스 관리](#service-management)
  * [네트워크 구성](#network-configuration)
* [유지보수 및 모니터링](#maintenance-and-monitoring)
  * [로그 위치](#log-locations)
  * [정기 유지보수 작업](#regular-maintenance-tasks)
  * [인증서 갱신](#certificate-renewal)
* [문제 해결](#troubleshooting)
  * [Debian 전용 문제](#debian-specific-issues)
  * [일반 문제](#common-issues)
  * [도움 받기](#getting-help)
* [보안 모범 사례](#security-best-practices)
* [결론](#conclusion)


## 개요 {#overview}

이 가이드는 Debian 시스템에서 Forward Email의 셀프 호스팅 솔루션을 설치하는 단계별 지침을 제공합니다. 이 가이드는 특히 Debian 11 (Bullseye) 및 Debian 12 (Bookworm)에 맞춰져 있습니다.


## 사전 준비 사항 {#prerequisites}

설치를 시작하기 전에 다음을 확인하세요:

* **Debian 서버**: 버전 11 (Bullseye) 또는 12 (Bookworm)
* **루트 권한**: 루트 권한으로 명령을 실행할 수 있어야 합니다 (sudo 권한)
* **도메인 이름**: DNS 관리 권한이 있는 도메인
* **깨끗한 서버**: 새 Debian 설치를 사용하는 것이 권장됩니다
* **인터넷 연결**: 패키지 및 Docker 이미지를 다운로드하는 데 필요


## 시스템 요구 사항 {#system-requirements}

* **RAM**: 최소 2GB (프로덕션용 4GB 권장)
* **저장 공간**: 최소 20GB 사용 가능 공간 (프로덕션용 50GB 이상 권장)
* **CPU**: 최소 1 vCPU (프로덕션용 2개 이상 권장)
* **네트워크**: 다음 포트가 접근 가능한 공인 IP 주소:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## 단계별 설치 {#step-by-step-installation}

### 1단계: 초기 시스템 설정 {#step-1-initial-system-setup}

먼저 시스템이 최신 상태인지 확인하고 루트 사용자로 전환하세요:

```bash
# 시스템 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# 루트 사용자로 전환 (설치에 필요)
sudo su -
```
### Step 2: DNS 리졸버 구성 {#step-2-configure-dns-resolvers}

신뢰할 수 있는 인증서 생성을 위해 시스템이 Cloudflare의 DNS 서버를 사용하도록 구성하세요:

```bash
# systemd-resolved가 실행 중이면 중지 및 비활성화
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Cloudflare DNS 리졸버 구성
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

### Step 3: 시스템 의존성 설치 {#step-3-install-system-dependencies}

Debian에서 Forward Email에 필요한 패키지를 설치하세요:

```bash
# 패키지 목록 업데이트
apt-get update -y

# 기본 의존성 설치 (Debian 전용 패키지 목록)
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

### Step 4: Snapd 설치 및 구성 {#step-4-install-and-configure-snapd}

Debian은 기본적으로 snapd가 포함되어 있지 않으므로 설치 및 구성해야 합니다:

```bash
# snapd 설치
apt-get install -y snapd

# snapd 서비스 활성화 및 시작
systemctl enable snapd
systemctl start snapd

# snap이 제대로 작동하도록 심볼릭 링크 생성
ln -sf /var/lib/snapd/snap /snap

# snapd 준비 대기
sleep 10

# snapd 작동 확인
snap version
```

### Step 5: Snap 패키지 설치 {#step-5-install-snap-packages}

snap을 통해 AWS CLI와 Certbot을 설치하세요:

```bash
# AWS CLI 설치
snap install aws-cli --classic

# Certbot 및 DNS 플러그인 설치
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# 설치 확인
aws --version
certbot --version
```

### Step 6: Docker 설치 {#step-6-install-docker}

Debian에서 Docker CE와 Docker Compose를 설치하세요:

```bash
# Docker 공식 GPG 키 추가 (Debian 전용)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Docker 저장소 추가 (Debian 전용)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# 패키지 인덱스 업데이트 및 Docker 설치
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 플러그인이 작동하지 않을 경우 대비해 독립형 docker-compose 설치
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Docker 설치 확인
docker --version
docker compose version || docker-compose --version
```

### Step 7: Docker 서비스 구성 {#step-7-configure-docker-service}

Docker가 자동으로 시작되고 실행 중인지 확인하세요:

```bash
# Docker 서비스 활성화 및 시작
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Docker 실행 확인
docker info
```

Docker가 시작하지 않으면 수동으로 시작해 보세요:

```bash
# systemctl 실패 시 대체 시작 방법
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: UFW 방화벽 설치 및 구성 {#step-8-install-and-configure-ufw-firewall}

Debian 최소 설치에는 UFW가 포함되어 있지 않을 수 있으므로 먼저 설치하세요:

```bash
# UFW가 없으면 설치
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# 기본 정책 설정
ufw default deny incoming
ufw default allow outgoing

# SSH 허용 (중요 - 자신을 잠그지 마세요!)
ufw allow 22/tcp

# 이메일 관련 포트 허용
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (Let's Encrypt용)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (대체 포트)
ufw allow 2995/tcp  # POP3 (대체 포트)
ufw allow 3456/tcp  # 사용자 지정 서비스 포트
ufw allow 4000/tcp  # 사용자 지정 서비스 포트
ufw allow 5000/tcp  # 사용자 지정 서비스 포트

# 로컬 데이터베이스 연결 허용
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# 방화벽 활성화
echo "y" | ufw enable

# 방화벽 상태 확인
ufw status numbered
```
### Step 9: Forward Email 저장소 복제 {#step-9-clone-forward-email-repository}

Forward Email 소스 코드를 다운로드하세요:

```bash
# 변수 설정
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# 저장소 복제
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# 복제 성공 여부 확인
ls -la
```

### Step 10: 환경 구성 설정 {#step-10-set-up-environment-configuration}

환경 구성을 준비하세요:

```bash
# 디렉터리 변수 설정
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# 기본 환경 파일 복사
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# SSL 디렉터리 생성
mkdir -p "$SELF_HOST_DIR/ssl"

# 데이터베이스 디렉터리 생성
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 11: 도메인 구성 {#step-11-configure-your-domain}

도메인 이름을 설정하고 환경 변수를 업데이트하세요:

```bash
# 'yourdomain.com'을 실제 도메인으로 교체하세요
DOMAIN="yourdomain.com"

# 환경 파일 업데이트 함수
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# 도메인 관련 환경 변수 업데이트
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

### Step 12: SSL 인증서 생성 {#step-12-generate-ssl-certificates}

#### 옵션 A: 수동 DNS 챌린지 (대부분 사용자에게 권장) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# 수동 DNS 챌린지를 사용하여 인증서 생성
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**중요**: 요청 시 DNS에 TXT 레코드를 생성해야 합니다. 동일 도메인에 대해 여러 챌린지가 표시될 수 있으니 - **모두 생성하세요**. 두 번째 레코드를 추가할 때 첫 번째 TXT 레코드를 삭제하지 마세요.

#### 옵션 B: Cloudflare DNS (Cloudflare를 사용하는 경우) {#option-b-cloudflare-dns-if-you-use-cloudflare}

도메인이 Cloudflare DNS를 사용하는 경우 인증서 생성을 자동화할 수 있습니다:

```bash
# Cloudflare 자격 증명 파일 생성
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# 적절한 권한 설정
chmod 600 /root/.cloudflare.ini

# 인증서 자동 생성
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

인증서 생성 후 애플리케이션 디렉터리로 복사하세요:

```bash
# 인증서를 애플리케이션 SSL 디렉터리로 복사
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 인증서 복사 확인
ls -la "$SELF_HOST_DIR/ssl/"
```

### Step 13: 암호화 키 생성 {#step-13-generate-encryption-keys}

안전한 운영을 위해 필요한 다양한 암호화 키를 생성하세요:

```bash
# 헬퍼 암호화 키 생성
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# 이메일 전달용 SRS 비밀키 생성
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# TXT 암호화 키 생성
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# 이메일 서명을 위한 DKIM 개인 키 생성
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# 웹훅 서명 키 생성
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# SMTP 전송 비밀번호 설정
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ 모든 암호화 키가 성공적으로 생성되었습니다"
```
### Step 14: Update SSL Paths in Configuration {#step-14-update-ssl-paths-in-configuration}

환경 파일에서 SSL 인증서 경로를 구성합니다:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Set Up Basic Authentication {#step-15-set-up-basic-authentication}

임시 기본 인증 자격 증명을 생성합니다:

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

### Step 16: Deploy with Docker Compose {#step-16-deploy-with-docker-compose}

모든 Forward Email 서비스를 시작합니다:

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

모든 서비스가 정상적으로 실행 중인지 확인합니다:

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

도메인에 대해 다음 DNS 레코드를 구성해야 합니다:

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

DKIM 공개 키를 가져옵니다:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM DNS 레코드를 생성합니다:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC Record {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### First Login {#first-login}

1. 웹 브라우저를 열고 `https://yourdomain.com` 으로 이동합니다
2. 이전에 저장한 기본 인증 자격 증명을 입력합니다
3. 초기 설정 마법사를 완료합니다
4. 첫 번째 이메일 계정을 생성합니다


## Backup Configuration {#backup-configuration}

### Set Up S3-Compatible Backup {#set-up-s3-compatible-backup}

S3 호환 스토리지에 자동 백업을 구성합니다:

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
### 백업 크론 작업 설정 {#set-up-backup-cron-jobs}

```bash
# 백업 스크립트 실행 권한 부여
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDB 백업 크론 작업 추가 (매일 자정 실행)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redis 백업 크론 작업 추가 (매일 자정 실행)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# 크론 작업이 추가되었는지 확인
crontab -l
```


## 자동 업데이트 구성 {#auto-update-configuration}

Forward Email 설치에 대한 자동 업데이트를 설정하세요:

```bash
# 자동 업데이트 명령 생성 (적절한 docker compose 명령 사용)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# 자동 업데이트 크론 작업 추가 (매일 오전 1시 실행)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# 크론 작업이 추가되었는지 확인
crontab -l
```


## Debian 전용 고려사항 {#debian-specific-considerations}

### 패키지 관리 차이점 {#package-management-differences}

* **Snapd**: Debian에는 기본 설치되어 있지 않으며 수동 설치 필요
* **Docker**: Debian 전용 저장소 및 GPG 키 사용
* **UFW**: 최소 Debian 설치에는 포함되지 않을 수 있음
* **systemd**: Ubuntu와 약간 다를 수 있음

### 서비스 관리 {#service-management}

```bash
# 서비스 상태 확인 (Debian 전용 명령)
systemctl status snapd
systemctl status docker
systemctl status ufw

# 필요 시 서비스 재시작
systemctl restart snapd
systemctl restart docker
```

### 네트워크 구성 {#network-configuration}

Debian은 네트워크 인터페이스 이름이나 구성이 다를 수 있습니다:

```bash
# 네트워크 인터페이스 확인
ip addr show

# 라우팅 확인
ip route show

# DNS 해석 확인
nslookup google.com
```


## 유지보수 및 모니터링 {#maintenance-and-monitoring}

### 로그 위치 {#log-locations}

* **Docker Compose 로그**: 설치에 따라 적절한 docker compose 명령 사용
* **시스템 로그**: `/var/log/syslog`
* **백업 로그**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **자동 업데이트 로그**: `/var/log/autoupdate.log`
* **Snapd 로그**: `journalctl -u snapd`

### 정기 유지보수 작업 {#regular-maintenance-tasks}

1. **디스크 공간 모니터링**: `df -h`
2. **서비스 상태 확인**: 적절한 docker compose 명령 사용
3. **로그 검토**: 애플리케이션 및 시스템 로그 모두 확인
4. **시스템 패키지 업데이트**: `apt update && apt upgrade`
5. **snapd 모니터링**: `snap list` 및 `snap refresh`

### 인증서 갱신 {#certificate-renewal}

인증서는 자동 갱신되지만 필요 시 수동 갱신할 수 있습니다:

```bash
# 수동 인증서 갱신
certbot renew

# 갱신된 인증서 복사
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 새 인증서 적용을 위해 서비스 재시작
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## 문제 해결 {#troubleshooting}

### Debian 전용 문제 {#debian-specific-issues}

#### 1. Snapd 작동 안 함 {#1-snapd-not-working}

```bash
# snapd 상태 확인
systemctl status snapd

# snapd 재시작
systemctl restart snapd

# snap 경로 확인
echo $PATH | grep snap

# 경로에 snap이 없으면 추가
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose 명령어를 찾을 수 없음 {#2-docker-compose-command-not-found}

```bash
# 사용 가능한 docker compose 명령어 확인
command -v docker-compose
command -v docker

# 스크립트에서 적절한 명령어 사용
if command -v docker-compose &> /dev/null; then
    echo "docker-compose 사용 중"
else
    echo "docker compose 사용 중"
fi
```
#### 3. 패키지 설치 문제 {#3-package-installation-issues}

```bash
# 패키지 캐시 업데이트
apt update

# 손상된 패키지 수정
apt --fix-broken install

# 보류된 패키지 확인
apt-mark showhold
```

### 일반적인 문제 {#common-issues}

#### 1. Docker 서비스가 시작되지 않음 {#1-docker-service-wont-start}

```bash
# Docker 상태 확인
systemctl status docker

# Docker 로그 확인
journalctl -u docker

# 대체 시작 시도
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 인증서 생성 실패 {#2-certificate-generation-fails}

* 포트 80과 443이 접근 가능한지 확인하세요
* DNS 레코드가 서버를 가리키는지 검증하세요
* `ufw status`로 방화벽 설정을 확인하세요

#### 3. 이메일 전달 문제 {#3-email-delivery-issues}

* MX 레코드가 올바른지 확인하세요
* SPF, DKIM, DMARC 레코드를 점검하세요
* 호스팅 제공업체가 포트 25를 차단하지 않는지 확인하세요

### 도움 받기 {#getting-help}

* **문서**: <https://forwardemail.net/self-hosted>
* **GitHub 이슈**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian 문서**: <https://www.debian.org/doc/>


## 보안 모범 사례 {#security-best-practices}

1. **시스템 업데이트 유지**: Debian과 패키지를 정기적으로 업데이트하세요
2. **로그 모니터링**: 로그 모니터링 및 알림 설정을 하세요
3. **정기 백업**: 백업 및 복원 절차를 테스트하세요
4. **강력한 비밀번호 사용**: 모든 계정에 강력한 비밀번호를 생성하세요
5. **Fail2Ban 활성화**: 추가 보안을 위해 fail2ban 설치를 고려하세요
6. **정기 보안 감사**: 주기적으로 구성 설정을 검토하세요
7. **Snapd 모니터링**: `snap refresh`로 snap 패키지를 최신 상태로 유지하세요


## 결론 {#conclusion}

Forward Email 셀프 호스팅 설치가 이제 Debian에서 완료되어 실행 중이어야 합니다. 다음 사항을 기억하세요:

1. DNS 레코드를 올바르게 구성하세요
2. 이메일 송수신을 테스트하세요
3. 정기 백업을 설정하세요
4. 시스템을 정기적으로 모니터링하세요
5. 설치를 최신 상태로 유지하세요
6. snapd 및 snap 패키지를 모니터링하세요

Ubuntu와의 주요 차이점은 snapd 설치와 Docker 저장소 구성입니다. 이들이 제대로 설정되면 Forward Email 애플리케이션은 두 시스템에서 동일하게 작동합니다.

추가 구성 옵션과 고급 기능은 공식 Forward Email 문서 <https://forwardemail.net/self-hosted#configuration>를 참조하세요.
