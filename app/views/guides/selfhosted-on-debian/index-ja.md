# Debian向けメール転送セルフホスティングインストールガイド {#forward-email-self-hosting-installation-guide-for-debian}

## 目次 {#table-of-contents}

* [概要](#overview)
* [前提条件](#prerequisites)
* [システム要件](#system-requirements)
* [ステップバイステップのインストール](#step-by-step-installation)
  * [ステップ1: 初期システムセットアップ](#step-1-initial-system-setup)
  * [ステップ2: DNSリゾルバーを構成する](#step-2-configure-dns-resolvers)
  * [ステップ3: システム依存関係をインストールする](#step-3-install-system-dependencies)
  * [ステップ4: Snapdのインストールと設定](#step-4-install-and-configure-snapd)
  * [ステップ5: Snapパッケージをインストールする](#step-5-install-snap-packages)
  * [ステップ6: Dockerをインストールする](#step-6-install-docker)
  * [ステップ7: Dockerサービスを構成する](#step-7-configure-docker-service)
  * [ステップ8: UFWファイアウォールのインストールと構成](#step-8-install-and-configure-ufw-firewall)
  * [ステップ9: 転送メールリポジトリのクローンを作成する](#step-9-clone-forward-email-repository)
  * [ステップ10: 環境設定のセットアップ](#step-10-set-up-environment-configuration)
  * [ステップ11: ドメインを設定する](#step-11-configure-your-domain)
  * [ステップ12: SSL証明書を生成する](#step-12-generate-ssl-certificates)
  * [ステップ13: 暗号化キーを生成する](#step-13-generate-encryption-keys)
  * [ステップ14: 構成内のSSLパスを更新する](#step-14-update-ssl-paths-in-configuration)
  * [ステップ15: 基本認証を設定する](#step-15-set-up-basic-authentication)
  * [ステップ16: Docker Composeでデプロイする](#step-16-deploy-with-docker-compose)
  * [ステップ17: インストールの確認](#step-17-verify-installation)
* [インストール後の設定](#post-installation-configuration)
  * [DNSレコードの設定](#dns-records-setup)
  * [初回ログイン](#first-login)
* [バックアップ構成](#backup-configuration)
  * [S3互換バックアップの設定](#set-up-s3-compatible-backup)
  * [バックアップ Cron ジョブの設定](#set-up-backup-cron-jobs)
* [自動更新設定](#auto-update-configuration)
* [Debian固有の考慮事項](#debian-specific-considerations)
  * [パッケージ管理の違い](#package-management-differences)
  * [サービス管理](#service-management)
  * [ネットワーク構成](#network-configuration)
* [メンテナンスと監視](#maintenance-and-monitoring)
  * [ログの場所](#log-locations)
  * [定期的なメンテナンスタスク](#regular-maintenance-tasks)
  * [証明書の更新](#certificate-renewal)
* [トラブルシューティング](#troubleshooting)
  * [Debian固有の問題](#debian-specific-issues)
  * [よくある問題](#common-issues)
  * [ヘルプの取得](#getting-help)
* [セキュリティのベストプラクティス](#security-best-practices)
* [結論](#conclusion)

## 概要 {#overview}

このガイドでは、Forward Emailのセルフホスト型ソリューションをDebianシステムにインストールするための手順を段階的に説明します。このガイドは、特にDebian 11 (Bullseye) およびDebian 12 (Bookworm) 向けにカスタマイズされています。

## 前提条件 {#prerequisites}

インストールを開始する前に、次のものを用意してください。

* **Debian サーバー**: バージョン 11 (Bullseye) または 12 (Bookworm)
* **ルートアクセス**: ルートとしてコマンドを実行できる必要があります (sudo アクセス)
* **ドメイン名**: DNS 管理アクセスで管理しているドメイン
* **クリーンサーバー**: 新規インストールの Debian の使用を推奨
* **インターネット接続**: パッケージと Docker イメージのダウンロードに必要

## システム要件 {#system-requirements}

* **RAM**: 最低 2GB (本番環境では 4GB を推奨)
* **ストレージ**: 最低 20GB の空き容量 (本番環境では 50GB 以上を推奨)
* **CPU**: 最低 1 個の vCPU (本番環境では 2 個以上の vCPU を推奨)
* **ネットワーク**: 以下のポートにアクセスできるパブリック IP アドレス:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## ステップバイステップのインストール {#step-by-step-installation}

### ステップ1: 初期システムセットアップ {#step-1-initial-system-setup}

まず、システムが最新であることを確認し、ルート ユーザーに切り替えます。

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### ステップ2: DNSリゾルバーを構成する {#step-2-configure-dns-resolvers}

信頼性の高い証明書生成のために、Cloudflare の DNS サーバーを使用するようにシステムを設定します。

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

### ステップ3: システム依存関係をインストールする {#step-3-install-system-dependencies}

Debian で Forward Email に必要なパッケージをインストールします。

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

### ステップ4: Snapdのインストールと構成 {#step-4-install-and-configure-snapd}

Debian にはデフォルトで snapd が含まれていないため、インストールして設定する必要があります。

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

### ステップ5: Snapパッケージをインストールする {#step-5-install-snap-packages}

スナップ経由で AWS CLI と Certbot をインストールします。

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

### ステップ6: Dockerをインストールする {#step-6-install-docker}

Debian に Docker CE と Docker Compose をインストールします。

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

### ステップ7: Dockerサービスを構成する {#step-7-configure-docker-service}

Docker が自動的に起動し、実行されていることを確認します。

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Docker の起動に失敗した場合は、手動で起動してみてください。

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### ステップ8: UFWファイアウォールのインストールと構成 {#step-8-install-and-configure-ufw-firewall}

Debian の最小インストールには UFW が含まれていない可能性があるため、最初にインストールします。

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

### ステップ9: 転送メールリポジトリのクローン作成 {#step-9-clone-forward-email-repository}

転送メールのソースコードをダウンロードしてください:

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

### ステップ10: 環境設定のセットアップ {#step-10-set-up-environment-configuration}

環境設定を準備します。

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

### ステップ11: ドメインを構成する {#step-11-configure-your-domain}

ドメイン名を設定し、環境変数を更新します。

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

### ステップ12: SSL証明書を生成する {#step-12-generate-ssl-certificates}

#### オプション A: 手動 DNS チャレンジ (ほとんどのユーザーに推奨) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**重要**: プロンプトが表示されたら、DNSにTXTレコードを作成する必要があります。同じドメインに対して複数のチャレンジが表示される場合がありますが、**すべて作成してください**。2つ目のTXTレコードを追加する際は、最初のTXTレコードを削除しないでください。

#### オプションB: Cloudflare DNS (Cloudflare を使用している場合) {#option-b-cloudflare-dns-if-you-use-cloudflare}

ドメインが DNS に Cloudflare を使用している場合は、証明書の生成を自動化できます。

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

#### 証明書のコピー {#copy-certificates}

証明書が生成されたら、それをアプリケーション ディレクトリにコピーします。

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### ステップ13: 暗号化キーを生成する {#step-13-generate-encryption-keys}

安全な操作に必要なさまざまな暗号化キーを作成します。

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

### ステップ14: 構成内のSSLパスを更新する {#step-14-update-ssl-paths-in-configuration}

環境ファイルで SSL 証明書のパスを設定します。

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### ステップ15: 基本認証を設定する {#step-15-set-up-basic-authentication}

一時的な基本認証資格情報を作成します。

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

### ステップ16: Docker Compose でデプロイする {#step-16-deploy-with-docker-compose}

すべてのメール転送サービスを開始します。

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

### ステップ17: インストールの確認 {#step-17-verify-installation}

すべてのサービスが正しく実行されていることを確認します。

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

## インストール後の設定 {#post-installation-configuration}

### DNSレコードの設定 {#dns-records-setup}

ドメインに対して次の DNS レコードを構成する必要があります。

#### MXレコード {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Aレコード {#a-records}

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

#### SPFレコード {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIMレコード {#dkim-record}

DKIM公開鍵を取得します:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIM DNSレコードを作成します:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARCレコード {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### 初回ログイン {#first-login}

1. ウェブブラウザを開き、`https://yourdomain.com` に移動します。
2. 先ほど保存した基本認証情報を入力します。
3. 初期設定ウィザードを完了します。
4. 最初のメールアカウントを作成します。

## バックアップ構成 {#backup-configuration}

### S3 互換バックアップの設定 {#set-up-s3-compatible-backup}

S3 互換ストレージへの自動バックアップを構成します。

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

### バックアップ Cron ジョブを設定する {#set-up-backup-cron-jobs}

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

## 自動更新設定 {#auto-update-configuration}

Forward Email インストールの自動更新を設定します。

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

## Debian固有の考慮事項 {#debian-specific-considerations}

### パッケージ管理の違い {#package-management-differences}

* **Snapd**: Debianではデフォルトでインストールされません。手動でインストールする必要があります。
* **Docker**: Debian固有のリポジトリとGPGキーを使用します。
* **UFW**: Debianの最小インストールには含まれていない場合があります。
* **systemd**: Ubuntuとは動作が若干異なる場合があります。

### サービス管理 {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### ネットワーク構成 {#network-configuration}

Debian ではネットワーク インターフェイスの名前や構成が異なる場合があります。

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## メンテナンスと監視 {#maintenance-and-monitoring}

### ログの場所 {#log-locations}

* **Docker Compose ログ**: インストール状況に応じて適切な docker compose コマンドを使用してください。
* **システムログ**: `/var/log/syslog`
* **バックアップログ**: `/var/log/mongo-backup.log`、`/var/log/redis-backup.log`
* **自動更新ログ**: `/var/log/autoupdate.log`
* **Snapd ログ**: `journalctl -u snapd`

### 定期メンテナンスタスク {#regular-maintenance-tasks}

1. **ディスク容量を監視**: `df -h`
2. **サービスステータスを確認**: 適切な docker compose コマンドを使用する
3. **ログを確認する**: アプリケーションログとシステムログの両方を確認する
4. **システムパッケージを更新する**: `apt update && apt upgrade`
5. **snapd を監視する**: `snap list` および `snap refresh`

### 証明書の更新 {#certificate-renewal}

証明書は自動更新されますが、必要に応じて手動で更新することもできます。

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

## トラブルシューティング {#troubleshooting}

### Debian固有の問題 {#debian-specific-issues}

#### 1. Snapdが動作しない {#1-snapd-not-working}

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

#### 2. Docker Compose コマンドが見つかりません {#2-docker-compose-command-not-found}

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

#### 3. パッケージのインストールに関する問題 {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### よくある問題 {#common-issues}

#### 1. Dockerサービスが起動しない {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 証明書生成に失敗する {#2-certificate-generation-fails}

* ポート80と443にアクセスできることを確認してください
* DNSレコードがサーバーを指していることを確認してください
* `ufw status` でファイアウォール設定を確認してください

#### 3. メール配信の問題 {#3-email-delivery-issues}

* MXレコードが正しいことを確認する
* SPF、DKIM、DMARCレコードを確認する
* ホスティングプロバイダによってポート25がブロックされていないことを確認する

### ヘルプの取得 {#getting-help}

* **ドキュメント**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debianドキュメント**: <https://www.debian.org/doc/>

## セキュリティのベストプラクティス {#security-best-practices}

1. **システムを最新の状態に保つ**: Debianとパッケージを定期的に更新する
2. **ログを監視する**: ログ監視とアラートを設定する
3. **定期的にバックアップする**: バックアップと復元の手順をテストする
4. **強力なパスワードを使用する**: すべてのアカウントに強力なパスワードを生成する
5. **Fail2Banを有効にする**: セキュリティ強化のため、Fail2Banのインストールを検討する
6. **定期的なセキュリティ監査**: 設定を定期的に確認する
7. **Snapdを監視する**: `snap refresh` を使用してSnapパッケージを最新の状態に保つ

## 結論 {#conclusion}

Forward Emailのセルフホストインストールが完了し、Debian上で動作するようになりました。以下の点にご注意ください。

1. DNSレコードを適切に設定する
2. メールの送受信をテストする
3. 定期的なバックアップを設定する
4. システムを定期的に監視する
5. インストールを最新の状態に保つ
6. snapdとsnapパッケージを監視する

Ubuntuとの主な違いは、snapdのインストールとDockerリポジトリの設定です。これらを適切に設定すれば、Forward Emailアプリケーションはどちらのシステムでも同じように動作します。

追加の設定オプションと高度な機能については、<https://forwardemail.net/self-hosted#configuration>. にある公式のメール転送ドキュメントを参照してください。