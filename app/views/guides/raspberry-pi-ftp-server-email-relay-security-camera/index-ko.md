# 라즈베리 파이를 이메일 릴레이가 가능한 보안 FTP 서버로 만들기 {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

라즈베리 파이가 먼지만 쌓이고 있나요? 최신 Pi 5, Pi 4, Pi Zero 또는 구형 모델이든 상관없이, 이 가이드는 이를 강력하고 자동화된 파일 서버이자 이메일 릴레이 기능이 있는 서버로 만드는 방법을 보여줍니다. 보안 카메라, IoT 기기 등에 완벽합니다.

**호환 모델:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, Raspberry Pi Zero.

> \[!NOTE]
> 이 가이드는 Ubuntu Server 22.04 LTS가 설치된 Raspberry Pi 3 Model B에서 테스트 및 검증되었습니다.


## 목차 {#table-of-contents}

* [우리가 만들 것](#what-were-building)
* [1부: Pi에 Ubuntu Server 설치하기](#part-1-getting-ubuntu-server-on-your-pi)
  * [필요한 것](#what-youll-need)
  * [OS 플래싱하기](#flashing-the-os)
  * [부팅 및 연결](#booting-up--connecting)
* [2부: 보안 FTP 서버 설정하기](#part-2-setting-up-a-secure-ftp-server)
  * [설치 및 구성](#installation--configuration)
  * [FTP 사용자 만들기](#creating-an-ftp-user)
* [3부: 방화벽 및 무차별 대입 공격 방어](#part-3-firewall-and-brute-force-protection)
  * [UFW 설정하기](#setting-up-ufw)
  * [Fail2ban 설정하기](#setting-up-fail2ban)
* [4부: 이메일 알림이 포함된 자동 파일 처리](#part-4-automated-file-processing-with-email-notifications)
  * [옵션 1: Forward Email API 사용 (권장)](#option-1-using-forward-email-api-recommended)
  * [옵션 2: 기타 이메일 제공자 사용](#option-2-using-other-email-providers)
  * [Systemd 서비스 만들기](#create-a-systemd-service)
* [5부: 구형 기기를 위한 이메일 옵션](#part-5-email-options-for-legacy-devices)
  * [옵션 1: Forward Email의 구형 TLS 1.0 포트 사용 (권장)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [옵션 2: Postfix SMTP 릴레이 설정](#option-2-set-up-a-postfix-smtp-relay)
* [문제 해결](#troubleshooting)
* [마무리](#wrapping-up)


## 우리가 만들 것 {#what-were-building}

이 가이드는 다음을 포함하는 완전한 시스템 설정 과정을 안내합니다:

* **Ubuntu Server 22.04 LTS:** Pi에 적합한 견고하고 가벼운 운영체제.
* **보안 FTP 서버 (vsftpd):** 안전하게 파일을 올릴 수 있는 서버.
* **방화벽 (UFW) 및 Fail2ban:** 악성 접근 차단.
* **자동 파일 처리기:** 새 파일을 감지해 첨부파일로 이메일을 보내고, 처리 후 정리하는 스크립트.
* **구형 기기를 위한 이메일 옵션:** 최신 TLS를 지원하지 않는 기기를 위한 두 가지 방법:
  * Forward Email의 구형 TLS 1.0 포트 사용 (가장 쉬움)
  * Postfix SMTP 릴레이 설정 (모든 이메일 제공자와 호환)

준비되셨나요? 시작해봅시다.


## 1부: Pi에 Ubuntu Server 설치하기 {#part-1-getting-ubuntu-server-on-your-pi}

먼저, 라즈베리 파이에 Ubuntu Server를 설치하세요. Raspberry Pi Imager 덕분에 매우 쉽습니다.

### 필요한 것 {#what-youll-need}

* 호환 가능한 라즈베리 파이 (위 목록 참조)
* 마이크로SD 카드 (최소 8GB, 16GB 이상 권장)
* 마이크로SD 카드 리더가 있는 컴퓨터
* Pi 모델에 맞는 적절한 전원 공급 장치
* 인터넷 연결 (이더넷 또는 Wi-Fi)

> \[!NOTE]
> Raspberry Pi 2나 Pi Zero 같은 구형 모델은 속도가 느릴 수 있지만 이 설정에는 문제없이 작동합니다.

### OS 플래싱하기 {#flashing-the-os}

1. **Raspberry Pi Imager 다운로드:** [공식 웹사이트](https://www.raspberrypi.com/software/)에서 다운로드하세요.

2. **운영체제 선택:** Imager에서 "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu"를 선택하세요.
   * 64비트 모델 (Pi 3, 4, 5, Zero 2 W)에는 **"Ubuntu Server 22.04.1 LTS (64-bit)"**를 선택하세요.
   * 구형 32비트 모델 (Pi 2, Pi Zero, Pi Zero W)에는 **"Ubuntu Server 22.04.1 LTS (32-bit)"**를 선택하세요.

3. **저장 장치 선택:** 마이크로SD 카드를 선택하세요.

> \[!WARNING]
> 이 작업은 마이크로SD 카드의 모든 데이터를 삭제합니다. 중요한 데이터는 반드시 백업하세요.

4. **고급 옵션 활용:** 톱니바퀴 아이콘(⚙️)을 클릭해 헤드리스 모드(모니터나 키보드 없이 사용)를 설정하세요.
   * **호스트명:** Pi 이름 지정 (예: `pi-server`).
   * **SSH:** 활성화하고 사용자 이름과 비밀번호 설정.
   * **Wi-Fi:** 이더넷을 사용하지 않는 경우 Wi-Fi 정보 입력.
   * **로케일:** 시간대와 키보드 레이아웃 설정.
5. **작성하기!** "WRITE" 버튼을 클릭하고 이미저가 작업을 완료할 때까지 기다리세요.

### 부팅 및 연결 {#booting-up--connecting}

이미저가 완료되면 microSD 카드를 라즈베리 파이에 넣고 전원을 연결하세요. 부팅하는 데 몇 분 정도 걸립니다. 백그라운드에서 초기 설정을 진행 중입니다. 라우터 관리자 페이지에서 IP 주소를 확인한 후 SSH로 연결하세요:

```bash
ssh your_username@your_pi_ip_address
```

접속 완료! 라즈베리 파이가 이제 설정할 준비가 되었습니다.


## 2부: 보안 FTP 서버 설정 {#part-2-setting-up-a-secure-ftp-server}

다음으로, 최대 보안을 위해 구성된 `vsftpd`(Very Secure FTP Daemon)를 설정합니다.

### 설치 및 구성 {#installation--configuration}

1. **vsftpd 설치:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **설정 파일 백업:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **설정 파일 편집:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> 줄이 주석 처리되어 있으면(앞에 `#`가 있으면) `#`를 제거하여 주석을 해제하세요.

다음과 같이 변경하세요:

| 설정                      | 값     | 목적                                                      |
| ------------------------ | ------ | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`   | 익명 FTP 접근 비활성화                                    |
| `local_enable`           | `YES`  | 로컬 사용자 로그인 허용                                   |
| `write_enable`           | `YES`  | 파일 업로드 활성화                                       |
| `local_umask`            | `022`  | 파일 권한 설정 (파일은 644, 디렉터리는 755)              |
| `chroot_local_user`      | `YES`  | 사용자를 홈 디렉터리에 감금                               |
| `allow_writeable_chroot` | `YES`  | chroot 감금 내 업로드 허용                               |

4. **수동 포트 범위 추가:** 방화벽 설정을 위해 파일 끝에 다음 줄을 추가하세요.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **로깅 활성화:** Fail2ban 로그를 위해 다음 줄을 추가하세요.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **저장 및 재시작:** `Ctrl+O`, `Enter`, `Ctrl+X`를 누른 후 서비스를 재시작하세요:

   ```bash
   sudo systemctl restart vsftpd
   ```

### FTP 사용자 생성 {#creating-an-ftp-user}

FTP 접근을 위한 전용 제한 사용자 계정을 만듭니다.

1. **사용자 생성:**

   ```bash
   sudo adduser ftpuser
   ```

   비밀번호 설정 프롬프트에 따라 입력하세요. 이름, 전화번호 등 다른 항목은 비워둬도 됩니다.

2. **디렉터리 구조 생성:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - 메인 FTP 디렉터리
   * `/home/ftpuser/ftp/uploads` - 파일 업로드 위치

3. **권한 설정:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## 3부: 방화벽 및 무차별 대입 공격 방지 {#part-3-firewall-and-brute-force-protection}

UFW(간단 방화벽)와 Fail2ban으로 라즈베리 파이를 보호하세요.

### UFW 설정 {#setting-up-ufw}

1. **UFW 설치:**

   ```bash
   sudo apt install ufw -y
   ```

2. **기본 정책 설정:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **SSH 허용 (중요!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> 방화벽을 활성화하기 전에 반드시 SSH를 허용하세요. 그렇지 않으면 접속이 차단됩니다!

4. **FTP 포트 허용:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **방화벽 활성화:**

   ```bash
   sudo ufw enable
   ```

### Fail2ban 설정 {#setting-up-fail2ban}

Fail2ban은 반복된 로그인 실패 시 IP 주소를 자동으로 차단합니다.

1. **Fail2ban 설치:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **로컬 설정 파일 생성:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **다음 설정 추가:**
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

실행 가능하게 만드세요:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Systemd 서비스 생성 {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

다음 내용을 추가하세요:

```ini
[Unit]
Description=FTP 업로드 모니터
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

서비스 활성화 및 시작:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

상태 확인:

```bash
sudo systemctl status ftp-monitor.service
```


## 5부: 구형 장치를 위한 이메일 옵션 {#part-5-email-options-for-legacy-devices}

FOSSCAM 카메라 같은 장치는 종종 최신 TLS 버전을 지원하지 않습니다. 두 가지 해결책이 있습니다:

### 옵션 1: Forward Email의 구형 TLS 1.0 포트 사용 (권장) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Forward Email을 사용 중이라면, 이것이 가장 쉬운 해결책입니다. Forward Email은 카메라, 프린터, 스캐너, 팩스기 같은 구형 장치를 위해 전용 구형 TLS 1.0 포트를 제공합니다.

#### 가격 {#pricing}

Forward Email은 여러 요금제를 제공합니다:

| 요금제                  | 가격          | 기능                                    |
| ----------------------- | ------------ | -------------------------------------- |
| 무료                    | 월 $0        | 이메일 전달만 가능 (발송 불가)           |
| **향상된 보호**         | **월 $3**    | **SMTP 접근 + 구형 TLS 1.0 포트 지원**  |
| 팀                      | 월 $9        | 향상된 보호 + 팀 기능                   |
| 엔터프라이즈            | 월 $250      | 팀 + 무제한 API 요청                    |

> \[!IMPORTANT]
> SMTP 접근 및 구형 TLS 1.0 포트 지원을 위해서는 **향상된 보호 요금제($3/월)** 이상이 필요합니다.

자세한 내용은 [Forward Email 가격](https://forwardemail.net/en/pricing)에서 확인하세요.

#### 비밀번호 생성 {#generate-your-password}

장치를 설정하기 전에 Forward Email에서 비밀번호를 생성하세요:

1. [Forward Email](https://forwardemail.net)에 로그인
2. **내 계정 → 도메인 → \[내 도메인] → 별칭**으로 이동
3. 별칭 생성 또는 선택 (예: `camera@yourdomain.com`)
4. 별칭 옆의 **"비밀번호 생성"** 클릭
5. 생성된 비밀번호 복사 - SMTP 인증에 사용

> \[!TIP]
> 별칭마다 별도의 비밀번호를 설정할 수 있습니다. 어떤 장치가 어떤 이메일을 보냈는지 추적하는 데 유용합니다.

#### 장치 설정 {#configure-your-device}

카메라, 프린터, 스캐너 또는 기타 구형 장치에 다음 설정을 사용하세요:

| 설정           | 값                                               |
| -------------- | ------------------------------------------------ |
| SMTP 서버      | `smtp.forwardemail.net`                          |
| 포트 (SSL/TLS) | `2455`                                           |
| 포트 (STARTTLS)| `2555` (대체 포트)                               |
| 사용자 이름    | 별칭 이메일 (예: `camera@yourdomain.com`)        |
| 비밀번호       | "비밀번호 생성"에서 받은 비밀번호                 |
| 인증           | 필요                                              |
| 암호화         | SSL/TLS (권장) 또는 STARTTLS                       |

> \[!WARNING]
> 이 포트들은 알려진 보안 취약점(BEAST, POODLE)이 있는 구형 TLS 1.0 프로토콜을 사용합니다. 장치가 최신 TLS 1.2 이상을 지원하지 않는 경우에만 사용하세요.

이 설정으로 장치를 구성하면 로컬 릴레이 서버 없이 Forward Email을 통해 직접 이메일을 보낼 수 있습니다.

자세한 내용은 [Forward Email 구형 TLS 지원 FAQ](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings)를 참조하세요.

### 옵션 2: Postfix SMTP 릴레이 설정 {#option-2-set-up-a-postfix-smtp-relay}

Forward Email을 사용하지 않거나 로컬 릴레이 솔루션을 선호하는 경우, Raspberry Pi에 Postfix를 설치하여 중계 서버로 설정하세요. Gmail, Outlook, Yahoo, AOL 등 모든 이메일 제공자와 함께 작동합니다.

#### Postfix 설치 {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
설치 중:

* **"인터넷 사이트"** 선택
* "시스템 메일 이름"에 Pi의 호스트명 입력 (예: `raspberrypi-ftp`)

#### 이메일 제공업체 선택 {#choose-your-email-provider}

| 제공업체 | SMTP 서버             | 포트 | 앱 비밀번호 필요?       |
| -------- | --------------------- | ---- | ---------------------- |
| Gmail    | smtp.gmail.com        | 587  | 예                     |
| Outlook  | smtp-mail.outlook.com | 587  | 예                     |
| Yahoo    | smtp.mail.yahoo.com   | 465  | 예                     |
| AOL      | smtp.aol.com          | 587  | 예                     |

#### 앱 전용 비밀번호 받기 {#get-an-app-specific-password}

대부분의 제공업체는 타사 애플리케이션용 앱 비밀번호를 요구합니다. 이메일 제공업체의 보안 설정에서 생성하세요:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> 일반 이메일 비밀번호는 절대 사용하지 마세요. 항상 앱 전용 비밀번호를 사용하세요.

#### SASL 인증 구성 {#configure-sasl-authentication}

선택한 제공업체용 비밀번호 파일을 만듭니다. 이 예시는 Yahoo를 사용합니다:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

다음 줄을 추가하세요 (서버와 포트는 제공업체에 맞게 조정):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Gmail의 경우:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

파일 권한 설정 및 해시 생성:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### 이메일 주소 매핑 구성 {#configure-email-address-mapping}

로컬 이메일 주소를 이메일 제공업체 주소로 재작성합니다:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

다음 줄을 추가하세요 (`HOSTNAME`을 Pi의 호스트명으로 바꾸고 이메일을 사용):

```
/.+@HOSTNAME/    your_email@provider.com
```

예시:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

파일 권한 설정:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Postfix 메인 설정 구성 {#configure-postfix-main-settings}

메인 설정 파일을 편집하세요:

```bash
sudo nano /etc/postfix/main.cf
```

릴레이 호스트를 찾거나 파일 끝에 추가하세요:

```
relayhost = [smtp.mail.yahoo.com]:465
```

파일 끝에 다음 설정을 추가하세요:

```
# SMTP 릴레이 구성
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# 네트워크 설정
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Gmail(포트 587)의 경우 `smtp_tls_wrappermode = yes` 대신 `no`로 설정하세요.

> \[!WARNING]
> `mynetworks`를 실제 네트워크 범위로 업데이트하세요. 신뢰할 수 있는 네트워크만 추가하세요 - 이 네트워크 내의 모든 장치는 인증 없이 메일을 릴레이할 수 있습니다.

**일반 네트워크 범위:**

| 네트워크 범위       | IP 주소 범위               |
| ------------------- | -------------------------- |
| `192.168.0.0/24`    | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24`    | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`        | 10.0.0.0 - 10.255.255.255   |

#### 방화벽 업데이트 및 재시작 {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Postfix 실행 상태 확인:

```bash
sudo systemctl status postfix
```

#### 릴레이 테스트 {#test-the-relay}

테스트 이메일 보내기:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

로그 확인:

```bash
sudo tail -f /var/log/mail.log
```

성공 여부는 `status=sent`를 확인하세요.

#### 장치 구성 {#configure-your-device-1}

카메라 또는 장치 설정에서:
* **SMTP 서버:** Pi의 IP 주소 (예: `192.168.1.100`)
* **SMTP 포트:** `25`
* **인증:** 없음
* **암호화:** 없음 (로컬 네트워크 전용)


## 문제 해결 {#troubleshooting}

문제가 발생하면 다음 로그 파일을 확인하세요:

**FTP 서버:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**파일 모니터:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix 메일:**

```bash
sudo tail -f /var/log/mail.log
mailq  # 메일 큐 보기
```


## 마무리 {#wrapping-up}

Raspberry Pi는 이제 보안 파일 업로드, 첨부파일이 포함된 자동 이메일 알림, 그리고 레거시 장치를 위한 SMTP 릴레이 기능을 갖춘 완전한 자동화 시스템이 되었습니다. Forward Email의 레거시 TLS 포트나 로컬 Postfix 릴레이를 사용하든, 오래된 장치들도 이제 현대 이메일 제공자를 통해 안정적으로 이메일을 보낼 수 있습니다.
