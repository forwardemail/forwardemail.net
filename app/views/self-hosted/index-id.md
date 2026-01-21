# Dihosting Sendiri {#self-hosted}

## Daftar Isi {#table-of-contents}

* [Memulai](#getting-started)
* [Persyaratan](#requirements)
  * [Cloud-init / Data pengguna](#cloud-init--user-data)
* [Memasang](#install)
  * [Skrip instalasi debug](#debug-install-script)
  * [Petunjuk](#prompts)
  * [Pengaturan Awal (Opsi 1)](#initial-setup-option-1)
* [Layanan](#services)
  * [Jalur file penting](#important-file-paths)
* [Konfigurasi](#configuration)
  * [Pengaturan DNS awal](#initial-dns-setup)
* [Orientasi](#onboarding)
* [Pengujian](#testing)
  * [Membuat alias pertama Anda](#creating-your-first-alias)
  * [Mengirim / Menerima email pertama Anda](#sending--receiving-your-first-email)
* [Pemecahan Masalah](#troubleshooting)
  * [Apa nama pengguna dan kata sandi autentikasi dasar?](#what-is-the-basic-auth-username-and-password)
  * [Bagaimana saya tahu apa yang sedang berjalan?](#how-do-i-know-what-is-running)
  * [Bagaimana saya tahu jika sesuatu tidak berjalan sebagaimana mestinya?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Bagaimana cara menemukan log?](#how-do-i-find-logs)
  * [Mengapa email keluar saya kehabisan waktu](#why-are-my-outgoing-emails-timing-out)

## Memulai {#getting-started}

Solusi email self-hosted kami, seperti semua produk kami, 100% open-source—baik front-end maupun back-end. Artinya:

1. **Transparansi Penuh**: Setiap baris kode yang memproses email Anda tersedia untuk pengawasan publik
2. **Kontribusi Komunitas**: Siapa pun dapat berkontribusi untuk perbaikan atau memperbaiki masalah
3. **Keamanan Melalui Keterbukaan**: Kerentanan dapat diidentifikasi dan diperbaiki oleh komunitas global
4. **Tanpa Vendor Lock-in**: Anda tidak pernah bergantung pada keberadaan perusahaan kami

Seluruh basis kode tersedia di GitHub pada <https://github.com/forwardemail/forwardemail.net>, yang dilisensikan di bawah Lisensi MIT.

Arsitekturnya mencakup kontainer untuk:

* Server SMTP untuk email keluar
* Server IMAP/POP3 untuk pengambilan email
* Antarmuka web untuk administrasi
* Database untuk penyimpanan konfigurasi
* Redis untuk caching dan kinerja
* SQLite untuk penyimpanan kotak surat yang aman dan terenkripsi

> \[!NOTE]
> Pastikan untuk memeriksa [blog yang dihosting sendiri](https://forwardemail.net/blog/docs/self-hosted-solution) kami
>
> Dan bagi mereka yang tertarik dengan versi langkah demi langkah yang lebih rinci, lihat panduan berbasis [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) atau [Debian](https://forwardemail.net/guides/selfhosted-on-debian) kami.

## Persyaratan {#requirements}

Sebelum menjalankan skrip instalasi, pastikan Anda memiliki yang berikut ini:

* **Sistem Operasi**: Server berbasis Linux (saat ini mendukung Ubuntu 22.04+).
* **Sumber Daya**: 1 vCPU dan RAM 2GB
* **Akses Root**: Hak akses administratif untuk menjalankan perintah.
* **Nama Domain**: Domain kustom yang siap untuk konfigurasi DNS.
* **IP Bersih**: Pastikan server Anda memiliki alamat IP bersih tanpa reputasi spam sebelumnya dengan memeriksa daftar hitam. Info selengkapnya: [Di Sini](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Alamat IP publik dengan dukungan port 25
* Kemampuan untuk mengatur [PTR terbalik](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Dukungan IPv4 dan IPv6

> \[!TIP]
> Lihat daftar [penyedia server email yang luar biasa](https://github.com/forwardemail/awesome-mail-server-providers) kami

### Cloud-init / Data pengguna {#cloud-init--user-data}

Sebagian besar vendor cloud mendukung konfigurasi cloud-init saat server pribadi virtual (VPS) diprovisi. Ini adalah cara yang bagus untuk menyiapkan beberapa berkas dan variabel lingkungan terlebih dahulu agar dapat digunakan oleh logika pengaturan awal skrip. Hal ini akan menghindari kebutuhan untuk meminta informasi tambahan saat skrip sedang berjalan.

**Pilihan**

* `EMAIL` - email yang digunakan untuk pengingat kedaluwarsa certbot
* `DOMAIN` - domain khusus (misalnya `example.com`) yang digunakan untuk pengaturan hosting mandiri
* `AUTH_BASIC_USERNAME` - nama pengguna yang digunakan pada pengaturan pertama untuk melindungi situs
* `AUTH_BASIC_PASSWORD` - kata sandi yang digunakan pada pengaturan pertama untuk melindungi situs
* `/root/.cloudflare.ini` - (**khusus pengguna Cloudflare**) berkas konfigurasi Cloudflare yang digunakan oleh certbot untuk konfigurasi DNS. Anda perlu mengatur token API melalui `dns_cloudflare_api_token`. Baca selengkapnya [Di Sini](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Contoh:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Instal {#install}

Jalankan perintah berikut di server Anda untuk mengunduh dan menjalankan skrip instalasi:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Skrip instalasi debug {#debug-install-script}

Tambahkan `DEBUG=true` di depan skrip instalasi untuk keluaran yang verbose:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Perintah {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Pengaturan awal**: Unduh kode email penerusan terbaru, konfigurasikan lingkungan, minta domain kustom Anda, dan atur semua sertifikat, kunci, dan rahasia yang diperlukan.
* **Pengaturan Pencadangan**: Akan mengatur cron untuk mencadangkan MongoDB dan Redis menggunakan penyimpanan yang kompatibel dengan S3 untuk penyimpanan jarak jauh yang aman. Secara terpisah, SQLite akan dicadangkan saat masuk jika ada perubahan untuk pencadangan yang aman dan terenkripsi.
* **Pengaturan Pemutakhiran**: Atur cron untuk mencari pembaruan setiap malam yang akan membangun ulang dan memulai ulang komponen infrastruktur dengan aman.
* **Perbarui sertifikat**: Certbot / lets encrypt digunakan untuk sertifikat SSL dan kunci akan kedaluwarsa setiap 3 bulan. Ini akan memperbarui sertifikat untuk domain Anda dan menempatkannya di folder yang diperlukan agar komponen terkait dapat digunakan. Lihat [jalur file penting](#important-file-paths)
* **Pulihkan dari cadangan**: Akan memicu MongoDB dan Redis untuk memulihkan dari data cadangan.

Pengaturan Awal ### (Opsi 1) {#initial-setup-option-1}

Pilih opsi `1. Initial setup` untuk memulai.

Setelah selesai, Anda akan melihat pesan sukses. Anda bahkan dapat menjalankan `docker ps` untuk melihat **komponen** telah dijalankan. Informasi selengkapnya tentang komponen ada di bawah.

## Layanan {#services}

| Nama Layanan | Port Default | Keterangan |
| ------------ | :----------: | ------------------------------------------------------ |
| Jaringan | `443` | Antarmuka web untuk semua interaksi admin |
| API | `4000` | Lapisan API ke database abstrak |
| Bree | Tidak ada | Pekerjaan latar belakang dan pelari tugas |
| SMTP | `465/587` | Server SMTP untuk email keluar |
| SMTP Bree | Tidak ada | Pekerjaan latar belakang SMTP |
| MX | `2525` | Pertukaran email untuk email masuk dan penerusan email |
| IMAP | `993/2993` | Server IMAP untuk manajemen email masuk dan kotak surat |
| POP3 | `995/2995` | Server POP3 untuk manajemen email masuk dan kotak surat |
| SQLite | `3456` | Server SQLite untuk interaksi dengan database SQLite |
| SQLite Bree | Tidak ada | Pekerjaan latar belakang SQLite |
| CalDAV | `5000` | Server CalDAV untuk manajemen kalender |
| KartuDAV | `6000` | Server CardDAV untuk manajemen kalender |
| MongoDB | `27017` | Database MongoDB untuk sebagian besar manajemen data |
| Redis | `6379` | Redis untuk caching dan manajemen status |
| SQLite | Tidak ada | Database SQLite untuk kotak surat terenkripsi |

### Jalur file penting {#important-file-paths}

Catatan: *Jalur host* di bawah ini relatif terhadap `/root/forwardemail.net/self-hosting/`.

| Komponen | Jalur host | Jalur kontainer |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Berkas env | `./.env` | `/app/.env` |
| Sertifikat/kunci SSL | `./ssl` | `/app/ssl/` |
| Kunci pribadi | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Sertifikat rantai penuh | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA Bersertifikat | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Kunci pribadi DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Simpan berkas `.env` dengan aman. Berkas ini penting untuk pemulihan jika terjadi kegagalan.
> Anda dapat menemukannya di `/root/forwardemail.net/self-hosting/.env`.

## Konfigurasi {#configuration}

### Penyiapan DNS awal {#initial-dns-setup}

Pada penyedia DNS pilihan Anda, konfigurasikan data DNS yang sesuai. Harap perhatikan bahwa semua yang ada dalam tanda kurung (`<>`) bersifat dinamis dan perlu diperbarui dengan nilai Anda.

| Jenis | Nama | Isi | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", atau kosong | <alamat_ip> | mobil |
| CNAME | api | <nama_domain> | mobil |
| CNAME | caldav | <nama_domain> | mobil |
| CNAME | carddav | <nama_domain> | mobil |
| CNAME | fe-memantul | <nama_domain> | mobil |
| CNAME | peta | <nama_domain> | mobil |
| CNAME | mx | <nama_domain> | mobil |
| CNAME | pop3 | <nama_domain> | mobil |
| CNAME | smtp | <nama_domain> | mobil |
| MX | "@", ".", atau kosong | mx.<nama_domain> (prioritas 0) | mobil |
| TXT | "@", ".", atau kosong | "v=spf1 a -semua" | mobil |

#### Rekaman DNS / PTR Terbalik {#reverse-dns--ptr-record}

DNS Terbalik (rDNS) atau catatan penunjuk terbalik (PTR record) sangat penting bagi server email karena membantu memverifikasi keabsahan server pengirim email. Setiap penyedia cloud melakukan hal ini secara berbeda, jadi Anda perlu mencari cara menambahkan "DNS Terbalik" untuk memetakan host dan IP ke nama host yang sesuai. Kemungkinan besar, Anda dapat menemukannya di bagian jaringan penyedia.

#### Port 25 Diblokir {#port-25-blocked}

Beberapa ISP dan penyedia cloud memblokir port 25 untuk menghindari pelaku kejahatan. Anda mungkin perlu mengajukan tiket dukungan untuk membuka port 25 untuk SMTP/email keluar.

## Orientasi {#onboarding}

1. Buka Halaman Arahan
Arahkan ke https://<nama_domain>, ganti \<nama_domain> dengan domain yang dikonfigurasi di pengaturan DNS Anda. Anda akan melihat halaman arahan "Teruskan Email".

2. Masuk dan Daftarkan Domain Anda

* Masuk dengan alamat email dan kata sandi yang valid.
* Masukkan nama domain yang ingin Anda atur (harus sesuai dengan konfigurasi DNS).
* Ikuti petunjuk untuk menambahkan data **MX** dan **TXT** yang diperlukan untuk verifikasi.

3. Pengaturan Lengkap

* Setelah terverifikasi, akses halaman Alias untuk membuat alias pertama Anda.
* Secara opsional, konfigurasikan **SMTP untuk email keluar** di **Pengaturan Domain**. Ini memerlukan data DNS tambahan.

> \[!NOTE]
> Tidak ada informasi yang dikirim ke luar server Anda. Opsi hosting mandiri dan akun awal hanya untuk login admin dan tampilan web untuk mengelola domain, alias, dan konfigurasi email terkait.

## Menguji {#testing}

### Membuat alias pertama Anda {#creating-your-first-alias}

1. Buka Halaman Alias
Buka halaman manajemen alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Tambahkan Alias Baru

* Klik **Tambahkan Alias** (kanan atas).
* Masukkan nama alias dan sesuaikan pengaturan email sesuai kebutuhan.
* (Opsional) Aktifkan dukungan **IMAP/POP3/CalDAV/CardDAV** dengan mencentang kotak.
* Klik **Buat Alias.**

3. Tetapkan Kata Sandi

* Klik **Buat Kata Sandi** untuk membuat kata sandi yang aman.
* Kata sandi ini diperlukan untuk masuk ke klien email Anda.

4. Konfigurasikan Klien Email Anda

* Gunakan klien email seperti Thunderbird.
* Masukkan nama alias dan kata sandi yang dihasilkan.
* Konfigurasikan pengaturan **IMAP** dan **SMTP** sebagaimana mestinya.

#### Pengaturan server email {#email-server-settings}

Nama pengguna: `<alias name>`

| Jenis | Nama host | Pelabuhan | Keamanan Koneksi | Autentikasi |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<nama_domain> | 465 | SSL / TLS | Kata Sandi Normal |
| IMAP | imap.<nama_domain> | 993 | SSL / TLS | Kata Sandi Normal |

### Mengirim / Menerima email pertama Anda {#sending--receiving-your-first-email}

Setelah dikonfigurasi, Anda seharusnya dapat mengirim dan menerima email ke alamat email yang baru Anda buat dan hosting sendiri!

## Pemecahan Masalah {#troubleshooting}

#### Mengapa ini tidak berfungsi di luar Ubuntu dan Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Saat ini kami sedang mencari dukungan untuk macOS dan akan mencari yang lain. Silakan buka [diskusi](https://github.com/orgs/forwardemail/discussions) atau berkontribusi jika Anda ingin melihat dukungan untuk yang lain.

#### Mengapa tantangan certbot acme gagal {#why-is-the-certbot-acme-challenge-failing}

Kesalahan paling umum adalah certbot/letsencrypt terkadang meminta **2** tantangan. Anda harus memastikan untuk menambahkan **KEDUA** data teks.

Contoh:
Anda mungkin melihat dua tantangan seperti ini:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Ada kemungkinan juga propagasi DNS belum selesai. Anda dapat menggunakan alat seperti: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Ini akan memberi Anda gambaran apakah perubahan data TXT Anda perlu diterapkan. Ada kemungkinan juga bahwa cache DNS lokal di host Anda masih menggunakan nilai lama yang tidak berlaku atau belum menerima perubahan terbaru.

Pilihan lainnya adalah menggunakan perubahan DNS cerbot otomatis dengan mengatur file `/root/.cloudflare.ini` dengan token API di cloud-init/user-data Anda pada pengaturan awal VPS, atau membuat file ini dan menjalankan skrip lagi. Ini akan mengelola perubahan DNS dan pembaruan tantangan secara otomatis.

### Apa nama pengguna dan kata sandi autentikasi dasar {#what-is-the-basic-auth-username-and-password}

Untuk hosting mandiri, kami menambahkan pop-up autentikasi bawaan browser untuk pertama kalinya dengan nama pengguna sederhana (`admin`) dan kata sandi (dibuat acak saat pengaturan awal). Kami menambahkan ini sebagai perlindungan jika otomatisasi/scraper entah bagaimana mendahului Anda untuk mendaftar pertama kali di pengalaman web. Anda dapat menemukan kata sandi ini setelah pengaturan awal di file `.env` di bawah `AUTH_BASIC_USERNAME` dan `AUTH_BASIC_PASSWORD`.

### Bagaimana cara mengetahui apa yang sedang berjalan {#how-do-i-know-what-is-running}

Anda dapat menjalankan `docker ps` untuk melihat semua kontainer yang sedang berjalan yang dijalankan dari berkas `docker-compose-self-hosting.yml`. Anda juga dapat menjalankan `docker ps -a` untuk melihat semuanya (termasuk kontainer yang tidak berjalan).

### Bagaimana cara mengetahui jika sesuatu tidak berjalan yang seharusnya {#how-do-i-know-if-something-isnt-running-that-should-be}

Anda dapat menjalankan `docker ps -a` untuk melihat semuanya (termasuk kontainer yang tidak berjalan). Anda mungkin akan melihat log keluar atau catatan.

### Bagaimana cara menemukan log {#how-do-i-find-logs}

Anda bisa mendapatkan lebih banyak log melalui `docker logs -f <container_name>`. Jika ada yang keluar, kemungkinan besar ada hubungannya dengan konfigurasi file `.env` yang salah.

Di dalam UI web, Anda dapat melihat `/admin/emails` dan `/admin/logs` untuk log email keluar dan log kesalahan.

### Mengapa email keluar saya kehabisan waktu {#why-are-my-outgoing-emails-timing-out}

Jika Anda melihat pesan "Waktu koneksi habis" saat menghubungkan ke server MX..., Anda mungkin perlu memeriksa apakah port 25 terblokir. Umumnya, ISP atau penyedia cloud memblokir port ini secara default, sehingga Anda mungkin perlu menghubungi dukungan/mengajukan tiket untuk membukanya.

#### Alat apa yang harus saya gunakan untuk menguji praktik terbaik konfigurasi email dan reputasi IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Lihatlah [FAQ di sini](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) kami.