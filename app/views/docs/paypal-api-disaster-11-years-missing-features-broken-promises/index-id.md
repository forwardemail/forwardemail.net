# Bencana API PayPal Selama 11 Tahun: Bagaimana Kami Membangun Solusi Sementara Mereka Mengabaikan Pengembang {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Di Forward Email, kami telah menangani API PayPal yang rusak selama lebih dari satu dekade. Apa yang awalnya hanya frustrasi kecil telah berubah menjadi bencana total yang memaksa kami untuk membangun solusi sendiri, memblokir templat phishing mereka, dan akhirnya menghentikan semua pembayaran PayPal selama migrasi akun yang kritis.</p>
<p class="lead mt-3">Ini adalah kisah 11 tahun PayPal mengabaikan kebutuhan dasar pengembang sementara kami mencoba segala cara untuk membuat platform mereka berfungsi.</p>

## Daftar Isi {#table-of-contents}

* [Bagian yang Hilang: Tidak Ada Cara untuk Mencantumkan Langganan](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Masalah Muncul](#2014-2017-the-problem-emerges)
* [2020: Kami Memberi Mereka Umpan Balik yang Luas](#2020-we-give-them-extensive-feedback)
  * [Daftar Umpan Balik 27 Item](#the-27-item-feedback-list)
  * [Tim Terlibat, Janji Diucapkan](#teams-got-involved-promises-were-made)
  * [Hasilnya? Tidak ada.](#the-result-nothing)
* [Eksodus Eksekutif: Bagaimana PayPal Kehilangan Semua Memori Institusional](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Kepemimpinan Baru, Masalah Tetap Sama](#2025-new-leadership-same-problems)
  * [CEO Baru Terlibat](#the-new-ceo-gets-involved)
  * [Tanggapan Michelle Gill](#michelle-gills-response)
  * [Tanggapan Kami: Tidak Ada Lagi Pertemuan](#our-response-no-more-meetings)
  * [Respon Marty Brodbeck terhadap Rekayasa Berlebihan](#marty-brodbecks-overengineering-response)
  * [Kontradiksi "CRUD Sederhana"](#the-simple-crud-contradiction)
  * [Kesenjangan Menjadi Jelas](#the-disconnect-becomes-clear)
* [Laporan Bug Bertahun-tahun yang Mereka Abaikan](#years-of-bug-reports-they-ignored)
  * [2016: Keluhan Awal UI/UX](#2016-early-uiux-complaints)
  * [2021: Laporan Bug Email Bisnis](#2021-business-email-bug-report)
  * [2021: Saran Peningkatan UI](#2021-ui-improvement-suggestions)
  * [2021: Kegagalan Lingkungan Sandbox](#2021-sandbox-environment-failures)
  * [2021: Sistem Pelaporan Benar-Benar Rusak](#2021-reports-system-completely-broken)
  * [2022: Fitur API Inti Hilang (Lagi)](#2022-core-api-feature-missing-again)
* [Mimpi Buruk Pengalaman Pengembang](#the-developer-experience-nightmare)
  * [Antarmuka Pengguna Rusak](#broken-user-interface)
  * [Masalah SDK](#sdk-problems)
  * [Pelanggaran Kebijakan Keamanan Konten](#content-security-policy-violations)
  * [Kekacauan Dokumentasi](#documentation-chaos)
  * [Kerentanan Keamanan](#security-vulnerabilities)
  * [Manajemen Sesi Bencana](#session-management-disaster)
* [Juli 2025: Titik Tetes Terakhir](#july-2025-the-final-straw)
* [Mengapa Kita Tidak Bisa Begitu Saja Menghentikan PayPal](#why-we-cant-just-drop-paypal)
* [Solusi Sementara Komunitas](#the-community-workaround)
* [Memblokir Template PayPal Karena Phishing](#blocking-paypal-templates-due-to-phishing)
  * [Masalah Sebenarnya: Template PayPal Terlihat Seperti Penipuan](#the-real-problem-paypals-templates-look-like-scams)
  * [Implementasi Kami](#our-implementation)
  * [Mengapa Kami Harus Memblokir PayPal](#why-we-had-to-block-paypal)
  * [Skala Masalah](#the-scale-of-the-problem)
  * [Ironi](#the-irony)
  * [Dampak Dunia Nyata: Penipuan PayPal Baru](#real-world-impact-novel-paypal-scams)
* [Proses KYC PayPal yang Mundur](#paypals-backwards-kyc-process)
  * [Bagaimana Cara Kerjanya](#how-it-should-work)
  * [Cara Kerja PayPal Sebenarnya](#how-paypal-actually-works)
  * [Dampak Dunia Nyata](#the-real-world-impact)
  * [Bencana Migrasi Akun Juli 2025](#the-july-2025-account-migration-disaster)
  * [Mengapa Hal Ini Penting](#why-this-matters)
* [Bagaimana Setiap Pemroses Pembayaran Lain Melakukannya dengan Benar](#how-every-other-payment-processor-does-it-right)
  * [Garis](#stripe)
  * [Mendayung](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Persegi](#square)
  * [Standar Industri](#the-industry-standard)
  * [Apa Saja yang Disediakan Prosesor Lain vs PayPal](#what-other-processors-provide-vs-paypal)
* [Penutupan Sistematis PayPal: Membungkam 6 Juta Suara](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Penghapusan Besar](#the-great-erasure)
  * [Penyelamatan Pihak Ketiga](#the-third-party-rescue)
* [Bencana Bug Penangkapan 11 Tahun: $1.899 dan Terus Berlanjut](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Kerugian Forward Email Sebesar $1.899](#forward-emails-1899-loss)
  * [Laporan Asli 2013: 11+ Tahun Kelalaian](#the-2013-original-report-11-years-of-negligence)
  * [Pengakuan 2016: PayPal Merusak SDK Mereka Sendiri](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskalasi 2024: Masih Rusak](#the-2024-escalation-still-broken)
  * [Bencana Keandalan Webhook](#the-webhook-reliability-disaster)
  * [Pola Kelalaian Sistematis](#the-pattern-of-systematic-negligence)
  * [Persyaratan Tidak Berdokumen](#the-undocumented-requirement)
* [Pola Penipuan PayPal yang Lebih Luas](#paypals-broader-pattern-of-deception)
  * [Tindakan Departemen Layanan Keuangan New York](#the-new-york-department-of-financial-services-action)
  * [Gugatan Hukum Honey: Menulis Ulang Tautan Afiliasi](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Biaya Kelalaian PayPal](#the-cost-of-paypals-negligence)
  * [Kebohongan Dokumentasi](#the-documentation-lie)
* [Apa Artinya Hal Ini bagi Pengembang](#what-this-means-for-developers)

## Bagian yang Hilang: Tidak Ada Cara untuk Mencantumkan Langganan {#the-missing-piece-no-way-to-list-subscriptions}

Inilah hal yang membuat kami tercengang: PayPal telah menyediakan penagihan berlangganan sejak 2014, tetapi mereka tidak pernah menyediakan cara bagi pedagang untuk mencantumkan langganan mereka sendiri.

Coba pikirkan sejenak. Anda bisa membuat langganan, Anda bisa membatalkannya jika Anda memiliki ID, tetapi Anda tidak bisa mendapatkan daftar semua langganan aktif untuk akun Anda. Ini seperti memiliki database tanpa pernyataan SELECT.

Kami memerlukan ini untuk operasi bisnis dasar:

* Dukungan pelanggan (ketika seseorang mengirim email menanyakan tentang langganan mereka)
* Pelaporan dan rekonsiliasi keuangan
* Manajemen penagihan otomatis
* Kepatuhan dan audit

Tapi PayPal? Mereka... tidak pernah membuatnya.

## 2014-2017: Masalah Muncul {#2014-2017-the-problem-emerges}

Masalah daftar langganan pertama kali muncul di forum komunitas PayPal pada tahun 2017. Para pengembang mengajukan pertanyaan yang jelas: "Bagaimana cara mendapatkan daftar semua langganan saya?"

Tanggapan PayPal? Tidak ada.

Anggota masyarakat mulai merasa frustrasi:

> "Kelalaian yang sangat aneh jika pedagang tidak dapat mencantumkan semua Perjanjian yang aktif. Jika ID Perjanjian hilang, ini berarti hanya pengguna yang dapat membatalkan atau menangguhkan perjanjian." - leafspider

> "+1. Sudah hampir 3 tahun." - laudukang (artinya masalahnya sudah ada sejak \~2014)

File [postingan komunitas asli](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) dari tahun 2017 menunjukkan para pengembang sangat membutuhkan fungsi dasar ini. Respons PayPal adalah mengarsipkan repositori tempat orang-orang melaporkan masalah tersebut.

## 2020: Kami Memberi Mereka Umpan Balik yang Luas {#2020-we-give-them-extensive-feedback}

Pada bulan Oktober 2020, PayPal menghubungi kami untuk sesi umpan balik formal. Ini bukan obrolan biasa - mereka menyelenggarakan panggilan Microsoft Teams selama 45 menit dengan 8 eksekutif PayPal, termasuk Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze, dan lainnya.

### Daftar Umpan Balik 27 Item {#the-27-item-feedback-list}

Kami datang dengan persiapan yang matang. Setelah 6 jam mencoba berintegrasi dengan API mereka, kami berhasil menemukan 27 masalah spesifik. Mark Stuart dari tim PayPal Checkout mengatakan:

> Hai Nick, terima kasih sudah berbagi dengan semua orang hari ini! Saya rasa ini akan menjadi katalis untuk mendapatkan lebih banyak dukungan dan investasi bagi tim kami untuk memperbaiki masalah ini. Sulit untuk mendapatkan umpan balik yang kaya seperti yang Anda berikan kepada kami sejauh ini.

Umpan baliknya bukan bersifat teoritis - melainkan berasal dari upaya integrasi nyata:

1. **Pembuatan token akses tidak berfungsi**:

> Pembuatan token akses tidak berfungsi. Selain itu, seharusnya ada lebih dari sekadar contoh cURL.

2. **Tidak ada UI web untuk pembuatan langganan**:

> Bagaimana caranya membuat langganan tanpa harus menggunakan cURL? Sepertinya tidak ada UI web untuk melakukan ini (seperti yang dimiliki Stripe).

Mark Stuart menganggap masalah token akses sangat mengkhawatirkan:

> Kami biasanya tidak mendengar masalah seputar pembuatan token akses.

### Tim Terlibat, Janji Diucapkan {#teams-got-involved-promises-were-made}

Seiring kami menemukan lebih banyak masalah, PayPal terus menambahkan tim ke dalam percakapan. Darshan Raju dari tim UI manajemen Langganan bergabung dan berkata:

> Akui kekurangannya. Kami akan melacak dan mengatasinya. Terima kasih sekali lagi atas masukan Anda!

Sidang ini digambarkan sebagai upaya untuk:

> ceritakan pengalaman Anda secara jujur

ke:

> jadikan PayPal seperti yang seharusnya bagi para pengembang.

### Hasilnya? Tidak ada. {#the-result-nothing}

Meskipun adanya sesi umpan balik formal, daftar 27 item yang luas, keterlibatan banyak tim, dan janji untuk:

> lacak dan alamat

masalah, sama sekali tidak ada yang diperbaiki.

## Eksodus Eksekutif: Bagaimana PayPal Kehilangan Semua Memori Institusional {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Di sinilah semuanya menjadi sangat menarik. Setiap orang yang menerima umpan balik kami di tahun 2020 telah meninggalkan PayPal:

**Perubahan Kepemimpinan:**

* [Dan Schulman (CEO selama 9 tahun) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (September 2023)
* [Sri Shivananda (CTO yang mengorganisir umpan balik) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Januari 2024)

**Pemimpin Teknis yang Membuat Janji, Lalu Pergi:**

* **Mark Stuart** (umpan balik yang dijanjikan akan menjadi "katalis") → [Sekarang di Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veteran PayPal selama 18 tahun) → [CEO MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Produk Konsumen Global) → [Pensiun](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (salah satu yang tersisa) → [Baru saja berangkat ke Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Januari 2025)

PayPal telah menjadi pintu putar tempat para eksekutif mengumpulkan masukan pengembang, membuat janji, lalu pindah ke perusahaan yang lebih baik seperti JPMorgan, Ripple, dan firma fintech lainnya.

Ini menjelaskan mengapa respons masalah GitHub tahun 2025 tampak sama sekali tidak berhubungan dengan umpan balik kami tahun 2020 - secara harfiah semua orang yang menerima umpan balik itu telah meninggalkan PayPal.

## 2025: Kepemimpinan Baru, Masalah Tetap Sama {#2025-new-leadership-same-problems}

Maju cepat ke tahun 2025, pola yang sama persis muncul. Setelah bertahun-tahun tanpa kemajuan, pimpinan baru PayPal kembali menghubungi.

### CEO Baru Terlibat {#the-new-ceo-gets-involved}

Pada 30 Juni 2025, kami langsung menghubungi CEO baru PayPal, Alex Chriss. Tanggapannya singkat:

> Hai Nick – Terima kasih telah menghubungi dan memberikan masukan. Michelle (cc) sudah siap bersama timnya untuk berdiskusi dan menyelesaikan masalah ini bersama Anda. Terima kasih -A

### Tanggapan Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP dan Manajer Umum Usaha Kecil dan Layanan Keuangan, menanggapi:

> Terima kasih banyak, Nick, Alex sudah dipindahkan ke bcc. Kami sudah menyelidiki masalah ini sejak postinganmu sebelumnya. Kami akan menghubungimu sebelum minggu ini berakhir. Bisakah kamu mengirimkan informasi kontakmu agar salah satu kolegaku bisa menghubungimu? Michelle

### Tanggapan Kami: Tidak Ada Lagi Rapat {#our-response-no-more-meetings}

Kami menolak pertemuan lainnya, dengan alasan rasa frustrasi kami:

> Terima kasih. Tapi saya rasa menelepon saja tidak akan berpengaruh apa-apa. Begini alasannya... Dulu saya pernah menelepon dan hasilnya nihil. Saya membuang waktu lebih dari 2 jam untuk berbicara dengan seluruh tim dan pimpinan, tapi tidak ada yang ditindaklanjuti... Banyak email bolak-balik. Sama sekali tidak ada hasil. Umpan balik tidak ada gunanya. Saya sudah mencoba bertahun-tahun, didengarkan, tapi hasilnya nihil.

### Respons Marty Brodbeck terhadap Rekayasa Berlebihan {#marty-brodbecks-overengineering-response}

Kemudian Marty Brodbeck, yang mengepalai teknik konsumen di PayPal, menghubungi:

> Hai Nick, ini Marty Brodbeck. Saya mengepalai semua rekayasa konsumen di PayPal dan telah memimpin pengembangan API untuk perusahaan ini. Bisakah Anda dan saya berbagi masalah yang Anda hadapi dan bagaimana kami dapat membantu?

Ketika kami menjelaskan kebutuhan sederhana untuk titik akhir daftar langganan, tanggapannya mengungkapkan masalah yang sebenarnya:

> Terima kasih Nick, kami sedang dalam proses menciptakan API langganan tunggal dengan SDK lengkap (mendukung penanganan kesalahan penuh, pelacakan langganan berbasis peristiwa, waktu aktif yang kuat) di mana penagihan juga dipisah sebagai API terpisah agar pedagang dapat mengaksesnya daripada harus mengaturnya di beberapa titik akhir untuk memperoleh respons tunggal.

Ini pendekatan yang salah. Kita tidak butuh arsitektur yang rumit selama berbulan-bulan. Kita hanya butuh satu titik akhir REST sederhana yang mencantumkan langganan—sesuatu yang seharusnya sudah ada sejak 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Kontradiksi "CRUD Sederhana" {#the-simple-crud-contradiction}

Ketika kami menunjukkan bahwa ini adalah fungsi CRUD dasar yang seharusnya sudah ada sejak 2014, tanggapan Marty cukup menjelaskan:

> Operasi Crud sederhana adalah bagian dari inti API teman saya, jadi tidak akan memakan waktu berbulan-bulan untuk pengembangan

PayPal TypeScript SDK, yang saat ini hanya mendukung tiga titik akhir setelah berbulan-bulan pengembangan, bersama dengan garis waktu historisnya, dengan jelas menunjukkan bahwa proyek semacam itu memerlukan waktu lebih dari beberapa bulan untuk diselesaikan.

Respons ini menunjukkan bahwa ia tidak memahami API-nya sendiri. Jika "operasi CRUD sederhana merupakan bagian dari API inti", lalu di mana titik akhir daftar langganan? Kami menjawab:

> Jika 'operasi CRUD sederhana merupakan bagian dari API inti', lalu di mana titik akhir daftar langganan? Para pengembang telah meminta 'operasi CRUD sederhana' ini sejak 2014. Sudah 11 tahun berlalu. Setiap pemroses pembayaran lainnya telah memiliki fungsi dasar ini sejak awal.

### Kesenjangan Menjadi Jelas {#the-disconnect-becomes-clear}

Pertukaran tahun 2025 dengan Alex Chriss, Michelle Gill, dan Marty Brodbeck menunjukkan disfungsi organisasi yang sama:

1. **Pimpinan baru tidak mengetahui sesi umpan balik sebelumnya**
2. **Mereka mengusulkan solusi yang sama dan terlalu rumit**
3. **Mereka tidak memahami keterbatasan API mereka sendiri**
4. **Mereka menginginkan lebih banyak rapat, alih-alih hanya menyelesaikan masalah**

Pola ini menjelaskan mengapa tim PayPal pada tahun 2025 tampak sama sekali tidak terhubung dengan umpan balik ekstensif yang diberikan pada tahun 2020 - orang-orang yang menerima umpan balik tersebut sudah tiada, dan pimpinan baru mengulangi kesalahan yang sama.

## Tahun Laporan Bug yang Mereka Abaikan {#years-of-bug-reports-they-ignored}

Kami tidak hanya mengeluh tentang fitur yang hilang. Kami secara aktif melaporkan bug dan berusaha membantu mereka memperbaikinya. Berikut kronologi lengkap masalah yang kami dokumentasikan:

### 2016: Keluhan Awal UI/UX {#2016-early-uiux-complaints}

Bahkan di tahun 2016, kami secara terbuka menghubungi pimpinan PayPal, termasuk Dan Schulman, mengenai masalah antarmuka dan kegunaan. Ini terjadi 9 tahun yang lalu, dan masalah UI/UX yang sama masih terjadi hingga saat ini.

### 2021: Laporan Bug Email Bisnis {#2021-business-email-bug-report}

Pada bulan Maret 2021, kami melaporkan bahwa sistem email bisnis PayPal mengirimkan notifikasi pembatalan yang salah. Variabel pada templat email ditampilkan secara tidak benar, sehingga menampilkan pesan yang membingungkan pelanggan.

Mark Stuart mengakui masalah tersebut:

> Terima kasih, Nick! Pindah ke BCC. @Prasy, apakah tim Anda bertanggung jawab atas email ini atau tahu siapa yang bertanggung jawab? Kalimat "Niftylettuce, LLC, kami tidak akan menagih Anda lagi" membuat saya yakin ada kesalahan alamat dan isi email.

**Hasil**: Mereka benar-benar memperbaikinya! Mark Stuart mengonfirmasi:

> Baru saja mendapat kabar dari tim notifikasi bahwa templat email telah diperbaiki dan diluncurkan. Terima kasih telah menghubungi kami untuk melaporkannya. Terima kasih!

Ini menunjukkan mereka BISA memperbaiki hal-hal ketika mereka menginginkannya - mereka hanya memilih untuk tidak melakukannya pada sebagian besar masalah.

### 2021: Saran Peningkatan UI {#2021-ui-improvement-suggestions}

Pada bulan Februari 2021, kami memberikan umpan balik terperinci mengenai UI dasbor mereka, khususnya bagian "Aktivitas Terbaru PayPal":

> Saya rasa dasbor di paypal.com, khususnya "Aktivitas Terbaru PayPal", perlu ditingkatkan. Sebaiknya Anda tidak menampilkan baris status "Dibuat" untuk pembayaran berulang $0 - itu hanya menambah banyak baris tambahan dan Anda tidak bisa melihat dengan mudah berapa banyak pendapatan yang dihasilkan untuk hari ini/beberapa hari terakhir.

Mark Stuart meneruskannya ke tim produk konsumen:

> Terima kasih! Saya tidak yakin tim mana yang bertanggung jawab atas Aktivitas, tetapi saya telah meneruskannya ke kepala produk konsumen untuk menemukan tim yang tepat. Pembayaran berulang sebesar $0,00 sepertinya bermasalah. Mungkin sebaiknya difilter.

**Hasil**: Tidak pernah diperbaiki. Antarmuka pengguna (UI) masih menampilkan entri $0 yang tidak berguna ini.

### 2021: Kegagalan Lingkungan Sandbox {#2021-sandbox-environment-failures}

Pada bulan November 2021, kami melaporkan masalah kritis dengan lingkungan sandbox PayPal:

* Kunci API rahasia Sandbox diubah dan dinonaktifkan secara acak
* Semua akun uji Sandbox dihapus tanpa pemberitahuan
* Pesan kesalahan saat mencoba melihat detail akun Sandbox
* Kegagalan pemuatan berkala

> Entah kenapa, kunci API rahasia Sandbox saya diubah dan dinonaktifkan. Semua akun uji Sandbox lama saya juga dihapus.

> Terkadang mereka memuat, terkadang tidak. Ini sangat menyebalkan.

**Hasil**: Tidak ada respons, tidak ada perbaikan. Pengembang masih menghadapi masalah keandalan sandbox.

### 2021: Sistem Laporan Rusak Sepenuhnya {#2021-reports-system-completely-broken}

Pada bulan Mei 2021, kami melaporkan bahwa sistem unduhan PayPal untuk laporan transaksi rusak total:

> Sepertinya pelaporan unduhan tidak berfungsi saat ini dan belum berfungsi seharian. Seharusnya juga ada notifikasi email jika gagal.

Kami juga menunjukkan bencana manajemen sesi:

> Kalau kamu tidak aktif saat masuk ke PayPal selama 5 menit, kamu akan keluar. Jadi, ketika kamu menyegarkan tombol di sebelah laporan yang ingin kamu periksa statusnya (setelah menunggu lama), rasanya malas untuk masuk lagi.

Mark Stuart mengakui masalah batas waktu sesi:

> Saya ingat Anda pernah melaporkan hal itu di masa lalu dengan sesi Anda yang sering berakhir dan mengganggu alur pengembangan Anda saat Anda beralih antara IDE dan developer.paypal.com atau dasbor pedagang Anda, lalu Anda kembali dan keluar lagi.

**Hasil**: Batas waktu sesi masih 60 detik. Sistem pelaporan masih sering gagal.

### 2022: Fitur API Inti Hilang (Lagi) {#2022-core-api-feature-missing-again}

Pada bulan Januari 2022, kami kembali meningkatkan masalah daftar langganan, kali ini dengan detail yang lebih lengkap tentang kesalahan dokumentasinya:

> Tidak ada GET yang mencantumkan semua langganan (sebelumnya disebut perjanjian penagihan)

Kami menemukan dokumentasi resmi mereka sepenuhnya tidak akurat:

> Dokumen API-nya juga sama sekali tidak akurat. Kami pikir kami bisa mencari solusi dengan mengunduh daftar ID langganan yang di-hardcode. Tapi itu malah tidak berhasil!

> Dari dokumen resmi di sini... Dikatakan Anda bisa melakukan ini... Inilah masalahnya - tidak ada kolom "ID Langganan" yang bisa dicentang sama sekali.

Christina Monti dari PayPal menanggapi:

> Mohon maaf atas rasa frustrasi yang disebabkan oleh langkah-langkah yang salah ini, kami akan memperbaikinya minggu ini.

Sri Shivananda (CTO) mengucapkan terima kasih kepada kami:

> Terima kasih atas bantuan Anda yang berkelanjutan dalam menjadikan kami lebih baik. Sangat kami hargai.

**Hasil**: Dokumentasi tidak pernah diperbaiki. Titik akhir daftar langganan tidak pernah dibuat.

## Mimpi Buruk Pengalaman Pengembang {#the-developer-experience-nightmare}

Bekerja dengan API PayPal seperti kembali ke masa 10 tahun yang lalu. Berikut masalah teknis yang telah kami dokumentasikan:

### Antarmuka Pengguna Rusak {#broken-user-interface}

Dasbor pengembang PayPal sungguh berantakan. Berikut yang kami hadapi setiap hari:

<figure>
<figcaption><div class="alert alert-danger small text-center">
UI PayPal sangat rusak sehingga Anda bahkan tidak bisa menutup notifikasi.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Peramban Anda tidak mendukung tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Dasbor pengembang secara harfiah mengharuskan Anda menyeret slider lalu keluar setelah 60 detik
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Peramban Anda tidak mendukung tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Lebih banyak bencana UI di antarmuka pengembang PayPal yang menunjukkan alur kerja yang rusak
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Peramban Anda tidak mendukung tag video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Antarmuka manajemen langganan - antarmukanya sangat buruk sehingga kami harus bergantung pada kode untuk menghasilkan produk dan paket langganan
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Tampilan antarmuka langganan yang rusak dengan fungsi yang hilang (Anda tidak dapat dengan mudah membuat produk/paket/langganan – dan sepertinya tidak ada cara untuk menghapus produk maupun paket setelah dibuat di UI)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Pesan kesalahan PayPal yang umum - samar dan tidak membantu
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Masalah SDK {#sdk-problems}

* Tidak dapat menangani pembayaran sekali pakai dan langganan tanpa solusi rumit yang melibatkan pertukaran dan rendering ulang tombol saat memuat ulang SDK dengan tag skrip.
* SDK JavaScript melanggar konvensi dasar (nama kelas menggunakan huruf kecil, tidak ada pemeriksaan instans).
* Pesan kesalahan tidak menunjukkan kolom mana yang hilang.
* Tipe data tidak konsisten (memerlukan jumlah string, bukan angka).

### Pelanggaran Kebijakan Keamanan Konten {#content-security-policy-violations}

SDK mereka memerlukan unsafe-inline dan unsafe-eval di CSP Anda, **memaksa Anda mengorbankan keamanan situs Anda**.

### Dokumentasi Kekacauan {#documentation-chaos}

Mark Stuart sendiri mengakui:

> Setuju bahwa ada begitu banyak API lama dan baru. Sangat sulit menemukan apa yang harus dicari (bahkan bagi kami yang bekerja di sini).

### Kerentanan Keamanan {#security-vulnerabilities}

**Implementasi 2FA PayPal terbalik**. Bahkan dengan aplikasi TOTP yang diaktifkan, mereka memaksakan verifikasi SMS - membuat akun rentan terhadap serangan pertukaran SIM. Jika Anda mengaktifkan TOTP, PayPal seharusnya hanya menggunakan itu. Email sebagai alternatif, bukan SMS.

### Manajemen Sesi Bencana {#session-management-disaster}

**Dasbor pengembang mereka akan mengeluarkan Anda setelah 60 detik tidak aktif**. Coba lakukan hal-hal produktif, dan Anda malah terus-menerus mengalami: masuk → captcha → 2FA → keluar → ulangi. Pakai VPN? Semoga berhasil.

## Juli 2025: Kesabaran Terakhir {#july-2025-the-final-straw}

Setelah 11 tahun mengalami masalah yang sama, titik kritisnya muncul saat migrasi akun rutin. Kami perlu beralih ke akun PayPal baru yang sesuai dengan nama perusahaan kami, "Forward Email LLC", demi akuntansi yang lebih bersih.

Apa yang seharusnya sederhana berubah menjadi bencana total:

* Pengujian awal menunjukkan semuanya berfungsi dengan benar
* Beberapa jam kemudian, PayPal tiba-tiba memblokir semua pembayaran langganan tanpa pemberitahuan
* Pelanggan tidak dapat membayar, sehingga menimbulkan kebingungan dan beban dukungan
* Dukungan PayPal memberikan respons yang kontradiktif dengan mengklaim akun telah diverifikasi
* Kami terpaksa menghentikan pembayaran PayPal sepenuhnya

<figure>
<figcaption><div class="alert alert-danger small text-center">
Kesalahan yang dilihat pelanggan saat mencoba membayar - tidak ada penjelasan, tidak ada catatan, tidak ada apa-apa
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Dukungan PayPal mengklaim semuanya baik-baik saja, sementara pembayaran benar-benar rusak. Pesan terakhir menunjukkan mereka mengatakan telah "mengembalikan beberapa fitur" tetapi masih meminta informasi lebih lanjut yang tidak disebutkan - seperti adegan dukungan PayPal klasik.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Proses verifikasi identitas yang konon tidak "memperbaiki" apa pun
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Pesan samar dan masih belum ada penyelesaian. Tidak ada informasi, pemberitahuan, atau informasi tambahan apa pun yang diperlukan. Dukungan pelanggan tidak merespons.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Mengapa Kita Tidak Bisa Begitu Saja Menghentikan PayPal {#why-we-cant-just-drop-paypal}

Terlepas dari semua masalah ini, kami tidak dapat sepenuhnya meninggalkan PayPal karena beberapa pelanggan hanya menggunakan PayPal sebagai opsi pembayaran. Seperti yang dikatakan salah satu pelanggan di [halaman status](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) kami:

> PayPal adalah satu-satunya pilihan pembayaran saya

**Kami terjebak mendukung platform yang rusak karena PayPal telah menciptakan monopoli pembayaran untuk pengguna tertentu.**

## Solusi Komunitas {#the-community-workaround}

Karena PayPal tidak menyediakan fungsi dasar untuk mendaftarkan langganan, komunitas pengembang telah membuat solusi. Kami telah membuat skrip yang membantu mengelola langganan PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Skrip ini merujuk ke [inti komunitas](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) tempat para pengembang berbagi solusi. Pengguna sebenarnya adalah [mengucapkan terima kasih kepada kami](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) karena menyediakan apa yang seharusnya sudah dibangun PayPal bertahun-tahun lalu.

## Memblokir Template PayPal Karena Phishing {#blocking-paypal-templates-due-to-phishing}

Masalahnya bukan hanya sebatas API. Template email PayPal dirancang sangat buruk sehingga kami harus menerapkan pemfilteran khusus di layanan email kami karena tidak dapat dibedakan dari upaya phishing.

### Masalah Sebenarnya: Template PayPal Terlihat Seperti Penipuan {#the-real-problem-paypals-templates-look-like-scams}

Kami secara rutin menerima laporan email PayPal yang terlihat persis seperti upaya phishing. Berikut contoh nyata dari laporan penyalahgunaan kami:

**Subjek:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Email ini diteruskan ke `abuse@microsoft.com` karena tampaknya merupakan upaya phishing. Masalahnya? Email ini sebenarnya berasal dari lingkungan sandbox PayPal, tetapi desain templatnya sangat buruk sehingga memicu sistem deteksi phishing.

### Implementasi Kami {#our-implementation}

Anda dapat melihat penerapan penyaringan khusus PayPal kami di [kode penyaringan email](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Mengapa Kami Harus Memblokir PayPal {#why-we-had-to-block-paypal}

Kami menerapkan ini karena PayPal menolak memperbaiki masalah spam/phishing/penipuan besar-besaran meskipun kami telah berulang kali melaporkannya kepada tim penyalahgunaan mereka. Jenis email spesifik yang kami blokir meliputi:

* **RT000238** - Notifikasi faktur mencurigakan
* **PPC001017** - Konfirmasi pembayaran bermasalah
* **RT000542** - Upaya peretasan pesan hadiah

### Skala Masalah {#the-scale-of-the-problem}

Log penyaringan spam kami menunjukkan banyaknya spam faktur PayPal yang kami proses setiap hari. Contoh subjek yang diblokir antara lain:

* "Faktur dari Tim Penagihan PayPal:- Biaya ini akan didebit otomatis dari akun Anda. Silakan hubungi kami segera di \[TELEPON]"
* "Faktur dari \[NAMA PERUSAHAAN] (\[ID PESANAN])"
* Beberapa variasi dengan nomor telepon berbeda dan ID pesanan palsu

Email-email ini sering kali berasal dari host `outlook.com` tetapi tampaknya berasal dari sistem PayPal yang sah, sehingga sangat berbahaya. Email-email ini lolos autentikasi SPF, DKIM, dan DMARC karena dikirim melalui infrastruktur PayPal yang sebenarnya.

Log teknis kami menunjukkan email spam ini berisi header PayPal yang sah:

* `X-Email-Type-Id: RT000238` (ID yang sama yang kami blokir)
* `From: "service@paypal.com" <service@paypal.com>`
* Tanda tangan DKIM yang valid dari `paypal.com`
* Data SPF yang sesuai yang menunjukkan server email PayPal

Ini menciptakan situasi yang mustahil: email PayPal yang sah dan spam keduanya memiliki karakteristik teknis yang identik.

### Ironi {#the-irony}

PayPal, perusahaan yang seharusnya memimpin perang melawan penipuan keuangan, memiliki templat email yang dirancang sangat buruk sehingga memicu sistem anti-phishing. Kami terpaksa memblokir email PayPal yang sah karena tidak dapat dibedakan dari penipuan.

Hal ini didokumentasikan dalam penelitian keamanan: [Waspadai penipuan alamat baru PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - menunjukkan bagaimana sistem PayPal sendiri dieksploitasi untuk penipuan.

### Dampak Dunia Nyata: Penipuan PayPal Baru {#real-world-impact-novel-paypal-scams}

Masalahnya bukan hanya desain templat yang buruk. Sistem faktur PayPal sangat mudah dieksploitasi sehingga penipu kerap menyalahgunakannya untuk mengirimkan faktur palsu yang tampak sah. Peneliti keamanan Gavin Anderegg mendokumentasikan [Penipuan PayPal Baru](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), di mana penipu mengirimkan faktur PayPal asli yang lolos semua pemeriksaan autentikasi:

> "Setelah memeriksa sumbernya, email tersebut tampak seperti berasal dari PayPal (SPF, DKIM, dan DMARC semuanya lolos). Tombolnya juga terhubung ke URL PayPal yang tampak sah... Saya hanya perlu beberapa detik untuk menyadari bahwa itu email yang sah. Saya baru saja dikirimi 'faktur' acak dari seorang penipu."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Tangkapan layar yang menunjukkan beberapa faktur PayPal palsu membanjiri kotak masuk, semuanya tampak sah karena sebenarnya berasal dari sistem PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Peneliti mencatat:

> "Ini juga sepertinya fitur praktis yang sebaiknya diblokir oleh PayPal. Saya langsung berasumsi ini semacam penipuan dan hanya tertarik pada detail teknisnya. Sepertinya terlalu mudah ditipu, dan saya khawatir orang lain mungkin tertipu."

Ini menggambarkan masalahnya dengan sempurna: Sistem PayPal yang sah dirancang sangat buruk sehingga memungkinkan terjadinya penipuan sekaligus membuat komunikasi yang sah terlihat mencurigakan.

Lebih parahnya lagi, hal ini mempengaruhi kemampuan pengiriman kami ke Yahoo yang mengakibatkan keluhan pelanggan dan berjam-jam pengujian cermat serta pengecekan pola.

## Proses KYC PayPal yang Mundur {#paypals-backwards-kyc-process}

Salah satu aspek platform PayPal yang paling membuat frustrasi adalah pendekatan mereka yang kurang tepat dalam hal kepatuhan dan prosedur Mengenal Pelanggan Anda (KYC). Tidak seperti pemroses pembayaran lainnya, PayPal memungkinkan pengembang untuk mengintegrasikan API mereka dan mulai menerima pembayaran dalam tahap produksi sebelum menyelesaikan verifikasi yang tepat.

### Cara Kerjanya {#how-it-should-work}

Setiap pemroses pembayaran yang sah mengikuti urutan logis ini:

1. **Selesaikan verifikasi KYC terlebih dahulu**
2. **Setujui akun pedagang**
3. **Berikan akses API produksi**
4. **Izinkan penagihan pembayaran**

Ini melindungi pemroses pembayaran dan pedagang dengan memastikan kepatuhan sebelum uang berpindah tangan.

### Cara Kerja PayPal Sebenarnya {#how-paypal-actually-works}

Proses PayPal sepenuhnya terbalik:

1. **Segera berikan akses API produksi**
2. **Izinkan penagihan pembayaran selama berjam-jam atau berhari-hari**
3. **Blokir pembayaran secara tiba-tiba tanpa pemberitahuan**
4. **Tuntut dokumentasi KYC setelah pelanggan terdampak**
5. **Jangan berikan notifikasi kepada penjual**
6. **Biarkan pelanggan menemukan masalahnya dan melaporkannya**

### Dampak Dunia Nyata {#the-real-world-impact}

Proses mundur ini menciptakan bencana bagi bisnis:

* **Pelanggan tidak dapat menyelesaikan pembelian** selama periode penjualan puncak
* **Tidak ada peringatan sebelumnya** bahwa verifikasi diperlukan
* **Tidak ada notifikasi email** ketika pembayaran diblokir
* **Pedagang belajar tentang masalah dari pelanggan yang bingung**
* **Kerugian pendapatan** selama periode bisnis kritis
* **Kepercayaan pelanggan rusak** ketika pembayaran tiba-tiba gagal

### Bencana Migrasi Akun Juli 2025 {#the-july-2025-account-migration-disaster}

Skenario persis seperti ini terjadi selama migrasi akun rutin kami pada Juli 2025. PayPal awalnya mengizinkan pembayaran, lalu tiba-tiba memblokirnya tanpa pemberitahuan apa pun. Kami baru menemukan masalah ini ketika pelanggan mulai melaporkan bahwa mereka tidak dapat membayar.

Ketika kami menghubungi dukungan, kami menerima tanggapan yang kontradiktif tentang dokumentasi apa yang dibutuhkan, tanpa jadwal penyelesaian yang jelas. Hal ini memaksa kami untuk menghentikan pembayaran PayPal sepenuhnya, membingungkan pelanggan yang tidak memiliki pilihan pembayaran lain.

### Mengapa Ini Penting {#why-this-matters}

Pendekatan PayPal terhadap kepatuhan menunjukkan kesalahpahaman mendasar tentang cara bisnis beroperasi. KYC yang tepat seharusnya dilakukan **sebelum** integrasi produksi, bukan setelah pelanggan sudah mencoba membayar. Kurangnya komunikasi proaktif ketika masalah muncul menunjukkan ketidaksesuaian PayPal dengan kebutuhan pedagang.

Proses mundur ini merupakan gejala masalah organisasi PayPal yang lebih luas: mereka mengutamakan proses internal mereka dibandingkan pengalaman pedagang dan pelanggan, yang mengarah pada bencana operasional yang mendorong bisnis menjauh dari platform mereka.

## Bagaimana Setiap Pemroses Pembayaran Melakukannya dengan Benar {#how-every-other-payment-processor-does-it-right}

Fungsionalitas daftar langganan yang ditolak PayPal untuk diterapkan telah menjadi standar di industri ini selama lebih dari satu dekade. Berikut cara pemroses pembayaran lain menangani persyaratan dasar ini:

### Garis {#stripe}

Stripe telah memiliki daftar langganan sejak API mereka diluncurkan. Dokumentasi mereka dengan jelas menunjukkan cara mengambil semua langganan untuk akun pelanggan atau pedagang. Ini dianggap sebagai fungsi CRUD dasar.

### Dayung {#paddle}

Paddle menyediakan API manajemen langganan yang komprehensif, termasuk pencatatan, pemfilteran, dan paginasi. Mereka memahami bahwa penjual perlu melihat aliran pendapatan berulang mereka.

### Coinbase Commerce {#coinbase-commerce}

Bahkan pemroses pembayaran mata uang kripto seperti Coinbase Commerce menyediakan manajemen langganan yang lebih baik daripada PayPal.

### Persegi {#square}

API Square memasukkan daftar langganan sebagai fitur fundamental, bukan renungan belaka.

### Standar Industri {#the-industry-standard}

Setiap pemroses pembayaran modern menyediakan:

* Daftar semua langganan
* Filter berdasarkan status, tanggal, pelanggan
* Paginasi untuk kumpulan data besar
* Notifikasi webhook untuk perubahan langganan
* Dokumentasi lengkap dengan contoh kerja

### Apa yang Disediakan Prosesor Lain vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Daftar Semua Langganan:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filter berdasarkan Pelanggan:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filter berdasarkan Status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Apa yang Sebenarnya Anda Dapatkan:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Titik Akhir PayPal yang Tersedia:**

* `POST /v1/billing/subscriptions` - Buat langganan
* `GET /v1/billing/subscriptions/{id}` - Dapatkan SATU langganan (jika Anda tahu ID-nya)
* `PATCH /v1/billing/subscriptions/{id}` - Perbarui langganan
* `POST /v1/billing/subscriptions/{id}/cancel` - Batalkan langganan
* `POST /v1/billing/subscriptions/{id}/suspend` - Tangguhkan langganan

**Apa yang Hilang dari PayPal:**

* ❌ Tidak ada `GET /v1/billing/subscriptions` (daftar semua)
* ❌ Tidak ada fungsi pencarian
* ❌ Tidak ada pemfilteran berdasarkan status, pelanggan, tanggal
* ❌ Tidak ada dukungan pagination

PayPal adalah satu-satunya pemroses pembayaran utama yang memaksa pengembang untuk melacak ID langganan secara manual di basis data mereka sendiri.

## Penutupan Sistematis PayPal: Membungkam 6 Juta Suara {#paypals-systematic-cover-up-silencing-6-million-voices}

Dalam sebuah langkah yang dengan sempurna merangkum pendekatan PayPal dalam menangani kritik, mereka baru-baru ini menonaktifkan seluruh forum komunitasnya, yang secara efektif membungkam lebih dari 6 juta anggota dan menghapus ratusan ribu posting yang mendokumentasikan kegagalan mereka.

### Penghapusan Besar {#the-great-erasure}

Komunitas PayPal asli di `paypal-community.com` menampung **6.003.558 anggota** dan berisi ratusan ribu postingan, laporan bug, keluhan, dan diskusi tentang kegagalan API PayPal. Hal ini merupakan bukti terdokumentasi lebih dari satu dekade mengenai masalah sistematis PayPal.

Pada 30 Juni 2025, PayPal diam-diam menonaktifkan seluruh forum. Semua tautan `paypal-community.com` kini menampilkan kesalahan 404. Ini bukan migrasi atau peningkatan.

### Penyelamatan Pihak Ketiga {#the-third-party-rescue}

Untungnya, layanan pihak ketiga di [ppl.lithium.com](https://ppl.lithium.com/) telah menyimpan sebagian konten, memungkinkan kami mengakses diskusi yang coba disembunyikan PayPal. Namun, penyimpanan pihak ketiga ini belum lengkap dan dapat hilang kapan saja.

Pola penyembunyian bukti ini bukanlah hal baru bagi PayPal. Mereka memiliki sejarah yang terdokumentasi tentang:

* Menghapus laporan bug kritis dari publik
* Menghentikan penggunaan alat pengembang tanpa pemberitahuan
* Mengubah API tanpa dokumentasi yang tepat
* Membungkam diskusi komunitas tentang kegagalan mereka

Penutupan forum tersebut merupakan upaya paling berani untuk menyembunyikan kegagalan sistematis mereka dari pengawasan publik.

## Bencana Bug Penangkapan 11 Tahun: $1.899 dan Terus Berlanjut {#the-11-year-capture-bug-disaster-1899-and-counting}

Sementara PayPal sibuk menyelenggarakan sesi umpan balik dan memberikan janji, sistem pemrosesan pembayaran inti mereka telah rusak secara fundamental selama lebih dari 11 tahun. Buktinya sangat menghancurkan.

### Kerugian Email Penerusan Sebesar $1.899 {#forward-emails-1899-loss}

Dalam sistem produksi kami, kami menemukan 108 pembayaran PayPal dengan total **$1.899** yang hilang karena kegagalan PayPal dalam proses penarikan. Pembayaran-pembayaran ini menunjukkan pola yang konsisten:

* Webhook `CHECKOUT.ORDER.APPROVED` diterima
* API penangkapan PayPal menghasilkan kesalahan 404
* Pesanan menjadi tidak dapat diakses melalui API PayPal

Mustahil untuk menentukan apakah pelanggan dikenai biaya karena PayPal sepenuhnya menyembunyikan log debug setelah 14 hari dan menghapus semua data dari dasbor untuk ID pesanan yang tidak tercatat.

Ini hanya mewakili satu bisnis. **Kerugian kolektif ribuan pedagang selama 11+ tahun kemungkinan mencapai jutaan dolar.**

**Kami akan menyatakannya lagi: kerugian kolektif di antara ribuan pedagang selama 11+ tahun kemungkinan berjumlah jutaan dolar.**

Satu-satunya alasan kami menemukan ini adalah karena kami sangat teliti dan didorong oleh data.

### Laporan Asli 2013: 11+ Tahun Kelalaian {#the-2013-original-report-11-years-of-negligence}

Laporan terdokumentasi paling awal mengenai masalah ini muncul pada [Stack Overflow pada bulan November 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([diarsipkan](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Terus menerima Error 404 dengan Rest API saat melakukan pengambilan gambar"

Kesalahan yang dilaporkan pada tahun 2013 **identik** dengan apa yang dialami Forward Email pada tahun 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Tanggapan masyarakat pada tahun 2013 cukup jelas:

> "Saat ini ada masalah yang dilaporkan dengan REST API. PayPal sedang mengatasinya."

**11+ tahun kemudian, mereka masih "mengerjakannya."**

### Pengakuan 2016: PayPal Meretas SDK Mereka Sendiri {#the-2016-admission-paypal-breaks-their-own-sdk}

Pada tahun 2016, repositori GitHub milik PayPal mendokumentasikan [kegagalan penangkapan besar-besaran](https://github.com/paypal/PayPal-PHP-SDK/issues/660) yang memengaruhi SDK PHP resmi mereka. Skalanya sangat mengejutkan:

> "Sejak 20/9/2016, semua upaya penangkapan PayPal gagal dengan kode 'INVALID_RESOURCE_ID - ID sumber daya yang diminta tidak ditemukan.'. Tidak ada perubahan yang dilakukan antara 19/9 dan 20/9 pada integrasi API. **100% upaya penangkapan sejak 20/9 telah menghasilkan kesalahan ini.**"

Seorang pedagang melaporkan:

> "Saya telah **mengalami lebih dari 1.400 upaya penangkapan yang gagal dalam 24 jam terakhir**, semuanya dengan respons kesalahan INVALID_RESOURCE_ID."

Respons awal PayPal adalah menyalahkan pedagang dan merujuk mereka ke dukungan teknis. Baru setelah tekanan besar, mereka mengakui kesalahannya:

> "Saya mendapat kabar terbaru dari Pengembang Produk kami. Mereka memperhatikan bahwa di header yang dikirimkan, ID Permintaan PayPal dikirimkan dengan 42 karakter, tetapi **tampaknya ada perubahan baru-baru ini yang membatasi ID ini menjadi hanya 38 karakter.**"

Pengakuan ini mengungkap kelalaian sistematis PayPal:

1. **Mereka melakukan perubahan yang tidak terdokumentasi**
2. **Mereka merusak SDK resmi mereka sendiri**
3. **Mereka menyalahkan pedagang terlebih dahulu**
4. **Mereka hanya mengakui kesalahan di bawah tekanan**

Bahkan setelah "memperbaiki" masalahnya, pedagang melaporkan:

> "SDK telah ditingkatkan ke v1.7.4 dan **masalahnya masih terjadi.**"

### Eskalasi 2024: Masih Rusak {#the-2024-escalation-still-broken}

Laporan terbaru dari Komunitas PayPal yang terlindungi menunjukkan masalah ini justru semakin parah. [Diskusi September 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([diarsipkan](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) mendokumentasikan masalah yang sama persis:

> "Masalah ini baru muncul sekitar 2 minggu yang lalu dan tidak memengaruhi semua pesanan. **Yang paling umum adalah pesan kesalahan 404 saat pengambilan data.**"

Pedagang tersebut menjelaskan pola yang sama yang dialami Email Teruskan:

> "Setelah mencoba menangkap pesanan, PayPal menampilkan pesan kesalahan 404. Saat mengambil Detail Pesanan: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Ini tanpa jejak keberhasilan penangkapan di pihak kami.**"

### Bencana Keandalan Webhook {#the-webhook-reliability-disaster}

[diskusi komunitas yang dilestarikan](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) lainnya mengungkapkan sistem webhook PayPal pada dasarnya tidak dapat diandalkan:

> "Secara teori, seharusnya ada dua peristiwa (CHECKOUT.ORDER.APPROVED dan PAYMENT.CAPTURE.COMPLETED) dari peristiwa Webhook. Kenyataannya, **kedua peristiwa tersebut jarang diterima secara langsung, PAYMENT.CAPTURE.COMPLETED tidak dapat diterima hampir sepanjang waktu atau akan diterima dalam beberapa jam.**"

Untuk pembayaran berlangganan:

> "**'PEMBAYARAN.PENJUALAN.SELESAI' terkadang tidak diterima atau hingga beberapa jam kemudian.**"

Pertanyaan pedagang mengungkap besarnya masalah keandalan PayPal:

1. **"Mengapa ini terjadi?"** - Sistem webhook PayPal pada dasarnya rusak.
2. **"Jika status pesanan 'SELESAI', bolehkah saya menganggap uangnya sudah diterima?"** - Pedagang tidak dapat mempercayai respons API PayPal.
3. **"Mengapa 'Log Peristiwa->Peristiwa Webhook' tidak dapat menemukan log apa pun?"** - Bahkan sistem pencatatan PayPal sendiri tidak berfungsi.

### Pola Kelalaian Sistematis {#the-pattern-of-systematic-negligence}

Buktinya mencakup 11+ tahun dan menunjukkan pola yang jelas:

* **2013**: "PayPal sedang mengerjakannya"
* **2016**: PayPal mengakui adanya perubahan yang merusak, memberikan perbaikan yang rusak
* **2024**: Kesalahan yang sama persis masih terjadi, memengaruhi Forward Email dan banyak lainnya

Ini bukan bug - **ini adalah kelalaian sistematis.** PayPal telah mengetahui tentang kegagalan pemrosesan pembayaran kritis ini selama lebih dari satu dekade dan secara konsisten:

1. **Menyalahkan pedagang atas bug PayPal**
2. **Melakukan perubahan yang tidak terdokumentasi**
3. **Memberikan perbaikan yang tidak memadai dan tidak berhasil**
4. **Mengabaikan dampak finansial terhadap bisnis**
5. **Menyembunyikan bukti dengan menutup forum komunitas**

### Persyaratan yang Tidak Terdokumentasi {#the-undocumented-requirement}

Tidak ada satu pun dokumentasi resmi PayPal yang menyebutkan bahwa pedagang harus menerapkan logika percobaan ulang untuk operasi penangkapan. Dokumentasi mereka menyatakan pedagang harus "menangkap segera setelah persetujuan," tetapi tidak menyebutkan bahwa API mereka secara acak menghasilkan kesalahan 404 yang memerlukan mekanisme percobaan ulang yang rumit.

Hal ini memaksa setiap pedagang untuk:

* Menerapkan logika percobaan ulang backoff eksponensial
* Menangani pengiriman webhook yang tidak konsisten
* Membangun sistem manajemen status yang kompleks
* Memantau tangkapan yang gagal secara manual

**Setiap pemroses pembayaran lainnya menyediakan API penangkapan yang andal dan berfungsi sejak awal.**

## Pola Penipuan PayPal yang Lebih Luas {#paypals-broader-pattern-of-deception}

Bencana bug penangkapan hanyalah satu contoh pendekatan sistematis PayPal dalam menipu pelanggan dan menyembunyikan kegagalan mereka.

### Departemen Layanan Keuangan New York {#the-new-york-department-of-financial-services-action}

Pada bulan Januari 2025, Departemen Layanan Keuangan New York mengeluarkan [tindakan penegakan hukum terhadap PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) untuk praktik penipuan, yang menunjukkan bahwa pola penipuan PayPal jauh melampaui API mereka.

Tindakan regulasi ini menunjukkan kesediaan PayPal untuk terlibat dalam praktik penipuan di seluruh bisnis mereka, bukan hanya alat pengembang mereka.

Gugatan Hukum Honey: Menulis Ulang Tautan Afiliasi {#the-honey-lawsuit-rewriting-affiliate-links}

Akuisisi Honey oleh PayPal telah mengakibatkan [gugatan hukum yang menuduh Honey menulis ulang tautan afiliasi](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), yang mencuri komisi dari kreator konten dan influencer. Ini merupakan bentuk penipuan sistematis lainnya di mana PayPal mengambil keuntungan dengan mengalihkan pendapatan yang seharusnya diberikan kepada pihak lain.

Polanya jelas:

1. **Kegagalan API**: Menyembunyikan fungsionalitas yang rusak, menyalahkan pedagang
2. **Pembungkaman komunitas**: Menghilangkan bukti adanya masalah
3. **Pelanggaran peraturan**: Terlibat dalam praktik penipuan
4. **Pencurian afiliasi**: Mencuri komisi melalui manipulasi teknis

### Biaya Kelalaian PayPal {#the-cost-of-paypals-negligence}

Kerugian Forward Email sebesar $1.899 hanyalah puncak gunung es. Pertimbangkan dampak yang lebih luas:

* **Pedagang perorangan**: Ribuan orang kehilangan ratusan hingga ribuan dolar per transaksi
* **Pelanggan perusahaan**: Potensi kehilangan pendapatan jutaan dolar
* **Waktu pengembang**: Berjam-jam membangun solusi untuk API PayPal yang rusak
* **Kepercayaan pelanggan**: Banyak bisnis kehilangan pelanggan karena kegagalan pembayaran PayPal

Jika satu layanan email kecil kehilangan hampir $2.000, dan masalah ini telah ada selama 11+ tahun yang memengaruhi ribuan pedagang, kerugian finansial kolektif kemungkinan berjumlah **ratusan juta dolar**.

### Kebohongan Dokumentasi {#the-documentation-lie}

Dokumentasi resmi PayPal secara konsisten gagal menyebutkan batasan dan bug kritis yang mungkin dihadapi pedagang. Misalnya:

* **Capture API**: Tidak disebutkan bahwa kesalahan 404 umum terjadi dan memerlukan logika percobaan ulang
* **Keandalan webhook**: Tidak disebutkan bahwa webhook sering tertunda selama berjam-jam
* **Daftar langganan**: Dokumentasi menyiratkan bahwa pencantuman dimungkinkan ketika tidak ada titik akhir
* **Waktu habis sesi**: Tidak disebutkan waktu habis 60 detik yang agresif

Kelalaian sistematis terhadap informasi penting ini memaksa pedagang untuk menemukan keterbatasan PayPal melalui coba-coba dalam sistem produksi, yang sering kali mengakibatkan kerugian finansial.

## Apa Artinya bagi Pengembang {#what-this-means-for-developers}

Kegagalan sistematis PayPal dalam memenuhi kebutuhan dasar pengembang sambil mengumpulkan umpan balik yang ekstensif menunjukkan masalah organisasi yang mendasar. Mereka memperlakukan pengumpulan umpan balik sebagai pengganti perbaikan masalah yang sebenarnya.

Polanya jelas:

1. Pengembang melaporkan masalah
2. PayPal menyelenggarakan sesi umpan balik dengan para eksekutif
3. Umpan balik yang ekstensif diberikan
4. Tim mengakui adanya kesenjangan dan berjanji untuk "melacak dan mengatasinya"
5. Tidak ada yang diimplementasikan
6. Para eksekutif pindah ke perusahaan yang lebih baik
7. Tim baru meminta umpan balik yang sama
8. Siklus berulang

Sementara itu, pengembang terpaksa membuat solusi, mengorbankan keamanan, dan berurusan dengan UI yang rusak hanya untuk menerima pembayaran.

Jika Anda sedang membangun sistem pembayaran, pelajari pengalaman kami: bangun [pendekatan trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) Anda dengan beberapa prosesor, tetapi jangan berharap PayPal akan menyediakan fungsionalitas dasar yang Anda butuhkan. Rencanakan untuk membangun solusi alternatif sejak awal.

> Postingan ini mendokumentasikan pengalaman 11 tahun kami dengan API PayPal di Forward Email. Semua contoh kode dan tautan berasal dari sistem produksi kami yang sebenarnya. Kami terus mendukung pembayaran PayPal meskipun ada masalah ini karena beberapa pelanggan tidak punya pilihan lain.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />