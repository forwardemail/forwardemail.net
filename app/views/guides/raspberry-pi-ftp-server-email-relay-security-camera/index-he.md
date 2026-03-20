# הפוך את ה-Raspberry Pi שלך לשרת FTP מאובטח עם העברת אימייל {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

יש לך Raspberry Pi שמאגר אבק? בין אם זה ה-Pi 5 האחרון, Pi 4, Pi Zero, או אפילו דגם ישן יותר, המדריך הזה יראה לך איך להפוך אותו לשרת קבצים חזק ואוטומטי עם יכולות העברת אימייל. מושלם למצלמות אבטחה, מכשירי IoT, ועוד.

**תואם עם:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, ו-Raspberry Pi Zero.

> \[!NOTE]
> מדריך זה נבדק ואומת על Raspberry Pi 3 Model B עם Ubuntu Server 22.04 LTS.


## תוכן העניינים {#table-of-contents}

* [מה אנחנו בונים](#what-were-building)
* [חלק 1: התקנת Ubuntu Server על ה-Pi שלך](#part-1-getting-ubuntu-server-on-your-pi)
  * [מה תצטרך](#what-youll-need)
  * [התקנת מערכת ההפעלה](#flashing-the-os)
  * [הפעלה וחיבור](#booting-up--connecting)
* [חלק 2: הקמת שרת FTP מאובטח](#part-2-setting-up-a-secure-ftp-server)
  * [התקנה וקונפיגורציה](#installation--configuration)
  * [יצירת משתמש FTP](#creating-an-ftp-user)
* [חלק 3: חומת אש והגנה מפני התקפות כוח גס](#part-3-firewall-and-brute-force-protection)
  * [הגדרת UFW](#setting-up-ufw)
  * [הגדרת Fail2ban](#setting-up-fail2ban)
* [חלק 4: עיבוד קבצים אוטומטי עם התראות אימייל](#part-4-automated-file-processing-with-email-notifications)
  * [אפשרות 1: שימוש ב-Forward Email API (מומלץ)](#option-1-using-forward-email-api-recommended)
  * [אפשרות 2: שימוש בספקי אימייל אחרים](#option-2-using-other-email-providers)
  * [יצירת שירות Systemd](#create-a-systemd-service)
* [חלק 5: אפשרויות אימייל למכשירים ישנים](#part-5-email-options-for-legacy-devices)
  * [אפשרות 1: שימוש ביציאות TLS 1.0 הישנות של Forward Email (מומלץ)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [אפשרות 2: הקמת שרת SMTP Relay עם Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [פתרון בעיות](#troubleshooting)
* [סיכום](#wrapping-up)


## מה אנחנו בונים {#what-were-building}

המדריך הזה ילווה אותך בהקמת מערכת מלאה שכוללת:

* **Ubuntu Server 22.04 LTS:** מערכת הפעלה יציבה וקלה ל-Pi.
* **שרת FTP מאובטח (vsftpd):** להורדת קבצים בצורה מאובטחת.
* **חומת אש (UFW) ו-Fail2ban:** כדי לשמור על הפורצים בחוץ.
* **מעבד קבצים אוטומטי:** סקריפט שתופס קבצים חדשים, שולח אותם באימייל כקבצים מצורפים, ואז מנקה אחריו.
* **אפשרויות אימייל למכשירים ישנים:** שתי גישות למכשירים שלא תומכים ב-TLS מודרני:
  * שימוש ביציאות TLS 1.0 הישנות של Forward Email (הכי פשוט)
  * הקמת שרת SMTP Relay עם Postfix (עובד עם כל ספק אימייל)

מוכנים? בואו נתחיל.


## חלק 1: התקנת Ubuntu Server על ה-Pi שלך {#part-1-getting-ubuntu-server-on-your-pi}

קודם כל, התקן את Ubuntu Server על ה-Raspberry Pi. זה קל להפתיע בזכות Raspberry Pi Imager.

### מה תצטרך {#what-youll-need}

* כל Raspberry Pi תואם (ראה רשימה למעלה)
* כרטיס microSD (מינימום 8GB, מומלץ 16GB ומעלה)
* מחשב עם קורא כרטיסי microSD
* ספק כוח מתאים לדגם ה-Pi שלך
* חיבור אינטרנט (Ethernet או Wi-Fi)

> \[!NOTE]
> דגמים ישנים כמו Raspberry Pi 2 או Pi Zero עשויים להיות איטיים יותר אך יעבדו טוב עם ההתקנה הזו.

### התקנת מערכת ההפעלה {#flashing-the-os}

1. **הורד את Raspberry Pi Imager:** הורד אותו מה-[אתר הרשמי](https://www.raspberrypi.com/software/).

2. **בחר את מערכת ההפעלה:** באימגר, בחר "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * לדגמים 64 ביט (Pi 3, 4, 5, Zero 2 W), בחר **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * לדגמים ישנים 32 ביט (Pi 2, Pi Zero, Pi Zero W), בחר **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **בחר את האחסון שלך:** בחר את כרטיס ה-microSD שלך.

> \[!WARNING]
> פעולה זו תמחק את כל תוכן כרטיס ה-microSD. ודא שגיבית כל דבר חשוב.

4. **אפשרויות מתקדמות הן החברים שלך:** לחץ על סמל הגלגל שיניים (⚙️) כדי להגדיר את ה-Pi במצב ללא ראש (headless) – ללא צורך במוניטור או מקלדת.
   * **Hostname:** תן ל-Pi שלך שם (למשל, `pi-server`).
   * **SSH:** הפעל אותו והגדר שם משתמש וסיסמה.
   * **Wi-Fi:** אם אינך משתמש ב-Ethernet, הזן את פרטי ה-Wi-Fi שלך.
   * **Locale:** הגדר את אזור הזמן ופריסת המקלדת שלך.
5. **כתוב!** לחץ על כפתור "WRITE" ותן למכשיר התמונה לעשות את שלו.

### אתחול וחיבור {#booting-up--connecting}

כאשר המכשיר סיים, הכנס את כרטיס ה-microSD ל-Pi וחבר אותו לחשמל. המתן כמה דקות לאתחול. הוא מבצע הגדרות ראשוניות ברקע. מצא את כתובת ה-IP שלו בדף הניהול של הנתב שלך, ואז התחבר דרך SSH:

```bash
ssh your_username@your_pi_ip_address
```

אתה בפנים! ה-Raspberry Pi מוכן כעת להגדרה.


## חלק 2: הקמת שרת FTP מאובטח {#part-2-setting-up-a-secure-ftp-server}

לאחר מכן, התקן את `vsftpd` (Very Secure FTP Daemon), מוגדר לביטחון מקסימלי.

### התקנה והגדרה {#installation--configuration}

1. **התקן את vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **גבה את קובץ ההגדרות:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **ערוך את ההגדרות:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> אם שורה מנותבת (מתחילה ב-`#`), הסר את ה-`#` כדי לבטל את ההערה.

בצע את השינויים הבאים:

| הגדרה                   | ערך   | מטרה                                                      |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | השבתת גישה אנונימית ל-FTP                                 |
| `local_enable`           | `YES` | אפשר למשתמשים מקומיים להתחבר                              |
| `write_enable`           | `YES` | אפשר העלאת קבצים                                         |
| `local_umask`            | `022` | הגדרת הרשאות קבצים (644 לקבצים, 755 לתיקיות)            |
| `chroot_local_user`      | `YES` | כליאת משתמשים לתיקיית הבית שלהם                          |
| `allow_writeable_chroot` | `YES` | אפשר העלאות בתוך כליאת ה-chroot                           |

4. **הוסף טווח פורטים פסיביים:** הוסף את השורות הבאות בסוף הקובץ. זה נדרש לחומת האש.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **הפעלת רישום:** הוסף את השורות הבאות כדי להפעיל רישום עבור Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **שמור והפעל מחדש:** לחץ `Ctrl+O`, `Enter`, `Ctrl+X`, ואז הפעל מחדש את השירות:

   ```bash
   sudo systemctl restart vsftpd
   ```

### יצירת משתמש FTP {#creating-an-ftp-user}

צור משתמש ייעודי ומוגבל לגישה ל-FTP.

1. **צור את המשתמש:**

   ```bash
   sudo adduser ftpuser
   ```

   עקוב אחר ההנחיות כדי להגדיר סיסמה. שדות אחרים (שם, טלפון וכו') ניתן להשאיר ריקים.

2. **צור את מבנה התיקיות:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - תיקיית ה-FTP הראשית
   * `/home/ftpuser/ftp/uploads` - המקום שבו יועלו הקבצים

3. **הגדר הרשאות:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## חלק 3: חומת אש והגנה מפני התקפות כוח גס {#part-3-firewall-and-brute-force-protection}

אבטח את ה-Pi עם UFW (חומת אש פשוטה) ו-Fail2ban.

### הגדרת UFW {#setting-up-ufw}

1. **התקן את UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **הגדר מדיניות ברירת מחדל:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **אפשר SSH (קריטי!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> תמיד אפשר SSH לפני הפעלת חומת האש, אחרת תינעל מחוץ למערכת!

4. **אפשר פורטי FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **הפעל את חומת האש:**

   ```bash
   sudo ufw enable
   ```

### הגדרת Fail2ban {#setting-up-fail2ban}

Fail2ban חוסם אוטומטית כתובות IP לאחר ניסיונות כניסה כושלים חוזרים.

1. **התקן את Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **צור קובץ הגדרות מקומי:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **הוסף את ההגדרות הבאות:**
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

הפוך את זה לביצועי:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### צור שירות Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

הוסף את התוכן הבא:

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

הפעל והפעל את השירות:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

בדוק את הסטטוס:

```bash
sudo systemctl status ftp-monitor.service
```


## חלק 5: אפשרויות דוא"ל למכשירים ישנים {#part-5-email-options-for-legacy-devices}

מכשירים כמו מצלמות FOSSCAM לעיתים לא תומכים בגרסאות TLS מודרניות. יש שתי פתרונות:

### אפשרות 1: השתמש ביציאות TLS 1.0 ישנות של Forward Email (מומלץ) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

אם אתה משתמש ב-Forward Email, זו הפתרון הקל ביותר. Forward Email מספק יציאות TLS 1.0 ישנות ייעודיות במיוחד למכשירים ישנים כמו מצלמות, מדפסות, סורקים ומכונות פקס.

#### תמחור {#pricing}

Forward Email מציע מספר תוכניות:

| תוכנית                  | מחיר         | תכונות                                |
| ----------------------- | ------------ | -------------------------------------- |
| חינם                    | $0/חודש      | העברת דוא"ל בלבד (ללא שליחה)          |
| **הגנה משופרת**         | **$3/חודש**  | **גישה ל-SMTP + יציאות TLS 1.0 ישנות** |
| צוות                    | $9/חודש      | הגנה משופרת + תכונות צוות            |
| ארגוני                  | $250/חודש    | צוות + בקשות API בלתי מוגבלות         |

> \[!IMPORTANT]
> נדרשת תוכנית **הגנה משופרת ($3/חודש)** או גבוהה יותר לגישה ל-SMTP ותמיכה ביציאות TLS 1.0 ישנות.

למידע נוסף ב-[תמחור Forward Email](https://forwardemail.net/en/pricing).

#### צור את הסיסמה שלך {#generate-your-password}

לפני הגדרת המכשיר שלך, צור סיסמה ב-Forward Email:

1. התחבר ל-[Forward Email](https://forwardemail.net)
2. עבור אל **החשבון שלי → דומיינים → \[הדומיין שלך] → כינויים**
3. צור או בחר כינוי (למשל, `camera@yourdomain.com`)
4. לחץ על **"צור סיסמה"** ליד הכינוי
5. העתק את הסיסמה שנוצרה - תשתמש בה לאימות SMTP

> \[!TIP]
> לכל כינוי יכולה להיות סיסמה משלו. זה שימושי למעקב איזה מכשיר שלח איזה דוא"ל.

#### הגדר את המכשיר שלך {#configure-your-device}

השתמש בהגדרות אלו במצלמה, מדפסת, סורק או מכשיר ישן אחר:

| הגדרה           | ערך                                               |
| --------------- | ------------------------------------------------- |
| שרת SMTP        | `smtp.forwardemail.net`                           |
| יציאה (SSL/TLS) | `2455`                                            |
| יציאה (STARTTLS)| `2555` (אלטרנטיבי)                               |
| שם משתמש       | דוא"ל הכינוי שלך (למשל, `camera@yourdomain.com`) |
| סיסמה           | הסיסמה מ-"צור סיסמה"                             |
| אימות           | נדרש                                              |
| הצפנה           | SSL/TLS (מומלץ) או STARTTLS                       |

> \[!WARNING]
> יציאות אלו משתמשות בפרוטוקול TLS 1.0 מיושן עם פגיעויות אבטחה ידועות (BEAST, POODLE). השתמש רק אם המכשיר שלך אינו תומך ב-TLS מודרני 1.2+.

פשוט הגדר את המכשיר עם ההגדרות הללו והוא ישלח דוא"ל ישירות דרך Forward Email ללא צורך בשרת ריליי מקומי.

למידע נוסף, ראה את [שאלות נפוצות של Forward Email על תמיכה ב-TLS ישן](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### אפשרות 2: הגדר ריליי SMTP עם Postfix {#option-2-set-up-a-postfix-smtp-relay}

אם אינך משתמש ב-Forward Email, או מעדיף פתרון ריליי מקומי, הגדר את Postfix על ה-Raspberry Pi לפעול כמתווך. זה עובד עם כל ספק דוא"ל (Gmail, Outlook, Yahoo, AOL וכו').

#### התקן את Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
בעת ההתקנה:

* בחר **"אתר אינטרנט"**
* הזן את שם המארח של ה-Pi שלך (למשל, `raspberrypi-ftp`) עבור "System mail name"

#### בחר את ספק הדואר האלקטרוני שלך {#choose-your-email-provider}

| ספק       | שרת SMTP             | פורט | דרוש סיסמת אפליקציה? |
| --------- | -------------------- | ---- | --------------------- |
| Gmail     | smtp.gmail.com       | 587  | כן                    |
| Outlook   | smtp-mail.outlook.com| 587  | כן                    |
| Yahoo     | smtp.mail.yahoo.com  | 465  | כן                    |
| AOL       | smtp.aol.com         | 587  | כן                    |

#### קבל סיסמת אפליקציה ספציפית {#get-an-app-specific-password}

רוב הספקים דורשים סיסמאות אפליקציה עבור יישומים צד שלישי. צור אחת מהגדרות האבטחה של ספק הדואר שלך:

* **Gmail:** [אבטחת חשבון Google](https://myaccount.google.com/security)
* **Outlook:** [אבטחת חשבון Microsoft](https://account.microsoft.com/security)
* **Yahoo:** [אבטחת חשבון Yahoo](https://login.yahoo.com/account/security)
* **AOL:** [אבטחת חשבון AOL](https://login.aol.com/account/security)

> \[!IMPORTANT]
> לעולם אל תשתמש בסיסמת הדואר הרגילה שלך. תמיד השתמש בסיסמת אפליקציה ספציפית.

#### הגדר אימות SASL {#configure-sasl-authentication}

צור את קובץ הסיסמה עבור הספק שבחרת. בדוגמה זו משתמשים ב-Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

הוסף שורה זו (התאם את השרת והפורט לספק שלך):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

עבור Gmail, השתמש ב:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

אבטח ו-hash את הקובץ:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### הגדר מיפוי כתובות דואר אלקטרוני {#configure-email-address-mapping}

שנה כתובות דואר אלקטרוני מקומיות כך שיתאימו לספק הדואר שלך:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

הוסף שורה זו (החלף את `HOSTNAME` בשם המארח של ה-Pi שלך והשתמש בדואר האלקטרוני שלך):

```
/.+@HOSTNAME/    your_email@provider.com
```

דוגמה:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

אבטח את הקובץ:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### הגדר את ההגדרות הראשיות של Postfix {#configure-postfix-main-settings}

ערוך את הקובץ הראשי:

```bash
sudo nano /etc/postfix/main.cf
```

מצא ועדכן את ה-relay host (או הוסף בסוף):

```
relayhost = [smtp.mail.yahoo.com]:465
```

הוסף את ההגדרות הבאות בסוף הקובץ:

```
# הגדרת SMTP Relay
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# הגדרות רשת
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> עבור Gmail (פורט 587), הגדר `smtp_tls_wrappermode = no` במקום `yes`.

> \[!WARNING]
> עדכן את `mynetworks` עם טווח הרשת האמיתי שלך. הוסף רק רשתות מהימנות - כל מכשיר ברשתות אלו יכול להעביר דואר ללא אימות.

**טווחי רשת נפוצים:**

| טווח רשת        | טווח כתובות IP             |
| --------------- | -------------------------- |
| `192.168.0.0/24`| 192.168.0.1 - 192.168.0.254|
| `192.168.1.0/24`| 192.168.1.1 - 192.168.1.254|
| `10.0.0.0/8`    | 10.0.0.0 - 10.255.255.255  |

#### עדכן את חומת האש והפעל מחדש {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

אמת ש-Postfix פועל:

```bash
sudo systemctl status postfix
```

#### בדוק את ה-Relay {#test-the-relay}

שלח דואר בדיקה:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

בדוק את הלוגים:

```bash
sudo tail -f /var/log/mail.log
```

חפש `status=sent` לאישור הצלחה.

#### הגדר את המכשיר שלך {#configure-your-device-1}

בהגדרות המצלמה או המכשיר שלך:
* **שרת SMTP:** כתובת ה-IP של ה-Pi שלך (למשל, `192.168.1.100`)
* **פורט SMTP:** `25`
* **אימות:** ללא
* **הצפנה:** ללא (רק ברשת מקומית)


## פתרון בעיות {#troubleshooting}

אם מתעוררות בעיות, בדוק את קבצי הלוג הבאים:

**שרת FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**מוניטור קבצים:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**דואר Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # הצג תור דואר
```


## סיום {#wrapping-up}

ה-Raspberry Pi הוא כעת מערכת אוטומטית מלאה עם העלאות קבצים מאובטחות, התראות דואר אלקטרוני אוטומטיות עם קבצים מצורפים, ויכולות העברת SMTP למכשירים ישנים. בין אם משתמשים בפורטים TLS ישנים של Forward Email או במעביר Postfix מקומי, מכשירים ישנים יכולים כעת לשלוח דואר אלקטרוני באופן אמין דרך ספקי דואר מודרניים.
