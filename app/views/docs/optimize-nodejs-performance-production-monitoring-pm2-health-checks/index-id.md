# Cara Mengoptimalkan Infrastruktur Produksi Node.js: Praktik Terbaik {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Kata pengantar](#foreword)
* [Revolusi Optimalisasi Performa Inti Tunggal 573% Kami](#our-573-single-core-performance-optimization-revolution)
  * [Mengapa Optimasi Performa Single Core Penting untuk Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Konten Terkait](#related-content)
* [Pengaturan Lingkungan Produksi Node.js: Tumpukan Teknologi Kami](#nodejs-production-environment-setup-our-technology-stack)
  * [Manajer Paket: pnpm untuk Efisiensi Produksi](#package-manager-pnpm-for-production-efficiency)
  * [Kerangka Kerja Web: Koa untuk Produksi Node.js Modern](#web-framework-koa-for-modern-nodejs-production)
  * [Pemrosesan Pekerjaan Latar Belakang: Bree untuk Keandalan Produksi](#background-job-processing-bree-for-production-reliability)
  * [Penanganan Kesalahan: @hapi/boom untuk Keandalan Produksi](#error-handling-hapiboom-for-production-reliability)
* [Cara Memantau Aplikasi Node.js dalam Produksi](#how-to-monitor-nodejs-applications-in-production)
  * [Pemantauan Produksi Node.js Tingkat Sistem](#system-level-nodejs-production-monitoring)
  * [Pemantauan Tingkat Aplikasi untuk Produksi Node.js](#application-level-monitoring-for-nodejs-production)
  * [Pemantauan Spesifik Aplikasi](#application-specific-monitoring)
* [Pemantauan Produksi Node.js dengan Pemeriksaan Kesehatan PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Sistem Pemeriksaan Kesehatan PM2 Kami](#our-pm2-health-check-system)
  * [Konfigurasi Produksi PM2 Kami](#our-pm2-production-configuration)
  * [Penerapan PM2 Otomatis](#automated-pm2-deployment)
* [Sistem Penanganan dan Klasifikasi Kesalahan Produksi](#production-error-handling-and-classification-system)
  * [Implementasi isCodeBug kami untuk Produksi](#our-iscodebug-implementation-for-production)
  * [Integrasi dengan Pencatatan Produksi Kami](#integration-with-our-production-logging)
  * [Konten Terkait](#related-content-1)
* [Debugging Performa Lanjutan dengan v8-profiler-next dan cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Pendekatan Profil Kami untuk Produksi Node.js](#our-profiling-approach-for-nodejs-production)
  * [Bagaimana Kami Menerapkan Analisis Snapshot Heap](#how-we-implement-heap-snapshot-analysis)
  * [Alur Kerja Debugging Performa](#performance-debugging-workflow)
  * [Implementasi yang Direkomendasikan untuk Aplikasi Node.js Anda](#recommended-implementation-for-your-nodejs-application)
  * [Integrasi dengan Pemantauan Produksi Kami](#integration-with-our-production-monitoring)
* [Keamanan Infrastruktur Produksi Node.js](#nodejs-production-infrastructure-security)
  * [Keamanan Tingkat Sistem untuk Produksi Node.js](#system-level-security-for-nodejs-production)
  * [Keamanan Aplikasi untuk Aplikasi Node.js](#application-security-for-nodejs-applications)
  * [Otomatisasi Keamanan Infrastruktur](#infrastructure-security-automation)
  * [Konten Keamanan Kami](#our-security-content)
* [Arsitektur Basis Data untuk Aplikasi Node.js](#database-architecture-for-nodejs-applications)
  * [Implementasi SQLite untuk Produksi Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementasi MongoDB untuk Produksi Node.js](#mongodb-implementation-for-nodejs-production)
* [Pemrosesan Pekerjaan Latar Belakang Produksi Node.js](#nodejs-production-background-job-processing)
  * [Pengaturan Server Bree Kami untuk Produksi](#our-bree-server-setup-for-production)
  * [Contoh Pekerjaan Produksi](#production-job-examples)
  * [Pola Penjadwalan Pekerjaan Kami untuk Produksi Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Pemeliharaan Otomatis untuk Aplikasi Node.js Produksi](#automated-maintenance-for-production-nodejs-applications)
  * [Implementasi Pembersihan Kami](#our-cleanup-implementation)
  * [Manajemen Ruang Disk untuk Produksi Node.js](#disk-space-management-for-nodejs-production)
  * [Otomatisasi Pemeliharaan Infrastruktur](#infrastructure-maintenance-automation)
* [Panduan Implementasi Penerapan Produksi Node.js](#nodejs-production-deployment-implementation-guide)
  * [Pelajari Kode Aktual Kami untuk Praktik Terbaik Produksi](#study-our-actual-code-for-production-best-practices)
  * [Belajar dari Postingan Blog Kami](#learn-from-our-blog-posts)
  * [Otomatisasi Infrastruktur untuk Produksi Node.js](#infrastructure-automation-for-nodejs-production)
  * [Studi Kasus Kami](#our-case-studies)
* [Kesimpulan: Praktik Terbaik Penerapan Produksi Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Daftar Sumber Daya Lengkap untuk Produksi Node.js](#complete-resource-list-for-nodejs-production)
  * [File Implementasi Inti Kami](#our-core-implementation-files)
  * [Implementasi Server Kami](#our-server-implementations)
  * [Otomatisasi Infrastruktur Kami](#our-infrastructure-automation)
  * [Postingan Blog Teknis Kami](#our-technical-blog-posts)
  * [Studi Kasus Perusahaan Kami](#our-enterprise-case-studies)

## Kata Pengantar {#foreword}

Di Forward Email, kami telah menghabiskan waktu bertahun-tahun menyempurnakan pengaturan lingkungan produksi Node.js kami. Panduan komprehensif ini membagikan praktik terbaik penerapan produksi Node.js kami yang telah teruji, dengan fokus pada pengoptimalan performa, pemantauan, dan pembelajaran yang kami petik dalam menskalakan aplikasi Node.js untuk menangani jutaan transaksi harian.

## Revolusi Optimalisasi Performa Inti Tunggal 573% Kami {#our-573-single-core-performance-optimization-revolution}

Ketika kami bermigrasi dari prosesor Intel ke AMD Ryzen, kami mencapai **peningkatan performa sebesar 573%** pada aplikasi Node.js kami. Ini bukan sekadar optimasi kecil—ini secara fundamental mengubah performa aplikasi Node.js kami dalam produksi dan menunjukkan pentingnya optimasi performa inti tunggal untuk setiap aplikasi Node.js.

> \[!TIP]
> Untuk praktik terbaik penerapan produksi Node.js, pilihan perangkat keras sangatlah penting. Kami secara khusus memilih hosting DataPacket karena ketersediaan AMD Ryzen mereka karena kinerja inti tunggal sangat penting untuk aplikasi Node.js karena eksekusi JavaScript bersifat single-threaded.

### Mengapa Optimasi Performa Inti Tunggal Penting untuk Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Migrasi kami dari Intel ke AMD Ryzen menghasilkan:

* **Peningkatan performa 573%** dalam pemrosesan permintaan (didokumentasikan dalam [Masalah GitHub di halaman status kami #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Menghilangkan penundaan pemrosesan** hingga respons yang hampir instan (disebutkan dalam [Masalah GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Rasio harga-kinerja yang lebih baik** untuk lingkungan produksi Node.js
* **Waktu respons yang lebih baik** di seluruh titik akhir aplikasi kami

Peningkatan performa ini begitu signifikan sehingga kami kini menganggap prosesor AMD Ryzen penting untuk setiap penerapan produksi Node.js yang serius, baik Anda menjalankan aplikasi web, API, layanan mikro, atau beban kerja Node.js lainnya.

### Konten Terkait {#related-content}

Untuk detail selengkapnya tentang pilihan infrastruktur kami, lihat:

* [Layanan Penerusan Email Terbaik]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Perbandingan performa
* [Solusi Hosting Mandiri](https://forwardemail.net/blog/docs/self-hosted-solution) - Rekomendasi perangkat keras

Pengaturan Lingkungan Produksi Node.js ##: Tumpukan Teknologi Kami {#nodejs-production-environment-setup-our-technology-stack}

Praktik terbaik penerapan produksi Node.js kami mencakup pilihan teknologi yang disengaja berdasarkan pengalaman produksi selama bertahun-tahun. Berikut teknologi yang kami gunakan dan mengapa pilihan ini berlaku untuk semua aplikasi Node.js:

### Manajer Paket: pnpm untuk Efisiensi Produksi {#package-manager-pnpm-for-production-efficiency}

**Apa yang kami gunakan:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versi yang disematkan)

Kami memilih pnpm daripada npm dan yarn untuk pengaturan lingkungan produksi Node.js kami karena:

* **Waktu instalasi lebih cepat** dalam pipeline CI/CD
* **Efisiensi ruang disk** melalui hard linking
* **Resolusi dependensi yang ketat** yang mencegah dependensi phantom
* **Performa yang lebih baik** dalam penerapan produksi

> \[!NOTE]
> Sebagai bagian dari praktik terbaik penerapan produksi Node.js, kami menyematkan versi persis dari alat penting seperti pnpm untuk memastikan perilaku yang konsisten di semua lingkungan dan mesin anggota tim.

**Detail implementasi:**

* [Konfigurasi package.json kami](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Postingan blog ekosistem NPM kami](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Kerangka Kerja Web: Koa untuk Produksi Node.js Modern {#web-framework-koa-for-modern-nodejs-production}

**Apa yang kami gunakan:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Kami memilih Koa daripada Express untuk infrastruktur produksi Node.js kami karena dukungan async/await-nya yang modern dan komposisi middleware yang lebih bersih. Pendiri kami, Nick Baugh, berkontribusi pada Express dan Koa, memberi kami wawasan mendalam tentang kedua kerangka kerja tersebut untuk penggunaan produksi.

Pola ini berlaku baik Anda sedang membangun REST API, server GraphQL, aplikasi web, atau layanan mikro.

**Contoh implementasi kami:**

* [Pengaturan server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Konfigurasi server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Panduan implementasi formulir kontak](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Pemrosesan Pekerjaan Latar Belakang: Bree untuk Keandalan Produksi {#background-job-processing-bree-for-production-reliability}

**Apa yang kami gunakan:** Penjadwal [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Kami membuat dan memelihara Bree karena penjadwal pekerjaan yang ada tidak memenuhi kebutuhan kami akan dukungan utas pekerja dan fitur JavaScript modern di lingkungan Node.js produksi. Hal ini berlaku untuk semua aplikasi Node.js yang memerlukan pemrosesan latar belakang, tugas terjadwal, atau utas pekerja.

**Contoh implementasi kami:**

* [Pengaturan server Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Semua definisi pekerjaan kami](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Pekerjaan pemeriksaan kesehatan PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementasi pekerjaan pembersihan](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Penanganan Kesalahan ###: @hapi/boom untuk Keandalan Produksi {#error-handling-hapiboom-for-production-reliability}

**Apa yang kami gunakan:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Kami menggunakan @hapi/boom untuk respons kesalahan terstruktur di seluruh aplikasi produksi Node.js kami. Pola ini berfungsi untuk semua aplikasi Node.js yang membutuhkan penanganan kesalahan yang konsisten.

**Contoh implementasi kami:**

* [Pembantu klasifikasi kesalahan](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementasi logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Cara Memantau Aplikasi Node.js dalam Produksi {#how-to-monitor-nodejs-applications-in-production}

Pendekatan kami dalam memantau aplikasi Node.js dalam produksi telah berkembang selama bertahun-tahun dalam menjalankan aplikasi dalam skala besar. Kami menerapkan pemantauan di berbagai lapisan untuk memastikan keandalan dan performa untuk semua jenis aplikasi Node.js.

### Pemantauan Produksi Node.js Tingkat Sistem {#system-level-nodejs-production-monitoring}

**Implementasi inti kami:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Apa yang kami gunakan:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ambang batas pemantauan produksi kami (dari kode produksi kami yang sebenarnya):

* **Batas ukuran heap 2GB** dengan peringatan otomatis
* **Ambang batas peringatan penggunaan memori 25%**
* **Ambang batas peringatan penggunaan CPU 80%**
* **Ambang batas peringatan penggunaan disk 75%**

> \[!WARNING]
> Ambang batas ini berlaku untuk konfigurasi perangkat keras spesifik kami. Saat menerapkan pemantauan produksi Node.js, tinjau implementasi monitor-server.js kami untuk memahami logika yang tepat dan menyesuaikan nilainya dengan pengaturan Anda.

### Pemantauan Tingkat Aplikasi untuk Produksi Node.js {#application-level-monitoring-for-nodejs-production}

**Klasifikasi kesalahan kami:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Pembantu ini membedakan antara:

* **Bug kode aktual** yang memerlukan perhatian segera
* **Kesalahan pengguna** yang merupakan perilaku yang wajar
* **Kegagalan layanan eksternal** yang tidak dapat kami kendalikan

Pola ini berlaku untuk aplikasi Node.js apa pun - aplikasi web, API, layanan mikro, atau layanan latar belakang.

**Implementasi pencatatan kami:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Kami menerapkan penyuntingan bidang yang komprehensif untuk melindungi informasi sensitif sambil mempertahankan kemampuan debugging yang berguna di lingkungan produksi Node.js kami.

### Pemantauan Khusus Aplikasi {#application-specific-monitoring}

**Implementasi server kami:**

* [Server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Server IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [server POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Pemantauan antrean:** Kami menerapkan batas antrean 5GB dan batas waktu 180 detik untuk pemrosesan permintaan guna mencegah kehabisan sumber daya. Pola ini berlaku untuk semua aplikasi Node.js dengan antrean atau pemrosesan latar belakang.

## Pemantauan Produksi Node.js dengan Pemeriksaan Kesehatan PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Kami telah menyempurnakan pengaturan lingkungan produksi Node.js kami dengan PM2 selama bertahun-tahun pengalaman produksi. Pemeriksaan kesehatan PM2 kami sangat penting untuk menjaga keandalan di setiap aplikasi Node.js.

### Sistem Pemeriksaan Kesehatan PM2 Kami {#our-pm2-health-check-system}

**Implementasi inti kami:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Pemantauan produksi Node.js kami dengan pemeriksaan kesehatan PM2 meliputi:

* **Berjalan setiap 20 menit** melalui penjadwalan cron
* **Memerlukan waktu aktif minimal 15 menit** sebelum suatu proses dinyatakan sehat
* **Memvalidasi status proses dan penggunaan memori**
* **Otomatis memulai ulang proses yang gagal**
* **Mencegah pengulangan proses ulang** melalui pemeriksaan kesehatan cerdas

> \[!CAUTION]
> Untuk praktik terbaik penerapan produksi Node.js, kami memerlukan waktu aktif 15+ menit sebelum menganggap proses sehat untuk menghindari pengulangan proses ulang. Hal ini mencegah kegagalan berantai ketika proses mengalami masalah memori atau masalah lainnya.

### Konfigurasi Produksi PM2 Kami {#our-pm2-production-configuration}

**Pengaturan ekosistem kami:** Pelajari file startup server kami untuk pengaturan lingkungan produksi Node.js:

* [Server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Penjadwal Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Pola ini berlaku baik Anda menjalankan aplikasi Express, server Koa, API GraphQL, atau aplikasi Node.js lainnya.

### Penerapan PM2 Otomatis {#automated-pm2-deployment}

**Penerapan PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Kami mengotomatiskan seluruh pengaturan PM2 kami melalui Ansible untuk memastikan penerapan produksi Node.js yang konsisten di semua server kami.

## Sistem Penanganan dan Klasifikasi Kesalahan Produksi {#production-error-handling-and-classification-system}

Salah satu praktik terbaik penerapan produksi Node.js yang paling berharga adalah klasifikasi kesalahan cerdas yang berlaku untuk semua aplikasi Node.js:

### Implementasi isCodeBug kami untuk Produksi {#our-iscodebug-implementation-for-production}

**Sumber:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Pembantu ini menyediakan klasifikasi kesalahan cerdas untuk aplikasi Node.js dalam produksi untuk:

**Prioritaskan bug aktual** daripada kesalahan pengguna
* **Tingkatkan respons insiden kami** dengan berfokus pada masalah nyata
* **Kurangi kelelahan peringatan** akibat kesalahan pengguna yang sudah diperkirakan
* **Lebih memahami** masalah aplikasi dibandingkan masalah yang disebabkan pengguna

Pola ini berfungsi untuk aplikasi Node.js apa pun - baik Anda sedang membangun situs e-commerce, platform SaaS, API, atau layanan mikro.

Integrasi ### dengan Pencatatan Produksi Kami {#integration-with-our-production-logging}

**Integrasi logger kami:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Logger kami menggunakan `isCodeBug` untuk menentukan tingkat peringatan dan penyuntingan bidang, memastikan kami mendapat pemberitahuan tentang masalah nyata sekaligus menyaring gangguan dalam lingkungan produksi Node.js kami.

### Konten Terkait {#related-content-1}

Pelajari lebih lanjut tentang pola penanganan kesalahan kami:

* [Membangun Sistem Pembayaran yang Handal](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Pola penanganan kesalahan
* [Perlindungan Privasi Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Penanganan kesalahan keamanan

## Debugging Kinerja Lanjutan dengan v8-profiler-next dan cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Kami menggunakan alat profiling canggih untuk menganalisis snapshot heap dan men-debug masalah OOM (Kehabisan Memori), hambatan kinerja, dan masalah memori Node.js di lingkungan produksi kami. Alat-alat ini penting untuk aplikasi Node.js apa pun yang mengalami kebocoran memori atau masalah kinerja.

### Pendekatan Profil Kami untuk Produksi Node.js {#our-profiling-approach-for-nodejs-production}

**Alat yang kami rekomendasikan:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Untuk menghasilkan snapshot heap dan profil CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Untuk menganalisis profil CPU dan snapshot heap

> \[!TIP]
> Kami menggunakan v8-profiler-next dan cpupro bersama-sama untuk menciptakan alur kerja debugging performa yang lengkap untuk aplikasi Node.js kami. Kombinasi ini membantu kami mengidentifikasi kebocoran memori, hambatan performa, dan mengoptimalkan kode produksi kami.

### Bagaimana Kami Menerapkan Analisis Snapshot Heap {#how-we-implement-heap-snapshot-analysis}

**Implementasi pemantauan kami:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Pemantauan produksi kami mencakup pembuatan snapshot heap otomatis ketika ambang batas memori terlampaui. Ini membantu kami men-debug masalah OOM sebelum menyebabkan aplikasi crash.

**Pola implementasi utama:**

* **Snapshot otomatis** ketika ukuran heap melebihi ambang batas 2GB
* **Profil berbasis sinyal** untuk analisis sesuai permintaan dalam produksi
* **Kebijakan retensi** untuk mengelola penyimpanan snapshot
* **Integrasi dengan pekerjaan pembersihan kami** untuk pemeliharaan otomatis

### Alur Kerja Debugging Performa {#performance-debugging-workflow}

**Pelajari implementasi kami yang sebenarnya:**

* [Memantau implementasi server](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Pemantauan heap dan pembuatan snapshot
* [Pekerjaan pembersihan](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Retensi dan pembersihan snapshot
* [Integrasi pencatat](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Pencatatan performa

### Implementasi yang Direkomendasikan untuk Aplikasi Node.js Anda {#recommended-implementation-for-your-nodejs-application}

**Untuk analisis snapshot tumpukan:**

1. **Instal v8-profiler-next** untuk pembuatan snapshot
2. **Gunakan cpupro** untuk menganalisis snapshot yang dihasilkan
3. **Implementasi ambang batas pemantauan** yang serupa dengan monitor-server.js kami
4. **Atur pembersihan otomatis** untuk mengelola penyimpanan snapshot
5. **Buat pengendali sinyal** untuk pembuatan profil sesuai permintaan dalam produksi

**Untuk profil CPU:**

1. **Buat profil CPU** selama periode beban tinggi
2. **Analisis dengan cpupro** untuk mengidentifikasi hambatan
3. **Fokus pada jalur panas** dan peluang pengoptimalan
4. **Pantau peningkatan kinerja sebelum/sesudah**

> \[!WARNING]
> Pembuatan snapshot heap dan profil CPU dapat memengaruhi kinerja. Kami menyarankan untuk menerapkan pembatasan dan hanya mengaktifkan pembuatan profil saat menyelidiki masalah tertentu atau selama masa pemeliharaan.

Integrasi ### dengan Pemantauan Produksi Kami {#integration-with-our-production-monitoring}

Alat pembuatan profil kami terintegrasi dengan strategi pemantauan kami yang lebih luas:

* **Pemicu otomatis** berdasarkan ambang batas memori/CPU
* **Integrasi peringatan** ketika masalah performa terdeteksi
* **Analisis historis** untuk melacak tren performa dari waktu ke waktu
* **Korelasi dengan metrik aplikasi** untuk penelusuran kesalahan yang komprehensif

Pendekatan ini telah membantu kami mengidentifikasi dan mengatasi kebocoran memori, mengoptimalkan jalur kode panas, dan menjaga kinerja yang stabil di lingkungan produksi Node.js kami.

## Keamanan Infrastruktur Produksi Node.js {#nodejs-production-infrastructure-security}

Kami menerapkan keamanan komprehensif untuk infrastruktur produksi Node.js kami melalui otomatisasi Ansible. Praktik ini berlaku untuk semua aplikasi Node.js:

Keamanan Tingkat Sistem ### untuk Produksi Node.js {#system-level-security-for-nodejs-production}

**Implementasi Ansible kami:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Langkah-langkah keamanan utama kami untuk lingkungan produksi Node.js:

**Swap dinonaktifkan** untuk mencegah data sensitif ditulis ke disk
* **Core dump dinonaktifkan** untuk mencegah dump memori yang berisi informasi sensitif
* **Penyimpanan USB diblokir** untuk mencegah akses data yang tidak sah
* **Penyetelan parameter kernel** untuk keamanan dan kinerja

> \[!WARNING]
> Saat menerapkan praktik terbaik penerapan produksi Node.js, menonaktifkan swap dapat menyebabkan penghentian kehabisan memori jika aplikasi Anda melebihi RAM yang tersedia. Kami memantau penggunaan memori dengan cermat dan menyesuaikan ukuran server kami dengan tepat.

### Keamanan Aplikasi untuk Aplikasi Node.js {#application-security-for-nodejs-applications}

**Penyuntingan bidang log kami:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Kami menyunting kolom sensitif dari log, termasuk kata sandi, token, kunci API, dan informasi pribadi. Hal ini melindungi privasi pengguna sekaligus mempertahankan kemampuan debugging di lingkungan produksi Node.js mana pun.

### Otomatisasi Keamanan Infrastruktur {#infrastructure-security-automation}

**Pengaturan Ansible lengkap kami untuk produksi Node.js:**

* [Buku pedoman keamanan](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Manajemen kunci SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Manajemen sertifikat](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM setup](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Konten Keamanan Kami {#our-security-content}

Pelajari lebih lanjut tentang pendekatan keamanan kami:

* [Perusahaan Audit Keamanan Terbaik](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Email Terenkripsi Aman Kuantum](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Mengapa Keamanan Email Open Source](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

Arsitektur Basis Data ## untuk Aplikasi Node.js {#database-architecture-for-nodejs-applications}

Kami menggunakan pendekatan basis data hibrida yang dioptimalkan untuk aplikasi Node.js kami. Pola-pola ini dapat diadaptasi untuk aplikasi Node.js apa pun:

Implementasi SQLite ### untuk Produksi Node.js {#sqlite-implementation-for-nodejs-production}

**Apa yang kami gunakan:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Konfigurasi kami:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Kami menggunakan SQLite untuk data spesifik pengguna di aplikasi Node.js kami karena menyediakan:

* **Isolasi data** per pengguna/penyewa
* **Performa yang lebih baik** untuk kueri pengguna tunggal
* **Pencadangan dan migrasi yang disederhanakan**
* **Kompleksitas yang berkurang** dibandingkan dengan database bersama

Pola ini berfungsi dengan baik untuk aplikasi SaaS, sistem multi-penyewa, atau aplikasi Node.js apa pun yang memerlukan isolasi data.

Implementasi MongoDB ### untuk Produksi Node.js {#mongodb-implementation-for-nodejs-production}

**Apa yang kami gunakan:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Implementasi pengaturan kami:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Konfigurasi kami:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Kami menggunakan MongoDB untuk data aplikasi di lingkungan produksi Node.js kami karena menyediakan:

**Skema fleksibel** untuk struktur data yang terus berkembang
* **Performa yang lebih baik** untuk kueri yang kompleks
* **Kemampuan penskalaan horizontal**
* **Bahasa kueri yang kaya**

> \[!NOTE]
> Pendekatan hibrida kami dioptimalkan untuk kasus penggunaan spesifik kami. Pelajari pola penggunaan basis data aktual kami dalam basis kode untuk memahami apakah pendekatan ini sesuai dengan kebutuhan aplikasi Node.js Anda.

## Pemrosesan Pekerjaan Latar Belakang Produksi Node.js {#nodejs-production-background-job-processing}

Kami membangun arsitektur pekerjaan latar belakang kami di sekitar Bree untuk penerapan produksi Node.js yang andal. Hal ini berlaku untuk semua aplikasi Node.js yang memerlukan pemrosesan latar belakang:

### Pengaturan Server Bree Kami untuk Produksi {#our-bree-server-setup-for-production}

**Implementasi utama kami:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Penerapan Ansible kami:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Contoh Pekerjaan Produksi {#production-job-examples}

**Pemantauan kesehatan:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Otomatisasi pembersihan:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Semua pekerjaan kami:** [Telusuri direktori pekerjaan lengkap kami](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Pola ini berlaku untuk aplikasi Node.js apa pun yang membutuhkan:

* Tugas terjadwal (pemrosesan data, laporan, pembersihan)
* Pemrosesan latar belakang (pengubahan ukuran gambar, pengiriman email, impor data)
* Pemantauan dan pemeliharaan kesehatan
* Pemanfaatan thread pekerja untuk tugas-tugas yang membutuhkan CPU intensif

### Pola Penjadwalan Pekerjaan Kami untuk Produksi Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Pelajari pola penjadwalan pekerjaan kami yang sebenarnya di direktori pekerjaan kami untuk memahami:

* Bagaimana kami menerapkan penjadwalan seperti cron dalam produksi Node.js
* Penanganan kesalahan dan logika percobaan ulang kami
* Bagaimana kami menggunakan thread pekerja untuk tugas-tugas yang membutuhkan CPU intensif

## Pemeliharaan Otomatis untuk Aplikasi Node.js Produksi {#automated-maintenance-for-production-nodejs-applications}

Kami menerapkan pemeliharaan proaktif untuk mencegah masalah umum produksi Node.js. Pola berikut berlaku untuk semua aplikasi Node.js:

### Implementasi Pembersihan Kami {#our-cleanup-implementation}

**Sumber:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Pemeliharaan otomatis kami untuk aplikasi produksi Node.js menargetkan:

* **Berkas sementara** yang lebih lama dari 24 jam
* **Berkas log** yang melebihi batas penyimpanan
* **Berkas cache** dan data sementara
* **Berkas yang diunggah** yang tidak lagi diperlukan
* **Snapshot tumpukan** dari proses debugging kinerja

Pola ini berlaku untuk aplikasi Node.js apa pun yang menghasilkan file sementara, log, atau data cache.

### Manajemen Ruang Disk untuk Produksi Node.js {#disk-space-management-for-nodejs-production}

**Ambang batas pemantauan kami:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Batas antrean** untuk pemrosesan latar belakang
* **Ambang batas peringatan penggunaan disk 75%**
* **Pembersihan otomatis** ketika ambang batas terlampaui

### Otomatisasi Pemeliharaan Infrastruktur {#infrastructure-maintenance-automation}

**Otomatisasi Ansible kami untuk produksi Node.js:**

* [Penerapan lingkungan](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Manajemen kunci penerapan](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Panduan Implementasi Penerapan Produksi Node.js {#nodejs-production-deployment-implementation-guide}

### Pelajari Kode Aktual Kami untuk Praktik Terbaik Produksi {#study-our-actual-code-for-production-best-practices}

**Mulailah dengan file-file kunci ini untuk pengaturan lingkungan produksi Node.js:**

1. **Konfigurasi:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Pemantauan:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Penanganan kesalahan:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Pencatatan:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Kesehatan proses:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Pelajari dari Postingan Blog Kami {#learn-from-our-blog-posts}

**Panduan implementasi teknis kami untuk produksi Node.js:**

* [Ekosistem Paket NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Membangun Sistem Pembayaran](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementasi Privasi Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulir Kontak JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrasi Email React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Otomatisasi Infrastruktur untuk Produksi Node.js {#infrastructure-automation-for-nodejs-production}

**Playbook Ansible kami untuk dipelajari untuk penerapan produksi Node.js:**

* [Direktori buku pedoman lengkap](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Pengerasan keamanan](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Pengaturan Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Studi Kasus Kami {#our-case-studies}

**Implementasi perusahaan kami:**

* [Studi Kasus Yayasan Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Studi Kasus Ubuntu Kanonik](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Penerusan Email Alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

Kesimpulan ##: Praktik Terbaik Penerapan Produksi Node.js {#conclusion-nodejs-production-deployment-best-practices}

Infrastruktur produksi Node.js kami menunjukkan bahwa aplikasi Node.js dapat mencapai keandalan tingkat perusahaan melalui:

* **Pilihan perangkat keras yang terbukti** (AMD Ryzen untuk optimasi performa single core 573%)
* **Pemantauan produksi Node.js yang teruji** dengan ambang batas spesifik dan respons otomatis
* **Klasifikasi kesalahan cerdas** untuk meningkatkan respons insiden di lingkungan produksi
* **Debugging performa tingkat lanjut** dengan v8-profiler-next dan cpupro untuk pencegahan OOM
* **Penguatan keamanan komprehensif** melalui otomatisasi Ansible
* **Arsitektur database hybrid** yang dioptimalkan untuk kebutuhan aplikasi
* **Pemeliharaan otomatis** untuk mencegah masalah umum produksi Node.js

**Intinya:** Pelajari berkas implementasi dan postingan blog kami yang sebenarnya, alih-alih mengikuti praktik terbaik yang umum. Basis kode kami menyediakan pola dunia nyata untuk penerapan produksi Node.js yang dapat diadaptasi untuk aplikasi Node.js apa pun - aplikasi web, API, layanan mikro, atau layanan latar belakang.

## Daftar Sumber Daya Lengkap untuk Produksi Node.js {#complete-resource-list-for-nodejs-production}

### File Implementasi Inti Kami {#our-core-implementation-files}

* [Konfigurasi utama](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Ketergantungan paket](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Pemantauan server](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Klasifikasi kesalahan](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistem pencatatan](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Pemeriksaan kesehatan PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Pembersihan otomatis](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Implementasi Server Kami {#our-server-implementations}

* [Server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Penjadwal Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Server IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [server POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Infrastruktur Otomatisasi Kami {#our-infrastructure-automation}

* [Semua playbook Ansible kami](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Pengerasan keamanan](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Pengaturan Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Konfigurasi basis data](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Posting Blog Teknis Kami {#our-technical-blog-posts}

* [Analisis Ekosistem NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementasi Sistem Pembayaran](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Panduan Teknis Privasi Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulir Kontak JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrasi Email React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Panduan Solusi Hosting Mandiri](https://forwardemail.net/blog/docs/self-hosted-solution)

### Studi Kasus Perusahaan Kami {#our-enterprise-case-studies}

* [Implementasi Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Studi Kasus Ubuntu Kanonik](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Kepatuhan Pemerintah Federal](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistem Email Alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)