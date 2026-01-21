# Satu Dekade Berdampak: Bagaimana Paket npm Kami Mencapai 1 Miliar Unduhan dan Membentuk JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Kata pengantar](#foreword)
* [Para Pionir yang Mempercayai Kami: Isaac Z. Schlueter dan Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Dari Penciptaan npm hingga Kepemimpinan Node.js](#from-npms-creation-to-nodejs-leadership)
* [Arsitek di Balik Kode: Perjalanan Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Komite Teknis Ekspres dan Kontribusi Inti](#express-technical-committee-and-core-contributions)
  * [Kontribusi Kerangka Kerja Koa](#koa-framework-contributions)
  * [Dari Kontributor Individu menjadi Pemimpin Organisasi](#from-individual-contributor-to-organization-leader)
* [Organisasi GitHub Kami: Ekosistem Inovasi](#our-github-organizations-ecosystems-of-innovation)
  * [Kabin: Pencatatan Terstruktur untuk Aplikasi Modern](#cabin-structured-logging-for-modern-applications)
  * [Pemindai Spam: Melawan Penyalahgunaan Email](#spam-scanner-fighting-email-abuse)
  * [Bree: Penjadwalan Pekerjaan Modern dengan Utas Pekerja](#bree-modern-job-scheduling-with-worker-threads)
  * [Meneruskan Email: Infrastruktur Email Sumber Terbuka](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilitas dan Alat Penting Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Pemantauan Waktu Aktif Sumber Terbuka](#upptime-open-source-uptime-monitoring)
* [Kontribusi Kami terhadap Ekosistem Email Terusan](#our-contributions-to-the-forward-email-ecosystem)
  * [Dari Paket ke Produksi](#from-packages-to-production)
  * [Lingkaran Umpan Balik](#the-feedback-loop)
* [Prinsip Inti Email Teruskan: Fondasi untuk Keunggulan](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Selalu Ramah Pengembang, Berfokus pada Keamanan, dan Transparan](#always-developer-friendly-security-focused-and-transparent)
  * [Kepatuhan terhadap Prinsip Pengembangan Perangkat Lunak yang Telah Teruji Waktu](#adherence-to-time-tested-software-development-principles)
  * [Menargetkan Pengembang yang Berkemah dan Bermodalkan Kemampuan](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinsip dalam Praktik: Basis Kode Email Teruskan](#principles-in-practice-the-forward-email-codebase)
  * [Privasi berdasarkan Desain](#privacy-by-design)
  * [Sumber Terbuka yang Berkelanjutan](#sustainable-open-source)
* [Angka Tidak Berbohong: Statistik Unduhan npm Kami yang Menakjubkan](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Pandangan Luas tentang Dampak Kami](#a-birds-eye-view-of-our-impact)
  * [Dampak Harian dalam Skala Besar](#daily-impact-at-scale)
  * [Melampaui Angka Mentah](#beyond-the-raw-numbers)
* [Mendukung Ekosistem: Sponsorship Open Source Kami](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pelopor Infrastruktur Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Dalang Paket Utilitas](#sindre-sorhus-utility-package-mastermind)
* [Mengungkap Kerentanan Keamanan dalam Ekosistem JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Penyelamatan Koa-Router](#the-koa-router-rescue)
  * [Mengatasi Kerentanan ReDoS](#addressing-redos-vulnerabilities)
  * [Mendukung Keamanan Node.js dan Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Mengamankan Infrastruktur npm](#securing-npm-infrastructure)
* [Kontribusi Kami terhadap Ekosistem Email Terusan](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Meningkatkan Fungsionalitas Inti Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Memajukan Autentikasi Email dengan Mailauth](#advancing-email-authentication-with-mailauth)
  * [Peningkatan Upptime Utama](#key-upptime-enhancements)
* [Perekat yang Menyatukan Semuanya: Kode Kustom dalam Skala Besar](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Upaya Pembangunan Besar-besaran](#a-massive-development-effort)
  * [Integrasi Ketergantungan Inti](#core-dependencies-integration)
  * [Infrastruktur DNS dengan Tangerine dan mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Dampak Perusahaan: Dari Solusi Open Source ke Solusi Misi Kritis](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Studi Kasus Infrastruktur Email Kritis](#case-studies-in-mission-critical-email-infrastructure)
* [Satu Dekade Open Source: Menatap Masa Depan](#a-decade-of-open-source-looking-forward)

## Kata Pengantar {#foreword}

Di dunia [JavaScript](https://en.wikipedia.org/wiki/JavaScript) dan [Node.js](https://en.wikipedia.org/wiki/Node.js), beberapa paket sangat penting—diunduh jutaan kali setiap hari dan mendukung aplikasi di seluruh dunia. Di balik perangkat ini terdapat para pengembang yang berfokus pada kualitas sumber terbuka. Hari ini, kami menunjukkan bagaimana tim kami membantu membangun dan memelihara paket-paket npm yang telah menjadi bagian penting dari ekosistem JavaScript.

## Para Pelopor yang Mempercayai Kami: Isaac Z. Schlueter dan Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Kami bangga memiliki [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) sebagai pengguna. Isaac menciptakan [npm](https://en.wikipedia.org/wiki/Npm_\(software\) dan membantu membangun [Node.js](https://en.wikipedia.org/wiki/Node.js). Kepercayaannya pada Forward Email menunjukkan fokus kami pada kualitas dan keamanan. Isaac menggunakan Forward Email untuk beberapa domain, termasuk izs.me.

Pengaruh Isaac pada JavaScript sangat besar. Pada tahun 2009, ia termasuk orang pertama yang menyadari potensi Node.js, bekerja sama dengan [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), pencipta platform tersebut. Seperti yang dikatakan Isaac dalam [wawancara dengan majalah Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Di tengah komunitas yang sangat kecil ini, yang terdiri dari sekelompok orang yang mencoba mencari cara untuk mewujudkan JavaScript sisi server, Ryan Dahl memperkenalkan Node, yang jelas merupakan pendekatan yang tepat. Saya ikut serta dan terlibat aktif sekitar pertengahan tahun 2009."

> \[!NOTE]
> Bagi mereka yang tertarik dengan sejarah Node.js, tersedia berbagai film dokumenter menarik yang mengisahkan perkembangannya, termasuk [Kisah Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) dan [10 Hal yang Saya Sesali Tentang Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). [situs web pribadi](https://tinyclouds.org/) karya Ryan Dahl juga memuat wawasan berharga tentang karyanya.

### Dari Penciptaan npm hingga Kepemimpinan Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac menciptakan npm pada September 2009, dengan versi pertama yang dapat digunakan dirilis pada awal 2010. Pengelola paket ini memenuhi kebutuhan utama Node.js, memungkinkan pengembang untuk berbagi dan menggunakan kembali kode dengan mudah. Menurut [Halaman Wikipedia Node.js](https://en.wikipedia.org/wiki/Node.js), "Pada Januari 2010, sebuah pengelola paket diperkenalkan untuk lingkungan Node.js yang disebut npm. Pengelola paket ini memungkinkan programmer untuk menerbitkan dan berbagi paket Node.js, beserta kode sumbernya, dan dirancang untuk menyederhanakan instalasi, pembaruan, dan penghapusan instalasi paket."

Ketika Ryan Dahl mengundurkan diri dari Node.js pada Januari 2012, Isaac mengambil alih sebagai pemimpin proyek. Sebagaimana dicatat pada [ringkasannya](https://izs.me/resume), ia "Memimpin pengembangan beberapa API inti Node.js fundamental, termasuk sistem modul CommonJS, API sistem berkas, dan aliran data" dan "Bertindak sebagai BDFL (Diktator Sejati Seumur Hidup) proyek selama 2 tahun, memastikan proses pembangunan yang terus meningkat kualitasnya dan andal untuk Node.js versi v0.6 hingga v0.10."

Isaac membimbing Node.js melewati periode pertumbuhan yang penting, menetapkan standar yang masih membentuk platform tersebut hingga saat ini. Ia kemudian mendirikan npm, Inc. pada tahun 2014 untuk mendukung registri npm, yang sebelumnya ia kelola sendiri.

Kami berterima kasih kepada Isaac atas kontribusinya yang luar biasa pada JavaScript dan terus menggunakan banyak paket ciptaannya. Karyanya telah mengubah cara kita membangun perangkat lunak dan cara jutaan pengembang berbagi kode di seluruh dunia.

## Arsitek di Balik Kode: Perjalanan Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Inti dari kesuksesan sumber terbuka kami adalah Nick Baugh, pendiri dan pemilik Forward Email. Karyanya di JavaScript telah berlangsung hampir 20 tahun dan telah membentuk cara banyak pengembang membangun aplikasi. Perjalanannya di bidang sumber terbuka menunjukkan keahlian teknis sekaligus kepemimpinan komunitas.

### Komite Teknis Ekspres dan Kontribusi Inti {#express-technical-committee-and-core-contributions}

Keahlian Nick dalam kerangka kerja web membuatnya mendapatkan tempat di [Komite Teknis Ekspres](https://expressjs.com/en/resources/community.html), tempat ia membantu mengembangkan salah satu kerangka kerja Node.js yang paling banyak digunakan. Nick kini terdaftar sebagai anggota tidak aktif di [Halaman komunitas Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express awalnya diciptakan oleh TJ Holowaychuk, seorang kontributor sumber terbuka produktif yang telah membentuk sebagian besar ekosistem Node.js. Kami berterima kasih atas karya fundamental TJ dan menghormati [keputusan untuk istirahat](https://news.ycombinator.com/item?id=37687017)-nya atas kontribusi sumber terbukanya yang ekstensif.

Sebagai anggota [Komite Teknis Ekspres](https://expressjs.com/en/resources/community.html), Nick menunjukkan perhatian besar terhadap detail dalam masalah seperti mengklarifikasi dokumentasi `req.originalUrl` dan memperbaiki masalah penanganan formulir multibagian.

### Kontribusi Kerangka Kerja Koa {#koa-framework-contributions}

Karya Nick dengan [Kerangka kerja Koa](https://github.com/koajs/koa)—alternatif modern dan ringan untuk Express yang juga diciptakan oleh TJ Holowaychuk—semakin menunjukkan komitmennya terhadap perangkat pengembangan web yang lebih baik. Kontribusinya untuk Koa mencakup masalah dan kode melalui permintaan tarik, penanganan kesalahan, manajemen tipe konten, dan peningkatan dokumentasi.

Karyanya di Express dan Koa memberinya pandangan unik tentang pengembangan web Node.js, membantu tim kami membuat paket yang berfungsi baik dengan berbagai ekosistem kerangka kerja.

### Dari Kontributor Individu menjadi Pemimpin Organisasi {#from-individual-contributor-to-organization-leader}

Berawal dari membantu proyek-proyek yang sudah ada, Nick kemudian mengembangkan dan memelihara ekosistem paket secara menyeluruh. Nick mendirikan beberapa organisasi GitHub—termasuk [Kabin](https://github.com/cabinjs), [Pemindai Spam](https://github.com/spamscanner), [Teruskan Email](https://github.com/forwardemail), [Anak laki-laki](https://github.com/ladjs), dan [Bree](https://github.com/breejs)—yang masing-masing memecahkan kebutuhan spesifik dalam komunitas JavaScript.

Pergeseran dari kontributor menjadi pemimpin ini menunjukkan visi Nick untuk perangkat lunak yang dirancang dengan baik dan mampu memecahkan masalah nyata. Dengan mengelola paket-paket terkait di bawah organisasi GitHub yang terfokus, ia telah membangun ekosistem perangkat yang bekerja sama sekaligus tetap modular dan fleksibel bagi komunitas pengembang yang lebih luas.

## Organisasi GitHub Kami: Ekosistem Inovasi {#our-github-organizations-ecosystems-of-innovation}

Kami mengelola pekerjaan sumber terbuka kami di sekitar organisasi GitHub yang terfokus, masing-masing untuk memenuhi kebutuhan spesifik dalam JavaScript. Struktur ini menciptakan keluarga paket yang kohesif yang bekerja sama dengan baik sekaligus tetap modular.

Kabin ###: Pencatatan Terstruktur untuk Aplikasi Modern {#cabin-structured-logging-for-modern-applications}

[Organisasi kabin](https://github.com/cabinjs) adalah solusi kami untuk pencatatan aplikasi yang sederhana dan canggih. Paket utama [`cabin`](https://github.com/cabinjs/cabin) memiliki hampir 900 bintang GitHub dan lebih dari 100.000 unduhan mingguan. Cabin menyediakan pencatatan terstruktur yang kompatibel dengan layanan populer seperti Sentry, LogDNA, dan Papertrail.

Keistimewaan Cabin terletak pada sistem API dan plugin-nya yang canggih. Paket-paket pendukung seperti [`axe`](https://github.com/cabinjs/axe) untuk middleware Express dan [`parse-request`](https://github.com/cabinjs/parse-request) untuk penguraian permintaan HTTP menunjukkan komitmen kami terhadap solusi yang lengkap, alih-alih alat yang terisolasi.

Paket [`bson-objectid`](https://github.com/cabinjs/bson-objectid) patut mendapat perhatian khusus, dengan lebih dari 1,7 juta unduhan hanya dalam dua bulan. Implementasi ObjectID MongoDB yang ringan ini telah menjadi pilihan utama bagi para pengembang yang membutuhkan ID tanpa dependensi MongoDB penuh.

### Pemindai Spam: Melawan Penyalahgunaan Email {#spam-scanner-fighting-email-abuse}

[Organisasi Pemindai Spam](https://github.com/spamscanner) menunjukkan komitmen kami untuk memecahkan masalah nyata. Paket utama [`spamscanner`](https://github.com/spamscanner/spamscanner) menyediakan deteksi spam email tingkat lanjut, tetapi paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-lah yang telah mengalami adopsi yang luar biasa.

Dengan lebih dari 1,2 juta unduhan dalam dua bulan, `url-regex-safe` memperbaiki masalah keamanan kritis pada ekspresi reguler deteksi URL lainnya. Paket ini menunjukkan pendekatan kami terhadap sumber terbuka: menemukan masalah umum (dalam hal ini, kerentanan [Ulangi](https://en.wikipedia.org/wiki/ReDoS) dalam validasi URL), menciptakan solusi yang solid, dan memeliharanya dengan cermat.

### Bree: Penjadwalan Pekerjaan Modern dengan Utas Pekerja {#bree-modern-job-scheduling-with-worker-threads}

[Organisasi Bree](https://github.com/breejs) adalah solusi kami untuk tantangan umum Node.js: penjadwalan pekerjaan yang andal. Paket utama [`bree`](https://github.com/breejs/bree), dengan lebih dari 3.100 bintang GitHub, menyediakan penjadwal pekerjaan modern menggunakan thread pekerja Node.js untuk kinerja dan keandalan yang lebih baik.

> \[!NOTE]
> Bree diciptakan setelah kami membantu mengelola [Agenda](https://github.com/agenda/agenda), menerapkan pembelajaran untuk membangun penjadwal pekerjaan yang lebih baik. Kontribusi Agenda kami membantu kami menemukan cara untuk meningkatkan penjadwalan pekerjaan.

Apa yang membuat Bree berbeda dari penjadwal lain seperti Agenda:

* **Tanpa Ketergantungan Eksternal**: Tidak seperti Agenda yang membutuhkan MongoDB, Bree tidak memerlukan Redis atau MongoDB untuk mengelola status pekerjaan.
* **Worker Thread**: Bree menggunakan worker thread Node.js untuk proses sandbox, memberikan isolasi dan performa yang lebih baik.
* **API Sederhana**: Bree menawarkan kontrol yang detail dan sederhana, sehingga memudahkan implementasi kebutuhan penjadwalan yang kompleks.
* **Dukungan Bawaan**: Fitur-fitur seperti pemuatan ulang yang lancar, pekerjaan cron, tanggal, dan waktu yang mudah dipahami pengguna telah disertakan secara default.

Bree adalah bagian penting dari [forwardemail.net](https://github.com/forwardemail/forwardemail.net), menangani tugas-tugas latar belakang penting seperti pemrosesan email, pembersihan, dan pemeliharaan terjadwal. Penggunaan Bree di Forward Email menunjukkan komitmen kami untuk menggunakan alat-alat kami sendiri dalam produksi, memastikan alat-alat tersebut memenuhi standar keandalan yang tinggi.

Kami juga menggunakan dan mengapresiasi paket utas pekerja hebat lainnya seperti [kolam](https://github.com/piscinajs/piscina) dan klien HTTP seperti [sebelas](https://github.com/nodejs/undici). Piscina, seperti Bree, menggunakan utas pekerja Node.js untuk pemrosesan tugas yang efisien. Kami berterima kasih kepada [Matthew Hill](https://github.com/mcollina), yang mengelola undici dan piscina, atas kontribusinya yang besar untuk Node.js. Matteo bertugas di Komite Pengarah Teknis Node.js dan telah meningkatkan kapabilitas klien HTTP di Node.js secara signifikan.

### Teruskan Email: Infrastruktur Email Sumber Terbuka {#forward-email-open-source-email-infrastructure}

Proyek kami yang paling ambisius adalah [Teruskan Email](https://github.com/forwardemail), sebuah layanan email sumber terbuka yang menyediakan layanan penerusan, penyimpanan, dan API email. Repositori utamanya memiliki lebih dari 1.100 bintang GitHub, yang menunjukkan apresiasi komunitas terhadap alternatif layanan email proprietary ini.

Paket [`preview-email`](https://github.com/forwardemail/preview-email) dari organisasi ini, dengan lebih dari 2,5 juta unduhan dalam dua bulan, telah menjadi alat penting bagi para pengembang yang bekerja dengan templat email. Dengan menyediakan cara mudah untuk melihat pratinjau email selama pengembangan, paket ini memecahkan masalah umum dalam membangun aplikasi yang mendukung email.

### Lad: Utilitas dan Alat Penting Koa {#lad-essential-koa-utilities-and-tools}

[Organisasi pemuda](https://github.com/ladjs) menyediakan kumpulan utilitas dan alat penting yang terutama berfokus pada peningkatan ekosistem kerangka kerja Koa. Paket-paket ini memecahkan tantangan umum dalam pengembangan web dan dirancang untuk bekerja sama dengan lancar sekaligus tetap bermanfaat secara independen.

#### koa-better-error-handler: Penanganan Kesalahan yang Lebih Baik untuk Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) menawarkan solusi penanganan kesalahan yang lebih baik untuk aplikasi Koa. Dengan lebih dari 50 bintang GitHub, paket ini memungkinkan `ctx.throw` menghasilkan pesan kesalahan yang mudah digunakan sekaligus mengatasi beberapa keterbatasan penangan kesalahan bawaan Koa:

* Mendeteksi dan menangani kesalahan DNS Node.js, kesalahan Mongoose, dan kesalahan Redis dengan tepat
* Menggunakan [Ledakan](https://github.com/hapijs/boom) untuk membuat respons kesalahan yang konsisten dan terformat dengan baik
* Mempertahankan header (tidak seperti pengendali bawaan Koa)
* Mempertahankan kode status yang sesuai, alih-alih menggunakan nilai default 500
* Mendukung pesan flash dan preservasi sesi
* Menyediakan daftar kesalahan HTML untuk kesalahan validasi
* Mendukung berbagai jenis respons (HTML, JSON, dan teks biasa)

Paket ini sangat berharga bila digunakan bersama [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) untuk manajemen kesalahan komprehensif dalam aplikasi Koa.

Paspor ####: Autentikasi untuk Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) memperluas middleware autentikasi Passport.js yang populer dengan penyempurnaan khusus untuk aplikasi web modern. Paket ini mendukung beberapa strategi autentikasi bawaan:

* Autentikasi lokal dengan email
* Masuk dengan Apple
* Autentikasi GitHub
* Autentikasi Google
* Autentikasi kata sandi sekali pakai (OTP)

Paket ini sangat mudah dikustomisasi, memungkinkan pengembang untuk menyesuaikan nama dan frasa kolom agar sesuai dengan kebutuhan aplikasi mereka. Paket ini dirancang untuk terintegrasi secara mulus dengan Mongoose untuk manajemen pengguna, menjadikannya solusi ideal untuk aplikasi berbasis Koa yang membutuhkan autentikasi yang kuat.

#### graceful: Penutupan Aplikasi yang Elegan {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) memecahkan tantangan penting dalam mematikan aplikasi Node.js secara elegan. Dengan lebih dari 70 bintang GitHub, paket ini memastikan aplikasi Anda dapat dimatikan dengan bersih tanpa kehilangan data atau koneksi yang macet. Fitur-fitur utamanya meliputi:

* Dukungan untuk menutup server HTTP secara elegan (Express/Koa/Fastify)
* Penutupan koneksi basis data yang bersih (MongoDB/Mongoose)
* Penutupan klien Redis yang tepat
* Penanganan penjadwal pekerjaan Bree
* Dukungan untuk pengendali penutupan kustom
* Pengaturan batas waktu yang dapat dikonfigurasi
* Integrasi dengan sistem pencatatan

Paket ini penting untuk aplikasi produksi di mana penghentian tak terduga dapat menyebabkan hilangnya atau kerusakan data. Dengan menerapkan prosedur penghentian yang tepat, `@ladjs/graceful` membantu memastikan keandalan dan stabilitas aplikasi Anda.

### Upptime: Pemantauan Waktu Aktif Sumber Terbuka {#upptime-open-source-uptime-monitoring}

[Organisasi Upptime](https://github.com/upptime) mencerminkan komitmen kami terhadap pemantauan sumber terbuka yang transparan. Repositori utama [`upptime`](https://github.com/upptime/upptime) memiliki lebih dari 13.000 bintang GitHub, menjadikannya salah satu proyek terpopuler yang kami ikuti. Upptime menyediakan monitor uptime dan halaman status berbasis GitHub yang beroperasi sepenuhnya tanpa server.

Kami menggunakan Upptime untuk halaman status kami sendiri di <https://status.forwardemail.net> dengan kode sumber tersedia di <https://github.com/forwardemail/status.forwardemail.net>.

Yang membuat Upptime istimewa adalah arsitekturnya:

* **100% Sumber Terbuka**: Setiap komponen sepenuhnya sumber terbuka dan dapat dikustomisasi.
* **Didukung oleh GitHub**: Memanfaatkan GitHub Actions, Issues, dan Pages untuk solusi pemantauan tanpa server.
* **Tidak Memerlukan Server**: Tidak seperti alat pemantauan tradisional, Upptime tidak mengharuskan Anda menjalankan atau memelihara server.
* **Halaman Status Otomatis**: Menghasilkan halaman status yang menarik yang dapat dihosting di GitHub Pages.
* **Notifikasi yang Canggih**: Terintegrasi dengan berbagai saluran notifikasi termasuk email, SMS, dan Slack.

Untuk meningkatkan pengalaman pengguna, kami telah mengintegrasikan [@octokit/inti](https://github.com/octokit/core.js/) ke dalam basis kode forwardemail.net untuk menampilkan pembaruan status dan insiden secara real-time langsung di situs web kami. Integrasi ini memberikan transparansi yang jelas kepada pengguna kami jika terjadi masalah di seluruh tumpukan kami (Situs Web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, dll.) dengan notifikasi toast instan, perubahan ikon lencana, warna peringatan, dan banyak lagi.

Pustaka @octokit/core memungkinkan kami mengambil data real-time dari repositori GitHub Upptime kami, memprosesnya, dan menampilkannya dengan cara yang mudah digunakan. Ketika suatu layanan mengalami gangguan atau penurunan kinerja, pengguna akan segera diberi tahu melalui indikator visual tanpa harus meninggalkan aplikasi utama. Integrasi yang mulus ini memastikan bahwa pengguna kami selalu memiliki informasi terkini tentang status sistem kami, sehingga meningkatkan transparansi dan kepercayaan.

Upptime telah diadopsi oleh ratusan organisasi yang mencari cara yang transparan dan andal untuk memantau layanan mereka dan mengomunikasikan statusnya kepada pengguna. Keberhasilan proyek ini menunjukkan kekuatan membangun perangkat yang memanfaatkan infrastruktur yang ada (dalam hal ini, GitHub) untuk memecahkan masalah umum dengan cara baru.

## Kontribusi Kami terhadap Ekosistem Email Terusan {#our-contributions-to-the-forward-email-ecosystem}

Meskipun paket sumber terbuka kami digunakan oleh para pengembang di seluruh dunia, paket-paket ini juga menjadi fondasi layanan Forward Email kami sendiri. Peran ganda ini—sebagai pencipta sekaligus pengguna alat-alat ini—memberi kami perspektif unik tentang penerapannya di dunia nyata dan mendorong peningkatan berkelanjutan.

### Dari Paket ke Produksi {#from-packages-to-production}

Perjalanan dari paket individual ke sistem produksi yang kohesif melibatkan integrasi dan perluasan yang cermat. Untuk Forward Email, proses ini meliputi:

* **Ekstensi Kustom**: Mengembangkan ekstensi khusus Forward Email ke paket sumber terbuka kami yang memenuhi kebutuhan unik kami.
* **Pola Integrasi**: Mengembangkan pola interaksi paket-paket ini dalam lingkungan produksi.
* **Optimalisasi Performa**: Mengidentifikasi dan mengatasi hambatan performa yang hanya muncul dalam skala besar.
* **Penguatan Keamanan**: Menambahkan lapisan keamanan tambahan khusus untuk penanganan email dan perlindungan data pengguna.

Pekerjaan ini mewakili ribuan jam pengembangan di luar paket inti itu sendiri, yang menghasilkan layanan email tangguh dan aman yang memanfaatkan kontribusi sumber terbuka terbaik kami.

### Lingkaran Umpan Balik {#the-feedback-loop}

Mungkin aspek paling berharga dari penggunaan paket kami sendiri dalam produksi adalah umpan balik yang dihasilkannya. Ketika kami menemukan keterbatasan atau kasus khusus di Forward Email, kami tidak hanya memperbaikinya secara lokal—kami juga meningkatkan paket-paket yang mendasarinya, yang menguntungkan layanan kami dan komunitas yang lebih luas.

Pendekatan ini telah menghasilkan banyak perbaikan:

* **Penutupan Anggun Bree**: Kebutuhan Forward Email akan penerapan tanpa waktu henti menghasilkan peningkatan kemampuan penutupan anggun di Bree.
* **Pengenalan Pola Spam Scanner**: Pola spam dunia nyata yang ditemukan di Forward Email telah menjadi dasar bagi algoritma deteksi Spam Scanner.
* **Optimalisasi Kinerja Cabin**: Pencatatan log volume tinggi dalam produksi mengungkapkan peluang pengoptimalan di Cabin yang menguntungkan semua pengguna.

Dengan mempertahankan siklus baik antara pekerjaan sumber terbuka dan layanan produksi, kami memastikan paket kami tetap berupa solusi praktis dan teruji, bukan sekadar implementasi teoretis.

## Prinsip Inti Email Teruskan: Fondasi untuk Keunggulan {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email dirancang berdasarkan serangkaian prinsip inti yang memandu semua keputusan pengembangan kami. Prinsip-prinsip ini, yang dijelaskan secara rinci pada [situs web](/blog/docs/best-quantum-safe-encrypted-email-service#principles), memastikan layanan kami tetap ramah pengembang, aman, dan berfokus pada privasi pengguna.

### Selalu Ramah Pengembang, Berfokus pada Keamanan, dan Transparan {#always-developer-friendly-security-focused-and-transparent}

Prinsip utama kami adalah menciptakan perangkat lunak yang ramah pengembang dengan tetap menjaga standar keamanan dan privasi tertinggi. Kami percaya bahwa keunggulan teknis tidak boleh mengorbankan kegunaan, dan bahwa transparansi membangun kepercayaan di komunitas kami.

Prinsip ini tercermin dalam dokumentasi kami yang terperinci, pesan kesalahan yang jelas, dan komunikasi yang terbuka mengenai keberhasilan maupun tantangan. Dengan menjadikan seluruh basis kode kami sumber terbuka, kami mengundang pengawasan dan kolaborasi, yang memperkuat perangkat lunak kami dan ekosistem yang lebih luas.

### Kepatuhan terhadap Prinsip Pengembangan Perangkat Lunak yang Telah Teruji oleh Waktu {#adherence-to-time-tested-software-development-principles}

Kami mengikuti beberapa prinsip pengembangan perangkat lunak yang mapan dan telah terbukti nilainya selama beberapa dekade:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Memisahkan masalah melalui pola Model-View-Controller
* **[Filsafat Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Membuat komponen modular yang melakukan satu hal dengan baik
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Menjaga Kesederhanaan dan Kejelasan
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Jangan Mengulang-ulang, dorong penggunaan kembali kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Anda Tidak Akan Membutuhkannya, hindari pengoptimalan prematur
* **[Dua Belas Faktor](https://12factor.net/)**: Mengikuti praktik terbaik untuk membangun aplikasi modern yang skalabel
* **[Pisau cukur Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Memilih solusi paling sederhana yang memenuhi persyaratan
* **[Makanan anjing](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Menggunakan produk kami sendiri secara ekstensif

Prinsip-prinsip ini bukan sekadar konsep teoretis—prinsip-prinsip ini tertanam dalam praktik pengembangan kami sehari-hari. Sebagai contoh, kepatuhan kami terhadap filosofi Unix terlihat jelas dalam cara kami menyusun paket-paket npm: modul-modul kecil dan terfokus yang dapat disusun bersama untuk memecahkan masalah-masalah kompleks.

### Menargetkan Pengembang yang Berkemah dan Bermodalkan Bootstrap {#targeting-the-scrappy-bootstrapped-developer}

Kami secara khusus menargetkan pengembang yang ulet, bootstrap, dan [ramen-menguntungkan](https://www.paulgraham.com/ramenprofitable.html). Fokus ini membentuk segalanya, mulai dari model penetapan harga hingga keputusan teknis kami. Kami memahami tantangan membangun produk dengan sumber daya terbatas karena kami pernah mengalaminya sendiri.

Prinsip ini sangat penting dalam pendekatan kami terhadap sumber terbuka. Kami menciptakan dan memelihara paket-paket yang memecahkan masalah nyata bagi para pengembang tanpa anggaran perusahaan, menjadikan perangkat-perangkat canggih ini dapat diakses oleh semua orang, terlepas dari sumber daya mereka.

### Prinsip dalam Praktik: Basis Kode Email Terusan {#principles-in-practice-the-forward-email-codebase}

Prinsip-prinsip ini terlihat jelas dalam basis kode Forward Email. Berkas package.json kami menampilkan pilihan dependensi yang cermat, masing-masing dipilih agar selaras dengan nilai-nilai inti kami:

* Paket yang berfokus pada keamanan seperti `mailauth` untuk autentikasi email
* Alat yang ramah pengembang seperti `preview-email` untuk memudahkan debugging
* Komponen modular seperti berbagai utilitas `p-*` dari Sindre Sorhus

Dengan mengikuti prinsip-prinsip ini secara konsisten dari waktu ke waktu, kami telah membangun layanan yang dapat dipercaya oleh pengembang untuk infrastruktur email mereka—aman, andal, dan selaras dengan nilai-nilai komunitas sumber terbuka.

### Privasi berdasarkan Desain {#privacy-by-design}

Privasi bukanlah renungan atau fitur pemasaran bagi Forward Email—ini adalah prinsip desain fundamental yang mendasari setiap aspek layanan dan kode kami:

* **Enkripsi Tanpa Akses**: Kami telah menerapkan sistem yang secara teknis membuat kami mustahil untuk membaca email pengguna.
* **Pengumpulan Data Minimal**: Kami hanya mengumpulkan data yang diperlukan untuk menyediakan layanan kami, tidak lebih.
* **Kebijakan Transparan**: Kebijakan privasi kami ditulis dalam bahasa yang jelas dan mudah dipahami tanpa jargon hukum.
* **Verifikasi Sumber Terbuka**: Basis kode sumber terbuka kami memungkinkan peneliti keamanan untuk memverifikasi klaim privasi kami.

Komitmen ini berlaku juga untuk paket sumber terbuka kami, yang dirancang dengan praktik terbaik keamanan dan privasi yang tertanam sejak awal.

### Sumber Terbuka Berkelanjutan {#sustainable-open-source}

Kami percaya bahwa perangkat lunak sumber terbuka membutuhkan model yang berkelanjutan agar dapat berkembang dalam jangka panjang. Pendekatan kami meliputi:

* **Dukungan Komersial**: Menawarkan dukungan dan layanan premium seputar perangkat sumber terbuka kami.
* **Lisensi Seimbang**: Menggunakan lisensi yang melindungi kebebasan pengguna dan keberlanjutan proyek.
* **Keterlibatan Komunitas**: Berinteraksi secara aktif dengan kontributor untuk membangun komunitas yang suportif.
* **Peta Jalan Transparan**: Membagikan rencana pengembangan kami agar pengguna dapat merencanakannya dengan tepat.

Dengan berfokus pada keberlanjutan, kami memastikan kontribusi sumber terbuka kami dapat terus tumbuh dan berkembang seiring waktu alih-alih terabaikan.

## Angka Tidak Berbohong: Statistik Unduhan npm Kami yang Menakjubkan {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Ketika kita membahas dampak perangkat lunak sumber terbuka, statistik unduhan memberikan ukuran nyata adopsi dan kepercayaan. Banyak paket yang kami bantu kelola telah mencapai skala yang jarang dicapai oleh proyek sumber terbuka lainnya, dengan total unduhan mencapai miliaran.

![Paket npm teratas berdasarkan unduhan](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Meskipun kami bangga dapat membantu mengelola beberapa paket yang paling banyak diunduh di ekosistem JavaScript, kami ingin mengakui bahwa banyak dari paket ini awalnya dibuat oleh pengembang berbakat lainnya. Paket seperti superagent dan supertest awalnya dibuat oleh TJ Holowaychuk, yang kontribusinya yang produktif terhadap sumber terbuka telah berperan penting dalam membentuk ekosistem Node.js.

### Pandangan Luas tentang Dampak Kami {#a-birds-eye-view-of-our-impact}

Hanya dalam periode dua bulan dari Februari hingga Maret 2025, paket-paket teratas yang kami kontribusikan dan bantu pertahankan mencatat angka unduhan yang luar biasa:

* **[agen super](https://www.npmjs.com/package/superagent)**: 84.575.829 unduhan\[^7] (aslinya dibuat oleh TJ Holowaychuk)
* **[tes super](https://www.npmjs.com/package/supertest)**: 76.432.591 unduhan\[^8] (aslinya dibuat oleh TJ Holowaychuk)
* **[Juga](https://www.npmjs.com/package/koa)**: 28.539.295 unduhan\[^34] (aslinya dibuat oleh TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 unduhan\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 unduhan\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 unduhan\[^37]
* **[pratinjau-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 unduhan\[^9]
* **[kabin](https://www.npmjs.com/package/cabin)**: 1.800.000 unduhan\[^10]
* **[@breejs/nanti](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 unduhan\[^38]
* **[templat email](https://www.npmjs.com/package/email-templates)**: 1.128.139 unduhan\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 unduhan\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 unduhan\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 unduhan\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 unduhan\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 unduhan\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 unduhan\[^30]

> \[!NOTE]
> Beberapa paket lain yang kami bantu kelola tetapi tidak kami buat memiliki jumlah unduhan yang lebih tinggi, termasuk `form-data` (738 juta+ unduhan), `toidentifier` (309 juta+ unduhan), `stackframe` (116 juta+ unduhan), dan `error-stack-parser` (113 juta+ unduhan). Kami merasa terhormat dapat berkontribusi pada paket-paket ini dengan tetap menghormati karya para pembuat aslinya.

Ini bukan sekadar angka yang mengesankan—ini menunjukkan para pengembang sungguhan yang memecahkan masalah nyata dengan kode yang kami bantu kelola. Setiap unduhan merupakan contoh nyata di mana paket-paket ini telah membantu seseorang membangun sesuatu yang bermakna, mulai dari proyek hobi hingga aplikasi perusahaan yang digunakan oleh jutaan orang.

![Distribusi Kategori Paket](/img/art/category_pie_chart.svg)

### Dampak Harian dalam Skala Besar {#daily-impact-at-scale}

Pola unduhan harian menunjukkan penggunaan yang konsisten dan bervolume tinggi, dengan puncaknya mencapai jutaan unduhan per hari\[^13]. Konsistensi ini menunjukkan stabilitas dan keandalan paket-paket ini—para pengembang tidak hanya mencobanya; mereka mengintegrasikannya ke dalam alur kerja inti mereka dan mengandalkannya setiap hari.

Pola unduhan mingguan menunjukkan angka yang bahkan lebih mengesankan, secara konsisten berkisar di angka puluhan juta unduhan per minggu\[^14]. Ini menunjukkan jejak yang sangat besar dalam ekosistem JavaScript, dengan paket-paket ini berjalan di lingkungan produksi di seluruh dunia.

### Melampaui Angka Mentah {#beyond-the-raw-numbers}

Meskipun statistik unduhannya sendiri mengesankan, statistik tersebut mencerminkan kisah yang lebih mendalam tentang kepercayaan yang diberikan komunitas terhadap paket-paket ini. Mempertahankan paket pada skala ini membutuhkan komitmen yang teguh untuk:

* **Kompatibilitas Mundur**: Perubahan harus dipertimbangkan dengan cermat agar tidak merusak implementasi yang ada.
* **Keamanan**: Dengan jutaan aplikasi yang bergantung pada paket-paket ini, kerentanan keamanan dapat berdampak luas.
* **Kinerja**: Pada skala ini, peningkatan kinerja sekecil apa pun dapat memberikan manfaat agregat yang signifikan.
* **Dokumentasi**: Dokumentasi yang jelas dan komprehensif sangat penting untuk paket yang digunakan oleh pengembang dari semua tingkat pengalaman.

Pertumbuhan jumlah unduhan yang konsisten dari waktu ke waktu mencerminkan keberhasilan dalam memenuhi komitmen ini, membangun kepercayaan dengan komunitas pengembang melalui paket yang andal dan terawat dengan baik.

## Mendukung Ekosistem: Sponsor Sumber Terbuka Kami {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Keberlanjutan sumber terbuka bukan hanya tentang berkontribusi kode—tetapi juga tentang mendukung pengembang yang memelihara infrastruktur penting.

Selain kontribusi langsung kami terhadap ekosistem JavaScript, kami bangga mensponsori kontributor Node.js terkemuka yang karyanya membentuk fondasi banyak aplikasi modern. Sponsor kami meliputi:

### Andris Reinman: Pelopor Infrastruktur Email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) adalah pencipta [Nodemailer](https://github.com/nodemailer/nodemailer), pustaka pengiriman email terpopuler untuk Node.js dengan lebih dari 14 juta unduhan mingguan. Karyanya juga mencakup komponen infrastruktur email penting lainnya seperti [Server SMTP](https://github.com/nodemailer/smtp-server), [Pengurai Surat](https://github.com/nodemailer/mailparser), dan [Bebek Liar](https://github.com/nodemailer/wildduck).

Sponsorship kami membantu memastikan pemeliharaan dan pengembangan berkelanjutan atas alat-alat penting yang mendukung komunikasi email untuk aplikasi Node.js yang tak terhitung jumlahnya, termasuk layanan Forward Email kami sendiri.

### Sindre Sorhus: Dalang Paket Utilitas {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) adalah salah satu kontributor sumber terbuka paling produktif di ekosistem JavaScript, dengan lebih dari 1.000 paket npm atas namanya. Utilitasnya seperti [peta-p](https://github.com/sindresorhus/p-map), [p-cobaan ulang](https://github.com/sindresorhus/p-retry), dan [adalah aliran](https://github.com/sindresorhus/is-stream) merupakan komponen dasar yang digunakan di seluruh ekosistem Node.js.

Dengan mensponsori karya Sindre, kami membantu mendukung pengembangan utilitas penting ini yang membuat pengembangan JavaScript lebih efisien dan andal.

Sponsorship ini mencerminkan komitmen kami terhadap ekosistem sumber terbuka yang lebih luas. Kami menyadari bahwa kesuksesan kami dibangun di atas fondasi yang diletakkan oleh para kontributor ini dan lainnya, dan kami berkomitmen untuk memastikan keberlanjutan seluruh ekosistem.

## Mengungkap Kerentanan Keamanan dalam Ekosistem JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Komitmen kami terhadap sumber terbuka melampaui pengembangan fitur, termasuk mengidentifikasi dan mengatasi kerentanan keamanan yang dapat memengaruhi jutaan pengembang. Beberapa kontribusi terpenting kami terhadap ekosistem JavaScript berasal dari bidang keamanan.

### Penyelamatan Koa-Router {#the-koa-router-rescue}

Pada Februari 2019, Nick mengidentifikasi masalah kritis dalam pemeliharaan paket koa-router yang populer. Karena berkode [dilaporkan di Hacker News](https://news.ycombinator.com/item?id=19156707), paket tersebut telah ditinggalkan oleh pengelola aslinya, sehingga kerentanan keamanan tidak teratasi dan komunitas tidak mendapatkan pembaruan.

> \[!WARNING]
> Paket terbengkalai dengan kerentanan keamanan menimbulkan risiko signifikan bagi seluruh ekosistem, terutama jika diunduh jutaan kali setiap minggu.

Sebagai tanggapan, Nick menciptakan [@koa/router](https://github.com/koajs/router) dan membantu memberi tahu komunitas tentang situasi tersebut. Ia telah memelihara paket penting ini sejak saat itu, memastikan bahwa pengguna Koa memiliki solusi perutean yang aman dan terawat dengan baik.

### Mengatasi Kerentanan ReDoS {#addressing-redos-vulnerabilities}

Pada tahun 2020, Nick mengidentifikasi dan menangani kerentanan kritis [Penolakan Layanan Ekspresi Reguler (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) dalam paket `url-regex` yang banyak digunakan. Kerentanan ini ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) dapat memungkinkan penyerang melakukan denial of service (DNS) dengan memberikan input yang dirancang khusus yang menyebabkan backtracking yang fatal dalam ekspresi reguler.

Alih-alih hanya menambal paket yang sudah ada, Nick menciptakan [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), sebuah implementasi yang sepenuhnya ditulis ulang yang mengatasi kerentanan tersebut sambil tetap mempertahankan kompatibilitas dengan API asli. Ia juga menerbitkan [postingan blog yang komprehensif](/blog/docs/url-regex-javascript-node-js) yang menjelaskan kerentanan tersebut dan cara mengatasinya.

Karya ini menunjukkan pendekatan kami terhadap keamanan: tidak sekadar memperbaiki masalah tetapi juga mendidik masyarakat dan menyediakan alternatif kuat yang mencegah masalah serupa di masa mendatang.

### Mendukung Keamanan Node.js dan Chromium {#advocating-for-nodejs-and-chromium-security}

Nick juga aktif mengadvokasi peningkatan keamanan di ekosistem yang lebih luas. Pada Agustus 2020, ia mengidentifikasi masalah keamanan yang signifikan di Node.js terkait penanganan header HTTP, yang dilaporkan dalam [Daftar](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Masalah ini, yang bermula dari patch di Chromium, berpotensi memungkinkan penyerang untuk menerobos langkah-langkah keamanan. Advokasi Nick membantu memastikan masalah ini ditangani dengan segera, melindungi jutaan aplikasi Node.js dari potensi eksploitasi.

### Mengamankan Infrastruktur npm {#securing-npm-infrastructure}

Di akhir bulan yang sama, Nick mengidentifikasi masalah keamanan kritis lainnya, kali ini pada infrastruktur email npm. Sebagaimana dilaporkan dalam [Daftar](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm tidak mengimplementasikan protokol autentikasi email DMARC, SPF, dan DKIM dengan benar, sehingga berpotensi memungkinkan penyerang mengirimkan email phishing yang seolah-olah berasal dari npm.

Laporan Nick menghasilkan peningkatan dalam postur keamanan email npm, melindungi jutaan pengembang yang mengandalkan npm untuk manajemen paket dari potensi serangan phishing.

## Kontribusi Kami terhadap Ekosistem Email Terusan {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email dibangun di atas beberapa proyek sumber terbuka penting, termasuk Nodemailer, WildDuck, dan MailAuth. Tim kami telah memberikan kontribusi signifikan pada proyek-proyek ini, membantu mengidentifikasi dan memperbaiki masalah mendasar yang memengaruhi pengiriman dan keamanan email.

### Meningkatkan Fungsionalitas Inti Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) adalah tulang punggung pengiriman email di Node.js, dan kontribusi kami telah membantu menjadikannya lebih tangguh:

* **Peningkatan Server SMTP**: Kami telah memperbaiki bug penguraian, masalah penanganan aliran, dan masalah konfigurasi TLS di komponen server SMTP\[^16]\[^17].
* **Peningkatan Pengurai Email**: Kami telah mengatasi kesalahan dekode urutan karakter dan mengatasi masalah pengurai yang dapat menyebabkan kegagalan pemrosesan email\[^18]\[^19].

Kontribusi ini memastikan bahwa Nodemailer tetap menjadi fondasi yang andal untuk pemrosesan email dalam aplikasi Node.js, termasuk Forward Email.

### Memajukan Autentikasi Email dengan Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) menyediakan fungsionalitas autentikasi email yang penting, dan kontribusi kami telah meningkatkan kemampuannya secara signifikan:

* **Peningkatan Verifikasi DKIM**: Kami menemukan dan melaporkan bahwa X/Twitter memiliki masalah cache DNS yang menyebabkan kegagalan DKIM untuk pesan keluar mereka, dan melaporkannya di Hacker One\[^20].
* **Peningkatan DMARC dan ARC**: Kami telah memperbaiki masalah dengan verifikasi DMARC dan ARC yang dapat menyebabkan hasil autentikasi yang salah\[^21]\[^22].
* **Optimalisasi Performa**: Kami telah berkontribusi pada optimasi yang meningkatkan performa proses autentikasi email\[^23]\[^24]\[^25]\[^26].

Peningkatan ini membantu memastikan autentikasi email akurat dan andal, melindungi pengguna dari serangan phishing dan spoofing.

### Peningkatan Waktu Aktif Kunci {#key-upptime-enhancements}

Kontribusi kami untuk Upptime meliputi:

* **Pemantauan Sertifikat SSL**: Kami menambahkan fungsionalitas untuk memantau kedaluwarsa sertifikat SSL, mencegah waktu henti tak terduga akibat sertifikat yang kedaluwarsa\[^27].
* **Dukungan Beberapa Nomor SMS**: Kami menerapkan dukungan untuk memberi tahu beberapa anggota tim melalui SMS ketika terjadi insiden, sehingga meningkatkan waktu respons\[^28].
* **Perbaikan Pemeriksaan IPv6**: Kami memperbaiki masalah dengan pemeriksaan konektivitas IPv6, memastikan pemantauan yang lebih akurat di lingkungan jaringan modern\[^29].
* **Dukungan Mode Gelap/Terang**: Kami menambahkan dukungan tema untuk meningkatkan pengalaman pengguna halaman status\[^31].
* **Dukungan TCP-Ping yang Lebih Baik**: Kami meningkatkan fungsionalitas ping TCP untuk menyediakan pengujian koneksi yang lebih andal\[^32].

Peningkatan ini tidak hanya memberikan manfaat pada pemantauan status Forward Email tetapi juga tersedia bagi seluruh komunitas pengguna Upptime, yang menunjukkan komitmen kami untuk meningkatkan alat yang kami andalkan.

## Perekat yang Menyatukan Semuanya: Kode Kustom dalam Skala Besar {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Meskipun paket-paket npm dan kontribusi kami terhadap proyek-proyek yang sudah ada cukup signifikan, kode khusus yang mengintegrasikan komponen-komponen inilah yang benar-benar menunjukkan keahlian teknis kami. Basis kode Forward Email mewakili upaya pengembangan selama satu dekade, dimulai sejak tahun 2017 ketika proyek ini dimulai sebagai [penerusan email gratis](https://github.com/forwardemail/free-email-forwarding) sebelum digabungkan ke dalam monorepo.

### Upaya Pengembangan Besar-besaran {#a-massive-development-effort}

Skala kode integrasi khusus ini mengesankan:

**Total Kontribusi**: Lebih dari 3.217 komitmen
* **Ukuran Basis Kode**: Lebih dari 421.545 baris kode untuk berkas JavaScript, Pug, CSS, dan JSON\[^33]

Ini mewakili ribuan jam kerja pengembangan, sesi debugging, dan optimasi performa. Inilah "resep rahasia" yang mengubah setiap paket menjadi layanan yang kohesif dan andal yang digunakan oleh ribuan pelanggan setiap hari.

### Integrasi Ketergantungan Inti {#core-dependencies-integration}

Basis kode Forward Email mengintegrasikan sejumlah dependensi menjadi satu kesatuan yang utuh:

* **Pemrosesan Email**: Mengintegrasikan Nodemailer untuk pengiriman, Server SMTP untuk penerimaan, dan Mailparser untuk penguraian
* **Autentikasi**: Menggunakan Mailauth untuk verifikasi DKIM, SPF, DMARC, dan ARC
* **Resolusi DNS**: Memanfaatkan Tangerine untuk DNS-over-HTTPS dengan caching global
* **Koneksi MX**: Memanfaatkan mx-connect dengan integrasi Tangerine untuk koneksi server email yang andal
* **Penjadwalan Pekerjaan**: Menggunakan Bree untuk pemrosesan tugas latar belakang yang andal dengan utas pekerja
* **Pembuatan Templat**: Menggunakan templat email untuk menggunakan kembali stylesheet dari situs web dalam komunikasi pelanggan
* **Penyimpanan Email**: Mengimplementasikan kotak surat SQLite terenkripsi individual menggunakan better-sqlite3-multiple-cipher dengan enkripsi ChaCha20-Poly1305 untuk privasi kuantum, memastikan isolasi penuh antar pengguna dan hanya pengguna yang memiliki akses ke kotak surat mereka

Setiap integrasi ini memerlukan pertimbangan cermat terhadap kasus-kasus tepi, implikasi kinerja, dan masalah keamanan. Hasilnya adalah sistem tangguh yang menangani jutaan transaksi email dengan andal. Implementasi SQLite kami juga memanfaatkan msgpackr untuk serialisasi biner yang efisien dan WebSockets (melalui ws) untuk pembaruan status secara real-time di seluruh infrastruktur kami.

### Infrastruktur DNS dengan Tangerine dan mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Komponen penting infrastruktur Forward Email adalah sistem resolusi DNS kami, yang dibangun berdasarkan dua paket utama:

* **[Jeruk keprok](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Implementasi DNS-over-HTTPS Node.js kami menyediakan pengganti langsung untuk resolver DNS standar, dengan percobaan ulang bawaan, batas waktu, rotasi server cerdas, dan dukungan caching.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Paket ini membuat koneksi TCP ke server MX, mengambil domain target atau alamat email, menyelesaikan server MX yang sesuai, dan menghubungkannya berdasarkan urutan prioritas.

Kami telah mengintegrasikan Tangerine dengan mx-connect melalui [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), memastikan DNS lapisan aplikasi melalui permintaan HTTP di seluruh Forward Email. Hal ini menyediakan caching global untuk DNS dalam skala besar dengan konsistensi 1:1 di semua wilayah, aplikasi, atau proses—penting untuk pengiriman email yang andal dalam sistem terdistribusi.

## Dampak Perusahaan: Dari Solusi Open Source ke Solusi Misi Kritis {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Puncak dari perjalanan kami selama satu dekade dalam pengembangan sumber terbuka telah memungkinkan Forward Email untuk melayani tidak hanya pengembang individu tetapi juga perusahaan besar dan institusi pendidikan yang menjadi tulang punggung gerakan sumber terbuka itu sendiri.

### Studi Kasus dalam Infrastruktur Email Misi Kritis {#case-studies-in-mission-critical-email-infrastructure}

Komitmen kami terhadap keandalan, privasi, dan prinsip-prinsip sumber terbuka telah menjadikan Forward Email pilihan tepercaya bagi organisasi dengan persyaratan email yang menuntut:

* **Institusi Pendidikan**: Sebagaimana dijelaskan dalam [studi kasus penerusan email alumni] kami](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), universitas-universitas besar mengandalkan infrastruktur kami untuk memelihara koneksi seumur hidup dengan ratusan ribu alumni melalui layanan penerusan email yang andal.

* **Solusi Linux Perusahaan**: [Studi kasus perusahaan email Ubuntu Canonical](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) menunjukkan bagaimana pendekatan sumber terbuka kami selaras sempurna dengan kebutuhan penyedia Linux perusahaan, menawarkan mereka transparansi dan kontrol yang mereka butuhkan.

* **Yayasan Sumber Terbuka**: Mungkin yang paling memvalidasi adalah kemitraan kami dengan Linux Foundation, seperti yang didokumentasikan dalam [Studi kasus perusahaan email Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), tempat layanan kami memberdayakan komunikasi untuk organisasi yang mengelola pengembangan Linux.

Ada simetri yang indah dalam bagaimana paket-paket sumber terbuka kami, yang dikelola dengan cermat selama bertahun-tahun, telah memungkinkan kami membangun layanan email yang kini mendukung komunitas dan organisasi yang memperjuangkan perangkat lunak sumber terbuka. Perjalanan penuh ini—mulai dari berkontribusi pada paket-paket individual hingga memberdayakan infrastruktur email kelas perusahaan bagi para pemimpin sumber terbuka—mewakili validasi tertinggi dari pendekatan kami terhadap pengembangan perangkat lunak.

## Satu Dekade Open Source: Menatap Masa Depan {#a-decade-of-open-source-looking-forward}

Saat kami menengok kembali satu dekade kontribusi sumber terbuka dan menatap sepuluh tahun berikutnya, kami dipenuhi rasa syukur kepada komunitas yang telah mendukung pekerjaan kami dan kegembiraan atas apa yang akan terjadi.

Perjalanan kami, dari kontributor paket individual menjadi pengelola infrastruktur email komprehensif yang digunakan oleh perusahaan-perusahaan besar dan yayasan sumber terbuka, sungguh luar biasa. Hal ini membuktikan kekuatan pengembangan sumber terbuka dan dampak perangkat lunak yang bijaksana dan terpelihara dengan baik terhadap ekosistem yang lebih luas.

Dalam beberapa tahun mendatang, kami berkomitmen untuk:

* **Terus memelihara dan meningkatkan paket-paket kami yang sudah ada**, memastikan paket-paket tersebut tetap andal bagi para pengembang di seluruh dunia.
* **Memperluas kontribusi kami pada proyek-proyek infrastruktur penting**, khususnya di bidang email dan keamanan.
* **Meningkatkan kemampuan Forward Email** dengan tetap menjaga komitmen kami terhadap privasi, keamanan, dan transparansi.
* **Mendukung generasi kontributor sumber terbuka berikutnya** melalui bimbingan, sponsor, dan keterlibatan komunitas.

Kami percaya bahwa masa depan pengembangan perangkat lunak bersifat terbuka, kolaboratif, dan dibangun di atas fondasi kepercayaan. Dengan terus berkontribusi pada paket-paket berkualitas tinggi yang berfokus pada keamanan bagi ekosistem JavaScript, kami berharap dapat berperan kecil dalam membangun masa depan tersebut.

Terima kasih kepada semua orang yang telah menggunakan paket kami, berkontribusi pada proyek kami, melaporkan masalah, atau sekadar menyebarkan informasi tentang pekerjaan kami. Dukungan Anda telah memungkinkan dekade penuh dampak ini, dan kami sangat antusias untuk melihat apa yang dapat kita capai bersama dalam sepuluh tahun ke depan.

\[^1]: Statistik unduhan npm untuk cabin, April 2025
\[^2]: Statistik unduhan npm untuk bson-objectid, Februari-Maret 2025
\[^3]: Statistik unduhan npm untuk url-regex-safe, April 2025
\[^4]: Jumlah bintang GitHub untuk forwardemail/forwardemail.net per April 2025
\[^5]: Statistik unduhan npm untuk preview-email, April 2025
\[^7]: Statistik unduhan npm untuk superagent, Februari-Maret 2025
\[^8]: Statistik unduhan npm untuk supertest, Februari-Maret 2025
\[^9]: Statistik unduhan npm untuk preview-email, Februari-Maret 2025
\[^10]: Statistik unduhan npm untuk cabin, Februari-Maret 2025
\[^11]: Statistik unduhan npm untuk url-regex-safe, Februari-Maret 2025
\[^12]: Statistik unduhan npm untuk spamscanner, Februari-Maret 2025
\[^13]: Pola unduhan harian dari statistik npm, April 2025
\[^14]: Pola unduhan mingguan dari statistik npm, April 2025
\[^15]: Statistik unduhan npm untuk nodemailer, April 2025
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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Berdasarkan masalah GitHub di repositori Upptime
\[^28]: Berdasarkan masalah GitHub di repositori Upptime
\[^29]: Berdasarkan masalah GitHub di repositori Upptime
\[^30]: Statistik unduhan npm untuk bree, Februari-Maret 2025
\[^31]: Berdasarkan permintaan tarik GitHub ke Upptime
\[^32]: Berdasarkan permintaan tarik GitHub ke Upptime
\[^34]: Statistik unduhan npm untuk koa, Februari-Maret 2025
\[^35]: Statistik unduhan npm untuk @koa/router, Februari-Maret 2025
\[^36]: Statistik unduhan npm untuk koa-router, Februari-Maret 2025
\[^37]: Statistik unduhan npm untuk url-regex, Februari-Maret 2025
\[^38]: Statistik unduhan npm untuk @breejs/later, Februari-Maret 2025
\[^39]: Statistik unduhan npm untuk email-templates, Februari-Maret 2025
\[^40]: Statistik unduhan npm untuk get-paths, Februari-Maret 2025
\[^41]: Statistik unduhan npm untuk dotenv-parse-variables, Februari-Maret 2025
\[^42]: Statistik unduhan npm untuk @koa/multer, Februari-Maret 2025