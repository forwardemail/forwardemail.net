# Bagaimana Forward Email Melindungi Privasi, Domain, dan Keamanan Anda: Penjelajahan Teknis Mendalam {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Perbandingan layanan penerusan email terbaik" class="rounded-lg" />


## Daftar Isi {#table-of-contents}

* [Kata Pengantar](#foreword)
* [Filosofi Privasi Forward Email](#the-forward-email-privacy-philosophy)
* [Implementasi SQLite: Ketahanan dan Portabilitas untuk Data Anda](#sqlite-implementation-durability-and-portability-for-your-data)
* [Antrian Pintar dan Mekanisme Ulang Coba: Menjamin Pengiriman Email](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Sumber Daya Tak Terbatas dengan Pembatasan Laju Cerdas](#unlimited-resources-with-intelligent-rate-limiting)
* [Enkripsi Terisolasi untuk Keamanan yang Ditingkatkan](#sandboxed-encryption-for-enhanced-security)
* [Pemrosesan Email Dalam Memori: Tanpa Penyimpanan Disk untuk Privasi Maksimal](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Enkripsi End-to-End dengan OpenPGP untuk Privasi Lengkap](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Perlindungan Konten Berlapis untuk Keamanan Komprehensif](#multi-layered-content-protection-for-comprehensive-security)
* [Bagaimana Kami Berbeda dari Layanan Email Lain: Keunggulan Privasi Teknis](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparansi Open Source untuk Privasi yang Dapat Diverifikasi](#open-source-transparency-for-verifiable-privacy)
  * [Tanpa Vendor Lock-In untuk Privasi Tanpa Kompromi](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Data Terisolasi untuk Isolasi Sejati](#sandboxed-data-for-true-isolation)
  * [Portabilitas dan Kontrol Data](#data-portability-and-control)
* [Tantangan Teknis Penerusan Email Berbasis Privasi](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Manajemen Memori untuk Pemrosesan Email Tanpa Pencatatan](#memory-management-for-no-logging-email-processing)
  * [Deteksi Spam Tanpa Analisis Konten untuk Penyaringan yang Menjaga Privasi](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Mempertahankan Kompatibilitas dengan Desain Berbasis Privasi](#maintaining-compatibility-with-privacy-first-design)
* [Praktik Terbaik Privasi untuk Pengguna Forward Email](#privacy-best-practices-for-forward-email-users)
* [Kesimpulan: Masa Depan Penerusan Email Pribadi](#conclusion-the-future-of-private-email-forwarding)


## Kata Pengantar {#foreword}

Dalam lanskap digital saat ini, privasi email menjadi lebih penting dari sebelumnya. Dengan pelanggaran data, kekhawatiran pengawasan, dan iklan yang ditargetkan berdasarkan isi email, pengguna semakin mencari solusi yang mengutamakan privasi mereka. Di Forward Email, kami membangun layanan kami dari dasar dengan privasi sebagai fondasi arsitektur kami. Posting blog ini mengeksplorasi implementasi teknis yang menjadikan layanan kami salah satu solusi penerusan email yang paling fokus pada privasi yang tersedia.


## Filosofi Privasi Forward Email {#the-forward-email-privacy-philosophy}

Sebelum menyelami detail teknis, penting untuk memahami filosofi privasi dasar kami: **email Anda adalah milik Anda dan hanya Anda**. Prinsip ini membimbing setiap keputusan teknis yang kami buat, dari cara kami menangani penerusan email hingga cara kami mengimplementasikan enkripsi.

Berbeda dengan banyak penyedia email yang memindai pesan Anda untuk tujuan iklan atau menyimpannya tanpa batas waktu di server mereka, Forward Email beroperasi dengan pendekatan yang sangat berbeda:

1. **Pemrosesan hanya dalam memori** - Kami tidak menyimpan email yang diteruskan ke disk
2. **Tidak menyimpan metadata** - Kami tidak menyimpan catatan siapa mengirim email kepada siapa
3. **100% open-source** - Seluruh kode kami transparan dan dapat diaudit
4. **Enkripsi end-to-end** - Kami mendukung OpenPGP untuk komunikasi yang benar-benar pribadi


## Implementasi SQLite: Ketahanan dan Portabilitas untuk Data Anda {#sqlite-implementation-durability-and-portability-for-your-data}

Salah satu keuntungan privasi paling signifikan dari Forward Email adalah implementasi [SQLite](https://en.wikipedia.org/wiki/SQLite) yang kami rancang dengan cermat. Kami telah menyetel SQLite dengan pengaturan PRAGMA tertentu dan [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) untuk memastikan ketahanan dan portabilitas data Anda, sambil mempertahankan standar tertinggi privasi dan keamanan.
Berikut adalah gambaran bagaimana kami mengimplementasikan SQLite dengan [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) sebagai cipher untuk enkripsi tahan kuantum:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Implementasi ini memastikan bahwa data Anda tidak hanya aman tetapi juga portabel. Anda dapat membawa email Anda kapan saja dengan mengekspor dalam format [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage), atau SQLite. Dan ketika Anda ingin menghapus data Anda, data tersebut benar-benar hilang – kami cukup menghapus file dari penyimpanan disk daripada menjalankan perintah SQL DELETE ROW, yang dapat meninggalkan jejak di database.

Aspek enkripsi kuantum dari implementasi kami menggunakan ChaCha20-Poly1305 sebagai cipher saat kami menginisialisasi database, memberikan perlindungan kuat terhadap ancaman saat ini maupun di masa depan terhadap privasi data Anda.


## Antrian Pintar dan Mekanisme Ulang Coba: Menjamin Pengiriman Email {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Alih-alih hanya fokus pada penanganan header, kami telah mengimplementasikan antrian pintar dan mekanisme ulang coba yang canggih dengan metode `getBounceInfo` kami. Sistem ini memastikan bahwa email Anda memiliki peluang terbaik untuk dikirimkan, bahkan ketika terjadi masalah sementara.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> Ini adalah kutipan dari metode `getBounceInfo` dan bukan implementasi lengkap yang ekstensif. Untuk kode lengkapnya, Anda dapat meninjaunya di [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Kami mencoba ulang pengiriman email selama 5 hari, mirip dengan standar industri seperti [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), memberi waktu bagi masalah sementara untuk terselesaikan sendiri. Pendekatan ini secara signifikan meningkatkan tingkat pengiriman sambil menjaga privasi.

Dalam catatan yang sama, kami juga menghapus isi pesan email SMTP keluar setelah pengiriman berhasil. Ini dikonfigurasi dalam sistem penyimpanan kami dengan periode retensi default selama 30 hari, yang dapat Anda sesuaikan di Pengaturan Lanjutan domain Anda. Setelah periode ini, isi email secara otomatis dihapus dan dibersihkan, hanya menyisakan pesan placeholder berikut:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```
Pendekatan ini memastikan bahwa email yang Anda kirim tidak tersimpan secara permanen, mengurangi risiko pelanggaran data atau akses tidak sah ke komunikasi Anda.


## Sumber Daya Tak Terbatas dengan Pembatasan Laju Cerdas {#unlimited-resources-with-intelligent-rate-limiting}

Meskipun Forward Email menawarkan domain dan alias tanpa batas, kami telah menerapkan pembatasan laju cerdas untuk melindungi sistem kami dari penyalahgunaan dan memastikan penggunaan yang adil bagi semua pengguna. Misalnya, pelanggan non-enterprise dapat membuat hingga 50+ alias per hari, yang mencegah database kami dari spam dan banjir, serta memungkinkan fitur perlindungan dan deteksi penyalahgunaan waktu nyata kami berfungsi secara efektif.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

Pendekatan seimbang ini memberi Anda fleksibilitas untuk membuat sebanyak mungkin alamat email yang Anda butuhkan untuk pengelolaan privasi yang komprehensif, sambil tetap menjaga integritas dan performa layanan kami untuk semua pengguna.


## Enkripsi Terisolasi untuk Keamanan yang Ditingkatkan {#sandboxed-encryption-for-enhanced-security}

Pendekatan enkripsi terisolasi unik kami memberikan keuntungan keamanan penting yang sering diabaikan banyak pengguna saat memilih layanan email. Mari kita jelajahi mengapa isolasi data, terutama email, sangat penting.

Layanan seperti Gmail dan Proton kemungkinan besar menggunakan [database relasional](https://en.wikipedia.org/wiki/Relational_database) bersama, yang menciptakan kerentanan keamanan mendasar. Dalam lingkungan database bersama, jika seseorang mendapatkan akses ke data satu pengguna, mereka berpotensi memiliki jalur untuk mengakses data pengguna lain juga. Ini karena semua data pengguna berada dalam tabel database yang sama, hanya dipisahkan oleh ID pengguna atau pengenal serupa.

Forward Email mengambil pendekatan yang sangat berbeda dengan enkripsi terisolasi kami:

1. **Isolasi lengkap**: Data setiap pengguna disimpan dalam file database SQLite terenkripsi sendiri, sepenuhnya terisolasi dari pengguna lain
2. **Kunci enkripsi independen**: Setiap database dienkripsi dengan kunci unik yang berasal dari kata sandi pengguna
3. **Tidak ada penyimpanan bersama**: Berbeda dengan database relasional di mana semua email pengguna mungkin berada dalam satu tabel "emails", pendekatan kami memastikan tidak ada pencampuran data
4. **Pertahanan berlapis**: Bahkan jika database satu pengguna berhasil dibobol, itu tidak memberikan akses ke data pengguna lain

Pendekatan terisolasi ini mirip dengan memiliki email Anda di brankas fisik terpisah daripada di fasilitas penyimpanan bersama dengan pembatas internal. Ini adalah perbedaan arsitektur mendasar yang secara signifikan meningkatkan privasi dan keamanan Anda.


## Pemrosesan Email di Memori: Tanpa Penyimpanan Disk untuk Privasi Maksimal {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Untuk layanan penerusan email kami, kami memproses email sepenuhnya di RAM dan tidak pernah menulisnya ke penyimpanan disk atau database. Pendekatan ini memberikan perlindungan tiada tara terhadap pengawasan email dan pengumpulan metadata.

Berikut gambaran sederhana tentang bagaimana pemrosesan email kami bekerja:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```
Pendekatan ini berarti bahwa meskipun server kami disusupi, tidak akan ada data email historis yang dapat diakses oleh penyerang. Email Anda hanya melewati sistem kami dan langsung diteruskan ke tujuan tanpa meninggalkan jejak. Pendekatan penerusan email tanpa pencatatan ini sangat penting untuk melindungi komunikasi Anda dari pengawasan.


## Enkripsi End-to-End dengan OpenPGP untuk Privasi Lengkap {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Untuk pengguna yang membutuhkan tingkat perlindungan privasi tertinggi dari pengawasan email, kami mendukung [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) untuk enkripsi end-to-end. Berbeda dengan banyak penyedia email yang memerlukan jembatan atau aplikasi proprietary, implementasi kami bekerja dengan klien email standar, sehingga komunikasi aman dapat diakses oleh semua orang.

Berikut cara kami mengimplementasikan enkripsi OpenPGP:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Implementasi ini memastikan bahwa email Anda dienkripsi sebelum meninggalkan perangkat Anda dan hanya dapat didekripsi oleh penerima yang dituju, menjaga komunikasi Anda tetap pribadi bahkan dari kami. Ini sangat penting untuk melindungi komunikasi sensitif dari akses tidak sah dan pengawasan.


## Perlindungan Konten Berlapis untuk Keamanan Komprehensif {#multi-layered-content-protection-for-comprehensive-security}

Forward Email menawarkan beberapa lapisan perlindungan konten yang diaktifkan secara default untuk memberikan keamanan menyeluruh terhadap berbagai ancaman:

1. **Perlindungan konten dewasa** - Menyaring konten yang tidak pantas tanpa mengorbankan privasi
2. **Perlindungan [phishing](https://en.wikipedia.org/wiki/Phishing)** - Memblokir upaya pencurian informasi sambil menjaga anonimitas
3. **Perlindungan eksekusi** - Mencegah lampiran yang berpotensi berbahaya tanpa memindai konten
4. **Perlindungan [virus](https://en.wikipedia.org/wiki/Computer_virus)** - Memindai malware menggunakan teknik yang menjaga privasi

Berbeda dengan banyak penyedia yang membuat fitur ini bersifat opt-in, kami menjadikannya opt-out, memastikan semua pengguna mendapatkan perlindungan ini secara default. Pendekatan ini mencerminkan komitmen kami terhadap privasi dan keamanan, memberikan keseimbangan yang sering gagal dicapai oleh banyak layanan email.


## Bagaimana Kami Berbeda dari Layanan Email Lain: Keunggulan Privasi Teknis {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Saat membandingkan Forward Email dengan layanan email lain, beberapa perbedaan teknis utama menyoroti pendekatan kami yang mengutamakan privasi:

### Transparansi Open Source untuk Privasi yang Dapat Diverifikasi {#open-source-transparency-for-verifiable-privacy}

Meskipun banyak penyedia email mengklaim open source, mereka sering menutup kode backend mereka. Forward Email adalah 100% [open source](https://en.wikipedia.org/wiki/Open_source), termasuk kode frontend dan backend. Transparansi ini memungkinkan audit keamanan independen dari semua komponen, memastikan klaim privasi kami dapat diverifikasi oleh siapa saja.

### Tanpa Ketergantungan Vendor untuk Privasi Tanpa Kompromi {#no-vendor-lock-in-for-privacy-without-compromise}

Banyak penyedia email yang fokus pada privasi mengharuskan Anda menggunakan aplikasi atau jembatan proprietary mereka. Forward Email bekerja dengan klien email standar apa pun melalui protokol [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), dan [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), memberi Anda kebebasan memilih perangkat lunak email favorit tanpa mengorbankan privasi.
### Data Terisolasi untuk Isolasi Sejati {#sandboxed-data-for-true-isolation}

Berbeda dengan layanan yang menggunakan database bersama di mana data semua pengguna tercampur, pendekatan sandbox kami memastikan bahwa data setiap pengguna benar-benar terisolasi. Perbedaan arsitektur mendasar ini memberikan jaminan privasi yang jauh lebih kuat dibandingkan dengan yang ditawarkan oleh sebagian besar layanan email.

### Portabilitas dan Kontrol Data {#data-portability-and-control}

Kami percaya bahwa data Anda adalah milik Anda, itulah sebabnya kami memudahkan Anda untuk mengekspor email dalam format standar (MBOX, EML, SQLite) dan benar-benar menghapus data Anda kapan pun Anda mau. Tingkat kontrol ini jarang dimiliki oleh penyedia email tetapi sangat penting untuk privasi sejati.


## Tantangan Teknis dalam Pengalihan Email Berbasis Privasi {#the-technical-challenges-of-privacy-first-email-forwarding}

Membangun layanan email yang mengutamakan privasi datang dengan tantangan teknis yang signifikan. Berikut beberapa hambatan yang telah kami atasi:

### Manajemen Memori untuk Pemrosesan Email Tanpa Pencatatan {#memory-management-for-no-logging-email-processing}

Memproses email di memori tanpa penyimpanan disk memerlukan manajemen memori yang cermat untuk menangani volume lalu lintas email yang tinggi secara efisien. Kami telah menerapkan teknik optimasi memori tingkat lanjut untuk memastikan kinerja yang andal tanpa mengorbankan kebijakan tanpa penyimpanan kami, yang merupakan komponen penting dari strategi perlindungan privasi kami.

### Deteksi Spam Tanpa Analisis Konten untuk Penyaringan yang Menjaga Privasi {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Sebagian besar sistem [spam](https://en.wikipedia.org/wiki/Email_spam) mengandalkan analisis konten email, yang bertentangan dengan prinsip privasi kami. Kami telah mengembangkan teknik untuk mengidentifikasi pola spam tanpa membaca isi email Anda, menyeimbangkan antara privasi dan kegunaan yang menjaga kerahasiaan komunikasi Anda.

### Mempertahankan Kompatibilitas dengan Desain Berbasis Privasi {#maintaining-compatibility-with-privacy-first-design}

Memastikan kompatibilitas dengan semua klien email sambil menerapkan fitur privasi canggih memerlukan solusi rekayasa yang kreatif. Tim kami telah bekerja tanpa lelah untuk membuat privasi menjadi mulus, sehingga Anda tidak perlu memilih antara kenyamanan dan keamanan saat melindungi komunikasi email Anda.


## Praktik Terbaik Privasi untuk Pengguna Forward Email {#privacy-best-practices-for-forward-email-users}

Untuk memaksimalkan perlindungan Anda terhadap pengawasan email dan meningkatkan privasi saat menggunakan Forward Email, kami merekomendasikan praktik terbaik berikut:

1. **Gunakan alias unik untuk layanan yang berbeda** - Buat alias email berbeda untuk setiap layanan yang Anda daftarkan guna mencegah pelacakan lintas layanan
2. **Aktifkan enkripsi OpenPGP** - Untuk komunikasi sensitif, gunakan enkripsi ujung-ke-ujung untuk memastikan privasi penuh
3. **Secara berkala ganti alias email Anda** - Perbarui alias untuk layanan penting secara berkala untuk meminimalkan pengumpulan data jangka panjang
4. **Gunakan kata sandi yang kuat dan unik** - Lindungi akun Forward Email Anda dengan kata sandi yang kuat untuk mencegah akses tidak sah
5. **Terapkan anonimisasi [alamat IP](https://en.wikipedia.org/wiki/IP_address)** - Pertimbangkan menggunakan [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) bersamaan dengan Forward Email untuk anonimitas penuh


## Kesimpulan: Masa Depan Pengalihan Email Pribadi {#conclusion-the-future-of-private-email-forwarding}

Di Forward Email, kami percaya bahwa privasi bukan hanya fitur—melainkan hak fundamental. Implementasi teknis kami mencerminkan keyakinan ini, memberikan Anda pengalihan email yang menghormati privasi Anda di setiap tingkat dan melindungi Anda dari pengawasan email serta pengumpulan metadata.

Seiring kami terus mengembangkan dan meningkatkan layanan kami, komitmen kami terhadap privasi tetap teguh. Kami terus meneliti metode enkripsi baru, mengeksplorasi perlindungan privasi tambahan, dan menyempurnakan basis kode kami untuk memberikan pengalaman email yang paling aman.

Dengan memilih Forward Email, Anda tidak hanya memilih layanan email—Anda mendukung visi internet di mana privasi adalah default, bukan pengecualian. Bergabunglah dengan kami dalam membangun masa depan digital yang lebih privat, satu email pada satu waktu.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

