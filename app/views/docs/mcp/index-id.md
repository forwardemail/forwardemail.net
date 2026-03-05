# Server MCP Forward Email

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">Server MCP open-source</a> kami memungkinkan asisten AI seperti Claude, ChatGPT, Cursor, dan Windsurf mengelola email, domain, alias, kontak, dan kalender Anda melalui bahasa alami. Semua 68 titik akhir API diekspos sebagai alat MCP. Ini berjalan secara lokal melalui <code>npx @forwardemail/mcp-server</code> — kredensial Anda tidak pernah meninggalkan mesin Anda.
</p>

## Daftar Isi

* [Apa itu MCP?](#what-is-mcp)
* [Mulai Cepat](#quick-start)
  * [Dapatkan Kunci API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Klien MCP Lainnya](#other-mcp-clients)
* [Autentikasi](#authentication)
  * [Autentikasi Kunci API](#api-key-auth)
  * [Autentikasi Alias](#alias-auth)
  * [Membuat Kata Sandi Alias](#generating-an-alias-password)
* [Semua 68 Alat](#all-68-tools)
  * [Akun (Kunci API atau Autentikasi Alias)](#account-api-key-or-alias-auth)
  * [Domain (Kunci API)](#domains-api-key)
  * [Alias (Kunci API)](#aliases-api-key)
  * [Email — SMTP Keluar (Kunci API; Kirim mendukung keduanya)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Pesan — IMAP (Autentikasi Alias)](#messages--imap-alias-auth)
  * [Folder — IMAP (Autentikasi Alias)](#folders--imap-alias-auth)
  * [Kontak — CardDAV (Autentikasi Alias)](#contacts--carddav-alias-auth)
  * [Kalender — CalDAV (Autentikasi Alias)](#calendars--caldav-alias-auth)
  * [Acara Kalender — CalDAV (Autentikasi Alias)](#calendar-events--caldav-alias-auth)
  * [Skrip Sieve (Kunci API)](#sieve-scripts-api-key)
  * [Skrip Sieve (Autentikasi Alias)](#sieve-scripts-alias-auth)
  * [Anggota Domain dan Undangan (Kunci API)](#domain-members-and-invites-api-key)
  * [Kata Sandi Catch-All (Kunci API)](#catch-all-passwords-api-key)
  * [Log (Kunci API)](#logs-api-key)
  * [Enkripsi (Tanpa Autentikasi)](#encrypt-no-auth)
* [20 Kasus Penggunaan Dunia Nyata](#20-real-world-use-cases)
* [Contoh Prompt](#example-prompts)
* [Variabel Lingkungan](#environment-variables)
* [Keamanan](#security)
* [Penggunaan Programatik](#programmatic-usage)
* [Sumber Terbuka](#open-source)


## Apa itu MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) adalah standar terbuka yang dibuat oleh Anthropic yang memungkinkan model AI memanggil alat eksternal dengan aman. Alih-alih menyalin-tempel respons API ke jendela obrolan, MCP memberikan model akses langsung dan terstruktur ke layanan Anda.

Server MCP kami membungkus seluruh [API Forward Email](/email-api) — setiap titik akhir, setiap parameter — dan mengeksposnya sebagai alat yang dapat digunakan oleh klien yang kompatibel dengan MCP. Server berjalan secara lokal di mesin Anda menggunakan transportasi stdio. Kredensial Anda tetap berada di variabel lingkungan Anda dan tidak pernah dikirim ke model AI.


## Mulai Cepat {#quick-start}

### Dapatkan Kunci API {#get-an-api-key}

1. Masuk ke [akun Forward Email](/my-account/domains) Anda.
2. Buka **Akun Saya** → **Keamanan** → **Kunci API**.
3. Buat kunci API baru dan salin.

### Claude Desktop {#claude-desktop}

Tambahkan ini ke file konfigurasi Claude Desktop Anda:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Mulai ulang Claude Desktop. Anda akan melihat alat Forward Email di pemilih alat.

> **Catatan:** Variabel `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD` bersifat opsional tetapi diperlukan untuk alat kotak surat (pesan, folder, kontak, kalender). Lihat [Autentikasi](#authentication) untuk detailnya.

### Cursor {#cursor}

Buka Pengaturan Cursor → MCP → Tambahkan Server:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Buka Pengaturan Windsurf → MCP → Tambahkan Server dengan konfigurasi yang sama seperti di atas.

### Klien MCP Lainnya {#other-mcp-clients}

Klien apa pun yang mendukung transportasi stdio MCP akan berfungsi. Perintahnya adalah:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentikasi {#authentication}

API Forward Email menggunakan **autentikasi HTTP Basic** dengan dua jenis kredensial yang berbeda tergantung pada titik akhir. Server MCP menanganinya secara otomatis — Anda hanya perlu memberikan kredensial yang benar.

### Autentikasi Kunci API {#api-key-auth}

Sebagian besar titik akhir manajemen (domain, alias, email keluar, log) menggunakan **kunci API** Anda sebagai nama pengguna autentikasi Basic dengan kata sandi kosong.

Ini adalah kunci API yang sama yang Anda gunakan untuk REST API. Atur melalui variabel lingkungan `FORWARD_EMAIL_API_KEY`.

### Autentikasi Alias {#alias-auth}

Titik akhir kotak surat (pesan, folder, kontak, kalender, skrip sieve yang dicakup alias) menggunakan **kredensial alias** — alamat email alias sebagai nama pengguna dan kata sandi yang dibuat sebagai kata sandi.

Titik akhir ini mengakses data per-alias melalui protokol IMAP, CalDAV, dan CardDAV. Mereka memerlukan email alias dan kata sandi yang dibuat, bukan kunci API.

Anda dapat memberikan kredensial alias dengan dua cara:

1. **Variabel lingkungan** (direkomendasikan untuk alias default): Atur `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parameter per-panggilan-alat**: Lewatkan `alias_username` dan `alias_password` sebagai argumen ke alat autentikasi alias apa pun. Ini menimpa variabel lingkungan, yang berguna saat bekerja dengan beberapa alias.

### Membuat Kata Sandi Alias {#generating-an-alias-password}

Sebelum Anda dapat menggunakan alat autentikasi alias, Anda perlu membuat kata sandi untuk alias tersebut. Anda dapat melakukannya dengan alat `generateAliasPassword` atau melalui API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Responsnya mencakup bidang `username` (email alias) dan `password`. Gunakan ini sebagai kredensial alias Anda.

> **Tip:** Anda juga dapat bertanya kepada asisten AI Anda: *"Buat kata sandi untuk alias user@example.com di domain example.com"* — ini akan memanggil alat `generateAliasPassword` dan mengembalikan kredensial.

Tabel di bawah ini merangkum metode autentikasi yang diperlukan setiap grup alat:

| Grup Alat | Metode Autentikasi | Kredensial |
|-----------|-------------|-------------|
| Akun | Kunci API **atau** Autentikasi Alias | Salah satu |
| Domain, Alias, Anggota Domain, Undangan, Kata Sandi Catch-All | Kunci API | `FORWARD_EMAIL_API_KEY` |
| Email Keluar (daftar, dapatkan, hapus, batasi) | Kunci API | `FORWARD_EMAIL_API_KEY` |
| Kirim Email | Kunci API **atau** Autentikasi Alias | Salah satu |
| Pesan (IMAP) | Autentikasi Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Folder (IMAP) | Autentikasi Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontak (CardDAV) | Autentikasi Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalender (CalDAV) | Autentikasi Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Acara Kalender (CalDAV) | Autentikasi Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Skrip Sieve (cakupan domain) | Kunci API | `FORWARD_EMAIL_API_KEY` |
| Skrip Sieve (cakupan alias) | Autentikasi Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Log | Kunci API | `FORWARD_EMAIL_API_KEY` |
| Enkripsi | Tidak Ada | Tidak perlu kredensial |


## Semua 68 Alat {#all-68-tools}

Setiap alat memetakan langsung ke titik akhir [API Forward Email](/email-api). Parameter menggunakan nama yang sama dengan dokumen API. Metode autentikasi dicatat di setiap judul bagian.

### Akun (Kunci API atau Autentikasi Alias) {#account-api-key-or-alias-auth}

Dengan autentikasi kunci API, ini mengembalikan informasi akun pengguna Anda. Dengan autentikasi alias, ini mengembalikan informasi alias/kotak surat termasuk kuota penyimpanan dan pengaturan.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Dapatkan informasi akun Anda |
| `updateAccount` | `PUT /v1/account` | Perbarui pengaturan akun Anda |

### Domain (Kunci API) {#domains-api-key}

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Daftar semua domain Anda |
| `createDomain` | `POST /v1/domains` | Tambahkan domain baru |
| `getDomain` | `GET /v1/domains/:domain_id` | Dapatkan detail domain |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Perbarui pengaturan domain |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Hapus domain |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verifikasi catatan DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verifikasi konfigurasi SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Uji penyimpanan S3 kustom |

### Alias (Kunci API) {#aliases-api-key}

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Daftar alias untuk domain |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Buat alias baru |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Dapatkan detail alias |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Perbarui alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Hapus alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Buat kata sandi IMAP/SMTP untuk autentikasi alias |

### Email — SMTP Keluar (Kunci API; Kirim mendukung keduanya) {#emails--outbound-smtp-api-key-send-supports-both}

| Alat | Titik Akhir API | Autentikasi | Deskripsi |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | Kunci API atau Autentikasi Alias | Kirim email melalui SMTP |
| `listEmails` | `GET /v1/emails` | Kunci API | Daftar email keluar |
| `getEmail` | `GET /v1/emails/:id` | Kunci API | Dapatkan detail dan status email |
| `deleteEmail` | `DELETE /v1/emails/:id` | Kunci API | Hapus email yang diantrekan |
| `getEmailLimit` | `GET /v1/emails/limit` | Kunci API | Periksa batas pengiriman Anda |

Alat `sendEmail` menerima `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, dan `attachments`. Ini sama dengan titik akhir `POST /v1/emails`.

### Pesan — IMAP (Autentikasi Alias) {#messages--imap-alias-auth}

> **Membutuhkan kredensial alias.** Lewatkan `alias_username` dan `alias_password` atau atur variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Daftar dan cari pesan di kotak surat |
| `createMessage` | `POST /v1/messages` | Buat draf atau unggah pesan |
| `getMessage` | `GET /v1/messages/:id` | Dapatkan pesan berdasarkan ID |
| `updateMessage` | `PUT /v1/messages/:id` | Perbarui bendera (baca, berbintang, dll.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Hapus pesan |

Alat `listMessages` mendukung 15+ parameter pencarian termasuk `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, dan `has_attachment`. Lihat [dokumen API](/email-api) untuk daftar lengkapnya.

### Folder — IMAP (Autentikasi Alias) {#folders--imap-alias-auth}

> **Membutuhkan kredensial alias.** Lewatkan `alias_username` dan `alias_password` atau atur variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Daftar semua folder kotak surat |
| `createFolder` | `POST /v1/folders` | Buat folder baru |
| `getFolder` | `GET /v1/folders/:id` | Dapatkan detail folder |
| `updateFolder` | `PUT /v1/folders/:id` | Ganti nama folder |
| `deleteFolder` | `DELETE /v1/folders/:id` | Hapus folder |

### Kontak — CardDAV (Autentikasi Alias) {#contacts--carddav-alias-auth}

> **Membutuhkan kredensial alias.** Lewatkan `alias_username` dan `alias_password` atau atur variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Daftar semua kontak |
| `createContact` | `POST /v1/contacts` | Buat kontak baru |
| `getContact` | `GET /v1/contacts/:id` | Dapatkan detail kontak |
| `updateContact` | `PUT /v1/contacts/:id` | Perbarui kontak |
| `deleteContact` | `DELETE /v1/contacts/:id` | Hapus kontak |

### Kalender — CalDAV (Autentikasi Alias) {#calendars--caldav-alias-auth}

> **Membutuhkan kredensial alias.** Lewatkan `alias_username` dan `alias_password` atau atur variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Daftar semua kalender |
| `createCalendar` | `POST /v1/calendars` | Buat kalender baru |
| `getCalendar` | `GET /v1/calendars/:id` | Dapatkan detail kalender |
| `updateCalendar` | `PUT /v1/calendars/:id` | Perbarui kalender |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Hapus kalender |

### Acara Kalender — CalDAV (Autentikasi Alias) {#calendar-events--caldav-alias-auth}

> **Membutuhkan kredensial alias.** Lewatkan `alias_username` dan `alias_password` atau atur variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Daftar semua acara |
| `createCalendarEvent` | `POST /v1/calendar-events` | Buat acara baru |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Dapatkan detail acara |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Perbarui acara |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Hapus acara |

### Skrip Sieve (Kunci API) {#sieve-scripts-api-key}

Ini menggunakan jalur cakupan domain dan mengautentikasi dengan kunci API Anda.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Daftar skrip untuk alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Buat skrip baru |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Dapatkan detail skrip |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Perbarui skrip |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Hapus skrip |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktifkan skrip |

### Skrip Sieve (Autentikasi Alias) {#sieve-scripts-alias-auth}

Ini menggunakan autentikasi tingkat alias. Berguna untuk otomatisasi per-alias tanpa memerlukan kunci API.

> **Membutuhkan kredensial alias.** Lewatkan `alias_username` dan `alias_password` atau atur variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Daftar skrip |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Buat skrip |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Dapatkan detail skrip |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Perbarui skrip |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Hapus skrip |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktifkan skrip |

### Anggota Domain dan Undangan (Kunci API) {#domain-members-and-invites-api-key}

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Ubah peran anggota |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Hapus anggota |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Terima undangan yang tertunda |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Undang seseorang ke domain |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Batalkan undangan |

### Kata Sandi Catch-All (Kunci API) {#catch-all-passwords-api-key}

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Daftar kata sandi catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Buat kata sandi catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Hapus kata sandi catch-all |

### Log (Kunci API) {#logs-api-key}

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Unduh log pengiriman email |

### Enkripsi (Tanpa Autentikasi) {#encrypt-no-auth}

| Alat | Titik Akhir API | Deskripsi |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Enkripsi catatan DNS TXT |

Alat ini tidak memerlukan autentikasi. Ini mengenkripsi catatan penerusan seperti `forward-email=user@example.com` untuk digunakan dalam catatan DNS TXT.


## 20 Kasus Penggunaan Dunia Nyata {#20-real-world-use-cases}

Berikut adalah cara praktis untuk menggunakan server MCP dengan asisten AI Anda:

### 1. Triage Email

Minta AI Anda untuk memindai kotak masuk Anda dan meringkas pesan yang belum dibaca. Ini dapat menandai email mendesak, mengkategorikan berdasarkan pengirim, dan membuat draf balasan — semuanya melalui bahasa alami. *(Membutuhkan kredensial alias untuk akses kotak masuk.)*

### 2. Otomatisasi Penyiapan Domain

Menyiapkan domain baru? Minta AI untuk membuat domain, menambahkan alias Anda, memverifikasi catatan DNS, dan menguji konfigurasi SMTP. Apa yang biasanya membutuhkan 10 menit mengklik dasbor menjadi satu percakapan.

### 3. Manajemen Alias Massal

Perlu membuat 20 alias untuk proyek baru? Jelaskan apa yang Anda butuhkan dan biarkan AI menangani pekerjaan yang berulang. Ini dapat membuat alias, mengatur aturan penerusan, dan membuat kata sandi sekaligus.

### 4. Pemantauan Kampanye Email

Minta AI Anda untuk memeriksa batas pengiriman, daftar email keluar terbaru, dan melaporkan status pengiriman. Berguna untuk memantau kesehatan email transaksional.

### 5. Sinkronisasi dan Pembersihan Kontak

Gunakan alat CardDAV untuk membuat daftar semua kontak, menemukan duplikat, memperbarui informasi yang sudah usang, atau membuat kontak secara massal dari spreadsheet yang Anda tempelkan ke obrolan. *(Membutuhkan kredensial alias.)*

### 6. Manajemen Kalender

Buat kalender, tambahkan acara, perbarui waktu rapat, dan hapus acara yang dibatalkan — semuanya melalui percakapan. Alat CalDAV mendukung CRUD penuh pada kalender dan acara. *(Membutuhkan kredensial alias.)*

### 7. Otomatisasi Skrip Sieve

Skrip Sieve sangat kuat tetapi sintaksnya tidak jelas. Minta AI Anda untuk menulis skrip Sieve untuk Anda: "Filter semua email dari billing@example.com ke folder Billing" menjadi skrip yang berfungsi tanpa menyentuh spesifikasi RFC 5228.

### 8. Orientasi Tim

Ketika anggota tim baru bergabung, minta AI untuk membuat alias mereka, membuat kata sandi, mengirimkan email selamat datang dengan kredensial mereka, dan menambahkannya sebagai anggota domain. Satu prompt, empat panggilan API.

### 9. Audit Keamanan

Minta AI Anda untuk membuat daftar semua domain, memeriksa status verifikasi DNS, meninjau konfigurasi alias, dan mengidentifikasi domain apa pun dengan catatan yang belum diverifikasi. Pemeriksaan keamanan cepat dalam bahasa alami.

### 10. Penyiapan Penerusan Email

Menyiapkan penerusan email untuk domain baru? Minta AI untuk membuat domain, menambahkan alias penerusan, mengenkripsi catatan DNS, dan memverifikasi semuanya dikonfigurasi dengan benar.

### 11. Pencarian dan Analisis Kotak Masuk

Gunakan alat pencarian pesan untuk menemukan email tertentu: "Temukan semua email dari john@example.com dalam 30 hari terakhir yang memiliki lampiran." 15+ parameter pencarian membuatnya kuat. *(Membutuhkan kredensial alias.)*

### 12. Organisasi Folder

Minta AI Anda untuk membuat struktur folder untuk proyek baru, memindahkan pesan antar folder, atau membersihkan folder lama yang tidak lagi Anda butuhkan. *(Membutuhkan kredensial alias.)*

### 13. Rotasi Kata Sandi

Buat kata sandi alias baru sesuai jadwal. Minta AI Anda untuk membuat kata sandi baru untuk setiap alias dan melaporkan kredensial baru.

### 14. Enkripsi Catatan DNS

Enkripsi catatan penerusan Anda sebelum menambahkannya ke DNS. Alat `encryptRecord` menangani ini tanpa autentikasi — berguna untuk enkripsi satu kali yang cepat.

### 15. Analisis Log Pengiriman

Unduh log pengiriman email Anda dan minta AI untuk menganalisis tingkat pantulan, mengidentifikasi penerima yang bermasalah, atau melacak waktu pengiriman.

### 16. Manajemen Multi-Domain

Jika Anda mengelola beberapa domain, minta AI untuk memberi Anda laporan status: domain mana yang diverifikasi, mana yang memiliki masalah, berapa banyak alias yang dimiliki masing-masing, dan seperti apa batas pengirimannya.

### 17. Konfigurasi Catch-All

Siapkan kata sandi catch-all untuk domain yang perlu menerima email di alamat apa pun. AI dapat membuat, membuat daftar, dan mengelola kata sandi ini untuk Anda.

### 18. Manajemen Undangan Domain

Undang anggota tim untuk mengelola domain, memeriksa undangan yang tertunda, dan membersihkan undangan yang kedaluwarsa. Berguna untuk organisasi dengan beberapa administrator domain.

### 19. Pengujian Penyimpanan S3

Jika Anda menggunakan penyimpanan S3 kustom untuk cadangan email, minta AI untuk menguji koneksi dan memverifikasi bahwa itu berfungsi dengan benar.

### 20. Komposisi Draf Email

Buat draf email di kotak surat Anda tanpa mengirimnya. Berguna untuk menyiapkan email yang perlu ditinjau sebelum dikirim, atau untuk membangun template email. *(Membutuhkan kredensial alias.)*


## Contoh Prompt {#example-prompts}

Berikut adalah prompt yang dapat Anda gunakan langsung dengan asisten AI Anda:

**Mengirim email:**
> "Kirim email dari hello@mydomain.com ke john@example.com dengan subjek 'Rapat Besok' dan isi 'Hai John, apakah kita masih akan bertemu jam 2 siang?'"

**Manajemen domain:**
> "Daftar semua domain saya dan beri tahu saya mana yang memiliki catatan DNS yang belum diverifikasi."

**Pembuatan alias:**
> "Buat alias baru support@mydomain.com yang meneruskan ke email pribadi saya."

**Pencarian kotak masuk (membutuhkan kredensial alias):**
> "Temukan semua email yang belum dibaca dari minggu lalu yang menyebutkan 'faktur'."

**Kalender (membutuhkan kredensial alias):**
> "Buat kalender bernama 'Kerja' dan tambahkan rapat untuk besok jam 2 siang bernama 'Rapat Tim'."

**Skrip Sieve:**
> "Tulis skrip Sieve untuk info@mydomain.com yang membalas email secara otomatis dengan 'Terima kasih telah menghubungi, kami akan menghubungi Anda kembali dalam 24 jam.'"

**Operasi massal:**
> "Buat alias untuk sales@, support@, billing@, dan info@ di mydomain.com, semuanya meneruskan ke team@mydomain.com."

**Pemeriksaan keamanan:**
> "Periksa status verifikasi DNS dan SMTP untuk semua domain saya dan beri tahu saya jika ada yang perlu diperhatikan."

**Buat kata sandi alias:**
> "Buat kata sandi untuk alias user@example.com agar saya dapat mengakses kotak masuk saya."


## Variabel Lingkungan {#environment-variables}

| Variabel | Diperlukan | Default | Deskripsi |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Ya | — | Kunci API Forward Email Anda (digunakan sebagai nama pengguna autentikasi Basic untuk titik akhir kunci API) |
| `FORWARD_EMAIL_ALIAS_USER` | Tidak | — | Alamat email alias untuk titik akhir kotak surat (misalnya `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Tidak | — | Kata sandi alias yang dibuat untuk titik akhir kotak surat |
| `FORWARD_EMAIL_API_URL` | Tidak | `https://api.forwardemail.net` | URL dasar API (untuk self-hosted atau pengujian) |


## Keamanan {#security}

Server MCP berjalan secara lokal di mesin Anda. Berikut cara kerja keamanan:

* **Kredensial Anda tetap lokal.** Kunci API dan kredensial alias Anda dibaca dari variabel lingkungan dan digunakan untuk mengautentikasi permintaan API melalui autentikasi HTTP Basic. Keduanya tidak pernah dikirim ke model AI.
* **Transportasi stdio.** Server berkomunikasi dengan klien AI melalui stdin/stdout. Tidak ada port jaringan yang dibuka.
* **Tidak ada penyimpanan data.** Server tidak memiliki status. Ini tidak menyimpan cache, mencatat, atau menyimpan data email Anda.
* **Sumber terbuka.** Seluruh basis kode ada di [GitHub](https://github.com/forwardemail/mcp-server). Anda dapat mengaudit setiap baris.


## Penggunaan Programatik {#programmatic-usage}

Anda juga dapat menggunakan server sebagai pustaka:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Sumber Terbuka {#open-source}

Server MCP Forward Email adalah [sumber terbuka di GitHub](https://github.com/forwardemail/mcp-server) di bawah lisensi BUSL-1.1. Kami percaya pada transparansi. Jika Anda menemukan bug atau menginginkan fitur, [buka masalah](https://github.com/forwardemail/mcp-server/issues).

