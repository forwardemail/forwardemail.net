# Cara Kerja Pengalihan Email dengan Forward Email: Panduan Utama {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Implementasi teknis perlindungan privasi email" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Kata Pengantar](#foreword)
* [Apa itu Pengalihan Email](#what-is-email-forwarding)
* [Cara Kerja Pengalihan Email: Penjelasan Teknis](#how-email-forwarding-works-the-technical-explanation)
  * [Proses Pengalihan Email](#the-email-forwarding-process)
  * [Peran SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Cara Kerja Pengalihan Email: Penjelasan Sederhana](#how-email-forwarding-works-the-simple-explanation)
* [Mengatur Pengalihan Email dengan Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Daftar Akun](#1-sign-up-for-an-account)
  * [2. Tambahkan Domain Anda](#2-add-your-domain)
  * [3. Konfigurasikan Rekaman DNS](#3-configure-dns-records)
  * [4. Buat Pengalihan Email](#4-create-email-forwards)
  * [5. Mulai Gunakan Alamat Email Baru Anda](#5-start-using-your-new-email-addresses)
* [Fitur Lanjutan Forward Email](#advanced-features-of-forward-email)
  * [Alamat Sekali Pakai](#disposable-addresses)
  * [Beberapa Penerima dan Wildcard](#multiple-recipients-and-wildcards)
  * [Integrasi "Kirim Email Sebagai"](#send-mail-as-integration)
  * [Keamanan Tahan Kuantum](#quantum-resistant-security)
  * [Kotak Surat SQLite yang Dienkripsi Secara Individual](#individually-encrypted-sqlite-mailboxes)
* [Mengapa Memilih Forward Email Dibandingkan Pesaing](#why-choose-forward-email-over-competitors)
  * [1. 100% Open-Source](#1-100-open-source)
  * [2. Fokus pada Privasi](#2-privacy-focused)
  * [3. Tidak Bergantung pada Pihak Ketiga](#3-no-third-party-reliance)
  * [4. Harga yang Efektif Biaya](#4-cost-effective-pricing)
  * [5. Sumber Daya Tak Terbatas](#5-unlimited-resources)
  * [6. Dipercaya oleh Organisasi Besar](#6-trusted-by-major-organizations)
* [Kasus Penggunaan Umum untuk Pengalihan Email](#common-use-cases-for-email-forwarding)
  * [Untuk Bisnis](#for-businesses)
  * [Untuk Pengembang](#for-developers)
  * [Untuk Individu yang Peduli Privasi](#for-privacy-conscious-individuals)
* [Praktik Terbaik untuk Pengalihan Email](#best-practices-for-email-forwarding)
  * [1. Gunakan Alamat yang Deskriptif](#1-use-descriptive-addresses)
  * [2. Terapkan Otentikasi yang Tepat](#2-implement-proper-authentication)
  * [3. Tinjau Pengalihan Anda Secara Berkala](#3-regularly-review-your-forwards)
  * [4. Atur "Kirim Email Sebagai" untuk Balasan yang Lancar](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Gunakan Alamat Catch-All dengan Hati-hati](#5-use-catch-all-addresses-cautiously)
* [Kesimpulan](#conclusion)


## Kata Pengantar {#foreword}

Pengalihan email adalah alat yang kuat yang dapat mengubah cara Anda mengelola komunikasi online Anda. Baik Anda pemilik bisnis yang ingin membuat alamat email profesional dengan domain khusus Anda, individu yang peduli privasi yang ingin melindungi email utama Anda, atau pengembang yang membutuhkan manajemen email yang fleksibel, memahami pengalihan email sangat penting di lanskap digital saat ini.

Di Forward Email, kami telah membangun layanan pengalihan email yang paling aman, privat, dan fleksibel di dunia. Dalam panduan komprehensif ini, kami akan menjelaskan cara kerja pengalihan email (dari perspektif teknis dan praktis), memandu Anda melalui proses pengaturan sederhana kami, dan menyoroti mengapa layanan kami menonjol dibandingkan pesaing.


## Apa itu Pengalihan Email {#what-is-email-forwarding}

Pengalihan email adalah proses yang secara otomatis mengarahkan ulang email yang dikirim ke satu alamat email ke alamat tujuan lain. Misalnya, ketika seseorang mengirim email ke <contact@yourdomain.com>, pesan tersebut dapat secara otomatis diteruskan ke Gmail pribadi Anda, Outlook, atau akun email lainnya.

Kemampuan yang tampak sederhana ini menawarkan manfaat yang kuat:

* **Branding Profesional**: Gunakan alamat email dengan domain khusus Anda (<you@yourdomain.com>) sambil mengelola semuanya dari kotak masuk pribadi Anda yang sudah ada
* **Perlindungan Privasi**: Buat alamat sekali pakai atau khusus tujuan yang melindungi email utama Anda
* **Manajemen yang Disederhanakan**: Konsolidasikan beberapa alamat email ke dalam satu kotak masuk
* **Fleksibilitas**: Buat alamat tak terbatas untuk berbagai tujuan tanpa mengelola banyak akun
## Cara Kerja Penerusan Email: Penjelasan Teknis {#how-email-forwarding-works-the-technical-explanation}

Bagi yang tertarik dengan detail teknis, mari kita jelajahi apa yang terjadi di balik layar saat email diteruskan.

### Proses Penerusan Email {#the-email-forwarding-process}

1. **Konfigurasi DNS**: Proses dimulai dengan catatan DNS domain Anda. Saat Anda mengatur penerusan email, Anda mengonfigurasi catatan MX (Mail Exchange) yang memberi tahu internet ke mana email untuk domain Anda harus dikirim. Catatan ini mengarah ke server email kami.

2. **Penerimaan Email**: Ketika seseorang mengirim email ke alamat domain kustom Anda (misalnya, <you@yourdomain.com>), server email mereka mencari catatan MX domain Anda dan mengirimkan pesan ke server kami.

3. **Pemrosesan dan Otentikasi**: Server kami menerima email dan melakukan beberapa fungsi penting:
   * Memverifikasi keaslian pengirim menggunakan protokol seperti SPF, DKIM, dan DMARC
   * Memindai konten berbahaya
   * Memeriksa penerima sesuai aturan penerusan Anda

4. **Penulisan Ulang Pengirim**: Di sinilah keajaiban terjadi. Kami menerapkan Sender Rewriting Scheme (SRS) untuk memodifikasi jalur pengembalian email. Ini penting karena banyak penyedia email menolak email yang diteruskan tanpa implementasi SRS yang tepat, karena email tersebut bisa tampak seperti dipalsukan.

5. **Penerusan**: Email kemudian dikirim ke alamat tujuan Anda dengan isi asli tetap utuh.

6. **Pengiriman**: Email tiba di kotak masuk Anda, tampak seolah-olah dikirim ke alamat penerusan Anda, menjaga penampilan profesional dari domain kustom Anda.

### Peran SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

SRS layak mendapat perhatian khusus karena sangat penting untuk penerusan email yang andal. Saat email diteruskan, alamat pengirim perlu ditulis ulang untuk memastikan email melewati pemeriksaan SPF di tujuan akhir.

Tanpa SRS, email yang diteruskan sering gagal verifikasi SPF dan ditandai sebagai spam atau ditolak sepenuhnya. Implementasi SRS kami memastikan email yang diteruskan dikirim dengan andal sambil mempertahankan informasi pengirim asli dengan cara yang transparan bagi Anda.


## Cara Kerja Penerusan Email: Penjelasan Sederhana {#how-email-forwarding-works-the-simple-explanation}

Jika detail teknis terasa membingungkan, berikut cara yang lebih sederhana untuk memahami penerusan email:

Pikirkan penerusan email seperti penerusan surat untuk surat fisik. Ketika Anda pindah ke rumah baru, Anda bisa meminta layanan pos untuk meneruskan semua surat dari alamat lama ke alamat baru Anda. Penerusan email bekerja serupa, tapi untuk pesan digital.

Dengan Forward Email:

1. Anda memberi tahu kami alamat email mana di domain Anda yang ingin Anda atur (seperti <sales@yourdomain.com> atau <contact@yourdomain.com>)
2. Anda memberi tahu kami ke mana Anda ingin email tersebut dikirim (seperti akun Gmail atau Outlook Anda)
3. Kami menangani semua detail teknis untuk memastikan email yang dikirim ke alamat kustom Anda tiba dengan aman di kotak masuk yang Anda tentukan

Sesederhana itu! Anda bisa menggunakan alamat email profesional tanpa mengubah alur kerja email yang sudah ada.


## Mengatur Penerusan Email dengan Forward Email {#setting-up-email-forwarding-with-forward-email}

Salah satu keuntungan terbesar Forward Email adalah betapa mudahnya mengaturnya. Berikut panduan langkah demi langkah:

### 1. Daftar Akun {#1-sign-up-for-an-account}

Kunjungi [forwardemail.net](https://forwardemail.net) dan buat akun gratis. Proses pendaftaran kami memakan waktu kurang dari satu menit.

### 2. Tambahkan Domain Anda {#2-add-your-domain}

Setelah masuk, tambahkan domain yang ingin Anda gunakan untuk penerusan email. Jika Anda belum memiliki domain, Anda perlu membelinya terlebih dahulu dari registrar domain.

### 3. Konfigurasikan Catatan DNS {#3-configure-dns-records}

Kami akan memberikan catatan DNS yang tepat yang perlu Anda tambahkan ke domain Anda. Biasanya, ini melibatkan:

* Menambahkan catatan MX yang mengarah ke server email kami
* Menambahkan catatan TXT untuk verifikasi dan keamanan

Sebagian besar registrar domain memiliki antarmuka sederhana untuk menambahkan catatan ini. Kami menyediakan panduan terperinci untuk semua registrar domain utama agar proses ini berjalan semulus mungkin.
### 4. Buat Pengalihan Email {#4-create-email-forwards}

Setelah catatan DNS Anda diverifikasi (yang biasanya hanya memakan waktu beberapa menit), Anda dapat membuat pengalihan email. Cukup tentukan:

* Alamat email di domain Anda (misalnya, <contact@yourdomain.com>)
* Tujuan tempat Anda ingin email dikirim (misalnya, alamat Gmail pribadi Anda)

### 5. Mulai Menggunakan Alamat Email Baru Anda {#5-start-using-your-new-email-addresses}

Selesai! Email yang dikirim ke alamat domain kustom Anda sekarang akan diteruskan ke tujuan yang Anda tentukan. Anda dapat membuat sebanyak mungkin pengalihan yang Anda butuhkan, termasuk alamat catch-all yang meneruskan semua email yang dikirim ke alamat mana pun di domain Anda.


## Fitur Lanjutan dari Forward Email {#advanced-features-of-forward-email}

Meskipun pengalihan email dasar sudah kuat, Forward Email menawarkan beberapa fitur lanjutan yang membedakan kami:

### Alamat Sekali Pakai {#disposable-addresses}

Buat alamat email spesifik atau anonim yang diteruskan ke akun utama Anda. Anda dapat memberikan label pada alamat ini dan mengaktifkan atau menonaktifkannya kapan saja untuk menjaga kotak masuk Anda tetap teratur. Alamat email asli Anda tidak pernah terekspos.

### Banyak Penerima dan Wildcard {#multiple-recipients-and-wildcards}

Teruskan satu alamat ke banyak penerima, memudahkan berbagi informasi dengan tim. Anda juga dapat menggunakan alamat wildcard (pengalihan catch-all) untuk menerima email yang dikirim ke alamat mana pun di domain Anda.

### Integrasi "Kirim Email Sebagai" {#send-mail-as-integration}

Anda tidak perlu meninggalkan kotak masuk untuk mengirim email dari domain kustom Anda. Kirim dan balas pesan seolah-olah dari <you@yourdomain.com> langsung dari akun Gmail atau Outlook Anda.

### Keamanan Tahan Kuantum {#quantum-resistant-security}

Kami adalah layanan email pertama dan satu-satunya di dunia yang menggunakan enkripsi tahan kuantum, melindungi komunikasi Anda dari ancaman masa depan yang paling canggih sekalipun.

### Kotak Surat SQLite yang Dienkripsi Secara Individu {#individually-encrypted-sqlite-mailboxes}

Berbeda dengan penyedia lain yang menyimpan semua email pengguna dalam database bersama, kami menggunakan kotak surat SQLite yang dienkripsi secara individu untuk privasi dan keamanan yang tak tertandingi.


## Mengapa Memilih Forward Email Dibandingkan Pesaing {#why-choose-forward-email-over-competitors}

Pasar pengalihan email memiliki beberapa pemain, tetapi Forward Email menonjol dalam beberapa cara penting:

### 1. 100% Open-Source {#1-100-open-source}

Kami adalah satu-satunya layanan pengalihan email yang sepenuhnya open-source, termasuk kode backend kami. Transparansi ini membangun kepercayaan dan memungkinkan audit keamanan independen. Layanan lain mungkin mengklaim open-source tetapi tidak merilis kode backend mereka.

### 2. Fokus pada Privasi {#2-privacy-focused}

Kami membuat layanan ini karena Anda berhak atas privasi. Kami menggunakan enkripsi kuat dengan TLS, tidak menyimpan log SMTP (kecuali untuk kesalahan dan SMTP keluar), dan tidak menulis email Anda ke penyimpanan disk.

### 3. Tanpa Ketergantungan Pihak Ketiga {#3-no-third-party-reliance}

Berbeda dengan pesaing yang bergantung pada Amazon SES atau layanan pihak ketiga lainnya, kami mempertahankan kendali penuh atas infrastruktur kami, meningkatkan keandalan dan privasi.

### 4. Harga yang Efisien {#4-cost-effective-pricing}

Model harga kami memungkinkan Anda untuk skala dengan biaya yang efisien. Kami tidak mengenakan biaya per pengguna, dan Anda dapat membayar sesuai penggunaan untuk penyimpanan. Dengan $3/bulan, kami menawarkan lebih banyak fitur dengan harga lebih rendah dibandingkan pesaing seperti Gandi ($3,99/bulan).

### 5. Sumber Daya Tak Terbatas {#5-unlimited-resources}

Kami tidak memberlakukan batasan buatan pada domain, alias, atau alamat email seperti banyak pesaing.

### 6. Dipercaya oleh Organisasi Besar {#6-trusted-by-major-organizations}

Layanan kami digunakan oleh lebih dari 500.000 domain, termasuk organisasi terkenal seperti [The U.S. Naval Academy](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [The Linux Foundation](/blog/docs/linux-foundation-email-enterprise-case-study), [Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales, dan banyak lainnya.


## Kasus Penggunaan Umum untuk Pengalihan Email {#common-use-cases-for-email-forwarding}
Penerusan email menyelesaikan berbagai tantangan untuk berbagai jenis pengguna:

### Untuk Bisnis {#for-businesses}

* Buat alamat email profesional untuk departemen yang berbeda (sales@, support@, info@)
* Kelola komunikasi email tim dengan mudah
* Pertahankan konsistensi merek dalam semua komunikasi
* Permudah pengelolaan email saat pergantian staf

### Untuk Pengembang {#for-developers}

* Atur sistem notifikasi otomatis
* Buat alamat khusus untuk berbagai proyek
* Integrasikan dengan webhook untuk otomatisasi tingkat lanjut
* Manfaatkan API kami untuk implementasi kustom

### Untuk Individu yang Peduli Privasi {#for-privacy-conscious-individuals}

* Buat alamat email terpisah untuk layanan berbeda guna melacak siapa yang membagikan informasi Anda
* Gunakan alamat sekali pakai untuk pendaftaran satu kali
* Jaga privasi dengan melindungi alamat email utama Anda
* Mudah menonaktifkan alamat yang mulai menerima spam


## Praktik Terbaik untuk Penerusan Email {#best-practices-for-email-forwarding}

Untuk mendapatkan manfaat maksimal dari penerusan email, pertimbangkan praktik terbaik berikut:

### 1. Gunakan Alamat yang Deskriptif {#1-use-descriptive-addresses}

Buat alamat email yang jelas menunjukkan tujuannya (misalnya, <newsletter@yourdomain.com>, <shopping@yourdomain.com>) untuk membantu mengatur email masuk Anda.

### 2. Terapkan Otentikasi yang Tepat {#2-implement-proper-authentication}

Pastikan domain Anda memiliki catatan SPF, DKIM, dan DMARC yang tepat untuk memaksimalkan keterkiriman. Forward Email memudahkan ini dengan panduan pengaturan kami.

### 3. Tinjau Penerusan Anda Secara Berkala {#3-regularly-review-your-forwards}

Audit secara berkala penerusan email Anda untuk menonaktifkan yang tidak lagi diperlukan atau yang menerima spam berlebihan.

### 4. Atur "Kirim Email Sebagai" untuk Balasan yang Mulus {#4-set-up-send-mail-as-for-seamless-replies}

Konfigurasikan klien email utama Anda untuk mengirim email sebagai alamat domain kustom Anda agar pengalaman balasan email yang diteruskan menjadi konsisten.

### 5. Gunakan Alamat Catch-All dengan Hati-hati {#5-use-catch-all-addresses-cautiously}

Meskipun alamat catch-all nyaman, mereka berpotensi menerima lebih banyak spam. Pertimbangkan membuat penerusan khusus untuk komunikasi penting.


## Kesimpulan {#conclusion}

Penerusan email adalah alat yang kuat yang membawa profesionalisme, privasi, dan kesederhanaan ke komunikasi email Anda. Dengan Forward Email, Anda mendapatkan layanan penerusan email yang paling aman, privat, dan fleksibel yang tersedia.

Sebagai satu-satunya penyedia 100% open-source dengan enkripsi tahan kuantum dan fokus pada privasi, kami telah membangun layanan yang menghormati hak Anda sekaligus memberikan fungsionalitas luar biasa.

Apakah Anda ingin membuat alamat email profesional untuk bisnis Anda, melindungi privasi dengan alamat sekali pakai, atau mempermudah pengelolaan banyak akun email, Forward Email menyediakan solusi yang sempurna.

Siap mengubah pengalaman email Anda? [Daftar gratis](https://forwardemail.net) hari ini dan bergabung dengan lebih dari 500.000 domain yang sudah merasakan manfaat layanan kami.

---

*Posting blog ini ditulis oleh tim Forward Email, pencipta layanan penerusan email paling aman, privat, dan fleksibel di dunia. Kunjungi [forwardemail.net](https://forwardemail.net) untuk mempelajari lebih lanjut tentang layanan kami dan mulai meneruskan email dengan percaya diri.*
