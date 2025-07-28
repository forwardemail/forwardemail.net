# Debian 转发电子邮件自托管安装指南 {#forward-email-self-hosting-installation-guide-for-debian}

## 目录 {#table-of-contents}

* [概述](#overview)
* [先决条件](#prerequisites)
* [系统要求](#system-requirements)
* [分步安装](#step-by-step-installation)
  * [步骤 1：初始系统设置](#step-1-initial-system-setup)
  * [步骤2：配置DNS解析器](#step-2-configure-dns-resolvers)
  * [步骤3：安装系统依赖项](#step-3-install-system-dependencies)
  * [步骤4：安装并配置Snapd](#step-4-install-and-configure-snapd)
  * [步骤5：安装Snap包](#step-5-install-snap-packages)
  * [步骤6：安装Docker](#step-6-install-docker)
  * [步骤7：配置Docker服务](#step-7-configure-docker-service)
  * [步骤8：安装并配置UFW防火墙](#step-8-install-and-configure-ufw-firewall)
  * [步骤9：克隆转发电子邮件存储库](#step-9-clone-forward-email-repository)
  * [步骤10：设置环境配置](#step-10-set-up-environment-configuration)
  * [步骤11：配置您的域](#step-11-configure-your-domain)
  * [步骤12：生成SSL证书](#step-12-generate-ssl-certificates)
  * [步骤13：生成加密密钥](#step-13-generate-encryption-keys)
  * [步骤14：更新配置中的SSL路径](#step-14-update-ssl-paths-in-configuration)
  * [步骤15：设置基本身份验证](#step-15-set-up-basic-authentication)
  * [步骤 16：使用 Docker Compose 进行部署](#step-16-deploy-with-docker-compose)
  * [步骤17：验证安装](#step-17-verify-installation)
* [安装后配置](#post-installation-configuration)
  * [DNS 记录设置](#dns-records-setup)
  * [首次登录](#first-login)
* [备份配置](#backup-configuration)
  * [设置与 S3 兼容的备份](#set-up-s3-compatible-backup)
  * [设置备份 Cron 作业](#set-up-backup-cron-jobs)
* [自动更新配置](#auto-update-configuration)
* [Debian 特定的注意事项](#debian-specific-considerations)
  * [包管理差异](#package-management-differences)
  * [服务管理](#service-management)
  * [网络配置](#network-configuration)
* [维护和监控](#maintenance-and-monitoring)
  * [日志位置](#log-locations)
  * [定期维护任务](#regular-maintenance-tasks)
  * [证书续订](#certificate-renewal)
* [故障排除](#troubleshooting)
  * [Debian 特定问题](#debian-specific-issues)
  * [常见问题](#common-issues)
  * [获取帮助](#getting-help)
* [安全最佳实践](#security-best-practices)
* [结论](#conclusion)

## 概述 {#overview}

本指南提供在 Debian 系统上安装 Forward Email 自托管解决方案的分步说明。本指南专门针对 Debian 11（Bullseye）和 Debian 12（Bookworm）系统。

## 先决条件 {#prerequisites}

在开始安装之前，请确保您已：

* **Debian 服务器**：版本 11 (Bullseye) 或 12 (Bookworm)
* **Root 权限**：您必须能够以 root 身份运行命令（sudo 权限）
* **域名**：您拥有 DNS 管理权限的域名
* **干净服务器**：建议使用全新安装的 Debian
* **Internet 连接**：下载软件包和 Docker 镜像所需

## 系统要求 {#system-requirements}

* **RAM**：至少 2GB（生产环境建议 4GB）
* **存储空间**：至少 20GB 可用空间（生产环境建议 50GB 以上）
* **CPU**：至少 1 个 vCPU（生产环境建议 2 个以上 vCPU）
* **网络**：公网 IP 地址，可访问以下端口：
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## 分步安装 {#step-by-step-installation}

### 步骤 1：初始系统设置 {#step-1-initial-system-setup}

首先，确保您的系统是最新的，并切换到 root 用户：

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### 步骤 2：配置 DNS 解析器 {#step-2-configure-dns-resolvers}

配置您的系统以使用 Cloudflare 的 DNS 服务器来生成可靠的证书：

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

### 步骤 3：安装系统依赖项 {#step-3-install-system-dependencies}

在 Debian 上安装转发电子邮件所需的软件包：

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

### 步骤 4：安装和配置 Snapd {#step-4-install-and-configure-snapd}

Debian 默认不包含 snapd，所以我们需要安装并配置它：

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

### 步骤 5：安装 Snap 包 {#step-5-install-snap-packages}

通过 snap 安装 AWS CLI 和 Certbot：

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

### 步骤 6：安装 Docker {#step-6-install-docker}

在 Debian 上安装 Docker CE 和 Docker Compose：

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

### 步骤 7：配置 Docker 服务 {#step-7-configure-docker-service}

确保 Docker 自动启动并运行：

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

如果 Docker 启动失败，请尝试手动启动：

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### 步骤 8：安装和配置 UFW 防火墙 {#step-8-install-and-configure-ufw-firewall}

Debian 最小安装可能不包含 UFW，因此请先安装它：

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

### 步骤 9：克隆转发电子邮件存储库 {#step-9-clone-forward-email-repository}

下载转发电子邮件源代码：

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

### 步骤 10：设置环境配置 {#step-10-set-up-environment-configuration}

准备环境配置：

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

### 步骤 11：配置您的域名 {#step-11-configure-your-domain}

设置您的域名并更新环境变量：

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

### 步骤 12：生成 SSL 证书 {#step-12-generate-ssl-certificates}

#### 选项 A：手动 DNS 质询（推荐大多数用户使用）{#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**重要提示**：出现提示时，您需要在 DNS 中创建 TXT 记录。您可能会看到同一域名的多个验证请求 - 请**创建所有验证请求**。添加第二个 TXT 记录时，请勿删除第一个 TXT 记录。

#### 选项 B：Cloudflare DNS（如果您使用 Cloudflare）{#option-b-cloudflare-dns-if-you-use-cloudflare}

如果您的域使用 Cloudflare 作为 DNS，您可以自动生成证书：

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

#### 复制证书 {#copy-certificates}

证书生成后，将其复制到应用程序目录：

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### 步骤 13：生成加密密钥 {#step-13-generate-encryption-keys}

创建安全操作所需的各种加密密钥：

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

### 步骤 14：更新配置中的 SSL 路径 {#step-14-update-ssl-paths-in-configuration}

在环境文件中配置 SSL 证书路径：

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### 步骤 15：设置基本身份验证 {#step-15-set-up-basic-authentication}

创建临时基本身份验证凭证：

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

### 步骤 16：使用 Docker Compose 部署 {#step-16-deploy-with-docker-compose}

启动所有转发电子邮件服务：

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

### 步骤 17：验证安装 {#step-17-verify-installation}

检查所有服务是否正常运行：

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

## 安装后配置 {#post-installation-configuration}

### DNS 记录设置 {#dns-records-setup}

您需要为您的域配置以下 DNS 记录：

#### MX 记录 {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### A 记录 {#a-records}

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

#### SPF 记录 {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM 记录 {#dkim-record}

获取您的 DKIM 公钥：

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

创建 DKIM DNS 记录：

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC 记录 {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### 首次登录 {#first-login}

1. 打开您的网络浏览器并导航至 `https://yourdomain.com`
2. 输入您之前保存的基本身份验证凭据
3. 完成初始设置向导
4. 创建您的第一个电子邮件帐户

## 备份配置 {#backup-configuration}

### 设置 S3 兼容备份 {#set-up-s3-compatible-backup}

配置自动备份到 S3 兼容存储：

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

### 设置备份 Cron 作业 {#set-up-backup-cron-jobs}

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

## 自动更新配置 {#auto-update-configuration}

为您的转发电子邮件安装设置自动更新：

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

## Debian 特定注意事项 {#debian-specific-considerations}

### 包管理差异 {#package-management-differences}

* Snapd：Debian 默认不安装，需要手动安装
* Docker：使用 Debian 专属仓库和 GPG 密钥
* UFW：Debian 精简安装中可能不包含
* systemd：行为可能与 Ubuntu 略有不同

### 服务管理 {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### 网络配置 {#network-configuration}

Debian 可能有不同的网络接口名称或配置：

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## 维护和监控 {#maintenance-and-monitoring}

### 日志位置 {#log-locations}

* **Docker Compose 日志**：根据安装情况使用相应的 docker compose 命令
* **系统日志**：`/var/log/syslog`
* **备份日志**：`/var/log/mongo-backup.log`、`/var/log/redis-backup.log`
* **自动更新日志**：`/var/log/autoupdate.log`
* **Snapd 日志**：`journalctl -u snapd`

### 定期维护任务 {#regular-maintenance-tasks}

1. **监控磁盘空间**：`df -h`
2. **检查服务状态**：使用合适的 docker-compose 命令
3. **查看日志**：检查应用程序日志和系统日志
4. **更新系统软件包**：`apt update && apt upgrade`
5. **监控 snapd**：`snap list` 和 `snap refresh`

### 证书续订 {#certificate-renewal}

证书应该自动更新，但您可以根据需要手动更新：

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

## 故障排除 {#troubleshooting}

### Debian 特定问题 {#debian-specific-issues}

#### 1. Snapd 无法正常工作 {#1-snapd-not-working}

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

#### 2. 未找到 Docker Compose 命令 {#2-docker-compose-command-not-found}

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

#### 3. 软件包安装问题 {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### 常见问题 {#common-issues}

#### 1. Docker 服务无法启动 {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 证书生成失败 {#2-certificate-generation-fails}

* 确保 80 和 443 端口可访问
* 验证 DNS 记录是否指向您的服务器
* 使用 `ufw status` 检查防火墙设置

#### 3. 电子邮件递送问题 {#3-email-delivery-issues}

* 验证 MX 记录是否正确
* 检查 SPF、DKIM 和 DMARC 记录
* 确保您的主机提供商未屏蔽 25 端口

### 获取帮助 {#getting-help}

* **文档**：<https://forwardemail.net/self-hosted>
* **GitHub 问题**：<https://github.com/forwardemail/forwardemail.net/issues>
* **Debian 文档**：<https://www.debian.org/doc/>

## 安全最佳实践 {#security-best-practices}

1. **保持系统更新**：定期更新 Debian 和软件包
2. **监控日志**：设置日志监控和警报
3. **定期备份**：测试备份和恢复程序
4. **使用强密码**：为所有帐户生成强密码
5. **启用 Fail2Ban**：考虑安装 fail2ban 以增强安全性
6. **定期安全审核**：定期检查您的配置
7. **监控 Snapd**：使用 `snap refresh` 保持 Snap 软件包更新

## 结论 {#conclusion}

您的 Forward Email 自托管安装现已完成，并在 Debian 上运行。请记住：

1. 正确配置 DNS 记录
2. 测试电子邮件收发
3. 设置定期备份
4. 定期监控系统
5. 保持安装更新
6. 监控 snapd 和 snap 软件包

与 Ubuntu 的主要区别在于 snapd 安装和 Docker 仓库配置。正确设置后，“转发电子邮件”应用程序在两个系统上的运行方式完全相同。

有关其他配置选项和高级功能，请参阅官方转发电子邮件文档 <https://forwardemail.net/self-hosted#configuration>.