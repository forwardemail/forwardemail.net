# Ubuntu 转发电子邮件自托管安装指南 {#forward-email-self-hosting-installation-guide-for-ubuntu}

## 目录 {#table-of-contents}

* [概述](#overview)
* [先决条件](#prerequisites)
* [系统要求](#system-requirements)
* [分步安装](#step-by-step-installation)
  * [步骤 1：初始系统设置](#step-1-initial-system-setup)
  * [步骤2：配置DNS解析器](#step-2-configure-dns-resolvers)
  * [步骤3：安装系统依赖项](#step-3-install-system-dependencies)
  * [步骤4：安装Snap包](#step-4-install-snap-packages)
  * [步骤5：安装Docker](#step-5-install-docker)
  * [步骤6：配置Docker服务](#step-6-configure-docker-service)
  * [步骤7：配置防火墙](#step-7-configure-firewall)
  * [步骤 8：克隆转发电子邮件存储库](#step-8-clone-forward-email-repository)
  * [步骤9：设置环境配置](#step-9-set-up-environment-configuration)
  * [步骤10：配置您的域](#step-10-configure-your-domain)
  * [步骤11：生成SSL证书](#step-11-generate-ssl-certificates)
  * [步骤12：生成加密密钥](#step-12-generate-encryption-keys)
  * [步骤 13：更新配置中的 SSL 路径](#step-13-update-ssl-paths-in-configuration)
  * [步骤14：设置基本身份验证](#step-14-set-up-basic-authentication)
  * [步骤 15：使用 Docker Compose 进行部署](#step-15-deploy-with-docker-compose)
  * [步骤16：验证安装](#step-16-verify-installation)
* [安装后配置](#post-installation-configuration)
  * [DNS 记录设置](#dns-records-setup)
  * [首次登录](#first-login)
* [备份配置](#backup-configuration)
  * [设置与 S3 兼容的备份](#set-up-s3-compatible-backup)
  * [设置备份 Cron 作业](#set-up-backup-cron-jobs)
* [自动更新配置](#auto-update-configuration)
* [维护和监控](#maintenance-and-monitoring)
  * [日志位置](#log-locations)
  * [定期维护任务](#regular-maintenance-tasks)
  * [证书续订](#certificate-renewal)
* [故障排除](#troubleshooting)
  * [常见问题](#common-issues)
  * [获取帮助](#getting-help)
* [安全最佳实践](#security-best-practices)
* [结论](#conclusion)

## 概览 {#overview}

本指南提供在 Ubuntu 系统上安装 Forward Email 自托管解决方案的分步说明。本指南专门针对 Ubuntu 20.04、22.04 和 24.04 LTS 版本。

## 先决条件 {#prerequisites}

在开始安装之前，请确保您已：

* **Ubuntu 服务器**：20.04、22.04 或 24.04 LTS
* **Root 权限**：您必须能够以 root 身份运行命令（sudo 权限）
* **域名**：您拥有 DNS 管理权限的域名
* **干净服务器**：建议使用全新安装的 Ubuntu
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

安装转发电子邮件所需的软件包：

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

### 步骤 4：安装 Snap 软件包 {#step-4-install-snap-packages}

通过 snap 安装 AWS CLI 和 Certbot：

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### 步骤 5：安装 Docker {#step-5-install-docker}

安装 Docker CE 和 Docker Compose：

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

### 步骤 6：配置 Docker 服务 {#step-6-configure-docker-service}

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

### 步骤 7：配置防火墙 {#step-7-configure-firewall}

设置 UFW 防火墙来保护您的服务器：

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

### 步骤 8：克隆转发电子邮件存储库 {#step-8-clone-forward-email-repository}

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

### 步骤 9：设置环境配置 {#step-9-set-up-environment-configuration}

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

### 步骤 10：配置您的域 {#step-10-configure-your-domain}

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

### 步骤 11：生成 SSL 证书 {#step-11-generate-ssl-certificates}

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

### 步骤 12：生成加密密钥 {#step-12-generate-encryption-keys}

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

### 步骤 13：更新配置中的 SSL 路径 {#step-13-update-ssl-paths-in-configuration}

在环境文件中配置 SSL 证书路径：

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### 步骤 14：设置基本身份验证 {#step-14-set-up-basic-authentication}

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

### 步骤 15：使用 Docker Compose 部署 {#step-15-deploy-with-docker-compose}

启动所有转发电子邮件服务：

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

### 步骤 16：验证安装 {#step-16-verify-installation}

检查所有服务是否正常运行：

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

1. 打开您的网页浏览器并导航至 `https://yourdomain.com`
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
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## 维护和监控 {#maintenance-and-monitoring}

### 日志位置 {#log-locations}

* **Docker Compose 日志**：`docker compose -f $DOCKER_COMPOSE_FILE logs`
* **系统日志**：`/var/log/syslog`
* **备份日志**：`/var/log/mongo-backup.log`、`/var/log/redis-backup.log`
* **自动更新日志**：`/var/log/autoupdate.log`

### 定期维护任务 {#regular-maintenance-tasks}

1. **监控磁盘空间**：`df -h`
2. **检查服务状态**：`docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **查看日志**：`docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **更新系统软件包**：`apt update && apt upgrade`
5. **续订证书**：证书自动续订，但会监控其到期情况

### 证书续订 {#certificate-renewal}

证书应该自动更新，但您可以根据需要手动更新：

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## 故障排除 {#troubleshooting}

### 常见问题 {#common-issues}

#### 1. Docker 服务无法启动 {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 证书生成失败 {#2-certificate-generation-fails}

* 确保 80 和 443 端口可访问
* 验证 DNS 记录是否指向您的服务器
* 检查防火墙设置

#### 3. 电子邮件递送问题 {#3-email-delivery-issues}

* 验证 MX 记录是否正确
* 检查 SPF、DKIM 和 DMARC 记录
* 确保您的主机提供商未屏蔽 25 端口

#### 4. Web 界面无法访问 {#4-web-interface-not-accessible}

* 检查防火墙设置：`ufw status`
* 验证 SSL 证书：`openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* 检查基本身份验证凭据

### 获取帮助 {#getting-help}

* **文档**：<https://forwardemail.net/self-hosted>
* **GitHub 问题**：<https://github.com/forwardemail/forwardemail.net/issues>
* **社区支持**：查看项目的 GitHub 讨论

## 安全最佳实践 {#security-best-practices}

1. **保持系统更新**：定期更新 Ubuntu 和软件包
2. **监控日志**：设置日志监控和警报
3. **定期备份**：测试备份和恢复程序
4. **使用强密码**：为所有帐户生成强密码
5. **启用 Fail2Ban**：考虑安装 fail2ban 以增强安全性
6. **定期安全审核**：定期检查您的配置

## 结论 {#conclusion}

您的 Forward Email 自托管安装现在应该已完成并在 Ubuntu 上运行。请记住：

1. 正确配置您的 DNS 记录
2. 测试电子邮件收发
3. 设置定期备份
4. 定期监控您的系统
5. 保持安装更新

有关其他配置选项和高级功能，请参阅官方转发电子邮件文档 <https://forwardemail.net/self-hosted#configuration>.