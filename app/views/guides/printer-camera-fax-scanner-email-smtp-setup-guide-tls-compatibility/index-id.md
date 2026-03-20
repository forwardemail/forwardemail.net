# Panduan Lengkap untuk Pengaturan Email Printer, Kamera, Faks & Pemindai {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Peralatan kantor Anda perlu mengirim email - printer memberi peringatan tentang tingkat toner, kamera IP memberi tahu tentang deteksi gerakan, mesin faks melaporkan status transmisi, dan pemindai mengonfirmasi pemrosesan dokumen. Masalahnya? Sebagian besar penyedia email menghentikan dukungan untuk perangkat lama, sehingga peralatan Anda tidak dapat mengirim notifikasi.

[Microsoft Office 365 menghentikan dukungan TLS 1.0 dan TLS 1.1 pada Januari 2022](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), yang menyebabkan email tidak berfungsi untuk ribuan perangkat. Banyak printer, kamera, dan mesin faks yang dibuat sebelum 2020 hanya mendukung protokol lama ini dan tidak dapat diperbarui.

Forward Email memperbaiki ini dengan mendukung perangkat modern dan lama. Kami memiliki port khusus untuk peralatan saat ini dan port khusus legacy untuk perangkat lama yang tidak dapat ditingkatkan.

> \[!IMPORTANT]
> Forward Email mendukung perangkat modern dan legacy melalui strategi dual-port kami. Gunakan port `465` (SSL/TLS, direkomendasikan) atau `587` (STARTTLS) untuk perangkat modern dengan dukungan TLS 1.2+, dan port `2455`/`2555` untuk perangkat legacy yang hanya mendukung TLS 1.0.


## Daftar Isi {#table-of-contents}

* [Penjelasan Masalah TLS](#the-tls-problem-explained)
* [Gambaran Umum Konfigurasi SMTP Forward Email](#forward-email-smtp-configuration-overview)
* [Matriks Kompatibilitas Perangkat Lengkap](#comprehensive-device-compatibility-matrix)
* [Konfigurasi Email Printer HP](#hp-printer-email-configuration)
  * [Printer HP Modern (2020 dan Setelahnya)](#modern-hp-printers-2020-and-later)
  * [Printer HP Legacy (Model Sebelum 2020)](#legacy-hp-printers-pre-2020-models)
* [Konfigurasi Email Printer Canon](#canon-printer-email-configuration)
  * [Printer Canon Saat Ini](#current-canon-printers)
  * [Printer Canon Legacy](#legacy-canon-printers)
* [Konfigurasi Email Printer Brother](#brother-printer-email-configuration)
  * [Konfigurasi Seri Brother MFC](#brother-mfc-series-configuration)
  * [Pemecahan Masalah Email Brother](#troubleshooting-brother-email-issues)
* [Konfigurasi Email Kamera IP Foscam](#foscam-ip-camera-email-configuration)
  * [Memahami Batasan Email Foscam](#understanding-foscam-email-limitations)
  * [Langkah-langkah Konfigurasi Email Foscam](#foscam-email-configuration-steps)
  * [Konfigurasi Lanjutan Foscam](#advanced-foscam-configuration)
* [Konfigurasi Email Kamera Keamanan Hikvision](#hikvision-security-camera-email-configuration)
  * [Konfigurasi Kamera Hikvision Modern](#modern-hikvision-camera-configuration)
  * [Konfigurasi Kamera Hikvision Legacy](#legacy-hikvision-camera-configuration)
* [Konfigurasi Email Kamera Keamanan Dahua](#dahua-security-camera-email-configuration)
  * [Pengaturan Email Kamera Dahua](#dahua-camera-email-setup)
  * [Konfigurasi Email NVR Dahua](#dahua-nvr-email-configuration)
* [Konfigurasi Email Perangkat Multifungsi Xerox](#xerox-multifunction-device-email-configuration)
  * [Pengaturan Email MFD Xerox](#xerox-mfd-email-setup)
* [Konfigurasi Email Perangkat Multifungsi Ricoh](#ricoh-multifunction-device-email-configuration)
  * [Konfigurasi MFD Ricoh Modern](#modern-ricoh-mfd-configuration)
  * [Konfigurasi Perangkat Ricoh Legacy](#legacy-ricoh-device-configuration)
* [Pemecahan Masalah Konfigurasi Umum](#troubleshooting-common-configuration-issues)
  * [Masalah Autentikasi dan Kredensial](#authentication-and-credential-issues)
  * [Masalah TLS dan Enkripsi](#tls-and-encryption-problems)
  * [Masalah Konektivitas Jaringan](#network-connectivity-issues)
  * [Tantangan Konfigurasi Spesifik Perangkat](#device-specific-configuration-challenges)
* [Pertimbangan Keamanan dan Praktik Terbaik](#security-considerations-and-best-practices)
  * [Manajemen Kredensial](#credential-management)
  * [Keamanan Jaringan](#network-security)
  * [Pengungkapan Informasi](#information-disclosure)
  * [Pemantauan dan Pemeliharaan](#monitoring-and-maintenance)
* [Kesimpulan](#conclusion)
## Masalah TLS Dijelaskan {#the-tls-problem-explained}

Ini yang terjadi: keamanan email menjadi lebih ketat, tetapi perangkat Anda tidak mendapatkan pemberitahuan. Peralatan modern mendukung TLS 1.2+, tetapi perangkat lama masih menggunakan TLS 1.0. Sebagian besar penyedia email menghentikan dukungan untuk TLS 1.0, sehingga perangkat Anda tidak bisa terhubung.

Ini memengaruhi operasi nyata - kamera keamanan tidak bisa mengirim peringatan saat insiden, printer tidak bisa memberi peringatan tentang masalah pemeliharaan, dan konfirmasi faks hilang. [Konfigurasi server SMTP Forward Email](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) menyediakan beberapa port untuk menjaga semuanya tetap berjalan.

> \[!TIP]
> Periksa versi firmware perangkat Anda dan dukungan TLS sebelum konfigurasi. Sebagian besar perangkat yang dibuat setelah 2020 mendukung protokol TLS modern, sementara perangkat lama biasanya memerlukan port kompatibilitas warisan.


## Ikhtisar Konfigurasi SMTP Forward Email {#forward-email-smtp-configuration-overview}

Forward Email menyediakan layanan SMTP komprehensif yang dirancang khusus untuk mengatasi tantangan unik konfigurasi email perangkat. Infrastruktur kami mendukung berbagai jenis koneksi dan tingkat keamanan, memastikan kompatibilitas dengan peralatan mutakhir maupun perangkat warisan yang masih digunakan.

Untuk perangkat modern dengan dukungan TLS 1.2+, gunakan server SMTP utama kami di smtp.forwardemail.net dengan port 465 untuk koneksi SSL/TLS (direkomendasikan) atau port 587 untuk koneksi STARTTLS. Port ini menyediakan keamanan tingkat perusahaan dan kompatibel dengan semua versi firmware perangkat saat ini.

Perangkat warisan yang hanya mendukung TLS 1.0 dapat menggunakan port kompatibilitas khusus kami. Port 2455 menyediakan koneksi SSL/TLS dengan dukungan TLS 1.0, sementara port 2555 menawarkan STARTTLS dengan kompatibilitas protokol warisan. Port ini menjaga keamanan setinggi mungkin sambil memastikan fungsi berkelanjutan untuk peralatan lama.

Otentikasi diperlukan untuk semua koneksi menggunakan alias Forward Email Anda sebagai nama pengguna dan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains). Pendekatan ini memberikan keamanan kuat sekaligus mempertahankan kompatibilitas luas di berbagai sistem otentikasi perangkat.

> \[!CAUTION]
> Jangan pernah menggunakan kata sandi login akun Anda untuk otentikasi SMTP. Selalu gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) untuk konfigurasi perangkat.


## Matriks Kompatibilitas Perangkat Komprehensif {#comprehensive-device-compatibility-matrix}

Memahami perangkat mana yang memerlukan dukungan warisan versus konfigurasi modern membantu menyederhanakan proses pengaturan dan memastikan pengiriman email yang andal di seluruh ekosistem perangkat Anda.

| Kategori Perangkat        | Dukungan TLS Modern | Memerlukan TLS Warisan | Port yang Direkomendasikan | Masalah Umum                                                                                                                                       | Panduan Pengaturan/Tangkapan Layar                                                                                                               |
| ------------------------- | ------------------- | ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Printer HP (2020+)        | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | [Validasi sertifikat](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707) | [Panduan Pengaturan HP LaserJet Pro MFP](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                           |
| Printer HP (Pra-2020)     | ❌                   | ✅ Hanya TLS 1.0        | `2455`, `2555`             | [Keterbatasan firmware](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                                       | [Panduan Fitur Scan to Email](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                                       |
| Printer Canon (Saat Ini)  | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | [Pengaturan otentikasi](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358)   | [Panduan Otentikasi SMTP Canon](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                                      |
| Printer Canon (Warisan)   | ❌                   | ✅ Hanya TLS 1.0        | `2455`, `2555`             | [Masalah sertifikat](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)        | [Panduan Pengaturan Email Lanjutan](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                       |
| Printer Brother (Saat Ini)| ✅ TLS 1.2+          | ❌                      | `465`, `587`               | [Konfigurasi port](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                        | [Panduan Pengaturan SMTP Brother](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)             |
| Printer Epson (Saat Ini)  | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | Akses antarmuka web                                                                                                                                | [Pengaturan Notifikasi Email Epson](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm)     |
| Kamera IP Foscam          | ❌                   | ✅ Hanya TLS 1.0        | `2455`, `2555`             | [Validasi sertifikat](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                          | [FAQ Pengaturan Email Foscam](https://www.foscam.com/faqs/view.html?id=63)                                                                       |
| Hikvision (2020+)         | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | Persyaratan SSL                                                                                                                                    | [Panduan Pengaturan Email Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (Warisan)       | ❌                   | ✅ Hanya TLS 1.0        | `2455`, `2555`             | Pembaruan firmware                                                                                                                                 | [Konfigurasi Hikvision Warisan](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf)  |
| Kamera Dahua (Saat Ini)   | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | Otentikasi                                                                                                                                         | [Wiki Pengaturan Email Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                       |
| Xerox MFD (Saat Ini)      | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | [Konfigurasi TLS](https://www.support.xerox.com/en-us/article/KB0032169)                                                                           | [Panduan Konfigurasi TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169)                                                          |
| Ricoh MFD (Saat Ini)      | ✅ TLS 1.2+          | ❌                      | `465`, `587`               | Pengaturan SSL                                                                                                                                     | [Konfigurasi Email Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                               |
| Ricoh MFD (Warisan)       | ❌                   | ✅ Hanya TLS 1.0        | `2455`, `2555`             | [Masalah otentikasi dasar](https://www.ricoh.com/info/2025/0526_1)                                                                                | [Pengaturan Ricoh Warisan](https://www.ricoh.com/info/2025/0526_1)                                                                              |
Matriks ini menyediakan referensi cepat untuk menentukan pendekatan konfigurasi yang tepat untuk perangkat spesifik Anda. Jika ragu, mulailah dengan port modern dan gunakan port legacy jika terjadi masalah koneksi.

> \[!NOTE]
> Usia perangkat tidak selalu menjadi indikator yang dapat diandalkan untuk dukungan TLS. Beberapa produsen melakukan backport dukungan TLS 1.2 ke model lama melalui pembaruan firmware, sementara yang lain menghentikan dukungan untuk produk legacy.


## Konfigurasi Email Printer HP {#hp-printer-email-configuration}

Printer HP merupakan salah satu basis terpasang terbesar perangkat cetak yang terhubung jaringan, dengan model mulai dari seri LaserJet Pro saat ini yang mendukung penuh TLS 1.3 hingga model legacy yang hanya mendukung TLS 1.0. Proses konfigurasi sangat bervariasi antara perangkat modern dan legacy, memerlukan pendekatan berbeda untuk kompatibilitas optimal.

### Printer HP Modern (2020 dan Setelahnya) {#modern-hp-printers-2020-and-later}

Printer HP modern mencakup seri LaserJet Pro MFP M404, Color LaserJet Pro MFP M479, dan model terbaru yang mendukung standar TLS saat ini. Perangkat ini menyediakan kemampuan notifikasi email yang komprehensif melalui antarmuka Embedded Web Server (EWS) HP.

1. **Akses antarmuka web printer** dengan memasukkan alamat IP printer di browser web. Anda dapat menemukan alamat IP dengan mencetak halaman konfigurasi jaringan dari panel kontrol printer.

2. **Navigasi ke tab Network** dan pilih "Email Server" atau "SMTP Settings" tergantung model printer Anda. Beberapa printer HP mengatur pengaturan ini di bawah "System" > "Email Alerts."

3. **Konfigurasikan pengaturan server SMTP** dengan memasukkan `smtp.forwardemail.net` sebagai alamat server. Pilih "SSL/TLS" sebagai metode enkripsi dan masukkan `465` sebagai nomor port untuk koneksi paling andal.

4. **Atur autentikasi** dengan mengaktifkan autentikasi SMTP dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains), bukan kata sandi login akun Anda.

5. **Konfigurasikan informasi pengirim** dengan memasukkan alias Forward Email Anda sebagai alamat "From" dan nama deskriptif seperti "HP Printer - Office" untuk membantu mengidentifikasi sumber notifikasi.

6. **Atur alamat penerima** dengan menambahkan hingga lima alamat email yang harus menerima notifikasi printer. Printer HP memungkinkan jenis notifikasi berbeda dikirim ke penerima berbeda.

7. **Uji konfigurasi** menggunakan fungsi uji email bawaan HP. Printer akan mengirim pesan uji untuk memverifikasi bahwa semua pengaturan benar dan komunikasi dengan server Forward Email berjalan dengan baik.

> \[!TIP]
> Printer HP sering menyimpan cache pencarian DNS. Jika Anda mengalami masalah koneksi, restart printer setelah konfigurasi untuk menghapus entri DNS yang di-cache.

### Printer HP Legacy (Model Pra-2020) {#legacy-hp-printers-pre-2020-models}

Printer HP lama, termasuk LaserJet Pro MFP M277 dan model serupa, sering hanya mendukung TLS 1.0 dan memerlukan konfigurasi khusus agar dapat bekerja dengan penyedia email modern. Perangkat ini sering menampilkan kesalahan "TLS certificate verification failed" saat mencoba terhubung ke port SMTP standar.

1. **Akses Embedded Web Server printer** dengan memasukkan alamat IP printer di browser web. Printer HP legacy mungkin memerlukan Internet Explorer atau mode kompatibilitas untuk fungsi penuh.

2. **Navigasi ke pengaturan Network atau System** dan temukan bagian konfigurasi "Email" atau "SMTP." Lokasi tepatnya bervariasi menurut model dan versi firmware.

3. **Konfigurasikan pengaturan SMTP legacy Forward Email** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Ini penting - gunakan port 2455 untuk koneksi SSL/TLS atau port 2555 untuk koneksi STARTTLS sebagai pengganti port standar.

4. **Atur autentikasi** dengan mengaktifkan autentikasi SMTP dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi Forward Email yang telah Anda buat untuk autentikasi.

5. **Konfigurasikan pengaturan enkripsi** dengan hati-hati. Pilih "SSL/TLS" jika menggunakan port 2455, atau "STARTTLS" jika menggunakan port 2555. Beberapa printer HP legacy mungkin memberi label opsi ini secara berbeda.
6. **Atur informasi pengirim dan penerima** menggunakan alias Forward Email Anda sebagai alamat pengirim dan mengonfigurasi alamat penerima yang sesuai untuk notifikasi.

7. **Uji konfigurasi** menggunakan fungsi tes printer. Jika tes gagal dengan kesalahan sertifikat, verifikasi bahwa Anda menggunakan port legacy yang benar (2455 atau 2555) bukan port SMTP standar.

> \[!CAUTION]
> Printer HP legacy mungkin tidak menerima pembaruan firmware yang mengatasi masalah kompatibilitas TLS. Jika konfigurasi terus gagal, pertimbangkan menggunakan server relay SMTP lokal sebagai solusi sementara.


## Konfigurasi Email Printer Canon {#canon-printer-email-configuration}

Printer Canon menawarkan kemampuan notifikasi email yang kuat di seluruh lini produk imageRUNNER, PIXMA, dan MAXIFY mereka. Perangkat Canon modern mendukung konfigurasi TLS yang komprehensif, sementara model legacy mungkin memerlukan pengaturan kompatibilitas khusus agar berfungsi dengan penyedia email saat ini.

### Printer Canon Saat Ini {#current-canon-printers}

Printer Canon modern menyediakan fitur notifikasi email yang luas melalui antarmuka web Remote UI, mendukung segala hal mulai dari peringatan status dasar hingga notifikasi manajemen perangkat yang rinci.

1. **Akses Remote UI** dengan memasukkan alamat IP printer di browser web. Printer Canon biasanya menggunakan antarmuka berbasis web untuk semua tugas konfigurasi jaringan.

2. **Navigasi ke Pengaturan/Pendaftaran** dan pilih "Manajemen Perangkat" dari menu. Cari "Pengaturan Notifikasi E-Mail" atau opsi serupa tergantung model printer Anda.

3. **Konfigurasikan server SMTP** dengan mengklik "Tambah Tujuan" dan memasukkan smtp.forwardemail.net sebagai alamat server. Pilih "SSL" atau "TLS" sebagai metode enkripsi.

4. **Atur nomor port** ke 465 untuk koneksi SSL/TLS (direkomendasikan) atau 587 untuk koneksi STARTTLS. Printer Canon membedakan dengan jelas antara metode enkripsi ini dalam antarmukanya.

5. **Konfigurasikan autentikasi** dengan mengaktifkan autentikasi SMTP dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Atur informasi pengirim** dengan memasukkan alias Forward Email Anda sebagai alamat pengirim dan mengonfigurasi nama tampilan yang deskriptif untuk memudahkan identifikasi notifikasi.

7. **Konfigurasikan jenis notifikasi** dengan memilih event mana yang harus memicu peringatan email. Printer Canon mendukung kontrol granular atas jenis notifikasi, termasuk kondisi kesalahan, peringatan pemeliharaan, dan kejadian keamanan.

8. **Uji konfigurasi email** menggunakan fungsi tes bawaan Canon. Printer akan mengirim notifikasi tes untuk memverifikasi konfigurasi dan konektivitas yang benar.

> \[!NOTE]
> Printer Canon sering memberikan pesan kesalahan rinci yang dapat membantu memecahkan masalah konfigurasi. Perhatikan kode kesalahan spesifik untuk penyelesaian masalah yang lebih cepat.

### Printer Canon Legacy {#legacy-canon-printers}

Printer Canon lama mungkin memiliki dukungan TLS terbatas dan memerlukan konfigurasi cermat agar dapat bekerja dengan penyedia email modern. Perangkat ini sering membutuhkan pengaturan SMTP kompatibel legacy untuk mempertahankan fungsi notifikasi email.

1. **Akses antarmuka web printer** menggunakan alamat IP perangkat. Printer Canon legacy mungkin memerlukan pengaturan kompatibilitas browser khusus untuk fungsi penuh.

2. **Navigasi ke bagian konfigurasi email** melalui menu manajemen perangkat atau pengaturan jaringan. Jalur tepatnya bervariasi menurut model dan versi firmware.

3. **Konfigurasikan pengaturan SMTP legacy Forward Email** dengan memasukkan smtp.forwardemail.net sebagai alamat server dan menggunakan port 2455 untuk koneksi SSL atau port 2555 untuk koneksi STARTTLS.

4. **Atur autentikasi dengan hati-hati** dengan mengaktifkan autentikasi SMTP dan menggunakan alias Forward Email serta kata sandi yang dihasilkan. Printer Canon legacy mungkin memiliki persyaratan autentikasi khusus.

5. **Konfigurasikan pengaturan enkripsi** dengan memilih opsi TLS yang sesuai untuk port yang dipilih. Pastikan metode enkripsi cocok dengan konfigurasi port (SSL untuk 2455, STARTTLS untuk 2555).
6. **Uji konfigurasi** dan pantau kesalahan validasi sertifikat. Jika masalah berlanjut, pastikan Anda menggunakan port yang kompatibel dengan Forward Email versi lama daripada port SMTP standar.

> \[!WARNING]
> Beberapa printer Canon versi lama mungkin tidak mendukung validasi sertifikat server. Meskipun ini mengurangi keamanan, hal ini mungkin diperlukan agar fungsi email tetap berjalan pada perangkat lama.


## Konfigurasi Email Printer Brother {#brother-printer-email-configuration}

Printer Brother, terutama seri MFC dan DCP, menyediakan kemampuan scan-to-email dan notifikasi yang komprehensif. Namun, banyak pengguna melaporkan tantangan konfigurasi saat mengatur fungsi email, terutama dengan Office 365 dan penyedia email modern lainnya yang telah menghentikan metode autentikasi versi lama.

### Konfigurasi Seri Brother MFC {#brother-mfc-series-configuration}

Printer multifungsi Brother menawarkan kemampuan email yang luas, tetapi konfigurasi bisa rumit karena berbagai opsi autentikasi dan enkripsi yang tersedia.

1. **Akses antarmuka web printer** dengan memasukkan alamat IP printer di browser web. Printer Brother menyediakan sistem konfigurasi berbasis web yang lengkap.

2. **Navigasi ke pengaturan Jaringan** dan pilih "Email/IFAX" atau "Scan to Email" tergantung model printer Anda. Beberapa printer Brother mengelompokkan pengaturan ini di bawah "Administrator Settings."

3. **Konfigurasikan pengaturan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Printer Brother mendukung metode enkripsi SSL/TLS dan STARTTLS.

4. **Atur port dan enkripsi yang sesuai** dengan memilih port 465 dengan enkripsi SSL/TLS (direkomendasikan) atau port 587 dengan enkripsi STARTTLS. Printer Brother memberikan label yang jelas untuk opsi ini di antarmukanya.

5. **Konfigurasikan autentikasi SMTP** dengan mengaktifkan autentikasi dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Atur informasi pengirim** dengan mengonfigurasi alias Forward Email Anda sebagai alamat pengirim dan menambahkan nama deskriptif untuk mengidentifikasi printer dalam notifikasi email.

7. **Konfigurasikan pengaturan scan-to-email** dengan menyiapkan entri buku alamat dan pengaturan scan default. Printer Brother memungkinkan kustomisasi parameter scan dan manajemen penerima secara luas.

8. **Uji fungsi notifikasi email dan scan-to-email** untuk memastikan konfigurasi lengkap. Printer Brother menyediakan fungsi uji terpisah untuk fitur email yang berbeda.

> \[!TIP]
> Printer Brother sering memerlukan pembaruan firmware untuk mengatasi masalah konfigurasi email. Periksa pembaruan yang tersedia sebelum memecahkan masalah koneksi.

### Pemecahan Masalah Email Brother {#troubleshooting-brother-email-issues}

Printer Brother sering menghadapi tantangan konfigurasi spesifik yang dapat diatasi dengan pendekatan pemecahan masalah yang terarah.

Jika printer Brother Anda menampilkan kesalahan "Authentication Failed" saat menguji konfigurasi email, pastikan Anda menggunakan alias Forward Email Anda (bukan email akun Anda) sebagai nama pengguna dan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains). Printer Brother sangat sensitif terhadap format kredensial autentikasi.

Untuk printer yang tidak menerima pengaturan scan-to-email, coba konfigurasikan pengaturan melalui antarmuka web daripada panel kontrol printer. Antarmuka web sering memberikan pesan kesalahan dan opsi konfigurasi yang lebih rinci.

Saat menghadapi kesalahan koneksi SSL/TLS, pastikan Anda menggunakan kombinasi port dan enkripsi yang benar. Printer Brother memerlukan kecocokan tepat antara nomor port dan metode enkripsi - port 465 harus menggunakan SSL/TLS (direkomendasikan), sedangkan port 587 harus menggunakan STARTTLS.

> \[!CAUTION]
> Beberapa model printer Brother memiliki masalah yang diketahui dengan konfigurasi server SMTP tertentu. Jika konfigurasi standar gagal, konsultasikan dokumentasi dukungan Brother untuk solusi khusus model.
## Konfigurasi Email Kamera IP Foscam {#foscam-ip-camera-email-configuration}

Kamera IP Foscam merupakan salah satu kategori perangkat yang paling menantang untuk konfigurasi email karena penggunaan luas protokol TLS warisan dan keterbatasan ketersediaan pembaruan firmware. Sebagian besar kamera Foscam, termasuk model populer seperti seri R2, hanya mendukung TLS 1.0 dan tidak dapat diperbarui untuk mendukung standar enkripsi modern.

### Memahami Batasan Email Foscam {#understanding-foscam-email-limitations}

Kamera Foscam menghadirkan tantangan unik yang memerlukan pendekatan konfigurasi khusus. Pesan kesalahan yang paling umum ditemui adalah "TLS certificate verification failed: unable to get local issuer certificate," yang menunjukkan bahwa kamera tidak dapat memvalidasi sertifikat SSL modern yang digunakan oleh sebagian besar penyedia email.

Masalah ini berasal dari beberapa faktor: penyimpanan sertifikat yang usang dan tidak dapat diperbarui, dukungan protokol TLS yang terbatas hingga TLS 1.0, dan keterbatasan firmware yang mencegah peningkatan protokol keamanan. Selain itu, banyak model Foscam telah mencapai status akhir masa pakai dan tidak lagi menerima pembaruan firmware yang dapat mengatasi masalah kompatibilitas ini.

Port SMTP warisan Forward Email secara khusus mengatasi keterbatasan ini dengan mempertahankan kompatibilitas TLS 1.0 sambil menyediakan keamanan tertinggi yang mungkin untuk perangkat lama ini.

### Langkah-Langkah Konfigurasi Email Foscam {#foscam-email-configuration-steps}

Mengonfigurasi notifikasi email pada kamera Foscam memerlukan perhatian khusus pada pemilihan port dan pengaturan enkripsi untuk mengatasi keterbatasan TLS perangkat.

1. **Akses antarmuka web kamera** dengan memasukkan alamat IP kamera di browser web. Kamera Foscam biasanya menggunakan port 88 untuk akses web (misalnya, <http://192.168.1.100:88>).

2. **Navigasi ke menu Pengaturan** dan pilih "Mail Service" atau "Email Settings" tergantung model kamera Anda. Beberapa kamera Foscam mengatur pengaturan ini di bawah "Alarm" > "Mail Service."

3. **Konfigurasikan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Ini sangat penting - jangan gunakan server SMTP penyedia email standar karena mereka tidak lagi mendukung TLS 1.0.

4. **Atur port dan enkripsi** dengan memilih port 2455 untuk enkripsi SSL atau port 2555 untuk enkripsi STARTTLS. Ini adalah port kompatibel warisan Forward Email yang dirancang khusus untuk perangkat seperti kamera Foscam.

5. **Konfigurasikan autentikasi** dengan mengaktifkan autentikasi SMTP dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Atur informasi pengirim dan penerima** dengan mengonfigurasi alias Forward Email Anda sebagai alamat pengirim dan menambahkan alamat penerima untuk deteksi gerakan dan peringatan sistem.

7. **Konfigurasikan pemicu notifikasi** dengan mengatur sensitivitas deteksi gerakan, jadwal perekaman, dan peristiwa lain yang harus memicu notifikasi email.

8. **Uji konfigurasi email** menggunakan fungsi uji bawaan Foscam. Jika uji berhasil, Anda akan menerima email uji yang mengonfirmasi konfigurasi yang benar.

> \[!IMPORTANT]
> Kamera Foscam memerlukan port warisan Forward Email (2455 atau 2555) karena keterbatasan TLS 1.0. Port SMTP standar tidak akan berfungsi dengan perangkat ini.

### Konfigurasi Lanjutan Foscam {#advanced-foscam-configuration}

Untuk pengguna yang memerlukan pengaturan notifikasi yang lebih canggih, kamera Foscam menawarkan opsi konfigurasi tambahan yang dapat meningkatkan kemampuan pemantauan keamanan.

Konfigurasikan zona deteksi gerakan untuk mengurangi alarm palsu dengan menentukan area tertentu dari bidang pandang kamera yang harus memicu notifikasi. Ini mencegah email yang tidak perlu dari faktor lingkungan seperti pohon yang bergerak atau kendaraan yang lewat.

Atur jadwal perekaman yang sesuai dengan kebutuhan pemantauan Anda, memastikan notifikasi email dikirim selama periode waktu yang tepat. Kamera Foscam dapat menekan notifikasi selama jam tertentu untuk mencegah peringatan semalam untuk peristiwa yang tidak kritis.
Konfigurasikan beberapa alamat penerima untuk berbagai jenis peringatan, memungkinkan Anda mengarahkan peringatan deteksi gerakan ke petugas keamanan sambil mengirim peringatan pemeliharaan sistem ke staf TI.

> \[!TIP]
> Kamera Foscam dapat menghasilkan volume email yang signifikan jika deteksi gerakan terlalu sensitif. Mulailah dengan pengaturan konservatif dan sesuaikan berdasarkan karakteristik lingkungan Anda.


## Konfigurasi Email Kamera Keamanan Hikvision {#hikvision-security-camera-email-configuration}

Kamera Hikvision mewakili sebagian besar pasar kamera keamanan global, dengan model mulai dari kamera IP dasar hingga sistem pengawasan canggih bertenaga AI. Proses konfigurasi email sangat bervariasi antara model terbaru dengan dukungan TLS modern dan perangkat lama yang memerlukan solusi kompatibilitas.

### Konfigurasi Kamera Hikvision Modern {#modern-hikvision-camera-configuration}

Kamera Hikvision saat ini yang menjalankan versi firmware terbaru mendukung TLS 1.2+ dan menyediakan kemampuan notifikasi email yang komprehensif melalui antarmuka berbasis web mereka.

1. **Akses antarmuka web kamera** dengan memasukkan alamat IP kamera di browser web. Kamera Hikvision biasanya menggunakan port HTTP/HTTPS standar untuk akses web.

2. **Navigasikan ke Konfigurasi** dan pilih "Network" > "Advanced Settings" > "Email" dari struktur menu. Jalur tepatnya mungkin berbeda tergantung model kamera dan versi firmware Anda.

3. **Konfigurasikan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Kamera Hikvision memerlukan konfigurasi SSL khusus agar fungsi email berjalan dengan baik.

4. **Atur enkripsi ke SSL** dan konfigurasikan port 465. Kamera Hikvision tidak mendukung STARTTLS, jadi enkripsi SSL pada port 465 adalah konfigurasi yang direkomendasikan untuk kompatibilitas Forward Email.

5. **Aktifkan autentikasi SMTP** dan masukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) untuk autentikasi.

6. **Konfigurasikan informasi pengirim** dengan mengatur alias Forward Email Anda sebagai alamat pengirim dan tambahkan nama deskriptif untuk mengidentifikasi kamera dalam notifikasi email.

7. **Atur alamat penerima** dengan menambahkan alamat email yang harus menerima peringatan keamanan, notifikasi deteksi gerakan, dan pembaruan status sistem.

8. **Konfigurasikan pemicu acara** dengan mengatur deteksi gerakan, deteksi pelintasan garis, deteksi intrusi, dan acara lain yang harus menghasilkan notifikasi email.

9. **Uji konfigurasi email** menggunakan fungsi uji bawaan Hikvision untuk memverifikasi konektivitas dan autentikasi yang tepat dengan server Forward Email.

> \[!NOTE]
> Kamera Hikvision memerlukan versi firmware terbaru untuk mendukung enkripsi SSL dan TLS dengan benar. Periksa pembaruan firmware sebelum mengonfigurasi pengaturan email.

### Konfigurasi Kamera Hikvision Legacy {#legacy-hikvision-camera-configuration}

Kamera Hikvision lama mungkin memiliki dukungan TLS terbatas dan memerlukan port SMTP kompatibel legacy Forward Email agar fungsi email tetap berjalan.

1. **Akses antarmuka web kamera** dan navigasikan ke bagian konfigurasi email. Kamera Hikvision legacy mungkin memiliki struktur menu yang berbeda dari model saat ini.

2. **Konfigurasikan pengaturan SMTP legacy Forward Email** dengan memasukkan smtp.forwardemail.net sebagai alamat server dan menggunakan port 2455 untuk koneksi SSL.

3. **Atur autentikasi** menggunakan alias Forward Email dan kata sandi yang dihasilkan. Kamera Hikvision legacy mungkin memiliki persyaratan atau keterbatasan autentikasi khusus.

4. **Konfigurasikan pengaturan enkripsi** dengan memilih enkripsi SSL agar sesuai dengan konfigurasi port legacy. Pastikan metode enkripsi sesuai dengan persyaratan port 2455.

5. **Uji konfigurasi** dan pantau kesalahan koneksi. Kamera Hikvision legacy mungkin memberikan pelaporan kesalahan yang terbatas, sehingga pemecahan masalah menjadi lebih menantang.

> \[!WARNING]
> Kamera Hikvision legacy mungkin memiliki kerentanan keamanan yang diketahui. Pastikan perangkat ini terisolasi dengan baik di jaringan Anda dan pertimbangkan untuk meningkatkan ke model saat ini jika memungkinkan.
## Konfigurasi Email Kamera Keamanan Dahua {#dahua-security-camera-email-configuration}

Kamera Dahua menyediakan kemampuan notifikasi email yang kuat di seluruh lini produk mereka, mulai dari kamera IP dasar hingga sistem pengawasan canggih bertenaga AI. Proses konfigurasi umumnya sederhana untuk perangkat modern, dengan dukungan komprehensif untuk standar TLS terkini.

### Pengaturan Email Kamera Dahua {#dahua-camera-email-setup}

Kamera Dahua menawarkan konfigurasi email yang mudah melalui antarmuka web mereka, dengan kompatibilitas yang baik untuk standar SMTP modern.

1. **Akses antarmuka web kamera** dengan memasukkan alamat IP kamera di browser web. Kamera Dahua biasanya menyediakan sistem konfigurasi berbasis web yang intuitif.

2. **Navigasi ke Setup** dan pilih "Network" > "Email" dari menu konfigurasi. Kamera Dahua mengatur pengaturan email dalam bagian khusus untuk kemudahan akses.

3. **Konfigurasikan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Kamera Dahua mendukung metode enkripsi SSL dan STARTTLS.

4. **Atur port dan enkripsi** dengan memilih port 465 dengan enkripsi SSL/TLS (direkomendasikan) atau port 587 dengan enkripsi STARTTLS.

5. **Aktifkan otentikasi SMTP** dan masukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Konfigurasikan informasi pengirim** dengan mengatur alias Forward Email Anda sebagai alamat pengirim dan menambahkan nama deskriptif untuk mengidentifikasi sumber kamera.

7. **Atur alamat penerima** dengan menambahkan alamat email untuk berbagai jenis notifikasi. Kamera Dahua mendukung beberapa penerima untuk berbagai jenis peringatan.

8. **Konfigurasikan pemicu acara** dengan mengatur deteksi gerakan, peringatan pengrusakan, dan acara keamanan lain yang harus menghasilkan notifikasi email.

9. **Uji fungsi email** menggunakan fitur uji bawaan Dahua untuk memverifikasi konfigurasi dan konektivitas yang benar.

> \[!TIP]
> Kamera Dahua sering menyediakan panduan konfigurasi terperinci melalui dokumentasi wiki mereka. Konsultasikan [panduan pengaturan email Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) untuk instruksi spesifik model.

### Konfigurasi Email NVR Dahua {#dahua-nvr-email-configuration}

Dahua Network Video Recorder (NVR) menyediakan manajemen notifikasi email terpusat untuk beberapa kamera, menawarkan administrasi yang efisien untuk sistem pengawasan besar.

1. **Akses antarmuka web NVR** dengan memasukkan alamat IP NVR di browser web. NVR Dahua menyediakan antarmuka manajemen komprehensif untuk konfigurasi sistem secara menyeluruh.

2. **Navigasi ke konfigurasi Email** dengan memilih "Setup" > "Network" > "Email" dari menu utama. NVR biasanya mengatur pengaturan email pada tingkat sistem.

3. **Konfigurasikan pengaturan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server dan memilih port 465 dengan enkripsi SSL/TLS (direkomendasikan) atau port 587 dengan STARTTLS.

4. **Atur otentikasi** menggunakan alias Forward Email dan kata sandi yang dihasilkan. NVR mendukung metode otentikasi SMTP standar.

5. **Konfigurasikan jadwal notifikasi** dengan mengatur periode waktu saat notifikasi email harus aktif. Ini membantu mengelola volume notifikasi selama jam tidak aktif.

6. **Atur notifikasi berbasis acara** dengan mengonfigurasi acara kamera mana yang harus memicu peringatan email. NVR memungkinkan kontrol granular atas pemicu notifikasi di banyak kamera.

7. **Uji konfigurasi email sistem secara menyeluruh** untuk memastikan fungsi yang tepat di semua kamera dan sistem pemantauan yang terhubung.


## Konfigurasi Email Perangkat Multifungsi Xerox {#xerox-multifunction-device-email-configuration}

Perangkat multifungsi Xerox menyediakan kemampuan notifikasi email kelas perusahaan dengan dukungan TLS yang komprehensif dan opsi konfigurasi lanjutan. Perangkat Xerox modern mendukung standar keamanan terkini sambil mempertahankan kompatibilitas dengan berbagai lingkungan jaringan.

### Pengaturan Email MFD Xerox {#xerox-mfd-email-setup}

Perangkat multifungsi Xerox menawarkan konfigurasi email yang canggih melalui antarmuka administratif berbasis web mereka, mendukung baik notifikasi dasar maupun integrasi alur kerja lanjutan.
1. **Akses antarmuka web perangkat** dengan memasukkan alamat IP perangkat di browser web. Perangkat Xerox biasanya menyediakan alat administrasi berbasis web yang komprehensif.

2. **Navigasi ke Properties** dan pilih "Connectivity" > "Protocols" > "SMTP" dari menu konfigurasi. Perangkat Xerox mengatur pengaturan email dalam bagian konfigurasi protokol mereka.

3. **Konfigurasikan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Perangkat Xerox mendukung versi TLS dan metode enkripsi yang dapat dikonfigurasi.

4. **Atur konfigurasi TLS** dengan memilih TLS 1.2 atau lebih tinggi sebagai versi minimum yang didukung. Perangkat Xerox memungkinkan administrator mengonfigurasi persyaratan TLS spesifik untuk keamanan yang lebih baik.

5. **Konfigurasikan port dan enkripsi** dengan mengatur port 465 untuk koneksi SSL/TLS (direkomendasikan) atau port 587 untuk koneksi STARTTLS.

6. **Siapkan otentikasi SMTP** dengan mengaktifkan otentikasi dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

7. **Konfigurasikan informasi pengirim** dengan mengatur alias Forward Email Anda sebagai alamat pengirim dan mengonfigurasi alamat balasan yang sesuai untuk pengelolaan notifikasi.

8. **Siapkan jenis notifikasi** dengan mengonfigurasi event perangkat mana yang harus memicu peringatan email, termasuk notifikasi pemeliharaan, kondisi kesalahan, dan kejadian keamanan.

9. **Uji konfigurasi email** menggunakan sistem uji komprehensif Xerox untuk memverifikasi konektivitas dan otentikasi yang tepat.

> \[!NOTE]
> Perangkat Xerox menyediakan opsi konfigurasi TLS yang rinci yang memungkinkan penyesuaian pengaturan keamanan. Konsultasikan [panduan konfigurasi TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169) untuk kebutuhan keamanan lanjutan.


## Konfigurasi Email Perangkat Multifungsi Ricoh {#ricoh-multifunction-device-email-configuration}

Perangkat multifungsi Ricoh menawarkan kemampuan email yang kuat di seluruh lini produk mereka yang luas, mulai dari printer kantor dasar hingga sistem produksi canggih. Namun, [Ricoh telah mengumumkan perubahan signifikan](https://www.ricoh.com/info/2025/0526_1) terkait penghentian otentikasi dasar Microsoft yang memengaruhi fungsi email.

### Konfigurasi Ricoh MFD Modern {#modern-ricoh-mfd-configuration}

Perangkat Ricoh saat ini mendukung standar TLS modern dan menyediakan kemampuan notifikasi email yang komprehensif melalui antarmuka berbasis web mereka.

1. **Akses antarmuka web perangkat** dengan memasukkan alamat IP perangkat di browser web. Perangkat Ricoh menyediakan sistem konfigurasi berbasis web yang intuitif.

2. **Navigasi ke konfigurasi Email** dengan memilih "System Settings" > "Administrator Tools" > "Network" > "Email" dari struktur menu.

3. **Konfigurasikan server SMTP** dengan memasukkan smtp.forwardemail.net sebagai alamat server. Perangkat Ricoh mendukung metode enkripsi SSL dan STARTTLS.

4. **Aktifkan SSL pada halaman server SMTP** untuk mengaktifkan enkripsi TLS. Antarmuka Ricoh mungkin membingungkan, tetapi pengaktifan SSL diperlukan untuk fungsi email yang aman.

5. **Atur nomor port** ke 465 untuk koneksi SSL/TLS (direkomendasikan) atau 587 untuk koneksi STARTTLS. Pastikan metode enkripsi sesuai dengan port yang dipilih.

6. **Konfigurasikan otentikasi SMTP** dengan mengaktifkan otentikasi dan memasukkan alias Forward Email Anda sebagai nama pengguna. Gunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

7. **Siapkan informasi pengirim** dengan mengonfigurasi alias Forward Email Anda sebagai alamat pengirim dan menambahkan informasi identifikasi yang sesuai.

8. **Konfigurasikan jenis notifikasi** dengan mengatur scan-to-email, peringatan perangkat, dan notifikasi pemeliharaan sesuai kebutuhan operasional Anda.

9. **Uji fungsi email** menggunakan sistem uji bawaan Ricoh untuk memverifikasi konfigurasi dan konektivitas yang tepat.

> \[!IMPORTANT]
> Perangkat Ricoh yang terpengaruh oleh perubahan otentikasi dasar Microsoft memerlukan metode otentikasi yang diperbarui. Pastikan firmware perangkat Anda mendukung otentikasi modern atau gunakan fitur kompatibilitas Forward Email.
### Konfigurasi Perangkat Ricoh Legacy {#legacy-ricoh-device-configuration}

Perangkat Ricoh lama mungkin memerlukan port SMTP kompatibel legacy Forward Email karena dukungan TLS yang terbatas dan pembatasan metode otentikasi.

1. **Akses antarmuka web perangkat** dan navigasikan ke bagian konfigurasi email. Perangkat Ricoh legacy mungkin memiliki struktur menu yang berbeda dari model saat ini.

2. **Konfigurasikan pengaturan SMTP legacy Forward Email** dengan memasukkan smtp.forwardemail.net sebagai alamat server dan menggunakan port 2455 untuk koneksi SSL.

3. **Aktifkan enkripsi SSL** agar sesuai dengan konfigurasi port legacy. Pastikan pengaturan enkripsi sesuai dengan persyaratan port 2455.

4. **Atur otentikasi** menggunakan alias Forward Email dan kata sandi yang dihasilkan. Perangkat Ricoh legacy mungkin memiliki keterbatasan otentikasi tertentu.

5. **Uji konfigurasi** dan pantau kesalahan otentikasi atau koneksi. Perangkat legacy mungkin memberikan pelaporan kesalahan yang terbatas untuk pemecahan masalah.


## Pemecahan Masalah Umum Konfigurasi {#troubleshooting-common-configuration-issues}

Konfigurasi email perangkat dapat mengalami berbagai masalah akibat pengaturan jaringan, masalah otentikasi, atau tantangan kompatibilitas protokol. Memahami masalah umum dan solusinya membantu memastikan pengiriman notifikasi yang andal di seluruh ekosistem perangkat Anda.

### Masalah Otentikasi dan Kredensial {#authentication-and-credential-issues}

Kegagalan otentikasi merupakan masalah konfigurasi email yang paling umum di semua jenis perangkat. Masalah ini biasanya disebabkan oleh penggunaan kredensial yang salah, ketidaksesuaian metode otentikasi, atau masalah konfigurasi akun.

Pastikan Anda menggunakan alias Forward Email sebagai nama pengguna, bukan alamat email akun atau kredensial login Anda. Banyak perangkat sensitif terhadap format nama pengguna dan memerlukan kecocokan tepat dengan alias yang dikonfigurasi.

Pastikan Anda menggunakan kata sandi yang dihasilkan dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) bukan kata sandi login akun Anda. Otentikasi SMTP memerlukan kata sandi yang dihasilkan khusus demi alasan keamanan, dan menggunakan kredensial yang salah akan menyebabkan kegagalan otentikasi.

Periksa bahwa akun Forward Email Anda memiliki akses SMTP yang diaktifkan dengan benar dan bahwa persyaratan otentikasi dua faktor telah dikonfigurasi dengan tepat. Beberapa konfigurasi akun mungkin membatasi akses SMTP sampai diaktifkan dengan benar.

> \[!TIP]
> Jika otentikasi terus gagal, buat ulang kata sandi SMTP Anda dari [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) dan perbarui konfigurasi perangkat Anda dengan kredensial baru.

### Masalah TLS dan Enkripsi {#tls-and-encryption-problems}

Masalah terkait TLS sering terjadi ketika perangkat mencoba menggunakan protokol enkripsi yang tidak didukung atau ketika terjadi ketidaksesuaian antara konfigurasi port dan pengaturan enkripsi.

Untuk perangkat modern yang mengalami kesalahan TLS, pastikan Anda menggunakan kombinasi port dan enkripsi yang benar: port 465 dengan SSL/TLS (direkomendasikan) atau port 587 dengan STARTTLS. Pengaturan ini harus cocok persis untuk koneksi yang berhasil.

Perangkat legacy yang menampilkan kesalahan validasi sertifikat harus menggunakan port kompatibilitas Forward Email (2455 atau 2555) daripada port SMTP standar. Port ini mempertahankan kompatibilitas TLS 1.0 sambil memberikan keamanan yang sesuai untuk perangkat lama.

Jika validasi sertifikat terus gagal pada perangkat legacy, periksa apakah perangkat memungkinkan validasi sertifikat dinonaktifkan. Meskipun ini mengurangi keamanan, hal ini mungkin diperlukan agar perangkat yang tidak dapat diperbarui tetap berfungsi.

> \[!CAUTION]
> Menonaktifkan validasi sertifikat mengurangi keamanan dan hanya boleh digunakan sebagai upaya terakhir untuk perangkat legacy yang tidak dapat diperbarui atau diganti.

### Masalah Konektivitas Jaringan {#network-connectivity-issues}

Masalah terkait jaringan dapat mencegah perangkat mengakses server SMTP Forward Email meskipun pengaturan konfigurasi sudah benar.

Pastikan jaringan Anda mengizinkan koneksi keluar pada port SMTP yang dikonfigurasi. Firewall perusahaan atau kebijakan jaringan yang ketat mungkin memblokir port tertentu, sehingga memerlukan penyesuaian aturan firewall atau konfigurasi port alternatif.
Periksa resolusi DNS dengan memastikan bahwa perangkat Anda dapat menyelesaikan smtp.forwardemail.net ke alamat IP yang benar. Masalah DNS dapat menyebabkan kegagalan koneksi meskipun konektivitas jaringan berfungsi dengan baik.

Uji konektivitas jaringan dari alat diagnostik jaringan perangkat jika tersedia. Banyak perangkat modern menyediakan kemampuan pengujian jaringan bawaan yang dapat membantu mengidentifikasi masalah konektivitas.

Pertimbangkan latensi jaringan dan pengaturan timeout jika perangkat berada pada koneksi jaringan yang lambat atau berlatensi tinggi. Beberapa perangkat mungkin memerlukan penyesuaian timeout untuk pengiriman email yang andal.

### Tantangan Konfigurasi Spesifik Perangkat {#device-specific-configuration-challenges}

Berbagai produsen perangkat mengimplementasikan fungsi email dengan cara yang berbeda, yang menyebabkan tantangan konfigurasi spesifik produsen yang memerlukan solusi yang ditargetkan.

Printer HP mungkin menyimpan cache pencarian DNS dan memerlukan restart setelah perubahan konfigurasi. Jika masalah koneksi berlanjut setelah konfigurasi, restart printer untuk menghapus informasi jaringan yang di-cache.

Printer Brother sangat sensitif terhadap format kredensial autentikasi dan mungkin memerlukan konfigurasi melalui antarmuka web daripada panel kontrol perangkat untuk pengaturan yang andal.

Kamera Foscam memerlukan konfigurasi port khusus karena keterbatasan TLS dan mungkin tidak memberikan pesan kesalahan rinci untuk pemecahan masalah. Pastikan Anda menggunakan port legacy Forward Email (2455 atau 2555) untuk perangkat ini.

Kamera Hikvision memerlukan enkripsi SSL dan tidak mendukung STARTTLS, membatasi opsi konfigurasi ke port 465 dengan enkripsi SSL/TLS.

> \[!NOTE]
> Saat memecahkan masalah spesifik perangkat, konsultasikan dokumentasi produsen untuk batasan atau persyaratan konfigurasi yang diketahui yang dapat memengaruhi fungsi email.


## Pertimbangan Keamanan dan Praktik Terbaik {#security-considerations-and-best-practices}

Mengonfigurasi notifikasi email pada perangkat jaringan melibatkan beberapa pertimbangan keamanan yang membantu melindungi sistem Anda sambil mempertahankan pengiriman notifikasi yang andal. Mengikuti praktik terbaik keamanan mencegah akses tidak sah dan memastikan pengungkapan informasi yang tepat dalam notifikasi.

### Manajemen Kredensial {#credential-management}

Gunakan kata sandi yang kuat dan unik untuk akun Forward Email Anda dan aktifkan autentikasi dua faktor jika tersedia. Kata sandi SMTP yang dihasilkan harus diperlakukan sebagai kredensial sensitif dan disimpan dengan aman dalam konfigurasi perangkat.

Tinjau dan putar kata sandi SMTP secara berkala, terutama setelah perubahan personel atau insiden keamanan. Forward Email memungkinkan regenerasi kata sandi tanpa memengaruhi fungsi akun lainnya.

Hindari menggunakan kredensial bersama di beberapa perangkat jika memungkinkan. Meskipun Forward Email mendukung beberapa koneksi perangkat dengan kredensial yang sama, kredensial perangkat individual memberikan isolasi keamanan dan kemampuan audit yang lebih baik.

Dokumentasikan kredensial perangkat dengan aman dan sertakan dalam sistem manajemen kredensial organisasi Anda. Dokumentasi yang tepat memastikan konfigurasi email dapat dipelihara dan diperbarui sesuai kebutuhan.

### Keamanan Jaringan {#network-security}

Terapkan segmentasi jaringan yang sesuai untuk mengisolasi perangkat dari sumber daya jaringan lain sambil mempertahankan konektivitas yang diperlukan untuk notifikasi email dan akses yang sah.

Konfigurasikan aturan firewall untuk mengizinkan lalu lintas SMTP yang diperlukan sambil memblokir akses jaringan yang tidak perlu. Perangkat biasanya hanya memerlukan akses keluar ke server SMTP Forward Email untuk fungsi notifikasi.

Pantau lalu lintas jaringan dari perangkat untuk mengidentifikasi pola tidak biasa atau upaya komunikasi tidak sah. Aktivitas jaringan yang tidak terduga dapat menunjukkan masalah keamanan yang memerlukan investigasi.

Pertimbangkan penggunaan VLAN atau segmen jaringan khusus untuk lalu lintas manajemen perangkat, termasuk notifikasi email, untuk memberikan isolasi keamanan tambahan.

### Pengungkapan Informasi {#information-disclosure}

Tinjau isi notifikasi email untuk memastikan tidak mengandung informasi sensitif yang dapat berguna bagi penyerang. Beberapa perangkat menyertakan informasi sistem rinci, konfigurasi jaringan, atau jalur file dalam email notifikasi.
Konfigurasikan penyaringan notifikasi untuk membatasi jenis informasi yang disertakan dalam peringatan email. Banyak perangkat memungkinkan penyesuaian konten notifikasi untuk menyeimbangkan informasi yang berguna dengan persyaratan keamanan.

Terapkan kebijakan retensi dan penanganan email yang sesuai untuk notifikasi perangkat. Notifikasi terkait keamanan mungkin perlu disimpan untuk kepatuhan atau tujuan forensik.

Pertimbangkan sensitivitas alamat email penerima dan pastikan bahwa notifikasi hanya dikirim kepada personel yang berwenang yang memerlukan akses ke informasi tersebut.

### Pemantauan dan Pemeliharaan {#monitoring-and-maintenance}

Uji konfigurasi notifikasi email secara berkala untuk memastikan fungsionalitas yang berkelanjutan. Pengujian berkala membantu mengidentifikasi perubahan konfigurasi, perubahan jaringan, atau masalah layanan sebelum berdampak pada pengiriman peringatan kritis.

Pantau pola notifikasi email untuk tanda-tanda aktivitas mencurigakan atau upaya akses tidak sah. Volume notifikasi yang tidak biasa atau kejadian sistem yang tidak terduga dapat menunjukkan masalah keamanan.

Jaga firmware perangkat tetap diperbarui jika memungkinkan untuk mempertahankan standar keamanan terkini dan dukungan protokol. Meskipun beberapa perangkat telah mencapai status akhir masa pakai, menerapkan pembaruan keamanan yang tersedia membantu melindungi dari kerentanan yang diketahui.

Terapkan metode notifikasi cadangan untuk peringatan kritis jika memungkinkan. Meskipun notifikasi email dapat diandalkan, memiliki mekanisme peringatan alternatif menyediakan redundansi untuk kejadian sistem yang paling penting.


## Kesimpulan {#conclusion}

Mengonfigurasi notifikasi email yang andal di berbagai ekosistem perangkat memerlukan pemahaman tentang lanskap kompleks kompatibilitas TLS, metode otentikasi, dan persyaratan khusus produsen. Layanan SMTP komprehensif Forward Email mengatasi tantangan ini dengan menyediakan standar keamanan modern untuk perangkat saat ini dan kompatibilitas warisan untuk peralatan lama yang tidak dapat diperbarui.

Proses konfigurasi yang dijelaskan dalam panduan ini memberikan instruksi rinci langkah demi langkah untuk kategori perangkat utama, memastikan bahwa administrator dapat menetapkan notifikasi email yang andal terlepas dari campuran peralatan spesifik mereka. Strategi dual-port Forward Email secara khusus mengatasi krisis kompatibilitas TLS yang memengaruhi jutaan perangkat yang telah dipasang, menyediakan solusi praktis yang mempertahankan keamanan sekaligus memastikan fungsionalitas yang berkelanjutan.

Pengujian dan pemeliharaan konfigurasi notifikasi email secara rutin memastikan keandalan yang berkelanjutan dan membantu mengidentifikasi potensi masalah sebelum berdampak pada pengiriman peringatan kritis. Mengikuti praktik terbaik keamanan dan panduan pemecahan masalah dalam panduan ini membantu mempertahankan sistem notifikasi yang aman dan andal yang menjaga administrator tetap mendapat informasi tentang status perangkat dan kejadian keamanan.

Baik mengelola kantor kecil dengan merek printer dan kamera campuran atau mengawasi lingkungan perusahaan dengan ratusan perangkat, Forward Email menyediakan infrastruktur dan kompatibilitas yang dibutuhkan untuk notifikasi email yang andal. Fokus layanan kami pada kompatibilitas perangkat, dikombinasikan dengan dokumentasi dan dukungan yang komprehensif, memastikan bahwa peringatan sistem kritis sampai kepada Anda saat Anda paling membutuhkannya.

Untuk dukungan tambahan terkait konfigurasi email perangkat atau pertanyaan tentang kompatibilitas Forward Email dengan peralatan tertentu, kunjungi [FAQ konfigurasi server SMTP kami](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) atau hubungi tim dukungan kami. Kami berkomitmen membantu Anda mempertahankan notifikasi email yang andal di semua perangkat yang terhubung ke jaringan Anda, terlepas dari usia atau keterbatasan produsen.
