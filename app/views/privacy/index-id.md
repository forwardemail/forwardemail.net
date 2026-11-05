# Kebijakan Privasi {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Kebijakan privasi Forward Email" class="rounded-lg" /> -->


## Daftar Isi {#table-of-contents}

* [Penafian](#disclaimer)
* [Informasi yang Tidak Dikumpulkan](#information-not-collected)
* [Informasi yang Dikumpulkan](#information-collected)
  * [Informasi Akun](#account-information)
  * [Penyimpanan Email](#email-storage)
  * [Log Kesalahan](#error-logs)
  * [Log Server](#server-logs)
  * [Email SMTP Keluar](#outbound-smtp-emails)
* [Pemrosesan Data Sementara](#temporary-data-processing)
  * [Pembatasan Laju](#rate-limiting)
  * [Pelacakan Koneksi](#connection-tracking)
  * [Upaya Otentikasi](#authentication-attempts)
* [Log Audit](#audit-logs)
  * [Perubahan Akun](#account-changes)
  * [Perubahan Pengaturan Domain](#domain-settings-changes)
* [Cookie dan Sesi](#cookies-and-sessions)
* [Analitik](#analytics)
* [Aplikasi dan Webmail](#apps-and-webmail)
  * [Data di Perangkat Anda](#data-on-your-device)
  * [Data yang Dikirim Aplikasi kepada Kami](#data-the-apps-send-us)
  * [Notifikasi Push](#push-notifications)
  * [Gambar dan Tautan dalam Email](#images-and-links-in-emails)
  * [Koneksi Lainnya](#other-connections)
* [Informasi yang Dibagikan](#information-shared)
* [Penghapusan Informasi](#information-removal)
* [Pengungkapan Tambahan](#additional-disclosures)


## Penafian {#disclaimer}

Silakan merujuk pada [Ketentuan](/terms) kami karena berlaku di seluruh situs.


## Informasi yang Tidak Dikumpulkan {#information-not-collected}

**Kecuali untuk informasi yang secara tegas dijelaskan dalam kebijakan ini (termasuk [log kesalahan](#error-logs), [log server](#server-logs), [email SMTP keluar](#outbound-smtp-emails), [informasi akun](#account-information), [pemrosesan data sementara](#temporary-data-processing), [log audit](#audit-logs), [kuki dan sesi](#cookies-and-sessions), [analitik](#analytics), dan [aplikasi dan webmail](#apps-and-webmail)):**

* Kami tidak menyimpan email yang diteruskan ke penyimpanan disk maupun basis data.
* Kami tidak menyimpan metadata apa pun tentang email yang diteruskan ke penyimpanan disk maupun basis data.
* Kecuali sebagaimana dijelaskan secara tegas dalam kebijakan ini, kami tidak menyimpan log atau alamat IP ke penyimpanan disk maupun basis data.
* Kami tidak menggunakan layanan analitik atau telemetri pihak ketiga mana pun.


## Informasi yang Dikumpulkan {#information-collected}

Untuk transparansi, kapan saja Anda dapat <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">melihat kode sumber kami</a> untuk melihat bagaimana informasi di bawah ini dikumpulkan dan digunakan.

**Secara ketat untuk fungsi dan meningkatkan layanan kami, kami mengumpulkan dan menyimpan dengan aman informasi berikut:**

### Informasi Akun {#account-information}

* Kami menyimpan alamat email yang Anda berikan kepada kami.
* Kami menyimpan nama domain, alias, dan konfigurasi yang Anda berikan kepada kami.
* Kami menyimpan metadata keamanan akun terbatas yang diperlukan untuk melindungi akun Anda dan mengelola akses, termasuk pengidentifikasi sesi situs web aktif, penghitung upaya masuk yang gagal, dan stempel waktu dari upaya masuk terakhir.
* Informasi tambahan apa pun yang Anda berikan secara sukarela kepada kami, seperti komentar atau pertanyaan yang dikirimkan kepada kami melalui email atau di halaman <a href="/help">bantuan</a> kami.


**Atribusi pendaftaran** (disimpan secara permanen pada akun Anda):

Saat Anda membuat akun, kami menyimpan informasi berikut untuk memahami bagaimana pengguna menemukan layanan kami:

* Domain situs web perujuk (bukan URL lengkap)
* Halaman pertama yang Anda kunjungi di situs kami, dengan nilai di jalurnya seperti nama domain, ID, dan token diganti dengan placeholder
* Parameter kampanye UTM jika ada di URL

### Penyimpanan Email {#email-storage}

* Kami menyimpan email dan informasi kalender dalam [database SQLite terenkripsi](/blog/docs/best-quantum-safe-encrypted-email-service) Anda secara ketat untuk akses IMAP/POP3/CalDAV/CardDAV dan fungsi kotak surat Anda.
  * Perlu dicatat bahwa jika Anda hanya menggunakan layanan penerusan email kami, maka tidak ada email yang disimpan ke disk atau basis data seperti yang dijelaskan dalam [Informasi yang Tidak Dikumpulkan](#information-not-collected).
  * Layanan penerusan email kami hanya beroperasi di memori (tidak menulis ke penyimpanan disk maupun basis data).
  * Penyimpanan IMAP/POP3/CalDAV/CardDAV dienkripsi saat diam, dienkripsi saat transit, dan disimpan pada disk terenkripsi LUKS.
  * Cadangan untuk penyimpanan IMAP/POP3/CalDAV/CardDAV Anda dienkripsi saat diam, dienkripsi saat transit, dan disimpan di [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Log Kesalahan {#error-logs}

* Kami menyimpan kode respons SMTP `4xx` dan `5xx` [log kesalahan](/faq#do-you-store-error-logs) selama 7 hari.
* Log kesalahan berisi kesalahan SMTP, amplop, dan header email (kami **tidak** menyimpan isi email maupun lampiran).
* Log kesalahan dapat berisi alamat IP dan nama host server pengirim untuk tujuan debugging.
* Log kesalahan untuk [pembatasan laju](/faq#do-you-have-rate-limiting) dan [greylisting](/faq#do-you-have-a-greylist) tidak dapat diakses karena koneksi berakhir lebih awal (misalnya sebelum perintah `RCPT TO` dan `MAIL FROM` dapat dikirim).
* Kami juga menyimpan log kesalahan untuk permintaan situs web dan API yang gagal atau memakan waktu terlalu lama, serta untuk kesalahan di server IMAP, POP3, CalDAV, dan CardDAV kami, selama 7 hari.
* Log ini dapat berisi alamat IP, URL permintaan (termasuk string kueri seperti kata kunci pencarian), header permintaan seperti user agent, serta akun atau alias yang terlibat.
* Kata sandi, token API, cookie, dan isi permintaan disamarkan sebelum log ini disimpan.

### Log Server {#server-logs}

* Server kami mencatat satu baris log untuk setiap permintaan situs web dan API, yang dapat mencakup alamat IP, metode dan URL permintaan (termasuk string kueri), header permintaan, status respons, serta akun yang sedang masuk.
* Kami menggunakan log ini untuk menemukan dan memperbaiki masalah serta untuk menghentikan penyalahgunaan, dan kami menyimpannya hingga 30 hari.

### Email SMTP Keluar {#outbound-smtp-emails}

* Kami menyimpan [email SMTP keluar](/faq#do-you-support-sending-email-with-smtp) selama \~30 hari.
  * Lama penyimpanan ini bervariasi berdasarkan header "Date"; karena kami mengizinkan email dikirim di masa depan jika header "Date" masa depan ada.
  * **Perlu dicatat bahwa setelah email berhasil dikirim atau mengalami kesalahan permanen, maka kami akan menghapus dan membersihkan isi pesan.**
  * Jika Anda ingin mengonfigurasi agar isi pesan email SMTP keluar Anda disimpan lebih lama dari default 0 hari (setelah pengiriman berhasil atau kesalahan permanen), maka masuk ke Pengaturan Lanjutan untuk domain Anda dan masukkan nilai antara `0` dan `30`.
  * Beberapa pengguna suka menggunakan fitur pratinjau [Akun Saya > Email](/my-account/emails) untuk melihat bagaimana email mereka dirender, oleh karena itu kami mendukung periode retensi yang dapat dikonfigurasi.
  * Perlu dicatat juga bahwa kami mendukung [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Pemrosesan Data Sementara {#temporary-data-processing}

Data berikut diproses sementara di memori atau Redis dan **tidak** disimpan secara permanen:

### Pembatasan Laju {#rate-limiting}

* Alamat IP digunakan sementara di Redis untuk tujuan pembatasan laju.
* Data pembatasan laju kedaluwarsa secara otomatis (biasanya dalam 24 jam).
* Ini mencegah penyalahgunaan dan memastikan penggunaan layanan yang adil.

### Pelacakan Koneksi {#connection-tracking}

* Jumlah koneksi bersamaan dilacak per alamat IP di Redis.
* Data ini kedaluwarsa secara otomatis saat koneksi ditutup atau setelah waktu tunggu singkat.
* Digunakan untuk mencegah penyalahgunaan koneksi dan memastikan ketersediaan layanan.

### Upaya Otentikasi {#authentication-attempts}

* Upaya autentikasi yang gagal dilacak per alamat IP di Redis.
* Kami juga menyimpan metadata autentikasi tingkat akun yang terbatas, termasuk penghitung upaya masuk yang gagal dan stempel waktu dari upaya masuk terakhir.
* Data upaya autentikasi berbasis Redis kedaluwarsa secara otomatis (biasanya dalam 24 jam).
* Digunakan untuk mencegah serangan brute-force pada akun pengguna.


## Log Audit {#audit-logs}

Untuk membantu Anda memantau dan mengamankan akun serta domain Anda, kami menyimpan log audit untuk perubahan tertentu. Log ini digunakan untuk mengirim email notifikasi kepada pemilik akun dan administrator domain.

### Perubahan Akun {#account-changes}

* Kami melacak perubahan pada pengaturan akun penting (misalnya, otentikasi dua faktor, nama tampilan, zona waktu).
* Ketika perubahan terdeteksi, kami mengirim email notifikasi ke alamat email terdaftar Anda.
* Kolom sensitif (misalnya, kata sandi, token API, kunci pemulihan) dilacak tetapi nilainya disamarkan dalam notifikasi.
* Entri log audit dihapus setelah email notifikasi dikirim.

### Perubahan Pengaturan Domain {#domain-settings-changes}

Untuk domain dengan beberapa administrator, kami menyediakan pencatatan audit terperinci untuk membantu tim melacak perubahan konfigurasi:

**Apa yang kami lacak:**

* Perubahan pengaturan domain (misalnya, webhook bounce, penyaringan spam, konfigurasi DKIM)
* Siapa yang melakukan perubahan (alamat email pengguna)
* Kapan perubahan dilakukan (cap waktu)
* Alamat IP dari mana perubahan dilakukan
* String user-agent browser/klien

**Cara kerjanya:**

* Semua administrator domain menerima satu email notifikasi gabungan saat pengaturan berubah.
* Notifikasi mencakup tabel yang menunjukkan setiap perubahan dengan pengguna yang melakukannya, alamat IP mereka, dan cap waktu.
* Kolom sensitif (misalnya, kunci webhook, token API, kunci privat DKIM) dilacak tetapi nilainya disamarkan.
* Informasi user-agent disertakan dalam bagian "Detail Teknis" yang dapat dilipat.
* Entri log audit dihapus setelah email notifikasi dikirim.

**Mengapa kami mengumpulkan ini:**

* Untuk membantu administrator domain menjaga pengawasan keamanan
* Untuk memungkinkan tim mengaudit siapa yang melakukan perubahan konfigurasi
* Untuk membantu pemecahan masalah jika terjadi perubahan tak terduga
* Untuk memberikan akuntabilitas dalam pengelolaan domain bersama


## Cookie dan Sesi {#cookies-and-sessions}

* Kami menyimpan kuki yang ditandatangani dan hanya HTTP serta data sesi sisi server untuk lalu lintas situs web Anda.
* Kuki menggunakan perlindungan SameSite.
* Kami menyimpan pengidentifikasi sesi situs web aktif di akun Anda untuk mendukung fitur seperti "keluar dari perangkat lain" dan pembatalan sesi terkait keamanan.
* Kuki sesi kedaluwarsa setelah 30 hari tidak ada aktivitas.
* Kami tidak membuat sesi untuk bot atau perayap.
* Kami menggunakan kuki dan sesi untuk:
  * Autentikasi dan status masuk
  * Fungsionalitas "ingat saya" pada autentikasi dua faktor
  * Pesan kilat dan pemberitahuan
  * [Analitik](#analytics): halaman pertama kunjungan Anda, domain perujuk, parameter kampanye (UTM), dan jumlah halaman


## Analytics {#analytics}

Kami menggunakan sistem analitik yang berfokus pada privasi untuk memahami bagaimana layanan kami digunakan. Sistem ini dirancang dengan privasi sebagai prinsip inti:

**Apa yang TIDAK kami kumpulkan:**

* Kami tidak menyimpan alamat IP
* Kami tidak memasang cookie terpisah untuk analitik
* Kami tidak menggunakan layanan analitik pihak ketiga
* Kami tidak melacak pengunjung antar hari atau sesi saat mereka belum masuk

**Apa yang KAMI kumpulkan:**

* Tampilan halaman dan penggunaan layanan yang digabungkan (SMTP, IMAP, POP3, API, dll.)
* Jenis dan versi browser serta sistem operasi (diurai dari user agent, data mentah dibuang)
* Jenis perangkat (desktop, mobile, tablet)
* Domain perujuk (bukan URL lengkap) dan parameter kampanye (UTM)
* Jenis klien email untuk protokol mail (misalnya Thunderbird, Outlook)
* Halaman atau jalur API yang diminta, dengan nilai di dalamnya seperti nama domain, ID, dan token diganti dengan placeholder, dan apakah permintaan tersebut berhasil
* Untuk kunjungan situs web, halaman pertama kunjungan dan jumlah halaman, yang disimpan di sesi Anda (lihat [Cookie dan Sesi](#cookies-and-sessions))
* Saat Anda sudah masuk, ID akun, alias, atau domain Anda, agar kami dapat melihat bagaimana setiap layanan digunakan dan memecahkan masalah

**Retensi data:**

* Peristiwa analitik secara otomatis dihapus setelah 30 hari
* Total per jam, yang tidak dikaitkan dengan akun mana pun, disimpan selama 90 hari
* Identifier sesi berganti setiap hari dan tidak dapat digunakan untuk melacak pengunjung antar hari


## Aplikasi dan Webmail {#apps-and-webmail}

Bagian ini mencakup aplikasi email kami untuk iOS, Android, macOS, Windows, dan Linux, serta webmail kami di <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, yang menggunakan kode yang sama. Aplikasi kami tidak berisi kode iklan atau pelacakan, maupun analitik pihak ketiga.

### Data di Perangkat Anda {#data-on-your-device}

* Aplikasi menyimpan email, kontak, kalender, pengaturan, dan informasi masuk Anda di perangkat Anda, sehingga aplikasi dapat dimuat dengan cepat dan berfungsi secara offline.
* Jika Anda mengaktifkan App Lock, aplikasi mengenkripsi konten email, kontak, dan informasi masuk yang tersimpan dengan kunci yang dilindungi oleh PIN atau kunci sandi Anda. Tanggal, folder, label, dan penanda tetap tidak terenkripsi agar aplikasi dapat mengurutkan dan menghitung email Anda.
* Keluar dari sebuah akun akan menghapus data akun tersebut dari perangkat Anda.

### Data yang Dikirim Aplikasi kepada Kami {#data-the-apps-send-us}

* Alamat email dan kata sandi alias Anda, bersama setiap permintaan, agar Anda dapat masuk.
* Email, kontak, kalender, label, dan filter yang Anda kirim, buat, atau ubah. Kami menyimpan email, kontak, dan kalender seperti yang dijelaskan dalam [Penyimpanan Email](#email-storage), serta email yang Anda kirim seperti yang dijelaskan dalam [Email SMTP Keluar](#outbound-smtp-emails).
* Kata kunci pencarian Anda, agar kami dapat mencari di kotak surat Anda di server kami. Kata kunci pencarian merupakan bagian dari URL permintaan, sehingga dapat muncul di [log kesalahan](#error-logs) dan [log server](#server-logs).
* Masukan yang Anda pilih untuk disampaikan dari aplikasi, yang dikirim melalui email dari alias Anda ke tim dukungan kami beserta detail diagnostik yang Anda pilih untuk disertakan.
* Email yang Anda laporkan sebagai spam, yang diteruskan oleh aplikasi ke tim penyalahgunaan kami (atau ke alamat lain yang Anda atur di Settings).

### Notifikasi Push {#push-notifications}

* Saat Anda mengizinkan notifikasi, aplikasi mendaftarkan token push ke kami. Kami menyimpannya bersama platform, alias dan akun terkait, waktu pengiriman terakhirnya, dan nama perangkat yang diambil dari user agent aplikasi, yang mencakup versi sistem operasi Anda dan, di Android, model perangkat Anda.
* Kami menyimpan token push hingga satu tahun setelah terakhir digunakan. Kami menghapusnya lebih cepat saat Anda keluar dari akun di aplikasi, saat pengiriman gagal tiga kali berturut-turut, saat kata sandi alias berubah, saat Anda menghapus alias atau akun Anda, atau saat alias berpindah ke pemilik lain.
* Di iOS dan macOS, notifikasi dikirim melalui Apple Push Notification service. Di aplikasi Android kami dari Google Play, notifikasi dikirim melalui Firebase Cloud Messaging. Notifikasi email baru mencakup nama dan alamat pengirim, subjek, pratinjau singkat, dan nama folder, juga untuk email yang tiba tanpa memunculkan peringatan, seperti email yang dimasukkan ke folder Email Sampah atau folder Terkirim. Saat email, kalender, atau kontak berubah, kami juga mengirim notifikasi senyap dengan pengidentifikasi tetapi tanpa konten email, agar aplikasi tetap terkini.
* Dengan [UnifiedPush](https://unifiedpush.org/) di Android, dan dengan notifikasi di browser web, setiap notifikasi dienkripsi sehingga hanya perangkat Anda yang dapat membacanya.
* Aplikasi Android kami dari Google Play menyertakan Firebase Cloud Messaging, yang mengirimkan ID instalasi Firebase, versi aplikasi, serta detail perangkat dan SDK kepada Google. Aplikasi Android kami dari GitHub, yang bebas Google, tidak menyertakan Firebase.

### Gambar dan Tautan dalam Email {#images-and-links-in-emails}

* Gambar dalam email dimuat dari server pengirim, yang dapat melihat alamat IP Anda dan kapan gambar tersebut dimuat.
* Aplikasi memblokir piksel pelacak secara default. Anda juga dapat memblokir semua gambar eksternal di Settings > Privacy & Security, lalu memuatnya per email.
* Tautan dalam email dibuka di browser web Anda.

### Koneksi Lainnya {#other-connections}

* Webmail kami menanyakan versi terbarunya ke GitHub saat dimuat, saat Anda kembali ke webmail, dan setiap 10 menit selama masih terbuka. About & Help menanyakan rilis desktop terbaru ke GitHub, dan aplikasi desktop memeriksa pembaruan di GitHub. GitHub menerima alamat IP Anda melalui permintaan ini.


## Informasi yang Dibagikan {#information-shared}

Kami tidak membagikan informasi Anda dengan pihak ketiga manapun, kecuali dengan penyedia layanan yang menjalankan sebagian layanan kami, seperti Cloudflare (perlindungan situs web dan cadangan terenkripsi), Stripe dan PayPal (pembayaran), serta layanan yang mengirimkan notifikasi push ke perangkat Anda (lihat [Notifikasi Push](#push-notifications)).

Kami mungkin perlu dan akan mematuhi permintaan hukum yang diperintahkan pengadilan (tetapi ingat [kami tidak mengumpulkan informasi yang disebutkan di atas dalam "Informasi yang Tidak Dikumpulkan"](#information-not-collected), jadi kami tidak akan dapat memberikannya sejak awal).


## Penghapusan Informasi {#information-removal}

Jika kapan saja Anda ingin menghapus informasi yang telah Anda berikan kepada kami, maka pergi ke <a href="/my-account/security">Akun Saya > Keamanan</a> dan klik "Hapus Akun".

Karena pencegahan dan mitigasi penyalahgunaan, akun Anda mungkin memerlukan tinjauan penghapusan manual oleh admin kami jika Anda menghapusnya dalam waktu 5 hari setelah pembayaran pertama Anda.

Proses ini biasanya memakan waktu kurang dari 24 jam dan diterapkan karena pengguna menyalahgunakan layanan kami dengan spam, lalu dengan cepat menghapus akun mereka – yang mencegah kami memblokir sidik jari metode pembayaran mereka di Stripe.

Menghapus akun Anda juga akan menghapus domain yang Anda kelola, alias Anda, dan token push yang terdaftar untuk alias tersebut. Catatan akun itu sendiri tetap ada, dengan alamat email, detail penagihan, kata sandi, dan kunci sandinya dihapus serta autentikasi dua faktor dan token API-nya dicabut, dan kami menyimpan catatan pembayarannya untuk pengembalian dana dan akuntansi. Log dan data analitik yang merujuk ke akun Anda dihapus sesuai jangka waktu yang disebutkan di atas.

Untuk menghapus data aplikasi dari perangkat, keluar dari akun di aplikasi atau copot pemasangan aplikasi tersebut.


## Pengungkapan Tambahan {#additional-disclosures}

Situs ini dilindungi oleh Cloudflare dan [Kebijakan Privasi](https://www.cloudflare.com/privacypolicy/) serta [Ketentuan Layanan](https://www.cloudflare.com/website-terms/) mereka berlaku.
