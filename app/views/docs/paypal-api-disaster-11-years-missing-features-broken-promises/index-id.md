# Bencana API PayPal Selama 11 Tahun: Bagaimana Kami Membangun Solusi Sementara Sementara Mereka Mengabaikan Pengembang {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Sukses! PayPal akhirnya menambahkan endpoint `GET /v1/billing/subscriptions`.**
>
> Setelah kami menerbitkan postingan ini dan mengirim email ke pimpinan eksekutif PayPal, tim mereka mengimplementasikan endpoint yang sangat dibutuhkan untuk daftar langganan. Perubahan ini muncul antara [25 Juni 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) dan [9 Juli 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Namun, seperti kebiasaan PayPal, mereka tidak pernah memberi tahu kami. Kami hanya menemukan pembaruan ini sendiri pada Desember 2025, berbulan-bulan setelah fitur tersebut dirilis secara diam-diam.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="Ilustrasi bencana API PayPal" class="rounded-lg" />

<p class="lead mt-3">Di Forward Email, kami telah menghadapi API PayPal yang rusak selama lebih dari satu dekade. Apa yang dimulai sebagai frustrasi kecil berubah menjadi bencana total yang memaksa kami membangun solusi sendiri, memblokir template phishing mereka, dan akhirnya menghentikan semua pembayaran PayPal selama migrasi akun yang kritis.</p>
<p class="lead mt-3">Ini adalah kisah 11 tahun PayPal mengabaikan kebutuhan dasar pengembang sementara kami mencoba segala cara agar platform mereka berfungsi.</p>


## Daftar Isi {#table-of-contents}

* [Bagian yang Hilang: Tidak Ada Cara untuk Melihat Daftar Langganan](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Masalah Muncul](#2014-2017-the-problem-emerges)
* [2020: Kami Memberikan Masukan Mendalam](#2020-we-give-them-extensive-feedback)
  * [Daftar Masukan 27 Item](#the-27-item-feedback-list)
  * [Tim Terlibat, Janji Diberikan](#teams-got-involved-promises-were-made)
  * [Hasilnya? Tidak Ada.](#the-result-nothing)
* [Eksodus Eksekutif: Bagaimana PayPal Kehilangan Semua Memori Institusional](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Kepemimpinan Baru, Masalah Sama](#2025-new-leadership-same-problems)
  * [CEO Baru Terlibat](#the-new-ceo-gets-involved)
  * [Respon Michelle Gill](#michelle-gills-response)
  * [Respon Kami: Tidak Ada Lagi Pertemuan](#our-response-no-more-meetings)
  * [Respon Marty Brodbeck yang Berlebihan](#marty-brodbecks-overengineering-response)
  * [Kontradiksi "CRUD Sederhana"](#the-simple-crud-contradiction)
  * [Ketidaksesuaian Menjadi Jelas](#the-disconnect-becomes-clear)
* [Bertahun-tahun Laporan Bug yang Diabaikan](#years-of-bug-reports-they-ignored)
  * [2016: Keluhan Awal UI/UX](#2016-early-uiux-complaints)
  * [2021: Laporan Bug Email Bisnis](#2021-business-email-bug-report)
  * [2021: Saran Perbaikan UI](#2021-ui-improvement-suggestions)
  * [2021: Kegagalan Lingkungan Sandbox](#2021-sandbox-environment-failures)
  * [2021: Sistem Laporan Sepenuhnya Rusak](#2021-reports-system-completely-broken)
  * [2022: Fitur API Inti Hilang (Lagi)](#2022-core-api-feature-missing-again)
* [Mimpi Buruk Pengalaman Pengembang](#the-developer-experience-nightmare)
  * [Antarmuka Pengguna Rusak](#broken-user-interface)
  * [Masalah SDK](#sdk-problems)
  * [Pelanggaran Kebijakan Keamanan Konten](#content-security-policy-violations)
  * [Kekacauan Dokumentasi](#documentation-chaos)
  * [Kerentanan Keamanan](#security-vulnerabilities)
  * [Bencana Manajemen Sesi](#session-management-disaster)
* [Juli 2025: Titik Balik Terakhir](#july-2025-the-final-straw)
* [Mengapa Kami Tidak Bisa Hanya Meninggalkan PayPal](#why-we-cant-just-drop-paypal)
* [Solusi Komunitas](#the-community-workaround)
* [Memblokir Template PayPal Karena Phishing](#blocking-paypal-templates-due-to-phishing)
  * [Masalah Sebenarnya: Template PayPal Terlihat Seperti Penipuan](#the-real-problem-paypals-templates-look-like-scams)
  * [Implementasi Kami](#our-implementation)
  * [Mengapa Kami Harus Memblokir PayPal](#why-we-had-to-block-paypal)
  * [Skala Masalah](#the-scale-of-the-problem)
  * [Ironi](#the-irony)
  * [Dampak Dunia Nyata: Penipuan PayPal Baru](#real-world-impact-novel-paypal-scams)
* [Proses KYC PayPal yang Terbalik](#paypals-backwards-kyc-process)
  * [Bagaimana Seharusnya Bekerja](#how-it-should-work)
  * [Bagaimana PayPal Sebenarnya Bekerja](#how-paypal-actually-works)
  * [Dampak Dunia Nyata](#the-real-world-impact)
  * [Bencana Migrasi Akun Juli 2025](#the-july-2025-account-migration-disaster)
  * [Mengapa Ini Penting](#why-this-matters)
* [Bagaimana Semua Prosesor Pembayaran Lain Melakukannya dengan Benar](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Standar Industri](#the-industry-standard)
  * [Apa yang Disediakan Prosesor Lain vs PayPal](#what-other-processors-provide-vs-paypal)
* [Penutupan Sistematis PayPal: Membungkam 6 Juta Suara](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Penghapusan Besar](#the-great-erasure)
  * [Penyelamatan Pihak Ketiga](#the-third-party-rescue)
* [Bencana Bug Capture 11 Tahun: $1,899 dan Terus Bertambah](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Kerugian Forward Email $1,899](#forward-emails-1899-loss)
  * [Laporan Asli 2013: Kelalaian Lebih dari 11 Tahun](#the-2013-original-report-11-years-of-negligence)
  * [Pengakuan 2016: PayPal Merusak SDK Mereka Sendiri](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskalasai 2024: Masih Rusak](#the-2024-escalation-still-broken)
  * [Bencana Keandalan Webhook](#the-webhook-reliability-disaster)
  * [Pola Kelalaian Sistematis](#the-pattern-of-systematic-negligence)
  * [Persyaratan yang Tidak Didokumentasikan](#the-undocumented-requirement)
* [Pola Penipuan Lebih Luas PayPal](#paypals-broader-pattern-of-deception)
  * [Tindakan Departemen Layanan Keuangan New York](#the-new-york-department-of-financial-services-action)
  * [Gugatan Honey: Menulis Ulang Tautan Afiliasi](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Biaya Kelalaian PayPal](#the-cost-of-paypals-negligence)
  * [Kebohongan Dokumentasi](#the-documentation-lie)
* [Apa Artinya Ini untuk Pengembang](#what-this-means-for-developers)
## Potongan yang Hilang: Tidak Ada Cara untuk Melihat Daftar Langganan {#the-missing-piece-no-way-to-list-subscriptions}

Ini hal yang membuat kami tercengang: PayPal sudah memiliki penagihan langganan sejak 2014, tapi mereka tidak pernah menyediakan cara bagi pedagang untuk melihat daftar langganan mereka sendiri.

Pikirkan itu sejenak. Anda bisa membuat langganan, Anda bisa membatalkannya jika Anda memiliki ID-nya, tapi Anda tidak bisa mendapatkan daftar semua langganan aktif untuk akun Anda. Ini seperti memiliki database tanpa pernyataan SELECT.

Kami membutuhkan ini untuk operasi bisnis dasar:

* Dukungan pelanggan (ketika seseorang mengirim email menanyakan tentang langganan mereka)
* Pelaporan keuangan dan rekonsiliasi
* Manajemen penagihan otomatis
* Kepatuhan dan audit

Tapi PayPal? Mereka hanya... tidak pernah membangunnya.


## 2014-2017: Masalah Muncul {#2014-2017-the-problem-emerges}

Masalah daftar langganan pertama kali muncul di forum komunitas PayPal pada 2017. Para pengembang menanyakan pertanyaan yang jelas: "Bagaimana saya mendapatkan daftar semua langganan saya?"

Respon PayPal? Sunyi senyap.

Anggota komunitas mulai merasa frustrasi:

> "Penghilangan yang sangat aneh jika pedagang tidak bisa melihat semua Perjanjian aktif. Jika ID Perjanjian hilang ini berarti hanya pengguna yang bisa membatalkan atau menangguhkan perjanjian." - leafspider

> "+1. Sudah hampir 3 tahun." - laudukang (berarti masalah ini sudah ada sejak sekitar 2014)

[Posting komunitas asli](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) dari 2017 menunjukkan para pengembang memohon untuk fungsi dasar ini. Respon PayPal adalah mengarsipkan repositori tempat orang melaporkan masalah tersebut.


## 2020: Kami Memberikan Masukan Mendalam {#2020-we-give-them-extensive-feedback}

Pada Oktober 2020, PayPal menghubungi kami untuk sesi masukan formal. Ini bukan obrolan santai - mereka mengatur panggilan Microsoft Teams selama 45 menit dengan 8 eksekutif PayPal termasuk Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze, dan lainnya.

### Daftar Masukan 27 Item {#the-27-item-feedback-list}

Kami datang dengan persiapan. Setelah 6 jam mencoba mengintegrasikan dengan API mereka, kami telah menyusun 27 masalah spesifik. Mark Stuart dari tim PayPal Checkout berkata:

> Hai Nick, terima kasih sudah berbagi dengan semua orang hari ini! Saya pikir ini akan menjadi katalis untuk mendapatkan lebih banyak dukungan dan investasi bagi tim kami untuk memperbaiki hal-hal ini. Sulit mendapatkan masukan mendalam seperti yang sudah kamu berikan sejauh ini.

Masukan ini bukan teori - ini berasal dari upaya integrasi nyata:

1. **Generasi token akses tidak berfungsi**:

> Generasi token akses tidak berfungsi. Juga, seharusnya ada lebih dari sekadar contoh cURL.

2. **Tidak ada UI web untuk pembuatan langganan**:

> Bagaimana bisa membuat langganan tanpa harus menggunakan cURL? Sepertinya tidak ada UI web untuk ini (seperti yang dimiliki Stripe)

Mark Stuart merasa masalah token akses sangat mengkhawatirkan:

> Kami biasanya tidak mendengar masalah terkait generasi token akses.

### Tim Terlibat, Janji Diberikan {#teams-got-involved-promises-were-made}

Saat kami menemukan lebih banyak masalah, PayPal terus menambahkan lebih banyak tim ke dalam percakapan. Darshan Raju dari tim UI manajemen Langganan bergabung dan berkata:

> Mengakui kekurangan ini. Kami akan melacak dan menanganinya. Terima kasih lagi atas masukan Anda!

Sesi ini digambarkan sebagai mencari:

> penjelasan jujur tentang pengalaman Anda

untuk:

> membuat PayPal menjadi seperti yang seharusnya bagi para pengembang.

### Hasilnya? Tidak Ada. {#the-result-nothing}

Meskipun ada sesi masukan formal, daftar 27 item yang luas, keterlibatan banyak tim, dan janji untuk:

> melacak dan menanganinya

masalah, tidak ada yang diperbaiki sama sekali.


## Exodus Eksekutif: Bagaimana PayPal Kehilangan Semua Memori Institusional {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Di sinilah menjadi sangat menarik. Setiap orang yang menerima masukan kami pada 2020 telah meninggalkan PayPal:

**Perubahan Kepemimpinan:**

* [Dan Schulman (CEO selama 9 tahun) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (September 2023)
* [Sri Shivananda (CTO yang mengorganisir masukan) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Januari 2024)
**Pemimpin Teknis yang Membuat Janji, Lalu Pergi:**

* **Mark Stuart** (berjanji umpan balik akan menjadi "katalis") → [Sekarang di Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (veteran PayPal selama 18 tahun) → [CEO MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Produk Konsumen Global) → [Pensiun](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (salah satu yang terakhir tersisa) → [Baru saja pergi ke Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Januari 2025)

PayPal telah menjadi pintu putar di mana eksekutif mengumpulkan umpan balik pengembang, membuat janji, lalu pergi ke perusahaan yang lebih baik seperti JPMorgan, Ripple, dan perusahaan fintech lainnya.

Ini menjelaskan mengapa respons isu GitHub 2025 tampak benar-benar terputus dari umpan balik kami tahun 2020 - secara harfiah semua orang yang menerima umpan balik itu telah meninggalkan PayPal.


## 2025: Kepemimpinan Baru, Masalah yang Sama {#2025-new-leadership-same-problems}

Maju cepat ke tahun 2025, dan pola yang sama persis muncul. Setelah bertahun-tahun tanpa kemajuan, kepemimpinan baru PayPal menghubungi lagi.

### CEO Baru Terlibat {#the-new-ceo-gets-involved}

Pada 30 Juni 2025, kami langsung mengeskalasi ke CEO baru PayPal, Alex Chriss. Responsnya singkat:

> Hai Nick – Terima kasih telah menghubungi dan atas umpan baliknya. Michelle (cc'd) bertanggung jawab dengan timnya untuk terlibat dan menyelesaikan ini dengan Anda. Terima kasih -A

### Respons Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP dan General Manager Small Business and Financial Services, merespons:

> Terima kasih banyak Nick, memindahkan Alex ke bcc. Kami telah meneliti ini sejak postingan Anda sebelumnya. Kami akan menghubungi Anda sebelum minggu ini berakhir. Bisakah Anda mengirimkan info kontak Anda agar salah satu rekan saya dapat menghubungi. Michelle

### Respons Kami: Tidak Ada Lagi Pertemuan {#our-response-no-more-meetings}

Kami menolak pertemuan lain, menjelaskan frustrasi kami:

> Terima kasih. Namun saya merasa ikut panggilan tidak akan menghasilkan apa-apa. Ini alasannya... Saya pernah ikut panggilan sebelumnya dan itu benar-benar tidak membuahkan hasil. Saya membuang waktu lebih dari 2 jam berbicara dengan seluruh tim dan pimpinan dan tidak ada yang selesai... Banyak email bolak-balik. Sama sekali tidak ada yang selesai. Umpan balik tidak kemana-mana. Saya sudah mencoba bertahun-tahun, didengarkan, lalu tidak ada hasil.

### Respons Overengineering Marty Brodbeck {#marty-brodbecks-overengineering-response}

Kemudian Marty Brodbeck, yang memimpin rekayasa konsumen di PayPal, menghubungi:

> Hai Nick, ini Marty Brodbeck. Saya memimpin semua rekayasa konsumen di PayPal dan telah menggerakkan pengembangan API untuk perusahaan. Bisakah Anda dan saya terhubung mengenai masalah yang Anda hadapi dan bagaimana kami dapat membantu di sini.

Ketika kami menjelaskan kebutuhan sederhana untuk endpoint daftar langganan, responsnya mengungkapkan masalah yang sebenarnya:

> Terima kasih Nick, kami sedang dalam proses membuat satu API langganan tunggal dengan SDK lengkap (mendukung penanganan kesalahan penuh, pelacakan langganan berbasis event, uptime yang kuat) di mana penagihan juga dipisahkan sebagai API terpisah untuk pedagang agar tidak perlu mengatur di beberapa endpoint untuk mendapatkan satu respons.

Ini adalah pendekatan yang salah. Kami tidak butuh berbulan-bulan arsitektur kompleks. Kami butuh satu endpoint REST sederhana yang mencantumkan langganan - sesuatu yang seharusnya sudah ada sejak 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Kontradiksi "CRUD Sederhana" {#the-simple-crud-contradiction}

Ketika kami menunjukkan ini adalah fungsi CRUD dasar yang seharusnya sudah ada sejak 2014, respons Marty sangat berbicara:

> Operasi CRUD sederhana adalah bagian dari API inti sobat, jadi tidak akan memakan waktu berbulan-bulan pengembangan

SDK TypeScript PayPal, yang saat ini hanya mendukung tiga endpoint setelah berbulan-bulan pengembangan, bersama dengan garis waktu historisnya, jelas menunjukkan bahwa proyek semacam itu membutuhkan waktu lebih dari beberapa bulan untuk diselesaikan.
Respons ini menunjukkan dia tidak memahami API-nya sendiri. Jika "operasi CRUD sederhana adalah bagian dari API inti," lalu di mana endpoint daftar langganan? Kami menanggapi:

> Jika 'operasi CRUD sederhana adalah bagian dari API inti' lalu di mana endpoint daftar langganan? Para pengembang telah meminta 'operasi CRUD sederhana' ini sejak 2014. Sudah 11 tahun. Setiap penyedia pembayaran lain sudah memiliki fungsi dasar ini sejak hari pertama.

### Ketidaksesuaian Menjadi Jelas {#the-disconnect-becomes-clear}

Pertukaran tahun 2025 dengan Alex Chriss, Michelle Gill, dan Marty Brodbeck menunjukkan disfungsi organisasi yang sama:

1. **Kepemimpinan baru tidak mengetahui sesi umpan balik sebelumnya**
2. **Mereka mengusulkan solusi yang sama yang terlalu rumit**
3. **Mereka tidak memahami keterbatasan API mereka sendiri**
4. **Mereka menginginkan lebih banyak pertemuan daripada sekadar memperbaiki masalah**

Polanya menjelaskan mengapa tim PayPal di tahun 2025 tampak benar-benar terputus dari umpan balik luas yang diberikan pada 2020 - orang-orang yang menerima umpan balik itu sudah tidak ada, dan kepemimpinan baru mengulangi kesalahan yang sama.


## Bertahun-tahun Laporan Bug yang Mereka Abaikan {#years-of-bug-reports-they-ignored}

Kami tidak hanya mengeluh tentang fitur yang hilang. Kami secara aktif melaporkan bug dan mencoba membantu mereka memperbaiki. Berikut adalah garis waktu komprehensif dari masalah yang kami dokumentasikan:

### 2016: Keluhan Awal UI/UX {#2016-early-uiux-complaints}

Bahkan sejak 2016, kami secara terbuka menghubungi kepemimpinan PayPal termasuk Dan Schulman tentang masalah antarmuka dan kegunaan. Ini sudah 9 tahun yang lalu, dan masalah UI/UX yang sama masih ada sampai sekarang.

### 2021: Laporan Bug Email Bisnis {#2021-business-email-bug-report}

Pada Maret 2021, kami melaporkan bahwa sistem email bisnis PayPal mengirimkan notifikasi pembatalan yang salah. Template email memiliki variabel yang dirender secara salah, menampilkan pesan membingungkan kepada pelanggan.

Mark Stuart mengakui masalah tersebut:

> Terima kasih Nick! Beralih ke BCC. @Prasy, apakah timmu bertanggung jawab atas email ini atau tahu siapa yang bertanggung jawab? "Niftylettuce, LLC, kami tidak akan menagih Anda lagi" membuat saya percaya ada kekeliruan pada siapa email ini ditujukan dan isi emailnya.

**Hasil**: Mereka benar-benar memperbaiki ini! Mark Stuart mengonfirmasi:

> Baru saja dengar dari tim notifikasi bahwa template email sudah diperbaiki dan diterapkan. Terima kasih sudah menghubungi untuk melaporkannya. Terima kasih!

Ini menunjukkan mereka BISA memperbaiki hal-hal ketika mereka mau - mereka hanya memilih untuk tidak melakukannya pada sebagian besar masalah.

### 2021: Saran Perbaikan UI {#2021-ui-improvement-suggestions}

Pada Februari 2021, kami memberikan umpan balik rinci tentang UI dashboard mereka, khususnya bagian "Aktivitas Terbaru PayPal":

> Saya pikir dashboard di paypal.com, khususnya "Aktivitas Terbaru PayPal" perlu diperbaiki. Saya rasa Anda tidak perlu menampilkan baris status "Dibuat" untuk pembayaran berulang $0 - ini hanya menambah banyak baris ekstra dan Anda tidak bisa dengan mudah melihat sekilas berapa banyak pendapatan yang dihasilkan untuk hari ini/beberapa hari terakhir.

Mark Stuart meneruskannya ke tim produk konsumen:

> Terima kasih! Saya tidak yakin tim mana yang bertanggung jawab atas Aktivitas, tapi saya teruskan ke kepala produk konsumen untuk menemukan tim yang tepat. Pembayaran berulang $0,00 sepertinya bug. Seharusnya disaring keluar.

**Hasil**: Tidak pernah diperbaiki. UI masih menampilkan entri $0 yang tidak berguna ini.

### 2021: Kegagalan Lingkungan Sandbox {#2021-sandbox-environment-failures}

Pada November 2021, kami melaporkan masalah kritis dengan lingkungan sandbox PayPal:

* Kunci API rahasia sandbox diubah dan dinonaktifkan secara acak
* Semua akun uji sandbox dihapus tanpa pemberitahuan
* Pesan kesalahan saat mencoba melihat detail akun sandbox
* Kegagalan pemuatan yang tidak konsisten

> Entah kenapa kunci API rahasia sandbox saya diubah dan dinonaktifkan. Juga semua akun uji Sandbox lama saya dihapus.

> Kadang mereka bisa dimuat dan kadang tidak juga. Ini sangat membuat frustrasi.

**Hasil**: Tidak ada tanggapan, tidak ada perbaikan. Pengembang masih menghadapi masalah keandalan sandbox.

### 2021: Sistem Laporan Sepenuhnya Rusak {#2021-reports-system-completely-broken}
Pada Mei 2021, kami melaporkan bahwa sistem unduhan PayPal untuk laporan transaksi benar-benar rusak:

> Sepertinya unduhan laporan tidak berfungsi saat ini dan sudah tidak berfungsi sepanjang hari. Juga seharusnya mungkin mendapatkan notifikasi email jika gagal.

Kami juga menunjukkan bencana manajemen sesi:

> Juga jika Anda tidak aktif saat masuk ke PayPal selama sekitar 5 menit, Anda akan keluar. Jadi ketika Anda menyegarkan tombol lagi di samping laporan yang ingin Anda periksa statusnya (setelah menunggu sangat lama), sangat merepotkan harus masuk kembali.

Mark Stuart mengakui masalah waktu habis sesi:

> Saya ingat Anda pernah melaporkan itu sebelumnya dengan sesi Anda yang sering kedaluwarsa dan mengganggu alur pengembangan Anda saat Anda beralih antara IDE Anda dan developer.paypal.com atau dasbor pedagang Anda, lalu Anda kembali dan keluar lagi.

**Hasil**: Waktu habis sesi masih 60 detik. Sistem laporan masih sering gagal.

### 2022: Fitur API Inti Hilang (Lagi) {#2022-core-api-feature-missing-again}

Pada Januari 2022, kami kembali mengeskalasi masalah daftar langganan, kali ini dengan detail lebih banyak tentang bagaimana dokumentasi mereka salah:

> Tidak ada GET yang mencantumkan semua langganan (sebelumnya disebut perjanjian penagihan)

Kami menemukan dokumentasi resmi mereka benar-benar tidak akurat:

> Dokumen API juga benar-benar tidak akurat. Kami pikir kami bisa melakukan solusi dengan mengunduh daftar ID langganan yang dikodekan secara keras. Tapi itu bahkan tidak berhasil!

> Dari dokumen resmi di sini... Dikatakan Anda bisa melakukan ini... Ini yang mengejutkan - tidak ada bidang "ID Langganan" sama sekali yang bisa ditemukan untuk dicentang.

Christina Monti dari PayPal merespons:

> Mohon maaf atas frustrasi yang disebabkan oleh langkah-langkah yang salah ini, kami akan memperbaikinya minggu ini.

Sri Shivananda (CTO) berterima kasih kepada kami:

> Terima kasih atas bantuan Anda yang terus menerus dalam membuat kami lebih baik. Sangat dihargai.

**Hasil**: Dokumentasi tidak pernah diperbaiki. Endpoint daftar langganan tidak pernah dibuat.


## Mimpi Buruk Pengalaman Pengembang {#the-developer-experience-nightmare}

Bekerja dengan API PayPal seperti mundur 10 tahun ke belakang. Berikut adalah masalah teknis yang telah kami dokumentasikan:

### Antarmuka Pengguna Rusak {#broken-user-interface}

Dasbor pengembang PayPal adalah bencana. Berikut yang kami hadapi setiap hari:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  UI PayPal sangat rusak sehingga Anda bahkan tidak bisa menutup notifikasi
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Browser Anda tidak mendukung tag video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Dasbor pengembang benar-benar membuat Anda menggeser slider lalu keluar setelah 60 detik
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Browser Anda tidak mendukung tag video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Lebih banyak bencana UI di antarmuka pengembang PayPal yang menunjukkan alur kerja yang rusak
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Browser Anda tidak mendukung tag video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Antarmuka manajemen langganan - antarmukanya sangat buruk sehingga kami harus mengandalkan kode untuk membuat produk dan rencana langganan
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Tangkapan layar langganan PayPal" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tampilan antarmuka langganan yang rusak dengan fungsi yang hilang (Anda tidak bisa dengan mudah membuat produk/rencana/langganan – dan tampaknya tidak ada cara sama sekali untuk menghapus produk maupun rencana setelah dibuat di UI)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Tangkapan layar langganan PayPal 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Pesan kesalahan PayPal yang khas - membingungkan dan tidak membantu
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Masalah SDK {#sdk-problems}

* Tidak bisa menangani pembayaran sekali saja dan langganan tanpa solusi rumit yang melibatkan pertukaran dan render ulang tombol sambil memuat ulang SDK dengan tag skrip
* SDK JavaScript melanggar konvensi dasar (nama kelas huruf kecil, tidak ada pengecekan instance)
* Pesan kesalahan tidak menunjukkan bidang mana yang hilang
* Tipe data tidak konsisten (memerlukan jumlah dalam bentuk string bukan angka)

### Pelanggaran Kebijakan Keamanan Konten {#content-security-policy-violations}

SDK mereka memerlukan unsafe-inline dan unsafe-eval dalam CSP Anda, **memaksa Anda mengorbankan keamanan situs Anda**.

### Kekacauan Dokumentasi {#documentation-chaos}

Mark Stuart sendiri mengakui:

> Setuju bahwa ada jumlah API lama dan baru yang absurd. Sangat sulit menemukan apa yang dicari (bahkan bagi kami yang bekerja di sini).

### Kerentanan Keamanan {#security-vulnerabilities}

**Implementasi 2FA PayPal terbalik**. Bahkan dengan aplikasi TOTP diaktifkan, mereka memaksa verifikasi SMS - membuat akun rentan terhadap serangan SIM swap. Jika Anda mengaktifkan TOTP, seharusnya itu digunakan secara eksklusif. Cadangan harusnya email, bukan SMS.

### Bencana Manajemen Sesi {#session-management-disaster}

**Dashboard pengembang mereka mengeluarkan Anda setelah 60 detik tidak aktif**. Cobalah melakukan sesuatu yang produktif dan Anda terus-menerus melalui: login → captcha → 2FA → logout → ulangi. Menggunakan VPN? Semoga beruntung.


## Juli 2025: Titik Balik Terakhir {#july-2025-the-final-straw}

Setelah 11 tahun masalah yang sama, titik puncak terjadi selama migrasi akun rutin. Kami perlu beralih ke akun PayPal baru untuk menyesuaikan dengan nama perusahaan kami "Forward Email LLC" agar pembukuan lebih rapi.

Yang seharusnya sederhana berubah menjadi bencana total:

* Pengujian awal menunjukkan semuanya berjalan dengan benar
* Beberapa jam kemudian, PayPal tiba-tiba memblokir semua pembayaran langganan tanpa pemberitahuan
* Pelanggan tidak bisa membayar, menyebabkan kebingungan dan beban dukungan
* Dukungan PayPal memberikan jawaban yang bertentangan mengklaim akun sudah diverifikasi
* Kami terpaksa menghentikan pembayaran PayPal sepenuhnya

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Kesalahan yang dilihat pelanggan saat mencoba membayar - tanpa penjelasan, tanpa log, tanpa apa pun
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Dukungan PayPal mengklaim semuanya baik-baik saja sementara pembayaran benar-benar rusak. Pesan terakhir menunjukkan mereka mengatakan mereka "memulihkan beberapa fitur" tapi masih meminta informasi lebih lanjut yang tidak ditentukan - teater dukungan PayPal klasik
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
  Proses verifikasi identitas yang katanya "memperbaiki" tidak ada apa-apanya
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
  Pesan yang tidak jelas dan masih belum ada penyelesaian. Nol informasi, pemberitahuan, atau apapun mengenai informasi tambahan apa yang diperlukan. Dukungan pelanggan menjadi diam.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Mengapa Kami Tidak Bisa Hanya Meninggalkan PayPal {#why-we-cant-just-drop-paypal}

Meskipun semua masalah ini, kami tidak bisa sepenuhnya meninggalkan PayPal karena beberapa pelanggan hanya memiliki PayPal sebagai opsi pembayaran. Seperti yang dikatakan salah satu pelanggan di [halaman status kami](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal adalah satu-satunya opsi pembayaran saya

**Kami terjebak mendukung platform yang rusak karena PayPal telah menciptakan monopoli pembayaran untuk pengguna tertentu.**


## Solusi Komunitas {#the-community-workaround}

Karena PayPal tidak menyediakan fungsi dasar untuk daftar langganan, komunitas pengembang telah membuat solusi alternatif. Kami membuat skrip yang membantu mengelola langganan PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Skrip ini merujuk pada sebuah [gist komunitas](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) di mana para pengembang berbagi solusi. Pengguna bahkan [mengucapkan terima kasih kepada kami](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) karena menyediakan apa yang seharusnya PayPal buat bertahun-tahun lalu.


## Memblokir Template PayPal Karena Phishing {#blocking-paypal-templates-due-to-phishing}

Masalahnya melampaui API. Template email PayPal dirancang sangat buruk sehingga kami harus menerapkan penyaringan khusus di layanan email kami karena mereka tidak bisa dibedakan dari upaya phishing.

### Masalah Sebenarnya: Template PayPal Terlihat Seperti Penipuan {#the-real-problem-paypals-templates-look-like-scams}

Kami secara rutin menerima laporan email PayPal yang terlihat persis seperti upaya phishing. Berikut contoh nyata dari laporan penyalahgunaan kami:

**Subjek:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Email ini diteruskan ke `abuse@microsoft.com` karena tampak seperti upaya phishing. Masalahnya? Sebenarnya email ini berasal dari lingkungan sandbox PayPal, tetapi desain template mereka sangat buruk sehingga memicu sistem deteksi phishing.

### Implementasi Kami {#our-implementation}

Anda dapat melihat penyaringan khusus PayPal yang kami terapkan di [kode penyaringan email kami](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

Kami menerapkan ini karena PayPal menolak memperbaiki masalah spam/phishing/penipuan besar meskipun kami telah berulang kali melaporkannya ke tim penyalahgunaan mereka. Jenis email spesifik yang kami blokir meliputi:

* **RT000238** - Notifikasi faktur mencurigakan
* **PPC001017** - Konfirmasi pembayaran bermasalah
* **RT000542** - Upaya peretasan pesan hadiah

### Skala Masalah {#the-scale-of-the-problem}

Log penyaringan spam kami menunjukkan volume besar spam faktur PayPal yang kami proses setiap hari. Contoh subjek yang diblokir meliputi:

* "Invoice from PayPal Billing Team:- This charge will be auto-debited from your account. Please contact us immediately at \[PHONE]"
* "Invoice from \[COMPANY NAME] (\[ORDER-ID])"
* Berbagai variasi dengan nomor telepon berbeda dan ID pesanan palsu
Email ini sering berasal dari host `outlook.com` tetapi tampak berasal dari sistem sah PayPal, membuatnya sangat berbahaya. Email tersebut lolos autentikasi SPF, DKIM, dan DMARC karena dikirim melalui infrastruktur PayPal yang sebenarnya.

Log teknis kami menunjukkan email spam ini mengandung header PayPal yang sah:

* `X-Email-Type-Id: RT000238` (ID yang sama yang kami blokir)
* `From: "service@paypal.com" <service@paypal.com>`
* Tanda tangan DKIM valid dari `paypal.com`
* Catatan SPF yang tepat menunjukkan server mail PayPal

Ini menciptakan situasi yang mustahil: email PayPal yang sah dan spam keduanya memiliki karakteristik teknis yang identik.

### Ironi {#the-irony}

PayPal, sebuah perusahaan yang seharusnya memimpin dalam memerangi penipuan keuangan, memiliki template email yang dirancang sangat buruk sehingga memicu sistem anti-phishing. Kami terpaksa memblokir email PayPal yang sah karena tidak dapat dibedakan dari penipuan.

Hal ini didokumentasikan dalam riset keamanan: [Waspadai penipuan alamat baru PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - yang menunjukkan bagaimana sistem PayPal sendiri dieksploitasi untuk penipuan.

### Dampak Dunia Nyata: Penipuan PayPal Baru {#real-world-impact-novel-paypal-scams}

Masalah ini melampaui hanya desain template yang buruk. Sistem faktur PayPal sangat mudah dieksploitasi sehingga penipu secara rutin menyalahgunakannya untuk mengirim faktur palsu yang tampak sah. Peneliti keamanan Gavin Anderegg mendokumentasikan [Penipuan PayPal Baru](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) di mana penipu mengirim faktur PayPal asli yang lolos semua pemeriksaan autentikasi:

> "Memeriksa sumbernya, email tersebut tampak benar-benar berasal dari PayPal (SPF, DKIM, dan DMARC semua lolos). Tombolnya juga terhubung ke URL PayPal yang tampak sah... Butuh waktu sebentar untuk menyadari bahwa itu adalah email asli. Saya baru saja menerima 'faktur' acak dari seorang penipu."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Tangkapan layar yang menunjukkan banyak faktur PayPal palsu membanjiri kotak masuk, semuanya tampak sah karena memang berasal dari sistem PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Tangkapan layar peringatan penipuan PayPal" class="rounded-lg" />
</figure>

Peneliti mencatat:

> "Ini juga tampak seperti fitur kenyamanan yang seharusnya dipertimbangkan PayPal untuk dikunci. Saya langsung menganggap ini adalah bentuk penipuan dan hanya tertarik pada detail teknisnya. Ini tampak terlalu mudah dilakukan, dan saya khawatir orang lain mungkin tertipu."

Ini menggambarkan masalah dengan sempurna: sistem sah PayPal sendiri dirancang sangat buruk sehingga memungkinkan penipuan sekaligus membuat komunikasi sah terlihat mencurigakan.

Untuk memperburuk keadaan, ini memengaruhi deliverability kami dengan Yahoo yang mengakibatkan keluhan pelanggan dan berjam-jam pengujian serta pengecekan pola yang teliti.


## Proses KYC Terbalik PayPal {#paypals-backwards-kyc-process}

Salah satu aspek paling membuat frustrasi dari platform PayPal adalah pendekatan terbalik mereka terhadap kepatuhan dan prosedur Know Your Customer (KYC). Berbeda dengan semua penyedia pembayaran lain, PayPal memungkinkan pengembang mengintegrasikan API mereka dan mulai mengumpulkan pembayaran di produksi sebelum menyelesaikan verifikasi yang tepat.

### Cara Seharusnya Bekerja {#how-it-should-work}

Setiap penyedia pembayaran yang sah mengikuti urutan logis ini:

1. **Selesaikan verifikasi KYC terlebih dahulu**
2. **Setujui akun pedagang**
3. **Berikan akses API produksi**
4. **Izinkan pengumpulan pembayaran**

Ini melindungi baik penyedia pembayaran maupun pedagang dengan memastikan kepatuhan sebelum uang berpindah tangan.

### Cara PayPal Sebenarnya Bekerja {#how-paypal-actually-works}

Proses PayPal benar-benar terbalik:

1. **Berikan akses API produksi segera**
2. **Izinkan pengumpulan pembayaran selama berjam-jam atau berhari-hari**
3. **Tiba-tiba blokir pembayaran tanpa pemberitahuan**
4. **Minta dokumen KYC setelah pelanggan sudah terdampak**
5. **Tidak memberikan pemberitahuan kepada pedagang**
6. **Biarkan pelanggan menemukan masalah dan melaporkannya**
### Dampak Dunia Nyata {#the-real-world-impact}

Proses mundur ini menciptakan bencana bagi bisnis:

* **Pelanggan tidak bisa menyelesaikan pembelian** selama periode penjualan puncak
* **Tidak ada peringatan sebelumnya** bahwa verifikasi diperlukan
* **Tidak ada notifikasi email** saat pembayaran diblokir
* **Pedagang mengetahui masalah dari pelanggan yang bingung**
* **Kehilangan pendapatan** selama periode bisnis yang kritis
* **Kerusakan kepercayaan pelanggan** saat pembayaran gagal secara misterius

### Bencana Migrasi Akun Juli 2025 {#the-july-2025-account-migration-disaster}

Skenario persis ini terjadi selama migrasi akun rutin kami pada Juli 2025. PayPal awalnya mengizinkan pembayaran berjalan, lalu tiba-tiba memblokirnya tanpa pemberitahuan apapun. Kami baru mengetahui masalah ini ketika pelanggan mulai melaporkan mereka tidak bisa membayar.

Ketika kami menghubungi dukungan, kami menerima tanggapan yang bertentangan tentang dokumen apa yang diperlukan, tanpa jadwal penyelesaian yang jelas. Ini memaksa kami untuk sepenuhnya menghentikan pembayaran PayPal, membingungkan pelanggan yang tidak memiliki opsi pembayaran lain.

### Mengapa Ini Penting {#why-this-matters}

Pendekatan PayPal terhadap kepatuhan menunjukkan ketidakpahaman mendasar tentang bagaimana bisnis beroperasi. KYC yang tepat harus dilakukan **sebelum** integrasi produksi, bukan setelah pelanggan sudah mencoba membayar. Kurangnya komunikasi proaktif saat masalah muncul menunjukkan keterputusan PayPal dari kebutuhan pedagang.

Proses mundur ini adalah gejala dari masalah organisasi PayPal yang lebih luas: mereka memprioritaskan proses internal mereka daripada pengalaman pedagang dan pelanggan, yang menyebabkan bencana operasional yang membuat bisnis menjauh dari platform mereka.


## Bagaimana Semua Prosesor Pembayaran Lain Melakukannya dengan Benar {#how-every-other-payment-processor-does-it-right}

Fungsi daftar langganan yang PayPal tolak untuk diterapkan sudah menjadi standar di industri selama lebih dari satu dekade. Berikut cara prosesor pembayaran lain menangani kebutuhan dasar ini:

### Stripe {#stripe}

Stripe sudah memiliki daftar langganan sejak API mereka diluncurkan. Dokumentasi mereka dengan jelas menunjukkan cara mengambil semua langganan untuk pelanggan atau akun pedagang. Ini dianggap sebagai fungsi CRUD dasar.

### Paddle {#paddle}

Paddle menyediakan API manajemen langganan yang komprehensif termasuk daftar, penyaringan, dan paginasi. Mereka memahami bahwa pedagang perlu melihat aliran pendapatan berulang mereka.

### Coinbase Commerce {#coinbase-commerce}

Bahkan prosesor pembayaran cryptocurrency seperti Coinbase Commerce menyediakan manajemen langganan yang lebih baik daripada PayPal.

### Square {#square}

API Square mencakup daftar langganan sebagai fitur fundamental, bukan pemikiran tambahan.

### Standar Industri {#the-industry-standard}

Setiap prosesor pembayaran modern menyediakan:

* Daftar semua langganan
* Filter berdasarkan status, tanggal, pelanggan
* Paginasi untuk dataset besar
* Notifikasi webhook untuk perubahan langganan
* Dokumentasi komprehensif dengan contoh yang berfungsi

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

# Anda HANYA bisa mendapatkan SATU langganan jika Anda sudah mengetahui ID-nya
# Tidak ada endpoint untuk daftar semua langganan
# Tidak ada cara untuk mencari atau memfilter
# Anda harus melacak semua ID langganan sendiri
```

**Endpoint yang Tersedia di PayPal:**

* `POST /v1/billing/subscriptions` - Membuat langganan
* `GET /v1/billing/subscriptions/{id}` - Mendapatkan SATU langganan (jika Anda tahu ID-nya)
* `PATCH /v1/billing/subscriptions/{id}` - Memperbarui langganan
* `POST /v1/billing/subscriptions/{id}/cancel` - Membatalkan langganan
* `POST /v1/billing/subscriptions/{id}/suspend` - Menangguhkan langganan
**Apa yang Hilang dari PayPal:**

* ❌ Tidak ada `GET /v1/billing/subscriptions` (daftar semua)
* ❌ Tidak ada fungsi pencarian
* ❌ Tidak ada penyaringan berdasarkan status, pelanggan, tanggal
* ❌ Tidak ada dukungan paginasi

PayPal adalah satu-satunya pemroses pembayaran besar yang memaksa pengembang untuk melacak ID langganan secara manual di database mereka sendiri.


## Penutupan Sistematis PayPal: Membungkam 6 Juta Suara {#paypals-systematic-cover-up-silencing-6-million-voices}

Dalam langkah yang dengan sempurna menggambarkan pendekatan PayPal dalam menangani kritik, mereka baru-baru ini menutup seluruh forum komunitas mereka, secara efektif membungkam lebih dari 6 juta anggota dan menghapus ratusan ribu posting yang mendokumentasikan kegagalan mereka.

### Penghapusan Besar-Besaran {#the-great-erasure}

Komunitas PayPal asli di `paypal-community.com` memiliki **6.003.558 anggota** dan berisi ratusan ribu posting, laporan bug, keluhan, dan diskusi tentang kegagalan API PayPal. Ini mewakili lebih dari satu dekade bukti terdokumentasi tentang masalah sistematis PayPal.

Pada 30 Juni 2025, PayPal diam-diam menutup seluruh forum tersebut. Semua tautan `paypal-community.com` sekarang mengembalikan error 404. Ini bukan migrasi atau pembaruan.

### Penyelamatan Pihak Ketiga {#the-third-party-rescue}

Untungnya, layanan pihak ketiga di [ppl.lithium.com](https://ppl.lithium.com/) telah menyimpan sebagian konten tersebut, memungkinkan kami mengakses diskusi yang coba disembunyikan PayPal. Namun, penyimpanan pihak ketiga ini tidak lengkap dan bisa hilang kapan saja.

Polanya menyembunyikan bukti ini bukan hal baru bagi PayPal. Mereka memiliki riwayat terdokumentasi:

* Menghapus laporan bug kritis dari pandangan publik
* Menghentikan alat pengembang tanpa pemberitahuan
* Mengubah API tanpa dokumentasi yang tepat
* Membungkam diskusi komunitas tentang kegagalan mereka

Penutupan forum ini merupakan upaya paling berani sejauh ini untuk menyembunyikan kegagalan sistematis mereka dari pengawasan publik.


## Bencana Bug Capture 11 Tahun: $1.899 dan Terus Bertambah {#the-11-year-capture-bug-disaster-1899-and-counting}

Sementara PayPal sibuk mengatur sesi umpan balik dan membuat janji, sistem pemrosesan pembayaran inti mereka telah rusak secara fundamental selama lebih dari 11 tahun. Buktinya sangat menghancurkan.

### Kerugian Forward Email sebesar $1.899 {#forward-emails-1899-loss}

Dalam sistem produksi kami, kami menemukan 108 pembayaran PayPal dengan total **$1.899** yang hilang akibat kegagalan capture PayPal. Pembayaran ini menunjukkan pola yang konsisten:

* webhook `CHECKOUT.ORDER.APPROVED` diterima
* API capture PayPal mengembalikan error 404
* Pesanan menjadi tidak dapat diakses melalui API PayPal

Tidak mungkin menentukan apakah pelanggan telah dikenakan biaya karena PayPal sepenuhnya menyembunyikan log debug setelah 14 hari dan menghapus semua data dari dashboard untuk ID pesanan yang tidak berhasil dicapture.

Ini hanya mewakili satu bisnis. **Kerugian kolektif di ribuan pedagang selama lebih dari 11 tahun kemungkinan mencapai jutaan dolar.**

**Kami akan menyatakannya lagi: kerugian kolektif di ribuan pedagang selama lebih dari 11 tahun kemungkinan mencapai jutaan dolar.**

Satu-satunya alasan kami menemukan ini adalah karena kami sangat teliti dan berbasis data.

### Laporan Asli 2013: 11+ Tahun Kelalaian {#the-2013-original-report-11-years-of-negligence}

Laporan terdokumentasi paling awal tentang masalah ini muncul di [Stack Overflow pada November 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arsip](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Terus menerima Error 404 dengan Rest API saat melakukan capture"

Error yang dilaporkan pada 2013 **identik** dengan yang dialami Forward Email pada 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Respon komunitas pada 2013 sangat menggambarkan:

> "Saat ini ada masalah yang dilaporkan dengan REST API. PayPal sedang mengerjakannya."
**11+ tahun kemudian, mereka masih "sedang mengerjakannya."**

### Pengakuan 2016: PayPal Merusak SDK Mereka Sendiri {#the-2016-admission-paypal-breaks-their-own-sdk}

Pada tahun 2016, repositori GitHub PayPal sendiri mendokumentasikan [gagal tangkap besar-besaran](https://github.com/paypal/PayPal-PHP-SDK/issues/660) yang memengaruhi SDK PHP resmi mereka. Skala masalahnya sangat besar:

> "Sejak 20/9/2016, semua upaya tangkap PayPal gagal dengan pesan 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Tidak ada perubahan antara 19/9 dan 20/9 pada integrasi API. **100% dari upaya tangkap sejak 20/9 mengembalikan kesalahan ini.**"

Seorang pedagang melaporkan:

> "Saya telah mengalami **lebih dari 1.400 upaya tangkap gagal dalam 24 jam terakhir**, semuanya dengan respons kesalahan INVALID_RESOURCE_ID."

Respons awal PayPal adalah menyalahkan pedagang dan merujuk mereka ke dukungan teknis. Baru setelah tekanan besar mereka mengakui kesalahan:

> "Saya memiliki pembaruan dari Pengembang Produk kami. Mereka memperhatikan di header yang dikirim bahwa PayPal-Request-ID dikirim dengan 42 karakter, tetapi **tampaknya ada perubahan baru-baru ini yang membatasi ID ini hanya 38 karakter.**"

Pengakuan ini mengungkap kelalaian sistematis PayPal:

1. **Mereka membuat perubahan yang merusak tanpa dokumentasi**
2. **Mereka merusak SDK resmi mereka sendiri**
3. **Mereka menyalahkan pedagang terlebih dahulu**
4. **Mereka hanya mengakui kesalahan di bawah tekanan**

Bahkan setelah "memperbaiki" masalah, pedagang melaporkan:

> "Memperbarui SDK ke v1.7.4 dan **masalah masih terjadi.**"

### Eskalasi 2024: Masih Rusak {#the-2024-escalation-still-broken}

Laporan terbaru dari komunitas PayPal yang disimpan menunjukkan masalah sebenarnya semakin parah. Sebuah [diskusi September 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arsip](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) mendokumentasikan masalah yang sama persis:

> "Masalah ini baru mulai muncul sekitar 2 minggu yang lalu dan tidak memengaruhi semua pesanan. **Yang jauh lebih umum tampaknya adalah 404 pada saat tangkap.**"

Pedagang menggambarkan pola yang sama seperti yang dialami Forward Email:

> "Setelah mencoba menangkap pesanan, PayPal mengembalikan 404. Saat mengambil Detail Pesanan: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Ini tanpa jejak tangkapan yang berhasil di pihak kami.**"

### Bencana Keandalan Webhook {#the-webhook-reliability-disaster}

Diskusi komunitas lain yang [disimpan](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) mengungkap sistem webhook PayPal yang secara fundamental tidak dapat diandalkan:

> "Secara teori, harus ada dua event (CHECKOUT.ORDER.APPROVED dan PAYMENT.CAPTURE.COMPLETED) dari event Webhook. Sebenarnya, **kedua event tersebut jarang diterima segera, PAYMENT.CAPTURE.COMPLETED sering tidak diterima atau baru diterima beberapa jam kemudian.**"

Untuk pembayaran langganan:

> "**'PAYMENT.SALE.COMPLETED' kadang tidak diterima atau baru diterima beberapa jam kemudian.**"

Pertanyaan pedagang mengungkap kedalaman masalah keandalan PayPal:

1. **"Mengapa ini terjadi?"** - Sistem webhook PayPal secara fundamental rusak
2. **"Jika status pesanan 'COMPLETED', bolehkah saya anggap uang sudah diterima?"** - Pedagang tidak bisa mempercayai respons API PayPal
3. **"Mengapa 'Event Logs->Webhook Events' tidak menemukan log apapun?"** - Bahkan sistem pencatatan PayPal sendiri tidak berfungsi

### Pola Kelalaian Sistematis {#the-pattern-of-systematic-negligence}

Bukti ini tersebar selama lebih dari 11 tahun dan menunjukkan pola yang jelas:

* **2013**: "PayPal sedang mengerjakannya"
* **2016**: PayPal mengakui perubahan yang merusak, memberikan perbaikan yang rusak
* **2024**: Kesalahan yang sama persis masih terjadi, memengaruhi Forward Email dan banyak lainnya

Ini bukan bug - **ini adalah kelalaian sistematis.** PayPal telah mengetahui kegagalan kritis dalam pemrosesan pembayaran ini selama lebih dari satu dekade dan secara konsisten:
1. **Menyalahkan pedagang atas bug PayPal**
2. **Membuat perubahan yang merusak tanpa dokumentasi**
3. **Memberikan perbaikan yang tidak memadai dan tidak berhasil**
4. **Mengabaikan dampak finansial pada bisnis**
5. **Menyembunyikan bukti dengan menutup forum komunitas**

### Persyaratan yang Tidak Didokumentasikan {#the-undocumented-requirement}

Di mana pun dalam dokumentasi resmi PayPal tidak disebutkan bahwa pedagang harus menerapkan logika retry untuk operasi capture. Dokumentasi mereka menyatakan pedagang harus "capture segera setelah persetujuan," tetapi gagal menyebutkan bahwa API mereka secara acak mengembalikan error 404 yang memerlukan mekanisme retry yang kompleks.

Ini memaksa setiap pedagang untuk:

* Menerapkan logika retry dengan exponential backoff
* Menangani pengiriman webhook yang tidak konsisten
* Membangun sistem manajemen status yang kompleks
* Memantau kegagalan capture secara manual

**Setiap penyedia pembayaran lain menyediakan API capture yang andal dan berhasil pada percobaan pertama.**


## Pola Penipuan Lebih Luas dari PayPal {#paypals-broader-pattern-of-deception}

Bencana bug capture hanyalah satu contoh dari pendekatan sistematis PayPal untuk menipu pelanggan dan menyembunyikan kegagalan mereka.

### Tindakan Departemen Layanan Keuangan New York {#the-new-york-department-of-financial-services-action}

Pada Januari 2025, Departemen Layanan Keuangan New York mengeluarkan [tindakan penegakan hukum terhadap PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) atas praktik menipu, menunjukkan bahwa pola penipuan PayPal melampaui API mereka.

Tindakan regulasi ini menunjukkan kesediaan PayPal untuk terlibat dalam praktik menipu di seluruh bisnis mereka, bukan hanya alat pengembang mereka.

### Gugatan Honey: Menulis Ulang Tautan Afiliasi {#the-honey-lawsuit-rewriting-affiliate-links}

Akuisisi PayPal atas Honey telah menghasilkan [gugatan yang menuduh Honey menulis ulang tautan afiliasi](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), mencuri komisi dari pembuat konten dan influencer. Ini merupakan bentuk lain dari penipuan sistematis di mana PayPal mendapatkan keuntungan dengan mengalihkan pendapatan yang seharusnya diterima oleh pihak lain.

Polanya jelas:

1. **Kegagalan API**: Menyembunyikan fungsi yang rusak, menyalahkan pedagang
2. **Membungkam komunitas**: Menghapus bukti masalah
3. **Pelanggaran regulasi**: Terlibat dalam praktik menipu
4. **Pencurian afiliasi**: Mencuri komisi melalui manipulasi teknis

### Biaya Kelalaian PayPal {#the-cost-of-paypals-negligence}

Kerugian Forward Email sebesar $1.899 hanyalah puncak gunung es. Pertimbangkan dampak yang lebih luas:

* **Pedagang individu**: Ribuan kehilangan ratusan hingga ribuan dolar masing-masing
* **Pelanggan perusahaan**: Potensi kehilangan jutaan pendapatan
* **Waktu pengembang**: Tak terhitung jam membangun solusi untuk API PayPal yang rusak
* **Kepercayaan pelanggan**: Bisnis kehilangan pelanggan akibat kegagalan pembayaran PayPal

Jika satu layanan email kecil kehilangan hampir $2.000, dan masalah ini telah ada selama lebih dari 11 tahun yang mempengaruhi ribuan pedagang, kerusakan finansial kolektif kemungkinan mencapai **ratusan juta dolar**.

### Kebohongan Dokumentasi {#the-documentation-lie}

Dokumentasi resmi PayPal secara konsisten gagal menyebutkan batasan dan bug kritis yang akan ditemui pedagang. Contohnya:

* **API Capture**: Tidak disebutkan bahwa error 404 sering terjadi dan memerlukan logika retry
* **Keandalan webhook**: Tidak disebutkan bahwa webhook sering tertunda berjam-jam
* **Daftar langganan**: Dokumentasi menyiratkan daftar dapat dilakukan padahal tidak ada endpoint
* **Timeout sesi**: Tidak disebutkan timeout agresif selama 60 detik

Penghilangan informasi kritis secara sistematis ini memaksa pedagang untuk menemukan keterbatasan PayPal melalui coba-coba di sistem produksi, yang sering berujung pada kerugian finansial.


## Apa Artinya Ini bagi Pengembang {#what-this-means-for-developers}

Kegagalan sistematis PayPal untuk memenuhi kebutuhan dasar pengembang sambil mengumpulkan banyak masukan menunjukkan masalah organisasi yang mendasar. Mereka memperlakukan pengumpulan masukan sebagai pengganti perbaikan masalah secara nyata.
Polanya jelas:

1. Pengembang melaporkan masalah
2. PayPal mengatur sesi umpan balik dengan eksekutif
3. Umpan balik yang luas diberikan
4. Tim mengakui kekurangan dan berjanji untuk "melacak dan menangani"
5. Tidak ada yang diimplementasikan
6. Eksekutif meninggalkan perusahaan untuk perusahaan yang lebih baik
7. Tim baru meminta umpan balik yang sama
8. Siklus berulang

Sementara itu, pengembang dipaksa untuk membuat solusi sementara, mengorbankan keamanan, dan menghadapi UI yang rusak hanya untuk menerima pembayaran.

Jika Anda membangun sistem pembayaran, pelajari dari pengalaman kami: bangun [pendekatan trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) Anda dengan beberapa prosesor, tetapi jangan berharap PayPal menyediakan fungsi dasar yang Anda butuhkan. Rencanakan untuk membuat solusi sementara sejak hari pertama.

> Tulisan ini mendokumentasikan pengalaman kami selama 11 tahun dengan API PayPal di Forward Email. Semua contoh kode dan tautan berasal dari sistem produksi kami yang sebenarnya. Kami terus mendukung pembayaran PayPal meskipun ada masalah ini karena beberapa pelanggan tidak memiliki pilihan lain

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
