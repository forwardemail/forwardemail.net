# Forward Email 自托管安装指南（Debian）{#forward-email-self-hosting-installation-guide-for-debian}


## 目录 {#table-of-contents}

* [概述](#overview)
* [先决条件](#prerequisites)
* [系统要求](#system-requirements)
* [逐步安装](#step-by-step-installation)
  * [步骤 1：初始系统设置](#step-1-initial-system-setup)
  * [步骤 2：配置 DNS 解析器](#step-2-configure-dns-resolvers)
  * [步骤 3：安装系统依赖](#step-3-install-system-dependencies)
  * [步骤 4：安装并配置 Snapd](#step-4-install-and-configure-snapd)
  * [步骤 5：安装 Snap 软件包](#step-5-install-snap-packages)
  * [步骤 6：安装 Docker](#step-6-install-docker)
  * [步骤 7：配置 Docker 服务](#step-7-configure-docker-service)
  * [步骤 8：安装并配置 UFW 防火墙](#step-8-install-and-configure-ufw-firewall)
  * [步骤 9：克隆 Forward Email 仓库](#step-9-clone-forward-email-repository)
  * [步骤 10：设置环境配置](#step-10-set-up-environment-configuration)
  * [步骤 11：配置您的域名](#step-11-configure-your-domain)
  * [步骤 12：生成 SSL 证书](#step-12-generate-ssl-certificates)
  * [步骤 13：生成加密密钥](#step-13-generate-encryption-keys)
  * [步骤 14：更新配置中的 SSL 路径](#step-14-update-ssl-paths-in-configuration)
  * [步骤 15：设置基本认证](#step-15-set-up-basic-authentication)
  * [步骤 16：使用 Docker Compose 部署](#step-16-deploy-with-docker-compose)
  * [步骤 17：验证安装](#step-17-verify-installation)
* [安装后配置](#post-installation-configuration)
  * [DNS 记录设置](#dns-records-setup)
  * [首次登录](#first-login)
* [备份配置](#backup-configuration)
  * [设置兼容 S3 的备份](#set-up-s3-compatible-backup)
  * [设置备份定时任务](#set-up-backup-cron-jobs)
* [自动更新配置](#auto-update-configuration)
* [Debian 特定注意事项](#debian-specific-considerations)
  * [软件包管理差异](#package-management-differences)
  * [服务管理](#service-management)
  * [网络配置](#network-configuration)
* [维护与监控](#maintenance-and-monitoring)
  * [日志位置](#log-locations)
  * [常规维护任务](#regular-maintenance-tasks)
  * [证书续期](#certificate-renewal)
* [故障排除](#troubleshooting)
  * [Debian 特定问题](#debian-specific-issues)
  * [常见问题](#common-issues)
  * [获取帮助](#getting-help)
* [安全最佳实践](#security-best-practices)
* [结论](#conclusion)


## 概述 {#overview}

本指南提供了在 Debian 系统上安装 Forward Email 自托管解决方案的逐步说明。本指南专门针对 Debian 11（Bullseye）和 Debian 12（Bookworm）。


## 先决条件 {#prerequisites}

开始安装前，请确保您具备：

* **Debian 服务器**：版本 11（Bullseye）或 12（Bookworm）
* **Root 权限**：您必须能够以 root 身份运行命令（sudo 权限）
* **域名**：您控制的域名，并且有 DNS 管理权限
* **干净的服务器**：建议使用全新安装的 Debian
* **网络连接**：需要用于下载软件包和 Docker 镜像


## 系统要求 {#system-requirements}

* **内存**：最低 2GB（生产环境建议 4GB）
* **存储**：最低 20GB 可用空间（生产环境建议 50GB 以上）
* **CPU**：最低 1 个 vCPU（生产环境建议 2 个及以上）
* **网络**：具有以下端口可访问的公网 IP 地址：
  * 22（SSH）
  * 25（SMTP）
  * 80（HTTP）
  * 443（HTTPS）
  * 465（SMTPS）
  * 993（IMAPS）
  * 995（POP3S）


## 逐步安装 {#step-by-step-installation}

### 步骤 1：初始系统设置 {#step-1-initial-system-setup}

首先，确保系统是最新的，并切换到 root 用户：

```bash
# 更新系统软件包
sudo apt update && sudo apt upgrade -y

# 切换到 root 用户（安装过程中需要）
sudo su -
```
### 第 2 步：配置 DNS 解析器 {#step-2-configure-dns-resolvers}

配置您的系统使用 Cloudflare 的 DNS 服务器，以确保证书生成的可靠性：

```bash
# 停止并禁用 systemd-resolved（如果正在运行）
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# 配置 Cloudflare DNS 解析器
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

### 第 3 步：安装系统依赖 {#step-3-install-system-dependencies}

在 Debian 上安装 Forward Email 所需的软件包：

```bash
# 更新软件包列表
apt-get update -y

# 安装基本依赖（Debian 特定的软件包列表）
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

### 第 4 步：安装并配置 Snapd {#step-4-install-and-configure-snapd}

Debian 默认不包含 snapd，因此需要安装并配置它：

```bash
# 安装 snapd
apt-get install -y snapd

# 启用并启动 snapd 服务
systemctl enable snapd
systemctl start snapd

# 创建 snap 的符号链接以确保正常工作
ln -sf /var/lib/snapd/snap /snap

# 等待 snapd 准备就绪
sleep 10

# 验证 snapd 是否正常工作
snap version
```

### 第 5 步：安装 Snap 软件包 {#step-5-install-snap-packages}

通过 snap 安装 AWS CLI 和 Certbot：

```bash
# 安装 AWS CLI
snap install aws-cli --classic

# 安装 Certbot 及 DNS 插件
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# 验证安装
aws --version
certbot --version
```

### 第 6 步：安装 Docker {#step-6-install-docker}

在 Debian 上安装 Docker CE 和 Docker Compose：

```bash
# 添加 Docker 官方 GPG 密钥（Debian 特定）
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# 添加 Docker 仓库（Debian 特定）
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# 更新软件包索引并安装 Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 安装独立的 docker-compose 作为备用（如果插件不可用）
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# 验证 Docker 安装
docker --version
docker compose version || docker-compose --version
```

### 第 7 步：配置 Docker 服务 {#step-7-configure-docker-service}

确保 Docker 自动启动并正在运行：

```bash
# 启用并启动 Docker 服务
systemctl unmask docker
systemctl enable docker
systemctl start docker

# 验证 Docker 是否正在运行
docker info
```

如果 Docker 启动失败，尝试手动启动：

```bash
# 如果 systemctl 启动失败，使用此备用启动方法
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### 第 8 步：安装并配置 UFW 防火墙 {#step-8-install-and-configure-ufw-firewall}

Debian 最小安装可能不包含 UFW，因此先安装它：

```bash
# 如果未安装 UFW，则安装
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# 设置默认策略
ufw default deny incoming
ufw default allow outgoing

# 允许 SSH（重要 - 不要锁定自己！）
ufw allow 22/tcp

# 允许邮件相关端口
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP（用于 Let's Encrypt）
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP（备用端口）
ufw allow 2995/tcp  # POP3（备用端口）
ufw allow 3456/tcp  # 自定义服务端口
ufw allow 4000/tcp  # 自定义服务端口
ufw allow 5000/tcp  # 自定义服务端口

# 允许本地数据库连接
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# 启用防火墙
echo "y" | ufw enable

# 检查防火墙状态
ufw status numbered
```
### 第9步：克隆 Forward Email 仓库 {#step-9-clone-forward-email-repository}

下载 Forward Email 源代码：

```bash
# 设置变量
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# 克隆仓库
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# 验证克隆是否成功
ls -la
```

### 第10步：设置环境配置 {#step-10-set-up-environment-configuration}

准备环境配置：

```bash
# 设置目录变量
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# 复制默认环境文件
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# 创建 SSL 目录
mkdir -p "$SELF_HOST_DIR/ssl"

# 创建数据库目录
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### 第11步：配置您的域名 {#step-11-configure-your-domain}

设置您的域名并更新环境变量：

```bash
# 将 'yourdomain.com' 替换为您的实际域名
DOMAIN="yourdomain.com"

# 更新环境文件的函数
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# 更新与域名相关的环境变量
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

### 第12步：生成 SSL 证书 {#step-12-generate-ssl-certificates}

#### 选项A：手动 DNS 验证（推荐大多数用户） {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# 使用手动 DNS 验证生成证书
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**重要**：当提示时，您需要在 DNS 中创建 TXT 记录。您可能会看到同一域名的多个挑战 —— **请创建所有这些记录**。添加第二个 TXT 记录时不要删除第一个。

#### 选项B：Cloudflare DNS（如果您使用 Cloudflare） {#option-b-cloudflare-dns-if-you-use-cloudflare}

如果您的域名使用 Cloudflare 作为 DNS，您可以自动化证书生成：

```bash
# 创建 Cloudflare 凭据文件
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# 设置正确权限
chmod 600 /root/.cloudflare.ini

# 自动生成证书
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

证书生成后，将它们复制到应用程序目录：

```bash
# 复制证书到应用 SSL 目录
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 验证证书是否已复制
ls -la "$SELF_HOST_DIR/ssl/"
```

### 第13步：生成加密密钥 {#step-13-generate-encryption-keys}

创建安全运行所需的各种加密密钥：

```bash
# 生成辅助加密密钥
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# 生成用于邮件转发的 SRS 密钥
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# 生成 TXT 加密密钥
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# 生成用于邮件签名的 DKIM 私钥
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# 生成 webhook 签名密钥
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# 设置 SMTP 传输密码
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ 所有加密密钥生成成功"
```
### 第14步：更新配置中的 SSL 路径 {#step-14-update-ssl-paths-in-configuration}

在环境文件中配置 SSL 证书路径：

```bash
# 更新 SSL 路径以指向正确的证书文件
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### 第15步：设置基本认证 {#step-15-set-up-basic-authentication}

创建临时基本认证凭据：

```bash
# 生成一个安全的随机密码
PASSWORD=$(openssl rand -base64 16)

# 使用基本认证凭据更新环境文件
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# 显示凭据（请保存！）
echo ""
echo "🔐 重要提示：请保存这些登录凭据！"
echo "=================================="
echo "用户名: admin"
echo "密码: $PASSWORD"
echo "=================================="
echo ""
echo "安装完成后，您需要这些凭据来访问网页界面。"
echo ""
```

### 第16步：使用 Docker Compose 部署 {#step-16-deploy-with-docker-compose}

启动所有 Forward Email 服务：

```bash
# 设置 Docker Compose 文件路径
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# 停止任何现有容器
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# 拉取最新镜像
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# 以后台模式启动所有服务
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# 等待服务启动
sleep 10

# 检查服务状态
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### 第17步：验证安装 {#step-17-verify-installation}

检查所有服务是否正常运行：

```bash
# 检查 Docker 容器
docker ps

# 检查服务日志是否有错误
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# 测试网页界面连接
curl -I https://$DOMAIN

# 检查端口监听情况
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
# 提取 DKIM 公钥
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

### 第一次登录 {#first-login}

1. 打开您的网页浏览器，访问 `https://yourdomain.com`
2. 输入您之前保存的基本认证凭据
3. 完成初始设置向导
4. 创建您的第一个邮箱账户


## 备份配置 {#backup-configuration}

### 设置兼容 S3 的备份 {#set-up-s3-compatible-backup}

配置自动备份到兼容 S3 的存储：

```bash
# 创建 AWS 凭据目录
mkdir -p ~/.aws

# 配置 AWS 凭据
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# 配置 AWS 设置
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# 对于非 AWS S3（如 Cloudflare R2），添加端点 URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### 设置备份定时任务 {#set-up-backup-cron-jobs}

```bash
# 使备份脚本可执行
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# 添加 MongoDB 备份定时任务（每天午夜运行）
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# 添加 Redis 备份定时任务（每天午夜运行）
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# 验证定时任务是否添加成功
crontab -l
```


## 自动更新配置 {#auto-update-configuration}

为您的 Forward Email 安装设置自动更新：

```bash
# 创建自动更新命令（使用适当的 docker compose 命令）
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# 添加自动更新定时任务（每天凌晨1点运行）
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# 验证定时任务是否添加成功
crontab -l
```


## Debian 特定注意事项 {#debian-specific-considerations}

### 软件包管理差异 {#package-management-differences}

* **Snapd**：Debian 默认未安装，需要手动安装
* **Docker**：使用 Debian 特定的仓库和 GPG 密钥
* **UFW**：可能不包含在最小化的 Debian 安装中
* **systemd**：行为可能与 Ubuntu 略有不同

### 服务管理 {#service-management}

```bash
# 检查服务状态（Debian 特定命令）
systemctl status snapd
systemctl status docker
systemctl status ufw

# 如有需要，重启服务
systemctl restart snapd
systemctl restart docker
```

### 网络配置 {#network-configuration}

Debian 可能有不同的网络接口名称或配置：

```bash
# 查看网络接口
ip addr show

# 查看路由
ip route show

# 检查 DNS 解析
nslookup google.com
```


## 维护与监控 {#maintenance-and-monitoring}

### 日志位置 {#log-locations}

* **Docker Compose 日志**：根据安装使用适当的 docker compose 命令
* **系统日志**：`/var/log/syslog`
* **备份日志**：`/var/log/mongo-backup.log`，`/var/log/redis-backup.log`
* **自动更新日志**：`/var/log/autoupdate.log`
* **Snapd 日志**：`journalctl -u snapd`

### 定期维护任务 {#regular-maintenance-tasks}

1. **监控磁盘空间**：`df -h`
2. **检查服务状态**：使用适当的 docker compose 命令
3. **查看日志**：检查应用和系统日志
4. **更新系统软件包**：`apt update && apt upgrade`
5. **监控 snapd**：`snap list` 和 `snap refresh`

### 证书续期 {#certificate-renewal}

证书应自动续期，但您也可以手动续期：

```bash
# 手动续期证书
certbot renew

# 复制续期后的证书
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# 重启服务以使用新证书
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## 故障排除 {#troubleshooting}

### Debian 特定问题 {#debian-specific-issues}

#### 1. Snapd 无法工作 {#1-snapd-not-working}

```bash
# 检查 snapd 状态
systemctl status snapd

# 重启 snapd
systemctl restart snapd

# 检查 snap 路径
echo $PATH | grep snap

# 如果缺少，将 snap 添加到 PATH
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. 找不到 Docker Compose 命令 {#2-docker-compose-command-not-found}

```bash
# 检查可用的 docker compose 命令
command -v docker-compose
command -v docker

# 在脚本中使用适当的命令
if command -v docker-compose &> /dev/null; then
    echo "使用 docker-compose"
else
    echo "使用 docker compose"
fi
```
#### 3. 软件包安装问题 {#3-package-installation-issues}

```bash
# 更新软件包缓存
apt update

# 修复损坏的软件包
apt --fix-broken install

# 检查被锁定的软件包
apt-mark showhold
```

### 常见问题 {#common-issues}

#### 1. Docker 服务无法启动 {#1-docker-service-wont-start}

```bash
# 检查 Docker 状态
systemctl status docker

# 查看 Docker 日志
journalctl -u docker

# 尝试备用启动方式
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. 证书生成失败 {#2-certificate-generation-fails}

* 确保端口 80 和 443 可访问
* 验证 DNS 记录指向您的服务器
* 使用 `ufw status` 检查防火墙设置

#### 3. 邮件投递问题 {#3-email-delivery-issues}

* 验证 MX 记录是否正确
* 检查 SPF、DKIM 和 DMARC 记录
* 确保您的主机提供商未阻止端口 25

### 获取帮助 {#getting-help}

* **文档**: <https://forwardemail.net/self-hosted>
* **GitHub 问题**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian 文档**: <https://www.debian.org/doc/>


## 安全最佳实践 {#security-best-practices}

1. **保持系统更新**：定期更新 Debian 和软件包
2. **监控日志**：设置日志监控和告警
3. **定期备份**：测试备份和恢复流程
4. **使用强密码**：为所有账户生成强密码
5. **启用 Fail2Ban**：考虑安装 fail2ban 以增强安全
6. **定期安全审计**：定期检查您的配置
7. **监控 Snapd**：使用 `snap refresh` 保持 snap 软件包更新


## 结论 {#conclusion}

您的 Forward Email 自托管安装现在应该已完成并在 Debian 上运行。请记住：

1. 正确配置您的 DNS 记录
2. 测试邮件的发送和接收
3. 设置定期备份
4. 定期监控您的系统
5. 保持安装更新
6. 监控 snapd 和 snap 软件包

与 Ubuntu 的主要区别在于 snapd 的安装和 Docker 仓库的配置。一旦正确设置，这两个系统上的 Forward Email 应用表现完全相同。

有关更多配置选项和高级功能，请参阅官方 Forward Email 文档：<https://forwardemail.net/self-hosted#configuration>。
