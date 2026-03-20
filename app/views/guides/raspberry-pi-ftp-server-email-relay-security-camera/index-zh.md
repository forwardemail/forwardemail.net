# 将您的树莓派变成带邮件中继的安全FTP服务器 {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

有一台闲置的树莓派吗？无论是最新的Pi 5、Pi 4、Pi Zero，还是更旧的型号，本指南将教您如何将其变成一个强大且自动化的文件服务器，并具备邮件中继功能。非常适合安全摄像头、物联网设备等。

**兼容型号：** Raspberry Pi 5、Raspberry Pi 4 Model B、Raspberry Pi 3 Model B+、Raspberry Pi 3 Model B、Raspberry Pi 2 Model B、Raspberry Pi Zero 2 W、Raspberry Pi Zero W 和 Raspberry Pi Zero。

> \[!NOTE]
> 本指南已在运行 Ubuntu Server 22.04 LTS 的 Raspberry Pi 3 Model B 上测试验证。


## 目录 {#table-of-contents}

* [我们要构建的内容](#what-were-building)
* [第1部分：在您的Pi上安装Ubuntu Server](#part-1-getting-ubuntu-server-on-your-pi)
  * [您需要准备的东西](#what-youll-need)
  * [刷写操作系统](#flashing-the-os)
  * [启动与连接](#booting-up--connecting)
* [第2部分：设置安全FTP服务器](#part-2-setting-up-a-secure-ftp-server)
  * [安装与配置](#installation--configuration)
  * [创建FTP用户](#creating-an-ftp-user)
* [第3部分：防火墙和暴力破解防护](#part-3-firewall-and-brute-force-protection)
  * [设置UFW](#setting-up-ufw)
  * [设置Fail2ban](#setting-up-fail2ban)
* [第4部分：自动文件处理与邮件通知](#part-4-automated-file-processing-with-email-notifications)
  * [选项1：使用 Forward Email API（推荐）](#option-1-using-forward-email-api-recommended)
  * [选项2：使用其他邮件服务提供商](#option-2-using-other-email-providers)
  * [创建Systemd服务](#create-a-systemd-service)
* [第5部分：旧设备的邮件选项](#part-5-email-options-for-legacy-devices)
  * [选项1：使用 Forward Email 的旧版 TLS 1.0 端口（推荐）](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [选项2：设置Postfix SMTP中继](#option-2-set-up-a-postfix-smtp-relay)
* [故障排除](#troubleshooting)
* [总结](#wrapping-up)


## 我们要构建的内容 {#what-were-building}

本指南将引导您搭建一个完整系统，包括：

* **Ubuntu Server 22.04 LTS：** 适合树莓派的稳定轻量级操作系统。
* **安全FTP服务器（vsftpd）：** 用于安全地上传文件。
* **防火墙（UFW）和Fail2ban：** 防止恶意攻击。
* **自动文件处理器：** 脚本自动抓取新文件，将其作为附件发送邮件，然后自动清理。
* **旧设备的邮件选项：** 两种适用于不支持现代TLS的设备的方案：
  * 使用 Forward Email 的旧版 TLS 1.0 端口（最简单）
  * 设置 Postfix SMTP 中继（适用于任何邮件服务提供商）

准备好了吗？我们开始吧。


## 第1部分：在您的Pi上安装Ubuntu Server {#part-1-getting-ubuntu-server-on-your-pi}

首先，让树莓派运行Ubuntu Server。借助树莓派官方Imager，这一步非常简单。

### 您需要准备的东西 {#what-youll-need}

* 任何兼容的树莓派（见上方列表）
* 一张microSD卡（至少8GB，推荐16GB及以上）
* 带microSD卡读卡器的电脑
* 适合您Pi型号的电源适配器
* 网络连接（以太网或Wi-Fi）

> \[!NOTE]
> 较旧型号如 Raspberry Pi 2 或 Pi Zero 速度可能较慢，但完全可以满足本教程需求。

### 刷写操作系统 {#flashing-the-os}

1. **获取树莓派Imager：** 从[官方网站](https://www.raspberrypi.com/software/)下载。

2. **选择操作系统：** 在Imager中选择“CHOOSE OS” > “Other general-purpose OS” > “Ubuntu”。
   * 对于64位型号（Pi 3、4、5、Zero 2 W），选择 **“Ubuntu Server 22.04.1 LTS (64-bit)”**。
   * 对于较旧的32位型号（Pi 2、Pi Zero、Pi Zero W），选择 **“Ubuntu Server 22.04.1 LTS (32-bit)”**。

3. **选择存储设备：** 选择您的microSD卡。

> \[!WARNING]
> 这将清空您的microSD卡。请确保已备份重要数据。

4. **高级选项帮大忙：** 点击齿轮图标（⚙️）设置Pi为无头模式（无需显示器和键盘）。
   * **主机名：** 给您的Pi起个名字（例如 `pi-server`）。
   * **SSH：** 启用并设置用户名和密码。
   * **Wi-Fi：** 如果不使用以太网，输入Wi-Fi信息。
   * **区域设置：** 设置时区和键盘布局。
5. **写入！** 点击“WRITE”按钮，让镜像程序开始工作。

### 启动与连接 {#booting-up--connecting}

镜像写入完成后，将 microSD 卡插入树莓派并接通电源。等待几分钟让它启动。它正在后台进行一些初始设置。从路由器的管理页面找到它的 IP 地址，然后通过 SSH 连接：

```bash
ssh your_username@your_pi_ip_address
```

你已进入系统！树莓派现在可以进行配置了。


## 第二部分：设置安全的 FTP 服务器 {#part-2-setting-up-a-secure-ftp-server}

接下来，设置 `vsftpd`（非常安全的 FTP 守护进程），配置为最高安全级别。

### 安装与配置 {#installation--configuration}

1. **安装 vsftpd：**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **备份配置文件：**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **编辑配置文件：**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> 如果某行被注释（以 `#` 开头），请去掉 `#` 取消注释。

进行如下修改：

| 设置                     | 值    | 作用                                                     |
| ------------------------ | ----- | -------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | 禁止匿名 FTP 访问                                        |
| `local_enable`           | `YES` | 允许本地用户登录                                         |
| `write_enable`           | `YES` | 启用文件上传                                             |
| `local_umask`            | `022` | 设置文件权限（文件为 644，目录为 755）                   |
| `chroot_local_user`      | `YES` | 将用户限制在其主目录内                                   |
| `allow_writeable_chroot` | `YES` | 允许在 chroot 环境中上传文件                             |

4. **添加被动端口范围：** 在文件末尾添加以下内容。此设置用于防火墙。

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **启用日志记录：** 添加以下内容以启用 Fail2ban 的日志功能。

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **保存并重启服务：** 按 `Ctrl+O`，回车，`Ctrl+X`，然后重启服务：

   ```bash
   sudo systemctl restart vsftpd
   ```

### 创建 FTP 用户 {#creating-an-ftp-user}

创建一个专用且受限的用户用于 FTP 访问。

1. **创建用户：**

   ```bash
   sudo adduser ftpuser
   ```

   按提示设置密码。其他字段（姓名、电话等）可以留空。

2. **创建目录结构：**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - 主要 FTP 目录
   * `/home/ftpuser/ftp/uploads` - 文件上传目录

3. **设置权限：**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## 第三部分：防火墙与暴力破解防护 {#part-3-firewall-and-brute-force-protection}

使用 UFW（简单防火墙）和 Fail2ban 保护树莓派安全。

### 设置 UFW {#setting-up-ufw}

1. **安装 UFW：**

   ```bash
   sudo apt install ufw -y
   ```

2. **设置默认策略：**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **允许 SSH（关键！）：**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> 启用防火墙前务必允许 SSH，否则你会被锁在外面！

4. **允许 FTP 端口：**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **启用防火墙：**

   ```bash
   sudo ufw enable
   ```

### 设置 Fail2ban {#setting-up-fail2ban}

Fail2ban 会在多次登录失败后自动封锁 IP 地址。

1. **安装 Fail2ban：**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **创建本地配置文件：**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **添加以下配置：**
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

使其可执行：

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### 创建 Systemd 服务 {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

添加以下内容：

```ini
[Unit]
Description=FTP 上传监控
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启用并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

检查状态：

```bash
sudo systemctl status ftp-monitor.service
```


## 第5部分：旧设备的电子邮件选项 {#part-5-email-options-for-legacy-devices}

像 FOSSCAM 摄像头这样的设备通常不支持现代 TLS 版本。有两种解决方案：

### 选项1：使用 Forward Email 的旧版 TLS 1.0 端口（推荐） {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

如果您使用 Forward Email，这是最简单的解决方案。Forward Email 提供专门针对旧设备（如摄像头、打印机、扫描仪和传真机）的旧版 TLS 1.0 端口。

#### 价格 {#pricing}

Forward Email 提供多个套餐：

| 套餐                    | 价格         | 功能                                   |
| ----------------------- | ------------ | -------------------------------------- |
| 免费                    | $0/月        | 仅邮件转发（不支持发送）               |
| **增强保护**            | **$3/月**    | **SMTP 访问 + 旧版 TLS 1.0 端口**       |
| 团队                    | $9/月        | 增强功能 + 团队功能                     |
| 企业                    | $250/月      | 团队功能 + 无限 API 请求                 |

> \[!IMPORTANT]
> 需要 **增强保护套餐（$3/月）** 或更高级别套餐才能使用 SMTP 访问和旧版 TLS 1.0 端口支持。

了解更多请访问 [Forward Email Pricing](https://forwardemail.net/en/pricing)。

#### 生成您的密码 {#generate-your-password}

在配置设备之前，请在 Forward Email 中生成密码：

1. 登录 [Forward Email](https://forwardemail.net)
2. 进入 **我的账户 → 域名 → \[您的域名] → 别名**
3. 创建或选择一个别名（例如 `camera@yourdomain.com`）
4. 点击别名旁的 **“生成密码”**
5. 复制生成的密码 — 您将在 SMTP 认证时使用它

> \[!TIP]
> 每个别名可以有自己的密码。这有助于跟踪哪个设备发送了邮件。

#### 配置您的设备 {#configure-your-device}

在您的摄像头、打印机、扫描仪或其他旧设备中使用以下设置：

| 设置           | 值                                               |
| -------------- | ------------------------------------------------ |
| SMTP 服务器    | `smtp.forwardemail.net`                          |
| 端口（SSL/TLS）| `2455`                                           |
| 端口（STARTTLS）| `2555`（备用）                                  |
| 用户名         | 您的别名邮箱（例如 `camera@yourdomain.com`）    |
| 密码           | “生成密码”中获得的密码                           |
| 认证           | 必须                                            |
| 加密           | SSL/TLS（推荐）或 STARTTLS                        |

> \[!WARNING]
> 这些端口使用已废弃的 TLS 1.0 协议，存在已知安全漏洞（BEAST、POODLE）。仅当您的设备无法支持现代 TLS 1.2+ 时使用。

只需用这些设置配置设备，它就会直接通过 Forward Email 发送邮件，无需本地中继服务器。

更多详情请参见 [Forward Email 关于旧版 TLS 支持的常见问题](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings)。

### 选项2：设置 Postfix SMTP 中继 {#option-2-set-up-a-postfix-smtp-relay}

如果您不使用 Forward Email，或者更喜欢本地中继方案，可以在 Raspberry Pi 上设置 Postfix 作为中间人。这适用于任何邮件提供商（Gmail、Outlook、Yahoo、AOL 等）。

#### 安装 Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
安装过程中：

* 选择 **“Internet Site”**
* 在“系统邮件名称”中输入您的 Pi 主机名（例如，`raspberrypi-ftp`）

#### 选择您的电子邮件提供商 {#choose-your-email-provider}

| 提供商   | SMTP 服务器             | 端口 | 是否需要应用专用密码？ |
| -------- | ----------------------- | ---- | ---------------------- |
| Gmail    | smtp.gmail.com          | 587  | 是                     |
| Outlook  | smtp-mail.outlook.com   | 587  | 是                     |
| Yahoo    | smtp.mail.yahoo.com     | 465  | 是                     |
| AOL      | smtp.aol.com            | 587  | 是                     |

#### 获取应用专用密码 {#get-an-app-specific-password}

大多数提供商要求第三方应用使用应用专用密码。请从您的电子邮件提供商的安全设置中生成：

* **Gmail:** [Google 账户安全](https://myaccount.google.com/security)
* **Outlook:** [Microsoft 账户安全](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo 账户安全](https://login.yahoo.com/account/security)
* **AOL:** [AOL 账户安全](https://login.aol.com/account/security)

> \[!IMPORTANT]
> 切勿使用您的常规电子邮件密码。始终使用应用专用密码。

#### 配置 SASL 认证 {#configure-sasl-authentication}

为您选择的提供商创建密码文件。此示例使用 Yahoo：

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

添加此行（根据您的提供商调整服务器和端口）：

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Gmail 使用：

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

保护并生成哈希文件：

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### 配置电子邮件地址映射 {#configure-email-address-mapping}

重写本地电子邮件地址以匹配您的电子邮件提供商：

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

添加此行（将 `HOSTNAME` 替换为您的 Pi 主机名，并使用您的电子邮件）：

```
/.+@HOSTNAME/    your_email@provider.com
```

示例：

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

保护文件：

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### 配置 Postfix 主设置 {#configure-postfix-main-settings}

编辑主配置文件：

```bash
sudo nano /etc/postfix/main.cf
```

找到并更新中继主机（或添加到文件末尾）：

```
relayhost = [smtp.mail.yahoo.com]:465
```

在文件末尾添加以下设置：

```
# SMTP 中继配置
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# 网络设置
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> 对于 Gmail（端口 587），将 `smtp_tls_wrappermode` 设置为 `no`，而不是 `yes`。

> \[!WARNING]
> 请根据您的实际网络范围更新 `mynetworks`。仅添加受信任的网络——这些网络上的任何设备都可以无需认证中继邮件。

**常见网络范围：**

| 网络范围          | IP 地址范围                 |
| ----------------- | --------------------------- |
| `192.168.0.0/24`  | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24`  | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`      | 10.0.0.0 - 10.255.255.255   |

#### 更新防火墙并重启 {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

验证 Postfix 是否运行：

```bash
sudo systemctl status postfix
```

#### 测试中继 {#test-the-relay}

发送测试邮件：

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

查看日志：

```bash
sudo tail -f /var/log/mail.log
```

查找 `status=sent` 以确认成功。

#### 配置您的设备 {#configure-your-device-1}

在您的摄像头或设备设置中：
* **SMTP 服务器：** 你的树莓派 IP 地址（例如，`192.168.1.100`）
* **SMTP 端口：** `25`
* **认证：** 无
* **加密：** 无（仅限本地网络）


## 故障排除 {#troubleshooting}

如果出现问题，请检查以下日志文件：

**FTP 服务器：**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban：**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**文件监控：**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix 邮件：**

```bash
sudo tail -f /var/log/mail.log
mailq  # 查看邮件队列
```


## 总结 {#wrapping-up}

树莓派现在是一个完整的自动化系统，具备安全的文件上传、带附件的自动邮件通知以及面向旧设备的 SMTP 中继功能。无论是使用 Forward Email 的传统 TLS 端口，还是本地 Postfix 中继，旧设备现在都能通过现代邮件服务提供商可靠地发送邮件。
