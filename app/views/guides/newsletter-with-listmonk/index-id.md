# Listmonk dengan Forward Email untuk Pengiriman Newsletter yang Aman {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Daftar Isi {#table-of-contents}

* [Ringkasan](#overview)
* [Mengapa Listmonk dan Forward Email](#why-listmonk-and-forward-email)
* [Prasyarat](#prerequisites)
* [Instalasi](#installation)
  * [1. Perbarui Server Anda](#1-update-your-server)
  * [2. Instal Ketergantungan](#2-install-dependencies)
  * [3. Unduh Konfigurasi Listmonk](#3-download-listmonk-configuration)
  * [4. Konfigurasi Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurasi Akses HTTPS](#5-configure-https-access)
  * [6. Jalankan Listmonk](#6-start-listmonk)
  * [7. Konfigurasikan Forward Email SMTP di Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurasikan Pemrosesan Pantulan](#8-configure-bounce-processing)
* [Pengujian](#testing)
  * [Buat Milis](#create-a-mailing-list)
  * [Tambahkan Pelanggan](#add-subscribers)
  * [Buat dan Kirim Kampanye](#create-and-send-a-campaign)
* [Verifikasi](#verification)
* [Catatan Pengembang](#developer-notes)
* [Kesimpulan](#conclusion)

## Ikhtisar {#overview}

Panduan ini memberikan petunjuk langkah demi langkah kepada pengembang untuk menyiapkan [Listmonk](https://listmonk.app/), pengelola buletin dan milis sumber terbuka yang andal, untuk menggunakan [Teruskan Email](https://forwardemail.net/) sebagai penyedia SMTP-nya. Kombinasi ini memungkinkan Anda mengelola kampanye secara efektif sekaligus memastikan pengiriman email yang aman, privat, dan andal.

* **Listmonk**: Menangani manajemen pelanggan, pengaturan daftar, pembuatan kampanye, dan pelacakan kinerja.
* **Forward Email**: Berfungsi sebagai server SMTP yang aman, menangani pengiriman email dengan fitur keamanan bawaan seperti enkripsi SPF, DKIM, DMARC, dan TLS.

Dengan mengintegrasikan keduanya, Anda mempertahankan kontrol penuh atas data dan infrastruktur Anda sambil memanfaatkan sistem pengiriman Forward Email yang tangguh.

## Mengapa Listmonk dan Meneruskan Email {#why-listmonk-and-forward-email}

* **Sumber Terbuka**: Baik Listmonk maupun prinsip-prinsip di balik Forward Email menekankan transparansi dan kontrol. Anda sendiri yang mengelola Listmonk, dan data Anda sendiri yang menjadi milik Anda.
* **Berfokus pada Privasi**: Forward Email dibangun dengan mengutamakan privasi, meminimalkan retensi data, dan berfokus pada transmisi yang aman.
* **Hemat Biaya**: Listmonk gratis, dan Forward Email menawarkan paket gratis yang berlimpah dan paket berbayar yang terjangkau, menjadikannya solusi yang ramah anggaran.
* **Skalabilitas**: Listmonk berkinerja tinggi, dan infrastruktur Forward Email dirancang untuk pengiriman yang andal dan berskala besar.
* **Ramah Pengembang**: Listmonk menawarkan API yang tangguh, dan Forward Email menyediakan integrasi SMTP dan webhook yang mudah.

## Prasyarat {#prerequisites}

Sebelum memulai, pastikan Anda memiliki hal berikut:

* Server Pribadi Virtual (VPS) yang menjalankan distribusi Linux terbaru (disarankan Ubuntu 20.04+) dengan minimal 1 CPU dan 1GB RAM (disarankan 2GB).
* Butuh penyedia? Lihat [daftar VPS yang direkomendasikan](https://github.com/forwardemail/awesome-mail-server-providers).
* Nama domain yang Anda kendalikan (diperlukan akses DNS).
* Akun aktif dengan [Teruskan Email](https://forwardemail.net/).
* Akses root atau `sudo` ke VPS Anda.
* Pemahaman dasar tentang operasi baris perintah Linux.

## Instalasi {#installation}

Langkah-langkah ini memandu Anda menginstal Listmonk menggunakan Docker dan Docker Compose di VPS Anda.

### 1. Perbarui Server Anda {#1-update-your-server}

Pastikan daftar paket sistem dan paket yang terinstal sudah yang terbaru.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instal Ketergantungan {#2-install-dependencies}

Instal Docker, Docker Compose, dan UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Unduh Konfigurasi Listmonk {#3-download-listmonk-configuration}

Buat direktori untuk Listmonk dan unduh file resmi `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Berkas ini mendefinisikan wadah aplikasi Listmonk dan wadah basis data PostgreSQL yang diperlukan.

### 4. Konfigurasikan Firewall (UFW) {#4-configure-firewall-ufw}

Izinkan lalu lintas penting (SSH, HTTP, HTTPS) melewati firewall. Jika SSH Anda berjalan pada port non-standar, sesuaikan.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Konfirmasikan pengaktifan firewall saat diminta.

### 5. Konfigurasikan Akses HTTPS {#5-configure-https-access}

Menjalankan Listmonk melalui HTTPS sangat penting untuk keamanan. Ada dua pilihan utama:

#### Opsi A: Menggunakan Proxy Cloudflare (Disarankan untuk Kesederhanaan) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Jika DNS domain Anda dikelola oleh Cloudflare, Anda dapat memanfaatkan fitur proksi mereka untuk HTTPS yang mudah.

1. **Point DNS**: Buat rekaman `A` di Cloudflare untuk subdomain Listmonk Anda (misalnya, `listmonk.yourdomain.com`) yang mengarah ke alamat IP VPS Anda. Pastikan **Status Proksi** diatur ke **Diproksi** (awan oranye).
2. **Ubah Docker Compose**: Edit berkas `docker-compose.yml` yang Anda unduh:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Ini membuat Listmonk dapat diakses secara internal pada port 80, yang kemudian dapat diproksi dan diamankan oleh Cloudflare dengan HTTPS.

#### Opsi B: Menggunakan Proksi Terbalik (Nginx, Caddy, dll.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternatifnya, Anda dapat menyiapkan proxy terbalik seperti Nginx atau Caddy pada VPS Anda untuk menangani penghentian HTTPS dan permintaan proxy ke Listmonk (berjalan pada port 9000 secara default).

* Pertahankan `ports: - "127.0.0.1:9000:9000"` default di `docker-compose.yml` untuk memastikan Listmonk hanya dapat diakses secara lokal.
* Konfigurasikan proxy terbalik pilihan Anda untuk mendengarkan port 80 dan 443, menangani akuisisi sertifikat SSL (misalnya, melalui Let's Encrypt), dan meneruskan lalu lintas ke `http://127.0.0.1:9000`.
* Pengaturan proxy terbalik yang terperinci berada di luar cakupan panduan ini, tetapi banyak tutorial tersedia daring.

### 6. Mulai Listmonk {#6-start-listmonk}

Navigasi kembali ke direktori `listmonk` Anda (jika Anda belum berada di sana) dan mulai kontainer dalam mode terpisah.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker akan mengunduh citra yang diperlukan dan memulai aplikasi Listmonk serta kontainer basis data. Proses ini mungkin memakan waktu satu atau dua menit untuk pertama kalinya.

✅ **Akses Listmonk**: Anda sekarang dapat mengakses antarmuka web Listmonk melalui domain yang Anda konfigurasikan (misalnya, `https://listmonk.yourdomain.com`).

### 7. Konfigurasikan Penerusan Email SMTP di Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Berikutnya, konfigurasikan Listmonk untuk mengirim email menggunakan akun Teruskan Email Anda.

1. **Aktifkan SMTP di Email Terusan**: Pastikan Anda telah membuat kredensial SMTP di dasbor akun Email Terusan Anda. Ikuti [Panduan Meneruskan Email untuk mengirim email dengan domain khusus melalui SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) jika belum.
2. **Konfigurasi Listmonk**: Masuk ke panel admin Listmonk Anda.
* Buka **Pengaturan -> SMTP**.

* Listmonk memiliki dukungan bawaan untuk Forward Email. Pilih **ForwardEmail** dari daftar penyedia, atau masukkan detail berikut secara manual:

| Pengaturan | Nilai |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Tuan rumah** | `smtp.forwardemail.net` |
| **Pelabuhan** | `465` |
| **Protokol autentikasi** | `LOGIN` |
| **Nama belakang** | Email Terusan Anda **Nama pengguna SMTP** |
| **Kata sandi** | Email Penerusan Anda **Kata sandi SMTP** |
| **TLS** | `SSL/TLS` |
| **Dari email** | Alamat `From` yang Anda inginkan (misalnya, `newsletter@yourdomain.com`). Pastikan domain ini dikonfigurasi di Forward Email. |

**Penting**: Selalu gunakan port `465` dengan `SSL/TLS` untuk koneksi aman dengan Forward Email. Jangan gunakan STARTTLS (port 587).

* Klik **Simpan**.
3. **Kirim Email Uji Coba**: Gunakan tombol "Kirim Email Uji Coba" di halaman pengaturan SMTP. Masukkan alamat penerima yang dapat Anda akses dan klik **Kirim**. Pastikan email telah sampai di kotak masuk penerima.

### 8. Konfigurasikan Pemrosesan Pantulan {#8-configure-bounce-processing}

Pemrosesan pantulan memungkinkan Listmonk menangani email yang tidak terkirim secara otomatis (misalnya, karena alamat tidak valid). Email Terusan menyediakan webhook untuk memberi tahu Listmonk tentang pantulan.

#### Penyiapan Penerusan Email {#forward-email-setup}

1. Masuk ke [Dasbor Penerusan Email](https://forwardemail.net/) Anda.
2. Buka **Domain**, pilih domain yang Anda gunakan untuk mengirim, dan buka halaman **Pengaturan**.
3. Gulir ke bawah ke bagian **URL Webhook Pantul**.
4. Masukkan URL berikut, ganti `<your_listmonk_domain>` dengan domain atau subdomain tempat instans Listmonk Anda dapat diakses:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Contoh*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Gulir lebih jauh ke bawah ke bagian **Kunci Verifikasi Muatan Tanda Tangan Webhook**.
6. **Salin** kunci verifikasi yang dihasilkan. Anda akan membutuhkannya di Listmonk.
7. Simpan perubahan di pengaturan domain Teruskan Email Anda.

#### Pengaturan Listmonk {#listmonk-setup}

1. Di panel admin Listmonk Anda, buka **Pengaturan -> Pentalan**.
2. Aktifkan **Aktifkan pemrosesan pentalan**.
3. Aktifkan **Aktifkan webhook pentalan**.
4. Gulir ke bawah ke bagian **Penyedia Webhook**.
5. Aktifkan **Email Terusan**.
6. Tempel **Kunci Verifikasi Muatan Tanda Tangan Webhook** yang Anda salin dari dasbor Pentalan Email ke kolom **Kunci Pentalan**.
7. Klik **Simpan** di bagian bawah halaman.
8. Pemrosesan pentalan sekarang telah dikonfigurasi! Ketika Email Terusan mendeteksi pentalan untuk email yang dikirim oleh Listmonk, Listmonk akan memberi tahu instansi Listmonk Anda melalui webhook, dan Listmonk akan menandai pelanggan tersebut.
9. Selesaikan langkah-langkah di bawah ini di [Pengujian](#testing) untuk memastikan semuanya berfungsi.

## Menguji {#testing}

Berikut ikhtisar singkat fungsi inti Listmonk:

### Buat Milis {#create-a-mailing-list}

* Buka **Daftar** di bilah sisi.
* Klik **Daftar Baru**.
* Isi detailnya (Nama, Jenis: Publik/Pribadi, Deskripsi, Tag) dan **Simpan**.

### Tambahkan Pelanggan {#add-subscribers}

* Buka bagian **Pelanggan**.
* Anda dapat menambahkan pelanggan:
* **Manual**: Klik **Pelanggan Baru**.
* **Impor**: Klik **Impor Pelanggan** untuk mengunggah berkas CSV.
* **API**: Gunakan API Listmonk untuk penambahan terprogram.
* Tetapkan pelanggan ke satu atau beberapa daftar saat pembuatan atau impor.
* **Praktik Terbaik**: Gunakan proses keikutsertaan ganda. Konfigurasikan ini di **Pengaturan -> Keikutsertaan & Langganan**.

### Buat dan Kirim Kampanye {#create-and-send-a-campaign}

* Buka **Kampanye** -> **Kampanye Baru**.
* Isi detail kampanye (Nama, Subjek, Email Asal, Daftar tujuan).
* Pilih jenis konten Anda (Teks Kaya/HTML, Teks Biasa, HTML Mentah).
* Susun konten email Anda. Anda dapat menggunakan variabel templat seperti `{{ .Subscriber.Email }}` atau `{{ .Subscriber.FirstName }}`.
* **Selalu kirim email uji coba terlebih dahulu!** Gunakan opsi "Kirim Uji Coba" untuk melihat pratinjau email di kotak masuk Anda.
* Setelah puas, klik **Mulai Kampanye** untuk segera mengirim atau menjadwalkannya nanti.

## Verifikasi {#verification}

* **Pengiriman SMTP**: Kirim email uji secara berkala melalui halaman pengaturan SMTP Listmonk dan uji kampanye untuk memastikan email terkirim dengan benar.
* **Penanganan Pentalan**: Kirim kampanye uji ke alamat email yang diketahui tidak valid (misalnya, `bounce-test@yourdomain.com` jika Anda tidak memiliki alamat email asli, meskipun hasilnya mungkin berbeda). Periksa statistik kampanye di Listmonk setelah beberapa saat untuk melihat apakah pantulan terdaftar.
* **Header Email**: Gunakan alat seperti [Penguji Surat](https://www.mail-tester.com/) atau periksa header email secara manual untuk memverifikasi bahwa SPF, DKIM, dan DMARC lolos, yang menunjukkan pengaturan yang tepat melalui Penerusan Email.
* **Log Penerusan Email**: Periksa log dasbor Penerusan Email Anda jika Anda mencurigai masalah pengiriman berasal dari server SMTP.

## Catatan Pengembang {#developer-notes}

* **Templating**: Listmonk menggunakan mesin templating Go. Jelajahi dokumentasinya untuk personalisasi lanjutan: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk menyediakan REST API yang komprehensif untuk mengelola daftar, pelanggan, kampanye, templat, dan lainnya. Temukan tautan dokumentasi API di footer instans Listmonk Anda.
* **Bidang Kustom**: Tentukan bidang pelanggan kustom di bawah **Pengaturan -> Bidang Pelanggan** untuk menyimpan data tambahan.
* **Webhook**: Selain bounce, Listmonk dapat mengirimkan webhook untuk kejadian lain (misalnya, langganan), yang memungkinkan integrasi dengan sistem lain.

## Kesimpulan {#conclusion}

Dengan mengintegrasikan kekuatan Listmonk yang dihosting sendiri dengan pengiriman Forward Email yang aman dan menjaga privasi, Anda menciptakan platform pemasaran email yang tangguh dan etis. Anda mempertahankan kepemilikan penuh atas data audiens Anda sekaligus memanfaatkan fitur keamanan otomatis dan tingkat pengiriman yang tinggi.

Pengaturan ini menyediakan alternatif layanan email berpemilik yang skalabel, hemat biaya, dan ramah pengembang, selaras sempurna dengan etos perangkat lunak sumber terbuka dan privasi pengguna.

Selamat Mengirim! 🚀