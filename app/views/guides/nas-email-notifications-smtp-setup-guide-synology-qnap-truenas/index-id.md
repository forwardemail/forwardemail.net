# Panduan Lengkap Pengaturan Email NAS dengan Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Mengatur notifikasi email di NAS Anda seharusnya tidak menyulitkan. Baik Anda menggunakan Synology, QNAP, atau bahkan setup Raspberry Pi, panduan ini akan membuat perangkat Anda terhubung dengan Forward Email sehingga Anda benar-benar tahu kapan ada masalah.

Sebagian besar perangkat NAS dapat mengirim peringatan email untuk kegagalan drive, peringatan suhu, penyelesaian backup, dan kejadian keamanan. Masalahnya? Banyak penyedia email yang semakin ketat soal keamanan, dan perangkat lama seringkali tidak bisa mengikutinya. Di sinilah Forward Email berperan - kami mendukung perangkat modern maupun legacy.

Panduan ini mencakup pengaturan email untuk lebih dari 75 penyedia NAS dengan instruksi langkah demi langkah, info kompatibilitas, dan tips pemecahan masalah. Tidak peduli perangkat apa yang Anda gunakan, kami akan membuat notifikasi Anda berfungsi.


## Daftar Isi {#table-of-contents}

* [Mengapa Anda Membutuhkan Notifikasi Email NAS](#why-you-need-nas-email-notifications)
* [Masalah TLS (Dan Cara Kami Memperbaikinya)](#the-tls-problem-and-how-we-fix-it)
* [Pengaturan SMTP Forward Email](#forward-email-smtp-settings)
* [Matriks Kompatibilitas Penyedia NAS Lengkap](#comprehensive-nas-provider-compatibility-matrix)
* [Konfigurasi Email Synology NAS](#synology-nas-email-configuration)
  * [Langkah-langkah Konfigurasi](#configuration-steps)
* [Konfigurasi Email QNAP NAS](#qnap-nas-email-configuration)
  * [Langkah-langkah Konfigurasi](#configuration-steps-1)
  * [Masalah Umum Pemecahan Masalah QNAP](#common-qnap-troubleshooting-issues)
* [Konfigurasi Legacy ReadyNAS](#readynas-legacy-configuration)
  * [Langkah-langkah Konfigurasi Legacy](#legacy-configuration-steps)
  * [Pemecahan Masalah ReadyNAS](#readynas-troubleshooting)
* [Konfigurasi TerraMaster NAS](#terramaster-nas-configuration)
* [Konfigurasi ASUSTOR NAS](#asustor-nas-configuration)
* [Konfigurasi Buffalo TeraStation](#buffalo-terastation-configuration)
* [Konfigurasi Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Konfigurasi Email TrueNAS](#truenas-email-configuration)
* [Konfigurasi OpenMediaVault](#openmediavault-configuration)
* [Konfigurasi Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Setup Awal Raspberry Pi](#initial-raspberry-pi-setup)
  * [Konfigurasi Samba File Sharing](#samba-file-sharing-configuration)
  * [Setup Server FTP](#ftp-server-setup)
  * [Konfigurasi Notifikasi Email](#email-notification-configuration)
  * [Fitur Lanjutan Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Pemecahan Masalah Email Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Optimasi Performa](#performance-optimization)
  * [Pertimbangan Keamanan](#security-considerations)


## Mengapa Anda Membutuhkan Notifikasi Email NAS {#why-you-need-nas-email-notifications}

NAS Anda memantau banyak hal - kesehatan drive, suhu, masalah jaringan, kejadian keamanan. Tanpa peringatan email, masalah bisa tidak terdeteksi selama berminggu-minggu, yang berpotensi menyebabkan kehilangan data atau pelanggaran keamanan.

Notifikasi email memberi Anda peringatan segera saat drive mulai gagal, memperingatkan tentang upaya akses tidak sah, mengonfirmasi backup berhasil, dan menjaga Anda tetap mendapat informasi tentang kesehatan sistem. Forward Email memastikan notifikasi penting ini benar-benar sampai kepada Anda.


## Masalah TLS (Dan Cara Kami Memperbaikinya) {#the-tls-problem-and-how-we-fix-it}

Begini masalahnya: jika NAS Anda dibuat sebelum 2020, kemungkinan hanya mendukung TLS 1.0. Gmail, Outlook, dan sebagian besar penyedia sudah menghentikan dukungan untuk itu bertahun-tahun lalu. Perangkat Anda mencoba mengirim email, ditolak, dan Anda tidak tahu apa-apa.

Forward Email memperbaikinya dengan dukungan dual-port. Perangkat modern menggunakan port standar kami (`465` dan `587`), sementara perangkat lama bisa menggunakan port legacy kami (`2455` dan `2555`) yang masih mendukung TLS 1.0.

> \[!IMPORTANT]
> Forward Email mendukung perangkat NAS modern dan legacy melalui strategi dual-port kami. Gunakan port 465/587 untuk perangkat modern dengan dukungan TLS 1.2+, dan port 2455/2555 untuk perangkat legacy yang hanya mendukung TLS 1.0.


## Pengaturan SMTP Forward Email {#forward-email-smtp-settings}
Berikut yang perlu Anda ketahui tentang pengaturan SMTP kami:

**Untuk perangkat NAS modern (2020+):** Gunakan `smtp.forwardemail.net` dengan port `465` (SSL/TLS) atau port `587` (STARTTLS). Ini bekerja dengan firmware saat ini yang mendukung TLS 1.2+.

**Untuk perangkat NAS lama:** Gunakan `smtp.forwardemail.net` dengan port `2455` (SSL/TLS) atau port `2555` (STARTTLS). Ini mendukung TLS 1.0 untuk perangkat warisan.

**Otentikasi:** Gunakan alias Forward Email Anda sebagai nama pengguna dan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) (bukan kata sandi akun Anda).

> \[!CAUTION]
> Jangan pernah menggunakan kata sandi login akun Anda untuk otentikasi SMTP. Selalu gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) untuk konfigurasi NAS.

> \[!TIP]
> Periksa versi firmware perangkat NAS Anda dan dukungan TLS sebelum konfigurasi. Sebagian besar perangkat yang dibuat setelah 2020 mendukung protokol TLS modern, sementara perangkat lama biasanya memerlukan port kompatibilitas warisan.


## Matriks Kompatibilitas Penyedia NAS Komprehensif {#comprehensive-nas-provider-compatibility-matrix}

Matriks berikut memberikan informasi kompatibilitas terperinci untuk penyedia NAS utama, termasuk tingkat dukungan TLS, status firmware, dan pengaturan konfigurasi Forward Email yang direkomendasikan.

| Penyedia NAS     | Model Saat Ini  | Dukungan TLS | Status Firmware | Port yang Direkomendasikan | Masalah Umum                                                                                                                                          | Panduan Pengaturan/Tangkapan Layar                                                                                                               |
| ---------------- | --------------- | ------------ | --------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Synology         | DSM 7.x         | TLS 1.2+     | Aktif           | `465`, `587`               | [Konfigurasi STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                       | [Pengaturan Notifikasi Email DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                             |
| QNAP             | QTS 5.x         | TLS 1.2+     | Aktif           | `465`, `587`               | [Kegagalan Notification Center](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525) | [Konfigurasi Server Email QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html)    |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+     | Aktif           | `465`, `587`               | [Masalah resolusi DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                   | [Panduan Pengaturan Email Raspberry Pi](#raspberry-pi-nas-configuration)                                                                         |
| ASUSTOR          | ADM 4.x         | TLS 1.2+     | Aktif           | `465`, `587`               | [Validasi sertifikat](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                        | [Pengaturan Notifikasi ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                             |
| TerraMaster      | TOS 6.x         | TLS 1.2      | Aktif           | `465`, `587`               | [Otentikasi SMTP](https://www.terra-master.com/global/forum/)                                                                                       | [Konfigurasi Email TerraMaster](https://www.terra-master.com/global/support/download.php)                                                        |
| TrueNAS          | SCALE/CORE      | TLS 1.2+     | Aktif           | `465`, `587`               | [Pengaturan sertifikat SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                        | [Panduan Pengaturan Email TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                |
| Buffalo          | TeraStation     | TLS 1.2      | Terbatas        | `465`, `587`               | [Kompatibilitas firmware](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)       | [Pengaturan Email TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5   | TLS 1.2      | Terbatas        | `465`, `587`               | [Kompatibilitas OS warisan](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                            | [Konfigurasi Email My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                       |
| OpenMediaVault   | OMV 7.x         | TLS 1.2+     | Aktif           | `465`, `587`               | [Ketergantungan plugin](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                  | [Pengaturan Notifikasi OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                |
| Netgear ReadyNAS | OS 6.x          | TLS 1.0 saja | Dihentikan      | `2455`, `2555`             | [Dukungan TLS warisan](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                      | [Pengaturan Peringatan Email ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)  |
| Drobo            | Dashboard       | TLS 1.2      | Dihentikan      | `465`, `587`               | [Dukungan terbatas](https://myprojects.drobo.com/support/)                                                                                           | [Notifikasi Email Drobo](https://www.drobo.com/support/)                                                                                        |
Matriks ini menunjukkan pembagian yang jelas antara sistem NAS modern yang aktif dipelihara dan perangkat warisan yang memerlukan pertimbangan kompatibilitas khusus. Mayoritas perangkat NAS saat ini mendukung standar TLS modern dan dapat menggunakan port SMTP utama Forward Email tanpa konfigurasi khusus.


## Konfigurasi Email Synology NAS {#synology-nas-email-configuration}

Perangkat Synology dengan DSM cukup mudah untuk disiapkan. Mereka mendukung TLS modern, jadi Anda dapat menggunakan port standar kami tanpa masalah.

> \[!NOTE]
> Synology DSM 7.x menyediakan fitur notifikasi email yang paling lengkap. Versi DSM yang lebih lama mungkin memiliki opsi konfigurasi yang terbatas.

### Langkah-Langkah Konfigurasi {#configuration-steps}

1. **Akses antarmuka web DSM** dengan memasukkan alamat IP perangkat NAS Anda atau QuickConnect ID di browser web.

2. **Navigasi ke Control Panel** dan pilih bagian "Notification", lalu klik tab "Email" untuk mengakses opsi konfigurasi email.

3. **Aktifkan notifikasi email** dengan mencentang kotak "Enable email notifications".

4. **Konfigurasikan server SMTP** dengan memasukkan `smtp.forwardemail.net` sebagai alamat server.

5. **Atur konfigurasi port** ke port 465 untuk koneksi SSL/TLS (direkomendasikan). Port 587 dengan STARTTLS juga didukung sebagai alternatif.

6. **Konfigurasikan autentikasi** dengan memilih "SMTP authentication required" dan masukkan alias Forward Email Anda di kolom username.

7. **Masukkan kata sandi Anda** menggunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **Atur alamat penerima** dengan memasukkan hingga lima alamat email yang harus menerima notifikasi.

9. **Konfigurasikan penyaringan notifikasi** untuk mengontrol event mana yang memicu peringatan email, mencegah kelebihan notifikasi sekaligus memastikan event penting dilaporkan.

10. **Uji konfigurasi** menggunakan fungsi tes bawaan DSM untuk memverifikasi bahwa semua pengaturan benar dan komunikasi dengan server Forward Email berjalan dengan baik.

> \[!TIP]
> Synology memungkinkan tipe notifikasi berbeda untuk penerima yang berbeda, memberikan fleksibilitas dalam distribusi peringatan di tim Anda.


## Konfigurasi Email QNAP NAS {#qnap-nas-email-configuration}

Perangkat QNAP dengan QTS bekerja dengan baik bersama Forward Email. Mereka mendukung TLS modern dan memiliki antarmuka web yang bagus untuk konfigurasi.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 memiliki masalah yang diketahui dengan notifikasi email yang telah [diperbaiki di QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Pastikan firmware Anda diperbarui untuk menghindari kegagalan notifikasi.

### Langkah-Langkah Konfigurasi {#configuration-steps-1}

1. **Akses antarmuka web perangkat QNAP Anda** dengan memasukkan alamat IP-nya di browser web.

2. **Navigasi ke Control Panel** dan pilih "Service Account and Device Pairing," lalu klik bagian "E-mail" untuk memulai konfigurasi email.

3. **Klik "Add SMTP Service"** untuk membuat konfigurasi email baru.

4. **Konfigurasikan server SMTP** dengan memasukkan `smtp.forwardemail.net` sebagai alamat server SMTP.

5. **Pilih protokol keamanan yang sesuai** - pilih "SSL/TLS" dengan port `465` (direkomendasikan). Port `587` dengan STARTTLS juga didukung.

6. **Konfigurasikan nomor port** - port `465` dengan SSL/TLS direkomendasikan. Port `587` dengan STARTTLS juga tersedia jika diperlukan.

7. **Masukkan kredensial autentikasi Anda** menggunakan alias Forward Email Anda sebagai username dan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **Konfigurasikan informasi pengirim** dengan memasukkan nama deskriptif untuk kolom "From", seperti "QNAP NAS System" atau hostname perangkat Anda.

9. **Atur alamat penerima** untuk berbagai tipe notifikasi. QNAP memungkinkan Anda mengonfigurasi beberapa grup penerima untuk tipe peringatan yang berbeda.

10. **Uji konfigurasi** menggunakan fungsi tes email bawaan QNAP untuk memverifikasi semua pengaturan berfungsi dengan baik.

> \[!TIP]
> Jika Anda mengalami [masalah konfigurasi SMTP Gmail](https://forum.qnap.com/viewtopic.php?t=152466), langkah pemecahan masalah yang sama berlaku untuk Forward Email. Pastikan autentikasi diaktifkan dengan benar dan kredensial sudah tepat.
> \[!NOTE]
> Perangkat QNAP mendukung penjadwalan notifikasi lanjutan, memungkinkan Anda mengonfigurasi jam tenang ketika notifikasi non-kritis ditekan. Ini sangat berguna terutama di lingkungan bisnis.

### Masalah Umum Pemecahan Masalah QNAP {#common-qnap-troubleshooting-issues}

Jika perangkat QNAP Anda [gagal mengirim email notifikasi](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), periksa hal berikut:

* Verifikasi kredensial Forward Email Anda sudah benar
* Pastikan alamat server SMTP tepat `smtp.forwardemail.net`
* Konfirmasi port sesuai dengan metode enkripsi Anda (`465` untuk SSL/TLS direkomendasikan; `587` untuk STARTTLS juga didukung)
* Periksa bahwa [konfigurasi server SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) mengizinkan koneksi


## Konfigurasi Legacy ReadyNAS {#readynas-legacy-configuration}

Perangkat Netgear ReadyNAS menghadirkan tantangan unik karena dukungan firmware yang dihentikan dan ketergantungan pada protokol TLS 1.0 legacy. Namun, dukungan port legacy Forward Email memastikan perangkat ini dapat terus mengirim notifikasi email dengan andal.

> \[!CAUTION]
> ReadyNAS OS 6.x hanya mendukung TLS 1.0, yang memerlukan port kompatibilitas legacy Forward Email `2455` dan `2555`. Port modern `465` dan `587` tidak akan berfungsi dengan perangkat ini.

### Langkah Konfigurasi Legacy {#legacy-configuration-steps}

1. **Akses antarmuka web ReadyNAS** dengan memasukkan alamat IP perangkat di browser web.

2. **Navigasi ke System > Settings > Alerts** untuk mengakses bagian konfigurasi email.

3. **Konfigurasikan server SMTP** dengan memasukkan `smtp.forwardemail.net` sebagai alamat server.

4. **Atur konfigurasi port** ke `2455` untuk koneksi SSL/TLS atau `2555` untuk koneksi STARTTLS - ini adalah port kompatibilitas legacy Forward Email.

5. **Aktifkan autentikasi** dan masukkan alias Forward Email Anda sebagai nama pengguna serta kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Konfigurasikan informasi pengirim** dengan alamat "From" yang deskriptif untuk mengidentifikasi perangkat ReadyNAS.

7. **Tambahkan alamat email penerima** menggunakan tombol + di bagian kontak email.

8. **Uji konfigurasi** untuk memastikan koneksi TLS legacy berfungsi dengan baik.

> \[!IMPORTANT]
> Perangkat ReadyNAS memerlukan port legacy karena tidak dapat membangun koneksi aman menggunakan protokol TLS modern. Ini adalah [batasan yang diketahui](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) dari firmware yang dihentikan.

### Pemecahan Masalah ReadyNAS {#readynas-troubleshooting}

Masalah umum dengan konfigurasi email ReadyNAS meliputi:

* **Ketidakcocokan versi TLS**: Pastikan Anda menggunakan port `2455` atau `2555`, bukan port modern
* **Kegagalan autentikasi**: Verifikasi kredensial Forward Email Anda sudah benar
* **Konektivitas jaringan**: Periksa bahwa ReadyNAS dapat mengakses `smtp.forwardemail.net`
* **Batasan firmware**: Beberapa model ReadyNAS lama mungkin memiliki [persyaratan konfigurasi HTTPS tambahan](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Perangkat ReadyNAS yang menjalankan OS 6.x dan versi sebelumnya hanya mendukung koneksi TLS 1.0, yang sebagian besar penyedia email modern tidak lagi terima. Port legacy khusus Forward Email (2455 dan 2555) secara khusus mendukung protokol lama ini, memastikan fungsi berkelanjutan bagi pengguna ReadyNAS.

Untuk mengonfigurasi email pada perangkat ReadyNAS, akses antarmuka web perangkat melalui alamat IP-nya. Navigasi ke bagian System dan pilih "Notifications" untuk mengakses opsi konfigurasi email.

Di bagian konfigurasi email, aktifkan notifikasi email dan masukkan smtp.forwardemail.net sebagai server SMTP. Ini penting - gunakan port kompatibel legacy Forward Email daripada port SMTP standar.

Untuk koneksi SSL/TLS, konfigurasikan port 2455 menggantikan port standar 465 (direkomendasikan). Untuk koneksi STARTTLS, gunakan port 2555 menggantikan port 587. Port khusus ini mempertahankan kompatibilitas TLS 1.0 sambil memberikan keamanan terbaik yang tersedia untuk perangkat legacy.
Masukkan alias Forward Email Anda sebagai nama pengguna dan kata sandi yang dihasilkan untuk otentikasi. Perangkat ReadyNAS mendukung otentikasi SMTP, yang diperlukan untuk koneksi Forward Email.

Konfigurasikan alamat email pengirim dan alamat penerima sesuai dengan kebutuhan notifikasi Anda. ReadyNAS memungkinkan beberapa alamat penerima, sehingga Anda dapat mendistribusikan peringatan ke anggota tim atau akun email yang berbeda.

Uji konfigurasi dengan cermat, karena perangkat ReadyNAS mungkin tidak memberikan pesan kesalahan yang rinci jika konfigurasi gagal. Jika pengujian standar tidak berhasil, pastikan Anda menggunakan port legacy yang benar (2455 atau 2555) daripada port SMTP modern.

Pertimbangkan implikasi keamanan dari penggunaan protokol TLS legacy. Meskipun port legacy Forward Email memberikan keamanan terbaik yang tersedia untuk perangkat lama, disarankan untuk meningkatkan ke sistem NAS modern dengan dukungan TLS terkini jika memungkinkan.


## Konfigurasi TerraMaster NAS {#terramaster-nas-configuration}

Perangkat TerraMaster yang menjalankan TOS 6.x mendukung TLS modern dan bekerja dengan baik dengan port standar Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x menyediakan fitur notifikasi email yang komprehensif. Pastikan firmware Anda diperbarui untuk kompatibilitas terbaik.

1. **Akses Pengaturan Sistem**
   * Masuk ke antarmuka web TerraMaster Anda
   * Navigasi ke **Control Panel** > **Notification**

2. **Konfigurasikan Pengaturan SMTP**
   * Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, direkomendasikan) atau `587` (STARTTLS)
   * Nama pengguna: Alias Forward Email Anda
   * Kata sandi: Kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Aktifkan Notifikasi**
   * Centang jenis notifikasi yang ingin Anda terima
   * Uji konfigurasi dengan fungsi uji bawaan

> \[!TIP]
> Perangkat TerraMaster bekerja paling baik dengan port `465` untuk koneksi SSL/TLS (direkomendasikan). Jika mengalami masalah, port `587` dengan STARTTLS juga didukung.


## Konfigurasi ASUSTOR NAS {#asustor-nas-configuration}

Perangkat ASUSTOR dengan ADM 4.x memiliki dukungan notifikasi email yang solid dan bekerja mulus dengan Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x menyertakan opsi penyaringan notifikasi lanjutan. Anda dapat menyesuaikan event mana yang memicu peringatan email.

1. **Buka Pengaturan Notifikasi**
   * Akses antarmuka web ADM
   * Pergi ke **Settings** > **Notification**

2. **Atur Konfigurasi SMTP**
   * Server SMTP: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, direkomendasikan) atau `587` (STARTTLS)
   * Otentikasi: Aktifkan
   * Nama pengguna: Alias Forward Email Anda
   * Kata sandi: Kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Konfigurasikan Jenis Peringatan**
   * Pilih event sistem mana yang harus memicu email
   * Atur alamat penerima
   * Uji konfigurasi

> \[!IMPORTANT]
> Perangkat ASUSTOR mengharuskan otentikasi diaktifkan secara eksplisit dalam pengaturan SMTP. Jangan lupa untuk mencentang opsi ini.


## Konfigurasi Buffalo TeraStation {#buffalo-terastation-configuration}

Perangkat Buffalo TeraStation memiliki kemampuan notifikasi email yang terbatas namun fungsional. Pengaturan cukup sederhana setelah Anda tahu di mana mencarinya.

> \[!CAUTION]
> Pembaruan firmware Buffalo TeraStation jarang dilakukan. Pastikan Anda menggunakan firmware terbaru yang tersedia untuk model Anda sebelum mengonfigurasi email.

1. **Akses Konfigurasi Web**
   * Sambungkan ke antarmuka web TeraStation Anda
   * Navigasi ke **System** > **Notification**

2. **Konfigurasikan Pengaturan Email**
   * Server SMTP: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, direkomendasikan) atau `587` (STARTTLS)
   * Nama pengguna: Alias Forward Email Anda
   * Kata sandi: Kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Aktifkan enkripsi SSL/TLS

3. **Atur Preferensi Notifikasi**
   * Pilih event mana yang memicu email (kesalahan disk, peringatan suhu, dll.)
   * Masukkan alamat email penerima
   * Simpan dan uji konfigurasi

> \[!NOTE]
> Beberapa model TeraStation lama mungkin memiliki opsi konfigurasi SMTP yang terbatas. Periksa dokumentasi model Anda untuk kemampuan spesifik.
## Konfigurasi Western Digital My Cloud {#western-digital-my-cloud-configuration}

Perangkat Western Digital My Cloud yang menjalankan OS 5 mendukung notifikasi email, meskipun antarmukanya bisa agak tersembunyi di pengaturan.

> \[!WARNING]
> Western Digital telah menghentikan dukungan untuk banyak model My Cloud. Periksa apakah perangkat Anda masih menerima pembaruan firmware sebelum mengandalkan notifikasi email untuk peringatan penting.

1. **Navigasi ke Pengaturan**
   * Buka dashboard web My Cloud
   * Pergi ke **Settings** > **General** > **Notifications**

2. **Konfigurasikan Detail SMTP**
   * Mail Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, direkomendasikan) atau `587` (STARTTLS)
   * Username: Alias Forward Email Anda
   * Password: Kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Aktifkan enkripsi

3. **Atur Jenis Peringatan**
   * Pilih kategori notifikasi (peringatan sistem, kesehatan disk, dll.)
   * Tambahkan alamat email penerima
   * Uji konfigurasi email

> \[!TIP]
> Kami menyarankan menggunakan port `465` dengan SSL/TLS. Jika mengalami masalah, port `587` dengan STARTTLS juga didukung.


## Konfigurasi Email TrueNAS {#truenas-email-configuration}

TrueNAS (baik SCALE maupun CORE) memiliki dukungan notifikasi email yang sangat baik dengan opsi konfigurasi yang rinci.

> \[!NOTE]
> TrueNAS menyediakan beberapa fitur notifikasi email paling komprehensif di antara sistem NAS. Anda dapat mengonfigurasi aturan peringatan yang detail dan beberapa penerima.

1. **Akses Pengaturan Sistem**
   * Masuk ke antarmuka web TrueNAS
   * Navigasi ke **System** > **Email**

2. **Konfigurasikan Pengaturan SMTP**
   * Outgoing Mail Server: `smtp.forwardemail.net`
   * Mail Server Port: `465` (direkomendasikan) atau `587`
   * Keamanan: SSL/TLS (untuk 465, direkomendasikan) atau STARTTLS (untuk 587)
   * Username: Alias Forward Email Anda
   * Password: Kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Atur Peringatan**
   * Pergi ke **System** > **Alert Services**
   * Konfigurasikan peringatan mana yang harus dikirim via email
   * Atur alamat penerima dan tingkat peringatan
   * Uji konfigurasi dengan fungsi uji bawaan

> \[!IMPORTANT]
> TrueNAS memungkinkan Anda mengonfigurasi tingkat peringatan yang berbeda (INFO, NOTICE, WARNING, ERROR, CRITICAL). Pilih tingkat yang sesuai untuk menghindari spam email sekaligus memastikan masalah kritis dilaporkan.


## Konfigurasi OpenMediaVault {#openmediavault-configuration}

OpenMediaVault menyediakan kemampuan notifikasi email yang solid melalui antarmuka webnya. Proses pengaturannya bersih dan sederhana.

> \[!NOTE]
> Sistem notifikasi OpenMediaVault berbasis plugin. Pastikan Anda telah menginstal dan mengaktifkan plugin notifikasi email.

1. **Akses Pengaturan Notifikasi**
   * Buka antarmuka web OpenMediaVault
   * Pergi ke **System** > **Notification** > **Email**

2. **Konfigurasikan Parameter SMTP**
   * SMTP Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, direkomendasikan) atau `587` (STARTTLS)
   * Username: Alias Forward Email Anda
   * Password: Kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Aktifkan SSL/TLS

3. **Atur Aturan Notifikasi**
   * Navigasi ke **System** > **Notification** > **Notifications**
   * Konfigurasikan event sistem mana yang harus memicu email
   * Atur alamat penerima
   * Uji fungsi email

> \[!TIP]
> OpenMediaVault memungkinkan Anda mengonfigurasi jadwal notifikasi. Anda dapat mengatur jam tenang atau membatasi frekuensi notifikasi untuk menghindari terlalu banyak peringatan.


## Konfigurasi Raspberry Pi NAS {#raspberry-pi-nas-configuration}

Raspberry Pi merupakan titik masuk yang sangat baik ke fungsi NAS, menawarkan solusi hemat biaya untuk lingkungan rumah dan kantor kecil. Menyiapkan Raspberry Pi sebagai perangkat NAS melibatkan konfigurasi protokol berbagi file, notifikasi email, dan layanan jaringan penting.

> \[!TIP]
> Untuk penggemar Raspberry Pi, kami sangat menyarankan melengkapi pengaturan NAS Anda dengan [PiKVM](https://pikvm.org/) untuk manajemen server jarak jauh dan [Pi-hole](https://pi-hole.net/) untuk pemblokiran iklan dan manajemen DNS di seluruh jaringan. Alat-alat ini menciptakan lingkungan lab rumah yang komprehensif.
### Pengaturan Awal Raspberry Pi {#initial-raspberry-pi-setup}

Sebelum mengonfigurasi layanan NAS, pastikan Raspberry Pi Anda menjalankan Raspberry Pi OS terbaru dan memiliki penyimpanan yang memadai. Kartu microSD berkualitas tinggi (Kelas 10 atau lebih baik) atau SSD USB 3.0 memberikan kinerja dan keandalan yang lebih baik untuk operasi NAS.

1. **Perbarui sistem** dengan menjalankan `sudo apt update && sudo apt upgrade -y` untuk memastikan semua paket terbaru.

2. **Aktifkan akses SSH** menggunakan `sudo systemctl enable ssh && sudo systemctl start ssh` untuk administrasi jarak jauh.

3. **Konfigurasikan alamat IP statis** dengan mengedit `/etc/dhcpcd.conf` untuk memastikan akses jaringan yang konsisten.

4. **Siapkan penyimpanan eksternal** dengan menghubungkan dan memasang drive USB atau mengonfigurasi array RAID untuk redundansi data.

### Konfigurasi Berbagi File Samba {#samba-file-sharing-configuration}

Samba menyediakan berbagi file yang kompatibel dengan Windows, membuat Raspberry Pi Anda dapat diakses dari perangkat apa pun di jaringan Anda. Proses konfigurasi meliputi pemasangan Samba, membuat share, dan mengatur autentikasi pengguna.

Pasang Samba menggunakan `sudo apt install samba samba-common-bin` dan konfigurasikan file utama di `/etc/samba/smb.conf`. Buat direktori bersama dan atur izin yang sesuai menggunakan `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Konfigurasikan share Samba dengan menambahkan bagian pada file konfigurasi untuk setiap direktori yang dibagikan. Atur autentikasi pengguna menggunakan `sudo smbpasswd -a username` untuk membuat kata sandi khusus Samba untuk akses jaringan.

> \[!IMPORTANT]
> Selalu gunakan kata sandi yang kuat untuk pengguna Samba dan pertimbangkan mengaktifkan akses tamu hanya untuk folder bersama yang tidak sensitif. Tinjau [dokumentasi resmi Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) untuk konfigurasi keamanan lanjutan.

### Pengaturan Server FTP {#ftp-server-setup}

FTP menyediakan metode lain untuk akses file, sangat berguna untuk pencadangan otomatis dan manajemen file jarak jauh. Pasang dan konfigurasikan vsftpd (Very Secure FTP Daemon) untuk layanan FTP yang andal.

Pasang vsftpd menggunakan `sudo apt install vsftpd` dan konfigurasikan layanan dengan mengedit `/etc/vsftpd.conf`. Aktifkan akses pengguna lokal, konfigurasikan pengaturan mode pasif, dan atur pembatasan keamanan yang sesuai.

Buat pengguna FTP dan konfigurasikan izin akses direktori. Pertimbangkan menggunakan SFTP (SSH File Transfer Protocol) daripada FTP tradisional untuk keamanan yang lebih baik, karena mengenkripsi semua transmisi data.

> \[!CAUTION]
> FTP tradisional mengirimkan kata sandi dalam teks biasa. Selalu gunakan SFTP atau konfigurasikan FTP dengan enkripsi TLS untuk transfer file yang aman. Tinjau [praktik keamanan terbaik vsftpd](https://security.appspot.com/vsftpd.html) sebelum penerapan.

### Konfigurasi Notifikasi Email {#email-notification-configuration}

Konfigurasikan NAS Raspberry Pi Anda untuk mengirim notifikasi email untuk kejadian sistem, peringatan penyimpanan, dan status penyelesaian cadangan. Ini melibatkan pemasangan dan konfigurasi agen transfer mail serta pengaturan integrasi Forward Email.

Pasang `msmtp` sebagai klien SMTP ringan menggunakan `sudo apt install msmtp msmtp-mta`. Buat file konfigurasi di `/etc/msmtprc` dengan pengaturan berikut:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Konfigurasikan notifikasi sistem dengan mengatur cron job dan skrip pemantauan sistem yang menggunakan `msmtp` untuk mengirim peringatan. Buat skrip untuk pemantauan ruang disk, peringatan suhu, dan notifikasi penyelesaian cadangan.

### Fitur Lanjutan NAS Raspberry Pi {#advanced-raspberry-pi-nas-features}

Tingkatkan NAS Raspberry Pi Anda dengan layanan tambahan dan kemampuan pemantauan. Pasang dan konfigurasikan alat pemantauan jaringan, solusi cadangan otomatis, dan layanan akses jarak jauh.

Siapkan [Nextcloud](https://nextcloud.com/) untuk fungsi seperti cloud dengan akses file berbasis web, sinkronisasi kalender, dan fitur kolaborasi. Pasang menggunakan Docker atau panduan instalasi resmi Nextcloud untuk Raspberry Pi.
Konfigurasikan cadangan otomatis menggunakan `rsync` dan `cron` untuk membuat cadangan terjadwal dari data penting. Atur notifikasi email untuk penyelesaian cadangan dan peringatan kegagalan menggunakan konfigurasi Forward Email Anda.

Implementasikan pemantauan jaringan menggunakan alat seperti [Nagios](https://www.nagios.org/) atau [Zabbix](https://www.zabbix.com/) untuk memantau kesehatan sistem, konektivitas jaringan, dan ketersediaan layanan.

> \[!NOTE]
> Untuk pengguna yang mengelola infrastruktur jaringan, pertimbangkan mengintegrasikan [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) dengan pengaturan PiKVM Anda untuk kontrol saklar fisik jarak jauh. Panduan integrasi [Python ini](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) menyediakan instruksi rinci untuk mengotomatisasi pengelolaan perangkat fisik.

### Pemecahan Masalah Email Raspberry Pi {#raspberry-pi-email-troubleshooting}

Masalah umum dengan konfigurasi email Raspberry Pi meliputi masalah resolusi DNS, pembatasan firewall, dan kegagalan otentikasi. Sifat ringan dari sistem Raspberry Pi terkadang dapat menyebabkan masalah waktu dengan koneksi SMTP.

Jika notifikasi email gagal, periksa file log `msmtp` di `/var/log/msmtp.log` untuk pesan kesalahan yang lebih rinci. Verifikasi bahwa kredensial Forward Email Anda benar dan Raspberry Pi dapat menyelesaikan `smtp.forwardemail.net`.

Uji fungsi email menggunakan baris perintah: `echo "Test message" | msmtp recipient@example.com`. Ini membantu memisahkan masalah konfigurasi dari masalah spesifik aplikasi.

Konfigurasikan pengaturan DNS yang tepat di `/etc/resolv.conf` jika Anda mengalami masalah resolusi DNS. Pertimbangkan menggunakan server DNS publik seperti `8.8.8.8` atau `1.1.1.1` jika DNS lokal tidak dapat diandalkan.

### Optimasi Performa {#performance-optimization}

Optimalkan performa NAS Raspberry Pi Anda melalui konfigurasi yang tepat pada penyimpanan, pengaturan jaringan, dan sumber daya sistem. Gunakan perangkat penyimpanan berkualitas tinggi dan konfigurasikan opsi sistem file yang sesuai untuk kebutuhan Anda.

Aktifkan boot USB 3.0 untuk performa penyimpanan yang lebih baik jika menggunakan drive eksternal. Konfigurasikan pembagian memori GPU menggunakan `sudo raspi-config` untuk mengalokasikan lebih banyak RAM ke operasi sistem daripada pemrosesan grafis.

Pantau performa sistem menggunakan alat seperti `htop`, `iotop`, dan `nethogs` untuk mengidentifikasi hambatan dan mengoptimalkan penggunaan sumber daya. Pertimbangkan upgrade ke Raspberry Pi 4 dengan RAM 8GB untuk aplikasi NAS yang menuntut.

Terapkan solusi pendinginan yang tepat untuk mencegah throttling termal selama operasi intensif. Pantau suhu CPU menggunakan `/opt/vc/bin/vcgencmd measure_temp` dan pastikan ventilasi yang memadai.

### Pertimbangan Keamanan {#security-considerations}

Amankan NAS Raspberry Pi Anda dengan menerapkan kontrol akses yang tepat, langkah keamanan jaringan, dan pembaruan keamanan secara rutin. Ganti kata sandi default, nonaktifkan layanan yang tidak perlu, dan konfigurasikan aturan firewall.

Pasang dan konfigurasikan `fail2ban` untuk melindungi dari serangan brute force pada SSH dan layanan lainnya. Atur pembaruan keamanan otomatis menggunakan `unattended-upgrades` untuk memastikan patch keamanan penting diterapkan dengan cepat.

Konfigurasikan segmentasi jaringan untuk mengisolasi NAS Anda dari perangkat jaringan lain jika memungkinkan. Gunakan akses VPN untuk koneksi jarak jauh daripada mengekspos layanan langsung ke internet.

Cadangkan secara rutin konfigurasi dan data Raspberry Pi Anda untuk mencegah kehilangan data akibat kegagalan perangkat keras atau insiden keamanan. Uji prosedur pemulihan cadangan untuk memastikan kemampuan pemulihan data.

Konfigurasi NAS Raspberry Pi menyediakan fondasi yang sangat baik untuk mempelajari konsep penyimpanan jaringan sekaligus memberikan fungsi praktis untuk lingkungan rumah dan kantor kecil. Kombinasi dengan Forward Email memastikan pengiriman notifikasi yang andal untuk pemantauan sistem dan peringatan pemeliharaan.
