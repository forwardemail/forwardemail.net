# Satu Dekade Berdampak: Bagaimana Paket npm Kami Mencapai 1 Miliar Unduhan dan Membentuk JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img memuat="malas" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Kata pengantar](#foreword)
* [Para Pelopor yang Mempercayai Kami: Isaac Z. Schlueter dan Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Dari Penciptaan npm hingga Kepemimpinan Node.js](#from-npms-creation-to-nodejs-leadership)
* [Arsitek di Balik Kode: Perjalanan Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Komite Teknis Ekspres dan Kontribusi Inti](#express-technical-committee-and-core-contributions)
  * [Kontribusi Kerangka Kerja Koa](#koa-framework-contributions)
  * [Dari Kontributor Individu Menjadi Pemimpin Organisasi](#from-individual-contributor-to-organization-leader)
* [Organisasi GitHub Kami: Ekosistem Inovasi](#our-github-organizations-ecosystems-of-innovation)
  * [Kabin: Pencatatan Terstruktur untuk Aplikasi Modern](#cabin-structured-logging-for-modern-applications)
  * [Pemindai Spam: Memerangi Penyalahgunaan Email](#spam-scanner-fighting-email-abuse)
  * [Bree: Penjadwalan Pekerjaan Modern dengan Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Email Terusan: Infrastruktur Email Sumber Terbuka](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilitas dan Alat Penting Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Pemantauan Uptime Sumber Terbuka](#upptime-open-source-uptime-monitoring)
* [Kontribusi Kami terhadap Ekosistem Email Terusan](#our-contributions-to-the-forward-email-ecosystem)
  * [Dari Paket ke Produksi](#from-packages-to-production)
  * [Lingkaran Umpan Balik](#the-feedback-loop)
* [Prinsip Inti Email Terusan: Fondasi untuk Keunggulan](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Selalu Ramah Pengembang, Berfokus pada Keamanan, dan Transparan](#always-developer-friendly-security-focused-and-transparent)
  * [Kepatuhan terhadap Prinsip Pengembangan Perangkat Lunak yang Telah Teruji Waktu](#adherence-to-time-tested-software-development-principles)
  * [Menargetkan Pengembang yang Berkemah dan Bermodalkan Kemampuan Sendiri](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinsip dalam Praktik: Basis Kode Email Terusan](#principles-in-practice-the-forward-email-codebase)
  * [Privasi Berdasarkan Desain](#privacy-by-design)
  * [Open Source yang Berkelanjutan](#sustainable-open-source)
* [Angka Tidak Berbohong: Statistik Unduhan npm Kami yang Mengejutkan](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Pandangan Umum tentang Dampak Kami](#a-birds-eye-view-of-our-impact)
  * [Dampak Harian dalam Skala Besar](#daily-impact-at-scale)
  * [Melampaui Angka Mentah](#beyond-the-raw-numbers)
* [Mendukung Ekosistem: Sponsorship Open Source Kami](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pelopor Infrastruktur Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mastermind Paket Utilitas](#sindre-sorhus-utility-package-mastermind)
* [Mengungkap Kerentanan Keamanan dalam Ekosistem JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Penyelamatan Koa-Router](#the-koa-router-rescue)
  * [Mengatasi Kerentanan ReDoS](#addressing-redos-vulnerabilities)
  * [Mendukung Keamanan Node.js dan Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Mengamankan Infrastruktur NPM](#securing-npm-infrastructure)
* [Kontribusi Kami terhadap Ekosistem Email Terusan](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Meningkatkan Fungsionalitas Inti Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Memajukan Autentikasi Email dengan Mailauth](#advancing-email-authentication-with-mailauth)
  * [Peningkatan Upptime Utama](#key-upptime-enhancements)
* [Perekat yang Menyatukan Semuanya: Kode Kustom dalam Skala Besar](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Upaya Pembangunan Besar-besaran](#a-massive-development-effort)
  * [Integrasi Ketergantungan Inti](#core-dependencies-integration)
  * [Infrastruktur DNS dengan Tangerine dan mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Dampak Perusahaan: Dari Solusi Open Source ke Solusi Misi-Kritis](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Studi Kasus Infrastruktur Email Penting](#case-studies-in-mission-critical-email-infrastructure)
* [Satu Dekade Open Source: Menatap Masa Depan](#a-decade-of-open-source-looking-forward)

## Kata Pengantar {#foreword}

Di dunia [Bahasa Indonesia: JavaScript](https://en.wikipedia.org/wiki/JavaScript) dan [Node.js](https://en.wikipedia.org/wiki/Node.js), beberapa paket sangat penting—diunduh jutaan kali setiap hari dan mendukung aplikasi di seluruh dunia. Di balik perangkat ini terdapat para pengembang yang berfokus pada kualitas sumber terbuka. Hari ini, kami menunjukkan bagaimana tim kami membantu membangun dan memelihara paket npm yang telah menjadi bagian penting dari ekosistem JavaScript.

## Para Pelopor yang Mempercayai Kami: Isaac Z. Schlueter dan Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Kami bangga memiliki [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) sebagai pengguna. Isaac menciptakan [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) dan membantu membangun [Node.js](https://en.wikipedia.org/wiki/Node.js). Kepercayaannya pada Forward Email menunjukkan fokus kami pada kualitas dan keamanan. Isaac menggunakan Forward Email untuk beberapa domain, termasuk izs.me.

Pengaruh Isaac pada JavaScript sangat besar. Pada tahun 2009, ia termasuk orang pertama yang menyadari potensi Node.js, bekerja sama dengan [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), pencipta platform tersebut. Seperti yang dikatakan Isaac dalam [wawancara dengan majalah Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Di tengah komunitas kecil yang terdiri dari sekelompok orang yang mencoba mencari cara untuk mewujudkan JavaScript sisi server, Ryan Dahl memperkenalkan Node, yang jelas merupakan pendekatan yang tepat. Saya ikut serta dan terlibat aktif sekitar pertengahan tahun 2009."

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### Dari Penciptaan npm hingga Kepemimpinan Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac menciptakan npm pada September 2009, dengan versi pertama yang dapat digunakan dirilis pada awal 2010. Pengelola paket ini memenuhi kebutuhan utama Node.js, memungkinkan pengembang untuk berbagi dan menggunakan kembali kode dengan mudah. Menurut [Halaman Wikipedia Node.js](https://en.wikipedia.org/wiki/Node.js), "Pada Januari 2010, sebuah pengelola paket diperkenalkan untuk lingkungan Node.js yang disebut npm. Pengelola paket ini memungkinkan programmer untuk menerbitkan dan berbagi paket Node.js, beserta kode sumbernya, dan dirancang untuk menyederhanakan instalasi, pembaruan, dan penghapusan instalasi paket."

Ketika Ryan Dahl mengundurkan diri dari Node.js pada Januari 2012, Isaac mengambil alih sebagai pemimpin proyek. Sebagaimana dicatat pada [ringkasannya](https://izs.me/resume), ia "Memimpin pengembangan beberapa API inti Node.js fundamental, termasuk sistem modul CommonJS, API sistem berkas, dan aliran data" dan "Bertindak sebagai BDFL (Diktator Sejati Seumur Hidup) proyek ini selama 2 tahun, memastikan proses pembangunan yang terus meningkat kualitasnya dan andal untuk Node.js versi v0.6 hingga v0.10."

Isaac membimbing Node.js melalui periode pertumbuhan utama, menetapkan standar yang masih membentuk platform tersebut hingga saat ini. Ia kemudian mendirikan npm, Inc. pada tahun 2014 untuk mendukung registri npm, yang sebelumnya ia jalankan sendiri.

Kami berterima kasih kepada Isaac atas kontribusinya yang besar terhadap JavaScript dan terus menggunakan banyak paket yang ia buat. Karyanya telah mengubah cara kita membangun perangkat lunak dan cara jutaan pengembang berbagi kode di seluruh dunia.

## Arsitek di Balik Kode: Perjalanan Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Inti dari kesuksesan open source kami adalah Nick Baugh, pendiri dan pemilik Forward Email. Karyanya dalam JavaScript telah berlangsung hampir 20 tahun dan telah membentuk cara banyak pengembang membuat aplikasi. Perjalanan open source-nya menunjukkan keterampilan teknis dan kepemimpinan komunitas.

### Komite Teknis Ekspres dan Kontribusi Inti {#express-technical-committee-and-core-contributions}

Keahlian Nick dalam kerangka kerja web membuatnya mendapatkan tempat di [Komite Teknis Ekspres](https://expressjs.com/en/resources/community.html), tempat ia membantu mengembangkan salah satu kerangka kerja Node.js yang paling banyak digunakan. Nick kini terdaftar sebagai anggota tidak aktif di [Halaman komunitas ekspres](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

Sebagai anggota [Komite Teknis Ekspres](https://expressjs.com/en/resources/community.html), Nick menunjukkan perhatian besar terhadap detail dalam masalah seperti mengklarifikasi dokumentasi `req.originalUrl` dan memperbaiki masalah penanganan formulir multibagian.

### Kontribusi Kerangka Kerja Koa {#koa-framework-contributions}

Karya Nick dengan [Kerangka kerja Koa](https://github.com/koajs/koa)—alternatif modern dan ringan untuk Express yang juga diciptakan oleh TJ Holowaychuk—semakin menunjukkan komitmennya terhadap perangkat pengembangan web yang lebih baik. Kontribusinya di Koa mencakup masalah dan kode melalui permintaan tarik, penanganan kesalahan, manajemen tipe konten, dan peningkatan dokumentasi.

Karyanya di Express dan Koa memberinya pandangan unik tentang pengembangan web Node.js, membantu tim kami membuat paket yang berfungsi baik dengan berbagai ekosistem kerangka kerja.

### Dari Kontributor Individu menjadi Pemimpin Organisasi {#from-individual-contributor-to-organization-leader}

Berawal dari membantu proyek-proyek yang sudah ada, Nick mengembangkan dan memelihara ekosistem paket secara keseluruhan. Nick mendirikan beberapa organisasi GitHub—termasuk [Kabin](https://github.com/cabinjs), [Pemindai Spam](https://github.com/spamscanner), [Teruskan Email](https://github.com/forwardemail), [Anak laki-laki](https://github.com/ladjs), dan [Bree](https://github.com/breejs)—yang masing-masing memecahkan kebutuhan spesifik dalam komunitas JavaScript.

Perubahan dari kontributor menjadi pemimpin ini menunjukkan visi Nick untuk perangkat lunak yang dirancang dengan baik yang memecahkan masalah nyata. Dengan mengatur paket-paket terkait di bawah organisasi GitHub yang terfokus, ia membangun ekosistem alat yang bekerja bersama-sama sambil tetap modular dan fleksibel untuk komunitas pengembang yang lebih luas.

## Organisasi GitHub Kami: Ekosistem Inovasi {#our-github-organizations-ecosystems-of-innovation}

Kami mengatur pekerjaan sumber terbuka kami di seputar organisasi GitHub yang terfokus, yang masing-masing memecahkan kebutuhan spesifik dalam JavaScript. Struktur ini menciptakan keluarga paket yang kohesif yang bekerja sama dengan baik sekaligus tetap modular.

### Kabin: Pencatatan Terstruktur untuk Aplikasi Modern {#cabin-structured-logging-for-modern-applications}

[Organisasi kabin](https://github.com/cabinjs) adalah solusi kami untuk pencatatan aplikasi yang sederhana dan canggih. Paket [`cabin`](https://github.com/cabinjs/cabin) utama memiliki hampir 900 bintang GitHub dan lebih dari 100.000 unduhan mingguan\[^1]. Cabin menyediakan pencatatan terstruktur yang kompatibel dengan layanan populer seperti Sentry, LogDNA, dan Papertrail.

Keistimewaan Cabin terletak pada sistem API dan plugin-nya yang canggih. Paket-paket pendukung seperti [`axe`](https://github.com/cabinjs/axe) untuk middleware Express dan [`parse-request`](https://github.com/cabinjs/parse-request) untuk penguraian permintaan HTTP menunjukkan komitmen kami terhadap solusi yang lengkap, alih-alih alat yang terisolasi.

Paket [`bson-objectid`](https://github.com/cabinjs/bson-objectid) patut mendapat perhatian khusus, dengan lebih dari 1,7 juta unduhan hanya dalam dua bulan\[^2]. Implementasi ObjectID MongoDB yang ringan ini telah menjadi pilihan utama bagi para pengembang yang membutuhkan ID tanpa dependensi MongoDB penuh.

### Pemindai Spam: Melawan Penyalahgunaan Email {#spam-scanner-fighting-email-abuse}

[Organisasi Pemindai Spam](https://github.com/spamscanner) menunjukkan komitmen kami untuk memecahkan masalah nyata. Paket utama [`spamscanner`](https://github.com/spamscanner/spamscanner) menyediakan deteksi spam email tingkat lanjut, tetapi paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)-lah yang telah mengalami adopsi yang luar biasa.

Dengan lebih dari 1,2 juta unduhan dalam dua bulan, `url-regex-safe` memperbaiki masalah keamanan kritis pada ekspresi reguler deteksi URL lainnya. Paket ini menunjukkan pendekatan kami terhadap sumber terbuka: menemukan masalah umum (dalam hal ini, kerentanan [Mengulangi](https://en.wikipedia.org/wiki/ReDoS) dalam validasi URL), menciptakan solusi yang solid, dan memeliharanya dengan cermat.

### Bree: Penjadwalan Pekerjaan Modern dengan Utas Pekerja {#bree-modern-job-scheduling-with-worker-threads}

[Organisasi Bree](https://github.com/breejs) adalah jawaban kami untuk tantangan umum Node.js: penjadwalan pekerjaan yang andal. Paket utama [`bree`](https://github.com/breejs/bree), dengan lebih dari 3.100 bintang GitHub, menyediakan penjadwal pekerjaan modern menggunakan thread pekerja Node.js untuk kinerja dan keandalan yang lebih baik.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Apa yang membuat Bree berbeda dari penjadwal lain seperti Agenda:

* **Tidak Ada Ketergantungan Eksternal**: Tidak seperti Agenda yang membutuhkan MongoDB, Bree tidak memerlukan Redis atau MongoDB untuk mengelola status pekerjaan.
* **Worker Threads**: Bree menggunakan worker thread Node.js untuk proses sandboxed, sehingga memberikan isolasi dan kinerja yang lebih baik.
* **Simple API**: Bree menawarkan kontrol terperinci dengan kesederhanaan, sehingga lebih mudah untuk mengimplementasikan kebutuhan penjadwalan yang kompleks.
* **Dukungan Bawaan**: Hal-hal seperti pemuatan ulang yang lancar, pekerjaan cron, tanggal, dan waktu yang ramah manusia disertakan secara default.

Bree adalah bagian penting dari [forwardemail.net](https://github.com/forwardemail/forwardemail.net), menangani tugas-tugas latar belakang penting seperti pemrosesan email, pembersihan, dan pemeliharaan terjadwal. Penggunaan Bree di Forward Email menunjukkan komitmen kami untuk menggunakan alat-alat kami sendiri dalam produksi, memastikan alat-alat tersebut memenuhi standar keandalan yang tinggi.

Kami juga menggunakan dan mengapresiasi paket utas pekerja hebat lainnya seperti [kolam](https://github.com/piscinajs/piscina) dan klien HTTP seperti [sebelas](https://github.com/nodejs/undici). Piscina, seperti Bree, menggunakan utas pekerja Node.js untuk pemrosesan tugas yang efisien. Kami berterima kasih kepada [Matthew Bukit](https://github.com/mcollina), yang mengelola undici dan piscina, atas kontribusi besarnya pada Node.js. Matteo bertugas di Komite Pengarah Teknis Node.js dan telah meningkatkan kapabilitas klien HTTP di Node.js secara signifikan.

### Teruskan Email: Infrastruktur Email Sumber Terbuka {#forward-email-open-source-email-infrastructure}

Proyek kami yang paling ambisius adalah [Teruskan Email](https://github.com/forwardemail), sebuah layanan email sumber terbuka yang menyediakan layanan penerusan, penyimpanan, dan API email. Repositori utamanya memiliki lebih dari 1.100 bintang GitHub, yang menunjukkan apresiasi komunitas terhadap alternatif layanan email proprietary ini.

Paket [`preview-email`](https://github.com/forwardemail/preview-email) dari organisasi ini, dengan lebih dari 2,5 juta unduhan dalam dua bulan, telah menjadi alat penting bagi para pengembang yang bekerja dengan templat email. Dengan menyediakan cara mudah untuk melihat pratinjau email selama pengembangan, paket ini memecahkan masalah umum dalam membangun aplikasi yang mendukung email.

### Lad: Utilitas dan Alat Penting Koa {#lad-essential-koa-utilities-and-tools}

[Organisasi pemuda](https://github.com/ladjs) menyediakan kumpulan utilitas dan alat penting yang terutama berfokus pada peningkatan ekosistem kerangka kerja Koa. Paket-paket ini memecahkan tantangan umum dalam pengembangan web dan dirancang untuk bekerja sama dengan lancar sekaligus tetap bermanfaat secara independen.

#### koa-better-error-handler: Penanganan Kesalahan yang Lebih Baik untuk Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) menawarkan solusi penanganan kesalahan yang lebih baik untuk aplikasi Koa. Dengan lebih dari 50 bintang GitHub, paket ini membuat `ctx.throw` menghasilkan pesan kesalahan yang mudah digunakan sekaligus mengatasi beberapa keterbatasan penangan kesalahan bawaan Koa:

* Mendeteksi dan menangani kesalahan DNS Node.js, kesalahan Mongoose, dan kesalahan Redis dengan tepat
* Menggunakan [Ledakan](https://github.com/hapijs/boom) untuk membuat respons kesalahan yang konsisten dan terformat dengan baik
* Mempertahankan header (tidak seperti pengendali bawaan Koa)
* Mempertahankan kode status yang sesuai, alih-alih menggunakan nilai default 500
* Mendukung pesan flash dan preservasi sesi
* Menyediakan daftar kesalahan HTML untuk kesalahan validasi
* Mendukung berbagai jenis respons (HTML, JSON, dan teks biasa)

Paket ini sangat berharga jika digunakan bersama [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) untuk manajemen kesalahan komprehensif dalam aplikasi Koa.

#### paspor: Autentikasi untuk Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) memperluas middleware autentikasi Passport.js yang populer dengan penyempurnaan khusus untuk aplikasi web modern. Paket ini mendukung beberapa strategi autentikasi secara langsung:

* Autentikasi lokal dengan email
* Masuk dengan Apple
* Autentikasi GitHub
* Autentikasi Google
* Autentikasi kata sandi satu kali (OTP)

Paket ini sangat dapat disesuaikan, yang memungkinkan pengembang untuk menyesuaikan nama dan frasa kolom agar sesuai dengan persyaratan aplikasi mereka. Paket ini dirancang untuk terintegrasi secara mulus dengan Mongoose untuk manajemen pengguna, menjadikannya solusi ideal untuk aplikasi berbasis Koa yang memerlukan autentikasi yang kuat.

#### anggun: Penutupan Aplikasi yang Elegan {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) memecahkan tantangan kritis untuk menutup aplikasi Node.js secara elegan. Dengan lebih dari 70 bintang GitHub, paket ini memastikan aplikasi Anda dapat ditutup dengan bersih tanpa kehilangan data atau koneksi yang macet. Fitur-fitur utamanya meliputi:

* Dukungan untuk menutup server HTTP dengan baik (Express/Koa/Fastify)
* Penutupan koneksi basis data yang bersih (MongoDB/Mongoose)
* Penutupan klien Redis yang tepat
* Penanganan penjadwal pekerjaan Bree
* Dukungan untuk penangan penutupan khusus
* Pengaturan batas waktu yang dapat dikonfigurasi
* Integrasi dengan sistem pencatatan

Paket ini penting untuk aplikasi produksi di mana penghentian tak terduga dapat menyebabkan hilangnya atau kerusakan data. Dengan menerapkan prosedur penghentian yang tepat, `@ladjs/graceful` membantu memastikan keandalan dan stabilitas aplikasi Anda.

### Upptime: Pemantauan Waktu Aktif Sumber Terbuka {#upptime-open-source-uptime-monitoring}

[Organisasi Upptime](https://github.com/upptime) mencerminkan komitmen kami terhadap pemantauan sumber terbuka yang transparan. Repositori utama [`upptime`](https://github.com/upptime/upptime) memiliki lebih dari 13.000 bintang GitHub, menjadikannya salah satu proyek terpopuler yang kami ikuti. Upptime menyediakan monitor uptime dan halaman status berbasis GitHub yang beroperasi sepenuhnya tanpa server.

Kami menggunakan Upptime untuk halaman status kami sendiri di <https://status.forwardemail.net> dengan kode sumber tersedia di <https://github.com/forwardemail/status.forwardemail.net>.

Yang membuat Upptime istimewa adalah arsitekturnya:

* **100% Open Source**: Setiap komponen sepenuhnya open source dan dapat disesuaikan.
* **Didukung oleh GitHub**: Memanfaatkan GitHub Actions, Issues, dan Pages untuk solusi pemantauan tanpa server.
* **Tidak Memerlukan Server**: Tidak seperti alat pemantauan tradisional, Upptime tidak mengharuskan Anda menjalankan atau memelihara server.
* **Halaman Status Otomatis**: Menghasilkan halaman status cantik yang dapat dihosting di GitHub Pages.
* **Notifikasi yang Kuat**: Terintegrasi dengan berbagai saluran notifikasi termasuk email, SMS, dan Slack.

Untuk meningkatkan pengalaman pengguna, kami telah mengintegrasikan [@octokit/inti](https://github.com/octokit/core.js/) ke dalam basis kode forwardemail.net untuk menampilkan pembaruan status dan insiden secara real-time langsung di situs web kami. Integrasi ini memberikan transparansi yang jelas kepada pengguna kami jika terjadi masalah di seluruh tumpukan kami (Situs Web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, dll.) dengan notifikasi toast instan, perubahan ikon lencana, warna peringatan, dan banyak lagi.

Pustaka @octokit/core memungkinkan kita mengambil data real-time dari repositori GitHub Upptime, memprosesnya, dan menampilkannya dengan cara yang mudah digunakan. Saat layanan mengalami gangguan atau kinerja menurun, pengguna akan segera diberi tahu melalui indikator visual tanpa harus meninggalkan aplikasi utama. Integrasi yang lancar ini memastikan bahwa pengguna selalu memiliki informasi terkini tentang status sistem, sehingga meningkatkan transparansi dan kepercayaan.

Upptime telah diadopsi oleh ratusan organisasi yang mencari cara yang transparan dan andal untuk memantau layanan mereka dan mengomunikasikan status kepada pengguna. Keberhasilan proyek ini menunjukkan kekuatan membangun alat yang memanfaatkan infrastruktur yang ada (dalam hal ini, GitHub) untuk memecahkan masalah umum dengan cara baru.

## Kontribusi Kami terhadap Ekosistem Email Terusan {#our-contributions-to-the-forward-email-ecosystem}

Meskipun paket sumber terbuka kami digunakan oleh para pengembang di seluruh dunia, paket tersebut juga menjadi dasar layanan Forward Email kami sendiri. Peran ganda ini—sebagai kreator dan pengguna alat-alat ini—memberi kami perspektif unik tentang penerapannya di dunia nyata dan mendorong peningkatan berkelanjutan.

### Dari Paket ke Produksi {#from-packages-to-production}

Perjalanan dari paket individual ke sistem produksi yang kohesif melibatkan integrasi dan perluasan yang cermat. Untuk Forward Email, proses ini meliputi:

* **Ekstensi Kustom**: Membangun ekstensi khusus Forward Email ke paket sumber terbuka kami yang memenuhi persyaratan unik kami.
* **Pola Integrasi**: Mengembangkan pola untuk cara paket ini berinteraksi dalam lingkungan produksi.
* **Optimalisasi Kinerja**: Mengidentifikasi dan mengatasi hambatan kinerja yang hanya muncul dalam skala besar.
* **Pengerasan Keamanan**: Menambahkan lapisan keamanan tambahan yang khusus untuk penanganan email dan perlindungan data pengguna.

Pekerjaan ini membutuhkan ribuan jam pengembangan di luar paket inti itu sendiri, menghasilkan layanan email tangguh dan aman yang memanfaatkan kontribusi terbaik sumber terbuka kami.

### Lingkaran Umpan Balik {#the-feedback-loop}

Mungkin aspek yang paling berharga dari penggunaan paket kami sendiri dalam produksi adalah umpan balik yang diciptakannya. Saat kami menemukan keterbatasan atau kasus khusus dalam Forward Email, kami tidak hanya menambalnya secara lokal—kami meningkatkan paket yang mendasarinya, yang menguntungkan layanan kami dan komunitas yang lebih luas.

Pendekatan ini telah menghasilkan banyak perbaikan:

* **Penonaktifan Anggun Bree**: Kebutuhan Forward Email untuk penerapan tanpa waktu henti menghasilkan peningkatan kemampuan penonaktifan anggun di Bree.
* **Pengenalan Pola Spam Scanner**: Pola spam dunia nyata yang ditemukan di Forward Email telah menginformasikan algoritme deteksi Spam Scanner.
* **Pengoptimalan Kinerja Cabin**: Pencatatan volume tinggi dalam produksi mengungkap peluang pengoptimalan di Cabin yang menguntungkan semua pengguna.

Dengan mempertahankan siklus baik antara pekerjaan sumber terbuka dan layanan produksi, kami memastikan paket kami tetap merupakan solusi praktis dan teruji, bukan sekadar implementasi teoritis.

## Prinsip Inti Email Terusan: Fondasi untuk Keunggulan {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email dirancang berdasarkan serangkaian prinsip inti yang memandu semua keputusan pengembangan kami. Prinsip-prinsip ini, yang dijelaskan secara rinci pada [situs web](/blog/docs/best-quantum-safe-encrypted-email-service#principles) kami, memastikan layanan kami tetap ramah pengembang, aman, dan berfokus pada privasi pengguna.

### Selalu Ramah Pengembang, Berfokus pada Keamanan, dan Transparan {#always-developer-friendly-security-focused-and-transparent}

Prinsip utama kami adalah menciptakan perangkat lunak yang ramah bagi pengembang sekaligus menjaga standar keamanan dan privasi tertinggi. Kami percaya bahwa keunggulan teknis tidak boleh mengorbankan kegunaan, dan bahwa transparansi membangun kepercayaan dengan komunitas kami.

Prinsip ini terlihat dalam dokumentasi terperinci kami, pesan kesalahan yang jelas, dan komunikasi terbuka tentang keberhasilan dan tantangan. Dengan menjadikan seluruh basis kode kami sumber terbuka, kami mengundang pengawasan dan kolaborasi, yang memperkuat perangkat lunak kami dan ekosistem yang lebih luas.

### Kepatuhan terhadap Prinsip Pengembangan Perangkat Lunak yang Telah Teruji oleh Waktu {#adherence-to-time-tested-software-development-principles}

Kami mengikuti beberapa prinsip pengembangan perangkat lunak yang mapan yang telah membuktikan nilainya selama beberapa dekade:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Memisahkan masalah melalui pola Model-View-Controller
* **[Filsafat Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Membuat komponen modular yang melakukan satu hal dengan baik
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Menjaga Kesederhanaan dan Kejelasan
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Jangan Mengulang-ulang, dorong penggunaan kembali kode
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Anda Tidak Akan Membutuhkannya, hindari optimasi prematur
* **[Dua Belas Faktor](https://12factor.net/)**: Mengikuti praktik terbaik untuk membangun aplikasi modern yang skalabel
* **[Pisau cukur Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Memilih solusi paling sederhana yang memenuhi persyaratan
* **[Makanan anjing](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Menggunakan produk kami sendiri secara ekstensif

Prinsip-prinsip ini bukan sekadar konsep teoritis—prinsip-prinsip ini tertanam dalam praktik pengembangan harian kami. Misalnya, kepatuhan kami terhadap filosofi Unix terbukti dalam cara kami menyusun paket-paket npm: modul-modul kecil dan terfokus yang dapat disusun bersama untuk memecahkan masalah-masalah rumit.

### Menargetkan Pengembang yang Berkemah dan Bermodalkan Bootstrap {#targeting-the-scrappy-bootstrapped-developer}

Kami secara khusus menargetkan pengembang yang ulet, bootstrap, dan [ramen-menguntungkan](https://www.paulgraham.com/ramenprofitable.html). Fokus ini membentuk segalanya, mulai dari model penetapan harga hingga keputusan teknis kami. Kami memahami tantangan membangun produk dengan sumber daya terbatas karena kami pernah mengalaminya sendiri.

Prinsip ini sangat penting dalam pendekatan kami terhadap sumber terbuka. Kami membuat dan mengelola paket yang memecahkan masalah nyata bagi pengembang tanpa anggaran perusahaan, sehingga alat yang hebat dapat diakses oleh semua orang tanpa memandang sumber daya mereka.

### Prinsip dalam Praktik: Basis Kode Email Teruskan {#principles-in-practice-the-forward-email-codebase}

Prinsip-prinsip ini terlihat jelas dalam basis kode Forward Email. File package.json kami mengungkap pilihan dependensi yang cermat, masing-masing dipilih agar selaras dengan nilai-nilai inti kami:

* Paket yang berfokus pada keamanan seperti `mailauth` untuk autentikasi email
* Alat yang ramah pengembang seperti `preview-email` untuk memudahkan debugging
* Komponen modular seperti berbagai utilitas `p-*` dari Sindre Sorhus

Dengan mengikuti prinsip-prinsip ini secara konsisten dari waktu ke waktu, kami telah membangun layanan yang dapat dipercaya oleh pengembang untuk infrastruktur email mereka—aman, andal, dan selaras dengan nilai-nilai komunitas sumber terbuka.

### Privasi Berdasarkan Desain {#privacy-by-design}

Privasi bukanlah renungan atau fitur pemasaran untuk Forward Email—ini adalah prinsip desain mendasar yang menginformasikan setiap aspek layanan dan kode kami:

* **Enkripsi Tanpa Akses**: Kami telah menerapkan sistem yang secara teknis membuat kami tidak mungkin membaca email pengguna.
* **Pengumpulan Data Minimal**: Kami hanya mengumpulkan data yang diperlukan untuk menyediakan layanan kami, tidak lebih.
* **Kebijakan Transparan**: Kebijakan privasi kami ditulis dalam bahasa yang jelas dan mudah dipahami tanpa jargon hukum.
* **Verifikasi Sumber Terbuka**: Basis kode sumber terbuka kami memungkinkan peneliti keamanan untuk memverifikasi klaim privasi kami.

Komitmen ini meluas ke paket sumber terbuka kami, yang dirancang dengan praktik terbaik keamanan dan privasi yang dibangun dari awal.

### Sumber Terbuka Berkelanjutan {#sustainable-open-source}

Kami percaya bahwa perangkat lunak sumber terbuka memerlukan model yang berkelanjutan agar dapat berkembang dalam jangka panjang. Pendekatan kami meliputi:

* **Dukungan Komersial**: Menawarkan dukungan dan layanan premium seputar perangkat sumber terbuka kami.
* **Lisensi Seimbang**: Menggunakan lisensi yang melindungi kebebasan pengguna dan keberlanjutan proyek.
* **Keterlibatan Komunitas**: Secara aktif terlibat dengan kontributor untuk membangun komunitas yang mendukung.
* **Peta Jalan yang Transparan**: Berbagi rencana pengembangan kami agar pengguna dapat merencanakannya dengan tepat.

Dengan berfokus pada keberlanjutan, kami memastikan kontribusi sumber terbuka kami dapat terus tumbuh dan berkembang seiring waktu dan tidak terabaikan.

## Angka Tidak Berbohong: Statistik Unduhan npm Kami yang Menakjubkan {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Ketika kita berbicara tentang dampak perangkat lunak sumber terbuka, statistik unduhan memberikan ukuran adopsi dan kepercayaan yang nyata. Banyak paket yang kami bantu kelola telah mencapai skala yang jarang dicapai oleh proyek sumber terbuka lainnya, dengan total unduhan mencapai miliaran.

![Paket npm teratas berdasarkan unduhan](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### Pandangan Luas tentang Dampak Kami {#a-birds-eye-view-of-our-impact}

Hanya dalam kurun waktu dua bulan dari Februari hingga Maret 2025, paket-paket teratas yang kami kontribusikan dan bantu pertahankan mencatat angka unduhan yang luar biasa:

* **[agen super](https://www.npmjs.com/package/superagent)**: 84.575.829 unduhan\[^7] (aslinya dibuat oleh TJ Holowaychuk)
* **[ujian super](https://www.npmjs.com/package/supertest)**: 76.432.591 unduhan\[^8] (aslinya dibuat oleh TJ Holowaychuk)
* **[Juga](https://www.npmjs.com/package/koa)**: 28.539.295 unduhan\[^34] (aslinya dibuat oleh TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 unduhan\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 unduhan\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 unduhan\[^37]
* **[pratinjau-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 unduhan\[^9]
* **[kabin](https://www.npmjs.com/package/cabin)**: 1.800.000 unduhan\[^10]
* **[@breejs/nanti](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 unduhan\[^38]
* **[templat email](https://www.npmjs.com/package/email-templates)**: 1.128.139 unduhan\[^39]
* **[dapatkan-jalur](https://www.npmjs.com/package/get-paths)**: 1.124.686 unduhan\[^40]
* **[url-regex-aman](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 unduhan\[^11]
* **[dotenv-parse-variabel](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 unduhan\[^41]
* **[@koa/berbagai](https://www.npmjs.com/package/@koa/multer)**: 839.585 unduhan\[^42]
* **[pemindai spam](https://www.npmjs.com/package/spamscanner)**: 145.000 unduhan\[^12]
* **[angin](https://www.npmjs.com/package/bree)**: 24.270 unduhan\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

Ini bukan sekadar angka yang mengesankan—angka-angka ini menunjukkan pengembang sungguhan yang memecahkan masalah sungguhan dengan kode yang kami bantu kelola. Setiap unduhan adalah contoh saat paket-paket ini telah membantu seseorang membangun sesuatu yang berarti, mulai dari proyek hobi hingga aplikasi perusahaan yang digunakan oleh jutaan orang.

![Distribusi Kategori Paket](/img/art/category_pie_chart.svg)

### Dampak Harian dalam Skala Besar {#daily-impact-at-scale}

Pola unduhan harian menunjukkan penggunaan yang konsisten dan bervolume tinggi, dengan puncaknya mencapai jutaan unduhan per hari\[^13]. Konsistensi ini menunjukkan stabilitas dan keandalan paket-paket ini—pengembang tidak sekadar mencobanya; mereka mengintegrasikannya ke dalam alur kerja inti mereka dan bergantung padanya setiap hari.

Pola unduhan mingguan menunjukkan angka yang lebih mengesankan, yang secara konsisten berkisar pada puluhan juta unduhan per minggu\[^14]. Ini merupakan jejak yang sangat besar dalam ekosistem JavaScript, dengan paket-paket ini berjalan di lingkungan produksi di seluruh dunia.

### Melampaui Angka Mentah {#beyond-the-raw-numbers}

Meskipun statistik unduhannya sendiri mengesankan, statistik tersebut menceritakan kisah yang lebih dalam tentang kepercayaan yang diberikan komunitas terhadap paket-paket ini. Mempertahankan paket-paket pada skala ini memerlukan komitmen yang kuat untuk:

* **Kompatibilitas Mundur**: Perubahan harus dipertimbangkan dengan saksama untuk menghindari kerusakan pada implementasi yang ada.
* **Keamanan**: Dengan jutaan aplikasi yang bergantung pada paket-paket ini, kerentanan keamanan dapat menimbulkan konsekuensi yang luas.
* **Kinerja**: Pada skala ini, bahkan peningkatan kinerja yang kecil dapat memberikan manfaat agregat yang signifikan.
* **Dokumentasi**: Dokumentasi yang jelas dan komprehensif sangat penting untuk paket-paket yang digunakan oleh pengembang dari semua tingkat pengalaman.

Pertumbuhan jumlah unduhan yang konsisten dari waktu ke waktu mencerminkan keberhasilan dalam memenuhi komitmen ini, membangun kepercayaan dengan komunitas pengembang melalui paket yang andal dan terawat dengan baik.

## Mendukung Ekosistem: Sponsor Sumber Terbuka Kami {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Selain kontribusi langsung kami terhadap ekosistem JavaScript, kami bangga mensponsori kontributor Node.js terkemuka yang karyanya menjadi dasar banyak aplikasi modern. Sponsorship kami meliputi:

### Andris Reinman: Pelopor Infrastruktur Email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) adalah pencipta [Nodemailer](https://github.com/nodemailer/nodemailer), pustaka pengiriman email terpopuler untuk Node.js dengan lebih dari 14 juta unduhan mingguan\[^15]. Karyanya meluas ke komponen infrastruktur email penting lainnya seperti [Server SMTP](https://github.com/nodemailer/smtp-server), [Pengurai surat](https://github.com/nodemailer/mailparser), dan [Bebek Liar](https://github.com/nodemailer/wildduck).

Sponsorship kami membantu memastikan pemeliharaan dan pengembangan berkelanjutan atas alat-alat penting yang mendukung komunikasi email untuk aplikasi Node.js yang tak terhitung jumlahnya, termasuk layanan Forward Email kami sendiri.

### Sindre Sorhus: Utility Package Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) adalah salah satu kontributor sumber terbuka paling produktif di ekosistem JavaScript, dengan lebih dari 1.000 paket npm atas namanya. Utilitasnya seperti [peta p](https://github.com/sindresorhus/p-map), [p-cobaan ulang](https://github.com/sindresorhus/p-retry), dan [adalah aliran](https://github.com/sindresorhus/is-stream) merupakan komponen dasar yang digunakan di seluruh ekosistem Node.js.

Dengan mensponsori karya Sindre, kami membantu mendukung pengembangan utilitas penting ini yang membuat pengembangan JavaScript lebih efisien dan andal.

Sponsorship ini mencerminkan komitmen kami terhadap ekosistem open source yang lebih luas. Kami menyadari bahwa keberhasilan kami dibangun di atas fondasi yang diletakkan oleh para kontributor ini dan kontributor lainnya, dan kami berdedikasi untuk memastikan keberlanjutan seluruh ekosistem.

## Mengungkap Kerentanan Keamanan dalam Ekosistem JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Komitmen kami terhadap sumber terbuka melampaui pengembangan fitur hingga mencakup mengidentifikasi dan menangani kerentanan keamanan yang dapat memengaruhi jutaan pengembang. Beberapa kontribusi kami yang paling signifikan terhadap ekosistem JavaScript adalah di bidang keamanan.

### Penyelamatan Koa-Router {#the-koa-router-rescue}

Pada Februari 2019, Nick mengidentifikasi masalah kritis dalam pemeliharaan paket koa-router yang populer. Karena ia [dilaporkan di Hacker News](https://news.ycombinator.com/item?id=19156707), paket tersebut telah ditinggalkan oleh pengelola aslinya, sehingga kerentanan keamanan tidak teratasi dan komunitas tidak mendapatkan pembaruan.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

Sebagai tanggapan, Nick menciptakan [@koa/router](https://github.com/koajs/router) dan membantu memberi tahu komunitas tentang situasi tersebut. Ia telah memelihara paket penting ini sejak saat itu, memastikan bahwa pengguna Koa memiliki solusi perutean yang aman dan terawat dengan baik.

### Mengatasi Kerentanan ReDoS {#addressing-redos-vulnerabilities}

Pada tahun 2020, Nick mengidentifikasi dan menangani kerentanan kritis [Penolakan Layanan Ekspresi Reguler (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) dalam paket `url-regex` yang banyak digunakan. Kerentanan ini ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) dapat memungkinkan penyerang melakukan denial of service (DNS) dengan memberikan input yang dirancang khusus yang menyebabkan backtracking yang fatal dalam ekspresi reguler.

Alih-alih hanya menambal paket yang sudah ada, Nick menciptakan [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), sebuah implementasi yang sepenuhnya ditulis ulang yang mengatasi kerentanan tersebut sambil tetap mempertahankan kompatibilitas dengan API asli. Ia juga menerbitkan [postingan blog yang lengkap](/blog/docs/url-regex-javascript-node-js) yang menjelaskan kerentanan tersebut dan cara mengatasinya.

Karya ini menunjukkan pendekatan kami terhadap keamanan: tidak sekadar memperbaiki masalah tetapi juga mendidik masyarakat dan menyediakan alternatif kuat yang mencegah masalah serupa di masa mendatang.

### Mendukung Keamanan Node.js dan Chromium {#advocating-for-nodejs-and-chromium-security}

Nick juga aktif mengadvokasi peningkatan keamanan di ekosistem yang lebih luas. Pada Agustus 2020, ia mengidentifikasi masalah keamanan yang signifikan di Node.js terkait penanganan header HTTP, yang dilaporkan dalam [Daftar](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Masalah ini, yang berasal dari patch di Chromium, berpotensi memungkinkan penyerang untuk melewati langkah-langkah keamanan. Advokasi Nick membantu memastikan bahwa masalah tersebut ditangani dengan segera, melindungi jutaan aplikasi Node.js dari potensi eksploitasi.

### Mengamankan Infrastruktur npm {#securing-npm-infrastructure}

Di akhir bulan yang sama, Nick mengidentifikasi masalah keamanan kritis lainnya, kali ini pada infrastruktur email npm. Sebagaimana dilaporkan dalam [Daftar](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm tidak menerapkan protokol autentikasi email DMARC, SPF, dan DKIM dengan benar, sehingga berpotensi memungkinkan penyerang mengirimkan email phishing yang seolah-olah berasal dari npm.

Laporan Nick menghasilkan perbaikan dalam postur keamanan email npm, melindungi jutaan pengembang yang mengandalkan npm untuk manajemen paket dari potensi serangan phishing.

## Kontribusi Kami terhadap Ekosistem Email Terusan {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email dibangun di atas beberapa proyek sumber terbuka penting, termasuk Nodemailer, WildDuck, dan mailauth. Tim kami telah memberikan kontribusi signifikan terhadap proyek-proyek ini, membantu mengidentifikasi dan memperbaiki masalah mendalam yang memengaruhi pengiriman dan keamanan email.

### Meningkatkan Fungsionalitas Inti Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) adalah tulang punggung pengiriman email di Node.js, dan kontribusi kami telah membantu membuatnya lebih kuat:

* **Peningkatan Server SMTP**: Kami telah memperbaiki bug penguraian, masalah penanganan aliran, dan masalah konfigurasi TLS dalam komponen server SMTP\[^16]\[^17].
* **Peningkatan Pengurai Email**: Kami telah mengatasi kesalahan penguraian urutan karakter dan mengatasi masalah pengurai yang dapat menyebabkan kegagalan pemrosesan email\[^18]\[^19].

Kontribusi ini memastikan bahwa Nodemailer tetap menjadi fondasi yang andal untuk pemrosesan email di aplikasi Node.js, termasuk Forward Email.

### Memajukan Autentikasi Email dengan Mailauth {#advancing-email-authentication-with-mailauth}

[Surat elektronik](https://github.com/postalsys/mailauth) menyediakan fungsionalitas autentikasi email yang penting, dan kontribusi kami telah meningkatkan kemampuannya secara signifikan:

* **Peningkatan Verifikasi DKIM**: Kami menemukan dan melaporkan bahwa X/Twitter memiliki masalah cache DNS yang menyebabkan kegagalan DKIM untuk pesan keluar mereka, dan melaporkannya di Hacker One\[^20].
* **Peningkatan DMARC dan ARC**: Kami telah memperbaiki masalah dengan verifikasi DMARC dan ARC yang dapat menyebabkan hasil autentikasi yang salah\[^21]\[^22].
* **Optimalisasi Kinerja**: Kami telah memberikan kontribusi berupa optimasi yang meningkatkan kinerja proses autentikasi email\[^23]\[^24]\[^25]\[^26].

Peningkatan ini membantu memastikan autentikasi email akurat dan andal, melindungi pengguna dari serangan phishing dan spoofing.

### Peningkatan Waktu Aktif Utama {#key-upptime-enhancements}

Kontribusi kami untuk Upptime meliputi:

* **Pemantauan Sertifikat SSL**: Kami menambahkan fungsi untuk memantau kedaluwarsa sertifikat SSL, mencegah waktu henti yang tidak terduga karena sertifikat yang kedaluwarsa\[^27].
* **Dukungan Beberapa Nomor SMS**: Kami menerapkan dukungan untuk memberi tahu beberapa anggota tim melalui SMS saat insiden terjadi, sehingga meningkatkan waktu respons\[^28].
* **Perbaikan Pemeriksaan IPv6**: Kami memperbaiki masalah dengan pemeriksaan konektivitas IPv6, yang memastikan pemantauan yang lebih akurat di lingkungan jaringan modern\[^29].
* **Dukungan Mode Gelap/Terang**: Kami menambahkan dukungan tema untuk meningkatkan pengalaman pengguna pada halaman status\[^31].
* **Dukungan TCP-Ping yang Lebih Baik**: Kami menyempurnakan fungsi ping TCP untuk menyediakan pengujian koneksi yang lebih andal\[^32].

Peningkatan ini tidak hanya menguntungkan pemantauan status Forward Email tetapi juga tersedia untuk seluruh komunitas pengguna Upptime, yang menunjukkan komitmen kami untuk meningkatkan alat yang kami andalkan.

## Perekat yang Menyatukan Semuanya: Kode Kustom dalam Skala Besar {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Meskipun paket-paket npm dan kontribusi kami terhadap proyek-proyek yang sudah ada cukup signifikan, kode khusus yang mengintegrasikan komponen-komponen inilah yang benar-benar menunjukkan keahlian teknis kami. Basis kode Forward Email mewakili upaya pengembangan selama satu dekade, dimulai sejak tahun 2017 ketika proyek ini dimulai sebagai [penerusan email gratis](https://github.com/forwardemail/free-email-forwarding) sebelum digabungkan ke dalam monorepo.

### Upaya Pengembangan Besar-besaran {#a-massive-development-effort}

Skala kode integrasi khusus ini sangat mengesankan:

* **Total Kontribusi**: Lebih dari 3.217 komitmen
* **Ukuran Basis Kode**: Lebih dari 421.545 baris kode di seluruh berkas JavaScript, Pug, CSS, dan JSON\[^33]

Ini merupakan ribuan jam kerja pengembangan, sesi debugging, dan pengoptimalan kinerja. Ini adalah "resep rahasia" yang mengubah paket individual menjadi layanan yang kohesif dan andal yang digunakan oleh ribuan pelanggan setiap hari.

### Integrasi Ketergantungan Inti {#core-dependencies-integration}

Basis kode Forward Email mengintegrasikan sejumlah dependensi menjadi satu kesatuan yang utuh:

* **Pemrosesan Email**: Mengintegrasikan Nodemailer untuk pengiriman, Server SMTP untuk penerimaan, dan Mailparser untuk penguraian
* **Autentikasi**: Menggunakan Mailauth untuk verifikasi DKIM, SPF, DMARC, dan ARC
* **Resolusi DNS**: Memanfaatkan Tangerine untuk DNS-over-HTTPS dengan caching global
* **Koneksi MX**: Menggunakan mx-connect dengan integrasi Tangerine untuk koneksi server email yang andal
* **Penjadwalan Pekerjaan**: Menggunakan Bree untuk pemrosesan tugas latar belakang yang andal dengan utas pekerja
* **Pembuatan Templat**: Menggunakan templat email untuk menggunakan kembali stylesheet dari situs web dalam komunikasi pelanggan
* **Penyimpanan Email**: Menerapkan kotak surat SQLite terenkripsi secara individual menggunakan better-sqlite3-multiple-ciphers dengan enkripsi ChaCha20-Poly1305 untuk privasi yang aman secara kuantum, memastikan isolasi lengkap antara pengguna dan hanya pengguna yang memiliki akses ke kotak surat mereka

Setiap integrasi ini memerlukan pertimbangan cermat terhadap kasus-kasus ekstrem, implikasi kinerja, dan masalah keamanan. Hasilnya adalah sistem tangguh yang menangani jutaan transaksi email dengan andal. Implementasi SQLite kami juga memanfaatkan msgpackr untuk serialisasi biner yang efisien dan WebSockets (melalui ws) untuk pembaruan status waktu nyata di seluruh infrastruktur kami.

### Infrastruktur DNS dengan Tangerine dan mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Komponen penting infrastruktur Forward Email adalah sistem resolusi DNS kami, yang dibangun berdasarkan dua paket utama:

* **[Jeruk keprok](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Implementasi DNS-over-HTTPS Node.js kami menyediakan pengganti langsung untuk resolver DNS standar, dengan percobaan ulang bawaan, batas waktu, rotasi server cerdas, dan dukungan caching.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Paket ini membuat koneksi TCP ke server MX, mengambil domain target atau alamat email, menyelesaikan server MX yang sesuai, dan menghubungkannya berdasarkan urutan prioritas.

Kami telah mengintegrasikan Tangerine dengan mx-connect melalui [Permintaan tarik #4](https://github.com/zone-eu/mx-connect/pull/4), memastikan DNS lapisan aplikasi melalui permintaan HTTP di seluruh Forward Email. Ini menyediakan caching global untuk DNS dalam skala besar dengan konsistensi 1:1 di semua wilayah, aplikasi, atau proses—penting untuk pengiriman email yang andal dalam sistem terdistribusi.

## Dampak Perusahaan: Dari Solusi Open Source Menjadi Solusi Misi Kritis {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Puncak dari perjalanan kami selama satu dekade dalam pengembangan open source telah memungkinkan Forward Email untuk melayani tidak hanya pengembang individu tetapi juga perusahaan besar dan institusi pendidikan yang menjadi tulang punggung gerakan open source itu sendiri.

### Studi Kasus Infrastruktur Email Kritis {#case-studies-in-mission-critical-email-infrastructure}

Komitmen kami terhadap keandalan, privasi, dan prinsip sumber terbuka telah menjadikan Forward Email pilihan tepercaya bagi organisasi dengan kebutuhan email yang tinggi:

* **Lembaga Pendidikan**: Sebagaimana dijelaskan dalam [studi kasus penerusan email alumni kami](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), universitas-universitas besar mengandalkan infrastruktur kami untuk memelihara koneksi seumur hidup dengan ratusan ribu alumni melalui layanan penerusan email yang andal.

* **Solusi Linux Perusahaan**: [Studi kasus perusahaan email Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) menunjukkan bagaimana pendekatan sumber terbuka kami selaras sempurna dengan kebutuhan penyedia Linux perusahaan, menawarkan mereka transparansi dan kontrol yang mereka butuhkan.

* **Yayasan Sumber Terbuka**: Mungkin yang paling memvalidasi adalah kemitraan kami dengan Linux Foundation, seperti yang didokumentasikan dalam [Studi kasus perusahaan email Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), di mana layanan kami memberdayakan komunikasi untuk organisasi yang mengelola pengembangan Linux.

Ada simetri yang indah dalam cara paket sumber terbuka kami, yang dikelola dengan hati-hati selama bertahun-tahun, memungkinkan kami membangun layanan email yang kini mendukung komunitas dan organisasi yang memperjuangkan perangkat lunak sumber terbuka. Perjalanan penuh ini—dari menyumbangkan paket individual hingga memberdayakan infrastruktur email tingkat perusahaan untuk para pemimpin sumber terbuka—mewakili validasi utama pendekatan kami terhadap pengembangan perangkat lunak.

## Satu Dekade Sumber Terbuka: Menatap Masa Depan {#a-decade-of-open-source-looking-forward}

Saat kami menengok kembali satu dekade kontribusi sumber terbuka dan menantikan sepuluh tahun berikutnya, kami dipenuhi rasa syukur kepada komunitas yang telah mendukung pekerjaan kami dan kegembiraan atas apa yang akan terjadi.

Perjalanan kami dari kontributor paket individual menjadi pengelola infrastruktur email komprehensif yang digunakan oleh perusahaan besar dan yayasan sumber terbuka sungguh luar biasa. Ini adalah bukti kekuatan pengembangan sumber terbuka dan dampak perangkat lunak yang cermat dan terpelihara dengan baik terhadap ekosistem yang lebih luas.

Dalam beberapa tahun mendatang, kami berkomitmen untuk:

* **Terus memelihara dan meningkatkan paket kami yang sudah ada**, memastikan paket tersebut tetap menjadi alat yang andal bagi para pengembang di seluruh dunia.
* **Memperluas kontribusi kami terhadap proyek infrastruktur penting**, khususnya dalam domain email dan keamanan.
* **Meningkatkan kemampuan Forward Email** sambil mempertahankan komitmen kami terhadap privasi, keamanan, dan transparansi.
* **Mendukung kontributor open source generasi berikutnya** melalui bimbingan, sponsor, dan keterlibatan komunitas.

Kami percaya bahwa masa depan pengembangan perangkat lunak bersifat terbuka, kolaboratif, dan dibangun di atas fondasi kepercayaan. Dengan terus memberikan paket berkualitas tinggi yang berfokus pada keamanan ke ekosistem JavaScript, kami berharap dapat berperan kecil dalam membangun masa depan tersebut.

Terima kasih kepada semua orang yang telah menggunakan paket kami, berkontribusi pada proyek kami, melaporkan masalah, atau sekadar menyebarkan informasi tentang pekerjaan kami. Dukungan Anda telah memungkinkan dekade penuh dampak ini, dan kami bersemangat untuk melihat apa yang dapat kita capai bersama dalam sepuluh tahun ke depan.

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
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Berdasarkan masalah GitHub di repositori Upptime
\[^28]: Berdasarkan masalah GitHub di repositori Upptime
\[^29]: Berdasarkan masalah GitHub di repositori Upptime
\[^30]: Statistik unduhan npm untuk bree, Februari-Maret 2025
\[^31]: Berdasarkan permintaan tarik GitHub ke Upptime
\[^32]: Berdasarkan permintaan tarik GitHub ke Upptime
\[^34]: Statistik unduhan npm untuk koa, Februari-Maret 2025
\[^35]: Unduh npm Statistik untuk @koa/router, Februari-Maret 2025
\[^36]: Statistik unduhan npm untuk koa-router, Februari-Maret 2025
\[^37]: Statistik unduhan npm untuk url-regex, Februari-Maret 2025
\[^38]: Statistik unduhan npm untuk @breejs/later, Februari-Maret 2025
\[^39]: Statistik unduhan npm untuk email-templates, Februari-Maret 2025
\[^40]: Statistik unduhan npm untuk get-paths, Februari-Maret 2025
\[^41]: Statistik unduhan npm untuk dotenv-parse-variables, Februari-Maret 2025
\[^42]: Statistik unduhan npm untuk @koa/multer, Februari-Maret 2025