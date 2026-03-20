# Forward Email セルフホスティング インストールガイド for Debian {#forward-email-self-hosting-installation-guide-for-debian}


## 目次 {#table-of-contents}

* [概要](#overview)
* [前提条件](#prerequisites)
* [システム要件](#system-requirements)
* [ステップバイステップインストール](#step-by-step-installation)
  * [ステップ 1: 初期システムセットアップ](#step-1-initial-system-setup)
  * [ステップ 2: DNSリゾルバの設定](#step-2-configure-dns-resolvers)
  * [ステップ 3: システム依存関係のインストール](#step-3-install-system-dependencies)
  * [ステップ 4: Snapdのインストールと設定](#step-4-install-and-configure-snapd)
  * [ステップ 5: Snapパッケージのインストール](#step-5-install-snap-packages)
  * [ステップ 6: Dockerのインストール](#step-6-install-docker)
  * [ステップ 7: Dockerサービスの設定](#step-7-configure-docker-service)
  * [ステップ 8: UFWファイアウォールのインストールと設定](#step-8-install-and-configure-ufw-firewall)
  * [ステップ 9: Forward Emailリポジトリのクローン](#step-9-clone-forward-email-repository)
  * [ステップ 10: 環境設定のセットアップ](#step-10-set-up-environment-configuration)
  * [ステップ 11: ドメインの設定](#step-11-configure-your-domain)
  * [ステップ 12: SSL証明書の生成](#step-12-generate-ssl-certificates)
  * [ステップ 13: 暗号化キーの生成](#step-13-generate-encryption-keys)
  * [ステップ 14: 設定内のSSLパスの更新](#step-14-update-ssl-paths-in-configuration)
  * [ステップ 15: ベーシック認証のセットアップ](#step-15-set-up-basic-authentication)
  * [ステップ 16: Docker Composeでのデプロイ](#step-16-deploy-with-docker-compose)
  * [ステップ 17: インストールの検証](#step-17-verify-installation)
* [インストール後の設定](#post-installation-configuration)
  * [DNSレコードの設定](#dns-records-setup)
  * [初回ログイン](#first-login)
* [バックアップ設定](#backup-configuration)
  * [S3互換バックアップのセットアップ](#set-up-s3-compatible-backup)
  * [バックアップ用Cronジョブの設定](#set-up-backup-cron-jobs)
* [自動更新設定](#auto-update-configuration)
* [Debian固有の考慮事項](#debian-specific-considerations)
  * [パッケージ管理の違い](#package-management-differences)
  * [サービス管理](#service-management)
  * [ネットワーク設定](#network-configuration)
* [メンテナンスと監視](#maintenance-and-monitoring)
  * [ログの場所](#log-locations)
  * [定期メンテナンス作業](#regular-maintenance-tasks)
  * [証明書の更新](#certificate-renewal)
* [トラブルシューティング](#troubleshooting)
  * [Debian固有の問題](#debian-specific-issues)
  * [一般的な問題](#common-issues)
  * [サポートの受け方](#getting-help)
* [セキュリティのベストプラクティス](#security-best-practices)
* [結論](#conclusion)


## 概要 {#overview}

本ガイドは、Debianシステム上でForward Emailのセルフホスティングソリューションをインストールするためのステップバイステップの手順を提供します。本ガイドは特にDebian 11（Bullseye）およびDebian 12（Bookworm）向けに調整されています。


## 前提条件 {#prerequisites}

インストールを開始する前に、以下を確認してください：

* **Debianサーバー**：バージョン11（Bullseye）または12（Bookworm）
* **rootアクセス**：root権限（sudoアクセス）でコマンドを実行できること
* **ドメイン名**：DNS管理アクセス権のある管理ドメイン
* **クリーンサーバー**：新規のDebianインストールを推奨
* **インターネット接続**：パッケージやDockerイメージのダウンロードに必要


## システム要件 {#system-requirements}

* **RAM**：最低2GB（本番環境では4GB推奨）
* **ストレージ**：最低20GBの空き容量（本番環境では50GB以上推奨）
* **CPU**：最低1 vCPU（本番環境では2以上推奨）
* **ネットワーク**：以下のポートがアクセス可能なパブリックIPアドレス
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## ステップバイステップインストール {#step-by-step-installation}

### ステップ 1: 初期システムセットアップ {#step-1-initial-system-setup}

まず、システムを最新の状態にし、rootユーザーに切り替えます：

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```
### Step 2: Configure DNS Resolvers {#step-2-configure-dns-resolvers}

信頼性の高い証明書生成のために、システムをCloudflareのDNSサーバーを使用するように設定します：

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

DebianでForward Emailに必要なパッケージをインストールします：

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

Debianにはデフォルトでsnapdが含まれていないため、インストールして設定する必要があります：

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

snapを使ってAWS CLIとCertbotをインストールします：

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

DebianにDocker CEとDocker Composeをインストールします：

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

Dockerが自動起動し、稼働していることを確認します：

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Dockerの起動に失敗した場合は、手動で起動を試みてください：

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Install and Configure UFW Firewall {#step-8-install-and-configure-ufw-firewall}

Debianの最小インストールにはUFWが含まれていない場合があるため、まずインストールします：

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
### Step 9: Forward Emailリポジトリをクローンする {#step-9-clone-forward-email-repository}

Forward Emailのソースコードをダウンロードします：

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

### Step 10: 環境設定を準備する {#step-10-set-up-environment-configuration}

環境設定を準備します：

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

### Step 11: ドメインを設定する {#step-11-configure-your-domain}

ドメイン名を設定し、環境変数を更新します：

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

### Step 12: SSL証明書を生成する {#step-12-generate-ssl-certificates}

#### オプションA: 手動DNSチャレンジ（ほとんどのユーザーに推奨） {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**重要**：プロンプトが表示されたら、DNSにTXTレコードを作成する必要があります。同じドメインに対して複数のチャレンジが表示される場合がありますが、**すべて作成してください**。2つ目のTXTレコードを追加するときに最初のTXTレコードを削除しないでください。

#### オプションB: Cloudflare DNS（Cloudflareを使用している場合） {#option-b-cloudflare-dns-if-you-use-cloudflare}

ドメインがCloudflareのDNSを使用している場合、証明書の生成を自動化できます：

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

#### 証明書をコピーする {#copy-certificates}

証明書生成後、アプリケーションディレクトリにコピーします：

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Step 13: 暗号化キーを生成する {#step-13-generate-encryption-keys}

安全な運用に必要な各種暗号化キーを作成します：

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

環境ファイルでSSL証明書のパスを設定します：

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Set Up Basic Authentication {#step-15-set-up-basic-authentication}

一時的なベーシック認証の資格情報を作成します：

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

Forward Emailのすべてのサービスを起動します：

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

すべてのサービスが正しく動作しているか確認します：

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

ドメインのために以下のDNSレコードを設定する必要があります：

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

DKIM公開鍵を取得します：

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIMのDNSレコードを作成します：

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC Record {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### First Login {#first-login}

1. ウェブブラウザを開き、`https://yourdomain.com` にアクセスします
2. 先ほど保存したベーシック認証の資格情報を入力します
3. 初期セットアップウィザードを完了します
4. 最初のメールアカウントを作成します


## Backup Configuration {#backup-configuration}

### Set Up S3-Compatible Backup {#set-up-s3-compatible-backup}

S3互換ストレージへの自動バックアップを設定します：

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
### バックアップCronジョブの設定 {#set-up-backup-cron-jobs}

```bash
# バックアップスクリプトを実行可能にする
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDBバックアップのcronジョブを追加（毎日深夜に実行）
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redisバックアップのcronジョブを追加（毎日深夜に実行）
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# cronジョブが追加されたことを確認
crontab -l
```


## 自動更新の設定 {#auto-update-configuration}

Forward Emailのインストールに対して自動更新を設定します：

```bash
# 自動更新コマンドを作成（適切なdocker composeコマンドを使用）
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# 自動更新のcronジョブを追加（毎日午前1時に実行）
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# cronジョブが追加されたことを確認
crontab -l
```


## Debian固有の考慮事項 {#debian-specific-considerations}

### パッケージ管理の違い {#package-management-differences}

* **Snapd**: Debianではデフォルトでインストールされておらず、手動でのインストールが必要
* **Docker**: Debian固有のリポジトリとGPGキーを使用
* **UFW**: 最小限のDebianインストールには含まれていない場合がある
* **systemd**: Ubuntuとは動作が若干異なる場合がある

### サービス管理 {#service-management}

```bash
# サービスの状態を確認（Debian固有のコマンド）
systemctl status snapd
systemctl status docker
systemctl status ufw

# 必要に応じてサービスを再起動
systemctl restart snapd
systemctl restart docker
```

### ネットワーク設定 {#network-configuration}

Debianではネットワークインターフェース名や設定が異なる場合があります：

```bash
# ネットワークインターフェースを確認
ip addr show

# ルーティングを確認
ip route show

# DNS解決を確認
nslookup google.com
```


## メンテナンスと監視 {#maintenance-and-monitoring}

### ログの場所 {#log-locations}

* **Docker Composeログ**: インストールに応じた適切なdocker composeコマンドを使用
* **システムログ**: `/var/log/syslog`
* **バックアップログ**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **自動更新ログ**: `/var/log/autoupdate.log`
* **Snapdログ**: `journalctl -u snapd`

### 定期メンテナンス作業 {#regular-maintenance-tasks}

1. **ディスク容量の監視**: `df -h`
2. **サービス状態の確認**: 適切なdocker composeコマンドを使用
3. **ログの確認**: アプリケーションとシステムの両方のログをチェック
4. **システムパッケージの更新**: `apt update && apt upgrade`
5. **snapdの監視**: `snap list` と `snap refresh`

### 証明書の更新 {#certificate-renewal}

証明書は自動更新されますが、必要に応じて手動で更新できます：

```bash
# 手動で証明書を更新
certbot renew

# 更新された証明書をコピー
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 新しい証明書を使用するためにサービスを再起動
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## トラブルシューティング {#troubleshooting}

### Debian固有の問題 {#debian-specific-issues}

#### 1. Snapdが動作しない {#1-snapd-not-working}

```bash
# snapdの状態を確認
systemctl status snapd

# snapdを再起動
systemctl restart snapd

# snapのパスを確認
echo $PATH | grep snap

# PATHにsnapがなければ追加
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Composeコマンドが見つからない {#2-docker-compose-command-not-found}

```bash
# 利用可能なdocker composeコマンドを確認
command -v docker-compose
command -v docker

# スクリプト内で適切なコマンドを使用
if command -v docker-compose &> /dev/null; then
    echo "docker-composeを使用しています"
else
    echo "docker composeを使用しています"
fi
```
#### 3. パッケージインストールの問題 {#3-package-installation-issues}

```bash
# パッケージキャッシュを更新
apt update

# 壊れたパッケージを修復
apt --fix-broken install

# 保留中のパッケージを確認
apt-mark showhold
```

### よくある問題 {#common-issues}

#### 1. Dockerサービスが起動しない {#1-docker-service-wont-start}

```bash
# Dockerの状態を確認
systemctl status docker

# Dockerのログを確認
journalctl -u docker

# 代替起動を試す
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 証明書の生成に失敗する {#2-certificate-generation-fails}

* ポート80と443がアクセス可能であることを確認
* DNSレコードがサーバーを指していることを確認
* `ufw status`でファイアウォール設定を確認

#### 3. メール配信の問題 {#3-email-delivery-issues}

* MXレコードが正しいことを確認
* SPF、DKIM、DMARCレコードを確認
* ホスティングプロバイダーがポート25をブロックしていないことを確認

### ヘルプを得る {#getting-help}

* **ドキュメント**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debianドキュメント**: <https://www.debian.org/doc/>


## セキュリティのベストプラクティス {#security-best-practices}

1. **システムを最新に保つ**: Debianとパッケージを定期的に更新する
2. **ログを監視する**: ログ監視とアラート設定を行う
3. **定期的にバックアップを取る**: バックアップと復元手順をテストする
4. **強力なパスワードを使う**: すべてのアカウントに強力なパスワードを生成する
5. **Fail2Banを有効にする**: 追加のセキュリティとしてfail2banの導入を検討する
6. **定期的なセキュリティ監査**: 設定を定期的に見直す
7. **Snapdを監視する**: `snap refresh`でsnapパッケージを最新に保つ


## 結論 {#conclusion}

Forward EmailのセルフホストインストールはDebian上で完了し、稼働しているはずです。以下を忘れずに行ってください：

1. DNSレコードを正しく設定する
2. メールの送受信をテストする
3. 定期的なバックアップを設定する
4. システムを定期的に監視する
5. インストールを最新の状態に保つ
6. snapdとsnapパッケージを監視する

Ubuntuとの主な違いはsnapdのインストールとDockerリポジトリの設定です。これらが正しく設定されれば、Forward Emailアプリケーションは両システムで同様に動作します。

追加の設定オプションや高度な機能については、公式Forward Emailドキュメント <https://forwardemail.net/self-hosted#configuration> を参照してください。
