# Laporkan Penyalahgunaan {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Penafian](#disclaimer)
* [Cara mengirimkan laporan penyalahgunaan](#how-to-submit-an-abuse-report)
* [Untuk masyarakat umum](#for-the-general-public)
* [Untuk penegakan hukum](#for-law-enforcement)
  * [Informasi apa yang tersedia](#what-information-is-available)
  * [Informasi apa yang tidak tersedia](#what-information-is-not-available)
  * [Penegakan hukum yang berbasis di Amerika Serikat](#law-enforcement-based-in-the-united-states)
  * [Penegakan hukum yang berbasis di luar Amerika Serikat](#law-enforcement-based-outside-of-the-united-states)
  * [Permintaan darurat penegakan hukum](#law-enforcement-emergency-requests)
  * [Permintaan penegakan hukum dapat memicu pemberitahuan akun](#law-enforcement-requests-may-trigger-account-notices)
  * [Permintaan penegakan hukum untuk menjaga informasi](#law-enforcement-requests-to-preserve-information)
  * [Proses pelayanan penegakan hukum](#law-enforcement-serving-process)

## Penafian {#disclaimer}

Harap tunduk pada [Ketentuan](/terms) kami karena berlaku di seluruh situs.

## Cara mengirimkan laporan penyalahgunaan {#how-to-submit-an-abuse-report}

Kami meninjau laporan penyalahgunaan dan mengajukan permintaan informasi untuk [masyarakat umum](#for-the-general-public) dan [penegakan hukum](#for-law-enforcement) berdasarkan kasus per kasus melalui email.

Laporan penyalahgunaan dan permintaan informasi terkait pengguna, email, alamat IP, dan/atau domain secara kolektif disebut sebagai "Akun" di bawah ini.

Alamat email kami untuk menghubungi Anda terkait permintaan atau laporan penyalahgunaan adalah: `abuse@forwardemail.net`

Bacalah bagian di bawah ini untuk informasi lebih lanjut yang mungkin berkaitan dengan Anda.

## Untuk masyarakat umum {#for-the-general-public}

**Jika Anda atau orang lain berada dalam bahaya yang mengancam jiwa, harap segera menghubungi polisi dan layanan darurat.**</u>

**Anda harus mencari nasihat hukum profesional untuk mendapatkan kembali akses yang hilang ke Akun Anda atau untuk membantu menghentikan pelaku kejahatan.**</u>

Jika Anda menjadi korban penyalahgunaan dari Akun yang menggunakan layanan kami, silakan kirimkan laporan Anda melalui email ke alamat di atas. Jika Akun Anda diambil alih oleh pelaku kejahatan (misalnya, domain Anda baru saja kedaluwarsa dan didaftarkan ulang oleh pihak ketiga, lalu digunakan untuk penyalahgunaan), silakan kirimkan laporan melalui email ke alamat di atas dengan informasi Akun Anda yang sebenarnya (misalnya, nama domain Anda). Kami dapat membantu Anda untuk [larangan bayangan](https://en.wikipedia.org/wiki/Shadow_banning) Akun tersebut setelah validasi kepemilikan Anda sebelumnya. Harap diperhatikan bahwa kami tidak memiliki wewenang untuk membantu Anda mendapatkan kembali akses ke Akun Anda.

Perwakilan sah Anda mungkin menyarankan Anda untuk menghubungi penegak hukum, pemilik Akun Anda (misalnya pendaftar nama domain; situs web tempat Anda mendaftarkan nama domain), dan/atau mengarahkan Anda ke [Halaman ICANN tentang domain yang hilang](https://www.icann.org/resources/pages/lost-domain-names).

## Untuk penegakan hukum {#for-law-enforcement}

Untuk sebagian besar permintaan, kemampuan kami untuk mengungkapkan informasi diatur oleh [Undang-Undang Privasi Komunikasi Elektronik](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), dst. ("ECPA"). ECPA mewajibkan kami untuk mengungkapkan informasi pengguna tertentu kepada penegak hukum hanya sebagai tanggapan atas jenis permintaan hukum tertentu, termasuk panggilan pengadilan, perintah pengadilan, dan surat perintah penggeledahan.

Jika Anda adalah anggota penegak hukum dan mencari informasi mengenai suatu Akun, maka informasi Akun serta rentang tanggal dan waktu harus disertakan dalam permintaan Anda. Kami tidak dapat memproses permintaan yang terlalu luas dan/atau tidak jelas – hal ini dilakukan demi melindungi data dan kepercayaan pengguna kami, dan yang terpenting, menjaga keamanan data mereka.

Jika permintaan Anda memberi tahu kami adanya pelanggaran terhadap [Ketentuan](/terms), maka kami akan memprosesnya sesuai praktik terbaik internal kami untuk menangani penyalahgunaan – perlu diketahui bahwa dalam beberapa kasus, hal ini dapat mengakibatkan penangguhan dan/atau pemblokiran Akun.

**Karena kami bukan pendaftar nama domain**, jika Anda ingin mencari informasi riwayat rekaman DNS mengenai suatu nama domain, silakan hubungi pendaftar nama domain yang sesuai dengan domain tersebut. Layanan seperti [Security Trails]() dapat menyediakan pencarian rekaman historis, tetapi informasi yang lebih spesifik dan akurat dapat diberikan dari pendaftar. Untuk menentukan siapa pendaftar nama domain dan/atau pemilik nameserver DNS suatu domain, alat `dig` dan `whois` (misalnya `whois example.com` atau `dig example.com ns`) dapat berguna. Anda dapat menentukan apakah suatu Akun menggunakan paket berbayar atau gratis pada layanan kami dengan melakukan pencarian rekaman DNS (misalnya `dig example.com mx` dan `dig example.com txt`). Jika data MX tidak mengembalikan nilai seperti `mx1.forwardemail.net` dan `mx2.forwardemail.net`, maka domain tersebut tidak menggunakan layanan kami. Jika data TXT mengembalikan alamat email plaintext (misalnya `forward-email=user@example.com`), maka itu menunjukkan alamat penerusan email tujuan untuk domain tersebut. Jika sebaliknya mengembalikan nilai seperti `forward-email-site-verification=XXXXXXXXXX`, maka itu menunjukkan bahwa domain tersebut menggunakan paket berbayar dan konfigurasi penerusan disimpan dalam basis data kami dengan ID `whois`0. Untuk informasi lebih lanjut tentang cara kerja layanan kami di tingkat DNS, silakan lihat `whois`1 kami.

### Informasi apa yang tersedia {#what-information-is-available}

Harap rujuk bagian Kebijakan Privasi kami untuk [Informasi yang Dikumpulkan](/privacy#information-collected). Akun diizinkan untuk menghapus informasinya dari sistem kami sesuai dengan undang-undang privasi dan penyimpanan data; harap rujuk bagian Kebijakan Privasi kami untuk [Penghapusan Informasi](/privacy#information-removal). Ini berarti bahwa informasi yang diminta mungkin tidak tersedia pada saat permintaan karena penghapusan Akun.

### Informasi apa yang tidak tersedia {#what-information-is-not-available}

Harap lihat bagian Kebijakan Privasi kami untuk [Informasi Tidak Dikumpulkan](/privacy#information-not-collected).

### Penegakan hukum yang berbasis di Amerika Serikat {#law-enforcement-based-in-the-united-states}

Dengan [pengecualian keadaan darurat](#law-enforcement-emergency-requests), kami membagikan informasi Akun hanya setelah menerima panggilan pengadilan yang sah, perintah pengadilan ECPA AS, dan/atau surat perintah penggeledahan.

Kami juga dapat [beri tahu Akun](#law-enforcement-requests-may-trigger-account-notices) tentang permintaan penegakan hukum, kecuali kami dilarang melakukannya oleh hukum atau perintah pengadilan.

Jika kami menerima panggilan pengadilan, perintah pengadilan ECPA, dan/atau surat perintah penggeledahan yang sah, maka kami akan memberikan informasi yang relevan dan tersedia sebaik kemampuan kami.

### Penegakan hukum yang berbasis di luar Amerika Serikat {#law-enforcement-based-outside-of-the-united-states}

Kami mengharuskan permintaan disampaikan kepada penegak hukum yang bermarkas di luar Amerika Serikat melalui salah satu cara berikut:

* Pengadilan Amerika Serikat.
* Badan penegakan hukum berdasarkan prosedur [Perjanjian bantuan hukum timbal balik Amerika Serikat](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Perintah dari pemerintah asing yang tunduk pada perjanjian eksekutif yang telah ditetapkan dan disertifikasi oleh Jaksa Agung Amerika Serikat kepada Kongres memenuhi persyaratan [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Permintaan darurat penegakan hukum {#law-enforcement-emergency-requests}

Sesuai dengan hukum yang berlaku di Amerika Serikat (misalnya sesuai dengan [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) dan [Pasal 2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Pengecualian%20untuk%20Pengungkapan%20Catatan%20Pelanggan.%E2%80%94Penyedia%20yang%20dijelaskan%20dalam%20subbagian%20\(a\)%20dapat%20membocorkan%20catatan%20atau%20informasi%20lainnya%20yang%20berkaitan%20dengan%20seorang%20pelanggan%20ke%20atau%20pelanggan%20layanan%20tersebut%20(tidak%20termasuk%20isi%20komunikasi%20yang%20tercakup%20oleh%20subbagian%20\(a\)\(1\)%20atau%20\(a\)\(2\)\)%E2%80%94)), jika dengan itikad baik dan dengan verifikasi independen pemohon – kami dapat mengungkapkan dan membagikan informasi Akun kepada penegak hukum tanpa panggilan pengadilan, perintah pengadilan ECPA, dan/atau surat perintah penggeledahan jika kami yakin bahwa tindakan tersebut tanpa penundaan diperlukan untuk mencegah kematian atau cedera fisik serius.

Kami mengharuskan permintaan data darurat ("EDR") dikirim melalui email dan menyertakan semua informasi relevan untuk menyediakan proses yang tepat waktu dan cepat.

Perlu dicatat bahwa kami menyadari adanya serangan spoofing, phishing, dan peniruan identitas yang canggih melalui email (misalnya lihat [artikel ini dari The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Kebijakan kami untuk memproses EDR adalah sebagai berikut:

1. Teliti secara independen metadata header email (misalnya DKIM/SPF/DMARC) (atau ketiadaannya) untuk verifikasi.

2. Kami berupaya sebaik mungkin dengan itikad baik (dengan upaya berulang jika perlu) untuk menghubungi pemohon secara independen melalui telepon – guna mengonfirmasi keaslian permintaan. Misalnya, kami dapat meneliti situs web `.gov` yang terkait dengan yurisdiksi asal permintaan tersebut, lalu menghubungi kantor tersebut dari nomor telepon resmi mereka yang terdaftar untuk memverifikasi permintaan tersebut.

### Permintaan penegakan hukum dapat memicu pemberitahuan akun {#law-enforcement-requests-may-trigger-account-notices}

Kami dapat memberi tahu Akun dan memberikan salinan permintaan penegakan hukum terkait Akun tersebut, kecuali jika kami dilarang oleh hukum atau perintah pengadilan untuk melakukannya (misalnya, [Pasal 18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Dalam kasus tersebut, jika berlaku, kami dapat memberi tahu Akun tersebut ketika perintah kerahasiaan telah berakhir.

Jika permintaan informasi oleh penegak hukum valid, kami akan menghubungi pemilik Akun melalui alamat email terdaftar dan terverifikasi (misalnya, dalam 7 hari kalender) dan melakukan upaya yang wajar. Jika kami menerima keberatan tepat waktu (misalnya, dalam 7 hari kalender), kami akan menahan diri untuk membagikan informasi Akun dan melanjutkan proses hukum sebagaimana diperlukan.

### Permintaan penegakan hukum untuk menyimpan informasi {#law-enforcement-requests-to-preserve-information}

Kami akan menghormati permintaan yang sah dari penegak hukum untuk menyimpan informasi mengenai Akun sesuai dengan [Pasal 18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Harap diperhatikan bahwa penyimpanan data hanya terbatas pada apa yang diminta secara khusus dan tersedia saat ini.

### Proses pelayanan penegakan hukum {#law-enforcement-serving-process}

Kami mengharuskan semua permintaan penegakan hukum yang sah untuk memberikan kami alamat email yang sah dan berfungsi, yang dapat kami hubungi dan berikan informasi yang diminta secara elektronik.

Semua permintaan harus dikirim ke alamat email yang ditentukan pada [Cara mengirimkan laporan penyalahgunaan](#how-to-submit-an-abuse-report) di atas.

Semua permintaan penegakan hukum harus dikirim dengan kop surat lembaga atau departemen (misalnya sebagai lampiran pindaian PDF), dari alamat email resmi dan relevan, dan ditandatangani.

Jika berkaitan dengan [permintaan darurat](#law-enforcement-emergency-requests), silakan tulis "Permintaan penegakan hukum darurat" di judul Subjek email.

Harap perhatikan bahwa kami mungkin memerlukan waktu setidaknya dua minggu untuk dapat meninjau dan menanggapi permintaan Anda.