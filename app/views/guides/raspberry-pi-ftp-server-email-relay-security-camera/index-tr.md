# Raspberry Pi'nizi E-posta Aktarımlı Güvenli Bir FTP Sunucusuna Dönüştürün {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Elinizde toz tutan bir Raspberry Pi mi var? En yeni Pi 5, Pi 4, Pi Zero veya daha eski bir model olsun, bu rehber size onu güçlü, otomatik dosya sunucusuna ve e-posta aktarımlı bir sisteme nasıl dönüştüreceğinizi gösterecek. Güvenlik kameraları, IoT cihazları ve daha fazlası için mükemmel.

**Uyumlu modeller:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W ve Raspberry Pi Zero.

> \[!NOTE]
> Bu rehber, Ubuntu Server 22.04 LTS çalışan bir Raspberry Pi 3 Model B üzerinde test edilip doğrulanmıştır.


## İçindekiler {#table-of-contents}

* [Ne İnşa Ediyoruz](#what-were-building)
* [Bölüm 1: Pi'nize Ubuntu Server Kurmak](#part-1-getting-ubuntu-server-on-your-pi)
  * [İhtiyacınız Olanlar](#what-youll-need)
  * [İşletim Sistemini Yazdırmak](#flashing-the-os)
  * [Başlatma ve Bağlanma](#booting-up--connecting)
* [Bölüm 2: Güvenli Bir FTP Sunucusu Kurmak](#part-2-setting-up-a-secure-ftp-server)
  * [Kurulum ve Yapılandırma](#installation--configuration)
  * [Bir FTP Kullanıcısı Oluşturmak](#creating-an-ftp-user)
* [Bölüm 3: Güvenlik Duvarı ve Brute-Force Koruması](#part-3-firewall-and-brute-force-protection)
  * [UFW Kurulumu](#setting-up-ufw)
  * [Fail2ban Kurulumu](#setting-up-fail2ban)
* [Bölüm 4: E-posta Bildirimli Otomatik Dosya İşleme](#part-4-automated-file-processing-with-email-notifications)
  * [Seçenek 1: Forward Email API Kullanımı (Önerilen)](#option-1-using-forward-email-api-recommended)
  * [Seçenek 2: Diğer E-posta Sağlayıcıları](#option-2-using-other-email-providers)
  * [Bir Systemd Servisi Oluşturmak](#create-a-systemd-service)
* [Bölüm 5: Eski Cihazlar İçin E-posta Seçenekleri](#part-5-email-options-for-legacy-devices)
  * [Seçenek 1: Forward Email'in Legacy TLS 1.0 Portlarını Kullanmak (Önerilen)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Seçenek 2: Postfix SMTP Aktarıcısı Kurmak](#option-2-set-up-a-postfix-smtp-relay)
* [Sorun Giderme](#troubleshooting)
* [Sonuçlandırma](#wrapping-up)


## Ne İnşa Ediyoruz {#what-were-building}

Bu rehber sizi aşağıdakileri içeren tam bir sistem kurulumunda yönlendirecek:

* **Ubuntu Server 22.04 LTS:** Pi için sağlam ve hafif bir işletim sistemi.
* **Güvenli Bir FTP Sunucusu (vsftpd):** Dosyaları güvenli şekilde bırakmak için.
* **Güvenlik Duvarı (UFW) ve Fail2ban:** Kötü niyetlileri engellemek için.
* **Otomatik Dosya İşleyici:** Yeni dosyaları alıp e-posta eki olarak gönderen ve ardından kendini temizleyen bir betik.
* **Eski Cihazlar İçin E-posta Seçenekleri:** Modern TLS desteklemeyen cihazlar için iki yöntem:
  * Forward Email'in legacy TLS 1.0 portlarını kullanmak (en kolay)
  * Postfix SMTP aktarıcısı kurmak (herhangi bir e-posta sağlayıcısıyla çalışır)

Hazır mısınız? Başlayalım.


## Bölüm 1: Pi'nize Ubuntu Server Kurmak {#part-1-getting-ubuntu-server-on-your-pi}

İlk olarak, Raspberry Pi üzerinde Ubuntu Server çalıştırın. Raspberry Pi Imager sayesinde bu şaşırtıcı derecede kolay.

### İhtiyacınız Olanlar {#what-youll-need}

* Yukarıdaki listede belirtilen herhangi bir uyumlu Raspberry Pi
* Bir microSD kart (en az 8GB, 16GB+ önerilir)
* MicroSD kart okuyuculu bir bilgisayar
* Pi modelinize uygun güç kaynağı
* İnternet bağlantısı (Ethernet veya Wi-Fi)

> \[!NOTE]
> Raspberry Pi 2 veya Pi Zero gibi eski modeller daha yavaş olabilir ancak bu kurulum için sorunsuz çalışacaktır.

### İşletim Sistemini Yazdırmak {#flashing-the-os}

1. **Raspberry Pi Imager'ı edinin:** [resmi web sitesinden](https://www.raspberrypi.com/software/) indirin.

2. **İşletim Sistemini Seçin:** Imager'da "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu" seçeneklerini takip edin.
   * 64-bit modeller (Pi 3, 4, 5, Zero 2 W) için **"Ubuntu Server 22.04.1 LTS (64-bit)"** seçin.
   * Eski 32-bit modeller (Pi 2, Pi Zero, Pi Zero W) için **"Ubuntu Server 22.04.1 LTS (32-bit)"** seçin.

3. **Depolama Alanınızı Seçin:** MicroSD kartınızı seçin.

> \[!WARNING]
> Bu işlem microSD kartınızı tamamen silecektir. Önemli verilerinizi yedeklediğinizden emin olun.

4. **Gelişmiş Seçenekler Sizin Dostunuz:** Dişli simgesine (⚙️) tıklayarak Pi'nizi monitör ve klavye olmadan (headless) kullanmak için ayarlayın.
   * **Hostname:** Pi'nize bir isim verin (örneğin, `pi-server`).
   * **SSH:** Etkinleştirin ve bir kullanıcı adı ile şifre belirleyin.
   * **Wi-Fi:** Ethernet kullanmıyorsanız Wi-Fi bilgilerinizi girin.
   * **Yerel Ayar:** Saat diliminizi ve klavye düzeninizi ayarlayın.
5. **Yaz!** "WRITE" düğmesine tıklayın ve imajlayıcının işini yapmasına izin verin.

### Başlatma ve Bağlanma {#booting-up--connecting}

İmajlayıcı işi bitirdikten sonra, microSD kartı Pi'ye takın ve fişe takın. Başlaması için birkaç dakika bekleyin. Arka planda bazı ilk ayarları yapıyor. Yönlendiricinizin yönetim sayfasından IP adresini bulun, ardından SSH ile bağlanın:

```bash
ssh your_username@your_pi_ip_address
```

Giriş yaptınız! Raspberry Pi artık yapılandırmaya hazır.


## Bölüm 2: Güvenli Bir FTP Sunucusu Kurma {#part-2-setting-up-a-secure-ftp-server}

Sonraki adım, maksimum güvenlik için yapılandırılmış `vsftpd` (Çok Güvenli FTP Daemon) kurmaktır.

### Kurulum ve Yapılandırma {#installation--configuration}

1. **vsftpd'yi yükleyin:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Yapılandırma dosyasını yedekleyin:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Yapılandırmayı düzenleyin:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Eğer bir satır yorum satırıysa (başında `#` varsa), `#` işaretini kaldırarak yorumdan çıkarın.

Aşağıdaki değişiklikleri yapın:

| Ayar                     | Değer | Amaç                                                      |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Anonim FTP erişimini devre dışı bırak                      |
| `local_enable`           | `YES` | Yerel kullanıcıların giriş yapmasına izin ver              |
| `write_enable`           | `YES` | Dosya yüklemelerini etkinleştir                            |
| `local_umask`            | `022` | Dosya izinlerini ayarla (dosyalar için 644, dizinler için 755) |
| `chroot_local_user`      | `YES` | Kullanıcıları ev dizinlerine hapset                         |
| `allow_writeable_chroot` | `YES` | Chroot jail içinde yüklemelere izin ver                     |

4. **Pasif Port Aralığını Ekle:** Dosyanın sonuna aşağıdaki satırları ekleyin. Bu, güvenlik duvarı için gereklidir.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Kayıtları Etkinleştir:** Fail2ban için kayıt tutmayı etkinleştirmek üzere aşağıdaki satırları ekleyin.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Kaydet ve Yeniden Başlat:** `Ctrl+O`, `Enter`, `Ctrl+X` tuşlarına basın, ardından servisi yeniden başlatın:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Bir FTP Kullanıcısı Oluşturma {#creating-an-ftp-user}

FTP erişimi için özel, kısıtlanmış bir kullanıcı oluşturun.

1. **Kullanıcıyı oluşturun:**

   ```bash
   sudo adduser ftpuser
   ```

   Parola belirlemek için yönergeleri izleyin. Diğer alanlar (isim, telefon vb.) boş bırakılabilir.

2. **Dizin yapısını oluşturun:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Ana FTP dizini
   * `/home/ftpuser/ftp/uploads` - Dosyaların yükleneceği yer

3. **İzinleri ayarlayın:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Bölüm 3: Güvenlik Duvarı ve Kaba Kuvvet Koruması {#part-3-firewall-and-brute-force-protection}

Pi'yi UFW (Basit Güvenlik Duvarı) ve Fail2ban ile güvence altına alın.

### UFW Kurulumu {#setting-up-ufw}

1. **UFW'yi yükleyin:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Varsayılan politikaları ayarlayın:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **SSH'ye izin verin (kritik!):**

   ```bash
   sudo ufw allow ssh comment 'SSH erişimi'
   ```

> \[!WARNING]
> Güvenlik duvarını etkinleştirmeden önce her zaman SSH'ye izin verin, yoksa kendinizi kilitlersiniz!

4. **FTP portlarına izin verin:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP veri'
   sudo ufw allow 21/tcp comment 'FTP kontrol'
   sudo ufw allow 40000:50000/tcp comment 'FTP pasif mod'
   ```

5. **Güvenlik duvarını etkinleştirin:**

   ```bash
   sudo ufw enable
   ```

### Fail2ban Kurulumu {#setting-up-fail2ban}

Fail2ban, tekrar eden başarısız giriş denemelerinden sonra IP adreslerini otomatik olarak engeller.

1. **Fail2ban'ı yükleyin:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Yerel yapılandırma dosyası oluşturun:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Aşağıdaki yapılandırmaları ekleyin:**
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

Çalıştırılabilir yapın:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Systemd Servisi Oluşturun {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Bu içeriği ekleyin:

```ini
[Unit]
Description=FTP Yükleme Monitörü
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Servisi etkinleştirin ve başlatın:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Durumu kontrol edin:

```bash
sudo systemctl status ftp-monitor.service
```


## Bölüm 5: Eski Cihazlar için E-posta Seçenekleri {#part-5-email-options-for-legacy-devices}

FOSSCAM kameralar gibi cihazlar genellikle modern TLS sürümlerini desteklemez. İki çözüm vardır:

### Seçenek 1: Forward Email'in Eski TLS 1.0 Portlarını Kullanın (Önerilen) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Forward Email kullanıyorsanız, bu en kolay çözümdür. Forward Email, kameralar, yazıcılar, tarayıcılar ve faks makineleri gibi eski cihazlar için özel olarak eski TLS 1.0 portları sağlar.

#### Fiyatlandırma {#pricing}

Forward Email birkaç plan sunar:

| Plan                    | Fiyat        | Özellikler                             |
| ----------------------- | ------------ | ------------------------------------ |
| Ücretsiz                | $0/ay        | Sadece e-posta yönlendirme (gönderim yok) |
| **Gelişmiş Koruma**     | **$3/ay**    | **SMTP erişimi + eski TLS 1.0 portları** |
| Takım                   | $9/ay        | Gelişmiş + takım özellikleri         |
| Kurumsal                | $250/ay      | Takım + sınırsız API istekleri       |

> \[!IMPORTANT]
> SMTP erişimi ve eski TLS 1.0 port desteği için **Gelişmiş Koruma planı ($3/ay)** veya üzeri gereklidir.

Daha fazla bilgi için [Forward Email Fiyatlandırma](https://forwardemail.net/en/pricing) sayfasına bakın.

#### Şifrenizi Oluşturun {#generate-your-password}

Cihazınızı yapılandırmadan önce Forward Email'de bir şifre oluşturun:

1. [Forward Email](https://forwardemail.net) sitesine giriş yapın
2. **Hesabım → Alan Adları → \[Alan Adınız] → Takma Adlar** bölümüne gidin
3. Bir takma ad oluşturun veya seçin (örneğin, `camera@yourdomain.com`)
4. Takma adın yanındaki **"Şifre Oluştur"** butonuna tıklayın
5. Oluşturulan şifreyi kopyalayın - SMTP kimlik doğrulaması için bunu kullanacaksınız

> \[!TIP]
> Her takma adın kendi şifresi olabilir. Bu, hangi cihazın hangi e-postayı gönderdiğini takip etmek için faydalıdır.

#### Cihazınızı Yapılandırın {#configure-your-device}

Kameranızda, yazıcınızda, tarayıcınızda veya diğer eski cihazlarda bu ayarları kullanın:

| Ayar            | Değer                                            |
| --------------- | ------------------------------------------------ |
| SMTP Sunucusu   | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (alternatif)                              |
| Kullanıcı Adı   | Takma ad e-posta adresiniz (örneğin `camera@yourdomain.com`) |
| Şifre           | "Şifre Oluştur" ile aldığınız şifre             |
| Kimlik Doğrulama| Gerekli                                         |
| Şifreleme       | SSL/TLS (önerilen) veya STARTTLS                  |

> \[!WARNING]
> Bu portlar, bilinen güvenlik açıkları (BEAST, POODLE) bulunan eski TLS 1.0 protokolünü kullanır. Cihazınız modern TLS 1.2+ desteklemiyorsa kullanın.

Cihazınızı bu ayarlarla yapılandırın, böylece yerel bir aktarma sunucusuna ihtiyaç duymadan doğrudan Forward Email üzerinden e-posta gönderebilir.

Daha fazla detay için [Forward Email Eski TLS Desteği SSS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) sayfasına bakın.

### Seçenek 2: Postfix SMTP Aktarıcısı Kurun {#option-2-set-up-a-postfix-smtp-relay}

Forward Email kullanmıyorsanız veya yerel bir aktarma çözümü tercih ediyorsanız, Raspberry Pi üzerinde Postfix kurarak aracı olarak kullanabilirsiniz. Bu, Gmail, Outlook, Yahoo, AOL gibi herhangi bir e-posta sağlayıcısıyla çalışır.

#### Postfix Kurulumu {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Kurulum sırasında:

* **"Internet Site"** seçin
* "Sistem posta adı" için Pi'nizin ana bilgisayar adını girin (örneğin, `raspberrypi-ftp`)

#### E-posta Sağlayıcınızı Seçin {#choose-your-email-provider}

| Sağlayıcı | SMTP Sunucusu         | Port | Uygulama Şifresi Gerekli mi? |
| --------- | --------------------- | ---- | ---------------------------- |
| Gmail     | smtp.gmail.com        | 587  | Evet                         |
| Outlook   | smtp-mail.outlook.com | 587  | Evet                         |
| Yahoo     | smtp.mail.yahoo.com   | 465  | Evet                         |
| AOL       | smtp.aol.com          | 587  | Evet                         |

#### Uygulamaya Özel Şifre Alın {#get-an-app-specific-password}

Çoğu sağlayıcı üçüncü taraf uygulamalar için uygulama şifreleri gerektirir. Bunları e-posta sağlayıcınızın güvenlik ayarlarından oluşturun:

* **Gmail:** [Google Hesap Güvenliği](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Hesap Güvenliği](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Hesap Güvenliği](https://login.yahoo.com/account/security)
* **AOL:** [AOL Hesap Güvenliği](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Normal e-posta şifrenizi asla kullanmayın. Her zaman uygulamaya özel şifre kullanın.

#### SASL Kimlik Doğrulamasını Yapılandırın {#configure-sasl-authentication}

Seçtiğiniz sağlayıcı için şifre dosyasını oluşturun. Bu örnek Yahoo kullanmaktadır:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Bu satırı ekleyin (sağlayıcınıza göre sunucu ve portu ayarlayın):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Gmail için kullanın:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Dosyayı güvenli hale getirin ve hashleyin:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### E-posta Adresi Eşlemesini Yapılandırın {#configure-email-address-mapping}

Yerel e-posta adreslerini e-posta sağlayıcınıza uyacak şekilde yeniden yazın:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Bu satırı ekleyin (`HOSTNAME` yerine Pi'nizin ana bilgisayar adını ve kendi e-postanızı kullanın):

```
/.+@HOSTNAME/    your_email@provider.com
```

Örnek:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Dosyayı güvenli hale getirin:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Postfix Ana Ayarlarını Yapılandırın {#configure-postfix-main-settings}

Ana yapılandırmayı düzenleyin:

```bash
sudo nano /etc/postfix/main.cf
```

Relay host'u bulun ve güncelleyin (veya dosyanın sonuna ekleyin):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Dosyanın sonuna şu ayarları ekleyin:

```
# SMTP Relay Yapılandırması
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Ağ ayarları
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Gmail (port 587) için `smtp_tls_wrappermode = yes` yerine `smtp_tls_wrappermode = no` olarak ayarlayın.

> \[!WARNING]
> `mynetworks` değerini gerçek ağ aralığınızla güncelleyin. Sadece güvenilir ağları ekleyin - bu ağlardaki herhangi bir cihaz kimlik doğrulama olmadan posta iletebilir.

**Yaygın ağ aralıkları:**

| Ağ Aralığı       | IP Adresi Aralığı           |
| ---------------- | --------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### Güvenlik Duvarını Güncelleyin ve Yeniden Başlatın {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'Yerel cihazlar için SMTP'
sudo systemctl restart postfix
```

Postfix'in çalıştığını doğrulayın:

```bash
sudo systemctl status postfix
```

#### Relay'i Test Edin {#test-the-relay}

Test e-postası gönderin:

```bash
echo "Postfix'ten Test" | mail -s "Test" your_email@provider.com
```

Logları kontrol edin:

```bash
sudo tail -f /var/log/mail.log
```

Başarıyı doğrulamak için `status=sent` ifadesini arayın.

#### Cihazınızı Yapılandırın {#configure-your-device-1}

Kamera veya cihaz ayarlarınızda:
* **SMTP Sunucusu:** Pi'nizin IP adresi (örneğin, `192.168.1.100`)
* **SMTP Portu:** `25`
* **Kimlik Doğrulama:** Yok
* **Şifreleme:** Yok (yalnızca yerel ağ)


## Sorun Giderme {#troubleshooting}

Sorunlar ortaya çıkarsa, bu günlük dosyalarını kontrol edin:

**FTP Sunucusu:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Dosya İzleyici:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Posta:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Posta kuyruğunu görüntüle
```


## Sonuçlandırma {#wrapping-up}

Raspberry Pi artık güvenli dosya yüklemeleri, ekli otomatik e-posta bildirimleri ve eski cihazlar için SMTP aktarma yetenekleri ile tam otomatik bir sistemdir. Forward Email'in eski TLS portlarını veya yerel bir Postfix aktarıcısını kullanıyor olun, eski cihazlar artık modern e-posta sağlayıcıları üzerinden güvenilir şekilde e-posta gönderebilir.
