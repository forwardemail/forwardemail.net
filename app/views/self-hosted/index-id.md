# Self Hosted {#self-hosted}


## Daftar Isi {#table-of-contents}

* [Memulai](#getting-started)
* [Persyaratan](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Instalasi](#install)
  * [Debug skrip instalasi](#debug-install-script)
  * [Prompt](#prompts)
  * [Pengaturan Awal (Opsi 1)](#initial-setup-option-1)
* [Layanan](#services)
  * [Jalur file penting](#important-file-paths)
* [Konfigurasi](#configuration)
  * [Pengaturan DNS awal](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Pengujian](#testing)
  * [Membuat alias pertama Anda](#creating-your-first-alias)
  * [Mengirim / Menerima email pertama Anda](#sending--receiving-your-first-email)
* [Pemecahan Masalah](#troubleshooting)
  * [Apa username dan password basic auth](#what-is-the-basic-auth-username-and-password)
  * [Bagaimana saya tahu apa yang sedang berjalan](#how-do-i-know-what-is-running)
  * [Bagaimana saya tahu jika sesuatu tidak berjalan padahal seharusnya](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Bagaimana saya menemukan log](#how-do-i-find-logs)
  * [Mengapa email keluar saya mengalami timeout](#why-are-my-outgoing-emails-timing-out)


## Memulai {#getting-started}

Solusi email self-hosted kami, seperti semua produk kami, 100% open-source—baik frontend maupun backend. Ini berarti:

1. **Transparansi Lengkap**: Setiap baris kode yang memproses email Anda tersedia untuk pemeriksaan publik
2. **Kontribusi Komunitas**: Siapa saja dapat berkontribusi memperbaiki atau meningkatkan
3. **Keamanan Melalui Keterbukaan**: Kerentanan dapat diidentifikasi dan diperbaiki oleh komunitas global
4. **Tanpa Ketergantungan Vendor**: Anda tidak pernah bergantung pada keberadaan perusahaan kami

Seluruh kode tersedia di GitHub di <https://github.com/forwardemail/forwardemail.net>, berlisensi MIT License.

Arsitekturnya mencakup kontainer untuk:

* Server SMTP untuk email keluar
* Server IMAP/POP3 untuk pengambilan email
* Antarmuka web untuk administrasi
* Database untuk penyimpanan konfigurasi
* Redis untuk caching dan performa
* SQLite untuk penyimpanan mailbox yang aman dan terenkripsi

> \[!NOTE]
> Pastikan untuk melihat [blog self-hosted kami](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Dan bagi yang tertarik versi langkah demi langkah yang lebih terperinci lihat panduan kami berbasis [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) atau [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Persyaratan {#requirements}

Sebelum menjalankan skrip instalasi, pastikan Anda memiliki hal berikut:

* **Sistem Operasi**: Server berbasis Linux (saat ini mendukung Ubuntu 22.04+).
* **Sumber Daya**: 1 vCPU dan 2GB RAM
* **Akses Root**: Hak administratif untuk menjalankan perintah.
* **Nama Domain**: Domain kustom siap untuk konfigurasi DNS.
* **IP Bersih**: Pastikan server Anda memiliki alamat IP bersih tanpa reputasi spam sebelumnya dengan memeriksa daftar hitam. Info lebih lanjut [di sini](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Alamat IP publik dengan dukungan port 25
* Kemampuan untuk mengatur [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Dukungan IPv4 dan IPv6

> \[!TIP]
> Lihat daftar kami tentang [penyedia server mail terbaik](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

Sebagian besar vendor cloud mendukung konfigurasi cloud-init saat virtual private server (VPS) disediakan. Ini adalah cara yang bagus untuk mengatur beberapa file dan variabel lingkungan sebelumnya untuk digunakan oleh logika pengaturan awal skrip yang akan melewati kebutuhan prompt saat skrip berjalan untuk informasi tambahan.

**Opsi**

* `EMAIL` - email yang digunakan untuk pengingat kedaluwarsa certbot
* `DOMAIN` - domain kustom (misal `example.com`) yang digunakan untuk pengaturan self hosting
* `AUTH_BASIC_USERNAME` - username yang digunakan pada pengaturan pertama kali untuk melindungi situs
* `AUTH_BASIC_PASSWORD` - password yang digunakan pada pengaturan pertama kali untuk melindungi situs
* `/root/.cloudflare.ini` - (**hanya pengguna Cloudflare**) file konfigurasi cloudflare yang digunakan oleh certbot untuk konfigurasi DNS. Anda harus mengatur token API melalui `dns_cloudflare_api_token`. Baca lebih lanjut [di sini](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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

### Debug skrip instalasi {#debug-install-script}

Tambahkan `DEBUG=true` di depan skrip instalasi untuk output yang lebih rinci:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompt {#prompts}

```sh
1. Pengaturan awal
2. Pengaturan Cadangan
3. Pengaturan Pembaruan Otomatis
4. Perbarui sertifikat
5. Pulihkan dari Cadangan
6. Bantuan
7. Keluar
```

* **Pengaturan awal**: Mengunduh kode forward email terbaru, mengonfigurasi lingkungan, meminta domain kustom Anda dan mengatur semua sertifikat, kunci, dan rahasia yang diperlukan.
* **Pengaturan Cadangan**: Akan mengatur cron untuk mencadangkan mongoDB dan redis menggunakan penyimpanan kompatibel S3 untuk penyimpanan jarak jauh yang aman. Secara terpisah, sqlite akan dicadangkan saat login jika ada perubahan untuk cadangan yang aman dan terenkripsi.
* **Pengaturan Pembaruan**: Mengatur cron untuk mencari pembaruan malam hari yang akan membangun ulang dan memulai ulang komponen infrastruktur dengan aman.
* **Perbarui sertifikat**: Certbot / lets encrypt digunakan untuk sertifikat SSL dan kunci yang akan kedaluwarsa setiap 3 bulan. Ini akan memperbarui sertifikat untuk domain Anda dan menempatkannya di folder yang diperlukan agar komponen terkait dapat menggunakannya. Lihat [jalur file penting](#important-file-paths)
* **Pulihkan dari cadangan**: Akan memicu mongodb dan redis untuk memulihkan dari data cadangan.

### Pengaturan Awal (Opsi 1) {#initial-setup-option-1}

Pilih opsi `1. Pengaturan awal` untuk memulai.

Setelah selesai, Anda harus melihat pesan sukses. Anda bahkan dapat menjalankan `docker ps` untuk melihat **komponen** yang dijalankan. Informasi lebih lanjut tentang komponen di bawah.


## Layanan {#services}

| Nama Layanan |         Port Default        | Deskripsi                                            |
| ------------ | :-------------------------: | ------------------------------------------------------ |
| Web          |            `443`            | Antarmuka web untuk semua interaksi admin               |
| API          |            `4000`           | Lapisan API untuk abstraksi basis data                        |
| Bree         |             None            | Pekerjaan latar belakang dan pengelola tugas                         |
| SMTP         | `465` (direkomendasikan) / `587` | Server SMTP untuk email keluar                         |
| SMTP Bree    |             None            | Pekerjaan latar belakang SMTP                                    |
| MX           |            `2525`           | Pertukaran surat untuk email masuk dan penerusan email   |
| IMAP         |          `993/2993`         | Server IMAP untuk email masuk dan manajemen kotak surat   |
| POP3         |          `995/2995`         | Server POP3 untuk email masuk dan manajemen kotak surat   |
| SQLite       |            `3456`           | Server SQLite untuk interaksi dengan basis data sqlite(s) |
| SQLite Bree  |             None            | Pekerjaan latar belakang SQLite                                  |
| CalDAV       |            `5000`           | Server CalDAV untuk manajemen kalender                  |
| CardDAV      |            `6000`           | Server CardDAV untuk manajemen kalender                 |
| MongoDB      |           `27017`           | Basis data MongoDB untuk sebagian besar manajemen data              |
| Redis        |            `6379`           | Redis untuk caching dan manajemen status                 |
| SQLite       |             None            | Basis data SQLite untuk kotak surat terenkripsi             |

### Jalur file penting {#important-file-paths}

Catatan: *Jalur host* di bawah ini relatif terhadap `/root/forwardemail.net/self-hosting/`.

| Komponen               |       Jalur Host       | Jalur Kontainer               |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| File Env               |        `./.env`       | `/app/.env`                  |
| Sertifikat/kunci SSL   |        `./ssl`        | `/app/ssl/`                  |
| Kunci privat           |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Sertifikat rantai penuh| `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| Sertifikat CA          |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| Kunci privat DKIM      |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Simpan file `.env` dengan aman. Ini sangat penting untuk pemulihan jika terjadi kegagalan.
> Anda dapat menemukannya di `/root/forwardemail.net/self-hosting/.env`.


## Konfigurasi {#configuration}

### Pengaturan DNS awal {#initial-dns-setup}

Di penyedia DNS pilihan Anda, konfigurasikan catatan DNS yang sesuai. Perlu diperhatikan bahwa apa pun yang ada dalam tanda kurung (`<>`) bersifat dinamis dan perlu diperbarui dengan nilai Anda.

| Tipe  | Nama               | Konten                       | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", atau kosong | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", atau kosong | mx.<domain_name> (prioritas 0) | auto |
| TXT   | "@", ".", atau kosong | "v=spf1 a -all"               | auto |

#### Reverse DNS / catatan PTR {#reverse-dns--ptr-record}

Reverse DNS (rDNS) atau catatan pointer balik (catatan PTR) sangat penting untuk server email karena membantu memverifikasi keabsahan server yang mengirim email. Setiap penyedia cloud melakukannya dengan cara berbeda, jadi Anda perlu mencari cara menambahkan "Reverse DNS" untuk memetakan host dan IP ke hostname yang sesuai. Kemungkinan besar ada di bagian jaringan penyedia.

#### Port 25 Diblokir {#port-25-blocked}

Beberapa ISP dan penyedia cloud memblokir port 25 untuk menghindari pelaku jahat. Anda mungkin perlu mengajukan tiket dukungan untuk membuka port 25 untuk SMTP / email keluar.


## Onboarding {#onboarding}

1. Buka Halaman Landing
   Arahkan ke https\://\<domain_name>, ganti \<domain_name> dengan domain yang dikonfigurasi di pengaturan DNS Anda. Anda akan melihat halaman landing Forward Email.

2. Masuk dan Daftarkan Domain Anda

* Masuk dengan email dan kata sandi yang valid.
* Masukkan nama domain yang ingin Anda atur (harus sesuai dengan konfigurasi DNS).
* Ikuti petunjuk untuk menambahkan catatan **MX** dan **TXT** yang diperlukan untuk verifikasi.

3. Selesaikan Pengaturan

* Setelah diverifikasi, akses halaman Aliases untuk membuat alias pertama Anda.
* Opsional, konfigurasikan **SMTP untuk email keluar** di **Pengaturan Domain**. Ini memerlukan catatan DNS tambahan.

> \[!NOTE]
> Tidak ada informasi yang dikirim keluar dari server Anda. Opsi self hosted dan akun awal hanya untuk login admin dan tampilan web untuk mengelola domain, alias, dan konfigurasi email terkait.


## Pengujian {#testing}

### Membuat alias pertama Anda {#creating-your-first-alias}

1. Buka Halaman Aliases
   Buka halaman pengelolaan alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Tambah Alias Baru

* Klik **Add Alias** (kanan atas).
* Masukkan nama alias dan sesuaikan pengaturan email sesuai kebutuhan.
* (Opsional) Aktifkan dukungan **IMAP/POP3/CalDAV/CardDAV** dengan mencentang kotak.
* Klik **Create Alias.**

3. Atur Kata Sandi

* Klik **Generate Password** untuk membuat kata sandi yang aman.
* Kata sandi ini akan diperlukan untuk masuk ke klien email Anda.

4. Konfigurasikan Klien Email Anda

* Gunakan klien email seperti Thunderbird.
* Masukkan nama alias dan kata sandi yang dibuat.
* Konfigurasikan pengaturan **IMAP** dan **SMTP** sesuai kebutuhan.

#### Pengaturan server email {#email-server-settings}

Username: `<alias name>`

| Tipe | Hostname           | Port | Keamanan Koneksi   | Autentikasi     |
| ---- | ------------------ | ---- | ------------------ | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS          | Normal Password |
| IMAP | imap.<domain_name> | 993  | SSL / TLS          | Normal Password |

### Mengirim / Menerima email pertama Anda {#sending--receiving-your-first-email}

Setelah dikonfigurasi, Anda seharusnya dapat mengirim dan menerima email ke alamat email yang baru dibuat dan self hosted!
## Pemecahan Masalah {#troubleshooting}

#### Mengapa ini tidak berfungsi di luar Ubuntu dan Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Kami saat ini sedang berupaya mendukung MacOS dan akan mempertimbangkan lainnya. Silakan buka [diskusi](https://github.com/orgs/forwardemail/discussions) atau berkontribusi jika Anda ingin melihat dukungan untuk lainnya.

#### Mengapa tantangan certbot acme gagal {#why-is-the-certbot-acme-challenge-failing}

Kesalahan paling umum adalah certbot / letsencrypt terkadang akan meminta **2** tantangan. Anda perlu memastikan untuk menambahkan **KEDUA** catatan txt.

Contoh:
Anda mungkin melihat dua tantangan seperti ini:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Juga mungkin propagasi DNS belum selesai. Anda dapat menggunakan alat seperti: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Ini akan memberi Anda gambaran apakah perubahan catatan TXT Anda sudah tercermin. Juga mungkin cache DNS lokal di host Anda masih menggunakan nilai lama yang usang atau belum mengambil perubahan terbaru.

Pilihan lain adalah menggunakan perubahan DNS cerbot otomatis dengan mengatur file `/root/.cloudflare.ini` dengan token api di cloud-init / user-data Anda saat pengaturan VPS awal atau buat file ini dan jalankan skrip lagi. Ini akan mengelola perubahan DNS dan pembaruan tantangan secara otomatis.

### Apa username dan password basic auth {#what-is-the-basic-auth-username-and-password}

Untuk hosting sendiri, kami menambahkan pop up autentikasi native browser pertama kali dengan username sederhana (`admin`) dan password (dihasilkan secara acak saat pengaturan awal). Kami menambahkan ini sebagai perlindungan jika otomatisasi / scraper entah bagaimana mendahului Anda untuk mendaftar pertama kali di pengalaman web. Anda dapat menemukan password ini setelah pengaturan awal di file `.env` Anda di bawah `AUTH_BASIC_USERNAME` dan `AUTH_BASIC_PASSWORD`.

### Bagaimana saya tahu apa yang sedang berjalan {#how-do-i-know-what-is-running}

Anda dapat menjalankan `docker ps` untuk melihat semua container yang sedang berjalan yang dijalankan dari file `docker-compose-self-hosting.yml`. Anda juga dapat menjalankan `docker ps -a` untuk melihat semuanya (termasuk container yang tidak berjalan).

### Bagaimana saya tahu jika ada sesuatu yang tidak berjalan padahal seharusnya {#how-do-i-know-if-something-isnt-running-that-should-be}

Anda dapat menjalankan `docker ps -a` untuk melihat semuanya (termasuk container yang tidak berjalan). Anda mungkin melihat log keluar atau catatan.

### Bagaimana saya menemukan log {#how-do-i-find-logs}

Anda dapat mendapatkan lebih banyak log melalui `docker logs -f <container_name>`. Jika ada yang keluar, kemungkinan terkait dengan file `.env` yang dikonfigurasi tidak benar.

Di dalam UI web, Anda dapat melihat `/admin/emails` dan `/admin/logs` untuk log email keluar dan log kesalahan secara berturut-turut.

### Mengapa email keluar saya mengalami timeout {#why-are-my-outgoing-emails-timing-out}

Jika Anda melihat pesan seperti Connection timed out when connecting to MX server... maka Anda mungkin perlu memeriksa apakah port 25 diblokir. Umum bagi ISP atau penyedia cloud untuk memblokir ini secara default di mana Anda mungkin perlu menghubungi dukungan / mengajukan tiket untuk membuka blokir ini.

#### Alat apa yang harus saya gunakan untuk menguji praktik terbaik konfigurasi email dan reputasi IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Lihat [FAQ kami di sini](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
