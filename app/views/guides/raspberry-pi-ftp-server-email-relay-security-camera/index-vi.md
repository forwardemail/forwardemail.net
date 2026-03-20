# Biến Raspberry Pi của Bạn Thành Máy Chủ FTP An Toàn với Chuyển Tiếp Email {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Bạn có một chiếc Raspberry Pi đang để không? Dù đó là Pi 5 mới nhất, Pi 4, Pi Zero, hay thậm chí là một mẫu cũ hơn, hướng dẫn này sẽ chỉ cho bạn cách biến nó thành một máy chủ tập tin mạnh mẽ, tự động với khả năng chuyển tiếp email. Hoàn hảo cho camera an ninh, thiết bị IoT, và nhiều hơn nữa.

**Tương thích với:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, và Raspberry Pi Zero.

> \[!NOTE]
> Hướng dẫn này đã được thử nghiệm và xác minh trên Raspberry Pi 3 Model B chạy Ubuntu Server 22.04 LTS.


## Mục Lục {#table-of-contents}

* [Chúng Ta Đang Xây Dựng Gì](#what-were-building)
* [Phần 1: Cài Đặt Ubuntu Server trên Pi của Bạn](#part-1-getting-ubuntu-server-on-your-pi)
  * [Những Gì Bạn Cần](#what-youll-need)
  * [Ghi Hệ Điều Hành](#flashing-the-os)
  * [Khởi Động & Kết Nối](#booting-up--connecting)
* [Phần 2: Thiết Lập Máy Chủ FTP An Toàn](#part-2-setting-up-a-secure-ftp-server)
  * [Cài Đặt & Cấu Hình](#installation--configuration)
  * [Tạo Người Dùng FTP](#creating-an-ftp-user)
* [Phần 3: Tường Lửa và Bảo Vệ Chống Tấn Công Brute-Force](#part-3-firewall-and-brute-force-protection)
  * [Thiết Lập UFW](#setting-up-ufw)
  * [Thiết Lập Fail2ban](#setting-up-fail2ban)
* [Phần 4: Xử Lý Tập Tin Tự Động với Thông Báo Email](#part-4-automated-file-processing-with-email-notifications)
  * [Lựa Chọn 1: Sử Dụng Forward Email API (Khuyến nghị)](#option-1-using-forward-email-api-recommended)
  * [Lựa Chọn 2: Sử Dụng Nhà Cung Cấp Email Khác](#option-2-using-other-email-providers)
  * [Tạo Dịch Vụ Systemd](#create-a-systemd-service)
* [Phần 5: Tùy Chọn Email cho Thiết Bị Cũ](#part-5-email-options-for-legacy-devices)
  * [Lựa Chọn 1: Dùng Cổng TLS 1.0 Cũ của Forward Email (Khuyến nghị)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Lựa Chọn 2: Thiết Lập Relay SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Khắc Phục Sự Cố](#troubleshooting)
* [Kết Luận](#wrapping-up)


## Chúng Ta Đang Xây Dựng Gì {#what-were-building}

Hướng dẫn này sẽ dẫn bạn qua việc thiết lập một hệ thống hoàn chỉnh bao gồm:

* **Ubuntu Server 22.04 LTS:** Một hệ điều hành nhẹ, ổn định cho Pi.
* **Máy Chủ FTP An Toàn (vsftpd):** Để gửi tập tin một cách an toàn.
* **Tường Lửa (UFW) & Fail2ban:** Để ngăn chặn kẻ xấu.
* **Trình Xử Lý Tập Tin Tự Động:** Một script tự động lấy tập tin mới, gửi email kèm tập tin đính kèm, rồi dọn dẹp sau đó.
* **Tùy Chọn Email cho Thiết Bị Cũ:** Hai cách tiếp cận cho các thiết bị không hỗ trợ TLS hiện đại:
  * Dùng cổng TLS 1.0 cũ của Forward Email (dễ nhất)
  * Thiết lập relay SMTP Postfix (hoạt động với mọi nhà cung cấp email)

Sẵn sàng chưa? Bắt đầu thôi.


## Phần 1: Cài Đặt Ubuntu Server trên Pi của Bạn {#part-1-getting-ubuntu-server-on-your-pi}

Trước tiên, hãy cài Ubuntu Server chạy trên Raspberry Pi. Việc này khá dễ dàng nhờ Raspberry Pi Imager.

### Những Gì Bạn Cần {#what-youll-need}

* Bất kỳ Raspberry Pi tương thích nào (xem danh sách ở trên)
* Thẻ microSD (tối thiểu 8GB, khuyến nghị 16GB trở lên)
* Máy tính có đầu đọc thẻ microSD
* Nguồn điện phù hợp với mẫu Pi của bạn
* Kết nối Internet (Ethernet hoặc Wi-Fi)

> \[!NOTE]
> Các mẫu cũ như Raspberry Pi 2 hoặc Pi Zero có thể chậm hơn nhưng vẫn hoạt động tốt cho thiết lập này.

### Ghi Hệ Điều Hành {#flashing-the-os}

1. **Tải Raspberry Pi Imager:** Tải về từ [trang chính thức](https://www.raspberrypi.com/software/).

2. **Chọn Hệ Điều Hành:** Trong imager, chọn "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Với các mẫu 64-bit (Pi 3, 4, 5, Zero 2 W), chọn **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Với các mẫu 32-bit cũ hơn (Pi 2, Pi Zero, Pi Zero W), chọn **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Chọn Bộ Nhớ:** Chọn thẻ microSD của bạn.

> \[!WARNING]
> Việc này sẽ xóa sạch thẻ microSD của bạn. Hãy chắc chắn bạn đã sao lưu mọi dữ liệu quan trọng.

4. **Tùy Chọn Nâng Cao là Người Bạn Của Bạn:** Nhấn vào biểu tượng bánh răng (⚙️) để thiết lập Pi chạy chế độ không đầu (không cần màn hình hay bàn phím).
   * **Hostname:** Đặt tên cho Pi của bạn (ví dụ: `pi-server`).
   * **SSH:** Bật SSH và đặt tên người dùng cùng mật khẩu.
   * **Wi-Fi:** Nếu không dùng Ethernet, nhập thông tin Wi-Fi của bạn.
   * **Locale:** Đặt múi giờ và bố cục bàn phím.
5. **Viết!** Nhấn nút "WRITE" và để trình tạo ảnh làm việc của nó.

### Khởi động & Kết nối {#booting-up--connecting}

Khi trình tạo ảnh hoàn tất, hãy cắm thẻ microSD vào Pi và cắm nguồn. Đợi vài phút để khởi động. Nó đang thực hiện một số thiết lập ban đầu ở nền. Tìm địa chỉ IP của nó từ trang quản trị router của bạn, sau đó kết nối qua SSH:

```bash
ssh your_username@your_pi_ip_address
```

Bạn đã vào! Raspberry Pi bây giờ đã sẵn sàng để cấu hình.


## Phần 2: Thiết lập Máy chủ FTP An toàn {#part-2-setting-up-a-secure-ftp-server}

Tiếp theo, thiết lập `vsftpd` (Very Secure FTP Daemon), được cấu hình để bảo mật tối đa.

### Cài đặt & Cấu hình {#installation--configuration}

1. **Cài đặt vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Sao lưu file cấu hình:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Chỉnh sửa cấu hình:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Nếu một dòng bị chú thích (bắt đầu bằng `#`), hãy bỏ chú thích bằng cách xóa `#`.

Thực hiện các thay đổi sau:

| Cài đặt                  | Giá trị | Mục đích                                                  |
| ------------------------ | ------- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`    | Vô hiệu hóa truy cập FTP ẩn danh                          |
| `local_enable`           | `YES`   | Cho phép người dùng địa phương đăng nhập                  |
| `write_enable`           | `YES`   | Cho phép tải lên tập tin                                  |
| `local_umask`            | `022`   | Đặt quyền tập tin (644 cho tập tin, 755 cho thư mục)      |
| `chroot_local_user`      | `YES`   | Giới hạn người dùng trong thư mục chính của họ            |
| `allow_writeable_chroot` | `YES`   | Cho phép tải lên trong môi trường chroot                   |

4. **Thêm dải cổng Passive:** Thêm các dòng này vào cuối file. Điều này cần thiết cho tường lửa.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Bật ghi nhật ký:** Thêm các dòng này để bật ghi nhật ký cho Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Lưu và Khởi động lại:** Nhấn `Ctrl+O`, `Enter`, `Ctrl+X`, sau đó khởi động lại dịch vụ:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Tạo Người dùng FTP {#creating-an-ftp-user}

Tạo một người dùng riêng biệt, bị giới hạn cho truy cập FTP.

1. **Tạo người dùng:**

   ```bash
   sudo adduser ftpuser
   ```

   Làm theo hướng dẫn để đặt mật khẩu. Các trường khác (tên, điện thoại, v.v.) có thể để trống.

2. **Tạo cấu trúc thư mục:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Thư mục FTP chính  
   * `/home/ftpuser/ftp/uploads` - Nơi các tập tin sẽ được tải lên

3. **Đặt quyền:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Phần 3: Tường lửa và Bảo vệ Chống Tấn công Brute-Force {#part-3-firewall-and-brute-force-protection}

Bảo mật Pi với UFW (Uncomplicated Firewall) và Fail2ban.

### Thiết lập UFW {#setting-up-ufw}

1. **Cài đặt UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Đặt chính sách mặc định:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Cho phép SSH (rất quan trọng!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Luôn cho phép SSH trước khi bật tường lửa, nếu không bạn sẽ bị khóa truy cập!

4. **Cho phép các cổng FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Bật tường lửa:**

   ```bash
   sudo ufw enable
   ```

### Thiết lập Fail2ban {#setting-up-fail2ban}

Fail2ban tự động chặn các địa chỉ IP sau nhiều lần đăng nhập thất bại.

1. **Cài đặt Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Tạo cấu hình cục bộ:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Thêm các cấu hình sau:**
   ```ini
   [DEFAULT]
   bantime = 3600
   findtime = 600
   maxretry = 5

   [sshd]
   enabled = true
   port = ssh
   logpath = /var/log/auth.log

   [vsftpd]
   enabled = true
   port = ftp,ftp-data,40000:50000
   logpath = /var/log/vsftpd.log
   maxretry = 3
   ```

4. **Restart Fail2ban:**

   ```bash
   sudo systemctl restart fail2ban
   ```


## Part 4: Automated File Processing with Email Notifications {#part-4-automated-file-processing-with-email-notifications}

Now for the magic: a script that monitors the FTP folder, emails new files as attachments, and deletes them. There are two approaches depending on your email provider:

### Option 1: Using Forward Email API (Recommended) {#option-1-using-forward-email-api-recommended}

If you have a Forward Email account, use the Email API for the most reliable delivery.

#### Get Your API Key {#get-your-api-key}

1. Log in to [Forward Email](https://forwardemail.net)
2. Navigate to [My Account → Security](https://forwardemail.net/my-account/security)
3. Scroll down to the **"Developer Access"** section at the bottom
4. Copy your API key

> \[!WARNING]
> Keep your API key private at all times. Never share it publicly or commit it to version control.

> \[!NOTE]
> The Enhanced Protection plan ($3/month) or higher is required for API access.

#### Install inotify-tools {#install-inotify-tools}

```bash
sudo apt install inotify-tools -y
```

#### Create the Monitoring Script {#create-the-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="noreply@yourdomain.com"
TO_EMAIL="your-email@example.com"
API_KEY="your_forward_email_api_key"  # Replace with your actual API key

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Base64 encode the file
    FILE_CONTENT=$(base64 -w 0 "$FILEPATH")

    # Send email with attachment via Forward Email API
    RESPONSE=$(curl -X POST https://api.forwardemail.net/v1/emails \
      -u "$API_KEY:" \
      -H "Content-Type: application/json" \
      -d '{
        "from": "'"$FROM_EMAIL"'",
        "to": "'"$TO_EMAIL"'",
        "subject": "'"$SUBJECT"'",
        "text": "New file uploaded: '"$FILENAME"'",
        "attachments": [
          {
            "filename": "'"$FILENAME"'",
            "content": "'"$FILE_CONTENT"'",
            "encoding": "base64"
          }
        ]
      }')

    # Check if email was sent successfully
    if echo "$RESPONSE" | grep -q '"statusCode":200'; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
        echo "Response: $RESPONSE"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Option 2: Using Other Email Providers {#option-2-using-other-email-providers}

If you prefer to use Gmail, Outlook, Yahoo, or another provider, modify the script to use `sendmail` or `msmtp` instead of the Forward Email API.

#### Install msmtp {#install-msmtp}

```bash
sudo apt install msmtp msmtp-mta -y
```

#### Configure msmtp {#configure-msmtp}

Create the configuration file:

```bash
sudo nano /etc/msmtprc
```

Add your provider's settings (example for Gmail):

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        gmail
host           smtp.gmail.com
port           587
from           your-email@gmail.com
user           your-email@gmail.com
password       your-app-password

account default : gmail
```

Secure the file:

```bash
sudo chmod 600 /etc/msmtprc
```

#### Create the Alternative Monitoring Script {#create-the-alternative-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="your-email@gmail.com"
TO_EMAIL="recipient@example.com"

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Send email with attachment using msmtp
    (
        echo "To: $TO_EMAIL"
        echo "From: $FROM_EMAIL"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: multipart/mixed; boundary=\"BOUNDARY\""
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: text/plain; charset=utf-8"
        echo ""
        echo "New file uploaded: $FILENAME"
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: application/octet-stream; name=\"$FILENAME\""
        echo "Content-Transfer-Encoding: base64"
        echo "Content-Disposition: attachment; filename=\"$FILENAME\""
        echo ""
        base64 "$FILEPATH"
        echo ""
        echo "--BOUNDARY--"
    ) | msmtp -t

    # Check if email was sent successfully
    if [ $? -eq 0 ]; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
    fi
done
```

Làm cho nó có thể thực thi:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Tạo một dịch vụ Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Thêm nội dung này:

```ini
[Unit]
Description=FTP Upload Monitor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Kích hoạt và khởi động dịch vụ:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Kiểm tra trạng thái:

```bash
sudo systemctl status ftp-monitor.service
```


## Phần 5: Tùy chọn Email cho các Thiết bị Cũ {#part-5-email-options-for-legacy-devices}

Các thiết bị như camera FOSSCAM thường không hỗ trợ các phiên bản TLS hiện đại. Có hai giải pháp:

### Lựa chọn 1: Sử dụng các cổng TLS 1.0 cũ của Forward Email (Khuyến nghị) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Nếu bạn đang sử dụng Forward Email, đây là giải pháp dễ nhất. Forward Email cung cấp các cổng TLS 1.0 cũ dành riêng cho các thiết bị cũ như camera, máy in, máy quét và máy fax.

#### Bảng giá {#pricing}

Forward Email cung cấp một số gói:

| Gói                     | Giá          | Tính năng                              |
| ----------------------- | ------------ | ------------------------------------- |
| Miễn phí                | $0/tháng     | Chuyển tiếp email chỉ (không gửi)     |
| **Bảo vệ Nâng cao**     | **$3/tháng** | **Truy cập SMTP + cổng TLS 1.0 cũ**  |
| Nhóm                    | $9/tháng     | Bảo vệ nâng cao + tính năng nhóm      |
| Doanh nghiệp            | $250/tháng   | Nhóm + yêu cầu API không giới hạn      |

> \[!IMPORTANT]
> Gói **Bảo vệ Nâng cao ($3/tháng)** hoặc cao hơn là bắt buộc để truy cập SMTP và hỗ trợ cổng TLS 1.0 cũ.

Tìm hiểu thêm tại [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Tạo Mật khẩu của bạn {#generate-your-password}

Trước khi cấu hình thiết bị, tạo mật khẩu trong Forward Email:

1. Đăng nhập vào [Forward Email](https://forwardemail.net)
2. Điều hướng đến **Tài khoản của tôi → Tên miền → \[Tên miền của bạn] → Bí danh**
3. Tạo hoặc chọn một bí danh (ví dụ: `camera@yourdomain.com`)
4. Nhấn **"Generate Password"** bên cạnh bí danh
5. Sao chép mật khẩu được tạo - bạn sẽ dùng nó để xác thực SMTP

> \[!TIP]
> Mỗi bí danh có thể có mật khẩu riêng. Điều này hữu ích để theo dõi thiết bị nào đã gửi email nào.

#### Cấu hình Thiết bị của bạn {#configure-your-device}

Sử dụng các thiết lập này trong camera, máy in, máy quét hoặc thiết bị cũ khác:

| Cài đặt         | Giá trị                                         |
| --------------- | ----------------------------------------------- |
| Máy chủ SMTP    | `smtp.forwardemail.net`                         |
| Cổng (SSL/TLS)  | `2455`                                          |
| Cổng (STARTTLS) | `2555` (thay thế)                               |
| Tên đăng nhập   | Email bí danh của bạn (ví dụ: `camera@yourdomain.com`) |
| Mật khẩu        | Mật khẩu từ "Generate Password"                 |
| Xác thực        | Bắt buộc                                        |
| Mã hóa          | SSL/TLS (khuyến nghị) hoặc STARTTLS             |

> \[!WARNING]
> Các cổng này sử dụng giao thức TLS 1.0 đã lỗi thời và có các lỗ hổng bảo mật đã biết (BEAST, POODLE). Chỉ sử dụng nếu thiết bị của bạn không hỗ trợ TLS 1.2+ hiện đại.

Chỉ cần cấu hình thiết bị với các thiết lập này và nó sẽ gửi email trực tiếp qua Forward Email mà không cần máy chủ chuyển tiếp cục bộ.

Để biết thêm chi tiết, xem [Câu hỏi thường gặp về Hỗ trợ TLS Cũ của Forward Email](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Lựa chọn 2: Thiết lập một máy chủ chuyển tiếp SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Nếu bạn không sử dụng Forward Email hoặc muốn giải pháp chuyển tiếp cục bộ, hãy thiết lập Postfix trên Raspberry Pi để làm trung gian. Điều này hoạt động với bất kỳ nhà cung cấp email nào (Gmail, Outlook, Yahoo, AOL, v.v.).

#### Cài đặt Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Trong quá trình cài đặt:

* Chọn **"Internet Site"**
* Nhập hostname của Pi của bạn (ví dụ, `raspberrypi-ftp`) cho "System mail name"

#### Chọn Nhà Cung Cấp Email Của Bạn {#choose-your-email-provider}

| Nhà Cung Cấp | Máy chủ SMTP           | Cổng | Cần Mật Khẩu Ứng Dụng? |
| ------------ | --------------------- | ---- | ----------------------- |
| Gmail        | smtp.gmail.com        | 587  | Có                      |
| Outlook      | smtp-mail.outlook.com | 587  | Có                      |
| Yahoo        | smtp.mail.yahoo.com   | 465  | Có                      |
| AOL          | smtp.aol.com          | 587  | Có                      |

#### Lấy Mật Khẩu Ứng Dụng Riêng {#get-an-app-specific-password}

Hầu hết các nhà cung cấp yêu cầu mật khẩu ứng dụng cho các ứng dụng bên thứ ba. Tạo một mật khẩu từ cài đặt bảo mật của nhà cung cấp email của bạn:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Không bao giờ sử dụng mật khẩu email thông thường của bạn. Luôn sử dụng mật khẩu ứng dụng riêng.

#### Cấu Hình Xác Thực SASL {#configure-sasl-authentication}

Tạo file mật khẩu cho nhà cung cấp bạn chọn. Ví dụ này dùng Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Thêm dòng này (điều chỉnh máy chủ và cổng cho nhà cung cấp của bạn):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Với Gmail, dùng:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Bảo mật và băm file:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Cấu Hình Bản Đồ Địa Chỉ Email {#configure-email-address-mapping}

Viết lại địa chỉ email nội bộ để phù hợp với nhà cung cấp email của bạn:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Thêm dòng này (thay `HOSTNAME` bằng hostname của Pi và dùng email của bạn):

```
/.+@HOSTNAME/    your_email@provider.com
```

Ví dụ:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Bảo mật file:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Cấu Hình Các Thiết Lập Chính Của Postfix {#configure-postfix-main-settings}

Chỉnh sửa cấu hình chính:

```bash
sudo nano /etc/postfix/main.cf
```

Tìm và cập nhật relay host (hoặc thêm vào cuối file):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Thêm các thiết lập này vào cuối file:

```
# Cấu hình SMTP Relay
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Thiết lập mạng
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Với Gmail (cổng 587), đặt `smtp_tls_wrappermode = no` thay vì `yes`.

> \[!WARNING]
> Cập nhật `mynetworks` với phạm vi mạng thực tế của bạn. Chỉ thêm các mạng tin cậy - bất kỳ thiết bị nào trong các mạng này có thể chuyển tiếp mail mà không cần xác thực.

**Các phạm vi mạng phổ biến:**

| Phạm Vi Mạng     | Dải Địa Chỉ IP             |
| ---------------- | -------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Cập Nhật Tường Lửa và Khởi Động Lại {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Kiểm tra Postfix đang chạy:

```bash
sudo systemctl status postfix
```

#### Kiểm Tra Relay {#test-the-relay}

Gửi email thử:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Kiểm tra nhật ký:

```bash
sudo tail -f /var/log/mail.log
```

Tìm `status=sent` để xác nhận thành công.

#### Cấu Hình Thiết Bị Của Bạn {#configure-your-device-1}

Trong cài đặt camera hoặc thiết bị của bạn:
* **Máy chủ SMTP:** Địa chỉ IP của Pi của bạn (ví dụ, `192.168.1.100`)
* **Cổng SMTP:** `25`
* **Xác thực:** Không có
* **Mã hóa:** Không có (chỉ mạng nội bộ)


## Khắc phục sự cố {#troubleshooting}

Nếu gặp sự cố, hãy kiểm tra các tệp nhật ký sau:

**Máy chủ FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Giám sát tệp:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Thư Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Xem hàng đợi thư
```


## Kết thúc {#wrapping-up}

Raspberry Pi giờ đây là một hệ thống tự động hoàn chỉnh với tải lên tệp an toàn, thông báo email tự động kèm tệp đính kèm, và khả năng chuyển tiếp SMTP cho các thiết bị cũ. Dù sử dụng các cổng TLS kế thừa của Forward Email hay bộ chuyển tiếp Postfix cục bộ, các thiết bị cũ giờ đây có thể gửi email một cách đáng tin cậy qua các nhà cung cấp email hiện đại.
