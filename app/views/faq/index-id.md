# Pertanyaan yang Sering Diajukan {#frequently-asked-questions}

<img memuat="malas" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Daftar Isi {#table-of-contents}

* [Mulai Cepat](#quick-start)
* [Perkenalan](#introduction)
  * [Apa itu Email Terusan](#what-is-forward-email)
  * [Siapa yang menggunakan Forward Email?](#who-uses-forward-email)
  * [Apa sejarah Forward Email?](#what-is-forward-emails-history)
  * [Seberapa cepat layanan ini?](#how-fast-is-this-service)
* [Klien Email](#email-clients)
  * [burung guntur](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Surat Apple](#apple-mail)
  * [Perangkat Seluler](#mobile-devices)
  * [Cara Mengirim Email Menggunakan Gmail](#how-to-send-mail-as-using-gmail)
  * [Apa panduan gratis lama untuk Kirim Email Sebagai menggunakan Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Konfigurasi Perutean Gmail Lanjutan](#advanced-gmail-routing-configuration)
  * [Konfigurasi Perutean Outlook Lanjutan](#advanced-outlook-routing-configuration)
* [Penyelesaian Masalah](#troubleshooting)
  * [Mengapa saya tidak menerima email pengujian saya?](#why-am-i-not-receiving-my-test-emails)
  * [Bagaimana cara mengonfigurasi klien email saya agar berfungsi dengan Forward Email?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Mengapa email saya masuk ke Spam dan Junk dan bagaimana cara memeriksa reputasi domain saya](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Apa yang harus saya lakukan jika saya menerima email spam?](#what-should-i-do-if-i-receive-spam-emails)
  * [Mengapa email percobaan yang saya kirim ke saya sendiri di Gmail ditampilkan sebagai "mencurigakan"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Bisakah saya menghapus via forwardemail dot net di Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Manajemen Data](#data-management)
  * [Di mana server Anda berada?](#where-are-your-servers-located)
  * [Bagaimana cara mengekspor dan mencadangkan kotak surat saya?](#how-do-i-export-and-backup-my-mailbox)
  * [Bagaimana cara mengimpor dan memigrasikan kotak surat saya yang sudah ada?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Apakah Anda mendukung hosting mandiri?](#do-you-support-self-hosting)
* [Konfigurasi Email](#email-configuration)
  * [Bagaimana cara memulai dan mengatur penerusan email?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Bisakah saya menggunakan beberapa bursa dan server MX untuk penerusan lanjutan?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Bagaimana cara mengatur penjawab saat libur (penjawab otomatis saat sedang tidak di kantor)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Bagaimana cara mengatur SPF untuk Email Terusan?](#how-do-i-set-up-spf-for-forward-email)
  * [Bagaimana cara mengatur DKIM untuk Penerusan Email?](#how-do-i-set-up-dkim-for-forward-email)
  * [Bagaimana cara mengatur DMARC untuk Meneruskan Email?](#how-do-i-set-up-dmarc-for-forward-email)
  * [Bagaimana cara menghubungkan dan mengonfigurasi kontak saya?](#how-do-i-connect-and-configure-my-contacts)
  * [Bagaimana cara menghubungkan dan mengonfigurasi kalender saya?](#how-do-i-connect-and-configure-my-calendars)
  * [Bagaimana cara menambahkan lebih banyak kalender dan mengelola kalender yang sudah ada?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Bagaimana cara mengatur SRS untuk Meneruskan Email?](#how-do-i-set-up-srs-for-forward-email)
  * [Bagaimana cara mengatur MTA-STS untuk Meneruskan Email?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Bagaimana cara menambahkan gambar profil ke alamat email saya?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Fitur Lanjutan](#advanced-features)
  * [Apakah Anda mendukung buletin atau milis untuk email terkait pemasaran?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Apakah Anda mendukung pengiriman email dengan API?](#do-you-support-sending-email-with-api)
  * [Apakah Anda mendukung penerimaan email dengan IMAP?](#do-you-support-receiving-email-with-imap)
  * [Apakah Anda mendukung POP3?](#do-you-support-pop3)
  * [Apakah Anda mendukung kalender (CalDAV)](#do-you-support-calendars-caldav)
  * [Apakah Anda mendukung kontak (CardDAV)](#do-you-support-contacts-carddav)
  * [Apakah Anda mendukung pengiriman email dengan SMTP?](#do-you-support-sending-email-with-smtp)
  * [Apakah Anda mendukung OpenPGP/MIME, enkripsi ujung ke ujung ("E2EE"), dan Direktori Kunci Web ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Apakah Anda mendukung MTA-STS?](#do-you-support-mta-sts)
  * [Apakah Anda mendukung kunci sandi dan WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Apakah Anda mendukung praktik terbaik email?](#do-you-support-email-best-practices)
  * [Apakah Anda mendukung webhook bounce?](#do-you-support-bounce-webhooks)
  * [Apakah Anda mendukung webhook?](#do-you-support-webhooks)
  * [Apakah Anda mendukung ekspresi reguler atau regex?](#do-you-support-regular-expressions-or-regex)
  * [Berapa batas SMTP keluar Anda?](#what-are-your-outbound-smtp-limits)
  * [Apakah saya perlu persetujuan untuk mengaktifkan SMTP?](#do-i-need-approval-to-enable-smtp)
  * [Apa pengaturan konfigurasi server SMTP Anda?](#what-are-your-smtp-server-configuration-settings)
  * [Apa pengaturan konfigurasi server IMAP Anda?](#what-are-your-imap-server-configuration-settings)
  * [Apa pengaturan konfigurasi server POP3 Anda?](#what-are-your-pop3-server-configuration-settings)
  * [Konfigurasi Relai SMTP Postfix](#postfix-smtp-relay-configuration)
* [Keamanan](#security)
  * [Teknik Pengerasan Server Tingkat Lanjut](#advanced-server-hardening-techniques)
  * [Apakah Anda memiliki sertifikasi SOC 2 atau ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Apakah Anda menggunakan enkripsi TLS untuk penerusan email?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Apakah Anda menyimpan header autentikasi email?](#do-you-preserve-email-authentication-headers)
  * [Apakah Anda mempertahankan header email asli dan mencegah spoofing?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Bagaimana Anda melindungi dari spam dan penyalahgunaan?](#how-do-you-protect-against-spam-and-abuse)
  * [Apakah Anda menyimpan konten email di disk?](#do-you-store-email-content-on-disk)
  * [Bisakah konten email terekspos saat sistem crash?](#can-email-content-be-exposed-during-system-crashes)
  * [Siapa yang memiliki akses ke infrastruktur email Anda](#who-has-access-to-your-email-infrastructure)
  * [Penyedia infrastruktur apa yang Anda gunakan?](#what-infrastructure-providers-do-you-use)
  * [Apakah Anda menawarkan Perjanjian Pemrosesan Data (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Bagaimana Anda menangani pemberitahuan pelanggaran data?](#how-do-you-handle-data-breach-notifications)
  * [Apakah Anda menawarkan lingkungan pengujian?](#do-you-offer-a-test-environment)
  * [Apakah Anda menyediakan alat pemantauan dan peringatan?](#do-you-provide-monitoring-and-alerting-tools)
  * [Bagaimana Anda memastikan ketersediaan tinggi?](#how-do-you-ensure-high-availability)
  * [Apakah Anda mematuhi Bagian 889 dari Undang-Undang Otorisasi Pertahanan Nasional (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Sistem dan Detail Teknis](#system-and-technical-details)
  * [Apakah Anda menyimpan email dan isinya?](#do-you-store-emails-and-their-contents)
  * [Bagaimana cara kerja sistem penerusan email Anda?](#how-does-your-email-forwarding-system-work)
  * [Bagaimana Anda memproses email untuk diteruskan?](#how-do-you-process-an-email-for-forwarding)
  * [Bagaimana Anda menangani masalah pengiriman email?](#how-do-you-handle-email-delivery-issues)
  * [Bagaimana Anda menangani alamat IP Anda yang diblokir?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Apa alamat kepala kantor pos?](#what-are-postmaster-addresses)
  * [Apa itu alamat no-reply?](#what-are-no-reply-addresses)
  * [Apa alamat IP server Anda?](#what-are-your-servers-ip-addresses)
  * [Apakah Anda memiliki daftar yang diizinkan?](#do-you-have-an-allowlist)
  * [Ekstensi nama domain apa yang diizinkan secara default](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Apa kriteria daftar putih Anda?](#what-is-your-allowlist-criteria)
  * [Ekstensi nama domain apa yang bisa digunakan secara gratis?](#what-domain-name-extensions-can-be-used-for-free)
  * [Apakah Anda memiliki daftar abu-abu?](#do-you-have-a-greylist)
  * [Apakah Anda memiliki daftar penolakan?](#do-you-have-a-denylist)
  * [Apakah Anda memiliki pembatasan tarif?](#do-you-have-rate-limiting)
  * [Bagaimana Anda melindungi dari hamburan balik?](#how-do-you-protect-against-backscatter)
  * [Cegah pantulan dari pengirim MAIL FROM yang diketahui](#prevent-bounces-from-known-mail-from-spammers)
  * [Cegah pantulan yang tidak perlu untuk melindungi dari hamburan balik](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Bagaimana cara menentukan sidik jari email?](#how-do-you-determine-an-email-fingerprint)
  * [Bisakah saya meneruskan email ke port selain 25 (misalnya jika ISP saya memblokir port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Apakah ini mendukung simbol plus + untuk alias Gmail?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Apakah ini mendukung subdomain?](#does-it-support-sub-domains)
  * [Apakah ini meneruskan header email saya?](#does-this-forward-my-emails-headers)
  * [Apakah ini sudah teruji dengan baik?](#is-this-well-tested)
  * [Apakah Anda meneruskan pesan dan kode respons SMTP?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Bagaimana Anda mencegah spammer dan memastikan reputasi penerusan email yang baik?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Bagaimana Anda melakukan pencarian DNS pada nama domain?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Akun dan Penagihan](#account-and-billing)
  * [Apakah Anda menawarkan jaminan uang kembali pada paket berbayar?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Jika saya mengganti paket, apakah Anda akan memberikan prorata dan mengembalikan selisihnya?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Bisakah saya menggunakan layanan penerusan email ini sebagai server MX "fallback" atau "fallover"?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Bisakah saya menonaktifkan alias tertentu?](#can-i-disable-specific-aliases)
  * [Bisakah saya meneruskan email ke beberapa penerima?](#can-i-forward-emails-to-multiple-recipients)
  * [Bisakah saya memiliki beberapa penerima global yang dapat menangkap semua?](#can-i-have-multiple-global-catch-all-recipients)
  * [Apakah ada batasan maksimum jumlah alamat email yang dapat saya teruskan per alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Bisakah saya meneruskan email secara rekursif?](#can-i-recursively-forward-emails)
  * [Bisakah orang membatalkan pendaftaran atau mendaftarkan penerusan email saya tanpa izin saya?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Bagaimana ini gratis?](#how-is-it-free)
  * [Berapa batas ukuran email maksimum?](#what-is-the-max-email-size-limit)
  * [Apakah Anda menyimpan log email?](#do-you-store-logs-of-emails)
  * [Apakah Anda menyimpan log kesalahan?](#do-you-store-error-logs)
  * [Apakah kamu membaca emailku?](#do-you-read-my-emails)
  * [Bisakah saya "mengirim email sebagai" di Gmail dengan ini](#can-i-send-mail-as-in-gmail-with-this)
  * [Bisakah saya "mengirim email sebagai" di Outlook dengan ini](#can-i-send-mail-as-in-outlook-with-this)
  * [Bisakah saya "mengirim email sebagai" di Apple Mail dan iCloud Mail dengan ini](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Bisakah saya meneruskan email tanpa batas dengan ini?](#can-i-forward-unlimited-emails-with-this)
  * [Apakah Anda menawarkan domain tak terbatas dengan satu harga?](#do-you-offer-unlimited-domains-for-one-price)
  * [Metode pembayaran apa yang Anda terima?](#which-payment-methods-do-you-accept)
* [Sumber Daya Tambahan](#additional-resources)

## Mulai Cepat {#quick-start}

Untuk memulai dengan Email Terusan:

1. **Buat akun** di [forwardemail.net/register](https://forwardemail.net/register)

2. **Tambahkan dan verifikasi domain Anda** di bawah [Akun Saya → Domain](/my-account/domains)

3. **Tambahkan dan konfigurasikan alias email/kotak surat** di bawah [Akun Saya → Domain](/my-account/domains) → Alias

4. **Uji pengaturan Anda** dengan mengirimkan email ke salah satu alias baru Anda

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Pendahuluan {#introduction}

### Apa itu Email Terusan {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email adalah **penyedia layanan email berfitur lengkap** dan **penyedia hosting email untuk nama domain khusus**.

Ini satu-satunya layanan gratis dan sumber terbuka, dan memungkinkan Anda menggunakan alamat email domain khusus tanpa kerumitan dalam menyiapkan dan memelihara server email Anda sendiri.

Layanan kami meneruskan email yang dikirim ke domain khusus Anda ke akun email Anda yang sudah ada – dan Anda bahkan dapat menggunakan kami sebagai penyedia hosting email khusus Anda.

Fitur utama Forward Email:

* **Email Domain Kustom**: Gunakan alamat email profesional dengan nama domain Anda sendiri
* **Tingkat Gratis**: Penerusan email dasar tanpa biaya
* **Privasi yang Ditingkatkan**: Kami tidak membaca email Anda atau menjual data Anda
* **Sumber Terbuka**: Seluruh basis kode kami tersedia di GitHub
* **Dukungan SMTP, IMAP, dan POP3**: Kemampuan mengirim dan menerima email secara penuh
* **Enkripsi Ujung-ke-Ujung**: Dukungan untuk OpenPGP/MIME
* **Alias Catch-All Kustom**: Buat alias email tanpa batas

Anda dapat membandingkan kami dengan 56+ penyedia layanan email lainnya di [halaman Perbandingan Email kami](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Siapa yang menggunakan Forward Email {#who-uses-forward-email}

Kami menyediakan layanan hosting email dan penerusan email ke lebih dari 500.000 domain dan pengguna terkemuka berikut ini:

| Pelanggan | Studi Kasus |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Akademi Angkatan Laut AS | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Resmi | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Permainan Netflix |  |
| Yayasan Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Yayasan PHP |  |
| Radio Berita Fox |  |
| Penjualan Iklan Disney |  |
| Bahasa Indonesia: jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Dalam kemanusiaan | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Universitas Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitas Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitas Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitas Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitas Swarthmore | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Pemerintah Australia Selatan |  |
| Pemerintah Republik Dominika |  |
| Terbang<span>.</span>io |  |
| Hotel RCD |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Apa riwayat Forward Email {#what-is-forward-emails-history}

Anda dapat mempelajari lebih lanjut tentang Forward Email di [halaman Tentang kami](/about).

### Seberapa cepat layanan ini {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Email Terusan menyampaikan pesan dengan penundaan minimal, biasanya dalam hitungan detik setelah diterima.

Metrik kinerja:

* **Waktu Pengiriman Rata-Rata**: Kurang dari 5-10 detik dari penerimaan hingga penerusan ([lihat halaman pemantauan Waktu Masuk "TTI" kami](/tti))
* **Waktu Aktif**: Ketersediaan layanan 99,9%+
* **Infrastruktur Global**: Server ditempatkan secara strategis untuk perutean optimal
* **Penskalaan Otomatis**: Sistem kami diskalakan selama periode email puncak

Kami beroperasi secara real-time, tidak seperti penyedia lain yang mengandalkan antrean tertunda.

Kami tidak menulis ke disk atau menyimpan log – dengan [pengecualian kesalahan](#do-you-store-error-logs) dan [SMTP keluar](#do-you-support-sending-email-with-smtp) (lihat [Kebijakan Privasi](/privacy) kami).

Semuanya dilakukan dalam memori dan [kode sumber kami ada di GitHub](https://github.com/forwardemail).

## Klien Email {#email-clients}

### Thunderbird {#thunderbird}

1. Buat alias baru dan buat kata sandi di dasbor Email Terusan Anda.
2. Buka Thunderbird dan buka **Edit → Pengaturan Akun → Tindakan Akun → Tambahkan Akun Email**
3. Masukkan nama, alamat Email Terusan, dan kata sandi Anda.
4. Klik **Konfigurasi secara manual** dan masukkan:
* Email Masuk: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Email Keluar: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Klik **Selesai**

### Microsoft Outlook {#microsoft-outlook}

1. Buat alias baru dan buat kata sandi di dasbor Email Terusan Anda
2. Buka **Berkas → Tambah Akun**
3. Masukkan alamat Email Terusan Anda dan klik **Hubungkan**
4. Pilih **Opsi lanjutan** dan pilih **Biarkan saya mengatur akun saya secara manual**
5. Pilih **IMAP** dan masukkan:
* Masuk: `imap.forwardemail.net`, port 993, SSL
* Keluar: `smtp.forwardemail.net`, port 587, TLS
* Nama pengguna: Alamat email lengkap Anda
* Kata sandi: Kata sandi yang Anda buat
6. Klik **Hubungkan**

### Apple Mail {#apple-mail}

1. Buat alias baru dan buat kata sandi di dasbor Email Terusan Anda
2. Buka **Mail → Preferensi → Akun → +**
3. Pilih **Akun Email Lain**
4. Masukkan nama, alamat Email Terusan, dan kata sandi Anda
5. Untuk pengaturan server, masukkan:
* Email Masuk: `imap.forwardemail.net`
* Email Keluar: `smtp.forwardemail.net`
* Nama Pengguna: Alamat email lengkap Anda
* Kata Sandi: Kata sandi yang Anda buat
6. Klik **Masuk**

### Perangkat Seluler {#mobile-devices}

Untuk iOS:

1. Buka **Pengaturan → Email → Akun → Tambah Akun → Lainnya**
2. Ketuk **Tambah Akun Email** dan masukkan detail Anda
3. Untuk pengaturan server, gunakan pengaturan IMAP dan SMTP yang sama seperti di atas

Untuk Android:

1. Buka **Pengaturan → Akun → Tambahkan Akun → Pribadi (IMAP)**
2. Masukkan alamat Email Penerusan dan kata sandi Anda
3. Untuk pengaturan server, gunakan pengaturan IMAP dan SMTP yang sama seperti di atas

### Cara Mengirim Email Menggunakan Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Perkiraan Waktu Penyiapan:</strong>
<span>Kurang dari 10 menit</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Memulai:
</strong>
<span>
Jika Anda telah mengikuti petunjuk di atas pada bagian <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Bagaimana cara memulai dan mengatur penerusan email</a>, Anda dapat melanjutkan membaca di bawah ini.
</span>
</div>

<div id="kirim-email-sebagai-konten">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a>, <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a>, dan <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Batas SMTP Keluar</a> kami – penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda seorang pengembang, silakan merujuk ke <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentasi API email</a> kami.
</span>
</div>

1. Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan

2. Buat alias baru untuk domain Anda di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

3. Klik <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di samping alias yang baru dibuat. Salin ke clipboard Anda dan simpan dengan aman kata sandi yang dibuat yang ditampilkan di layar.

4. Buka [Gmail](https://gmail.com) dan di bawah [Pengaturan <i class="fa fa-angle-right"></i> Akun dan Impor <i class="fa fa-angle-right"></i> Kirim email sebagai](https://mail.google.com/mail/u/0/#settings/accounts), klik "Tambahkan alamat email lain"

5. Saat diminta "Nama", masukkan nama yang Anda inginkan agar email Anda dilihat sebagai "Dari" (misalnya "Linus Torvalds").

6. Saat diminta untuk "Alamat email", masukkan alamat email lengkap alias yang Anda buat di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

7. Hapus tanda centang "Perlakukan sebagai alias"

8. Klik "Langkah Berikutnya" untuk melanjutkan

9. Saat diminta "SMTP Server", masukkan <code>smtp.forwardemail.net</code> dan biarkan port sebagai <code>587</code>

10. Saat diminta "Nama Pengguna", masukkan alamat email lengkap alias yang Anda buat di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

11. Saat diminta "Kata Sandi", tempel kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Hasilkan Kata Sandi</strong> pada langkah 3 di atas

12. Biarkan tombol radio dicentang untuk "Koneksi aman menggunakan TLS"

13. Klik "Tambah Akun" untuk melanjutkan

14. Buka tab baru ke [Gmail](https://gmail.com) dan tunggu email verifikasi Anda tiba (Anda akan menerima kode verifikasi yang mengonfirmasi bahwa Anda adalah pemilik alamat email yang Anda coba "Kirim Email Sebagai")

15. Setelah sampai, copy dan paste kode verifikasi pada prompt yang Anda terima pada langkah sebelumnya

16. Setelah Anda melakukannya, kembali ke email dan klik tautan untuk "konfirmasi permintaan". Anda kemungkinan besar perlu melakukan langkah ini dan langkah sebelumnya agar email dikonfigurasi dengan benar.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

Bahasa Indonesia:

### Apa panduan gratis lama untuk Kirim Email Sebagai menggunakan Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Penting:</strong> Panduan gratis ini tidak lagi digunakan sejak Mei 2023 karena <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we sekarang mendukung SMTP keluar</a>. Jika Anda menggunakan panduan di bawah ini, maka <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this akan menyebabkan email keluar Anda</a> menampilkan "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" di Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Perkiraan Waktu Penyiapan:</strong>
<span>Kurang dari 10 menit</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Memulai:
</strong>
<span>
Jika Anda telah mengikuti petunjuk di atas pada bagian <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Bagaimana cara memulai dan mengatur penerusan email</a>, Anda dapat melanjutkan membaca di bawah ini.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Cara Mengirim Email Menggunakan Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="panduan-bebas-warisan">

1. Anda perlu mengaktifkan [Autentikasi Dua Faktor Gmail][gmail-2fa] agar ini berfungsi. Kunjungi <https://www.google.com/landing/2step/> jika Anda belum mengaktifkannya.

2. Setelah Autentikasi Dua Faktor diaktifkan (atau jika Anda sudah mengaktifkannya), kunjungi <https://myaccount.google.com/apppasswords>.

3. Saat diminta untuk "Pilih aplikasi dan perangkat yang ingin Anda buatkan kata sandi aplikasinya":
* Pilih "Mail" di bawah menu tarik-turun untuk "Pilih aplikasi"
* Pilih "Other" di bawah menu tarik-turun untuk "Pilih perangkat"
* Saat diminta untuk memasukkan teks, masukkan alamat email domain kustom yang Anda gunakan untuk meneruskan (misalnya <code><hello@example.com></code> - ini akan membantu Anda melacak jika Anda menggunakan layanan ini untuk beberapa akun)

4. Salin kata sandi ke clipboard Anda yang dibuat secara otomatis
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan G Suite, kunjungi panel admin Anda <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplikasi <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Setelan untuk Gmail <i class="fa fa-angle-right"></i> Setelan</a> dan pastikan untuk mencentang "Izinkan pengguna mengirim email melalui server SMTP eksternal...". Akan ada penundaan hingga perubahan ini diaktifkan, jadi harap tunggu beberapa menit.
</span>
</div>

5. Buka [Gmail](https://gmail.com) dan di bawah [Pengaturan <i class="fa fa-angle-right"></i> Akun dan Impor <i class="fa fa-angle-right"></i> Kirim email sebagai](https://mail.google.com/mail/u/0/#settings/accounts), klik "Tambahkan alamat email lain"

6. Saat diminta "Nama", masukkan nama yang Anda inginkan agar email Anda dilihat sebagai "Dari" (misalnya "Linus Torvalds")

7. Saat diminta "Alamat email", masukkan alamat email dengan domain khusus yang Anda gunakan di atas (misalnya <code><hello@example.com></code>)

8. Hapus tanda centang "Perlakukan sebagai alias"

9. Klik "Langkah Berikutnya" untuk melanjutkan

10. Saat diminta "SMTP Server", masukkan <code>smtp.gmail.com</code> dan biarkan port sebagai <code>587</code>

11. Saat diminta untuk "Nama Pengguna", masukkan bagian alamat Gmail Anda tanpa bagian <span>gmail.com</span> (misalnya, cukup "pengguna" jika email saya adalah <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika bagian "Nama Pengguna" diisi otomatis, maka <u><strong>Anda perlu mengubahnya</strong></u> ke bagian nama pengguna alamat Gmail Anda.
</span>
</div>

12. Saat diminta "Kata Sandi", tempel dari clipboard Anda kata sandi yang Anda buat pada langkah 2 di atas

13. Biarkan tombol radio dicentang untuk "Koneksi aman menggunakan TLS"

14. Klik "Tambah Akun" untuk melanjutkan

15. Buka tab baru ke [Gmail](https://gmail.com) dan tunggu email verifikasi Anda tiba (Anda akan menerima kode verifikasi yang mengonfirmasi bahwa Anda adalah pemilik alamat email yang Anda coba "Kirim Email Sebagai")

16. Setelah sampai, copy dan paste kode verifikasi pada prompt yang Anda terima pada langkah sebelumnya

17. Setelah Anda melakukannya, kembali ke email dan klik tautan untuk "konfirmasi permintaan". Anda kemungkinan besar perlu melakukan langkah ini dan langkah sebelumnya agar email dikonfigurasi dengan benar.

Bahasa Indonesia:

### Konfigurasi Perutean Gmail Lanjutan {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Perkiraan Waktu Penyiapan:</strong>
<span>15-30 menit</span>
</div>

Jika Anda ingin menyiapkan perutean lanjutan di Gmail sehingga alias yang tidak cocok dengan kotak surat akan diteruskan ke bursa email Forward Email, ikuti langkah-langkah berikut:

1. Masuk ke konsol Google Admin Anda di [admin.google.com](https://admin.google.com)
2. Buka **Aplikasi → Google Workspace → Gmail → Perutean**
3. Klik **Tambahkan Rute** dan konfigurasikan pengaturan berikut:

**Pengaturan Penerima Tunggal:**

* Pilih "Ubah penerima amplop" dan masukkan alamat Gmail utama Anda
* Centang "Tambahkan header X-Gm-Original-To dengan penerima asli"

**Pola Penerima Amplop:**

* Tambahkan pola yang cocok dengan semua kotak surat yang tidak ada (misalnya, `.*@yourdomain.com`)

**Pengaturan Server Email:**

* Pilih "Rutekan ke host" dan masukkan `mx1.forwardemail.net` sebagai server utama
* Tambahkan `mx2.forwardemail.net` sebagai server cadangan
* Atur port ke 25
* Pilih "Wajibkan TLS" untuk keamanan

4. Klik **Simpan** untuk membuat rute

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Konfigurasi ini hanya akan berfungsi untuk akun Google Workspace dengan domain khusus, bukan untuk akun Gmail biasa.
</span>
</div>

### Konfigurasi Perutean Outlook Lanjutan {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Perkiraan Waktu Penyiapan:</strong>
<span>15-30 menit</span>
</div>

Untuk pengguna Microsoft 365 (sebelumnya Office 365) yang ingin menyiapkan perutean tingkat lanjut sehingga alias yang tidak cocok dengan kotak surat akan diteruskan ke bursa email Teruskan Email:

1. Masuk ke pusat admin Microsoft 365 di [admin.microsoft.com](https://admin.microsoft.com)
2. Buka **Exchange → Alur email → Aturan**
3. Klik **Tambahkan aturan** dan pilih **Buat aturan baru**
4. Beri nama aturan Anda (misalnya, "Teruskan kotak surat yang tidak ada ke Teruskan Email")
5. Pada bagian **Terapkan aturan ini jika**, pilih:
* "Alamat penerima cocok dengan..."
* Masukkan pola yang cocok dengan semua alamat di domain Anda (misalnya, `*@yourdomain.com`)
6. Pada bagian **Lakukan hal berikut**, pilih:
* "Arahkan pesan ke..."
* Pilih "Server email berikut"
* Masukkan `mx1.forwardemail.net` dan port 25
* Tambahkan `mx2.forwardemail.net` sebagai server cadangan
7. Pada bagian **Kecuali jika**, pilih:
* "Penerimanya adalah..."
* Tambahkan semua kotak surat Anda yang ada yang tidak boleh diteruskan
8. Atur prioritas aturan untuk memastikannya berjalan setelah aturan alur surat lainnya
9. Klik **Simpan** untuk mengaktifkan aturan

## Pemecahan Masalah {#troubleshooting}

### Mengapa saya tidak menerima email pengujian saya {#why-am-i-not-receiving-my-test-emails}

Jika Anda mengirim email percobaan kepada diri Anda sendiri, maka email tersebut mungkin tidak muncul di kotak masuk Anda karena memiliki tajuk "Message-ID" yang sama.

Ini adalah masalah yang diketahui secara luas, dan juga memengaruhi layanan seperti Gmail. <a href="https://support.google.com/a/answer/1703601">Here adalah jawaban resmi Gmail mengenai masalah ini</a>.

Jika Anda terus mengalami masalah, kemungkinan besar masalahnya ada pada propagasi DNS. Anda perlu menunggu sedikit lebih lama dan mencoba lagi (atau coba tetapkan nilai TTL yang lebih rendah pada rekaman <strong class="notranslate">TXT</strong> Anda).

**Masih mengalami masalah?** Silakan <a href="/help">hubungi kami</a> agar kami dapat membantu menyelidiki masalah tersebut dan menemukan penyelesaian yang cepat.

### Bagaimana cara mengonfigurasi klien email saya agar berfungsi dengan Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Layanan kami bekerja dengan klien email populer seperti:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="lencana badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="lencana badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="lencana badge-light bg-light text-dark"><i kelas="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>

<li kelas="daftar-item-sebaris"><a href="/blog/open-source/safari-email-clients" target="_blank" kelas="lencana lencana-terang bg-terang teks-gelap">Safari&reg;</a></li>

<li kelas="daftar-item-sebaris"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" kelas="lencana lencana-terang bg-terang teks-gelap"><i kelas="fab fa-chrome"></i> Google Chrome&reg;</a></li>

<li kelas="daftar-item-sebaris"><a href="/blog/open-source/terminal-email-clients" target="_blank" kelas="lencana lencana-terang bg-terang teks-gelap"><i kelas="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
Nama pengguna Anda adalah alamat email alias Anda dan kata sandinya berasal dari <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> ("Kata Sandi Normal").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Kiat:
</strong>
<span>Jika Anda menggunakan Thunderbird, pastikan "Keamanan koneksi" diatur ke "SSL/TLS" dan Metode autentikasi diatur ke "Kata sandi normal".</span>
</div>

| Jenis | Nama host | Protokol | Pelabuhan |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Diutamakan** | `993` dan `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Diutamakan** atau TLS (STARTTLS) | `465` dan `2465` untuk SSL/TLS (atau) `587`, `2587`, `2525`, dan `25` untuk TLS (STARTTLS) |

### Mengapa email saya masuk ke Spam dan Junk dan bagaimana cara memeriksa reputasi domain saya {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Bagian ini memandu Anda jika email keluar Anda menggunakan server SMTP kami (misalnya `smtp.forwardemail.net`) (atau diteruskan melalui `mx1.forwardemail.net` atau `mx2.forwardemail.net`) dan dikirimkan ke folder Spam atau Sampah penerima.

Kami secara rutin memantau [Alamat IP](#what-are-your-servers-ip-addresses) kami terhadap [semua daftar penolakan DNS yang memiliki reputasi baik](#how-do-you-handle-your-ip-addresses-becoming-blocked), **oleh karena itu kemungkinan besar ini merupakan masalah khusus reputasi domain**.

Email dapat masuk ke folder spam karena beberapa alasan:

1. **Otentikasi Hilang**: Siapkan rekaman [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), dan [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputasi Domain**: Domain baru sering kali memiliki reputasi netral hingga mereka menetapkan riwayat pengiriman.

3. **Pemicu Konten**: Kata atau frasa tertentu dapat memicu filter spam.

4. **Pola Pengiriman**: Peningkatan volume email yang tiba-tiba dapat terlihat mencurigakan.

Anda dapat mencoba menggunakan satu atau beberapa alat ini untuk memeriksa reputasi dan kategorisasi domain Anda:

| Nama Alat | URL | Jenis |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Umpan Balik Kategorisasi Domain Cloudflare | <https://radar.cloudflare.com/domains/umpan balik> | Kategorisasi |
| Pemeriksa Reputasi IP dan Domain Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Pusat Reputasi IP dan Domain Cisco Talos | <https://talosintelligence.com/pusat_reputasi> | Reputasi |
| Pencarian IP dan Reputasi Domain Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Pemeriksaan Daftar Hitam Kotak Alat MX | <https://mxtoolbox.com/daftar hitam.aspx> | Daftar Hitam |
| Alat Google Postmaster | <https://www.gmail.com/postmaster/> | Reputasi |
| Pusat Pengirim Yahoo | <https://senders.yahooinc.com/> | Reputasi |
| Pemeriksaan Daftar Hitam MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Skor Pengirim | <https://senderscore.org/act/blocklist-remover/> | Reputasi |
| Ketidakbernilaian | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Penghapusan IP Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Pemindahan |
| Penghapusan IP Cloudmark | <https://csi.cloudmark.com/id/atur ulang/> | Pemindahan |
| Polisi Spam | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Penghapusan IP Microsoft Outlook dan Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Pemindahan |
| Tingkat 1, 2, dan 3 UCEPROTECT | <https://www.uceprotect.net/id/rblcheck.php> | DNSBL |
| UCEPROTECT's backscatterer.org | <https://www.backscatterer.org/> | Perlindungan Hamburan Balik |
| UCEPROTECT masuk daftar putih.org | <https://www.whitelisted.org/> (memerlukan biaya) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Pemindahan |
| AOL/Verizon (misalnya `[IPTS04]`) | <https://senders.yahooinc.com/> | Pemindahan |
| Komunikasi Cox | `unblock.request@cox.net` | Pemindahan |
| t-online.de (Jerman/T-Mobile) | `tobr@rx.t-online.de` | Pemindahan |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### Apa yang harus saya lakukan jika saya menerima email spam {#what-should-i-do-if-i-receive-spam-emails}

Anda harus berhenti berlangganan dari milis (jika memungkinkan) dan memblokir pengirimnya.

Harap jangan melaporkan pesan tersebut sebagai spam, tetapi teruskan ke sistem pencegahan penyalahgunaan kami yang dikurasi secara manual dan berfokus pada privasi.

**Alamat email untuk meneruskan spam adalah:** <abuse@forwardemail.net>

### Mengapa email percobaan yang saya kirim ke saya sendiri di Gmail ditampilkan sebagai "mencurigakan" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Jika Anda melihat pesan kesalahan ini di Gmail saat Anda mengirim email percobaan ke diri Anda sendiri, atau saat orang yang Anda kirimi email dengan alias Anda melihat email dari Anda untuk pertama kalinya, maka **jangan khawatir** – karena ini adalah fitur keamanan bawaan Gmail.

Anda cukup mengeklik "Terlihat aman". Misalnya, jika Anda mengirim pesan uji coba menggunakan fitur kirim email sebagai (ke orang lain), maka mereka tidak akan melihat pesan ini.

Namun jika mereka melihat pesan ini, itu karena mereka biasanya melihat email Anda berasal dari <john@gmail.com> dan bukan dari <john@customdomain.com> (hanya contoh). Gmail akan mengingatkan pengguna hanya untuk memastikan semuanya aman, untuk berjaga-jaga, tidak ada solusi.

### Bisakah saya menghapus via forwardemail dot net di Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Topik ini terkait dengan [masalah yang diketahui secara luas di Gmail di mana info tambahan muncul di samping nama pengirim](https://support.google.com/mail/answer/1311182).

Mulai Mei 2023, kami mendukung pengiriman email dengan SMTP sebagai add-on untuk semua pengguna berbayar – yang berarti Anda dapat menghapus <span class="notranslate">via forwardemail dot net</span> di Gmail.

Perhatikan bahwa topik FAQ ini khusus untuk mereka yang menggunakan fitur [Cara Mengirim Email Menggunakan Gmail](#how-to-send-mail-as-using-gmail).

Silakan lihat bagian [Apakah Anda mendukung pengiriman email dengan SMTP?](#do-you-support-sending-email-with-smtp) untuk petunjuk konfigurasi.

## Manajemen Data {#data-management}

### Di mana server Anda berada {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Server kami terutama berlokasi di Denver, Colorado – lihat <https://forwardemail.net/ips> untuk daftar lengkap alamat IP kami.

Anda dapat mempelajari tentang subprosesor kami di halaman [GDPR](/gdpr), [DPA](/dpa), dan [Pribadi](/privacy) kami.

### Bagaimana cara mengekspor dan mencadangkan kotak surat saya {#how-do-i-export-and-backup-my-mailbox}

Kapan saja Anda dapat mengekspor kotak surat Anda sebagai format [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Kotak M](https://en.wikipedia.org/wiki/Mbox), atau terenkripsi [Bahasa SQLite](https://en.wikipedia.org/wiki/SQLite).

Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Unduh Cadangan dan pilih jenis format ekspor yang Anda inginkan.

Anda akan dikirimi email berisi tautan untuk mengunduh ekspor setelah selesai.

Harap diperhatikan bahwa tautan unduhan ekspor ini kedaluwarsa setelah 4 jam karena masalah keamanan.

Jika Anda perlu memeriksa format EML atau Mbox yang diekspor, maka alat sumber terbuka ini mungkin berguna:

| Nama | Format | Platform | URL GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Penampil MBox | Kotak M | Jendela | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Kotak M | Semua platform | <https://github.com/PHMRanger/mbox-web-viewer> |
| Pembaca Eml | EML | Jendela | <https://github.com/ayamadori/EmlReader> |
| Penampil email | EML | Kode VSC | <https://github.com/joelharkes/vscode_email_viewer> |
| pembaca eml | EML | Semua platform | <https://github.com/s0ph1e/eml-reader> |

Selain itu jika Anda perlu mengonversi file Mbox ke file EML, maka Anda dapat menggunakan <https://github.com/noelmartinon/mboxzilla>.

### Bagaimana cara mengimpor dan memigrasikan kotak surat saya yang sudah ada {#how-do-i-import-and-migrate-my-existing-mailbox}

Anda dapat dengan mudah mengimpor email Anda ke Forward Email (misalnya menggunakan [burung guntur](https://www.thunderbird.net)) dengan petunjuk di bawah ini:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Anda harus mengikuti semua langkah berikut untuk mengimpor email Anda yang sudah ada.
</span>
</div>

1. Ekspor email Anda dari penyedia email Anda yang sudah ada:

| Penyedia Email | Format Ekspor | Petunjuk Ekspor |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Pandangan | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tips:</strong> <span>Jika Anda menggunakan Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">format ekspor PST</a>), Anda cukup mengikuti petunjuk pada "Lainnya" di bawah ini. Namun, kami telah menyediakan tautan di bawah ini untuk mengonversi PST ke format MBOX/EML berdasarkan sistem operasi Anda:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba untuk Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst untuk Windows cygwin</a> – (misalnya, <code>readpst -u -o $OUT_DIR $IN_DIR</code> mengganti <code>$OUT_DIR</code> dan <code>$IN_DIR</code> dengan direktori keluaran dan jalur direktori masukan masing-masing).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst untuk Ubuntu/Linux</a> – (misalnya <code>sudo apt-get install readpst</code> lalu <code>readpst -u -o $OUT_DIR $IN_DIR</code>, mengganti <code>$OUT_DIR</code> dan <code>$IN_DIR</code> dengan jalur direktori keluaran dan direktori masukan masing-masing).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst untuk macOS (melalui brew)</a> – (misalnya <code>brew install libpst</code> lalu <code>readpst -u -o $OUT_DIR $IN_DIR</code>, mengganti <code>$OUT_DIR</code> dan <code>$IN_DIR</code> dengan jalur direktori keluaran dan direktori masukan masing-masing).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Konverter PST untuk Windows (GitHub)</a></li></ul><br /></span></div> |
| Surat Apple | MBOX | <https://support.apple.com/guide/mail/impor-atau-ekspor-kotak-surat-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Unduh-semua-data-anda#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/email-ekspor-aplikasi-ekspor-impor> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Memikirkan | EML | <https://docs.gandi.net/id/gandimail/operasi_umum/email_cadangan.html#isi> |
| Bahasa Indonesia | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Lainnya | [Use Thunderbird](https://www.thunderbird.net) | Siapkan akun email Anda yang sudah ada di Thunderbird, lalu gunakan plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) untuk mengekspor dan mengimpor email Anda. **Anda juga dapat menyalin/menempel atau menyeret/meletakkan email dari satu akun ke akun lainnya.** |

2. Unduh, instal, dan buka [burung guntur](https://www.thunderbird.net).

3. Buat akun baru menggunakan alamat email lengkap alias Anda (misalnya <code><you@yourdomain.com></code>) dan kata sandi yang Anda buat. <strong>Jika Anda belum memiliki kata sandi, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">lihat petunjuk pengaturan kami</a></strong>.

4. Unduh dan instal plugin [Alat Impor dan Ekspor OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird.

5. Buat folder lokal baru di Thunderbird, lalu klik kanan padanya → pilih opsi `ImportExportTools NG` → pilih `Import mbox file` (untuk format ekspor MBOX) – atau – `Import messages` / `Import all messages from a directory` (untuk format ekspor EML).

6. Seret/lepas dari folder lokal ke folder IMAP baru (atau yang sudah ada) di Thunderbird tempat Anda ingin mengunggah pesan ke penyimpanan IMAP dengan layanan kami. Ini akan memastikan pesan dicadangkan secara online dengan penyimpanan terenkripsi SQLite kami.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Jika Anda bingung tentang cara mengimpor ke Thunderbird, Anda dapat merujuk ke instruksi resmi di <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> dan <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Setelah Anda menyelesaikan proses ekspor dan impor, Anda mungkin juga ingin mengaktifkan penerusan pada akun email Anda yang sudah ada dan mengatur penjawab otomatis untuk memberi tahu pengirim bahwa Anda memiliki alamat email baru (misalnya, jika sebelumnya Anda menggunakan Gmail dan sekarang menggunakan email dengan nama domain khusus Anda).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

### Apakah Anda mendukung hosting mandiri {#do-you-support-self-hosting}

Ya, mulai Maret 2025, kami mendukung opsi hosting mandiri. Baca blog [Di Sini](https://forwardemail.net/blog/docs/self-hosted-solution). Lihat [panduan yang diselenggarakan sendiri](https://forwardemail.net/self-hosted) untuk memulai. Dan bagi yang tertarik dengan versi langkah demi langkah yang lebih rinci, lihat panduan kami yang berbasis [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) atau [Bahasa Indonesia: Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Konfigurasi Email {#email-configuration}

### Bagaimana cara memulai dan mengatur penerusan email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Perkiraan Waktu Penyiapan:</strong>
<span>Kurang dari 10 menit</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Memulai:
</strong>
<span>
Bacalah dengan saksama dan ikuti langkah satu hingga delapan yang tercantum di bawah ini. Pastikan untuk mengganti alamat email <code>user@gmail.com</code> dengan alamat email tujuan penerusan email (jika belum akurat). Demikian pula, pastikan untuk mengganti <code>example.com</code> dengan nama domain khusus Anda (jika belum akurat).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Jika Anda sudah mendaftarkan nama domain di suatu tempat, Anda harus melewati langkah ini sepenuhnya dan langsung ke langkah kedua! Jika tidak, Anda dapat <a href="/domain-registration" rel="noopener noreferrer">klik di sini untuk mendaftarkan nama domain Anda</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Apakah Anda ingat di mana Anda mendaftarkan domain Anda? Setelah Anda mengingatnya, ikuti petunjuk di bawah ini:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Anda harus membuka tab baru dan masuk ke registrar domain Anda. Anda dapat dengan mudah mengeklik "Registrar" di bawah ini untuk melakukannya secara otomatis. Di tab baru ini, Anda harus menavigasi ke halaman manajemen DNS di registrar Anda – dan kami telah menyediakan langkah-langkah navigasi langkah demi langkah di bawah ini di kolom "Langkah-Langkah Konfigurasi". Setelah Anda menavigasi ke halaman ini di tab baru, Anda dapat kembali ke tab ini dan melanjutkan ke langkah ketiga di bawah ini.
<strong class="font-weight-bold">Jangan tutup tab yang terbuka dulu; Anda akan membutuhkannya untuk langkah selanjutnya!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Registrar</th>
<th>Langkah-Langkah Konfigurasi</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Pusat Domain <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Edit Pengaturan DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Rute 53</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Zona Hosting <i class="fa fa-angle-right"></i> (Pilih domain Anda)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Server Saya <i class="fa fa-angle-right"></i> Manajemen Domain <i class="fa fa-angle-right"></i> Manajer DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>UNTUK ROCK: Masuk <i class="fa fa-angle-right"></i> Domain <i class="fa fa-angle-right"></i> (Klik ikon ▼ di samping untuk mengelola) <i class="fa fa-angle-right"></i> DNS
<br />
UNTUK LEGACY: Masuk <i class="fa fa-angle-right"></i> Domain <i class="fa fa-angle-right"></i> Editor Zona <i class="fa fa-angle-right"></i> (Pilih domain Anda)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Dipermudah</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Pilih domain Anda)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Kelola</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Jaringan <i class="fa fa-angle-right"></i> Domain <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Lainnya <i class="fa fa-angle-right"></i> Kelola Domain</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Pada tampilan kartu, klik kelola domain Anda <i class="fa fa-angle-right"></i> Pada tampilan daftar, klik
ikon roda gigi <i class="fa fa-angle-right"></i> DNS & Nameserver <i class="fa fa-angle-right"></i> Rekaman DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Tonton</a>
</td>
<td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Kelola <i class="fa fa-angle-right"></i> (klik ikon roda gigi) <i class="fa fa-angle-right"></i> Klik DNS & Nameserver di menu sebelah kiri</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domain <i class="fa fa-angle-right"></i> Kelola Domain <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Ikhtisar <i class="fa fa-angle-right"></i> Kelola <i class="fa fa-angle-right"></i> Editor Sederhana <i class="fa fa-angle-right"></i> Rekaman</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Manajemen <i class="fa fa-angle-right"></i> Edit zona</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Tonton</a>
</td>
<td>Masuk <i class="fa fa-angle-right"></i> Kelola Domain Saya <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Kelola DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domain</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Tonton</a>
</td>
<td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Konfigurasi DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Tonton</a>
</td>
<td>Masuk <i class="fa fa-angle-right"></i> Daftar Domain <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Kelola <i class="fa fa-angle-right"></i> DNS Lanjutan</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Siapkan DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solusi</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Manajer Akun <i class="fa fa-angle-right"></i> Nama Domain Saya <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Kelola <i class="fa fa-angle-right"></i> Ubah Arah Domain <i class="fa fa-angle-right"></i> DNS Lanjutan</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Pantau</a>
</td>
<td>Masuk <i class="fa fa-angle-right"></i> Domain Terkelola <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> Pengaturan DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Menu Beranda <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Domain <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i>
Pengaturan Lanjutan <i class="fa fa-angle-right"></i> Catatan Kustom</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Sekarang</a></td>
<td>Menggunakan CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [nilai-rekaman] [prioritas]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Halaman Domain <i class="fa fa-angle-right"></i> (Pilih domain Anda) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Halaman Domain <i class="fa fa-angle-right"></i> (Klik ikon <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Pilih Kelola Data DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Masuk <i class="fa fa-angle-right"></i> Domain <i class="fa fa-angle-right"></i> Domain Saya</td>
</tr>
<tr>
<td>Lainnya</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Penting:</strong> Tidak melihat nama registrar Anda tercantum di sini? Cukup cari di internet dengan kata kunci "cara mengubah data DNS di $REGISTRAR" (ganti $REGISTRAR dengan nama registrar Anda – misalnya "cara mengubah data DNS di GoDaddy" jika Anda menggunakan GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Gunakan halaman manajemen DNS registrar Anda (tab lain yang telah Anda buka), atur data "MX" berikut:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Perhatikan bahwa TIDAK boleh ada data MX lain yang ditetapkan. Kedua data yang ditampilkan di bawah ini HARUS ada. Pastikan tidak ada kesalahan ketik; dan ejaan mx1 dan mx2 Anda benar. Jika sudah ada data MX yang ada, harap hapus sepenuhnya.
Nilai "TTL" tidak perlu 3600, bisa lebih rendah atau lebih tinggi jika perlu.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Prioritas</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Gunakan halaman manajemen DNS registrar Anda (tab lain yang telah Anda buka), tetapkan rekaman <strong class="notranslate">TXT</strong> berikut:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan paket berbayar, Anda harus melewati langkah ini sepenuhnya dan langsung ke langkah kelima! Jika Anda tidak menggunakan paket berbayar, alamat penerusan Anda akan dapat dicari secara publik – buka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan tingkatkan domain Anda ke paket berbayar jika diinginkan. Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, lihat halaman <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Harga</a> kami. Jika tidak, Anda dapat terus memilih satu atau beberapa kombinasi dari Opsi A hingga Opsi F yang tercantum di bawah ini.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi A:
</strong>
<span>
Jika Anda meneruskan semua email dari domain Anda (misalnya "all@example.com", "hello@example.com", dll.) ke alamat tertentu "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Pastikan untuk mengganti nilai di atas pada kolom "Nilai" dengan alamat email Anda sendiri. Nilai "TTL" tidak perlu 3600, bisa lebih rendah atau lebih tinggi jika perlu. Nilai time to live ("TTL") yang lebih rendah akan memastikan setiap perubahan yang dilakukan pada rekaman DNS Anda di masa mendatang akan disebarkan ke seluruh Internet lebih cepat – anggaplah ini sebagai lamanya waktu penyimpanan cache di memori (dalam detik). Anda dapat mempelajari lebih lanjut tentang <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL di Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi B:
</strong>
<span>
Jika Anda hanya perlu meneruskan satu alamat email (misalnya <code>hello@example.com</code> ke <code>user@gmail.com</code>; ini juga akan meneruskan "hello+test@example.com" ke "user+test@gmail.com" secara otomatis):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi C:
</strong>
<span>
Jika Anda meneruskan beberapa email, pisahkan dengan koma:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi D:
</strong>
<span>
Anda dapat mengatur penerusan email tanpa batas – pastikan untuk tidak menggabungkan lebih dari 255 karakter dalam satu baris dan memulai setiap baris dengan "forward-email=". Contohnya diberikan di bawah ini:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com, beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:user@gmail.com, boop:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi E:
</strong>
<span>
Anda juga dapat menentukan nama domain di data <strong class="notranslate">TXT</strong> Anda untuk memiliki penerusan alias global (misalnya, "user@example.com" akan diteruskan ke "user@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=example.net</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi F:
</strong>
<span>
Anda bahkan dapat menggunakan webhook sebagai alias global atau individual untuk meneruskan email. Lihat contoh dan bagian lengkap tentang webhook berjudul <a href="#do-you-support-webhooks" class="alert-link">Apakah Anda mendukung webhook</a> di bawah ini.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opsi G:
</strong>
<span>
Anda bahkan dapat menggunakan ekspresi reguler ("regex") untuk mencocokkan alias dan menangani substitusi untuk meneruskan email. Lihat contoh dan bagian lengkap tentang regex berjudul <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Apakah Anda mendukung ekspresi reguler atau regex</a> di bawah ini.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Butuh ekspresi reguler tingkat lanjut dengan substitusi?</strong> Lihat contoh dan bagian lengkap tentang ekspresi reguler berjudul <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Apakah Anda mendukung ekspresi reguler atau ekspresi reguler</a> di bawah ini.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh Sederhana:</strong> Jika saya ingin semua email yang masuk ke `linus@example.com` atau `torvalds@example.com` diteruskan ke `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Aturan penerusan catch-all juga dapat digambarkan sebagai "fall-through".
Ini berarti email masuk yang cocok dengan setidaknya satu aturan penerusan tertentu akan digunakan, bukan catch-all.
Aturan spesifik mencakup alamat email dan ekspresi reguler.
<br /><br />
Contoh:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Email yang dikirim ke <code>hello@example.com</code> **tidak** akan diteruskan ke <code>second@gmail.com</code> (catch-all) dengan konfigurasi ini, dan hanya akan dikirimkan ke <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Gunakan halaman manajemen DNS registrar Anda (tab lain yang telah Anda buka), tetapkan juga rekaman <strong class="notranslate">TXT</strong> berikut:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan Gmail (misalnya, Kirim Email Sebagai) atau G Suite, Anda perlu menambahkan <code>include:_spf.google.com</code> ke nilai di atas, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Jika Anda sudah memiliki baris serupa dengan "v=spf1", maka Anda perlu menambahkan <code>include:spf.forwardemail.net</code> tepat sebelum rekaman "include:host.com" yang ada dan sebelum "-all" pada baris yang sama, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Perhatikan bahwa ada perbedaan antara "-all" dan "~all". Tanda "-" menunjukkan bahwa pemeriksaan SPF akan GAGAL jika tidak cocok, dan "~" menunjukkan bahwa pemeriksaan SPF akan GAGAL SENDIRI. Kami menyarankan untuk menggunakan pendekatan "-all" guna mencegah pemalsuan domain.
<br /><br />
Anda mungkin juga perlu menyertakan catatan SPF untuk host tempat Anda mengirim email (misalnya Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifikasi catatan DNS Anda menggunakan alat "Verifikasi Catatan" kami yang tersedia di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan.

</li><li class="mb-2 mb-md-3 mb-lg-5">Kirim email percobaan untuk memastikannya berfungsi. Harap dicatat bahwa mungkin perlu waktu untuk menyebarkan data DNS Anda.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
</span>
Jika Anda tidak menerima email uji coba, atau menerima email uji coba yang bertuliskan "Hati-hati dengan pesan ini", lihat jawaban untuk <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Mengapa saya tidak menerima email uji coba saya</a> dan <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Mengapa email uji coba yang saya kirim ke alamat saya sendiri di Gmail ditampilkan sebagai "mencurigakan"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Jika Anda ingin "Kirim Email Sebagai" dari Gmail, Anda perlu <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">menonton video ini</a></strong>, atau ikuti langkah-langkah di bawah <a href="#how-to-send-mail-as-using-gmail">How untuk Mengirim Email Sebagai Menggunakan Gmail</a> di bawah ini.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Add-on opsional tercantum di bawah ini. Harap dicatat bahwa add-on ini sepenuhnya opsional dan mungkin tidak diperlukan. Kami ingin setidaknya memberi Anda informasi tambahan jika diperlukan.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Add-on Opsional:
</strong>
<span>
Jika Anda menggunakan fitur <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How untuk Mengirim Email Sebagai menggunakan Gmail</a>, Anda mungkin ingin menambahkan diri Anda ke daftar putih. Lihat <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">petunjuk ini dari Gmail</a> tentang topik ini.
</span>
</div>

### Dapatkah saya menggunakan beberapa bursa dan server MX untuk penerusan lanjutan? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ya, tetapi **Anda seharusnya hanya memiliki satu pertukaran MX yang tercantum dalam catatan DNS Anda**.

Jangan mencoba menggunakan "Prioritas" sebagai cara untuk mengonfigurasi beberapa pertukaran MX.

Sebaliknya, Anda perlu mengonfigurasi pertukaran MX yang ada untuk meneruskan email untuk semua alias yang tidak cocok ke pertukaran layanan kami (`mx1.forwardemail.net` dan/atau `mx2.forwardemail.net`).

Jika Anda menggunakan Google Workspace dan ingin meneruskan semua alias yang tidak cocok ke layanan kami, lihat <https://support.google.com/a/answer/6297084>.

Jika Anda menggunakan Microsoft 365 (Outlook) dan ingin meneruskan semua alias yang tidak cocok ke layanan kami, lihat <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> dan <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Bagaimana cara mengatur penjawab saat libur (penjawab otomatis saat sedang tidak di kantor) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias dan buat atau edit alias yang ingin Anda konfigurasikan untuk penjawab otomatis liburan.

Anda memiliki kemampuan untuk mengonfigurasi tanggal mulai, tanggal akhir, subjek, dan pesan, serta mengaktifkan atau menonaktifkannya kapan saja:

* Subjek dan pesan teks biasa saat ini didukung (kami menggunakan paket `striptags` secara internal untuk menghapus HTML apa pun).
* Subjek dibatasi hingga 100 karakter.
* Pesan dibatasi hingga 1000 karakter.
* Pengaturan memerlukan konfigurasi SMTP Keluar (misalnya, Anda perlu menyiapkan rekaman DKIM, DMARC, dan DNS Return-Path).
* Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan.
* Penjawab liburan tidak dapat diaktifkan pada nama domain vanity global (misalnya, [alamat sekali pakai](/disposable-addresses) tidak didukung). * Penjawab liburan tidak dapat diaktifkan untuk alias dengan wildcard/catch-all (`*`) maupun ekspresi reguler.

Berbeda dengan sistem surel seperti `postfix` (misalnya yang menggunakan ekstensi filter liburan `sieve`) – Forward Email secara otomatis menambahkan tanda tangan DKIM Anda, mengatasi masalah koneksi secara palsu saat mengirim balasan liburan (misalnya karena masalah koneksi SSL/TLS umum dan server yang dikelola lama), dan bahkan mendukung enkripsi Open WKD dan PGP untuk balasan liburan.

<!--
* Untuk mencegah penyalahgunaan, 1 kredit SMTP keluar akan dipotong untuk setiap pesan balasan tidak terkirim.
* Semua akun berbayar sudah termasuk 300 kredit per hari secara default. Jika Anda membutuhkan jumlah yang lebih besar, silakan hubungi kami.
-->

1. Kami hanya mengirim satu kali per [masuk daftar putih](#do-you-have-an-allowlist) pengirim setiap 4 hari (yang mirip dengan perilaku Gmail).

* Cache Redis kami menggunakan sidik jari `alias_id` dan `sender`, sedangkan `alias_id` adalah alias ID MongoDB dan `sender` adalah alamat Dari (jika diizinkan) atau domain root di alamat Dari (jika tidak diizinkan). Untuk menyederhanakannya, masa berlaku sidik jari ini di cache diatur ke 4 hari.

* Pendekatan kami dalam menggunakan domain root yang diurai dalam alamat Dari untuk pengirim yang tidak masuk daftar putih mencegah penyalahgunaan dari pengirim yang relatif tidak dikenal (misalnya pelaku jahat) yang membanjiri pesan penjawab liburan.

2. Kami hanya mengirim apabila MAIL FROM dan/atau From tidak kosong dan tidak mengandung (tanpa memperhatikan huruf besar/kecil) [nama pengguna kepala kantor pos](#what-are-postmaster-addresses) (bagian sebelum @ dalam email).

3. Kami tidak mengirim jika pesan asli memiliki salah satu tajuk berikut (tidak peka huruf besar-kecil):

* Header `auto-submitted` dengan nilai yang tidak sama dengan `no`. * Header dari `x-auto-response-suppress` dengan nilai `dr`, `autoreply`, `auto-reply`, `auto_reply`, atau `all`
* Header dari `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, atau `x-auto-respond` (tanpa memandang nilai).
* Header dari `precedence` dengan nilai `bulk`, `autoreply`, `auto-reply`, `auto_reply`, atau `list`.

4. Kami tidak mengirim jika alamat email MAIL FROM atau From diakhiri dengan `+donotreply`, `-donotreply`, `+noreply`, atau `-noreply`.

5. Kami tidak mengirim jika bagian nama pengguna alamat email Dari adalah `mdaemon` dan memiliki header yang tidak peka huruf besar/kecil `X-MDDSN-Message`.

6. Kami tidak mengirim jika ada header `content-type` yang tidak peka huruf besar/kecil dari `multipart/report`.

### Bagaimana cara mengatur SPF untuk Email Terusan {#how-do-i-set-up-spf-for-forward-email}

Dengan menggunakan halaman manajemen DNS pendaftar Anda, tetapkan rekaman <strong class="notranslate">TXT</strong> berikut:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan Gmail (misalnya, Kirim Email Sebagai) atau G Suite, Anda perlu menambahkan <code>include:_spf.google.com</code> ke nilai di atas, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan Microsoft Outlook atau Live.com, Anda perlu menambahkan <code>include:spf.protection.outlook.com</code> ke data <strong class="notranslate">TXT</strong> SPF Anda, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Jika Anda sudah memiliki baris serupa dengan "v=spf1", maka Anda perlu menambahkan <code>include:spf.forwardemail.net</code> tepat sebelum rekaman "include:host.com" yang ada dan sebelum "-all" pada baris yang sama, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Perhatikan bahwa ada perbedaan antara "-all" dan "~all". Tanda "-" menunjukkan bahwa pemeriksaan SPF akan GAGAL jika tidak cocok, dan "~" menunjukkan bahwa pemeriksaan SPF akan GAGAL SENDIRI. Kami menyarankan untuk menggunakan pendekatan "-all" guna mencegah pemalsuan domain.
<br /><br />
Anda mungkin juga perlu menyertakan catatan SPF untuk host tempat Anda mengirim email (misalnya Outlook).
</span>
</div>

### Bagaimana cara mengatur DKIM untuk Penerusan Email {#how-do-i-set-up-dkim-for-forward-email}

Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan.

### Bagaimana cara mengatur DMARC untuk Penerusan Email {#how-do-i-set-up-dmarc-for-forward-email}

Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan.

### Bagaimana cara menghubungkan dan mengonfigurasi kontak saya {#how-do-i-connect-and-configure-my-contacts}

**Untuk mengonfigurasi kontak Anda, gunakan URL CardDAV dari:** `https://carddav.forwardemail.net` (atau cukup `carddav.forwardemail.net` jika klien Anda mengizinkannya)

### Bagaimana cara menghubungkan dan mengonfigurasi kalender saya {#how-do-i-connect-and-configure-my-calendars}

**Untuk mengonfigurasi kalender Anda, gunakan URL CalDAV dari:** `https://caldav.forwardemail.net` (atau cukup `caldav.forwardemail.net` jika klien Anda mengizinkannya)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Contoh Pengaturan CalDAV Thunderbird untuk Meneruskan Email Kalender" />

### Bagaimana cara menambahkan lebih banyak kalender dan mengelola kalender yang sudah ada? {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Jika Anda ingin menambahkan kalender tambahan, tambahkan saja URL kalender baru: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**pastikan untuk mengganti `calendar-name` dengan nama kalender yang Anda inginkan**)

Anda dapat mengubah nama dan warna kalender setelah dibuat – cukup gunakan aplikasi kalender pilihan Anda (misalnya Apple Mail atau [burung guntur](https://thunderbird.net)).

### Bagaimana cara mengatur SRS untuk Meneruskan Email {#how-do-i-set-up-srs-for-forward-email}

Kami secara otomatis mengonfigurasi [Skema Penulisan Ulang Pengirim](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – Anda tidak perlu melakukannya sendiri.

### Bagaimana cara mengatur MTA-STS untuk Meneruskan Email {#how-do-i-set-up-mta-sts-for-forward-email}

Silakan lihat [bagian kami tentang MTA-STS](#do-you-support-mta-sts) untuk informasi lebih lanjut.

### Bagaimana cara menambahkan gambar profil ke alamat email saya {#how-do-i-add-a-profile-picture-to-my-email-address}

Jika Anda menggunakan Gmail, ikuti langkah-langkah berikut:

1. Buka <https://google.com> dan keluar dari semua akun email.
2. Klik "Masuk" dan pada menu tarik-turun, klik "akun lain".
3. Pilih "Gunakan akun lain".
4. Pilih "Buat akun".
5. Pilih "Gunakan alamat email saya saat ini".
6. Masukkan alamat email dengan nama domain khusus Anda.
7. Terima email verifikasi yang dikirim ke alamat email Anda.
8. Masukkan kode verifikasi dari email ini.
9. Lengkapi informasi profil untuk akun Google baru Anda.
10. Setujui semua kebijakan Privasi dan Ketentuan Penggunaan.
11. Buka <https://google.com> dan di pojok kanan atas, klik ikon profil Anda, lalu klik tombol "ubah".
12. Unggah foto atau avatar baru untuk akun Anda.
13. Perubahan akan memakan waktu sekitar 1-2 jam untuk diterapkan, tetapi terkadang bisa sangat cepat.
14. Kirim email uji coba dan foto profil akan muncul.

## Fitur Lanjutan {#advanced-features}

### Apakah Anda mendukung buletin atau milis untuk email terkait pemasaran {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ya, Anda dapat membaca lebih lanjut di <https://forwardemail.net/guides/newsletter-with-listmonk>.

Harap diperhatikan bahwa untuk menjaga reputasi IP dan memastikan pengiriman, Forward Email memiliki proses peninjauan manual per domain untuk **persetujuan buletin**. Kirimkan email ke <support@forwardemail.net> atau buka [permintaan bantuan](https://forwardemail.net/help) untuk persetujuan. Proses ini biasanya membutuhkan waktu kurang dari 24 jam, dengan sebagian besar permintaan diproses dalam 1-2 jam. Dalam waktu dekat, kami berencana untuk mempercepat proses ini dengan menambahkan kontrol spam dan pemberitahuan. Proses ini memastikan email Anda masuk ke kotak masuk dan pesan Anda tidak ditandai sebagai spam.

### Apakah Anda mendukung pengiriman email dengan API {#do-you-support-sending-email-with-api}

Ya, mulai Mei 2023 kami mendukung pengiriman email dengan API sebagai add-on untuk semua pengguna berbayar.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a>, <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a>, dan <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Batas SMTP Keluar</a> kami – penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
</span>
</div>

Silakan lihat bagian kami pada [Surel](/email-api#outbound-emails) dalam dokumentasi API kami untuk opsi, contoh, dan wawasan lebih lanjut.

Untuk mengirim email keluar dengan API kami, Anda harus menggunakan token API yang tersedia di [Keamanan Saya](/my-account/security).

### Apakah Anda mendukung penerimaan email dengan IMAP {#do-you-support-receiving-email-with-imap}

Ya, mulai 16 Oktober 2023, kami mendukung penerimaan email melalui IMAP sebagai add-on untuk semua pengguna berbayar. **Silakan baca artikel mendalam kami** tentang [cara kerja fitur penyimpanan kotak surat SQLite terenkripsi kami](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instruksi-imap">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a> dan <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a> kami – penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
</span>
</div>

1. Buat alias baru untuk domain Anda di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

2. Klik <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di samping alias yang baru dibuat. Salin ke clipboard Anda dan simpan kata sandi yang dihasilkan yang ditampilkan di layar dengan aman.

3. Gunakan aplikasi email pilihan Anda, tambahkan atau konfigurasikan akun dengan alias yang baru Anda buat (misalnya <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Kami merekomendasikan penggunaan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, atau <a href="/blog/open-source" class="alert-link" target="_blank">alternatif sumber terbuka dan berfokus pada privasi</a>.</span>
</div>

4. Saat diminta nama server IMAP, masukkan `imap.forwardemail.net`

5. Saat dimintai port server IMAP, masukkan `993` (SSL/TLS) – lihat [port IMAP alternatif](/faq#what-are-your-imap-server-configuration-settings) jika perlu
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Jika Anda menggunakan Thunderbird, pastikan "Keamanan koneksi" diatur ke "SSL/TLS" dan Metode autentikasi diatur ke "Kata sandi normal".</span>
</div>

6. Saat diminta kata sandi server IMAP, tempel kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Hasilkan Kata Sandi</strong> pada langkah 2 di atas

7. **Simpan pengaturan Anda** – jika Anda mengalami masalah, silakan <a href="/help">hubungi kami</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

Bahasa Indonesia:

### Apakah Anda mendukung POP3 {#do-you-support-pop3}

Ya, mulai 4 Desember 2023, kami mendukung [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) sebagai add-on untuk semua pengguna berbayar. **Silakan baca artikel mendalam kami** tentang [cara kerja fitur penyimpanan kotak surat SQLite terenkripsi kami](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instruksi-pop3">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a> dan <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a> kami – penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
</span>
</div>

1. Buat alias baru untuk domain Anda di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

2. Klik <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di samping alias yang baru dibuat. Salin ke clipboard Anda dan simpan kata sandi yang dihasilkan yang ditampilkan di layar dengan aman.

3. Gunakan aplikasi email pilihan Anda, tambahkan atau konfigurasikan akun dengan alias yang baru Anda buat (misalnya <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Kami merekomendasikan penggunaan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, atau <a href="/blog/open-source" class="alert-link" target="_blank">alternatif sumber terbuka dan berfokus pada privasi</a>.</span>
</div>

4. Saat diminta nama server POP3, masukkan `pop3.forwardemail.net`

5. Saat diminta port server POP3, masukkan `995` (SSL/TLS) – lihat [port POP3 alternatif](/faq#what-are-your-pop3-server-configuration-settings) jika perlu
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Jika Anda menggunakan Thunderbird, pastikan "Keamanan koneksi" diatur ke "SSL/TLS" dan Metode autentikasi diatur ke "Kata sandi normal".</span>
</div>

6. Saat diminta kata sandi server POP3, tempel kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Hasilkan Kata Sandi</strong> pada langkah 2 di atas

7. **Simpan pengaturan Anda** – jika Anda mengalami masalah, silakan <a href="/help">hubungi kami</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

Bahasa Indonesia:

### Apakah Anda mendukung kalender (CalDAV) {#do-you-support-calendars-caldav}

Ya, kami telah menambahkan fitur ini mulai 5 Februari 2024. Server kami adalah `caldav.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Mendukung IPv4 dan IPv6 dan tersedia melalui port `443` (HTTPS).

| Login | Contoh | Keterangan |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nama belakang | `user@example.com` | Alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>. |
| Kata sandi | `************************` | Kata sandi yang dibuat khusus alias. |

Agar dapat menggunakan dukungan kalender, **pengguna** harus berupa alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi** harus berupa kata sandi yang dibuat khusus untuk alias.

### Apakah Anda mendukung kontak (CardDAV) {#do-you-support-contacts-carddav}

Ya, kami telah menambahkan fitur ini mulai 12 Juni 2025. Server kami adalah `carddav.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Mendukung IPv4 dan IPv6 dan tersedia melalui port `443` (HTTPS).

| Login | Contoh | Keterangan |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nama belakang | `user@example.com` | Alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>. |
| Kata sandi | `************************` | Kata sandi yang dibuat khusus alias. |

Agar dapat menggunakan dukungan kontak, **pengguna** harus berupa alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi** harus berupa kata sandi yang dibuat khusus untuk alias.

### Apakah Anda mendukung pengiriman email dengan SMTP {#do-you-support-sending-email-with-smtp}

Ya, mulai Mei 2023 kami mendukung pengiriman email dengan SMTP sebagai add-on untuk semua pengguna berbayar.

<div id="instruksi-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Pastikan Anda telah membaca <a href="/terms" class="alert-link" target="_blank">Ketentuan</a>, <a href="/privacy" class="alert-link" target="_blank">Kebijakan Privasi</a>, dan <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Batas SMTP Keluar</a> kami – penggunaan Anda dianggap sebagai pengakuan dan persetujuan.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan Gmail, silakan lihat <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Panduan Kirim Email dengan Gmail</a> kami. Jika Anda seorang pengembang, silakan lihat <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentasi API email</a> kami.
</span>
</div>

1. Buka <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Pengaturan <i class="fa fa-angle-right"></i> Konfigurasi SMTP Keluar dan ikuti petunjuk pengaturan

2. Buat alias baru untuk domain Anda di bawah <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code><hello@example.com></code>)

3. Klik <strong class="text-success"><i class="fa fa-key"></i> Buat Kata Sandi</strong> di samping alias yang baru dibuat. Salin ke clipboard Anda dan simpan dengan aman kata sandi yang dibuat yang ditampilkan di layar.

4. Gunakan aplikasi email pilihan Anda, tambahkan atau konfigurasikan akun dengan alias yang baru Anda buat (misalnya <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Kami merekomendasikan penggunaan <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, atau <a href="/blog/open-source" class="alert-link" target="_blank">alternatif sumber terbuka dan berfokus pada privasi</a>.</span>
</div>

5. Saat diminta nama server SMTP, masukkan `smtp.forwardemail.net`

6. Saat dimintai port server SMTP, masukkan `465` (SSL/TLS) – lihat [port SMTP alternatif](/faq#what-are-your-smtp-server-configuration-settings) jika perlu
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Jika Anda menggunakan Thunderbird, pastikan "Keamanan koneksi" diatur ke "SSL/TLS" dan Metode autentikasi diatur ke "Kata sandi normal".</span>
</div>

7. Saat diminta kata sandi server SMTP, tempel kata sandi dari <strong class="text-success"><i class="fa fa-key"></i> Hasilkan Kata Sandi</strong> pada langkah 3 di atas

8. **Simpan pengaturan Anda dan kirim email percobaan pertama Anda** – jika Anda mengalami masalah, silakan <a href="/help">hubungi kami</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Harap diperhatikan bahwa untuk menjaga reputasi IP dan memastikan pengiriman, kami memiliki proses peninjauan manual per domain untuk persetujuan SMTP keluar. Proses ini biasanya memakan waktu kurang dari 24 jam, dengan sebagian besar permintaan diproses dalam 1-2 jam. Dalam waktu dekat, kami berencana untuk mempercepat proses ini dengan kontrol spam dan peringatan tambahan. Proses ini memastikan email Anda masuk ke kotak masuk dan pesan Anda tidak ditandai sebagai spam.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

Bahasa Indonesia:

### Apakah Anda mendukung OpenPGP/MIME, enkripsi ujung ke ujung ("E2EE"), dan Direktori Kunci Web ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ya, kami mendukung [BukaPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [enkripsi ujung ke ujung ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), dan penemuan kunci publik menggunakan [Direktori Kunci Web ("WKD")](https://wiki.gnupg.org/WKD). Anda dapat mengonfigurasi OpenPGP menggunakan [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) atau [host sendiri kunci Anda](https://wiki.gnupg.org/WKDHosting) (lihat [inti ini untuk pengaturan server WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Pencarian WKD di-cache selama 1 jam untuk memastikan pengiriman email yang tepat waktu → oleh karena itu, jika Anda menambahkan, mengubah, atau menghapus kunci WKD Anda, silakan kirimkan email kepada kami di `support@forwardemail.net` dengan alamat email Anda agar kami dapat menghapus cache secara manual.
* Kami mendukung enkripsi PGP untuk pesan yang diteruskan melalui pencarian WKD atau menggunakan kunci PGP yang diunggah di antarmuka kami.
* Kunci yang diunggah akan berlaku selama kotak centang PGP diaktifkan/dicentang.
* Pesan yang dikirim ke webhook saat ini tidak dienkripsi dengan PGP.
* Jika Anda memiliki beberapa alias yang cocok untuk alamat penerusan tertentu (misalnya regex/wildcard/kombinasi persis) dan jika lebih dari satu alias tersebut berisi kunci PGP yang diunggah dan telah dicentang PGP → maka kami akan mengirimkan email peringatan kesalahan dan tidak akan mengenkripsi pesan dengan kunci PGP yang Anda unggah. Hal ini sangat jarang terjadi dan biasanya hanya berlaku untuk pengguna tingkat lanjut dengan aturan alias yang kompleks.
* **Enkripsi PGP tidak akan diterapkan pada penerusan email melalui server MX kami jika pengirim memiliki kebijakan penolakan DMARC. Jika Anda memerlukan enkripsi PGP pada *semua* email, kami sarankan untuk menggunakan layanan IMAP kami dan mengonfigurasi kunci PGP Anda untuk alias email masuk.**

**Anda dapat memvalidasi pengaturan Direktori Kunci Web Anda di <https://wkd.chimbosonic.com/> (sumber terbuka) atau <https://www.webkeydirectory.com/> (milik).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Enkripsi Otomatis:
</strong>
<span>Jika Anda menggunakan <a href="#do-you-support-sending-email-with-smtp" class="alert-link">layanan SMTP keluar</a> kami dan mengirimkan pesan yang tidak terenkripsi, maka kami akan secara otomatis mencoba mengenkripsi pesan per penerima menggunakan <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Direktori Kunci ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Anda harus mengikuti semua langkah berikut untuk mengaktifkan OpenPGP untuk nama domain kustom Anda.
</span>
</div>

1. Unduh dan instal plugin yang direkomendasikan klien email Anda di bawah ini:

| Klien Email | Platform | Plugin yang Direkomendasikan | Catatan |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| burung guntur | Meja kerja | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird memiliki dukungan bawaan untuk OpenPGP. |
| Gmail | Peramban | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi kepemilikan) | Gmail tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin sumber terbuka [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download). |
| Surat Apple | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin sumber terbuka [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Surat Apple | Bahasa Indonesia: | [PGPro](https://github.com/opensourceios/PGPro/) atau [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (lisensi kepemilikan) | Apple Mail tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin sumber terbuka [PGPro](https://github.com/opensourceios/PGPro/) atau [FlowCrypt](https://flowcrypt.com/download). |
| Pandangan | Jendela | [gpg4win](https://www.gpg4win.de/index.html) | Klien email desktop Outlook tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin sumber terbuka [gpg4win](https://www.gpg4win.de/index.html). |
| Pandangan | Peramban | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi kepemilikan) | Klien email berbasis web Outlook tidak mendukung OpenPGP, namun Anda dapat mengunduh plugin sumber terbuka [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download). |
| Bahasa Indonesia: Android | Seluler | [OpenKeychain](https://www.openkeychain.org/) atau [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) seperti [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) dan [FairEmail](https://github.com/M66B/FairEmail) keduanya mendukung plugin sumber terbuka [OpenKeychain](https://www.openkeychain.org/). Sebagai alternatif, Anda dapat menggunakan plugin sumber terbuka (lisensi kepemilikan) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Peramban | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi kepemilikan) | Anda dapat mengunduh ekstensi peramban sumber terbuka [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Peramban | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi kepemilikan) | Anda dapat mengunduh ekstensi peramban sumber terbuka [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Peramban | [Mailvelope](https://mailvelope.com/) | Anda dapat mengunduh ekstensi peramban sumber terbuka [Mailvelope](https://mailvelope.com/). |
| Berani | Peramban | [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download) (lisensi kepemilikan) | Anda dapat mengunduh ekstensi peramban sumber terbuka [Mailvelope](https://mailvelope.com/) atau [FlowCrypt](https://flowcrypt.com/download). |
| Kayu balsa | Meja kerja | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa memiliki dukungan bawaan untuk OpenPGP. |
| KMail | Meja kerja | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail memiliki dukungan bawaan untuk OpenPGP. |
| Evolusi GNOME | Meja kerja | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution memiliki dukungan bawaan untuk OpenPGP. |
| Terminal | Meja kerja | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Anda dapat menggunakan [gpg command line tool](https://www.gnupg.org/download/) sumber terbuka untuk menghasilkan kunci baru dari baris perintah. |

2. Buka plugin, buat kunci publik Anda, dan konfigurasikan klien email Anda untuk menggunakannya.

3. Unggah kunci publik Anda di <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Anda dapat mengunjungi <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> untuk mengelola kunci Anda di masa mendatang.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Add-on Opsional:
</strong>
<span>
Jika Anda menggunakan layanan <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">penyimpanan terenkripsi (IMAP/POP3)</a> kami dan ingin <i>semua</i> email yang tersimpan di database SQLite Anda (yang sudah terenkripsi) dienkripsi dengan kunci publik Anda, buka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias (misalnya <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edit <i class="fa fa-angle-right"></i> OpenPGP dan unggah kunci publik Anda.
</span>
</div>

4. Tambahkan rekaman `CNAME` baru ke nama domain Anda (misalnya `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>openpgpkey</code></td>
<td class="text-center">3600</td>
<td class="notranslate">CNAME</td>
<td><code>wkd.keys.openpgp.org</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>Jika alias Anda menggunakan <a class="alert-link" href="/disposable-addresses" target="_blank">domain khusus/disposable</a> kami (misalnya <code>hideaddress.net</code>), Anda dapat melewati langkah ini.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Selamat!
</strong>
<span>
Anda telah berhasil menyelesaikan semua langkah.
</span>
</div>
</div>

### Apakah Anda mendukung MTA-STS {#do-you-support-mta-sts}

Ya, mulai 2 Maret 2023, kami mendukung [MTA-STS](https://www.hardenize.com/blog/mta-sts). Anda dapat menggunakan [templat ini](https://github.com/jpawlowski/mta-sts.template) jika ingin mengaktifkannya di domain Anda.

Konfigurasi kami dapat ditemukan secara publik di GitHub di <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Apakah Anda mendukung kunci sandi dan WebAuthn {#do-you-support-passkeys-and-webauthn}

Ya! Mulai 13 Desember 2023, kami telah menambahkan dukungan untuk kunci sandi [karena permintaan yang tinggi](https://github.com/orgs/forwardemail/discussions/182).

Kunci sandi memungkinkan Anda masuk dengan aman tanpa memerlukan kata sandi dan autentikasi dua faktor.

Anda dapat memvalidasi identitas Anda dengan sentuhan, pengenalan wajah, kata sandi berbasis perangkat, atau PIN.

Kami mengizinkan Anda mengelola hingga 30 kata sandi sekaligus, sehingga Anda dapat masuk dengan semua perangkat Anda dengan mudah.

Pelajari lebih lanjut tentang kunci sandi pada tautan berikut:

* [Masuk ke aplikasi dan situs web Anda dengan kunci sandi](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Gunakan kunci sandi untuk masuk ke aplikasi dan situs web di iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artikel Wikipedia tentang Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Apakah Anda mendukung praktik terbaik email {#do-you-support-email-best-practices}

Ya. Kami memiliki dukungan bawaan untuk SPF, DKIM, DMARC, ARC, dan SRS di semua paket. Kami juga telah bekerja sama secara ekstensif dengan para penyusun awal spesifikasi ini dan pakar email lainnya untuk memastikan kesempurnaan dan tingkat pengiriman yang tinggi.

### Apakah Anda mendukung webhook bounce {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Mencari dokumentasi tentang webhook email? Lihat <a href="/faq#do-you-support-webhooks" class="alert-link">Apakah Anda mendukung webhook?</a> untuk informasi lebih lanjut.
<span>
</span>
</div>

Ya, mulai 14 Agustus 2024, kami telah menambahkan fitur ini. Anda sekarang dapat membuka Akun Saya → Domain → Setelan → URL Webhook Bounce dan mengonfigurasi URL `http://` atau `https://` yang akan kami kirimi permintaan `POST` setiap kali email SMTP keluar mengalami bounce.

Ini berguna bagi Anda untuk mengelola dan memantau SMTP keluar Anda – dan dapat digunakan untuk mempertahankan pelanggan, memilih keluar, dan mendeteksi setiap kali terjadi pentalan.

Muatan webhook bounce dikirim sebagai JSON dengan properti berikut:

* `email_id` (String) - ID email yang sesuai dengan email di Akun Saya → Email (SMTP keluar)
* `list_id` (String) - nilai header `List-ID` (tanpa memperhatikan huruf besar/kecil), jika ada, dari email keluar asli
* `list_unsubscribe` (String) - nilai header `List-Unsubscribe` (tanpa memperhatikan huruf besar/kecil), jika ada, dari email keluar asli
* `feedback_id` (String) - nilai header `Feedback-ID` (tanpa memperhatikan huruf besar/kecil), jika ada, dari email keluar asli
* `recipient` (String) - alamat email penerima yang terpental atau mengalami kesalahan
* `message` (String) - pesan kesalahan terperinci untuk pantulan
* `response` (String) - pesan respons SMTP
* `response_code` (Angka) - kode respons SMTP yang diurai
* `truth_source` (String) - jika kode respons berasal dari sumber tepercaya, nilai ini akan diisi dengan nama domain root (misalnya `google.com` atau `yahoo.com`)
* `bounce` (Objek) - objek yang berisi properti berikut yang merinci Status pantulan dan penolakan
* `action` (String) - tindakan pantulan (misalnya `"reject"`)
* `message` (String) - alasan pantulan (misalnya `"Message Sender Blocked By Receiving Server"`)
* `category` (String) - kategori pantulan (misalnya `"block"`)
* `code` (Nomor) - kode status pantulan (misalnya `554`)
* `status` (String) - kode pantulan dari pesan balasan (misalnya `5.7.1`)
* `line` (Nomor) - nomor baris yang diurai, jika ada, [dari daftar parse pantulan Zona-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (misalnya `526`)
* `headers` (Objek) - pasangan kunci nilai header untuk email keluar
* `bounced_at` (String) - Tanggal yang diformat [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) untuk saat kesalahan pantulan terjadi

Misalnya:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Berikut beberapa catatan tambahan mengenai webhook pentalan:

* Jika muatan webhook berisi nilai `list_id`, `list_unsubscribe`, atau `feedback_id`, maka Anda harus mengambil tindakan yang tepat untuk menghapus `recipient` dari daftar jika perlu.
* Jika nilai `bounce.category` adalah `"block"`, `"recipient"`, `"spam"`, atau `"virus"`, maka Anda harus menghapus pengguna tersebut dari daftar.
* Jika Anda perlu memverifikasi payload webhook (untuk memastikan payload tersebut benar-benar berasal dari server kami), Anda dapat [selesaikan alamat IP klien jarak jauh nama host klien menggunakan pencarian terbalik](https://nodejs.org/api/dns.html#dnspromisesreverseip) – seharusnya `smtp.forwardemail.net`.
* Anda juga dapat memeriksa IP dengan [alamat IP kami yang dipublikasikan](#what-are-your-servers-ip-addresses).
* Buka Akun Saya → Domain → Pengaturan → Kunci Verifikasi Payload Tanda Tangan Webhook untuk mendapatkan kunci webhook Anda.
* Anda dapat merotasi kunci ini kapan saja demi alasan keamanan.
* Hitung dan bandingkan nilai `X-Webhook-Signature` dari permintaan webhook kami dengan nilai isi yang dihitung menggunakan kunci ini. Contoh cara melakukannya tersedia di [postingan Stack Overflow ini](https://stackoverflow.com/a/68885281).
* Lihat diskusi di <https://github.com/forwardemail/free-email-forwarding/issues/235> untuk informasi lebih lanjut.
* Kami akan menunggu hingga `5` detik hingga titik akhir webhook Anda merespons dengan kode status `200`, dan kami akan mencoba lagi hingga `1` kali.
* Jika kami mendeteksi URL webhook bounce Anda mengalami kesalahan saat kami mencoba mengirimkan permintaan, kami akan mengirimkan email balasan seminggu sekali.

### Apakah Anda mendukung webhook {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Mencari dokumentasi tentang webhook bounce? Lihat <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Apakah Anda mendukung webhook bounce?</a> untuk informasi lebih lanjut.
<span>
</span>
</div>

Ya, mulai 15 Mei 2020, kami telah menambahkan fitur ini. Anda cukup menambahkan webhook seperti yang Anda lakukan dengan penerima lainnya! Pastikan Anda telah menambahkan awalan protokol "http" atau "https" di URL webhook.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Perlindungan Privasi yang Ditingkatkan:
</strong>
<span>
Jika Anda menggunakan paket berbayar (yang dilengkapi perlindungan privasi yang ditingkatkan), silakan buka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan klik "Alias" di samping domain Anda untuk mengonfigurasi webhook Anda. Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, lihat halaman <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Harga</a> kami. Jika tidak, Anda dapat terus mengikuti petunjuk di bawah ini.
</span>
</div>

Jika Anda menggunakan paket gratis, cukup tambahkan rekaman DNS <strong class="notranslate">TXT</strong> baru seperti yang ditunjukkan di bawah ini:

Misalnya, jika saya ingin semua email yang masuk ke `alias@example.com` diteruskan ke titik akhir pengujian [permintaan bin](https://requestbin.com/r/en8pfhdgcculn?inspect) yang baru:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Atau mungkin Anda ingin semua email yang masuk ke `example.com` diteruskan ke titik akhir ini:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Berikut catatan tambahan mengenai webhook:**

* Jika Anda perlu memverifikasi payload webhook (untuk memastikan payload tersebut benar-benar berasal dari server kami), Anda dapat menggunakan [selesaikan alamat IP klien jarak jauh nama host klien menggunakan pencarian terbalik](https://nodejs.org/api/dns.html#dnspromisesreverseip) – sebaiknya `mx1.forwardemail.net` atau `mx2.forwardemail.net`.
* Anda juga dapat memeriksa IP dengan [alamat IP kami yang dipublikasikan](#what-are-your-servers-ip-addresses).
* Jika Anda menggunakan paket berbayar, buka Akun Saya → Domain → Pengaturan → Kunci Verifikasi Payload Tanda Tangan Webhook untuk mendapatkan kunci webhook Anda.
* Anda dapat merotasi kunci ini kapan saja demi alasan keamanan.
* Hitung dan bandingkan nilai `X-Webhook-Signature` dari permintaan webhook kami dengan nilai isi yang dihitung menggunakan kunci ini. Contoh cara melakukannya tersedia di [postingan Stack Overflow ini](https://stackoverflow.com/a/68885281).
* Lihat diskusi di <https://github.com/forwardemail/free-email-forwarding/issues/235> untuk informasi lebih lanjut.
* Jika webhook tidak merespons dengan kode status `200`, maka kami akan menyimpan responsnya di [log kesalahan dibuat](#do-you-store-error-logs) – yang berguna untuk debugging.
* Permintaan HTTP webhook akan mencoba ulang hingga 3 kali setiap upaya koneksi SMTP, dengan batas waktu maksimal 60 detik per permintaan POST titik akhir. **Perhatikan bahwa ini tidak berarti hanya mencoba ulang 3 kali**, webhook akan mencoba ulang secara terus-menerus seiring waktu dengan mengirimkan kode SMTP 421 (yang memberi tahu pengirim untuk mencoba ulang nanti) setelah upaya permintaan POST HTTP ke-3 yang gagal. Ini berarti email akan mencoba ulang terus-menerus selama berhari-hari hingga kode status 200 tercapai.
* Kami akan mencoba ulang secara otomatis berdasarkan status default dan kode kesalahan yang digunakan dalam [metode percobaan ulang superagent](https://ladjs.github.io/superagent/#retrying-requests) (kami adalah pengelola). * Kami mengelompokkan permintaan HTTP webhook ke titik akhir yang sama dalam satu permintaan, alih-alih beberapa permintaan, untuk menghemat sumber daya dan mempercepat waktu respons. Misalnya, jika Anda mengirim email ke <webhook1@example.com>, <webhook2@example.com>, dan <webhook3@example.com>, dan semuanya dikonfigurasi untuk mencapai URL titik akhir *yang sama persis*, maka hanya satu permintaan yang akan dibuat. Kami mengelompokkan berdasarkan pencocokan titik akhir yang tepat dengan kesetaraan yang ketat.
* Perhatikan bahwa kami menggunakan metode "simpleParser" dari pustaka [pengurai surat](https://nodemailer.com/extras/mailparser/) untuk mengurai pesan menjadi objek yang ramah JSON.
* Nilai email mentah sebagai String diberikan sebagai properti "raw".
* Hasil autentikasi diberikan sebagai properti "dkim", "spf", "arc", "dmarc", dan "bimi".
* Header email yang diurai diberikan sebagai properti "headers" – tetapi perlu diketahui juga bahwa Anda dapat menggunakan "headerLines" untuk iterasi dan penguraian yang lebih mudah.
* Penerima yang dikelompokkan untuk webhook ini dikelompokkan bersama dan diberikan sebagai properti "penerima".
* Informasi sesi SMTP diberikan sebagai properti "sesi". Ini berisi informasi tentang pengirim pesan, waktu kedatangan pesan, HELO, dan nama host klien. Nilai nama host klien sebagai `session.clientHostname` adalah FQDN (dari pencarian PTR terbalik) atau `session.remoteAddress` yang diapit tanda kurung (misalnya `"[127.0.0.1]"`).
* Jika Anda membutuhkan cara cepat untuk mendapatkan nilai `X-Original-To`, Anda dapat menggunakan nilai `session.recipient` (lihat contoh di bawah). Header `X-Original-To` adalah header yang kami tambahkan ke pesan untuk debugging dengan penerima asli (sebelum penerusan tersamar) untuk pesan tersebut.
* Jika Anda perlu menghapus properti `attachments` dan/atau `raw` dari isi payload, cukup tambahkan `?attachments=false`, `?raw=false`, atau `?attachments=false&raw=false` ke titik akhir webhook Anda sebagai parameter querystring (misalnya `https://example.com/webhook?attachments=false&raw=false`).
* Jika ada lampiran, lampiran tersebut akan ditambahkan ke Array `attachments` dengan nilai Buffer. Anda dapat menguraikannya kembali menjadi konten menggunakan pendekatan dengan JavaScript seperti:

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Penasaran seperti apa tampilan permintaan webhook dari email yang diteruskan? Kami telah menyertakan contoh di bawah ini untuk Anda!
<span>
</span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Apakah Anda mendukung ekspresi reguler atau regex {#do-you-support-regular-expressions-or-regex}

Ya, mulai 27 September 2021, kami telah menambahkan fitur ini. Anda cukup menulis ekspresi reguler ("regex") untuk mencocokkan alias dan melakukan substitusi.

Alias yang didukung ekspresi reguler adalah alias yang dimulai dengan `/` dan diakhiri dengan `/`, dan penerimanya berupa alamat email atau webhook. Penerima juga dapat menyertakan dukungan substitusi regex (misalnya `$1`, `$2`).

Kami mendukung dua tanda ekspresi reguler, yaitu `i` dan `g`. Tanda `i` yang tidak peka huruf besar/kecil merupakan nilai default permanen dan selalu diterapkan. Tanda global `g` dapat Anda tambahkan dengan menambahkan akhiran `/` dengan `/g`.

Perhatikan bahwa kami juga mendukung fitur <a href="#can-i-disable-specific-aliases">disabled alias</a> untuk bagian penerima dengan dukungan regex kami.

Ekspresi reguler tidak didukung pada <a href="/disposable-addresses" target="_blank">domain khusus global</a> (karena ini dapat menjadi kerentanan keamanan).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Perlindungan Privasi yang Ditingkatkan:
</strong>
<span>
Jika Anda menggunakan paket berbayar (yang dilengkapi perlindungan privasi yang ditingkatkan), silakan buka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> dan klik "Alias" di samping domain Anda untuk mengonfigurasi ekspresi reguler. Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, lihat halaman <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Harga</a> kami. Jika tidak, Anda dapat terus mengikuti petunjuk di bawah ini.
</span>
</div>

Jika Anda menggunakan paket gratis, cukup tambahkan rekaman DNS <strong class="notranslate">TXT</strong> baru menggunakan satu atau beberapa contoh yang diberikan di bawah ini:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh Sederhana:</strong> Jika saya ingin semua email yang masuk ke `linus@example.com` atau `torvalds@example.com` diteruskan ke `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh Substitusi Nama Depan Nama Belakang:</strong> Bayangkan semua alamat email perusahaan Anda berpola `firstname.lastname@example.com`. Jika saya ingin semua email yang berpola `firstname.lastname@example.com` diteruskan ke `firstname.lastname@company.com` dengan dukungan substitusi (<a href="https://regexr.com/66hnu" class="alert-link">lihat uji coba di RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh Substitusi Penyaringan Simbol Plus:</strong> Jika saya ingin semua email yang masuk ke `info@example.com` atau `support@example.com` diteruskan ke `user+info@gmail.com` atau `user+support@gmail.com` (dengan dukungan substitusi) (<a href="https://regexr.com/66ho7" class="alert-link">lihat pengujian di RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh Substitusi String Kueri Webhook:</strong> Mungkin Anda ingin semua email yang masuk ke `example.com` masuk ke <a href="#do-you-support-webhooks" class="alert-link">webhook</a> dan memiliki kunci string kueri dinamis "kepada" dengan nilai bagian nama pengguna dari alamat email (<a href="https://regexr.com/66ho4" class="alert-link">uji tampilan di RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh penolakan diam-diam:</strong> Jika Anda ingin semua email yang cocok dengan pola tertentu dinonaktifkan dan ditolak diam-diam (tampak bagi pengirim seolah-olah pesan berhasil terkirim, tetapi sebenarnya tidak terkirim) dengan kode status `250` (lihat <a href="#can-i-disable-specific-aliases" class="alert-link">Dapatkah saya menonaktifkan alias tertentu</a>), maka cukup gunakan pendekatan yang sama dengan satu tanda seru "!". Ini menunjukkan kepada pengirim bahwa pesan berhasil terkirim, tetapi sebenarnya tidak terkirim (misalnya, blackhole atau `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh penolakan lunak:</strong> Jika Anda ingin semua email yang cocok dengan pola tertentu dinonaktifkan dan ditolak lunak dengan kode status `421` (lihat <a href="#can-i-disable-specific-aliases" class="alert-link">Dapatkah saya menonaktifkan alias tertentu</a>), cukup gunakan pendekatan yang sama dengan tanda seru ganda "!!". Ini memberi tahu pengirim untuk mencoba lagi email mereka, dan email ke alias ini akan dicoba lagi selama kurang lebih 5 hari, lalu ditolak secara permanen.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Contoh penolakan keras:</strong> Jika Anda ingin semua email yang cocok dengan pola tertentu dinonaktifkan dan ditolak keras dengan kode status `550` (lihat <a href="#can-i-disable-specific-aliases" class="alert-link">Dapatkah saya menonaktifkan alias tertentu</a>), maka cukup gunakan pendekatan yang sama dengan tanda seru tiga kali "!!!". Ini menandakan kesalahan permanen kepada pengirim dan email tidak akan dicoba lagi, email akan ditolak untuk alias ini.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Penasaran cara menulis ekspresi reguler atau perlu menguji penggantinya? Anda dapat mengunjungi situs web pengujian ekspresi reguler gratis <a href="https://regexr.com" class="alert-link">RegExr</a> di <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Berapa batas SMTP keluar Anda {#what-are-your-outbound-smtp-limits}

Kami membatasi pengguna dan domain hingga 300 pesan SMTP keluar per hari. Ini berarti rata-rata 9000+ email dalam satu bulan kalender. Jika Anda perlu melebihi jumlah ini atau memiliki email yang terus-menerus berukuran besar, silakan [Hubungi kami](https://forwardemail.net/help).

### Apakah saya perlu persetujuan untuk mengaktifkan SMTP {#do-i-need-approval-to-enable-smtp}

Ya, perlu diketahui bahwa untuk menjaga reputasi IP dan memastikan pengiriman, Forward Email memiliki proses peninjauan manual per domain untuk persetujuan SMTP keluar. Kirimkan email ke <support@forwardemail.net> atau buka [permintaan bantuan](https://forwardemail.net/help) untuk persetujuan. Proses ini biasanya membutuhkan waktu kurang dari 24 jam, dengan sebagian besar permintaan diproses dalam 1-2 jam. Dalam waktu dekat, kami berencana untuk mempercepat proses ini dengan menambahkan kontrol spam dan pemberitahuan. Proses ini memastikan email Anda masuk ke kotak masuk dan pesan Anda tidak ditandai sebagai spam.

### Apa pengaturan konfigurasi server SMTP Anda {#what-are-your-smtp-server-configuration-settings}

Server kami `smtp.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Mendukung IPv4 dan IPv6 dan tersedia melalui port `465` dan `2465` untuk SSL/TLS dan `587`, `2587`, `2525`, dan `25` untuk TLS (STARTTLS).

| Protokol | Nama host | Pelabuhan | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Diutamakan** | `smtp.forwardemail.net` | `465`, `2465` | :tanda_centang_putih: | :tanda_centang_putih: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :tanda_centang_putih: | :tanda_centang_putih: |

| Login | Contoh | Keterangan |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nama belakang | `user@example.com` | Alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>. |
| Kata sandi | `************************` | Kata sandi yang dibuat khusus alias. |

Agar dapat mengirim email keluar dengan SMTP, **pengguna SMTP** harus berupa alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi SMTP** harus berupa kata sandi yang dibuat khusus untuk alias.

Silakan lihat [Apakah Anda mendukung pengiriman email dengan SMTP?](#do-you-support-sending-email-with-smtp) untuk petunjuk langkah demi langkah.

### Apa pengaturan konfigurasi server IMAP Anda {#what-are-your-imap-server-configuration-settings}

Server kami `imap.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Mendukung IPv4 dan IPv6 dan tersedia melalui port `993` dan `2993` untuk SSL/TLS.

| Protokol | Nama host | Pelabuhan | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Diutamakan** | `imap.forwardemail.net` | `993`, `2993` | :tanda_centang_putih: | :tanda_centang_putih: |

| Login | Contoh | Keterangan |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nama belakang | `user@example.com` | Alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>. |
| Kata sandi | `************************` | Kata sandi yang dibuat khusus alias. |

Agar dapat terhubung dengan IMAP, **Pengguna IMAP** harus berupa alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **Kata Sandi IMAP** harus berupa kata sandi yang dibuat khusus untuk alias.

Silakan lihat [Apakah Anda mendukung penerimaan email dengan IMAP?](#do-you-support-receiving-email-with-imap) untuk petunjuk langkah demi langkah.

### Apa pengaturan konfigurasi server POP3 Anda {#what-are-your-pop3-server-configuration-settings}

Server kami `pop3.forwardemail.net` dan juga dipantau di <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">halaman status</a> kami.

Mendukung IPv4 dan IPv6 dan tersedia melalui port `995` dan `2995` untuk SSL/TLS.

| Protokol | Nama host | Pelabuhan | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Diutamakan** | `pop3.forwardemail.net` | `995`, `2995` | :tanda_centang_putih: | :tanda_centang_putih: |

| Login | Contoh | Keterangan |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nama belakang | `user@example.com` | Alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>. |
| Kata sandi | `************************` | Kata sandi yang dibuat khusus alias. |

Agar dapat terhubung dengan POP3, **pengguna POP3** harus berupa alamat email alias yang ada untuk domain di <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> – dan **kata sandi IMAP** harus berupa kata sandi yang dibuat khusus untuk alias.

Silakan lihat [Apakah Anda mendukung POP3?](#do-you-support-pop3) untuk petunjuk langkah demi langkah.

### Konfigurasi Relai SMTP Postfix {#postfix-smtp-relay-configuration}

Anda dapat mengonfigurasi Postfix untuk meneruskan email melalui server SMTP Forward Email. Ini berguna untuk aplikasi server yang perlu mengirim email.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Perkiraan Waktu Penyiapan:</strong>
<span>Kurang dari 15 menit</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Ini memerlukan paket berbayar dengan akses SMTP yang diaktifkan.
</span>
</div>

#### Instalasi {#installation}

1. Instal Postfix di server Anda:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Selama instalasi, pilih "Situs Internet" saat diminta untuk jenis konfigurasi.

Konfigurasi #### {#configuration}

1. Edit file konfigurasi utama Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Tambahkan atau ubah pengaturan ini:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Buat file kata sandi SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Tambahkan kredensial Email Terusan Anda:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Amankan dan hash file kata sandi:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Mulai ulang Postfix:

```bash
sudo systemctl restart postfix
```

#### Pengujian {#testing}

Uji konfigurasi Anda dengan mengirimkan email uji:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Keamanan {#security}

### Teknik Pengerasan Server Lanjutan {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Forward Email menerapkan sejumlah teknik penguatan server untuk memastikan keamanan infrastruktur dan data Anda:

1. **Keamanan Jaringan**:
* Firewall tabel IP dengan aturan ketat
* Fail2ban untuk perlindungan brute force
* Audit keamanan dan uji penetrasi rutin
* Akses administratif khusus VPN

2. **Pengerasan Sistem**:
* Instalasi paket minimal
* Pembaruan keamanan rutin
* SELinux dalam mode penegakan
* Akses root SSH dinonaktifkan
* Hanya autentikasi berbasis kunci

3. **Keamanan Aplikasi**:
* Header Kebijakan Keamanan Konten (CSP)
* Keamanan Transportasi Ketat HTTPS (HSTS)
* Header perlindungan XSS
* Header opsi bingkai dan kebijakan rujukan
* Audit dependensi rutin

4. **Perlindungan Data**:
* Enkripsi disk penuh dengan LUKS
* Manajemen kunci yang aman
* Pencadangan rutin dengan enkripsi
* Praktik minimisasi data

5. **Pemantauan dan Respons**:
* Deteksi intrusi secara real-time
* Pemindaian keamanan otomatis
* Pencatatan dan analisis terpusat
* Prosedur respons insiden

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Apakah Anda memiliki sertifikasi SOC 2 atau ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Forward Email tidak secara langsung memiliki sertifikasi SOC 2 Tipe II atau ISO 27001. Namun, layanan ini beroperasi pada infrastruktur yang disediakan oleh subprosesor bersertifikat:

**DigitalOcean**: Bersertifikasi SOC 2 Tipe II dan SOC 3 Tipe II (diaudit oleh Schellman & Company LLC), bersertifikat ISO 27001 di beberapa pusat data. Detail: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: Bersertifikat SOC 2+ (HIPAA), sertifikasi ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detail: <https://www.vultr.com/legal/compliance/>

**DataPacket**: Sesuai SOC 2 (hubungi DataPacket langsung untuk mendapatkan sertifikasi), penyedia infrastruktur kelas perusahaan (lokasi Denver). Detail: <https://www.datapacket.com/datacenters/denver>

Forward Email mengikuti praktik terbaik industri untuk audit keamanan dan secara rutin bekerja sama dengan peneliti keamanan independen. Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Apakah Anda menggunakan enkripsi TLS untuk penerusan email {#do-you-use-tls-encryption-for-email-forwarding}

Ya. Forward Email secara ketat menerapkan TLS 1.2+ untuk semua koneksi (HTTPS, SMTP, IMAP, POP3) dan menerapkan MTA-STS untuk dukungan TLS yang lebih baik. Implementasinya meliputi:

* Penerapan TLS 1.2+ untuk semua koneksi email
* Pertukaran kunci ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) untuk kerahasiaan penerusan yang sempurna
* Rangkaian sandi modern dengan pembaruan keamanan rutin
* Dukungan HTTP/2 untuk peningkatan kinerja dan keamanan
* HSTS (HTTP Strict Transport Security) dengan pra-pemuatan di peramban utama
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** untuk penerapan TLS yang ketat

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementasi MTA-STS**: Forward Email menerapkan penerapan MTA-STS yang ketat dalam basis kode. Ketika terjadi kesalahan TLS dan MTA-STS diterapkan, sistem akan menampilkan 421 kode status SMTP untuk memastikan email dicoba lagi nanti, alih-alih terkirim secara tidak aman. Detail implementasi:

* Deteksi kesalahan TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Penerapan MTA-STS dalam helper kirim-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validasi pihak ketiga: <https://www.hardenize.com/report/forwardemail.net/1750312779> menunjukkan peringkat "Baik" untuk semua TLS dan tindakan keamanan transportasi.

### Apakah Anda menyimpan header autentikasi email {#do-you-preserve-email-authentication-headers}

Ya. Forward Email secara komprehensif menerapkan dan memelihara header autentikasi email:

* **SPF (Sender Policy Framework)**: Diimplementasikan dan dipertahankan dengan baik
* **DKIM (DomainKeys Identified Mail)**: Dukungan penuh dengan manajemen kunci yang tepat
* **DMARC**: Penegakan kebijakan untuk email yang gagal validasi SPF atau DKIM
* **ARC**: Meskipun tidak dijelaskan secara rinci, skor kepatuhan layanan yang sempurna menunjukkan penanganan header autentikasi yang komprehensif

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validasi: Tes Email Internet.nl menunjukkan skor 100/100, khususnya untuk implementasi "SPF, DKIM, dan DMARC". Penilaian Hardenize mengonfirmasi peringkat "Baik" untuk SPF dan DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Apakah Anda mempertahankan header email asli dan mencegah spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Forward Email mempertahankan header email asli sambil menerapkan perlindungan anti-spoofing yang komprehensif melalui basis kode MX:

* **Pelestarian Header**: Header autentikasi asli dipertahankan selama penerusan
* **Anti-Spoofing**: Penegakan kebijakan DMARC mencegah spoofing header dengan menolak email yang gagal validasi SPF atau DKIM
* **Pencegahan Injeksi Header**: Validasi dan sanitasi input menggunakan pustaka striptags
* **Perlindungan Lanjutan**: Deteksi phishing canggih dengan deteksi spoofing, pencegahan peniruan identitas, dan sistem notifikasi pengguna

**Detail Implementasi MX**: Logika pemrosesan email inti ditangani oleh basis kode server MX, khususnya:

* Penanganan data MX utama: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Pemfilteran email sewenang-wenang (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Pembantu `isArbitrary` menerapkan aturan anti-spoofing yang canggih termasuk deteksi peniruan domain, frasa yang diblokir, dan berbagai pola phishing.

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Bagaimana Anda melindungi diri dari spam dan penyalahgunaan {#how-do-you-protect-against-spam-and-abuse}

Forward Email menerapkan perlindungan multi-lapis yang komprehensif:

* **Pembatasan Kecepatan**: Diterapkan pada upaya autentikasi, titik akhir API, dan koneksi SMTP
* **Isolasi Sumber Daya**: Antar pengguna untuk mencegah dampak dari pengguna bervolume tinggi
* **Perlindungan DDoS**: Perlindungan berlapis melalui sistem Shield DataPacket dan Cloudflare
* **Penskalaan Otomatis**: Penyesuaian sumber daya dinamis berdasarkan permintaan
* **Pencegahan Penyalahgunaan**: Pemeriksaan pencegahan penyalahgunaan khusus pengguna dan pemblokiran berbasis hash untuk konten berbahaya
* **Autentikasi Email**: Protokol SPF, DKIM, DMARC dengan deteksi phishing tingkat lanjut

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detail perlindungan DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Apakah Anda menyimpan konten email di disk {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Arsitektur Tanpa Pengetahuan**: Kotak surat SQLite yang dienkripsi secara individual berarti Forward Email tidak dapat mengakses konten email.
* **Pemrosesan Dalam Memori**: Pemrosesan email sepenuhnya terjadi di memori, sehingga menghindari penyimpanan disk.
* **Tanpa Pencatatan Konten**: "Kami tidak mencatat atau menyimpan konten email atau metadata ke disk."
* **Enkripsi Sandbox**: Kunci enkripsi tidak pernah disimpan di disk dalam bentuk teks biasa.

**Bukti Basis Kode MX**: Server MX memproses email sepenuhnya di dalam memori tanpa menulis konten ke disk. Handler pemrosesan email utama mendemonstrasikan pendekatan dalam memori ini: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstrak)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detail tanpa pengetahuan)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Enkripsi sandbox)

### Bisakah konten email terekspos saat sistem crash? {#can-email-content-be-exposed-during-system-crashes}

Tidak. Forward Email menerapkan perlindungan komprehensif terhadap paparan data terkait kerusakan:

**Core Dumps Dinonaktifkan**: Mencegah pemaparan memori saat terjadi crash
* **Swap Memory Dinonaktifkan**: Dinonaktifkan sepenuhnya untuk mencegah ekstraksi data sensitif dari file swap
* **Arsitektur Dalam Memori**: Konten email hanya ada di memori volatil selama pemrosesan
* **Perlindungan Kunci Enkripsi**: Kunci tidak pernah disimpan di disk dalam bentuk teks biasa
* **Keamanan Fisik**: Disk terenkripsi LUKS v2 mencegah akses fisik ke data
* **Penyimpanan USB Dinonaktifkan**: Mencegah ekstraksi data tanpa izin

**Penanganan Kesalahan untuk Masalah Sistem**: Penerusan Email menggunakan fungsi pembantu `isCodeBug` dan `isTimeoutError` untuk memastikan bahwa jika terjadi masalah konektivitas basis data, masalah jaringan DNS/daftar blokir, atau masalah konektivitas hulu, sistem akan mengembalikan 421 kode status SMTP untuk memastikan email akan dicoba lagi nanti daripada hilang atau terekspos.

Detail implementasi:

* Klasifikasi kesalahan: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Penanganan kesalahan batas waktu dalam pemrosesan MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sumber: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Siapa yang memiliki akses ke infrastruktur email Anda {#who-has-access-to-your-email-infrastructure}

Forward Email menerapkan kontrol akses komprehensif untuk akses tim teknik minimal 2-3 orang dengan persyaratan 2FA yang ketat:

* **Kontrol Akses Berbasis Peran**: Untuk akun tim dengan izin berbasis sumber daya
* **Prinsip Hak Istimewa Terkecil**: Diterapkan di seluruh sistem
* **Pemisahan Tugas**: Antar peran operasional
* **Manajemen Pengguna**: Pisahkan pengguna deploy dan devops dengan izin berbeda
* **Login Root Dinonaktifkan**: Memaksa akses melalui akun yang diautentikasi dengan benar
* **2FA Ketat**: Tidak ada 2FA berbasis SMS karena risiko serangan MiTM - hanya token berbasis aplikasi atau perangkat keras
* **Pencatatan Audit Komprehensif**: Dengan penyuntingan data sensitif
* **Deteksi Anomali Otomatis**: Untuk pola akses yang tidak biasa
* **Tinjauan Keamanan Berkala**: Dari log akses
* **Pencegahan Serangan Evil Maid**: Penyimpanan USB dinonaktifkan dan tindakan keamanan fisik lainnya

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Kontrol Otorisasi)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Keamanan Jaringan)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Pencegahan Serangan Maid Jahat)

### Penyedia infrastruktur apa yang Anda gunakan {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Rincian lengkap tersedia di halaman kepatuhan GDPR kami: <https://forwardemail.net/gdpr>

**Subprosesor Infrastruktur Utama:**

| Penyedia | Kerangka Privasi Data Bersertifikat | Halaman Kepatuhan GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ya | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Paket Data** | ❌ Tidak | <https://www.datapacket.com/kebijakan-privasi> |
| **Samudra Digital** | ❌ Tidak | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Tidak | <https://www.vultr.com/legal/eea-gdpr-privasi/> |

**Sertifikasi Terperinci:**

**Samudra Digital**

* SOC 2 Tipe II & SOC 3 Tipe II (diaudit oleh Schellman & Company LLC)
* Tersertifikasi ISO 27001 di beberapa pusat data
* Sesuai PCI-DSS
* Tersertifikasi CSA STAR Level 1
* Tersertifikasi APEC CBPR PRP
* Detail: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Bersertifikat SOC 2+ (HIPAA)
* Sesuai dengan PCI Merchant
* Bersertifikat CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detail: <https://www.vultr.com/legal/compliance/>

**Paket Data**

* Sesuai SOC 2 (hubungi DataPacket langsung untuk mendapatkan sertifikasi)
* Infrastruktur kelas perusahaan (lokasi Denver)
* Perlindungan DDoS melalui tumpukan keamanan siber Shield
* Dukungan teknis 24/7
* Jaringan global di 58 pusat data
* Detail: <https://www.datapacket.com/datacenters/denver>

**Pemroses Pembayaran:**

* **Stripe**: Tersertifikasi Kerangka Kerja Privasi Data - <https://stripe.com/legal/privacy-center>
* **PayPal**: Tidak tersertifikasi DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Apakah Anda menawarkan Perjanjian Pemrosesan Data (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ya, Forward Email menawarkan Perjanjian Pemrosesan Data (DPA) komprehensif yang dapat ditandatangani bersama perjanjian perusahaan kami. Salinan DPA kami tersedia di: <https://forwardemail.net/dpa>

**Rincian DPA:**

* Mencakup kepatuhan GDPR dan kerangka kerja Perisai Privasi UE-AS/Swiss-AS
* Diterima secara otomatis saat menyetujui Persyaratan Layanan kami
* Tidak diperlukan tanda tangan terpisah untuk DPA standar
* Pengaturan DPA khusus tersedia melalui Lisensi Perusahaan

**Kerangka Kerja Kepatuhan GDPR:**
DPA kami merinci kepatuhan terhadap GDPR serta persyaratan transfer data internasional. Informasi lengkap tersedia di: <https://forwardemail.net/gdpr>

Untuk pelanggan perusahaan yang memerlukan ketentuan DPA khusus atau pengaturan kontraktual tertentu, hal ini dapat diatasi melalui program **Lisensi Perusahaan ($250/bulan)** kami.

### Bagaimana Anda menangani notifikasi pelanggaran data {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Paparan Data Terbatas**: Tidak dapat mengakses konten email terenkripsi karena arsitektur zero-knowledge
* **Pengumpulan Data Minimal**: Hanya informasi pelanggan dasar dan log IP terbatas untuk keamanan
* **Kerangka Kerja Subprosesor**: DigitalOcean dan Vultr menerapkan prosedur respons insiden yang sesuai dengan GDPR

**Informasi Perwakilan GDPR:**
Forward Email telah menunjuk perwakilan GDPR sesuai dengan Pasal 27:

**Perwakilan Uni Eropa:**
Osano International Compliance Services Limited
UP: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Perwakilan Inggris:**
Osano UK Compliance LTD
UP: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Untuk pelanggan perusahaan yang memerlukan SLA pemberitahuan pelanggaran tertentu, hal ini harus didiskusikan sebagai bagian dari perjanjian **Lisensi Perusahaan**.

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Apakah Anda menawarkan lingkungan pengujian {#do-you-offer-a-test-environment}

Dokumentasi teknis Forward Email tidak secara eksplisit menjelaskan mode sandbox khusus. Namun, pendekatan pengujian yang potensial meliputi:

**Opsi Hosting Mandiri**: Kemampuan hosting mandiri yang komprehensif untuk menciptakan lingkungan pengujian
* **Antarmuka API**: Potensi untuk pengujian konfigurasi secara terprogram
* **Sumber Terbuka**: Kode sumber terbuka 100% memungkinkan pelanggan untuk memeriksa logika penerusan
* **Beberapa Domain**: Dukungan untuk beberapa domain dapat memungkinkan pembuatan domain pengujian

Untuk pelanggan perusahaan yang memerlukan kemampuan sandbox formal, hal ini harus didiskusikan sebagai bagian dari pengaturan **Lisensi Perusahaan**.

Sumber: <https://github.com/forwardemail/forwardemail.net> (Detail lingkungan pengembangan)

### Apakah Anda menyediakan alat pemantauan dan peringatan {#do-you-provide-monitoring-and-alerting-tools}

Forward Email menyediakan pemantauan waktu nyata dengan beberapa batasan:

**Tersedia:**

* **Pemantauan Pengiriman Real-Time**: Metrik kinerja yang dapat dilihat publik untuk penyedia email utama
* **Pemberitahuan Otomatis**: Tim teknisi akan diberi tahu ketika waktu pengiriman melebihi 10 detik
* **Pemantauan Transparan**: Sistem pemantauan 100% sumber terbuka
* **Pemantauan Infrastruktur**: Deteksi anomali otomatis dan pencatatan audit komprehensif

**Keterbatasan:**

* Webhook yang menghadap pelanggan atau pemberitahuan status pengiriman berbasis API tidak didokumentasikan secara eksplisit

Untuk pelanggan perusahaan yang memerlukan webhook status pengiriman terperinci atau integrasi pemantauan khusus, kemampuan ini mungkin tersedia melalui pengaturan **Lisensi Perusahaan**.

Sumber:

* <https://forwardemail.net> (Tampilan pemantauan waktu nyata)
* <https://github.com/forwardemail/forwardemail.net> (Implementasi pemantauan)

### Bagaimana Anda memastikan ketersediaan tinggi {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Infrastruktur Terdistribusi**: Beberapa penyedia (DigitalOcean, Vultr, DataPacket) di seluruh wilayah geografis
* **Penyeimbangan Beban Geografis**: Penyeimbangan beban berbasis lokasi geografis Cloudflare dengan failover otomatis
* **Penskalaan Otomatis**: Penyesuaian sumber daya dinamis berdasarkan permintaan
* **Perlindungan DDoS Multi-Lapisan**: Melalui sistem Shield DataPacket dan Cloudflare
* **Redundansi Server**: Beberapa server per wilayah dengan failover otomatis
* **Replikasi Basis Data**: Sinkronisasi data real-time di berbagai lokasi
* **Pemantauan dan Pemberitahuan**: Pemantauan 24/7 dengan respons insiden otomatis

**Komitmen Uptime**: Ketersediaan layanan 99,9%+ dengan pemantauan transparan tersedia di <https://forwardemail.net>

Sumber:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Apakah Anda mematuhi Bagian 889 dari Undang-Undang Otorisasi Pertahanan Nasional (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Ya, Forward Email **mematuhi Pasal 889**. Pasal 889 Undang-Undang Otorisasi Pertahanan Nasional (NDAA) melarang instansi pemerintah menggunakan atau berkontrak dengan entitas yang menggunakan peralatan telekomunikasi dan pengawasan video dari perusahaan tertentu (Huawei, ZTE, Hikvision, Dahua, dan Hytera).

**Bagaimana Email Terusan Mencapai Kepatuhan Bagian 889:**

Forward Email bergantung secara eksklusif pada dua penyedia infrastruktur utama, yang mana keduanya tidak menggunakan peralatan yang dilarang oleh Bagian 889:

1. **Cloudflare**: Mitra utama kami untuk layanan jaringan dan keamanan email
2. **DataPacket**: Penyedia utama kami untuk infrastruktur server (hanya menggunakan peralatan Arista Networks dan Cisco)
3. **Penyedia Cadangan**: Penyedia cadangan kami, Digital Ocean dan Vultr, juga telah dikonfirmasi secara tertulis bahwa mereka mematuhi Bagian 889.

**Komitmen Cloudflare**: Cloudflare secara tegas menyatakan dalam Kode Etik Pihak Ketiga mereka bahwa mereka tidak menggunakan peralatan telekomunikasi, produk pengawasan video, atau layanan dari entitas mana pun yang dilarang Bagian 889.

**Kasus Penggunaan Pemerintah**: Kepatuhan Bagian 889 kami divalidasi ketika **Akademi Angkatan Laut AS** memilih Forward Email untuk kebutuhan penerusan email aman mereka, yang memerlukan dokumentasi standar kepatuhan federal kami.

Untuk detail lengkap tentang kerangka kepatuhan pemerintah kami, termasuk peraturan federal yang lebih luas, baca studi kasus komprehensif kami: [Layanan Email Pemerintah Federal Sesuai dengan Bagian 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Detail Sistem dan Teknis {#system-and-technical-details}

### Apakah Anda menyimpan email dan isinya {#do-you-store-emails-and-their-contents}

Tidak, kami tidak menulis ke disk atau menyimpan log – dengan [pengecualian kesalahan](#do-you-store-error-logs) dan [SMTP keluar](#do-you-support-sending-email-with-smtp) (lihat [Kebijakan Privasi](/privacy) kami).

Semuanya dilakukan dalam memori dan [kode sumber kami ada di GitHub](https://github.com/forwardemail).

### Bagaimana cara kerja sistem penerusan email Anda {#how-does-your-email-forwarding-system-work}

Email bergantung pada [Protokol SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Protokol ini terdiri dari perintah-perintah yang dikirim ke server (umumnya berjalan di port 25). Ada koneksi awal, lalu pengirim menunjukkan asal email ("MAIL FROM"), diikuti dengan tujuan ("RCPT TO"), dan terakhir header dan isi email itu sendiri ("DATA"). Alur sistem penerusan email kami dijelaskan relatif terhadap setiap perintah protokol SMTP di bawah ini:

* Koneksi Awal (tanpa nama perintah, misalnya `telnet example.com 25`) - Ini adalah koneksi awal. Kami memeriksa pengirim yang tidak ada dalam [daftar putih](#do-you-have-an-allowlist) kami dengan [daftar penolakan](#do-you-have-a-denylist) kami. Terakhir, jika pengirim tidak ada dalam daftar putih kami, kami akan memeriksa apakah mereka telah [masuk daftar abu-abu](#do-you-have-a-greylist).

* `HELO` - Ini menunjukkan salam untuk mengidentifikasi FQDN, alamat IP, atau nama pengelola email pengirim. Nilai ini dapat dipalsukan, jadi kami tidak mengandalkan data ini dan sebagai gantinya menggunakan pencarian nama host terbalik dari alamat IP koneksi.

* `MAIL FROM` - Ini menunjukkan alamat asal surat dari email. Jika ada nilai yang dimasukkan, alamat tersebut harus merupakan alamat email RFC 5322 yang valid. Nilai kosong diperbolehkan. Kami menggunakan [periksa hamburan balik](#how-do-you-protect-against-backscatter) di sini, dan kami juga memeriksa MAIL FROM dengan [daftar penolakan](#do-you-have-a-denylist) kami. Terakhir, kami memeriksa pengirim yang tidak ada dalam daftar yang diizinkan untuk pembatasan tarif (lihat bagian [Pembatasan Kecepatan](#do-you-have-rate-limiting) dan [daftar putih](#do-you-have-an-allowlist) untuk informasi selengkapnya).

* `RCPT TO` - Ini menunjukkan penerima email. Alamat email ini harus valid sesuai RFC 5322. Kami hanya mengizinkan maksimal 50 penerima amplop per pesan (ini berbeda dengan header "Kepada" pada email). Kami juga memeriksa alamat [Skema Penulisan Ulang Pengirim](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") yang valid di sini untuk melindungi dari spoofing dengan nama domain SRS kami.

* `DATA` - Ini adalah bagian inti dari layanan kami yang memproses email. Lihat bagian [Bagaimana Anda memproses email untuk diteruskan?](#how-do-you-process-an-email-for-forwarding) di bawah untuk informasi lebih lanjut.

### Bagaimana Anda memproses email untuk diteruskan {#how-do-you-process-an-email-for-forwarding}

Bagian ini menguraikan proses kami yang terkait dengan perintah protokol SMTP `DATA` di bagian [Bagaimana cara kerja sistem penerusan email Anda?](#how-does-your-email-forwarding-system-work) di atas – beginilah cara kami memproses tajuk, isi, keamanan email, menentukan ke mana email perlu dikirimkan, dan cara kami menangani koneksi.

1. Jika pesan melebihi ukuran maksimum 50mb, maka akan ditolak dengan kode kesalahan 552.

2. Jika pesan tidak berisi header "Dari", atau jika salah satu nilai dalam header "Dari" bukan alamat email RFC 5322 yang valid, maka pesan akan ditolak dengan kode kesalahan 550.

3. Jika pesan memiliki lebih dari 25 header "Diterima", maka pesan tersebut dipastikan terjebak dalam loop pengalihan, dan ditolak dengan kode kesalahan 550.

4. Dengan menggunakan sidik jari email (lihat bagian [Sidik jari](#how-do-you-determine-an-email-fingerprint)), kami akan memeriksa apakah pesan tersebut telah dicoba diulang selama lebih dari 5 hari (yang cocok dengan [perilaku postfix default](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), dan jika ya, maka akan ditolak dengan kode kesalahan 550.

5. Kami menyimpan hasil pemindaian email menggunakan [Pemindai Spam](https://spamscanner.net) di memori.

6. Jika terdapat hasil acak dari Spam Scanner, maka Spam Scanner akan ditolak dengan kode kesalahan 554. Hasil acak ini hanya mencakup pengujian GTUBE pada saat penulisan ini. Lihat <https://spamassassin.apache.org/gtube/> untuk informasi lebih lanjut.

7. Kami akan menambahkan header berikut ke pesan untuk tujuan debugging dan pencegahan penyalahgunaan:

* `Received` - kami menambahkan header Received standar ini dengan IP dan host asal, jenis transmisi, informasi koneksi TLS, tanggal/waktu, dan penerima.
* `X-Original-To` - penerima asli pesan:
* Ini berguna untuk menentukan ke mana email awalnya dikirim (selain header "Received").
* Ini ditambahkan per penerima pada saat penerusan IMAP dan/atau tersamar (untuk melindungi privasi).
* `X-Forward-Email-Website` - berisi tautan ke situs web kami <https://forwardemail.net>
* `X-Forward-Email-Version` - versi [SemVer](https://semver.org/) saat ini dari `package.json` basis kode kami.
* `X-Forward-Email-Session-ID` - nilai ID sesi yang digunakan untuk tujuan debug (hanya berlaku di lingkungan non-produksi).
* `X-Forward-Email-Sender` - daftar yang dipisahkan koma berisi alamat MAIL FROM amplop asli (jika tidak kosong), FQDN klien PTR terbalik (jika ada), dan alamat IP pengirim.
* `X-Forward-Email-ID` - ini hanya berlaku untuk SMTP keluar dan berkorelasi dengan ID email yang tersimpan di Akun Saya → Email
* `X-Report-Abuse` - dengan nilai `abuse@forwardemail.net`.
* `X-Report-Abuse-To` - dengan nilai `abuse@forwardemail.net`.
* `X-Complaints-To` - dengan nilai `abuse@forwardemail.net`.

8. Kami kemudian memeriksa pesan untuk [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), dan [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Jika pesan gagal melewati DMARC dan domain memiliki kebijakan penolakan (misalnya `p=reject` [ada dalam kebijakan DMARC](https://wikipedia.org/wiki/DMARC)), maka pesan akan ditolak dengan kode kesalahan 550. Biasanya, kebijakan DMARC untuk domain dapat ditemukan dalam rekaman <strong class="notranslate">TXT</strong> subdomain `_dmarc` (misalnya `dig _dmarc.example.com txt`).
* Jika pesan gagal melewati SPF dan domain memiliki kebijakan gagal keras (misalnya `-all` ada dalam kebijakan SPF, bukan `~all` atau tidak ada kebijakan sama sekali), maka pesan akan ditolak dengan kode kesalahan 550. Biasanya, kebijakan SPF untuk suatu domain dapat ditemukan dalam rekaman <strong class="notranslate">TXT</strong> untuk domain root (misalnya `dig example.com txt`). Lihat bagian ini untuk informasi lebih lanjut tentang [mengirim email seperti dengan Gmail](#can-i-send-mail-as-in-gmail-with-this) terkait SPF.

9. Sekarang, kami memproses penerima pesan yang dikumpulkan dari perintah `RCPT TO` di bagian [Bagaimana cara kerja sistem penerusan email Anda?](#how-does-your-email-forwarding-system-work) di atas. Untuk setiap penerima, kami melakukan operasi berikut:

* Kami mencari data <strong class="notranslate">TXT</strong> dari nama domain (bagian setelah simbol `@`, misalnya `example.com` jika alamat emailnya adalah `test@example.com`). Misalnya, jika domainnya adalah `example.com`, kami melakukan pencarian DNS seperti `dig example.com txt`.
* Kami mengurai semua data <strong class="notranslate">TXT</strong> yang dimulai dengan `forward-email=` (paket gratis) atau `forward-email-site-verification=` (paket berbayar). Perlu diketahui bahwa kami mengurai keduanya untuk memproses email saat pengguna meningkatkan atau menurunkan paket. * Dari rekaman <strong class="notranslate">TXT</strong> yang telah diurai ini, kami mengulanginya untuk mengekstrak konfigurasi penerusan (seperti yang dijelaskan di bagian [Bagaimana cara memulai dan mengatur penerusan email?](#how-do-i-get-started-and-set-up-email-forwarding) di atas). Perhatikan bahwa kami hanya mendukung satu nilai `forward-email-site-verification=`, dan jika lebih dari satu diberikan, maka akan terjadi kesalahan 550 dan pengirim akan menerima pantulan untuk penerima ini.
* Secara rekursif, kami mengulangi konfigurasi penerusan yang telah diekstrak untuk menentukan penerusan global, penerusan berbasis regex, dan semua konfigurasi penerusan lain yang didukung – yang sekarang dikenal sebagai "Alamat Penerusan" kami.
* Untuk setiap Alamat Penerusan, kami mendukung satu pencarian rekursif (yang akan memulai rangkaian operasi ini pada alamat yang diberikan). Jika kecocokan rekursif ditemukan, maka hasil induk akan dihapus dari Alamat Penerusan, dan turunannya akan ditambahkan. * Alamat Penerusan diurai untuk keunikannya (karena kami tidak ingin mengirim duplikat ke satu alamat atau memunculkan koneksi klien SMTP yang tidak perlu).
* Untuk setiap Alamat Penerusan, kami mencari nama domainnya di titik akhir API kami `/v1/max-forwarded-addresses` (untuk menentukan berapa banyak alamat yang diizinkan untuk meneruskan email per alias oleh domain tersebut, misalnya 10 secara default – lihat bagian tentang [batas maksimum penerusan per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Jika batas ini terlampaui, maka akan terjadi kesalahan 550 dan pengirim akan menerima pesan pantulan untuk penerima ini.
* Kami mencari pengaturan penerima asli di titik akhir API kami `/v1/settings`, yang mendukung pencarian untuk pengguna berbayar (dengan fallback untuk pengguna gratis). Ini mengembalikan objek konfigurasi untuk pengaturan lanjutan untuk `port` (Angka, misalnya `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), dan `has_virus_protection` (Boolean).
* Berdasarkan pengaturan ini, kami kemudian memeriksa hasil Pemindai Spam dan jika terjadi kesalahan, maka pesan akan ditolak dengan kode kesalahan 554 (misalnya, jika `has_virus_protection` diaktifkan, maka kami akan memeriksa hasil Pemindai Spam untuk virus). Perlu diketahui bahwa semua pengguna paket gratis akan diikutsertakan dalam pemeriksaan konten dewasa, phishing, file yang dapat dieksekusi, dan virus. Secara default, semua pengguna paket berbayar juga telah diikutsertakan, tetapi konfigurasi ini dapat diubah di halaman Pengaturan untuk domain di dasbor Teruskan Email.

10. Untuk setiap Alamat Penerusan penerima yang diproses, kami kemudian melakukan operasi berikut:

* Alamat tersebut diperiksa berdasarkan [daftar penolakan](#do-you-have-a-denylist) kami, dan jika tercantum, maka kode kesalahan 421 akan muncul (menginstruksikan pengirim untuk mencoba lagi nanti).
* Jika alamat tersebut adalah webhook, maka kami menetapkan nilai Boolean untuk operasi selanjutnya (lihat di bawah – kami mengelompokkan webhook serupa untuk membuat satu permintaan POST vs. beberapa untuk pengiriman).
* Jika alamat tersebut adalah alamat email, maka kami mengurai host untuk operasi selanjutnya (lihat di bawah – kami mengelompokkan host serupa untuk membuat satu koneksi vs. beberapa koneksi individual untuk pengiriman).

11. Jika tidak ada penerima dan tidak ada pantulan, maka kami akan merespons dengan kesalahan 550 "Penerima tidak valid".

12. Jika ada penerima, kami akan mengulanginya (dikelompokkan oleh host yang sama) dan mengirimkan email. Lihat bagian [Bagaimana Anda menangani masalah pengiriman email?](#how-do-you-handle-email-delivery-issues) di bawah untuk informasi lebih lanjut.

* Jika terjadi kesalahan saat mengirim email, kami akan menyimpannya di memori untuk diproses nanti.
* Kami akan mengambil kode kesalahan terendah (jika ada) dari pengiriman email – dan menggunakannya sebagai kode respons untuk perintah `DATA`. Ini berarti email yang tidak terkirim biasanya akan dicoba lagi oleh pengirim asli, namun email yang sudah terkirim tidak akan dikirim ulang saat pesan dikirim berikutnya (karena kami menggunakan [Sidik jari](#how-do-you-determine-an-email-fingerprint)).
* Jika tidak terjadi kesalahan, kami akan mengirimkan kode status respons SMTP 250 yang berhasil.
* Pentalan ditentukan sebagai setiap upaya pengiriman yang menghasilkan kode status >= 500 (kegagalan permanen).

13. Jika tidak terjadi pentalan (kegagalan permanen), maka kami akan mengembalikan kode status respons SMTP dengan kode kesalahan terendah dari kegagalan tidak permanen (atau kode status berhasil 250 jika tidak ada).

14. Jika terjadi pantulan, kami akan mengirimkan email pantulan di latar belakang setelah mengembalikan kode kesalahan terendah kepada pengirim. Namun, jika kode kesalahan terendah >= 500, kami tidak akan mengirimkan email pantulan apa pun. Hal ini karena jika terjadi, pengirim akan menerima email pantulan ganda (misalnya, satu dari MTA keluar mereka, seperti Gmail – dan juga satu dari kami). Lihat bagian [Bagaimana Anda melindungi dari hamburan balik?](#how-do-you-protect-against-backscatter) di bawah untuk informasi lebih lanjut.

### Bagaimana Anda menangani masalah pengiriman email {#how-do-you-handle-email-delivery-issues}

Perhatikan bahwa kami akan melakukan penulisan ulang "Friendly-From" pada email jika dan hanya jika kebijakan DMARC pengirim tidak lolos DAN tidak ada tanda tangan DKIM yang selaras dengan header "From". Ini berarti bahwa kami akan mengubah header "From" pada pesan, menetapkan "X-Original-From", dan juga menetapkan "Reply-To" jika belum ditetapkan. Kami juga akan menyegel ulang segel ARC pada pesan setelah mengubah header ini.

Kami juga menggunakan penguraian cerdas pesan kesalahan di setiap tingkat tumpukan kami – dalam kode kami, permintaan DNS, internal Node.js, permintaan HTTP (misalnya 408, 413, dan 429 dipetakan ke kode respons SMTP 421 jika penerima adalah webhook), dan respons server email (misalnya respons dengan "defer" atau "slowdown" akan dicoba lagi sebagai kesalahan 421).

Logika kami anti-dummy dan akan mencoba lagi untuk kesalahan SSL/TLS, masalah koneksi, dan lainnya. Tujuan dari pembuktian dummy adalah untuk memaksimalkan pengiriman ke semua penerima untuk konfigurasi penerusan.

Jika penerima adalah webhook, kami akan memberikan batas waktu 60 detik agar permintaan selesai dengan maksimal 3 kali percobaan ulang (total 4 permintaan sebelum gagal). Perhatikan bahwa kami mengurai kode kesalahan 408, 413, dan 429 dengan benar dan memetakannya ke kode respons SMTP 421.

Jika penerima adalah alamat email, kami akan mencoba mengirim email dengan TLS oportunistik (kami akan mencoba menggunakan STARTTLS jika tersedia di server email penerima). Jika terjadi kesalahan SSL/TLS saat mencoba mengirim email, kami akan mencoba mengirim email tanpa TLS (tanpa menggunakan STARTTLS).

Jika terjadi kesalahan DNS atau koneksi, maka kami akan kembali ke perintah `DATA` kode respons SMTP 421, sebaliknya jika terjadi kesalahan level >= 500, maka pantulan akan dikirim.

Jika kami mendeteksi bahwa server email yang kami coba kirimi memiliki satu atau beberapa alamat IP pertukaran email yang diblokir (misalnya dengan teknologi apa pun yang mereka gunakan untuk menangguhkan pengirim spam), maka kami akan mengirimkan kode respons SMTP 421 bagi pengirim untuk mencoba lagi pesannya nanti (dan kami akan diberitahu tentang masalah tersebut sehingga kami berharap dapat mengatasinya sebelum percobaan berikutnya).

### Bagaimana cara Anda menangani pemblokiran alamat IP Anda {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Kami secara rutin memantau semua daftar penolakan DNS utama dan jika salah satu alamat IP pertukaran surat ("MX") kami tercantum dalam daftar penolakan utama, kami akan menariknya keluar dari catatan DNS A yang relevan secara bergiliran jika memungkinkan hingga masalah tersebut teratasi.

Saat artikel ini ditulis, kami juga terdaftar di beberapa daftar DNS yang diizinkan, dan kami menganggap serius pemantauan daftar penolakan. Jika Anda melihat masalah sebelum kami sempat menyelesaikannya, harap beri tahu kami secara tertulis di <support@forwardemail.net>.

Alamat IP kami tersedia untuk umum, [lihat bagian di bawah ini untuk wawasan lebih lanjut](#what-are-your-servers-ip-addresses).

### Apa itu alamat postmaster {#what-are-postmaster-addresses}

Untuk mencegah pantulan yang salah arah dan pengiriman pesan balasan liburan ke kotak surat yang tidak terpantau atau tidak ada, kami menyimpan daftar nama pengguna seperti mailer-daemon:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [dan alamat yang tidak ada balasannya](#what-are-no-reply-addresses)

Lihat [RFC 5320 Bagian 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) untuk wawasan lebih lanjut tentang bagaimana daftar seperti ini digunakan untuk membuat sistem email yang efisien.

### Apa itu alamat no-reply {#what-are-no-reply-addresses}

Nama pengguna email yang sama dengan salah satu dari berikut ini (tidak memperhatikan huruf besar/kecil) dianggap sebagai alamat tanpa balasan:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Daftar ini dipelihara [sebagai proyek sumber terbuka di GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Apa alamat IP server Anda {#what-are-your-servers-ip-addresses}

Kami mempublikasikan alamat IP kami di <https://forwardemail.net/ips>.

### Apakah Anda memiliki daftar putih {#do-you-have-an-allowlist}

Ya, kami memiliki [daftar ekstensi nama domain](#what-domain-name-extensions-are-allowlisted-by-default) yang masuk daftar putih secara default dan daftar putih yang dinamis, ter-cache, dan bergulir berdasarkan [kriteria yang ketat](#what-is-your-allowlist-criteria).

Semua email, domain, dan penerima dari pelanggan pada paket berbayar secara otomatis ditambahkan ke daftar putih kami.

### Ekstensi nama domain apa yang diizinkan secara default {#what-domain-name-extensions-are-allowlisted-by-default}

Ekstensi nama domain berikut dianggap masuk daftar putih secara default (terlepas dari apakah ekstensi tersebut ada dalam Daftar Popularitas Umbrella atau tidak):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">arpa</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code class="notranslate">isa.us</code></li>
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us</code></li>
<li class="list-inline-item"><code class="notranslate">al.us</code></li>
<li class="list-inline-item"><code class="notranslate">ar.us</code></li>
<li class="list-inline-item"><code class="notranslate">as.us</code></li>
<li class="list-inline-item"><code class="notranslate">az.us</code></li>
<li class="list-inline-item"><code class="notranslate">ca.us</code></li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><code class="notranslate">nv.us</code></li>
<li class="list-inline-item"><code class="notranslate">ny.us</code></li>
<li class="list-inline-item"><code class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">tx.us</code></li>
<li class="list-inline-item"><code class="notranslate">ut.us</code></li>
<li class="list-inline-item"><code class="notranslate">va.us</code></li>
<li class="list-inline-item"><code class="notranslate">vi.us</code></li>
<li class="list-inline-item"><code class="notranslate">vt.us</code></li>
<li class="list-inline-item"><code class="notranslate">wa.us</code></li>
<li class="list-inline-item"><code class="notranslate">wi.us</code></li>
<li class="list-inline-item"><code class="notranslate">wv.us</code></li>
<li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">school.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">health.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li class="list-inline-item"><code mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="list-inline-item"><code class="notranslate">gov.af</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
<li class="list-inline-item"><code class="notranslate">gov.al</code></li>
<li class="list-inline-item"><code class="notranslate">gov.am</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
<li class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Selain itu, [domain tingkat atas merek dan perusahaan](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) ini masuk daftar putih secara default (misalnya `apple` untuk `applecard.apple` untuk laporan bank Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code class="notranslate">airbus</code></li>
<li class="list-inline-item"><code class="notranslate">airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">alipay</code></li>
<li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li class="list-inline-item"><code class="notranslate">amazon</code></li>
<li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
<li class="list-inline-item"><code class="notranslate">amex</code></li>
<li class="list-inline-item"><code class="notranslate">amica</code></li>
<li class="list-inline-item"><code class="notranslate">android</code></li>
<li class="list-inline-item"><code class="notranslate">anz</code></li>
<li class="list-inline-item"><code class="notranslate">aol</code></li>
<li class="list-inline-item"><code class="notranslate">apple</code></li>
<li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
<li class="list-inline-item"><code class="notranslate">aramco</code></li>
<li class="list-inline-item"><code class="notranslate">audi</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">azure</code></li>
<li class="list-inline-item"><code class="notranslate">baidu</code></li>
<li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
<li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
<li class="list-inline-item"><code class="notranslate">barclays</code></li>
<li class="list-inline-item"><code class="notranslate">basket</code></li>
<li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
<li class="list-inline-item"><code class="notranslate">bbc</code></li>
<li class="list-inline-item"><code class="notranslate">bbt</code></li>
<li class="list-inline-item"><code class="notranslate">bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">bentley</code></li>
<li class="list-inline-item"><code class="notranslate">bharti</code></li>
<li class="list-inline-item"><code class="notranslate">bing</code></li>
<li class="list-inline-item"><code class="notranslate">blanco</code></li>
<li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code class="notranslate">bmw</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">pemesanan</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code Bugatti
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">caravan</code></li>
<li class="list-inline-item"><code class="notranslate">cartier</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code Chrysler
<li class="list-inline-item"><code class="notranslate">Cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">Cisco</code></li>
<li class="list-inline-item"><code class="notranslate">Citadel</code></li>
<li class="list-inline-item"><code class="notranslate">Citi</code></li>
<li class="list-inline-item"><code class="notranslate">Citic</code></li>
<li class="list-inline-item"><code class="notranslate">Clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">Comcast</code></li>
<li class="list-inline-item"><code class="notranslate">Commbank</code></li>
<li class="list-inline-item"><code class="notranslate">creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">crown</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">dealer</code></li>
<li class="list-inline-item"><code class="notranslate">dell</code></li>
<li class="list-inline-item"><code class="notranslate">deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">delta</code></li>
<li class="list-inline-item"><code class="notranslate">dhl</code></li>
<li class="list-inline-item"><code class="notranslate">discover</code></li>
<li class="list-inline-item"><code class="notranslate">dish</code></li>
<li class="list-inline-item"><code class="notranslate">dnp</code></li>
<li class="list-inline-item"><code class="notranslate">dodge</code></li>
<li class="list-inline-item"><code class="notranslate">dunlop</code></li>
<li class="list-inline-item"><code class="notranslate">dupont</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">Eurovision</code></li>
<li class="list-inline-item"><code class="notranslate">Everbank</code></li>
<li class="list-inline-item"><code class="notranslate">Extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">Fage</code></li>
<li class="list-inline-item"><code class="notranslate">Fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">Farmers</code></li>
<li class="list-inline-item"><code class="notranslate">Fedex</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">ferrero</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">fiat</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">fidelity</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">firestone</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">firmdale</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">flickr</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">flir</code></li>
<li kelas="daftar-item-sebaris"><kode kelas="notranslate">flsmidth</code></li>
<li kelas="daftar-item-sebaris"><kode Ford</code></li>
<li class="list-inline-item"><code class="notranslate">fox</code></li>
<li class="list-inline-item"><code class="notranslate">fresenius</code></li>
<li class="list-inline-item"><code class="notranslate">forex</code></li>
<li class="list-inline-item"><code class="notranslate">frogans</code></li>
<li class="list-inline-item"><code class="notranslate">frontier</code></li>
<li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
<li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
<li class="list-inline-item"><code class="notranslate">gallo</code></li>
<li class="list-inline-item"><code class="notranslate">gallup</code></li>
<li class="list-inline-item"><code class="notranslate">gap</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">gea</code></li>
<li class="list-inline-item"><code class="notranslate">genting</code></li>
<li class="list-inline-item"><code class="notranslate">memberi</code></li>
<li class="list-inline-item"><code class="notranslate">gle</code></li>
<li class="list-inline-item"><code class="notranslate">globo</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">Guardian</code></li>
<li class="list-inline-item"><code class="notranslate">Gucci</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">Hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">Hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">Hermes</code></li>
<li class="list-inline-item"><code class="notranslate">Hisamitsu</code></li>
<li class="list-inline-item"><code class="notranslate">Hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">hkt</code></li>
<li class="list-inline-item"><code class="notranslate">honda</code></li>
<li class="list-inline-item"><code class="notranslate">honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">hughes</code></li>
<li class="list-inline-item"><code class="notranslate">hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">ibm</code></li>
<li class="list-inline-item"><code class="notranslate">ieee</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">ikano</code></li>
<li class="list-inline-item"><code class="notranslate">imdb</code></li>
<li class="list-inline-item"><code class="notranslate">infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">intel</code></li>
<li class="list-inline-item"><code class="notranslate">intuit</code></li>
<li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">juniper</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">kia</code></li>
<li class="list-inline-item"><code class="notranslate">kinder</code></li>
<li class="list-inline-item"><code class="notranslate">kindle</code></li>
<li class="list-inline-item"><code class="notranslate">komatsu</code></li>
<li class="list-inline-item"><code class="notranslate">kpmg</code></li>
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">Lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">Lancia</code></li>
<li class="list-inline-item"><code class="notranslate">Lancome</code></li>
<li class="list-inline-item"><code class="notranslate">Lanrover</code></li>
<li class="list-inline-item"><code class="notranslate">Lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">Lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">Latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">LDS</code></li>
<li class="list-inline-item"><code class="notranslate">leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">lego</code></li>
<li class="list-inline-item"><code class="notranslate">liaison</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">gaya hidup</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">locus</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">Macys</code></li>
<li class="list-inline-item"><code class="notranslate">Maif</code></li>
<li class="list-inline-item"><code class="notranslate">Man</code></li>
<li class="list-inline-item"><code class="notranslate">Mango</code></li>
<li class="list-inline-item"><code class="notranslate">Marriott</code></li>
<li class="list-inline-item"><code class="notranslate">Maserati</code></li>
<li class="list-inline-item"><code class="notranslate">Mattel</code></li>
<li class="list-inline-item"><code class="notranslate">Mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">Metlife</code></li>
<li class="list-inline-item"><code class="notranslate">microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
<li class="list-inline-item"><code class="notranslate">mit</code></li>
<li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">mlb</code></li>
<li class="list-inline-item"><code class="notranslate">mma</code></li>
<li class="list-inline-item"><code class="notranslate">monash</code></li>
<li class="list-inline-item"><code class="notranslate">mormon</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">nasional</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">nico</code></li>
<li class="list-inline-item"><code class="notranslate">nike</code></li>
<li class="list-inline-item"><code class="notranslate">nikon</code></li>
<li class="list-inline-item"><code class="notranslate">nissan</code></li>
<li class="list-inline-item"><code class="notranslate">nissay</code></li>
<li class="list-inline-item"><code class="notranslate">nokia</code></li>
<li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
<li class="list-inline-item"><code class="notranslate">norton</code></li>
<li class="list-inline-item"><code class="notranslate">nra</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pioneer</code></li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">PlayStation</code></li>
<li class="list-inline-item"><code class="notranslate">Pohl</code></li>
<li class="list-inline-item"><code class="notranslate">Politie</code></li>
<li class="list-inline-item"><code class="notranslate">Praxi</code></li>
<li class="list-inline-item"><code class="notranslate">Prod</code></li>
<li class="list-inline-item"><code class="notranslate">Progresif</code></li>
<li class="list-inline-item"><code class="notranslate">Pru</code></li>
<li class="list-inline-item"><code class="notranslate">Prudensial</code></li>
<li class="list-inline-item"><code class="notranslate">Pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">pencarian</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">batumerah</code></li>
<li class="list-inline-item"><code class="notranslate">ketergantungan</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">keamanan</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">seat</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">sew</code></li>
<li class="list-inline-item"><code class="notranslate">seven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">cari</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">tajam</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">langit</code></li>
<li class="list-inline-item"><code class="notranslate">skype</code></li>
<li class="list-inline-item"><code class="notranslate">pintar</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">kaca</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">staples</code></li>
<li class="list-inline-item"><code class="notranslate">bintang</code></li>
<li class="list-inline-item"><code class="notranslate">starhub</code></li>
<li class="list-inline-item"><code class="notranslate">statebank</code></li>
<li class="list-inline-item"><code class="notranslate">statefarm</code></li>
<li class="list-inline-item"><code class="notranslate">statoil</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
<li class="list-inline-item"><code class="notranslate">suzuki</code></li>
<li class="list-inline-item"><code class="notranslate">swatch</code></li>
<li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">symantec</code></li>
<li class="list-inline-item"><code class="notranslate">taobao</code></li>
<li class="list-inline-item"><code class="notranslate">target</code></li>
<li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
<li class="list-inline-item"><code class="notranslate">tdk</code></li>
<li class="list-inline-item"><code class="notranslate">telecity</code></li>
<li class="list-inline-item"><code class="notranslate">telefonica</code></li>
<li class="list-inline-item"><code class="notranslate">temasek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">total</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">travelers</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">tvs</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">vanguard</code></li>
<li class="list-inline-item"><code Verisign
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">virgin</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">volvo</code></li>
<li class="list-inline-item"><code class="notranslate">walmart</code></li>
<li class="list-inline-item"><code class="notranslate">walter</code></li>
<li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">weir</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">windows</code></li>
<li class="list-inline-item"><code class="notranslate">wme</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">woodside</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">xerox</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

Sampai tanggal 18 Maret 2025, kami juga telah menambahkan wilayah seberang laut Prancis ini ke daftar ini ([sesuai permintaan GitHub ini](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li class="daftar-item-sebaris"><code class="notranslate">tf</code></li>
<li class="daftar-item-sebaris"><code class="notranslate">wf</code></li>
<li class="daftar-item-sebaris"><code class="notranslate">yt</code></li>
</ul>

Per 8 Juli 2025, kami telah menambahkan negara-negara khusus Eropa berikut:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Kami secara khusus tidak menyertakan `cz`, `ru`, dan `ua` karena aktivitas spam yang tinggi.

### Apa kriteria daftar putih Anda {#what-is-your-allowlist-criteria}

Kami memiliki daftar statis [ekstensi nama domain yang diizinkan secara default](#what-domain-name-extensions-are-allowlisted-by-default) – dan kami juga mempertahankan daftar putih dinamis, ter-cache, dan bergulir berdasarkan kriteria ketat berikut:

* Domain root pengirim harus bertipe [ekstensi nama domain yang sesuai dengan daftar yang kami tawarkan pada paket gratis kami](#what-domain-name-extensions-can-be-used-for-free) (dengan tambahan `biz` dan `info`). Kami juga menyertakan kecocokan parsial `edu`, `gov`, dan `mil`, seperti `xyz.gov.au` dan `xyz.edu.au`.
* Domain root pengirim harus berada dalam 100.000 hasil parsing domain root unik teratas dari [Daftar Popularitas Payung](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Domain root pengirim harus berada dalam 50.000 hasil teratas dari domain root unik yang muncul setidaknya dalam 4 dari 7 hari terakhir UPL (~50%+).
* Domain root pengirim tidak boleh [dikategorikan](https://radar.cloudflare.com/categorization-feedback/) sebagai konten dewasa atau malware oleh Cloudflare.
* Domain root pengirim harus memiliki rekaman A atau MX yang ditetapkan.
* Domain root pengirim harus memiliki rekaman A, rekaman MX, rekaman DMARC dengan `p=reject` atau `p=quarantine`, atau rekaman SPF dengan kualifikasi `-all` atau `~all`.

Jika kriteria ini terpenuhi, domain root pengirim akan di-cache selama 7 hari. Harap dicatat bahwa pekerjaan otomatis kami berjalan setiap hari – oleh karena itu, ini adalah cache daftar putih bergulir yang diperbarui setiap hari.

Pekerjaan otomatis kami akan mengunduh UPL 7 hari sebelumnya dalam memori, mengekstraknya, lalu mengurainya dalam memori sesuai dengan kriteria ketat di atas.

Domain yang populer saat artikel ini ditulis seperti Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, dan lainnya – tentu saja disertakan.

Jika Anda bukan pengirim dalam daftar putih kami, saat pertama kali domain root FQDN atau alamat IP Anda mengirim email, Anda akan [tarif terbatas](#do-you-have-rate-limiting) dan [masuk daftar abu-abu](#do-you-have-a-greylist). Harap dicatat bahwa ini adalah praktik standar yang diadopsi sebagai standar email. Sebagian besar klien server email akan mencoba lagi jika menerima batas kecepatan atau kesalahan daftar abu-abu (misalnya, kode status kesalahan level 421 atau 4xx).

**Perhatikan bahwa pengirim tertentu seperti `a@gmail.com`, `b@xyz.edu`, dan `c@gov.au` masih dapat menjadi [ditolak](#do-you-have-a-denylist)** (misalnya jika kami secara otomatis mendeteksi spam, phishing, atau malware dari pengirim tersebut).

### Ekstensi nama domain apa yang bisa digunakan secara gratis {#what-domain-name-extensions-can-be-used-for-free}

Mulai 31 Maret 2023, kami memberlakukan aturan spam menyeluruh baru untuk melindungi pengguna dan layanan kami.

Aturan baru ini hanya mengizinkan ekstensi nama domain berikut untuk digunakan pada paket gratis kami:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">iklan</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">aplikasi</code></li>
<li class="list-inline-item"><code class="notranslate">sebagai</code></li>
<li class="list-inline-item"><code class="notranslate">sebagai</code></li>
<li class="list-inline-item"><code class="notranslate">di</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">oleh</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="list-inline-item"><code class="notranslate">ck</code></li>
<li class="list-inline-item"><code class="notranslate">co</code></li>
<li class="list-inline-item"><code class="notranslate">com</code></li>
<li class="list-inline-item"><code class="notranslate">de</code></li>
<li class="list-inline-item"><code class="notranslate">dev</code></li>
<li class="list-inline-item"><code class="notranslate">dj</code></li>
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">family</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">tidak</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Apakah Anda memiliki daftar abu-abu {#do-you-have-a-greylist}

Ya, kami menerapkan kebijakan [daftar abu-abu email](https://en.wikipedia.org/wiki/Greylisting_\(email\)) yang sangat longgar. Daftar abu-abu hanya berlaku untuk pengirim yang tidak ada dalam daftar putih kami dan akan tersimpan dalam cache kami selama 30 hari.

Untuk setiap pengirim baru, kami menyimpan kunci di basis data Redis kami selama 30 hari dengan nilai yang ditetapkan sesuai waktu kedatangan awal permintaan pertama mereka. Kemudian, kami menolak email mereka dengan kode status coba ulang 450 dan hanya mengizinkannya lewat setelah 5 menit berlalu.

Jika mereka berhasil menunggu selama 5 menit dari waktu kedatangan awal ini, maka email mereka akan diterima dan mereka tidak akan menerima kode status 450 ini.

Kuncinya terdiri dari domain root FQDN atau alamat IP pengirim. Ini berarti bahwa setiap subdomain yang lolos daftar abu-abu juga akan lolos sebagai domain root, dan sebaliknya (inilah yang kami maksud dengan kebijakan "sangat longgar").

Misalnya, jika sebuah email datang dari `test.example.com` sebelum kami melihat email datang dari `example.com`, maka email apa pun dari `test.example.com` dan/atau `example.com` harus menunggu 5 menit dari waktu kedatangan awal koneksi. Kami tidak membuat `test.example.com` dan `example.com` masing-masing menunggu selama 5 menit (kebijakan daftar abu-abu kami berlaku di tingkat domain root).

Perhatikan bahwa daftar abu-abu tidak berlaku untuk pengirim mana pun di [daftar putih](#do-you-have-an-allowlist) kami (misalnya Meta, Amazon, Netflix, Google, Microsoft pada saat penulisan ini).

### Apakah Anda memiliki daftar penolakan {#do-you-have-a-denylist}

Ya, kami mengoperasikan daftar penolakan kami sendiri dan memperbaruinya secara otomatis dalam waktu nyata dan manual berdasarkan spam dan aktivitas berbahaya yang terdeteksi.

Kami juga menarik semua alamat IP dari daftar tolak UCEPROTECT Level 1 di <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> setiap jam dan memasukkannya ke dalam daftar tolak kami dengan masa berlaku 7 hari.

Pengirim yang ditemukan dalam daftar tolak akan menerima kode kesalahan 421 (menunjukkan kepada pengirim untuk mencoba lagi nanti) jika mereka [tidak masuk daftar yang diizinkan](#do-you-have-an-allowlist).

Dengan menggunakan kode status 421 dan bukan kode status 554, potensi positif palsu dapat dikurangi secara real-time dan kemudian pesan dapat berhasil disampaikan pada percobaan berikutnya.

**Layanan ini dirancang berbeda dari layanan email lainnya**, yang mana jika Anda dimasukkan ke dalam daftar blokir, akan terjadi kegagalan permanen yang parah. Seringkali sulit meminta pengirim untuk mencoba lagi pesan (terutama dari organisasi besar), sehingga pendekatan ini memberikan waktu sekitar 5 hari sejak percobaan email pertama bagi pengirim, penerima, atau kami untuk turun tangan dan mengatasi masalah (dengan meminta penghapusan daftar blokir).

Semua permintaan penghapusan daftar tolak dipantau secara real-time oleh admin (misalnya agar positif palsu yang berulang dapat dimasukkan ke daftar putih secara permanen oleh admin).

Permintaan penghapusan daftar penolakan dapat diajukan di <https://forwardemail.net/denylist>.. Pengguna berbayar akan langsung memproses permintaan penghapusan daftar penolakan mereka, sementara pengguna tidak berbayar harus menunggu admin memproses permintaan mereka.

Pengirim yang terdeteksi mengirim konten spam atau virus akan ditambahkan ke daftar tolak dengan pendekatan berikut:

1. [sidik jari pesan awal](#how-do-you-determine-an-email-fingerprint) masuk daftar abu-abu setelah terdeteksi spam atau daftar blokir dari pengirim "tepercaya" (misalnya `gmail.com`, `microsoft.com`, `apple.com`).
* Jika pengirim masuk daftar putih, pesan masuk daftar abu-abu selama 1 jam.
* Jika pengirim tidak masuk daftar putih, pesan masuk daftar abu-abu selama 6 jam.
2. Kami mengurai kunci daftar putih dari informasi pengirim dan pesan, dan untuk setiap kunci ini kami membuat (jika belum ada) penghitung, menambahkannya 1, dan menyimpannya dalam cache selama 24 jam.
* Untuk pengirim yang diizinkan:
* Tambahkan kunci untuk alamat email amplop "MAIL FROM" jika memiliki SPF yang lulus atau tanpa SPF, dan bukan [nama pengguna kepala kantor pos](#what-are-postmaster-addresses) atau [nama pengguna tanpa balasan](#what-are-no-reply-addresses).
* Jika header "From" diizinkan, tambahkan kunci untuk alamat email header "From" jika memiliki SPF yang lulus atau DKIM yang lulus dan selaras.
* Jika header "From" tidak diizinkan, tambahkan kunci untuk alamat email header "From" dan nama domain root-nya yang telah diurai.
* Untuk pengirim yang tidak diizinkan:
* Tambahkan kunci untuk alamat email amplop "MAIL FROM" jika memiliki SPF yang lulus.
* Jika header "From" diizinkan, tambahkan kunci untuk alamat email header "From" jika memiliki SPF yang lulus atau DKIM yang lulus dan selaras.
* Jika header "Dari" tidak diizinkan, tambahkan kunci untuk alamat email header "Dari" dan nama domain root yang diurai.
* Tambahkan kunci untuk alamat IP jarak jauh pengirim.
* Tambahkan kunci untuk nama host klien yang telah diselesaikan dengan pencarian terbalik dari alamat IP pengirim (jika ada).
* Tambahkan kunci untuk domain root dari nama host klien yang telah diselesaikan (jika ada, dan jika berbeda dengan nama host klien yang telah diselesaikan).
3. Jika angka penghitung mencapai 5 untuk pengirim dan kunci yang tidak diizinkan, maka kami akan memasukkan kunci ke dalam daftar penolakan selama 30 hari dan email akan dikirimkan ke tim penyalahgunaan kami. Angka-angka ini dapat berubah dan pembaruan akan ditampilkan di sini saat kami memantau penyalahgunaan.
4. Jika angka penghitung mencapai 10 untuk pengirim dan kunci yang diizinkan, maka kami akan memasukkan kunci ke dalam daftar penolakan selama 7 hari dan email akan dikirimkan ke tim penyalahgunaan kami. Angka-angka ini dapat berubah dan pembaruan akan ditampilkan di sini saat kami memantau penyalahgunaan.

**CATATAN:** Dalam waktu dekat, kami akan memperkenalkan pemantauan reputasi. Pemantauan reputasi akan menghitung kapan harus memasukkan pengirim ke daftar penolakan berdasarkan ambang batas persentase (bukan penghitung dasar seperti yang disebutkan di atas).

### Apakah Anda memiliki pembatasan kecepatan {#do-you-have-rate-limiting}

Pembatasan laju pengirim dilakukan melalui domain root yang diurai dari pencarian PTR terbalik pada alamat IP pengirim – atau jika tidak menghasilkan hasil, maka hanya menggunakan alamat IP pengirim. Perhatikan bahwa kami menyebutnya sebagai `Sender` di bawah ini.

Server MX kami memiliki batasan harian untuk surat masuk yang diterima untuk [penyimpanan IMAP terenkripsi](/blog/docs/best-quantum-safe-encrypted-email-service):

* Alih-alih membatasi jumlah email masuk yang diterima berdasarkan alias individual (misalnya `you@yourdomain.com`) – kami membatasi jumlah email masuk berdasarkan nama domain alias itu sendiri (misalnya `yourdomain.com`). Hal ini mencegah `Senders` membanjiri kotak masuk semua alias di seluruh domain Anda sekaligus. * Kami memiliki batasan umum yang berlaku untuk semua `Senders` di seluruh layanan kami, terlepas dari penerimanya:
* `Senders` yang kami anggap "tepercaya" sebagai sumber kebenaran (misalnya `gmail.com`, `microsoft.com`, `apple.com`) dibatasi pengirimannya hingga 100 GB per hari.
* `Senders` yang merupakan [masuk daftar putih](#do-you-have-an-allowlist) dibatasi pengirimannya hingga 10 GB per hari.
* Semua `Senders` lainnya dibatasi pengirimannya hingga 1 GB dan/atau 1000 pesan per hari.
* Kami memiliki batasan khusus per `Sender` dan `yourdomain.com` sebesar 1 GB dan/atau 1000 pesan setiap hari.

Server MX juga membatasi pesan yang diteruskan ke satu atau lebih penerima melalui pembatasan kecepatan – tetapi ini hanya berlaku untuk `Senders` bukan pada [daftar putih](#do-you-have-an-allowlist):

* Kami hanya mengizinkan hingga 100 koneksi per jam, per domain root FQDN `Sender` yang telah diselesaikan (atau) alamat IP jarak jauh `Sender` (jika tidak ada PTR terbalik yang tersedia), dan per penerima amplop. Kami menyimpan kunci untuk pembatasan laju sebagai hash kriptografi di basis data Redis kami.

* Jika Anda mengirim email melalui sistem kami, pastikan Anda telah menyiapkan PTR terbalik untuk semua alamat IP Anda (jika tidak, setiap domain root FQDN atau alamat IP unik yang Anda kirim akan dibatasi kecepatannya).

* Perlu diketahui bahwa jika Anda mengirim melalui sistem populer seperti Amazon SES, maka Anda tidak akan dibatasi karena (pada saat penulisan ini) Amazon SES tercantum dalam daftar putih kami.

* Jika Anda mengirim dari domain seperti `test.abc.123.example.com`, maka batas kecepatan akan diberlakukan pada `example.com`. Banyak pengirim spam menggunakan ratusan subdomain untuk mengakali filter spam umum yang hanya membatasi nama host unik, bukan domain root FQDN unik.

* `Senders` yang melampaui batas kecepatan akan ditolak dengan kesalahan 421.

Server IMAP dan SMTP kami membatasi alias Anda agar tidak memiliki lebih dari `60` koneksi bersamaan sekaligus.

Server MX kami membatasi pengirim [tidak masuk daftar yang diizinkan](#do-you-have-an-allowlist) dari membuat lebih dari 10 koneksi bersamaan (dengan waktu kedaluwarsa cache 3 menit untuk penghitung, yang mencerminkan batas waktu soket kami selama 3 menit).

### Bagaimana Anda melindungi dari backscatter {#how-do-you-protect-against-backscatter}

Pantulan yang salah arah atau spam pantulan (dikenal sebagai "[Hamburan balik](https://en.wikipedia.org/wiki/Backscatter_\(email\))") dapat menyebabkan reputasi negatif pada alamat IP pengirim.

Kami mengambil dua langkah untuk melindungi terhadap backscatter, yang dirinci dalam bagian berikut [Cegah pantulan dari pengirim MAIL FROM yang diketahui](#prevent-bounces-from-known-mail-from-spammers) dan [Cegah pantulan yang tidak perlu untuk melindungi dari hamburan balik](#prevent-unnecessary-bounces-to-protect-against-backscatter) di bawah.

### Mencegah pantulan dari EMAIL yang diketahui DARI spammer {#prevent-bounces-from-known-mail-from-spammers}

Kami menarik daftar dari [Backscatter.org](https://www.backscatterer.org/) (didukung oleh [UCEPROTECT](https://www.uceprotect.net/)) pada <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> setiap jam dan memasukkannya ke dalam basis data Redis kami (kami juga membandingkan perbedaannya terlebih dahulu; apabila ada IP yang dihapus yang perlu dihormati).

Jika MAIL FROM kosong ATAU sama dengan (tanpa memperhatikan huruf besar/kecil) salah satu dari [alamat kepala kantor pos](#what-are-postmaster-addresses) (bagian sebelum @ dalam email), maka kami memeriksa untuk melihat apakah IP pengirim cocok dengan salah satu dari daftar ini.

Jika IP pengirim tercantum (dan tidak ada dalam [daftar putih](#do-you-have-an-allowlist) kami), maka kami akan mengirimkan pesan kesalahan 554 dengan pesan `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Kami akan diberi tahu jika pengirim ada dalam daftar Backscatterer dan daftar putih kami sehingga kami dapat menyelesaikan masalah tersebut jika diperlukan.

Teknik yang dijelaskan di bagian ini mematuhi rekomendasi "SAFE MODE" di <https://www.backscatterer.org/?target=usage> – di mana kami hanya memeriksa IP pengirim jika kondisi tertentu telah terpenuhi.

### Cegah pantulan yang tidak perlu untuk melindungi dari hamburan balik {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Pentalan adalah email yang menunjukkan penerusan email gagal sepenuhnya kepada penerima dan email tidak akan dicoba lagi.

Salah satu alasan umum mengapa situs Anda masuk dalam daftar Backscatterer adalah pantulan yang salah arah atau spam pantulan, jadi kita harus melindungi diri dari hal ini dengan beberapa cara:

1. Kami hanya mengirim bila terjadi kesalahan kode status >= 500 (bila email yang dicoba diteruskan gagal, misalnya Gmail merespons dengan kesalahan level 500).

2. Kami hanya mengirim sekali dan sekali saja (kami menggunakan kunci sidik jari pantulan yang telah dihitung dan menyimpannya dalam cache untuk mencegah pengiriman duplikat). Sidik jari pantulan adalah kunci yang merupakan gabungan sidik jari pesan dengan hash alamat pantulan dan kode kesalahannya. Lihat bagian [Sidik jari](#how-do-you-determine-an-email-fingerprint) untuk informasi lebih lanjut tentang cara penghitungan sidik jari pesan. Sidik jari pantulan yang berhasil dikirim akan kedaluwarsa setelah 7 hari di cache Redis kami.

3. Kami hanya mengirim apabila MAIL FROM dan/atau From tidak kosong dan tidak mengandung (tanpa memperhatikan huruf besar/kecil) [nama pengguna kepala kantor pos](#what-are-postmaster-addresses) (bagian sebelum @ dalam email).

4. Kami tidak mengirim jika pesan asli memiliki salah satu tajuk berikut (tidak peka huruf besar-kecil):

* Header `auto-submitted` dengan nilai yang tidak sama dengan `no`. * Header dari `x-auto-response-suppress` dengan nilai `dr`, `autoreply`, `auto-reply`, `auto_reply`, atau `all`
* Header dari `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, atau `x-auto-respond` (tanpa memandang nilai).
* Header dari `precedence` dengan nilai `bulk`, `autoreply`, `auto-reply`, `auto_reply`, atau `list`.

5. Kami tidak mengirim jika alamat email MAIL FROM atau From diakhiri dengan `+donotreply`, `-donotreply`, `+noreply`, atau `-noreply`.

6. Kami tidak mengirim jika bagian nama pengguna alamat email Dari adalah `mdaemon` dan memiliki header yang tidak peka huruf besar/kecil `X-MDDSN-Message`.

7. Kami tidak mengirim jika ada header `content-type` yang tidak peka huruf besar/kecil dari `multipart/report`.

### Bagaimana cara menentukan sidik jari email {#how-do-you-determine-an-email-fingerprint}

Sidik jari email digunakan untuk menentukan keunikan email dan untuk mencegah pesan duplikat terkirim dan [pantulan duplikat](#prevent-unnecessary-bounces-to-protect-against-backscatter) terkirim.

Sidik jari dihitung dari daftar berikut:

* Nama host atau alamat IP FQDN yang telah diselesaikan klien
* Nilai header `Message-ID` (jika ada)
* Nilai header `Date` (jika ada)
* Nilai header `From` (jika ada)
* Nilai header `To` (jika ada)
* Nilai header `Cc` (jika ada)
* Nilai header `Subject` (jika ada)
* Nilai header `Body` (jika ada)

### Dapatkah saya meneruskan email ke port selain 25 (misalnya jika ISP saya memblokir port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ya, kami telah menambahkan fitur ini per 5 Mei 2020. Saat ini, fitur ini bersifat khusus domain, bukan khusus alias. Jika Anda menginginkannya khusus alias, silakan hubungi kami untuk memberi tahu kebutuhan Anda.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Perlindungan Privasi yang Ditingkatkan:
</strong>
<span>
Jika Anda menggunakan paket berbayar (yang dilengkapi perlindungan privasi yang ditingkatkan), silakan buka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a>, klik "Pengaturan" di samping domain Anda, lalu klik "Pengaturan". Jika Anda ingin mempelajari lebih lanjut tentang paket berbayar, silakan lihat halaman <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Harga</a> kami. Jika tidak, Anda dapat terus mengikuti petunjuk di bawah ini.
</span>
</div>

Jika Anda menggunakan paket gratis, cukup tambahkan rekaman DNS <strong class="notranslate">TXT</strong> baru seperti yang ditunjukkan di bawah ini, tetapi ubah port dari 25 ke port pilihan Anda.

Misalnya, jika saya ingin semua email yang masuk ke `example.com` diteruskan ke port SMTP penerima alias 1337, bukan 25:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
Skenario paling umum untuk pengaturan penerusan porta khusus adalah ketika Anda ingin meneruskan semua email yang masuk ke example.com ke porta lain di example.com, selain porta standar SMTP 25. Untuk mengaturnya, cukup tambahkan record catch-all <strong class="notranslate">TXT</strong> berikut.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Apakah mendukung simbol plus + untuk alias Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ya, tentu saja.

### Apakah mendukung subdomain {#does-it-support-sub-domains}

Ya, tentu saja. Alih-alih menggunakan "@", ".", atau kosong sebagai nama/host/alias, Anda cukup menggunakan nama subdomain sebagai nilainya.

Jika Anda ingin `foo.example.com` meneruskan email, masukkan `foo` sebagai nilai nama/host/alias dalam pengaturan DNS Anda (untuk rekaman MX dan <strong class="notranslate">TXT</strong>).

### Apakah ini meneruskan header email saya {#does-this-forward-my-emails-headers}

Ya, tentu saja.

### Apakah ini sudah teruji dengan baik {#is-this-well-tested}

Ya, ia memiliki pengujian yang ditulis dengan [tersedia](https://github.com/avajs/ava) dan juga memiliki cakupan kode.

### Apakah Anda meneruskan pesan dan kode respons SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Ya, tentu saja. Misalnya, jika Anda mengirim email ke `hello@example.com` dan terdaftar untuk diteruskan ke `user@gmail.com`, maka pesan respons SMTP dan kode dari server SMTP "gmail.com" akan dikembalikan, bukan dari server proksi di "mx1.forwardemail.net" atau "mx2.forwardemail.net".

### Bagaimana cara mencegah spammer dan memastikan reputasi penerusan email yang baik {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Lihat bagian kami tentang [Bagaimana cara kerja sistem penerusan email Anda?](#how-does-your-email-forwarding-system-work), [Bagaimana Anda menangani masalah pengiriman email?](#how-do-you-handle-email-delivery-issues), dan [Bagaimana Anda menangani alamat IP Anda yang diblokir?](#how-do-you-handle-your-ip-addresses-becoming-blocked) di atas.

### Bagaimana Anda melakukan pencarian DNS pada nama domain {#how-do-you-perform-dns-lookups-on-domain-names}

Kami membuat proyek perangkat lunak sumber terbuka :tangerine: [Jeruk keprok](https://github.com/forwardemail/tangerine) dan menggunakannya untuk pencarian DNS. Server DNS default yang digunakan adalah `1.1.1.1` dan `1.0.0.1`, dan kueri DNS dilakukan melalui [DNS melalui HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") di lapisan aplikasi.

:tangerine: [Jeruk keprok](https://github.com/tangerine) menggunakan [layanan DNS konsumen CloudFlare yang mengutamakan privasi secara default][cloudflare-dns].

## Akun dan Penagihan {#account-and-billing}

### Apakah Anda menawarkan jaminan uang kembali untuk paket berbayar? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ya! Pengembalian dana otomatis berlaku jika Anda meningkatkan, menurunkan, atau membatalkan akun dalam waktu 30 hari sejak paket pertama kali dimulai. Ini hanya berlaku untuk pelanggan baru.

### Jika saya mengganti paket, apakah Anda akan memberikan prorata dan mengembalikan selisihnya {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Kami tidak menghitung prorata atau mengembalikan selisihnya saat Anda mengganti paket. Sebaliknya, kami mengonversi durasi yang tersisa dari tanggal kedaluwarsa paket yang ada ke durasi relatif terdekat untuk paket baru Anda (dibulatkan ke bawah berdasarkan bulan).

Perlu diingat bahwa jika Anda meningkatkan atau menurunkan versi antar paket berbayar dalam kurun waktu 30 hari sejak pertama kali memulai paket berbayar, maka kami akan secara otomatis mengembalikan jumlah penuh dari paket Anda yang sudah ada.

### Bisakah saya menggunakan layanan penerusan email ini sebagai server MX "fallback" atau "fallover" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Tidak, hal ini tidak disarankan, karena Anda hanya dapat menggunakan satu server pertukaran email dalam satu waktu. Fallback biasanya tidak pernah dicoba ulang karena kesalahan konfigurasi prioritas dan server email tidak mematuhi pemeriksaan prioritas pertukaran MX.

### Bisakah saya menonaktifkan alias tertentu {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan paket berbayar, Anda harus membuka <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Akun Saya <i class="fa fa-angle-right"></i> Domain</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Edit Alias <i class="fa fa-angle-right"></i> Hapus centang pada kotak "Aktif" <i class="fa fa-angle-right"></i> Lanjutkan.
</span>
</div>

Ya, cukup edit rekaman DNS <strong class="notranslate">TXT</strong> Anda dan beri awalan alias dengan satu, dua, atau tiga tanda seru (lihat di bawah).

Perlu diingat bahwa Anda *harus* mempertahankan pemetaan ":", karena ini diperlukan jika Anda memutuskan untuk menonaktifkannya (dan ini juga digunakan untuk mengimpor jika Anda meningkatkan ke salah satu paket berbayar kami).

**Untuk penolakan diam-diam (pesan tampak berhasil terkirim bagi pengirim, tetapi sebenarnya tidak menghasilkan apa-apa) (kode status `250`):** Jika Anda menambahkan "!" (tanda seru tunggal) pada alias, maka kode status berhasil `250` akan dikembalikan kepada pengirim yang mencoba mengirim ke alamat ini, tetapi email itu sendiri tidak akan menghasilkan apa-apa (misalnya lubang hitam atau `/dev/null`).

**Untuk penolakan lunak (kode status `421`):** Jika Anda menambahkan awalan "!!" (tanda seru ganda) pada alias, maka kode status kesalahan lunak `421` akan dikembalikan kepada pengirim yang mencoba mengirim ke alamat ini. Email tersebut sering kali akan dicoba lagi hingga 5 hari sebelum ditolak dan terpental.

**Untuk penolakan keras (kode status `550`):** Jika Anda memberi awalan "!!!" (tanda seru tiga kali) pada alias, maka kode status kesalahan permanen `550` akan dikembalikan kepada pengirim yang mencoba mengirim ke alamat ini, dan email akan ditolak dan terpental.

Misalnya, jika saya ingin semua email yang masuk ke `alias@example.com` berhenti mengalir ke `user@gmail.com` dan ditolak serta terpental (misalnya gunakan tiga tanda seru):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Anda juga dapat menulis ulang alamat penerima yang diteruskan menjadi "nobody@forwardemail.net", yang akan mengarahkannya ke nobody seperti pada contoh di bawah ini.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Jika Anda menginginkan keamanan yang lebih baik, Anda juga dapat menghapus bagian ":user@gmail.com" (atau ":nobody@forwardemail.net"), dan hanya menyisakan "!!!alias" seperti pada contoh di bawah ini.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Bisakah saya meneruskan email ke beberapa penerima? {#can-i-forward-emails-to-multiple-recipients}

Ya, tentu saja. Cukup tentukan beberapa penerima dalam data <strong class="notranslate">TXT</strong> Anda.

Misalnya, jika saya ingin email yang ditujukan ke `hello@example.com` diteruskan ke `user+a@gmail.com` dan `user+b@gmail.com`, maka rekaman <strong class="notranslate">TXT</strong> saya akan terlihat seperti ini:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Atau, Anda dapat menentukannya dalam dua baris terpisah, seperti ini:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Terserah Anda!

### Bisakah saya memiliki beberapa penerima global yang dapat diakses semua orang? {#can-i-have-multiple-global-catch-all-recipients}

Ya, Anda bisa. Cukup tentukan beberapa penerima global yang dapat diakses semua orang dalam data <strong class="notranslate">TXT</strong> Anda.

Misalnya, jika saya ingin setiap email yang masuk ke `*@example.com` (tanda bintang berarti karakter pengganti alias catch-all) diteruskan ke `user+a@gmail.com` dan `user+b@gmail.com`, maka rekaman <strong class="notranslate">TXT</strong> saya akan terlihat seperti ini:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Atau, Anda dapat menentukannya dalam dua baris terpisah, seperti ini:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nama/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Jenis</th>
<th>Jawaban/Nilai</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", atau kosong</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Terserah Anda!

### Apakah ada batas maksimum jumlah alamat email yang dapat saya teruskan per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ya, batas defaultnya adalah 10. Ini BUKAN berarti Anda hanya dapat memiliki 10 alias pada nama domain Anda. Anda dapat memiliki alias sebanyak yang Anda inginkan (jumlahnya tidak terbatas). Artinya, Anda hanya dapat meneruskan satu alias ke 10 alamat email unik. Anda dapat memiliki `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (dari 1-10) – dan email apa pun ke `hello@example.com` akan diteruskan ke `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (dari 1-10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tips:
</strong>
<span>
Butuh lebih dari 10 penerima per alias? Kirimkan email kepada kami dan kami akan dengan senang hati meningkatkan batas akun Anda.
</span>
</div>

### Bisakah saya meneruskan email secara rekursif {#can-i-recursively-forward-emails}

Ya, Anda bisa, tetapi Anda tetap harus mematuhi batas maksimum. Jika Anda memiliki `hello:linus@example.com` dan `linus:user@gmail.com`, maka email ke `hello@example.com` akan diteruskan ke `linus@example.com` dan `user@gmail.com`. Harap dicatat bahwa kesalahan akan muncul jika Anda mencoba meneruskan email secara rekursif melebihi batas maksimum.

### Bisakah orang lain membatalkan pendaftaran atau mendaftarkan penerusan email saya tanpa izin saya? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Kami menggunakan verifikasi data MX dan <strong class="notranslate">TXT</strong>. Oleh karena itu, jika Anda menambahkan data MX dan <strong class="notranslate">TXT</strong> masing-masing layanan ini, Anda akan terdaftar. Jika Anda menghapusnya, Anda akan dibatalkan pendaftarannya. Anda memiliki kepemilikan atas domain dan manajemen DNS Anda, jadi jika seseorang memiliki akses ke sana, itu akan menjadi masalah.

### Bagaimana ini gratis {#how-is-it-free}

Forward Email menawarkan tingkatan gratis melalui kombinasi pengembangan sumber terbuka, infrastruktur yang efisien, dan paket berbayar opsional yang mendukung layanan tersebut.

Tingkat gratis kami didukung oleh:

1. **Pengembangan Sumber Terbuka**: Basis kode kami bersifat sumber terbuka, yang memungkinkan kontribusi komunitas dan operasi yang transparan.

2. **Infrastruktur yang Efisien**: Kami telah mengoptimalkan sistem kami untuk menangani penerusan email dengan sumber daya minimal.

3. **Paket Premium Berbayar**: Pengguna yang memerlukan fitur tambahan seperti pengiriman SMTP, penerimaan IMAP, atau opsi privasi yang ditingkatkan berlangganan paket berbayar kami.

4. **Batas Penggunaan Wajar**: Tingkat gratis memiliki kebijakan penggunaan wajar untuk mencegah penyalahgunaan.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Berapa batas ukuran email maksimum {#what-is-the-max-email-size-limit}

Kami menetapkan batas ukuran standar 50 MB, yang mencakup konten, header, dan lampiran. Perlu diketahui bahwa layanan seperti Gmail dan Outlook hanya mengizinkan batas ukuran 25 MB, dan jika Anda melebihi batas tersebut saat mengirim ke alamat penyedia tersebut, Anda akan menerima pesan kesalahan.

Kesalahan dengan kode respons yang tepat dikembalikan jika batas ukuran file terlampaui.

### Apakah Anda menyimpan log email {#do-you-store-logs-of-emails}

Tidak, kami tidak menulis ke disk atau menyimpan log – dengan [pengecualian kesalahan](#do-you-store-error-logs) dan [SMTP keluar](#do-you-support-sending-email-with-smtp) (lihat [Kebijakan Privasi](/privacy) kami).

Semuanya dilakukan dalam memori dan [kode sumber kami ada di GitHub](https://github.com/forwardemail).

### Apakah Anda menyimpan log kesalahan {#do-you-store-error-logs}

**Ya. Anda dapat mengakses log kesalahan di bawah [Akun Saya → Log](/my-account/logs) atau [Akun Saya → Domain](/my-account/domains).**

Per Februari 2023, kami menyimpan log kesalahan untuk kode respons SMTP `4xx` dan `5xx` selama 7 hari – yang berisi kesalahan SMTP, amplop, dan header email (kami **tidak** menyimpan isi email maupun lampirannya).

Log kesalahan memungkinkan Anda memeriksa email penting yang hilang dan mengurangi positif palsu spam untuk [domain Anda](/my-account/domains). Log kesalahan juga merupakan sumber daya yang bagus untuk men-debug masalah dengan [webhook email](#do-you-support-webhooks) (karena log kesalahan berisi respons titik akhir webhook).

Log kesalahan untuk [pembatasan laju](#do-you-have-rate-limiting) dan [daftar abu-abu](#do-you-have-a-greylist) tidak dapat diakses karena koneksi berakhir lebih awal (misalnya sebelum perintah `RCPT TO` dan `MAIL FROM` dapat dikirimkan).

Lihat [Kebijakan Privasi](/privacy) kami untuk wawasan lebih lanjut.

### Apakah Anda membaca email saya {#do-you-read-my-emails}

Tidak, sama sekali tidak. Lihat [Kebijakan Privasi](/privacy) kami.

Banyak layanan penerusan email lainnya menyimpan dan berpotensi membaca email Anda. Tidak ada alasan mengapa email yang diteruskan perlu disimpan ke penyimpanan disk – dan oleh karena itu, kami merancang solusi sumber terbuka pertama yang melakukan semuanya di dalam memori.

Kami percaya Anda berhak atas privasi dan kami sangat menghormatinya. Kode yang diterapkan ke server [perangkat lunak sumber terbuka di GitHub](https://github.com/forwardemail) demi transparansi dan membangun kepercayaan.

### Bisakah saya "mengirim email sebagai" di Gmail dengan {#can-i-send-mail-as-in-gmail-with-this} ini?

Ya! Kami telah menambahkan fitur ini mulai 2 Oktober 2018. Lihat [Cara Mengirim Email Menggunakan Gmail](#how-to-send-mail-as-using-gmail) di atas!

Anda juga harus menetapkan catatan SPF untuk Gmail dalam catatan <strong class="notranslate">TXT</strong> konfigurasi DNS Anda.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan Gmail (misalnya, Kirim Email Sebagai) atau G Suite, Anda perlu menambahkan <code>include:_spf.google.com</code> ke data <strong class="notranslate">TXT</strong> SPF Anda, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Bisakah saya "mengirim email sebagai" di Outlook dengan {#can-i-send-mail-as-in-outlook-with-this} ini?

Ya! Kami telah menambahkan fitur ini sejak 2 Oktober 2018. Silakan lihat dua tautan dari Microsoft di bawah ini:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Anda juga harus menetapkan catatan SPF untuk Outlook dalam catatan <strong class="notranslate">TXT</strong> konfigurasi DNS Anda.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Penting:
</strong>
<span>
Jika Anda menggunakan Microsoft Outlook atau Live.com, Anda perlu menambahkan <code>include:spf.protection.outlook.com</code> ke data <strong class="notranslate">TXT</strong> SPF Anda, misalnya:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Bisakah saya "mengirim email sebagai" di Apple Mail dan iCloud Mail dengan {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} ini?

Jika Anda pelanggan iCloud+, Anda dapat menggunakan domain khusus. [Layanan kami juga kompatibel dengan Apple Mail](#apple-mail).

Silakan lihat <https://support.apple.com/en-us/102540> untuk informasi lebih lanjut.

### Bisakah saya meneruskan email tanpa batas dengan {#can-i-forward-unlimited-emails-with-this} ini?

Ya, namun pengirim yang "relatif tidak dikenal" dibatasi hingga 100 koneksi per jam per nama host atau IP. Lihat bagian [Pembatasan Kecepatan](#do-you-have-rate-limiting) dan [Daftar abu-abu](#do-you-have-a-greylist) di atas.

Yang kami maksud dengan "relatif tidak dikenal" adalah pengirim yang tidak muncul dalam [daftar putih](#do-you-have-an-allowlist).

Jika batas ini terlampaui, kami akan mengirimkan kode respons 421 yang memberi tahu server email pengirim untuk mencoba lagi nanti.

### Apakah Anda menawarkan domain tak terbatas dengan satu harga {#do-you-offer-unlimited-domains-for-one-price}

Ya. Apa pun paket yang Anda pilih, Anda hanya akan membayar satu tarif bulanan – yang mencakup semua domain Anda.

### Metode pembayaran apa yang Anda terima? {#which-payment-methods-do-you-accept}

Forward Email menerima metode pembayaran satu kali atau bulanan/triwulanan/tahunan berikut ini:

1. **Kartu Kredit/Debit/Transfer Bank**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, dll.
2. **PayPal**: Hubungkan akun PayPal Anda untuk pembayaran mudah
3. **Mata Uang Kripto**: Kami menerima pembayaran melalui pembayaran stablecoin Stripe di jaringan Ethereum, Polygon, dan Solana

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Semua pembayaran diproses secara aman melalui Stripe atau PayPal. Rincian pembayaran Anda tidak akan pernah disimpan di server kami.

## Sumber Daya Tambahan {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Studi Kasus & Dokumentasi Pengembang](/blog/docs)
* [Sumber daya](/resources)
* [Panduan](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/