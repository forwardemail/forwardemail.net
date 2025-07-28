# Hướng dẫn cài đặt tự lưu trữ Email chuyển tiếp cho Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}

## Mục lục {#table-of-contents}

* [Tổng quan](#overview)
* [Điều kiện tiên quyết](#prerequisites)
* [Yêu cầu hệ thống](#system-requirements)
* [Cài đặt từng bước](#step-by-step-installation)
  * [Bước 1: Thiết lập hệ thống ban đầu](#step-1-initial-system-setup)
  * [Bước 2: Cấu hình DNS Resolver](#step-2-configure-dns-resolvers)
  * [Bước 3: Cài đặt các phụ thuộc hệ thống](#step-3-install-system-dependencies)
  * [Bước 4: Cài đặt Snap Packages](#step-4-install-snap-packages)
  * [Bước 5: Cài đặt Docker](#step-5-install-docker)
  * [Bước 6: Cấu hình dịch vụ Docker](#step-6-configure-docker-service)
  * [Bước 7: Cấu hình Tường lửa](#step-7-configure-firewall)
  * [Bước 8: Sao chép kho lưu trữ email chuyển tiếp](#step-8-clone-forward-email-repository)
  * [Bước 9: Thiết lập cấu hình môi trường](#step-9-set-up-environment-configuration)
  * [Bước 10: Cấu hình tên miền của bạn](#step-10-configure-your-domain)
  * [Bước 11: Tạo chứng chỉ SSL](#step-11-generate-ssl-certificates)
  * [Bước 12: Tạo khóa mã hóa](#step-12-generate-encryption-keys)
  * [Bước 13: Cập nhật Đường dẫn SSL trong Cấu hình](#step-13-update-ssl-paths-in-configuration)
  * [Bước 14: Thiết lập Xác thực Cơ bản](#step-14-set-up-basic-authentication)
  * [Bước 15: Triển khai với Docker Compose](#step-15-deploy-with-docker-compose)
  * [Bước 16: Xác minh cài đặt](#step-16-verify-installation)
* [Cấu hình sau khi cài đặt](#post-installation-configuration)
  * [Thiết lập bản ghi DNS](#dns-records-setup)
  * [Đăng nhập lần đầu](#first-login)
* [Cấu hình sao lưu](#backup-configuration)
  * [Thiết lập sao lưu tương thích với S3](#set-up-s3-compatible-backup)
  * [Thiết lập công việc sao lưu Cron](#set-up-backup-cron-jobs)
* [Cấu hình tự động cập nhật](#auto-update-configuration)
* [Bảo trì và giám sát](#maintenance-and-monitoring)
  * [Vị trí nhật ký](#log-locations)
  * [Nhiệm vụ bảo trì thường xuyên](#regular-maintenance-tasks)
  * [Gia hạn chứng chỉ](#certificate-renewal)
* [Xử lý sự cố](#troubleshooting)
  * [Các vấn đề thường gặp](#common-issues)
  * [Nhận trợ giúp](#getting-help)
* [Thực hành bảo mật tốt nhất](#security-best-practices)
* [Phần kết luận](#conclusion)

## Tổng quan {#overview}

Hướng dẫn này cung cấp hướng dẫn từng bước để cài đặt giải pháp tự lưu trữ của Forward Email trên hệ thống Ubuntu. Hướng dẫn này được thiết kế riêng cho các phiên bản Ubuntu 20.04, 22.04 và 24.04 LTS.

## Điều kiện tiên quyết {#prerequisites}

Trước khi bắt đầu cài đặt, hãy đảm bảo bạn có:

* **Ubuntu Server**: 20.04, 22.04 hoặc 24.04 LTS
* **Quyền truy cập gốc**: Bạn phải có thể chạy lệnh dưới dạng gốc (quyền truy cập sudo)
* **Tên miền**: Một tên miền mà bạn kiểm soát bằng quyền truy cập quản lý DNS
* **Máy chủ sạch**: Nên sử dụng bản cài đặt Ubuntu mới
* **Kết nối Internet**: Cần thiết để tải xuống các gói và hình ảnh Docker

## Yêu cầu hệ thống {#system-requirements}

* **RAM**: Tối thiểu 2GB (khuyến nghị 4GB cho sản xuất)
* **Lưu trữ**: Tối thiểu 20GB dung lượng khả dụng (khuyến nghị 50GB+ cho sản xuất)
* **CPU**: Tối thiểu 1 vCPU (khuyến nghị 2+ vCPU cho sản xuất)
* **Mạng**: Địa chỉ IP công khai có thể truy cập các cổng sau:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Cài đặt từng bước {#step-by-step-installation}

### Bước 1: Thiết lập hệ thống ban đầu {#step-1-initial-system-setup}

Trước tiên, hãy đảm bảo hệ thống của bạn được cập nhật và chuyển sang người dùng root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Bước 2: Cấu hình Bộ giải quyết DNS {#step-2-configure-dns-resolvers}

Cấu hình hệ thống của bạn để sử dụng máy chủ DNS của Cloudflare nhằm tạo chứng chỉ đáng tin cậy:

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

### Bước 3: Cài đặt các phụ thuộc hệ thống {#step-3-install-system-dependencies}

Cài đặt các gói cần thiết cho Forward Email:

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

### Bước 4: Cài đặt các gói Snap {#step-4-install-snap-packages}

Cài đặt AWS CLI và Certbot thông qua snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Bước 5: Cài đặt Docker {#step-5-install-docker}

Cài đặt Docker CE và Docker Compose:

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

### Bước 6: Cấu hình dịch vụ Docker {#step-6-configure-docker-service}

Đảm bảo Docker tự động khởi động và đang chạy:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Nếu Docker không khởi động được, hãy thử khởi động thủ công:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Bước 7: Cấu hình Tường lửa {#step-7-configure-firewall}

Thiết lập tường lửa UFW để bảo vệ máy chủ của bạn:

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

### Bước 8: Sao chép kho lưu trữ email chuyển tiếp {#step-8-clone-forward-email-repository}

Tải xuống mã nguồn Chuyển tiếp Email:

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

### Bước 9: Thiết lập cấu hình môi trường {#step-9-set-up-environment-configuration}

Chuẩn bị cấu hình môi trường:

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

### Bước 10: Cấu hình tên miền của bạn {#step-10-configure-your-domain}

Đặt tên miền và cập nhật biến môi trường:

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

### Bước 11: Tạo chứng chỉ SSL {#step-11-generate-ssl-certificates}

#### Tùy chọn A: Thử thách DNS thủ công (Được khuyến nghị cho hầu hết người dùng) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Quan trọng**: Khi được nhắc, bạn sẽ cần tạo bản ghi TXT trong DNS của mình. Bạn có thể thấy nhiều thử thách cho cùng một tên miền - **hãy tạo TẤT CẢ các thử thách đó**. Không xóa bản ghi TXT đầu tiên khi thêm bản ghi thứ hai.

#### Tùy chọn B: Cloudflare DNS (Nếu bạn sử dụng Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Nếu tên miền của bạn sử dụng Cloudflare cho DNS, bạn có thể tự động tạo chứng chỉ:

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

#### Sao chép chứng chỉ {#copy-certificates}

Sau khi tạo chứng chỉ, hãy sao chép chúng vào thư mục ứng dụng:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Bước 12: Tạo khóa mã hóa {#step-12-generate-encryption-keys}

Tạo các khóa mã hóa khác nhau cần thiết cho hoạt động an toàn:

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

### Bước 13: Cập nhật Đường dẫn SSL trong Cấu hình {#step-13-update-ssl-paths-in-configuration}

Cấu hình đường dẫn chứng chỉ SSL trong tệp môi trường:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Bước 14: Thiết lập Xác thực Cơ bản {#step-14-set-up-basic-authentication}

Tạo thông tin xác thực cơ bản tạm thời:

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

### Bước 15: Triển khai với Docker Compose {#step-15-deploy-with-docker-compose}

Bắt đầu tất cả các dịch vụ Chuyển tiếp Email:

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

### Bước 16: Xác minh cài đặt {#step-16-verify-installation}

Kiểm tra xem tất cả các dịch vụ có đang chạy đúng không:

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

## Cấu hình sau khi cài đặt {#post-installation-configuration}

### Thiết lập bản ghi DNS {#dns-records-setup}

Bạn cần cấu hình các bản ghi DNS sau cho tên miền của mình:

#### Bản ghi MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Bản ghi A {#a-records}

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

#### Bản ghi SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Bản ghi DKIM {#dkim-record}

Nhận khóa công khai DKIM của bạn:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Tạo bản ghi DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Bản ghi DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Đăng nhập lần đầu {#first-login}

1. Mở trình duyệt web của bạn và điều hướng đến `https://yourdomain.com`
2. Nhập thông tin xác thực cơ bản mà bạn đã lưu trước đó
3. Hoàn tất trình hướng dẫn thiết lập ban đầu
4. Tạo tài khoản email đầu tiên của bạn

## Cấu hình sao lưu {#backup-configuration}

### Thiết lập sao lưu tương thích với S3 {#set-up-s3-compatible-backup}

Cấu hình sao lưu tự động vào bộ lưu trữ tương thích với S3:

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

### Thiết lập tác vụ sao lưu Cron {#set-up-backup-cron-jobs}

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

## Cấu hình tự động cập nhật {#auto-update-configuration}

Thiết lập cập nhật tự động cho cài đặt Forward Email của bạn:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```

## Bảo trì và Giám sát {#maintenance-and-monitoring}

### Vị trí nhật ký {#log-locations}

* **Nhật ký Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Nhật ký hệ thống**: `/var/log/syslog`
* **Nhật ký sao lưu**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Nhật ký tự động cập nhật**: `/var/log/autoupdate.log`

### Nhiệm vụ bảo trì thường xuyên {#regular-maintenance-tasks}

1. **Theo dõi dung lượng đĩa**: `df -h`
2. **Kiểm tra trạng thái dịch vụ**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Xem lại nhật ký**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Cập nhật các gói hệ thống**: `apt update && apt upgrade`
5. **Gia hạn chứng chỉ**: Chứng chỉ tự động gia hạn, nhưng theo dõi thời hạn hết hạn

### Gia hạn chứng chỉ {#certificate-renewal}

Chứng chỉ sẽ tự động gia hạn, nhưng bạn có thể gia hạn thủ công nếu cần:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```

## Khắc phục sự cố {#troubleshooting}

### Các vấn đề thường gặp {#common-issues}

#### 1. Dịch vụ Docker không khởi động được {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Việc tạo chứng chỉ không thành công {#2-certificate-generation-fails}

* Đảm bảo cổng 80 và 443 có thể truy cập được
* Xác minh bản ghi DNS trỏ đến máy chủ của bạn
* Kiểm tra cài đặt tường lửa

#### 3. Sự cố gửi email {#3-email-delivery-issues}

* Xác minh bản ghi MX là chính xác
* Kiểm tra bản ghi SPF, DKIM và DMARC
* Đảm bảo cổng 25 không bị nhà cung cấp dịch vụ lưu trữ của bạn chặn

#### 4. Giao diện web không thể truy cập được {#4-web-interface-not-accessible}

* Kiểm tra cài đặt tường lửa: `ufw status`
* Xác minh chứng chỉ SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Kiểm tra thông tin xác thực cơ bản

### Nhận trợ giúp {#getting-help}

* **Tài liệu**: <https://forwardemail.net/self-hosted>
* **Vấn đề GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Hỗ trợ cộng đồng**: Xem các thảo luận của dự án trên GitHub

## Thực hành bảo mật tốt nhất {#security-best-practices}

1. **Luôn cập nhật hệ thống**: Cập nhật Ubuntu và các gói thường xuyên
2. **Theo dõi nhật ký**: Thiết lập theo dõi nhật ký và cảnh báo
3. **Sao lưu thường xuyên**: Kiểm tra quy trình sao lưu và khôi phục
4. **Sử dụng mật khẩu mạnh**: Tạo mật khẩu mạnh cho tất cả các tài khoản
5. **Bật Fail2Ban**: Cân nhắc cài đặt fail2ban để tăng cường bảo mật
6. **Kiểm tra bảo mật thường xuyên**: Xem xét cấu hình của bạn theo định kỳ

## Kết luận {#conclusion}

Cài đặt tự lưu trữ Forward Email của bạn hiện đã hoàn tất và đang chạy trên Ubuntu. Hãy nhớ:

1. Cấu hình bản ghi DNS của bạn đúng cách
2. Kiểm tra việc gửi và nhận email
3. Thiết lập sao lưu thường xuyên
4. Theo dõi hệ thống của bạn thường xuyên
5. Giữ cho cài đặt của bạn được cập nhật

Để biết thêm các tùy chọn cấu hình và tính năng nâng cao, hãy tham khảo tài liệu chính thức về Chuyển tiếp Email tại <https://forwardemail.net/self-hosted#configuration>.