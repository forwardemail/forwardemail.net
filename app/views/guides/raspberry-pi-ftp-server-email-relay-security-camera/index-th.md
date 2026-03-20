# เปลี่ยน Raspberry Pi ของคุณให้เป็นเซิร์ฟเวอร์ FTP ที่ปลอดภัยพร้อมระบบส่งอีเมล {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

มี Raspberry Pi ที่ไม่ได้ใช้งานอยู่หรือเปล่า? ไม่ว่าจะเป็น Pi 5 รุ่นล่าสุด, Pi 4, Pi Zero หรือแม้แต่รุ่นเก่า คู่มือนี้จะแสดงวิธีเปลี่ยนมันให้กลายเป็นเซิร์ฟเวอร์ไฟล์ที่ทรงพลังและอัตโนมัติพร้อมความสามารถในการส่งอีเมล เหมาะสำหรับกล้องวงจรปิด, อุปกรณ์ IoT และอื่นๆ

**รองรับ:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W และ Raspberry Pi Zero

> \[!NOTE]
> คู่มือนี้ได้รับการทดสอบและยืนยันบน Raspberry Pi 3 Model B ที่ใช้ Ubuntu Server 22.04 LTS


## สารบัญ {#table-of-contents}

* [สิ่งที่เราจะสร้าง](#what-were-building)
* [ส่วนที่ 1: การติดตั้ง Ubuntu Server บน Pi ของคุณ](#part-1-getting-ubuntu-server-on-your-pi)
  * [สิ่งที่คุณต้องมี](#what-youll-need)
  * [การแฟลชระบบปฏิบัติการ](#flashing-the-os)
  * [การบูตและการเชื่อมต่อ](#booting-up--connecting)
* [ส่วนที่ 2: การตั้งค่าเซิร์ฟเวอร์ FTP ที่ปลอดภัย](#part-2-setting-up-a-secure-ftp-server)
  * [การติดตั้งและการตั้งค่า](#installation--configuration)
  * [การสร้างผู้ใช้ FTP](#creating-an-ftp-user)
* [ส่วนที่ 3: ไฟร์วอลล์และการป้องกันการโจมตีแบบบรูทฟอร์ซ](#part-3-firewall-and-brute-force-protection)
  * [การตั้งค่า UFW](#setting-up-ufw)
  * [การตั้งค่า Fail2ban](#setting-up-fail2ban)
* [ส่วนที่ 4: การประมวลผลไฟล์อัตโนมัติพร้อมการแจ้งเตือนทางอีเมล](#part-4-automated-file-processing-with-email-notifications)
  * [ตัวเลือกที่ 1: ใช้ Forward Email API (แนะนำ)](#option-1-using-forward-email-api-recommended)
  * [ตัวเลือกที่ 2: ใช้ผู้ให้บริการอีเมลอื่นๆ](#option-2-using-other-email-providers)
  * [สร้างบริการ Systemd](#create-a-systemd-service)
* [ส่วนที่ 5: ตัวเลือกอีเมลสำหรับอุปกรณ์รุ่นเก่า](#part-5-email-options-for-legacy-devices)
  * [ตัวเลือกที่ 1: ใช้พอร์ต TLS 1.0 รุ่นเก่าของ Forward Email (แนะนำ)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [ตัวเลือกที่ 2: ตั้งค่า Postfix SMTP Relay](#option-2-set-up-a-postfix-smtp-relay)
* [การแก้ไขปัญหา](#troubleshooting)
* [สรุป](#wrapping-up)


## สิ่งที่เราจะสร้าง {#what-were-building}

คู่มือนี้จะพาคุณตั้งค่าระบบครบวงจรที่ประกอบด้วย:

* **Ubuntu Server 22.04 LTS:** ระบบปฏิบัติการที่มั่นคงและเบาสำหรับ Pi
* **เซิร์ฟเวอร์ FTP ที่ปลอดภัย (vsftpd):** สำหรับการส่งไฟล์อย่างปลอดภัย
* **ไฟร์วอลล์ (UFW) และ Fail2ban:** เพื่อป้องกันผู้ไม่หวังดี
* **โปรแกรมประมวลผลไฟล์อัตโนมัติ:** สคริปต์ที่ดึงไฟล์ใหม่ ส่งอีเมลแนบไฟล์ และลบไฟล์หลังจากนั้น
* **ตัวเลือกอีเมลสำหรับอุปกรณ์รุ่นเก่า:** สองวิธีสำหรับอุปกรณ์ที่ไม่รองรับ TLS รุ่นใหม่:
  * ใช้พอร์ต TLS 1.0 รุ่นเก่าของ Forward Email (ง่ายที่สุด)
  * ตั้งค่า Postfix SMTP Relay (ใช้งานได้กับผู้ให้บริการอีเมลทุกเจ้า)

พร้อมหรือยัง? ไปเริ่มกันเลย


## ส่วนที่ 1: การติดตั้ง Ubuntu Server บน Pi ของคุณ {#part-1-getting-ubuntu-server-on-your-pi}

อันดับแรก ให้ติดตั้ง Ubuntu Server บน Raspberry Pi ของคุณ ซึ่งง่ายมากด้วย Raspberry Pi Imager

### สิ่งที่คุณต้องมี {#what-youll-need}

* Raspberry Pi ที่รองรับ (ดูรายการด้านบน)
* การ์ด microSD (อย่างน้อย 8GB, แนะนำ 16GB ขึ้นไป)
* คอมพิวเตอร์ที่มีเครื่องอ่านการ์ด microSD
* อะแดปเตอร์จ่ายไฟที่เหมาะสมกับรุ่น Pi ของคุณ
* การเชื่อมต่ออินเทอร์เน็ต (Ethernet หรือ Wi-Fi)

> \[!NOTE]
> รุ่นเก่าอย่าง Raspberry Pi 2 หรือ Pi Zero อาจทำงานช้ากว่าแต่ยังใช้ได้ดีสำหรับการตั้งค่านี้

### การแฟลชระบบปฏิบัติการ {#flashing-the-os}

1. **ดาวน์โหลด Raspberry Pi Imager:** ดาวน์โหลดได้จาก [เว็บไซต์ทางการ](https://www.raspberrypi.com/software/)

2. **เลือกระบบปฏิบัติการ:** ในโปรแกรม imager เลือก "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu"
   * สำหรับรุ่น 64 บิต (Pi 3, 4, 5, Zero 2 W) เลือก **"Ubuntu Server 22.04.1 LTS (64-bit)"**
   * สำหรับรุ่นเก่า 32 บิต (Pi 2, Pi Zero, Pi Zero W) เลือก **"Ubuntu Server 22.04.1 LTS (32-bit)"**

3. **เลือกที่เก็บข้อมูล:** เลือกการ์ด microSD ของคุณ

> \[!WARNING]
> การทำเช่นนี้จะลบข้อมูลทั้งหมดในการ์ด microSD ของคุณ โปรดสำรองข้อมูลสำคัญไว้ก่อน

4. **ตัวเลือกขั้นสูงช่วยคุณได้:** คลิกไอคอนรูปเฟือง (⚙️) เพื่อกำหนดค่า Pi ให้ทำงานแบบ headless (ไม่ต้องใช้จอภาพหรือคีย์บอร์ด)
   * **Hostname:** ตั้งชื่อ Pi ของคุณ (เช่น `pi-server`)
   * **SSH:** เปิดใช้งานและตั้งชื่อผู้ใช้กับรหัสผ่าน
   * **Wi-Fi:** หากไม่ใช้ Ethernet ให้กรอกรายละเอียด Wi-Fi ของคุณ
   * **Locale:** ตั้งค่าโซนเวลาและแป้นพิมพ์
5. **เขียน!** คลิกปุ่ม "WRITE" แล้วปล่อยให้โปรแกรมสร้างภาพทำงาน

### การบูตเครื่องและการเชื่อมต่อ {#booting-up--connecting}

เมื่อโปรแกรมสร้างภาพเสร็จแล้ว ให้ใส่การ์ด microSD ลงใน Pi และเสียบปลั๊ก รอประมาณไม่กี่นาทีเพื่อให้เครื่องบูตขึ้นมา มันกำลังทำการตั้งค่าเริ่มต้นในพื้นหลัง หา IP address จากหน้าจัดการของเราเตอร์ แล้วเชื่อมต่อผ่าน SSH:

```bash
ssh your_username@your_pi_ip_address
```

คุณเข้าสู่ระบบแล้ว! Raspberry Pi พร้อมสำหรับการตั้งค่าแล้ว


## ส่วนที่ 2: การตั้งค่าเซิร์ฟเวอร์ FTP ที่ปลอดภัย {#part-2-setting-up-a-secure-ftp-server}

ต่อไป ตั้งค่า `vsftpd` (Very Secure FTP Daemon) โดยตั้งค่าสำหรับความปลอดภัยสูงสุด

### การติดตั้งและการตั้งค่า {#installation--configuration}

1. **ติดตั้ง vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **สำรองไฟล์คอนฟิก:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **แก้ไขการตั้งค่า:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> หากบรรทัดใดถูกคอมเมนต์ (ขึ้นต้นด้วย `#`) ให้ลบ `#` ออกเพื่อเปิดใช้งาน

ทำการเปลี่ยนแปลงดังนี้:

| การตั้งค่า                | ค่า    | จุดประสงค์                                               |
| ------------------------ | ------ | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`   | ปิดการเข้าถึง FTP แบบไม่ระบุชื่อ                        |
| `local_enable`           | `YES`  | อนุญาตให้ผู้ใช้ภายในล็อกอินได้                          |
| `write_enable`           | `YES`  | เปิดใช้งานการอัปโหลดไฟล์                                |
| `local_umask`            | `022`  | กำหนดสิทธิ์ไฟล์ (644 สำหรับไฟล์, 755 สำหรับโฟลเดอร์)    |
| `chroot_local_user`      | `YES`  | จำกัดผู้ใช้ให้อยู่ในโฟลเดอร์บ้านของตนเอง                |
| `allow_writeable_chroot` | `YES`  | อนุญาตให้อัปโหลดไฟล์ในโหมด chroot jail                  |

4. **เพิ่มช่วงพอร์ต Passive:** เพิ่มบรรทัดเหล่านี้ที่ท้ายไฟล์ จำเป็นสำหรับไฟร์วอลล์

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **เปิดใช้งานการบันทึก:** เพิ่มบรรทัดเหล่านี้เพื่อเปิดใช้งานการบันทึกสำหรับ Fail2ban

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **บันทึกและรีสตาร์ท:** กด `Ctrl+O`, `Enter`, `Ctrl+X` แล้วรีสตาร์ทบริการ:

   ```bash
   sudo systemctl restart vsftpd
   ```

### การสร้างผู้ใช้ FTP {#creating-an-ftp-user}

สร้างผู้ใช้เฉพาะสำหรับการเข้าถึง FTP โดยจำกัดสิทธิ์

1. **สร้างผู้ใช้:**

   ```bash
   sudo adduser ftpuser
   ```

   ทำตามคำแนะนำเพื่อกำหนดรหัสผ่าน ช่องอื่น ๆ (ชื่อ, เบอร์โทร ฯลฯ) สามารถเว้นว่างได้

2. **สร้างโครงสร้างโฟลเดอร์:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - โฟลเดอร์ FTP หลัก
   * `/home/ftpuser/ftp/uploads` - ที่สำหรับอัปโหลดไฟล์

3. **ตั้งค่าสิทธิ์:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## ส่วนที่ 3: ไฟร์วอลล์และการป้องกันการโจมตีแบบ Brute-Force {#part-3-firewall-and-brute-force-protection}

ปกป้อง Pi ด้วย UFW (Uncomplicated Firewall) และ Fail2ban

### การตั้งค่า UFW {#setting-up-ufw}

1. **ติดตั้ง UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **ตั้งค่านโยบายเริ่มต้น:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **อนุญาต SSH (สำคัญ!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> ต้องอนุญาต SSH ก่อนเปิดใช้งานไฟร์วอลล์ มิฉะนั้นคุณจะล็อกตัวเองออก!

4. **อนุญาตพอร์ต FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **เปิดใช้งานไฟร์วอลล์:**

   ```bash
   sudo ufw enable
   ```

### การตั้งค่า Fail2ban {#setting-up-fail2ban}

Fail2ban จะบล็อกที่อยู่ IP อัตโนมัติหลังจากพยายามล็อกอินล้มเหลวซ้ำ ๆ

1. **ติดตั้ง Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **สร้างไฟล์คอนฟิกในเครื่อง:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **เพิ่มการตั้งค่าต่อไปนี้:**
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

ทำให้สามารถรันได้:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### สร้าง Systemd Service {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

เพิ่มเนื้อหานี้:

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

เปิดใช้งานและเริ่มบริการ:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

ตรวจสอบสถานะ:

```bash
sudo systemctl status ftp-monitor.service
```


## ส่วนที่ 5: ตัวเลือกอีเมลสำหรับอุปกรณ์รุ่นเก่า {#part-5-email-options-for-legacy-devices}

อุปกรณ์อย่างกล้อง FOSSCAM มักจะไม่รองรับเวอร์ชัน TLS สมัยใหม่ มีสองทางเลือก:

### ตัวเลือกที่ 1: ใช้พอร์ต Legacy TLS 1.0 ของ Forward Email (แนะนำ) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

ถ้าคุณใช้ Forward Email นี่คือวิธีที่ง่ายที่สุด Forward Email มีพอร์ต legacy TLS 1.0 เฉพาะสำหรับอุปกรณ์เก่าอย่างกล้อง เครื่องพิมพ์ เครื่องสแกน และเครื่องแฟกซ์

#### ราคา {#pricing}

Forward Email มีแผนบริการหลายแบบ:

| แผนบริการ               | ราคา         | คุณสมบัติ                              |
| ----------------------- | ------------ | -------------------------------------- |
| ฟรี                     | $0/เดือน     | ส่งต่ออีเมลอย่างเดียว (ไม่สามารถส่ง)  |
| **Enhanced Protection** | **$3/เดือน** | **เข้าถึง SMTP + พอร์ต legacy TLS 1.0** |
| ทีม                     | $9/เดือน     | Enhanced + ฟีเจอร์ทีม                  |
| องค์กร                  | $250/เดือน   | ทีม + คำขอ API ไม่จำกัด               |

> \[!IMPORTANT]
> ต้องใช้แผน **Enhanced Protection ($3/เดือน)** ขึ้นไปสำหรับการเข้าถึง SMTP และรองรับพอร์ต legacy TLS 1.0

เรียนรู้เพิ่มเติมได้ที่ [Forward Email Pricing](https://forwardemail.net/en/pricing)

#### สร้างรหัสผ่านของคุณ {#generate-your-password}

ก่อนตั้งค่าอุปกรณ์ ให้สร้างรหัสผ่านใน Forward Email:

1. เข้าสู่ระบบที่ [Forward Email](https://forwardemail.net)
2. ไปที่ **บัญชีของฉัน → โดเมน → \[โดเมนของคุณ] → อีเมลแฝง**
3. สร้างหรือเลือกอีเมลแฝง (เช่น `camera@yourdomain.com`)
4. คลิก **"Generate Password"** ข้างๆ อีเมลแฝงนั้น
5. คัดลอกรหัสผ่านที่สร้างขึ้น - คุณจะใช้สำหรับการยืนยันตัวตน SMTP

> \[!TIP]
> อีเมลแฝงแต่ละอันสามารถมีรหัสผ่านของตัวเองได้ ซึ่งช่วยให้ติดตามได้ว่าอุปกรณ์ใดส่งอีเมลใด

#### ตั้งค่าอุปกรณ์ของคุณ {#configure-your-device}

ใช้การตั้งค่าเหล่านี้ในกล้อง เครื่องพิมพ์ เครื่องสแกน หรืออุปกรณ์รุ่นเก่าอื่นๆ:

| การตั้งค่า       | ค่า                                               |
| --------------- | ------------------------------------------------- |
| เซิร์ฟเวอร์ SMTP | `smtp.forwardemail.net`                           |
| พอร์ต (SSL/TLS)  | `2455`                                            |
| พอร์ต (STARTTLS) | `2555` (ทางเลือก)                                 |
| ชื่อผู้ใช้       | อีเมลแฝงของคุณ (เช่น `camera@yourdomain.com`)    |
| รหัสผ่าน        | รหัสผ่านจาก "Generate Password"                   |
| การยืนยันตัวตน  | จำเป็น                                            |
| การเข้ารหัส     | SSL/TLS (แนะนำ) หรือ STARTTLS                      |

> \[!WARNING]
> พอร์ตเหล่านี้ใช้โปรโตคอล TLS 1.0 ที่เลิกใช้แล้วซึ่งมีช่องโหว่ด้านความปลอดภัยที่รู้จัก (BEAST, POODLE) ใช้เฉพาะเมื่ออุปกรณ์ของคุณไม่รองรับ TLS 1.2+ สมัยใหม่เท่านั้น

เพียงตั้งค่าอุปกรณ์ของคุณด้วยการตั้งค่าเหล่านี้ อุปกรณ์จะส่งอีเมลโดยตรงผ่าน Forward Email โดยไม่ต้องใช้เซิร์ฟเวอร์รีเลย์ภายในเครื่อง

ดูรายละเอียดเพิ่มเติมได้ที่ [Forward Email FAQ on Legacy TLS Support](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings)

### ตัวเลือกที่ 2: ตั้งค่า Postfix SMTP Relay {#option-2-set-up-a-postfix-smtp-relay}

ถ้าคุณไม่ได้ใช้ Forward Email หรือชอบวิธีรีเลย์ภายในเครื่อง ให้ตั้งค่า Postfix บน Raspberry Pi เพื่อทำหน้าที่เป็นตัวกลาง วิธีนี้ใช้ได้กับผู้ให้บริการอีเมลทุกเจ้า (Gmail, Outlook, Yahoo, AOL ฯลฯ)

#### ติดตั้ง Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
ระหว่างการติดตั้ง:

* เลือก **"Internet Site"**
* กรอกชื่อโฮสต์ของ Pi ของคุณ (เช่น `raspberrypi-ftp`) สำหรับ "System mail name"

#### เลือกผู้ให้บริการอีเมลของคุณ {#choose-your-email-provider}

| ผู้ให้บริการ | เซิร์ฟเวอร์ SMTP       | พอร์ต | ต้องใช้รหัสผ่านแอปหรือไม่? |
| ----------- | --------------------- | ----- | -------------------------- |
| Gmail       | smtp.gmail.com        | 587   | ใช่                       |
| Outlook     | smtp-mail.outlook.com | 587   | ใช่                       |
| Yahoo       | smtp.mail.yahoo.com   | 465   | ใช่                       |
| AOL         | smtp.aol.com          | 587   | ใช่                       |

#### รับรหัสผ่านเฉพาะแอป {#get-an-app-specific-password}

ผู้ให้บริการส่วนใหญ่ต้องใช้รหัสผ่านแอปสำหรับแอปพลิเคชันของบุคคลที่สาม สร้างรหัสผ่านได้จากการตั้งค่าความปลอดภัยของผู้ให้บริการอีเมลของคุณ:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> อย่าใช้รหัสผ่านอีเมลปกติของคุณ ใช้รหัสผ่านเฉพาะแอปเสมอ

#### กำหนดค่า SASL Authentication {#configure-sasl-authentication}

สร้างไฟล์รหัสผ่านสำหรับผู้ให้บริการที่คุณเลือก ตัวอย่างนี้ใช้ Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

เพิ่มบรรทัดนี้ (ปรับเซิร์ฟเวอร์และพอร์ตตามผู้ให้บริการของคุณ):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

สำหรับ Gmail ใช้:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

ตั้งค่าสิทธิ์และแฮชไฟล์:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### กำหนดค่าการแมปที่อยู่อีเมล {#configure-email-address-mapping}

เขียนที่อยู่อีเมลภายในใหม่ให้ตรงกับผู้ให้บริการอีเมลของคุณ:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

เพิ่มบรรทัดนี้ (แทนที่ `HOSTNAME` ด้วยชื่อโฮสต์ของ Pi ของคุณและใช้ที่อยู่อีเมลของคุณ):

```
/.+@HOSTNAME/    your_email@provider.com
```

ตัวอย่าง:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

ตั้งค่าสิทธิ์ไฟล์:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### กำหนดค่า Postfix Main Settings {#configure-postfix-main-settings}

แก้ไขการตั้งค่าหลัก:

```bash
sudo nano /etc/postfix/main.cf
```

ค้นหาและอัปเดต relay host (หรือเพิ่มที่ท้ายไฟล์):

```
relayhost = [smtp.mail.yahoo.com]:465
```

เพิ่มการตั้งค่าเหล่านี้ที่ท้ายไฟล์:

```
# การตั้งค่า SMTP Relay
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# การตั้งค่าเครือข่าย
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> สำหรับ Gmail (พอร์ต 587) ตั้งค่า `smtp_tls_wrappermode = no` แทน `yes`

> \[!WARNING]
> อัปเดต `mynetworks` ด้วยช่วงเครือข่ายจริงของคุณ เพิ่มเฉพาะเครือข่ายที่เชื่อถือได้เท่านั้น - อุปกรณ์ใด ๆ ในเครือข่ายเหล่านี้สามารถส่งเมลผ่าน relay ได้โดยไม่ต้องยืนยันตัวตน

**ช่วงเครือข่ายทั่วไป:**

| ช่วงเครือข่าย    | ช่วงที่อยู่ IP               |
| ----------------- | ---------------------------- |
| `192.168.0.0/24`  | 192.168.0.1 - 192.168.0.254  |
| `192.168.1.0/24`  | 192.168.1.1 - 192.168.1.254  |
| `10.0.0.0/8`      | 10.0.0.0 - 10.255.255.255    |

#### อัปเดตไฟร์วอลล์และรีสตาร์ท {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

ตรวจสอบว่า Postfix กำลังทำงาน:

```bash
sudo systemctl status postfix
```

#### ทดสอบการรีเลย์ {#test-the-relay}

ส่งอีเมลทดสอบ:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

ตรวจสอบบันทึก:

```bash
sudo tail -f /var/log/mail.log
```

มองหา `status=sent` เพื่อยืนยันความสำเร็จ

#### กำหนดค่าอุปกรณ์ของคุณ {#configure-your-device-1}

ในการตั้งค่ากล้องหรืออุปกรณ์ของคุณ:
* **SMTP Server:** ที่อยู่ IP ของ Pi ของคุณ (เช่น `192.168.1.100`)
* **SMTP Port:** `25`
* **Authentication:** ไม่มี
* **Encryption:** ไม่มี (เฉพาะเครือข่ายภายใน)


## Troubleshooting {#troubleshooting}

หากเกิดปัญหา ให้ตรวจสอบไฟล์ล็อกเหล่านี้:

**FTP Server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**File Monitor:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # ดูคิวอีเมล
```


## Wrapping Up {#wrapping-up}

Raspberry Pi ตอนนี้เป็นระบบอัตโนมัติครบวงจรที่มีการอัปโหลดไฟล์อย่างปลอดภัย การแจ้งเตือนทางอีเมลอัตโนมัติพร้อมไฟล์แนบ และความสามารถในการส่งต่อ SMTP สำหรับอุปกรณ์รุ่นเก่า ไม่ว่าจะใช้พอร์ต TLS รุ่นเก่าของ Forward Email หรือรีเลย์ Postfix ภายในเครื่อง อุปกรณ์รุ่นเก่าสามารถส่งอีเมลได้อย่างน่าเชื่อถือผ่านผู้ให้บริการอีเมลสมัยใหม่แล้ว
