# Ubah Raspberry Pi Anda Menjadi Server FTP Aman dengan Relay Email {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Punya Raspberry Pi yang tidak terpakai? Baik itu Pi 5 terbaru, Pi 4, Pi Zero, atau bahkan model lama, panduan ini akan menunjukkan cara mengubahnya menjadi server file yang kuat dan otomatis dengan kemampuan relay email. Sempurna untuk kamera keamanan, perangkat IoT, dan lainnya.

**Kompatibel dengan:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, dan Raspberry Pi Zero.

> \[!NOTE]
> Panduan ini telah diuji dan diverifikasi pada Raspberry Pi 3 Model B yang menjalankan Ubuntu Server 22.04 LTS.


## Daftar Isi {#table-of-contents}

* [Apa yang Akan Kita Bangun](#what-were-building)
* [Bagian 1: Mendapatkan Ubuntu Server di Pi Anda](#part-1-getting-ubuntu-server-on-your-pi)
  * [Apa yang Anda Butuhkan](#what-youll-need)
  * [Mem-flash OS](#flashing-the-os)
  * [Menyalakan & Menghubungkan](#booting-up--connecting)
* [Bagian 2: Menyiapkan Server FTP Aman](#part-2-setting-up-a-secure-ftp-server)
  * [Instalasi & Konfigurasi](#installation--configuration)
  * [Membuat Pengguna FTP](#creating-an-ftp-user)
* [Bagian 3: Firewall dan Perlindungan Brute-Force](#part-3-firewall-and-brute-force-protection)
  * [Menyiapkan UFW](#setting-up-ufw)
  * [Menyiapkan Fail2ban](#setting-up-fail2ban)
* [Bagian 4: Pemrosesan File Otomatis dengan Notifikasi Email](#part-4-automated-file-processing-with-email-notifications)
  * [Opsi 1: Menggunakan Forward Email API (Direkomendasikan)](#option-1-using-forward-email-api-recommended)
  * [Opsi 2: Menggunakan Penyedia Email Lain](#option-2-using-other-email-providers)
  * [Membuat Service Systemd](#create-a-systemd-service)
* [Bagian 5: Opsi Email untuk Perangkat Legacy](#part-5-email-options-for-legacy-devices)
  * [Opsi 1: Gunakan Port TLS 1.0 Legacy Forward Email (Direkomendasikan)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Opsi 2: Menyiapkan Relay SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Pemecahan Masalah](#troubleshooting)
* [Penutup](#wrapping-up)


## Apa yang Akan Kita Bangun {#what-were-building}

Panduan ini akan memandu Anda menyiapkan sistem lengkap yang mencakup:

* **Ubuntu Server 22.04 LTS:** OS ringan dan stabil untuk Pi.
* **Server FTP Aman (vsftpd):** Untuk mengunggah file dengan aman.
* **Firewall (UFW) & Fail2ban:** Untuk menjaga agar pihak tidak diinginkan tidak masuk.
* **Pemroses File Otomatis:** Skrip yang mengambil file baru, mengirimkannya lewat email sebagai lampiran, lalu membersihkan dirinya sendiri.
* **Opsi Email untuk Perangkat Legacy:** Dua pendekatan untuk perangkat yang tidak mendukung TLS modern:
  * Gunakan port TLS 1.0 legacy Forward Email (paling mudah)
  * Siapkan relay SMTP Postfix (bekerja dengan penyedia email apa pun)

Siap? Mari mulai.


## Bagian 1: Mendapatkan Ubuntu Server di Pi Anda {#part-1-getting-ubuntu-server-on-your-pi}

Hal pertama yang harus dilakukan adalah menjalankan Ubuntu Server di Raspberry Pi. Ini sangat mudah berkat Raspberry Pi Imager.

### Apa yang Anda Butuhkan {#what-youll-need}

* Raspberry Pi yang kompatibel (lihat daftar di atas)
* Kartu microSD (minimal 8GB, disarankan 16GB ke atas)
* Komputer dengan pembaca kartu microSD
* Catu daya yang sesuai untuk model Pi Anda
* Akses internet (Ethernet atau Wi-Fi)

> \[!NOTE]
> Model lama seperti Raspberry Pi 2 atau Pi Zero mungkin lebih lambat tapi tetap bisa digunakan untuk pengaturan ini.

### Mem-flash OS {#flashing-the-os}

1. **Dapatkan Raspberry Pi Imager:** Unduh dari [situs resmi](https://www.raspberrypi.com/software/).

2. **Pilih OS:** Di imager, pilih "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Untuk model 64-bit (Pi 3, 4, 5, Zero 2 W), pilih **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Untuk model 32-bit lama (Pi 2, Pi Zero, Pi Zero W), pilih **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Pilih Penyimpanan:** Pilih kartu microSD Anda.

> \[!WARNING]
> Ini akan menghapus seluruh isi kartu microSD Anda. Pastikan Anda sudah membackup data penting.

4. **Opsi Lanjutan adalah Teman Anda:** Klik ikon roda gigi (⚙️) untuk mengatur Pi dalam mode headless (tanpa monitor atau keyboard).
   * **Hostname:** Beri nama Pi Anda (misal, `pi-server`).
   * **SSH:** Aktifkan dan atur nama pengguna serta kata sandi.
   * **Wi-Fi:** Jika tidak menggunakan Ethernet, masukkan detail Wi-Fi Anda.
   * **Locale:** Atur zona waktu dan tata letak keyboard.
5. **Tulis!** Klik tombol "WRITE" dan biarkan imager melakukan tugasnya.

### Booting Up & Connecting {#booting-up--connecting}

Setelah imager selesai, masukkan kartu microSD ke dalam Pi dan colokkan. Beri beberapa menit untuk booting. Sistem sedang melakukan beberapa pengaturan awal di latar belakang. Temukan alamat IP-nya dari halaman admin router Anda, lalu sambungkan melalui SSH:

```bash
ssh your_username@your_pi_ip_address
```

Anda sudah masuk! Raspberry Pi sekarang siap untuk dikonfigurasi.


## Bagian 2: Menyiapkan Server FTP yang Aman {#part-2-setting-up-a-secure-ftp-server}

Selanjutnya, siapkan `vsftpd` (Very Secure FTP Daemon), yang dikonfigurasi untuk keamanan maksimal.

### Instalasi & Konfigurasi {#installation--configuration}

1. **Pasang vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Cadangkan file konfigurasi:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Edit konfigurasi:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Jika sebuah baris dikomentari (dimulai dengan `#`), hapus tanda `#` untuk mengaktifkannya.

Lakukan perubahan berikut:

| Pengaturan               | Nilai | Tujuan                                                    |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Nonaktifkan akses FTP anonim                              |
| `local_enable`           | `YES` | Izinkan pengguna lokal untuk masuk                        |
| `write_enable`           | `YES` | Aktifkan unggahan file                                    |
| `local_umask`            | `022` | Atur izin file (644 untuk file, 755 untuk direktori)      |
| `chroot_local_user`      | `YES` | Batasi pengguna ke direktori home mereka                  |
| `allow_writeable_chroot` | `YES` | Izinkan unggahan di jail chroot                           |

4. **Tambahkan Rentang Port Pasif:** Tambahkan baris berikut di akhir file. Ini diperlukan untuk firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Aktifkan Logging:** Tambahkan baris berikut untuk mengaktifkan logging bagi Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Simpan dan Mulai Ulang:** Tekan `Ctrl+O`, `Enter`, `Ctrl+X`, lalu mulai ulang layanan:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Membuat Pengguna FTP {#creating-an-ftp-user}

Buat pengguna khusus yang dibatasi untuk akses FTP.

1. **Buat pengguna:**

   ```bash
   sudo adduser ftpuser
   ```

   Ikuti petunjuk untuk mengatur kata sandi. Kolom lain (nama, telepon, dll.) bisa dikosongkan.

2. **Buat struktur direktori:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Direktori utama FTP
   * `/home/ftpuser/ftp/uploads` - Tempat file akan diunggah

3. **Atur izin:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Bagian 3: Firewall dan Perlindungan Brute-Force {#part-3-firewall-and-brute-force-protection}

Amankan Pi dengan UFW (Uncomplicated Firewall) dan Fail2ban.

### Menyiapkan UFW {#setting-up-ufw}

1. **Pasang UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Atur kebijakan default:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Izinkan SSH (penting!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Selalu izinkan SSH sebelum mengaktifkan firewall, atau Anda akan terkunci dari akses!

4. **Izinkan port FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Aktifkan firewall:**

   ```bash
   sudo ufw enable
   ```

### Menyiapkan Fail2ban {#setting-up-fail2ban}

Fail2ban secara otomatis memblokir alamat IP setelah beberapa kali percobaan login gagal.

1. **Pasang Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Buat konfigurasi lokal:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Tambahkan konfigurasi berikut:**
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

Jadikan dapat dieksekusi:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Buat Layanan Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Tambahkan konten ini:

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

Aktifkan dan mulai layanan:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Periksa status:

```bash
sudo systemctl status ftp-monitor.service
```


## Bagian 5: Opsi Email untuk Perangkat Legacy {#part-5-email-options-for-legacy-devices}

Perangkat seperti kamera FOSSCAM sering kali tidak mendukung versi TLS modern. Ada dua solusi:

### Opsi 1: Gunakan Port TLS 1.0 Legacy Forward Email (Direkomendasikan) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Jika Anda menggunakan Forward Email, ini adalah solusi termudah. Forward Email menyediakan port TLS 1.0 legacy khusus untuk perangkat lama seperti kamera, printer, pemindai, dan mesin faks.

#### Harga {#pricing}

Forward Email menawarkan beberapa paket:

| Paket                   | Harga        | Fitur                                  |
| ----------------------- | ------------ | ------------------------------------- |
| Gratis                  | $0/bulan     | Penerusan email saja (tanpa pengiriman) |
| **Perlindungan Ditingkatkan** | **$3/bulan** | **Akses SMTP + port TLS 1.0 legacy**    |
| Tim                     | $9/bulan     | Perlindungan Ditingkatkan + fitur tim |
| Perusahaan              | $250/bulan   | Tim + permintaan API tanpa batas       |

> \[!IMPORTANT]
> Paket **Perlindungan Ditingkatkan ($3/bulan)** atau lebih tinggi diperlukan untuk akses SMTP dan dukungan port TLS 1.0 legacy.

Pelajari lebih lanjut di [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Buat Kata Sandi Anda {#generate-your-password}

Sebelum mengonfigurasi perangkat Anda, buat kata sandi di Forward Email:

1. Masuk ke [Forward Email](https://forwardemail.net)
2. Navigasi ke **Akun Saya → Domain → \[Domain Anda] → Alias**
3. Buat atau pilih alias (misalnya, `camera@yourdomain.com`)
4. Klik **"Generate Password"** di samping alias
5. Salin kata sandi yang dibuat - Anda akan menggunakannya untuk otentikasi SMTP

> \[!TIP]
> Setiap alias dapat memiliki kata sandi sendiri. Ini berguna untuk melacak perangkat mana yang mengirim email.

#### Konfigurasikan Perangkat Anda {#configure-your-device}

Gunakan pengaturan ini di kamera, printer, pemindai, atau perangkat legacy lainnya:

| Pengaturan      | Nilai                                             |
| --------------- | ------------------------------------------------- |
| Server SMTP     | `smtp.forwardemail.net`                           |
| Port (SSL/TLS)  | `2455`                                            |
| Port (STARTTLS) | `2555` (alternatif)                               |
| Nama Pengguna   | Email alias Anda (misalnya, `camera@yourdomain.com`) |
| Kata Sandi      | Kata sandi dari "Generate Password"               |
| Otentikasi      | Diperlukan                                        |
| Enkripsi       | SSL/TLS (direkomendasikan) atau STARTTLS           |

> \[!WARNING]
> Port ini menggunakan protokol TLS 1.0 yang sudah usang dan memiliki kerentanan keamanan yang diketahui (BEAST, POODLE). Gunakan hanya jika perangkat Anda tidak mendukung TLS 1.2+ modern.

Cukup konfigurasikan perangkat Anda dengan pengaturan ini dan perangkat akan mengirim email langsung melalui Forward Email tanpa perlu server relay lokal.

Untuk detail lebih lanjut, lihat [FAQ Forward Email tentang Dukungan TLS Legacy](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Opsi 2: Atur Relay SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Jika Anda tidak menggunakan Forward Email, atau lebih memilih solusi relay lokal, atur Postfix di Raspberry Pi untuk bertindak sebagai perantara. Ini bekerja dengan penyedia email apa pun (Gmail, Outlook, Yahoo, AOL, dll.).

#### Instal Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Selama instalasi:

* Pilih **"Internet Site"**
* Masukkan hostname Pi Anda (misalnya, `raspberrypi-ftp`) untuk "System mail name"

#### Pilih Penyedia Email Anda {#choose-your-email-provider}

| Penyedia | Server SMTP           | Port | Perlu Password Aplikasi? |
| -------- | --------------------- | ---- | ------------------------ |
| Gmail    | smtp.gmail.com        | 587  | Ya                       |
| Outlook  | smtp-mail.outlook.com | 587  | Ya                       |
| Yahoo    | smtp.mail.yahoo.com   | 465  | Ya                       |
| AOL      | smtp.aol.com          | 587  | Ya                       |

#### Dapatkan Password Khusus Aplikasi {#get-an-app-specific-password}

Sebagian besar penyedia memerlukan password aplikasi untuk aplikasi pihak ketiga. Buat satu dari pengaturan keamanan penyedia email Anda:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Jangan pernah menggunakan password email biasa Anda. Selalu gunakan password khusus aplikasi.

#### Konfigurasikan Otentikasi SASL {#configure-sasl-authentication}

Buat file password untuk penyedia yang Anda pilih. Contoh ini menggunakan Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Tambahkan baris ini (sesuaikan server dan port untuk penyedia Anda):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Untuk Gmail, gunakan:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Amankan dan hash file tersebut:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Konfigurasikan Pemetaan Alamat Email {#configure-email-address-mapping}

Tulis ulang alamat email lokal agar sesuai dengan penyedia email Anda:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Tambahkan baris ini (ganti `HOSTNAME` dengan hostname Pi Anda dan gunakan email Anda):

```
/.+@HOSTNAME/    your_email@provider.com
```

Contoh:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Amankan file tersebut:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Konfigurasikan Pengaturan Utama Postfix {#configure-postfix-main-settings}

Edit konfigurasi utama:

```bash
sudo nano /etc/postfix/main.cf
```

Cari dan perbarui relay host (atau tambahkan di akhir):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Tambahkan pengaturan ini di akhir file:

```
# Konfigurasi SMTP Relay
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Pengaturan jaringan
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Untuk Gmail (port 587), atur `smtp_tls_wrappermode = no` bukan `yes`.

> \[!WARNING]
> Perbarui `mynetworks` dengan rentang jaringan Anda yang sebenarnya. Hanya tambahkan jaringan yang dipercaya - perangkat apa pun di jaringan ini dapat mengirim email tanpa otentikasi.

**Rentang jaringan umum:**

| Rentang Jaringan  | Rentang Alamat IP           |
| ----------------- | --------------------------- |
| `192.168.0.0/24`  | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24`  | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`      | 10.0.0.0 - 10.255.255.255   |

#### Perbarui Firewall dan Mulai Ulang {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Verifikasi Postfix berjalan:

```bash
sudo systemctl status postfix
```

#### Uji Relay {#test-the-relay}

Kirim email uji:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Periksa log:

```bash
sudo tail -f /var/log/mail.log
```

Cari `status=sent` untuk memastikan keberhasilan.

#### Konfigurasikan Perangkat Anda {#configure-your-device-1}

Di pengaturan kamera atau perangkat Anda:
* **Server SMTP:** Alamat IP Pi Anda (misalnya, `192.168.1.100`)
* **Port SMTP:** `25`
* **Autentikasi:** Tidak ada
* **Enkripsi:** Tidak ada (hanya jaringan lokal)


## Pemecahan Masalah {#troubleshooting}

Jika terjadi masalah, periksa file log berikut:

**Server FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Pemantau File:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Lihat antrean email
```


## Menyelesaikan {#wrapping-up}

Raspberry Pi sekarang menjadi sistem otomatis lengkap dengan unggahan file yang aman, notifikasi email otomatis dengan lampiran, dan kemampuan relay SMTP untuk perangkat lama. Baik menggunakan port TLS warisan Forward Email atau relay Postfix lokal, perangkat lama kini dapat mengirim email dengan andal melalui penyedia email modern.
