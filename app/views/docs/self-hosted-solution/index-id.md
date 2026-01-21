# Email yang Dihosting Sendiri: Komitmen terhadap Sumber Terbuka {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Kata pengantar](#foreword)
* [Mengapa Email yang Dihosting Sendiri Itu Penting](#why-self-hosted-email-matters)
  * [Masalah dengan Layanan Email Tradisional](#the-problem-with-traditional-email-services)
  * [Alternatif Hosting Mandiri](#the-self-hosted-alternative)
* [Implementasi Self-Hosted Kami: Tinjauan Teknis](#our-self-hosted-implementation-technical-overview)
  * [Arsitektur Berbasis Docker untuk Kesederhanaan dan Portabilitas](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalasi Skrip Bash: Aksesibilitas Bertemu Keamanan](#bash-script-installation-accessibility-meets-security)
  * [Enkripsi Aman Kuantum untuk Privasi yang Tahan Masa Depan](#quantum-safe-encryption-for-future-proof-privacy)
  * [Pemeliharaan dan Pembaruan Otomatis](#automated-maintenance-and-updates)
* [Komitmen Sumber Terbuka](#the-open-source-commitment)
* [Self-Hosted vs. Managed: Membuat Pilihan yang Tepat](#self-hosted-vs-managed-making-the-right-choice)
  * [Realitas Email Self-Hosting](#the-reality-of-self-hosting-email)
  * [Kapan Memilih Layanan Terkelola Kami](#when-to-choose-our-managed-service)
* [Memulai dengan Email Terusan yang Dihosting Sendiri](#getting-started-with-self-hosted-forward-email)
  * [Persyaratan Sistem](#system-requirements)
  * [Langkah-langkah Instalasi](#installation-steps)
* [Masa Depan Email yang Dihosting Sendiri](#the-future-of-self-hosted-email)
* [Kesimpulan: Kebebasan Email untuk Semua Orang](#conclusion-email-freedom-for-everyone)
* [Referensi](#references)

## Kata Pengantar {#foreword}

Di lanskap digital saat ini, email tetap menjadi tulang punggung identitas dan komunikasi daring kita. Namun, seiring meningkatnya kekhawatiran tentang privasi, banyak pengguna menghadapi pilihan yang sulit: kenyamanan dengan mengorbankan privasi, atau privasi dengan mengorbankan kenyamanan. Di Forward Email, kami selalu percaya bahwa Anda tidak perlu memilih di antara keduanya.

Hari ini, kami dengan bangga mengumumkan tonggak penting dalam perjalanan kami: peluncuran solusi email self-hosted kami. Fitur ini mencerminkan komitmen terdalam kami terhadap prinsip-prinsip sumber terbuka, desain yang berfokus pada privasi, dan pemberdayaan pengguna. Dengan opsi self-hosted kami, kami menyerahkan kendali penuh atas komunikasi email Anda langsung ke tangan Anda.

Tulisan blog ini mengupas filosofi di balik solusi hosting mandiri kami, implementasi teknisnya, dan mengapa hal itu penting bagi pengguna yang mengutamakan privasi dan kepemilikan dalam komunikasi digital mereka.

## Mengapa Email yang Dihosting Sendiri Penting {#why-self-hosted-email-matters}

Solusi email self-hosted kami adalah perwujudan paling jelas dari keyakinan kami bahwa privasi sejati berarti kendali, dan kendali dimulai dengan sumber terbuka. Bagi pengguna yang menuntut kepemilikan penuh atas komunikasi digital mereka, self-hosting bukan lagi ide yang aneh — melainkan hak yang esensial. Kami bangga mendukung keyakinan tersebut dengan platform yang sepenuhnya terbuka dan terverifikasi yang dapat Anda jalankan sesuai keinginan Anda.

### Masalah dengan Layanan Email Tradisional {#the-problem-with-traditional-email-services}

Layanan email tradisional menghadirkan beberapa tantangan mendasar bagi pengguna yang peduli terhadap privasi:

1. **Persyaratan Kepercayaan**: Anda harus memercayai penyedia layanan untuk tidak mengakses, menganalisis, atau membagikan data Anda.
2. **Kontrol Terpusat**: Akses Anda dapat dicabut kapan saja dengan alasan apa pun.
3. **Kerentanan Pengawasan**: Layanan terpusat merupakan target utama pengawasan.
4. **Transparansi Terbatas**: Sebagian besar layanan menggunakan perangkat lunak berpemilik dan sumber tertutup.
5. **Penguncian Vendor**: Migrasi dari layanan ini bisa jadi sulit atau bahkan mustahil.

Bahkan penyedia email yang "berfokus pada privasi" pun seringkali gagal karena hanya membuka sumber aplikasi frontend mereka, sementara sistem backend mereka tetap tertutup dan bersifat privat. Hal ini menciptakan kesenjangan kepercayaan yang signifikan—Anda diminta untuk memercayai janji privasi mereka tanpa kemampuan untuk memverifikasinya.

### Alternatif Hosting Mandiri {#the-self-hosted-alternative}

Hosting email Anda sendiri menyediakan pendekatan yang berbeda secara mendasar:

1. **Kontrol Penuh**: Anda memiliki dan mengendalikan seluruh infrastruktur email
2. **Privasi yang Dapat Diverifikasi**: Seluruh sistem transparan dan dapat diaudit
3. **Tidak Perlu Kepercayaan**: Anda tidak perlu mempercayakan komunikasi Anda kepada pihak ketiga
4. **Kebebasan Kustomisasi**: Sesuaikan sistem dengan kebutuhan spesifik Anda
5. **Ketahanan**: Layanan Anda tetap berjalan apa pun keputusan perusahaan mana pun

Seperti yang dikatakan salah satu pengguna: "Menyimpan email saya sendiri itu ibarat menanam makanan sendiri di dunia digital—memang butuh lebih banyak usaha, tapi saya tahu persis isinya."

## Implementasi Self-Hosted Kami: Tinjauan Teknis {#our-self-hosted-implementation-technical-overview}

Solusi email self-hosted kami dibangun berdasarkan prinsip privasi yang sama dengan yang diterapkan pada semua produk kami. Mari kita telusuri implementasi teknis yang memungkinkan hal ini.

### Arsitektur Berbasis Docker untuk Kesederhanaan dan Portabilitas {#docker-based-architecture-for-simplicity-and-portability}

Kami telah mengemas seluruh infrastruktur email kami menggunakan Docker, sehingga mudah diterapkan di hampir semua sistem berbasis Linux. Pendekatan berbasis kontainer ini memberikan beberapa manfaat utama:

1. **Penerapan yang Disederhanakan**: Satu perintah saja sudah cukup untuk menyiapkan seluruh infrastruktur.
2. **Lingkungan yang Konsisten**: Menghilangkan masalah "berfungsi di mesin saya".
3. **Komponen Terisolasi**: Setiap layanan berjalan dalam kontainernya sendiri demi keamanan.
4. **Pembaruan Mudah**: Perintah sederhana untuk memperbarui seluruh tumpukan.
5. **Ketergantungan Minimal**: Hanya memerlukan Docker dan Docker Compose.

Arsitekturnya mencakup kontainer untuk:

* Antarmuka web untuk administrasi
* Server SMTP untuk email keluar
* Server IMAP/POP3 untuk pengambilan email
* Server CalDAV untuk kalender
* Server CardDAV untuk kontak
* Database untuk penyimpanan konfigurasi
* Redis untuk caching dan kinerja
* SQLite untuk penyimpanan kotak surat yang aman dan terenkripsi

> \[!NOTE]
> Pastikan untuk memeriksa [panduan pengembang yang dihosting sendiri](https://forwardemail.net/self-hosted) kami

Instalasi Skrip Bash ###: Aksesibilitas Bertemu Keamanan {#bash-script-installation-accessibility-meets-security}

Kami telah merancang proses instalasi sesederhana mungkin dengan tetap menjaga praktik keamanan terbaik:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Perintah tunggal ini:

1. Memverifikasi persyaratan sistem
2. Memandu Anda melalui konfigurasi
3. Menyiapkan rekaman DNS
4. Mengonfigurasi sertifikat TLS
5. Menyebarkan kontainer Docker
6. Melakukan penguatan keamanan awal

Bagi Anda yang khawatir tentang penyaluran skrip ke bash (seperti yang seharusnya Anda khawatirkan!), kami menyarankan untuk meninjau skrip tersebut sebelum dieksekusi. Skrip ini sepenuhnya sumber terbuka dan tersedia untuk diperiksa.

### Enkripsi Aman Kuantum untuk Privasi yang Siap Menghadapi Masa Depan {#quantum-safe-encryption-for-future-proof-privacy}

Layaknya layanan hosting kami, solusi hosting mandiri kami menerapkan enkripsi tahan kuantum menggunakan ChaCha20-Poly1305 sebagai cipher untuk basis data SQLite. Pendekatan ini melindungi data email Anda tidak hanya dari ancaman saat ini, tetapi juga dari serangan komputasi kuantum di masa mendatang.

Setiap kotak surat disimpan dalam berkas basis data SQLite terenkripsi miliknya sendiri, menyediakan isolasi lengkap antara pengguna—keuntungan keamanan yang signifikan dibandingkan pendekatan basis data bersama tradisional.

### Pemeliharaan dan Pembaruan Otomatis {#automated-maintenance-and-updates}

Kami telah membangun utilitas pemeliharaan komprehensif langsung ke dalam solusi yang dihosting sendiri:

1. **Pencadangan Otomatis**: Pencadangan terjadwal untuk semua data penting
2. **Perpanjangan Sertifikat**: Manajemen sertifikat Let's Encrypt otomatis
3. **Pembaruan Sistem**: Perintah sederhana untuk memperbarui ke versi terbaru
4. **Pemantauan Kesehatan**: Pemeriksaan bawaan untuk memastikan integritas sistem

Utilitas ini dapat diakses melalui menu interaktif sederhana:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Komitmen Sumber Terbuka {#the-open-source-commitment}

Solusi email self-hosted kami, seperti semua produk kami, 100% open-source—baik front-end maupun back-end. Artinya:

1. **Transparansi Penuh**: Setiap baris kode yang memproses email Anda tersedia untuk pengawasan publik
2. **Kontribusi Komunitas**: Siapa pun dapat berkontribusi untuk perbaikan atau memperbaiki masalah
3. **Keamanan Melalui Keterbukaan**: Kerentanan dapat diidentifikasi dan diperbaiki oleh komunitas global
4. **Tanpa Vendor Lock-in**: Anda tidak pernah bergantung pada keberadaan perusahaan kami

Seluruh basis kode tersedia di GitHub di <https://github.com/forwardemail/forwardemail.net>.

## Hosting Mandiri vs. Hosting Terkelola: Membuat Pilihan yang Tepat {#self-hosted-vs-managed-making-the-right-choice}

Meskipun kami bangga menawarkan opsi hosting mandiri, kami menyadari bahwa ini bukan pilihan yang tepat untuk semua orang. Email yang dihosting mandiri memiliki tanggung jawab dan tantangan nyata:

### Realitas Email Hosting Mandiri {#the-reality-of-self-hosting-email}

#### Pertimbangan Teknis {#technical-considerations}

* **Manajemen Server**: Anda perlu mengelola VPS atau server khusus
* **Konfigurasi DNS**: Pengaturan DNS yang tepat sangat penting untuk pengiriman data
* **Pembaruan Keamanan**: Memperbarui patch keamanan sangatlah penting
* **Manajemen Spam**: Anda perlu menangani penyaringan spam
* **Strategi Pencadangan**: Menerapkan pencadangan yang andal adalah tanggung jawab Anda

#### Investasi Waktu {#time-investment}

**Pengaturan Awal**: Waktu untuk pengaturan, verifikasi, dan membaca dokumentasi
* **Pemeliharaan Berkelanjutan**: Pembaruan dan pemantauan berkala
* **Pemecahan Masalah**: Waktu berkala untuk menyelesaikan masalah

#### Pertimbangan Keuangan {#financial-considerations}

* **Biaya Server**: $5-$20/bulan untuk VPS dasar
* **Pendaftaran Domain**: $10-$20/tahun
* **Nilai Waktu**: Investasi waktu Anda memiliki nilai yang nyata

### Kapan Memilih Layanan Terkelola Kami {#when-to-choose-our-managed-service}

Bagi banyak pengguna, layanan terkelola kami tetap menjadi pilihan terbaik:

1. **Kemudahan**: Kami menangani semua pemeliharaan, pembaruan, dan pemantauan
2. **Keandalan**: Manfaatkan infrastruktur dan keahlian kami yang telah mapan
3. **Dukungan**: Dapatkan bantuan saat terjadi masalah
4. **Kemudahan Pengiriman**: Manfaatkan reputasi IP kami yang telah mapan
5. **Efektivitas Biaya**: Jika Anda memperhitungkan biaya waktu, layanan kami seringkali lebih ekonomis

Kedua opsi memberikan manfaat privasi dan transparansi sumber terbuka yang sama—perbedaannya hanyalah siapa yang mengelola infrastrukturnya.

## Memulai dengan Email Terusan yang Dihosting Sendiri {#getting-started-with-self-hosted-forward-email}

Siap mengendalikan infrastruktur email Anda? Berikut cara memulainya:

### Persyaratan Sistem {#system-requirements}

* Ubuntu 20.04 LTS atau yang lebih baru (disarankan)
* RAM minimal 1 GB (disarankan 2 GB+)
* Penyimpanan 20 GB direkomendasikan
* Nama domain yang Anda kendalikan
* Alamat IP publik dengan dukungan port 25
* Kemampuan untuk mengatur [PTR terbalik](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Dukungan IPv4 dan IPv6

> \[!TIP]
> Kami merekomendasikan beberapa penyedia server email di <https://forwardemail.net/blog/docs/best-mail-server-providers> (sumber di <https://github.com/forwardemail/awesome-mail-server-providers>)

### Langkah Instalasi {#installation-steps}

1. **Jalankan Skrip Instalasi**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Ikuti Petunjuk Interaktif**:
* Masukkan nama domain Anda
* Konfigurasikan kredensial administrator
* Atur rekaman DNS sesuai petunjuk
* Pilih opsi konfigurasi yang Anda inginkan

3. **Verifikasi Instalasi**:
Setelah instalasi selesai, Anda dapat memverifikasi semuanya berfungsi dengan:
* Memeriksa status kontainer: `docker ps`
* Mengirim email uji
* Masuk ke antarmuka web

## Masa Depan Email yang Dihosting Sendiri {#the-future-of-self-hosted-email}

Solusi self-hosted kami hanyalah permulaan. Kami berkomitmen untuk terus meningkatkan penawaran ini dengan:

1. **Alat Administrasi yang Disempurnakan**: Manajemen berbasis web yang lebih canggih
2. **Opsi Autentikasi Tambahan**: Termasuk dukungan kunci keamanan perangkat keras
3. **Pemantauan Lanjutan**: Wawasan yang lebih baik tentang kesehatan dan kinerja sistem
4. **Penerapan Multi-Server**: Opsi untuk konfigurasi ketersediaan tinggi
5. **Peningkatan Berbasis Komunitas**: Mengintegrasikan kontribusi dari pengguna

Kesimpulan ##: Kebebasan Email untuk Semua Orang {#conclusion-email-freedom-for-everyone}

Peluncuran solusi email self-hosted kami merupakan tonggak penting dalam misi kami untuk menyediakan layanan email yang transparan dan berfokus pada privasi. Baik Anda memilih layanan terkelola kami maupun opsi self-hosted, Anda akan mendapatkan manfaat dari komitmen teguh kami terhadap prinsip-prinsip sumber terbuka dan desain yang mengutamakan privasi.

Email terlalu penting untuk dikendalikan oleh sistem tertutup dan berpemilik yang memprioritaskan pengumpulan data daripada privasi pengguna. Dengan solusi hosting mandiri Forward Email, kami bangga menawarkan alternatif yang sesungguhnya—yang memberi Anda kendali penuh atas komunikasi digital Anda.

Kami percaya bahwa privasi bukan sekadar fitur; melainkan hak asasi. Dan dengan opsi email yang dihosting sendiri, kami menjadikan hak tersebut lebih mudah diakses daripada sebelumnya.

Siap mengelola email Anda? [Mulailah hari ini](https://forwardemail.net/self-hosted) atau jelajahi [Repositori GitHub](https://github.com/forwardemail/forwardemail.net) untuk mempelajari lebih lanjut.

## Referensi {#references}

\[1] Teruskan Email Repositori GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Dokumentasi yang Dihosting Sendiri: <https://forwardemail.net/en/self-hosted>

\[3] Implementasi Teknis Privasi Email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Mengapa Email Open-Source Penting: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>