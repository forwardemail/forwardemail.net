# Forward Email セルフホスティング インストールガイド for Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## 目次 {#table-of-contents}

* [概要](#overview)
* [前提条件](#prerequisites)
* [システム要件](#system-requirements)
* [ステップバイステップインストール](#step-by-step-installation)
  * [ステップ 1: 初期システムセットアップ](#step-1-initial-system-setup)
  * [ステップ 2: DNSリゾルバの設定](#step-2-configure-dns-resolvers)
  * [ステップ 3: システム依存関係のインストール](#step-3-install-system-dependencies)
  * [ステップ 4: Snapパッケージのインストール](#step-4-install-snap-packages)
  * [ステップ 5: Dockerのインストール](#step-5-install-docker)
  * [ステップ 6: Dockerサービスの設定](#step-6-configure-docker-service)
  * [ステップ 7: ファイアウォールの設定](#step-7-configure-firewall)
  * [ステップ 8: Forward Emailリポジトリのクローン](#step-8-clone-forward-email-repository)
  * [ステップ 9: 環境設定のセットアップ](#step-9-set-up-environment-configuration)
  * [ステップ 10: ドメインの設定](#step-10-configure-your-domain)
  * [ステップ 11: SSL証明書の生成](#step-11-generate-ssl-certificates)
  * [ステップ 12: 暗号化キーの生成](#step-12-generate-encryption-keys)
  * [ステップ 13: 設定内のSSLパスの更新](#step-13-update-ssl-paths-in-configuration)
  * [ステップ 14: ベーシック認証の設定](#step-14-set-up-basic-authentication)
  * [ステップ 15: Docker Composeでのデプロイ](#step-15-deploy-with-docker-compose)
  * [ステップ 16: インストールの検証](#step-16-verify-installation)
* [インストール後の設定](#post-installation-configuration)
  * [DNSレコードの設定](#dns-records-setup)
  * [初回ログイン](#first-login)
* [バックアップ設定](#backup-configuration)
  * [S3互換バックアップのセットアップ](#set-up-s3-compatible-backup)
  * [バックアップ用Cronジョブの設定](#set-up-backup-cron-jobs)
* [自動更新設定](#auto-update-configuration)
* [メンテナンスと監視](#maintenance-and-monitoring)
  * [ログの場所](#log-locations)
  * [定期メンテナンス作業](#regular-maintenance-tasks)
  * [証明書の更新](#certificate-renewal)
* [トラブルシューティング](#troubleshooting)
  * [よくある問題](#common-issues)
  * [サポートの受け方](#getting-help)
* [セキュリティベストプラクティス](#security-best-practices)
* [まとめ](#conclusion)


## 概要 {#overview}

本ガイドは、Ubuntuシステム上でForward Emailのセルフホストソリューションをインストールするためのステップバイステップの手順を提供します。本ガイドは特にUbuntu 20.04、22.04、および24.04 LTSバージョン向けに調整されています。


## 前提条件 {#prerequisites}

インストールを開始する前に、以下を確認してください：

* **Ubuntuサーバー**: 20.04、22.04、または24.04 LTS
* **rootアクセス**: root（sudo）権限でコマンドを実行できること
* **ドメイン名**: DNS管理アクセス権のある管理ドメイン
* **クリーンサーバー**: 新規のUbuntuインストールを推奨
* **インターネット接続**: パッケージやDockerイメージのダウンロードに必要


## システム要件 {#system-requirements}

* **RAM**: 最低2GB（本番環境では4GB推奨）
* **ストレージ**: 最低20GBの空き容量（本番環境では50GB以上推奨）
* **CPU**: 最低1 vCPU（本番環境では2以上推奨）
* **ネットワーク**: 以下のポートがアクセス可能なパブリックIPアドレス
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## ステップバイステップインストール {#step-by-step-installation}

### ステップ 1: 初期システムセットアップ {#step-1-initial-system-setup}

まず、システムを最新にし、rootユーザーに切り替えます：

```bash
# システムパッケージの更新
sudo apt update && sudo apt upgrade -y

# rootユーザーに切り替え（インストールに必要）
sudo su -
```

### ステップ 2: DNSリゾルバの設定 {#step-2-configure-dns-resolvers}

信頼性の高い証明書生成のために、CloudflareのDNSサーバーを使用するようシステムを設定します：

```bash
# systemd-resolvedが動作している場合は停止・無効化
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Cloudflare DNSリゾルバの設定
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
### Step 3: システム依存関係のインストール {#step-3-install-system-dependencies}

Forward Email に必要なパッケージをインストールします:

```bash
# パッケージリストを更新
apt-get update -y

# 基本的な依存関係をインストール
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Step 4: Snap パッケージのインストール {#step-4-install-snap-packages}

snap を使って AWS CLI と Certbot をインストールします:

```bash
# AWS CLI をインストール
snap install aws-cli --classic

# Certbot と DNS プラグインをインストール
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: Docker のインストール {#step-5-install-docker}

Docker CE と Docker Compose をインストールします:

```bash
# Docker の公式 GPG キーを追加
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Docker リポジトリを追加
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# パッケージインデックスを更新し Docker をインストール
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker のインストールを確認
docker --version
docker compose version
```

### Step 6: Docker サービスの設定 {#step-6-configure-docker-service}

Docker が自動起動し、実行中であることを確認します:

```bash
# Docker サービスを有効化して起動
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Docker が実行中か確認
docker info
```

Docker が起動しない場合は手動で起動を試みてください:

```bash
# systemctl が失敗した場合の代替起動方法
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 7: ファイアウォールの設定 {#step-7-configure-firewall}

UFW ファイアウォールを設定してサーバーを保護します:

```bash
# デフォルトポリシーを設定
ufw default deny incoming
ufw default allow outgoing

# SSH を許可（重要 - 自分自身をロックアウトしないように！）
ufw allow 22/tcp

# メール関連ポートを許可
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (Let's Encrypt 用)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (代替ポート)
ufw allow 2995/tcp  # POP3 (代替ポート)
ufw allow 3456/tcp  # カスタムサービスポート
ufw allow 4000/tcp  # カスタムサービスポート
ufw allow 5000/tcp  # カスタムサービスポート

# ローカルデータベース接続を許可
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# ファイアウォールを有効化
echo "y" | ufw enable

# ファイアウォールの状態を確認
ufw status numbered
```

### Step 8: Forward Email リポジトリのクローン {#step-8-clone-forward-email-repository}

Forward Email のソースコードをダウンロードします:

```bash
# 変数を設定
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# リポジトリをクローン
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# クローンが成功したか確認
ls -la
```

### Step 9: 環境設定の準備 {#step-9-set-up-environment-configuration}

環境設定を準備します:

```bash
# ディレクトリ変数を設定
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# デフォルト環境ファイルをコピー
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# SSL ディレクトリを作成
mkdir -p "$SELF_HOST_DIR/ssl"

# データベース用ディレクトリを作成
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 10: ドメインの設定 {#step-10-configure-your-domain}

ドメイン名を設定し、環境変数を更新します:

```bash
# 'yourdomain.com' を実際のドメインに置き換えてください
DOMAIN="yourdomain.com"

# 環境ファイルを更新する関数
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# ドメイン関連の環境変数を更新
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
### Step 11: SSL証明書の生成 {#step-11-generate-ssl-certificates}

#### オプションA: 手動DNSチャレンジ（ほとんどのユーザーに推奨） {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# 手動DNSチャレンジを使用して証明書を生成
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**重要**: プロンプトが表示されたら、DNSにTXTレコードを作成する必要があります。同じドメインに対して複数のチャレンジが表示される場合がありますが、**すべて作成してください**。2つ目のTXTレコードを追加するときに最初のTXTレコードを削除しないでください。

#### オプションB: Cloudflare DNS（Cloudflareを使用している場合） {#option-b-cloudflare-dns-if-you-use-cloudflare}

ドメインがCloudflareのDNSを使用している場合、証明書の生成を自動化できます：

```bash
# Cloudflare認証情報ファイルを作成
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# 適切な権限を設定
chmod 600 /root/.cloudflare.ini

# 証明書を自動生成
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

証明書生成後、アプリケーションディレクトリにコピーします：

```bash
# 証明書をアプリケーションのSSLディレクトリにコピー
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 証明書がコピーされたことを確認
ls -la "$SELF_HOST_DIR/ssl/"
```

### Step 12: 暗号化キーの生成 {#step-12-generate-encryption-keys}

安全な運用に必要な各種暗号化キーを作成します：

```bash
# ヘルパー暗号化キーを生成
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# メール転送用のSRSシークレットを生成
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# TXT暗号化キーを生成
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# メール署名用のDKIM秘密鍵を生成
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Webhook署名キーを生成
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# SMTPトランスポートパスワードを設定
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ すべての暗号化キーが正常に生成されました"
```

### Step 13: 設定ファイル内のSSLパスを更新 {#step-13-update-ssl-paths-in-configuration}

環境ファイル内のSSL証明書パスを設定します：

```bash
# SSLパスを正しい証明書ファイルに更新
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 14: ベーシック認証の設定 {#step-14-set-up-basic-authentication}

一時的なベーシック認証の認証情報を作成します：

```bash
# 安全なランダムパスワードを生成
PASSWORD=$(openssl rand -base64 16)

# 環境ファイルにベーシック認証情報を更新
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# 認証情報を表示（必ず保存してください！）
echo ""
echo "🔐 重要: これらのログイン認証情報を保存してください！"
echo "=================================="
echo "ユーザー名: admin"
echo "パスワード: $PASSWORD"
echo "=================================="
echo ""
echo "インストール後、ウェブインターフェースにアクセスする際に必要です。"
echo ""
```

### Step 15: Docker Composeでデプロイ {#step-15-deploy-with-docker-compose}

Forward Emailのすべてのサービスを起動します：

```bash
# Docker Composeファイルのパスを設定
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# 既存のコンテナを停止
docker compose -f "$DOCKER_COMPOSE_FILE" down

# 最新イメージをプル
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# すべてのサービスをデタッチモードで起動
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# サービス起動のため少し待機
sleep 10

# サービスの状態を確認
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Step 16: インストールの確認 {#step-16-verify-installation}

すべてのサービスが正しく動作しているか確認してください：

```bash
# Dockerコンテナの確認
docker ps

# サービスログにエラーがないか確認
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Webインターフェースの接続テスト
curl -I https://$DOMAIN

# ポートがリッスンしているか確認
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## インストール後の設定 {#post-installation-configuration}

### DNSレコードの設定 {#dns-records-setup}

ドメインに対して以下のDNSレコードを設定する必要があります：

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

DKIM公開鍵を取得します：

```bash
# DKIM公開鍵の抽出
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

DKIMのDNSレコードを作成します：

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARCレコード {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### 初回ログイン {#first-login}

1. Webブラウザを開き、`https://yourdomain.com` にアクセスします
2. 事前に保存したベーシック認証の資格情報を入力します
3. 初期セットアップウィザードを完了します
4. 最初のメールアカウントを作成します


## バックアップ設定 {#backup-configuration}

### S3互換バックアップの設定 {#set-up-s3-compatible-backup}

S3互換ストレージへの自動バックアップを設定します：

```bash
# AWS認証情報ディレクトリの作成
mkdir -p ~/.aws

# AWS認証情報の設定
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# AWS設定の作成
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# AWS以外のS3（Cloudflare R2など）の場合はエンドポイントURLを追加
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### バックアップ用Cronジョブの設定 {#set-up-backup-cron-jobs}

```bash
# バックアップスクリプトを実行可能にする
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# MongoDBバックアップのcronジョブを追加（毎日深夜実行）
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Redisバックアップのcronジョブを追加（毎日深夜実行）
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# cronジョブが追加されたか確認
crontab -l
```


## 自動更新設定 {#auto-update-configuration}

Forward Emailのインストールを自動更新する設定を行います：

```bash
# 自動更新コマンドの作成
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# 自動更新のcronジョブを追加（毎日午前1時実行）
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# cronジョブが追加されたか確認
crontab -l
```


## メンテナンスと監視 {#maintenance-and-monitoring}

### ログの場所 {#log-locations}

* **Docker Composeログ**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **システムログ**: `/var/log/syslog`
* **バックアップログ**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **自動更新ログ**: `/var/log/autoupdate.log`

### 定期メンテナンス作業 {#regular-maintenance-tasks}

1. **ディスク容量の監視**: `df -h`
2. **サービスの状態確認**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **ログの確認**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **システムパッケージの更新**: `apt update && apt upgrade`
5. **証明書の更新**: 証明書は自動更新されますが、有効期限を監視してください

### 証明書の更新 {#certificate-renewal}

証明書は自動更新されますが、必要に応じて手動で更新できます：

```bash
# 手動で証明書を更新
certbot renew

# 更新された証明書をコピー
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 新しい証明書を使用するためにサービスを再起動
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## トラブルシューティング {#troubleshooting}

### よくある問題 {#common-issues}

#### 1. Dockerサービスが起動しない {#1-docker-service-wont-start}

```bash
# Dockerの状態を確認
systemctl status docker

# 代替起動を試す
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 証明書の生成に失敗する {#2-certificate-generation-fails}

* ポート80と443がアクセス可能であることを確認してください
* DNSレコードがサーバーを指していることを確認してください
* ファイアウォールの設定を確認してください

#### 3. メール配信の問題 {#3-email-delivery-issues}

* MXレコードが正しいことを確認してください
* SPF、DKIM、DMARCレコードを確認してください
* ホスティングプロバイダーによってポート25がブロックされていないことを確認してください

#### 4. Webインターフェースにアクセスできない {#4-web-interface-not-accessible}

* ファイアウォールの設定を確認：`ufw status`
* SSL証明書を確認：`openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* ベーシック認証の資格情報を確認してください

### ヘルプを得る {#getting-help}

* **ドキュメント**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **コミュニティサポート**: プロジェクトのGitHubディスカッションを確認してください


## セキュリティのベストプラクティス {#security-best-practices}

1. **システムを最新に保つ**: Ubuntuとパッケージを定期的に更新する
2. **ログを監視する**: ログ監視とアラート設定を行う
3. **定期的にバックアップを取る**: バックアップと復元手順をテストする
4. **強力なパスワードを使用する**: すべてのアカウントに強力なパスワードを生成する
5. **Fail2Banを有効にする**: 追加のセキュリティのためにfail2banのインストールを検討する
6. **定期的なセキュリティ監査**: 設定を定期的に見直す


## 結論 {#conclusion}

Forward EmailのセルフホストインストールはUbuntu上で完了し、稼働しているはずです。以下を忘れずに行ってください：

1. DNSレコードを正しく設定する
2. メールの送受信をテストする
3. 定期的なバックアップを設定する
4. システムを定期的に監視する
5. インストールを最新の状態に保つ

追加の設定オプションや高度な機能については、公式のForward Emailドキュメント <https://forwardemail.net/self-hosted#configuration> を参照してください。
