# Tentang Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Tim dan cerita perusahaan Forward Email" class="rounded-lg" />

# Tentang Forward Email {#about-forward-email-1}


## Daftar Isi {#table-of-contents}

* [Ikhtisar](#overview)
* [Pendiri dan Misi](#founder-and-mission)
* [Garis Waktu](#timeline)
  * [2017 - Pendiri dan Peluncuran](#2017---founding-and-launch)
  * [2018 - Infrastruktur dan Integrasi](#2018---infrastructure-and-integration)
  * [2019 - Revolusi Performa](#2019---performance-revolution)
  * [2020 - Fokus Privasi dan Keamanan](#2020---privacy-and-security-focus)
  * [2021 - Modernisasi Platform](#2021---platform-modernization)
  * [2023 - Perluasan Infrastruktur dan Fitur](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimasi Layanan dan Fitur Lanjutan](#2024---service-optimization-and-advanced-features)
  * [2025 - Peningkatan Privasi dan Dukungan Protokol {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Kepatuhan RFC dan Penyaringan Lanjutan {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Prinsip Inti](#core-principles)
* [Status Saat Ini](#current-status)


## Ikhtisar {#overview}

> \[!TIP]
> Untuk detail teknis tentang arsitektur kami, implementasi keamanan, dan roadmap, lihat [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email adalah layanan [penerusan email](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") [gratis dan sumber terbuka](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") yang berfokus pada [hak privasi](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") pengguna. Apa yang dimulai sebagai solusi penerusan email sederhana pada tahun 2017 telah berkembang menjadi platform email komprehensif yang menawarkan nama domain khusus tanpa batas, alamat email dan alias tanpa batas, alamat email sekali pakai tanpa batas, perlindungan spam dan phishing, penyimpanan kotak surat terenkripsi, dan banyak fitur canggih lainnya.

Layanan ini dipelihara dan dimiliki oleh tim pendiri asli yang terdiri dari desainer dan pengembang. Layanan ini dibangun dengan perangkat lunak 100% sumber terbuka menggunakan [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), dan [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Pendiri dan Misi {#founder-and-mission}

Forward Email didirikan oleh **Nicholas Baugh** pada tahun 2017. Menurut [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf), Baugh awalnya mencari solusi yang hemat biaya dan sederhana untuk mengaktifkan email pada nama domain untuk proyek sampingannya. Setelah meneliti opsi yang tersedia, ia mulai membuat kode solusi sendiri dan membeli domain `forwardemail.net` pada tanggal 2 Oktober 2017.

Misi Forward Email melampaui penyediaan layanan email—mereka bertujuan mengubah cara industri mendekati privasi dan keamanan email. Nilai inti perusahaan meliputi transparansi, kontrol pengguna, dan perlindungan privasi melalui implementasi teknis, bukan hanya janji kebijakan.


## Garis Waktu {#timeline}

### 2017 - Pendiri dan Peluncuran {#2017---founding-and-launch}

**2 Oktober 2017**: Nicholas Baugh membeli domain `forwardemail.net` setelah meneliti solusi email yang hemat biaya untuk proyek sampingannya.

**5 November 2017**: Baugh membuat file JavaScript sepanjang 634 baris menggunakan [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") untuk meneruskan email untuk nama domain khusus apa pun. Implementasi awal ini dipublikasikan sebagai sumber terbuka di [GitHub](https://github.com/forwardemail) dan layanan diluncurkan menggunakan GitHub Pages.
**November 2017**: Forward Email secara resmi diluncurkan setelah rilis awal. Versi awalnya murni berbasis DNS tanpa proses pendaftaran akun atau sign-up—hanya sebuah file README yang ditulis dalam Markdown dengan instruksi. Pengguna dapat mengatur penerusan email dengan mengonfigurasi catatan MX untuk mengarah ke `mx1.forwardemail.net` dan `mx2.forwardemail.net`, serta menambahkan catatan TXT dengan `forward-email=user@gmail.com`.

Kesederhanaan dan efektivitas solusi ini menarik perhatian dari pengembang terkemuka, termasuk [David Heinemeier Hansson](https://dhh.dk) (pencipta Ruby on Rails), yang hingga kini masih menggunakan Forward Email pada domainnya `dhh.dk`.

### 2018 - Infrastruktur dan Integrasi {#2018---infrastructure-and-integration}

**April 2018**: Ketika [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") meluncurkan [layanan DNS konsumen yang mengutamakan privasi](https://blog.cloudflare.com/announcing-1111/), Forward Email beralih dari menggunakan [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") ke [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") untuk menangani pencarian [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), menunjukkan komitmen perusahaan terhadap pilihan infrastruktur yang fokus pada privasi.

**Oktober 2018**: Forward Email memungkinkan pengguna untuk "Kirim Email Sebagai" dengan [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") dan [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), memperluas kemampuan integrasi dengan penyedia email populer.

### 2019 - Revolusi Performa {#2019---performance-revolution}

**Mei 2019**: Forward Email merilis v2, yang merupakan penulisan ulang besar dari versi awal. Pembaruan ini fokus pada peningkatan [performa](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") melalui penggunaan [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [streams](https://en.wikipedia.org/wiki/Streams "Streams"), membangun fondasi untuk skalabilitas platform.

### 2020 - Fokus Privasi dan Keamanan {#2020---privacy-and-security-focus}

**Februari 2020**: Forward Email merilis rencana Perlindungan Privasi Ditingkatkan, memungkinkan pengguna untuk mematikan pengaturan entri catatan DNS publik dengan alias konfigurasi penerusan email mereka. Melalui rencana ini, informasi alias email pengguna disembunyikan dari pencarian publik di Internet. Perusahaan juga merilis fitur untuk mengaktifkan atau menonaktifkan alias tertentu sambil tetap membiarkan alias tersebut muncul sebagai alamat email yang valid dan mengembalikan [kode status SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") yang berhasil, dengan email langsung dibuang (mirip dengan mengalihkan output ke [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Setelah menghadapi banyak kendala dengan solusi deteksi spam yang ada yang tidak menghormati kebijakan privasi Forward Email, perusahaan merilis versi alfa awal dari Spam Scanner mereka. Solusi [filter anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") yang sepenuhnya gratis dan open-source ini menggunakan pendekatan [filter spam Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") yang dikombinasikan dengan perlindungan [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") dan [serangan homograf IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email juga merilis [otentikasi dua faktor](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) menggunakan [kata sandi sekali pakai](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) untuk keamanan akun yang lebih baik.

**Mei 2020**: Forward Email memungkinkan [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") kustom sebagai solusi bagi pengguna untuk mengatasi pemblokiran port oleh [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") mereka. Perusahaan juga merilis [Free Email Forwarding RESTful API](email-api) dengan dokumentasi lengkap dan contoh permintaan serta respons secara real-time, bersama dengan dukungan untuk webhook.
**Agustus 2020**: Forward Email menambahkan dukungan untuk sistem otentikasi email [Authenticated Received Chain](arc) ("ARC"), memperkuat keamanan dan keterkiriman email.

**23 November 2020**: Forward Email secara publik meluncurkan layanan mereka keluar dari program beta, menandai tonggak penting dalam pengembangan platform.

### 2021 - Modernisasi Platform {#2021---platform-modernization}

**Februari 2021**: Forward Email merombak basis kode mereka untuk menghilangkan semua ketergantungan pada [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), memungkinkan tumpukan teknologi mereka menjadi 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") dan [Node.js](https://en.wikipedia.org/wiki/Node.js). Keputusan arsitektur ini sejalan dengan komitmen perusahaan untuk mempertahankan tumpukan teknologi open-source yang konsisten.

**27 September 2021**: Forward Email [menambahkan dukungan](email-forwarding-regex-pattern-filter) untuk alias penerusan email yang dapat mencocokkan [ekspresi reguler](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), memberikan pengguna kemampuan pengalihan email yang lebih canggih.

### 2023 - Ekspansi Infrastruktur dan Fitur {#2023---infrastructure-and-feature-expansion}

**Januari 2023**: Forward Email meluncurkan situs web yang didesain ulang dan dioptimalkan kecepatan halamannya, meningkatkan pengalaman pengguna dan performa.

**Februari 2023**: Perusahaan menambahkan dukungan untuk [log kesalahan](/faq#do-you-store-error-logs) dan menerapkan skema warna situs web [mode gelap](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), menanggapi preferensi pengguna dan kebutuhan aksesibilitas.

**Maret 2023**: Forward Email merilis [Tangerine](https://github.com/forwardemail/tangerine#readme) dan mengintegrasikannya ke seluruh infrastruktur mereka, memungkinkan penggunaan [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") pada lapisan aplikasi. Perusahaan juga menambahkan dukungan untuk [MTA-STS](/faq#do-you-support-mta-sts) dan beralih dari [hCaptcha](/) ke [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email mengimplementasikan dan mengotomatisasi infrastruktur baru sepenuhnya. Seluruh layanan mulai berjalan pada DNS yang seimbang beban secara global dan berbasis kedekatan dengan pemeriksaan kesehatan dan failover menggunakan [Cloudflare](https://cloudflare.com), menggantikan pendekatan DNS round-robin sebelumnya. Perusahaan beralih ke **server bare metal** di beberapa penyedia, termasuk [Vultr](https://www.vultr.com/?ref=429848) dan [Digital Ocean](https://m.do.co/c/a7cecd27e071), keduanya penyedia yang mematuhi SOC 2 Tipe 1. Basis data MongoDB dan Redis dipindahkan ke konfigurasi klaster dengan node utama dan cadangan untuk ketersediaan tinggi, enkripsi SSL end-to-end, enkripsi saat penyimpanan, dan pemulihan titik waktu (PITR).

**Mei 2023**: Forward Email meluncurkan fitur **SMTP keluar** mereka untuk [mengirim email dengan SMTP](/faq#do-you-support-sending-email-with-smtp) dan [mengirim email dengan API](/faq#do-you-support-sending-email-with-api). Fitur ini mencakup perlindungan bawaan untuk memastikan keterkiriman tinggi, sistem antrean dan pengulangan modern dan kuat, serta [mendukung log kesalahan secara real-time](/faq#do-you-store-error-logs).

**November 2023**: Forward Email meluncurkan fitur [**penyimpanan kotak surat terenkripsi**](/blog/docs/best-quantum-safe-encrypted-email-service) untuk [dukungan IMAP](/faq#do-you-support-receiving-email-with-imap), yang merupakan kemajuan signifikan dalam privasi dan keamanan email.

**Desember 2023**: Perusahaan [menambahkan dukungan](/faq#do-you-support-pop3) untuk [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys dan WebAuthn](/faq#do-you-support-passkeys-and-webauthn), pemantauan [waktu sampai inbox](/faq#i), dan [OpenPGP untuk Penyimpanan IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimasi Layanan dan Fitur Lanjutan {#2024---service-optimization-and-advanced-features}

**Februari 2024**: Forward Email [menambahkan dukungan kalender (CalDAV)](/faq#do-you-support-calendars-caldav), memperluas kemampuan platform melampaui email untuk menyertakan sinkronisasi kalender.
**Maret hingga Juli 2024**: Forward Email merilis optimasi dan peningkatan besar pada layanan IMAP, POP3, dan CalDAV mereka, dengan tujuan membuat layanan mereka secepat, jika tidak lebih cepat, dari alternatif lain.

**Juli 2024**: Perusahaan [menambahkan dukungan iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) untuk mengatasi kurangnya dukungan perintah IMAP `IDLE` pada Apple Mail di iOS, memungkinkan notifikasi waktu nyata untuk perangkat Apple iOS. Forward Email juga menambahkan pemantauan waktu ke inbox ("TTI") untuk layanan mereka sendiri dan Yahoo/AOL, serta mulai mengizinkan pengguna mengenkripsi seluruh catatan DNS TXT mereka bahkan pada paket gratis. Sesuai permintaan dalam [diskusi Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) dan [isu GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), perusahaan menambahkan kemampuan bagi alias untuk menolak dengan tenang `250`, menolak lunak `421`, atau menolak keras `550` saat dinonaktifkan.

**Agustus 2024**: Forward Email menambahkan dukungan untuk mengekspor kotak surat dalam format [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) dan [Mbox](https://en.wikipedia.org/wiki/Mbox) (selain format ekspor [SQLite](https://en.wikipedia.org/wiki/SQLite) yang sudah ada). [Dukungan tanda tangan webhook ditambahkan](https://forwardemail.net/faq#do-you-support-bounce-webhooks), dan perusahaan mulai mengizinkan pengguna mengirim buletin, pengumuman, dan pemasaran email melalui layanan SMTP keluar mereka. Kuota penyimpanan domain dan alias khusus untuk IMAP/POP3/CalDAV juga diterapkan.

### 2025 - Peningkatan Privasi dan Dukungan Protokol {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**September 2024 hingga Januari 2025**: Forward Email [menambahkan fitur vacation responder yang sangat diminta dan enkripsi OpenPGP/WKD untuk penerusan email](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), membangun kemampuan penyimpanan kotak surat terenkripsi yang sudah mereka terapkan.

**21 Januari 2025**: Sahabat pendiri "Jack", anjing setianya, meninggal dengan damai pada usia hampir 11 tahun. Jack [akan selalu dikenang](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) atas kesetiaan yang tak tergoyahkan yang mendukung penciptaan Forward Email. [Whitepaper Teknis Forward Email](https://forwardemail.net/technical-whitepaper.pdf) didedikasikan untuk Jack, mengakui perannya dalam pengembangan layanan ini.

**Februari 2025**: Forward Email beralih ke [DataPacket](https://www.datapacket.com) sebagai penyedia pusat data utama baru mereka, mengimplementasikan perangkat keras bare-metal khusus yang berfokus pada performa untuk meningkatkan keandalan dan kecepatan layanan.

**Maret 2025**: Versi 1.0 Forward Email secara resmi dirilis.

**April 2025**: Versi pertama dari [Whitepaper Teknis Forward Email](https://forwardemail.net/technical-whitepaper.pdf) diterbitkan, dan perusahaan mulai menerima pembayaran dengan cryptocurrency.

**Mei 2025**: Layanan meluncurkan dokumentasi API baru menggunakan [Scalar](https://github.com/scalar/scalar).

**Juni 2025**: Forward Email meluncurkan dukungan untuk [protokol CardDAV](/faq#do-you-support-contacts-carddav), memperluas kemampuan platform untuk menyertakan sinkronisasi kontak selain layanan email dan kalender yang sudah ada.

**Agustus 2025**: Platform menambahkan dukungan [CalDAV VTODO/tugas](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), memungkinkan manajemen tugas selain acara kalender.

**November 2025**: Keamanan platform ditingkatkan dengan migrasi dari PBKDF2 ke [Argon2id](https://en.wikipedia.org/wiki/Argon2) untuk hashing kata sandi, dan infrastruktur dimigrasikan dari Redis ke [Valkey](https://github.com/valkey-io/valkey).

**Desember 2025**: Versi 2.0 dirilis, memperkenalkan dukungan [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) untuk enkripsi TLS yang dipaksakan pada transport email dan peningkatan ke [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - Kepatuhan RFC dan Penyaringan Lanjutan {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Januari 2026**: Forward Email merilis [dokumen kepatuhan protokol RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) yang komprehensif dan menambahkan dukungan untuk [enkripsi S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) serta penyaringan email [Sieve yang lengkap (RFC 5228)](/faq#do-you-support-sieve-email-filtering) dengan dukungan protokol [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API juga diperluas menjadi 39 endpoint.

**Februari 2026**: Klien webmail resmi dan open-source diluncurkan di [mail.forwardemail.net](https://mail.forwardemail.net) ([kode sumber di GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Platform ini juga menambahkan dukungan untuk [Ekstensi Penjadwalan CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities), dan [Domain Connect](https://domainconnect.org) untuk pengaturan DNS 1-klik. Notifikasi push real-time untuk IMAP, CalDAV, dan CardDAV diluncurkan menggunakan WebSockets.

**Maret 2026**: Dukungan untuk penyimpanan khusus per-domain yang kompatibel dengan S3 ditambahkan, bersama dengan alat baris perintah untuk manajemen. Pengerjaan aplikasi desktop dan mobile lintas platform untuk macOS, Windows, Linux, iOS, dan Android dimulai menggunakan basis kode webmail open-source yang sama, dibangun dengan [Tauri](https://tauri.app).


## Prinsip Inti {#core-principles}

Sejak awal, Forward Email telah mempertahankan komitmen teguh terhadap prinsip privasi dan keamanan:

**Filosofi 100% Open-Source**: Berbeda dengan pesaing yang hanya membuka kode frontend sementara backend tetap tertutup, Forward Email telah membuat seluruh basis kodenya—baik frontend maupun backend—tersedia untuk pemeriksaan publik di [GitHub](https://github.com/forwardemail).

**Desain Berorientasi Privasi**: Sejak hari pertama, Forward Email menerapkan pendekatan pemrosesan dalam memori yang unik yang menghindari penulisan email ke disk, membedakannya dari layanan email konvensional yang menyimpan pesan di database atau sistem file.

**Inovasi Berkelanjutan**: Layanan ini telah berkembang dari solusi penerusan email sederhana menjadi platform email komprehensif dengan fitur seperti kotak surat terenkripsi, enkripsi tahan kuantum, dan dukungan untuk protokol standar termasuk SMTP, IMAP, POP3, dan CalDAV.

**Transparansi**: Membuka semua kode secara open-source dan tersedia untuk inspeksi, memastikan pengguna dapat memverifikasi klaim privasi daripada hanya mempercayai pernyataan pemasaran.

**Kontrol Pengguna**: Memberdayakan pengguna dengan opsi, termasuk kemampuan untuk meng-host sendiri seluruh platform jika diinginkan.


## Status Saat Ini {#current-status}

Per Maret 2026, Forward Email melayani lebih dari 500.000 domain di seluruh dunia, termasuk organisasi dan pemimpin industri terkemuka seperti:

* **Perusahaan Teknologi**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organisasi Media**: Fox News Radio, Disney Ad Sales
* **Institusi Pendidikan**: Universitas Cambridge, Universitas Maryland, Universitas Washington, Tufts University, Swarthmore College
* **Entitas Pemerintah**: Pemerintah Australia Selatan, Pemerintah Republik Dominika
* **Organisasi Lainnya**: RCD Hotels, Fly<span>.</span>io
* **Pengembang Terkenal**: Isaac Z. Schlueter (pencipta npm), David Heinemeier Hansson (pencipta Ruby on Rails)

Platform ini terus berkembang dengan rilis fitur dan peningkatan infrastruktur secara reguler, mempertahankan posisinya sebagai satu-satunya layanan email yang 100% open-source, terenkripsi, berfokus pada privasi, transparan, dan tahan kuantum yang tersedia saat ini.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
