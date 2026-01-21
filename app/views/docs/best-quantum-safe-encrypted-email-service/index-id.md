# Email Tahan Kuantum: Bagaimana kami menggunakan kotak surat SQLite terenkripsi untuk menjaga keamanan email Anda {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Kata pengantar](#foreword)
* [Perbandingan penyedia layanan email](#email-service-provider-comparison)
* [bagaimana cara kerjanya](#how-does-it-work)
* [Teknologi](#technologies)
  * [Basis Data](#databases)
  * [Keamanan](#security)
  * [Kotak surat](#mailboxes)
  * [Konkurensi](#concurrency)
  * [Cadangan](#backups)
  * [Mencari](#search)
  * [Proyek](#projects)
  * [Penyedia](#providers)
* [Pikiran](#thoughts)
  * [Prinsip](#principles)
  * [Percobaan](#experiments)
  * [Kurangnya alternatif](#lack-of-alternatives)
  * [Coba Email Teruskan](#try-out-forward-email)

## Kata Pengantar {#foreword}

> \[!IMPORTANT]
> Layanan email kami [100% sumber terbuka](https://github.com/forwardemail) dan berfokus pada privasi melalui kotak surat SQLite yang aman dan terenkripsi.

Sampai kami meluncurkan [Dukungan IMAP](/faq#do-you-support-receiving-email-with-imap), kami menggunakan MongoDB untuk kebutuhan penyimpanan data persisten kami.

Teknologi ini luar biasa dan kita masih menggunakannya hingga saat ini – tetapi untuk memiliki enkripsi yang aktif dengan MongoDB, Anda perlu menggunakan penyedia yang menawarkan MongoDB Enterprise, seperti Digital Ocean atau Mongo Atlas – atau membayar lisensi perusahaan (dan selanjutnya harus bekerja dengan latensi tim penjualan).

Tim kami di [Teruskan Email](https://forwardemail.net) membutuhkan solusi penyimpanan yang ramah pengembang, skalabel, andal, dan terenkripsi untuk kotak surat IMAP. Sebagai pengembang sumber terbuka, menggunakan teknologi yang mengharuskan Anda membayar biaya lisensi untuk mendapatkan fitur enkripsi-saat-diam bertentangan dengan [prinsip-prinsip kami](#principles) – sehingga kami bereksperimen, meneliti, dan mengembangkan solusi baru dari awal untuk memenuhi kebutuhan ini.

Alih-alih menggunakan database bersama untuk menyimpan kotak surat Anda, kami menyimpan dan mengenkripsi kotak surat Anda secara individual dengan kata sandi Anda (yang hanya Anda yang tahu). **Layanan email kami sangat aman sehingga jika Anda lupa kata sandi, Anda akan kehilangan kotak surat Anda** (dan perlu memulihkannya dengan cadangan offline atau memulai dari awal).

Teruslah membaca selagi kami membahasnya lebih dalam di bawah ini dengan [perbandingan penyedia layanan email](#email-service-provider-comparison), [cara kerja layanan kami](#how-does-it-work), [tumpukan teknologi kami](#technologies), dan banyak lagi.

## Perbandingan penyedia layanan email {#email-service-provider-comparison}

Kami adalah satu-satunya penyedia layanan email 100% sumber terbuka dan berfokus pada privasi yang menyimpan kotak surat SQLite yang dienkripsi secara individual, menawarkan domain, alias, dan pengguna tanpa batas, dan memiliki dukungan SMTP, IMAP, dan POP3 keluar:

**Tidak seperti penyedia email lainnya, Anda tidak perlu membayar biaya penyimpanan per domain atau alias dengan Forward Email.** Penyimpanan digunakan bersama di seluruh akun Anda – jadi jika Anda memiliki beberapa nama domain kustom dan beberapa alias di setiap domain, kami adalah solusi yang tepat. Perlu diketahui bahwa Anda masih dapat menerapkan batas penyimpanan jika diinginkan per domain atau alias.

<a href="/blog/layanan-email-terbaik" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Baca Perbandingan Layanan Email <i class="fa fa-search-plus"></i></a>

## Bagaimana cara kerjanya {#how-does-it-work}

1. Menggunakan klien email Anda seperti Apple Mail, Thunderbird, Gmail, atau Outlook – Anda terhubung ke server [IMAP](/faq#do-you-support-receiving-email-with-imap) kami yang aman menggunakan nama pengguna dan kata sandi Anda:

* Nama pengguna Anda adalah alias lengkap dengan domain Anda, misalnya `hello@example.com`.
* Kata sandi Anda dibuat secara acak dan hanya ditampilkan selama 30 detik ketika Anda mengklik <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> dari <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias.

2. Setelah terhubung, klien email Anda akan mengirimkan [Perintah protokol IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) ke server IMAP kami agar kotak surat Anda tetap sinkron. Ini termasuk menulis dan menyimpan draf email dan tindakan lain yang mungkin Anda lakukan (misalnya, memberi label email sebagai Penting atau menandai email sebagai Spam/Sampah).

3. Server pertukaran email (umumnya dikenal sebagai server "MX") menerima email masuk baru dan menyimpannya di kotak surat Anda. Saat ini terjadi, klien email Anda akan menerima notifikasi dan menyinkronkan kotak surat Anda. Server pertukaran email kami dapat meneruskan email Anda ke satu atau beberapa penerima (termasuk [kait web](/faq#do-you-support-webhooks)), menyimpan email Anda di penyimpanan IMAP terenkripsi kami, **atau keduanya**!

> \[!TIP]
> Tertarik mempelajari lebih lanjut? Baca [cara mengatur penerusan email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [cara kerja layanan pertukaran surat kami](/faq#how-does-your-email-forwarding-system-work), atau lihat [pemandu kami](/guides).

4. Di balik layar, desain penyimpanan email aman kami bekerja dengan dua cara untuk menjaga kotak surat Anda tetap terenkripsi dan hanya dapat diakses oleh Anda:

* Saat surat baru diterima untuk Anda dari pengirim, server pertukaran surat kami menulis ke kotak surat individual, sementara, dan terenkripsi untuk Anda.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Saat Anda terhubung ke server IMAP kami dengan klien email Anda, kata sandi Anda akan dienkripsi di dalam memori dan digunakan untuk membaca dan menulis ke kotak surat Anda. Kotak surat Anda hanya dapat dibaca dan ditulis dengan kata sandi ini. Perlu diingat bahwa karena Anda satu-satunya yang memiliki kata sandi ini, **hanya Anda** yang dapat membaca dan menulis ke kotak surat Anda saat mengaksesnya. Saat klien email Anda mencoba memeriksa email atau sinkronisasi berikutnya, pesan baru Anda akan ditransfer dari kotak surat sementara ini dan disimpan di berkas kotak surat Anda yang sebenarnya menggunakan kata sandi yang Anda berikan. Harap dicatat bahwa kotak surat sementara ini akan dihapus setelahnya sehingga hanya kotak surat Anda yang dilindungi kata sandi yang menyimpan pesan-pesan tersebut.

* **Jika Anda terhubung ke IMAP (misalnya menggunakan klien email seperti Apple Mail atau Thunderbird), kami tidak perlu menulis ke penyimpanan disk sementara. Kata sandi IMAP terenkripsi di dalam memori Anda akan diambil dan digunakan. Secara real-time, ketika sebuah pesan mencoba dikirimkan kepada Anda, kami akan mengirimkan permintaan WebSocket ke semua server IMAP untuk menanyakan apakah mereka memiliki sesi aktif untuk Anda (inilah bagian pengambilan), dan selanjutnya akan meneruskan kata sandi terenkripsi di dalam memori tersebut – jadi kami tidak perlu menulis ke kotak surat sementara, kami dapat menulis ke kotak surat terenkripsi Anda yang sebenarnya menggunakan kata sandi terenkripsi Anda.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Pencadangan kotak surat terenkripsi Anda](#backups) dibuat setiap hari. Anda juga dapat meminta cadangan baru kapan saja atau mengunduh cadangan terbaru dari <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias. Jika Anda memutuskan untuk beralih ke layanan email lain, Anda dapat dengan mudah memigrasikan, mengunduh, mengekspor, dan menghapus kotak surat dan cadangan Anda kapan saja.

## Teknologi {#technologies}

### Basis Data {#databases}

Kami menjajaki kemungkinan lapisan penyimpanan basis data lainnya, namun tidak ada yang memenuhi persyaratan kami sebanyak SQLite:

| Basis Data | Enkripsi-saat-diam | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Kotak Surat | Lisensi | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :bintang: | :white_check_mark: Ya dengan [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :tanda_centang_putih: | :white_check_mark: Domain Publik | :tanda_centang_putih: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Basis data relasional | :x: AGPL dan `SSPL-1.0` | :X: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Basis data relasional | :tanda_centang_putih: __KODE_SEL_0__ | :X: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :tanda_centang_putih: __KODE_SEL_0__ | :X: |
| [PostgreSQL](https://www.postgresql.org/) | :tanda_centang_putih: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Basis data relasional | :white_check_mark: `PostgreSQL` (mirip dengan `BSD` atau `MIT`) | :X: |
| [MariaDB](https://mariadb.com/) | :tanda_centang_putih: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Basis data relasional | :white_check_mark: `GPLv2` dan `BUSL-1.1` | :X: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Basis data relasional | :x: `BUSL-1.1` dan lainnya | :X: |

> Berikut adalah [postingan blog yang membandingkan beberapa opsi penyimpanan database SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) pada tabel di atas.

### Keamanan {#security}

Kami selalu menggunakan [enkripsi-saat-diam](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [enkripsi-dalam-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS melalui HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") menggunakan enkripsi :tangerine: [Jeruk keprok](https://tangeri.ne), dan [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) di kotak surat. Selain itu, kami menggunakan autentikasi dua faktor berbasis token (berbeda dengan SMS yang rentan terhadap [serangan perantara](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), kunci SSH yang dirotasi dengan akses root dinonaktifkan, akses eksklusif ke server melalui alamat IP terbatas, dan banyak lagi.

Jika terjadi [serangan pembantu jahat](https://en.wikipedia.org/wiki/Evil_maid_attack) atau karyawan nakal dari vendor pihak ketiga, **kotak surat Anda tetap hanya dapat dibuka dengan kata sandi yang Anda buat**. Yakinlah, kami tidak bergantung pada vendor pihak ketiga mana pun selain penyedia server keluhan SOC Tipe 2 kami, yaitu Cloudflare, DataPacket, Digital Ocean, dan Vultr.

Sasaran kami adalah memiliki [titik kegagalan tunggal](https://en.wikipedia.org/wiki/Single_point_of_failure) sesedikit mungkin.

### Kotak Surat {#mailboxes}

> **tldr;** Server IMAP kami menggunakan basis data SQLite yang dienkripsi secara individual untuk setiap kotak surat Anda.

[SQLite adalah salah satu yang sangat populer](https://www.sqlite.org/mostdeployed.html) basis data tertanam – saat ini berjalan di ponsel dan komputer Anda – [dan digunakan oleh hampir semua teknologi utama](https://www.sqlite.org/famous.html).

Misalnya, di server terenkripsi kami terdapat kotak surat basis data SQLite untuk `linux@example.com`, `info@example.com`, `hello@example.com`, dan seterusnya – satu untuk masing-masing sebagai berkas basis data `.sqlite`. Kami juga tidak memberi nama berkas basis data dengan alamat email – sebagai gantinya, kami menggunakan ID Objek BSON dan UUID unik yang dihasilkan, yang tidak membagikan siapa pemilik kotak surat tersebut atau alamat emailnya (misalnya, `353a03f21e534321f5d6e267.sqlite`).

Masing-masing basis data ini dienkripsi sendiri menggunakan kata sandi Anda (yang hanya Anda miliki) menggunakan [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Ini berarti kotak surat Anda dienkripsi secara individual, mandiri ([kotak pasir](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)), dan portabel.

Kami telah menyempurnakan SQLite dengan [PRAGMA](https://www.sqlite.org/pragma.html) berikut:

| `PRAGMA` | Tujuan |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Lihat `better-sqlite3-multiple-ciphers` di bawah [Projects](#projects) untuk informasi lebih lanjut. |
| `key="****************"` | Ini adalah kata sandi terdekripsi khusus di dalam memori Anda yang diteruskan melalui koneksi IMAP klien email Anda ke server kami. Instans basis data baru dibuat dan ditutup untuk setiap sesi baca dan tulis (untuk memastikan sandboxing dan isolasi). |
| `journal_model=WAL` | Catatan-tulis-depan ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Mencegah kesalahan kunci tulis [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Meningkatkan daya tahan transaksi [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Menegakkan bahwa referensi kunci asing (misalnya relasi dari satu tabel ke tabel lain) ditegakkan. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), tetapi untuk validasi dan integritas data harus diaktifkan. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) digunakan untuk memastikan kewarasan pengembang. |

> Semua default lainnya berasal dari SQLite seperti yang ditetapkan dari [dokumentasi resmi PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Konkurensi {#concurrency}

> **tldr;** Kami menggunakan `WebSocket` untuk pembacaan dan penulisan serentak ke kotak surat SQLite Anda yang terenkripsi.

#### Membaca {#reads}

Klien email di ponsel Anda mungkin menyelesaikan `imap.forwardemail.net` ke salah satu alamat IP Digital Ocean kami – dan klien desktop Anda mungkin menyelesaikan IP terpisah dari [penyedia](#providers) yang berbeda sama sekali.

Apa pun server IMAP yang terhubung dengan klien email Anda, kami ingin koneksi tersebut membaca dari basis data Anda secara real-time dengan akurasi 100%. Hal ini dilakukan melalui WebSockets.

#### Menulis {#writes}

Menulis ke database Anda sedikit berbeda – karena SQLite adalah database tertanam dan kotak surat Anda berada dalam satu file secara default.

Kami telah menjajaki opsi seperti `litestream`, `rqlite`, dan `dqlite` di bawah ini – namun tidak satu pun memenuhi persyaratan kami.

Untuk menyelesaikan penulisan dengan pencatatan awal ("[WAL](https://www.sqlite.org/wal.html)") diaktifkan, kita perlu memastikan bahwa hanya satu server ("Utama") yang bertanggung jawab untuk melakukannya. [WAL](https://www.sqlite.org/wal.html) secara drastis mempercepat konkurensi dan memungkinkan satu penulis dan beberapa pembaca.

Server Utama berjalan di server data dengan volume terpasang yang berisi kotak surat terenkripsi. Dari sudut pandang distribusi, Anda dapat menganggap semua server IMAP individual di belakang `imap.forwardemail.net` sebagai server sekunder ("Sekunder").

Kami melakukan komunikasi dua arah dengan [Soket Web](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Server utama menggunakan instans server `WebSocketServer` dari [ws](https://github.com/websockets/ws).
* Server sekunder menggunakan instans klien `WebSocket` dari [ws](https://github.com/websockets/ws) yang dibungkus dengan [websocket-seperti-yang-dijanjikan](https://github.com/vitalets/websocket-as-promised) dan [menghubungkan kembali-websocket](https://github.com/opensumi/reconnecting-websocket). Kedua pembungkus ini memastikan bahwa `WebSocket` terhubung kembali dan dapat mengirim serta menerima data untuk penulisan basis data tertentu.

### Cadangan {#backups}

**tldr;** Pencadangan kotak surat terenkripsi Anda dilakukan setiap hari. Anda juga dapat langsung meminta cadangan baru atau mengunduh cadangan terbaru kapan saja dari <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias.

Untuk pencadangan, kami cukup menjalankan perintah SQLite `VACUUM INTO` setiap hari selama pemrosesan perintah IMAP, yang memanfaatkan kata sandi terenkripsi Anda dari koneksi IMAP dalam memori. Cadangan disimpan jika tidak ada cadangan yang terdeteksi atau jika hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) pada berkas telah berubah dibandingkan dengan cadangan terbaru.

Perhatikan bahwa kami menggunakan perintah `VACUUM INTO`, bukan perintah bawaan `backup`. Jika suatu halaman dimodifikasi selama operasi perintah `backup`, maka halaman tersebut harus dimulai ulang. Perintah `VACUUM INTO` akan mengambil snapshot. Lihat komentar tentang [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) dan [Berita Peretas](https://news.ycombinator.com/item?id=31387556) untuk informasi lebih lanjut.

Selain itu, kami menggunakan `VACUUM INTO` dan bukan `backup`, karena perintah `backup` akan membiarkan basis data tidak terenkripsi untuk beberapa saat hingga `rekey` dipanggil (lihat GitHub [komentar](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) ini untuk wawasan).

Secondary akan memerintahkan Primary melalui koneksi `WebSocket` untuk menjalankan pencadangan – dan Primary kemudian akan menerima perintah untuk melakukannya dan selanjutnya akan:

1. Hubungkan ke kotak surat terenkripsi Anda.
2. Dapatkan kunci tulis.
3. Jalankan titik pemeriksaan WAL melalui `wal_checkpoint(PASSIVE)`.
4. Jalankan perintah SQLite `VACUUM INTO`.
5. Pastikan berkas yang disalin dapat dibuka dengan kata sandi terenkripsi (pengamanan/pengamanan dummy).
6. Unggah ke Cloudflare R2 untuk penyimpanan (atau penyedia Anda sendiri jika ditentukan).

<!--
7. Kompres berkas cadangan yang dihasilkan dengan `gzip`.
8. Unggah ke Cloudflare R2 untuk penyimpanan (atau penyedia Anda sendiri jika ditentukan).
-->

Ingatlah bahwa kotak surat Anda dienkripsi – dan meskipun kami memiliki batasan IP dan langkah-langkah autentikasi lain untuk komunikasi WebSocket – jika terjadi pelaku jahat, Anda dapat yakin bahwa kecuali muatan WebSocket memiliki kata sandi IMAP Anda, ia tidak dapat membuka basis data Anda.

Saat ini, hanya satu cadangan yang disimpan per kotak surat, tetapi di masa mendatang kami mungkin menawarkan pemulihan titik waktu ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Cari {#search}

Server IMAP kami mendukung perintah `SEARCH` dengan kueri kompleks, ekspresi reguler, dan banyak lagi.

Kinerja pencarian yang cepat berkat [FTS5](https://www.sqlite.org/fts5.html) dan [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Kami menyimpan nilai `Date` dalam kotak surat SQLite sebagai string [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) melalui [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (dengan zona waktu UTC agar perbandingan kesetaraan berfungsi dengan benar).

Indeks juga disimpan untuk semua properti yang ada dalam kueri penelusuran.

### Proyek {#projects}

Berikut tabel yang menguraikan proyek yang kami gunakan dalam kode sumber dan proses pengembangan (diurutkan berdasarkan abjad):

| Proyek | Tujuan |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Platform otomatisasi DevOps untuk memelihara, meningkatkan skala, dan mengelola seluruh armada server kami dengan mudah. |
| [Bree](https://github.com/breejs/bree) | Penjadwal pekerjaan untuk Node.js dan JavaScript dengan cron, tanggal, ms, nanti, dan dukungan yang ramah manusia. |
| [Cabin](https://github.com/cabinjs/cabin) | Pustaka pencatatan JavaScript dan Node.js yang mudah dikembangkan dengan mempertimbangkan keamanan dan privasi. |
| [Lad](https://github.com/ladjs/lad) | Kerangka kerja Node.js yang mendukung seluruh arsitektur dan desain teknik kami dengan MVC dan banyak lagi. |
| [MongoDB](https://www.mongodb.com/) | Solusi basis data NoSQL yang kami gunakan untuk menyimpan semua data lain di luar kotak surat (misalnya akun, pengaturan, domain, dan konfigurasi alias Anda). |
| [Mongoose](https://github.com/Automattic/mongoose) | Pemodelan dokumen objek MongoDB ("ODM") yang kami gunakan di seluruh tumpukan kami. Kami menulis helper khusus yang memungkinkan kami untuk tetap menggunakan **Mongoose dengan SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js adalah lingkungan runtime JavaScript lintas-platform sumber terbuka yang menjalankan semua proses server kami. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Paket Node.js untuk mengirim email, membuat koneksi, dan banyak lagi. Kami adalah sponsor resmi proyek ini. |
| [Redis](https://redis.io/) | Basis data dalam memori untuk caching, saluran publikasi/berlangganan, dan permintaan DNS melalui HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Ekstensi enkripsi untuk SQLite yang memungkinkan seluruh file basis data dienkripsi (termasuk write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), jurnal, rollback, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Editor Visual SQLite (yang juga dapat Anda gunakan) untuk menguji, mengunduh, dan melihat kotak surat pengembangan. |
| [SQLite](https://www.sqlite.org/about.html) | Lapisan basis data tertanam untuk penyimpanan IMAP yang dapat diskalakan, mandiri, cepat, dan tangguh. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Alat anti-spam, penyaringan email, dan pencegahan phishing Node.js (alternatif kami untuk [Spam Assassin](https://spamassassin.apache.org/) dan [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Permintaan DNS melalui HTTPS dengan Node.js dan caching menggunakan Redis – yang memastikan konsistensi global dan banyak lagi. |
| [Thunderbird](https://www.thunderbird.net/) | Tim pengembangan kami menggunakan ini (dan merekomendasikan ini juga) sebagai **klien email pilihan untuk digunakan dengan Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Tim pengembangan kami menggunakan ini untuk membuat mesin virtual untuk iOS dan macOS guna menguji berbagai klien email (secara paralel) dengan server IMAP dan SMTP kami. |
| [Ubuntu](https://ubuntu.com/download/server) | Sistem operasi server modern berbasis Linux sumber terbuka yang mendukung seluruh infrastruktur kami. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Pustaka server IMAP – lihat catatannya pada [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) dan [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Pustaka API yang cepat dan sederhana untuk Node.js untuk berinteraksi dengan SQLite3 secara terprogram. |
| [email-templates](https://github.com/forwardemail/email-templates) | Kerangka kerja email yang mudah dikembangkan untuk membuat, melihat pratinjau, dan mengirim email khusus (misalnya pemberitahuan akun dan lainnya). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Pembangun kueri SQL menggunakan sintaksis bergaya Mongo. Ini menghemat waktu tim pengembangan kami karena kami dapat terus menulis dalam gaya Mongo di seluruh tumpukan dengan pendekatan yang tidak bergantung pada basis data. **Ini juga membantu menghindari serangan injeksi SQL dengan menggunakan parameter kueri.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Utilitas SQL untuk mengekstrak informasi tentang skema basis data yang ada. Hal ini memungkinkan kami untuk dengan mudah memvalidasi bahwa semua indeks, tabel, kolom, batasan, dan lainnya valid dan sesuai dengan `1:1` sebagaimana mestinya. Kami bahkan menulis helper otomatis untuk menambahkan kolom dan indeks baru jika ada perubahan pada skema basis data (dilengkapi dengan peringatan kesalahan yang sangat detail). |
| [knex](https://github.com/knex/knex) | Pembangun kueri SQL yang kami gunakan hanya untuk migrasi basis data dan validasi skema melalui `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Terjemahan frasa [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) otomatis dengan dukungan untuk Markdown menggunakan [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Paket Node.js untuk menyelesaikan dan membuat koneksi dengan server MX dan menangani kesalahan. |
| [pm2](https://github.com/Unitech/pm2) | Manajer proses produksi Node.js dengan penyeimbang beban bawaan ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) untuk kinerja). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Pustaka server SMTP – kami menggunakan ini untuk pertukaran surat elektronik ("MX") dan server SMTP keluar. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Alat yang berguna untuk menguji server IMAP berdasarkan tolok ukur dan kompatibilitas protokol IMAP berdasarkan spesifikasi RFC. Proyek ini dibuat oleh tim [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (server IMAP dan POP3 sumber terbuka yang aktif sejak Juli 2002). Kami telah menguji server IMAP kami secara ekstensif dengan alat ini. |

> Anda dapat menemukan proyek lain yang kami gunakan di [kode sumber kami di GitHub](https://github.com/forwardemail).

### Penyedia {#providers}

| Penyedia | Tujuan |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Penyedia DNS, pemeriksaan kesehatan, penyeimbang beban, dan penyimpanan cadangan menggunakan [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting server khusus dan basis data terkelola. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hosting server khusus. |
| [DataPacket](https://www.datapacket.com) | Hosting server khusus. |

## Pikiran {#thoughts}

### Prinsip {#principles}

Email Terusan dirancang berdasarkan prinsip-prinsip berikut:

1. Selalu ramah pengembang, berfokus pada keamanan dan privasi, serta transparan.
2. Patuhi [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Dua Belas Faktor](https://12factor.net/), [Pisau cukur Occam](https://en.wikipedia.org/wiki/Occam%27s_razor), dan [makanan anjing](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Targetkan pengembang yang scrappy, bootstrapped, dan [ramen-menguntungkan](http://www.paulgraham.com/ramenprofitable.html)

### Eksperimen {#experiments}

> **tldr;** Pada akhirnya, penggunaan penyimpanan objek yang kompatibel dengan S3 dan/atau Tabel Virtual tidak layak secara teknis karena alasan kinerja dan rentan terhadap kesalahan karena keterbatasan memori.

Kami telah melakukan beberapa percobaan menjelang solusi SQLite akhir kami seperti dibahas di atas.

Salah satunya adalah mencoba menggunakan [rclone]() dan SQLite bersama dengan lapisan penyimpanan yang kompatibel dengan S3.

Percobaan itu membawa kami untuk lebih memahami dan menemukan kasus-kasus khusus seputar penggunaan rclone, SQLite, dan [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Jika Anda mengaktifkan flag `--vfs-cache-mode writes` dengan rclone, pembacaan akan baik-baik saja, namun penulisan akan di-cache.
* Jika Anda memiliki beberapa server IMAP yang terdistribusi secara global, maka cache akan dinonaktifkan di seluruh server tersebut kecuali Anda memiliki satu penulis dan beberapa pendengar (misalnya pendekatan pub/sub).
* Ini sangat rumit dan menambahkan kerumitan tambahan seperti ini akan mengakibatkan lebih banyak titik kegagalan tunggal.
* Penyedia penyimpanan yang kompatibel dengan S3 tidak mendukung perubahan berkas parsial – yang berarti setiap perubahan pada berkas `.sqlite` akan mengakibatkan perubahan total dan pengunggahan ulang basis data.
* Solusi lain seperti `rsync` memang ada, tetapi tidak berfokus pada dukungan write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – jadi kami akhirnya meninjau Litestream. Untungnya, penggunaan enkripsi kami sudah mengenkripsi berkas [WAL](https://www.sqlite.org/wal.html), jadi kami tidak perlu bergantung pada Litestream untuk itu. Namun, kami belum yakin dengan Litestream untuk penggunaan produksi dan berikut beberapa catatannya.
* Menggunakan opsi `--vfs-cache-mode writes` ini (satu-satunya cara untuk menggunakan SQLite daripada `rclone` untuk penulisan) akan mencoba menyalin seluruh basis data dari awal ke dalam memori – menangani satu kotak surat berukuran 10 GB tidak masalah, namun menangani beberapa kotak surat dengan penyimpanan yang sangat tinggi akan menyebabkan server IMAP mengalami keterbatasan memori dan kesalahan `ENOMEM`, kesalahan segmentasi, dan kerusakan data. * Jika Anda mencoba menggunakan SQLite [Tabel Virtual](https://www.sqlite.org/vtab.html) (misalnya menggunakan [s3db](https://github.com/jrhy/s3db)) agar data tersimpan di lapisan penyimpanan yang kompatibel dengan S3, Anda akan mengalami beberapa masalah tambahan:
* Proses baca dan tulis akan sangat lambat karena titik akhir API S3 perlu diakses dengan metode HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2, dan `.sqlite`3.
* Uji pengembangan menunjukkan bahwa melebihi 500 ribu-1 juta rekaman di internet fiber masih dibatasi oleh throughput penulisan dan pembacaan ke penyedia yang kompatibel dengan S3. Misalnya, pengembang kami menjalankan loop `.sqlite`4 untuk melakukan pernyataan SQL `.sqlite`5 berurutan dan pernyataan yang menulis data dalam jumlah besar secara massal. Dalam kedua kasus tersebut, kinerjanya sangat lambat.
* Tabel virtual **tidak boleh memiliki indeks**, pernyataan `.sqlite`6, dan `.sqlite`7 `.sqlite`8 – yang menyebabkan penundaan hingga 1-2 menit atau lebih, tergantung pada jumlah data.
* Objek disimpan tanpa enkripsi dan tidak ada dukungan enkripsi asli yang tersedia.
* Kami juga menjajaki penggunaan `.sqlite`9 yang secara konseptual dan teknis serupa dengan poin sebelumnya (sehingga memiliki masalah yang sama). Salah satu kemungkinannya adalah menggunakan build `rsync`0 kustom yang dibungkus dengan enkripsi seperti `rsync`1 (yang saat ini kami gunakan dalam solusi kami di atas) hingga `rsync`2.
* Pendekatan potensial lainnya adalah menggunakan `rsync`3, namun ini memiliki batasan 32 GB dan akan memerlukan kerumitan dalam proses build dan pengembangan. * Pernyataan `rsync`4 diperlukan (jadi ini sepenuhnya mengesampingkan penggunaan Tabel Virtual). Kita memerlukan pernyataan `rsync`5 agar hook kita dengan `rsync`6 berfungsi dengan baik – yang memastikan bahwa data tidak rusak dan baris yang diambil dapat dikonversi menjadi dokumen yang valid sesuai dengan definisi skema `rsync`7 kita (yang mencakup batasan, tipe variabel, dan validasi data arbitrer).
* Hampir semua proyek yang kompatibel dengan S3 terkait SQLite di komunitas sumber terbuka menggunakan Python (dan bukan JavaScript yang kami gunakan untuk 100% tumpukan kami).
* Pustaka kompresi seperti `rsync`8 (lihat `rsync`9) terlihat menjanjikan, tetapi __PROTECTED_LINK_189__0. Sebaliknya, kompresi sisi aplikasi pada tipe data seperti __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5, dan __PROTECTED_LINK_189__6 akan menjadi pendekatan yang lebih bersih dan mudah (dan juga lebih mudah dimigrasikan, karena kita dapat menyimpan flag atau kolom __PROTECTED_LINK_189__7 – atau bahkan menggunakan __PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 untuk kompresi atau __PROTECTED_LINK_190__0 tanpa kompresi sebagai metadata basis data).
* Untungnya, kami telah menerapkan deduplikasi lampiran di penyimpanan server IMAP kami – sehingga setiap pesan dengan lampiran yang sama tidak akan menyimpan salinan lampiran tersebut – sebagai gantinya, satu lampiran disimpan untuk beberapa pesan dan utas dalam satu kotak surat (dan referensi asing selanjutnya digunakan). * Proyek Litestream, yang merupakan solusi replikasi dan pencadangan SQLite, sangat menjanjikan dan kemungkinan besar kami akan menggunakannya di masa mendatang.
* Bukan bermaksud meremehkan penulisnya – karena kami mengapresiasi karya dan kontribusi mereka terhadap sumber terbuka selama lebih dari satu dekade – namun, dari penggunaan di dunia nyata, tampaknya terdapat __PROTECTED_LINK_190__1 dan __PROTECTED_LINK_190__2.
* Pemulihan cadangan harus mudah dan sederhana. Menggunakan solusi seperti MongoDB dengan __PROTECTED_LINK_190__3 dan __PROTECTED_LINK_190__4 tidak hanya membosankan, tetapi juga memakan waktu dan memiliki kompleksitas konfigurasi.
* Basis data SQLite membuatnya sederhana (berkas tunggal).
* Kami ingin merancang solusi yang memungkinkan pengguna mengambil kotak surat mereka dan pergi kapan saja.
* Perintah Node.js sederhana untuk __PROTECTED_LINK_190__5 dan akan dihapus secara permanen dari penyimpanan disk. * Kita juga dapat menggunakan API yang kompatibel dengan S3 dengan HTTP __PROTECTED_LINK_190__6 untuk menghapus snapshot dan cadangan bagi pengguna dengan mudah.
* SQLite adalah solusi paling sederhana, tercepat, dan paling hemat biaya.

### Kurangnya alternatif {#lack-of-alternatives}

Sepengetahuan kami, tidak ada layanan email lain yang dirancang dengan cara ini dan juga bukan layanan sumber terbuka.

Kami *berpikir ini mungkin terjadi* karena layanan email yang ada memiliki teknologi lama dalam produksi dengan [kode spageti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Sebagian besar, jika tidak semua, penyedia layanan email yang ada bersifat sumber tertutup atau mengiklankan sebagai sumber terbuka, **tetapi kenyataannya hanya antarmuka pengguna mereka yang merupakan sumber terbuka.**

**Bagian paling sensitif dari email** (interaksi penyimpanan/IMAP/SMTP yang sebenarnya) **dilakukan di back-end (server), dan *bukan* di front-end (klien)**.

### Coba Teruskan Email {#try-out-forward-email}

Daftar hari ini di <https://forwardemail.net>! :rocket: