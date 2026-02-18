# Perjanjian Pemrosesan Data {#data-processing-agreement}

<!-- v1.0 dari <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Istilah-Istilah Utama](#key-terms)
* [Perubahan pada Perjanjian](#changes-to-the-agreement)
* [1. Hubungan Prosesor dan Subprosesor](#1-processor-and-subprocessor-relationships)
  * [1. Penyedia sebagai Pemroses](#1-provider-as-processor)
  * [2. Penyedia sebagai Subprosesor](#2-provider-as-subprocessor)
* [2. Pengolahan](#2-processing)
  * [1. Detail Pemrosesan](#1-processing-details)
  * [2. Instruksi Pemrosesan](#2-processing-instructions)
  * [3. Pemrosesan oleh Penyedia](#3-processing-by-provider)
  * [4. Pemrosesan Pelanggan](#4-customer-processing)
  * [5. Persetujuan untuk Pemrosesan](#5-consent-to-processing)
  * [6. Subprosesor](#6-subprocessors)
* [3. Transfer Terbatas](#3-restricted-transfers)
  * [1. Otorisasi](#1-authorization)
  * [2. Transfer Eks-EEA](#2-ex-eea-transfers)
  * [3. Transfer Ex-UK](#3-ex-uk-transfers)
  * [4. Transfer Internasional Lainnya](#4-other-international-transfers)
* [4. Respons Insiden Keamanan](#4-security-incident-response)
* [5. Audit & Laporan](#5-audit--reports)
  * [1. Hak Audit](#1-audit-rights)
  * [2. Laporan Keamanan](#2-security-reports)
  * [3. Uji Tuntas Keamanan](#3-security-due-diligence)
* [6. Koordinasi & Kerjasama](#6-coordination--cooperation)
  * [1. Tanggapan terhadap Pertanyaan](#1-response-to-inquiries)
  * [2. DPIA dan DTIA](#2-dpias-and-dtias)
* [7. Penghapusan Data Pribadi Pelanggan](#7-deletion-of-customer-personal-data)
  * [1. Penghapusan oleh Pelanggan](#1-deletion-by-customer)
  * [2. Penghapusan pada saat DPA berakhir](#2-deletion-at-dpa-expiration)
* [8. Batasan Tanggung Jawab](#8-limitation-of-liability)
  * [1. Batasan Tanggung Jawab dan Pengabaian Kerugian](#1-liability-caps-and-damages-waiver)
  * [2. Klaim Pihak Terkait](#2-related-party-claims)
  * [3. Pengecualian](#3-exceptions)
* [9. Konflik Antar Dokumen](#9-conflicts-between-documents)
* [10. Jangka Waktu Perjanjian](#10-term-of-agreement)
* [11. Hukum yang Mengatur dan Pengadilan yang Dipilih](#11-governing-law-and-chosen-courts)
* [12. Hubungan Penyedia Layanan](#12-service-provider-relationship)
* [13. Definisi](#13-definitions)
* [Kredit](#credits)

## Istilah Kunci {#key-terms}

| Ketentuan | Nilai |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Persetujuan</strong> | DPA ini melengkapi [Terms of Service](/terms) |
| <strong>Subprosesor yang Disetujui</strong> | [Cloudflare](https://cloudflare.com) (AS; penyedia DNS, jaringan, dan keamanan), [DataPacket](https://www.datapacket.com/) (AS/Inggris; penyedia hosting), [Digital Ocean](https://digitalocean.com) (AS; penyedia hosting), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (AS; penyedia hosting), [Stripe](https://stripe.com) (AS; pemroses pembayaran), [PayPal](https://paypal.com) (AS; pemroses pembayaran) |
| <strong>Kontak Keamanan Penyedia</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Kebijakan Keamanan</strong> | Lihat [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Negara yang Memerintah</strong> | Negara Bagian Delaware, Amerika Serikat |

## Perubahan Perjanjian {#changes-to-the-agreement}

Dokumen ini merupakan turunan dari [Istilah Standar DPA Makalah Umum (Versi 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) dan perubahan berikut telah dilakukan:

1. [Hukum yang Mengatur dan Pengadilan yang Dipilih](#11-governing-law-and-chosen-courts) telah disertakan sebagai bagian di bawah ini dengan `Governing State` yang telah diidentifikasi di atas.
2. [Hubungan Penyedia Layanan](#12-service-provider-relationship) telah disertakan sebagai bagian di bawah ini.

## 1. Hubungan Prosesor dan Subprosesor {#1-processor-and-subprocessor-relationships}

### 1. Penyedia sebagai Prosesor {#1-provider-as-processor}

Dalam situasi di mana <strong>Pelanggan</strong> adalah Pengendali Data Pribadi Pelanggan, <strong>Penyedia</strong> akan dianggap sebagai Pemroses yang Memproses Data Pribadi atas nama <strong>Pelanggan</strong>.

### 2. Penyedia sebagai Subprosesor {#2-provider-as-subprocessor}

Dalam situasi di mana <strong>Pelanggan</strong> merupakan Pemroses Data Pribadi Pelanggan, <strong>Penyedia</strong> akan dianggap sebagai Subpemroses Data Pribadi Pelanggan.

## 2. Memproses {#2-processing}

### 1. Detail Pemrosesan {#1-processing-details}

Lampiran I(B) pada Halaman Sampul menjelaskan pokok bahasan, sifat, tujuan, dan durasi Pemrosesan ini, serta <strong>Kategori Data Pribadi</strong> yang dikumpulkan dan <strong>Kategori Subjek Data</strong>.

### 2. Instruksi Pemrosesan {#2-processing-instructions}

<strong>Pelanggan</strong> menginstruksikan <strong>Penyedia</strong> untuk Memproses Data Pribadi Pelanggan: (a) untuk menyediakan dan memelihara Layanan; (b) sebagaimana dapat ditentukan lebih lanjut melalui penggunaan Layanan oleh <strong>Pelanggan</strong>; (c) sebagaimana didokumentasikan dalam <strong>Perjanjian</strong>; dan (d) sebagaimana didokumentasikan dalam instruksi tertulis lainnya yang diberikan oleh <strong>Pelanggan</strong> dan diakui oleh <strong>Penyedia</strong> tentang Pemrosesan Data Pribadi Pelanggan berdasarkan DPA ini. <strong>Penyedia</strong> akan mematuhi instruksi ini kecuali dilarang melakukannya oleh Hukum yang Berlaku. <strong>Penyedia</strong> akan segera memberi tahu <strong>Pelanggan</strong> jika tidak dapat mengikuti instruksi Pemrosesan. <strong>Pelanggan</strong> telah memberikan dan hanya akan memberikan instruksi yang mematuhi Hukum yang Berlaku.

### 3. Pemrosesan oleh Penyedia {#3-processing-by-provider}

Penyedia hanya akan memproses Data Pribadi Pelanggan sesuai dengan DPA ini, termasuk detailnya di Halaman Sampul. Jika Penyedia memperbarui Layanan untuk memperbarui produk, fitur, atau fungsi yang ada atau baru, Penyedia dapat mengubah Kategori Subjek Data, Kategori Data Pribadi, Data Kategori Khusus, Pembatasan atau Perlindungan Data Kategori Khusus, Frekuensi Transfer, Sifat dan Tujuan Pemrosesan, dan Durasi Pemrosesan sebagaimana diperlukan untuk mencerminkan pembaruan tersebut dengan memberi tahu Pelanggan tentang pembaruan dan perubahan tersebut.

### 4. Pemrosesan Pelanggan {#4-customer-processing}

Apabila <strong>Pelanggan</strong> adalah Pemroses dan <strong>Penyedia</strong> adalah Subpemroses, <strong>Pelanggan</strong> wajib mematuhi semua Hukum yang Berlaku yang berlaku untuk Pemrosesan Data Pribadi Pelanggan oleh <strong>Pelanggan</strong>. Perjanjian <strong>Pelanggan</strong> dengan Pengendalinya juga akan mewajibkan <strong>Pelanggan</strong> untuk mematuhi semua Hukum yang Berlaku yang berlaku bagi <strong>Pelanggan</strong> sebagai Pemroses. Selain itu, <strong>Pelanggan</strong> wajib mematuhi persyaratan Subpemroses dalam perjanjian <strong>Pelanggan</strong> dengan Pengendalinya.

### 5. Persetujuan untuk Pemrosesan {#5-consent-to-processing}

<strong>Pelanggan</strong> telah mematuhi dan akan terus mematuhi semua Hukum Perlindungan Data yang Berlaku terkait penyediaan Data Pribadi Pelanggan kepada <strong>Penyedia</strong> dan/atau Layanan, termasuk melakukan semua pengungkapan, memperoleh semua persetujuan, menyediakan pilihan yang memadai, dan menerapkan perlindungan relevan yang diwajibkan berdasarkan Hukum Perlindungan Data yang Berlaku.

### 6. Subprosesor {#6-subprocessors}

a. <strong>Penyedia</strong> tidak akan memberikan, mentransfer, atau menyerahkan Data Pribadi Pelanggan apa pun kepada Subprosesor kecuali <strong>Pelanggan</strong> telah menyetujui Subprosesor tersebut. Daftar <strong>Subprosesor yang Disetujui</strong> saat ini mencakup identitas Subprosesor, negara lokasi mereka, dan tugas Pemrosesan yang diantisipasi. <strong>Penyedia</strong> akan memberi tahu <strong>Pelanggan</strong> setidaknya 10 hari kerja sebelumnya dan secara tertulis tentang setiap perubahan yang dimaksudkan pada <strong>Subprosesor yang Disetujui</strong>, baik melalui penambahan atau penggantian Subprosesor, yang memungkinkan <strong>Pelanggan</strong> memiliki cukup waktu untuk mengajukan keberatan terhadap perubahan tersebut sebelum <strong>Penyedia</strong> mulai menggunakan Subprosesor baru. <strong>Penyedia</strong> akan memberikan <strong>Pelanggan</strong> informasi yang diperlukan agar <strong>Pelanggan</strong> dapat menggunakan haknya untuk mengajukan keberatan terhadap perubahan pada <strong>Subprosesor yang Disetujui</strong>. Pelanggan memiliki waktu 30 hari setelah pemberitahuan perubahan kepada Subprosesor yang Disetujui untuk mengajukan keberatan. Jika tidak, Pelanggan akan dianggap menerima perubahan tersebut. Jika Pelanggan menolak perubahan dalam waktu 30 hari sejak pemberitahuan, Pelanggan dan Penyedia akan bekerja sama dengan itikad baik untuk menyelesaikan keberatan atau keluhan Pelanggan.

b. Saat melibatkan Subprosesor, <strong>Penyedia</strong> akan memiliki perjanjian tertulis dengan Subprosesor yang memastikan Subprosesor hanya mengakses dan menggunakan Data Pribadi Pelanggan (i) sejauh yang diperlukan untuk melaksanakan kewajiban yang disubkontrakkan kepadanya, dan (ii) konsisten dengan ketentuan <strong>Perjanjian</strong>.

c. Jika GDPR berlaku untuk Pemrosesan Data Pribadi Pelanggan, (i) kewajiban perlindungan data yang dijelaskan dalam DPA ini (sebagaimana dimaksud dalam Pasal 28(3) GDPR, jika berlaku) juga diberlakukan pada Subprosesor, dan (ii) perjanjian <strong>Penyedia</strong> dengan Subprosesor akan menggabungkan kewajiban-kewajiban ini, termasuk detail tentang bagaimana <strong>Penyedia</strong> dan Subprosesornya akan berkoordinasi untuk menanggapi pertanyaan atau permintaan tentang Pemrosesan Data Pribadi Pelanggan. Selain itu, <strong>Penyedia</strong> akan membagikan, atas permintaan <strong>Pelanggan</strong>, salinan perjanjiannya (termasuk setiap amandemennya) dengan Subprosesornya. Sejauh yang diperlukan untuk melindungi rahasia bisnis atau informasi rahasia lainnya, termasuk data pribadi, <strong>Penyedia</strong> dapat menyunting teks perjanjiannya dengan Subprosesornya sebelum membagikan salinannya.

d. <strong>Penyedia</strong> tetap bertanggung jawab penuh atas semua kewajiban yang disubkontrakkan kepada Subprosesornya, termasuk tindakan dan kelalaian Subprosesornya dalam Memproses Data Pribadi Pelanggan. <strong>Penyedia</strong> akan memberi tahu Pelanggan tentang setiap kegagalan Subprosesornya untuk memenuhi kewajiban material tentang Data Pribadi Pelanggan berdasarkan perjanjian antara <strong>Penyedia</strong> dan Subprosesor.

## 3. Transfer Terbatas {#3-restricted-transfers}

### 1. Otorisasi {#1-authorization}

Pelanggan setuju bahwa Penyedia dapat mentransfer Data Pribadi Pelanggan ke luar EEA, Inggris Raya, atau wilayah geografis relevan lainnya sebagaimana diperlukan untuk menyediakan Layanan. Jika Penyedia mentransfer Data Pribadi Pelanggan ke wilayah yang belum ditetapkan kecukupannya oleh Komisi Eropa atau otoritas pengawas terkait lainnya, Penyedia akan menerapkan perlindungan yang sesuai untuk transfer Data Pribadi Pelanggan ke wilayah tersebut sesuai dengan Hukum Perlindungan Data yang Berlaku.

### 2. Transfer Eks-EEA {#2-ex-eea-transfers}

<strong>Pelanggan</strong> dan <strong>Penyedia</strong> sepakat bahwa jika GDPR melindungi transfer Data Pribadi Pelanggan, transfer tersebut dilakukan dari <strong>Pelanggan</strong> di dalam EEA ke <strong>Penyedia</strong> di luar EEA, dan transfer tersebut tidak diatur oleh keputusan kecukupan yang dibuat oleh Komisi Eropa, maka dengan menandatangani DPA ini, <strong>Pelanggan</strong> dan <strong>Penyedia</strong> dianggap telah menandatangani SCC EEA dan Lampirannya, yang disertakan sebagai referensi. Setiap transfer tersebut dilakukan sesuai dengan SCC EEA, yang dilengkapi sebagai berikut:

a. Modul Dua (Pengendali ke Pemroses) dari SCC EEA berlaku ketika <strong>Pelanggan</strong> adalah Pengendali dan <strong>Penyedia</strong> Memproses Data Pribadi Pelanggan untuk <strong>Pelanggan</strong> sebagai Pemroses.

b. Modul Tiga (Pemroses ke Subpemroses) dari SCC EEA berlaku ketika <strong>Pelanggan</strong> adalah Pemroses dan <strong>Penyedia</strong> Memproses Data Pribadi Pelanggan atas nama <strong>Pelanggan</strong> sebagai Subpemroses.

c. Untuk setiap modul, berlaku ketentuan berikut (jika berlaku):

1. Klausul docking opsional dalam Klausul 7 tidak berlaku;

2. Dalam Klausul 9, Opsi 2 (otorisasi tertulis umum) berlaku, dan jangka waktu minimum untuk pemberitahuan sebelumnya tentang perubahan Subprosesor adalah 10 hari kerja;

3. Dalam Klausul 11, bahasa opsional tidak berlaku;

4. Semua tanda kurung siku dalam Klausul 13 dihapus;

5. Dalam Klausul 17 (Opsi 1), SCC EEA akan diatur oleh hukum <strong>Negara Anggota yang Mengatur</strong>;

6. Dalam Klausul 18(b), perselisihan akan diselesaikan di pengadilan <strong>Negara Anggota yang Mengatur</strong>; dan

7. Halaman Sampul DPA ini memuat informasi yang dipersyaratkan dalam Lampiran I, Lampiran II, dan Lampiran III SCC EEA.

### 3. Transfer Ex-UK {#3-ex-uk-transfers}

<strong>Pelanggan</strong> dan <strong>Penyedia</strong> sepakat bahwa jika GDPR Inggris melindungi transfer Data Pribadi Pelanggan, transfer tersebut dilakukan dari <strong>Pelanggan</strong> di dalam Britania Raya ke <strong>Penyedia</strong> di luar Britania Raya, dan transfer tersebut tidak diatur oleh keputusan kecukupan yang dibuat oleh Sekretaris Negara Britania Raya, maka dengan menandatangani DPA ini, <strong>Pelanggan</strong> dan <strong>Penyedia</strong> dianggap telah menandatangani Adendum Inggris dan Lampirannya, yang disertakan sebagai referensi. Setiap transfer tersebut dilakukan sesuai dengan Adendum Inggris, yang dilengkapi sebagai berikut:

a. Bagian 3.2 dari DPA ini berisi informasi yang dipersyaratkan dalam Tabel 2 dari Addendum Inggris.

b. Tabel 4 dari Adendum Inggris diubah sebagai berikut: Tidak ada pihak yang dapat mengakhiri Adendum Inggris sebagaimana ditetapkan dalam Bagian 19 dari Adendum Inggris; sejauh ICO menerbitkan Adendum yang Disetujui yang direvisi berdasarkan Bagian 18 dari Adendum Inggris, para pihak akan bekerja dengan itikad baik untuk merevisi DPA ini sebagaimana mestinya.

c. Halaman Sampul memuat informasi yang diwajibkan oleh Lampiran 1A, Lampiran 1B, Lampiran II, dan Lampiran III dari Adendum Inggris.

### 4. Transfer Internasional Lainnya {#4-other-international-transfers}

Untuk transfer Data Pribadi yang hukum Swiss (dan bukan hukum di negara anggota EEA atau Inggris Raya) berlaku untuk sifat internasional dari transfer tersebut, referensi ke GDPR dalam Klausul 4 SCC EEA, sejauh yang diwajibkan oleh hukum, diubah untuk merujuk ke Undang-Undang Perlindungan Data Federal Swiss atau penggantinya, dan konsep otoritas pengawasan akan mencakup Komisaris Informasi dan Perlindungan Data Federal Swiss.

## 4. Respons Insiden Keamanan {#4-security-incident-response}

1. Setelah menyadari adanya Insiden Keamanan, <strong>Penyedia</strong> akan: (a) memberi tahu <strong>Pelanggan</strong> tanpa penundaan yang tidak semestinya jika memungkinkan, namun tidak lebih dari 72 jam setelah menyadari Insiden Keamanan; (b) memberikan informasi tepat waktu tentang Insiden Keamanan saat diketahui atau sebagaimana diminta secara wajar oleh <strong>Pelanggan</strong>; dan (c) segera mengambil langkah-langkah yang wajar untuk menahan dan menyelidiki Insiden Keamanan. Pemberitahuan <strong>Penyedia</strong> atau tanggapan terhadap Insiden Keamanan sebagaimana diwajibkan oleh DPA ini tidak akan ditafsirkan sebagai pengakuan oleh <strong>Penyedia</strong> atas kesalahan atau tanggung jawab apa pun atas Insiden Keamanan.

## 5. Audit & Laporan {#5-audit--reports}

### 1. Hak Audit {#1-audit-rights}

Penyedia akan memberikan semua informasi yang diperlukan secara wajar kepada Pelanggan untuk menunjukkan kepatuhannya terhadap DPA ini, dan Penyedia akan mengizinkan dan berkontribusi pada audit, termasuk inspeksi oleh Pelanggan, untuk menilai kepatuhan Penyedia terhadap DPA ini. Namun, Penyedia dapat membatasi akses ke data atau informasi jika akses Pelanggan terhadap informasi tersebut akan berdampak negatif terhadap hak kekayaan intelektual Penyedia, kewajiban kerahasiaan, atau kewajiban lain berdasarkan Hukum yang Berlaku. Pelanggan mengakui dan setuju bahwa ia hanya akan menggunakan hak auditnya berdasarkan DPA ini dan hak audit apa pun yang diberikan oleh Hukum Perlindungan Data yang Berlaku dengan menginstruksikan Penyedia untuk mematuhi persyaratan pelaporan dan uji tuntas di bawah ini. Penyedia akan menyimpan catatan kepatuhannya terhadap DPA ini selama 3 tahun setelah DPA berakhir.

### 2. Laporan Keamanan {#2-security-reports}

Pelanggan mengakui bahwa Penyedia diaudit secara berkala berdasarkan standar yang ditetapkan dalam Kebijakan Keamanan oleh auditor pihak ketiga independen. Atas permintaan tertulis, Penyedia akan memberikan kepada Pelanggan, secara rahasia, salinan ringkasan Laporan yang berlaku saat itu agar Pelanggan dapat memverifikasi kepatuhan Penyedia terhadap standar yang ditetapkan dalam Kebijakan Keamanan.

### 3. Uji Tuntas Keamanan {#3-security-due-diligence}

Selain Laporan, <strong>Penyedia</strong> akan menanggapi permintaan informasi yang wajar dari <strong>Pelanggan</strong> untuk mengonfirmasi kepatuhan <strong>Penyedia</strong> terhadap DPA ini, termasuk tanggapan terhadap kuesioner keamanan informasi, uji tuntas, dan audit, atau dengan memberikan informasi tambahan tentang program keamanan informasinya. Semua permintaan tersebut harus dibuat secara tertulis dan ditujukan kepada <strong>Kontak Keamanan Penyedia</strong> dan hanya dapat diajukan setahun sekali.

## 6. Koordinasi & Kerja Sama {#6-coordination--cooperation}

### 1. Tanggapan atas Pertanyaan {#1-response-to-inquiries}

Jika <strong>Penyedia</strong> menerima pertanyaan atau permintaan apa pun dari siapa pun tentang Pemrosesan Data Pribadi Pelanggan, <strong>Penyedia</strong> akan memberi tahu <strong>Pelanggan</strong> tentang permintaan tersebut dan <strong>Penyedia</strong> tidak akan menanggapi permintaan tersebut tanpa persetujuan <strong>Pelanggan</strong> sebelumnya. Contoh pertanyaan dan permintaan semacam ini mencakup perintah dari lembaga peradilan, administratif, atau regulator tentang Data Pribadi Pelanggan di mana pemberitahuan kepada <strong>Pelanggan</strong> tidak dilarang oleh Hukum yang Berlaku, atau permintaan dari subjek data. Jika diizinkan oleh Hukum yang Berlaku, <strong>Penyedia</strong> akan mengikuti instruksi wajar <strong>Pelanggan</strong> tentang permintaan ini, termasuk memberikan pembaruan status dan informasi lain yang secara wajar diminta oleh <strong>Pelanggan</strong>. Jika subjek data mengajukan permintaan yang sah berdasarkan Hukum Perlindungan Data yang Berlaku untuk menghapus atau memilih untuk tidak memberikan Data Pribadi Pelanggan kepada Penyedia, Penyedia akan membantu Pelanggan dalam memenuhi permintaan tersebut sesuai dengan Hukum Perlindungan Data yang Berlaku. Penyedia akan bekerja sama dan memberikan bantuan yang wajar kepada Pelanggan, dengan biaya Pelanggan, dalam setiap tanggapan hukum atau tindakan prosedural lain yang diambil oleh Pelanggan sebagai tanggapan atas permintaan pihak ketiga tentang Pemrosesan Data Pribadi Pelanggan oleh Penyedia berdasarkan DPA ini.

### 2. DPIA dan DTIA {#2-dpias-and-dtias}

Jika diharuskan oleh Hukum Perlindungan Data yang Berlaku, <strong>Penyedia</strong> akan secara wajar membantu <strong>Pelanggan</strong> dalam melaksanakan penilaian dampak perlindungan data yang diamanatkan atau penilaian dampak transfer data dan konsultasi dengan otoritas perlindungan data yang relevan, dengan mempertimbangkan sifat Pemrosesan dan Data Pribadi Pelanggan.

## 7. Penghapusan Data Pribadi Pelanggan {#7-deletion-of-customer-personal-data}

### 1. Penghapusan oleh Pelanggan {#1-deletion-by-customer}

<strong>Penyedia</strong> akan mengizinkan <strong>Pelanggan</strong> untuk menghapus Data Pribadi Pelanggan dengan cara yang konsisten dengan fungsionalitas Layanan. <strong>Penyedia</strong> akan mematuhi instruksi ini sesegera mungkin, kecuali jika penyimpanan lebih lanjut atas Data Pribadi Pelanggan diwajibkan oleh Hukum yang Berlaku.

### 2. Penghapusan saat DPA Berakhir {#2-deletion-at-dpa-expiration}

a. Setelah DPA berakhir, <strong>Penyedia</strong> akan mengembalikan atau menghapus Data Pribadi Pelanggan atas instruksi <strong>Pelanggan</strong>, kecuali penyimpanan lebih lanjut atas Data Pribadi Pelanggan diwajibkan atau diizinkan oleh Hukum yang Berlaku. Jika pengembalian atau pemusnahan tidak dapat dilakukan atau dilarang oleh Hukum yang Berlaku, <strong>Penyedia</strong> akan melakukan upaya yang wajar untuk mencegah Pemrosesan Data Pribadi Pelanggan lebih lanjut dan akan terus melindungi Data Pribadi Pelanggan yang masih berada dalam kepemilikan, penyimpanan, atau kendalinya. Misalnya, Hukum yang Berlaku mungkin mewajibkan <strong>Penyedia</strong> untuk terus menyimpan atau Memproses Data Pribadi Pelanggan.

b. Jika <strong>Pelanggan</strong> dan <strong>Penyedia</strong> telah memasuki SCC EEA atau Adendum Inggris sebagai bagian dari DPA ini, <strong>Penyedia</strong> hanya akan memberikan <strong>Pelanggan</strong> sertifikasi penghapusan Data Pribadi yang dijelaskan dalam Klausul 8.1(d) dan Klausul 8.5 SCC EEA jika <strong>Pelanggan</strong> memintanya.

## 8. Batasan Tanggung Jawab {#8-limitation-of-liability}

### 1. Batas Tanggung Jawab dan Pengabaian Kerugian {#1-liability-caps-and-damages-waiver}

**Sejauh diizinkan oleh Hukum Perlindungan Data yang Berlaku, total kewajiban kumulatif masing-masing pihak terhadap pihak lain yang timbul dari atau terkait dengan DPA ini akan tunduk pada pengabaian, pengecualian, dan pembatasan kewajiban yang dinyatakan dalam <strong>Perjanjian</strong>.**

### 2. Klaim Pihak Terkait {#2-related-party-claims}

**Klaim apa pun yang diajukan terhadap <strong>Penyedia</strong> atau Afiliasinya yang timbul dari atau terkait dengan DPA ini hanya dapat diajukan oleh entitas <strong>Pelanggan</strong> yang merupakan pihak dalam <strong>Perjanjian</strong>.**

### 3. Pengecualian {#3-exceptions}

1. DPA ini tidak membatasi tanggung jawab apa pun kepada individu terkait hak perlindungan data individu tersebut berdasarkan Hukum Perlindungan Data yang Berlaku. Selain itu, DPA ini tidak membatasi tanggung jawab apa pun antara para pihak atas pelanggaran SCC EEA atau Adendum Inggris.

## 9. Konflik Antar Dokumen {#9-conflicts-between-documents}

1. DPA ini merupakan bagian dari dan melengkapi Perjanjian. Jika terdapat ketidaksesuaian antara DPA ini, <strong>Perjanjian</strong>, atau bagian-bagiannya, bagian yang tercantum sebelumnya akan mengendalikan bagian yang tercantum kemudian atas ketidaksesuaian tersebut: (1) SCC EEA atau Adendum Inggris, (2) DPA ini, dan kemudian (3) <strong>Perjanjian</strong>.

## 10. Ketentuan Perjanjian {#10-term-of-agreement}

DPA ini akan dimulai ketika <strong>Penyedia</strong> dan <strong>Pelanggan</strong> menyetujui Halaman Sampul untuk DPA dan menandatangani atau menerima <strong>Perjanjian</strong> secara elektronik, dan akan berlanjut hingga <strong>Perjanjian</strong> berakhir atau diakhiri. Namun, <strong>Penyedia</strong> dan <strong>Pelanggan</strong> masing-masing akan tetap tunduk pada kewajiban dalam DPA ini dan Hukum Perlindungan Data yang Berlaku hingga <strong>Pelanggan</strong> berhenti mentransfer Data Pribadi Pelanggan kepada <strong>Penyedia</strong> dan <strong>Penyedia</strong> berhenti Memproses Data Pribadi Pelanggan.

## 11. Hukum yang Mengatur dan Pengadilan yang Dipilih {#11-governing-law-and-chosen-courts}

Terlepas dari hukum yang mengatur atau klausul serupa dalam <strong>Perjanjian</strong>, semua interpretasi dan perselisihan mengenai DPA ini akan diatur oleh hukum <strong>Negara Pengatur</strong> tanpa memperhatikan ketentuan pertentangan hukumnya. Selain itu, terlepas dari pemilihan forum, yurisdiksi, atau klausul serupa dalam <strong>Perjanjian</strong>, para pihak sepakat untuk mengajukan gugatan hukum, tindakan, atau proses hukum apa pun terkait DPA ini, dan masing-masing pihak secara tidak dapat ditarik kembali tunduk pada yurisdiksi eksklusif pengadilan <strong>Negara Pengatur</strong>.

## 12. Hubungan Penyedia Layanan {#12-service-provider-relationship}

Sejauh Undang-Undang Privasi Konsumen California, Cal. Civ. Code § 1798.100 et seq ("CCPA") berlaku, para pihak mengakui dan menyetujui bahwa <strong>Penyedia</strong> adalah penyedia layanan dan menerima Data Pribadi dari <strong>Pelanggan</strong> untuk menyediakan Layanan sebagaimana disepakati dalam <strong>Perjanjian</strong>, yang merupakan tujuan bisnis. <strong>Penyedia</strong> tidak akan menjual Data Pribadi apa pun yang diberikan oleh <strong>Pelanggan</strong> berdasarkan <strong>Perjanjian</strong>. Selain itu, <strong>Penyedia</strong> tidak akan menyimpan, menggunakan, atau mengungkapkan Data Pribadi apa pun yang diberikan oleh <strong>Pelanggan</strong> berdasarkan <strong>Perjanjian</strong> kecuali sebagaimana diperlukan untuk menyediakan Layanan bagi <strong>Pelanggan</strong>, sebagaimana dinyatakan dalam <strong>Perjanjian</strong>, atau sebagaimana diizinkan oleh Undang-Undang Perlindungan Data yang Berlaku. <strong>Penyedia</strong> menyatakan bahwa pihaknya memahami batasan dalam paragraf ini.

## 13. Definisi {#13-definitions}

1. **"Hukum yang Berlaku"** berarti hukum, peraturan, regulasi, perintah pengadilan, dan persyaratan mengikat lainnya dari otoritas pemerintah terkait yang berlaku untuk atau mengatur suatu pihak.

2. **"Hukum Perlindungan Data yang Berlaku"** berarti Hukum yang Berlaku yang mengatur bagaimana Layanan dapat memproses atau menggunakan informasi pribadi, data pribadi, informasi identitas pribadi, atau istilah serupa lainnya milik seseorang.

3. **"Pengendali"** akan memiliki arti(s) yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk perusahaan yang menentukan tujuan dan tingkat Pemrosesan Data Pribadi.

4. **"Halaman Sampul"** berarti dokumen yang ditandatangani atau diterima secara elektronik oleh para pihak yang memuat Ketentuan Standar DPA ini dan mengidentifikasi <strong>Penyedia</strong>, <strong>Pelanggan</strong>, serta pokok bahasan dan detail pemrosesan data.

5. **"Data Pribadi Pelanggan"** berarti Data Pribadi yang diunggah atau diberikan oleh <strong>Pelanggan</strong> kepada <strong>Penyedia</strong> sebagai bagian dari Layanan dan yang diatur oleh DPA ini.

6. **"DPA"** berarti Ketentuan Standar DPA ini, Halaman Sampul antara <strong>Penyedia</strong> dan <strong>Pelanggan</strong>, serta kebijakan dan dokumen yang dirujuk dalam atau dilampirkan pada Halaman Sampul.

7. **"SCC EEA"** berarti klausul kontrak standar yang dilampirkan pada Keputusan Pelaksanaan Komisi Eropa 2021/914 tanggal 4 Juni 2021 tentang klausul kontrak standar untuk transfer data pribadi ke negara ketiga sesuai dengan Peraturan (UE) 2016/679 Parlemen Eropa dan Dewan Eropa.

8. **"Wilayah Ekonomi Eropa"** atau **"EEA"** berarti negara-negara anggota Uni Eropa, Norwegia, Islandia, dan Liechtenstein.

9. **"GDPR"** berarti Peraturan Uni Eropa 2016/679 sebagaimana diterapkan oleh hukum setempat di negara anggota EEA yang relevan.

10. **"Data Pribadi"** akan memiliki arti(s) yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk informasi pribadi, data pribadi, atau istilah serupa lainnya.

11. **"Pemrosesan"** atau **"Proses"** akan memiliki arti(arti) yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk setiap penggunaan, atau pelaksanaan operasi komputer pada, Data Pribadi, termasuk dengan metode otomatis.

12. **"Pemroses"** akan memiliki arti(s) yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk perusahaan yang Memproses Data Pribadi atas nama Pengendali.

13. **"Laporan"** berarti laporan audit yang disiapkan oleh perusahaan lain sesuai dengan standar yang ditetapkan dalam Kebijakan Keamanan atas nama Penyedia.

14. **"Transfer Terbatas"** berarti (a) jika GDPR berlaku, transfer data pribadi dari EEA ke negara di luar EEA yang tidak tunduk pada penentuan kecukupan oleh Komisi Eropa; dan (b) jika GDPR Inggris berlaku, transfer data pribadi dari Inggris Raya ke negara lain mana pun yang tidak tunduk pada peraturan kecukupan yang diadopsi berdasarkan Bagian 17A Undang-Undang Perlindungan Data Inggris Raya 2018.

15. **"Insiden Keamanan"** berarti Pelanggaran Data Pribadi sebagaimana didefinisikan dalam Pasal 4 GDPR.

16. **"Layanan"** berarti produk dan/atau layanan yang dijelaskan dalam <strong>Perjanjian</strong>.

17. **"Data Kategori Khusus"** akan memiliki arti yang diberikan dalam Pasal 9 GDPR.

18. **"Subprosesor"** akan memiliki arti(s) yang diberikan dalam Hukum Perlindungan Data yang Berlaku untuk perusahaan yang, dengan persetujuan dan penerimaan Pengendali, membantu Pemroses dalam Memproses Data Pribadi atas nama Pengendali.

19. **"GDPR Inggris"** berarti Peraturan Uni Eropa 2016/679 sebagaimana diterapkan oleh pasal 3 Undang-Undang Penarikan Diri Uni Eropa tahun 2018 di Inggris.

20. **"Addendum Inggris"** berarti addendum transfer data internasional untuk SCC EEA yang dikeluarkan oleh Komisioner Informasi untuk Pihak yang melakukan Transfer Terbatas berdasarkan S119A(1) Undang-Undang Perlindungan Data 2018.

## Kredit {#credits}

Dokumen ini merupakan turunan dari [Istilah Standar DPA Makalah Umum (Versi 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) dan dilisensikan di bawah [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).