# Laporkan Penyalahgunaan {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Laporkan penyalahgunaan dan spam ke Forward Email" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Penafian](#disclaimer)
* [Cara mengirim laporan penyalahgunaan](#how-to-submit-an-abuse-report)
* [Untuk masyarakat umum](#for-the-general-public)
* [Untuk penegak hukum](#for-law-enforcement)
  * [Informasi apa yang tersedia](#what-information-is-available)
  * [Informasi apa yang tidak tersedia](#what-information-is-not-available)
  * [Penegak hukum yang berbasis di Amerika Serikat](#law-enforcement-based-in-the-united-states)
  * [Penegak hukum yang berbasis di luar Amerika Serikat](#law-enforcement-based-outside-of-the-united-states)
  * [Permintaan darurat dari penegak hukum](#law-enforcement-emergency-requests)
  * [Permintaan penegak hukum dapat memicu pemberitahuan akun](#law-enforcement-requests-may-trigger-account-notices)
  * [Permintaan penegak hukum untuk melestarikan informasi](#law-enforcement-requests-to-preserve-information)
  * [Proses penyampaian dokumen penegak hukum](#law-enforcement-serving-process)


## Penafian {#disclaimer}

Silakan merujuk pada [Ketentuan](/terms) kami yang berlaku di seluruh situs.


## Cara mengirim laporan penyalahgunaan {#how-to-submit-an-abuse-report}

Kami meninjau laporan penyalahgunaan dan melayani permintaan informasi untuk [masyarakat umum](#for-the-general-public) dan [penegak hukum](#for-law-enforcement) berdasarkan kasus per kasus melalui email.

Laporan penyalahgunaan dan permintaan informasi terkait pengguna, email, alamat IP, dan/atau domain secara kolektif disebut sebagai "Akun" di bawah ini.

Alamat email kami untuk dihubungi dengan permintaan atau laporan Anda mengenai penyalahgunaan adalah: `support@forwardemail.net`, `abuse@forwardemail.net`, dan `security@forwardemail.net`.

Harap kirim salinan ke semua alamat email ini jika memungkinkan, dan juga kirim email pengingat jika kami tidak menindaklanjuti dalam 24-48+ jam.

Baca bagian-bagian di bawah untuk informasi lebih lanjut yang mungkin relevan bagi Anda.


## Untuk masyarakat umum {#for-the-general-public}

<u>**Jika Anda atau orang lain dalam bahaya segera, harap hubungi polisi dan layanan darurat segera.**</u>

<u>**Anda harus mencari nasihat hukum profesional untuk mendapatkan kembali akses yang hilang ke Akun Anda atau untuk membantu menghentikan pelaku jahat.**</u>

Jika Anda adalah korban penyalahgunaan dari sebuah Akun yang menggunakan layanan kami, harap kirimkan laporan Anda melalui email ke alamat di atas. Jika Akun Anda diambil alih oleh pelaku jahat (misalnya domain Anda baru saja kedaluwarsa dan didaftarkan ulang oleh pihak ketiga lalu digunakan untuk penyalahgunaan), harap kirimkan laporan melalui email ke alamat di atas dengan informasi Akun Anda yang tepat (misalnya nama domain Anda). Kami dapat membantu untuk [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) Akun tersebut setelah validasi kepemilikan Anda sebelumnya. Perlu dicatat bahwa kami tidak memiliki wewenang untuk membantu Anda mendapatkan kembali akses ke Akun Anda.

Perwakilan hukum Anda mungkin menyarankan Anda untuk menghubungi penegak hukum, pemilik Akun Anda (misalnya pendaftar nama domain; situs web tempat Anda mendaftarkan nama domain), dan/atau merujuk Anda ke [halaman ICANN tentang domain yang hilang](https://www.icann.org/resources/pages/lost-domain-names).


## Untuk penegak hukum {#for-law-enforcement}

Untuk sebagian besar permintaan, kemampuan kami untuk mengungkapkan informasi diatur oleh [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), dan seterusnya ("ECPA"). ECPA mewajibkan kami untuk mengungkapkan informasi pengguna tertentu kepada penegak hukum hanya sebagai respons terhadap jenis permintaan hukum tertentu, termasuk surat perintah pengadilan, perintah pengadilan, dan surat perintah penggeledahan.

Jika Anda adalah anggota penegak hukum dan mencari informasi mengenai sebuah Akun, maka informasi Akun serta rentang tanggal dan waktu harus disertakan dalam permintaan Anda. Kami tidak dapat memproses permintaan yang terlalu luas dan/atau tidak jelas – ini untuk melindungi data dan kepercayaan pengguna kami, dan yang paling penting untuk menjaga keamanan data mereka.
Jika permintaan Anda memberi sinyal kepada kami adanya pelanggaran terhadap [Ketentuan](/terms) kami, maka kami akan memprosesnya sesuai dengan praktik terbaik internal kami untuk menangani penyalahgunaan – perhatikan bahwa dalam beberapa kasus ini dapat mengakibatkan penangguhan dan/atau pemblokiran Akun.

**Karena kami bukan pendaftar nama domain**, jika Anda ingin mencari informasi catatan DNS historis mengenai nama domain, maka Anda harus menghubungi pendaftar nama domain spesifik yang sesuai dengan domain tersebut. Layanan seperti [Security Trails]() mungkin menyediakan pencarian catatan historis, tetapi informasi yang lebih spesifik dan akurat mungkin disediakan oleh pendaftar. Untuk menentukan siapa pendaftar nama domain dan/atau pemilik nameserver DNS untuk sebuah domain, alat `dig` dan `whois` dapat berguna (misalnya `whois example.com` atau `dig example.com ns`). Anda dapat menentukan apakah sebuah Akun menggunakan paket berbayar atau paket gratis pada layanan kami dengan melakukan pencarian catatan DNS (misalnya `dig example.com mx` dan `dig example.com txt`). Jika catatan MX tidak mengembalikan nilai seperti `mx1.forwardemail.net` dan `mx2.forwardemail.net`, maka domain tersebut tidak menggunakan layanan kami. Jika catatan TXT mengembalikan alamat email dalam teks biasa (misalnya `forward-email=user@example.com`), maka itu menunjukkan tujuan alamat penerusan email untuk sebuah domain. Jika sebaliknya mengembalikan nilai seperti `forward-email-site-verification=XXXXXXXXXX`, maka itu menunjukkan domain tersebut menggunakan paket berbayar dan konfigurasi penerusan disimpan dalam basis data kami di bawah ID `XXXXXXXXXX`. Untuk informasi lebih lanjut tentang cara kerja layanan kami pada tingkat DNS, silakan merujuk ke [FAQ](/faq).

### Informasi apa yang tersedia {#what-information-is-available}

Silakan merujuk ke bagian Kebijakan Privasi kami untuk [Informasi yang Dikumpulkan](/privacy#information-collected). Akun diizinkan untuk menghapus informasi mereka dari sistem kami sesuai dengan hukum retensi data dan privasi; silakan merujuk ke bagian Kebijakan Privasi kami untuk [Penghapusan Informasi](/privacy#information-removal). Ini berarti bahwa informasi yang diminta mungkin tidak tersedia pada saat permintaan karena penghapusan Akun.

### Informasi apa yang tidak tersedia {#what-information-is-not-available}

Silakan merujuk ke bagian Kebijakan Privasi kami untuk [Informasi yang Tidak Dikumpulkan](/privacy#information-not-collected).

### Penegakan hukum yang berbasis di Amerika Serikat {#law-enforcement-based-in-the-united-states}

Dengan [kecuali keadaan darurat](#law-enforcement-emergency-requests), kami hanya membagikan informasi Akun setelah menerima surat panggilan yang sah, perintah pengadilan ECPA AS, dan/atau surat perintah penggeledahan.

Kami juga dapat [memberitahu Akun](#law-enforcement-requests-may-trigger-account-notices) tentang permintaan penegakan hukum, kecuali kami dilarang melakukannya oleh hukum atau perintah pengadilan.

Jika kami menerima surat panggilan yang sah, perintah pengadilan ECPA, dan/atau surat perintah penggeledahan, maka kami akan memberikan informasi yang relevan dan tersedia sebaik mungkin.

### Penegakan hukum yang berbasis di luar Amerika Serikat {#law-enforcement-based-outside-of-the-united-states}

Kami mengharuskan permintaan disampaikan untuk penegakan hukum yang berbasis di luar Amerika Serikat melalui salah satu dari berikut ini:

* Pengadilan Amerika Serikat.
* Badan penegak hukum di bawah prosedur [perjanjian bantuan hukum timbal balik Amerika Serikat](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Perintah dari pemerintah asing yang tunduk pada perjanjian eksekutif yang telah ditentukan dan disertifikasi oleh Jaksa Agung Amerika Serikat kepada Kongres memenuhi persyaratan [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Permintaan darurat penegakan hukum {#law-enforcement-emergency-requests}

Sesuai dengan hukum di Amerika Serikat (misalnya sesuai dengan [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) dan [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), ketika dengan itikad baik dan dengan verifikasi independen dari pemohon – kami dapat mengungkapkan dan membagikan informasi Akun kepada penegak hukum tanpa surat panggilan, perintah pengadilan ECPA, dan/atau surat perintah penggeledahan ketika kami percaya bahwa melakukan hal tersebut tanpa penundaan diperlukan untuk mencegah kematian atau cedera fisik serius.
Kami mengharuskan permintaan data darurat ("EDR") dikirim melalui email dan menyertakan semua informasi relevan agar dapat memberikan proses yang cepat dan dipercepat.

Perlu dicatat bahwa kami menyadari adanya serangan spoofing, phishing, dan peniruan yang canggih melalui email (misalnya lihat [artikel ini dari The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Kebijakan kami untuk memproses EDR adalah sebagai berikut:

1. Melakukan penelitian mandiri terhadap metadata header email (misalnya DKIM/SPF/DMARC) (atau ketiadaannya) untuk verifikasi.

2. Melakukan upaya terbaik dengan itikad baik (dengan upaya berulang jika perlu) untuk menghubungi pemohon melalui telepon secara mandiri – guna mengonfirmasi keaslian permintaan tersebut. Misalnya, kami dapat menelusuri situs `.gov` terkait yurisdiksi asal permintaan, lalu menghubungi kantor tersebut dari nomor telepon resmi yang tercantum secara publik untuk memverifikasi permintaan.

### Permintaan penegak hukum dapat memicu pemberitahuan akun {#law-enforcement-requests-may-trigger-account-notices}

Kami dapat memberitahukan kepada Akun dan memberikan salinan permintaan penegak hukum yang berkaitan dengan mereka kecuali kami dilarang oleh hukum atau perintah pengadilan untuk melakukannya (misalnya [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Dalam kasus tersebut, jika berlaku, kami dapat memberitahukan Akun ketika perintah larangan pengungkapan telah berakhir.

Jika permintaan informasi oleh penegak hukum valid, maka kami akan [mempertahankan informasi Akun yang diperlukan dan diminta](#law-enforcement-requests-to-preserve-information) dan melakukan upaya wajar untuk menghubungi pemilik Akun melalui alamat email terdaftar dan terverifikasi mereka (misalnya dalam 7 hari kalender). Jika kami menerima keberatan tepat waktu (misalnya dalam 7 hari kalender), maka kami akan menahan pembagian informasi Akun dan melanjutkan proses hukum sesuai kebutuhan.

### Permintaan penegak hukum untuk mempertahankan informasi {#law-enforcement-requests-to-preserve-information}

Kami akan menghormati permintaan valid dari penegak hukum untuk mempertahankan informasi mengenai sebuah Akun sesuai dengan [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Perlu dicatat bahwa pelestarian data dibatasi hanya pada apa yang secara spesifik diminta dan tersedia saat ini.

### Penegak hukum yang menyampaikan proses {#law-enforcement-serving-process}

Kami mengharuskan semua permintaan penegak hukum yang valid memberikan alamat email yang valid dan berfungsi yang dapat kami gunakan untuk berkorespondensi dan memberikan informasi yang diminta secara elektronik.

Semua permintaan harus dikirim ke alamat email yang ditentukan di bawah [Cara mengirim laporan penyalahgunaan](#how-to-submit-an-abuse-report) di atas.

Semua permintaan penegak hukum harus dikirim dengan kop surat instansi atau departemen (misalnya sebagai lampiran PDF hasil scan), dari alamat email resmi dan relevan, serta ditandatangani.

Jika berkaitan dengan [permintaan darurat](#law-enforcement-emergency-requests), harap tulis "Permintaan penegak hukum darurat" pada header Subjek email.

Harap dicatat bahwa kami mungkin memerlukan waktu setidaknya dua minggu untuk dapat meninjau dan menanggapi permintaan Anda.
