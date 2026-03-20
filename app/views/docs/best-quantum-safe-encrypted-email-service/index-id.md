# Email Tahan Kuantum: Bagaimana kami menggunakan kotak surat SQLite terenkripsi untuk menjaga email Anda tetap aman {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Ilustrasi layanan email terenkripsi aman kuantum" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Kata Pengantar](#foreword)
* [Perbandingan penyedia layanan email](#email-service-provider-comparison)
* [Bagaimana cara kerjanya](#how-does-it-work)
* [Teknologi](#technologies)
  * [Basis data](#databases)
  * [Keamanan](#security)
  * [Kotak surat](#mailboxes)
  * [Konkruensi](#concurrency)
  * [Cadangan](#backups)
  * [Pencarian](#search)
  * [Proyek](#projects)
  * [Penyedia](#providers)
* [Pemikiran](#thoughts)
  * [Prinsip](#principles)
  * [Eksperimen](#experiments)
  * [Ketiadaan alternatif](#lack-of-alternatives)
  * [Coba Forward Email](#try-out-forward-email)


## Kata Pengantar {#foreword}

> \[!IMPORTANT]
> Layanan email kami adalah [100% open-source](https://github.com/forwardemail) dan berfokus pada privasi melalui kotak surat SQLite yang aman dan terenkripsi.

Sampai kami meluncurkan [dukungan IMAP](/faq#do-you-support-receiving-email-with-imap), kami menggunakan MongoDB untuk kebutuhan penyimpanan data persisten kami.

Teknologi ini luar biasa dan kami masih menggunakannya hingga hari ini – tetapi untuk memiliki enkripsi saat data diam dengan MongoDB Anda perlu menggunakan penyedia yang menawarkan MongoDB Enterprise, seperti Digital Ocean atau Mongo Atlas – atau membayar lisensi enterprise (dan kemudian harus berurusan dengan keterlambatan tim penjualan).

Tim kami di [Forward Email](https://forwardemail.net) membutuhkan solusi penyimpanan yang ramah pengembang, skalabel, andal, dan terenkripsi untuk kotak surat IMAP. Sebagai pengembang open-source, menggunakan teknologi yang mengharuskan Anda membayar biaya lisensi untuk mendapatkan fitur enkripsi saat data diam bertentangan dengan [prinsip kami](#principles) – maka kami bereksperimen, meneliti, dan mengembangkan solusi baru dari awal untuk memenuhi kebutuhan ini.

Alih-alih menggunakan basis data bersama untuk menyimpan kotak surat Anda, kami menyimpan dan mengenkripsi kotak surat Anda secara individual dengan kata sandi Anda (yang hanya Anda yang memilikinya).  **Layanan email kami sangat aman sehingga jika Anda lupa kata sandi Anda, maka Anda kehilangan kotak surat Anda** (dan perlu memulihkan dengan cadangan offline atau memulai dari awal).

Teruslah membaca karena kami akan membahas secara mendalam di bawah ini dengan [perbandingan penyedia layanan email](#email-service-provider-comparison), [cara kerja layanan kami](#how-does-it-work), [tumpukan teknologi kami](#technologies), dan lainnya.


## Perbandingan penyedia layanan email {#email-service-provider-comparison}

Kami adalah satu-satunya penyedia layanan email yang 100% open-source dan berfokus pada privasi yang menyimpan kotak surat SQLite terenkripsi secara individual, menawarkan domain, alias, dan pengguna tanpa batas, serta mendukung SMTP keluar, IMAP, dan POP3:

**Berbeda dengan penyedia email lain, Anda tidak perlu membayar penyimpanan berdasarkan domain atau alias dengan Forward Email.** Penyimpanan dibagi di seluruh akun Anda – jadi jika Anda memiliki beberapa nama domain khusus dan beberapa alias di masing-masing, maka kami adalah solusi yang sempurna untuk Anda. Perlu dicatat bahwa Anda masih dapat memberlakukan batas penyimpanan jika diinginkan berdasarkan domain atau alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Baca Perbandingan Layanan Email <i class="fa fa-search-plus"></i></a>


## Bagaimana cara kerjanya {#how-does-it-work}

1. Menggunakan klien email Anda seperti Apple Mail, Thunderbird, Gmail, atau Outlook – Anda terhubung ke server [IMAP](/faq#do-you-support-receiving-email-with-imap) kami yang aman menggunakan nama pengguna dan kata sandi Anda:

   * Nama pengguna Anda adalah alias lengkap dengan domain Anda seperti `hello@example.com`.
   * Kata sandi Anda dihasilkan secara acak dan hanya ditampilkan kepada Anda selama 30 detik ketika Anda mengklik <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> dari <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias.
2. Setelah terhubung, klien email Anda akan mengirim [perintah protokol IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) ke server IMAP kami untuk menjaga kotak surat Anda tetap sinkron. Ini termasuk menulis dan menyimpan email draf serta tindakan lain yang mungkin Anda lakukan (misalnya memberi label email sebagai Penting atau menandai email sebagai Spam/Surat Sampah).

3. Server pertukaran surat (umumnya dikenal sebagai server "MX") menerima email masuk baru dan menyimpannya ke kotak surat Anda. Ketika ini terjadi, klien email Anda akan diberi tahu dan menyinkronkan kotak surat Anda. Server pertukaran surat kami dapat meneruskan email Anda ke satu atau lebih penerima (termasuk [webhook](/faq#do-you-support-webhooks)), menyimpan email Anda untuk Anda di penyimpanan IMAP terenkripsi bersama kami, **atau keduanya**!

   > \[!TIP]
   > Tertarik untuk mempelajari lebih lanjut? Baca [cara mengatur penerusan email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [cara kerja layanan pertukaran surat kami](/faq#how-does-your-email-forwarding-system-work), atau lihat [panduan kami](/guides).

4. Di balik layar, desain penyimpanan email aman kami bekerja dengan dua cara untuk menjaga kotak surat Anda terenkripsi dan hanya dapat diakses oleh Anda:

   * Ketika email baru diterima untuk Anda dari pengirim, server pertukaran surat kami menulis ke kotak surat individual, sementara, dan terenkripsi untuk Anda.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Pesan masuk diterima untuk alias Anda (misal you@yourdomain.com).
         MX->>SQLite: Pesan disimpan di kotak surat sementara.
         Note over MX,SQLite: Meneruskan ke penerima lain dan webhook yang dikonfigurasi.
         MX->>Sender: Berhasil!
     ```

   * Ketika Anda terhubung ke server IMAP kami dengan klien email Anda, kata sandi Anda kemudian dienkripsi di memori dan digunakan untuk membaca serta menulis ke kotak surat Anda. Kotak surat Anda hanya dapat dibaca dan ditulis dengan kata sandi ini. Ingatlah bahwa karena hanya Anda yang memiliki kata sandi ini, **hanya Anda** yang dapat membaca dan menulis ke kotak surat Anda saat mengaksesnya. Saat klien email Anda mencoba memeriksa email atau menyinkronkan, pesan baru Anda akan dipindahkan dari kotak surat sementara ini dan disimpan di file kotak surat sebenarnya menggunakan kata sandi yang Anda berikan. Perlu dicatat bahwa kotak surat sementara ini akan dibersihkan dan dihapus setelahnya sehingga hanya kotak surat yang dilindungi kata sandi Anda yang memiliki pesan tersebut.

   * **Jika Anda terhubung ke IMAP (misalnya menggunakan klien email seperti Apple Mail atau Thunderbird), maka kami tidak perlu menulis ke penyimpanan disk sementara. Kata sandi IMAP terenkripsi di memori Anda akan diambil dan digunakan. Secara real-time, ketika pesan berusaha dikirimkan kepada Anda, kami mengirim permintaan WebSocket ke semua server IMAP menanyakan apakah mereka memiliki sesi aktif untuk Anda (ini adalah bagian pengambilan), dan kemudian akan meneruskan kata sandi terenkripsi di memori tersebut – sehingga kami tidak perlu menulis ke kotak surat sementara, kami dapat menulis ke kotak surat terenkripsi Anda yang sebenarnya menggunakan kata sandi terenkripsi Anda.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Anda terhubung ke server IMAP menggunakan klien email.
         IMAP->>SQLite: Memindahkan pesan dari kotak surat sementara ke kotak surat alias Anda.
         Note over IMAP,SQLite: Kotak surat alias Anda hanya tersedia di memori menggunakan kata sandi IMAP.
         SQLite->>IMAP: Mengambil pesan sesuai permintaan klien email.
         IMAP->>You: Berhasil!
     ```

5. [Cadangan kotak surat terenkripsi Anda](#backups) dibuat setiap hari. Anda juga dapat meminta cadangan baru kapan saja atau mengunduh cadangan terbaru dari <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias. Jika Anda memutuskan untuk beralih ke layanan email lain, maka Anda dapat dengan mudah memigrasi, mengunduh, mengekspor, dan membersihkan kotak surat serta cadangan Anda kapan saja.


## Teknologi {#technologies}

### Basis Data {#databases}

Kami mengeksplorasi lapisan penyimpanan basis data lain yang mungkin, namun tidak ada yang memenuhi kebutuhan kami sebanyak SQLite:
| Database                                               |                                                                    Enkripsi-saat-beristirahat                                                                   |  [Kotak Surat Terisolasi](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Lisensi                           | [Digunakan di Mana-mana](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Ya dengan [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Domain Publik              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Tersedia hanya di MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Basis data relasional                               |                   :x: AGPL dan `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Hanya Jaringan](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Basis data relasional                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Belum diuji dan belum didukung?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Belum diuji dan belum didukung?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Ya](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Basis data relasional                               | :white_check_mark: `PostgreSQL` (mirip dengan `BSD` atau `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Hanya untuk InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Basis data relasional                               |          :white_check_mark: `GPLv2` dan `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Fitur hanya Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Basis data relasional                               |                  :x: `BUSL-1.1` dan lainnya                  |                             :x:                             |

> Berikut adalah [posting blog yang membandingkan beberapa opsi penyimpanan database SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) dalam tabel di atas.

### Keamanan {#security}

Kami selalu menggunakan [enkripsi-saat-beristirahat](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [enkripsi-saat-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") menggunakan :tangerine: [Tangerine](https://tangeri.ne), dan [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) enkripsi pada kotak surat. Selain itu kami menggunakan otentikasi dua faktor berbasis token (berbeda dengan SMS yang rentan terhadap [serangan man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), kunci SSH yang diputar dengan akses root dinonaktifkan, akses eksklusif ke server melalui alamat IP terbatas, dan lainnya.
Dalam kejadian [serangan evil maid](https://en.wikipedia.org/wiki/Evil_maid_attack) atau karyawan nakal dari vendor pihak ketiga, **kotak surat Anda masih hanya dapat dibuka dengan kata sandi yang Anda buat**. Tenang saja, kami tidak bergantung pada vendor pihak ketiga selain penyedia server kami yang mematuhi SOC Type 2 yaitu Cloudflare, DataPacket, Digital Ocean, GitHub, dan Vultr.

Tujuan kami adalah memiliki sesedikit mungkin [titik kegagalan tunggal](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Kotak Surat {#mailboxes}

> **tldr;** Server IMAP kami menggunakan database SQLite terenkripsi secara individual untuk masing-masing kotak surat Anda.

[SQLite adalah database embedded yang sangat populer](https://www.sqlite.org/mostdeployed.html) – saat ini berjalan di ponsel dan komputer Anda – [dan digunakan oleh hampir semua teknologi besar](https://www.sqlite.org/famous.html).

Misalnya, di server terenkripsi kami terdapat database SQLite kotak surat untuk `linux@example.com`, `info@example.com`, `hello@example.com` dan seterusnya – satu untuk masing-masing sebagai file database `.sqlite`. Kami juga tidak menamai file database dengan alamat email – melainkan menggunakan BSON ObjectID dan UUID unik yang dihasilkan yang tidak mengungkapkan siapa pemilik kotak surat atau alamat emailnya (misalnya `353a03f21e534321f5d6e267.sqlite`).

Masing-masing database ini sendiri dienkripsi menggunakan kata sandi Anda (yang hanya Anda miliki) dengan menggunakan [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Ini berarti bahwa kotak surat Anda dienkripsi secara individual, mandiri, [terkotak pasir](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)), dan portabel.

Kami telah menyetel SQLite dengan [PRAGMA](https://www.sqlite.org/pragma.html) berikut:

| `PRAGMA`                 | Tujuan                                                                                                                                                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Enkripsi database SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Referensi `better-sqlite3-multiple-ciphers` di bawah [Projects](#projects) untuk wawasan lebih lanjut.                        |
| `key="****************"` | Ini adalah kata sandi Anda yang didekripsi hanya di memori yang diteruskan melalui koneksi IMAP klien email Anda ke server kami. Instance database baru dibuat dan ditutup untuk setiap sesi baca dan tulis (untuk memastikan sandboxing dan isolasi).    |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [yang meningkatkan performa dan memungkinkan akses baca bersamaan](https://litestream.io/tips/#wal-journal-mode).                                                                             |
| `busy_timeout=5000`      | Mencegah kesalahan kunci tulis [saat penulisan lain sedang berlangsung](https://litestream.io/tips/#busy-timeout).                                                                                                                                       |
| `synchronous=NORMAL`     | Meningkatkan daya tahan transaksi [tanpa risiko korupsi data](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                           |
| `foreign_keys=ON`        | Memastikan referensi kunci asing (misalnya relasi dari satu tabel ke tabel lain) ditegakkan. [Secara default ini tidak diaktifkan di SQLite](https://www.sqlite.org/foreignkeys.html), tetapi untuk validasi dan integritas data harus diaktifkan.          |
| `encoding='UTF-8'`       | [Encoding default](https://www.sqlite.org/pragma.html#pragma_encoding) yang digunakan untuk memastikan konsistensi pengembang.                                                                                                                           |
> Semua default lainnya berasal dari SQLite seperti yang ditentukan dalam [dokumentasi PRAGMA resmi](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Konkruensi {#concurrency}

> **tldr;** Kami menggunakan `WebSocket` untuk pembacaan dan penulisan bersamaan ke kotak surat SQLite terenkripsi Anda.

#### Pembacaan {#reads}

Klien email Anda di ponsel mungkin menyelesaikan `imap.forwardemail.net` ke salah satu alamat IP Digital Ocean kami – dan klien desktop Anda mungkin menyelesaikan IP yang berbeda dari [penyedia](#providers) lain sama sekali.

Terlepas dari server IMAP mana yang dihubungkan oleh klien email Anda, kami ingin koneksi membaca dari database Anda secara real-time dengan akurasi 100%. Ini dilakukan melalui WebSockets.

#### Penulisan {#writes}

Penulisan ke database Anda sedikit berbeda – karena SQLite adalah database tertanam dan kotak surat Anda secara default berada dalam satu file.

Kami telah mengeksplorasi opsi seperti `litestream`, `rqlite`, dan `dqlite` di bawah – namun tidak ada yang memenuhi kebutuhan kami.

Untuk melakukan penulisan dengan write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") diaktifkan – kami perlu memastikan hanya satu server ("Primary") yang bertanggung jawab melakukannya. [WAL](https://www.sqlite.org/wal.html) secara drastis mempercepat konkruensi dan memungkinkan satu penulis dan banyak pembaca.

Primary berjalan di server data dengan volume yang dipasang berisi kotak surat terenkripsi. Dari sudut pandang distribusi, Anda dapat menganggap semua server IMAP individu di balik `imap.forwardemail.net` sebagai server sekunder ("Secondary").

Kami melakukan komunikasi dua arah dengan [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Server Primary menggunakan instance dari server `WebSocketServer` dari [ws](https://github.com/websockets/ws).
* Server Secondary menggunakan instance klien `WebSocket` dari [ws](https://github.com/websockets/ws) yang dibungkus dengan [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) dan [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Dua pembungkus ini memastikan `WebSocket` dapat tersambung kembali dan dapat mengirim serta menerima data untuk penulisan database tertentu.

### Cadangan {#backups}

> **tldr;** Cadangan kotak surat terenkripsi Anda dibuat setiap hari. Anda juga dapat langsung meminta cadangan baru atau mengunduh cadangan terbaru kapan saja dari <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias.

Untuk cadangan, kami cukup menjalankan perintah SQLite `VACUUM INTO` setiap hari selama pemrosesan perintah IMAP, yang memanfaatkan kata sandi terenkripsi Anda dari koneksi IMAP dalam memori. Cadangan disimpan jika tidak ada cadangan yang ada terdeteksi atau jika hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) pada file telah berubah dibandingkan dengan cadangan terbaru.

Perlu dicatat bahwa kami menggunakan perintah `VACUUM INTO` dibandingkan perintah `backup` bawaan karena jika sebuah halaman dimodifikasi selama operasi perintah `backup`, maka harus dimulai ulang. Perintah `VACUUM INTO` akan mengambil snapshot. Lihat komentar ini di [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) dan [Hacker News](https://news.ycombinator.com/item?id=31387556) untuk wawasan lebih lanjut.

Selain itu kami menggunakan `VACUUM INTO` dibandingkan `backup`, karena perintah `backup` akan meninggalkan database tidak terenkripsi untuk periode singkat sampai `rekey` dipanggil (lihat komentar GitHub ini [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) untuk wawasan).

Secondary akan menginstruksikan Primary melalui koneksi `WebSocket` untuk menjalankan cadangan – dan Primary kemudian akan menerima perintah tersebut dan selanjutnya:

1. Terhubung ke kotak surat terenkripsi Anda.
2. Mengakuisisi kunci tulis.
3. Menjalankan checkpoint WAL melalui `wal_checkpoint(PASSIVE)`.
4. Menjalankan perintah SQLite `VACUUM INTO`.
5. Memastikan file yang disalin dapat dibuka dengan kata sandi terenkripsi (pengamanan/anti kesalahan).
6. Mengunggahnya ke Cloudflare R2 untuk penyimpanan (atau penyedia Anda sendiri jika ditentukan).
<!--
7. Kompres file cadangan yang dihasilkan dengan `gzip`.
8. Unggah ke Cloudflare R2 untuk penyimpanan (atau penyedia Anda sendiri jika ditentukan).
-->

Ingat bahwa kotak surat Anda dienkripsi – dan meskipun kami memiliki pembatasan IP dan langkah-langkah otentikasi lain untuk komunikasi WebSocket – jika terjadi pelaku jahat, Anda dapat yakin bahwa kecuali payload WebSocket memiliki kata sandi IMAP Anda, ia tidak dapat membuka database Anda.

Saat ini hanya satu cadangan yang disimpan per kotak surat, tetapi di masa depan kami mungkin menawarkan pemulihan titik waktu ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Pencarian {#search}

Server IMAP kami mendukung perintah `SEARCH` dengan kueri kompleks, ekspresi reguler, dan lainnya.

Performa pencarian cepat berkat [FTS5](https://www.sqlite.org/fts5.html) dan [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Kami menyimpan nilai `Date` di kotak surat SQLite sebagai string [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) melalui [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (dengan zona waktu UTC agar perbandingan kesetaraan berfungsi dengan benar).

Indeks juga disimpan untuk semua properti yang ada dalam kueri pencarian.

### Proyek {#projects}

Berikut adalah tabel yang menguraikan proyek-proyek yang kami gunakan dalam kode sumber dan proses pengembangan kami (diurutkan secara alfabetis):

| Proyek                                                                                       | Tujuan                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | Platform otomasi DevOps untuk memelihara, menskalakan, dan mengelola seluruh armada server kami dengan mudah.                                                                                                                                                                                                                                                       |
| [Bree](https://github.com/breejs/bree)                                                        | Penjadwal pekerjaan untuk Node.js dan JavaScript dengan dukungan cron, tanggal, ms, later, dan ramah pengguna.                                                                                                                                                                                                                                                     |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Perpustakaan logging JavaScript dan Node.js yang ramah pengembang dengan keamanan dan privasi sebagai fokus.                                                                                                                                                                                                                                                        |
| [Lad](https://github.com/ladjs/lad)                                                           | Kerangka kerja Node.js yang mendukung seluruh arsitektur dan desain rekayasa kami dengan MVC dan lainnya.                                                                                                                                                                                                                                                          |
| [MongoDB](https://www.mongodb.com/)                                                           | Solusi basis data NoSQL yang kami gunakan untuk menyimpan semua data lain di luar kotak surat (misalnya akun Anda, pengaturan, domain, dan konfigurasi alias).                                                                                                                                                                                                     |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | Pemodel objek dokumen MongoDB ("ODM") yang kami gunakan di seluruh tumpukan kami. Kami menulis pembantu khusus yang memungkinkan kami untuk terus menggunakan **Mongoose dengan SQLite** :tada:                                                                                                                                                                  |
| [Node.js](https://nodejs.org/en)                                                              | Node.js adalah lingkungan runtime JavaScript lintas platform dan sumber terbuka yang menjalankan semua proses server kami.                                                                                                                                                                                                                                         |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Paket Node.js untuk mengirim email, membuat koneksi, dan lainnya. Kami adalah sponsor resmi proyek ini.                                                                                                                                                                                                                                                            |
| [Redis](https://redis.io/)                                                                    | Basis data dalam memori untuk caching, saluran publish/subscribe, dan permintaan DNS over HTTPS.                                                                                                                                                                                                                                                                    |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Ekstensi enkripsi untuk SQLite yang memungkinkan seluruh file database dienkripsi (termasuk write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), jurnal, rollback, …).                                                                                                                                                                                      |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Editor SQLite visual (yang juga bisa Anda gunakan) untuk menguji, mengunduh, dan melihat kotak surat pengembangan.                                                                                                                                                                                                                                                 |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Lapisan basis data tertanam untuk penyimpanan IMAP yang skalabel, mandiri, cepat, dan tangguh.                                                                                                                                                                                                                                                                      |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Alat anti-spam, penyaringan email, dan pencegahan phishing Node.js (alternatif kami untuk [Spam Assassin](https://spamassassin.apache.org/) dan [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                         |
| [Tangerine](https://tangeri.ne)                                                               | Permintaan DNS over HTTPS dengan Node.js dan caching menggunakan Redis – yang memastikan konsistensi global dan banyak lagi.                                                                                                                                                                                                                                        |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Tim pengembangan kami menggunakan ini (dan juga merekomendasikannya) sebagai **klien email yang disarankan untuk digunakan dengan Forward Email**.                                                                                                                                                                                                                 |
| [UTM](https://github.com/utmapp/UTM)                                                          | Tim pengembangan kami menggunakan ini untuk membuat mesin virtual untuk iOS dan macOS guna menguji berbagai klien email (secara paralel) dengan server IMAP dan SMTP kami.                                                                                                                                                                                         |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Sistem operasi server berbasis Linux sumber terbuka modern yang menjalankan seluruh infrastruktur kami.                                                                                                                                                                                                                                                            |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | Perpustakaan server IMAP – lihat catatannya tentang [deduplikasi lampiran](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) dan [dukungan protokol IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                             |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Perpustakaan API cepat dan sederhana untuk Node.js untuk berinteraksi dengan SQLite3 secara programatik.                                                                                                                                                                                                                                                            |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Kerangka kerja email yang ramah pengembang untuk membuat, melihat pratinjau, dan mengirim email kustom (misalnya notifikasi akun dan lainnya).                                                                                                                                                                                                                      |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | Pembuat kueri SQL menggunakan sintaks gaya Mongo. Ini menghemat waktu tim pengembangan kami karena kami dapat terus menulis dengan gaya Mongo di seluruh tumpukan dengan pendekatan agnostik basis data. **Ini juga membantu menghindari serangan injeksi SQL dengan menggunakan parameter kueri.**                                                             |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | Utilitas SQL untuk mengekstrak informasi tentang skema basis data yang ada. Ini memungkinkan kami dengan mudah memvalidasi bahwa semua indeks, tabel, kolom, batasan, dan lainnya valid dan `1:1` dengan yang seharusnya. Kami bahkan menulis pembantu otomatis untuk menambahkan kolom dan indeks baru jika ada perubahan pada skema basis data (dengan peringatan kesalahan yang sangat rinci juga). |
| [knex](https://github.com/knex/knex)                                                          | Pembuat kueri SQL yang kami gunakan hanya untuk migrasi basis data dan validasi skema melalui `knex-schema-inspector`.                                                                                                                                                                                                                                               |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Terjemahan frasa [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) otomatis dengan dukungan untuk Markdown menggunakan [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                           |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Paket Node.js untuk menyelesaikan dan membuat koneksi dengan server MX serta menangani kesalahan.                                                                                                                                                                                                                                                                   |
| [pm2](https://github.com/Unitech/pm2)                                                         | Manajer proses produksi Node.js dengan load balancer bawaan ([disetel dengan baik](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) untuk performa).                                                                                                                                                                                             |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | Perpustakaan server SMTP – kami menggunakan ini untuk server pertukaran surat ("MX") dan server SMTP keluar kami.                                                                                                                                                                                                                                                  |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Alat berguna untuk menguji server IMAP terhadap tolok ukur dan kompatibilitas protokol IMAP spesifikasi RFC. Proyek ini dibuat oleh tim [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (server IMAP dan POP3 sumber terbuka aktif sejak Juli 2002). Kami menguji server IMAP kami secara ekstensif dengan alat ini.                                         |
> Anda dapat menemukan proyek lain yang kami gunakan di [kode sumber kami di GitHub](https://github.com/forwardemail).

### Penyedia {#providers}

| Penyedia                                        | Tujuan                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Penyedia DNS, pemeriksaan kesehatan, load balancer, dan penyimpanan cadangan menggunakan [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting kode sumber, CI/CD, dan manajemen proyek.                                                                          |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting server khusus dan basis data terkelola.                                                                              |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hosting server khusus.                                                                                                    |
| [DataPacket](https://www.datapacket.com)        | Hosting server khusus.                                                                                                    |


## Pemikiran {#thoughts}

### Prinsip {#principles}

Forward Email dirancang sesuai dengan prinsip-prinsip berikut:

1. Selalu ramah pengembang, fokus pada keamanan dan privasi, serta transparan.
2. Mematuhi [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), dan [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Menargetkan pengembang yang mandiri, bootstrapped, dan [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html)

### Eksperimen {#experiments}

> **tldr;** Pada akhirnya menggunakan penyimpanan objek kompatibel S3 dan/atau Tabel Virtual secara teknis tidak layak karena alasan performa dan rentan terhadap kesalahan akibat keterbatasan memori.

Kami telah melakukan beberapa eksperimen menuju solusi SQLite final kami seperti yang dibahas di atas.

Salah satunya adalah mencoba menggunakan [rclone]() dan SQLite bersama dengan lapisan penyimpanan kompatibel S3.

Eksperimen tersebut membawa kami untuk lebih memahami dan menemukan kasus-kasus tepi seputar penggunaan rclone, SQLite, dan [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Jika Anda mengaktifkan flag `--vfs-cache-mode writes` dengan rclone, maka pembacaan akan baik, namun penulisan akan di-cache.
  * Jika Anda memiliki beberapa server IMAP yang tersebar secara global, maka cache akan tidak sinkron di antara mereka kecuali Anda memiliki satu penulis dan beberapa pendengar (misalnya pendekatan pub/sub).
  * Ini sangat kompleks dan menambahkan kompleksitas seperti ini akan menghasilkan lebih banyak titik kegagalan tunggal.
  * Penyedia penyimpanan kompatibel S3 tidak mendukung perubahan file parsial – yang berarti setiap perubahan pada file `.sqlite` akan mengakibatkan perubahan lengkap dan pengunggahan ulang database.
  * Solusi lain seperti `rsync` ada, tetapi mereka tidak fokus pada dukungan write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – jadi kami akhirnya meninjau Litestream. Untungnya penggunaan enkripsi kami sudah mengenkripsi file [WAL](https://www.sqlite.org/wal.html) untuk kami, jadi kami tidak perlu bergantung pada Litestream untuk itu. Namun kami belum yakin sepenuhnya pada Litestream untuk penggunaan produksi dan memiliki beberapa catatan di bawah ini.
  * Menggunakan opsi `--vfs-cache-mode writes` ini (satu-satunya cara menggunakan SQLite melalui `rclone` untuk penulisan) akan mencoba menyalin seluruh database dari awal di memori – menangani satu mailbox 10 GB masih OK, namun menangani beberapa mailbox dengan penyimpanan sangat besar akan menyebabkan server IMAP mengalami keterbatasan memori dan kesalahan `ENOMEM`, segmentation fault, serta korupsi data.
* Jika Anda mencoba menggunakan [Tabel Virtual](https://www.sqlite.org/vtab.html) SQLite (misalnya menggunakan [s3db](https://github.com/jrhy/s3db)) untuk menyimpan data secara langsung di lapisan penyimpanan kompatibel S3, maka Anda akan menghadapi beberapa masalah lagi:
  * Pembacaan dan penulisan akan sangat lambat karena endpoint API S3 harus diakses dengan metode HTTP `GET`, `PUT`, `HEAD`, dan `POST`.
  * Tes pengembangan menunjukkan bahwa melebihi 500K-1M+ catatan pada internet fiber masih dibatasi oleh throughput penulisan dan pembacaan ke penyedia kompatibel S3. Misalnya, pengembang kami menjalankan loop `for` untuk melakukan pernyataan SQL `INSERT` berurutan dan juga yang menulis data dalam jumlah besar secara massal. Dalam kedua kasus, performanya sangat lambat.
  * Tabel virtual **tidak dapat memiliki indeks**, pernyataan `ALTER TABLE`, dan [batasan](https://sqlite.org/lang_createvtab.html) [lainnya](https://stackoverflow.com/a/12507650) – yang menyebabkan penundaan hingga 1-2 menit atau lebih tergantung jumlah data.
  * Objek disimpan tanpa enkripsi dan tidak ada dukungan enkripsi asli yang tersedia.
* Kami juga mengeksplorasi penggunaan [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) yang secara konseptual dan teknis mirip dengan poin sebelumnya (jadi memiliki masalah yang sama). Kemungkinan adalah menggunakan build `sqlite3` khusus yang dibungkus dengan enkripsi seperti [wxSQLite3](https://github.com/utelle/wxsqlite3) (yang saat ini kami gunakan dalam solusi kami di atas) melalui [pengeditan file setup](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Pendekatan potensial lain adalah menggunakan ekstensi [multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), namun ini memiliki batasan 32 GB dan akan memerlukan pembangunan dan pengembangan yang kompleks.
* Pernyataan `ALTER TABLE` diperlukan (jadi ini sepenuhnya menyingkirkan penggunaan Tabel Virtual). Kami membutuhkan pernyataan `ALTER TABLE` agar hook kami dengan `knex-schema-inspector` bekerja dengan benar – yang memastikan data tidak korup dan baris yang diambil dapat dikonversi menjadi dokumen valid sesuai definisi skema `mongoose` kami (yang mencakup validasi constraint, tipe variabel, dan data arbitrer).
* Hampir semua proyek kompatibel S3 terkait SQLite di komunitas open-source menggunakan Python (bukan JavaScript yang kami gunakan untuk 100% stack kami).
* Perpustakaan kompresi seperti [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (lihat [komentar](https://news.ycombinator.com/item?id=32303762)) terlihat menjanjikan, tetapi [mungkin belum siap untuk penggunaan produksi](https://github.com/phiresky/sqlite-zstd#usage). Sebagai gantinya, kompresi sisi aplikasi pada tipe data seperti `String`, `Object`, `Map`, `Array`, `Set`, dan `Buffer` akan menjadi pendekatan yang lebih bersih dan mudah (dan juga lebih mudah untuk migrasi, karena kami bisa menyimpan flag `Boolean` atau kolom – atau bahkan menggunakan `PRAGMA` `user_version=1` untuk kompresi atau `user_version=0` untuk tanpa kompresi sebagai metadata database).
  * Untungnya kami sudah menerapkan deduplikasi lampiran di penyimpanan server IMAP kami – sehingga setiap pesan dengan lampiran yang sama tidak menyimpan salinan lampiran – melainkan satu lampiran disimpan untuk beberapa pesan dan thread dalam mailbox (dan referensi asing digunakan selanjutnya).
* Proyek Litestream, yang merupakan solusi replikasi dan cadangan SQLite sangat menjanjikan dan kemungkinan besar akan kami gunakan di masa depan.
  * Bukan untuk merendahkan penulis – karena kami menyukai karya dan kontribusi mereka pada open-source selama lebih dari satu dekade – namun dari penggunaan nyata tampaknya ada [banyak masalah](https://github.com/benbjohnson/litestream/issues) dan [potensi kehilangan data dari penggunaan](https://github.com/benbjohnson/litestream/issues/218).
* Pemulihan cadangan harus tanpa hambatan dan sederhana. Menggunakan solusi seperti MongoDB dengan `mongodump` dan `mongoexport` tidak hanya melelahkan, tetapi juga memakan waktu dan memiliki kompleksitas konfigurasi.
  * Database SQLite membuatnya sederhana (karena hanya satu file).
  * Kami ingin merancang solusi di mana pengguna dapat mengambil mailbox mereka dan pergi kapan saja.
    * Perintah Node.js sederhana untuk `fs.unlink('mailbox.sqlite'))` dan file tersebut akan terhapus permanen dari penyimpanan disk.
    * Kami juga dapat menggunakan API kompatibel S3 dengan HTTP `DELETE` untuk dengan mudah menghapus snapshot dan cadangan bagi pengguna.
  * SQLite adalah solusi yang paling sederhana, tercepat, dan paling hemat biaya.
### Kekurangan alternatif {#lack-of-alternatives}

Sejauh yang kami ketahui, tidak ada layanan email lain yang dirancang seperti ini maupun yang bersifat open-source.

Kami *berpikir ini mungkin disebabkan* oleh layanan email yang ada menggunakan teknologi warisan dalam produksi dengan [kode spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Sebagian besar jika tidak semua penyedia layanan email yang ada adalah tertutup sumbernya atau mengiklankan sebagai open-source, **tetapi kenyataannya hanya front-end mereka yang bersifat open-source.**

**Bagian paling sensitif dari email** (penyimpanan/IMAP/SMTP yang sebenarnya) **semua dilakukan di back-end (server), dan *bukan* di front-end (klien)**.

### Coba Forward Email {#try-out-forward-email}

Daftar hari ini di <https://forwardemail.net>! :rocket:
