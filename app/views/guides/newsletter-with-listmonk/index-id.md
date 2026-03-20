# Listmonk dengan Forward Email untuk Pengiriman Newsletter yang Aman {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Daftar Isi {#table-of-contents}

* [Gambaran Umum](#overview)
* [Mengapa Listmonk dan Forward Email](#why-listmonk-and-forward-email)
* [Prasyarat](#prerequisites)
* [Instalasi](#installation)
  * [1. Perbarui Server Anda](#1-update-your-server)
  * [2. Instal Dependensi](#2-install-dependencies)
  * [3. Unduh Konfigurasi Listmonk](#3-download-listmonk-configuration)
  * [4. Konfigurasi Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurasi Akses HTTPS](#5-configure-https-access)
  * [6. Mulai Listmonk](#6-start-listmonk)
  * [7. Konfigurasi SMTP Forward Email di Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurasi Pemrosesan Bounce](#8-configure-bounce-processing)
* [Pengujian](#testing)
  * [Buat Daftar Mailing](#create-a-mailing-list)
  * [Tambahkan Pelanggan](#add-subscribers)
  * [Buat dan Kirim Kampanye](#create-and-send-a-campaign)
* [Verifikasi](#verification)
* [Catatan Pengembang](#developer-notes)
* [Kesimpulan](#conclusion)


## Gambaran Umum {#overview}

Panduan ini memberikan instruksi langkah demi langkah bagi pengembang untuk mengatur [Listmonk](https://listmonk.app/), sebuah pengelola newsletter dan daftar mailing open-source yang kuat, untuk menggunakan [Forward Email](https://forwardemail.net/) sebagai penyedia SMTP-nya. Kombinasi ini memungkinkan Anda mengelola kampanye secara efektif sekaligus memastikan pengiriman email yang aman, privat, dan andal.

* **Listmonk**: Mengelola manajemen pelanggan, organisasi daftar, pembuatan kampanye, dan pelacakan kinerja.
* **Forward Email**: Bertindak sebagai server SMTP yang aman, menangani pengiriman email dengan fitur keamanan bawaan seperti SPF, DKIM, DMARC, dan enkripsi TLS.

Dengan mengintegrasikan keduanya, Anda mempertahankan kendali penuh atas data dan infrastruktur Anda sambil memanfaatkan sistem pengiriman yang kuat dari Forward Email.


## Mengapa Listmonk dan Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Baik Listmonk maupun prinsip di balik Forward Email menekankan transparansi dan kontrol. Anda meng-host Listmonk sendiri, sehingga memiliki data Anda.
* **Fokus Privasi**: Forward Email dibangun dengan privasi sebagai inti, meminimalkan penyimpanan data dan fokus pada transmisi yang aman.
* **Efektif Biaya**: Listmonk gratis, dan Forward Email menawarkan tingkatan gratis yang murah hati serta paket berbayar yang terjangkau, menjadikannya solusi ramah anggaran.
* **Skalabilitas**: Listmonk sangat berkinerja tinggi, dan infrastruktur Forward Email dirancang untuk pengiriman yang andal dalam skala besar.
* **Ramah Pengembang**: Listmonk menawarkan API yang kuat, dan Forward Email menyediakan integrasi SMTP yang sederhana serta webhook.


## Prasyarat {#prerequisites}

Sebelum memulai, pastikan Anda memiliki hal-hal berikut:

* Sebuah Virtual Private Server (VPS) yang menjalankan distribusi Linux terbaru (disarankan Ubuntu 20.04+) dengan minimal 1 CPU dan 1GB RAM (disarankan 2GB).
  * Butuh penyedia? Lihat [daftar VPS yang direkomendasikan](https://github.com/forwardemail/awesome-mail-server-providers).
* Nama domain yang Anda kendalikan (akses DNS diperlukan).
* Akun aktif dengan [Forward Email](https://forwardemail.net/).
* Akses root atau `sudo` ke VPS Anda.
* Familiaritas dasar dengan operasi baris perintah Linux.


## Instalasi {#installation}

Langkah-langkah ini memandu Anda melalui instalasi Listmonk menggunakan Docker dan Docker Compose di VPS Anda.

### 1. Perbarui Server Anda {#1-update-your-server}

Pastikan daftar paket sistem dan paket yang terinstal sudah terbaru.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instal Dependensi {#2-install-dependencies}

Instal Docker, Docker Compose, dan UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Unduh Konfigurasi Listmonk {#3-download-listmonk-configuration}

Buat direktori untuk Listmonk dan unduh file `docker-compose.yml` resmi.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

File ini mendefinisikan kontainer aplikasi Listmonk dan kontainer database PostgreSQL yang dibutuhkan.
### 4. Konfigurasi Firewall (UFW) {#4-configure-firewall-ufw}

Izinkan lalu lintas penting (SSH, HTTP, HTTPS) melalui firewall. Jika SSH Anda berjalan pada port non-standar, sesuaikan sesuai kebutuhan.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Konfirmasi pengaktifan firewall saat diminta.

### 5. Konfigurasi Akses HTTPS {#5-configure-https-access}

Menjalankan Listmonk melalui HTTPS sangat penting untuk keamanan. Anda memiliki dua opsi utama:

#### Opsi A: Menggunakan Proxy Cloudflare (Direkomendasikan untuk Kesederhanaan) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Jika DNS domain Anda dikelola oleh Cloudflare, Anda dapat memanfaatkan fitur proxy mereka untuk HTTPS yang mudah.

1. **Tunjuk DNS**: Buat record `A` di Cloudflare untuk subdomain Listmonk Anda (misalnya, `listmonk.yourdomain.com`) yang mengarah ke alamat IP VPS Anda. Pastikan **Proxy status** disetel ke **Proxied** (awan oranye).
2. **Ubah Docker Compose**: Edit file `docker-compose.yml` yang Anda unduh:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Ini membuat Listmonk dapat diakses secara internal pada port 80, yang kemudian dapat diproksikan dan diamankan oleh Cloudflare dengan HTTPS.

#### Opsi B: Menggunakan Reverse Proxy (Nginx, Caddy, dll.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Sebagai alternatif, Anda dapat mengatur reverse proxy seperti Nginx atau Caddy di VPS Anda untuk menangani terminasi HTTPS dan memproksikan permintaan ke Listmonk (yang berjalan pada port 9000 secara default).

* Pertahankan `ports: - "127.0.0.1:9000:9000"` default di `docker-compose.yml` agar Listmonk hanya dapat diakses secara lokal.
* Konfigurasikan reverse proxy pilihan Anda untuk mendengarkan pada port 80 dan 443, mengelola perolehan sertifikat SSL (misalnya melalui Let's Encrypt), dan meneruskan lalu lintas ke `http://127.0.0.1:9000`.
* Pengaturan reverse proxy secara rinci berada di luar cakupan panduan ini, tetapi banyak tutorial tersedia secara online.

### 6. Mulai Listmonk {#6-start-listmonk}

Kembali ke direktori `listmonk` Anda (jika belum berada di sana) dan mulai kontainer dalam mode terpisah.

```bash
cd ~/listmonk # Atau direktori tempat Anda menyimpan docker-compose.yml
docker compose up -d
```

Docker akan mengunduh image yang diperlukan dan memulai aplikasi Listmonk serta kontainer database. Ini mungkin memakan waktu satu atau dua menit pada kali pertama.

✅ **Akses Listmonk**: Sekarang Anda harus dapat mengakses antarmuka web Listmonk melalui domain yang Anda konfigurasi (misalnya, `https://listmonk.yourdomain.com`).

### 7. Konfigurasi SMTP Forward Email di Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Selanjutnya, konfigurasikan Listmonk untuk mengirim email menggunakan akun Forward Email Anda.

1. **Aktifkan SMTP di Forward Email**: Pastikan Anda telah menghasilkan kredensial SMTP di dashboard akun Forward Email Anda. Ikuti [panduan Forward Email untuk mengirim email dengan domain kustom via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) jika belum melakukannya.
2. **Konfigurasikan Listmonk**: Masuk ke panel admin Listmonk Anda.
   * Navigasi ke **Settings -> SMTP**.

   * Listmonk memiliki dukungan bawaan untuk Forward Email. Pilih **ForwardEmail** dari daftar penyedia, atau masukkan secara manual detail berikut:

     | Pengaturan        | Nilai                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth protocol** | `LOGIN`                                                                                                             |
     | **Username**      | **Username SMTP** Forward Email Anda                                                                                |
     | **Password**      | **Password SMTP** Forward Email Anda                                                                                |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **From e-mail**   | Alamat `From` yang Anda inginkan (misalnya, `newsletter@yourdomain.com`). Pastikan domain ini dikonfigurasi di Forward Email. |
* **Penting**: Selalu gunakan Port `465` dengan `SSL/TLS` untuk koneksi aman dengan Forward Email (direkomendasikan). Port `587` dengan STARTTLS juga didukung tetapi SSL/TLS lebih disarankan.

   * Klik **Simpan**.
3. **Kirim Email Uji**: Gunakan tombol "Kirim Email Uji" di halaman pengaturan SMTP. Masukkan alamat penerima yang dapat Anda akses dan klik **Kirim**. Verifikasi bahwa email tiba di kotak masuk penerima.

### 8. Konfigurasi Pemrosesan Bounce {#8-configure-bounce-processing}

Pemrosesan bounce memungkinkan Listmonk secara otomatis menangani email yang tidak dapat dikirim (misalnya, karena alamat tidak valid). Forward Email menyediakan webhook untuk memberi tahu Listmonk tentang bounce.

#### Pengaturan Forward Email {#forward-email-setup}

1. Masuk ke [Dashboard Forward Email](https://forwardemail.net/).
2. Navigasikan ke **Domains**, pilih domain yang Anda gunakan untuk pengiriman, dan buka halaman **Settings**-nya.
3. Gulir ke bawah ke bagian **Bounce Webhook URL**.
4. Masukkan URL berikut, ganti `<your_listmonk_domain>` dengan domain atau subdomain tempat instance Listmonk Anda dapat diakses:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Contoh*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Gulir lebih jauh ke bagian **Webhook Signature Payload Verification Key**.
6. **Salin** kunci verifikasi yang dihasilkan. Anda akan membutuhkannya di Listmonk.
7. Simpan perubahan di pengaturan domain Forward Email Anda.

#### Pengaturan Listmonk {#listmonk-setup}

1. Di panel admin Listmonk Anda, buka **Settings -> Bounces**.
2. Aktifkan **Enable bounce processing**.
3. Aktifkan **Enable bounce webhooks**.
4. Gulir ke bawah ke bagian **Webhook Providers**.
5. Aktifkan **Forward Email**.
6. Tempel **Webhook Signature Payload Verification Key** yang Anda salin dari dashboard Forward Email ke kolom **Forward Email Key**.
7. Klik **Simpan** di bagian bawah halaman.
8. Pemrosesan bounce kini sudah dikonfigurasi! Ketika Forward Email mendeteksi bounce untuk email yang dikirim oleh Listmonk, ia akan memberi tahu instance Listmonk Anda melalui webhook, dan Listmonk akan menandai pelanggan sesuai.
9. Selesaikan langkah-langkah di bawah ini pada bagian [Testing](#testing) untuk memastikan semuanya berfungsi.

## Pengujian {#testing}

Berikut gambaran singkat fungsi inti Listmonk:

### Buat Daftar Mailing {#create-a-mailing-list}

* Buka **Lists** di sidebar.
* Klik **New List**.
* Isi detailnya (Nama, Tipe: Public/Private, Deskripsi, Tag) dan **Simpan**.

### Tambah Pelanggan {#add-subscribers}

* Navigasi ke bagian **Subscribers**.
* Anda dapat menambahkan pelanggan:
  * **Manual**: Klik **New Subscriber**.
  * **Impor**: Klik **Import Subscribers** untuk mengunggah file CSV.
  * **API**: Gunakan API Listmonk untuk penambahan secara programatik.
* Tetapkan pelanggan ke satu atau lebih daftar saat pembuatan atau impor.
* **Praktik Terbaik**: Gunakan proses double opt-in. Konfigurasikan ini di **Settings -> Opt-in & Subscriptions**.

### Buat dan Kirim Kampanye {#create-and-send-a-campaign}

* Buka **Campaigns** -> **New Campaign**.
* Isi detail kampanye (Nama, Subjek, Email Pengirim, Daftar yang akan dikirimi).
* Pilih tipe konten Anda (Rich Text/HTML, Plain Text, Raw HTML).
* Buat isi email Anda. Anda dapat menggunakan variabel template seperti `{{ .Subscriber.Email }}` atau `{{ .Subscriber.FirstName }}`.
* **Selalu kirim email uji terlebih dahulu!** Gunakan opsi "Send Test" untuk melihat pratinjau email di kotak masuk Anda.
* Setelah puas, klik **Start Campaign** untuk mengirim segera atau jadwalkan untuk nanti.

## Verifikasi {#verification}

* **Pengiriman SMTP**: Secara rutin kirim email uji melalui halaman pengaturan SMTP Listmonk dan kampanye uji untuk memastikan email terkirim dengan benar.
* **Penanganan Bounce**: Kirim kampanye uji ke alamat email yang diketahui tidak valid (misalnya, `bounce-test@yourdomain.com` jika Anda tidak memiliki yang asli, meskipun hasilnya bisa bervariasi). Periksa statistik kampanye di Listmonk setelah beberapa saat untuk melihat apakah bounce terdaftar.
* **Header Email**: Gunakan alat seperti [Mail-Tester](https://www.mail-tester.com/) atau periksa header email secara manual untuk memverifikasi bahwa SPF, DKIM, dan DMARC lolos, menandakan pengaturan yang benar melalui Forward Email.
* **Log Forward Email**: Periksa log dashboard Forward Email jika Anda mencurigai masalah pengiriman yang berasal dari server SMTP.
## Catatan Pengembang {#developer-notes}

* **Templating**: Listmonk menggunakan mesin templating Go. Jelajahi dokumentasinya untuk personalisasi tingkat lanjut: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk menyediakan REST API yang komprehensif untuk mengelola daftar, pelanggan, kampanye, template, dan lainnya. Temukan tautan dokumentasi API di footer instance Listmonk Anda.
* **Custom Fields**: Definisikan bidang pelanggan khusus di bawah **Settings -> Subscriber Fields** untuk menyimpan data tambahan.
* **Webhooks**: Selain bounce, Listmonk dapat mengirim webhook untuk event lain (misalnya, langganan), memungkinkan integrasi dengan sistem lain.


## Kesimpulan {#conclusion}

Dengan mengintegrasikan kekuatan self-hosted Listmonk dengan pengiriman Forward Email yang aman dan menghormati privasi, Anda menciptakan platform pemasaran email yang kuat dan etis. Anda mempertahankan kepemilikan penuh atas data audiens Anda sambil mendapatkan manfaat dari deliverability tinggi dan fitur keamanan otomatis.

Pengaturan ini menyediakan alternatif yang skalabel, hemat biaya, dan ramah pengembang dibandingkan layanan email proprietary, yang selaras sempurna dengan etos perangkat lunak open-source dan privasi pengguna.

Selamat Mengirim! 🚀
