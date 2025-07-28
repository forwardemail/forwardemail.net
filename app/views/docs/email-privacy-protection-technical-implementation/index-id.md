# Cara Kerja Penerusan Email dengan Forward Email: Panduan Lengkap {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Kata pengantar](#foreword)
* [Apa itu Penerusan Email](#what-is-email-forwarding)
* [Cara Kerja Penerusan Email: Penjelasan Teknisnya](#how-email-forwarding-works-the-technical-explanation)
  * [Proses Penerusan Email](#the-email-forwarding-process)
  * [Peran SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Cara Kerja Penerusan Email: Penjelasan Sederhana](#how-email-forwarding-works-the-simple-explanation)
* [Menyiapkan Penerusan Email dengan Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Daftar Akun](#1-sign-up-for-an-account)
  * [2. Tambahkan Domain Anda](#2-add-your-domain)
  * [3. Konfigurasikan Catatan DNS](#3-configure-dns-records)
  * [4. Buat Penerusan Email](#4-create-email-forwards)
  * [5. Mulai Menggunakan Alamat Email Baru Anda](#5-start-using-your-new-email-addresses)
* [Fitur Lanjutan Forward Email](#advanced-features-of-forward-email)
  * [Alamat Sekali Pakai](#disposable-addresses)
  * [Beberapa Penerima dan Wildcard](#multiple-recipients-and-wildcards)
  * [Integrasi "Kirim Email Sebagai"](#send-mail-as-integration)
  * [Keamanan Tahan Kuantum](#quantum-resistant-security)
  * [Kotak Surat SQLite Terenkripsi Secara Individual](#individually-encrypted-sqlite-mailboxes)
* [Mengapa Memilih Forward Email Dibandingkan Pesaing?](#why-choose-forward-email-over-competitors)
  * [1. 100% Sumber Terbuka](#1-100-open-source)
  * [2. Berfokus pada Privasi](#2-privacy-focused)
  * [3. Tidak Ada Ketergantungan Pihak Ketiga](#3-no-third-party-reliance)
  * [4. Penetapan Harga yang Hemat Biaya](#4-cost-effective-pricing)
  * [5. Sumber Daya Tak Terbatas](#5-unlimited-resources)
  * [6. Dipercaya oleh Organisasi Besar](#6-trusted-by-major-organizations)
* [Kasus Penggunaan Umum untuk Penerusan Email](#common-use-cases-for-email-forwarding)
  * [Untuk Bisnis](#for-businesses)
  * [Untuk Pengembang](#for-developers)
  * [Untuk Individu yang Peduli Privasi](#for-privacy-conscious-individuals)
* [Praktik Terbaik untuk Penerusan Email](#best-practices-for-email-forwarding)
  * [1. Gunakan Alamat Deskriptif](#1-use-descriptive-addresses)
  * [2. Terapkan Autentikasi yang Tepat](#2-implement-proper-authentication)
  * [3. Tinjau Terusan Anda Secara Berkala](#3-regularly-review-your-forwards)
  * [4. Siapkan "Kirim Email Sebagai" untuk Balasan yang Mudah](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Gunakan Alamat Catch-All dengan Hati-hati](#5-use-catch-all-addresses-cautiously)
* [Kesimpulan](#conclusion)

## Kata Pengantar {#foreword}

Penerusan email adalah alat yang ampuh yang dapat mengubah cara Anda mengelola komunikasi daring. Baik Anda pemilik bisnis yang ingin membuat alamat email profesional dengan domain khusus, individu yang peduli privasi yang ingin melindungi email utama, atau pengembang yang membutuhkan manajemen email yang fleksibel, memahami penerusan email sangat penting dalam lanskap digital saat ini.

Di Forward Email, kami telah membangun layanan penerusan email yang paling aman, pribadi, dan fleksibel di dunia. Dalam panduan lengkap ini, kami akan menjelaskan cara kerja penerusan email (dari perspektif teknis dan praktis), memandu Anda melalui proses penyiapan kami yang sederhana, dan menyoroti mengapa layanan kami menonjol dari pesaing.

## Apa itu Penerusan Email {#what-is-email-forwarding}

Penerusan email adalah proses yang secara otomatis mengalihkan email yang dikirim ke satu alamat email ke alamat tujuan lainnya. Misalnya, ketika seseorang mengirim email ke <contact@yourdomain.com>, pesan tersebut dapat secara otomatis diteruskan ke Gmail pribadi Anda, Outlook, atau akun email lainnya.

Kemampuan yang tampaknya sederhana ini menawarkan manfaat yang hebat:

* **Professional Branding**: Gunakan alamat email dengan domain khusus Anda (<you@yourdomain.com>) sambil mengelola semuanya dari kotak masuk pribadi Anda yang sudah ada
* **Perlindungan Privasi**: Buat alamat sekali pakai atau alamat khusus yang melindungi email utama Anda
* **Manajemen yang Disederhanakan**: Gabungkan beberapa alamat email ke dalam satu kotak masuk
* **Fleksibilitas**: Buat alamat tanpa batas untuk berbagai tujuan tanpa mengelola beberapa akun

## Cara Kerja Penerusan Email: Penjelasan Teknis {#how-email-forwarding-works-the-technical-explanation}

Bagi mereka yang tertarik dengan detail teknis, mari kita jelajahi apa yang terjadi di balik layar saat email diteruskan.

### Proses Penerusan Email {#the-email-forwarding-process}

1. **Konfigurasi DNS**: Proses ini dimulai dengan rekaman DNS domain Anda. Saat Anda menyiapkan penerusan email, Anda mengonfigurasi rekaman MX (Mail Exchange) yang memberi tahu internet ke mana email untuk domain Anda harus dikirimkan. Rekaman ini mengarah ke server email kami.

2. **Penerimaan Email**: Saat seseorang mengirim email ke alamat domain kustom Anda (misalnya, <Anda@domainanda.com>), server email mereka mencari catatan MX domain Anda dan mengirimkan pesan tersebut ke server kami.

3. **Pemrosesan dan Autentikasi**: Server kami menerima email dan menjalankan beberapa fungsi penting:
* Memverifikasi keaslian pengirim menggunakan protokol seperti SPF, DKIM, dan DMARC
* Memindai konten berbahaya
* Memeriksa penerima berdasarkan aturan penerusan Anda

4. **Penulisan Ulang Pengirim**: Di sinilah keajaiban terjadi. Kami menerapkan Skema Penulisan Ulang Pengirim (SRS) untuk mengubah jalur pengembalian email. Ini penting karena banyak penyedia email menolak email yang diteruskan tanpa penerapan SRS yang tepat, karena email tersebut dapat tampak palsu.

5. **Penerusan**: Email kemudian dikirim ke alamat tujuan Anda dengan konten asli tetap utuh.

6. **Pengiriman**: Email tiba di kotak masuk Anda, tampak seolah-olah dikirim ke alamat penerusan Anda, mempertahankan tampilan profesional domain kustom Anda.

### Peran SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

SRS perlu mendapat perhatian khusus karena sangat penting untuk penerusan email yang andal. Saat email diteruskan, alamat pengirim perlu ditulis ulang untuk memastikan email lolos pemeriksaan SPF di tujuan akhir.

Tanpa SRS, email yang diteruskan sering kali gagal dalam verifikasi SPF dan ditandai sebagai spam atau ditolak sepenuhnya. Penerapan SRS kami memastikan email yang diteruskan terkirim dengan andal sekaligus mempertahankan informasi pengirim asli dengan cara yang transparan bagi Anda.

## Cara Kerja Penerusan Email: Penjelasan Sederhana {#how-email-forwarding-works-the-simple-explanation}

Jika rincian teknisnya tampak membingungkan, berikut cara yang lebih sederhana untuk memahami penerusan email:

Anggap penerusan email seperti penerusan surat untuk surat fisik. Saat Anda pindah ke rumah baru, Anda dapat meminta layanan pos untuk meneruskan semua surat dari alamat lama Anda ke alamat baru. Penerusan email bekerja dengan cara yang sama, tetapi untuk pesan digital.

Dengan Email Terusan:

1. Anda memberi tahu kami alamat email mana di domain Anda yang ingin Anda siapkan (seperti <sales@yourdomain.com> atau <contact@yourdomain.com>)
2. Anda memberi tahu kami ke mana Anda ingin email tersebut dikirimkan (seperti akun Gmail atau Outlook Anda)
3. Kami menangani semua detail teknis untuk memastikan email yang dikirim ke alamat khusus Anda sampai dengan aman di kotak masuk yang Anda tentukan

Semudah itu! Anda dapat menggunakan alamat email profesional tanpa mengubah alur kerja email yang sudah ada.

## Menyiapkan Penerusan Email dengan Forward Email {#setting-up-email-forwarding-with-forward-email}

Salah satu keuntungan terbesar dari Forward Email adalah kemudahan pengaturannya. Berikut panduan langkah demi langkahnya:

### 1. Daftar Akun {#1-sign-up-for-an-account}

Kunjungi [forwardemail.net](https://forwardemail.net) dan buat akun gratis. Proses pendaftaran kami hanya membutuhkan waktu kurang dari satu menit.

### 2. Tambahkan Domain Anda {#2-add-your-domain}

Setelah masuk, tambahkan domain yang ingin Anda gunakan untuk penerusan email. Jika Anda belum memiliki domain, Anda harus membelinya dari pendaftar domain terlebih dahulu.

### 3. Konfigurasikan Rekaman DNS {#3-configure-dns-records}

Kami akan memberikan Anda rekaman DNS yang tepat yang perlu Anda tambahkan ke domain Anda. Biasanya, hal ini melibatkan:

* Menambahkan catatan MX yang mengarah ke server email kami
* Menambahkan catatan TXT untuk verifikasi dan keamanan

Sebagian besar pendaftar domain memiliki antarmuka yang sederhana untuk menambahkan data ini. Kami menyediakan panduan terperinci untuk semua pendaftar domain utama agar proses ini berjalan semulus mungkin.

### 4. Buat Penerusan Email {#4-create-email-forwards}

Setelah catatan DNS Anda diverifikasi (yang biasanya hanya memerlukan waktu beberapa menit), Anda dapat membuat penerusan email. Cukup tentukan:

* Alamat email pada domain Anda (misalnya, <contact@yourdomain.com>)
* Tujuan pengiriman email (misalnya, alamat Gmail pribadi Anda)

### 5. Mulai Menggunakan Alamat Email Baru Anda {#5-start-using-your-new-email-addresses}

Selesai! Email yang dikirim ke alamat domain kustom Anda sekarang akan diteruskan ke tujuan yang Anda tentukan. Anda dapat membuat penerusan sebanyak yang Anda perlukan, termasuk alamat catch-all yang meneruskan semua email yang dikirim ke alamat mana pun di domain Anda.

## Fitur Lanjutan Email Terusan {#advanced-features-of-forward-email}

Meskipun penerusan email dasar sudah sangat hebat, Penerusan Email menawarkan beberapa fitur lanjutan yang membedakan kami:

### Alamat Sekali Pakai {#disposable-addresses}

Buat alamat email khusus atau anonim yang meneruskan ke akun utama Anda. Anda dapat memberi label pada alamat ini dan mengaktifkan atau menonaktifkannya kapan saja agar kotak masuk Anda tetap teratur. Alamat email Anda yang sebenarnya tidak akan pernah terekspos.

### Beberapa Penerima dan Karakter Pengganti {#multiple-recipients-and-wildcards}

Teruskan satu alamat ke beberapa penerima, sehingga memudahkan berbagi informasi dengan tim. Anda juga dapat menggunakan alamat wildcard (penerusan catch-all) untuk menerima email yang dikirim ke alamat mana pun di domain Anda.

### Integrasi "Kirim Email Sebagai" {#send-mail-as-integration}

Anda tidak perlu meninggalkan kotak masuk untuk mengirim email dari domain khusus Anda. Kirim dan balas pesan seolah-olah berasal dari <you@yourdomain.com> langsung dari akun Gmail atau Outlook Anda.

### Keamanan Tahan Kuantum {#quantum-resistant-security}

Kami adalah layanan email pertama dan satu-satunya di dunia yang menggunakan enkripsi tahan kuantum, melindungi komunikasi Anda bahkan dari ancaman masa depan yang paling canggih sekalipun.

### Kotak Surat SQLite Terenkripsi Individual {#individually-encrypted-sqlite-mailboxes}

Tidak seperti penyedia lain yang menyimpan semua email pengguna dalam basis data bersama, kami menggunakan kotak surat SQLite yang dienkripsi secara individual untuk privasi dan keamanan yang tak tertandingi.

## Mengapa Memilih Email Terusan Dibandingkan Pesaing {#why-choose-forward-email-over-competitors}

Pasar penerusan email memiliki beberapa pemain, tetapi Forward Email menonjol dalam beberapa hal penting:

### 1. 100% Sumber Terbuka {#1-100-open-source}

Kami adalah satu-satunya layanan penerusan email yang sepenuhnya bersumber terbuka, termasuk kode backend kami. Transparansi ini membangun kepercayaan dan memungkinkan audit keamanan independen. Layanan lain mungkin mengklaim sebagai sumber terbuka tetapi tidak merilis kode backend mereka.

### 2. Berfokus pada Privasi {#2-privacy-focused}

Kami menciptakan layanan ini karena Anda memiliki hak atas privasi. Kami menggunakan enkripsi yang kuat dengan TLS, tidak menyimpan log SMTP (kecuali untuk kesalahan dan SMTP keluar), dan tidak menulis email Anda ke penyimpanan disk.

### 3. Tidak Ada Ketergantungan Pihak Ketiga {#3-no-third-party-reliance}

Tidak seperti pesaing yang mengandalkan Amazon SES atau layanan pihak ketiga lainnya, kami mempertahankan kontrol penuh atas infrastruktur kami, meningkatkan keandalan dan privasi.

### 4. Penetapan Harga yang Hemat Biaya {#4-cost-effective-pricing}

Model harga kami memungkinkan Anda untuk meningkatkan skala secara hemat biaya. Kami tidak mengenakan biaya per pengguna, dan Anda dapat membayar sesuai pemakaian untuk penyimpanan. Dengan harga $3/bulan, kami menawarkan lebih banyak fitur dengan harga lebih rendah daripada pesaing seperti Gandi ($3,99/bulan).

### 5. Sumber Daya Tak Terbatas {#5-unlimited-resources}

Kami tidak memberlakukan batasan buatan pada domain, alias, atau alamat email seperti yang dilakukan banyak pesaing.

### 6. Dipercaya oleh Organisasi Besar {#6-trusted-by-major-organizations}

Layanan kami digunakan oleh lebih dari 500.000 domain, termasuk organisasi terkenal seperti [Akademi Angkatan Laut AS](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [Yayasan Linux](/blog/docs/linux-foundation-email-enterprise-case-study), [Kanonik/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales, dan banyak lainnya.

## Kasus Penggunaan Umum untuk Penerusan Email {#common-use-cases-for-email-forwarding}

Penerusan email memecahkan berbagai tantangan untuk berbagai jenis pengguna:

### Untuk Bisnis {#for-businesses}

* Membuat alamat email profesional untuk berbagai departemen (sales@, support@, info@)
* Mengelola komunikasi email tim dengan mudah
* Menjaga konsistensi merek dalam semua komunikasi
* Menyederhanakan pengelolaan email selama pergantian staf

### Untuk Pengembang {#for-developers}

* Menyiapkan sistem notifikasi otomatis
* Membuat alamat khusus untuk berbagai proyek
* Mengintegrasikan dengan webhook untuk otomatisasi tingkat lanjut
* Memanfaatkan API kami untuk implementasi khusus

### Untuk Individu yang Peduli Privasi {#for-privacy-conscious-individuals}

* Buat alamat email terpisah untuk berbagai layanan guna melacak siapa saja yang membagikan informasi Anda
* Gunakan alamat sekali pakai untuk pendaftaran satu kali
* Jaga privasi dengan melindungi alamat email utama Anda
* Nonaktifkan alamat yang mulai menerima spam dengan mudah

## Praktik Terbaik untuk Penerusan Email {#best-practices-for-email-forwarding}

Untuk mendapatkan hasil maksimal dari penerusan email, pertimbangkan praktik terbaik berikut:

### 1. Gunakan Alamat Deskriptif {#1-use-descriptive-addresses}

Buat alamat email yang dengan jelas menunjukkan tujuannya (misalnya, <newsletter@yourdomain.com>, <shopping@yourdomain.com>) untuk membantu mengatur surat masuk Anda.

### 2. Terapkan Autentikasi yang Tepat {#2-implement-proper-authentication}

Pastikan domain Anda memiliki rekaman SPF, DKIM, dan DMARC yang tepat untuk memaksimalkan pengiriman. Forward Email mempermudah hal ini dengan pengaturan terpandu kami.

### 3. Tinjau Penerusan Anda Secara Berkala {#3-regularly-review-your-forwards}

Audit email penerusan Anda secara berkala untuk menonaktifkan email yang tidak lagi diperlukan atau menerima spam berlebihan.

### 4. Atur "Kirim Email Sebagai" untuk Balasan yang Lancar {#4-set-up-send-mail-as-for-seamless-replies}

Konfigurasikan klien email utama Anda untuk mengirim email sebagai alamat domain kustom Anda untuk pengalaman yang konsisten saat membalas email yang diteruskan.

### 5. Gunakan Alamat Catch-All dengan Hati-hati {#5-use-catch-all-addresses-cautiously}

Meskipun alamat yang dapat menampung semua pesan mudah digunakan, alamat tersebut berpotensi menerima lebih banyak spam. Pertimbangkan untuk membuat penerusan khusus untuk komunikasi penting.

## Kesimpulan {#conclusion}

Penerusan email adalah alat hebat yang menghadirkan profesionalisme, privasi, dan kesederhanaan pada komunikasi email Anda. Dengan Forward Email, Anda mendapatkan layanan penerusan email yang paling aman, pribadi, dan fleksibel yang tersedia.

Sebagai satu-satunya penyedia layanan sumber terbuka 100% dengan enkripsi tahan kuantum dan fokus pada privasi, kami telah membangun layanan yang menghormati hak-hak Anda sekaligus memberikan fungsionalitas yang luar biasa.

Apakah Anda ingin membuat alamat email profesional untuk bisnis Anda, melindungi privasi Anda dengan alamat sekali pakai, atau menyederhanakan pengelolaan beberapa akun email, Forward Email menyediakan solusi yang sempurna.

Siap mengubah pengalaman email Anda? [Daftar gratis](https://forwardemail.net) hari ini dan bergabunglah dengan lebih dari 500.000 domain yang telah mendapatkan manfaat dari layanan kami.

---

*Tulisan blog ini ditulis oleh tim Forward Email, pencipta layanan penerusan email paling aman, privat, dan fleksibel di dunia. Kunjungi [forwardemail.net](https://forwardemail.net) untuk mempelajari lebih lanjut tentang layanan kami dan mulai meneruskan email dengan percaya diri.*