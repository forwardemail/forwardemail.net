# API Email {#email-api}

## Daftar Isi {#table-of-contents}

* [Perpustakaan](#libraries)
* [URI Dasar](#base-uri)
* [Autentikasi](#authentication)
* [Kesalahan](#errors)
* [Lokalisasi](#localization)
* [Paginasi](#pagination)
* [Catatan](#logs)
  * [Ambil log](#retrieve-logs)
* [Akun](#account)
  * [Buat akun](#create-account)
  * [Ambil kembali akun](#retrieve-account)
  * [Perbarui akun](#update-account)
* [Kontak Alias (CardDAV)](#alias-contacts-carddav)
  * [Daftar kontak](#list-contacts)
  * [Buat kontak](#create-contact)
  * [Ambil kembali kontak](#retrieve-contact)
  * [Perbarui kontak](#update-contact)
  * [Hapus kontak](#delete-contact)
* [Kalender Alias (CalDAV)](#alias-calendars-caldav)
  * [Daftar kalender](#list-calendars)
  * [Buat kalender](#create-calendar)
  * [Ambil kalender](#retrieve-calendar)
  * [Perbarui kalender](#update-calendar)
  * [Hapus kalender](#delete-calendar)
* [Pesan Alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Daftar dan cari pesan](#list-and-search-for-messages)
  * [Buat pesan](#create-message)
  * [Ambil pesan](#retrieve-message)
  * [Perbarui pesan](#update-message)
  * [Hapus pesan](#delete-message)
* [Folder Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Daftar folder](#list-folders)
  * [Buat folder](#create-folder)
  * [Ambil folder](#retrieve-folder)
  * [Perbarui folder](#update-folder)
  * [Hapus folder](#delete-folder)
  * [Salin folder](#copy-folder)
* [Email Keluar](#outbound-emails)
  * [Dapatkan batas email SMTP keluar](#get-outbound-smtp-email-limit)
  * [Daftar email SMTP keluar](#list-outbound-smtp-emails)
  * [Buat email SMTP keluar](#create-outbound-smtp-email)
  * [Ambil email SMTP keluar](#retrieve-outbound-smtp-email)
  * [Hapus email SMTP keluar](#delete-outbound-smtp-email)
* [Domain](#domains)
  * [Daftar domain](#list-domains)
  * [Buat domain](#create-domain)
  * [Ambil kembali domain](#retrieve-domain)
  * [Verifikasi catatan domain](#verify-domain-records)
  * [Verifikasi catatan SMTP domain](#verify-domain-smtp-records)
  * [Daftar kata sandi penangkap-semua di seluruh domain](#list-domain-wide-catch-all-passwords)
  * [Buat kata sandi penampung semua domain](#create-domain-wide-catch-all-password)
  * [Hapus kata sandi penangkap-semua di seluruh domain](#remove-domain-wide-catch-all-password)
  * [Perbarui domain](#update-domain)
  * [Hapus domain](#delete-domain)
* [Undangan](#invites)
  * [Terima undangan domain](#accept-domain-invite)
  * [Buat undangan domain](#create-domain-invite)
  * [Hapus undangan domain](#remove-domain-invite)
* [Anggota](#members)
  * [Perbarui anggota domain](#update-domain-member)
  * [Hapus anggota domain](#remove-domain-member)
* [Alias](#aliases)
  * [Hasilkan kata sandi alias](#generate-an-alias-password)
  * [Daftar alias domain](#list-domain-aliases)
  * [Buat alias domain baru](#create-new-domain-alias)
  * [Ambil alias domain](#retrieve-domain-alias)
  * [Perbarui alias domain](#update-domain-alias)
  * [Hapus alias domain](#delete-domain-alias)
* [Enkripsi](#encrypt)
  * [Enkripsi Rekaman TXT](#encrypt-txt-record)

## Pustaka {#libraries}

Saat ini kami belum merilis pembungkus API apa pun, tetapi kami berencana untuk melakukannya dalam waktu dekat. Kirimkan email ke <api@forwardemail.net> jika Anda ingin mendapatkan notifikasi ketika pembungkus API untuk bahasa pemrograman tertentu dirilis. Sementara itu, Anda dapat menggunakan pustaka permintaan HTTP yang direkomendasikan ini di aplikasi Anda, atau cukup gunakan [keriting](https://stackoverflow.com/a/27442239/3586413) seperti pada contoh di bawah ini.

| Bahasa | Perpustakaan |
| ---------- | ---------------------------------------------------------------------- |
| Rubi | [Faraday](https://github.com/lostisland/faraday) |
| Ular piton | [requests](https://github.com/psf/requests) |
| Jawa | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (kami adalah pengelola) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (kami adalah pengelola) |
| Pergi | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## URI Dasar {#base-uri}

Jalur URI dasar HTTP saat ini adalah: `BASE_URI`.

## Autentikasi {#authentication}

Semua titik akhir mengharuskan [Kunci API](https://forwardemail.net/my-account/security) Anda ditetapkan sebagai nilai "nama pengguna" dari header [Otorisasi Dasar](https://en.wikipedia.org/wiki/Basic_access_authentication) permintaan (dengan pengecualian [Alias Kontak](#alias-contacts), [Kalender Alias](#alias-calendars), dan [Kotak Surat Alias](#alias-mailboxes) yang menggunakan [alias nama pengguna dan kata sandi yang dihasilkan](/faq#do-you-support-receiving-email-with-imap)).

Jangan khawatir – contoh disediakan di bawah ini untuk Anda jika Anda tidak yakin apa ini.

## Kesalahan {#errors}

Jika terjadi kesalahan, badan respons permintaan API akan berisi pesan kesalahan terperinci.

| Kode | Nama |
| ---- | --------------------- |
| 200 | OK |
| 400 | Permintaan Buruk |
| 401 | Tidak sah |
| 403 | Terlarang |
| 404 | Tidak Ditemukan |
| 429 | Terlalu Banyak Permintaan |
| 500 | Kesalahan Server Internal |
| 501 | Belum Diimplementasikan |
| 502 | Gerbang Buruk |
| 503 | Layanan Tidak Tersedia |
| 504 | Waktu Habis Gerbang |

> \[!TIP]
> Jika Anda menerima kode status 5xx (yang seharusnya tidak terjadi), silakan hubungi kami di <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> dan kami akan segera membantu Anda menyelesaikan masalah tersebut.

## Lokalisasi {#localization}

Layanan kami telah diterjemahkan ke lebih dari 25 bahasa. Semua pesan respons API diterjemahkan ke lokal terakhir yang terdeteksi oleh pengguna yang membuat permintaan API. Anda dapat menggantinya dengan memberikan header `Accept-Language` khusus. Silakan mencobanya menggunakan menu tarik-turun bahasa di bagian bawah halaman ini.

## Paginasi {#pagination}

> \[!NOTE]
> Mulai 1 November 2024, titik akhir API untuk [Daftar domain](#list-domains) dan [Daftar alias domain](#list-domain-aliases) akan menggunakan hasil maksimal `1000` per halaman secara default. Jika Anda ingin mengaktifkan perilaku ini lebih awal, Anda dapat meneruskan `?paginate=true` sebagai parameter string kueri tambahan ke URL untuk kueri titik akhir.

Paginasi didukung oleh semua titik akhir API yang mencantumkan hasil.

Cukup berikan properti querystring `page` (dan opsional `limit`).

Properti `page` harus berupa angka yang lebih besar atau sama dengan `1`. Jika Anda memasukkan `limit` (yang juga berupa angka), maka nilai minimumnya adalah `10` dan maksimumnya adalah `50` (kecuali dinyatakan lain).

| Parameter String Kueri | Diperlukan | Jenis | Keterangan |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | TIDAK | Nomor | Halaman hasil yang akan dikembalikan. Jika tidak ditentukan, nilai `page` akan menjadi `1`. Harus berupa angka yang lebih besar atau sama dengan `1`. |
| `limit` | TIDAK | Nomor | Jumlah hasil yang akan ditampilkan per halaman. Defaultnya adalah `10` jika tidak ditentukan. Harus berupa angka yang lebih besar atau sama dengan `1`, dan kurang dari atau sama dengan `50`. |

Untuk menentukan apakah terdapat lebih banyak hasil yang tersedia atau tidak, kami menyediakan header respons HTTP ini (yang dapat Anda uraikan untuk melakukan paginasi secara terprogram):

| Header Respons HTTP | Contoh | Keterangan |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Jumlah halaman total yang tersedia. |
| `X-Page-Current` | `X-Page-Current: 1` | Halaman hasil terkini yang dikembalikan (misalnya berdasarkan parameter querystring `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Jumlah total hasil pada halaman yang dikembalikan (misalnya berdasarkan parameter querystring `limit` dan hasil aktual yang dikembalikan). |
| `X-Item-Count` | `X-Item-Count: 30` | Jumlah total item yang tersedia di semua halaman. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Kami menyediakan header respons HTTP `Link` yang dapat Anda parsing seperti yang ditunjukkan pada contoh. Ini adalah [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (misalnya, tidak semua nilai akan diberikan jika tidak relevan atau tersedia, misalnya `"next"` tidak akan diberikan jika tidak ada halaman lain). |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Log {#logs}

### Ambil log {#retrieve-logs}

API kami secara terprogram memungkinkan Anda mengunduh log untuk akun Anda. Mengirimkan permintaan ke titik akhir ini akan memproses semua log untuk akun Anda dan mengirimkannya melalui email kepada Anda sebagai lampiran (file spreadsheet [Gzip](https://en.wikipedia.org/wiki/Gzip) terkompresi [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)) setelah selesai.

Ini memungkinkan Anda membuat pekerjaan latar belakang dengan [Pekerjaan cron](https://en.wikipedia.org/wiki/Cron) atau menggunakan [Perangkat lunak penjadwalan pekerjaan Node.js Bree](https://github.com/breejs/bree) kami untuk menerima log kapan pun Anda mau. Harap dicatat bahwa titik akhir ini dibatasi hingga `10` permintaan per hari.

Lampirannya berupa huruf kecil dari `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` dan email itu sendiri berisi ringkasan singkat log yang diambil. Anda juga dapat mengunduh log kapan saja dari [Akun Saya → Log](/my-account/logs).

> `GET /v1/logs/download`

| Parameter String Kueri | Diperlukan | Jenis | Keterangan |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | TIDAK | Tali (FQDN) | Filter log berdasarkan domain lengkap ("FQDN"). Jika Anda tidak memberikannya, semua log di semua domain akan diambil. |
| `q` | TIDAK | Rangkaian | Cari log berdasarkan email, domain, nama alias, alamat IP, atau tanggal (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, atau `M.D.YY`). |
| `bounce_category` | TIDAK | Rangkaian | Cari log berdasarkan kategori pentalan tertentu (misalnya `blocklist`). |
| `response_code` | TIDAK | Nomor | Cari log berdasarkan kode respons kesalahan tertentu (misalnya `421` atau `550`). |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Contoh pekerjaan Cron (tengah malam setiap hari):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Perhatikan bahwa Anda dapat menggunakan layanan seperti [Crontab.guru](https://crontab.guru/) untuk memvalidasi sintaksis ekspresi pekerjaan cron Anda.

> Contoh pekerjaan Cron (tengah malam setiap hari **dan dengan log untuk hari sebelumnya**):

Untuk MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Untuk Linux dan Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Akun {#account}

### Buat akun {#create-account}

> `POST /v1/account`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ya | Tali (Email) | Alamat email |
| `password` | Ya | Rangkaian | Kata sandi |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Ambil kembali akun {#retrieve-account}

> `GET /v1/account`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Perbarui akun {#update-account}

> `PUT /v1/account`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | -------------- | -------------------- |
| `email` | TIDAK | Tali (Email) | Alamat email |
| `given_name` | TIDAK | Rangkaian | Nama depan |
| `family_name` | TIDAK | Rangkaian | Nama belakang |
| `avatar_url` | TIDAK | Tali (URL) | Tautan ke gambar avatar |

> Contoh Permintaan:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Kontak Alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Tidak seperti titik akhir API lainnya, titik akhir API ini memerlukan [Autentikasi](#authentication) "nama pengguna" yang sama dengan alias nama pengguna dan "kata sandi" yang sama dengan alias kata sandi yang dihasilkan sebagai header Otorisasi Dasar.

> \[!WARNING]
> Bagian titik akhir ini masih dalam pengembangan dan akan dirilis (semoga) pada tahun 2024. Untuk sementara, silakan gunakan klien IMAP dari menu tarik-turun "Aplikasi" di navigasi situs web kami.

### Daftar kontak {#list-contacts}

> `GET /v1/contacts`

**Segera hadir**

### Buat kontak {#create-contact}

> `POST /v1/contacts`

**Segera hadir**

### Ambil kontak {#retrieve-contact}

> `GET /v1/contacts/:id`

**Segera hadir**

### Perbarui kontak {#update-contact}

> `PUT /v1/contacts/:id`

**Segera hadir**

### Hapus kontak {#delete-contact}

> `DELETE /v1/contacts/:id`

**Segera hadir**

## Alias Kalender (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Tidak seperti titik akhir API lainnya, titik akhir API ini memerlukan [Autentikasi](#authentication) "nama pengguna" yang sama dengan alias nama pengguna dan "kata sandi" yang sama dengan alias kata sandi yang dihasilkan sebagai header Otorisasi Dasar.

> \[!WARNING]
> Bagian titik akhir ini masih dalam pengembangan dan akan dirilis (semoga) pada tahun 2024. Untuk sementara, silakan gunakan klien IMAP dari menu tarik-turun "Aplikasi" di navigasi situs web kami.

### Daftar kalender {#list-calendars}

> `GET /v1/calendars`

**Segera hadir**

### Buat kalender {#create-calendar}

> `POST /v1/calendars`

**Segera hadir**

### Ambil kalender {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Segera hadir**

### Perbarui kalender {#update-calendar}

> `PUT /v1/calendars/:id`

**Segera hadir**

### Hapus kalender {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Segera hadir**

## Pesan Alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Tidak seperti titik akhir API lainnya, titik akhir API ini memerlukan [Autentikasi](#authentication) "nama pengguna" yang sama dengan alias nama pengguna dan "kata sandi" yang sama dengan alias kata sandi yang dihasilkan sebagai header Otorisasi Dasar.

> \[!WARNING]
> Bagian titik akhir ini masih dalam pengembangan dan akan dirilis (semoga) pada tahun 2024. Untuk sementara, silakan gunakan klien IMAP dari menu tarik-turun "Aplikasi" di navigasi situs web kami.

Pastikan Anda telah mengikuti petunjuk pengaturan untuk domain Anda.

Petunjuk ini dapat ditemukan di bagian FAQ kami [Apakah Anda mendukung penerimaan email dengan IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Daftar dan cari pesan {#list-and-search-for-messages}

> `GET /v1/messages`

**Segera hadir**

### Buat pesan {#create-message}

> \[!NOTE]
> Perintah ini **TIDAK** akan mengirim email – perintah ini hanya akan menambahkan pesan ke folder kotak surat Anda (misalnya, perintah ini mirip dengan perintah IMAP `APPEND`). Jika Anda ingin mengirim email, lihat [Buat email SMTP keluar](#create-outbound-smtp-email) di bawah. Setelah membuat email SMTP keluar, Anda dapat menambahkan salinannya menggunakan titik akhir ini ke kotak surat alias Anda untuk tujuan penyimpanan.

> `POST /v1/messages`

**Segera hadir**

### Ambil pesan {#retrieve-message}

> `GET /v1/messages/:id`

**Segera hadir**

### Perbarui pesan {#update-message}

> `PUT /v1/messages/:id`

**Segera hadir**

### Hapus pesan {#delete-message}

> `DELETE /v1/messages:id`

**Segera hadir**

## Folder Alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Titik akhir folder dengan jalur folder <code>/v1/folders/:path</code> sebagai titik akhirnya dapat dipertukarkan dengan ID folder <code>:id</code>. Ini berarti Anda dapat merujuk ke folder tersebut dengan nilai <code>path</code> atau <code>id</code>-nya.

> \[!WARNING]
> Bagian titik akhir ini masih dalam pengembangan dan akan dirilis (semoga) pada tahun 2024. Untuk sementara, silakan gunakan klien IMAP dari menu tarik-turun "Aplikasi" di navigasi situs web kami.

### Daftar folder {#list-folders}

> `GET /v1/folders`

**Segera hadir**

### Buat folder {#create-folder}

> `POST /v1/folders`

**Segera hadir**

### Ambil folder {#retrieve-folder}

> `GET /v1/folders/:id`

**Segera hadir**

### Perbarui folder {#update-folder}

> `PUT /v1/folders/:id`

**Segera hadir**

### Hapus folder {#delete-folder}

> `DELETE /v1/folders/:id`

**Segera hadir**

### Salin folder {#copy-folder}

> `POST /v1/folders/:id/copy`

**Segera hadir**

## Email Keluar {#outbound-emails}

Pastikan Anda telah mengikuti petunjuk pengaturan untuk domain Anda.

Petunjuk ini dapat ditemukan di [Akun Saya → Domain → Pengaturan → Konfigurasi SMTP Keluar](/my-account/domains). Anda perlu memastikan pengaturan DKIM, Return-Path, dan DMARC untuk mengirimkan SMTP keluar dengan domain Anda.

### Dapatkan batas email SMTP keluar {#get-outbound-smtp-email-limit}

Ini adalah titik akhir sederhana yang mengembalikan objek JSON berisi `count` dan `limit` untuk jumlah pesan keluar SMTP harian per akun.

> `GET /v1/emails/limit`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Daftar email SMTP keluar {#list-outbound-smtp-emails}

Perhatikan bahwa titik akhir ini tidak mengembalikan nilai properti untuk `message`, `headers`, atau `rejectedErrors` email.

Untuk mengembalikan properti dan nilainya, silakan gunakan titik akhir [Ambil email](#retrieve-email) dengan ID email.

> `GET /v1/emails`

| Parameter String Kueri | Diperlukan | Jenis | Keterangan |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | TIDAK | String (RegExp didukung) | Cari email berdasarkan metadata |
| `domain` | TIDAK | String (RegExp didukung) | Cari email berdasarkan nama domain |
| `sort` | TIDAK | Rangkaian | Urutkan berdasarkan kolom tertentu (diawali dengan tanda hubung tunggal `-` untuk mengurutkan dalam arah yang berlawanan dengan kolom tersebut). Default-nya adalah `created_at` jika tidak diatur. |
| `page` | TIDAK | Nomor | Lihat [Pagination](#pagination) untuk wawasan lebih lanjut |
| `limit` | TIDAK | Nomor | Lihat [Pagination](#pagination) untuk wawasan lebih lanjut |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Buat email SMTP keluar {#create-outbound-smtp-email}

API kami untuk membuat email terinspirasi oleh dan memanfaatkan konfigurasi opsi pesan Nodemailer. Harap gunakan [Konfigurasi pesan Nodemailer](https://nodemailer.com/message/) untuk semua parameter isi di bawah ini.

Harap dicatat bahwa kecuali `envelope` dan `dkim` (karena kami mengaturnya secara otomatis untuk Anda), kami mendukung semua opsi Nodemailer. Kami secara otomatis mengatur opsi `disableFileAccess` dan `disableUrlAccess` ke `true` demi keamanan.

Anda harus meneruskan opsi tunggal `raw` dengan email lengkap mentah Anda termasuk header **atau** meneruskan opsi parameter isi individual di bawah.

Titik akhir API ini akan otomatis mengodekan emoji untuk Anda jika ditemukan di header (misalnya, baris subjek `Subject: 🤓 Hello` akan otomatis dikonversi menjadi `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Tujuan kami adalah membuat API email yang sangat ramah pengembang dan anti-dummy.

> `POST /v1/emails`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | TIDAK | Tali (Email) | Alamat email pengirim (harus ada sebagai alias domain). |
| `to` | TIDAK | String atau Array | Daftar yang dipisahkan koma atau Array penerima untuk tajuk "Kepada". |
| `cc` | TIDAK | String atau Array | Daftar yang dipisahkan koma atau Array penerima untuk header "Cc". |
| `bcc` | TIDAK | String atau Array | Daftar yang dipisahkan koma atau Array penerima untuk header "Bcc". |
| `subject` | TIDAK | Rangkaian | Subjek email. |
| `text` | TIDAK | String atau Buffer | Versi teks biasa dari pesan tersebut. |
| `html` | TIDAK | String atau Buffer | Versi HTML dari pesan. |
| `attachments` | TIDAK | Susunan | Serangkaian objek lampiran (lihat [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | TIDAK | Rangkaian | Alamat email untuk header "Pengirim" (lihat [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | TIDAK | Rangkaian | Alamat email untuk tajuk "Balas-Ke". |
| `inReplyTo` | TIDAK | Rangkaian | ID Pesan tempat pesan tersebut dibalas. |
| `references` | TIDAK | String atau Array | Daftar yang dipisahkan spasi atau Array ID Pesan. |
| `attachDataUrls` | TIDAK | Boolean | Jika `true` maka ubah gambar `data:` dalam konten HTML pesan menjadi lampiran yang disematkan. |
| `watchHtml` | TIDAK | Rangkaian | Versi HTML pesan khusus Apple Watch ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), jam tangan terbaru tidak memerlukan pengaturan ini). |
| `amp` | TIDAK | Rangkaian | Versi HTML pesan spesifik AMP4EMAIL (lihat [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | TIDAK | Obyek | Peristiwa iCalendar untuk digunakan sebagai konten pesan alternatif (lihat [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | TIDAK | Susunan | Rangkaian konten pesan alternatif (lihat [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | TIDAK | Rangkaian | Pengkodean untuk teks dan string HTML (defaultnya adalah `"utf-8"`, tetapi mendukung nilai pengodean `"hex"` dan `"base64"` juga). |
| `raw` | TIDAK | String atau Buffer | Pesan berformat RFC822 yang dibuat khusus untuk digunakan (bukan pesan yang dibuat oleh Nodemailer – lihat [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | TIDAK | Rangkaian | Pengodean yang terpaksa digunakan untuk nilai teks (baik `"quoted-printable"` maupun `"base64"`). Nilai default adalah nilai terdekat yang terdeteksi (untuk ASCII, gunakan `"quoted-printable"`). |
| `priority` | TIDAK | Rangkaian | Tingkat prioritas untuk email (bisa berupa `"high"`, `"normal"` (default), atau `"low"`). Perhatikan bahwa nilai `"normal"` tidak menetapkan header prioritas (ini adalah perilaku default). Jika nilai `"high"` atau `"low"` ditetapkan, maka header `X-Priority`, `X-MSMail-Priority`, dan `Importance` adalah [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | TIDAK | Objek atau Array | Objek atau Larik bidang header tambahan yang akan ditetapkan (lihat [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | TIDAK | Rangkaian | Nilai Message-ID opsional untuk header "Message-ID" (nilai default akan dibuat secara otomatis jika tidak ditetapkan – perhatikan bahwa nilainya harus [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | TIDAK | String atau Tanggal | Nilai Tanggal opsional yang akan digunakan jika header Tanggal hilang setelah penguraian. Jika tidak, string UTC saat ini akan digunakan jika tidak disetel. Header tanggal tidak boleh lebih dari 30 hari sebelum waktu saat ini. |
| `list` | TIDAK | Obyek | Objek opsional dari header `List-*` (lihat [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Ambil email SMTP keluar {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Hapus email SMTP keluar {#delete-outbound-smtp-email}

Penghapusan email akan menetapkan status ke `"rejected"` (dan selanjutnya tidak akan diproses dalam antrean) jika dan hanya jika status saat ini adalah `"pending"`, `"queued"`, atau `"deferred"`. Kami dapat menghapus email secara otomatis setelah 30 hari sejak email dibuat dan/atau dikirim – oleh karena itu, Anda sebaiknya menyimpan salinan email SMTP keluar di klien, basis data, atau aplikasi Anda. Anda dapat merujuk nilai ID email kami di basis data Anda jika diinginkan – nilai ini dikembalikan dari titik akhir [Buat email](#create-email) dan [Ambil email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domain {#domains}

> \[!TIP]
> Titik akhir domain dengan nama domain <code>/v1/domains/:domain_name</code> sebagai titik akhirnya dapat dipertukarkan dengan ID domain <code>:domain_id</code>. Ini berarti Anda dapat merujuk ke domain tersebut dengan nilai <code>name</code> atau <code>id</code>.

### Daftar domain {#list-domains}

> \[!NOTE]
> Mulai 1 November 2024, titik akhir API untuk [Daftar domain](#list-domains) dan [Daftar alias domain](#list-domain-aliases) akan menggunakan hasil maksimal `1000` per halaman secara default. Jika Anda ingin mengaktifkan perilaku ini lebih awal, Anda dapat meneruskan `?paginate=true` sebagai parameter querystring tambahan ke URL untuk kueri titik akhir. Lihat [Paginasi](#pagination) untuk informasi lebih lanjut.

> `GET /v1/domains`

| Parameter String Kueri | Diperlukan | Jenis | Keterangan |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | TIDAK | String (RegExp didukung) | Cari domain berdasarkan nama |
| `name` | TIDAK | String (RegExp didukung) | Cari domain berdasarkan nama |
| `sort` | TIDAK | Rangkaian | Urutkan berdasarkan kolom tertentu (diawali dengan tanda hubung tunggal `-` untuk mengurutkan dalam arah yang berlawanan dengan kolom tersebut). Default-nya adalah `created_at` jika tidak diatur. |
| `page` | TIDAK | Nomor | Lihat [Pagination](#pagination) untuk wawasan lebih lanjut |
| `limit` | TIDAK | Nomor | Lihat [Pagination](#pagination) untuk wawasan lebih lanjut |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Buat domain {#create-domain}

> `POST /v1/domains`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ya | String (FQDN atau IP) | Nama domain yang sepenuhnya memenuhi syarat ("FQDN") atau alamat IP |
| `team_domain` | TIDAK | String (ID domain atau nama domain; FQDN) | Tetapkan domain ini secara otomatis ke tim yang sama dari domain lain. Ini berarti semua anggota dari domain ini akan ditetapkan sebagai anggota tim, dan `plan` akan otomatis diatur ke `team` juga. Anda dapat mengaturnya ke `"none"` jika perlu untuk menonaktifkannya secara eksplisit, tetapi itu tidak wajib. |
| `plan` | TIDAK | String (dapat dihitung) | Jenis paket (harus `"free"`, `"enhanced_protection"`, atau `"team"`, defaultnya adalah `"free"` atau paket berbayar pengguna saat ini jika menggunakan salah satunya) |
| `catchall` | TIDAK | String (alamat email dibatasi) atau Boolean | Buat alias catch-all default, defaultnya adalah `true` (jika `true`, alamat email pengguna API akan digunakan sebagai penerima, dan jika `false`, catch-all tidak akan dibuat). Jika String dilewatkan, maka akan berupa daftar alamat email yang dibatasi untuk digunakan sebagai penerima (dipisahkan oleh baris baru, spasi, dan/atau koma). |
| `has_adult_content_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan konten dewasa Spam Scanner di domain ini |
| `has_phishing_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan phishing Spam Scanner pada domain ini |
| `has_executable_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan eksekusi Spam Scanner pada domain ini |
| `has_virus_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan virus Spam Scanner pada domain ini |
| `has_recipient_verification` | TIDAK | Boolean | Domain global default untuk mengharuskan penerima alias mengklik tautan verifikasi email agar email dapat mengalir |
| `ignore_mx_check` | TIDAK | Boolean | Apakah akan mengabaikan pemeriksaan data MX pada domain untuk verifikasi? Hal ini terutama berlaku bagi pengguna yang memiliki aturan konfigurasi pertukaran MX tingkat lanjut dan perlu mempertahankan pertukaran MX yang ada dan meneruskannya ke pertukaran MX kami. |
| `retention_days` | TIDAK | Nomor | Bilangan bulat antara `0` dan `30` yang sesuai dengan jumlah hari penyimpanan untuk menyimpan email SMTP keluar setelah berhasil terkirim atau mengalami kesalahan permanen. Nilai default-nya adalah `0`, yang berarti email SMTP keluar akan segera dihapus dan disunting demi keamanan Anda. |
| `bounce_webhook` | TIDAK | String (URL) atau Boolean (salah) | URL webhook `http://` atau `https://` pilihan Anda untuk menerima webhook bounce. Kami akan mengirimkan permintaan `POST` ke URL ini dengan informasi tentang kegagalan SMTP keluar (misalnya, kegagalan ringan atau berat – sehingga Anda dapat mengelola pelanggan dan mengelola email keluar secara terprogram). |
| `max_quota_per_alias` | TIDAK | Rangkaian | Kuota penyimpanan maksimum untuk alias pada nama domain ini. Masukkan nilai seperti "1 GB" yang akan diurai oleh [bytes](https://github.com/visionmedia/bytes.js). |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Ambil domain {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verifikasi rekaman domain {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifikasi rekaman SMTP domain {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Daftar kata sandi tangkap-semua di seluruh domain {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Buat kata sandi penampung semua domain {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | TIDAK | Rangkaian | Kata sandi baru khusus Anda yang akan digunakan untuk kata sandi catch-all di seluruh domain. Harap dicatat bahwa Anda dapat mengosongkan atau menghilangkannya sama sekali dari badan permintaan API jika Anda ingin mendapatkan kata sandi yang kuat dan dibuat secara acak. |
| `description` | TIDAK | Rangkaian | Deskripsi hanya untuk tujuan pengorganisasian. |

> Contoh Permintaan:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Hapus kata sandi tangkap-semua di seluruh domain {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Perbarui domain {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | TIDAK | String atau Angka | Port khusus untuk dikonfigurasi untuk penerusan SMTP (default adalah `"25"`) |
| `has_adult_content_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan konten dewasa Spam Scanner di domain ini |
| `has_phishing_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan phishing Spam Scanner pada domain ini |
| `has_executable_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan eksekusi Spam Scanner pada domain ini |
| `has_virus_protection` | TIDAK | Boolean | Apakah akan mengaktifkan perlindungan virus Spam Scanner pada domain ini |
| `has_recipient_verification` | TIDAK | Boolean | Domain global default untuk mengharuskan penerima alias mengklik tautan verifikasi email agar email dapat mengalir |
| `ignore_mx_check` | TIDAK | Boolean | Apakah akan mengabaikan pemeriksaan data MX pada domain untuk verifikasi? Hal ini terutama berlaku bagi pengguna yang memiliki aturan konfigurasi pertukaran MX tingkat lanjut dan perlu mempertahankan pertukaran MX yang ada dan meneruskannya ke pertukaran MX kami. |
| `retention_days` | TIDAK | Nomor | Bilangan bulat antara `0` dan `30` yang sesuai dengan jumlah hari penyimpanan untuk menyimpan email SMTP keluar setelah berhasil terkirim atau mengalami kesalahan permanen. Nilai default-nya adalah `0`, yang berarti email SMTP keluar akan segera dihapus dan disunting demi keamanan Anda. |
| `bounce_webhook` | TIDAK | String (URL) atau Boolean (salah) | URL webhook `http://` atau `https://` pilihan Anda untuk menerima webhook bounce. Kami akan mengirimkan permintaan `POST` ke URL ini dengan informasi tentang kegagalan SMTP keluar (misalnya, kegagalan ringan atau berat – sehingga Anda dapat mengelola pelanggan dan mengelola email keluar secara terprogram). |
| `max_quota_per_alias` | TIDAK | Rangkaian | Kuota penyimpanan maksimum untuk alias pada nama domain ini. Masukkan nilai seperti "1 GB" yang akan diurai oleh [bytes](https://github.com/visionmedia/bytes.js). |

> Contoh Permintaan:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Hapus domain {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Mengundang {#invites}

### Terima undangan domain {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Buat undangan domain {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ya | Tali (Email) | Alamat email untuk mengundang ke daftar anggota domain |
| `group` | Ya | String (dapat dihitung) | Grup untuk menambahkan pengguna ke keanggotaan domain dengan (bisa berupa salah satu dari `"admin"` atau `"user"`) |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Jika pengguna yang diundang sudah menjadi anggota yang diterima di domain lain tempat admin yang mengundang mereka menjadi anggota, maka undangan akan diterima secara otomatis dan tidak akan ada email yang dikirim.

### Hapus undangan domain {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ya | Tali (Email) | Alamat email yang akan dihapus dari daftar anggota domain |

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Anggota {#members}

### Perbarui anggota domain {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ya | String (dapat dihitung) | Grup untuk memperbarui pengguna ke keanggotaan domain dengan (bisa berupa salah satu dari `"admin"` atau `"user"`) |

> Contoh Permintaan:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Hapus anggota domain {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Alias {#aliases}

### Hasilkan kata sandi alias {#generate-an-alias-password}

Perhatikan bahwa jika Anda tidak mengirimkan instruksi melalui email, maka nama pengguna dan kata sandi akan berada di badan respons JSON dari permintaan yang berhasil dalam format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | TIDAK | Rangkaian | Kata sandi baru khusus Anda untuk alias. Harap dicatat bahwa Anda dapat mengosongkan atau menghilangkannya sama sekali dari badan permintaan API jika Anda ingin mendapatkan kata sandi yang kuat dan dibuat secara acak. |
| `password` | TIDAK | Rangkaian | Kata sandi yang ada untuk alias untuk mengubah kata sandi tanpa menghapus penyimpanan kotak surat IMAP yang ada (lihat opsi `is_override` di bawah jika Anda tidak lagi memiliki kata sandi yang ada). |
| `is_override` | TIDAK | Boolean | **GUNAKAN DENGAN HATI-HATI**: Tindakan ini akan sepenuhnya mengganti kata sandi dan basis data alias yang ada, serta akan menghapus penyimpanan IMAP yang ada secara permanen dan mereset basis data email SQLite alias sepenuhnya. Harap buat cadangan jika memungkinkan jika Anda memiliki kotak surat yang terhubung dengan alias ini. |
| `emailed_instructions` | TIDAK | Rangkaian | Alamat email untuk mengirim kata sandi alias dan petunjuk pengaturan. |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Daftar alias domain {#list-domain-aliases}

> \[!NOTE]
> Mulai 1 November 2024, titik akhir API untuk [Daftar domain](#list-domains) dan [Daftar alias domain](#list-domain-aliases) akan menggunakan hasil maksimal `1000` per halaman secara default. Jika Anda ingin mengaktifkan perilaku ini lebih awal, Anda dapat meneruskan `?paginate=true` sebagai parameter querystring tambahan ke URL untuk kueri titik akhir. Lihat [Paginasi](#pagination) untuk informasi lebih lanjut.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parameter String Kueri | Diperlukan | Jenis | Keterangan |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | TIDAK | String (RegExp didukung) | Cari alias di domain berdasarkan nama, label, atau penerima |
| `name` | TIDAK | String (RegExp didukung) | Mencari alias di domain berdasarkan nama |
| `recipient` | TIDAK | String (RegExp didukung) | Mencari alias di domain berdasarkan penerima |
| `sort` | TIDAK | Rangkaian | Urutkan berdasarkan kolom tertentu (diawali dengan tanda hubung tunggal `-` untuk mengurutkan dalam arah yang berlawanan dengan kolom tersebut). Default-nya adalah `created_at` jika tidak diatur. |
| `page` | TIDAK | Nomor | Lihat [Pagination](#pagination) untuk wawasan lebih lanjut |
| `limit` | TIDAK | Nomor | Lihat [Pagination](#pagination) untuk wawasan lebih lanjut |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Buat alias domain baru {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | TIDAK | Rangkaian | Nama alias (jika tidak diberikan atau kosong, maka alias acak akan dibuat) |
| `recipients` | TIDAK | String atau Array | Daftar penerima (harus berupa String atau Array yang dipisahkan oleh baris baru/spasi/koma berisi alamat email yang valid, nama domain lengkap ("FQDN"), alamat IP, dan/atau URL webhook – dan jika tidak diberikan atau berupa Array kosong, maka email pengguna yang membuat permintaan API akan ditetapkan sebagai penerima) |
| `description` | TIDAK | Rangkaian | Deskripsi alias |
| `labels` | TIDAK | String atau Array | Daftar label (harus berupa String atau Array yang dipisahkan dengan jeda baris/spasi/koma) |
| `has_recipient_verification` | TIDAK | Boolean | Meminta penerima untuk mengklik tautan verifikasi email agar email dapat terkirim (default pada pengaturan domain jika tidak ditetapkan secara eksplisit di badan permintaan) |
| `is_enabled` | TIDAK | Boolean | Mengaktifkan atau menonaktifkan alias ini (jika dinonaktifkan, email tidak akan dirutekan ke mana pun tetapi akan mengembalikan kode status berhasil). Jika suatu nilai dilewatkan, nilai tersebut akan dikonversi ke boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | TIDAK | Nomor (baik `250`, `421`, atau `550`) | Email masuk ke alias ini akan ditolak jika `is_enabled` adalah `false` dengan `250` (tidak terkirim ke mana pun, misalnya lubang hitam atau `/dev/null`), `421` (penolakan sementara; dan coba lagi hingga ~5 hari), atau `550` kegagalan permanen dan penolakan. Default-nya adalah `250`. |
| `has_imap` | TIDAK | Boolean | Apakah penyimpanan IMAP untuk alias ini akan diaktifkan atau dinonaktifkan (jika dinonaktifkan, email masuk yang diterima tidak akan disimpan ke [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Jika suatu nilai dilewatkan, nilai tersebut akan dikonversi ke boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | TIDAK | Boolean | Apakah akan mengaktifkan atau menonaktifkan [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) untuk [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) menggunakan alias `public_key`. |
| `public_key` | TIDAK | Rangkaian | Kunci publik OpenPGP dalam format ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); misalnya kunci GPG untuk `support@forwardemail.net`). Ini hanya berlaku jika Anda telah menyetel `has_pgp` ke `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | TIDAK | Rangkaian | Kuota penyimpanan maksimum untuk alias ini. Kosongkan untuk mengatur ulang ke kuota maksimum domain saat ini atau masukkan nilai seperti "1 GB" yang akan diurai oleh [bytes](https://github.com/visionmedia/bytes.js). Nilai ini hanya dapat disesuaikan oleh admin domain. |
| `vacation_responder_is_enabled` | TIDAK | Boolean | Apakah akan mengaktifkan atau menonaktifkan penjawab liburan otomatis. |
| `vacation_responder_start_date` | TIDAK | Rangkaian | Tanggal mulai untuk penjawab liburan (jika diaktifkan dan tidak ada tanggal mulai yang ditetapkan di sini, maka diasumsikan sudah dimulai). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lainnya melalui penguraian cerdas menggunakan `dayjs`. |
| `vacation_responder_end_date` | TIDAK | Rangkaian | Tanggal akhir untuk penjawab liburan (jika diaktifkan dan tidak ada tanggal akhir yang ditetapkan di sini, maka diasumsikan tidak pernah berakhir dan merespons selamanya). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lainnya melalui penguraian cerdas menggunakan `dayjs`. |
| `vacation_responder_subject` | TIDAK | Rangkaian | Subjek dalam teks biasa untuk penjawab saat libur, misalnya "Di Luar Kantor". Kami menggunakan `striptags` untuk menghapus semua HTML di sini. |
| `vacation_responder_message` | TIDAK | Rangkaian | Pesan dalam teks biasa untuk penjawab saat libur, misalnya "Saya akan keluar kantor sampai Februari.". Kami menggunakan `striptags` untuk menghapus semua HTML di sini. |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Ambil alias domain {#retrieve-domain-alias}

Anda dapat mengambil alias domain berdasarkan nilai `id` atau `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Perbarui alias domain {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | TIDAK | Rangkaian | Nama alias |
| `recipients` | TIDAK | String atau Array | Daftar penerima (harus berupa String atau Array berisi alamat email yang valid, nama domain lengkap ("FQDN"), alamat IP, dan/atau URL webhook yang dipisahkan dengan baris baru/spasi/koma) |
| `description` | TIDAK | Rangkaian | Deskripsi alias |
| `labels` | TIDAK | String atau Array | Daftar label (harus berupa String atau Array yang dipisahkan dengan jeda baris/spasi/koma) |
| `has_recipient_verification` | TIDAK | Boolean | Meminta penerima untuk mengklik tautan verifikasi email agar email dapat terkirim (default pada pengaturan domain jika tidak ditetapkan secara eksplisit di badan permintaan) |
| `is_enabled` | TIDAK | Boolean | Mengaktifkan atau menonaktifkan alias ini (jika dinonaktifkan, email tidak akan dirutekan ke mana pun tetapi akan mengembalikan kode status berhasil). Jika suatu nilai dilewatkan, nilai tersebut akan dikonversi ke boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | TIDAK | Nomor (baik `250`, `421`, atau `550`) | Email masuk ke alias ini akan ditolak jika `is_enabled` adalah `false` dengan `250` (tidak terkirim ke mana pun, misalnya lubang hitam atau `/dev/null`), `421` (penolakan sementara; dan coba lagi hingga ~5 hari), atau `550` kegagalan permanen dan penolakan. Default-nya adalah `250`. |
| `has_imap` | TIDAK | Boolean | Apakah penyimpanan IMAP untuk alias ini akan diaktifkan atau dinonaktifkan (jika dinonaktifkan, email masuk yang diterima tidak akan disimpan ke [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Jika suatu nilai dilewatkan, nilai tersebut akan dikonversi ke boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | TIDAK | Boolean | Apakah akan mengaktifkan atau menonaktifkan [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) untuk [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) menggunakan alias `public_key`. |
| `public_key` | TIDAK | Rangkaian | Kunci publik OpenPGP dalam format ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); misalnya kunci GPG untuk `support@forwardemail.net`). Ini hanya berlaku jika Anda telah menyetel `has_pgp` ke `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | TIDAK | Rangkaian | Kuota penyimpanan maksimum untuk alias ini. Kosongkan untuk mengatur ulang ke kuota maksimum domain saat ini atau masukkan nilai seperti "1 GB" yang akan diurai oleh [bytes](https://github.com/visionmedia/bytes.js). Nilai ini hanya dapat disesuaikan oleh admin domain. |
| `vacation_responder_is_enabled` | TIDAK | Boolean | Apakah akan mengaktifkan atau menonaktifkan penjawab liburan otomatis. |
| `vacation_responder_start_date` | TIDAK | Rangkaian | Tanggal mulai untuk penjawab liburan (jika diaktifkan dan tidak ada tanggal mulai yang ditetapkan di sini, maka diasumsikan sudah dimulai). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lainnya melalui penguraian cerdas menggunakan `dayjs`. |
| `vacation_responder_end_date` | TIDAK | Rangkaian | Tanggal akhir untuk penjawab liburan (jika diaktifkan dan tidak ada tanggal akhir yang ditetapkan di sini, maka diasumsikan tidak pernah berakhir dan merespons selamanya). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lainnya melalui penguraian cerdas menggunakan `dayjs`. |
| `vacation_responder_subject` | TIDAK | Rangkaian | Subjek dalam teks biasa untuk penjawab saat libur, misalnya "Di Luar Kantor". Kami menggunakan `striptags` untuk menghapus semua HTML di sini. |
| `vacation_responder_message` | TIDAK | Rangkaian | Pesan dalam teks biasa untuk penjawab saat libur, misalnya "Saya akan keluar kantor sampai Februari.". Kami menggunakan `striptags` untuk menghapus semua HTML di sini. |

> Contoh Permintaan:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Hapus alias domain {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Enkripsi {#encrypt}

Kami mengizinkan Anda mengenkripsi data, bahkan dengan paket gratis, tanpa biaya. Privasi seharusnya bukan hanya sebuah fitur, melainkan sudah terintegrasi secara inheren dalam semua aspek produk. Sesuai permintaan yang tinggi pada [Diskusi Panduan Privasi](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) dan [masalah GitHub kami](https://github.com/forwardemail/forwardemail.net/issues/254), kami telah menambahkan fitur ini.

### Enkripsi Rekaman TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parameter Tubuh | Diperlukan | Jenis | Keterangan |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ya | Rangkaian | Setiap rekaman TXT teks biasa Email Terusan yang valid |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
