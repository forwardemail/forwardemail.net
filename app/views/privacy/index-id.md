# Kebijakan Privasi {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Kebijakan privasi Forward Email" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Penafian](#disclaimer)
* [Informasi yang Tidak Dikumpulkan](#information-not-collected)
* [Informasi yang Dikumpulkan](#information-collected)
  * [Informasi Akun](#account-information)
  * [Penyimpanan Email](#email-storage)
  * [Log Kesalahan](#error-logs)
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
* [Informasi yang Dibagikan](#information-shared)
* [Penghapusan Informasi](#information-removal)
* [Pengungkapan Tambahan](#additional-disclosures)


## Penafian {#disclaimer}

Silakan merujuk pada [Ketentuan](/terms) kami karena berlaku di seluruh situs.


## Informasi yang Tidak Dikumpulkan {#information-not-collected}

**Kecuali untuk informasi yang secara tegas dijelaskan dalam kebijakan ini — termasuk [log kesalahan](#error-logs), [email SMTP keluar](#outbound-smtp-emails), [informasi akun](#account-information), [pemrosesan data sementara](#temporary-data-processing), [log audit](#audit-logs), dan [kuki dan sesi](#cookies-and-sessions):**

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
* Halaman pertama yang Anda kunjungi di situs kami
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


## Analytics {#analytics}

Kami menggunakan sistem analitik yang berfokus pada privasi untuk memahami bagaimana layanan kami digunakan. Sistem ini dirancang dengan privasi sebagai prinsip inti:

**Apa yang TIDAK kami kumpulkan:**

* Kami tidak menyimpan alamat IP
* Kami tidak menggunakan cookie atau pengenal persisten untuk analitik
* Kami tidak menggunakan layanan analitik pihak ketiga
* Kami tidak melacak pengguna antar hari atau sesi

**Apa yang KAMI kumpulkan (anonim):**

* Tampilan halaman dan penggunaan layanan yang digabungkan (SMTP, IMAP, POP3, API, dll.)
* Jenis browser dan sistem operasi (diurai dari user agent, data mentah dibuang)
* Jenis perangkat (desktop, mobile, tablet)
* Domain perujuk (bukan URL lengkap)
* Jenis klien email untuk protokol mail (misalnya Thunderbird, Outlook)

**Retensi data:**

* Data analitik secara otomatis dihapus setelah 30 hari
* Identifier sesi berganti setiap hari dan tidak dapat digunakan untuk melacak pengguna antar hari


## Informasi yang Dibagikan {#information-shared}

Kami tidak membagikan informasi Anda dengan pihak ketiga manapun.

Kami mungkin perlu dan akan mematuhi permintaan hukum yang diperintahkan pengadilan (tetapi ingat [kami tidak mengumpulkan informasi yang disebutkan di atas dalam "Informasi yang Tidak Dikumpulkan"](#information-not-collected), jadi kami tidak akan dapat memberikannya sejak awal).


## Penghapusan Informasi {#information-removal}

Jika kapan saja Anda ingin menghapus informasi yang telah Anda berikan kepada kami, maka pergi ke <a href="/my-account/security">Akun Saya > Keamanan</a> dan klik "Hapus Akun".

Karena pencegahan dan mitigasi penyalahgunaan, akun Anda mungkin memerlukan tinjauan penghapusan manual oleh admin kami jika Anda menghapusnya dalam waktu 5 hari setelah pembayaran pertama Anda.

Proses ini biasanya memakan waktu kurang dari 24 jam dan diterapkan karena pengguna menyalahgunakan layanan kami dengan spam, lalu dengan cepat menghapus akun mereka – yang mencegah kami memblokir sidik jari metode pembayaran mereka di Stripe.


## Pengungkapan Tambahan {#additional-disclosures}

Situs ini dilindungi oleh Cloudflare dan [Kebijakan Privasi](https://www.cloudflare.com/privacypolicy/) serta [Ketentuan Layanan](https://www.cloudflare.com/website-terms/) mereka berlaku.
