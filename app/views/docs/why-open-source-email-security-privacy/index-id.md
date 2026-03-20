# Mengapa Email Open-Source adalah Masa Depan: Keunggulan Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Keamanan dan privasi email open source" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Kata Pengantar](#foreword)
* [Keunggulan Open-Source: Lebih dari Sekadar Pemasaran](#the-open-source-advantage-more-than-just-marketing)
  * [Apa Arti Open-Source yang Sesungguhnya](#what-true-open-source-means)
  * [Masalah Backend: Di Mana Sebagian Besar Layanan Email "Open-Source" Gagal](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% Open-Source, Frontend DAN Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Pendekatan Teknis Unik Kami](#our-unique-technical-approach)
* [Opsi Self-Hosting: Kebebasan Memilih](#the-self-hosting-option-freedom-of-choice)
  * [Mengapa Kami Mendukung Self-Hosting](#why-we-support-self-hosting)
  * [Realita Self-Hosting Email](#the-reality-of-self-hosting-email)
* [Mengapa Layanan Berbayar Kami Masuk Akal (Meskipun Kami Open-Source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Perbandingan Biaya](#cost-comparison)
  * [Yang Terbaik dari Dua Dunia](#the-best-of-both-worlds)
* [Penipuan Closed-Source: Apa yang Tidak Diberitahukan Proton dan Tutanota](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Klaim Open-Source Proton Mail](#proton-mails-open-source-claims)
  * [Pendekatan Serupa Tutanota](#tutanotas-similar-approach)
  * [Debat Panduan Privasi](#the-privacy-guides-debate)
* [Masa Depan adalah Open-Source](#the-future-is-open-source)
  * [Mengapa Open-Source Sedang Menang](#why-open-source-is-winning)
* [Beralih ke Forward Email](#making-the-switch-to-forward-email)
* [Kesimpulan: Email Open-Source untuk Masa Depan yang Privat](#conclusion-open-source-email-for-a-private-future)


## Kata Pengantar {#foreword}

Di era di mana kekhawatiran tentang privasi digital berada pada titik tertinggi, layanan email yang kita pilih menjadi lebih penting dari sebelumnya. Meskipun banyak penyedia mengklaim memprioritaskan privasi Anda, ada perbedaan mendasar antara mereka yang hanya bicara tentang privasi dan mereka yang benar-benar menjalankannya. Di Forward Email, kami membangun layanan kami di atas fondasi transparansi penuh melalui pengembangan open-source—tidak hanya pada aplikasi frontend kami, tetapi juga pada seluruh infrastruktur kami.

Posting blog ini membahas mengapa solusi email open-source lebih unggul dibandingkan alternatif closed-source, bagaimana pendekatan kami berbeda dari pesaing seperti Proton Mail dan Tutanota, dan mengapa—meskipun kami mendukung opsi self-hosting—layanan berbayar kami menawarkan nilai terbaik bagi sebagian besar pengguna.


## Keunggulan Open-Source: Lebih dari Sekadar Pemasaran {#the-open-source-advantage-more-than-just-marketing}

Istilah "open-source" telah menjadi kata kunci pemasaran yang populer dalam beberapa tahun terakhir, dengan pasar layanan open-source global diproyeksikan tumbuh pada CAGR lebih dari 16% antara 2024 dan 2032\[^1]. Tapi apa arti sebenarnya menjadi open-source, dan mengapa hal itu penting untuk privasi email Anda?

### Apa Arti Open-Source yang Sesungguhnya {#what-true-open-source-means}

Perangkat lunak open-source membuat seluruh kode sumbernya tersedia secara bebas untuk siapa saja yang ingin memeriksa, memodifikasi, dan meningkatkan. Transparansi ini menciptakan lingkungan di mana:

* Kerentanan keamanan dapat diidentifikasi dan diperbaiki oleh komunitas pengembang global
* Klaim privasi dapat diverifikasi melalui tinjauan kode independen
* Pengguna tidak terjebak dalam ekosistem proprietary
* Inovasi terjadi lebih cepat melalui perbaikan kolaboratif

Ketika berbicara tentang email—tulang punggung identitas online Anda—transparansi ini bukan hanya hal yang menyenangkan untuk dimiliki; ini penting untuk privasi dan keamanan yang sesungguhnya.

### Masalah Backend: Di Mana Sebagian Besar Layanan Email "Open-Source" Gagal {#the-backend-problem-where-most-open-source-email-services-fall-short}

Di sinilah hal menjadi menarik. Banyak penyedia email "fokus privasi" populer mengiklankan diri mereka sebagai open-source, tetapi ada perbedaan penting yang mereka harap Anda tidak sadari: **mereka hanya membuka kode frontend mereka sementara backend mereka tetap tertutup**.
Apa artinya ini? Frontend adalah apa yang Anda lihat dan interaksikan—antarmuka web atau aplikasi seluler. Backend adalah tempat pemrosesan email sebenarnya terjadi—tempat pesan Anda disimpan, dienkripsi, dan dikirimkan. Ketika penyedia menjaga backend mereka tertutup (closed-source):

1. Anda tidak dapat memverifikasi bagaimana email Anda sebenarnya diproses
2. Anda tidak dapat memastikan apakah klaim privasi mereka sah
3. Anda mempercayai klaim pemasaran daripada kode yang dapat diverifikasi
4. Kerentanan keamanan mungkin tetap tersembunyi dari pengawasan publik

Seperti yang telah disorot dalam diskusi di forum Privacy Guides, baik Proton Mail maupun Tutanota mengklaim sebagai open-source, tetapi backend mereka tetap tertutup dan bersifat proprietary\[^2]. Ini menciptakan kesenjangan kepercayaan yang signifikan—Anda diminta untuk mempercayai janji privasi mereka tanpa kemampuan untuk memverifikasinya.


## Forward Email: 100% Open-Source, Frontend DAN Backend {#forward-email-100-open-source-frontend-and-backend}

Di Forward Email, kami mengambil pendekatan yang sangat berbeda. Seluruh basis kode kami—baik frontend maupun backend—adalah open-source dan tersedia untuk siapa saja yang ingin memeriksanya di <https://github.com/forwardemail/forwardemail.net>.

Ini berarti:

1. **Transparansi Lengkap**: Setiap baris kode yang memproses email Anda tersedia untuk pengawasan publik.
2. **Privasi yang Dapat Diverifikasi**: Klaim privasi kami bukan sekadar bahasa pemasaran—mereka adalah fakta yang dapat diverifikasi oleh siapa saja dengan memeriksa kode kami.
3. **Keamanan yang Didukung Komunitas**: Keamanan kami diperkuat oleh keahlian kolektif komunitas pengembang global.
4. **Tidak Ada Fungsionalitas Tersembunyi**: Apa yang Anda lihat adalah apa yang Anda dapatkan—tidak ada pelacakan tersembunyi, tidak ada pintu belakang rahasia.

### Pendekatan Teknis Unik Kami {#our-unique-technical-approach}

Komitmen kami terhadap privasi melampaui sekadar open-source. Kami telah menerapkan beberapa inovasi teknis yang membedakan kami:

#### Kotak Surat SQLite yang Dienkripsi Secara Individual {#individually-encrypted-sqlite-mailboxes}

Berbeda dengan penyedia email tradisional yang menggunakan basis data relasional bersama (di mana satu pelanggaran dapat mengekspos data semua pengguna), kami menggunakan file SQLite yang dienkripsi secara individual untuk setiap kotak surat. Ini berarti:

* Setiap kotak surat adalah file terenkripsi terpisah
* Akses ke data satu pengguna tidak memberikan akses ke pengguna lain
* Bahkan karyawan kami sendiri tidak dapat mengakses data Anda—ini adalah keputusan desain inti

Seperti yang kami jelaskan dalam diskusi Privacy Guides:

> "Basis data relasional bersama (misalnya, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, dll) semuanya memerlukan login (dengan user/password) untuk membangun koneksi basis data. Ini berarti siapa pun yang memiliki kata sandi ini dapat melakukan query ke basis data untuk apa saja. Baik itu karyawan nakal atau serangan evil maid. Ini juga berarti bahwa memiliki akses ke data satu pengguna berarti Anda juga memiliki akses ke semua orang lain. Di sisi lain, SQLite bisa dianggap sebagai basis data bersama, tetapi cara kami menggunakannya (setiap kotak surat = file SQLite individual) membuatnya terisolasi (sandboxed)."\[^3]

#### Enkripsi Tahan Kuantum {#quantum-resistant-encryption}

Sementara penyedia lain masih mengejar, kami sudah menerapkan metode enkripsi tahan kuantum untuk melindungi privasi email Anda di masa depan dari ancaman yang muncul dari komputasi kuantum.

#### Tanpa Ketergantungan Pihak Ketiga {#no-third-party-dependencies}

Berbeda dengan pesaing yang mengandalkan layanan seperti Amazon SES untuk pengiriman email, kami membangun seluruh infrastruktur kami secara mandiri. Ini menghilangkan potensi kebocoran privasi melalui layanan pihak ketiga dan memberi kami kendali penuh atas seluruh jalur email.


## Opsi Self-Hosting: Kebebasan Memilih {#the-self-hosting-option-freedom-of-choice}

Salah satu aspek paling kuat dari perangkat lunak open-source adalah kebebasan yang diberikannya. Dengan Forward Email, Anda tidak pernah terkunci—Anda dapat meng-host sendiri seluruh platform kami jika Anda memilih untuk melakukannya.

### Mengapa Kami Mendukung Self-Hosting {#why-we-support-self-hosting}

Kami percaya dalam memberikan kontrol penuh kepada pengguna atas data mereka. Itulah sebabnya kami membuat seluruh platform kami dapat di-host sendiri dengan dokumentasi dan panduan pengaturan yang lengkap. Pendekatan ini:

* Memberikan kontrol maksimal bagi pengguna yang memiliki kemampuan teknis
* Menghilangkan kebutuhan untuk mempercayai kami sebagai penyedia layanan
* Memungkinkan kustomisasi untuk memenuhi kebutuhan spesifik
* Memastikan layanan dapat terus berjalan bahkan jika perusahaan kami tidak melakukannya
### Realitas Self-Hosting Email {#the-reality-of-self-hosting-email}

Meskipun self-hosting adalah opsi yang kuat, penting untuk memahami biaya nyata yang terlibat:

#### Biaya Finansial {#financial-costs}

* Biaya VPS atau server: $5-$50/bulan untuk pengaturan dasar\[^4]
* Registrasi dan perpanjangan domain: $10-20/tahun
* Sertifikat SSL (meskipun Let's Encrypt menawarkan opsi gratis)
* Potensi biaya untuk layanan pemantauan dan solusi cadangan

#### Biaya Waktu {#time-costs}

* Pengaturan awal: Beberapa jam hingga hari tergantung keahlian teknis
* Pemeliharaan berkelanjutan: 5-10 jam/bulan untuk pembaruan, patch keamanan, dan pemecahan masalah\[^5]
* Kurva pembelajaran: Memahami protokol email, praktik terbaik keamanan, dan administrasi server

#### Tantangan Teknis {#technical-challenges}

* Masalah pengiriman email (pesan ditandai sebagai spam)
* Mengikuti standar keamanan yang terus berkembang
* Memastikan ketersediaan dan keandalan tinggi
* Mengelola penyaringan spam secara efektif

Seperti yang dikatakan oleh seorang self-hoster berpengalaman: "Email adalah layanan komoditas... Lebih murah untuk meng-host email saya di \[penyedia] daripada menghabiskan uang *dan* waktu untuk self-hosting."\[^6]


## Mengapa Layanan Berbayar Kami Masuk Akal (Meskipun Kami Open-Source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Mengingat tantangan self-hosting, layanan berbayar kami menawarkan yang terbaik dari kedua dunia: transparansi dan keamanan open-source dengan kenyamanan dan keandalan layanan terkelola.

### Perbandingan Biaya {#cost-comparison}

Ketika Anda mempertimbangkan biaya finansial dan waktu, layanan berbayar kami menawarkan nilai luar biasa:

* **Total biaya self-hosting**: $56-$252/bulan (termasuk biaya server dan penilaian waktu)
* **Paket berbayar Forward Email**: $3-$9/bulan

Layanan berbayar kami menyediakan:

* Manajemen dan pemeliharaan profesional
* Reputasi IP yang sudah mapan untuk pengiriman yang lebih baik
* Pembaruan keamanan dan pemantauan rutin
* Dukungan saat masalah muncul
* Semua manfaat privasi dari pendekatan open-source kami

### Yang Terbaik dari Kedua Dunia {#the-best-of-both-worlds}

Dengan memilih Forward Email, Anda mendapatkan:

1. **Privasi yang Dapat Diverifikasi**: Basis kode open-source kami berarti Anda dapat mempercayai klaim privasi kami
2. **Manajemen Profesional**: Tidak perlu menjadi ahli server email
3. **Efektivitas Biaya**: Total biaya lebih rendah dibandingkan self-hosting
4. **Kebebasan dari Lock-in**: Opsi untuk self-hosting selalu tersedia


## Tipu Daya Closed-Source: Apa yang Proton dan Tutanota Tidak Beritahu Anda {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Mari kita lihat lebih dekat bagaimana pendekatan kami berbeda dari penyedia email "fokus privasi" populer.

### Klaim Open-Source Proton Mail {#proton-mails-open-source-claims}

Proton Mail mengiklankan dirinya sebagai open-source, tetapi ini hanya berlaku untuk aplikasi frontend mereka. Backend mereka—tempat email Anda sebenarnya diproses dan disimpan—tetap closed-source\[^7]. Ini berarti:

* Anda tidak dapat memverifikasi bagaimana email Anda ditangani
* Anda harus mempercayai klaim privasi mereka tanpa verifikasi
* Kerentanan keamanan di backend mereka tetap tersembunyi dari pengawasan publik
* Anda terkunci dalam ekosistem mereka tanpa opsi self-hosting

### Pendekatan Serupa Tutanota {#tutanotas-similar-approach}

Seperti Proton Mail, Tutanota hanya membuka kode frontend mereka sementara backend tetap proprietary\[^8]. Mereka menghadapi masalah kepercayaan yang sama:

* Tidak ada cara untuk memverifikasi klaim privasi backend
* Transparansi terbatas dalam pemrosesan email sebenarnya
* Potensi masalah keamanan tersembunyi dari pandangan publik
* Vendor lock-in tanpa opsi self-hosting

### Debat Privacy Guides {#the-privacy-guides-debate}

Batasan ini tidak luput dari perhatian komunitas privasi. Dalam diskusi di Privacy Guides, kami menyoroti perbedaan penting ini:

> "Dinyatakan bahwa baik Protonmail maupun Tuta adalah closed source. Karena backend mereka memang closed source."\[^9]

Kami juga menyatakan:

> "Belum ada audit yang dibagikan secara publik dari infrastruktur backend penyedia layanan email PG yang terdaftar maupun potongan kode open source yang dibagikan tentang bagaimana mereka memproses email masuk."\[^10]
Kurangnya transparansi ini menciptakan masalah kepercayaan yang mendasar. Tanpa backend sumber terbuka, pengguna dipaksa untuk mempercayai klaim privasi berdasarkan kepercayaan, bukan verifikasi.


## Masa Depan adalah Sumber Terbuka {#the-future-is-open-source}

Tren menuju solusi sumber terbuka semakin cepat di seluruh industri perangkat lunak. Menurut penelitian terbaru:

* Pasar perangkat lunak sumber terbuka tumbuh dari $41,83 miliar pada 2024 menjadi $48,92 miliar pada 2025\[^11]
* 80% perusahaan melaporkan peningkatan penggunaan sumber terbuka selama setahun terakhir\[^12]
* Adopsi sumber terbuka diperkirakan akan terus mengalami ekspansi yang cepat

Pertumbuhan ini mencerminkan pergeseran mendasar dalam cara kita memandang keamanan dan privasi perangkat lunak. Seiring pengguna menjadi lebih sadar privasi, permintaan akan privasi yang dapat diverifikasi melalui solusi sumber terbuka hanya akan meningkat.

### Mengapa Sumber Terbuka Menang {#why-open-source-is-winning}

Keunggulan sumber terbuka semakin jelas:

1. **Keamanan Melalui Transparansi**: Kode sumber terbuka dapat ditinjau oleh ribuan ahli, bukan hanya tim internal
2. **Inovasi Lebih Cepat**: Pengembangan kolaboratif mempercepat perbaikan
3. **Kepercayaan Melalui Verifikasi**: Klaim dapat diverifikasi, bukan hanya dipercayai
4. **Kebebasan dari Ketergantungan Vendor**: Pengguna mempertahankan kontrol atas data dan layanan mereka
5. **Dukungan Komunitas**: Komunitas global membantu mengidentifikasi dan memperbaiki masalah


## Beralih ke Forward Email {#making-the-switch-to-forward-email}

Beralih ke Forward Email mudah, baik Anda berasal dari penyedia utama seperti Gmail atau layanan yang berfokus pada privasi seperti Proton Mail atau Tutanota.

Layanan kami menawarkan:

* Domain dan alias tanpa batas
* Dukungan protokol standar (SMTP, IMAP, POP3) tanpa jembatan proprietary
* Integrasi mulus dengan klien email yang sudah ada
* Proses pengaturan sederhana dengan dokumentasi lengkap
* Paket harga terjangkau mulai dari hanya $3/bulan


## Kesimpulan: Email Sumber Terbuka untuk Masa Depan yang Privat {#conclusion-open-source-email-for-a-private-future}

Di dunia di mana privasi digital semakin terancam, transparansi solusi sumber terbuka menyediakan perlindungan yang krusial. Di Forward Email, kami bangga memimpin dengan pendekatan email privasi yang sepenuhnya sumber terbuka.

Berbeda dengan pesaing yang hanya sebagian mengadopsi sumber terbuka, kami telah membuat seluruh platform kami—frontend dan backend—tersedia untuk pengawasan publik. Komitmen terhadap transparansi ini, dikombinasikan dengan pendekatan teknis inovatif kami, memberikan tingkat privasi yang dapat diverifikasi yang tidak dapat ditandingi oleh alternatif tertutup.

Apakah Anda memilih menggunakan layanan kami yang dikelola atau meng-host platform kami sendiri, Anda mendapatkan manfaat dari keamanan, privasi, dan ketenangan pikiran yang datang dari email yang benar-benar sumber terbuka.

Masa depan email adalah terbuka, transparan, dan berfokus pada privasi. Masa depan adalah Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "TL:DR: Seperti semua yang di-host sendiri, INI AKAN MEMBUTUHKAN WAKTU ANDA. Jika Anda tidak punya waktu untuk mengurusnya, selalu lebih baik menggunakan layanan yang di-hosting..." [Self-hosting an email server? Why or why not? What's popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail mengklaim sebagai open-source, tetapi back-end mereka sebenarnya adalah closed source." [Tutanota vs Proton Mail Comparison (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota mengklaim sebagai open-source, tetapi back-end mereka sebenarnya adalah closed-source." [Proton Mail vs Tutanota Comparison (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Dinyatakan bahwa baik Protonmail maupun Tuta adalah closed source. Karena back-end mereka memang closed source." [Forward Email (email provider) - Site Development / Tool Suggestions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Belum ada audit yang dibagikan secara publik dari infrastruktur back-end penyedia layanan email PG yang terdaftar maupun potongan kode open source yang dibagikan tentang bagaimana mereka memproses email masuk." [Forward Email (email provider) - Site Development / Tool Suggestions](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Pasar perangkat lunak open source akan tumbuh dari USD 41,83 miliar pada 2024 menjadi USD 48,92 miliar pada 2025 dengan tingkat pertumbuhan majemuk..." [What Is Open Source Software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Dengan 80% perusahaan melaporkan peningkatan pemanfaatan teknologi open source selama setahun terakhir, ini..." [Emerging Trends in Open Source Communities 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
