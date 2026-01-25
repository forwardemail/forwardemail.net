# Tentang Email Teruskan {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Tentang Email Teruskan {#about-forward-email-1}

## Daftar Isi {#table-of-contents}

* [Ringkasan](#overview)
* [Pendiri dan Misi](#founder-and-mission)
* [Garis waktu](#timeline)
  * [2017 - Pendirian dan Peluncuran](#2017---founding-and-launch)
  * [2018 - Infrastruktur dan Integrasi](#2018---infrastructure-and-integration)
  * [2019 - Revolusi Kinerja](#2019---performance-revolution)
  * [2020 - Fokus Privasi dan Keamanan](#2020---privacy-and-security-focus)
  * [2021 - Modernisasi Platform](#2021---platform-modernization)
  * [2023 - Perluasan Infrastruktur dan Fitur](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimalisasi Layanan dan Fitur Lanjutan](#2024---service-optimization-and-advanced-features)
  * [2025 - Peningkatan Privasi dan Dukungan Protokol](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - Kepatuhan RFC dan Penyaringan Lanjutan](#2026---rfc-compliance-and-advanced-filtering)
* [Prinsip Inti](#core-principles)
* [Status Saat Ini](#current-status)

## Ikhtisar {#overview}

> \[!TIP]
> Untuk detail teknis tentang arsitektur, implementasi keamanan, dan peta jalan kami, lihat [Buku Putih Teknis](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email adalah layanan [gratis dan sumber terbuka](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [penerusan email](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") yang berfokus pada [hak privasi](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") pengguna. Berawal dari solusi penerusan email sederhana pada tahun 2017, layanan ini telah berkembang menjadi platform email komprehensif yang menawarkan nama domain kustom tanpa batas, alamat email dan alias tanpa batas, alamat email sekali pakai tanpa batas, perlindungan spam dan phishing, penyimpanan kotak surat terenkripsi, dan berbagai fitur canggih.

Layanan ini dikelola dan dimiliki oleh tim perancang dan pengembang pendirinya. Layanan ini dibangun dengan perangkat lunak sumber terbuka 100% menggunakan [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), dan [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Pendiri dan Misi {#founder-and-mission}

Forward Email didirikan oleh **Nicholas Baugh** pada tahun 2017. Menurut [Makalah Teknis Email Teruskan](https://forwardemail.net/technical-whitepaper.pdf), Baugh awalnya mencari solusi yang hemat biaya dan sederhana untuk mengaktifkan email pada nama domain untuk proyek sampingannya. Setelah meneliti opsi yang tersedia, ia mulai membuat kode solusinya sendiri dan membeli domain `forwardemail.net` pada tanggal 2 Oktober 2017.

Misi Forward Email lebih dari sekadar menyediakan layanan email—perusahaan ini bertujuan untuk mengubah cara industri menangani privasi dan keamanan email. Nilai-nilai inti perusahaan meliputi transparansi, kendali pengguna, dan perlindungan privasi melalui implementasi teknis, bukan sekadar janji kebijakan.

## Linimasa {#timeline}

### 2017 - Pendirian dan Peluncuran {#2017---founding-and-launch}

**2 Oktober 2017**: Nicholas Baugh membeli domain `forwardemail.net` setelah meneliti solusi email hemat biaya untuk proyek sampingannya.

**5 November 2017**: Baugh membuat berkas JavaScript 634 baris menggunakan [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") untuk meneruskan email untuk nama domain kustom apa pun. Implementasi awal ini dipublikasikan sebagai sumber terbuka untuk [GitHub](https://github.com/forwardemail) dan layanannya diluncurkan menggunakan GitHub Pages.

**November 2017**: Forward Email resmi diluncurkan setelah rilis awal. Versi awal sepenuhnya berbasis DNS tanpa registrasi akun atau proses pendaftaran—hanya berupa berkas README yang ditulis dalam Markdown beserta instruksinya. Pengguna dapat mengatur penerusan email dengan mengonfigurasi data MX agar mengarah ke `mx1.forwardemail.net` dan `mx2.forwardemail.net`, lalu menambahkan data TXT dengan `forward-email=user@gmail.com`.

Kesederhanaan dan efektivitas solusi ini menarik perhatian para pengembang terkemuka, termasuk [David Heinemeier Hansson](https://dhh.dk) (pencipta Ruby on Rails), yang terus menggunakan Forward Email di domainnya `dhh.dk` hingga hari ini.

### 2018 - Infrastruktur dan Integrasi {#2018---infrastructure-and-integration}

**April 2018**: Ketika [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") meluncurkan [layanan DNS konsumen yang mengutamakan privasi](https://blog.cloudflare.com/announcing-1111/), Forward Email beralih dari menggunakan [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") ke [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") untuk menangani pencarian [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), yang menunjukkan komitmen perusahaan terhadap pilihan infrastruktur yang berfokus pada privasi.

**Oktober 2018**: Forward Email memungkinkan pengguna untuk "Kirim Email Sebagai" dengan [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") dan [Pandangan](https://en.wikipedia.org/wiki/Outlook "Outlook"), memperluas kemampuan integrasi dengan penyedia email populer.

### 2019 - Revolusi Kinerja {#2019---performance-revolution}

**Mei 2019**: Forward Email merilis v2, yang merupakan perubahan besar dari versi awal. Pembaruan ini berfokus pada penyempurnaan [pertunjukan](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") melalui penggunaan [aliran sungai](https://en.wikipedia.org/wiki/Streams "Streams") dari [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), yang membangun fondasi bagi skalabilitas platform.

### 2020 - Fokus Privasi dan Keamanan {#2020---privacy-and-security-focus}

**Februari 2020**: Forward Email merilis paket Perlindungan Privasi yang Disempurnakan, yang memungkinkan pengguna untuk menonaktifkan pengaturan entri rekaman DNS publik dengan alias konfigurasi penerusan email mereka. Melalui paket ini, informasi alias email pengguna disembunyikan agar tidak dapat dicari secara publik di internet. Perusahaan juga merilis fitur untuk mengaktifkan atau menonaktifkan alias tertentu, namun tetap memungkinkan alias tersebut muncul sebagai alamat email yang valid dan menampilkan [Kode status SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") yang berhasil, dengan email yang langsung dihapus (mirip dengan menyalurkan output ke [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Setelah menghadapi banyak kendala dengan solusi deteksi spam yang ada dan tidak mematuhi kebijakan privasi Forward Email, perusahaan merilis versi alfa awal Spam Scanner. Solusi [penyaringan anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") yang sepenuhnya gratis dan bersumber terbuka ini menggunakan pendekatan [Filter spam Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") yang dikombinasikan dengan perlindungan [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") dan [Serangan homograf IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email juga merilis [otentikasi dua faktor](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) menggunakan [kata sandi sekali pakai](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) untuk keamanan akun yang lebih baik.

**Mei 2020**: Forward Email mengizinkan [penerusan porta](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") khusus sebagai solusi bagi pengguna untuk menghindari pemblokiran port oleh [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") mereka. Perusahaan juga merilis [Penerusan Email Gratis RESTful API](email-api) mereka dengan dokumentasi lengkap dan contoh permintaan dan respons real-time, serta dukungan untuk webhook.

**Agustus 2020**: Forward Email menambahkan dukungan untuk sistem autentikasi email [Rantai Diterima yang Diautentikasi](arc) ("ARC"), yang semakin memperkuat keamanan dan pengiriman email.

**23 November 2020**: Forward Email diluncurkan secara publik dari program beta mereka, menandai tonggak penting dalam pengembangan platform.

### 2021 - Modernisasi Platform {#2021---platform-modernization}

**Februari 2021**: Forward Email merombak basis kode mereka untuk menghapus semua dependensi [Ular piton](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (bahasa pemrograman)"), sehingga tumpukan mereka menjadi 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") dan [Node.js](https://en.wikipedia.org/wiki/Node.js). Keputusan arsitektur ini sejalan dengan komitmen perusahaan untuk mempertahankan tumpukan teknologi sumber terbuka yang konsisten.

**27 September 2021**: Teruskan Email [dukungan tambahan](email-forwarding-regex-pattern-filter) untuk alias penerusan email agar sesuai dengan [ekspresi reguler](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), yang memberi pengguna kemampuan perutean email yang lebih canggih.

### 2023 - Perluasan Infrastruktur dan Fitur {#2023---infrastructure-and-feature-expansion}

**Januari 2023**: Forward Email meluncurkan situs web yang didesain ulang dan dioptimalkan kecepatan halaman, meningkatkan pengalaman dan kinerja pengguna.

**Februari 2023**: Perusahaan menambahkan dukungan untuk [log kesalahan](/faq#do-you-store-error-logs) dan menerapkan skema warna situs web [mode gelap](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), menanggapi preferensi pengguna dan kebutuhan aksesibilitas.

**Maret 2023**: Forward Email merilis [Jeruk keprok](https://github.com/forwardemail/tangerine#readme) dan mengintegrasikannya ke seluruh infrastruktur mereka, memungkinkan penggunaan [DNS melalui HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") di lapisan aplikasi. Perusahaan juga menambahkan dukungan untuk [MTA-STS](/faq#do-you-support-mta-sts) dan beralih dari [hCaptcha](/) ke [Pintu Putar Cloudflare](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email mengimplementasikan dan mengotomatiskan infrastruktur yang sepenuhnya baru. Seluruh layanan mulai berjalan pada DNS berbasis kedekatan dan penyeimbangan beban global dengan pemeriksaan kesehatan dan failover menggunakan [Cloudflare](https://cloudflare.com), menggantikan pendekatan DNS round-robin sebelumnya. Perusahaan beralih ke **server bare metal** di beberapa penyedia, termasuk [Vultr](https://www.vultr.com/?ref=429848) dan [Lautan Digital](https://m.do.co/c/a7cecd27e071), keduanya penyedia yang sesuai dengan SOC 2 Tipe 1. Database MongoDB dan Redis dipindahkan ke konfigurasi klaster dengan node primer dan siaga untuk ketersediaan tinggi, enkripsi SSL ujung ke ujung, enkripsi saat istirahat, dan pemulihan titik waktu (PITR).

**Mei 2023**: Forward Email meluncurkan fitur **SMTP keluar** untuk permintaan [mengirim email dengan SMTP](/faq#do-you-support-sending-email-with-smtp) dan [mengirim email dengan API](/faq#do-you-support-sending-email-with-api). Fitur ini mencakup perlindungan bawaan untuk memastikan pengiriman yang tinggi, sistem antrean dan coba ulang yang modern dan tangguh, serta [mendukung log kesalahan secara real-time](/faq#do-you-store-error-logs).

**November 2023**: Forward Email meluncurkan fitur [**penyimpanan kotak surat terenkripsi**](/blog/docs/best-quantum-safe-encrypted-email-service) untuk [Dukungan IMAP](/faq#do-you-support-receiving-email-with-imap), yang menunjukkan kemajuan signifikan dalam privasi dan keamanan email.

**Desember 2023**: Perusahaan [dukungan tambahan](/faq#do-you-support-pop3) untuk pemantauan [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [kunci sandi dan WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [saatnya masuk ke kotak masuk](/faq#i), dan [OpenPGP untuk Penyimpanan IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimalisasi Layanan dan Fitur Lanjutan {#2024---service-optimization-and-advanced-features}

**Februari 2024**: Teruskan Email [menambahkan dukungan kalender (CalDAV)](/faq#do-you-support-calendars-caldav), memperluas kemampuan platform di luar email untuk menyertakan sinkronisasi kalender.

**Maret hingga Juli 2024**: Forward Email merilis pengoptimalan dan peningkatan utama pada layanan IMAP, POP3, dan CalDAV mereka, dengan tujuan membuat layanan mereka secepat, jika tidak lebih cepat daripada, alternatifnya.

**Juli 2024**: Perusahaan [menambahkan dukungan iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) mengatasi kurangnya dukungan perintah IMAP `IDLE` pada Apple Mail di iOS, yang memungkinkan notifikasi real-time untuk perangkat Apple iOS. Forward Email juga menambahkan waktu pemantauan kotak masuk ("TTI") untuk layanan mereka sendiri dan Yahoo/AOL, serta mulai memungkinkan pengguna untuk mengenkripsi seluruh data DNS TXT mereka, bahkan pada paket gratis. Sebagaimana diminta dalam [Diskusi Panduan Privasi](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) dan [Masalah GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), perusahaan menambahkan kemampuan bagi alias untuk menolak `250` secara diam-diam, menolak secara halus `421`, atau menolak secara keras `550` saat dinonaktifkan.

**Agustus 2024**: Forward Email menambahkan dukungan untuk mengekspor kotak surat sebagai format [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) dan [Mbox](https://en.wikipedia.org/wiki/Mbox) (selain format ekspor [SQLite](https://en.wikipedia.org/wiki/SQLite) yang sudah ada). [Dukungan tanda tangan webhook telah ditambahkan](https://forwardemail.net/faq#do-you-support-bounce-webhooks), dan perusahaan mulai mengizinkan pengguna untuk mengirim buletin, pengumuman, dan pemasaran email melalui layanan SMTP keluar mereka. Kuota penyimpanan untuk seluruh domain dan khusus alias untuk IMAP/POP3/CalDAV juga diimplementasikan.

### 2025 - Peningkatan Privasi dan Dukungan Protokol {#2025---privacy-enhancements-and-protocol-support}

**September 2024 hingga Januari 2025**: Teruskan Email [menambahkan fitur penjawab liburan yang sangat diminta dan enkripsi OpenPGP/WKD untuk penerusan email](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), berdasarkan kemampuan penyimpanan kotak surat terenkripsi yang telah diterapkan.

**21 Januari 2025**: Sahabat pendiri, "Jack", anjing kesayangannya yang setia, meninggal dunia dengan tenang di usia hampir 11 tahun. Jack [akan selalu diingat](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) atas dukungannya yang tak tergoyahkan dalam pembuatan Forward Email. [Makalah Teknis Email Teruskan](https://forwardemail.net/technical-whitepaper.pdf) didedikasikan untuk Jack, sebagai bentuk pengakuan atas perannya dalam pengembangan layanan ini.

**Februari 2025**: Forward Email beralih ke [Paket Data](https://www.datapacket.com) sebagai penyedia pusat data utama baru mereka, yang menerapkan perangkat keras bare-metal khusus yang berfokus pada kinerja untuk lebih meningkatkan keandalan dan kecepatan layanan.

**Juni 2025**: Forward Email meluncurkan dukungan untuk [Protokol CardDAV](/faq#do-you-support-contacts-carddav), memperluas kemampuan platform untuk menyertakan sinkronisasi kontak di samping layanan email dan kalender yang ada.

### 2026 - Kepatuhan RFC dan Penyaringan Lanjutan {#2026---rfc-compliance-and-advanced-filtering}

**Januari 2026**: Forward Email merilis dokumen komprehensif [kepatuhan protokol RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) yang merinci dukungan standar lengkap untuk SMTP, IMAP, POP3, dan CalDAV. Platform juga menambahkan [dukungan REQUIRETLS (RFC 8689)](/faq#requiretls-support) untuk enkripsi TLS yang dipaksakan pada transportasi email, [enkripsi S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) untuk penandatanganan dan enkripsi pesan yang aman, dan [penyaringan email Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) dengan [protokol ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) untuk penyaringan email sisi server. [REST API](/email-api) diperluas menjadi 39 endpoint yang mencakup pesan, folder, kontak, kalender, dan acara kalender.

## Prinsip Inti {#core-principles}

Sejak awal berdirinya, Forward Email telah mempertahankan komitmen teguh terhadap prinsip privasi dan keamanan:

**Filosofi 100% Sumber Terbuka**: Tidak seperti pesaing yang hanya membuka sumber frontend mereka sementara backend tetap tertutup, Forward Email telah membuat seluruh basis kodenya—baik frontend maupun backend—tersedia untuk pengawasan publik di [GitHub](https://github.com/forwardemail).

**Desain Mengutamakan Privasi**: Sejak hari pertama, Forward Email menerapkan pendekatan pemrosesan dalam memori yang unik yang menghindari penulisan email ke disk, membedakannya dari layanan email konvensional yang menyimpan pesan dalam basis data atau sistem file.

**Inovasi Berkelanjutan**: Layanan ini telah berkembang dari solusi penerusan email sederhana menjadi platform email komprehensif dengan fitur-fitur seperti kotak surat terenkripsi, enkripsi tahan kuantum, dan dukungan untuk protokol standar termasuk SMTP, IMAP, POP3, dan CalDAV.

**Transparansi**: Menjadikan semua kode sumber terbuka dan tersedia untuk diperiksa, memastikan pengguna dapat memverifikasi klaim privasi alih-alih sekadar mempercayai pernyataan pemasaran.

**Kontrol Pengguna**: Memberdayakan pengguna dengan berbagai pilihan, termasuk kemampuan untuk menghosting sendiri seluruh platform jika diinginkan.

## Status Saat Ini {#current-status}

Pada tahun 2025, Forward Email melayani lebih dari 500.000 domain di seluruh dunia, termasuk organisasi terkemuka dan pemimpin industri seperti:

* **Perusahaan Teknologi**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organisasi Media**: Fox News Radio, Disney Ad Sales
* **Lembaga Pendidikan**: Universitas Cambridge, Universitas Maryland, Universitas Washington, Universitas Tufts, Swarthmore College
* **Entitas Pemerintah**: Pemerintah Australia Selatan, Pemerintah Republik Dominika
* **Organisasi Lain**: RCD Hotels, Fly<span>.</span>io
* **Pengembang Terkemuka**: Isaac Z. Schlueter (pencipta npm), David Heinemeier Hansson (pencipta Ruby on Rails)

Platform ini terus berkembang dengan rilis fitur rutin dan peningkatan infrastruktur, mempertahankan posisinya sebagai satu-satunya layanan email 100% sumber terbuka, terenkripsi, berfokus pada privasi, transparan, dan tahan kuantum yang tersedia saat ini.

<img loading="lazy" src="/img/articles/tentang-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />