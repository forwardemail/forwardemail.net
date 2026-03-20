# Perjanjian Pemrosesan Data {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Perjanjian pemrosesan data Forward Email" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Istilah Kunci](#key-terms)
* [Perubahan pada Perjanjian](#changes-to-the-agreement)
* [1. Hubungan Processor dan Subprocessor](#1-processor-and-subprocessor-relationships)
  * [1. Penyedia sebagai Processor](#1-provider-as-processor)
  * [2. Penyedia sebagai Subprocessor](#2-provider-as-subprocessor)
* [2. Pemrosesan](#2-processing)
  * [1. Detail Pemrosesan](#1-processing-details)
  * [2. Instruksi Pemrosesan](#2-processing-instructions)
  * [3. Pemrosesan oleh Penyedia](#3-processing-by-provider)
  * [4. Pemrosesan oleh Pelanggan](#4-customer-processing)
  * [5. Persetujuan untuk Pemrosesan](#5-consent-to-processing)
  * [6. Subprocessor](#6-subprocessors)
* [3. Transfer Terbatas](#3-restricted-transfers)
  * [1. Otorisasi](#1-authorization)
  * [2. Transfer di Luar EEA](#2-ex-eea-transfers)
  * [3. Transfer di Luar UK](#3-ex-uk-transfers)
  * [4. Transfer Internasional Lainnya](#4-other-international-transfers)
* [4. Respons Insiden Keamanan](#4-security-incident-response)
* [5. Audit & Laporan](#5-audit--reports)
  * [1. Hak Audit](#1-audit-rights)
  * [2. Laporan Keamanan](#2-security-reports)
  * [3. Due Diligence Keamanan](#3-security-due-diligence)
* [6. Koordinasi & Kerjasama](#6-coordination--cooperation)
  * [1. Respons terhadap Pertanyaan](#1-response-to-inquiries)
  * [2. DPIA dan DTIA](#2-dpias-and-dtias)
* [7. Penghapusan Data Pribadi Pelanggan](#7-deletion-of-customer-personal-data)
  * [1. Penghapusan oleh Pelanggan](#1-deletion-by-customer)
  * [2. Penghapusan saat DPA Berakhir](#2-deletion-at-dpa-expiration)
* [8. Batasan Tanggung Jawab](#8-limitation-of-liability)
  * [1. Batas Tanggung Jawab dan Pengabaian Kerusakan](#1-liability-caps-and-damages-waiver)
  * [2. Klaim Pihak Terkait](#2-related-party-claims)
  * [3. Pengecualian](#3-exceptions)
* [9. Konflik Antara Dokumen](#9-conflicts-between-documents)
* [10. Masa Berlaku Perjanjian](#10-term-of-agreement)
* [11. Hukum yang Mengatur dan Pengadilan yang Dipilih](#11-governing-law-and-chosen-courts)
* [12. Hubungan Penyedia Layanan](#12-service-provider-relationship)
* [13. Definisi](#13-definitions)
* [Kredit](#credits)


## Istilah Kunci {#key-terms}

| Istilah                                    | Nilai                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Perjanjian</strong>                 | DPA ini melengkapi [Ketentuan Layanan](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <strong>Subprocessor yang Disetujui</strong> | [Cloudflare](https://cloudflare.com) (AS; penyedia DNS, jaringan, dan keamanan), [DataPacket](https://www.datapacket.com/) (AS/UK; penyedia hosting), [Digital Ocean](https://digitalocean.com) (AS; penyedia hosting), [GitHub](https://github.com) (AS; hosting kode sumber, CI/CD, dan manajemen proyek), [Vultr](https://www.vultr.com) (AS; penyedia hosting), [Stripe](https://stripe.com) (AS; pemroses pembayaran), [PayPal](https://paypal.com) (AS; pemroses pembayaran) |
| <strong>Kontak Keamanan Penyedia</strong>  | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Kebijakan Keamanan</strong>         | Lihat [Kebijakan Keamanan kami di GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                       |
| <strong>Negara yang Mengatur</strong>       | Negara Bagian Delaware, Amerika Serikat                                                                                                                                                                                                                                                                                                                                                                                                                                           |
## Perubahan pada Perjanjian {#changes-to-the-agreement}

Dokumen ini merupakan turunan dari [Common Paper DPA Standard Terms (Versi 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) dan perubahan berikut telah dilakukan:

1. [Hukum yang Mengatur dan Pengadilan yang Dipilih](#11-governing-law-and-chosen-courts) telah dimasukkan sebagai bagian di bawah dengan `Negara Pengatur` yang diidentifikasi di atas.
2. [Hubungan Penyedia Layanan](#12-service-provider-relationship) telah dimasukkan sebagai bagian di bawah.


## 1. Hubungan Processor dan Subprocessor {#1-processor-and-subprocessor-relationships}

### 1. Penyedia sebagai Processor {#1-provider-as-processor}

Dalam situasi di mana <strong>Pelanggan</strong> adalah Pengendali Data Pribadi Pelanggan, <strong>Penyedia</strong> akan dianggap sebagai Processor yang Memproses Data Pribadi atas nama <strong>Pelanggan</strong>.

### 2. Penyedia sebagai Subprocessor {#2-provider-as-subprocessor}

Dalam situasi di mana <strong>Pelanggan</strong> adalah Processor Data Pribadi Pelanggan, <strong>Penyedia</strong> akan dianggap sebagai Subprocessor Data Pribadi Pelanggan.


## 2. Pemrosesan {#2-processing}

### 1. Rincian Pemrosesan {#1-processing-details}

Lampiran I(B) pada Halaman Sampul menjelaskan pokok bahasan, sifat, tujuan, dan durasi Pemrosesan ini, serta <strong>Kategori Data Pribadi</strong> yang dikumpulkan dan <strong>Kategori Subjek Data</strong>.

### 2. Instruksi Pemrosesan {#2-processing-instructions}

<strong>Pelanggan</strong> menginstruksikan <strong>Penyedia</strong> untuk Memproses Data Pribadi Pelanggan: (a) untuk menyediakan dan memelihara Layanan; (b) sebagaimana mungkin lebih lanjut ditentukan melalui penggunaan Layanan oleh <strong>Pelanggan</strong>; (c) sebagaimana didokumentasikan dalam <strong>Perjanjian</strong>; dan (d) sebagaimana didokumentasikan dalam instruksi tertulis lain yang diberikan oleh <strong>Pelanggan</strong> dan diakui oleh <strong>Penyedia</strong> tentang Pemrosesan Data Pribadi Pelanggan berdasarkan DPA ini. <strong>Penyedia</strong> akan mematuhi instruksi ini kecuali dilarang oleh Hukum yang Berlaku. <strong>Penyedia</strong> akan segera memberitahu <strong>Pelanggan</strong> jika tidak dapat mengikuti instruksi Pemrosesan. <strong>Pelanggan</strong> telah memberikan dan hanya akan memberikan instruksi yang mematuhi Hukum yang Berlaku.

### 3. Pemrosesan oleh Penyedia {#3-processing-by-provider}

<strong>Penyedia</strong> hanya akan Memproses Data Pribadi Pelanggan sesuai dengan DPA ini, termasuk rincian pada Halaman Sampul. Jika <strong>Penyedia</strong> memperbarui Layanan untuk memperbarui produk, fitur, atau fungsi yang ada atau menambahkan yang baru, <strong>Penyedia</strong> dapat mengubah <strong>Kategori Subjek Data</strong>, <strong>Kategori Data Pribadi</strong>, <strong>Data Kategori Khusus</strong>, <strong>Pembatasan atau Pengamanan Data Kategori Khusus</strong>, <strong>Frekuensi Transfer</strong>, <strong>Sifat dan Tujuan Pemrosesan</strong>, dan <strong>Durasi Pemrosesan</strong> sesuai kebutuhan untuk mencerminkan pembaruan tersebut dengan memberitahu <strong>Pelanggan</strong> tentang pembaruan dan perubahan tersebut.

### 4. Pemrosesan oleh Pelanggan {#4-customer-processing}

Jika <strong>Pelanggan</strong> adalah Processor dan <strong>Penyedia</strong> adalah Subprocessor, <strong>Pelanggan</strong> akan mematuhi semua Hukum yang Berlaku yang berlaku untuk Pemrosesan Data Pribadi Pelanggan oleh <strong>Pelanggan</strong>. Perjanjian <strong>Pelanggan</strong> dengan Pengendali-nya juga akan mengharuskan <strong>Pelanggan</strong> mematuhi semua Hukum yang Berlaku yang berlaku bagi <strong>Pelanggan</strong> sebagai Processor. Selain itu, <strong>Pelanggan</strong> akan mematuhi persyaratan Subprocessor dalam perjanjian <strong>Pelanggan</strong> dengan Pengendali-nya.

### 5. Persetujuan untuk Pemrosesan {#5-consent-to-processing}

<strong>Pelanggan</strong> telah mematuhi dan akan terus mematuhi semua Hukum Perlindungan Data yang Berlaku terkait penyediaan Data Pribadi Pelanggan kepada <strong>Penyedia</strong> dan/atau Layanan, termasuk melakukan semua pengungkapan, memperoleh semua persetujuan, menyediakan pilihan yang memadai, dan menerapkan pengamanan relevan yang diwajibkan oleh Hukum Perlindungan Data yang Berlaku.
### 6. Subprosesor {#6-subprocessors}

a. <strong>Penyedia</strong> tidak akan menyediakan, mentransfer, atau menyerahkan Data Pribadi Pelanggan kepada Subprosesor kecuali <strong>Pelanggan</strong> telah menyetujui Subprosesor tersebut. Daftar saat ini dari <strong>Subprosesor yang Disetujui</strong> mencakup identitas Subprosesor, negara lokasi mereka, dan tugas Pemrosesan yang diantisipasi. <strong>Penyedia</strong> akan memberitahukan <strong>Pelanggan</strong> setidaknya 10 hari kerja sebelumnya dan secara tertulis mengenai setiap perubahan yang dimaksudkan pada <strong>Subprosesor yang Disetujui</strong> baik dengan penambahan atau penggantian Subprosesor, yang memungkinkan <strong>Pelanggan</strong> memiliki waktu yang cukup untuk menolak perubahan tersebut sebelum <strong>Penyedia</strong> mulai menggunakan Subprosesor baru. <strong>Penyedia</strong> akan memberikan informasi yang diperlukan kepada <strong>Pelanggan</strong> agar <strong>Pelanggan</strong> dapat menggunakan haknya untuk menolak perubahan pada <strong>Subprosesor yang Disetujui</strong>. <strong>Pelanggan</strong> memiliki waktu 30 hari setelah pemberitahuan perubahan pada <strong>Subprosesor yang Disetujui</strong> untuk menolak, jika tidak <strong>Pelanggan</strong> dianggap menerima perubahan tersebut. Jika <strong>Pelanggan</strong> menolak perubahan dalam waktu 30 hari setelah pemberitahuan, <strong>Pelanggan</strong> dan <strong>Penyedia</strong> akan bekerja sama dengan itikad baik untuk menyelesaikan keberatan atau kekhawatiran <strong>Pelanggan</strong>.

b. Saat melibatkan Subprosesor, <strong>Penyedia</strong> akan memiliki perjanjian tertulis dengan Subprosesor yang memastikan Subprosesor hanya mengakses dan menggunakan Data Pribadi Pelanggan (i) sejauh yang diperlukan untuk melaksanakan kewajiban yang disubkontrakkan kepadanya, dan (ii) sesuai dengan ketentuan <strong>Perjanjian</strong>.

c. Jika GDPR berlaku untuk Pemrosesan Data Pribadi Pelanggan, (i) kewajiban perlindungan data yang dijelaskan dalam DPA ini (sebagaimana dirujuk dalam Pasal 28(3) GDPR, jika berlaku) juga dikenakan pada Subprosesor, dan (ii) perjanjian <strong>Penyedia</strong> dengan Subprosesor akan memasukkan kewajiban ini, termasuk rincian tentang bagaimana <strong>Penyedia</strong> dan Subprosesornya akan berkoordinasi untuk menanggapi pertanyaan atau permintaan mengenai Pemrosesan Data Pribadi Pelanggan. Selain itu, <strong>Penyedia</strong> akan membagikan, atas permintaan <strong>Pelanggan</strong>, salinan perjanjian (termasuk amandemen apa pun) dengan Subprosesornya. Sejauh diperlukan untuk melindungi rahasia bisnis atau informasi rahasia lainnya, termasuk data pribadi, <strong>Penyedia</strong> dapat menghapus teks perjanjian dengan Subprosesornya sebelum membagikan salinan tersebut.

d. <strong>Penyedia</strong> tetap sepenuhnya bertanggung jawab atas semua kewajiban yang disubkontrakkan kepada Subprosesornya, termasuk tindakan dan kelalaian Subprosesornya dalam Memproses Data Pribadi Pelanggan. <strong>Penyedia</strong> akan memberitahukan Pelanggan tentang setiap kegagalan Subprosesornya untuk memenuhi kewajiban material terkait Data Pribadi Pelanggan berdasarkan perjanjian antara <strong>Penyedia</strong> dan Subprosesor.


## 3. Transfer Terbatas {#3-restricted-transfers}

### 1. Otorisasi {#1-authorization}

<strong>Pelanggan</strong> setuju bahwa <strong>Penyedia</strong> dapat mentransfer Data Pribadi Pelanggan ke luar EEA, Inggris Raya, atau wilayah geografis relevan lainnya sesuai kebutuhan untuk menyediakan Layanan. Jika <strong>Penyedia</strong> mentransfer Data Pribadi Pelanggan ke wilayah yang belum memiliki keputusan kecukupan dari Komisi Eropa atau otoritas pengawas relevan lainnya, <strong>Penyedia</strong> akan menerapkan langkah pengamanan yang sesuai untuk transfer Data Pribadi Pelanggan ke wilayah tersebut sesuai dengan Hukum Perlindungan Data yang Berlaku.

### 2. Transfer di Luar EEA {#2-ex-eea-transfers}

<strong>Pelanggan</strong> dan <strong>Penyedia</strong> sepakat bahwa jika GDPR melindungi transfer Data Pribadi Pelanggan, transfer tersebut berasal dari <strong>Pelanggan</strong> dari dalam EEA ke <strong>Penyedia</strong> di luar EEA, dan transfer tersebut tidak diatur oleh keputusan kecukupan yang dibuat oleh Komisi Eropa, maka dengan menandatangani DPA ini, <strong>Pelanggan</strong> dan <strong>Penyedia</strong> dianggap telah menandatangani SCC EEA dan Lampirannya, yang diikutsertakan dengan referensi. Setiap transfer tersebut dilakukan berdasarkan SCC EEA, yang diselesaikan sebagai berikut:
a. Modul Dua (Pengendali ke Pemroses) dari EEA SCCs berlaku ketika <strong>Pelanggan</strong> adalah Pengendali dan <strong>Penyedia</strong> sedang Memproses Data Pribadi Pelanggan untuk <strong>Pelanggan</strong> sebagai Pemroses.

b. Modul Tiga (Pemroses ke Sub-Pemroses) dari EEA SCCs berlaku ketika <strong>Pelanggan</strong> adalah Pemroses dan <strong>Penyedia</strong> sedang Memproses Data Pribadi Pelanggan atas nama <strong>Pelanggan</strong> sebagai Subpemroses.

c. Untuk setiap modul, hal berikut berlaku (jika berlaku):

1. Klausul docking opsional dalam Klausul 7 tidak berlaku;

2. Dalam Klausul 9, Opsi 2 (otorisasi tertulis umum) berlaku, dan periode waktu minimum untuk pemberitahuan sebelumnya tentang perubahan Subpemroses adalah 10 hari kerja;

3. Dalam Klausul 11, bahasa opsional tidak berlaku;

4. Semua tanda kurung siku dalam Klausul 13 dihapus;

5. Dalam Klausul 17 (Opsi 1), EEA SCCs akan diatur oleh hukum <strong>Negara Anggota Pengatur</strong>;

6. Dalam Klausul 18(b), sengketa akan diselesaikan di pengadilan <strong>Negara Anggota Pengatur</strong>; dan

7. Halaman Sampul dari DPA ini memuat informasi yang diperlukan dalam Lampiran I, Lampiran II, dan Lampiran III dari EEA SCCs.

### 3. Transfer Ex-UK {#3-ex-uk-transfers}

<strong>Pelanggan</strong> dan <strong>Penyedia</strong> sepakat bahwa jika UK GDPR melindungi transfer Data Pribadi Pelanggan, transfer tersebut berasal dari <strong>Pelanggan</strong> dari dalam Inggris Raya ke <strong>Penyedia</strong> di luar Inggris Raya, dan transfer tersebut tidak diatur oleh keputusan kecukupan yang dibuat oleh Sekretaris Negara Inggris Raya, maka dengan menandatangani DPA ini, <strong>Pelanggan</strong> dan <strong>Penyedia</strong> dianggap telah menandatangani Addendum UK dan Lampirannya, yang diintegrasikan dengan referensi. Setiap transfer tersebut dilakukan berdasarkan Addendum UK, yang diselesaikan sebagai berikut:

a. Bagian 3.2 dari DPA ini memuat informasi yang diperlukan dalam Tabel 2 dari Addendum UK.

b. Tabel 4 dari Addendum UK dimodifikasi sebagai berikut: Tidak ada pihak yang dapat mengakhiri Addendum UK sebagaimana diatur dalam Bagian 19 dari Addendum UK; sejauh ICO mengeluarkan Addendum Disetujui yang direvisi berdasarkan Bagian ‎18 dari Addendum UK, para pihak akan bekerja dengan itikad baik untuk merevisi DPA ini sesuai.

c. Halaman Sampul memuat informasi yang diperlukan oleh Lampiran 1A, Lampiran 1B, Lampiran II, dan Lampiran III dari Addendum UK.

### 4. Transfer Internasional Lainnya {#4-other-international-transfers}

Untuk transfer Data Pribadi di mana hukum Swiss (dan bukan hukum di negara anggota EEA mana pun atau Inggris Raya) berlaku untuk sifat internasional transfer tersebut, referensi ke GDPR dalam Klausul 4 dari EEA SCCs, sejauh diwajibkan secara hukum, diubah untuk merujuk pada Undang-Undang Perlindungan Data Federal Swiss atau penggantinya, dan konsep otoritas pengawas akan mencakup Komisioner Perlindungan Data dan Informasi Federal Swiss.


## 4. Tanggapan Insiden Keamanan {#4-security-incident-response}

1. Setelah mengetahui adanya Insiden Keamanan, <strong>Penyedia</strong> akan: (a) memberitahu <strong>Pelanggan</strong> tanpa penundaan yang tidak semestinya jika memungkinkan, tetapi tidak lebih dari 72 jam setelah mengetahui Insiden Keamanan; (b) memberikan informasi tepat waktu tentang Insiden Keamanan saat diketahui atau sesuai permintaan wajar dari <strong>Pelanggan</strong>; dan (c) segera mengambil langkah-langkah yang wajar untuk menahan dan menyelidiki Insiden Keamanan. Pemberitahuan atau tanggapan <strong>Penyedia</strong> terhadap Insiden Keamanan sebagaimana diwajibkan oleh DPA ini tidak akan dianggap sebagai pengakuan oleh <strong>Penyedia</strong> atas kesalahan atau tanggung jawab atas Insiden Keamanan tersebut.


## 5. Audit & Laporan {#5-audit--reports}

### 1. Hak Audit {#1-audit-rights}

<strong>Penyedia</strong> akan memberikan kepada <strong>Pelanggan</strong> semua informasi yang wajar diperlukan untuk menunjukkan kepatuhannya terhadap DPA ini dan <strong>Penyedia</strong> akan mengizinkan dan berkontribusi pada audit, termasuk inspeksi oleh <strong>Pelanggan</strong>, untuk menilai kepatuhan <strong>Penyedia</strong> terhadap DPA ini. Namun, <strong>Penyedia</strong> dapat membatasi akses ke data atau informasi jika akses <strong>Pelanggan</strong> terhadap informasi tersebut akan berdampak negatif pada hak kekayaan intelektual <strong>Penyedia</strong>, kewajiban kerahasiaan, atau kewajiban lain berdasarkan Hukum yang Berlaku. <strong>Pelanggan</strong> mengakui dan setuju bahwa hak auditnya hanya akan dilaksanakan berdasarkan DPA ini dan hak audit yang diberikan oleh Hukum Perlindungan Data yang Berlaku dengan menginstruksikan <strong>Penyedia</strong> untuk mematuhi persyaratan pelaporan dan uji tuntas di bawah ini. <strong>Penyedia</strong> akan menyimpan catatan kepatuhannya terhadap DPA ini selama 3 tahun setelah DPA berakhir.
### 2. Laporan Keamanan {#2-security-reports}

<strong>Pelanggan</strong> mengakui bahwa <strong>Penyedia</strong> secara rutin diaudit sesuai dengan standar yang ditetapkan dalam <strong>Kebijakan Keamanan</strong> oleh auditor pihak ketiga independen. Atas permintaan tertulis, <strong>Penyedia</strong> akan memberikan kepada <strong>Pelanggan</strong>, secara rahasia, salinan ringkasan dari Laporannya yang sedang berlaku agar <strong>Pelanggan</strong> dapat memverifikasi kepatuhan <strong>Penyedia</strong> terhadap standar yang ditetapkan dalam <strong>Kebijakan Keamanan</strong>.

### 3. Due Diligence Keamanan {#3-security-due-diligence}

Selain Laporan, <strong>Penyedia</strong> akan menanggapi permintaan informasi yang wajar yang diajukan oleh <strong>Pelanggan</strong> untuk mengonfirmasi kepatuhan <strong>Penyedia</strong> terhadap DPA ini, termasuk tanggapan terhadap kuesioner keamanan informasi, due diligence, dan audit, atau dengan memberikan informasi tambahan tentang program keamanan informasinya. Semua permintaan tersebut harus dibuat secara tertulis dan ditujukan kepada <strong>Kontak Keamanan Penyedia</strong> dan hanya dapat dilakukan sekali dalam setahun.


## 6. Koordinasi & Kerjasama {#6-coordination--cooperation}

### 1. Tanggapan atas Pertanyaan {#1-response-to-inquiries}

Jika <strong>Penyedia</strong> menerima pertanyaan atau permintaan dari pihak lain mengenai Pemrosesan Data Pribadi Pelanggan, <strong>Penyedia</strong> akan memberitahukan <strong>Pelanggan</strong> tentang permintaan tersebut dan <strong>Penyedia</strong> tidak akan menanggapi permintaan tersebut tanpa persetujuan sebelumnya dari <strong>Pelanggan</strong>. Contoh pertanyaan dan permintaan semacam ini termasuk perintah dari lembaga yudisial, administratif, atau regulasi mengenai Data Pribadi Pelanggan di mana pemberitahuan kepada <strong>Pelanggan</strong> tidak dilarang oleh Hukum yang Berlaku, atau permintaan dari subjek data. Jika diizinkan oleh Hukum yang Berlaku, <strong>Penyedia</strong> akan mengikuti instruksi wajar dari <strong>Pelanggan</strong> mengenai permintaan ini, termasuk memberikan pembaruan status dan informasi lain yang diminta secara wajar oleh <strong>Pelanggan</strong>. Jika subjek data mengajukan permintaan yang sah berdasarkan Undang-Undang Perlindungan Data yang Berlaku untuk menghapus atau memilih keluar dari pemberian Data Pribadi Pelanggan kepada <strong>Penyedia</strong>, <strong>Penyedia</strong> akan membantu <strong>Pelanggan</strong> dalam memenuhi permintaan tersebut sesuai dengan Undang-Undang Perlindungan Data yang Berlaku. <strong>Penyedia</strong> akan bekerja sama dan memberikan bantuan yang wajar kepada <strong>Pelanggan</strong>, dengan biaya <strong>Pelanggan</strong>, dalam setiap tanggapan hukum atau tindakan prosedural lain yang diambil oleh <strong>Pelanggan</strong> sebagai respons terhadap permintaan pihak ketiga mengenai Pemrosesan Data Pribadi Pelanggan oleh <strong>Penyedia</strong> berdasarkan DPA ini.

### 2. DPIA dan DTIA {#2-dpias-and-dtias}

Jika diwajibkan oleh Undang-Undang Perlindungan Data yang Berlaku, <strong>Penyedia</strong> akan membantu <strong>Pelanggan</strong> secara wajar dalam melakukan penilaian dampak perlindungan data yang diwajibkan atau penilaian dampak transfer data serta konsultasi dengan otoritas perlindungan data yang relevan, dengan mempertimbangkan sifat Pemrosesan dan Data Pribadi Pelanggan.


## 7. Penghapusan Data Pribadi Pelanggan {#7-deletion-of-customer-personal-data}

### 1. Penghapusan oleh Pelanggan {#1-deletion-by-customer}

<strong>Penyedia</strong> akan memungkinkan <strong>Pelanggan</strong> untuk menghapus Data Pribadi Pelanggan dengan cara yang konsisten dengan fungsi Layanan. <strong>Penyedia</strong> akan mematuhi instruksi ini sesegera mungkin kecuali penyimpanan lebih lanjut Data Pribadi Pelanggan diwajibkan oleh Hukum yang Berlaku.

### 2. Penghapusan pada Saat Berakhirnya DPA {#2-deletion-at-dpa-expiration}

a. Setelah DPA berakhir, <strong>Penyedia</strong> akan mengembalikan atau menghapus Data Pribadi Pelanggan sesuai instruksi <strong>Pelanggan</strong> kecuali penyimpanan lebih lanjut Data Pribadi Pelanggan diwajibkan atau diizinkan oleh Hukum yang Berlaku. Jika pengembalian atau penghancuran tidak memungkinkan atau dilarang oleh Hukum yang Berlaku, <strong>Penyedia</strong> akan melakukan upaya yang wajar untuk mencegah Pemrosesan tambahan Data Pribadi Pelanggan dan akan terus melindungi Data Pribadi Pelanggan yang masih berada dalam kepemilikan, penguasaan, atau kendalinya. Misalnya, Hukum yang Berlaku dapat mengharuskan <strong>Penyedia</strong> untuk terus menghosting atau Memproses Data Pribadi Pelanggan.
b. Jika <strong>Customer</strong> dan <strong>Provider</strong> telah memasukkan EEA SCCs atau UK Addendum sebagai bagian dari DPA ini, <strong>Provider</strong> hanya akan memberikan <strong>Customer</strong> sertifikasi penghapusan Data Pribadi yang dijelaskan dalam Klausul 8.1(d) dan Klausul 8.5 dari EEA SCCs jika <strong>Customer</strong> memintanya.


## 8. Batasan Tanggung Jawab {#8-limitation-of-liability}

### 1. Batas Tanggung Jawab dan Pengabaian Ganti Rugi {#1-liability-caps-and-damages-waiver}

**Sampai batas maksimum yang diizinkan berdasarkan Undang-Undang Perlindungan Data yang Berlaku, total tanggung jawab kumulatif masing-masing pihak kepada pihak lain yang timbul dari atau terkait dengan DPA ini akan tunduk pada pengabaian, pengecualian, dan batasan tanggung jawab yang dinyatakan dalam <strong>Agreement</strong>.**

### 2. Klaim Pihak Terkait {#2-related-party-claims}

**Setiap klaim yang diajukan terhadap <strong>Provider</strong> atau Afiliatenya yang timbul dari atau terkait dengan DPA ini hanya dapat diajukan oleh entitas <strong>Customer</strong> yang merupakan pihak dalam <strong>Agreement</strong>.**

### 3. Pengecualian {#3-exceptions}

1. DPA ini tidak membatasi tanggung jawab apa pun kepada individu terkait hak perlindungan data individu tersebut berdasarkan Undang-Undang Perlindungan Data yang Berlaku. Selain itu, DPA ini tidak membatasi tanggung jawab apa pun antara para pihak atas pelanggaran EEA SCCs atau UK Addendum.


## 9. Konflik Antara Dokumen {#9-conflicts-between-documents}

1. DPA ini merupakan bagian dari dan melengkapi Agreement. Jika terdapat ketidaksesuaian antara DPA ini, <strong>Agreement</strong>, atau bagian-bagiannya, bagian yang tercantum lebih awal akan mengendalikan atas bagian yang tercantum kemudian untuk ketidaksesuaian tersebut: (1) EEA SCCs atau UK Addendum, (2) DPA ini, dan kemudian (3) <strong>Agreement</strong>.


## 10. Masa Berlaku Perjanjian {#10-term-of-agreement}

DPA ini akan dimulai ketika <strong>Provider</strong> dan <strong>Customer</strong> menyetujui Halaman Sampul untuk DPA dan menandatangani atau menerima secara elektronik <strong>Agreement</strong> dan akan berlanjut sampai <strong>Agreement</strong> berakhir atau dihentikan. Namun, <strong>Provider</strong> dan <strong>Customer</strong> masing-masing akan tetap tunduk pada kewajiban dalam DPA ini dan Undang-Undang Perlindungan Data yang Berlaku sampai <strong>Customer</strong> berhenti mentransfer Data Pribadi Customer ke <strong>Provider</strong> dan <strong>Provider</strong> berhenti Memproses Data Pribadi Customer.


## 11. Hukum yang Mengatur dan Pengadilan yang Dipilih {#11-governing-law-and-chosen-courts}

Terlepas dari klausul hukum yang mengatur atau klausul serupa dalam <strong>Agreement</strong>, semua interpretasi dan perselisihan mengenai DPA ini akan diatur oleh hukum <strong>Governing State</strong> tanpa memperhatikan ketentuan konflik hukumnya. Selain itu, dan terlepas dari pemilihan forum, yurisdiksi, atau klausul serupa dalam <strong>Agreement</strong>, para pihak setuju untuk mengajukan gugatan hukum, tindakan, atau proses apa pun mengenai DPA ini di, dan masing-masing pihak secara tidak dapat ditarik kembali tunduk pada yurisdiksi eksklusif, pengadilan di <strong>Governing State</strong>.


## 12. Hubungan Penyedia Layanan {#12-service-provider-relationship}

Sejauh California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq ("CCPA") berlaku, para pihak mengakui dan setuju bahwa <strong>Provider</strong> adalah penyedia layanan dan menerima Data Pribadi dari <strong>Customer</strong> untuk menyediakan Layanan sebagaimana disepakati dalam <strong>Agreement</strong>, yang merupakan tujuan bisnis. <strong>Provider</strong> tidak akan menjual Data Pribadi apa pun yang diberikan oleh <strong>Customer</strong> berdasarkan <strong>Agreement</strong>. Selain itu, <strong>Provider</strong> tidak akan menyimpan, menggunakan, atau mengungkapkan Data Pribadi apa pun yang diberikan oleh <strong>Customer</strong> berdasarkan <strong>Agreement</strong> kecuali jika diperlukan untuk menyediakan Layanan bagi <strong>Customer</strong>, sebagaimana dinyatakan dalam <strong>Agreement</strong>, atau sebagaimana diizinkan oleh Undang-Undang Perlindungan Data yang Berlaku. <strong>Provider</strong> menyatakan bahwa mereka memahami pembatasan dalam paragraf ini.
## 13. Definisi {#13-definitions}

1. **"Hukum yang Berlaku"** berarti hukum, aturan, regulasi, perintah pengadilan, dan persyaratan mengikat lainnya dari otoritas pemerintah yang relevan yang berlaku untuk atau mengatur suatu pihak.

2. **"Hukum Perlindungan Data yang Berlaku"** berarti Hukum yang Berlaku yang mengatur bagaimana Layanan dapat memproses atau menggunakan informasi pribadi individu, data pribadi, informasi yang dapat diidentifikasi secara pribadi, atau istilah serupa lainnya.

3. **"Pengendali"** akan memiliki makna yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk perusahaan yang menentukan tujuan dan cakupan Pemrosesan Data Pribadi.

4. **"Halaman Sampul"** berarti dokumen yang ditandatangani atau diterima secara elektronik oleh para pihak yang menggabungkan Ketentuan Standar DPA ini dan mengidentifikasi <strong>Penyedia</strong>, <strong>Pelanggan</strong>, serta pokok dan rincian pemrosesan data.

5. **"Data Pribadi Pelanggan"** berarti Data Pribadi yang <strong>Pelanggan</strong> unggah atau berikan kepada <strong>Penyedia</strong> sebagai bagian dari Layanan dan yang diatur oleh DPA ini.

6. **"DPA"** berarti Ketentuan Standar DPA ini, Halaman Sampul antara <strong>Penyedia</strong> dan <strong>Pelanggan</strong>, serta kebijakan dan dokumen yang dirujuk atau dilampirkan pada Halaman Sampul.

7. **"EEA SCCs"** berarti klausul kontraktual standar yang dilampirkan pada Keputusan Pelaksanaan Komisi Eropa 2021/914 tanggal 4 Juni 2021 tentang klausul kontraktual standar untuk transfer data pribadi ke negara ketiga sesuai dengan Peraturan (UE) 2016/679 Parlemen Eropa dan Dewan Eropa.

8. **"Wilayah Ekonomi Eropa"** atau **"EEA"** berarti negara anggota Uni Eropa, Norwegia, Islandia, dan Liechtenstein.

9. **"GDPR"** berarti Peraturan Uni Eropa 2016/679 yang diimplementasikan oleh hukum lokal di negara anggota EEA yang relevan.

10. **"Data Pribadi"** akan memiliki makna yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk informasi pribadi, data pribadi, atau istilah serupa lainnya.

11. **"Pemrosesan"** atau **"Memproses"** akan memiliki makna yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk setiap penggunaan, atau pelaksanaan operasi komputer pada, Data Pribadi, termasuk dengan metode otomatis.

12. **"Pemroses"** akan memiliki makna yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk perusahaan yang Memproses Data Pribadi atas nama Pengendali.

13. **"Laporan"** berarti laporan audit yang disiapkan oleh perusahaan lain sesuai standar yang ditetapkan dalam Kebijakan Keamanan atas nama Penyedia.

14. **"Transfer Terbatas"** berarti (a) ketika GDPR berlaku, transfer data pribadi dari EEA ke negara di luar EEA yang tidak tunduk pada penentuan kecukupan oleh Komisi Eropa; dan (b) ketika UK GDPR berlaku, transfer data pribadi dari Inggris ke negara lain yang tidak tunduk pada regulasi kecukupan yang diadopsi berdasarkan Pasal 17A Undang-Undang Perlindungan Data Inggris 2018.

15. **"Insiden Keamanan"** berarti Pelanggaran Data Pribadi sebagaimana didefinisikan dalam Pasal 4 GDPR.

16. **"Layanan"** berarti produk dan/atau layanan yang dijelaskan dalam <strong>Perjanjian</strong>.

17. **"Data Kategori Khusus"** akan memiliki makna yang diberikan dalam Pasal 9 GDPR.

18. **"Subpemroses"** akan memiliki makna yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk perusahaan yang, dengan persetujuan dan penerimaan Pengendali, membantu Pemroses dalam Memproses Data Pribadi atas nama Pengendali.

19. **"UK GDPR"** berarti Peraturan Uni Eropa 2016/679 yang diimplementasikan oleh pasal 3 Undang-Undang Penarikan Uni Eropa (Withdrawal) Inggris 2018 di Inggris.

20. **"Addendum UK"** berarti addendum transfer data internasional pada EEA SCCs yang diterbitkan oleh Komisioner Informasi untuk Para Pihak yang melakukan Transfer Terbatas berdasarkan S119A(1) Undang-Undang Perlindungan Data 2018.


## Kredit {#credits}

Dokumen ini merupakan turunan dari [Ketentuan Standar DPA Common Paper (Versi 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) dan dilisensikan di bawah [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
