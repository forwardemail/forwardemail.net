# Email API {#email-api}


## Daftar Isi {#table-of-contents}

* [Perpustakaan](#libraries)
* [Base URI](#base-uri)
* [Autentikasi](#authentication)
  * [Autentikasi Token API (Direkomendasikan untuk sebagian besar endpoint)](#api-token-authentication-recommended-for-most-endpoints)
  * [Autentikasi Kredensial Alias (Untuk email keluar)](#alias-credentials-authentication-for-outbound-email)
  * [Endpoint Hanya Alias](#alias-only-endpoints)
* [Kesalahan](#errors)
* [Lokalisasi](#localization)
* [Paginasi](#pagination)
* [Log](#logs)
  * [Mengambil log](#retrieve-logs)
* [Akun](#account)
  * [Membuat akun](#create-account)
  * [Mengambil akun](#retrieve-account)
  * [Memperbarui akun](#update-account)
* [Kontak Alias (CardDAV)](#alias-contacts-carddav)
  * [Daftar kontak](#list-contacts)
  * [Membuat kontak](#create-contact)
  * [Mengambil kontak](#retrieve-contact)
  * [Memperbarui kontak](#update-contact)
  * [Menghapus kontak](#delete-contact)
* [Kalender Alias (CalDAV)](#alias-calendars-caldav)
  * [Daftar kalender](#list-calendars)
  * [Membuat kalender](#create-calendar)
  * [Mengambil kalender](#retrieve-calendar)
  * [Memperbarui kalender](#update-calendar)
  * [Menghapus kalender](#delete-calendar)
* [Pesan Alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Daftar dan cari pesan](#list-and-search-for-messages)
  * [Membuat pesan](#create-message)
  * [Mengambil pesan](#retrieve-message)
  * [Memperbarui pesan](#update-message)
  * [Menghapus pesan](#delete-message)
* [Folder Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Daftar folder](#list-folders)
  * [Membuat folder](#create-folder)
  * [Mengambil folder](#retrieve-folder)
  * [Memperbarui folder](#update-folder)
  * [Menghapus folder](#delete-folder)
  * [Menyalin folder](#copy-folder)
* [Email Keluar](#outbound-emails)
  * [Dapatkan batas email SMTP keluar](#get-outbound-smtp-email-limit)
  * [Daftar email SMTP keluar](#list-outbound-smtp-emails)
  * [Membuat email SMTP keluar](#create-outbound-smtp-email)
  * [Mengambil email SMTP keluar](#retrieve-outbound-smtp-email)
  * [Menghapus email SMTP keluar](#delete-outbound-smtp-email)
* [Domain](#domains)
  * [Daftar domain](#list-domains)
  * [Membuat domain](#create-domain)
  * [Mengambil domain](#retrieve-domain)
  * [Verifikasi catatan domain](#verify-domain-records)
  * [Verifikasi catatan SMTP domain](#verify-domain-smtp-records)
  * [Daftar kata sandi catch-all domain-wide](#list-domain-wide-catch-all-passwords)
  * [Membuat kata sandi catch-all domain-wide](#create-domain-wide-catch-all-password)
  * [Menghapus kata sandi catch-all domain-wide](#remove-domain-wide-catch-all-password)
  * [Memperbarui domain](#update-domain)
  * [Menghapus domain](#delete-domain)
* [Undangan](#invites)
  * [Terima undangan domain](#accept-domain-invite)
  * [Membuat undangan domain](#create-domain-invite)
  * [Menghapus undangan domain](#remove-domain-invite)
* [Anggota](#members)
  * [Memperbarui anggota domain](#update-domain-member)
  * [Menghapus anggota domain](#remove-domain-member)
* [Alias](#aliases)
  * [Membuat kata sandi alias](#generate-an-alias-password)
  * [Daftar alias domain](#list-domain-aliases)
  * [Membuat alias domain baru](#create-new-domain-alias)
  * [Mengambil alias domain](#retrieve-domain-alias)
  * [Memperbarui alias domain](#update-domain-alias)
  * [Menghapus alias domain](#delete-domain-alias)
* [Enkripsi](#encrypt)
  * [Enkripsi TXT Record](#encrypt-txt-record)


## Perpustakaan {#libraries}

Saat ini kami belum merilis pembungkus API apa pun, tetapi kami berencana untuk melakukannya dalam waktu dekat. Kirim email ke <api@forwardemail.net> jika Anda ingin diberitahu saat pembungkus API untuk bahasa pemrograman tertentu dirilis. Sementara itu, Anda dapat menggunakan perpustakaan permintaan HTTP yang direkomendasikan ini dalam aplikasi Anda, atau cukup gunakan [curl](https://stackoverflow.com/a/27442239/3586413) seperti pada contoh di bawah ini.

| Bahasa    | Perpustakaan                                                           |
| --------- | --------------------------------------------------------------------- |
| Ruby      | [Faraday](https://github.com/lostisland/faraday)                      |
| Python    | [requests](https://github.com/psf/requests)                           |
| Java      | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP       | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript| [superagent](https://github.com/ladjs/superagent) (kami adalah pemelihara) |
| Node.js   | [superagent](https://github.com/ladjs/superagent) (kami adalah pemelihara) |
| Go        | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET      | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## Base URI {#base-uri}

Path URI dasar HTTP saat ini adalah: `BASE_URI`.


## Autentikasi {#authentication}

Semua endpoint memerlukan autentikasi menggunakan [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Kami mendukung dua metode autentikasi:

### Autentikasi Token API (Direkomendasikan untuk sebagian besar endpoint) {#api-token-authentication-recommended-for-most-endpoints}

Tetapkan [API key](https://forwardemail.net/my-account/security) Anda sebagai nilai "username" dengan password kosong:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Perhatikan tanda titik dua (`:`) setelah token API – ini menunjukkan password kosong dalam format Basic Auth.

### Autentikasi Kredensial Alias (Untuk email keluar) {#alias-credentials-authentication-for-outbound-email}

Endpoint [Create outbound SMTP email](#create-outbound-smtp-email) juga mendukung autentikasi menggunakan alamat email alias Anda dan [password alias yang dihasilkan](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Metode ini berguna saat mengirim email dari aplikasi yang sudah menggunakan kredensial SMTP dan membuat migrasi dari SMTP ke API kami menjadi mulus.

### Endpoint Khusus Alias {#alias-only-endpoints}

Endpoint [Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), dan [Alias Folders](#alias-folders-imappop3) memerlukan kredensial alias dan tidak mendukung autentikasi token API.

Jangan khawatir – contoh diberikan di bawah ini jika Anda tidak yakin apa itu.


## Kesalahan {#errors}

Jika terjadi kesalahan, isi respons dari permintaan API akan berisi pesan kesalahan yang rinci.

| Kode | Nama                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Permintaan Buruk      |
| 401  | Tidak Terotorisasi    |
| 403  | Terlarang             |
| 404  | Tidak Ditemukan       |
| 429  | Terlalu Banyak Permintaan |
| 500  | Kesalahan Server Internal |
| 501  | Belum Diimplementasikan |
| 502  | Gerbang Buruk         |
| 503  | Layanan Tidak Tersedia |
| 504  | Waktu Tunggu Gerbang Habis |

> \[!TIP]
> Jika Anda menerima kode status 5xx (yang seharusnya tidak terjadi), silakan hubungi kami di <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> dan kami akan membantu Anda menyelesaikan masalah Anda segera.


## Lokalisasi {#localization}

Layanan kami diterjemahkan ke lebih dari 25 bahasa berbeda. Semua pesan respons API diterjemahkan ke lokal terakhir yang terdeteksi dari pengguna yang melakukan permintaan API. Anda dapat mengubah ini dengan mengirimkan header `Accept-Language` khusus. Silakan coba menggunakan pilihan bahasa di bagian bawah halaman ini.


## Paginasi {#pagination}

> \[!NOTE]
> Mulai 1 November 2024, endpoint API untuk [List domains](#list-domains) dan [List domain aliases](#list-domain-aliases) akan default ke `1000` hasil maksimal per halaman. Jika Anda ingin menggunakan perilaku ini lebih awal, Anda dapat menambahkan `?paginate=true` sebagai parameter querystring tambahan ke URL endpoint.

Paginasi didukung oleh semua endpoint API yang menampilkan daftar hasil.

Cukup berikan properti querystring `page` (dan opsional `limit`).

Properti `page` harus berupa angka yang lebih besar atau sama dengan `1`. Jika Anda memberikan `limit` (juga angka), maka nilai minimum adalah `10` dan maksimum adalah `50` (kecuali disebutkan lain).

| Parameter Querystring | Wajib | Tipe   | Deskripsi                                                                                                                                               |
| --------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Tidak  | Number | Halaman hasil yang akan dikembalikan. Jika tidak ditentukan, nilai `page` akan menjadi `1`. Harus berupa angka yang lebih besar atau sama dengan `1`.     |
| `limit`               | Tidak  | Number | Jumlah hasil yang dikembalikan per halaman. Default `10` jika tidak ditentukan. Harus berupa angka yang lebih besar atau sama dengan `1`, dan kurang dari atau sama dengan `50`. |
Untuk menentukan apakah masih ada hasil lain yang tersedia atau tidak, kami menyediakan header respons HTTP berikut (yang dapat Anda parsing untuk melakukan paginasi secara programatis):

| HTTP Response Header | Contoh                                                                                                                                                                                                                                                  | Deskripsi                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Jumlah total halaman yang tersedia.                                                                                                                                                                                                                                                                                                                             |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Halaman hasil saat ini yang dikembalikan (misalnya berdasarkan parameter querystring `page`).                                                                                                                                                                                                                                                                    |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Jumlah total hasil dalam halaman yang dikembalikan (misalnya berdasarkan parameter querystring `limit` dan hasil aktual yang dikembalikan).                                                                                                                                                                                                                        |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Jumlah total item yang tersedia di semua halaman.                                                                                                                                                                                                                                                                                                               |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Kami menyediakan header respons HTTP `Link` yang dapat Anda parsing seperti yang ditunjukkan dalam contoh. Ini [mirip dengan GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (misalnya tidak semua nilai akan disediakan jika tidak relevan atau tersedia, misalnya `"next"` tidak akan disediakan jika tidak ada halaman berikutnya). |
> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logs {#logs}

### Mengambil logs {#retrieve-logs}

API kami secara programatik memungkinkan Anda mengunduh logs untuk akun Anda. Mengirim permintaan ke endpoint ini akan memproses semua logs untuk akun Anda dan mengirimkannya melalui email sebagai lampiran (file spreadsheet [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) terkompresi [Gzip](https://en.wikipedia.org/wiki/Gzip)) setelah selesai.

Ini memungkinkan Anda membuat pekerjaan latar belakang dengan [Cron job](https://en.wikipedia.org/wiki/Cron) atau menggunakan perangkat lunak penjadwalan pekerjaan [Node.js Bree](https://github.com/breejs/bree) untuk menerima logs kapan pun Anda inginkan. Perlu dicatat bahwa endpoint ini dibatasi hingga `10` permintaan per hari.

Lampiran adalah bentuk huruf kecil dari `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` dan email itu sendiri berisi ringkasan singkat dari logs yang diambil. Anda juga dapat mengunduh logs kapan saja dari [Akun Saya → Logs](/my-account/logs)

> `GET /v1/logs/download`

| Parameter Querystring | Wajib | Tipe          | Deskripsi                                                                                                                     |
| --------------------- | ------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Tidak  | String (FQDN) | Memfilter logs berdasarkan domain yang sepenuhnya memenuhi syarat ("FQDN"). Jika Anda tidak memberikan ini maka semua logs dari semua domain akan diambil. |
| `q`                   | Tidak  | String        | Mencari logs berdasarkan email, domain, nama alias, alamat IP, atau tanggal (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, atau `M.D.YY`).       |
| `bounce_category`     | Tidak  | String        | Mencari logs berdasarkan kategori bounce tertentu (misalnya `blocklist`).                                                       |
| `response_code`       | Tidak  | Number        | Mencari logs berdasarkan kode respons error tertentu (misalnya `421` atau `550`).                                              |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Contoh Cron job (pada tengah malam setiap hari):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Perlu dicatat bahwa Anda dapat menggunakan layanan seperti [Crontab.guru](https://crontab.guru/) untuk memvalidasi sintaks ekspresi cron job Anda.

> Contoh Cron job (pada tengah malam setiap hari **dan dengan logs untuk hari sebelumnya**):

Untuk MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Untuk Linux dan Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Akun {#account}

### Membuat akun {#create-account}

> `POST /v1/account`

| Parameter Body | Wajib | Tipe           | Deskripsi     |
| -------------- | ------ | -------------- | ------------- |
| `email`        | Ya     | String (Email) | Alamat email  |
| `password`     | Ya     | String         | Kata sandi    |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Mengambil akun {#retrieve-account}

> `GET /v1/account`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Memperbarui akun {#update-account}

> `PUT /v1/account`

| Parameter Body | Wajib | Tipe           | Deskripsi           |
| -------------- | ------ | -------------- | ------------------- |
| `email`        | Tidak  | String (Email) | Alamat email        |
| `given_name`   | Tidak  | String         | Nama depan          |
| `family_name`  | Tidak  | String         | Nama belakang       |
| `avatar_url`   | Tidak  | String (URL)   | Tautan ke gambar avatar |

> Contoh Permintaan:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Kontak Alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Berbeda dengan endpoint API lainnya, ini memerlukan [Autentikasi](#authentication) "username" yang sama dengan nama pengguna alias dan "password" yang sama dengan kata sandi yang dihasilkan alias sebagai header Otorisasi Dasar (Basic Authorization).
> \[!WARNING]
> Bagian endpoint ini masih dalam proses pengerjaan dan diharapkan akan dirilis pada tahun 2024. Sementara itu, silakan gunakan klien IMAP dari dropdown "Apps" di navigasi situs web kami.

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


## Kalender Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Berbeda dengan endpoint API lainnya, ini memerlukan [Authentication](#authentication) "username" yang sama dengan username alias dan "password" yang sama dengan password alias yang dihasilkan sebagai header Basic Authorization.

> \[!WARNING]
> Bagian endpoint ini masih dalam proses pengerjaan dan diharapkan akan dirilis pada tahun 2024. Sementara itu, silakan gunakan klien IMAP dari dropdown "Apps" di navigasi situs web kami.

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
> Berbeda dengan endpoint API lainnya, ini memerlukan [Authentication](#authentication) "username" yang sama dengan username alias dan "password" yang sama dengan password alias yang dihasilkan sebagai header Basic Authorization.

> \[!WARNING]
> Bagian endpoint ini masih dalam proses pengerjaan dan diharapkan akan dirilis pada tahun 2024. Sementara itu, silakan gunakan klien IMAP dari dropdown "Apps" di navigasi situs web kami.

Pastikan Anda telah mengikuti instruksi pengaturan untuk domain Anda.

Instruksi ini dapat ditemukan di bagian FAQ kami [Apakah Anda mendukung penerimaan email dengan IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Daftar dan cari pesan {#list-and-search-for-messages}

> `GET /v1/messages`

**Segera hadir**

### Buat pesan {#create-message}

> \[!NOTE]
> Ini **TIDAK** akan mengirim email – ini hanya akan menambahkan pesan ke folder kotak surat Anda (misalnya ini mirip dengan perintah IMAP `APPEND`). Jika Anda ingin mengirim email, lihat [Buat email SMTP keluar](#create-outbound-smtp-email) di bawah. Setelah membuat email SMTP keluar, Anda dapat menambahkan salinannya menggunakan endpoint ini ke kotak surat alias Anda untuk tujuan penyimpanan.

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
> Endpoint folder dengan path folder <code>/v1/folders/:path</code> sebagai endpoint mereka dapat dipertukarkan dengan ID folder <code>:id</code>. Ini berarti Anda dapat merujuk folder dengan nilai <code>path</code> atau <code>id</code>.

> \[!WARNING]
> Bagian endpoint ini masih dalam proses pengerjaan dan diharapkan akan dirilis pada tahun 2024. Sementara itu, silakan gunakan klien IMAP dari dropdown "Apps" di navigasi situs web kami.

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

Pastikan Anda telah mengikuti instruksi pengaturan untuk domain Anda.

Instruksi ini dapat ditemukan di [Akun Saya → Domain → Pengaturan → Konfigurasi SMTP Keluar](/my-account/domains). Anda perlu memastikan pengaturan DKIM, Return-Path, dan DMARC untuk pengiriman SMTP keluar dengan domain Anda.
### Dapatkan batas email SMTP keluar {#get-outbound-smtp-email-limit}

Ini adalah endpoint sederhana yang mengembalikan objek JSON yang berisi `count` dan `limit` untuk jumlah pesan SMTP keluar harian berdasarkan per akun.

> `GET /v1/emails/limit`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Daftar email SMTP keluar {#list-outbound-smtp-emails}

Perlu dicatat bahwa endpoint ini tidak mengembalikan nilai properti untuk `message`, `headers`, maupun `rejectedErrors` dari sebuah email.

Untuk mengembalikan properti dan nilainya tersebut, silakan gunakan endpoint [Retrieve email](#retrieve-email) dengan ID email.

> `GET /v1/emails`

| Parameter Querystring | Wajib | Tipe                      | Deskripsi                                                                                                                                      |
| --------------------- | ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Tidak  | String (RegExp didukung)  | Cari email berdasarkan metadata                                                                                                                 |
| `domain`              | Tidak  | String (RegExp didukung)  | Cari email berdasarkan nama domain                                                                                                              |
| `sort`                | Tidak  | String                    | Urutkan berdasarkan bidang tertentu (awali dengan tanda minus `-` untuk mengurutkan dalam arah terbalik dari bidang tersebut). Default ke `created_at` jika tidak diatur. |
| `page`                | Tidak  | Number                    | Lihat [Pagination](#pagination) untuk penjelasan lebih lanjut                                                                                   |
| `limit`               | Tidak  | Number                    | Lihat [Pagination](#pagination) untuk penjelasan lebih lanjut                                                                                   |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Buat email SMTP keluar {#create-outbound-smtp-email}

API kami untuk membuat email terinspirasi dan memanfaatkan konfigurasi opsi pesan Nodemailer. Silakan merujuk ke [konfigurasi pesan Nodemailer](https://nodemailer.com/message/) untuk semua parameter body di bawah ini.

Perlu dicatat bahwa kecuali `envelope` dan `dkim` (karena kami mengaturnya secara otomatis untuk Anda), kami mendukung semua opsi Nodemailer. Kami secara otomatis mengatur opsi `disableFileAccess` dan `disableUrlAccess` ke `true` demi keamanan.

Anda harus mengirimkan opsi tunggal `raw` dengan email mentah lengkap Anda termasuk header **atau** mengirimkan opsi parameter body individual di bawah ini.

Endpoint API ini akan secara otomatis mengkodekan emoji untuk Anda jika ditemukan di header (misalnya baris subjek `Subject: 🤓 Hello` akan dikonversi menjadi `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` secara otomatis). Tujuan kami adalah membuat API email yang sangat ramah pengembang dan mudah digunakan.

**Otentikasi:** Endpoint ini mendukung baik [otentikasi token API](#api-token-authentication-recommended-for-most-endpoints) maupun [otentikasi kredensial alias](#alias-credentials-authentication-for-outbound-email). Lihat bagian [Authentication](#authentication) di atas untuk detailnya.

> `POST /v1/emails`

| Parameter Body   | Wajib | Tipe             | Deskripsi                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Tidak  | String (Email)   | Alamat email pengirim (harus ada sebagai alias dari domain).                                                                                                                                                                                                                                                                                                                                                                                                |
| `to`             | Tidak  | String atau Array| Daftar penerima yang dipisahkan koma atau Array untuk header "To".                                                                                                                                                                                                                                                                                                                                                                                           |
| `cc`             | Tidak  | String atau Array| Daftar penerima yang dipisahkan koma atau Array untuk header "Cc".                                                                                                                                                                                                                                                                                                                                                                                           |
| `bcc`            | Tidak  | String atau Array| Daftar penerima yang dipisahkan koma atau Array untuk header "Bcc".                                                                                                                                                                                                                                                                                                                                                                                          |
| `subject`        | Tidak  | String           | Subjek email.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `text`           | Tidak  | String atau Buffer| Versi pesan dalam teks biasa.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `html`           | Tidak  | String atau Buffer| Versi pesan dalam HTML.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachments`    | Tidak  | Array            | Array objek lampiran (lihat [bidang umum Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                           |
| `sender`         | Tidak  | String           | Alamat email untuk header "Sender" (lihat [bidang lebih lanjut Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                            |
| `replyTo`        | Tidak  | String           | Alamat email untuk header "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `inReplyTo`      | Tidak  | String           | Message-ID yang dibalas oleh pesan ini.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`     | Tidak  | String atau Array| Daftar Message-ID yang dipisahkan spasi atau Array.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `attachDataUrls` | Tidak  | Boolean          | Jika `true` maka mengonversi gambar `data:` dalam konten HTML pesan menjadi lampiran yang disematkan.                                                                                                                                                                                                                                                                                                                                                         |
| `watchHtml`      | Tidak  | String           | Versi HTML khusus Apple Watch dari pesan ([menurut dokumentasi Nodemailer](https://nodemailer.com/message/#content-options]), jam tangan terbaru tidak memerlukan ini diatur).                                                                                                                                                                                                                                                                                 |
| `amp`            | Tidak  | String           | Versi HTML khusus AMP4EMAIL dari pesan (lihat [contoh Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                               |
| `icalEvent`      | Tidak  | Object           | Event iCalendar yang digunakan sebagai konten pesan alternatif (lihat [event kalender Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                         |
| `alternatives`   | Tidak  | Array            | Array konten pesan alternatif (lihat [konten alternatif Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                            |
| `encoding`       | Tidak  | String           | Encoding untuk string teks dan HTML (default `"utf-8"`, juga mendukung nilai encoding `"hex"` dan `"base64"`).                                                                                                                                                                                                                                                                                                                                                 |
| `raw`            | Tidak  | String atau Buffer| Pesan format RFC822 yang dibuat khusus untuk digunakan (menggantikan yang dibuat oleh Nodemailer – lihat [sumber khusus Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                          |
| `textEncoding`   | Tidak  | String           | Encoding yang dipaksa digunakan untuk nilai teks (baik `"quoted-printable"` atau `"base64"`). Nilai default adalah nilai terdekat yang terdeteksi (untuk ASCII gunakan `"quoted-printable"`).                                                                                                                                                                                                                                                               |
| `priority`       | Tidak  | String           | Tingkat prioritas untuk email (bisa `"high"`, `"normal"` (default), atau `"low"`). Perlu dicatat bahwa nilai `"normal"` tidak mengatur header prioritas (ini adalah perilaku default). Jika nilai `"high"` atau `"low"` diatur, maka header `X-Priority`, `X-MSMail-Priority`, dan `Importance` [akan diatur sesuai](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Tidak  | Object atau Array| Object atau Array dari field header tambahan yang akan diatur (lihat [header khusus Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                              |
| `messageId`      | Tidak  | String           | Nilai Message-ID opsional untuk header "Message-ID" (nilai default akan dibuat secara otomatis jika tidak diatur – catatan bahwa nilai harus [mematuhi spesifikasi RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                             |
| `date`           | Tidak  | String atau Date | Nilai Date opsional yang akan digunakan jika header Date hilang setelah parsing, jika tidak diatur maka string UTC saat ini akan digunakan. Header tanggal tidak boleh lebih dari 30 hari di masa depan dari waktu saat ini.                                                                                                                                                                                                                                   |
| `list`           | Tidak  | Object           | Object opsional dari header `List-*` (lihat [header list Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                            |
> Contoh Permintaan (Token API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Contoh Permintaan (Kredensial Alias):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Contoh Permintaan (Email Mentah):

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

Penghapusan email akan mengatur status menjadi `"rejected"` (dan selanjutnya tidak memprosesnya dalam antrean) jika dan hanya jika status saat ini adalah salah satu dari `"pending"`, `"queued"`, atau `"deferred"`. Kami dapat menghapus email secara otomatis setelah 30 hari sejak dibuat dan/atau dikirim – oleh karena itu Anda harus menyimpan salinan email SMTP keluar di klien, basis data, atau aplikasi Anda. Anda dapat merujuk nilai ID email kami di basis data Anda jika diinginkan – nilai ini dikembalikan dari kedua endpoint [Buat email](#create-email) dan [Ambil email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domain {#domains}

> \[!TIP]
> Endpoint domain dengan nama domain <code>/v1/domains/:domain_name</code> sebagai endpoint mereka dapat dipertukarkan dengan ID domain <code>:domain_id</code>. Ini berarti Anda dapat merujuk domain baik dengan <code>name</code> atau <code>id</code>.

### Daftar domain {#list-domains}

> \[!NOTE]
> Mulai 1 November 2024, endpoint API untuk [Daftar domain](#list-domains) dan [Daftar alias domain](#list-domain-aliases) akan default ke `1000` hasil maksimal per halaman. Jika Anda ingin memilih perilaku ini lebih awal, Anda dapat menambahkan `?paginate=true` sebagai parameter querystring tambahan ke URL untuk query endpoint. Lihat [Pagination](#pagination) untuk informasi lebih lanjut.

> `GET /v1/domains`

| Parameter Querystring | Wajib | Tipe                      | Deskripsi                                                                                                                                      |
| --------------------- | ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Tidak  | String (RegExp didukung)  | Cari domain berdasarkan nama                                                                                                                   |
| `name`                | Tidak  | String (RegExp didukung)  | Cari domain berdasarkan nama                                                                                                                   |
| `sort`                | Tidak  | String                    | Urutkan berdasarkan bidang tertentu (awali dengan tanda minus `-` untuk mengurutkan dalam arah terbalik dari bidang tersebut). Default ke `created_at` jika tidak diatur. |
| `page`                | Tidak  | Number                    | Lihat [Pagination](#pagination) untuk informasi lebih lanjut                                                                                   |
| `limit`               | Tidak  | Number                    | Lihat [Pagination](#pagination) untuk informasi lebih lanjut                                                                                   |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Buat domain {#create-domain}

> `POST /v1/domains`

| Parameter Body                 | Wajib | Tipe                                          | Deskripsi                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | ------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Ya     | String (FQDN atau IP)                         | Nama domain lengkap ("FQDN") atau alamat IP                                                                                                                                                                                                                                                                       |
| `team_domain`                  | Tidak  | String (ID domain atau nama domain; FQDN)    | Secara otomatis menetapkan domain ini ke tim yang sama dari domain lain. Ini berarti semua anggota dari domain ini akan ditetapkan sebagai anggota tim, dan `plan` juga akan otomatis disetel ke `team`. Anda dapat mengaturnya ke `"none"` jika perlu untuk menonaktifkan secara eksplisit, tapi itu tidak wajib.       |
| `plan`                         | Tidak  | String (enumerable)                           | Jenis paket (harus `"free"`, `"enhanced_protection"`, atau `"team"`, default ke `"free"` atau paket berbayar pengguna saat ini jika ada)                                                                                                                                                                           |
| `catchall`                     | Tidak  | String (alamat email terpisah) atau Boolean  | Membuat alias catch-all default, default `true` (jika `true` akan menggunakan alamat email pengguna API sebagai penerima, dan jika `false` tidak akan membuat catch-all). Jika String diberikan, maka itu adalah daftar alamat email yang dipisahkan (dipisah dengan baris baru, spasi, dan/atau koma) sebagai penerima |
| `has_adult_content_protection` | Tidak  | Boolean                                       | Apakah mengaktifkan perlindungan konten dewasa Spam Scanner pada domain ini                                                                                                                                                                                                                                         |
| `has_phishing_protection`      | Tidak  | Boolean                                       | Apakah mengaktifkan perlindungan phishing Spam Scanner pada domain ini                                                                                                                                                                                                                                              |
| `has_executable_protection`    | Tidak  | Boolean                                       | Apakah mengaktifkan perlindungan executable Spam Scanner pada domain ini                                                                                                                                                                                                                                            |
| `has_virus_protection`         | Tidak  | Boolean                                       | Apakah mengaktifkan perlindungan virus Spam Scanner pada domain ini                                                                                                                                                                                                                                                 |
| `has_recipient_verification`   | Tidak  | Boolean                                       | Default global domain untuk apakah penerima alias harus mengklik tautan verifikasi email agar email dapat diteruskan                                                                                                                                                                                               |
| `ignore_mx_check`              | Tidak  | Boolean                                       | Apakah mengabaikan pemeriksaan catatan MX pada domain untuk verifikasi. Ini terutama untuk pengguna yang memiliki aturan konfigurasi pertukaran MX lanjutan dan perlu mempertahankan pertukaran MX mereka yang ada dan meneruskannya ke kami.                                                                        |
| `retention_days`               | Tidak  | Number                                        | Integer antara `0` dan `30` yang menunjukkan jumlah hari retensi untuk menyimpan email SMTP keluar setelah berhasil dikirim atau mengalami kesalahan permanen. Default `0`, yang berarti email SMTP keluar akan segera dihapus dan disunting demi keamanan Anda.                                                  |
| `bounce_webhook`               | Tidak  | String (URL) atau Boolean (false)             | URL webhook `http://` atau `https://` pilihan Anda untuk mengirim webhook bounce. Kami akan mengirim permintaan `POST` ke URL ini dengan informasi kegagalan SMTP keluar (misalnya kegagalan lunak atau keras – sehingga Anda dapat mengelola pelanggan dan mengelola email keluar secara programatik).               |
| `max_quota_per_alias`          | Tidak  | String                                        | Kuota maksimum penyimpanan untuk alias pada nama domain ini. Masukkan nilai seperti "1 GB" yang akan diparsing oleh [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                              |
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

### Verifikasi catatan domain {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifikasi catatan SMTP domain {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Daftar kata sandi catch-all domain {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Buat kata sandi catch-all domain {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parameter Body | Wajib | Tipe   | Deskripsi                                                                                                                                                                                                                   |
| -------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Tidak  | String | Kata sandi baru kustom Anda untuk digunakan sebagai kata sandi catch-all domain.  Perlu dicatat bahwa Anda dapat membiarkannya kosong atau tidak menyertakannya sama sekali dalam body permintaan API jika ingin mendapatkan kata sandi yang dihasilkan secara acak dan kuat.  Kata sandi kotak surat khusus harus berjumlah 128 karakter atau kurang, tidak boleh diawali atau diakhiri dengan spasi, dan tidak boleh mengandung tanda kutip atau apostrof. Kata sandi catch-all hanya untuk pengiriman SMTP. Untuk akses IMAP, POP3, CalDAV, CardDAV, dan kotak surat, buat kata sandi untuk alias spesifik. |
| `description`  | Tidak  | String | Deskripsi hanya untuk tujuan organisasi.                                                                                                                                                                                   |

> Contoh Permintaan:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Hapus kata sandi catch-all domain {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Perbarui domain {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parameter Body                | Wajib | Tipe                            | Deskripsi                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                  | Tidak  | String atau Number              | Port kustom untuk konfigurasi penerusan SMTP (default adalah `"25"`)                                                                                                                                                                                                                         |
| `has_adult_content_protection` | Tidak  | Boolean                         | Apakah mengaktifkan perlindungan konten dewasa Spam Scanner pada domain ini                                                                                                                                                                                                                  |
| `has_phishing_protection`    | Tidak  | Boolean                         | Apakah mengaktifkan perlindungan phishing Spam Scanner pada domain ini                                                                                                                                                                                                                       |
| `has_executable_protection`  | Tidak  | Boolean                         | Apakah mengaktifkan perlindungan executable Spam Scanner pada domain ini                                                                                                                                                                                                                     |
| `has_virus_protection`       | Tidak  | Boolean                         | Apakah mengaktifkan perlindungan virus Spam Scanner pada domain ini                                                                                                                                                                                                                          |
| `has_recipient_verification` | Tidak  | Boolean                         | Default global domain untuk apakah mengharuskan penerima alias mengklik tautan verifikasi email agar email dapat diteruskan                                                                                                                                                                  |
| `ignore_mx_check`            | Tidak  | Boolean                         | Apakah mengabaikan pemeriksaan catatan MX pada domain untuk verifikasi.  Ini terutama untuk pengguna yang memiliki aturan konfigurasi pertukaran MX lanjutan dan perlu mempertahankan pertukaran MX mereka yang ada dan meneruskannya ke kami.                                               |
| `retention_days`             | Tidak  | Number                          | Integer antara `0` dan `30` yang menunjukkan jumlah hari retensi untuk menyimpan email SMTP keluar setelah berhasil dikirim atau terjadi kesalahan permanen.  Defaultnya `0`, yang berarti email SMTP keluar akan segera dihapus dan disunting demi keamanan Anda.                          |
| `bounce_webhook`             | Tidak  | String (URL) atau Boolean (false) | URL webhook `http://` atau `https://` pilihan Anda untuk mengirim webhook bounce.  Kami akan mengirim permintaan `POST` ke URL ini dengan informasi kegagalan SMTP keluar (misalnya kegagalan lunak atau keras – sehingga Anda dapat mengelola pelanggan dan mengelola email keluar secara programatik). |
| `max_quota_per_alias`        | Tidak  | String                          | Kuota maksimum penyimpanan untuk alias pada nama domain ini.  Masukkan nilai seperti "1 GB" yang akan diparsing oleh [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                     |
> Contoh Permintaan:

```sh
curl -X PUT BASE_URI/v1/domains/NAMA_DOMAIN \
  -u API_TOKEN:
```

### Hapus domain {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Undangan {#invites}

### Terima undangan domain {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Buat undangan domain {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parameter Body | Wajib | Tipe                | Deskripsi                                                                               |
| -------------- | ------ | ------------------- | --------------------------------------------------------------------------------------- |
| `email`        | Ya     | String (Email)      | Alamat email untuk mengundang ke daftar anggota domain                                  |
| `group`        | Ya     | String (enumerable) | Grup untuk menambahkan pengguna ke keanggotaan domain (bisa salah satu dari `"admin"` atau `"user"`) |

> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Jika pengguna yang diundang sudah menjadi anggota yang diterima dari domain lain yang juga menjadi anggota admin yang mengundang, maka undangan akan otomatis diterima dan tidak mengirim email.

### Hapus undangan domain {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parameter Body | Wajib | Tipe           | Deskripsi                                      |
| -------------- | ------ | -------------- | ---------------------------------------------- |
| `email`        | Ya     | String (Email) | Alamat email yang akan dihapus dari daftar anggota domain |

> Contoh Permintaan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Anggota {#members}

### Perbarui anggota domain {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parameter Body | Wajib | Tipe                | Deskripsi                                                                                  |
| -------------- | ------ | ------------------- | ------------------------------------------------------------------------------------------ |
| `group`        | Ya     | String (enumerable) | Grup untuk memperbarui pengguna ke keanggotaan domain (bisa salah satu dari `"admin"` atau `"user"`) |

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

### Buat kata sandi alias {#generate-an-alias-password}

Perlu dicatat bahwa jika Anda tidak mengirim instruksi melalui email, maka nama pengguna dan kata sandi akan ada di dalam body respons JSON dari permintaan yang berhasil dalam format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parameter Body         | Wajib | Tipe    | Deskripsi                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Tidak  | String  | Kata sandi baru kustom yang ingin Anda gunakan untuk alias. Perlu dicatat bahwa Anda dapat membiarkannya kosong atau tidak menyertakannya sama sekali dalam body permintaan API jika Anda ingin mendapatkan kata sandi yang dihasilkan secara acak dan kuat.                                                                  Kata sandi kotak surat khusus harus berjumlah 128 karakter atau kurang, tidak boleh diawali atau diakhiri dengan spasi, dan tidak boleh mengandung tanda kutip atau apostrof. |
| `password`             | Tidak  | String  | Kata sandi yang ada untuk alias guna mengubah kata sandi tanpa menghapus penyimpanan mailbox IMAP yang ada (lihat opsi `is_override` di bawah jika Anda tidak lagi memiliki kata sandi yang ada).                                                                                                                 |
| `is_override`          | Tidak  | Boolean | **GUNAKAN DENGAN HATI-HATI**: Ini akan menimpa kata sandi alias yang ada dan database sepenuhnya, serta akan menghapus secara permanen penyimpanan IMAP yang ada dan mereset database email SQLite alias sepenuhnya. Harap buat cadangan jika memungkinkan jika Anda memiliki mailbox yang terhubung dengan alias ini. |
| `emailed_instructions` | Tidak  | String  | Alamat email untuk mengirim kata sandi alias dan instruksi pengaturannya.                                                                                                                                                                                                                                |
> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains/NAMA_DOMAIN/aliases/ID_ALIAS/generate-password \
  -u API_TOKEN:
```

### Daftar alias domain {#list-domain-aliases}

> \[!NOTE]
> Mulai 1 November 2024, endpoint API untuk [Daftar domain](#list-domains) dan [Daftar alias domain](#list-domain-aliases) akan default ke `1000` hasil maksimal per halaman. Jika Anda ingin memilih perilaku ini lebih awal, Anda dapat menambahkan `?paginate=true` sebagai parameter querystring tambahan ke URL untuk query endpoint tersebut. Lihat [Pagination](#pagination) untuk informasi lebih lanjut.

> `GET /v1/domains/NAMA_DOMAIN/aliases`

| Parameter Querystring | Wajib | Tipe                      | Deskripsi                                                                                                                                      |
| --------------------- | ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Tidak  | String (RegExp didukung)  | Cari alias dalam domain berdasarkan nama, label, atau penerima                                                                                   |
| `name`                | Tidak  | String (RegExp didukung)  | Cari alias dalam domain berdasarkan nama                                                                                                        |
| `recipient`           | Tidak  | String (RegExp didukung)  | Cari alias dalam domain berdasarkan penerima                                                                                                   |
| `sort`                | Tidak  | String                   | Urutkan berdasarkan field tertentu (awali dengan tanda minus `-` untuk mengurutkan secara terbalik). Default ke `created_at` jika tidak diatur. |
| `page`                | Tidak  | Number                   | Lihat [Pagination](#pagination) untuk informasi lebih lanjut                                                                                   |
| `limit`               | Tidak  | Number                   | Lihat [Pagination](#pagination) untuk informasi lebih lanjut                                                                                   |

> Contoh Permintaan:

```sh
curl BASE_URI/v1/domains/NAMA_DOMAIN/aliases?pagination=true \
  -u API_TOKEN:
```

### Buat alias domain baru {#create-new-domain-alias}

> `POST /v1/domains/NAMA_DOMAIN/aliases`

| Parameter Body                  | Wajib | Tipe                                   | Deskripsi                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Tidak  | String                                 | Nama alias (jika tidak diberikan atau kosong, maka alias acak akan dibuat)                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Tidak  | String atau Array                      | Daftar penerima (harus berupa String yang dipisahkan oleh baris baru/spasi/koma atau Array dari alamat email valid, nama domain lengkap ("FQDN"), alamat IP, dan/atau URL webhook – dan jika tidak diberikan atau Array kosong, maka email pengguna yang membuat permintaan API akan diatur sebagai penerima)                                                                                     |
| `description`                   | Tidak  | String                                 | Deskripsi alias                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Tidak  | String atau Array                      | Daftar label (harus berupa String yang dipisahkan oleh baris baru/spasi/koma atau Array)                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | Tidak  | Boolean                                | Meminta penerima untuk mengklik tautan verifikasi email agar email dapat diteruskan (default mengikuti pengaturan domain jika tidak diatur secara eksplisit dalam body permintaan)                                                                                                                                                                                                        |
| `is_enabled`                    | Tidak  | Boolean                                | Apakah alias ini diaktifkan atau dinonaktifkan (jika dinonaktifkan, email akan diarahkan ke mana pun tapi mengembalikan kode status berhasil). Jika nilai diberikan, akan dikonversi ke boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | Tidak  | Number (baik `250`, `421`, atau `550`) | Email masuk ke alias ini akan ditolak jika `is_enabled` adalah `false` dengan kode `250` (diam-diam tidak dikirim ke mana pun, misalnya blackhole atau `/dev/null`), `421` (penolakan sementara; dan akan dicoba ulang hingga ~5 hari) atau `550` (gagal permanen dan ditolak). Default adalah `250`.                                                                                                                               |
| `has_imap`                      | Tidak  | Boolean                                | Apakah mengaktifkan atau menonaktifkan penyimpanan IMAP untuk alias ini (jika dinonaktifkan, email masuk yang diterima tidak akan disimpan ke [penyimpanan IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Jika nilai diberikan, akan dikonversi ke boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | Tidak  | Boolean                                | Apakah mengaktifkan atau menonaktifkan [enkripsi OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) untuk [penyimpanan email terenkripsi IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) menggunakan `public_key` alias.                                                                                                         |
| `public_key`                    | Tidak  | String                                 | Kunci publik OpenPGP dalam format ASCII Armor ([klik di sini untuk melihat contoh](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); misalnya kunci GPG untuk `support@forwardemail.net`). Ini hanya berlaku jika `has_pgp` diatur ke `true`. [Pelajari lebih lanjut tentang enkripsi end-to-end di FAQ kami](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Tidak  | String                                 | Kuota penyimpanan maksimum untuk alias ini. Kosongkan untuk mengatur ulang ke kuota maksimum domain saat ini atau masukkan nilai seperti "1 GB" yang akan diparsing oleh [bytes](https://github.com/visionmedia/bytes.js). Nilai ini hanya dapat diubah oleh admin domain.                                                                                                                                      |
| `vacation_responder_is_enabled` | Tidak  | Boolean                                | Apakah mengaktifkan atau menonaktifkan penjawab otomatis saat liburan.                                                                                                                                                                                                                                                                                                                       |
| `vacation_responder_start_date` | Tidak  | String                                 | Tanggal mulai penjawab liburan (jika diaktifkan dan tidak ada tanggal mulai yang diatur di sini, maka diasumsikan sudah dimulai). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lain melalui parsing cerdas menggunakan `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | Tidak  | String                                 | Tanggal berakhir penjawab liburan (jika diaktifkan dan tidak ada tanggal berakhir yang diatur di sini, maka diasumsikan tidak pernah berakhir dan akan merespons selamanya). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lain melalui parsing cerdas menggunakan `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | Tidak  | String                                 | Subjek dalam teks biasa untuk penjawab liburan, misalnya "Out of Office". Kami menggunakan `striptags` untuk menghapus semua HTML di sini.                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | Tidak  | String                                 | Pesan dalam teks biasa untuk penjawab liburan, misalnya "Saya akan keluar kantor sampai Februari.". Kami menggunakan `striptags` untuk menghapus semua HTML di sini.                                                                                                                                                                                                                                               |
> Contoh Permintaan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Mengambil alias domain {#retrieve-domain-alias}

Anda dapat mengambil alias domain baik berdasarkan `id` atau nilai `name`-nya.

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

### Memperbarui alias domain {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parameter Body                  | Wajib    | Tipe                                   | Deskripsi                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Tidak    | String                                 | Nama alias                                                                                                                                                                                                                                                                                                                                                                                |
| `recipients`                    | Tidak    | String atau Array                      | Daftar penerima (harus berupa String yang dipisahkan oleh baris baru/spasi/koma atau Array dari alamat email yang valid, nama domain lengkap ("FQDN"), alamat IP, dan/atau URL webhook)                                                                                                                                                                                                   |
| `description`                   | Tidak    | String                                 | Deskripsi alias                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Tidak    | String atau Array                      | Daftar label (harus berupa String yang dipisahkan oleh baris baru/spasi/koma atau Array)                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | Tidak    | Boolean                                | Memerlukan penerima untuk mengklik tautan verifikasi email agar email dapat diteruskan (default mengikuti pengaturan domain jika tidak secara eksplisit diatur dalam body permintaan)                                                                                                                                                                                                     |
| `is_enabled`                    | Tidak    | Boolean                                | Apakah alias ini diaktifkan atau dinonaktifkan (jika dinonaktifkan, email tidak akan diarahkan ke mana pun tetapi mengembalikan kode status berhasil). Jika nilai diberikan, akan dikonversi menjadi boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                     |
| `error_code_if_disabled`        | Tidak    | Angka (baik `250`, `421`, atau `550`) | Email masuk ke alias ini akan ditolak jika `is_enabled` adalah `false` dengan kode `250` (diam-diam tidak dikirim ke mana pun, misalnya blackhole atau `/dev/null`), `421` (penolakan sementara; dan akan dicoba ulang selama ~5 hari) atau `550` kegagalan permanen dan penolakan. Default adalah `250`.                                                                                     |
| `has_imap`                      | Tidak    | Boolean                                | Apakah mengaktifkan atau menonaktifkan penyimpanan IMAP untuk alias ini (jika dinonaktifkan, maka email masuk yang diterima tidak akan disimpan ke [penyimpanan IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Jika nilai diberikan, akan dikonversi menjadi boolean menggunakan [boolean](https://github.com/thenativeweb/boolean#quick-start))                                         |
| `has_pgp`                       | Tidak    | Boolean                                | Apakah mengaktifkan atau menonaktifkan [enkripsi OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) untuk [penyimpanan email terenkripsi IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) menggunakan `public_key` alias.                                                                                         |
| `public_key`                    | Tidak    | String                                 | Kunci publik OpenPGP dalam format ASCII Armor ([klik di sini untuk melihat contoh](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); misalnya kunci GPG untuk `support@forwardemail.net`). Ini hanya berlaku jika Anda mengatur `has_pgp` ke `true`. [Pelajari lebih lanjut tentang enkripsi end-to-end di FAQ kami](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Tidak    | String                                 | Kuota maksimum penyimpanan untuk alias ini. Kosongkan untuk mengatur ulang ke kuota maksimum domain saat ini atau masukkan nilai seperti "1 GB" yang akan diurai oleh [bytes](https://github.com/visionmedia/bytes.js). Nilai ini hanya dapat diubah oleh admin domain.                                                                                                                  |
| `vacation_responder_is_enabled` | Tidak    | Boolean                                | Apakah mengaktifkan atau menonaktifkan penjawab otomatis saat liburan.                                                                                                                                                                                                                                                                                                                     |
| `vacation_responder_start_date` | Tidak    | String                                 | Tanggal mulai untuk penjawab liburan (jika diaktifkan dan tidak ada tanggal mulai yang diatur di sini, maka diasumsikan sudah dimulai). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lain melalui parsing cerdas menggunakan `dayjs`.                                                                                                            |
| `vacation_responder_end_date`   | Tidak    | String                                 | Tanggal berakhir untuk penjawab liburan (jika diaktifkan dan tidak ada tanggal berakhir yang diatur di sini, maka diasumsikan tidak pernah berakhir dan akan merespons selamanya). Kami mendukung format tanggal seperti `MM/DD/YYYY`, `YYYY-MM-DD`, dan format tanggal lain melalui parsing cerdas menggunakan `dayjs`.                                                                 |
| `vacation_responder_subject`    | Tidak    | String                                 | Subjek dalam teks biasa untuk penjawab liburan, misalnya "Out of Office". Kami menggunakan `striptags` untuk menghapus semua HTML di sini.                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | Tidak    | String                                 | Pesan dalam teks biasa untuk penjawab liburan, misalnya "Saya akan keluar kantor sampai Februari.". Kami menggunakan `striptags` untuk menghapus semua HTML di sini.                                                                                                                                                                                                                     |
> Permintaan Contoh:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Hapus alias domain {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Permintaan Contoh:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Enkripsi {#encrypt}

Kami memungkinkan Anda untuk mengenkripsi catatan bahkan pada paket gratis tanpa biaya. Privasi seharusnya bukan fitur, melainkan harus secara inheren terbangun di semua aspek produk. Sebagaimana sangat diminta dalam [diskusi Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) dan pada [isu GitHub kami](https://github.com/forwardemail/forwardemail.net/issues/254) kami telah menambahkannya.

### Enkripsi Catatan TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parameter Body | Wajib | Tipe   | Deskripsi                                  |
| -------------- | ------ | ------ | -------------------------------------------- |
| `input`        | Ya     | String | Catatan TXT plaintext Forward Email yang valid |

> Permintaan Contoh:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
