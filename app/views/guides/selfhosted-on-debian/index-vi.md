# Hướng Dẫn Cài Đặt Forward Email Tự Lưu Trữ cho Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Mục Lục {#table-of-contents}

* [Tổng Quan](#overview)
* [Yêu Cầu Trước Khi Bắt Đầu](#prerequisites)
* [Yêu Cầu Hệ Thống](#system-requirements)
* [Cài Đặt Từng Bước](#step-by-step-installation)
  * [Bước 1: Thiết Lập Hệ Thống Ban Đầu](#step-1-initial-system-setup)
  * [Bước 2: Cấu Hình Bộ Giải Mã DNS](#step-2-configure-dns-resolvers)
  * [Bước 3: Cài Đặt Các Phụ Thuộc Hệ Thống](#step-3-install-system-dependencies)
  * [Bước 4: Cài Đặt và Cấu Hình Snapd](#step-4-install-and-configure-snapd)
  * [Bước 5: Cài Đặt Gói Snap](#step-5-install-snap-packages)
  * [Bước 6: Cài Đặt Docker](#step-6-install-docker)
  * [Bước 7: Cấu Hình Dịch Vụ Docker](#step-7-configure-docker-service)
  * [Bước 8: Cài Đặt và Cấu Hình Tường Lửa UFW](#step-8-install-and-configure-ufw-firewall)
  * [Bước 9: Sao Chép Kho Lưu Trữ Forward Email](#step-9-clone-forward-email-repository)
  * [Bước 10: Thiết Lập Cấu Hình Môi Trường](#step-10-set-up-environment-configuration)
  * [Bước 11: Cấu Hình Tên Miền Của Bạn](#step-11-configure-your-domain)
  * [Bước 12: Tạo Chứng Chỉ SSL](#step-12-generate-ssl-certificates)
  * [Bước 13: Tạo Khóa Mã Hóa](#step-13-generate-encryption-keys)
  * [Bước 14: Cập Nhật Đường Dẫn SSL Trong Cấu Hình](#step-14-update-ssl-paths-in-configuration)
  * [Bước 15: Thiết Lập Xác Thực Cơ Bản](#step-15-set-up-basic-authentication)
  * [Bước 16: Triển Khai Với Docker Compose](#step-16-deploy-with-docker-compose)
  * [Bước 17: Kiểm Tra Cài Đặt](#step-17-verify-installation)
* [Cấu Hình Sau Khi Cài Đặt](#post-installation-configuration)
  * [Thiết Lập Bản Ghi DNS](#dns-records-setup)
  * [Đăng Nhập Lần Đầu](#first-login)
* [Cấu Hình Sao Lưu](#backup-configuration)
  * [Thiết Lập Sao Lưu Tương Thích S3](#set-up-s3-compatible-backup)
  * [Thiết Lập Công Việc Cron Sao Lưu](#set-up-backup-cron-jobs)
* [Cấu Hình Tự Động Cập Nhật](#auto-update-configuration)
* [Lưu Ý Riêng Cho Debian](#debian-specific-considerations)
  * [Sự Khác Biệt Trong Quản Lý Gói](#package-management-differences)
  * [Quản Lý Dịch Vụ](#service-management)
  * [Cấu Hình Mạng](#network-configuration)
* [Bảo Trì và Giám Sát](#maintenance-and-monitoring)
  * [Vị Trí Nhật Ký](#log-locations)
  * [Các Nhiệm Vụ Bảo Trì Định Kỳ](#regular-maintenance-tasks)
  * [Gia Hạn Chứng Chỉ](#certificate-renewal)
* [Khắc Phục Sự Cố](#troubleshooting)
  * [Vấn Đề Riêng Cho Debian](#debian-specific-issues)
  * [Các Vấn Đề Thường Gặp](#common-issues)
  * [Nhận Trợ Giúp](#getting-help)
* [Thực Hành Bảo Mật Tốt Nhất](#security-best-practices)
* [Kết Luận](#conclusion)


## Tổng Quan {#overview}

Hướng dẫn này cung cấp các bước chi tiết để cài đặt giải pháp tự lưu trữ Forward Email trên hệ thống Debian. Hướng dẫn này được thiết kế riêng cho Debian 11 (Bullseye) và Debian 12 (Bookworm).


## Yêu Cầu Trước Khi Bắt Đầu {#prerequisites}

Trước khi bắt đầu cài đặt, hãy đảm bảo bạn có:

* **Máy chủ Debian**: Phiên bản 11 (Bullseye) hoặc 12 (Bookworm)
* **Quyền Root**: Bạn phải có khả năng chạy lệnh với quyền root (quyền sudo)
* **Tên Miền**: Một tên miền bạn kiểm soát với quyền quản lý DNS
* **Máy Chủ Sạch**: Khuyến nghị sử dụng cài đặt Debian mới
* **Kết Nối Internet**: Cần thiết để tải các gói và hình ảnh Docker


## Yêu Cầu Hệ Thống {#system-requirements}

* **RAM**: Tối thiểu 2GB (Khuyến nghị 4GB cho môi trường sản xuất)
* **Bộ Nhớ Lưu Trữ**: Tối thiểu 20GB dung lượng trống (Khuyến nghị 50GB+ cho môi trường sản xuất)
* **CPU**: Tối thiểu 1 vCPU (Khuyến nghị 2+ vCPU cho môi trường sản xuất)
* **Mạng**: Địa chỉ IP công khai với các cổng sau được mở:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Cài Đặt Từng Bước {#step-by-step-installation}

### Bước 1: Thiết Lập Hệ Thống Ban Đầu {#step-1-initial-system-setup}

Trước tiên, hãy đảm bảo hệ thống của bạn được cập nhật và chuyển sang người dùng root:

```bash
# Cập nhật các gói hệ thống
sudo apt update && sudo apt upgrade -y

# Chuyển sang người dùng root (bắt buộc cho việc cài đặt)
sudo su -
```
### Bước 2: Cấu hình Bộ phân giải DNS {#step-2-configure-dns-resolvers}

Cấu hình hệ thống của bạn để sử dụng các máy chủ DNS của Cloudflare nhằm tạo chứng chỉ đáng tin cậy:

```bash
# Dừng và vô hiệu hóa systemd-resolved nếu đang chạy
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Cấu hình bộ phân giải DNS của Cloudflare
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

Cài đặt các gói cần thiết cho Forward Email trên Debian:

```bash
# Cập nhật danh sách gói
apt-get update -y

# Cài đặt các phụ thuộc cơ bản (danh sách gói dành riêng cho Debian)
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

### Bước 4: Cài đặt và cấu hình Snapd {#step-4-install-and-configure-snapd}

Debian không bao gồm snapd mặc định, vì vậy chúng ta cần cài đặt và cấu hình nó:

```bash
# Cài đặt snapd
apt-get install -y snapd

# Kích hoạt và khởi động dịch vụ snapd
systemctl enable snapd
systemctl start snapd

# Tạo liên kết tượng trưng để snap hoạt động đúng
ln -sf /var/lib/snapd/snap /snap

# Chờ snapd sẵn sàng
sleep 10

# Kiểm tra snapd hoạt động
snap version
```

### Bước 5: Cài đặt các gói Snap {#step-5-install-snap-packages}

Cài đặt AWS CLI và Certbot qua snap:

```bash
# Cài đặt AWS CLI
snap install aws-cli --classic

# Cài đặt Certbot và plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Kiểm tra các cài đặt
aws --version
certbot --version
```

### Bước 6: Cài đặt Docker {#step-6-install-docker}

Cài đặt Docker CE và Docker Compose trên Debian:

```bash
# Thêm khóa GPG chính thức của Docker (dành riêng cho Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Thêm kho Docker (dành riêng cho Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Cập nhật chỉ mục gói và cài đặt Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Cài đặt docker-compose độc lập làm phương án dự phòng (nếu plugin không hoạt động)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Kiểm tra cài đặt Docker
docker --version
docker compose version || docker-compose --version
```

### Bước 7: Cấu hình dịch vụ Docker {#step-7-configure-docker-service}

Đảm bảo Docker tự động khởi động và đang chạy:

```bash
# Kích hoạt và khởi động dịch vụ Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Kiểm tra Docker đang chạy
docker info
```

Nếu Docker không khởi động được, thử khởi động thủ công:

```bash
# Phương pháp khởi động thay thế nếu systemctl thất bại
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Bước 8: Cài đặt và cấu hình tường lửa UFW {#step-8-install-and-configure-ufw-firewall}

Các bản cài đặt Debian tối giản có thể không bao gồm UFW, vì vậy hãy cài đặt trước:

```bash
# Cài đặt UFW nếu chưa có
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Thiết lập chính sách mặc định
ufw default deny incoming
ufw default allow outgoing

# Cho phép SSH (quan trọng - đừng khóa truy cập của bạn!)
ufw allow 22/tcp

# Cho phép các cổng liên quan đến email
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (cho Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (cổng thay thế)
ufw allow 2995/tcp  # POP3 (cổng thay thế)
ufw allow 3456/tcp  # Cổng dịch vụ tùy chỉnh
ufw allow 4000/tcp  # Cổng dịch vụ tùy chỉnh
ufw allow 5000/tcp  # Cổng dịch vụ tùy chỉnh

# Cho phép kết nối cơ sở dữ liệu cục bộ
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Kích hoạt tường lửa
echo "y" | ufw enable

# Kiểm tra trạng thái tường lửa
ufw status numbered
```
### Bước 9: Sao chép Kho Lưu trữ Forward Email {#step-9-clone-forward-email-repository}

Tải mã nguồn Forward Email:

```bash
# Thiết lập biến
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Sao chép kho lưu trữ
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Xác minh việc sao chép thành công
ls -la
```

### Bước 10: Thiết lập Cấu hình Môi trường {#step-10-set-up-environment-configuration}

Chuẩn bị cấu hình môi trường:

```bash
# Thiết lập biến thư mục
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Sao chép file môi trường mặc định
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Tạo thư mục SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Tạo các thư mục cơ sở dữ liệu
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Bước 11: Cấu hình Tên Miền của Bạn {#step-11-configure-your-domain}

Đặt tên miền của bạn và cập nhật các biến môi trường:

```bash
# Thay 'yourdomain.com' bằng tên miền thực tế của bạn
DOMAIN="yourdomain.com"

# Hàm cập nhật file môi trường
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Cập nhật các biến môi trường liên quan đến tên miền
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

### Bước 12: Tạo Chứng chỉ SSL {#step-12-generate-ssl-certificates}

#### Lựa chọn A: Thử thách DNS thủ công (Khuyến nghị cho hầu hết người dùng) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Tạo chứng chỉ sử dụng thử thách DNS thủ công
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Quan trọng**: Khi được yêu cầu, bạn cần tạo các bản ghi TXT trong DNS của bạn. Bạn có thể thấy nhiều thử thách cho cùng một tên miền - **hãy tạo TẤT CẢ chúng**. Không xóa bản ghi TXT đầu tiên khi thêm bản ghi thứ hai.

#### Lựa chọn B: DNS Cloudflare (Nếu bạn sử dụng Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Nếu tên miền của bạn sử dụng Cloudflare cho DNS, bạn có thể tự động hóa việc tạo chứng chỉ:

```bash
# Tạo file thông tin đăng nhập Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Đặt quyền truy cập phù hợp
chmod 600 /root/.cloudflare.ini

# Tạo chứng chỉ tự động
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Sao chép Chứng chỉ {#copy-certificates}

Sau khi tạo chứng chỉ, sao chép chúng vào thư mục ứng dụng:

```bash
# Sao chép chứng chỉ vào thư mục SSL của ứng dụng
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Xác minh chứng chỉ đã được sao chép
ls -la "$SELF_HOST_DIR/ssl/"
```

### Bước 13: Tạo Khóa Mã hóa {#step-13-generate-encryption-keys}

Tạo các khóa mã hóa cần thiết cho hoạt động an toàn:

```bash
# Tạo khóa mã hóa trợ giúp
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Tạo bí mật SRS cho chuyển tiếp email
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Tạo khóa mã hóa TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Tạo khóa riêng DKIM để ký email
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Tạo khóa ký webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Đặt mật khẩu truyền tải SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Tất cả các khóa mã hóa đã được tạo thành công"
```
### Bước 14: Cập nhật Đường dẫn SSL trong Cấu hình {#step-14-update-ssl-paths-in-configuration}

Cấu hình các đường dẫn chứng chỉ SSL trong file môi trường:

```bash
# Cập nhật đường dẫn SSL để trỏ đến các file chứng chỉ chính xác
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Bước 15: Thiết lập Xác thực Cơ bản {#step-15-set-up-basic-authentication}

Tạo thông tin xác thực cơ bản tạm thời:

```bash
# Tạo mật khẩu ngẫu nhiên an toàn
PASSWORD=$(openssl rand -base64 16)

# Cập nhật file môi trường với thông tin xác thực cơ bản
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Hiển thị thông tin đăng nhập (hãy lưu lại!)
echo ""
echo "🔐 QUAN TRỌNG: Lưu lại thông tin đăng nhập này!"
echo "=================================="
echo "Tên đăng nhập: admin"
echo "Mật khẩu: $PASSWORD"
echo "=================================="
echo ""
echo "Bạn sẽ cần những thông tin này để truy cập giao diện web sau khi cài đặt."
echo ""
```

### Bước 16: Triển khai với Docker Compose {#step-16-deploy-with-docker-compose}

Khởi động tất cả các dịch vụ Forward Email:

```bash
# Đặt đường dẫn file Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Dừng các container đang chạy nếu có
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Kéo các image mới nhất
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Khởi động tất cả dịch vụ ở chế độ nền
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Chờ một lúc để dịch vụ khởi động
sleep 10

# Kiểm tra trạng thái dịch vụ
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Bước 17: Xác minh Cài đặt {#step-17-verify-installation}

Kiểm tra tất cả dịch vụ đang chạy đúng:

```bash
# Kiểm tra các container Docker
docker ps

# Kiểm tra nhật ký dịch vụ để phát hiện lỗi
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Kiểm tra kết nối giao diện web
curl -I https://$DOMAIN

# Kiểm tra các cổng đang lắng nghe
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Cấu hình Sau khi Cài đặt {#post-installation-configuration}

### Thiết lập Bản ghi DNS {#dns-records-setup}

Bạn cần cấu hình các bản ghi DNS sau cho tên miền của bạn:

#### Bản ghi MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Các bản ghi A {#a-records}

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

Lấy khóa công khai DKIM của bạn:

```bash
# Trích xuất khóa công khai DKIM
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

### Đăng nhập Lần đầu {#first-login}

1. Mở trình duyệt web và truy cập `https://yourdomain.com`
2. Nhập thông tin xác thực cơ bản bạn đã lưu trước đó
3. Hoàn thành trình hướng dẫn thiết lập ban đầu
4. Tạo tài khoản email đầu tiên của bạn


## Cấu hình Sao lưu {#backup-configuration}

### Thiết lập Sao lưu Tương thích S3 {#set-up-s3-compatible-backup}

Cấu hình sao lưu tự động đến bộ nhớ tương thích S3:

```bash
# Tạo thư mục chứa thông tin đăng nhập AWS
mkdir -p ~/.aws

# Cấu hình thông tin đăng nhập AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Cấu hình thiết lập AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Đối với S3 không phải AWS (như Cloudflare R2), thêm URL endpoint
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Thiết Lập Công Việc Cron Sao Lưu {#set-up-backup-cron-jobs}

```bash
# Đặt quyền thực thi cho các script sao lưu
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Thêm công việc cron sao lưu MongoDB (chạy hàng ngày vào nửa đêm)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Thêm công việc cron sao lưu Redis (chạy hàng ngày vào nửa đêm)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Xác nhận các công việc cron đã được thêm
crontab -l
```


## Cấu Hình Tự Động Cập Nhật {#auto-update-configuration}

Thiết lập cập nhật tự động cho cài đặt Forward Email của bạn:

```bash
# Tạo lệnh tự động cập nhật (sử dụng lệnh docker compose phù hợp)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Thêm công việc cron tự động cập nhật (chạy hàng ngày lúc 1 giờ sáng)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Xác nhận công việc cron đã được thêm
crontab -l
```


## Những Lưu Ý Riêng Cho Debian {#debian-specific-considerations}

### Sự Khác Biệt Trong Quản Lý Gói {#package-management-differences}

* **Snapd**: Không được cài đặt mặc định trên Debian, cần cài đặt thủ công
* **Docker**: Sử dụng kho lưu trữ và khóa GPG riêng cho Debian
* **UFW**: Có thể không được bao gồm trong các bản cài đặt Debian tối giản
* **systemd**: Hành vi có thể hơi khác so với Ubuntu

### Quản Lý Dịch Vụ {#service-management}

```bash
# Kiểm tra trạng thái dịch vụ (lệnh riêng cho Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Khởi động lại dịch vụ nếu cần
systemctl restart snapd
systemctl restart docker
```

### Cấu Hình Mạng {#network-configuration}

Debian có thể có tên giao diện mạng hoặc cấu hình khác:

```bash
# Kiểm tra các giao diện mạng
ip addr show

# Kiểm tra định tuyến
ip route show

# Kiểm tra phân giải DNS
nslookup google.com
```


## Bảo Trì và Giám Sát {#maintenance-and-monitoring}

### Vị Trí Các File Log {#log-locations}

* **Log Docker Compose**: Sử dụng lệnh docker compose phù hợp với cài đặt
* **Log hệ thống**: `/var/log/syslog`
* **Log sao lưu**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Log tự động cập nhật**: `/var/log/autoupdate.log`
* **Log Snapd**: `journalctl -u snapd`

### Các Công Việc Bảo Trì Thường Xuyên {#regular-maintenance-tasks}

1. **Giám sát dung lượng đĩa**: `df -h`
2. **Kiểm tra trạng thái dịch vụ**: Sử dụng lệnh docker compose phù hợp
3. **Xem lại các log**: Kiểm tra cả log ứng dụng và hệ thống
4. **Cập nhật gói hệ thống**: `apt update && apt upgrade`
5. **Giám sát snapd**: `snap list` và `snap refresh`

### Gia Hạn Chứng Chỉ {#certificate-renewal}

Chứng chỉ nên được tự động gia hạn, nhưng bạn có thể gia hạn thủ công nếu cần:

```bash
# Gia hạn chứng chỉ thủ công
certbot renew

# Sao chép chứng chỉ đã gia hạn
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Khởi động lại dịch vụ để sử dụng chứng chỉ mới
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Xử Lý Sự Cố {#troubleshooting}

### Các Vấn Đề Riêng Cho Debian {#debian-specific-issues}

#### 1. Snapd Không Hoạt Động {#1-snapd-not-working}

```bash
# Kiểm tra trạng thái snapd
systemctl status snapd

# Khởi động lại snapd
systemctl restart snapd

# Kiểm tra biến PATH có chứa snap không
echo $PATH | grep snap

# Thêm snap vào PATH nếu thiếu
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Không Tìm Thấy Lệnh Docker Compose {#2-docker-compose-command-not-found}

```bash
# Kiểm tra lệnh docker compose nào có sẵn
command -v docker-compose
command -v docker

# Sử dụng lệnh phù hợp trong script
if command -v docker-compose &> /dev/null; then
    echo "Đang sử dụng docker-compose"
else
    echo "Đang sử dụng docker compose"
fi
```
#### 3. Vấn Đề Cài Đặt Gói {#3-package-installation-issues}

```bash
# Cập nhật bộ nhớ đệm gói
apt update

# Sửa các gói bị hỏng
apt --fix-broken install

# Kiểm tra các gói bị giữ
apt-mark showhold
```

### Các Vấn Đề Thường Gặp {#common-issues}

#### 1. Dịch Vụ Docker Không Khởi Động {#1-docker-service-wont-start}

```bash
# Kiểm tra trạng thái Docker
systemctl status docker

# Kiểm tra nhật ký Docker
journalctl -u docker

# Thử khởi động thay thế
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Lỗi Tạo Chứng Chỉ {#2-certificate-generation-fails}

* Đảm bảo các cổng 80 và 443 có thể truy cập được
* Xác minh các bản ghi DNS trỏ đến máy chủ của bạn
* Kiểm tra cài đặt tường lửa với `ufw status`

#### 3. Vấn Đề Gửi Email {#3-email-delivery-issues}

* Xác minh các bản ghi MX chính xác
* Kiểm tra các bản ghi SPF, DKIM và DMARC
* Đảm bảo cổng 25 không bị nhà cung cấp hosting chặn

### Nhận Trợ Giúp {#getting-help}

* **Tài liệu**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Tài liệu Debian**: <https://www.debian.org/doc/>


## Thực Hành Bảo Mật Tốt Nhất {#security-best-practices}

1. **Giữ Hệ Thống Cập Nhật**: Thường xuyên cập nhật Debian và các gói
2. **Giám Sát Nhật Ký**: Thiết lập giám sát và cảnh báo nhật ký
3. **Sao Lưu Định Kỳ**: Kiểm tra quy trình sao lưu và phục hồi
4. **Sử Dụng Mật Khẩu Mạnh**: Tạo mật khẩu mạnh cho tất cả tài khoản
5. **Kích Hoạt Fail2Ban**: Cân nhắc cài đặt fail2ban để tăng cường bảo mật
6. **Kiểm Tra Bảo Mật Định Kỳ**: Định kỳ xem xét cấu hình của bạn
7. **Giám Sát Snapd**: Giữ các gói snap được cập nhật với `snap refresh`


## Kết Luận {#conclusion}

Cài đặt Forward Email tự lưu trữ của bạn hiện đã hoàn tất và đang chạy trên Debian. Hãy nhớ:

1. Cấu hình các bản ghi DNS đúng cách
2. Kiểm tra gửi và nhận email
3. Thiết lập sao lưu định kỳ
4. Giám sát hệ thống thường xuyên
5. Giữ cho cài đặt luôn được cập nhật
6. Giám sát snapd và các gói snap

Sự khác biệt chính so với Ubuntu là việc cài đặt snapd và cấu hình kho Docker. Khi những phần này được thiết lập đúng, ứng dụng Forward Email hoạt động giống hệt trên cả hai hệ thống.

Để biết thêm các tùy chọn cấu hình và tính năng nâng cao, tham khảo tài liệu chính thức của Forward Email tại <https://forwardemail.net/self-hosted#configuration>.
