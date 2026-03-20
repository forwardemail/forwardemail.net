# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">server MCP open-source kami</a> memungkinkan asisten AI seperti Claude, ChatGPT, Cursor, dan Windsurf mengelola email, domain, alias, kontak, dan kalender Anda melalui bahasa alami. Semua 68 endpoint API tersedia sebagai alat MCP. Server ini berjalan secara lokal melalui <code>npx @forwardemail/mcp-server</code> — kredensial Anda tidak pernah keluar dari mesin Anda.
</p>


## Table of Contents {#table-of-contents}

* [Apa itu MCP?](#what-is-mcp)
* [Mulai Cepat](#quick-start)
  * [Dapatkan API Key](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Klien MCP Lainnya](#other-mcp-clients)
* [Otentikasi](#authentication)
  * [API Key Auth](#api-key-auth)
  * [Alias Auth](#alias-auth)
  * [Membuat Password Alias](#generating-an-alias-password)
* [Semua 68 Alat](#all-68-tools)
  * [Akun (API Key atau Alias Auth)](#account-api-key-or-alias-auth)
  * [Domain (API Key)](#domains-api-key)
  * [Alias (API Key)](#aliases-api-key)
  * [Email — Outbound SMTP (API Key; Send mendukung keduanya)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Pesan — IMAP (Alias Auth)](#messages--imap-alias-auth)
  * [Folder — IMAP (Alias Auth)](#folders--imap-alias-auth)
  * [Kontak — CardDAV (Alias Auth)](#contacts--carddav-alias-auth)
  * [Kalender — CalDAV (Alias Auth)](#calendars--caldav-alias-auth)
  * [Acara Kalender — CalDAV (Alias Auth)](#calendar-events--caldav-alias-auth)
  * [Skrip Sieve (API Key)](#sieve-scripts-api-key)
  * [Skrip Sieve (Alias Auth)](#sieve-scripts-alias-auth)
  * [Anggota dan Undangan Domain (API Key)](#domain-members-and-invites-api-key)
  * [Password Catch-All (API Key)](#catch-all-passwords-api-key)
  * [Log (API Key)](#logs-api-key)
  * [Enkripsi (Tanpa Auth)](#encrypt-no-auth)
* [20 Kasus Penggunaan Dunia Nyata](#20-real-world-use-cases)
  * [1. Seleksi Email](#1-email-triage)
  * [2. Otomasi Pengaturan Domain](#2-domain-setup-automation)
  * [3. Manajemen Alias Massal](#3-bulk-alias-management)
  * [4. Pemantauan Kampanye Email](#4-email-campaign-monitoring)
  * [5. Sinkronisasi dan Pembersihan Kontak](#5-contact-sync-and-cleanup)
  * [6. Manajemen Kalender](#6-calendar-management)
  * [7. Otomasi Skrip Sieve](#7-sieve-script-automation)
  * [8. Onboarding Tim](#8-team-onboarding)
  * [9. Audit Keamanan](#9-security-auditing)
  * [10. Pengaturan Penerusan Email](#10-email-forwarding-setup)
  * [11. Pencarian dan Analisis Kotak Masuk](#11-inbox-search-and-analysis)
  * [12. Organisasi Folder](#12-folder-organization)
  * [13. Rotasi Password](#13-password-rotation)
  * [14. Enkripsi Rekaman DNS](#14-dns-record-encryption)
  * [15. Analisis Log Pengiriman](#15-delivery-log-analysis)
  * [16. Manajemen Multi-Domain](#16-multi-domain-management)
  * [17. Konfigurasi Catch-All](#17-catch-all-configuration)
  * [18. Manajemen Undangan Domain](#18-domain-invite-management)
  * [19. Pengujian Penyimpanan S3](#19-s3-storage-testing)
  * [20. Penyusunan Draft Email](#20-email-draft-composition)
* [Contoh Prompt](#example-prompts)
* [Variabel Lingkungan](#environment-variables)
* [Keamanan](#security)
* [Penggunaan Programatik](#programmatic-usage)
* [Open Source](#open-source)


## Apa itu MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) adalah standar terbuka yang dibuat oleh Anthropic yang memungkinkan model AI memanggil alat eksternal dengan aman. Alih-alih menyalin-tempel respons API ke jendela chat, MCP memberikan model akses langsung dan terstruktur ke layanan Anda.

Server MCP kami membungkus seluruh [Forward Email API](/email-api) — setiap endpoint, setiap parameter — dan mengeksposnya sebagai alat yang dapat digunakan oleh klien yang kompatibel dengan MCP. Server berjalan secara lokal di mesin Anda menggunakan transport stdio. Kredensial Anda tetap di variabel lingkungan dan tidak pernah dikirim ke model AI.


## Mulai Cepat {#quick-start}

### Dapatkan API Key {#get-an-api-key}
1. Masuk ke [akun Forward Email Anda](/my-account/domains).
2. Pergi ke **Akun Saya** → **Keamanan** → **Kunci API**.
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

Mulai ulang Claude Desktop. Anda harus melihat alat Forward Email di pemilih alat.

> **Catatan:** Variabel `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD` bersifat opsional tetapi diperlukan untuk alat kotak surat (pesan, folder, kontak, kalender). Lihat [Autentikasi](#authentication) untuk detail.

### Cursor {#cursor}

Buka Pengaturan Cursor → MCP → Tambah Server:

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

Buka Pengaturan Windsurf → MCP → Tambah Server dengan konfigurasi yang sama seperti di atas.

### Klien MCP Lainnya {#other-mcp-clients}

Klien apa pun yang mendukung transport MCP stdio akan berfungsi. Perintahnya adalah:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentikasi {#authentication}

API Forward Email menggunakan **autentikasi HTTP Basic** dengan dua jenis kredensial berbeda tergantung pada endpoint. Server MCP menangani ini secara otomatis — Anda hanya perlu menyediakan kredensial yang tepat.

### Autentikasi Kunci API {#api-key-auth}

Sebagian besar endpoint manajemen (domain, alias, email keluar, log) menggunakan **kunci API** Anda sebagai username Basic auth dengan password kosong.

Ini adalah kunci API yang sama yang Anda gunakan untuk REST API. Tetapkan melalui variabel lingkungan `FORWARD_EMAIL_API_KEY`.

### Autentikasi Alias {#alias-auth}

Endpoint kotak surat (pesan, folder, kontak, kalender, skrip sieve yang dibatasi alias) menggunakan **kredensial alias** — alamat email alias sebagai username dan password yang dihasilkan sebagai password.

Endpoint ini mengakses data per-alias melalui protokol IMAP, CalDAV, dan CardDAV. Mereka memerlukan email alias dan password yang dihasilkan, bukan kunci API.

Anda dapat menyediakan kredensial alias dengan dua cara:

1. **Variabel lingkungan** (disarankan untuk alias default): Tetapkan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parameter per-panggilan alat**: Kirim `alias_username` dan `alias_password` sebagai argumen ke alat autentikasi alias mana pun. Ini menggantikan variabel lingkungan, yang berguna saat bekerja dengan beberapa alias.

### Menghasilkan Password Alias {#generating-an-alias-password}

Sebelum Anda dapat menggunakan alat autentikasi alias, Anda perlu menghasilkan password untuk alias tersebut. Anda dapat melakukannya dengan alat `generateAliasPassword` atau melalui API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Respons mencakup bidang `username` (email alias) dan `password`. Gunakan ini sebagai kredensial alias Anda.

> **Tips:** Anda juga dapat bertanya kepada asisten AI Anda: *"Generate a password for the alias <user@example.com> on domain example.com"* — ia akan memanggil alat `generateAliasPassword` dan mengembalikan kredensialnya.

Tabel di bawah merangkum metode autentikasi yang diperlukan oleh setiap grup alat:

| Grup Alat                                                     | Metode Autentikasi       | Kredensial                                                 |
| -------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| Akun                                                        | Kunci API **atau** Autentikasi Alias | Salah satu                                                  |
| Domain, Alias, Anggota Domain, Undangan, Password Catch-All | Kunci API                   | `FORWARD_EMAIL_API_KEY`                                     |
| Email Keluar (daftar, dapatkan, hapus, batas)                     | Kunci API                   | `FORWARD_EMAIL_API_KEY`                                     |
| Kirim Email                                                     | Kunci API **atau** Autentikasi Alias | Salah satu                                                  |
| Pesan (IMAP)                                                | Autentikasi Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Folder (IMAP)                                                 | Autentikasi Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontak (CardDAV)                                             | Autentikasi Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalender (CalDAV)                                             | Autentikasi Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Acara Kalender (CalDAV)                                       | Autentikasi Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Skrip Sieve (domain-scoped)                                  | Kunci API                   | `FORWARD_EMAIL_API_KEY`                                     |
| Skrip Sieve (alias-scoped)                                   | Autentikasi Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Log                                                           | Kunci API                   | `FORWARD_EMAIL_API_KEY`                                     |
| Enkripsi                                                        | Tidak ada                      | Tidak perlu kredensial                                       |
## Semua 68 Alat {#all-68-tools}

Setiap alat langsung terhubung ke [Forward Email API](/email-api) endpoint. Parameter menggunakan nama yang sama seperti dokumen API. Metode otentikasi dicatat di setiap judul bagian.

### Akun (API Key atau Alias Auth) {#account-api-key-or-alias-auth}

Dengan otentikasi API key, ini mengembalikan info akun pengguna Anda. Dengan otentikasi alias, ini mengembalikan info alias/mailbox termasuk kuota penyimpanan dan pengaturan.

| Alat             | API Endpoint      | Deskripsi                    |
| ---------------- | ----------------- | ---------------------------- |
| `getAccount`     | `GET /v1/account` | Dapatkan informasi akun Anda |
| `updateAccount`  | `PUT /v1/account` | Perbarui pengaturan akun Anda |

### Domain (API Key) {#domains-api-key}

| Alat                  | API Endpoint                                     | Deskripsi                 |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Daftar semua domain Anda  |
| `createDomain`        | `POST /v1/domains`                               | Tambah domain baru        |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Dapatkan detail domain    |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Perbarui pengaturan domain|
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Hapus domain              |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verifikasi catatan DNS    |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verifikasi konfigurasi SMTP|
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Uji penyimpanan S3 kustom |

### Alias (API Key) {#aliases-api-key}

| Alat                    | API Endpoint                                                      | Deskripsi                                |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Daftar alias untuk sebuah domain         |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Buat alias baru                         |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Dapatkan detail alias                   |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Perbarui alias                          |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Hapus alias                            |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Buat password IMAP/SMTP untuk otentikasi alias |

### Email — SMTP Keluar (API Key; Send mendukung keduanya) {#emails--outbound-smtp-api-key-send-supports-both}

| Alat            | API Endpoint            | Auth                  | Deskripsi                  |
| --------------- | ----------------------- | --------------------- | -------------------------- |
| `sendEmail`     | `POST /v1/emails`       | API Key atau Alias Auth | Kirim email via SMTP       |
| `listEmails`    | `GET /v1/emails`        | API Key               | Daftar email keluar        |
| `getEmail`      | `GET /v1/emails/:id`    | API Key               | Dapatkan detail dan status email |
| `deleteEmail`   | `DELETE /v1/emails/:id` | API Key               | Hapus email yang antre     |
| `getEmailLimit` | `GET /v1/emails/limit`  | API Key               | Cek batas pengiriman Anda  |

Alat `sendEmail` menerima `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, dan `attachments`. Ini sama dengan endpoint `POST /v1/emails`.

### Pesan — IMAP (Alias Auth) {#messages--imap-alias-auth}

> **Memerlukan kredensial alias.** Kirim `alias_username` dan `alias_password` atau setel variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Alat             | Endpoint API              | Deskripsi                            |
| ---------------  | ------------------------- | ----------------------------------- |
| `listMessages`   | `GET /v1/messages`        | Daftar dan cari pesan di kotak surat |
| `createMessage`  | `POST /v1/messages`       | Buat draft atau unggah pesan        |
| `getMessage`     | `GET /v1/messages/:id`    | Dapatkan pesan berdasarkan ID       |
| `updateMessage`  | `PUT /v1/messages/:id`    | Perbarui tanda (dibaca, berbintang, dll.) |
| `deleteMessage`  | `DELETE /v1/messages/:id` | Hapus pesan                        |

Alat `listMessages` mendukung lebih dari 15 parameter pencarian termasuk `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, dan `has_attachment`. Lihat [dokumentasi API](/email-api) untuk daftar lengkap.

### Folder — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Memerlukan kredensial alias.** Kirim `alias_username` dan `alias_password` atau setel variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat            | Endpoint API             | Deskripsi               |
| --------------- | ------------------------ | ----------------------- |
| `listFolders`   | `GET /v1/folders`        | Daftar semua folder kotak surat |
| `createFolder`  | `POST /v1/folders`       | Buat folder baru        |
| `getFolder`     | `GET /v1/folders/:id`    | Dapatkan detail folder  |
| `updateFolder`  | `PUT /v1/folders/:id`    | Ganti nama folder       |
| `deleteFolder`  | `DELETE /v1/folders/:id` | Hapus folder            |

### Kontak — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Memerlukan kredensial alias.** Kirim `alias_username` dan `alias_password` atau setel variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat             | Endpoint API              | Deskripsi           |
| ---------------- | ------------------------- | ------------------- |
| `listContacts`   | `GET /v1/contacts`        | Daftar semua kontak |
| `createContact`  | `POST /v1/contacts`       | Buat kontak baru    |
| `getContact`     | `GET /v1/contacts/:id`    | Dapatkan detail kontak |
| `updateContact`  | `PUT /v1/contacts/:id`    | Perbarui kontak     |
| `deleteContact`  | `DELETE /v1/contacts/:id` | Hapus kontak        |

### Kalender — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Memerlukan kredensial alias.** Kirim `alias_username` dan `alias_password` atau setel variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat              | Endpoint API               | Deskripsi            |
| ----------------- | -------------------------- | -------------------- |
| `listCalendars`   | `GET /v1/calendars`        | Daftar semua kalender |
| `createCalendar`  | `POST /v1/calendars`       | Buat kalender baru   |
| `getCalendar`     | `GET /v1/calendars/:id`    | Dapatkan detail kalender |
| `updateCalendar`  | `PUT /v1/calendars/:id`    | Perbarui kalender    |
| `deleteCalendar`  | `DELETE /v1/calendars/:id` | Hapus kalender       |

### Acara Kalender — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Memerlukan kredensial alias.** Kirim `alias_username` dan `alias_password` atau setel variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat                   | Endpoint API                     | Deskripsi           |
| ---------------------- | -------------------------------- | ------------------- |
| `listCalendarEvents`   | `GET /v1/calendar-events`        | Daftar semua acara  |
| `createCalendarEvent`  | `POST /v1/calendar-events`       | Buat acara baru     |
| `getCalendarEvent`     | `GET /v1/calendar-events/:id`    | Dapatkan detail acara |
| `updateCalendarEvent`  | `PUT /v1/calendar-events/:id`    | Perbarui acara      |
| `deleteCalendarEvent`  | `DELETE /v1/calendar-events/:id` | Hapus acara         |

### Skrip Sieve (API Key) {#sieve-scripts-api-key}

Ini menggunakan jalur yang dibatasi domain dan mengautentikasi dengan kunci API Anda.

| Alat                   | Endpoint API                                                              | Deskripsi                |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------ |
| `listSieveScripts`     | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Daftar skrip untuk alias |
| `createSieveScript`    | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Buat skrip baru          |
| `getSieveScript`       | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Dapatkan detail skrip    |
| `updateSieveScript`    | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Perbarui skrip           |
| `deleteSieveScript`    | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Hapus skrip              |
| `activateSieveScript`  | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktifkan skrip           |
### Skrip Sieve (Alias Auth) {#sieve-scripts-alias-auth}

Ini menggunakan otentikasi tingkat alias. Berguna untuk otomatisasi per-alias tanpa perlu kunci API.

> **Memerlukan kredensial alias.** Kirim `alias_username` dan `alias_password` atau setel variabel lingkungan `FORWARD_EMAIL_ALIAS_USER` dan `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Alat                          | Endpoint API                                 | Deskripsi          |
| ----------------------------- | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`   | `GET /v1/sieve-scripts`                      | Daftar skrip       |
| `createSieveScriptAliasAuth`  | `POST /v1/sieve-scripts`                     | Buat skrip         |
| `getSieveScriptAliasAuth`     | `GET /v1/sieve-scripts/:script_id`           | Dapatkan detail skrip |
| `updateSieveScriptAliasAuth`  | `PUT /v1/sieve-scripts/:script_id`           | Perbarui skrip     |
| `deleteSieveScriptAliasAuth`  | `DELETE /v1/sieve-scripts/:script_id`        | Hapus skrip        |
| `activateSieveScriptAliasAuth`| `POST /v1/sieve-scripts/:script_id/activate` | Aktifkan skrip     |

### Anggota dan Undangan Domain (Kunci API) {#domain-members-and-invites-api-key}

| Alat                 | Endpoint API                                       | Deskripsi                |
| -------------------- | -------------------------------------------------- | ------------------------ |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`    | Ubah peran anggota       |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Hapus anggota            |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`               | Terima undangan tertunda |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`              | Undang seseorang ke domain |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`            | Cabut undangan           |

### Kata Sandi Catch-All (Kunci API) {#catch-all-passwords-api-key}

| Alat                     | Endpoint API                                                  | Deskripsi                  |
| ------------------------ | ------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Daftar kata sandi catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Buat kata sandi catch-all  |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Hapus kata sandi catch-all |

### Log (Kunci API) {#logs-api-key}

| Alat           | Endpoint API            | Deskripsi                  |
| -------------- | ----------------------- | -------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | Unduh log pengiriman email |

### Enkripsi (Tanpa Otentikasi) {#encrypt-no-auth}

| Alat            | Endpoint API       | Deskripsi                  |
| --------------- | ------------------ | -------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | Enkripsi rekaman DNS TXT   |

Alat ini tidak memerlukan otentikasi. Ini mengenkripsi rekaman penerusan seperti `forward-email=user@example.com` untuk digunakan dalam rekaman DNS TXT.


## 20 Kasus Penggunaan Dunia Nyata {#20-real-world-use-cases}

Berikut adalah cara praktis menggunakan server MCP dengan asisten AI Anda:

### 1. Penyaringan Email {#1-email-triage}

Minta AI Anda memindai kotak masuk dan merangkum pesan yang belum dibaca. AI dapat menandai email penting, mengkategorikan berdasarkan pengirim, dan membuat draf balasan — semua melalui bahasa alami. *(Memerlukan kredensial alias untuk akses kotak masuk.)*

### 2. Otomatisasi Pengaturan Domain {#2-domain-setup-automation}

Sedang menyiapkan domain baru? Minta AI untuk membuat domain, menambahkan alias Anda, memverifikasi rekaman DNS, dan menguji konfigurasi SMTP. Yang biasanya memakan waktu 10 menit klik di dashboard menjadi satu percakapan.

### 3. Manajemen Alias Massal {#3-bulk-alias-management}

Perlu membuat 20 alias untuk proyek baru? Jelaskan kebutuhan Anda dan biarkan AI menangani pekerjaan berulang. AI dapat membuat alias, mengatur aturan penerusan, dan menghasilkan kata sandi sekaligus.
### 4. Pemantauan Kampanye Email {#4-email-campaign-monitoring}

Minta AI Anda untuk memeriksa batas pengiriman, daftar email keluar terbaru, dan melaporkan status pengiriman. Berguna untuk memantau kesehatan email transaksional.

### 5. Sinkronisasi dan Pembersihan Kontak {#5-contact-sync-and-cleanup}

Gunakan alat CardDAV untuk mendaftar semua kontak, menemukan duplikat, memperbarui informasi yang sudah usang, atau membuat kontak secara massal dari spreadsheet yang Anda tempelkan ke dalam obrolan. *(Memerlukan kredensial alias.)*

### 6. Manajemen Kalender {#6-calendar-management}

Buat kalender, tambahkan acara, perbarui waktu rapat, dan hapus acara yang dibatalkan — semua melalui percakapan. Alat CalDAV mendukung CRUD penuh pada kalender dan acara. *(Memerlukan kredensial alias.)*

### 7. Otomasi Skrip Sieve {#7-sieve-script-automation}

Skrip Sieve sangat kuat tetapi sintaksnya rumit. Minta AI Anda untuk menulis skrip Sieve untuk Anda: "Filter semua email dari <billing@example.com> ke folder Billing" menjadi skrip yang berfungsi tanpa harus menyentuh spesifikasi RFC 5228.

### 8. Onboarding Tim {#8-team-onboarding}

Ketika anggota tim baru bergabung, minta AI untuk membuat alias mereka, menghasilkan kata sandi, mengirim email sambutan dengan kredensial mereka, dan menambahkan mereka sebagai anggota domain. Satu perintah, empat panggilan API.

### 9. Audit Keamanan {#9-security-auditing}

Minta AI Anda untuk mendaftar semua domain, memeriksa status verifikasi DNS, meninjau konfigurasi alias, dan mengidentifikasi domain yang memiliki catatan yang belum diverifikasi. Pemeriksaan keamanan cepat dalam bahasa alami.

### 10. Pengaturan Penerusan Email {#10-email-forwarding-setup}

Mengatur penerusan email untuk domain baru? Minta AI untuk membuat domain, menambahkan alias penerusan, mengenkripsi catatan DNS, dan memverifikasi semuanya sudah dikonfigurasi dengan benar.

### 11. Pencarian dan Analisis Kotak Masuk {#11-inbox-search-and-analysis}

Gunakan alat pencarian pesan untuk menemukan email tertentu: "Temukan semua email dari <john@example.com> dalam 30 hari terakhir yang memiliki lampiran." Lebih dari 15 parameter pencarian membuat ini sangat kuat. *(Memerlukan kredensial alias.)*

### 12. Organisasi Folder {#12-folder-organization}

Minta AI Anda untuk membuat struktur folder untuk proyek baru, memindahkan pesan antar folder, atau membersihkan folder lama yang tidak lagi Anda butuhkan. *(Memerlukan kredensial alias.)*

### 13. Rotasi Kata Sandi {#13-password-rotation}

Hasilkan kata sandi alias baru secara terjadwal. Minta AI Anda untuk membuat kata sandi baru untuk setiap alias dan melaporkan kredensial baru tersebut.

### 14. Enkripsi Catatan DNS {#14-dns-record-encryption}

Enkripsi catatan penerusan Anda sebelum menambahkannya ke DNS. Alat `encryptRecord` menangani ini tanpa otentikasi — berguna untuk enkripsi cepat sekali pakai.

### 15. Analisis Log Pengiriman {#15-delivery-log-analysis}

Unduh log pengiriman email Anda dan minta AI untuk menganalisis tingkat bounce, mengidentifikasi penerima bermasalah, atau melacak waktu pengiriman.

### 16. Manajemen Multi-Domain {#16-multi-domain-management}

Jika Anda mengelola banyak domain, minta AI untuk memberikan laporan status: domain mana yang sudah diverifikasi, mana yang bermasalah, berapa banyak alias yang dimiliki masing-masing, dan bagaimana batas pengirimannya.

### 17. Konfigurasi Catch-All {#17-catch-all-configuration}

Atur kata sandi catch-all untuk domain yang perlu menerima email di alamat mana pun. AI dapat membuat, mendaftar, dan mengelola kata sandi ini untuk Anda.

### 18. Manajemen Undangan Domain {#18-domain-invite-management}

Undang anggota tim untuk mengelola domain, periksa undangan yang tertunda, dan bersihkan yang sudah kedaluwarsa. Berguna untuk organisasi dengan banyak administrator domain.

### 19. Pengujian Penyimpanan S3 {#19-s3-storage-testing}

Jika Anda menggunakan penyimpanan S3 khusus untuk cadangan email, minta AI untuk menguji koneksi dan memverifikasi bahwa itu berfungsi dengan benar.

### 20. Penyusunan Draf Email {#20-email-draft-composition}

Buat draf email di kotak surat Anda tanpa mengirimnya. Berguna untuk menyiapkan email yang perlu ditinjau sebelum dikirim, atau untuk membuat template email. *(Memerlukan kredensial alias.)*


## Contoh Prompt {#example-prompts}

Berikut adalah prompt yang dapat Anda gunakan langsung dengan asisten AI Anda:

**Mengirim email:**

> "Kirim email dari <hello@mydomain.com> ke <john@example.com> dengan subjek 'Rapat Besok' dan isi 'Hai John, apakah kita masih jadi jam 2 siang?'"
**Manajemen domain:**

> "Daftar semua domain saya dan beri tahu saya mana yang memiliki catatan DNS yang belum diverifikasi."

**Pembuatan alias:**

> "Buat alias baru <support@mydomain.com> yang meneruskan ke email pribadi saya."

**Pencarian kotak masuk (memerlukan kredensial alias):**

> "Temukan semua email yang belum dibaca dari minggu lalu yang menyebutkan 'invoice'."

**Kalender (memerlukan kredensial alias):**

> "Buat kalender bernama 'Work' dan tambahkan rapat untuk besok pukul 2 siang bernama 'Team Standup'."

**Skrip Sieve:**

> "Tulis skrip Sieve untuk <info@mydomain.com> yang membalas otomatis email dengan 'Terima kasih telah menghubungi, kami akan membalas dalam 24 jam.'"

**Operasi massal:**

> "Buat alias untuk sales@, support@, billing@, dan info@ di mydomain.com, semuanya meneruskan ke <team@mydomain.com>."

**Pemeriksaan keamanan:**

> "Periksa status verifikasi DNS dan SMTP untuk semua domain saya dan beri tahu saya jika ada yang perlu diperhatikan."

**Hasilkan kata sandi alias:**

> "Hasilkan kata sandi untuk alias <user@example.com> agar saya dapat mengakses kotak masuk saya."


## Environment Variables {#environment-variables}

| Variable                       | Required | Default                        | Description                                                                    |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Ya       | —                              | Kunci API Forward Email Anda (digunakan sebagai username Basic auth untuk endpoint API-key) |
| `FORWARD_EMAIL_ALIAS_USER`     | Tidak    | —                              | Alamat email alias untuk endpoint kotak surat (misal `user@example.com`)       |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Tidak    | —                              | Kata sandi alias yang dihasilkan untuk endpoint kotak surat                    |
| `FORWARD_EMAIL_API_URL`        | Tidak    | `https://api.forwardemail.net` | URL dasar API (untuk self-hosted atau pengujian)                              |


## Security {#security}

Server MCP berjalan secara lokal di mesin Anda. Berikut cara kerja keamanannya:

* **Kredensial Anda tetap lokal.** Baik kunci API maupun kredensial alias Anda dibaca dari environment variables dan digunakan untuk mengautentikasi permintaan API melalui HTTP Basic auth. Mereka tidak pernah dikirim ke model AI.
* **Transport stdio.** Server berkomunikasi dengan klien AI melalui stdin/stdout. Tidak ada port jaringan yang dibuka.
* **Tidak ada penyimpanan data.** Server bersifat stateless. Tidak menyimpan cache, log, atau data email Anda.
* **Open source.** Seluruh kode ada di [GitHub](https://github.com/forwardemail/mcp-server). Anda dapat mengaudit setiap barisnya.


## Programmatic Usage {#programmatic-usage}

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


## Open Source {#open-source}

Forward Email MCP Server adalah [open-source di GitHub](https://github.com/forwardemail/mcp-server) di bawah lisensi BUSL-1.1. Kami percaya pada transparansi. Jika Anda menemukan bug atau ingin fitur, [buka issue](https://github.com/forwardemail/mcp-server/issues).
