# Email Self-Hosted: Komitmen terhadap Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Ilustrasi solusi email self-hosted" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Kata Pengantar](#foreword)
* [Mengapa Email Self-Hosted Penting](#why-self-hosted-email-matters)
  * [Masalah dengan Layanan Email Tradisional](#the-problem-with-traditional-email-services)
  * [Alternatif Self-Hosted](#the-self-hosted-alternative)
* [Implementasi Self-Hosted Kami: Tinjauan Teknis](#our-self-hosted-implementation-technical-overview)
  * [Arsitektur Berbasis Docker untuk Kesederhanaan dan Portabilitas](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalasi Skrip Bash: Aksesibilitas Bertemu Keamanan](#bash-script-installation-accessibility-meets-security)
  * [Enkripsi Quantum-Safe untuk Privasi Masa Depan](#quantum-safe-encryption-for-future-proof-privacy)
  * [Pemeliharaan dan Pembaruan Otomatis](#automated-maintenance-and-updates)
* [Komitmen Open-Source](#the-open-source-commitment)
* [Self-Hosted vs. Managed: Membuat Pilihan yang Tepat](#self-hosted-vs-managed-making-the-right-choice)
  * [Realita Self-Hosting Email](#the-reality-of-self-hosting-email)
  * [Kapan Memilih Layanan Managed Kami](#when-to-choose-our-managed-service)
* [Memulai dengan Self-Hosted Forward Email](#getting-started-with-self-hosted-forward-email)
  * [Persyaratan Sistem](#system-requirements)
  * [Langkah Instalasi](#installation-steps)
* [Masa Depan Email Self-Hosted](#the-future-of-self-hosted-email)
* [Kesimpulan: Kebebasan Email untuk Semua](#conclusion-email-freedom-for-everyone)
* [Referensi](#references)


## Kata Pengantar {#foreword}

Dalam lanskap digital saat ini, email tetap menjadi tulang punggung identitas dan komunikasi online kita. Namun, seiring meningkatnya kekhawatiran privasi, banyak pengguna menghadapi pilihan sulit: kenyamanan dengan mengorbankan privasi, atau privasi dengan mengorbankan kenyamanan. Di Forward Email, kami selalu percaya bahwa Anda tidak perlu memilih salah satu dari keduanya.

Hari ini, kami dengan bangga mengumumkan tonggak penting dalam perjalanan kami: peluncuran solusi email self-hosted kami. Fitur ini mewakili komitmen terdalam kami terhadap prinsip open-source, desain yang berfokus pada privasi, dan pemberdayaan pengguna. Dengan opsi self-hosted kami, kami menempatkan kekuatan dan kendali penuh atas komunikasi email Anda langsung di tangan Anda.

Posting blog ini mengeksplorasi filosofi di balik solusi self-hosted kami, implementasi teknisnya, dan mengapa hal ini penting bagi pengguna yang mengutamakan privasi dan kepemilikan dalam komunikasi digital mereka.


## Mengapa Email Self-Hosted Penting {#why-self-hosted-email-matters}

Solusi email self-hosted kami adalah ekspresi paling jelas dari keyakinan kami bahwa privasi sejati berarti kendali, dan kendali dimulai dengan open source. Bagi pengguna yang menuntut kepemilikan penuh atas komunikasi digital mereka, self-hosting bukan lagi ide pinggiran — ini adalah hak yang esensial. Kami bangga mendukung keyakinan itu dengan platform yang sepenuhnya terbuka dan dapat diverifikasi yang dapat Anda jalankan dengan ketentuan Anda sendiri.

### Masalah dengan Layanan Email Tradisional {#the-problem-with-traditional-email-services}

Layanan email tradisional menghadirkan beberapa tantangan mendasar bagi pengguna yang peduli privasi:

1. **Persyaratan Kepercayaan**: Anda harus mempercayai penyedia untuk tidak mengakses, menganalisis, atau membagikan data Anda
2. **Kontrol Terpusat**: Akses Anda dapat dicabut kapan saja dengan alasan apa pun
3. **Kerentanan terhadap Pengawasan**: Layanan terpusat adalah target utama pengawasan
4. **Transparansi Terbatas**: Sebagian besar layanan menggunakan perangkat lunak proprietary dan tertutup
5. **Keterikatan Vendor**: Migrasi dari layanan ini bisa sulit atau bahkan tidak mungkin

Bahkan penyedia email yang "berfokus pada privasi" sering kali kurang dengan hanya membuka kode aplikasi frontend mereka sementara sistem backend tetap proprietary dan tertutup. Ini menciptakan kesenjangan kepercayaan yang signifikan—Anda diminta untuk mempercayai janji privasi mereka tanpa kemampuan untuk memverifikasinya.

### Alternatif Self-Hosted {#the-self-hosted-alternative}
Self-hosting email Anda memberikan pendekatan yang secara fundamental berbeda:

1. **Kontrol Lengkap**: Anda memiliki dan mengendalikan seluruh infrastruktur email
2. **Privasi yang Dapat Diverifikasi**: Seluruh sistem transparan dan dapat diaudit
3. **Tidak Perlu Kepercayaan**: Anda tidak perlu mempercayai pihak ketiga dengan komunikasi Anda
4. **Kebebasan Kustomisasi**: Sesuaikan sistem dengan kebutuhan spesifik Anda
5. **Ketahanan**: Layanan Anda terus berjalan terlepas dari keputusan perusahaan manapun

Seperti yang dikatakan salah satu pengguna: "Self-hosting email saya adalah setara digital dengan menanam makanan sendiri—memerlukan lebih banyak kerja, tapi saya tahu persis apa isinya."


## Implementasi Self-Hosted Kami: Tinjauan Teknis {#our-self-hosted-implementation-technical-overview}

Solusi email self-hosted kami dibangun berdasarkan prinsip privasi terlebih dahulu yang menjadi panduan semua produk kami. Mari kita jelajahi implementasi teknis yang membuat ini mungkin.

### Arsitektur Berbasis Docker untuk Kesederhanaan dan Portabilitas {#docker-based-architecture-for-simplicity-and-portability}

Kami telah mengemas seluruh infrastruktur email kami menggunakan Docker, sehingga mudah untuk diterapkan di hampir semua sistem berbasis Linux. Pendekatan containerized ini memberikan beberapa manfaat utama:

1. **Penerapan yang Disederhanakan**: Satu perintah mengatur seluruh infrastruktur
2. **Lingkungan Konsisten**: Menghilangkan masalah "berfungsi di mesin saya"
3. **Komponen Terisolasi**: Setiap layanan berjalan di container sendiri demi keamanan
4. **Pembaruan Mudah**: Perintah sederhana untuk memperbarui seluruh stack
5. **Ketergantungan Minimal**: Hanya membutuhkan Docker dan Docker Compose

Arsitektur ini mencakup container untuk:

* Antarmuka web untuk administrasi
* Server SMTP untuk email keluar
* Server IMAP/POP3 untuk pengambilan email
* Server CalDAV untuk kalender
* Server CardDAV untuk kontak
* Database untuk penyimpanan konfigurasi
* Redis untuk caching dan performa
* SQLite untuk penyimpanan mailbox yang aman dan terenkripsi

> \[!NOTE]
> Pastikan untuk melihat [panduan pengembang self-hosted kami](https://forwardemail.net/self-hosted)

### Instalasi Skrip Bash: Aksesibilitas Bertemu Keamanan {#bash-script-installation-accessibility-meets-security}

Kami merancang proses instalasi agar sesederhana mungkin sambil mempertahankan praktik keamanan terbaik:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Perintah tunggal ini:

1. Memverifikasi persyaratan sistem
2. Membimbing Anda melalui konfigurasi
3. Mengatur catatan DNS
4. Mengonfigurasi sertifikat TLS
5. Mendeploy container Docker
6. Melakukan penguatan keamanan awal

Bagi yang khawatir tentang piping skrip ke bash (sebagaimana seharusnya!), kami menganjurkan untuk meninjau skrip sebelum eksekusi. Skrip ini sepenuhnya open-source dan tersedia untuk inspeksi.

### Enkripsi Quantum-Safe untuk Privasi yang Tahan Masa Depan {#quantum-safe-encryption-for-future-proof-privacy}

Seperti layanan hosted kami, solusi self-hosted kami menerapkan enkripsi tahan kuantum menggunakan ChaCha20-Poly1305 sebagai cipher untuk database SQLite. Pendekatan ini melindungi data email Anda tidak hanya dari ancaman saat ini, tetapi juga dari serangan komputasi kuantum di masa depan.

Setiap mailbox disimpan dalam file database SQLite terenkripsi sendiri, memberikan isolasi lengkap antar pengguna—keunggulan keamanan signifikan dibandingkan pendekatan database bersama tradisional.

### Pemeliharaan dan Pembaruan Otomatis {#automated-maintenance-and-updates}

Kami membangun utilitas pemeliharaan komprehensif langsung ke dalam solusi self-hosted:

1. **Backup Otomatis**: Backup terjadwal untuk semua data penting
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


## Komitmen Open-Source {#the-open-source-commitment}

Solusi email self-hosted kami, seperti semua produk kami, 100% open-source—baik frontend maupun backend. Ini berarti:
1. **Transparansi Lengkap**: Setiap baris kode yang memproses email Anda tersedia untuk pemeriksaan publik  
2. **Kontribusi Komunitas**: Siapa saja dapat memberikan perbaikan atau memperbaiki masalah  
3. **Keamanan Melalui Keterbukaan**: Kerentanan dapat diidentifikasi dan diperbaiki oleh komunitas global  
4. **Tanpa Ketergantungan Vendor**: Anda tidak pernah bergantung pada keberadaan perusahaan kami  

Seluruh basis kode tersedia di GitHub di <https://github.com/forwardemail/forwardemail.net>.


## Self-Hosted vs. Managed: Membuat Pilihan yang Tepat {#self-hosted-vs-managed-making-the-right-choice}

Meskipun kami bangga menawarkan opsi self-hosted, kami menyadari bahwa ini bukan pilihan yang tepat untuk semua orang. Self-hosting email datang dengan tanggung jawab dan tantangan nyata:

### Realitas Self-Hosting Email {#the-reality-of-self-hosting-email}

#### Pertimbangan Teknis {#technical-considerations}

* **Manajemen Server**: Anda perlu memelihara VPS atau server khusus  
* **Konfigurasi DNS**: Pengaturan DNS yang tepat sangat penting untuk deliverability  
* **Pembaruan Keamanan**: Tetap mengikuti patch keamanan sangat penting  
* **Manajemen Spam**: Anda harus menangani penyaringan spam  
* **Strategi Cadangan**: Menerapkan backup yang andal adalah tanggung jawab Anda  

#### Investasi Waktu {#time-investment}

* **Pengaturan Awal**: Waktu untuk mengatur, memverifikasi, dan membaca dokumentasi  
* **Pemeliharaan Berkelanjutan**: Pembaruan dan pemantauan sesekali  
* **Pemecahan Masalah**: Waktu sesekali untuk menyelesaikan masalah  

#### Pertimbangan Finansial {#financial-considerations}

* **Biaya Server**: $5-$20/bulan untuk VPS dasar  
* **Pendaftaran Domain**: $10-$20/tahun  
* **Nilai Waktu**: Investasi waktu Anda memiliki nilai nyata  

### Kapan Memilih Layanan Managed Kami {#when-to-choose-our-managed-service}

Bagi banyak pengguna, layanan managed kami tetap menjadi pilihan terbaik:

1. **Kemudahan**: Kami menangani semua pemeliharaan, pembaruan, dan pemantauan  
2. **Keandalan**: Manfaatkan infrastruktur dan keahlian kami yang sudah mapan  
3. **Dukungan**: Dapatkan bantuan saat masalah muncul  
4. **Deliverability**: Manfaatkan reputasi IP kami yang sudah terbangun  
5. **Efisiensi Biaya**: Jika memperhitungkan biaya waktu, layanan kami seringkali lebih ekonomis  

Kedua opsi memberikan manfaat privasi yang sama dan transparansi open-source—perbedaannya hanya pada siapa yang mengelola infrastrukturnya.


## Memulai dengan Self-Hosted Forward Email {#getting-started-with-self-hosted-forward-email}

Siap mengendalikan infrastruktur email Anda? Berikut cara memulai:

### Persyaratan Sistem {#system-requirements}

* Ubuntu 20.04 LTS atau lebih baru (direkomendasikan)  
* RAM minimal 1GB (2GB+ direkomendasikan)  
* Penyimpanan 20GB direkomendasikan  
* Nama domain yang Anda kendalikan  
* Alamat IP publik dengan dukungan port 25  
* Kemampuan untuk mengatur [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* Dukungan IPv4 dan IPv6  

> \[!TIP]  
> Kami merekomendasikan beberapa penyedia server mail di <https://forwardemail.net/blog/docs/best-mail-server-providers> (sumber di <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Langkah Instalasi {#installation-steps}

1. **Jalankan Skrip Instalasi**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Ikuti Petunjuk Interaktif**:  
   * Masukkan nama domain Anda  
   * Konfigurasikan kredensial administrator  
   * Atur catatan DNS sesuai instruksi  
   * Pilih opsi konfigurasi yang Anda inginkan  

3. **Verifikasi Instalasi**:  
   Setelah instalasi selesai, Anda dapat memverifikasi semuanya berjalan dengan:  
   * Memeriksa status container: `docker ps`  
   * Mengirim email uji coba  
   * Masuk ke antarmuka web  


## Masa Depan Email Self-Hosted {#the-future-of-self-hosted-email}

Solusi self-hosted kami hanyalah permulaan. Kami berkomitmen untuk terus meningkatkan penawaran ini dengan:

1. **Alat Administrasi yang Ditingkatkan**: Manajemen berbasis web yang lebih kuat  
2. **Opsi Otentikasi Tambahan**: Termasuk dukungan kunci keamanan perangkat keras  
3. **Pemantauan Lanjutan**: Wawasan lebih baik tentang kesehatan dan performa sistem  
4. **Deploy Multi-Server**: Opsi untuk konfigurasi ketersediaan tinggi  
5. **Perbaikan Berbasis Komunitas**: Menggabungkan kontribusi dari pengguna
## Kesimpulan: Kebebasan Email untuk Semua Orang {#conclusion-email-freedom-for-everyone}

Peluncuran solusi email self-hosted kami merupakan tonggak penting dalam misi kami untuk menyediakan layanan email yang berfokus pada privasi dan transparan. Baik Anda memilih layanan terkelola kami atau opsi self-hosted, Anda mendapatkan manfaat dari komitmen kami yang tak tergoyahkan terhadap prinsip open-source dan desain yang mengutamakan privasi.

Email terlalu penting untuk dikendalikan oleh sistem tertutup dan proprietary yang mengutamakan pengumpulan data daripada privasi pengguna. Dengan solusi self-hosted Forward Email, kami bangga menawarkan alternatif sejati—yang menempatkan Anda dalam kendali penuh atas komunikasi digital Anda.

Kami percaya bahwa privasi bukan hanya sebuah fitur; itu adalah hak fundamental. Dan dengan opsi email self-hosted kami, kami membuat hak tersebut lebih mudah diakses daripada sebelumnya.

Siap untuk mengendalikan email Anda? [Mulai hari ini](https://forwardemail.net/self-hosted) atau jelajahi [repositori GitHub kami](https://github.com/forwardemail/forwardemail.net) untuk mempelajari lebih lanjut.


## Referensi {#references}

\[1] Repositori GitHub Forward Email: <https://github.com/forwardemail/forwardemail.net>

\[2] Dokumentasi Self-Hosted: <https://forwardemail.net/en/self-hosted>

\[3] Implementasi Teknis Perlindungan Privasi Email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Mengapa Email Open-Source Penting: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
