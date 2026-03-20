# Satu Dekade Dampak: Bagaimana Paket npm Kami Mencapai 1 Miliar Unduhan dan Membentuk JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Kata Pengantar](#foreword)
* [Para Pelopor yang Mempercayai Kami: Isaac Z. Schlueter dan Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Dari Penciptaan npm hingga Kepemimpinan Node.js](#from-npms-creation-to-nodejs-leadership)
* [Arsitek di Balik Kode: Perjalanan Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Komite Teknis Express dan Kontribusi Inti](#express-technical-committee-and-core-contributions)
  * [Kontribusi Framework Koa](#koa-framework-contributions)
  * [Dari Kontributor Individu ke Pemimpin Organisasi](#from-individual-contributor-to-organization-leader)
* [Organisasi GitHub Kami: Ekosistem Inovasi](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Logging Terstruktur untuk Aplikasi Modern](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Melawan Penyalahgunaan Email](#spam-scanner-fighting-email-abuse)
  * [Bree: Penjadwalan Pekerjaan Modern dengan Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Infrastruktur Email Sumber Terbuka](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilitas dan Alat Koa Esensial](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Pemantauan Uptime Sumber Terbuka](#upptime-open-source-uptime-monitoring)
* [Kontribusi Kami pada Ekosistem Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Dari Paket ke Produksi](#from-packages-to-production)
  * [Siklus Umpan Balik](#the-feedback-loop)
* [Prinsip Inti Forward Email: Fondasi untuk Keunggulan](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Selalu Ramah Pengembang, Fokus Keamanan, dan Transparan](#always-developer-friendly-security-focused-and-transparent)
  * [Kepatuhan pada Prinsip Pengembangan Perangkat Lunak yang Teruji Waktu](#adherence-to-time-tested-software-development-principles)
  * [Menargetkan Pengembang yang Gigih dan Mandiri](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinsip dalam Praktik: Basis Kode Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Privasi berdasarkan Desain](#privacy-by-design)
  * [Open Source yang Berkelanjutan](#sustainable-open-source)
* [Angka Tidak Berbohong: Statistik Unduhan npm Kami yang Mencengangkan](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Pandangan Sekilas tentang Dampak Kami](#a-birds-eye-view-of-our-impact)
  * [Dampak Harian dalam Skala Besar](#daily-impact-at-scale)
  * [Lebih dari Sekadar Angka Mentah](#beyond-the-raw-numbers)
* [Mendukung Ekosistem: Sponsorship Open Source Kami](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pelopor Infrastruktur Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mastermind Paket Utilitas](#sindre-sorhus-utility-package-mastermind)
* [Mengungkap Kerentanan Keamanan di Ekosistem JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Penyelamatan Koa-Router](#the-koa-router-rescue)
  * [Menangani Kerentanan ReDoS](#addressing-redos-vulnerabilities)
  * [Mendukung Keamanan Node.js dan Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Mengamankan Infrastruktur npm](#securing-npm-infrastructure)
* [Kontribusi Kami pada Ekosistem Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Meningkatkan Fungsi Inti Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Memajukan Otentikasi Email dengan Mailauth](#advancing-email-authentication-with-mailauth)
  * [Peningkatan Utama Upptime](#key-upptime-enhancements)
* [Perekat yang Menyatukan Semuanya: Kode Kustom dalam Skala Besar](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Upaya Pengembangan Besar-besaran](#a-massive-development-effort)
  * [Integrasi Dependensi Inti](#core-dependencies-integration)
  * [Infrastruktur DNS dengan Tangerine dan mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Dampak Perusahaan: Dari Open Source ke Solusi Misi-Kritis](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Studi Kasus Infrastruktur Email Misi-Kritis](#case-studies-in-mission-critical-email-infrastructure)
* [Satu Dekade Open Source: Melihat ke Depan](#a-decade-of-open-source-looking-forward)
## Kata Pengantar {#foreword}

Di dunia [JavaScript](https://en.wikipedia.org/wiki/JavaScript) dan [Node.js](https://en.wikipedia.org/wiki/Node.js), beberapa paket sangat penting—diunduh jutaan kali setiap hari dan mendukung aplikasi di seluruh dunia. Di balik alat-alat ini ada pengembang yang fokus pada kualitas open source. Hari ini, kami menunjukkan bagaimana tim kami membantu membangun dan memelihara paket npm yang telah menjadi bagian kunci dari ekosistem JavaScript.


## Pelopor yang Mempercayai Kami: Isaac Z. Schlueter dan Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Kami bangga memiliki [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) sebagai pengguna. Isaac menciptakan [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) dan membantu membangun [Node.js](https://en.wikipedia.org/wiki/Node.js). Kepercayaannya pada Forward Email menunjukkan fokus kami pada kualitas dan keamanan. Isaac menggunakan Forward Email untuk beberapa domain termasuk izs.me.

Dampak Isaac pada JavaScript sangat besar. Pada tahun 2009, dia termasuk yang pertama melihat potensi Node.js, bekerja dengan [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), yang menciptakan platform tersebut. Seperti yang dikatakan Isaac dalam sebuah [wawancara dengan majalah Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Di tengah komunitas yang sangat kecil dari sekelompok orang yang mencoba mencari cara agar JS sisi server bisa terjadi, Ryan Dahl muncul dengan Node, yang jelas merupakan pendekatan yang tepat. Saya ikut terlibat dan sangat aktif sekitar pertengahan 2009."

> \[!NOTE]
> Bagi yang tertarik dengan sejarah Node.js, tersedia dokumenter yang sangat baik yang mengisahkan pengembangannya, termasuk [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) dan [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Situs pribadi Ryan Dahl [personal website](https://tinyclouds.org/) juga berisi wawasan berharga tentang karyanya.

### Dari Penciptaan npm hingga Kepemimpinan Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac menciptakan npm pada September 2009, dengan versi pertama yang dapat digunakan dirilis pada awal 2010. Manajer paket ini mengisi kebutuhan penting di Node.js, memungkinkan pengembang untuk dengan mudah berbagi dan menggunakan kembali kode. Menurut [halaman Wikipedia Node.js](https://en.wikipedia.org/wiki/Node.js), "Pada Januari 2010, diperkenalkan manajer paket untuk lingkungan Node.js yang disebut npm. Manajer paket ini memungkinkan programmer untuk menerbitkan dan berbagi paket Node.js, beserta kode sumber yang menyertainya, dan dirancang untuk menyederhanakan instalasi, pembaruan, dan penghapusan paket."

Ketika Ryan Dahl mundur dari Node.js pada Januari 2012, Isaac mengambil alih sebagai pemimpin proyek. Seperti yang tercatat di [résumé-nya](https://izs.me/resume), dia "Memimpin pengembangan beberapa API inti Node.js yang fundamental, termasuk sistem modul CommonJS, API sistem berkas, dan streams" serta "Bertindak sebagai BDFL (Benevolent Dictator For Life) proyek selama 2 tahun, memastikan kualitas yang terus meningkat dan proses build yang andal untuk versi Node.js v0.6 hingga v0.10."

Isaac membimbing Node.js melalui periode pertumbuhan penting, menetapkan standar yang masih membentuk platform hingga hari ini. Dia kemudian memulai npm, Inc. pada 2014 untuk mendukung registri npm, yang sebelumnya dia jalankan sendiri.

Kami berterima kasih kepada Isaac atas kontribusinya yang besar pada JavaScript dan terus menggunakan banyak paket yang dia buat. Karyanya telah mengubah cara kami membangun perangkat lunak dan bagaimana jutaan pengembang berbagi kode di seluruh dunia.


## Arsitek di Balik Kode: Perjalanan Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Di inti kesuksesan open source kami adalah Nick Baugh, pendiri dan pemilik Forward Email. Karyanya dalam JavaScript telah berlangsung hampir 20 tahun dan membentuk cara banyak pengembang membangun aplikasi. Perjalanan open source-nya menunjukkan keterampilan teknis sekaligus kepemimpinan komunitas.

### Komite Teknis Express dan Kontribusi Inti {#express-technical-committee-and-core-contributions}

Keahlian Nick dalam framework web membawanya ke [Komite Teknis Express](https://expressjs.com/en/resources/community.html), di mana dia membantu salah satu framework Node.js yang paling banyak digunakan. Nick sekarang tercantum sebagai anggota tidak aktif di [halaman komunitas Express](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express awalnya dibuat oleh TJ Holowaychuk, seorang kontributor open source yang produktif yang telah membentuk banyak ekosistem Node.js. Kami berterima kasih atas karya dasar TJ dan menghormati [keputusannya untuk beristirahat](https://news.ycombinator.com/item?id=37687017) dari kontribusi open source-nya yang luas.

Sebagai anggota [Komite Teknis Express](https://expressjs.com/en/resources/community.html), Nick menunjukkan perhatian besar terhadap detail dalam isu-isu seperti memperjelas dokumentasi `req.originalUrl` dan memperbaiki masalah penanganan form multipart.

### Kontribusi Framework Koa {#koa-framework-contributions}

Pekerjaan Nick dengan [framework Koa](https://github.com/koajs/koa)—alternatif modern dan lebih ringan dari Express yang juga dibuat oleh TJ Holowaychuk—lebih menunjukkan komitmennya terhadap alat pengembangan web yang lebih baik. Kontribusi Nick pada Koa mencakup isu dan kode melalui pull request, menangani penanganan error, manajemen tipe konten, dan perbaikan dokumentasi.

Pekerjaannya di Express dan Koa memberinya pandangan unik tentang pengembangan web Node.js, membantu tim kami membuat paket yang bekerja baik dengan berbagai ekosistem framework.

### Dari Kontributor Individu ke Pemimpin Organisasi {#from-individual-contributor-to-organization-leader}

Apa yang dimulai sebagai membantu proyek yang sudah ada berkembang menjadi menciptakan dan memelihara ekosistem paket secara keseluruhan. Nick mendirikan beberapa organisasi GitHub—termasuk [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), dan [Bree](https://github.com/breejs)—masing-masing menyelesaikan kebutuhan spesifik dalam komunitas JavaScript.

Perubahan dari kontributor menjadi pemimpin ini menunjukkan visi Nick untuk perangkat lunak yang dirancang dengan baik yang memecahkan masalah nyata. Dengan mengorganisir paket terkait di bawah organisasi GitHub yang terfokus, dia membangun ekosistem alat yang bekerja bersama sambil tetap modular dan fleksibel untuk komunitas pengembang yang lebih luas.


## Organisasi GitHub Kami: Ekosistem Inovasi {#our-github-organizations-ecosystems-of-innovation}

Kami mengorganisir pekerjaan open source kami di sekitar organisasi GitHub yang terfokus, masing-masing menyelesaikan kebutuhan spesifik dalam JavaScript. Struktur ini menciptakan keluarga paket yang kohesif yang bekerja baik bersama sambil tetap modular.

### Cabin: Logging Terstruktur untuk Aplikasi Modern {#cabin-structured-logging-for-modern-applications}

[Organisasi Cabin](https://github.com/cabinjs) adalah pendekatan kami terhadap logging aplikasi yang sederhana dan kuat. Paket utama [`cabin`](https://github.com/cabinjs/cabin) memiliki hampir 900 bintang di GitHub dan lebih dari 100.000 unduhan mingguan\[^1]. Cabin menyediakan logging terstruktur yang bekerja dengan layanan populer seperti Sentry, LogDNA, dan Papertrail.

Yang membuat Cabin istimewa adalah API dan sistem plugin yang dipikirkan dengan matang. Paket pendukung seperti [`axe`](https://github.com/cabinjs/axe) untuk middleware Express dan [`parse-request`](https://github.com/cabinjs/parse-request) untuk parsing permintaan HTTP menunjukkan komitmen kami pada solusi lengkap daripada alat terpisah.

Paket [`bson-objectid`](https://github.com/cabinjs/bson-objectid) layak mendapat sebutan khusus, dengan lebih dari 1,7 juta unduhan hanya dalam dua bulan\[^2]. Implementasi ringan MongoDB ObjectID ini telah menjadi pilihan utama bagi pengembang yang membutuhkan ID tanpa ketergantungan penuh pada MongoDB.

### Spam Scanner: Melawan Penyalahgunaan Email {#spam-scanner-fighting-email-abuse}

[Organisasi Spam Scanner](https://github.com/spamscanner) menunjukkan komitmen kami untuk menyelesaikan masalah nyata. Paket utama [`spamscanner`](https://github.com/spamscanner/spamscanner) menyediakan deteksi spam email yang canggih, tetapi paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) yang telah mengalami adopsi luar biasa.

Dengan lebih dari 1,2 juta unduhan dalam dua bulan\[^3], `url-regex-safe` memperbaiki masalah keamanan kritis dalam ekspresi reguler deteksi URL lainnya. Paket ini menunjukkan pendekatan kami terhadap open source: menemukan masalah umum (dalam hal ini, kerentanan [ReDoS](https://en.wikipedia.org/wiki/ReDoS) dalam validasi URL), menciptakan solusi yang solid, dan memeliharanya dengan cermat.
### Bree: Penjadwalan Pekerjaan Modern dengan Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

[Organisasi Bree](https://github.com/breejs) adalah jawaban kami untuk tantangan umum Node.js: penjadwalan pekerjaan yang andal. Paket utama [`bree`](https://github.com/breejs/bree), dengan lebih dari 3.100 bintang di GitHub, menyediakan penjadwal pekerjaan modern menggunakan worker threads Node.js untuk kinerja dan keandalan yang lebih baik.

> \[!NOTE]
> Bree dibuat setelah kami membantu memelihara [Agenda](https://github.com/agenda/agenda), menerapkan pelajaran yang dipelajari untuk membangun penjadwal pekerjaan yang lebih baik. Kontribusi kami pada Agenda membantu kami menemukan cara untuk meningkatkan penjadwalan pekerjaan.

Apa yang membuat Bree berbeda dari penjadwal lain seperti Agenda:

* **Tanpa Ketergantungan Eksternal**: Berbeda dengan Agenda yang membutuhkan MongoDB, Bree tidak memerlukan Redis atau MongoDB untuk mengelola status pekerjaan.
* **Worker Threads**: Bree menggunakan worker threads Node.js untuk proses sandboxed, memberikan isolasi dan kinerja yang lebih baik.
* **API Sederhana**: Bree menawarkan kontrol detail dengan kesederhanaan, memudahkan implementasi kebutuhan penjadwalan yang kompleks.
* **Dukungan Bawaan**: Hal-hal seperti pemuatan ulang yang mulus, pekerjaan cron, tanggal, dan waktu yang ramah manusia sudah termasuk secara default.

Bree adalah bagian penting dari [forwardemail.net](https://github.com/forwardemail/forwardemail.net), menangani tugas latar belakang penting seperti pemrosesan email, pembersihan, dan pemeliharaan terjadwal. Penggunaan Bree di Forward Email menunjukkan komitmen kami untuk menggunakan alat kami sendiri dalam produksi, memastikan mereka memenuhi standar keandalan tinggi.

Kami juga menggunakan dan menghargai paket worker thread hebat lainnya seperti [piscina](https://github.com/piscinajs/piscina) dan klien HTTP seperti [undici](https://github.com/nodejs/undici). Piscina, seperti Bree, menggunakan worker threads Node.js untuk pemrosesan tugas yang efisien. Kami berterima kasih kepada [Matteo Collina](https://github.com/mcollina), yang memelihara undici dan piscina, atas kontribusi besarnya pada Node.js. Matteo menjabat di Komite Pengarah Teknis Node.js dan telah sangat meningkatkan kemampuan klien HTTP di Node.js.

### Forward Email: Infrastruktur Email Sumber Terbuka {#forward-email-open-source-email-infrastructure}

Proyek kami yang paling ambisius adalah [Forward Email](https://github.com/forwardemail), layanan email sumber terbuka yang menyediakan penerusan email, penyimpanan, dan layanan API. Repositori utama memiliki lebih dari 1.100 bintang di GitHub\[^4], menunjukkan apresiasi komunitas terhadap alternatif layanan email proprietary ini.

Paket [`preview-email`](https://github.com/forwardemail/preview-email) dari organisasi ini, dengan lebih dari 2,5 juta unduhan dalam dua bulan\[^5], telah menjadi alat penting bagi pengembang yang bekerja dengan template email. Dengan menyediakan cara sederhana untuk melihat pratinjau email selama pengembangan, paket ini menyelesaikan titik sakit umum dalam membangun aplikasi yang mendukung email.

### Lad: Utilitas dan Alat Koa Esensial {#lad-essential-koa-utilities-and-tools}

[Organisasi Lad](https://github.com/ladjs) menyediakan kumpulan utilitas dan alat esensial yang terutama berfokus pada peningkatan ekosistem framework Koa. Paket-paket ini menyelesaikan tantangan umum dalam pengembangan web dan dirancang untuk bekerja secara mulus bersama sambil tetap berguna secara mandiri.

#### koa-better-error-handler: Penanganan Error yang Ditingkatkan untuk Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) menawarkan solusi penanganan error yang lebih baik untuk aplikasi Koa. Dengan lebih dari 50 bintang di GitHub, paket ini membuat `ctx.throw` menghasilkan pesan error yang ramah pengguna sekaligus mengatasi beberapa keterbatasan penangan error bawaan Koa:

* Mendeteksi dan menangani dengan benar error DNS Node.js, error Mongoose, dan error Redis
* Menggunakan [Boom](https://github.com/hapijs/boom) untuk membuat respons error yang konsisten dan terformat dengan baik
* Mempertahankan header (tidak seperti penangan bawaan Koa)
* Mempertahankan kode status yang sesuai daripada default ke 500
* Mendukung pesan flash dan pelestarian sesi
* Menyediakan daftar error HTML untuk error validasi
* Mendukung berbagai tipe respons (HTML, JSON, dan teks biasa)
Paket ini sangat berharga ketika digunakan bersama [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) untuk manajemen kesalahan yang komprehensif dalam aplikasi Koa.

#### passport: Otentikasi untuk Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) memperluas middleware otentikasi populer Passport.js dengan peningkatan khusus untuk aplikasi web modern. Paket ini mendukung beberapa strategi otentikasi langsung dari kotak:

* Otentikasi lokal dengan email
* Masuk dengan Apple
* Otentikasi GitHub
* Otentikasi Google
* Otentikasi kata sandi sekali pakai (OTP)

Paket ini sangat dapat disesuaikan, memungkinkan pengembang untuk mengubah nama bidang dan frasa agar sesuai dengan kebutuhan aplikasi mereka. Dirancang untuk integrasi mulus dengan Mongoose untuk manajemen pengguna, menjadikannya solusi ideal untuk aplikasi berbasis Koa yang membutuhkan otentikasi yang kuat.

#### graceful: Penutupan Aplikasi yang Elegan {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) memecahkan tantangan penting dalam menutup aplikasi Node.js dengan elegan. Dengan lebih dari 70 bintang di GitHub, paket ini memastikan aplikasi Anda dapat berhenti dengan bersih tanpa kehilangan data atau meninggalkan koneksi yang menggantung. Fitur utama meliputi:

* Dukungan untuk menutup server HTTP dengan elegan (Express/Koa/Fastify)
* Penutupan koneksi database yang bersih (MongoDB/Mongoose)
* Penutupan klien Redis yang tepat
* Penanganan penjadwal pekerjaan Bree
* Dukungan untuk handler penutupan kustom
* Pengaturan waktu tunggu yang dapat dikonfigurasi
* Integrasi dengan sistem logging

Paket ini penting untuk aplikasi produksi di mana penutupan tak terduga dapat menyebabkan kehilangan data atau korupsi. Dengan menerapkan prosedur penutupan yang tepat, `@ladjs/graceful` membantu memastikan keandalan dan stabilitas aplikasi Anda.

### Upptime: Pemantauan Uptime Open Source {#upptime-open-source-uptime-monitoring}

[Organisasi Upptime](https://github.com/upptime) mewakili komitmen kami terhadap pemantauan yang transparan dan open source. Repositori utama [`upptime`](https://github.com/upptime/upptime) memiliki lebih dari 13.000 bintang di GitHub, menjadikannya salah satu proyek paling populer yang kami kontribusikan. Upptime menyediakan monitor uptime dan halaman status yang didukung GitHub yang beroperasi sepenuhnya tanpa server.

Kami menggunakan Upptime untuk halaman status kami sendiri di <https://status.forwardemail.net> dengan kode sumber tersedia di <https://github.com/forwardemail/status.forwardemail.net>.

Yang membuat Upptime istimewa adalah arsitekturnya:

* **100% Open Source**: Setiap komponen sepenuhnya open source dan dapat disesuaikan.
* **Didukung oleh GitHub**: Memanfaatkan GitHub Actions, Issues, dan Pages untuk solusi pemantauan tanpa server.
* **Tidak Memerlukan Server**: Berbeda dengan alat pemantauan tradisional, Upptime tidak mengharuskan Anda menjalankan atau memelihara server.
* **Halaman Status Otomatis**: Menghasilkan halaman status yang indah yang dapat dihosting di GitHub Pages.
* **Notifikasi yang Kuat**: Terintegrasi dengan berbagai saluran notifikasi termasuk email, SMS, dan Slack.

Untuk meningkatkan pengalaman pengguna kami, kami telah mengintegrasikan [@octokit/core](https://github.com/octokit/core.js/) ke dalam basis kode forwardemail.net untuk menampilkan pembaruan status dan insiden secara real-time langsung di situs web kami. Integrasi ini memberikan transparansi yang jelas kepada pengguna kami jika terjadi masalah di seluruh tumpukan kami (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, dll.) dengan notifikasi toast instan, perubahan ikon lencana, warna peringatan, dan lainnya.

Perpustakaan @octokit/core memungkinkan kami mengambil data real-time dari repositori Upptime GitHub kami, memprosesnya, dan menampilkannya dengan cara yang ramah pengguna. Ketika ada layanan yang mengalami gangguan atau penurunan performa, pengguna segera diberi tahu melalui indikator visual tanpa harus meninggalkan aplikasi utama. Integrasi mulus ini memastikan pengguna kami selalu memiliki informasi terbaru tentang status sistem kami, meningkatkan transparansi dan kepercayaan.

Upptime telah diadopsi oleh ratusan organisasi yang mencari cara yang transparan dan andal untuk memantau layanan mereka dan mengkomunikasikan status kepada pengguna. Keberhasilan proyek ini menunjukkan kekuatan membangun alat yang memanfaatkan infrastruktur yang sudah ada (dalam hal ini, GitHub) untuk memecahkan masalah umum dengan cara baru.
## Kontribusi Kami untuk Ekosistem Forward Email {#our-contributions-to-the-forward-email-ecosystem}

Sementara paket open source kami digunakan oleh pengembang di seluruh dunia, paket-paket tersebut juga menjadi dasar dari layanan Forward Email kami sendiri. Peran ganda ini—sebagai pencipta sekaligus pengguna alat-alat ini—memberikan kami perspektif unik tentang penerapan nyata mereka dan mendorong perbaikan berkelanjutan.

### Dari Paket ke Produksi {#from-packages-to-production}

Perjalanan dari paket individual ke sistem produksi yang terpadu melibatkan integrasi dan perluasan yang cermat. Untuk Forward Email, proses ini meliputi:

* **Ekstensi Kustom**: Membangun ekstensi khusus Forward Email pada paket open source kami yang memenuhi kebutuhan unik kami.
* **Pola Integrasi**: Mengembangkan pola bagaimana paket-paket ini berinteraksi dalam lingkungan produksi.
* **Optimasi Performa**: Mengidentifikasi dan mengatasi hambatan performa yang hanya muncul pada skala besar.
* **Penguatan Keamanan**: Menambahkan lapisan keamanan tambahan yang spesifik untuk penanganan email dan perlindungan data pengguna.

Pekerjaan ini mewakili ribuan jam pengembangan di luar paket inti itu sendiri, menghasilkan layanan email yang tangguh dan aman yang memanfaatkan kontribusi open source terbaik kami.

### Siklus Umpan Balik {#the-feedback-loop}

Mungkin aspek paling berharga dari menggunakan paket kami sendiri dalam produksi adalah siklus umpan balik yang tercipta. Ketika kami menemukan keterbatasan atau kasus tepi di Forward Email, kami tidak hanya memperbaikinya secara lokal—kami meningkatkan paket dasar, yang menguntungkan layanan kami dan komunitas yang lebih luas.

Pendekatan ini telah menghasilkan banyak perbaikan:

* **Graceful Shutdown Bree**: Kebutuhan Forward Email untuk deployment tanpa downtime memicu peningkatan kemampuan graceful shutdown di Bree.
* **Pengenalan Pola Spam Scanner**: Pola spam nyata yang ditemui di Forward Email telah menginformasikan algoritma deteksi Spam Scanner.
* **Optimasi Performa Cabin**: Logging volume tinggi di produksi mengungkap peluang optimasi di Cabin yang menguntungkan semua pengguna.

Dengan mempertahankan siklus positif antara pekerjaan open source kami dan layanan produksi, kami memastikan paket kami tetap menjadi solusi praktis dan teruji, bukan implementasi teoretis.


## Prinsip Inti Forward Email: Fondasi untuk Keunggulan {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email dirancang berdasarkan seperangkat prinsip inti yang membimbing semua keputusan pengembangan kami. Prinsip-prinsip ini, yang dijelaskan di [website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), memastikan layanan kami tetap ramah pengembang, aman, dan fokus pada privasi pengguna.

### Selalu Ramah Pengembang, Fokus Keamanan, dan Transparan {#always-developer-friendly-security-focused-and-transparent}

Prinsip utama kami adalah menciptakan perangkat lunak yang ramah pengembang sekaligus mempertahankan standar tertinggi keamanan dan privasi. Kami percaya bahwa keunggulan teknis tidak boleh mengorbankan kemudahan penggunaan, dan transparansi membangun kepercayaan dengan komunitas kami.

Prinsip ini tercermin dalam dokumentasi kami yang rinci, pesan kesalahan yang jelas, dan komunikasi terbuka tentang keberhasilan maupun tantangan. Dengan menjadikan seluruh kode kami open source, kami mengundang pengawasan dan kolaborasi, memperkuat perangkat lunak kami dan ekosistem yang lebih luas.

### Kepatuhan pada Prinsip Pengembangan Perangkat Lunak yang Teruji Waktu {#adherence-to-time-tested-software-development-principles}

Kami mengikuti beberapa prinsip pengembangan perangkat lunak yang telah terbukti nilainya selama puluhan tahun:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Memisahkan kepentingan melalui pola Model-View-Controller
* **[Filsafat Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Membuat komponen modular yang melakukan satu hal dengan baik
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Menjaga agar tetap Sederhana dan Langsung
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Jangan Mengulangi Diri Sendiri, mendorong penggunaan ulang kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Kamu Tidak Akan Membutuhkannya, menghindari optimasi prematur
* **[Twelve Factor](https://12factor.net/)**: Mengikuti praktik terbaik untuk membangun aplikasi modern yang skalabel
* **[Pisau cukur Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Memilih solusi paling sederhana yang memenuhi kebutuhan
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Menggunakan produk kami sendiri secara luas
Prinsip-prinsip ini bukan hanya konsep teoretis—mereka tertanam dalam praktik pengembangan harian kami. Misalnya, kepatuhan kami terhadap filosofi Unix terlihat dari bagaimana kami menyusun paket npm kami: modul kecil dan terfokus yang dapat digabungkan untuk menyelesaikan masalah kompleks.

### Menargetkan Pengembang yang Mandiri dan Bootstrapped {#targeting-the-scrappy-bootstrapped-developer}

Kami secara khusus menargetkan pengembang yang mandiri, bootstrapped, dan [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html). Fokus ini membentuk segala sesuatu mulai dari model harga kami hingga keputusan teknis kami. Kami memahami tantangan membangun produk dengan sumber daya terbatas karena kami pernah mengalaminya sendiri.

Prinsip ini sangat penting dalam pendekatan kami terhadap open source. Kami membuat dan memelihara paket yang menyelesaikan masalah nyata bagi pengembang tanpa anggaran perusahaan, membuat alat yang kuat dapat diakses oleh semua orang tanpa memandang sumber daya mereka.

### Prinsip dalam Praktik: Codebase Forward Email {#principles-in-practice-the-forward-email-codebase}

Prinsip-prinsip ini terlihat jelas dalam codebase Forward Email. File package.json kami mengungkapkan pemilihan dependensi yang dipikirkan dengan matang, masing-masing dipilih untuk selaras dengan nilai inti kami:

* Paket yang berfokus pada keamanan seperti `mailauth` untuk autentikasi email
* Alat yang ramah pengembang seperti `preview-email` untuk debugging yang lebih mudah
* Komponen modular seperti berbagai utilitas `p-*` dari Sindre Sorhus

Dengan mengikuti prinsip-prinsip ini secara konsisten dari waktu ke waktu, kami telah membangun layanan yang dapat dipercaya pengembang untuk infrastruktur email mereka—aman, andal, dan selaras dengan nilai komunitas open source.

### Privasi berdasarkan Desain {#privacy-by-design}

Privasi bukanlah pemikiran tambahan atau fitur pemasaran untuk Forward Email—ini adalah prinsip desain fundamental yang menginformasikan setiap aspek layanan dan kode kami:

* **Enkripsi Tanpa Akses**: Kami telah mengimplementasikan sistem yang membuat kami secara teknis tidak mungkin membaca email pengguna.
* **Pengumpulan Data Minimal**: Kami hanya mengumpulkan data yang diperlukan untuk menyediakan layanan kami, tidak lebih.
* **Kebijakan Transparan**: Kebijakan privasi kami ditulis dalam bahasa yang jelas dan mudah dipahami tanpa jargon hukum.
* **Verifikasi Open Source**: Codebase open source kami memungkinkan peneliti keamanan untuk memverifikasi klaim privasi kami.

Komitmen ini juga meluas ke paket open source kami, yang dirancang dengan praktik terbaik keamanan dan privasi yang dibangun sejak awal.

### Open Source yang Berkelanjutan {#sustainable-open-source}

Kami percaya bahwa perangkat lunak open source membutuhkan model yang berkelanjutan agar dapat berkembang dalam jangka panjang. Pendekatan kami meliputi:

* **Dukungan Komersial**: Menawarkan dukungan premium dan layanan di sekitar alat open source kami.
* **Lisensi Seimbang**: Menggunakan lisensi yang melindungi kebebasan pengguna sekaligus keberlanjutan proyek.
* **Keterlibatan Komunitas**: Aktif berinteraksi dengan kontributor untuk membangun komunitas yang mendukung.
* **Roadmap Transparan**: Membagikan rencana pengembangan kami agar pengguna dapat merencanakan dengan baik.

Dengan fokus pada keberlanjutan, kami memastikan kontribusi open source kami dapat terus tumbuh dan berkembang dari waktu ke waktu daripada terabaikan.


## Angka Tidak Berbohong: Statistik Unduhan npm Kami yang Mencengangkan {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Ketika kami berbicara tentang dampak perangkat lunak open source, statistik unduhan memberikan ukuran nyata dari adopsi dan kepercayaan. Banyak paket yang kami bantu pelihara telah mencapai skala yang jarang dicapai oleh proyek open source lainnya, dengan jumlah unduhan gabungan mencapai miliaran.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Meskipun kami bangga membantu memelihara beberapa paket dengan unduhan tinggi di ekosistem JavaScript, kami ingin mengakui bahwa banyak dari paket ini awalnya dibuat oleh pengembang berbakat lainnya. Paket seperti superagent dan supertest awalnya dibuat oleh TJ Holowaychuk, yang kontribusinya yang produktif terhadap open source sangat berperan dalam membentuk ekosistem Node.js.
### Gambaran Umum Dampak Kami {#a-birds-eye-view-of-our-impact}

Dalam periode dua bulan dari Februari hingga Maret 2025, paket-paket utama yang kami kontribusikan dan bantu pelihara mencatat angka unduhan yang luar biasa:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 unduhan\[^7] (awalnya dibuat oleh TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 unduhan\[^8] (awalnya dibuat oleh TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28.539.295 unduhan\[^34] (awalnya dibuat oleh TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 unduhan\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 unduhan\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 unduhan\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 unduhan\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1.800.000 unduhan\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 unduhan\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1.128.139 unduhan\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1.124.686 unduhan\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 unduhan\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 unduhan\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839.585 unduhan\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145.000 unduhan\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24.270 unduhan\[^30]

> \[!NOTE]
> Beberapa paket lain yang kami bantu pelihara tetapi tidak kami buat memiliki jumlah unduhan yang bahkan lebih tinggi, termasuk `form-data` (lebih dari 738 juta unduhan), `toidentifier` (lebih dari 309 juta unduhan), `stackframe` (lebih dari 116 juta unduhan), dan `error-stack-parser` (lebih dari 113 juta unduhan). Kami merasa terhormat dapat berkontribusi pada paket-paket ini sambil menghormati karya para pembuat aslinya.

Ini bukan hanya angka yang mengesankan—angka ini mewakili pengembang nyata yang memecahkan masalah nyata dengan kode yang kami bantu pelihara. Setiap unduhan adalah sebuah momen di mana paket-paket ini membantu seseorang membangun sesuatu yang bermakna, mulai dari proyek hobi hingga aplikasi perusahaan yang digunakan oleh jutaan orang.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Dampak Harian dalam Skala Besar {#daily-impact-at-scale}

Pola unduhan harian menunjukkan penggunaan yang konsisten dan volume tinggi, dengan puncak mencapai jutaan unduhan per hari\[^13]. Konsistensi ini menunjukkan stabilitas dan keandalan paket-paket ini—pengembang tidak hanya mencoba, mereka mengintegrasikannya ke dalam alur kerja inti mereka dan bergantung pada paket-paket ini hari demi hari.

Pola unduhan mingguan menunjukkan angka yang bahkan lebih mengesankan, secara konsisten berada di sekitar puluhan juta unduhan per minggu\[^14]. Ini menunjukkan jejak yang sangat besar dalam ekosistem JavaScript, dengan paket-paket ini berjalan di lingkungan produksi di seluruh dunia.

### Lebih dari Sekadar Angka Mentah {#beyond-the-raw-numbers}

Meskipun statistik unduhan sudah mengesankan, mereka menceritakan kisah yang lebih dalam tentang kepercayaan komunitas terhadap paket-paket ini. Memelihara paket dalam skala ini membutuhkan komitmen yang tak tergoyahkan terhadap:

* **Kompatibilitas Mundur**: Perubahan harus dipertimbangkan dengan hati-hati agar tidak merusak implementasi yang sudah ada.
* **Keamanan**: Dengan jutaan aplikasi yang bergantung pada paket-paket ini, kerentanan keamanan dapat memiliki konsekuensi yang luas.
* **Performa**: Dalam skala ini, bahkan peningkatan performa kecil dapat memberikan manfaat agregat yang signifikan.
* **Dokumentasi**: Dokumentasi yang jelas dan komprehensif sangat penting untuk paket yang digunakan oleh pengembang dengan berbagai tingkat pengalaman.

Pertumbuhan konsisten dalam angka unduhan dari waktu ke waktu mencerminkan keberhasilan dalam memenuhi komitmen ini, membangun kepercayaan dengan komunitas pengembang melalui paket yang andal dan terpelihara dengan baik.
## Mendukung Ekosistem: Sponsorship Open Source Kami {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Keberlanjutan open source bukan hanya tentang berkontribusi kode—tetapi juga tentang mendukung para pengembang yang memelihara infrastruktur penting.

Selain kontribusi langsung kami pada ekosistem JavaScript, kami bangga mensponsori kontributor Node.js terkemuka yang karyanya menjadi fondasi banyak aplikasi modern. Sponsorship kami meliputi:

### Andris Reinman: Pelopor Infrastruktur Email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) adalah pencipta [Nodemailer](https://github.com/nodemailer/nodemailer), perpustakaan pengiriman email paling populer untuk Node.js dengan lebih dari 14 juta unduhan mingguan\[^15]. Karyanya meluas ke komponen infrastruktur email penting lainnya seperti [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), dan [WildDuck](https://github.com/nodemailer/wildduck).

Sponsorship kami membantu memastikan pemeliharaan dan pengembangan berkelanjutan dari alat-alat penting ini yang mendukung komunikasi email bagi banyak aplikasi Node.js, termasuk layanan Forward Email kami sendiri.

### Sindre Sorhus: Ahli Paket Utilitas {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) adalah salah satu kontributor open source paling produktif di ekosistem JavaScript, dengan lebih dari 1.000 paket npm atas namanya. Utilitasnya seperti [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), dan [is-stream](https://github.com/sindresorhus/is-stream) adalah blok bangunan fundamental yang digunakan di seluruh ekosistem Node.js.

Dengan mensponsori karya Sindre, kami membantu mempertahankan pengembangan utilitas penting ini yang membuat pengembangan JavaScript menjadi lebih efisien dan andal.

Sponsorship ini mencerminkan komitmen kami terhadap ekosistem open source yang lebih luas. Kami menyadari bahwa kesuksesan kami sendiri dibangun di atas fondasi yang diletakkan oleh kontributor ini dan lainnya, dan kami berdedikasi untuk memastikan keberlanjutan seluruh ekosistem.


## Mengungkap Kerentanan Keamanan di Ekosistem JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Komitmen kami terhadap open source melampaui pengembangan fitur untuk mencakup identifikasi dan penanganan kerentanan keamanan yang dapat berdampak pada jutaan pengembang. Beberapa kontribusi paling signifikan kami pada ekosistem JavaScript berada di ranah keamanan.

### Penyelamatan Koa-Router {#the-koa-router-rescue}

Pada Februari 2019, Nick mengidentifikasi masalah kritis dengan pemeliharaan paket koa-router yang populer. Seperti yang dia [laporkan di Hacker News](https://news.ycombinator.com/item?id=19156707), paket tersebut telah ditinggalkan oleh pemelihara aslinya, meninggalkan kerentanan keamanan yang tidak ditangani dan komunitas tanpa pembaruan.

> \[!WARNING]
> Paket yang ditinggalkan dengan kerentanan keamanan menimbulkan risiko signifikan bagi seluruh ekosistem, terutama ketika diunduh jutaan kali setiap minggu.

Sebagai tanggapan, Nick membuat [@koa/router](https://github.com/koajs/router) dan membantu memberi tahu komunitas tentang situasi tersebut. Dia telah memelihara paket penting ini sejak saat itu, memastikan pengguna Koa memiliki solusi routing yang aman dan terpelihara dengan baik.

### Menangani Kerentanan ReDoS {#addressing-redos-vulnerabilities}

Pada 2020, Nick mengidentifikasi dan menangani kerentanan [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) kritis dalam paket `url-regex` yang banyak digunakan. Kerentanan ini ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) dapat memungkinkan penyerang menyebabkan penolakan layanan dengan memberikan input khusus yang menyebabkan backtracking katastrofik dalam ekspresi reguler.

Alih-alih hanya memperbaiki paket yang ada, Nick membuat [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), sebuah implementasi yang ditulis ulang sepenuhnya yang mengatasi kerentanan tersebut sambil mempertahankan kompatibilitas dengan API asli. Dia juga menerbitkan [posting blog komprehensif](/blog/docs/url-regex-javascript-node-js) yang menjelaskan kerentanan dan cara menguranginya.
Pekerjaan ini menunjukkan pendekatan kami terhadap keamanan: tidak hanya memperbaiki masalah tetapi juga mendidik komunitas dan menyediakan alternatif yang kuat yang mencegah masalah serupa di masa depan.

### Mengadvokasi Keamanan Node.js dan Chromium {#advocating-for-nodejs-and-chromium-security}

Nick juga aktif dalam mengadvokasi peningkatan keamanan di ekosistem yang lebih luas. Pada Agustus 2020, ia mengidentifikasi masalah keamanan signifikan di Node.js terkait dengan penanganan header HTTP, yang dilaporkan di [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Masalah ini, yang berasal dari patch di Chromium, berpotensi memungkinkan penyerang untuk melewati langkah-langkah keamanan. Advokasi Nick membantu memastikan bahwa masalah tersebut segera ditangani, melindungi jutaan aplikasi Node.js dari potensi eksploitasi.

### Mengamankan Infrastruktur npm {#securing-npm-infrastructure}

Pada bulan yang sama, Nick mengidentifikasi masalah keamanan kritis lainnya, kali ini di infrastruktur email npm. Seperti yang dilaporkan di [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm tidak menerapkan protokol autentikasi email DMARC, SPF, dan DKIM dengan benar, yang berpotensi memungkinkan penyerang mengirim email phishing yang tampak berasal dari npm.

Laporan Nick mendorong perbaikan dalam postur keamanan email npm, melindungi jutaan pengembang yang mengandalkan npm untuk manajemen paket dari potensi serangan phishing.


## Kontribusi Kami untuk Ekosistem Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email dibangun di atas beberapa proyek open source penting, termasuk Nodemailer, WildDuck, dan mailauth. Tim kami telah memberikan kontribusi signifikan pada proyek-proyek ini, membantu mengidentifikasi dan memperbaiki masalah mendalam yang memengaruhi pengiriman dan keamanan email.

### Meningkatkan Fungsi Inti Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) adalah tulang punggung pengiriman email di Node.js, dan kontribusi kami telah membantu membuatnya lebih tangguh:

* **Perbaikan Server SMTP**: Kami telah memperbaiki bug parsing, masalah penanganan stream, dan masalah konfigurasi TLS pada komponen server SMTP\[^16]\[^17].
* **Peningkatan Mail Parser**: Kami telah mengatasi kesalahan decoding urutan karakter dan masalah parser alamat yang dapat menyebabkan kegagalan pemrosesan email\[^18]\[^19].

Kontribusi ini memastikan bahwa Nodemailer tetap menjadi fondasi yang andal untuk pemrosesan email dalam aplikasi Node.js, termasuk Forward Email.

### Memajukan Autentikasi Email dengan Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) menyediakan fungsi autentikasi email yang penting, dan kontribusi kami telah secara signifikan meningkatkan kemampuannya:

* **Perbaikan Verifikasi DKIM**: Kami menemukan dan melaporkan bahwa X/Twitter mengalami masalah cache DNS yang menyebabkan kegagalan DKIM untuk pesan keluar mereka, melaporkannya di Hacker One\[^20].
* **Peningkatan DMARC dan ARC**: Kami telah memperbaiki masalah dengan verifikasi DMARC dan ARC yang dapat menyebabkan hasil autentikasi yang salah\[^21]\[^22].
* **Optimasi Performa**: Kami telah memberikan kontribusi optimasi yang meningkatkan performa proses autentikasi email\[^23]\[^24]\[^25]\[^26].

Perbaikan ini membantu memastikan bahwa autentikasi email akurat dan dapat diandalkan, melindungi pengguna dari serangan phishing dan spoofing.

### Peningkatan Utama Upptime {#key-upptime-enhancements}

Kontribusi kami untuk Upptime meliputi:

* **Pemantauan Sertifikat SSL**: Kami menambahkan fungsi untuk memantau masa berlaku sertifikat SSL, mencegah downtime tak terduga akibat sertifikat yang kedaluwarsa\[^27].
* **Dukungan Beberapa Nomor SMS**: Kami mengimplementasikan dukungan untuk memberi peringatan kepada beberapa anggota tim melalui SMS saat insiden terjadi, meningkatkan waktu respons\[^28].
* **Perbaikan Pemeriksaan IPv6**: Kami memperbaiki masalah dengan pemeriksaan konektivitas IPv6, memastikan pemantauan yang lebih akurat di lingkungan jaringan modern\[^29].
* **Dukungan Mode Gelap/Terang**: Kami menambahkan dukungan tema untuk meningkatkan pengalaman pengguna pada halaman status\[^31].
* **Dukungan TCP-Ping yang Lebih Baik**: Kami meningkatkan fungsi ping TCP untuk memberikan pengujian koneksi yang lebih andal\[^32].
Perbaikan ini tidak hanya menguntungkan pemantauan status Forward Email tetapi juga tersedia untuk seluruh komunitas pengguna Upptime, menunjukkan komitmen kami untuk meningkatkan alat yang kami andalkan.


## Perekat yang Menyatukan Semuanya: Kode Kustom dalam Skala Besar {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Meskipun paket npm kami dan kontribusi pada proyek yang sudah ada sangat berarti, kode kustom yang mengintegrasikan komponen-komponen ini benar-benar menunjukkan keahlian teknis kami. Basis kode Forward Email mewakili upaya pengembangan selama satu dekade, dimulai sejak 2017 ketika proyek ini bermula sebagai [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) sebelum digabungkan ke dalam monorepo.

### Upaya Pengembangan yang Besar {#a-massive-development-effort}

Skala kode integrasi kustom ini sangat mengesankan:

* **Total Kontribusi**: Lebih dari 3.217 commit
* **Ukuran Basis Kode**: Lebih dari 421.545 baris kode di berbagai file JavaScript, Pug, CSS, dan JSON\[^33]

Ini mewakili ribuan jam kerja pengembangan, sesi debugging, dan optimasi performa. Ini adalah "rahasia" yang mengubah paket-paket individual menjadi layanan yang kohesif dan dapat diandalkan yang digunakan oleh ribuan pelanggan setiap hari.

### Integrasi Dependensi Inti {#core-dependencies-integration}

Basis kode Forward Email mengintegrasikan banyak dependensi menjadi satu kesatuan yang mulus:

* **Pemrosesan Email**: Mengintegrasikan Nodemailer untuk pengiriman, SMTP Server untuk penerimaan, dan Mailparser untuk parsing
* **Otentikasi**: Menggunakan Mailauth untuk verifikasi DKIM, SPF, DMARC, dan ARC
* **Resolusi DNS**: Memanfaatkan Tangerine untuk DNS-over-HTTPS dengan caching global
* **Koneksi MX**: Menggunakan mx-connect dengan integrasi Tangerine untuk koneksi server mail yang andal
* **Penjadwalan Tugas**: Memakai Bree untuk pemrosesan tugas latar belakang yang andal dengan worker threads
* **Templating**: Menggunakan email-templates untuk menggunakan ulang stylesheet dari situs web dalam komunikasi pelanggan
* **Penyimpanan Email**: Menerapkan kotak surat SQLite yang dienkripsi secara individual menggunakan better-sqlite3-multiple-ciphers dengan enkripsi ChaCha20-Poly1305 untuk privasi yang tahan kuantum, memastikan isolasi penuh antar pengguna dan hanya pengguna yang memiliki akses ke kotak surat mereka

Setiap integrasi ini memerlukan pertimbangan cermat terhadap kasus tepi, implikasi performa, dan masalah keamanan. Hasilnya adalah sistem yang tangguh yang menangani jutaan transaksi email dengan andal. Implementasi SQLite kami juga memanfaatkan msgpackr untuk serialisasi biner yang efisien dan WebSockets (melalui ws) untuk pembaruan status real-time di seluruh infrastruktur kami.

### Infrastruktur DNS dengan Tangerine dan mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Komponen penting dari infrastruktur Forward Email adalah sistem resolusi DNS kami, yang dibangun di sekitar dua paket utama:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Implementasi DNS-over-HTTPS Node.js kami menyediakan pengganti langsung untuk resolver DNS standar, dengan retry bawaan, timeout, rotasi server cerdas, dan dukungan caching.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Paket ini membuat koneksi TCP ke server MX, mengambil domain target atau alamat email, menyelesaikan server MX yang sesuai, dan menghubungkan ke mereka berdasarkan urutan prioritas.

Kami telah mengintegrasikan Tangerine dengan mx-connect melalui [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), memastikan permintaan DNS over HTTP di lapisan aplikasi di seluruh Forward Email. Ini menyediakan caching global untuk DNS dalam skala besar dengan konsistensi 1:1 di seluruh wilayah, aplikasi, atau proses—penting untuk pengiriman email yang andal dalam sistem terdistribusi.


## Dampak Enterprise: Dari Open Source ke Solusi Misi-Kritis {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Puncak dari perjalanan kami selama satu dekade dalam pengembangan open source telah memungkinkan Forward Email melayani tidak hanya pengembang individu tetapi juga perusahaan besar dan institusi pendidikan yang menjadi tulang punggung gerakan open source itu sendiri.
### Studi Kasus dalam Infrastruktur Email yang Sangat Penting {#case-studies-in-mission-critical-email-infrastructure}

Komitmen kami terhadap keandalan, privasi, dan prinsip sumber terbuka telah menjadikan Forward Email pilihan terpercaya bagi organisasi dengan kebutuhan email yang menuntut:

* **Institusi Pendidikan**: Seperti yang dijelaskan dalam [studi kasus penerusan email alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), universitas-universitas besar mengandalkan infrastruktur kami untuk menjaga hubungan seumur hidup dengan ratusan ribu alumni melalui layanan penerusan email yang andal.

* **Solusi Linux Perusahaan**: [Studi kasus email perusahaan Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) menunjukkan bagaimana pendekatan sumber terbuka kami sangat sesuai dengan kebutuhan penyedia Linux perusahaan, memberikan mereka transparansi dan kontrol yang mereka perlukan.

* **Yayasan Sumber Terbuka**: Mungkin yang paling membuktikan adalah kemitraan kami dengan Linux Foundation, seperti yang didokumentasikan dalam [studi kasus email perusahaan Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), di mana layanan kami mendukung komunikasi untuk organisasi yang mengelola pengembangan Linux.

Ada simetri yang indah dalam bagaimana paket sumber terbuka kami, yang dipelihara dengan cermat selama bertahun-tahun, telah memungkinkan kami membangun layanan email yang kini mendukung komunitas dan organisasi yang memperjuangkan perangkat lunak sumber terbuka. Perjalanan penuh lingkaran ini—dari berkontribusi paket individu hingga mendukung infrastruktur email kelas perusahaan untuk pemimpin sumber terbuka—mewakili validasi tertinggi dari pendekatan kami terhadap pengembangan perangkat lunak.


## Satu Dekade Sumber Terbuka: Melihat ke Depan {#a-decade-of-open-source-looking-forward}

Saat kami menengok kembali satu dekade kontribusi sumber terbuka dan menatap sepuluh tahun ke depan, kami dipenuhi rasa syukur atas komunitas yang telah mendukung pekerjaan kami dan antusiasme untuk apa yang akan datang.

Perjalanan kami dari kontributor paket individu menjadi pemelihara infrastruktur email komprehensif yang digunakan oleh perusahaan besar dan yayasan sumber terbuka sangat luar biasa. Ini adalah bukti kekuatan pengembangan sumber terbuka dan dampak yang dapat diberikan perangkat lunak yang dipelihara dengan baik dan penuh perhatian pada ekosistem yang lebih luas.

Dalam beberapa tahun mendatang, kami berkomitmen untuk:

* **Terus memelihara dan meningkatkan paket yang sudah ada**, memastikan mereka tetap menjadi alat yang andal bagi pengembang di seluruh dunia.
* **Memperluas kontribusi kami pada proyek infrastruktur kritis**, terutama di bidang email dan keamanan.
* **Meningkatkan kemampuan Forward Email** sambil mempertahankan komitmen kami terhadap privasi, keamanan, dan transparansi.
* **Mendukung generasi berikutnya dari kontributor sumber terbuka** melalui bimbingan, sponsor, dan keterlibatan komunitas.

Kami percaya bahwa masa depan pengembangan perangkat lunak adalah terbuka, kolaboratif, dan dibangun di atas fondasi kepercayaan. Dengan terus berkontribusi paket berkualitas tinggi yang berfokus pada keamanan ke ekosistem JavaScript, kami berharap dapat memainkan peran kecil dalam membangun masa depan tersebut.

Terima kasih kepada semua yang telah menggunakan paket kami, berkontribusi pada proyek kami, melaporkan masalah, atau sekadar menyebarkan kabar tentang pekerjaan kami. Dukungan Anda telah memungkinkan dampak selama satu dekade ini, dan kami sangat antusias melihat apa yang bisa kita capai bersama dalam sepuluh tahun ke depan.

\[^1]: statistik unduhan npm untuk cabin, April 2025  
\[^2]: statistik unduhan npm untuk bson-objectid, Februari-Maret 2025  
\[^3]: statistik unduhan npm untuk url-regex-safe, April 2025  
\[^4]: jumlah bintang GitHub untuk forwardemail/forwardemail.net per April 2025  
\[^5]: statistik unduhan npm untuk preview-email, April 2025  
\[^7]: statistik unduhan npm untuk superagent, Februari-Maret 2025  
\[^8]: statistik unduhan npm untuk supertest, Februari-Maret 2025  
\[^9]: statistik unduhan npm untuk preview-email, Februari-Maret 2025  
\[^10]: statistik unduhan npm untuk cabin, Februari-Maret 2025  
\[^11]: statistik unduhan npm untuk url-regex-safe, Februari-Maret 2025  
\[^12]: statistik unduhan npm untuk spamscanner, Februari-Maret 2025  
\[^13]: Pola unduhan harian dari statistik npm, April 2025  
\[^14]: Pola unduhan mingguan dari statistik npm, April 2025  
\[^15]: statistik unduhan npm untuk nodemailer, April 2025  
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>  
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>  
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>  
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>  
\[^20]: <https://github.com/postalsys/mailauth/issues/30>  
\[^21]: <https://github.com/postalsys/mailauth/issues/58>  
\[^22]: <https://github.com/postalsys/mailauth/issues/48>  
\[^23]: <https://github.com/postalsys/mailauth/issues/74>  
\[^24]: <https://github.com/postalsys/mailauth/issues/75>  
\[^25]: <https://github.com/postalsys/mailauth/issues/60>  
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: Berdasarkan isu GitHub di repositori Upptime  
\[^28]: Berdasarkan isu GitHub di repositori Upptime  
\[^29]: Berdasarkan isu GitHub di repositori Upptime  
\[^30]: statistik unduhan npm untuk bree, Februari-Maret 2025  
\[^31]: Berdasarkan permintaan tarik GitHub ke Upptime  
\[^32]: Berdasarkan permintaan tarik GitHub ke Upptime  
\[^34]: statistik unduhan npm untuk koa, Februari-Maret 2025  
\[^35]: statistik unduhan npm untuk @koa/router, Februari-Maret 2025  
\[^36]: statistik unduhan npm untuk koa-router, Februari-Maret 2025  
\[^37]: statistik unduhan npm untuk url-regex, Februari-Maret 2025  
\[^38]: statistik unduhan npm untuk @breejs/later, Februari-Maret 2025  
\[^39]: statistik unduhan npm untuk email-templates, Februari-Maret 2025  
\[^40]: statistik unduhan npm untuk get-paths, Februari-Maret 2025  
\[^41]: statistik unduhan npm untuk dotenv-parse-variables, Februari-Maret 2025  
\[^42]: statistik unduhan npm untuk @koa/multer, Februari-Maret 2025
