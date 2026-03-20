# حوّل جهاز Raspberry Pi الخاص بك إلى خادم FTP آمن مع ترحيل البريد الإلكتروني {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

هل لديك جهاز Raspberry Pi يجمع الغبار؟ سواء كان أحدث Pi 5، أو Pi 4، أو Pi Zero، أو حتى طراز أقدم، سيرشدك هذا الدليل إلى كيفية تحويله إلى خادم ملفات قوي ومؤتمت مع قدرات ترحيل البريد الإلكتروني. مثالي لكاميرات الأمان، وأجهزة إنترنت الأشياء، وأكثر.

**متوافق مع:** Raspberry Pi 5، Raspberry Pi 4 Model B، Raspberry Pi 3 Model B+، Raspberry Pi 3 Model B، Raspberry Pi 2 Model B، Raspberry Pi Zero 2 W، Raspberry Pi Zero W، و Raspberry Pi Zero.

> \[!NOTE]
> تم اختبار هذا الدليل والتحقق منه على Raspberry Pi 3 Model B يعمل بنظام Ubuntu Server 22.04 LTS.


## جدول المحتويات {#table-of-contents}

* [ما الذي نبنيه](#what-were-building)
* [الجزء 1: تثبيت Ubuntu Server على جهاز Pi الخاص بك](#part-1-getting-ubuntu-server-on-your-pi)
  * [ما ستحتاجه](#what-youll-need)
  * [تفليش نظام التشغيل](#flashing-the-os)
  * [الإقلاع والاتصال](#booting-up--connecting)
* [الجزء 2: إعداد خادم FTP آمن](#part-2-setting-up-a-secure-ftp-server)
  * [التثبيت والتكوين](#installation--configuration)
  * [إنشاء مستخدم FTP](#creating-an-ftp-user)
* [الجزء 3: جدار الحماية وحماية من الهجمات العنيفة](#part-3-firewall-and-brute-force-protection)
  * [إعداد UFW](#setting-up-ufw)
  * [إعداد Fail2ban](#setting-up-fail2ban)
* [الجزء 4: معالجة الملفات المؤتمتة مع إشعارات البريد الإلكتروني](#part-4-automated-file-processing-with-email-notifications)
  * [الخيار 1: استخدام Forward Email API (موصى به)](#option-1-using-forward-email-api-recommended)
  * [الخيار 2: استخدام مزودي البريد الإلكتروني الآخرين](#option-2-using-other-email-providers)
  * [إنشاء خدمة Systemd](#create-a-systemd-service)
* [الجزء 5: خيارات البريد الإلكتروني للأجهزة القديمة](#part-5-email-options-for-legacy-devices)
  * [الخيار 1: استخدام منافذ TLS 1.0 القديمة من Forward Email (موصى به)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [الخيار 2: إعداد ترحيل SMTP باستخدام Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [استكشاف الأخطاء وإصلاحها](#troubleshooting)
* [الختام](#wrapping-up)


## ما الذي نبنيه {#what-were-building}

سيرشدك هذا الدليل خلال إعداد نظام كامل يتضمن:

* **Ubuntu Server 22.04 LTS:** نظام تشغيل خفيف الوزن وصلب لجهاز Pi.
* **خادم FTP آمن (vsftpd):** لنقل الملفات بأمان.
* **جدار حماية (UFW) و Fail2ban:** لمنع المتسللين.
* **معالج ملفات مؤتمت:** سكربت يلتقط الملفات الجديدة، يرسلها كمرفقات عبر البريد الإلكتروني، ثم ينظف نفسه.
* **خيارات البريد الإلكتروني للأجهزة القديمة:** طريقتان للأجهزة التي لا تدعم TLS الحديث:
  * استخدام منافذ TLS 1.0 القديمة من Forward Email (الأبسط)
  * إعداد ترحيل SMTP باستخدام Postfix (يعمل مع أي مزود بريد إلكتروني)

هل أنت مستعد؟ لنبدأ.


## الجزء 1: تثبيت Ubuntu Server على جهاز Pi الخاص بك {#part-1-getting-ubuntu-server-on-your-pi}

أولاً وقبل كل شيء، قم بتشغيل Ubuntu Server على جهاز Raspberry Pi. هذا سهل بشكل مدهش بفضل Raspberry Pi Imager.

### ما ستحتاجه {#what-youll-need}

* أي جهاز Raspberry Pi متوافق (انظر القائمة أعلاه)
* بطاقة microSD (8 جيجابايت كحد أدنى، و16 جيجابايت أو أكثر موصى به)
* جهاز كمبيوتر مزود بقارئ بطاقات microSD
* مزود طاقة مناسب لطراز جهاز Pi الخاص بك
* اتصال بالإنترنت (إيثرنت أو واي فاي)

> \[!NOTE]
> الطرازات الأقدم مثل Raspberry Pi 2 أو Pi Zero قد تكون أبطأ لكنها ستعمل بشكل جيد لهذا الإعداد.

### تفليش نظام التشغيل {#flashing-the-os}

1. **احصل على Raspberry Pi Imager:** قم بتحميله من [الموقع الرسمي](https://www.raspberrypi.com/software/).

2. **اختر نظام التشغيل:** في برنامج التفليش، اختر "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * للطرازات 64-بت (Pi 3، 4، 5، Zero 2 W)، اختر **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * للطرازات 32-بت الأقدم (Pi 2، Pi Zero، Pi Zero W)، اختر **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **اختر التخزين:** حدد بطاقة microSD الخاصة بك.

> \[!WARNING]
> هذا سيمسح بطاقة microSD الخاصة بك بالكامل. تأكد من نسخ أي بيانات مهمة احتياطيًا.

4. **الخيارات المتقدمة صديقتك:** انقر على أيقونة الترس (⚙️) لإعداد Pi للعمل في وضع الرأس بدون شاشة أو لوحة مفاتيح.
   * **اسم المضيف:** امنح جهاز Pi اسمًا (مثلاً `pi-server`).
   * **SSH:** فعّله واضبط اسم المستخدم وكلمة المرور.
   * **واي فاي:** إذا لم تستخدم إيثرنت، أدخل تفاصيل شبكة الواي فاي الخاصة بك.
   * **اللغة:** اضبط المنطقة الزمنية وتخطيط لوحة المفاتيح.
5. **اكتب!** اضغط على زر "WRITE" ودع جهاز التصوير يقوم بعمله.

### الإقلاع والاتصال {#booting-up--connecting}

بمجرد انتهاء جهاز التصوير، أدخل بطاقة microSD في جهاز Pi وقم بتوصيله. امنحه بضع دقائق للإقلاع. يقوم ببعض الإعدادات الأولية في الخلفية. ابحث عن عنوان IP الخاص به من صفحة إدارة الراوتر، ثم اتصل عبر SSH:

```bash
ssh your_username@your_pi_ip_address
```

أنت الآن داخل! جهاز Raspberry Pi جاهز الآن للإعداد.


## الجزء 2: إعداد خادم FTP آمن {#part-2-setting-up-a-secure-ftp-server}

بعد ذلك، قم بإعداد `vsftpd` (خادم FTP آمن جدًا)، مهيأ لأقصى درجات الأمان.

### التثبيت والإعداد {#installation--configuration}

1. **تثبيت vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **نسخ ملف الإعداد احتياطيًا:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **تحرير الإعدادات:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> إذا كان السطر معلقًا (يبدأ بـ `#`)، قم بإلغاء التعليق بحذف `#`.

قم بإجراء هذه التغييرات:

| الإعداد                  | القيمة | الغرض                                                   |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | تعطيل الوصول المجهول إلى FTP                              |
| `local_enable`           | `YES` | السماح للمستخدمين المحليين بتسجيل الدخول                   |
| `write_enable`           | `YES` | تمكين رفع الملفات                                       |
| `local_umask`            | `022` | تعيين أذونات الملفات (644 للملفات، 755 للمجلدات)          |
| `chroot_local_user`      | `YES` | حبس المستخدمين في مجلداتهم المنزلية                        |
| `allow_writeable_chroot` | `YES` | السماح بالرفع داخل الحبس (chroot)                          |

4. **إضافة نطاق منافذ الوضع السلبي:** أضف هذه الأسطر إلى نهاية الملف. هذا مطلوب للجدار الناري.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **تمكين التسجيل:** أضف هذه الأسطر لتمكين التسجيل لـ Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **حفظ وإعادة التشغيل:** اضغط `Ctrl+O`، ثم `Enter`، ثم `Ctrl+X`، ثم أعد تشغيل الخدمة:

   ```bash
   sudo systemctl restart vsftpd
   ```

### إنشاء مستخدم FTP {#creating-an-ftp-user}

أنشئ مستخدمًا مخصصًا ومقيدًا للوصول إلى FTP.

1. **إنشاء المستخدم:**

   ```bash
   sudo adduser ftpuser
   ```

   اتبع التعليمات لتعيين كلمة مرور. يمكن ترك الحقول الأخرى (الاسم، الهاتف، إلخ) فارغة.

2. **إنشاء هيكل المجلدات:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - المجلد الرئيسي لـ FTP
   * `/home/ftpuser/ftp/uploads` - حيث سيتم رفع الملفات

3. **تعيين الأذونات:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## الجزء 3: الجدار الناري وحماية من الهجمات العنيفة {#part-3-firewall-and-brute-force-protection}

أمّن جهاز Pi باستخدام UFW (جدار ناري بسيط) و Fail2ban.

### إعداد UFW {#setting-up-ufw}

1. **تثبيت UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **تعيين السياسات الافتراضية:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **السماح بالـ SSH (حرج!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> دائمًا اسمح بالـ SSH قبل تفعيل الجدار الناري، وإلا ستُحرم من الوصول!

4. **السماح بمنافذ FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **تفعيل الجدار الناري:**

   ```bash
   sudo ufw enable
   ```

### إعداد Fail2ban {#setting-up-fail2ban}

يقوم Fail2ban تلقائيًا بحظر عناوين IP بعد محاولات تسجيل دخول فاشلة متكررة.

1. **تثبيت Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **إنشاء إعداد محلي:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **أضف هذه الإعدادات:**
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

اجعله قابلاً للتنفيذ:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### إنشاء خدمة Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

أضف هذا المحتوى:

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

قم بتمكين الخدمة وتشغيلها:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

تحقق من الحالة:

```bash
sudo systemctl status ftp-monitor.service
```


## الجزء 5: خيارات البريد الإلكتروني للأجهزة القديمة {#part-5-email-options-for-legacy-devices}

الأجهزة مثل كاميرات FOSSCAM غالبًا لا تدعم إصدارات TLS الحديثة. هناك حلان:

### الخيار 1: استخدام منافذ TLS 1.0 القديمة من Forward Email (موصى به) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

إذا كنت تستخدم Forward Email، فهذا هو الحل الأسهل. توفر Forward Email منافذ TLS 1.0 مخصصة للأجهزة القديمة مثل الكاميرات والطابعات والماسحات وأجهزة الفاكس.

#### التسعير {#pricing}

تقدم Forward Email عدة خطط:

| الخطة                   | السعر        | الميزات                                |
| ----------------------- | ------------ | -------------------------------------- |
| مجاني                   | $0/شهر      | إعادة توجيه البريد فقط (بدون إرسال)     |
| **الحماية المحسنة**     | **$3/شهر**  | **الوصول إلى SMTP + منافذ TLS 1.0 القديمة** |
| الفريق                  | $9/شهر      | الحماية المحسنة + ميزات الفريق          |
| المؤسسة                 | $250/شهر    | الفريق + طلبات API غير محدودة           |

> \[!IMPORTANT]
> خطة **الحماية المحسنة ($3/شهر)** أو أعلى مطلوبة للوصول إلى SMTP ودعم منافذ TLS 1.0 القديمة.

تعرف على المزيد في [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### إنشاء كلمة المرور الخاصة بك {#generate-your-password}

قبل تكوين جهازك، أنشئ كلمة مرور في Forward Email:

1. سجّل الدخول إلى [Forward Email](https://forwardemail.net)
2. انتقل إلى **حسابي → النطاقات → \[نطاقك] → الأسماء المستعارة**
3. أنشئ أو اختر اسمًا مستعارًا (مثل `camera@yourdomain.com`)
4. انقر على **"إنشاء كلمة مرور"** بجانب الاسم المستعار
5. انسخ كلمة المرور التي تم إنشاؤها - ستستخدمها لمصادقة SMTP

> \[!TIP]
> يمكن لكل اسم مستعار أن يكون له كلمة مرور خاصة به. هذا مفيد لتتبع الجهاز الذي أرسل كل بريد إلكتروني.

#### تكوين جهازك {#configure-your-device}

استخدم هذه الإعدادات في الكاميرا أو الطابعة أو الماسح الضوئي أو أي جهاز قديم آخر:

| الإعداد          | القيمة                                           |
| --------------- | ------------------------------------------------ |
| خادم SMTP       | `smtp.forwardemail.net`                          |
| المنفذ (SSL/TLS) | `2455`                                           |
| المنفذ (STARTTLS) | `2555` (بديل)                                    |
| اسم المستخدم    | بريدك الإلكتروني للاسم المستعار (مثل `camera@yourdomain.com`) |
| كلمة المرور     | كلمة المرور من "إنشاء كلمة مرور"                 |
| المصادقة        | مطلوبة                                          |
| التشفير         | SSL/TLS (موصى به) أو STARTTLS                     |

> \[!WARNING]
> تستخدم هذه المنافذ بروتوكول TLS 1.0 المهمل والذي يحتوي على ثغرات أمنية معروفة (BEAST, POODLE). استخدمها فقط إذا كان جهازك لا يدعم TLS 1.2+ الحديث.

قم ببساطة بتكوين جهازك بهذه الإعدادات وسيقوم بإرسال البريد الإلكتروني مباشرة عبر Forward Email دون الحاجة إلى خادم ترحيل محلي.

لمزيد من التفاصيل، راجع [الأسئلة الشائعة لـ Forward Email حول دعم TLS القديم](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### الخيار 2: إعداد ترحيل SMTP باستخدام Postfix {#option-2-set-up-a-postfix-smtp-relay}

إذا لم تكن تستخدم Forward Email، أو تفضل حل ترحيل محلي، قم بإعداد Postfix على Raspberry Pi ليعمل كوسيط. هذا يعمل مع أي مزود بريد إلكتروني (Gmail, Outlook, Yahoo, AOL، إلخ).

#### تثبيت Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
أثناء التثبيت:

* اختر **"موقع إنترنت"**
* أدخل اسم المضيف الخاص بجهاز Pi الخاص بك (مثلًا، `raspberrypi-ftp`) لـ "اسم نظام البريد"

#### اختر مزود البريد الإلكتروني الخاص بك {#choose-your-email-provider}

| المزود   | خادم SMTP             | المنفذ | هل يتطلب كلمة مرور للتطبيق؟ |
| -------- | --------------------- | ------ | --------------------------- |
| جيميل    | smtp.gmail.com        | 587    | نعم                         |
| أوتلوك   | smtp-mail.outlook.com | 587    | نعم                         |
| ياهو     | smtp.mail.yahoo.com   | 465    | نعم                         |
| AOL      | smtp.aol.com          | 587    | نعم                         |

#### احصل على كلمة مرور خاصة بالتطبيق {#get-an-app-specific-password}

معظم المزودين يتطلبون كلمات مرور خاصة بالتطبيقات للبرامج الخارجية. قم بإنشاء واحدة من إعدادات الأمان لمزود بريدك الإلكتروني:

* **جيميل:** [أمان حساب جوجل](https://myaccount.google.com/security)
* **أوتلوك:** [أمان حساب مايكروسوفت](https://account.microsoft.com/security)
* **ياهو:** [أمان حساب ياهو](https://login.yahoo.com/account/security)
* **AOL:** [أمان حساب AOL](https://login.aol.com/account/security)

> \[!IMPORTANT]
> لا تستخدم كلمة مرور بريدك العادية أبدًا. استخدم دائمًا كلمة مرور خاصة بالتطبيق.

#### تكوين مصادقة SASL {#configure-sasl-authentication}

أنشئ ملف كلمة المرور لمزودك المختار. هذا المثال يستخدم ياهو:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

أضف هذا السطر (قم بتعديل الخادم والمنفذ حسب مزودك):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

لجيميل، استخدم:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

قم بتأمين وتجزئة الملف:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### تكوين تعيين عناوين البريد الإلكتروني {#configure-email-address-mapping}

أعد كتابة عناوين البريد الإلكتروني المحلية لتطابق مزود بريدك الإلكتروني:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

أضف هذا السطر (استبدل `HOSTNAME` باسم مضيف جهاز Pi الخاص بك واستخدم بريدك الإلكتروني):

```
/.+@HOSTNAME/    your_email@provider.com
```

مثال:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

قم بتأمين الملف:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### تكوين الإعدادات الرئيسية لـ Postfix {#configure-postfix-main-settings}

حرر الإعدادات الرئيسية:

```bash
sudo nano /etc/postfix/main.cf
```

ابحث عن مضيف الترحيل وقم بتحديثه (أو أضفه في النهاية):

```
relayhost = [smtp.mail.yahoo.com]:465
```

أضف هذه الإعدادات في نهاية الملف:

```
# تكوين ترحيل SMTP
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# إعدادات الشبكة
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> لجيميل (المنفذ 587)، اضبط `smtp_tls_wrappermode = no` بدلاً من `yes`.

> \[!WARNING]
> حدّث `mynetworks` بنطاق شبكتك الفعلي. أضف فقط الشبكات الموثوقة - أي جهاز على هذه الشبكات يمكنه ترحيل البريد بدون مصادقة.

**نطاقات الشبكة الشائعة:**

| نطاق الشبكة       | نطاق عناوين IP               |
| ----------------- | ---------------------------- |
| `192.168.0.0/24`  | 192.168.0.1 - 192.168.0.254  |
| `192.168.1.0/24`  | 192.168.1.1 - 192.168.1.254  |
| `10.0.0.0/8`      | 10.0.0.0 - 10.255.255.255    |

#### تحديث جدار الحماية وإعادة التشغيل {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

تحقق من تشغيل Postfix:

```bash
sudo systemctl status postfix
```

#### اختبار الترحيل {#test-the-relay}

أرسل بريدًا إلكترونيًا تجريبيًا:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

تحقق من السجلات:

```bash
sudo tail -f /var/log/mail.log
```

ابحث عن `status=sent` لتأكيد النجاح.

#### تكوين جهازك {#configure-your-device-1}

في إعدادات الكاميرا أو الجهاز الخاص بك:
* **خادم SMTP:** عنوان IP الخاص بجهاز Pi الخاص بك (مثلاً، `192.168.1.100`)
* **منفذ SMTP:** `25`
* **المصادقة:** لا شيء
* **التشفير:** لا شيء (شبكة محلية فقط)


## استكشاف الأخطاء وإصلاحها {#troubleshooting}

إذا ظهرت مشاكل، تحقق من ملفات السجل هذه:

**خادم FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**مراقب الملفات:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**بريد Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # عرض قائمة البريد
```


## الخاتمة {#wrapping-up}

أصبح جهاز Raspberry Pi الآن نظامًا آليًا كاملاً مع تحميل ملفات آمن، وإشعارات بريد إلكتروني تلقائية مع مرفقات، وقدرات ترحيل SMTP للأجهزة القديمة. سواء باستخدام منافذ TLS القديمة لـ Forward Email أو ترحيل Postfix المحلي، يمكن للأجهزة القديمة الآن إرسال رسائل البريد الإلكتروني بشكل موثوق عبر مزودي البريد الإلكتروني الحديثين.
